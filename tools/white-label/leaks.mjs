// tools/white-label/leaks.mjs - the leak check for every brand other than the default one (coach's decisions CH7-02, CH7-03):
// a brand's site, pack and export never name another brand or the model's owner, except the owner inside the brand's own legal
// party wording ("Lalo Vera and BFit Studios Corp., doing business as <brand>"). Used by tools/build-site.mjs, tools/new-brand.mjs
// and tools/export-brand.mjs; tested by tests/white-label.test.mjs and tests/app-brand.test.mjs.
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { legalPartyTexts } from '../brand-legal.mjs';

/** the default brand's and the owner's names ("slalom" holds "lalo": whole words for the names) */
export const OWNER_NAMES = /blaze|\blalo\b|\bgerardo\b/i;
export const DEFAULT_BRAND = 'blazecamp';

const fold = (s) => String(s).normalize('NFD').replace(/[̀-ͯ]/g, '');
const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/** the phrases that name a brand: its name, short name and the parts of its credit line (4 characters or more) */
export function brandPhrases(b) {
  const out = new Set([b.name, b.short]);
  for (const l of ['en', 'es']) {
    const c = b.words && b.words[l] && b.words[l]['app.credit'];
    if (c) for (const part of String(c).split(/\s+·\s+/)) out.add(part);
  }
  return [...out].filter(x => x && x.trim().length >= 4);
}

/** every brand file in a folder: [{id, BRAND}] */
export async function readBrands(dir) {
  const out = [];
  for (const f of fs.readdirSync(dir).filter(x => /^[a-z0-9-]+\.js$/.test(x)).sort()) {
    const url = pathToFileURL(path.join(dir, f)).href + '?t=' + fs.statSync(path.join(dir, f)).mtimeMs;
    out.push({ id: f.slice(0, -3), BRAND: (await import(url)).BRAND });
  }
  return out;
}

/** a checker for `brand`'s files: (text) -> null | 'what was found ... in context' */
export function leakChecker(brand, others) {
  const allowed = brand.legal ? legalPartyTexts(brand.legal) : [];
  const own = new Set(brandPhrases(brand).map(x => fold(x).toLowerCase()));
  const phrases = [];
  for (const o of others) {
    if (o.id === brand.id || o.id === DEFAULT_BRAND) continue;   // the default brand is OWNER_NAMES
    for (const p of brandPhrases(o.BRAND)) if (!own.has(fold(p).toLowerCase())) phrases.push(p);
  }
  const re = phrases.length ? new RegExp(`(^|[^\\p{L}\\p{N}])(${phrases.map(p => esc(fold(p))).join('|')})(?![\\p{L}\\p{N}])`, 'iu') : null;
  return (text) => {
    let s = String(text);
    for (const a of allowed) s = s.split(a).join('');
    const m = OWNER_NAMES.exec(s);
    if (m) return `'${m[0]}' in "${s.slice(Math.max(0, m.index - 40), m.index + 40).replace(/\s+/g, ' ')}"`;
    if (re) {
      const f = fold(s), n = re.exec(f);
      if (n) return `'${n[2]}' (another brand) in "${f.slice(Math.max(0, n.index - 30), n.index + 50).replace(/\s+/g, ' ')}"`;
    }
    return null;
  };
}

/** the text files under `dir` that name another brand: [{file, found}] */
export function scanFolder(dir, check, { skip = () => false } = {}) {
  const out = [];
  const walk = (d, b = '') => fs.readdirSync(d, { withFileTypes: true }).flatMap(e => (e.isDirectory() ? walk(path.join(d, e.name), b ? b + '/' + e.name : e.name) : [b ? b + '/' + e.name : e.name]));
  for (const rel of walk(dir).filter(f => /\.(html|m?js|css|json|md|txt|svg|sh|webmanifest)$/.test(f))) {
    if (skip(rel)) continue;
    const found = check(fs.readFileSync(path.join(dir, rel), 'utf8'));
    if (found) out.push({ file: rel, found });
  }
  return out;
}
