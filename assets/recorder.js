/* Boh recorder: records the student's voice in the browser, keeps it on the device, lets them play it,
   re-record it and download it. No server, no third-party code. If the microphone cannot be used it says why
   and calls onEscalate so the page can show the next step (Vocaroo, then "tell your teacher").
   Use:  BohRecorder.mount(element, { key:'r1', label:'Registra 1', maxSec:60, name:'', onChange:fn(hasTake), onEscalate:fn(reason) })
         BohRecorder.has('r1')   -> true when a take is saved on this device                                  */
(function () {
  'use strict';
  var DBN = 'boh_rec_v1', STORE = 'takes', FLAG = 'boh_rec_have_';
  var dbp = null;

  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function openDb() {
    if (dbp) return dbp;
    dbp = new Promise(function (ok, no) {
      if (!window.indexedDB) return no(new Error('noidb'));
      var r; try { r = indexedDB.open(DBN, 1); } catch (e) { return no(e); }
      r.onupgradeneeded = function () { r.result.createObjectStore(STORE); };
      r.onsuccess = function () { ok(r.result); };
      r.onerror = function () { no(r.error); };
      r.onblocked = function () { no(new Error('blocked')); };
    });
    return dbp;
  }
  function dbPut(k, v) { return openDb().then(function (db) { return new Promise(function (ok, no) { var t = db.transaction(STORE, 'readwrite'); t.objectStore(STORE).put(v, k); t.oncomplete = ok; t.onerror = function () { no(t.error); }; }); }); }
  function dbGet(k) { return openDb().then(function (db) { return new Promise(function (ok, no) { var q = db.transaction(STORE).objectStore(STORE).get(k); q.onsuccess = function () { ok(q.result || null); }; q.onerror = function () { no(q.error); }; }); }); }
  function dbDel(k) { return openDb().then(function (db) { return new Promise(function (ok, no) { var t = db.transaction(STORE, 'readwrite'); t.objectStore(STORE).delete(k); t.oncomplete = ok; t.onerror = function () { no(t.error); }; }); }); }
  function setFlag(k, on) { try { if (on) localStorage.setItem(FLAG + k, '1'); else localStorage.removeItem(FLAG + k); } catch (e) {} }
  function has(k) { try { return localStorage.getItem(FLAG + k) === '1'; } catch (e) { return false; } }

  function pickMime() {
    if (!window.MediaRecorder || !MediaRecorder.isTypeSupported) return '';
    var c = ['audio/webm;codecs=opus', 'audio/webm', 'audio/mp4', 'audio/ogg;codecs=opus', 'audio/ogg'];
    for (var i = 0; i < c.length; i++) { try { if (MediaRecorder.isTypeSupported(c[i])) return c[i]; } catch (e) {} }
    return '';
  }
  function extOf(m) { m = (m || '').toLowerCase(); return m.indexOf('mp4') > -1 ? 'm4a' : (m.indexOf('ogg') > -1 ? 'ogg' : 'webm'); }
  function who(opt) {
    var n = (opt && opt.name) || '';
    if (!n) { try { var p = JSON.parse(localStorage.getItem('boh_profile_v1') || 'null'); n = (p && p.bohName) || ''; } catch (e) {} }
    return String(n || 'student').replace(/[^A-Za-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || 'student';
  }

  var css = '' +
    '.brec{border:3px solid var(--vio,#6A4C93);background:var(--viobg,#EFE8F7);border-radius:18px;padding:16px;margin:12px 0;color:var(--ink,#2B2430)}' +
    '.brec h3{margin:0 0 6px;font-size:20px}.brec p{margin:6px 0;line-height:1.4}' +
    '.brec .brec-note{font-size:15px;color:var(--mut,#6B5F68);font-weight:700}' +
    '.brec .brec-row{display:flex;flex-wrap:wrap;gap:10px;align-items:center;margin-top:10px}' +
    '.brec button,.brec a.brec-b{min-height:52px;padding:12px 20px;border-radius:999px;border:0;font-family:inherit;font-weight:900;font-size:17px;line-height:1.1;cursor:pointer;background:var(--vio,#6A4C93);color:#fff;text-decoration:none;display:inline-flex;align-items:center;justify-content:center}' +
    '.brec button.rec{background:#C62828}.brec button.ghost,.brec a.ghost{background:var(--bg,#fff);color:var(--ink,#2B2430);border:2px solid var(--line,#E3D8DC)}' +
    '.brec button:focus-visible,.brec a:focus-visible{outline:3px solid var(--ink,#2B2430);outline-offset:2px}' +
    '.brec-meter{height:16px;border-radius:9px;background:var(--bg,#fff);border:2px solid var(--line,#E3D8DC);overflow:hidden;margin-top:10px}' +
    '.brec-meter i{display:block;height:100%;width:0;background:#2E9E5B;transition:width .08s}' +
    '.brec-time{font-family:inherit;font-weight:900;font-size:26px;line-height:1;font-variant-numeric:tabular-nums}' +
    '.brec audio{width:100%;margin-top:10px}' +
    '.brec-warn{background:var(--trybg,#FBF0DD);border:2px solid var(--try,#B7802A);border-radius:12px;padding:10px 12px;font-weight:800;margin-top:10px}' +
    '.brec-dot{display:inline-block;width:14px;height:14px;border-radius:50%;background:#C62828;margin-right:8px;animation:brecp 1s infinite}' +
    '@keyframes brecp{50%{opacity:.25}}@media (prefers-reduced-motion:reduce){.brec-dot{animation:none}}';
  function addCss() { if (document.getElementById('brec-css')) return; var s = document.createElement('style'); s.id = 'brec-css'; s.textContent = css; document.head.appendChild(s); }

  function mount(el, opt) {
    if (!el) return null;
    addCss();
    opt = opt || {};
    var key = opt.key || 'take', maxSec = opt.maxSec || 60, label = opt.label || 'Your recording';
    var st = { phase: 'idle', url: '', mime: '', ms: 0, fails: 0, stream: null, mr: null, chunks: [], t0: 0, tick: 0, ac: null, an: null, raf: 0, peak: 0, quiet: 0, dead: false, stopWhy: '' };

    function say(h) { el.innerHTML = '<div class="brec" role="group" aria-label="' + esc(label) + '">' + h + '</div>'; }
    function note(msg) { return '<p class="brec-note">' + msg + '</p>'; }
    function fmt(ms) { var s = Math.floor(ms / 1000); return Math.floor(s / 60) + ':' + ('0' + (s % 60)).slice(-2); }
    function change() { var h = has(key); try { if (opt.onChange) opt.onChange(h); } catch (e) {} }
    function esca(why) { try { if (opt.onEscalate) opt.onEscalate(why); } catch (e) {} }
    function cleanup() {
      cancelAnimationFrame(st.raf); clearInterval(st.tick);
      try { if (st.ac && st.ac.state !== 'closed') st.ac.close(); } catch (e) {}
      if (st.stream) { try { st.stream.getTracks().forEach(function (t) { t.stop(); }); } catch (e) {} }
      st.ac = st.an = st.stream = null;
    }
    function bind() {
      var b = el.querySelectorAll('[data-r]');
      for (var i = 0; i < b.length; i++) b[i].addEventListener('click', onBtn);
    }
    function onBtn(e) {
      var a = e.currentTarget.getAttribute('data-r');
      if (a === 'start') start();
      else if (a === 'stop') { st.stopWhy = 'user'; stop(); }
      else if (a === 'again') { show('idle'); }
      else if (a === 'download') download();
      else if (a === 'delete') { dbDel(key).then(function () {}, function () {}); setFlag(key, false); freeUrl(); change(); show('idle'); }
    }
    function freeUrl() { if (st.url) { try { URL.revokeObjectURL(st.url); } catch (e) {} st.url = ''; } }

    function show(ph, extra) {
      st.phase = ph;
      if (ph === 'idle') {
        say('<h3>' + esc(label) + '</h3>' +
          '<p>Press <b>Record</b> and read your sentences out loud. You can record again as many times as you want.</p>' +
          '<div class="brec-row"><button class="rec" data-r="start">Record</button></div>' +
          note('Your browser will ask to use the microphone. Tap <b>Allow</b>. Your teacher listens to your recording. The game does not score how you sound.'));
      } else if (ph === 'rec') {
        say('<h3>' + esc(label) + '</h3><p><span class="brec-dot"></span><span class="brec-time" id="brec-t">0:00</span></p>' +
          '<div class="brec-meter" aria-hidden="true"><i id="brec-m"></i></div><div id="brec-q"></div>' +
          '<div class="brec-row"><button class="ghost" data-r="stop">Stop</button></div>' +
          note('Up to ' + maxSec + ' seconds. The green bar moves when it hears you.'));
      } else if (ph === 'have') {
        say('<h3>' + esc(label) + '</h3><p><b>Saved on this device.</b> Listen to it. If you like it, you are done here.</p>' +
          '<audio controls preload="metadata" src="' + esc(st.url) + '"></audio>' +
          (extra || '') +
          '<div class="brec-row"><button class="ghost" data-r="again">Record again</button><button data-r="download">Download</button><button class="ghost" data-r="delete">Delete</button></div>' +
          note('Download gives you a file. You can turn it in on Google Classroom. The file is named with your name.'));
      } else if (ph === 'bad') {
        say('<h3>' + esc(label) + '</h3>' + extra +
          '<div class="brec-row"><button class="rec" data-r="start">Try again</button></div>');
      }
      bind();
    }

    function fail(reason, msg) {
      cleanup(); st.fails++;
      var bad = '<div class="brec-warn">' + msg + '</div>';
      show('bad', bad + (st.fails >= 2 || reason === 'nomic' || reason === 'denied' || reason === 'unsupported'
        ? '<p class="brec-note">Next step: use the Vocaroo box below. It works in any browser.</p>' : ''));
      if (st.fails >= 2 || reason === 'nomic' || reason === 'denied' || reason === 'unsupported') esca(reason);
    }

    function start() {
      if (st.dead) return;
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia || !window.MediaRecorder) {
        return fail('unsupported', 'This browser cannot record inside the game.');
      }
      st.chunks = []; st.peak = 0; st.quiet = 0; st.stopWhy = '';
      navigator.mediaDevices.getUserMedia({ audio: true }).then(function (stream) {
        if (st.dead) { stream.getTracks().forEach(function (t) { t.stop(); }); return; }
        st.stream = stream;
        var mime = pickMime(), mr;
        try { mr = mime ? new MediaRecorder(stream, { mimeType: mime }) : new MediaRecorder(stream); } catch (e) { return fail('unsupported', 'This browser cannot record inside the game.'); }
        st.mr = mr; st.mime = mr.mimeType || mime || 'audio/webm';
        mr.ondataavailable = function (ev) {
          if (ev.data && ev.data.size) {
            st.chunks.push(ev.data);
            dbPut(key, { chunks: st.chunks.slice(), mime: st.mime, ms: Date.now() - st.t0, done: false }).catch(function () {});
          }
        };
        mr.onerror = function () { fail('recerr', 'The recording stopped by itself.'); };
        mr.onstop = finish;
        show('rec');
        // volume meter (optional; the recording works without it)
        try {
          var AC = window.AudioContext || window.webkitAudioContext;
          if (AC) {
            st.ac = new AC(); var src = st.ac.createMediaStreamSource(stream); st.an = st.ac.createAnalyser(); st.an.fftSize = 512; src.connect(st.an);
            var buf = new Uint8Array(st.an.fftSize), m = el.querySelector('#brec-m');
            (function loop() {
              if (!st.an) return;
              st.an.getByteTimeDomainData(buf); var mx = 0;
              for (var i = 0; i < buf.length; i++) { var v = Math.abs(buf[i] - 128) / 128; if (v > mx) mx = v; }
              if (mx > st.peak) st.peak = mx;
              if (m) m.style.width = Math.min(100, Math.round(mx * 220)) + '%';
              st.raf = requestAnimationFrame(loop);
            })();
          }
        } catch (e) { st.an = null; }
        st.t0 = Date.now();
        try { mr.start(1000); } catch (e) { return fail('unsupported', 'This browser cannot record inside the game.'); }
        st.tick = setInterval(function () {
          var ms = Date.now() - st.t0, t = el.querySelector('#brec-t'); if (t) t.textContent = fmt(ms);
          var q = el.querySelector('#brec-q');
          if (st.an && ms > 3000 && st.peak < 0.02 && q) q.innerHTML = '<div class="brec-warn">I cannot hear you yet. Speak louder or move closer to the microphone.</div>';
          else if (q && q.firstChild && st.peak >= 0.02) q.innerHTML = '';
          if (ms >= maxSec * 1000) { st.stopWhy = 'max'; stop(); }
        }, 250);
      }).catch(function (err) {
        var n = err && err.name || '';
        if (n === 'NotAllowedError' || n === 'SecurityError' || n === 'PermissionDeniedError') fail('denied', 'The microphone is blocked. Tap the lock or microphone icon next to the web address, choose <b>Allow</b>, then press Try again. School Chromebooks may block it.');
        else if (n === 'NotFoundError' || n === 'DevicesNotFoundError' || n === 'OverconstrainedError') fail('nomic', 'No microphone was found on this device.');
        else fail('nomic', 'The microphone did not start.');
      });
    }
    function stop() { try { if (st.mr && st.mr.state !== 'inactive') st.mr.stop(); else finish(); } catch (e) { finish(); } }
    function finish() {
      clearInterval(st.tick);
      var ms = Date.now() - st.t0, silent = st.an ? st.peak < 0.02 : false;
      var chunks = st.chunks.slice(), mime = st.mime;
      cleanup();
      if (!chunks.length) return fail('empty', 'Nothing was recorded.');
      if (silent) {
        return fail('silent', 'I could not hear any sound. Check that the microphone is not muted, then try again.');
      }
      var blob = new Blob(chunks, { type: mime });
      dbPut(key, { chunks: chunks, mime: mime, ms: ms, done: true }).then(function () { setFlag(key, true); }, function () { setFlag(key, false); })
        .then(function () { st.fails = 0; freeUrl(); st.url = URL.createObjectURL(blob); st.ms = ms; st.blob = blob; show('have', st.stopWhy === 'max' ? '<div class="brec-warn">That was ' + maxSec + ' seconds, the longest take. It is saved.</div>' : ''); change(); });
    }
    function download() {
      if (!st.blob && !st.url) return;
      var d = new Date(), ds = d.getFullYear() + ('0' + (d.getMonth() + 1)).slice(-2) + ('0' + d.getDate()).slice(-2);
      var a = document.createElement('a'); a.href = st.url; a.download = 'Boh-' + who(opt) + '-' + key + '-' + ds + '.' + extOf(st.mime);
      document.body.appendChild(a); a.click(); setTimeout(function () { a.remove(); }, 100);
    }

    // restore a saved take
    show('idle');
    if (has(key)) {
      dbGet(key).then(function (rec) {
        if (st.dead || !rec || !rec.chunks || !rec.chunks.length || st.phase !== 'idle') return;
        st.mime = rec.mime; st.blob = new Blob(rec.chunks, { type: rec.mime }); st.url = URL.createObjectURL(st.blob); st.ms = rec.ms || 0;
        show('have');
      }, function () {});
    } else {
      // a take that was cut off (page closed while recording) can still be played
      dbGet(key).then(function (rec) {
        if (st.dead || !rec || !rec.chunks || !rec.chunks.length || st.phase !== 'idle') return;
        st.mime = rec.mime; st.blob = new Blob(rec.chunks, { type: rec.mime }); st.url = URL.createObjectURL(st.blob); st.ms = rec.ms || 0;
        setFlag(key, true); show('have', '<div class="brec-warn">This take was cut off, but what was recorded is saved.</div>'); change();
      }, function () {});
    }
    return { destroy: function () { st.dead = true; try { if (st.mr) { st.mr.onstop = null; st.mr.ondataavailable = null; if (st.mr.state !== 'inactive') st.mr.stop(); } } catch (e) {} cleanup(); freeUrl(); } };
  }

  window.BohRecorder = { mount: mount, has: has };
})();
