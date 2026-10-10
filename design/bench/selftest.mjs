#!/usr/bin/env node
// design/bench/selftest.mjs - does the scorer see what it claims to see?
//
// Takes plans the engine generates in memory for bench intakes, breaks one thing by hand on a known week, day and group, and
// checks that the scorer reports that thing at that place (IMPLEMENTATION_PLAN WP-06: "the scorer flags a hand-broken copy of
// a sample plan on A2, A5, A7, A10 and A13, each on the week, day and group that was broken"). It also checks the other
// direction for the fields the 0.4 engine does not write yet: once a plan lists its kept movements, its overruns with an
// offer, and one progression fact per trained group and week, A5 / A10 / A8 stop counting them.
// Writes nothing. Exit code 1 when a check fails.   Usage: node design/bench/selftest.mjs
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { makeContext, scorePlan, recostDay } from './score.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '..', '..');
const readJSON = (p) => JSON.parse(fs.readFileSync(p, 'utf8'));
const clone = (o) => JSON.parse(JSON.stringify(o));

const manifest = readJSON(path.join(ROOT, 'model', 'manifest.json'));
const rd = (rel) => readJSON(path.join(ROOT, 'model', rel));
const rawFor = () => ({ manifest, catalog: rd(manifest.files.catalog), rules: rd(manifest.files.rules), templates: rd(manifest.files.templates), profiles: rd(manifest.files.profiles),
  i18n: { en: rd(manifest.files.i18n.en), es: rd(manifest.files.i18n.es), es_review: { missing_keys: [], machine_translated: [] } } });
const { generate } = await import(pathToFileURL(path.join(ROOT, 'engine', 'generate.mjs')).href);
const { loadModel } = await import(pathToFileURL(path.join(ROOT, 'engine', 'model.mjs')).href);
const model = loadModel(rawFor());
const raw = rawFor();
const ctx = makeContext({ rules: raw.rules, catalog: raw.catalog, templates: raw.templates });

const intakes = fs.readdirSync(path.join(HERE, 'intakes')).filter(f => f.endsWith('.json')).sort().map(f => ({ file: f, intake: readJSON(path.join(HERE, 'intakes', f)) }));
const plans = new Map();
const planOf = (file) => { if (!plans.has(file)) plans.set(file, generate(clone(intakes.find(x => x.file === file).intake), model)); return plans.get(file); };

let failed = 0, passed = 0;
const check = (name, ok, detail) => { if (ok) { passed++; console.log('  ok    ' + name); } else { failed++; console.log('  FAIL  ' + name + (detail ? '   ' + detail : '')); } };
const count = (sheet, id) => (sheet.metrics[id] ? (sheet.metrics[id].violations || []).length + (sheet.metrics[id].violations_truncated || 0) : 0);
const has = (sheet, id, pred) => !!(sheet.metrics[id] && (sheet.metrics[id].violations || []).some(pred));
const items = (day) => day.blocks.flatMap(b => b.items);
const bucketKind = (it) => ((raw.templates.buckets[it.bucket] || {}).kind);
const isRes = (it) => ['resistance', 'isolation', 'focus'].includes(bucketKind(it)) && it.role !== 'prehab' && typeof it.sets === 'number';
const members = raw.rules.muscles.groups.members;
const primeGroup = (it) => Object.keys(members).find(g => g !== 'core' && Math.min(1, members[g].reduce((a, mu) => a + ((it.credits || {})[mu] || 0), 0)) >= 1) || null;

/** the first bench plan (stairway, straight sets) for which `find` returns a place to break */
function findPlan(find, want = () => true) {
  for (const { file } of intakes) {
    const plan = planOf(file);
    if (plan.status !== 'ok' || !plan.weeks.length || plan.weeks[0].block_type !== 'stairway' || plan.weeks[0].circuit || !want(plan)) continue;
    const base = scorePlan(plan, ctx, {});
    const at = find(plan, base);
    if (at) return { file, plan, base, at };
  }
  return null;
}
const trainedOf = (plan) => ((plan.time_check || {}).trained_groups || []).filter(g => g !== 'calves');

console.log('scorer self-test (plans generated in memory from design/bench/intakes)');

// ---- A2: a trained group under its floor in one week
{
  const hit = findPlan((plan, base) => {
    if (count(base, 'floor_misses')) return null;
    const g = trainedOf(plan)[0]; if (!g) return null;
    return { g, week: 3 };
  }, plan => plan.weeks.length >= 6);
  if (!hit) check('A2 floor_misses: a plan to break was found', false);
  else {
    const p = clone(hit.plan); const w = p.weeks[hit.at.week - 1];
    for (const d of w.days) if (d.kind === 'main') for (const b of d.blocks) b.items = b.items.filter(it => !(isRes(it) && primeGroup(it) === hit.at.g));
    const s = scorePlan(p, ctx, {});
    check('A2 floor_misses: ' + hit.file + ', every ' + hit.at.g + ' exercise removed from week ' + hit.at.week + ' -> a floor miss at (week ' + hit.at.week + ', ' + hit.at.g + ')', has(s, 'floor_misses', v => v.week === hit.at.week && v.group === hit.at.g), 'count ' + count(s, 'floor_misses'));
    check('A2 floor_misses: only that week is reported for ' + hit.at.g, (s.metrics.floor_misses.violations || []).filter(v => v.group === hit.at.g).every(v => v.week === hit.at.week));
    check('A6 set_drops: the same break is a drop of ' + hit.at.g + ' in week ' + hit.at.week, has(s, 'set_drops', v => v.week === hit.at.week && (v.group === hit.at.g || v.kind === 'exercise_removed')));
  }
}

// ---- A5: a trained group squeezed to one exercise on one day
{
  const hit = findPlan((plan) => {
    const tr = trainedOf(plan);
    const w = plan.weeks[3]; if (!w) return null;
    for (const d of w.days) { if (d.kind !== 'main' || d.format === 'circuit') continue; for (const g of tr) { const its = items(d).filter(it => isRes(it) && primeGroup(it) === g && it.role !== 'test'); if (its.length === 2) return { week: w.n, weekday: d.weekday, g, drop: its[1].slot_id }; } }
    return null;
  }, plan => !['strength'].includes(plan.meta.family));
  if (!hit) check('A5 one_exercise_groups: a plan to break was found', false);
  else {
    const p = clone(hit.plan); const d = p.weeks[hit.at.week - 1].days.find(x => x.weekday === hit.at.weekday);
    for (const b of d.blocks) b.items = b.items.filter(it => it.slot_id !== hit.at.drop);
    const s = scorePlan(p, ctx, {});
    check('A5 one_exercise_groups: ' + hit.file + ', ' + hit.at.drop + ' removed in week ' + hit.at.week + ' -> ' + hit.at.g + ' has 1 exercise on ' + hit.at.weekday, has(s, 'one_exercise_groups', v => v.week === hit.at.week && v.weekday === hit.at.weekday && v.group === hit.at.g && v.kind === 'trained_group_squeezed'));
    check('A5 one_exercise_groups: exactly one more than before', count(s, 'one_exercise_groups') === count(hit.base, 'one_exercise_groups') + 1, count(hit.base, 'one_exercise_groups') + ' -> ' + count(s, 'one_exercise_groups'));
  }
}

// ---- A7: a flat week that sets could have avoided
{
  const hit = findPlan((plan, base) => {
    const t = plan.weeks.map(w => w.total_resistance_sets); const N = t.length;
    if (N < 8 || count(base, 'flat_weeks_excess') || t[N - 1] - t[0] < N + 2) return null;
    for (let i = 3; i < N - 2; i++) if (t[i] > t[i - 1] && plan.weeks[i].exercise_block === plan.weeks[i - 1].exercise_block && !plan.weeks[i].test) return { week: i + 1 };
    return null;
  }, plan => plan.shape.training_blocks.length === 1);
  if (!hit) check('A7 flat_weeks_excess: a plan to break was found', false);
  else {
    const p = clone(hit.plan); const i = hit.at.week - 1;
    p.weeks[i].days = clone(p.weeks[i - 1].days);   // week i repeats week i-1: one flat week, the block still adds more than N - 1 sets
    const s = scorePlan(p, ctx, {});
    check('A7 flat_weeks_excess: ' + hit.file + ', week ' + hit.at.week + ' made a copy of week ' + (hit.at.week - 1) + ' -> 1 avoidable flat week', count(s, 'flat_weeks_excess') === 1, 'count ' + count(s, 'flat_weeks_excess'));
    check('A7: the main-day total is flat in the same week', count(s, 'main_flat_weeks_excess') >= 1);
  }
}

// ---- A10 / A11 / A12: a day over the minutes; and the same day once the plan tells it with an offer
{
  const hit = findPlan((plan, base) => {
    const w = plan.weeks[4]; if (!w) return null;
    const d = w.days.find(x => x.kind === 'main' && x.est_minutes <= x.minutes_limit && !items(x).some(it => it.test));
    return d && !has(base, 'days_over_unwarned', v => v.week === w.n && v.weekday === d.weekday) ? { week: w.n, weekday: d.weekday, limit: d.minutes_limit } : null;
  });
  if (!hit) check('A10 days_over_unwarned: a plan to break was found', false);
  else {
    const at = hit.at;
    const p = clone(hit.plan); const d = p.weeks[at.week - 1].days.find(x => x.weekday === at.weekday);
    d.est_minutes = at.limit + 4;
    let s = scorePlan(p, ctx, {});
    check('A10 days_over_unwarned: ' + hit.file + ', ' + at.weekday + ' of week ' + at.week + ' printed at ' + (at.limit + 4) + ' of ' + at.limit + ' min -> reported there', has(s, 'days_over_unwarned', v => v.week === at.week && v.weekday === at.weekday && v.value === at.limit + 4));
    check('A10: exactly one more day than before', count(s, 'days_over_unwarned') === count(hit.base, 'days_over_unwarned') + 1);
    check('A11 days_over_band: 4 min over is inside the 10 % band', !has(s, 'days_over_band', v => v.week === at.week && v.weekday === at.weekday));
    check('A12 minutes_recost_gap: the printed minutes no longer match the items', has(s, 'minutes_recost_gap', v => v.week === at.week && v.weekday === at.weekday));
    d.est_minutes = Math.ceil(at.limit * 1.1) + 1;
    s = scorePlan(p, ctx, {});
    check('A11 days_over_band: printed at ' + d.est_minutes + ' min -> above the band, reported there', has(s, 'days_over_band', v => v.week === at.week && v.weekday === at.weekday));
    // told: time_check.overrun lists the day with a cause, and an offer removes it
    d.est_minutes = at.limit + 4;
    p.time_check.overrun = [{ weekday: at.weekday, minutes: 4, cause: 'kept_movements' }];
    p.offers = [...(p.offers || []), { key: 'offer.longer_sessions_adds', kind: 'longer_sessions', schedule: { days: p.meta.days_per_week, minutes: Math.min(120, at.limit + 15) }, adds: [], trades: [], args: {} }];
    s = scorePlan(p, ctx, {});
    check('A10: the same day listed in time_check.overrun with an offer is not counted', !has(s, 'days_over_unwarned', v => v.week === at.week && v.weekday === at.weekday));
    delete p.time_check.overrun[0].cause;
    s = scorePlan(p, ctx, {});
    check('A17 unexplained_decisions: an overrun without a cause is reported', has(s, 'unexplained_decisions', v => v.weekday === at.weekday && /cause/.test(v.msg)));
  }
}

// ---- A13: more resistance exercises on a full-body day than the budget
{
  const cap = raw.rules.session.exercise_cap_by_minutes;
  const hit = findPlan((plan, base) => {
    const w = plan.weeks[1]; if (!w) return null;
    const d = w.days.find(x => x.kind === 'main' && x.full_body && x.format !== 'circuit' && typeof cap[String(x.minutes_limit)] === 'number' && items(x).filter(isRes).length >= 2);
    return d && !has(base, 'exbudget_over', v => v.week === w.n && v.weekday === d.weekday) ? { week: w.n, weekday: d.weekday, cap: cap[String(d.minutes_limit)] } : null;
  });
  if (!hit) check('A13 exbudget_over: a plan to break was found', false);
  else {
    const at = hit.at;
    const p = clone(hit.plan); const d = p.weeks[at.week - 1].days.find(x => x.weekday === at.weekday);
    const blk = d.blocks.find(b => b.items.some(isRes));
    const proto = blk.items.find(isRes);
    let n = items(d).filter(isRes).length, k = 0;
    while (n <= at.cap + 1) { blk.items.push({ ...clone(proto), slot_id: proto.slot_id + '.extra' + (++k), superset: null, superset_suggested: null, test: null }); n++; }
    const s = scorePlan(p, ctx, {});
    check('A13 exbudget_over: ' + hit.file + ', ' + k + ' exercise(s) added to ' + at.weekday + ' of week ' + at.week + ' (' + n + ' against cap ' + at.cap + ' + 1) -> reported there', has(s, 'exbudget_over', v => v.week === at.week && v.weekday === at.weekday && v.value === n));
    check('T8 near_duplicates: the copied exercise is seen twice in the session', has(s, 'near_duplicates', v => v.week === at.week && v.weekday === at.weekday));
  }
}

// ---- A6: an exercise loses a set; a trained group that never climbs
{
  const hit = findPlan((plan, base) => {
    if (has(base, 'set_drops', v => v.week === 6)) return null;
    const w = plan.weeks[5], v = plan.weeks[4]; if (!w || !v || w.exercise_block !== v.exercise_block) return null;
    for (const d of w.days) { if (d.kind !== 'main') continue; const it = items(d).find(x => isRes(x) && x.sets >= 3 && x.role !== 'test' && !items(d).some(y => y.slot_id === x.slot_id + '.test')); if (it) return { week: 6, weekday: d.weekday, slot: it.slot_id }; }
    return null;
  });
  if (!hit) check('A6 set_drops: a plan to break was found', false);
  else {
    const p = clone(hit.plan);
    const it = items(p.weeks[5].days.find(x => x.weekday === hit.at.weekday)).find(x => x.slot_id === hit.at.slot);
    it.sets = 2;
    const s = scorePlan(p, ctx, {});
    check('A6 set_drops: ' + hit.file + ', ' + hit.at.slot + ' cut to 2 sets in week 6 -> the drop is reported on that exercise', has(s, 'set_drops', v => v.week === 6 && v.slot_id === hit.at.slot && v.kind === 'exercise'));
  }
  const hit2 = findPlan((plan, base) => { const g = trainedOf(plan).find(x => !has(base, 'trained_not_climbing', v => v.group === x)); return g ? { g } : null; }, plan => plan.shape.training_blocks.length === 1 && !plan.weeks[0].circuit);
  if (!hit2) check('A6 trained_not_climbing: a plan to break was found', false);
  else {
    const p = clone(hit2.plan); const g = hit2.at.g;
    const w1 = new Map(); for (const d of p.weeks[0].days) for (const it of items(d)) if (isRes(it) && primeGroup(it) === g) w1.set(d.weekday + '|' + it.slot_id.replace(/\.test$/, ''), (w1.get(d.weekday + '|' + it.slot_id.replace(/\.test$/, '')) || 0) + it.sets);
    for (const w of p.weeks.slice(1)) for (const d of w.days) for (const b of d.blocks) {
      b.items = b.items.filter(it => !(isRes(it) && primeGroup(it) === g && (it.role === 'test' || !w1.has(d.weekday + '|' + it.slot_id))));
      for (const it of b.items) if (isRes(it) && primeGroup(it) === g) it.sets = w1.get(d.weekday + '|' + it.slot_id);
    }
    const s = scorePlan(p, ctx, {});
    check('A6 trained_not_climbing: ' + hit2.file + ', ' + g + ' held at its week-1 sets for the whole block -> reported for ' + g, has(s, 'trained_not_climbing', v => v.group === g));
  }
}

// ---- A5 the other way: a kept movement the plan lists is not a one-exercise group
{
  const hit = findPlan((plan, base) => { const v = (base.metrics.one_exercise_groups && base.metrics.one_exercise_groups.violations || []).find(x => x.kind === 'kept_movement_not_listed'); return v ? { slot: v.slot_id, weekday: v.weekday, g: v.group } : null; });
  if (!hit) console.log('  skip  A5 listing: no plan of the corpus holds a kept-movement station (origin pattern_kept)');
  else {
    const p = clone(hit.plan);
    const before = (hit.base.metrics.one_exercise_groups.violations || []).filter(v => v.slot_id === hit.at.slot).length;
    p.time_check.pattern_stations = [{ group: hit.at.g, weekday: hit.at.weekday, slot_id: hit.at.slot, kind: 'keep' }];
    const s = scorePlan(p, ctx, {});
    const after = ((s.metrics.one_exercise_groups || {}).violations || []).filter(v => v.slot_id === hit.at.slot).length;
    const constant2 = p.weeks.every(w => w.days.every(d => items(d).filter(it => it.slot_id === hit.at.slot).every(it => it.sets === 2)));
    check('A5 listing: ' + hit.file + ', ' + hit.at.slot + ' listed in time_check.pattern_stations -> ' + (constant2 ? 'no longer counted (' + before + ' -> 0)' : 'still counted (its sets are not a constant 2)'), constant2 ? after === 0 && before > 0 : after === before);
  }
}

// ---- A8: one progression fact per trained group and week
{
  const hit = findPlan((plan, base) => (count(base, 'progression_missing') ? {} : null), plan => plan.shape.training_blocks.length === 1);
  if (!hit) check('A8 progression_missing: a plan without weeks[].progression was found', false);
  else {
    const p = clone(hit.plan);
    for (const w of p.weeks.slice(1)) w.progression = (p.time_check.trained_groups || []).map(g => ({ group: g, dimension: 'effort' }));
    let s = scorePlan(p, ctx, {});
    check('A8 progression_missing: ' + hit.file + ' has ' + count(hit.base, 'progression_missing') + ' missing; with one entry per trained group and week -> 0', count(s, 'progression_missing') === 0);
    p.weeks[4].progression.push({ group: p.time_check.trained_groups[0], dimension: 'reps' });
    s = scorePlan(p, ctx, {});
    check('A8: two entries for one group in week 5 -> 1 (the rule is exactly one)', count(s, 'progression_missing') === 1 && has(s, 'progression_missing', v => v.week === 5));
  }
}

// ---- A22, DEF-02, DEF-09
{
  const { file } = intakes[0]; const plan = planOf(file);
  check('A22 determinism: reported when the runner says the bytes differ', count(scorePlan(plan, ctx, { determinism: false }), 'determinism') === 1 && count(scorePlan(plan, ctx, { determinism: true }), 'determinism') === 0);
  const p = clone(plan); const d = p.weeks[0].days.find(x => x.kind === 'main'); const it = items(d).find(isRes);
  it.credits = { ...it.credits, biceps: 1 };
  const s = scorePlan(p, ctx, {});
  check('DEF-02 credit_class_mismatch: a credit that is not the class\'s is reported on its item', has(s, 'credit_class_mismatch', v => v.slot_id === it.slot_id));
  check('DEF-04 credit_tally_mismatch: the week\'s printed tallies no longer match the items', has(s, 'credit_tally_mismatch', v => v.week === 1));
  // the re-cost of a day is the sum of its parts and is stable
  const X = scorePlan(plan, ctx, {});
  check('scorePlan is a pure function: two calls give the same sheet', JSON.stringify(X) === JSON.stringify(scorePlan(plan, ctx, {})));
  check('recostDay is exported for tools (' + typeof recostDay + ')', typeof recostDay === 'function');
}

// ---- named parameters change the verdict, and only named parameters do
{
  const hit = findPlan((plan, base) => (count(base, 'floor_misses') === 0 && trainedOf(plan).length ? {} : null));
  if (hit) {
    const s = scorePlan(hit.plan, ctx, { params: { floor: 99 } });
    check('parameters: floor = 99 makes every trained group-week a floor miss (' + hit.file + ')', count(s, 'floor_misses') === s.metrics.floor_misses.checked && count(s, 'floor_misses') > 0);
    let threw = false; try { scorePlan(hit.plan, ctx, { params: { not_a_parameter: 1 } }); } catch { threw = true; }
    check('parameters: an unknown parameter name is refused', threw);
  }
}

// ---- the objective: a group left out for time costs points, less than a group trained under its floor
{
  const hit = findPlan((plan, base) => (count(base, 'floor_misses') === 0 && trainedOf(plan).length >= 3 ? { g: trainedOf(plan)[0] } : null), plan => plan.shape.training_blocks.length === 1);
  if (hit) {
    const g = hit.at.g;
    const honest = clone(hit.plan);   // g is not trained and the plan says so: its exercises leave, it is listed for time
    for (const w of honest.weeks) for (const d of w.days) for (const b of d.blocks) b.items = b.items.filter(it => !(isRes(it) && primeGroup(it) === g));
    for (const tc of [honest.time_check, ...(honest.time_check.by_block || [])]) { tc.trained_groups = tc.trained_groups.filter(x => x !== g); tc.not_trained_directly = [...(tc.not_trained_directly || []), { group: g, reason: 'time' }]; }
    const under = clone(hit.plan);    // g stays "trained" with half its exercises: under the floor
    for (const w of under.weeks) for (const d of w.days) for (const b of d.blocks) { let k = 0; b.items = b.items.filter(it => !(isRes(it) && primeGroup(it) === g && (k++ % 2 === 0))); }
    const sh = scorePlan(honest, ctx, {}), su = scorePlan(under, ctx, {});
    check('objective groups_out_for_time: ' + hit.file + ', ' + g + ' listed as out for time -> counted once', count(sh, 'groups_out_for_time') === count(hit.base, 'groups_out_for_time') + 1 && has(sh, 'groups_out_for_time', v => v.group === g));
    check('objective: it costs points (' + hit.base.metrics.groups_out_for_time.lost + ' -> ' + sh.metrics.groups_out_for_time.lost + ')', sh.metrics.groups_out_for_time.lost > hit.base.metrics.groups_out_for_time.lost);
    check('objective: leaving ' + g + ' out and saying so loses fewer points on floors and the objective together than training it under the floor (' + (sh.metrics.groups_out_for_time.lost + ((sh.metrics.floor_misses || {}).lost || 0)).toFixed(2) + ' against ' + (su.metrics.groups_out_for_time.lost + ((su.metrics.floor_misses || {}).lost || 0)).toFixed(2) + ')', count(su, 'floor_misses') > 0 && sh.metrics.groups_out_for_time.lost + ((sh.metrics.floor_misses || {}).lost || 0) < su.metrics.groups_out_for_time.lost + ((su.metrics.floor_misses || {}).lost || 0));
  }
}

console.log('\n' + passed + ' passed, ' + failed + ' failed');
process.exit(failed ? 1 : 0);
