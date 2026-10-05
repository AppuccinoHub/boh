# Boh inspection report

Run: 2026-10-05 00:32

Read-only. Nothing in the game was changed.

## 1. Does each level load without errors?

| Level | Chromebook | Laptop | Phone |
|---|---|---|---|
| italiano1 | ok | ok | ok |
| italiano2 | ok | ok | ok |
| italiano3 | ok | ok | ok |
| italiano4 | ok | ok | ok |
| ap | ok | ok | ok |

## 2. Page sideways scroll (should be 0)

| Level | Chromebook | Laptop | Phone |
|---|---|---|---|
| italiano1 | 0 | 0 | 0 |
| italiano2 | 0 | 0 | 0 |
| italiano3 | 0 | 0 | 0 |
| italiano4 | 0 | 0 | 0 |
| ap | 0 | 0 | 0 |

## 3. Same look on every level (home screen, Chromebook size)

| Level | Page color | Font | Button color | Button corner |
|---|---|---|---|---|
| italiano1 | rgb(250, 249, 245) | Manrope, system-ui, sans-serif | rgb(26, 92, 223) | 16px |
| italiano2 | rgb(250, 249, 245) | Manrope, system-ui, sans-serif | rgb(26, 92, 223) | 16px |
| italiano3 | rgb(250, 249, 245) | Manrope, system-ui, sans-serif | rgb(26, 92, 223) | 16px |
| italiano4 | rgb(250, 249, 245) | Manrope, system-ui, sans-serif | rgb(26, 92, 223) | 16px |
| ap | rgb(250, 249, 245) | Manrope, system-ui, sans-serif | rgb(26, 92, 223) | 16px |

## 4. Shared engine code identical in every level (a hash per piece; same = same code)

| Piece | italiano1 | italiano2 | italiano3 | italiano4 | ap | Same? |
|---|---|---|---|---|---|---|
| lsFresh | 6ca53917e1 | 6ca53917e1 | 6ca53917e1 | 6ca53917e1 | 6ca53917e1 | yes |
| lsCheck | 1e7703eef9 | 1e7703eef9 | 1e7703eef9 | 1e7703eef9 | 1e7703eef9 | yes |
| lsPickMc | 5e04f4fee2 | 5e04f4fee2 | 5e04f4fee2 | 5e04f4fee2 | 5e04f4fee2 | yes |
| lsNext | dea56a7f4d | dea56a7f4d | dea56a7f4d | dea56a7f4d | dea56a7f4d | yes |
| lsSayIt | 1109550d1e | 1109550d1e | 1109550d1e | 1109550d1e | 1109550d1e | yes |
| lsRight | c537539a07 | c537539a07 | c537539a07 | c537539a07 | c537539a07 | yes |
| lsWrong | 32aeaf4b1c | 32aeaf4b1c | 32aeaf4b1c | 32aeaf4b1c | 32aeaf4b1c | yes |
| lsPay | e61643b215 | e61643b215 | e61643b215 | e61643b215 | e61643b215 | yes |
| lsNoSnd | fcfb19a863 | fcfb19a863 | fcfb19a863 | fcfb19a863 | fcfb19a863 | yes |
| lsReadIt | 329ec41b6b | 329ec41b6b | 329ec41b6b | 329ec41b6b | 329ec41b6b | yes |
| lsTellProf | 800b7872e8 | 800b7872e8 | 800b7872e8 | 800b7872e8 | 800b7872e8 | yes |
| lsSkipListen | b0585e43b1 | b0585e43b1 | b0585e43b1 | b0585e43b1 | b0585e43b1 | yes |
| lsVoicesH | a87569afbc | a87569afbc | a87569afbc | a87569afbc | a87569afbc | yes |
| css .ls-rec{ | 25ebd4ee50 | 25ebd4ee50 | 25ebd4ee50 | 25ebd4ee50 | 25ebd4ee50 | yes |
| css .ls-say{ | 01afb13bd7 | 01afb13bd7 | 01afb13bd7 | 01afb13bd7 | 01afb13bd7 | yes |
| css .ls-nosnd{ | a6679c73be | a6679c73be | a6679c73be | a6679c73be | a6679c73be | yes |
| css .ls-help{ | b6372b6ddf | b6372b6ddf | b6372b6ddf | b6372b6ddf | b6372b6ddf | yes |
| css .ls-hb{ | 62251fa817 | 62251fa817 | 62251fa817 | 62251fa817 | 62251fa817 | yes |
| css .ls-readit{ | bbadd328a7 | bbadd328a7 | bbadd328a7 | bbadd328a7 | bbadd328a7 | yes |

## 5. Which shared scripts each level loads

| Script | italiano1 | italiano2 | italiano3 | italiano4 | ap |
|---|---|---|---|---|---|
| bohvoice.js | yes | yes | yes | yes | yes |
| flashcards.js | yes | yes | yes | yes | yes |
| recorder.js | - | - | yes | yes | yes |
| recordit.js | - | - | yes | yes | yes |
| routine.js | - | - | yes | - | - |
| scorecard.js | yes | yes | yes | yes | yes |
| gloss.js | yes | yes | yes | yes | yes |
| bohsave.js | yes | yes | yes | yes | yes |
| bohhome.js | yes | yes | yes | yes | yes |

## 6. App map (from the code, not hand-written)

### italiano1

Unit tabs in order: ['it1']. Coming-soon tabs: [].
Shared pieces loaded: {'BohVoice': 'object', 'BohRecorder': 'undefined', 'BohRoutine': 'undefined', 'BohCards': 'object', 'BohScoreCard': 'undefined'}. Routine units: [].

| Unit | Tab | Title | Practice modes | Questions | Question types | Shown on home? |
|---|---|---|---|---|---|---|
| it1 | Essere o avere | ESSERE O AVERE | pron, pronfill, sort, conj, ea, vocab, agg, frasi, mixed, prova, mistakes | 181 | {'mc': 62, 'selfcheck': 61, 'binary': 58} | yes |
| u1 | Unit 1 | How do I greet people and be polite? | greet, mistakes | 8 | {'mc': 8} | NO (hidden) |

| Lesson page | Stop | Items | Item kinds | Listen items | Speaking items | Reachable? |
|---|---|---|---|---|---|---|
| u2 | Sport e passatempi | 14 | {'impara': 1, 'mc': 9, 'tiles': 2, 'type': 2} | 2 | 0 | NO |
| u2 | Il tempo | 14 | {'impara': 1, 'mc': 9, 'tiles': 2, 'type': 2} | 2 | 0 | NO |
| u2 | Date e stagioni | 14 | {'impara': 1, 'mc': 8, 'tiles': 3, 'type': 2} | 2 | 0 | NO |
| u2 | Tutto insieme | 13 | {'text': 1, 'mc': 6, 'tiles': 2, 'type': 4} | 0 | 0 | NO |
| u2 | Rispondi e parla | 7 | {'mc': 6, 'parla': 1} | 0 | 1 | NO |
| u3 | Impara · -are: io e tu | 8 | {'text': 1, 'impara': 1, 'mc': 6} | 0 | 0 | NO |
| u3 | Scrivi · Io e tu | 12 | {'text': 1, 'type': 6, 'tiles': 3, 'chat': 2} | 0 | 0 | NO |
| u3 | Impara · Voglio, devo, posso | 8 | {'text': 1, 'impara': 1, 'mc': 6} | 0 | 0 | NO |
| u3 | Scrivi e correggi | 11 | {'text': 1, 'type': 6, 'fix': 4} | 0 | 0 | NO |
| u3 | Invita! | 11 | {'text': 1, 'mc': 2, 'impara': 1, 'chat': 3, 'tiles': 3, 'parla': 1} | 0 | 1 | NO |
| u1 | Say hello and goodbye | 15 | {'impara': 2, 'mc': 10, 'tiles': 2, 'parla': 1} | 6 | 1 | NO |

### italiano2

Unit tabs in order: ['ea', 'u2', 'u3']. Coming-soon tabs: ['Unità 1 · le feste e la famiglia'].
Shared pieces loaded: {'BohVoice': 'object', 'BohRecorder': 'undefined', 'BohRoutine': 'undefined', 'BohCards': 'object', 'BohScoreCard': 'undefined'}. Routine units: [].

| Unit | Tab | Title | Practice modes | Questions | Question types | Shown on home? |
|---|---|---|---|---|---|---|
| ea | Page 1 | Who am I, and what do I have? | pron, sort, conj, ea, vocab, frasi, mixed, prova, mistakes | 142 | {'mc': 40, 'binary': 62, 'selfcheck': 40} | yes |
| u2 | Page 2 | What do I do in my free time? | v1, v2, v3, scrivi, mixed, prova, mistakes | 138 | {'mc': 76, 'selfcheck': 62} | yes |
| u3 | Page 3 | What can I do, want to do, and have to d | are, vdp, inf, inv, mixed, prova, mistakes | 87 | {'mc': 45, 'selfcheck': 42} | yes |

| Lesson page | Stop | Items | Item kinds | Listen items | Speaking items | Reachable? |
|---|---|---|---|---|---|---|
| u2 | Sport e passatempi | 14 | {'impara': 1, 'mc': 9, 'tiles': 2, 'type': 2} | 2 | 0 | yes |
| u2 | Il tempo | 14 | {'impara': 1, 'mc': 9, 'tiles': 2, 'type': 2} | 2 | 0 | yes |
| u2 | Date e stagioni | 14 | {'impara': 1, 'mc': 8, 'tiles': 3, 'type': 2} | 2 | 0 | yes |
| u2 | Tutto insieme | 13 | {'text': 1, 'mc': 6, 'tiles': 2, 'type': 4} | 0 | 0 | yes |
| u2 | Rispondi e parla | 7 | {'mc': 6, 'parla': 1} | 0 | 1 | yes |
| u3 | Learn · What I do | 8 | {'text': 1, 'impara': 1, 'mc': 6} | 0 | 0 | yes |
| u3 | Write · Me and you | 12 | {'text': 1, 'type': 6, 'tiles': 3, 'chat': 2} | 0 | 0 | yes |
| u3 | Learn · Want, must, can | 8 | {'text': 1, 'impara': 1, 'mc': 6} | 0 | 0 | yes |
| u3 | Write and fix | 11 | {'text': 1, 'type': 6, 'fix': 4} | 0 | 0 | yes |
| u3 | Invita! | 11 | {'text': 1, 'mc': 2, 'impara': 1, 'chat': 3, 'tiles': 3, 'parla': 1} | 0 | 1 | yes |

### italiano3

Unit tabs in order: ['vdp', 'imp', 'pp', 'pi']. Coming-soon tabs: ['Il futuro'].
Shared pieces loaded: {'BohVoice': 'object', 'BohRecorder': 'object', 'BohRoutine': 'object', 'BohCards': 'object', 'BohScoreCard': 'undefined'}. Routine units: ['qep'].

| Unit | Tab | Title | Practice modes | Questions | Question types | Shown on home? |
|---|---|---|---|---|---|---|
| vdp | Volere · Dovere · Potere | VOLERE · DOVERE · POTERE | pron, sort, conj, vdp, frasi, mixed, prova, mistakes, cart_pisa, cart_verona, cart_milano, cart_trevi, cart_roma, cart_firenze, cart_venezia, cart_pompei, cart_capri, cart_amalfi, cart_napoli, cart_sicilia, cartoline | 169 | {'mc': 92, 'binary': 33, 'selfcheck': 44} | yes |
| imp | L’imperfetto | L’IMPERFETTO · DA PICCOLO/A | vocab, pron, sort, conj, vdp, salute, frasi, mixed, prova, dialetti, mistakes, cart_pisa, cart_verona, cart_milano, cart_trevi, cart_roma, cart_firenze, cart_venezia, cart_pompei, cart_capri, cart_amalfi, cart_napoli, cart_sicilia, cartoline | 287 | {'mc': 227, 'selfcheck': 60} | yes |
| pp | Presente o passato prossimo? | PRESENTE O PASSATO PROSSIMO? | f, w, v, fr, q, l, sh, dx, mixed, prova, mistakes, tm | 162 | {'mc': 97, 'selfcheck': 65} | yes |
| pi | Passato prossimo o imperfetto? | PASSATO PROSSIMO O IMPERFETTO? | f, w, v, fr, q, l, sh, dx, mixed, prova, mistakes, tm | 177 | {'mc': 109, 'selfcheck': 68} | yes |

| Lesson page | Stop | Items | Item kinds | Listen items | Speaking items | Reachable? |
|---|---|---|---|---|---|---|
| pp | Impara · Presente o passato prossimo? | 8 | {'text': 1, 'impara': 1, 'mc': 6} | 0 | 0 | yes |
| pp | Parole · vocabolario | 12 | {'impara': 1, 'mc': 6, 'type': 5} | 0 | 0 | yes |
| pp | Scrivi · forme e frasi | 11 | {'type': 8, 'tiles': 3} | 0 | 0 | yes |
| pp | Parla | 1 | {'parla': 1} | 0 | 1 | yes |
| pi | Impara · Passato prossimo o imperfetto? | 8 | {'text': 1, 'impara': 1, 'mc': 6} | 0 | 0 | yes |
| pi | Parole · vocabolario | 12 | {'impara': 1, 'mc': 6, 'type': 5} | 0 | 0 | yes |
| pi | Scrivi · forme e frasi | 11 | {'type': 8, 'tiles': 3} | 0 | 0 | yes |
| pi | Parla | 1 | {'parla': 1} | 0 | 1 | yes |
| imp | Impara | 7 | {'impara': 1, 'mc': 6} | 0 | 0 | yes |
| imp | Completa | 8 | {'type': 8} | 0 | 0 | yes |
| imp | Costruisci | 6 | {'tiles': 6} | 0 | 0 | yes |
| imp | Trasforma e correggi | 11 | {'type': 6, 'fix': 5} | 0 | 0 | yes |
| imp | Rispondi a Boh | 3 | {'chat': 3} | 0 | 0 | yes |
| imp | Parla | 1 | {'parla': 1} | 0 | 1 | yes |

### italiano4

Unit tabs in order: ['r3', 'r4', 'r6', 'r7', 'r8', 'r1', 'r2', 'r5']. Coming-soon tabs: [].
Shared pieces loaded: {'BohVoice': 'object', 'BohRecorder': 'object', 'BohRoutine': 'undefined', 'BohCards': 'object', 'BohScoreCard': 'undefined'}. Routine units: [].

| Unit | Tab | Title | Practice modes | Questions | Question types | Shown on home? |
|---|---|---|---|---|---|---|
| r3 | L’imperfetto | L’IMPERFETTO | f, w, v, fr, q, l, sh, dx, mixed, prova, mistakes | 712 | {'mc': 356, 'selfcheck': 356} | yes |
| r4 | Il passato prossimo | IL PASSATO PROSSIMO | f, w, v, fr, q, l, sh, dx, mixed, prova, mistakes | 280 | {'mc': 148, 'selfcheck': 132} | yes |
| r6 | Imperfetto o passato prossimo? | IMPERFETTO O PASSATO PROSSIMO? | f, w, v, fr, q, l, sh, dx, mixed, prova, mistakes | 143 | {'mc': 82, 'selfcheck': 61} | yes |
| r7 | L’imperativo: gli ordini | L’IMPERATIVO | f, w, v, fr, q, l, sh, dx, mixed, prova, mistakes | 215 | {'mc': 115, 'selfcheck': 100} | yes |
| r8 | Il futuro | IL FUTURO | f, w, v, fr, q, l, sh, dx, mixed, prova, mistakes | 293 | {'mc': 153, 'selfcheck': 140} | yes |
| r1 | I verbi riflessivi | I VERBI RIFLESSIVI | f, w, v, fr, q, l, sh, dx, mixed, prova, mistakes | 275 | {'mc': 143, 'selfcheck': 132} | yes |
| r2 | I verbi reciproci | I VERBI RECIPROCI | f, w, v, fr, q, l, sh, dx, mixed, prova, mistakes | 169 | {'mc': 89, 'selfcheck': 80} | yes |
| r5 | Riflessivi e reciproci al passato | RIFLESSIVI E RECIPROCI AL PASSATO | f, w, v, fr, q, l, sh, dx, mixed, prova, mistakes | 308 | {'mc': 161, 'selfcheck': 147} | yes |

| Lesson page | Stop | Items | Item kinds | Listen items | Speaking items | Reachable? |
|---|---|---|---|---|---|---|
| r3 | Impara · L’imperfetto | 8 | {'text': 1, 'impara': 1, 'mc': 6} | 0 | 0 | yes |
| r3 | Parole · vocabolario | 11 | {'impara': 1, 'mc': 6, 'type': 4} | 0 | 0 | yes |
| r3 | Scrivi · forme e frasi | 11 | {'type': 8, 'tiles': 3} | 0 | 0 | yes |
| r3 | Parla | 1 | {'parla': 1} | 0 | 1 | yes |
| r4 | Impara · Il passato prossimo | 8 | {'text': 1, 'impara': 1, 'mc': 6} | 0 | 0 | yes |
| r4 | Parole · vocabolario | 12 | {'impara': 1, 'mc': 6, 'type': 5} | 0 | 0 | yes |
| r4 | Scrivi · forme e frasi | 12 | {'type': 8, 'tiles': 4} | 0 | 0 | yes |
| r4 | Parla | 1 | {'parla': 1} | 0 | 1 | yes |
| r6 | Impara · Imperfetto o passato prossimo? | 8 | {'text': 1, 'impara': 1, 'mc': 6} | 0 | 0 | yes |
| r6 | Parole · vocabolario | 12 | {'impara': 1, 'mc': 6, 'type': 5} | 0 | 0 | yes |
| r6 | Scrivi · forme e frasi | 10 | {'type': 7, 'tiles': 3} | 0 | 0 | yes |
| r6 | Parla | 1 | {'parla': 1} | 0 | 1 | yes |
| r7 | Impara · L’imperativo: gli ordini | 8 | {'text': 1, 'impara': 1, 'mc': 6} | 0 | 0 | yes |
| r7 | Parole · vocabolario | 12 | {'impara': 1, 'mc': 6, 'type': 5} | 0 | 0 | yes |
| r7 | Scrivi · forme e frasi | 11 | {'type': 8, 'tiles': 3} | 0 | 0 | yes |
| r7 | Parla | 1 | {'parla': 1} | 0 | 1 | yes |
| r8 | Impara · Il futuro | 8 | {'text': 1, 'impara': 1, 'mc': 6} | 0 | 0 | yes |
| r8 | Parole · vocabolario | 12 | {'impara': 1, 'mc': 6, 'type': 5} | 0 | 0 | yes |
| r8 | Scrivi · forme e frasi | 12 | {'type': 8, 'tiles': 4} | 0 | 0 | yes |
| r8 | Parla | 1 | {'parla': 1} | 0 | 1 | yes |
| r1 | Impara · I verbi riflessivi | 8 | {'text': 1, 'impara': 1, 'mc': 6} | 0 | 0 | yes |
| r1 | Parole · vocabolario | 12 | {'impara': 1, 'mc': 6, 'type': 5} | 0 | 0 | yes |
| r1 | Scrivi · forme e frasi | 12 | {'type': 8, 'tiles': 4} | 0 | 0 | yes |
| r1 | Parla | 1 | {'parla': 1} | 0 | 1 | yes |
| r2 | Impara · I verbi reciproci | 8 | {'text': 1, 'impara': 1, 'mc': 6} | 0 | 0 | yes |
| r2 | Parole · vocabolario | 9 | {'impara': 1, 'mc': 6, 'type': 2} | 0 | 0 | yes |
| r2 | Scrivi · forme e frasi | 10 | {'type': 7, 'tiles': 3} | 0 | 0 | yes |
| r2 | Parla | 1 | {'parla': 1} | 0 | 1 | yes |
| r5 | Impara · Riflessivi e reciproci al passato | 8 | {'text': 1, 'impara': 1, 'mc': 6} | 0 | 0 | yes |
| r5 | Parole · vocabolario | 10 | {'impara': 1, 'mc': 6, 'type': 3} | 0 | 0 | yes |
| r5 | Scrivi · forme e frasi | 11 | {'type': 8, 'tiles': 3} | 0 | 0 | yes |
| r5 | Parla | 1 | {'parla': 1} | 0 | 1 | yes |

### ap

Unit tabs in order: ['f1', 'u2', 'u3', 'u4', 'u5', 'u6']. Coming-soon tabs: [].
Shared pieces loaded: {'BohVoice': 'object', 'BohRecorder': 'object', 'BohRoutine': 'undefined', 'BohCards': 'object', 'BohScoreCard': 'undefined'}. Routine units: [].

| Unit | Tab | Title | Practice modes | Questions | Question types | Shown on home? |
|---|---|---|---|---|---|---|
| f1 | Famiglie e comunità | FAMIGLIE E COMUNITÀ | f, w, v, fr, q, l, sh, dx, mq, pr, mixed, prova, mistakes, tm | 558 | {'mc': 373, 'selfcheck': 185} | yes |
| u2 | Lingua e cultura | LINGUA E CULTURA | f, w, v, fr, q, l, sh, dx, mq, pr, mixed, prova, mistakes, tm | 517 | {'mc': 336, 'selfcheck': 181} | yes |
| u3 | Arte e creatività | ARTE E CREATIVITÀ | f, w, v, fr, q, l, sh, dx, mq, pr, mixed, prova, mistakes, tm | 637 | {'mc': 448, 'selfcheck': 189} | yes |
| u4 | Scienza e tecnologia | SCIENZA E TECNOLOGIA | f, w, v, fr, q, l, sh, dx, mq, pr, mixed, prova, mistakes, tm | 550 | {'mc': 367, 'selfcheck': 183} | yes |
| u5 | Vita contemporanea | VITA CONTEMPORANEA | f, w, v, fr, q, l, sh, dx, mq, pr, mixed, prova, mistakes, tm | 572 | {'mc': 408, 'selfcheck': 164} | yes |
| u6 | Contesti globali | CONTESTI GLOBALI | f, w, v, fr, q, l, sh, dx, mq, pr, mixed, prova, mistakes, tm | 457 | {'mc': 342, 'selfcheck': 115} | yes |

| Lesson page | Stop | Items | Item kinds | Listen items | Speaking items | Reachable? |
|---|---|---|---|---|---|---|
| f1 | Parole · vocabolario | 12 | {'impara': 1, 'mc': 6, 'type': 5} | 0 | 0 | yes |
| f1 | Impara · Famiglie e comunità | 8 | {'text': 1, 'impara': 1, 'mc': 6} | 0 | 0 | yes |
| f1 | Scrivi · forme e frasi | 11 | {'type': 8, 'tiles': 3} | 0 | 0 | yes |
| f1 | Parla | 1 | {'parla': 1} | 0 | 1 | yes |
| u2 | Parole · vocabolario | 12 | {'impara': 1, 'mc': 6, 'type': 5} | 0 | 0 | yes |
| u2 | Impara · Lingua e cultura | 8 | {'text': 1, 'impara': 1, 'mc': 6} | 0 | 0 | yes |
| u2 | Scrivi · forme e frasi | 11 | {'type': 8, 'tiles': 3} | 0 | 0 | yes |
| u2 | Parla | 1 | {'parla': 1} | 0 | 1 | yes |
| u3 | Parole · vocabolario | 12 | {'impara': 1, 'mc': 6, 'type': 5} | 0 | 0 | yes |
| u3 | Impara · Arte e creatività | 8 | {'text': 1, 'impara': 1, 'mc': 6} | 0 | 0 | yes |
| u3 | Scrivi · forme e frasi | 11 | {'type': 8, 'tiles': 3} | 0 | 0 | yes |
| u3 | Parla | 1 | {'parla': 1} | 0 | 1 | yes |
| u4 | Parole · vocabolario | 12 | {'impara': 1, 'mc': 6, 'type': 5} | 0 | 0 | yes |
| u4 | Impara · Scienza e tecnologia | 8 | {'text': 1, 'impara': 1, 'mc': 6} | 0 | 0 | yes |
| u4 | Scrivi · forme e frasi | 11 | {'type': 8, 'tiles': 3} | 0 | 0 | yes |
| u4 | Parla | 1 | {'parla': 1} | 0 | 1 | yes |
| u5 | Parole · vocabolario | 12 | {'impara': 1, 'mc': 6, 'type': 5} | 0 | 0 | yes |
| u5 | Impara · Vita contemporanea | 8 | {'text': 1, 'impara': 1, 'mc': 6} | 0 | 0 | yes |
| u5 | Scrivi · forme e frasi | 11 | {'type': 8, 'tiles': 3} | 0 | 0 | yes |
| u5 | Parla | 1 | {'parla': 1} | 0 | 1 | yes |
| u6 | Parole · vocabolario | 12 | {'impara': 1, 'mc': 6, 'type': 5} | 0 | 0 | yes |
| u6 | Impara · Contesti globali | 8 | {'text': 1, 'impara': 1, 'mc': 6} | 0 | 0 | yes |
| u6 | Scrivi · forme e frasi | 11 | {'type': 8, 'tiles': 3} | 0 | 0 | yes |
| u6 | Parla | 1 | {'parla': 1} | 0 | 1 | yes |

## 7. Listening and speaking: same way in every level?

| Level | Voice help (bohvoice) | Recording box (recorder.js) | Routine engine | Listen-only questions | Speaking items | Vocaroo steps in page |
|---|---|---|---|---|---|---|
| italiano1 | yes | NO | NO | 3 | 3 | no |
| italiano2 | yes | NO | NO | 0 | 2 | no |
| italiano3 | yes | yes | yes | 0 | 3 | no |
| italiano4 | yes | yes | NO | 0 | 8 | no |
| ap | yes | yes | NO | 0 | 6 | no |

## 7b. Audience rules: does each level match what the teacher decided?

| Level | Break games: wanted | Break games: has | Recording box: wanted | Recording box: has | Result |
|---|---|---|---|---|---|
| italiano1 | no | no | no | no | ok |
| italiano2 | no | no | no | no | ok |
| italiano3 | yes | yes | yes | yes | ok |
| italiano4 | yes | yes | yes | yes | ok |
| ap | yes | yes | yes | yes | ok |

## 8. Mismatches found (2)

- italiano1: lesson data "u2" exists but there is no unit for it (dead code, extra file weight)
- italiano1: lesson data "u3" exists but there is no unit for it (dead code, extra file weight)

Screenshots of every level at three sizes: qa/baseline/
