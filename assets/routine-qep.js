/* =====================================================================
   Boh · "Quando ero piccolo/a"  (Italiano 3 Honors)
   THIS FILE IS THE WHOLE UNIT'S CONTENT. Edit words here; no other file needs to change.

   Reading guide
   - {o} in a word turns into "o" or "a" to match the student's Boh (timid{o} -> timido / timida).
   - "it" = Italian, "en" = English meaning (shown on tap), "pic" = the picture (an emoji).
   - The FIRST choice in each frame is the model sentence heard in Stage 1 and matched in Stage 2.
   - tu = the same choice said to a partner ("con mio fratello" -> "con tuo fratello").
   - yn:false = do not turn this choice into a yes/no question (gendered adjectives).
   - det = the detail chunks (Level 3) that read correctly after this frame. Keys are in DETAILS below.
   - Payouts (BC) are at the bottom, in one list.
   ===================================================================== */
BohRoutine.register({
  id: 'qep',
  title: 'Quando ero piccolo/a',
  tab: 'Quando ero piccolo/a',
  tabSub: 'ASCOLTA · PARLA',
  intro: 'Tell the story of you as a little kid. You will listen, match, write, record, talk with a partner, and build longer sentences. You already know all these verbs in the present. The only new thing is the past: gioco → giocavo.',
  chooseCount: 10,      // how many sentences each student chooses
  ladderCount: 5,       // how many of those they build up in Stage 7
  vocaroo: 'https://vocaroo.com',

  /* ---------- THE 14 FRAMES ---------- */
  frames: [
    { id: 'ero', it: 'Ero', en: 'I was', enNo: 'I wasn’t', cue: '🧒',
      presentIt: 'sono', presentEn: 'I am', now: 'sono', nowEn: 'I am', enAlways: 'I was always',
      q: 'Com’eri da piccol{o/a}?', qEn: 'What were you like as a kid?', tu: 'Eri', tuEn: 'Were you',
      det: ['sempre', 'casa', 'parco', 'amici'],
      choices: [
        { it: 'timid{o}', en: 'shy', pic: '🤫', yn: false },
        { it: 'felice', en: 'happy', pic: '😊' },
        { it: 'curios{o}', en: 'curious', pic: '🧐', yn: false },
        { it: 'simpatic{o}', en: 'nice (friendly)', pic: '😄', yn: false },
        { it: 'vivace', en: 'lively', pic: '⚡' } ] },

    { id: 'avevo', it: 'Avevo', en: 'I had', enNo: 'I didn’t have', cue: '🎁',
      presentIt: 'ho', presentEn: 'I have', now: 'ho', nowEn: 'I have',
      q: 'Che cosa avevi?', qEn: 'What did you have?', tu: 'Avevi', tuEn: 'Did you have',
      det: ['casa', 'sempre'],
      choices: [
        { it: 'un cane', en: 'a dog', pic: '🐶' },
        { it: 'un gatto', en: 'a cat', pic: '🐱' },
        { it: 'una bici', en: 'a bike', pic: '🚲' },
        { it: 'un fratello', en: 'a brother', pic: '👦' },
        { it: 'molti amici', en: 'a lot of friends', pic: '👫' } ] },

    { id: 'abitavo', it: 'Abitavo', en: 'I lived', enNo: 'I didn’t live', cue: '🏠',
      presentIt: 'abito', presentEn: 'I live', now: 'abito', nowEn: 'I live',
      q: 'Dove abitavi?', qEn: 'Where did you live?', tu: 'Abitavi', tuEn: 'Did you live',
      det: ['sempre', 'fratello'],
      choices: [
        { it: 'a Hamilton', en: 'in Hamilton', pic: '🏘️' },
        { it: 'a Trenton', en: 'in Trenton', pic: '🏙️' },
        { it: 'in città', en: 'in the city', pic: '🌆' },
        { it: 'in campagna', en: 'in the country', pic: '🌾' } ] },

    { id: 'giocoa', it: 'Giocavo', en: 'I played', enNo: 'I didn’t play', cue: '🏃',
      presentIt: 'gioco', presentEn: 'I play', now: 'gioco', nowEn: 'I play',
      q: 'A cosa giocavi?', qEn: 'What did you play?', tu: 'Giocavi', tuEn: 'Did you play',
      det: ['ogni', 'dopo', 'sempre', 'parco', 'fratello', 'amici'],
      choices: [
        { it: 'a calcio', en: 'soccer', pic: '⚽' },
        { it: 'a basket', en: 'basketball', pic: '🏀' },
        { it: 'a baseball', en: 'baseball', pic: '⚾' },
        { it: 'a nascondino', en: 'hide and seek', pic: '🙈' },
        { it: 'a carte', en: 'cards', pic: '🃏' } ] },

    { id: 'giococon', it: 'Giocavo', en: 'I played', enNo: 'I didn’t play', cue: '🤝',
      presentIt: 'gioco', presentEn: 'I play', now: 'gioco', nowEn: 'I play',
      q: 'Con chi giocavi?', qEn: 'Who did you play with?', tu: 'Giocavi', tuEn: 'Did you play',
      det: ['ogni', 'dopo', 'sempre', 'parco', 'casa'],
      choices: [
        { it: 'con mio fratello', en: 'with my brother', tu: 'con tuo fratello', tuEn: 'with your brother', pic: '👦' },
        { it: 'con mia sorella', en: 'with my sister', tu: 'con tua sorella', tuEn: 'with your sister', pic: '👧' },
        { it: 'con i miei amici', en: 'with my friends', tu: 'con i tuoi amici', tuEn: 'with your friends', pic: '👫' },
        { it: 'con il mio cane', en: 'with my dog', tu: 'con il tuo cane', tuEn: 'with your dog', pic: '🐕' },
        { it: 'con le bambole', en: 'with dolls', pic: '🧸' } ] },

    { id: 'piaceva', it: 'Mi piaceva', en: 'I liked', enNo: 'I didn’t like', cue: '❤️',
      presentIt: 'mi piace', presentEn: 'I like', now: 'mi piace', nowEn: 'I like', vtok: 2,
      q: 'Che cosa ti piaceva?', qEn: 'What did you like?', tu: 'Ti piaceva', tuEn: 'Did you like',
      det: ['sempre', 'ogni', 'amici', 'fratello'],
      choices: [
        { it: 'la pizza', en: 'pizza', pic: '🍕' },
        { it: 'il gelato', en: 'ice cream', pic: '🍦' },
        { it: 'la scuola', en: 'school', pic: '🏫' },
        { it: 'cantare', en: 'singing', pic: '🎤' },
        { it: 'disegnare', en: 'drawing', pic: '🎨' } ] },

    { id: 'nonpiaceva', it: 'Non mi piaceva', en: 'I didn’t like', enNo: 'I liked', cue: '👎',
      presentIt: 'non mi piace', presentEn: 'I don’t like', now: 'mi piace', nowEn: 'I like',
      yesIt: 'mi piaceva', noIt: 'non mi piaceva', yesEn: 'I liked', noEn: 'I didn’t like',
      q: 'Che cosa non ti piaceva?', qEn: 'What didn’t you like?', tu: 'Ti piaceva', tuEn: 'Did you like',
      det: ['casa', 'ogni'],
      choices: [
        { it: 'il pesce', en: 'fish', pic: '🐟' },
        { it: 'la verdura', en: 'vegetables', pic: '🥦' },
        { it: 'la scuola', en: 'school', pic: '🏫' },
        { it: 'dormire', en: 'sleeping', pic: '😴' },
        { it: 'leggere', en: 'reading', pic: '📖' } ] },

    { id: 'credevo', it: 'Credevo', en: 'I believed', enNo: 'I didn’t believe', cue: '💭',
      presentIt: 'credo', presentEn: 'I believe', now: 'credo', nowEn: 'I believe',
      q: 'In che cosa credevi?', qEn: 'What did you believe in?', tu: 'Credevi', tuEn: 'Did you believe',
      det: ['sempre', 'ogni'],
      choices: [
        { it: 'in Babbo Natale', en: 'in Santa Claus', pic: '🎅' },
        { it: 'nella Befana', en: 'in the Befana (the Epiphany witch)', pic: '🧹' },
        { it: 'nella fatina dei denti', en: 'in the tooth fairy', pic: '🦧' },
        { it: 'nei mostri', en: 'in monsters', pic: '👹' },
        { it: 'nei fantasmi', en: 'in ghosts', pic: '👻' },
        { it: 'nella magia', en: 'in magic', pic: '✨' } ] },

    { id: 'amavo', it: 'Amavo', en: 'I loved', enNo: 'I didn’t love', cue: '💞',
      presentIt: 'amo', presentEn: 'I love', now: 'amo', nowEn: 'I love',
      q: 'Chi amavi?', qEn: 'Who did you love?', tu: 'Amavi', tuEn: 'Did you love',
      det: ['sempre', 'ogni'],
      choices: [
        { it: 'mia nonna', en: 'my grandma', tu: 'tua nonna', tuEn: 'your grandma', pic: '👵' },
        { it: 'mio nonno', en: 'my grandpa', tu: 'tuo nonno', tuEn: 'your grandpa', pic: '👴' },
        { it: 'mia mamma', en: 'my mom', tu: 'tua mamma', tuEn: 'your mom', pic: '👩' },
        { it: 'il mio cane', en: 'my dog', tu: 'il tuo cane', tuEn: 'your dog', pic: '🐕' },
        { it: 'i miei amici', en: 'my friends', tu: 'i tuoi amici', tuEn: 'your friends', pic: '👫' } ] },

    { id: 'andavo', it: 'Andavo', en: 'I went', enNo: 'I didn’t go', cue: '🚶',
      presentIt: 'vado', presentEn: 'I go', now: 'vado', nowEn: 'I go',
      q: 'Dove andavi?', qEn: 'Where did you go?', tu: 'Andavi', tuEn: 'Did you go',
      det: ['ogni', 'dopo', 'sempre', 'fratello', 'amici'],
      choices: [
        { it: 'al parco', en: 'to the park', pic: '🌳' },
        { it: 'a scuola', en: 'to school', pic: '🏫' },
        { it: 'al mare', en: 'to the beach', pic: '🏖️' },
        { it: 'in piscina', en: 'to the pool', pic: '🏊' },
        { it: 'dai nonni', en: 'to my grandparents’ house', pic: '🏡' } ] },

    { id: 'mangiavo', it: 'Mangiavo', en: 'I ate', enNo: 'I didn’t eat', cue: '😋',
      presentIt: 'mangio', presentEn: 'I eat', now: 'mangio', nowEn: 'I eat',
      q: 'Che cosa mangiavi?', qEn: 'What did you eat?', tu: 'Mangiavi', tuEn: 'Did you eat',
      det: ['sempre', 'ogni', 'casa', 'dopo', 'fratello', 'amici'],
      choices: [
        { it: 'la pasta', en: 'pasta', pic: '🍝' },
        { it: 'la pizza', en: 'pizza', pic: '🍕' },
        { it: 'il gelato', en: 'ice cream', pic: '🍦' },
        { it: 'i biscotti', en: 'cookies', pic: '🍪' },
        { it: 'le caramelle', en: 'candy', pic: '🍬' } ] },

    { id: 'guardavo', it: 'Guardavo', en: 'I watched', enNo: 'I didn’t watch', cue: '👀',
      presentIt: 'guardo', presentEn: 'I watch', now: 'guardo', nowEn: 'I watch',
      q: 'Che cosa guardavi?', qEn: 'What did you watch?', tu: 'Guardavi', tuEn: 'Did you watch',
      det: ['ogni', 'dopo', 'casa', 'sempre', 'fratello'],
      choices: [
        { it: 'i cartoni', en: 'cartoons', pic: '🐭' },
        { it: 'la TV', en: 'TV', pic: '📺' },
        { it: 'i film', en: 'movies', pic: '🎬' },
        { it: 'YouTube', en: 'YouTube', pic: '▶️' },
        { it: 'lo sport', en: 'sports', pic: '🏟️' } ] },

    { id: 'suonavo', it: 'Suonavo', en: 'I played (an instrument)', enNo: 'I didn’t play', cue: '🎼',
      presentIt: 'suono', presentEn: 'I play (an instrument)', now: 'suono', nowEn: 'I play',
      enShort: 'I played',
      q: 'Che strumento suonavi?', qEn: 'What instrument did you play?', tu: 'Suonavi', tuEn: 'Did you play',
      det: ['ogni', 'dopo', 'sempre', 'casa', 'amici'],
      choices: [
        { it: 'la chitarra', en: 'the guitar', pic: '🎸' },
        { it: 'il pianoforte', en: 'the piano', pic: '🎹' },
        { it: 'il violino', en: 'the violin', pic: '🎻' },
        { it: 'la batteria', en: 'the drums', pic: '🥁' },
        { it: 'il flauto', en: 'the flute', pic: '🎵' },
        { it: 'la tromba', en: 'the trumpet', pic: '🎺' },
        { it: 'il sassofono', en: 'the saxophone', pic: '🎷' } ] },

    { id: 'leggevo', it: 'Leggevo', en: 'I read', enNo: 'I didn’t read', cue: '📖',
      presentIt: 'leggo', presentEn: 'I read', now: 'leggo', nowEn: 'I read',
      q: 'Che cosa leggevi?', qEn: 'What did you read?', tu: 'Leggevi', tuEn: 'Did you read',
      det: ['ogni', 'dopo', 'casa', 'sempre'],
      choices: [
        { it: 'molti libri', en: 'a lot of books', pic: '📚' },
        { it: 'i fumetti', en: 'comics', pic: '💥' },
        { it: 'le favole', en: 'fairy tales', pic: '🧚' },
        { it: 'le riviste', en: 'magazines', pic: '📰' },
        { it: 'le storie', en: 'stories', pic: '📖' } ] }
  ],

  /* ---------- LEVEL 2 OPENERS and LEVEL 3 DETAIL CHUNKS ---------- */
  openers: [
    { it: 'Da bambin{o}', en: 'As a kid', comma: false },
    { it: 'Quando ero piccol{o}', en: 'When I was little', comma: true }
  ],
  details: {
    sempre:   { it: 'sempre',           en: 'always',         pos: 'verb' },
    ogni:     { it: 'ogni giorno',      en: 'every day' },
    dopo:     { it: 'dopo scuola',      en: 'after school' },
    casa:     { it: 'a casa',           en: 'at home' },
    parco:    { it: 'al parco',         en: 'at the park' },
    fratello: { it: 'con mio fratello', en: 'with my brother' },
    amici:    { it: 'con i miei amici', en: 'with my friends' }
  },
  adesso: { it: 'adesso', en: 'now' },

  /* ---------- STAGE 1: the connected story (heard first) ---------- */
  passageTitle: 'Una storia: così ero io',
  passageTitleEn: 'A story: this is how I was',
  passage: [
    ['Quando ero piccol{o}, ero timid{o}.', 'When I was little, I was shy.', '🧒'],
    ['Abitavo a Trenton.', 'I lived in Trenton.', '🏙️'],
    ['Avevo un gatto.', 'I had a cat.', '🐱'],
    ['Avevo un fratello.', 'I had a brother.', '👦'],
    ['Giocavo a basket con mio fratello.', 'I played basketball with my brother.', '🏀'],
    ['Mi piaceva il gelato.', 'I liked ice cream.', '🍦'],
    ['Non mi piaceva la verdura.', 'I didn’t like vegetables.', '🥦'],
    ['Credevo nella Befana.', 'I believed in the Befana.', '🧹'],
    ['Amavo mia nonna.', 'I loved my grandma.', '👵'],
    ['Andavo dai nonni.', 'I went to my grandparents’ house.', '🏡'],
    ['Mangiavo i biscotti.', 'I ate cookies.', '🍪'],
    ['Guardavo i cartoni.', 'I watched cartoons.', '🐭'],
    ['Suonavo il pianoforte.', 'I played the piano.', '🎹'],
    ['Leggevo i fumetti.', 'I read comics.', '💥'],
    ['Ero felice.', 'I was happy.', '😊']
  ],

  /* ---------- STAGE 5: reactions and the optional "keep talking" questions ---------- */
  reactions: [
    { it: 'Anch’io!', en: 'Me too!', pic: '🙋', common: true },
    { it: 'Io no!',        en: 'Not me!', pic: '🙅' },
    { it: 'Davvero?',      en: 'Really?', pic: '😮' },
    { it: 'Che bello!',    en: 'How nice!', pic: '🤩' }
  ],
  keepTalking: ['leggevo:0', 'guardavo:0', 'credevo:2'],   // frame id : choice number (starts at 0)

  /* ---------- LA TABELLA: tips and tricks (everyone) ---------- */
  tips: [
    { id: 't1', title: 'A V before the O', body: [
      'Every “I used to” word in this unit ends in **-vo**: avevo, giocavo, credevo, leggevo.',
      'Hear a V before the O, and you are in the past.',
      'One exception: **ero** (I was).'] },
    { id: 't2', title: 'Say the pair, out loud', body: [
      'sono → **ero** · ho → **avevo** · abito → **abitavo** · gioco → **giocavo**',
      'mi piace → **mi piaceva** · credo → **credevo** · amo → **amavo** · vado → **andavo**',
      'mangio → **mangiavo** · guardo → **guardavo** · suono → **suonavo** · leggo → **leggevo**',
      'Say each pair three times in a row (“gioco, giocavo”). The change is small: you add -vo.'] },
    { id: 't3', title: 'Italianize the words', body: [
      '1. Say the English word with Italian vowels. 2. Swap the ending. 3. Check it in a sentence.',
      '-tion → **-zione** (nation → nazione) · -ty → **-tà** (university → università) · -ous → **-oso** (curious → curioso, famous → famoso)',
      'Works in this unit: curious → **curioso** · violin → **violino** · flute → **flauto** · magic → **magia** · monsters → **mostri** · phantoms → **fantasmi**'] },
    { id: 't4', title: 'Careful: false friends', body: [
      '**simpatico** means nice and friendly, not “sympathetic”.',
      '**cartone** is a cartoon, but also cardboard. **batteria** is the drums, but also a battery.',
      'If an Italianized guess does not fit the picture, trust the picture.'] },
    { id: 't5', title: 'Memory hooks', body: [
      'abitavo → “habitat” · credevo → “credible”, “creed” · leggevo → “legible”, “legend”',
      'amavo → “amateur” (someone who loves it) · giocavo → “joke”, “jocular” · suonavo → “sound” · guardavo → “guard”'] },
    { id: 't6', title: 'Chunks, not words', body: [
      'Learn “a calcio”, “con mio fratello”, “dai nonni” as ONE piece, like a line in a song.',
      'You never have to choose the little words (a, con, al, nella). The chunk already has them right.'] },
    { id: 't7', title: 'A movie in your head', body: [
      'Say each sentence while you picture yourself at about 8 years old, in that exact place.',
      'A picture plus a sentence sticks much longer than a sentence alone.'] },
    { id: 't8', title: 'Short and spread out', body: [
      'Come back for Ripasso on Day 2, Day 4 and Day 8. Five minutes each time.',
      'Short visits spread over a week beat one long cram. Your brain keeps what it has to fetch again.'] }
  ],

  /* ---------- LA TABELLA: extras for advanced students (they pay BC, they are never required) ---------- */
  extras: [
    { id: 'x1', title: 'Now say it to a friend: io → tu', body: [
      'ero → **eri** · avevo → **avevi** · abitavo → **abitavi** · giocavo → **giocavi**',
      'mi piaceva → **ti piaceva** · credevo → **credevi** · amavo → **amavi** · andavo → **andavi**',
      'mangiavo → **mangiavi** · guardavo → **guardavi** · suonavo → **suonavi** · leggevo → **leggevi**',
      'Io ends in -vo. Tu ends in -vi. That is the whole trick.'] },
    { id: 'x2', title: 'Say five without stopping', body: [
      'Pick five of your sentences. Say them one after the other with no pause and no peeking.',
      'Then say them again, but start with “Da bambin{o}” each time.'] },
    { id: 'x3', title: 'Then and now with “ma”', body: [
      'Giocavo a calcio, **ma** adesso suono la chitarra.',
      'Make three of your own: one sentence in the past, **ma adesso**, one in the present.'] },
    { id: 'x4', title: 'More verbs, same trick', body: [
      'You already know these as infinitives: cantare → **cantavo** · disegnare → **disegnavo** · leggere → **leggevo** · dormire → **dormivo**',
      '-are → -avo · -ere → -evo · -ire → -ivo. Say: “Cantavo. Disegnavo. Dormivo.”'] },
    { id: 'x5', title: 'Rewrite the story', body: [
      'Go back to “Una storia: così ero io”. Change five lines so they are true about you.',
      'Say your new story out loud to your partner.'] }
  ],

  /* ---------- BOH CASHI PAYOUTS (everything in one list; the game’s prices are x5, so these are too) ---------- */
  bc: {
    s1: 30, s2: 40, s3: 40, s4: 30,
    s5: 20,          // the dialogue pays the least on purpose: the reward should never be the reason to talk
    s6: 30, s7: 40,
    allSeven: 75,    // bonus for finishing all seven stages
    level4: 25,      // bonus for reaching Level 4 on any sentence
    ripasso: 15,     // each Ripasso
    extra: 10,       // each Extra card marked done
    extraCap: 50     // most BC from Extras in this unit
  }
});
