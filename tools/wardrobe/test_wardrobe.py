# BOH wardrobe tools - the repeatable wardrobe test. Exit code 1 when a check fails.
# Created for Assunta Scotto, creator and owner of BOH. 2026-11-14.
# Checks, for every garment on every body it may be worn on:
#   cut    : the picture is not cut off at its edge
#   show   : Boh's painted-on clothes do not show (under 2% of that piece)
#   pieces : nothing floats loose (the doll is one piece)
#   neck / hands : visible where the fit rules say they are drawn above the clothes
#   eyes   : a hat does not cover the eyes (under 3% of the whites of the eyes)
import sys, os, json
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from dolllib import *
from bodyparts import P
from scipy import ndimage as ndi
from fix_hats import eyes
EYES = {'m': (232, 300), 'f': (250, 318), 'h': (236, 304)}
if __name__ == '__main__':
    repo = sys.argv[1]; here = os.path.dirname(os.path.abspath(__file__)); cfg = json.load(open(os.path.join(here, 'fit.json'))); fit = cfg['fit']
    parts = {b: np.asarray(Image.open(os.path.join(here, 'parts', 'parts_%s.png' % b))) for b in 'mfh'}
    fails = []; n = 0; worst = {}; known = []
    def check(name, ok, detail):
        global n; n += 1
        if not ok: fails.append('%s: %s' % (name, detail))
    for k, bases in fit.items():
        slot = 'outfit' if k[:3] in ('lk_', 'tu_') else 'bottom' if k[:3] in ('pn_', 'sk_') else 'feet'
        for b, letters in bases.items():
            art = wear(repo, k, b, 'medium'); a = np.asarray(art)[..., 3] > 40
            if slot != 'feet': check('%s %s cut' % (k, b), not (a[:, 0].any() or a[:, -1].any() or a[-1].any()), 'art touches the picture edge')
            bodyonly = compose(repo, b, {}, {}); full = compose(repo, b, {slot: k}, fit, ext=True)
            fa = np.asarray(full)[..., 3] > 127; frame = fa[:H, MX:MX + W]
            g = Image.new('RGBA', (W, H)); put(g, art); ga = np.asarray(g)[..., 3] > 127
            keep = np.ones((H, W), bool)
            for letter, mname in (('t', 'top'), ('b', 'bottom'), ('g', 'sand'), ('f', 'shoes' if b == 'h' else 'feet'), ('s', 'shoes')):
                if letter in letters: keep &= fitmask(repo, 'fit_%s_%s' % (b, mname)) > .5
            pt = parts[b]
            for pname in (('top', 'bottom', 'feet') if slot == 'outfit' else ('bottom',) if slot == 'bottom' else ()):
                sel = pt == P[pname]
                if pname == 'feet': sel &= (np.arange(H)[:, None] >= int(H * .88))            # shoes; socks are judged by the fit rule
                if pname == 'top' and b == 'h' and 't' not in letters: continue                    # modest sleeves stay under short sleeves
                show = float((sel & keep & ~ga).sum()) / max(1, sel.sum()); worst[pname] = max(worst.get(pname, 0), show)
                check('%s %s show %s' % (k, b, pname), show < .02, '%.1f%% of the painted-on %s shows' % (show * 100, pname))
            lab, cnt = ndi.label(fa); big = int((np.bincount(lab.ravel())[1:] > 400).sum())
            if '%s pieces' % k in cfg.get('known', []): known.append('%s %s: %d pieces (known, in the drawing itself)' % (k, b, big))
            else: check('%s %s pieces' % (k, b), big == 1, '%d loose pieces' % big)
            for letter, mname, pname in (('n', 'neck', 'neck'), ('d', 'hands', 'hands')):
                if letter in letters:
                    m = fitmask(repo, 'ov_%s_%s' % (b, mname)) > .5; check('%s %s %s' % (k, b, pname), m.sum() > 500, 'mask missing')
    for h in cfg['hats'] + ['ht_visiera']:
        for b in 'mfh':
            art = wear(repo, h, b)
            if art is None: continue
            c = Image.new('RGBA', (W, H)); put(c, art); a = np.asarray(c)[..., 3] > 127; em = eyes(repo, b)[0]
            cov = float(a[em].mean()); worst['eyes'] = max(worst.get('eyes', 0), cov)
            check('%s %s eyes' % (h, b), cov < .03, 'covers %.0f%% of the eyes' % (cov * 100))
            if b != 'h' and h in cfg['hats']:
                doll = np.asarray(compose(repo, b, {'head': h}, fit))[..., 3] > 127; hair = (parts[b] == P['head']) & doll & ~a
                m = fitmask(repo, 'hat_%s_%s' % (h, b)) > .5; check('%s %s hair' % (h, b), not (hair & ~m).any(), 'hair shows above the brim')
    print('%d checks, %d failed. Worst painted-clothes show-through: %s' % (n, len(fails), {k: '%.1f%%' % (v * 100) for k, v in worst.items()}))
    for f in fails: print('  FAIL', f)
    for f in known: print('  known', f)
    sys.exit(1 if fails else 0)
