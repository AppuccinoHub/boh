/* Checks a BOH unit source file. Usage: node tools/units-src/validate.js <file.json> [...] */
const fs = require('fs');
let bad = 0;
function err(f, m) { console.log(f + ': ' + m); bad++; }
const isStr = x => typeof x === 'string' && x.trim().length > 0;
for (const f of process.argv.slice(2)) {
  let u;
  try { u = JSON.parse(fs.readFileSync(f, 'utf8')); } catch (e) { err(f, 'not valid JSON: ' + e.message); continue; }
  const req = ['level', 'key', 'guideUnit', 'proficiency', 'title', 'tab', 'tabSub', 'eyebrow', 'question', 'words', 'workingOn', 'canDo', 'culture', 'vocab', 'grammar', 'sentences', 'forms', 'fill', 'read', 'listen', 'chat', 'parla', 'finish', 'idiom'];
  req.forEach(k => { if (u[k] === undefined) err(f, 'missing ' + k); });
  if (!/^italiano[1-4]$/.test(u.level || '')) err(f, 'bad level');
  if (!/^[a-z]{2,12}$/.test(u.key || '')) err(f, 'key must be 2-12 lowercase letters');
  if ((u.workingOn || '').length > 70) err(f, 'workingOn too long');
  let nw = 0;
  (u.vocab || []).forEach((g, i) => { if (!isStr(g.group) || !Array.isArray(g.words)) err(f, 'vocab group ' + i); (g.words || []).forEach(w => { nw++; if (!Array.isArray(w) || w.length !== 2 || !isStr(w[0]) || !isStr(w[1])) err(f, 'vocab word ' + JSON.stringify(w)); }); });
  if (nw < 12 || nw > 30) err(f, 'vocab should have 16-24 words, has ' + nw);
  const seen = {}; (u.vocab || []).forEach(g => (g.words || []).forEach(w => { if (seen[w[0]]) err(f, 'duplicate word ' + w[0]); seen[w[0]] = 1; }));
  const g = u.grammar || {};
  if (!isStr(g.head)) err(f, 'grammar.head');
  if (!Array.isArray(g.verbs) || !Array.isArray(g.rows)) err(f, 'grammar.verbs/rows must be arrays');
  (g.rows || []).forEach(r => { if (!isStr(r[0]) || r.length !== (g.verbs || []).length + 1) err(f, 'grammar row length ' + JSON.stringify(r)); for (let q = 1; q < r.length; q++) if (!Array.isArray(r[q]) || r[q].length !== 2) err(f, 'grammar cell ' + JSON.stringify(r[q])); });
  if (!Array.isArray(g.tricks) || g.tricks.length < 2) err(f, 'grammar.tricks 2-4');
  if (!Array.isArray(g.chips) || g.chips.length < 2) err(f, 'grammar.chips 2-4');
  if (!Array.isArray(u.sentences) || u.sentences.length < 10) err(f, 'sentences: 12');
  (u.sentences || []).forEach(s => { if (!Array.isArray(s) || !isStr(s[0]) || !isStr(s[1])) err(f, 'sentence ' + JSON.stringify(s)); if (s[0] && s[0].split(/\s+/).length > 12) err(f, 'sentence too long for tiles: ' + s[0]); });
  if (!Array.isArray(u.forms) || u.forms.length < 10) err(f, 'forms: 12');
  (u.forms || []).forEach(x => { ['prompt', 'answer', 'why'].forEach(k => { if (!isStr(x[k])) err(f, 'form ' + k + ' ' + JSON.stringify(x)); }); if (!Array.isArray(x.traps) || x.traps.length < 2) err(f, 'form traps ' + x.prompt); if (x.traps && x.traps.indexOf(x.answer) !== -1) err(f, 'trap equals answer ' + x.prompt); if (!Array.isArray(x.trick) || x.trick.length !== 2) err(f, 'form trick [title, text] ' + x.prompt); if (!Array.isArray(x.alts)) err(f, 'form alts array ' + x.prompt); });
  const lvn = +String(u.level).slice(-1);
  if (!Array.isArray(u.fill) || u.fill.length < 6) err(f, 'fill: 8');
  (u.fill || []).forEach(x => {
    if (!isStr(x.text) || x.text.split('___').length !== 2) err(f, 'fill needs exactly one ___ : ' + x.text);
    if (!Array.isArray(x.answers) || !x.answers.length) err(f, 'fill answers ' + x.text);
    if (!isStr(x.cue) || !isStr(x.hint) || !isStr(x.why)) err(f, 'fill cue/hint/why ' + x.text);
    if (lvn <= 2) { if (!Array.isArray(x.bank)) err(f, 'fill bank needed at levels 1-2 ' + x.text); else (x.answers || []).forEach(a => { if (x.bank.indexOf(a) === -1) err(f, 'bank missing answer ' + a); }); }
  });
  const r = u.read || {};
  if (!isStr(r.title) || !Array.isArray(r.passage) || r.passage.length < 3) err(f, 'read passage');
  const ptxt = (r.passage || []).map(p => p[0]).join(' ');
  Object.keys(r.gloss || {}).forEach(k => { if (ptxt.indexOf(k) === -1) err(f, 'gloss word not in passage: ' + k); });
  if (!Array.isArray(r.questions) || r.questions.length < 3) err(f, 'read questions 3-4');
  (r.questions || []).forEach(q => { if (!isStr(q.q) || !isStr(q.answer) || !Array.isArray(q.traps) || q.traps.length < 2 || !isStr(q.why)) err(f, 'read question ' + JSON.stringify(q)); if (q.traps && q.traps.indexOf(q.answer) !== -1) err(f, 'read trap equals answer'); });
  if (!Array.isArray(u.listen) || u.listen.length !== 3) err(f, 'listen: exactly 3');
  (u.listen || []).forEach(x => { if (!isStr(x.q) || !isStr(x.en) || !Array.isArray(x.frames) || !x.frames.length) err(f, 'listen item ' + JSON.stringify(x)); });
  const c = u.chat || {};
  if (!Array.isArray(c.who) || c.who.length !== 2 || !Array.isArray(c.lines) || c.lines.length < 4) err(f, 'chat');
  (c.lines || []).forEach(l => { if (l.length !== 3 || (l[0] !== 0 && l[0] !== 1)) err(f, 'chat line ' + JSON.stringify(l)); });
  const p = u.parla || {};
  if (!Array.isArray(p.prompts) || p.prompts.length !== 3 || !Array.isArray(p.checks) || p.checks.length !== 3) err(f, 'parla: 3 prompts, 3 checks');
  if (!/^Now I know/.test(u.finish || '')) err(f, 'finish must start "Now I know"');
  const id = u.idiom || {};
  ['it', 'en', 'ex', 'exEn', 'note'].forEach(k => { if (!isStr(id[k])) err(f, 'idiom.' + k); });
}
console.log(bad ? bad + ' problem(s)' : 'OK');
process.exit(bad ? 1 : 0);
