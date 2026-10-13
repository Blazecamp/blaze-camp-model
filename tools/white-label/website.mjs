// tools/white-label/website.mjs - best-effort brand facts from a gym's website, for tools/new-brand.mjs --from-website: its name,
// a logo, an icon, its colours and its language. Node 22's own fetch, no dependencies, nothing stored. Every finding says where it
// came from, so the agent can print what was found and what was guessed; explicit flags always win.
//   extractFromHtml(html, baseUrl)            the facts in one HTML page (pure; tests/white-label.test.mjs uses local fixtures)
//   fromWebsite(url, {fetchText, fetchBytes}) fetch the page and its linked stylesheets (at most 6), then the logo bytes
import { normHex, isBrandish, hueDistance, hsl } from './colors.mjs';
import { sniff } from './images.mjs';

const decode = (s) => String(s || '').replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#0?39;|&apos;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>')
  .replace(/&#(\d+);/g, (m, n) => String.fromCodePoint(+n)).replace(/&#x([0-9a-f]+);/gi, (m, n) => String.fromCodePoint(parseInt(n, 16))).replace(/&nbsp;/g, ' ').trim();
/** every tag `name` as {attr: value} (lower-case attribute names) */
export function tags(html, name) {
  const out = [];
  for (const m of String(html).matchAll(new RegExp(`<${name}\\b([^>]*)>`, 'gi'))) {
    const a = {};
    for (const x of m[1].matchAll(/([a-zA-Z_:][-\w:.]*)\s*(?:=\s*("[^"]*"|'[^']*'|[^\s"'>]+))?/g)) a[x[1].toLowerCase()] = decode((x[2] || '').replace(/^["']|["']$/g, ''));
    out.push(a);
  }
  return out;
}
const abs = (u, base) => { try { return new URL(u, base).href; } catch { return null; } };

/** the site's name: og:site_name > application-name > <title> (the part that looks like a name) */
export function siteName(html) {
  const meta = tags(html, 'meta');
  const og = meta.find(m => (m.property || m.name || '').toLowerCase() === 'og:site_name' && m.content);
  if (og) return { value: og.content, from: 'og:site_name' };
  const app = meta.find(m => (m.name || '').toLowerCase() === 'application-name' && m.content);
  if (app) return { value: app.content, from: 'application-name' };
  const t = /<title[^>]*>([\s\S]*?)<\/title>/i.exec(html);
  if (t) {
    const full = decode(t[1].replace(/\s+/g, ' '));
    const parts = full.split(/\s+[|·•–—-]\s+|\s*\|\s*/).map(x => x.trim()).filter(Boolean);
    // "Home - Iron Temple Gym" / "Iron Temple Gym | Strength in Miami": the shortest part that is not a generic page word
    const generic = /^(home|inicio|welcome|bienvenid[oa]s?|official site|sitio oficial|page)$/i;
    const pick = parts.filter(p => !generic.test(p)).sort((a, b) => a.length - b.length)[0] || full;
    return { value: pick, from: parts.length > 1 ? `<title> (one part of "${full}")` : '<title>' };
  }
  return null;
}

/** the page's language: <html lang> -> 'en' | 'es' | null */
export function siteLang(html) {
  const m = /<html\b[^>]*\slang\s*=\s*["']?([a-zA-Z-]+)/i.exec(html);
  if (!m) return null;
  return /^es/i.test(m[1]) ? 'es' : /^en/i.test(m[1]) ? 'en' : null;
}

/** logo and icon candidates, best first: [{url, kind, from, size?}] */
export function imageCandidates(html, base) {
  const logos = [], icons = [];
  // <img> (and <source> / inline <svg> are skipped) with "logo" in its class, id, src or alt
  for (const img of tags(html, 'img')) {
    const src = img.src || img['data-src'] || (img.srcset || '').split(/\s+/)[0];
    if (!src || /^data:/i.test(src) && !/^data:image\/(png|svg|jpeg)/i.test(src)) continue;
    const hay = [img.class, img.id, src, img.alt].join(' ');
    if (/logo/i.test(hay)) logos.push({ url: abs(src, base), kind: 'logo', from: '<img> with "logo" in ' + ['class', 'id', 'src', 'alt'].filter(k => /logo/i.test(k === 'src' ? src : img[k] || '')).join('/'), alt: img.alt || '' });
  }
  for (const l of tags(html, 'link')) {
    const rel = (l.rel || '').toLowerCase(), href = l.href && abs(l.href, base);
    if (!href) continue;
    const size = Math.max(0, ...String(l.sizes || '').split(/\s+/).map(s => parseInt(s, 10) || 0));
    if (/apple-touch-icon/.test(rel)) icons.push({ url: href, kind: 'icon', from: 'apple-touch-icon', size: size || 180 });
    else if (/\bicon\b/.test(rel)) icons.push({ url: href, kind: 'icon', from: `icon${size ? ' ' + size + 'px' : ''}${/svg/.test(l.type || href) ? ' (svg)' : ''}`, size: size || (/\.svg(\?|$)/i.test(href) ? 512 : 16) });
  }
  icons.sort((a, b) => (b.from === 'apple-touch-icon') - (a.from === 'apple-touch-icon') || b.size - a.size);
  const og = tags(html, 'meta').find(m => /^og:image$/i.test(m.property || m.name || '') && m.content);
  const ogc = og ? [{ url: abs(og.content, base), kind: 'og', from: 'og:image' }] : [];
  // the header logo: an <img> logo, else the apple-touch-icon / largest icon, else og:image (often a photo: last)
  return { logo: [...logos, ...icons, ...ogc].filter(x => x.url), icon: [...icons, ...logos].filter(x => x.url) };
}

/** colour facts: theme-color, CSS custom properties, the most frequent brand-like hex in the CSS */
export function colorFacts(html, cssTexts = []) {
  const meta = tags(html, 'meta').find(m => (m.name || '').toLowerCase() === 'theme-color' && m.content);
  const theme = meta ? normHex(meta.content) : null;
  const css = [...String(html).matchAll(/<style[^>]*>([\s\S]*?)<\/style>/gi)].map(m => m[1]).concat(
    [...String(html).matchAll(/\sstyle\s*=\s*"([^"]*)"/gi)].map(m => m[1]), cssTexts).join('\n');
  const props = [];
  for (const m of css.matchAll(/--([\w-]+)\s*:\s*(#[0-9a-fA-F]{3,6})\b/g)) {
    const c = normHex(m[2]);
    if (c) props.push({ name: m[1], color: c });
  }
  const named = (re) => props.filter(p => re.test(p.name)).map(p => p.color).find(isBrandish) || null;
  const freq = new Map();
  for (const m of css.matchAll(/#([0-9a-fA-F]{6}|[0-9a-fA-F]{3})\b/g)) {
    const c = normHex(m[0]);
    if (c && isBrandish(c)) freq.set(c, (freq.get(c) || 0) + 1);
  }
  const frequent = [...freq.entries()].sort((a, b) => b[1] - a[1] || (a[0] < b[0] ? -1 : 1)).map(([c, n]) => ({ color: c, count: n }));
  const darkInk = props.filter(p => /(^|-)(text|ink|heading|dark|foreground|body)(-|$)/i.test(p.name)).map(p => p.color).find(c => hsl(c)[2] < 0.3) || null;
  return { theme, primary_prop: named(/(^|-)(primary|brand|main)(-|$)/i), accent_prop: named(/(^|-)(accent|secondary|highlight)(-|$)/i), frequent, ink: darkInk };
}

/** primary and accent from the colour facts, each with where it came from */
export function pickColors(f) {
  const primary = f.primary_prop ? { value: f.primary_prop, from: 'CSS variable (primary / brand)' }
    : f.theme && isBrandish(f.theme) ? { value: f.theme, from: 'meta theme-color' }
    : f.frequent[0] ? { value: f.frequent[0].color, from: `most used colour in the CSS (${f.frequent[0].count}x)` } : null;
  if (!primary) return { primary: null, accent: null, ink: f.ink ? { value: f.ink, from: 'CSS variable (text)' } : null };
  const far = (c) => hueDistance(c, primary.value) >= 30;
  const accent = f.accent_prop && f.accent_prop !== primary.value ? { value: f.accent_prop, from: 'CSS variable (accent / secondary)' }
    : f.theme && isBrandish(f.theme) && f.theme !== primary.value ? { value: f.theme, from: 'meta theme-color' }
    : (() => { const x = f.frequent.find(x => x.color !== primary.value && far(x.color)); return x ? { value: x.color, from: `next most used colour in the CSS (${x.count}x)` } : null; })();
  return { primary, accent, ink: f.ink ? { value: f.ink, from: 'CSS variable (text)' } : null };
}

/** every fact from one page (no network) */
export function extractFromHtml(html, baseUrl, cssTexts = []) {
  const name = siteName(html);
  const lang = siteLang(html);
  const images = imageCandidates(html, baseUrl);
  const colors = pickColors(colorFacts(html, cssTexts));
  return { name, lang: lang ? { value: lang, from: '<html lang>' } : null, images, colors };
}

/** the linked stylesheets of a page (same order as the page), absolute */
export const stylesheetUrls = (html, base) => tags(html, 'link').filter(l => /stylesheet/i.test(l.rel || '') && l.href).map(l => abs(l.href, base)).filter(Boolean);

/**
 * Fetch a website and pull its brand facts. `io` lets a caller (or a test) read local files instead of the network:
 *   io.fetchText(url) -> string, io.fetchBytes(url) -> Buffer. Defaults: Node's fetch, 15 s, 3 MB at most.
 * The logo (and icon) chosen are the first candidates that download as PNG, JPEG or SVG.
 */
export async function fromWebsite(url, io = {}) {
  const fetchText = io.fetchText || (async (u) => (await netFetch(u)).toString('utf8'));
  const fetchBytes = io.fetchBytes || netFetch;
  const html = await fetchText(url);
  const css = [];
  for (const u of stylesheetUrls(html, url).slice(0, 6)) { try { css.push(await fetchText(u)); } catch { /* a stylesheet that does not load is skipped */ } }
  const facts = extractFromHtml(html, url, css);
  const tried = [];
  const firstImage = async (list) => {
    for (const c of list) {
      try {
        const buf = c.url.startsWith('data:') ? dataUrlBytes(c.url) : await fetchBytes(c.url);
        const type = sniff(buf);
        if (['png', 'jpeg', 'svg'].includes(type)) return { ...c, type, bytes: buf };
        tried.push(`${c.url} (${type || 'unknown type'}: skipped)`);
      } catch (e) { tried.push(`${c.url} (${e.message})`); }
    }
    return null;
  };
  facts.logo = await firstImage(facts.images.logo);
  facts.icon = await firstImage(facts.images.icon.filter(c => !facts.logo || c.url !== facts.logo.url));
  facts.skipped = tried;
  return facts;
}
function dataUrlBytes(u) {
  const m = /^data:[^,;]+(;base64)?,(.*)$/s.exec(u);
  return m[1] ? Buffer.from(m[2], 'base64') : Buffer.from(decodeURIComponent(m[2]), 'utf8');
}
async function netFetch(u) {
  const ctl = new AbortController(), t = setTimeout(() => ctl.abort(), 15000);
  try {
    const r = await fetch(u, { signal: ctl.signal, redirect: 'follow', headers: { 'user-agent': 'Mozilla/5.0 (white-label brand setup)' } });
    if (!r.ok) throw new Error('HTTP ' + r.status);
    const buf = Buffer.from(await r.arrayBuffer());
    if (buf.length > 3 * 1024 * 1024) throw new Error('larger than 3 MB');
    return buf;
  } finally { clearTimeout(t); }
}
