# BOH wardrobe tools - Package 1 + 1b patcher. One patch for the five level pages and the shared files.
# Created for Assunta Scotto, creator and owner of BOH. 2026-11-14.
# Always starts from the committed files (git HEAD), so it is safe to run twice. Reads fit.json.
# Usage: python3 -I tools/wardrobe/package1.py <repo> [base commit, default HEAD = a clean copy of main]
import sys, os, re, json, subprocess, base64, io, hashlib
from PIL import Image
import numpy as np
LEVELS = ['italiano1', 'italiano2', 'italiano3', 'italiano4', 'ap']
VER = '20261114b'
BASE = sys.argv[2] if len(sys.argv) > 2 else 'HEAD'   # the unpatched commit to start from (main)
STAMP = 'Wardrobe fit, Package 1 + 1b. (c) 2026 Assunta Scotto, creator and owner of BOH. Built 2026-11-14.'
here = os.path.dirname(os.path.abspath(__file__))
_w = lambda b: base64.b64decode(b).decode()      # the removed names are kept encoded so this tool does not put them back in the repo
SCHOOL, TOWN = _w('SGFtaWx0b24gSGlnaCBTY2hvb2wgV2VzdA=='), _w('SGFtaWx0b24=')
WORDS = 'hh' + 'w|horn' + 'et|' + TOWN.lower()
def head(repo, rel, binary=False):
    b = subprocess.run(['git', '-C', repo, 'show', BASE + ':' + rel], capture_output=True, check=True).stdout
    return b if binary else b.decode('utf8')
def sub1(s, pat, rep, what, count=1, flags=0):
    s2, n = re.subn(pat, rep, s, flags=flags)
    if n != count: raise SystemExit('PATCH FAILED: %s (found %d, expected %d)' % (what, n, count))
    return s2
def rep1(s, old, new, what, count=1):
    if s.count(old) != count: raise SystemExit('PATCH FAILED: %s (found %d, expected %d)' % (what, s.count(old), count))
    return s.replace(old, new)
def drop_obj(s, oid, prices=None):
    m = re.search(r'\{"id": "%s"[^{}]*\}' % oid, s)
    if not m: raise SystemExit('PATCH FAILED: item %s not found' % oid)
    if prices is not None:
        pm = re.search(r'"price": (\d+)', m.group(0)); prices[oid] = int(pm.group(1)) if pm else None
    a, b = m.start(), m.end()
    if s[b:b + 2] == ', ': b += 2
    elif s[a - 2:a] == ', ': a -= 2
    return s[:a] + s[b:]
def doll_js(cfg, indent=''):
    fit = json.dumps(cfg['fit'], sort_keys=True); hats = json.dumps({h: 1 for h in cfg['hats']}, sort_keys=True)
    js = '''// %s
// BT_FIT, per body: t b = hide the painted-on top / bottom, s = hide the shoes, f = hide socks and shoes, g = sandals,
//                   n d h = draw Boh's own neck / hands / hijab above the clothes (so clothes look worn, not stuck on).
var BT_FIT = %s;
var BT_HATFIT = %s;   // hats with a hair mask: the hair is tucked inside the hat
function dollLayersFor(base, eq) {
  base = (base === 'f' || base === 'h') ? base : 'm'; eq = eq || {};
  var out = [];
  if (eq.aura) out.push({ cls: wearFrame(base, 'aura') });
  if (eq.cape) out.push({ cls: wearFrame(base, 'mantello_under') });
  if (eq.back === 'zaino') out.push({ cls: wearFrame(base, 'zaino_under') });
  var ok = function (sl) { return !!(eq[sl] && SLOT[eq[sl]] && slotAllowed(base, eq[sl])); };
  var fit = '';
  ['outfit', 'top', 'bottom', 'feet'].forEach(function (sl) { var f = ok(sl) && BT_FIT[eq[sl]]; if (f && f[base] && !(sl === 'feet' && ok('outfit'))) fit += f[base]; });
  var has = function (c) { return fit.indexOf(c) !== -1; };
  var cls = 'dl body ' + base, fx = '';
  if (eq.head && slotAllowed(base, eq.head)) {
    if (BT_HATFIT[eq.head] && base !== 'h') fx += ' hat-' + eq.head;
    else { var _hd = (HAIR_CUT[base] || {})[eq.head]; if (_hd) cls += ' cut' + _hd; }
  }
  if (has('t')) fx += ' xt';
  if (has('b')) fx += ' xb';
  if (has('g')) fx += ' xg'; else if (has('f')) fx += ' xf'; else if (has('s')) fx += ' xs';
  out.push({ cls: cls + (fx ? ' fx' + fx : '') });
  SLOT_ORDER.forEach(function (sl) {
    if (sl === 'back') {   // Boh's own hijab, neck and hands go above the clothes and below bags and scarves
      if (has('h')) out.push({ cls: 'dl body ' + base + ' ov oh' });
      if (has('n')) out.push({ cls: 'dl body ' + base + ' ov on' });
      if (has('d')) out.push({ cls: 'dl body ' + base + ' ov od' });
    }
    if (sl === 'feet' && ok('outfit')) return;   // an outfit brings its own shoes
    if (ok(sl)) out.push({ cls: wearFrame(base, eq[sl], !!(eq.bottom || eq.outfit)) });
  });
  if (eq.cape) out.push({ cls: wearFrame(base, 'mantello') });
  return out;
}''' % (STAMP, fit, hats)
    return js
def fit_css(cfg, repo):
    one = 'linear-gradient(#000,#000)'; L = ['/* BOH wardrobe fit: one stylesheet for every level and the front page. %s Made by tools/wardrobe/package1.py, do not edit by hand. */' % STAMP]
    m4 = 'var(--mh,%s),var(--mt,%s),var(--mb,%s),var(--mf,%s)' % (one, one, one, one)
    L.append('.dl.body.fx{-webkit-mask-image:%s;mask-image:%s;-webkit-mask-size:100%% 100%%;mask-size:100%% 100%%;-webkit-mask-repeat:no-repeat;mask-repeat:no-repeat;-webkit-mask-composite:source-in;mask-composite:intersect}' % (m4, m4))
    for b in 'mfh':
        L.append('.dl.body.%s.xt{--mt:url(look/fit/fit_%s_top.webp)}' % (b, b)); L.append('.dl.body.%s.xb{--mb:url(look/fit/fit_%s_bottom.webp)}' % (b, b))
        L.append('.dl.body.%s.xs{--mf:url(look/fit/fit_%s_shoes.webp)}' % (b, b))
        L.append('.dl.body.%s.xf{--mf:url(look/fit/fit_%s_%s.webp)}' % (b, b, 'shoes' if b == 'h' else 'feet'))
        if b != 'h':
            L.append('.dl.body.%s.xg{--mf:url(look/fit/fit_%s_sand.webp)}' % (b, b))
            for h in cfg['hats']: L.append('.dl.body.%s.hat-%s{--mh:url(look/fit/hat_%s_%s.webp)}' % (b, h, h, b))
    L.append('.dl.body.ov{-webkit-mask:var(--mo) 0 0/100% 100% no-repeat;mask:var(--mo) 0 0/100% 100% no-repeat}')
    L.append('.dl.body.h.ov.oh{--mo:url(look/fit/ov_h_head.webp)}')
    for b in 'mf': L.append('.dl.body.%s.ov.on{--mo:url(look/fit/ov_%s_neck.webp)}' % (b, b))
    for b in 'mfh': L.append('.dl.body.%s.ov.od{--mo:url(look/fit/ov_%s_hands.webp)}' % (b, b))
    L.append('/* fixed pictures (uncut outfits, lifted hats, cleaned sandals) live in boutique/p/x and replace the originals */')
    for name in cfg['ext']:
        im = Image.open(os.path.join(repo, 'assets/boutique/p/x', name + '.webp')); big = im.size != (400, 1040)
        geo = ';left:-21%;right:-21%;bottom:-2.6923%' if big else ''
        if name.startswith('sd_'):
            k, b, skin = re.match(r'(sd_[a-z]+)_([mf])_([a-z]+?)(?:_p)?$', name).groups(); p = 'p' if name.endswith('_p') else ''
            L.append('.sk-%s .dl.dl.pw%s-%s-%s{background-image:url(boutique/p/x/%s.webp)}' % (skin, p, k, b, name))
        else: L.append('.dl.dl.pw-%s-%s{background-image:url(boutique/p/x/%s.webp)%s}' % (name[:-2], name[-1], name, geo))
    return '\n'.join(L) + '\n'
def blank_sheets(s, order_len, idx, repo):
    """Blank the old team tee in the worn sheet (3 frames) and the icon sheet; returns patched page text + new worn sheet bytes."""
    m = re.search(r'--sprWear\s*:\s*url\((data:image/webp;base64,([A-Za-z0-9+/=]+))\)', s); raw = base64.b64decode(m.group(2))
    key = hashlib.sha256(raw).hexdigest(); cache = os.path.join(here, '.cache_sprWear_%s.webp' % key[:12])
    if not os.path.exists(cache):
        im = Image.open(io.BytesIO(raw)).convert('RGBA'); a = np.asarray(im).copy(); fw, fh = im.width // 10, im.height // 13
        for bi in range(3):
            n = bi * order_len + idx; a[(n // 10) * fh:(n // 10 + 1) * fh, (n % 10) * fw:(n % 10 + 1) * fw] = 0
        out = Image.fromarray(a, 'RGBA'); out.save(cache, quality=90, method=4)
        b2 = np.asarray(Image.open(cache).convert('RGBA')).astype(np.float64); keep = a[..., 3] > 0
        mse = ((b2[keep][:, :3] - a[keep][:, :3].astype(np.float64)) ** 2).mean(); print('   worn sheet re-saved: PSNR %.1f dB vs the old sheet' % (10 * np.log10(255 ** 2 / mse)))
    new = open(cache, 'rb').read(); s = s.replace(m.group(1), 'data:image/webp;base64,' + base64.b64encode(new).decode())
    m = re.search(r'--sprItems\s*:\s*url\((data:image/png;base64,([A-Za-z0-9+/=]+))\)', s); im = Image.open(io.BytesIO(base64.b64decode(m.group(2)))).convert('RGBA')
    cm = re.search(r'\.i-maglia_hhw\{background-position:-(\d+)px -(\d+)px\}', s); cell = im.width // 6; cx, cy = int(cm.group(1)) // 56, int(cm.group(2)) // 56
    a = np.asarray(im).copy(); a[cy * cell:(cy + 1) * cell, cx * cell:(cx + 1) * cell] = 0; buf = io.BytesIO(); Image.fromarray(a, 'RGBA').save(buf, 'PNG', optimize=True)
    s = s.replace(m.group(1), 'data:image/png;base64,' + base64.b64encode(buf.getvalue()).decode())
    return s, new
def roma(s):
    s = s.replace('../assets/qep/%s.webp' % TOWN.lower(), '../assets/boutique/viaggio_roma.webp')
    s = re.sub(r'\b(in|from) %s\b' % TOWN, r'\1 Rome', s)
    return s.replace(TOWN, 'Roma')
def team_common(s, prices=None):
    for oid in ('ht_hhw', 'lk_hornets'):
        s = sub1(s, r'"%s": \[[^\]]*\], ' % oid, '', 'BT_PW ' + oid)
    s = sub1(s, r'"ht_hhw": \d+, ', '', 'BT_PCUT ht_hhw', count=2)
    s = rep1(s, "maglia_hhw: 'top', ", '', 'SLOT tee'); s = rep1(s, "var ALLOW_ON_H = ['maglia_hhw'];", 'var ALLOW_ON_H = [];', 'ALLOW_ON_H')
    s = rep1(s, '"felpa", "maglia_hhw", "maglia_calcio"', '"felpa", "maglia_r1", "maglia_calcio"', 'WEAR_ORDER tee')   # the slot stays so later frames keep their place
    return s
def patch_level(repo, lvl, cfg, sheet_out):
    rel = lvl + '/index.html'; s = head(repo, rel); prices = {}
    s = re.sub(r'\.dl\.pw-(?:ht_hhw|lk_hornets)-[mfh]\{[^}]*\}\n?', '', s)
    order = json.loads(re.search(r'var WEAR_ORDER = (\[.*?\]);', s).group(1))
    s, sheet = blank_sheets(s, len(order), order.index('maglia_hhw'), repo); sheet_out.append(sheet)
    s = re.sub(r'\.[ij]-maglia_hhw\{[^}]*\}\n?', '', s)
    s = rep1(s, ' data-origin="%s"' % SCHOOL, '', 'hidden stamp attribute')
    old = base64.b64encode(('Boh: Volere Dovere Potere. Created by Assunta Scotto, %s, 2026.' % SCHOOL).encode()).decode()
    s = rep1(s, old, base64.b64encode(b'Boh: Volere Dovere Potere. Created by Assunta Scotto, 2026.').decode(), 'hidden stamp text')
    m = re.search(r"  \{ id: 'maglia_hhw',[^\n]*price: (\d+)[^\n]*\},\n", s); prices['maglia_hhw'] = int(m.group(1)) * 5; s = s.replace(m.group(0), '')
    s = team_common(s); s = sub1(s, r'"maglia_hhw": "drip", ', '', 'section tee')
    s = drop_obj(s, 'look_hornets')
    for oid in ('ht_hhw', 'bg_hhw', 'lk_hornets'): s = drop_obj(s, oid, prices)
    prices['lk_firenze'] = int(re.search(r'\{"id": "lk_firenze"[^{}]*"price": (\d+)', s).group(1))
    for oid in ('ht_hhw', 'lk_hornets', 'lk_firenze'):       # clothes that can be worn sell 30% under the level-file price (assets/prices.js)
        prices[oid] = max(50, int(round(prices[oid] * 0.70 / 5)) * 5)
    if prices != cfg['pulled']: raise SystemExit('PRICE CHECK FAILED in %s: %s' % (lvl, prices))
    pulled = ('var BT_PULLED = %s;   // pulled from the Boh-tique on 2026-11-14: gone from the shop, refunded at the shop price\n'
              '(function () { ITEMS = ITEMS.filter(function (it) { return BT_PULLED[it.id] === undefined; }); for (var k in BT_PULLED) BT_RETIRED[k] = BT_PULLED[k]; })();\n') % json.dumps(cfg['pulled'])
    s = rep1(s, 'function btRefund(p) {', pulled + 'function btRefund(p) {', 'pull list')
    s = sub1(s, r"  p\.refundNote = 'Rimborso:[^\n]*\n", "  p.refundNote = 'Refund: ' + (gone === 1 ? '1 item was' : gone + ' items were') + ' retired from the Boh-tique. +' + back + ' BC is back in your wallet.';\n", 'refund note')
    s = sub1(s, r'function dollLayersFor\(base, eq\) \{.*?\n\}', lambda m: doll_js(cfg), 'dollLayersFor', flags=re.S)
    s = sub1(s, r'(<link rel="stylesheet" href="\.\./assets/bohphone\.css[^>]*>)', r'\1\n<link rel="stylesheet" href="../assets/bohfit.css?v=%s">' % VER, 'stylesheet link')
    if lvl in ('italiano1', 'italiano2'):
        s = roma(s)
        if lvl == 'italiano1': s = rep1(s, '"answer":"di Roma","traps":["di Roma","di Venezia"]', '"answer":"di Roma","traps":["di Milano","di Venezia"]', 'Luca reading trap')
        else: s = rep1(s, '["Sono Sara e sono americana.","I am Sara and I am American."]', '["Sono Sara e sono italiana.","I am Sara and I am Italian."]', 'Sara reading')
    open(os.path.join(repo, rel), 'w', encoding='utf8', newline='').write(s)
    return len(re.findall(WORDS, re.sub(r'data:[a-z/+\-]+;base64,[A-Za-z0-9+/=]+', '', s), re.I))
if __name__ == '__main__':
    repo = sys.argv[1]; cfg = json.load(open(os.path.join(here, 'fit.json'))); sheets = []
    for lvl in LEVELS: print('%-10s patched, team/school/town words left: %d' % (lvl, patch_level(repo, lvl, cfg, sheets)))
    if len(set(sheets)) != 1: raise SystemExit('the five levels do not share one worn sheet')
    open(os.path.join(repo, 'assets/look/sprWear.webp'), 'wb').write(sheets[0])
    # shared look script and stylesheet (front page and preview)
    s = head(repo, 'assets/bohlook.js'); s = team_common(s)
    for oid in ('maglia_hhw', 'ht_hhw', 'lk_hornets'): s = drop_obj(s, oid)
    s = sub1(s, r'function dollLayersFor\(base, eq\) \{.*?\n\}', lambda m: doll_js(cfg), 'bohlook.js dollLayersFor', flags=re.S)
    open(os.path.join(repo, 'assets/bohlook.js'), 'w', encoding='utf8', newline='').write(s)
    s = head(repo, 'assets/bohlook.css'); s = re.sub(r'\.dl\.pw-(?:ht_hhw|lk_hornets)-[mfh]\{[^}]*\}\n?', '', s)
    open(os.path.join(repo, 'assets/bohlook.css'), 'w', encoding='utf8', newline='').write(s)
    open(os.path.join(repo, 'assets/bohfit.css'), 'w', encoding='utf8', newline='').write(fit_css(cfg, repo))
    for rel in ('index.html', 'preview/index.html'):
        s = head(repo, rel)
        s = sub1(s, r'(<link rel="stylesheet" href="assets/bohlook\.css)\?v=\d+(">)', r'\1?v=%s\2\n<link rel="stylesheet" href="assets/bohfit.css?v=%s">' % (VER, VER), rel + ' links')
        s = sub1(s, r'(<script src="assets/bohlook\.js)\?v=\d+(")', r'\1?v=%s\2' % VER, rel + ' script')
        open(os.path.join(repo, rel), 'w', encoding='utf8', newline='').write(s)
    for rel in ('assets/routine-qep.js', 'voices.html', 'tools/units-src/extras-italiano1.json', 'tools/units-src/extras-italiano2.json'):
        s = roma(head(repo, rel))
        if rel.endswith('italiano1.json'): s = rep1(s, '"answer": "di Roma", "traps": ["di Roma", "di Venezia"]', '"answer": "di Roma", "traps": ["di Milano", "di Venezia"]', 'Luca trap (source)')
        if rel.endswith('italiano2.json'): s = sub1(s, r'\["Sono Sara e sono americana\.", "I am Sara and I am American\."\]', '["Sono Sara e sono italiana.", "I am Sara and I am Italian."]', 'Sara (source)')
        open(os.path.join(repo, rel), 'w', encoding='utf8', newline='').write(s)
    gone = [f for f in subprocess.run(['git', '-C', repo, 'ls-tree', '-r', '--name-only', BASE], capture_output=True, text=True).stdout.split('\n') if re.search(WORDS, f, re.I)]
    for f in gone:
        if os.path.exists(os.path.join(repo, f)): os.remove(os.path.join(repo, f))
    print('shared files patched; %d team picture files deleted; bohfit.css written (%d rules)' % (len(gone), fit_css(cfg, repo).count('{')))
