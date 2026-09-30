# Boh · online save box (name + short code)

Switched **off** until the district approves storing student progress online.
Today every level already has the backup save file (Settings → 💾 Salva / Carica).

## What it stores
- The Boh name the student chose (not their real name), a short code like `gatto-luna-7`, and the game progress.
- No emails, no school IDs, no real names.

## Turning it on (about 10 minutes, with Claude)
1. In Cloudflare: Workers & Pages → Create → Worker. Paste `boh-save-worker.js`.
2. Storage → KV → create a namespace called `BOH_SAVES`, and bind it to the worker as `BOH_SAVES`.
3. Worker settings → Variables:
   - `ALLOW_ORIGIN` = `https://appuccinohub.github.io`
   - `TEACHER_PIN_SHA256` (secret) = the SHA-256 of your teacher PIN (Claude makes this for you; the PIN itself is never stored).
4. Put the worker's address in `assets/bohsave.js` → `BOH_CLOUD_URL`.
5. Teacher lookup for forgotten codes: open `<worker address>/teacher`.

Free plan limits: 1,000 saves a day, which covers several classes pressing Salva every day.
