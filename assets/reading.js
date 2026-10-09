/* Boh · reading practice unit: one letter at a time, five short steps (Leggi, Capisci, Pratica, Rispondi, Regola).
   BohReading.register({...unit content...})   (the content lives in assets/reading-<id>.js)
   BohReading.start(id, element)
   Looks like every other Boh lesson: it uses assets/lezione.css (same colors, fonts, buttons, Prof. Lo So bubble).
   Words with a dotted underline show a short meaning when tapped. Endings {o|a} follow the student's Boh.
   "Ascolta" (step 1 only, optional) reads the letter with the shared Italian voice (assets/bohvoice.js).
   "Rileggi" opens the letter again from steps 2, 3 and 4 without losing the place.
   Progress is kept on this device in localStorage 'boh_rd_<id>_v1'.
   Boh Cashi go into the shared Boh wallet (boh_profile_v1), the same one every level uses.
   Made by Assunta Scotto. Created by Assunta Scotto, 2026. Not for redistribution. */
(function (W) {
  'use strict';
  if (W.BohReading) return;
  var UNITS = {}, U = null, S = null, root = null, V = { name: 'map' }, tok = 0;
  var GUIDE = '../assets/guide/';
  var CHEER = ['thumbs-up-wink', 'clap', 'cheer-fist', 'fists-yay', 'hands-heart', 'high-five'];
  var STEPS = ['Leggi', 'Capisci', 'Pratica', 'Rispondi', 'Regola'];

  /* ---------------------------------------------------------------- helpers */
  function esc(t) { return String(t == null ? '' : t).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function shuffle(a) { var b = a.slice(), i, j, t; for (i = b.length - 1; i > 0; i--) { j = Math.floor(Math.random() * (i + 1)); t = b[i]; b[i] = b[j]; b[j] = t; } return b; }
  function range(n) { var a = []; for (var i = 0; i < n; i++) a.push(i); return a; }
  function bust(p) { return 'style="background-image:url(' + GUIDE + 'bust/' + p + '.webp)"'; }
  function profile() { try { return JSON.parse(localStorage.getItem('boh_profile_v1') || 'null'); } catch (e) { return null; } }
  function wallet() { var p = profile(); return (p && p.cashi) || 0; }
  function bravo() { var p = profile(); return p && p.bohBase === 'm' ? 'Bravo' : 'Brava'; }
  function male() { var p = profile(); return !!(p && p.bohBase === 'm'); }
  /* {o|a} and {himself|herself}: first word for a boy Boh, second for a girl Boh */
  function gen(t) { var m = male(); return String(t).replace(/\{([^{}|]*)\|([^{}|]*)\}/g, function (_, a, b) { return m ? a : b; }); }

  /* ---------------------------------------------------------------- saved state + the shared wallet */
  function key() { return 'boh_rd_' + U.id + '_v1'; }
  function load() {
    var f = { v: 1, done: {}, paid: {}, earned: 0, plan: {} }, o = null;
    try { o = JSON.parse(localStorage.getItem(key()) || 'null'); } catch (e) {}
    if (o && typeof o === 'object') for (var k in o) f[k] = o[k];
    ['done', 'paid', 'plan'].forEach(function (k) { if (!f[k] || typeof f[k] !== 'object') f[k] = {}; });
    return f;
  }
  function save() { try { localStorage.setItem(key(), JSON.stringify(S)); } catch (e) {} }
  function pay(k, bc) {
    if (!bc || S.paid[k]) return 0;
    S.paid[k] = bc; S.earned = (S.earned || 0) + bc; save();
    try {
      var p = profile();
      if (p) { p.cashi = (p.cashi || 0) + bc; p.lifetime = (p.lifetime || 0) + bc; p._t = Date.now(); localStorage.setItem('boh_profile_v1', JSON.stringify(p)); }
    } catch (e) {}
    var w = root && root.querySelector('.lz-wal');
    if (w) {
      w.firstChild.nodeValue = wallet() + ' BC';
      var old = w.querySelector('.lz-plus'); if (old) old.remove();
      var s = document.createElement('span'); s.className = 'lz-plus'; s.textContent = '+' + bc + ' BC'; w.appendChild(s);
    }
    return bc;
  }

  /* ---------------------------------------------------------------- the Italian voice (shared) */
  function hasVoice() { try { return !!(W.BohVoice && W.BohVoice.list().length); } catch (e) { return false; } }
  var SLOW_RATE = 0.65;
  function speak(text, rate, onend) {
    try {
      if (!W.BohVoice) return false;
      var v = null; try { v = W.BohVoice.pick(); } catch (e) {}
      return !!W.BohVoice.speak(text, { rate: rate || 0.9, voice: v || undefined, onend: onend });
    } catch (e) { return false; }
  }
  function hush() { try { W.speechSynthesis.cancel(); } catch (e) {} }

  /* ---------------------------------------------------------------- letter text: tap-for-meaning words */
  function plain(t) { return gen(String(t).replace(/\[\[([^\]|]*)\|[^\]]*\]\]/g, '$1')); }
  function letterText(L) { return L.letter.map(plain).join(' ') + ' ' + plain(L.sign || ''); }
  function letterHtml(L) {
    var n = 0;
    function words(t) {
      return esc(t).replace(/\[\[([^\]|]*)\|([^\]]*)\]\]/g, function (_, w, m) {
        return '<button class="rd-w" data-act="gloss" data-i="' + (n++) + '" data-m="' + esc(gen(m)) + '">' + gen(w) + '</button>';
      }).replace(/\{([^{}|]*)\|([^{}|]*)\}/g, function (_, a, b) { return male() ? a : b; });
    }
    var h = '<div class="rd-letter">' + L.letter.map(function (p) { return '<p>' + words(p) + '</p>'; }).join('');
    h += '<div class="rd-tip" id="rd-tip" role="status" aria-live="polite"></div>';
    if (L.sign) h += '<p class="rd-sign">' + esc(gen(L.sign)) + '</p>';
    return h + '</div>';
  }

  /* ---------------------------------------------------------------- pieces shared with every lesson */
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

  /* ---------------------------------------------------------------- state helpers */
  function open_(i) { return i === 0 || !!S.done[U.letters[i - 1].id]; }
  function doneCount() { var n = 0; U.letters.forEach(function (l) { if (S.done[l.id]) n++; }); return n; }
  function stepCount(L) { return L.plan ? 6 : 5; } /* the plan letter has an optional sixth step */

  /* ---------------------------------------------------------------- map: the letters */
  function vMap() {
    var h = top('home', U.backLabel || 'Back', U.title, U.sub || '');
    h += stage(doneCount() === U.letters.length ? 'master' : 'point-side', doneCount() === U.letters.length ? 'Hai finito le lettere! ' + bravo() + '!' : U.intro);
    h += '<ol class="lz-map rd-map" style="grid-template-rows:repeat(' + Math.ceil(U.letters.length / 2) + ',auto)">';
    U.letters.forEach(function (L, i) {
      var done = !!S.done[L.id], op = open_(i), cur = op && !done && (i === 0 || S.done[U.letters[i - 1].id]);
      h += '<li><button class="lz-part' + (done ? ' done' : cur ? ' cur' : '') + (op ? '' : ' lock') + '" data-act="letter" data-i="' + i + '"' + (op ? '' : ' disabled') + '>' +
        '<span class="n">' + (done ? '' : (i + 1)) + '</span><span class="t"><b>' + esc(L.title) + '</b><span>' + esc(done ? 'Fatto' : op ? L.bl : 'Locked') + '</span></span></button></li>';
    });
    h += '</ol>';
    return h + '<div class="lz-note">Tap a letter. Boh Cashi go into your wallet.</div>';
  }

  /* ---------------------------------------------------------------- one letter, five steps */
  function curL() { return U.letters[V.li]; }
  function startLetter(i) { go({ name: 'step', li: i, step: 0, i: 0, phase: 'ask', chose: null, order: null, reread: false, bad: {} }); }
  function stepTop() {
    var L = curL();
    return top('map', 'Letters', L.title, (V.step + 1) + ' · ' + (V.step < 5 ? STEPS[V.step] : 'Il mio piano')) + dots(stepCount(L), V.step);
  }
  function rereadBtn() { return '<button class="lz-ghost" data-act="reread">Rileggi la lettera</button>'; }

  function vStep() {
    var L = curL(), h = '';
    if (V.reread) {
      h += top('closeread', 'Back', L.title, 'Rileggi') + stage('present', 'Ecco la lettera.') + letterHtml(L);
      return h + '<button class="lz-btn" data-act="closeread">Torna alla domanda</button>';
    }
    h += stepTop();
    if (V.step === 0) {
      h += stage('present', L.hook);
      h += letterHtml(L);
      h += '<div class="lz-note">Tap the dotted words to see what they mean.</div>';
      h += '<div class="lz-row rd-listen">' + (hasVoice()
        ? '<button class="lz-ghost" data-act="hear" aria-label="Hear the letter read aloud">&#9654; Ascolta</button><button class="lz-ghost" data-act="hearslow" aria-label="Hear the letter slowly">Slow</button><button class="lz-ghost" data-act="stopsay" aria-label="Stop">Stop</button>'
        : '<span class="lz-note">No Italian voice on this device. Read it on screen.</span>') + '</div>';
      h += '<button class="lz-btn" data-act="next">Continua</button>';
      return h;
    }
    if (V.step === 1) return h + vChoice({ q: L.q.t, small: 'Capisci', opts: L.q.o, a: L.q.a, tip: L.q.tip, why: gen(L.q.o[L.q.a]) , key: L.id + ':q', pay: U.pay.q, pose: 'think' });
    if (V.step === 2) { var m = L.mt[V.i]; return h + vChoice({ q: null, pre: m.pre, post: m.post, small: 'Pratica ' + (V.i + 1) + ' / ' + L.mt.length, opts: m.o, a: m.a, tip: m.tip, why: m.why, key: L.id + ':m' + V.i, pay: U.pay.m, pose: 'finger-up' }); }
    if (V.step === 3) { var r = L.rs[V.i]; return h + vChoice({ q: r.b, small: 'Rispondi ' + (V.i + 1) + ' / ' + L.rs.length, opts: r.o, a: r.a, tip: r.tip, why: r.why, key: L.id + ':r' + V.i, pay: U.pay.r, pose: 'listen', bubble: true }); }
    if (V.step === 4) return h + vRule(L);
    return h + vPlan(L);
  }

  /* one question with three answers, in the same style as every Boh lesson */
  function vChoice(c) {
    var L = curL();
    if (!V.order || V.orderFor !== V.step + ':' + V.i) { V.order = shuffle(range(c.opts.length)); V.orderFor = V.step + ':' + V.i; V.bad = {}; V.phase = 'ask'; V.miss = 0; }
    var h = '';
    var pose = V.phase === 'fb' ? CHEER[(V.i + V.step) % CHEER.length] : (V.miss ? 'finger-up' : c.pose);
    var line = V.phase === 'fb' ? 'Sì! ' + bravo() + '!' : (V.miss ? 'Not yet. Read the hint.' : (c.bubble ? c.q : (V.step === 1 ? 'Did you understand?' : 'Pick the chunk that fits.')));
    h += stage(pose, line);
    h += '<div class="lz-q"><small>' + esc(c.small) + '</small>' +
      (c.pre !== undefined ? '<span class="rd-sent">' + esc(gen(c.pre)) + ' <span class="rd-blank">' + (V.phase === 'fb' ? esc(gen(c.opts[c.a])) : '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;') + '</span> ' + esc(gen(c.post)) + '</span>' : (c.bubble ? '' : '<span>' + esc(gen(c.q)) + '</span>')) + '</div>';
    h += '<div class="lz-opts">' + V.order.map(function (oi) {
      var cls = '';
      if (V.phase === 'fb') cls = oi === c.a ? ' ok' : ' dim';
      else if (V.bad[oi]) cls = ' no';
      return '<button class="lz-opt' + cls + '" data-act="opt" data-k="' + oi + '"' + (V.phase === 'fb' || V.bad[oi] ? ' disabled' : '') + '>' + esc(gen(c.opts[oi])) + '</button>';
    }).join('') + '</div>';
    if (V.phase === 'fb') h += '<div class="lz-fb ok"><span class="a">' + esc(gen(c.opts[c.a])) + '</span><span class="m"><b>Remember:</b> ' + esc(gen(c.why)) + '</span><button class="lz-next" data-act="next">Avanti &rsaquo;</button></div>';
    else if (V.miss) h += '<div class="lz-fb pop"><span class="m"><b>Hint:</b> ' + esc(gen(c.tip)) + '</span></div>';
    else h += '<div class="lz-fb"></div>';
    if (V.step >= 1 && V.step <= 3 && V.phase !== 'fb') h += rereadBtn();
    V._c = c;
    return h;
  }
  function choose(k) {
    if (V.phase !== 'ask' || !V._c) return;
    var c = V._c;
    if (k === c.a) {
      var full = c.pay, amount = V.miss ? Math.max(1, Math.floor(full / 2)) : full;
      V.phase = 'fb'; pay(c.key, amount); render();
    } else { V.bad[k] = true; V.miss = (V.miss || 0) + 1; render(); }
  }

  function vRule(L) {
    var h = stage('master', 'Ecco la regola.');
    h += '<div class="lz-card rd-rule"><h2 class="dsp">' + esc(L.ruleTitle) + '</h2><div>' + gen(L.rule) + '</div></div>';
    h += '<button class="lz-btn" data-act="next">' + (L.plan ? 'Il mio piano' : 'Finito') + '</button>';
    if (L.plan) h += '<button class="lz-ghost" data-act="finish">Salta il piano</button>';
    h += rereadBtn();
    return h;
  }
  function vPlan(L) {
    var h = stage('tablet', 'Ora tocca a te: fai il tuo piano!');
    h += '<div class="rd-plan">' + U.plan.map(function (p) {
      return '<div class="lz-card"><b>' + esc(p.lbl) + '</b><div class="lz-opts">' + p.o.map(function (o, k) {
        return '<button class="lz-opt' + (S.plan[p.k] === o ? ' ok' : '') + '" data-act="plan" data-p="' + p.k + '" data-k="' + k + '">' + esc(gen(o)) + '</button>';
      }).join('') + '</div></div>';
    }).join('') + '</div>';
    var full = U.plan.every(function (p) { return S.plan[p.k]; });
    h += '<button class="lz-btn" data-act="finish"' + (full ? '' : ' disabled') + '>Finito</button>';
    h += '<button class="lz-ghost" data-act="finish">Salta</button>';
    return h;
  }
  function finishLetter() {
    var L = curL();
    pay(L.id + ':done', U.pay.letter);
    S.done[L.id] = 1; save();
    go({ name: 'done', li: V.li });
  }
  function vDone() {
    var L = curL(), last = doneCount() === U.letters.length;
    var h = '<div class="lz-big"><div class="lz-bust" ' + bust(last ? 'jump-joy' : 'clap') + '></div><h2 class="dsp">' + (last ? 'Unità finita!' : 'Lettera finita!') + '</h2>' +
      '<p>' + esc(L.title) + '</p><span class="lz-pill">' + wallet() + ' BC</span></div>';
    h += '<button class="lz-btn" data-act="map">' + (last ? 'Tutte le lettere' : 'Prossima lettera') + '</button>';
    return h;
  }

  /* ---------------------------------------------------------------- render + events */
  function render(keep) {
    var h;
    if (V.name === 'map') h = vMap();
    else if (V.name === 'step') h = vStep();
    else h = vDone();
    root.innerHTML = '<div class="lz">' + h + '</div>';
    if (!keep) root.scrollTop = 0;
  }
  function next() {
    var L = curL();
    if (V.step === 2 && V.phase === 'fb' && V.i + 1 < L.mt.length) { V.i++; V.order = null; return render(); }
    if (V.step === 3 && V.phase === 'fb' && V.i + 1 < L.rs.length) { V.i++; V.order = null; return render(); }
    if (V.step === 4 && !L.plan) return finishLetter();
    V.step++; V.i = 0; V.order = null; V.phase = 'ask'; V.bad = {}; V.miss = 0; hush(); render();
  }
  function onClick(e) {
    var b = e.target.closest ? e.target.closest('[data-act]') : null;
    if (!b || !root.contains(b)) return;
    var a = b.getAttribute('data-act');
    if (a === 'home') { W.location.href = (U.home || '../'); }
    else if (a === 'map') go({ name: 'map' });
    else if (a === 'letter') { var i = +b.getAttribute('data-i'); if (open_(i)) startLetter(i); }
    else if (a === 'gloss') {
      var tip = root.querySelector('#rd-tip');
      if (tip) { tip.textContent = b.textContent + ' = ' + b.getAttribute('data-m'); tip.classList.add('on'); }
      var all = root.querySelectorAll('.rd-w'); for (var j = 0; j < all.length; j++) all[j].classList.remove('sel'); b.classList.add('sel');
    }
    else if (a === 'hear') { hush(); speak(letterText(curL()), 0.9); }
    else if (a === 'hearslow') { hush(); speak(letterText(curL()), SLOW_RATE); }
    else if (a === 'stopsay') hush();
    else if (a === 'reread') { hush(); V.reread = true; render(); }
    else if (a === 'closeread') { V.reread = false; render(); }
    else if (a === 'opt') choose(+b.getAttribute('data-k'));
    else if (a === 'next') next();
    else if (a === 'plan') {
      var p = b.getAttribute('data-p'), k = +b.getAttribute('data-k');
      for (var q = 0; q < U.plan.length; q++) if (U.plan[q].k === p) S.plan[p] = U.plan[q].o[k];
      save(); render(true);
    }
    else if (a === 'finish') finishLetter();
  }

  W.BohReading = {
    register: function (u) { UNITS[u.id] = u; },
    start: function (id, el) {
      U = UNITS[id]; if (!U) return;
      root = el; S = load(); V = { name: 'map' };
      if (!root.__rdBound) { root.addEventListener('click', onClick); root.__rdBound = true; }
      render();
    }
  };
})(window);
