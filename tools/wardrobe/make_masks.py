# BOH wardrobe tools - builds the fit masks: hide painted-on clothes, draw neck / hands / hijab above outfits,
# tuck the hair inside each hat. Created for Assunta Scotto, creator and owner of BOH. 2026-11-14.
# Out: assets/look/fit/*.webp  (alpha 255 = the body shows there, 0 = hidden)
import sys, os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from dolllib import *
from bodyparts import P, split
from fix_hats import brim
from scipy import ndimage as ndi
NOHAIRCUT = ['ht_visiera']          # an open visor: the hair on top stays
def save(m, path):
    a = np.zeros((H, W, 4), np.uint8); a[..., 3] = np.where(m, 255, 0); Image.fromarray(a, 'RGBA').save(path, lossless=True, method=6)
def shoe_top(feet, sel):
    f = feet & sel; ys = np.nonzero(f.any(1))[0]; w = f.sum(1)[ys]; w0 = np.median(w[:30])
    for y, wy in zip(ys, w):
        if y > ys[0] + 20 and wy > 1.12 * w0: return min(int(y), int(H * .88))
    return int(H * .88)
def hat_keep(a):
    E = brim(a).astype(float); xs = np.nonzero(E >= 0)[0]; x0, x1 = xs.min(), xs.max()
    e = E[x0:x1 + 1]; e[e < 0] = np.interp(np.nonzero(e < 0)[0], np.nonzero(e >= 0)[0], e[e >= 0]) if (e < 0).any() else e[e < 0]
    e = ndi.maximum_filter1d(ndi.minimum_filter1d(e, 31, mode='nearest'), 31, mode='nearest')   # drop charms that hang below the brim
    n = max(8, int((x1 - x0) * .12)); full = np.empty(W)
    full[x0:x1 + 1] = e
    full[:x0] = e[:n].max() + 1.3 * (x0 - np.arange(x0))                 # beside the hat the hair line slopes down, like hair tucked under
    full[x1 + 1:] = e[-n:].max() + 1.3 * (np.arange(x1 + 1, W) - x1)
    yy = np.arange(H)[:, None]
    return yy > full[None, :] - 1          # keep only what is below the hat's lower edge
if __name__ == '__main__':
    repo, partsdir = sys.argv[1], sys.argv[2]; out = os.path.join(repo, 'assets/look/fit'); os.makedirs(out, exist_ok=True); n = 0
    xx = np.arange(W)[None, :] * np.ones((H, 1), int); yy = np.arange(H)[:, None] * np.ones((1, W), int)
    for b in 'mfh':
        part = np.asarray(Image.open(os.path.join(partsdir, 'parts_%s.png' % b)))
        idx = ndi.distance_transform_edt(part == 0, return_distances=False, return_indices=True); vor = part[idx[0], idx[1]]
        near = lambda name, r: (vor == P[name]) & ndi.binary_dilation(part == P[name], iterations=r)
        save(~near('top', 6), os.path.join(out, 'fit_%s_top.webp' % b)); save(~near('bottom', 6), os.path.join(out, 'fit_%s_bottom.webp' % b))
        feet = near('feet', 6)
        if b == 'h': shoes = feet
        else:
            tl, tr = shoe_top(part == P['feet'], xx < 200), shoe_top(part == P['feet'], xx >= 200)
            shoes = feet & (((xx < 200) & (yy >= tl)) | ((xx >= 200) & (yy >= tr)))
            save(~feet, os.path.join(out, 'fit_%s_feet.webp' % b)); n += 1
            tops = [int(np.nonzero((np.asarray(wear(repo, k, b, 'medium'))[..., 3] > 127).any(1))[0].min()) for k in ('sd_infradito', 'sd_ciabatte')]
            save(~((near('legs', 6) | feet) & (yy >= max(tops) + 8)), os.path.join(out, 'fit_%s_sand.webp' % b)); n += 1     # sandals bring their own lower legs; hands and shorts stay
            neck = near('neck', 3) & ~ndi.binary_dilation(part == P['top'], iterations=5)   # stop short of the painted tee collar
            save(neck, os.path.join(out, 'ov_%s_neck.webp' % b)); n += 1
            print(b, 'shoe tops', tl, tr)
        save(~shoes, os.path.join(out, 'fit_%s_shoes.webp' % b))
        save(near('hands', 4), os.path.join(out, 'ov_%s_hands.webp' % b)); n += 4
        if b == 'h':      # the hijab and the face only: shadows the scarf casts on the top stay below the clothes
            rgb = np.asarray(body(repo, 'h'))[..., :3].max(-1)
            cloth = ndi.binary_dilation((rgb < 95) & (part == P['head']), iterations=2)
            save(near('head', 4) & (cloth | (yy < 400)), os.path.join(out, 'ov_h_head.webp')); n += 1
        else:
            d = os.path.join(repo, 'assets/boutique/p/w')
            for f in sorted(os.listdir(d)):
                if f.startswith('ht_') and f.endswith('_%s.webp' % b) and f[:-7] not in NOHAIRCUT and 'hhw' not in f:
                    c = Image.new('RGBA', (W, H)); put(c, wear(repo, f[:-7], b)); a = np.asarray(c)[..., 3] > 127
                    save(hat_keep(a), os.path.join(out, 'hat_%s_%s.webp' % (f[:-7], b))); n += 1
    kb = sum(os.path.getsize(os.path.join(out, f)) for f in os.listdir(out)) // 1024
    print(n, 'masks written,', len(os.listdir(out)), 'files,', kb, 'KB')
