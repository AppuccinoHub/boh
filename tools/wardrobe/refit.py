# BOH wardrobe tools - rebuilds outfits that were cut off at the doll frame. The missing edges come from the
# small shop picture (the full drawing); everything inside the frame stays the sharp original.
# Created for Assunta Scotto, creator and owner of BOH. 2026-11-14.
# Out: assets/boutique/p/x/<outfit>_<body>.webp  (568 x 1068: 84 px wider on each side, 28 px taller)
import sys, os, json
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from dolllib import *
from scipy.optimize import minimize
MX, MY = 84, 28
SKIP = ['lk_hornets', 'lk_firenze']
def warp(T, p, size, off=(0, 0), scale=1.0):
    sx, sy, tx, ty = p; sx *= scale; sy *= scale; tx = tx * scale + off[0]; ty = ty * scale + off[1]
    return T.transform(size, Image.AFFINE, (1 / sx, 0, -tx / sx, 0, 1 / sy, -ty / sy), Image.BICUBIC)
def register(T, Wim):
    Ta = T.convert('RGBa'); small = Wim.resize((W // 2, H // 2), Image.BILINEAR).convert('RGBa'); ws = np.asarray(small).astype(np.float32)
    def cost(p):
        if p[0] < 1 or p[1] < 1: return 1e9
        return float(np.abs(np.asarray(warp(Ta, p, (W // 2, H // 2), scale=.5)).astype(np.float32) - ws).mean())
    ta = np.asarray(T)[..., 3] > 127; wa = np.asarray(Wim)[..., 3] > 127
    tv, tu = np.nonzero(ta); wy, wx = np.nonzero(wa); best = None
    for grow in (1.0, 1.04, 1.08, 1.14):
        sy = (wy.max() - wy.min()) / (tv.max() - tv.min()) * grow
        p0 = [sy, sy, wx.mean() - sy * tu.mean(), wy.min() - sy * tv.min()]
        r = minimize(cost, p0, method='Powell', options=dict(xtol=1e-3, ftol=1e-5, maxfev=2500))
        if best is None or r.fun < best.fun: best = r
    return list(best.x), best.fun
def cut_edges(Wim):
    a = np.asarray(Wim)[..., 3] > 40
    return dict(left=int(a[:, 0].sum()), right=int(a[:, -1].sum()), bottom=int(a[-1].sum()), top=int(a[0].sum()))
def rebuild(T, Wim, p):
    ext = warp(T.convert('RGBa'), p, (W + 2 * MX, H + MY), off=(MX, 0)).convert('RGBA')
    e = np.asarray(ext).astype(np.float32); w = np.asarray(Wim).astype(np.float32)
    ramp = np.ones((H, W), np.float32); f = 6
    for i in range(f):
        v = (i + .5) / f
        ramp[:, i] = np.minimum(ramp[:, i], v); ramp[:, W - 1 - i] = np.minimum(ramp[:, W - 1 - i], v); ramp[H - 1 - i, :] = np.minimum(ramp[H - 1 - i, :], v)
    pe = e[:H, MX:MX + W].copy(); pw = w.copy()            # blend in premultiplied colour so edges do not darken
    pe[..., :3] *= pe[..., 3:] / 255; pw[..., :3] *= pw[..., 3:] / 255
    mix = pw * ramp[..., None] + pe * (1 - ramp[..., None])
    al = np.maximum(mix[..., 3:], 1e-3); mix[..., :3] = mix[..., :3] / al * 255
    e[:H, MX:MX + W] = mix
    return Image.fromarray(np.clip(e, 0, 255).astype(np.uint8), 'RGBA')
if __name__ == '__main__':
    repo = sys.argv[1]; d = os.path.join(repo, 'assets/boutique/p'); out = os.path.join(d, 'x'); os.makedirs(out, exist_ok=True)
    report = {}; only = sys.argv[2:]
    names = sorted({f[:-7] for f in os.listdir(os.path.join(d, 'w')) if f[:3] in ('lk_', 'tu_', 'ht_') and 'hhw' not in f and (not only or f[:3] in only)} - set(SKIP))
    for k in names:
        files = [b for b in 'mfh' if os.path.exists(os.path.join(d, 'w', '%s_%s.webp' % (k, b)))]
        cuts = {b: cut_edges(Image.open(os.path.join(d, 'w', '%s_%s.webp' % (k, b))).convert('RGBA')) for b in files}
        if not any(sum(c.values()) for c in cuts.values()): continue
        T = Image.open(os.path.join(d, k + '.webp')).convert('RGBA')
        for b in files:
            if not sum(cuts[b].values()): continue
            Wim = Image.open(os.path.join(d, 'w', '%s_%s.webp' % (k, b))).convert('RGBA')
            p, c = register(T, Wim); new = rebuild(T, Wim, p); a = np.asarray(new)[..., 3] > 40
            still = int(a[:, 0].sum() + a[:, -1].sum() + a[-1].sum())
            ok = c < 6.0 and still == 0
            if ok: new.save(os.path.join(out, '%s_%s.webp' % (k, b)), quality=90, method=6)
            report['%s_%s' % (k, b)] = dict(fit=round(c, 2), sx=round(p[0], 3), sy=round(p[1], 3), cut=cuts[b], still_cut=still, written=ok)
            print('%-16s fit %.2f  scale %.2f x %.2f  cut L%d R%d B%d  -> %s' % (k + ' ' + b, c, p[0], p[1], cuts[b]['left'], cuts[b]['right'], cuts[b]['bottom'], 'rebuilt' if ok else 'NOT rebuilt (still cut %d)' % still))
    json.dump(report, open(os.path.join(os.path.dirname(os.path.abspath(__file__)), 'refit_report.json'), 'w'), indent=1)
    print(sum(r['written'] for r in report.values()), 'of', len(report), 'cut pictures rebuilt')
