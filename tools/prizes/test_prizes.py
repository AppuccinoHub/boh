# BOH prize rules test: real level pages in headless Chrome. Created for Assunta Scotto, creator and owner of BOH. 2026-11-14.
# HARD RULE (Assunta Scotto, 2026-11-14): a velo (hijab) is never a prize, in any level. Also checked: no flip-flops,
# nobody wins clothing their Boh cannot wear, a velo shows only in the hijab Boh's locker, the hijab Boh can still buy one.
# Usage: python3 tools/prizes/test_prizes.py <repo> [packs per case, default 40000]
import sys, os, json
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'wardrobe'))
from bohrender import *
LEVELS = ['italiano1', 'italiano2', 'italiano3', 'italiano4', 'ap']
BASES = [('m', 'boy Boh'), ('f', 'girl Boh'), ('h', 'hijab Boh')]
ROLL = '''(N) => { var g = window.__game, base = g.state.bohBase, out = { base: base, rules: !!window.BohPrize };
  var velo = function (id) { var it = itemById(id) || {}; return it.slot === 'velo' || it.slot === 'hijab' || /^(vl|hijab)_/.test(id); };
  ['centone', 'sacco'].forEach(function (kind) { var seen = {}, empty = 0;
    for (var i = 0; i < N; i++) { var it = g.rollItem([], kind, 0, true); if (!it) { empty++; break; } seen[it.id] = 1; }
    var ids = Object.keys(seen);
    out[kind] = { n: ids.length, empty: empty, velo: ids.filter(velo), flip: ids.filter(function (id) { return id === 'sd_infradito'; }), unfit: ids.filter(function (id) { return !slotAllowed(base, id); }) }; });
  return out; }'''
OPEN = '''() => { var g = window.__game; g.openPacco(); g.revealPacco(); return true; }'''
READ = '''() => { var s = window.__game.state, id = s.paccoItem, sl = id && SLOT[id];
  return { id: id, dup: s.paccoDup, slot: sl || '', fits: id ? slotAllowed(s.bohBase, id) : true, worn: !!(sl && (s.equipped || {})[sl] === id), outfit: !!(s.equipped || {}).outfit,
           said: document.body.innerText.indexOf('is wearing it now') !== -1 }; }'''
def page(br, port, lvl, prof, block=None):
    ctx = br.new_context(); pg = ctx.new_page(); errs = []
    seed(pg, prof); pg.on('pageerror', lambda e: errs.append(str(e)[:140]))
    pg.route('**/*', lambda r: r.continue_() if '127.0.0.1' in r.request.url and not (block and block in r.request.url) else r.abort())
    pg.goto('http://127.0.0.1:%d/%s/index.html' % (port, lvl), wait_until='load'); pg.wait_for_timeout(2200)
    return ctx, pg, errs
if __name__ == '__main__':
    repo = sys.argv[1]; N = int(sys.argv[2]) if len(sys.argv) > 2 else 40000
    srv, port = serve(repo); fails = []; errs_all = []
    def check(cond, msg):
        if not cond: fails.append(msg)
        return 'OK' if cond else 'FAIL'
    try:
        with sync_playwright() as pw:
            br = pw.chromium.launch(executable_path='/usr/bin/google-chrome', args=['--no-sandbox'])
            for lvl in LEVELS:
                for b, name in BASES:
                    # 1. the picker: N small packs and N big packs for this Boh
                    ctx, pg, errs = page(br, port, lvl, dict(PROFILE, bohBase=b, inventory=['vl_nero', 'vl_boh', 'ht_boh'], equipped={}))
                    r = pg.evaluate(ROLL, N); bad = []
                    for kind in ('centone', 'sacco'):
                        k = r[kind]; bad += k['velo'] + k['flip'] + k['unfit'] + (['EMPTY'] if k['empty'] or not k['n'] else [])
                    v1 = check(r['rules'] and not bad, '%s %s picker: %s' % (lvl, name, sorted(set(bad)) or 'rules file not loaded'))
                    # 2. the real prize screen: open 6 packs; "is wearing it now" must be true whenever it is shown
                    note_bad = []
                    for i in range(6):
                        pg.evaluate(OPEN); pg.wait_for_timeout(200); o = pg.evaluate(READ); said = o['said']
                        truth = bool(o['slot']) and not o['dup'] and o['fits'] and o['worn'] and not (o['slot'] == 'feet' and o['outfit'])
                        if said and not truth: note_bad.append(o['id'])
                        if o['id'] and not o['fits']: note_bad.append('unfit:' + o['id'])
                        pg.evaluate("() => window.__game.collectPacco()"); pg.wait_for_timeout(60)
                    v2 = check(not note_bad, '%s %s prize screen: %s' % (lvl, name, note_bad))
                    # 3. the locker: a velo is listed only for the hijab Boh
                    pg.evaluate("() => window.__game.setState({ screen: 'locker', lkSec: 'v', lockTab: 'tutto', tripSel: null })"); pg.wait_for_timeout(500)
                    txt = pg.evaluate("() => document.body.innerText"); has_velo = 'velo' in txt.lower(); has_hat = 'cappellino BOH' in txt
                    v3 = check(has_hat and has_velo == (b == 'h'), '%s %s locker: velo shown=%s, hat shown=%s' % (lvl, name, has_velo, has_hat))
                    print('%-9s %-9s | packs: %d + %d different prizes, velo %d, flip-flops %d, not for this Boh %d %s | prize screen %s | locker velo shown: %-5s %s' % (
                        lvl, name, r['centone']['n'], r['sacco']['n'], len(r['centone']['velo'] + r['sacco']['velo']), len(r['centone']['flip'] + r['sacco']['flip']),
                        len(set(r['centone']['unfit'] + r['sacco']['unfit'])), v1, v2, has_velo, v3))
                    errs_all += errs; ctx.close()
                # 4. the hijab Boh can still BUY a velo in the Boh-tique
                ctx, pg, errs = page(br, port, lvl, dict(PROFILE, bohBase='h', cashi=9000, inventory=[], equipped={}))
                pg.evaluate("() => window.__game.buyItem('vl_panna')"); pg.wait_for_timeout(200)
                s = pg.evaluate("() => ({ inv: window.__game.state.inventory, eq: window.__game.state.equipped })")
                v4 = check('vl_panna' in s['inv'] and s['eq'].get('velo') == 'vl_panna', '%s hijab Boh could not buy a velo' % lvl); errs_all += errs; ctx.close()
                # 5. safety net: the rules file does not load -> the velo still never drops, the page still works
                ctx, pg, errs = page(br, port, lvl, dict(PROFILE, bohBase='h'), block='prizerules.js')
                r = pg.evaluate(ROLL, N // 4)
                v5 = check(not r['rules'] and not (r['centone']['velo'] + r['sacco']['velo']) and r['centone']['n'] > 0, '%s safety net: velo %s' % (lvl, r['centone']['velo'] + r['sacco']['velo'])); errs_all += errs; ctx.close()
                print('%-9s hijab Boh buys a velo in the Boh-tique %s | rules file missing, velo still never a prize %s' % (lvl, v4, v5))
            br.close()
    finally: srv.terminate()
    check(not errs_all, 'page errors: %s' % errs_all[:3])
    print('page errors:', errs_all[:3] or 'none'); print('RESULT:', 'ALL PASS' if not fails else 'FAIL (%d)' % len(fails))
    for f in fails[:40]: print('  -', f)
    sys.exit(0 if not fails else 1)
