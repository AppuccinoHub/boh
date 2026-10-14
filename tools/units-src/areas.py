"""Updates assets/areas.js (the map of levels, units and stops used by the Prof panel) from the live level pages.
Keeps every existing unit's label; adds new units; refreshes stop counts. Needs the local test server on port 8810.
Usage: python3 -I tools/units-src/areas.py"""
import json, os, re
from playwright.sync_api import sync_playwright
ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
P = os.path.join(ROOT, 'assets', 'areas.js')
src = open(P, encoding='utf-8').read()
head, body = src.split('window.BohAreas = ', 1)
data = json.loads(body.strip().rstrip(';'))
with sync_playwright() as p:
    b = p.chromium.launch(executable_path='/opt/pw-browsers/chromium', args=['--no-sandbox'])
    for L in data['levels']:
        pg = b.new_page()
        pg.add_init_script("localStorage.setItem('boh_profile_v1',JSON.stringify({bohBase:'m',bohName:'Gia'}))")
        pg.goto('http://127.0.0.1:8810/' + L['id'] + '/', wait_until='load'); pg.wait_for_timeout(1500)
        live = pg.evaluate("""BT_UNIT_ORDER.map(function(k){var u=BT_UNITS[k];return {id:k,tab:u.tab,stops:(typeof BT_LESSONS!=='undefined'&&BT_LESSONS[k])?BT_LESSONS[k].stops.length:0,
          modes:(u.order||[]).filter(function(m){return m!=='prova'&&m!=='mistakes'&&u.MODES[m]}).map(function(m){return {k:m,label:u.MODES[m].label}})}})""")
        have = {u['id']: u for u in L['units']}
        for u in live:
            if u['id'] in have: have[u['id']]['stops'] = u['stops']
            else: L['units'].append(u); print('added', L['id'], u['id'], u['tab'], u['stops'])
        pg.close()
    b.close()
open(P, 'w', encoding='utf-8').write(head + 'window.BohAreas = ' + json.dumps(data, ensure_ascii=False, separators=(',', ':')) + ';\n')
print('areas.js updated')
