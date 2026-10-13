// tools/white-label/images.mjs - what tools/new-brand.mjs needs from a logo file, with no dependencies: the type from the file's
// first bytes (PNG, JPEG, SVG), its width and height from the header, a plain PNG decoder / encoder (node:zlib) to make square
// favicons from a PNG logo, trimming and sizing (trimImage, toWidth), and a sanitizer that drops scripts and event handlers from an
// SVG. Turning other images (SVG, JPEG, WEBP, GIF, ICO) into a PNG needs a browser: tools/white-label/raster.mjs.
import zlib from 'node:zlib';

/** 'png' | 'jpeg' | 'svg' | 'gif' | 'webp' | 'ico' | null */
export function sniff(buf) {
  if (!buf || buf.length < 4) return null;
  if (buf[0] === 0x89 && buf.subarray(1, 4).toString('latin1') === 'PNG') return 'png';
  if (buf[0] === 0xff && buf[1] === 0xd8) return 'jpeg';
  if (buf.subarray(0, 4).toString('latin1') === 'GIF8') return 'gif';
  if (buf.subarray(0, 4).toString('latin1') === 'RIFF' && buf.subarray(8, 12).toString('latin1') === 'WEBP') return 'webp';
  if (buf[0] === 0 && buf[1] === 0 && buf[2] === 1 && buf[3] === 0) return 'ico';
  const head = buf.subarray(0, 2048).toString('utf8').replace(/^﻿/, '').trimStart();
  if (/^(<\?xml[^>]*>\s*)?(<!--[\s\S]*?-->\s*)*(<!DOCTYPE svg[^>]*>\s*)?<svg[\s>]/i.test(head)) return 'svg';
  return null;
}
export const EXT = { png: 'png', jpeg: 'jpg', svg: 'svg' };
export const MIME = { png: 'image/png', jpeg: 'image/jpeg', svg: 'image/svg+xml', gif: 'image/gif', webp: 'image/webp', ico: 'image/x-icon' };

/** {w, h} from the file header (SVG: width / height, else the viewBox), or null */
export function dimensions(buf, type = sniff(buf)) {
  if (type === 'png') return { w: buf.readUInt32BE(16), h: buf.readUInt32BE(20) };
  if (type === 'jpeg') {
    let i = 2;
    while (i + 9 < buf.length) {
      if (buf[i] !== 0xff) { i++; continue; }
      const m = buf[i + 1];
      if (m === 0xd8 || m === 0x01 || (m >= 0xd0 && m <= 0xd7)) { i += 2; continue; }
      const len = buf.readUInt16BE(i + 2);
      if (m >= 0xc0 && m <= 0xcf && m !== 0xc4 && m !== 0xc8 && m !== 0xcc) return { h: buf.readUInt16BE(i + 5), w: buf.readUInt16BE(i + 7) };
      i += 2 + len;
    }
    return null;
  }
  if (type === 'svg') {
    const s = buf.toString('utf8');
    const tag = (/<svg\b[^>]*>/i.exec(s) || [''])[0];
    const num = (name) => { const m = new RegExp(`\\s${name}\\s*=\\s*["']\\s*([\\d.]+)\\s*(px)?\\s*["']`, 'i').exec(tag); return m ? parseFloat(m[1]) : null; };
    let w = num('width'), h = num('height');
    const vb = /viewBox\s*=\s*["']\s*[-\d.]+[\s,]+[-\d.]+[\s,]+([\d.]+)[\s,]+([\d.]+)\s*["']/i.exec(tag);
    if ((!w || !h) && vb) { const vw = parseFloat(vb[1]), vh = parseFloat(vb[2]); if (!w && !h) { w = vw; h = vh; } else if (!w) w = h * vw / vh; else h = w * vh / vw; }
    return w && h ? { w: Math.round(w), h: Math.round(h) } : null;
  }
  if (type === 'gif' && buf.length >= 10) return { w: buf.readUInt16LE(6), h: buf.readUInt16LE(8) };
  if (type === 'webp' && buf.length >= 30) {
    const kind = buf.subarray(12, 16).toString('latin1');
    if (kind === 'VP8X') return { w: 1 + buf.readUIntLE(24, 3), h: 1 + buf.readUIntLE(27, 3) };
    if (kind === 'VP8 ') return { w: buf.readUInt16LE(26) & 0x3fff, h: buf.readUInt16LE(28) & 0x3fff };
    if (kind === 'VP8L') { const b = buf.readUInt32LE(21); return { w: 1 + (b & 0x3fff), h: 1 + ((b >> 14) & 0x3fff) }; }
    return null;
  }
  if (type === 'ico' && buf.length >= 22) {
    // the largest entry (0 means 256)
    let best = null;
    for (let i = 0, n = buf.readUInt16LE(4); i < n && 6 + i * 16 + 16 <= buf.length; i++) {
      const w = buf[6 + i * 16] || 256, h = buf[7 + i * 16] || 256;
      if (!best || w * h > best.w * best.h) best = { w, h };
    }
    return best;
  }
  return null;
}

/** the image without its empty border: transparent pixels, or (for an image with no transparency, a JPEG) pixels close to the
 *  corner colour. Returns the image itself when nothing is left to trim or everything would be trimmed. */
export function trimImage(img, { tolerance = 24 } = {}) {
  const { w, h, data } = img;
  const at = (x, y) => (y * w + x) * 4;
  let opaque = true;
  for (let i = 3; i < data.length; i += 4) if (data[i] < 250) { opaque = false; break; }
  const c = at(0, 0), bg = [data[c], data[c + 1], data[c + 2]];
  const empty = opaque
    ? (x, y) => { const i = at(x, y); return Math.abs(data[i] - bg[0]) + Math.abs(data[i + 1] - bg[1]) + Math.abs(data[i + 2] - bg[2]) <= tolerance; }
    : (x, y) => data[at(x, y) + 3] < 8;
  let x0 = w, y0 = h, x1 = -1, y1 = -1;
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) if (!empty(x, y)) { if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y; }
  if (x1 < 0 || (x0 === 0 && y0 === 0 && x1 === w - 1 && y1 === h - 1)) return img;
  const tw = x1 - x0 + 1, th = y1 - y0 + 1, out = new Uint8Array(tw * th * 4);
  for (let y = 0; y < th; y++) out.set(data.subarray(at(x0, y0 + y), at(x0, y0 + y) + tw * 4), y * tw * 4);
  return { w: tw, h: th, data: out };
}
/** the image no wider than maxW (keeping its shape) */
export function toWidth(img, maxW) {
  if (img.w <= maxW) return img;
  const th = Math.max(1, Math.round(img.h * maxW / img.w));
  return { w: maxW, h: th, data: scale(img, maxW, th) };
}

/** an SVG without scripts, event handlers, foreign objects or javascript: links (a logo needs none of them) */
export function sanitizeSvg(text) {
  return String(text)
    .replace(/<script\b[\s\S]*?<\/script\s*>/gi, '')
    .replace(/<script\b[^>]*\/>/gi, '')
    .replace(/<foreignObject\b[\s\S]*?<\/foreignObject\s*>/gi, '')
    .replace(/\son[a-z]+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, '')
    .replace(/(href\s*=\s*["'])\s*javascript:[^"']*/gi, '$1#');
}

// ------------------------------------------------------------------------------------------------- PNG

const SIG = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
const CRC = (() => { const t = new Int32Array(256); for (let n = 0; n < 256; n++) { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1; t[n] = c; } return t; })();
const crc32 = (buf) => { let c = -1; for (let i = 0; i < buf.length; i++) c = CRC[(c ^ buf[i]) & 0xff] ^ (c >>> 8); return (c ^ -1) >>> 0; };
export { crc32 };

/** a PNG -> {w, h, data: RGBA Uint8Array}; null for what this small decoder does not read (interlaced, 16-bit palette ...) */
export function decodePng(buf) {
  if (sniff(buf) !== 'png') return null;
  let p = 8, w, h, depth, ctype, interlace, pal = null, trns = null;
  const idat = [];
  while (p < buf.length) {
    const len = buf.readUInt32BE(p), type = buf.subarray(p + 4, p + 8).toString('latin1'), d = buf.subarray(p + 8, p + 8 + len);
    if (type === 'IHDR') { w = d.readUInt32BE(0); h = d.readUInt32BE(4); depth = d[8]; ctype = d[9]; interlace = d[12]; }
    else if (type === 'PLTE') pal = d;
    else if (type === 'tRNS') trns = d;
    else if (type === 'IDAT') idat.push(d);
    else if (type === 'IEND') break;
    p += 12 + len;
  }
  if (interlace || !w || !h || w * h > 4096 * 4096) return null;
  const ch = { 0: 1, 2: 3, 3: 1, 4: 2, 6: 4 }[ctype];
  if (!ch || ![1, 2, 4, 8, 16].includes(depth) || (depth < 8 && ctype !== 0 && ctype !== 3) || (depth === 16 && ctype === 3)) return null;
  const raw = zlib.inflateSync(Buffer.concat(idat));
  const bpp = Math.max(1, (ch * depth) >> 3), stride = (w * ch * depth + 7) >> 3;
  const lines = Buffer.alloc(stride * h);
  let prev = Buffer.alloc(stride);
  for (let y = 0; y < h; y++) {
    const f = raw[y * (stride + 1)], src = raw.subarray(y * (stride + 1) + 1, (y + 1) * (stride + 1)), cur = lines.subarray(y * stride, (y + 1) * stride);
    for (let i = 0; i < stride; i++) {
      const a = i >= bpp ? cur[i - bpp] : 0, b = prev[i], c = i >= bpp ? prev[i - bpp] : 0;
      let v = src[i];
      if (f === 1) v += a; else if (f === 2) v += b; else if (f === 3) v += (a + b) >> 1;
      else if (f === 4) { const pp = a + b - c, pa = Math.abs(pp - a), pb = Math.abs(pp - b), pc = Math.abs(pp - c); v += pa <= pb && pa <= pc ? a : pb <= pc ? b : c; }
      cur[i] = v & 0xff;
    }
    prev = cur;
  }
  const out = new Uint8Array(w * h * 4);
  const sample = (row, x, k) => {   // the k-th channel of pixel x in a row, scaled to 0-255
    if (depth === 8) return row[x * ch + k];
    if (depth === 16) return row[(x * ch + k) * 2];
    const bit = x * depth, v = (row[bit >> 3] >> (8 - depth - (bit & 7))) & ((1 << depth) - 1);
    return ctype === 3 ? v : Math.round(v * 255 / ((1 << depth) - 1));
  };
  for (let y = 0; y < h; y++) {
    const row = lines.subarray(y * stride, (y + 1) * stride);
    for (let x = 0; x < w; x++) {
      const o = (y * w + x) * 4;
      if (ctype === 3) {
        const i = sample(row, x, 0);
        out[o] = pal[i * 3]; out[o + 1] = pal[i * 3 + 1]; out[o + 2] = pal[i * 3 + 2]; out[o + 3] = trns && i < trns.length ? trns[i] : 255;
      } else if (ctype === 0 || ctype === 4) {
        const g = sample(row, x, 0); out[o] = out[o + 1] = out[o + 2] = g; out[o + 3] = ctype === 4 ? sample(row, x, 1) : 255;
      } else {
        out[o] = sample(row, x, 0); out[o + 1] = sample(row, x, 1); out[o + 2] = sample(row, x, 2); out[o + 3] = ctype === 6 ? sample(row, x, 3) : 255;
      }
    }
  }
  return { w, h, data: out };
}

/** RGBA -> PNG (colour type 6, filter 0 per row) */
export function encodePng({ w, h, data }) {
  const rows = Buffer.alloc((w * 4 + 1) * h);
  for (let y = 0; y < h; y++) Buffer.from(data.buffer, data.byteOffset + y * w * 4, w * 4).copy(rows, y * (w * 4 + 1) + 1);
  const chunk = (type, d) => {
    const len = Buffer.alloc(4); len.writeUInt32BE(d.length);
    const td = Buffer.concat([Buffer.from(type, 'latin1'), d]);
    const c = Buffer.alloc(4); c.writeUInt32BE(crc32(td));
    return Buffer.concat([len, td, c]);
  };
  const ihdr = Buffer.alloc(13); ihdr.writeUInt32BE(w, 0); ihdr.writeUInt32BE(h, 4); ihdr[8] = 8; ihdr[9] = 6;
  return Buffer.concat([SIG, chunk('IHDR', ihdr), chunk('IDAT', zlib.deflateSync(rows, { level: 9 })), chunk('IEND', Buffer.alloc(0))]);
}

/** the image scaled (box filter, premultiplied alpha) to fit inside size x size, centred on a square, with `pad` share of margin
 *  and an optional background colour [r, g, b] (null = transparent) */
export function squareIcon(img, size, { pad = 0.08, bg = null } = {}) {
  const inner = size * (1 - 2 * pad), s = Math.min(inner / img.w, inner / img.h);
  const tw = Math.max(1, Math.round(img.w * s)), th = Math.max(1, Math.round(img.h * s));
  const ox = Math.floor((size - tw) / 2), oy = Math.floor((size - th) / 2);
  const out = new Uint8Array(size * size * 4);
  if (bg) for (let i = 0; i < size * size; i++) { out[i * 4] = bg[0]; out[i * 4 + 1] = bg[1]; out[i * 4 + 2] = bg[2]; out[i * 4 + 3] = 255; }
  const fit = scale(img, tw, th);
  for (let y = 0; y < th; y++) for (let x = 0; x < tw; x++) {
    const si = (y * tw + x) * 4, di = ((y + oy) * size + x + ox) * 4, a = fit[si + 3] / 255;
    if (!bg) { out[di] = fit[si]; out[di + 1] = fit[si + 1]; out[di + 2] = fit[si + 2]; out[di + 3] = fit[si + 3]; continue; }
    for (let k = 0; k < 3; k++) out[di + k] = Math.round(fit[si + k] * a + out[di + k] * (1 - a));
  }
  return { w: size, h: size, data: out };
}
/** the image scaled to exactly tw x th (box filter, premultiplied alpha) */
export function scale(img, tw, th) {
  const out = new Uint8Array(tw * th * 4);
  const sx = img.w / tw, sy = img.h / th;
  for (let y = 0; y < th; y++) for (let x = 0; x < tw; x++) {
    const x0 = Math.floor(x * sx), x1 = Math.max(x0 + 1, Math.floor((x + 1) * sx)), y0 = Math.floor(y * sy), y1 = Math.max(y0 + 1, Math.floor((y + 1) * sy));
    let r = 0, g = 0, b = 0, a = 0, n = 0;
    for (let yy = y0; yy < y1 && yy < img.h; yy++) for (let xx = x0; xx < x1 && xx < img.w; xx++) {
      const i = (yy * img.w + xx) * 4, al = img.data[i + 3];
      r += img.data[i] * al; g += img.data[i + 1] * al; b += img.data[i + 2] * al; a += al; n++;
    }
    const o = (y * tw + x) * 4;
    if (a) { out[o] = Math.round(r / a); out[o + 1] = Math.round(g / a); out[o + 2] = Math.round(b / a); }
    out[o + 3] = n ? Math.round(a / n) : 0;
  }
  return out;
}
/** the image scaled to a given height (keeping its shape); for a smaller header logo */
export function toHeight(img, th) {
  if (img.h <= th) return img;
  const tw = Math.max(1, Math.round(img.w * th / img.h));
  return { w: tw, h: th, data: scale(img, tw, th) };
}
