/* boh-grade-v1 (Oct 2026): Prof's partial-credit rule for La Prova, defined ONCE for every level.
   Loaded after each level's own grader. It wraps evalFrasi; it never replaces it, so every
   level's own rules (strict items, must-have words, notes) still run first.

   The rule (Assunta, Oct 29 2026):
   100%  right; or only a preposition is wrong / misspelled on a test that is NOT about prepositions.
    80%  a small mistake that keeps the meaning: an accent, a misspelling, a wrong or missing
         article, a wrong agreement ending (-o/-a/-i/-e) on a word that is not a verb.
     0%  a mistake that changes the meaning: wrong verb, wrong person, wrong tense, wrong number
         or year, a missing key word. Strict items (verb blanks) stay strict.
   Retry: right on the 2nd try = 50%; a small mistake on the 2nd try = 40%.
   Only La Prova items (cat "prova") are graded this way; practice rounds are unchanged. */
(function (W) {
  'use strict';
  if (typeof W.evalFrasi !== 'function' || W.evalFrasi.__bohGrade) return;
  var SET = {
    PART: 0.8,                    // a small mistake
    RETRY: 0.5,                   // right on the second try
    PREP_UNITS: ['andare'],       // units whose La Prova tests prepositions (a / in)
    VERB_TEST: /\bform\b|missing verb|change it|command|from memory/i   // items that test one verb form
  };
  var PREPS = ['a', 'ad', 'in', 'di', "d'", 'da', 'su', 'per', 'con', 'tra', 'fra', 'col', 'coi'];
  ['a', 'da', 'di', 'in', 'su'].forEach(function (p) {
    var st = { a: 'al', da: 'dal', di: 'del', 'in': 'nel', su: 'sul' }[p];
    ['', 'lo', 'la', "l'", 'i', 'gli', 'le'].forEach(function (e, k) {
      if (k === 0) PREPS.push(st);
      else if (e === 'i') PREPS.push(st.slice(0, -1) + 'i');
      else if (e === 'gli') PREPS.push(st.slice(0, -1) + 'gli');
      else PREPS.push(st + e);
    });
  });
  var DET = ['un', 'una', 'uno', "un'", 'il', 'la', 'lo', "l'", 'i', 'le', 'gli', 'mio', 'mia', 'miei', 'mie', 'tuo', 'tua', 'tuoi', 'tue',
    'suo', 'sua', 'suoi', 'sue', 'nostro', 'nostra', 'nostri', 'nostre', 'vostro', 'vostra', 'vostri', 'vostre', 'questo', 'questa', 'questi',
    'queste', 'quel', 'quella', 'quei', 'quelle', 'molto', 'molta', 'molti', 'molte', 'tanto', 'tanta', 'tanti', 'tante', 'ogni', 'tutto', 'tutta',
    'tutti', 'tutte', 'poco', 'poca', 'pochi', 'poche', 'altro', 'altra', 'altri', 'altre'].concat(PREPS);
  var COPULA = ['sono', 'sei', 'e', 'siamo', 'siete', 'ero', 'eri', 'era', 'eravamo', 'eravate', 'erano', 'stato', 'stata', 'stati', 'state',
    'molto', 'piu', 'troppo', 'cosi', 'tanto', 'poco', 'abbastanza', 'sembra', 'diventato', 'diventata', 'diventati', 'diventate'];
  var orig = W.evalFrasi;
  var sa = function (w) { return W.stripAccents ? W.stripAccents(String(w)) : String(w); };
  var isPrep = function (w) { return PREPS.indexOf(sa(w)) !== -1; };
  var hasDigit = function (w) { return /\d/.test(w); };

  function prepTested(q) {
    try { if (SET.PREP_UNITS.indexOf(W.BT_UNIT) !== -1) return true; } catch (e) {}
    return /prepos|preposiz|\ba \/ in\b|\ba or in\b/i.test((q.sub || '') + ' ' + (q.prompt || '') + ' ' + (q.unitTitle || ''));
  }
  function verbTest(q) { return !!q.strict || SET.VERB_TEST.test(q.sub || ''); }
  function lex() { try { return W.btLex ? W.btLex() : {}; } catch (e) { return {}; } }
  // Is this a conjugated verb? True when the bank holds other persons of the same stem.
  function isVerb(w, L) {
    var x = sa(w).toLowerCase();
    if ((W.GR_ESAV || []).indexOf(x) !== -1 || (W.VERBISH || []).map(sa).indexOf(x) !== -1) return true;
    if (/([aei])v(o|i|a|amo|ate|ano)$/.test(x)) return true;            // imperfetto
    var m = /^(.+?)(o|i|a|e)$/.exec(x); if (!m) return false;
    var st = m[1], st2 = /i$/.test(st) ? st : st + 'i', hits = 0;
    [st2 + 'amo', st + 'ate', st + 'ete', st + 'ite', st + 'ano', st + 'ono', st + 'iamo'].forEach(function (f) { if (L[f]) hits++; });
    return hits >= 2;
  }
  function words(q, str, keep) {
    var ws = W.frWords(str);
    return W.frNormalise(keep ? ws : W.dropPronoun(ws));
  }
  // Compare one student word with one model word. 'ok' = full, 'part' = 80%, false = wrong.
  function cmpWord(q, x, y, prev, next, L, vt) {
    if (x === y) return 'ok';
    if (hasDigit(x) || hasDigit(y)) return false;                     // numbers and years must be exact
    if (!prepTested(q) && isPrep(x) && isPrep(y)) return 'ok';        // rule 1: prepositions don't count
    if (sa(x) === sa(y)) return 'part';                               // accent
    if (vt && (isVerb(y, L) || isVerb(x, L))) return false;           // verb tests: the verb must be right
    var GA = W.GR_ART || [];
    if (!(W.grArtTested && W.grArtTested(q)) && GA.indexOf(x) !== -1 && GA.indexOf(y) !== -1) return 'part';   // article
    var xs = sa(x), ys = sa(y);
    // agreement ending on a word that is not a verb (napoletana for napoletano)
    if (xs.length >= 3 && xs.slice(0, -1) === ys.slice(0, -1) && /[aeio]$/.test(xs) && /[aeio]$/.test(ys)) {
      if (isVerb(y, L) || isVerb(x, L)) return false;
      if (DET.indexOf(sa(prev || '')) !== -1 || COPULA.indexOf(sa(prev || '')) !== -1 || L[sa(prev || '')] && !isVerb(prev, L)) return 'part';
      return false;
    }
    if (L[xs]) return false;                                          // another real word or form: meaning changed
    if (ys.length < 4 || xs[0] !== ys[0]) return false;
    var d = W.btEdit ? W.btEdit(xs, ys) : 99;
    if (isVerb(y, L)) return d <= 1 ? 'part' : false;                 // a verb: one slip only; more is another tense or person
    if (d <= (ys.length >= 9 ? 3 : 2)) return 'part';                 // misspelling
    return false;
  }
  function digits(ws) { return ws.filter(hasDigit).join(' '); }
  function mustOk(q, said) {
    var sw = said.map(sa);
    return !(q.must || []).some(function (m) { return sw.indexOf(sa(m.w)) === -1; });
  }
  function trapHit(q, said, want) {
    return (q.traps || []).some(function (t) { var w = String(t.w).toLowerCase(); return said.indexOf(w) !== -1 && want.indexOf(w) === -1; });
  }
  // Grade text against every accepted answer; return 'ok', 'part' or false.
  function lenient(q, text) {
    var L = lex(), vt = verbTest(q), best = false;
    var all = [q.answer].concat(q.alts || []);
    // An accepted answer that is only another answer with its accents taken off is an accent slip (80%), not a full answer.
    var answers = all.filter(function (a) { return !all.some(function (b) { return b !== a && sa(b) === a && b !== sa(b); }); });
    var lead = W.grLead ? W.grLead(W.frWords(text)) : null;
    for (var i = 0; i < answers.length && best !== 'ok'; i++) {
      var pA = W.grLead ? W.grLead(W.frWords(answers[i])) : null, keep = !!(lead && pA && lead !== pA);
      var said = words(q, text, keep), want = words(q, answers[i], keep);
      if (digits(said) !== digits(want) || trapHit(q, said, want) || !mustOk(q, said)) continue;
      var tryLists = [[said, want]];
      var GA = W.GR_ART || [];
      if (!(W.grArtTested && W.grArtTested(q))) {                     // a missing or extra article
        var na = function (ws) { return ws.filter(function (w) { return GA.indexOf(w) === -1; }); };
        if (na(said).length !== said.length || na(want).length !== want.length) tryLists.push([na(said), na(want), 'art']);
      }
      for (var t = 0; t < tryLists.length; t++) {
        var a = tryLists[t][0], b = tryLists[t][1];
        if (!a.length || a.length !== b.length) continue;
        var res = tryLists[t][2] ? 'part' : 'ok';
        for (var k = 0; k < b.length && res; k++) {
          var c = cmpWord(q, a[k], b[k], b[k - 1], b[k + 1], L, vt);
          if (!c) res = false; else if (c === 'part') res = 'part';
        }
        if (res === 'ok') { best = 'ok'; break; }
        if (res === 'part') best = 'part';
      }
    }
    return best;
  }
  function wrapped(q, text) {
    var r = orig(q, text);
    if (!q || q.cat !== 'prova' || q.strict) return r;
    var g;
    try { g = lenient(q, text || ''); } catch (e) { return r; }
    if (r && r.ok) {
      if (g === false) {                                               // the old grader let a wrong or missing number through
        var dT = digits(words(q, text || '', true));
        var numOk = [q.answer].concat(q.alts || []).some(function (a) { return digits(words(q, a, true)) === dT; });
        if (!numOk) return { ok: false, marks: (r.marks || []).map(function (m) { return { w: m.w, bad: hasDigit(m.w) }; }), whys: ['Check the number.'], accentNote: '', tip: '' };
        g = 'part';                                                    // forgiven before by a rule we don't model: keep it, at 80%
      }
      if (g === 'part' && !(r.tip && r.tip === r.accentNote)) { r.part = true; r.tip = r.tip || ('80%: ' + (r.accentNote || 'small mistake.')); }
      return r;
    }
    if (g) {
      var ws = W.frWords(text || '');
      var out = { ok: true, marks: ws.map(function (w) { return { w: w, bad: false }; }), whys: [], accentNote: '', part: g === 'part' };
      out.accentNote = g === 'part' ? 'Counts for 80%: small mistake. Model: ' + q.answer : 'Counts! Watch the preposition: ' + q.answer;
      out.tip = out.accentNote;
      return out;
    }
    return r;
  }
  wrapped.__bohGrade = true;
  W.evalFrasi = wrapped;

  // Points for one La Prova log line. Recomputed from the saved answer, so a reload can't change it.
  function pts(r) {
    if (!r || !(r.ok || r.half)) return 0;
    var part = false;
    try {
      var bank = W.QUESTION_BANK || [], q = null;
      for (var i = 0; i < bank.length; i++) if (bank[i].id === r.id && bank[i].prompt === r.prompt) { q = bank[i]; break; }
      if (q) part = !!wrapped(q, r.given || '').part;
    } catch (e) {}
    var base = r.ok ? 1 : SET.RETRY;
    return part ? base * SET.PART : base;
  }
  W.BohGrade = {
    settings: SET, pts: pts, orig: orig,   /* orig: the level's own grader, kept for tests */
    total: function (log) { return (log || []).reduce(function (s, r) { return s + pts(r); }, 0); }
  };
})(window);
