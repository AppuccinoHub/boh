/* Boh · save code for the whole site (Italiano 1, 2, 3, 4, AP).
   Created by Assunta Scotto, 2026. Not for redistribution.
   - Backup code / file: carries every level on this site. Works offline, nothing leaves the Chromebook.
   - Name + short code (LUCIA · gatto-luna-7): only when BOH_CLOUD_URL is set (the online save box). */
(function () {
  'use strict';
  var BOH_CLOUD_URL = ''; // e.g. 'https://boh-save.<account>.workers.dev' once the save box is set up and approved
  var KEY_RE = /^(boh|essereAvere|volereDovere)/;
  var CLOUD_KEY = 'boh_cloud';
  // round-in-progress fields: they rebuild themselves, so they stay out of the code
  var DROP = ['queue', 'qIndex', 'roundActive', 'missed', 'missedNow', 'zooSession', 'catStats', 'provaLog', 'lsIt', 'tBuilt',
    'typed', 'formOptions', 'formSelected', 'selected', 'revealed', 'overlay', 'overlayBack', 'screen', 'fr', 'lastTyped',
    'shopMsg', 'newBadges', 'glossWord', 'glossMean', 'paccoItem', 'paccoBonus', 'tabOpen', 'bbStruck', 'bbPick', 'bbPending',
    'bbRetry', 'lastEarn', 'fiammaNote', 'resetTyped', 'pinDraft', 'tripPin', 'loadDraft', 'saveCode', 'nameDraft', 'lsView',
    'lsCur', 'lsI', 'lsStopEarn', 'pvAsk', 'provaRetry', 'provaTry1'];

  function slim(o) {
    if (!o || typeof o !== 'object' || Array.isArray(o)) return o;
    var r = {};
    for (var k in o) if (DROP.indexOf(k) === -1) r[k] = o[k];
    if (r.units && typeof r.units === 'object') { var u = {}; for (var x in r.units) u[x] = slim(r.units[x]); r.units = u; }
    return r;
  }
  function gather() {
    var d = {};
    for (var i = 0; i < localStorage.length; i++) {
      var k = localStorage.key(i);
      if (!KEY_RE.test(k)) continue;
      var v = localStorage.getItem(k), p = null;
      try { p = JSON.parse(v); } catch (e) {}
      d[k] = p && typeof p === 'object' ? JSON.stringify(slim(p)) : v;
    }
    return d;
  }
  function bohName() {
    var tries = ['boh_profile_v1', 'bohItaliano3_v2', 'bohItaliano2_v2', 'essereAvereRipasso_v1', 'bohItaliano1Ripasso_v1', 'boh_aiutami'];
    for (var i = 0; i < tries.length; i++) {
      try { var o = JSON.parse(localStorage.getItem(tries[i]) || 'null'); if (o && (o.bohName || o.name)) return String(o.bohName || o.name); } catch (e) {}
    }
    return '';
  }
  function levelsIn(d) {
    var L = [];
    if (d.bohItaliano1Ripasso_v1) L.push('Italiano 1');
    if (d.essereAvereRipasso_v1 || d.bohItaliano2_v2) L.push('Italiano 2');
    if (d.bohItaliano3_v2) L.push('Italiano 3');
    if (d.boh_aiutami) L.push('Italiano 4');
    Object.keys(d).forEach(function (k) { if (/^boh_ap/i.test(k) && L.indexOf('AP') === -1) L.push('AP'); });
    return L;
  }

  // ---- packing: JSON -> deflate -> base64url ----
  function b64u(bytes) { var s = ''; for (var i = 0; i < bytes.length; i += 0x8000) s += String.fromCharCode.apply(null, bytes.subarray(i, i + 0x8000)); return btoa(s).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, ''); }
  function unb64u(t) { t = t.replace(/-/g, '+').replace(/_/g, '/'); while (t.length % 4) t += '='; var s = atob(t), b = new Uint8Array(s.length); for (var i = 0; i < s.length; i++) b[i] = s.charCodeAt(i); return b; }
  function pipe(bytes, stream) { return new Response(new Blob([bytes]).stream().pipeThrough(stream)).arrayBuffer().then(function (b) { return new Uint8Array(b); }); }
  function pack(obj) {
    var bytes = new TextEncoder().encode(JSON.stringify(obj));
    if (window.CompressionStream) return pipe(bytes, new CompressionStream('deflate-raw')).then(function (z) { return 'BOHZ.' + b64u(z); });
    return Promise.resolve('BOHJ.' + b64u(bytes));
  }
  function unpack(code) {
    var m = /BOH([ZJ])\.([A-Za-z0-9_-]+)/.exec(String(code || '').replace(/\s+/g, ''));
    if (!m) return Promise.reject(new Error('shape'));
    var bytes;
    try { bytes = unb64u(m[2]); } catch (e) { return Promise.reject(new Error('shape')); }
    var p = m[1] === 'Z' ? (window.DecompressionStream ? pipe(bytes, new DecompressionStream('deflate-raw')) : Promise.reject(new Error('browser'))) : Promise.resolve(bytes);
    return p.then(function (b) { var o = JSON.parse(new TextDecoder().decode(b)); if (!o || o.v !== 1 || !o.d) throw new Error('shape'); return o; });
  }
  function makeBundle() { return { v: 1, t: Date.now(), name: bohName(), d: gather() }; }
  function restore(o, cloud) {
    var kill = [];
    for (var i = 0; i < localStorage.length; i++) { var k = localStorage.key(i); if (KEY_RE.test(k)) kill.push(k); }
    kill.forEach(function (k) { localStorage.removeItem(k); });
    for (var key in o.d) if (KEY_RE.test(key)) localStorage.setItem(key, o.d[key]);
    if (cloud) localStorage.setItem(CLOUD_KEY, JSON.stringify(cloud));
    try { sessionStorage.setItem('boh_restored', o.name || '1'); } catch (e) {}
    location.reload();
  }

  // ---- online save box (name + short code) ----
  function cloudOn() { return !!BOH_CLOUD_URL; }
  function cloudMine() { try { return JSON.parse(localStorage.getItem(CLOUD_KEY) || 'null'); } catch (e) { return null; } }
  function post(path, body) {
    return fetch(BOH_CLOUD_URL.replace(/\/$/, '') + path, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
      .then(function (r) { return r.json().then(function (j) { if (!r.ok) throw new Error(j.error || 'server'); return j; }); });
  }
  function shortCode(c) { return c ? String(c.name).toUpperCase() + ' · ' + c.code : ''; }

  // ---- UI ----
  var CSS = [
    '.bs-ov{position:fixed;inset:0;z-index:99999;background:rgba(20,14,24,.62);display:flex;align-items:flex-start;justify-content:center;overflow:auto;padding:24px 16px}',
    '.bs{--bs-bg:#FFFFFF;--bs-2:#F5EFEF;--bs-line:#DDD0D5;--bs-ink:#2B2430;--bs-mut:#6B5F68;--bs-acc:#C1654F;--bs-on:#FFFFFF;--bs-vio:#6A4C93;--bs-vsoft:#EDE6F5;--bs-ok:#1E7F4A;--bs-oksoft:#DDF1E5;--bs-bad:#B3261E;--bs-badsoft:#F8E0DC;',
    'width:100%;max-width:520px;box-sizing:border-box;background:var(--bs-bg);color:var(--bs-ink);border-radius:22px;padding:22px;display:flex;flex-direction:column;gap:14px;font:15px/1.45 Manrope,system-ui,sans-serif;box-shadow:0 20px 60px rgba(0,0,0,.35)}',
    '.bs.dark{--bs-bg:#251C2A;--bs-2:#2E2533;--bs-line:#3D3243;--bs-ink:#F2EAF0;--bs-mut:#C0B2C1;--bs-acc:#E88A6C;--bs-on:#241318;--bs-vio:#B79AE0;--bs-vsoft:#3A2E4A;--bs-ok:#7FD4A0;--bs-oksoft:#1F3A2B;--bs-bad:#FF9D8F;--bs-badsoft:#4A2323}',
    '.bs *{box-sizing:border-box}',
    '.bs h2{margin:0;font:800 26px/1.1 "Bricolage Grotesque",system-ui,sans-serif}',
    '.bs p{margin:0}',
    '.bs .mut{color:var(--bs-mut);font-size:14px}',
    '.bs-tabs{display:grid;grid-template-columns:1fr 1fr;gap:6px;padding:4px;border-radius:14px;background:var(--bs-2)}',
    '.bs-tabs button{all:unset;cursor:pointer;text-align:center;padding:10px;border-radius:11px;font-weight:800;min-height:24px}',
    '.bs-tabs button[aria-selected="true"]{background:var(--bs-bg);box-shadow:0 1px 3px rgba(0,0,0,.15)}',
    '.bs-sec{display:flex;flex-direction:column;gap:10px;padding:14px;border-radius:16px;border:2px solid var(--bs-line)}',
    '.bs-sec h3{margin:0;font:800 18px/1.2 "Bricolage Grotesque",system-ui,sans-serif}',
    '.bs-btn{all:unset;box-sizing:border-box;cursor:pointer;text-align:center;padding:13px 18px;min-height:48px;border-radius:999px;background:var(--bs-acc);color:var(--bs-on);font-weight:800;font-size:16px}',
    '.bs-btn2{all:unset;box-sizing:border-box;cursor:pointer;text-align:center;padding:11px 16px;min-height:46px;border-radius:999px;border:2px solid var(--bs-acc);color:var(--bs-ink);font-weight:800;font-size:15px}',
    '.bs-btn:focus-visible,.bs-btn2:focus-visible,.bs-tabs button:focus-visible,.bs-x:focus-visible{outline:3px solid var(--bs-vio);outline-offset:2px}',
    '.bs-row{display:flex;gap:8px;flex-wrap:wrap}',
    '.bs-row>*{flex:1 1 150px}',
    '.bs textarea,.bs input{width:100%;font:600 14px/1.4 ui-monospace,Menlo,monospace;padding:10px 12px;border-radius:12px;border:2px solid var(--bs-line);background:var(--bs-2);color:var(--bs-ink);resize:vertical}',
    '.bs input{font:700 17px Manrope,system-ui,sans-serif}',
    '.bs label{display:flex;flex-direction:column;gap:4px;font-weight:800;font-size:14px}',
    '.bs-shot{padding:14px;border-radius:16px;background:var(--bs-acc);color:var(--bs-on);font-weight:800;text-align:center;animation:bsPulse 1.6s ease-in-out infinite}',
    '.bs-shot b{display:block;font:800 21px/1.15 "Bricolage Grotesque",system-ui,sans-serif}',
    '@keyframes bsPulse{0%,100%{transform:scale(1);box-shadow:0 0 0 0 rgba(193,101,79,.55)}50%{transform:scale(1.02);box-shadow:0 0 0 10px rgba(193,101,79,0)}}',
    '@media (prefers-reduced-motion:reduce){.bs-shot{animation:none}}',
    '.bs-code{font:800 26px/1.2 "Bricolage Grotesque",system-ui,sans-serif;text-align:center;padding:14px;border-radius:14px;background:var(--bs-vsoft);color:var(--bs-vio);letter-spacing:.02em;word-break:break-word}',
    '.bs-msg{padding:10px 12px;border-radius:12px;font-weight:800;font-size:14px}',
    '.bs-msg.ok{background:var(--bs-oksoft);color:var(--bs-ok)}',
    '.bs-msg.no{background:var(--bs-badsoft);color:var(--bs-bad)}',
    '.bs-x{all:unset;cursor:pointer;align-self:flex-end;font-weight:800;padding:6px 12px;border-radius:999px;border:2px solid var(--bs-line)}',
    '.bs-top{display:flex;justify-content:space-between;align-items:flex-start;gap:12px}',
    '.bs-small{font-size:12.5px;color:var(--bs-mut)}',
    '.bs-back{position:fixed;left:50%;bottom:18px;transform:translateX(-50%);z-index:99998;padding:12px 18px;border-radius:999px;background:#1E7F4A;color:#fff;font:800 15px Manrope,system-ui,sans-serif;box-shadow:0 8px 24px rgba(0,0,0,.3)}'
  ].join('\n');
  function isDark() {
    var t = null; try { t = localStorage.getItem('boh_theme'); } catch (e) {}
    var el = document.querySelector('[data-theme]'); var a = el && el.getAttribute('data-theme');
    if (a === 'dark' || a === 'light') return a === 'dark';
    if (t === 'dark' || t === 'light') return t === 'dark';
    return !!(window.matchMedia && matchMedia('(prefers-color-scheme: dark)').matches);
  }
  function esc(t) { return String(t == null ? '' : t).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function css() { if (document.getElementById('bs-css')) return; var s = document.createElement('style'); s.id = 'bs-css'; s.textContent = CSS; document.head.appendChild(s); }

  var ov = null, lastFocus = null;
  function close() { if (ov) { ov.remove(); ov = null; document.removeEventListener('keydown', onKey, true); if (lastFocus && lastFocus.focus) lastFocus.focus(); } }
  function onKey(e) { if (e.key === 'Escape') { e.stopPropagation(); close(); } }
  function open(tab) {
    css(); close(); lastFocus = document.activeElement;
    ov = document.createElement('div'); ov.className = 'bs-ov';
    ov.innerHTML = '<div class="bs' + (isDark() ? ' dark' : '') + '" role="dialog" aria-modal="true" aria-labelledby="bs-title"></div>';
    ov.addEventListener('click', function (e) { if (e.target === ov) close(); });
    document.body.appendChild(ov); document.addEventListener('keydown', onKey, true);
    render(tab === 'load' ? 'load' : 'save');
  }
  function box() { return ov.querySelector('.bs'); }
  function $(sel) { return ov.querySelector(sel); }

  function render(tab) {
    var name = bohName(), mine = cloudMine();
    var head = '<div class="bs-top"><div><h2 id="bs-title">Il tuo Boh</h2><p class="mut">' + (name ? 'Boh: <b>' + esc(name) + '</b> · ' : '') + 'One save for every level: Italiano 1, 2, 3, 4 and AP.</p></div><button class="bs-x" aria-label="Chiudi">✕</button></div>' +
      '<div class="bs-tabs" role="tablist"><button role="tab" data-t="save" aria-selected="' + (tab === 'save') + '">💾 Salva</button><button role="tab" data-t="load" aria-selected="' + (tab === 'load') + '">📂 Carica</button></div>';
    var body = '';
    if (tab === 'save') {
      if (cloudOn()) body += '<div class="bs-sec"><h3>Nome + codice (online)</h3><p class="mut">The easy way: your Boh name and a short code. Type them on any Chromebook to get everything back.</p>' +
        (mine ? '<div class="bs-code">' + esc(shortCode(mine)) + '</div>' : '') +
        '<button class="bs-btn" id="bs-cloud-save">' + (mine ? 'Salva di nuovo online' : 'Crea il mio codice') + '</button><div id="bs-cloud-out"></div></div>';
      body += '<div class="bs-sec"><h3>' + (cloudOn() ? 'Backup file' : 'Salva il tuo Boh') + '</h3><p class="mut">One code saves your Boh, its Boh Cashi and every level.</p>' +
        '<div class="bs-row"><button class="bs-btn" id="bs-copy">📋 Copy my save code</button><button class="bs-btn2" id="bs-dl">⬇ Save as a file</button></div>' +
        '<p class="bs-small">Easiest: copy the code, then paste it into a Google Doc (Ctrl + V). To load it: Carica il mio Boh → paste the code.</p><div id="bs-out"></div></div>';
    } else {
      if (cloudOn()) body += '<div class="bs-sec"><h3>Nome + codice</h3><label>Nome del tuo Boh<input id="bs-n" autocomplete="off" maxlength="16" value="' + esc(mine ? mine.name : name) + '"></label>' +
        '<label>Codice<input id="bs-c" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="gatto-luna-7" value=""></label><button class="bs-btn" id="bs-cloud-load">Carica</button><div id="bs-cloud-msg"></div></div>';
      body += '<div class="bs-sec"><h3>Carica il mio Boh</h3><label>📋 Paste your save code here<textarea id="bs-in" rows="3" placeholder="BOHZ.…"></textarea></label><button class="bs-btn" id="bs-load">Carica</button>' +
        '<p class="bs-small">Saved a file instead? <button class="bs-btn2" id="bs-file-btn">📄 Choose my save file</button></p><input type="file" id="bs-file" accept=".txt,text/plain" hidden><div id="bs-msg"></div>' +
        '<p class="bs-small">Loading replaces the Boh on this Chromebook with the saved one, in every level.</p></div>';
    }
    box().innerHTML = head + body;
    $('.bs-x').onclick = close;
    ov.querySelectorAll('[data-t]').forEach(function (b) { b.onclick = function () { render(b.getAttribute('data-t')); }; });
    if (tab === 'save') wireSave(); else wireLoad();
    var f = box().querySelector('.bs-btn,.bs-btn2'); if (f) f.focus();
  }
  function shotBanner(what) {
    return '<div class="bs-shot" role="alert"><b>📸 FAI UNO SCREENSHOT ADESSO!</b>' + what + '<br><span style="font-weight:700">Chromebook: Ctrl + Show windows key (▭▯)</span></div>';
  }
  function wireSave() {
    var bundle = makeBundle(), codeP = pack(bundle), nm = (bundle.name || 'Boh').replace(/[^A-Za-z0-9À-ÿ]+/g, '');
    $('#bs-dl').onclick = function () {
      var d = new Date(), stamp = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate(), fname = 'Boh-' + nm + '-' + stamp + '.txt';
      var make = function (code) {
        return 'Boh · save file\nBoh: ' + (bundle.name || '') + '\nLevels: ' + levelsIn(bundle.d).join(', ') + '\nSaved: ' + d.toLocaleString() +
          '\nTo load: open appuccinohub.github.io/boh → Carica il mio Boh → choose this file.\n\n' + code + '\n';
      };
      var saved = function (msg) {
        $('#bs-out').innerHTML = msg + '<div class="bs-msg ok">Saved: ' + esc(levelsIn(bundle.d).join(', ') || 'your Boh') + '.</div>';
      };
      // Plan B: a download link. The file lives inside the link (about 1 KB), so it never expires,
      // and a visible copy of the link stays on screen in case the browser blocks the first try.
      var linkSave = function () {
        codeP.then(function (code) {
          var href = 'data:text/plain;charset=utf-8,' + encodeURIComponent(make(code));
          var a = document.createElement('a'); a.href = href; a.download = fname;
          document.body.appendChild(a); a.click(); setTimeout(function () { a.remove(); }, 1500);
          saved('<div class="bs-shot" role="alert"><b>&#128194; PUT THE FILE IN YOUR GOOGLE DRIVE</b>Open Files &rarr; Downloads &rarr; drag it to My Drive.</div>' +
                '<p class="bs-small">Nothing downloaded? <a download="' + esc(fname) + '" href="' + href + '">Tap here to save the file</a>.</p>');
        });
      };
      // Plan A (Chrome on Chromebooks and computers): Boh writes the file itself into the folder you pick,
      // so the browser's download list never gets in the way. On a Chromebook you can pick Google Drive directly.
      if (window.showSaveFilePicker) {
        var pick;
        try { pick = window.showSaveFilePicker({ suggestedName: fname, types: [{ description: 'Boh save file', accept: { 'text/plain': ['.txt'] } }] }); } catch (e) { linkSave(); return; }
        pick.then(function (h) {
          return codeP.then(function (code) { return h.createWritable().then(function (w) { return w.write(make(code)).then(function () { return w.close(); }); }); });
        }).then(function () {
          saved('<div class="bs-shot" role="alert"><b>&#9989; SAVED!</b>Your Boh is in the folder you picked. Pick Google Drive to keep it safe.</div>');
        }, function (e) { if (e && e.name === 'AbortError') return; linkSave(); });
      } else linkSave();
    };
    var codeNow = ''; codeP.then(function (c) { codeNow = c; });
    if ($('#bs-copy')) $('#bs-copy').onclick = function () {
      var go = function (code) {
        var ok = function () { $('#bs-out').innerHTML = '<div class="bs-shot" role="alert"><b>✅ COPIED!</b>Now open your Google Doc and paste it: Ctrl + V (Mac: Cmd + V).</div>' +
          '<textarea rows="3" readonly>' + esc(code) + '</textarea>'; };
        try { navigator.clipboard.writeText(code).then(ok, function () { showRaw(code); }); } catch (e) { showRaw(code); }
      };
      if (codeNow) go(codeNow); else codeP.then(go);
    };
    function showRaw(code) { $('#bs-out').innerHTML = '<textarea rows="4" readonly>' + esc(code) + '</textarea><div class="bs-small">Select all (Ctrl + A), copy (Ctrl + C), then paste it into your Google Doc.</div>'; var t = $('#bs-out textarea'); t.focus(); t.select(); }
    var cs = $('#bs-cloud-save');
    if (cs) cs.onclick = function () {
      var mine = cloudMine(), out = $('#bs-cloud-out'); cs.disabled = true; out.innerHTML = '<div class="bs-msg">Salvo…</div>';
      codeP.then(function (code) { return post('/save', { name: mine ? mine.name : (bundle.name || 'Boh'), code: mine ? mine.code : '', data: code }); })
        .then(function (r) {
          localStorage.setItem(CLOUD_KEY, JSON.stringify({ name: r.name, code: r.code }));
          out.innerHTML = '<div class="bs-code">' + esc(shortCode(r)) + '</div>' + shotBanner('Your code: ' + esc(shortCode(r)) + '. Also write it in your notebook.');
          cs.disabled = false; fillCodes();
        }, function () { cs.disabled = false; out.innerHTML = '<div class="bs-msg no">The online save box did not answer. Use the backup file for now.</div>'; });
    };
  }
  function doLoad(code, msgEl, cloud) {
    msgEl.innerHTML = '<div class="bs-msg">Controllo…</div>';
    unpack(code).then(function (o) {
      var lv = levelsIn(o.d);
      msgEl.innerHTML = '<div class="bs-msg ok">Found ' + esc(o.name || 'a Boh') + (lv.length ? ' · ' + esc(lv.join(', ')) : '') + '.</div>' +
        '<div class="bs-row"><button class="bs-btn" id="bs-yes">Sì, carica questo Boh</button><button class="bs-btn2" id="bs-no">Annulla</button></div>';
      $('#bs-yes').onclick = function () { restore(o, cloud); };
      $('#bs-no').onclick = function () { msgEl.innerHTML = ''; };
    }, function (e) {
      msgEl.innerHTML = '<div class="bs-msg no">' + (e && e.message === 'browser' ? 'This browser cannot open the code. Use Chrome.' : 'That doesn’t look like a Boh save. Copy the whole code, from BOHZ. to the end.') + '</div>';
    });
  }
  function wireLoad() {
    $('#bs-load').onclick = function () { doLoad($('#bs-in').value, $('#bs-msg')); };
    $('#bs-file-btn').onclick = function () { $('#bs-file').click(); };
    $('#bs-file').onchange = function () { var f = this.files && this.files[0]; if (!f) return; f.text().then(function (t) { doLoad(t, $('#bs-msg')); }); };
    var cl = $('#bs-cloud-load');
    if (cl) cl.onclick = function () {
      var n = $('#bs-n').value.trim(), c = $('#bs-c').value.trim().toLowerCase(), m = $('#bs-cloud-msg');
      if (!n || !c) { m.innerHTML = '<div class="bs-msg no">Type your Boh name and your code.</div>'; return; }
      m.innerHTML = '<div class="bs-msg">Cerco…</div>';
      post('/load', { name: n, code: c }).then(function (r) {
        doLoad(r.data, m, { name: r.name, code: r.code });
      }, function () { m.innerHTML = '<div class="bs-msg no">Name and code don’t match. Check your screenshot, or ask la prof: she can look it up.</div>'; });
    };
  }

  // the short code on La Prova cards (when the online box is on)
  function fillCodes() {
    var mine = cloudOn() ? cloudMine() : null;
    document.querySelectorAll('[data-bohsave-code]').forEach(function (el) {
      var want = mine ? 'Save code: ' + shortCode(mine) : el.getAttribute('data-bohsave-code');
      if (el.textContent !== want) el.textContent = want;
    });
  }
  document.addEventListener('click', function (e) {
    var b = e.target && e.target.closest && e.target.closest('[data-bohsave]');
    if (!b) return;
    e.preventDefault();
    open(b.getAttribute('data-bohsave'));
  }, true);
  function boot() {
    try {
      var r = sessionStorage.getItem('boh_restored');
      if (r) { sessionStorage.removeItem('boh_restored'); var t = document.createElement('div'); t.className = 'bs-back'; t.setAttribute('role', 'status'); t.textContent = 'Bentornato, ' + (r === '1' ? 'Boh' : r) + '! Everything is loaded.'; css(); document.body.appendChild(t); setTimeout(function () { t.remove(); }, 4500); }
    } catch (e) {}
    fillCodes();
    try { new MutationObserver(function () { fillCodes(); }).observe(document.body, { childList: true, subtree: true }); } catch (e) {}
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
  window.BohSave = { open: open, pack: pack, unpack: unpack, gather: gather };
})();
