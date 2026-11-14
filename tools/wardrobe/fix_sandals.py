# BOH wardrobe tools - cleans the sandal pictures: erases the faint box and the stray skin blocks under the feet.
# Created for Assunta Scotto, creator and owner of BOH. 2026-11-14. Out: assets/boutique/p/x/sd_*.webp
import sys, os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from dolllib import *
from scipy import ndimage as ndi
if __name__ == '__main__':
    repo = sys.argv[1]; d = os.path.join(repo, 'assets/boutique/p/w'); out = os.path.join(repo, 'assets/boutique/p/x'); os.makedirs(out, exist_ok=True); n = 0; tops = {}
    for f in sorted(os.listdir(d)):
        if not f.startswith('sd_'): continue
        a = np.asarray(Image.open(os.path.join(d, f)).convert('RGBA')).copy(); before = a[..., 3].copy()
        a[a[..., 3] < 48] = 0                                        # the faint box
        lab, k = ndi.label(a[..., 3] > 0); objs = ndi.find_objects(lab); sizes = np.bincount(lab.ravel())
        sizes[0] = 0; main = int(sizes.argmax()); mbot = objs[main - 1][0].stop
        for i, sl in enumerate(objs, 1):
            if i != main and (sizes[i] < 80 or (sl[0].start >= H - 60 and sl[0].start >= mbot - 30 and sizes[i] < sizes[main] * .2)): a[lab == i] = 0   # specks, blocks below the soles
        if (a[..., 3] != before).any():
            Image.fromarray(a, 'RGBA').save(os.path.join(out, f), quality=92, method=6); n += 1
        base = f.split('_')[2]; tops.setdefault(base, []).append(int(np.nonzero((a[..., 3] > 127).any(1))[0].min()))
    print(n, 'sandal pictures cleaned; art starts at y =', {b: (min(v), max(v)) for b, v in tops.items()})
