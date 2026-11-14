# BOH wardrobe tools - text fingerprints of the patched files (pictures inside the pages are left out, so the
# fingerprint does not depend on the picture encoder). Created for Assunta Scotto. 2026-11-14.
import sys, os, re, hashlib
FILES = ['italiano1/index.html', 'italiano2/index.html', 'italiano3/index.html', 'italiano4/index.html', 'ap/index.html', 'assets/bohlook.js', 'assets/bohlook.css', 'assets/bohfit.css',
         'index.html', 'preview/index.html', 'assets/routine-qep.js', 'voices.html', 'tools/units-src/extras-italiano1.json', 'tools/units-src/extras-italiano2.json', 'tools/wardrobe/fit.json']
for f in FILES:
    s = open(os.path.join(sys.argv[1], f), encoding='utf8').read()
    print(hashlib.sha256(re.sub(r'data:[a-z/+\-]+;base64,[A-Za-z0-9+/=]+', 'DATA', s).encode('utf8')).hexdigest()[:20], f)
