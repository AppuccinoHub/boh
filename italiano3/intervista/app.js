/* a.scotto / 2026-11-17 / boh-italiano3-intervista — © 2026 Assunta Scotto. Not for redistribution. */
(function () {
  "use strict";
  try { var th = localStorage.getItem("boh_theme"); if (th === "dark" || th === "light") document.documentElement.setAttribute("data-theme", th); } catch (e) {}

  var KEY = "boh_intervista_v1";
  var G = {
    1: ["Casa e famiglia", "Home and family"],
    2: ["Scuola e amici", "School and friends"],
    3: ["Tempo libero, cibo, feste", "Free time, food, holidays"],
    4: ["Momenti importanti", "Big moments"],
    5: ["Ieri e oggi", "Then and now"]
  };
  var TN = { I: "imperfetto", PP: "passato prossimo", P: "present", O: "other" };

  var B = [];
  function add(g, t, m, en, it, st) { B.push({ id: B.length + 1, g: g, t: t, m: m, en: en, it: it, st: st }); }

  /* Group 1 · Casa e famiglia */
  add(1, "I", 0, "Where did you live when you were young?", "Dove abitava quando era piccolo/a?", "Da piccolo/a, abitava a ___.");
  add(1, "I", 0, "What was your house like?", "Com'era la Sua casa?", "La casa era ___.");
  add(1, "I", 0, "Did you have your own room?", "Aveva una camera tutta Sua?", "Aveva / Non aveva una camera sua.");
  add(1, "I", 0, "How many people lived in your house?", "Quante persone abitavano nella Sua casa?", "Nella casa abitavano ___ persone.");
  add(1, "I", 0, "Did you have brothers or sisters? How many?", "Aveva fratelli o sorelle? Quanti?", "Aveva ___ fratelli e ___ sorelle.");
  add(1, "I", 0, "What was your mother like?", "Com'era Sua madre?", "Sua madre era ___.");
  add(1, "I", 0, "What work did your father do?", "Che lavoro faceva Suo padre?", "Suo padre faceva il/la ___.");
  add(1, "I", 0, "Who cooked in your house?", "Chi cucinava a casa Sua?", "A casa cucinava ___.");
  add(1, "PP", 1, "Did you ever move to a different house as a child? When?", "Ha mai cambiato casa da piccolo/a? Quando?", "Nel ___ ha cambiato casa.");
  add(1, "P", 0, "Do you still visit the place where you grew up?", "Torna ancora nel posto dove è cresciuto/a?", "Oggi torna / non torna a ___.");

  /* Group 2 · Scuola e amici */
  add(2, "I", 0, "Where did you go to school?", "Dove andava a scuola?", "Andava a scuola a ___.");
  add(2, "I", 0, "How did you get to school?", "Come andava a scuola?", "Andava a scuola ___.");
  add(2, "I", 0, "What was your favorite subject?", "Qual era la Sua materia preferita?", "La sua materia preferita era ___.");
  add(2, "I", 0, "What was your teacher like?", "Com'era il Suo maestro/la Sua maestra?", "Il maestro / La maestra era ___.");
  add(2, "I", 0, "What time did school start?", "A che ora cominciava la scuola?", "La scuola cominciava alle ___.");
  add(2, "I", 0, "Who was your best friend?", "Chi era il Suo migliore amico/la Sua migliore amica?", "Il suo migliore amico / La sua migliore amica era ___.");
  add(2, "I", 1, "What did you and your friends do after school?", "Che cosa faceva con i Suoi amici dopo la scuola?", "Dopo la scuola, con gli amici ___.");
  add(2, "I", 0, "What language did you speak at home?", "Che lingua parlava a casa?", "A casa parlava ___.");
  add(2, "PP", 1, "What did you learn at school that you still remember?", "Che cosa ha imparato a scuola che ricorda ancora?", "A scuola ha imparato ___.");
  add(2, "P", 0, "How many languages do you speak today?", "Quante lingue parla oggi?", "Oggi parla ___ lingue: ___.");

  /* Group 3 · Tempo libero, cibo, feste */
  add(3, "I", 0, "What games did you play?", "A che giochi giocava?", "Da piccolo/a giocava a ___.");
  add(3, "I", 0, "What did you do on weekends?", "Che cosa faceva nel fine settimana?", "Nel fine settimana, di solito ___.");
  add(3, "I", 0, "What did you do in the summer?", "Che cosa faceva d'estate?", "Ogni estate ___.");
  add(3, "I", 0, "What music did you listen to?", "Che musica ascoltava?", "Ascoltava ___.");
  add(3, "I", 0, "What sport did you play?", "Che sport faceva?", "Faceva ___.");
  add(3, "I", 0, "What was your favorite food?", "Qual era il Suo piatto preferito?", "Il suo piatto preferito era ___.");
  add(3, "I", 0, "What did your family eat on Sundays?", "Che cosa mangiava la Sua famiglia la domenica?", "La domenica la famiglia mangiava ___.");
  add(3, "I", 1, "How did your family celebrate Christmas?", "Come festeggiava il Natale la Sua famiglia?", "A Natale la famiglia ___.");
  add(3, "I", 0, "What was your favorite holiday?", "Qual era la Sua festa preferita?", "La sua festa preferita era ___ perché ___.");
  add(3, "PP", 0, "What was the first movie you saw at the cinema?", "Qual è stato il primo film che ha visto al cinema?", "Al cinema ha visto per la prima volta ___.");

  /* Group 4 · Momenti importanti */
  add(4, "PP", 0, "Where were you born?", "Dov'è nato/a?", "È nato/a a ___.");
  add(4, "PP", 0, "In what year were you born?", "In che anno è nato/a?", "È nato/a nel ___.");
  add(4, "PP", 0, "When did you start working?", "Quando ha cominciato a lavorare?", "Ha cominciato a lavorare nel ___.");
  add(4, "PP", 0, "What was your first job?", "Qual è stato il Suo primo lavoro?", "Il suo primo lavoro è stato ___.");
  add(4, "PP", 1, "What was the best trip of your life? Where did you go?", "Qual è stato il viaggio più bello della Sua vita? Dov'è andato/a?", "Nel viaggio più bello è andato/a a ___.");
  add(4, "PP", 0, "What was the best day of your life?", "Qual è stato il giorno più bello della Sua vita?", "Il giorno più bello della sua vita è stato ___.");
  add(4, "PP", 1, "What was the first thing you bought with your own money?", "Qual è stata la prima cosa che ha comprato con i Suoi soldi?", "Con i suoi primi soldi ha comprato ___.");
  add(4, "PP", 1, "What did you learn to do when you were young?", "Che cosa ha imparato a fare da giovane?", "Da giovane ha imparato a ___.");
  add(4, "PP", 1, "Did you ever win a prize or a game?", "Ha mai vinto un premio o una gara?", "Ha vinto ___. / Non ha mai vinto ___.");
  add(4, "PP", 1, "When did you take a train or a plane for the first time?", "Quando ha preso il treno o l'aereo per la prima volta?", "Ha preso il treno / l'aereo per la prima volta nel ___.");

  /* Group 5 · Ieri e oggi */
  add(5, "I", 1, "What was one thing that was different when you were young?", "Che cosa era diverso quando era giovane?", "Da giovane, ___ era diverso.");
  add(5, "I", 0, "Did you have a phone at home when you were young?", "Aveva il telefono a casa quando era giovane?", "Aveva / Non aveva il telefono a casa.");
  add(5, "I", 1, "How did you spend your time without phones or computers?", "Come passava il tempo senza telefoni e computer?", "Senza telefoni e computer, ___.");
  add(5, "P", 0, "What do you do every day now?", "Che cosa fa ogni giorno adesso?", "Ogni giorno ___.");
  add(5, "P", 0, "What do you like to do now in your free time?", "Che cosa Le piace fare nel tempo libero adesso?", "Nel tempo libero, preferisce ___.");
  add(5, "P", 0, "What food or recipe do you still make today?", "Quale piatto prepara ancora oggi?", "Ancora oggi prepara ___.");
  add(5, "P", 1, "Do you prefer life then or now? Why?", "Preferisce la vita di ieri o di oggi? Perché?", "Preferisce la vita di ___ perché ___.");
  add(5, "P", 1, "What do you miss from when you were young?", "Che cosa Le manca di quando era giovane?", "Sente la mancanza di ___.");
  add(5, "P", 0, "What advice do you have for young people?", "Che consiglio ha per i giovani?", "Il suo consiglio per i giovani è ___.");
  add(5, "P", 1, "What is the most important thing in life for you?", "Qual è la cosa più importante nella vita per Lei?", "Per lui/lei, la cosa più importante nella vita è ___.");

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
