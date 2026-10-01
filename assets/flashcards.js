/* Boh · flashcards — one deck design for every level (Italiano 1 → AP).
   BohCards.open({ decks: [{ id, title, cards: [[italian, english], ...] }], start: deckId?, onPass(deckId), pay(bc) })
   Tap / Space / swipe up: flip. ✓ Lo so (→ / swipe right): the card leaves the deck. ↻ Ancora (← / swipe left): it comes back later.
   Progress is kept on this device in localStorage 'boh_fc_<id>' (it rides along in the Boh save code). */
(function (W) {
  if (W.BohCards) return;
  var CSS = '' +
    '.bfc-ov{position:fixed;inset:0;z-index:9999;display:flex;align-items:center;justify-content:center;padding:14px;background:rgba(20,16,24,.72);backdrop-filter:blur(4px);font:16px/1.35 Manrope,system-ui,-apple-system,sans-serif}' +
    '.bfc{--bg:#fff;--ink:#2B2430;--mut:#6B5F68;--line:#E3D8DC;--soft:#F5EFEF;--acc:#C1654F;--ok:#1E8C4A;--okbg:#E3F4EA;--again:#B7802A;--againbg:#FBF0DD;--vio:#6A4C93;' +
    'width:min(460px,100%);max-height:100%;overflow:auto;display:flex;flex-direction:column;gap:14px;padding:18px 18px 20px;border-radius:26px;background:var(--bg);color:var(--ink);box-shadow:0 24px 60px rgba(0,0,0,.4)}' +
    '.bfc.dark{--bg:#251C2A;--ink:#F2EAF0;--mut:#B7A8B8;--line:#3A2E40;--soft:#2F2535;--acc:#E88A6C;--ok:#6BD49A;--okbg:#1E3528;--again:#E0AA55;--againbg:#3A2E1C;--vio:#B79AE0}' +
    '.bfc-top{display:flex;align-items:center;gap:10px}.bfc-top h2{margin:0;font:800 19px/1.15 "Bricolage Grotesque",system-ui,sans-serif;flex:1}' +
    '.bfc-x{all:unset;cursor:pointer;width:40px;height:40px;border-radius:50%;display:grid;place-items:center;background:var(--soft);font-size:18px}' +
    '.bfc-bar{height:8px;border-radius:9px;background:var(--soft);overflow:hidden}.bfc-bar i{display:block;height:100%;background:var(--ok);border-radius:9px;transition:width .3s}' +
    '.bfc-cnt{display:flex;justify-content:space-between;font-weight:800;font-size:14px;color:var(--mut)}' +
    '.bfc-card{position:relative;height:250px;perspective:900px;cursor:pointer;touch-action:pan-y;user-select:none}' +
    '.bfc-in{position:absolute;inset:0;transition:transform .35s;transform-style:preserve-3d}.bfc-card.flip .bfc-in{transform:rotateY(180deg)}' +
    '.bfc-f{position:absolute;inset:0;backface-visibility:hidden;border-radius:22px;border:3px solid var(--line);background:var(--soft);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px;padding:18px;text-align:center}' +
    '.bfc-f.b{transform:rotateY(180deg);border-color:var(--vio)}' +
    '.bfc-w{font:900 clamp(26px,7vw,38px)/1.1 "Bricolage Grotesque",system-ui,sans-serif;letter-spacing:-.01em}' +
    '.bfc-lab{font:800 11px system-ui;letter-spacing:.14em;text-transform:uppercase;color:var(--mut)}' +
    '.bfc-tap{font-size:13px;font-weight:700;color:var(--mut)}' +
    '.bfc-say{all:unset;cursor:pointer;position:absolute;top:10px;right:10px;width:40px;height:40px;border-radius:50%;display:grid;place-items:center;background:var(--bg);font-size:18px;z-index:2}' +
    '.bfc-row{display:grid;grid-template-columns:1fr 1fr;gap:10px}' +
    '.bfc-b{all:unset;box-sizing:border-box;cursor:pointer;text-align:center;padding:16px 10px;border-radius:16px;font-weight:900;font-size:17px}' +
    '.bfc-b.again{background:var(--againbg);color:var(--again);border:2px solid var(--again)}.bfc-b.know{background:var(--okbg);color:var(--ok);border:2px solid var(--ok)}' +
    '.bfc-b.go{background:var(--acc);color:#fff}.bfc-b.ghost{background:var(--soft);color:var(--ink)}' +
    '.bfc-small{display:flex;justify-content:space-between;gap:10px;flex-wrap:wrap}.bfc-l{all:unset;cursor:pointer;font-weight:800;font-size:13.5px;color:var(--mut);text-decoration:underline;text-underline-offset:3px}' +
    '.bfc-list{display:flex;flex-direction:column;gap:8px}.bfc-deck{all:unset;box-sizing:border-box;cursor:pointer;display:flex;justify-content:space-between;align-items:center;gap:10px;padding:14px 16px;border-radius:16px;background:var(--soft);border:2px solid var(--line);font-weight:800}' +
    '.bfc-deck small{color:var(--mut);font-weight:700}.bfc-done{text-align:center;display:flex;flex-direction:column;gap:10px;padding:14px 0}.bfc-done b{font:900 34px "Bricolage Grotesque",system-ui,sans-serif}' +
    '.bfc-pay{align-self:center;font-weight:800;font-size:14px;color:var(--ok)}' +
    '.bfc *:focus-visible{outline:3px solid var(--vio);outline-offset:2px}' +
    '@media (prefers-reduced-motion:reduce){.bfc-in{transition:none}}';
  var ov = null, st = null, opts = null, keyH = null;
  function esc(t) { return String(t).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function get(id) { try { return JSON.parse(localStorage.getItem('boh_fc_' + id) || 'null') || { known: [], passed: false, seen: [] }; } catch (e) { return { known: [], passed: false, seen: [] }; } }
  function put(id, o) { try { localStorage.setItem('boh_fc_' + id, JSON.stringify(o)); } catch (e) {} }
  function dark() {
    var t = null; try { t = localStorage.getItem('boh_theme'); } catch (e) {}
    if (t === 'dark') return true; if (t === 'light') return false;
    var r = document.documentElement.getAttribute('data-theme'); if (r) return r === 'dark';
    return !!(W.matchMedia && matchMedia('(prefers-color-scheme: dark)').matches);
  }
  function day() { var d = new Date(); return d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate(); }
  function payOnce(deck, w) {
    if (!opts.pay) return 0;
    var p = null; try { p = JSON.parse(localStorage.getItem('boh_fc_paid') || 'null'); } catch (e) {}
    if (!p || p.day !== day()) p = { day: day(), w: [] };
    var k = deck + '|' + w; if (p.w.indexOf(k) !== -1) return 0;
    p.w.push(k); try { localStorage.setItem('boh_fc_paid', JSON.stringify(p)); } catch (e) {}
    try { opts.pay(2); } catch (e) {} return 2;
  }
  var voice = null;
  function say(t) {
    try {
      var S = W.speechSynthesis; if (!S) return;
      if (!voice) { var vs = S.getVoices(); voice = vs.filter(function (v) { return /google/i.test(v.name) && /^it/i.test(v.lang); })[0] || vs.filter(function (v) { return /^it/i.test(v.lang); })[0] || null; }
      S.cancel(); var u = new SpeechSynthesisUtterance(String(t).replace(/[“”"]/g, '')); u.lang = 'it-IT'; if (voice) u.voice = voice; u.rate = .9; S.speak(u);
    } catch (e) {}
  }
  function shuffle(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var x = a[i]; a[i] = a[j]; a[j] = x; } return a; }
  function close() { if (!ov) return; document.removeEventListener('keydown', keyH, true); ov.remove(); ov = null; try { W.speechSynthesis && W.speechSynthesis.cancel(); } catch (e) {} if (opts && opts.onClose) try { opts.onClose(); } catch (e) {} }
  function box() { return ov.querySelector('.bfc'); }
  function top(title) { return '<div class="bfc-top"><h2>&#127183; ' + esc(title) + '</h2><button class="bfc-x" aria-label="Chiudi">&#10005;</button></div>'; }
  function wireTop() { box().querySelector('.bfc-x').onclick = close; }

  function pick() {
    st = null;
    var html = top('Flashcards') + '<div class="bfc-list">' + opts.decks.map(function (d, i) {
      var g = get(d.id), n = d.cards.length, k = Math.min(n, g.known.length);
      return '<button class="bfc-deck" data-i="' + i + '"><span>' + esc(d.title) + '</span><small>' + (k >= n && n ? '&#9989; ' : '') + k + ' / ' + n + ' known</small></button>';
    }).join('') + '</div>';
    box().innerHTML = html; wireTop();
    box().querySelectorAll('[data-i]').forEach(function (b) { b.onclick = function () { start(opts.decks[+b.getAttribute('data-i')]); }; });
    var f = box().querySelector('.bfc-deck'); if (f) f.focus();
  }
  function start(deck) {
    var g = get(deck.id), known = g.known || [];
    var left = shuffle(deck.cards.filter(function (c) { return known.indexOf(c[0]) === -1; }));
    st = { deck: deck, left: left, flip: false, en: !!g.enFirst, earned: 0 };
    if (!left.length) return done();
    card();
  }
  function card() {
    var d = st.deck, n = d.cards.length, g = get(d.id), k = n - st.left.length, c = st.left[0];
    var front = st.en ? c[1] : c[0], back = st.en ? c[0] : c[1];
    box().innerHTML = top(d.title) +
      '<div class="bfc-bar"><i style="width:' + Math.round(k / n * 100) + '%"></i></div>' +
      '<div class="bfc-cnt"><span>' + st.left.length + ' left</span><span>' + k + ' known</span></div>' +
      '<div class="bfc-card' + (st.flip ? ' flip' : '') + '" role="button" tabindex="0" aria-label="Flip the card">' +
      '<button class="bfc-say" aria-label="Ascolta">&#128266;</button><div class="bfc-in">' +
      '<div class="bfc-f"><span class="bfc-lab">' + (st.en ? 'English' : 'Italiano') + '</span><span class="bfc-w">' + esc(front) + '</span><span class="bfc-tap">Tap to flip</span></div>' +
      '<div class="bfc-f b"><span class="bfc-lab">' + (st.en ? 'Italiano' : 'English') + '</span><span class="bfc-w">' + esc(back) + '</span></div></div></div>' +
      '<div class="bfc-row"><button class="bfc-b again">&#8635; Ancora</button><button class="bfc-b know">&#10003; Lo so</button></div>' +
      (st.earned ? '<div class="bfc-pay">+' + st.earned + ' BC</div>' : '') +
      '<div class="bfc-small"><button class="bfc-l" data-a="dir">&#8644; ' + (st.en ? 'Italian first' : 'English first') + '</button>' +
      (opts.decks.length > 1 ? '<button class="bfc-l" data-a="decks">All decks</button>' : '') + '<button class="bfc-l" data-a="reset">Start over</button></div>';
    wireTop();
    var el = box().querySelector('.bfc-card');
    var flip = function () { st.flip = !st.flip; el.classList.toggle('flip', st.flip); };
    el.onclick = function (e) { if (e.target.closest('.bfc-say')) return; flip(); };
    box().querySelector('.bfc-say').onclick = function (e) { e.stopPropagation(); say(c[0]); };
    box().querySelector('.again').onclick = function () { answer(false); };
    box().querySelector('.know').onclick = function () { answer(true); };
    box().querySelector('[data-a="dir"]').onclick = function () { st.en = !st.en; var gg = get(d.id); gg.enFirst = st.en; put(d.id, gg); st.flip = false; card(); };
    var dk = box().querySelector('[data-a="decks"]'); if (dk) dk.onclick = pick;
    box().querySelector('[data-a="reset"]').onclick = function () { var gg = get(d.id); gg.known = []; put(d.id, gg); start(d); };
    var x0 = null, y0 = null;
    el.addEventListener('touchstart', function (e) { x0 = e.touches[0].clientX; y0 = e.touches[0].clientY; }, { passive: true });
    el.addEventListener('touchend', function (e) {
      if (x0 === null) return; var dx = e.changedTouches[0].clientX - x0, dy = e.changedTouches[0].clientY - y0; x0 = null;
      if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy)) answer(dx > 0); else if (dy < -50) flip();
    });
    el.focus({ preventScroll: true });
    // the first time a card shows, mark it seen; one full pass through the deck opens the lesson's Avanti
    if (g.seen.indexOf(c[0]) === -1) { g.seen.push(c[0]); }
    if (!g.passed && d.cards.every(function (cc) { return g.seen.indexOf(cc[0]) !== -1 || g.known.indexOf(cc[0]) !== -1; })) { g.passed = true; put(d.id, g); if (opts.onPass) try { opts.onPass(d.id); } catch (e) {} }
    else put(d.id, g);
  }
  function answer(knows) {
    var d = st.deck, c = st.left.shift(), g = get(d.id);
    if (knows) { if (g.known.indexOf(c[0]) === -1) g.known.push(c[0]); put(d.id, g); st.earned += payOnce(d.id, c[0]); }
    else { var at = Math.min(st.left.length, 3 + Math.floor(Math.random() * 3)); st.left.splice(at, 0, c); }
    st.flip = false;
    if (!st.left.length) return done();
    card();
  }
  function done() {
    var d = st.deck, n = d.cards.length;
    var g = get(d.id); if (!g.passed) { g.passed = true; put(d.id, g); if (opts.onPass) try { opts.onPass(d.id); } catch (e) {} }
    box().innerHTML = top(d.title) + '<div class="bfc-done"><span style="font-size:48px">&#127881;</span><b>Tutto fatto!</b><span>' + n + ' / ' + n + ' known' + (st.earned ? ' &middot; +' + st.earned + ' BC' : '') + '</span></div>' +
      '<div class="bfc-row"><button class="bfc-b ghost" data-a="reset">&#8635; Start over</button><button class="bfc-b go" data-a="close">' + (opts.decks.length > 1 ? 'All decks' : 'Fatto') + '</button></div>';
    wireTop();
    box().querySelector('[data-a="reset"]').onclick = function () { var gg = get(d.id); gg.known = []; put(d.id, gg); start(d); };
    box().querySelector('[data-a="close"]').onclick = function () { if (opts.decks.length > 1) pick(); else close(); };
  }
  function open(o) {
    opts = o || {}; opts.decks = (opts.decks || []).filter(function (d) { return d && d.cards && d.cards.length; });
    if (!opts.decks.length) return;
    if (!document.getElementById('bfc-css')) { var stl = document.createElement('style'); stl.id = 'bfc-css'; stl.textContent = CSS; document.head.appendChild(stl); }
    if (ov) ov.remove();
    ov = document.createElement('div'); ov.className = 'bfc-ov';
    ov.innerHTML = '<div class="bfc' + (dark() ? ' dark' : '') + '" role="dialog" aria-modal="true" aria-label="Flashcards"></div>';
    ov.addEventListener('click', function (e) { if (e.target === ov) close(); });
    document.body.appendChild(ov);
    keyH = function (e) {
      if (!ov) return;
      if (e.key === 'Escape') { e.preventDefault(); close(); return; }
      if (!st || !box().querySelector('.bfc-card')) return;
      if (e.key === ' ' || e.key === 'ArrowUp' || e.key === 'ArrowDown') { e.preventDefault(); box().querySelector('.bfc-card').click(); }
      else if (e.key === 'ArrowRight') { e.preventDefault(); answer(true); }
      else if (e.key === 'ArrowLeft') { e.preventDefault(); answer(false); }
    };
    document.addEventListener('keydown', keyH, true);
    var s0 = opts.start ? opts.decks.filter(function (d) { return d.id === opts.start; })[0] : null;
    if (s0) start(s0); else if (opts.decks.length === 1) start(opts.decks[0]); else pick();
  }
  function passed(id) { return !!get(id).passed; }
  function stats(id, n) { var g = get(id); return { known: Math.min(n || 1e9, g.known.length), passed: !!g.passed }; }
  function forget(ids, word) {   // a word the student missed in practice goes back into the "don't know yet" pile
    [].concat(ids || []).forEach(function (id) { var g = get(id); var i = (g.known || []).indexOf(word); if (i !== -1) { g.known.splice(i, 1); put(id, g); } });
  }
  W.BohCards = { open: open, passed: passed, stats: stats, close: close, say: say, forget: forget };
})(window);
