/* Boh Snake: the "Pausa" arcade break.
   One self-contained file. Own drawing code, own music (written note by note below and played live by the browser,
   no audio files, no samples, no third-party assets). No Boh Cashi, no score pressure, never blocks progress.
   Page contract: a small "Pausa" button appears on the home screen only (never during a quiz, test, shop or unit overlay).
   Edit the MUSIC, FOODS or TEXT blocks to change them. */
(function (W) {
  'use strict';
  if (W.BohSnake) return;

  /* ---------------------------------------------------------------- TEXT */
  var TXT = {
    fab: '🎮 Pausa',
    fabTip: 'Take a short break · Fai una pausa',
    title: 'Boh Snake',
    sub: 'Mangia 15 cibi per vincere! · Eat 15 foods to win!',
    play: 'Gioca · Play',
    again: 'Rigioca · Again',
    back: 'Torna al lavoro · Back to work',
    pause: 'Pausa',
    paused: 'In pausa · Paused',
    resume: 'Continua · Resume',
    over: 'Ops!',
    best: 'Record',
    ate: 'Mangiati',
    gentle: 'Muri morbidi (passi attraverso) · Soft walls (wrap around)',
    music: 'Musica · Music',
    howTo: 'Frecce o WASD · Arrow keys or WASD. On a phone: swipe.',
    nudge: 'Pausa finita? Torniamo a Boh! · Break over? Back to Boh!',
    win: 'Bravissimo! Hai vinto! · You won!',
    speed: 'Velocità · Speed'
  };

  /* ---------------------------------------------------------------- BOH POSES (images live in assets/snake/; each moment = one pose + one Italian line + its English) */
  var SRC = (document.currentScript && document.currentScript.src) || '';
  var POSEDIR = SRC.replace(/[^\/]*$/, '') + 'snake/', POSEQ = (SRC.match(/\?.*$/) || [''])[0];
  var POSES = {
    start:  { img: 'boh-pizza',   it: 'Buon appetito! Gioca!',            en: 'Enjoy! Let’s play!' },
    paused: { img: 'boh-calm',    it: 'Con calma… respira!',              en: 'Take it easy… breathe!' },
    over:   { img: 'boh-kiss',    it: 'Perfetto! Ritorniamo a lavoro!',   en: 'Perfect! Back to work!' },
    zero:   { img: 'boh-boh',     it: 'Riprova?',                         en: 'Try again?' },
    record: { img: 'boh-one',     it: 'Numero uno! Nuovo record!',        en: 'Number one! New record!' },
    won:    { img: 'boh-kiss',    it: 'Bravissimo! Hai vinto!',  en: 'You won!' },
    nudge:  { img: 'boh-point',   it: 'Pausa finita! Torniamo a Boh!',    en: 'Break over! Back to Boh!' },
    bye:    { img: 'boh-walk',    it: 'Andiamo!',                         en: 'Let’s go!' }
  };
  function poseImg(k) { return '<img class="bsn-pose" alt="" decoding="async" src="' + POSEDIR + POSES[k].img + '.webp' + POSEQ + '" onerror="this.style.display=\'none\'">'; }
  /* the English shows when you hover (computer) or tap/focus (Chromebook, phone) the Italian line */
  function poseText(k) { return '<div class="bsn-tx" tabindex="0" role="note" aria-label="' + esc(POSES[k].it + ' — ' + POSES[k].en) + '"><h3>' + esc(POSES[k].it) + '</h3><p class="bsn-en">' + esc(POSES[k].en) + '</p></div>'; }

  /* ---------------------------------------------------------------- FOODS (emoji + the Italian word, shown quietly when eaten) */
  var FOODS = [
    ['🍕', 'la pizza', 'pizza'], ['🍦', 'il gelato', 'ice cream'], ['🍝', 'la pasta', 'pasta'], ['🍪', 'i biscotti', 'cookies'], ['🍬', 'le caramelle', 'candy'],
    ['🍎', 'la mela', 'apple'], ['🍓', 'la fragola', 'strawberry'], ['🧀', 'il formaggio', 'cheese'], ['🍋', 'il limone', 'lemon'], ['🍰', 'la torta', 'cake']
  ];

  /* ---------------------------------------------------------------- MUSIC: original, 6/8 tarantella-style feel, A minor then C major.
     Each bar = 6 eighth notes. '-' = rest. Lead plays the notes; bass plays root on step 1 and fifth on step 4. */
  var MUSIC = {
    eighth: 0.17,
    A: {
      lead: ['A4 C5 E5 A5 E5 C5', 'B4 C5 E5 C5 B4 A4', 'D5 F5 A5 F5 D5 F5', 'E5 C5 A4 C5 E5 C5',
             'E5 G#5 B5 G#5 E5 B4', 'E5 D5 B4 G#4 B4 D5', 'F5 E5 D5 C5 B4 C5', 'A4 C5 E5 A5 - -'],
      bass: [45, 45, 50, 45, 52, 52, 45, 45]
    },
    B: {
      lead: ['C5 E5 G5 E5 C5 E5', 'G5 E5 C5 D5 E5 G5', 'A5 F5 C5 F5 A5 F5', 'G5 E5 C5 E5 G5 C6',
             'B5 G5 D5 G5 B5 G5', 'A5 B5 D6 B5 G5 D5', 'C6 B5 A5 E5 A5 C6', 'B5 G#5 E5 G#5 B5 E5'],
      bass: [48, 48, 41, 48, 43, 43, 45, 52]
    },
    order: ['A', 'B']
  };

  /* ---------------------------------------------------------------- small helpers */
  function lsGet(k, d) { try { var v = localStorage.getItem(k); return v === null ? d : v; } catch (e) { return d; } }
  function lsSet(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
  var K_BEST = 'boh_snake_best', K_MUTE = 'boh_snake_mute', K_GENTLE = 'boh_snake_gentle', K_SPEED = 'boh_snake_speed';
  /* GOAL = foods to eat to win. SPEEDS = milliseconds per step (bigger = slower). Slow is the default; kids can speed it up at any time. */
  var GOAL = 15, SPEEDS = { slow: 320, med: 200, fast: 130 };
  function speedKey() { var v = lsGet(K_SPEED, 'slow'); return SPEEDS[v] ? v : 'slow'; }
  function bestKey() { return K_BEST + '_' + speedKey(); }
  function getBest() { return parseInt(lsGet(bestKey(), '0'), 10) || 0; }
  var NAMES = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 };
  function midiOf(n) { var m = /^([A-G])(#?)(\d)$/.exec(n); if (!m) return null; return 12 * (parseInt(m[3], 10) + 1) + NAMES[m[1]] + (m[2] ? 1 : 0); }
  function hz(m) { return 440 * Math.pow(2, (m - 69) / 12); }
  function rnd(n) { return Math.floor(Math.random() * n); }

  /* ---------------------------------------------------------------- audio (music + effects) */
  var Audio = {
    ctx: null, master: null, timer: null, nextT: 0, step: 0, on: false, plan: null,
    ok: function () { return !!(W.AudioContext || W.webkitAudioContext); },
    init: function () {
      if (this.ctx || !this.ok()) return;
      try {
        var AC = W.AudioContext || W.webkitAudioContext; this.ctx = new AC();
        this.master = this.ctx.createGain(); this.master.gain.value = 0.9; this.master.connect(this.ctx.destination);
      } catch (e) { this.ctx = null; }
    },
    muted: function () { return lsGet(K_MUTE, '0') === '1'; },
    buildPlan: function () {
      var p = [];
      MUSIC.order.forEach(function (k) {
        var sec = MUSIC[k];
        sec.lead.forEach(function (bar, bi) {
          var notes = bar.split(/\s+/);
          for (var s = 0; s < 6; s++) {
            var lead = notes[s] && notes[s] !== '-' ? midiOf(notes[s]) : null;
            var bass = s === 0 ? sec.bass[bi] : (s === 3 ? sec.bass[bi] + 7 : null);
            p.push({ lead: lead, bass: bass });
          }
        });
      });
      this.plan = p;
    },
    tone: function (t, f, dur, type, vol) {
      if (!this.ctx) return;
      try {
        var o = this.ctx.createOscillator(), g = this.ctx.createGain();
        o.type = type; o.frequency.value = f;
        g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(vol, t + 0.012);
        g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
        o.connect(g); g.connect(this.master); o.start(t); o.stop(t + dur + 0.03);
      } catch (e) {}
    },
    pump: function () {
      var c = this.ctx; if (!c || !this.on) return;
      var look = c.currentTime + 0.35;
      while (this.nextT < look) {
        var s = this.plan[this.step % this.plan.length];
        if (!this.muted()) {
          if (s.lead) this.tone(this.nextT, hz(s.lead), MUSIC.eighth * 1.5, 'square', 0.035);
          if (s.bass) this.tone(this.nextT, hz(s.bass), MUSIC.eighth * 2.2, 'triangle', 0.09);
        }
        this.nextT += MUSIC.eighth; this.step++;
      }
    },
    start: function () {
      this.init(); if (!this.ctx) return;
      try { if (this.ctx.state === 'suspended') this.ctx.resume(); } catch (e) {}
      if (!this.plan) this.buildPlan();
      if (this.on) return;
      this.on = true; this.nextT = this.ctx.currentTime + 0.08;
      var self = this; this.timer = setInterval(function () { self.pump(); }, 60); this.pump();
    },
    pause: function () { this.on = false; clearInterval(this.timer); this.timer = null; },
    stop: function () { this.pause(); this.step = 0; var c = this.ctx; this.ctx = null; this.master = null; try { c && c.close(); } catch (e) {} },
    sfx: function (kind) {
      if (!this.ctx || this.muted()) return; var t = this.ctx.currentTime + 0.01;
      if (kind === 'eat') { this.tone(t, 784, 0.09, 'square', 0.05); this.tone(t + 0.07, 1175, 0.12, 'square', 0.05); }
      else if (kind === 'over') { this.tone(t, 392, 0.18, 'sawtooth', 0.05); this.tone(t + 0.16, 311, 0.18, 'sawtooth', 0.05); this.tone(t + 0.32, 196, 0.4, 'sawtooth', 0.05); }
      else if (kind === 'turn') { this.tone(t, 330, 0.03, 'square', 0.012); }
    }
  };

  /* ---------------------------------------------------------------- the game */
  var N = 14, root = null, canvas = null, g2 = null, G = null, cell = 20, bohInfo = null, onCloseCb = null;
  var openedAt = 0, nudged = false, timers = [];

  function newGame() {
    var mid = Math.floor(N / 2);
    G = { snake: [{ x: mid, y: mid }, { x: mid - 1, y: mid }, { x: mid - 2, y: mid }], dir: { x: 1, y: 0 }, q: [], food: null, foodIdx: 0, eaten: 0, state: 'ready', last: '', tick: null, grow: 0 };
    placeFood();
  }
  function free(x, y) { for (var i = 0; i < G.snake.length; i++) if (G.snake[i].x === x && G.snake[i].y === y) return false; return true; }
  function placeFood() {
    var spots = []; for (var x = 0; x < N; x++) for (var y = 0; y < N; y++) if (free(x, y)) spots.push({ x: x, y: y });
    if (!spots.length) { G.food = null; return; }
    var p = spots[rnd(spots.length)]; G.food = { x: p.x, y: p.y }; G.foodIdx = rnd(FOODS.length);
  }
  function speed() { return SPEEDS[speedKey()]; }
  function schedule() { clearTimeout(G.tick); if (G.state === 'playing') G.tick = setTimeout(step, speed()); }

  function step() {
    if (!G || G.state !== 'playing') return;
    if (G.q.length) { var d = G.q.shift(); if (!(d.x === -G.dir.x && d.y === -G.dir.y)) G.dir = d; }
    var h = G.snake[0], nx = h.x + G.dir.x, ny = h.y + G.dir.y, gentle = lsGet(K_GENTLE, '0') === '1';
    if (nx < 0 || ny < 0 || nx >= N || ny >= N) {
      if (gentle) { nx = (nx + N) % N; ny = (ny + N) % N; } else return over();
    }
    var eating = G.food && nx === G.food.x && ny === G.food.y;
    var body = G.snake.slice(0, eating ? G.snake.length : G.snake.length - 1);
    for (var i = 0; i < body.length; i++) if (body[i].x === nx && body[i].y === ny) return over();
    G.snake.unshift({ x: nx, y: ny });
    if (eating) {
      G.eaten++; G.last = FOODS[G.foodIdx][0] + ' ' + FOODS[G.foodIdx][1]; G.lastEn = FOODS[G.foodIdx][2]; Audio.sfx('eat'); placeFood(); pop();
      if (G.eaten >= GOAL || !G.food) { return over(true); }
    } else G.snake.pop();
    draw(); hud(); schedule();
  }
  function over(won) {
    G.state = 'over'; clearTimeout(G.tick); Audio.sfx('over');
    var best = getBest(), nb = G.eaten > best; if (nb) lsSet(bestKey(), String(G.eaten));
    G.newBest = nb; G.won = !!won; draw(); hud(); panel();
  }
  function start() {
    if (!G || G.state === 'playing') return;
    if (G.state === 'over') newGame();
    G.state = 'playing'; Audio.start(); panel(); hud(); draw(); schedule();
  }
  function pauseGame() { if (G && G.state === 'playing') { G.state = 'paused'; clearTimeout(G.tick); Audio.pause(); panel(); draw(); } }
  function resume() { if (G && G.state === 'paused') { G.state = 'playing'; Audio.start(); panel(); schedule(); } }
  function turn(dx, dy) {
    if (!G) return;
    if (G.state === 'ready' || G.state === 'over') { start(); }
    if (G.state === 'paused') resume();
    if (G.state !== 'playing') return;
    var last = G.q.length ? G.q[G.q.length - 1] : G.dir;
    if ((last.x === dx && last.y === dy) || (last.x === -dx && last.y === -dy)) return;
    if (G.q.length < 2) { G.q.push({ x: dx, y: dy }); Audio.sfx('turn'); }
  }

  /* ---------------------------------------------------------------- drawing (all shapes are drawn here, nothing is loaded) */
  var REDUCED = false; try { REDUCED = W.matchMedia && W.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) {}
  var raf = 0;
  function loop() { if (!root) { raf = 0; return; } if (G && (G.state === 'playing' || G.state === 'ready' || G.state === 'paused')) draw(); raf = requestAnimationFrame(loop); }
  function pop() {
    var w = root && root.querySelector('.bsn-wrap'); if (!w || !G) return; var o = w.querySelector('.bsn-pop'); if (o) o.remove();
    var d = document.createElement('div'); d.className = 'bsn-pop'; d.setAttribute('aria-hidden', 'true'); d.textContent = G.last + '!'; w.appendChild(d); setTimeout(function () { d.remove(); }, 1000);
  }
  function spdLabel() { if (!root) return; var b = root.querySelectorAll('[data-a="spd"]'), k = speedKey(); for (var i = 0; i < b.length; i++) b[i].setAttribute('aria-pressed', String(b[i].getAttribute('data-v') === k)); }
  function rr(c, x, y, w, h, r) { c.beginPath(); c.moveTo(x + r, y); c.arcTo(x + w, y, x + w, y + h, r); c.arcTo(x + w, y + h, x, y + h, r); c.arcTo(x, y + h, x, y, r); c.arcTo(x, y, x + w, y, r); c.closePath(); }
  function draw() {
    if (!g2 || !G) return; var c = g2, s = cell, i, W2 = N * s;
    c.clearRect(0, 0, W2, W2);
    for (var x = 0; x < N; x++) for (var y = 0; y < N; y++) { c.fillStyle = (x + y) % 2 ? '#f6e9de' : '#fbf3ec'; c.fillRect(x * s, y * s, s, s); }
    if (G.food) {
      var fx = G.food.x * s + s / 2, fy = G.food.y * s + s / 2, pu = REDUCED ? 1 : 1 + 0.07 * Math.sin(Date.now() / 220);
      c.fillStyle = 'rgba(255,255,255,.96)'; c.beginPath(); c.arc(fx, fy, s * 0.46 * pu, 0, 7); c.fill();
      c.lineWidth = Math.max(2, s * 0.07); c.strokeStyle = '#e8845f'; c.stroke();
      c.font = Math.floor(s * 0.74 * pu) + 'px "Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji",sans-serif'; c.textAlign = 'center'; c.textBaseline = 'middle';
      c.fillText(FOODS[G.foodIdx][0], fx, fy + s * 0.03);
    }
    for (i = G.snake.length - 1; i >= 1; i--) {
      var b = G.snake[i], k = Math.max(0.1, 1 - i * 0.012), pad = s * (0.1 + (1 - k) * 0.4);
      c.fillStyle = i % 2 ? '#c4664e' : '#d9856c'; rr(c, b.x * s + pad, b.y * s + pad, s - pad * 2, s - pad * 2, s * 0.28); c.fill();
    }
    var hd = G.snake[0], hx = hd.x * s, hy = hd.y * s;
    c.fillStyle = '#a84f3a'; rr(c, hx + s * 0.04, hy + s * 0.04, s * 0.92, s * 0.92, s * 0.34); c.fill();
    c.fillStyle = '#fff';
    var ex = G.dir.x, ey = G.dir.y, ox = ey !== 0 ? s * 0.22 : 0, oy = ex !== 0 ? s * 0.22 : 0, cx = hx + s / 2 + ex * s * 0.1, cy = hy + s / 2 + ey * s * 0.1;
    [[-1, -1], [1, 1]].forEach(function (sg, j) {
      var px = cx + (j ? 1 : -1) * ox, py = cy + (j ? 1 : -1) * oy;
      c.beginPath(); c.arc(px, py, s * 0.13, 0, 7); c.fill();
      c.fillStyle = '#2b1d1a'; c.beginPath(); c.arc(px + ex * s * 0.05, py + ey * s * 0.05, s * 0.065, 0, 7); c.fill(); c.fillStyle = '#fff';
    });
  }

  /* ---------------------------------------------------------------- overlay UI */
  var CSS = '.bsn-fab{position:fixed;left:12px;bottom:calc(12px + var(--hostbar,0px));z-index:40;border:0;border-radius:999px;padding:10px 16px;font:700 15px/1 system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#fff;background:#6b4a8a;box-shadow:0 4px 14px rgba(0,0,0,.28);cursor:pointer;display:none;min-height:44px}' +
    '.bsn-fab:hover{filter:brightness(1.1)}.bsn-fab:focus-visible,.bsn-ov button:focus-visible{outline:3px solid #ffd166;outline-offset:2px}' +
    '.bsn-ov{position:fixed;inset:0;z-index:100000;background:#231815;color:#fbf3ec;display:flex;flex-direction:column;align-items:center;font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif;overflow:auto;-webkit-user-select:none;user-select:none;touch-action:pan-y}.bsn-ov canvas{touch-action:none}' +
    '.bsn-top{width:100%;max-width:560px;display:flex;align-items:center;gap:8px;padding:10px 14px 4px;box-sizing:border-box}.bsn-top h2{margin:0;font-size:19px;flex:1;white-space:nowrap}.bsn-bigback{width:100%;margin-bottom:4px}' +
    '.bsn-ov button{font:700 15px/1 system-ui,sans-serif;border:0;border-radius:12px;padding:12px 16px;min-height:44px;cursor:pointer;color:#231815;background:#fbf3ec}' +
    '.bsn-ov button.go{background:#e8845f;color:#fff}.bsn-ov button.ghost{background:#3b2a25;color:#fbf3ec}' +
    '.bsn-hud{width:100%;max-width:560px;display:flex;justify-content:space-between;gap:8px;padding:0 14px 8px;box-sizing:border-box;font-size:14px;min-height:22px}.bsn-hud b{color:#ffd166}' +
    '.bsn-wrap{flex:0 0 auto;position:relative;border-radius:14px;overflow:hidden;box-shadow:0 8px 30px rgba(0,0,0,.45);line-height:0}' +
    '.bsn-card{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:6px;background:rgba(35,24,21,.88);text-align:center;padding:12px;line-height:1.3}.bsn-card h3{margin:0;font-size:21px}.bsn-card p{margin:0;font-size:14px;opacity:.9}.bsn-tx{cursor:help;outline:none;border-radius:8px;padding:2px 6px}.bsn-tx h3{border-bottom:1px dotted rgba(251,243,236,.55);display:inline-block}.bsn-en{opacity:0!important;transition:opacity .15s;min-height:1.3em}.bsn-tx:hover .bsn-en,.bsn-tx:focus .bsn-en,.bsn-tx.on .bsn-en,.bsn-say:hover .bsn-en,.bsn-say.on .bsn-en{opacity:.95!important}.bsn-card .bsn-sc{font-weight:700;color:#ffd166;opacity:1}' +
    '.bsn-pose{display:block;flex:0 1 auto;min-height:0;max-height:52%;width:auto;max-width:80%;object-fit:contain;animation:bsnpop .35s ease-out}@keyframes bsnpop{from{transform:scale(.88);opacity:0}to{transform:none;opacity:1}}@media (prefers-reduced-motion:reduce){.bsn-pose{animation:none}}' +
    '.bsn-opts{width:100%;max-width:560px;display:flex;flex-direction:column;gap:6px;padding:10px 14px;box-sizing:border-box;font-size:13px}.bsn-opts label{display:flex;gap:8px;align-items:center;cursor:pointer}.bsn-opts input{width:20px;height:20px}' +
    '.bsn-spd{display:flex;gap:6px}.bsn-spd button{flex:1;padding:10px 4px;font-size:14px}.bsn-spd button[aria-pressed=true]{background:#e8845f;color:#fff;outline:2px solid #ffd166}.bsn-pop{position:absolute;left:50%;top:8px;transform:translateX(-50%);background:rgba(35,24,21,.88);color:#fbf3ec;padding:7px 14px;border-radius:999px;font:700 clamp(15px,4.6vw,21px)/1.2 system-ui,sans-serif;pointer-events:none;white-space:nowrap;animation:bsnpp 1s ease-out forwards}@keyframes bsnpp{0%{opacity:0;transform:translate(-50%,8px)}15%{opacity:1;transform:translate(-50%,0)}80%{opacity:1}100%{opacity:0}}@media (prefers-reduced-motion:reduce){.bsn-pop{animation:none}}.bsn-pad{display:grid;grid-template-columns:repeat(3,64px);grid-template-rows:repeat(2,56px);gap:6px;margin:8px 0}.bsn-pad button{padding:0;font-size:22px}' +
    '.bsn-land{display:grid;grid-template-columns:auto 300px;grid-auto-rows:min-content;column-gap:14px;justify-content:center;align-content:center;padding:6px 10px;box-sizing:border-box}.bsn-land>*{grid-column:2;max-width:none!important;width:auto}.bsn-land>.bsn-wrap{grid-column:1;grid-row:1/span 5;align-self:center}.bsn-land .bsn-pad{margin:4px auto}.bsn-land .bsn-top{padding:0 0 4px}.bsn-land .bsn-hud{padding:0 0 4px}.bsn-land .bsn-opts{padding:4px 0}@media (max-height:640px){.bsn-opts div{display:none}.bsn-spd button{min-height:36px;padding:6px 4px}.bsn-pose{max-width:70%}}@media (max-width:370px){.bsn-top{gap:5px;padding:8px 8px 4px}.bsn-top h2{font-size:15px}.bsn-ov button{padding:10px 11px;font-size:14px}}.bsn-tiny .bsn-card .bsn-pose{display:none}.bsn-tiny .bsn-card{padding:6px;gap:4px}.bsn-tiny .bsn-card h3{font-size:15px}.bsn-tiny .bsn-card .bsn-en,.bsn-tiny .bsn-card .bsn-sc{display:none}.bsn-nudge{position:fixed;top:56px;right:max(6px,calc(50% - 286px));display:flex;align-items:flex-start;gap:4px;z-index:5;max-width:96%;cursor:pointer}.bsn-nudge .bsn-pose{height:150px;max-height:none;max-width:none;width:auto}.bsn-say{background:#ffd166;color:#231815;border-radius:14px;padding:10px 12px;font-size:14px;max-width:190px;margin-top:46px;line-height:1.3}.bsn-say span{font-weight:400;font-size:13px;opacity:0}.bsn-say:focus .bsn-en{opacity:.95!important}';

  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function isLand() { return W.innerWidth > W.innerHeight * 1.2 && W.innerHeight < 620; }
  function size() {
    var touch = ('ontouchstart' in W) || (navigator.maxTouchPoints > 0), w, h;
    if (isLand()) { w = W.innerWidth - 330; h = W.innerHeight - 20; }
    else { w = Math.min(W.innerWidth - 28, 520); h = W.innerHeight - (touch ? (W.innerHeight < 600 ? 395 : (W.innerHeight < 700 ? 368 : 385)) : (W.innerHeight < 640 ? 265 : 300)); }
    var s = Math.max(220, Math.min(w, h, 520)); cell = Math.floor(s / N);
  }
  function relayout() {
    if (!root || !canvas) return; size(); var px = cell * N, wr = root.querySelector('.bsn-wrap');
    canvas.width = px; canvas.height = px; wr.style.width = px + 'px'; wr.style.height = px + 'px';
    root.classList.toggle('bsn-land', isLand()); root.classList.toggle('bsn-tiny', px < 220); draw();
  }

  function build() {
    size(); var px = cell * N, touch = 'ontouchstart' in W || (navigator.maxTouchPoints > 0);
    root = document.createElement('div'); root.className = 'bsn-ov' + (isLand() ? ' bsn-land' : '') + (cell * N < 220 ? ' bsn-tiny' : ''); root.setAttribute('role', 'dialog'); root.setAttribute('aria-modal', 'true'); root.setAttribute('aria-label', TXT.title);
    root.innerHTML =
      '<div class="bsn-top"><h2>' + esc(TXT.title) + '</h2><button class="ghost" data-a="mute" aria-pressed="false" id="bsn-mute"></button><button class="ghost" data-a="pause" id="bsn-pause">' + esc(TXT.pause) + '</button><button class="go" data-a="back" aria-label="' + esc(TXT.back) + '" title="' + esc(TXT.back) + '">✕</button></div>' +
      '<div class="bsn-hud"><span>' + esc(TXT.ate) + ': <b id="bsn-n">0</b> / ' + GOAL + ' · ' + esc(TXT.best) + ': <b id="bsn-b">0</b></span><span id="bsn-last" aria-live="polite"></span></div>' +
      '<div class="bsn-wrap" style="width:' + px + 'px;height:' + px + 'px"><canvas id="bsn-c" width="' + px + '" height="' + px + '"></canvas><div class="bsn-card" id="bsn-card"></div></div>' +
      (touch ? '<div class="bsn-pad"><span></span><button data-d="u" aria-label="Up">▲</button><span></span><button data-d="l" aria-label="Left">◀</button><button data-d="d" aria-label="Down">▼</button><button data-d="r" aria-label="Right">▶</button></div>' : '') +
      '<div class="bsn-opts"><span class="bsn-spd" role="group" aria-label="' + esc(TXT.speed) + '"><button class="ghost" data-a="spd" data-v="slow">🐢 Lento</button><button class="ghost" data-a="spd" data-v="med">🐇 Medio</button><button class="ghost" data-a="spd" data-v="fast">⚡ Veloce</button></span><button class="go bsn-bigback" data-a="back">' + esc(TXT.back) + ' ▶</button><label><input type="checkbox" id="bsn-gentle"> ' + esc(TXT.gentle) + '</label><div>' + esc(TXT.howTo) + '</div></div>';
    document.body.appendChild(root);
    canvas = root.querySelector('#bsn-c'); g2 = canvas.getContext('2d');
    root.querySelector('#bsn-gentle').checked = lsGet(K_GENTLE, '0') === '1';
    root.addEventListener('click', onClick); root.addEventListener('change', function (e) { if (e.target.id === 'bsn-gentle') lsSet(K_GENTLE, e.target.checked ? '1' : '0'); });
    var sx = 0, sy = 0, st = false;
    canvas.addEventListener('touchstart', function (e) { var t = e.touches[0]; sx = t.clientX; sy = t.clientY; st = true; }, { passive: true });
    canvas.addEventListener('touchend', function (e) {
      if (!st) return; st = false; var t = e.changedTouches[0], dx = t.clientX - sx, dy = t.clientY - sy;
      if (Math.abs(dx) < 18 && Math.abs(dy) < 18) { if (G && G.state === 'paused') resume(); else if (G && (G.state === 'ready' || G.state === 'over')) start(); return; }
      if (Math.abs(dx) > Math.abs(dy)) turn(dx > 0 ? 1 : -1, 0); else turn(0, dy > 0 ? 1 : -1);
    }, { passive: true });
    muteLabel(); spdLabel();
  }
  function muteLabel() { var b = root && root.querySelector('#bsn-mute'); if (!b) return; var m = Audio.muted(); b.textContent = m ? '🔇' : '🔊'; b.setAttribute('aria-pressed', String(m)); b.setAttribute('aria-label', TXT.music + (m ? ': off' : ': on')); }
  function hud() {
    if (!root || !G) return;
    var n = root.querySelector('#bsn-n'), b = root.querySelector('#bsn-b'), l = root.querySelector('#bsn-last');
    if (n) n.textContent = G.eaten; if (b) b.textContent = Math.max(getBest(), G.eaten); if (l) { l.textContent = G.last; l.title = G.lastEn || ''; }
  }
  function panel() {
    var c = root && root.querySelector('#bsn-card'); if (!c || !G) return;
    if (G.state === 'playing') { c.style.display = 'none'; return; }
    c.style.display = 'flex'; var h = '', score = '<p class="bsn-sc">' + esc(TXT.ate + ': ' + (G.eaten || 0)) + '</p>';
    if (G.state === 'ready') h = poseImg('start') + poseText('start') + '<button class="go" data-a="play" id="bsn-primary">' + esc(TXT.play) + '</button>';
    else if (G.state === 'paused') h = poseImg('paused') + poseText('paused') + '<button class="go" data-a="resume" id="bsn-primary">' + esc(TXT.resume) + '</button>';
    else {
      var k = G.won ? 'won' : (G.eaten === 0 ? 'zero' : (G.newBest ? 'record' : 'over'));
      h = poseImg(k) + poseText(k) + (G.eaten > 0 ? score : '') + '<button class="go" data-a="play" id="bsn-primary">' + esc(TXT.again) + '</button>';
    }
    c.innerHTML = h; var p = c.querySelector('#bsn-primary'); if (p) { try { p.focus({ preventScroll: true }); } catch (e) {} }
  }
  var bye = false;
  function farewell() {
    if (!root || bye) return; bye = true;
    if (G) { clearTimeout(G.tick); G.state = 'bye'; } Audio.pause();
    var c = root.querySelector('#bsn-card'); if (c) { c.style.display = 'flex'; c.innerHTML = poseImg('bye') + poseText('bye'); }
    timers.push(setTimeout(close, 1100));
  }
  function onClick(e) {
    var d = e.target.closest('[data-d]');
    if (d) { var m = { u: [0, -1], d: [0, 1], l: [-1, 0], r: [1, 0] }[d.getAttribute('data-d')]; turn(m[0], m[1]); return; }
    var tx = e.target.closest('.bsn-tx'); if (tx) { tx.classList.toggle('on'); return; }
    var a = e.target.closest('[data-a]'); if (!a) return; var v = a.getAttribute('data-a');
    if (v === 'play') start(); else if (v === 'resume') resume(); else if (v === 'pause') { if (G.state === 'playing') pauseGame(); else if (G.state === 'paused') resume(); }
    else if (v === 'mute') { lsSet(K_MUTE, Audio.muted() ? '0' : '1'); muteLabel(); }
    else if (v === 'back') farewell();
    else if (v === 'spd') { lsSet(K_SPEED, a.getAttribute('data-v')); spdLabel(); hud(); }
  }
  function onKey(e) {
    if (!root || bye) return; var k = e.key, map = { ArrowUp: [0, -1], ArrowDown: [0, 1], ArrowLeft: [-1, 0], ArrowRight: [1, 0], w: [0, -1], s: [0, 1], a: [-1, 0], d: [1, 0], W: [0, -1], S: [0, 1], A: [-1, 0], D: [1, 0] };
    if (map[k]) { e.preventDefault(); turn(map[k][0], map[k][1]); return; }
    if (k === ' ' || k === 'p' || k === 'P') { if (document.activeElement && document.activeElement.tagName === 'BUTTON' && k === ' ') return; e.preventDefault(); if (!G) return; if (G.state === 'playing') pauseGame(); else if (G.state === 'paused') resume(); else start(); }
    else if (k === 'Escape') { e.preventDefault(); close(); }
    else if (k === 'm' || k === 'M') { lsSet(K_MUTE, Audio.muted() ? '0' : '1'); muteLabel(); }
  }
  var rzT = null;
  function onResize() { clearTimeout(rzT); rzT = setTimeout(relayout, 120); }
  function onVis() { if (document.hidden) pauseGame(); }

  function open(opts) {
    if (root) return; bohInfo = (opts && opts.boh) || null; onCloseCb = opts && opts.onClose;
    bye = false; newGame(); build(); panel(); hud(); draw(); openedAt = Date.now(); nudged = false;
    if (!REDUCED && !raf) raf = requestAnimationFrame(loop);
    ['boh-pizza', 'boh-kiss'].forEach(function (n) { try { (new Image()).src = POSEDIR + n + '.webp' + POSEQ; } catch (e) {} });
    document.addEventListener('keydown', onKey); document.addEventListener('visibilitychange', onVis); W.addEventListener('resize', onResize); W.addEventListener('orientationchange', onResize);
    try { W.BohSnake._ovf = document.body.style.overflow; document.body.style.overflow = 'hidden'; } catch (e) {}
    timers.push(setInterval(function () {
      if (!root || nudged || Date.now() - openedAt < 300000) return; nudged = true;
      var n = document.createElement('div'); n.className = 'bsn-nudge'; n.setAttribute('role', 'status');
      n.innerHTML = '<div class="bsn-say" tabindex="0"><b>' + esc(POSES.nudge.it) + '</b><br><span class="bsn-en">' + esc(POSES.nudge.en) + '</span></div>' + poseImg('nudge');
      n.addEventListener('click', function (ev) { var sy = n.querySelector('.bsn-say'); if (ev.target.closest('.bsn-say') && !sy.classList.contains('on')) { sy.classList.add('on'); return; } n.remove(); }); root.appendChild(n);
      setTimeout(function () { n.remove(); }, 12000);
    }, 5000));
  }
  function close() {
    if (!root) return; if (raf) { cancelAnimationFrame(raf); raf = 0; } if (G) clearTimeout(G.tick); timers.forEach(function (t) { clearInterval(t); clearTimeout(t); }); timers = [];
    Audio.stop(); document.removeEventListener('keydown', onKey); document.removeEventListener('visibilitychange', onVis); W.removeEventListener('resize', onResize); W.removeEventListener('orientationchange', onResize); clearTimeout(rzT);
    root.remove(); root = null; canvas = null; g2 = null; G = null;
    try { document.body.style.overflow = W.BohSnake._ovf || ''; } catch (e) {}
    var cb = onCloseCb; onCloseCb = null; if (cb) { try { cb(); } catch (e) {} }
    showFab();
  }

  /* ---------------------------------------------------------------- the "Pausa" button: home screen only */
  var fab = null;
  function allowed() {
    var g = W.__game; if (!g || !g.state || root) return false; var s = g.state;
    if (s.screen !== 'home' || !s.bohBase || s.overlay) return false;
    if (document.querySelector('.brt-ov, .bcards-ov, [role="dialog"]:not(.bsn-ov)')) return false;
    return true;
  }
  function showFab() { if (!fab) return; fab.style.display = allowed() ? 'block' : 'none'; }
  function boot() {
    if (fab || !document.body) return;
    var st = document.createElement('style'); st.textContent = CSS; document.head.appendChild(st);
    fab = document.createElement('button'); fab.className = 'bsn-fab'; fab.type = 'button'; fab.textContent = TXT.fab; fab.title = TXT.fabTip; fab.setAttribute('aria-label', TXT.fabTip);
    fab.addEventListener('click', function () { var g = W.__game; open({ boh: g && g.state ? { name: g.state.bohName, base: g.state.bohBase } : null, onClose: function () { try { g && g.setState({}); } catch (e) {} } }); fab.style.display = 'none'; });
    document.body.appendChild(fab); setInterval(showFab, 500); showFab();
  }
  W.BohSnake = { open: open, close: close, music: MUSIC, foods: FOODS, _state: function () { return G; }, _step: step };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
})(window);
