# BOH wardrobe tools - before / after pictures drawn by the real level page (main copy vs build copy).
# Created for Assunta Scotto, creator and owner of BOH. 2026-11-14.
# Usage: python3 beforeafter.py <main copy> <build copy> <out dir> [level]
import sys, os, json
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from bohrender import render
from PIL import Image, ImageDraw, ImageFont
CASES = [["Girl: BOH sweatshirt", "f", {"outfit": "lk_tuta_boh"}], ["Girl: school blazer", "f", {"outfit": "lk_divisa"}], ["Girl: black hoodie", "f", {"outfit": "tu_cappuccio"}], ["Girl: Look Roma", "f", {"outfit": "lk_roma"}],
         ["Boy: black sweater", "m", {"outfit": "lk_nero"}], ["Boy: track suit", "m", {"outfit": "lk_tuta_tri"}], ["Hijab Boh: sweatshirt", "h", {"outfit": "lk_tuta_boh"}], ["Hijab Boh: Look Milano", "h", {"outfit": "lk_milano"}],
         ["Boy: BOH cap", "m", {"head": "ht_boh"}], ["Girl: cable beanie", "f", {"head": "ht_trecce"}], ["Boy: lemon hat", "m", {"head": "ht_limoni"}], ["Girl: flip-flops", "f", {"feet": "sd_infradito"}]]
if __name__ == '__main__':
    main, build, out = sys.argv[1:4]; level = sys.argv[4] if len(sys.argv) > 4 else 'italiano2'; os.makedirs(out, exist_ok=True)
    e1 = render(main, os.path.join(out, '_before.png'), level, CASES, 6); e2 = render(build, os.path.join(out, '_after.png'), level, CASES, 6)
    print('page errors: before', e1 or 'none', '| after', e2 or 'none')
    B = Image.open(os.path.join(out, '_before.png')).convert('RGB'); Af = Image.open(os.path.join(out, '_after.png')).convert('RGB')
    cw, ch, gap, pad = 520, B.height // 2 - 16, 16, 16            # one doll cell at 2x
    try: font = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf', 26)
    except Exception: font = ImageFont.load_default()
    names = ['outfits-1', 'outfits-2', 'hats-and-sandals']
    for g in range(3):
        sheet = Image.new('RGB', (4 * cw + 3 * 24 + 40, 2 * (ch + 60) + 40), (255, 255, 255)); d = ImageDraw.Draw(sheet)
        for j in range(4):
            i = g * 4 + j; x0 = pad + (i % 6) * (cw + gap); y0 = pad + (i // 6) * (B.height // 2 - 8)
            for k, (src, tag, col) in enumerate(((B, 'BEFORE', (150, 40, 40)), (Af, 'AFTER', (20, 120, 60)))):
                cell = src.crop((x0, y0, x0 + cw, y0 + ch)); X = 20 + (j % 2) * (2 * cw + 48) + k * (cw + 8); Y = 20 + (j // 2) * (ch + 60)
                sheet.paste(cell, (X, Y + 44)); d.text((X + 8, Y + 6), tag, fill=col, font=font)
        d.text((20, sheet.height - 26), 'BOH wardrobe fit, Package 1 + 1b. (c) 2026 Assunta Scotto. Drawn by the real %s page, 2026-11-14.' % level, fill=(120, 120, 130))
        sheet.resize((sheet.width // 2, sheet.height // 2), Image.LANCZOS).save(os.path.join(out, 'boh-before-after-%s.jpg' % names[g]), quality=90)
    print('wrote', names)
