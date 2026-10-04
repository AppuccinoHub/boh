/* Boh voice: one shared way to choose the Italian voice, for every Italiano page, the flashcards and the unit.
   Why: Chromebooks often list several Italian voices, and the first one in the list can be the robotic built-in one (eSpeak).
   What it does, quietly:
   1. Every time the page speaks Italian, it uses the best Italian voice found (Google / Microsoft / Apple natural voices first, never eSpeak when anything else exists),
      or the voice a student picked in the voice list (remembered on that computer).
   2. Very slow speech (below 0.7) is raised to 0.7 on Chromebooks and on online voices, because they turn into garbled robot noise when slowed more than that.
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
  function slowSensitive(v) { return CROS || !v || v.localService === false; }

  /* every Italian utterance, from any page or script, gets the shared voice and a safe minimum speed */
  if (S && W.SpeechSynthesis && W.SpeechSynthesis.prototype && !W.SpeechSynthesis.prototype.__bohVoice) {
    var orig = W.SpeechSynthesis.prototype.speak;
    W.SpeechSynthesis.prototype.speak = function (u) {
      try {
        if (u && !u.__bohRaw && (!u.lang || /^it/i.test(u.lang))) {
          var v = pick(); if (v) u.voice = v;
          if (slowSensitive(u.voice) && u.rate < MINRATE) u.rate = MINRATE;
        }
      } catch (e) {}
      return orig.call(this, u);
    };
    W.SpeechSynthesis.prototype.__bohVoice = true;
  }

  function speak(text, o) {
    o = o || {};
    if (!S || typeof SpeechSynthesisUtterance === 'undefined') return null;
    try {
      S.cancel(); var u = new SpeechSynthesisUtterance(String(text)); u.lang = 'it-IT';
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
    pick: pick, auto: auto, list: italian, all: all, speak: speak, openPicker: openPicker, helpHtml: helpHtml, closePicker: closePicker,
    isRobotic: robotic, onlyRobotic: function () { var it = italian(); return !it.length || it.every(robotic); },
    cros: CROS, minRate: MINRATE, key: KEY
  };
})(window);
