// agent/core.mjs - what an AI agent needs to build a plan, shared by the CLI (tools/plan.mjs), the MCP server
// (agent/mcp-server.mjs) and the HTTP API (api/*.mjs, agent/http.mjs). Node 22, no npm dependencies.
//
// One source for everything: the wizard's answers -> intake/2 (app/intake-builder.js), the engine (engine/*.mjs), the compiled
// model (model/*.json), the brand (app/brands/<id>.js) with its words over the model (tools/brand-legal.mjs > brandModelRaw, the
// same function the site build uses), the PDF (app/pdf.js with the vendored jsPDF) and the prefilled web link (app/prefill.js).
// A new brand is one new app/brands/<id>.js: nothing here names a brand.
//
// Rules kept here (AGENTS.md §10): no plan without the accepted release (H20; the engine checks it first); a health-check yes
// warns and does not stop the plan (R5-GEN-02); no sex, gender or lifestyle field and no session length (the engine refuses them,
// H13, H16, CT-01); nothing is stored or logged (R3-GEN-01): files are written only where the caller asks, and only the plan.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { createRequire } from 'node:module';
import { loadModel } from '../engine/model.mjs';
import { generate } from '../engine/generate.mjs';
import { validateIntake } from '../engine/intake.mjs';
import { renderPlan } from '../engine/render.mjs';
import { applyPlanEdits } from '../engine/edit.mjs';
import * as B from '../app/intake-builder.js';
import * as V from '../app/plan-view.js';
import { ui } from '../app/i18n.js';
import { brandUi } from '../app/brand-apply.js';
import { stripMarkers, markdown, escapeHtml } from '../app/md.js';
import { pdfDoc, drawPdf, pdfFileName } from '../app/pdf.js';
import { prefillLink } from '../app/prefill.js';
import { brandModelRaw } from '../tools/brand-legal.mjs';

export const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const LANGS = ['en', 'es'];
export const FORMATS = ['md', 'json', 'pdf', 'html'];
const BRANDS_DIR = path.join(ROOT, 'app', 'brands');

// ------------------------------------------------------------------------------------------------- brands

/** the brand ids: every app/brands/<id>.js */
export function brandIds() {
  return fs.readdirSync(BRANDS_DIR).filter(f => /^[a-z0-9-]+\.js$/.test(f)).map(f => f.slice(0, -3)).sort();
}
const brandCache = new Map();
/** a brand by id (default: env BRAND, else blazecamp) */
export async function loadBrand(id) {
  const bid = String(id || process.env.BRAND || 'blazecamp').trim().toLowerCase();
  if (!brandIds().includes(bid)) throw new AgentError('unknown_brand', `unknown brand '${bid}' (known: ${brandIds().join(', ')})`);
  if (!brandCache.has(bid)) brandCache.set(bid, (await import(pathToFileURL(path.join(BRANDS_DIR, bid + '.js')).href)).BRAND);
  return brandCache.get(bid);
}
/** every brand with what an agent needs to know about it */
export async function listBrands() {
  const out = [];
  for (const id of brandIds()) {
    const b = await loadBrand(id);
    out.push({ id, name: b.name, lang_default: b.lang_default, site_url: siteUrlFor(b) || null, own_legal_pages: !!b.legal, pdf_file_prefix: b.pdf.file_prefix });
  }
  return out;
}
/** the brand's public site: explicit > env SITE_URL_<ID> > env SITE_URL > the brand file's site_url */
export function siteUrlFor(brand, explicit) {
  const env = process.env['SITE_URL_' + brand.id.toUpperCase().replace(/-/g, '_')] || process.env.SITE_URL;
  const u = explicit || env || brand.site_url || null;
  if (!u) return null;
  if (!/^https?:\/\//.test(u)) throw new AgentError('bad_site', `the site address must start with https:// (got '${u}')`);
  return u.replace(/\/?$/, '/');
}

export class AgentError extends Error {
  constructor(code, message) { super(message); this.code = code; }
}

// ------------------------------------------------------------------------------------------------- the model, per brand

let rawCache = null;
/** the compiled model as read from model/ (never changed) */
export function rawModel() {
  if (rawCache) return rawCache;
  const dir = path.join(ROOT, 'model');
  const read = (rel) => JSON.parse(fs.readFileSync(path.join(dir, rel), 'utf8'));
  const manifest = read('manifest.json');
  const f = manifest.files;
  rawCache = { manifest, catalog: read(f.catalog), rules: read(f.rules), templates: read(f.templates), profiles: read(f.profiles),
    i18n: { en: read(f.i18n.en), es: read(f.i18n.es), es_review: read(f.i18n.es_review) } };
  return rawCache;
}
const modelCache = new Map();
/** the loaded model as the brand's web tool shows it (its words and legal party wording); cached per brand and site */
export function modelFor(brand, siteUrl) {
  const key = brand.id + '|' + (siteUrl || '');
  if (modelCache.has(key)) return modelCache.get(key);
  if (brand.legal && !siteUrl) {
    throw new AgentError('site_needed', `brand ${brand.id} links its own disclaimer pages from the release, so its site address is needed: pass --site https://... (or set SITE_URL_${brand.id.toUpperCase()} / SITE_URL, or app/brands/${brand.id}.js > site_url)`);
  }
  const raw = rawModel();
  // a fresh copy of each part loadModel may freeze (the cached raw stays reusable for the other brands)
  const copy = { ...raw, rules: JSON.parse(JSON.stringify(raw.rules)), i18n: { en: { ...raw.i18n.en }, es: { ...raw.i18n.es }, es_review: JSON.parse(JSON.stringify(raw.i18n.es_review)) },
    catalog: JSON.parse(JSON.stringify(raw.catalog)), templates: JSON.parse(JSON.stringify(raw.templates)), profiles: JSON.parse(JSON.stringify(raw.profiles)), manifest: JSON.parse(JSON.stringify(raw.manifest)) };
  const m = loadModel(brandModelRaw(copy, brand, { siteUrl }));
  modelCache.set(key, m);
  return m;
}

// ------------------------------------------------------------------------------------------------- answers -> intake

/** today in the machine's own time zone (the CLI and the server; the engine itself never reads a clock) */
export function todayIso() { return B.isoOf(new Date()); }

/**
 * Partial wizard answers (any subset of app/intake-builder.js > defaultAnswers) over the defaults. The health check: `health`
 * 'none' | 'some' with `safety` {heart, surgery_6mo, pregnant_postpartum_6mo, injury_in_treatment, doctor_said_no}; when only
 * `safety` is given, `health` follows from it. Weekdays left out = the template's own days (the engine picks them).
 */
export function mergeAnswers(partial, today = todayIso()) {
  const a = B.defaultAnswers(today);
  const p = partial && typeof partial === 'object' ? partial : {};
  for (const [k, v] of Object.entries(p)) {
    if (!(k in a)) continue;
    if (['sport', 'activity', 'safety'].includes(k) && v && typeof v === 'object' && !Array.isArray(v)) a[k] = { ...a[k], ...v };
    else a[k] = v;
  }
  if (!('weekdays' in p)) a.weekdays = [];
  if (!('health' in p) && p.safety && typeof p.safety === 'object') a.health = B.SAFETY_KEYS.some(k => p.safety[k] === true) ? 'some' : 'none';
  return a;
}

const PROBLEM = {
  about: 'age must be 10-90 and body weight above 0',
  goal: 'goal is missing (one of: ' + B.GOALS.join(', ') + ')',
  sport: 'goal "athletic" needs sport.id (a sport from the questions list); a season other than no_season needs sport.season_date (YYYY-MM-DD)',
  activity: 'goal "active" needs activity.id (an activity from the questions list)',
  week: 'weekdays must hold exactly `days` weekdays (or leave weekdays out), and start_date must be YYYY-MM-DD',
  health: 'the health check is not answered: health "none" (none of the 5 questions apply) or "some" with safety {...} yes/no each (a coach with their own screening: role client + health_route coach_own_sop)',
  accept: 'the release is not accepted: show the person the release text, get an explicit "I accept" in this conversation, then send accepted: true (under 18: also guardian: true, accepted by a parent or legal guardian)'
};
/** what the answers still need before a plan can be built (the wizard's own step rules), as plain lines for the agent */
export function answerProblems(a) {
  const check = { ...a, weekdays: a.weekdays && a.weekdays.length ? a.weekdays : B.DEFAULT_WEEKDAYS[a.days] || [] };
  const out = [];
  for (const step of B.stepsFor(check)) {
    if (step === 'kit') continue;
    const b = B.stepBlocker(step, check);
    if (b) out.push({ step, code: b, message: PROBLEM[step] || b });
  }
  if (!B.DAYS_CHOICES.includes(a.days)) out.push({ step: 'week', code: 'days', message: 'days must be one of ' + B.DAYS_CHOICES.join(', ') });
  return out;
}

/** answers -> intake/2 (the wizard's own builder) */
export function intakeFromAnswers(a, lang) { return B.buildIntake(a, { lang }); }

// ------------------------------------------------------------------------------------------------- build

/**
 * Build one plan.
 * @param {object} o {answers?|intake?, brand?, lang?, site?, today?}
 * @returns {Promise<{status:'ok'|'invalid'|'needs_answers', brand, lang, model, plan?, intake?, problems?, errors?, link?, site}>}
 */
export async function buildPlan(o = {}) {
  const brand = await loadBrand(o.brand);
  const site = siteUrlFor(brand, o.site);
  const model = modelFor(brand, site);
  let lang = LANGS.includes(o.lang) ? o.lang : null;
  let intake, answers = null;
  if (o.intake) {
    intake = o.intake;
    lang = lang || (LANGS.includes(intake.lang) ? intake.lang : brand.lang_default);
  } else {
    lang = lang || brand.lang_default;
    answers = mergeAnswers(o.answers || {}, o.today);
    const problems = answerProblems(answers);
    const link = site ? prefillLink(site, answers, { lang }) : null;
    if (problems.length) return { status: 'needs_answers', brand, lang, model, problems, link, site, answers };
    intake = intakeFromAnswers(answers, lang);
  }
  const plan = generate(intake, model);
  const link = site && answers ? prefillLink(site, answers, { lang }) : null;
  if (plan.status !== 'ok') return { status: 'invalid', brand, lang, model, plan, intake, errors: errorWords(plan, model, lang), link, site };
  return { status: 'ok', brand, lang, model, plan, intake, link, site, answers };
}

/** an invalid plan's errors in plain words (the web tool's own lines), with the field */
export function errorWords(plan, model, lang) {
  const lines = V.errorLines(plan, model, lang);
  return (plan.errors || []).map((e, i) => ({ code: e.code, field: e.field || null, message: stripMarkers(lines[i] || e.code) }));
}

/** a short summary of a built plan (for the agent's reply) */
export function planSummary(plan, model, lang) {
  const s = V.summary(plan, model, lang);
  const m = plan.meta || {};
  const lg = V.legal(plan, model, lang);
  return {
    program: s.program, goal: s.goal, who: s.who, days_per_week: s.days, weekdays: s.weekdays, weeks: s.weeks,
    start_date: m.start_date || null, template: m.template ? m.template.id : null,
    exercises_per_session: m.session_size ? m.session_size.range : null,
    total_sets_by_week: plan.summary ? plan.summary.total_resistance_sets_by_week : null,
    health_warning: lg.health ? stripMarkers([lg.health.label, lg.health.line].filter(Boolean).join(' ')) : null,
    warnings: (m.warnings || []).map(w => (typeof w === 'string' ? w : w.code)).filter(Boolean),
    edited: !!plan.edited, valid: !!(plan.validation && plan.validation.ok),
    model_version: plan.model_version, engine_version: plan.engine_version
  };
}

// ------------------------------------------------------------------------------------------------- outputs

const brandWords = (brand, lang) => (k, a) => brandUi(brand, ui)(lang, k, a);

/**
 * The plan as Markdown: the engine's own rendering (the release line at the top and the bottom, the health warning), reviewer
 * markers hidden as on the web tool, and the brand's credit line at the end (where the web tool's print footer has it).
 * @param {{view?: 'full'|'overview'|'block'|'week'|'day', weeks?: 'all'|number[], weekday?: string}} [opts]
 */
export function planMarkdown(plan, model, lang, brand, opts = {}) {
  const view = opts.view || 'full';
  const ro = { lang };
  if (view !== 'full') ro.view = view;
  if (opts.weeks) ro.weeks = opts.weeks;
  const md = renderPlan(plan, model, ro);
  const t = brandWords(brand, lang);
  const credit = `${t('app.credit')} · ${t('print.generated')}`;
  return stripMarkers(md).replace(/\s*$/, '') + `\n\n_${credit}_\n`;
}

/** the PDF the web tool's Download PDF makes (app/pdf.js, the vendored jsPDF) as a Buffer */
export function planPdf(plan, model, lang, brand) {
  const { jsPDF } = createRequire(import.meta.url)(path.join(ROOT, 'app/vendor/jspdf.umd.min.js'));
  const b = { ...brand };
  const L = brand.pdf && brand.pdf.logo;
  if (L && L.src) {
    const file = path.join(ROOT, 'app', L.src);
    if (fs.existsSync(file)) b.logo_data = { data: 'data:image/png;base64,' + fs.readFileSync(file).toString('base64'), w: L.w, h: L.h };
  }
  const pdf = drawPdf(pdfDoc(plan, model, lang, brandWords(brand, lang), b), jsPDF);
  return Buffer.from(pdf.output('arraybuffer'));
}

/** a self-contained, print-ready HTML page of the plan (inline styles, the brand's name and colours; no script, no outside file) */
export function planHtml(plan, model, lang, brand) {
  const md = planMarkdown(plan, model, lang, brand);
  const C = (brand.pdf && brand.pdf.colors) || {};
  const rgb = (a, d) => (a ? `rgb(${a.join(',')})` : d);
  const accent = rgb(C.accent, '#d9430b'), ink = rgb(C.ink, '#141416'), brandC = rgb(C.brand, accent);
  const title = V.summary(plan, model, lang).program;
  return `<!doctype html>
<html lang="${lang}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${escapeHtml(title)} - ${escapeHtml(brand.name)}</title>
<style>
body{font:15px/1.5 system-ui,-apple-system,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;color:${ink};background:#fff;max-width:860px;margin:0 auto;padding:24px 16px}
.brand{font-weight:800;letter-spacing:.08em;color:${brandC};font-size:13px}
h1{font-size:28px;margin:.3em 0}h2{border-bottom:2px solid ${accent};padding-bottom:4px;margin-top:2em}h3{margin-top:1.5em}
blockquote{margin:1em 0;padding:8px 12px;background:#f4f4f6;border-left:4px solid ${accent}}
table{border-collapse:collapse;width:100%;font-size:13px;margin:1em 0}th,td{border:1px solid #ccc;padding:4px 6px;text-align:left}
a{color:${accent}}code{background:#f4f4f6;padding:0 3px}
@media print{body{max-width:none;padding:0}h2{break-before:page}h2:first-of-type{break-before:auto}a{color:inherit}}
</style>
</head>
<body>
<p class="brand">${escapeHtml(brand.short)}</p>
${markdown(md)}
</body>
</html>
`;
}

/** the base name of a plan's files: the web tool's PDF name without '.pdf' (+ '-edited' for an edited plan) + the language */
export function fileBase(plan, brand, lang) {
  return pdfFileName(plan, brand.pdf.file_prefix).replace(/\.pdf$/, '') + (plan.edited ? '-edited' : '') + '.' + lang;
}

/**
 * Write the plan's files where the caller asks (only the plan; nothing about the person is kept anywhere else).
 * @param {{plan, model, lang, brand}} r @param {string} outDir @param {string[]} formats subset of FORMATS
 * @returns {Record<string,string>} format -> absolute path
 */
export function writeOutputs(r, outDir, formats = ['md', 'pdf']) {
  const fm = formats.filter(f => FORMATS.includes(f));
  fs.mkdirSync(outDir, { recursive: true });
  const base = path.join(path.resolve(outDir), fileBase(r.plan, r.brand, r.lang));
  const out = {};
  for (const f of fm) {
    const file = f === 'json' ? base.replace(/\.(en|es)$/, '') + '.json' : `${base}.${f}`;
    if (f === 'md') fs.writeFileSync(file, planMarkdown(r.plan, r.model, r.lang, r.brand));
    if (f === 'json') fs.writeFileSync(file, JSON.stringify(r.plan));
    if (f === 'pdf') fs.writeFileSync(file, planPdf(r.plan, r.model, r.lang, r.brand));
    if (f === 'html') fs.writeFileSync(file, planHtml(r.plan, r.model, r.lang, r.brand));
    out[f] = file;
  }
  return out;
}

// ------------------------------------------------------------------------------------------------- edits

/** the edit operations engine/edit.mjs takes, described for an agent */
export const EDIT_OPS = {
  set_sets: '{op:"set_sets", weekday:"Mon", slot_id:"Mon.A1.s05", sets:3, weeks?:[1,2]|"all"} - the sets of one exercise on one day',
  remove_exercise: '{op:"remove_exercise", weekday, slot_id, weeks?} - take an exercise off a day',
  add_exercise: '{op:"add_exercise", weekday, exercise_id, sets, weeks?, block?, after_slot_id?} - add a library exercise (ids from search_exercises)',
  set_block: '{op:"set_block", weekday, block, on:true|false, weeks?} - switch a block of a day off or back on (core, athletic ...)'
};

/** apply edits (engine/edit.mjs); conflicts are information, the edit is still applied (CX-04) */
export function editPlan(plan, edits, model) {
  if (!plan || plan.status !== 'ok') throw new AgentError('bad_plan', 'edits need a built plan with status ok');
  if (!Array.isArray(edits) || !edits.length) throw new AgentError('bad_edits', 'edits must be a non-empty list of operations');
  for (const e of edits) if (!e || !EDIT_OPS[e.op]) throw new AgentError('bad_edits', `unknown edit op '${e && e.op}' (ops: ${Object.keys(EDIT_OPS).join(', ')})`);
  try {
    return applyPlanEdits(plan, edits, model);
  } catch (e) {
    throw new AgentError(e.code || 'edit_failed', e.message);
  }
}

/** the exercises of one week, day by day, with the slot ids and block names an edit needs */
export function planSlots(plan, model, lang, week = 1) {
  const w = (plan.weeks || []).find(x => x.n === week);
  if (!w) throw new AgentError('bad_week', `week ${week} is not in this plan (1-${(plan.weeks || []).length})`);
  const name = (id) => { if (!id) return id; let k = `exercise.${id}.name`; try { k = model.ex(id).name_key || k; } catch { /* unknown id */ } return model.has('en', k) ? model.t(lang, k) : id; };
  return w.days.map(d => ({
    weekday: d.weekday,
    blocks: (d.blocks || []).map(b => ({
      block: b.kind, on: b.on !== false,
      items: (b.items || []).filter(it => it.exercise_id).map(it => ({ slot_id: it.slot_id, exercise_id: it.exercise_id, name: name(it.exercise_id), sets: it.sets }))
    })).filter(b => b.items.length)
  }));
}

const SEARCHABLE = ['live_library_selectable', 'optional_addon', 'added_v1', 'added_v1_1'];
/** library exercises whose name (EN or ES) holds the words of `query` (for add_exercise) */
export function searchExercises(model, query, lang = 'en', limit = 20) {
  const words = String(query || '').toLowerCase().split(/\s+/).filter(Boolean);
  const out = [];
  for (const ex of model.exercises()) {
    if (!SEARCHABLE.includes(ex.status)) continue;
    const k = ex.name_key || `exercise.${ex.id}.name`;
    const en = model.has('en', k) ? model.t('en', k) : ex.id;
    const es = model.has('es', k) ? model.t('es', k) : en;
    const hay = (en + ' ' + es + ' ' + ex.id).toLowerCase();
    if (words.every(w => hay.includes(w))) out.push({ exercise_id: ex.id, name: lang === 'es' ? es : en, status: ex.status || 'regular' });
    if (out.length >= limit) break;
  }
  return out;
}
