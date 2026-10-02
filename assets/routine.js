/* Boh · listening-and-speaking routine — one engine for every "Quando ero piccolo/a"-style unit.
   BohRoutine.register({...unit content...})              (the content lives in assets/routine-<id>.js)
   BohRoutine.open(id, { boh:{name,base}, pay(bc), onClose() })
   Seven stages: Ascolta, Abbina, Scrivi, Registra 1, Dialogo, Ascolta e ripeti + Registra 2, Costruisci. Plus Ripasso, La Tabella, a break.
   No audio files and no server: the browser's own Italian voice. No microphone: recordings go to Vocaroo in a new tab.
   Progress is kept on this device in localStorage 'boh_rt_<id>' (it rides along in the Boh save code).
   The game never scores or corrects speaking. */
(function (W) {
  if (W.BohRoutine) return;
  var UNITS = {}, U = null, S = null, O = null, root = null, V = {}, ACT = {}, clockIv = null, keyH = null, toastTm = null;

  /* ---------------------------------------------------------------- tiny helpers */
  function esc(t) { return String(t == null ? '' : t).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function md(t) { return esc(t).replace(/\*\*(.+?)\*\*/g, '<b>$1</b>'); }
  function lc1(s) { return s.charAt(0).toLowerCase() + s.slice(1); }
  function uc1(s) { return s.charAt(0).toUpperCase() + s.slice(1); }
  function shuffle(a) { var b = a.slice(), i, j, t; for (i = b.length - 1; i > 0; i--) { j = Math.floor(Math.random() * (i + 1)); t = b[i]; b[i] = b[j]; b[j] = t; } return b; }
  function T(s) { return String(s == null ? '' : s).replace(/\{o\/a\}/g, 'o/a').replace(/\{o\}/g, S ? S.end : 'o'); }   // {o} = the student's own ending; {o/a} = said to a partner, so both
  function FR(id) { for (var i = 0; i < U.frames.length; i++) if (U.frames[i].id === id) return U.frames[i]; return null; }
  function range(n) { var a = []; for (var i = 0; i < n; i++) a.push(i); return a; }

  /* ---------------------------------------------------------------- saved state */
  function key() { return 'boh_rt_' + U.id; }
  function fresh() {
    return { v: 1, name: '', end: '', en: false, done: {}, paid: {}, abbina: false, picks: [], ends: {}, pos: {},
      links: { r1: '', dialogo: '', r2: '' }, phone: { r1: false, dialogo: false, r2: false },
      dlg: { mode: '', seat: -1, round: 0, rounds: [false, false, false], commons: [], asked: 0 },
      lad: { pick: [], L: {}, heard: false, recall: false }, ex: {}, rip: { count: 0, days: [false, false, false] },
      breakOffered: false, soundOk: null, timer: { mins: 0, start: 0 } };
  }
  function load() {
    var o = null;
    try { o = JSON.parse(localStorage.getItem(key()) || 'null'); } catch (e) {}
    var f = fresh();
    if (o && typeof o === 'object') for (var k in o) f[k] = o[k];
    // fill any missing sub-objects (older saves)
    var d = fresh();
    ['links', 'phone', 'dlg', 'lad', 'rip', 'timer', 'done', 'paid', 'ends', 'pos', 'ex'].forEach(function (k) { if (!f[k] || typeof f[k] !== 'object') f[k] = d[k]; });
    return f;
  }
  function save() { try { localStorage.setItem(key(), JSON.stringify(S)); } catch (e) {} }
  function bohEnd(boh) { return boh && boh.base === 'm' ? 'o' : (boh && boh.base ? 'a' : 'o'); }

  /* ---------------------------------------------------------------- sentences, built from the content list */
  function choiceOf(fid, ci) { var f = FR(fid); return f && f.choices[ci] ? f.choices[ci] : null; }
  function picked() { return U.frames.filter(function (f) { return S.picks.indexOf(f.id) !== -1; }); }
  function endingOf(fid) {   // what the student chose for this frame -> {it,en,pic,typed}
    var e = S.ends[fid], f = FR(fid); if (!f || !e) return null;
    if (e.typed) return { it: e.typed, en: '', pic: '✏️', typed: true, ci: -1 };
    var c = f.choices[e.ci]; if (!c) return null;
    return { it: T(c.it), en: c.en, pic: c.pic, typed: false, ci: e.ci, c: c };
  }
  function pastEn(f) { return f.enShort || f.en; }
  function modelSentence(f) { return { it: T(f.it + ' ' + f.choices[0].it) + '.', en: pastEn(f) + ' ' + f.choices[0].en + '.', pic: f.choices[0].pic }; }
  function sentenceFor(fid) {   // the student's own short sentence (Level 1)
    var f = FR(fid), e = endingOf(fid); if (!f || !e) return null;
    return { it: f.it + ' ' + e.it + '.', en: e.typed ? '(in your own words)' : pastEn(f) + ' ' + e.en + '.', pic: e.pic, typed: e.typed, fid: fid };
  }
  function compose(fid, L) {   // Level 1..4 sentence. L = { op:-1|0|1, det:'', now:-1|choiceNumber }
    var f = FR(fid), e = endingOf(fid); if (!f || !e) return null;
    L = L || {};
    var det = L.det && U.details[L.det] ? U.details[L.det] : null;
    var it, en;
    if (det && det.pos === 'verb') { it = f.it + ' ' + det.it + ' ' + e.it; en = (f.enAlways || ('I always ' + pastEn(f).slice(2))) + ' ' + e.en; }
    else { it = f.it + ' ' + e.it + (det ? ' ' + det.it : ''); en = pastEn(f) + ' ' + e.en + (det ? ' ' + det.en : ''); }
    if (e.typed) en = '(in your own words)';
    if (L.op >= 0 && U.openers[L.op]) { var op = U.openers[L.op]; it = T(op.it) + (op.comma ? ', ' : ' ') + lc1(it); en = op.en + ', ' + en; }
    if (L.now >= 0 && f.choices[L.now]) { var nc = f.choices[L.now]; it += ', ' + U.adesso.it + ' ' + f.now + ' ' + T(nc.it); en += ', ' + U.adesso.en + ' ' + f.nowEn + ' ' + nc.en; }
    var level = 1 + (L.op >= 0 ? 1 : 0) + (L.det ? 1 : 0) + (L.now >= 0 ? 1 : 0);
    var hi = L.now >= 0 ? 4 : (L.det ? 3 : (L.op >= 0 ? 2 : 1));
    return { it: uc1(T(it)) + '.', en: en + '.', pic: e.pic, level: hi, typed: e.typed, fid: fid };
  }
  function highest(fid) { return compose(fid, S.lad.L[fid] || {}); }
  function ynOk(f, c) { return c.yn !== false; }
  function ynQ(f, c) { return { it: f.tu + ' ' + T(c.tu || c.it) + '?', en: f.tuEn + ' ' + (c.tuEn || c.en) + '?' }; }
  function ynAns(f, c, yes) {
    return { it: (yes ? 'Sì, ' : 'No, ') + (yes ? (f.yesIt || lc1(f.it)) : (f.noIt || 'non ' + lc1(f.it))) + ' ' + T(c.it) + '.',
             en: (yes ? 'Yes, ' : 'No, ') + (yes ? (f.yesEn || pastEn(f)) : (f.noEn || f.enNo)) + ' ' + c.en + '.' };
  }

  /* ---------------------------------------------------------------- checking typed answers (typos are forgiven) */
  function norm(s) {
    s = String(s || '').toLowerCase();
    try { s = s.normalize('NFD').replace(/[̀-ͯ]/g, ''); } catch (e) {}
    return s.replace(/[’‘`´]/g, "'").replace(/[^a-z0-9' ]/g, ' ').replace(/\s+/g, ' ').trim();
  }
  function dist1(a, b) {   // true when a and b are one slip apart (one letter added, dropped, changed, or two swapped)
    if (a === b) return true;
    var la = a.length, lb = b.length, i;
    if (Math.abs(la - lb) > 1) return false;
    if (la === lb) {
      var diff = [];
      for (i = 0; i < la; i++) if (a.charAt(i) !== b.charAt(i)) { diff.push(i); if (diff.length > 2) return false; }
      if (diff.length === 1) return true;
      return diff.length === 2 && diff[1] === diff[0] + 1 && a.charAt(diff[0]) === b.charAt(diff[1]) && a.charAt(diff[1]) === b.charAt(diff[0]);
    }
    var s = la < lb ? a : b, l = la < lb ? b : a;
    for (i = 0; i < l.length; i++) if (l.slice(0, i) + l.slice(i + 1) === s) return true;
    return false;
  }
  function judge(typed, target) {
    // -> { ok, typo, bad:index|-1, endBad:true|false }
    var A = norm(typed).split(' ').filter(Boolean), B = norm(target).split(' ').filter(Boolean);
    if (!A.length) return { ok: false, bad: -1, empty: true };
    if (A.join('') === B.join('')) return { ok: true };           // a missing or extra space is only a typo
    if (A.length !== B.length) return { ok: false, bad: Math.min(A.length, B.length) - 0, count: true };
    var typo = false;
    for (var i = 0; i < B.length; i++) {
      if (A[i] === B[i]) continue;
      var a = A[i], b = B[i], last = a.charAt(a.length - 1) === b.charAt(b.length - 1);
      if (last && Math.min(a.length, b.length) >= 3 && dist1(a, b)) { typo = true; continue; }
      return { ok: false, bad: i, endBad: !last && a.slice(0, -1) === b.slice(0, -1) || (!last && dist1(a, b)) };
    }
    return { ok: true, typo: typo };
  }
  function spellingNote(typed, target) {   // show the correct spelling when the student's version differs in any way
    var t = String(typed || '').trim().replace(/[.!?]+$/, ''), g = String(target || '').replace(/[.!?]+$/, '');
    return t !== g;
  }

  /* ---------------------------------------------------------------- audio: the browser's Italian voice */
  var Say = { voice: null, none: false, ready: false, listeners: [], cur: null };
  function bestVoice(vs) {
    var it = vs.filter(function (v) { return /^it([-_]|$)/i.test(v.lang || ''); });
    if (!it.length) it = vs.filter(function (v) { return /italia/i.test(v.name || ''); });
    if (!it.length) return null;
    function score(v) {
      var n = v.name || '', sc = 0;
      if (/natural|neural|premium|enhanced|siri/i.test(n)) sc += 50;
      if (/google/i.test(n)) sc += 40;
      if (/microsoft/i.test(n)) sc += 35;
      if (/alice|federica|luca|paola|elsa|isabella|diego/i.test(n)) sc += 20;
      if (/^it[-_]IT$/i.test(v.lang || '')) sc += 8;
      if (v.localService) sc += 4;
      if (/espeak|compact/i.test(n)) sc -= 30;
      return sc;
    }
    it.sort(function (a, b) { return score(b) - score(a); });
    return it[0];
  }
  Say.init = function (cb) {
    var S_ = W.speechSynthesis;
    if (!S_ || typeof SpeechSynthesisUtterance === 'undefined') { Say.none = true; Say.ready = true; if (cb) cb(); return; }
    var tries = 0, called = false;
    function finish() { if (called) return; called = true; Say.ready = true; if (cb) cb(); }
    function pick() {
      var vs = [];
      try { vs = S_.getVoices() || []; } catch (e) {}
      if (!vs.length && tries++ < 25) { setTimeout(pick, 160); return; }
      Say.voice = bestVoice(vs); Say.none = !Say.voice; finish();
    }
    try { S_.addEventListener('voiceschanged', function () { try { var v = bestVoice(S_.getVoices() || []); if (v) { Say.voice = v; Say.none = false; } } catch (e) {} }); } catch (e) {}
    pick();
  };
  Say.stop = function () { try { if (W.speechSynthesis) W.speechSynthesis.cancel(); } catch (e) {} Say.cur = null; };
  function spokenText(t) {
    return String(t || '').replace(/[←-⇿☀-➿\ud83c-\ud83e][️\udc00-\udfff]*/g, ' ').replace(/️/g, '')
      .replace(/([a-zà-ù]+o)\/a\b/gi, '$1').replace(/[’‘]/g, "'").replace(/\([^)]*\)/g, ' ').replace(/[“”"]/g, '').replace(/\s*\/\s*/g, ' ').replace(/\s+/g, ' ').trim();
  }
  Say.say = function (text, o) {
    o = o || {};
    var t = spokenText(text), fin = false, tm = null, id = {};
    function end() { if (fin) return; fin = true; clearTimeout(tm); if (Say.cur === id) Say.cur = null; if (o.done) { try { o.done(); } catch (e) {} } }
    if (!t) { end(); return; }
    if (Say.none || !W.speechSynthesis) { tm = setTimeout(end, o.silent === false ? 0 : 450); return; }   // no voice: carry on silently
    try {
      var S_ = W.speechSynthesis;
      S_.cancel(); try { S_.resume(); } catch (e) {}
      Say.cur = id;
      setTimeout(function () {
        if (fin || Say.cur !== id) return;
        try {
          var u = new SpeechSynthesisUtterance(t);
          u.lang = 'it-IT'; if (Say.voice) u.voice = Say.voice;
          u.rate = o.slow ? 0.55 : 0.88; u.pitch = 1; u.volume = 1;
          u.onend = end; u.onerror = end;
          S_.speak(u);
        } catch (e) { end(); }
      }, 40);
      tm = setTimeout(end, Math.max(1600, t.length * (o.slow ? 210 : 120) + 1800));   // never wait forever
    } catch (e) { end(); }
  };
  Say.seq = function (list, gap, done, slow) {
    var i = 0, stopped = false;
    function next() {
      if (stopped) return;
      if (i >= list.length) { if (done) done(); return; }
      var t = list[i++];
      Say.say(t, { slow: slow, done: function () { setTimeout(next, gap || 250); } });
    }
    next();
    return { stop: function () { stopped = true; Say.stop(); } };
  };
  function say(t, slow) { Say.say(t, { slow: !!slow }); }
  /* after a correct answer: say the sentence, then move on by itself (the Next button still works; a tap on it cancels this) */
  var advTok = null;
  function autoAdvance(text, fn) {
    var tok = advTok = {}, fired = false;
    function go2() { if (fired || advTok !== tok || !root) return; fired = true; advTok = null; try { fn(); } catch (e) {} }
    Say.say(text, { done: function () { setTimeout(go2, 900); } });
    setTimeout(go2, 4500);
  }

  /* ---------------------------------------------------------------- look */
  var CSS = '' +
    '.brt-ov{position:fixed;inset:0;z-index:9998;overflow:auto;-webkit-overflow-scrolling:touch;background:rgba(20,16,24,.72);backdrop-filter:blur(4px);font:16px/1.4 Manrope,system-ui,-apple-system,sans-serif;display:flex;align-items:flex-start;justify-content:center;padding:14px}' +
    '.brt{--bg:#fff;--ink:#2B2430;--mut:#6B5F68;--line:#E3D8DC;--soft:#F5EFEF;--acc:#C1654F;--ok:#1E8C4A;--okbg:#E3F4EA;--try:#B7802A;--trybg:#FBF0DD;--vio:#6A4C93;--viobg:#EFE8F7;' +
    'width:min(760px,100%);display:flex;flex-direction:column;gap:14px;padding:18px 18px 22px;border-radius:26px;background:var(--bg);color:var(--ink);box-shadow:0 24px 60px rgba(0,0,0,.4);margin:auto}' +
    '.brt.dark{--bg:#251C2A;--ink:#F2EAF0;--mut:#B7A8B8;--line:#3A2E40;--soft:#2F2535;--acc:#E88A6C;--ok:#6BD49A;--okbg:#1E3528;--try:#E0AA55;--trybg:#3A2E1C;--vio:#B79AE0;--viobg:#352B45}' +
    '.brt *{box-sizing:border-box}' +
    '.brt h2{margin:0;font:800 22px/1.15 "Bricolage Grotesque",system-ui,sans-serif}.brt h3{margin:0;font:800 17px/1.2 "Bricolage Grotesque",system-ui,sans-serif}.brt p{margin:0}' +
    ':where(.brt) button,:where(.brt) a.b{all:unset;box-sizing:border-box;cursor:pointer;-webkit-tap-highlight-color:transparent}' +
    '.brt :focus-visible{outline:3px solid var(--vio);outline-offset:2px}' +
    '.brt-top{display:flex;align-items:center;gap:10px}.brt-top .t{flex:1;min-width:0}' +
    '.brt-x{width:44px;height:44px;border-radius:50%;display:grid;place-items:center;background:var(--soft);font-size:18px;flex:none}' +
    '.brt-eye{font:800 11px system-ui;letter-spacing:.14em;text-transform:uppercase;color:var(--mut)}' +
    '.brt-bar{height:9px;border-radius:9px;background:var(--soft);overflow:hidden}.brt-bar i{display:block;height:100%;background:var(--ok);border-radius:9px;transition:width .3s}' +
    '.brt-b{display:inline-flex;align-items:center;justify-content:center;gap:8px;min-height:48px;padding:12px 18px;border-radius:16px;font-weight:900;font-size:16px;text-align:center}' +
    '.brt-b.go{background:var(--acc);color:#fff}.brt-b.ghost{background:var(--soft);color:var(--ink)}.brt-b.ok{background:var(--okbg);color:var(--ok);border:2px solid var(--ok)}.brt-b.vio{background:var(--vio);color:#fff}' +
    '.brt-b[aria-disabled="true"],.brt-b:disabled{opacity:.45;cursor:default}' +
    '.brt-row{display:flex;gap:10px;flex-wrap:wrap;align-items:center}.brt-grow{flex:1 1 150px}' +
    '.brt-card{border:2px solid var(--line);border-radius:20px;padding:14px 16px;background:var(--soft);display:flex;flex-direction:column;gap:10px}' +
    '.brt-card.vio{background:var(--viobg);border-color:var(--vio)}.brt-card.ok{background:var(--okbg);border-color:var(--ok)}.brt-card.try{background:var(--trybg);border-color:var(--try)}' +
    '.brt-note{font-size:14px;color:var(--mut);font-weight:700}.brt-big{font:900 clamp(24px,5.5vw,34px)/1.15 "Bricolage Grotesque",system-ui,sans-serif}' +
    '.brt-pic{font-size:clamp(46px,12vw,72px);line-height:1;text-align:center}' +
    '.brt-say{width:46px;height:46px;border-radius:50%;display:inline-grid;place-items:center;background:var(--bg);border:2px solid var(--line);font-size:19px;flex:none}' +
    '.brt-say.slow{font-size:18px}' +
    '.brt-tag{display:inline-block;padding:3px 10px;border-radius:999px;font:800 11.5px system-ui;letter-spacing:.06em;text-transform:uppercase}' +
    '.brt-tag.acc{background:var(--trybg);color:var(--try)}.brt-tag.spk{background:var(--viobg);color:var(--vio)}.brt-tag.lis{background:var(--okbg);color:var(--ok)}' +
    '.brt-stage{display:flex;align-items:center;gap:12px;padding:12px 14px;border-radius:18px;border:2px solid var(--line);background:var(--soft)}' +
    '.brt-stage.done{border-color:var(--ok);background:var(--okbg)}.brt-stage .n{width:34px;height:34px;border-radius:50%;display:grid;place-items:center;background:var(--bg);font-weight:900;flex:none}' +
    '.brt-stage .tx{flex:1;min-width:0}.brt-stage .tx b{display:block;font-size:16.5px}' +
    '.brt-opts{display:grid;grid-template-columns:1fr 1fr;gap:10px}@media(max-width:520px){.brt-opts{grid-template-columns:1fr}}' +
    '.brt-opt{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px;min-height:84px;padding:12px;border-radius:18px;border:3px solid var(--line);background:var(--bg);font-weight:800;font-size:16.5px;text-align:center}' +
    '.brt-opt .p{font-size:36px;line-height:1}.brt-opt small{font-size:13px;color:var(--mut);font-weight:700}' +
    '.brt-img{height:1.2em;width:auto;max-width:1.8em;object-fit:contain;vertical-align:middle;-webkit-user-drag:none;user-select:none}.brt-pic .brt-img{height:2.3em;max-width:3.6em}.brt-opt .brt-img{height:84px;max-width:128px}.brt-li>.brt-img{height:56px;max-width:84px;flex:0 0 auto}button .brt-img{height:44px;max-width:68px}' +
    '.brt-opt.try{border-color:var(--try);background:var(--trybg);opacity:.6}.brt-opt.ok{border-color:var(--ok);background:var(--okbg)}.brt-opt.off{opacity:.5}' +
    '.brt-chip{display:inline-flex;align-items:center;gap:8px;min-height:48px;padding:8px 14px;border-radius:999px;border:2px solid var(--line);background:var(--bg);font-weight:800;font-size:16px}' +
    '.brt-chip .p{font-size:22px}.brt-chip small{display:block;font-size:12px;color:var(--mut);font-weight:700}' +
    '.brt-chip.on{border-color:var(--vio);background:var(--viobg)}.brt-chip.ok{border-color:var(--ok);background:var(--okbg)}' +
    '.brt-in{width:100%;padding:14px 16px;border-radius:16px;border:3px solid var(--line);background:var(--bg);color:var(--ink);font:700 19px/1.2 inherit}' +
    '.brt-in:focus{border-color:var(--vio);outline:none}' +
    '.brt-sent{font:800 20px/1.3 "Bricolage Grotesque",system-ui,sans-serif}.brt-en{font-size:15px;color:var(--mut);font-weight:700}' +
    '.brt-pair{display:inline-flex;gap:8px;align-items:center;padding:6px 12px;border-radius:999px;background:var(--viobg);color:var(--vio);font-weight:900}' +
    '.brt-steps{margin:0;padding-left:22px;display:flex;flex-direction:column;gap:6px;font-weight:500}' +
    '.brt-toast{position:fixed;left:50%;bottom:22px;transform:translateX(-50%);z-index:10000;padding:12px 20px;border-radius:999px;background:#1E8C4A;color:#fff;font-weight:900;box-shadow:0 8px 24px rgba(0,0,0,.35)}' +
    '.brt-list{display:flex;flex-direction:column;gap:8px}.brt-li{display:flex;align-items:center;gap:10px;padding:10px 12px;border-radius:16px;background:var(--bg);border:2px solid var(--line)}' +
    '.brt-li .tx{flex:1;min-width:0}.brt-tab{padding:10px 16px;border-radius:999px;border:2px solid var(--line);background:var(--bg);font-weight:900}.brt-tab[aria-pressed="true"]{background:var(--vio);color:#fff;border-color:var(--vio)}' +
    '.brt-mem{display:grid;grid-template-columns:repeat(4,1fr);gap:8px}@media(max-width:520px){.brt-mem{grid-template-columns:repeat(3,1fr)}}' +
    '.brt-mc{min-height:76px;border-radius:16px;border:3px solid var(--line);background:var(--soft);display:grid;place-items:center;font-weight:900;font-size:15.5px;text-align:center;padding:6px}' +
    '.brt-mc.up{background:var(--bg);border-color:var(--vio)}.brt-mc.ok{background:var(--okbg);border-color:var(--ok)}.brt-mc .p{font-size:34px}' +
    '.brt-pause{height:12px;border-radius:9px;background:var(--soft);overflow:hidden}.brt-pause i{display:block;height:100%;width:0;background:var(--vio);border-radius:9px}' +
    '.brt-chk{display:flex;align-items:center;gap:10px;font-weight:800;font-size:15.5px}.brt-chk input{width:24px;height:24px;accent-color:var(--vio)}' +
    '@media (prefers-reduced-motion:reduce){.brt-bar i{transition:none}}';

  function dark() {
    if (O && O.dark != null) return !!O.dark;
    var t = null; try { t = localStorage.getItem('boh_theme'); } catch (e) {}
    if (t === 'dark') return true; if (t === 'light') return false;
    var r = document.documentElement.getAttribute('data-theme'); if (r) return r === 'dark';
    return !!(W.matchMedia && matchMedia('(prefers-color-scheme: dark)').matches);
  }
  function toast(msg) {
    var old = document.querySelector('.brt-toast'); if (old) old.remove();
    var d = document.createElement('div'); d.className = 'brt-toast'; d.setAttribute('role', 'status'); d.textContent = msg; document.body.appendChild(d);
    clearTimeout(toastTm); toastTm = setTimeout(function () { d.remove(); }, 2300);
  }
  function pay(k) {   // pay a named reward once
    var amt = U.bc[k]; if (!amt || S.paid[k]) return 0;
    S.paid[k] = true; save();
    try { if (O && O.pay) O.pay(amt); } catch (e) {}
    toast('+' + amt + ' Boh Cashi');
    return amt;
  }
  function paySmall(k, amt) {   // repeatable small rewards that carry their own key (ripasso days, extras)
    if (!amt || S.paid[k]) return 0;
    S.paid[k] = true; save();
    try { if (O && O.pay) O.pay(amt); } catch (e) {}
    toast('+' + amt + ' Boh Cashi');
    return amt;
  }
  function stageDone(n) {
    if (S.done[n]) return;
    S.done[n] = true; save();
    pay('s' + n);
    var all = true; for (var i = 1; i <= 7; i++) if (!S.done[i]) all = false;
    if (all) setTimeout(function () { pay('allSeven'); }, 900);
  }
  function doneCount() { var c = 0; for (var i = 1; i <= 7; i++) if (S.done[i]) c++; return c; }
  function hasPicks() { return S.picks.length === U.chooseCount && S.picks.every(function (id) { return !!S.ends[id]; }); }

  /* ---------------------------------------------------------------- screens and events */
  function draw(html) {
    var box = root.querySelector('.brt');
    box.className = 'brt' + (dark() ? ' dark' : '');
    box.innerHTML = html;
    root.scrollTop = 0;
    var f = box.querySelector('[data-focus]'); if (f) { try { f.focus(); } catch (e) {} }
  }
  function go(screen, extra) {
    Say.stop();
    V.screen = screen; V.x = extra || {};
    render();
  }
  function render() {
    var fn = SCREENS[V.screen] || SCREENS.hub;
    try { draw(fn()); save(); } catch (e) { try { console.error(e); } catch (e2) {} draw('<p class="brt-note">Something went wrong on this screen. Your work is saved.</p><button class="brt-b go" data-a="hub">Back to the list</button>'); }
  }
  var SCREENS = {};

  function onClick(e) {
    var el = e.target.closest ? e.target.closest('[data-a]') : null;
    if (!el || !root.contains(el)) return;
    if (el.getAttribute('aria-disabled') === 'true' || el.disabled) return;
    var a = el.getAttribute('data-a');
    if (ACT[a]) { e.preventDefault(); try { ACT[a](el); } catch (err) { try { console.error(err); } catch (e2) {} } }
  }
  function onInput(e) {
    var el = e.target; if (!el || !el.getAttribute) return;
    var a = el.getAttribute('data-in'); if (a && ACT[a]) { try { ACT[a](el); } catch (err) {} }
  }
  function onKey(e) {
    if (!root) return;
    if (e.key === 'Escape') { var x = root.querySelector('[data-a="close"]'); if (x) { e.preventDefault(); ACT.close(); } return; }
    if (e.key === 'Enter' && e.target && e.target.getAttribute && e.target.getAttribute('data-enter')) { e.preventDefault(); var a = e.target.getAttribute('data-enter'); if (ACT[a]) ACT[a](e.target); }
  }

  /* ---------------------------------------------------------------- shared pieces */
  function sayBtns(it, extraAttr) {   // speaker + turtle for any Italian text
    var t = esc(it);
    return '<button class="brt-say" data-a="say" data-t="' + t + '" aria-label="Hear it">🔊</button>' +
           '<button class="brt-say slow" data-a="sayslow" data-t="' + t + '" aria-label="Hear it slowly">🐢</button>';
  }
  ACT.say = function (el) { say(el.getAttribute('data-t'), false); };
  ACT.sayslow = function (el) { say(el.getAttribute('data-t'), true); };
  function head(title, kicker, tagHtml, noHub) {
    return '<div class="brt-top"><div class="t"><div class="brt-eye">' + esc(kicker || U.title) + '</div><h2>' + esc(title) + '</h2></div>' + (tagHtml || '') +
      (noHub ? '' : '<button class="brt-x" data-a="hub" aria-label="Back to the stage list">☰</button>') +
      '<button class="brt-x" data-a="close" aria-label="Close and go back to the game">✕</button></div>';
  }
  /* a picture is an emoji, or "img:path" if a real image file is used instead (swap them one at a time, nothing else changes) */
  /* pictures are re-fetched whenever the game is re-published: they borrow this script's own ?v= stamp */
  var QV = ''; try { QV = ((document.currentScript && document.currentScript.src) || '').match(/\?v=\d+/)[0]; } catch (e) {}
  function P(pic, cls) {
    pic = String(pic || '');
    if (pic.indexOf('img:') === 0) return '<img class="brt-img" src="' + esc(pic.slice(4)) + QV + '" alt="" decoding="async" draggable="false">';
    return '<span class="' + (cls || 'p') + '" aria-hidden="true">' + esc(pic) + '</span>';
  }
  var STAGE_NAMES = ['', 'Ascolta', 'Abbina', 'Scrivi', 'Registra 1', 'Dialogo', 'Ascolta e ripeti + Registra 2', 'Costruisci'];
  var STAGE_EN = ['', 'Listen', 'Match', 'Write', 'Record 1', 'Talk with a partner', 'Listen, repeat, record again', 'Build'];
  var STAGE_KIND = ['', 'lis', 'acc', 'acc', 'spk', 'spk', 'spk', 'spk'];
  var STAGE_MIN = ['', 8, 10, 10, 5, 12, 8, 10];
  function kindTag(n) {
    var k = STAGE_KIND[n];
    return k === 'acc' ? '<span class="brt-tag acc">Accuracy</span>' : (k === 'spk' ? '<span class="brt-tag spk">Speaking: just be understood</span>' : '<span class="brt-tag lis">Listening: no score</span>');
  }
  function stageHead(n) {
    var pct = Math.round((doneCount() / 7) * 100);
    return head(STAGE_NAMES[n], 'Stage ' + n + ' of 7 · ' + STAGE_EN[n], '') +
      '<div class="brt-row">' + kindTag(n) + '<span class="brt-note">' + doneCount() + ' of 7 stages done</span></div>' +
      '<div class="brt-bar" aria-hidden="true"><i style="width:' + pct + '%"></i></div>';
  }
  function enBtn() {
    return '<button class="brt-b ghost" data-a="toggleen" aria-pressed="' + (S.en ? 'true' : 'false') + '">' + (S.en ? 'English: on' : 'English: tap to show') + '</button>';
  }
  ACT.toggleen = function () { S.en = !S.en; save(); render(); };
  ACT.hub = function () { go('hub'); };
  ACT.close = function () { R.close(); };
  /* "Record on Vocaroo": a new tab, three steps, a box for the link, or "I recorded on my phone" */
  function vocarooBox(k, label) {
    var link = S.links[k] || '', ph = !!S.phone[k];
    var odd = link && !/voca/i.test(link);
    return '<div class="brt-card vio"><h3>🎙️ ' + esc(label) + '</h3>' +
      '<a class="b brt-b vio" href="' + esc(U.vocaroo) + '" target="_blank" rel="noopener" data-a="vocaroo">🎙️ Record on Vocaroo (opens a new tab)</a>' +
      '<ol class="brt-steps"><li>Record: press the red button and read your sentences.</li><li>Press <b>Save</b> (then <b>Done</b> if it asks).</li><li>Copy the link, come back to this tab, and paste it below.</li></ol>' +
      '<label class="brt-note" for="brt-link-' + k + '">Paste your Vocaroo link here</label>' +
      '<input id="brt-link-' + k + '" class="brt-in" type="url" inputmode="url" autocomplete="off" placeholder="https://voca.ro/..." value="' + esc(link) + '" data-in="link" data-k="' + k + '">' +
      (odd ? '<p class="brt-note">That does not look like a Vocaroo link, but you can still go on.</p>' : '') +
      '<label class="brt-chk"><input type="checkbox" data-in="phone" data-k="' + k + '"' + (ph ? ' checked' : '') + '> I recorded on my phone</label>' +
      '<p class="brt-note">Your teacher listens to your recording. The game does not score how you sound.</p></div>';
  }
  ACT.link = function (el) { S.links[el.getAttribute('data-k')] = el.value.trim(); save(); var b = root.querySelector('[data-needrec]'); if (b) syncRec(b); };
  ACT.phone = function (el) { S.phone[el.getAttribute('data-k')] = !!el.checked; save(); var b = root.querySelector('[data-needrec]'); if (b) syncRec(b); };
  function recOk(k) { return !!(S.links[k] || S.phone[k]); }
  function syncRec(b) { var ok = recOk(b.getAttribute('data-needrec')); b.setAttribute('aria-disabled', ok ? 'false' : 'true'); b.classList.toggle('go', ok); b.classList.toggle('ghost', !ok); }
  ACT.vocaroo = function () { /* the link opens in its own tab; nothing else to do */ };

  /* ================================================================ THE STAGE LIST (home of the unit) */
  function clockText() {
    var t = S.timer; if (!t || !t.mins || !t.start) return '';
    var left = Math.round(t.mins - (Date.now() - t.start) / 60000);
    return left > 0 ? '⏱ about ' + left + ' min left on your timer' : '⏱ Your timer is up. Finish what you are doing, then stop at a saved point.';
  }
  ACT.timerset = function (el) { var m = parseInt(el.getAttribute('data-m'), 10) || 0; S.timer = { mins: m, start: m ? Date.now() : 0 }; save(); render(); };
  ACT.setend = function (el) { S.end = el.getAttribute('data-e') === 'a' ? 'a' : 'o'; save(); render(); };
  ACT.soundtest = function () {
    var go_ = function () {
      if (Say.none) { V.sound = 'none'; render(); return; }
      V.sound = 'playing'; render();
      Say.say('Ciao!', { done: function () { V.sound = 'ask'; if (V.screen === 'hub') render(); } });
    };
    if (Say.ready) go_(); else Say.init(go_);
  };
  ACT.soundyes = function () { S.soundOk = true; V.sound = ''; save(); render(); };
  ACT.soundno = function () { V.sound = 'help'; render(); };
  ACT.voicepick = function () { if (W.BohVoice) W.BohVoice.openPicker(); };
  function soundBlock() {
    if (Say.none || V.sound === 'none') {
      return '<div class="brt-card try" role="status"><b>This computer has no Italian voice.</b><p>You can keep going: read the Italian and tap English whenever you need it. The game will stay quiet. Tell your teacher so she can check the sound settings.</p></div>';
    }
    if (V.sound === 'playing') return '<div class="brt-card vio" role="status">🔊 Listening…</div>';
    if (V.sound === 'ask') return '<div class="brt-card vio"><b>Did you hear “Ciao!”?</b><div class="brt-row"><button class="brt-b ok" data-a="soundyes">Yes, I heard it</button><button class="brt-b ghost" data-a="soundno">No</button><button class="brt-b ghost" data-a="voicepick">🤖 It sounds like a robot</button></div></div>';
    if (V.sound === 'help') return '<div class="brt-card try"><b>No sound? Try these.</b><ol class="brt-steps"><li>Turn the Chromebook volume up and make sure it is not muted.</li><li>Look at the browser tab: if there is a speaker with a line through it, unmute the tab.</li><li>Plug in headphones if you have them.</li></ol><div class="brt-row"><button class="brt-b go" data-a="soundtest">🔊 Test again</button><button class="brt-b ghost" data-a="voicepick">🤖 Choose another voice</button><button class="brt-b ghost" data-a="soundyes">Go on without sound</button></div></div>';
    if (S.soundOk) return '<div class="brt-row"><span class="brt-note">✓ Sound works.</span><button class="brt-b ghost" data-a="soundtest">🔊 Test again</button><button class="brt-b ghost" data-a="voicepick">🔊 Change voice</button></div>';
    return '<button class="brt-b go" data-a="soundtest">🔊 Tap to test your sound</button>';
  }
  var STAGE_HELP = [
    '', 'Hear a short story about a kid, then all 14 model sentences. No score. No teacher needed.',
    'Match what you hear to pictures, then choose your own 10 sentences. No teacher needed.',
    'Type your 10 sentences: first with the words in front of you, then only from what you hear. Typos are fine.',
    'Read your 10 sentences aloud and record them on Vocaroo.',
    'Pair work: ask and answer questions about when you were little. You need a partner.',
    'Listen to your sentences, repeat them, and record again on Vocaroo.',
    'Make your sentences longer, one step at a time, then say them from memory.'];
  SCREENS.hub = function () {
    var h = head(U.title, 'Italiano 3 Honors · Listening and speaking', '', true);
    h += '<p>' + esc(U.intro) + '</p>';
    h += '<div class="brt-card"><h3>Start here</h3><ol class="brt-steps"><li>Tap <b>Test your sound</b> (below).</li><li>Do <b>Stages 1, 2 and 3</b> on your own. You do not need your teacher for them.</li><li>Stages 4 to 7 are speaking. You will record on Vocaroo, in a new tab.</li><li>You can do the stages in any order. The list shows the best order. Your progress and Boh Cashi save by themselves.</li></ol></div>';
    h += soundBlock();
    h += '<div class="brt-row"><span class="brt-note">Write as:</span>' +
      '<button class="brt-chip' + (S.end === 'o' ? ' on' : '') + '" data-a="setend" data-e="o" aria-pressed="' + (S.end === 'o') + '"><span>timid<b>o</b> (boy)</span></button>' +
      '<button class="brt-chip' + (S.end === 'a' ? ' on' : '') + '" data-a="setend" data-e="a" aria-pressed="' + (S.end === 'a') + '"><span>timid<b>a</b> (girl)</span></button></div>';
    h += '<div class="brt-bar" aria-hidden="true"><i style="width:' + Math.round(doneCount() / 7 * 100) + '%"></i></div><p class="brt-note"><b>' + doneCount() + ' of 7</b> stages done · plan 45 to 60 minutes. Short day: stages 1 to 5. Full day: all seven.</p>';
    h += '<div class="brt-list">';
    for (var n = 1; n <= 7; n++) {
      var d = S.done[n], st = d ? '✓ Done' : (stageStarted(n) ? 'In progress' : 'Start');
      h += '<div class="brt-stage' + (d ? ' done' : '') + '"><div class="n">' + (d ? '✓' : n) + '</div><div class="tx"><b>' + n + '. ' + esc(STAGE_NAMES[n]) + '</b>' +
        '<div class="brt-note">' + esc(STAGE_HELP[n]) + ' · about ' + STAGE_MIN[n] + ' min</div><div style="margin-top:4px">' + kindTag(n) + '</div></div>' +
        '<button class="brt-b ' + (d ? 'ghost' : 'go') + '" data-a="stage" data-n="' + n + '">' + (d ? 'Again' : (stageStarted(n) ? 'Continue' : 'Start')) + '</button></div>';
      if (n === 2 && S.done[2]) h += '<p class="brt-note" style="margin:-2px 0 0 10px">✅ <b>Stopping point A:</b> your progress and Boh Cashi are saved here.</p>';
      if (n === 5 && S.done[5]) h += '<p class="brt-note" style="margin:-2px 0 0 10px">✅ <b>Stopping point B:</b> your progress and Boh Cashi are saved here.</p>';
    }
    h += '</div>';
    h += '<div class="brt-row"><button class="brt-b vio" data-a="tabella">📖 La Tabella: tips and extras</button><button class="brt-b ghost" data-a="pausa">🎮 Pausa</button>' +
      '<button class="brt-b ghost" data-a="ripasso">🔁 Ripasso (5 to 10 min)</button><button class="brt-b ghost" data-a="finish">📋 My work</button></div>';
    h += ripassoBoxes();
    h += '<div class="brt-card"><b>Work timer (optional)</b><p class="brt-note">Set it for yourself. It only tells you the time; it never stops you.</p><div class="brt-row">' +
      [30, 45, 60, 0].map(function (m) { return '<button class="brt-chip' + ((S.timer.mins || 0) === m ? ' on' : '') + '" data-a="timerset" data-m="' + m + '">' + (m ? m + ' min' : 'Off') + '</button>'; }).join('') +
      '</div><div class="brt-note" id="brt-clock">' + esc(clockText()) + '</div></div>';
    return h;
  };
  function stageStarted(n) {
    if (S.done[n]) return true;
    if (n === 1) return !!S.pos.s1;
    if (n === 2) return S.abbina || S.picks.length > 0 || !!S.pos.s2;
    if (n === 3) return !!S.pos.s3;
    if (n === 4) return recOk('r1');
    if (n === 5) return !!S.dlg.mode;
    if (n === 6) return !!S.pos.s6;
    if (n === 7) return S.lad.pick.length > 0;
    return false;
  }
  function ripassoBoxes() {
    if (!S.done[1] && !S.rip.count && doneCount() < 7) return '';
    var allDone = doneCount() === 7;
    var h = '<div class="brt-card ' + (allDone ? 'vio' : '') + '"><h3>Come back for Ripasso</h3><p class="brt-note">Five to ten minutes on Day 2, Day 4 and Day 8. Short visits spread over a week make the sentences stay. Each Ripasso you finish checks a box and pays a little Boh Cashi.</p><div class="brt-row">';
    ['Day 2', 'Day 4', 'Day 8'].forEach(function (d, i) { h += '<label class="brt-chk"><input type="checkbox" disabled' + (S.rip.days[i] ? ' checked' : '') + '> ' + d + '</label>'; });
    return h + '</div></div>';
  }
  ACT.stage = function (el) {
    var n = parseInt(el.getAttribute('data-n'), 10);
    V.ret = null;
    if (n >= 3 && !hasPicks()) { V.ret = n; go('needpicks'); return; }
    if (n === 1) { go('s1'); return; }
    if (n === 2) {
      var p2 = S.pos.s2;
      if (p2 && p2.phase === 'pointA') p2.phase = S.abbina ? (hasPicks() ? 'menu' : 'pickframes') : 'abbina';
      go('s2'); if (S.pos.s2 && S.pos.s2.phase === 'abbina') autoplayItem(); return;
    }
    if (n === 5) V.d0 = false;
    go('s' + n);
  };
  SCREENS.needpicks = function () {
    return head('Choose your 10 sentences first', U.title, '') +
      '<div class="brt-card try"><p><b>This stage uses your own 10 sentences.</b> They are part of Stage 2 (right after the matching game). Choose them first and you can come right back.</p></div>' +
      '<div class="brt-row"><button class="brt-b go" data-a="gopicks">Choose my 10 sentences</button><button class="brt-b ghost" data-a="hub">Back to the list</button></div>';
  };
  ACT.gopicks = function () { go('s2', { phase: 'pickframes' }); };

  /* ================================================================ STAGE 1 · ASCOLTA */
  function sP(k, d) { return S.pos[k] || (S.pos[k] = d); }
  SCREENS.s1 = function () {
    var p = sP('s1', { phase: 'story', i: 0 }), h = stageHead(1);
    if (p.phase === 'story') {
      h += '<div class="brt-card vio"><h3>' + esc(U.passageTitle) + '</h3><p class="brt-note">' + esc(U.passageTitleEn) + '</p>' +
        '<div class="brt-row"><button class="brt-b go" data-a="playstory">▶ Play the whole story</button><button class="brt-b ghost" data-a="stopstory">■ Stop</button>' + enBtn() + '</div></div><div class="brt-list" id="brt-story">';
      U.passage.forEach(function (ln, i) {
        h += '<div class="brt-li" id="brt-ln-' + i + '">' + P(ln[2], 'brt-pic" style="font-size:32px') + '<div class="tx"><div class="brt-sent">' + esc(T(ln[0])) + '</div>' +
          (S.en ? '<div class="brt-en">' + esc(ln[1]) + '</div>' : '<button class="brt-en" style="all:unset;cursor:pointer;text-decoration:underline" data-a="lineen" data-i="' + i + '">English</button>') + '</div>' + sayBtns(T(ln[0])) + '</div>';
      });
      h += '</div><button class="brt-b go" data-a="s1models">Next: the model sentences ▶</button>';
      return h;
    }
    var f = U.frames[p.i], m = modelSentence(f), last = p.i === U.frames.length - 1;
    h += '<div class="brt-note">Sentence ' + (p.i + 1) + ' of ' + U.frames.length + '</div>' +
      '<div class="brt-card vio" style="align-items:center;text-align:center"><div class="brt-pic">' + P(m.pic, 'p') + '</div>' +
      '<div class="brt-big">' + esc(m.it) + '</div>' +
      '<div class="brt-row" style="justify-content:center">' + sayBtns(m.it) + '</div>' +
      (S.en ? '<div class="brt-en">' + esc(m.en) + '</div>' : '') +
      '<div class="brt-pair" aria-label="present to past"><span>' + esc(f.presentIt) + '</span><span>→</span><span>' + esc(lc1(f.it)) + '</span></div>' +
      '<div class="brt-note">' + esc(f.presentEn) + ' → ' + esc(f.en) + '</div></div>' +
      '<div class="brt-row">' + enBtn() + '<span class="brt-grow"></span>' +
      (p.i > 0 ? '<button class="brt-b ghost" data-a="s1prev">◀ Back</button>' : '') +
      (last ? '<button class="brt-b go" data-a="s1done">I listened to all of them ✓</button>' : '<button class="brt-b go" data-a="s1next">Next ▶</button>') + '</div>' +
      '<p class="brt-note">No score here. Just listen and watch the pair: the present on the left, the past on the right.</p>';
    return h;
  };
  var storyRun = null;
  ACT.lineen = function (el) { var i = parseInt(el.getAttribute('data-i'), 10); el.outerHTML = '<div class="brt-en">' + esc(U.passage[i][1]) + '</div>'; };
  ACT.playstory = function () {
    if (storyRun) storyRun.stop();
    var lines = U.passage.map(function (l) { return T(l[0]); }), i = 0, stopped = false;
    storyRun = { stop: function () { stopped = true; Say.stop(); clear(); } };
    function clear() { var a = root.querySelectorAll('.brt-li'); for (var k = 0; k < a.length; k++) a[k].style.outline = ''; }
    (function nextLine() {
      if (stopped) return; clear();
      if (i >= lines.length) { storyRun = null; return; }
      var el = root.querySelector('#brt-ln-' + i); if (el) { el.style.outline = '3px solid var(--vio)'; try { el.scrollIntoView({ block: 'center', behavior: 'smooth' }); } catch (e) {} }
      var t = lines[i++]; Say.say(t, { done: function () { setTimeout(nextLine, 350); } });
    })();
  };
  ACT.stopstory = function () { if (storyRun) storyRun.stop(); storyRun = null; };
  ACT.s1models = function () { if (storyRun) { storyRun.stop(); storyRun = null; } sP('s1', {}).phase = 'models'; S.pos.s1.i = 0; save(); render(); say(modelSentence(U.frames[0]).it); };
  ACT.s1next = function () { var p = S.pos.s1; p.i = Math.min(U.frames.length - 1, p.i + 1); save(); render(); say(modelSentence(U.frames[p.i]).it); };
  ACT.s1prev = function () { var p = S.pos.s1; p.i = Math.max(0, p.i - 1); save(); render(); say(modelSentence(U.frames[p.i]).it); };
  ACT.s1done = function () { stageDone(1); S.pos.s1 = { phase: 'story', i: 0 }; save(); go('hub'); };

  /* ================================================================ STAGE 2 · ABBINA, then choose your 10 */
  function buildAbbina() {
    var fids = shuffle(U.frames.map(function (f) { return f.id; })), n = fids.length, nAud = Math.ceil(n / 2) + 1;   // a little more than half are audio only
    var kinds = [], i;
    for (i = 0; i < n; i++) kinds.push(i < nAud ? 'aud' : ((i - nAud) % 2 === 0 ? 'it2en' : 'en2it'));
    kinds = shuffle(kinds);
    return fids.map(function (fid, k) {
      var seenPic = {}, others = []; seenPic[modelSentence(FR(fid)).pic] = 1;   // four DIFFERENT pictures, so the answer is never ambiguous without English
      shuffle(U.frames.map(function (f) { return f.id; }).filter(function (x) { return x !== fid; })).forEach(function (x) { var pc = modelSentence(FR(x)).pic; if (others.length < 3 && !seenPic[pc]) { seenPic[pc] = 1; others.push(x); } });
      return { fid: fid, kind: kinds[k], opts: shuffle([fid].concat(others)) };
    });
  }
  SCREENS.s2 = function () {
    var x = V.x || {}, p = sP('s2', {});
    if (x.phase) { p.phase = x.phase; V.x = {}; }
    if (!p.phase) {
      if (S.abbina && hasPicks()) p.phase = 'menu';
      else if (S.abbina) p.phase = 'pickframes';
      else p.phase = 'abbina';
    }
    if (p.phase === 'menu') return s2menu();
    if (p.phase === 'pickframes') return s2pickframes();
    if (p.phase === 'pickends') return s2pickends();
    if (p.phase === 'pointA') return s2pointA();
    return s2abbina();
  };
  function s2menu() {
    return stageHead(2) + '<div class="brt-card ok"><b>✓ Stage 2 is done.</b></div>' +
      '<div class="brt-row"><button class="brt-b go" data-a="s2again">🔁 Play Abbina again</button><button class="brt-b ghost" data-a="gopicks2">✏️ Change my 10 sentences</button><button class="brt-b ghost" data-a="hub">Back to the list</button></div>';
  }
  ACT.s2again = function () { S.pos.s2 = { phase: 'abbina', items: buildAbbina(), i: 0 }; V.ab = null; save(); render(); autoplayItem(); };
  ACT.gopicks2 = function () { S.pos.s2.phase = 'pickframes'; save(); render(); };
  function itemNow() { var p = S.pos.s2; return p.items && p.items[p.i] ? p.items[p.i] : null; }
  function autoplayItem() { var it = itemNow(); if (it && it.kind !== 'en2it') say(modelSentence(FR(it.fid)).it); }
  function s2abbina() {
    var p = S.pos.s2;
    if (!p.items || !p.items.length || p.i >= p.items.length) { p.items = buildAbbina(); p.i = 0; V.ab = {}; }
    if (!V.ab || V.ab.i !== p.i) V.ab = { i: p.i, wrong: [], solved: false };
    var it = p.items[p.i], f = FR(it.fid), m = modelSentence(f), ab = V.ab, n = p.items.length;
    var h = stageHead(2);
    h += '<div class="brt-row"><span class="brt-note"><b>Match ' + (p.i + 1) + ' of ' + n + '</b></span></div>';
    if (it.kind === 'aud') {
      h += '<div class="brt-card vio" style="align-items:center;text-align:center"><b>Listen. Tap the picture that matches.</b><div class="brt-row" style="justify-content:center">' + sayBtns(m.it) + '</div>' +
        '<p class="brt-note">There is no Italian written here on purpose. Tap 🔊 as many times as you like.</p></div>';
    } else if (it.kind === 'it2en') {
      h += '<div class="brt-card vio"><b>Which picture matches this sentence?</b><div class="brt-sent">' + esc(m.it) + '</div><div class="brt-row">' + sayBtns(m.it) + '</div></div>';
    } else {
      h += '<div class="brt-card vio" style="align-items:center;text-align:center"><b>Which Italian sentence matches the picture?</b><div class="brt-pic">' + P(f.cue, 'p') + ' ' + P(m.pic, 'p') + '</div></div>';
    }
    h += '<div class="brt-opts">';
    it.opts.forEach(function (fid) {
      var g = FR(fid), gm = modelSentence(g), cls = 'brt-opt', bad = ab.wrong.indexOf(fid) !== -1, good = ab.solved && fid === it.fid;
      if (bad) cls += ' try'; if (good) cls += ' ok'; else if (ab.solved) cls += ' off';
      var inner;
      if (it.kind === 'en2it') inner = '<span>' + esc(gm.it) + '</span>' + (good ? '' : '');
      else inner = P(g.cue, 'p') + ' ' + P(gm.pic, 'p') + (ab.solved && good && it.kind === 'aud' ? '<span>' + esc(gm.it) + '</span>' : '');
      h += '<button class="' + cls + '" data-a="abpick" data-f="' + fid + '"' + (bad || ab.solved ? ' aria-disabled="true"' : '') + '>' + inner + '</button>';
    });
    h += '</div>';
    if (ab.wrong.length && !ab.solved) {
      var hint = m.it.replace(/[.]/g, '').split(' ').slice(0, 1)[0];
      h += '<div class="brt-card try" role="status"><b>Not that one. Listen again and try another.</b><p>Hint: the sentence begins with “' + esc(hint) + '”.</p></div>';
    }
    if (ab.solved) {
      h += '<div class="brt-card ok" role="status"><b>✓ ' + esc(m.it) + '</b></div>' +
        '<button class="brt-b go" data-a="abnext" data-focus="1">' + (p.i + 1 >= n ? 'Finish matching ▶' : 'Next ▶') + '</button>';
    }
    return h;
  }
  ACT.abpick = function (el) {
    var it = itemNow(), ab = V.ab, fid = el.getAttribute('data-f'); if (!it || ab.solved) return;
    if (fid === it.fid) {
      ab.solved = true; render(); var at = S.pos.s2.i;
      autoAdvance(modelSentence(FR(it.fid)).it, function () { if (V.screen === 's2' && S.pos.s2.phase === 'abbina' && S.pos.s2.i === at && V.ab && V.ab.solved) ACT.abnext(); });
    }
    else { ab.wrong.push(fid); render(); }
  };
  ACT.abnext = function () {
    advTok = null; var p = S.pos.s2; p.i++;
    if (p.i >= p.items.length) { S.abbina = true; p.phase = hasPicks() ? 'menu' : 'pickframes'; p.i = 0; p.items = []; save(); if (hasPicks()) { stageDone(2); } render(); return; }
    save(); render(); autoplayItem();
  };
  function s2pickframes() {
    var p = S.pos.s2, n = U.chooseCount, h = stageHead(2);
    h += '<div class="brt-card vio"><h3>Choose your ' + n + ' sentences</h3><p>Tap the ' + n + ' things you want to tell about when you were little. Pick ones that are <b>true for you</b>. Next you will choose how to finish each one.</p>' +
      '<div class="brt-row"><b>' + S.picks.length + ' of ' + n + ' chosen</b><span class="brt-grow"></span>' + enBtn() + '</div></div><div class="brt-opts">';
    U.frames.forEach(function (f) {
      var on = S.picks.indexOf(f.id) !== -1, m = modelSentence(f);
      h += '<button class="brt-opt' + (on ? ' ok' : '') + '" data-a="togglepick" data-f="' + f.id + '" aria-pressed="' + on + '"><span class="p">' + P(f.cue, 'p') + '</span><span>' + esc(f.it) + ' …</span>' +
        (S.en ? '<small>' + esc(f.en) + ' …</small>' : '') + (on ? '<small>✓ chosen</small>' : '') + '</button>';
    });
    h += '</div><div class="brt-row"><button class="brt-b ' + (S.picks.length === n ? 'go' : 'ghost') + '" data-a="picksnext"' + (S.picks.length === n ? '' : ' aria-disabled="true"') + '>Next: finish each sentence ▶</button></div>';
    return h;
  }
  ACT.togglepick = function (el) {
    var id = el.getAttribute('data-f'), i = S.picks.indexOf(id);
    if (i !== -1) { S.picks.splice(i, 1); }
    else if (S.picks.length >= U.chooseCount) { toast('You already have ' + U.chooseCount + '. Tap one to take it off.'); return; }
    else { S.picks.push(id); say(modelSentence(FR(id)).it.split(' ')[0]); }
    S.picks = U.frames.map(function (f) { return f.id; }).filter(function (x) { return S.picks.indexOf(x) !== -1; });
    save(); var y = root.scrollTop; render(); root.scrollTop = y;
  };
  ACT.picksnext = function () { if (S.picks.length !== U.chooseCount) return; S.pos.s2.phase = 'pickends'; save(); render(); };
  function s2pickends() {
    var h = stageHead(2), f0 = picked();
    var left = f0.filter(function (f) { return !S.ends[f.id]; }).length;
    h += '<div class="brt-card vio"><h3>Finish each sentence</h3><p>Tap a piece to hear it and see your whole sentence. Pick the one that is true for you, or type your own.</p>' +
      '<div class="brt-row"><b>' + (f0.length - left) + ' of ' + f0.length + ' finished</b><span class="brt-grow"></span>' + enBtn() + '</div></div>';
    f0.forEach(function (f) {
      var e = endingOf(f.id), sn = sentenceFor(f.id);
      h += '<div class="brt-card' + (e ? ' ok' : '') + '"><div class="brt-row"><b class="brt-sent">' + P(f.cue, 'p') + ' ' + esc(f.it) + ' …</b></div><div class="brt-row">';
      f.choices.forEach(function (c, ci) {
        var on = S.ends[f.id] && !S.ends[f.id].typed && S.ends[f.id].ci === ci;
        h += '<button class="brt-chip' + (on ? ' on' : '') + '" data-a="pickend" data-f="' + f.id + '" data-c="' + ci + '" aria-pressed="' + on + '">' + P(c.pic, 'p') + '<span>' + esc(T(c.it)) + (S.en ? '<small>' + esc(c.en) + '</small>' : '') + '</span></button>';
      });
      var ty = S.ends[f.id] && S.ends[f.id].typed;
      h += '<button class="brt-chip' + (ty ? ' on' : '') + '" data-a="typeown" data-f="' + f.id + '">✏️ Type your own</button></div>';
      if (V.typing === f.id) {
        h += '<div class="brt-row"><input class="brt-in brt-grow" id="brt-own" type="text" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="your own ending" value="' + esc(ty || '') + '" data-enter="ownok" data-focus="1"><button class="brt-b go" data-a="ownok" data-f="' + f.id + '">OK</button></div><p class="brt-note">Your own words are never marked wrong. Your teacher will see “typed by student”.</p>';
      }
      if (sn) h += '<div class="brt-row"><div class="brt-sent brt-grow">' + esc(sn.it) + (sn.typed ? ' <span class="brt-tag spk">typed by student</span>' : '') + '</div>' + sayBtns(sn.it) + '</div>' + (S.en && !sn.typed ? '<div class="brt-en">' + esc(sn.en) + '</div>' : '');
      h += '</div>';
    });
    h += '<div class="brt-row"><button class="brt-b ghost" data-a="backframes">◀ Change which 10</button><span class="brt-grow"></span><button class="brt-b ' + (left ? 'ghost' : 'go') + '" data-a="endsdone"' + (left ? ' aria-disabled="true"' : '') + '>' + (left ? left + ' left to finish' : 'All 10 finished ✓') + '</button></div>';
    return h;
  }
  ACT.pickend = function (el) {
    var fid = el.getAttribute('data-f'), ci = parseInt(el.getAttribute('data-c'), 10), f = FR(fid), c = f.choices[ci];
    S.ends[fid] = { ci: ci }; V.typing = null; save();
    var y = root.scrollTop; render(); root.scrollTop = y;
    Say.say(T(c.it), { done: function () { Say.say(sentenceFor(fid).it, {}); } });
  };
  ACT.typeown = function (el) { V.typing = el.getAttribute('data-f'); var y = root.scrollTop; render(); root.scrollTop = y; };
  ACT.ownok = function (el) {
    var fid = V.typing || el.getAttribute('data-f'), inp = root.querySelector('#brt-own'), t = inp ? inp.value.trim() : '';
    if (!t) { V.typing = null; render(); return; }
    S.ends[fid] = { typed: t.slice(0, 60) }; V.typing = null; save();
    var y = root.scrollTop; render(); root.scrollTop = y; say(sentenceFor(fid).it);
  };
  ACT.backframes = function () { S.pos.s2.phase = 'pickframes'; save(); render(); };
  ACT.endsdone = function () {
    if (!hasPicks()) return;
    S.pos.s2.phase = 'pointA'; save();
    if (S.abbina) stageDone(2);
    render();
  };
  function s2pointA() {
    var h = stageHead(2);
    h += '<div class="brt-card ok" role="status"><h3>✅ Stopping point A</h3><p>Your 10 sentences, your progress and your Boh Cashi are saved. It is safe to close the game here and come back later.</p></div>';
    if (!S.abbina) h += '<div class="brt-card try"><p>You have chosen your sentences. Stage 2 will show as done once you also finish the matching game (Abbina).</p></div>';
    h += '<div class="brt-row">' + (S.abbina ? '' : '<button class="brt-b go" data-a="s2again">Play Abbina</button>') +
      '<button class="brt-b ' + (S.abbina ? 'go' : 'ghost') + '" data-a="afterA">Keep going ▶</button><button class="brt-b ghost" data-a="hub">Back to the list</button></div>';
    return h;
  }
  ACT.afterA = function () { var n = V.ret; V.ret = null; if (n && n >= 3) { go('s' + n); } else go('s3'); };

  /* ================================================================ STAGE 3 · SCRIVI (Accuracy) */
  function w3() { var p = S.pos.s3; if (!p.order || p.order.length !== S.picks.length) { p.order = S.picks.slice(); p.i = 0; p.round = 1; } return p; }
  SCREENS.s3 = function () {
    var p = sP('s3', { round: 1, i: 0 }); w3();
    if (!V.w || V.w.round !== p.round || V.w.i !== p.i) V.w = { round: p.round, i: p.i, tries: 0, solved: false, text: '', note: '', peek: false };
    var w = V.w, fid = p.order[p.i], sn = sentenceFor(fid), f = FR(fid), n = p.order.length;
    var h = stageHead(3);
    h += '<div class="brt-row"><span class="brt-note"><b>Round ' + p.round + ' of 2 · sentence ' + (p.i + 1) + ' of ' + n + '</b></span><span class="brt-grow"></span>' + enBtn() + '</div>';
    if (p.round === 1) {
      h += '<div class="brt-card vio" style="align-items:center;text-align:center"><b>Type this sentence.</b><div class="brt-pic">' + P(sn.pic, 'p') + '</div><div class="brt-big">' + esc(sn.it) + '</div><div class="brt-row" style="justify-content:center">' + sayBtns(sn.it) + '</div>' + (S.en && !sn.typed ? '<div class="brt-en">' + esc(sn.en) + '</div>' : '') + '</div>';
    } else {
      h += '<div class="brt-card vio" style="align-items:center;text-align:center"><b>Listen. Type what you hear.</b><div class="brt-row" style="justify-content:center">' + sayBtns(sn.it) + '</div>' + (S.en && !sn.typed ? '<div class="brt-pic">' + P(sn.pic, 'p') + '</div><div class="brt-en">' + esc(sn.en) + '</div>' : '') + '<p class="brt-note">It is only spoken this time. The turtle 🐢 says it slowly.</p></div>';
    }
    h += '<input class="brt-in" id="brt-w" type="text" autocomplete="off" autocapitalize="off" autocorrect="off" spellcheck="false" placeholder="Type here" value="' + esc(w.text) + '" data-in="wtext" data-enter="wcheck"' + (w.solved ? ' readonly' : ' data-focus="1"') + '>';
    h += '<p class="brt-note">Missing accents, capital letters and tiny typing slips are fine.</p>';
    if (w.note && !w.solved) h += '<div class="brt-card try" role="status">' + w.note + '</div>';
    if (w.solved) {
      var spell = !w.peek && spellingNote(w.text, sn.it);
      h += '<div class="brt-card ' + (w.peek ? 'try' : 'ok') + '" role="status"><b>' + (w.peek ? 'Here it is:' : '✓ Yes!') + ' ' + esc(sn.it) + '</b>' + (spell ? '<div class="brt-en">Correct spelling: <b>' + esc(sn.it) + '</b> (a tiny slip is fine.)</div>' : '') + '</div>' +
        '<button class="brt-b go" data-a="wnext" data-focus="1">' + (p.i + 1 >= n && p.round === 2 ? 'Finish Scrivi ▶' : (p.i + 1 >= n ? 'On to round 2 ▶' : 'Next ▶')) + '</button>';
    } else {
      h += '<div class="brt-row"><button class="brt-b go" data-a="wcheck">Check ✓</button>' + (w.tries >= 2 ? '<button class="brt-b ghost" data-a="wshow">Show me</button>' : '') + '</div>';
    }
    return h;
  };
  ACT.wtext = function (el) { if (V.w) V.w.text = el.value; };
  ACT.wcheck = function () {
    var p = S.pos.s3, w = V.w, fid = p.order[p.i], sn = sentenceFor(fid); if (!w || w.solved) return;
    var inp = root.querySelector('#brt-w'); if (inp) w.text = inp.value;
    if (sn.typed) { if (!w.text.trim()) { w.note = 'Type your sentence, then press Check.'; render(); return; } w.solved = true; render(); say(sn.it); return; }
    var j = judge(w.text, sn.it);
    if (j.ok) { w.solved = true; render(); say(sn.it); return; }
    w.tries++;
    var words = sn.it.replace(/[.?!]/g, '').split(' ');
    if (j.empty) w.note = 'Type the sentence, then press Check.';
    else if (j.count) w.note = '<b>Not quite.</b> The sentence has ' + words.length + ' words. Count yours and try again.';
    else if (j.endBad) w.note = '<b>So close!</b> Check the <b>last letter</b> of word ' + (j.bad + 1) + '. The ending is the part that matters.';
    else if (p.round === 1) w.note = '<b>Not quite.</b> Look again at word ' + (j.bad + 1) + ' and try once more.';
    else w.note = '<b>Not quite.</b> Listen again (the turtle 🐢 is slow). Word ' + (j.bad + 1) + ' begins with “' + esc(words[j.bad].slice(0, 2)) + '”.';
    render(); var i2 = root.querySelector('#brt-w'); if (i2) { try { i2.focus(); i2.setSelectionRange(i2.value.length, i2.value.length); } catch (e) {} }
  };
  ACT.wshow = function () { var p = S.pos.s3, w = V.w, sn = sentenceFor(p.order[p.i]); w.solved = true; w.peek = true; render(); say(sn.it); };
  ACT.wnext = function () {
    var p = S.pos.s3; p.i++;
    if (p.i >= p.order.length) {
      if (p.round === 1) { p.round = 2; p.i = 0; p.order = shuffle(p.order); save(); V.w = null; render(); say(sentenceFor(p.order[0]).it); return; }
      stageDone(3); S.pos.s3 = { round: 1, i: 0, order: S.picks.slice() }; V.w = null; save(); go('hub'); return;
    }
    save(); V.w = null; render(); if (p.round === 2) say(sentenceFor(p.order[p.i]).it);
  };

  /* ================================================================ STAGE 4 · REGISTRA 1 */
  function mySentencesList(withPic) {
    var h = '<div class="brt-list">';
    picked().forEach(function (f, i) {
      var sn = sentenceFor(f.id); if (!sn) return;
      h += '<div class="brt-li">' + (withPic ? P(sn.pic, 'p') : '') + '<div class="tx"><div class="brt-sent">' + (i + 1) + '. ' + esc(sn.it) + '</div>' + (S.en && !sn.typed ? '<div class="brt-en">' + esc(sn.en) + '</div>' : '') + '</div>' + sayBtns(sn.it) + '</div>';
    });
    return h + '</div>';
  }
  SCREENS.s4 = function () {
    var h = stageHead(4);
    h += '<div class="brt-card vio"><h3>Read your 10 sentences out loud</h3><p>Speak at a normal speed. You do not have to be perfect: <b>just be understood</b>. Tap 🔊 first if you want to hear one.</p></div>' + mySentencesList(true);
    h += '<div class="brt-row">' + enBtn() + '</div>' + vocarooBox('r1', 'Registra 1');
    h += '<button class="brt-b ' + (recOk('r1') ? 'go' : 'ghost') + '" data-a="s4done" data-needrec="r1"' + (recOk('r1') ? '' : ' aria-disabled="true"') + '>I recorded it ✓</button>';
    return h;
  };
  ACT.s4done = function () {
    if (!recOk('r1')) return;
    var first = !S.done[4]; stageDone(4);
    if (first && !S.breakOffered) { S.breakOffered = true; save(); go('breakoffer'); } else go('hub');
  };
  SCREENS.breakoffer = function () {
    return head('Pausa! 🎮', U.title, '', true) +
      '<div class="brt-card vio" style="align-items:center;text-align:center"><div class="brt-pic">🎮</div><h3>You are halfway. Take a short break.</h3>' +
      '<p>A little memory game with the pieces you have been learning. No timer, no score, no Boh Cashi. Stop whenever you want.</p>' +
      '<div class="brt-row" style="justify-content:center"><button class="brt-b go" data-a="pausa">Play</button><button class="brt-b ghost" data-a="hub">Skip, back to the list</button></div></div>';
  };

  /* ================================================================ STAGE 5 · DIALOGO (pair or three, game taps, nothing is synced) */
  function seatsN() { return S.dlg.mode === 'trio' ? 3 : 2; }
  function seatName(i) { return ['A', 'B', 'C'][i]; }
  function role() {
    var d = S.dlg;
    if (d.mode === 'pair') return d.seat === d.round % 2 ? 'ask' : 'answer';
    return d.seat === d.round ? 'ask' : (d.seat === (d.round + 1) % 3 ? 'answer' : 'listen');
  }
  function otherSeats() {
    var d = S.dlg, r = d.round, out = {};
    if (d.mode === 'pair') { out.asker = r % 2; out.answerer = 1 - r % 2; }
    else { out.asker = r; out.answerer = (r + 1) % 3; out.listener = (r + 2) % 3; }
    return out;
  }
  SCREENS.s5 = function () {
    var d = S.dlg;
    if (!d.mode || d.seat < 0 || V.d0) return s5setup();
    if (V.dstage === 'rec') return s5rec();
    var rl = role(), os = otherSeats(), h = stageHead(5);
    var banner = rl === 'ask' ? '🎤 You ASK' : (rl === 'answer' ? '💬 You ANSWER' : '👂 You LISTEN');
    h += '<div class="brt-card vio"><div class="brt-row"><h3>Round ' + (d.round + 1) + ' of 3 · ' + banner + '</h3><span class="brt-grow"></span>' + enBtn() + '</div>' +
      '<p class="brt-note">You are Partner ' + seatName(d.seat) + '. This round: Partner ' + seatName(os.asker) + ' asks' + (d.mode === 'pair' ? ', Partner ' + seatName(os.answerer) + ' answers.' : ', Partner ' + seatName(os.answerer) + ' answers, Partner ' + seatName(os.listener) + ' listens.') + '</p>' +
      '<p class="brt-note">Speak only to your partner. The game never records or scores your talking.</p></div>';
    h += rl === 'ask' ? dAsk() : (rl === 'answer' ? dAnswer() : dListen());
    h += '<div class="brt-row"><button class="brt-b ghost" data-a="dsetup">Change partner setup</button><span class="brt-grow"></span>' +
      (d.round < 2 ? '<button class="brt-b go" data-a="dswitch">' + (d.mode === 'pair' ? 'Switch roles ⇄' : 'Next round ▶') + '</button>'
                   : '<button class="brt-b go" data-a="dfinish">That was round 3: finish ▶</button>') + '</div>';
    return h;
  };
  function s5setup() {
    var d = S.dlg, h = stageHead(5);
    h += '<div class="brt-card vio"><h3>How does this work?</h3><ol class="brt-steps"><li>You sit with one partner (or two). Each of you uses your own Chromebook.</li><li>One person <b>asks</b>, one person <b>answers out loud</b>. The asker taps what they heard.</li><li>You play <b>3 rounds</b> and switch roles each time, so everyone asks and answers.</li><li>At the end you record one round on Vocaroo.</li></ol></div>';
    h += '<div class="brt-card"><b>Are you two or three?</b><div class="brt-row"><button class="brt-chip' + (d.mode === 'pair' ? ' on' : '') + '" data-a="dmode" data-m="pair">We are two</button><button class="brt-chip' + (d.mode === 'trio' ? ' on' : '') + '" data-a="dmode" data-m="trio">We are three</button></div></div>';
    if (d.mode) {
      h += '<div class="brt-card"><b>Which partner are you?</b><p class="brt-note">Agree out loud: one person is A, one is B' + (d.mode === 'trio' ? ', one is C' : '') + '.</p><div class="brt-row">';
      for (var i = 0; i < seatsN(); i++) h += '<button class="brt-chip' + (d.seat === i ? ' on' : '') + '" data-a="dseat" data-s="' + i + '">Partner ' + seatName(i) + '</button>';
      h += '</div></div>';
    }
    var ok = d.mode && d.seat >= 0;
    h += '<button class="brt-b ' + (ok ? 'go' : 'ghost') + '" data-a="dgo"' + (ok ? '' : ' aria-disabled="true"') + '>Start round ' + (d.round + 1) + ' ▶</button>';
    return h;
  }
  ACT.dmode = function (el) { S.dlg.mode = el.getAttribute('data-m'); if (S.dlg.seat >= seatsN()) S.dlg.seat = -1; V.d0 = true; save(); render(); };
  ACT.dseat = function (el) { S.dlg.seat = parseInt(el.getAttribute('data-s'), 10); V.d0 = true; save(); render(); };
  ACT.dgo = function () { if (!S.dlg.mode || S.dlg.seat < 0) return; V.d0 = false; V.d = { step: 'pick' }; save(); render(); };
  ACT.dsetup = function () { V.d0 = true; render(); };
  ACT.dswitch = function () { var d = S.dlg; d.rounds[d.round] = true; d.round = Math.min(2, d.round + 1); V.d = { step: 'pick' }; save(); render(); toast(d.mode === 'pair' ? 'Roles switched!' : 'Next round!'); };
  ACT.dfinish = function () { var d = S.dlg; d.rounds[2] = true; V.dstage = 'rec'; save(); render(); };
  function dState() { if (!V.d) V.d = { step: 'pick' }; return V.d; }
  /* the asker */
  function dAsk() {
    var d = dState(), h = '';
    if (d.step === 'pick') {
      h += '<div class="brt-card"><h3>1. Ask a question</h3><p>Tap one, hear it, then <b>say it to your partner</b>. Then listen to the answer.</p></div><div class="brt-list">';
      U.frames.forEach(function (f) {
        var q = T(f.q);
        h += '<div class="brt-li"><button class="brt-b ghost brt-grow" style="justify-content:flex-start;text-align:left" data-a="dq" data-f="' + f.id + '">' + P(f.cue, 'p') + ' <span class="brt-sent">' + esc(q) + '</span></button>' + sayBtns(q) + '</div>' +
          (S.en ? '<div class="brt-en" style="margin:-4px 0 0 14px">' + esc(f.qEn) + '</div>' : '');
      });
      h += '</div>';
    } else if (d.step === 'heard') {
      var f = FR(d.fid);
      h += '<div class="brt-card vio"><h3>2. What did your partner say?</h3><p>You asked: <b>' + esc(d.yn >= 0 ? ynQ(f, f.choices[d.yn]).it : T(f.q)) + '</b></p><p class="brt-note">Tap the one you <b>heard</b>.</p></div>' + heardOptions(f, d);
    } else {
      h += reactBlock(d);
    }
    if (d.step === 'pick') {
      h += '<div class="brt-card"><b>Or ask a yes/no question</b><p class="brt-note">Pick a topic, then the piece you want to ask about.</p><div class="brt-row">';
      U.frames.forEach(function (f) { if (f.choices.some(function (c) { return ynOk(f, c); })) h += '<button class="brt-chip' + (d.ynf === f.id ? ' on' : '') + '" data-a="dynf" data-f="' + f.id + '">' + P(f.cue, 'p') + ' ' + esc(T(f.tu)) + ' …?</button>'; });
      h += '</div>';
      if (d.ynf) {
        var g = FR(d.ynf); h += '<div class="brt-row">';
        g.choices.forEach(function (c, ci) { if (ynOk(g, c)) h += '<button class="brt-chip" data-a="dyn" data-f="' + g.id + '" data-c="' + ci + '">' + P(c.pic, 'p') + ' ' + esc(ynQ(g, c).it) + '</button>'; });
        h += '</div>';
      }
      h += '</div>';
    }
    return h;
  }
  ACT.dq = function (el) { var d = dState(), f = FR(el.getAttribute('data-f')); d.fid = f.id; d.yn = -1; d.step = 'heard'; render(); say(T(f.q)); };
  ACT.dynf = function (el) { var d = dState(); d.ynf = el.getAttribute('data-f'); var y = root.scrollTop; render(); root.scrollTop = y; };
  ACT.dyn = function (el) { var d = dState(), f = FR(el.getAttribute('data-f')), ci = parseInt(el.getAttribute('data-c'), 10); d.fid = f.id; d.yn = ci; d.step = 'heard'; render(); say(ynQ(f, f.choices[ci]).it); };
  function heardOptions(f, d) {
    var opts = [], h = '<div class="brt-list">';
    if (d.yn >= 0) {
      var c = f.choices[d.yn], yes = ynAns(f, c, true), no = ynAns(f, c, false);
      opts.push({ kind: 'yes', it: yes.it, en: yes.en, base: f.it + ' ' + T(c.it) + '.', pic: c.pic });
      opts.push({ kind: 'no', it: no.it, en: no.en, pic: '🙅' });
    } else {
      f.choices.forEach(function (c) { opts.push({ kind: 'ci', it: T(f.it + ' ' + c.it) + '.', en: pastEn(f) + ' ' + c.en + '.', base: T(f.it + ' ' + c.it) + '.', pic: c.pic }); });
      opts.push({ kind: 'no', it: 'No, non … (they said no)', en: 'They said no.', pic: '🙅', silent: true });
    }
    opts.push({ kind: 'other', it: 'Something else (I did not catch it)', en: '', pic: '❓', silent: true });
    d.opts = opts;
    opts.forEach(function (o, i) {
      h += '<div class="brt-li"><button class="brt-b ghost brt-grow" style="justify-content:flex-start;text-align:left" data-a="dheard" data-i="' + i + '">' + P(o.pic, 'p') + ' <span class="brt-sent">' + esc(o.it) + '</span></button></div>' + (S.en && o.en ? '<div class="brt-en" style="margin:-4px 0 0 14px">' + esc(o.en) + '</div>' : '');
    });
    return h + '</div>';
  }
  ACT.dheard = function (el) {
    var d = dState(), o = d.opts[parseInt(el.getAttribute('data-i'), 10)]; if (!o) return;
    d.heard = o; d.step = 'react'; render();
    if (!o.silent) say(o.it);
  };
  function reactBlock(d) {
    var o = d.heard, h = '<div class="brt-card ok"><h3>3. React</h3><p>You heard: <b>' + esc(o.silent ? o.it.replace(/ \(.*\)/, '') : o.it) + '</b></p>' +
      '<p class="brt-note">Now check with your partner, out loud: they can say “Sì!” or say it again. Then react.</p></div><div class="brt-row">';
    U.reactions.forEach(function (r, i) {
      h += '<button class="brt-chip' + (d.react === i ? ' ok' : '') + '" data-a="dreact" data-i="' + i + '">' + P(r.pic, 'p') + '<span>' + esc(r.it) + (S.en ? '<small>' + esc(r.en) + '</small>' : '') + '</span></button>';
    });
    h += '</div>';
    if (d.react >= 0 && d.react != null) h += '<p class="brt-note">✓ ' + (U.reactions[d.react].common && o.base ? 'Added to “things we have in common”.' : 'Nice.') + '</p>';
    h += '<div class="brt-row"><button class="brt-b go" data-a="dnext">Ask another question ▶</button></div>';
    return h;
  }
  ACT.dreact = function (el) {
    var d = dState(), i = parseInt(el.getAttribute('data-i'), 10), r = U.reactions[i]; if (!r) return;
    d.react = i; say(r.it);
    if (r.common && d.heard && d.heard.base) {
      var t = d.heard.base; if (S.dlg.commons.indexOf(t) === -1) S.dlg.commons.push(t);
    }
    S.dlg.asked = (S.dlg.asked || 0) + 1; save(); var y = root.scrollTop; render(); root.scrollTop = y;
  };
  ACT.dnext = function () { V.d = { step: 'pick' }; render(); };
  /* the answerer */
  function dAnswer() {
    var d = dState(), h = '<div class="brt-card vio"><h3>Your partner will ask you a question</h3><p>Listen, then <b>answer out loud</b> with one of your sentences. For a yes/no question, begin with “Sì,” or “No, non”.</p></div>';
    h += '<div class="brt-card"><b>Your sentences</b>' + mySentencesList(true) + '</div>';
    h += '<div class="brt-card"><b>Not sure what they asked? Tap here for help.</b><p class="brt-note">Pick the question you heard. This is only help: nothing here is a test.</p><div class="brt-row">';
    U.frames.forEach(function (f) { h += '<button class="brt-chip' + (d.hf === f.id ? ' on' : '') + '" data-a="dhelp" data-f="' + f.id + '">' + P(f.cue, 'p') + '<span>' + esc(T(f.q)) + '</span></button>'; });
    h += '</div>';
    if (d.hf) {
      var f = FR(d.hf), sn = S.picks.indexOf(f.id) !== -1 ? sentenceFor(f.id) : null;
      h += '<div class="brt-card vio"><div class="brt-row"><b class="brt-grow">' + esc(T(f.q)) + '</b>' + sayBtns(T(f.q)) + '</div>' +
        (sn ? '<div class="brt-row"><div class="brt-sent brt-grow">Your answer: ' + esc(sn.it) + '</div>' + sayBtns(sn.it) + '</div>' : '<p class="brt-note">You did not choose this one. You can say “No, non …” (below) or use the piece they ask about.</p>') +
        '<b>Yes/no question? Tap the piece you heard:</b><div class="brt-row">';
      f.choices.forEach(function (c, ci) { if (ynOk(f, c)) h += '<button class="brt-chip' + (d.hc === ci ? ' on' : '') + '" data-a="dhelpc" data-c="' + ci + '">' + P(c.pic, 'p') + ' ' + esc(T(c.tu || c.it)) + '</button>'; });
      h += '</div>';
      if (d.hc != null && f.choices[d.hc] && ynOk(f, f.choices[d.hc])) {
        var c = f.choices[d.hc], yes = ynAns(f, c, true), no = ynAns(f, c, false);
        h += '<div class="brt-row"><div class="brt-sent brt-grow">' + esc(yes.it) + '</div>' + sayBtns(yes.it) + '</div><div class="brt-row"><div class="brt-sent brt-grow">' + esc(no.it) + '</div>' + sayBtns(no.it) + '</div>' +
          (S.en ? '<div class="brt-en">' + esc(yes.en) + ' · ' + esc(no.en) + '</div>' : '');
      }
      h += '</div>';
    }
    return h + '</div>';
  }
  ACT.dhelp = function (el) { var d = dState(); d.hf = el.getAttribute('data-f'); d.hc = null; var y = root.scrollTop; render(); root.scrollTop = y; say(T(FR(d.hf).q)); };
  ACT.dhelpc = function (el) { var d = dState(); d.hc = parseInt(el.getAttribute('data-c'), 10); var y = root.scrollTop; render(); root.scrollTop = y; };
  /* the listener (a group of three) */
  function dListen() {
    var d = dState(), h = '<div class="brt-card vio"><h3>Listen to the other two</h3><p>When you hear something you also did, add it to your list: tap the topic, tap what you heard, then tap <b>Anch’io!</b></p></div>';
    if (d.step === 'pick') {
      h += '<div class="brt-row">';
      U.frames.forEach(function (f) { h += '<button class="brt-chip" data-a="dlisten" data-f="' + f.id + '">' + P(f.cue, 'p') + '<span>' + esc(f.it) + ' …</span></button>'; });
      h += '</div>';
    } else if (d.step === 'heard') {
      h += '<div class="brt-card vio"><h3>What did you hear?</h3></div>' + heardOptions(FR(d.fid), d);
    } else h += reactBlock(d);
    return h;
  }
  ACT.dlisten = function (el) { var d = dState(); d.fid = el.getAttribute('data-f'); d.yn = -1; d.step = 'heard'; render(); };
  /* after round 3: record one round */
  function s5rec() {
    var h = stageHead(5);
    h += '<div class="brt-card ok"><h3>🎉 Three rounds done</h3><p>Now record <b>one round</b> of your talking on Vocaroo. Pick the round you liked best and do it once more for the recording.</p></div>' + vocarooBox('dialogo', 'Dialogo');
    h += '<div class="brt-card"><h3>Finished early? Keep talking.</h3><p class="brt-note">Three more questions to ask each other. Use only what you already know.</p><div class="brt-list">';
    U.keepTalking.forEach(function (k) {
      var pr = k.split(':'), f = FR(pr[0]), c = f && f.choices[parseInt(pr[1], 10)]; if (!f || !c) return;
      var q = ynQ(f, c), yes = ynAns(f, c, true), no = ynAns(f, c, false);
      h += '<div class="brt-li"><div class="tx"><div class="brt-sent">' + P(c.pic, 'p') + ' ' + esc(q.it) + '</div><div class="brt-en">' + esc(yes.it) + ' / ' + esc(no.it) + '</div>' + (S.en ? '<div class="brt-en">' + esc(q.en) + '</div>' : '') + '</div>' + sayBtns(q.it) + '</div>';
    });
    h += '</div></div>';
    h += '<div class="brt-row">' + enBtn() + '<span class="brt-grow"></span><button class="brt-b ' + (recOk('dialogo') ? 'go' : 'ghost') + '" data-a="s5done" data-needrec="dialogo"' + (recOk('dialogo') ? '' : ' aria-disabled="true"') + '>I recorded it ✓</button></div>' +
      '<div class="brt-row"><button class="brt-b ghost" data-a="dback">◀ Back to the rounds</button></div>';
    return h;
  }
  ACT.dback = function () { V.dstage = ''; render(); };
  ACT.s5done = function () { if (!recOk('dialogo')) return; V.dstage = ''; stageDone(5); go('pointB'); };
  function commonsHtml() {
    var c = S.dlg.commons || [];
    var h = '<div class="brt-card vio"><h3>🤝 Things you and your partner have in common</h3>';
    if (!c.length) h += '<p class="brt-note">Nothing here yet. Next time, tap <b>Anch’io!</b> when you hear something you also did.</p>';
    else { h += '<div class="brt-list">'; c.forEach(function (t) { h += '<div class="brt-li"><span class="brt-pic" style="font-size:26px">🤝</span><div class="tx brt-sent">' + esc(t) + '</div>' + sayBtns(t) + '</div>'; }); h += '</div>'; }
    return h + '</div>';
  }
  SCREENS.pointB = function () {
    return stageHead(5) + commonsHtml() +
      '<div class="brt-card ok" role="status"><h3>✅ Stopping point B</h3><p>Your progress, your recording link and your Boh Cashi are saved. It is safe to close the game here and come back later.</p></div>' +
      '<div class="brt-row"><button class="brt-b go" data-a="s6go">Keep going: Stage 6 ▶</button><button class="brt-b ghost" data-a="hub">Back to the list</button></div>';
  };
  ACT.s6go = function () { go('s6'); };

  /* ================================================================ STAGE 6 · ASCOLTA E RIPETI + REGISTRA 2 */
  var run6 = null, pauseTm = null;
  function pauseMs(sn) { return Math.max(3200, sn.it.split(' ').length * 1100); }
  function runPause(ms, then) {
    var bar = root && root.querySelector('#brt-pb i');
    if (bar) { bar.style.transition = 'none'; bar.style.width = '0'; void bar.offsetWidth; bar.style.transition = 'width ' + ms + 'ms linear'; bar.style.width = '100%'; }
    clearTimeout(pauseTm); pauseTm = setTimeout(function () { if (then) then(); }, ms);
  }
  SCREENS.s6 = function () {
    var p = sP('s6', { i: 0, phase: 'rep' }), pk = picked(), n = pk.length, h = stageHead(6);
    if (p.phase === 'rec') {
      h += '<div class="brt-card ok"><h3>👏 You heard and repeated all ' + n + '.</h3><p>Now record your 10 sentences again. They should feel a little easier this time.</p></div>' + mySentencesList(true) + vocarooBox('r2', 'Registra 2');
      h += '<div class="brt-row"><button class="brt-b ghost" data-a="s6back">◀ Hear them again</button><span class="brt-grow"></span><button class="brt-b ' + (recOk('r2') ? 'go' : 'ghost') + '" data-a="s6done" data-needrec="r2"' + (recOk('r2') ? '' : ' aria-disabled="true"') + '>I recorded it ✓</button></div>';
      return h;
    }
    var sn = sentenceFor(pk[p.i].id);
    h += '<div class="brt-card vio"><b>The computer says a sentence. You repeat it out loud in the pause.</b><p class="brt-note">Say it right away, quietly, even if you are not sure. Just be understood.</p></div>' +
      '<div class="brt-row"><span class="brt-note"><b>Sentence ' + (p.i + 1) + ' of ' + n + '</b></span><span class="brt-grow"></span>' + enBtn() + '</div>' +
      '<div class="brt-card vio" style="align-items:center;text-align:center"><div class="brt-pic">' + P(sn.pic, 'p') + '</div><div class="brt-big">' + esc(sn.it) + '</div>' + (S.en && !sn.typed ? '<div class="brt-en">' + esc(sn.en) + '</div>' : '') +
      '<div class="brt-row" style="justify-content:center"><button class="brt-b go" data-a="s6hear">▶ Hear it, then say it</button><button class="brt-b ghost" data-a="s6slow">🐢 Slow</button></div>' +
      '<div class="brt-pause" id="brt-pb" aria-hidden="true"><i></i></div><div class="brt-note" id="brt-turn" aria-live="polite">&nbsp;</div></div>' +
      '<div class="brt-row">' + (p.i > 0 ? '<button class="brt-b ghost" data-a="s6prev">◀ Back</button>' : '') + '<button class="brt-b vio" data-a="s6all">▶▶ Play all, hands free</button><button class="brt-b ghost" data-a="s6stop">■ Stop</button><span class="brt-grow"></span>' +
      (p.i + 1 >= n ? '<button class="brt-b go" data-a="s6torec">Now record again ▶</button>' : '<button class="brt-b go" data-a="s6next">Next ▶</button>') + '</div>';
    return h;
  };
  function s6sentence() { var p = S.pos.s6, pk = picked(); return sentenceFor(pk[p.i].id); }
  function s6say(slow) {
    var sn = s6sentence(), turn = root.querySelector('#brt-turn'); if (turn) turn.textContent = '🔊 Listen…';
    Say.say(sn.it, { slow: slow, done: function () { if (!root || V.screen !== 's6') return; if (turn) turn.innerHTML = '🎤 <b>Your turn: say it!</b>'; runPause(pauseMs(sn) * (slow ? 1.3 : 1)); } });
  }
  ACT.s6hear = function () { stopRun6(); s6say(false); };
  ACT.s6slow = function () { stopRun6(); s6say(true); };
  function stopRun6() { if (run6) { run6.stopped = true; run6 = null; } clearTimeout(pauseTm); Say.stop(); }
  ACT.s6stop = function () { stopRun6(); var t = root.querySelector('#brt-turn'); if (t) t.innerHTML = '&nbsp;'; };
  ACT.s6next = function () { stopRun6(); var p = S.pos.s6; p.i = Math.min(picked().length - 1, p.i + 1); save(); render(); };
  ACT.s6prev = function () { stopRun6(); var p = S.pos.s6; p.i = Math.max(0, p.i - 1); save(); render(); };
  ACT.s6torec = function () { stopRun6(); S.pos.s6.phase = 'rec'; save(); render(); };
  ACT.s6back = function () { S.pos.s6.phase = 'rep'; S.pos.s6.i = 0; save(); render(); };
  ACT.s6all = function () {
    stopRun6();
    var r = { stopped: false }; run6 = r;
    (function step() {
      if (r.stopped || V.screen !== 's6') return;
      var p = S.pos.s6, pk = picked(), sn = sentenceFor(pk[p.i].id), turn = root.querySelector('#brt-turn');
      if (turn) turn.textContent = '🔊 Listen…';
      Say.say(sn.it, { done: function () {
        if (r.stopped || V.screen !== 's6') return;
        if (turn) turn.innerHTML = '🎤 <b>Your turn: say it!</b>';
        runPause(pauseMs(sn), function () {
          if (r.stopped || V.screen !== 's6') return;
          if (p.i + 1 >= pk.length) { run6 = null; p.phase = 'rec'; save(); render(); return; }
          p.i++; save(); render(); step();
        });
      } });
    })();
  };
  ACT.s6done = function () { if (!recOk('r2')) return; stageDone(6); go('hub'); };

  /* ================================================================ STAGE 7 · COSTRUISCI */
  function ladPicks() { S.lad.pick = S.lad.pick.filter(function (id) { return S.picks.indexOf(id) !== -1; }); return S.lad.pick; }
  SCREENS.s7 = function () {
    var p = sP('s7', { phase: 'pick5' }); ladPicks();
    if (p.phase === 'pick5' && S.lad.pick.length === U.ladderCount && S.lad.started) p.phase = 'ladder';
    if (p.phase === 'ladder') return s7ladder();
    if (p.phase === 'hear') return s7hear();
    if (p.phase === 'recall') return s7recall();
    var h = stageHead(7), k = U.ladderCount;
    h += '<div class="brt-card vio"><h3>Pick ' + k + ' sentences to build up</h3><p>You will make each one longer, one small step at a time. You can stop at any step. Pick the ones you like best.</p><div class="brt-row"><b>' + S.lad.pick.length + ' of ' + k + ' chosen</b><span class="brt-grow"></span>' + enBtn() + '</div></div><div class="brt-list">';
    picked().forEach(function (f) {
      var on = S.lad.pick.indexOf(f.id) !== -1, sn = sentenceFor(f.id);
      h += '<button class="brt-li" style="text-align:left;' + (on ? 'border-color:var(--ok);background:var(--okbg)' : '') + '" data-a="ladpick" data-f="' + f.id + '" aria-pressed="' + on + '">' + P(sn.pic, 'p') + '<div class="tx"><div class="brt-sent">' + esc(sn.it) + '</div></div><span>' + (on ? '✓' : '') + '</span></button>';
    });
    h += '</div><button class="brt-b ' + (S.lad.pick.length === k ? 'go' : 'ghost') + '" data-a="ladgo"' + (S.lad.pick.length === k ? '' : ' aria-disabled="true"') + '>Start building ▶</button>';
    return h;
  };
  ACT.ladpick = function (el) {
    var id = el.getAttribute('data-f'), i = S.lad.pick.indexOf(id);
    if (i !== -1) S.lad.pick.splice(i, 1); else if (S.lad.pick.length >= U.ladderCount) { toast('You already have ' + U.ladderCount + '. Tap one to take it off.'); return; } else S.lad.pick.push(id);
    save(); var y = root.scrollTop; render(); root.scrollTop = y;
  };
  ACT.ladgo = function () { if (S.lad.pick.length !== U.ladderCount) return; S.lad.started = true; S.pos.s7.phase = 'ladder'; save(); render(); };
  function s7ladder() {
    var h = stageHead(7);
    h += '<div class="brt-card vio"><h3>Make each sentence longer</h3><p>Tap a piece to add it. Every tap speaks your new sentence. Stop at any level you like.</p><div class="brt-row">' + enBtn() + '</div></div>';
    ladPicks().forEach(function (fid) {
      var f = FR(fid), L = S.lad.L[fid] || { op: -1, det: '', now: -1 }, cs = compose(fid, L), e = endingOf(fid);
      h += '<div class="brt-card"><div class="brt-row"><span class="brt-tag spk">Level ' + cs.level + '</span><span class="brt-grow"></span></div>' +
        '<div class="brt-row"><div class="brt-sent brt-grow">' + P(cs.pic, 'p') + ' ' + esc(cs.it) + '</div>' + sayBtns(cs.it) + '</div>' + (S.en && !cs.typed ? '<div class="brt-en">' + esc(cs.en) + '</div>' : '');
      h += '<div class="brt-note"><b>Level 2:</b> add an opener</div><div class="brt-row">' +
        U.openers.map(function (op, oi) { return '<button class="brt-chip' + (L.op === oi ? ' on' : '') + '" data-a="ladset" data-f="' + fid + '" data-k="op" data-v="' + oi + '" aria-pressed="' + (L.op === oi) + '">' + esc(T(op.it)) + (S.en ? '<small>' + esc(op.en) + '</small>' : '') + '</button>'; }).join('') +
        '<button class="brt-chip" data-a="ladset" data-f="' + fid + '" data-k="op" data-v="-1">none</button></div>';
      h += '<div class="brt-note"><b>Level 3:</b> add one detail</div><div class="brt-row">' +
        f.det.map(function (dk) { var d = U.details[dk]; return '<button class="brt-chip' + (L.det === dk ? ' on' : '') + '" data-a="ladset" data-f="' + fid + '" data-k="det" data-v="' + dk + '" aria-pressed="' + (L.det === dk) + '">' + esc(d.it) + (S.en ? '<small>' + esc(d.en) + '</small>' : '') + '</button>'; }).join('') +
        '<button class="brt-chip" data-a="ladset" data-f="' + fid + '" data-k="det" data-v="">none</button></div>';
      h += '<div class="brt-note"><b>Level 4:</b> then and now. Say what is true <b>now</b>: “, adesso ' + esc(f.now) + ' …”</div><div class="brt-row">' +
        f.choices.map(function (c, ci) { return '<button class="brt-chip' + (L.now === ci ? ' on' : '') + '" data-a="ladset" data-f="' + fid + '" data-k="now" data-v="' + ci + '" aria-pressed="' + (L.now === ci) + '">' + P(c.pic, 'p') + '<span>' + esc(f.now + ' ' + T(c.it)) + (S.en ? '<small>' + esc(f.nowEn + ' ' + c.en) + '</small>' : '') + '</span></button>'; }).join('') +
        '<button class="brt-chip" data-a="ladset" data-f="' + fid + '" data-k="now" data-v="-1">none</button></div></div>';
    });
    h += '<div class="brt-row"><button class="brt-b ghost" data-a="ladback">◀ Change which ' + U.ladderCount + '</button><span class="brt-grow"></span><button class="brt-b go" data-a="ladhear">Done building: hear them all ▶</button></div>';
    return h;
  }
  ACT.ladset = function (el) {
    var fid = el.getAttribute('data-f'), k = el.getAttribute('data-k'), v = el.getAttribute('data-v'), L = S.lad.L[fid] || (S.lad.L[fid] = { op: -1, det: '', now: -1 });
    if (k === 'det') L.det = v; else L[k] = parseInt(v, 10);
    if (k === 'now' && L.now >= 0) pay('level4');
    save(); var y = root.scrollTop; render(); root.scrollTop = y;
    var cs = compose(fid, L); if (cs) say(cs.it);
  };
  ACT.ladback = function () { S.lad.started = false; S.pos.s7.phase = 'pick5'; save(); render(); };
  ACT.ladhear = function () { S.pos.s7.phase = 'hear'; save(); render(); };
  function s7hear() {
    var h = stageHead(7), picks = ladPicks();
    h += '<div class="brt-card vio"><h3>Hear your ' + picks.length + ' sentences at the highest level</h3><p>Listen to how far you got. Then say them from memory.</p><div class="brt-row"><button class="brt-b go" data-a="hearall">▶ Play all ' + picks.length + '</button><button class="brt-b ghost" data-a="s6stop">■ Stop</button>' + enBtn() + '</div></div><div class="brt-list">';
    picks.forEach(function (fid, i) {
      var cs = highest(fid);
      h += '<div class="brt-li" id="brt-hl-' + i + '">' + P(cs.pic, 'p') + '<div class="tx"><span class="brt-tag spk">Level ' + cs.level + '</span><div class="brt-sent">' + esc(cs.it) + '</div>' + (S.en && !cs.typed ? '<div class="brt-en">' + esc(cs.en) + '</div>' : '') + '</div>' + sayBtns(cs.it) + '</div>';
    });
    h += '</div><div class="brt-row"><button class="brt-b ghost" data-a="ladgo2">◀ Keep building</button><span class="brt-grow"></span><button class="brt-b go" data-a="torecall">Say them from memory ▶</button></div>';
    return h;
  }
  ACT.ladgo2 = function () { S.pos.s7.phase = 'ladder'; save(); render(); };
  ACT.hearall = function () {
    stopRun6();
    var picks = ladPicks(), r = { stopped: false }, i = 0; run6 = r;
    (function next() {
      if (r.stopped || V.screen !== 's7') return;
      Array.prototype.forEach.call(root.querySelectorAll('.brt-li'), function (e) { e.style.outline = ''; });
      if (i >= picks.length) { run6 = null; return; }
      var el = root.querySelector('#brt-hl-' + i); if (el) el.style.outline = '3px solid var(--vio)';
      var cs = highest(picks[i++]); Say.say(cs.it, { done: function () { setTimeout(next, 450); } });
    })();
  };
  ACT.torecall = function () {
    stopRun6();
    S.pos.s7.phase = 'recall'; S.pos.s7.order = shuffle(picked().map(function (f) { return f.id; })); S.pos.s7.ri = 0; S.pos.s7.shown = false; save(); render();
  };
  function s7recall() {
    var p = S.pos.s7, order = p.order || [], fid = order[p.ri], h = stageHead(7);
    if (!fid) { p.phase = 'hear'; return s7hear(); }
    var f = FR(fid), cs = S.lad.pick.indexOf(fid) !== -1 ? highest(fid) : sentenceFor(fid);
    h += '<div class="brt-card vio"><h3>Say it from memory</h3><p>Look at the picture. Say the whole sentence out loud. Then tap to hear it and check yourself. <b>No score</b>: this is just for you.</p></div>' +
      '<div class="brt-row"><span class="brt-note"><b>' + (p.ri + 1) + ' of ' + order.length + '</b></span></div>' +
      '<div class="brt-card" style="align-items:center;text-align:center"><div class="brt-pic">' + P(f.cue, 'p') + ' ' + P(cs.pic, 'p') + '</div>' +
      (cs.typed ? '<div class="brt-en">(your own words)</div>' : '');
    if (p.shown) h += '<div class="brt-card ok" style="width:100%"><div class="brt-row" style="justify-content:center"><div class="brt-big">' + esc(cs.it) + '</div></div><div class="brt-row" style="justify-content:center">' + sayBtns(cs.it) + '</div></div>';
    else h += '<button class="brt-b go" data-a="recallshow">🔊 I said it. Now let me hear it</button>';
    h += '</div>';
    if (p.shown) h += '<div class="brt-row"><button class="brt-b go" data-a="recallnext" data-focus="1">' + (p.ri + 1 >= order.length ? 'Finish Stage 7 ✓' : 'Next ▶') + '</button></div>';
    return h;
  }
  ACT.recallshow = function () {
    var p = S.pos.s7, fid = p.order[p.ri], cs = S.lad.pick.indexOf(fid) !== -1 ? highest(fid) : sentenceFor(fid);
    p.shown = true; save(); render(); say(cs.it);
  };
  ACT.recallnext = function () {
    var p = S.pos.s7; p.ri++; p.shown = false;
    if (p.ri >= p.order.length) { S.lad.recall = true; p.phase = 'hear'; p.ri = 0; stageDone(7); save(); go(doneCount() === 7 ? 'finish' : 'hub'); return; }
    save(); render();
  };

  /* ================================================================ MY WORK (finish screen) */
  function copyText() {
    var L = [];
    L.push('Name: ' + (S.name || '(add your name)'));
    L.push(U.title + ' — my sentences');
    picked().forEach(function (f, i) {
      var cs = S.lad.pick.indexOf(f.id) !== -1 ? highest(f.id) : sentenceFor(f.id);
      L.push((i + 1) + '. ' + cs.it + (cs.typed ? ' [typed by student]' : '') + (S.lad.pick.indexOf(f.id) !== -1 ? ' (Level ' + cs.level + ')' : ''));
    });
    function lk(k) { return S.links[k] ? S.links[k] : (S.phone[k] ? '(recorded on phone)' : '(not recorded yet)'); }
    L.push(''); L.push('Registra 1: ' + lk('r1')); L.push('Dialogo: ' + lk('dialogo')); L.push('Registra 2: ' + lk('r2'));
    return L.join('\n');
  }
  SCREENS.finish = function () {
    var h = head('My work', U.title, '');
    var all = doneCount() === 7;
    h += all ? '<div class="brt-card ok" role="status"><h3>🎉 All 7 stages done!</h3><p>Look at everything you can say now.</p></div>' :
      '<div class="brt-card try"><p><b>' + doneCount() + ' of 7 stages are done.</b> This page shows what you have so far. You can copy it at any time.</p></div>';
    h += '<label class="brt-note" for="brt-nm">Your name</label><input id="brt-nm" class="brt-in" type="text" autocomplete="name" placeholder="First and last name" value="' + esc(S.name || '') + '" data-in="nm">';
    if (!hasPicks()) { h += '<div class="brt-card try"><p>You have not chosen your 10 sentences yet. They will appear here after Stage 2.</p></div><button class="brt-b go" data-a="gopicks">Choose my 10 sentences</button>'; }
    else {
      h += '<div class="brt-list">';
      picked().forEach(function (f, i) {
        var lad = S.lad.pick.indexOf(f.id) !== -1, cs = lad ? highest(f.id) : sentenceFor(f.id);
        h += '<div class="brt-li">' + P(cs.pic, 'p') + '<div class="tx"><div class="brt-sent">' + (i + 1) + '. ' + esc(cs.it) + '</div>' + (lad ? '<span class="brt-tag spk">Level ' + cs.level + '</span> ' : '') + (cs.typed ? '<span class="brt-tag acc">typed by student</span>' : '') + (S.en && !cs.typed ? '<div class="brt-en">' + esc(cs.en) + '</div>' : '') + '</div>' + sayBtns(cs.it) + '</div>';
      });
      h += '</div><div class="brt-row">' + enBtn() + '</div>';
    }
    function lkrow(k, label) { var v = S.links[k]; return '<div class="brt-li"><span class="brt-pic" style="font-size:26px">🎙️</span><div class="tx"><b>' + label + '</b><div class="brt-note" style="word-break:break-all">' + (v ? esc(v) : (S.phone[k] ? 'Recorded on phone' : 'Not recorded yet')) + '</div></div></div>'; }
    h += '<div class="brt-list">' + lkrow('r1', 'Registra 1') + lkrow('dialogo', 'Dialogo') + lkrow('r2', 'Registra 2') + '</div>';
    if (S.dlg.commons.length) h += commonsHtml();
    var txt = copyText();
    h += '<div class="brt-card vio"><button class="brt-b go" data-a="copyall">📋 Copy everything</button><p><b>Paste this into your Google Classroom assignment.</b></p>' +
      '<textarea id="brt-copy" class="brt-in" readonly rows="8" style="font-size:14px;font-weight:600">' + esc(txt) + '</textarea><p class="brt-note">If the button does not copy, click inside the box, press Ctrl+A, then Ctrl+C.</p></div>';
    h += ripassoBoxes() + '<div class="brt-row"><button class="brt-b ghost" data-a="hub">Back to the list</button><button class="brt-b vio" data-a="ripasso">🔁 Ripasso now</button></div>';
    return h;
  };
  ACT.nm = function (el) { S.name = el.value.slice(0, 60); save(); var ta = root.querySelector('#brt-copy'); if (ta) ta.value = copyText(); };
  ACT.copyall = function () {
    var txt = copyText(), ok = false;
    function fallback() {
      try { var ta = root.querySelector('#brt-copy'); if (ta) { ta.removeAttribute('readonly'); ta.focus(); ta.select(); ok = document.execCommand('copy'); ta.setAttribute('readonly', 'readonly'); } } catch (e) {}
      toast(ok ? 'Copied! Now paste it into Google Classroom.' : 'Select the text in the box and press Ctrl+C.');
    }
    try { if (navigator.clipboard && navigator.clipboard.writeText) { navigator.clipboard.writeText(txt).then(function () { toast('Copied! Now paste it into Google Classroom.'); }, fallback); return; } } catch (e) {}
    fallback();
  };
  ACT.finish = function () { go('finish'); };

  /* ================================================================ RIPASSO (5 to 10 minutes, on later days) */
  SCREENS.ripasso = function () {
    if (!hasPicks()) return head('Ripasso', U.title, '') + '<div class="brt-card try"><p>Ripasso uses your own sentences. Choose them first (Stage 2), then come back.</p></div><div class="brt-row"><button class="brt-b go" data-a="gopicks">Choose my 10 sentences</button><button class="brt-b ghost" data-a="hub">Back</button></div>';
    var r = V.rp;
    if (!r) {
      var pk = shuffle(picked().map(function (f) { return f.id; })), items = pk.slice(0, 8);
      r = V.rp = { phase: 'match', items: items, i: 0, wrong: [], solved: false, recall: shuffle(pk).slice(0, 8), ri: 0, shown: false };
    }
    var h = head('Ripasso', 'Quick review · 5 to 10 minutes', '');
    if (r.phase === 'done') {
      return h + '<div class="brt-card ok" role="status"><h3>✅ Ripasso done!</h3><p>Come back on the next day on the list. Short and often is what makes it stay.</p></div>' + ripassoBoxes() + '<div class="brt-row"><button class="brt-b go" data-a="hub">Back to the list</button></div>';
    }
    if (r.phase === 'match') {
      var fid = r.items[r.i], sn = sentenceFor(fid), opts = r.opts && r.opts.i === r.i ? r.opts.list : null;
      if (!opts) { var oth = shuffle(picked().map(function (f) { return f.id; }).filter(function (x) { return x !== fid; })).slice(0, 3); opts = shuffle([fid].concat(oth)); r.opts = { i: r.i, list: opts }; }
      h += '<div class="brt-row"><span class="brt-note"><b>Part 1 · Listen and match ' + (r.i + 1) + ' of ' + r.items.length + '</b></span></div>' +
        '<div class="brt-card vio" style="align-items:center;text-align:center"><b>Listen. Tap the picture that matches.</b><div class="brt-row" style="justify-content:center">' + sayBtns(sn.it) + '</div></div><div class="brt-opts">';
      opts.forEach(function (id) {
        var g = sentenceFor(id), gf = FR(id), bad = r.wrong.indexOf(id) !== -1, good = r.solved && id === fid;
        h += '<button class="brt-opt' + (bad ? ' try' : '') + (good ? ' ok' : (r.solved ? ' off' : '')) + '" data-a="rppick" data-f="' + id + '"' + (bad || r.solved ? ' aria-disabled="true"' : '') + '>' + P(gf.cue, 'p') + ' ' + P(g.pic, 'p') + (r.solved && good ? '<span>' + esc(g.it) + '</span>' : '') + '</button>';
      });
      h += '</div>';
      if (r.wrong.length && !r.solved) h += '<div class="brt-card try" role="status"><b>Not that one. Listen again and try another.</b></div>';
      if (r.solved) h += '<button class="brt-b go" data-a="rpnext" data-focus="1">' + (r.i + 1 >= r.items.length ? 'Part 2: say them ▶' : 'Next ▶') + '</button>';
      return h;
    }
    var fid2 = r.recall[r.ri], sn2 = sentenceFor(fid2), f2 = FR(fid2);
    h += '<div class="brt-card vio"><h3>Part 2 · Say it from memory</h3><p>Look at the picture, say the sentence, then tap to hear it. No score.</p></div><div class="brt-row"><span class="brt-note"><b>' + (r.ri + 1) + ' of ' + r.recall.length + '</b></span></div>' +
      '<div class="brt-card" style="align-items:center;text-align:center"><div class="brt-pic">' + P(f2.cue, 'p') + ' ' + P(sn2.pic, 'p') + '</div>' + (sn2.typed ? '<div class="brt-en">(your own words)</div>' : '') +
      (r.shown ? '<div class="brt-card ok" style="width:100%"><div class="brt-big">' + esc(sn2.it) + '</div><div class="brt-row" style="justify-content:center">' + sayBtns(sn2.it) + '</div></div>' : '<button class="brt-b go" data-a="rpshow">🔊 I said it. Now let me hear it</button>') + '</div>';
    if (r.shown) h += '<button class="brt-b go" data-a="rpdone" data-focus="1">' + (r.ri + 1 >= r.recall.length ? 'Finish Ripasso ✓' : 'Next ▶') + '</button>';
    return h;
  };
  ACT.ripasso = function () { V.rp = null; go('ripasso'); var r = V.rp; if (r && r.items) say(sentenceFor(r.items[0]).it); };
  ACT.rppick = function (el) {
    var r = V.rp, fid = el.getAttribute('data-f'); if (!r || r.solved) return;
    if (fid === r.items[r.i]) {
      r.solved = true; render(); var at = r.i;
      autoAdvance(sentenceFor(fid).it, function () { if (V.screen === 'ripasso' && V.rp === r && r.solved && r.phase === 'match' && r.i === at) ACT.rpnext(); });
    } else { r.wrong.push(fid); render(); }
  };
  ACT.rpnext = function () {
    advTok = null; var r = V.rp; r.i++; r.wrong = []; r.solved = false;
    if (r.i >= r.items.length) { r.phase = 'recall'; render(); return; }
    render(); say(sentenceFor(r.items[r.i]).it);
  };
  ACT.rpshow = function () { var r = V.rp; r.shown = true; render(); say(sentenceFor(r.recall[r.ri]).it); };
  ACT.rpdone = function () {
    var r = V.rp; r.ri++; r.shown = false;
    if (r.ri >= r.recall.length) {
      r.phase = 'done';
      var idx = S.rip.days.indexOf(false); if (idx !== -1) S.rip.days[idx] = true;
      S.rip.count = (S.rip.count || 0) + 1; paySmall('ripasso' + S.rip.count, U.bc.ripasso); save();
    }
    render();
  };

  /* ================================================================ LA TABELLA: tips (everyone), extras (advanced, they pay), every chunk */
  function extrasPaid() { var n = 0; for (var k in S.ex) if (S.ex[k]) n++; return n * U.bc.extra; }
  SCREENS.tabella = function () {
    var tab = V.tab || 'tips', h = head('La Tabella', U.title, '');
    h += '<div class="brt-row">' + [['tips', 'Trucchi e consigli'], ['extras', 'Extra'], ['chunks', 'All the chunks']].map(function (t) { return '<button class="brt-tab" data-a="tabtab" data-t="' + t[0] + '" aria-pressed="' + (tab === t[0]) + '">' + t[1] + '</button>'; }).join('') + '<span class="brt-grow"></span>' + enBtn() + '</div>';
    if (tab === 'tips') {
      h += '<p class="brt-note">Tips, tricks and memory hooks. Read them any time.</p>';
      U.tips.forEach(function (c) { h += '<div class="brt-card"><h3>' + esc(c.title) + '</h3>' + c.body.map(function (l) { return '<p>' + md(T(l)) + '</p>'; }).join('') + '</div>'; });
    } else if (tab === 'extras') {
      var cap = U.bc.extraCap, got = extrasPaid();
      h += '<div class="brt-card vio"><b>For students who want more.</b><p>Never required. Every card you finish pays <b>' + U.bc.extra + ' Boh Cashi</b> (up to ' + cap + ' in this unit).</p></div>';
      U.extras.forEach(function (c) {
        var d = !!S.ex[c.id];
        h += '<div class="brt-card' + (d ? ' ok' : '') + '"><h3>' + esc(c.title) + '</h3>' + c.body.map(function (l) { return '<p>' + md(T(l)) + '</p>'; }).join('') +
          '<div class="brt-row"><button class="brt-b ' + (d ? 'ok' : 'go') + '" data-a="exdone" data-id="' + c.id + '"' + (d ? ' aria-disabled="true"' : '') + '>' + (d ? '✓ Done' : 'I did this ✓') + '</button>' + (!d && got >= cap ? '<span class="brt-note">You have reached the Boh Cashi limit for Extras, but you can still do them.</span>' : '') + '</div></div>';
      });
    } else {
      h += '<p class="brt-note">Every piece you can choose, with a picture. Tap 🔊 to hear a piece or the whole sentence.</p>';
      U.frames.forEach(function (f) {
        h += '<div class="brt-card"><div class="brt-row"><h3>' + P(f.cue, 'p') + ' ' + esc(f.it) + ' …</h3><span class="brt-grow"></span><span class="brt-pair">' + esc(f.presentIt) + ' → ' + esc(lc1(f.it)) + '</span></div><div class="brt-list">';
        f.choices.forEach(function (c) {
          var s = T(f.it + ' ' + c.it) + '.';
          h += '<div class="brt-li">' + P(c.pic, 'p') + '<div class="tx"><div class="brt-sent">' + esc(T(c.it)) + '</div>' + (S.en ? '<div class="brt-en">' + esc(c.en) + '</div>' : '') + '</div>' + sayBtns(s) + '</div>';
        });
        h += '</div></div>';
      });
    }
    return h;
  };
  ACT.tabella = function () { V.tab = 'tips'; go('tabella'); };
  ACT.tabtab = function (el) { V.tab = el.getAttribute('data-t'); render(); };
  ACT.exdone = function (el) {
    var id = el.getAttribute('data-id'); if (S.ex[id]) return;
    S.ex[id] = true; save();
    if (extrasPaid() <= U.bc.extraCap) paySmall('ex_' + id, U.bc.extra); else toast('Done!');
    render();
  };

  /* ================================================================ PAUSA: a calm memory game (no timer, no score, no BC) */
  function memDeck() {
    var seen = {}, pairs = [];
    shuffle(U.frames).forEach(function (f) {
      var c = f.choices[Math.floor(Math.random() * f.choices.length)];
      if (pairs.length < 6 && !seen[c.pic] && !seen[T(c.it)]) { seen[c.pic] = 1; seen[T(c.it)] = 1; pairs.push({ id: pairs.length, it: T(c.it), pic: c.pic, say: T(f.it + ' ' + c.it) + '.' }); }
    });
    var cards = [];
    pairs.forEach(function (p) { cards.push({ pid: p.id, kind: 'it', p: p }); cards.push({ pid: p.id, kind: 'pic', p: p }); });
    return shuffle(cards);
  }
  SCREENS.pausa = function () {
    if (!V.mem) V.mem = { cards: memDeck(), up: [], done: [], lock: false };
    var m = V.mem, all = m.done.length === m.cards.length / 2;
    var h = head('Pausa 🎮', 'A short break', '');
    h += '<p class="brt-note">Match each Italian piece to its picture. No timer. No score. Take your time.</p><div class="brt-mem">';
    m.cards.forEach(function (c, i) {
      var open = m.up.indexOf(i) !== -1 || m.done.indexOf(c.pid) !== -1, ok = m.done.indexOf(c.pid) !== -1;
      h += '<button class="brt-mc' + (open ? ' up' : '') + (ok ? ' ok' : '') + '" data-a="memflip" data-i="' + i + '" aria-label="' + (open ? (c.kind === 'it' ? esc(c.p.it) : 'picture') : 'hidden card') + '">' +
        (open ? (c.kind === 'it' ? esc(c.p.it) : P(c.p.pic, 'p')) : '?') + '</button>';
    });
    h += '</div>';
    if (all) h += '<div class="brt-card ok" role="status"><h3>🎉 Bravo!</h3><p>All the pairs matched.</p></div>';
    h += '<div class="brt-row">' + (all ? '<button class="brt-b vio" data-a="memagain">Play again</button>' : '') + '<span class="brt-grow"></span><button class="brt-b go" data-a="hub">Back to work ▶</button></div>';
    return h;
  };
  ACT.pausa = function () { V.mem = null; go('pausa'); };
  ACT.memagain = function () { V.mem = null; render(); };
  ACT.memflip = function (el) {
    var m = V.mem, i = parseInt(el.getAttribute('data-i'), 10), c = m.cards[i];
    if (!m || m.lock || m.up.indexOf(i) !== -1 || m.done.indexOf(c.pid) !== -1) return;
    m.up.push(i);
    if (c.kind === 'it') say(c.p.it);
    if (m.up.length === 2) {
      var a = m.cards[m.up[0]], b = m.cards[m.up[1]];
      if (a.pid === b.pid) { m.done.push(a.pid); m.up = []; render(); say(a.p.say); return; }
      m.lock = true; render();
      setTimeout(function () { if (V.mem !== m) return; m.up = []; m.lock = false; if (V.screen === 'pausa') render(); }, 1000);
      return;
    }
    render();
  };

  /* ================================================================ open, close, register */
  var cssIn = false;
  var R = {
    register: function (u) { UNITS[u.id] = u; },
    units: UNITS,
    /* progress summary for the game (how many of the 7 stages are done), without opening anything */
    stats: function (id) {
      var u = UNITS[id], o = null; if (!u) return { done: 0, of: 7 };
      try { o = JSON.parse(localStorage.getItem('boh_rt_' + id) || 'null'); } catch (e) {}
      var n = 0; if (o && o.done) for (var i = 1; i <= 7; i++) if (o.done[i]) n++;
      return { done: n, of: 7 };
    },
    open: function (id, opts) {
      if (root) R.close(true);
      U = UNITS[id]; if (!U) return;
      O = opts || {}; S = load();
      if (!S.end) S.end = bohEnd(O.boh);
      V = { screen: 'hub', x: {}, sound: '' };
      if (!cssIn) { var st = document.createElement('style'); st.textContent = CSS; document.head.appendChild(st); cssIn = true; }
      root = document.createElement('div'); root.className = 'brt-ov'; root.setAttribute('role', 'dialog'); root.setAttribute('aria-modal', 'true'); root.setAttribute('aria-label', U.title);
      root.innerHTML = '<div class="brt"></div>';
      document.body.appendChild(root);
      try { R._ovf = document.body.style.overflow; document.body.style.overflow = 'hidden'; } catch (e) {}
      root.addEventListener('click', onClick); root.addEventListener('input', onInput); root.addEventListener('change', onInput);
      keyH = onKey; document.addEventListener('keydown', keyH);
      clockIv = setInterval(function () { var c = root && root.querySelector('#brt-clock'); if (c) c.textContent = clockText(); }, 20000);
      Say.init(function () { if (root && V.screen === 'hub') render(); });
      render();
    },
    close: function (quiet) {
      Say.stop(); clearTimeout(pauseTm); if (run6) { run6.stopped = true; run6 = null; } if (storyRun) { storyRun.stop(); storyRun = null; }
      clearInterval(clockIv); if (keyH) document.removeEventListener('keydown', keyH); keyH = null;
      if (root) { root.remove(); root = null; }
      try { document.body.style.overflow = R._ovf || ''; } catch (e) {}
      var cb = O && O.onClose; if (!quiet && cb) { try { cb(); } catch (e) {} }
    }
  };
  W.BohRoutine = R;
})(window);
