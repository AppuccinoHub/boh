/* a.scotto / 2026-11-17 / boh-italiano3-intervista — © 2026 Assunta Scotto. Not for redistribution. */
(function () {
  "use strict";
  try { var th = localStorage.getItem("boh_theme"); if (th === "dark" || th === "light") document.documentElement.setAttribute("data-theme", th); } catch (e) {}

  var KEY = "boh_intervista_v1";
  var G = {
    1: ["Per cominciare", "Easy starters"],
    2: ["Casa e famiglia", "Home and family"],
    3: ["Scuola e amici", "School and friends"],
    4: ["Tempo libero, cibo, feste", "Free time, food, holidays"],
    5: ["Momenti importanti", "Big moments"],
    6: ["Ieri e oggi", "Then and now"],
    7: ["La casa e la città", "Home and city"],
    8: ["Valori, lavoro e storia", "Values, work and history"]
  };
  var TN = { I: "imperfetto", PP: "passato prossimo", P: "present", O: "other" };

  var B = [];
  /* add(group, tense, medium, quickAnswer, English, Italian (tu form), answer starter) */
  function add(g, t, m, q, en, it, st) { B.push({ id: B.length + 1, g: g, t: t, m: m, q: q, en: en, it: it, st: st }); }

  /* Group 1 · Per cominciare */
  add(1, "P", 0, 1, "What is your name?", "Come ti chiami?", "Si chiama ___.");
  add(1, "P", 0, 1, "How old are you?", "Quanti anni hai?", "Ha ___ anni.");
  add(1, "P", 0, 1, "Where do you live now?", "Dove abiti adesso?", "Oggi abita a ___.");
  add(1, "P", 0, 1, "Do you have children or grandchildren? How many?", "Hai figli o nipoti? Quanti?", "Ha ___ figli e ___ nipoti.");
  add(1, "P", 0, 1, "What is your favorite color?", "Qual è il tuo colore preferito?", "Il suo colore preferito è ___.");
  add(1, "P", 0, 1, "What is your favorite food?", "Qual è il tuo cibo preferito?", "Il suo cibo preferito è ___.");
  add(1, "PP", 0, 1, "Where did you go to high school?", "Dove sei andato/a alla scuola superiore?", "È andato/a alla scuola superiore a ___.");
  add(1, "I", 0, 0, "How was high school?", "Com'era la scuola superiore?", "La scuola superiore era ___.");
  add(1, "PP", 0, 1, "What year did you finish high school?", "In che anno hai finito la scuola superiore?", "Ha finito la scuola superiore nel ___.");
  add(1, "I", 0, 0, "What was your job?", "Che lavoro facevi?", "Faceva il/la ___.");

  /* Group 2 · Casa e famiglia */
  add(2, "I", 0, 1, "Where did you live when you were young?", "Dove abitavi quando eri piccolo/a?", "Da piccolo/a, abitava a ___.");
  add(2, "I", 0, 0, "What was your house like?", "Com'era la tua casa?", "La casa era ___.");
  add(2, "I", 0, 1, "Did you have your own room?", "Avevi una camera tutta tua?", "Aveva / Non aveva una camera sua.");
  add(2, "I", 0, 1, "How many people lived in your house?", "Quante persone abitavano nella tua casa?", "Nella casa abitavano ___ persone.");
  add(2, "I", 0, 1, "Did you have brothers or sisters? How many?", "Avevi fratelli o sorelle? Quanti?", "Aveva ___ fratelli e ___ sorelle.");
  add(2, "I", 0, 0, "What was your mother like?", "Com'era tua madre?", "Sua madre era ___.");
  add(2, "I", 0, 1, "What work did your father do?", "Che lavoro faceva tuo padre?", "Suo padre faceva il/la ___.");
  add(2, "I", 0, 1, "Who cooked in your house?", "Chi cucinava a casa tua?", "A casa cucinava ___.");
  add(2, "P", 0, 1, "Do you still visit the place where you grew up?", "Torni ancora nel posto dove sei cresciuto/a?", "Oggi torna / non torna a ___.");
  add(2, "I", 1, 0, "What traditions did your family have?", "Quali tradizioni aveva la tua famiglia?", "La famiglia aveva la tradizione di ___.");

  /* Group 3 · Scuola e amici */
  add(3, "I", 0, 1, "Where did you go to school when you were little?", "Dove andavi a scuola da piccolo/a?", "Andava a scuola a ___.");
  add(3, "I", 0, 1, "How did you get to school?", "Come andavi a scuola?", "Andava a scuola ___.");
  add(3, "I", 0, 1, "What was your favorite subject?", "Qual era la tua materia preferita?", "La sua materia preferita era ___.");
  add(3, "I", 0, 0, "What was your teacher like?", "Com'era il tuo maestro/la tua maestra?", "Il maestro / La maestra era ___.");
  add(3, "I", 0, 1, "What time did school start?", "A che ora cominciava la scuola?", "La scuola cominciava alle ___.");
  add(3, "I", 0, 1, "Who was your best friend?", "Chi era il tuo migliore amico/la tua migliore amica?", "Il suo migliore amico / La sua migliore amica era ___.");
  add(3, "I", 1, 0, "What did you and your friends do after school?", "Che cosa facevi con i tuoi amici dopo la scuola?", "Dopo la scuola, con gli amici ___.");
  add(3, "I", 0, 1, "What language did you speak at home?", "Che lingua parlavi a casa?", "A casa parlava ___.");
  add(3, "PP", 1, 0, "What did you learn at school that you still remember?", "Che cosa hai imparato a scuola che ricordi ancora?", "A scuola ha imparato ___.");
  add(3, "P", 0, 1, "How many languages do you speak today?", "Quante lingue parli oggi?", "Oggi parla ___ lingue: ___.");

  /* Group 4 · Tempo libero, cibo, feste */
  add(4, "I", 0, 1, "What games did you play?", "A che giochi giocavi?", "Da piccolo/a giocava a ___.");
  add(4, "I", 0, 0, "What did you do in the summer?", "Che cosa facevi d'estate?", "Ogni estate ___.");
  add(4, "I", 0, 1, "What music did you listen to?", "Che musica ascoltavi?", "Ascoltava ___.");
  add(4, "I", 0, 1, "What did your family eat on Sundays?", "Che cosa mangiava la tua famiglia la domenica?", "La domenica la famiglia mangiava ___.");
  add(4, "I", 1, 0, "How did your family celebrate Christmas?", "Come festeggiava il Natale la tua famiglia?", "A Natale la famiglia ___.");
  add(4, "I", 0, 1, "What was your favorite holiday?", "Qual era la tua festa preferita?", "La sua festa preferita era ___ perché ___.");
  add(4, "PP", 0, 1, "What was the first movie you saw at the cinema?", "Qual è stato il primo film che hai visto al cinema?", "Al cinema ha visto per la prima volta ___.");
  add(4, "I", 0, 1, "Who did you spend the holidays with?", "Con chi passavi le feste?", "Passava le feste con ___.");
  add(4, "PP", 1, 0, "What is a happy memory from your childhood? What happened?", "Qual è un bel ricordo della tua infanzia? Che cosa è successo?", "Un bel ricordo è ___.");
  add(4, "I", 0, 1, "What did your grandmother cook?", "Che cosa cucinava tua nonna?", "Sua nonna cucinava ___.");

  /* Group 5 · Momenti importanti */
  add(7, "PP", 0, 1, "Where were you born?", "Dove sei nato/a?", "È nato/a a ___.");
  add(5, "PP", 0, 1, "In what year were you born?", "In che anno sei nato/a?", "È nato/a nel ___.");
  add(5, "PP", 0, 1, "When did you start working?", "Quando hai cominciato a lavorare?", "Ha cominciato a lavorare nel ___.");
  add(5, "PP", 0, 1, "What was your first job?", "Qual è stato il tuo primo lavoro?", "Il suo primo lavoro è stato ___.");
  add(5, "PP", 1, 0, "What was the best trip of your life? Where did you go?", "Qual è stato il viaggio più bello della tua vita? Dove sei andato/a?", "Nel viaggio più bello è andato/a a ___.");
  add(5, "PP", 0, 0, "What was the best day of your life?", "Qual è stato il giorno più bello della tua vita?", "Il giorno più bello della sua vita è stato ___.");
  add(5, "PP", 1, 1, "What was the first thing you bought with your own money?", "Qual è stata la prima cosa che hai comprato con i tuoi soldi?", "Con i suoi primi soldi ha comprato ___.");
  add(5, "PP", 1, 1, "What did you learn to do when you were young?", "Che cosa hai imparato a fare da giovane?", "Da giovane ha imparato a ___.");
  add(5, "PP", 1, 0, "Who did you meet who changed your life?", "Chi hai conosciuto che ha cambiato la tua vita?", "Ha conosciuto ___.");
  add(5, "I", 0, 1, "What did you want to be when you grew up?", "Che cosa volevi fare da grande?", "Da grande, voleva fare il/la ___.");
  add(5, "PP", 0, 1, "Did you go to college? Where?", "Sei andato/a all'università? Dove?", "È andato/a all'università a ___. / Non è andato/a all'università.");

  /* Group 6 · Ieri e oggi */
  add(6, "P", 0, 0, "What do you do every day now?", "Che cosa fai ogni giorno adesso?", "Ogni giorno ___.");
  add(6, "P", 0, 0, "What do you like to do now in your free time?", "Che cosa ti piace fare nel tempo libero adesso?", "Nel tempo libero, preferisce ___.");
  add(6, "P", 0, 1, "What food or recipe do you still make today?", "Quale piatto prepari ancora oggi?", "Ancora oggi prepara ___.");
  add(6, "P", 1, 0, "Do you prefer life then or now? Why?", "Preferisci la vita di ieri o di oggi? Perché?", "Preferisce la vita di ___ perché ___.");
  add(6, "P", 1, 0, "What do you miss from when you were young?", "Che cosa ti manca di quando eri giovane?", "Sente la mancanza di ___.");
  add(6, "P", 0, 0, "What advice do you have for young people?", "Che consiglio hai per i giovani?", "Il suo consiglio per i giovani è ___.");
  add(6, "P", 1, 0, "What is the most important thing in life for you?", "Qual è la cosa più importante nella vita per te?", "Per lui/lei, la cosa più importante nella vita è ___.");
  add(6, "I", 0, 1, "Did you have a cell phone in high school?", "Avevi il cellulare alla scuola superiore?", "Aveva / Non aveva il cellulare.");
  add(6, "I", 1, 0, "How did you talk to your friends when you were young?", "Come parlavi con i tuoi amici quando eri giovane?", "Parlava con gli amici ___.");
  add(6, "PP", 0, 1, "What was your first cell phone?", "Qual è stato il tuo primo cellulare?", "Il suo primo cellulare è stato ___.");

  /* Group 8 · Valori, lavoro e storia */
  add(8, "I", 0, 1, "How much did gas cost when you were young?", "Quanto costava la benzina quando eri giovane?", "La benzina costava ___.");
  add(8, "I", 0, 1, "Did you have a car? What kind?", "Avevi una macchina? Che macchina era?", "Aveva ___. / Non aveva la macchina.");
  add(8, "I", 0, 1, "Did you like your job?", "Ti piaceva il tuo lavoro?", "Gli/Le piaceva il lavoro.");
  add(8, "PP", 1, 0, "What did you learn from your job?", "Che cosa hai imparato dal tuo lavoro?", "Dal lavoro ha imparato ___.");
  add(8, "I", 1, 0, "What advice did your parents give you?", "Che consigli ti davano i tuoi genitori?", "I genitori dicevano: ___.");
  add(8, "I", 0, 1, "What saying did your family use?", "Quale proverbio diceva la tua famiglia?", "La famiglia diceva: ___.");
  add(8, "P", 1, 0, "What are you proud of?", "Di che cosa sei orgoglioso/a?", "È orgoglioso/a di ___.");
  add(8, "PP", 1, 0, "What have you learned in life?", "Che cosa hai imparato nella vita?", "Nella vita ha imparato ___.");
  add(8, "P", 1, 0, "What is a big event you remember?", "Qual è un grande evento che ricordi?", "Ricorda ___.");
  add(8, "P", 1, 0, "What do you want to tell your grandchildren?", "Che cosa vuoi dire ai tuoi nipoti?", "Vuole dire ai nipoti: ___.");
  /* Group 7 · La casa e la città */
  add(7, "I", 0, 1, "Did you share a room? With whom?", "Dividevi la camera con qualcuno? Con chi?", "Divideva la camera con ___.");
  add(7, "I", 0, 1, "Where did you eat at home?", "Dove mangiavi a casa?", "A casa mangiava ___.");
  add(7, "I", 0, 1, "What was your favorite place in the house?", "Qual era il tuo posto preferito in casa?", "Il suo posto preferito in casa era ___.");
  add(7, "I", 0, 1, "Did you live in a house or an apartment?", "Abitavi in una casa o in un appartamento?", "Abitava in ___.");
  add(7, "PP", 1, 1, "How many times did you move in your life?", "Quante volte hai cambiato casa nella tua vita?", "Ha cambiato casa ___ volte.");
  add(7, "I", 0, 1, "Where did you do your homework?", "Dove facevi i compiti?", "Faceva i compiti ___.");
  add(7, "I", 0, 0, "What was your neighborhood like?", "Com'era il tuo quartiere?", "Il quartiere era ___.");
  add(7, "I", 0, 0, "What was in your town or city?", "Che cosa c'era nel tuo paese o nella tua città?", "Nel paese c'era ___.");
  add(7, "P", 0, 0, "What is your house like today?", "Com'è la tua casa oggi?", "Oggi la casa è ___.");

  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; });
  }
  function tagT(t) { return '<span class="tag t-' + t + '">' + TN[t] + "</span>"; }

  function state() {
    var s = {};
    try { s = JSON.parse(localStorage.getItem(KEY)) || {}; } catch (e) { s = {}; }
    if (typeof s !== "object" || s === null || Array.isArray(s)) s = {};
    s.track = s.track || "";
    s.order = Array.isArray(s.order) ? s.order : [];
    s.own = s.own && typeof s.own === "object" ? s.own : {};
    s.ownN = s.ownN || 0;
    s.notes = s.notes && typeof s.notes === "object" ? s.notes : {};
    s.checks = s.checks && typeof s.checks === "object" ? s.checks : {};
    s.report = typeof s.report === "string" ? s.report : "";
    return s;
  }
  function commit(s) { try { localStorage.setItem(KEY, JSON.stringify(s)); return true; } catch (e) { return false; } }

  function chosen(s) {
    return s.order.map(function (id) {
      if (typeof id === "number") return B[id - 1] || null;
      var o = s.own[id];
      return o ? { id: id, own: true, t: o.t, it: o.it, en: "", st: "", g: 0, m: 0 } : null;
    }).filter(Boolean);
  }

  function copy(text, statusEl) {
    function done(ok) { if (statusEl) statusEl.textContent = ok ? "Copied." : "Copy did not work. Select the text and copy it yourself."; }
    function fb() {
      var ta = document.createElement("textarea");
      ta.value = text; ta.setAttribute("readonly", ""); ta.style.position = "absolute"; ta.style.left = "-9999px";
      document.body.appendChild(ta); ta.select();
      var ok = false;
      try { ok = document.execCommand("copy"); } catch (e) {}
      document.body.removeChild(ta); done(ok);
    }
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text).then(function () { done(true); }, fb);
    } else { fb(); }
  }

  var last = null;
  document.addEventListener("focusin", function (e) {
    var t = e.target;
    if (t && (t.tagName === "TEXTAREA" || (t.tagName === "INPUT" && t.type === "text"))) last = t;
  });
  function insertAtCursor(ch, fallback) {
    var f = last || fallback;
    if (!f) return;
    var s = f.selectionStart, e2 = f.selectionEnd;
    if (s == null) { s = e2 = f.value.length; }
    f.value = f.value.slice(0, s) + ch + f.value.slice(e2);
    var p = s + ch.length;
    f.focus();
    try { f.setSelectionRange(p, p); } catch (x) {}
    f.dispatchEvent(new Event("input", { bubbles: true }));
  }
  function accentBar(host, fallback) {
    host.className = (host.className ? host.className + " " : "") + "acc no-print";
    host.setAttribute("role", "group");
    host.setAttribute("aria-label", "Accent letters");
    host.innerHTML = '<span class="acl">Accents</span>' + ["à", "è", "é", "ì", "ò", "ù", "È"].map(function (c) {
      return '<button type="button" class="ab" aria-label="Insert ' + c + '">' + c + "</button>";
    }).join("");
    host.addEventListener("pointerdown", function (e) { if (e.target.closest(".ab")) e.preventDefault(); });
    host.addEventListener("click", function (e) { var b = e.target.closest(".ab"); if (b) insertAtCursor(b.textContent, fallback); });
  }

  function printOnly(el) {
    document.body.classList.add("pm");
    el.classList.add("po");
    function cleanup() {
      document.body.classList.remove("pm");
      el.classList.remove("po");
      document.removeEventListener("pointerdown", early, true);
      document.removeEventListener("keydown", early, true);
    }
    var armed = false;
    function early() { if (armed) cleanup(); }
    window.addEventListener("afterprint", cleanup, { once: true });
    setTimeout(function () { armed = true; }, 1200);
    document.addEventListener("pointerdown", early, true);
    document.addEventListener("keydown", early, true);
    window.print();
  }

  function footer() {
    var wrap = document.querySelector(".wrap");
    if (!wrap) return;
    var f = document.createElement("footer");
    f.className = "foot";
    f.innerHTML = '<p class="no-print">Your work is saved only on this device and is never sent anywhere. <button type="button" class="lnk" id="clr">Clear my work</button></p>' +
      '<p class="note warn no-print" id="savewarn" hidden>This browser is not letting the page save. Copy your work before you close the page.</p>' +
      '<p class="cr">© 2026 Assunta Scotto · Boh · Italiano 3 · Intervista con Nonno/Nonna · created 2026-11-17 · Not for redistribution.</p>';
    wrap.appendChild(f);
    var ok = true;
    try { localStorage.setItem("__bohint_t", "1"); localStorage.removeItem("__bohint_t"); } catch (e) { ok = false; }
    if (!ok) f.querySelector("#savewarn").hidden = false;
    f.querySelector("#clr").addEventListener("click", function () {
      if (window.confirm("Clear everything you saved on this device for this project? This cannot be undone.")) {
        try { localStorage.removeItem(KEY); } catch (e) {}
        location.reload();
      }
    });
  }

  window.INT = { bank: B, groups: G, tn: TN, esc: esc, tagT: tagT, state: state, commit: commit, chosen: chosen, copy: copy, accentBar: accentBar, printOnly: printOnly, footer: footer };
})();
