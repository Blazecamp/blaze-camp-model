// tests/validate.test.mjs - engine/validate.mjs (CONTRACTS §4.9, §6): tests/fixtures/plan-min.json passes every check;
// one mutation per check makes exactly that check (and its H rule) fail. Owner: B4.
import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { validatePlan, CHECK_IDS } from '../engine/validate.mjs';
import { planStairway } from '../engine/progression/stairway.mjs';
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

// engine 0.5.0 / V3 (converted; DECISIONS G): the v0.5 check list adds V30-V37 (was 'V1..V29 then H01..H22', 51 ids)
test('CHECK_IDS: V1..V37 then H01..H22, results in that order with the rules keys and severities (v1.2: V27-V29; v0.5: V30-V37)', () => {
  assert.equal(CHECK_IDS.length, 59);
  assert.equal(CHECK_IDS[0], 'V1');
  assert.equal(CHECK_IDS[36], 'V37');
  assert.equal(CHECK_IDS[37], 'H01');
  assert.equal(CHECK_IDS[58], 'H22');
  // every v0.5 rule of design/ENGINE_V05_PLAN.md 'V3 words and checks' names the checks that hold it, and no check reads minutes
  const BR = model.rules.validation.v05.by_rule;
  for (const rule of ['no_time_fitting', 'template_skeleton', 'exercise_count', 'final_target_reached', 'arrival_one_week_early_at_most', 'floor_from_3_days', 'two_day_rule', 'addons_optional_only', 'incline_first', 'liability_gate', 'no_video_urls', 'progression_rule', 'acceleration_note']) {
    assert.ok(Array.isArray(BR[rule]) && BR[rule].length > 0 && BR[rule].every(id => CHECK_IDS.includes(id)), rule);
  }
  const src = fs.readFileSync(new URL('../engine/validate.mjs', import.meta.url), 'utf8').split('\n').filter(l => !/^\s*(\/\/|\*|\/\*)/.test(l)).join('\n');
  // (V3 names the retired fields only to fail a plan that still carries one; nothing reads a day's minutes or the time model)
  for (const word of ['est_minutes', 'time_model', 'aerobic_minutes', 'minutes_saved']) assert.equal(src.includes(word), false, 'engine/validate.mjs reads ' + word);
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
  // v0.5 (CT-01 / R4-SES-01): V3 is 'no time fitting' - a plan that carries a session length, a minute limit, the time check or a
  // time offer was not built by the v0.5 rules (was: 'V3 30-min athlete without the warning')
  ['V3 CT-01 / R4-SES-01: a session length carried in the plan', ['V3'], (p) => { p.meta.session_minutes = 60; }],
  ['V3 CT-01: a per-day minute limit', ['V3'], (p) => { day(p, 1, 'Mon').minutes_limit = 60; }],
  ['V3 CT-01: a time check and its offers', ['V3'], (p) => { p.time_check = { fits: false }; p.offers = [{ key: 'offer.longer_sessions', args: { min: 75 } }]; }],
  ['V3 CT-01: a retired time-fitting warning', ['V3'], (p) => { p.meta.warnings.push({ code: 'time_lower_peak', key: 'warning.two_day_rule', args: { days: 2, low: 6, high: 8, suggest: 3 } }); }],
  // (v0.5 fix round 2, converted - DECISIONS G: the plan's only above-ladder lifts were the flat and incline dumbbell bench presses,
  // which a youth may take now - rules.selection.x2.youth_level_exempt_re, sample 01 major; the mutation names an advanced squat)
  ['V4 youth above the ladder', ['V4'], (p) => { p.meta.derived.age = 15; p.release_stamp.version = 'release.minor'; p.release_stamp.guardian = true; setExercise(item(p, 1, 'Mon', 'A.s09'), 'high-bar-back-squat'); }],
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
  // v0.5 (R4-SES-02): a session is sized by its exercise count (was: 'V13 long day without warning.long_day')
  ['V13 R4-SES-02: a generated session above its size range', ['V13'], (p) => { p.meta.session_size = { type: 'stay_active', range: [5, 8], default: 8 }; }],
  ['V14 / H08 wrong helper credit', ['V14', 'H08'], (p) => { item(p, 1, 'Mon', 'A.s08').credits = { quads: 1, glutes: 0.5, adductors: 0.25 }; }],
  ['V14 / H09 athletic item credited', ['V14', 'H09'], (p) => { item(p, 1, 'Mon', 'A.s05').credits = { quads: 1 }; }],
  ['V14 / H08 weekly sets that do not add up', ['V14', 'H08'], (p) => { p.weeks[0].weekly_sets_by_muscle.chest = 9; }],
  // v0.5 (CX-01 / R4-PRG-01): the final sets are reached in the last week, at most one week early; a faster week is a note
  // (R4-PRG-02), not an error (were: 'V15 / H10 planned step above 7 %', 'V15 / H10 total weekly sets rising 10 % or more')
  ['V15 / H10 CX-01: a group that does not reach its final sets in the last week', ['V15', 'H10'], (p) => { item(p, 3, 'Thu', 'B.s13').sets = 3; }],
  ['V15 / H10 R4-PRG-01: a group at its final sets from week 1 of 3 (more than one week early)', ['V15', 'H10'], (p) => { p.meta.stairway[0].schedule.chest = [8, 8, 8]; }],
  ['V15 / H10 CX-01: a week under the planned schedule', ['V15', 'H10'], (p) => { item(p, 2, 'Thu', 'B.s09').sets = 2; }],
  ['V16 / H11 medball above 20 lb', ['V16', 'H11'], (p) => { item(p, 1, 'Thu', 'B.s07').load = { type: 'medball_lb', min: 10, max: 25 }; }],
  ['V16 / H11 medball in aesthetics main work', ['V16', 'H11'], (p) => { p.meta.goal = 'muscle'; setExercise(item(p, 1, 'Thu', 'B.s05'), 'medball-chest-pass', 'AP_PLYO'); }],
  ['V17 / H02 heavy compound at 0 RIR', ['V17', 'H02'], (p) => { Object.assign(item(p, 1, 'Mon', 'A.s08').effort, { min: 0, max: 0 }); }],
  ['V17 / H02 MAX set on a heavy compound', ['V17', 'H02'], (p) => { item(p, 1, 'Mon', 'A.s08').effort.last_set = 'max'; }],
  ['V17 / H02 MYO outside the last week', ['V17', 'H02'], (p) => { const it = items(p, 1, 'Mon').filter(i => i.bucket === 'ISO_CALF').pop(); it.effort.last_set = 'myo'; }],
  ['V17 / H02 effort that ignores the planned RIR', ['V17', 'H02'], (p) => { Object.assign(item(p, 3, 'Mon', 'A.s12').effort, { min: 3, max: 3 }); }],
  // v0.5 (R4-SES-05; VOL-17): the template says which leg days hold the calf exercise - a day that has one runs it at 3 sets or more
  ['V18 VOL-17: the calf exercise of a leg day under 3 sets', ['V18'], (p) => { item(p, 1, 'Mon', 'A.s16').sets = 2; }],
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
  // v0.5 / V3 (COACH-R4 R4-SCP-02 'they need to click it before the plan shows'): the liability gate
  ['V21 / H20 R4-SCP-02: a plan whose release was not accepted', ['V21', 'H20'], (p) => { p.release_stamp.accepted = false; }],
  ['V21 / H20 R4-SCP-02: a plan whose stamp does not say the release was accepted', ['V21', 'H20'], (p) => { delete p.release_stamp.accepted; }],
  // v0.4 (R3-SES-01 / R3-SES-02): the floor is read from the items on the main days with group credit
  // v0.5 (R4-SES-03): on 2 training days every big group holds 6 weekly sets or more; the floor of 10 applies from 3 days
  ['V22 / H17 R4-SES-03: a big group under 6 weekly sets on a 2-day plan', ['V22', 'H17'], (p) => { item(p, 2, 'Thu', 'B.s09').sets = 1; }],
  ['V22 / H17 R3-SES-01: a trained group below the floor of 10 from 3 training days', ['V22', 'H17'], (p) => { p.meta.two_day = null; p.meta.targets.floor_groups = ['quads', 'hips', 'back', 'chest']; }],
  // RETIRED in engine 0.5.0 (DECISIONS G): 'V22 / H17 a group listed as not trained directly that keeps its exercises'
  //   the time check and its not-trained-directly list are gone (CT-01); nothing is dropped automatically (R4-SES-04)
  // v0.5 (R4-SES-05): a day holds the 1-4 exercises the template gives a group (was: 'one exercise for a group on a full-body day')
  ['V23 / H18 R4-SES-05: five exercises for a group on a full-body day', ['V23', 'H18'], (p) => everyWeek(p, n => {
    const b = day(p, n, 'Mon').blocks.find(x => x.kind === 'accessories');
    const q = b.items.find(i => i.bucket === 'ISO_QUAD');
    for (let k = 0; k < 3; k++) b.items.push({ ...structuredClone(q), slot_id: q.slot_id + 'x' + k });
  })],
  ['V24 / H15 an easy week inside the stairway', ['V24', 'H15'], (p) => { p.weeks[1].block_type = 'recovery'; }],
  ['V25 / H19 a test in the middle of the block', ['V25', 'H19'], (p) => { p.weeks[1].test = { type: 'baseline', items: ['strength'], from_zero: true }; }],
  ['V25 / H19 a 1RM from zero', ['V25', 'H19'], (p) => { item(p, 1, 'Mon', 'A.s08').test.test = 'rm_3_or_work_up_to_1'; }],
  ['V26 / H16 a lifestyle answer in the input audit', ['V26', 'H16'], (p) => { p.meta.input_audit.forbidden_found = ['sleep']; }],
  ['V26 / H16 a stress key in the plan', ['V26', 'H16'], (p) => { p.meta.stress = 1; }],
  ['H13 a sex field', ['H13'], (p) => { p.meta.derived.sex = 'f'; }],
  ['H14 a key with no EN string', ['H14'], (p) => { item(p, 1, 'Mon', 'A.s08').notes.push({ key: 'note.does_not_exist' }); }],
  // v0.5: the targets are whole sets per group (target_by_group); the sets are read from the items
  ['H21 targets that drop', ['H21'], (p) => { p.weeks[2].target_by_group.chest = 6; }],
  ['H21 group sets that drop week over week', ['H21'], (p) => { item(p, 3, 'Thu', 'B.s09').sets = 2; }],
  ['H21 stair level that does not rise', ['H21'], (p) => { p.weeks[1].stair_level = 2; }],
  ['H21 planned RIR that rises', ['H21'], (p) => { p.weeks[2].planned_rir = { min: 3, max: 3, intensifiers: false }; }],
  ['H21 last week not the hardest', ['H21'], (p) => { p.weeks[2].total_resistance_sets = 41; }],
  // RETIRED in engine 0.5.0 (DECISIONS G): 'H21 / H22 early step larger than a late step'
  //   the steps follow the whole-set schedule that reaches the target (CX-01); a faster early week is a note (R4-PRG-02)
  // v0.5 (CX-01): every week's group target IS the planned whole-set schedule (was: 'a step that is not the planned stairway step')
  ['H22 CX-01: a weekly target that is not the planned schedule', ['H22'], (p) => { p.weeks[1].target_by_group.chest = 8; }],
  ['H22 CX-01: a schedule that does not start at the group start or end at its final sets', ['H22'], (p) => { p.meta.stairway[0].schedule.chest = [6, 7, 7]; }],
  ['H22 a step written into week 1', ['H22'], (p) => { p.weeks[0].step_by_muscle.chest = 0.03; }],
  ['H22 an offer without check-ins', ['H22'], (p) => { p.offers = [{ key: 'block.cannot_finish', week: 2 }]; }],
  // v1.2 review round (samples/REVIEW_LOG.md)
  // RETIRED in engine 0.5.0 (DECISIONS G): 'H21 a flat trained group even with the time-check warning (review 04 / 06 / 08 blockers, RECHECK 01 / 06 / 08)'
  //   a group already at its final sets holds them and progresses by reps or load (CX-02); a group that does not REACH its final
  //   sets fails V15 (the case above)
  ['V27 athletic work far above the profile budget (review 03 / 08 majors)', ['V27'], (p) => { p.weeks[0].athletic_budget.planned.plyo_contacts = 200; }],
  ['V27 Olympic sets above 1.5 x the weekly target (review 04 major)', ['V27'], (p) => { p.weeks[0].athletic_budget.planned.olympic_sets = 20; }],
  ['V28 bilateral share far from D10 (warn, review 06 major 6)', ['V28'], (p) => { p.meta.share_targets.lower.by_exercise_block = [1]; }],
  // ---- engine 0.5.0 / V3: the v0.5 check list (design/ENGINE_V05_PLAN.md 'V3 words and checks')
  ['V30 R4-SES-05: a day that says it follows the coach\'s A day (pull + knee) with a squat in the row\'s slot', ['V30'], (p) => { day(p, 1, 'Mon').skeleton = 'athletic_A'; }],
  ['V30 R4-SES-05: a day that names a skeleton its template day type does not have', ['V30'], (p) => { day(p, 1, 'Thu').skeleton = 'gym_A'; }],
  ['V31 R4-LIB-01: an optional add-on as a template pick', ['V31'], (p) => { setExercise(item(p, 1, 'Mon', 'A.s16'), 'seated-bent-knee-calf-raise-soleus'); }],
  ['V31 R4-LIB-01: a still-proposed record (neck work) among the swaps', ['V31'], (p) => { const neck = model.exercises().find(e => /^proposed/.test(e.status)); item(p, 1, 'Mon', 'A.s09').swaps.push(neck.id); }],
  ['V32 R4-LIB-03: a general-population plan whose vertical push slot is all overhead pressing (warn)', ['V32'], (p) => { p.meta.goal = 'general'; p.meta.profile.competitive = 'recreational'; }],
  ['V33 R4-LIB-05: a third-party video link on an item', ['V33'], (p) => { item(p, 1, 'Mon', 'A.s08').video = { kind: 'observed', url: 'https://youtu.be/abc123' }; }],
  ['V33 R4-LIB-05: a third-party link anywhere in the plan', ['V33'], (p) => { item(p, 2, 'Thu', 'B.s09').notes.push({ key: 'note.per_side', args: { url: 'https://www.youtube.com/watch?v=abc123' } }); }],
  ['V34 R4-PRG-03: a lift with no progression rule', ['V34'], (p) => { item(p, 1, 'Mon', 'A.s08').progression = null; }],
  ['V34 R4-PRG-03: a number promised for a week', ['V34'], (p) => { const pr = item(p, 1, 'Mon', 'A.s09').progression; pr.promised_numbers = true; pr.weeks = [{ week: 3, reps: 12 }]; }],
  ['V35 R4-PRG-02: a week that adds more than about 15 % without its note', ['V35'], (p) => { item(p, 2, 'Thu', 'B.s09').sets += 2; item(p, 3, 'Thu', 'B.s09').sets += 2; }],
  ['V36 R4-SES-04: a main lift on the easy-to-remove list', ['V36'], (p) => { day(p, 1, 'Mon').easy_to_remove.push({ slot_id: 'Mon.A.s08', kind: 'small_muscle_accessory' }); }],
  ['V37 R4-LIB-02: a carry counted in reps with muscle credit', ['V37'], (p) => { const it = item(p, 1, 'Mon', 'A.s12'); setExercise(it, 'farmer-carry'); it.credits = { quads: 1 }; }],
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
    item(p, 2, 'Thu', 'B.s09').sets = 1;
    p.meta.warnings.push({ code: 'capped_by_template', key: 'warning.capped_by_template', args: { group: 'chest', held: 4, planned: 8 } });
    assert.equal(check(validatePlan(p, model), 'V22').pass, false);
  });

  // (converted in v0.5 from 'a big mover kept below the floor for its work lift and listed by the time check is the one floor
  // exemption (E-11)': the time check is gone; the one exemption is a group the template's exercises cannot hold, said in the plan)
  test('R4-SES-04: a group the template cannot hold at the floor, said in meta.stairway[].below_floor, is the one floor exemption', () => {
    const p = clone();
    item(p, 2, 'Thu', 'B.s09').sets = 1;
    p.meta.stairway[0].below_floor.push('chest');
    assert.equal(check(validatePlan(p, model), 'V22').pass, true);
  });

  // (converted in v0.5 from 'a group listed as not trained directly (time) is exempt ...': a group with no exercise of its own in
  // the template is credit-only for the plan - meta.stairway[].credit_only_groups, warning.credit_only_groups)
  test('R4-SES-04: a credit-only group (no exercise of its own in the template) is outside the floor and the climb', () => {
    const p = clone();
    for (const w of p.weeks) for (const d of w.days) for (const b of d.blocks) b.items = b.items.filter(i => i.group !== 'back');
    const st = p.meta.stairway[0];
    st.groups = st.groups.filter(g => g !== 'back'); st.credit_only_groups.push('back');
    for (const k of ['group_start', 'group_top', 'schedule', 'group_lambda', 'arrival_week', 'realized_arrival_week', 'realized_top']) delete st[k].back;
    for (const w of p.weeks) w.target_by_group.back = null;
    const res = validatePlan(p, model);
    assert.equal(check(res, 'V22').violations.filter(v => v.args && (v.args.muscle === 'back' || v.args.group === 'back')).length, 0);
    assert.equal(check(res, 'V15').violations.filter(v => v.args && v.args.group === 'back').length, 0);
    assert.equal(check(res, 'H21').violations.filter(v => v.args && v.args.muscle === 'back').length, 0);
    assert.equal(check(res, 'H22').violations.filter(v => v.args && v.args.muscle === 'back').length, 0);
  });

  // (converted in v0.5 from 'warning.long_day for the weekday makes a long day legal (D-34)': no minute limit exists)
  test('CT-01: the minutes of a day are an estimate only - a long estimate is legal and needs no warning', () => {
    const p = clone();
    day(p, 1, 'Mon').est_minutes = 180;
    const res = validatePlan(p, model);
    assert.equal(check(res, 'V13').pass, true);
    assert.equal(check(res, 'V3').pass, true);
    assert.equal(res.ok, true);
  });

  test('CX-04: an edited plan is not judged by the generated-plan size and schedule rules', () => {
    const p = clone();
    p.edited = true;
    p.meta.session_size = { type: 'stay_active', range: [5, 8], default: 8 };
    item(p, 3, 'Thu', 'B.s13').sets = 3;
    const res = validatePlan(p, model);
    assert.equal(check(res, 'V13').pass, true);
    assert.equal(check(res, 'V15').pass, true);
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
    p.weeks[1].target_by_group.chest = 6;   // (v0.5: the planned schedule says 7 - a held week is not the plan)
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

test('CX-01 / R4-PRG-01: the planned stairway keeps the coach\'s lambda numbers, reaches the target in the last week and may run faster', () => {
  // (converted in v0.5 from 'plannedStairway reproduces the §4.5 single-muscle acceptance numbers': the validator's own lambda <= 1
  // recompute is gone - the kernel is engine/progression; a block too short for the default steps now REACHES its target, CX-01)
  const rates = (N) => Array.from({ length: N - 1 }, (_, i) => model.stair(N).standard_steps[String(i + 2)]);
  const run = (start, peak, N) => planStairway({ start, peak, rates: rates(N), noteAbove: 0.15, minWholeSets: 2 });
  assert.equal(Math.round(run(10, 14, 12).lambda * 100) / 100, 0.76);
  assert.equal(Math.round(run(15, 22, 12).lambda * 1000) / 1000, 0.867);
  assert.equal(Math.round(run(20, 25, 12).lambda * 1000) / 1000, 0.501);
  for (const [s, p, N] of [[10, 14, 12], [15, 22, 12], [20, 25, 12], [26, 30, 12], [15, 22, 8]]) {
    const out = run(s, p, N);
    assert.equal(out.sets[0], s);
    assert.equal(out.sets[N - 1], p);
    assert.equal(out.sets.indexOf(p), N - 1, 'the top number arrives in the last week');
  }
  // 8 weeks 15 -> 22 needs more than the default 3 % / 5 %: v0.4 stopped short at lambda 1, v0.5 reaches 22 (faster steps allowed)
  assert.ok(run(15, 22, 8).lambda > 1);
  // a pain area holds for its freeze weeks, then climbs slowly (VOL-03): the curve's weights are 0, 0, then at most 3 %
  const painRates = rates(12).map((r, i) => (i + 1 <= 2 ? 0 : Math.min(r, 0.03)));
  const pain = planStairway({ start: 6, peak: 8, rates: painRates, noteAbove: 0.15, minWholeSets: 2 });
  assert.deepEqual(pain.sets.slice(0, 3), [6, 6, 6]);
  assert.equal(pain.sets[11], 8);
});
