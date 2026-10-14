/* What the student's own Boh says on the finish screen, in the first person, in English.
   The Boh is the student, so every line starts "Now I know how to say" and names only what THAT unit taught.
   One list for every level. To change or add a unit: edit LINES below (key = the unit's key in that level's BT_LESSONS).
   Lines were drafted from each unit's own stops and sample bubbles; not yet checked against the curriculum guide. */
(function () {
  var S = 'Now I know how to say ';
  var N = 'Now I know '; /* for lines that already begin "how to": avoids "how to say how to" */
  var SPORT = S + 'what sports I like, what the weather is, and when my birthday is!';
  var CAN = S + 'what I do, what I want, must and can do, and how to invite someone!';
  var USED = S + 'what I used to do and what things used to be like!';
  var LINES = {
    italiano1: {
      u1: S + 'hello and goodbye!'
    },
    italiano2: {
      u2: SPORT,
      u3: CAN
    },
    italiano3: {
      pp: S + 'what I do today and what I did yesterday!',
      pi: N + 'how to tell a story: what it was like, and what happened all of a sudden!',
      imp: USED
    },
    italiano4: {
      r3: USED,
      r4: S + 'what I did and where I went!',
      r6: S + 'what was going on when something else happened!',
      r7: N + 'how to give orders and tell someone what to do!',
      r8: S + 'what I will be and what I will do in the future!',
      r1: S + 'my daily routine: I wake up, wash and get dressed!',
      r2: S + 'what we do with each other: we see each other, they see each other!',
      r5: S + 'in the past, what I did to myself and what we did to each other!'
    },
    ap: {
      f1: N + 'how to talk about my family and community: how it was, and what had happened before!',
      u2: N + 'how to share my opinions and doubts: I think that, I hope that, I doubt that!',
      u3: S + 'what I would do, what I would like, and what I would enjoy!',
      u4: S + 'what the future will be like!',
      u5: N + 'how to give advice: what to do and what not to do!',
      u6: N + 'how to tell a story: what it was like, what was happening, and what happened next!'
    }
  };
  var FALLBACK = S + 'it in Italian!';
  function level() {
    var m = /\/(italiano[1-4]|ap)\//.exec(location.pathname);
    return m ? m[1] : '';
  }
  window.BohFinish = {
    lines: LINES,
    line: function (unit) {
      var lv = level(), L = LINES[lv], X = (window.BohFinishExtra || {})[lv];   /* X: the new units' lines, from tools/units-src/build.js */
      return (L && L[unit]) || (X && X[unit]) || FALLBACK;
    }
  };
})();
