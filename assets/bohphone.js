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
  /* MAXG = 1: screens no longer grow with CSS zoom. Safari works out zoomed sizes differently from Chrome, so on iPhones the
     fit step saw a too-tall screen, hid Boh, moved answers to another page and pushed windows off the bottom. Sizes come from the floor rules instead. */
  /* Chrome (Chromebooks, Android, Windows) measures zoomed screens correctly, so screens may grow there to fill the space.
     Safari and every iPhone browser (all WebKit) do not, so screens never grow there. */
  var UA = (W.navigator && W.navigator.userAgent) || '', BLINK = /Chrome\//.test(UA) && !/CriOS|FxiOS|EdgiOS|OPiOS/.test(UA);
  var MAXG = BLINK ? 1.45 : 1, BOHMAX = 240, BOHMIN = 80, pend = 0, busy = false, skip = false, page = { key: '', n: 0 }, T = [];
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
  /* grow a screen by zoom and keep it exactly as wide as the screen. Safari and Chrome work out zoomed widths differently,
     so the width is measured, not assumed: try each way and keep the one that fills the space without going past it. */
  /* a full-screen window (tips cards, pop-ups) sitting inside the screen: zoom would push it off the bottom in Safari */
  function ovIn(root) { return [].some.call(root.querySelectorAll('[class*="-ov"]'), function (e) { return vis(e) && getComputedStyle(e).position === 'fixed'; }); }
  function grow(root, v) {
    if (ovIn(root)) v = 1;
    setZoom(root, v); root.style.width = '';
    if (v === 1) return;
    var par = root.parentElement; if (!par) return;
    var cs = getComputedStyle(par), want = par.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
    var ways = ['calc(100% / ' + v + ')', '100%', ''], best = '', bd = 1e9;
    for (var i = 0; i < ways.length; i++) { root.style.width = ways[i]; var d = Math.abs(root.getBoundingClientRect().width - want); if (d < bd - 0.5) { bd = d; best = ways[i]; } }
    root.style.width = best;
  }
  function setZoom(el, z) { el.style.zoom = z === 1 ? '' : String(Math.round(z * 1000) / 1000); }
  function search(lo, hi, ok) { if (!ok(lo)) return null; if (ok(hi)) return hi; for (var i = 0; i < 7; i++) { var m = (lo + hi) / 2; if (ok(m)) lo = m; else hi = m; } ok(lo); return lo; }

  function paging(root, extra) {
    var card = q('.ls-card', root); if (!card) return false;
    var acts = q('.ls-actions', card), pager = q('.bf-pager', card);
    if (pager) pager.remove();
    if (acts) acts.style.display = '';
    [].forEach.call(card.querySelectorAll('.bf-later'), function (b) { b.classList.remove('bf-later'); });
    var room = W.innerHeight - 12 - (extra || 0) - Math.max(acts ? acts.offsetHeight + 14 : 0, 66);
    var top0 = null;
    function split(list, depth) {   /* a part taller than the room is split into its own parts (two levels deep at most) */
      var out = [];
      list.forEach(function (c) {
        if (c === acts || c.classList.contains('ls-kick')) return;
        if (!c.offsetHeight) return;
        if (top0 === null) top0 = c.getBoundingClientRect().top;
        var cs = getComputedStyle(c), canSplit = depth < 2 && c.children.length > 1 && cs.display !== 'grid' && cs.display !== 'inline-grid' && cs.flexDirection !== 'row' &&
          !c.matches('.ls-chart,.ls-phone,.ls-opts,.ls-sent,.ls-fc,.ls-slot,.ls-bank,.ls-words,.ls-uses,table,.ls-spia');
        if (canSplit && c.offsetHeight > (room - top0) * 0.6) out = out.concat(split([].slice.call(c.children), depth + 1));
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
    if (pages.length < 2 || pages.length > 8) { [].forEach.call(card.querySelectorAll('.bf-later'), function (b) { b.classList.remove('bf-later'); }); return false; }
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

  /* play screens with a reading text (Il tema): the text gets its own screen, then the question with its answers; "Rileggi" goes back */
  var pas = { key: '', show: true };
  function passage(root) {
    var pr = q('.play-prompt', root), box = pr && pr.previousElementSibling;
    if (!box || (box.textContent || '').length < 120 || box.classList.contains('bf-pbar')) return;
    var g = W.__game, key = g && g.state ? g.state.mode + ':' + g.state.qIndex : '';
    if (pas.key !== key) pas = { key: key, show: true };
    var after = [], n = pr; while (n) { after.push(n); n = n.nextElementSibling; }
    for (var a = pr.parentNode; a && a !== root && a.parentNode; a = a.parentNode) { var m = a.nextElementSibling; while (m) { after.push(m); m = m.nextElementSibling; } }
    var bar = D.createElement('div'); bar.className = 'bf-pager bf-pbar';
    if (pas.show) {
      after.forEach(function (e) { e.classList.add('bf-later'); });
      bar.innerHTML = '<span class="bf-pagehint">1 / 2 · Leggi il testo</span><button type="button" class="bf-next">Domanda &rsaquo;</button>';
      box.parentNode.insertBefore(bar, box.nextSibling);
    } else {
      box.classList.add('bf-later');
      bar.innerHTML = '<button type="button" class="bf-back">&#128214; Rileggi il testo</button><span class="bf-pagehint">2 / 2</span>';
      box.parentNode.insertBefore(bar, box);
    }
    bar.addEventListener('click', function (e) { var b = e.target.closest ? e.target.closest('button') : null; if (!b) return; pas.show = !b.classList.contains('bf-next'); later(); });
    if (over() > 1) root.classList.add('bf-reading');
  }

  /* lay the parts out in pages; if the first try still runs over, try again with a little less room, at most 3 times */
  function pageFit(root) {
    paging(root, 0); var ex = 0, prev = over();
    for (var r = 0; r < 3 && prev > 1; r++) { ex += prev + 4; if (ex > W.innerHeight * 0.35) break; paging(root, ex); var now = over(); if (now >= prev) break; prev = now; }
  }

  function fit() {
    pend = 0; if (busy) return; busy = true; lastFit = Date.now();
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
      root.style.width = ''; setZoom(root, 1); root.classList.remove('bf-t1', 'bf-t2', 'bf-t3', 'bf-reading');
      if (s === 'play') { [].forEach.call(root.querySelectorAll('.bf-pbar'), function (b) { b.remove(); }); [].forEach.call(root.querySelectorAll('.bf-later'), function (b) { b.classList.remove('bf-later'); }); }
      var m0 = q('.ls-ph-msgs', root); if (m0) { m0.style.maxHeight = ''; m0.style.minHeight = ''; m0.style.overflowY = ''; } var d0 = q('.boh-chatdir', root); if (d0) d0.classList.remove('bf-later');
      if (bh) { setZoom(bh, 1); bh.classList.remove('bf-noboh'); }
      var st0 = q('.ls-boh', root); if (st0) st0.classList.remove('bf-noboh');
      if (s === 'lesson') { var pgr = q('.bf-pager', root); if (pgr) pgr.remove(); [].forEach.call(root.querySelectorAll('.bf-later'), function (b) { b.classList.remove('bf-later'); }); var ac = q('.ls-card .ls-actions', root); if (ac) ac.style.display = ''; }
      var bh0 = bh && vis(bh) ? bh.getBoundingClientRect().height : 0;
      if (over() <= 1) {
        /* room to spare: grow everything together, then Boh a little more */
        var z = search(1, MAXG, function (v) { grow(root, v); return over() <= 1; }) || 1;
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
        if (over() > 1 && s === 'play') {
          root.classList.add('bf-t1');
          if (over() > 1) {
            root.classList.add('bf-t2');
            [].forEach.call(root.querySelectorAll('div'), function (d) { if (!d.children.length && /^(WRITE IT IN ITALIAN|WORD HELP)/.test((d.textContent || '').trim())) d.classList.add('bf-later'); });
            if (over() > 1) root.classList.add('bf-t3');
            if (over() > 1) root.classList.add('bf-reading');
            if (over() > 1) { var pp = q('.play-prompt', root), sub = pp && pp.nextElementSibling; for (var k3 = 0; sub && k3 < 3; k3++, sub = sub.nextElementSibling) if (/^\(/.test((sub.textContent || '').trim()) && sub.textContent.length < 90) { sub.classList.add('bf-later'); break; } }
          }
        }
        var phone = s === 'lesson' && q('.ls-phone', root);
        if (over() > 1 && phone) {   /* the chat: the help box steps aside, then the chat window gets shorter (it scrolls inside, like a real phone) */
          var dir = q('.boh-chatdir', root); if (dir) dir.classList.add('bf-later');
          var msgs = q('.ls-ph-msgs', root);
          if (over() > 1 && msgs) { msgs.style.minHeight = '0'; var o = over(); if (o > 1) { msgs.style.maxHeight = Math.max(110, msgs.offsetHeight - o - 2) + 'px'; msgs.style.overflowY = 'auto'; } }
        }
        if (over() > 1 && s === 'lesson' && !phone) pageFit(root);
        if (over() > 1 && s === 'play') passage(root);
        /* after the content moved to more screens, use any room that is left over */
        if (over() <= 1) search(1, MAXG, function (v) { grow(root, v); return over() <= 1; });
        /* last resort: Boh and the speech bubble step aside, and the parts are laid out again */
        var stage = q('.ls-boh', root);
        if (over() > 1 && stage) { stage.classList.add('bf-noboh'); if (s === 'lesson' && !phone) pageFit(root); }
        /* the chat window takes back any room that is left, so it is never smaller than it has to be */
        var mg = phone && q('.ls-ph-msgs', root);
        if (mg && mg.style.maxHeight) {
          var h0 = mg.offsetHeight, full = mg.scrollHeight;
          if (full > h0) search(h0, full, function (v) { mg.style.maxHeight = Math.round(v) + 'px'; return over() <= 1; });
          mg.scrollTop = mg.scrollHeight;
        }
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
  /* safety net: if the screen changed and no change was seen (for example while this step was ignoring its own changes), fit again */
  var lastSig = '', lastFit = 0, tries = 0;
  setInterval(function () {
    var g = W.__game, st = g && g.state ? g.state : {}, root = rootEl();
    var sig = screen() + '|' + st.lsCur + '|' + st.lsI + '|' + (st.lsIt ? st.lsIt.st : '') + '|' + st.qIndex + '|' + st.mode + '|' + (root ? root.childElementCount : 0) + '|' + W.innerWidth + 'x' + W.innerHeight;
    if (sig !== lastSig) { lastSig = sig; tries = 0; later(); }
    else if (root && tries < 3 && over() > 1 && Date.now() - lastFit > 1200) { tries++; later(); }   /* still running over: try once more */
  }, 500);
  W.addEventListener('resize', later); W.addEventListener('orientationchange', later);
  if (D.fonts && D.fonts.ready) D.fonts.ready.then(later);
  if (D.readyState === 'loading') D.addEventListener('DOMContentLoaded', go); else go();
  W.BohFit = { run: fit };
})(window, document);
