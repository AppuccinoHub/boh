# Recorded clips

What this is: real audio files for phrases the game speaks, so they play on AirPlay, Bluetooth and the Promethean board (the built-in voice stays on the device's own speaker).

How it works: `assets/bohvoice.js` looks up the phrase in `manifest.json`. Found: it plays the clip. Not found, or the clip cannot play: the built-in voice speaks, as before.

The key is the phrase spelled by `norm()`: lower case, accents kept, curly apostrophes made straight, everything except letters, digits, apostrophes and spaces turned into a space, spaces collapsed. The same rule is in `norm()` in `bohvoice.js` and in `tools/audio/extract_phrases.py`. Clip file name = `c_` + first 10 letters of sha1(key) + `.mp3`, so adding phrases never renames old clips.

Coverage (v2): every distinct `"say"` phrase in Italiano 1, 2, 3, 4 and AP = 1,042 clips, about 46 minutes of audio, about 18 MB. Added Oct 14: 590 more clips (the new units' lesson phrases, the Ascolta questions and the idioms), same voice and settings; 1,632 clips in all. Added Oct 19: 23 more for the Italiano 2 Bonus unit (posso, devo, voglio), its Parla questions and the "Ci sto!" idiom; 1,655 clips in all. Oct 20: the voice now says the boy form for gender slashes (piccolo, not piccolo/a), so 16 questions were recorded again in that form; 1,654 clips in all. The Ascolta questions and idioms are not `"say"` phrases: they were collected from BT_LESSONS (items of type ascolta) and BohIdiom in the browser. NOT covered: flashcard fronts (about 850) and the Italiano 3 routine strings (about 100); those still use the built-in voice (silent on AirPlay/Bluetooth).

Voice: Kokoro-82M `if_sara`, speed 0.92, 48 kbps mono MP3, volume evened out. Sound fix v2: English-style short i/u sounds replaced by plain i/u, long-consonant marks turned into doubled consonants (fixes "il campeggio"). Known weak spot: a word-initial T can sound like D ("Ti piace?"). Pronunciation is NOT machine-checked; a person must listen.

To make more: `cd tools/audio && python3 extract_phrases.py`, then `python3 make_clips.py phrases-all.json ../../assets/audio` (needs `kokoro-onnx`, `soundfile`, ffmpeg and the two model files), commit the new clips and manifest, then bump the `?v=` on bohvoice.js in every page.
