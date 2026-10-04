/* Boh · lesson engine: one lesson made of short parts that open in order.
   BohLezione.register({...lesson content...})   (the content lives in assets/lezione-<id>.js)
   BohLezione.start(id, element)
   Part types: pick (three answers), match, write (dictation), record (partner dialogue, Vocaroo), build (tap the words in order).
   Every Italian answer is said out loud with the browser's Italian voice. A right answer moves on by itself.
   Progress is kept on this device in localStorage 'boh_lz_<id>_v1' (it rides along in the Boh save code).
   Boh Cashi go into the shared Boh wallet (boh_profile_v1), the same one every level uses.
   Made by Assunta Scotto. Created by Assunta Scotto, 2026. Not for redistribution. */
(function (W) {
  'use strict';
  if (W.BohLezione) return;
  var LESSONS = {}, L = null, S = null, root = null, V = { name: 'map' }, tok = 0;
  var GUIDE = '../assets/guide/';
  var CHEER = ['thumbs-up-wink', 'clap', 'cheer-fist', 'fists-yay', 'hands-heart', 'high-five'];
  var GIORNI = ['domenica', 'lunedì', 'martedì', 'mercoledì', 'giovedì', 'venerdì', 'sabato'];
  var MESI = ['gennaio', 'febbraio', 'marzo', 'aprile', 'maggio', 'giugno', 'luglio', 'agosto', 'settembre', 'ottobre', 'novembre', 'dicembre'];

  /* ---------------------------------------------------------------- helpers */
  function esc(t) { return String(t == null ? '' : t).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function shuffle(a) { var b = a.slice(), i, j, t; for (i = b.length - 1; i > 0; i--) { j = Math.floor(Math.random() * (i + 1)); t = b[i]; b[i] = b[j]; b[j] = t; } return b; }
  function range(n) { var a = []; for (var i = 0; i < n; i++) a.push(i); return a; }
  function later(ms, fn) { var t = tok; return setTimeout(function () { if (t === tok) fn(); }, ms); }
  function bust(p) { return 'style="background-image:url(' + GUIDE + 'bust/' + p + '.webp)"'; }
  function body(p) { return 'style="background-image:url(' + GUIDE + 'body/b-' + p + '.webp)"'; }
  function norm(s) {
    s = String(s || '').toLowerCase();
    try { s = s.normalize('NFD').replace(/[̀-ͯ]/g, ''); } catch (e) {}
    return s.replace(/[^a-z0-9 ]+/g, ' ').replace(/\s+/g, ' ').trim();
  }
  function lev(a, b) {
    var m = a.length, n = b.length, i, j, p = [], c;
    for (j = 0; j <= n; j++) p[j] = j;
    for (i = 1; i <= m; i++) { c = [i]; for (j = 1; j <= n; j++) c[j] = Math.min(p[j] + 1, c[j - 1] + 1, p[j - 1] + (a.charAt(i - 1) === b.charAt(j - 1) ? 0 : 1)); p = c; }
    return p[n];
  }
  function close(typed, right) { var a = norm(typed), b = norm(right); return a.length >= 3 && lev(a, b) <= 2; }
  function dateIt(d) { return GIORNI[d.getDay()] + ' ' + d.getDate() + ' ' + MESI[d.getMonth()] + ' ' + d.getFullYear(); }

  /* ---------------------------------------------------------------- saved state + the shared wallet */
  function key() { return 'boh_lz_' + L.id + '_v1'; }
  function load() {
    var f = { v: 1, done: {}, paid: {}, ft: {}, links: {}, lu: '', earned: 0 }, o = null;
    try { o = JSON.parse(localStorage.getItem(key()) || 'null'); } catch (e) {}
    if (o && typeof o === 'object') for (var k in o) f[k] = o[k];
    ['done', 'paid', 'ft', 'links'].forEach(function (k) { if (!f[k] || typeof f[k] !== 'object') f[k] = {}; });
    return f;
  }
  function save() { try { localStorage.setItem(key(), JSON.stringify(S)); } catch (e) {} }
  function profile() { try { return JSON.parse(localStorage.getItem('boh_profile_v1') || 'null'); } catch (e) { return null; } }
  function bravo() { var p = profile(); return p && p.bohBase === 'm' ? 'Bravo' : 'Brava'; }
  function wallet() { var p = profile(); return (p && p.cashi) || 0; }
  function pay(k, bc) {
    if (!bc || S.paid[k]) return 0;
    S.paid[k] = bc; S.earned = (S.earned || 0) + bc; save();
    try {
      var p = profile();
      if (p) { p.cashi = (p.cashi || 0) + bc; p.lifetime = (p.lifetime || 0) + bc; p._t = Date.now(); localStorage.setItem('boh_profile_v1', JSON.stringify(p)); }
    } catch (e) {}
    var w = root.querySelector('.lz-wal');
    if (w) { w.firstChild.nodeValue = wallet() + ' BC'; var old = w.querySelector('.lz-plus'); if (old) old.remove(); var s = document.createElement('span'); s.className = 'lz-plus'; s.textContent = '+' + bc + ' BC'; w.appendChild(s); }
    return bc;
  }

  /* ---------------------------------------------------------------- the Italian voice */
  function hasVoice() { try { return !!(W.BohVoice && W.BohVoice.list().length); } catch (e) { return false; } }
  function speak(text, onend) {
    try {
      if (!W.BohVoice) return false;
      var v = null; try { v = W.BohVoice.pick(); } catch (e) {}
      var u = W.BohVoice.speak(text, { rate: 0.9, voice: v || undefined, onend: onend });
      return !!u;
    } catch (e) { return false; }
  }
  // say it, then go on: never before minMs, and never stuck if the voice gives no signal
  function sayThen(text, minMs, tailMs, capMs, fn) {
    var fired = false, t0 = Date.now();
    function end() { if (fired) return; fired = true; later(Math.max(minMs - (Date.now() - t0), 0) + tailMs, fn); }
    var ok = speak(text, end);
    later(ok ? capMs : minMs, end);
  }
  function hush() { try { W.speechSynthesis.cancel(); } catch (e) {} }

  /* ---------------------------------------------------------------- sections */
  function secIndex(id) { for (var i = 0; i < L.sections.length; i++) if (L.sections[i].id === id) return i; return -1; }
  function open_(i) { return i === 0 || !!S.done[L.sections[i - 1].id]; }
  function nextOpen() { for (var i = 0; i < L.sections.length; i++) if (!S.done[L.sections[i].id]) return i; return -1; }
  function allDone() { return nextOpen() === -1; }

  function top(backAct, backLabel, title, sub) {
    return '<header class="lz-top"><button class="lz-back" data-act="' + backAct + '">&lsaquo; ' + esc(backLabel) + '</button>' +
      '<div class="lz-tt"><b class="dsp">' + esc(title) + '</b><span>' + esc(sub) + '</span></div>' +
      '<div class="lz-wal" aria-label="Boh Cashi">' + wallet() + ' BC</div></header>';
  }
  function stage(pose, line) {
    return '<div class="lz-stage"><div class="lz-bust" role="img" aria-label="Prof. Lo So" ' + bust(pose) + '></div><div class="lz-bub in">' + esc(line) + '</div></div>';
  }
  function dots(n, i) { return '<div class="lz-dots" aria-hidden="true">' + range(n).map(function (k) { return '<i class="' + (k < i ? 'on' : k === i ? 'cur' : '') + '"></i>'; }).join('') + '</div>'; }
  function go(v) { tok++; hush(); V = v; render(); }

  /* ---------------------------------------------------------------- MAP: the list of parts */
  function vMap() {
    var p = profile(), name = (p && p.bohName) || '', cur = nextOpen();
    var h = top('home', 'Italiano 2', L.title, L.sub);
    h += stage(allDone() ? 'cheer-fist' : 'wave', allDone() ? 'You finished every part. Open your progress page and screenshot it.' : 'Ciao' + (name ? ', ' + name : '') + '! Do the parts in order. Each one opens when you finish the one before.');
    h += '<ol class="lz-map" style="grid-template-rows:repeat(' + Math.ceil(L.sections.length / 2) + ',auto)">' + L.sections.map(function (s, i) {
      var done = !!S.done[s.id], op = open_(i), cls = done ? 'done' : (i === cur ? 'cur' : (op ? '' : 'lock'));
      return '<li><button class="lz-part ' + cls + '" data-act="sec" data-i="' + i + '"' + (op ? '' : ' disabled') + '><span class="n">' + (done ? '' : (i + 1)) + '</span>' +
        '<span class="t"><b>' + esc(s.label) + '</b><span>' + (done ? 'Done' : (i === cur ? 'Start &rsaquo;' : (op ? esc(s.en) : 'Locked'))) + '</span></span></button></li>';
    }).join('') + '</ol>';
    h += '<div class="lz-row"><button class="lz-ghost" data-act="finish">My progress page</button><button class="lz-ghost" data-act="sound">Test sound</button></div>';
    return h;
  }

  /* ---------------------------------------------------------------- PICK: three answers */
  function startSec(i) {
    var s = L.sections[i];
    if (s.type === 'pick') go({ name: 'pick', si: i, lu: false, q: range(s.cards.length), i: 0, line: 0, phase: 'say', miss: {}, tries: {} });
    else if (s.type === 'match') { go({ name: 'match', si: i, phase: 'listen', at: -1, sel: -1, bad: -1, ok: {}, order: shuffle(range(s.pairs.length)) }); matchListen(); }
    else if (s.type === 'write') { go({ name: 'write', si: i, i: 0, tries: 0, help: 0, fb: null }); writeAuto(); }
    else if (s.type === 'record') go({ name: 'record', si: i });
    else if (s.type === 'build') go({ name: 'build', si: i, i: 0, got: [], bad: false, bank: null, fin: false });
  }
  function pickCards() { var s = L.sections[V.si]; return V.lu ? s.levelUp.cards : s.cards; }
  function pickKey(ci) { var s = L.sections[V.si]; return s.id + (V.lu ? ':lu:' : ':') + ci; }
  function vPick() {
    var s = L.sections[V.si], cards = pickCards(), ci = V.q[V.i], c = cards[ci], hear = !!s.hear && !V.lu;
    var say = c.say[Math.min(V.line, c.say.length - 1)], right = hear ? c.en : c.it;
    if (!V.order || V.orderFor !== V.i) { V.order = shuffle(c.opts); V.orderFor = V.i; }
    var h = top('map', 'Parts', s.label + (V.lu ? ' · Level up' : ''), s.en) + dots(V.q.length, V.i);
    var pose = V.phase === 'fb' ? (V.wasRight ? CHEER[(V.i + V.si) % CHEER.length] : 'finger-up') : say[0];
    h += stage(pose, V.phase === 'fb' ? (V.wasRight ? 'Sì! ' + bravo() + '!' : 'Not yet. Look at the pink.') : say[1]);
    if (hear) h += '<div class="lz-q"><small>Listen</small>' + (hasVoice() ? '<button class="lz-hear" data-act="hear">Hear it</button>' : '<span>' + esc(c.it) + '</span>') + '</div>';
    else h += '<div class="lz-q"><small>How do you say</small><span>' + esc(c.en) + '</span></div>';
    h += '<div class="lz-opts' + (V.phase === 'say' ? ' wait' : '') + '">' + V.order.map(function (o, k) {
      var cls = '';
      if (V.phase === 'fb') cls = o === right ? (V.wasRight ? ' ok' : ' pop') : (o === V.chose ? ' no' : ' dim');
      return '<button class="lz-opt' + cls + '" data-act="opt" data-k="' + k + '"' + (V.phase === 'ask' ? '' : ' disabled') + '>' + esc(o) + '</button>';
    }).join('') + '</div>';
    if (V.phase === 'fb') {
      h += '<div class="lz-fb ' + (V.wasRight ? 'ok' : 'pop') + '"><button class="a" data-act="again">' + (V.wasRight ? '' : 'It’s: ') + esc(c.it) + '</button>' +
        (hear ? '<span class="e">' + esc(c.en) + '</span>' : '') +
        '<span class="m"><b>Remember:</b> ' + esc(c.mem) + '</span>' + (V.wasRight ? '' : '<button class="lz-next" data-act="next">Next &rsaquo;</button>') + '</div>';
    } else h += '<div class="lz-fb"></div>';
    return h;
  }
  function pickAfterRender() {
    var s = L.sections[V.si], c = pickCards()[V.q[V.i]], hear = !!s.hear && !V.lu;
    if (V.phase === 'say') {
      if (V.line < c.say.length - 1) later(2300, function () { V.line++; render(); });
      else later(c.say.length > 1 ? 900 : 500, function () { V.phase = 'ask'; render(); });
    } else if (V.phase === 'ask' && hear && !V.heard) { V.heard = true; speak(c.it); }
  }
  function pickAnswer(k) {
    if (V.phase !== 'ask') return;
    var s = L.sections[V.si], cards = pickCards(), ci = V.q[V.i], c = cards[ci], hear = !!s.hear && !V.lu;
    var right = hear ? c.en : c.it, chose = V.order[k], ok = chose === right, kk = pickKey(ci), full = V.lu ? s.levelUp.pay : s.pay;
    V.phase = 'fb'; V.chose = chose; V.wasRight = ok;
    if (S.ft[kk] === undefined) { S.ft[kk] = ok ? 1 : 0; save(); }
    if (ok) pay(kk, V.miss[ci] ? Math.max(1, Math.floor(full / 2)) : full);
    else { V.miss[ci] = (V.miss[ci] || 0) + 1; if (V.miss[ci] <= 2) V.q.push(ci); }
    render();
    if (ok) sayThen(c.it, 1500, 900, 6000, pickNext);
    else sayThen(c.it, 2600, 2400, 9500, pickNext);
  }
  function pickNext() {
    if (V.name !== 'pick' || V.phase !== 'fb') return;
    var s = L.sections[V.si];
    tok++; hush();
    if (V.i + 1 < V.q.length) { V.i++; V.line = 0; V.phase = 'say'; V.heard = false; V.chose = null; render(); return; }
    if (!V.lu && s.levelUp && S.lu !== 'done') { V = { name: 'offer', si: V.si }; render(); return; }
    if (V.lu) { S.lu = 'done'; save(); }
    secDone(V.si);
  }

  /* ---------------------------------------------------------------- LEVEL UP offer (optional, pays double) */
  function vOffer() {
    var s = L.sections[V.si], u = s.levelUp;
    return top('map', 'Parts', s.label, s.en) +
      '<div class="lz-big"><div class="lz-bust" role="img" aria-label="Prof. Lo So" ' + bust('beckon') + '></div><h2 class="dsp">' + esc(u.offer) + '</h2><p>' + esc(u.note) + '</p>' +
      '<span class="lz-pill">' + u.pay + ' BC a card</span></div>' +
      '<div class="lz-row"><button class="lz-ghost" data-act="luskip">Skip</button><button class="lz-btn" data-act="luyes">Yes, level up</button></div>';
  }

  /* ---------------------------------------------------------------- part finished */
  function secDone(i) {
    var s = L.sections[i], first = !S.done[s.id];
    S.done[s.id] = true; save();
    V = { name: 'done', si: i, bc: 0 }; render();
    if (first) { V.bc = pay(s.id + ':bonus', L.bonus || 0); }
    var n = i + 1 < L.sections.length ? i + 1 : -1;
    later(3200, function () { if (n >= 0) startSec(n); else go({ name: 'finish' }); });
  }
  function vDone() {
    var s = L.sections[V.si], n = V.si + 1 < L.sections.length ? L.sections[V.si + 1] : null;
    return top('map', 'Parts', L.title, L.sub) +
      '<div class="lz-big"><div class="lz-bust" role="img" aria-label="Prof. Lo So" ' + bust(CHEER[V.si % CHEER.length]) + '></div>' +
      '<h2 class="dsp">' + esc(s.label) + ': done!</h2><p>' + (n ? 'Next: ' + esc(n.label) + '. It starts by itself.' : 'That was the last part.') + '</p></div>' +
      '<div class="lz-row"><button class="lz-ghost" data-act="map">Parts</button><button class="lz-btn" data-act="' + (n ? 'keep' : 'finish') + '">' + (n ? 'Keep going &rsaquo;' : 'My progress page') + '</button></div>';
  }

  /* ---------------------------------------------------------------- MATCH: listen, then match */
  function vMatch() {
    var s = L.sections[V.si], h = top('map', 'Parts', s.label, s.en);
    h += stage(s.say[0], V.phase === 'listen' ? s.say[1] : 'Tap the Italian. Then tap what it means.');
    h += '<div class="lz-match">';
    s.pairs.forEach(function (p, r) {
      var e = V.order[r];
      h += '<button class="lz-tile' + (V.ok[r] ? ' ok' : (V.sel === r ? ' sel' : (V.at === r ? ' say' : ''))) + '" data-act="mit" data-i="' + r + '"' + (V.ok[r] || V.phase === 'listen' ? ' disabled' : '') + '>' + esc(p[0]) + '</button>';
      h += '<button class="lz-tile en' + (V.ok[e] ? ' ok' : (V.bad === e ? ' no' : '')) + '" data-act="men" data-i="' + e + '"' + (V.ok[e] || V.phase === 'listen' ? ' disabled' : '') + '>' + (V.phase === 'listen' ? '&nbsp;' : esc(s.pairs[e][1])) + '</button>';
    });
    h += '</div><div class="lz-note">' + (V.phase === 'listen' ? 'Listening...' : 'Every tap says it out loud.') + '</div>';
    return h;
  }
  function matchListen() {
    var s = L.sections[V.si];
    if (!hasVoice()) { later(1200, function () { V.phase = 'match'; V.at = -1; render(); }); return; }
    (function step(r) {
      if (r >= s.pairs.length) { V.phase = 'match'; V.at = -1; render(); return; }
      V.at = r; render(true);
      sayThen(s.pairs[r][0], 1300, 500, 6000, function () { step(r + 1); });
    })(0);
  }
  function matchIt(r) { if (V.phase !== 'match' || V.ok[r]) return; V.sel = r; V.bad = -1; render(true); speak(L.sections[V.si].pairs[r][0]); }
  function matchEn(e) {
    if (V.phase !== 'match' || V.sel < 0 || V.ok[e]) return;
    var s = L.sections[V.si];
    if (e === V.sel) {
      V.ok[e] = true; V.sel = -1; V.bad = -1; render(true);
      if (Object.keys(V.ok).length === s.pairs.length) { pay(s.id + ':all', s.pay); later(1100, function () { secDone(V.si); }); }
    } else { V.bad = e; render(true); later(600, function () { V.bad = -1; render(true); }); }
  }

  /* ---------------------------------------------------------------- WRITE: type what you hear */
  function vWrite() {
    var s = L.sections[V.si], it = s.items[V.i], voice = hasVoice(), h = top('map', 'Parts', s.label, s.en) + dots(s.items.length, V.i);
    h += stage(V.fb === 'ok' ? CHEER[V.i % CHEER.length] : (V.fb === 'show' ? 'finger-up' : s.say[0]), V.fb === 'ok' ? 'Sì! You wrote it.' : (V.fb === 'show' ? 'Here it is. Read it and say it.' : (V.tries ? 'Close. Listen again.' : s.say[1])));
    h += '<div class="lz-q">' + (voice ? '<button class="lz-hear" data-act="whear">Hear it</button>' : '<small>Type it in Italian</small>') +
      (V.help >= 1 || !voice ? '<span>' + esc(it.en) + '</span>' : '') + '</div>';
    h += '<input class="lz-in" id="lz-in" type="text" lang="it" autocomplete="off" autocapitalize="off" autocorrect="off" spellcheck="false" placeholder="Type here"' + (V.fb === 'ok' || V.fb === 'show' ? ' disabled' : '') + ' value="' + esc(V.typed || '') + '">';
    if (V.fb === 'ok' || V.fb === 'show') h += '<div class="lz-fb ' + (V.fb === 'ok' ? 'ok' : 'pop') + '"><button class="a" data-act="wagain">' + (V.fb === 'ok' ? '' : 'It’s: ') + esc(it.it) + '</button><span class="e">' + esc(it.en) + '</span></div>';
    else h += '<div class="lz-fb">' + (V.help >= 2 ? '<span class="m"><b>It starts:</b> ' + esc(it.it.split(' ').slice(0, 2).join(' ')) + ' ...</span>' : '') + '</div>';
    h += '<div class="lz-row"><button class="lz-ghost" data-act="whelp"' + (V.fb ? ' disabled' : '') + '>Help</button><button class="lz-btn" data-act="wcheck"' + (V.fb ? ' disabled' : '') + '>Check</button></div>';
    return h;
  }
  function writeCheck() {
    if (V.fb) return;
    var s = L.sections[V.si], it = s.items[V.i], el = document.getElementById('lz-in'), typed = el ? el.value : '';
    V.typed = typed;
    if (!norm(typed)) { if (el) el.focus(); return; }
    var kk = s.id + ':' + V.i;
    if (close(typed, it.it)) {
      if (S.ft[kk] === undefined) { S.ft[kk] = V.tries ? 0 : 1; save(); }
      V.fb = 'ok'; pay(kk, V.tries ? 1 : s.pay); render(); sayThen(it.it, 1500, 1000, 6000, writeNext);
    } else if (V.tries === 0) {
      V.tries = 1; V.help = Math.max(V.help, 1); render(); speak(it.it); var e2 = document.getElementById('lz-in'); if (e2) e2.focus();
    } else {
      if (S.ft[kk] === undefined) { S.ft[kk] = 0; save(); }
      V.fb = 'show'; pay(kk, 1); render(); sayThen(it.it, 2600, 2400, 9500, writeNext);
    }
  }
  function writeNext() {
    if (V.name !== 'write') return;
    var s = L.sections[V.si];
    tok++; hush();
    if (V.i + 1 < s.items.length) { V = { name: 'write', si: V.si, i: V.i + 1, tries: 0, help: 0, fb: null }; render(); writeAuto(); }
    else secDone(V.si);
  }
  function writeAuto() { var s = L.sections[V.si]; later(500, function () { speak(s.items[V.i].it); var el = document.getElementById('lz-in'); if (el && W.innerWidth > 700) el.focus(); }); }

  /* ---------------------------------------------------------------- RECORD: partner dialogue */
  function vRecord() {
    var s = L.sections[V.si], link = S.links[s.id] || '', h = top('map', 'Parts', s.label, s.en);
    h += stage(s.say[0], s.say[1]);
    h += '<div class="lz-dlg">' + s.lines.map(function (l, i) {
      return '<button class="lz-line" data-act="line" data-i="' + i + '"><span class="w">' + esc(l[0]) + '</span><span class="x"><b>' + esc(l[1]) + '</b><span>' + esc(l[2]) + '</span></span></button>';
    }).join('') + '</div>';
    h += '<div class="lz-row"><a class="lz-btn" href="' + esc(L.vocaroo) + '" target="_blank" rel="noopener">Open Vocaroo</a></div>';
    h += '<input class="lz-in" id="lz-link" type="url" inputmode="url" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="Paste your recording link here" value="' + esc(link === 'other' ? '' : link) + '">';
    h += '<div class="lz-row"><button class="lz-ghost" data-act="rother">I recorded another way</button><button class="lz-btn" data-act="rdone">Done</button></div>';
    return h;
  }
  function recordDone(other) {
    var s = L.sections[V.si], el = document.getElementById('lz-link'), v = el ? el.value.trim() : '';
    if (!other && !/^https?:\/\/\S+\.\S+/i.test(v)) { if (el) { el.focus(); el.placeholder = 'Paste the link first, or tap the other button'; } return; }
    S.links[s.id] = other ? 'other' : v; save();
    pay(s.id + ':rec', s.pay); secDone(V.si);
  }

  /* ---------------------------------------------------------------- BUILD: tap the words in order */
  function vBuild() {
    var s = L.sections[V.si], it = s.items[V.i], h = top('map', 'Parts', s.label, s.en) + dots(s.items.length, V.i);
    if (!V.bank) V.bank = shuffle(it.tiles.concat(it.extra || []));
    h += stage(V.fin ? CHEER[V.i % CHEER.length] : s.say[0], V.fin ? 'Sì! Say it out loud.' : (V.i ? 'A little longer now.' : s.say[1]));
    h += '<div class="lz-q"><small>Build it</small><span>' + esc(it.en) + '</span></div>';
    h += '<div class="lz-slots' + (V.fin ? ' ok' : '') + '">' + (V.got.length ? V.got.map(function (t) { return '<span>' + esc(t) + '</span>'; }).join('') : '<span class="lz-note">Tap the first word</span>') + '</div>';
    h += '<div class="lz-bank">' + V.bank.map(function (t, k) {
      var used = V.used && V.used[k];
      return '<button class="lz-tile' + (used ? ' used' : '') + (V.badK === k ? ' no' : '') + '" data-act="tile" data-k="' + k + '"' + (used || V.fin ? ' disabled' : '') + '>' + esc(t) + '</button>';
    }).join('') + '</div><div class="lz-fb"></div>';
    return h;
  }
  function buildTap(k) {
    if (V.fin) return;
    var s = L.sections[V.si], it = s.items[V.i], t = V.bank[k];
    V.used = V.used || {};
    if (t === it.tiles[V.got.length]) {
      V.used[k] = true; V.got.push(t); V.badK = -1;
      if (V.got.length === it.tiles.length) {
        V.fin = true; var kk = s.id + ':' + V.i;
        if (S.ft[kk] === undefined) { S.ft[kk] = V.bad ? 0 : 1; save(); }
        pay(kk, V.bad ? Math.max(1, Math.floor(s.pay / 2)) : s.pay); render();
        sayThen(it.tiles.join(' '), 1600, 1100, 7000, function () {
          if (V.name !== 'build') return;
          if (V.i + 1 < s.items.length) { V = { name: 'build', si: V.si, i: V.i + 1, got: [], bad: false, bank: null, fin: false }; render(); }
          else secDone(V.si);
        });
      } else render(true);
    } else { V.bad = true; V.badK = k; render(true); later(500, function () { V.badK = -1; render(true); }); }
  }

  /* ---------------------------------------------------------------- PROGRESS PAGE: the one to screenshot */
  function vFinish() {
    var p = profile(), name = (p && p.bohName) || 'Student', d = new Date(), all = allDone(), r = 0, n = 0, k;
    for (k in S.ft) { n++; if (S.ft[k]) r++; }
    var nd = L.sections.filter(function (s) { return S.done[s.id]; }).length;
    var h = top('map', 'Parts', L.title, L.sub);
    h += '<div class="lz-card"><div class="lz-id"><div class="lz-bust" role="img" aria-label="Prof. Lo So" ' + (all ? body('jump-joy') : bust('fist-forza')) + '></div>' +
      '<div><h2 class="dsp">' + esc(name) + '</h2><p>' + esc(dateIt(d)) + '</p><p>' + esc(L.title + ': ' + L.sub) + '</p></div></div>';
    h += '<div class="lz-stats"><div><b>' + nd + ' / ' + L.sections.length + '</b><span>parts done</span></div><div><b>' + r + ' / ' + n + '</b><span>right the first time</span></div><div><b>' + (S.earned || 0) + ' BC</b><span>earned here</span></div></div>';
    h += '<div class="lz-ck">' + L.sections.map(function (s) { return '<div class="' + (S.done[s.id] ? 'y' : 'n') + '"><i></i>' + esc(s.label) + (s.levelUp && S.lu === 'done' ? ' + Level up' : '') + '</div>'; }).join('') + '</div>';
    var links = L.sections.filter(function (s) { return s.type === 'record' && S.links[s.id]; }).map(function (s) { return esc(s.label) + ': ' + (S.links[s.id] === 'other' ? 'recorded another way' : esc(S.links[s.id])); });
    if (links.length) h += '<div class="lz-links">' + links.join('<br>') + '</div>';
    h += '</div><div class="lz-shot">Screenshot this page. Turn it in on Google Classroom.</div>';
    h += '<div class="lz-row"><button class="lz-btn" data-act="map">' + (all ? 'Back to the parts' : 'Keep working') + '</button></div><div class="lz-foot">Created by Assunta Scotto</div>';
    return h;
  }

  /* ---------------------------------------------------------------- render + clicks */
  function render(keep) {
    var views = { map: vMap, pick: vPick, offer: vOffer, done: vDone, match: vMatch, write: vWrite, record: vRecord, build: vBuild, finish: vFinish };
    var el = document.getElementById('lz-in'), typed = el ? el.value : null;
    root.innerHTML = '<div class="lz">' + views[V.name]() + '</div>';
    if (typed !== null && V.name === 'write') { var e2 = document.getElementById('lz-in'); if (e2 && !V.fb) e2.value = typed; }
    if (!keep && V.name === 'pick') pickAfterRender();
  }
  function onClick(ev) {
    var b = ev.target.closest('[data-act]'); if (!b || b.disabled) return;
    var a = b.getAttribute('data-act'), i = parseInt(b.getAttribute('data-i'), 10), k = parseInt(b.getAttribute('data-k'), 10), s = V.si != null ? L.sections[V.si] : null;
    if (a === 'home') { W.location.href = '../' + (L.level || '') + '/'; }
    else if (a === 'map') go({ name: 'map' });
    else if (a === 'finish') go({ name: 'finish' });
    else if (a === 'sound') { if (!speak('Ciao! Posso andare in bagno?')) { b.textContent = 'No voice here'; } else if (!hasVoice()) b.textContent = 'No Italian voice'; }
    else if (a === 'sec') { if (open_(i)) startSec(i); }
    else if (a === 'keep') { if (V.si + 1 < L.sections.length) startSec(V.si + 1); }
    else if (a === 'opt') pickAnswer(k);
    else if (a === 'next') pickNext();
    else if (a === 'again') speak(pickCards()[V.q[V.i]].it);
    else if (a === 'hear') speak(pickCards()[V.q[V.i]].it);
    else if (a === 'luyes') { go({ name: 'pick', si: V.si, lu: true, q: range(s.levelUp.cards.length), i: 0, line: 0, phase: 'say', miss: {}, tries: {} }); }
    else if (a === 'luskip') { if (S.lu !== 'done') { S.lu = 'skipped'; save(); } secDone(V.si); }
    else if (a === 'mit') matchIt(i);
    else if (a === 'men') matchEn(i);
    else if (a === 'whear') { speak(s.items[V.i].it); var el = document.getElementById('lz-in'); if (el) el.focus(); }
    else if (a === 'wagain') speak(s.items[V.i].it);
    else if (a === 'whelp') { var e3 = document.getElementById('lz-in'); V.typed = e3 ? e3.value : ''; V.help = Math.min(2, V.help + 1); render(); }
    else if (a === 'wcheck') writeCheck();
    else if (a === 'line') speak(s.lines[i][1]);
    else if (a === 'rdone') recordDone(false);
    else if (a === 'rother') recordDone(true);
    else if (a === 'tile') buildTap(k);
  }
  W.BohLezione = {
    register: function (lesson) { LESSONS[lesson.id] = lesson; },
    lessons: LESSONS,
    start: function (id, el) {
      L = LESSONS[id]; if (!L || !el) return;
      root = el; S = load();
      try { var t = localStorage.getItem('boh_theme'); if (t === 'dark' || t === 'light') document.documentElement.setAttribute('data-theme', t); } catch (e) {}
      root.addEventListener('click', onClick);
      root.addEventListener('keydown', function (ev) { if (ev.key === 'Enter' && ev.target && ev.target.id === 'lz-in') writeCheck(); });
      V = { name: 'map' }; render();
    },
    stats: function (id) { var l = LESSONS[id]; if (!l) return null; var s = null; try { s = JSON.parse(localStorage.getItem('boh_lz_' + id + '_v1') || 'null'); } catch (e) {} var d = 0; l.sections.forEach(function (x) { if (s && s.done && s.done[x.id]) d++; }); return { done: d, total: l.sections.length }; }
  };
})(window);
