# Run from tools/audio:  python3 extract_phrases.py   (finds every "say" phrase in the five level pages -> phrases-all.json)
import re,json
def norm(t):
    import unicodedata
    t=unicodedata.normalize('NFC',str(t or '').lower()).replace('‘',"'").replace('’',"'")
    t=''.join(c if (c.isalpha() or c.isdigit() or c in "' ") else ' ' for c in t)
    return re.sub(r'\s+',' ',t).strip()
out={}
for lv in ['italiano1','italiano2','italiano3','italiano4','ap']:
    src=open(f'../../{lv}/index.html',encoding='utf8').read()
    n=0
    for m in re.finditer(r'"say"\s*:\s*("(?:[^"\\]|\\.)*")',src):
        t=json.loads(m.group(1)); k=norm(t); n+=1
        if not k: continue
        e=out.setdefault(k,{'text':t,'levels':[]})
        if lv not in e['levels']: e['levels'].append(lv)
    print(lv,n)
json.dump(out,open('phrases-all.json','w'),ensure_ascii=False,indent=0)
