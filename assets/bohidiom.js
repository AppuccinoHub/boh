/* Boh · "Modo di dire": one idiomatic expression for every unit, as a bonus card. ONE file for every level.
   Where it shows: on the lesson's finish screen ("LEZIONE FATTA!"), under the stats. Units with no lesson path (Italiano 1 Ripasso,
   Italiano 2 Page 1, Italiano 3 Ripasso) show it on the round summary screen instead. Never inside La Prova or any graded round.
   To change an idiom: edit IDIOMS below (level → unit key → it, en, ex, exEn, note). The new units' idioms are added by
   tools/units-src/build.js into window.BohIdiomExtra, so they live with the unit they belong to.
   Teacher approved the list on Oct 13, 2026. Every line still needs the teacher's ear on register and region.
   Created by Assunta Scotto, 2026. Not for redistribution. */
(function (W, D) {
  'use strict';
  if (W.BohIdiom) return;
  var m = /\/(italiano[1-4]|ap)\//.exec(W.location.pathname);
  var LV = m ? m[1] : '';
  var IDIOMS = {
    italiano1: {
      it1: { it: 'Essere al settimo cielo', en: 'to be on cloud nine', ex: 'Oggi sono al settimo cielo!', exEn: 'Today I am on cloud nine!', note: 'Literally "to be in the seventh heaven". Uses essere, the verb of this unit.' },
      u1: { it: 'Non c’è male', en: 'not bad', ex: '— Come stai? — Non c’è male, grazie!', exEn: '— How are you? — Not bad, thanks!', note: 'A very common answer to "Come stai?".' }
    },
    italiano2: {
      ea: { it: 'Essere al verde', en: 'to be broke', ex: 'Non ho soldi: sono al verde!', exEn: 'I have no money: I’m broke!', note: 'Literally "to be at the green". Uses essere.' },
      u2: { it: 'In bocca al lupo! · Crepi!', en: 'Good luck! · Thanks! (the traditional reply)', ex: '— Domani ho la partita. — In bocca al lupo! — Crepi!', exEn: '— Tomorrow I have the game. — Good luck! — Thanks!', note: 'Literally "into the wolf’s mouth". Never answer "grazie": say "Crepi!".' },
      u3: { it: 'Volere è potere', en: 'where there’s a will, there’s a way', ex: 'Voglio parlare italiano. Volere è potere!', exEn: 'I want to speak Italian. Where there’s a will, there’s a way!', note: 'A proverb with volere and potere, the verbs of this page.' },
      u4: { it: 'Parlare del più e del meno', en: 'to chat about this and that', ex: 'Al bar parliamo del più e del meno.', exEn: 'At the café we chat about this and that.', note: 'Literally "to talk about the more and the less". Uses parlare, an -are verb.' }
    },
    italiano3: {
      vdp: { it: 'Non ne posso più!', en: 'I can’t take it anymore!', ex: 'Tre verifiche oggi? Non ne posso più!', exEn: 'Three tests today? I can’t take it anymore!', note: 'Uses potere. Italians say it every day.' },
      imp: { it: 'C’era una volta…', en: 'once upon a time…', ex: 'C’era una volta un bambino che abitava in un piccolo paese.', exEn: 'Once upon a time there was a boy who lived in a small town.', note: 'How every Italian fairy tale starts, in the imperfetto. Also: "Ai miei tempi…" = "In my day…".' },
      pp: { it: 'Meglio tardi che mai', en: 'better late than never', ex: 'Ho finito i compiti alle undici. Meglio tardi che mai!', exEn: 'I finished my homework at eleven. Better late than never!', note: 'Same idea as in English.' },
      pi: { it: 'Fare una figuraccia', en: 'to make a fool of yourself', ex: 'Ieri sono caduto davanti a tutti: che figuraccia!', exEn: 'Yesterday I fell in front of everyone: how embarrassing!', note: 'Very common. "Che figuraccia!" = "How embarrassing!".' }
    },
    italiano4: {
      r3: { it: 'Si stava meglio quando si stava peggio', en: 'the good old days (weren’t so good)', ex: 'Il nonno dice sempre: si stava meglio quando si stava peggio.', exEn: 'Grandpa always says: things were better when they were worse.', note: 'A proverb in the imperfetto, said with a smile about the past.' },
      r4: { it: 'Fatto trenta, facciamo trentuno', en: 'in for a penny, in for a pound', ex: 'Abbiamo già pulito la cucina: fatto trenta, facciamo trentuno!', exEn: 'We already cleaned the kitchen: let’s finish the job!', note: 'A fixed phrase: once you have done most of it, do the last bit too. Recognize it, no need to conjugate it.' },
      r6: { it: 'Chi dorme non piglia pesci', en: 'the early bird catches the worm', ex: 'Mi sono svegliato tardi e ho perso il treno. Chi dorme non piglia pesci!', exEn: 'I woke up late and missed the train. The early bird catches the worm!', note: 'Literally "who sleeps catches no fish". "Piglia" is a casual word for "prende".' },
      r7: { it: 'Non mettere il carro davanti ai buoi', en: 'don’t put the cart before the horse', ex: 'Prima studia, poi esci! Non mettere il carro davanti ai buoi.', exEn: 'Study first, then go out! Don’t put the cart before the horse.', note: 'An imperativo: "i buoi" are oxen.' },
      r8: { it: 'Domani è un altro giorno', en: 'tomorrow is another day', ex: 'Oggi è andata male, ma domani è un altro giorno.', exEn: 'Today went badly, but tomorrow is another day.', note: 'Said to cheer someone up about the future.' },
      r1: { it: 'Alzarsi con il piede sbagliato', en: 'to get up on the wrong side of the bed', ex: 'Oggi mi sono alzato con il piede sbagliato.', exEn: 'Today I got up on the wrong side of the bed.', note: 'A reflexive verb, like the ones in this unit. Literally "with the wrong foot".' },
      r2: { it: 'Andare d’accordo come cane e gatto', en: 'to fight like cats and dogs', ex: 'Mio fratello e mia sorella vanno d’accordo come cane e gatto.', exEn: 'My brother and sister fight like cats and dogs.', note: 'Ironic: it means they do NOT get along. Same reciprocal idea as this unit (si vogliono bene, si capiscono).' },
      r5: { it: 'Prendersela comoda', en: 'to take it easy', ex: 'Ieri ce la siamo presa comoda e siamo arrivati tardi.', exEn: 'Yesterday we took it easy and arrived late.', note: 'A pronominal verb: me la prendo comoda, te la prendi comoda…' }
    },
    ap: {
      f1: { it: 'Il sangue non è acqua', en: 'blood is thicker than water', ex: 'Litighiamo spesso, ma il sangue non è acqua: ci aiutiamo sempre.', exEn: 'We argue often, but blood is thicker than water: we always help each other.', note: 'Family bonds are strong. Fits the theme Famiglie e comunità.' },
      u2: { it: 'Traduttore, traditore', en: 'translator, traitor', ex: 'Questa poesia in inglese perde la sua musica. Traduttore, traditore!', exEn: 'This poem in English loses its music. Translator, traitor!', note: 'A translation always loses something. Good for a cultural comparison essay.' },
      u3: { it: 'Fare di necessità virtù', en: 'to make a virtue of necessity', ex: 'Non avevano soldi per i colori, così hanno fatto di necessità virtù.', exEn: 'They had no money for paints, so they made a virtue of necessity.', note: 'Turning a limit into a strength. Fits Arte e creatività.' },
      u4: { it: 'Battere il ferro finché è caldo', en: 'to strike while the iron is hot', ex: 'L’idea funziona: battiamo il ferro finché è caldo!', exEn: 'The idea works: let’s strike while the iron is hot!', note: 'Act at the right moment.' },
      u5: { it: 'Vivere alla giornata', en: 'to live day to day', ex: 'Molti giovani oggi vivono alla giornata.', exEn: 'Many young people today live day to day.', note: 'Without long plans. Useful for Vita contemporanea.' },
      u6: { it: 'Tutto il mondo è paese', en: 'people are the same everywhere', ex: 'Anche in Giappone i ragazzi usano i social. Tutto il mondo è paese!', exEn: 'In Japan too, teens use social media. People are the same everywhere!', note: 'Literally "the whole world is a village". Good for Contesti globali.' }
    }
  };

  function esc(t) { return String(t == null ? '' : t).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function unitKey() { try { return W.BT_UNIT || (typeof BT_UNIT !== 'undefined' ? BT_UNIT : ''); } catch (e) { return ''; } }
  function get(lv, u) { var x = (W.BohIdiomExtra || {})[lv]; if (x && x[u]) return x[u]; return (IDIOMS[lv] || {})[u] || null; }
  function hasLesson(u) { try { return !!(typeof BT_LESSONS !== 'undefined' && BT_LESSONS[u]); } catch (e) { return false; } }

  var CSS = '.bid{align-self:stretch;border:2.5px dashed var(--accent-strong,#1A5CDF);border-radius:18px;padding:14px 16px;background:var(--card-bg,#fff);color:var(--text,#0E2A5B);display:flex;flex-direction:column;gap:6px;text-align:left}' +
    '.bid-k{font-size:16px;font-weight:800;letter-spacing:.06em;text-transform:uppercase;color:var(--accent-strong,#1A5CDF)}' +
    '.bid-it{font-size:24px;font-weight:800;line-height:1.2;display:flex;align-items:center;gap:10px;flex-wrap:wrap}' +
    '.bid-say{all:unset;cursor:pointer;width:44px;height:44px;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;background:var(--option-default-bg,#E2EBFB);font-size:20px}' +
    '.bid-say:focus-visible{outline:3px solid var(--text,#0E2A5B);outline-offset:2px}' +
    '.bid-en{font-size:18px;font-weight:700}' +
    '.bid-ex{font-size:18px;line-height:1.35}.bid-ex small{display:block;font-size:16px;color:var(--text-muted,#46566E)}' +
    '.bid-note{font-size:16px;color:var(--text-muted,#46566E);line-height:1.35}';
  function css() { if (D.getElementById('bid-css')) return; var s = D.createElement('style'); s.id = 'bid-css'; s.textContent = CSS; D.head.appendChild(s); }
  function card(x) {
    var d = D.createElement('div'); d.className = 'bid'; d.setAttribute('role', 'note'); d.setAttribute('aria-label', 'Modo di dire');
    d.innerHTML = '<div class="bid-k">&#127873; Bonus · Modo di dire</div>' +
      '<div class="bid-it"><span>' + esc(x.it) + '</span><button class="bid-say" type="button" aria-label="Ascolta">&#128266;</button></div>' +
      '<div class="bid-en">= ' + esc(x.en) + '</div>' +
      '<div class="bid-ex">' + esc(x.ex) + '<small>' + esc(x.exEn) + '</small></div>' +
      '<div class="bid-note">' + esc(x.note) + '</div>';
    d.querySelector('.bid-say').addEventListener('click', function (e) {
      e.stopPropagation();
      var t = String(x.it).split('·')[0];
      try { if (W.BohVoice && W.BohVoice.speak) W.BohVoice.speak(t, { rate: 0.9 }); else if (W.BohCards) W.BohCards.say(t); } catch (er) {}
    });
    return d;
  }
  function tick() {
    if (!LV) return;
    var u = unitKey(), x = get(LV, u); if (!x) return;
    /* 1. lesson finish screen */
    var fin = D.querySelector('.ls-done .ls-stamp.big');
    if (fin) {
      var box = fin.parentNode;
      if (!box.querySelector('.bid')) { css(); var acts = box.querySelector('.ls-actions'); box.insertBefore(card(x), acts || null); }
      return;
    }
    /* 2. units without a lesson path: the round summary screen, never after a graded round */
    if (!hasLesson(u)) {
      var look = D.querySelector('.look[data-screen="summary"]');
      var g = W.__game, md = g && g.state ? g.state.mode : '';
      if (look && md !== 'prova' && !(typeof MODES !== 'undefined' && MODES[md] && MODES[md].graded)) {
        var wrap = look.querySelector('.wrap');
        if (wrap && !wrap.querySelector('.bid')) { css(); wrap.appendChild(card(x)); }
      }
    }
  }
  if (LV) css();
  setInterval(tick, 400);
  /* the game redraws the finish screen now and then (coins, celebration); put the card back in the same frame so it never blinks out */
  var raf = 0; try { new MutationObserver(function () { if (!raf) raf = (W.requestAnimationFrame || setTimeout)(function () { raf = 0; tick(); }); }).observe(D.body, { childList: true, subtree: true }); } catch (e) {}
  W.BohIdiom = { get: function (u) { return get(LV, u || unitKey()); }, all: IDIOMS };
})(window, document);
