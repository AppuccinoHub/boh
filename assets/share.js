/* Boh · one share module for the home page and the Prof panel (boh-share-v1). Created by Assunta Scotto, 2026. Not for redistribution.
   Shares an address only. No names, scores or recordings ever go through it. */
(function () {
  'use strict';
  var BASE = 'https://appuccinohub.github.io/boh/';
  function toast(msg) {
    var t = document.getElementById('boh-share-toast');
    if (!t) {
      t = document.createElement('div'); t.id = 'boh-share-toast'; t.setAttribute('role', 'status');
      t.style.cssText = 'position:fixed;left:50%;bottom:calc(24px + env(safe-area-inset-bottom,0px));transform:translateX(-50%);max-width:88vw;padding:12px 18px;border-radius:14px;background:#0E2A5B;color:#fff;font:700 15px system-ui;z-index:99999;text-align:center;box-shadow:0 6px 20px rgba(14,42,91,.35)';
      document.body.appendChild(t);
    }
    t.textContent = msg; t.style.display = 'block'; clearTimeout(t._h); t._h = setTimeout(function () { t.style.display = 'none'; }, 3200);
  }
  function copy(text) {
    function manual() { try { window.prompt('Copy this link:', text); } catch (e) {} return false; }
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        return navigator.clipboard.writeText(text).then(function () { toast('Link copied'); return true; }, function () { manual(); return false; });
      }
    } catch (e) {}
    return Promise.resolve(manual());
  }
  /* Share sheet when the device has one; otherwise copy the link and say so. */
  function share(url, title, text) {
    url = url || BASE;
    if (navigator.share) {
      return navigator.share({ title: title || 'Boh', text: text || '', url: url }).catch(function (e) { if (e && e.name === 'AbortError') return; return copy(url); });
    }
    return copy(url);
  }
  /* Google Classroom share page (format from memory, Unverified: if it ever stops working, "Copy link" still does) */
  function classroomUrl(url, title) { return 'https://classroom.google.com/share?url=' + encodeURIComponent(url) + '&title=' + encodeURIComponent(title || 'Boh') + '&itemtype=assignment'; }
  /* Link to a unit or a stop. level: 'italiano4'|'ap'; unit: id; stop: 1-based number or 0/undefined for the whole unit */
  function stopUrl(level, unit, stop) { return BASE + level + '/?unit=' + encodeURIComponent(unit) + (stop ? '&stop=' + (+stop) : ''); }
  window.BohShare = { BASE: BASE, share: share, copy: copy, classroomUrl: classroomUrl, stopUrl: stopUrl, toast: toast };
})();
