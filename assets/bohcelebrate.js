/* Boh · Lesson-finished celebration. One shared file, used identically by every level (Italiano 1-4 and AP).
   When a lesson's finish screen appears, a full-screen card plays four beats, about 7 seconds in all:
     1. Prof. Lo So claps and says one of her Boh puns while BC coins fall into the Boh purse and a counter adds up what the lesson earned.
     2. The student's own Boh (the student) bounces in.
     3. The student's line, "Now I know how to say ...", appears word by word and grows bigger.
     4. One "Continua" button.
   Tap, click or press Enter / Space / Esc at any time: the first one jumps to the end (full count, full line); the next one closes it.
   With "reduce motion" on, it shows the end state at once (no falling coins, no bouncing).
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
      if (document.getElementById('bfc-css')) return;
      var s = document.createElement('style'); s.id = 'bfc-css';
      s.textContent =
        '#bfc{position:fixed;inset:0;z-index:99980;background:rgba(14,42,91,.72);display:flex;align-items:center;justify-content:center;padding:12px;overflow:hidden;-webkit-tap-highlight-color:transparent}' +
        '#bfc .bfc-card{position:relative;width:100%;max-width:400px;max-height:100%;overflow:hidden;background:var(--pop-tint,#FEE5EE);border:3px solid var(--pop,#BC1E72);border-radius:28px;padding:14px 16px 12px;text-align:center;color:var(--text,#0E2A5B);display:flex;flex-direction:column;gap:6px}' +
        '#bfc .bfc-top{display:flex;align-items:center;justify-content:center;gap:16px;min-height:112px}' +
        '#bfc .bfc-prof{flex:none;height:112px;width:auto;object-fit:contain}' +
        '#bfc .bfc-pun{flex:1 1 0;min-width:0;max-width:240px;text-align:left;font-size:22px;position:relative;opacity:0;transform:scale(.85);transition:opacity .25s,transform .25s}' +
        '#bfc.bfc-on-pun .bfc-pun,#bfc.bfc-end .bfc-pun{opacity:1;transform:none}' +
        '#bfc .bfc-pun::before{content:"";position:absolute;left:-12px;top:50%;margin-top:-10px;border:10px solid transparent;border-left:0;border-right-color:var(--card-border,#CBD5E1)}' +
        '#bfc .bfc-pun::after{content:"";position:absolute;left:-8px;top:50%;margin-top:-8px;border:8px solid transparent;border-left:0;border-right-color:var(--card-bg,#fff)}' +
        '#bfc .bfc-pun small{display:none;font:700 13px/1.2 system-ui,sans-serif;color:var(--text-muted,#46566E);margin-top:2px}' +
        'html[data-en="1"] #bfc .bfc-pun small{display:block}' +
        '#bfc .bfc-stage{position:relative;height:150px;display:flex;align-items:flex-end;justify-content:center;gap:10px}' +
        '#bfc .bfc-chest{height:132px;width:132px;object-fit:contain;position:relative;z-index:1}' +
        '#bfc .bfc-chest.hit{animation:bfcHit .18s ease-out}' +
        '@keyframes bfcHit{0%{transform:scale(1)}40%{transform:scale(1.07)}100%{transform:scale(1)}}' +
        '#bfc .bfc-count{align-self:center;display:flex;align-items:center;gap:6px;font:900 38px/1 system-ui,sans-serif;color:var(--text,#0E2A5B)}' +
        '#bfc .bfc-count img{height:40px;width:40px}' +
        '#bfc .bfc-count small{font:800 18px system-ui,sans-serif}' +
        '#bfc .bfc-coin{position:absolute;top:-30px;width:30px;height:auto;z-index:2;opacity:0;pointer-events:none}' +
        '#bfc .bfc-coin.fall{animation:bfcFall .62s cubic-bezier(.45,.05,.7,.6) forwards}' +
        '@keyframes bfcFall{0%{opacity:1;transform:translateY(0)}85%{opacity:1}100%{opacity:0;transform:translateY(var(--dy,120px)) scale(.7)}}' +
        '#bfc .bfc-me{display:flex;align-items:center;justify-content:center;gap:12px;min-height:150px;opacity:0;transform:translateY(12px);transition:opacity .25s,transform .25s}' +
        '#bfc.bfc-on-me .bfc-me,#bfc.bfc-end .bfc-me{opacity:1;transform:none}' +
        '#bfc .bfc-doll{flex:none;position:relative}#bfc .bfc-doll .doll{display:block!important;animation:none!important}' +
        '#bfc.bfc-on-me:not(.bfc-end) .bfc-doll{animation:bfcBounce .7s ease-in-out infinite}' +
        '@keyframes bfcBounce{0%,100%{transform:translateY(0)}35%{transform:translateY(-16px) rotate(-3deg)}70%{transform:translateY(0) rotate(3deg)}}' +
        '#bfc .bfc-say{margin:0;flex:1 1 0;min-width:0;text-align:left;font:800 22px/1.2 system-ui,sans-serif;transform-origin:left center}' +
        '#bfc .bfc-say span{opacity:0;transition:opacity .2s}' +
        '#bfc .bfc-say span.on{opacity:1}' +
        '#bfc .bfc-go{display:block;width:100%;min-height:54px;margin-top:2px;border:0;border-radius:18px;background:var(--primary-bg,#1A5CDF);color:var(--primary-text,#fff);font:900 21px system-ui,sans-serif;cursor:pointer;visibility:hidden}' +
        '#bfc.bfc-end .bfc-go{visibility:visible}' +
        '#bfc .bfc-go:focus-visible{outline:3px solid var(--text,#0E2A5B);outline-offset:3px}' +
        '#bfc .bfc-hint{font:700 12px system-ui,sans-serif;color:var(--text-muted,#46566E);min-height:14px}' +
        '#bfc.bfc-end .bfc-hint{visibility:hidden}' +
        '#bfc .bfc-sr{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}' +
        '@media (max-height:600px){#bfc .bfc-top{min-height:84px}#bfc .bfc-prof{height:84px}#bfc .bfc-stage{height:112px}#bfc .bfc-chest{height:96px;width:96px}#bfc .bfc-count{font-size:30px}#bfc .bfc-me{min-height:110px}#bfc .bfc-pun{font-size:19px}#bfc .bfc-say{font-size:19px}}' +
        '@media (max-height:460px){#bfc{padding:6px}#bfc .bfc-card{padding:8px 12px 8px;gap:4px}#bfc .bfc-top{min-height:60px;gap:12px}#bfc .bfc-prof{height:60px}#bfc .bfc-pun{font-size:16px;padding:6px 10px}#bfc .bfc-pun small{font-size:11px}#bfc .bfc-stage{height:78px}#bfc .bfc-chest{height:70px;width:70px}#bfc .bfc-count{font-size:24px}#bfc .bfc-count img{height:26px;width:26px}#bfc .bfc-count small{font-size:13px}#bfc .bfc-me{min-height:84px;gap:8px}#bfc .bfc-say{font-size:15px}#bfc .bfc-go{min-height:42px;font-size:17px;border-radius:14px}#bfc .bfc-hint{display:none}}' +
        '@media (prefers-reduced-motion:reduce){#bfc .bfc-coin,#bfc .bfc-doll,#bfc .bfc-chest,#bfc .bfc-pun,#bfc .bfc-me{animation:none!important;transition:none!important}}';
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

    function setCount(n) { var b = el && el.querySelector('.bfc-count b'); if (b) b.textContent = '+' + n; }

    function showWords(upTo) {
      var sp = el.querySelectorAll('.bfc-say span');
      for (var i = 0; i < sp.length; i++) sp[i].classList.toggle('on', i < upTo);
      var say = el.querySelector('.bfc-say');
      /* the wording grows as it appears: starts at 60% size, ends at full size */
      var f = lineWords.length ? Math.min(1, upTo / lineWords.length) : 1;
      say.style.transform = 'scale(' + (0.6 + 0.4 * f).toFixed(3) + ')';
    }

    function finish() {
      if (!el || done) return;
      done = true; clearAll();
      el.classList.add('bfc-on-pun', 'bfc-on-me', 'bfc-end');
      setCount(earned); showWords(lineWords.length);
      var sr = el.querySelector('.bfc-sr');
      if (sr) sr.textContent = 'Lesson finished. You earned ' + earned + ' BC. ' + lineWords.join(' ');
      var go = el.querySelector('.bfc-go'); if (go) { try { go.focus({ preventScroll: true }); } catch (e) { go.focus(); } }
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
      css(); done = false; earned = (typeof window.__bfcForce === 'number') ? window.__bfcForce : readEarned(); lastFocus = document.activeElement; window.__bfcForce = undefined;
      lineWords = line.split(' ');
      var pun = null; try { pun = window.BohPuns ? window.BohPuns.today() : null; } catch (e) {}
      el = document.createElement('div'); el.id = 'bfc'; el.setAttribute('role', 'dialog'); el.setAttribute('aria-modal', 'true'); el.setAttribute('aria-label', 'Lesson finished');
      el.innerHTML =
        '<div class="bfc-card">' +
          '<div class="bfc-top"><img class="bfc-prof" src="' + base + 'guide/bust/clap.webp" alt="Prof. Lo So applaude">' +
            (pun ? '<div class="ls-bubble bfc-pun">' + esc(pun.it) + '<small>' + esc(pun.en) + '</small></div>' : '') + '</div>' +
          '<div class="bfc-stage"><img class="bfc-chest" src="' + base + 'tiles/boh-borsa.webp" alt="">' +
            '<div class="bfc-count" aria-hidden="true"><img src="' + base + 'bc.svg" alt=""><b>+0</b><small>BC</small></div></div>' +
          '<div class="bfc-me"><div class="bfc-doll" aria-hidden="true"></div><p class="bfc-say">' +
            lineWords.map(function (w) { return '<span>' + esc(w) + ' </span>'; }).join('') + '</p></div>' +
          '<button type="button" class="bfc-go">Continua</button>' +
          '<div class="bfc-hint" aria-hidden="true">Tap to skip</div>' +
          '<div class="bfc-sr" role="status" aria-live="polite"></div>' +
        '</div>';
      document.body.appendChild(el);
      document.addEventListener('keydown', onKey, true);
      el.addEventListener('click', function () { if (!done) finish(); else close(); });

      /* the student's own Boh: a copy of the one already on the finish screen, scaled to 150px tall (smaller on short screens) */
      try {
        var src = document.querySelector('.ls-boh .doll') || document.querySelector('.doll');
        var slot = el.querySelector('.bfc-doll');
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
      later(function () { if (el) el.classList.add('bfc-on-pun'); }, 150);
      var stage = el.querySelector('.bfc-stage'), chest = el.querySelector('.bfc-chest');
      var nCoins = Math.max(0, Math.min(16, Math.ceil(earned / 2)));
      for (var i = 0; i < nCoins; i++) (function (i) {
        later(function () {
          if (!el) return;
          var c = document.createElement('img'); c.className = 'bfc-coin'; c.src = base + 'bc-coin.webp'; c.alt = '';
          var sw = stage.clientWidth || 300, cx = sw / 2 - 13 + (Math.random() * 56 - 28);
          c.style.left = cx + 'px'; c.style.top = '-30px'; c.style.setProperty('--dy', (stage.clientHeight * 0.75) + 'px');
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
      later(function () { if (el) { el.classList.add('bfc-on-me'); showWords(0); } }, t2);
      var step = 230;
      for (var w = 1; w <= lineWords.length; w++) (function (w) { later(function () { showWords(w); }, t2 + 500 + w * step); })(w);
      /* beat 4 */
      later(finish, t2 + 500 + lineWords.length * step + 600);
    }

    function esc(t) { return String(t).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }

    /* start when the finish screen appears (it stays put on later re-draws, so this runs once per finish) */
    setInterval(function () {
      var there = !!document.querySelector('.ls-done');
      if (there && !wasThere) later(function () { if (document.querySelector('.ls-done')) play(); }, 350);
      wasThere = there;
    }, 300);

    /* teacher preview: ?celebrate=30 */
    try {
      var pm = /[?&]celebrate=(\d{1,4})(&|$)/.exec(location.search);
      if (pm) { window.__bfcForce = parseInt(pm[1], 10); setTimeout(function () { play(); }, 1800); }
    } catch (e) {}

    window.BohCelebrate = { play: play, close: close };
  } catch (e) { try { console.warn('bohcelebrate', e); } catch (_) {} }
})();
