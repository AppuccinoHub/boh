# BOH wardrobe tools - doll compositor used by the wardrobe test and the picture sheets.
# Created for Assunta Scotto, creator and owner of BOH. 2026-11-14.
# Mirrors the layer order of dollLayersFor() in the level pages (full-frame layers, 400x1040).
import json, re, sys, os
from PIL import Image, ImageDraw, ImageFont
import numpy as np
W, H = 400, 1040
def load(repo, rel):
    return Image.open(os.path.join(repo, rel)).convert('RGBA')
def frame(sheet, col, row=0):
    fw, fh = sheet.width // 4, int(round(sheet.width // 4 * 2.6))
    return sheet.crop((col * fw, row * fh, (col + 1) * fw, (row + 1) * fh)).resize((W, H), Image.LANCZOS)
def body(repo, base, skin='medium', hair='dark', hij=None):
    L = 'assets/look/'
    if base == 'h':
        im = frame(load(repo, L + 'lk-hb-medium.webp'), 1)
        if skin != 'medium': im.alpha_composite(frame(load(repo, L + 'lk-hb-skin-%s.webp' % skin), 1))
        if hij: im.alpha_composite(frame(load(repo, L + 'lk-hb-hij-%s.webp' % hij), 1))
        return im
    col = 0 if base == 'm' else 1
    im = frame(load(repo, L + 'sprBoh.webp'), col)
    if skin != 'medium': im.alpha_composite(frame(load(repo, L + 'lk-skin-%s.webp' % skin), col))
    if hair != 'dark': im.alpha_composite(frame(load(repo, L + 'lk-hair-%s.webp' % hair), col))
    return im
def wear(repo, key, base, skin='medium', pants=False):
    d = os.path.join(repo, 'assets/boutique/')
    sk = '%s_%s_%s%s.webp' % (key, base, skin, '_p' if pants else '')
    for rel in ('p/x/%s_%s.webp' % (key, base), 'p/x/' + sk, 'p/w/%s_%s.webp' % (key, base), 'wear/tee_%s_%s.webp' % (key, base), 'p/w/' + sk):   # p/x = fixed or uncut pictures win
        if os.path.exists(d + rel): return Image.open(d + rel).convert('RGBA')
    return None
def A(im): return np.asarray(im)[..., 3].astype(np.float32) / 255.0
def mask_alpha(im, m):   # m: float array 0..1 (1 = keep)
    a = np.asarray(im).copy(); a[..., 3] = (a[..., 3] * m).astype(np.uint8); return Image.fromarray(a, 'RGBA')
def sheet(cells, cols, cw=150, labels=None, bg=(238, 240, 244, 255), pad=6, lab_h=16):
    ch = int(cw * 2.6); rows = (len(cells) + cols - 1) // cols
    out = Image.new('RGBA', (cols * (cw + pad) + pad, rows * (ch + pad + lab_h) + pad), bg)
    d = ImageDraw.Draw(out)
    for i, c in enumerate(cells):
        x = pad + (i % cols) * (cw + pad); y = pad + (i // cols) * (ch + pad + lab_h)
        if c is not None: out.alpha_composite(c.resize((cw, ch), Image.LANCZOS), (x, y + lab_h))
        if labels: d.text((x + 2, y + 2), labels[i], fill=(20, 20, 30, 255))
    return out

# ---- the new layer stack (same order as the patched dollLayersFor) ----
SLOT_ORDER = ['bottom', 'outfit', 'top', 'back', 'neck', 'scarf', 'wrist', 'feet', 'face', 'velo', 'head', 'hand']
def fitmask(repo, name):
    p = os.path.join(repo, 'assets/look/fit', name + '.webp')
    return A(Image.open(p).convert('RGBA')) if os.path.exists(p) else None
MX, MY = 84, 28                                   # uncut outfits: 84 px wider on each side, 28 px taller
def put(canvas, im):
    if canvas.size == (W, H):
        if im.size == (W, H): canvas.alpha_composite(im)
        else: mx = (im.width - W) // 2; canvas.alpha_composite(im, (0, 0), (mx, 0, mx + W, H))
    else: canvas.alpha_composite(im, ((canvas.width - im.width) // 2, 0))
def compose(repo, base, eq, fit, skin='medium', hair='dark', ext=False):
    """eq: {slot: id}; fit: the BT_FIT table {id: {base: 'letters'}}. Returns the doll picture (frame only)."""
    b = body(repo, base, skin, hair); flags = ''
    for sl in ('outfit', 'top', 'bottom', 'feet'):
        k = eq.get(sl)
        if k and k in fit and base in fit[k]: flags += fit[k][base]
    keep = np.ones((H, W), np.float32)
    for letter, name in (('t', 'top'), ('b', 'bottom')):
        if letter in flags: keep *= fitmask(repo, 'fit_%s_%s' % (base, name))
    if 'g' in flags and base != 'h': keep *= fitmask(repo, 'fit_%s_sand' % base)
    elif 'f' in flags and base != 'h': keep *= fitmask(repo, 'fit_%s_feet' % base)
    elif 's' in flags or 'f' in flags: keep *= fitmask(repo, 'fit_%s_shoes' % base)
    hatm = fitmask(repo, 'hat_%s_%s' % (eq.get('head'), base)) if eq.get('head') and base != 'h' else None
    if hatm is not None: keep *= hatm
    out = Image.new('RGBA', (W + 2 * MX, H + MY) if ext else (W, H)); put(out, mask_alpha(b, keep))
    for sl in SLOT_ORDER:
        if sl == 'back':                          # neck, hands and hijab go above the clothes, below bags and scarves
            for letter, name in (('h', 'ov_h_head'), ('n', 'ov_%s_neck' % base), ('d', 'ov_%s_hands' % base)):
                if letter in flags:
                    m = fitmask(repo, name)
                    if m is not None: put(out, mask_alpha(b, m))
        k = eq.get(sl)
        if not k or (sl == 'feet' and eq.get('outfit')): continue
        w = wear(repo, k, base, skin, pants=bool(eq.get('bottom') or eq.get('outfit')))
        if w is not None: put(out, w)
    return out
