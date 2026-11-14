# BOH wardrobe tools - refund test on the real level pages (headless Chrome). Created for Assunta Scotto. 2026-11-14.
# A test student owns every pulled item. Checks: refunded once at the shop price, never twice across the five levels,
# pulled items gone from the closet and from the Boh, English note, pulled items not in the shop, same doll code everywhere.
import sys, os, json, hashlib
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from bohrender import *
LEVELS = ['italiano1', 'italiano2', 'italiano3', 'italiano4', 'ap']
if __name__ == '__main__':
    repo = sys.argv[1]; cfg = json.load(open(os.path.join(os.path.dirname(os.path.abspath(__file__)), 'fit.json'))); pulled = cfg['pulled']; owed = sum(pulled.values())
    prof = dict(PROFILE, cashi=1000, inventory=list(pulled) + ['tee_boh'], equipped=dict(outfit='lk_firenze', head='ht_hhw'))
    srv, port = serve(repo); ok = True; hashes = set()
    try:
        with sync_playwright() as pw:
            br = pw.chromium.launch(executable_path='/usr/bin/google-chrome', args=['--no-sandbox']); ctx = br.new_context(); pg = ctx.new_page(); errs = []
            seed(pg, prof); pg.on('pageerror', lambda e: errs.append(str(e)[:140]))
            pg.route('**/*', lambda r: r.continue_() if '127.0.0.1' in r.request.url else r.abort())
            for i, lvl in enumerate(LEVELS):
                pg.goto('http://127.0.0.1:%d/%s/index.html' % (port, lvl), wait_until='load'); pg.wait_for_timeout(2500)
                r = pg.evaluate("""() => { var s = (window.__game && window.__game.state) || {}; var pr = JSON.parse(localStorage.getItem('boh_profile_v1') || '{}');
                  return { cashi: s.cashi, inv: s.inventory, eq: s.equipped, note: s.refundNote || '', saved: pr.cashi, savedInv: pr.inventory,
                    shop: ITEMS.filter(function (it) { return BT_PULLED[it.id] !== undefined; }).length, code: dollLayersFor.toString() + JSON.stringify(BT_FIT) + JSON.stringify(BT_HATFIT),
                    worn: dollLayersFor('f', { outfit: 'lk_tuta_boh', head: 'ht_boh', feet: 'sd_infradito' }).map(function (l) { return l.cls; }).join(' | ') }; }""")
                hashes.add(hashlib.sha256(r['code'].encode()).hexdigest()[:12])
                good = (r['cashi'] == 1000 + owed and not [x for x in (r['inv'] or []) if x in pulled] and not [v for v in (r['eq'] or {}).values() if v in pulled] and r['shop'] == 0
                        and (i > 0 or r['note'].startswith('Refund: %d items were retired' % len(pulled))))
                ok &= good
                print('%-9s BC %s (start 1000 + %d owed) | saved %s | closet %s | wearing %s | pulled items in shop %d | %s' % (lvl, r['cashi'], owed, r['saved'], r['inv'], r['eq'], r['shop'], 'OK' if good else 'FAIL'))
                if i == 0: print('   note:', r['note']); print('   layers:', r['worn'])
            print('page errors:', errs or 'none', '| doll code identical in all five levels:', len(hashes) == 1); ok &= len(hashes) == 1 and not errs
            br.close()
    finally: srv.terminate()
    sys.exit(0 if ok else 1)
