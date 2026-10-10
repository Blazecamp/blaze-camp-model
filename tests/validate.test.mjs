// tests/validate.test.mjs - engine/validate.mjs (CONTRACTS §4.9, §6): tests/fixtures/plan-min.json passes every check;
// one mutation per check makes exactly that check (and its H rule) fail. Owner: B4.
import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { validatePlan, CHECK_IDS, plannedStairway } from '../engine/validate.mjs';
import { loadFixtureModel } from './helpers/models.mjs';

const model = loadFixtureModel();
const BASE = JSON.parse(fs.readFileSync(new URL('./fixtures/plan-min.json', import.meta.url), 'utf8'));
const clone = () => structuredClone(BASE);
const check = (res, id) => res.checks.find(c => c.id === id);
const failing = (res) => res.checks.filter(c => !c.pass).map(c => c.id);
const day = (p, wk, wd) => p.weeks[wk - 1].days.find(d => d.weekday === wd);
const items = (p, wk, wd) => day(p, wk, wd).blocks.flatMap(b => b.items);
const item = (p, wk, wd, station) => items(p, wk, wd).find(i => i.slot_id === wd + '.' + station);
const everyWeek = (p, fn) => p.weeks.forEach(w => fn(w.n));
const removeItem = (p, wk, wd, station) => { for (const b of day(p, wk, wd).blocks) b.items = b.items.filter(i => i.slot_id !== wd + '.' + station); };
const setExercise = (it, id, bucket) => { const e = model.ex(id); it.exercise_id = id; it.name_key = e.name_key; it.cue_key = e.cue_key; if (bucket) it.bucket = bucket; it.credits = { ...model.credits(e, it.bucket) }; };

test('plan-min.json passes every check', () => {
  const res = validatePlan(clone(), model);
  assert.equal(res.ok, true);
  assert.deepEqual(failing(res), []);
});

test('CHECK_IDS: V1..V29 then H01..H22, results in that order with the rules keys and severities (v1.2: V27-V29)', () => {
  assert.equal(CHECK_IDS.length, 51);
  assert.equal(CHECK_IDS[0], 'V1');
  assert.equal(CHECK_IDS[28], 'V29');
  assert.equal(CHECK_IDS[29], 'H01');
  assert.equal(CHECK_IDS[50], 'H22');
  const res = validatePlan(clone(), model);
  assert.deepEqual(res.checks.map(c => c.id), [...CHECK_IDS]);
  for (const c of model.rules.validation.checks) assert.equal(check(res, c.id).severity, c.severity);
  for (const c of model.rules.validation.hard) assert.equal(check(res, c.id).key, c.key);
  for (const c of res.checks) assert.ok(model.has('en', c.key), c.key);
});

test('pure: validatePlan never mutates the plan', () => {
  const p = clone();
  const before = JSON.stringify(p);
  validatePlan(p, model);
  assert.equal(JSON.stringify(p), before);
});

// [name, checks that must fail, mutation]
const CASES = [
  ['V1 health refer on an ok plan', ['V1'], (p) => { p.meta.health.refer = true; }],
  ['V1 coach bypass without its warning', ['V1'], (p) => { p.meta.health.health_route = 'coach_own_sop'; p.meta.health.bypass = true; }],
  ['V2 fewer weekdays than training days (warn)', ['V2'], (p) => { p.meta.weekdays = ['Mon']; }],
  ['V3 30-min athlete without the warning (warn)', ['V3'], (p) => { p.meta.session_minutes = 30; }],
  ['V4 youth above the ladder', ['V4'], (p) => { p.meta.derived.age = 15; p.release_stamp.version = 'release.minor'; p.release_stamp.guardian = true; }],
  ['V5 / H12 60+ with Olympic lifts and no warning', ['V5', 'H12'], (p) => { p.meta.derived.age = 65; }],
  ['V6 pre-season weeks without the season warning (warn)', ['V6'], (p) => { p.weeks[2].block_type = 'pre_season'; }],
  ['V7 buy list without the warning (warn)', ['V7'], (p) => { p.meta.kit.buy_list = ['pullup_bar']; }],
  ['V8 three priority choices', ['V8'], (p) => { p.meta.targets.priority = ['quads', 'chest', 'glutes']; }],
  ['V9 / H01 a band swap', ['V9', 'H01'], (p) => { item(p, 1, 'Mon', 'A.s09').swaps.push('cable-row-banded'); }],
  ['V9 / H01 a banned kit token', ['V9', 'H01'], (p) => { p.meta.kit.tokens.push('bands'); }],
  ['V10 / H07 counted squat and hinge on the same day', ['V10', 'H07'], (p) => everyWeek(p, n => setExercise(item(p, n, 'Mon', 'A.s10'), 'barbell-deadlift-conventional'))],
  ['V11 / H06 knee lift paired with a push', ['V11', 'H06'], (p) => everyWeek(p, n => setExercise(item(p, n, 'Mon', 'A.s09'), 'barbell-bench-press', 'RP_HPUSH'))],
  ['V12 / H04 vertical pull before horizontal pull', ['V12', 'H04'], (p) => {
    const b = day(p, 1, 'Mon').blocks.find(x => x.kind === 'strength');
    const v = b.items.find(i => i.bucket === 'RP_VPULL');
    b.items = [b.items[0], v, ...b.items.slice(1).filter(i => i !== v)];
  }],
  ['V12 / H03 power after strength', ['V12', 'H03'], (p) => {
    const d = day(p, 1, 'Thu');
    const pw = d.blocks.find(b => b.kind === 'power');
    d.blocks = [...d.blocks.filter(b => b !== pw), pw];
  }],
  ['V12 / H05 core block after the athletic block', ['V12', 'H05'], (p) => {
    const d = day(p, 1, 'Mon');
    const [w, core, ath, ...rest] = d.blocks;
    d.blocks = [w, ath, core, ...rest];
  }],
  ['V13 long day without warning.long_day', ['V13'], (p) => { day(p, 1, 'Mon').est_minutes = 80; }],
  ['V14 / H08 wrong helper credit', ['V14', 'H08'], (p) => { item(p, 1, 'Mon', 'A.s08').credits = { quads: 1, glutes: 0.5, adductors: 0.25 }; }],
  ['V14 / H09 athletic item credited', ['V14', 'H09'], (p) => { item(p, 1, 'Mon', 'A.s05').credits = { quads: 1 }; }],
  ['V14 / H08 weekly sets that do not add up', ['V14', 'H08'], (p) => { p.weeks[0].weekly_sets_by_muscle.chest = 9; }],
  ['V15 / H10 planned step above 7 %', ['V15', 'H10'], (p) => { p.weeks[1].step_by_muscle.quads = 0.08; }],
  ['V15 / H10 total weekly sets rising 10 % or more', ['V15', 'H10'], (p) => { p.weeks[1].total_resistance_sets = 51; p.weeks[2].total_resistance_sets = 52; }],
  ['V16 / H11 medball above 20 lb', ['V16', 'H11'], (p) => { item(p, 1, 'Thu', 'B.s07').load = { type: 'medball_lb', min: 10, max: 25 }; }],
  ['V16 / H11 medball in aesthetics main work', ['V16', 'H11'], (p) => { p.meta.goal = 'muscle'; setExercise(item(p, 1, 'Thu', 'B.s05'), 'medball-chest-pass', 'AP_PLYO'); }],
  ['V17 / H02 heavy compound at 0 RIR', ['V17', 'H02'], (p) => { Object.assign(item(p, 1, 'Mon', 'A.s08').effort, { min: 0, max: 0 }); }],
  ['V17 / H02 MAX set on a heavy compound', ['V17', 'H02'], (p) => { item(p, 1, 'Mon', 'A.s08').effort.last_set = 'max'; }],
  ['V17 / H02 MYO outside the last week', ['V17', 'H02'], (p) => { const it = items(p, 1, 'Mon').filter(i => i.bucket === 'ISO_CALF').pop(); it.effort.last_set = 'myo'; }],
  ['V17 / H02 effort that ignores the planned RIR', ['V17', 'H02'], (p) => { Object.assign(item(p, 3, 'Mon', 'A.s12').effort, { min: 3, max: 3 }); }],
  ['V18 no calves on a leg day', ['V18'], (p) => { removeItem(p, 1, 'Mon', 'A.s16'); removeItem(p, 1, 'Mon', 'A.s17'); }],
  ['V18 / H05 no core block on a main day', ['V18', 'H05'], (p) => { day(p, 1, 'Thu').blocks = day(p, 1, 'Thu').blocks.filter(b => b.kind !== 'core'); }],
  // (v0.4 fix round 1: the week's rows count toward the rear delts too - rules.volume.rear_from_rows_min - so the mutation also
  // removes the rows' rear-delt credit)
  ['V18 no rear-delt work in the week', ['V18'], (p) => { removeItem(p, 2, 'Mon', 'A.s15'); for (const d of p.weeks[1].days) for (const b of d.blocks) for (const it of b.items) if (it.credits && it.credits.rear_delts) delete it.credits.rear_delts; }],
  ['V19 athletic week without Olympic work', ['V19'], (p) => { for (const d of p.weeks[0].days) d.blocks = d.blocks.filter(b => b.kind !== 'power'); }],
  ['V19 L2_plus Olympic lift in exercise block 1 at L2', ['V19'], (p) => { setExercise(item(p, 1, 'Mon', 'A.s07'), 'power-clean'); }],
  ['V19 snatch family on the clean station', ['V19'], (p) => { setExercise(item(p, 1, 'Mon', 'A.s07'), 'high-hang-snatch-pull'); }],
  ['V19 percentage load', ['V19'], (p) => { item(p, 1, 'Mon', 'A.s07').load = { type: 'pct_hint', pct: 80 }; }],
  ['V20 V-squat swap', ['V20'], (p) => { item(p, 1, 'Mon', 'A.s08').swaps.push('v-squat-machine'); }],
  ['V21 / H20 wrong release version', ['V21', 'H20'], (p) => { p.release_stamp.version = 'release.coach'; }],
  ['V21 / H20 no release stamp', ['V21', 'H20'], (p) => { p.release_stamp = null; }],
  // v0.4 (R3-SES-01 / R3-SES-02): the floor is read from the items on the main days with group credit
  ['V22 / H17 a trained group below the floor of 10', ['V22', 'H17'], (p) => { item(p, 2, 'Mon', 'A.s08').sets = 1; }],
  ['V22 / H17 a group listed as not trained directly that keeps its exercises', ['V22', 'H17'], (p) => {
    p.time_check.not_trained_directly.push({ group: 'back', reason: 'time' }); p.time_check.by_block[0].not_trained_directly.push({ group: 'back', reason: 'time' });
  }],
  ['V23 / H18 one exercise for a group on a full-body day', ['V23', 'H18'], (p) => everyWeek(p, n => removeItem(p, n, 'Mon', 'A.s12'))],
  ['V24 / H15 an easy week inside the stairway', ['V24', 'H15'], (p) => { p.weeks[1].block_type = 'recovery'; }],
  ['V25 / H19 a test in the middle of the block', ['V25', 'H19'], (p) => { p.weeks[1].test = { type: 'baseline', items: ['strength'], from_zero: true }; }],
  ['V25 / H19 a 1RM from zero', ['V25', 'H19'], (p) => { item(p, 1, 'Mon', 'A.s08').test.test = 'rm_3_or_work_up_to_1'; }],
  ['V26 / H16 a lifestyle answer in the input audit', ['V26', 'H16'], (p) => { p.meta.input_audit.forbidden_found = ['sleep']; }],
  ['V26 / H16 a stress key in the plan', ['V26', 'H16'], (p) => { p.meta.stress = 1; }],
  ['H13 a sex field', ['H13'], (p) => { p.meta.derived.sex = 'f'; }],
  ['H14 a key with no EN string', ['H14'], (p) => { item(p, 1, 'Mon', 'A.s08').notes.push({ key: 'note.does_not_exist' }); }],
  ['H21 targets that drop', ['H21'], (p) => { p.weeks[2].target_by_muscle.quads = 10.1; }],
  ['H21 group sets that drop week over week', ['H21'], (p) => { p.weeks[2].weekly_sets_by_group.back = 10; }],
  ['H21 stair level that does not rise', ['H21'], (p) => { p.weeks[1].stair_level = 2; }],
  ['H21 planned RIR that rises', ['H21'], (p) => { p.weeks[2].planned_rir = { min: 3, max: 3, intensifiers: false }; }],
  ['H21 last week not the hardest', ['H21'], (p) => { p.weeks[2].total_resistance_sets = 45; }],
  ['H21 / H22 early step larger than a late step', ['H21', 'H22'], (p) => { p.weeks[1].step_by_muscle.quads = 0.06; }],
  ['H22 a step that is not the planned stairway step', ['H22'], (p) => { p.weeks[1].step_by_muscle.quads = 0.02; }],
  ['H22 an offer without check-ins', ['H22'], (p) => { p.offers = [{ key: 'block.cannot_finish', week: 2 }]; }],
  // v1.2 review round (samples/REVIEW_LOG.md)
  // v0.4 (R3-SES-02 'never flat'): a trained group that does not climb fails even when the client was told (no warning exempts)
  ['H21 a flat trained group even with the time-check warning (review 04 / 06 / 08 blockers, RECHECK 01 / 06 / 08)', ['H21'], (p) => { p.weeks[2].weekly_sets_by_group.quads = 10; }],
  ['V27 athletic work far above the profile budget (review 03 / 08 majors)', ['V27'], (p) => { p.weeks[0].athletic_budget.planned.plyo_contacts = 200; }],
  ['V27 Olympic sets above 1.5 x the weekly target (review 04 major)', ['V27'], (p) => { p.weeks[0].athletic_budget.planned.olympic_sets = 20; }],
  ['V28 bilateral share far from D10 (warn, review 06 major 6)', ['V28'], (p) => { p.meta.share_targets.lower.by_exercise_block = [1]; }],
  ['V29 pushing far above pulling (warn, review 04 major 3)', ['V29'], (p) => { for (const d of p.weeks[0].days) for (const b of d.blocks) for (const it of b.items) if (['RP_HPUSH', 'RP_VPUSH'].includes(it.bucket)) it.sets = 12; }]
];

describe('one failing mutation per check', () => {
  for (const [name, ids, mutate] of CASES) {
    test(name, () => {
      const p = clone();
      mutate(p);
      const res = validatePlan(p, model);
      for (const id of ids) {
        const c = check(res, id);
        assert.equal(c.pass, false, `${id} should fail; failing: ${failing(res).join(' ')}`);
        assert.ok(c.violations.length > 0);
        for (const v of c.violations) assert.ok(v.where && typeof v.key === 'string');
      }
      if (ids.some(id => check(res, id).severity === 'error')) assert.equal(res.ok, false);
    });
  }

  test('every check id has at least one failing mutation above', () => {
    const covered = new Set(CASES.flatMap(c => c[1]));
    assert.deepEqual(CHECK_IDS.filter(id => !covered.has(id)), []);
  });
});

describe('exemptions written into the contract', () => {
  test('v0.4: no warning exempts a trained group from the floor (D-33 retired; RECHECK 01 / 04 validators exempt on warnings)', () => {
    const p = clone();
    item(p, 2, 'Mon', 'A.s08').sets = 1;
    p.meta.warnings.push({ code: 'floor', key: 'warning.floor_schedule', args: { muscles: 'quads', advice: 'ui.plan.schedule_advice.more_days' } });
    p.meta.warnings.push({ code: 'start_lowered', key: 'warning.start_lowered', args: { muscles: 'quads', minutes: 60 } });
    assert.equal(check(validatePlan(p, model), 'V22').pass, false);
  });

  test('a big mover kept below the floor for its work lift and listed by the time check is the one floor exemption (E-11)', () => {
    const p = clone();
    item(p, 2, 'Mon', 'A.s08').sets = 1;
    for (const tc of [p.time_check, p.time_check.by_block[0]]) tc.trained_below_floor.push({ group: 'quads', reason: 'work_lift_time' });
    assert.equal(check(validatePlan(p, model), 'V22').pass, true);
  });

  test('a group listed as not trained directly (time) is exempt from the floor and the climb when it has no exercise', () => {
    const p = clone();
    for (const w of p.weeks) for (const d of w.days) for (const b of d.blocks) b.items = b.items.filter(i => i.group !== 'back');
    for (const tc of [p.time_check, p.time_check.by_block[0]]) tc.not_trained_directly.push({ group: 'back', reason: 'time' });
    const res = validatePlan(p, model);
    assert.equal(check(res, 'V22').violations.filter(v => v.args && (v.args.muscle === 'back' || v.args.group === 'back')).length, 0);
    assert.equal(check(res, 'H21').violations.filter(v => v.args && v.args.muscle === 'back').length, 0);
  });

  test('warning.long_day for the weekday makes a long day legal (D-34)', () => {
    const p = clone();
    day(p, 1, 'Mon').est_minutes = 80;
    p.meta.warnings.push({ code: 'long_day', key: 'warning.long_day', args: { day: 'Mon', min: 80, limit: 60 } });
    assert.equal(check(validatePlan(p, model), 'V13').pass, true);
  });

  test('H before V is exempt when the vertical lift is the work (D-30)', () => {
    const p = clone();
    const b = day(p, 1, 'Mon').blocks.find(x => x.kind === 'strength');
    const v = b.items.find(i => i.bucket === 'RP_VPULL');
    v.role = 'work';
    b.items = [v, ...b.items.filter(i => i !== v)];
    assert.equal(check(validatePlan(p, model), 'H04').pass, true);
  });

  test('core moved by the user (prefs.core_position) is not an order violation', () => {
    const p = clone();
    p.meta.derived.prefs.core_position = 'end';
    const d = day(p, 1, 'Mon');
    const core = d.blocks.find(b => b.kind === 'core');
    d.blocks = [...d.blocks.filter(b => b !== core), core];
    assert.equal(check(validatePlan(p, model), 'H05').pass, true);
  });

  test('a 60+ client with landing drills only and the warning passes V5 (C-11)', () => {
    const p = clone();
    p.meta.derived.age = 65;
    p.meta.warnings.push({ code: 'older', key: 'warning.older_athletic' });
    for (const w of p.weeks) {
      for (const d of w.days) d.blocks = d.blocks.filter(b => b.kind !== 'power');
      for (const k of Object.keys(w.step_by_muscle)) w.step_by_muscle[k] = Math.min(w.step_by_muscle[k], 0.03);
      for (const it of w.days.flatMap(d => d.blocks.flatMap(b => b.items))) it.swaps = [];   // swaps obey the same older filter (H12)
      for (const it of w.days.flatMap(d => d.blocks.flatMap(b => b.items)).filter(i => i.bucket === 'AP_PLYO')) setExercise(it, 'low-depth-drop');
    }
    const res = validatePlan(p, model);
    assert.equal(check(res, 'V5').pass, true, JSON.stringify(check(res, 'V5').violations.slice(0, 3)));
    assert.equal(check(res, 'H12').pass, true);
  });

  test('check-ins are retired: an old check-in plan is held to the planned stairway like any other (H22, R3-VOL-02)', () => {
    const p = clone();
    p.meta.derived.output_mode = 'checkin';
    p.weeks[1].step_by_muscle.quads = 0;
    assert.equal(check(validatePlan(p, model), 'H22').pass, false);
  });
});

describe('refer and invalid plans', () => {
  test('a refer plan with reasons and no weeks passes V1', () => {
    const p = { schema: 'plan/2', status: 'refer', refer: { reasons: ['refer.reason.heart'] }, errors: [], offers: [], meta: { health: { role: 'self', health_route: null, refer: true, reasons: ['refer.reason.heart'], bypass: false }, instruction_keys: ['instruction.title'] }, weeks: [] };
    const res = validatePlan(p, model);
    assert.equal(check(res, 'V1').pass, true);
    assert.equal(res.ok, true);
  });

  test('a refer plan that still has weeks fails V1', () => {
    const p = { schema: 'plan/2', status: 'refer', refer: { reasons: ['refer.reason.heart'] }, errors: [], offers: [], meta: { health: { refer: true } }, weeks: [{ n: 1, days: [] }] };
    assert.equal(check(validatePlan(p, model), 'V1').pass, false);
  });

  test('an invalid plan only runs the input checks', () => {
    const p = { schema: 'plan/2', status: 'invalid', errors: [{ code: 'release_missing', key: 'warning.release_missing' }], offers: [], meta: { input_audit: { keys: [], forbidden_found: [] } }, weeks: [] };
    const res = validatePlan(p, model);
    assert.equal(res.ok, true);
    assert.equal(check(res, 'H14').pass, true);
  });
});

test('plannedStairway reproduces the §4.5 single-muscle acceptance numbers', () => {
  const run = (start, cap, N, caps = [0.07]) => plannedStairway({ start, cap }, N, { early_late: model.stair(N).standard_steps, caps, freeze: 0, after_freeze: null, iterations: 60 });
  assert.equal(Math.round(run(10, 14, 12).lambda * 100) / 100, 0.76);
  assert.equal(Math.round(run(15, 22, 12).lambda * 1000) / 1000, 0.867);
  assert.equal(Math.round(run(20, 25, 12).lambda * 1000) / 1000, 0.501);
  assert.equal(run(15, 22, 8).lambda, 1);
  const p = run(26, 30, 12, [0.07]);
  assert.equal(p.T[12], 30);
  for (let w = 2; w <= 6; w++) for (let v = 7; v <= 12; v++) assert.ok(p.steps[w] <= p.steps[v] + 1e-12);
  const pain = plannedStairway({ start: 6, cap: 11 }, 12, { early_late: model.stair(12).standard_steps, caps: [0.07, 0.03], freeze: 2, after_freeze: 0.03, iterations: 60 });
  assert.equal(pain.steps[2], 0);
  assert.equal(pain.steps[3], 0);
  assert.ok(pain.steps[4] > 0 && pain.steps[4] <= 0.03);
});
