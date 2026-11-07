# Boh Passport — mini demo

Phone-first click-through: **Play → Stamp shop → Passport**, with **country pack tabs**.

No custom avatar / hair / paper-doll. Flex is the stamp book.

## Open

```bash
cd /workspace/boh-sample/passport
python3 -m http.server 8766 --bind 0.0.0.0
```

Then open **http://127.0.0.1:8766/**

Port **8765** may still host the parked avatar play demo — use **8766** for Passport.

## Country packs

One passport shell · **one shared Boh Cashi wallet** · **inked stamps stay per pack**.

| Pack tab | Language | Focus |
|----------|----------|--------|
| 🇮🇹 Italia | Italian | Existing Campania / greetings set |
| 🇫🇷 France | French | Level-1 greetings + cities + song stub |
| 🇪🇸 España | Spanish (Spain) | Peninsular greetings / cities / rumba stub |
| 🌎 LatAm | Spanish (LatAm) | vos/ustedes flavor · MX / AR / CO cities · cumbia stub |

Switch packs with the flag chips under the step pills. Shop + passport pages filter to the active pack. Buying Italia stamps does **not** fill France (etc.).

### Italia stamps
Ciao 20 · Come stai? 25 · Bene grazie 30 · Bacoli 35 · Monte di Procida 40 · Ischia 40 · Capri 50 · Sanremo 45

### France stamps
Bonjour 20 · Ça va? 25 · Merci 30 · Paris 40 · Lyon 35 · Marseille 40 · La Vie en rose 45

### España stamps
Hola 20 · ¿Qué tal? 25 · Gracias 30 · Madrid 40 · Sevilla 40 · Barcelona 45 · Rumba gitana 45

### LatAm stamps
Hola 20 · ¿Cómo estás? 25 · Gracias 30 · Ciudad de México 40 · Buenos Aires 40 · Bogotá 40 · Cumbia 45

## Loop

1. **Play** — Greetings Level 1 (5 Qs). +12 BC each, +10 perfect-round bonus (max 70 BC/round).
2. **Stamp shop** — buy stamps for the **active pack** with shared Cashi.
3. **Passport** — cover (optional name) + Greetings / Towns / Songs for the active pack. Flip prev/next.

Leave Play mid-quiz via top step pills, bottom nav, or ← Stamp shop / ← Passport.

### Play quiz language (this pass)

**Play stays Italian-only.** Pack tabs change the stamp shop and passport pages; they do not swap the quiz yet. Noted on the Play screen.

## State

`localStorage` key `boh_passport_v2` (`owned` is per-pack). Old `boh_passport_v1` Italia owned lists migrate into the Italia pack on first load.

## Note

Does **not** touch live classroom Boh or `/workspace/boh-investigate`. Avatar demo under `../play/` is parked — this folder is independent.
