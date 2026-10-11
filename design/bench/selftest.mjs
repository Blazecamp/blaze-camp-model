#!/usr/bin/env node
// design/bench/selftest.mjs - does the scorer see what it claims to see? (scorer 2.x, engine 0.5; the scorer 2.1 readings of work package V4 are tested in tests/v05-integrate.test.mjs)
//
// Takes plans the engine generates in memory for bench intakes and samples, breaks ONE thing by hand on a known week, day and
// group, and checks that the scorer reports that thing at that place - one break per v0.5 rule of design/ENGINE_V05_PLAN.md
// "V3 words and checks" (the template skeleton, exercise counts, the final sets and their arrival week, the floor from 3 training
// days, the 2-day rule, optional add-ons, incline first, the liability gate, video links, the progression rule, the acceleration
// note, carries, the easy-to-remove list, and 'no time fitting'). It also checks that no metric is about minutes any more.
// Writes nothing. Exit code 1 when a check fails.   Usage: node design/bench/selftest.mjs
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import * as SCORE from './score.mjs';

const { makeContext, scorePlan, METRICS, ACCEPTANCE } = SCORE;
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
const ctx = makeContext({ rules: raw.rules, catalog: raw.catalog, templates: raw.templates, profiles: raw.profiles });

const dirs = [path.join(HERE, 'intakes'), path.join(ROOT, 'samples', 'intakes')];
const intakes = dirs.flatMap(d => fs.readdirSync(d).filter(f => f.endsWith('.json')).sort().map(f => ({ file: f, intake: readJSON(path.join(d, f)) })));
const plans = new Map();
const planOf = (file) => { if (!plans.has(file)) plans.set(file, generate(clone(intakes.find(x => x.file === file).intake), model)); return plans.get(file); };

let failed = 0, passed = 0;
const check = (name, ok, detail) => { if (ok) { passed++; console.log('  ok    ' + name); } else { failed++; console.log('  FAIL  ' + name + (detail ? '   ' + detail : '')); } };
const count = (sheet, id) => (sheet.metrics[id] ? (sheet.metrics[id].violations || []).length + (sheet.metrics[id].violations_truncated || 0) : 0);
const has = (sheet, id, pred = () => true) => !!(sheet.metrics[id] && (sheet.metrics[id].violations || []).some(pred));
const itemsOf = (day) => day.blocks.flatMap(b => b.items);
const dayOf = (plan, week, weekday) => plan.weeks[week - 1].days.find(d => d.weekday === weekday);
const members = raw.rules.muscles.groups.members;
const primeGroup = (it) => Object.keys(members).find(g => g !== 'core' && Math.min(1, members[g].reduce((a, mu) => a + ((it.credits || {})[mu] || 0), 0)) >= 1) || null;
const exOf = (id) => raw.catalog.exercises.find(e => e.id === id) || null;
const stair = (plan) => (plan.meta.stairway || [])[0] || {};

/** the first generated plan (stairway, straight sets) for which `find` returns a place to break */
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
const skeletonDay = (plan, re) => plan.weeks[0].days.find(d => d.kind === 'main' && re.test(String(d.skeleton || '')));
const none = (name) => check(name + ': a plan to break was found', false);

console.log('scorer self-test (plans generated in memory from design/bench/intakes and samples/intakes)');

// ---- CT-01 / R4-SES-01: no metric is about minutes; a plan that still carries time fitting is reported
{
  const words = METRICS.filter(m => /minute|session length|est_minutes|over the chosen|time check\b(?! , )/i.test(m.what + ' ' + m.unit) && m.id !== 'time_fields');
  check('CT-01: no metric reads minutes (' + METRICS.length + ' metrics)', words.length === 0, words.map(m => m.id).join(', '));
  check('CT-01: the re-cost of a day is gone from the scorer\'s exports', !('recostDay' in SCORE) && !('explainDay' in SCORE));
  const src = fs.readFileSync(path.join(HERE, 'score.mjs'), 'utf8').split('\n').filter(l => !/^\s*(\/\/|\*|\/\*)/.test(l)).join('\n');
  check('CT-01: score.mjs never reads est_minutes, a minute limit or the time model', !/est_minutes|D\.limit|time_model|minutes_allowed|exercise_cap_by_minutes/.test(src));
  const hit = findPlan(() => true);
  const p = clone(hit.plan);
  p.meta.session_minutes = 60; p.time_check = { fits: true }; p.weeks[0].days.find(d => d.kind === 'main').minutes_limit = 60;
  const s = scorePlan(p, ctx, {});
  check('CT-01 time_fields: a generated plan carries none (' + hit.file + ')', count(hit.base, 'time_fields') === 0);
  check('CT-01 time_fields: a session length, a time check and a day limit put back -> 3 reported, A7 fails', count(s, 'time_fields') === 3 && s.acceptance.A7.pass === false, 'got ' + count(s, 'time_fields'));
}

// ---- R4-SES-05: the coach's skeleton, slot for slot
{
  const hit = findPlan((plan) => { const d = skeletonDay(plan, /^gym_A$/); return d ? { weekday: d.weekday } : null; });
  if (!hit) none('R4-SES-05 skeleton_mismatch');
  else {
    const wd = hit.at.weekday;
    check('R4-SES-05 skeleton_mismatch: the generated plan follows its template (' + hit.file + ')', count(hit.base, 'skeleton_mismatch') === 0, JSON.stringify((hit.base.metrics.skeleton_mismatch || {}).violations || []).slice(0, 200));
    let p = clone(hit.plan);
    const b3 = dayOf(p, 3, wd).blocks.find(b => b.kind === 'strength');
    const rp = b3.items.filter(it => /^RP_/.test(it.bucket) && it.origin === 'template');
    const i0 = b3.items.indexOf(rp[0]), i1 = b3.items.indexOf(rp[1]);
    [b3.items[i0], b3.items[i1]] = [b3.items[i1], b3.items[i0]];
    let s = scorePlan(p, ctx, {});
    check('R4-SES-05: the squat moved in front of the row on ' + wd + ' of week 3 -> out of the coach\'s order, at that day', has(s, 'skeleton_mismatch', v => v.week === 3 && v.weekday === wd && v.kind === 'slot_order') && !has(s, 'skeleton_mismatch', v => v.week !== 3));
    p = clone(hit.plan);
    const row = itemsOf(dayOf(p, 2, wd)).find(it => it.bucket === 'RP_HPULL' && it.origin === 'template');
    row.bucket = 'RP_HPUSH';
    s = scorePlan(p, ctx, {});
    check('R4-SES-05: a press in the row\'s slot of an A day (pull + knee) in week 2 -> slot_pattern at that item', has(s, 'skeleton_mismatch', v => v.week === 2 && v.weekday === wd && v.kind === 'slot_pattern' && v.slot_id === row.slot_id));
    p = clone(hit.plan);
    dayOf(p, 1, wd).skeleton = 'gym_B';
    s = scorePlan(p, ctx, {});
    check('R4-SES-05: a day that names another skeleton than its template\'s -> reported, A3 fails', has(s, 'skeleton_mismatch', v => v.week === 1 && v.weekday === wd && v.kind === 'skeleton_not_named') && s.acceptance.A3.pass === false);
    // a template that is not the coach's day: the scorer reads the template itself
    const t2 = clone(raw.templates);
    const [fam, days] = hit.plan.meta.template.id.split('.');
    const dts = hit.plan.meta.template.variant ? t2.families[fam].days[days].variants[hit.plan.meta.template.variant].day_types : t2.families[fam].days[days].day_types;
    const dtA = dts[dayOf(hit.plan, 1, wd).day_type] || t2.families[fam].days[days].day_types[dayOf(hit.plan, 1, wd).day_type];
    const sq = dtA.stations.find(x => x.bucket === 'RP_BKD'), rw = dtA.stations.find(x => x.bucket === 'RP_HPULL');
    sq.bucket = 'RP_HPULL'; rw.bucket = 'RP_BKD';
    const s2 = scorePlan(hit.plan, makeContext({ rules: raw.rules, catalog: raw.catalog, templates: t2, profiles: raw.profiles }), {});
    check('R4-SES-05: a template A day that opens with the squat is not the coach\'s Day A -> template_not_the_coachs', has(s2, 'skeleton_mismatch', v => v.kind === 'template_not_the_coachs'));
  }
}

// ---- R4-SES-04: nothing dropped
{
  const hit = findPlan((plan) => { const d = skeletonDay(plan, /^gym_A$/); const it = d && itemsOf(d).find(x => x.bucket === 'ISO_QUAD' && x.origin === 'template'); return it ? { weekday: d.weekday, station: it.station_id } : null; });
  if (!hit) none('R4-SES-04 template_lift_missing');
  else {
    const p = clone(hit.plan);
    for (const b of dayOf(p, 2, hit.at.weekday).blocks) b.items = b.items.filter(it => it.station_id !== hit.at.station);
    const s = scorePlan(p, ctx, {});
    check('R4-SES-04 template_lift_missing: ' + hit.file + ', the leg extension taken off ' + hit.at.weekday + ' of week 2 -> reported at that day', count(hit.base, 'template_lift_missing') === 0 && has(s, 'template_lift_missing', v => v.week === 2 && v.weekday === hit.at.weekday && v.station === hit.at.station));
    dayOf(p, 2, hit.at.weekday).why.push({ key: 'why.left_out_exclusion', ref: 'F38', args: { reason: 'machines' } });
    check('R4-SES-04: the same day stating a reason (an exclusion) is not counted', !has(scorePlan(p, ctx, {}), 'template_lift_missing', v => v.week === 2 && v.weekday === hit.at.weekday));
    const q = clone(hit.plan);
    const d1 = dayOf(q, 1, hit.at.weekday);
    const work = itemsOf(d1).find(it => it.role === 'work');
    d1.easy_to_remove = [...(d1.easy_to_remove || []), { slot_id: work.slot_id, kind: 'small_muscle_accessory' }];
    check('R4-SES-04 easy_to_remove_invalid: a main lift on the easy-to-remove list -> reported at that item', has(scorePlan(q, ctx, {}), 'easy_to_remove_invalid', v => v.week === 1 && v.slot_id === work.slot_id && v.kind === 'always_keep'));
  }
}

// ---- R4-SES-02: the session's exercise count
{
  const hit = findPlan((plan) => { const d = plan.weeks[1].days.find(x => x.kind === 'main'); return d && plan.meta.session_size ? { weekday: d.weekday, max: plan.meta.session_size.range[1] } : null; });
  if (!hit) none('R4-SES-02 session_size_over');
  else {
    const p = clone(hit.plan);
    const d = dayOf(p, 2, hit.at.weekday);
    const acc = d.blocks.find(b => b.kind === 'accessories') || d.blocks.find(b => b.kind === 'strength');
    const src = acc.items[acc.items.length - 1];
    const before = scorePlan(hit.plan, ctx, {}).metrics.session_size_over.detail.most_counted_on_one_day;
    for (let k = 0; k <= hit.at.max; k++) acc.items.push({ ...clone(src), slot_id: src.slot_id + '.x' + k, station_id: null, origin: 'bonus' });
    const s = scorePlan(p, ctx, {});
    check('R4-SES-02 session_size_over: ' + hit.file + ' holds at most ' + before + ' counted exercises (range max ' + hit.at.max + '); ' + (hit.at.max + 1) + ' more on ' + hit.at.weekday + ' of week 2 -> reported at that day', count(hit.base, 'session_size_over') === 0 && has(s, 'session_size_over', v => v.week === 2 && v.weekday === hit.at.weekday && v.value > hit.at.max) && s.acceptance.A4.pass === false);
    p.edited = true;
    check('CX-04: an edited plan is not judged by the session size', count(scorePlan(p, ctx, {}), 'session_size_over') === 0);
  }
}

// ---- CX-01 / R4-PRG-01: the final sets are reached, arriving in the last week (one week early at most)
{
  const hit = findPlan((plan) => {
    const st = stair(plan); const N = plan.weeks.filter(w => w.training_block === 1).length;
    const g = (st.groups || []).find(x => x !== 'calves' && (st.group_top || {})[x] >= (st.group_start || {})[x] + 3);
    return g && N >= 8 ? { g, N } : null;
  });
  if (!hit) none('CX-01 target_not_reached');
  else {
    const { g, N } = hit.at;
    let p = clone(hit.plan);
    const last = p.weeks[N - 1];
    const it = last.days.flatMap(itemsOf).find(x => primeGroup(x) === g && x.sets >= 3 && x.role !== 'test');
    it.sets -= 2;
    let s = scorePlan(p, ctx, {});
    check('CX-01 target_not_reached: ' + hit.file + ', 2 sets off a ' + g + ' exercise in the last week -> ' + g + ' ends under its planned final sets', count(hit.base, 'target_not_reached') === 0 && has(s, 'target_not_reached', v => v.group === g) && s.acceptance.A5.pass === false);
    check('CX-01 below_schedule: the same week sits under the planned schedule, at week ' + N, has(s, 'below_schedule', v => v.week === N && v.group === g && v.kind === 'under'));
    p = clone(hit.plan);
    const sc = p.meta.stairway[0].schedule[g];
    const top = sc[N - 1];
    for (let i = 3; i < N; i++) { sc[i] = top; p.weeks[i].target_by_group[g] = top; }
    s = scorePlan(p, ctx, {});
    check('R4-PRG-01 arrival_early: a schedule that reaches ' + top + ' in week 4 of ' + N + ' -> ' + (N - 4) + ' weeks early, reported for ' + g, has(s, 'arrival_early', v => v.group === g && v.value === N - 4));
    p = clone(hit.plan);
    const sc2 = p.meta.stairway[0].schedule[g];
    sc2[N - 2] = sc2[N - 1]; p.weeks[N - 2].target_by_group[g] = sc2[N - 1];
    check('R4-PRG-01: arriving one week early is fine', !has(scorePlan(p, ctx, {}), 'arrival_early', v => v.group === g));
  }
}

// ---- floor of 10 from 3 training days; R4-SES-03 the 2-day rule
{
  const hit = findPlan((plan) => {
    if (plan.meta.days_per_week < 3) return null;
    const st = stair(plan);
    const g = (st.groups || []).find(x => !['calves', 'hips'].includes(x) && !(st.below_floor || []).includes(x) && !(plan.meta.targets.pain_muscles || []).length);
    return g ? { g, week: 4 } : null;
  });
  if (!hit) none('floor_misses');
  else {
    const p = clone(hit.plan);
    for (const d of p.weeks[hit.at.week - 1].days) for (const b of d.blocks) b.items = b.items.filter(it => primeGroup(it) !== hit.at.g);
    const s = scorePlan(p, ctx, {});
    check('floor_misses (3+ days): ' + hit.file + ', every ' + hit.at.g + ' exercise removed from week ' + hit.at.week + ' -> a floor miss at (week ' + hit.at.week + ', ' + hit.at.g + ')', count(hit.base, 'floor_misses') === 0 && has(s, 'floor_misses', v => v.week === hit.at.week && v.group === hit.at.g) && s.acceptance.A2.pass === false);
    check('floor_misses: only that week is reported for ' + hit.at.g, (s.metrics.floor_misses.violations || []).filter(v => v.group === hit.at.g).every(v => v.week === hit.at.week));
    check('set_drops: the same break is a drop of ' + hit.at.g + ' in week ' + hit.at.week, has(s, 'set_drops', v => v.week === hit.at.week && v.group === hit.at.g));
    p.meta.stairway[0].below_floor.push(hit.at.g);
    p.meta.warnings.push({ code: 'below_floor_template', key: 'warning.below_floor_template', args: { group: hit.at.g, held: 0, floor: 10 } });
    const s3 = scorePlan(p, ctx, {});
    check('R4-SES-04: the same group SAID to be under the floor is reported (below_floor_deficit), not counted as a miss', !has(s3, 'floor_misses', v => v.group === hit.at.g) && s3.metrics.below_floor_deficit && s3.metrics.below_floor_deficit.value > 0);
  }
  const two = findPlan((plan) => {
    if (plan.meta.days_per_week !== 2 || !plan.meta.two_day) return null;
    const st = stair(plan);
    const g = (st.groups || []).find(x => ['quads', 'back', 'chest'].includes(x) && !(st.below_floor || []).includes(x));
    return g ? { g } : null;
  });
  if (!two) none('R4-SES-03 two_day_rule_misses');
  else {
    const g = two.at.g;
    const w1 = two.plan.weeks[0].weekly_sets_by_group;
    check('R4-SES-03: ' + two.file + ' (2 days) trains its big groups at 6-8 weekly sets (' + g + ' ' + w1[g] + ') with no floor miss and no 2-day miss', count(two.base, 'floor_misses') === 0 && count(two.base, 'two_day_rule_misses') === 0 && w1[g] >= 6 && w1[g] <= 8.75);
    let p = clone(two.plan);
    for (const d of p.weeks[2].days) for (const b of d.blocks) for (const it of b.items) if (primeGroup(it) === g && typeof it.sets === 'number') it.sets = 1;
    let s = scorePlan(p, ctx, {});
    check('R4-SES-03 two_day_rule_misses: ' + g + ' cut to 1 set an exercise in week 3 -> under 6, reported at (week 3, ' + g + ')', has(s, 'two_day_rule_misses', v => v.week === 3 && v.group === g && v.kind === 'under'));
    p = clone(two.plan); p.meta.warnings = p.meta.warnings.filter(w => w.code !== 'two_day_rule');
    s = scorePlan(p, ctx, {});
    check('R4-SES-03: a 2-day plan that does not say the rule -> reported', has(s, 'two_day_rule_misses', v => v.kind === 'not_said'));
    p = clone(two.plan); p.meta.two_day.suggest_days = 2;
    check('R4-SES-03: a 2-day plan that does not suggest a third day -> reported', has(scorePlan(p, ctx, {}), 'two_day_rule_misses', v => v.kind === 'no_third_day'));
  }
}

// ---- R4-SES-04: what the template caps is said
{
  // (scorer 2.2: the up-front notice is kept for a Focus group, a group under its level's start and a big group under 80 % -
  // capped[].notice; every other capped group is named by the week-by-week table)
  const hit = findPlan((plan) => { const c = (stair(plan).capped || []).find(x => x.notice !== false && (plan.meta.warnings || []).some(w => w.code === 'capped_by_template' && w.args && w.args.group === x.group)); return c ? { g: c.group } : null; });
  {
    const quiet = findPlan((plan) => { const c = (stair(plan).capped || []).find(x => x.notice === false); return c ? { g: c.group } : null; });
    if (!quiet) none('CX-04 capped group named by the table only');
    else {
      check('CX-04: ' + quiet.file + ', a capped group the table names (notice: false) is not an unsaid cap', !has(quiet.base, 'unsaid_cap', v => v.group === quiet.at.g));
      const q = clone(quiet.plan);
      for (const c of q.meta.stairway[0].capped) if (c.group === quiet.at.g) delete c.notice;
      check('CX-04: the same group without its notice flag and without a notice -> reported', has(scorePlan(q, ctx, {}), 'unsaid_cap', v => v.group === quiet.at.g));
    }
  }
  if (!hit) none('R4-SES-04 unsaid_cap');
  else {
    const p = clone(hit.plan);
    p.meta.warnings = p.meta.warnings.filter(w => !(w.code === 'capped_by_template' && w.args.group === hit.at.g));
    const s = scorePlan(p, ctx, {});
    check('R4-SES-04 unsaid_cap: ' + hit.file + ', the notice that names the capped ' + hit.at.g + ' removed -> reported for ' + hit.at.g, count(hit.base, 'unsaid_cap') === 0 && has(s, 'unsaid_cap', v => v.group === hit.at.g) && s.acceptance.A11.pass === false);
    const q = clone(hit.plan);
    q.meta.stairway[0].capped = q.meta.stairway[0].capped.filter(c => c.group !== hit.at.g);
    check('R4-SES-04: the group dropped from the capped list while it ends under its planned final sets -> reported', has(scorePlan(q, ctx, {}), 'unsaid_cap', v => v.group === hit.at.g));
  }
}

// ---- R4-PRG-02: the acceleration note; R4-PRG-03: the progression rule
{
  const hit = findPlan((plan) => { const w = plan.weeks.find(x => (x.acceleration || []).some(a => a.group)); return w ? { week: w.n, g: w.acceleration.find(a => a.group).group } : null; });
  if (!hit) none('R4-PRG-02 acceleration_unnoted');
  else {
    const p = clone(hit.plan);
    p.weeks[hit.at.week - 1].acceleration = [];
    const s = scorePlan(p, ctx, {});
    check('R4-PRG-02 acceleration_unnoted: ' + hit.file + ', week ' + hit.at.week + ' adds more than about 15 % for ' + hit.at.g + '; its note removed -> reported at (week ' + hit.at.week + ', ' + hit.at.g + ')', count(hit.base, 'acceleration_unnoted') === 0 && has(s, 'acceleration_unnoted', v => v.week === hit.at.week && v.group === hit.at.g) && s.acceptance.A8.pass === false);
  }
  const pr = findPlan((plan) => { const d = plan.weeks[0].days.find(x => x.kind === 'main'); const it = d && itemsOf(d).find(x => x.progression && x.progression.kind === 'double_progression'); return it ? { weekday: d.weekday, slot: it.slot_id } : null; });
  if (!pr) none('R4-PRG-03 progression_rule_missing');
  else {
    let p = clone(pr.plan);
    itemsOf(dayOf(p, 1, pr.at.weekday)).find(x => x.slot_id === pr.at.slot).progression = null;
    let s = scorePlan(p, ctx, {});
    check('R4-PRG-03 progression_rule_missing: ' + pr.file + ', the rule taken off ' + pr.at.slot + ' -> reported at that item', count(pr.base, 'progression_rule_missing') === 0 && has(s, 'progression_rule_missing', v => v.week === 1 && v.slot_id === pr.at.slot && v.kind === 'missing'));
    p = clone(pr.plan);
    const it = itemsOf(dayOf(p, 1, pr.at.weekday)).find(x => x.slot_id === pr.at.slot);
    it.progression.promised_numbers = true; it.progression.weeks = [{ week: 3, reps: 12 }];
    s = scorePlan(p, ctx, {});
    check('R4-PRG-03: "week 3: 12 reps" promised on an item -> reported as a promise', has(s, 'progression_rule_missing', v => v.slot_id === pr.at.slot && v.kind === 'promise'));
  }
}

// ---- R4-LIB-01 add-ons, R4-LIB-02 carries, R4-LIB-03 incline first, R4-LIB-05 video links
{
  const hit = findPlan((plan) => { const d = plan.weeks[0].days.find(x => x.kind === 'main'); const it = d && itemsOf(d).find(x => x.bucket === 'ISO_CALF'); return it ? { weekday: d.weekday, slot: it.slot_id } : null; });
  if (!hit) none('R4-LIB-01 addon_picks');
  else {
    let p = clone(hit.plan);
    let it = itemsOf(dayOf(p, 1, hit.at.weekday)).find(x => x.slot_id === hit.at.slot);
    it.exercise_id = 'seated-bent-knee-calf-raise-soleus';
    let s = scorePlan(p, ctx, {});
    check('R4-LIB-01 addon_picks: ' + hit.file + ', an optional add-on (the seated soleus raise) put in the calf slot -> reported at that item', count(hit.base, 'addon_picks') === 0 && has(s, 'addon_picks', v => v.week === 1 && v.slot_id === hit.at.slot && v.kind === 'pick') && s.acceptance.A9.pass === false);
    p = clone(hit.plan);
    it = itemsOf(dayOf(p, 1, hit.at.weekday)).find(x => x.slot_id === hit.at.slot);
    const neck = raw.catalog.exercises.find(e => /^proposed/.test(e.status));
    it.swaps = [...(it.swaps || []), neck.id];
    check('R4-LIB-01: a still-proposed record (' + neck.id + ') among the swaps -> reported', has(scorePlan(p, ctx, {}), 'addon_picks', v => v.slot_id === hit.at.slot && v.kind === 'not_shown'));
    p = clone(hit.plan);
    it = itemsOf(dayOf(p, 1, hit.at.weekday)).find(x => x.slot_id === hit.at.slot);
    it.video = { kind: 'observed', url: 'https://youtu.be/abc123' };
    s = scorePlan(p, ctx, {});
    check('R4-LIB-05 video_links: a third-party video link on an item -> reported at that item and as a third-party link', count(hit.base, 'video_links') === 0 && has(s, 'video_links', v => v.slot_id === hit.at.slot) && has(s, 'video_links', v => v.kind === 'third_party'));
    p = clone(hit.plan);
    it = itemsOf(dayOf(p, 1, hit.at.weekday)).find(x => x.slot_id === hit.at.slot);
    it.exercise_id = 'farmer-carry'; it.credits = {};
    s = scorePlan(p, ctx, {});
    check('R4-LIB-02 carry_dose: a farmer carry written in reps -> reported at that item', has(s, 'carry_dose', v => v.slot_id === hit.at.slot && v.kind === 'reps'));
    it.reps = { type: 'distance_or_time', metres: [20, 40], seconds: [20, 40], per_side: false }; it.sets = 3; it.progression = null;
    check('R4-LIB-02: the same carry at 3 trips of 20-40 m or 20-40 s with no credit is fine', !has(scorePlan(p, ctx, {}), 'carry_dose', v => v.slot_id === hit.at.slot));
    it.sets = 6;
    check('R4-LIB-02: 6 trips -> outside 2-4', has(scorePlan(p, ctx, {}), 'carry_dose', v => v.slot_id === hit.at.slot && v.kind === 'trips'));
  }
  const inc = findPlan((plan, base) => (base.facts.incline || []).some(x => x.in_kit && x.picks >= 4 && x.incline * 2 >= x.picks) ? {} : null, (plan) => plan.meta.goal === 'muscle');
  if (!inc) none('R4-LIB-03 incline_share');
  else {
    const p = clone(inc.plan);
    const overhead = raw.catalog.exercises.find(e => (e.slots || []).includes('RP_VPUSH') && (e.tags || []).includes('overhead') && !(e.tags || []).includes('mid_range_push') && e.status === 'live_library_selectable');
    for (const w of p.weeks) for (const d of w.days) for (const it of itemsOf(d)) if (it.bucket === 'RP_VPUSH' && it.origin === 'template' && it.exercise_id) it.exercise_id = overhead.id;
    const s = scorePlan(p, ctx, {});
    check('R4-LIB-03 incline_share: ' + inc.file + ' leads its vertical / mid-range push slot with incline pressing; every pick turned into ' + overhead.id + ' -> reported', count(inc.base, 'incline_share') === 0 && count(s, 'incline_share') >= 1);
  }
}

// ---- R4-SCP-02: the liability gate
{
  const hit = findPlan(() => ({}));
  let p = clone(hit.plan); p.release_stamp.accepted = false;
  let s = scorePlan(p, ctx, {});
  check('R4-SCP-02 liability_gate: ' + hit.file + ' carries an accepted release; accepted = false -> reported, A10 fails', count(hit.base, 'liability_gate') === 0 && count(s, 'liability_gate') === 1 && s.acceptance.A10.pass === false);
  p = clone(hit.plan); p.release_stamp = null;
  s = scorePlan(p, ctx, {});
  check('R4-SCP-02: no release stamp -> liability_gate and refer_or_release_violation', count(s, 'liability_gate') === 1 && count(s, 'refer_or_release_violation') === 1);
  const gate = generate({ ...clone(intakes[0].intake), release: { accepted: false, version: 'release.client', lang: 'en' } }, model);
  const sg = scorePlan(gate, ctx, {});
  check('R4-SCP-02: an intake without the accepted release gives no plan to score (status ' + gate.status + ', ' + gate.weeks.length + ' weeks)', gate.status === 'invalid' && gate.weeks.length === 0 && sg.scored === false);
}

// ---- the plumbing
{
  const hit = findPlan(() => ({}));
  const plan = hit.plan;
  check('determinism: reported when the runner says the bytes differ', count(scorePlan(plan, ctx, { determinism: false }), 'determinism') === 1 && count(scorePlan(plan, ctx, { determinism: true }), 'determinism') === 0);
  const p = clone(plan);
  const it = itemsOf(p.weeks[0].days.find(d => d.kind === 'main')).find(x => Object.keys(x.credits || {}).length && typeof x.sets === 'number');
  it.credits = { ...it.credits, calves: 1 }; it.sets += 1;
  const s = scorePlan(p, ctx, {});
  check('credit_class_mismatch: a credit that is not the class\'s is reported on its item', has(s, 'credit_class_mismatch', v => v.slot_id === it.slot_id));
  check('credit_tally_mismatch: the week\'s printed tallies no longer match the items', has(s, 'credit_tally_mismatch', v => v.week === 1));
  const X = scorePlan(plan, ctx, {});
  check('scorePlan is a pure function: two calls give the same sheet', JSON.stringify(X) === JSON.stringify(scorePlan(plan, ctx, {})));
  check('the sheet is bench-score/2 with the acceptance rows A1-A14', X.schema === 'bench-score/2' && ACCEPTANCE.length === 14 && ACCEPTANCE.every(a => a.id in X.acceptance));
  const f99 = findPlan((pl) => (pl.meta.days_per_week >= 3 ? {} : null));
  const s99 = scorePlan(f99.plan, ctx, { params: { floor: 99 } });
  check('parameters: floor = 99 makes the trained group-weeks floor misses (' + f99.file + ')', count(s99, 'floor_misses') > 0 && count(f99.base, 'floor_misses') === 0);
  let threw = false; try { scorePlan(plan, ctx, { params: { no_such_parameter: 1 } }); } catch { threw = true; }
  check('parameters: an unknown parameter name is refused', threw);
}

console.log('\n' + passed + ' passed, ' + failed + ' failed');
process.exit(failed ? 1 : 0);
