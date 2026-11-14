# BOH wardrobe tools - picture harness: draws dolls with the REAL level page code in headless Chrome.
# Created for Assunta Scotto, creator and owner of BOH. 2026-11-14.
# Usage: python3 -I bohrender.py <repo> <out.png> <level> '<json list of [label, base, equipped, skin?]>'
import sys, os, json, subprocess, time, socket
from playwright.sync_api import sync_playwright
JS = '''(cases) => {
  var old = document.getElementById('wtest'); if (old) old.remove();
  var box = document.createElement('div'); box.id = 'wtest';
  box.style.cssText = 'position:fixed;left:0;top:0;z-index:2147483647;background:#EEF0F4;display:flex;flex-wrap:wrap;gap:8px;padding:8px;width:' + (cases.cols * 268 + 8) + 'px;box-sizing:border-box;font:600 13px system-ui;color:#14141E';
  cases.list.forEach(function (c) {
    var eq = c[2] || {}, skin = c[3] || (c[1] === 'h' ? 'olive' : 'medium');
    var layers = dollLayersFor(c[1], eq).map(function (l) { return '<div class="' + l.cls + '"></div>'; }).join('');
    var cell = document.createElement('div'); cell.style.cssText = 'width:260px;text-align:center';
    cell.innerHTML = '<div style="height:18px">' + c[0] + '</div><div style="padding:0 55px 16px"><div class="look bohlook sk-' + skin + ' hr-dark" style="display:contents"><div class="doll" style="width:150px;height:390px;position:relative">' + layers + '</div></div></div>';
    box.appendChild(cell);
  });
  document.body.appendChild(box);
  return dollLayersFor.toString().length;
}'''
def serve(repo):
    s = socket.socket(); s.bind(('127.0.0.1', 0)); port = s.getsockname()[1]; s.close()
    p = subprocess.Popen([sys.executable, '-m', 'http.server', str(port), '--bind', '127.0.0.1'], cwd=repo, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL); time.sleep(1.2); return p, port
PROFILE = dict(bohBase='f', bohName='TEST', bohSkin='medium', bohHair='dark', cashi=1000, lifetime=5000, inventory=[], equipped={}, playDays=6, seenHelp=True)
def seed(pg, profile=None):   # the level pages send a visitor with no Boh back to the front door
    pg.add_init_script("try{if(!localStorage.getItem('boh_profile_v1'))localStorage.setItem('boh_profile_v1',%s)}catch(e){}" % json.dumps(json.dumps(profile or PROFILE)))
def render(repo, out, level, cases, cols=6):
    srv, port = serve(repo); errs = []
    try:
        with sync_playwright() as pw:
            br = pw.chromium.launch(executable_path='/usr/bin/google-chrome', args=['--no-sandbox'])
            pg = br.new_page(viewport=dict(width=cols * 268 + 16, height=900), device_scale_factor=2)
            seed(pg); pg.on('pageerror', lambda e: errs.append(str(e)[:160]))
            pg.route('**/*', lambda r: r.continue_() if '127.0.0.1' in r.request.url else r.abort())
            pg.goto('http://127.0.0.1:%d/%s/index.html' % (port, level), wait_until='load'); pg.wait_for_timeout(1500)
            pg.evaluate(JS, dict(list=cases, cols=cols)); pg.wait_for_timeout(1800)
            pg.locator('#wtest').screenshot(path=out); br.close()
    finally: srv.terminate()
    return errs
if __name__ == '__main__':
    errs = render(sys.argv[1], sys.argv[2], sys.argv[3], json.loads(sys.argv[4]), int(sys.argv[5]) if len(sys.argv) > 5 else 6)
    print('page errors:', errs if errs else 'none')
