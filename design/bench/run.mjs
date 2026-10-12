#!/usr/bin/env node
// design/bench/run.mjs - the benchmark runner for engine 0.5 (design/ENGINE_V05_PLAN.md).
//
// Generates a plan IN MEMORY for every intake of the corpora through engine/generate.mjs, scores it with design/bench/score.mjs
// (scorer 2.x: no metric reads minutes) and writes two files, both inside design/bench/ (nothing else is written anywhere; the
// engine, the model and the samples are only read):
//     results_<label>.json   every plan's score sheet, the corpus roll-up, the run's identity     (default label: v06)
//     <LABEL>.md             the summary table
//
// Corpora:  C2 = design/bench/intakes/*.json (94 intakes)   C1 = samples/intakes/*.json (the 8 samples).
// The bench intakes were written for engine 0.4 and still carry schedule.session_minutes; engine 0.5 ignores the field with one
// warning (COACH-R4 R4-SES-01), so two intakes that differ only in minutes now give the same plan.
//
// What the runner adds to the scorer, because it needs more than one plan:
//   determinism (A14)   every intake is generated twice in this process and once more in a fresh process; the bytes must be equal
//   speed               milliseconds per generate() call (information)
//   regression          --compare results_x.json: no plan's score may drop (only against results of the same scorer major version)
//
// Usage:
//   node design/bench/run.mjs                         C1 + C2, fresh-process determinism
//   node design/bench/run.mjs --label v06b --compare design/bench/results_v06.json
// (engine 0.6.0: the default label is v06, so a plain run writes results_v06.json + V06.md, the current reference; results_v05.json
// + V05.md are the engine 0.5.0 run, kept unchanged as history.)
//   node design/bench/run.mjs --filter 62             only the intakes whose file name contains "62" (writes results_partial.json)
//   node design/bench/run.mjs --no-fresh --no-samples the quick run
//   node design/bench/run.mjs --check-intakes         validate the bench intakes against the live validateIntake, write nothing
//   node design/bench/run.mjs --plan some-plan.json   score one plan JSON file and print its sheet, write nothing
// Plain Node 22, no dependencies. (The v0.4 runner's schedule offers, session-length sweep and minutes trace went with the time
// check; results_baseline.json / BASELINE.md are the engine 0.4 run under scorer 1.0 and are kept as history only.)
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { makeContext, scorePlan, aggregate, compareRuns, METRICS, NOT_MEASURED, ACCEPTANCE, SCORER_VERSION } from './score.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '..', '..');

// ------------------------------------------------------------------------------------------------------------- arguments
const argv = process.argv.slice(2);
const flag = (name) => argv.includes('--' + name);
const opt = (name, def = null) => { const i = argv.indexOf('--' + name); return i >= 0 && i + 1 < argv.length ? argv[i + 1] : def; };
const ARGS = {
  filter: opt('filter'),
  label: opt('label') || (opt('filter') ? 'partial' : 'v06'),
  fresh: !flag('no-fresh'), samples: !flag('no-samples'),
  compare: opt('compare'), keep: Number(opt('violations', '8')),
  checkIntakes: flag('check-intakes'), plan: opt('plan'), hashWorker: flag('hash-worker'), quiet: flag('quiet')
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
  for (const d of ['engine', path.join('engine', 'progression'), 'model', path.join('model', 'i18n')]) {
    const abs = path.join(ROOT, d);
    if (!fs.existsSync(abs)) continue;
    for (const f of fs.readdirSync(abs).sort()) if (/\.(mjs|json)$/.test(f) || f === 'MODEL_VERSION') files.push(path.join(d, f));
  }
  const h = crypto.createHash('sha256');
  let newest = 0;
  for (const rel of files) {
    const buf = fs.readFileSync(path.join(ROOT, rel));
    h.update(rel + ':' + sha(buf) + '\n');
    newest = Math.max(newest, fs.statSync(path.join(ROOT, rel)).mtimeMs);
  }
  return { sha256: h.digest('hex'), files: files.length, newest_mtime: new Date(newest).toISOString() };
}

function gitInfo() {
  const run = (args) => { try { const r = spawnSync('git', args, { cwd: ROOT, encoding: 'utf8' }); return r.status === 0 ? r.stdout.trim() : null; } catch { return null; } };
  let status = null;
  try { const r = spawnSync('git', ['status', '--porcelain', '--', 'engine', 'model'], { cwd: ROOT, encoding: 'utf8' }); if (r.status === 0) status = r.stdout; } catch { status = null; }
  const dirty = status === null ? null : status.split('\n').filter(l => l.length > 3).map(l => l.slice(3));
  return { head: run(['rev-parse', 'HEAD']), branch: run(['rev-parse', '--abbrev-ref', 'HEAD']), head_date: run(['log', '-1', '--format=%cI']), uncommitted_engine_model_files: dirty === null ? null : dirty.length };
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
  const ver = await import(pathToFileURL(path.join(ROOT, 'engine', 'version.mjs')).href);
  const model = mod.loadModel(readModelRaw());
  return { generate: (it) => gen.generate(it, model), validateIntake: (it) => intake.validateIntake(it, model), model, ENGINE_VERSION: ver.ENGINE_VERSION };
}

const clone = (o) => JSON.parse(JSON.stringify(o));

// ------------------------------------------------------------------------------------------------------------- one plan
function generateTimed(E, intake) {
  const t0 = performance.now();
  let plan = null, error = null;
  try { plan = E.generate(clone(intake)); } catch (e) { error = String((e && e.stack) || e).split('\n').slice(0, 3).join(' | '); }
  return { plan, error, ms: r2(performance.now() - t0) };
}

async function hashWorker() {
  // a fresh process: generate every intake once and print the hashes (used by the parent for A14)
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
  const ctx = makeContext({ rules: raw.rules, catalog: raw.catalog, templates: raw.templates, profiles: raw.profiles });
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

/** keep the first ARGS.keep violations of a metric in the results file; the count stays exact (violations_truncated) */
function trimViolations(v) {
  if (!v.violations || v.violations.length <= ARGS.keep) return v;
  return { ...v, violations: v.violations.slice(0, ARGS.keep), violations_truncated: (v.violations_truncated || 0) + v.violations.length - ARGS.keep };
}

// ------------------------------------------------------------------------------------------------------------- the run
async function main() {
  if (ARGS.hashWorker) return hashWorker();
  if (ARGS.checkIntakes) return checkIntakes();
  if (ARGS.plan) return scoreOnePlanFile(ARGS.plan);

  const startedAt = new Date();
  const fp0 = fingerprint();
  const git = gitInfo();
  const E = await loadEngine();
  const raw = readModelRaw();
  const ctx = makeContext({ rules: raw.rules, catalog: raw.catalog, templates: raw.templates, profiles: raw.profiles });
  const entries = listIntakes();
  log('bench: ' + entries.length + ' intakes, engine ' + E.ENGINE_VERSION + ', model ' + raw.manifest.model_version + ', scorer ' + SCORER_VERSION + ', git ' + (git.head || '?').slice(0, 7) + ' (+' + git.uncommitted_engine_model_files + ' uncommitted engine / model files)');

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

  // 3. score
  const plans = [];
  for (const run of runs) {
    const { e } = run;
    const key = e.corpus + '/' + e.file;
    const tags = (e.intake._bench && e.intake._bench.tags) || [];
    const head = { corpus: e.corpus, file: e.file, id: e.intake.id || e.file, tags, edge: tags.includes('edge'), comment: e.intake._comment || null,
      intake: { goal: e.intake.goal, format: e.intake.format, days: e.intake.schedule.days_per_week, age: e.intake.age, equipment: e.intake.equipment && e.intake.equipment.profile,
        mode: e.intake.plan && e.intake.plan.mode, focus: e.intake.focus_muscles || e.intake.priority_muscles || [], pain: (e.intake.pain || []).map(p => p.area),
        sport: (e.intake.sport && e.intake.sport.sport) || null, activity: (e.intake.activity && e.intake.activity.ids) || [] },
      ms: { first: run.ms[0], second: run.ms[1] }, hash: run.hash, bytes: run.bytes };
    if (run.error || !run.plan) { plans.push({ ...head, scored: false, status: 'threw', error: run.error }); continue; }
    const freshSame = freshComparable ? fresh.hashes[key] === run.hash : null;
    const det = run.same_in_process && freshSame !== false;
    const sheet = scorePlan(run.plan, ctx, { intake: e.intake, determinism: det });
    const val = run.plan.validation || null;
    plans.push({ ...head, scored: sheet.scored, status: sheet.status, error: sheet.error || null,
      determinism: { same_in_process: run.same_in_process, same_in_fresh_process: freshSame },
      engine_validation: val ? { ok: !!val.ok, failing_error_checks: (val.checks || []).filter(c => !c.pass && c.severity === 'error').map(c => c.id), failing_warn_checks: (val.checks || []).filter(c => !c.pass && c.severity !== 'error').map(c => c.id) } : null,
      notices: ((run.plan.meta && run.plan.meta.warnings) || []).map(w => w.code),
      result: sheet.scored ? { ...sheet, violations: undefined, metrics: Object.fromEntries(Object.entries(sheet.metrics).map(([k, v]) => [k, trimViolations(v)])) } : null });
  }

  // 4. roll-up
  const corpora = {};
  for (const c of [...new Set(plans.map(p => p.corpus))]) {
    const ps = plans.filter(p => p.corpus === c);
    const agg = aggregate(ps.map(p => (p.scored ? p.result : { id: p.id, status: p.status, error: p.error, scored: false })));
    const ms = ps.flatMap(p => [p.ms.first, p.ms.second]).sort((a, b) => a - b);
    const q = (p) => (ms.length ? ms[Math.min(ms.length - 1, Math.max(0, Math.ceil(p * ms.length) - 1))] : null);
    agg.generate_ms = { p50: q(0.5), p99: q(0.99), max: ms.length ? ms[ms.length - 1] : null };
    agg.determinism = { same_in_process: ps.filter(p => p.determinism && p.determinism.same_in_process).length, fresh_process_checked: ps.filter(p => p.determinism && p.determinism.same_in_fresh_process !== null).length, fresh_process_differs: ps.filter(p => p.determinism && p.determinism.same_in_fresh_process === false).length };
    agg.engine_validation = { plans_with_a_failing_error_check: ps.filter(p => p.engine_validation && p.engine_validation.failing_error_checks.length).length };
    corpora[c] = agg;
  }
  const all = aggregate(plans.map(p => (p.scored ? p.result : { id: p.id, status: p.status, error: p.error, scored: false })));

  // 5. comparison (the same scorer major version only: a score under scorer 1.0 measured other rules)
  let comparison = null;
  if (ARGS.compare) {
    const prev = readJSON(path.resolve(ARGS.compare));
    const prevVersion = String((prev.scorer && prev.scorer.version) || '');
    if (prevVersion.split('.')[0] !== SCORER_VERSION.split('.')[0]) comparison = { against: path.basename(ARGS.compare), refused: 'scorer ' + prevVersion + ' against scorer ' + SCORER_VERSION + ': the scores are not comparable', pass: null };
    else {
      const before = (prev.plans || []).filter(p => p.scored && p.result).map(p => ({ id: p.corpus + '/' + p.file, score: p.result.score }));
      const after = plans.filter(p => p.scored).map(p => ({ id: p.corpus + '/' + p.file, score: p.result.score }));
      comparison = { against: path.basename(ARGS.compare), ...compareRuns(before, after) };
    }
  }

  const results = {
    schema: 'bench-results/2', label: ARGS.label,
    run: { started: startedAt.toISOString(), seconds: r2((Date.now() - startedAt.getTime()) / 1000), node: process.version, filter: ARGS.filter || null },
    engine: { version: E.ENGINE_VERSION, model_version: raw.manifest.model_version, fingerprint: fp0, git },
    scorer: { version: SCORER_VERSION, metrics: METRICS.length, acceptance: ACCEPTANCE, not_measured: NOT_MEASURED,
      parameters: Object.fromEntries(Object.keys(ctx.P).map(k => [k, { value: ctx.P[k], source: ctx.param_sources[k] }])) },
    fresh_process: fresh ? { comparable: freshComparable, error: fresh.error || null } : null,
    all, corpora, comparison, plans
  };
  const outJson = path.join(HERE, 'results_' + ARGS.label + '.json');
  const outMd = path.join(HERE, ARGS.label.toUpperCase() + '.md');
  fs.writeFileSync(outJson, JSON.stringify(results, null, 1) + '\n');
  fs.writeFileSync(outMd, renderMarkdown(results));
  log('wrote ' + path.relative(ROOT, outJson) + ' and ' + path.relative(ROOT, outMd) + ' (' + results.run.seconds + ' s)');
  log('score mean ' + all.score.mean + ', min ' + all.score.min + '; hard violations ' + all.hard_violations + ' in ' + (all.scored - all.plans_without_hard_violations) + ' of ' + all.scored + ' plans; plans passing every acceptance row ' + all.plans_passing_acceptance);
  if (comparison && comparison.pass === false) { log('REGRESSION: ' + comparison.lowered.length + ' plan(s) score lower than in ' + comparison.against); process.exitCode = 2; }
}

// ------------------------------------------------------------------------------------------------------------- the report
function renderMarkdown(R) {
  const L = [];
  const p = (...a) => L.push(...a);
  const table = (head, rows) => { p('| ' + head.join(' | ') + ' |', '|' + head.map(() => '---').join('|') + '|'); for (const r of rows) p('| ' + r.map(x => String(x === null || x === undefined ? '-' : x).replace(/\|/g, '\\|').replace(/\n/g, ' ')).join(' | ') + ' |'); p(''); };
  const A = R.all;
  p('# Benchmark: ' + R.label, '');
  p('Engine ' + R.engine.version + ', model ' + R.engine.model_version + ', scorer ' + R.scorer.version + ' (' + R.scorer.metrics + ' metrics; no metric reads minutes). Run ' + R.run.started + ', ' + R.run.seconds + ' s, ' + R.run.node + '.',
    'Git ' + String(R.engine.git.head || '?').slice(0, 7) + ' on `' + R.engine.git.branch + '` with ' + R.engine.git.uncommitted_engine_model_files + ' uncommitted engine / model files; fingerprint `' + R.engine.fingerprint.sha256.slice(0, 16) + '` over ' + R.engine.fingerprint.files + ' files.', '');

  p('## 1. Summary', '');
  table(['Corpus', 'Plans', 'Scored', 'Mean score', 'Median', 'Lowest', 'Hard violations', 'Plans with none', 'Plans passing every row'],
    [['all', A.plans, A.scored, A.score.mean, A.score.median, A.score.min, A.hard_violations, A.plans_without_hard_violations, A.plans_passing_acceptance],
      ...Object.entries(R.corpora).map(([c, a]) => [c, a.plans, a.scored, a.score.mean, a.score.median, a.score.min, a.hard_violations, a.plans_without_hard_violations, a.plans_passing_acceptance])]);
  if (A.not_scored.length) { p('Not scored:', ''); for (const x of A.not_scored) p('- ' + x.id + ': ' + (x.error || x.status)); p(''); }

  p('## 2. Acceptance rows', '');
  table(['Row', 'What', 'Pass rule', 'Value', 'Result', 'Plans failing'],
    Object.entries(A.acceptance).map(([k, a]) => [k, a.name, a.rule, a.value, a.pass === null ? 'not measured' : a.pass ? 'PASS' : 'FAIL', a.plans_failing === null ? '-' : a.plans_failing + (a.measured_on ? ' of ' + a.measured_on : '')]));

  p('## 3. The v0.5 rules', '');
  const V05 = ['time_fields', 'skeleton_mismatch', 'template_lift_missing', 'session_size_over', 'session_size_under', 'exercises_per_group', 'target_not_reached', 'arrival_early', 'below_schedule', 'floor_misses', 'calf_floor_misses',
    'two_day_rule_misses', 'unsaid_cap', 'addon_picks', 'incline_share', 'liability_gate', 'video_links', 'progression_rule_missing', 'acceleration_unnoted', 'easy_to_remove_invalid', 'carry_dose'];
  const defOf = (id) => METRICS.find(m => m.id === id) || {};
  table(['Metric', 'Rule', 'Kind', 'Violations', 'Checked', 'Plans with any', 'What it counts'],
    V05.map(id => { const m = A.metrics[id]; const d = defOf(id); return [id, d.rule, d.kind, m ? m.total : 'not measured', m ? m.checked : '-', m ? m.plans_failing : '-', d.what]; }));

  p('## 4. Every metric with violations', '');
  const hit = Object.entries(A.metrics).filter(([, m]) => !m.report_only && m.total > 0).sort((a, b) => b[1].total - a[1].total);
  if (!hit.length) p('None.', '');
  else {
    table(['Metric', 'Rule', 'Kind', 'Violations', 'Plans with any', 'Points lost (sum)', 'Example'],
      hit.map(([id, m]) => {
        const ex = R.plans.find(x => x.scored && x.result.metrics[id] && (x.result.metrics[id].violations || []).length);
        return [id, m.rule, m.kind, m.total, m.plans_failing, m.points_lost, ex ? ex.file.replace(/\.json$/, '') + ': ' + (ex.result.metrics[id].violations[0].msg || '') : '-'];
      }));
  }
  const info = Object.entries(A.metrics).filter(([, m]) => m.report_only);
  if (info.length) { p('Reported, never judged:', ''); table(['Value', 'Rule', 'Total or mean', 'Measured on'], info.map(([id, m]) => [id, m.rule, m.total, m.measured_on])); }

  p('## 5. Every plan', '');
  p('`Val` = the engine\'s own validation (failing error checks). `Rows` = acceptance rows that fail. Edge cases in bold.', '');
  table(['Intake', 'Template', 'Days', 'Size', 'Score', 'Hard', 'Val', 'Rows', 'Largest deduction'],
    R.plans.map(x => {
      const name = (x.edge ? '**' : '') + x.file.replace(/\.json$/, '') + (x.edge ? '**' : '');
      if (!x.scored || !x.result) return [name, '-', x.intake.days, '-', 'NOT SCORED: ' + (x.error || x.status), '-', '-', '-', '-'];
      const f = x.result.facts;
      const rows = Object.entries(x.result.acceptance).filter(([, a]) => a.pass === false).map(([k]) => k).join(' ');
      const top = x.result.top_deductions[0];
      return [name, (f.template ? String(f.template.template_id || f.template.id || '-') : '-') + (f.template && f.template.variant ? ' / ' + f.template.variant : ''), f.days_per_week, f.session_size ? f.session_size.type + ' ' + f.session_size.range.join('-') : '-', x.result.score, x.result.hard_violations,
        x.engine_validation ? (x.engine_validation.failing_error_checks.join(' ') || 'ok') : '-', rows || 'all pass', top ? top.metric + ' (' + top.lost + ')' : '-'];
    }));

  p('## 6. Determinism and speed', '');
  table(['Corpus', 'Same bytes twice in one process', 'Fresh process checked', 'Fresh process differs', 'generate() p50 ms', 'p99 ms', 'max ms'],
    Object.entries(R.corpora).map(([c, a]) => [c, a.determinism.same_in_process + ' of ' + a.plans, a.determinism.fresh_process_checked, a.determinism.fresh_process_differs, a.generate_ms.p50, a.generate_ms.p99, a.generate_ms.max]));
  if (R.comparison) {
    p('## 7. Against ' + R.comparison.against, '');
    if (R.comparison.refused) p(R.comparison.refused + '.', '');
    else p(R.comparison.compared + ' plans compared: ' + R.comparison.lowered.length + ' lower, ' + R.comparison.raised.length + ' higher, mean change ' + R.comparison.mean_delta + '. ' + (R.comparison.pass ? 'No plan scores lower.' : 'Plans that score lower: ' + R.comparison.lowered.map(x => x.id + ' ' + x.before + ' -> ' + x.after).join('; ') + '.'), '');
  }

  p('## How to read this', '');
  p('- The scorer recounts sets, credits, exercises per group and the session\'s exercise count from the plan\'s items; it uses the plan\'s own summary fields only to compare (`credit_tally_mismatch`). It never imports the engine.');
  p('- The coach\'s templates are read from `model/templates.json`: a template A / B day must hold his slots in his order, and a plan day must hold its template\'s counted lifts (`skeleton_mismatch`, `template_lift_missing`).');
  p('- A group the template cannot take to its planned final sets, or cannot hold at the floor, is not a violation when the plan says so (`unsaid_cap` counts the ones it does not say; `below_floor_deficit` reports the size of what it says).');
  p('- Hard and hard_conditional metrics are exact counts (A1). The 0-100 score weights them with the points in `score.mjs > METRICS`.');
  p('- Not measured on one plan JSON: ' + Object.keys(R.scorer.not_measured).join(', ') + ' (see `NOT_MEASURED` in `score.mjs`).');
  p('- Re-run: `node design/bench/run.mjs` (about ' + Math.max(1, Math.round(R.run.seconds / 60)) + ' min). Compare a later engine: `node design/bench/run.mjs --label <name> --compare design/bench/results_' + R.label + '.json`.');
  p('');
  return L.join('\n');
}

main().catch(e => { console.error(e); process.exit(1); });
