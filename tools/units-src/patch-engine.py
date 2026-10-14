"""One-time patch: teaches the lesson engine in all five level files the new item types
(ascolta, leggi) and the fill-in help (word bank, Hint, "more than one fits"), and loads the two shared files.
Safe to run twice: every change is skipped when its marker is already there."""
import re, sys, os
ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
LEVELS = ['italiano1', 'italiano2', 'italiano3', 'italiano4', 'ap']
V = '202610140100'

EDITS = [
  # 1. fresh state for the word bank
  ("if (it && it.t === 'mc') o.opts = shuffleArr([it.answer].concat(it.traps));",
   "if (it && it.t === 'mc') o.opts = shuffleArr([it.answer].concat(it.traps));\n    if (it && it.t === 'type' && it.bank) { o.wb = shuffleArr(it.bank.slice()); o.hintOn = false; }   /* boh-fillhelp-v1 */",
   'boh-fillhelp-v1'),
  # 2. defaults every render
  ("result.lsHasOggi = false; result.lsHasPrompt = false;",
   "result.lsHasWb = false; result.lsWb = []; result.lsHasMulti = false; result.lsHasHintBtn = false; result.lsHintOn = false; result.lsHintText = ''; result.lsTool = false;   /* boh-listen-v1 defaults */\n    result.lsHasOggi = false; result.lsHasPrompt = false;",
   'boh-listen-v1 defaults'),
  # 3. fill-in help on typed answers
  ("      result.lsAnswer = it.answers.map(function (a) { return G(a[0]); }).join(' · ');\n    }",
   "      result.lsAnswer = it.answers.map(function (a) { return G(a[0]); }).join(' · ');\n"
   "      /* boh-fillhelp-v1: word bank (Levels 1-2), Hint button, \"more than one fits\" */\n"
   "      var fDone = o.st === 'ok' || o.st === 'shown';\n"
   "      result.lsHasWb = !!o.wb && !fDone;\n"
   "      result.lsWb = (o.wb || []).map(function (w) { return { t: G(w), pick: function () { var o2 = JSON.parse(JSON.stringify(self.state.lsIt)); o2.vals[0] = G(w); if (o2.st === 'wrong') o2.st = 'ask'; o2.msg = ''; self.sfx('tap'); self.setState({ lsIt: o2 }); } }; });\n"
   "      result.lsHasMulti = !!it.multi;\n"
   "      result.lsHasHintBtn = !!it.hint && !fDone && !o.hintOn; result.lsHintOn = !!it.hint && !!o.hintOn && !fDone; result.lsHintText = it.hint ? '💡 ' + G(it.hint) : '';\n"
   "      result.lsHintH = function () { var o2 = JSON.parse(JSON.stringify(self.state.lsIt)); o2.hintOn = true; self.sfx('tap'); self.setState({ lsIt: o2 }); };\n"
   "    }",
   'boh-fillhelp-v1: word bank'),
  # 4. the two new item types
  ("    result.lsCheckDis = false;\n",
   "    if (view === 'stop' && (ty === 'ascolta' || ty === 'leggi')) {   /* boh-listen-v1: hear a question + record, or read + answer (assets/bohlisten.js) */\n"
   "      result.lsTool = true;\n"
   "      var blLv = (/\\/(italiano[1-4]|ap)\\//.exec(location.pathname) || [0, 'x'])[1];\n"
   "      var blKey = 'bl_' + blLv + '_' + BT_UNIT + '_' + ((D.stops[k] || {}).key || k) + '_' + i;\n"
   "      var blDone = typeof BohListen !== 'undefined' && BohListen.done(blKey);\n"
   "      result.lsToolHead = ty === 'ascolta' ? 'Ascolta e rispondi' : (it.title || 'Leggi e rispondi');\n"
   "      result.lsToolN = ty === 'ascolta' ? 'Hear a question · answer out loud in Italian' : 'Read a short text · answer ' + (it.questions || []).length + ' questions';\n"
   "      result.lsToolLbl = blDone ? (ty === 'ascolta' ? '🔊 Listen again' : '📖 Read it again') : (ty === 'ascolta' ? '🔊 Ascolta la domanda' : '📖 Leggi il testo');\n"
   "      result.lsToolSub = blDone ? '✓ Done! Avanti is open.' : (ty === 'ascolta' ? 'Listen, then record your answer. Then Avanti opens.' : 'Answer every question. Then Avanti opens.');\n"
   "      result.lsToolCls = 'ls-fc-go' + (blDone ? ' again' : '');\n"
   "      result.lsToolH = function () { self.sfx('tap'); if (typeof BohListen === 'undefined') return; BohListen.open({ type: ty, key: blKey, q: it.q, en: it.en, frames: it.frames, title: it.title, passage: it.passage, gloss: it.gloss, questions: it.questions, work: it.work, name: s.bohName, onClose: function () { self.setState({}); } }); };\n"
   "      result.lsCanNext = blDone || typeof BohListen === 'undefined';\n"
   "      result.lsNextLabel = items && i + 1 < items.length ? 'Avanti' : 'Finisci la tappa';\n"
   "    }\n"
   "    result.lsCheckDis = false;\n",
   'boh-listen-v1: hear a question'),
]

TPL_TOOL = ('              <sc-if value="{{lsTool}}" hint-placeholder-val="{{false}}"><!-- boh-listen-v1 -->\n'
            '                <h2 class="ls-head display">{{lsToolHead}}</h2>\n'
            '                <div class="ls-fc"><div class="ls-fc-n">{{lsToolN}}</div><button class="{{lsToolCls}}" onClick="{{lsToolH}}">{{lsToolLbl}}</button><div class="ls-fc-s">{{lsToolSub}}</div></div>\n'
            '              </sc-if>\n\n')
TPL_FILL = ('                <sc-if value="{{lsHasMulti}}" hint-placeholder-val="{{false}}"><div class="ls-multi">More than one answer fits here. Any correct one counts.</div></sc-if><!-- boh-fillhelp-v1 -->\n'
            '                <sc-if value="{{lsHasWb}}" hint-placeholder-val="{{false}}"><div class="ls-wb" role="group" aria-label="Word bank"><sc-for list="{{lsWb}}" as="w" hint-placeholder-count="4"><button class="ls-wbw" onClick="{{w.pick}}">{{w.t}}</button></sc-for></div></sc-if>\n'
            '                <sc-if value="{{lsHasHintBtn}}" hint-placeholder-val="{{false}}"><button class="ls-hintb" onClick="{{lsHintH}}">&#128161; Hint</button></sc-if>\n'
            '                <sc-if value="{{lsHintOn}}" hint-placeholder-val="{{false}}"><div class="ls-hintt" role="status">{{lsHintText}}</div></sc-if>\n')

ok = True
for lv in LEVELS:
    p = os.path.join(ROOT, lv, 'index.html')
    s = open(p, encoding='utf-8').read()
    for old, new, marker in EDITS:
        if marker in s: continue
        n = s.count(old)
        if n != 1: print(lv, 'ANCHOR COUNT', n, repr(old[:60])); ok = False; continue
        s = s.replace(old, new)
    # template: tool block before the Oggi line that follows the Impara block
    if 'boh-listen-v1 -->' not in s:
        a = '              <sc-if value="{{lsHasOggi}}"'
        if s.count(a) != 1: print(lv, 'TPL anchor oggi', s.count(a)); ok = False
        else: s = s.replace(a, TPL_TOOL + a)
    if 'boh-fillhelp-v1 -->' not in s:
        m = re.search(r'(              <sc-if value="\{\{lsType\}\}" hint-placeholder-val="\{\{false\}\}">\n                <div class="ls-sent">.*?</div>\n)(              </sc-if>)', s, re.S)
        if not m: print(lv, 'TPL anchor type'); ok = False
        else: s = s[:m.end(1)] + TPL_FILL + s[m.end(1):]
    # shared files
    if 'assets/bohlisten.js?v=' not in s:
        a = re.search(r'<script src="\.\./assets/flashcards\.js\?v=\d+" defer></script>', s)
        if not a: print(lv, 'no flashcards script tag'); ok = False
        else: s = s[:a.end()] + '\n<script src="../assets/bohlisten.js?v=' + V + '" defer></script>\n<script src="../assets/bohidiom.js?v=' + V + '" defer></script>' + s[a.end():]
    open(p, 'w', encoding='utf-8').write(s)
    print(lv, 'done')
sys.exit(0 if ok else 1)
