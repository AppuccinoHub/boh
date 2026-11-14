# BOH wardrobe tools - splits each base Boh picture into named parts (the "locked body template").
# Created for Assunta Scotto, creator and owner of BOH. 2026-11-14.
# Output: tools/wardrobe/parts/parts_<m|f|h>.png  (one grey value per part, see PARTS)
import sys, os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from dolllib import *
from scipy import ndimage as ndi
PARTS = ['none', 'head', 'neck', 'top', 'arms', 'hands', 'bottom', 'legs', 'feet']
P = {n: i for i, n in enumerate(PARTS)}
def classes(im):
    a = np.asarray(im).astype(np.int32); R, G, B, Al = a[..., 0], a[..., 1], a[..., 2], a[..., 3]
    S = Al > 127; mx = a[..., :3].max(-1); mn = a[..., :3].min(-1); L = (R * 299 + G * 587 + B * 114) // 1000
    skin = S & (R > 120) & (R - G > 22) & (G - B > 12) & (R - B > 50)
    lowc = (mx - mn) < 42
    white = S & lowc & (L > 216)
    gray = S & lowc & (L > 120) & (L <= 216)
    return S, skin, white, gray
def cc(mask, ok):
    lab, n = ndi.label(mask); best = None
    for i, sl in enumerate(ndi.find_objects(lab), 1):
        m = lab[sl] == i; area = int(m.sum())
        if area < 150: continue
        ys, xs = np.nonzero(m); cy = ys.mean() + sl[0].start; cx = xs.mean() + sl[1].start
        info = dict(i=i, area=area, cy=cy, cx=cx, y0=sl[0].start, y1=sl[0].stop, x0=sl[1].start, x1=sl[1].stop)
        if ok(info) and (best is None or area > best['area']): best = info
    return lab, best
def all_cc(mask, ok):
    lab, n = ndi.label(mask); out = np.zeros(mask.shape, bool); infos = []
    for i, sl in enumerate(ndi.find_objects(lab), 1):
        m = lab[sl] == i; area = int(m.sum())
        if area < 120: continue
        ys, xs = np.nonzero(m)
        info = dict(i=i, area=area, cy=ys.mean() + sl[0].start, cx=xs.mean() + sl[1].start, y0=sl[0].start, y1=sl[0].stop, x0=sl[1].start, x1=sl[1].stop)
        if ok(info): out |= lab == i; infos.append(info)
    return out, infos
def split(repo, base):
    im = body(repo, base); S, skin, white, gray = classes(im)
    seed = np.zeros((H, W), np.uint8); notes = {}
    if base == 'h':
        lab, t = cc(white, lambda c: 380 < c['cy'] < 640)
        top, ti = all_cc(white, lambda c: 380 < c['cy'] < 660 and c['area'] > 300)
        yy0 = np.arange(H)[:, None] * np.ones((1, W), int)
        lab, b = cc(gray & (yy0 > t['y1'] - 24), lambda c: 600 < c['cy'] < 960); bot = lab == b['i']
        feet, fi = all_cc(white, lambda c: c['cy'] > 930)
        hands, hi = all_cc(skin, lambda c: 590 < c['cy'] < 730 and c['area'] < 6000)
        seed[top] = P['top']; seed[bot] = P['bottom']; seed[feet] = P['feet']; seed[hands] = P['hands']
        yy = np.arange(H)[:, None] * np.ones((1, W), int)
        headseed = S & ~white & ~gray & (seed == 0) & (yy < t['y0'] + 40)
        hij = S & (np.asarray(im)[..., :3].max(-1) < 80) & (seed == 0)       # the dark scarf, tail included
        hij = ndi.binary_dilation(ndi.binary_erosion(hij, iterations=4), iterations=4) & hij   # drop thin outlines of the top and pants
        headseed &= ~ndi.binary_dilation(top | bot, iterations=3)
        lab, n = ndi.label(hij | headseed); big = lab == (np.bincount(lab.ravel())[1:].argmax() + 1)
        seed[big & (seed == 0)] = P['head']
        notes = dict(top=t, bottom=b, hands=len(hi), feet=len(fi))
    else:
        lab, b = cc(gray, lambda c: 560 < c['cy'] < 780)
        lab, t = cc(white, lambda c: 420 < c['cy'] < 640 and c['y1'] < b['y1']); top = lab == t['i']
        bot, bi = all_cc((white | gray) & ~top, lambda c: t['y1'] - 12 < c['cy'] < b['y1'] + 6 and 70 < c['cx'] < 330)
        b = dict(b, y0=min(c['y0'] for c in bi), y1=max(c['y1'] for c in bi), area=int(bot.sum()))
        socktop = {}
        feet = np.zeros((H, W), bool); yy = np.arange(H)[:, None] * np.ones((1, W), int); xx = np.arange(W)[None, :] * np.ones((H, 1), int)
        wl, wi = all_cc(white, lambda c: c['cy'] > 820)
        for side, sel in (('L', xx < 200), ('R', xx >= 200)):
            ys = np.nonzero((wl & sel).any(1))[0]; socktop[side] = int(ys.min()); feet |= S & sel & (yy >= ys.min())
        lab, n = ndi.label(skin)
        neck = np.zeros((H, W), bool); arms = np.zeros((H, W), bool); legs = np.zeros((H, W), bool); face = np.zeros((H, W), bool)
        for i, sl in enumerate(ndi.find_objects(lab), 1):
            m = lab == i; area = int(m.sum())
            if area < 60: continue
            ys, xs = np.nonzero(m); cy, cx = ys.mean(), xs.mean()
            if ys.max() < t['y0'] + 30 and area > 8000: face |= m
            elif t['y0'] - 70 < cy < t['y0'] + 25 and 140 < cx < 260 and area < 8000: neck |= m
            elif cy > b['y1'] - 40 and not feet[m].all(): legs |= m & ~feet
            elif t['y0'] < cy < b['y1'] + 80 and (cx < 150 or cx > 250): arms |= m
        notes['face_neck_joined'] = bool(not neck.any())
        if not neck.any():   # jaw line is not closed: cut the neck off the face at the chin
            ys = np.nonzero(face[:, 190:210].any(1))[0]; chin = None
            notes['face_bottom'] = int(ys.max())
        hands = np.zeros((H, W), bool); al, n2 = ndi.label(arms)
        for i, sl in enumerate(ndi.find_objects(al), 1):
            hands[max(sl[0].stop - 84, 0):sl[0].stop] |= (al == i)[max(sl[0].stop - 84, 0):sl[0].stop]
        seed[top] = P['top']; seed[bot] = P['bottom']; seed[feet] = P['feet']; seed[legs & ~feet] = P['legs']
        seed[arms] = P['arms']; seed[hands] = P['hands']; seed[neck] = P['neck']; seed[face] = P['head']
        rest = S & (seed == 0) & (yy < t['y0'] - 2)        # hair, ears, brows: everything above the tee that is not neck
        lab, n = ndi.label(rest | face); keep = np.zeros((H, W), bool)
        for i in np.unique(lab[face]): keep |= lab == i
        seed[keep & (seed == 0) & ~skin] = P['head']
        notes.update(top=t, bottom=b, socktop=socktop, neck=int(neck.sum()), hands=int(hands.sum()))
    # every remaining body pixel (outlines, shadows) joins the nearest part
    idx = ndi.distance_transform_edt(seed == 0, return_distances=False, return_indices=True)
    full = seed[idx[0], idx[1]]; full[~S] = 0
    return im, full, notes
if __name__ == '__main__':
    repo, outdir = sys.argv[1], sys.argv[2]; os.makedirs(outdir, exist_ok=True)
    pal = np.array([[0, 0, 0], [230, 60, 60], [250, 220, 0], [60, 120, 240], [240, 150, 60], [0, 200, 120], [150, 60, 200], [250, 170, 150], [0, 190, 220]], np.uint8)
    prev = []
    for base in 'mfh':
        im, full, notes = split(repo, base)
        Image.fromarray(full, 'L').save(os.path.join(outdir, 'parts_%s.png' % base))
        print(base, {k: (v if not isinstance(v, dict) or 'area' not in v else (v['y0'], v['y1'], v['area'])) for k, v in notes.items()}, 'px per part', np.bincount(full.ravel(), minlength=9)[1:].tolist())
        ov = np.asarray(im.convert('RGB')).astype(np.float32) * 0.35 + pal[full].astype(np.float32) * 0.65
        ov[full == 0] = 238; prev.append(Image.fromarray(ov.astype(np.uint8)))
    o = Image.new('RGB', (1200, 1040)); [o.paste(p, (i * 400, 0)) for i, p in enumerate(prev)]
    o.resize((900, 780), Image.LANCZOS).save(os.path.join(outdir, '_parts_preview.jpg'), quality=86)
