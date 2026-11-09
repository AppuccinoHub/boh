/* =====================================================================
   Boh · "A scuola 1: La mia classe, le mie cose"  (Italiano 2)
   THIS FILE IS THE WHOLE LESSON'S CONTENT. Edit words here; no other file needs to change.
   Level rule: present tense only. No combined prepositions (al, alla, del, nel...). Italian 1 and Italian 2 midterm words only,
   plus the 8 classroom words taught here as new: il pennarello, la finestra, il cestino, la gomma, il righello, l'astuccio,
   il temperamatite, il computer.
   Reading guide
   - en  = what the student reads in English.   it = the right answer, said out loud on every tap.
   - opts = the three answers shown (the right one must be in the list; the order is shuffled).
   - mem = the quick "how to remember it" line shown under the answer, right or wrong.
   - say = Prof. Lo So's lines before the answers appear: [pose, line]. She never gives the answer.
   Created by Assunta Scotto, 2026. Not for redistribution.
   ===================================================================== */
(function () {
  'use strict';
  /* card(pose, line, English, Italian, [two wrong answers], memory line) */
  function card(pose, line, en, it, wrong, mem) {
    return { say: [[pose, line]], en: en, it: it, opts: [it].concat(wrong), mem: mem };
  }
  /* hear(English, Italian, [two wrong English answers], memory line) : the student hears the Italian and picks the meaning */
  function hear(it, en, wrong, mem) {
    return { say: [['listen', 'Listen. What does it mean?']], it: it, en: en, opts: [en].concat(wrong), mem: mem };
  }

  /* The 15-question quick check. It is the same check at the start and at the end. */
  function checkCards() {
    return [
      card('present', 'Question 1.', 'the backpack', 'lo zaino', ['la penna', 'il libro'], 'Lo zaino. Lo, not il, before z.'),
      card('point-you', 'Question 2.', 'the teacher (female)', 'la professoressa', ['la studentessa', 'il preside'], 'La professoressa ends in -essa: a woman.'),
      card('present', 'Question 3.', 'the notebook', 'il quaderno', ['la lavagna', 'la matita'], 'Il quaderno is the notebook.'),
      card('think', 'Question 4.', 'math', 'la matematica', ['la musica', 'la storia'], 'La matematica looks like mathematics.'),
      card('point-you', 'Question 5.', 'the class', 'la classe', ['la scuola', 'la mensa'], 'La classe looks like class.'),
      card('present', 'Question 6.', '10:00', 'le dieci', ['le otto', 'le dodici'], 'Dieci = ten. Sono le dieci.'),
      card('think', 'Question 7.', 'eleven', 'undici', ['quattordici', 'sedici'], 'Undici = eleven.'),
      card('present', 'Question 8.', 'Friday', 'venerdì', ['lunedì', 'domenica'], 'Venerdì = Friday.'),
      card('point-you', 'Question 9.', 'Marco is a student.', 'Marco è uno studente.', ['Marco è un professore.', 'Marco è il preside.'], 'Studente = student.'),
      card('present', 'Question 10.', 'lunch', 'il pranzo', ['la cena', 'la colazione'], 'Il pranzo = lunch.'),
      card('point-you', 'Question 11.', 'the desk', 'il banco', ['la sedia', 'la porta'], 'Il banco is the desk.'),
      card('present', 'Question 12.', 'the clock', "l'orologio", ['la lavagna', 'il cestino'], "L'orologio: think horology."),
      card('point-you', 'Question 13.', 'the marker', 'il pennarello', ['il cancellino', 'il righello'], 'Il pennarello looks like la penna.'),
      card('present', 'Question 14.', 'the eraser (for a pencil)', 'la gomma', ['la matita', 'la penna'], 'La gomma erases pencil.'),
      card('point-you', 'Question 15.', 'the window', 'la finestra', ['la porta', 'la cattedra'], 'La finestra: think of a window frame.')
    ];
  }

  BohLezione.register({
    id: 'ascuola1',
    level: (typeof window !== 'undefined' && window.BOH_LEVEL) || 'italiano2',  /* the page sets BOH_LEVEL from ?l= so the back button returns to the right level */
    title: 'A scuola 1',
    sub: 'La mia classe, le mie cose',
    vocaroo: 'https://vocaroo.com',
    bonus: 5,

    sections: [

      /* ---------- QUICK CHECK (start) ---------- */
      { id: 'check1', type: 'pick', label: 'Quick check', en: '15 questions. No pressure.', pay: 1, cards: checkCards() },

      /* ---------- LESSON 1A · LA MIA CLASSE ---------- */
      { id: 'a1', type: 'pick', label: 'La mia classe 1', en: 'Six things in the room', pay: 2,
        cards: [
          card('point-side', 'Look around the room. Where do you sit?', 'the desk', 'il banco', ['la sedia', 'la porta'], 'Il banco. Think bench: you sit at it.'),
          card('present', 'And what do you sit on?', 'the chair', 'la sedia', ['la cattedra', 'il banco'], 'La sedia. Sedia sounds like seat.'),
          card('point-side', 'The teacher writes on it.', 'the board', 'la lavagna', ['la finestra', 'la porta'], 'La lavagna is the board on the wall.'),
          card('think', 'The board is full. What cleans it?', 'the board eraser', 'il cancellino', ['il pennarello', 'la gomma'], 'Cancellino sounds like cancel. It cancels the writing.'),
          card('present', 'The teacher writes with it.', 'the marker', 'il pennarello', ['il cancellino', 'la penna'], 'Il pennarello looks like la penna, the pen.'),
          card('point-side', 'What time is it? Look up.', 'the clock', "l'orologio", ['la lavagna', 'il cestino'], "L'orologio: think horology, the study of time.")
        ] },
      { id: 'a2', type: 'pick', label: 'La mia classe 2', en: 'Four more things', pay: 2,
        cards: [
          card('present', 'The teacher sits here.', "the teacher’s desk", 'la cattedra', ['il banco', 'la sedia'], 'La cattedra is the teacher’s desk. Think cathedral: a seat of authority.'),
          card('point-side', 'You walk in through it.', 'the door', 'la porta', ['la finestra', 'la lavagna'], 'La porta. Think portal.'),
          card('point-side', 'Light comes in through it.', 'the window', 'la finestra', ['la porta', 'la cattedra'], 'La finestra is the window.'),
          card('think', 'The paper is finished. Where does it go?', 'the trash can', 'il cestino', ['il cancellino', 'il pennarello'], 'Il cestino is the little basket for trash.')
        ] },
      { id: 'a3', type: 'pick', label: 'Lucia’s classroom', en: 'Listen and pick', pay: 2, hear: true,
        cards: [
          hear('Mi chiamo Lucia.', 'My name is Lucia.', ['I am a student.', 'I am the teacher.'], 'Mi chiamo = my name is.'),
          hear('Questa è la mia classe.', 'This is my classroom.', ['This is my backpack.', 'This is my school.'], 'Classe = class, the room and the group.'),
          hear('Ci sono venti banchi e venti sedie.', 'There are twenty desks and twenty chairs.', ['There are ten desks and ten chairs.', 'There are twenty desks and ten chairs.'], 'Ci sono = there are. Venti = twenty.'),
          hear('C’è una cattedra, una lavagna e un orologio.', 'There is a teacher’s desk, a board and a clock.', ['There is a door, a window and a clock.', 'There is a desk, a chair and a board.'], 'C’è = there is.'),
          hear('Il professore ha un pennarello e un cancellino.', 'The teacher has a marker and a board eraser.', ['The teacher has a backpack and a notebook.', 'The teacher has a pen and an eraser.'], 'Ha = has.')
        ] },
      { id: 'a4', type: 'match', label: 'Ascolta e abbina', en: 'Listen and match', pay: 5,
        say: ['listen', 'Listen to all five. Then match each one to its meaning.'],
        pairs: [
          ['il banco', 'the desk'],
          ['la cattedra', 'the teacher’s desk'],
          ['la lavagna', 'the board'],
          ['la finestra', 'the window'],
          ["l'orologio", 'the clock']
        ] },
      { id: 'a5', type: 'write', label: 'Scrivi', en: 'Write what you hear', pay: 3,
        say: ['listen', 'Listen. Type what you hear. Spelling mistakes are OK.'],
        items: [
          { it: 'la sedia', en: 'the chair' },
          { it: 'la porta', en: 'the door' },
          { it: 'il cestino', en: 'the trash can' }
        ] },
      { id: 'a6', type: 'record', label: 'Registra 1', en: 'Read it with a partner', pay: 5,
        say: ['mic', 'Read this out loud with a partner. Then switch roles and record it again.'],
        lines: [
          ['A', 'Questa è la mia classe.', 'This is my classroom.'],
          ['B', 'Ci sono venti banchi e venti sedie.', 'There are twenty desks and twenty chairs.'],
          ['A', 'C’è una porta, una finestra e un cestino.', 'There is a door, a window and a trash can.'],
          ['B', 'Il professore ha un pennarello e un cancellino.', 'The teacher has a marker and a board eraser.']
        ] },

      /* ---------- LESSON 1B · LE MIE COSE ---------- */
      { id: 'b1', type: 'pick', label: 'Le mie cose 1', en: 'Six things in your bag', pay: 2,
        cards: [
          card('present', 'You carry everything in it.', 'the backpack', 'lo zaino', ['la penna', 'il libro'], 'Lo zaino. Lo, not il, before z.'),
          card('point-you', 'You write your notes in it.', 'the notebook', 'il quaderno', ['il libro', 'la matita'], 'Il quaderno. Think quaderno = notebook, a square-lined book.'),
          card('present', 'You read it for history.', 'the book', 'il libro', ['il quaderno', 'lo zaino'], 'Il libro. Think library.'),
          card('point-you', 'You write with ink.', 'the pen', 'la penna', ['la matita', 'la gomma'], 'La penna. Think pen plus a.'),
          card('present', 'You write, and you can erase it.', 'the pencil', 'la matita', ['la penna', 'il righello'], 'La matita. Penna is pen, matita is pencil.'),
          card('think', 'You made a mistake in pencil.', 'the eraser (for a pencil)', 'la gomma', ['la matita', 'il cancellino'], 'La gomma = rubber. Gum, as in gum eraser.')
        ] },
      { id: 'b2', type: 'pick', label: 'Le mie cose 2', en: 'Four more things', pay: 2,
        cards: [
          card('present', 'You draw a straight line with it.', 'the ruler', 'il righello', ['il quaderno', 'la gomma'], 'Il righello. Riga = line. It draws lines.'),
          card('point-you', 'Your pens and pencils live in it.', 'the pencil case', "l'astuccio", ['lo zaino', 'il righello'], "L'astuccio is the pencil case. Pronounce: ah-STOOT-cho."),
          card('think', 'Your pencil is dull.', 'the pencil sharpener', 'il temperamatite', ['la matita', 'il pennarello'], 'Il temperamatite. Tempera = sharpens, matite = pencils.'),
          card('present', 'You do the homework on it.', 'the computer', 'il computer', ['il quaderno', 'il libro'], 'Il computer. Same word, Italian accent.')
        ] },
      { id: 'b3', type: 'pick', label: 'Lucia’s things', en: 'Listen and pick', pay: 2, hear: true,
        cards: [
          hear('Sono Lucia. Sono una studentessa.', 'I am Lucia. I am a student.', ['I am Lucia. I am a teacher.', 'I am Lucia. I am the principal.'], 'Sono = I am.'),
          hear('Ho uno zaino, un quaderno e un libro.', 'I have a backpack, a notebook and a book.', ['I have a pen, a pencil and an eraser.', 'I have a ruler, a computer and a book.'], 'Ho = I have.'),
          hear('Non ho un righello.', 'I do not have a ruler.', ['I have a ruler.', 'I do not have a computer.'], 'Non goes right before the verb: non ho.'),
          hear('Mi piace la matematica.', 'I like math.', ['I do not like math.', 'I like history.'], 'Mi piace = I like.'),
          hear('Non mi piace la storia.', 'I do not like history.', ['I like history.', 'I do not like math.'], 'Non mi piace = I do not like.')
        ] },
      { id: 'b4', type: 'match', label: 'Ascolta e abbina', en: 'Listen and match', pay: 5,
        say: ['listen', 'Listen to all five. Then match each one to its meaning.'],
        pairs: [
          ['lo zaino', 'the backpack'],
          ['il quaderno', 'the notebook'],
          ['la gomma', 'the eraser (for a pencil)'],
          ["l'astuccio", 'the pencil case'],
          ['il temperamatite', 'the pencil sharpener']
        ] },
      { id: 'b5', type: 'write', label: 'Scrivi', en: 'Write what you hear', pay: 3,
        say: ['listen', 'Listen. Type what you hear. Spelling mistakes are OK.'],
        items: [
          { it: 'la penna', en: 'the pen' },
          { it: 'il libro', en: 'the book' },
          { it: 'il righello', en: 'the ruler' }
        ] },
      { id: 'b6', type: 'build', label: 'Costruisci', en: 'Build your sentences', pay: 4,
        say: ['finger-up', 'Tap the words in order.'],
        items: [
          { en: 'I have a backpack.', tiles: ['Ho', 'uno zaino.'], extra: ['Sono'] },
          { en: 'I have a pen and a pencil.', tiles: ['Ho', 'una penna', 'e una matita.'], extra: ['Sono'] },
          { en: 'I do not have a ruler.', tiles: ['Non ho', 'un righello.'], extra: ['Non sono'] },
          { en: 'I like math.', tiles: ['Mi piace', 'la matematica.'], extra: ['Ho'] }
        ] },
      { id: 'b7', type: 'record', label: 'Registra 2', en: 'Read it with a partner', pay: 5,
        say: ['mic', 'Read this out loud with a partner. Then switch roles and record it again.'],
        lines: [
          ['A', 'Sono Lucia. Sono una studentessa.', 'I am Lucia. I am a student.'],
          ['B', 'Ho uno zaino, un quaderno e un libro.', 'I have a backpack, a notebook and a book.'],
          ['A', 'Ho un astuccio e un temperamatite. Non ho un righello.', 'I have a pencil case and a pencil sharpener. I do not have a ruler.'],
          ['B', 'Mi piace la matematica. Non mi piace la storia.', 'I like math. I do not like history.']
        ] },

      /* ---------- QUICK CHECK (end): the same 15 questions ---------- */
      { id: 'check2', type: 'pick', label: 'Quick check again', en: 'The same 15 questions', pay: 3, cards: checkCards() }
    ]
  });
})();
