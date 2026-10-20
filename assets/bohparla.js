/* Boh · "Parla con Prof" (speak with your teacher): ONE recording page for Italiano 2, 3, 4 and AP.
   The page never changes between levels or units; only the questions change (assets/parla-italiano2.js, -italiano3.js, -italiano4.js, -ap.js).
   Each question gets a recorder (assets/recorder.js, skin 'parla'): Record, then Listen / Again / Keep it, then Download.
   If the microphone does not work the card shows Vocaroo and "I recorded another way". The student always just records:
   this page never says whether the teacher will also ask the questions in person. Nothing is uploaded by the game;
   the student downloads the files and turns them in on Google Classroom (or emails them: the finished screen carries the shared
   hand-in box from assets/recorder.js with a ready-made subject line). Recordings stay on the device.
   The look follows the device's light or dark setting. A unit with no questions in its file shows no Parla step.
   Public API: BohParla.open() opens the page for the current unit (the progress-bar P step uses it).
   Saves a small flag per unit in localStorage key boh_parla_v1. Lives outside #app so the page engine is not touched.
   Italiano 1 is not included. Created by Assunta Scotto, 2026. Not for redistribution. */
(function (W, D) {
  'use strict';
  var m = /\/(italiano[2-4]|ap)\//.exec(W.location.pathname);
  if (W.__bohParla || !m) return;
  W.__bohParla = true;
  var LV = m[1];
  var CFG = {
    italiano2: { save: 'bohItaliano2_v2', def: 'ea', name: 'Italiano 2', k: 'parla_i2_', en: true },
    italiano3: { save: 'bohItaliano3_v2', def: 'imp', name: 'Italiano 3', k: 'parla_italiano3_', en: true },
    italiano4: { save: 'bohItaliano4_v2', def: 'r3', name: 'Italiano 4', k: 'parla_italiano4_', en: false },
    ap: { save: 'bohAP_v2', def: 'f1', name: 'AP', k: 'parla_ap_', en: false }
  }[LV];
  var KEY = 'boh_parla_v1', ov = null, entry = null;
  W.BohParla = { open: function () { open(); } };

  function jget(k) { try { return JSON.parse(localStorage.getItem(k) || 'null') || {}; } catch (e) { return {}; } }
  function unit() {
    var q = /[?&]unit=(\w+)/.exec(W.location.search);
    if (q && data(q[1])) return q[1];
    return jget(CFG.save).unit || CFG.def;
  }
  function data(u) { return W.BohParlaData && W.BohParlaData[LV] && W.BohParlaData[LV][u] || null; }
  function rec(u) { var p = jget(KEY); return (p[LV] && p[LV][u]) || {}; }
  function ready(u) { return !!rec(u).ready; }
  function save(u, patch) {
    var p = jget(KEY); p[LV] = p[LV] || {}; var r = p[LV][u] || {};
    Object.keys(patch).forEach(function (k) { r[k] = patch[k]; });
    p[LV][u] = r;
    try { localStorage.setItem(KEY, JSON.stringify(p)); } catch (e) {}
  }
  function setAlt(u, i, v) { var a = rec(u).alt || {}; if (v) a[i] = v; else delete a[i]; save(u, { alt: a }); }
  function nm() { var p = jget('boh_profile_v1'); return p.bohName || ''; }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function rkey(u, i) { return CFG.k + u + '_q' + (i + 1); }
  function kept(u, i) { return !!(W.BohRecorder && W.BohRecorder.kept && W.BohRecorder.kept(rkey(u, i))); }
  function done(u, i) { return kept(u, i) || !!(rec(u).alt && rec(u).alt[i]); }

  var css =
    '.bp-ov{--bg:#F7F4EE;--card:#fff;--bd:#D9D0BF;--tx:#0E2A5B;--mu:#4A5878;--ac:#0A7C7C;--onac:#fff;--gr:#2F7A2A;--kept:#1E6B2A;--red:#C93C3C;--ring:#F2B8B8;--redtx:#B02A2A;--org:#E39A74;--gh:#4A5878;--off:#E4DDD0;--offt:#5C6783;--blue:#1A5CDF;--onblue:#fff}' +
    '@media (prefers-color-scheme:dark){.bp-ov{--bg:#0C1421;--card:#151E2E;--bd:#2A3850;--tx:#E6ECF2;--mu:#A9B7CC;--ac:#35C6C6;--onac:#06201F;--gr:#1E7A3A;--kept:#7FE0A0;--red:#D95252;--ring:#FFB4B4;--redtx:#FFB4B4;--org:#E0B040;--gh:#A9B7CC;--off:#2A3850;--offt:#8A9AB3;--blue:#7FB0E8;--onblue:#0C1421}}' +
    '.bp-ent{display:flex;align-items:center;justify-content:center;width:100%;margin:10px 0;min-height:56px;padding:0 24px;border-radius:999px;border:0;background:#0E2A5B;color:#fff;font:800 18px/1 "Manrope",system-ui,sans-serif;cursor:pointer}' +
    '.bp-ent.ok{background:#1E7A3A}' +
    '.bp-ov{position:fixed;inset:0;z-index:100;overflow:auto;background:var(--bg);color:var(--tx);font-family:"Manrope",system-ui,sans-serif;padding:calc(env(safe-area-inset-top,0px) + 18px) 18px 40px}' +
    '.bp-ov.done{background:#1E7A3A;color:#fff;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;gap:14px}' +
    '.bp-in{max-width:1100px;margin:0 auto}' +
    '.bp-top{display:flex;justify-content:space-between;gap:12px;font-size:15px;font-weight:700;color:var(--mu)}.bp-top b{color:var(--tx)}' +
    '.bp-hd{display:flex;align-items:flex-end;gap:12px;margin:10px 0 14px}' +
    '.bp-lo{width:78px;height:87px;flex-shrink:0;object-fit:contain}' +
    '.bp-bub{background:var(--card);border:2px solid var(--bd);border-radius:18px;padding:12px 16px;margin-bottom:4px}' +
    '.bp-h{font:800 28px/1.1 "Bricolage Grotesque",system-ui,sans-serif;margin:0 0 2px}.bp-s{font-size:16px;line-height:1.35;font-weight:700;margin:0}' +
    '.bp-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,300px),1fr));gap:14px;align-items:start}' +
    '.bp-q{background:var(--card);border:2px solid var(--bd);border-radius:18px;padding:16px}' +
    '.bp-n{font-size:13px;font-weight:800;color:var(--ac);letter-spacing:.06em}' +
    '.bp-it{font:800 22px/1.2 "Bricolage Grotesque",system-ui,sans-serif;margin:2px 0 4px}.bp-en{font-size:15px;color:var(--mu);margin:0 0 10px}' +
    '.bp-rec{border-top:2px solid var(--bd);padding-top:12px}' +
    '.bp-foot{display:flex;flex-direction:column;align-items:center;gap:10px;margin-top:18px}' +
    '.bp-btn{display:flex;align-items:center;justify-content:center;min-height:56px;padding:0 40px;border-radius:999px;border:0;background:var(--ac);color:var(--onac);font:800 18px/1 inherit;cursor:pointer}' +
    '.bp-btn[disabled]{background:var(--off);color:var(--offt);cursor:not-allowed}' +
    '.bp-btn.alt{background:transparent;color:var(--mu);border:2px solid var(--gh);min-height:48px;padding:0 24px;font-size:15px}' +
    '.bp-ov.done .bp-btn.alt{color:#fff;border:3px solid #fff;font-size:18px;min-height:56px;padding:0 32px}' +
    '.bp-hi{width:100%;max-width:520px;text-align:left}.bp-hi .bhi{margin-top:0}' +
    '.bp-ga{font-size:14px;line-height:1.35;color:var(--mu);margin:0 0 8px;padding:6px 8px;border-radius:10px;background:var(--off)}' +
    '.bp-hint{font-size:14px;color:var(--mu);margin:0}.bp-big{font:800 56px/1 "Bricolage Grotesque",system-ui,sans-serif}.bp-note{font-size:16px;line-height:1.45}' +
    '.bp-dlr{width:100%;max-width:420px;display:flex;align-items:center;justify-content:space-between;gap:10px;background:rgba(0,0,0,.22);border-radius:14px;padding:8px 8px 8px 16px;font-size:16px;font-weight:800;text-align:left}' +
    '.bp-dlr button{min-height:44px;padding:0 20px;border-radius:999px;border:0;background:#E0B040;color:#2A1D00;font:800 15px/1 inherit;cursor:pointer}' +
    '.bp-alt{margin-top:10px;border-top:2px solid var(--bd);padding-top:12px;display:flex;flex-direction:column;gap:10px}' +
    '.bp-alt p{margin:0;font-size:16px;line-height:1.4;font-weight:700}.bp-alt .mu{color:var(--mu);font-weight:500;font-size:15px}' +
    '.bp-a{display:flex;align-items:center;justify-content:center;min-height:52px;border-radius:999px;border:0;background:var(--blue);color:var(--onblue);font:800 17px/1 inherit;text-decoration:none;cursor:pointer}' +
    '.bp-in2{min-height:48px;border-radius:12px;border:2px solid var(--blue);background:var(--bg);color:var(--tx);padding:0 14px;font:500 16px/1 inherit;width:100%;box-sizing:border-box}' +
    '.bp-go{min-height:52px;border-radius:999px;border:0;background:var(--gr);color:#fff;font:800 17px/1 inherit;cursor:pointer}.bp-go[disabled]{background:var(--off);color:var(--offt)}' +
    '.bp-gh{min-height:52px;border-radius:999px;border:2px solid var(--gh);background:transparent;color:var(--tx);font:800 16px/1 inherit;cursor:pointer}' +
    '.bp-ok{font-size:16px;font-weight:800;color:var(--kept)}' +
    /* recorder skin, used only here */
    '.bpr{display:flex;flex-direction:column;gap:10px}.bpr-row{display:flex;align-items:center;gap:14px}.bpr-side{flex:1;display:flex;flex-direction:column;gap:6px}' +
    '.bpr-rec{width:72px;height:72px;flex-shrink:0;border-radius:50%;border:5px solid var(--ring);background:var(--red);display:flex;align-items:center;justify-content:center;cursor:pointer;padding:0}' +
    '.bpr-rec i{width:24px;height:24px;border-radius:50%;background:#fff;display:block}.bpr-rec.on i{border-radius:5px;width:20px;height:20px}' +
    '.bpr-time{font-size:20px;font-weight:800;font-variant-numeric:tabular-nums}' +
    '.bpr-meter{height:16px;border-radius:8px;background:var(--off);overflow:hidden}.bpr-meter i{display:block;height:100%;width:0;background:var(--ac);transition:width .08s}' +
    '.bpr-hint{font-size:15px;font-weight:700;color:var(--redtx);margin:0}' +
    '.bpr-link{align-self:center;background:none;border:0;color:var(--mu);font:700 14px/1.3 inherit;text-decoration:underline;cursor:pointer;min-height:44px}' +
    '.bpr-row2{display:flex;gap:10px}.bpr-b{flex:1;min-height:48px;border-radius:999px;border:0;background:var(--ac);color:var(--onac);font:800 16px/1 inherit;cursor:pointer}' +
    '.bpr-b.ghost{background:transparent;color:var(--tx);border:2px solid var(--gh);font-size:15px}' +
    '.bpr-keep{min-height:56px;border-radius:999px;border:0;background:var(--gr);color:#fff;font:800 18px/1 inherit;cursor:pointer}.bpr-keep.try{background:var(--red)}' +
    '.bpr-dl{min-height:48px;border-radius:999px;border:0;background:var(--org);color:#2A1D00;font:800 16px/1 inherit;cursor:pointer}' +
    '.bpr-kept{font-size:16px;font-weight:800;color:var(--kept)}' +
    '.bpr .brec-warn{background:var(--off);border:2px solid var(--red);border-radius:12px;padding:10px 12px;font-weight:800;font-size:15px}.bpr .brec-note{font-size:14px;color:var(--mu);margin:0}' +
    '.bp-ov button:focus-visible,.bp-ov a:focus-visible,.bp-ov input:focus-visible{outline:3px solid var(--ac);outline-offset:2px}' +
    '.bp-ov.done button:focus-visible{outline-color:#fff}';

  function addCss() {
    if (D.getElementById('bp-css')) return;
    var st = D.createElement('style'); st.id = 'bp-css'; st.textContent = css; D.head.appendChild(st);
  }
  function close() { if (ov && ov.parentNode) ov.parentNode.removeChild(ov); ov = null; sync(); }

  function doneView(u, d) {
    ov.className = 'bp-ov done'; ov.removeAttribute('aria-modal');
    var alt = rec(u).alt || {}, rows = '';
    d.questions.forEach(function (q, i) {
      if (kept(u, i)) rows += '<div class="bp-dlr"><span>' + (i + 1) + ' ✓</span><button type="button" data-dl="' + i + '">⬇ Scarica</button></div>';
      else if (alt[i] && alt[i].t === 'link') rows += '<div class="bp-dlr"><span>' + (i + 1) + ' ✓ Vocaroo</span><span style="font-weight:500;font-size:14px;word-break:break-all">' + esc(alt[i].v) + '</span></div>';
      else if (alt[i]) rows += '<div class="bp-dlr"><span>' + (i + 1) + ' ✓ recorded another way</span></div>';
    });
    ov.innerHTML = '<div class="bp-big">Registrato!</div><div style="font:700 26px/1.1 \'Bricolage Grotesque\',system-ui,sans-serif">' + esc(nm()) + '</div>' +
      '<div style="font-size:17px;font-weight:700;line-height:1.35">' + esc(CFG.name) + ' · ' + esc(d.title) + '<br>Parla con Prof</div>' +
      rows + '<div class="bp-hi" data-hi-box="1"></div>' +
      '<button class="bp-btn alt" data-x="1" type="button">Torna all’unità</button>';
    ov.querySelector('[data-x]').onclick = close;
    var nKept = d.questions.filter(function (q, i) { return kept(u, i); }).length;
    if (W.BohRecorder && W.BohRecorder.handIn) W.BohRecorder.handIn(ov.querySelector('[data-hi-box]'), { unit: d.title, n: Math.max(1, nKept), dl: false });
    Array.prototype.forEach.call(ov.querySelectorAll('[data-dl]'), function (b) {
      b.onclick = function () { if (W.BohRecorder && W.BohRecorder.downloadKey) W.BohRecorder.downloadKey(rkey(u, +b.getAttribute('data-dl')), { name: nm() }); };
    });
  }

  function altPanel(u, i, box, check) {
    if (box.firstChild) return;
    box.innerHTML = '<div class="bp-alt"><p>The mic isn’t working here. Record on Vocaroo, then paste your link.</p>' +
      '<a class="bp-a" href="https://vocaroo.com" target="_blank" rel="noopener">Open Vocaroo</a>' +
      '<input class="bp-in2" type="text" inputmode="url" autocomplete="off" aria-label="Paste your recording link here" placeholder="Paste your recording link here">' +
      '<button class="bp-go" type="button" data-k="1" disabled>✓ Keep it</button>' +
      '<p>Still stuck? Use your own device’s recorder, or ask me.</p><p class="mu">Record on another device, then upload the file to Classroom.</p>' +
      '<button class="bp-gh" type="button" data-o="1">I recorded another way</button></div>';
    var inp = box.querySelector('input'), k = box.querySelector('[data-k]');
    inp.oninput = function () { k.disabled = !/\S/.test(inp.value); };
    k.onclick = function () { setAlt(u, i, { t: 'link', v: inp.value.trim() }); box.innerHTML = '<p class="bp-ok">✓ Vocaroo link kept</p>'; check(); };
    box.querySelector('[data-o]').onclick = function () { setAlt(u, i, { t: 'other' }); box.innerHTML = '<p class="bp-ok">✓ Recorded another way</p>'; check(); };
  }

  function open() {
    var u = unit(), d = data(u); if (!d) return;
    addCss(); close();
    ov = D.createElement('div'); ov.className = 'bp-ov'; ov.setAttribute('role', 'dialog'); ov.setAttribute('aria-modal', 'true'); ov.setAttribute('aria-label', 'Parla con Prof');
    if (ready(u)) { D.body.appendChild(ov); doneView(u, d); return; }
    var h = '<div class="bp-in"><div class="bp-top"><span>' + esc(CFG.name) + ' · ' + esc(d.title) + '</span><b>' + esc(nm()) + '</b></div>' +
      '<div class="bp-hd"><img class="bp-lo" src="../assets/guide/bust/mic.webp" alt="Prof. Lo So holding a microphone"><div class="bp-bub"><h1 class="bp-h">Parla con Prof</h1>' +
      '<p class="bp-s">Press the red button and talk. Press it again to stop.</p></div></div><div class="bp-grid">';
    d.questions.forEach(function (q, i) {
      h += '<div class="bp-q"><div class="bp-n">' + (i + 1) + '</div><div class="bp-it">' + esc(q.it) + '</div>' + (CFG.en && q.en ? '<div class="bp-en">' + esc(q.en) + '</div>' : '') + (/\p{L}\/[aei]\b/u.test(q.it) ? '<div class="bp-ga">La voce dice la forma del ragazzo (piccolo). Sei una ragazza? Tu dici la forma con la -a (piccola). · The voice says the boy form; girls say the -a form.</div>' : '') +
        '<div class="bp-rec" data-rec="' + i + '"></div><div data-alt="' + i + '"></div></div>';
    });
    h += '</div><div class="bp-foot"><button class="bp-btn" data-go="1" type="button" disabled>Ho finito</button>' +
      '<p class="bp-hint" data-hint="1">Keep all ' + d.questions.length + ' first.</p>' +
      '<button class="bp-btn alt" data-x="1" type="button">Indietro</button></div></div>';
    ov.innerHTML = h; D.body.appendChild(ov);
    var go = ov.querySelector('[data-go]'), hint = ov.querySelector('[data-hint]');
    function check() {
      var all = d.questions.every(function (q, i) { return done(u, i); });
      go.disabled = !all; hint.style.display = all ? 'none' : '';
    }
    d.questions.forEach(function (q, i) {
      var el = ov.querySelector('[data-rec="' + i + '"]'), box = ov.querySelector('[data-alt="' + i + '"]');
      if (W.BohRecorder) {
        try {
          W.BohRecorder.mount(el, { key: rkey(u, i), label: 'Question ' + (i + 1), maxSec: 60, name: nm(), skin: 'parla', onChange: check, onEscalate: function () { altPanel(u, i, box, check); } });
        } catch (e) { altPanel(u, i, box, check); }
      } else altPanel(u, i, box, check);
      var a = rec(u).alt && rec(u).alt[i];
      if (a) box.innerHTML = '<p class="bp-ok">' + (a.t === 'link' ? '✓ Vocaroo link kept' : '✓ Recorded another way') + '</p>';
    });
    ov.querySelector('[data-x]').onclick = close;
    go.onclick = function () { if (go.disabled) return; save(u, { ready: true, ts: new Date().toISOString() }); doneView(u, d); };
    check();
  }

  /* entry button: sits right under the progress bar on the unit hub (home), only when this unit has questions and the level has a progress bar */
  function sync() {
    var u = unit(), d = data(u), home = D.querySelector('[data-screen="home"]'), pb = D.querySelector('.pathbar'), show = !!(d && home && pb && !ov && !D.querySelector('.start-card.one'));   /* the Oggi card already carries Parla as its last step */
    if (!show) { if (entry && entry.parentNode) { entry.parentNode.removeChild(entry); } entry = null; return; }
    addCss();
    if (!entry) { entry = D.createElement('button'); entry.type = 'button'; entry.onclick = open; }
    if (entry.previousElementSibling !== pb) pb.insertAdjacentElement('afterend', entry);
    var r = ready(u);
    entry.className = 'bp-ent' + (r ? ' ok' : '');
    entry.textContent = r ? '✓ Parla con Prof: registrato' : 'Parla con Prof';
  }
  function go() { sync(); setInterval(sync, 900); }
  if (D.readyState === 'loading') D.addEventListener('DOMContentLoaded', go); else go();
})(window, document);
