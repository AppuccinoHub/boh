# A scuola 3 · Il mio diario — instructions for Claude

a-scuola-3/index.html is a finished, tested, self-contained lesson (Italian 2, -ARE verbs, presente). Turn it into a real Boh lesson in Unità 5, right after A scuola 1 and A scuola 2. Match Boh's existing look and code patterns (a-scuola-1, a-scuola-2, assets/lezione-ascuola1.js, assets/lezione.js, assets/lezione.css, assets/bohlook.css) and link it from italiano2/index.html under Unità 5 / scuolavita. Keep the content, order, feedback, timing and ladder from index.html exactly; only adapt it to Boh's structure. Work on this branch (are-verbs-a-scuola-3), not main.

## Lesson content (keep exactly)
- Verbs ONLY: studiare, parlare, mangiare, ascoltare, comprare, all six persons, presente. Plus essere and avere review with subject pronouns.
- Vocab only from Unità 5: la storia, il professore, la professoressa, il quaderno, un panino, la ricreazione, a scuola.
- 8 parts: 1 Quick check (pronouns + essere/avere), 2 Chi parla? 1, 3 Il mio diario · io, 4 Sono, ho (incl. è vs e), 5 Chi parla? 2, 6 Il nostro diario · noi, 7 Gli studenti · voi, loro, 8 graded Quiz (20 items: 14 typed, 6 Chi parla?).
- Students TYPE the verb forms (real recall). Missed items come back at the end of each part.

## Teaching rules (must follow)
1. NEVER visually split a verb. No "MANGI + ARE", no hyphens, no gaps, no separate boxes or drag pieces for stem and ending. One whole word with the root bold and underlined (MANGIare, mangio). The ending may be pink, but stays in the same word.
2. Teach: "-are acts like the word TO in English. In English we say to eat; in Italian it's mangiare." No note saying -are is not a separate word.
3. The ending shows who is talking, so the pronoun is usually dropped (Mangio un panino); answers with the pronoun are accepted.
4. studiare and mangiare keep one i: tu studi, tu mangi, noi studiamo, noi mangiamo. Explain that the root already ends in i.
5. Directions, buttons and feedback in English. Only tested Italian is in Italian. Clean textbook Italian, correct accents.
6. Feedback always explains WHY, in Boh's pink box: "Not yet. Look at the pink." then "It's: …" then the reason.
7. Accents: missing accents do NOT cost points, EXCEPT è vs e. "e" for "è" (is) is wrong, with feedback "è = is, e = and."
8. All text 16px+, high contrast, works without sound, fits 1366×768 and 390×844 with no sideways scrolling.
9. No logins, no data collection. Local storage only, and the lesson must never break if storage is blocked.

## Auto-advance
- Correct answer: green "Yes!" flash with a quick bar labeled "Moving on…", next card after 1 second (tapping the bar pauses). A correct answer after a miss also moves on after 1 second.
- Wrong answer: show the WHY and wait 2000 ms + 280 ms per word of feedback, min 4.5 s, max 9 s, with "tap to pause" and Next. Never skip a WHY before it's readable.
- Next always works. Reduced motion: no bar animation, keep the text. Learn screens never auto-advance.
- After a passed part: "Next: <part>. It starts by itself." and start it after 1.5 s, with a "Keep going ›" button.

## Ladder
- 8 parts = 8 rungs shown as rising bars (climbed teal, current pink, locked grey).
- Climb a rung with at least 85% right on the first try; otherwise the next rung stays locked. A climbed rung never drops.
- BC: 2 per right card (1 after a miss), first time only; 5 BC per rung climbed, once; replays pay 0.
- All 8 rungs climbed: "Ladder complete!" screen.

## Help ladder (per part, counts failed tries, resets on a pass)
- Try 1: "So close! You need N more right to pass." ("Not yet." under 70%).
- Try 2: "Review with Boh · 1 min": the most-missed pattern with examples; Try again locked until "I read it and said each one out loud."
- Try 3: "Write in your notebook": copy missed items by hand; locked until "I wrote it in my notebook."
- Try 4+: "Ask the Prof": raise your hand and show the Prof this screen (Round, Tries, Best %).

## Check-in (parts 1–7, not the quiz)
- Same mistake pattern twice in a part, or three misses in a row: show a check-in card after the WHY is read.
- Patterns: two persons confused (e.g. noi vs voi), one-i rule in studiare/mangiare, "to" form typed instead of a form showing who, essere vs avere, essere/avere forms, è vs e, dropping the pronoun.
- Title "Check-in: <pattern>", re-explain in English with whole-word examples, then "Got it, keep going ›".

## Quiz (Part 8, top rung)
- First wrong answer: a hint that doesn't give the answer, no auto-advance; second try = ½ point. Second wrong answer shows "It's: …" and the WHY.
- Pass = 85% of points; below that, the help ladder. A later bad try never lowers a climbed rung.
- 2 tries per device; name locks after the first try; teacher code 5697 resets tries and name.
- Result card: name, score, percent, date and time, missed items, and "Take a screenshot of this card and turn it in."

## Also fix (existing Italiano 2 pages)
- Boh's -are verb charts split stem and ending into separate pieces and are inconsistent (stud- vs studi-). Change every -are verb chart in Italiano 2 to whole words with the root bold and underlined (root studi / mangi), following rule 1.

## Before you finish
- Don't change other lessons or pages beyond the above.
- Check: no verb is split, every answer key is a correct conjugation, timings match, nothing under 16px.
- List every file you changed and why.
