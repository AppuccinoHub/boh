import json,re,subprocess,os,time,soundfile as sf
from kokoro_onnx import Kokoro
ph=json.load(open('phrases.json'))
k=Kokoro("kokoro-v1.0.onnx","voices-v1.0.bin")
outdir='/home/claude/boh/assets/audio'; os.makedirs(outdir,exist_ok=True)
def clean(t):
    t=re.sub(r'[\U0001F000-\U0001FFFF☀-➿️]','',t)
    t=t.replace('…','').replace('“','').replace('”','').replace('"','')
    return re.sub(r'\s+',' ',t).strip()
clips={}; t0=time.time(); tot=0.0
for i,(key,v) in enumerate(sorted(ph.items()),1):
    text=clean(v['text']); name=f"c{i:04d}.mp3"
    a,sr=k.create(text,voice="if_sara",speed=0.92,lang="it"); tot+=len(a)/sr
    sf.write('/tmp/_c.wav',a,sr)
    subprocess.run(['ffmpeg','-loglevel','error','-y','-i','/tmp/_c.wav','-af','loudnorm=I=-16:TP=-1.5:LRA=11','-codec:a','libmp3lame','-b:a','48k','-ar','24000','-ac','1',f'{outdir}/{name}'],check=True)
    clips[key]=name
json.dump({"v":1,"voice":"kokoro-onnx if_sara speed 0.92","note":"Key = phrase spelled by norm() in assets/bohvoice.js. Batch 1: Italiano 2 and 3 listen phrases.","clips":clips},open(f'{outdir}/manifest.json','w'),ensure_ascii=False,indent=0)
sz=sum(os.path.getsize(f'{outdir}/{n}') for n in clips.values())
print(f"{len(clips)} clips, {tot:.0f}s audio, {sz/1024:.0f} KB total, {time.time()-t0:.0f}s compute")
