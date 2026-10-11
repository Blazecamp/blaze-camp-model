// tests/review-f1.test.mjs - engine 0.4.0 FIX ROUND 1 / F1 (time, volume and structure) regression tests. One test per fixed issue of
// the coach-eye reviews of the 8 sample plans (grades C- ... D), named R<sample>-<slug> after the reviewed sample, and
// F1-sweep-<intake>-<slug> for an intake of the random sweep (tests/helpers/random-intake.mjs) that the fix round's own changes made
// fail an error check on the way. samples/REVIEW_LOG.md (v0.4 fix round 1) and engine/DECISIONS.md (E-81 ...) list them. Plans
// are built on the compiled model (model/) unless the test says the fixture.
import { describe, test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { generate } from '../engine/generate.mjs';
import { estimateMinutes } from '../engine/week.mjs';
import { circuitWorkSeconds } from '../engine/shape.mjs';
import { validatePlan } from '../engine/validate.mjs';
import { loadCompiledModel, loadFixtureModel, INTAKE_DIR } from './helpers/models.mjs';
import { randomIntake, sportIntake } from './helpers/random-intake.mjs';

const model = loadCompiledModel();
const fixture = loadFixtureModel();
const R = model ? model.rules : null;
const EPS = 1e-9;
const NAMES = { '01': '01-swimming', '02': '02-football', '03': '03-soccer', '04': '04-crossfit-style-bootcamp', '05': '05-bootcamp', '06': '06-full-body-aesthetics', '07': '07-push-pull-legs', '08': '08-pickleball-genpop' };
const intakeOf = (n) => JSON.parse(fs.readFileSync(path.join(INTAKE_DIR, NAMES[n] + '.json'), 'utf8'));
const cache = {};
const plan = (n) => { if (!cache[n]) cache[n] = generate(intakeOf(n), model); return cache[n]; };
const ALL = Object.keys(NAMES);
const items = (w) => w.days.flatMap(d => d.blocks.flatMap(b => b.items.map(it => ({ w, d, b, it }))));
const allItems = (p) => p.weeks.flatMap(items);
const check = (p, id) => p.validation.checks.find(c => c.id === id);
const passes = (p, ids) => { for (const id of ids) assert.ok(check(p, id).pass, `${id}: ${JSON.stringify(check(p, id).violations.slice(0, 2))}`); };
const stairWeeks = (p, tb) => p.weeks.filter(w => w.block_type === 'stairway' && (tb === undefined || w.training_block === tb));
const series = (p, g, tb = 1) => stairWeeks(p, tb).map(w => w.weekly_sets_by_group[g]);
const longestHold = (v) => { let run = 1, best = 1, base = v[0]; for (let i = 1; i < v.length; i++) { if (Math.abs(v[i] - base) < 0.5 - EPS) run++; else { run = 1; base = v[i]; } best = Math.max(best, run); } return best; };
const exOf = (id) => (id && model.hasEx(id) ? model.ex(id) : null);
const BIG = ['quads', 'hips', 'back', 'chest'];

describe('v0.4 fix round 1 / F1: time, volume and structure (coach-eye reviews of the 8 samples)', { skip: !model && 'model/ not compiled' }, () => {
  // RETIRED in engine 0.5.0 (DECISIONS G): 'R04-skill-costed: a skill folded into the warm-up costs its practice minutes (6 min, 3 min at 45 min or less) …'
  //   the skill is no longer folded into the warm-up for short sessions (rules.time_model.skill_in_warmup_* deleted); it is its own block, costed by the estimate
  test('R02-start-at-level: the football plan starts each big group near its level start (the template minimum no longer starts quads at the level ceiling), so every trained group climbs several sets (E-83)', () => {
    const p = plan('02');
    const st = p.meta.stairway[0];
    for (const g of ['quads', 'back', 'chest']) {
      const v = series(p, g);
      assert.ok(v[v.length - 1] - v[0] >= 3 - EPS, `${g}: ${v.join(' ')}`);
    }
    assert.ok(st.cap.quads - st.start.quads >= 3, JSON.stringify(st));
  });

  // RETIRED in engine 0.5.0 (DECISIONS G): 'R01-hold-rules-checked: H21 fails a 12-week plan whose trained big group holds its sets for the second half (f…'
  //   H21 no longer has the flat-second-half / group-hold rules (CX-01: the check is 'final sets reached, never down')
  test('R02-week-2-steps: the stairway follows the planned 3 % / 5 % steps rounded half up - the week total climbs in most weeks and the main days climb by the last week (E-85, VOL-06)', () => {
    for (const n of ['02', '06', '07']) {
      const tot = stairWeeks(plan(n), 1).map(w => w.total_resistance_sets);
      // (v0.5, R4-PRG-01: whole sets fitted to reach the final target in the last week - a week may hold, none goes down, the last
      // week is the highest; was 'the 3 % / 5 % steps rounded half up: the total climbs in all but 2 weeks')
      const rises = tot.slice(1).filter((t, i) => t > tot[i]).length;
      assert.ok(rises >= Math.floor((tot.length - 1) / 2), `${n}: ${tot.join(' ')}`);
      for (let i = 1; i < tot.length; i++) assert.ok(tot[i] >= tot[i - 1], `${n}: ${tot.join(' ')}`);
      assert.equal(tot[tot.length - 1], Math.max(...tot));
      const main = stairWeeks(plan(n), 1).map(w => w.total_main_sets);
      assert.ok(main[main.length - 1] > main[0], `${n}: ${main.join(' ')}`);
    }
  });
  test('R01-added-exercise-entry: an exercise the stairway adds opens at 2+ sets (never a 1-set station), at an exercise-block start, or on an optional day while 2+ weeks of the exercise block remain (E-86, PER-02, VOL-16)', () => {
    for (const n of ALL) {
      const p = plan(n);
      const seen = new Set();
      for (const w of p.weeks) for (const x of items(w)) {
        if (!['bonus', 'focus_added'].includes(x.it.origin) || !x.it.exercise_id) continue;
        assert.ok(x.it.sets >= 2, `${n} ${x.it.slot_id} w${w.n}: ${x.it.sets} set(s)`);
        if (seen.has(x.it.slot_id)) continue;
        seen.add(x.it.slot_id);
        const eb = p.shape.exercise_blocks.find(e => e.n === w.exercise_block);
        const pos = w.n - eb.weeks[0], len = eb.weeks[eb.weeks.length - 1] - eb.weeks[0] + 1;
        const tbStart = !p.weeks.some(o => o.n === w.n - 1 && o.training_block === w.training_block);
        assert.ok(tbStart || pos === 0 || (x.d.kind === 'optional' && pos <= len - 2), `${n} ${x.it.slot_id} opens in week ${w.n} (exercise block ${eb.weeks.join('-')})`);
      }
    }
  });
  test('R06-added-compound-order: an added compound sits before its block\'s isolations on a main day (E-87, ORD-01 big before small)', () => {
    for (const n of ALL) {
      const p = plan(n);
      for (const w of p.weeks) for (const d of w.days.filter(x => x.kind === 'main')) for (const b of d.blocks) {
        const its = b.items;
        its.forEach((it, i) => {
          const ex = exOf(it.exercise_id);
          if (!['bonus', 'focus_added'].includes(it.origin) || !ex || ex.exercise_class !== 'compound') return;
          const isoBefore = its.slice(0, i).filter(o => o.origin === 'template' && exOf(o.exercise_id) && exOf(o.exercise_id).exercise_class === 'isolation' && !o.superset);
          assert.equal(isoBefore.length, 0, `${n} w${w.n} ${d.weekday}: ${it.exercise_id} after ${isoBefore.map(o => o.exercise_id).join(', ')}`);
        });
      }
    }
  });
  test('R02-calves-cap: a field athlete\'s calves climb 1-2 sets from one exercise x 3 sets per leg day (not 18 -> 21 on 6 days); the optional-day calf slot only below 4 main leg days (E-88, R3-SES-01)', () => {
    const p = plan('02');
    const t = p.meta.targets;
    assert.ok(t.cap.calves - t.start.calves <= R.volume.calves.athlete_climb, JSON.stringify([t.start.calves, t.cap.calves]));
    const v = series(p, 'calves');
    assert.ok(v[v.length - 1] - v[0] <= R.volume.calves.athlete_climb + 0.5 + EPS, v.join(' '));
    assert.ok(v[0] <= 3 * 4 + EPS, `week 1 calves ${v[0]}`);
    assert.ok(!allItems(plan('02')).some(x => x.d.kind === 'optional' && x.it.bucket === 'ISO_CALF'), '02: optional-day calf exercise with 4 calf leg days');
    // v0.5 (R4-SES-05; OBSERVED BYOP): the A day holds the calf exercise, the B day the side raise - 2 calf leg days a week, so the
    // optional days' Calves slot is used (rules.volume.calves.optional_slot_below_leg_days) and the calves reach their weekly floor
    const p6 = plan('06');
    assert.ok(allItems(p6).some(x => x.d.kind === 'optional' && x.it.bucket === 'ISO_CALF'), '06: the optional-day Calves slot');
    for (const w of stairWeeks(p6)) assert.ok(w.weekly_sets_by_group.calves >= R.volume.calves.weekly_floor - EPS, `06 w${w.n} calves ${w.weekly_sets_by_group.calves}`);
  });
  test('R03-hips-one-target: outside the physique / strength plans glutes + hamstrings carry ONE hips target (the hamstrings line; glutes follow as credit), so the soccer player\'s hips no longer run at 1.6-1.8 x the other groups (E-84, R3-SES-01)', () => {
    const p = plan('03');
    assert.notEqual(p.meta.targets.fill.glutes, 'target');
    const last = stairWeeks(p, 1).slice(-1)[0].weekly_sets_by_group;
    const other = Math.max(last.quads, last.back, last.chest);
    assert.ok(last.hips <= 1.35 * other + EPS, `hips ${last.hips} vs ${other}`);
    // the physique plans keep two lines (their own weekly sets)
    assert.equal(plan('06').meta.targets.fill.glutes, 'target');
  });
  // RETIRED in engine 0.5.0 (DECISIONS G): 'R03-calves-kept: the soccer player's calves are trained (one exercise x 3 sets a leg day) instead of dropped …'
  //   calves are never dropped for time (CT-01); one calf exercise x 3 sets on its leg days is asserted by tests/v05-structure VOL-17
  test('R06-shoulders-absolute-cap: no line\'s weekly sets (every day, helper credit included) climb past the Focus / priority ceiling of 30 - shoulders stop at 30 (E-95, BRAIN §5.9); V13 fails a plan that does (line_absolute_cap)', () => {
    const p = plan('06');
    const ABS = R.volume.priority.absolute_cap;
    for (const w of stairWeeks(p)) for (const [l, v] of Object.entries(w.weekly_sets_by_line)) assert.ok(v <= ABS + EPS || v <= stairWeeks(p)[0].weekly_sets_by_line[l] + EPS, `w${w.n} ${l} ${v}`);
    const bad = structuredClone(p);
    const ws = stairWeeks(bad);
    ws[ws.length - 1].weekly_sets_by_line.shoulders = ABS + 1;
    const v13 = validatePlan(bad, model).checks.find(c => c.id === 'V13');
    assert.ok(!v13.pass && v13.violations.some(x => x.args && x.args.rule === 'line_absolute_cap'), JSON.stringify(v13.violations.slice(0, 2)));
  });

  // ------------------------------------------------------------------------------------------------------ tests and structure
  test('R07-test-replaces-top-set: a strength test is that week\'s top set - the work-up replaces one planned set (it counts, with the lift\'s credits) and the remaining sets are back-off sets a step easier (E-91, R2-PER-07)', () => {
    const RT = R.tests.replaces_top_set;
    let n = 0;
    for (const s of ALL) {
      const p = plan(s);
      for (const w of p.weeks) for (const x of items(w)) {
        if (!x.it.slot_id.endsWith('.test') || !x.it.exercise_id || x.it.role !== 'test') continue;
        const base = items(w).find(o => o.it.slot_id === x.it.slot_id.replace(/\.test$/, ''));
        if (!base) continue;
        n++;
        assert.equal(x.it.sets, 1, `${s} w${w.n} ${x.it.slot_id}`);
        assert.ok(Object.keys(x.it.credits || {}).length > 0, `${s} ${x.it.slot_id}: the top set counts`);
        if (base.it.sets >= 1 && (base.it.flags || []).includes('back_off')) {
          assert.ok(base.it.effort && base.it.effort.min >= RT.back_off_rir_min, `${s} ${base.it.slot_id} back-off RIR ${JSON.stringify(base.it.effort)}`);
        }
      }
      passes(p, ['V14', 'V17', 'V25']);
    }
    assert.ok(n > 0);
    // the football squat test: 1 top set + 2 back-off sets for the 3 planned
    const w12 = plan('02').weeks[11];
    const sq = items(w12).find(x => x.it.slot_id === 'Mon.A1.s09');   // (v0.5 slot order: the squat is the day's second lift)
    assert.ok(sq && (sq.it.flags || []).includes('back_off'), JSON.stringify(sq && sq.it.flags));
  });
  test('R02-no-long-lever-max: no rep-max test on a stiff-leg / Romanian deadlift (a long-lever hamstring lift) for an athlete (E-91)', () => {
    for (const s of ALL) for (const x of allItems(plan(s))) {
      if (!x.it.slot_id.endsWith('.test') || !x.it.exercise_id) continue;
      assert.ok(!/rdl|romanian|stiff-leg/i.test(x.it.exercise_id), `${s} ${x.it.slot_id} ${x.it.exercise_id}`);
    }
  });
  test('R04-test-work-lift: the class tests its work lifts (front squat, the press, the deadlift) - never a 10-rep chest accessory done after the press (E-91)', () => {
    const p = plan('04');
    const tests = allItems(p).filter(x => x.it.slot_id.endsWith('.test') && x.it.exercise_id && x.it.role === 'test');
    assert.ok(tests.length > 0);
    for (const x of tests) {
      const base = items(x.w).find(o => o.it.slot_id === x.it.slot_id.replace(/\.test$/, ''));
      assert.ok(base && base.it.role === 'work', `${x.it.slot_id} tests a ${base && base.it.role}`);
    }
    passes(p, ['V12', 'H04']);
  });
  test('R07-block-ids: every block id is unique within its week and follows blk.<weekday>-<day type>.<kind>.<n> (no spaces; Monday and Thursday Push differ) (E-90)', () => {
    for (const s of ALL) for (const w of plan(s).weeks) {
      const ids = w.days.flatMap(d => d.blocks.map(b => b.id)).filter(Boolean);
      assert.equal(new Set(ids).size, ids.length, `${s} w${w.n}: ${ids.filter((x, i) => ids.indexOf(x) !== i).join(', ')}`);
      for (const id of ids) assert.match(id, /^blk\.[a-z]{3}-[a-z0-9-]+\.[a-z_]+\.\d+$/, `${s} ${id}`);
    }
  });
  test('R07-supersets-recommended: every main day recommends its eligible pairs beyond the core pair (two exercises back to back, minutes saved), so the plan can save the time it asks for (E-90, R3-SES-02 step 3)', () => {
    for (const s of ['07', '08', '06']) {
      const p = plan(s);
      for (const w of stairWeeks(p)) for (const d of w.days.filter(x => x.kind === 'main')) {
        const recs = (d.superset_recommendations || []).filter(r => r.pair_id !== 'core_pair');
        const strength = d.blocks.filter(b => ['strength', 'accessories'].includes(b.kind)).flatMap(b => b.items).filter(it => it.sets > 0);
        if (strength.length < 2) continue;
        // engine 0.5.0 / V4 (converted; DECISIONS G-56): a push day in the order of the coach's sheet (press, press, incline, flies,
        // dips, triceps, triceps - OBSERVED BYOP PUSHPULLLEGS) has no two neighbours that do not compete; pairs are only suggested
        // between neighbours (G-15), so that day recommends the core pair alone
        if (d.skeleton === 'ppl_push') continue;
        assert.ok(recs.length >= 1, `${s} w${w.n} ${d.weekday}: no pair recommended`);
        for (const r of recs) {
          assert.equal(r.items.length, 2);
          assert.ok(r.minutes_saved > 0);
          // (back to back: next to each other in the day's order, a block's last exercise and the next block's first at most)
          const order = d.blocks.flatMap(b => b.items.map(it => it.slot_id));
          assert.equal(Math.abs(order.indexOf(r.items[0]) - order.indexOf(r.items[1])), 1, `${s} w${w.n} ${d.weekday} ${r.pair_id}: ${r.items.join(' + ')} not back to back`);
        }
      }
    }
  });
  test('R05-hinge-kept: a big group short of its circuit floor never takes a day\'s lead station - Wednesday\'s "hinge + presses" keeps its hinge; a swapped station is never labelled a bonus (E-93)', () => {
    const p = plan('05');
    for (const w of stairWeeks(p)) {
      const wed = w.days.find(d => d.weekday === 'Wed');
      const circ = wed.blocks.filter(b => b.kind === 'circuit').flatMap(b => b.items);
      assert.ok(circ.some(it => it.bucket === 'RP_BHD' && it.sets > 0), `w${w.n}: ${circ.map(it => it.bucket).join(' ')}`);
      for (const d of w.days) for (const b of d.blocks.filter(x => x.kind === 'circuit')) for (const it of b.items) assert.notEqual(it.origin, 'bonus', `${d.weekday} ${it.slot_id}`);
    }
    // fix round 2 / F1 (E-149 / E-150; RECHECK v0.4 05 major 'chest held at 9 below the floor'): Friday's circuit trains chest with a
    // press of its own and the side raises give their group-credit room, so the chest reaches its floor without trading the hinge
    // (v0.5: no time-check list; a group the circuit cannot hold at the floor is said in meta.stairway[].below_floor)
    assert.ok(!(p.meta.stairway[0].below_floor || []).includes('chest'), JSON.stringify(p.meta.stairway[0].below_floor));
    for (const w of stairWeeks(p)) assert.ok((w.weekly_sets_by_group.chest || 0) >= R.volume.floor.value - EPS, `w${w.n} chest ${w.weekly_sets_by_group.chest}`);
  });
  test('R05-side-raise-kept: the template\'s side raise stays (no forced rear-delt swap); the rows count toward the rear delts (rules.volume.rear_from_rows_min, R3-VOL-01) and V18 passes (E-93)', () => {
    const p = plan('05');
    const fri = p.weeks[0].days.find(d => d.weekday === 'Fri');
    const s09 = fri.blocks.flatMap(b => b.items).find(it => it.slot_id === 'Fri.BC3.s09');
    assert.ok(s09 && s09.origin === 'template', JSON.stringify(s09 && [s09.exercise_id, s09.origin]));
    assert.equal(R.volume.rear_from_rows_min, 1.5);
    passes(p, ['V18']);
  });
  // (converted in v0.5: the per-week 7 % limit is gone with rules.stairway.limits.planned_step_max; the coach's reviewed seconds stay)
  test('R05-circuit-top: the circuit work seconds climb every week by the approved steps from the configured start, ending at or under the top (E-93, E-153, R3-VOL-04)', () => {
    const p = plan('05');
    const ws = stairWeeks(p).map(w => w.circuit && w.circuit.work_s);
    // v0.5 fix round 2 (converted; DECISIONS G 'Tests converted in fix round 2'): the plan's own seconds are the 5-s timer steps of
    // rules.supersets.bootcamp.x2.work_s_values (sample 05 major) - never down, a number held two weeks at most
    for (let i = 1; i < ws.length; i++) { assert.ok(ws[i] >= ws[i - 1], ws.join(' ')); if (i > 1) assert.ok(ws[i] > ws[i - 2], ws.join(' ')); }
    const steps = { 2: 0.03, 3: 0.03, 4: 0.03, 5: 0.05, 6: 0.05, 7: 0.05, 8: 0.05 };
    const cw = circuitWorkSeconds(8, steps, { ...R.supersets.bootcamp.stairway, work_s_start: 35, work_s_max: 50 });
    // (fix round 2 / F1, E-153: the coach's 05 review 'work-time steps' - the approved 3 % / 5 % steps from 35 s end at 46 s; a
    // longer stairway lowers the start so the end stays at or under 50 s)
    assert.deepEqual(cw, [35, 36, 37, 38, 40, 42, 44, 46]);
    assert.deepEqual(ws, circuitWorkSeconds(8, steps, { ...R.supersets.bootcamp.stairway, work_s_start: 35, work_s_max: 50 }, R.supersets.bootcamp.x2));
    assert.deepEqual(ws, [35, 35, 40, 40, 45, 45, 50, 50]);
    const s12 = Object.fromEntries(Array.from({ length: 11 }, (_, i) => [String(i + 2), i + 2 <= 6 ? 0.03 : 0.05]));
    const c12 = circuitWorkSeconds(12, s12, { ...R.supersets.bootcamp.stairway, work_s_start: 35, work_s_max: 50 });
    assert.ok(c12[11] <= 50 && c12[0] < 35, c12.join(' '));
  });
  test('R01-prehab-no-credit: joint care (easy, controlled survival work) credits no muscle - it never pads the shoulders or the calves (E-89, R2-VOL-06)', () => {
    assert.equal(R.prehab.credits, 'none');
    for (const s of ALL) for (const x of allItems(plan(s))) if (x.b.kind === 'prehab') assert.deepEqual(x.it.credits || {}, {}, `${s} ${x.it.slot_id}`);
  });
  test('R08-cuff-main-day: the 50+ racket player\'s rotator-cuff care sits on a main day every week, not only on the optional day (E-89, R3-ATH-04)', () => {
    const p = plan('08');
    // (v0.5 fix round 1: the rear-delt slot of a training day carries the shoulder care - flag 'joint_care', rules.prehab.x1)
    for (const w of stairWeeks(p)) assert.ok(items(w).some(x => x.d.kind === 'main' && ((x.b.kind === 'prehab' && x.it.bucket === 'RECOVERY_ARM_CARE') || ((x.it.flags || []).includes('joint_care') && x.it.bucket === 'ISO_SIDE_REAR_DELT'))), `week ${w.n}`);
  });
  test('R08-one-calf-exercise: no day holds a calf exercise and a calf-raise joint-care item together (the Achilles care becomes a shin exercise; calves: one exercise a leg day) (E-89)', () => {
    for (const s of ALL) for (const w of plan(s).weeks) for (const d of w.days) {
      const its = d.blocks.flatMap(b => b.items.map(it => ({ b, it })));
      const calf = its.filter(x => x.b.kind !== 'prehab' && x.it.bucket === 'ISO_CALF' && x.it.sets > 0);
      const calfCare = its.filter(x => x.b.kind === 'prehab' && /calf-raise/.test(x.it.exercise_id || ''));
      assert.ok(!(calf.length && calfCare.length), `${s} w${w.n} ${d.weekday}`);
    }
  });
  test('R08-no-arm-focus: the optional day holds no Focus curl / kickback for arms that are credit-only or have no direct sets in the plan (\'Extra exercise to reach your weekly sets\' with no target to reach; E-96)', () => {
    const p = plan('08');
    for (const x of allItems(p)) {
      if (x.d.kind !== 'optional' || !x.it.exercise_id) continue;
      assert.ok(!['ISO_BICEP', 'ISO_TRICEP'].includes(x.it.bucket) && !['biceps', 'triceps'].includes(x.it.group), `w${x.w.n} ${x.it.slot_id} ${x.it.exercise_id}`);
    }
  });
  test('R08-r3-pending: every round-3 answer is approved - no plan lists one as pending (rules.r3_approved)', () => {
    assert.equal(R.r3_approved.length, 13);
    for (const s of ALL) assert.deepEqual(plan(s).meta.r3_pending || [], [], s);
  });
  test('R03-olympic-day-title: the day titled for its Olympic lift keeps the Olympic lift - the budget trims the exposure on the day with the most athletic stations (E-90)', () => {
    const p = plan('03');
    for (const w of stairWeeks(p)) {
      const fri = w.days.find(d => d.weekday === 'Fri');
      assert.ok(fri.blocks.some(b => b.kind === 'power' && b.items.some(it => it.bucket === 'AP_TRIPLE_EXT' && it.sets > 0)), `week ${w.n}`);
    }
  });

  // ------------------------------------------------------------------------------------------------------ the sweep
  test('F1-sweep-peak-reachable: the ceiling is what the peak allocation holds and an optional-day entry never overshoots it, so the weekly steps reach it (random 2, 5, 56 on the fixture: back held 8 weeks under a ceiling of 13 the peak never held; E-92)', () => {
    for (const i of [2, 5, 56]) {
      const p = generate(randomIntake(i, fixture), fixture);
      passes(p, ['H21', 'H22']);
    }
  });
  test('F1-sweep-ceiling-counts-main-days: the main days\' 7 % ceiling no longer stops an optional-day entry; the all-days total stays under V15\'s 10 % (random 112: back held 5 weeks; E-86)', () => {
    for (const m of [fixture, model]) {
      const p = generate(randomIntake(112, m), m);
      passes(p, ['H21', 'V15']);
    }
  });
  test('F1-sweep-main-total-climbs: a block whose whole climb sits on the optional day fails the time check\'s verification like a flat group (water polo 4 x 30 min; H21 total_flat; E-86)', () => {
    const k = fixture.profiles.picker.sports.findIndex(s => s.id === 'water_polo');
    const p = generate(sportIntake(k, fixture), fixture);
    passes(p, ['H21']);
  });
  test('F1-sweep-late-entry: an entry the week\'s ceiling held back opens later in the exercise block only up to a set ahead of next week\'s target (random 1290: chest held 8 weeks; ice hockey: chest 10 for 7 weeks; E-86)', () => {
    passes(generate(randomIntake(1290, fixture), fixture), ['H21']);
    const k = fixture.profiles.picker.sports.findIndex(s => s.id === 'ice_hockey');
    passes(generate(sportIntake(k, fixture), fixture), ['H21']);
  });
  test('F1-sweep-absolute-cap-hold: a back line that reaches the absolute ceiling of 30 (helpers included) holds there without failing H21\'s hold rules (random 899, 6 x 75 L3; E-95)', () => {
    for (const m of [fixture, model]) {
      const p = generate(randomIntake(899, m), m);
      passes(p, ['H21', 'V13']);
      for (const w of stairWeeks(p)) assert.ok(w.weekly_sets_by_line.lats_upper_back <= m.rules.volume.priority.absolute_cap + EPS);
    }
  });
  test('F1-sweep-class-press-test: a class model\'s test on its vertical press work lift takes the work lift\'s H-before-V exemption (random 454, 482, 587; E-91)', () => {
    for (const i of [454, 482, 587]) passes(generate(randomIntake(i, fixture), fixture), ['V12', 'H04']);
  });
  test('F1-sweep-rear-with-back: a week whose back the time check leaves untrained (no row left) is not judged on the rear delts - they are worked with the back (R3-VOL-01; random 349, 411, 761; E-93)', () => {
    for (const i of [349, 411, 761]) {
      const p = generate(randomIntake(i, fixture), fixture);
      passes(p, ['V18']);
    }
  });
});
