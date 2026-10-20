/* Boh · "Parla con Prof" questions for ITALIANO 2. THIS FILE IS THE WHOLE LIST. Edit the questions here; no other file needs to change.
   Each unit has exactly 3 questions: it = what the student reads and says, en = the English help line.
   These questions are the teacher's own (approved by Assunta Scotto, October 2026), so there is no placeholder tag.
   Level rule: use only what that unit has already taught (Page 2 = the three word decks of Page 2 + Page 1; Page 3 = posso, voglio, devo + the verbs and words of Pages 1 and 2).
   Review unit Page 1 (ea) and Page 4 (u4) have no Parla questions yet, so they show no Parla step.
   Created by Assunta Scotto, 2026. Not for redistribution. */
/* alt: [...] = similar versions of the same question. The in-person practice page (interrogazioni/) rotates them so students get different but similar questions; the recording page ignores them.
   The alt versions are DRAFTS written by Claude (13 Oct 2026), not yet approved by Assunta or checked by a native speaker. Delete or edit any line freely. A question with no alt simply shows as it is. */
window.BohParlaData = window.BohParlaData || {};
window.BohParlaData.italiano2 = {
  u2: {
    title: 'Il tempo libero',
    questions: [
      { it: 'Ti piace ascoltare musica o guardare la TV?', en: 'Do you like listening to music or watching TV?', alt: [{ it: 'Ti piace guardare la TV o ascoltare musica?', en: 'Do you like watching TV or listening to music?' }] },
      { it: 'Che tempo fa oggi?', en: 'What’s the weather like today?', alt: [{ it: 'Fa caldo o fa freddo oggi?', en: 'Is it hot or cold today?' }] },
      { it: 'Quando è il tuo compleanno?', en: 'When is your birthday?', alt: [{ it: 'In che mese è il tuo compleanno?', en: 'What month is your birthday in?' }] }
    ]
  },
  u3: {
    title: 'Posso, voglio, devo',
    questions: [
      { it: 'Puoi venire al cinema domani?', en: 'Can you come to the movies tomorrow?', alt: [{ it: 'Puoi venire a casa mia sabato?', en: 'Can you come to my house on Saturday?' }] },
      { it: 'Vuoi andare a casa oggi?', en: 'Do you want to go home today?', alt: [{ it: 'Vuoi andare al cinema domani?', en: 'Do you want to go to the movies tomorrow?' }] },
      { it: 'Devi andare in bagno?', en: 'Do you have to go to the bathroom?', alt: [{ it: 'Devi andare a scuola domani?', en: 'Do you have to go to school tomorrow?' }] }
    ]
  },
  /* pvd = "Posso, devo, voglio + 14 verbi" (added 19 Oct 2026). These three are DRAFTS by Claude, not yet approved by Assunta. Edit freely. */
  pvd: {
    title: 'Bonus · Posso, devo, voglio + 14 verbi',
    questions: [
      { it: 'Cosa vuoi fare oggi?', en: 'What do you want to do today? (Voglio …)', alt: [{ it: 'Cosa vuoi fare domani?', en: 'What do you want to do tomorrow? (Voglio …)' }] },
      { it: 'Cosa devi fare a casa?', en: 'What do you have to do at home? (Devo …)', alt: [{ it: 'Cosa devi fare stasera?', en: 'What do you have to do tonight? (Devo …)' }] },
      { it: 'Cosa puoi fare a scuola? E cosa non puoi fare?', en: 'What can you do at school? And what can\'t you do? (Posso … / Non posso …)', alt: [{ it: 'Cosa non puoi fare in classe?', en: 'What can\'t you do in class? (Non posso …)' }] }
    ]
  }
};
/*boh-units-v1:start*/(function(){try{var P=window.BohParlaData=window.BohParlaData||{};P["italiano2"]=P["italiano2"]||{};var N={"feste":{"title":"Le feste e la famiglia","questions":[{"it":"Qual è la tua festa preferita?","en":"What is your favorite holiday?"},{"it":"Come festeggi il compleanno?","en":"How do you celebrate your birthday?"},{"it":"Che cosa dici a un amico per il compleanno?","en":"What do you say to a friend on their birthday?"}]},"cibo":{"title":"Buon appetito","questions":[{"it":"Che cosa mangi a colazione?","en":"What do you eat for breakfast?"},{"it":"Ti piace la pasta?","en":"Do you like pasta?"},{"it":"Che cosa vuoi bere?","en":"What do you want to drink?"}]},"weekend":{"title":"Il mio weekend","questions":[{"it":"Che cosa hai fatto sabato?","en":"What did you do on Saturday?"},{"it":"Che cosa fa il tuo amico il fine settimana?","en":"What does your friend do on the weekend?"},{"it":"Che cosa non fai più?","en":"What don't you do anymore?"}]},"passato":{"title":"Quando ero piccolo/a","questions":[{"it":"Dove abitavi a cinque anni?","en":"Where did you live when you were five?"},{"it":"Qual era il tuo gioco preferito?","en":"What was your favorite game?"},{"it":"Avevi un animale?","en":"Did you have a pet?"}]}};for(var k in N)if(!P["italiano2"][k])P["italiano2"][k]=N[k];}catch(e){}})();/*boh-units-v1:end*/
