/* Boh · shared behavior, defined once, used by every level that loads this file.
   1. BohUI.en(unit): is the English line on? (reads assets/english.js). Sets <html data-en="1|0"> so one stylesheet does the rest.
   2. BohUI.startVals(game, state, result): fills the Start card on the home (Today's lesson if set in assets/today.js, else the next stop).
   3. Warm-up: before the stop, one flashcard deck a day (3 new words + up to 3 missed review cards, never more than 6 cards).
      A unit opts in with BT_UNITS[unit].warm = ['io','tu'] (ids of its core decks, in order).
      assets/today.js: for a day with a Today lesson, warmup: true puts the warm-up first; otherwise Start goes straight to the lesson.
   Created by Assunta Scotto, 2026. */
(function (W) {
  if (W.BohUI) return;
  var LV = (/\/(italiano[1-4]|ap)\//.exec(location.pathname) || [])[1] || '';
  function ymd() { var d = new Date(), m = d.getMonth() + 1, x = d.getDate(); return d.getFullYear() + '-' + (m < 10 ? '0' : '') + m + '-' + (x < 10 ? '0' : '') + x; }
  function rd(k) { try { return JSON.parse(localStorage.getItem(k) || 'null'); } catch (e) { return null; } }
  function wr(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }

  /* ---- 1. English line ---- */
  function en(unit) {
    var c = (W.BohEnglishUnits || {})[LV];
    if (c === true) return true;
    if (c && c.length) return c.indexOf(unit) !== -1;
    return false;
  }
  function syncEn() {
    try { document.documentElement.setAttribute('data-en', en(W.BT_UNIT) ? '1' : '0'); } catch (e) {}
  }
  syncEn(); setInterval(syncEn, 400);
  document.addEventListener('DOMContentLoaded', syncEn);

  /* ---- 3. Warm-up ---- */
  function known(id) { var g = rd('boh_fc_' + id); return (g && g.known) || []; }
  function deckById(U, id) { var d = (U.fc || []).filter(function (x) { return x.id === id; })[0]; return d || null; }
  function unknownOf(unit, U, ids, max) {   // cards from the core decks the student has not marked "Lo so"
    var out = [];
    ids.forEach(function (id) {
      var d = deckById(U, id); if (!d) return;
      var k = known(unit + ':' + id);
      d.cards.forEach(function (c) { if (k.indexOf(c[0]) === -1 && out.length < max) out.push({ c: c, home: unit + ':' + id }); });
    });
    return out;
  }
  function warm(g, then) {
    var unit = W.BT_UNIT, U = (W.BT_UNITS || {})[unit];
    if (!U || !U.warm || !U.warm.length || !W.BohCards) { then(); return; }
    var core = U.warm, all = rd('boh_fc_wu') || {}, rec = all[unit] || { n: 0, day: '' };
    if (rec.day === ymd()) { then(); return; }           // today's warm-up is done
    var deck, review = [], isNew = rec.n < core.length;
    if (isNew) {
      var nd = deckById(U, core[rec.n]); if (!nd) { then(); return; }
      review = unknownOf(unit, U, core.slice(0, rec.n), 3);
      deck = { id: unit + ':' + nd.id, title: nd.title, cards: nd.cards.concat(review.map(function (r) { return r.c; })) };
    } else {
      review = unknownOf(unit, U, core, 6);
      if (!review.length) { rec.day = ymd(); all[unit] = rec; wr('boh_fc_wu', all); then(); return; }
      deck = { id: unit + ':rev:' + ymd(), title: 'Ripasso · Quick review', cards: review.map(function (r) { return r.c; }) };
    }
    var own = deck.cards.slice(0, deck.cards.length - (isNew ? review.length : 0)).map(function (c) { return c[0]; });
    W.BohCards.open({
      decks: [deck], start: deck.id,
      pay: function (bc) { var t = g.state; g.setState({ cashi: (t.cashi || 0) + bc, lifetime: (t.lifetime || 0) + bc }); },
      onClose: function () {
        // a review word marked "Lo so" counts in its own deck; the day's deck keeps only its own words
        try {
          var k = known(deck.id);
          if (isNew) {
            review.forEach(function (r) {
              if (k.indexOf(r.c[0]) !== -1) { var h = rd('boh_fc_' + r.home) || { known: [], passed: false, seen: [] }; if (h.known.indexOf(r.c[0]) === -1) h.known.push(r.c[0]); wr('boh_fc_' + r.home, h); }
            });
            var me = rd('boh_fc_' + deck.id); if (me) { me.known = (me.known || []).filter(function (w) { return own.indexOf(w) !== -1; }); wr('boh_fc_' + deck.id, me); }
          } else {
            review.forEach(function (r) {
              if (k.indexOf(r.c[0]) !== -1) { var h = rd('boh_fc_' + r.home) || { known: [], passed: false, seen: [] }; if (h.known.indexOf(r.c[0]) === -1) h.known.push(r.c[0]); wr('boh_fc_' + r.home, h); }
            });
          }
        } catch (e) {}
        var ok = W.BohCards.passed(deck.id);
        try { g.setState({}); } catch (e) {}
        if (!ok) return;                                  // closed early: stay on the home
        rec.day = ymd(); if (isNew) rec.n += 1; all[unit] = rec; wr('boh_fc_wu', all);
        then();
      }
    });
  }

  /* ---- 2. Start card ---- */
  function todayEntry() {
    var T = (W.BohToday || {})[LV];
    return T && !(T.until && ymd() > T.until) ? T : null;
  }
  function startVals(g, s, r) {
    var T = todayEntry(), name = (r.bohName || '').trim(), qep = false;
    try { qep = typeof W.__bohQepCur === 'function' && !!W.__bohQepCur(s); } catch (e) {}
    r.startHi = 'Ciao' + (name ? ', ' + name : '') + '!';
    r.startHiEn = 'Hi' + (name ? ', ' + name : '') + '!';
    r.startK = T ? 'Oggi · ' + T.date : 'Prossima tappa';
    r.startKen = T ? 'Today' : 'Next stop';
    r.startT = T ? T.title : (qep && r.unitTitle ? r.unitTitle : String(r.continuaLabel || '').replace(/^(Comincia|Continua):\s*/, ''));
    r.startW = T && T.words ? T.words : '';
    r.startN = T && T.note ? T.note : '';
    r.hasStartW = !!r.startW; r.hasStartN = !!r.startN;
    r.startH = function () {
      try { g.sfx && g.sfx('tap'); } catch (e) {}
      var proceed = function () {
        if (T && T.unit && T.unit !== W.BT_UNIT && typeof g.btSwitchUnit === 'function') { try { g.setState({ qepOff: true }); g.btSwitchUnit(T.unit); } catch (e) { location.href = T.url; } }
        else if (T && !T.unit && T.url) { location.href = T.url; }
        else if (typeof r.continuaH === 'function') { r.continuaH(); }
      };
      if (qep || (T && T.warmup !== true)) { proceed(); return; }   // a Today lesson skips the warm-up unless the day says warmup: true
      warm(g, proceed);
    };
  }

  W.BohUI = { en: en, startVals: startVals, warm: warm };
})(window);
