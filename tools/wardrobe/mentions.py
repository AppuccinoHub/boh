# BOH wardrobe tools - counts team / school / old-town mentions in every tracked text file. Created for Assunta Scotto. 2026-11-14.
import sys, re, subprocess, os, collections
repo = sys.argv[1]; show = len(sys.argv) > 2
files = subprocess.run(['git', '-C', repo, 'ls-files'], capture_output=True, text=True).stdout.split('\n')
pat = re.compile('hh' + 'w|horn' + 'et|hamil' + 'ton', re.I); tot = 0; per = {}
ctx = collections.Counter()
for f in files:
    if not f or not re.search(r'\.(html|js|css|json|md|py|txt|webmanifest|svg)$', f): continue
    try: s = open(os.path.join(repo, f), encoding='utf8').read()
    except Exception: continue
    s2 = re.sub(r'data:[a-z/+\-]+;base64,[A-Za-z0-9+/=]+', 'DATA', s)
    ms = list(pat.finditer(s2))
    if ms: per[f] = len(ms); tot += len(ms)
    if show and f == sys.argv[2]:
        for m in ms: ctx[re.sub(r'\s+', ' ', s2[max(0, m.start() - 45):m.end() + 45])] += 1
print(tot, per)
for c, n in ctx.items(): print(n, '|', c)
