// tools/white-label/raster.mjs - any logo as a clean PNG (coach CH7-12: "remake the logo for a PNG ... and have the power to
// rebuild"). No npm dependencies: a browser draws the image and takes a screenshot of it, then tools/white-label/images.mjs trims
// the empty border and sizes it in plain Node.
//
// The browser, in this order:
//   1. Playwright: env BC_PLAYWRIGHT (its index.mjs, or its folder), else `import('playwright')`; the browser is env BC_CHROMIUM
//      (an executable) or Playwright's own. The screenshot leaves the background out (omitBackground), so an SVG stays transparent.
//   2. A Chrome or Chromium on the PATH (or env BC_CHROMIUM without Playwright): `--headless --screenshot` with a transparent
//      default background.
//   3. None: an Error with a plain message for the agent (make a PNG with your own image tools, rerun with --logo file.png).
// env BC_NO_BROWSER=1 acts as if there were none (tests).
//
//   findBrowser()                               -> {kind: 'playwright' | 'cli', label, ...} | null
//   logoToPng(bytes, {browser, maxWidth: 512})  -> {png: Buffer, w, h, from: 'png' | 'svg' | ...}  (trimmed, transparent where it can)
//   wordmarkPng(text, color, {browser})         -> {png, w, h}  the gym's name as a clean wordmark, for a site with no usable logo
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { pathToFileURL } from 'node:url';
import { sniff, dimensions, sanitizeSvg, decodePng, encodePng, trimImage, toWidth, MIME } from './images.mjs';

export const NO_BROWSER = 'No browser to turn this logo into a PNG (Playwright, or Chrome / Chromium on the PATH; env BC_PLAYWRIGHT, BC_CHROMIUM). ' +
  'Make a PNG of the logo yourself (your own image tools: open the logo and save or export it as PNG, transparent background, about 512 px wide), ' +
  'then run the same command again with --logo <file.png>.';
const CLI_NAMES = ['chromium', 'chromium-browser', 'google-chrome', 'google-chrome-stable', 'chrome', 'headless_shell'];

function onPath(name) {
  for (const dir of String(process.env.PATH || '').split(path.delimiter)) {
    const p = path.join(dir, name);
    try { fs.accessSync(p, fs.constants.X_OK); if (fs.statSync(p).isFile()) return p; } catch { /* not here */ }
  }
  return null;
}

/** the browser to draw with, or null */
export async function findBrowser(env = process.env) {
  if (env.BC_NO_BROWSER === '1') return null;
  const exe = env.BC_CHROMIUM && fs.existsSync(env.BC_CHROMIUM) ? env.BC_CHROMIUM : null;
  let spec = env.BC_PLAYWRIGHT || 'playwright';
  if (env.BC_PLAYWRIGHT && fs.existsSync(env.BC_PLAYWRIGHT) && fs.statSync(env.BC_PLAYWRIGHT).isDirectory()) spec = path.join(env.BC_PLAYWRIGHT, 'index.mjs');
  if (spec !== 'playwright') spec = pathToFileURL(path.resolve(spec)).href;
  try {
    const pw = await import(spec);
    const chromium = pw.chromium || (pw.default && pw.default.chromium);
    if (chromium) {
      // a quick launch proves the browser is really there
      const b = await chromium.launch(exe ? { executablePath: exe } : {});
      await b.close();
      return { kind: 'playwright', chromium, executablePath: exe, label: `Playwright${exe ? ' + ' + exe : ''}` };
    }
  } catch { /* no Playwright, or no browser for it */ }
  const bin = exe || CLI_NAMES.map(onPath).find(Boolean);
  return bin ? { kind: 'cli', bin, label: bin } : null;
}

/** one HTML page, transparent, with `body` inside a w x h box */
const page = (body, w, h) => `<!doctype html><html><head><meta charset="utf-8"><style>html,body{margin:0;padding:0;background:transparent;overflow:hidden}` +
  `#box{width:${w}px;height:${h}px;display:flex;align-items:center;justify-content:flex-start}img{display:block;width:${w}px;height:${h}px;object-fit:contain}</style></head><body><div id="box">${body}</div></body></html>`;

/** a screenshot of an HTML page (w x h, transparent background) as RGBA */
async function shoot(browser, html, w, h) {
  if (browser.kind === 'playwright') {
    const b = await browser.chromium.launch(browser.executablePath ? { executablePath: browser.executablePath } : {});
    try {
      const p = await b.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: 1 });
      await p.setContent(html, { waitUntil: 'load' });
      await p.evaluate(() => (document.fonts ? document.fonts.ready : null));
      return decodePng(await p.screenshot({ omitBackground: true, clip: { x: 0, y: 0, width: w, height: h } }));
    } finally { await b.close(); }
  }
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'logo-png-'));
  try {
    const f = path.join(dir, 'page.html'), out = path.join(dir, 'shot.png');
    fs.writeFileSync(f, html);
    // the page area of a headless window is smaller than --window-size: a larger window, then the w x h corner is kept
    execFileSync(browser.bin, ['--headless=new', '--no-sandbox', '--disable-gpu', '--hide-scrollbars', '--no-first-run', '--default-background-color=00000000',
      `--user-data-dir=${path.join(dir, 'profile')}`, `--screenshot=${out}`, `--window-size=${w + 200},${h + 400}`, pathToFileURL(f).href], { stdio: 'pipe', timeout: 60000 });
    const full = decodePng(fs.readFileSync(out));
    if (!full || full.w < w || full.h < h) return null;
    const data = new Uint8Array(w * h * 4);
    for (let y = 0; y < h; y++) data.set(full.data.subarray(y * full.w * 4, y * full.w * 4 + w * 4), y * w * 4);
    return { w, h, data };
  } finally { fs.rmSync(dir, { recursive: true, force: true }); }
}

/** the drawing box for an image of natural size d: inside 512 x 512 (an SVG is scaled up or down to it; a picture is never enlarged) */
function box(d, type, max) {
  if (!d || !d.w || !d.h) return { w: max, h: max };
  const s = type === 'svg' ? Math.min(max / d.w, max / d.h) : Math.min(1, max / d.w, max / d.h);
  return { w: Math.max(1, Math.round(d.w * s)), h: Math.max(1, Math.round(d.h * s)) };
}

/**
 * Any logo as a clean PNG: drawn by the browser (PNG files the built-in reader understands need none), trimmed of its empty border,
 * at most maxWidth wide. Throws Error(NO_BROWSER) when a browser is needed and there is none.
 */
export async function logoToPng(bytes, { browser, maxWidth = 512 } = {}) {
  const type = sniff(bytes);
  if (!type) throw new Error('the logo is not an image this tool knows (PNG, JPEG, SVG, WEBP, GIF or ICO)');
  let img = type === 'png' ? decodePng(bytes) : null;
  if (!img) {
    if (!browser) throw new Error(NO_BROWSER);
    const src = type === 'svg' ? Buffer.from(sanitizeSvg(bytes.toString('utf8'))) : bytes;
    const b = box(dimensions(bytes, type), type, maxWidth);
    img = await shoot(browser, page(`<img alt="" src="data:${MIME[type]};base64,${src.toString('base64')}">`, b.w, b.h), b.w, b.h);
    if (!img) throw new Error('the browser could not draw the logo');
  }
  img = toWidth(trimImage(img), maxWidth);
  return { png: encodePng(img), w: img.w, h: img.h, from: type };
}

/** the gym's name as a wordmark PNG in `color` (a heavy sans-serif, transparent background, trimmed, at most maxWidth wide) */
export async function wordmarkPng(text, color, { browser, maxWidth = 512 } = {}) {
  if (!browser) throw new Error(NO_BROWSER.replace('this logo', 'a wordmark'));
  const esc = String(text).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const w = Math.max(1200, [...String(text)].length * 120 + 80), h = 240;
  const html = `<!doctype html><html><head><meta charset="utf-8"><style>html,body{margin:0;padding:0;background:transparent;overflow:hidden}` +
    `div{display:inline-block;padding:20px;font:800 140px/1.15 "Helvetica Neue",Arial,"Liberation Sans","DejaVu Sans",sans-serif;letter-spacing:-2px;color:${/^#[0-9a-f]{6}$/i.test(color) ? color : '#111111'};white-space:nowrap}</style></head><body><div>${esc}</div></body></html>`;
  let img = await shoot(browser, html, w, h);
  if (!img) throw new Error('the browser could not draw the wordmark');
  img = toWidth(trimImage(img), maxWidth);
  return { png: encodePng(img), w: img.w, h: img.h };
}
