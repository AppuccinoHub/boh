/* Boh · the prize-box reveal ("Pacco Boh"). One file for every level: styles + the confetti.
   The student's own Boh replaces the old head-only picture. The more rare the prize, the bigger the party:
     COMUNE: Boh hops, a few sparkles.   RARO: + a glow behind the prize and confetti.
     EPICO and ASSURDO: + Prof claps with a pun and there is more confetti.
   The page markup only carries data-rar="<rarity>" on .pacco-rev; everything else is here.
   Art: uses only the pictures already in the game (Prof's clapping bust, the student's own Boh). Nothing new is drawn here.
   Respects "reduce motion" (no confetti, no movement). */
(function () {
  'use strict';
  var COL = { COMUNE: '#6B7280', RARO: '#2F6BC7', EPICO: '#7C3AED', ASSURDO: '#D63B74' };
  var CONF = { COMUNE: 0, RARO: 26, EPICO: 46, ASSURDO: 72 };
  var SPARK = { COMUNE: 4, RARO: 8, EPICO: 12, ASSURDO: 16 };
  function reduced() { try { return window.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) { return false; } }

  function css() {
    if (document.getElementById('bpz-css')) return;
    var s = document.createElement('style'); s.id = 'bpz-css';
    s.textContent =
      '.pacco-rev{--rc:#6B7280;--rg:107,114,128;position:relative}' +
      '.pacco-rev[data-rar="RARO"]{--rc:#2F6BC7;--rg:47,107,199}' +
      '.pacco-rev[data-rar="EPICO"]{--rc:#7C3AED;--rg:124,58,237}' +
      '.pacco-rev[data-rar="ASSURDO"]{--rc:#D63B74;--rg:214,59,116}' +
      '.pacco-say{background:var(--card-bg,#fff);border:2px solid var(--card-border,#CBD5E1);border-radius:16px;padding:8px 16px;font:800 19px/1.2 system-ui,sans-serif;color:var(--text,#0E2A5B);text-align:center}' +
      '.pacco-prof{display:none;align-items:center;justify-content:center;gap:10px}' +
      '.pacco-rev[data-rar="EPICO"] .pacco-prof,.pacco-rev[data-rar="ASSURDO"] .pacco-prof{display:flex}' +
      '.pacco-prof img{height:92px;width:auto}' +
      '.pacco-prof .pp-bub{position:relative;background:var(--card-bg,#fff);border:2px solid var(--card-border,#CBD5E1);border-radius:16px;padding:8px 14px;font:700 21px/1.15 Georgia,serif;color:var(--text,#0E2A5B);text-align:left}' +
      '.pacco-prof .pp-bub::before{content:"";position:absolute;left:-11px;top:50%;margin-top:-9px;border:9px solid transparent;border-left:0;border-right-color:var(--card-border,#CBD5E1)}' +
      '.pacco-prof .pp-bub::after{content:"";position:absolute;left:-7px;top:50%;margin-top:-7px;border:7px solid transparent;border-left:0;border-right-color:var(--card-bg,#fff)}' +
      '.pacco-prof .pp-bub small{display:none;font:700 12px/1.2 system-ui,sans-serif;color:var(--text-muted,#46566E);margin-top:2px}' +
      'html[data-en="1"] .pacco-prof .pp-bub small{display:block}' +
      '.pacco-row{position:relative}' +
      '.pacco-row>*{position:relative;z-index:1}' +
      '.pacco-rev:not([data-rar="COMUNE"]) .pacco-row::before{content:"";position:absolute;left:50%;top:50%;width:250px;height:250px;margin:-125px 0 0 -125px;border-radius:50%;background:radial-gradient(circle,rgba(var(--rg),.55) 0,rgba(var(--rg),.2) 45%,rgba(var(--rg),0) 70%);z-index:0;pointer-events:none;animation:bpzPulse 1.8s ease-in-out infinite}' +
      '.pacco-rev[data-rar="EPICO"] .pacco-row::before,.pacco-rev[data-rar="ASSURDO"] .pacco-row::before{width:320px;height:320px;margin:-160px 0 0 -160px}' +
      '@keyframes bpzPulse{0%,100%{transform:scale(.92);opacity:.85}50%{transform:scale(1.08);opacity:1}}' +
      '.pacco-rev .pacco-row .doll{animation:bpzHop .7s ease-in-out 3}' +
      '@keyframes bpzHop{0%,100%{transform:translateY(0)}35%{transform:translateY(-18px) rotate(-3deg)}70%{transform:translateY(0) rotate(3deg)}}' +
      '.pacco-pre-boh{zoom:.6;display:flex;justify-content:center}' +
      '#bpz-fx{position:fixed;inset:0;pointer-events:none;z-index:99970;overflow:hidden}' +
      '#bpz-fx i{position:absolute;top:-24px;display:block;border-radius:2px;opacity:0;animation:bpzFall var(--t,2.4s) cubic-bezier(.3,.1,.6,1) var(--d,0s) forwards}' +
      '@keyframes bpzFall{0%{opacity:1;transform:translateY(0) rotate(0)}85%{opacity:1}100%{opacity:0;transform:translateY(105vh) rotate(var(--r,540deg))}}' +
      '#bpz-fx b{position:absolute;font-weight:400;color:#F5B700;opacity:0;animation:bpzTw 1.4s ease-in-out var(--d,0s) 2}' +
      '@keyframes bpzTw{0%,100%{opacity:0;transform:scale(.4)}50%{opacity:1;transform:scale(1.15)}}' +
      '@media (prefers-reduced-motion:reduce){.pacco-rev .pacco-row .doll,.pacco-rev .pacco-row::before{animation:none!important}#bpz-fx{display:none}}';
    document.head.appendChild(s);
  }

  var fx = null, rnd = 1;
  function r() { rnd = (rnd * 9301 + 49297) % 233280; return rnd / 233280; }
  function burst(tier) {
    if (reduced()) return;
    css();
    if (fx && fx.parentNode) fx.parentNode.removeChild(fx);
    fx = document.createElement('div'); fx.id = 'bpz-fx'; fx.setAttribute('aria-hidden', 'true');
    var cols = [COL[tier] || '#2F6BC7', '#F5B700', '#E63E8F', '#1A5CDF', '#2EAD5B'];
    var n = CONF[tier] || 0, k, e, w;
    for (k = 0; k < n; k++) {
      e = document.createElement('i'); w = 6 + r() * 7;
      e.style.cssText = 'left:' + (r() * 100).toFixed(1) + '%;width:' + w.toFixed(1) + 'px;height:' + (w * 1.7).toFixed(1) + 'px;background:' + cols[k % cols.length] + ';--d:' + (r() * 0.9).toFixed(2) + 's;--t:' + (1.8 + r() * 1.4).toFixed(2) + 's;--r:' + Math.round(360 + r() * 720) + 'deg';
      fx.appendChild(e);
    }
    var sp = SPARK[tier] || 0;
    for (k = 0; k < sp; k++) {
      e = document.createElement('b'); e.textContent = '✦';
      e.style.cssText = 'left:' + (r() < 0.5 ? 6 + r() * 30 : 64 + r() * 30).toFixed(1) + '%;top:' + (28 + r() * 32).toFixed(1) + '%;font-size:' + (14 + r() * 14).toFixed(0) + 'px;--d:' + (r() * 1.2).toFixed(2) + 's';
      fx.appendChild(e);
    }
    document.body.appendChild(fx);
    setTimeout(function () { if (fx && fx.parentNode) fx.parentNode.removeChild(fx); fx = null; }, 5200);
  }

  var wasThere = false, last = '';
  function tick() {
    var el = document.querySelector('.pacco-rev'); var there = !!el;
    css();
    if (there) {
      var key = (el.getAttribute('data-rar') || '') + '|' + ((el.querySelector('.display') || {}).textContent || '');
      if (!wasThere || key !== last) { last = key; burst(el.getAttribute('data-rar')); }
    } else if (fx && fx.parentNode) { fx.parentNode.removeChild(fx); fx = null; }
    wasThere = there;
  }
  setInterval(tick, 300);
})();
