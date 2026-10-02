/* Boh · front page: the student's own Boh is the front door. One Boh, one wallet, one save for every level.
   New student: make the Boh here, once. Returning student: see the Boh, its outfit and its Boh Cashi.
   The shared Boh lives in localStorage 'boh_profile_v1' (the levels read and write the same record). */
(function () {
  var KEY = 'boh_profile_v1', L = window.BohLook;
  var doll = document.getElementById('meDoll'), copy = document.getElementById('meCopy');
  if (!doll || !copy || !L) return;
  function get() { try { var p = JSON.parse(localStorage.getItem(KEY) || 'null'); return p && p.bohBase && p.bohName ? p : null; } catch (e) { return null; } }
  function put(p) { try { localStorage.setItem(KEY, JSON.stringify(p)); } catch (e) {} }
  function esc(t) { return String(t).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function fmt(n) { return (n || 0).toLocaleString('it-IT'); }
  var draft = null;

  function home(p) {
    doll.innerHTML = L.dollHTML(p, 'dM');
    var bc = typeof p.cashi === 'number' ? p.cashi : 0;
    copy.innerHTML =
      '<span class="eyebrow">Il tuo Boh</span>' +
      '<h2>Ciao, ' + esc(p.bohName) + '!</h2>' +
      '<span class="wallet"><img src="assets/bc-white.svg" alt="">' + fmt(bc) + ' <small>Boh Cashi</small></span>' +
      '<p>This is your Boh in <b>every level</b>. Italiano 2 and 3 share one wallet and one closet; Italiano 1 and 4 join them soon.</p>' +
      '<div class="saverow"><button type="button" class="saveb" data-bohsave="save">&#128190; Salva il mio Boh</button>' +
      '<button type="button" class="saveb alt" data-bohsave="load">&#128194; Carica il mio Boh</button></div>' +
      '<p class="small">Changing Chromebooks? Salva il mio Boh makes one file. Put it in your Google Drive, then Carica il mio Boh on the new Chromebook.</p>' +
      '<div><button type="button" class="linkb" id="meEdit">Cambia il look</button> <button type="button" class="linkb" id="meWipe">Not me? Start over</button></div>';
    document.getElementById('meEdit').onclick = function () { make(p); };
    document.getElementById('meWipe').onclick = function () { if (window.BohWipe) BohWipe.confirm(); };
  }

  function make(p) {
    draft = draft || { base: p ? p.bohBase : 'm', skin: p ? (p.bohSkin || 'medium') : 'medium', hair: p ? (p.bohHair || 'dark') : 'dark', name: p ? p.bohName : '', skinTouched: !!p };
    var d = draft, isF = d.base === 'f' || d.base === 'h';
    doll.innerHTML = L.dollHTML({ bohBase: d.base, bohSkin: d.skin, bohHair: d.hair, equipped: p ? p.equipped : {} }, 'dM');
    var sw = function (list, cur, kind) {
      return list.map(function (x) { return '<button type="button" class="sw" data-' + kind + '="' + x[0] + '" aria-pressed="' + (x[0] === cur) + '" aria-label="' + (x[2] || x[0]) + '" style="background:' + x[1] + '"></button>'; }).join('');
    };
    copy.innerHTML =
      '<span class="eyebrow">' + (p ? 'Cambia il look' : 'Benvenuto!') + '</span>' +
      '<h2>' + (p ? 'Il tuo Boh' : 'Crea il tuo Boh') + '</h2>' +
      (p ? '' : '<p>Make it once. Your Boh plays <b>every level</b>: Italiano 1, 2, 3, 4 and AP.</p>') +
      '<div class="mk">' +
      '<div class="row"><button type="button" class="pick" data-base="m" aria-pressed="' + (d.base === 'm') + '"><span class="bohlook sk-' + d.skin + ' hr-' + d.hair + '" style="display:contents"><span class="bbs m"></span></span>Boh &#9794;</button>' +
      '<button type="button" class="pick" data-base="f" aria-pressed="' + isF + '"><span class="bohlook sk-' + d.skin + ' hr-' + d.hair + '" style="display:contents"><span class="bbs ' + (d.base === 'h' ? 'h' : 'f') + '"></span></span>Boh &#9792;</button></div>' +
      (isF ? '<div class="row"><span class="lab">Hijab</span><button type="button" class="pill" data-hij="0" aria-pressed="' + (d.base === 'f') + '">No</button><button type="button" class="pill" data-hij="1" aria-pressed="' + (d.base === 'h') + '">S&igrave;</button></div>' : '') +
      '<div class="row"><span class="lab">Pelle</span>' + sw(L.SKINS, d.skin, 'skin') + '</div>' +
      (d.base === 'h' ? '' : '<div class="row"><span class="lab">Capelli</span>' + sw(L.HAIRS, d.hair, 'hair') + '</div>') +
      '<div class="row"><input class="name-in" id="meName" maxlength="16" autocomplete="off" placeholder="Il nome del tuo Boh" aria-label="Il nome del tuo Boh" value="' + esc(d.name || '') + '"></div>' +
      '<div class="err" id="meErr" role="alert"></div>' +
      '<div class="saverow"><button type="button" class="saveb" id="meGo">' + (p ? 'Salva il look' : 'Ecco il mio Boh!') + '</button>' +
      (p ? '<button type="button" class="linkb" id="meBack">Annulla</button>' : '<button type="button" class="saveb alt" data-bohsave="load">&#128194; Ho gi&agrave; un Boh</button>') + '</div>' +
      (p ? '' : '<p class="small">Already made your Boh on another Chromebook? Tap <b>Ho gi&agrave; un Boh</b> and choose your save file.</p>') +
      '</div>';
    var redo = function () { d.name = document.getElementById('meName').value; make(p); };
    copy.querySelectorAll('[data-base]').forEach(function (b) { b.onclick = function () { d.base = b.getAttribute('data-base') === 'm' ? 'm' : (d.base === 'h' ? 'h' : 'f'); redo(); }; });
    copy.querySelectorAll('[data-hij]').forEach(function (b) { b.onclick = function () { var on = b.getAttribute('data-hij') === '1'; d.base = on ? 'h' : 'f'; if (on && !d.skinTouched) d.skin = 'olive'; redo(); }; });
    copy.querySelectorAll('[data-skin]').forEach(function (b) { b.onclick = function () { d.skin = b.getAttribute('data-skin'); d.skinTouched = true; redo(); }; });
    copy.querySelectorAll('[data-hair]').forEach(function (b) { b.onclick = function () { d.hair = b.getAttribute('data-hair'); redo(); }; });
    var back = document.getElementById('meBack'); if (back) back.onclick = function () { draft = null; home(p); };
    var inp = document.getElementById('meName');
    inp.oninput = function () { d.name = inp.value; };
    inp.onkeydown = function (e) { if (e.key === 'Enter') document.getElementById('meGo').click(); };
    document.getElementById('meGo').onclick = function () {
      var name = L.cleanName(inp.value), low = name.toLowerCase().replace(/\s/g, ''), err = document.getElementById('meErr');
      if (!name) { err.textContent = 'Give your Boh a name first.'; inp.focus(); return; }
      for (var i = 0; i < L.BLOCKED_NAMES.length; i++) if (low.indexOf(L.BLOCKED_NAMES[i]) !== -1) { err.textContent = 'Nice try. Pick another name.'; return; }
      var q = get() || {}, eq = q.equipped || {}, keep = {};
      for (var sl in eq) if (L.slotAllowed(d.base, eq[sl])) keep[sl] = eq[sl];
      q.bohBase = d.base; q.bohSkin = d.skin; q.bohHair = d.hair; q.bohName = name; q.equipped = keep; q._t = Date.now();
      put(q); draft = null; home(q);
      try { window.scrollTo({ top: 0, behavior: 'smooth' }); } catch (e) {}
    };
    if (!p && !d.name) setTimeout(function () { try { inp.focus({ preventScroll: true }); } catch (e) {} }, 50);
  }

  var p = get();
  if (p) home(p); else make(null);
})();
