// tests/volume.test.mjs - engine/volume.mjs (CONTRACTS §4.5, §8, §9; 12_volume_algorithm_v1 v1.1). Owner: B2.
// Runs on the fixture and on model/ when present. planWeeklySets is exercised with tests/helpers/simple-layout.mjs and with
// hand-built layouts (VOL-07 order, day alternation, the strict 10 % total ceiling with staggering).
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { loadFixtureModel, loadCompiledModel, loadSample } from './helpers/models.mjs';
import { simpleLayout, simpleFill, simpleSelection } from './helpers/simple-layout.mjs';
import { deriveValues } from '../engine/intake.mjs';
import { buildShape } from '../engine/shape.mjs';
import { computeTargets, stairwayPlan, stairwayFrom, planWeeklySets, athleticBudget, weeklyCredits } from '../engine/volume.mjs';
import { roundHalfUp } from '../engine/util.mjs';

const MODELS = [['fixture', loadFixtureModel()]];
try { const c = loadCompiledModel(); if (c) MODELS.push(['model', c]); } catch (e) { /* fixture only */ }

const EPS = 1e-9;
const clone = (o) => JSON.parse(JSON.stringify(o));
const sample = (n, mut) => { const i = clone(loadSample(n)); if (mut) mut(i); return i; };
const whole = (T) => T.map(x => Math.floor(x + EPS));
const close = (a, b, tol, msg) => assert.ok(Math.abs(a - b) <= tol, `${msg || ''} ${a} vs ${b}`);

/** derived + shape + simple layouts + selections + the volume plan */
function planFor(model, intake) {
  const d = deriveValues(intake, model);
  const sh = buildShape(d, model);
  const layouts = sh.training_blocks.map(tb => simpleLayout(model,
    tb.type === 'in_season' ? 'athletic.2' : d.D6_week_layout.template_id, tb.type === 'in_season' ? 'in_season' : d.D6_week_layout.variant,
    d.weekdays, d.session_minutes, { priority: d.priority_muscles }));
  const selections = sh.exercise_blocks.map(eb => simpleSelection(layouts[eb.training_block - 1], model, eb.n));
  const vp = planWeeklySets({ derived: d, shape: sh, layouts, selections, model, fillSlot: (slot) => simpleFill(slot, model) });
  return { d, sh, layouts, selections, vp };
}

/** hand-built one-block layout: spec = [{weekday, slots:[{bucket, ex, sets, variant?}]}] */
function craft(model, spec) {
  const fills = {};
  const days = spec.map(({ weekday, slots }) => ({
    weekday, day_type: 'X', kind: 'main', optional: false, label_key: 'day.x', lower_focus: null, full_body: true, format: 'straight',
    minutes_limit: 240, supersets_on: false, est_minutes: 0, groups: [],
    blocks: [{ kind: 'accessories', movable: false, circuit: null, slots: slots.map((s, k) => {
      const id = `${weekday}.X.s${String(k + 1).padStart(2, '0')}`;
      const ex = model.ex(s.ex);
      fills[id] = { slot_id: id, bucket: s.bucket, exercise_id: ex.id, detail: null, swaps: [], laterality: ex.laterality, loading: null, why: [], flags: [] };
      return {
        slot_id: id, station_id: `X.s${k + 1}`, bucket: s.bucket, role: 'iso', block: 'accessories', group: ex.primary_muscle ? model.groupOf(ex.primary_muscle) : null,
        sets_hint: null, default_sets: s.sets, pair: null, superset: null, circuit: null, axial_req: null, variant: s.variant || null,
        laterality_dial: false, loading: null, focus_muscle: null, time_class: model.bucket(s.bucket).time_class || 'isolation',
        counts_in_cap: true, counts_as_volume: true, text_key: null, aerobic: null, origin: 'template', why: []
      };
    }) }], why: []
  }));
  return { layout: { template_id: 'x', variant: null, family: 'aesthetics', pairing: 'same_pattern', program_id: 'X', training_block: 1, days, off_days: [], play_days: [], why: [] },
    selection: { exercise_block: 1, fills, buy_list: [], why: [] } };
}

/** derived whose D9 is replaced by crafted targets (muscle -> [start, cap]) */
function craftedDerived(model, level, targets, extra = {}) {
  const base = deriveValues(sample('06', i => { i.priority_muscles = []; }), model);
  const start = {}, cap = {}, fill = {};
  for (const m of model.rules.muscles.order) {
    const def = model.rules.muscles.defs[m];
    if (!def.target) { fill[m] = def.fill; continue; }
    if (targets[m]) { start[m] = targets[m][0]; cap[m] = targets[m][1]; fill[m] = 'target'; } else { start[m] = null; cap[m] = null; fill[m] = 'credit'; }
  }
  const D9 = { modifier_id: 'aesthetics', start, cap, fill, priority: extra.priority || [], pain_muscles: [], floored: extra.floored || [],
    credit_only: Object.keys(start).filter(m => start[m] === null), calves_per_leg_day: 3, core_block: { exercises: 2, sets: 2 }, why: {} };
  return { ...base, D3_client_level: { ...base.D3_client_level, level }, D9_start_sets: D9, priority_muscles: extra.priority || [], session_minutes: 120 };
}
const firstEx = (model, pred) => model.exercises().find(pred).id;
// the crafted placement tests check the VOL-07 order and the weekly ceiling, not the v1.2 capacity sizing (D-67, tested on the
// samples below): the same model without rules.stairway.capacity
const noCap = (model) => ({ ...model, rules: { ...model.rules, stairway: { ...model.rules.stairway, capacity: null } } });

for (const [mname, model] of MODELS) {
  describe(`volume.stairwayPlan (${mname})`, () => {
    const one = (S, C, N, opts = {}) => {
      const t = { start: { chest: S, quads: 10 }, cap: { chest: C, quads: 30 }, fill: { chest: 'target', quads: 'target' },
        priority: opts.priority || [], pain_muscles: opts.pain || [] };
      return stairwayPlan(t, { n: 1, stair_N: N, factor: null }, { age: opts.age || 30 }, model);
    };

    it('single-muscle stairways of CONTRACTS §4.5 (12 v1.1 §3.7.1): L1 / L2 / L3 at 12 weeks, L2 at 8 weeks', () => {
      let p = one(10, 14, 12); close(p.lambda.chest, 0.76, 0.001, 'L1 lambda');
      assert.deepEqual(whole(p.T.chest), [10, 10, 10, 10, 10, 11, 11, 12, 12, 12, 13, 14]);
      p = one(15, 22, 12); close(p.lambda.chest, 0.867, 0.001, 'L2 lambda');
      assert.deepEqual(whole(p.T.chest), [15, 15, 15, 16, 16, 17, 17, 18, 19, 20, 21, 22]);
      p = one(20, 25, 12); close(p.lambda.chest, 0.501, 0.001, 'L3 lambda');
      assert.deepEqual(whole(p.T.chest), [20, 20, 20, 20, 21, 21, 22, 22, 23, 23, 24, 25]);
      p = one(15, 22, 8); assert.equal(p.lambda.chest, 1);
      assert.deepEqual(whole(p.T.chest), [15, 15, 15, 16, 17, 18, 18, 19]);
    });

    it('the 12 v1.1 table: 8-week L1 / L3, small muscles, rear delts, priority muscles', () => {
      assert.deepEqual(whole(one(10, 14, 8).T.chest), [10, 10, 10, 10, 11, 12, 12, 13]);
      const l3 = one(20, 25, 8); close(l3.lambda.chest, 0.78, 0.005); assert.deepEqual(whole(l3.T.chest), [20, 20, 20, 21, 22, 23, 24, 25]);
      assert.deepEqual(whole(one(12, 22, 12).T.chest), [12, 12, 12, 13, 13, 13, 14, 15, 16, 16, 17, 18]);
      assert.deepEqual(whole(one(4, 8, 12).T.chest), [4, 4, 4, 4, 4, 4, 4, 5, 5, 5, 5, 6]);
      assert.deepEqual(whole(one(19, 28, 12, { priority: ['chest'] }).T.chest), [19, 19, 20, 20, 21, 21, 22, 23, 24, 25, 26, 28]);
      const p26 = one(26, 30, 12, { priority: ['chest'] }); close(p26.lambda.chest, 0.32, 0.001);
      assert.deepEqual(whole(p26.T.chest), [26, 26, 26, 26, 27, 27, 27, 28, 28, 29, 29, 30]);
      assert.deepEqual(whole(one(26, 30, 8, { priority: ['chest'] }).T.chest), [26, 26, 26, 27, 27, 28, 29, 30]);
    });

    it('stairway shape (H21, R2-PER-03/04): steps <= 7 %, early steps never larger than late ones, T never drops, T(N) = cap when lambda < 1', () => {
      for (const N of [2, 4, 6, 8, 10, 12, 16]) for (const [S, C] of [[10, 14], [15, 22], [20, 25], [26, 30], [6, 11], [20, 20]]) {
        const p = one(S, C, N);
        const st = model.stair(N);
        const steps = p.steps.chest;
        assert.equal(steps[0], 0);
        assert.ok(steps.every(s => s <= model.rules.stairway.limits.planned_step_max + EPS));
        const early = steps.slice(1, st.halfway), late = steps.slice(st.halfway);
        if (early.length && late.length) assert.ok(Math.max(...early) <= Math.min(...late) + 1e-12, `N=${N} ${S}->${C}`);
        for (let w = 1; w < N; w++) assert.ok(p.T.chest[w] >= p.T.chest[w - 1] - EPS);
        if (p.lambda.chest < 1) assert.equal(p.T.chest[N - 1], C);
        assert.ok(p.T.chest[N - 1] <= C + EPS);
      }
    });

    it('chest 20 -> 22 (VOL-04 example) climbs to its cap and never jumps 2 sets in a week; 10 % is never a planned step', () => {
      const p = one(20, 22, 8);
      assert.equal(p.T.chest[7], 22);
      for (let w = 1; w < 8; w++) assert.ok(p.T.chest[w] - p.T.chest[w - 1] < 2, 'never +2 sets in one week');
      assert.ok(Math.max(...p.steps.chest) < 0.10 && Math.max(...p.steps.chest) <= 0.07);
      assert.ok(20 * (1 + model.rules.stairway.limits.planned_step_max) < 22, 'the 7 % ceiling cannot plan 20 -> 22 in one week');
    });

    it('non-priority muscles step <= 3 % while a priority runs; 60+ <= 3 %; pain: frozen 2 weeks then <= 3 % (D-11)', () => {
      const pri = one(15, 22, 12, { priority: ['quads'] });
      assert.ok(pri.steps.chest.every(s => s <= 0.03 + EPS));
      const old = one(15, 22, 12, { age: 64 });
      assert.ok(old.steps.chest.every(s => s <= 0.03 + EPS));
      const pain = one(6, 11, 12, { pain: ['chest'] });
      assert.deepEqual(pain.steps.chest.slice(0, 3), [0, 0, 0]);
      assert.ok(pain.steps.chest.slice(3).every(s => s > 0 && s <= 0.03 + EPS));
      assert.deepEqual(whole(pain.T.chest).slice(0, 4), [6, 6, 6, 6]);
      assert.equal(whole(pain.T.chest)[11], 7, 'about 6 -> 7 (CONTRACTS §9 sample 08)');
    });

    it('year-plan blocks one / two cycles up (start x 1.05 half up, cap + 1)', () => {
      const t = { start: { chest: 15 }, cap: { chest: 22 }, fill: { chest: 'target' }, priority: [], pain_muscles: [] };
      const p2 = stairwayPlan(t, { n: 3, stair_N: 12, factor: { cycle_step: 2 } }, { age: 30 }, model);
      assert.equal(p2.T.chest[0], 17, '15 -> 16 -> 17'); assert.equal(p2.T.chest[11], 24, 'cap 22 + 2');
    });
  });

  describe(`volume.computeTargets (${mname})`, () => {
    const D = {};
    for (const n of ['01', '02', '03', '04', '05', '06', '07', '08']) D[n] = deriveValues(sample(n), model);
    const sc = (n, m) => [D[n].D9_start_sets.start[m], D[n].D9_start_sets.cap[m]];
    const stair = (n, tbN = 1) => { const sh = buildShape(D[n], model); return stairwayPlan(D[n].D9_start_sets, sh.training_blocks[tbN - 1], D[n], model); };

    it('start -> cap per muscle for the 8 samples (CONTRACTS §9)', () => {
      const exp = {
        // v1.2 (review 01 / 04 / 08 blockers, R2-VOL-06 'nobody needs less than 10 sets'): credit-only is now the swimmer's and
        // the field athletes' arms only; glutes / side delts get targets everywhere, and stay-active / class plans target every muscle
        '01': { quads: [11, 16], hamstrings: [11, 16], glutes: [11, 16], chest: [10, 14], lats_upper_back: [10, 14], side_delts: [10, 16], rear_delts: [6, 12], calves: [10, 22], biceps: [null, null], triceps: [null, null] },
        '02': { quads: [14, 18], hamstrings: [14, 18], glutes: [14, 18], chest: [10, 13], lats_upper_back: [10, 13], side_delts: [10, 16], rear_delts: [8, 16], calves: [12, 25], biceps: [null, null] },
        '03': { quads: [11, 16], hamstrings: [11, 16], glutes: [11, 16], chest: [10, 14], lats_upper_back: [10, 14], rear_delts: [6, 12], calves: [10, 22] },
        '04': { quads: [12, 18], hamstrings: [12, 18], chest: [12, 18], lats_upper_back: [12, 18], rear_delts: [6, 12], calves: [10, 22], glutes: [12, 18], biceps: [10, 18] },
        '05': { quads: [12, 18], chest: [12, 18], side_delts: [10, 18], biceps: [10, 18], triceps: [10, 18] },
        '06': { quads: [20, 25], hamstrings: [20, 25], chest: [20, 25], lats_upper_back: [20, 25], glutes: [26, 30], side_delts: [21, 30], biceps: [15, 25], triceps: [15, 25], rear_delts: [8, 16], calves: [12, 25] },
        '07': { quads: [20, 25], glutes: [20, 25], chest: [26, 30], lats_upper_back: [26, 30], side_delts: [15, 25], biceps: [15, 25], triceps: [15, 25], rear_delts: [8, 16], calves: [10, 25] },
        '08': { quads: [6, 11], hamstrings: [10, 13], chest: [10, 13], lats_upper_back: [10, 13], rear_delts: [4, 8], calves: [10, 14], glutes: [10, 13], side_delts: [10, 13], biceps: [10, 13], triceps: [10, 13] }
      };
      for (const [n, ms] of Object.entries(exp)) for (const [m, v] of Object.entries(ms)) assert.deepEqual(sc(n, m), v, `${n} ${m}`);
      assert.equal(D['01'].D9_start_sets.modifier_id, 'field_off'); assert.equal(D['04'].D9_start_sets.modifier_id, 'stay_active');
      assert.equal(D['05'].D9_start_sets.modifier_id, 'general'); assert.equal(D['06'].D9_start_sets.modifier_id, 'aesthetics');
      assert.equal(D['08'].D9_start_sets.modifier_id, 'stay_active');
      // v1.2 (review 01 blocker, R2-VOL-06): glutes and side delts are targets for a swimmer; arms stay credit-only (D-07 revised)
      assert.deepEqual(D['01'].D9_start_sets.credit_only, ['biceps', 'triceps']);
      assert.equal(D['01'].D9_start_sets.fill.rear_delts, 'own_sets'); assert.equal(D['01'].D9_start_sets.fill.abs_obliques, 'core_block');
      assert.deepEqual(D['06'].D9_start_sets.priority, ['glutes', 'side_delts']); assert.deepEqual(D['07'].D9_start_sets.priority, ['chest', 'lats_upper_back']);
      assert.deepEqual(D['08'].D9_start_sets.pain_muscles, ['quads']);
      // v1.2 (review 05 blocker 2): a bootcamp is not floor exempt; what 3 x 45 min cannot hold is named (warning.floor_schedule)
      assert.deepEqual(D['05'].D9_start_sets.floored, ['quads', 'hamstrings', 'glutes', 'chest', 'lats_upper_back', 'side_delts', 'biceps', 'triceps', 'calves']);
    });

    it('lambda and whole-set curves for the 8 samples (CONTRACTS §9)', () => {
      const p01 = stair('01'); close(p01.lambda.quads, 0.848, 0.001); close(p01.lambda.chest, 0.760, 0.001); assert.equal(p01.lambda.rear_delts, 1);
      assert.deepEqual(whole(p01.T.quads), [11, 11, 11, 11, 12, 12, 13, 13, 14, 14, 15, 16]);
      const p02 = stair('02'); close(p02.lambda.quads, 0.565, 0.001); close(p02.lambda.chest, 0.591, 0.001);
      assert.deepEqual(whole(p02.T.quads), [14, 14, 14, 14, 14, 15, 15, 16, 16, 17, 17, 18]);
      const p03 = stair('03'); assert.equal(p03.lambda.quads, 1); assert.deepEqual(whole(p03.T.quads), [11, 11, 11, 12, 12, 13]);
      const p04 = stair('04'); assert.equal(p04.lambda.quads, 1); assert.deepEqual(whole(p04.T.quads), [12, 12, 12, 13, 13, 14, 15, 15]);
      const p06 = stair('06'); close(p06.lambda.quads, 0.683, 0.001); close(p06.lambda.glutes, 0.320, 0.001); close(p06.lambda.side_delts, 0.806, 0.001);
      assert.deepEqual(whole(p06.T.glutes), [26, 26, 26, 26, 27, 27, 27, 28, 28, 29, 29, 30]);
      assert.deepEqual(whole(p06.T.quads), [20, 20, 20, 21, 21, 22, 22, 23, 23, 24, 24, 25]);
      const p07 = stair('07'); close(p07.lambda.chest, 0.320, 0.001); close(p07.lambda.quads, 0.683, 0.001);
      assert.deepEqual(whole(p07.T.chest), [26, 26, 26, 26, 27, 27, 27, 28, 28, 29, 29, 30]);
      const p08 = stair('08'); close(p08.lambda.hamstrings, 0.591, 0.001);
      assert.deepEqual(whole(p08.T.hamstrings), [10, 10, 10, 10, 10, 10, 11, 11, 11, 12, 12, 13]);
      assert.deepEqual(p08.steps.quads.slice(1, 3), [0, 0], 'pain: frozen weeks');
    });

    it('L3 priority 26 -> 30 lands exactly on 30 in week 12; non-priority steps <= 3 % while a priority runs', () => {
      const p06 = stair('06');
      assert.equal(p06.T.glutes[11], 30); assert.ok(p06.lambda.glutes < 1);
      for (const m of Object.keys(p06.steps)) if (!['glutes', 'side_delts'].includes(m)) assert.ok(p06.steps[m].every(s => s <= 0.03 + EPS), m);
      assert.ok(Math.max(...p06.steps.side_delts) > 0.03, 'the priority muscle keeps the bigger late steps');
      const p07 = stair('07'); assert.equal(p07.T.chest[11], 30); assert.equal(p07.T.lats_upper_back[11], 30);
    });

    it('floor of 10 lifts field-athlete chest and back from 7.5 to 10 (R2-VOL-06); pain wins over the floor', () => {
      const t = D['01'].D9_start_sets;
      assert.equal(model.rules.volume.start.chest.L2 * model.rules.volume.modifiers.field_off.upper, 7.5);
      assert.equal(t.start.chest, 10); assert.equal(t.start.lats_upper_back, 10);
      assert.ok(t.floored.includes('chest') && t.floored.includes('lats_upper_back'));
      assert.ok(t.why.chest.some(w => w.key === 'why.floor_10' && w.ref === 'R2-VOL-06'));
      const p = D['08'].D9_start_sets;
      assert.equal(p.start.quads, 6, 'L1 8 -> floor 10 -> knee pain x 0.6 = 6');
      assert.ok(!p.floored.includes('quads')); assert.ok(p.why.quads.some(w => w.key === 'why.pain_cut'));
    });

    it('cap rule D-02 (scaled caps keep the growth room), strength small factor, cycles, swim pull ratio', () => {
      const str = deriveValues(sample('07', i => { i.goal = 'strength'; i.priority_muscles = []; i.experience.years_consistent = 2; i.prefs.split_style = 'default'; }), model).D9_start_sets;
      assert.equal(str.modifier_id, 'strength');
      assert.deepEqual([str.start.biceps, str.cap.biceps], [10, 18], 'L2 12 x 0.75 = 9 -> floor 10; cap max(17, 10 + 8)');
      const cyc = deriveValues(sample('06', i => { i.priority_muscles = []; i.experience.years_consistent = 2; i.plan.previous_cycles = { count: 2, last_had_holds_or_pain: false }; }), model).D9_start_sets;
      assert.deepEqual([cyc.start.quads, cyc.cap.quads], [17, 24], '15 -> 16 -> 17, cap 22 + 2');
      const same = deriveValues(sample('06', i => { i.priority_muscles = []; i.experience.years_consistent = 2; i.plan.previous_cycles = { count: 2, last_had_holds_or_pain: true }; }), model).D9_start_sets;
      assert.deepEqual([same.start.quads, same.cap.quads], [15, 22], 'same start after holds or pain');
      const swimL1 = deriveValues(sample('01', i => { i.experience.years_consistent = 0.5; }), model).D9_start_sets;
      assert.equal(swimL1.start.lats_upper_back, 11, 'lats + rear delts >= 1.5 x chest (10 + 4 < 15 -> 11)');
      assert.ok(swimL1.why.lats_upper_back.some(w => w.key === 'why.volume_ratio'));
    });

    it('v_taper priority: side delts + lats get the priority, chest is held at its start (VOL-18)', () => {
      const d = deriveValues(sample('06', i => { i.priority_muscles = ['v_taper']; }), model);
      assert.deepEqual(d.priority_choices, ['v_taper']);
      const t = d.D9_start_sets;
      assert.deepEqual(t.priority, ['lats_upper_back', 'side_delts']);
      assert.deepEqual([t.start.chest, t.cap.chest], [20, 20]);
      const p = stairwayPlan(t, buildShape(d, model).training_blocks[0], d, model);
      assert.ok(p.T.chest.every(x => x === 20), 'chest held flat');
      assert.equal(p.T.lats_upper_back[11], 30);
    });

    it('maintenance factors 0.5 / 0.6 / 0.7 of the level start, not floored; older floor 0.7', () => {
      const m = (reason, age = 29) => deriveValues(sample('06', i => { i.age = age; i.priority_muscles = []; i.plan.mode = 'maintenance_4_6'; i.plan.maint_reason = reason; }), model).D9_start_sets;
      assert.equal(m('vacation_limited_kit').start.quads, 10);
      assert.equal(m('travel_moving_season_change').start.quads, 12);
      assert.equal(m('planned_maintenance').start.quads, 14);
      assert.equal(m('vacation_limited_kit', 66).start.quads, 14, '60+: at least 0.7');
      assert.deepEqual(m('vacation_limited_kit').floored, []);
      assert.equal(m('vacation_limited_kit').start.rear_delts, 4, 'own sets 8 x 0.5');
    });
  });

  describe(`volume.weeklyCredits (${mname})`, () => {
    const credit = (rows) => { const { layout, selection } = craft(model, [{ weekday: 'Mon', slots: rows }]); const sets = {}; layout.days[0].blocks[0].slots.forEach((s, k) => { sets[s.slot_id] = rows[k].sets; }); return weeklyCredits(layout, sets, selection.fills, model); };

    it('helpers 0.25 (glutes on squats and hinges), hip thrust glutes 1.0, dips 0.5 / 0.5, face pull 1 / 0.25 (VOL-09, R2-VOL-05, LIB-16)', () => {
      const w = credit([
        { bucket: 'RP_BKD', ex: 'back-squat-bar-position-not-stated', sets: 3 },
        { bucket: 'RP_BHD', ex: 'barbell-deadlift-conventional', sets: 4 },
        { bucket: 'RP_BHD', ex: 'barbell-hip-thrust', sets: 3 },
        { bucket: 'RP_HPUSH', ex: 'barbell-bench-press', sets: 3 },
        { bucket: 'RP_HPUSH', ex: 'parallel-bar-dip', sets: 4 },
        { bucket: 'ISO_SIDE_REAR_DELT', ex: 'face-pull', sets: 2, variant: 'rear' }
      ]);
      assert.equal(w.quads, 3); assert.equal(w.adductors, 0.75);
      assert.equal(w.glutes, 3 * 0.25 + 4 * 0.25 + 3 * 1, 'squat 0.75 + deadlift 1.0 + hip thrust 3');
      assert.equal(w.hamstrings, 4 + 3 * 0.25);
      assert.equal(w.chest, 3 + 4 * 0.5); assert.equal(w.triceps, 3 * 0.25 + 4 * 0.5); assert.equal(w.front_delts, 0.75);
      assert.equal(w.rear_delts, 2); assert.equal(w.side_delts, 0.5);
      assert.deepEqual(Object.keys(w), model.rules.muscles.order);
    });

    it('thruster = 1.0 quads + 0.5 shoulders + 0.25 glutes; KB swings and athletic slots never count (R2-VOL-05, H09)', () => {
      const t = credit([{ bucket: 'RP_BKD', ex: 'barbell-thruster', sets: 4 }]);
      assert.equal(t.quads, 4); assert.equal(t.front_delts, 2); assert.equal(t.glutes, 1);
      const kb = credit([{ bucket: 'AP_TRIPLE_EXT', ex: 'kettlebell-swing-russian', sets: 4 }, { bucket: 'COND_WOD', ex: 'american-kb-swing-overhead', sets: 3 }]);
      assert.ok(Object.values(kb).every(v => v === 0), 'KB swing glutes 0');
      for (const e of model.exercises().filter(x => x.tags.includes('kb_swing'))) {
        assert.deepEqual(model.credits(e, 'RP_BHD'), {}); assert.ok(!e.slots.some(s => s.startsWith('RP_')));
      }
      const pp = model.exercises().find(e => e.tags.includes('push_press') && Object.keys(e.credits).length);
      if (pp) {
        assert.ok(Object.values(credit([{ bucket: 'AP_TRIPLE_EXT', ex: pp.id, sets: 3 }])).every(v => v === 0), 'push press as power work credits nothing');
      }
    });
  });

  describe(`volume.planWeeklySets (${mname})`, () => {
    const chest = {
      bench: 'barbell-bench-press', db: 'flat-db-bench-press', fly: 'cable-fly'
    };

    it('VOL-07 placement on one day: 2/2/2 -> 3/2/2 -> 3/3/2 -> 3/3/3 -> 4/3/3', () => {
      const { layout, selection } = craft(model, [{ weekday: 'Mon', slots: [
        { bucket: 'RP_HPUSH', ex: chest.bench, sets: 2 }, { bucket: 'RP_HPUSH', ex: chest.db, sets: 2 }, { bucket: 'ISO_CHEST', ex: chest.fly, sets: 2 }] }]);
      const ids = layout.days[0].blocks[0].slots.map(s => s.slot_id);
      const seq = [];
      for (const S of [7, 8, 9, 10, 11]) {
        const d = craftedDerived(model, 'L2', { chest: [S, 30] });
        const sh = buildShape(d, model);
        const vp = planWeeklySets({ derived: d, shape: sh, layouts: [layout], selections: [1, 2, 3].map(e => ({ ...selection, exercise_block: e })), model: noCap(model), fillSlot: () => null });
        seq.push(ids.map(id => vp.weeks[0].sets_by_slot[id]).join('/'));
      }
      assert.deepEqual(seq, ['2/2/2', '3/2/2', '3/3/2', '3/3/3', '4/3/3']);
    });

    it('a new set alternates the days that train the muscle (day A, then day B; R3-VOL-03 default)', () => {
      const { layout, selection } = craft(model, [
        { weekday: 'Mon', slots: [{ bucket: 'RP_HPUSH', ex: chest.bench, sets: 2 }] },
        { weekday: 'Wed', slots: [{ bucket: 'RP_HPUSH', ex: chest.db, sets: 2 }] },
        { weekday: 'Fri', slots: [{ bucket: 'ISO_CHEST', ex: chest.fly, sets: 2 }] }]);
      const get = (S) => {
        const d = craftedDerived(model, 'L2', { chest: [S, 30] });
        const vp = planWeeklySets({ derived: d, shape: buildShape(d, model), layouts: [layout], selections: [1, 2, 3].map(e => ({ ...selection, exercise_block: e })), model: noCap(model), fillSlot: () => null });
        return ['Mon', 'Wed', 'Fri'].map(wd => vp.weeks[0].sets_by_slot[`${wd}.X.s01`]).join('/');
      };
      assert.equal(get(8), '3/2/2'); assert.equal(get(9), '3/3/2'); assert.equal(get(10), '3/3/3'); assert.equal(get(11), '4/3/3');
    });

    it('total weekly sets rise at most 7 % (never 10 %): nine muscles releasing in the same week are staggered (UNI-05, v1.2)', () => {
      const pick = (cls, bucket, re) => firstEx(model, e => e.credit_class === cls && e.slots.includes(bucket) && (!re || re.test(e.id)));
      const rows = [
        ['quads', 'ISO_QUAD', pick('LEG_EXTENSION', 'ISO_QUAD')], ['hamstrings', 'ISO_LEG_FLEXION', pick('LEG_FLEXION', 'ISO_LEG_FLEXION')],
        ['chest', 'ISO_CHEST', pick('ISO_CHEST', 'ISO_CHEST')], ['lats_upper_back', 'RP_VPULL', pick('PULLOVER', 'RP_VPULL')],
        ['side_delts', 'ISO_SIDE_REAR_DELT', pick('ISO_SIDE', 'ISO_SIDE_REAR_DELT')], ['rear_delts', 'ISO_SIDE_REAR_DELT', pick('ISO_REAR', 'ISO_SIDE_REAR_DELT', /reverse-fly/)],
        ['biceps', 'ISO_BICEP', pick('ISO_BICEPS', 'ISO_BICEP')], ['triceps', 'ISO_TRICEP', pick('ISO_TRICEPS', 'ISO_TRICEP')], ['calves', 'ISO_CALF', pick('ISO_CALF', 'ISO_CALF')]];
      const spec = [['Mon', 4], ['Wed', 3], ['Fri', 3]].map(([wd, n]) => ({ weekday: wd, slots: rows.map(([, bucket, ex]) => ({ bucket, ex, sets: n })) }));
      const { layout, selection } = craft(model, spec);
      const targets = {}; for (const [m] of rows) targets[m] = [10, 14];
      const d = craftedDerived(model, 'L1', targets);
      const sh = buildShape(d, model);
      const vp = planWeeklySets({ derived: d, shape: sh, layouts: [layout], selections: [1, 2, 3].map(e => ({ ...selection, exercise_block: e })), model: noCap(model), fillSlot: () => null });
      const tot = vp.weeks.map(w => w.total_resistance_sets);
      assert.equal(tot[0], 90);
      for (let k = 1; k < tot.length; k++) {
        assert.ok(tot[k] < 1.1 * tot[k - 1] - EPS, `week ${k + 1}: ${tot[k - 1]} -> ${tot[k]}`);
        assert.ok(tot[k] >= tot[k - 1]);
      }
      // v1.2 (R2-VOL-01 / UNI-05, review 01-08: 'never more than 7 %'): the placed week total rises at most 7 % (10 % is never
      // reached); nine muscles releasing together are staggered over the following weeks (why.total_ceiling)
      for (let k = 1; k < tot.length; k++) assert.ok(tot[k] <= 1.07 * tot[k - 1] + EPS, `week ${k + 1}: ${tot[k - 1]} -> ${tot[k]} (> 7 %)`);
      assert.ok(vp.weeks.some(w => w.why.some(x => x.key === 'why.total_ceiling')), 'the ceiling staggered a release');
      const w6 = vp.weeks[5];
      assert.ok(w6.changes.filter(c => c.key === 'changes.set_added').length >= 5, 'most of the nine releases land in week 6');
      for (const [m] of rows) assert.ok(vp.weeks[11].weekly_sets_by_muscle[m] >= 11, `${m} released by week 12`);
      // chest follows the whole-set stairway until its three slots reach the L1 maximum of 4 sets each (12) with no room for a Focus slot
      // (v1.2: the placed curve trails the whole-set target by the weekly ceiling, never more than one set ahead of it)
      const T = whole(stairwayPlan(d.D9_start_sets, sh.training_blocks[0], d, model).T.chest);
      const placed = vp.weeks.map(w => w.weekly_sets_by_muscle.chest);
      for (let k = 0; k < placed.length; k++) { assert.ok(placed[k] <= T[k] + 1 + EPS, `chest wk ${k + 1}`); if (k) assert.ok(placed[k] >= placed[k - 1]); }
      assert.deepEqual(placed.slice(10), [12, 12]);
      assert.ok(vp.weeks.slice(9).some(w => w.shortfalls.some(s => s.field === 'chest')), 'no room: reported as a shortfall');
    });

    it('an exercise-block change that moves a slot to another main muscle never lowers the direct sets (H21)', () => {
      const curl = firstEx(model, e => e.credit_class === 'LEG_FLEXION');
      const filler = [1, 2, 3].map(() => ({ bucket: 'ISO_CHEST', ex: chest.fly, sets: 4 })); // untargeted volume so +3 sets stay under +10 %
      const { layout, selection } = craft(model, [
        { weekday: 'Mon', slots: [{ bucket: 'RP_UHD', ex: 'single-leg-rdl-single-leg-deadlift', sets: 3 }, { bucket: 'ISO_LEG_FLEXION', ex: curl, sets: 2 }, ...filler] },
        { weekday: 'Thu', slots: [{ bucket: 'RP_UHD', ex: 'single-leg-rdl-single-leg-deadlift', sets: 3 }, { bucket: 'ISO_LEG_FLEXION', ex: curl, sets: 2 }, ...filler] }]);
      const bridge = model.ex('single-leg-glute-bridge-foot-on-floor');
      const swapped = clone(selection.fills);
      swapped['Mon.X.s01'] = { ...swapped['Mon.X.s01'], exercise_id: bridge.id, laterality: bridge.laterality };
      const d = craftedDerived(model, 'L2', { hamstrings: [10, 22] });
      const sh = buildShape(d, model);
      const sels = [{ ...selection, exercise_block: 1 }, { ...selection, exercise_block: 2, fills: swapped }, { ...selection, exercise_block: 3, fills: swapped }];
      const vp = planWeeklySets({ derived: d, shape: sh, layouts: [layout], selections: sels, model, fillSlot: () => null });
      for (let k = 1; k < vp.weeks.length; k++) {
        assert.ok(vp.weeks[k].direct_sets_by_muscle.hamstrings >= vp.weeks[k - 1].direct_sets_by_muscle.hamstrings, `hamstrings week ${k + 1}`);
        assert.ok(vp.weeks[k].total_resistance_sets < 1.1 * vp.weeks[k - 1].total_resistance_sets - EPS);
      }
      assert.ok(vp.weeks[4].changes.some(c => c.key === 'changes.new_exercise_block'));
      assert.ok(vp.weeks[4].changes.some(c => c.key === 'changes.set_added' && c.args.slot_id.endsWith('.X.s02')), 'the lost hamstring sets go back on a hamstring exercise');
    });

    it('bonus slots take the next free engine-added id of the day (no clash with week.mjs prehab xNN slots)', () => {
      const side = firstEx(model, e => e.credit_class === 'ISO_SIDE' && e.slots.includes('ISO_SIDE_REAR_DELT'));
      const { layout, selection } = craft(model, [{ weekday: 'Mon', slots: [
        { bucket: 'ISO_SIDE_REAR_DELT', ex: side, sets: 4, variant: 'side' }, { bucket: 'RP_VPUSH', ex: 'arnold-press-db', sets: 2 },
        { bucket: 'RECOVERY_ARM_CARE', ex: 'cable-external-rotation-elbow-at-side-or-90-90', sets: 2 }] }]);
      const slots = layout.days[0].blocks[0].slots;
      const pre = slots[2];
      const oldId = pre.slot_id; pre.slot_id = 'Mon.X.x01'; pre.origin = 'prehab_added';
      selection.fills['Mon.X.x01'] = { ...selection.fills[oldId], slot_id: 'Mon.X.x01' }; delete selection.fills[oldId];
      const d = craftedDerived(model, 'L2', { side_delts: [8, 22] });
      const vp = planWeeklySets({ derived: d, shape: buildShape(d, model), layouts: [layout], selections: [1, 2, 3].map(e => ({ ...selection, exercise_block: e })), model, fillSlot: (slot) => simpleFill(slot, model) });
      const added = vp.weeks[0].added_slots;
      assert.equal(added.length, 1);
      assert.equal(added[0].slot_id, 'Mon.X.x02');
      assert.deepEqual([added[0].origin, added[0].bucket, added[0].variant, added[0].focus_muscle, added[0].group], ['bonus', 'ISO_SIDE_REAR_DELT', 'side', 'side_delts', 'shoulders']);
      assert.equal(vp.weeks[0].sets_by_slot['Mon.X.x01'], 2);
    });

    it('the 8 samples: steps = planned stairway, total < +10 %, sets never drop, last week hardest, floor 10 or floor_schedule', () => {
      for (const n of ['01', '02', '03', '04', '05', '06', '07', '08']) {
        const { d, sh, vp } = planFor(model, sample(n));
        assert.equal(vp.weeks.length, sh.weeks.length, n);
        assert.equal(vp.athletic.length, sh.weeks.length);
        assert.ok(!/NaN|Infinity|undefined/.test(JSON.stringify(vp)), n);
        const floorWarn = vp.warnings.find(w => w.key === 'warning.floor_schedule');
        const exempt = floorWarn ? floorWarn.args.muscles.split(', ') : [];
        for (const tb of sh.training_blocks.filter(b => b.type === 'stairway')) {
          // v1.2 (D-67): the planned stairway is the block's own, sized to the minutes (vp.block_targets)
          const bt = (vp.block_targets || []).find(b => b.training_block === tb.n);
          const p = bt ? stairwayFrom({ ...d.D9_start_sets, start: bt.start, cap: bt.cap }, tb, d, model) : stairwayPlan(d.D9_start_sets, tb, d, model);
          const ws = vp.weeks.filter(w => sh.weeks[w.n - 1].training_block === tb.n);
          ws.forEach((w, k) => {
            for (const m of Object.keys(p.steps)) assert.equal(w.step_by_muscle[m], p.steps[m][k], `${n} H22 step ${m} wk ${w.n}`);
            for (const m of d.D9_start_sets.floored) if (!exempt.includes(m) && !sh.weeks[w.n - 1].circuit) assert.ok(w.weekly_sets_by_muscle[m] >= 10 - EPS, `${n} floor ${m} wk ${w.n}`);
            if (k === 0) return;
            const prev = ws[k - 1];
            assert.ok(w.total_resistance_sets < 1.1 * prev.total_resistance_sets - EPS, `${n} V15 wk ${w.n}`);
            assert.ok(w.total_resistance_sets >= prev.total_resistance_sets, `${n} total drops wk ${w.n}`);
            for (const m of Object.keys(p.steps)) assert.ok(w.direct_sets_by_muscle[m] >= prev.direct_sets_by_muscle[m], `${n} H21 direct ${m} wk ${w.n}`);
          });
          const last = ws[ws.length - 1].total_resistance_sets;
          assert.ok(ws.every(w => w.total_resistance_sets <= last), `${n} last week hardest`);
        }
      }
    });

    it('weekly sets = credited coach count of the set map (weeklyCredits agrees); week 1 sits at the start (+-1)', () => {
      const { d, layouts, selections, vp } = planFor(model, sample('02'));
      const w1 = vp.weeks[0];
      assert.equal(w1.added_slots.length, 0);
      assert.deepEqual(weeklyCredits(layouts[0], w1.sets_by_slot, selections[0].fills, model), w1.weekly_sets_by_muscle);
      for (const m of ['quads', 'chest', 'lats_upper_back', 'rear_delts', 'calves']) {
        assert.ok(w1.weekly_sets_by_muscle[m] >= d.D9_start_sets.start[m] - 1 - EPS, m);
      }
      for (const [id, v] of Object.entries(w1.sets_by_slot)) if (/\.s0[12]$/.test(id) && layouts[0].days.some(x => x.blocks.some(b => b.slots.some(s => s.slot_id === id && s.bucket.startsWith('WARMUP'))))) assert.equal(v, null);
    });

    it('soccer pre-season: every resistance slot max(1, round half up(0.6 x the last stairway week)), flat (D-37)', () => {
      const { sh, layouts, vp } = planFor(model, sample('03'));
      const w6 = vp.weeks[5], w7 = vp.weeks[6], w8 = vp.weeks[7];
      const kindOf = (id) => { for (const L of layouts) for (const d of L.days) for (const b of d.blocks) for (const s of b.slots) if (s.slot_id === id) return model.bucket(s.bucket).kind; return null; };
      // v1.2 (review 03 minor): about 60 % of the last off-season week; the work and paired lifts keep 2 sets, Focus / the second
      // calf / duplicate isolations go first - so each slot sits between 0 and max(2, 0.6 x its week-6 sets), never above week 6
      let checked = 0, t6 = 0, t7 = 0;
      for (const [id, v] of Object.entries(w7.sets_by_slot)) {
        if (!['resistance', 'isolation', 'focus'].includes(kindOf(id)) || !(w6.sets_by_slot[id] > 0)) continue;
        assert.ok(v <= Math.max(2, roundHalfUp(0.6 * w6.sets_by_slot[id])) && v <= w6.sets_by_slot[id], id); checked++;
        t6 += w6.sets_by_slot[id]; t7 += v || 0;
      }
      assert.ok(checked > 5);
      assert.ok(t7 >= 0.45 * t6 && t7 <= 0.75 * t6, `${t7} of ${t6}`);
      assert.deepEqual(w8.sets_by_slot, w7.sets_by_slot);
      assert.ok(sh.weeks[6].block_type === 'pre_season' && w7.step_by_muscle.quads === 0);
    });

    it('bootcamp circuits: every station = the week\'s rounds, the stairway climbs by work seconds, totals flat, floor misses named (D-19 v1.2)', () => {
      const { sh, layouts, vp } = planFor(model, sample('05'));
      const circ = [];
      for (const d of layouts[0].days) for (const b of d.blocks) for (const s of b.slots) if (s.circuit) circ.push(s.slot_id);
      assert.ok(circ.length >= 20);
      for (const w of vp.weeks) for (const id of circ) assert.equal(w.sets_by_slot[id], sh.weeks[w.n - 1].circuit.rounds);
      assert.ok(vp.weeks.every(w => w.total_resistance_sets === vp.weeks[0].total_resistance_sets));
      assert.ok(vp.weeks.some(w => w.changes.some(c => c.key === 'changes.circuit_longer')));
      // v1.2 (review 05 blocker 2): circuits are no longer floor exempt - the muscles a 3 x 45 bootcamp cannot hold at 10 are named
      const fw = vp.warnings.find(w => w.key === 'warning.floor_schedule');
      assert.ok(fw && fw.args.muscles.length > 0, 'the floor misses are named');
    });

    it('year plan: Q1 sets stay at week 1, recovery = ceil(half the hardest week) per slot, the first week after recovery is exempt', () => {
      const { sh, layouts, vp } = planFor(model, sample('06', i => { i.goal = 'general'; i.priority_muscles = []; i.plan.mode = 'year'; i.experience.years_consistent = 2; }));
      for (let k = 1; k < 12; k++) assert.deepEqual(vp.weeks[k].sets_by_slot, vp.weeks[0].sets_by_slot, 'flat_sets Q1');
      const w12 = vp.weeks[11], w13 = vp.weeks[12];
      assert.equal(sh.weeks[12].block_type, 'recovery');
      const kindOf = (id) => { for (const d of layouts[1].days) for (const b of d.blocks) for (const s of b.slots) if (s.slot_id === id) return model.bucket(s.bucket).kind; return null; };
      for (const [id, v] of Object.entries(w13.sets_by_slot)) if (['resistance', 'isolation'].includes(kindOf(id)) && w12.sets_by_slot[id] > 0) assert.equal(v, Math.max(1, Math.ceil(0.5 * w12.sets_by_slot[id])), id);
      assert.ok(vp.weeks[13].total_resistance_sets > 1.1 * w13.total_resistance_sets, 'week 14 jumps back up: exempt after a recovery week');
      assert.ok(vp.weeks.slice(25, 39).every(w => JSON.stringify(w.sets_by_slot) === JSON.stringify(vp.weeks[25].sets_by_slot)), 'Q3 maintenance flat');
    });

    it('in-season and maintenance blocks are flat (no stairway, no floor)', () => {
      const ins = planFor(model, sample('02', i => { i.sport.season = { type: 'in_season_until', date: '2027-12-01' }; }));
      assert.equal(ins.sh.training_blocks.map(b => b.type).join(), 'in_season');
      assert.ok(ins.vp.weeks.every(w => JSON.stringify(w.sets_by_slot) === JSON.stringify(ins.vp.weeks[0].sets_by_slot)));
      assert.ok(ins.vp.weeks.every(w => Object.values(w.step_by_muscle).every(s => s === 0)));
      const mt = planFor(model, sample('06', i => { i.plan.mode = 'maintenance_4_6'; i.plan.maint_reason = 'travel_moving_season_change'; }));
      assert.ok(mt.vp.weeks.every(w => JSON.stringify(w.sets_by_slot) === JSON.stringify(mt.vp.weeks[0].sets_by_slot)));
      assert.equal(mt.vp.weeks[0].target_by_muscle.quads, mt.d.D9_start_sets.start.quads);
    });

    it('a schedule too short for the floor names the muscles in warning.floor_schedule (D-33, pickleball 2 x 45 min)', () => {
      const { vp } = planFor(model, sample('08'));
      const w = vp.warnings.find(x => x.key === 'warning.floor_schedule');
      assert.ok(w, 'warning present'); assert.equal(w.code, 'floor_schedule');
      assert.ok(w.args.muscles.length > 0 && typeof w.args.advice === 'string' && w.args.advice.startsWith('ui.plan.schedule_advice.'));
    });

    it('bonus / Focus work goes to the main days first (v1.2) and never makes a muscle group\'s only exercise on a main day', () => {
      const { layouts, vp } = planFor(model, sample('06'));
      const last = vp.weeks[vp.weeks.length - 1];
      assert.ok(last.added_slots.length > 0);
      for (const s of last.added_slots) {
        assert.ok(['bonus', 'focus_added'].includes(s.origin));
        assert.equal(last.sets_by_slot[s.slot_id] >= 1, true); // v1.2: an added slot enters at 1 set and climbs (VOL-07)
        const wd = s.slot_id.split('.')[0];
        const day = layouts[0].days.find(x => x.weekday === wd);
        if (day.kind === 'main') {
          const same = day.blocks.flatMap(b => b.slots).filter(x => x.group === s.group && last.sets_by_slot[x.slot_id] > 0);
          assert.ok(same.length >= 1, `${s.slot_id} joins an existing ${s.group} exercise`);
        }
      }
      // v1.2 (review 06 major 3, ORD-10): target / floor / priority sets try the main days first; the optional days hold their
      // template's 2 Focus slots, so an added slot sits on a main day
      const first = vp.weeks.flatMap(w => w.added_slots).map(s => s.slot_id.split('.')[0]);
      assert.ok(first.length && ['Mon', 'Tue', 'Thu', 'Fri'].includes(first[0]), 'main days first');
    });

    it('is deterministic', () => {
      for (const n of ['01', '06', '08']) assert.equal(JSON.stringify(planFor(model, sample(n)).vp), JSON.stringify(planFor(model, sample(n)).vp));
    });
  });

  describe(`volume.athleticBudget (${mname})`, () => {
    it('swimmer: linear week 1 -> week 12 budget, plyo share 0.10 -> 0.25, RC stages, 100 contacts per session (CONTRACTS §9)', () => {
      const d = deriveValues(sample('01'), model); const sh = buildShape(d, model);
      const ab = athleticBudget(d, sh, model);
      assert.deepEqual(ab[0].targets, { plyo_contacts: 6, jump_contacts: 37, low_contacts: 51, throws: 35, cod_cuts: 0, sprint_m: 0, olympic_sets: 5 });
      assert.deepEqual(ab[11].targets, { plyo_contacts: 8, jump_contacts: 49, low_contacts: 69, throws: 45, cod_cuts: 0, sprint_m: 0, olympic_sets: 8 });
      assert.equal(ab[0].plyo_share, 0.1); assert.equal(ab[11].plyo_share, 0.25);
      assert.deepEqual(ab.map(a => a.stage), sh.weeks.map(w => w.plyo_stage));
      assert.ok(ab.every(a => a.contacts_session_max === 100 && a.enabled && a.factor === 1));
      for (let k = 1; k < 12; k++) assert.ok(ab[k].plyo_share >= ab[k - 1].plyo_share);
    });

    it('soccer pre-season factors, pickleball heavy play weeks, aesthetics off, 60+ landings only', () => {
      const so = deriveValues(sample('03'), model); const ab = athleticBudget(so, buildShape(so, model), model);
      const pre = model.sport('soccer').pre_season;
      assert.equal(ab[6].targets.plyo_contacts, roundHalfUp(95 * pre.PLYO)); assert.equal(ab[6].targets.cod_cuts, 160);
      assert.equal(ab[6].plyo_share, 0.6); assert.equal(ab[6].factor, pre.PLYO);
      const pb = deriveValues(sample('08'), model); const pab = athleticBudget(pb, buildShape(pb, model), model);
      assert.equal(pab[0].targets.plyo_contacts, roundHalfUp(7 * 0.5)); assert.equal(pab[0].targets.cod_cuts, 0, 'heavy play week: no extra COD');
      assert.equal(pab[0].factor, 0.5); assert.equal(pab[0].contacts_session_max, 80);
      const ae = deriveValues(sample('06'), model); const aab = athleticBudget(ae, buildShape(ae, model), model);
      assert.ok(aab.every(a => !a.enabled && a.plyo_share === null && a.targets.plyo_contacts === null && a.targets.olympic_sets === null));
      const old = deriveValues(sample('08', i => { i.age = 66; i.activity.play_days = []; }), model);
      const oab = athleticBudget(old, buildShape(old, model), model);
      assert.ok(oab.every(a => !a.enabled && a.targets.plyo_contacts === null && a.targets.olympic_sets === null && typeof a.targets.low_contacts === 'number'), '60+ default: landings only');
      const opt = deriveValues(sample('08', i => { i.age = 66; i.prefs.older_athletic_opt_in = true; }), model);
      assert.ok(athleticBudget(opt, buildShape(opt, model), model)[0].enabled, 'opt-in unlocks the budget');
    });
  });
}
