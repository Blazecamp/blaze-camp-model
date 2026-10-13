// app/model-loader.js - fetch the compiled model (model/*.json) and load it with the engine's own loadModel. Used by the page and
// by the worker. Nothing is written anywhere; the browser's HTTP cache is the only cache.
import { loadModel } from '../engine/model.mjs';

const FILES = { manifest: 'manifest.json', catalog: 'catalog.json', rules: 'rules.json', templates: 'templates.json', profiles: 'profiles.json' };
const I18N = { en: 'i18n/en.json', es: 'i18n/es.json', es_review: 'i18n/es_review.json' };

/**
 * @param {string|URL} [base] the model folder (default: ../model/ next to this file)
 * @param {(raw: object) => object} [transform] changes the raw model before loading (the page: the brand's words, app/brand-apply.js)
 */
export async function fetchModel(base, transform) {
  const root = base ? new URL(base, import.meta.url) : new URL('../model/', import.meta.url);
  const get = async (f, v, cache) => {
    const u = new URL(f, root);
    if (v) u.searchParams.set('v', v);
    // same-origin credentials (the fetch default): a protected preview (Vercel Authentication) needs its cookie on these requests
    const r = await fetch(u.href, { credentials: 'same-origin', cache: cache || 'default' });
    if (!r.ok) throw new Error(`${f}: HTTP ${r.status}`);
    return r.json();
  };
  // the manifest (always revalidated) names the model version; the other files are fetched with it, so a new model is never
  // mixed with a cached old one
  const manifest = await get(FILES.manifest, null, 'no-cache');
  const v = manifest.model_version || '';
  const names = Object.keys(FILES).filter(k => k !== 'manifest');
  const parts = await Promise.all([...names.map(k => get(FILES[k], v)), ...Object.values(I18N).map(f => get(f, v))]);
  const raw = { manifest, i18n: {} };
  names.forEach((k, i) => { raw[k] = parts[i]; });
  Object.keys(I18N).forEach((k, i) => { raw.i18n[k] = parts[names.length + i]; });
  return loadModel(transform ? transform(raw) : raw);
}
