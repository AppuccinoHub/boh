/* Boh · Ascolta e ripeti. A listening-and-saying activity that gets a sentence into the student's head by repeating it.
   BohRepeat.open({ title, phrases: [{ it, en }], count: 8, onClose })
   For each sentence: 1) it plays three times (Ascolta 1, 2, 3), 2) the student says it out loud, 3) the student picks the English meaning.
   A sentence that is missed comes back once at the end. No scores or Boh Cashi are changed by this file.
   Created by Assunta Scotto, 2026. Not for redistribution. */
(function (W) {
  if (W.BohRepeat) return;
  var CSS =
    '.brp-ov{position:fixed;inset:0;z-index:9999;display:flex;align-items:center;justify-content:center;padding:14px;background:rgba(14,42,91,.72)}' +
    '.brp{--bg:#FFFFFF;--ink:#0E2A5B;--mut:#46566E;--line:#DAD7D0;--soft:#EFECE7;--blue:#1A5CDF;--on:#fff;--pink:#BC1E72;--tint:#FEE5EE;--teal:#0A9A9A;--ok:#235B1E;--okbg:#DCF8D9;--okb:#3D8F35;--no:#273D62;--nobg:#E5ECF5;--nob:#6E819E;' +
    'width:min(460px,100%);max-height:100%;overflow:auto;display:flex;flex-direction:column;gap:14px;padding:18px;border-radius:26px;background:var(--bg);color:var(--ink);font:16px/1.35 system-ui,sans-serif}' +
    '.brp.dark{--bg:#151E2E;--ink:#E6ECF2;--mut:#AAB5C4;--line:#2C384D;--soft:#1C2738;--blue:#7FAEE9;--on:#0A121F;--pink:#F075AA;--tint:#4C1E32;--teal:#10BFBF;--ok:#94E28B;--okbg:#1A2F17;--okb:#50A248;--no:#C1D2EC;--nobg:#1F2C3F;--nob:#687C98}' +
    '.brp-top{display:flex;align-items:center;gap:10px}.brp-top h2{margin:0;flex:1;font:900 19px/1.15 system-ui,sans-serif}' +
    '.brp-x{all:unset;cursor:pointer;width:44px;height:44px;border-radius:50%;display:grid;place-items:center;background:var(--soft);font:800 18px system-ui}' +
    '.brp-bar{height:8px;border-radius:8px;background:var(--line);overflow:hidden}.brp-bar i{display:block;height:100%;background:var(--teal);transition:width .3s}' +
    '.brp-cnt{display:flex;justify-content:space-between;font-weight:800;font-size:14px;color:var(--mut)}' +
    '.brp-card{border:3px solid var(--pink);background:var(--tint);border-radius:22px;padding:22px 16px;text-align:center;display:flex;flex-direction:column;gap:12px;align-items:center}' +
    '.brp-it{font:900 clamp(24px,6.6vw,32px)/1.18 system-ui,sans-serif}' +
    '.brp-dots{display:flex;gap:10px}.brp-dots i{width:16px;height:16px;border-radius:50%;border:2px solid var(--pink);background:transparent}.brp-dots i.on{background:var(--pink)}' +
    '.brp-lab{font:800 12px system-ui;letter-spacing:.12em;text-transform:uppercase;color:var(--mut)}' +
    '.brp-b{all:unset;box-sizing:border-box;cursor:pointer;text-align:center;min-height:56px;padding:14px 12px;border-radius:16px;font:900 18px system-ui;width:100%;background:var(--blue);color:var(--on)}' +
    '.brp-b.ghost{background:var(--soft);color:var(--ink);font-size:16px;min-height:48px}' +
    '.brp-opt{all:unset;box-sizing:border-box;cursor:pointer;display:block;width:100%;min-height:56px;padding:12px 14px;border-radius:16px;border:2px solid var(--mut);background:var(--bg);color:var(--ink);font:800 17px/1.25 system-ui}' +
    '.brp-opt.ok{background:var(--okbg);border-color:var(--okb);color:var(--ok)}.brp-opt.no{background:var(--nobg);border-color:var(--nob);color:var(--no)}' +
    '.brp-fb{font:900 20px system-ui;text-align:center}.brp-list{display:flex;flex-direction:column;gap:10px}' +
    '.brp *:focus-visible{outline:3px solid var(--blue);outline-offset:2px}';
  var ov = null, st = null, opts = null, timer = null;
  function esc(t) { return String(t).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function shuffle(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)), x = a[i]; a[i] = a[j]; a[j] = x; } return a; }
  var voice = null;
  function say(t, cb) {
    var done = false, fin = function () { if (!done) { done = true; if (cb) cb(); } };
    try {
      var S = W.speechSynthesis; if (!S) { setTimeout(fin, 1800); return; }
      if (!voice) { var vs = S.getVoices(); voice = vs.filter(function (v) { return /google/i.test(v.name) && /^it/i.test(v.lang); })[0] || vs.filter(function (v) { return /^it/i.test(v.lang); })[0] || null; }
      S.cancel(); var u = new SpeechSynthesisUtterance(String(t)); u.lang = 'it-IT'; if (voice) u.voice = voice; u.rate = .88;
      u.onend = fin; u.onerror = fin; S.speak(u); setTimeout(fin, 2500 + String(t).length * 140);   // some devices never fire "end": do not get stuck
    } catch (e) { setTimeout(fin, 1800); }
  }
  function stop() { if (timer) { clearTimeout(timer); timer = null; } try { W.speechSynthesis && W.speechSynthesis.cancel(); } catch (e) {} st && (st.token = (st.token || 0) + 1); }
  function box() { return ov.querySelector('.brp'); }
  function dark() { try { var t = localStorage.getItem('boh_theme') || document.documentElement.getAttribute('data-theme'); if (t === 'dark') return true; if (t === 'light') return false; return W.matchMedia && W.matchMedia('(prefers-color-scheme: dark)').matches; } catch (e) { return false; } }
  function close() { if (!ov) return; stop(); document.removeEventListener('keydown', keyH, true); ov.remove(); ov = null; if (opts && opts.onClose) try { opts.onClose(); } catch (e) {} }
  function keyH(e) { if (e.key === 'Escape') { e.preventDefault(); close(); } }
  function frame(inner, pct, i, n) {
    box().innerHTML = '<div class="brp-top"><h2>' + esc(opts.title || 'Ascolta e ripeti') + '</h2><button class="brp-x" aria-label="Chiudi">&#10005;</button></div>' +
      '<div class="brp-bar"><i style="width:' + pct + '%"></i></div><div class="brp-cnt"><span>Frase ' + i + ' di ' + n + '</span><span>' + st.firsts + ' al primo colpo</span></div>' + inner;
    box().querySelector('.brp-x').onclick = close;
  }
  function start() {
    var all = shuffle(opts.phrases), n = Math.min(opts.count || 8, all.length);
    st = { q: all.slice(0, n), pool: all, n: n, i: 0, firsts: 0, missed: [], retried: {}, token: 0 };
    listen();
  }
  function cur() { return st.q[st.i]; }
  function listen() {
    var p = cur(), tok = ++st.token, played = 0;
    function dots() { return '<div class="brp-dots" aria-hidden="true">' + [1, 2, 3].map(function (k) { return '<i class="' + (k <= played ? 'on' : '') + '"></i>'; }).join('') + '</div>'; }
    function draw(msg, again) {
      frame('<div class="brp-card"><div class="brp-lab">Ascolta</div><div class="brp-it">' + esc(p.it) + '</div>' + dots() + '<div class="brp-lab" role="status">' + msg + '</div></div>' +
        (again ? '<button class="brp-b" data-a="say">Ora tu: dillo ad alta voce</button><button class="brp-b ghost" data-a="again">Ascolta ancora 3 volte</button>' : ''),
        Math.round(st.i / st.q.length * 100), st.i + 1, st.q.length);
      if (again) { box().querySelector('[data-a=say]').onclick = function () { stop(); sayIt(); }; box().querySelector('[data-a=again]').onclick = function () { stop(); listen(); }; try { box().querySelector('[data-a=say]').focus(); } catch (e) {} }
    }
    function round() {
      if (tok !== st.token) return;
      if (played >= 3) { draw('Hai ascoltato tre volte', true); return; }
      played++; draw('Ascolta ' + played + ' di 3', false);
      say(p.it, function () { if (tok !== st.token) return; timer = setTimeout(round, 900); });
    }
    round();
  }
  function sayIt() {
    var p = cur();
    frame('<div class="brp-card"><div class="brp-lab">Ora tu</div><div class="brp-it">' + esc(p.it) + '</div><div class="brp-lab">Dillo ad alta voce, una volta</div></div>' +
      '<button class="brp-b" data-a="done">L&rsquo;ho detto</button><button class="brp-b ghost" data-a="hear">Ascolta ancora</button>', Math.round(st.i / st.q.length * 100), st.i + 1, st.q.length);
    box().querySelector('[data-a=done]').onclick = meaning; box().querySelector('[data-a=hear]').onclick = function () { say(p.it); };
    try { box().querySelector('[data-a=done]').focus(); } catch (e) {}
  }
  function meaning() {
    var p = cur(), wrong = shuffle(st.pool.filter(function (x) { return x.en !== p.en; })).slice(0, 2), os = shuffle([p].concat(wrong)), first = !st.retried[p.it];
    frame('<div class="brp-card"><div class="brp-lab">Che cosa significa?</div><div class="brp-it">' + esc(p.it) + '</div></div><div class="brp-list">' +
      os.map(function (o, k) { return '<button class="brp-opt" data-k="' + k + '">' + esc(o.en) + '</button>'; }).join('') + '</div><div class="brp-fb" role="status"></div>', Math.round(st.i / st.q.length * 100), st.i + 1, st.q.length);
    var locked = false;
    [].forEach.call(box().querySelectorAll('.brp-opt'), function (b) {
      b.onclick = function () {
        if (locked) return; var o = os[+b.getAttribute('data-k')], ok = o === p; locked = true;
        [].forEach.call(box().querySelectorAll('.brp-opt'), function (x) { if (os[+x.getAttribute('data-k')] === p) x.classList.add('ok'); });
        if (!ok) b.classList.add('no');
        box().querySelector('.brp-fb').textContent = ok ? 'Perfetto!' : 'Non ancora. Ecco la risposta.';
        if (ok && first) st.firsts++;
        if (!ok && first) { st.retried[p.it] = 1; st.q.push(p); }
        var nx = document.createElement('button'); nx.className = 'brp-b'; nx.textContent = (st.i + 1 >= st.q.length) ? 'Finito' : 'Avanti'; box().appendChild(nx);
        nx.onclick = function () { st.i++; if (st.i >= st.q.length) finish(); else listen(); }; try { nx.focus(); } catch (e) {}
      };
    });
    [].forEach.call(box().querySelectorAll('.brp-opt'), function (b) { /* reading the answer aloud is not needed: the sentence was heard 3 times */ });
  }
  function finish() {
    stop();
    box().innerHTML = '<div class="brp-top"><h2>Ascolta e ripeti</h2><button class="brp-x" aria-label="Chiudi">&#10005;</button></div><div class="brp-card"><div class="brp-it">Bravo!</div><div class="brp-lab">' + st.firsts + ' di ' + st.n + ' al primo colpo</div></div>' +
      '<button class="brp-b" data-a="again">Un altro giro</button><button class="brp-b ghost" data-a="end">Chiudi</button>';
    box().querySelector('.brp-x').onclick = close; box().querySelector('[data-a=end]').onclick = close; box().querySelector('[data-a=again]').onclick = start;
  }
  function open(o) {
    if (ov) return; opts = o || {}; if (!opts.phrases || !opts.phrases.length) return;
    if (!document.getElementById('brp-css')) { var s = document.createElement('style'); s.id = 'brp-css'; s.textContent = CSS; document.head.appendChild(s); }
    ov = document.createElement('div'); ov.className = 'brp-ov'; ov.setAttribute('role', 'dialog'); ov.setAttribute('aria-modal', 'true'); ov.setAttribute('aria-label', 'Ascolta e ripeti');
    ov.innerHTML = '<div class="brp' + (dark() ? ' dark' : '') + '"></div>'; document.body.appendChild(ov);
    document.addEventListener('keydown', keyH, true); start();
  }
  W.BohRepeat = { open: open, close: close };
})(window);
