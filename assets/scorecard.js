/* Boh · "Download my score": turns the La Prova card into a picture the student saves or uploads to Google Classroom.
   Created by Assunta Scotto, 2026. Not for redistribution.
   The game fills window.BohScoreCard each time the card is drawn. This file only reads it and draws a PNG on a canvas.
   Nothing here changes grades, saves or the game. The code on the card is a tell, not a lock. */
(function (W, D) {
  'use strict';
  if (W.BohScore) return;
  var me = D.currentScript, ROOT = '../';
  try { ROOT = new URL('../', (me && me.src) || location.href).href; } catch (e) {}

  function level() { var m = /\/italiano([1-4])\//.exec(location.pathname); if (m) return m[1]; if (/\/ap\//.test(location.pathname)) return 'ap'; return '4'; }
  function levelName(l) { return l === 'ap' ? 'AP Italiano' : 'Italiano ' + l; }

  /* "a|b" = main line, then English small underneath (Italiano 2 only). Level 1 English only, 3 mixes, 4 and AP Italian. */
  var TXT = {
    '1': { title: 'My score', test: 'La Prova', first: 'First try', best: 'Best', attempt: 'Attempt', code: 'Code', dl: 'Download my score', busy: 'Making your picture...', fail: 'Could not make the picture. Take a screenshot instead.' },
    '2': { title: 'Il mio punteggio|My score', test: 'La Prova', first: 'Primo tentativo|First try', best: 'Il migliore|Best', attempt: 'Tentativo|Attempt', code: 'Codice|Code', dl: 'Scarica il punteggio|Download my score', busy: 'Preparo la figura...|Making your picture...', fail: 'Non riesco a fare la figura. Fai uno screenshot.|Could not make the picture. Take a screenshot instead.' },
    '3': { title: 'Il mio score', test: 'La Prova', first: 'First try', best: 'Best', attempt: 'Tentativo', code: 'Code', dl: 'Scarica il tuo score', busy: 'Preparo la picture...', fail: 'Non riesco a fare la picture. Fai uno screenshot.' },
    '4': { title: 'Il mio punteggio', test: 'La Prova', first: 'Primo tentativo', best: 'Il migliore', attempt: 'Tentativo', code: 'Codice', dl: 'Scarica il punteggio', busy: 'Preparo la figura...', fail: 'Non riesco a fare la figura. Fai uno screenshot.' }
  };
  TXT.ap = TXT['4'];
  function T(k) { return (TXT[level()] || TXT['4'])[k] || ''; }
  function main(v) { var i = v.indexOf('|'); return i < 0 ? v : v.slice(0, i); }
  function en(v) { var i = v.indexOf('|'); return i < 0 ? '' : v.slice(i + 1); }

  function load(src) {
    return new Promise(function (ok) { var im = new Image(); im.onload = function () { ok(im); }; im.onerror = function () { ok(null); }; im.src = src; });
  }
  function fit(ctx, text, maxW) { while (text.length > 1 && ctx.measureText(text).width > maxW) text = text.slice(0, -2) + '…'; return text; }
  function rrect(ctx, x, y, w, h, r) {
    ctx.beginPath(); ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath();
  }
  function stamp() { var d = new Date(); return d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2) + '-' + ('0' + d.getDate()).slice(-2); }

  function draw(c, face) {
    var W2 = 1080, FONT = 'system-ui,-apple-system,"Segoe UI",Roboto,Arial,sans-serif', secs = (c.secs || []).slice(0, 6);
    var rowH = 84, H = 330 + 360 + (secs.length ? secs.length * rowH + 40 : 0) + 300;
    var cv = D.createElement('canvas'); cv.width = W2; cv.height = H;
    var x = cv.getContext('2d');
    x.fillStyle = '#FFF4E8'; x.fillRect(0, 0, W2, H);
    /* card */
    x.fillStyle = '#FFFFFF'; rrect(x, 40, 40, W2 - 80, H - 80, 44); x.fill();
    x.lineWidth = 8; x.strokeStyle = '#2A1F1B'; x.stroke();
    /* header band */
    x.save(); rrect(x, 40, 40, W2 - 80, 300, 44); x.clip(); x.fillStyle = '#E8895F'; x.fillRect(40, 40, W2 - 80, 300); x.restore();
    x.fillStyle = '#2A1F1B'; x.textBaseline = 'alphabetic'; x.textAlign = 'left';
    var t = T('title'), tm = main(t), te = en(t), y = 140;
    var ts = 70; x.font = '800 ' + ts + 'px ' + FONT; while (ts > 40 && x.measureText(tm).width > 640) { ts -= 2; x.font = '800 ' + ts + 'px ' + FONT; }
    x.fillText(fit(x, tm, 640), 90, y);
    if (te) { y += 44; x.font = '700 34px ' + FONT; x.fillText(te, 90, y); }
    y += 50; x.font = '700 34px ' + FONT;
    x.fillText(fit(x, c.name || 'Boh', 640), 90, y);
    y += 46; x.font = '600 30px ' + FONT;
    x.fillText(fit(x, levelName(level()) + '  ·  ' + (c.unit || T('test')), 640), 90, y);
    if (face) { var fh = 270, fw = face.width * fh / face.height; x.drawImage(face, W2 - 80 - fw - 20, 60, fw, fh); }
    /* big score */
    y = 340 + 190;
    x.fillStyle = '#17803F'; x.textAlign = 'right'; x.font = '900 190px ' + FONT; x.fillText(c.pct || '', W2 - 90, y);
    x.fillStyle = '#2A1F1B'; x.textAlign = 'left'; x.font = '800 44px ' + FONT; x.fillText(T('test'), 90, y - 90);
    x.fillStyle = '#6F5E56'; x.font = '700 42px ' + FONT; x.fillText(c.score || '', 90, y - 30);
    y += 70;
    /* sections */
    x.font = '700 38px ' + FONT;
    secs.forEach(function (s) {
      x.fillStyle = '#FBE9DA'; rrect(x, 90, y, W2 - 180, rowH - 14, 20); x.fill();
      x.fillStyle = '#2A1F1B'; x.textAlign = 'left';
      var ns = 38; x.font = '700 ' + ns + 'px ' + FONT; while (ns > 24 && x.measureText(s.name || '').width > 700) { ns -= 2; x.font = '700 ' + ns + 'px ' + FONT; }
      x.fillText(fit(x, s.name || '', 700), 116, y + 50);
      x.textAlign = 'right'; x.font = '800 38px ' + FONT; x.fillText(s.score || '', W2 - 116, y + 50); x.font = '700 38px ' + FONT;
      y += rowH;
    });
    y += 40;
    /* footer line */
    x.strokeStyle = '#D9C9BC'; x.lineWidth = 4; x.setLineDash([14, 12]); x.beginPath(); x.moveTo(90, y); x.lineTo(W2 - 90, y); x.stroke(); x.setLineDash([]);
    y += 60; x.fillStyle = '#6F5E56'; x.textAlign = 'left'; x.font = '700 32px ' + FONT;
    x.fillText(fit(x, c.date + '  ·  ' + c.mins + '  ·  ' + c.attempt, 900), 90, y);
    y += 52; x.fillText(main(T('first')) + ': ' + (c.first || '') + '   ' + main(T('best')) + ': ' + (c.best || ''), 90, y);
    y += 80; x.fillStyle = '#D9472B'; x.font = '900 56px ui-monospace,SFMono-Regular,Menlo,Consolas,monospace';
    x.fillText(main(T('code')) + '  ' + (c.code || ''), 90, y);
    x.fillStyle = '#6F5E56'; x.font = '600 26px ' + FONT; x.textAlign = 'right';
    x.fillText('Boh · Created by Assunta Scotto', W2 - 90, H - 80);
    return cv;
  }

  function flash(btn, msg) {
    var old = btn.innerHTML; btn.innerHTML = msg; btn.disabled = true;
    setTimeout(function () { btn.innerHTML = old; btn.disabled = false; }, 2200);
  }

  function make(btn) {
    var c = W.BohScoreCard;
    if (!c) { flash(btn, esc(main(T('fail')))); return; }
    var busy = btn.innerHTML; btn.disabled = true;
    load(ROOT + 'assets/guide/head/h-smile.webp').then(function (face) {
      var cv;
      try { cv = draw(c, face); } catch (e) { btn.disabled = false; flash(btn, esc(main(T('fail')))); return; }
      var name = 'Boh-' + String(c.name || 'Boh').replace(/[^A-Za-z0-9]+/g, '-').replace(/^-|-$/g, '') + '-Prova-' + stamp() + '.png';
      cv.toBlob(function (b) {
        btn.disabled = false; btn.innerHTML = busy;
        if (!b) { flash(btn, esc(main(T('fail')))); return; }
        var url = URL.createObjectURL(b), a = D.createElement('a');
        a.href = url; a.download = name; a.style.display = 'none';
        D.body.appendChild(a); a.click();
        setTimeout(function () { try { D.body.removeChild(a); URL.revokeObjectURL(url); } catch (e) {} }, 4000);
      }, 'image/png');
    });
  }
  function esc(t) { return String(t).replace(/[&<>"']/g, function (ch) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]; }); }

  /* delegated, because the game redraws and reuses its nodes */
  D.addEventListener('click', function (e) {
    var b = e.target && e.target.closest && e.target.closest('[data-pvdl]');
    if (!b) return;
    e.preventDefault(); e.stopPropagation();
    make(b);
  }, true);

  W.BohScore = { draw: draw, buttonHtml: function () { var d = T('dl'); return esc(main(d)) + (en(d) ? '<small>' + esc(en(d)) + '</small>' : ''); } };
})(window, document);
