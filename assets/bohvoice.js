/* Boh voice: one shared way to choose the Italian voice, for every Italiano page, the flashcards and the unit.
   Why: Chromebooks often list several Italian voices, and the first one in the list can be the robotic built-in one (eSpeak).
   What it does, quietly:
   1. Every time the page speaks Italian, it uses the best Italian voice found (Google / Microsoft / Apple natural voices first, never eSpeak when anything else exists),
      or the voice a student picked in the voice list (remembered on that computer).
   2. Very slow speech (below 0.7) is raised to 0.7 on Chromebooks and on online voices, because they turn into garbled robot noise when slowed more than that.
   3. Recorded clips (added 2026-10-12): if a recording of the exact phrase exists in assets/audio/manifest.json, it is played as a normal audio file instead of the built-in voice.
      Why: the built-in voice stays on the device's own speaker, so it is silent on AirPlay, Bluetooth and the Promethean board; a recorded file goes out like any other sound.
      No recording for the phrase, or the clip cannot play: the built-in voice speaks, exactly as before.
   4. Gender slashes (added 2026-10-20): piccolo/a, andato/a, connesso/a are SAID in the boy form (piccolo), never "piccolo barra a".
      The written text on screen keeps the slash; the screens that show a spoken question add a note for girls.
   Nothing here changes any page's content. window.BohVoice.openPicker() shows the voice list; voices.html is the teacher's check page. */
(function (W) {
  'use strict';
  if (W.BohVoice) return;
  var KEY = 'boh_voice', MINRATE = 0.7, S = null;
  try { S = W.speechSynthesis || null; } catch (e) {}
  var CROS = /CrOS/.test((navigator && navigator.userAgent) || '');
  function lsGet(k) { try { return localStorage.getItem(k) || ''; } catch (e) { return ''; } }
  function lsSet(k, v) { try { if (v) localStorage.setItem(k, v); else localStorage.removeItem(k); } catch (e) {} }

  function all() { try { return S ? (S.getVoices() || []) : []; } catch (e) { return []; } }
  function italian() {
    var vs = all(), it = vs.filter(function (v) { return /^it([-_]|$)/i.test(v.lang || ''); });
    if (!it.length) it = vs.filter(function (v) { return /italia/i.test(v.name || ''); });
    return it;
  }
  function robotic(v) { return !!v && /espeak|compact/i.test(v.name || ''); }
  function score(v) {
    var n = v.name || '', sc = 0;
    if (/natural|neural|premium|enhanced|siri/i.test(n)) sc += 50;
    if (/google/i.test(n)) sc += 40;
    if (/microsoft/i.test(n)) sc += 35;
    if (/alice|federica|luca|paola|elsa|isabella|diego/i.test(n)) sc += 20;
    if (/^it[-_]IT$/i.test(v.lang || '')) sc += 8;
    if (v.localService) sc += 4;
    if (robotic(v)) sc -= 60;
    return sc;
  }
  function auto() { var it = italian().slice(); it.sort(function (a, b) { return score(b) - score(a); }); return it[0] || null; }
  function chosen() {
    var want = lsGet(KEY); if (!want) return null;
    var it = italian(); for (var i = 0; i < it.length; i++) if (it[i].voiceURI === want || it[i].name === want) return it[i];
    return null;
  }
  function pick() { return chosen() || auto(); }
  function deslash(t) { try { return String(t).replace(/(\p{L})\/[aei]\b/gu, '$1'); } catch (e) { return String(t).replace(/([A-Za-z\u00C0-\u024F])\/[aei]\b/g, '$1'); } }
  function slowSensitive(v) { return CROS || !v || v.localService === false; }


  /* ---------------------------------------------------------------- recorded clips (one shared player) */
  var SRC = ''; try { SRC = (document.currentScript && document.currentScript.src) || ''; } catch (e) {}
  var CLIPS = null, CBASE = '', clipEl = null, cur = null, unlocked = false;
  var SILENT = 'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQAAAAA=';
  /* one spelling for every phrase: lower case, accents kept, punctuation and emoji dropped. assets/audio/README.md has the same rule for the script that makes the clips. */
  function norm(t) {
    try { return String(t || '').toLowerCase().normalize('NFC').replace(/[‘’]/g, "'").replace(/[^\p{L}\p{N}' ]/gu, ' ').replace(/\s+/g, ' ').trim(); }
    catch (e) { return String(t || '').toLowerCase().replace(/\s+/g, ' ').trim(); }
  }
  function loadClips() {
    try {
      if (!SRC || !W.fetch) return;
      var dir = SRC.split('?')[0].replace(/[^\/]*$/, ''), q = SRC.indexOf('?') > -1 ? SRC.slice(SRC.indexOf('?')) : '';
      CBASE = dir + 'audio/';
      W.fetch(CBASE + 'manifest.json' + q).then(function (r) { return r.ok ? r.json() : null; }).then(function (j) { if (j && j.clips) CLIPS = j.clips; }).catch(function () {});
    } catch (e) {}
  }
  function el() { if (!clipEl) { try { clipEl = new Audio(); clipEl.preload = 'auto'; clipEl.setAttribute('playsinline', ''); } catch (e) { clipEl = null; } } return clipEl; }
  /* iPhone Safari only lets an audio element play later, on its own, if it was started once by a tap: do that quietly on the first touch, key or click */
  function unlock() {
    if (unlocked) return; unlocked = true;
    try { var a = el(); if (a) { a.src = SILENT; var p = a.play(); if (p && p.catch) p.catch(function () { unlocked = false; }); } } catch (e) {}
  }
  ['touchend', 'click', 'keydown'].forEach(function (ev) { try { document.addEventListener(ev, unlock, { capture: true, passive: true, once: true }); } catch (e) {} });
  function fire(u, type, err) { try { var e = new Event(type); if (err) e.error = err; u.dispatchEvent(e); } catch (e2) {} }
  function stopClip(err) { var u = cur; cur = null; try { if (clipEl) clipEl.pause(); } catch (e) {} if (u && err) fire(u, 'error', err); }
  function hasClip(text) { return !!(CLIPS && CLIPS[norm(text)]); }
  /* returns true when a recording is playing for this utterance; false means the caller should use the built-in voice */
  function playClip(u, speakNative) {
    if (!CLIPS || !u || u.__bohRaw || (u.lang && !/^it/i.test(u.lang))) return false;
    var file = CLIPS[norm(u.text)]; if (!file) return false;
    var a = el(); if (!a) return false;
    if (cur) stopClip('interrupted');
    cur = u;
    var back = function () { if (cur === u) { cur = null; try { speakNative(u); } catch (e) {} } };
    a.onended = function () { if (cur === u) { cur = null; fire(u, 'end'); } };
    a.onerror = back;
    try {
      a.src = CBASE + file;
      var r = (u.rate && u.rate > 0) ? u.rate : 1;
      a.playbackRate = Math.min(1.3, Math.max(0.5, r / 0.92));
      try { a.preservesPitch = true; a.webkitPreservesPitch = true; } catch (e) {}
      if (typeof u.volume === 'number') a.volume = Math.min(1, Math.max(0, u.volume));
      var p = a.play();
      if (p && p.then) p.then(function () { if (cur === u) fire(u, 'start'); }, back);
    } catch (e) { back(); }
    return true;
  }
  loadClips();

  /* every Italian utterance, from any page or script, gets the shared voice and a safe minimum speed */
  if (S && W.SpeechSynthesis && W.SpeechSynthesis.prototype && !W.SpeechSynthesis.prototype.__bohVoice) {
    var orig = W.SpeechSynthesis.prototype.speak, origCancel = W.SpeechSynthesis.prototype.cancel, nativeSpeak = function (u) { return orig.call(S, u); };
    W.SpeechSynthesis.prototype.cancel = function () { try { if (cur) stopClip('canceled'); } catch (e) {} return origCancel.apply(this, arguments); };
    W.SpeechSynthesis.prototype.speak = function (u) {
      try { if (u && !u.__bohRaw && typeof u.text === 'string' && (!u.lang || /^it/i.test(u.lang))) { var dt = deslash(u.text); if (dt !== u.text) u.text = dt; } } catch (e) {}
      try { if (playClip(u, function (x) { prepare(x); return orig.call(S, x); })) return; } catch (e) {}
      prepare(u);
      return orig.call(this, u);
    };
    function prepare(u) {
      try {
        if (u && !u.__bohRaw && (!u.lang || /^it/i.test(u.lang))) {
          var v = pick(); if (v) u.voice = v;
          if (slowSensitive(u.voice) && u.rate < MINRATE) u.rate = MINRATE;
        }
      } catch (e) {}
    }
    W.SpeechSynthesis.prototype.__bohVoice = true;
  }

  function speak(text, o) {
    o = o || {};
    if (!S || typeof SpeechSynthesisUtterance === 'undefined') return null;
    try {
      S.cancel(); var u = new SpeechSynthesisUtterance(o.raw ? String(text) : deslash(text)); u.lang = 'it-IT';
      if (o.voice) u.voice = o.voice; if (o.rate) u.rate = o.rate; if (o.raw) u.__bohRaw = true;
      if (o.onend) { u.onend = o.onend; u.onerror = o.onend; }
      S.speak(u); return u;
    } catch (e) { return null; }
  }

  /* ---------------------------------------------------------------- the voice list (a small overlay) */
  var ov = null;
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  /* How to get an Italian voice. One text, used by the picker and by voices.html. Steps match Google's help pages (ChromeOS text-to-speech, Chrome Reading mode). */
  function helpHtml(open) {
    var li = 'margin:0 0 7px;line-height:1.45';
    return '<details' + (open ? ' open' : '') + ' style="margin:10px 0 12px;border:2px solid #eadfd8;border-radius:12px;padding:10px 12px;font-size:14px;color:#231815">' +
      '<summary style="cursor:pointer;font-weight:800;min-height:28px">No sound, or a robot voice? How to add Italian</summary>' +
      '<ol style="margin:10px 0 0;padding-left:20px">' +
      '<li style="' + li + '">Tap <b>Test</b> again. Check your volume, and that this tab is not muted.</li>' +
      '<li style="' + li + '"><b>Chromebook:</b> click the clock at the bottom right, then <b>Settings</b>, <b>Accessibility</b>, <b>Text-to-speech</b>, <b>Text-to-speech voice settings</b>. Next to &ldquo;Chrome OS built-in text-to-speech extension&rdquo; choose <b>Settings</b>, then <b>Install</b> next to <b>Italian</b>. Come back and reload this page.</li>' +
      '<li style="' + li + '"><b>Chrome:</b> click the <b>three dots</b> at the top right, next to your picture. Choose <b>More tools</b>, then <b>Reading mode</b>. Press <b>Play</b>, then <b>Settings</b>, then <b>Voice selection</b>. This may not change the game. If it does not, use the Chromebook steps above.</li>' +
      '<li style="' + li + '">Still silent? Close Chrome, open it again and reload. Try headphones. Make sure Wi-Fi is on, because some voices download.</li>' +
      '<li style="' + li + '">School Chromebooks can block new voices. Tell Prof. Lo So. You can keep going: read the Italian on the screen, or skip the listening part for now. It will not count against you.</li>' +
      '</ol></details>';
  }
  function closePicker() { if (ov) { ov.remove(); ov = null; } try { S && S.cancel(); } catch (e) {} }
  function openPicker() {
    if (ov) return;
    ov = document.createElement('div'); ov.setAttribute('role', 'dialog'); ov.setAttribute('aria-modal', 'true'); ov.setAttribute('aria-label', 'Choose a voice');
    ov.style.cssText = 'position:fixed;inset:0;z-index:2147483000;background:rgba(35,24,21,.72);display:flex;align-items:center;justify-content:center;padding:14px;font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif';
    document.body.appendChild(ov);
    function render() {
      var it = italian(), cur = lsGet(KEY), best = auto(), noGood = !it.length || (it.length && it.every(robotic));
      var h = '<div style="background:#fff;color:#231815;border-radius:18px;max-width:520px;width:100%;max-height:90vh;overflow:auto;padding:18px;box-sizing:border-box">' +
        '<div style="display:flex;align-items:center;gap:8px"><h2 style="margin:0;font-size:20px;flex:1">🔊 Voce · Voice</h2><button data-v="close" aria-label="Close" style="min-height:44px;min-width:44px;border:0;border-radius:12px;background:#f3e9e2;font-size:18px;cursor:pointer">✕</button></div>' +
        '<p style="margin:8px 0 10px;font-size:14px;color:#5b4a43">Tap <b>Test</b> to hear a voice. Choose the one that is easiest to understand.</p>';
      if (!it.length) h += '<p style="background:#fff3cd;border-radius:10px;padding:10px;font-size:14px"><b>This computer has no Italian voice.</b> The game will stay quiet. Try the steps below, or tell Prof. Lo So.</p>';
      else if (noGood) h += '<p style="background:#fff3cd;border-radius:10px;padding:10px;font-size:14px"><b>This computer only has a robotic Italian voice.</b> It may be hard to understand. Read the Italian on the screen, try the steps below, or tell Prof. Lo So.</p>';
      h += helpHtml(!it.length || noGood);
      if (it.length) {
        h += '<label style="display:flex;gap:10px;align-items:center;padding:10px;border:2px solid ' + (!cur ? '#e8845f' : '#eadfd8') + ';border-radius:12px;margin-bottom:6px;cursor:pointer"><input type="radio" name="bv" value="" ' + (!cur ? 'checked' : '') + ' style="width:20px;height:20px"><span style="flex:1;font-size:15px"><b>Automatic</b> (best one)<br><span style="font-size:12px;color:#7a6860">' + esc(best ? best.name : '') + '</span></span><button data-v="test" data-u="' + esc(best ? best.voiceURI : '') + '" style="min-height:44px;padding:0 14px;border:0;border-radius:12px;background:#6b4a8a;color:#fff;font-weight:700;cursor:pointer">▶ Test</button></label>';
        it.forEach(function (v) {
          var on = cur && (cur === v.voiceURI || cur === v.name);
          h += '<label style="display:flex;gap:10px;align-items:center;padding:10px;border:2px solid ' + (on ? '#e8845f' : '#eadfd8') + ';border-radius:12px;margin-bottom:6px;cursor:pointer"><input type="radio" name="bv" value="' + esc(v.voiceURI || v.name) + '" ' + (on ? 'checked' : '') + ' style="width:20px;height:20px"><span style="flex:1;font-size:15px"><b>' + esc(v.name) + '</b><br><span style="font-size:12px;color:#7a6860">' + esc(v.lang) + (v.localService ? ' · on this computer' : ' · online') + (robotic(v) ? ' · robotic' : '') + '</span></span><button data-v="test" data-u="' + esc(v.voiceURI || v.name) + '" style="min-height:44px;padding:0 14px;border:0;border-radius:12px;background:#6b4a8a;color:#fff;font-weight:700;cursor:pointer">▶ Test</button></label>';
        });
      }
      h += '<button data-v="close" style="width:100%;min-height:48px;margin-top:6px;border:0;border-radius:12px;background:#e8845f;color:#fff;font-weight:800;font-size:16px;cursor:pointer">Done</button></div>';
      ov.innerHTML = h;
    }
    ov.addEventListener('click', function (e) {
      var b = e.target.closest('[data-v]');
      if (e.target === ov) return closePicker();
      if (b && b.getAttribute('data-v') === 'close') return closePicker();
      if (b && b.getAttribute('data-v') === 'test') {
        e.preventDefault(); var uri = b.getAttribute('data-u'), v = null, it = italian();
        for (var i = 0; i < it.length; i++) if (it[i].voiceURI === uri || it[i].name === uri) v = it[i];
        speak('Ciao! Mi chiamo Boh. Oggi parliamo italiano insieme.', { voice: v || auto(), rate: 0.9, raw: false }); return;
      }
    });
    ov.addEventListener('change', function (e) { if (e.target.name === 'bv') { lsSet(KEY, e.target.value); render(); } });
    ov.addEventListener('keydown', function (e) { if (e.key === 'Escape') closePicker(); });
    render();
    try { S && S.addEventListener('voiceschanged', function () { if (ov) render(); }); } catch (e) {}
    var first = ov.querySelector('button'); if (first) try { first.focus(); } catch (e) {}
  }

  W.BohVoice = {
    pick: pick, auto: auto, hasClip: hasClip, norm: norm, list: italian, all: all, speak: speak, openPicker: openPicker, helpHtml: helpHtml, closePicker: closePicker,
    isRobotic: robotic, onlyRobotic: function () { var it = italian(); return !it.length || it.every(robotic); },
    cros: CROS, minRate: MINRATE, key: KEY
  };
})(window);
