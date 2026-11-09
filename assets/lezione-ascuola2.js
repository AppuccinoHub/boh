/* =====================================================================
   Boh · "A scuola 2: La scuola in Italia"  (Italiano 2)
   THIS FILE IS THE WHOLE LESSON'S CONTENT. Edit words here; no other file needs to change.
   Level rule: present tense only. No combined prepositions (al, alla, del, nel...). Italian 1 and Italian 2 midterm words only,
   plus the school-system words taught here: la scuola elementare, media, superiore, il liceo, l'istituto tecnico,
   l'istituto professionale, il diploma, la ricreazione, la mensa, il ministero, il preside, la maturità.
   Facts checked against Eurydice, Istat and the Italian ministry (MIM). Compulsory school is ages 6 to 16.
   Lesson 4 teaches both clock forms: standard (l'una) and 24-hour (le tredici). Both are correct.
   Reading guide: same as lezione-ascuola1.js.
   Created by Assunta Scotto, 2026. Not for redistribution.
   ===================================================================== */
(function () {
  'use strict';
  function card(pose, line, en, it, wrong, mem) {
    return { say: [[pose, line]], en: en, it: it, opts: [it].concat(wrong), mem: mem };
  }
  function hear(it, en, wrong, mem) {
    return { say: [['listen', 'Listen. What does it mean?']], it: it, en: en, opts: [en].concat(wrong), mem: mem };
  }
  /* The 4-pair check. It is the same check at the start and at the end. */
  function checkPairs() {
    return [
      ['il ministero', 'decides for the schools'],
      ['la maturità', 'the final exam'],
      ['il liceo', 'a high school'],
      ['la mensa', 'the cafeteria']
    ];
  }

  BohLezione.register({
    id: 'ascuola2',
    level: (typeof window !== 'undefined' && window.BOH_LEVEL) || 'italiano2',  /* the page sets BOH_LEVEL from ?l= so the back button returns to the right level */
    title: 'A scuola 2',
    sub: 'La scuola in Italia',
    vocaroo: 'https://vocaroo.com',
    bonus: 5,

    sections: [

      /* ---------- CHECK (start) ---------- */
      { id: 'pre', type: 'match', label: 'Quick check', en: 'What do you already know?', pay: 1,
        say: ['think', 'Four pairs. Guess if you are not sure. This is only to see where you start.'],
        pairs: checkPairs() },

      /* ---------- LESSON 2 · LE SCUOLE IN ITALIA ---------- */
      { id: 'l2a', type: 'pick', label: 'Le scuole in Italia', en: 'Three stages', pay: 2,
        cards: [
          card('present', 'In Italy, small children go to school first.', 'Elementary school is for children from six to eleven years old.', 'La scuola elementare è per i bambini da sei a undici anni.', ['La scuola elementare è per i bambini da undici a quattordici anni.', 'La scuola elementare è per i bambini da quattordici a diciannove anni.'], 'Elementare: six to eleven.'),
          card('point-side', 'Next comes the middle stage.', 'Middle school is from eleven to fourteen years old.', 'La scuola media è da undici a quattordici anni.', ['La scuola media è da sei a undici anni.', 'La scuola media è da quattordici a diciannove anni.'], 'Media = in the middle: eleven to fourteen.'),
          card('present', 'And then the last stage.', 'High school is from fourteen to nineteen years old.', 'La scuola superiore è da quattordici a diciannove anni.', ['La scuola superiore è da undici a quattordici anni.', 'La scuola superiore è da sei a undici anni.'], 'Superiore = higher: fourteen to nineteen.'),
          card('think', 'How long does each stage last?', 'Elementary school lasts five years.', 'La scuola elementare dura cinque anni.', ['La scuola elementare dura tre anni.', 'La scuola elementare dura sei anni.'], 'Dura = lasts. Elementare: five years.'),
          card('think', 'Count the years of the middle stage.', 'Middle school lasts three years.', 'La scuola media dura tre anni.', ['La scuola media dura cinque anni.', 'La scuola media dura sei anni.'], 'Media lasts three years.'),
          card('think', 'Now the last stage.', 'High school lasts five years.', 'La scuola superiore dura cinque anni.', ['La scuola superiore dura tre anni.', 'La scuola superiore dura quattro anni.'], 'Superiore lasts five years.')
        ] },
      { id: 'l2b', type: 'pick', label: 'Quanti anni?', en: 'Listen and pick', pay: 2, hear: true,
        cards: [
          hear('Un ragazzo di dodici anni studia in una scuola media.', 'A twelve-year-old studies in a middle school.', ['A twelve-year-old studies in an elementary school.', 'A twelve-year-old studies in a high school.'], 'Twelve is between eleven and fourteen: media.'),
          hear('La scuola media dura tre anni.', 'Middle school lasts three years.', ['Middle school lasts five years.', 'High school lasts three years.'], 'Dura = lasts.'),
          hear('La scuola superiore dura cinque anni.', 'High school lasts five years.', ['High school lasts three years.', 'Elementary school lasts six years.'], 'Cinque anni.')
        ] },
      { id: 'l2c', type: 'match', label: 'Abbina', en: 'Match the stage to the ages', pay: 5,
        say: ['listen', 'Listen to all three. Then match each stage to its ages.'],
        pairs: [
          ['la scuola elementare', 'ages 6 to 11'],
          ['la scuola media', 'ages 11 to 14'],
          ['la scuola superiore', 'ages 14 to 19']
        ] },
      { id: 'l2d', type: 'build', label: 'Costruisci', en: 'Build your sentence', pay: 4,
        say: ['finger-up', 'Tap the words in order.'],
        items: [
          { en: 'Middle school lasts three years.', tiles: ['La scuola media', 'dura', 'tre anni.'], extra: ['cinque anni.'] },
          { en: 'High school lasts five years.', tiles: ['La scuola superiore', 'dura', 'cinque anni.'], extra: ['tre anni.'] }
        ] },

      /* ---------- LESSON 3 · LE SCUOLE SUPERIORI ---------- */
      { id: 'l3a', type: 'pick', label: 'Le scuole superiori', en: 'Three kinds of high school', pay: 2,
        cards: [
          card('present', 'High school has different paths.', 'In Italy there are three kinds of high school.', 'In Italia ci sono tre tipi di scuola superiore.', ['In Italia ci sono due tipi di scuola superiore.', 'In Italia ci sono sei tipi di scuola superiore.'], 'Tre tipi = three kinds.'),
          card('think', 'Name the three kinds.', 'They are the liceo, the technical institute and the professional institute.', "Sono il liceo, l'istituto tecnico e l'istituto professionale.", ['Sono il liceo, la mensa e il preside.', 'Sono la maturità, il liceo e la scuola media.'], 'Liceo, tecnico, professionale. Three paths.'),
          card('point-side', 'The liceo has its own branches.', 'There are six kinds of liceo.', 'Ci sono sei tipi di liceo.', ['Ci sono tre tipi di liceo.', 'Ci sono dieci tipi di liceo.'], 'Sei = six.'),
          card('present', 'A school for science.', 'the science high school', 'il liceo scientifico', ['il liceo linguistico', 'il liceo artistico'], 'Scientifico looks like scientific.'),
          card('present', 'A school for languages.', 'the language high school', 'il liceo linguistico', ['il liceo scientifico', 'il liceo artistico'], 'Linguistico looks like linguistic.'),
          card('present', 'A school for art.', 'the art high school', 'il liceo artistico', ['il liceo linguistico', 'il liceo scientifico'], 'Artistico looks like artistic.'),
          card('point-you', 'What do students get at the end?', 'After five years, students get a diploma.', 'Dopo cinque anni, gli studenti hanno un diploma.', ['Dopo tre anni, gli studenti hanno un diploma.', 'Dopo cinque anni, gli studenti hanno un liceo.'], 'Dopo = after. Diploma at the end.')
        ] },
      { id: 'l3b', type: 'pick', label: 'Quali scuole?', en: 'Listen and pick', pay: 2, hear: true,
        cards: [
          hear('In Italia ci sono tre tipi di scuola superiore.', 'In Italy there are three kinds of high school.', ['In Italy there are six kinds of high school.', 'In Italy there are three kinds of middle school.'], 'Tre = three.'),
          hear('Il liceo classico, il liceo scientifico, il liceo linguistico e il liceo artistico.', 'The classical, science, language and art high schools.', ['The technical, professional and science high schools.', 'The elementary, middle and high schools.'], 'Four of the six licei.'),
          hear('Dopo cinque anni, gli studenti hanno un diploma.', 'After five years, students get a diploma.', ['After three years, students get a diploma.', 'After five years, students have a test.'], 'Dopo = after.')
        ] },
      { id: 'l3c', type: 'match', label: 'Abbina', en: 'Match the school to its meaning', pay: 5,
        say: ['listen', 'Listen. Then match.'],
        pairs: [
          ['il liceo classico', 'the classical high school'],
          ['il liceo scientifico', 'the science high school'],
          ['il liceo linguistico', 'the language high school'],
          ['il liceo artistico', 'the art high school'],
          ["l'istituto tecnico", 'the technical institute']
        ] },
      { id: 'l3d', type: 'build', label: 'Costruisci', en: 'Build your sentence', pay: 4,
        say: ['finger-up', 'Tap the words in order.'],
        items: [
          { en: 'High school lasts five years.', tiles: ['La scuola superiore', 'dura', 'cinque anni.'], extra: ['tre anni.'] },
          { en: 'After five years, students get a diploma.', tiles: ['Dopo cinque anni,', 'gli studenti', 'hanno', 'un diploma.'], extra: ['un liceo.'] }
        ] },

      /* ---------- LESSON 4 · UNA GIORNATA A SCUOLA ---------- */
      { id: 'l4a', type: 'pick', label: 'Una giornata a scuola', en: 'A day at school', pay: 2,
        cards: [
          card('present', 'Marco goes to a school called Liceo Dante.', 'Marco’s school is called Liceo Dante.', 'La scuola di Marco si chiama Liceo Dante.', ['La scuola di Marco si chiama la maturità.', 'La scuola di Marco si chiama il ministero.'], 'Si chiama = is called.'),
          card('point-side', 'It is eight in the morning.', 'It is eight: school starts.', 'Sono le otto: la scuola comincia.', ['Sono le nove: la scuola comincia.', 'Sono le dieci: la scuola comincia.'], 'Sono le + the hour.'),
          card('point-side', 'It is ten. Everyone goes out.', 'It is ten: there is a break.', "Sono le dieci: c'è la ricreazione.", ['Sono le otto: c’è la ricreazione.', 'Sono le dodici: c’è la ricreazione.'], 'La ricreazione = recreation, the break.'),
          card('present', 'Marco is hungry at the break.', 'At school there is a snack bar.', "A scuola c'è un bar.", ['A scuola c’è una porta.', 'A scuola c’è un bagno.'], 'Un bar: same word as in English.'),
          card('point-you', 'What does Marco buy?', 'Marco eats a sandwich.', 'Marco mangia un panino.', ['Marco mangia una pizza.', 'Marco beve un caffè.'], 'Panino = little bread: sandwich.'),
          card('present', 'School is over.', 'It is one: school ends.', "È l'una: la scuola finisce.", ['Sono le due: la scuola finisce.', 'Sono le undici: la scuola finisce.'], 'One o’clock is singular: è l’una.'),
          card('point-you', 'Marco leaves.', 'Marco goes home and eats lunch.', 'Marco va a casa e mangia il pranzo.', ['Marco va a scuola e mangia il pranzo.', 'Marco va a casa e studia.'], 'Va = goes. Il pranzo = lunch.'),
          card('think', 'Some schools have one.', 'the cafeteria', 'la mensa', ['la ricreazione', 'la matematica'], 'La mensa is the school cafeteria.')
        ] },
      { id: 'l4b', type: 'pick', label: 'Due modi', en: 'Two ways to say the time', pay: 2,
        cards: [
          card('think', 'Standard time. The clock says 8:00.', 'It is eight.', 'Sono le otto.', ['Sono le sette.', 'Sono le nove.'], 'Standard time: Sono le otto.'),
          card('think', 'In Italy they also use the 24-hour clock. 13:00.', 'It is 13:00.', 'Sono le tredici.', ['Sono le tre.', 'Sono le dodici.'], 'Tredici = thirteen. Same time as l’una.'),
          card('present', 'Standard time. The clock says 1:00.', 'It is one o’clock.', "È l'una.", ['Sono le due.', 'È la una.'], 'One o’clock is singular: è l’una.'),
          card('point-you', 'The school ends at thirteen hundred.', 'School ends: it is 13:00.', 'La scuola finisce: sono le tredici.', ['La scuola finisce: sono le tre.', 'La scuola finisce: sono le dodici.'], 'Le tredici is the 24-hour way to say l’una.')
        ] },
      { id: 'l4c', type: 'pick', label: 'Una giornata', en: 'Listen and pick', pay: 2, hear: true,
        cards: [
          hear('Sono le otto. La scuola comincia.', 'It is eight. School starts.', ['It is ten. School starts.', 'It is eight. School ends.'], 'Sono le otto.'),
          hear('Sono le dieci. C’è la ricreazione.', 'It is ten. There is a break.', ['It is eight. There is a break.', 'It is ten. There is lunch.'], 'La ricreazione = the break.'),
          hear('Sono le tredici. La scuola finisce.', 'It is 13:00. School ends.', ['It is 10:00. School ends.', 'It is 13:00. School starts.'], 'Tredici = thirteen: 1:00 PM.')
        ] },
      { id: 'l4d', type: 'match', label: 'Abbina', en: 'Match the time', pay: 5,
        say: ['listen', 'Listen. Then match each time. Two of them are the same time in different ways.'],
        pairs: [
          ['Sono le otto.', 'It is 8:00.'],
          ['Sono le dieci.', 'It is 10:00.'],
          ["È l'una.", 'It is 1:00 (standard time).'],
          ['Sono le tredici.', 'It is 13:00 (24-hour time).'],
          ['la ricreazione', 'the break']
        ] },
      { id: 'l4e', type: 'record', label: 'Registra', en: 'Read it with a partner', pay: 5,
        say: ['mic', 'Read this out loud with a partner. Then switch roles and record it again.'],
        lines: [
          ['A', 'La scuola di Marco si chiama Liceo Dante.', 'Marco’s school is called Liceo Dante.'],
          ['B', 'Sono le otto: la scuola comincia.', 'It is eight: school starts.'],
          ['A', 'Sono le dieci: c’è la ricreazione. Marco mangia un panino.', 'It is ten: there is a break. Marco eats a sandwich.'],
          ['B', 'È l’una: la scuola finisce. Marco va a casa e mangia il pranzo.', 'It is one: school ends. Marco goes home and eats lunch.']
        ] },

      /* ---------- LESSON 5 · CHI DECIDE? IL DIPLOMA ---------- */
      { id: 'l5a', type: 'pick', label: 'Chi decide?', en: 'Who is in charge?', pay: 2,
        cards: [
          card('think', 'Who makes the rules for all Italian schools?', 'In Italy the ministry decides for the schools.', 'In Italia il ministero decide per le scuole.', ['In Italia il preside decide per le scuole.', 'In Italia lo studente decide per le scuole.'], 'Il ministero = the ministry. It decides for the whole country.'),
          card('present', 'It has a short name.', 'The ministry is called MIM.', 'Il ministero si chiama MIM.', ['Il preside si chiama MIM.', 'La maturità si chiama MIM.'], 'MIM is the short name of the ministry for schools.'),
          card('point-you', 'And inside each building?', 'Every school has a principal.', 'Ogni scuola ha un preside.', ['Ogni scuola ha un ministero.', 'Ogni scuola ha una maturità.'], 'Ogni = every. Il preside = the principal.'),
          card('think', 'Five years of high school end with something big.', 'After five years of high school there is an important exam.', "Dopo cinque anni di scuola superiore c'è un esame importante.", ['Dopo tre anni di scuola superiore c’è un esame importante.', 'Dopo cinque anni di scuola media c’è un esame importante.'], 'Esame = exam. Importante = important.'),
          card('present', 'It has a name.', 'The exam is called the maturità.', "L'esame si chiama la maturità.", ['L’esame si chiama il ministero.', 'L’esame si chiama la ricreazione.'], 'La maturità = the final exam.'),
          card('point-you', 'Pass it, and then what?', 'After the maturità, students get the diploma.', 'Dopo la maturità, gli studenti hanno il diploma.', ['Dopo la maturità, gli studenti hanno la ricreazione.', 'Dopo la maturità, gli studenti hanno un preside.'], 'Dopo = after. Il diploma = the diploma.')
        ] },
      { id: 'l5b', type: 'pick', label: 'Chi decide?', en: 'Listen and pick', pay: 2, hear: true,
        cards: [
          hear('Il ministero si chiama MIM.', 'The ministry is called MIM.', ['The principal is called MIM.', 'The exam is called MIM.'], 'Si chiama = is called.'),
          hear('Ogni scuola ha un preside.', 'Every school has a principal.', ['Every school has a ministry.', 'Every school has a cafeteria.'], 'Preside = principal.'),
          hear('L’esame si chiama la maturità.', 'The exam is called the maturità.', ['The school is called the maturità.', 'The ministry is called the maturità.'], 'L’esame = the exam.')
        ] },
      { id: 'l5c', type: 'build', label: 'Costruisci', en: 'Build your sentence', pay: 4,
        say: ['finger-up', 'Tap the words in order.'],
        items: [
          { en: 'The ministry decides for the schools.', tiles: ['Il ministero', 'decide', 'per le scuole.'], extra: ['Il preside'] },
          { en: 'Every school has a principal.', tiles: ['Ogni scuola', 'ha', 'un preside.'], extra: ['un ministero.'] },
          { en: 'The exam is called the maturità.', tiles: ['L’esame', 'si chiama', 'la maturità.'], extra: ['il diploma.'] }
        ] },
      { id: 'l5d', type: 'record', label: 'Registra', en: 'Read it with a partner', pay: 5,
        say: ['mic', 'Read this out loud with a partner. Then switch roles and record it again.'],
        lines: [
          ['A', 'In Italia il ministero decide per le scuole.', 'In Italy the ministry decides for the schools.'],
          ['B', 'Il ministero si chiama MIM. Ogni scuola ha un preside.', 'The ministry is called MIM. Every school has a principal.'],
          ['A', 'Dopo cinque anni di scuola superiore c’è un esame importante.', 'After five years of high school there is an important exam.'],
          ['B', 'L’esame si chiama la maturità. Dopo la maturità, gli studenti hanno il diploma.', 'The exam is called the maturità. After it, students get the diploma.']
        ] },

      /* ---------- CHECK (end): the same 4 pairs ---------- */
      { id: 'post', type: 'match', label: 'Quick check again', en: 'The same four pairs', pay: 3,
        say: ['think', 'The same four pairs as the start. Let us see what you know now.'],
        pairs: checkPairs() }
    ]
  });
})();
