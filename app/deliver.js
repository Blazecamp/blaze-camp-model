// app/deliver.js - hands a file the page made (the plan PDF, the day card PNG) to the person, in a way that works on an iPhone
// too. iOS browsers, and the in-app browsers inside other apps, often ignore window.print() and <a download>, so:
//   1. phones and tablets: the share sheet (navigator.share with the file), from which the person saves it to Files or Photos or
//      sends it. The share call must run inside a tap: when the file took long to make, or the browser refuses the call, the page
//      shows a small sheet with its own "Share" button (a fresh tap), plus the fallbacks below.
//   2. the fallbacks, always on that sheet: the image itself ("press and hold the image to save it"), or an "Open PDF" link to the
//      file in a new tab, and a plain download link.
//   3. desktop: a normal download (<a download>), else the file opened in a new tab.
// Nothing fails silently: every path ends in a toast or the sheet. Nothing is uploaded or kept (R3-GEN-01): the file lives in a
// blob: URL in this tab only and is released when the sheet closes.
import { escapeHtml as h } from './md.js';

/** iPhone, iPad (also iPadOS that reports itself as a Mac) and iPod */
export function isIOS(nav = navigator) {
  const ua = nav.userAgent || '';
  return /iPhone|iPad|iPod/i.test(ua) || (/Macintosh/i.test(ua) && (nav.maxTouchPoints || 0) > 1);
}
/** a phone or a tablet: these get the share sheet and the fallback sheet instead of a silent download */
export function isMobile(nav = navigator) {
  return isIOS(nav) || /Android|Mobi/i.test(nav.userAgent || '');
}
/** the share sheet can take this file */
export function canShareFile(file, nav = navigator) {
  try { return !!(file && typeof nav.share === 'function' && typeof nav.canShare === 'function' && nav.canShare({ files: [file] })); } catch { return false; }
}

// how long after the tap a share call is still trusted to count as part of it (WebKit drops the user gesture after long awaits)
const GESTURE_MS = 1000;

let toastTimer = null;
/** a small message at the bottom of the screen (also read out by screen readers) */
export function toast(msg, kind = 'ok') {
  let el = document.getElementById('bc-toast');
  if (!el) {
    el = document.createElement('div');
    el.id = 'bc-toast'; el.className = 'toast'; el.setAttribute('role', 'status'); el.setAttribute('aria-live', 'polite');
    document.body.appendChild(el);
  }
  el.textContent = msg;
  el.dataset.kind = kind;
  el.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove('show'), kind === 'error' ? 7000 : 3500);
}

function download(url, name) {
  const a = document.createElement('a');
  a.href = url; a.download = name; a.rel = 'noopener';
  document.body.appendChild(a);
  a.click();
  setTimeout(() => a.remove(), 0);
}

/**
 * Deliver a Blob.
 * @param {Blob} blob
 * @param {{name: string, type: 'pdf'|'png', title: string, startedAt: number, words: (k: string, a?: object) => string}} o
 *   words: the app's words (sheet.*, pdf.*, image.*); startedAt: performance.now() at the tap
 * @returns {Promise<'shared'|'cancelled'|'sheet'|'downloaded'|'opened'>}
 */
export async function deliver(blob, o) {
  const t = o.words;
  const mime = o.type === 'pdf' ? 'application/pdf' : 'image/png';
  const file = typeof File === 'function' ? new File([blob], o.name, { type: mime }) : null;
  const mobile = isMobile();
  if (mobile) {
    if (canShareFile(file) && performance.now() - o.startedAt < GESTURE_MS) {
      try {
        await navigator.share({ files: [file], title: o.title });
        toast(t(o.type === 'pdf' ? 'pdf.ready' : 'image.ready'));
        return 'shared';
      } catch (e) {
        if (e && e.name === 'AbortError') return 'cancelled';
        // NotAllowedError (the tap was too long ago) or anything else: the sheet, with its own Share button
        showSheet(blob, file, o, true);
        return 'sheet';
      }
    }
    showSheet(blob, file, o, false);
    return 'sheet';
  }
  const url = URL.createObjectURL(blob);
  try {
    download(url, o.name);
    toast(t(o.type === 'pdf' ? 'pdf.saved' : 'image.saved', { name: o.name }));
    setTimeout(() => URL.revokeObjectURL(url), 60000);
    return 'downloaded';
  } catch {
    const w = window.open(url, '_blank', 'noopener');
    if (w) { toast(t(o.type === 'pdf' ? 'pdf.ready' : 'image.ready')); return 'opened'; }
    URL.revokeObjectURL(url);
    showSheet(blob, file, o, false);
    return 'sheet';
  }
}

/** the sheet: Share (when the browser can), the image to press and hold or "Open PDF", and a download link */
function showSheet(blob, file, o, shareFailed) {
  const t = o.words;
  closeSheet();
  const url = URL.createObjectURL(blob);
  const share = canShareFile(file);
  const isPdf = o.type === 'pdf';
  const wrap = document.createElement('div');
  wrap.id = 'bc-sheet'; wrap.className = 'sheet-wrap';
  wrap.innerHTML = `<div class="sheet" role="dialog" aria-modal="true" aria-labelledby="bc-sheet-h">
    <h2 id="bc-sheet-h">${h(t(isPdf ? 'sheet.pdf_title' : 'sheet.image_title'))}</h2>
    ${shareFailed ? `<p class="sheet-note">${h(t('sheet.share_failed'))}</p>` : ''}
    ${share ? `<button type="button" class="btn primary sheet-share" data-sheet="share">${h(t(isPdf ? 'sheet.share_pdf' : 'sheet.share_image'))}</button>` : ''}
    ${isPdf
      ? `<a class="btn sheet-open" href="${url}" target="_blank" rel="noopener">${h(t('sheet.open_pdf'))}</a><p class="sheet-hint">${h(t('sheet.pdf_hint'))}</p>`
      : `<p class="sheet-hint">${h(t('sheet.hold_image'))}</p><img class="sheet-img" src="${url}" alt="${h(o.title)}">`}
    <div class="sheet-row"><a class="btn small" href="${url}" download="${h(o.name)}" data-sheet="download">${h(t('sheet.download'))}</a>
    <button type="button" class="btn small" data-sheet="close">${h(t('sheet.close'))}</button></div>
    <p class="sheet-file">${h(o.name)}</p></div>`;
  wrap.__bcUrl = url;
  wrap.addEventListener('click', (e) => {
    const b = e.target.closest('[data-sheet]');
    if (e.target === wrap) { closeSheet(); return; }
    if (!b) return;
    if (b.dataset.sheet === 'close') { closeSheet(); return; }
    if (b.dataset.sheet === 'share') {
      // called straight from this tap, so the browser lets the share sheet open
      navigator.share({ files: [file], title: o.title }).then(
        () => { toast(t(isPdf ? 'pdf.ready' : 'image.ready')); closeSheet(); },
        (err) => { if (!(err && err.name === 'AbortError')) toast(t('sheet.share_failed'), 'error'); });
    }
  });
  document.addEventListener('keydown', escClose);
  document.body.appendChild(wrap);
  const first = wrap.querySelector('.sheet-share, .sheet-open, [data-sheet="close"]');
  if (first) first.focus();
}
function escClose(e) { if (e.key === 'Escape') closeSheet(); }
export function closeSheet() {
  const el = document.getElementById('bc-sheet');
  if (!el) return;
  document.removeEventListener('keydown', escClose);
  const url = el.__bcUrl;
  el.remove();
  // a little later: an "Open PDF" tab may still be reading it
  if (url) setTimeout(() => URL.revokeObjectURL(url), 60000);
}
