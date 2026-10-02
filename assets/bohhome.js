/* Boh · Home button on every screen of Italiano 1-4, AP and Aiutami.
   Created by Assunta Scotto, 2026. Not for redistribution.
   A small drawn house sits in the top bar (next to the "?" help button). It opens a short menu:
   - Vai a livello      → the level picker, so a student can switch levels. Work is already saved: every page saves after each answer.
   - Ho finito per oggi  → the full save code / file (the same sheet as "Salva il mio Boh").
   - Resta qui.
   Nothing here changes any page's content or saved data. */
(function (W, D) {
  'use strict';
  if (W.BohHome) return;
  var me = D.currentScript, HOME = '../';
  try { HOME = new URL('../', (me && me.src) || location.href).href; } catch (e) {}
  var ov = null, last = null;

  /* drawn icons (no emoji) */
  var HOUSE = '<svg viewBox="0 0 48 48" aria-hidden="true" focusable="false"><path d="M6 23 24 7l18 16" fill="none" stroke="#D9472B" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/><path d="M11 22v18a2 2 0 0 0 2 2h22a2 2 0 0 0 2-2V22L24 11z" fill="#FFD9B8" stroke="#2A1F1B" stroke-width="2.4" stroke-linejoin="round"/><path d="M20 42V30a4 4 0 0 1 8 0v12z" fill="#2A1F1B"/><path d="M6 23 24 7l18 16" fill="none" stroke="#D9472B" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  var CHECK = '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  function level() { var p = location.pathname, m = /\/italiano([1-4])\//.exec(p); if (m) return m[1]; if (/\/ap\//.test(p)) return 'ap'; return '4'; }
  /* "a|b" = main language, then English small underneath (Italiano 2 only). Level 1 is English only, 3 mixes, 4 and AP are Italian. */
  var TXT = {
    '1': { title: 'Home', okIdle: 'Your work is saved on this computer.', okMid: 'Saved: finished rounds and stages, your Boh Cashi and your prizes.',
      warnRound: "A round you haven't finished is NOT saved. If you leave now, this round starts over.", warnStage: "A stage you haven't finished is NOT saved. If you leave now, this stage starts over.",
      go: 'Change level', goMid: 'Change level (leave anyway)', goSub: 'Pick Italiano 1 · 2 · 3 · 4 · AP', done: "I'm done for today", doneSub: 'Get my save code',
      note: 'Done for today? Copy your code and keep it safe (photo, Drive, email to yourself). Next time: <b>Carica il mio Boh</b>.', stay: 'Stay here', flash: 'Saved' },
    '2': { title: 'Casa|Home', okIdle: 'Il tuo lavoro è salvato su questo computer.|Your work is saved on this computer.', okMid: 'Salvato: i round e le tappe già finiti, i Boh Cashi e i premi.|Saved: finished rounds and stages, Boh Cashi and prizes.',
      warnRound: 'Un round a metà NON si salva. Se esci adesso, questo round ricomincia.|A half-finished round is NOT saved. Leave now and it starts over.', warnStage: 'Una tappa a metà NON si salva. Se esci adesso, questa tappa ricomincia.|A half-finished stage is NOT saved. Leave now and it starts over.',
      go: 'Cambia livello|Change level', goMid: 'Cambia livello (esco lo stesso)|Change level (leave anyway)', goSub: 'Italiano 1 · 2 · 3 · 4 · AP', done: 'Ho finito per oggi|I\'m done for today', doneSub: 'Prendi il codice · Get my save code',
      note: 'Finito per oggi? Copia il codice e tienilo al sicuro (foto, Drive, email a te). La prossima volta: <b>Carica il mio Boh</b>.|Done for today? Copy your code and keep it safe. Next time: Load my Boh.', stay: 'Resta qui|Stay here', flash: 'Salvato' },
    '3': { title: 'Casa', okIdle: 'Il tuo lavoro è saved su questo computer.', okMid: 'Saved: i round e le tappe finiti, i Boh Cashi e i prizes.',
      warnRound: 'Heads up: un round a metà NON si salva. Se esci adesso, il round ricomincia.', warnStage: 'Heads up: una tappa a metà NON si salva. Se esci adesso, la tappa ricomincia.',
      go: 'Cambia level', goMid: 'Cambia level (esco lo stesso)', goSub: 'Italiano 1 · 2 · 3 · 4 · AP', done: 'Ho finito per oggi', doneSub: 'Get my save code',
      note: 'Done per oggi? Copia il code e keep it safe (foto, Drive, email a te). Next time: <b>Carica il mio Boh</b>.', stay: 'Resta qui', flash: 'Salvato' },
    '4': { title: 'Casa', okIdle: 'Il tuo lavoro è salvato su questo computer.', okMid: 'Salvato: i round e le tappe già finiti, i Boh Cashi e i premi.',
      warnRound: 'Attenzione: un round a metà NON si salva. Se esci adesso, questo round ricomincia da capo.', warnStage: 'Attenzione: una tappa a metà NON si salva. Se esci adesso, questa tappa ricomincia da capo.',
      go: 'Cambia livello', goMid: 'Cambia livello (esco lo stesso)', goSub: 'Scegli Italiano 1 · 2 · 3 · 4 · AP', done: 'Ho finito per oggi', doneSub: 'Prendi il codice di salvataggio',
      note: 'Finito per oggi? Copia il codice e tienilo al sicuro (foto, Drive, email a te). La prossima volta: <b>Carica il mio Boh</b>.', stay: 'Resta qui', flash: 'Salvato' }
  };
  TXT.ap = TXT['4'];
  function T(k, plain) {
    var v = (TXT[level()] || TXT['4'])[k] || '', i = v.indexOf('|');
    if (i < 0) return v;
    return plain ? v.slice(0, i) + ' · ' + v.slice(i + 1) : v.slice(0, i) + '<small class="en">' + v.slice(i + 1) + '</small>';
  }

  function css() {
    if (D.getElementById('bhm-css')) return;
    var s = D.createElement('style'); s.id = 'bhm-css';
    s.textContent =
      '.bhm{all:unset;box-sizing:border-box;cursor:pointer;flex:none;width:40px;height:40px;border-radius:50%;display:inline-grid;place-items:center;font-size:18px;line-height:1;' +
      'background:var(--icon-btn-bg,#f3e9e2);color:var(--icon-btn-text,#231815);border:1.5px solid var(--line,transparent)}' +
      '.bhm:hover{filter:brightness(.96)}.bhm:focus-visible{outline:3px solid #E88A6C;outline-offset:2px}' +
      '.bhm-ov{position:fixed;inset:0;z-index:2147482000;background:rgba(20,14,24,.62);display:flex;align-items:center;justify-content:center;padding:16px;font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif}' +
      '.bhm-box{--i:#231815;--m:#6f5e56;--b:#fff;--l:#eadfd8;width:min(420px,100%);max-height:100%;overflow:auto;background:var(--b);color:var(--i);border-radius:20px;padding:18px;box-sizing:border-box;display:grid;gap:10px}' +
      '.bhm-box.dark{--i:#F2EAF0;--m:#C0B2C1;--b:#251C2A;--l:#3D3243}' +
      '.bhm-box h2{margin:0;font-size:21px}.bhm-box p{margin:0;font-size:14px;line-height:1.4;color:var(--m)}' +
      '.bhm-ok{display:flex;gap:8px;align-items:center;padding:10px 12px;border-radius:12px;background:rgba(80,170,110,.16);font-weight:800;font-size:14px;color:var(--i)}' +
      '.bhm-warn{padding:11px 12px;border-radius:12px;background:#fff1c9;color:#4a3300;border:2px solid #e6b422;font-size:15px;line-height:1.35}.bhm-warn span{font-size:12px;opacity:.85}' +
      '.bhm-box.dark .bhm-warn{background:#4a3d12;color:#ffe9a8;border-color:#b8921a}' +
      '.bhm-b{all:unset;box-sizing:border-box;cursor:pointer;text-align:center;min-height:50px;padding:10px 14px;border-radius:14px;font-weight:800;font-size:16px;line-height:1.2;display:flex;flex-direction:column;justify-content:center;gap:2px}' +
      '.bhm-b small{font-weight:600;font-size:12px;opacity:.85}' +
      '.bhm-b.go{background:#E88A6C;color:#241318}.bhm-b.save{background:#6b4a8a;color:#fff}.bhm-b.stay{background:transparent;border:2px solid var(--l);color:var(--i)}' +
      '.bhm-b:focus-visible{outline:3px solid #E88A6C;outline-offset:2px}' +
      '.bhm svg{width:24px;height:24px;display:block}.bhm-box h2{display:flex;align-items:center;gap:10px}.bhm-box h2 svg{width:38px;height:38px;flex:none}' +
      '.bhm-say{display:flex;gap:10px;align-items:center}.bhm-say img{width:54px;height:auto;flex:none}.bhm-say div{flex:1;font-size:15px;line-height:1.35;font-weight:700;color:var(--i)}' +
      '.bhm-ok svg{width:20px;height:20px;flex:none;color:#2f8f57}.bhm-box small.en{display:block;font-weight:600;font-size:.82em;opacity:.8;margin-top:2px}';
    D.head.appendChild(s);
  }
  function dark() {
    try { return !!(W.matchMedia && matchMedia('(prefers-color-scheme: dark)').matches) || D.documentElement.getAttribute('data-theme') === 'dark' || D.body.classList.contains('dark'); } catch (e) { return false; }
  }
  function screenName() { var l = D.querySelector('.look[data-screen]'); return l ? l.getAttribute('data-screen') : ''; }

  function close() {
    if (!ov) return;
    D.removeEventListener('keydown', onKey, true); ov.remove(); ov = null;
    if (last && last.focus) try { last.focus(); } catch (e) {}
  }
  function onKey(e) { if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); close(); } }

  function goHome() {
    var b = ov && ov.querySelector('.bhm-b.go'); if (b) { b.disabled = true; b.innerHTML = CHECK + ' ' + T('flash'); }
    setTimeout(function () { location.href = HOME; }, 180);   // the pages save after every answer; this just gives the last save a moment
  }
  function openSave() {
    close();
    if (W.BohSave && W.BohSave.open) W.BohSave.open('save');
    else { var t = D.createElement('div'); t.setAttribute('role', 'status'); t.textContent = 'Un momento… riprova.'; t.style.cssText = 'position:fixed;left:50%;bottom:24px;transform:translateX(-50%);background:#231815;color:#fff;padding:10px 16px;border-radius:12px;z-index:2147482500;font:700 14px system-ui'; D.body.appendChild(t); setTimeout(function () { t.remove(); }, 2200); }
  }
  function open(btn) {
    css(); close(); last = btn || D.activeElement;
    var sc = screenName(), mid = sc === 'play' || sc === 'lesson', rnd = sc === 'play';
    ov = D.createElement('div'); ov.className = 'bhm-ov';
    var face = HOME + 'assets/guide/head/h-smile.webp';
    ov.innerHTML = '<div class="bhm-box' + (dark() ? ' dark' : '') + '" role="dialog" aria-modal="true" aria-labelledby="bhm-t">' +
      '<h2 id="bhm-t">' + HOUSE + '<span>' + T('title') + '</span></h2>' +
      (mid ? '<div class="bhm-say"><img src="' + face + '" alt=""><div>' + T(rnd ? 'warnRound' : 'warnStage') + '</div></div>' +
        '<div class="bhm-ok">' + CHECK + '<span>' + T('okMid') + '</span></div>'
          : '<div class="bhm-ok">' + CHECK + '<span>' + T('okIdle') + '</span></div>') +
      '<button class="bhm-b go" data-a="home">' + T(mid ? 'goMid' : 'go') + '<small>' + T('goSub', true) + '</small></button>' +
      '<button class="bhm-b save" data-a="save">' + T('done') + '<small>' + T('doneSub', true) + '</small></button>' +
      '<p>' + T('note') + '</p>' +
      '<button class="bhm-b stay" data-a="stay">' + T('stay') + '</button></div>';
    ov.addEventListener('click', function (e) {
      if (e.target === ov) return close();
      var b = e.target.closest && e.target.closest('[data-a]'); if (!b) return;
      var a = b.getAttribute('data-a');
      if (a === 'home') goHome(); else if (a === 'save') openSave(); else close();
    });
    D.body.appendChild(ov); D.addEventListener('keydown', onKey, true);
    var f = ov.querySelector('.bhm-b.go'); if (f) try { f.focus(); } catch (e) {}
  }

  /* put the button into the top bar of whatever screen is showing (the pages re-draw themselves, so look again after each change) */
  function make() {
    var b = D.createElement('button'); b.type = 'button'; b.className = 'bhm'; var ttl = T('title', true).replace(/<[^>]*>/g, ''); b.setAttribute('aria-label', ttl); b.title = ttl; b.innerHTML = HOUSE;
    return b;   // clicks are caught by one listener on the page (below): the game re-uses its own buttons when it redraws, so a listener on this button could end up on the wrong one
  }
  function ensure() {
    css();
    var help = D.querySelector('button[aria-label="How to play"]');
    if (help && help.parentNode) {
      var prev = help.previousElementSibling;
      if (!(prev && prev.classList && prev.classList.contains('bhm'))) help.parentNode.insertBefore(make(), help);
      return;
    }
    var lv = D.querySelector('a.lvback');   // Aiutami
    if (lv && lv.parentNode && !lv.parentNode.querySelector('.bhm')) lv.parentNode.insertBefore(make(), lv.nextSibling);
  }
  D.addEventListener('click', function (e) {
    var b = e.target && e.target.closest ? e.target.closest('button.bhm') : null;
    if (!b) return;
    e.preventDefault(); e.stopPropagation(); open(b);
  }, true);
  var pend = false;
  function soon() { if (pend) return; pend = true; (W.requestAnimationFrame || setTimeout)(function () { pend = false; try { ensure(); } catch (e) {} }); }
  function boot() {
    ensure();
    try { new MutationObserver(soon).observe(D.body, { childList: true, subtree: true }); } catch (e) {}
  }
  if (D.readyState === 'loading') D.addEventListener('DOMContentLoaded', boot); else boot();
  W.BohHome = { open: open, close: close };
})(window, document);
