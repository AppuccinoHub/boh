/* Boh · collectibles beside Boh + sticky Back in the Boh-tique. One shared file, used identically by every level.
   Collectibles = things bought or won that cannot be worn (Il Garage, Pacco Boh, souvenirs, sport, viaggi, cultura, stickers, gadget...).
   They work like clothes: the locker has a Show / Put away button on each one, at most 2 are beside Boh at a time
   (a third pushes the oldest off), and a new purchase goes beside Boh right away. The choice is shared by every level.
   Created by Assunta Scotto, 2026. */
(function () {
  try {
    var KEY = 'boh_collect_v1';
    var SKIP_SEC = { aiuti: 1, vita: 1 };           // helpers and real-life tickets are never displayed
    var MAX = 2;
    var meta = null, lastInv = null, lastKey = '', toastT = 0;

    function rd() { try { return JSON.parse(localStorage.getItem(KEY) || 'null') || {}; } catch (e) { return {}; } }
    function wr(o) { try { localStorage.setItem(KEY, JSON.stringify(o)); } catch (e) {} }
    function build() {
      if (meta) return meta;
      var all = [].concat(window.ITEMS || [], window.BT_NEW || []), sec = window.BT_SEC_OF || {}, slot = window.SLOT || {};
      meta = {};
      all.forEach(function (it) {
        if (!it || !it.id || meta[it.id] || !it.img || it.consumable || it.soon || slot[it.id] || it.voucher || it.pack || it.trip) return;
        if (SKIP_SEC[sec[it.id] || it.sec || '']) return;
        meta[it.id] = it;
      });
      return meta;
    }
    function inv() { var s = (window.__game || {}).state || {}; return s.inventory || []; }
    function on() {                                  // ids beside Boh, oldest first, only ones still owned
      var o = rd().on || [], have = inv();
      return o.filter(function (id, i) { return build()[id] && have.indexOf(id) >= 0 && o.indexOf(id) === i; }).slice(-MAX);
    }
    function setOn(list) { var o = rd(); o.on = list.slice(-MAX); wr(o); lastKey = ''; }
    function turnOn(id) { var l = on().filter(function (x) { return x !== id; }); l.push(id); setOn(l); }
    function turnOff(id) { setOn(on().filter(function (x) { return x !== id; })); }

    window.BohCollect = {
      is: function (id) { return !!build()[id]; },
      on: function (id) { return on().indexOf(id) >= 0; },
      toggle: function (id) { if (!build()[id]) return; if (on().indexOf(id) >= 0) turnOff(id); else turnOn(id); tick(); },
      list: on
    };

    var css = document.createElement('style');
    css.textContent =
      '#boh-coll{position:absolute;left:0;top:0;width:0;height:0;z-index:3;pointer-events:none}' +
      '.bc-tile{position:absolute;width:44px;height:44px;border-radius:12px;background:var(--card-bg,#fff);border:2px solid var(--card-border,#ddd);display:flex;align-items:center;justify-content:center;box-shadow:0 2px 6px rgba(0,0,0,.12);pointer-events:auto}' +
      '.bc-tile img{width:34px;height:34px;object-fit:contain;pointer-events:none}' +
      '.bc-x{position:absolute;top:-12px;right:-12px;width:30px;height:30px;border-radius:50%;border:2px solid var(--card-bg,#fff);background:var(--text,#1c2a4a);color:var(--bg,#fff);font:700 15px/1 system-ui,sans-serif;display:flex;align-items:center;justify-content:center;padding:0;cursor:pointer}' +
      'body[data-bc-l] .home-boh{padding-left:66px !important}' +
      'body[data-bc-r] .home-boh .doll{margin-right:52px}' +
      '.bc-tabs{display:flex;gap:8px}' +
      '.bc-tab{flex:1;min-height:46px;padding:0 12px;border-radius:999px;border:2px solid var(--text,#1c2a4a);background:var(--card-bg,#fff);color:var(--text,#1c2a4a);font:800 15px system-ui,sans-serif;cursor:pointer}' +
      '.bc-tab.on{background:var(--text,#1c2a4a);color:var(--bg,#fff);cursor:default}' +
      '#bc-back{position:fixed;top:0;left:0;right:0;z-index:40;display:none;align-items:center;gap:8px;padding:calc(8px + env(safe-area-inset-top,0px)) 14px 8px;background:var(--bg,#f6f2ea);box-shadow:0 2px 8px rgba(0,0,0,.14)}' +
      '#bc-back.on{display:flex}' +
      '#bc-back .bc-bk{flex:none;min-height:46px;width:46px;border-radius:50%;border:2px solid var(--text,#1c2a4a);background:var(--card-bg,#fff);color:var(--text,#1c2a4a);font:800 18px system-ui,sans-serif;cursor:pointer;padding:0}' +
      '#bc-back .bc-tab{min-width:0}' +
      '#bc-toast{position:fixed;left:16px;right:16px;bottom:calc(16px + env(safe-area-inset-bottom,0px));z-index:45;display:none;align-items:center;gap:10px;padding:10px 14px;border-radius:14px;background:var(--success-bg,#e6f6ea);border:2px solid var(--success-text,#2e7d4f);color:var(--success-text,#14391f);font:700 14px system-ui,sans-serif}' +
      '#bc-toast.on{display:flex}#bc-toast img{width:36px;height:36px;object-fit:contain}#bc-toast span{flex:1}' +
      '#bc-toast button{min-height:44px;padding:0 10px;border:0;background:none;color:inherit;font:800 14px system-ui,sans-serif;text-decoration:underline;cursor:pointer}' +
      '@media (min-width:900px){#bc-toast{max-width:420px;left:50%;right:auto;transform:translateX(-50%)}}';
    document.head.appendChild(css);

    var layer = document.createElement('div'); layer.id = 'boh-coll'; layer.setAttribute('aria-live', 'polite');
    var bar = document.createElement('div'); bar.id = 'bc-back';
    bar.innerHTML = '<button type="button" class="bc-bk" aria-label="Back">\u2190</button><button type="button" class="bc-tab" data-go="shop">Boh-tique</button><button type="button" class="bc-tab" data-go="locker">Armadietto</button>';
    var toast = document.createElement('div'); toast.id = 'bc-toast'; toast.setAttribute('role', 'status');
    function mount() { document.body.appendChild(layer); document.body.appendChild(bar); document.body.appendChild(toast); }
    if (document.body) mount(); else document.addEventListener('DOMContentLoaded', mount);

    function refresh() { var g = window.__game; try { if (g && g.state && g.state.screen === 'locker') g.setState({}); } catch (e) {} tick(); }
    function say(id) {
      var it = build()[id]; if (!it) return;
      toast.innerHTML = '<img alt="" src="' + it.img + '"><span></span><button type="button">Put away</button>';
      toast.querySelector('span').textContent = (it.it || id) + ' is beside Boh now.';
      toast.querySelector('button').onclick = function () { turnOff(id); toast.classList.remove('on'); refresh(); };
      toast.classList.add('on'); clearTimeout(toastT); toastT = setTimeout(function () { toast.classList.remove('on'); }, 6000);
    }
    bar.querySelector('.bc-bk').onclick = function () {
      var bs = document.querySelectorAll('#app button'), i;
      for (i = 0; i < bs.length; i++) if (/^\W*Back\W*$/.test((bs[i].textContent || '').trim())) { bs[i].click(); return; }
      var g = window.__game; if (g && typeof g.backHome === 'function') g.backHome();
    };
    [].slice.call(bar.querySelectorAll('[data-go]')).forEach(function (b) {
      b.onclick = function () { var g = window.__game, to = b.getAttribute('data-go'); if (g && g.state && g.state.screen !== to && typeof g.goScreen === 'function') { g.goScreen(to); try { window.scrollTo(0, 0); } catch (e) {} } };
    });
    function barOn(s) {
      var on = (s.screen === 'shop' || s.screen === 'locker') && (window.pageYOffset || 0) > 140 && !s.overlay;
      bar.classList.toggle('on', on);
      if (on) [].slice.call(bar.querySelectorAll('[data-go]')).forEach(function (b) { var cur = b.getAttribute('data-go') === s.screen; b.classList.toggle('on', cur); b.setAttribute('aria-pressed', cur ? 'true' : 'false'); });
    }

    function place(list) {
      var card = document.querySelector('.home-boh'), doll = card && card.querySelector('.doll');
      var ok = list.length && card && doll && card.offsetParent !== null;
      var s = (window.__game || {}).state || {};
      if (!ok || s.screen !== 'home' || s.overlay) { layer.innerHTML = ''; lastKey = ''; document.body.removeAttribute('data-bc-l'); document.body.removeAttribute('data-bc-r'); return; }
      // newest on the right of Boh, the one before on the left
      var L = list.length > 1 ? list[list.length - 2] : null, R = list[list.length - 1];
      document.body.toggleAttribute('data-bc-l', !!L); document.body.toggleAttribute('data-bc-r', !!R);
      var cr = card.getBoundingClientRect(), dr = doll.getBoundingClientRect(), sx = window.pageXOffset, sy = window.pageYOffset, m = build();
      var key = list.join(',') + '|' + Math.round(cr.left) + ',' + Math.round(dr.left) + ',' + Math.round(dr.right) + ',' + Math.round(dr.bottom + sy);
      if (key === lastKey) return; lastKey = key;
      var want = {}; want[L] = 1; want[R] = 1;
      [].slice.call(layer.children).forEach(function (t) { if (!want[t.getAttribute('data-id')]) layer.removeChild(t); });   // keep tiles that stay, so a tap is never lost to a redraw
      function tile(id, x) {
        var it = m[id], t = layer.querySelector('[data-id="' + id + '"]');
        if (!t) {
          t = document.createElement('div'); t.className = 'bc-tile'; t.setAttribute('data-id', id);
          t.title = (it.it || id) + (it.en ? ' \u00b7 ' + it.en : '');
          var im = document.createElement('img'); im.alt = it.it || id; im.src = it.img; t.appendChild(im);
          var x2 = document.createElement('button'); x2.type = 'button'; x2.className = 'bc-x'; x2.textContent = '\u00d7';
          x2.setAttribute('aria-label', 'Put away ' + (it.it || id) + '. It stays in the armadietto.'); x2.onclick = function () { turnOff(id); tick(); };
          t.appendChild(x2); layer.appendChild(t);
        }
        t.style.left = Math.round(x + sx) + 'px'; t.style.top = Math.round(dr.bottom + sy - 80) + 'px';
      }
      if (L) tile(L, cr.left + 12);
      if (R) tile(R, dr.right + 4);
    }

    function tick() {
      var g = window.__game; if (!g || !g.state) return;
      var s = g.state, have = s.inventory || [];
      if (lastInv === null) lastInv = have.length;
      else if (have.length > lastInv) {              // something new was bought or won: it goes beside Boh right away
        var cand = have[have.length - 1];
        if (build()[cand] && (s.screen === 'shop' || s.screen === 'pacco')) { turnOn(cand); say(cand); }
        lastInv = have.length;
      } else if (have.length < lastInv) lastInv = have.length;
      place(on());
      barOn(s);
    }
    setInterval(tick, 400);
    window.addEventListener('scroll', function () { barOn(((window.__game || {}).state) || {}); }, { passive: true });
    window.addEventListener('resize', function () { lastKey = ''; });
  } catch (e) {}
})();
