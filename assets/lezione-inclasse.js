/* =====================================================================
   Boh · "In classe: posso, devo, voglio"  (Italiano 2)
   THIS FILE IS THE WHOLE LESSON'S CONTENT. Edit words here; no other file needs to change.
   Created by Assunta Scotto, 2026. Not for redistribution.

   Reading guide
   - en  = what the student reads in English.   it = the right answer, said out loud on every tap.
   - opts = the three answers shown (the right one must be in the list; the order is shuffled).
   - mem = the quick "how to remember it" line shown under the answer, right or wrong.
   - say = Prof. Lo So's lines before the answers appear: [pose, line]. Poses are her own pictures in assets/guide/bust/.
   - pay = Boh Cashi for that card (first time only). Harder parts pay more.
   ===================================================================== */
BohLezione.register({
  id: 'inclasse',
  level: 'italiano2',
  title: 'In classe',
  sub: 'Posso, devo, voglio',
  vocaroo: 'https://vocaroo.com',
  bonus: 5,                       // Boh Cashi for finishing a part

  sections: [

    /* ---------- PART 1 · POSSO ---------- */
    { id: 'posso', type: 'pick', label: 'Posso', en: 'Can I...?', pay: 2,
      cards: [
        { say: [['wave', 'How do you say “I want to go to the bathroom”?'], ['cheeky-what', 'You don’t know, do you?'], ['point-you', 'I bet you know this one: “Can I go to the bathroom?”']],
          en: 'Can I go to the bathroom?', it: 'Posso andare in bagno?',
          opts: ['Posso andare in bagno?', 'Devo andare in bagno.', 'Voglio andare in bagno.'],
          mem: 'It is on the wall! Posso = is it possible? Can I?' },
        { say: [['present', 'Next step. Pick the word for the nurse’s office.']],
          en: 'Can I go to the nurse?', it: 'Posso andare in infermeria?',
          opts: ['Posso andare in infermeria?', 'Posso andare in pizzeria?', 'Posso andare in libreria?'],
          mem: 'Infermeria looks like infirmary. That is where the nurse is.' },
        { say: [['point-you', 'You need a pen. Ask for it.']],
          en: 'Can I have a pen?', it: 'Posso avere una penna?',
          opts: ['Posso avere una penna?', 'Posso avere una pizza?', 'Posso avere una matita?'],
          mem: 'Penna = pen, plus two letters.' },
        { say: [['present', 'Now the pencil.']],
          en: 'Can I have a pencil?', it: 'Posso avere una matita?',
          opts: ['Posso avere una matita?', 'Posso avere una penna?', 'Posso avere una mela?'],
          mem: 'Matita is the pencil. Penna is the pen.' },
        { say: [['point-you', 'You are thirsty.']],
          en: 'Can I go get a drink?', it: 'Posso andare a bere?',
          opts: ['Posso andare a bere?', 'Posso andare a mangiare?', 'Posso andare a dormire?'],
          mem: 'Bere, like beverage.' }
      ] },

    /* ---------- PART 2 · DEVO ---------- */
    { id: 'devo', type: 'pick', label: 'Devo', en: 'I have to...', pay: 2,
      cards: [
        { say: [['beckon', 'New word, same sentence.'], ['finger-up', 'Devo = I have to. D for duty.']],
          en: 'I have to go to the bathroom.', it: 'Devo andare in bagno.',
          opts: ['Devo andare in bagno.', 'Posso andare in bagno?', 'Voglio andare in bagno.'],
          mem: 'Devo = I have to. D for duty.' },
        { say: [['present', 'You do not feel well.']],
          en: 'I have to go to the nurse.', it: 'Devo andare in infermeria.',
          opts: ['Devo andare in infermeria.', 'Devo andare in pizzeria.', 'Devo andare in libreria.'],
          mem: 'Infermeria = infirmary, the nurse’s office.' },
        { say: [['tablet', 'Your battery is at 2 percent.']],
          en: 'I have to charge my Chromebook.', it: 'Devo caricare il Chromebook.',
          opts: ['Devo caricare il Chromebook.', 'Devo comprare il Chromebook.', 'Devo mangiare il Chromebook.'],
          mem: 'Caricare = to charge.' },
        { say: [['think', 'There is a test tomorrow.']],
          en: 'I have to study.', it: 'Devo studiare.',
          opts: ['Devo studiare.', 'Devo mangiare.', 'Devo dormire.'],
          mem: 'Studiare = to study. Almost the same word.' },
        { say: [['point-you', 'The bell rang.']],
          en: 'I have to go home.', it: 'Devo andare a casa.',
          opts: ['Devo andare a casa.', 'Devo andare a scuola.', 'Devo andare in bagno.'],
          mem: 'A casa = home. Casa = house.' }
      ] },

    /* ---------- PART 3 · VOGLIO ---------- */
    { id: 'voglio', type: 'pick', label: 'Voglio', en: 'I want to...', pay: 2,
      cards: [
        { say: [['beckon', 'Remember my first question?'], ['finger-up', 'Voglio = I want. Now you know it.']],
          en: 'I want to go to the bathroom.', it: 'Voglio andare in bagno.',
          opts: ['Voglio andare in bagno.', 'Devo andare in bagno.', 'Posso andare in bagno?'],
          mem: 'Voglio = I want. Say it: VOH-lyo.' },
        { say: [['present', 'It is Friday afternoon.']],
          en: 'I want to go home.', it: 'Voglio andare a casa.',
          opts: ['Voglio andare a casa.', 'Voglio andare a scuola.', 'Voglio andare in bagno.'],
          mem: 'A casa = home.' },
        { say: [['point-you', 'You are hungry.']],
          en: 'I want to eat.', it: 'Voglio mangiare.',
          opts: ['Voglio mangiare.', 'Voglio bere.', 'Voglio dormire.'],
          mem: 'Mangiare = to eat. Mangia, mangia!' },
        { say: [['present', 'You are thirsty.']],
          en: 'I want to drink.', it: 'Voglio bere.',
          opts: ['Voglio bere.', 'Voglio mangiare.', 'Voglio studiare.'],
          mem: 'Bere, like beverage.' },
        { say: [['open-hands', 'It is seven in the morning.']],
          en: 'I want to sleep.', it: 'Voglio dormire.',
          opts: ['Voglio dormire.', 'Voglio studiare.', 'Voglio mangiare.'],
          mem: 'Dormire = to sleep. Think dorm.' }
      ] },

    /* ---------- PART 4 · YOU ---------- */
    { id: 'tu', type: 'pick', label: 'You', en: 'puoi, devi, vuoi', pay: 2,
      cards: [
        { say: [['beckon', 'Now you are the teacher.'], ['finger-up', '“You” ends in -i: puoi, devi, vuoi.']],
          en: 'You can go to the bathroom.', it: 'Puoi andare in bagno.',
          opts: ['Puoi andare in bagno.', 'Posso andare in bagno?', 'Devi andare in bagno.'],
          mem: 'Posso = I can. Puoi = you can.' },
        { say: [['open-hands', 'Someone asks you for a pen. Say no.']],
          en: 'No, you can’t have a pen.', it: 'No, non puoi avere una penna.',
          opts: ['No, non puoi avere una penna.', 'No, non posso avere una penna.', 'No, non devi avere una penna.'],
          mem: 'Non goes right before the verb: non puoi.' },
        { say: [['shh-wink', 'Not now.']],
          en: 'You have to wait.', it: 'Devi aspettare.',
          opts: ['Devi aspettare.', 'Devo aspettare.', 'Puoi aspettare.'],
          mem: 'Devo = I have to. Devi = you have to.' },
        { say: [['think', 'The test is tomorrow.']],
          en: 'You have to study.', it: 'Devi studiare.',
          opts: ['Devi studiare.', 'Devo studiare.', 'Vuoi studiare?'],
          mem: '“You” ends in -i: devi.' },
        { say: [['present', 'Ask a friend.']],
          en: 'Do you want to go home?', it: 'Vuoi andare a casa?',
          opts: ['Vuoi andare a casa?', 'Voglio andare a casa.', 'Puoi andare a casa.'],
          mem: 'Voglio = I want. Vuoi = you want.' }
      ] },

    /* ---------- QUICK CHECK (listen, then pick the meaning) ---------- */
    { id: 'check', type: 'pick', label: 'Quick check', en: 'Listen and pick', pay: 2, hear: true,
      cards: [
        { say: [['listen', 'Quick check. Listen. What does it mean?']],
          it: 'Posso andare in bagno?', en: 'Can I go to the bathroom?',
          opts: ['Can I go to the bathroom?', 'I have to go to the bathroom.', 'I want to go to the bathroom.'],
          mem: 'Posso = can I.' },
        { say: [['listen', 'Listen.']],
          it: 'Devo andare in infermeria.', en: 'I have to go to the nurse.',
          opts: ['I have to go to the nurse.', 'Can I go to the nurse?', 'I want to go to the nurse.'],
          mem: 'Devo = I have to.' },
        { say: [['listen', 'Listen.']],
          it: 'Voglio bere.', en: 'I want to drink.',
          opts: ['I want to drink.', 'I want to eat.', 'I have to drink.'],
          mem: 'Voglio = I want. Bere, like beverage.' },
        { say: [['listen', 'Listen. Who is it about?']],
          it: 'Puoi andare in bagno.', en: 'You can go to the bathroom.',
          opts: ['You can go to the bathroom.', 'Can I go to the bathroom?', 'You have to go to the bathroom.'],
          mem: 'Puoi ends in -i. It is about you.' },
        { say: [['listen', 'Last one. Listen.']],
          it: 'No, non puoi avere una penna.', en: 'No, you can’t have a pen.',
          opts: ['No, you can’t have a pen.', 'No, I can’t have a pen.', 'No, you don’t want a pen.'],
          mem: 'Non puoi = you can’t.' }
      ],
      /* optional harder cards: they pay double */
      levelUp: {
        offer: 'Want more? Learn to say you don’t have one.',
        note: 'Harder cards. They pay double.',
        pay: 4,
        cards: [
          { say: [['finger-up', 'Ho = I have. You know this one.'], ['point-you', 'So how do you say you DON’T have a pen?']],
            en: 'I don’t have a pen.', it: 'Non ho una penna.',
            opts: ['Non ho una penna.', 'Non sono una penna.', 'Non posso una penna.'],
            mem: 'Avere = the haves. Ho = I have. Non ho = I don’t have.' },
          { say: [['present', 'Ask a friend.']],
            en: 'Do you have a pencil?', it: 'Hai una matita?',
            opts: ['Hai una matita?', 'Sei una matita?', 'Puoi una matita?'],
            mem: 'Ho = I have. Hai = you have.' },
          { say: [['open-hands', 'Your friend asks. Sorry, you don’t have one.']],
            en: 'No, I don’t have a pencil.', it: 'No, non ho una matita.',
            opts: ['No, non ho una matita.', 'No, non hai una matita.', 'No, non posso una matita.'],
            mem: 'Non goes right before the verb: non ho.' }
        ]
      } },

    /* ---------- LISTEN AND MATCH ---------- */
    { id: 'abbina', type: 'match', label: 'Ascolta e abbina', en: 'Listen and match', pay: 5,
      say: ['listen', 'Listen to all five. Then match each one to its meaning.'],
      pairs: [
        ['Posso avere una penna?', 'Can I have a pen?'],
        ['Devo andare in bagno.', 'I have to go to the bathroom.'],
        ['Voglio andare a casa.', 'I want to go home.'],
        ['Devi aspettare.', 'You have to wait.'],
        ['No, non puoi.', 'No, you can’t.']
      ] },

    /* ---------- WRITE WHAT YOU HEAR ---------- */
    { id: 'scrivi', type: 'write', label: 'Scrivi', en: 'Write what you hear', pay: 3,
      say: ['listen', 'Listen. Type what you hear. Spelling mistakes are OK.'],
      items: [
        { it: 'Posso andare in bagno?', en: 'Can I go to the bathroom?' },
        { it: 'Devo studiare.', en: 'I have to study.' },
        { it: 'Voglio andare a casa.', en: 'I want to go home.' }
      ] },

    /* ---------- RECORD 1 ---------- */
    { id: 'registra1', type: 'record', label: 'Registra 1', en: 'Record with a partner', pay: 5,
      say: ['mic', 'Record this with a partner. Then switch roles and record it again.'],
      lines: [
        ['A', 'Posso avere una penna?', 'Can I have a pen?'],
        ['B', 'No, non puoi avere una penna.', 'No, you can’t have a pen.'],
        ['A', 'Posso andare in bagno?', 'Can I go to the bathroom?'],
        ['B', 'Sì, puoi.', 'Yes, you can.']
      ] },

    /* ---------- BUILD LONGER SENTENCES (harder: pays more) ---------- */
    { id: 'costruisci', type: 'build', label: 'Costruisci', en: 'Build longer sentences', pay: 4,
      say: ['finger-up', 'Tap the words in order. Each sentence gets a little longer.'],
      items: [
        { en: 'Can I have a pen?', tiles: ['Posso', 'avere', 'una penna?'], extra: ['Devo'] },
        { en: 'Can I have a pen, please?', tiles: ['Posso', 'avere', 'una penna,', 'per favore?'], extra: ['Voglio'] },
        { en: 'No, you can’t have a pen.', tiles: ['No,', 'non puoi', 'avere', 'una penna.'], extra: ['non posso'] },
        { en: 'No, you can’t. I don’t have a pen.', tiles: ['No,', 'non puoi.', 'Non ho', 'una penna.'], extra: ['Non sono'] }
      ] },

    /* ---------- RECORD 2 ---------- */
    { id: 'registra2', type: 'record', label: 'Registra 2', en: 'Record again, longer', pay: 5,
      say: ['mic', 'One more recording, with your longer sentences. Then switch roles.'],
      lines: [
        ['A', 'Posso avere una penna, per favore?', 'Can I have a pen, please?'],
        ['B', 'No, non puoi. Non ho una penna.', 'No, you can’t. I don’t have a pen.'],
        ['A', 'Devo andare in infermeria.', 'I have to go to the nurse.'],
        ['B', 'Sì, puoi andare.', 'Yes, you can go.']
      ] }
  ]
});
