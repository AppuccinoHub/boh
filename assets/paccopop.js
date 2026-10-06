/* Boh · Pacco surprise. One shared file, used identically by every level (Italiano 1-4 and AP).
   When a student earns a new Pacco Boh (every 500 BC and every 5,000 BC, plus lesson prizes), a full-screen pop-up appears
   with Prof. Lo So, confetti and the spoken words "Auguri! Hai una sorpresa!". One button, "Apri", opens the Pacco.
   It waits until a round, lesson or test is over, so it never interrupts a question. It shows once per new Pacco.
   Nothing here changes any score, price or saved progress other than remembering how many Pacchi it has already announced.
   Created by Assunta Scotto, 2026. Not for redistribution. */
(function () {
  try {
    if (window.BohPaccoPop) return;
    var base = ''; try { base = document.currentScript.src.replace(/paccopop\.js.*$/, ''); } catch (e) { base = '../assets/'; }
    var KEY = 'boh_pp1_' + (location.pathname.replace(/[^a-z0-9]/gi, '') || 'x');
    var g = null, ov = null, announced = null, BUSY = { play: 1, lesson: 1, prova: 1, pacco: 1 };
    function lsGet() { try { var v = localStorage.getItem(KEY); return v === null ? null : +v; } catch (e) { return null; } }
    function lsSet(n) { try { localStorage.setItem(KEY, String(n)); } catch (e) {} }
    function earned() {   // every Pacco ever earned, opened or not
      var s = g.state || {};
      return Math.floor((s.lifetime || 0) / 5000) + (s.paccoGrande || 0) + Math.floor((s.lifetime || 0) / 500) + (s.paccoMini || 0);
    }
    function pendingNow() { try { var p = g.pending(); return p.sacchi + p.centoni; } catch (e) { return 0; } }
    function speak() {
      try {
        var t = 'Auguri! Hai una sorpresa!';
        if (window.BohCards && BohCards.say) { BohCards.say(t); return; }
        var S = window.speechSynthesis; if (!S) return; var u = new SpeechSynthesisUtterance(t); u.lang = 'it-IT';
        var v = S.getVoices().filter(function (x) { return /^it/i.test(x.lang); })[0]; if (v) u.voice = v; u.rate = .9; S.cancel(); S.speak(u);
      } catch (e) {}
    }
    function css() {
      if (document.getElementById('bpp-css')) return;
      var s = document.createElement('style'); s.id = 'bpp-css';
      s.textContent =
        '#bpp{position:fixed;inset:0;z-index:99990;background:rgba(14,42,91,.72);display:flex;align-items:center;justify-content:center;padding:16px;overflow:hidden}' +
        '#bpp .bpp-c{position:relative;width:100%;max-width:380px;background:var(--pop-tint,#FEE5EE);border:3px solid var(--pop,#BC1E72);border-radius:28px;padding:20px 18px 18px;text-align:center;color:var(--text,#0E2A5B);box-shadow:0 18px 50px rgba(0,0,0,.35);animation:bppIn .45s cubic-bezier(.2,1.3,.4,1) both}' +
        '#bpp .bpp-prof{display:block;margin:-6px auto 0;height:190px;width:auto;max-width:70%;object-fit:contain}' +
        '#bpp h2{margin:6px 0 2px;font:900 38px/1.05 system-ui,sans-serif;letter-spacing:.5px}' +
        '#bpp p{margin:2px 0;font:800 20px/1.25 system-ui,sans-serif}' +
        '#bpp .bpp-en{font:600 14px system-ui,sans-serif;color:var(--text-muted,#46566E);margin-top:4px}' +
        '#bpp .bpp-go{display:block;width:100%;min-height:58px;margin-top:16px;border:0;border-radius:18px;background:var(--primary-bg,#1A5CDF);color:var(--primary-text,#fff);font:900 22px system-ui,sans-serif;cursor:pointer}' +
        '#bpp .bpp-later{display:block;margin:10px auto 0;min-height:44px;padding:0 14px;border:0;background:none;color:var(--text-muted,#46566E);font:700 14px system-ui,sans-serif;text-decoration:underline;cursor:pointer}' +
        '#bpp .bpp-cf{position:absolute;top:-14px;width:10px;height:16px;border-radius:2px;opacity:.95;animation:bppFall linear forwards;pointer-events:none}' +
        '@keyframes bppIn{from{transform:scale(.7);opacity:0}to{transform:scale(1);opacity:1}}' +
        '@keyframes bppFall{to{transform:translateY(110vh) rotate(540deg)}}' +
        '@media (prefers-reduced-motion:reduce){#bpp .bpp-c{animation:none}#bpp .bpp-cf{display:none}}';
      document.head.appendChild(s);
    }
    function hide(opened) {
      if (!ov) return; try { document.removeEventListener('keydown', key, true); } catch (e) {}
      ov.remove(); ov = null; try { window.speechSynthesis && speechSynthesis.cancel(); } catch (e) {}
      if (opened) { try { g.openPacco(); } catch (e) {} }
    }
    function key(e) { if (e.key === 'Escape') { e.preventDefault(); hide(false); } }
    function show() {
      if (ov) return; css();
      ov = document.createElement('div'); ov.id = 'bpp'; ov.setAttribute('role', 'dialog'); ov.setAttribute('aria-modal', 'true'); ov.setAttribute('aria-label', 'Auguri! Hai una sorpresa!');
      var cols = ['#BC1E72', '#1A5CDF', '#0A9A9A', '#896100', '#3D8F35'], cf = '';
      for (var i = 0; i < 28; i++) cf += '<i class="bpp-cf" style="left:' + Math.round(Math.random() * 100) + '%;background:' + cols[i % 5] + ';animation-duration:' + (2.2 + Math.random() * 2.2).toFixed(2) + 's;animation-delay:' + (Math.random() * 1.2).toFixed(2) + 's"></i>';
      ov.innerHTML = cf + '<div class="bpp-c"><img class="bpp-prof" alt="" src="' + base + 'guide/bust/jump-joy.webp"><h2>AUGURI!</h2><p>Hai una sorpresa!</p><div class="bpp-en">You earned a Pacco Boh.</div>' +
        '<button type="button" class="bpp-go">Apri</button><button type="button" class="bpp-later">Più tardi</button></div>';
      document.body.appendChild(ov);
      ov.querySelector('.bpp-go').onclick = function () { hide(true); };
      ov.querySelector('.bpp-later').onclick = function () { hide(false); };
      document.addEventListener('keydown', key, true);
      try { ov.querySelector('.bpp-go').focus(); } catch (e) {}
      setTimeout(speak, 350);
    }
    function check() {
      if (!g || !g.state || ov) return;
      var e = earned(); if (announced === null) { announced = e; lsSet(e); return; }
      if (e < announced) { announced = e; lsSet(e); return; }
      if (e > announced && !BUSY[g.state.screen] && !g.state.overlay && !g.state.tabOpen && pendingNow() > 0) { announced = e; lsSet(e); show(); }
    }
    function init() {
      var gg = window.__game; if (!gg || !gg.state || typeof gg.pending !== 'function') return false;
      g = gg; var v = lsGet(); announced = v; if (announced === null) { announced = earned(); lsSet(announced); }
      setInterval(function () { try { check(); } catch (e) {} }, 500); return true;
    }
    window.BohPaccoPop = { show: show, hide: hide };
    var n = 0, t = setInterval(function () { try { if (init() || ++n > 100) clearInterval(t); } catch (e) { clearInterval(t); } }, 150);
  } catch (e) {}
})();
