/* Boh · today's lesson for each level. Change this one file to point the pink "Today" bar at a new lesson.
   date = the day it is for (shown in Italian), title = what students see, url = where it opens, id + total = for the "x of y done" count.
   Optional: unit = open that unit inside the level page (Level 3), note = small line under the title, until = last day to show it (yyyy-mm-dd), so it switches itself off.
   Created by Assunta Scotto, 2026. */
window.BohToday = {
  italiano2: { date: 'lunedì 5 ottobre', title: 'What can I do, want to do, and have to do?', words: '(posso, voglio, devo)', url: '../in-classe/', id: 'inclasse', total: 10 },
  italiano3: { date: 'martedì 6 ottobre', title: "L'imperfetto", words: '(ero, avevo, giocavo)', url: '?unit=imp', unit: 'imp', note: 'Then do the next tab: Passato prossimo o imperfetto?', until: '2026-10-06' }
};

/* Units a class has finished (Level 3 only for now).
   true  = the unit stops being the main thing on the home screen, stops opening by itself, and its tab moves to the end of the row as RIPASSO. Still playable.
   false or delete the line = the unit is the main thing again.
   qep = "Quando ero piccolo/a". */
window.BohDone = {
  italiano3: { qep: true }
};
