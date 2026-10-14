/* Boh · Lesson-finished celebration. One shared file, used identically by every level (Italiano 1-4 and AP).
   When a lesson's finish screen appears, a full-screen card plays four beats, about 7 seconds in all:
     1. Prof. Lo So claps and says one of her Boh puns while BC coins fall into the Boh purse and a counter adds up what the lesson earned.
     2. The student's own Boh (the student) bounces in.
     3. The student's line, "Now I know how to say ...", appears word by word and grows bigger.
     4. One "Continua" button.
   Tap, click or press Enter / Space / Esc at any time: the first one jumps to the end (full count, full line); the next one closes it.
   With "reduce motion" on, it shows the end state at once (no falling coins, no bouncing).
   Own names: every id, class and style id here starts with "bfin" so it can never clash with another file (flashcards.js uses "bfc").
   Reads only: the BC earned from the finish screen's own stats, the student's Boh from the page, the pun from BohPuns, the line from BohFinish.
   It never changes a score, price or saved progress. Nothing happens if those pieces are missing.
   Teacher preview: add ?celebrate=30 to any level's address to play it at once with 30 BC (no lesson needed). Changes nothing.
   Created by Assunta Scotto, 2026. Not for redistribution. */
(function () {
  try {
    if (window.BohCelebrate) return;
    var base = '../assets/';
    try { base = document.currentScript.src.replace(/bohcelebrate\.js.*$/, ''); } catch (e) {}
    /* ART: assets/tiles/boh-borsa.webp (the purse) and assets/bc-coin.webp (one falling coin). Replace those two files to change the look; no code change needed. */
    var el = null, timers = [], raf = 0, done = false, earned = 0, lineWords = [], wasThere = false, lastFocus = null;

    function reduced() { try { return window.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) { return false; } }
    function later(fn, ms) { var t = setTimeout(fn, ms); timers.push(t); return t; }
    function clearAll() { timers.forEach(clearTimeout); timers = []; if (raf) cancelAnimationFrame(raf); raf = 0; }

    function css() {
      if (document.getElementById('bfin-css')) return;
      var s = document.createElement('style'); s.id = 'bfin-css';
      s.textContent =
        '#bfin{position:fixed;inset:0;z-index:99980;background:rgba(14,42,91,.72);display:flex;align-items:center;justify-content:center;padding:12px;overflow:hidden;-webkit-tap-highlight-color:transparent}' +
        '#bfin .bfin-card{position:relative;width:100%;max-width:400px;max-height:100%;overflow:hidden;background:var(--pop-tint,#FEE5EE);border:3px solid var(--pop,#BC1E72);border-radius:28px;padding:14px 16px 12px;text-align:center;color:var(--text,#0E2A5B);display:flex;flex-direction:column;gap:6px}' +
        '#bfin .bfin-top{display:flex;align-items:center;justify-content:center;gap:16px;min-height:112px}' +
        '#bfin .bfin-prof{flex:none;height:112px;width:auto;object-fit:contain}' +
        '#bfin .bfin-pun{flex:1 1 0;min-width:0;max-width:240px;text-align:left;font-size:22px;position:relative;opacity:0;transform:scale(.85);transition:opacity .25s,transform .25s}' +
        '#bfin.bfin-on-pun .bfin-pun,#bfin.bfin-end .bfin-pun{opacity:1;transform:none}' +
        '#bfin .bfin-pun::before{content:"";position:absolute;left:-12px;top:50%;margin-top:-10px;border:10px solid transparent;border-left:0;border-right-color:var(--card-border,#CBD5E1)}' +
        '#bfin .bfin-pun::after{content:"";position:absolute;left:-8px;top:50%;margin-top:-8px;border:8px solid transparent;border-left:0;border-right-color:var(--card-bg,#fff)}' +
        '#bfin .bfin-pun small{display:none;font:700 13px/1.2 system-ui,sans-serif;color:var(--text-muted,#46566E);margin-top:2px}' +
        'html[data-en="1"] #bfin .bfin-pun small{display:block}' +
        '#bfin .bfin-stage{position:relative;height:150px;display:flex;align-items:flex-end;justify-content:center;gap:10px}' +
        '#bfin .bfin-chest{height:132px;width:132px;object-fit:contain;position:relative;z-index:1}' +
        '#bfin .bfin-chest.hit{animation:bfinHit .18s ease-out}' +
        '@keyframes bfinHit{0%{transform:scale(1)}40%{transform:scale(1.07)}100%{transform:scale(1)}}' +
        '#bfin .bfin-count{align-self:center;display:flex;align-items:center;gap:6px;font:900 38px/1 system-ui,sans-serif;color:var(--text,#0E2A5B)}' +
        '#bfin .bfin-count img{height:40px;width:40px}' +
        '#bfin .bfin-count small{font:800 18px system-ui,sans-serif}' +
        '#bfin .bfin-coin{position:absolute;top:-30px;width:30px;height:auto;z-index:0;opacity:0;pointer-events:none}' +
        '#bfin .bfin-coin.fall{animation:bfinFall .62s cubic-bezier(.45,.05,.7,.6) forwards}' +
        '@keyframes bfinFall{0%{opacity:1;transform:translateY(0)}85%{opacity:1}100%{opacity:0;transform:translateY(var(--dy,120px)) scale(.55)}}' +
        '#bfin .bfin-me{display:flex;align-items:center;justify-content:center;gap:12px;min-height:150px;opacity:0;transform:translateY(12px);transition:opacity .25s,transform .25s}' +
        '#bfin.bfin-on-me .bfin-me,#bfin.bfin-end .bfin-me{opacity:1;transform:none}' +
        '#bfin .bfin-doll{flex:none;position:relative}#bfin .bfin-doll .doll{display:block!important;animation:none!important}' +
        '#bfin.bfin-on-me:not(.bfin-end) .bfin-doll{animation:bfinBounce .7s ease-in-out infinite}' +
        '@keyframes bfinBounce{0%,100%{transform:translateY(0)}35%{transform:translateY(-16px) rotate(-3deg)}70%{transform:translateY(0) rotate(3deg)}}' +
        '#bfin .bfin-say{margin:0;flex:1 1 0;min-width:0;text-align:left;font:800 22px/1.2 system-ui,sans-serif;transform-origin:left center}' +
        '#bfin .bfin-say span{opacity:0;transition:opacity .2s}' +
        '#bfin .bfin-say span.on{opacity:1}' +
        '#bfin .bfin-go{display:block;width:100%;min-height:54px;margin-top:2px;border:0;border-radius:18px;background:var(--primary-bg,#1A5CDF);color:var(--primary-text,#fff);font:900 21px system-ui,sans-serif;cursor:pointer;visibility:hidden}' +
        '#bfin.bfin-end .bfin-go{visibility:visible}' +
        '#bfin .bfin-go:focus-visible{outline:3px solid var(--text,#0E2A5B);outline-offset:3px}' +
        '#bfin .bfin-hint{font:700 12px system-ui,sans-serif;color:var(--text-muted,#46566E);min-height:14px}' +
        '#bfin.bfin-end .bfin-hint{visibility:hidden}' +
        '#bfin .bfin-sr{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}' +
        '@media (max-height:600px){#bfin .bfin-top{min-height:84px}#bfin .bfin-prof{height:84px}#bfin .bfin-stage{height:112px}#bfin .bfin-chest{height:96px;width:96px}#bfin .bfin-count{font-size:30px}#bfin .bfin-me{min-height:110px}#bfin .bfin-pun{font-size:19px}#bfin .bfin-say{font-size:19px}}' +
        '@media (max-height:460px){#bfin{padding:6px}#bfin .bfin-card{padding:8px 12px 8px;gap:4px}#bfin .bfin-top{min-height:60px;gap:12px}#bfin .bfin-prof{height:60px}#bfin .bfin-pun{font-size:16px;padding:6px 10px}#bfin .bfin-pun small{font-size:11px}#bfin .bfin-stage{height:78px}#bfin .bfin-chest{height:70px;width:70px}#bfin .bfin-count{font-size:24px}#bfin .bfin-count img{height:26px;width:26px}#bfin .bfin-count small{font-size:13px}#bfin .bfin-me{min-height:84px;gap:8px}#bfin .bfin-say{font-size:15px}#bfin .bfin-go{min-height:42px;font-size:17px;border-radius:14px}#bfin .bfin-hint{display:none}}' +
        '@media (prefers-reduced-motion:reduce){#bfin .bfin-coin,#bfin .bfin-doll,#bfin .bfin-chest,#bfin .bfin-pun,#bfin .bfin-me{animation:none!important;transition:none!important}}';
      document.head.appendChild(s);
    }

    /* what the lesson earned: read from the finish screen's own stats ("+30 / BC from the lesson") */
    function readEarned() {
      try {
        var divs = document.querySelectorAll('.ls-stats > div');
        for (var i = 0; i < divs.length; i++) {
          if (/BC from the lesson/i.test(divs[i].textContent)) { var n = parseInt(divs[i].textContent.replace(/[^\d]/g, ''), 10); return isNaN(n) ? 0 : n; }
        }
      } catch (e) {}
      return 0;
    }

    function setCount(n) { var b = el && el.querySelector('.bfin-count b'); if (b) b.textContent = '+' + n; }

    function showWords(upTo) {
      var sp = el.querySelectorAll('.bfin-say span');
      for (var i = 0; i < sp.length; i++) sp[i].classList.toggle('on', i < upTo);
      var say = el.querySelector('.bfin-say');
      /* the wording grows as it appears: starts at 60% size, ends at full size */
      var f = lineWords.length ? Math.min(1, upTo / lineWords.length) : 1;
      say.style.transform = 'scale(' + (0.6 + 0.4 * f).toFixed(3) + ')';
    }

    function finish() {
      if (!el || done) return;
      done = true; clearAll();
      el.classList.add('bfin-on-pun', 'bfin-on-me', 'bfin-end');
      setCount(earned); showWords(lineWords.length);
      var sr = el.querySelector('.bfin-sr');
      if (sr) sr.textContent = 'Lesson finished. You earned ' + earned + ' BC. ' + lineWords.join(' ');
      var go = el.querySelector('.bfin-go'); if (go) { try { go.focus({ preventScroll: true }); } catch (e) { go.focus(); } }
    }

    function close() {
      clearAll();
      if (el && el.parentNode) el.parentNode.removeChild(el);
      el = null; done = false;
      document.removeEventListener('keydown', onKey, true);
      try { if (lastFocus && lastFocus.focus) lastFocus.focus({ preventScroll: true }); } catch (e) {}
    }

    function onKey(e) {
      if (!el) return;
      var k = e.key;
      if (k === 'Enter' || k === ' ' || k === 'Escape' || k === 'Spacebar') {
        e.preventDefault(); e.stopPropagation();
        if (!done) finish(); else close();
      }
    }

    function play() {
      if (el) return;
      var line = '';
      try { line = window.BohFinish ? window.BohFinish.line(window.BT_UNIT || (typeof BT_UNIT !== 'undefined' ? BT_UNIT : '')) : ''; } catch (e) {}
      if (!line) return;                       /* nothing to say: do nothing, never block the finish screen */
      var want = (typeof window.__bfinForce === 'number') ? window.__bfinForce : readEarned();
      if (!(want > 0)) { window.__bfinForce = undefined; return; }   /* only a finished lesson that earned BC celebrates (not the small stop cards, never "+0 BC") */
      css(); done = false; earned = want; lastFocus = document.activeElement; window.__bfinForce = undefined;
      lineWords = line.split(' ');
      var pun = null; try { pun = window.BohPuns ? window.BohPuns.today() : null; } catch (e) {}
      el = document.createElement('div'); el.id = 'bfin'; el.setAttribute('role', 'dialog'); el.setAttribute('aria-modal', 'true'); el.setAttribute('aria-label', 'Lesson finished');
      el.innerHTML =
        '<div class="bfin-card">' +
          '<div class="bfin-top"><img class="bfin-prof" src="' + base + 'guide/bust/clap.webp" alt="Prof. Lo So applaude">' +
            (pun ? '<div class="ls-bubble bfin-pun">' + esc(pun.it) + '<small>' + esc(pun.en) + '</small></div>' : '') + '</div>' +
          '<div class="bfin-stage"><img class="bfin-chest" src="' + base + 'tiles/boh-borsa.webp" alt="">' +
            '<div class="bfin-count" aria-hidden="true"><img src="' + base + 'bc.svg" alt=""><b>+0</b><small>BC</small></div></div>' +
          '<div class="bfin-me"><div class="bfin-doll" aria-hidden="true"></div><p class="bfin-say">' +
            lineWords.map(function (w) { return '<span>' + esc(w) + ' </span>'; }).join('') + '</p></div>' +
          '<button type="button" class="bfin-go">Continua</button>' +
          '<div class="bfin-hint" aria-hidden="true">Tap to skip</div>' +
          '<div class="bfin-sr" role="status" aria-live="polite"></div>' +
        '</div>';
      document.body.appendChild(el);
      document.addEventListener('keydown', onKey, true);
      el.addEventListener('click', function () { if (!done) finish(); else close(); });

      /* the student's own Boh: a copy of the one already on the finish screen, scaled to 150px tall (smaller on short screens) */
      try {
        var src = document.querySelector('.ls-boh .doll') || document.querySelector('.doll');
        var slot = el.querySelector('.bfin-doll');
        if (src && slot) {
          var w = src.offsetWidth || 110, h = src.offsetHeight || 286;
          var c = src.cloneNode(true); c.classList.remove('idle'); var TH = window.innerHeight <= 460 ? 80 : (window.innerHeight <= 600 ? 110 : 150);
          c.style.cssText = 'width:' + w + 'px;height:' + h + 'px;display:block;transform-origin:top left;transform:scale(' + (TH / h) + ')';
          /* the Boh is drawn by page styles that depend on where it sits, so copy each layer's final look onto the copy */
          for (var li = 0; li < c.children.length && li < src.children.length; li++) {
            var a = getComputedStyle(src.children[li]), z = c.children[li].style;
            ['backgroundImage', 'backgroundSize', 'backgroundPosition', 'backgroundRepeat', 'backgroundBlendMode', 'webkitMaskImage', 'maskImage', 'webkitMaskSize', 'maskSize', 'webkitMaskPosition', 'maskPosition', 'filter'].forEach(function (k) { try { z[k] = a[k]; } catch (e) {} });
          }
          slot.style.width = Math.round(w * TH / h) + 'px'; slot.style.height = TH + 'px'; slot.appendChild(c);
        }
      } catch (e) {}

      if (reduced()) { finish(); return; }

      /* beat 1: Prof + pun, coins fall into the purse, the counter adds up */
      var DUR = Math.max(900, Math.min(2600, 900 + earned * 45));
      later(function () { if (el) el.classList.add('bfin-on-pun'); }, 150);
      var stage = el.querySelector('.bfin-stage'), chest = el.querySelector('.bfin-chest');
      var nCoins = Math.max(0, Math.min(16, Math.ceil(earned / 2)));
      for (var i = 0; i < nCoins; i++) (function (i) {
        later(function () {
          if (!el) return;
          var c = document.createElement('img'); c.className = 'bfin-coin'; c.src = base + 'bc-coin.webp'; c.alt = '';
          /* aim at the purse itself: centred over its opening, falling until the coin is behind the purse's front (coins sit under the purse in the stacking order) */
          var cw = 30, cl = chest ? chest.offsetLeft + chest.offsetWidth / 2 : (stage.clientWidth || 300) / 2, ch = chest ? chest.offsetHeight : 120, ct = chest ? chest.offsetTop : 20;
          var cx = cl - cw / 2 + (Math.random() * 20 - 10);
          c.style.left = cx + 'px'; c.style.top = '-30px'; c.style.setProperty('--dy', Math.max(40, ct + ch * 0.42 + 30) + 'px');
          stage.appendChild(c); c.classList.add('fall');
          later(function () { if (chest) { chest.classList.remove('hit'); void chest.offsetWidth; chest.classList.add('hit'); } if (c.parentNode) c.parentNode.removeChild(c); }, 600);
        }, 300 + i * (DUR / Math.max(1, nCoins)));
      })(i);
      var t0 = performance.now() + 300;
      (function tick(now) {
        if (!el || done) return;
        var f = Math.max(0, Math.min(1, (now - t0) / (DUR + 500)));
        setCount(Math.round(earned * (1 - Math.pow(1 - f, 2))));
        if (f < 1) raf = requestAnimationFrame(tick); else setCount(earned);
      })(performance.now());

      /* beat 2: the student's Boh bounces in; beat 3: the line appears word by word, growing */
      var t2 = 300 + DUR + 700;
      later(function () { if (el) { el.classList.add('bfin-on-me'); showWords(0); } }, t2);
      var step = 230;
      for (var w = 1; w <= lineWords.length; w++) (function (w) { later(function () { showWords(w); }, t2 + 500 + w * step); })(w);
      /* beat 4 */
      later(finish, t2 + 500 + lineWords.length * step + 600);
    }

    function esc(t) { return String(t).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }

    /* start when the finish screen appears (it stays put on later re-draws, so this runs once per finish) */
    setInterval(function () {
      var there = !!document.querySelector('.ls-done .ls-stats');   /* the LEZIONE FINITA screen only; the between-stops card has no stats */
      if (there && !wasThere) later(function () { if (document.querySelector('.ls-done .ls-stats')) play(); }, 350);
      wasThere = there;
    }, 300);

    /* teacher preview: ?celebrate=30 */
    try {
      var pm = /[?&]celebrate=(\d{1,4})(&|$)/.exec(location.search);
      if (pm) { window.__bfinForce = parseInt(pm[1], 10); setTimeout(function () { play(); }, 1800); }
    } catch (e) {}

    window.BohCelebrate = { play: play, close: close };
  } catch (e) { try { console.warn('bohcelebrate', e); } catch (_) {} }
})();
