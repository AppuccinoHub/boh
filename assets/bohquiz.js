/* boh-quiz-v1 (Nov 13 2026): the ONE quiz rule for every Boh level and side unit.
   Created by Assunta Scotto, 2026-11-13. Original work. Not for redistribution.
   Rule (Assunta, Nov 13 2026):
   - A graded quiz (La Prova, side-unit La Prova, side-unit Quiz) passes at 60%.
   - Practice rounds are NOT touched: they keep their own 85% rule.
   - At 60% or more the student is asked "Are you happy with this grade going in the gradebook?"
       Yes = keep the grade and show the screenshot box. No = try again (best score is kept).
   - Under 60% the question is skipped: a kind message, a tips pointer and a Try again button.
   - La Prova's tries-per-hour limit stays exactly as each level already has it.
   The text lives here once. Level pages only call this file. */
(function (W) {
  'use strict';
  if (W.BohQuiz) return;
  var PASS = 60;
  var T = {
    q: 'Are you happy with this grade going in the gradebook?',
    yes: 'Yes, keep it',
    no: 'No, try again',
    lowT: 'Not there yet. That is okay.',
    lowB: 'Read What to study below, then try again. Your best score is kept.',
    tryAgain: 'Try again',
    bestNote: 'Your best score counts.'
  };
  function passes(pct) { return (+pct || 0) >= PASS; }
  function sub(pct, best) {
    var p = Math.round(+pct || 0), b = Math.round(+best || 0);
    return 'This try: ' + p + '%' + (b > p ? ' · Best: ' + b + '%. ' + T.bestNote : '');
  }
  /* The tries-per-hour limit lives in each level (btProvaLeft). startMode('prova') still enforces it;
     this only builds the friendly message when no tries are left. */
  function retry(self, h) {
    var t = h.left(self.state.provaTimes, Date.now());
    if (t.length >= 3) {
      self.setState({ pvNoTries: true, provaTimes: t });
      return;
    }
    self.setState({ pvNoTries: false });
    self.startMode('prova');
  }
  /* Fields for the framework level pages (italiano1, 2, 3, 4, ap). h = { left: btProvaLeft, clock: btClock } */
  function fields(s, self, h) {
    var pc = s.provaCard || {}, pct = +pc.pct || 0, best = (s.provaBest === null || s.provaBest === undefined) ? pct : s.provaBest;
    var onProva = s.screen === 'prova', low = !passes(pct), happy = !!s.pvHappy, noTry = '';
    if (s.pvNoTries) {
      var pt = h.left(s.provaTimes, Date.now());
      noTry = 'No tries left this hour. Next try at ' + (pt.length ? h.clock(Math.min.apply(null, pt) + 3600000) : 'soon') + '. Practice meanwhile!';
    }
    return {
      pvGate: onProva && !happy, pvLow: low, pvHigh: !low, pvShotOn: onProva && !low && happy,
      pvQ: T.q, pvQSub: sub(pct, best), pvYesLabel: T.yes, pvNoLabel: T.no,
      pvLowT: T.lowT, pvLowB: T.lowB, pvTryLabel: T.tryAgain,
      pvNoTry: !!s.pvNoTries, pvNoTryText: noTry,
      pvTryHandler: function () { self.sfx('tap'); retry(self, h); },
      pvNoGradeHandler: function () { self.sfx('tap'); retry(self, h); },
      pvYesGradeHandler: function () { self.sfx('tap'); self.setState({ pvHappy: true, pvNoTries: false }); }
    };
  }
  /* Side units (andare, andare 2, drama, andare 3) are plain-JS pages, not the framework. They call this once at the end of a graded quiz.
     o = { pct, best, canRetry, retry(), keep(), top }.  keep() draws the page's own results + screenshot box. */
  function sideGate(app, o) {
    var low = !passes(o.pct);
    if (!low && !o.canRetry) { o.keep(); return; }
    if (app.__bq) { app.removeEventListener('click', app.__bq); app.__bq = null; }
    var h = (o.top || '') + '<div class="stage"><div class="card center pop"><div class="big">' + Math.round(+o.pct || 0) + '%</div>';
    if (low) {
      h += '<div class="sub"><b>' + T.lowT + '</b></div><div class="sub">' + (o.canRetry ? 'Look at what you missed, then try again. ' + T.bestNote : 'No tries left. ' + T.bestNote) + '</div>' +
           '<div class="row" style="width:100%">' + (o.canRetry ? '<button class="btn p" data-bq="try">' + T.tryAgain + '</button>' : '') + '<button class="btn g" data-a="home">Home</button></div>';
    } else {
      h += '<div class="sub"><b>' + T.q + '</b></div><div class="sub">' + sub(o.pct, o.best) + '</div>' +
           '<div class="row" style="width:100%"><button class="btn g" data-bq="no">' + T.no + '</button><button class="btn p" data-bq="yes">' + T.yes + '</button></div>';
    }
    h += '</div></div>';
    app.innerHTML = h;
    app.__bq = function (e) {
      var b = e.target.closest && e.target.closest('[data-bq]'); if (!b) return;
      var k = b.getAttribute('data-bq');
      app.removeEventListener('click', app.__bq); app.__bq = null;
      if (k === 'yes') o.keep(); else o.retry();
    };
    app.addEventListener('click', app.__bq);
  }
  W.BohQuiz = { PASS: PASS, T: T, passes: passes, sub: sub, fields: fields, sideGate: sideGate };
})(window);
