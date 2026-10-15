/* Boh · finish screen in two steps (boh-done-v1, 15 Oct 2026). Same file on every level.
   Step 1: the celebration (Prof, LEZIONE FATTA, the finish line highlighted, BC earned) and one Avanti button.
   Step 2: "Cosa fai adesso?" with Vai alla Prova first, Ripasso libero, the Ripassa tip and the bonus idiom.
   Only adds a data-step attribute, one button and one heading; the game's own buttons and save are untouched.
   The game redraws the finish screen now and then, so the step is put back in the same frame. */
(function (W, D) {
  var P = (W.location && W.location.pathname) || '';
  var LV = /italiano1/.test(P) ? 1 : /italiano2/.test(P) ? 2 : /italiano3/.test(P) ? 3 : /italiano4/.test(P) ? 4 : /\/ap\//.test(P) ? 5 : 0;
  if (!LV) return;
  var EN = LV <= 3;   /* English underneath on Italiano 1, 2 and 3 (Italiano 4 and AP: Italian only) */
  var seen = {};       /* unit -> step the student reached on this visit */
  function unit() { try { return W.BT_UNIT || (typeof BT_UNIT !== 'undefined' ? BT_UNIT : '') || 'u'; } catch (e) { return 'u'; } }
  function find() { var s = D.querySelector('.ls-done .ls-stamp.big'); return s ? s.parentNode : null; }
  function apply() {
    var box = find(); if (!box) return;
    var u = unit(), st = seen[u] || 1;
    if (box.getAttribute('data-step') !== String(st)) box.setAttribute('data-step', String(st));
    if (!box.querySelector('.bd-next')) {
      var b = D.createElement('button'); b.type = 'button'; b.className = 'bd-next';
      b.innerHTML = 'Avanti &rsaquo;' + (EN ? '<small>Next</small>' : '');
      b.addEventListener('click', function () {
        seen[unit()] = 2; apply(); W.scrollTo(0, 0);
        var f = find(), g = f && f.querySelector('.ls-actions .ls-btn:not([disabled]), .ls-actions button');
        if (g && g.focus) try { g.focus({ preventScroll: true }); } catch (x) {}
        try { if (W.BohFit && W.BohFit.run) W.BohFit.run(); } catch (x) {}
      });
      var stats = box.querySelector('.ls-stats');
      box.insertBefore(b, stats ? stats.nextSibling : box.querySelector('.ls-actions'));
    }
    if (!box.querySelector('.bd-now')) {
      var h = D.createElement('h2'); h.className = 'bd-now';
      h.innerHTML = 'Cosa fai adesso?' + (EN ? '<small>What do you want to do now?</small>' : '');
      box.insertBefore(h, box.firstChild);
    }
  }
  var raf = 0;
  function later() { if (!raf) raf = (W.requestAnimationFrame || setTimeout)(function () { raf = 0; apply(); }); }
  function go() { try { new MutationObserver(later).observe(D.body, { childList: true, subtree: true }); } catch (e) {} apply(); }
  setInterval(apply, 400);
  if (D.readyState === 'loading') D.addEventListener('DOMContentLoaded', go); else go();
  W.BohDone = { step: function () { return seen[unit()] || 1; }, reset: function () { seen = {}; apply(); } };
})(window, document);
