/* Boh hover English.
   Every Italian word on the page gets a faint dotted underline. Hover it (or tap it) and the English shows.
   No change to the page's own HTML: the underline is a CSS Highlight, so the game's screens are never touched.
   Off where it would give answers away: answer buttons, typing boxes, flashcards, the text-message chats
   (they have their own help that fades), La Prova and "what does it mean?" cards (the page says so via window.BohGlossOff). */
(function () {
  'use strict';
  var D = window.BOH_GLOSS || {};
  var CLASH = {}; (window.BOH_GLOSS_CLASH || []).forEach(function (w) { CLASH[w] = 1; });
  var MAXW = 6;
  var SKIP = 'button,a,input,textarea,select,option,label,script,style,noscript,svg,canvas,[contenteditable],[data-nogloss],' +
             '.ls-phone,.gl,.bfc,.pv-shot,.boh-gl-tip,.ls-en,.ls-ph-en,.ls-why,.ls-tt,.tc-qo,.credit-line,.credit-name,.wmark,.home-credit';
  var ENW = /\b(the|you|your|is|of|and|to|for|it|this|that|with|what|we|they|be|on|at|my|have|has|was|not|each|tap|read|write|out|get|more|from|here|then|need|see|word|words|answer|round|correct|next|play|save|open|first|will|can|after|before|try|right|wrong|day|days|one|two|it's|you're|don't|i'm|he|she|his|her|who|how|why|when|which|do|does|are|an|or|if|all|just|now)\b/gi;
  var WORD = /[A-Za-zÀ-ÖØ-öø-ÿ]+['’]?/g;
  var hl = null;
  try { if (window.CSS && CSS.highlights && window.Highlight) { hl = new Highlight(); CSS.highlights.set('boh-gloss', hl); } } catch (e) { hl = null; }
  var spans = [];
  var tip = null, tipFor = null, tipTimer = 0, sticky = false;

  function names() {   // the student's Boh name is a name, not a word ("Mia" is not "my")
    var out = { boh: 1 };
    try { var p = JSON.parse(localStorage.getItem('boh_profile_v1') || '{}'); String(p.bohName || '').split(/\s+/).forEach(function (w) { if (w) out[key(w)] = 1; }); } catch (e) {}
    return out;
  }
  var NAMES = names();
  function off() { try { return !!(window.BohGlossOff && window.BohGlossOff()); } catch (e) { return false; } }
  function key(t) { return t.toLowerCase().replace(/’/g, "'"); }

  function englishish(text, toks) {
    var en = (text.match(ENW) || []).length, it = 0;
    for (var i = 0; i < toks.length; i++) { var k = key(toks[i].w); if (D[k] && !CLASH[k]) it++; }
    return en > 0 && en >= it;
  }

  function edgeChar(node, fwd) {   // the letter right after (or before) this text node, even inside the next tag: "mangi<b>o</b>"
    var n = node;
    for (var up = 0; up < 4 && n; up++) {
      var sib = fwd ? n.nextSibling : n.previousSibling;
      if (sib) {
        var t = sib.textContent || ''; if (!t) { n = sib; up--; continue; }
        if (sib.nodeType === 1 && /^(DIV|P|LI|BR|TD|TR|SECTION|BUTTON)$/.test(sib.tagName)) return ' ';
        return fwd ? t.charAt(0) : t.charAt(t.length - 1);
      }
      n = n.parentNode;
      if (n && n.nodeType === 1 && getComputedStyle(n).display !== 'inline') return ' ';
    }
    return ' ';
  }
  var LET = /[A-Za-zÀ-ÖØ-öø-ÿ]/;
  function scanNode(node) {
    var text = node.nodeValue;
    if (!text || text.length < 2 || !/[A-Za-zÀ-ÿ]/.test(text)) return;
    var letters = text.replace(/[^A-Za-zÀ-ÿ]/g, '');
    if (letters.length >= 4 && letters === letters.toUpperCase()) return;   // ALL-CAPS labels
    var toks = [], m; WORD.lastIndex = 0;
    while ((m = WORD.exec(text))) {
      if (m.index > 0 && /[-–]/.test(text.charAt(m.index - 1))) continue;   // endings in the charts: -o, -i, -are
      if (NAMES[key(m[0])] && /^[A-ZÀ-Ý]/.test(m[0])) continue;
      if (m.index === 0 && LET.test(edgeChar(node, false))) continue;                       // part of a longer word
      if (m.index + m[0].length === text.length && LET.test(edgeChar(node, true))) continue;
      toks.push({ w: m[0], s: m.index, e: m.index + m[0].length });
    }
    if (!toks.length) return;
    var ctx = node.parentElement ? (node.parentElement.textContent || '').slice(0, 400) : text;
    var eng = englishish(ctx, toks);
    for (var i = 0; i < toks.length;) {
      var hit = 0, en = null;
      for (var n = Math.min(MAXW, toks.length - i); n >= 1; n--) {
        var k = '', ok = true;
        for (var j = i; j < i + n; j++) {
          if (j > i) {
            var gap = text.slice(toks[j - 1].e, toks[j].s);
            if (!/^[\s]*$/.test(gap) && !(gap === '' && /'|’$/.test(toks[j - 1].w))) { ok = false; break; }
            k += /'|’$/.test(toks[j - 1].w) && gap === '' ? '' : ' ';
          }
          k += key(toks[j].w);
        }
        if (!ok) continue;
        if (D[k] && !(eng && (n === 1 || CLASH[k])) && !(n === 1 && k.length < 2 && 'eaèoi'.indexOf(k) < 0)) { hit = n; en = D[k]; break; }
      }
      if (hit) { push(node, toks[i].s, toks[i + hit - 1].e, en); i += hit; } else i++;
    }
  }

  function push(node, s, e, en) {
    var r = document.createRange();
    try { r.setStart(node, s); r.setEnd(node, e); } catch (x) { return; }
    spans.push({ n: node, s: s, e: e, en: en, r: r });
    if (hl) hl.add(r);
  }

  function visible(el) {
    if (!el || !el.getClientRects().length) return false;
    var cs = getComputedStyle(el); return cs.visibility !== 'hidden' && cs.opacity !== '0';
  }

  function scan() {
    NAMES = names(); spans = []; if (hl) hl.clear();
    if (off() || !document.body) { hide(); return; }
    var w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
      acceptNode: function (n) {
        var p = n.parentElement; if (!p) return NodeFilter.FILTER_REJECT;
        if (p.closest(SKIP)) return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      }
    });
    var n, seen = 0;
    while ((n = w.nextNode()) && seen < 4000) { seen++; if (visible(n.parentElement)) scanNode(n); }
    if (tipFor) { var f = tipFor; tipFor = null; for (var i = 0; i < spans.length; i++) if (spans[i].n === f.n && spans[i].s === f.s && spans[i].e === f.e) tipFor = spans[i]; if (!tipFor) hide(); }
  }

  var pend = 0;
  function later() { if (pend) return; pend = setTimeout(function () { pend = 0; scan(); }, 140); }

  // ---------- tooltip ----------
  function css() {
    if (document.getElementById('boh-gl-css')) return;
    var st = document.createElement('style'); st.id = 'boh-gl-css';
    st.textContent = '::highlight(boh-gloss){text-decoration:underline dotted rgba(110,80,190,.6);text-decoration-thickness:2px;text-underline-offset:3px}' +
      '.boh-gl-tip{position:fixed;z-index:2147483000;pointer-events:none;max-width:260px;padding:7px 12px;border-radius:12px;background:#2b2140;color:#fff;' +
      'font:700 15px/1.3 Manrope,system-ui,sans-serif;box-shadow:0 6px 20px rgba(0,0,0,.25);opacity:0;transform:translateY(4px);transition:opacity .12s,transform .12s}' +
      '.boh-gl-tip.on{opacity:1;transform:none}.boh-gl-tip small{display:block;font-size:12px;font-weight:700;opacity:.7}' +
      '@media (prefers-color-scheme:dark){.boh-gl-tip{background:#f4eefc;color:#2b2140}}';
    document.head.appendChild(st);
  }
  function show(sp, stick) {
    css();
    if (!tip) { tip = document.createElement('div'); tip.className = 'boh-gl-tip'; tip.setAttribute('role', 'tooltip'); tip.setAttribute('aria-live', 'polite'); document.body.appendChild(tip); }
    tipFor = sp;
    var it = sp.n.nodeValue.slice(sp.s, sp.e);
    tip.innerHTML = '<small></small><span></span>'; tip.firstChild.textContent = it; tip.lastChild.textContent = sp.en;
    var b = sp.r.getBoundingClientRect(), tw = Math.min(260, tip.offsetWidth || 160), th = tip.offsetHeight || 44;
    var x = Math.max(8, Math.min(window.innerWidth - tw - 8, b.left + b.width / 2 - tw / 2));
    var y = b.top - th - 8; if (y < 6) y = b.bottom + 8;
    tip.style.left = x + 'px'; tip.style.top = y + 'px'; tip.classList.add('on');
    clearTimeout(tipTimer); sticky = !!stick; if (sticky) tipTimer = setTimeout(hide, 3200);
  }
  function hide() { tipFor = null; sticky = false; clearTimeout(tipTimer); if (tip) tip.classList.remove('on'); }

  function at(x, y) {
    var node, off2;
    if (document.caretPositionFromPoint) { var p = document.caretPositionFromPoint(x, y); if (p) { node = p.offsetNode; off2 = p.offset; } }
    else if (document.caretRangeFromPoint) { var r = document.caretRangeFromPoint(x, y); if (r) { node = r.startContainer; off2 = r.startOffset; } }
    if (!node || node.nodeType !== 3) return null;
    for (var i = 0; i < spans.length; i++) {
      var sp = spans[i];
      if (sp.n === node && off2 >= sp.s && off2 <= sp.e) {
        var rs = sp.r.getClientRects();
        for (var j = 0; j < rs.length; j++) { var q = rs[j]; if (x >= q.left - 2 && x <= q.right + 2 && y >= q.top - 3 && y <= q.bottom + 3) return sp; }
      }
    }
    return null;
  }

  var raf = 0, lx = 0, ly = 0;
  document.addEventListener('mousemove', function (e) {
    lx = e.clientX; ly = e.clientY; if (raf) return;
    raf = requestAnimationFrame(function () {
      raf = 0; var sp = at(lx, ly);
      if (sp) { if (sp !== tipFor) show(sp, false); } else if (tipFor && !sticky) hide();
    });
  }, { passive: true });
  document.addEventListener('click', function (e) {
    if (e.target && e.target.closest && e.target.closest('button,a,input,textarea,select,label')) return;
    var sp = at(e.clientX, e.clientY);
    if (sp) show(sp, true); else hide();
  }, true);
  window.addEventListener('scroll', hide, { passive: true, capture: true });
  window.addEventListener('resize', later);

  function start() {
    css(); scan();
    new MutationObserver(function (ms) { for (var i = 0; i < ms.length; i++) if (!tip || !tip.contains(ms[i].target)) { later(); return; } }).observe(document.body, { childList: true, subtree: true, characterData: true });
    var was = off(); setInterval(function () { var o = off(); if (o !== was) { was = o; scan(); } }, 600);
  }
  window.BohGloss = { rescan: scan, lookup: function (w) { return D[key(w)] || null; }, spans: function () { return spans; } };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start();
})();
