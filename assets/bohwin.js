/* boh-win-v1 (Nov 15 2026): the ONE practice-round rule for every Boh level (Italiano 1, 2, 3, 4, AP).
   © Assunta Scotto, November 14, 2026, original creator. Not for redistribution.
   Rule (Assunta, Nov 15 2026):
   1. Hearts stay (3). At 0 hearts the round does NOT stop: the Win Ladder gives up to 3 easy wins,
      each pays 2 BC, then 2 hearts come back and the round goes on. At most 2 ladders in a round.
   2. A practice round passes at 70% (was 85%).
   3. Under 70% there is no "failed" screen: a fix-it round of only that round's missed cards.
      A missed card shows the answer and comes back (twice at most, then it moves on with the student
      and returns in later rounds). Finishing the fix-it round passes the round and opens Next.
   4. La Prova is never touched by this file (its rule is in assets/bohquiz.js).
   Easy wins are two-choice versions of cards the student already got right, so never above the level.
   Switch: each level page sets window.BOH_WIN_ON = true before loading this file.
           Set it to false and the page goes back to the old rule (85% and the knockout).
   The text lives here once. Level pages only call this file. */
(function (W) {
  'use strict';
  if (W.BohWin || W.BOH_WIN_ON !== true) return;
  var PCT = 70, WIN_BC = 2, HEARTS_BACK = 2, MAX_WINS = 3, MAX_LADDERS = 2, MAX_RETURNS = 2, AUTO_MS = 2600;
  var T = {
    tag: 'QUICK WIN', line: 'Quick win. You know this one.', pick: 'Pick the right one.', pickMean: 'Pick the meaning.',
    goNext: 'Next quick win', goBack: 'Back to your round', heartsBack: HEARTS_BACK + ' hearts back',
    noText: 'No worries. Keep going.', kick: 'ROUND DONE', head: 'Almost there!',
    fixTag: 'FIX-IT', back: 'This card comes back in a moment.', later: 'This card comes back in later rounds.',
    passed: 'ROUND PASSED'
  };
  var CSS = '.play-col:has(.bw-ladder)>*:not(.bw-ladder):not(:has(.bw-ladder)){display:none!important}' +
    '.bw-sum:has(.bw-bridge)>*:not(.bw-bridge):not(:has(.bw-bridge)){display:none!important}' +
    '.bw-ladder{display:flex;flex-direction:column;gap:14px;flex:1}' +
    '.bw-top{display:flex;justify-content:space-between;align-items:center;gap:10px}' +
    '.bw-tag{font-size:14px;font-weight:800;color:var(--catTag-text);background:var(--catTag-bg);padding:6px 12px;border-radius:999px}' +
    '.bw-right{display:flex;align-items:center;gap:12px}.bw-streak{display:inline-flex;align-items:center;gap:5px;font-weight:800;font-size:15px;color:var(--text)}.bw-hearts{display:flex;gap:3px}' +
    '.bw-mid{flex:1;display:flex;flex-direction:column;justify-content:center;gap:10px;min-height:110px}' +
    '.bw-line,.bw-sub{font-size:18px;font-weight:700;color:var(--text-muted)}' +
    '.bw-prompt{font-size:36px;font-weight:800;line-height:1.2;color:var(--pop,#BC1E72);overflow-wrap:anywhere}' +
    '.bw-opts{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}.bw-opts.one{grid-template-columns:minmax(0,1fr)}.bw-opts.one .bw-opt{font-size:17px;min-height:58px}.bw-prompt.sm{font-size:24px}' +
    '.bw-opt{font:inherit;display:flex;align-items:center;justify-content:center;text-align:center;padding:14px 10px;border-radius:14px;font-weight:700;font-size:19px;min-height:72px;cursor:pointer;overflow-wrap:anywhere;background:var(--option-default-bg);color:var(--text);border:2px solid var(--option-default-border)}' +
    '.bw-opt.ok{background:var(--success-bg);color:var(--success-text);border-color:var(--success-border);font-weight:800}' +
    '.bw-opt.no{background:var(--error-bg);color:var(--error-text);border-color:var(--error-border)}' +
    '.bw-opt.off{background:var(--muted-opt-bg);color:var(--muted-opt-text);border-color:var(--muted-opt-border)}' +
    '.bw-fb{display:flex;align-items:flex-end;gap:10px}' +
    '.bw-prof{flex:0 0 auto;width:76px;height:86px;background:url(../assets/guide/bust/cheer-fist.webp) center bottom/contain no-repeat}' +
    '.bw-bub{background:var(--card-bg);border:2px solid var(--success-border);border-radius:20px 20px 20px 4px;padding:8px 18px;margin-bottom:14px;font-size:26px;font-weight:800;color:var(--success-text)}' +
    '.bw-chips{display:flex;flex-wrap:wrap;gap:10px}' +
    '.bw-chip{display:inline-flex;align-items:center;gap:8px;padding:8px 16px 8px 12px;border-radius:999px;background:var(--card-bg);border:2px solid var(--card-border);font-size:18px;font-weight:800;color:var(--text)}' +
    '.bw-chip img{width:28px;height:28px;object-fit:contain}.bw-chip.bc{color:var(--gold,#896100)}' +
    '.bw-tip{display:flex;flex-direction:column;gap:6px;padding:12px 16px;border-radius:14px;background:var(--card-bg);border:2px solid var(--success-border);font-size:17px;line-height:1.45;color:var(--text)}' +
    '.bw-tip.no{background:var(--pop-tint,#FEE5EE);border:3px solid var(--pop,#BC1E72)}.bw-tip b{font-size:18px;font-weight:800}' +
    '.bw-note{padding:10px 14px;border-radius:12px;background:var(--pop-tint,#FEE5EE);border:2px solid var(--pop,#BC1E72);font-size:16px;font-weight:800;color:var(--text)}' +
    '.bw-bridge{display:flex;flex-direction:column;align-items:center;gap:14px;text-align:center;padding-top:8px}' +
    '.bw-kick{font-size:14px;font-weight:800;letter-spacing:.12em;color:var(--text-muted)}' +
    '.bw-h{font-size:40px;font-weight:800;line-height:1.1}.bw-p{font-size:20px;font-weight:600;line-height:1.4;margin:0}' +
    '.bw-up{align-self:stretch;display:flex;flex-direction:column;gap:4px;text-align:left;padding:14px 16px;border-radius:16px;background:var(--card-bg);border:2px solid var(--card-border)}' +
    '.bw-up span{font-size:14px;font-weight:800;letter-spacing:.08em;color:var(--text-muted)}.bw-up b{font-size:19px;font-weight:800}' +
    '.bw-bridge .hl-next,.bw-bridge .rbb,.bw-ladder .hl-next{align-self:stretch}.bw-bridge .hl-next{font-size:20px}';
  try { var st = document.createElement('style'); st.id = 'bw-css'; st.textContent = CSS; document.head.appendChild(st); } catch (e) {}

  function unit() { try { return btUnitKey(); } catch (e) { return ''; } }
  function addU(a, x) { a = (a || []).slice(); if (a.indexOf(x) === -1) a.push(x); return a; }
  function mix(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)), t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  function put(self, patch) { for (var k in patch) self.state[k] = patch[k]; self.setState(patch); }   // set now and re-draw
  function pending(s) { var f = s && s.bwFix; return f && f.u === unit() && f.ids && f.ids.length ? f : null; }
  function inFix(s) { return !!s && s.mode === 'mistakes' && !!pending(s); }

  /* ---------- the Win Ladder ---------- */
  function sibling(q) {
    try { for (var i = 0; i < QUESTION_BANK.length; i++) { var x = QUESTION_BANK[i]; if (x.cat === q.cat && x.type === q.type && typeof x.answer === 'string' && x.answer !== q.answer && x.answer.length <= 90) return x.answer; } } catch (e) {}
    return '';
  }
  function two(q, vocab) {   // an easy two-choice version of a card, or null when the card does not fit
    if (!q || !q.id || q.cat === 'prova') return null;
    var p = String(q.prompt || ''), good = '', bad = '';
    if (!p || p.length > 110) return null;
    if (q.type === 'mc' && q.options) {
      var ok = q.options.filter(function (o) { return o.correct; }), no = q.options.filter(function (o) { return !o.correct; });
      if (ok.length !== 1 || !no.length) return null;
      good = ok[0].label; bad = no[Math.floor(Math.random() * no.length)].label;
    } else if (q.type === 'selfcheck' && typeof q.answer === 'string') {
      good = q.answer; bad = (q.traps || [])[0] || sibling(q);
    } else return null;
    good = String(good || ''); bad = String(bad || '');
    if (!good || !bad || good === bad || good.length > 90 || bad.length > 90) return null;
    return { id: q.id, p: p, small: p.length > 24, long: good.length > 28 || bad.length > 28, sub: vocab && q.type === 'mc' ? T.pickMean : T.pick, good: good, opts: Math.random() < 0.5 ? [good, bad] : [bad, good],
             tip: String(q.why || (q.trick && q.trick[1]) || '') };
  }
  function easy(self) {   // only cards the student already got right: this round first, then today's cashed cards
    var s = self.state, miss = {}, seen = {}, pool = [], vocab = false;
    try { vocab = !!(MODES[s.mode] && MODES[s.mode].vocab); } catch (e) {}
    (s.missed || []).forEach(function (m) { if (m.id) miss[m.id] = 1; });
    (s.missedNow || []).concat(s.missedEver || []).forEach(function (id) { miss[id] = 1; });
    function take(q) { if (!q || !q.id || miss[q.id] || seen[q.id]) return; var c = two(q, vocab); if (c) { seen[q.id] = 1; pool.push(c); } }
    for (var i = 0; i < s.qIndex && i < (s.queue || []).length; i++) take(s.queue[i]);
    if (pool.length < MAX_WINS) { try { var paid = s.paid || []; QUESTION_BANK.forEach(function (q) { if (pool.length < 12 && paid.indexOf(q.id) !== -1) take(q); }); } catch (e) {} }
    if (pool.length < MAX_WINS) {   // then cards from rounds this student already passed in this unit
      try { var cats = {}; (s.passed || []).forEach(function (k) { if (MODES[k] && k !== 'prova') (MODES[k].cats || []).forEach(function (c) { cats[c] = 1; }); });
        mix(QUESTION_BANK.filter(function (q) { return cats[q.cat] && q.type === 'mc'; })).forEach(function (q) { if (pool.length < 12) take(q); }); } catch (e) {}
    }
    return mix(pool).slice(0, MAX_WINS);
  }
  function tick(self) {   // a right quick win moves on by itself
    clearTimeout(self._bwT);
    var L = self.state.bwL; if (!L || L.st !== 'ok') return;
    var at = L.i; self._bwT = setTimeout(function () { var M = self.state.bwL; if (M && M.st === 'ok' && M.i === at && self.state.screen === 'play') go(self); }, AUTO_MS);
  }
  function pick(self, k) {
    var s = self.state, L = s.bwL; if (!L || L.st !== 'ask') return;
    var c = L.cards[L.i], ok = c.opts[k] === c.good, last = L.i === L.cards.length - 1, patch = {};
    patch.bwL = { cards: L.cards, i: L.i, st: ok ? 'ok' : 'no', pick: k, won: L.won + (ok ? 1 : 0) };
    if (ok) {
      patch.cashi = (s.cashi || 0) + WIN_BC; patch.lifetime = (s.lifetime || 0) + WIN_BC; patch.sessionEarned = (s.sessionEarned || 0) + WIN_BC;
      patch.streak = (s.streak || 0) + 1; patch.bestStreak = Math.max(s.bestStreak || 0, patch.streak);
    }
    if (last) patch.hearts = Math.max(s.hearts || 0, HEARTS_BACK);
    try { self.sfx(ok ? 'coin' : 'soft'); } catch (e) {}
    put(self, patch); tick(self);
  }
  function go(self) {
    clearTimeout(self._bwT);
    var s = self.state, L = s.bwL; if (!L || L.st === 'ask') return;
    try { self.sfx('tap'); } catch (e) {}
    if (L.i < L.cards.length - 1) { put(self, { bwL: { cards: L.cards, i: L.i + 1, st: 'ask', pick: -1, won: L.won } }); return; }
    put(self, { bwL: null, hearts: Math.max(s.hearts || 0, HEARTS_BACK) });
    self.nextCard();   // the round goes on from where it stopped
  }

  /* ---------- hooks the level pages call ---------- */
  function start(self) {   // startMode: a new round begins
    clearTimeout(self._bwT); self._bwN = 0; self._bwKey = ''; self._bwCar = 0;
    self.state.bwL = null; self.state.bwFixed = null;
  }
  function next(self) {   // nextCard: true = the round waits (a ladder is on screen)
    var s = self.state;
    if (s.screen !== 'play' || !s.mode || s.mode === 'prova') return false;
    if (s.bwL) return true;
    var q = (s.queue || [])[s.qIndex];
    if (s.mode === 'mistakes') {   // fix-it round: a missed card comes back
      var key = s.qIndex + '|' + (s.totalSoFar || 0);
      if (q && q.id && self._bwKey !== key && pending(s)) {
        self._bwKey = key;
        var last = (s.missed || [])[(s.missed || []).length - 1];
        if (s.lastOk && (s.missedNow || []).indexOf(q.id) !== -1) put(self, { missedNow: s.missedNow.filter(function (x) { return x !== q.id; }) });   // right this time = fixed
        if (!s.lastOk && last && last.id === q.id) {
          if ((q._ret || 0) < MAX_RETURNS) { var c = {}; for (var k in q) c[k] = q[k]; c._ret = (q._ret || 0) + 1; put(self, { queue: s.queue.concat([c]) }); }
          else { self._bwCar = (self._bwCar || 0) + 1; put(self, { carry: addU(s.carry, unit() + '|' + q.id).slice(-15) }); }
        }
      }
      return false;
    }
    if (s.hearts !== 0) return false;
    if (s.qIndex + 1 >= (s.queue || []).length) return false;   // last card: the round simply ends
    var cards = (self._bwN || 0) < MAX_LADDERS ? easy(self) : [];
    if (!cards.length) { put(self, { hearts: 1 }); return false; }   // no ladder left: hearts never stay at 0
    self._bwN = (self._bwN || 0) + 1;
    try { btTipTimer(null); } catch (e) {}
    put(self, { bwL: { cards: cards, i: 0, st: 'ask', pick: -1, won: 0 },
                tipHold: 'r|' + s.mode + '|' + s.qIndex + '|' + (s.totalSoFar || 0) + '|' + (s.queue || []).length });
    return true;
  }
  function done(self, out, accT, accC, finished) {   // finish(): the results are being built
    var s = self.state, md = s.mode;
    if (!md || md === 'prova') return;
    var passed = out.passed || s.passed || [], fx = pending(s);
    if (md === 'mistakes') {
      if (fx && finished) {   // fix-it round done = the round is passed
        out.justPassed = passed.indexOf(fx.m) === -1; out.passed = addU(passed, fx.m);
        out.mistakesFrom = fx.m; out.failReason = '';
        out.bwFixed = { m: fx.m, n: fx.ids.length, k: Math.min(self._bwCar || 0, fx.ids.length), c: fx.c, t: fx.t }; out.bwFix = null;
      }
      return;
    }
    if (out.stuck) { var stk = {}, sk = ''; try { sk = BT_UNIT + ':' + md; } catch (e) {} for (var q in out.stuck) if (q !== sk) stk[q] = out.stuck[q]; out.stuck = stk; }   // the old help steps no longer count tries
    if (passed.indexOf(md) !== -1) { if (fx && fx.m === md) out.bwFix = null; return; }
    if (!finished || !(accT > 0)) return;
    var ids = []; (out.missed || s.missed || []).forEach(function (m) { if (m.id && ids.indexOf(m.id) === -1) ids.push(m.id); });
    if (!ids.length) return;
    out.bwFix = { u: unit(), m: md, ids: ids, c: accC, t: accT }; out.failReason = '';
  }
  function view(r, s, self) {   // end of renderVals: fields for the two new blocks, and the old fail texts switched off
    var L = s.bwL, fx = pending(s);
    r.bwOn = !!L && s.screen === 'play'; r.bwBridge = false; r.bwNote = false;
    if (r.bwOn) {
      var c = L.cards[L.i], asked = L.st === 'ask', last = L.i === L.cards.length - 1;
      r.bwTag = T.tag + ' \u00b7 ' + (L.i + 1) + ' of ' + L.cards.length; r.bwLine = T.line; r.bwPrompt = c.p; r.bwSub = c.sub;
      r.bwPromptCls = 'display bw-prompt' + (c.small ? ' sm' : ''); r.bwOptsCls = 'bw-opts' + (c.long ? ' one' : '');
      r.bwOpts = c.opts.map(function (t, k) {
        return { label: t, cls: 'bw-opt' + (asked ? '' : t === c.good ? ' ok' : k === L.pick ? ' no' : ' off'), pick: function () { pick(self, k); } };
      });
      r.bwOk = L.st === 'ok'; r.bwNo = L.st === 'no'; r.bwDone = !asked;
      r.bwPay = '+' + WIN_BC + ' BC'; r.bwBack = r.bwOk && last; r.bwBackText = T.heartsBack;
      r.bwAns = c.good; r.bwNoText = T.noText; r.bwHasTip = !asked && !!c.tip; r.bwTip = c.tip;
      r.bwGoLabel = last ? T.goBack : T.goNext; r.bwGo = function () { go(self); };
    }
    if (s.screen === 'play' && inFix(s)) {   // fix-it round: its own tag, and a note when a card will come back
      var left = fx.ids.filter(function (id) { return (s.missedEver || []).indexOf(id) !== -1; }).length;
      r.catTag = T.fixTag + ' \u00b7 ' + (fx.ids.length - left) + '/' + fx.ids.length;
      var q = (s.queue || [])[s.qIndex], lastM = (s.missed || [])[(s.missed || []).length - 1];
      if (q && s.revealed && !s.lastOk && lastM && lastM.id === q.id) { r.bwNote = true; r.bwNoteText = (q._ret || 0) < MAX_RETURNS ? T.back : T.later; }
    }
    if (s.screen !== 'summary') return;
    r.outOfHearts = false; r.hasFailNote = false; r.hlClose = false; r.hlRipasso = false; r.hlNote = false; r.hlProf = false; r.hlMoveOn = false; r.hlWait = false; r.showPlayAgain = true;
    if (fx && s.mode === fx.m) {   // the round ended under the pass mark: one screen, one button
      var n = fx.ids.length, up = '';
      try { var order = BT_UNITS[BT_UNIT].order, at = order.indexOf(fx.m), nx = at !== -1 ? order[at + 1] : null; if (nx && nx !== 'prova' && MODES[nx]) up = MODES[nx].label; } catch (e) {}
      r.bwBridge = true; r.nextLocked = false;
      r.bwFixText = 'Fix ' + n + (n === 1 ? ' card' : ' cards') + '. Then ' + (up ? 'the next round opens.' : 'this round is done.');
      r.bwFixBtn = n === 1 ? 'Fix my card' : 'Fix my ' + n + ' cards';
      r.bwHasEarn = (s.sessionEarned || 0) > 0; r.bwEarnText = '+' + (s.sessionEarned || 0) + ' Boh Cashi so far';
      r.bwHasUp = !!up; r.bwUpText = up;
      r.bwFixH = function () { try { self.sfx('tap'); } catch (e) {} self.startMode('mistakes'); };
    }
    if (s.mode === 'mistakes' && s.bwFixed) {   // fix-it round finished: the round is passed
      var f = s.bwFixed, fixed = f.n - (f.k || 0);
      r.bwKick = T.passed; r.accuracyPct = fixed + ' of ' + f.n;
      r.correctTotalText = (f.n === 1 ? 'card fixed. ' : 'cards fixed. ') + (f.k ? f.k + ' will come back in later rounds. ' : '') + 'First try: ' + f.c + ' of ' + f.t + ' right';
    }
  }

  W.BohWin = {
    PCT: PCT, PASS: PCT / 100, WIN_BC: WIN_BC, HEARTS_BACK: HEARTS_BACK, T: T,
    noKnock: function (s) { return !!s && s.mode !== 'prova'; },          // no knockout at 0 hearts in practice
    keepHearts: function (s) { return !!s && s.mode === 'mistakes'; },    // a fix round never costs hearts
    flatPay: function (s) { return inFix(s); },                           // fix-it cards pay the normal BC, never the fixed-mistake bonus
    deckIds: function (self) {                                            // the fix-it deck: only that round's missed cards (those still to fix first)
      var f = pending(self.state); if (!f) return null;
      var m = self.mistakeIds(), left = f.ids.filter(function (id) { return m.indexOf(id) !== -1; });
      return left.length ? left : f.ids.slice();
    },
    start: start, next: next, done: done, view: view, two: two
  };
})(window);
