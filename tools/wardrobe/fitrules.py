# BOH wardrobe tools - writes fit.json: for every garment and body, what to hide and what to draw above the clothes.
# Created for Assunta Scotto, creator and owner of BOH. 2026-11-14.
# Letters: t b = hide painted-on top / bottom, s = hide shoes, f = hide socks and shoes, g = sandals (hide lower legs),
#          n d h = draw Boh's own neck / hands / hijab above the clothes.
import sys, os, json, re, subprocess
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from dolllib import *
from bodyparts import P
PULLED = {'lk_hornets': 840, 'bg_hhw': 900, 'ht_hhw': 560, 'maglia_hhw': 175, 'lk_firenze': 420}
NECK_COVERED = ['lk_veneziano', 'lk_venezia']     # a mask or a wrapped scarf sits on the neck
HANDS_UNDER = ['lk_fantasma', 'lk_veneziano']     # a sheet or a cape hangs over the hands
if __name__ == '__main__':
    repo, partsdir = sys.argv[1], sys.argv[2]; here = os.path.dirname(os.path.abspath(__file__))
    src = subprocess.run(['git', '-C', repo, 'show', 'HEAD:italiano2/index.html'], capture_output=True).stdout.decode('utf8')
    pw = json.loads(re.search(r'var BT_PW = (\{.*?\});', src).group(1))
    parts = {b: np.asarray(Image.open(os.path.join(partsdir, 'parts_%s.png' % b))) for b in 'mfh'}
    fit = {}; notes = []
    def cov(k, b, sel):
        im = wear(repo, k, b, 'medium'); c = Image.new('RGBA', (W, H)); put(c, im)
        return float((np.asarray(c)[..., 3] > 127)[sel].mean())
    yy = np.arange(H)[:, None] * np.ones((1, W), int)
    for k, bases in pw.items():
        if k in PULLED: continue
        for b in bases:
            pt = parts[b]; s = ''
            if k[:3] in ('lk_', 'tu_'):
                if b == 'h':
                    ct = cov(k, b, pt == P['top']); s = ('t' if ct >= .90 else '') + 'bsh' + ('' if k in HANDS_UNDER else 'd')
                else:
                    socks = (pt == P['feet']) & (yy < int(H * .88)); cs = cov(k, b, socks)
                    s = 'tb' + ('f' if cs >= .97 else 's') + ('' if k in NECK_COVERED else 'n') + ('' if k in HANDS_UNDER else 'd')
                    if cs < .97: notes.append('%s %s: socks stay (outfit covers %d%% of them)' % (k, b, cs * 100))
            elif k[:3] in ('pn_', 'sk_'):
                if cov(k, b, pt == P['bottom']) >= .80: s = 'b'
            elif k[:3] == 'sd_': s = 'gd'     # hands stay in front of the sandal's leg picture
            if s: fit.setdefault(k, {})[b] = s
    hats = sorted({f[4:-7] for f in os.listdir(os.path.join(repo, 'assets/look/fit')) if f.startswith('hat_')})
    ext = sorted(f[:-5] for f in os.listdir(os.path.join(repo, 'assets/boutique/p/x')))
    json.dump(dict(fit=fit, hats=hats, ext=ext, pulled=PULLED, known=['lk_roma pieces'], neck_covered=NECK_COVERED, hands_under=HANDS_UNDER), open(os.path.join(here, 'fit.json'), 'w'), indent=1, sort_keys=True)
    print(len(fit), 'garments with fit rules,', len(hats), 'hats with a hair mask,', len(ext), 'fixed pictures'); print('\n'.join(notes))
    print({k: v for k, v in fit.items() if k[:3] in ('pn_', 'sk_', 'sd_')}); print('h tops hidden under:', [k for k, v in fit.items() if 't' in v.get('h', '')])
