/* Boh · "Today link" from the Prof panel: one link tells students which stops to do today (sub days, "where I need them to be").
   Link:  .../italiano2/?unit=cibo&today=1,2,parla,prova&label=Sub%20day%20Oct%2014
          today = stop numbers (1-based), plus "parla" (Parla con Prof) and "prova" (La Prova). label = what the teacher wants them to see.
   What it does: shows a "Today" card on the home screen with one button per chosen stop, and hides the other stops on the path.
   It GUIDES, it does not lock: a student who has not reached a stop yet is sent to the stop they have reached, and "Show everything"
   brings the whole path back. Nothing is sent anywhere. The choice is kept on this device until the end of the day (device clock),
   so reopening the game the same day keeps it. Dates are only part of the label, because student device clocks can't be trusted.
   Created by Assunta Scotto, 2026. Not for redistribution. */
(function (W, D) {
  'use strict';
  var m = /\/(italiano[1-4]|ap)\//.exec(W.location.pathname); if (!m) return;
  var LV = m[1], KEY = 'boh_today_link_v1';
  function esc(t) { return String(t == null ? '' : t).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function today() { var d = new Date(); return d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate(); }
  function load() { try { var o = JSON.parse(localStorage.getItem(KEY) || 'null'); return o && o.lv === LV && o.day === today() ? o : null; } catch (e) { return null; } }
  function save(o) { try { if (o) localStorage.setItem(KEY, JSON.stringify(o)); else localStorage.removeItem(KEY); } catch (e) {} }
  /* read the link once */
  try {
    var q = new URLSearchParams(W.location.search), t = q.get('today');
    if (t) {
      var parts = t.split(',').map(function (x) { return x.trim().toLowerCase(); }).filter(Boolean);
      save({ lv: LV, day: today(), unit: q.get('unit') || '', stops: parts.filter(function (x) { return /^\d{1,2}$/.test(x); }).map(Number), parla: parts.indexOf('parla') !== -1, prova: parts.indexOf('prova') !== -1, label: (q.get('label') || 'Today').slice(0, 60) });
      try { q.delete('today'); q.delete('label'); var rest = q.toString(); history.replaceState(null, '', W.location.pathname + (rest ? '?' + rest : '')); } catch (e) {}
    }
  } catch (e) {}

  var CSS = '.btl{border:2.5px solid var(--primary-bg,#1A5CDF);border-radius:18px;padding:12px 14px;background:var(--card-bg,#fff);color:var(--text,#0E2A5B);display:flex;flex-direction:column;gap:8px}' +
    '.btl-k{font-size:16px;font-weight:800;letter-spacing:.06em;text-transform:uppercase;color:var(--primary-bg,#1A5CDF)}' +
    '.btl-t{font-size:20px;font-weight:800;line-height:1.2}' +
    '.btl-row{display:flex;flex-wrap:wrap;gap:8px}' +
    '.btl-b{all:unset;cursor:pointer;min-height:48px;padding:6px 14px;border-radius:14px;background:var(--primary-bg,#1A5CDF);color:var(--primary-text,#fff);font-size:18px;font-weight:800;display:inline-flex;align-items:center;gap:6px}' +
    '.btl-b.done{background:var(--option-default-bg,#E2EBFB);color:var(--text,#0E2A5B)}' +
    '.btl-x{all:unset;cursor:pointer;align-self:flex-start;font-size:16px;font-weight:700;text-decoration:underline;min-height:40px;display:inline-flex;align-items:center;color:var(--text-muted,#46566E)}' +
    '.btl-b:focus-visible,.btl-x:focus-visible{outline:3px solid var(--text,#0E2A5B);outline-offset:2px}' +
    '.btl-note{font-size:16px;color:var(--text-muted,#46566E)}' +
    'body.btl-on .lp-list li.btl-hide{display:none}body.btl-on .lp-prova.btl-hide{display:none}';
  var styled = false, note = '';
  function css() { if (styled) return; styled = true; var s = D.createElement('style'); s.textContent = CSS; D.head.appendChild(s); }

  function tick() {
    var o = load(), g = W.__game;
    var card = D.querySelector('.btl');
    if (!o || !g || !g.state) { if (card) card.parentNode.removeChild(card); D.body && D.body.classList.remove('btl-on'); return; }
    var unit = W.BT_UNIT || (typeof BT_UNIT !== 'undefined' ? BT_UNIT : '');
    if (o.unit && unit !== o.unit) { if (card) card.parentNode.removeChild(card); D.body.classList.remove('btl-on'); return; }
    if (g.state.screen !== 'home') return;
    css(); D.body.classList.add('btl-on');
    var Dd = g.lsData ? g.lsData() : null, L = Dd && g.lsState ? g.lsState() : null;
    /* hide the stops that are not for today */
    var lis = D.querySelectorAll('.lp-list li');
    for (var i = 0; i < lis.length; i++) lis[i].classList.toggle('btl-hide', o.stops.length > 0 && o.stops.indexOf(i + 1) === -1);
    var pv = D.querySelector('.lp-prova'); if (pv) pv.classList.toggle('btl-hide', !o.prova);
    var sig = JSON.stringify([o, L ? L.done : null, note]);
    if (card && card.getAttribute('data-sig') === sig) return;
    var anchor = D.querySelector('.start-card') || D.querySelector('.lp');
    if (!anchor) return;
    var btns = o.stops.filter(function (n) { return Dd && n >= 1 && n <= Dd.stops.length; }).map(function (n) {
      var dn = L && L.done.indexOf(n - 1) !== -1;
      return '<button type="button" class="btl-b' + (dn ? ' done' : '') + '" data-stop="' + n + '">' + (dn ? '&#10003; ' : '') + 'Tappa ' + n + ' · ' + esc(Dd.stops[n - 1].label) + '</button>';
    }).join('') +
      (o.parla && W.BohParla ? '<button type="button" class="btl-b" data-parla="1">&#127897; Parla con Prof</button>' : '') +
      (o.prova ? '<button type="button" class="btl-b" data-prova="1">La Prova</button>' : '');
    var html = '<div class="btl-k">&#128204; Oggi · Today</div><div class="btl-t">' + esc(o.label) + '</div><div class="btl-row">' + btns + '</div>' +
      (note ? '<div class="btl-note" role="status">' + esc(note) + '</div>' : '') +
      '<button type="button" class="btl-x" data-all="1">Show everything</button>';
    if (!card) { card = D.createElement('div'); card.className = 'btl'; card.setAttribute('role', 'region'); card.setAttribute('aria-label', 'Today'); anchor.parentNode.insertBefore(card, anchor); }
    card.innerHTML = html; card.setAttribute('data-sig', sig);
    card.onclick = function (e) {
      var b = e.target.closest ? e.target.closest('button') : null; if (!b) return;
      if (b.hasAttribute('data-all')) { save(null); note = ''; tick(); return; }
      if (b.hasAttribute('data-parla')) { try { W.BohParla.open(); } catch (er) {} return; }
      if (b.hasAttribute('data-prova')) { try { var btn = D.querySelector('.lp-prova'); if (btn && !btn.disabled) btn.click(); else { note = 'La Prova opens after the last stop.'; card.removeAttribute('data-sig'); tick(); } } catch (er) {} return; }
      var want = +b.getAttribute('data-stop') - 1;
      try {
        var fr = Math.max(g.lsFrontier(L, Dd), ((g.state.profU || {}).openTo) || 0);
        if (want > fr) { note = 'First finish Tappa ' + (fr + 1) + '. It opens the next ones.'; g.lsStart(fr); }
        else { note = ''; g.lsStart(want); }
      } catch (er) {}
    };
  }
  setInterval(tick, 500);
  W.BohTodayLink = { get: load, clear: function () { save(null); } };
})(window, document);
