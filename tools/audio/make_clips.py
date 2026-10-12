"""Make the recorded Italian clips for BOH (AI voice, runs on a computer, not in the browser).

Usage:  python3 make_clips.py phrases-all.json OUT_DIR [shard index] [shard count]
        python3 make_clips.py --manifest phrases-all.json OUT_DIR      (writes manifest.json only)

Needs: pip install kokoro-onnx soundfile ; ffmpeg ; model files kokoro-v1.0.onnx and voices-v1.0.bin
(from github.com/thewh1teagle/kokoro-onnx releases) in the current folder.

Clip file name = c_ + first 10 letters of sha1(key) + .mp3, so adding phrases never renames old clips.
Key = phrase spelled by norm() (same rule as norm() in assets/bohvoice.js).

Sound fix (v2): the voice's Italian respelling is corrected before speaking:
  - English-style short i / u sounds -> plain Italian i / u
  - long-consonant mark -> the consonant doubled (kampedzo -> kampeddzo); after a vowel the mark is dropped
"""
import json, re, subprocess, os, sys, time, hashlib

def clean(t):
    t = re.sub(r'[\U0001F000-\U0001FFFF☀-➿️]', '', t)
    t = t.replace('…', '').replace('“', '').replace('”', '').replace('"', '')
    return re.sub(r'\s+', ' ', t).strip()

VOWELS = 'aeiouɛɔ'
def fix(ph):
    ph = ph.replace('ɪ', 'i').replace('ʊ', 'u')
    return re.sub(r'(.)ː', lambda m: m.group(1) if m.group(1) in VOWELS else m.group(1) * 2, ph)

def clip_name(key):
    return 'c_' + hashlib.sha1(key.encode('utf8')).hexdigest()[:10] + '.mp3'

def write_manifest(phrases, outdir):
    clips = {k: clip_name(k) for k in sorted(phrases) if os.path.exists(os.path.join(outdir, clip_name(k)))}
    json.dump({"v": 2, "voice": "kokoro-onnx if_sara speed 0.92, sound fix v2",
               "note": "Key = phrase spelled by norm() in assets/bohvoice.js. Name = c_ + sha1(key)[:10].",
               "clips": clips}, open(os.path.join(outdir, 'manifest.json'), 'w'), ensure_ascii=False, indent=0)
    return clips

if __name__ == '__main__':
    if sys.argv[1] == '--manifest':
        c = write_manifest(json.load(open(sys.argv[2])), sys.argv[3]); print(len(c), 'clips in manifest'); sys.exit()
    import soundfile as sf
    from kokoro_onnx import Kokoro
    phrases = json.load(open(sys.argv[1])); outdir = sys.argv[2]
    si = int(sys.argv[3]) if len(sys.argv) > 3 else 0; sn = int(sys.argv[4]) if len(sys.argv) > 4 else 1
    os.makedirs(outdir, exist_ok=True)
    k = Kokoro("kokoro-v1.0.onnx", "voices-v1.0.bin")
    keys = [x for i, x in enumerate(sorted(phrases)) if i % sn == si]
    t0 = time.time(); tot = 0.0
    for n, key in enumerate(keys, 1):
        text = clean(phrases[key]['text']); name = clip_name(key)
        ph = fix(k.tokenizer.phonemize(text, 'it'))
        a, sr = k.create(ph, voice="if_sara", speed=0.92, lang="it", is_phonemes=True); tot += len(a) / sr
        tmp = f'/tmp/_c{si}.wav'; sf.write(tmp, a, sr)
        subprocess.run(['ffmpeg', '-loglevel', 'error', '-y', '-i', tmp, '-af', 'loudnorm=I=-16:TP=-1.5:LRA=11',
                        '-codec:a', 'libmp3lame', '-b:a', '48k', '-ar', '24000', '-ac', '1', os.path.join(outdir, name)], check=True)
        if n % 25 == 0: print(f'shard {si}: {n}/{len(keys)} {tot:.0f}s audio {time.time()-t0:.0f}s', flush=True)
    print(f'shard {si} DONE {len(keys)} clips {tot:.0f}s audio {time.time()-t0:.0f}s', flush=True)
