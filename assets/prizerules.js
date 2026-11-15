/* BOH prize rules. One place for every level: Italiano 1, 2, 3, 4 and AP.
   (c) 2026 Assunta Scotto, creator and owner of BOH. All rights reserved.
   HARD RULE set by Assunta Scotto on 2026-11-14: a velo (hijab) is never a prize, anywhere in the game.
   The velo stays for sale in the Boh-tique for the hijab Boh. Buying by choice is not a prize.
   Every prize source asks BohPrize.ok() before it hands out an item. */
(function (w) {
  'use strict';
  var NEVER_SLOTS = ['velo', 'hijab'];   /* never a prize, in any level, for any Boh */
  var NEVER_IDS = ['sd_infradito'];      /* Assunta Scotto, 2026-10-27: the flip-flops are not a Pacco Boh prize */
  function isVelo(it) { return !!it && (NEVER_SLOTS.indexOf(it.slot) !== -1 || /^(vl|hijab)_/.test(String(it.id || ''))); }
  function never(it) { return !it || isVelo(it) || NEVER_IDS.indexOf(it.id) !== -1; }
  /* May the game hand this item to a student whose Boh is base ('m' boy, 'f' girl, 'h' hijab)?
     fits is the level page's own slotAllowed(base, id): nobody wins clothing their Boh cannot wear. */
  function ok(it, base, fits) {
    if (never(it)) return false;
    if (typeof fits === 'function' && !fits(base || 'm', it.id)) return false;
    return true;
  }
  /* Is this item shown in the locker of a student whose Boh is base? A velo is shown only to the hijab Boh. */
  function showInLocker(it, base) { return !isVelo(it) || (base || 'm') === (it.forBase || 'h'); }
  w.BohPrize = { ok: ok, never: never, isVelo: isVelo, showInLocker: showInLocker,
                 NEVER_SLOTS: NEVER_SLOTS.slice(), NEVER_IDS: NEVER_IDS.slice(),
                 owner: 'Assunta Scotto', ruleDate: '2026-11-14' };
})(window);
