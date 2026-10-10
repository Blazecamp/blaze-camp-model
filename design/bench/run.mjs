#!/usr/bin/env node
// design/bench/run.mjs - the benchmark runner (PLANNER_SPEC.md 13; diagnosis DR-19).
//
// Generates a plan IN MEMORY for every intake of the corpora through engine/generate.mjs, scores it with design/bench/score.mjs
// and writes two files, both inside design/bench/ (nothing else is written anywhere; the engine, the model and the samples are
// only read):
//     results_<label>.json   every plan's score sheet, the corpus roll-up, the run's identity     (default label: baseline)
//     <LABEL>.md             the summary table
//
// Corpora (PLANNER_SPEC 13.1):  C2 = design/bench/intakes/*.json   C1 = samples/intakes/*.json   C3 = C1 at the 7 legal session
// lengths and at days + 1 (the sweep, A15).
//
// What the runner adds to the scorer, because it needs more than one plan:
//   determinism (A22)   every intake is generated twice in this process and once more in a fresh process; the bytes must be equal
//   offers (A16)        every offered schedule that is a valid intake is generated; what the offer states must be what comes out
//   sweep (A15)         more minutes or one more day must never make the keep vector lexicographically worse
//   timing (A23)        milliseconds per generate() call
//   regression (A24)    --compare results_x.json: no plan's score may drop
//
// Usage:
//   node design/bench/run.mjs                         the baseline: C1 + C2, offers, sweep, fresh-process determinism
//   node design/bench/run.mjs --label slice2 --compare design/bench/results_baseline.json
//   node design/bench/run.mjs --filter 62             only the intakes whose file name contains "62" (writes results_partial.json)
//   node design/bench/run.mjs --no-offers --no-sweep --no-fresh --no-samples     the quick run
//   node design/bench/run.mjs --check-intakes         validate the bench intakes against the live validateIntake, write nothing
//   node design/bench/run.mjs --plan some-plan.json   score one plan JSON file and print its sheet, write nothing
//   node design/bench/run.mjs --trace 62 9 Mon        generate the first intake whose file name contains "62" and print where the
//                                                     minutes of week 9, Monday go (the re-cost of A12, item by item), write nothing
// Plain Node 22, no dependencies.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { makeContext, scorePlan, explainDay, aggregate, coverage, compareRuns, METRICS, NOT_MEASURED, ACCEPTANCE, SCORER_VERSION } from './score.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '..', '..');
const DESIGN = path.resolve(HERE, '..');
const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

// ------------------------------------------------------------------------------------------------------------- arguments
const argv = process.argv.slice(2);
const flag = (name) => argv.includes('--' + name);
const opt = (name, def = null) => { const i = argv.indexOf('--' + name); return i >= 0 && i + 1 < argv.length ? argv[i + 1] : def; };
const ARGS = {
  filter: opt('filter'),
  label: opt('label') || (opt('filter') ? 'partial' : 'baseline'),
  offers: !flag('no-offers'), sweep: !flag('no-sweep'), fresh: !flag('no-fresh'), samples: !flag('no-samples'),
  compare: opt('compare'), keep: Number(opt('violations', '8')),
  checkIntakes: flag('check-intakes'), plan: opt('plan'), hashWorker: flag('hash-worker'), quiet: flag('quiet'),
  trace: argv.includes('--trace') ? argv.slice(argv.indexOf('--trace') + 1, argv.indexOf('--trace') + 4) : null
};
const log = (...a) => { if (!ARGS.quiet && !ARGS.hashWorker) console.error(...a); };

// ------------------------------------------------------------------------------------------------------------- reading
const readJSON = (p) => JSON.parse(fs.readFileSync(p, 'utf8'));
const sha = (s) => crypto.createHash('sha256').update(s).digest('hex');
const r2 = (x) => Math.round(x * 100) / 100;

/** the model parts, parsed fresh each call (engine/model.mjs deep-freezes what it is given) */
function readModelRaw() {
  const dir = path.join(ROOT, 'model');
  const manifest = readJSON(path.join(dir, 'manifest.json'));
  const f = manifest.files;
  const rd = (rel) => readJSON(path.join(dir, rel));
  return { manifest, catalog: rd(f.catalog), rules: rd(f.rules), templates: rd(f.templates), profiles: rd(f.profiles),
    i18n: { en: rd(f.i18n.en), es: rd(f.i18n.es), es_review: f.i18n.es_review && fs.existsSync(path.join(dir, f.i18n.es_review)) ? rd(f.i18n.es_review) : { missing_keys: [], machine_translated: [] } } };
}

/** identity of the engine and model files that this process loaded: one hash over every file, and the newest mtime */
function fingerprint() {
  const files = [];
  for (const d of ['engine', 'model', path.join('model', 'i18n')]) {
    const abs = path.join(ROOT, d);
    if (!fs.existsSync(abs)) continue;
    for (const f of fs.readdirSync(abs).sort()) if (/\.(mjs|json)$/.test(f) || f === 'MODEL_VERSION') files.push(path.join(d, f));
  }
  const h = crypto.createHash('sha256');
  let newest = 0;
  const per = {};
  for (const rel of files) {
    const buf = fs.readFileSync(path.join(ROOT, rel));
    const one = sha(buf);
    h.update(rel + ':' + one + '\n');
    per[rel] = one.slice(0, 12);
    newest = Math.max(newest, fs.statSync(path.join(ROOT, rel)).mtimeMs);
  }
  return { sha256: h.digest('hex'), files: files.length, newest_mtime: new Date(newest).toISOString(), per_file: per };
}

function gitInfo() {
  const run = (args) => { try { const r = spawnSync('git', args, { cwd: ROOT, encoding: 'utf8' }); return r.status === 0 ? r.stdout.trim() : null; } catch { return null; } };
  let head = run(['rev-parse', 'HEAD']);
  if (!head) { try { const h = fs.readFileSync(path.join(ROOT, '.git', 'HEAD'), 'utf8').trim(); head = h.startsWith('ref:') ? fs.readFileSync(path.join(ROOT, '.git', h.slice(5).trim()), 'utf8').trim() : h; } catch { head = null; } }
  let status = null;
  try { const r = spawnSync('git', ['status', '--porcelain', '--', 'engine', 'model'], { cwd: ROOT, encoding: 'utf8' }); if (r.status === 0) status = r.stdout; } catch { status = null; }
  const dirty = status === null ? null : status.split('\n').filter(l => l.length > 3).map(l => l.slice(3));   // "XY path": the two status letters may be blanks
  return { head, branch: run(['rev-parse', '--abbrev-ref', 'HEAD']), head_date: run(['log', '-1', '--format=%cI']), uncommitted_engine_model_files: dirty === null ? null : dirty.length, uncommitted_list: dirty ? dirty.slice(0, 40) : null };
}

function listIntakes() {
  const out = [];
  const add = (corpus, dir) => {
    if (!fs.existsSync(dir)) return;
    for (const f of fs.readdirSync(dir).filter(x => x.endsWith('.json')).sort()) {
      if (ARGS.filter && !f.includes(ARGS.filter)) continue;
      out.push({ corpus, file: f, path: path.join(dir, f), intake: readJSON(path.join(dir, f)) });
    }
  };
  add('C2', path.join(HERE, 'intakes'));
  if (ARGS.samples) add('C1', path.join(ROOT, 'samples', 'intakes'));
  return out;
}

async function loadEngine() {
  const gen = await import(pathToFileURL(path.join(ROOT, 'engine', 'generate.mjs')).href);
  const mod = await import(pathToFileURL(path.join(ROOT, 'engine', 'model.mjs')).href);
  const intake = await import(pathToFileURL(path.join(ROOT, 'engine', 'intake.mjs')).href);
  const model = mod.loadModel(readModelRaw());
  return { generate: (it) => gen.generate(it, model), validateIntake: (it) => intake.validateIntake(it, model), model, ENGINE_VERSION: gen.ENGINE_VERSION };
}

const clone = (o) => JSON.parse(JSON.stringify(o));

// ------------------------------------------------------------------------------------------------------------- one plan
function generateTimed(E, intake) {
  const t0 = performance.now();
  let plan = null, error = null;
  try { plan = E.generate(clone(intake)); } catch (e) { error = String((e && e.stack) || e).split('\n').slice(0, 3).join(' | '); }
  return { plan, error, ms: r2(performance.now() - t0) };
}

/** FULL state per group of the keep order: trained directly and not listed below the floor */
function keepVector(plan, order) {
  const tc = plan.time_check || {};
  const below = new Set((tc.trained_below_floor || []).map(x => (typeof x === 'string' ? x : x.group)));
  const trained = new Set(tc.trained_groups || []);
  return order.map(g => (trained.has(g) && !below.has(g) ? 1 : 0));
}
const lexWorse = (a, b) => { for (let i = 0; i < a.length; i++) { if (b[i] !== a[i]) return b[i] < a[i]; } return false; };   // b is worse than a

/** A16: generate every offered schedule that is a valid intake; what the offer states must be what comes out */
function checkOffers(E, ctx, intake, plan, sheet) {
  const res = { checked: 0, mismatches: [], skipped: [] };
  const R = ctx.R;
  const allowed = R.session.minutes_allowed;
  const competitive = !!(plan.meta && plan.meta.profile && plan.meta.profile.competitive === 'competitive');
  const baseDays = intake.schedule.days_per_week, baseMin = plan.meta.session_minutes;
  const baseBlock = (sheet.facts.policy || [])[0] || null;
  for (const o of plan.offers || []) {
    if (o.chosen) continue;
    const a = o.args || {};
    const isSchedule = o.schedule || /more_days|longer_sessions/.test(String(o.key));
    if (!isSchedule) continue;
    const minutes = o.schedule ? o.schedule.minutes : (a.min ?? a.minutes ?? baseMin);
    const days = o.schedule ? o.schedule.days : (a.days ?? baseDays);
    if (!allowed.includes(minutes) || (minutes > 90 && R.session.minutes_over_90_competitive_only && !competitive) || days < 2 || days > 6) { res.skipped.push({ offer: o.key, why: 'not a valid intake (counted by offer_invalid)' }); continue; }
    if (minutes === baseMin && days === baseDays) { res.skipped.push({ offer: o.key, why: 'the same schedule' }); continue; }
    const it = clone(intake);
    it.schedule.session_minutes = minutes;
    if (days !== baseDays) { it.schedule.days_per_week = days; it.schedule.weekdays = null; }
    const g = generateTimed(E, it);
    res.checked++;
    const tell = (msg, more) => res.mismatches.push({ offer: o.key, schedule: { days, minutes }, msg: o.key + ' (' + days + ' x ' + minutes + '): ' + msg, ...(more || {}) });
    if (g.error || !g.plan || g.plan.status !== 'ok') { tell('the offered schedule does not generate a plan (' + (g.error || (g.plan && g.plan.status)) + ')'); continue; }
    const tc2 = g.plan.time_check || {};
    const trained2 = new Set(tc2.trained_groups || []);
    const below2 = new Set((tc2.trained_below_floor || []).map(x => (typeof x === 'string' ? x : x.group)));
    const outTime2 = (tc2.not_trained_directly || []).filter(x => x && x.reason === 'time').map(x => x.group);
    if (o.schedule && (Array.isArray(o.adds) || Array.isArray(o.trades))) {
      const before = new Set((plan.time_check || {}).trained_groups || []);
      const adds = [...trained2].filter(x => !before.has(x)).sort(), trades = [...before].filter(x => !trained2.has(x)).sort();
      const same = (x, y) => JSON.stringify([...(x || [])].sort()) === JSON.stringify(y);
      if (!same(o.adds, adds) || !same(o.trades, trades)) tell('states adds [' + (o.adds || []).join(', ') + '] trades [' + (o.trades || []).join(', ') + '], the re-run adds [' + adds.join(', ') + '] trades [' + trades.join(', ') + ']');
      continue;
    }
    const key = String(o.key);
    const groups = [].concat(a.group || []);
    if (/longer_sessions_some/.test(key)) {
      const miss = groups.filter(x => !trained2.has(x) || below2.has(x));
      if (miss.length) tell('says it also trains ' + groups.join(', ') + ' directly; the re-run does not train ' + miss.join(', ') + ' at the floor', { missing: miss });
    } else if (/longer_sessions_peak/.test(key)) {
      const s2 = scorePlan(g.plan, ctx, {});
      const b2 = (s2.facts.policy || [])[0];
      const low = groups.filter(x => { const p0 = baseBlock && baseBlock.groups[x], p1 = b2 && b2.groups[x]; return !(p0 && p1 && p1.main[p1.main.length - 1] >= p0.main[p0.main.length - 1] + 2 - 1e-9); });
      if (low.length) tell('says a higher peak (2+ more sets) for ' + groups.join(', ') + '; not for ' + low.join(', '), { missing: low });
    } else if (/longer_sessions$/.test(key) || /more_days_min/.test(key)) {
      if (tc2.fits !== true && (outTime2.length || below2.size)) tell('says the full plan fits; the re-run leaves ' + [...outTime2, ...[...below2].map(x => x + ' (below the floor)')].join(', ') + ' out', { missing: outTime2 });
    } else if (/more_days/.test(key)) {
      const order = sheet.facts.keep_order;
      const v0 = keepVector(plan, order), v1 = keepVector(g.plan, order);
      if (lexWorse(v0, v1)) tell('one more day trains a worse set of groups at the floor: ' + (order.filter((x, i) => v1[i]).join(', ') || 'none') + ' against ' + (order.filter((x, i) => v0[i]).join(', ') || 'none') + ' (keep order ' + order.join(' > ') + ')');
    }
  }
  return res;
}

/**
 * A15 on one intake (the sweep of diagnosis 1.8): the keep vector at the 7 legal session lengths, on the intake's days and on
 * days + 1. A minute step compares two neighbouring lengths on the same days; a day step compares days and days + 1 at one
 * length. A length above 90 min is an intake warning for a non-competitive client (the plan is the 90-min plan), so those
 * steps compare equal plans and can only pass.
 */
function sweepIntake(E, ctx, entry, base) {
  const R = ctx.R;
  const order = base.sheet.facts.keep_order;
  const lengths = R.session.minutes_allowed.slice();
  const days0 = entry.intake.schedule.days_per_week;
  const row = { file: entry.file, keep_order: order, days: [days0, ...(days0 < 6 ? [days0 + 1] : [])], grid: {}, worse_with_minutes: [], worse_with_days: [], plans: 0 };
  const run = (days, minutes) => {
    const it = clone(entry.intake);
    it.schedule.session_minutes = minutes;
    if (days !== days0) { it.schedule.days_per_week = days; it.schedule.weekdays = null; }
    const g = generateTimed(E, it);
    row.plans++;
    if (g.error || !g.plan || g.plan.status !== 'ok') return { days, minutes, error: g.error || (g.plan && g.plan.status) || 'no plan' };
    const tc = g.plan.time_check || {};
    if (!Array.isArray(tc.trained_groups)) return { days, minutes, flat: true, vector: null, trained: [], note: 'no stairway block (' + ((g.plan.shape.training_blocks[0] || {}).type || '?') + ')' };
    const v = keepVector(g.plan, order);
    return { days, minutes, vector: v.join(''), trained: order.filter((x, i) => v[i]), below_floor: (tc.trained_below_floor || []).map(x => (typeof x === 'string' ? x : x.group)) };
  };
  for (const d of row.days) row.grid[d] = lengths.map(mm => run(d, mm));
  const vec = (c) => c.vector.split('').map(Number);
  for (const d of row.days) for (let i = 1; i < lengths.length; i++) {
    const a = row.grid[d][i - 1], b = row.grid[d][i];
    if (a.error || b.error || !a.vector || !b.vector) continue;
    row.minute_steps = (row.minute_steps || 0) + 1;
    if (lexWorse(vec(a), vec(b))) row.worse_with_minutes.push({ days: d, from: a.minutes, to: b.minutes, before: a.trained, after: b.trained });
  }
  if (row.days.length === 2) for (let i = 0; i < lengths.length; i++) {
    const a = row.grid[row.days[0]][i], b = row.grid[row.days[1]][i];
    if (a.error || b.error || !a.vector || !b.vector) continue;
    row.day_steps = (row.day_steps || 0) + 1;
    if (lexWorse(vec(a), vec(b))) row.worse_with_days.push({ minutes: a.minutes, from: a.days, to: b.days, before: a.trained, after: b.trained });
  }
  return row;
}

// ------------------------------------------------------------------------------------------------------------- modes
async function hashWorker() {
  // a fresh process: generate every intake once and print the hashes (used by the parent for A22)
  const E = await loadEngine();
  const out = { fingerprint: fingerprint().sha256, hashes: {} };
  for (const e of listIntakes()) { const g = generateTimed(E, e.intake); out.hashes[e.corpus + '/' + e.file] = g.plan ? sha(JSON.stringify(g.plan)) : 'error'; }
  process.stdout.write(JSON.stringify(out));
}

async function checkIntakes() {
  const E = await loadEngine();
  let bad = 0;
  for (const e of listIntakes().filter(x => x.corpus === 'C2')) {
    const v = E.validateIntake(clone(e.intake));
    if (!v.ok) { bad++; console.log('INVALID ' + e.file + ' ' + JSON.stringify(v.errors)); }
    else if ((v.warnings || []).length) console.log('ok      ' + e.file + '  warnings: ' + v.warnings.map(w => w.code).join(', '));
  }
  console.log(bad ? bad + ' invalid intake(s)' : 'every bench intake is a valid intake/2');
  process.exit(bad ? 1 : 0);
}

function scoreOnePlanFile(file) {
  const raw = readModelRaw();
  const ctx = makeContext({ rules: raw.rules, catalog: raw.catalog, templates: raw.templates });
  const s = scorePlan(readJSON(path.resolve(file)), ctx, {});
  if (!s.scored) { console.log(JSON.stringify(s, null, 1)); return; }
  console.log('score ' + s.score + '   hard violations ' + s.hard_violations + '   points lost by tier ' + JSON.stringify(s.points_lost_by_tier));
  for (const [k, a] of Object.entries(s.acceptance)) console.log('  ' + k.padEnd(4) + (a.pass === null ? ' n/a ' : a.pass ? ' pass' : ' FAIL') + '  ' + String(a.value).padStart(6) + '  ' + a.name);
  for (const [k, mm] of Object.entries(s.metrics)) {
    if (!(mm.violations || []).length) continue;
    console.log('\n' + k + '  (' + mm.rule + ', ' + mm.kind + ')  value ' + mm.value + ' of ' + mm.checked + ' checked, ' + mm.lost + ' points');
    for (const v of mm.violations.slice(0, 6)) console.log('    ' + JSON.stringify(v));
  }
}

async function traceDay([needle, week, weekday]) {
  const E = await loadEngine();
  const raw = readModelRaw();
  const ctx = makeContext({ rules: raw.rules, catalog: raw.catalog, templates: raw.templates });
  const dirs = [path.join(HERE, 'intakes'), path.join(ROOT, 'samples', 'intakes')];
  const file = dirs.flatMap(d => (fs.existsSync(d) ? fs.readdirSync(d).filter(f => f.endsWith('.json')).sort().map(f => path.join(d, f)) : [])).find(f => path.basename(f).includes(String(needle)));
  if (!file || !week || !weekday) { console.log('usage: --trace <part of an intake file name> <week> <Mon|Tue|...>'); process.exit(1); }
  const plan = E.generate(readJSON(file));
  const x = explainDay(plan, ctx, Number(week), weekday);
  if (!x) { console.log(path.basename(file) + ': no ' + weekday + ' in week ' + week); process.exit(1); }
  console.log(path.basename(file) + ', week ' + week + ', ' + weekday + ': printed ' + x.est_minutes + ' min of ' + x.minutes_limit + ', re-cost ' + x.recost + ' min (' + x.exact + ')');
  console.log('parts: ' + Object.entries(x.parts).filter(([, v]) => v).map(([k, v]) => k + ' ' + v).join(', '));
  for (const l of x.lines) console.log('  ' + String(l.minutes).padStart(6) + '  ' + String(l.slot_id).padEnd(36) + ' ' + l.what);
}

// ------------------------------------------------------------------------------------------------------------- the run
async function main() {
  if (ARGS.hashWorker) return hashWorker();
  if (ARGS.checkIntakes) return checkIntakes();
  if (ARGS.plan) return scoreOnePlanFile(ARGS.plan);
  if (ARGS.trace) return traceDay(ARGS.trace);

  const startedAt = new Date();
  const fp0 = fingerprint();
  const git = gitInfo();
  const E = await loadEngine();
  const raw = readModelRaw();
  const ctx = makeContext({ rules: raw.rules, catalog: raw.catalog, templates: raw.templates });
  const entries = listIntakes();
  log('bench: ' + entries.length + ' intakes, engine ' + E.ENGINE_VERSION + ', model ' + raw.manifest.model_version + ', git ' + (git.head || '?').slice(0, 7) + ' (+' + git.uncommitted_engine_model_files + ' uncommitted engine / model files)');

  // 1. generate twice, hash
  const runs = [];
  for (const e of entries) {
    const a = generateTimed(E, e.intake);
    const b = generateTimed(E, e.intake);
    const ja = a.plan ? JSON.stringify(a.plan) : null, jb = b.plan ? JSON.stringify(b.plan) : null;
    runs.push({ e, plan: a.plan, error: a.error, ms: [a.ms, b.ms], hash: ja ? sha(ja) : null, same_in_process: ja !== null && ja === jb, bytes: ja ? ja.length : 0 });
  }
  // 2. a fresh process for the same hashes
  let fresh = null;
  if (ARGS.fresh) {
    const args = [fileURLToPath(import.meta.url), '--hash-worker'];
    if (ARGS.filter) args.push('--filter', ARGS.filter);
    if (!ARGS.samples) args.push('--no-samples');
    const r = spawnSync(process.execPath, args, { cwd: ROOT, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
    try { fresh = JSON.parse(r.stdout); } catch { fresh = { error: (r.stderr || 'no output').slice(0, 300) }; }
  }
  const freshComparable = !!(fresh && fresh.hashes && fresh.fingerprint === fp0.sha256);

  // 3. score, offers
  const plans = [];
  for (const run of runs) {
    const { e } = run;
    const key = e.corpus + '/' + e.file;
    const tags = (e.intake._bench && e.intake._bench.tags) || [];
    const head = { corpus: e.corpus, file: e.file, id: e.intake.id || e.file, tags, edge: tags.includes('edge'), comment: e.intake._comment || null,
      intake: { goal: e.intake.goal, format: e.intake.format, days: e.intake.schedule.days_per_week, minutes: e.intake.schedule.session_minutes, age: e.intake.age, equipment: e.intake.equipment.profile,
        mode: e.intake.plan.mode, focus: e.intake.focus_muscles || e.intake.priority_muscles || [], pain: (e.intake.pain || []).map(p => p.area), sport: (e.intake.sport && e.intake.sport.sport) || null, activity: (e.intake.activity && e.intake.activity.ids) || null },
      ms: { first: run.ms[0], second: run.ms[1] }, hash: run.hash, bytes: run.bytes };
    if (run.error || !run.plan) { plans.push({ ...head, scored: false, error: run.error }); continue; }
    const freshSame = freshComparable ? fresh.hashes[key] === run.hash : null;
    const det = run.same_in_process && freshSame !== false;
    let sheet = scorePlan(run.plan, ctx, { intake: e.intake, determinism: det });
    let offers = null;
    if (sheet.scored && ARGS.offers) {
      offers = checkOffers(E, ctx, e.intake, run.plan, sheet);
      sheet = scorePlan(run.plan, ctx, { intake: e.intake, determinism: det, offers });
    }
    plans.push({ ...head, scored: sheet.scored, status: sheet.status, error: sheet.error || null,
      determinism: { same_in_process: run.same_in_process, same_in_fresh_process: freshSame },
      offers_rerun: offers ? { checked: offers.checked, mismatches: offers.mismatches.length, skipped: offers.skipped.length } : null,
      engine_validation: run.plan.validation ? { ok: run.plan.validation.ok, failed: (run.plan.validation.checks || []).filter(c => !c.pass).map(c => c.id + (c.severity === 'warn' ? ' (warn)' : '')) } : null,
      sheet, plan: run.plan });
  }

  // 4. the sweep on C1 (A15)
  let sweep = null;
  if (ARGS.sweep) {
    const rows = [];
    for (const p of plans) if (p.corpus === 'C1' && p.scored) rows.push(sweepIntake(E, ctx, entries.find(x => x.corpus === 'C1' && x.file === p.file), p));
    const stepsM = rows.reduce((n, r) => n + (r.minute_steps || 0), 0), stepsD = rows.reduce((n, r) => n + (r.day_steps || 0), 0);
    sweep = { corpus: 'C3 (C1 at the 7 legal session lengths, on its days and on days + 1)', intakes: rows.length, plans: rows.reduce((n, r) => n + r.plans, 0), minute_steps: stepsM, day_steps: stepsD,
      keep_worse_with_minutes: rows.reduce((n, r) => n + r.worse_with_minutes.length, 0), keep_worse_with_days: rows.reduce((n, r) => n + r.worse_with_days.length, 0), rows };
  }

  const fp1 = fingerprint();
  const finishedAt = new Date();

  // 5. roll-up
  const corpora = {};
  for (const c of ['C2', 'C1']) {
    const ps = plans.filter(p => p.corpus === c);
    if (!ps.length) continue;
    const agg = aggregate(ps.map(p => (p.scored ? p.sheet : { id: p.id, scored: false, status: p.status || 'error', error: p.error })));
    const ms = ps.map(p => Math.min(p.ms.first, p.ms.second)).sort((x, y) => x - y), ms1 = ps.map(p => p.ms.first).sort((x, y) => x - y);
    const q = (arr, pp) => (arr.length ? arr[Math.min(arr.length - 1, Math.max(0, Math.ceil(pp * arr.length) - 1))] : null);
    agg.timing_ms = { p50: q(ms, 0.5), p90: q(ms, 0.9), p99: q(ms, 0.99), max: q(ms, 1), first_call_p50: q(ms1, 0.5), first_call_max: q(ms1, 1), target: 'p50 <= 60, p99 <= 250 (PLANNER_SPEC 10.1)', pass: q(ms, 0.99) <= 250 };
    agg.determinism = { in_process_identical: ps.filter(p => p.determinism && p.determinism.same_in_process).length, fresh_process_identical: freshComparable ? ps.filter(p => p.determinism && p.determinism.same_in_fresh_process).length : null, plans: ps.length };
    agg.offers_rerun = ARGS.offers ? { schedules_generated: ps.reduce((n, p) => n + ((p.offers_rerun && p.offers_rerun.checked) || 0), 0), mismatches: ps.reduce((n, p) => n + ((p.offers_rerun && p.offers_rerun.mismatches) || 0), 0) } : null;
    agg.engine_validation_ok = ps.filter(p => p.engine_validation && p.engine_validation.ok).length;
    corpora[c] = agg;
  }
  const inv = fs.existsSync(path.join(DESIGN, 'rules_as_constraints.json')) ? readJSON(path.join(DESIGN, 'rules_as_constraints.json')) : null;
  const cov = inv ? coverage(inv.metrics_index) : null;

  const trim = (sheet) => {
    const out = { ...sheet, metrics: {} };
    delete out.violations;
    for (const [k, mm] of Object.entries(sheet.metrics)) {
      const v = mm.violations || [];
      out.metrics[k] = { value: mm.value, checked: mm.checked, pass: mm.pass, lost: mm.lost, ...(mm.detail ? { detail: mm.detail } : {}), ...(v.length ? { violations_total: v.length + (mm.violations_truncated || 0), violations: v.slice(0, ARGS.keep) } : {}) };
    }
    return out;
  };
  const results = {
    schema: 'bench-results/1', label: ARGS.label,
    run: { started_at: startedAt.toISOString(), finished_at: finishedAt.toISOString(), seconds: r2((finishedAt - startedAt) / 1000), args: argv, node: process.version, platform: process.platform + ' ' + process.arch },
    engine: { engine_version: E.ENGINE_VERSION, model_version: raw.manifest.model_version, contracts_version: raw.manifest.contracts_version || null, git,
      fingerprint: { sha256: fp0.sha256, files: fp0.files, newest_file_mtime: fp0.newest_mtime, changed_during_run: fp0.sha256 !== fp1.sha256, per_file: fp0.per_file },
      note: git.uncommitted_engine_model_files ? 'engine/ and model/ hold uncommitted changes (another workflow was editing them): the fingerprint, not the git hash, identifies what was measured' : null },
    scorer: { version: SCORER_VERSION, metrics: METRICS.length, registry: METRICS, inventory_coverage: cov, not_measured: NOT_MEASURED,
      parameters: Object.fromEntries(Object.entries(ctx.param_sources).map(([k, s]) => [k, { source: s, value: summarize(ctx.P[k]) }])) },
    fresh_process: fresh ? { comparable: freshComparable, error: fresh.error || null, note: freshComparable ? null : (fresh.error ? 'the fresh process failed' : 'the engine or model files changed between the two processes: byte equality across processes was not judged') } : null,
    corpora, sweep,
    plans: plans.map(p => { const { sheet, plan, ...rest } = p; return { ...rest, ...(sheet ? { result: trim(sheet) } : {}) }; })
  };
  if (ARGS.compare) {
    const prev = readJSON(path.resolve(ARGS.compare));
    const pick = (res) => res.plans.filter(p => p.scored && p.result).map(p => ({ id: p.corpus + '/' + p.file, score: p.result.score }));
    results.comparison = { against: path.relative(ROOT, path.resolve(ARGS.compare)), against_label: prev.label, against_engine: prev.engine && prev.engine.fingerprint && prev.engine.fingerprint.sha256, ...compareRuns(pick(prev), pick(results)) };
  }

  // 6. write (inside design/bench only)
  const outJson = path.join(HERE, 'results_' + ARGS.label + '.json');
  const outMd = path.join(HERE, ARGS.label.toUpperCase() + '.md');
  for (const p of [outJson, outMd]) if (!path.resolve(p).startsWith(DESIGN + path.sep)) throw new Error('refusing to write outside design/: ' + p);
  fs.writeFileSync(outJson, compactJSON(results) + '\n');
  fs.writeFileSync(outMd, renderMarkdown(results));
  log('wrote ' + path.relative(ROOT, outJson) + ' (' + Math.round(fs.statSync(outJson).size / 1024) + ' KB) and ' + path.relative(ROOT, outMd));
  const c2 = corpora.C2 || corpora.C1;
  log('score mean ' + c2.score.mean + ', median ' + c2.score.median + ', min ' + c2.score.min + '; hard violations ' + c2.hard_violations + '; plans passing every acceptance row ' + c2.plans_passing_acceptance + ' of ' + c2.scored);
  if (results.comparison && !results.comparison.pass) { log('A24 FAILS: ' + results.comparison.lowered.length + ' plan(s) score lower than in ' + results.comparison.against); process.exitCode = 2; }
}

/** JSON with one-space indentation where flat arrays and small flat objects stay on one line (readable diffs, a third of the size) */
function compactJSON(value) {
  const flat = (v) => v === null || typeof v !== 'object' || (Array.isArray(v) ? v.every(x => x === null || typeof x !== 'object') : Object.values(v).every(x => x === null || typeof x !== 'object' || (Array.isArray(x) && x.every(y => y === null || typeof y !== 'object'))));
  const go = (v, ind) => {
    if (v === null || typeof v !== 'object') return JSON.stringify(v);
    if (flat(v)) { const one = JSON.stringify(v); if (one.length <= 400 || Array.isArray(v)) return one; }
    const pad = ' '.repeat(ind + 1);
    if (Array.isArray(v)) return v.length ? '[\n' + v.map(x => pad + go(x, ind + 1)).join(',\n') + '\n' + ' '.repeat(ind) + ']' : '[]';
    const ks = Object.keys(v).filter(k => v[k] !== undefined);
    return ks.length ? '{\n' + ks.map(k => pad + JSON.stringify(k) + ': ' + go(v[k], ind + 1)).join(',\n') + '\n' + ' '.repeat(ind) + '}' : '{}';
  };
  return go(value, 0);
}

function summarize(v) {
  if (v === null || typeof v !== 'object') return v;
  const s = JSON.stringify(v);
  return s.length <= 160 ? v : s.slice(0, 157) + '...';
}

// ------------------------------------------------------------------------------------------------------------- markdown
function renderMarkdown(R) {
  const L = [];
  const p = (...a) => L.push(...a);
  const C2 = R.corpora.C2, C1 = R.corpora.C1;
  const main = C2 || C1;
  const fmt = (x) => (x === null || x === undefined ? '-' : String(x));
  const table = (head, rows) => { p('| ' + head.join(' | ') + ' |', '|' + head.map(() => '---').join('|') + '|'); for (const r of rows) p('| ' + r.map(fmt).join(' | ') + ' |'); p(''); };
  const band = (s) => (s === null || s === undefined ? '-' : s >= 90 ? 'A' : s >= 80 ? 'B' : s >= 70 ? 'C' : s >= 60 ? 'D' : 'F');
  const mt = (agg, id) => (agg && agg.metrics[id] ? agg.metrics[id] : null);
  const tot = (agg, id) => { const x = mt(agg, id); return x ? x.total : '-'; };
  const pf = (agg, id) => { const x = mt(agg, id); return x ? x.plans_failing : '-'; };
  const scoredPlans = (c) => R.plans.filter(x => x.corpus === c && x.scored && x.result);
  const fact = (pl, f) => f(pl.result.facts);

  p('# ' + (R.label === 'baseline' ? 'Baseline' : 'Benchmark run "' + R.label + '"') + ': engine ' + R.engine.engine_version + ' on the benchmark corpus', '');
  p('Written by `design/bench/run.mjs`; the numbers are in `design/bench/results_' + R.label + '.json`. Do not edit by hand: re-run.', '');
  p('| | |', '|---|---|');
  p('| Run | ' + R.run.started_at + ' to ' + R.run.finished_at + ' (' + R.run.seconds + ' s), Node ' + R.run.node + ', ' + R.run.platform + ' |');
  p('| Engine | ' + R.engine.engine_version + ', model ' + R.engine.model_version + ' |');
  p('| Git | HEAD `' + fmt(R.engine.git.head) + '` (' + fmt(R.engine.git.head_date) + '), branch ' + fmt(R.engine.git.branch) + ', **' + fmt(R.engine.git.uncommitted_engine_model_files) + ' uncommitted files** under engine/ and model/ |');
  p('| Files measured | sha256 `' + R.engine.fingerprint.sha256.slice(0, 16) + '...` over ' + R.engine.fingerprint.files + ' engine / model files; newest file ' + R.engine.fingerprint.newest_file_mtime + '; changed during the run: **' + (R.engine.fingerprint.changed_during_run ? 'YES' : 'no') + '** |');
  p('| Scorer | ' + R.scorer.version + ': ' + R.scorer.metrics + ' metrics' + (R.scorer.inventory_coverage ? '; ' + R.scorer.inventory_coverage.implemented.length + ' of the inventory\'s ' + (R.scorer.inventory_coverage.implemented.length + R.scorer.inventory_coverage.not_measured.length + R.scorer.inventory_coverage.missing.length) + ' measured, ' + R.scorer.inventory_coverage.not_measured.length + ' listed as not measurable on one plan' : '') + ' |');
  p('');
  if (R.engine.note) p('> ' + R.engine.note + '. The per-file hashes are in the results file (`engine.fingerprint.per_file`).', '');
  p('How to read the score: 100 minus the points lost. A metric loses `points x sqrt(violations / checked)`, so a rule broken in 1 of 36 group-weeks already costs a sixth of its points and a rule broken everywhere costs all of them. The points per metric are in `score.mjs > METRICS`. One metric is an objective and not a violation: `groups_out_for_time` costs up to 8 points for the groups a plan leaves out for time (their share, a big mover counting double), so a plan that trains nobody does not score well for having no floor to miss. The band (A >= 90, B >= 80, C >= 70, D >= 60, F below) is the scorer\'s, not a coach grade. `hard violations` (A1) and the acceptance rows are exact counts and do not depend on the points.', '');

  // ---- 1 headline
  p('## 1. Headline', '');
  table(['Corpus', 'Plans', 'Scored', 'Mean score', 'Median', '10th pct', 'Min', 'Max', 'Hard violations (A1)', 'Plans with 0 hard violations', 'Plans passing every acceptance row', 'Engine\'s own validation ok'],
    Object.entries(R.corpora).map(([c, a]) => [c === 'C2' ? 'C2 bench (design/bench/intakes)' : 'C1 samples (samples/intakes)', a.plans, a.scored, a.score.mean, a.score.median, a.score.p10, a.score.min, a.score.max, a.hard_violations, a.plans_without_hard_violations, a.plans_passing_acceptance, a.engine_validation_ok + ' of ' + a.plans]));
  const bands = (c) => { const m = { A: 0, B: 0, C: 0, D: 0, F: 0 }; for (const x of scoredPlans(c)) m[band(x.result.score)]++; return m; };
  if (C2) { const b = bands('C2'); p('Bands on C2: ' + Object.entries(b).map(([k, v]) => k + ' ' + v).join(', ') + '.', ''); }
  const notScored = R.plans.filter(x => !x.scored);
  if (notScored.length) { p('Not scored: ' + notScored.map(x => x.file + ' (' + (x.error || x.status) + ')').join('; '), ''); }

  // ---- the corpus
  const c2 = R.plans.filter(x => x.corpus === 'C2');
  if (c2.length) {
    const tally = (f) => { const mm = new Map(); for (const x of c2) for (const k of [].concat(f(x))) if (k !== null && k !== undefined && k !== '') mm.set(String(k), (mm.get(String(k)) || 0) + 1); return mm; };
    const show = (mm, order) => (order ? order.filter(k => mm.has(String(k))).map(String) : [...mm.keys()].sort()).map(k => k + ' (' + mm.get(k) + ')').join(', ');
    const ageBand = (a) => (a < 18 ? 'under 18' : a < 30 ? '18-29' : a < 50 ? '30-49' : a < 60 ? '50-59' : a < 70 ? '60-69' : '70+');
    const lvl = (x) => (x.result ? x.result.facts.level : null), fam = (x) => (x.result ? x.result.facts.family : null);
    p('### The C2 corpus (' + c2.length + ' intakes, written by `design/bench/build_intakes.mjs`)', '');
    table(['Axis', 'Coverage (number of intakes)'], [
      ['Goal', show(tally(x => x.intake.goal + (x.intake.format === 'bootcamp' ? ' / bootcamp' : '')))],
      ['Template family the engine chose', show(tally(fam))],
      ['Days a week', show(tally(x => x.intake.days), [2, 3, 4, 5, 6])],
      ['Session minutes asked', show(tally(x => x.intake.minutes), [30, 45, 60, 75, 90, 105, 120])],
      ['Equipment profile', show(tally(x => x.intake.equipment))],
      ['Level (from the plan)', show(tally(lvl), ['L1', 'L2', 'L3'])],
      ['Age', show(tally(x => ageBand(x.intake.age)), ['under 18', '18-29', '30-49', '50-59', '60-69', '70+']) + '; youngest ' + Math.min(...c2.map(x => x.intake.age)) + ', oldest ' + Math.max(...c2.map(x => x.intake.age))],
      ['Competitive sports', show(tally(x => x.intake.sport))],
      ['Activities (stay active / recreational)', show(tally(x => x.intake.activity || []))],
      ['Focus muscles', show(tally(x => x.intake.focus)) || 'none'],
      ['Pain areas', show(tally(x => x.intake.pain)) || 'none'],
      ['Plan mode', show(tally(x => x.intake.mode))],
      ['First block of the plan', show(tally(x => (x.result && x.result.facts.blocks[0] ? x.result.facts.blocks[0].type + (x.result.facts.blocks[0].format !== 'straight' ? ' (' + x.result.facts.blocks[0].format + ')' : '') : null)))],
      ['Deliberately hard cases (tag `edge`)', c2.filter(x => x.edge).length + ': ' + c2.filter(x => x.edge).map(x => x.file.replace(/\.json$/, '')).join(', ')]
    ]);
  }

  // ---- 2 acceptance
  p('## 2. Acceptance rows (PLANNER_SPEC 13.2)', '');
  p('Value = the count on the corpus (a share where the rule is a share). "Plans" = plans that fail the row.', '');
  const accRows = [];
  for (const a of ACCEPTANCE) {
    const x = C2 && C2.acceptance[a.id], y = C1 && C1.acceptance[a.id];
    accRows.push([a.id, '`' + a.name + '`', a.pass, x ? fmt(x.value) + (x.note ? ' (' + x.note + ')' : '') : '-', x ? fmt(x.plans_failing) : '-', x ? (x.pass === null ? 'n/a' : x.pass ? 'pass' : '**FAIL**') : '-', y ? fmt(y.value) : '-', y ? fmt(y.plans_failing) : '-', y ? (y.pass === null ? 'n/a' : y.pass ? 'pass' : '**FAIL**') : '-']);
  }
  if (R.sweep && R.sweep.intakes) accRows.push(['A15', '`keep_worse_with_minutes`, `keep_worse_with_days`', '0 and 0 (C3)', '-', '-', '-', R.sweep.keep_worse_with_minutes + ' of ' + R.sweep.minute_steps + ' minute steps, ' + R.sweep.keep_worse_with_days + ' of ' + R.sweep.day_steps + ' day steps', '-', R.sweep.keep_worse_with_minutes + R.sweep.keep_worse_with_days === 0 ? 'pass' : '**FAIL**']);
  for (const [c, a] of Object.entries(R.corpora)) accRows.push(['A23', '`time` (' + c + ')', 'p99 <= 250 ms', c === 'C2' ? 'p50 ' + a.timing_ms.p50 + ', p99 ' + a.timing_ms.p99 + ', max ' + a.timing_ms.max + ' ms' : '-', '-', c === 'C2' ? (a.timing_ms.pass ? 'pass' : '**FAIL**') : '-', c === 'C1' ? 'p50 ' + a.timing_ms.p50 + ', p99 ' + a.timing_ms.p99 + ', max ' + a.timing_ms.max + ' ms' : '-', '-', c === 'C1' ? (a.timing_ms.pass ? 'pass' : '**FAIL**') : '-']);
  if (R.comparison) accRows.push(['A24', 'regression rule', 'no plan\'s score drops', R.comparison.lowered.length + ' of ' + R.comparison.compared + ' plans lower than `' + R.comparison.against + '` (mean change ' + R.comparison.mean_delta + ')', R.comparison.lowered.length, R.comparison.pass ? 'pass' : '**FAIL**', '-', '-', '-']);
  table(['Row', 'Metric', 'Pass rule', 'C2 value', 'C2 plans', 'C2', 'C1 value', 'C1 plans', 'C1'], accRows);
  p('Not measured here: A14 (the certified grid, C4), A19 (`meta.planner.tiers`; the 0.4 engine has none), A23 in JavaScriptCore and on a phone, C5 (random intakes).', '');
  p('Expected by construction of the measurement (PLANNER_SPEC 13.2 note 2): the 0.4 engine writes no `time_check.pattern_stations`, no `time_check.overrun` and no `weeks[].progression`, so A5 counts its kept-movement stations, A10 counts every day over the minutes (told or not) and A8 counts every trained group-week. Section 3 splits those counts.', '');

  // ---- 3 the reviewed failures
  if (main) {
    const A = C2 || C1; const c = C2 ? 'C2' : 'C1';
    const ps = scoredPlans(c);
    const sumF = (f) => ps.reduce((n, x) => n + (f(x.result.facts) || 0), 0);
    const stair = ps.flatMap(x => x.result.facts.stairway.filter(b => b.groups && Object.keys(b.groups).length).map(b => ({ x, b })));
    let trans = 0, flat = 0, groupsN = 0;
    for (const { b } of stair) for (const g of Object.values(b.groups)) { trans += b.N - 1; flat += g.flat_transitions; groupsN++; }
    const kept = ps.reduce((n, x) => n + (x.result.metrics.one_exercise_groups ? x.result.metrics.one_exercise_groups.value : 0), 0);
    const oneEx = { kept_movement_not_listed: 0, trained_group_squeezed: 0, lone_station: 0, more_than_max: 0 };
    for (const x of ps) for (const [k, n] of Object.entries(((x.result.metrics.one_exercise_groups || {}).detail || {}).by_kind || {})) oneEx[k] = (oneEx[k] || 0) + n;
    const dropsInTest = ps.reduce((n, x) => n + ((((x.result.metrics.athletic_drops || {}).detail) || {}).in_an_end_test_week || 0), 0);
    const fewGroups = ps.filter(x => x.result.facts.blocks.some(b => b.type === 'stairway' && b.trained.length <= 1)).length;
    const listedBelow = ps.filter(x => x.result.facts.blocks.some(b => (b.below_floor || []).length)).length;
    p('## 3. The reviewed failures of the brief, measured on ' + c, '');
    table(['Reviewed failure', 'What the scorer counts', 'Result'], [
      ['Stairways that go flat on the main days', '`main_flat_weeks_excess` (flat weeks of the main-day total beyond the arithmetic minimum); `flat_weeks_excess` (the same on the whole week, A7); `trained_not_climbing` (a trained group gains less than its minimum climb on the main days); share of week-to-week transitions of trained groups that add no own set',
        tot(A, 'main_flat_weeks_excess') + ' and ' + tot(A, 'flat_weeks_excess') + ' avoidable flat weeks in ' + pf(A, 'main_flat_weeks_excess') + ' and ' + pf(A, 'flat_weeks_excess') + ' plans; ' + tot(A, 'trained_not_climbing') + ' trained groups not climbing in ' + pf(A, 'trained_not_climbing') + ' plans; ' + (trans ? Math.round(100 * flat / trans) + ' % of ' + trans + ' transitions flat (' + groupsN + ' trained groups)' : '-')],
      ['Trained groups below the 10-set floor', '`floor_misses` (group-weeks of a trained group under its floor on the main days); `below_floor_states` (the plan lists a group as "trained below the floor")',
        tot(A, 'floor_misses') + ' group-weeks in ' + pf(A, 'floor_misses') + ' plans; ' + tot(A, 'below_floor_states') + ' listed below-floor states in ' + listedBelow + ' plans; calves under 3 x leg days: ' + tot(A, 'calf_floor_misses') + ' weeks'],
      ['Days over the chosen minutes', '`days_over_unwarned` (A10: over the minutes and not listed in `time_check.overrun` with an offer); `days_over_band` (A11: above ceil(minutes x 1.10)); `minutes_recost_gap` (A12: printed minutes against the re-cost of the dosed items, tolerance 2 min)',
        tot(A, 'days_over_unwarned') + ' of ' + (mt(A, 'days_over_unwarned') || {}).checked + ' gym days over in ' + pf(A, 'days_over_unwarned') + ' plans (' + sumF(f => f.time.over_main) + ' main days, ' + sumF(f => f.time.over_optional) + ' optional days; ' + sumF(f => f.time.over_test_days) + ' are test days; ' + sumF(f => f.time.over_with_an_old_style_warning) + ' carry a 0.4-style long-day warning); ' + tot(A, 'days_over_band') + ' above the band in ' + pf(A, 'days_over_band') + ' plans; ' + tot(A, 'minutes_recost_gap') + ' days where the printed minutes and the re-cost differ by more than 2 min (' + pf(A, 'minutes_recost_gap') + ' plans); by the re-cost ' + sumF(f => f.time.recost.days_over_by_recost) + ' days are over the minutes and ' + sumF(f => f.time.recost.days_over_band_by_recost) + ' above the band'],
      ['Too many exercises per day', '`exbudget_over` (A13: full-body days above the cap by minutes + 1); `athlete_cap` (athlete days above 12 counted exercises); `exercise_cap_excess` (split days above the cap)',
        tot(A, 'exbudget_over') + ' full-body days over in ' + pf(A, 'exbudget_over') + ' plans; athlete cap ' + tot(A, 'athlete_cap') + '; ' + tot(A, 'exercise_cap_excess') + ' exercises above the cap on split days (' + pf(A, 'exercise_cap_excess') + ' plan(s))'],
      ['The time check over-cuts ("left with only hinges")', '`missing_primary_pattern` (a week with no knee, hip, horizontal push or horizontal pull exercise); `day_lost_pattern` (a lower work lift with no partner push / pull on its day); `one_exercise_groups` (A5); `slack_while_untrained` (a peak-week day more than 15 % under the minutes while a group is out for time); stairway plans that train at most one group',
        tot(A, 'missing_primary_pattern') + ' week-patterns missing in ' + pf(A, 'missing_primary_pattern') + ' plans; ' + tot(A, 'day_lost_pattern') + ' days that lost their pattern in ' + pf(A, 'day_lost_pattern') + ' plans; ' + kept + ' one-exercise group-days in ' + pf(A, 'one_exercise_groups') + ' plans (' + oneEx.kept_movement_not_listed + ' kept-movement stations the plan does not list in `time_check.pattern_stations`, ' + oneEx.trained_group_squeezed + ' trained groups squeezed to 1 exercise, ' + oneEx.lone_station + ' lone stations of groups that are not trained, ' + oneEx.more_than_max + ' above 4); ' + tot(A, 'slack_while_untrained') + ' slack days in ' + pf(A, 'slack_while_untrained') + ' plans; ' + fewGroups + ' plans train 0 or 1 group; ' + tot(A, 'groups_out_for_time') + ' of ' + (mt(A, 'groups_out_for_time') || {}).checked + ' groups are out for time (`groups_out_for_time`: legal, the objective the policy maximizes, it costs points)'],
      ['Athletic work off its budget or not climbing', '`athletic_attainment` (A18: a family under 0.9 x its scaled target in a week); `athletic_drops` (A18: a family\'s weekly dose drops); `athletic_flat` (the target rises 10 %+ over the block, the planned dose does not); `athletic_over_budget`; mean planned / full target',
        tot(A, 'athletic_attainment') + ' family-weeks under 0.9 x in ' + pf(A, 'athletic_attainment') + ' plans; ' + tot(A, 'athletic_drops') + ' drops in ' + pf(A, 'athletic_drops') + ' plans (' + dropsInTest + ' of them in an end-test week); ' + tot(A, 'athletic_flat') + ' flat families in ' + pf(A, 'athletic_flat') + ' plans; over budget ' + tot(A, 'athletic_over_budget') + '; mean planned / full target ' + tot(A, 'athletic_attainment_ratio')],
      ['Greedy logic interacting badly (erratic selection, offers)', '`keep_order_skips` (a group trained while an earlier group of the keep order is out for time: a signal, not a proof); `offer_invalid` (offered schedules the intake rejects); `offer_mismatch` (offered schedules that do not give what they state); the sweep (section 9)',
        tot(A, 'keep_order_skips') + ' skips in ' + pf(A, 'keep_order_skips') + ' plans; ' + tot(A, 'offer_invalid') + ' invalid offers in ' + pf(A, 'offer_invalid') + ' plans; ' + tot(A, 'offer_mismatch') + ' offers that do not deliver' + (A.offers_rerun ? ' of ' + A.offers_rerun.schedules_generated + ' generated' : '') + (R.sweep ? '; sweep: ' + R.sweep.keep_worse_with_minutes + ' minute steps and ' + R.sweep.keep_worse_with_days + ' day steps make the trained set worse' : '')]
    ]);
  }

  // ---- 4 where the points go
  p('## 4. Where the points go', '');
  table(['Corpus', ...['T0 safety and structure', 'T1 policy', 'T2 floors', 'T3 stairway', 'T4 time', 'T5 caps and athletic budget', 'T6 counts', 'T7 placement', 'T8 balance'], 'Total'],
    Object.entries(R.corpora).map(([c, a]) => { const t = a.mean_points_lost_by_tier; const row = [c]; let s = 0; for (let i = 0; i <= 8; i++) { row.push(fmt(t['T' + i] || 0)); s += t['T' + i] || 0; } row.push(r2(s)); return row; }));
  p('Mean points lost per plan, by tier of the rule inventory.', '');
  if (main) {
    const top = Object.entries(main.metrics).filter(([, x]) => x.points_lost > 0).sort((a, b) => b[1].points_lost - a[1].points_lost).slice(0, 20);
    table(['Metric', 'Rule', 'Kind', 'Max points', 'Count', 'Checked', 'Plans failing', 'Mean points lost per plan'], top.map(([k, x]) => ['`' + k + '`', x.rule, x.kind, x.pts, x.total, x.checked, x.plans_failing + ' of ' + x.measured_on, r2(x.points_lost / main.scored)]));
  }

  // ---- 5 all metrics with a count
  p('## 5. Every metric with a non-zero count', '');
  const rows5 = [];
  for (const def of METRICS) {
    const x = mt(C2, def.id), y = mt(C1, def.id);
    if (!(x && (x.plans_failing > 0 || (def.report_only && x.total))) && !(y && (y.plans_failing > 0 || (def.report_only && y.total)))) continue;
    const valueOnly = def.report_only && !['keep_order_skips', 'supersets_on_unneeded'].includes(def.id);
    const show = (a) => (!a ? '-' : valueOnly ? 'mean ' + (def.unit === 'ratio' ? a.total : a.mean_per_plan) : a.total);
    rows5.push(['T' + def.tier, '`' + def.id + '`', def.rule, def.kind + (def.report_only ? ' (reported)' : def.pts === 0 ? ' (counted, 0 pts)' : ''), def.acc || '', show(x), x && !valueOnly ? x.checked : '-', x && !valueOnly ? x.plans_failing : '-', show(y), y && !valueOnly ? y.plans_failing : '-', def.what]);
  }
  table(['Tier', 'Metric', 'Rule', 'Kind', 'Acc.', 'C2 count', 'C2 checked', 'C2 plans', 'C1 count', 'C1 plans', 'What is counted'], rows5);
  const clean = METRICS.filter(def => !def.report_only && [C2, C1].every(a => !a || !mt(a, def.id) || mt(a, def.id).plans_failing === 0) && [C2, C1].some(a => a && mt(a, def.id)));
  p('Measured with no violation on either corpus (' + clean.length + '): ' + clean.map(d => '`' + d.id + '`').join(', ') + '.', '');
  p('"(reported)" rows are never judged; a value row shows the mean over the plans it was measured on. "(counted, 0 pts)" rows repeat another metric on a different tally: they count and cost no points (a `subset_of` row is left out of A1).', '');

  // ---- 6 / 7 per plan
  const planTable = (c, title) => {
    const ps = R.plans.filter(x => x.corpus === c);
    if (!ps.length) return;
    p('## ' + title, '');
    p('`Trained` = groups in `time_check.trained_groups` of the first stairway block (b = of which listed below the floor). `Floor` = group-weeks under the floor. `Flat` = avoidable flat weeks (total / main days). `Not climbing` = trained groups under their minimum climb. `Over` = gym days over the minutes / above the 10 % band, of all gym days. `1-ex` = one-exercise group-days. `Ex+` = full-body days above the exercise budget. `Pattern` = week-patterns missing + days that lost their pattern. `Ath` = athletic family-weeks under 0.9 x the scaled target / dose drops. `ms` = the faster of two generate() calls.', '');
    const rows = [];
    for (const x of ps) {
      if (!x.scored || !x.result) { rows.push([x.file.replace(/\.json$/, ''), x.intake.days + ' x ' + x.intake.minutes, '-', '-', 'NOT SCORED: ' + (x.error || x.status), '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', x.ms.second]); continue; }
      const r = x.result, f = r.facts, M = r.metrics;
      const v = (id) => (M[id] ? M[id].value : 0);
      const b = f.blocks.find(bb => bb.type === 'stairway') || f.blocks[0];
      rows.push([(x.edge ? '**' : '') + x.file.replace(/\.json$/, '') + (x.edge ? '**' : ''), f.days_per_week + ' x ' + f.session_minutes, (f.template && f.template.id) + (f.template && f.template.variant ? ':' + f.template.variant : ''), f.level, b ? b.type + (b.format !== 'straight' ? ' (' + b.format + ')' : '') : '-',
        b && b.type === 'stairway' ? b.trained.length + (b.below_floor.length ? ' (' + b.below_floor.length + ' b)' : '') : '-', r.score, band(r.score), r.hard_violations,
        v('floor_misses') + v('calf_floor_misses'), v('flat_weeks_excess') + ' / ' + v('main_flat_weeks_excess'), v('trained_not_climbing'), v('days_over_unwarned') + ' / ' + v('days_over_band') + ' of ' + f.time.days, v('one_exercise_groups'), v('exbudget_over') + v('athlete_cap'), v('missing_primary_pattern') + ' + ' + v('day_lost_pattern'), f.athletic.enabled ? v('athletic_attainment') + ' / ' + v('athletic_drops') : '-', r2(Math.min(x.ms.first, x.ms.second))]);
    }
    table(['Intake', 'Days x min', 'Template', 'Level', 'First block', 'Trained', 'Score', 'Band', 'Hard', 'Floor', 'Flat', 'Not climbing', 'Over', '1-ex', 'Ex+', 'Pattern', 'Ath', 'ms'], rows);
  };
  planTable('C2', '6. Per plan: C2 bench (edge cases in bold)');
  planTable('C1', '7. Per plan: C1 samples');

  // ---- 8 edge cases
  const edges = R.plans.filter(x => x.corpus === 'C2' && x.edge && x.scored && x.result);
  if (edges.length) {
    p('## 8. The deliberately hard cases', '');
    table(['Intake', 'Who', 'Trained directly', 'Not trained (reason)', 'Score', 'Largest deductions'],
      edges.map(x => { const b = x.result.facts.blocks.find(bb => bb.type === 'stairway') || x.result.facts.blocks[0]; return [x.file.replace(/\.json$/, ''), (x.comment || '').replace(/^EDGE: /, ''), b ? (b.trained.join(', ') || 'none') + (b.below_floor.length ? ' (below the floor: ' + b.below_floor.join(', ') + ')' : '') : '-', b ? b.not_trained.join(', ') || '-' : '-', x.result.score, x.result.top_deductions.slice(0, 4).map(t => '`' + t.metric + '` ' + r2(t.lost)).join(', ')]; }));
  }

  // ---- 9 sweep
  if (R.sweep && R.sweep.intakes) {
    p('## 9. The sweep (C3, A15): more minutes or one more day must never train a worse set of groups', '');
    p('The keep vector marks, in the keep order, the groups trained directly and not listed below the floor. A step is worse when the vector gets lexicographically smaller: an earlier group of the keep order is lost. ' + R.sweep.keep_worse_with_minutes + ' of ' + R.sweep.minute_steps + ' minute steps and ' + R.sweep.keep_worse_with_days + ' of ' + R.sweep.day_steps + ' day steps are worse.', '');
    table(['Sample', 'Keep order', 'Days', ...R.scorer.parameters.minutes_allowed.value.map(mm => mm + ' min'), 'Worse steps'],
      R.sweep.rows.flatMap(rw => rw.days.map((d, k) => [k === 0 ? rw.file.replace(/\.json$/, '') : '', k === 0 ? rw.keep_order.join(' > ') : '', d, ...rw.grid[d].map(x => (x.error ? 'ERROR' : x.vector === null ? '(flat block)' : (x.trained.join(', ') || 'none'))),
        k === 0 ? [...rw.worse_with_minutes.map(st => st.days + ' days: ' + st.from + ' -> ' + st.to + ' min'), ...rw.worse_with_days.map(st => st.minutes + ' min: ' + st.from + ' -> ' + st.to + ' days')].join('; ') || '-' : ''])));
    p('Cells list the groups trained directly at the floor (the keep vector). ' + R.sweep.plans + ' plans were generated for the sweep.', '');
  }

  // ---- 10 timing, determinism
  p('## 10. Determinism (A22) and time (A23)', '');
  table(['Corpus', 'Identical twice in one process', 'Identical in a fresh process', 'p50 ms', 'p90 ms', 'p99 ms', 'max ms', 'first call p50 / max ms'],
    Object.entries(R.corpora).map(([c, a]) => [c, a.determinism.in_process_identical + ' of ' + a.determinism.plans, a.determinism.fresh_process_identical === null ? 'not judged' : a.determinism.fresh_process_identical + ' of ' + a.determinism.plans, a.timing_ms.p50, a.timing_ms.p90, a.timing_ms.p99, a.timing_ms.max, a.timing_ms.first_call_p50 + ' / ' + a.timing_ms.first_call_max]));
  if (R.fresh_process && !R.fresh_process.comparable) p('Fresh-process comparison: ' + R.fresh_process.note + '.', '');
  p('Times are one laptop run in V8 (the faster of two calls per intake); the target of PLANNER_SPEC 10.1 is p50 <= 60 ms and p99 <= 250 ms.', '');

  // ---- 11 coverage and parameters
  p('## 11. What the scorer covers', '');
  const cov = R.scorer.inventory_coverage;
  if (cov) {
    p('Of the ' + (cov.implemented.length + cov.not_measured.length + cov.missing.length) + ' metrics of `design/rules_as_constraints.json > metrics_index`: ' + cov.implemented.length + ' are computed, ' + cov.not_measured.length + ' cannot be measured on one plan JSON' + (cov.missing.length ? ', **' + cov.missing.length + ' are missing: ' + cov.missing.map(x => x.metric).join(', ') + '**' : '') + '. Bench-only metrics (not in the inventory, they name a reviewed failure or an acceptance row): ' + cov.bench_only.map(x => '`' + x + '`').join(', ') + '.', '');
    table(['Not measured', 'Rule', 'Why'], cov.not_measured.map(x => ['`' + x.metric + '`', x.rule, x.why]));
  }
  p('Parameters that are not read from `model/rules.json` (every other number is; the full list with sources is in the results file under `scorer.parameters`):', '');
  table(['Parameter', 'Value', 'Source'], Object.entries(R.scorer.parameters).filter(([, v]) => !/^rules\./.test(v.source)).map(([k, v]) => ['`' + k + '`', '`' + JSON.stringify(v.value) + '`', v.source]));

  // ---- 12 notes
  p('## 12. Reading notes', '');
  p('- The engine, the model and the samples were being edited by another workflow while this ran. The fingerprint above identifies the files measured; "changed during the run" says whether a file changed between the first and the last generation.');
  p('- The scorer recounts sets, credits, exercises per group and minutes from the items; it uses the plan\'s own summary fields only to compare (`credit_tally_mismatch`). `engine validation ok` in section 1 is the engine\'s own `validation.ok`: it is not an acceptance criterion (PLANNER_SPEC 12.1).');
  p('- A rep-max test item is the top set of its lift: the two are one exercise for set bounds, set drops and the exercise count.');
  p('- `one_exercise_groups` (A5) exempts calves, circuit days, the strength family\'s four-role days, a class lift (a work lift of a group listed with reason `class_lift`, or a slot in `time_check.class_lifts`) and a station listed in `time_check.pattern_stations` at 2 constant sets for a group that is not trained. The 0.4 engine marks its kept movements only on the item (`origin: pattern_kept`), so they are counted; section 3 gives the split.');
  p('- `h_before_v` and the bilateral-before-unilateral part of `work_bilateral_myo_order` use the "first" reading (the first horizontal before the first vertical; lower body). The count under the "every" reading is in each plan\'s metric detail.');
  p('- `minutes_recost_gap` (A12) prices every printed item with DEF-09: work minutes of its time class, the rest class its printed rest falls in, pairs that are on share the rest, one changeover per exercise, the warm-up, skill, WOD, circuits, aerobic add-ons, 10 min per rep-max work-up and the timed tests. A gap means the printed `est_minutes` and the printed prescription disagree; it does not say which one is right.');
  p('- Flat blocks (maintenance, in-season, pre-season, taper, recovery), timed circuits and the year plan\'s flat first quarter are scored on the rows their format keeps: floors and minutes always, the set stairway only where the format climbs in sets (PLANNER_SPEC 13.2 note 3).');
  p('- Re-run: `node design/bench/run.mjs` (about ' + Math.max(1, Math.round(R.run.seconds / 60)) + ' min). Compare a later engine: `node design/bench/run.mjs --label <name> --compare design/bench/results_baseline.json` (exit code 2 when a plan\'s score drops, A24).');
  p('');
  return L.join('\n');
}

main().catch((e) => { console.error(e); process.exit(1); });
