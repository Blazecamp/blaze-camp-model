// Blaze Camp plan engine 0.5.0 - fix round 1: the coach-eye reviews of the 8 sample plans (samples/STATUS_v0.5.md, 'Fix round 1';
// engine/DECISIONS.md G-58 ..). One test per new rule, named by the coach answer it reads.
//
// Coach answers read here (authority: round 4 + CT-01 > CX > round 3 > round 2 > full > chat > sheets):
//   R4-SES-05  the A / B days slot by slot (two-leg slot 2, two-arm first row, 'Chest / Shoulders' slot 3, the 7th-8th small exercise)
//   R4-SES-02  the session is sized by exercise count; joint care outside it        R4-SES-04  nothing is dropped; say what is capped
//   R4-PRG-01  reach the top in the last week, one week early at most               R3-VOL-04  small steps, then bigger
//   R2-PER-07  the test replaces the lift's top set                                 PER-11     heavier by block
//   R2-VOL-06  the floor of 10                    VOL-16  3 sets on isolation       VOL-17  calves like any other muscle
//   R2-VOL-04  side delts are a small muscle      VOL-18  'we need to balance this out'   VOL-03  pain: cut, do not push it
//   R3-SES-01  the Focus muscle gets the extra sets   EQ-08  no-machine swaps only without the machine
//   R3-ATH-02  50+ racket players (low impact, cuff care)   R3-ATH-05  heavy play weeks   R2-PER-06  pre-season: more speed and power
//   R2-ATH-07  in season      PRG-10 / OT17 / OT18  the class      OT06  the bootcamp sessions      GEN-04  a swap list in every slot
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadFixtureModel, loadCompiledModel, loadSample } from './helpers/models.mjs';
import { randomIntake, sportIntake } from './helpers/random-intake.mjs';
import { generate } from '../engine/generate.mjs';
import { deriveValues, validateIntake } from '../engine/intake.mjs';
import { groupCredits } from '../engine/lines.mjs';
import { stairwayProgress, staggerStairways } from '../engine/progression/stairway.mjs';
import { amendRulesX1, amendTemplatesX1, amendExerciseX1, PINNED_SKELETON_PREFIXES_X1, UI_X1 } from '../tools/fixture/v05-fix1.mjs';
import { amendRulesX2, amendTemplatesX2, amendExerciseX2 } from '../tools/fixture/v05-fix2.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const BENCH_DIR = path.join(ROOT, 'design', 'bench', 'intakes');
const EPS = 1e-9;
const clone = (o) => JSON.parse(JSON.stringify(o));
const bench = (nn) => JSON.parse(fs.readFileSync(path.join(BENCH_DIR, fs.readdirSync(BENCH_DIR).find(f => f.startsWith(nn + '-'))), 'utf8'));
const itemsOf = (d) => d.blocks.flatMap(b => b.items.map(it => Object.assign(Object.create(null), it, { _block: b.kind })));
const allItems = (p) => p.weeks.flatMap(w => w.days.flatMap(d => d.blocks.flatMap(b => b.items.map(it => ({ w, d, b, it })))));
const check = (p, id) => p.validation.checks.find(c => c.id === id);
const WD = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

// ---------------------------------------------------------------------------------------------------- the kernel (no model)
describe('v0.5 fix round 1 / the stairway kernel: steps shared between the weeks (R3-VOL-04, R4-PRG-01)', () => {
  const RATES = [0, 0, 0.03, 0.03, 0.03, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05];
  const curve = (start, peak) => stairwayProgress({ start, peak, rates: RATES });

  it('R4-PRG-01: stairwayProgress gives the curve a group climbs on - 0 in week 1, 1 in the last week, never down, small steps first', () => {
    const c = curve(12, 18);
    assert.equal(c.status, 'ok');
    assert.equal(c.progress.length, 12); assert.equal(c.progress[0], 0); assert.equal(c.progress[11], 1);
    for (let i = 1; i < 12; i++) assert.ok(c.progress[i] >= c.progress[i - 1]);
    assert.ok(c.progress[5] < 0.5, 'less than half of the climb by the halfway week');
    assert.equal(curve(10, 10).progress, null, 'a group that does not climb has no curve');
  });

  it('R3-VOL-04 / R4-PRG-01: staggerStairways - every group arrives, none drops, none arrives more than a week early, at most half of them early', () => {
    const groups = [['quads', 12, 16], ['hips', 12, 16], ['back', 15, 21], ['chest', 10, 14], ['shoulders', 10, 14], ['calves', 9, 11], ['biceps', 10, 10]]
      .map(([id, start, peak]) => ({ id, start, peak, progress: peak > start ? curve(start, peak).progress : null }));
    const out = staggerStairways({ groups, weeks: 12, weeksEarly: 1 });
    let early = 0;
    for (const g of groups) {
      const s = out.sets[g.id];
      assert.equal(s.length, 12); assert.equal(s[0], g.start); assert.equal(s[11], g.peak, g.id);
      for (let i = 1; i < 12; i++) assert.ok(s[i] >= s[i - 1], `${g.id}: ${s.join(' ')}`);
      if (g.peak > g.start) {
        const first = s.indexOf(g.peak);
        assert.ok(first >= 10, `${g.id} arrives in week ${first + 1}: ${s.join(' ')}`);
        if (first === 10) early++;
        // never a whole set or more behind its own curve
        for (let i = 0; i < 12; i++) assert.ok(g.start + (g.peak - g.start) * g.progress[i] - s[i] < 1 + 1e-6 || i < 10, `${g.id} week ${i + 1}`);
      }
    }
    assert.ok(early <= 3, `${early} groups arrive a week early`);
    // the week totals: never down, the last week is not a cliff (sample 08: 29 x5, 30 x6, then 34)
    for (let i = 1; i < 12; i++) assert.ok(out.total[i] >= out.total[i - 1]);
    const steps = out.total.slice(1).map((v, i) => v - out.total[i]);
    assert.ok(steps[10] <= Math.ceil(groups.filter(g => g.peak > g.start).length / 2) + 1, `last week adds ${steps[10]}: ${out.total.join(' ')}`);
    assert.ok(steps.slice(6).reduce((a, b) => a + b, 0) >= steps.slice(0, 5).reduce((a, b) => a + b, 0), 'small steps first, bigger after halfway');
  });

  it('R4-PRG-01: a one-set climb waits for the last week; a per-week cap is never passed; weeksEarly above 1 is refused', () => {
    const one = staggerStairways({ groups: [{ id: 'biceps', start: 10, peak: 11, progress: curve(10, 11).progress }], weeks: 12, weeksEarly: 1 });
    assert.deepEqual(one.sets.biceps, [10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 11]);
    const cap = [12, 12, 12, 12, 13, 13, 13, 13, 14, 14, 14, 16];
    const held = staggerStairways({ groups: [{ id: 'g', start: 12, peak: 16, progress: curve(12, 16).progress, cap }], weeks: 12, weeksEarly: 1 });
    held.sets.g.forEach((v, i) => assert.ok(v <= cap[i], `week ${i + 1}: ${v} > ${cap[i]}`));
    assert.throws(() => staggerStairways({ groups: [], weeks: 12, weeksEarly: 2 }), RangeError);
  });
});

// ---------------------------------------------------------------------------------------------------- the amendment layer
describe('v0.5 fix round 1 / the amendment layer is pure and marks what is PROPOSED', () => {
  const fx = JSON.parse(fs.readFileSync(path.join(ROOT, 'engine', 'fixtures', 'mini-model.json'), 'utf8'));
  it('amendRulesX1 / amendTemplatesX1 / amendExerciseX1 do not change their input and are idempotent on the built model', () => {
    const r0 = clone(fx.rules), t0 = clone(fx.templates);
    const r1 = amendRulesX1(fx.rules), t1 = amendTemplatesX1(fx.templates);
    assert.deepEqual(fx.rules, r0); assert.deepEqual(fx.templates, t0);
    // v0.5 fix round 2 (converted; DECISIONS G 'Tests converted in fix round 2'): the built model carries the round-2 layer on top
    // of this one (tools/fixture/v05-fix2.mjs rewrites some of the same sections - the pull classes, the pinned skeletons), so the
    // layer is idempotent on the built model once the later layer is applied after it, as the build does
    assert.deepEqual(amendRulesX2(r1), fx.rules, 'the fixture already carries both layers'); assert.deepEqual(amendTemplatesX1(t1), t1);
    assert.deepEqual(amendTemplatesX2(t1), fx.templates);
    for (const e of fx.catalog.exercises.slice(0, 200)) assert.deepEqual(amendExerciseX2(amendExerciseX1(e)), e, e.id);
    assert.deepEqual(PINNED_SKELETON_PREFIXES_X1, ['gym_', 'ppl_', 'athletic_']);
  });
  it('every new rule section names its coach answers; the engine\'s own numbers say PROPOSED', () => {
    const R = fx.rules;
    for (const [name, sec] of [['volume.push_pull', R.volume.push_pull], ['athletic.x1', R.athletic.x1], ['prehab.x1', R.prehab.x1], ['conditioning.wod.x1', R.conditioning.wod.x1]]) {
      assert.ok(Array.isArray(sec.refs) && sec.refs.length > 0, name + ': refs');
    }
    assert.match(R.athletic.x1.status, /PROPOSED/); assert.match(R.prehab.x1.status, /PROPOSED/); assert.match(R.placement.x1.eve_of_game.status, /PROPOSED/);
    for (const [k, v] of Object.entries(UI_X1)) { assert.equal(v.length, 2, k); assert.ok(v[0] && v[1], k + ': English and Spanish'); assert.ok(!/\b(RIR|RPE|AMRAP)\b/.test(v[0]) || /MYO/.test(k), k); }
  });
});

// ---------------------------------------------------------------------------------------------------- the plans
const model = (() => { try { return loadCompiledModel(); } catch { return null; } })();
describe('v0.5 fix round 1 / the 8 samples and the benchmark plans (compiled model)', { skip: !model && 'model/ not compiled' }, () => {
  const R = model ? model.rules : null;
  const plans = new Map();
  const planOf = (n) => { if (!plans.has('S' + n)) plans.set('S' + n, generate(clone(loadSample(n)), model)); return plans.get('S' + n); };
  const benchOf = (nn) => { if (!plans.has('B' + nn)) plans.set('B' + nn, generate(bench(nn), model)); return plans.get('B' + nn); };
  const ex = (id) => (id && model.hasEx(id) ? model.ex(id) : null);
  const stair = (p) => p.weeks.filter(w => w.block_type === 'stairway');
  const SAMPLES = ['01', '02', '03', '04', '05', '06', '07', '08'];
  const liftOf = (d, bucket, role) => itemsOf(d).find(it => it.bucket === bucket && it.role !== 'test' && (!role || it.role === role));
  const cls = (it) => (ex(it.exercise_id) || {}).credit_class;
  const pushPull = (w) => {
    const PP = R.volume.push_pull; let push = 0, pull = 0;
    for (const d of w.days) for (const it of itemsOf(d)) { if (it._block === 'circuit' || !it.sets || it.role === 'prehab') continue; if (PP.push_classes.includes(cls(it))) push += it.sets; else if (PP.pull_classes.includes(cls(it))) pull += it.sets; }
    return { push, pull };
  };

  it('every sample builds with zero failing error checks', () => {
    for (const n of SAMPLES) { const p = planOf(n); assert.equal(p.status, 'ok', n); assert.equal(p.validation.ok, true, n + ': ' + JSON.stringify(p.validation.checks.filter(c => !c.pass && c.severity === 'error').map(c => [c.id, c.violations[0]]))); }
  });

  // ------------------------------------------------------------------------------------------------ R4-SES-05
  it('R4-SES-05 (02 / 03 / 08): slot 2 of an athletic A day is a two-leg knee lift and of a B day a two-leg hip lift, in every week', () => {
    for (const n of ['02', '03', '08']) for (const w of planOf(n).weeks) for (const d of w.days.filter(x => x.kind === 'main' && /^athletic_[AB]$/.test(x.skeleton || ''))) {
      const bucket = d.skeleton === 'athletic_A' ? 'RP_BKD' : 'RP_BHD';
      const it = liftOf(d, bucket, 'work');
      assert.ok(it, `${n} w${w.n} ${d.weekday}: no ${bucket} work lift`);
      assert.equal(ex(it.exercise_id).laterality, 'bilateral', `${n} w${w.n} ${d.weekday} ${it.exercise_id}`);
    }
  });

  it('R4-SES-05 / PER-04 (02): one day of squatting and the other day of leg pressing; a deadlift day and a hip-extension day', () => {
    const p = planOf('02'), w = p.weeks[1];
    const a = w.days.filter(d => d.skeleton === 'athletic_A').map(d => liftOf(d, 'RP_BKD', 'work').exercise_id);
    const b = w.days.filter(d => d.skeleton === 'athletic_B').map(d => liftOf(d, 'RP_BHD', 'work').exercise_id);
    assert.equal(a.length, 2); assert.equal(b.length, 2);
    assert.ok(a.some(id => /squat-barbell|back-squat/.test(id)) && a.some(id => /leg-press|hack-squat|belt-squat|pendulum/.test(id)), a.join(' + '));
    assert.ok(b.some(id => /deadlift/.test(id)) && b.some(id => /hip-thrust|hyperextension/.test(id)), b.join(' + '));
    // the tested squat of a field athlete is a front or a back squat, never a hand-held squat
    const tested = allItems(p).filter(x => x.it.role === 'test' && x.it.bucket === 'RP_BKD').map(x => x.it.exercise_id);
    assert.ok(tested.length && tested.every(id => /^(front-squat-barbell|low-bar-back-squat|high-bar-back-squat)$/.test(id)), tested.join(' '));
  });

  it('R4-SES-05 (02 / 08): the first row of an athletic A day is a two-arm row', () => {
    for (const n of ['02', '08']) for (const w of planOf(n).weeks) for (const d of w.days.filter(x => x.skeleton === 'athletic_A')) {
      const row = liftOf(d, 'RP_HPULL');
      assert.equal(ex(row.exercise_id).laterality, 'bilateral', `${n} w${w.n} ${d.weekday} ${row.exercise_id}`);
    }
  });

  it('R4-SES-05 / R4-LIB-03 (06 / 08): the week\'s "Chest / Shoulders" slot holds a 30-45 degree incline press that counts for chest; a high-incline press counts 1 front delts + half a set chest', () => {
    const CS = R.selection.x1.chest_shoulders;
    assert.deepEqual(R.credit.classes.MRPUSH, { front_delts: 1, chest: 0.5, triceps: 0.25 });
    for (const n of ['06', '08']) for (const w of planOf(n).weeks) {
      const inc = w.days.flatMap(d => itemsOf(d)).filter(it => it.bucket === CS.bucket && new RegExp(CS.incline_re).test(it.exercise_id || ''));
      // v0.5 fix round 2 (converted; DECISIONS G 'Tests converted in fix round 2'): a physique plan whose chest exercises at their most sets
      // cannot hold the level's start takes the incline press on both B days (sample 06 major: chest held by 5-set lifts and a
      // 4-set fly from week 1; rules.selection.x2.chest_shoulders_all_b) - sample 06 holds two, sample 08 one
      assert.equal(inc.length, n === '06' ? 2 : CS.per_week, `${n} w${w.n}: ${inc.map(x => x.exercise_id).join(', ')}`);
      assert.equal(new Set(inc.map(x => x.exercise_id)).size, inc.length, `${n} w${w.n}: the same incline press twice`);
      // the same incline press never leads another day of the week
      const leads = w.days.map(d => liftOf(d, CS.lead_bucket)).filter(Boolean).map(it => it.exercise_id);
      for (const x of inc) { assert.equal(x.credits.chest, 1, `${n} w${w.n}`); assert.ok(!leads.includes(x.exercise_id), `${n} w${w.n}: ${x.exercise_id} twice`); }
    }
    // sample 06: chest climbs now (it sat at 13 weekly sets for 12 weeks)
    const c6 = stair(planOf('06')).map(w => w.weekly_sets_by_group.chest);
    assert.ok(c6[0] >= 15 && c6[c6.length - 1] > c6[0], c6.join(' '));
  });

  it('R4-SES-05 (athletic 3-day): the builder\'s third day holds a two-leg knee lift that does not load the spine again, after the row', () => {
    const t = model.templates.families.athletic.days['3'].day_types.S3;
    const st = t.stations.filter(s => /^RP_/.test(s.bucket));
    const bkd = st.find(s => s.bucket === 'RP_BKD');
    assert.ok(bkd && bkd.axial === 'non_axial' && bkd.role !== 'work', JSON.stringify(bkd && [bkd.axial, bkd.role]));
    assert.ok(st.indexOf(bkd) > st.findIndex(s => s.bucket === 'RP_HPULL'));
    const p = planOf('03');
    // v0.5 fix round 2 (converted; DECISIONS G 'Tests converted in fix round 2'): for a change-of-direction sport the slot is free of the
    // two-leg pin (sample 03 major: a cutting sport lifted 70 % two-sided against its own 20 %; rules.selection.skeleton_laterality.
    // x2_free) - the soccer player's is a single-leg knee lift; it still does not load the spine again
    const sid = bkd.id.split('.').pop();
    assert.equal(R.selection.skeleton_laterality.x2_free.when, 'cod_sport');
    for (const w of p.weeks) { const d = w.days.find(x => x.day_type === 'S3'); const it = d && itemsOf(d).find(x => x.slot_id.split('.').pop() === sid && x.role !== 'test'); if (d) assert.ok(it && ['RP_BKD', 'RP_UKD'].includes(it.bucket) && !ex(it.exercise_id).axial, `w${w.n}: ${it && it.exercise_id}`); }
    // (a plan with no cutting sport keeps the two-leg lift there)
    for (const w of planOf('01').weeks) { const d = w.days.find(x => x.day_type === 'S3'); const it = d && liftOf(d, 'RP_BKD'); if (d) assert.ok(it && !ex(it.exercise_id).axial, `01 w${w.n}: ${it && it.exercise_id}`); }
  });

  // ------------------------------------------------------------------------------------------------ R2-PER-07
  it('R2-PER-07 (01 / 02 / 07): in a test week the tested lift opens the day\'s lifts and takes no extra set - the test replaces its top set', () => {
    for (const n of ['01', '02', '07']) {
      const p = planOf(n);
      for (const w of p.weeks.filter(x => x.test)) for (const d of w.days) {
        const its = itemsOf(d);
        const tests = its.filter(it => it.role === 'test' && it.bucket !== 'TEST');
        if (!tests.length) continue;
        const strength = its.filter(it => it._block === 'strength');
        assert.ok(strength[0].role === 'test', `${n} w${w.n} ${d.weekday}: ${strength[0].slot_id} opens the lifts`);
        for (const t of tests) {
          const lift = its.find(it => it.slot_id + '.test' === t.slot_id);
          const prev = p.weeks[w.n - 2];
          if (!prev || prev.exercise_block !== w.exercise_block) continue;
          const before = prev.days.flatMap(x => itemsOf(x)).find(it => it.slot_id === lift.slot_id);
          if (before) assert.ok(t.sets + lift.sets <= before.sets, `${n} w${w.n} ${lift.slot_id}: ${t.sets} + ${lift.sets} sets against ${before.sets} the week before`);
        }
      }
    }
    // 07: the tested deadlift of a lifter who names no stance is the conventional deadlift (EQ-09)
    const dl = allItems(planOf('07')).filter(x => x.it.role === 'test' && x.it.bucket === 'RP_BHD').map(x => x.it.exercise_id);
    assert.ok(dl.length && dl.every(id => id === 'barbell-deadlift-conventional'), dl.join(' '));
  });

  // ------------------------------------------------------------------------------------------------ R2-VOL-06
  it('R2-VOL-06 (01 / 02 / 06 / 07): the floor of 10 is held on the training days; a group that needs the optional day for it is said', () => {
    assert.equal(R.volume.floor.counted_on, 'main_days');
    for (const n of ['01', '02', '06', '07']) {
      const p = planOf(n), st = p.meta.stairway[0];
      assert.equal(st.floor_counted_on, 'main_days', n);
      for (const g of p.meta.targets.floor_groups.filter(x => x !== 'calves' && st.groups.includes(x))) {
        const held = stair(p).every(w => (w.main_sets_by_group[g] || 0) >= R.volume.floor.value - EPS);
        const said = st.below_floor.includes(g) || (st.floor_on_optional.includes(g) && p.meta.warnings.some(w => w.key === 'warning.floor_needs_optional_day' && w.args.group === g));
        assert.ok(held || said, `${n} ${g}: ${stair(p).map(w => w.main_sets_by_group[g]).join(' ')}`);
      }
    }
  });

  it('R4-PRG-04 (bench 88): where the training days\' floor and the optional day\'s Focus slots together pass a group\'s final sets, a Focus slot closes', () => {
    const p = benchOf('88'), st = p.meta.stairway[0];
    for (const g of ['biceps', 'triceps']) {
      const top = st.planned_top[g];
      for (const w of stair(p)) assert.ok(w.weekly_sets_by_group[g] <= top + 1 + EPS, `${g} week ${w.n}: ${w.weekly_sets_by_group[g]} against ${top}`);
    }
    assert.ok(st.focus_closed.some(c => ['biceps', 'triceps'].includes(c.group)), JSON.stringify(st.focus_closed));
  });

  // ------------------------------------------------------------------------------------------------ R3-VOL-04 / R4-PRG-01
  it('R3-VOL-04 / R4-PRG-01 (01 / 06 / 07 / 08): the weekly total climbs in steps - the last week is not a cliff and no three weeks sit still', () => {
    assert.deepEqual(R.stairway.progression.stagger, { enabled: true, weeks_early: 1 });
    for (const n of ['01', '06', '07', '08']) {
      const t = stair(planOf(n)).map(w => w.total_resistance_sets), N = t.length;
      const steps = t.slice(1).map((v, i) => v - t[i]);
      const grown = t[N - 1] - t[0];
      assert.ok(steps.every(s => s >= 0), `${n}: ${t.join(' ')}`);
      assert.ok(steps[N - 2] <= Math.max(3, Math.ceil(grown / 3)), `${n}: the last week adds ${steps[N - 2]} of ${grown} (${t.join(' ')})`);
      // (engine 0.6.0, converted - COACH-CH5 CH5-02 / DECISIONS G-198: the 2-day stay-active plan's A / B days now hold the arm slot, so
      // its arms start inside the 6-8 band and the week grows by 7 sets over 11 steps; a 4-week hold is read there, H21 'a week may hold
      // the same sets while reps or load progress')
      let run = 0; for (const s of steps) { run = s === 0 ? run + 1 : 0; assert.ok(run < (n === '08' ? 4 : 3), `${n}: ${t.join(' ')}`); }
    }
  });

  // ------------------------------------------------------------------------------------------------ VOL-18
  it('VOL-18 (01 / 02 / 03 / 08): a sport profile that asks for it never presses more than it pulls - every week', () => {
    const PP = R.volume.push_pull;
    // v0.5 fix round 2 (converted; DECISIONS G 'Tests converted in fix round 2'): reverse flies and face pulls count on the pulling side, and
    // while the back sits on its number for the week a press may lead the pulls by one set (rules.volume.push_pull.capped_slack) -
    // the back is no longer raised above its sport-scaled final sets for the balance (sample 03 major: back the biggest group)
    assert.equal(PP.hard, 1); assert.deepEqual(PP.pull_classes, ['HPULL', 'VPULL', 'ISO_REAR', 'FACEPULL']); assert.equal(PP.capped_slack, 1); assert.equal(PP.back_cap, 'planned');
    let judged = 0;
    for (const n of ['01', '02', '03', '08']) {
      const p = planOf(n), st = p.meta.stairway[0];
      if (!st.push_pull) continue;
      judged++;
      for (const w of stair(p)) { const { push, pull } = pushPull(w); assert.ok(pull >= st.push_pull.hard * push - PP.capped_slack - EPS, `${n} w${w.n}: pull ${pull} against push ${push}`); }
      // the back still climbs to the ratio - it does not start on it (sample 08: back flat at 8)
      const back = stair(p).map(w => w.weekly_sets_by_group.back);
      if (st.group_top.back > st.group_start.back) assert.ok(back[back.length - 1] > back[0], `${n}: ${back.join(' ')}`);
    }
    assert.ok(judged >= 3);
  });

  it('VOL-18 (02 / 03): an athlete\'s shoulders never end above the back', () => {
    const SA = R.volume.x1.shoulders_athlete;
    assert.equal(SA.cap_line, 'lats_upper_back');
    for (const n of ['01', '02', '03']) { const t = planOf(n).meta.targets; assert.ok(t.cap.shoulders <= t.cap.lats_upper_back, `${n}: shoulders ${t.cap.shoulders} against back ${t.cap.lats_upper_back}`); }
  });

  // ------------------------------------------------------------------------------------------------ PER-11
  it('PER-11 (03): a single-block late off-season moves to the heavier rep phase after its halfway week', () => {
    assert.equal(R.reps.athlete_vol_phases.off_late_single_block_step.enabled, true);
    assert.deepEqual(stair(planOf('03')).map(w => w.rep_phase), ['VOL2', 'VOL2', 'VOL2', 'VOL3', 'VOL3', 'VOL3']);
  });

  // ------------------------------------------------------------------------------------------------ the class (OT17 / OT18, PRG-10)
  it('OT17 / OT18 (04): a class lift never holds fewer sets than his table starts at; R4-SES-05: triceps with the presses, quads on two days', () => {
    const p = planOf('04');
    assert.ok(R.placement.x1.work_min_from_hint_families.includes('hybrid_crossfit'));
    for (const w of p.weeks) for (const d of w.days.filter(x => x.kind === 'main')) for (const it of itemsOf(d).filter(x => x.role === 'work' && /^RP_/.test(x.bucket))) {
      const top = itemsOf(d).find(x => x.slot_id === it.slot_id + '.test');
      assert.ok(it.sets + (top ? top.sets : 0) >= 3, `w${w.n} ${d.weekday} ${it.exercise_id}: ${it.sets}`);
    }
    const w1 = p.weeks[1];
    const press = w1.days.find(d => d.day_type === 'PRESS');
    assert.equal(liftOf(press, 'RP_VPUSH', 'work').exercise_id, 'standing-barbell-overhead-press-strict');
    assert.ok(itemsOf(press).some(it => it.bucket === 'ISO_TRICEP' && it.sets > 0), 'triceps on the press day');
    const quadDays = w1.days.filter(d => itemsOf(d).some(it => it.sets > 0 && (it.credits || {}).quads === 1 && it.origin === 'template'));
    assert.ok(quadDays.length >= 2, quadDays.map(d => d.day_type).join(' '));
  });

  it('PRG-10 (04): a for-time WOD grows by rounds and its cap follows; a barbell station prints the bar\'s load; the week\'s WODs hold a pulling or gymnastics station; no jumping jacks for a trained member', () => {
    const p = planOf('04'), W = R.conditioning.wod;
    const wods = allItems(p).filter(x => x.it.bucket === 'COND_WOD');
    const pull = new RegExp(W.x1.pull_re);
    for (const w of p.weeks) {
      const ids = wods.filter(x => x.w === w).flatMap(x => (x.it.wod && x.it.wod.stations) || []);
      assert.ok(ids.some(id => pull.test(id)), `w${w.n}: ${ids.join(', ')}`);
      assert.ok(!ids.some(id => /jumping-jack/.test(id)), `w${w.n}`);
    }
    assert.equal(W.for_time_progress.rounds_add, 2);
    assert.ok(model.t('en', 'wod.load.barbell', { min: 65, max: 95 }).includes('65'));
    // no station is a second version of an exercise the day already holds
    for (const x of wods) for (const id of (x.it.wod && x.it.wod.stations) || []) assert.ok(!itemsOf(x.d).some(it => it.slot_id !== x.it.slot_id && it.exercise_id === id), `w${x.w.n} ${x.d.weekday} ${id}`);
    // the for-time WODs of a block: the rounds never fall and rise at least once across the plan
    const ft = wods.filter(x => x.it.wod && x.it.wod.format === 'for_time' && typeof x.it.wod.rounds === 'number');
    if (ft.length) { const bySlot = new Map(); for (const x of ft) (bySlot.get(x.it.slot_id) || bySlot.set(x.it.slot_id, []).get(x.it.slot_id)).push(x.it.wod.rounds); assert.ok([...bySlot.values()].some(v => v[v.length - 1] > v[0]), JSON.stringify([...bySlot.values()])); }
  });

  // ------------------------------------------------------------------------------------------------ the bootcamp (OT06)
  it('OT06 (05): each bootcamp session keeps the coach\'s own five slots, runs as one circuit, and the week holds the floor, two rows and as much pulling as pressing', () => {
    const p = planOf('05');
    const OWN = { BC1: ['RP_BKD', 'RP_HPULL', 'RP_UHD', 'COND_CIRCUIT'], BC2: ['RP_BHD', 'RP_HPUSH', 'ISO_BICEP', 'RP_VPUSH', 'COND_CIRCUIT'], BC3: ['RP_VPULL', 'RP_UKD', 'COND_CIRCUIT', 'ISO_TRICEP', 'ISO_SIDE_REAR_DELT'] };
    for (const w of p.weeks) {
      for (const d of w.days.filter(x => x.kind === 'main')) {
        const circ = itemsOf(d).filter(it => it._block === 'circuit' && (it.sets || 0) > 0);
        const own = OWN[String(d.day_type).replace(/_BW$/, '')];
        assert.ok(own, d.day_type);
        // (a kit with no bar or cable to pull down from fills the vertical-pull slot with a row - the item says 'pattern_gap')
        const holds = (b) => circ.some(it => it.bucket === b || (b === 'RP_VPULL' && it.bucket === 'RP_HPULL' && (it.flags || []).includes('pattern_gap')));
        for (const b of own) assert.ok(holds(b), `w${w.n} ${d.day_type}: ${b} cut (${circ.map(it => it.bucket).join(' ')})`);
        assert.ok(circ.length >= 5 && circ.length <= 7, `w${w.n} ${d.day_type}: ${circ.length} stations`);
        assert.equal(d.blocks.filter(b => b.kind === 'circuit').length, 1, `w${w.n} ${d.day_type}: one circuit`);
      }
      const rows = w.days.flatMap(d => itemsOf(d)).filter(it => cls(it) === 'HPULL' && it.sets > 0);
      assert.ok(rows.length >= 2, `w${w.n}: ${rows.length} row`);
      const { push, pull } = pushPull({ days: w.days.map(d => ({ blocks: d.blocks.map(b => ({ kind: 'x', items: b.items })) })) });
      assert.ok(pull >= push - EPS, `w${w.n}: pull ${pull} against push ${push}`);
    }
    // at 4 rounds every trained group holds the floor
    const w4 = p.weeks.find(w => w.circuit && w.circuit.rounds >= 4);
    if (w4) for (const g of ['quads', 'hips', 'back', 'chest', 'shoulders', 'biceps', 'triceps']) assert.ok(w4.weekly_sets_by_group[g] >= 10 - EPS, `${g}: ${w4.weekly_sets_by_group[g]}`);
  });

  // ------------------------------------------------------------------------------------------------ R3-SES-01
  it('R3-SES-01 (06): the Focus muscle takes the steps of its group - the glute lifts gain sets across the block', () => {
    const p = planOf('06');
    assert.equal(R.placement.x1.step_first.focus, true);
    const direct = (w) => w.days.flatMap(d => itemsOf(d)).filter(it => (it.credits || {}).glutes === 1).reduce((a, it) => a + (it.sets || 0), 0);
    const s = stair(p).map(direct);
    assert.ok(s[s.length - 1] >= s[0] + 2, `direct glute sets: ${s.join(' ')}`);
    const ham = (w) => w.days.flatMap(d => itemsOf(d)).filter(it => (it.credits || {}).hamstrings === 1).reduce((a, it) => a + (it.sets || 0), 0);
    assert.ok(s[s.length - 1] - s[0] >= ham(stair(p).slice(-1)[0]) - ham(stair(p)[0]) - 1, 'the glute lifts step at least as much as the hamstring lifts');
  });

  // ------------------------------------------------------------------------------------------------ VOL-16 / VOL-07
  it('VOL-16 / VOL-07 (06 / 07): an isolation exercise of a training day holds 3 sets, a 4th in the hardest weeks only; what is left goes to the bonus exercise and an 8th small exercise', () => {
    const M = R.placement.x1.iso_main_day_max;
    assert.deepEqual([M.default, M.hardest, M.phase], [3, 4, 'HARDEST']);
    assert.deepEqual(R.placement.bonus.sets, [2, 4]);
    for (const n of ['06', '07']) for (const w of stair(planOf(n))) for (const d of w.days.filter(x => x.kind === 'main')) for (const it of itemsOf(d)) {
      const e = ex(it.exercise_id);
      if (!e || e.exercise_class !== 'isolation' || it.bucket === 'ISO_CALF' || !it.sets || it._block === 'prehab') continue;
      const top = it.origin === 'bonus' ? R.placement.x1.main_day_extra.sets[1] : (w.phase === M.phase ? M.hardest : M.default);
      assert.ok(it.sets <= Math.max(top, M.hardest), `${n} w${w.n} ${d.weekday} ${it.exercise_id}: ${it.sets}`);
      if (w.phase !== M.phase && it.origin === 'template' && w.n <= 4) assert.ok(it.sets <= M.default || planOf(n).meta.targets.floor_groups.length > 0, `${n} w${w.n} ${it.exercise_id}: ${it.sets}`);
    }
    // no isolation exercise carries more sets than the day's first lift in week 1 (sample 06 major: skullcrusher 5 against hip thrust 3)
    for (const n of ['06', '07']) for (const d of planOf(n).weeks[0].days.filter(x => x.kind === 'main')) {
      const lifts = itemsOf(d).filter(it => /^RP_/.test(it.bucket) && it.role !== 'test' && it.sets);
      const iso = itemsOf(d).filter(it => /^ISO_/.test(it.bucket) && it.bucket !== 'ISO_CALF' && it.sets);
      if (lifts.length && iso.length) assert.ok(Math.max(...iso.map(it => it.sets)) <= Math.max(...lifts.map(it => it.sets)), `${n} ${d.weekday}`);
    }
  });

  // ------------------------------------------------------------------------------------------------ VOL-17
  it('VOL-17 (07 / 08): calves climb on the leg days when no optional day carries them; a 2-day plan keeps the calf exercise of both leg days', () => {
    assert.equal(R.volume.calves.climb_without_optional, true);
    const c7 = stair(planOf('07')).map(w => w.weekly_sets_by_group.calves);
    assert.ok(c7[0] >= 6 && c7[c7.length - 1] >= 10, c7.join(' '));
    // (engine 0.6.0, converted - COACH-CH5 CH5-02 / DECISIONS G-198: on the B day, full at the stay-active top of 10, slot 5's triceps
    // exercise takes the place of the day's last-ranked accessory - the calf raise - and the day says so; the A day keeps its calf raise)
    for (const w of planOf('08').weeks) for (const d of w.days.filter(x => x.kind === 'main')) {
      const calf = itemsOf(d).find(it => it.bucket === 'ISO_CALF');
      if (!calf && (d.why || []).some(y => y.key === 'why.arm_slot')) { assert.ok(itemsOf(d).some(it => it.bucket === 'ISO_TRICEP'), `w${w.n} ${d.weekday}`); continue; }
      assert.ok(calf && calf.sets >= 3 && calf.credits.calves === 1, `w${w.n} ${d.weekday}: ${calf && calf.sets}`);
    }
    assert.ok(planOf('08').weeks.every(w => w.days.some(d => d.kind === 'main' && itemsOf(d).some(it => it.bucket === 'ISO_CALF'))), 'a calf exercise every week');
  });

  // ------------------------------------------------------------------------------------------------ R2-VOL-04
  it('R2-VOL-04 (07): side delts are a small muscle with their own sets - an advanced physique plan holds 8 or more direct sets in its hardest weeks', () => {
    const DM = R.volume.x1.direct_min.side_delts;
    assert.deepEqual(DM.by_level, { L1: 4, L2: 6, L3: 8 });
    const p = planOf('07');
    const direct = (w) => w.days.flatMap(d => itemsOf(d)).filter(it => (it.credits || {}).side_delts === 1).reduce((a, it) => a + (it.sets || 0), 0);
    const s = stair(p).map(direct);
    assert.ok(s[0] >= 6 && Math.max(...s) >= DM.by_level.L3, s.join(' '));
    // v0.5 fix round 2 (converted; DECISIONS G 'Tests converted in fix round 2'): the direct sets are held at the level's number from week 1
    // (8 for L3) and never go down; the shoulders' own steps go to the Monday press first - a compound lift to 3 sets before an
    // isolation exercise takes more (VOL-16, rules.placement.x2.order.compound_min)
    for (let i = 1; i < s.length; i++) assert.ok(s[i] >= s[i - 1], s.join(' '));
    const sh = stair(p).map(w => w.weekly_sets_by_group.shoulders);
    assert.ok(sh[sh.length - 1] > sh[0], 'the shoulders climb: ' + sh.join(' '));
  });

  // ------------------------------------------------------------------------------------------------ EQ-08
  it('EQ-08 (07): the leg-extension and leg-curl slots hold the machine on both leg days while the gym has one (sissy squats and Nordics are the swap when there is none)', () => {
    const p = planOf('07');
    for (const w of p.weeks) for (const d of w.days.filter(x => x.skeleton === 'ppl_legs')) {
      const q = itemsOf(d).find(it => it.bucket === 'ISO_QUAD'), h = itemsOf(d).find(it => it.bucket === 'ISO_LEG_FLEXION');
      assert.match(q.exercise_id, /leg-extension-machine/, `w${w.n} ${d.weekday}`);
      assert.match(h.exercise_id, /leg-curl-machine/, `w${w.n} ${d.weekday}`);
    }
    // a home kit keeps the no-machine versions
    const IM = R.selection.x1.iso_machine_first;
    assert.ok(new RegExp(IM.buckets.ISO_QUAD.avoid_re).test('sissy-squat') && new RegExp(IM.buckets.ISO_LEG_FLEXION.avoid_re).test('nordic-hamstring-curl'));
  });

  it('R4-SES-05 (07): the "Tricep - Overhead" slot holds an overhead extension on both push days, in every block', () => {
    assert.equal(R.selection.slot_variants.ISO_TRICEP.overhead.strict, true);
    for (const w of planOf('07').weeks) for (const d of w.days.filter(x => x.skeleton === 'ppl_push')) {
      const tri = itemsOf(d).filter(it => it.bucket === 'ISO_TRICEP' && it.origin === 'template');
      assert.match(tri[1].exercise_id, /overhead/, `w${w.n} ${d.weekday}: ${tri[1].exercise_id}`);
    }
  });

  // ------------------------------------------------------------------------------------------------ 08: R4-SES-02, R3-ATH-02, R3-ATH-05, VOL-03
  it('R4-SES-02 (08): a non-competitive athletic adult\'s day is sized like his sheet (up to 10) and no template lift is cut', () => {
    const p = planOf('08');
    assert.deepEqual(p.meta.session_size.range, [5, 10]);
    for (const w of p.weeks) for (const d of w.days.filter(x => x.kind === 'main')) assert.ok(d.exercise_count <= 10, `w${w.n} ${d.weekday}: ${d.exercise_count}`);
  });

  it('R3-ATH-02 / VOL-03 (08): the painful knee keeps a supported two-leg lift, never a deep free knee bend; the box stays low in every stage', () => {
    const p = planOf('08');
    for (const x of allItems(p)) {
      const e = ex(x.it.exercise_id);
      if (!e) continue;
      if (['RP_BKD', 'RP_UKD'].includes(x.it.bucket)) assert.ok(!e.tags.includes('deep_knee_flexion'), `w${x.w.n} ${e.id}`);
      if (x.it.bucket === 'AP_PLYO' && x.it.load && x.it.load.type === 'height') assert.equal(x.it.load.value, 'low', `w${x.w.n} ${e.id}`);
      assert.ok(!/knee-height|mid-box|high-box|depth-jump/.test(e.id) || x.it.bucket !== 'AP_PLYO', `w${x.w.n} ${e.id}`);
    }
    assert.ok(ex('single-leg-get-up-box-pistol') ? ex('single-leg-get-up-box-pistol').tags.includes('deep_knee_flexion') : true);
  });

  it('R3-ATH-05 / ATH-05 (08): a heavy play week holds one jump station a day - a jump and an ankle-hop day in the week - and a throw on both days', () => {
    const HP = R.athletic.x1.heavy_play;
    assert.ok(HP.one_jump_station_a_day && HP.throw_replaces_cuts);
    const p = planOf('08');
    for (const w of p.weeks) {
      const mains = w.days.filter(d => d.kind === 'main');
      for (const d of mains) {
        const jumps = itemsOf(d).filter(it => ['AP_PLYO', 'AP_JUMP_LIMITED_KNEE'].includes(it.bucket) && it.sets > 0);
        assert.equal(jumps.length, 1, `w${w.n} ${d.weekday}: ${jumps.map(it => it.exercise_id).join(' + ')}`);
        assert.ok(itemsOf(d).some(it => it.bucket === 'AP_THROW' && it.sets > 0), `w${w.n} ${d.weekday}: no throw`);
        assert.ok(!itemsOf(d).some(it => it.bucket === 'AP_COD' && it.sets > 0), `w${w.n} ${d.weekday}: extra agility in a heavy play week`);
      }
      const kinds = new Set(mains.flatMap(d => itemsOf(d)).filter(it => ['AP_PLYO', 'AP_JUMP_LIMITED_KNEE'].includes(it.bucket) && it.sets > 0).map(it => it.bucket));
      assert.equal(kinds.size, 2, `w${w.n}: ${[...kinds].join(' ')}`);
      // the plyometric share holds (R2-ATH-01)
      const ab = w.athletic_budget;
      if (typeof ab.plyo_share === 'number' && typeof ab.planned_share === 'number') assert.ok(Math.abs(ab.planned_share - ab.plyo_share) <= R.athletic.f2.share.tolerance + EPS, `w${w.n}: ${ab.planned_share} against ${ab.plyo_share}`);
    }
    assert.ok(!p.meta.warnings.some(w => /athletic_capacity/.test(w.key)), 'no "add jump work" line for a player with knee pain in heavy play weeks');
  });

  it('R3-ATH-02 / R4-SES-02 (08): joint care lives in the template\'s own lift - calf raise, leg extension, the rear-delt slot with a face pull or Y-T raise - and is never a reference-only exercise', () => {
    const p = planOf('08'), PX = R.prehab.x1;
    assert.deepEqual(PX.never_status, ['reference_only', 'program_only']);
    const care = allItems(p).filter(x => (x.it.flags || []).includes('joint_care'));
    assert.ok(care.length > 0);
    for (const x of care) {
      assert.ok(['ISO_CALF', 'ISO_QUAD', 'ISO_SIDE_REAR_DELT'].includes(x.it.bucket), x.it.bucket);
      assert.ok(!PX.never_status.includes(ex(x.it.exercise_id).status), x.it.exercise_id);
      assert.ok(x.it.notes.some(n => n.key === 'note.joint_care_slot'), x.it.slot_id);
    }
    assert.ok(care.filter(x => x.it.bucket === 'ISO_SIDE_REAR_DELT').every(x => /face-pull|y-t/.test(x.it.exercise_id)), 'the shoulder care is the care\'s own exercise');
    // no day holds a calf raise as an exercise and a calf raise as joint care
    for (const w of p.weeks) for (const d of w.days) assert.ok(itemsOf(d).filter(it => /calf-raise/.test(it.exercise_id || '')).length <= 1, `w${w.n} ${d.weekday}`);
    // the balance warm-up is the 60+ default
    assert.equal(R.warmup.x1.balance_from_older_only, true);
    assert.ok(!allItems(p).some(x => x.it.bucket === 'WARMUP_PREP' && /balance/.test(x.it.text_key || '')));
  });

  it('VOL-03 (08 and pain intakes): the MYO set never lands on a muscle the plan cut for pain; a calf raise carries it only when nothing else may', () => {
    const IN = R.effort.intensifiers;
    assert.equal(IN.never_pain_muscle, true); assert.ok(IN.x1.calves_last_resort && IN.x1.two_sided_first);
    const judge = (p, tag) => {
      const pain = new Set(p.meta.targets.pain_muscles || []);
      for (const x of allItems(p)) {
        if (!(x.it.effort && x.it.effort.last_set === 'myo')) continue;
        const e = ex(x.it.exercise_id);
        assert.ok(!Object.entries(e.credits).some(([m, c]) => c >= 1 && pain.has((R.muscles.defs[m] || {}).line || m)), `${tag} w${x.w.n} ${x.d.weekday} ${e.id}`);
        if (e.credit_class === 'ISO_CALF') assert.ok(!(x.w.test && (x.w.test.items || []).some(t => IN.x1.no_calves_with_tests.includes(t))), `${tag} w${x.w.n}: calves with a sprint or jump test`);
      }
      assert.ok(check(p, 'V12').pass && check(p, 'V17').pass, tag);
    };
    judge(planOf('08'), '08'); judge(benchOf('10'), 'B10'); judge(benchOf('56'), 'B56');
    assert.match(model.t('en', 'effort.myo'), /15 reps/); assert.match(model.t('es', 'effort.myo'), /15 repeticiones/);
  });

  // ------------------------------------------------------------------------------------------------ athletic numbers
  it('samples 03 / 08 (PROPOSED): a profile the coach has not confirmed asks a 2- or 3-day week for three quarters of its 4-day athletic numbers', () => {
    const SD = R.athletic.x1.scale_by_days;
    assert.deepEqual([SD.reference_days, SD.floor], [4, 0.75]);
    const scale = (n) => deriveValues(validateIntake(clone(loadSample(n)), model).intake, model).D11_athletic_budget.day_scale;
    assert.equal(scale('03'), 0.75); assert.equal(scale('08'), 0.75);
    assert.ok(!planOf('03').meta.warnings.some(w => w.key === 'warning.athletic_capacity'), 'the soccer week holds its targets now');
  });

  it('R2-PER-06 (03 and the sport corpus): a pre-season week keeps the athletic work of the off-season block before it', () => {
    assert.equal(R.athletic.x1.pre_season_keep_sets, true);
    for (const k of ['plyo_contacts', 'jump_contacts']) assert.ok(R.athletic.r2.pre_season_hold.keys.includes(k));
    const p = planOf('03');
    const off = stair(p).filter(w => !w.athletic_budget.hold && !w.test).slice(-1)[0].athletic_budget.planned;
    for (const w of p.weeks.filter(x => x.block_type === 'pre_season')) for (const k of ['sprint_m', 'cod_cuts', 'olympic_sets']) assert.ok(w.athletic_budget.planned[k] >= off[k] - (k === 'sprint_m' ? 60 : 12), `w${w.n} ${k}: ${w.athletic_budget.planned[k]} against ${off[k]}`);
    assert.ok(check(p, 'V27').pass);
  });

  // ------------------------------------------------------------------------------------------------ in season
  it('R2-ATH-07 (bench 33): in season, a session the client\'s days put on the eve of a game is the week\'s lighter one', () => {
    const p = benchOf('33');
    const games = new Set(p.meta.derived.D4_season_phase.game_days);
    let judged = 0;
    for (const w of p.weeks.filter(x => x.block_type === 'in_season')) {
      const mains = w.days.filter(d => d.kind === 'main');
      const sets = (d) => itemsOf(d).filter(it => /^(RP_|ISO_|FOCUS)/.test(it.bucket) && it._block !== 'prehab').reduce((a, it) => a + (it.sets || 0), 0);
      const eve = mains.filter(d => games.has(WD[(WD.indexOf(d.weekday) + 1) % 7])), far = mains.filter(d => !eve.includes(d));
      if (!eve.length || !far.length) continue;
      judged++;
      for (const d of eve) assert.ok(sets(d) < Math.max(...far.map(sets)), `w${w.n} ${d.weekday}: ${sets(d)} against ${far.map(sets).join(', ')}`);
      const { push, pull } = pushPull(w);
      assert.ok(pull >= push - EPS, `w${w.n}: pull ${pull} against push ${push}`);
    }
    assert.ok(judged > 0);
  });

  // ------------------------------------------------------------------------------------------------ swaps and words
  it('GEN-04 / R4-LIB-03 (all samples): every lift lists a swap; the incline press of the "Chest / Shoulders" slot still lists an overhead press', () => {
    for (const n of SAMPLES) for (const x of allItems(planOf(n))) {
      if (!/^(RP_|ISO_)/.test(x.it.bucket || '') || x.it.role === 'test' || !x.it.exercise_id || x.b.kind === 'circuit' || x.b.kind === 'prehab') continue;
      if (model.bySlot(x.it.bucket).filter(e => e.status === 'live_library_selectable').length < 4) continue;
      assert.ok((x.it.swaps || []).length >= 1, `${n} w${x.w.n} ${x.d.weekday} ${x.it.exercise_id}: no swap`);
    }
    const CS = R.selection.x1.chest_shoulders;
    const slot = allItems(planOf('06')).filter(x => x.it.bucket === CS.bucket && new RegExp(CS.incline_re).test(x.it.exercise_id || ''));
    assert.ok(slot.length && slot.every(x => x.it.swaps.some(id => ex(id).tags.includes('overhead') || ex(id).tags.includes('mid_range_push'))), 'the slot\'s own presses stay in the swaps');
    assert.ok(model.t('en', 'swap.keeps.MRPUSH') && model.t('es', 'swap.keeps.MRPUSH'));
  });

  it('CX-04 / R4-SES-04 (06): the plan opens with a capped-group line only for a Focus group, a group under its level\'s start or a big group under 80 %; the table names the rest', () => {
    const CN = R.placement.x1.capped_notice;
    assert.deepEqual([CN.focus, CN.below_start, CN.big_below_share], [true, true, 0.8]);
    for (const n of ['06', '07', '04']) {
      const p = planOf(n), st = p.meta.stairway[0];
      for (const c of st.capped) {
        assert.equal(typeof c.notice, 'boolean', `${n} ${c.group}`);
        const said = p.meta.warnings.some(w => w.key === 'warning.capped_by_template' && w.args.group === c.group);
        assert.equal(said, c.notice && !st.below_floor.includes(c.group), `${n} ${c.group}`);
      }
    }
  });

  it('R2-PER-07 / UNI-04 / VOL-12: the client\'s own heavy choice is never lifted back to the lift\'s usual range; a lift never leaves his REPS menu when its range is capped', () => {
    const menu = R.reps.rep_hint.x1.menu.map(m => m.join('-'));
    assert.deepEqual(menu, ['4-6', '6-8', '8-10', '10-12', '12-15', '15-20']);
    for (const n of ['02', '03', '06']) for (const x of allItems(planOf(n))) {
      if (!(x.it.notes || []).some(nt => nt.key === 'note.rep_cap') || !x.it.reps || x.it.reps.min == null || x.it.reps.min === x.it.reps.max) continue;
      const e = ex(x.it.exercise_id);
      if (!e || e.exercise_class !== 'compound' || /nordic|pull-up|chin-up|dip/.test(e.id)) continue;
      assert.ok(menu.includes(x.it.reps.min + '-' + x.it.reps.max), `${n} w${x.w.n} ${e.id}: ${x.it.reps.min}-${x.it.reps.max}`);
    }
    const i = clone(loadSample('02')); i.prefs = { ...(i.prefs || {}), heavy_unilateral: true };
    const heavy = generate(i, model);
    assert.ok(allItems(heavy).some(x => x.it.reps && x.it.reps.type === 'per_side' && x.it.reps.min < 8 && /^RP_/.test(x.it.bucket)), 'the heavy single-leg switch');
  });

  it('PER-04 (07): the week holds one bent-over barbell row; the dial weighs a station by the sets the plan gives it', () => {
    const fam = R.selection.r2.families.find(f => f.id === 'bent_over_barbell_row');
    assert.ok(fam && fam.week_max === 1);
    for (const w of planOf('07').weeks) assert.ok(w.days.flatMap(d => itemsOf(d)).filter(it => new RegExp(fam.re).test(it.exercise_id || '')).length <= 1, `w${w.n}`);
    assert.equal(R.selection.x1.dial_reads_plan_sets, true); assert.equal(R.selection.x1.second_pass_top_tolerance, 1);
    // sample 04: the lower two-leg share lands inside the tolerance of V28
    assert.ok(check(planOf('04'), 'V28').pass);
  });
});

// ---------------------------------------------------------------------------------------------------- the fixture corpus
describe('v0.5 fix round 1 / intakes of the random corpus the round first broke (fixture)', () => {
  const fixture = loadFixtureModel();
  const gen = (i) => generate(i, fixture);
  const failing = (p) => p.validation.checks.filter(c => !c.pass && c.severity === 'error').map(c => c.id);

  it('R4-PRG-04 / R2-PER-01 (random 63): a block that holds its sets takes no set in week 9 - what its first week keeps is its number', () => {
    const p = gen(randomIntake(63, fixture));
    assert.deepEqual(failing(p), []);
    for (const b of p.meta.stairway) for (const g of b.groups) if (b.group_top[g] === b.group_start[g]) assert.ok(b.schedule[g].every(v => v === b.schedule[g][0]), `${g}: ${b.schedule[g].join(' ')}`);
  });

  it('VOL-03 / VOL-15 (random 40, 213, 231, 269): the validator reads the MYO rule the way the dose applies it', () => {
    for (const k of [40, 213, 231, 269]) assert.deepEqual(failing(gen(randomIntake(k, fixture))), [], 'random-' + k);
  });

  it('R2-PER-07 (random 77, 105, 287): the tested lift first is no "work first" miss', () => {
    for (const k of [77, 105, 287]) assert.deepEqual(failing(gen(randomIntake(k, fixture))), [], 'random-' + k);
  });

  it('R2-PER-06 (baseball, softball): a pre-season week that holds the off-season jumps is inside its budget (V27)', () => {
    for (const id of ['baseball', 'softball']) {
      const k = fixture.profiles.picker.sports.findIndex(s => s.id === id);
      assert.deepEqual(failing(gen(sportIntake(k, fixture))), [], id);
    }
  });
});
