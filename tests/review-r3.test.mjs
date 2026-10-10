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
import { setCost, testMinutes, groupCredits } from '../engine/timefit.mjs';
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
        assert.ok(it.notes.some(n => n.key === 'note.test_top_set_replaces'), it.slot_id);
        assert.ok(lift.notes.some(n => n.key === 'note.test_back_off'), lift.slot_id);
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
    assert.equal(ENGINE_VERSION, '0.4.0');
    assert.match(model.version, /^1\.3\.0/);
    for (const k of ['adapt', 'adaptWith', 'checkinRow']) assert.equal(GEN[k], undefined);
    for (const n of Object.keys(NAMES)) { assert.equal(plan(n).engine_version, '0.4.0'); assert.ok(plan(n).time_check); }
  });

  // ------------------------------------------------------------------------------------------------------ 01 swimming
  test('R01-stairway-flat: every group the swimmer trains climbs (lats / hamstrings / calves never flat for 12 weeks)', () => everyTrainedGroupClimbs(plan('01')));
  test('R01-validators-exempt: no warning exempts a trained group - each holds its floor, the rest are listed as not trained directly', () => {
    const p = plan('01');
    floorsOrListed(p);
    assert.ok(!p.meta.warnings.some(w => ['warning.floor_schedule', 'warning.start_lowered', 'warning.stairway_time'].includes(w.key)));
    assert.ok(p.time_check.not_trained_directly.length > 0 && p.meta.warnings.some(w => w.key === 'warning.not_trained_directly'));
  });
  test('R01-time-check-up-front: 3 x 60 min cannot hold the full plan - told up front with one more day / longer sessions in numbers', () => {
    const p = plan('01');
    assert.equal(p.time_check.fits, false);
    assert.ok(p.meta.warnings.some(w => w.key === 'warning.time_check'));
    assert.ok(p.time_check.needed_minutes > 60);
    const more = p.offers.find(o => o.key === 'offer.more_days' || o.key === 'offer.more_days_min');
    assert.ok(more && more.args.days === 4);
    assert.equal(p.offers.filter(o => o.chosen).length, 1);
  });
  test('R01-days-over-60: no non-test main day runs past 60 x 1.10 min (rest-based minutes, R3-SES-02)', () => daysWithinMinutes(plan('01')));
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
  test('R02-days-over-90: non-test days stay within 90 x 1.10 min; test days that run longer say so', () => daysWithinMinutes(plan('02')));
  test('R02-floor-and-climb: every trained group holds 10 sets and climbs; arms stay helper work (R3-VOL-01)', () => {
    const p = plan('02');
    floorsOrListed(p); everyTrainedGroupClimbs(p);
    assert.deepEqual(p.time_check.not_trained_directly.map(x => x.reason), ['credit_only', 'credit_only']);
  });

  // ------------------------------------------------------------------------------------------------------ 03 soccer
  test('R03-athlete-cap: Monday holds at most 12 exercises plus core (was 14 with 6 athletic stations)', () => {
    const p = plan('03');
    for (const w of p.weeks) for (const d of mains(w)) assert.ok(d.blocks.filter(b => !R.session.outside_cap_blocks.includes(b.kind)).flatMap(b => b.items).filter(it => it.role !== 'test' && it.bucket !== 'TEST' && !ankleOut(it)).length <= R.session.athlete_cap, `w${w.n} ${d.weekday}`);
  });
  test('R03-stairway-flat: the off-season stairway climbs on every trained group; untrained groups are named', () => {
    const p = plan('03');
    everyTrainedGroupClimbs(p); floorsOrListed(p);
  });

  // ------------------------------------------------------------------------------------------------------ 04 crossfit
  test('R04-floor-flat: the class keeps fewer groups at 10+ sets and climbing instead of 9 muscles below the floor (R3-SES-02)', () => {
    const p = plan('04');
    floorsOrListed(p); everyTrainedGroupClimbs(p);
    assert.ok(p.time_check.not_trained_directly.some(x => x.reason === 'time'));
    const tot = p.summary.total_resistance_sets_by_week;
    assert.ok(tot[tot.length - 1] > tot[0], tot.join(' '));
  });
  test('R04-wod-room: the WOD holds its short range before a group leaves (room cuts wod_short / wod_hold, OT18)', () => {
    const p = plan('04');
    assert.ok(p.weeks[0].why.concat(p.meta.why).some(w => w.key === 'why.wod_short') || p.time_check.fits);
    daysWithinMinutes(p);
  });

  // ------------------------------------------------------------------------------------------------------ 05 bootcamp
  test('R05-v22-circuits: circuits are held to the floor - calves 3 sets a leg day, every kept group at 10+ or listed (no circuit exemption)', () => {
    const p = plan('05');
    assert.ok(check(p, 'V22').pass && check(p, 'V18').pass);
    for (const w of stairWeeks(p)) {
      const blk = p.time_check;
      // (v0.4 fix round 1, E-93: a big group with no donor station keeps its circuit stations below the floor, listed up front)
      const below = (blk.trained_below_floor || []).map(x => x.group);
      for (const g of blk.trained_groups.filter(x => x !== 'calves' && !below.includes(x) && p.meta.targets.floor_groups.includes(x))) assert.ok(w.main_sets_by_group[g] >= 10 - EPS, `w${w.n} ${g} ${w.main_sets_by_group[g]}`);
    }
  });
  test('R05-circuit-minutes: a 30-minute bootcamp keeps the groups its circuits can hold at the peak week and names the rest', () => {
    const p = planWith('05', i => { i.schedule.session_minutes = 30; });
    assert.equal(p.status, 'ok');
    assert.equal(p.time_check.fits, false);
    assert.ok(p.meta.warnings.some(w => w.key === 'warning.time_check'));
    assert.ok(p.time_check.not_trained_directly.some(x => x.reason === 'time'));
    assert.ok(p.offers.some(o => o.key === 'offer.longer_sessions' || o.key.startsWith('offer.more_days')));
    for (const w of p.weeks) for (const d of mains(w)) assert.ok(d.est_minutes <= 30 * R.session.long_day.warn_above_factor + 1 + EPS, `w${w.n} ${d.weekday} ${d.est_minutes}`);
    assert.ok(p.validation.ok, JSON.stringify(p.validation.checks.filter(c => !c.pass && c.severity === 'error').map(c => c.id)));
  });

  // ------------------------------------------------------------------------------------------------------ 06 aesthetics
  test('R06-flat-priorities: every group climbs; the Focus lines (glutes, shoulders) start and end 2 sets higher (R3-SES-01)', () => {
    const p = plan('06');
    everyTrainedGroupClimbs(p); floorsOrListed(p);
    const t = p.meta.targets;
    assert.deepEqual(t.priority, ['glutes', 'shoulders']);
    assert.equal(t.focus_add, R.volume.focus.add_default);
    const s = p.summary.sets_by_line_by_week;
    for (const l of ['glutes', 'shoulders', 'chest', 'lats_upper_back', 'biceps', 'triceps']) assert.ok(s[l][s[l].length - 1] > s[l][0], `${l} ${s[l].join(' ')}`);
  });
  test('R06-back-below-floor: back, chest, biceps and triceps hold 10 sets a week on the main days (were 6-9 for 12 weeks)', () => {
    const p = plan('06');
    for (const w of stairWeeks(p)) for (const g of ['back', 'chest', 'biceps', 'triceps']) assert.ok(w.main_sets_by_group[g] >= 10 - EPS, `w${w.n} ${g} ${w.main_sets_by_group[g]}`);
  });

  // ------------------------------------------------------------------------------------------------------ 07 PPL
  test('R07-time-model: a heavy work lift costs strength rest (3-6 min), a rep-max test costs its work-up (R3-SES-02, VOL-14)', () => {
    const d = deriveValues(intakeOf('07'), model);
    const slot = { bucket: 'RP_HPUSH', role: 'work', time_class: 'compound_bilateral' };
    const work = setCost(slot, { laterality: 'bilateral', bucket: 'RP_HPUSH' }, model, d, { rep_phase: 'VOL2' });
    assert.equal(work.rest_class, 'strength');
    assert.ok(work.rest >= 3 && work.rest <= 6, `rest ${work.rest}`);
    const iso = setCost({ bucket: 'ISO_CHEST', role: 'iso', time_class: 'isolation' }, null, model, d, null);
    assert.ok(iso.minutes < work.minutes);
    assert.equal(testMinutes({ bucket: 'RP_HPUSH', test: 'rm_3_or_work_up_to_1' }, model), R.time_model.test_workup_minutes);
    daysWithinMinutes(plan('07'));
  });
  test('R07-tests-5x3rm: the week-12 test is one top set + the planned sets, not "5 x 3 rep max"', () => testsAreTopSets(plan('07')));
  test('R07-calves-side-delts-flat: calves and shoulders climb (were flat 6 / 5 -> 6), every PPL group holds its floor', () => {
    const p = plan('07');
    everyTrainedGroupClimbs(p); floorsOrListed(p);
    assert.equal(p.time_check.not_trained_directly.length, 0);
  });

  // ------------------------------------------------------------------------------------------------------ 08 pickleball
  test('R08-stairway-flat: the main days are not the same in weeks 1-12 (25 sets flat in weeks 8-12 before); the trained groups climb', () => {
    const p = plan('08');
    everyTrainedGroupClimbs(p);
    const sets = (w) => mains(w).flatMap(d => d.blocks.flatMap(b => b.items)).reduce((a, it) => a + (typeof it.sets === 'number' ? it.sets : 0), 0);
    assert.ok(sets(p.weeks[11]) > sets(p.weeks[0]));
    const t = p.summary.total_resistance_sets_by_week;
    assert.ok(t[11] > t[7], 'weeks 8-12 climb');
  });
  test('R08-side-delts-zero: a floored group is either trained at 10+ or listed as not trained directly - never a 0 / 0 target', () => {
    const p = plan('08');
    floorsOrListed(p);
    const listed = p.time_check.not_trained_directly.map(x => x.group);
    for (const g of p.meta.targets.floor_groups) assert.ok(p.time_check.trained_groups.includes(g) || listed.includes(g), g);
    for (const l of p.meta.targets.lines) assert.ok(p.meta.targets.cap[l] > 0, l);
  });
  test('R08-calves-per-leg-day: one calf exercise x 3 sets per leg day; the weekly calves floor follows the leg days', () => {
    const p = plan('08');
    assert.ok(check(p, 'V18').pass);
    assert.deepEqual([2, 3, 4].map(n => calvesFloor(model, n)), [7, 10, 12]);
  });

  // ------------------------------------------------------------------------------------------------------ round 3 features
  test('R3-focus-slots: Focus 1 / Focus 2 (focus_muscles) add +2 sets to start and ceiling; a third choice is dropped with a warning', () => {
    const base = intakeOf('06');
    const a = deriveValues({ ...base, priority_muscles: undefined, focus_muscles: ['glutes', 'back', 'chest'] }, model);
    assert.deepEqual(a.focus_lines, ['glutes', 'lats_upper_back']);
    const v = validateIntake({ ...base, priority_muscles: undefined, focus_muscles: ['glutes', 'back', 'chest'] }, model);
    assert.ok(v.ok && v.warnings.some(w => w.key === 'warning.v8_priorities'));
    const none = deriveValues({ ...base, priority_muscles: [] }, model).D9_start_sets;
    assert.equal(a.D9_start_sets.start.glutes - none.start.glutes, R.volume.focus.add_default);
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
  test('R3-year-q1-time-check: the year plan\'s flat Q1 block gets the time check too (flat sets, never over the minutes unwarned)', () => {
    const p = planWith('06', i => { i.goal = 'general'; i.priority_muscles = []; i.plan.mode = 'year'; i.schedule.days_per_week = 2; i.schedule.weekdays = ['Mon', 'Thu']; i.schedule.session_minutes = 45; });
    assert.equal(p.status, 'ok');
    const q1 = p.shape.training_blocks[0];
    assert.ok(q1.factor && q1.factor.flat_sets);
    assert.ok(p.time_check.by_block.some(b => b.training_block === q1.n), 'Q1 has its own time check');
    for (const w of p.weeks.filter(x => x.training_block === q1.n)) for (const d of mains(w)) assert.ok(w.test || d.est_minutes <= 45 * 1.10 + EPS, `w${w.n} ${d.weekday} ${d.est_minutes}`);
    assert.ok(p.validation.ok, JSON.stringify(p.validation.checks.filter(c => !c.pass && c.severity === 'error').map(c => c.id + JSON.stringify(c.violations[0]))));
  });
  test('R3-maintenance-time: a maintenance block that cannot hold its structure in the minutes drops groups, warns and offers', () => {
    const p = planWith('06', i => { i.priority_muscles = []; i.plan.mode = 'maintenance_4_6'; i.plan.maint_reason = 'vacation_limited_kit'; i.schedule.days_per_week = 2; i.schedule.weekdays = ['Mon', 'Thu']; i.schedule.session_minutes = 30; });
    assert.equal(p.status, 'ok');
    for (const w of p.weeks) for (const d of mains(w)) assert.ok(d.est_minutes <= 30 * 1.10 + EPS || p.meta.warnings.some(x => x.key === 'warning.time_check'), `${d.weekday} ${d.est_minutes}`);
    if (p.weeks[0].not_trained_directly.length) assert.ok(p.meta.warnings.some(x => x.key === 'warning.not_trained_directly') && p.offers.some(o => o.chosen));
  });
  test('R3-full-day-no-lift: a day whose fixed work fills the minutes holds no lift; its groups train on other days or are named', () => {
    const p = planWith('02', i => { i.schedule.session_minutes = 45; });
    assert.equal(p.status, 'ok');
    assert.equal(p.time_check.fits, false);
    for (const w of p.weeks.filter(x => !x.test && x.block_type === 'stairway')) for (const d of mains(w)) assert.ok(d.est_minutes <= 45 * 1.10 + EPS || p.meta.warnings.some(x => x.key === 'warning.long_day' && x.args.day === d.weekday), `w${w.n} ${d.weekday} ${d.est_minutes}`);
    assert.ok(p.validation.ok, JSON.stringify(p.validation.checks.filter(c => !c.pass && c.severity === 'error').map(c => c.id + JSON.stringify(c.violations[0]))));
  });
  test('R3-validators-no-warning-exemption: a plan that misses a floor fails V22 even with the old floor warnings in it', () => {
    const p = structuredClone(plan('06'));
    for (const d of mains(p.weeks[1])) for (const b of d.blocks) for (const x of b.items) if (x.group === 'back') x.sets = 1;
    p.meta.warnings.push({ code: 'floor', key: 'warning.floor_schedule', args: { muscles: 'back' } });
    p.meta.warnings.push({ code: 'start_lowered', key: 'warning.start_lowered', args: { muscles: 'back', minutes: 75 } });
    const res = validatePlan({ ...p, validation: null }, model);
    assert.equal(res.checks.find(c => c.id === 'V22').pass, false);
  });
  test('R3-time-check-in-contract: plan.time_check is in the plan (spec D15_time_fit) with offers in numbers', () => {
    for (const n of Object.keys(NAMES)) {
      const tc = plan(n).time_check;
      for (const k of ['training_block', 'fits', 'kept_time', 'needed_minutes', 'offered', 'trained_groups', 'not_trained_directly', 'lowered_peak', 'trained_below_floor', 'supersets_recommended', 'supersets_needed', 'by_block']) assert.ok(k in tc, `${n} ${k}`);
      if (!tc.fits) assert.ok(tc.offered && ('extra_day' in tc.offered) && ('session_minutes' in tc.offered), n);
    }
  });
});
