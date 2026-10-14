// app/theme.js - light or dark colours before the page first paints (coach CH7-15). A plain script (not a module), loaded first in
// <head>, so the CSP's script-src 'self' allows it and nothing flashes. With no saved choice the page follows the phone
// (prefers-color-scheme) and data-theme is not set; a choice the person made with the sun / moon button (app/main.js) is kept in
// this browser only, under `<the brand's storage_key>.theme` (data-key below, set by tools/build-site.mjs), and applied as
// <html data-theme="light|dark">. Nothing else is stored (R3-GEN-01). Every stylesheet reads data-theme both ways.
(function () {
  var s = document.currentScript;
  var key = ((s && s.getAttribute('data-key')) || 'bc.lang') + '.theme';
  var saved = null;
  try { saved = localStorage.getItem(key); } catch (e) { /* private mode: follow the phone */ }
  if (saved === 'light' || saved === 'dark') document.documentElement.setAttribute('data-theme', saved);
})();
