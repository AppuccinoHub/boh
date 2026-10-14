/* Boh · phone play screen helper. ONE file for every level.
   Marks the question word with data-pl = s (short word), m (short line) or l (long sentence),
   so bohphone.css can show a single word BIG and a long sentence smaller. Changes no answers, scores or saved data.
   Created by Assunta Scotto, 2026. Not for redistribution. */
(function (W, D) {
  'use strict';
  if (W.__bohPhone) return;
  W.__bohPhone = true;
  var pend = 0;
  function mark() {
    pend = 0;
    var els = D.querySelectorAll('.play-prompt'), i, el, n, v;
    for (i = 0; i < els.length; i++) {
      el = els[i]; n = (el.textContent || '').replace(/\s+/g, ' ').trim().length;
      v = n <= 16 ? 's' : n <= 40 ? 'm' : 'l';
      if (el.getAttribute('data-pl') !== v) el.setAttribute('data-pl', v);
    }
  }
  function later() { if (!pend) pend = W.requestAnimationFrame ? W.requestAnimationFrame(mark) : setTimeout(mark, 50); }
  function go() {
    var app = D.getElementById('app') || D.body;
    try { new MutationObserver(later).observe(app, { childList: true, subtree: true, characterData: true }); } catch (e) {}
    mark();
  }
  if (D.readyState === 'loading') D.addEventListener('DOMContentLoaded', go); else go();
})(window, document);

/* ===================================================================== boh-fit-v3
   Fit to screen for every level, the In classe / Aiutami pages and the shared overlays. Rules and sizes are in bohphone.css (boh-fit-v3).
   What this script does on every screen change:
   1. Floor: any text still under its minimum gets a class that sets it to 16px (answers and buttons 18px, prompts 24px).
   2. Fit: if the screen has room, the whole screen grows together (up to 1.45x) and Boh grows faster (up to 240px tall).
      If it does not fit: Boh shrinks (to 80px), then hides on question screens; then extra content moves behind an "Avanti" button.
   3. After a mistake on a lesson screen, the tip becomes a bottom panel with Riprova and a small "Mostrami la risposta" link.
   The home screen is left alone. Nothing here changes answers, scores or saved data. Created by Assunta Scotto, 2026. */
(function (W, D) {
  'use strict';
  if (W.__bohFit3) return;
  W.__bohFit3 = true;
  var MAXG = 1.45, BOHMAX = 240, BOHMIN = 80, pend = 0, busy = false, skip = false, page = { key: '', n: 0 }, T = [];
  var PROMPT = '.ls-prompt,.ls-head,.play-prompt,.lz-q,.lz-big,.bl-q';
  var ANSWER = 'button,input,textarea,select,.ls-opt,.ls-tile,.ls-word,.ls-tx,.ls-ph-m,.ls-q b,.opt-grid button,.lz-opt,.lz-tile,.lz-line';
  function q(s, r) { return (r || D).querySelector(s); }
  function look() { return q('.look'); }
  function screen() { var l = look(); return l ? l.getAttribute('data-screen') : (q('.lz') ? 'lz' : ''); }
  function over() { var se = D.scrollingElement || D.documentElement; return se.scrollHeight - W.innerHeight; }
  function vis(e) { if (!e || !e.getClientRects().length) return false; var cs = getComputedStyle(e); return cs.display !== 'none' && cs.visibility !== 'hidden'; }

  /* 1. floor */
  function floor(scope) {
    if (!scope) return;
    var all = scope.querySelectorAll('*');
    for (var i = 0; i < all.length; i++) {
      var e = all[i], t = false;
      if (/^(SCRIPT|STYLE|SVG|PATH|I)$/i.test(e.tagName)) continue;
      if (e.tagName !== 'INPUT' && e.tagName !== 'TEXTAREA') { for (var n = e.firstChild; n; n = n.nextSibling) if (n.nodeType === 3 && n.textContent.trim()) { t = true; break; } }
      else t = true;
      if (!t) continue;
      var need = e.matches(PROMPT) || (e.closest && e.closest(PROMPT)) ? 24 : (e.matches(ANSWER) || (e.closest && e.closest(ANSWER))) ? 18 : 16;
      if (e.closest('.ls-chart,.lc')) need = 16;   /* verb charts: 16px is the floor; 18px does not fit five columns on a phone */
      var f = parseFloat(getComputedStyle(e).fontSize);
      if (f + 0.01 < need) e.classList.add(need === 24 ? 'bf-f24' : need === 18 ? 'bf-f18' : 'bf-f16');
    }
  }
  /* the handwriting bubble is only for short lines */
  function bubble() {
    var b = q('.ls-bubble'); if (!b) return;
    var long = (b.textContent || '').trim().length > 70;
    if (long !== b.classList.contains('bf-long')) b.classList.toggle('bf-long', long);
  }

  /* 2. fit */
  function rootEl() {
    var s = screen();
    if (s === 'lesson') return q('.ls');
    if (s === 'play') return q('.play-col');
    if (s === 'lz') return q('.lz');
    return null;
  }
  function boh(root) { return root ? q('.ls-doll,.lz-bust', root) : null; }
  function isQuestion(root) { return !!q('.ls-opts,.ls-sent,.ls-slot,.ls-words,.ls-chat,.opt-grid,.sc-wrap,.lz-opts,.lz-slots', root); }
  function setZoom(el, z) { el.style.zoom = z === 1 ? '' : String(Math.round(z * 1000) / 1000); }
  function search(lo, hi, ok) { if (!ok(lo)) return null; if (ok(hi)) return hi; for (var i = 0; i < 7; i++) { var m = (lo + hi) / 2; if (ok(m)) lo = m; else hi = m; } ok(lo); return lo; }

  function paging(root) {
    var card = q('.ls-card', root); if (!card) return false;
    var acts = q('.ls-actions', card), pager = q('.bf-pager', card);
    if (pager) pager.remove();
    if (acts) acts.style.display = '';
    [].forEach.call(card.querySelectorAll('.bf-later'), function (b) { b.classList.remove('bf-later'); });
    var room = W.innerHeight - 12 - Math.max(acts ? acts.offsetHeight + 14 : 0, 66);
    var top0 = null;
    function split(list, depth) {   /* a part taller than the room is split into its own parts (two levels deep at most) */
      var out = [];
      list.forEach(function (c) {
        if (c === acts || c.classList.contains('ls-kick')) return;
        if (!c.offsetHeight) return;
        if (top0 === null) top0 = c.getBoundingClientRect().top;
        if (depth < 2 && c.children.length > 1 && c.offsetHeight > (room - top0) * 0.6) out = out.concat(split([].slice.call(c.children), depth + 1));
        else out.push(c);
      });
      return out;
    }
    var blocks = split([].slice.call(card.children), 0);
    if (blocks.length < 2) return false;
    var pages = [[]], used = top0, start = top0;
    blocks.forEach(function (b) {
      var h = b.getBoundingClientRect().height + 10;
      if (pages[pages.length - 1].length && used + h > room) { pages.push([]); used = start; }
      pages[pages.length - 1].push(b); used += h;
    });
    if (pages.length < 2) return false;
    var key = (W.__game && W.__game.state ? W.__game.state.lsCur + ':' + W.__game.state.lsI : '') + ':' + blocks.length;
    if (page.key !== key) page = { key: key, n: 0 };
    if (page.n >= pages.length) page.n = pages.length - 1;
    pages.forEach(function (p, i) { p.forEach(function (b) { if (i !== page.n) b.classList.add('bf-later'); }); });
    var last = page.n === pages.length - 1;
    if (acts) acts.style.display = last ? '' : 'none';
    var pg = D.createElement('div'); pg.className = 'bf-pager';
    pg.innerHTML = (page.n > 0 ? '<button type="button" class="bf-back">&lsaquo; Indietro</button>' : '') +
      '<span class="bf-pagehint">' + (page.n + 1) + ' / ' + pages.length + '</span>' + (last ? '' : '<button type="button" class="bf-next">Avanti &rsaquo;</button>');
    pg.addEventListener('click', function (e) {
      var b = e.target.closest ? e.target.closest('button') : null; if (!b) return;
      page.n += b.classList.contains('bf-next') ? 1 : -1; later();
    });
    card.insertBefore(pg, acts || null);
    return true;
  }

  function fit() {
    pend = 0; if (busy) return; busy = true;
    try {
      var s = screen();
      if (s && s !== 'home') floor(s === 'lz' ? q('.lz') : look());
      ['#blst', '#brit', '#bcel', '.bid', '.btl', '.pop-ov'].forEach(function (sel) { var x = q(sel); if (x) floor(x); });
      bubble();
      var root = rootEl();
      D.body.classList.toggle('bf-sheet', !!(root && s === 'lesson' && q('.ls-card .ls-bad', root)));
      sheet(root);
      if (!root) { busy = false; return; }
      var bh = boh(root);
      /* reset */
      root.style.width = ''; setZoom(root, 1); if (bh) { setZoom(bh, 1); bh.classList.remove('bf-noboh'); }
      var st0 = q('.ls-boh', root); if (st0) st0.classList.remove('bf-noboh');
      if (s === 'lesson') { var pgr = q('.bf-pager', root); if (pgr) pgr.remove(); [].forEach.call(root.querySelectorAll('.bf-later'), function (b) { b.classList.remove('bf-later'); }); var ac = q('.ls-card .ls-actions', root); if (ac) ac.style.display = ''; }
      var bh0 = bh && vis(bh) ? bh.getBoundingClientRect().height : 0;
      if (over() <= 1) {
        /* room to spare: grow everything together, then Boh a little more */
        var z = search(1, MAXG, function (v) { setZoom(root, v); root.style.width = v === 1 ? '' : 'calc(100% / ' + v + ')'; return over() <= 1; }) || 1;
        if (bh && bh0) {
          var emax = Math.max(1, BOHMAX / (bh0 * z));
          if (emax > 1) search(1, emax, function (v) { setZoom(bh, v); return over() <= 1; });
        }
      } else {
        /* too tight: Boh first, then hide Boh on question screens, then pages */
        if (bh && bh0) {
          var emin = Math.min(1, BOHMIN / bh0);
          if (search(emin, 1, function (v) { setZoom(bh, v); return over() <= 1; }) === null) {
            setZoom(bh, emin);
            if (isQuestion(root)) { bh.classList.add('bf-noboh'); var st1 = q('.ls-boh', root); if (st1 && over() > 1) st1.classList.add('bf-noboh'); }
          }
        }
        if (over() > 1 && s === 'lesson') paging(root);
        /* last resort: Boh and the speech bubble step aside, and the parts are laid out again */
        var stage = q('.ls-boh', root);
        if (over() > 1 && stage) { stage.classList.add('bf-noboh'); if (s === 'lesson') paging(root); }
      }
    } catch (e) { try { console.warn('boh-fit-v3', e); } catch (_) {} }
    busy = false; skip = true; Promise.resolve().then(function () { skip = false; });   /* ignore the changes this step made itself */
  }

  /* 3. the bottom panel after a mistake (lesson screens) */
  function sheet(root) {
    var acts = root && q('.ls-card .ls-actions', root), bad = root && q('.ls-card .ls-bad', root);
    var old = q('.bf-sheetbtns');
    if (!acts || !bad || !D.body.classList.contains('bf-sheet')) { if (old) old.remove(); return; }
    D.documentElement.style.setProperty('--bf-acts-h', acts.offsetHeight + 'px');
    if (old && old.parentNode === acts) return;
    if (old) old.remove();
    var g = W.__game, it = null; try { it = g.lsItem().it; } catch (e) {}
    var hasRetry = !!q('.ls-btn', acts) && /Riprova/i.test(q('.ls-btn', acts).textContent);
    var box = D.createElement('div'); box.className = 'bf-sheetbtns'; box.style.cssText = 'display:flex;flex-direction:column;gap:4px';
    box.innerHTML = (hasRetry ? '' : '<button type="button" class="bf-retry">Riprova</button>') + '<button type="button" class="bf-showme">Mostrami la risposta</button>';
    box.addEventListener('click', function (e) {
      var b = e.target.closest ? e.target.closest('button') : null; if (!b || !g) return;
      if (b.classList.contains('bf-retry')) {   /* close the panel: the answers are all there again */
        try { var o = JSON.parse(JSON.stringify(g.state.lsIt)); o.st = 'ask'; o.msg = ''; g.setState({ lsIt: o }); } catch (er) {}
      } else {   /* show the answer (the same "La risposta" the lesson shows after two tries); it does not cost a heart */
        try { var o2 = JSON.parse(JSON.stringify(g.state.lsIt)); o2.st = 'shown'; g.setState({ lsIt: o2 }); } catch (er) {}
      }
    });
    acts.insertBefore(box, acts.firstChild);
  }

  function later() { if (pend) return; pend = (W.requestAnimationFrame || setTimeout)(function () { fit(); T.forEach(clearTimeout); T = [setTimeout(fit, 200), setTimeout(fit, 700)]; }); }
  function go() {
    try { new MutationObserver(function () { if (!busy && !skip) later(); }).observe(D.body, { childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: ['class', 'data-screen'] }); } catch (e) {}
    later();
  }
  W.addEventListener('resize', later); W.addEventListener('orientationchange', later);
  if (D.fonts && D.fonts.ready) D.fonts.ready.then(later);
  if (D.readyState === 'loading') D.addEventListener('DOMContentLoaded', go); else go();
  W.BohFit = { run: fit };
})(window, document);
