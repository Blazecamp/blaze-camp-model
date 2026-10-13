// app/snapshot.js - "Save image": the day card as a PNG, with no outside library. The card is cloned with its computed styles
// inlined, drawn through an SVG <foreignObject> onto a canvas, then shared (phones) or downloaded. Browsers that refuse to draw it
// (some Safari versions taint the canvas) get a clear "take a screenshot" message instead.

const SKIP = new Set(['transition', 'transition-delay', 'transition-duration', 'transition-property', 'transition-timing-function', 'animation', 'animation-name', 'cursor', 'will-change']);

function inlineStyles(src, dst) {
  const cs = getComputedStyle(src);
  const parts = [];
  for (let i = 0; i < cs.length; i++) {
    const p = cs[i];
    if (SKIP.has(p)) continue;
    parts.push(p + ':' + cs.getPropertyValue(p));
  }
  dst.setAttribute('style', parts.join(';'));
  const sk = src.children, dk = dst.children;
  for (let i = 0; i < sk.length; i++) if (dk[i]) inlineStyles(sk[i], dk[i]);
}

/** @param {HTMLElement} node @param {{scale?:number, background?:string}} [opts] @returns {Promise<Blob>} */
export async function nodeToPng(node, opts = {}) {
  const rect = node.getBoundingClientRect();
  const width = Math.ceil(rect.width), height = Math.ceil(node.scrollHeight || rect.height);
  const clone = node.cloneNode(true);
  inlineStyles(node, clone);
  clone.style.margin = '0';
  clone.querySelectorAll('[data-snap-hide]').forEach(el => el.remove());
  const xml = new XMLSerializer().serializeToString(clone);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}"><foreignObject x="0" y="0" width="100%" height="100%">${xml}</foreignObject></svg>`;
  const url = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
  const img = new Image();
  img.decoding = 'sync';
  await new Promise((resolve, reject) => { img.onload = resolve; img.onerror = () => reject(new Error('image')); img.src = url; });
  const scale = opts.scale || Math.min(3, Math.max(2, window.devicePixelRatio || 1));
  const canvas = document.createElement('canvas');
  canvas.width = Math.ceil(width * scale); canvas.height = Math.ceil(height * scale);
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = opts.background || '#ffffff';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.scale(scale, scale);
  ctx.drawImage(img, 0, 0);
  return new Promise((resolve, reject) => canvas.toBlob(b => (b ? resolve(b) : reject(new Error('blob'))), 'image/png'));
}

/** share the image on phones that can, else download it */
export async function saveBlob(blob, filename, title) {
  const file = typeof File === 'function' ? new File([blob], filename, { type: 'image/png' }) : null;
  if (file && navigator.canShare && navigator.canShare({ files: [file] }) && /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent)) {
    try { await navigator.share({ files: [file], title }); return 'shared'; } catch (e) { if (e && e.name === 'AbortError') return 'cancelled'; }
  }
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 1000);
  return 'downloaded';
}
