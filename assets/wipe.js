/* Boh wipe: removes EVERYTHING Boh has saved on this device, for every level: the shared Boh and its name,
   Boh Cashi, closet, badges, level progress, the Italiano 3 unit, and recorded takes.
   BohWipe.all()            -> does the wipe (no page change)
   BohWipe.wallet()         -> the biggest Boh Cashi balance found on this device
   BohWipe.confirm(opts)    -> full-screen "are you sure" with the Boh Cashi amount; opts.onDone() runs after the wipe */
(function () {
  'use strict';
  var KEEP = { boh_theme: 1 };                       // light/dark choice is not progress
  var RE = /^(boh|essereAvere|volereDovere)/;        // same family of keys the save file covers

  function wallet() {
    var best = 0;
    try {
      for (var i = 0; i < localStorage.length; i++) {
        var k = localStorage.key(i);
        if (!RE.test(k) || KEEP[k]) continue;
        var o = null; try { o = JSON.parse(localStorage.getItem(k)); } catch (e) {}
        if (o && typeof o === 'object' && typeof o.cashi === 'number' && o.cashi > best) best = o.cashi;
      }
    } catch (e) {}
    return best;
  }
  function all() {
    try {
      var kill = [];
      for (var i = 0; i < localStorage.length; i++) { var k = localStorage.key(i); if (RE.test(k) && !KEEP[k]) kill.push(k); }
      kill.forEach(function (k) { localStorage.removeItem(k); });
    } catch (e) {}
    try { sessionStorage.removeItem('boh_restored'); } catch (e) {}
    try { if (window.indexedDB) indexedDB.deleteDatabase('boh_rec_v1'); } catch (e) {}
  }
  function esc(t) { return String(t).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }

  function confirm(opts) {
    opts = opts || {};
    var n = wallet(), prev = document.activeElement;
    var ov = document.createElement('div');
    ov.setAttribute('role', 'dialog'); ov.setAttribute('aria-modal', 'true'); ov.setAttribute('aria-labelledby', 'bw-h');
    ov.style.cssText = 'position:fixed;inset:0;z-index:99999;background:rgba(20,12,16,.72);display:flex;align-items:center;justify-content:center;padding:16px;overflow:auto';
    var box = document.createElement('div');
    box.style.cssText = 'background:var(--surface,#fff);color:var(--ink,#2B2430);width:100%;max-width:440px;border-radius:24px;padding:22px 20px;display:flex;flex-direction:column;gap:12px;box-shadow:0 20px 60px rgba(0,0,0,.5);font-family:inherit';
    var btn = 'min-height:52px;border-radius:16px;font-family:inherit;font-weight:800;font-size:17px;line-height:1.1;cursor:pointer;padding:12px 16px;';
    box.innerHTML =
      '<h2 id="bw-h" style="margin:0;font-size:26px;line-height:1.1">Start over on this device?</h2>' +
      '<p style="margin:0;font-size:16px;line-height:1.4">This deletes <b>everything</b> saved here, in <b>every level</b>: your Boh and its name, your closet, your badges and all your progress.</p>' +
      '<p style="margin:0;font-size:18px;font-weight:800;color:#fff;background:#B3261E;border-radius:14px;padding:10px 14px">You will lose all your Boh Cashi' + (n ? ': ' + n.toLocaleString('it-IT') + ' Boh Cashi.' : '.') + '</p>' +
      '<p style="margin:0;font-size:15px;color:var(--muted,#6B5F68)">It cannot be undone. Want to keep your Boh? Save it first, then come back.</p>' +
      '<button type="button" id="bw-save" style="' + btn + 'border:0;background:var(--accent,#C1654F);color:#fff">Save my Boh first</button>' +
      '<label for="bw-in" style="font-weight:800;font-size:15px">Type RESET to unlock the delete button</label>' +
      '<input id="bw-in" type="text" autocomplete="off" autocapitalize="characters" spellcheck="false" placeholder="RESET" style="width:100%;padding:14px 16px;border-radius:14px;border:3px solid var(--line,#E3D8DC);background:var(--bg,#fff);color:inherit;font-family:inherit;font-weight:800;font-size:19px">' +
      '<button type="button" id="bw-go" disabled style="' + btn + 'border:0;background:#B3261E;color:#fff;opacity:.4">Delete everything</button>' +
      '<button type="button" id="bw-no" style="' + btn + 'border:2px solid var(--line,#E3D8DC);background:transparent;color:inherit">Cancel</button>';
    ov.appendChild(box); document.body.appendChild(ov);
    var inp = box.querySelector('#bw-in'), go = box.querySelector('#bw-go');
    function close() { if (ov.parentNode) ov.parentNode.removeChild(ov); document.removeEventListener('keydown', key, true); try { if (prev && prev.focus) prev.focus(); } catch (e) {} }
    function key(e) { if (e.key === 'Escape') { e.stopPropagation(); close(); } }
    document.addEventListener('keydown', key, true);
    inp.oninput = function () { var ok = inp.value.trim().toUpperCase() === 'RESET'; go.disabled = !ok; go.style.opacity = ok ? '1' : '.4'; };
    box.querySelector('#bw-no').onclick = close;
    box.querySelector('#bw-save').onclick = function () { close(); try { if (window.BohSave && BohSave.open) BohSave.open('save'); } catch (e) {} };
    go.onclick = function () {
      if (inp.value.trim().toUpperCase() !== 'RESET') return;
      all(); close();
      if (opts.onDone) opts.onDone(); else location.reload();
    };
    setTimeout(function () { try { inp.focus(); } catch (e) {} }, 50);
  }

  window.BohWipe = { all: all, wallet: wallet, confirm: confirm };
})();
