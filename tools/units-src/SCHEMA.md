# BOH unit source format (one JSON file per unit)

File name: `tools/units-src/<level>-<key>.json`, for example `italiano2-cibo.json`.
A build script turns this file into the game's unit (lesson path, practice rounds, La Prova, flashcards,
Parla questions, idiom card). Write only what is listed here. Every Italian line must fit the level
(see the brief): never use grammar or words from a later level unless the brief says "memorized phrase".

Run `node tools/units-src/validate.js tools/units-src/<file>.json` until it prints OK.

```json
{
  "level": "italiano2",                 // italiano1 | italiano2 | italiano3 | italiano4
  "key": "cibo",                        // short, lowercase a-z only, must not already exist in that level
  "guideUnit": 2,                       // unit number in the district curriculum guide
  "proficiency": "Novice High",
  "title": "Unità 2 · Buon appetito",   // lesson title shown on the path
  "tab": "Buon appetito",               // unit tab label (short)
  "tabSub": "UNITÀ 2",                  // small caps line under the tab
  "eyebrow": "ITALIANO 2 · UNITÀ 2",
  "question": "What do I eat, and how do I order?",   // the unit's big question, English
  "words": "(la colazione, prendo, il conto)",        // 2-4 key items in parentheses
  "workingOn": "ordering food and talking about meals",  // finishes "Working on ...", lower case, max 60 chars
  "canDo": ["I can order a meal.", "I can talk about others' likes and dislikes."],  // from the guide, 2-4
  "culture": "Two or three English sentences on the culture point, shown on the first stop.",
  "vocab": [                            // 2-3 groups, 16-24 words in total, Italian with article for nouns
    { "group": "I pasti", "words": [["la colazione", "breakfast"], ["il pranzo", "lunch"]] }
  ],
  "grammar": {
    "head": "prendere and bere: io prendo, tu prendi …",   // one line, the rule in plain words
    "verbs": ["prendere", "bere"],      // 1-4 verbs for a chart, or [] if no chart
    "rows": [["io", ["prend", "o"], ["bev", "o"]], ["tu", ["prend", "i"], ["bev", "i"]]],
                                        // chart rows: person, then [stem, ending] per verb. [] if no chart
    "tricks": ["Short rule 1.", "Short rule 2.", "Short rule 3."],  // 2-4, English, one sentence each
    "chips": ["Prendo la pasta.", "Bevo l'acqua."]                  // 2-4 useful Italian phrases
  },
  "sentences": [                        // 12 model sentences, short, use the unit words and grammar
    ["Prendo la pasta.", "I'll have the pasta."]
  ],
  "forms": [                            // 12 grammar items: pick the form AND write the form
    { "prompt": "io + prendere", "answer": "prendo", "alts": [], "traps": ["prendi", "prende"],
      "why": "io → -o: prendo.", "trick": ["io → -o", "Cut -ere, add -o: prendere → prendo."] }
  ],
  "fill": [                             // 8 fill-in-the-blank sentences, ONE blank written ___
    { "text": "A colazione io ___ un cornetto.", "answers": ["mangio", "prendo"],
      "cue": "to eat / to have",        // shown in parentheses. Levels 1-2: English. Level 3+: English early, Italian later
      "bank": ["mangio", "prendo", "bevo", "mangi"],   // Levels 1-2 only: every right answer plus 2-3 wrong ones. Omit at Level 3+
      "hint": "The verb ends in -o for io.",           // what the Hint button shows: meaning first, then first letters
      "why": "io → -o. mangio or prendo both work." }
  ],
  "read": {                             // reading with comprehension questions
    "title": "Al ristorante",
    "passage": [["Sono al ristorante con la mia famiglia.", "I'm at the restaurant with my family."]],
                                        // Level 1: 3-4 short sentences. Level 2: 4-5. Level 3: 5-7. Level 4: 7-10 with some inference
    "gloss": { "il cameriere": "the waiter" },   // words a student may not know; each key must appear in the passage exactly
    "questions": [                      // 3-4 questions, Italian, answers in Italian, 2 traps each
      { "q": "Che cosa prende la sorella?", "answer": "il pesce", "traps": ["la pasta", "il dolce"],
        "why": "Mia sorella prende il pesce." }
    ]
  },
  "listen": [                           // EXACTLY 3: the student hears the question and answers out loud in the recorder
    { "q": "Che cosa mangi a colazione?", "en": "What do you eat for breakfast?",
      "frames": ["A colazione mangio …", "Bevo …"] }   // starter frames, only words already taught
  ],
  "chat": {                             // a 6-line text-message chat that models the unit
    "who": ["Giulia", "Marco"],
    "lines": [[0, "Ciao! Hai fame?", "Hi! Are you hungry?"], [1, "Sì! Ho una fame da lupo!", "Yes! I'm starving!"]],
    "words": { "hai fame": "are you hungry" }
  },
  "parla": {                            // partner speaking task in class
    "prompts": [["Che cosa mangi a pranzo?", "A pranzo mangio …"]],   // exactly 3: [question, starter]
    "checks": ["Ho fatto le 3 domande.", "Ho risposto con frasi intere.", "Ho detto una cosa del mio compagno."]
  },
  "finish": "Now I know how to say what I eat and how to order in a restaurant!",  // starts "Now I know"
  "idiom": { "it": "Avere l'acquolina in bocca", "en": "to have a watering mouth",
             "ex": "Che profumo! Ho l'acquolina in bocca.", "exEn": "What a smell! My mouth is watering.",
             "note": "Said when food smells or looks delicious." },
  "flags": ["Anything the teacher must decide or check, in plain English."]
}
```

Rules
- Straight apostrophes in Italian are fine (l'acqua). Use the accented letters (è, perché, più, città).
- No word or grammar from a later level. If the guide needs one, use it only as a memorized chunk and add a flag.
- Fill-in sentences where more than one verb is correct must list every correct verb in "answers".
- Traps must be clearly wrong, never a second correct answer.
- Keep English short. No emoji in Italian sentences except in "chat" lines.
- The idiom is given in the brief; copy it and write ex, exEn, note.
