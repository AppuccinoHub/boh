/* Boh · HOME KIT: the weekly streak, the daily goal and the "Prossimo Pacco" bar. ONE file, used identically by Italiano 1, 2, 3, 4 and AP.
   No level has its own version. To change a rule, change it here:
     WEEK_TARGET  = 3   days a week with a finished stop keep the streak alive (Assunta, 14 Oct 2026)
     PER_PACK     = 5   first-time finished stops (Parla con Prof counts as one) earn the next Pacco
     PACKS_PER_DAY= 1   at most one Pacco a day from this rule; the bar waits ("Pacco domani") if you finish stops faster
   What counts as a stop: the stop is finished for the FIRST time (a new number in the unit's lesson.done), or Parla con Prof is marked ready.
   Re-plays, Riprova and Ripara never count. La Prova is not a stop and its 85% pass is not touched by this file.
   What counts as an active day (streak and goal): a first-time stop, Parla ready, or the game's own lastPlay (a finished round) is today.
   Stops that were already finished before this file first ran are remembered but do NOT count toward a pack.
   This file only READS each level's saved state (localStorage) and writes its own key, boh_homekit_v1. It changes nothing in the game's save.
   The one thing it does to the game: when a Pacco is earned it adds 1 to the game's own paccoMini, then the existing Pacco screen opens it.
   Created by Assunta Scotto, 2026. Not for redistribution. */
(function (W, D) {
  'use strict';
  var m = /\/(italiano[1-4]|ap)\//.exec(W.location.pathname);
  if (W.BohHomeKit || !m) return;
  var LV = m[1];
  var SAVE = { italiano1: 'bohItaliano1_v2', italiano2: 'bohItaliano2_v2', italiano3: 'bohItaliano3_v2', italiano4: 'bohItaliano4_v2', ap: 'bohAP_v2' }[LV];
  var KEY = 'boh_homekit_v1', WEEK_TARGET = 3, PER_PACK = 5, PACKS_PER_DAY = 1, KEEP_DAYS = 140;
  var node = null, sig = '', timer = null;

  function jget(k) { try { return JSON.parse(localStorage.getItem(k) || 'null'); } catch (e) { return null; } }
  function jset(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
  function pad(n) { return (n < 10 ? '0' : '') + n; }
  function ymd(d) { d = d || new Date(); return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()); }
  function parse(s) { var p = s.split('-'); return new Date(+p[0], +p[1] - 1, +p[2]); }
  function monday(d) { var x = new Date(d.getFullYear(), d.getMonth(), d.getDate()); var wd = (x.getDay() + 6) % 7; x.setDate(x.getDate() - wd); return x; }
  function addDays(d, n) { var x = new Date(d.getFullYear(), d.getMonth(), d.getDate()); x.setDate(x.getDate() + n); return x; }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }

  /* ---------- the kit's own saved data (one record per level) ---------- */
  function load() {
    var all = jget(KEY) || {}, r = all[LV];
    if (!r || r.v !== 1) r = { v: 1, seeded: false, seen: {}, parla: {}, n: 0, packs: 0, packDay: '', days: [], lastPlay: '' };
    return { all: all, r: r };
  }
  function save(o) { o.all[LV] = o.r; jset(KEY, o.all); }

  /* ---------- reading the game's saved state ---------- */
  function lessons() {   /* { unit: [done stop numbers] } from the current lesson and from every other unit's saved lesson */
    var sv = jget(SAVE) || {}, out = {}, units = sv.units || {};
    Object.keys(units).forEach(function (u) { var L = units[u] && units[u].lesson; if (L && L.v === 1 && L.done) out[u] = L.done.slice(); });
    if (sv.unit && sv.lesson && sv.lesson.v === 1 && sv.lesson.done) out[sv.unit] = sv.lesson.done.slice();
    return { lessons: out, lastPlay: sv.lastPlay || '', sv: sv };
  }
  function parlaReady() {   /* { unit: true } for every unit of this level whose Parla con Prof is ready */
    var p = jget('boh_parla_v1') || {}, lv = p[LV] || {}, out = {};
    Object.keys(lv).forEach(function (u) { if (lv[u] && lv[u].ready) out[u] = true; });
    return out;
  }

  /* ---------- the one rule: count first-time stops, days, packs ---------- */
  function sync(game) {
    var o = load(), r = o.r, now = lessons(), pr = parlaReady(), today = ymd(), gained = 0, changed = false;
    var first = !r.seeded;
    Object.keys(now.lessons).forEach(function (u) {
      var seen = r.seen[u] || [];
      now.lessons[u].forEach(function (k) { if (seen.indexOf(k) === -1) { seen.push(k); if (!first) gained++; changed = true; } });
      r.seen[u] = seen;
    });
    Object.keys(pr).forEach(function (u) { if (!r.parla[u]) { r.parla[u] = true; if (!first) gained++; changed = true; } });
    if (first) { r.seeded = true; r.lastPlay = now.lastPlay; changed = true; }
    var active = gained > 0;
    if (now.lastPlay && now.lastPlay !== r.lastPlay) { r.lastPlay = now.lastPlay; if (now.lastPlay === today) active = true; changed = true; }
    if (active && r.days.indexOf(today) === -1) { r.days.push(today); r.days.sort(); if (r.days.length > KEEP_DAYS) r.days = r.days.slice(-KEEP_DAYS); changed = true; }
    if (gained) { r.n += gained; changed = true; }
    if (r.n >= PER_PACK && r.packDay !== today && game && game.setState && game.state) {   /* a Pacco is earned: hand it to the game's own Pacco screen */
      try { game.setState({ paccoMini: (game.state.paccoMini || 0) + 1 }); r.n -= PER_PACK; r.packs++; r.packDay = today; changed = true; } catch (e) {}
    }
    if (changed) save(o);
    return r;
  }

  /* ---------- the weekly streak ---------- */
  function weekDays(r, monStr) { var n = 0, mon = parse(monStr); for (var i = 0; i < 7; i++) if (r.days.indexOf(ymd(addDays(mon, i))) !== -1) n++; return n; }
  function streak(r) {   /* weeks in a row with WEEK_TARGET active days; this week counts once it has met the target and does not break the streak until it ends */
    var mon = monday(new Date()), cur = weekDays(r, ymd(mon)), w = cur >= WEEK_TARGET ? 0 : 1, n = 0;
    for (; w < 60; w++) { if (weekDays(r, ymd(addDays(mon, -7 * w))) >= WEEK_TARGET) n++; else break; }
    return { weeks: n, cur: cur };
  }

  /* ---------- drawing ---------- */
  var CSS =
    '.hk{display:flex;flex-direction:column;gap:10px;margin-top:12px}' +
    '.hk-card{background:var(--card-bg,#fff);border:2px solid var(--card-border,#D9D0BF);border-radius:18px;padding:10px 12px;color:var(--text,#0E2A5B)}' +
    '.hk-row{display:flex;align-items:center;gap:10px}' +
    '.hk-fire{display:inline-flex;align-items:center;gap:6px;border:2px solid #E8590C;border-radius:999px;padding:3px 12px;font:800 15px/1.2 Manrope,system-ui,sans-serif;color:#E8590C;white-space:nowrap}' +
    '[data-theme="dark"] .hk-fire{color:#FFB27A;border-color:#FFB27A}' +
    '.hk-wk{flex:1;font:800 14px/1.25 Manrope,system-ui,sans-serif}.hk-wk small{display:block;font-weight:700;font-size:12px;color:var(--text-muted,#4A5878)}' +
    '.hk-week{display:flex;gap:6px;justify-content:space-between;margin-top:8px}' +
    '.hk-d{flex:1;text-align:center;font:800 11px Manrope,system-ui,sans-serif;color:var(--text-muted,#4A5878)}' +
    '.hk-d i{display:grid;place-items:center;width:100%;max-width:34px;height:34px;margin:3px auto 0;border-radius:50%;border:2px solid var(--card-border,#D9D0BF);background:var(--card-bg,#fff);font-style:normal;font-size:15px}' +
    '.hk-d.on i{background:#FFE7D6;border-color:#E8590C}[data-theme="dark"] .hk-d.on i{background:#4A2A14;border-color:#FFB27A}' +
    '.hk-d.now i{box-shadow:0 0 0 3px rgba(26,92,223,.35);border-color:var(--tap,#1A5CDF)}' +
    '.hk-goal{display:flex;align-items:center;gap:10px;font:700 14px/1.3 Manrope,system-ui,sans-serif}' +
    '.hk-ring{width:34px;height:34px;flex:0 0 34px;border-radius:50%;display:grid;place-items:center;font-size:17px;font-weight:800;background:conic-gradient(#2F7A2A 0 0%,var(--card-border,#E3DFD5) 0)}' +
    '.hk-ring.done{background:#2F7A2A;color:#fff}' +
    '.hk-ring i{width:22px;height:22px;border-radius:50%;background:var(--card-bg,#fff);display:block;font-style:normal;line-height:22px;font-size:14px}' +
    '.hk-ring.done i{background:transparent;color:#fff}' +
    '.hk-pack{border-color:#B7791F}' +
    '.hk-pack b{display:block;font:800 15px/1.25 Manrope,system-ui,sans-serif}.hk-pack small{display:block;font:700 12.5px/1.3 Manrope,system-ui,sans-serif;color:var(--text-muted,#4A5878)}' +
    '.hk-bar{display:flex;gap:4px;margin-top:7px}.hk-bar i{flex:1;height:12px;border-radius:99px;background:var(--card-border,#E3DFD5)}.hk-bar i.f{background:#B7791F}' +
    '.hk-open{all:unset;box-sizing:border-box;cursor:pointer;display:flex;align-items:center;justify-content:center;min-height:44px;margin-top:8px;padding:8px 16px;border-radius:14px;background:var(--tap,#1A5CDF);color:#fff;font:800 16px/1.2 "Bricolage Grotesque",system-ui,sans-serif;width:100%}' +
    '.hk-open:focus-visible{outline:3px solid var(--accent-strong,#1A5CDF);outline-offset:3px}' +
    /* the game's older "school days" flame is replaced by the weekly streak above, so the old chip and its notes are hidden, not deleted */
    '.hud-chip[title^="La Fiamma"],.bt-fiamma{display:none!important}' +
    /* the calm home (14 Oct 2026): these stay in the page, so the game keeps working, but only "I miei progressi" shows them */
    '.home-grid .unit-tabs,.home-grid .bt-hud,.home-grid .home-tiles~div,.home-grid .mode-list{display:none!important}' +
    'body:has(.home-credit) .wmark{display:none}' +
    '.home-grid{padding-bottom:84px}' +
    '.hk-tiles{display:contents}' +
    '.hk-tile{all:unset;box-sizing:border-box;cursor:pointer;min-width:0;min-height:76px;display:flex;align-items:center;gap:10px;padding:12px 14px;border-radius:16px;background:var(--card-bg,#fff);border:2px solid var(--card-border,#D9D0BF);color:var(--text,#0E2A5B)}' +
    '.hk-tile:focus-visible,.hk-unit:focus-visible,.hk-x:focus-visible{outline:3px solid var(--accent-strong,#1A5CDF);outline-offset:3px}' +
    '.hk-tile-ic{font-size:26px;line-height:1}' +
    '.hk-tile-tx{display:flex;flex-direction:column;min-width:0}.hk-tile-tx b{font:800 16px/1.2 "Bricolage Grotesque",Manrope,system-ui,sans-serif}.hk-tile-tx small{font:700 12px/1.3 Manrope,system-ui,sans-serif;color:var(--text-muted,#4A5878)}' +
    '.hk-sheet{display:none;position:fixed;inset:0;z-index:60;overflow-y:auto;background:var(--bg,#F5EFE6);color:var(--text,#0E2A5B)}' +
    '.hk-sh-in{max-width:480px;margin:0 auto;padding:18px 20px 48px;box-sizing:border-box;display:flex;flex-direction:column;gap:12px}' +
    '.hk-sh-top{display:flex;align-items:center;justify-content:space-between;gap:12px}.hk-sh-top h2{margin:0;font:800 26px/1.15 "Bricolage Grotesque",system-ui,sans-serif}' +
    '.hk-x{all:unset;cursor:pointer;width:44px;height:44px;display:grid;place-items:center;border-radius:12px;background:var(--card-bg,#fff);border:2px solid var(--card-border,#D9D0BF);font-size:18px;font-weight:800}' +
    '.hk-big{display:flex;flex-direction:column;align-items:center;gap:2px;padding:16px;border-radius:18px;background:var(--card-bg,#fff);border:2px solid #E8590C;text-align:center}' +
    '.hk-big span{font:800 40px/1.1 "Bricolage Grotesque",system-ui,sans-serif;color:#C2410C}.hk-big small{font:700 13px/1.35 Manrope,system-ui,sans-serif;color:var(--text-muted,#4A5878)}' +
    '.hk-sheet .hk{margin-top:0}.hk-sheet .hk-fire{display:none}' +
    '.hk-h3{margin:10px 0 0;font:800 20px/1.2 "Bricolage Grotesque",system-ui,sans-serif}.hk-h3 small{font:700 13px Manrope,system-ui,sans-serif;color:var(--text-muted,#4A5878)}' +
    '.hk-units{display:flex;flex-direction:column;gap:8px}' +
    '.hk-unit{all:unset;box-sizing:border-box;cursor:pointer;display:flex;flex-direction:column;gap:2px;min-height:56px;padding:10px 14px;border-radius:14px;background:var(--card-bg,#fff);border:2px solid var(--card-border,#D9D0BF);color:var(--text,#0E2A5B)}' +
    '.hk-unit b{font:800 16px/1.25 Manrope,system-ui,sans-serif}.hk-unit small{font:800 11.5px/1.3 Manrope,system-ui,sans-serif;letter-spacing:.06em;color:var(--text-muted,#4A5878)}' +
    '.hk-unit.on{border-color:var(--tap,#1A5CDF);box-shadow:inset 0 0 0 1px var(--tap,#1A5CDF)}';

  function st() { var s = D.createElement('style'); s.setAttribute('data-hk', '1'); s.textContent = CSS; (D.head || D.documentElement).appendChild(s); }

  function html(r, game) {
    var sk = streak(r), today = ymd(), mon = monday(new Date()), names = ['L', 'M', 'M', 'G', 'V', 'S', 'D'], d = '';
    for (var i = 0; i < 7; i++) {
      var ds = ymd(addDays(mon, i)), on = r.days.indexOf(ds) !== -1;
      d += '<div class="hk-d' + (on ? ' on' : '') + (ds === today ? ' now' : '') + '">' + names[i] + '<i>' + (on ? '🔥' : '') + '</i></div>';
    }
    var doneToday = r.days.indexOf(today) !== -1;
    var pend = 0; try { pend = game && game.pending ? (game.pending().centoni || 0) : 0; } catch (e) {}
    var n = Math.min(r.n, PER_PACK), full = r.n >= PER_PACK, wait = full && r.packDay === today, bar = '';
    for (var j = 0; j < PER_PACK; j++) bar += '<i class="' + (j < n ? 'f' : '') + '"></i>';
    var left = Math.max(0, PER_PACK - r.n);
    var packTxt = wait ? 'Pacco domani!' : left === 1 ? '1 tappa e apri il Pacco!' : left + ' tappe al Pacco';
    var packEn = wait ? 'Tomorrow: you earned today’s pack already.' : left === 1 ? '1 stop to your pack' : left + ' stops to your pack';
    var weekTxt = sk.cur >= WEEK_TARGET ? 'Obiettivo della settimana raggiunto!' : sk.cur + ' di ' + WEEK_TARGET + ' giorni questa settimana';
    var weekEn = sk.cur >= WEEK_TARGET ? 'Weekly goal reached!' : sk.cur + ' of ' + WEEK_TARGET + ' days this week';
    return '<div class="hk-card"><div class="hk-row"><span class="hk-fire" title="Settimane di fila · weeks in a row">🔥 ' + sk.weeks + '</span>' +
      '<div class="hk-wk">' + esc(weekTxt) + '<small>' + esc(weekEn) + '</small></div></div><div class="hk-week" aria-label="' + esc(weekEn) + '">' + d + '</div></div>' +
      '<div class="hk-card"><div class="hk-goal"><span class="hk-ring' + (doneToday ? ' done' : '') + '" aria-hidden="true"><i>' + (doneToday ? '✓' : '') + '</i></span>' +
      '<div><b>Obiettivo di oggi · 1 tappa</b><br><span style="font-weight:700;color:var(--text-muted,#4A5878);font-size:12.5px">' + (doneToday ? 'Fatto! · Done!' : 'Finish one stop today') + '</span></div></div></div>' +
      '<div class="hk-card hk-pack"><b>Prossimo Pacco</b><small>' + esc(packTxt) + ' · ' + esc(packEn) + '</small><div class="hk-bar" aria-hidden="true">' + bar + '</div>' +
      (pend > 0 ? '<button type="button" class="hk-open" data-hk="open">Apri il Pacco!</button>' : '') + '</div>';
  }

  /* ---------- I miei progressi (14 Oct 2026, Assunta: "the home shows too much; progress lives on its own page") ----------
     The home keeps only: the Continua card, the student's Boh, the four tiles and the lesson path.
     Streak, week, daily goal, Pacco bar, Giro d'Italia and the list of all units move to this full-screen page,
     opened from the "I miei progressi" tile. The game's own buttons stay in the page (hidden), and this page clicks them,
     so nothing in the game's save or logic changes. */
  var sheet = null, sheetOpen = false, tilesSig = '';
  function tileHTML(r) {
    var sk = streak(r);
    return '<button type="button" class="hk-tile" data-hk="prog"><span class="hk-tile-ic" aria-hidden="true">🔥</span>' +
      '<span class="hk-tile-tx"><b>Progressi</b><small>' + sk.cur + ' di ' + WEEK_TARGET + ' giorni</small></span></button>' +
      '<button type="button" class="hk-tile" data-hk="tab"><span class="hk-tile-ic" aria-hidden="true">📋</span>' +
      '<span class="hk-tile-tx"><b>La Tabella</b><small>Help chart</small></span></button>';
  }
  function unitsHTML() {
    var tabs = D.querySelectorAll('.unit-tabs > button'), out = '';
    for (var i = 0; i < tabs.length; i++) {
      var b = tabs[i].querySelector('b'), s = tabs[i].querySelector('span'), on = tabs[i].getAttribute('aria-pressed') === 'true';
      out += '<button type="button" class="hk-unit' + (on ? ' on' : '') + '" data-hk="unit" data-i="' + i + '"><b>' + esc(b ? b.textContent : '') + '</b><small>' +
        esc(s ? s.textContent : '') + (on ? ' · ADESSO' : '') + '</small></button>';
    }
    return out;
  }
  function giroHTML() {
    var g = D.querySelector('.bt-hud .hud-btn'); if (!g) return '';
    var big = g.querySelector('.hud-big');
    return '<button type="button" class="hk-unit" data-hk="giro"><b>✈️ Giro d’Italia · ' + esc(big ? big.textContent : '') + '</b><small>Your trips around Italy</small></button>';
  }
  function sheetHTML(r, game) {
    var sk = streak(r);
    return '<div class="hk-sh-in"><div class="hk-sh-top"><h2>I miei progressi</h2><button type="button" class="hk-x" data-hk="close" aria-label="Chiudi · Close">✕</button></div>' +
      '<div class="hk-big"><span>🔥 ' + sk.weeks + '</span><small>' + (sk.weeks === 1 ? 'settimana di fila' : 'settimane di fila') + ' · weeks in a row (3 days a week keeps it going)</small></div>' +
      '<div class="hk">' + html(r, game) + '</div>' +
      giroHTML() +
      '<h3 class="hk-h3">Le tue unità <small>All units</small></h3><div class="hk-units">' + unitsHTML() + '</div></div>';
  }
  function openSheet() {
    if (!sheet) {
      sheet = D.createElement('div'); sheet.className = 'hk-sheet'; sheet.setAttribute('role', 'dialog'); sheet.setAttribute('aria-modal', 'true'); sheet.setAttribute('aria-label', 'I miei progressi');
      sheet.addEventListener('click', onClick); D.body.appendChild(sheet);
    }
    sheetOpen = true; sheet.style.display = 'block'; sig = ''; draw();
    var x = sheet.querySelector('.hk-x'); if (x) x.focus();
  }
  function closeSheet() { sheetOpen = false; if (sheet) sheet.style.display = 'none'; }
  function onClick(e) {
    var t = e.target && e.target.closest && e.target.closest('[data-hk]'); if (!t) return;
    var a = t.getAttribute('data-hk'), g = W.BohUI && W.BohUI.game;
    if (a === 'prog') openSheet();
    else if (a === 'close') closeSheet();
    else if (a === 'open') { closeSheet(); if (g && g.openPacco) g.openPacco(); }
    else if (a === 'tab') { var tb = D.querySelector('.bt-hud .hud-tab'); if (tb) tb.click(); }
    else if (a === 'giro') { var gb = D.querySelector('.bt-hud .hud-btn'); closeSheet(); if (gb) gb.click(); }
    else if (a === 'unit') { var ub = D.querySelectorAll('.unit-tabs > button')[+t.getAttribute('data-i')]; closeSheet(); if (ub) { ub.click(); W.scrollTo(0, 0); } }
  }
  function draw() {
    var game = W.BohUI && W.BohUI.game, r = load().r;
    var s = JSON.stringify([r.n, r.days.slice(-14), r.packDay, ymd(), game && game.pending ? game.pending().centoni : 0, D.querySelectorAll('.unit-tabs > button[aria-pressed="true"]').length && D.querySelector('.unit-tabs > button[aria-pressed="true"]').textContent]);
    if (sheetOpen && sheet && s !== sig) { sheet.innerHTML = sheetHTML(r, game); sig = s; }
  }

  function tick() {
    var card = D.querySelector('.start-card'), game = W.BohUI && W.BohUI.game, r = sync(game);   /* counts even off the home screen, so a stop is credited to the day it was finished */
    var tiles = D.querySelector('.home-tiles');
    if (!card || !tiles) { if (sheetOpen) closeSheet(); return; }
    if (!node || !node.parentNode || node.parentNode !== tiles) {
      node = D.createElement('div'); node.className = 'hk-tiles'; node.setAttribute('data-kit', 'home');
      node.addEventListener('click', onClick); tiles.appendChild(node); tilesSig = '';
    }
    var ts = JSON.stringify([streak(r).cur]);
    if (ts !== tilesSig) { node.innerHTML = tileHTML(r); tilesSig = ts; }
    draw();
  }
  D.addEventListener('keydown', function (e) { if (sheetOpen && e.key === 'Escape') closeSheet(); });

  W.BohHomeKit = { sync: function () { return sync(W.BohUI && W.BohUI.game); }, state: function () { return load().r; }, rules: { WEEK_TARGET: WEEK_TARGET, PER_PACK: PER_PACK, PACKS_PER_DAY: PACKS_PER_DAY } };
  st();
  tick(); timer = setInterval(tick, 700);
  D.addEventListener('visibilitychange', function () { if (!D.hidden) tick(); });
})(window, document);
