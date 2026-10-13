// tools/white-label/website.mjs - best-effort brand facts from a gym's website, for tools/new-brand.mjs --from-website: its name,
// a logo, an icon, its colours and its language. Node 22's own fetch, no dependencies, nothing stored. Every finding says where it
// came from, so the agent can print what was found and what was guessed; explicit flags always win.
//   extractFromHtml(html, baseUrl)            the facts in one HTML page (pure; tests/white-label.test.mjs uses local fixtures)
//   fromWebsite(url, {fetchText, fetchBytes}) fetch the page and its linked stylesheets (at most 6), then the logo bytes, then (for
//                                             the gym's legal name, CH7-11) its terms / privacy / legal pages (at most 3)
//   legalNameCandidates(html, from, brand)    company names in a page: "© 2026 Iron Temple Fitness LLC", "Fuerza Latina S.A. de C.V."
// A logo may be any image a browser shows (PNG, JPEG, SVG, WEBP, GIF, ICO, an inline <svg>): tools/new-brand.mjs makes it a PNG.
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
    if (!src || /^data:/i.test(src) && !/^data:image\/(png|svg|jpeg|webp|gif)/i.test(src)) continue;
    const hay = [img.class, img.id, src, img.alt].join(' ');
    if (/logo/i.test(hay)) logos.push({ url: abs(src, base), kind: 'logo', from: '<img> with "logo" in ' + ['class', 'id', 'src', 'alt'].filter(k => /logo/i.test(k === 'src' ? src : img[k] || '')).join('/'), alt: img.alt || '' });
  }
  // an inline <svg> logo (common on site builders): the <svg> itself, or the first one inside an element named "logo"
  for (const m of String(html).matchAll(/<svg\b[^>]*>[\s\S]*?<\/svg\s*>/gi)) {
    const open = /^<svg\b[^>]*>/i.exec(m[0])[0], before = String(html).slice(Math.max(0, m.index - 300), m.index);
    const own = /logo/i.test(open), parent = /<[a-z][^<>]*logo[^<>]*>\s*(?:<[a-z][^<>]*>\s*){0,2}$/i.test(before);
    if (!own && !parent) continue;
    let svg = m[0];
    if (!/\sxmlns\s*=/.test(open)) svg = svg.replace(/^<svg\b/i, '<svg xmlns="http://www.w3.org/2000/svg"');
    logos.push({ url: 'data:image/svg+xml;base64,' + Buffer.from(svg).toString('base64'), kind: 'logo', from: own ? 'inline <svg> with "logo"' : 'inline <svg> inside a "logo" element' });
    if (logos.length >= 3) break;
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

// ------------------------------------------------------------------------------------------------- the gym's legal name (CH7-11)

/** a page as plain text, one line per block (scripts and styles dropped) */
export function pageText(html) {
  return decode(String(html).replace(/<(script|style|noscript|template)\b[\s\S]*?<\/\1\s*>/gi, ' ')
    .replace(/<\/?(br|p|div|li|ul|ol|footer|header|section|article|nav|h[1-6]|tr|td|table|aside|main)\b[^>]*>/gi, '\n')
    .replace(/<[^>]+>/g, ' ').replace(/&copy;|&#169;|&#xa9;/gi, '©')).replace(/[ \t\u00a0]+/g, ' ').split('\n').map(l => l.trim()).filter(Boolean).join('\n');
}
// company endings (English and Latin American / Spanish), the longest first
const ENTITY = String.raw`(?:L\.?\s?L\.?\s?C\.?|P\.?\s?L\.?\s?L\.?\s?C\.?|L\.?L\.?P\.?|Inc(?:orporated|\.)?|Corp(?:oration|\.)?|Ltd\.?|` +
  String.raw`S\.?\s?A\.?\s?P\.?\s?I\.?\s?de\s?C\.?\s?V\.?|S\.?\s?A\.?\s?de\s?C\.?\s?V\.?|S\.?\s?de\s?R\.?\s?L\.?(?:\s?de\s?C\.?\s?V\.?)?|S\.?\s?A\.?\s?S\.?|S\.?\s?R\.?\s?L\.?|S\.?\s?L\.?|S\.?\s?A\.?|SAS|SRL|LLC|PLLC|LLP)`;
// one to six name words (capitalised, digits, & and the small joining words) before the ending
const NAME_WORD = String.raw`(?:[A-Z0-9ÁÉÍÓÚÑÜ][\w'’&.\-]*|&|and|y|de|del|la|las|los|of|the)`;
const ENTITY_RE = new RegExp(String.raw`(${NAME_WORD}(?:\s+${NAME_WORD}){0,6}?),?\s+(${ENTITY})(?![\w])`, 'g');
// web platforms, payment and booking companies that sign many gyms' footers: never the gym
const NOT_THE_GYM = /\b(wix|squarespace|wordpress|automattic|godaddy|shopify|mindbody|glofox|zen ?planner|wodify|pushpress|google|meta platforms|facebook|apple|microsoft|stripe|paypal|weebly|webflow|hubspot|clubready|abc fitness|bfit studios)\b/i;
// what is left at the start of a footer line before the name: "©", "Copyright", years, "by"
const LEAD = /^(?:(?:©|\(c\)|copyright|derechos reservados|all rights reserved|todos los derechos reservados|by|por|\d{4}(?:\s*[-–]\s*\d{4})?|[,.|·•–-])\s*)+/i;

/**
 * Company names in one page, best first: [{value, from, score}]. A name with a company ending (LLC, Inc., Corp., S.A. de C.V.,
 * S.A.S. ...) counts; a footer "©" line scores higher, and a name that shares a word with the gym's brand name higher still.
 * Without any company ending, the "©" holder is returned with entity: false (a hint, never confirmed).
 */
export function legalNameCandidates(html, from, brand = '') {
  const text = pageText(html), out = [];
  const brandWords = new Set(String(brand).toLowerCase().split(/[^\p{L}\p{N}]+/u).filter(w => w.length >= 3 && !/^(gym|the|club|fitness|studio|crossfit|training|center|centro)$/.test(w)));
  const seen = new Set();
  for (const line of text.split('\n')) {
    const copy = /©|\(c\)|copyright|derechos reservados/i.test(line);
    for (const m of line.matchAll(ENTITY_RE)) {
      // the name starts after the last sentence end inside it ("Welcome. Iron Temple Fitness LLC")
      let name = m[1].split(/[.!?]\s+(?=[A-ZÁÉÍÓÚÑ])/).pop().replace(LEAD, '').trim();
      name = name.replace(/^(?:(?:and|y|de|del|la|las|los|of|the)(?:\s+|$))+/i, '').trim();
      if (!name || !/[A-Za-zÁÉÍÓÚÑ]/.test(name)) continue;
      const value = `${name}${/^,/.test(line.slice(m.index + m[1].length)) ? ',' : ''} ${m[2].replace(/\s+/g, ' ')}`.replace(/\s+,/, ',').trim()
        .replace(/\b(LLC|PLLC|LLP|SAS|SRL)\.$/, '$1');   // "Iron Temple Fitness LLC." at a sentence end
      if (NOT_THE_GYM.test(value) || value.length > 80) continue;
      const key = value.toLowerCase().replace(/[^a-z0-9]/g, '');
      if (seen.has(key)) continue;
      seen.add(key);
      const shares = [...brandWords].some(w => value.toLowerCase().includes(w));
      out.push({ value, entity: true, page: from, copyright: copy, from: `${from}${copy ? ', copyright line' : ''}: "${line.length > 90 ? line.slice(0, 87) + '...' : line}"`, score: (copy ? 2 : 1) + (shares ? 2 : 0) });
    }
    if (copy && !out.some(c => c.from.includes(line.slice(0, 40)))) {
      const holder = line.replace(/^.*?(?:©|\(c\)|copyright)\s*/i, '').replace(LEAD, '').split(/[.|·•]|\s[-–]\s|all rights|todos los derechos|derechos reservados/i)[0].trim();
      if (holder && holder.length <= 60 && /[A-Za-zÁÉÍÓÚÑ]/.test(holder) && !NOT_THE_GYM.test(holder)) {
        out.push({ value: holder, entity: false, from: `${from}, copyright line: "${line.length > 90 ? line.slice(0, 87) + '...' : line}"`, score: 0 });
      }
    }
  }
  return out.sort((a, b) => b.score - a.score);
}

/** links from the home page to its terms, privacy or legal pages (same site), at most 3 */
export function legalPageUrls(html, base) {
  const out = [];
  const host = (() => { try { return new URL(base).host; } catch { return null; } })();
  for (const m of String(html).matchAll(/<a\b([^>]*)>([\s\S]*?)<\/a\s*>/gi)) {
    const href = (/\shref\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/i.exec(m[1]) || [])[1];
    if (!href) continue;
    const url = abs(decode(href.replace(/^["']|["']$/g, '')), base), label = decode(m[2].replace(/<[^>]+>/g, ' '));
    if (!url || !/^(https?|file):/.test(url) || (host && new URL(url).host !== host)) continue;
    if (!/terms|privacy|legal|conditions|policy|waiver|t[ée]rminos|privacidad|aviso|condiciones|pol[ií]tica/i.test(url + ' ' + label)) continue;
    const u = url.replace(/#.*$/, '');
    if (!out.includes(u) && u !== String(base).replace(/#.*$/, '')) out.push(u);
    if (out.length >= 3) break;
  }
  return out;
}

/** every fact from one page (no network) */
export function extractFromHtml(html, baseUrl, cssTexts = []) {
  const name = siteName(html);
  const lang = siteLang(html);
  const images = imageCandidates(html, baseUrl);
  const colors = pickColors(colorFacts(html, cssTexts));
  const legal = legalNameCandidates(html, 'home page', name ? name.value : '');
  return { name, lang: lang ? { value: lang, from: '<html lang>' } : null, images, colors, legal };
}

/** the best legal name: a company name (entity ending) from the home page or its legal pages; else null */
export function pickLegalName(cands) {
  const best = cands.filter(c => c.entity).sort((a, b) => b.score - a.score)[0];
  return best ? { value: best.value, from: best.from, page: best.page, copyright: best.copyright } : null;
}

/** the linked stylesheets of a page (same order as the page), absolute */
export const stylesheetUrls = (html, base) => tags(html, 'link').filter(l => /stylesheet/i.test(l.rel || '') && l.href).map(l => abs(l.href, base)).filter(Boolean);

/**
 * Fetch a website and pull its brand facts. `io` lets a caller (or a test) read local files instead of the network:
 *   io.fetchText(url) -> string, io.fetchBytes(url) -> Buffer. Defaults: Node's fetch, 15 s, 3 MB at most.
 * The logo (and icon) chosen are the first candidates that download as an image (PNG, JPEG, SVG, WEBP, GIF, ICO).
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
        if (['png', 'jpeg', 'svg', 'webp', 'gif', 'ico'].includes(type)) return { ...c, type, bytes: buf };
        tried.push(`${c.url} (${type || 'unknown type'}: skipped)`);
      } catch (e) { tried.push(`${c.url} (${e.message})`); }
    }
    return null;
  };
  facts.logo = await firstImage(facts.images.logo);
  facts.icon = await firstImage(facts.images.icon.filter(c => !facts.logo || c.url !== facts.logo.url));
  // the gym's legal name: the home page, then its terms / privacy / legal pages
  const cands = [...facts.legal];
  for (const u of legalPageUrls(html, url)) {
    try { cands.push(...legalNameCandidates(await fetchText(u), u, facts.name ? facts.name.value : '')); } catch (e) { tried.push(`${u} (${e.message})`); }
  }
  facts.legal = cands.sort((a, b) => b.score - a.score);
  facts.legal_name = pickLegalName(facts.legal);
  facts.copyright_holder = facts.legal_name ? null : (facts.legal.find(c => !c.entity) || null);
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
