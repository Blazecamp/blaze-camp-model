// app/brand-apply.js - what the active brand changes in the page, as pure functions (no DOM, no storage; tests/app-brand.test.mjs).
//   brandUi(brand, ui)            the app's words with the brand's overrides (app/i18n.js holds the shared words)
//   brandLang(brand, saved, nav)  the language the page opens in
//   brandRaw(raw, brand, base)    the raw model (before loadModel) with the brand's display words and its disclaimer link
// The legal party wording is applied by the build to the site's copy of the model's words (tools/brand-legal.mjs). The model files
// are never changed, and the engine builds every plan from the same model (a plan holds codes, not words).
import { LANGS, initialLang } from './i18n.js';

/** the app's words in `lang`, with the brand's overrides (brand.words[lang]; else app/i18n.js's word) */
export function brandUi(brand, ui) {
  const W = (brand && brand.words) || {};
  return (lang, key, args) => {
    const table = W[lang] || {};
    if (!Object.prototype.hasOwnProperty.call(table, key)) return ui(lang, key, args);
    const own = String(table[key]);
    return args ? own.replace(/\{(\w+)\}/g, (m, k) => (args[k] !== undefined && args[k] !== null ? String(args[k]) : m)) : own;
  };
}

/** true when the brand has its own word for `key` (brand-only lines such as the welcome) */
export const hasBrandWord = (brand, lang, key) => !!(brand && brand.words && brand.words[lang] && Object.prototype.hasOwnProperty.call(brand.words[lang], key));

/** the language to open in: the visitor's saved choice, else the browser's (a brand that follows it), else the brand's default */
export function brandLang(brand, saved, navigatorLang) {
  if (LANGS.includes(saved)) return saved;
  if (!brand || brand.follow_browser_lang) return initialLang(saved, navigatorLang);
  return LANGS.includes(brand.lang_default) ? brand.lang_default : 'en';
}

/**
 * The raw model (fetched JSON, before loadModel) as this brand shows it. Returns `raw` itself for a brand that changes nothing,
 * else a shallow copy with the brand's display words (brand.model_words) and, for a brand with its own disclaimer pages,
 * rules.legal.disclaimer_url pointing at them next to `baseHref` (absolute, so the links work in the page and in the PDF).
 */
export function brandRaw(raw, brand, baseHref) {
  const mw = (brand && brand.model_words) || {};
  const words = Object.values(mw).some(t => t && Object.keys(t).length);
  const D = brand && brand.legal && brand.legal.disclaimer;
  if (!words && !D) return raw;
  const i18n = { ...raw.i18n };
  for (const lang of LANGS) {
    if (!raw.i18n[lang] || !mw[lang]) continue;
    const table = { ...raw.i18n[lang] };
    for (const [k, v] of Object.entries(mw[lang])) if (Object.prototype.hasOwnProperty.call(table, k)) table[k] = v;
    i18n[lang] = table;
  }
  let rules = raw.rules;
  if (D && baseHref && rules && rules.legal) {
    const url = (f) => new URL(f, baseHref).href;
    rules = { ...rules, legal: { ...rules.legal, disclaimer_url: { ...rules.legal.disclaimer_url, en: url(D.en), es: url(D.es || D.en) } } };
  }
  return { ...raw, i18n, rules };
}
