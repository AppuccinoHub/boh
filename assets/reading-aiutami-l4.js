/* =====================================================================
   Boh · Aiutami, Level 4: Chiamami (-mi / -ti) + a review of the future (Ripasso). A reading practice unit.
   THIS FILE IS THE WHOLE UNIT'S CONTENT. Edit words here; no other file needs to change.
   Source: the old aiutami/ page (letters, questions and answers copied unchanged; the -mi / -ti items now pick mi or ti).
   Scrivi (scramble), Parla! (partner) and the Prova di ripasso are copied from the old page too. UNTESTED by a teacher.
   Reading guide: see assets/reading-futuro-l3.js. Created by Assunta Scotto, 2026. Not for redistribution.
   ===================================================================== */
BohReading.register({
 "id": "aiutami-l4",
 "level": "italiano4",
 "title": "Aiutami",
 "sub": "Reading practice",
 "home": "../italiano4/",
 "backLabel": "Level 4",
 "intro": "Boh ha un problema. Tu hai la risposta.",
 "pay": {
  "q": 3,
  "m": 2,
  "r": 2,
  "sc": 6,
  "pa": 4,
  "letter": 10
 },
 "paDefault": [
  "Partner A is Boh and reads the problem: <b>\"{hook}\"</b>",
  "Partner B reads the reply letter out loud, to Boh's face.",
  "Boh answers: <b>\"Grazie! Hai ragione!\"</b> Then switch roles.",
  "Challenge: add one new command of your own, with <b>-mi</b> or <b>-ti</b>."
 ],
 "letters": [
  {
   "id": "esame",
   "title": "L'esame",
   "bl": "Mi o Ti?",
   "hook": "Domani ho un esame e sono nervos{o|a}!",
   "letter": [
    "Ciao!",
    "Domani ho un [[esame|un test importante]] di storia e sono molto [[nervos{o|a}|agitat{o|a}, preoccupat{o|a}]]. Studio da tre ore, ma non [[ricordo|ho in mente]] niente! Sono [[stanc{o|a}|senza energia]] e ho [[mal di testa|la testa che fa male]]. Stasera voglio studiare [[fino alle|finché sono le]] due di notte. Che cosa [[devo|è necessario]] fare?"
   ],
   "sign": "Un abbraccio, Boh",
   "q": {
    "t": "Qual è il problema di Boh?",
    "o": [
     "Ha un esame ed è nervos{o|a}.",
     "Ha perso il telefono.",
     "Non ha una giacca per la festa."
    ],
    "a": 0,
    "tip": "Find the words from the answers in the letter. Is there an esame? A telefono? A giacca?"
   },
   "mt": [
    {
     "pre": "Boh è molto nervos{o|a} per l'esame. Calma",
     "post": "",
     "o": [
      "mi",
      "ti"
     ],
     "a": 1,
     "why": "Calmati: Boh calma sé stess{o|a}.",
     "tip": "Who is nervous? Boh. Boh has to do it to {himself|herself} → -ti. Trick: the infinitive is calmarsi. -arsi / -ersi / -irsi → the command ends in -ti."
    },
    {
     "pre": "Boh è stanc{o|a}. Ha bisogno di dormire un po'. Riposa",
     "post": "",
     "o": [
      "mi",
      "ti"
     ],
     "a": 1,
     "why": "Riposati: Boh riposa sé stess{o|a}.",
     "tip": "The tired one is Boh, so Boh does the action → -ti. Infinitive: riposarsi (-arsi) → riposati."
    },
    {
     "pre": "Tu sai tutto sulla storia. Boh deve telefonare a te. Chiama",
     "post": "",
     "o": [
      "mi",
      "ti"
     ],
     "a": 0,
     "why": "Chiamami: la telefonata arriva a me.",
     "tip": "Where does the action go? To YOU, the person talking → -mi. Trick: MI = ME. They even look alike."
    },
    {
     "pre": "Hai un buon consiglio per Boh. Vuoi che Boh senta le tue parole. Ascolta",
     "post": "",
     "o": [
      "mi",
      "ti"
     ],
     "a": 0,
     "why": "Ascoltami: Boh ascolta me.",
     "tip": "Boh listens to YOUR words, so the action goes to you → -mi. Ascoltare has no -si, so -ti doesn't fit here."
    }
   ],
   "rs": [
    {
     "b": "Sono molto nervos{o|a}!",
     "o": [
      "Calmati!",
      "Calmami!",
      "Vestiti!"
     ],
     "a": 0,
     "why": "Calmati: Boh deve calmare sé stess{o|a}.",
     "tip": "Who is nervous, you or Boh? Boh. So Boh does it to {himself|herself} → -ti. Calmami points the action at you."
    },
    {
     "b": "Sono stanc{o|a} e ho mal di testa.",
     "o": [
      "Riposati!",
      "Sbrigati!",
      "Alzati!"
     ],
     "a": 0,
     "why": "Riposati: con il mal di testa serve riposo.",
     "tip": "Key word: stanc{o|a}. Which verb goes with resting? Look for the one that looks like riposo."
    },
    {
     "b": "Voglio studiare fino alle due di notte!",
     "o": [
      "No! Rilassati e vai a letto!",
      "Svegliati e studia!",
      "Divertiti alla festa!"
     ],
     "a": 0,
     "why": "Rilassati e vai a letto: alle due di notte si dorme!",
     "tip": "Studying until 2 a.m. is a bad plan. Pick the only answer that sends Boh to bed (letto)."
    },
    {
     "b": "Ho una domanda sulla storia...",
     "o": [
      "Chiamami stasera!",
      "Chiamati stasera!",
      "Mettiti la giacca!"
     ],
     "a": 0,
     "why": "Chiamami: Boh chiama te per la domanda.",
     "tip": "Boh needs YOUR help, so the phone call comes to you → -mi."
    }
   ],
   "sc": {
    "parts": [
     "Car{o|a} Boh,\n",
     {
      "a": "calmati",
      "c": 1
     },
     "! Tu sei intelligente. Stasera ",
     {
      "a": "riposati"
     },
     " e non studiare fino alle due. Se hai domande, ",
     {
      "a": "chiamami"
     },
     "!"
    ],
    "bank": [
     "calmati",
     "riposati",
     "chiamami",
     "sbrigati",
     "chiamati",
     "calmami",
     "aspettati"
    ]
   },
   "scHint": "For each blank, ask: who gets the action? The action goes to me → -mi. Boh does it to {himself|herself} → -ti. Watch the traps: they are the same verb with the wrong ending.",
   "ruleTitle": "Regola: -mi o -ti?",
   "rule": "Take the <b>tu</b> command and attach the pronoun. It becomes one word.<br><b>-mi</b> = the action goes to ME: chiama + mi = <b>chiamami</b>, scrivi + mi = <b>scrivimi</b>.<br><b>-ti</b> = the person does it to {himself|herself}: calma + ti = <b>calmati</b>, alza + ti = <b>alzati</b>.<br>Ask yourself: <b>who gets the action?</b> Infinitive in -arsi / -ersi / -irsi → the command ends in <b>-ti</b>."
  },
  {
   "id": "ritardo",
   "title": "In ritardo",
   "bl": "Mi o Ti?",
   "hook": "Sono sempre in ritardo per la scuola!",
   "letter": [
    "Ciao!",
    "Ho un grande problema: sono sempre [[in ritardo|non puntuale]] per la scuola! La scuola [[comincia|inizia]] alle sette e mezza, ma io [[mi sveglio|apro gli occhi la mattina]] alle sette e venti. Non faccio [[colazione|il pasto della mattina]] e vado a scuola in [[pigiama|i vestiti per dormire]]! La professoressa è [[arrabbiata|furiosa, non contenta]]. [[Aiuto|SOS!]]!"
   ],
   "sign": "Boh",
   "q": {
    "t": "Perché la professoressa è arrabbiata?",
    "o": [
     "Boh non fa i compiti.",
     "Boh è sempre in ritardo.",
     "Boh parla troppo in classe."
    ],
    "a": 1,
    "tip": "Read the first sentence of the letter again. What is Boh's grande problema?"
   },
   "mt": [
    {
     "pre": "Boh dorme troppo la mattina. Sveglia",
     "post": "",
     "o": [
      "mi",
      "ti"
     ],
     "a": 1,
     "why": "Svegliati: Boh sveglia sé stess{o|a}.",
     "tip": "Boh is the one sleeping, so Boh wakes {himself|herself} → -ti. Boh even says mi sveglio: reflexive → -ti."
    },
    {
     "pre": "Sono le sette e venti e Boh è ancora a letto! Alza",
     "post": "",
     "o": [
      "mi",
      "ti"
     ],
     "a": 1,
     "why": "Alzati: Boh alza sé stess{o|a} dal letto.",
     "tip": "Infinitive: alzarsi (-arsi) → the command ends in -ti."
    },
    {
     "pre": "Boh è ancora in pigiama. Vesti",
     "post": "",
     "o": [
      "mi",
      "ti"
     ],
     "a": 1,
     "why": "Vestiti: Boh veste sé stess{o|a}.",
     "tip": "Boh puts clothes on {himself|herself}. Vestirsi (-irsi) → vestiti."
    },
    {
     "pre": "Anche tu vai a scuola. Vuoi andare con Boh. Aspetta",
     "post": "",
     "o": [
      "mi",
      "ti"
     ],
     "a": 0,
     "why": "Aspettami: Boh aspetta me.",
     "tip": "Boh waits for YOU, so the action goes to you → -mi. Aspettare has no -si."
    }
   ],
   "rs": [
    {
     "b": "Mi sveglio alle sette e venti!",
     "o": [
      "Svegliami alle sei!",
      "Svegliati alle sei e mezza!",
      "Siediti!"
     ],
     "a": 1,
     "why": "Svegliati: Boh sveglia sé stess{o|a}, più presto!",
     "tip": "Boh says mi sveglio, so Boh wakes {himself|herself} up → -ti. Svegliami would make YOU the one waking up."
    },
    {
     "b": "Vado a scuola in pigiama!",
     "o": [
      "Divertiti!",
      "Riposati!",
      "Vestiti prima di uscire!"
     ],
     "a": 2,
     "why": "Vestiti: niente pigiama a scuola!",
     "tip": "The problem is the pigiama. Pick the command about clothes (vestiti)."
    },
    {
     "b": "Non ho tempo!",
     "o": [
      "Sbrigati!",
      "Rilassati!",
      "Fermati!"
     ],
     "a": 0,
     "why": "Sbrigati: Boh deve fare presto.",
     "tip": "No time means Boh has to go faster. Rilassati and Fermati slow Boh down."
    },
    {
     "b": "Vado a scuola da sol{o|a}.",
     "o": [
      "Calmati!",
      "Aspettami! Andiamo insieme!",
      "Aspettati!"
     ],
     "a": 1,
     "why": "Aspettami: andiamo a scuola insieme.",
     "tip": "Da sol{o|a} is the problem. The fix is going together (insieme), so Boh waits for YOU → -mi."
    }
   ],
   "sc": {
    "parts": [
     "Car{o|a} Boh,\ndomani ",
     {
      "a": "svegliati"
     },
     " alle sei e mezza. ",
     {
      "a": "vestiti",
      "c": 1
     },
     " e mangia la colazione. Poi ",
     {
      "a": "aspettami"
     },
     " alla fermata dell'autobus!"
    ],
    "bank": [
     "svegliati",
     "vestiti",
     "aspettami",
     "divertiti",
     "svegliami",
     "vestimi",
     "aspettati"
    ]
   },
   "scHint": "For each blank, ask: who gets the action? The action goes to me → -mi. Boh does it to {himself|herself} → -ti. Watch the traps: they are the same verb with the wrong ending.",
   "ruleTitle": "Regola: -mi o -ti?",
   "rule": "Take the <b>tu</b> command and attach the pronoun. It becomes one word.<br><b>-mi</b> = the action goes to ME: chiama + mi = <b>chiamami</b>, scrivi + mi = <b>scrivimi</b>.<br><b>-ti</b> = the person does it to {himself|herself}: calma + ti = <b>calmati</b>, alza + ti = <b>alzati</b>.<br>Ask yourself: <b>who gets the action?</b> Infinitive in -arsi / -ersi / -irsi → the command ends in <b>-ti</b>."
  },
  {
   "id": "festa",
   "title": "La festa",
   "bl": "Mi o Ti?",
   "hook": "C'è una festa, ma sono timid{o|a}!",
   "letter": [
    "Ciao!",
    "Sabato sera c'è una festa a casa di Marco. Voglio andare, ma sono [[timid{o|a}|non parlo molto con persone nuove]] e [[non conosco nessuno|tutti sono persone nuove per me]]. E poi [[fa freddo|la temperatura è bassa]] e non ho una [[giacca|si mette sopra la maglia quando fa freddo]]! [[Ho paura|sono spaventat{o|a}]] di stare [[sol{o|a}|senza amici]] tutta la sera."
   ],
   "sign": "Boh",
   "q": {
    "t": "Perché Boh ha paura?",
    "o": [
     "Ha un esame di storia.",
     "È in ritardo.",
     "Non conosce nessuno alla festa."
    ],
    "a": 2,
    "tip": "Find the words ho paura in the letter. Read the sentence just before them."
   },
   "mt": [
    {
     "pre": "Fa freddo. Boh prende la tua giacca. Metti",
     "post": "",
     "o": [
      "mi",
      "ti"
     ],
     "a": 1,
     "why": "Mettiti: Boh mette la giacca su sé stess{o|a}.",
     "tip": "Who wears the jacket? Boh → -ti. Mettersi (-ersi) → mettiti."
    },
    {
     "pre": "Stasera Boh va alla festa. Diverti",
     "post": "",
     "o": [
      "mi",
      "ti"
     ],
     "a": 1,
     "why": "Divertiti: Boh diverte sé stess{o|a}.",
     "tip": "Boh has fun {himself|herself} → -ti. Divertirsi (-irsi) → divertiti."
    },
    {
     "pre": "Durante la festa vuoi un messaggio da Boh. Scrivi",
     "post": "",
     "o": [
      "mi",
      "ti"
     ],
     "a": 0,
     "why": "Scrivimi: il messaggio arriva a me.",
     "tip": "Where does the message go? To YOU → -mi. MI = ME."
    },
    {
     "pre": "Boh fa tante foto. Tu vuoi vedere le foto. Manda",
     "post": "",
     "o": [
      "mi",
      "ti"
     ],
     "a": 0,
     "why": "Mandami: le foto arrivano a me.",
     "tip": "The photos travel to YOU → -mi."
    }
   ],
   "rs": [
    {
     "b": "Fa freddo e non ho una giacca.",
     "o": [
      "Mettiti la mia giacca!",
      "Mettimi la giacca!",
      "Sbrigati!"
     ],
     "a": 0,
     "why": "Mettiti: Boh mette la giacca su di sé.",
     "tip": "Boh is cold, not you. Boh puts the jacket on {himself|herself} → -ti."
    },
    {
     "b": "Sono timid{o|a}.",
     "o": [
      "Svegliati!",
      "Rilassati, sei simpatic{o|a}!",
      "Rilassami!"
     ],
     "a": 1,
     "why": "Rilassati: Boh deve stare tranquill{o|a}.",
     "tip": "Boh is the shy one, so Boh relaxes {himself|herself} → -ti."
    },
    {
     "b": "Ho paura di stare sol{o|a}.",
     "o": [
      "Scriviti!",
      "Vestiti!",
      "Scrivimi e vengo alla festa!"
     ],
     "a": 2,
     "why": "Scrivimi: Boh scrive a te e tu vai alla festa.",
     "tip": "Boh doesn't write to {himself|herself}. The message comes to YOU → -mi."
    },
    {
     "b": "Voglio fare tante foto!",
     "o": [
      "Mandami le foto!",
      "Mandati le foto!",
      "Calmati!"
     ],
     "a": 0,
     "why": "Mandami: le foto arrivano a te.",
     "tip": "Where do the photos go? To you → -mi."
    }
   ],
   "sc": {
    "parts": [
     "Car{o|a} Boh,\nvai alla festa e ",
     {
      "a": "divertiti"
     },
     "! ",
     {
      "a": "mettiti",
      "c": 1
     },
     " la mia giacca blu. Se sei sol{o|a}, ",
     {
      "a": "scrivimi"
     },
     "!"
    ],
    "bank": [
     "divertiti",
     "mettiti",
     "scrivimi",
     "svegliati",
     "scriviti",
     "mettimi",
     "divertimi"
    ]
   },
   "scHint": "For each blank, ask: who gets the action? The action goes to me → -mi. Boh does it to {himself|herself} → -ti. Watch the traps: they are the same verb with the wrong ending.",
   "ruleTitle": "Regola: -mi o -ti?",
   "rule": "Take the <b>tu</b> command and attach the pronoun. It becomes one word.<br><b>-mi</b> = the action goes to ME: chiama + mi = <b>chiamami</b>, scrivi + mi = <b>scrivimi</b>.<br><b>-ti</b> = the person does it to {himself|herself}: calma + ti = <b>calmati</b>, alza + ti = <b>alzati</b>.<br>Ask yourself: <b>who gets the action?</b> Infinitive in -arsi / -ersi / -irsi → the command ends in <b>-ti</b>."
  },
  {
   "id": "telefono",
   "title": "Il telefono",
   "bl": "Mi o Ti?",
   "hook": "Ho perso il telefono in centro!",
   "letter": [
    "Ciao!",
    "Oggi è una [[giornata|un giorno]] terribile! [[Ho perso|non trovo più]] il telefono [[in centro|nel centro della città]]. Non posso chiamare la mia famiglia e sono molto [[agitat{o|a}|nervos{o|a}]]. [[Corro|vado molto veloce]] [[dappertutto|in ogni posto]] e [[cerco|provo a trovare]] il telefono nei [[negozi|posti dove compri le cose]]. Sono [[stanchissim{o|a}|molto, molto stanc{o|a}]]!"
   ],
   "sign": "Boh",
   "q": {
    "t": "Che cosa ha perso Boh?",
    "o": [
     "La giacca.",
     "Il telefono.",
     "Lo zaino."
    ],
    "a": 1,
    "tip": "Find the words ho perso in the letter. What comes right after them?"
   },
   "mt": [
    {
     "pre": "Boh corre dappertutto e non si ferma mai. Ferma",
     "post": "",
     "o": [
      "mi",
      "ti"
     ],
     "a": 1,
     "why": "Fermati: Boh ferma sé stess{o|a}.",
     "tip": "Boh is the one running, so Boh stops {himself|herself} → -ti. Fermarsi (-arsi) → fermati."
    },
    {
     "pre": "Boh è stanchissim{o|a}, ma resta in piedi. Siedi",
     "post": "",
     "o": [
      "mi",
      "ti"
     ],
     "a": 1,
     "why": "Siediti: Boh siede sé stess{o|a}.",
     "tip": "Sedersi (-ersi) → siediti. Boh sits {himself|herself} down."
    },
    {
     "pre": "Tu vuoi sapere dove è stat{o|a} Boh oggi. Spiega",
     "post": "",
     "o": [
      "mi",
      "ti"
     ],
     "a": 0,
     "why": "Spiegami: Boh racconta a me.",
     "tip": "The information comes to YOU → -mi."
    },
    {
     "pre": "Boh trova il telefono di un amico. Tu aspetti la telefonata. Chiama",
     "post": "",
     "o": [
      "mi",
      "ti"
     ],
     "a": 0,
     "why": "Chiamami: la telefonata arriva a me.",
     "tip": "You are waiting for the call. It comes to you → -mi."
    }
   ],
   "rs": [
    {
     "b": "Corro dappertutto!",
     "o": [
      "Fermami!",
      "Fermati un momento!",
      "Divertiti!"
     ],
     "a": 1,
     "why": "Fermati: Boh deve stare ferm{o|a}.",
     "tip": "Boh is running, so Boh has to stop {himself|herself} → -ti. Fermami would mean YOU are the one running."
    },
    {
     "b": "Sono stanchissim{o|a}!",
     "o": [
      "Siediti e respira!",
      "Alzati!",
      "Sbrigati!"
     ],
     "a": 0,
     "why": "Siediti: Boh è stanc{o|a}, deve sedersi.",
     "tip": "Tired → sit and breathe. Alzati and Sbrigati are the opposite of resting."
    },
    {
     "b": "Non so dove l'ho perso.",
     "o": [
      "Vestiti!",
      "Spiegati!",
      "Spiegami dove sei stat{o|a} oggi!"
     ],
     "a": 2,
     "why": "Spiegami: Boh racconta a te la giornata.",
     "tip": "You want the information, so it comes to you → -mi."
    },
    {
     "b": "Non posso chiamare la mia famiglia.",
     "o": [
      "Chiamami dal telefono di un amico!",
      "Chiamati!",
      "Svegliati!"
     ],
     "a": 0,
     "why": "Chiamami: Boh chiama te, e tu aiuti.",
     "tip": "You are the one who can help, so the call comes to you → -mi."
    }
   ],
   "sc": {
    "parts": [
     "Car{o|a} Boh,\n",
     {
      "a": "fermati",
      "c": 1
     },
     " e ",
     {
      "a": "siediti"
     },
     " un momento. Poi ",
     {
      "a": "chiamami"
     },
     " dal telefono di un amico. Ti aiuto io!"
    ],
    "bank": [
     "fermati",
     "siediti",
     "chiamami",
     "alzati",
     "chiamati",
     "fermami",
     "spiegati"
    ]
   },
   "scHint": "For each blank, ask: who gets the action? The action goes to me → -mi. Boh does it to {himself|herself} → -ti. Watch the traps: they are the same verb with the wrong ending.",
   "ruleTitle": "Regola: -mi o -ti?",
   "rule": "Take the <b>tu</b> command and attach the pronoun. It becomes one word.<br><b>-mi</b> = the action goes to ME: chiama + mi = <b>chiamami</b>, scrivi + mi = <b>scrivimi</b>.<br><b>-ti</b> = the person does it to {himself|herself}: calma + ti = <b>calmati</b>, alza + ti = <b>alzati</b>.<br>Ask yourself: <b>who gets the action?</b> Infinitive in -arsi / -ersi / -irsi → the command ends in <b>-ti</b>."
  },
  {
   "id": "prova1",
   "title": "Prova di ripasso",
   "bl": "Ripasso · 14 domande",
   "review": true,
   "mt": [
    {
     "pre": "La tua amica è molto stressata per il test. Rilassa",
     "post": "",
     "o": [
      "mi",
      "ti"
     ],
     "a": 1,
     "why": "Rilassati: lei rilassa sé stessa.",
     "tip": "Who is stressed? Your friend. She does it to herself → -ti. Rilassarsi (-arsi) → rilassati."
    },
    {
     "pre": "Parli con tuo fratello, ma lui guarda il telefono. Guarda",
     "post": "",
     "o": [
      "mi",
      "ti"
     ],
     "a": 0,
     "why": "Guardami: lui guarda me.",
     "tip": "His eyes should go to YOU → -mi. MI = ME."
    },
    {
     "pre": "Il tuo amico è lentissimo e il bus parte! Sbriga",
     "post": "",
     "o": [
      "mi",
      "ti"
     ],
     "a": 1,
     "why": "Sbrigati: lui si sbriga.",
     "tip": "He has to hurry himself → -ti. Sbrigarsi (-arsi) → sbrigati."
    },
    {
     "pre": "La tua amica è a Roma. Tu vuoi vedere le foto. Manda",
     "post": "",
     "o": [
      "mi",
      "ti"
     ],
     "a": 0,
     "why": "Mandami: le foto arrivano a me.",
     "tip": "The photos travel to YOU → -mi."
    },
    {
     "pre": "Sono le otto e tuo fratello è ancora a letto. Alza",
     "post": "",
     "o": [
      "mi",
      "ti"
     ],
     "a": 1,
     "why": "Alzati: lui alza sé stesso dal letto.",
     "tip": "Alzarsi (-arsi) → alzati. He gets himself up."
    },
    {
     "pre": "Il tuo migliore amico parte per un anno. Tu sei triste. Abbraccia",
     "post": "",
     "o": [
      "mi",
      "ti"
     ],
     "a": 0,
     "why": "Abbracciami: l'abbraccio arriva a me.",
     "tip": "New verb, same rule: the hug comes to YOU → -mi."
    },
    {
     "pre": "La tua amica è ancora in pigiama e la festa comincia! Vesti",
     "post": "",
     "o": [
      "mi",
      "ti"
     ],
     "a": 1,
     "why": "Vestiti: lei veste sé stessa.",
     "tip": "She puts clothes on herself. Vestirsi (-irsi) → vestiti."
    },
    {
     "pre": "Vai al cinema con un amico, ma sei in ritardo. Aspetta",
     "post": "",
     "o": [
      "mi",
      "ti"
     ],
     "a": 0,
     "why": "Aspettami: lui aspetta me.",
     "tip": "He waits for YOU → -mi. Aspettare has no -si."
    }
   ],
   "rs": [
    {
     "b": "Il tuo amico non trova la strada per casa tua.",
     "o": [
      "Chiamami!",
      "Chiamati!",
      "Alzati!"
     ],
     "a": 0,
     "why": "Chiamami: la telefonata arriva a me.",
     "tip": "The call comes to YOU → -mi. Chiamati points the action back at him."
    },
    {
     "b": "La tua amica è molto stressata.",
     "o": [
      "Rilassami!",
      "Rilassati!",
      "Sbrigati!"
     ],
     "a": 1,
     "why": "Rilassati: lei rilassa sé stessa.",
     "tip": "She is the stressed one → -ti."
    },
    {
     "b": "Tuo fratello guarda il telefono mentre parli.",
     "o": [
      "Guardati!",
      "Divertiti!",
      "Guardami quando parlo!"
     ],
     "a": 2,
     "why": "Guardami: lui guarda me.",
     "tip": "His eyes should come to YOU → -mi."
    },
    {
     "b": "Il film comincia fra due minuti!",
     "o": [
      "Sbrigati!",
      "Riposati!",
      "Sbrigami!"
     ],
     "a": 0,
     "why": "Sbrigati: si sbriga lui.",
     "tip": "No time! He hurries himself → -ti."
    },
    {
     "b": "La tua amica parte per Roma domani.",
     "o": [
      "Siediti!",
      "Mandami le foto!",
      "Mandati le foto!"
     ],
     "a": 1,
     "why": "Mandami: le foto arrivano a me.",
     "tip": "The photos come to YOU → -mi."
    },
    {
     "b": "Il tuo amico ha una brutta giornata.",
     "o": [
      "Siediti e parliamo.",
      "Sbrigati!",
      "Svegliami!"
     ],
     "a": 0,
     "why": "Siediti: lui si siede.",
     "tip": "Help him slow down: he sits himself down → -ti."
    }
   ]
  },
  {
   "id": "futuro1",
   "title": "Fra un anno",
   "bl": "Ripasso",
   "hook": "Fra un anno sarò all'università!",
   "letter": [
    "Ciao!",
    "Quest'anno sono all'[[ultimo anno|la classe finale]] di [[liceo|la scuola superiore]]. [[Fra un anno|tra dodici mesi]] [[sarò|futuro di essere (io)]] all'università a Bologna! [[Studierò|futuro di studiare (io)]] economia e [[abiterò|futuro di abitare (io)]] con due amici. Il weekend [[lavorerò|futuro di lavorare (io)]] in una pizzeria per pagare l'[[affitto|i soldi per la casa ogni mese]]. Sono un po' nervos{o|a}... E tu? Dove [[sarai|futuro di essere (tu)]] fra un anno?"
   ],
   "sign": "A presto, Boh",
   "q": {
    "t": "Dove sarà Boh fra un anno?",
    "o": [
     "All'università a Bologna.",
     "Al liceo.",
     "In una pizzeria a Napoli."
    ],
    "a": 0,
    "tip": "Find fra un anno in the letter and read that sentence."
   },
   "mt": [
    {
     "pre": "Oggi io",
     "post": "al liceo.",
     "o": [
      "sono",
      "sarò"
     ],
     "a": 0,
     "why": "Oggi → presente: sono.",
     "tip": "Clue word: oggi. Oggi and adesso = now, so no future."
    },
    {
     "pre": "Fra un anno io",
     "post": "all'università.",
     "o": [
      "sono",
      "sarò"
     ],
     "a": 1,
     "why": "Fra un anno → futuro: sarò.",
     "tip": "Clue word: fra un anno = the future. The io form of the future ends in -rò."
    },
    {
     "pre": "Adesso",
     "post": "il sabato.",
     "o": [
      "lavoro",
      "lavorerò"
     ],
     "a": 0,
     "why": "Adesso → presente: lavoro.",
     "tip": "Clue word: adesso = now. Present, not future."
    },
    {
     "pre": "Fra un anno",
     "post": "economia.",
     "o": [
      "studio",
      "studierò"
     ],
     "a": 1,
     "why": "Fra un anno → futuro: studierò.",
     "tip": "Fra + a time = future → -rò."
    }
   ],
   "rs": [
    {
     "b": "Dove sarai fra un anno?",
     "o": [
      "Sarò all'università.",
      "Sono al liceo.",
      "Sarai all'università."
     ],
     "a": 0,
     "why": "Sarò: rispondi con io.",
     "tip": "Boh asks with -rai (tu). You answer about yourself with -rò (io). Sono is the present, and the question is about fra un anno."
    },
    {
     "b": "Lavorerai fra un anno?",
     "o": [
      "Sì, lavorerai in un negozio.",
      "Sì, lavorerò in un negozio.",
      "Sì, lavoro adesso."
     ],
     "a": 1,
     "why": "Lavorerò: rispondi con io.",
     "tip": "Boh asks with -rai (tu). You answer about yourself with -rò (io)."
    },
    {
     "b": "Dove abiterai?",
     "o": [
      "Abiterai con la tua famiglia.",
      "Abito qui adesso.",
      "Abiterò con la mia famiglia."
     ],
     "a": 2,
     "why": "Abiterò: rispondi con io.",
     "tip": "Boh asks with -rai (tu). You answer about yourself with -rò (io). Watch the possessive too: la MIA famiglia."
    },
    {
     "b": "Studierai all'università?",
     "o": [
      "Sì, studierò biologia!",
      "Sì, studierai biologia!",
      "Studio la storia oggi."
     ],
     "a": 0,
     "why": "Studierò: rispondi con io.",
     "tip": "Boh asks with -rai (tu). You answer about yourself with -rò (io)."
    }
   ],
   "sc": {
    "parts": [
     "Car{o|a} Boh,\nfra un anno ",
     {
      "a": "sarò"
     },
     " a New York. ",
     {
      "a": "lavorerò",
      "c": 1
     },
     " in un ufficio e ",
     {
      "a": "abiterò"
     },
     " con mia sorella. In bocca al lupo!"
    ],
    "bank": [
     "sarò",
     "lavorerò",
     "abiterò",
     "sono",
     "sarai",
     "lavoro",
     "abiterai"
    ]
   },
   "pa": [
    "Partner A asks: <b>Dove sarai fra un anno?</b>",
    "Partner B answers with <b>sarò</b> + one more chunk: <i>Sarò all'università. Studierò...</i>",
    "Switch roles.",
    "Challenge: add <b>lavorerò</b> or <b>abiterò</b>."
   ],
   "plan": false,
   "scHint": "Telling your plan (io) → -rò. Asking a friend (tu) → -rai. A time in the future (fra un anno) → no present tense.",
   "ruleTitle": "Ripasso: il futuro",
   "rule": "Telling your plan (io) → <b>-rò</b>. Asking a friend (tu) → <b>-rai</b>.<br>-are verbs change a → e: lavorare → lavorer<b>ò</b>.<br>The short ones: sarò, avrò, farò, andrò, vivrò.<br>A time in the future (fra un anno) → no present tense."
  },
  {
   "id": "futuroplan",
   "title": "Il mio futuro",
   "bl": "Ripasso",
   "hook": "Ecco il mio piano. E il tuo?",
   "letter": [
    "Ciao!",
    "Grazie delle tue risposte! [[Ecco|guarda, questo è]] il mio [[piano|progetto]]: fra un anno sarò all'università. Fra cinque anni avrò un lavoro a Milano. Fra dieci anni vivrò in una casa con un [[giardino|uno spazio verde vicino alla casa]] e farò un viaggio [[ogni anno|tutti gli anni]]. Adesso [[tocca a te|è il tuo turno]]: fai il tuo piano!"
   ],
   "sign": "Boh",
   "q": {
    "t": "Dove vivrà Boh fra dieci anni?",
    "o": [
     "Con due amici a Bologna.",
     "In una casa con un giardino.",
     "In un piccolo appartamento."
    ],
    "a": 1,
    "tip": "Find fra dieci anni in the letter and read that sentence."
   },
   "mt": [
    {
     "pre": "Fra un anno io",
     "post": "all'università.",
     "o": [
      "sarò",
      "sono"
     ],
     "a": 0,
     "why": "Fra un anno → futuro: sarò.",
     "tip": "Fra un anno = future. Io → -rò."
    },
    {
     "pre": "Fra cinque anni",
     "post": "un lavoro a Milano.",
     "o": [
      "avrai",
      "avrò"
     ],
     "a": 1,
     "why": "Racconti il tuo piano → avrò.",
     "tip": "You're telling your own plan (io) → -rò."
    },
    {
     "pre": "E tu, dove",
     "post": "?",
     "o": [
      "vivrai",
      "vivrò"
     ],
     "a": 0,
     "why": "E tu? → vivrai?",
     "tip": "E tu = asking a friend → -rai."
    },
    {
     "pre": "Fra dieci anni",
     "post": "un viaggio ogni anno.",
     "o": [
      "farò",
      "faccio"
     ],
     "a": 0,
     "why": "Fra dieci anni → futuro: farò.",
     "tip": "Fra dieci anni = future, so no present tense."
    }
   ],
   "rs": [
    {
     "b": "Andrai all'università fra un anno?",
     "o": [
      "No, entrerò nell'esercito.",
      "No, entrerai nell'esercito.",
      "No, entro in classe adesso."
     ],
     "a": 0,
     "why": "Entrerò: rispondi con io. Ogni strada va bene!",
     "tip": "Boh asks with -rai (tu). You answer about yourself with -rò (io)."
    },
    {
     "b": "Cosa farai dopo il liceo?",
     "o": [
      "Passerai un anno in Italia!",
      "Passo l'estate a casa.",
      "Passerò un anno in Italia!"
     ],
     "a": 2,
     "why": "Passerò: rispondi con io.",
     "tip": "Boh asks with -rai (tu). You answer about yourself with -rò (io)."
    },
    {
     "b": "Avrai il tuo business?",
     "o": [
      "Sì, avrò il mio business!",
      "Sì, avrai il tuo business!",
      "Sì, ho il mio business."
     ],
     "a": 0,
     "why": "Avrò: rispondi con io.",
     "tip": "Boh asks with -rai (tu). You answer about yourself with -rò (io). Watch the possessive too: il MIO business."
    },
    {
     "b": "Sarai felice?",
     "o": [
      "Sì, sarai felice.",
      "Sì, sarò felice!",
      "Sì, sono a scuola."
     ],
     "a": 1,
     "why": "Sarò: rispondi con io.",
     "tip": "Boh asks with -rai (tu). You answer about yourself with -rò (io)."
    }
   ],
   "pa": [
    "Partner A reads their plan: <b>Fra un anno... Fra cinque anni... Fra dieci anni...</b>",
    "Partner B asks one follow-up question with <b>-rai</b>: <i>Dove vivrai? Cosa farai?</i>",
    "Partner A answers with <b>-rò</b>. Then switch.",
    "Challenge: say your plan without looking."
   ],
   "plan": true,
   "scHint": "Telling your plan (io) → -rò. Asking a friend (tu) → -rai. A time in the future (fra un anno) → no present tense.",
   "ruleTitle": "Ripasso: il futuro",
   "rule": "Telling your plan (io) → <b>-rò</b>. Asking a friend (tu) → <b>-rai</b>.<br>-are verbs change a → e: lavorare → lavorer<b>ò</b>.<br>The short ones: sarò, avrò, farò, andrò, vivrò.<br>A time in the future (fra un anno) → no present tense."
  }
 ],
 "plan": [
  {
   "k": "y1",
   "lbl": "Fra un anno...",
   "o": [
    "sarò all’università",
    "lavorerò in un negozio",
    "andrò a una scuola professionale",
    "entrerò nell’esercito",
    "passerò un anno in Italia"
   ]
  },
  {
   "k": "y5",
   "lbl": "Fra cinque anni...",
   "o": [
    "avrò un lavoro",
    "finirò l’università",
    "abiterò in una grande città",
    "avrò una famiglia"
   ]
  },
  {
   "k": "y10",
   "lbl": "Fra dieci anni...",
   "o": [
    "vivrò vicino al mare",
    "avrò una casa con giardino",
    "farò un viaggio ogni anno",
    "andrò in Giappone"
   ]
  }
 ]
});
