/* Boh · "Parla con Prof" (speak with your teacher). ITALIANO 2 ONLY.
   Shows the unit's 3 questions (from parla-italiano2.js), lets the student practise saying each one into the recorder,
   then taps "Sono pronto/a". The teacher checks the student in person. Recordings are PRACTICE ONLY and are never graded here.
   It does nothing on Italiano 1, 3, 4 or AP, and does nothing if a unit has no questions in parla-italiano2.js.
   Saves one small flag in localStorage key boh_parla_v1. Lives outside #app so the page engine is not touched.
   Created by Assunta Scotto, 2026. Not for redistribution. */
(function (W, D) {
  'use strict';
  if (W.__bohParla || !/\/italiano2\//.test(W.location.pathname)) return;
  W.__bohParla = true;
  var KEY = 'boh_parla_v1', SAVE = 'bohItaliano2_v2', ov = null, entry = null;

  function jget(k) { try { return JSON.parse(localStorage.getItem(k) || 'null') || {}; } catch (e) { return {}; } }
  function unit() { return jget(SAVE).unit || 'ea'; }
  function data(u) { return W.BohParlaData && W.BohParlaData.italiano2 && W.BohParlaData.italiano2[u] || null; }
  function ready(u) { var p = jget(KEY); return !!(p.italiano2 && p.italiano2[u] && p.italiano2[u].ready); }
  function setReady(u) {
    var p = jget(KEY); p.italiano2 = p.italiano2 || {};
    p.italiano2[u] = { ready: true, ts: new Date().toISOString() };
    try { localStorage.setItem(KEY, JSON.stringify(p)); } catch (e) {}
  }
  function nm() { var p = jget('boh_profile_v1'); return p.bohName || ''; }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function rkey(u, i) { return 'parla_i2_' + u + '_q' + (i + 1); }

  var css = '.bp-ent{display:flex;align-items:center;justify-content:center;width:100%;margin:10px 0;min-height:56px;padding:0 24px;border-radius:999px;border:0;background:#0E2A5B;color:#fff;font:800 18px/1 "Manrope",system-ui,sans-serif;cursor:pointer}' +
    '.bp-ent.ok{background:#1E7A3A}' +
    '.bp-ov{position:fixed;inset:0;z-index:100;overflow:auto;background:#0C1421;color:#E6ECF2;font-family:"Manrope",system-ui,sans-serif;padding:calc(env(safe-area-inset-top,0px) + 18px) 18px 40px}' +
    '.bp-ov.done{background:#1E7A3A;color:#fff;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;gap:14px}' +
    '.bp-in{max-width:560px;margin:0 auto}.bp-h{font:800 30px/1.1 "Bricolage Grotesque",system-ui,sans-serif;margin:6px 0 4px}' +
    '.bp-s{font-size:16px;color:#A9B7CC;margin:0 0 16px;line-height:1.4}.bp-tag{display:inline-block;margin:0 0 12px;padding:4px 10px;border-radius:999px;background:#E0B040;color:#241A00;font:800 12px/1 inherit;letter-spacing:.06em}' +
    '.bp-q{background:#151E2E;border:2px solid #2A3850;border-radius:18px;padding:16px;margin:0 0 12px}' +
    '.bp-it{font:800 24px/1.2 "Bricolage Grotesque",system-ui,sans-serif}.bp-en{font-size:15px;color:#A9B7CC;margin:4px 0 12px}' +
    '.bp-btn{display:flex;align-items:center;justify-content:center;width:100%;min-height:56px;border-radius:999px;border:0;background:#35C6C6;color:#06201F;font:800 18px/1 inherit;cursor:pointer;margin-top:8px}' +
    '.bp-btn[disabled]{background:#2A3850;color:#7A8AA3;cursor:not-allowed}.bp-btn.alt{background:transparent;color:inherit;border:3px solid currentColor;min-height:48px;width:auto;padding:0 24px}' +
    '.bp-big{font:800 72px/1 "Bricolage Grotesque",system-ui,sans-serif}.bp-note{font-size:14px;opacity:.9}';

  function addCss() {
    if (D.getElementById('bp-css')) return;
    var st = D.createElement('style'); st.id = 'bp-css'; st.textContent = css; D.head.appendChild(st);
  }
  function close() { if (ov && ov.parentNode) ov.parentNode.removeChild(ov); ov = null; sync(); }

  function doneView(u, d) {
    ov.className = 'bp-ov done';
    var now = new Date();
    ov.innerHTML = '<div class="bp-big">Pronto!</div><div style="font:700 30px/1.1 \'Bricolage Grotesque\',system-ui,sans-serif">' + esc(nm()) + '</div>' +
      '<div style="font-size:18px;font-weight:700;line-height:1.35">Italiano 2 · ' + esc(d.title) + '<br>Parla con Prof</div>' +
      '<div class="bp-note">Now go to your teacher, privately, and answer the 3 questions out loud.<br>Your teacher writes your grade.</div>' +
      '<button class="bp-btn alt" data-x="1" type="button">Torna all’unità</button>';
    ov.querySelector('[data-x]').onclick = close;
    ov.setAttribute('data-ts', now.toISOString());
  }

  function open() {
    var u = unit(), d = data(u); if (!d) return;
    addCss(); close();
    ov = D.createElement('div'); ov.className = 'bp-ov'; ov.setAttribute('role', 'dialog'); ov.setAttribute('aria-label', 'Parla con Prof');
    if (ready(u)) { D.body.appendChild(ov); doneView(u, d); return; }
    var h = '<div class="bp-in">' + (d.placeholder ? '<div class="bp-tag">PLACEHOLDER QUESTIONS</div>' : '') +
      '<div class="bp-h">Parla con Prof</div><p class="bp-s">Say each question and your answer out loud. Record to practise. When you feel ready, tap the button. Then your teacher asks you these 3 questions in person.</p>';
    d.questions.forEach(function (q, i) {
      h += '<div class="bp-q"><div class="bp-it">' + esc(q.it) + '</div><div class="bp-en">' + esc(q.en) + '</div><div data-rec="' + i + '"></div></div>';
    });
    h += '<button class="bp-btn" data-go="1" type="button" disabled>Sono pronto/a</button>' +
      '<p class="bp-s" data-hint="1" style="text-align:center;margin-top:10px">Record all 3 first.</p>' +
      '<button class="bp-btn alt" data-x="1" type="button" style="margin:0 auto;color:#A9B7CC">Indietro</button></div>';
    ov.innerHTML = h; D.body.appendChild(ov);
    var go = ov.querySelector('[data-go]'), hint = ov.querySelector('[data-hint]');
    function check() {
      var all = d.questions.every(function (q, i) { return W.BohRecorder && W.BohRecorder.has(rkey(u, i)); });
      go.disabled = !all; hint.style.display = all ? 'none' : '';
    }
    d.questions.forEach(function (q, i) {
      var el = ov.querySelector('[data-rec="' + i + '"]');
      if (W.BohRecorder) { try { W.BohRecorder.mount(el, { key: rkey(u, i), label: 'Registra', maxSec: 30, onChange: check, onEscalate: function () { /* recorder shows its own next step */ } }); } catch (e) { el.textContent = 'Recording is not available here. Tell your teacher.'; } }
      else el.textContent = 'Recording is not available here. Tell your teacher.';
    });
    ov.querySelector('[data-x]').onclick = close;
    go.onclick = function () { if (go.disabled) return; setReady(u); doneView(u, d); };
    check();
  }

  /* entry button: sits right under the progress bar on the unit hub (home), only when this unit has questions */
  function sync() {
    var u = unit(), d = data(u), home = D.querySelector('[data-screen="home"]'), pb = D.querySelector('.pathbar'), show = !!(d && home && pb && !ov && !D.querySelector('.start-card.one'));   /* the Oggi card already carries Parla as its last step */
    if (!show) { if (entry && entry.parentNode) { entry.parentNode.removeChild(entry); } entry = null; return; }
    addCss();
    if (!entry) { entry = D.createElement('button'); entry.type = 'button'; entry.onclick = open; }
    if (entry.previousElementSibling !== pb) pb.insertAdjacentElement('afterend', entry);
    var r = ready(u);
    entry.className = 'bp-ent' + (r ? ' ok' : '');
    entry.textContent = r ? '\u2713 Parla con Prof: pronto' : 'Parla con Prof';
  }
  function go() { sync(); setInterval(sync, 900); }
  if (D.readyState === 'loading') D.addEventListener('DOMContentLoaded', go); else go();
})(window, document);
