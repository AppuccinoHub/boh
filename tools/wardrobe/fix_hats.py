# BOH wardrobe tools - lifts hats that sit over the eyes and erases stray strips above them.
# Created for Assunta Scotto, creator and owner of BOH. 2026-11-14. Safe to run twice (works from git originals).
# Out: assets/boutique/p/x/<hat>_<body>.webp (the originals in p/w are left alone)
import sys, os, json, subprocess, io
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from dolllib import *
from scipy import ndimage as ndi
LOW = ['ht_limoni', 'ht_fedora', 'ht_occhio']
def brim(a):   # lower edge of the hat, per column (y), -1 where the hat is absent
    a = ndi.binary_fill_holes(a); E = np.full(W, -1, int)
    for x in np.nonzero(a.any(0))[0]:
        col = a[:, x]; y = int(np.argmax(col))
        while y < H - 1 and col[y + 1]: y += 1
        E[x] = y
    return E
def centre(E):   # the low point of the brim (90th percentile), so a visor on one side counts
    return int(np.percentile(E[E >= 0], 90))
def orig(repo, rel):
    return Image.open(io.BytesIO(subprocess.run(['git', '-C', repo, 'show', 'HEAD:' + rel], capture_output=True).stdout)).convert('RGBA')
def eyes(repo, b):   # the whites of the eyes on the base Boh: (mask, top row)
    from bodyparts import classes
    im = body(repo, b); S, skin, white, gray = classes(im); yy = np.arange(H)[:, None] * np.ones((1, W), int)
    lab, n = ndi.label(white & (yy > 180) & (yy < 340)); m = np.zeros((H, W), bool)
    for i, sl in enumerate(ndi.find_objects(lab), 1):
        if (lab[sl] == i).sum() > 300: m |= lab == i
    return m, int(np.nonzero(m.any(1))[0].min())
if __name__ == '__main__':
    repo = sys.argv[1]; d = 'assets/boutique/p/w/'; n = 0
    hats = sorted({f[:-7] for f in os.listdir(os.path.join(repo, d)) if f.startswith('ht_') and 'hhw' not in f})
    for b in 'mfh':
        em, etop = eyes(repo, b); cols = np.nonzero(em.any(0))[0]
        for k in hats:
            im = orig(repo, d + '%s_%s.webp' % (k, b)); a = np.asarray(im).copy()
            lab, cnt = ndi.label(a[..., 3] > 40); sizes = np.bincount(lab.ravel()); sizes[0] = 0; main = sizes.argmax()
            stray = 0; objs = ndi.find_objects(lab); mtop = objs[main - 1][0].start
            for i in range(1, cnt + 1):      # anything that floats wholly above the hat is a leftover strip
                if i != main and objs[i - 1][0].stop <= mtop + 2: a[lab == i] = 0; stray += int(sizes[i])
            E = brim(a[..., 3] > 127); low = int(E[cols][E[cols] >= 0].max()) if (E[cols] >= 0).any() else 0
            top = int(np.nonzero((a[..., 3] > 40).any(1))[0].min())
            dy = max(0, min(low - (etop - 2), top - 2))          # the brim ends just above the eyes
            if dy < 3 and not stray: continue
            out = np.zeros_like(a); out[:H - dy] = a[dy:]
            os.makedirs(os.path.join(repo, 'assets/boutique/p/x'), exist_ok=True)
            Image.fromarray(out, 'RGBA').save(os.path.join(repo, 'assets/boutique/p/x/%s_%s.webp' % (k, b)), quality=92, method=6); n += 1
            print('%s %s up %d px%s' % (k, b, dy, ', strip erased' if stray else ''), end='; ')
    print('\n%d hat pictures fixed' % n)
