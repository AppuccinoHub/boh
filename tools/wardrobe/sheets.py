# BOH wardrobe tools - picture sheets of the build (every outfit on a body; every hat). Created for Assunta Scotto. 2026-11-14.
import sys, os, json
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from dolllib import *
def grid(cells, labels, cols, cw, ch, out, bg=(238, 240, 244, 255)):
    rows = (len(cells) + cols - 1) // cols; o = Image.new('RGBA', (cols * (cw + 4) + 4, rows * (ch + 16) + 4), bg); d = ImageDraw.Draw(o)
    for i, c in enumerate(cells):
        x = 4 + (i % cols) * (cw + 4); y = 4 + (i // cols) * (ch + 16)
        o.alpha_composite(c.resize((cw, ch), Image.LANCZOS), (x, y + 13)); d.text((x + 2, y), labels[i], fill=(20, 20, 30, 255))
    o.convert('RGB').save(out, quality=88)
if __name__ == '__main__':
    repo, outdir = sys.argv[1], sys.argv[2]; cfg = json.load(open(os.path.join(os.path.dirname(os.path.abspath(__file__)), 'fit.json'))); fit = cfg['fit']
    for b in sys.argv[3:]:
        if b == 'hats':
            cells = []; labs = []
            for base in 'mf':
                for k in cfg['hats'] + ['ht_visiera']: cells.append(compose(repo, base, {'head': k}, fit).crop((0, 0, W, 440))); labs.append(k + ' ' + base)
            grid(cells, labs, 7, 200, 220, os.path.join(outdir, 'after_hats.jpg'))
        else:
            keys = [k for k in fit if k[:3] in ('lk_', 'tu_') and b in fit[k]]
            grid([compose(repo, b, {'outfit': k}, fit, ext=True) for k in keys], keys, 11, 164, int(164 * (H + MY) / (W + 2 * MX)), os.path.join(outdir, 'after_outfits_%s.jpg' % b))
