/* =====================================================================
   Boh · "Domani vado" (Italiano 2): where I go tomorrow, and with whom.
   THIS FILE IS THE WHOLE LESSON'S CONTENT. Edit words here; no other file needs to change.
   Created by Assunta Scotto, 2026. Not for redistribution.

   Reading guide (same as lezione-inclasse.js)
   - en  = what the student reads in English.   it = the right answer, said out loud on every tap.
   - opts = the three answers shown (the right one must be in the list; the order is shuffled).
   - mem = the quick "how to remember it" line shown under the answer, right or wrong.
   - say = Prof. Lo So's lines before the answers appear: [pose, line]. Italian only, no English (her rule).
   - pay = Boh Cashi for that card (first time only). Harder parts pay more.

   Teacher notes (for Assunta, not shown to students)
   - Every place is taught as ONE memorized piece. No a + il / a + la rule is shown (Italiano 2 has not had preposizioni articolate).
   - Core pieces: in banca, in posta, in farmacia, in palestra, a scuola, a casa.
   - Optional "more places" cards (pay double): al cinema, al supermercato, alla stazione, dal dottore, da Marco, a Roma.
   - "vado" (I go) is new as a piece inside "Domani vado ...". It is not conjugated or tested on its own beyond choosing it.
   - Students only say the sentence; nothing is graded on a missed piece. A miss just brings the card back.
   ===================================================================== */
BohLezione.register({
  id: 'domanivado',
  level: 'italiano2',
  title: 'Domani vado',
  sub: 'Where am I going?',
  vocaroo: 'https://vocaroo.com',
  bonus: 5,                       // Boh Cashi for finishing a part

  sections: [

    /* ---------- PART 1 · THE FOUR PIECES (teach by showing the whole sentence first) ---------- */
    { id: 'pezzi', type: 'pick', label: 'I pezzi', en: 'The four pieces', pay: 2,
      cards: [
        { say: [['wave', 'Ciao! Domani vado in banca con mia madre.'], ['finger-up', 'Domani!']],
          en: 'tomorrow', it: 'Domani',
          opts: ['Domani', 'Ieri', 'Oggi'],
          mem: 'Domani = tomorrow. Say it: do-MAH-nee.' },
        { say: [['present', 'Domani vado in banca con mia madre.'], ['beckon', 'Vado!']],
          en: 'I go', it: 'vado',
          opts: ['vado', 'voglio', 'devo'],
          mem: 'Vado = I go. Voglio = I want. Same V, different job.' },
        { say: [['point-you', 'Domani vado in banca con mia madre.'], ['finger-up', 'In banca!']],
          en: 'to the bank', it: 'in banca',
          opts: ['in banca', 'in posta', 'in farmacia'],
          mem: 'Errands use IN: in banca, in posta, in farmacia. No extra word.' },
        { say: [['hands-heart', 'Domani vado in banca con mia madre.'], ['present', 'Con mia madre!']],
          en: 'with my mom', it: 'con mia madre',
          opts: ['con mia madre', 'con mio padre', 'con mia sorella'],
          mem: 'Con = with. Mia madre = my mom.' }
      ],
      /* optional harder cards: they pay double */
      levelUp: {
        offer: 'Want more places? Movie theater, doctor, Rome.',
        note: 'Learn each one as a single piece. They pay double.',
        pay: 4,
        cards: [
          { say: [['beckon', 'Più posti!'], ['present', 'Domani vado al cinema.']],
            en: 'to the movie theater', it: 'al cinema',
            opts: ['al cinema', 'al supermercato', 'alla stazione'],
            mem: 'Named places: learn the whole piece. Al cinema.' },
          { say: [['present', 'Domani vado al supermercato.']],
            en: 'to the supermarket', it: 'al supermercato',
            opts: ['al supermercato', 'al cinema', 'in palestra'],
            mem: 'Al supermercato: one piece. Do not take it apart.' },
          { say: [['point-you', 'Domani vado alla stazione.']],
            en: 'to the train station', it: 'alla stazione',
            opts: ['alla stazione', 'al cinema', 'in posta'],
            mem: 'Alla stazione: one piece. It sounds like “stazione”, station.' },
          { say: [['present', 'Domani vado dal dottore.']],
            en: 'to the doctor', it: 'dal dottore',
            opts: ['dal dottore', 'da Marco', 'in farmacia'],
            mem: 'Going to a person: dal dottore, da Marco.' },
          { say: [['point-you', 'Domani vado da Marco.']],
            en: 'to Marco’s house', it: 'da Marco',
            opts: ['da Marco', 'a Roma', 'a casa'],
            mem: 'Da Marco = to Marco’s place.' },
          { say: [['finger-up', 'Roma è una città. Domani vado a Roma.']],
            en: 'to Rome', it: 'a Roma',
            opts: ['a Roma', 'in banca', 'a scuola'],
            mem: 'A city is a tiny bullseye: you throw a dart AT it. A Roma.' }
        ]
      } },

    /* ---------- PART 2 · LISTEN AND MATCH (the six core places) ---------- */
    { id: 'abbina', type: 'match', label: 'Ascolta e abbina', en: 'Listen and match', pay: 5,
      say: ['listen', 'Ascolta: sei posti.'],
      pairs: [
        ['in banca', 'to the bank'],
        ['in posta', 'to the post office'],
        ['in farmacia', 'to the pharmacy'],
        ['in palestra', 'to the gym'],
        ['a scuola', 'to school'],
        ['a casa', 'home']
      ] },

    /* ---------- PART 3 · LISTEN AND PICK THE MEANING ---------- */
    { id: 'frase', type: 'pick', label: 'Ascolta', en: 'Listen and pick', pay: 2, hear: true,
      cards: [
        { say: [['listen', 'Ascolta.']],
          it: 'Domani vado in banca con mia madre.', en: 'Tomorrow I go to the bank with my mom.',
          opts: ['Tomorrow I go to the bank with my mom.', 'Tomorrow I go to the bank with my dad.', 'Tomorrow I go to the post office with my mom.'],
          mem: 'Domani vado in banca con mia madre. This is the one to say out loud.' },
        { say: [['listen', 'Ancora.']],
          it: 'Stasera vado in palestra con mia sorella.', en: 'Tonight I go to the gym with my sister.',
          opts: ['Tonight I go to the gym with my sister.', 'Tonight I go to school with my sister.', 'Tomorrow I go to the gym with my sister.'],
          mem: 'Stasera = tonight.' },
        { say: [['listen', 'Ascolta bene.']],
          it: 'Sabato vado a casa con mio fratello.', en: 'On Saturday I go home with my brother.',
          opts: ['On Saturday I go home with my brother.', 'On Saturday I go home with my sister.', 'On Sunday I go home with my brother.'],
          mem: 'Sabato = Saturday. Mio fratello = my brother.' },
        { say: [['listen', 'L’ultima.']],
          it: 'Domani vado in posta con mio padre.', en: 'Tomorrow I go to the post office with my dad.',
          opts: ['Tomorrow I go to the post office with my dad.', 'Tomorrow I go to the pharmacy with my dad.', 'Tomorrow I go to the post office with my mom.'],
          mem: 'In posta = to the post office. Mio padre = my dad.' }
      ] },

    /* ---------- PART 4 · WRITE WHAT YOU HEAR (voice only, nothing to copy) ---------- */
    { id: 'scrivi', type: 'write', label: 'Scrivi', en: 'Write what you hear', pay: 3,
      say: ['listen', 'Ascolta e scrivi.'],
      items: [
        { it: 'Domani vado in banca con mia madre.', en: 'Tomorrow I go to the bank with my mom.' },
        { it: 'Stasera vado in palestra con mia sorella.', en: 'Tonight I go to the gym with my sister.' }
      ] },

    /* ---------- PART 5 · BUILD IT (tap the words in order, then say it out loud) ---------- */
    { id: 'costruisci', type: 'build', label: 'Costruisci', en: 'Build the sentence', pay: 4,
      say: ['finger-up', 'Costruisci la frase!'],
      items: [
        { en: 'Tomorrow I go to the bank.', tiles: ['Domani', 'vado', 'in banca.'], extra: ['voglio'] },
        { en: 'Tomorrow I go to the bank with my mom.', tiles: ['Domani', 'vado', 'in banca', 'con mia madre.'], extra: ['in posta'] },
        { en: 'Tonight I go to the gym with my sister.', tiles: ['Stasera', 'vado', 'in palestra', 'con mia sorella.'], extra: ['a scuola'] },
        { en: 'On Saturday I go home with my dad.', tiles: ['Sabato', 'vado', 'a casa', 'con mio padre.'], extra: ['Domani'] }
      ] }
  ]
});
