# Recorded clips (batch 1)

What this is: real audio files for phrases the game speaks, so they play on AirPlay, Bluetooth and the Promethean board (the built-in voice stays on the device's own speaker).

How it works: `assets/bohvoice.js` looks up the phrase in `manifest.json`. Found: it plays the clip. Not found, or the clip cannot play: the built-in voice speaks, as before.

The key is the phrase spelled by `norm()`: lower case, accents kept, curly apostrophes made straight, everything except letters, digits, apostrophes and spaces turned into a space, spaces collapsed. The same rule is in `tools/audio/make_clips.py`.

Batch 1 = the distinct `"say"` phrases in Italiano 2 and Italiano 3 (99 phrases, about 1.1 MB). Voice: Kokoro-82M `if_sara`, speed 0.92, 48 kbps mono MP3, volume evened out. Pronunciation is NOT machine-checked; a person must listen.

To make more: add phrases to a phrases JSON, run `tools/audio/make_clips.py` (needs `kokoro-onnx`, `soundfile`, ffmpeg and the two model files), commit the new clips and manifest, then bump the `?v=` on bohvoice.js in every page.
