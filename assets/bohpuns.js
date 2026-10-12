/* Prof. Lo So's Boh puns. One per day, a different one each day, cycling through the list.
   Edit, add or remove puns in PUNS below. Each is [Italian, English].
   1-6 come from Assunta's sticker sheet; 7 is hers; 8-12 were written by Claude.
   English lines are Claude's translations: not yet checked by Assunta.
   Level fit is not yet checked: fammi / dammi / scopriamolo use attached pronouns; indizio and ieri may be new words. */
(function () {
  var PUNS = [
    ['Boh? Scopriamolo!', 'Boh? Let’s find out!'],
    ['Da Boh a Lo So!', 'From “I don’t know” to “I know it”!'],
    ['Boh… per ora!', 'Boh… for now!'],
    ['Boh? Fammi provare!', 'Boh? Let me try!'],
    ['Prima Boh. Poi Lo So!', 'First boh. Then I know it!'],
    ['Boh? Dammi un indizio!', 'Boh? Give me a clue!'],
    ['Un-BOH-livable!', 'Unbelievable!'],
    ['Incredi-BOH-le!', 'Incredible!'],
    ['Bra-BOH!', 'Bravo!'],
    ['Fanta-BOH-stico!', 'Fantastic!'],
    ['No-BOH-dy does it better!', 'Nobody does it better!'],
    ['Ieri boh. Oggi lo so!', 'Yesterday: boh. Today: I know it!']
  ];
  /* Day number from the device's local calendar date, so it changes at local midnight. */
  function dayNumber() {
    var d = new Date();
    return Math.floor(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()) / 86400000);
  }
  window.BohPuns = {
    list: PUNS,
    today: function () {
      var p = PUNS[dayNumber() % PUNS.length];
      return { it: p[0], en: p[1] };
    }
  };
})();
