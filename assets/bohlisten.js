/* Boh · "Ascolta e rispondi" (hear a question, answer out loud in the recorder) and "Leggi e rispondi" (read a short text, answer questions).
   ONE file, used the same way by every level (Italiano 1-4 and AP). The lesson engine shows a card with one button; the button opens this screen.
   Use:  BohListen.open({ type:'ascolta', key:'lst_i2_cibo_1', q:'Che cosa mangi a colazione?', en:'What do you eat for breakfast?',
                          frames:['A colazione mangio …'], work:'Listening · answer a question in Italian', name:'Gia', onClose:fn })
         BohListen.open({ type:'leggi', key:'rd_i2_cibo', title:'Al ristorante', passage:[[it,en],...], gloss:{word:en},
                          questions:[{q,answer,traps,why}], work:'Reading · understand a short text', onClose:fn })
         BohListen.done(key) -> true when the student finished it on this device
   Ascolta: the question is spoken with the shared Italian voice (assets/bohvoice.js). "Play again · slower". "Show me the question" is always there.
            The answer is a recording (assets/recorder.js, loaded here if the page has not loaded it). Recordings stay on the device.
            If the microphone does not work, "I answered out loud another way" lets the student go on. The game never scores how a student sounds.
   Leggi:   tap a dotted word for English; questions one at a time; a wrong pick shows why and the student tries again. Done when every question is right.
   Progress: localStorage 'boh_listen_v1'. Text sizes follow the Boh floor: nothing under 16px, answers 20px.
   Created by Assunta Scotto, 2026. Not for redistribution. */
(function (W, D) {
  'use strict';
  if (W.BohListen) return;
  var LS = 'boh_listen_v1', el = null, cur = null, lastFocus = null;
  var base = '../assets/';
  try { base = D.currentScript.src.replace(/bohlisten\.js.*$/, ''); } catch (e) {}

  function esc(t) { return String(t == null ? '' : t).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function read() { try { return JSON.parse(localStorage.getItem(LS) || '{}') || {}; } catch (e) { return {}; } }
  function mark(k) { var o = read(); o[k] = 1; try { localStorage.setItem(LS, JSON.stringify(o)); } catch (e) {} }
  function done(k) { if (read()[k]) return true; try { return !!(W.BohRecorder && W.BohRecorder.has && W.BohRecorder.has(k)); } catch (e) { return false; } }
  function shuffle(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var x = a[i]; a[i] = a[j]; a[j] = x; } return a; }

  function speak(t, slow) {
    try {
      if (W.BohVoice && W.BohVoice.speak) { W.BohVoice.speak(t, { rate: slow ? 0.7 : 0.92 }); return; }
      var S = W.speechSynthesis; if (!S) return; S.cancel();
      var u = new SpeechSynthesisUtterance(String(t)); u.lang = 'it-IT'; u.rate = slow ? 0.7 : 0.92; S.speak(u);
    } catch (e) {}
  }
  /* a question written piccolo/a is SAID piccolo (assets/bohvoice.js drops the /a); this note tells girls what to say */
  function slashNote(t) { return /\p{L}\/[aei]\b/u.test(String(t || '')) ? '<div class="bl-ga">La voce dice la forma del ragazzo (piccolo). Sei una ragazza? Tu dici la forma con la -a (piccola). · The voice says the boy form; girls say the -a form.</div>' : ''; }
  function needRecorder(cb) {
    if (W.BohRecorder && W.BohRecorder.mount) return cb();
    var s = D.querySelector('script[data-boh-rec]');
    if (!s) { s = D.createElement('script'); s.src = base + 'recorder.js?v=202610201500'; s.setAttribute('data-boh-rec', '1'); D.head.appendChild(s); }
    var n = 0, t = setInterval(function () { if (W.BohRecorder && W.BohRecorder.mount) { clearInterval(t); cb(); } else if (++n > 50) { clearInterval(t); cb(); } }, 100);
  }

  var CSS = '' +
    '#blst{position:fixed;inset:0;z-index:99985;background:rgba(14,42,91,.72);display:flex;align-items:center;justify-content:center;padding:calc(env(safe-area-inset-top,0px) + 10px) 10px calc(env(safe-area-inset-bottom,0px) + 10px)}' +
    '#blst .bl-card{width:100%;max-width:520px;max-height:100%;overflow:auto;-webkit-overflow-scrolling:touch;background:var(--card-bg,#fff);color:var(--text,#0E2A5B);border:2px solid var(--card-border,#CBD5E1);border-radius:22px;padding:16px 16px 18px;display:flex;flex-direction:column;gap:12px;font-family:inherit}' +
    '#blst .bl-rec{border:0!important;padding:0!important}#blst .bl-rec .brec-note{display:none!important}#blst .bl-rec h3{margin:0 0 4px}' +
    '#blst .bl-s1,#blst .bl-s2{display:flex;flex-direction:column;gap:12px}#blst [hidden]{display:none!important}' +
    '#blst .bl-top{display:flex;align-items:flex-start;justify-content:space-between;gap:10px}' +
    '#blst .bl-work{font-size:16px;font-weight:700;color:var(--text-muted,#46566E);line-height:1.3}' +
    '#blst .bl-work b{display:block;font-size:16px;letter-spacing:.06em;text-transform:uppercase;color:var(--accent-strong,var(--primary-bg,#1A5CDF))}' +
    '#blst .bl-x{all:unset;cursor:pointer;flex:none;width:48px;height:48px;border-radius:50%;display:flex;align-items:center;justify-content:center;background:var(--option-default-bg,#E2EBFB);font-size:22px;font-weight:900}' +
    '#blst .bl-x:focus-visible,#blst button:focus-visible{outline:3px solid var(--text,#0E2A5B);outline-offset:2px}' +
    '#blst .bl-big{all:unset;cursor:pointer;align-self:center;width:112px;height:112px;border-radius:50%;background:var(--primary-bg,#1A5CDF);color:var(--primary-text,#fff);display:flex;align-items:center;justify-content:center;font-size:52px;box-shadow:0 4px 0 rgba(0,0,0,.18)}' +
    '#blst .bl-row{display:flex;flex-wrap:wrap;gap:8px;justify-content:center}' +
    '#blst .bl-btn2{all:unset;cursor:pointer;min-height:48px;padding:8px 16px;border-radius:14px;border:2px solid var(--card-border,#CBD5E1);background:var(--card-bg,#fff);font-size:18px;font-weight:800;display:inline-flex;align-items:center;gap:6px}' +
    '#blst .bl-note{font-size:16px;line-height:1.4;color:var(--text-muted,#46566E);text-align:center}' +
    '#blst .bl-q{font-size:24px;font-weight:800;line-height:1.25;text-align:center}' +
    '#blst .bl-q small{display:block;font-size:17px;font-weight:600;color:var(--text-muted,#46566E);margin-top:4px}' +
    '#blst .bl-frames{background:var(--option-default-bg,#E2EBFB);border-radius:14px;padding:10px 12px;font-size:17px;line-height:1.4}' +
    '#blst .bl-frames b{font-size:18px}' +
    '#blst .bl-rec{border:2px dashed var(--card-border,#CBD5E1);border-radius:16px;padding:10px}' +
    '#blst .bl-rec p,#blst .bl-rec span,#blst .bl-rec li,#blst .bl-rec small,#blst .bl-rec label,#blst .bl-rec div{font-size:max(16px,1em)!important}#blst .bl-rec button{font-size:max(18px,1em)!important;min-height:48px}' +
    '#blst .bl-other{display:flex;align-items:center;gap:10px;font-size:16px;font-weight:700;min-height:48px}' +
    '#blst .bl-other input{width:26px;height:26px;flex:none}' +
    '#blst .bl-go{all:unset;cursor:pointer;display:block;text-align:center;min-height:56px;line-height:56px;border-radius:16px;background:var(--primary-bg,#1A5CDF);color:var(--primary-text,#fff);font-size:20px;font-weight:900}' +
    '#blst .bl-go[aria-disabled="true"]{opacity:.45}' +
    '#blst .bl-msg{font-size:16px;font-weight:700;text-align:center;min-height:20px}' +
    '#blst .bl-pass{background:var(--option-default-bg,#F2F5FB);border-radius:16px;padding:12px 14px;font-size:20px;line-height:1.55}' +
    '#blst .bl-pass h3{margin:0 0 6px;font-size:22px}' +
    '#blst .bl-w{border-bottom:2px dotted currentColor;cursor:pointer}' +
    '#blst .bl-gl{font-size:17px;font-weight:700;text-align:center;min-height:22px}' +
    '#blst .bl-opts{display:flex;flex-direction:column;gap:10px}' +
    '#blst .bl-opt{all:unset;cursor:pointer;min-height:58px;padding:8px 14px;border-radius:16px;border:2.5px solid var(--card-border,#CBD5E1);background:var(--card-bg,#fff);font-size:20px;font-weight:800;display:flex;align-items:center;box-shadow:0 3px 0 var(--card-border,#CBD5E1)}' +
    '#blst .bl-opt.bad{border-color:#B3261E;color:#B3261E;opacity:.75}' +
    '#blst .bl-opt.ok{border-color:#0E7A52;background:#DDF4EA;color:#0B5C3E}' +
    '#blst .bl-why{font-size:17px;line-height:1.4;padding:10px 12px;border-radius:12px;background:var(--option-default-bg,#F2F5FB)}' +
    '#blst .bl-step{font-size:16px;font-weight:800;color:var(--text-muted,#46566E);text-align:center}' +
    '#blst .bl-ga{font-size:15px;line-height:1.35;color:var(--text-muted,#46566E);text-align:center;padding:6px 10px;border-radius:10px;background:var(--option-default-bg,#F2F5FB)}' +
    '#blst .bl-en{display:none;font-size:17px;color:var(--text-muted,#46566E);margin-top:6px}' +
    '#blst.bl-showen .bl-en{display:block}' +
    '@media (max-height:620px){#blst .bl-card{padding:12px 14px 14px;gap:8px}#blst .bl-s1,#blst .bl-s2{gap:8px}#blst .bl-big{width:80px;height:80px;font-size:38px}#blst .bl-opt{min-height:50px}#blst .bl-go{min-height:50px;line-height:50px}#blst .bl-work{font-size:16px}#blst .bl-rec h3,#blst .bl-rec > div > p:not(.brec-note),#blst .bl-rec > p{display:none!important}}' +
    '@media (prefers-reduced-motion:reduce){#blst *{transition:none!important;animation:none!important}}';

  function css() { if (D.getElementById('blst-css')) return; var s = D.createElement('style'); s.id = 'blst-css'; s.textContent = CSS; D.head.appendChild(s); }

  function close() {
    try { W.speechSynthesis && W.speechSynthesis.cancel(); } catch (e) {}
    if (el && el.parentNode) el.parentNode.removeChild(el);
    var c = cur; el = null; cur = null;
    D.removeEventListener('keydown', onKey, true);
    try { if (lastFocus && lastFocus.focus) lastFocus.focus({ preventScroll: true }); } catch (e) {}
    if (c && c.onClose) try { c.onClose(done(c.key)); } catch (e) {}
  }
  function onKey(e) { if (el && e.key === 'Escape') { e.preventDefault(); close(); } }

  function shell(o, inner) {
    return '<div class="bl-card" role="dialog" aria-modal="true" aria-label="' + esc(o.type === 'leggi' ? 'Leggi e rispondi' : 'Ascolta e rispondi') + '">' +
      '<div class="bl-top"><div class="bl-work"><b>Working on</b>' + esc(o.work || (o.type === 'leggi' ? 'Reading · understand a short text' : 'Listening · answer a question in Italian')) + '</div>' +
      '<button class="bl-x" data-a="x" aria-label="Chiudi">&#10005;</button></div>' + inner + '</div>';
  }

  /* ---------------------------------------------------------------- Ascolta e rispondi */
  function openAscolta(o) {
    var frames = (o.frames || []).map(function (f) { return '<b>' + esc(f) + '</b>'; }).join(' · ');
    el.innerHTML = shell(o,
      '<div class="bl-s1">' +
      '<button class="bl-big" data-a="play" aria-label="Ascolta la domanda">&#128266;</button>' +
      '<p class="bl-note">Listen as often as you like. Then record your answer in Italian.</p>' +
      '<div class="bl-row"><button class="bl-btn2" data-a="slow">&#128034; Play again · slower</button><button class="bl-btn2" data-a="show">&#128065; Show me the question</button></div>' +
      '<div class="bl-q" id="bl-q" hidden>' + esc(o.q) + '<small>' + esc(o.en || '') + '</small>' + slashNote(o.q) + '</div>' +
      '<details class="bl-nosnd"><summary class="bl-note" style="cursor:pointer;font-weight:800;min-height:44px">No sound?</summary>' +
        '<p class="bl-note">1. Check your volume, and that this tab is not muted. 2. Tap <b>Show me the question</b> and read it. ' +
        '3. <button class="bl-btn2" data-a="voices" style="font-size:16px;min-height:44px">Voices and help</button></p></details>' +
      (frames ? '<div class="bl-frames">You can start with: ' + frames + '</div>' : '') +
      '<button class="bl-go" data-a="step2">Registra la risposta &rsaquo;</button>' +
      '</div>' +
      '<div class="bl-s2" hidden>' +
      '<div class="bl-row"><button class="bl-btn2" data-a="step1">&lsaquo; Ascolta di nuovo</button><button class="bl-btn2" data-a="play" aria-label="Ascolta la domanda">&#128266;</button></div>' +
      (frames ? '<div class="bl-frames">You can start with: ' + frames + '</div>' : '') +
      '<div class="bl-rec" id="bl-rec"><p class="bl-note">Loading the recorder…</p></div>' +
      '<label class="bl-other"><input type="checkbox" id="bl-other"> I answered out loud another way (no microphone)</label>' +
      '<div class="bl-msg" id="bl-msg" role="status"></div>' +
      '<button class="bl-go" data-a="done" id="bl-done">Fatto! Avanti</button>' +
      '</div>');
    function snug() { var c = el && el.querySelector('.bl-card'); if (!c) return; [].forEach.call(el.querySelectorAll('.bl-frames'), function (f) { f.hidden = false; if (c.scrollHeight > c.clientHeight + 1) f.hidden = true; }); }
    function sync() { var ok = done(o.key) || el.querySelector('#bl-other').checked; el.querySelector('#bl-done').setAttribute('aria-disabled', ok ? 'false' : 'true'); }
    el.querySelector('#bl-other').addEventListener('change', function (e) { if (e.target.checked) mark(o.key); sync(); });
    needRecorder(function () {
      if (!el) return;
      var box = el.querySelector('#bl-rec');
      if (W.BohRecorder && W.BohRecorder.mount) {
        box.innerHTML = '';
        try { W.BohRecorder.mount(box, { key: o.key, label: 'La mia risposta', intro: 'Press <b>Record</b> and answer the question out loud, in Italian.', maxSec: 60, name: o.name || '', onChange: function (has) { if (has) mark(o.key); sync(); }, onEscalate: function () { var c = el && el.querySelector('#bl-other'); if (c) c.parentNode.style.outline = '3px solid var(--primary-bg,#1A5CDF)'; } }); }
        catch (e) { box.innerHTML = '<p class="bl-note">The recorder could not start. Tick the box below.</p>'; }
      } else box.innerHTML = '<p class="bl-note">The recorder could not load. Tick the box below.</p>';
      sync(); snug();
    });
    sync(); snug();
    setTimeout(function () { if (el && cur === o) speak(o.q); }, 400);
    el.addEventListener('click', function (e) {
      var a = e.target.closest ? e.target.closest('[data-a]') : null; if (!a) { if (e.target === el) close(); return; }
      var act = a.getAttribute('data-a');
      if (act === 'x') return close();
      if (act === 'play') return speak(o.q);
      if (act === 'slow') return speak(o.q, true);
      if (act === 'voices') { try { W.BohVoice && W.BohVoice.openPicker && W.BohVoice.openPicker(); } catch (er) {} return; }
      if (act === 'show') { var q = el.querySelector('#bl-q'); q.hidden = !q.hidden; snug(); return; }
      if (act === 'step2' || act === 'step1') { el.querySelector('.bl-s1').hidden = act === 'step2'; el.querySelector('.bl-s2').hidden = act !== 'step2'; snug(); return; }
      if (act === 'done') {
        if (a.getAttribute('aria-disabled') === 'true') { el.querySelector('#bl-msg').textContent = 'First record your answer, or tick the box.'; return; }
        mark(o.key); return close();
      }
    });
  }

  /* ---------------------------------------------------------------- Leggi e rispondi */
  function passHtml(o) {
    var words = Object.keys(o.gloss || {}).sort(function (a, b) { return b.length - a.length; });
    var body = (o.passage || []).map(function (p, i) {
      var t = esc(p[0]);
      words.forEach(function (w, wi) { var ew = esc(w); var at = t.indexOf(ew); if (at !== -1 && t.slice(0, at).lastIndexOf('<') <= t.slice(0, at).lastIndexOf('>')) t = t.slice(0, at) + '<span class="bl-w" data-g="' + wi + '" role="button" tabindex="0">' + ew + '</span>' + t.slice(at + ew.length); });
      return '<span>' + t + ' </span>';
    }).join('');
    return '<div class="bl-pass"><h3>' + esc(o.title || '') + '</h3><div>' + body + '</div><div class="bl-en">' + esc((o.passage || []).map(function (p) { return p[1]; }).join(' ')) + '</div></div>';
  }
  function openLeggi(o) {
    var qs = o.questions || [], qi = 0, words = Object.keys(o.gloss || {}).sort(function (a, b) { return b.length - a.length; });
    var opts = null, bad = [], solved = false, reading = true, pages = null, pi = 0;
    function render() {
      if (reading) {
        /* the text gets as many screens as it needs: nothing scrolls, each screen ends with Avanti, the last with Domande */
        var P = o.passage || [], card;
        function page(a, b, last) {
          el.innerHTML = shell(o, passHtml({ title: a === 0 ? o.title : '', passage: P.slice(a, b), gloss: o.gloss }) +
            '<div class="bl-gl" id="bl-gl" role="status">Tap a dotted word for English.</div>' +
            '<div class="bl-row">' + (a > 0 ? '<button class="bl-btn2" data-a="pprev">&lsaquo; Indietro</button>' : '') + '<button class="bl-btn2" data-a="en">English</button></div>' +
            (last ? '<button class="bl-go" data-a="toq">' + (qi ? 'Torna alla domanda' : 'Domande') + ' &rsaquo;</button>' : '<button class="bl-go" data-a="pnext">Avanti &rsaquo;</button>'));
          card = el.querySelector('.bl-card');
          return card.scrollHeight <= card.clientHeight + 1;
        }
        if (!pages) {   /* work out the screens once */
          pages = []; var a = 0;
          while (a < P.length) {
            var b = a + 1;
            while (b < P.length && page(a, b + 1, b + 1 >= P.length)) b++;
            pages.push([a, b]); a = b;
          }
        }
        pi = Math.min(pi, pages.length - 1);
        page(pages[pi][0], pages[pi][1], pi === pages.length - 1);
        return;
      }
      if (qi >= qs.length) {
        el.innerHTML = shell(o, passHtml(o) + '<div class="bl-q">Ottimo! ' + qs.length + ' / ' + qs.length + '</div><p class="bl-note">You understood the text.</p><button class="bl-go" data-a="done">Fatto! Avanti</button>');
        mark(o.key); return;
      }
      var q = qs[qi];
      if (!opts) { opts = shuffle([q.answer].concat(q.traps || [])); bad = []; solved = false; }
      el.innerHTML = shell(o,
        '<div class="bl-step">Domanda ' + (qi + 1) + ' di ' + qs.length + '</div>' +
        '<div class="bl-q">' + esc(q.q) + '</div>' +
        '<div class="bl-opts">' + opts.map(function (t, i) {
          var c = solved && t === q.answer ? ' ok' : bad.indexOf(t) !== -1 ? ' bad' : '';
          return '<button class="bl-opt' + c + '" data-a="pick" data-i="' + i + '"' + (bad.indexOf(t) !== -1 || solved ? ' disabled' : '') + '>' + esc(t) + '</button>';
        }).join('') + '</div>' +
        (bad.length && !solved ? '<div class="bl-why"><b>Non ancora.</b> Read the text again and pick another one.</div>' : '') +
        (solved ? '<div class="bl-why"><b>Giusto!</b> ' + esc(q.why || '') + '</div><button class="bl-go" data-a="next">' + (qi + 1 < qs.length ? 'Avanti' : 'Finisci') + '</button>' : '') +
        '<div class="bl-row"><button class="bl-btn2" data-a="reread">&#128214; Rileggi il testo</button></div>');
    }
    render();
    el.addEventListener('click', function (e) {
      var a = e.target.closest ? e.target.closest('[data-a],[data-g]') : null; if (!a) { if (e.target === el) close(); return; }
      if (a.hasAttribute('data-g')) { var w = words[+a.getAttribute('data-g')]; var g = el.querySelector('#bl-gl'); if (g) g.textContent = w + ' = ' + o.gloss[w]; return; }
      var act = a.getAttribute('data-a');
      if (act === 'x') return close();
      if (act === 'en') { el.classList.toggle('bl-showen'); return; }
      if (act === 'toq') { reading = false; render(); return; }
      if (act === 'reread') { reading = true; pi = 0; render(); return; }
      if (act === 'pnext') { pi++; render(); return; }
      if (act === 'pprev') { pi = Math.max(0, pi - 1); render(); return; }
      if (act === 'pick') { var t = opts[+a.getAttribute('data-i')]; if (t === qs[qi].answer) solved = true; else if (bad.indexOf(t) === -1) bad.push(t); var en = el.classList.contains('bl-showen'); render(); if (en) el.classList.add('bl-showen'); return; }
      if (act === 'next') { qi++; opts = null; render(); return; }
      if (act === 'done') return close();
    });
    el.addEventListener('keydown', function (e) { if ((e.key === 'Enter' || e.key === ' ') && e.target && e.target.hasAttribute && e.target.hasAttribute('data-g')) { e.preventDefault(); e.target.click(); } });
  }

  function open(o) {
    if (!o || !o.key) return;
    if (el) close();
    css(); cur = o; lastFocus = D.activeElement;
    el = D.createElement('div'); el.id = 'blst';
    D.body.appendChild(el);
    D.addEventListener('keydown', onKey, true);
    if (o.type === 'leggi') openLeggi(o); else openAscolta(o);
    var x = el.querySelector('.bl-x'); try { x && x.focus({ preventScroll: true }); } catch (e) {}
  }

  /* fill-in help on lesson screens (word bank, Hint, "more than one fits"): the lesson engine draws them, the look is defined here once */
  (function () {
    if (D.getElementById('blx-css')) return;
    var s = D.createElement('style'); s.id = 'blx-css';
    s.textContent = '.ls-multi{align-self:stretch;font-size:16px;font-weight:800;padding:8px 12px;border-radius:12px;background:var(--option-default-bg,#E2EBFB);color:var(--text,#0E2A5B)}' +
      '.ls-wb{display:flex;flex-wrap:wrap;gap:8px}' +
      '.ls-wbw{all:unset;cursor:pointer;min-height:48px;padding:6px 14px;border-radius:14px;border:2px solid var(--card-border,#CBD5E1);background:var(--card-bg,#fff);color:var(--text,#0E2A5B);font-size:18px;font-weight:800;display:inline-flex;align-items:center;box-shadow:0 2px 0 var(--card-border,#CBD5E1)}' +
      '.ls-wbw:focus-visible,.ls-hintb:focus-visible{outline:3px solid var(--text,#0E2A5B);outline-offset:2px}' +
      '.ls-hintb{all:unset;cursor:pointer;align-self:flex-start;min-height:44px;padding:4px 14px;border-radius:999px;border:2px dashed var(--card-border,#CBD5E1);font-size:16px;font-weight:800;color:var(--text,#0E2A5B)}' +
      '.ls-hintt{align-self:stretch;font-size:17px;line-height:1.4;padding:8px 12px;border-radius:12px;background:var(--option-default-bg,#E2EBFB);color:var(--text,#0E2A5B)}';
    (D.head || D.documentElement).appendChild(s);
  })();

  /* units with no lesson path (Italiano 1 Ripasso, Italiano 2 Page 1, Italiano 3 Ripasso): Ascolta e leggi shows as a bonus card on the round summary, never after La Prova */
  (function () {
    var m = /\/(italiano[1-4]|ap)\//.exec(W.location.pathname); if (!m) return;
    var LV = m[1];
    setInterval(function () {
      try {
        var u = W.BT_UNIT || (typeof BT_UNIT !== 'undefined' ? BT_UNIT : ''), b = ((W.BohBonus || {})[LV] || {})[u];
        if (!b) return;
        var look = D.querySelector('.look[data-screen="summary"]'), g = W.__game, md = g && g.state ? g.state.mode : '';
        if (!look || md === 'prova' || (typeof MODES !== 'undefined' && MODES[md] && MODES[md].graded)) return;
        var wrap = look.querySelector('.wrap'); if (!wrap || wrap.querySelector('.blb')) return;
        var d = D.createElement('div'); d.className = 'blb bid';
        var btns = (b.listen || []).map(function (x, i) { return '<button type="button" class="ls-wbw" data-i="' + i + '">' + (done('bb_' + LV + '_' + u + '_' + i) ? '&#10003; ' : '&#128266; ') + 'Domanda ' + (i + 1) + '</button>'; }).join('') +
          (b.read ? '<button type="button" class="ls-wbw" data-r="1">' + (done('bb_' + LV + '_' + u + '_read') ? '&#10003; ' : '&#128214; ') + esc(b.read.title) + '</button>' : '');
        d.innerHTML = '<div class="bid-k">&#127911; Bonus · Ascolta e leggi</div><div class="bid-note">Hear a question and answer out loud, or read a short text and answer the questions.</div><div class="ls-wb">' + btns + '</div>';
        d.addEventListener('click', function (e) {
          var t = e.target.closest ? e.target.closest('button') : null; if (!t) return;
          var redo = function () { if (d.parentNode) d.parentNode.removeChild(d); };
          if (t.hasAttribute('data-r')) open({ type: 'leggi', key: 'bb_' + LV + '_' + u + '_read', title: b.read.title, passage: b.read.passage, gloss: b.read.gloss, questions: b.read.questions, work: 'Reading · ' + b.work, onClose: redo });
          else { var x = b.listen[+t.getAttribute('data-i')]; open({ type: 'ascolta', key: 'bb_' + LV + '_' + u + '_' + t.getAttribute('data-i'), q: x.q, en: x.en, frames: x.frames, work: 'Listening · ' + b.work, onClose: redo }); }
        });
        wrap.appendChild(d);
      } catch (e) {}
    }, 500);
  })();

  W.BohListen = { open: open, close: close, done: done };
})(window, document);
