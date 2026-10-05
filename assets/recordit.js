/* Boh "Record it": ONE speaking-and-recording box, used the same way in every level that loads it.
   Created by Assunta Scotto, 2026. Not for redistribution.

   Use:   BohRecordIt.open({ key:'rec_ap_f1_parla', label:'Parla', prompts:['...','...'], unit:'Famiglie e comunità', stop:'Parla',
                             name:'Gia', onClose:function (done) {} })
          BohRecordIt.done(key)  -> true when the student has a saved take, a pasted Vocaroo link, or ticked "recorded another way"
   Built on assets/recorder.js (records in the browser, keeps the take on the device). Vocaroo is the fallback and the way
   to hand the recording in: the student copies the link and pastes it into Google Classroom.
   The game never scores how a student sounds. Nothing is uploaded by the game. A level that does not load this file
   (Levels 1 and 2) never shows a Record it button. */
(function (W) {
  'use strict';
  if (W.BohRecordIt) return;
  var LS = 'boh_recordit_v1', VOC = 'https://vocaroo.com';
  var cur = null, lastFocus = null;

  function esc(t) { return String(t == null ? '' : t).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function read() { try { return JSON.parse(localStorage.getItem(LS) || '{}') || {}; } catch (e) { return {}; } }
  function write(o) { try { localStorage.setItem(LS, JSON.stringify(o)); } catch (e) {} }
  function get(k) { var o = read(); return o[k] || { link: '', phone: false }; }
  function put(k, v) { var o = read(); o[k] = v; write(o); }
  function done(k) {
    var v = get(k);
    return !!(v.link || v.phone || (W.BohRecorder && W.BohRecorder.has && W.BohRecorder.has(k)));
  }

  var css = '' +
    '#brit{position:fixed;inset:0;z-index:99990;background:rgba(20,16,40,.72);display:flex;align-items:center;justify-content:center;padding:12px}' +
    '#brit .brit-card{--vio:var(--primary-bg,#1A5CDF);--viobg:var(--option-default-bg,#E2EBFB);--ink:var(--text,#0E2A5B);--bg:var(--card-bg,#fff);--line:var(--card-border,#E3D8DC);--mut:var(--text-muted,#6B5F68);' +
    'width:100%;max-width:560px;max-height:calc(100vh - 24px);overflow:auto;background:var(--card-bg,#fff);color:var(--text,#0E2A5B);border:2px solid var(--card-border,#E3D8DC);border-radius:20px;padding:18px 18px 16px;box-shadow:0 14px 44px rgba(0,0,0,.45);font-family:inherit}' +
    '#brit h2{margin:0;font-size:22px;line-height:1.15}' +
    '#brit .brit-top{display:flex;justify-content:space-between;align-items:flex-start;gap:12px}' +
    '#brit .brit-x{all:unset;cursor:pointer;flex:none;width:44px;height:44px;border-radius:50%;display:flex;align-items:center;justify-content:center;background:var(--option-default-bg,#eee);font-weight:900;font-size:18px}' +
    '#brit .brit-steps{margin:10px 0 4px;padding:0;list-style:none;display:flex;flex-direction:column;gap:10px;counter-reset:s}' +
    '#brit .brit-steps>li{counter-increment:s;display:flex;gap:10px;align-items:flex-start;font-weight:700;font-size:16px;line-height:1.35}' +
    '#brit .brit-steps>li::before{content:counter(s);flex:none;width:28px;height:28px;border-radius:50%;background:var(--primary-bg,#1A5CDF);color:var(--primary-text,#fff);display:flex;align-items:center;justify-content:center;font-weight:900;font-size:15px}' +
    '#brit .brit-say{margin:6px 0 0;padding:10px 12px;border-radius:12px;background:var(--option-default-bg,#eee);font-weight:800;font-size:15px;display:flex;flex-direction:column;gap:4px}' +
    '#brit .brit-note{font-size:14px;color:var(--text-muted,#555);font-weight:600;margin:6px 0}' +
    '#brit details{border:2px solid var(--card-border,#ddd);border-radius:14px;padding:10px 12px;margin:10px 0}' +
    '#brit summary{cursor:pointer;font-weight:800;font-size:16px;min-height:32px}' +
    '#brit .brit-btn{all:unset;box-sizing:border-box;cursor:pointer;display:flex;align-items:center;justify-content:center;text-align:center;min-height:48px;padding:10px 16px;border-radius:14px;background:var(--primary-bg,#1A5CDF);color:var(--primary-text,#fff);font-weight:900;font-size:16px;text-decoration:none}' +
    '#brit .brit-btn.ghost{background:var(--option-default-bg,#eee);color:var(--text,#111);border:2px solid var(--card-border,#ddd)}' +
    '#brit .brit-btn[aria-disabled="true"]{opacity:.45;cursor:default}' +
    '#brit .brit-in{box-sizing:border-box;width:100%;min-height:48px;border-radius:12px;border:2px solid var(--card-border,#ccc);background:var(--card-bg,#fff);color:var(--text,#111);padding:10px 12px;font:inherit;font-size:16px}' +
    '#brit .brit-chk{display:flex;gap:10px;align-items:flex-start;font-weight:700;font-size:15px;min-height:44px;padding:6px 0}' +
    '#brit .brit-chk input{width:22px;height:22px;flex:none;margin-top:2px}' +
    '#brit .brit-col{display:flex;flex-direction:column;gap:10px}' +
    '#brit .brit-foot{position:sticky;bottom:-16px;margin:8px -18px -16px;padding:10px 18px 14px;background:var(--card-bg,#fff);border-top:2px solid var(--card-border,#ddd)}' +
    '#brit .brit-ok{font-weight:800;color:var(--success-text,#1f6b3a);min-height:20px;font-size:14px}' +
    '#brit .brit-btn:focus-visible,#brit .brit-x:focus-visible,#brit summary:focus-visible,#brit .brit-in:focus-visible{outline:3px solid var(--accent-strong,#0E2A5B);outline-offset:2px}' +
    '@media (max-height:640px){#brit .brit-card{padding:12px 14px}#brit h2{font-size:19px}#brit .brit-steps{gap:6px}}';
  function addCss() { if (document.getElementById('brit-css')) return; var s = document.createElement('style'); s.id = 'brit-css'; s.textContent = css; document.head.appendChild(s); }

  function noteText(o) {
    var v = get(o.key);
    return (o.name || 'Student') + ' - ' + (o.unit || '') + (o.stop ? ' - ' + o.stop : '') + ': my speaking recording' + (v.link ? ': ' + v.link : (v.phone ? ' (recorded another way, my teacher knows)' : ' (saved in the game, I will attach the file)'));
  }

  function close() {
    var el = document.getElementById('brit'); if (!el || !cur) return;
    var o = cur; cur = null;
    try { if (o.mount && o.mount.destroy) o.mount.destroy(); } catch (e) {}
    document.removeEventListener('keydown', onKey, true);
    el.remove();
    try { if (lastFocus && lastFocus.focus) lastFocus.focus(); } catch (e) {}
    try { if (o.onClose) o.onClose(done(o.key)); } catch (e) {}
  }
  function onKey(e) { if (e.key === 'Escape') { e.stopPropagation(); close(); } }

  function open(o) {
    addCss();
    var old = document.getElementById('brit'); if (old) old.remove();
    cur = o; lastFocus = document.activeElement;
    var v = get(o.key), canRec = !!(W.BohRecorder && W.BohRecorder.mount);
    var el = document.createElement('div'); el.id = 'brit';
    var say = (o.prompts && o.prompts.length) ? '<div class="brit-say">' + o.prompts.map(function (p) { return '<span>' + esc(p) + '</span>'; }).join('') + '</div>' : '';
    el.innerHTML =
      '<div class="brit-card" role="dialog" aria-modal="true" aria-labelledby="brit-h">' +
        '<div class="brit-top"><h2 id="brit-h">Record it</h2><button class="brit-x" data-a="x" aria-label="Close">&#10005;</button></div>' +
        '<ol class="brit-steps">' +
          '<li><span>Say your lines out loud first.' + say + '</span></li>' +
          '<li><span>Record yourself. Use the box below. If it does not work, use Vocaroo.</span></li>' +
          '<li><span>Turn it in: tap <b>Copy my note</b>, then paste it in <b>Google Classroom</b> for your teacher.</span></li>' +
        '</ol>' +
        (canRec ? '<div id="brit-rec"></div>' : '') +
        '<details id="brit-voc"' + (!canRec ? ' open' : '') + '><summary>' + (canRec ? 'Recording not working? Use Vocaroo instead' : 'Record on Vocaroo') + '</summary>' +
          '<div class="brit-col" style="margin-top:10px">' +
            '<a class="brit-btn" href="' + VOC + '" target="_blank" rel="noopener">Open vocaroo.com to record (new tab)</a>' +
            '<p class="brit-note">The address is <b>vocaroo.com</b>. If the button does not open, type that address in a new tab.</p>' +
            '<ol class="brit-steps"><li><span>Press the red button and say your lines.</span></li><li><span>Press <b>Save</b> (then <b>Done</b> if it asks).</span></li><li><span>Copy the link, come back to this tab, and paste it below.</span></li></ol>' +
            '<label class="brit-note" for="brit-link">Paste your Vocaroo link here</label>' +
            '<input id="brit-link" class="brit-in" type="url" inputmode="url" autocomplete="off" placeholder="It starts with voca.ro" value="' + esc(v.link) + '">' +
            '<p class="brit-note"><b>Last step, if nothing works:</b> tell your teacher, then tick this box.</p>' +
            '<label class="brit-chk"><input id="brit-phone" type="checkbox"' + (v.phone ? ' checked' : '') + '> I recorded it another way and my teacher knows</label>' +
          '</div></details>' +
        '<div class="brit-col brit-foot">' +
          '<button class="brit-btn ghost" id="brit-copy" data-a="copy">Copy my note for Classroom</button>' +
          '<div class="brit-ok" id="brit-msg" role="status"></div>' +
          '<button class="brit-btn" id="brit-done" data-a="done">Done</button>' +
          '<p class="brit-note">Your teacher listens to your recording. The game does not score how you sound.</p>' +
        '</div>' +
      '</div>';
    document.body.appendChild(el);
    document.addEventListener('keydown', onKey, true);

    function sync() {
      var ok = done(o.key), b = el.querySelector('#brit-done');
      b.setAttribute('aria-disabled', ok ? 'false' : 'true');
      b.textContent = ok ? 'Done' : 'Done (record, paste a link, or tick the box first)';
    }
    if (canRec) {
      o.mount = W.BohRecorder.mount(el.querySelector('#brit-rec'), { key: o.key, label: o.label || 'Parla', maxSec: 60, name: o.name,
        onChange: function () { sync(); },
        onEscalate: function () { var d = el.querySelector('#brit-voc'); if (d) d.open = true; } });
    }
    el.addEventListener('click', function (e) {
      if (e.target === el) return close();
      var a = e.target.closest ? e.target.closest('[data-a]') : null; if (!a) return;
      var act = a.getAttribute('data-a');
      if (act === 'x') return close();
      if (act === 'done') { if (a.getAttribute('aria-disabled') === 'true') { el.querySelector('#brit-msg').textContent = 'First record, paste a Vocaroo link, or tick the box.'; return; } return close(); }
      if (act === 'copy') {
        var t = noteText(o), msg = el.querySelector('#brit-msg');
        var fallback = function () { msg.innerHTML = 'Copy this note by hand: <br><b>' + esc(t) + '</b>'; };
        try { if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(t).then(function () { msg.textContent = 'Copied! Now paste it in Google Classroom.'; }, fallback); else fallback(); } catch (err) { fallback(); }
      }
    });
    el.querySelector('#brit-link').addEventListener('input', function (e) { var c = get(o.key); c.link = e.target.value.trim(); put(o.key, c); sync(); });
    el.querySelector('#brit-phone').addEventListener('change', function (e) { var c = get(o.key); c.phone = !!e.target.checked; put(o.key, c); sync(); });
    sync();
    var first = el.querySelector('.brit-x'); if (first) first.focus();
  }

  W.BohRecordIt = { open: open, done: done, close: close };
})(window);
