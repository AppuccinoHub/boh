/* Builds the new BOH units and the listen/read extras into the five level files.
   Usage (from the repo root):  node tools/units-src/build.js
   Reads  tools/units-src/<level>-<key>.json   (one new unit each, see SCHEMA.md)
          tools/units-src/extras-<level>.json  (listen + read + workingOn for units already in the game)
   Writes ONE generated block into each <level>/index.html between the markers boh-units-v1:start / :end,
          and the new units' Parla questions into assets/parla-<level>.js between the same markers.
   Run it again after editing any source file: it replaces the old block, it never duplicates. */
const fs = require('fs'), path = require('path');
const ROOT = path.resolve(__dirname, '..', '..');
const SRC = __dirname;
const LEVELS = ['italiano1', 'italiano2', 'italiano3', 'italiano4', 'ap'];
const ORDER = {   /* where the new units go: after the units already in the game, in guide order */
  italiano1: ['scuola', 'famiglia', 'cibo'],
  italiano2: ['feste', 'cibo', 'weekend', 'passato'],
  italiano3: ['casa', 'futuro', 'vorrei', 'nazione'],
  italiano4: ['globale', 'tecno', 'arte', 'dante'],
  ap: []
};
const SOON_DROP = { italiano2: /feste/i, italiano3: /futuro/i };   /* PRESTO placeholders the new units replace */
const NO_LESSON = { italiano1: ['it1'], italiano2: ['ea'], italiano3: ['vdp'], italiano4: [], ap: [] };

function strip(s) { return String(s).normalize('NFD').replace(/[̀-ͯ]/g, ''); }
function uniq(a) { return a.filter((x, i) => x && a.indexOf(x) === i); }
function noArt(w) { return w.replace(/^(il|lo|la|i|gli|le|l'|l’|un|uno|una|un')\s*/i, ''); }
function rot(arr, i, n) { const out = []; for (let k = 1; out.length < n && k < arr.length; k++) out.push(arr[(i + k * 3) % arr.length]); return uniq(out).filter(x => x !== arr[i]).slice(0, n); }
function alts(ans) { return uniq([strip(ans), ans.replace(/[.!?]$/, ''), strip(ans).replace(/[.!?]$/, '')]).filter(x => x !== ans); }

function buildUnit(u) {
  const lvn = u.level === 'ap' ? 5 : +u.level.slice(-1);
  const words = []; u.vocab.forEach(g => g.words.forEach(w => words.push(w)));
  const itW = words.map(w => w[0]), enW = words.map(w => w[1]);
  const QB = [];
  words.forEach((w, i) => {
    QB.push({ id: 'v' + (i + 1), cat: 'v', type: 'mc', prompt: w[0], sub: 'Che cosa vuol dire?', say: w[0], why: w[0] + ' = ' + w[1] + '.', trick: [w[0], w[0] + ' = ' + w[1] + '.'],
      options: [{ id: 'a', label: w[1], correct: true }].concat(rot(enW, i, 3).map((t, k) => ({ id: 'bcd'[k], label: t }))) });
    QB.push({ id: 'fr' + (i + 1), cat: 'fr', type: 'selfcheck', prompt: w[1], sub: 'Write it in Italian.', answer: w[0], alts: uniq(alts(w[0]).concat([noArt(w[0]), strip(noArt(w[0]))])).filter(x => x !== w[0]), trick: [w[0], w[0] + ' = ' + w[1] + '.'] });
  });
  u.forms.forEach((f, i) => {
    QB.push({ id: 'f' + (i + 1), cat: 'f', type: 'mc', prompt: f.prompt, sub: 'Which form?', why: f.why, trick: f.trick,
      options: [{ id: 'a', label: f.answer, correct: true }].concat(f.traps.slice(0, 3).map((t, k) => ({ id: 'bcd'[k], label: t }))) });
    QB.push({ id: 'w' + (i + 1), cat: 'w', type: 'selfcheck', prompt: f.prompt, sub: 'Write the form.', answer: f.answer, alts: uniq((f.alts || []).concat(alts(f.answer))), trick: f.trick });
  });
  const enS = u.sentences.map(s => s[1]);
  u.sentences.forEach((s, i) => {
    QB.push({ id: 'l' + (i + 1), cat: 'l', type: 'mc', prompt: '🔊 Ascolta, poi scegli: what does it mean?', sub: 'Tap Ascolta as often as you like.', say: s[0], why: s[0] + ' = ' + s[1],
      options: [{ id: 'a', label: s[1], correct: true }].concat(rot(enS, i, 3).map((t, k) => ({ id: 'bcd'[k], label: t }))) });
    QB.push({ id: 'sh' + (i + 1), cat: 'sh', type: 'mc', prompt: s[0], sub: 'Ascolta. Ripeti ad alta voce. Poi tocca.', say: s[0], why: s[0] + ' = ' + s[1],
      options: [{ id: 'a', label: 'Fatto ✓ I said it out loud', correct: true }, { id: 'b', label: 'Ancora ↻ again, please' }] });
  });
  /* La Prova: 8 words, 6 forms, 6 sentences, all written, graded */
  const step = Math.max(1, Math.floor(words.length / 8));
  for (let i = 0, n = 0; i < words.length && n < 8; i += step, n++) QB.push({ id: 'pA' + (n + 1), cat: 'prova', sec: 'A', type: 'selfcheck', prompt: words[i][1], sub: 'Write it in Italian.', answer: words[i][0], alts: uniq(alts(words[i][0]).concat([noArt(words[i][0]), strip(noArt(words[i][0]))])).filter(x => x !== words[i][0]) });
  u.forms.slice(0, 6).forEach((f, i) => QB.push({ id: 'pB' + (i + 1), cat: 'prova', sec: 'B', type: 'selfcheck', prompt: f.prompt, sub: 'Write the form.', answer: f.answer, alts: uniq((f.alts || []).concat(alts(f.answer))) }));
  u.sentences.slice(0, 6).forEach((s, i) => QB.push({ id: 'pD' + (i + 1), cat: 'prova', sec: 'D', type: 'selfcheck', prompt: s[1], sub: 'Write the whole sentence in Italian.', answer: s[0], alts: alts(s[0]) }));
  const nProva = QB.filter(q => q.cat === 'prova').length;
  const nv = Math.min(12, words.length), nf = Math.min(10, u.forms.length), nl = Math.min(8, u.sentences.length);
  const MODES = {
    v: { cap: { v: nv }, total: nv, label: '1 · Le parole', sub: 'Pick the meaning. Missed words come back.', cats: ['v'], needs: null, vocab: true },
    fr: { cap: { fr: nv }, total: nv, label: '2 · Scrivi le parole', sub: 'Write it in Italian. Small typos are OK.', cats: ['fr'], needs: 'v', vocab: true },
    f: { cap: { f: nf }, total: nf, label: '3 · Scegli la forma', sub: 'Pick the right form.', cats: ['f'], needs: 'fr' },
    w: { cap: { w: nf }, total: nf, label: '4 · Scrivi la forma', sub: 'Write the form. Small typos are OK.', cats: ['w'], needs: 'f' },
    l: { cap: { l: nl }, total: nl, label: '👂 Ascolta', sub: 'Listen to the sentence, pick the meaning.', cats: ['l'], needs: null },
    sh: { cap: { sh: nl }, total: nl, label: '🗣️ Ripeti', sub: 'Hear it, say it out loud, tap when done.', cats: ['sh'], needs: null },
    mixed: { label: 'MIXED ROUND', sub: '24 questions from every round', cats: ['v', 'fr', 'f', 'w'], needs: 'w', cap: { v: 6, fr: 6, f: 6, w: 6 }, total: 24 },
    prova: { label: 'LA PROVA · voto', sub: 'Graded. One pass, no hints — then screenshot your card.', cats: ['prova'], needs: 'mixed', total: nProva, ordered: true, graded: true },
    mistakes: { label: 'Fix my mistakes', sub: 'Only the cards you missed', cats: [], needs: null }
  };
  const unit = {
    MODES, QB,
    CAT: { v: 'LE PAROLE', fr: 'SCRIVI LE PAROLE', f: 'LE FORME', w: 'SCRIVI LA FORMA', l: 'ASCOLTO', sh: 'PARLA' },
    order: ['v', 'fr', 'f', 'w', 'l', 'sh', 'mixed', 'prova'], catOrder: ['v', 'fr', 'f', 'w', 'l', 'sh'], ord: ['v', 'fr', 'f', 'w', 'l', 'sh', 'mixed'],
    noTab: true, eyebrow: u.eyebrow, title: u.question, words: u.words, short: u.tabSub + ' · ' + u.tab.toUpperCase(), tab: u.tab, tabSub: u.tabSub, verbs: [],
    secn: { A: 'Le parole', B: 'Le forme', D: 'Le frasi' }, pops: [],
    fc: u.vocab.map((g, i) => ({ id: 'g' + (i + 1), title: g.group, cards: g.words })).concat([{ id: 'frasi', title: 'Le frasi', cards: u.sentences.slice(0, 8) }]),
    badges: { permission_trap: ['Le parole', 'Know every word.'], the_musts: ['Le forme', 'Get every form right.'], the_wants: ['Ascolta', 'Understand what you hear.'], the_cans: ['Le frasi', 'Write whole sentences.'], perfect_blank: ['Perfetto', '10 right in a row.'] }
  };

  /* ---------------- the lesson path: 4 stops, then La Prova */
  const work = 'Working on · ' + u.workingOn;
  const pick = words.map((w, i) => ({ t: 'mc', lv: 1, kicker: 'Pick it · Scegli', prompt: w[1], answer: w[0], traps: rot(itW, i, 2), why: w[0] + ' = ' + w[1] + '.', fm: 'pick', trick: [w[0], w[0] + ' = ' + w[1] + '.'] }));
  const hear = words.map((w, i) => ({ t: 'mc', lv: 1, kicker: 'Hear it · Ascolta', say: w[0], listen: true, prompt: '🔊 Ascolta e tocca', answer: w[0], traps: rot(itW, i, 2), why: 'You heard: ' + w[0] + ' = ' + w[1] + '.', fm: 'hear', trick: [w[0], w[0] + ' = ' + w[1] + '.'] }));
  const s1items = [{ t: 'impara', head: words.length + ' words. Then use them, over and over.', groups: u.vocab.map(g => [g.group, g.words]),
    tricks: [u.culture], spiaLabel: 'Frasi utili', spia: u.grammar.chips.slice(0, 3) }];
  for (let i = 0; i < 6 && i < pick.length; i++) s1items.push(pick[(i * 3) % pick.length]);
  s1items.push(hear[1 % hear.length], hear[4 % hear.length]);
  const s2items = [{ t: 'impara', head: u.grammar.head, verbs: u.grammar.verbs, rows: u.grammar.rows.length ? u.grammar.rows : undefined, tricks: u.grammar.tricks, spiaLabel: 'Frasi utili', spia: u.grammar.chips }];
  if (!s2items[0].rows) { delete s2items[0].rows; delete s2items[0].verbs; }
  u.forms.slice(0, 6).forEach(f => s2items.push({ t: 'mc', kicker: 'Scegli la forma giusta', prompt: f.prompt, answer: f.answer, traps: f.traps.slice(0, 2), why: f.why, trick: f.trick }));
  s2items.push({ t: 'text', who: u.chat.who, help: 'words', lines: u.chat.lines, words: u.chat.words || {}, kicker: 'La chat del giorno', bubble: 'Tap the dotted words if you need help.' });
  const s3items = u.listen.map(x => ({ t: 'ascolta', q: x.q, en: x.en, frames: x.frames, work: 'Listening · ' + u.workingOn, kicker: 'Ascolta e rispondi' }));
  s3items.push({ t: 'leggi', title: u.read.title, passage: u.read.passage, gloss: u.read.gloss || {}, questions: u.read.questions, work: 'Reading · ' + u.workingOn, kicker: 'Leggi e rispondi' });
  const s4items = u.fill.map(f => {
    const it = { t: 'type', text: f.text, answers: [f.answers], hints: [f.cue], hint: f.hint, why: f.why, kicker: 'Scrivi la parola giusta', trick: [f.cue, f.why] };
    if (lvn <= 2 && f.bank) it.bank = f.bank;
    if (f.answers.length > 1) it.multi = true;
    return it;
  });
  const tiles = u.sentences.filter(s => s[0].split(/\s+/).length >= 3 && s[0].split(/\s+/).length <= 8).slice(0, 3);
  tiles.forEach((s, i) => {
    const tw = s[0].split(/\s+/);
    const other = u.sentences.map(x => x[0].split(/\s+/)).flat().filter(w => tw.indexOf(w) === -1);
    s4items.push({ t: 'tiles', en: s[1], tiles: tw, traps: uniq([other[(i * 5) % other.length], other[(i * 5 + 3) % other.length]]), why: s[0], kicker: 'Costruisci la frase' });
  });
  s4items.push({ t: 'parla', kicker: 'Con un compagno: fate a turno', prompts: u.parla.prompts, checks: u.parla.checks });
  const lesson = {
    title: u.title, minutes: 48,
    lede: 'One stop a day, about 12 minutes. La Prova opens after stop 4. Extra practice is under Ripasso libero.',
    finishLine: 'Hai imparato, ascoltato, letto, scritto e parlato in italiano.',
    pathSub: 'One stop a day · La Prova on day 5',
    work: u.workingOn,
    stops: [
      { key: 'parole', label: 'Le parole', min: 12, kicker: work, bubble: u.grammar.chips[0], items: s1items },
      { key: 'regola', label: 'La regola', min: 12, kicker: work, bubble: u.grammar.chips[1] || u.grammar.chips[0], items: s2items },
      { key: 'ascolta', label: 'Ascolta e leggi', min: 12, kicker: work, bubble: 'Ascolta, poi rispondi in italiano.', items: s3items },
      { key: 'scrivi', label: 'Scrivi e parla', min: 12, kicker: work, bubble: 'Scrivi, poi parla con un compagno.', items: s4items }
    ]
  };
  return { unit, lesson };
}

function extrasStop(x) {
  const items = (x.listen || []).map(l => ({ t: 'ascolta', q: l.q, en: l.en, frames: l.frames, work: 'Listening · ' + x.workingOn, kicker: 'Ascolta e rispondi' }));
  if (x.read) items.push({ t: 'leggi', title: x.read.title, passage: x.read.passage, gloss: x.read.gloss || {}, questions: x.read.questions, work: 'Reading · ' + x.workingOn, kicker: 'Leggi e rispondi' });
  return { key: 'ascoltaleggi', label: 'Ascolta e leggi', min: 10, kicker: 'Working on · ' + x.workingOn, bubble: 'Ascolta, poi rispondi in italiano.', items };
}

const J = o => JSON.stringify(o).replace(/<\/(script)/gi, '<\\/$1').replace(/\u2028|\u2029/g, ' ');
const report = [];
for (const lv of LEVELS) {
  const file = path.join(ROOT, lv, 'index.html');
  let html = fs.readFileSync(file, 'utf8');
  const units = {}, lessons = {}, idioms = {}, finish = {}, parla = {};
  for (const key of ORDER[lv]) {
    const f = path.join(SRC, lv + '-' + key + '.json');
    if (!fs.existsSync(f)) { report.push(lv + ': MISSING ' + key); continue; }
    const u = JSON.parse(fs.readFileSync(f, 'utf8'));
    const b = buildUnit(u);
    units[key] = b.unit; lessons[key] = b.lesson;
    idioms[key] = u.idiom; finish[key] = u.finish;
    parla[key] = { title: u.title.replace(/^Unità \d+ · /, ''), questions: u.listen.map(x => ({ it: x.q, en: x.en })) };
  }
  let extras = {};
  const ef = path.join(SRC, 'extras-' + lv + '.json');
  if (fs.existsSync(ef)) extras = JSON.parse(fs.readFileSync(ef, 'utf8'));
  const addStops = {}, bonus = {};
  for (const k in extras) {
    if (NO_LESSON[lv].indexOf(k) !== -1) bonus[k] = { work: extras[k].workingOn, listen: extras[k].listen, read: extras[k].read };
    else addStops[k] = extrasStop(extras[k]);
  }
  const block = '/*boh-units-v1:start*/(function(){try{' +
    'var U=' + J(units) + ',L=' + J(lessons) + ',A=' + J(addStops) + ';' +
    'for(var k in U){BT_UNITS[k]=U[k];BT_LESSONS[k]=L[k];if(BT_UNIT_ORDER.indexOf(k)===-1)BT_UNIT_ORDER.push(k);}' +
    'for(var a in A){var D=BT_LESSONS[a];if(D&&D.stops&&!D.stops.some(function(s){return s.key===A[a].key;}))D.stops.push(A[a]);}' +
    (SOON_DROP[lv] ? 'BT_UNIT_SOON=BT_UNIT_SOON.filter(function(x){return !' + SOON_DROP[lv].toString() + '.test(x[0]);});' : '') +
    'window.BohIdiomExtra=window.BohIdiomExtra||{};window.BohIdiomExtra[' + J(lv) + ']=' + J(idioms) + ';' +
    'window.BohFinishExtra=window.BohFinishExtra||{};window.BohFinishExtra[' + J(lv) + ']=' + J(finish) + ';' +
    'window.BohBonus=window.BohBonus||{};window.BohBonus[' + J(lv) + ']=' + J(bonus) + ';' +
    '}catch(e){try{console.warn("boh-units-v1",e)}catch(_){}}})();/*boh-units-v1:end*/';
  const re = /\/\*boh-units-v1:start\*\/[\s\S]*?\/\*boh-units-v1:end\*\//;
  if (re.test(html)) html = html.replace(re, () => block);
  else {
    const m = html.match(/\nvar BT_UNIT_SOON = [^\n]*\n/);
    if (!m) throw new Error(lv + ': BT_UNIT_SOON line not found');
    html = html.replace(m[0], () => m[0] + block + '\n');
  }
  fs.writeFileSync(file, html);
  /* Parla con Prof questions for the new units (Italiano 2, 3, 4) */
  const pf = path.join(ROOT, 'assets', 'parla-' + lv + '.js');
  if (Object.keys(parla).length && fs.existsSync(pf)) {
    let p = fs.readFileSync(pf, 'utf8');
    const pb = '/*boh-units-v1:start*/(function(){try{var P=window.BohParlaData=window.BohParlaData||{};P[' + J(lv) + ']=P[' + J(lv) + ']||{};var N=' + J(parla) + ';for(var k in N)if(!P[' + J(lv) + '][k])P[' + J(lv) + '][k]=N[k];}catch(e){}})();/*boh-units-v1:end*/';
    if (re.test(p)) p = p.replace(re, () => pb); else p = p.replace(/\s*$/, '\n') + pb + '\n';
    fs.writeFileSync(pf, p);
  }
  report.push(lv + ': ' + Object.keys(units).length + ' new units, ' + Object.keys(addStops).length + ' units got an Ascolta e leggi stop, ' + Object.keys(bonus).length + ' bonus (no lesson path), block ' + Math.round(block.length / 1024) + ' KB');
}
console.log(report.join('\n'));
