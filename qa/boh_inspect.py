#!/usr/bin/env python3
"""Boh inspection (read-only). Opens all five levels and reports what is the same and what is different.

Run from the repo root:   python3 qa/boh_inspect.py
Writes:  qa/report.md  (read this)   qa/report.json  (data)   qa/baseline/*.png  (screenshots)
It never edits a game page.
"""
import hashlib, json, os, re, subprocess, sys, time
from playwright.sync_api import sync_playwright

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
LEVELS = ['italiano1', 'italiano2', 'italiano3', 'italiano4', 'ap']
SIZES = {'chromebook': (1280, 600), 'laptop': (1366, 650), 'phone': (390, 780)}
PORT = 8767
SEED = "localStorage.setItem('boh_profile_v1',JSON.stringify({bohBase:'f',bohName:'Gia',bohSkin:'medium',bohHair:'dark',cashi:40,equipped:{}}))"
# the shared lesson-engine methods that must be byte-identical in every level
# AUDIENCE RULES (decided by the teacher, October 4). The report checks each level against these.
#   break games (pausa mini-games every 12 items): not for Levels 1-2 (ages 14-16, would play all period)
#   recording box + Vocaroo: not for Levels 1-2; wanted in Levels 3, 4, AP (Levels 4 and AP first)
LEVEL_RULES = {
    'italiano1': {'break': False, 'recording': False},
    'italiano2': {'break': False, 'recording': False},
    'italiano3': {'break': True,  'recording': True},
    'italiano4': {'break': True,  'recording': True},
    'ap':        {'break': True,  'recording': True},
}
SHARED_METHODS = ['lsFresh', 'lsCheck', 'lsPickMc', 'lsNext', 'lsSayIt', 'lsRight', 'lsWrong', 'lsPay', 'lsNoSnd', 'lsReadIt', 'lsTellProf', 'lsSkipListen', 'lsVoicesH']
SHARED_CSS = ['.ls-rec{', '.ls-say{', '.ls-nosnd{', '.ls-help{', '.ls-hb{', '.ls-readit{']
SHARED_ASSETS = ['bohvoice.js', 'flashcards.js', 'recorder.js', 'recordit.js', 'routine.js', 'scorecard.js', 'gloss.js', 'bohsave.js', 'bohhome.js']


def h(s):
    return hashlib.sha1(s.encode('utf-8')).hexdigest()[:10]


BREAK_HOOK = re.compile(r"    (if \(this\.state\.mode !== 'prova' && )?!this\._inBreak\)? ?\{.*?\n    \}\n", re.S)


def method_text(src, name):
    m = re.search(r'\n  ' + re.escape(name) + r'\([^)]*\) \{', src)
    if not m:
        return None
    nxt = re.search(r'\n  [A-Za-z_]+\([^)]*\) \{', src[m.end():])
    end = m.end() + nxt.start() if nxt else m.end() + 4000
    txt = src[m.start():end]
    return re.sub(r"\n    if \(!this\._inBreak\) \{.*?\n    \}\n", "\n", txt, flags=re.S)


def css_rule(src, start):
    i = src.find(start)
    if i < 0:
        return None
    j = src.find('}', i)
    return src[i:j + 1]


def static_checks(level):
    src = open(os.path.join(ROOT, level, 'index.html'), encoding='utf-8').read()
    out = {'bytes': len(src)}
    out['methods'] = {n: (h(method_text(src, n)) if method_text(src, n) else None) for n in SHARED_METHODS}
    out['css'] = {c: (h(css_rule(src, c)) if css_rule(src, c) else None) for c in SHARED_CSS}
    assets = {}
    for m in re.finditer(r'<script[^>]*\bsrc="(?:\.\./)?assets/([A-Za-z0-9\-]+\.js)(\?v=\d+)?"', src):
        assets[m.group(1)] = m.group(2) or ''
    out['assets'] = assets
    out['has_vocaroo_text'] = 'vocaroo' in src.lower()
    out['has_listen_flag'] = 'boh-listen-v1' in src
    out['has_listen_v2'] = 'boh-listen-v2' in src
    out['has_u1_hidden_unit'] = 'boh-u1' in src
    out['has_break'] = 'function bohBreak' in src and 'bohBreak(Math.floor' in src
    out['has_recorder'] = 'recordit.js' in assets
    # tokens
    root = re.search(r':root\{([^}]*)\}', src)
    toks = {}
    if root:
        for m in re.finditer(r'--([a-z0-9\-]+):\s*([^;]+);', root.group(1)):
            toks[m.group(1)] = m.group(2).strip()
    out['tokens'] = toks
    return out


JS_INVENTORY = r"""
() => {
  const o = {};
  const U = window.BT_UNITS || {}, L = window.BT_LESSONS || {};
  o.unitOrder = window.BT_UNIT_ORDER || []; o.unitSoon = (window.BT_UNIT_SOON || []).map(x => x[0]);
  o.units = {};
  Object.keys(U).forEach(k => {
    const u = U[k], modes = Object.keys(u.MODES || {});
    const qb = u.QB || [];
    const types = {}; qb.forEach(q => { types[q.type] = (types[q.type] || 0) + 1; });
    o.units[k] = { tab: u.tab, tabSub: u.tabSub, title: u.title, eyebrow: u.eyebrow, modes: modes, questions: qb.length, qTypes: types, decks: (u.fc || []).length, inOrder: (window.BT_UNIT_ORDER || []).indexOf(k) >= 0 };
  });
  o.lessons = {};
  Object.keys(L).forEach(k => {
    const d = L[k]; const stops = (d.stops || []).map(s => {
      const kinds = {}; let say = 0, listen = 0, parla = 0;
      (s.items || []).forEach(it => { kinds[it.t] = (kinds[it.t] || 0) + 1; if (it.say) say++; if (it.listen) listen++; if (it.t === 'parla') parla++; });
      return { key: s.key, label: s.label, min: s.min, type: s.type || '', items: (s.items || []).length, kinds: kinds, say: say, listen: listen, parla: parla };
    });
    o.lessons[k] = { title: d.title, minutes: d.minutes, tips: d.tips, stops: stops, reachable: (window.BT_UNITS || {})[k] ? true : false };
  });
  o.globals = { BohVoice: typeof BohVoice, BohRecorder: typeof BohRecorder, BohRoutine: typeof BohRoutine, BohCards: typeof BohCards, BohScoreCard: typeof window.BohScoreCard };
  o.routineUnits = (typeof BohRoutine !== 'undefined' && BohRoutine.units) ? Object.keys(BohRoutine.units) : [];
  return o;
}
"""

JS_LOOK = r"""
() => {
  const q = (sel) => document.querySelector(sel);
  const cs = (el, p) => el ? getComputedStyle(el)[p] : null;
  const btn = Array.from(document.querySelectorAll('button')).filter(b => /^(Comincia|Continua|Start|Ripassa)/.test((b.textContent||'').trim()))[0] || null;
  const hd = q('h1, h2, .display');
  return {
    bodyBg: cs(document.body, 'backgroundColor'), bodyFont: cs(document.body, 'fontFamily'), bodyColor: cs(document.body, 'color'),
    headFont: cs(hd, 'fontFamily'), headColor: cs(hd, 'color'),
    btnBg: cs(btn, 'backgroundColor'), btnRadius: cs(btn, 'borderRadius'), btnFont: cs(btn, 'fontFamily'),
    overflowX: document.documentElement.scrollWidth - document.documentElement.clientWidth,
    title: document.title, h1: (hd && hd.textContent || '').trim().slice(0, 80),
    buttons: document.querySelectorAll('button').length, bodyText: document.body.innerText.length
  };
}
"""


def main():
    os.makedirs(os.path.join(ROOT, 'qa', 'baseline'), exist_ok=True)
    srv = subprocess.Popen([sys.executable, '-m', 'http.server', str(PORT)], cwd=ROOT, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    time.sleep(1.0)
    rep = {'when': time.strftime('%Y-%m-%d %H:%M'), 'levels': {}}
    try:
        for lv in LEVELS:
            rep['levels'][lv] = {'static': static_checks(lv), 'runtime': {}, 'looks': {}}
        with sync_playwright() as p:
            b = p.chromium.launch()
            for lv in LEVELS:
                for sz, (w, hh) in SIZES.items():
                    pg = b.new_page(viewport={'width': w, 'height': hh})
                    errs, cons = [], []
                    pg.on('pageerror', lambda e: errs.append(str(e)[:160]))
                    pg.on('console', lambda m: cons.append(m.text[:140]) if m.type == 'error' and 'ERR_TUNNEL' not in m.text and 'Failed to load resource' not in m.text else None)
                    pg.add_init_script(SEED)
                    pg.goto('http://localhost:%d/%s/index.html' % (PORT, lv))
                    pg.wait_for_timeout(1800)
                    ok = pg.evaluate('typeof window.__game')
                    look = pg.evaluate(JS_LOOK)
                    pg.screenshot(path=os.path.join(ROOT, 'qa', 'baseline', '%s_%s_home.png' % (lv, sz)))
                    rep['levels'][lv]['looks'][sz] = look
                    rep['levels'][lv]['runtime'][sz] = {'game': ok, 'errors': errs, 'console': cons}
                    if sz == 'chromebook':
                        try:
                            rep['levels'][lv]['inventory'] = pg.evaluate(JS_INVENTORY)
                        except Exception as e:
                            rep['levels'][lv]['inventory'] = {'error': str(e)[:200]}
                    pg.close()
            b.close()
    finally:
        srv.terminate()
    json.dump(rep, open(os.path.join(ROOT, 'qa', 'report.json'), 'w'), indent=1)
    write_md(rep)
    print('done: qa/report.md')


def write_md(rep):
    L = LEVELS
    out = ['# Boh inspection report', '', 'Run: ' + rep['when'], '', 'Read-only. Nothing in the game was changed.', '']
    mism = []

    out += ['## 1. Does each level load without errors?', '', '| Level | Chromebook | Laptop | Phone |', '|---|---|---|---|']
    for lv in L:
        row = []
        for sz in SIZES:
            r = rep['levels'][lv]['runtime'][sz]
            bad = (r['game'] != 'object') or r['errors'] or r['console']
            row.append('FAIL' if bad else 'ok')
            if bad:
                mism.append('%s at %s: game=%s errors=%s console=%s' % (lv, sz, r['game'], r['errors'][:2], r['console'][:2]))
        out.append('| %s | %s |' % (lv, ' | '.join(row)))

    out += ['', '## 2. Page sideways scroll (should be 0)', '', '| Level | Chromebook | Laptop | Phone |', '|---|---|---|---|']
    for lv in L:
        row = []
        for sz in SIZES:
            v = rep['levels'][lv]['looks'][sz]['overflowX']
            row.append(str(v))
            if v > 0:
                mism.append('%s sideways scroll %spx at %s' % (lv, v, sz))
        out.append('| %s | %s |' % (lv, ' | '.join(row)))

    out += ['', '## 3. Same look on every level (home screen, Chromebook size)', '', '| Level | Page color | Font | Button color | Button corner |', '|---|---|---|---|---|']
    looks = {lv: rep['levels'][lv]['looks']['chromebook'] for lv in L}
    for lv in L:
        k = looks[lv]
        out.append('| %s | %s | %s | %s | %s |' % (lv, k['bodyBg'], (k['bodyFont'] or '')[:30], k['btnBg'], k['btnRadius']))
    for key, label in [('bodyBg', 'page color'), ('bodyFont', 'font'), ('btnBg', 'button color'), ('btnRadius', 'button corner')]:
        vals = set(looks[lv][key] for lv in L)
        if len(vals) > 1:
            mism.append('Look differs: %s has %d different values across levels' % (label, len(vals)))

    out += ['', '## 4. Shared engine code identical in every level (a hash per piece; same = same code)', '', '| Piece | ' + ' | '.join(L) + ' | Same? |', '|---|' + '---|' * (len(L) + 1)]
    for n in SHARED_METHODS:
        vals = [rep['levels'][lv]['static']['methods'][n] for lv in L]
        same = len(set(vals)) == 1 and vals[0] is not None
        out.append('| %s | %s | %s |' % (n, ' | '.join(str(v) for v in vals), 'yes' if same else 'NO'))
        if not same:
            mism.append('Engine piece %s differs or is missing: %s' % (n, dict(zip(L, vals))))
    for c in SHARED_CSS:
        vals = [rep['levels'][lv]['static']['css'][c] for lv in L]
        same = len(set(vals)) == 1 and vals[0] is not None
        out.append('| css %s | %s | %s |' % (c, ' | '.join(str(v) for v in vals), 'yes' if same else 'NO'))
        if not same:
            mism.append('Style rule %s differs or is missing: %s' % (c, dict(zip(L, vals))))

    out += ['', '## 5. Which shared scripts each level loads', '', '| Script | ' + ' | '.join(L) + ' |', '|---|' + '---|' * len(L)]
    for a in SHARED_ASSETS:
        row = []
        for lv in L:
            ass = rep['levels'][lv]['static']['assets']
            row.append('yes' if a in ass else '-')
        out.append('| %s | %s |' % (a, ' | '.join(row)))
        if len(set(row)) > 1 and a not in ('recorder.js', 'recordit.js', 'routine.js'):   # these two follow the audience rules (section 7b)
            mism.append('Script %s is not loaded by every level: %s' % (a, dict(zip(L, row))))
    # cache stamps
    stamps = {}
    for lv in L:
        for a, v in rep['levels'][lv]['static']['assets'].items():
            stamps.setdefault(a, set()).add(v)
    for a, v in stamps.items():
        if len(v) > 1:
            mism.append('Script %s has different cache stamps across levels: %s' % (a, sorted(v)))

    out += ['', '## 6. App map (from the code, not hand-written)', '']
    for lv in L:
        inv = rep['levels'][lv].get('inventory', {})
        out += ['### ' + lv, '']
        if 'error' in inv:
            out += ['Could not read: ' + inv['error'], '']
            continue
        out.append('Unit tabs in order: %s. Coming-soon tabs: %s.' % (inv.get('unitOrder'), inv.get('unitSoon')))
        out.append('Shared pieces loaded: %s. Routine units: %s.' % (inv.get('globals'), inv.get('routineUnits')))
        out += ['', '| Unit | Tab | Title | Practice modes | Questions | Question types | Shown on home? |', '|---|---|---|---|---|---|---|']
        for k, u in inv.get('units', {}).items():
            out.append('| %s | %s | %s | %s | %d | %s | %s |' % (k, u['tab'], (u['title'] or '')[:40], ', '.join(u['modes']), u['questions'], u['qTypes'], 'yes' if u['inOrder'] else 'NO (hidden)'))
        out += ['', '| Lesson page | Stop | Items | Item kinds | Listen items | Speaking items | Reachable? |', '|---|---|---|---|---|---|---|']
        for k, d in inv.get('lessons', {}).items():
            for s in d['stops']:
                reach = 'yes' if (inv['units'].get(k, {}).get('inOrder')) else 'NO'
                out.append('| %s | %s | %d | %s | %d | %d | %s |' % (k, s['label'], s['items'], s['kinds'], s['listen'] + s['say'], s['parla'], reach))
                if reach == 'NO' and k in inv['units'] and not inv['units'][k]['inOrder']:
                    pass
            if k not in inv['units']:
                mism.append('%s: lesson data "%s" exists but there is no unit for it (dead code, extra file weight)' % (lv, k))
        out.append('')

    out += ['## 7. Listening and speaking: same way in every level?', '', '| Level | Voice help (bohvoice) | Recording box (recorder.js) | Routine engine | Listen-only questions | Speaking items | Vocaroo steps in page |', '|---|---|---|---|---|---|---|']
    for lv in L:
        st = rep['levels'][lv]['static']; inv = rep['levels'][lv].get('inventory', {})
        lis = sum(s['listen'] for d in inv.get('lessons', {}).values() for s in d['stops'])
        spk = sum(s['parla'] for d in inv.get('lessons', {}).values() for s in d['stops'])
        out.append('| %s | %s | %s | %s | %d | %d | %s |' % (lv, 'yes' if 'bohvoice.js' in st['assets'] else 'NO', 'yes' if 'recorder.js' in st['assets'] else 'NO', 'yes' if 'routine.js' in st['assets'] else 'NO', lis, spk, 'yes' if st['has_vocaroo_text'] else 'no'))

    out += ['', '## 7b. Audience rules: does each level match what the teacher decided?', '', '| Level | Break games: wanted | Break games: has | Recording box: wanted | Recording box: has | Result |', '|---|---|---|---|---|---|']
    for lv in L:
        st = rep['levels'][lv]['static']; r = LEVEL_RULES[lv]
        res = []
        if r['break'] != st['has_break']:
            res.append('break games ' + ('MISSING' if r['break'] else 'SHOULD NOT BE HERE'))
        if r['recording'] and not st['has_recorder']:
            res.append('recording box NOT BUILT YET')
        if (not r['recording']) and st['has_recorder']:
            res.append('recording box SHOULD NOT BE HERE')
        out.append('| %s | %s | %s | %s | %s | %s |' % (lv, 'yes' if r['break'] else 'no', 'yes' if st['has_break'] else 'no', 'yes' if r['recording'] else 'no', 'yes' if st['has_recorder'] else 'no', '; '.join(res) or 'ok'))
        for x in res:
            mism.append('%s: %s' % (lv, x))

    out += ['', '## 8. Mismatches found (' + str(len(mism)) + ')', '']
    if not mism:
        out.append('None.')
    for m in mism:
        out.append('- ' + m)
    out += ['', 'Screenshots of every level at three sizes: qa/baseline/', '']
    open(os.path.join(ROOT, 'qa', 'report.md'), 'w', encoding='utf-8').write('\n'.join(out))


if __name__ == '__main__':
    main()
