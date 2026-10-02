# Italiano 4 · Unità 1 (L'imperfetto) — the version WITH reflexive verbs

Taken out on 2026-10-02 because the students had not learned reflexives with the imperfetto well enough.
To bring reflexives back later: copy the lines below over the `r3` block in `it4_units.py` (build script), rebuild.
Removed: alzarsi, divertirsi, addormentarsi (forms, flashcards), the r3d tip, the Nonno dialogue lines, and the matching typing, tile, speaking and translation items.

```python
# ------------------------------------------------------------------ 3
U.append(dict(
    key='r3', n=3, tense='imperf', title='L’IMPERFETTO', short='UNITÀ 3 · L’IMPERFETTO', tab='L’imperfetto', persons=[0, 1, 2, 3, 4, 5],
    verbs=[('giocare', 'to play'), ('leggere', 'to read'), ('dormire', 'to sleep'), ('essere', 'to be'), ('fare', 'to do / make'), ('bere', 'to drink'), ('dire', 'to say'),
           ('alzarsi', 'to get up'), ('divertirsi', 'to have fun'), ('addormentarsi', 'to fall asleep')],
    table=['giocare', 'leggere', 'essere'],
    head='L’imperfetto: how things used to be.',
    tips={'r3a': ['vo · vi · va · vamo · vate · vano', 'Every regular verb gets the same heartbeat. Keep the vowel of the infinitive: giocAre → giocAvo, leggEre → leggEvo, dormIre → dormIvo.'],
          'r3b': ['Essere is the rebel', 'ero · eri · era · eravamo · eravate · erano.'],
          'r3c': ['Old stems', 'fare → facevo · bere → bevevo · dire → dicevo. Only the stem changes; the heartbeat is the same.'],
          'r3d': ['Reflexive: same rule', 'mi alzavo · ti alzavi · si alzava. The little word comes first.']},
    tipof=lambda a, p: 'r3b' if re_in(a, ['ero', 'eri', 'era', 'eravamo', 'eravate', 'erano']) else ('r3c' if re_in2(a, ['face', 'beve', 'dice']) else ('r3d' if p else 'r3a')),
    vocab=[('da piccolo', 'as a little kid', 'Da piccolo giocavo sempre fuori.', 'As a little kid I always played outside.'),
           ('sempre', 'always', 'Giocavamo sempre a carte.', 'We always played cards.'),
           ('spesso', 'often', 'La nonna cucinava spesso.', 'Grandma often cooked.'),
           ('ogni estate', 'every summer', 'Ogni estate andavamo al mare.', 'Every summer we went to the beach.'),
           ('mentre', 'while', 'Mentre mangiavo, leggevo.', 'While I was eating, I was reading.'),
           ('i nonni', 'the grandparents', 'I nonni abitavano in campagna.', 'My grandparents lived in the country.'),
           ('il giocattolo', 'the toy', 'Il mio giocattolo preferito era un orso.', 'My favorite toy was a bear.'),
           ('il cortile', 'the yard', 'Giocavamo nel cortile.', 'We used to play in the yard.'),
           ('la bicicletta', 'the bicycle', 'Andavo a scuola in bicicletta.', 'I used to go to school by bike.'),
           ('l’infanzia', 'childhood', 'La mia infanzia era felice.', 'My childhood was happy.'),
           ('di solito', 'usually', 'Di solito mi alzavo alle sette.', 'Usually I got up at seven.'),
           ('una volta', 'once / one time', 'Una volta ho visto una volpe.', 'Once I saw a fox.')],
    chat=dict(who=['Giulia', 'Nonno'], lines=[
        [0, 'Nonno, com’era la tua vita da piccolo? \U0001f474', 'Grandpa, what was your life like when you were little?'],
        [1, 'Mi alzavo presto e giocavo con gli amici. \U0001f305', 'I used to get up early and play with my friends.'],
        [0, 'Giocavi sempre fuori?', 'Did you always play outside?'],
        [1, 'Sì! Faceva caldo e noi ci divertivamo tanto.', 'Yes! It was hot and we used to have a lot of fun.'],
        [0, 'E la sera?', 'And in the evening?'],
        [1, 'Ci addormentavamo subito, stanchi e felici. \U0001f634', 'We used to fall asleep right away, tired and happy.']],
        words={'mi alzavo': 'I used to get up', 'giocavi': 'you used to play', 'faceva caldo': 'it was hot', 'ci divertivamo': 'we used to have fun', 'ci addormentavamo': 'we used to fall asleep', 'stanchi': 'tired', 'presto': 'early'},
        bubble='Da piccolo giocavo. E tu? Che cosa facevi?', q=[('What did Nonno do in the evening?', 'He fell asleep right away.', ['He played outside.', 'He read a book.'], 'Ci addormentavamo subito.')]),
    scrivi=[('Da piccolo, io ___ con i Lego.', 'giocare', ['giocavo'], 'io → -vo: giocavo.', 'r3a'), ('Ogni sera i nonni ___ un libro.', 'leggere', ['leggevano'], 'loro → -vano: leggevano.', 'r3a'),
            ('Da piccoli, noi ___ sempre al parco.', 'divertirsi', ['ci divertivamo'], 'ci + -vamo.', 'r3d'), ('Tu ___ molto da bambino?', 'dormire', ['dormivi'], 'tu → -vi: dormivi.', 'r3a'),
            ('Da piccolo, tu ___ timido?', 'essere', ['eri'], 'tu → eri.', 'r3b'), ('Mia madre ___ sempre “Buonanotte!”', 'dire', ['diceva'], 'dire → dic-eva.', 'r3c'),
            ('Voi ___ il tè ogni pomeriggio?', 'bere', ['bevevate'], 'bere → bev-evate.', 'r3c'), ('Io ___ presto la mattina.', 'alzarsi', ['mi alzavo'], 'mi + -vo.', 'r3d')],
    tiles=[('When I was little, I always woke up early.', ['Da piccol{o|a},', 'mi svegliavo', 'sempre', 'presto.'], ['mi sono svegliat{o|a}', 'si svegliava'], '“Sempre” → imperfetto.'),
           ('We used to have fun at the beach every summer.', ['Ci divertivamo', 'al mare', 'ogni estate.'], ['Ci siamo divertiti', 'Mi divertivo'], '“Ogni estate” = a habit.'),
           ('My grandmother used to say “Boh!”', ['Mia nonna', 'diceva', 'sempre “Boh!”'], ['dicevo', 'ha detto'], 'lei → diceva.')],
    parla=[['Da piccolo/a, a che ora ti addormentavi?', 'Mi addormentavo alle…'], ['Che cosa facevi ogni sabato?', 'Giocavo… · Facevo…'], ['Com’eri da piccolo/a?', 'Ero… · Avevo…']],
    trans=[('When I was little, I used to play.', 'Da piccolo giocavo.', ['Da piccola giocavo.', 'Quando ero piccolo giocavo.', 'Quando ero piccola giocavo.']), ('We used to have fun.', 'Ci divertivamo.', []),
           ('He used to read a lot.', 'Leggeva tanto.', ['Leggeva molto.']), ('I was happy.', 'Ero felice.', []), ('You used to wake up early.', 'Ti svegliavi presto.', []),
           ('It was cold.', 'Faceva freddo.', []), ('They used to sleep.', 'Dormivano.', []), ('We were at home.', 'Eravamo a casa.', [])],
))

```

## Also removed (Unità 3 · Imperfetto o passato prossimo?)
The vocabulary example for "di solito" was `Di solito mi alzavo alle sette.` / `Usually I got up at seven.` It is now `Di solito mangiavo alle sette.` / `Usually I ate at seven.` (in `it4_units.py`, unit `r6`). It feeds the vocab, listening and speaking cards.
