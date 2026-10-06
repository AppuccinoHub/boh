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
    x.fillText(fit(x, c.date + '  ·  ' + c.mins + '  ·  ' + c.attempt + (c.tab ? '  ·  Tabella opened' : ''), 900), 90, y);
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
        showCard(cv, b, name);
      }, 'image/png');
    });
  }

  /* The card always opens on screen, so a student can save it three ways even if the browser blocks the automatic download:
     the Save button (share sheet on phones, download on a laptop), press-and-hold on the picture, or a screenshot. */
  function showCard(cv, b, name) {
    var old = D.getElementById('bohsc-ov'); if (old) old.remove();
    var url = ''; try { url = URL.createObjectURL(b); } catch (e) { url = cv.toDataURL('image/png'); }
    var ov = D.createElement('div'); ov.id = 'bohsc-ov'; ov.setAttribute('role', 'dialog'); ov.setAttribute('aria-modal', 'true'); ov.setAttribute('aria-label', 'Your score card');
    ov.style.cssText = 'position:fixed;inset:0;z-index:2147483000;background:rgba(14,26,40,.82);display:flex;align-items:center;justify-content:center;padding:12px;box-sizing:border-box;overflow:auto';
    ov.innerHTML = '<div style="background:#fff;color:#0E2A5B;border-radius:18px;padding:14px;max-width:520px;width:100%;max-height:100%;display:flex;flex-direction:column;gap:10px;box-sizing:border-box;font-family:system-ui,sans-serif">'
      + '<img alt="Your score card" src="' + url + '" style="width:100%;height:auto;max-height:55vh;object-fit:contain;border-radius:12px;border:1px solid #ddd;-webkit-touch-callout:default;user-select:auto">'
      + '<div style="font-size:14px;font-weight:700;line-height:1.35">Tap Save. If nothing saves, press and hold the picture and choose Save Image, or take a screenshot.</div>'
      + '<div style="display:flex;gap:8px;flex-wrap:wrap"><button data-sc="save" style="flex:1;min-height:48px;border:0;border-radius:999px;background:#1A5FE0;color:#fff;font-weight:800;font-size:16px;cursor:pointer">Save my score card</button>'
      + '<button data-sc="copy" style="min-height:48px;padding:0 16px;border:2px solid #1A5FE0;border-radius:999px;background:#fff;color:#1A5FE0;font-weight:800;font-size:16px;cursor:pointer">Copy as text</button>'
      + '<button data-sc="close" style="min-height:48px;padding:0 20px;border:2px solid #1A5FE0;border-radius:999px;background:#fff;color:#1A5FE0;font-weight:800;font-size:16px;cursor:pointer">Close</button></div>'
      + '<div data-sc="msg" role="status" style="font-size:13px;font-weight:700;min-height:16px"></div></div>';
    D.body.appendChild(ov);
    var msg = ov.querySelector('[data-sc=msg]');
    function close() { try { ov.remove(); URL.revokeObjectURL(url); } catch (e) {} D.removeEventListener('keydown', onKey, true); }
    function onKey(e) { if (e.key === 'Escape') close(); }
    D.addEventListener('keydown', onKey, true);
    function viaDownload() {
      var a = D.createElement('a'); a.href = url; a.download = name; a.style.display = 'none';
      D.body.appendChild(a); a.click(); setTimeout(function () { try { a.remove(); } catch (e) {} }, 1000);
      msg.textContent = 'If it did not save, press and hold the picture and choose Save Image.';
    }
    ov.addEventListener('click', function (e) {
      var t = e.target && e.target.closest ? e.target.closest('[data-sc]') : null;
      if (e.target === ov) { close(); return; }
      if (!t) return;
      if (t.getAttribute('data-sc') === 'close') { close(); return; }
      if (t.getAttribute('data-sc') === 'copy') {
        var cc = W.BohScoreCard || {}, txt = 'Boh · La Prova\n' + (cc.name || '') + '\nScore: ' + (cc.score || '') + '\n' + (cc.date || '') + ' · ' + (cc.mins || '') + ' · ' + (cc.attempt || '') + '\nCode: ' + (cc.code || '');
        var done = function () { msg.textContent = 'Copied. Paste it into your Google Doc or Classroom (Ctrl + V).'; };
        var raw = function () { var ta = D.createElement('textarea'); ta.value = txt; ta.readOnly = true; ta.rows = 5; ta.style.cssText = 'width:100%;box-sizing:border-box;font:14px monospace'; msg.textContent = 'Select all, copy, and paste it into your Google Doc.'; msg.appendChild(ta); ta.focus(); ta.select(); };
        try { navigator.clipboard.writeText(txt).then(done, raw); } catch (er) { raw(); }
        return;
      }
      if (t.getAttribute('data-sc') !== 'save') return;
      var file = null; try { file = new File([b], name, { type: 'image/png' }); } catch (er) {}
      if (file && navigator.canShare && navigator.canShare({ files: [file] }) && navigator.share) {
        navigator.share({ files: [file], title: 'My Boh score card' }).then(function () { msg.textContent = 'Saved.'; }, function (er) { if (!er || er.name !== 'AbortError') viaDownload(); });
      } else viaDownload();
    });
    var sb = ov.querySelector('[data-sc=save]'); if (sb && sb.focus) sb.focus();
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
