// tests/volume.test.mjs - engine/volume.mjs (CONTRACTS §4.5, §8, §9). Owner: B2; v0.4 (stage B1): lines (R3-VOL-01: one shoulders
// line) and FOCUS groups (R3-SES-01), Focus muscles get +2 (R3-VOL-03), no check-ins (R3-VOL-02 / R3-VOL-04).
// v0.5 (design/ENGINE_V05_PLAN.md): template-first, no time-fitting. The tests of the time check, the 7 % / 10 % limits and the
// fractional lambda <= 1 stairway were converted or retired (each marked RETIRED below, listed in engine/DECISIONS.md section G);
// the v0.5 rules are tested in tests/v05-structure.test.mjs, named with their coach answer ids.
// Runs on the fixture and on model/ when present. planWeeklySets is exercised with tests/helpers/simple-layout.mjs and with
// hand-built layouts (VOL-07 order, day alternation, the strict 10 % total ceiling with staggering).
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { loadFixtureModel, loadCompiledModel, loadSample } from './helpers/models.mjs';
import { simpleLayout, simpleFill, simpleSelection } from './helpers/simple-layout.mjs';
import { deriveValues } from '../engine/intake.mjs';
import { buildShape } from '../engine/shape.mjs';
import { computeTargets, stairwayPlan, stairwayFrom, planWeeklySets, athleticBudget, weeklyCredits, calvesFloor } from '../engine/volume.mjs';
import { linesOf } from '../engine/lines.mjs';
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
    d.weekdays, d.D6_week_layout.session_size.default, { priority: d.priority_muscles }));
  const selections = sh.exercise_blocks.map(eb => simpleSelection(layouts[eb.training_block - 1], model, eb.n));
  const vp = planWeeklySets({ derived: d, shape: sh, layouts, selections, model, fillSlot: (slot) => simpleFill(slot, model) });
  return { d, sh, layouts, selections, vp };
}

/** hand-built one-block layout: spec = [{weekday, slots:[{bucket, ex, sets, variant?}]}] */
function craft(model, spec) {
  const fills = {};
  const days = spec.map(({ weekday, slots }) => ({
    weekday, day_type: 'X', kind: 'main', optional: false, label_key: 'day.x', lower_focus: null, full_body: true, format: 'straight',
    supersets_on: false, est_minutes: 0, groups: [],
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

/** derived whose D9 is replaced by crafted line targets (line -> [start, cap]; v0.4 lines, R3-VOL-01) */
function craftedDerived(model, level, targets, extra = {}) {
  const base = deriveValues(sample('06', i => { i.priority_muscles = []; }), model);
  const X = linesOf(model);
  const start = {}, cap = {}, fill = {};
  for (const l of X.order) {
    if (targets[l]) { start[l] = targets[l][0]; cap[l] = targets[l][1]; fill[l] = 'target'; } else { start[l] = null; cap[l] = null; fill[l] = 'credit'; }
  }
  for (const m of model.rules.muscles.order) if (!(m in fill)) fill[m] = X.lineOf[m] ? fill[X.lineOf[m]] : model.rules.muscles.defs[m].fill;
  const floored = extra.floored || [];
  const D9 = { modifier_id: 'aesthetics', start, cap, fill, lines: X.order.slice(), priority: extra.priority || [], focus_add: 0, pain_muscles: [], floored,
    floor_groups: [...new Set(floored.map(l => X.groupOfLine[l]))], credit_only: X.order.filter(l => start[l] === null), calves_per_leg_day: 3,
    calves_floor: 10, leg_days: 3, core_block: { exercises: 2, sets: 2 }, why: {} };
  return { ...base, D3_client_level: { ...base.D3_client_level, level }, D9_start_sets: D9, priority_muscles: extra.priority || [], focus_lines: extra.priority || [] };
}
const firstEx = (model, pred) => model.exercises().find(pred).id;
for (const [mname, model] of MODELS) {
  describe(`volume.stairwayPlan (${mname})`, () => {
    const one = (S, C, N, opts = {}) => {
      const t = { start: { chest: S, quads: 10 }, cap: { chest: C, quads: 30 }, fill: { chest: 'target', quads: 'target' },
        priority: opts.priority || [], pain_muscles: opts.pain || [] };
      return stairwayPlan(t, { n: 1, stair_N: N, factor: null }, { age: opts.age || 30 }, model);
    };

    // RETIRED in engine 0.5.0 (DECISIONS G): 'single-muscle stairways of CONTRACTS §4.5 (12 v1.1 §3.7.1): L1 / L2 / L3 at 12 weeks, L2 at 8 weeks'
    //   converted -> 'CX-01 / R4-PRG-01: whole-set stairways ...': the lambda <= 1 fractional T(w) table is replaced by the engine/progression whole-set schedule that reaches the target in the last week

    // RETIRED in engine 0.5.0 (DECISIONS G): 'the 12 v1.1 table: 8-week L1 / L3, small muscles, rear delts, priority muscles'
    //   converted -> 'CX-01 / R4-PRG-01 ...': 8-week blocks now reach their ceiling (lambda may pass 1) instead of stopping at lambda 1

    // RETIRED in engine 0.5.0 (DECISIONS G): 'stairway shape (H21, R2-PER-03/04): steps <= 7 %, early steps never larger than late ones, T never drops, T(N)…'
    //   retired: the 7 % planned-step limit and 'early steps never larger than late ones' are rate limits CX-01 / R4-PRG-02 removed; never-drops and last-week arrival are tested in 'CX-01 / R4-PRG-01 ...'

    // RETIRED in engine 0.5.0 (DECISIONS G): 'chest 20 -> 22 (VOL-04 example) climbs to its cap and never jumps 2 sets in a week; 10 % is never a planned st…'
    //   converted -> 'R4-PRG-02: ...': the 10 % ceiling is gone; a week above about 15 % is noted instead

    // RETIRED in engine 0.5.0 (DECISIONS G): 'v0.4: a Focus muscle never slows the other lines (R3-VOL-03) and the 60+ 3 % cap is retired; pain: frozen 2 we…'
    //   converted -> 'VOL-03 pain ...' and 'R3-SES-01 Focus ...': the step caps it compared are gone; the pain freeze stays

    // RETIRED in engine 0.5.0 (DECISIONS G): 'year-plan blocks one / two cycles up (start x 1.05 half up, cap + 1)'
    //   converted -> 'R4-PRG-04: the next block ...': start about 5 % up, never above the level top; the ceiling no longer grows by 1 a block
  });

  describe(`volume.computeTargets (${mname})`, () => {
    const D = {};
    for (const n of ['01', '02', '03', '04', '05', '06', '07', '08']) D[n] = deriveValues(sample(n), model);
    const sc = (n, m) => [D[n].D9_start_sets.start[m], D[n].D9_start_sets.cap[m]];
    const stair = (n, tbN = 1) => { const sh = buildShape(D[n], model); return stairwayPlan(D[n].D9_start_sets, sh.training_blocks[tbN - 1], D[n], model); };

    // RETIRED in engine 0.5.0 (DECISIONS G): 'start -> cap per line for the 8 samples (R3-VOL-01 lines, R3-VOL-03 Focus +2, R2-VOL-06 floor 10)'
    //   converted -> 'R4-SES-03 / R3-SES-01: start -> final sets per line ...': one target per group (hips), the 2-day rule for sample 08, calves 3 a leg day

    // RETIRED in engine 0.5.0 (DECISIONS G): 'calves floor: one calf exercise a leg day holds max(3 x leg days, min(10, 4 x leg days - 1)) (R3-SES-01)'
    //   converted -> 'VOL-17: calves ...': no 4th calf set is squeezed into a leg day; the optional-day Calves slots carry the rest

    // RETIRED in engine 0.5.0 (DECISIONS G): 'lambda and whole-set curves for the 8 samples (lines; no 3 % cap on the non-Focus lines)'
    //   converted -> 'CX-01 / R4-PRG-01 ...' (whole-set schedules per group in block_targets)

    // RETIRED in engine 0.5.0 (DECISIONS G): 'a Focus line lands exactly on its ceiling in week 12; the other lines keep their own steps (R3-VOL-03)'
    //   converted -> 'R3-SES-01 Focus ...': the Focus group reaches its (higher) final sets in the last week

    // RETIRED in engine 0.5.0 (DECISIONS G): 'floor of 10 lifts field-athlete chest from 7.5 to 10 (R2-VOL-06); swim pull >= 1.5 x push on the back line (D-…'
    //   converted -> 'R4-SES-03 / R3-SES-01: start -> final sets per line ...' (the floor from 3 training days; the swim ratio; pain wins)

    // RETIRED in engine 0.5.0 (DECISIONS G): 'cap rule D-02 (scaled caps keep the growth room), strength small factor, cycles (same start when the last bloc…'
    //   converted -> 'R4-PRG-04: the next block ...' (D-02 and the strength factor are unchanged and covered by the per-line table)

    it('v_taper Focus: back + shoulders get +2 (both Focus slots), chest keeps its own stairway (VOL-18, R3-VOL-03)', () => {
      const d = deriveValues(sample('06', i => { i.priority_muscles = ['v_taper']; }), model);
      assert.deepEqual(d.priority_choices, ['v_taper']);
      const t = d.D9_start_sets;
      assert.deepEqual(t.priority, ['lats_upper_back', 'shoulders']);
      assert.deepEqual([t.start.lats_upper_back, t.cap.lats_upper_back], [22, 27]);
      const p = stairwayPlan(t, buildShape(d, model).training_blocks[0], d, model);
      assert.equal(p.T.lats_upper_back[11], 27);
      assert.ok(p.T.chest[11] > p.T.chest[0], 'chest is not slowed or held (R3-VOL-03: no slowing of the other lines)');
    });

    it('maintenance factors 0.5 / 0.6 / 0.7 of the level start, not floored; older floor 0.7', () => {
      const m = (reason, age = 29) => deriveValues(sample('06', i => { i.age = age; i.priority_muscles = []; i.plan.mode = 'maintenance_4_6'; i.plan.maint_reason = reason; }), model).D9_start_sets;
      assert.equal(m('vacation_limited_kit').start.quads, 10);
      assert.equal(m('travel_moving_season_change').start.quads, 12);
      assert.equal(m('planned_maintenance').start.quads, 14);
      assert.equal(m('vacation_limited_kit', 66).start.quads, 14, '60+: at least 0.7');
      assert.deepEqual(m('vacation_limited_kit').floored, []);
      assert.equal(m('vacation_limited_kit').start.shoulders, roundHalfUp(0.5 * model.rules.volume.start.shoulders.L3), 'the shoulders line x 0.5');
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

    // RETIRED in engine 0.5.0 (DECISIONS G): 'VOL-07 placement on one day: 2/2/2 -> 3/2/2 -> 3/3/2 -> 3/3/3 (week 1 sits on the start)'
    //   converted -> 'VOL-07 / R3-VOL-03: the exercise with the fewest sets first ...' (week 1 is allocated to the target, not replayed from a time-checked peak)

    it('a new set alternates the days that train the line (day A, then day B; R3-VOL-03)', () => {
      const { layout, selection } = craft(model, [
        { weekday: 'Mon', slots: [{ bucket: 'RP_HPUSH', ex: chest.bench, sets: 2 }] },
        { weekday: 'Wed', slots: [{ bucket: 'RP_HPUSH', ex: chest.db, sets: 2 }] },
        { weekday: 'Fri', slots: [{ bucket: 'ISO_CHEST', ex: chest.fly, sets: 2 }] }]);
      const get = (S) => {
        const d = craftedDerived(model, 'L2', { chest: [S, 14] });
        const vp = planWeeklySets({ derived: d, shape: buildShape(d, model), layouts: [layout], selections: [1, 2, 3].map(e => ({ ...selection, exercise_block: e })), model, fillSlot: () => null });
        return ['Mon', 'Wed', 'Fri'].map(wd => vp.weeks[0].sets_by_slot[`${wd}.X.s01`]).join('/');
      };
      assert.equal(get(7), '3/2/2'); assert.equal(get(8), '3/3/2'); assert.equal(get(9), '3/3/3'); assert.equal(get(10), '4/3/3'); assert.equal(get(11), '4/4/3');
    });

    // RETIRED in engine 0.5.0 (DECISIONS G): 'total weekly sets never rise 10 % (at most 7 % or one set) and every line lands on its ceiling in the last wee…'
    //   retired: the 7 % / 10 % weekly total ceiling is a rate limit CX-01 / R4-PRG-02 removed; 'every group lands on its final sets in the last week' is tested in 'CX-01: the 8 samples ...'

    // RETIRED in engine 0.5.0 (DECISIONS G): 'an exercise-block change that moves a slot to another main muscle puts the lost sets back on the line (H21: th…'
    //   converted -> 'CX-02: sets never drop ...' (group credit: a hinge that becomes a glute bridge stays in the hips group)

    // RETIRED in engine 0.5.0 (DECISIONS G): 'bonus slots take the next free engine-added id of the day (no clash with week.mjs prehab xNN slots)'
    //   converted -> 'allocation step 3: the bonus exercise ...' (bonus slots only on the optional day, ids .xNN)

    // RETIRED in engine 0.5.0 (DECISIONS G): 'the 8 samples: steps = planned stairway, total < +10 %, last week hardest, every trained group holds its floor…'
    //   converted -> 'CX-01: the 8 samples ...' (target reached, arrival in the last week, sets never drop, floors from 3 days)

    // RETIRED in engine 0.5.0 (DECISIONS G): 'weekly sets = credited coach count of the set map (weeklyCredits agrees); week 1 sits at the block start (+-1)'
    //   converted -> 'allocation step 4: credits are recomputed ...' (week 1 sits at or above the group start, inside one set)

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

    // RETIRED in engine 0.5.0 (DECISIONS G): 'bootcamp circuits: every kept station = the week's rounds, the stairway climbs by work seconds, totals flat; …'
    //   converted -> 'PRG-03 circuits ...': every station runs the week's rounds; nothing is named 'not held by the minutes'

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

    // RETIRED in engine 0.5.0 (DECISIONS G): 'a schedule too short for the full plan: told up front, offered more time with computed numbers, fewer groups k…'
    //   retired: the time check, its offers and 'fewer groups kept' are deleted (CT-01, R4-SES-01); the 2-day plan is tested in 'R4-SES-03: two training days ...'

    // RETIRED in engine 0.5.0 (DECISIONS G): 'bonus / Focus work goes to the main days first (v1.2) and never makes a muscle group's only exercise on a mai…'
    //   converted -> 'allocation step 3: the bonus exercise ...' (v0.5: the bonus exercise sits on the optional day, never on a main day)

    it('is deterministic', () => {
      for (const n of ['01', '06', '08']) assert.equal(JSON.stringify(planFor(model, sample(n)).vp), JSON.stringify(planFor(model, sample(n)).vp));
    });
  });

  describe(`volume.athleticBudget (${mname})`, () => {
    it('swimmer: linear week 1 -> week 12 budget, plyo share 0.10 -> 0.25, RC stages, 100 contacts per session (CONTRACTS §9)', () => {
      const d = deriveValues(sample('01'), model); const sh = buildShape(d, model);
      const ab = athleticBudget(d, sh, model);
      // v0.4 stage B2 (E-28): the 04 volume (high contacts 37 -> 49, ankle 51 -> 69, throws 35 -> 45) split by the coach's plyo
      // share (R2-ATH-01: reactive jumps + ankle work over all jump and throw work; R3-ATH-01 swimmers 'mostly ballistic, 25 %'):
      // week 1 is stage 1 (no reactive jumps): ankle = 0.10 x (37 + 35) / 0.90 = 8; the end-test week 12 holds week 11, the top:
      // X = 0.25 x (49 + 45) / (1 - 0.25 x 69/77) = 30.3, ankle 69/77 of it = 27, reactive 3, ballistic 49 - 3 = 46
      assert.deepEqual(ab[0].targets, { plyo_contacts: 0, jump_contacts: 37, low_contacts: 8, throws: 35, cod_cuts: 0, sprint_m: 0, olympic_sets: 5 });
      assert.deepEqual(ab[11].targets, { plyo_contacts: 3, jump_contacts: 46, low_contacts: 27, throws: 45, cod_cuts: 0, sprint_m: 0, olympic_sets: 8 });
      assert.deepEqual(ab[10].targets, ab[11].targets, 'the end-test week holds the week before');
      assert.ok(ab[11].hold && !ab[10].hold);
      const t = ab[11].targets, share = (t.plyo_contacts + t.low_contacts) / (t.plyo_contacts + t.jump_contacts + t.low_contacts + t.throws);
      assert.ok(Math.abs(share - 0.25) < 0.01, `planned share ${share}`);
      assert.equal(ab[0].plyo_share, 0.1); assert.equal(ab[11].plyo_share, 0.25);
      assert.deepEqual(ab.map(a => a.stage), sh.weeks.map(w => w.plyo_stage));
      assert.ok(ab.every(a => a.contacts_session_max === 100 && a.enabled && a.factor === 1));
      for (let k = 1; k < 12; k++) assert.ok(ab[k].plyo_share >= ab[k - 1].plyo_share);
    });

    it('soccer pre-season factors, pickleball heavy play weeks, aesthetics off, 60+ landings only', () => {
      const so = deriveValues(sample('03'), model); const ab = athleticBudget(so, buildShape(so, model), model);
      const pre = model.sport('soccer').pre_season;
      // B2: the pre-season split of the end-of-block volume (share 0.60, stage 2 held): X = 0.6 x (160 + 40) / (1 - 0.6 x 140/235),
      // reactive 95/235 of it = 75.5, then x the profile's pre-season PLYO factor
      // v0.5 fix round 1 (sample 03 major; rules.athletic.x1.scale_by_days, PROPOSED): a profile the coach has not confirmed is written
      // for his 4-day athletic sheet - a 3-day week asks for three quarters of its weekly athletic numbers (never under 0.75)
      const X1A = model.rules.athletic.x1.scale_by_days;
      const k = Math.min(1, Math.max(X1A.floor, so.days_per_week / X1A.reference_days));
      assert.equal(so.D11_athletic_budget.day_scale, k); assert.equal(k, 0.75);
      const X = (0.6 * 200) / (1 - 0.6 * (140 / 235));
      assert.ok(Math.abs(ab[6].targets.plyo_contacts - (X - Math.min(140, (140 / 235) * X)) * pre.PLYO * k) <= 1, String(ab[6].targets.plyo_contacts)); assert.equal(ab[6].targets.cod_cuts, 160 * k);
      assert.equal(ab[6].plyo_share, 0.6); assert.equal(ab[6].factor, pre.PLYO);
      const pb = deriveValues(sample('08'), model); const pab = athleticBudget(pb, buildShape(pb, model), model);
      // B2: stage 1 has no reactive jumps; heavy play weeks halve the jumps (14 -> 7) and drop the extra COD (R3-ATH-05)
      // (fix round 1: the 2-day week takes the day scale's floor, 0.75, before the heavy-play half)
      assert.equal(pab[0].targets.plyo_contacts, 0); assert.ok(Math.abs(pab[0].targets.jump_contacts - 14 * 0.5 * 0.75) <= 1, String(pab[0].targets.jump_contacts)); assert.equal(pab[0].targets.cod_cuts, 0, 'heavy play week: no extra COD');
      assert.equal(pab[0].factor, 0.5); assert.equal(pab[0].contacts_session_max, 80);
      const ae = deriveValues(sample('06'), model); const aab = athleticBudget(ae, buildShape(ae, model), model);
      assert.ok(aab.every(a => !a.enabled && a.plyo_share === null && a.targets.plyo_contacts === null && a.targets.olympic_sets === null));
      const old = deriveValues(sample('08', i => { i.age = 66; i.activity.play_days = []; }), model);
      const oab = athleticBudget(old, buildShape(old, model), model);
      // COACH-R3 R3-ATH-02 (approved; B2): the 60+ default doses landings, light throws and quick stepping toward the profile;
      // reactive jumps, ankle hops, sprints and Olympic lifts are off unless switched on
      assert.ok(oab.every(a => !a.enabled && a.targets.plyo_contacts === null && a.targets.olympic_sets === null && a.targets.low_contacts === null && a.targets.sprint_m === null &&
        typeof a.targets.jump_contacts === 'number' && typeof a.targets.throws === 'number' && typeof a.targets.cod_cuts === 'number'), '60+ default: landings, light throws, quick stepping');
      const opt = deriveValues(sample('08', i => { i.age = 66; i.prefs.older_athletic_opt_in = true; }), model);
      assert.ok(athleticBudget(opt, buildShape(opt, model), model)[0].enabled, 'opt-in unlocks the budget');
    });
  });
}
