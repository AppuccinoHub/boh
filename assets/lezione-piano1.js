/* =====================================================================
   Boh · "Facciamo un piano! 1: I passatempi e i verbi in -are"  (Italiano 2)
   THIS FILE IS THE WHOLE LESSON'S CONTENT. Edit words here; no other file needs to change.
   Created by Assunta Scotto, 2026-11-13. (c) 2026 Assunta Scotto. All rights reserved. Not for redistribution.
   Original author and owner: Assunta Scotto. Part of Boh (github.com/AppuccinoHub/boh).

   What it is: the learning that comes BEFORE Day 1 (hobby survey) of the summative project "Facciamo un piano!".
   Stop 1 (parts 1 to 6): the hobby words, then Ti piace...? / Mi piace...
   Stop 2 (parts 7 to 13): regular -are verbs in the present. io and tu first (review), then noi, then lui/lei, voi, loro,
   then the giocare spelling change (giochi, giochiamo).

   Level rules: present tense only. No grammar talk about combined prepositions: "ai videogiochi" and "in piscina" are whole pieces.
   Mi piace / Ti piace are whole pieces (taught from day one). Names used: Marcello, Aurora.

   Reading guide (same as lezione-domanivado.js)
   - en  = what the student reads in English.   it = the right answer, said out loud on every tap.
   - opts = the three answers shown (the right one must be in the list; the order is shuffled).
   - mem = the quick "how to remember it" line shown under the answer, right or wrong.
   - say = Prof. Lo So's cue before the answers appear: [pose, line]. Italian only, and never the answer.
   - pay = Boh Cashi for that card (first time only). Harder parts pay more.
   ===================================================================== */
(function () {
  'use strict';
  var CUES = [['wave', 'Pronti?'], ['finger-up', 'Capisci?'], ['beckon', 'Andiamo!'], ['present', 'Ancora!'], ['point-you', 'E dai!'], ['open-hands', 'E!!']];
  var n = 0;
  /* one pick card: English shown, pick the Italian */
  function card(en, it, wrong, mem) { return { say: [CUES[n++ % CUES.length]], en: en, it: it, opts: [it].concat(wrong), mem: mem }; }

  var PLAY = 'English “play” is two verbs in Italian: giocare for games and sports, suonare for instruments.';
  var ENDS = 'io -o · tu -i · lui/lei -a · noi -iamo · voi -ate · loro -ano';
  var HARD = 'Giocare keeps its hard k sound: add an h before i. Giochi, giochiamo.';

  BohLezione.register({
    id: 'piano1',
    level: 'italiano2',
    title: 'Facciamo un piano! 1',
    sub: 'Hobbies and -are verbs',
    vocaroo: 'https://vocaroo.com',
    bonus: 5,

    sections: [

      /* ================= STOP 1 · I PASSATEMPI ================= */
      { id: 'pass1', type: 'pick', label: 'I passatempi', en: 'Hobbies, part 1', pay: 2,
        cards: [
          card('to play soccer', 'giocare a calcio', ['giocare a tennis', 'suonare la chitarra'], PLAY),
          card('to play tennis', 'giocare a tennis', ['giocare a calcio', 'guardare la TV'], 'Tennis is tennis. Giocare a + the sport.'),
          card('to play video games', 'giocare ai videogiochi', ['guardare un film', 'giocare a calcio'], 'Videogiochi = video games. Learn “ai videogiochi” as one piece.'),
          card('to play the guitar', 'suonare la chitarra', ['giocare a tennis', 'suonare il pianoforte'], PLAY),
          card('to play the piano', 'suonare il pianoforte', ['suonare la chitarra', 'ascoltare la musica'], 'Suonare, think “sound”. You make sound with an instrument.'),
          card('to watch a movie', 'guardare un film', ['guardare la TV', 'ascoltare la musica'], 'Film = movie. Guardare = to watch, to look at.'),
          card('to watch TV', 'guardare la TV', ['guardare un film', 'giocare ai videogiochi'], 'La TV. Say it: tee-VOO.'),
          card('to listen to music', 'ascoltare la musica', ['guardare la TV', 'suonare la chitarra'], 'Ascoltare = to listen to. No extra word for “to”: ascoltare la musica.')
        ] },

      { id: 'pass2', type: 'pick', label: 'Altri passatempi', en: 'Hobbies, part 2', pay: 2,
        cards: [
          card('to swim', 'nuotare', ['ballare', 'camminare'], 'Nuotare = to swim. You swim in piscina, in the pool.'),
          card('to dance', 'ballare', ['cantare', 'nuotare'], 'Ballare, think ballet and ballroom.'),
          card('to sing', 'cantare', ['ballare', 'cucinare'], 'Cantare, think chant.'),
          card('to draw', 'disegnare', ['cucinare', 'camminare'], 'Disegnare, think design.'),
          card('to cook', 'cucinare', ['cantare', 'disegnare'], 'Cucinare, think cuisine. La cucina = the kitchen.'),
          card('to walk', 'camminare', ['nuotare', 'cucinare'], 'Camminare = to walk. Two m, one n.')
        ] },

      { id: 'abbina1', type: 'match', label: 'Abbina', en: 'Match the hobbies', pay: 5,
        say: ['listen', 'Sei passatempi.'],
        pairs: [
          ['giocare a calcio', 'to play soccer'],
          ['suonare la chitarra', 'to play the guitar'],
          ['guardare un film', 'to watch a movie'],
          ['ascoltare la musica', 'to listen to music'],
          ['nuotare', 'to swim'],
          ['disegnare', 'to draw']
        ] },

      { id: 'tipiace', type: 'pick', label: 'Ti piace?', en: 'Asking what someone likes', pay: 3,
        cards: [
          card('What do you like to do?', 'Che cosa ti piace fare?', ['Che cosa fai il weekend?', 'Ti piace nuotare?'], 'Ti piace = do you like. Fare = to do.'),
          card('Do you like to swim?', 'Ti piace nuotare?', ['Mi piace nuotare.', 'Ti piace ballare?'], 'Ti piace...? asks YOU. The hobby stays in the -are form.'),
          card('Yes, I like to dance.', 'Sì, mi piace ballare.', ['Sì, ti piace ballare.', 'No, non mi piace ballare.'], 'Mi piace = I like. Ti piace = you like.'),
          card('No, I do not like to cook.', 'No, non mi piace cucinare.', ['No, mi piace cucinare.', 'No, non ti piace cucinare.'], 'Non goes first: non mi piace.'),
          card('I like to listen to music.', 'Mi piace ascoltare la musica.', ['Ti piace ascoltare la musica?', 'Mi piace guardare la TV.'], 'Mi piace + the -are form. Nothing else changes.')
        ] },

      { id: 'costruisci1', type: 'build', label: 'Costruisci', en: 'Build the sentence', pay: 4,
        say: ['finger-up', 'Costruisci la frase!'],
        items: [
          { en: 'I like to play soccer.', tiles: ['Mi piace', 'giocare', 'a calcio.'], extra: ['suonare'] },
          { en: 'Do you like to play the guitar?', tiles: ['Ti piace', 'suonare', 'la chitarra?'], extra: ['giocare'] },
          { en: 'I do not like to watch TV.', tiles: ['Non', 'mi piace', 'guardare', 'la TV.'], extra: ['ti piace'] },
          { en: 'What do you like to do?', tiles: ['Che cosa', 'ti piace', 'fare?'], extra: ['mi piace'] }
        ] },

      { id: 'scrivi1', type: 'write', label: 'Scrivi', en: 'Write it in Italian', pay: 3,
        say: ['tablet', 'Scrivi!'],
        items: [
          { it: 'Mi piace nuotare.', en: 'I like to swim.' },
          { it: 'Ti piace ballare?', en: 'Do you like to dance?' },
          { it: 'Mi piace guardare un film.', en: 'I like to watch a movie.' },
          { it: 'Non mi piace cantare.', en: 'I do not like to sing.' }
        ] },

      /* ================= STOP 2 · I VERBI IN -ARE (presente) ================= */
      { id: 'iotu', type: 'pick', label: 'Io e tu', en: 'Present tense: I and you', pay: 2,
        cards: [
          card('I play tennis. (io: take off -are, add -o)', 'Gioco a tennis.', ['Giochi a tennis.', 'Giocare a tennis.'], 'Io ends in -o: gioco.'),
          card('Do you play soccer? (tu: add -i)', 'Giochi a calcio?', ['Gioco a calcio?', 'Gioca a calcio?'], HARD),
          card('I play the guitar.', 'Suono la chitarra.', ['Suoni la chitarra.', 'Suonare la chitarra.'], 'Io ends in -o: suono.'),
          card('Do you listen to music?', 'Ascolti la musica?', ['Ascolto la musica?', 'Ascoltare la musica?'], 'Tu ends in -i: ascolti.'),
          card('I watch a movie.', 'Guardo un film.', ['Guardi un film.', 'Guarda un film.'], 'Io -o, tu -i: guardo, guardi.'),
          card('Are you dancing on Saturday?', 'Balli sabato?', ['Ballo sabato?', 'Balla sabato?'], 'Tu ends in -i: balli.')
        ] },

      { id: 'noi', type: 'pick', label: 'Noi', en: 'Present tense: we', pay: 3,
        cards: [
          card('We watch a movie. (noi: take off -are, add -iamo)', 'Guardiamo un film.', ['Guardo un film.', 'Guardi un film.'], 'Noi ends in -iamo: guardiamo.'),
          card('We play video games.', 'Giochiamo ai videogiochi.', ['Gioco ai videogiochi.', 'Giochi ai videogiochi.'], HARD),
          card('We listen to music.', 'Ascoltiamo la musica.', ['Ascolto la musica.', 'Ascolti la musica.'], 'Noi ends in -iamo: ascoltiamo.'),
          card('We sing.', 'Cantiamo.', ['Canto.', 'Canti.'], 'Canto, canti, cantiamo.'),
          card('We swim in the pool.', 'Nuotiamo in piscina.', ['Nuoto in piscina.', 'Nuoti in piscina.'], 'In piscina = in the pool. Noi: nuotiamo.'),
          card('We are dancing on Saturday.', 'Balliamo sabato.', ['Ballo sabato.', 'Balli sabato.'], 'Noi ends in -iamo: balliamo.')
        ] },

      { id: 'altri', type: 'pick', label: 'Lui, lei, voi, loro', en: 'Present tense: he, she, you all, they', pay: 3,
        cards: [
          card('Marcello plays the piano. (lui / lei: add -a)', 'Marcello suona il pianoforte.', ['Marcello suono il pianoforte.', 'Marcello suoni il pianoforte.'], 'Lui and lei end in -a: suona.'),
          card('Aurora draws.', 'Aurora disegna.', ['Aurora disegno.', 'Aurora disegni.'], 'Lei ends in -a: disegna.'),
          card('Are you all cooking on Sunday? (voi: add -ate)', 'Voi cucinate domenica?', ['Voi cucinano domenica?', 'Voi cuciniamo domenica?'], 'Voi ends in -ate: cucinate.'),
          card('You all walk.', 'Voi camminate.', ['Voi camminano.', 'Voi cammina.'], 'Voi ends in -ate: camminate.'),
          card('Marcello and Aurora sing. (loro: add -ano)', 'Marcello e Aurora cantano.', ['Marcello e Aurora canta.', 'Marcello e Aurora cantate.'], 'Loro ends in -ano: cantano.'),
          card('They swim.', 'Loro nuotano.', ['Loro nuota.', 'Loro nuotate.'], ENDS)
        ] },

      { id: 'giocare', type: 'pick', label: 'Giocare', en: 'The spelling change', pay: 3,
        cards: [
          card('you play (tu) · giocare', 'giochi', ['gioci', 'gioco'], HARD),
          card('we play (noi) · giocare', 'giochiamo', ['giociamo', 'giocamo'], HARD),
          card('Do you play tennis?', 'Tu giochi a tennis?', ['Tu gioci a tennis?', 'Tu gioco a tennis?'], HARD),
          card('We play soccer.', 'Noi giochiamo a calcio.', ['Noi giociamo a calcio.', 'Noi giocano a calcio.'], HARD)
        ] },

      { id: 'abbina2', type: 'match', label: 'Abbina', en: 'Match who is doing it', pay: 5,
        say: ['listen', 'Chi?'],
        pairs: [
          ['gioco', 'I play'],
          ['giochiamo', 'we play'],
          ['suoni', 'you play (an instrument)'],
          ['cantano', 'they sing'],
          ['guarda', 'he or she watches'],
          ['ballate', 'you all dance']
        ] },

      { id: 'costruisci2', type: 'build', label: 'Costruisci', en: 'Build the sentence', pay: 4,
        say: ['finger-up', 'Costruisci la frase!'],
        items: [
          { en: 'On Saturday I play tennis.', tiles: ['Sabato', 'gioco', 'a tennis.'], extra: ['giochi'] },
          { en: 'We watch a movie on Sunday.', tiles: ['Noi', 'guardiamo', 'un film', 'domenica.'], extra: ['guardo'] },
          { en: 'Do you play the guitar?', tiles: ['Tu', 'suoni', 'la chitarra?'], extra: ['suono'] },
          { en: 'Marcello and Aurora are dancing on Saturday.', tiles: ['Marcello e Aurora', 'ballano', 'sabato.'], extra: ['ballate'] }
        ] },

      { id: 'scrivi2', type: 'write', label: 'Scrivi', en: 'Write it in Italian (present tense)', pay: 4,
        say: ['tablet', 'Scrivi!'],
        items: [
          { it: 'Gioco a calcio.', en: 'I play soccer.' },
          { it: 'Tu ascolti la musica?', en: 'Do you listen to music? (start with Tu)' },
          { it: 'Guardiamo un film.', en: 'We watch a movie.' },
          { it: 'Giochiamo a tennis sabato.', en: 'We play tennis on Saturday.' }
        ] }
    ]
  });
})();
