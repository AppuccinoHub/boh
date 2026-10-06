/* Boh · clothing prices. One shared file, used identically by every level.
   Clothing that can be worn is 30% cheaper than the price in the level files (rounded to the nearest 5, never under 50 BC).
   Anything with the BOH name on it (BOH, Boh-ngiorno...) keeps its original price. Change CUT to move every level at once.
   Created by Assunta Scotto, 2026. */
(function () {
  try {
    var CUT = 0.30, FLOOR = 50, BRAND = /\bBOH\b|Boh-/i;
    var done = false;
    function apply() {
      if (done || !window.ITEMS || !window.SLOT) return false;
      var all = [].concat(window.ITEMS, window.BT_NEW || []);
      all.forEach(function (it) {
        if (!it || it._cut || it.source !== 'shop' || it.soon || !window.SLOT[it.id] || typeof it.price !== 'number') return;
        it._cut = 1;
        if (BRAND.test(it.it || '')) return;
        it.price = Math.max(FLOOR, Math.round(it.price * (1 - CUT) / 5) * 5);
      });
      done = true; return true;
    }
    var n = 0, t = setInterval(function () {
      if (apply() || ++n > 100) { clearInterval(t); try { var g = window.__game; if (done && g && g.setState) g.setState({}); } catch (e) {} }
    }, 50);
    apply();
  } catch (e) {}
})();
