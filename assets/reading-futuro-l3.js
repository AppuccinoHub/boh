/* =====================================================================
   Boh · Aiutami, Level 3: "Fra dieci anni" (the future). A reading practice unit.
   THIS FILE IS THE WHOLE UNIT'S CONTENT. Edit words here; no other file needs to change.
   Source: project draft "boh-aiutami-level3-future-draft-2026-10-09". UNTESTED; vocabulary not yet checked against Level 3.
   Reading guide
   - letter = paragraphs. [[word|meaning]] = tap for a short meaning. {o|a} = ending that follows the student's Boh.
   - q  = one question about the letter (English, so no new grammar). a = index of the right answer.
   - mt = pick the chunk: pre ___ post, o = two choices, a = right index, why = shown when right, tip = shown when wrong.
   - rs = Boh asks (b); the student picks the best reply.
   - pay = Boh Cashi, first time only (placeholders: Assunta decides).
   Created by Assunta Scotto, 2026. Not for redistribution.
   ===================================================================== */
BohReading.register({
  id: 'futuro-l3', level: 'italiano3', title: 'Fra dieci anni', sub: 'Aiutami · reading practice',
  home: '../italiano3/', backLabel: 'Level 3',
  intro: 'Boh scrive lettere sul futuro. Leggi, capisci, rispondi.',
  pay: { q: 3, m: 2, r: 2, letter: 10 },
  letters: [
    { id: 'l1', title: 'Fra un anno', bl: 'Cosa studierai?', hook: 'Fra un anno studierò all’università!',
      letter: ['Ciao!',
        'Quest’anno sono all’[[ultimo anno|la classe finale]] di [[liceo|la scuola superiore]]. [[Fra un anno|tra dodici mesi]] [[studierò|futuro di studiare (io)]] economia all’università. [[Abiterò|futuro di abitare (io)]] con due amici e il weekend [[lavorerò|futuro di lavorare (io)]] in una pizzeria. [[Ascolterò|futuro di ascoltare (io)]] musica italiana ogni giorno! Sono un po’ nervos{o|a}... E tu? Cosa [[studierai|futuro di studiare (tu)]] fra un anno? Dove [[abiterai|futuro di abitare (tu)]]?'],
      sign: 'A presto, Boh',
      q: { t: 'What will Boh study next year?', o: ['Economics.', 'Music.', 'History.'], a: 0, tip: 'Find “fra un anno” and read the next words.' },
      mt: [
        { pre: 'Oggi io', post: 'al liceo.', o: ['studio', 'studierò'], a: 0, why: 'Oggi → presente: studio.', tip: 'Clue word: oggi = now, so no future.' },
        { pre: 'Fra un anno io', post: 'economia.', o: ['studio', 'studierò'], a: 1, why: 'Fra un anno → futuro: studierò.', tip: 'Fra un anno = the future. Io → -ò.' },
        { pre: 'Adesso', post: 'il sabato.', o: ['lavoro', 'lavorerò'], a: 0, why: 'Adesso → presente: lavoro.', tip: 'Clue word: adesso = now. Present, not future.' },
        { pre: 'Fra un anno io', post: 'con due amici.', o: ['abito', 'abiterò'], a: 1, why: 'Fra un anno → futuro: abiterò.', tip: 'Fra + a time = future → -erò for -are verbs.' }],
      rs: [
        { b: 'Cosa studierai fra un anno?', o: ['Studierò biologia.', 'Studierai biologia.', 'Studio storia oggi.'], a: 0, why: 'Studierò: rispondi con io.', tip: 'Boh asks with -ai (tu). You answer about yourself with -ò (io).' },
        { b: 'Dove abiterai?', o: ['Abito qui adesso.', 'Abiterò con la mia famiglia.', 'Abiterai con la tua famiglia.'], a: 1, why: 'Abiterò: rispondi con io.', tip: 'You answer about yourself: -ò. Watch the possessive: la MIA famiglia.' },
        { b: 'Lavorerai fra un anno?', o: ['Sì, lavorerò in un negozio.', 'Sì, lavorerai in un negozio.', 'Sì, lavoro adesso.'], a: 0, why: 'Lavorerò: rispondi con io.', tip: 'Boh asks with -ai (tu). You answer with -ò (io).' },
        { b: 'Ascolterai musica?', o: ['Sì, ascolti musica.', 'Sì, ascolterai musica.', 'Sì, ascolterò musica italiana!'], a: 2, why: 'Ascolterò: rispondi con io.', tip: 'Boh asks with -ai (tu). You answer with -ò (io).' }],
      ruleTitle: 'Il futuro: i verbi in -are',
      rule: 'Take the infinitive, drop the final <b>-e</b>, change <b>-are</b> to <b>-er-</b>, add the ending.<br>Telling about yourself (io) → <b>-ò</b>: lavorerò.<br>Asking a friend (tu) → <b>-ai</b>: lavorerai.<br>Clue words: fra un anno, domani = future. Oggi, adesso = now.' },

    { id: 'l2', title: 'Fra cinque anni', bl: 'Cosa scriverai?', hook: 'Fra cinque anni finirò l’università!',
      letter: ['Ciao!',
        '[[Fra cinque anni|tra cinque anni]] [[finirò|futuro di finire (io)]] l’università. Che bello! [[Prenderò|futuro di prendere (io)]] il treno per andare in [[ufficio|il posto dove lavori]] e [[partirò|futuro di partire (io)]] per le vacanze ogni estate. [[Scriverò|futuro di scrivere (io)]] tante [[cartoline|lettere con una foto, dai viaggi]] agli amici. Non so ancora tutto, ma ho tanti [[sogni|desideri per il futuro]]! E tu? Cosa [[scriverai|futuro di scrivere (tu)]] e dove [[partirai|futuro di partire (tu)]] fra cinque anni?'],
      sign: 'Ciao ciao, Boh',
      q: { t: 'What will Boh write to friends?', o: ['Postcards.', 'Emails.', 'Poems.'], a: 0, tip: 'Find “scriverò” in the letter. What comes after it?' },
      mt: [
        { pre: 'Fra cinque anni io', post: 'l’università.', o: ['finisco', 'finirò'], a: 1, why: 'Fra cinque anni → futuro: finirò.', tip: 'Fra cinque anni = future. -ire verbs: finire → finirò.' },
        { pre: 'Adesso', post: 'un libro.', o: ['scrivo', 'scriverò'], a: 0, why: 'Adesso → presente: scrivo.', tip: 'Adesso = now. Present, not future.' },
        { pre: 'Ogni estate io', post: 'per l’Italia.', o: ['parto', 'partirò'], a: 1, why: 'Fra cinque anni, ogni estate → futuro: partirò.', tip: 'Boh talks about the future in this letter. Partire → partirò.' },
        { pre: 'Domani io', post: 'il treno.', o: ['prendo', 'prenderò'], a: 1, why: 'Domani → futuro: prenderò.', tip: 'Domani = tomorrow = future. Prendere → prenderò.' }],
      rs: [
        { b: 'Quando finirai l’università?', o: ['Finirò fra cinque anni.', 'Finirai fra cinque anni.', 'Finisco oggi.'], a: 0, why: 'Finirò: rispondi con io.', tip: 'Boh asks with -ai (tu). You answer with -ò (io).' },
        { b: 'Cosa scriverai agli amici?', o: ['Scriverai una cartolina.', 'Scriverò una cartolina.', 'Scrivo un’e-mail adesso.'], a: 1, why: 'Scriverò: rispondi con io.', tip: 'Boh asks with -ai (tu). You answer with -ò (io).' },
        { b: 'Partirai in estate?', o: ['Sì, partirò per l’Italia!', 'Sì, parti per l’Italia!', 'Sì, partirai per l’Italia.'], a: 0, why: 'Partirò: rispondi con io.', tip: 'Boh asks with -ai (tu). You answer with -ò (io).' },
        { b: 'Prenderai il treno?', o: ['No, prenderò la macchina.', 'No, prenderai la macchina.', 'No, prendo il treno oggi.'], a: 0, why: 'Prenderò: rispondi con io.', tip: 'Boh asks with -ai (tu). You answer with -ò (io).' }],
      ruleTitle: 'Il futuro: -ere e -ire',
      rule: '<b>-ere</b> and <b>-ire</b> verbs keep their vowel: prendere → prender<b>ò</b>, finire → finir<b>ò</b>.<br>The endings are the same: <b>-ò</b> (io), <b>-ai</b> (tu).<br>Only <b>-are</b> changes its vowel: lavorare → lavorer<b>ò</b>.' },

    { id: 'l3', title: 'Fra dieci anni', bl: 'Dove sarai?', hook: 'E tu? Dove sarai fra dieci anni?',
      letter: ['Ciao!',
        '[[Fra dieci anni|tra dieci anni]] [[avrò|futuro di avere (io)]] ventotto anni. [[Sarò|futuro di essere (io)]] a Milano? [[Farò|futuro di fare (io)]] un lavoro creativo? [[Andrò|futuro di andare (io)]] in Giappone? [[Vivrò|futuro di vivere (io)]] vicino al mare? Avrò [[figli|bambini]]? Non lo so! Adesso voglio sapere di te. Dove [[sarai|futuro di essere (tu)]] fra dieci anni? Cosa [[farai|futuro di fare (tu)]]? [[Avrai|futuro di avere (tu)]] una famiglia? Rispondi presto!'],
      sign: 'Un abbraccio, Boh',
      q: { t: 'What does Boh want to know?', o: ['Your birthday.', 'Your future in ten years.', 'Your homework.'], a: 1, tip: 'Look at Boh’s questions: dove sarai, cosa farai, avrai. What time do they talk about?' },
      mt: [
        { pre: 'Dove', post: 'fra dieci anni? (a friend)', o: ['sarò', 'sarai'], a: 1, why: 'Domanda a un amico → sarai?', tip: 'You are asking a friend (tu) → -ai.' },
        { pre: 'Io', post: 'a Boston.', o: ['sarò', 'sarai'], a: 0, why: 'Io → sarò.', tip: 'Io = telling about yourself → -ò.' },
        { pre: '', post: 'una famiglia? (a friend)', o: ['Avrò', 'Avrai'], a: 1, why: 'Domanda a un amico → Avrai?', tip: 'It is a question to a friend → -ai.' },
        { pre: 'Fra cinque anni io', post: 'in Giappone.', o: ['vado', 'andrò'], a: 1, why: 'Fra cinque anni → futuro: andrò.', tip: 'Andare has a short future stem: andr- + ò.' }],
      rs: [
        { b: 'Avrai figli?', o: ['Sì, avrai due figli.', 'Sì, avrò due figli.', 'Sì, ho due figli.'], a: 1, why: 'Avrò: rispondi con io.', tip: 'Boh asks with -ai (tu). You answer with -ò (io).' },
        { b: 'Dove vivrai?', o: ['Vivrò vicino al mare.', 'Vivrai vicino al mare.', 'Vivo vicino al mare.'], a: 0, why: 'Vivrò: rispondi con io.', tip: 'Boh asks with -ai (tu). You answer with -ò (io).' },
        { b: 'Cosa farai?', o: ['Ho lavorato in un ospedale.', 'Lavorerai in un ospedale.', 'Lavorerò in un ospedale.'], a: 2, why: 'Lavorerò: rispondi con io.', tip: 'Boh asks with -ai (tu). You answer with -ò (io). “Ho lavorato” is the past.' },
        { b: 'Adesso chiedi a Boh!', o: ['Dove sarò fra dieci anni?', 'Dove sarai fra dieci anni?', 'Dove sei adesso?'], a: 1, why: 'Tu fai la domanda → sarai?', tip: 'Now YOU ask Boh a question about the future → -ai.' }],
      ruleTitle: 'Il futuro: i verbi irregolari',
      rule: 'Some verbs have a short stem, but the endings never change:<br>essere → <b>sar-</b>ò, avere → <b>avr-</b>ò, fare → <b>far-</b>ò, andare → <b>andr-</b>ò, vivere → <b>vivr-</b>ò.<br>Add <b>-ò</b> (io) or <b>-ai</b> (tu).' },

    { id: 'l4', title: 'Il mio futuro', bl: 'Il mio piano', plan: true, hook: 'Ecco il mio piano. E il tuo?',
      letter: ['Ciao!',
        'Grazie delle tue risposte! [[Ecco|guarda, questo è]] il mio [[piano|progetto]]: fra un anno studierò all’università. Fra cinque anni finirò e avrò un lavoro a Milano. Fra dieci anni vivrò in una casa con un [[giardino|uno spazio verde vicino alla casa]] e farò un viaggio [[ogni anno|tutti gli anni]]. Ora [[tocca a te|è il tuo turno]]: fai il tuo piano!'],
      sign: 'Boh',
      q: { t: 'Where will Boh live in ten years?', o: ['With two friends in Bologna.', 'In a house with a garden.', 'In a small apartment.'], a: 1, tip: 'Find “fra dieci anni” in the letter and read that sentence.' },
      mt: [
        { pre: 'Fra un anno io', post: 'all’università.', o: ['studierò', 'studio'], a: 0, why: 'Fra un anno → futuro: studierò.', tip: 'Fra un anno = future. Io → -ò.' },
        { pre: 'Fra cinque anni io', post: 'un lavoro a Milano.', o: ['avrai', 'avrò'], a: 1, why: 'Racconti il tuo piano → avrò.', tip: 'You are telling your own plan (io) → -ò.' },
        { pre: 'E tu, dove', post: '?', o: ['vivrai', 'vivrò'], a: 0, why: 'E tu? → vivrai?', tip: 'E tu = asking a friend → -ai.' },
        { pre: 'Fra dieci anni io', post: 'un viaggio ogni anno.', o: ['farò', 'faccio'], a: 0, why: 'Fra dieci anni → futuro: farò.', tip: 'Fra dieci anni = future, so no present tense.' }],
      rs: [
        { b: 'Cosa farai dopo il liceo?', o: ['Passerai un anno in Italia!', 'Passo l’estate a casa.', 'Passerò un anno in Italia!'], a: 2, why: 'Passerò: rispondi con io.', tip: 'Boh asks with -ai (tu). You answer with -ò (io).' },
        { b: 'Sarai felice?', o: ['Sì, sarai felice.', 'Sì, sarò felice!', 'Sì, sono a scuola.'], a: 1, why: 'Sarò: rispondi con io.', tip: 'Boh asks with -ai (tu). You answer with -ò (io).' },
        { b: 'Andrai all’università?', o: ['No, andrò a una scuola professionale.', 'No, andrai a scuola.', 'No, vado a scuola oggi.'], a: 0, why: 'Andrò: rispondi con io. Ogni strada va bene!', tip: 'Boh asks with -ai (tu). You answer with -ò (io).' },
        { b: 'Avrai il tuo business?', o: ['Sì, avrò il mio business!', 'Sì, avrai il tuo business!', 'Sì, ho il mio business.'], a: 0, why: 'Avrò: rispondi con io.', tip: 'You answer about yourself: -ò. Watch the possessive: il MIO business.' }],
      ruleTitle: 'Il futuro: ripasso',
      rule: 'Telling your plan (io) → <b>-ò</b>.<br>Asking a friend (tu) → <b>-ai</b>.<br>A time in the future (fra un anno, domani) → no present tense.<br>Short stems: sar-, avr-, far-, andr-, vivr-.' }
  ],
  plan: [
    { k: 'y1', lbl: 'Fra un anno...', o: ['sarò all’università', 'lavorerò in un negozio', 'studierò economia', 'partirò per l’Italia'] },
    { k: 'y5', lbl: 'Fra cinque anni...', o: ['finirò l’università', 'avrò un lavoro', 'abiterò in una grande città', 'prenderò il treno ogni giorno'] },
    { k: 'y10', lbl: 'Fra dieci anni...', o: ['vivrò vicino al mare', 'avrò una famiglia', 'farò un viaggio ogni anno', 'andrò in Giappone'] }
  ]
});
