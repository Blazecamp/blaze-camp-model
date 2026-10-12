// tests/review-r3.test.mjs - engine 0.4.0 (stage B1: time, volume and structure) regression tests for the coach-eye re-check of
// the v0.3 sample plans (samples/RECHECK_v0.3.md) and the round-3 answers (coach_answers_round3.md). One test per fixed issue,
// named R<sample>-<slug> after its RECHECK sample (or R3-<slug> for a round-3 feature); samples/REVIEW_LOG.md (v0.4) lists them.
// Each test reads the plan the engine builds from samples/intakes/<sample>.json on the compiled model (model/).
import { describe, test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { generate } from '../engine/generate.mjs';
import * as GEN from '../engine/generate.mjs';
import { validatePlan } from '../engine/validate.mjs';
import { validateIntake, deriveValues } from '../engine/intake.mjs';
import { setCost, testMinutes } from '../engine/estimate.mjs';
import { groupCredits } from '../engine/lines.mjs';
import { calvesFloor } from '../engine/volume.mjs';
import { ENGINE_VERSION } from '../engine/version.mjs';
import { loadCompiledModel, INTAKE_DIR } from './helpers/models.mjs';

const model = loadCompiledModel();
const R = model ? model.rules : null;
const EPS = 1e-9;
const NAMES = { '01': '01-swimming', '02': '02-football', '03': '03-soccer', '04': '04-crossfit-style-bootcamp', '05': '05-bootcamp', '06': '06-full-body-aesthetics', '07': '07-push-pull-legs', '08': '08-pickleball-genpop' };
const intakeOf = (n) => JSON.parse(fs.readFileSync(path.join(INTAKE_DIR, NAMES[n] + '.json'), 'utf8'));
const cache = {};
const plan = (n) => { if (!cache[n]) cache[n] = generate(intakeOf(n), model); return cache[n]; };
const planWith = (n, mut) => { const i = intakeOf(n); mut(i); return generate(i, model); };
const stairWeeks = (p) => p.weeks.filter(w => w.block_type === 'stairway');
const mains = (w) => w.days.filter(d => d.kind === 'main');
const items = (w) => w.days.flatMap(d => d.blocks.flatMap(b => b.items.map(it => ({ d, b, it }))));
const check = (p, id) => p.validation.checks.find(c => c.id === id);
const MC = () => R.stairway.min_climb;

/** every trained floored group climbs by the minimum climb (calves 1) and never drops a set; the total climbs (R3-SES-02) */
function everyTrainedGroupClimbs(p) {
  const tbs = p.shape.training_blocks.filter(t => t.type === 'stairway' && !(t.factor && t.factor.flat_sets));
  for (const tb of tbs) {
    const ws = p.weeks.filter(w => w.training_block === tb.n);
    if (ws.some(w => w.circuit)) continue;
    const blk = (p.time_check.by_block || []).find(b => b.training_block === tb.n) || p.time_check;
    const groups = blk.trained_groups.filter(g => p.meta.targets.floor_groups.includes(g));
    assert.ok(groups.length > 0, 'at least one group is trained directly');
    const below = (blk.trained_below_floor || []).map(x => x.group);
    for (const g of groups) {
      const v = ws.map(w => w.weekly_sets_by_group[g]);
      // (v0.4 fix round 1, E-81: a big mover held below its floor climbs at least one set)
      const need = g === 'calves' || below.includes(g) ? MC().calves : (MC().short_block && ws.length <= MC().short_block.max_N ? MC().short_block.group : MC().group);
      assert.ok(v[v.length - 1] - v[0] >= need - 0.5 - EPS, `${g} flat: ${v.join(' ')}`);
      for (let i = 1; i < v.length; i++) assert.ok(v[i] >= v[i - 1] - 0.5 - EPS, `${g} drops at week ${ws[i].n}: ${v[i - 1]} -> ${v[i]}`);
    }
    const tot = ws.map(w => w.total_main_sets);
    assert.ok(tot[tot.length - 1] > tot[0], `total flat ${tot.join(' ')}`);
  }
}
/** every trained group holds 10 sets a week on the main days (calves: the leg-day rule); untrained groups are listed (R3-SES-02) */
function floorsOrListed(p) {
  for (const w of stairWeeks(p)) {
    if (w.circuit) continue;
    const blk = (p.time_check.by_block || []).find(b => b.training_block === w.training_block) || p.time_check;
    const below = (blk.trained_below_floor || []).map(x => x.group);
    for (const g of blk.trained_groups) {
      if (!p.meta.targets.floor_groups.includes(g) || below.includes(g) || g === 'calves') continue;
      assert.ok(w.main_sets_by_group[g] >= R.volume.floor.value - EPS, `w${w.n} ${g} ${w.main_sets_by_group[g]}`);
    }
    for (const x of blk.not_trained_directly) {
      // v0.4 B4 (E-64): a class-model group listed 'class_lift' keeps the day's work lift (the class's strength piece) and nothing else
      // (fix round 2 / F1, E-145: a pattern station - one exercise of the group's pattern, fixed sets - is not direct training)
      const direct = items(w).filter(r => r.d.kind === 'main' && r.it.group === x.group && (groupCredits(model, r.it.credits)[x.group] || 0) >= 1 - EPS &&
        !(x.reason === 'class_lift' && r.it.role === 'work') && r.it.origin !== 'pattern_kept');
      assert.equal(direct.length, 0, `w${w.n} ${x.group} listed (${x.reason}) but trained`);
    }
  }
  assert.ok(check(p, 'V22').pass && check(p, 'H17').pass, JSON.stringify(check(p, 'V22').violations.slice(0, 2)));
}
/** a non-test main day is within its minutes x 1.10; a test day that runs longer says so (warning.test_day_long) */
function daysWithinMinutes(p) {
  for (const w of p.weeks) for (const d of mains(w)) {
    if (d.est_minutes <= d.minutes_limit * R.session.long_day.warn_above_factor + EPS) continue;
    const warned = p.meta.warnings.some(x => (x.key === 'warning.test_day_long' && x.args.day === d.weekday && x.args.week === w.n) || (x.key === 'warning.long_day' && x.args.day === d.weekday));
    assert.ok(w.test && warned, `w${w.n} ${d.weekday} ${d.est_minutes} / ${d.minutes_limit} min`);
  }
}
/** a rep-max test is one top-set item (no credit, not a stairway set) before the lift's planned sets (R2-PER-07) */
// v0.4 fix round 1 (E-91, COACH-R2 R2-PER-07 'instead of that week's top sets'): the rep-max test is one top set that replaces one
// of the lift's planned sets - it carries the lift's credits and its back-off sets follow (flag back_off, a step easier); a lift
// planned at one set keeps the old form (an uncredited top set, then the planned set)
function testsAreTopSets(p) {
  for (const w of p.weeks.filter(x => x.test)) for (const d of w.days) {
    const its = d.blocks.flatMap(b => b.items);
    for (const [k, it] of its.entries()) {
      if (it.role !== 'test' || it.bucket === 'TEST') continue;
      assert.equal(it.sets, 1, it.slot_id);
      const lift = its[k + 1];
      assert.ok(lift && lift.slot_id + '.test' === it.slot_id && lift.exercise_id === it.exercise_id && lift.sets >= 1, `${it.slot_id}: the planned sets follow`);
      if ((lift.flags || []).includes('back_off')) {
        assert.deepEqual(it.credits, lift.credits, it.slot_id);
        // (v0.5 fix round 1, R2-PER-07 / samples 01 / 07 minors: the tested lift opens the day's lifts - 'Test first: ...'; a second
        // tested lift of the day says 'Warm up and work up ...'; one back-off set reads 'This set is ...')
        assert.ok(it.notes.some(n => ['note.test_top_set_replaces', 'note.test_top_set_replaces_later'].includes(n.key)), it.slot_id);
        assert.ok(lift.notes.some(n => ['note.test_back_off', 'note.test_back_off_one'].includes(n.key)), lift.slot_id);
        if (lift.effort && lift.effort.type === 'rir') assert.ok(lift.effort.min >= 2, `${lift.slot_id} back-off RIR ${lift.effort.min}`);
      } else {
        assert.deepEqual(it.credits, {}, it.slot_id);
        assert.ok(it.notes.some(n => n.key === 'note.test_top_set'));
      }
    }
  }
}

describe('engine 0.4.0 RECHECK regressions (compiled model)', { skip: !model && 'model/ not compiled' }, () => {
  test('R3-engine-version: engine 0.4.0, model 1.3.0, no check-in API (R3-VOL-02 / R3-VOL-04)', () => {
    assert.equal(ENGINE_VERSION, '0.7.0');   // (v0.5 V1: structure and volume; 0.6.0: the volume, selection and words packages; 0.7.0: round 5)
    assert.match(model.version, /^1\.3\.0/);
    for (const k of ['adapt', 'adaptWith', 'checkinRow']) assert.equal(GEN[k], undefined);
    // (v0.5, CT-01: no time check in the plan)
    for (const n of Object.keys(NAMES)) { assert.equal(plan(n).engine_version, '0.7.0'); assert.equal('time_check' in plan(n), false); assert.equal('offers' in plan(n), false); }
  });

  // RETIRED in engine 0.5.0 (DECISIONS G): 'R01-days-over-60: no non-test main day runs past 60 x 1.10 min (rest-based minutes, R3-SES-02)'
  //   no day is judged against 60 x 1.10 minutes (CT-01); the minutes are an estimate
  test('R01-test-in-strength-block: a strength test is one top set before the planned sets, never counted as stairway sets', () => testsAreTopSets(plan('01')));

  // ------------------------------------------------------------------------------------------------------ 02 football
  // (v0.4 fix round 1 / F2: the low-amplitude ankle block - low contacts in the ankle bucket - is prep work outside the 12 + 2 count,
  // rules.athletic.f2.ankle_block.outside_athlete_cap; V13 reads it the same way)
  const ankleOut = (it) => !!(R.athletic.f2 && R.athletic.f2.ankle_block && R.athletic.f2.ankle_block.outside_athlete_cap) && it.bucket === 'AP_JUMP_LIMITED_KNEE' && it.athletic && it.athletic.key === 'low_contacts';
  test('R02-athlete-cap: a field athlete never has more than 12 exercises plus the core block on a day (R3-SES-01)', () => {
    const p = plan('02');
    for (const w of p.weeks) for (const d of mains(w)) {
      const n = d.blocks.filter(b => !R.session.outside_cap_blocks.includes(b.kind)).flatMap(b => b.items).filter(it => it.role !== 'test' && it.bucket !== 'TEST' && !ankleOut(it)).length;
      assert.ok(n <= R.session.athlete_cap, `w${w.n} ${d.weekday}: ${n}`);
    }
    assert.ok(check(p, 'V13').pass);
  });
  test('R02-tests-counted: test weeks count the test as one top set with no credit, the lift keeps its planned sets', () => {
    const p = plan('02');
    testsAreTopSets(p);
    const w12 = p.weeks[11];
    // (v0.4 fix round 1, E-91: the test top set counts as one of the lift's planned sets)
    const fromItems = items(w12).reduce((a, r) => a + (r.it.credits.quads || 0) * (r.it.sets || 0), 0);
    assert.equal(Math.round(fromItems * 100) / 100, w12.weekly_sets_by_muscle.quads);
  });
  // RETIRED in engine 0.5.0 (DECISIONS G): 'R02-floor-and-climb: every trained group holds 10 sets and climbs; arms stay helper work (R3-VOL-01)'
  //   read plan.time_check.by_block; the rule that survives (every trained group reaches its final sets, never down, the floor held or said) is asserted on 386 plans by tests/invariants H10 / H17 / H21 / H22 and by tests/v05-structure

  // ------------------------------------------------------------------------------------------------------ 03 soccer
  test('R03-athlete-cap: Monday holds at most 12 exercises plus core (was 14 with 6 athletic stations)', () => {
    const p = plan('03');
    for (const w of p.weeks) for (const d of mains(w)) assert.ok(d.blocks.filter(b => !R.session.outside_cap_blocks.includes(b.kind)).flatMap(b => b.items).filter(it => it.role !== 'test' && it.bucket !== 'TEST' && !ankleOut(it)).length <= R.session.athlete_cap, `w${w.n} ${d.weekday}`);
  });
  // RETIRED in engine 0.5.0 (DECISIONS G): 'R03-stairway-flat: the off-season stairway climbs on every trained group; untrained groups are named'
  //   read plan.time_check.by_block; the rule that survives (every trained group reaches its final sets, never down, the floor held or said) is asserted on 386 plans by tests/invariants H10 / H17 / H21 / H22 and by tests/v05-structure

  // RETIRED in engine 0.5.0 (DECISIONS G): 'R04-wod-room: the WOD holds its short range before a group leaves (room cuts wod_short / wod_hold, OT18)'
  //   the room cuts wod_short / wod_hold are deleted with the time check (CT-01)

  // RETIRED in engine 0.5.0 (DECISIONS G): 'R05-circuit-minutes: a 30-minute bootcamp keeps the groups its circuits can hold at the peak week and names th…'
  //   a 30-minute bootcamp no longer exists (R4-SES-01)

  // RETIRED in engine 0.5.0 (DECISIONS G): 'R06-flat-priorities: every group climbs; the Focus lines (glutes, shoulders) start and end 2 sets higher (R3-S…'
  //   read plan.time_check.by_block; the Focus + 2 sets is asserted by R3-focus-slots and tests/volume
  test('R06-back-below-floor: back, chest, biceps and triceps hold 10 sets a week on the main days (were 6-9 for 12 weeks)', () => {
    const p = plan('06');
    for (const w of stairWeeks(p)) for (const g of ['back', 'chest', 'biceps', 'triceps']) assert.ok(w.main_sets_by_group[g] >= 10 - EPS, `w${w.n} ${g} ${w.main_sets_by_group[g]}`);
  });

  // RETIRED in engine 0.5.0 (DECISIONS G): 'R07-time-model: a heavy work lift costs strength rest (3-6 min), a rep-max test costs its work-up (R3-SES-02, …'
  //   asserted days against the minute limit (rules.session.long_day); the estimate's own numbers are asserted by tests/week and tests/progression
  test('R07-tests-5x3rm: the week-12 test is one top set + the planned sets, not "5 x 3 rep max"', () => testsAreTopSets(plan('07')));
  // RETIRED in engine 0.5.0 (DECISIONS G): 'R07-calves-side-delts-flat: calves and shoulders climb (were flat 6 / 5 -> 6), every PPL group holds its floor'
  //   read plan.time_check.by_block; the rule that survives (every trained group reaches its final sets, never down, the floor held or said) is asserted on 386 plans by tests/invariants H10 / H17 / H21 / H22 and by tests/v05-structure

  // RETIRED in engine 0.5.0 (DECISIONS G): 'R08-side-delts-zero: a floored group is either trained at 10+ or listed as not trained directly - never a 0 / …'
  //   read the time check's lists; a 2-day plan follows R4-SES-03 and credit-only groups are named (warning.credit_only_groups)
  test('R08-calves-per-leg-day: one calf exercise x 3 sets per leg day; the weekly calves floor follows the leg days', () => {
    const p = plan('08');
    assert.ok(check(p, 'V18').pass);
    // (v0.5: 3 sets on each leg day that holds a calf exercise, the optional days' Calves slots carry 2-3 more, the weekly floor is 10)
    assert.deepEqual([2, 3, 4].map(n => calvesFloor(model, n)), [6, 9, 10]);
    assert.equal(calvesFloor(model, 2, 2), 10);
  });

  // ------------------------------------------------------------------------------------------------------ round 3 features
  test('R3-focus-slots: Focus 1 / Focus 2 (focus_muscles) add +2 sets to start and ceiling; a third choice is dropped with a warning', () => {
    const base = intakeOf('06');
    const a = deriveValues({ ...base, priority_muscles: undefined, focus_muscles: ['glutes', 'back', 'chest'] }, model);
    assert.deepEqual(a.focus_lines, ['glutes', 'lats_upper_back']);
    const v = validateIntake({ ...base, priority_muscles: undefined, focus_muscles: ['glutes', 'back', 'chest'] }, model);
    assert.ok(v.ok && v.warnings.some(w => w.key === 'warning.v8_priorities'));
    const none = deriveValues({ ...base, priority_muscles: [] }, model).D9_start_sets;
    // (v0.5: glutes + hamstrings carry ONE hips target for every client type; a glutes Focus makes glutes the carrier, + 2 sets)
    assert.equal(none.start.glutes, null); assert.equal(a.D9_start_sets.start.hamstrings, null);
    // (engine 0.6, converted - DECISIONS G-111: the non-Focus big groups of an advanced 4-day physique week start at 16, so the Focus
    // add is read against the level's own start, VOL-01 '20+ for priority muscles')
    assert.equal(none.start.hamstrings, R.volume.x3.nonfocus_start.start);
    assert.equal(a.D9_start_sets.start.glutes - R.volume.start.glutes[a.D3_client_level.level], R.volume.focus.add_default);
    assert.equal(a.D9_start_sets.cap.lats_upper_back - none.cap.lats_upper_back, R.volume.focus.add_default);
    const vt = deriveValues({ ...base, priority_muscles: ['v_taper', 'glutes'] }, model);
    assert.deepEqual(vt.priority_choices, ['v_taper'], 'v_taper uses both Focus slots');
  });
  test('R3-play-days-event: play days and an event date shape the plan, deterministically', () => {
    const p1 = planWith('08', i => { i.activity.event_date = '2026-11-25'; });
    const p2 = planWith('08', i => { i.activity.event_date = '2026-11-25'; });
    assert.equal(JSON.stringify(p1), JSON.stringify(p2));
    assert.ok(p1.shape.training_blocks.some(t => t.type === 'taper'));
    assert.deepEqual(p1.weeks[0].days.filter(d => d.kind === 'play').map(d => d.weekday), intakeOf('08').activity.play_days);
  });
  test('R3-superset-recommendations: each day lists the pairs that save time, with the minutes saved; items carry the pair', () => {
    for (const n of ['02', '06', '07']) {
      const p = plan(n);
      for (const d of mains(p.weeks[0])) for (const r of d.superset_recommendations) {
        assert.ok(r.items.length >= 2 && r.minutes_saved > 0 && typeof r.on === 'boolean');
        for (const id of r.items) assert.ok(d.blocks.flatMap(b => b.items).some(it => it.slot_id === id && it.superset_suggested === r.pair_id), `${n} ${id}`);
      }
    }
    assert.ok(plan('06').weeks[0].days.some(d => d.superset_recommendations.length > 0));
  });
  test('R3-block-toggles: blocks carry stable ids and on / off switches (athletic and core can be turned off, R3-SES-02)', () => {
    const p = plan('02');
    const ids = (w) => w.days.flatMap(d => d.blocks.map(b => b.id));
    const w1 = new Set(ids(p.weeks[1])), w5 = new Set(ids(p.weeks[5]));
    assert.deepEqual([...w1].sort(), [...w5].sort());
    for (const d of mains(p.weeks[1])) for (const b of d.blocks) {
      assert.match(b.id, /^blk\.[^.]+\.[a-z_]+\.\d+$/);
      assert.equal(b.toggle, !!R.ordering.block_editing.toggle[b.kind], b.id);
      if (['athletic', 'core'].includes(b.kind)) assert.ok(b.toggle && d.toggle_blocks.includes(b.kind));
    }
  });
  // RETIRED in engine 0.5.0 (DECISIONS G): 'R3-full-day-no-lift: a day whose fixed work fills the minutes holds no lift; its groups train on other days or…'
  //   no day is 'filled by the minutes' (CT-01): every day keeps its lifts
  test('R3-validators-no-warning-exemption: a plan that misses a floor fails V22 even with the old floor warnings in it', () => {
    const p = structuredClone(plan('06'));
    for (const d of mains(p.weeks[1])) for (const b of d.blocks) for (const x of b.items) if (x.group === 'back') x.sets = 1;
    p.meta.warnings.push({ code: 'floor', key: 'warning.floor_schedule', args: { muscles: 'back' } });
    p.meta.warnings.push({ code: 'start_lowered', key: 'warning.start_lowered', args: { muscles: 'back', minutes: 75 } });
    const res = validatePlan({ ...p, validation: null }, model);
    assert.equal(res.checks.find(c => c.id === 'V22').pass, false);
  });
  // RETIRED in engine 0.5.0 (DECISIONS G): 'R3-time-check-in-contract: plan.time_check is in the plan (spec D15_time_fit) with offers in numbers'
  //   plan.time_check and plan.offers are removed from plan/2 (CT-01; engine/CONTRACTS.md v0.5)
});
