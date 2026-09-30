/* Boh look: draws a Boh with its outfit (copied from the Italiano 3 build by frontboh.py; do not edit by hand) */
(function (W) {
var ITEMS = [{"id": "occhiali_tondi", "slot": "face"}, {"id": "tazzina", "slot": "hand"}, {"id": "berretto", "slot": "head"}, {"id": "gelato", "slot": "hand"}, {"id": "pizza", "slot": "hand"}, {"id": "cappello_pescatore", "slot": "head"}, {"id": "felpa_verde", "slot": "top"}, {"id": "borsello", "slot": "back"}, {"id": "telefono", "slot": "hand"}, {"id": "borsa_colosseo", "slot": "hand"}, {"id": "cappello_gondoliere", "slot": "head"}, {"id": "piumino", "slot": "top"}, {"id": "casco_vespa", "slot": "head"}, {"id": "giacca_college", "slot": "top"}, {"id": "maglia_azzurra", "slot": "top"}, {"id": "maglia_hhw", "slot": "top"}, {"id": "hijab_verde", "slot": "hijab", "forBase": "h"}, {"id": "hijab_rosa", "slot": "hijab", "forBase": "h"}, {"id": "hijab_navy", "slot": "hijab", "forBase": "h"}, {"id": "hijab_sabbia", "slot": "hijab", "forBase": "h"}, {"id": "hijab_bordeaux", "slot": "hijab", "forBase": "h"}, {"id": "occhiali_firmati", "slot": "face"}, {"id": "corona_oro", "slot": "head"}, {"id": "mantello", "slot": "cape"}, {"id": "aura", "slot": "aura"}, {"id": "tee_tricolore", "slot": "top"}, {"id": "tee_cornicello", "slot": "top"}, {"id": "tee_stivale", "slot": "top"}, {"id": "tee_carnevale", "slot": "top"}, {"id": "tee_limoni", "slot": "top"}, {"id": "tee_cuore", "slot": "top"}, {"id": "tee_moka", "slot": "top"}, {"id": "tee_pasta", "slot": "top"}, {"id": "ls_verde", "slot": "top"}, {"id": "ls_stivale_oro", "slot": "top"}, {"id": "ls_cornicello", "slot": "top"}, {"id": "ls_limoni", "slot": "top"}, {"id": "tee_retro", "slot": "top"}, {"id": "tee_pizza", "slot": "top"}, {"id": "tee_gondola", "slot": "top"}, {"id": "tee_colosseo", "slot": "top"}, {"id": "tee_prof", "slot": "top"}, {"id": "tee_boh", "slot": "top"}, {"id": "tee_ihs", "slot": "top"}, {"id": "tee_raga", "slot": "top"}, {"id": "tee_ue", "slot": "top"}];
function itemById(id) { for (var i = 0; i < ITEMS.length; i++) if (ITEMS[i].id === id) return ITEMS[i]; return null; }
var SLOT = { maglia_hhw: 'top', cappellino: 'head', corona_alloro: 'head', cuffie: 'head',
  occhiali_sole: 'face', occhiali_sanremo: 'face', maschera_veneziana: 'face',
  collana_zio_peppe: 'neck', sciarpa_calcio: 'neck',
  felpa: 'top', maglia_calcio: 'top', giacca_jeans: 'top', giacca_nonna: 'top',
  sneakers_rosse: 'feet', braccialetto: 'wrist', zaino: 'back',
  pallone: 'hand', cucchiaio: 'hand', cornetto_rosso: 'hand', vespa_portachiavi: 'hand', calzino: 'hand' };
var SLOT_ORDER = ['top', 'back', 'neck', 'wrist', 'feet', 'face', 'head', 'hand'];
var UNDER_SLOTS = ['aura', 'cape'];
var BLOCKED_SLOTS = { h: ['top', 'neck', 'wrist'] };
var ALLOW_ON_H = ['maglia_hhw'];
function slotAllowed(base, id) { if (base === 'h' && ALLOW_ON_H.indexOf(id) !== -1) return true;
  var sl = SLOT[id]; var bl = BLOCKED_SLOTS[base] || []; var it = itemById(id); if (it && it.forBase && it.forBase !== base) return false; return !sl || bl.indexOf(sl) === -1; }
var WEAR_ORDER = ["cappellino", "corona_alloro", "cuffie", "occhiali_sole", "occhiali_sanremo", "maschera_veneziana", "collana_zio_peppe", "sciarpa_calcio", "felpa", "maglia_hhw", "maglia_calcio", "giacca_jeans", "giacca_nonna", "sneakers_rosse", "braccialetto", "zaino", "zaino_under", "pallone", "cucchiaio", "cornetto_rosso", "vespa_portachiavi", "calzino", "berretto", "cappello_pescatore", "occhiali_tondi", "piumino", "giacca_college", "borsello", "telefono", "felpa_verde", "cappello_gondoliere", "maglia_azzurra", "casco_vespa", "gelato", "pizza", "tazzina", "borsa_colosseo", "corona_oro", "occhiali_firmati", "mantello_under", "mantello", "aura"]; // eslint-disable-line
function baseIdx(base) { return base === 'h' ? 2 : (base === 'f' ? 1 : 0); }
function wearFrame(base, key) { if (typeof BT_TEES !== 'undefined' && BT_TEES[key]) return 'dl tee-' + key + '-' + base; var i = WEAR_ORDER.indexOf(key); return i < 0 ? '' : 'dl w' + (baseIdx(base) * WEAR_ORDER.length + i); }
function dollLayersFor(base, eq) {
  base = (base === 'f' || base === 'h') ? base : 'm'; eq = eq || {};
  var out = [];
  if (eq.aura) out.push({ cls: wearFrame(base, 'aura') });
  if (eq.cape) out.push({ cls: wearFrame(base, 'mantello_under') });
  if (eq.back === 'zaino') out.push({ cls: wearFrame(base, 'zaino_under') });
  var _hd = eq.head && slotAllowed(base, eq.head) ? (HAIR_CUT[base] || {})[eq.head] : 0;
  out.push({ cls: 'dl body ' + base + (_hd ? ' cut' + _hd : '') });
  SLOT_ORDER.forEach(function (sl) { if (eq[sl] && SLOT[eq[sl]] && slotAllowed(base, eq[sl])) out.push({ cls: wearFrame(base, eq[sl]) }); });
  if (eq.cape) out.push({ cls: wearFrame(base, 'mantello') });
  return out;
}

for (var _i = 0; _i < ITEMS.length; _i++) if (ITEMS[_i].slot) SLOT[ITEMS[_i].id] = ITEMS[_i].slot;
var HAIR_CUT = {"m": {"cappellino": 94, "berretto": 96, "cappello_pescatore": 104, "cappello_gondoliere": 96, "casco_vespa": 110}, "f": {"cappellino": 112, "berretto": 114, "cappello_pescatore": 122, "cappello_gondoliere": 114, "casco_vespa": 128}, "h": {}};
var SKINS = [['light', '#F2D0B8'], ['fair', '#E8B896'], ['medium', '#D9956A'], ['olive', '#C08A5C'], ['brown', '#8E5A38'], ['deep', '#5A3522']];
var HAIRS = [['dark', '#4A2A1C', 'dark brown'], ['black', '#1C1719', 'black'], ['brown', '#6E4127', 'brown'], ['auburn', '#8A3A1C', 'auburn'], ['blonde', '#B98E4E', 'blonde']];
var BLOCKED_NAMES = ['fuck', 'shit', 'bitch', 'dick', 'cazzo', 'merda', 'stronz', 'puttan', 'vaffa', 'troia', 'porn', 'sex', 'nigg', 'fag', 'hitler', 'nazi', 'cunt', 'slut', 'whore', 'culo', 'figa'];
var BT_TEES = {}; ["tee_tricolore", "tee_cornicello", "tee_stivale", "tee_carnevale", "tee_limoni", "tee_cuore", "tee_moka", "tee_pasta", "tee_retro", "tee_pizza", "tee_gondola", "tee_colosseo", "tee_prof", "tee_boh", "tee_ihs", "tee_raga", "tee_ue"].forEach(function (t) { BT_TEES[t] = true; ALLOW_ON_H.push(t); });
function cleanName(raw) { return (raw || '').replace(/[^A-Za-z0-9\u00C0-\u017F ]/g, '').replace(/\s+/g, ' ').trim().slice(0, 16); }
function lookCls(p) { var b = p.bohBase, eq = p.equipped || {};
  return (eq.hijab && b === 'h' ? 'hj-' + eq.hijab.replace('hijab_', '') + ' ' : '') + 'sk-' + (p.bohSkin || (b === 'h' ? 'olive' : 'medium')) + ' hr-' + (p.bohHair || 'dark'); }
function dollHTML(p, size) { return '<div class="bohlook ' + lookCls(p) + '" style="display:contents"><div class="doll ' + (size || 'dM') + ' idle">' + dollLayersFor(p.bohBase, p.equipped).map(function (l) { return '<div class="' + l.cls + '"></div>'; }).join('') + '</div></div>'; }
W.BohLook = { dollHTML: dollHTML, lookCls: lookCls, slotAllowed: slotAllowed, SKINS: SKINS, HAIRS: HAIRS, BLOCKED_NAMES: BLOCKED_NAMES, cleanName: cleanName };
})(window);
