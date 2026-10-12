/* Boh · phone play screen helper. ONE file for every level.
   Marks the question word with data-pl = s (short word), m (short line) or l (long sentence),
   so bohphone.css can show a single word BIG and a long sentence smaller. Changes no answers, scores or saved data.
   Created by Assunta Scotto, 2026. Not for redistribution. */
(function (W, D) {
  'use strict';
  if (W.__bohPhone) return;
  W.__bohPhone = true;
  var pend = 0;
  function mark() {
    pend = 0;
    var els = D.querySelectorAll('.play-prompt'), i, el, n, v;
    for (i = 0; i < els.length; i++) {
      el = els[i]; n = (el.textContent || '').replace(/\s+/g, ' ').trim().length;
      v = n <= 16 ? 's' : n <= 40 ? 'm' : 'l';
      if (el.getAttribute('data-pl') !== v) el.setAttribute('data-pl', v);
    }
  }
  function later() { if (!pend) pend = W.requestAnimationFrame ? W.requestAnimationFrame(mark) : setTimeout(mark, 50); }
  function go() {
    var app = D.getElementById('app') || D.body;
    try { new MutationObserver(later).observe(app, { childList: true, subtree: true, characterData: true }); } catch (e) {}
    mark();
  }
  if (D.readyState === 'loading') D.addEventListener('DOMContentLoaded', go); else go();
})(window, document);
