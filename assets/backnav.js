/* Boh · browser Back button. One shared file, used identically by every level (Italiano 1-4 and AP).
   Boh is one page that swaps screens (home, shop, armadietto, lesson, practice...). The browser never heard about those swaps,
   so Back left Boh and landed on the home page. This file tells the browser about every screen change:
   - Back goes to the screen the student was on before (shop -> home, armadietto -> shop...).
   - A round, lesson or test is never re-opened by Back: Back from a screen that came after one goes to the home screen of the level.
   - Back first closes any pop-up that is open (the Tabella, Home menu, the recording routine, the map), then goes back.
   - Back on a level's home screen opens the all-levels page.
   Nothing here changes any screen's content or any saved data.
   Created by Assunta Scotto, 2026. Not for redistribution. */
(function () {
  try {
    if (window.BohBack) return;
    var TRANSIENT = { play: 1, lesson: 1, prova: 1, summary: 1, pacco: 1 };   // never opened again by Back
    var levels = ''; try { levels = new URL('../?levels=1', location.href).href; } catch (e) { levels = '../?levels=1'; }
    var g = null, ST = [], noPush = 0, skipPop = 0;
    function cur() { return (g && g.state && g.state.screen) || 'home'; }
    function leave() { try { location.replace(levels); } catch (e) { location.href = levels; } }
    function closeDom() {   // pop-ups that live outside the game state
      var q = document.querySelector('.bhm-ov [data-a="stay"]'); if (q) { q.click(); return true; }
      q = document.querySelector('.brt-ov .brt-x'); if (q) { q.click(); return true; }
      return false;
    }
    function closeState() {
      var s = g.state || {};
      if (s.overlay || s.tabOpen || s.gpOpen || s.tripSel || s.catOpen || s.lockOpen) {
        noPush++; try { g.setState({ overlay: null, tabOpen: false, gpOpen: false, tripSel: null, catOpen: false, lockOpen: false }); } finally { noPush--; }
        return true;
      }
      return false;
    }
    function onChange(after) {
      if (ST.length >= 2 && ST[ST.length - 2] === after) { ST.pop(); skipPop++; try { history.back(); } catch (e) { skipPop--; } return; }   // the game's own Back button: step back, do not grow the list
      if (ST[ST.length - 1] === after) return;
      ST.push(after);
      try { history.pushState({ boh: after }, ''); } catch (e) {}
    }
    function onPop(e) {
      if (skipPop > 0) { skipPop--; return; }
      if (!g) return;
      var st = e.state;
      if (!st || st.bohBase) { if (closeDom() || (g.state && closeState())) { skipPop++; try { history.forward(); } catch (e5) { skipPop--; } return; } leave(); return; }
      var target = st.boh || 'home';
      // a pop-up is open: Back only closes it, then we step forward again so we stay on this screen
      if (closeDom() || (g.state && (g.state.overlay || g.state.tabOpen || g.state.gpOpen || g.state.tripSel) && closeState())) { skipPop++; try { history.forward(); } catch (e2) { skipPop--; } return; }
      ST.pop();
      if (TRANSIENT[target]) { target = 'home'; try { history.replaceState({ boh: 'home' }, ''); } catch (e3) {} }
      if (ST[ST.length - 1] !== target) ST[ST.length - 1] = target;
      noPush++;
      try {
        if (cur() !== target) {
          if (target === 'home' && typeof g.backHome === 'function') g.backHome();
          else if (typeof g.goScreen === 'function') g.goScreen(target);
          else g.setState({ screen: target });
        }
        g.setState({ overlay: null, tabOpen: false });
      } finally { noPush--; }
      try { window.scrollTo(0, 0); } catch (e4) {}
    }
    function init() {
      var gg = window.__game;
      if (!gg || !gg.state || typeof gg.setState !== 'function' || gg.__bhb) return !!(gg && gg.__bhb);
      g = gg; g.__bhb = 1;
      try { history.replaceState({ bohBase: 1 }, ''); history.pushState({ boh: cur() }, ''); } catch (e) { return true; }
      ST = ['base', cur()];
      var orig = g.setState;
      g.setState = function (patch) {
        var before = cur(), r = orig.apply(this, arguments), after = cur();
        try { if (!noPush && after !== before) onChange(after); } catch (e) {}
        return r;
      };
      window.addEventListener('popstate', onPop);
      return true;
    }
    window.BohBack = { depth: function () { return ST.length; }, stack: function () { return ST.slice(); } };
    var n = 0, t = setInterval(function () { try { if (init() || ++n > 100) clearInterval(t); } catch (e) { clearInterval(t); } }, 150);
  } catch (e) {}
})();
