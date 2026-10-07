/* Boh · front door. Created by Assunta Scotto, 2026. All rights reserved. Not for redistribution.
   App-style pages with no scrolling: opening screen, make your Boh, name it, welcome, choose a level.
   The shared Boh lives in localStorage 'boh_profile_v1' (every level reads and writes the same record).
   Layouts: phone (390x844) and Chromebook (1366x768). Each is a fixed stage that is scaled to fit the screen. */
(function () {
  'use strict';
  var KEY = 'boh_profile_v1', L = window.BohLook;
  var stage = document.getElementById('stage'), shell = document.getElementById('shell');
  if (!stage || !shell || !L) return;

  function get() { try { var p = JSON.parse(localStorage.getItem(KEY) || 'null'); return p && p.bohBase && p.bohName ? p : null; } catch (e) { return null; } }
  function put(p) { try { localStorage.setItem(KEY, JSON.stringify(p)); } catch (e) {} }
  function esc(t) { return String(t).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function fmt(n) { return (n || 0).toLocaleString('it-IT'); }
  var reduce = false; try { reduce = matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) {}

  /* the opening screen alternates girl / boy on every visit (never the same one twice in a row) */
  function nextGender() {
    var g = Math.random() < 0.5 ? 'girl' : 'boy';
    try { var l = localStorage.getItem('boh_land_g'); if (l === 'girl' || l === 'boy') g = l === 'girl' ? 'boy' : 'girl'; localStorage.setItem('boh_land_g', g); } catch (e) {}
    return g;
  }
  var ORDER = ['land', 'look', 'name', 'boh', 'hub'];
  var S = { scr: null, P: get(), d: null, fresh: false, wide: false, k: 1, g: nextGender(), last: null, next: null };
  var cur = null;
  var LASTKEY = 'boh_last_level_v1';
  function lvlByHref(h) { for (var i = 0; i < LEVELS.length; i++) if (LEVELS[i].href === h) return LEVELS[i]; return null; }
  function getLast() { try { return lvlByHref(localStorage.getItem(LASTKEY) || ''); } catch (e) { return null; } }
  function setLast(h) { try { if (lvlByHref(h)) localStorage.setItem(LASTKEY, h); } catch (e) {} }
  function getNext() { var m = /[?&]next=(italiano[1-4]|ap)(?:[\/&#]|$)/.exec(location.search); return m ? m[1] + '/' : null; }

  var ARW = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12h15M13 6l6 6-6 6" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  var BK = '<svg viewBox="0 0 24 24" width="55%" height="55%" aria-hidden="true"><path d="M15 5l-7 7 7 7" fill="none" stroke="#0E2A5B" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  var A = 'assets/front/';

  var LEVELS = [
    { t: 'Italiano 1', href: 'italiano1/', c: '#6FB7A0', on: '#10231D', act: 'Novice Low to Mid', topic: 'Words, phrases and first short sentences' },
    { t: 'Italiano 2', href: 'italiano2/', c: '#E0AA55', on: '#2A1C08', act: 'Novice Mid to High', topic: 'Simple sentences about everyday life' },
    { t: 'Italiano 3', href: 'italiano3/', c: '#E88A6C', on: '#241318', act: 'Novice High to Intermediate Low', topic: 'Questions, answers and simple past and present' },
    { t: 'Italiano 4', href: 'italiano4/', c: '#B79AE0', on: '#1C1520', act: 'Intermediate Low to Mid', topic: 'Connected sentences about the past, present and future' },
    { t: 'AP Italiano', href: 'ap/', c: '#8FA3C8', on: '#111827', act: 'Intermediate Mid to High', topic: 'Hearing, reading and speaking in full paragraphs' }
  ];

  /* ---------- small builders ---------- */
  function box(css, inner, cls) { return '<div class="fa ' + (cls || '') + '" style="' + css + '">' + inner + '</div>'; }
  function img(src, css, anim) { return '<img class="fa" src="' + src + '" alt="" style="' + css + (anim ? ';animation:' + anim : '') + '">'; }
  function btn(cls, go, css, label, extra) { return '<button type="button" class="fbtn ' + cls + '" data-go="' + go + '" style="' + css + '"' + (extra || '') + '>' + label + '</button>'; }
  function back(go, css) { return '<button type="button" class="fback" data-go="' + go + '" aria-label="Back" style="' + css + '">' + BK + '</button>'; }
  function dollBox(p, h, left, top, w) {
    var dw = Math.round(h * 150 / 390);
    return '<div class="fdoll" style="left:' + left + 'px;top:' + top + 'px;width:' + (w || dw) + 'px;height:' + h + 'px;--dw:' + dw + 'px;--dh:' + h + 'px">' + L.dollHTML(p, 'dM') + '</div>';
  }
  function draftProfile() { var d = S.d; return { bohBase: d.base, bohSkin: d.skin, bohHair: d.hair, bohName: d.name || 'Boh', equipped: S.P ? S.P.equipped : {} }; }
  function walletHTML(p, css, fs) {
    var bc = typeof p.cashi === 'number' ? p.cashi : 0;
    return '<div class="fwal" style="' + css + ';font-size:' + fs + 'px"><img src="assets/bc-white.svg" alt="">' + fmt(bc) + ' <small>Boh Cashi</small></div>';
  }
  function abtn(cls, href, css, label, lvl) { return '<a class="fbtn ' + cls + '" href="' + href + '"' + (lvl ? ' data-lvl="' + lvl + '"' : '') + ' style="' + css + '">' + label + '</a>'; }
  function nm16(n) { return '<span style="display:inline-block;max-width:150px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">' + n + '</span>'; }
  function nameOf(p) { return esc((p && p.bohName) || 'Boh'); }

  /* ---------- screens ---------- */
  function tpl(name) {
    var P = !S.wide, o = '', g = S.g, p = S.P;
    var dl = function (ms) { return reduce ? 0 : ms; };
    if (name === 'land') {
      /* opening screen: one slider, "Boh..." (shrug) to "Lo so!" (earned look). Drag, tap or use the arrow keys. */
      var sl = function (css) {
        var q = typeof S.sp === 'number' ? S.sp : 50;
        return '<div class="fsl fa" role="slider" tabindex="0" aria-label="Slide from Boh, I don&rsquo;t know, to Lo so, I know" aria-valuemin="0" aria-valuemax="100" aria-valuenow="' + Math.round(q) + '" aria-valuetext="' + (q > 50 ? 'Boh' : 'Lo so') + '" style="' + css + ';--p:' + q + '%">' +
          '<img src="' + A + 's-' + g + '-shrug.webp" alt="" draggable="false">' +
          '<img class="fsl-b" src="' + A + 's-' + g + '-earned.webp" alt="" draggable="false" style="clip-path:inset(0 0 0 ' + q + '%)">' +
          '<i class="fsl-line"></i><i class="fsl-knob"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 6l-6 6 6 6M15 6l6 6-6 6" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg></i></div>';
      };
      if (P) {
        o += box('left:0;right:0;top:20px;text-align:center;font:800 12px system-ui;letter-spacing:.14em;color:#4F5E80;animation:ffade .6s both', 'THE ITALIAN LEARNING GAME');
        o += img(A + 'boh.webp', 'left:135px;top:42px;width:120px;animation-delay:' + dl(100) + 'ms', 'fpop .5s both');
        o += box('left:0;right:0;top:104px;text-align:center;font:900 32px/1.1 system-ui;color:#0E2A5B;animation:ffade .6s both;animation-delay:' + dl(300) + 'ms', 'Da boh a lo so!');
        o += box('left:67px;top:158px;font:800 16px system-ui;color:#4F5E80', 'Boh&hellip;');
        o += box('right:67px;top:158px;font:800 16px system-ui;color:#0E2A5B', 'Lo so!');
        o += sl('left:67px;top:186px;width:256px;height:384px;animation:ffade .6s both;animation-delay:' + dl(450) + 'ms');
        o += box('left:0;right:0;top:582px;text-align:center;font:800 19px/1.3 system-ui;white-space:nowrap;color:#0E2A5B;animation:ffade .6s both;animation-delay:' + dl(700) + 'ms',
          'Learn Italian. Earn Boh Cashi <img src="assets/bc-black.svg" alt="BC" style="height:28px;vertical-align:-8px">.<br>Build a Boh like no other.');
        o += box('left:0;right:0;top:648px;text-align:center;font:600 14px system-ui;color:#4F5E80;animation:ffade .6s both;animation-delay:' + dl(850) + 'ms', 'Boh is Italian for &ldquo;I don&rsquo;t know.&rdquo;');
        o += btn('fp', p ? 'boh' : 'look', 'left:24px;right:24px;top:690px;height:60px;font-size:20px;animation:ffade .6s both;animation-delay:' + dl(1000) + 'ms', p ? 'Continue as ' + nm16(nameOf(p)) + ' ' + ARW : 'Start my Boh ' + ARW);
        o += btn('fs', 'load', 'left:24px;right:24px;top:762px;height:56px;font-size:18px;animation:ffade .6s both;animation-delay:' + dl(1100) + 'ms', 'I already have a Boh');
        o += box('left:0;right:50px;top:826px;text-align:center;font:600 10.5px system-ui;color:#4F5E80', 'Created by Assunta Scotto &middot; &copy; 2026 &middot; All rights reserved');
        o += '<a class="flnk" href="teacher/" style="right:6px;width:44px;top:820px;font-size:12px;font-weight:600">Prof</a>';
      } else {
        o += box('left:0;right:0;top:30px;text-align:center;font:800 15px system-ui;letter-spacing:.16em;color:#4F5E80;animation:ffade .6s both', 'THE ITALIAN LEARNING GAME');
        o += box('left:150px;top:74px;font:800 20px system-ui;color:#4F5E80', 'Boh&hellip;');
        o += box('left:150px;width:360px;top:74px;text-align:right;font:800 20px system-ui;color:#0E2A5B', 'Lo so!');
        o += sl('left:150px;top:108px;width:360px;height:540px;animation:ffade .6s both;animation-delay:' + dl(450) + 'ms');
        o += img(A + 'boh.webp', 'left:825px;top:80px;width:200px;animation-delay:' + dl(100) + 'ms', 'fpop .5s both');
        o += box('left:600px;width:650px;top:200px;text-align:center;font:900 54px/1.1 system-ui;color:#0E2A5B;animation:ffade .6s both;animation-delay:' + dl(300) + 'ms', 'Da boh a lo so!');
        o += box('left:600px;width:650px;top:290px;text-align:center;font:800 30px/1.3 system-ui;white-space:nowrap;color:#0E2A5B;animation:ffade .6s both;animation-delay:' + dl(700) + 'ms',
          'Learn Italian. Earn Boh Cashi <img src="assets/bc-black.svg" alt="BC" style="height:40px;vertical-align:-11px">.<br>Build a Boh like no other.');
        o += box('left:600px;width:650px;top:400px;text-align:center;font:600 20px system-ui;color:#4F5E80;animation:ffade .6s both;animation-delay:' + dl(850) + 'ms', 'Boh is Italian for &ldquo;I don&rsquo;t know.&rdquo;');
        o += btn('fp', p ? 'boh' : 'look', 'left:600px;top:478px;width:' + (p ? 340 : 300) + 'px;height:76px;font-size:26px;animation:ffade .6s both;animation-delay:' + dl(1000) + 'ms', p ? 'Continue as ' + nm16(nameOf(p)) + ' ' + ARW : 'Start my Boh ' + ARW);
        o += btn('fs', 'load', 'left:' + (p ? 956 : 916) + 'px;top:478px;width:306px;height:76px;font-size:22px;animation:ffade .6s both;animation-delay:' + dl(1100) + 'ms', 'I already have a Boh');
        o += box('left:0;right:90px;top:728px;text-align:center;font:600 13px system-ui;color:#4F5E80', 'Created by Assunta Scotto &middot; &copy; 2026 &middot; All rights reserved');
        o += '<a class="flnk" href="teacher/" style="right:30px;width:60px;top:724px;font-size:14px;font-weight:600">Prof</a>';
      }
    }
    if (name === 'look') {
      var d = S.d, isF = d.base === 'f' || d.base === 'h';
      var pill = function (attr, val, on, label, css) { return '<button type="button" class="fpill fa" ' + attr + '="' + val + '" aria-pressed="' + on + '" style="' + css + '">' + label + '</button>'; };
      var swatches = function (list, curId, kind, x0, y, size, step) {
        return list.map(function (it, i) {
          return '<button type="button" class="fsw" data-' + kind + '="' + it[0] + '" aria-pressed="' + (it[0] === curId) + '" aria-label="' + (it[2] || it[0]) + '" style="left:' + (x0 + i * step) + 'px;top:' + y + 'px;width:' + size + 'px;height:' + size + 'px;background:' + it[1] + '"></button>';
        }).join('');
      };
      var dp = draftProfile();
      if (P) {
        o += back(S.P ? 'boh' : 'land', 'left:12px;top:14px;width:44px;height:44px');
        o += box('left:24px;right:24px;top:62px;text-align:center;font:900 30px/1.1 system-ui;color:#0E2A5B', S.P ? 'Change your look' : 'Make your Boh');
        o += box('left:0;right:0;top:102px;text-align:center;font:600 14px system-ui;color:#4F5E80', 'Pick a look. You can change it later.');
        o += dollBox(dp, 296, 0, 138, 390);
        var y = 448;
        o += pill('data-base', 'm', d.base === 'm', 'Boy', 'left:70px;top:' + y + 'px;width:120px;height:46px;font-size:18px');
        o += pill('data-base', 'f', isF, 'Girl', 'left:200px;top:' + y + 'px;width:120px;height:46px;font-size:18px');
        y += 56;
        if (isF) { o += '<div class="flab" style="left:24px;top:' + (y + 12) + 'px;font-size:12px">Hijab</div>' + pill('data-hij', '0', d.base === 'f', 'No', 'left:110px;top:' + y + 'px;width:90px;height:40px;font-size:16px') + pill('data-hij', '1', d.base === 'h', 'Yes', 'left:210px;top:' + y + 'px;width:90px;height:40px;font-size:16px'); y += 52; }
        o += '<div class="flab" style="left:24px;top:' + (y + 10) + 'px;font-size:12px">Skin</div>' + swatches(L.SKINS, d.skin, 'skin', 100, y, 38, 46); y += 52;
        if (d.base !== 'h') { o += '<div class="flab" style="left:24px;top:' + (y + 10) + 'px;font-size:12px">Hair</div>' + swatches(L.HAIRS, d.hair, 'hair', 100, y, 38, 46); }
        o += btn('fp', 'name', 'left:24px;right:24px;top:690px;height:60px;font-size:20px', 'Next ' + ARW);
      } else {
        o += back(S.P ? 'boh' : 'land', 'left:24px;top:22px;width:56px;height:56px');
        o += dollBox(dp, 580, 260, 90, 300);
        o += box('left:640px;right:60px;top:80px;font:900 46px/1.1 system-ui;color:#0E2A5B', S.P ? 'Change your look' : 'Make your Boh');
        o += box('left:640px;right:60px;top:140px;font:600 20px system-ui;color:#4F5E80', 'Pick a look. You can change it later.');
        var y2 = 210;
        o += pill('data-base', 'm', d.base === 'm', 'Boy', 'left:640px;top:' + y2 + 'px;width:160px;height:58px;font-size:22px');
        o += pill('data-base', 'f', isF, 'Girl', 'left:812px;top:' + y2 + 'px;width:160px;height:58px;font-size:22px');
        y2 += 80;
        if (isF) { o += '<div class="flab" style="left:640px;top:' + (y2 + 16) + 'px;font-size:15px">Hijab</div>' + pill('data-hij', '0', d.base === 'f', 'No', 'left:740px;top:' + y2 + 'px;width:110px;height:50px;font-size:20px') + pill('data-hij', '1', d.base === 'h', 'Yes', 'left:862px;top:' + y2 + 'px;width:110px;height:50px;font-size:20px'); y2 += 72; }
        o += '<div class="flab" style="left:640px;top:' + (y2 + 14) + 'px;font-size:15px">Skin</div>' + swatches(L.SKINS, d.skin, 'skin', 740, y2, 48, 60); y2 += 72;
        if (d.base !== 'h') { o += '<div class="flab" style="left:640px;top:' + (y2 + 14) + 'px;font-size:15px">Hair</div>' + swatches(L.HAIRS, d.hair, 'hair', 740, y2, 48, 60); }
        o += btn('fp', 'name', 'left:640px;top:640px;width:320px;height:72px;font-size:26px', 'Next ' + ARW);
      }
    }
    if (name === 'name') {
      var dp2 = draftProfile(), has = !!S.P;
      var lab = has ? 'Save' : 'Let&rsquo;s go';
      if (P) {
        o += back('look', 'left:12px;top:14px;width:44px;height:44px');
        o += dollBox(dp2, 300, 0, 56, 390);
        o += box('left:24px;right:24px;top:372px;text-align:center;font:900 30px/1.1 system-ui;color:#0E2A5B', 'Name your Boh');
        o += box('left:0;right:0;top:414px;text-align:center;font:600 14px system-ui;color:#4F5E80', 'A first name or a nickname. No last names.');
        o += '<input id="fname" class="finp" maxlength="16" autocomplete="off" aria-label="Name your Boh" placeholder="Type a name" value="' + esc(S.d.name || '') + '" style="left:24px;right:24px;top:462px;height:64px;font-size:20px">';
        o += '<div class="ferr" id="ferr" role="alert" style="left:24px;right:24px;top:536px;font-size:14px"></div>';
        o += btn('fp', 'save', 'left:24px;right:24px;top:690px;height:60px;font-size:20px', lab + ' ' + ARW, ' id="fgo"');
      } else {
        o += back('look', 'left:24px;top:22px;width:56px;height:56px');
        o += dollBox(dp2, 580, 260, 90, 300);
        o += box('left:700px;right:60px;top:200px;font:900 46px/1.1 system-ui;color:#0E2A5B', 'Name your Boh');
        o += box('left:700px;right:60px;top:262px;font:600 20px system-ui;color:#4F5E80', 'A first name or a nickname. No last names.');
        o += '<input id="fname" class="finp" maxlength="16" autocomplete="off" aria-label="Name your Boh" placeholder="Type a name" value="' + esc(S.d.name || '') + '" style="left:700px;width:520px;top:322px;height:76px;font-size:26px">';
        o += '<div class="ferr" id="ferr" role="alert" style="left:700px;width:520px;top:410px;font-size:16px;text-align:left"></div>';
        o += btn('fp', 'save', 'left:700px;top:450px;width:300px;height:76px;font-size:26px', lab + ' ' + ARW, ' id="fgo"');
      }
    }
    if (name === 'hub' && S.wide) name = 'boh';
    if (name === 'boh') {
      var pp = S.P || {}, nm = nameOf(pp), fresh = S.fresh, last = fresh ? null : S.last;
      var head = fresh ? 'Welcome, ' + nm + '!' : 'Hi, ' + nm + '!';
      if (P) {
        o += dollBox(pp, 430, 0, 50, 390);
        if (!fresh) o += walletHTML(pp, 'right:16px;top:18px', 15);
        o += box('left:20px;right:20px;top:488px;text-align:center;font:900 30px/1.1 system-ui;color:#0E2A5B;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;animation:ffade .5s both;animation-delay:' + dl(150) + 'ms', head);
        o += box('left:0;right:0;top:530px;text-align:center;font:600 15px system-ui;color:#4F5E80', fresh ? 'Your Boh is ready. Next: choose your level.' : (last ? 'Ready to keep going?' : 'Pick a level to start.'));
        if (last) o += abtn('fp', last.href, 'left:24px;right:24px;top:578px;height:62px;font-size:20px', 'Continue ' + esc(last.t) + ' ' + ARW, last.href);
        else o += btn('fp', 'hub', 'left:24px;right:24px;top:578px;height:62px;font-size:20px', 'Choose my level ' + ARW);
        if (last) {
          o += btn('fs', 'edit', 'left:24px;width:167px;top:656px;height:54px;font-size:17px', 'Change look');
          o += abtn('fs', last.href + '?go=shop', 'left:199px;width:167px;top:656px;height:54px;font-size:17px', 'Boh-tique', last.href);
        } else {
          o += btn('fs', 'edit', 'left:24px;right:24px;top:656px;height:54px;font-size:17px', 'Change look');
        }
        if (last) o += '<button type="button" class="flnk" data-go="hub" style="left:12px;width:118px;top:730px;font-size:16px">Other levels</button>';
        o += '<button type="button" class="flnk" data-go="share" style="' + (last ? 'left:136px;width:118px' : 'left:24px;width:167px') + ';top:730px;font-size:16px">Share Boh</button>';
        o += '<button type="button" class="flnk" data-go="wipe" style="' + (last ? 'left:260px;width:118px' : 'left:199px;width:167px') + ';top:730px;font-size:16px">' + 'Start over</button>';
        o += box('left:0;right:0;top:812px;text-align:center;font:600 10.5px system-ui;color:#4F5E80', 'Created by Assunta Scotto &middot; &copy; 2026');
        o += '<a class="flnk" href="teacher/" style="right:6px;width:44px;top:806px;font-size:12px;font-weight:600">Prof</a>';
      } else {
        o += dollBox(pp, 610, 50, 70, 330);
        o += box('left:470px;right:300px;top:28px;font:900 40px/1.1 system-ui;color:#0E2A5B;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;animation:ffade .5s both;animation-delay:' + dl(150) + 'ms', head);
        if (!fresh) o += walletHTML(pp, 'right:60px;top:26px', 22);
        o += box('left:470px;right:60px;top:84px;font:600 19px system-ui;color:#4F5E80', fresh ? 'Your Boh is ready. Choose your level.' : (last ? 'Pick a level, or keep going where you left off.' : 'Pick a level to start.'));
        LEVELS.forEach(function (v, i) {
          var isLast = !!last && last.href === v.href;
          o += '<a class="flv" href="' + v.href + '" data-lvl="' + v.href + '" style="--c:' + v.c + ';--on-c:' + v.on + ';left:470px;width:836px;top:' + (128 + i * 88) + 'px;height:78px;' + (isLast ? 'border-color:' + v.c + ';box-shadow:0 0 0 3px ' + v.c + '55' : '') + '" aria-label="Play ' + esc(v.t) + '. ' + esc(v.act) + '. ' + esc(v.topic) + '">' +
            '<span class="bar"></span><span style="display:flex;align-items:center;gap:16px;padding:8px 16px 8px 18px;flex:1;min-width:0">' +
            '<span style="width:170px;flex:none"><h3 style="font-size:27px">' + esc(v.t) + '</h3>' + (isLast ? '<span class="act" style="font-size:12px;margin-top:4px">Continue here</span>' : '') + '</span>' +
            '<span style="display:flex;flex-direction:column;gap:5px;flex:1;min-width:0"><span><span class="act" style="font-size:14px">' + esc(v.act) + '</span></span><p style="font-size:16px">' + esc(v.topic) + '</p></span>' +
            '<span class="go" style="width:52px;height:52px">' + ARW + '</span></span></a>';
        });
        var bx = 470, bw = last ? 200 : 270;
        o += btn('fs', 'edit', 'left:' + bx + 'px;width:' + bw + 'px;top:590px;height:56px;font-size:19px', 'Change look');
        var bi = 1;
        if (last) { o += abtn('fs', last.href + '?go=shop', 'left:' + (bx + bi * (bw + 12)) + 'px;width:' + bw + 'px;top:590px;height:56px;font-size:19px', 'Boh-tique', last.href); bi++; }
        o += btn('fs', 'save', 'left:' + (bx + bi * (bw + 12)) + 'px;width:' + bw + 'px;top:590px;height:56px;font-size:19px', 'Save my Boh'); bi++;
        o += btn('fs', 'load', 'left:' + (bx + bi * (bw + 12)) + 'px;width:' + (bi === 3 ? 200 : bw) + 'px;top:590px;height:56px;font-size:19px', 'Load a Boh');
        o += '<button type="button" class="flnk" data-go="wipe" style="left:470px;width:240px;top:664px;font-size:16px;text-align:left">' + (fresh ? 'Start over' : 'Not ' + nm + '? Start over') + '</button>';
        o += '<button type="button" class="flnk" data-go="share" style="left:730px;width:160px;top:664px;font-size:16px">Share Boh</button>';
        o += box('left:470px;right:60px;top:704px;font:600 12.5px/1.4 system-ui;color:#4F5E80', 'Levels follow the ACTFL ranges. They show what each level aims for, not a grade.<br>Created by Assunta Scotto &middot; &copy; 2026 &middot; All rights reserved');
        o += '<a class="flnk" href="teacher/" style="right:30px;width:60px;top:706px;font-size:14px;font-weight:600">Prof</a>';
      }
    }
    if (name === 'hub') {
      var hp = S.P || {}, hn = nameOf(hp), hl = S.last;
      var lvl = function (v, css) {
        return '<a class="flv" href="' + v.href + '" data-lvl="' + v.href + '" style="--c:' + v.c + ';--on-c:' + v.on + ';' + css + '" aria-label="Play ' + esc(v.t) + '. ' + esc(v.act) + '. ' + esc(v.topic) + '">' +
          '<span class="bar"></span><span style="display:flex;align-items:center;gap:10px;padding:8px 12px 8px 14px;flex:1;min-width:0">' +
          '<span style="display:flex;flex-direction:column;gap:3px;flex:1;min-width:0">' +
          '<h3 style="font-size:20px">' + esc(v.t) + '</h3>' +
          '<span><span class="act" style="font-size:11.5px">' + esc(v.act) + '</span></span>' +
          '<p style="font-size:12px">' + esc(v.topic) + '</p></span>' +
          '<span class="go" style="width:40px;height:40px">' + ARW + '</span></span></a>';
      };
      o += back('boh', 'left:12px;top:14px;width:44px;height:44px');
      o += box('left:66px;right:170px;top:24px;font:900 24px/1.1 system-ui;color:#0E2A5B;overflow:hidden;text-overflow:ellipsis;white-space:nowrap', 'Hi, ' + hn + '!');
      o += walletHTML(hp, 'right:16px;top:20px', 15);
      o += box('left:20px;right:20px;top:78px;font:900 28px/1.1 system-ui;color:#0E2A5B', 'Choose your level');
      o += box('left:20px;right:20px;top:116px;font:600 14px system-ui;color:#4F5E80', 'Your Boh plays every level.');
      LEVELS.forEach(function (v, i) { o += lvl(v, 'left:16px;right:16px;top:' + (150 + i * 110) + 'px;height:100px'); });
      o += btn('fs', 'save', 'left:16px;width:176px;top:704px;height:48px;font-size:16px', 'Save my Boh');
      o += btn('fs', 'load', 'left:198px;width:176px;top:704px;height:48px;font-size:16px', 'Load a Boh');
      o += '<button type="button" class="flnk" data-go="edit" style="left:12px;width:118px;top:762px;font-size:15px">Change look</button>';
      o += '<button type="button" class="flnk" data-go="share" style="left:136px;width:118px;top:762px;font-size:15px">Share Boh</button>';
      o += '<button type="button" class="flnk" data-go="wipe" style="left:260px;width:118px;top:762px;font-size:15px">Start over</button>';
      o += box('left:16px;right:16px;top:798px;text-align:center;font:600 11px/1.35 system-ui;color:#4F5E80', 'Levels follow the ACTFL ranges. They show what each level aims for, not a grade.<br>Created by Assunta Scotto &middot; &copy; 2026');
    }
    return o;
  }

  /* ---------- stage, scaling, transitions ---------- */
  function fit() {
    var w = window.innerWidth, h = window.innerHeight, wide = w / h >= 1.05;
    var W = wide ? 1366 : 390, H = wide ? 768 : 844;
    var k = Math.min(w / W, h / H, wide ? 1.6 : 1.35);
    var changed = wide !== S.wide;
    S.wide = wide; S.k = k;
    stage.style.width = W + 'px'; stage.style.height = H + 'px';
    stage.style.transform = 'translate(' + Math.round((w - W * k) / 2) + 'px,' + Math.round((h - H * k) / 2) + 'px) scale(' + k + ')';
    return changed;
  }
  function mount(name, anim) {
    var s = document.createElement('div');
    s.className = 'fscr'; s.setAttribute('data-s', name);
    s.innerHTML = tpl(name);
    stage.appendChild(s);
    if (anim && !reduce) {
      s.style.transform = anim.dir > 0 ? 'translateX(100%)' : 'translateX(-30%)'; s.style.opacity = '0';
      void s.offsetWidth;
      s.style.transition = 'transform .42s cubic-bezier(.3,.8,.3,1),opacity .42s';
      s.style.transform = 'none'; s.style.opacity = '1';
    }
    return s;
  }
  function show(name, dir) {
    var old = cur, from = S.scr;
    if (dir === undefined) dir = ORDER.indexOf(name) >= ORDER.indexOf(from || 'land') ? 1 : -1;
    S.scr = name;
    cur = mount(name, old ? { dir: dir } : null);
    if (old) {
      if (!reduce) {
        old.style.transition = 'transform .42s cubic-bezier(.3,.8,.3,1),opacity .42s';
        old.style.transform = dir > 0 ? 'translateX(-30%)' : 'translateX(100%)'; old.style.opacity = '0';
        setTimeout(function () { if (old.parentNode) old.parentNode.removeChild(old); }, 460);
      } else if (old.parentNode) old.parentNode.removeChild(old);
    }
    bind(cur);
    setTimeout(function () {
      var f = cur && cur.querySelector('#fname, .fp'); if (f) { try { f.focus({ preventScroll: true }); } catch (e) {} }
    }, reduce ? 0 : 480);
  }
  function redraw() {
    if (cur && cur.parentNode) cur.parentNode.removeChild(cur);
    cur = mount(S.scr, null); bind(cur);
  }

  /* ---------- actions ---------- */
  function startMake(edit) {
    var p = edit ? S.P : null;
    S.d = { base: p ? p.bohBase : (S.g === 'girl' ? 'f' : 'm'), skin: p ? (p.bohSkin || 'medium') : 'medium', hair: p ? (p.bohHair || 'dark') : 'dark', name: p ? p.bohName : '', skinTouched: !!p };
    S.fresh = false;
    show('look', 1);
  }
  function validName() {
    var inp = document.getElementById('fname'), err = document.getElementById('ferr');
    var name = L.cleanName(inp.value), low = name.toLowerCase().replace(/\s/g, '');
    if (!name) { err.textContent = 'Give your Boh a name first.'; inp.focus(); return null; }
    for (var i = 0; i < L.BLOCKED_NAMES.length; i++) if (low.indexOf(L.BLOCKED_NAMES[i]) !== -1) { err.textContent = 'Nice try. Pick another name.'; return null; }
    return name;
  }
  function saveBoh() {
    var name = validName(); if (!name) return;
    var d = S.d, q = get() || {}, eq = q.equipped || {}, keep = {};
    for (var sl in eq) if (L.slotAllowed(d.base, eq[sl])) keep[sl] = eq[sl];
    q.bohBase = d.base; q.bohSkin = d.skin; q.bohHair = d.hair; q.bohName = name; q.equipped = keep; q._t = Date.now();
    var wasNew = !S.P;
    put(q); S.P = get() || q; S.d = null; S.fresh = wasNew;
    if (wasNew && S.next) { setLast(S.next); location.href = S.next; return; }
    show('boh', 1);
  }
  function doGo(t) {
    if (t === 'look') return startMake(false);
    if (t === 'edit') return startMake(true);
    if (t === 'name') { if (S.d) { var i = document.getElementById('fname'); } return show('name', 1); }
    if (t === 'save' && S.scr === 'name') return saveBoh();
    if (t === 'save') { if (window.BohSave && BohSave.open) BohSave.open('save'); return; }
    if (t === 'load') { if (window.BohSave && BohSave.open) BohSave.open('load'); return; }
    if (t === 'wipe') { if (window.BohWipe) BohWipe.confirm(); return; }
    if (t === 'share') { if (window.BohShare) BohShare.share(BohShare.BASE, 'Boh: the Italian learning game', 'Learn Italian. Earn Boh Cashi. Build a Boh like no other.'); return; }
    if (t === 'boh') return show('boh', S.scr === 'look' || S.scr === 'hub' ? -1 : 1);
    if (t === 'hub') return show('hub', 1);
    if (t === 'land') return show('land', -1);
  }
  /* the opening slider: drag, tap or arrow keys; one gentle demo sweep so students see it moves */
  function bindSlider(el) {
    var b = el.querySelector('.fsl-b'), down = false, raf = 0, tm = 0;
    function set(p) {
      p = Math.max(0, Math.min(100, p)); S.sp = p;
      el.style.setProperty('--p', p + '%'); b.style.clipPath = 'inset(0 0 0 ' + p + '%)';
      el.setAttribute('aria-valuenow', Math.round(p)); el.setAttribute('aria-valuetext', p > 50 ? 'Boh' : 'Lo so');
    }
    function stop() { if (raf) cancelAnimationFrame(raf); raf = 0; if (tm) clearTimeout(tm); tm = 0; }
    function at(e) { var r = el.getBoundingClientRect(); return r.width ? (e.clientX - r.left) / r.width * 100 : 50; }
    el.addEventListener('pointerdown', function (e) { stop(); down = true; try { el.setPointerCapture(e.pointerId); } catch (x) {} set(at(e)); e.preventDefault(); });
    el.addEventListener('pointermove', function (e) { if (down) set(at(e)); });
    var up = function () { down = false; };
    el.addEventListener('pointerup', up); el.addEventListener('pointercancel', up);
    el.addEventListener('keydown', function (e) {
      var d = e.key === 'ArrowLeft' ? -8 : e.key === 'ArrowRight' ? 8 : e.key === 'Home' ? -100 : e.key === 'End' ? 100 : 0;
      if (d) { stop(); set((typeof S.sp === 'number' ? S.sp : 50) + d); e.preventDefault(); }
    });
    if (!reduce && !S.spDone) {
      S.spDone = true; var t0 = 0, dur = 2400;
      var frame = function (now) {
        if (!t0) t0 = now; var k = Math.min(1, (now - t0) / dur);
        /* 50 -> 82 -> 18 -> 50, eased */
        var w = k < .25 ? 50 + 32 * Math.sin(k / .25 * Math.PI / 2) : k < .75 ? 82 - 64 * (1 - Math.cos((k - .25) / .5 * Math.PI)) / 2 : 18 + 32 * (1 - Math.cos((k - .75) / .25 * Math.PI / 2));
        set(w); raf = k < 1 ? requestAnimationFrame(frame) : 0;
      };
      tm = setTimeout(function () { raf = requestAnimationFrame(frame); }, 1300);
    }
  }
  function bind(s) {
    s.addEventListener('click', function (e) {
      var d = S.d, c;
      if ((c = e.target.closest('[data-base]'))) { d.base = c.getAttribute('data-base') === 'm' ? 'm' : (d.base === 'h' ? 'h' : 'f'); if (d.base === 'm') d.skinTouched = d.skinTouched; redraw(); return; }
      if ((c = e.target.closest('[data-hij]'))) { var on = c.getAttribute('data-hij') === '1'; d.base = on ? 'h' : 'f'; if (on && !d.skinTouched) d.skin = 'olive'; redraw(); return; }
      if ((c = e.target.closest('[data-skin]'))) { d.skin = c.getAttribute('data-skin'); d.skinTouched = true; redraw(); return; }
      if ((c = e.target.closest('[data-hair]'))) { d.hair = c.getAttribute('data-hair'); redraw(); return; }
      if ((c = e.target.closest('a[data-lvl]'))) { setLast(c.getAttribute('data-lvl')); return; }
      c = e.target.closest('[data-go]'); if (!c) return;
      if (c.id === 'fgo' || c.getAttribute('data-go') === 'save') { if (S.scr === 'name') { saveBoh(); return; } }
      var t = c.getAttribute('data-go');
      if (t === 'look' && S.scr === 'name') { var iN = document.getElementById('fname'); if (iN && S.d) S.d.name = iN.value; return show('look', -1); }
      if (t === 'look' && S.scr === 'land') return startMake(false);
      doGo(t);
    });
    var sl = s.querySelector('.fsl');
    if (sl) bindSlider(sl);
    var inp = s.querySelector('#fname');
    if (inp) {
      inp.addEventListener('input', function () { S.d.name = inp.value; var er = document.getElementById('ferr'); if (er) er.textContent = ''; });
      inp.addEventListener('keydown', function (e) { if (e.key === 'Enter') { e.preventDefault(); saveBoh(); } });
    }
  }

  window.addEventListener('resize', function () { var ch = fit(); if (ch && cur) redraw(); });
  window.addEventListener('pageshow', function (e) { if (e.persisted) { S.P = get(); S.last = getLast(); if (!S.P && (S.scr === 'hub' || S.scr === 'boh')) { S.scr = 'land'; } if (cur) redraw(); } });
  fit();
  S.last = getLast(); S.next = S.P ? null : getNext();
  /* boh-levels-v1: coming back from a level (?levels=1) with a saved Boh always lands on the level choices, never the opening screen */
  S.scr = (S.P && /[?&]levels=1(?:&|#|$)/.test(location.search)) ? (S.wide ? 'boh' : 'hub') : 'land';
  cur = mount(S.scr, null); bind(cur);
})();
