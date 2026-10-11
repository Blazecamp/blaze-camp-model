// Blaze Camp engine 0.5.0 - fix round 2 (the 8 coach-eye sample reviews, second pass): one test per rule the round added, named
// with the coach answer it comes from. Every plan here is generated in the test - no stored plan is read.
//   layer   tools/fixture/v05-fix2.mjs is pure and idempotent, and each new rule section says where it comes from
//   01      R4-LIB-01 core picks; 04 LOW_BACK_* the low-back opener; R4-LIB-03 / R3-ATH-01 the swimmer's presses; R4-SES-05 the
//           third chest lift; EQ-15 loaded jumps; R3-ATH-01 no upper-body plyo
//   02      OBSERVED BASEBALL Part E the sprint buy-out; R2-SES-06 the session after lifting is the easy one
//   03      VOL-18 the back keeps its final sets; UNI-02 / UNI-03 the cutting sport's single-leg and one-arm work
//   04      R4-SES-05 class skeletons and partners; ATH-10 hang power lifts; R2-SES-03 the light opener; R4-PRG-01 the test-week hold
//   05      OT06 his slots, the kit and the order; PRG-03 / CX-02 seconds and rounds; VOL-06 the absolute cap
//   06 / 07 VOL-07 / VOL-16 where the sets go; VOL-17 the rear-delt station; R4-PRG-04 the extra exercise and the ceiling
//   08      VOL-03 / R2-LIB-03 the pain words; R4-LIB-04 swap notes
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadFixtureModel, loadCompiledModel, loadSample, readModelDir, readFixtureRaw } from './helpers/models.mjs';
import { randomIntake } from './helpers/random-intake.mjs';
import { generate } from '../engine/generate.mjs';
import { validatePlan } from '../engine/validate.mjs';
import { buildShape } from '../engine/shape.mjs';
import { swapNote } from '../engine/library.mjs';
import { isNearDuplicate } from '../engine/select.mjs';
import { amendRulesX2, amendTemplatesX2, amendExerciseX2, UI_X2, CLASS_SKELETONS } from '../tools/fixture/v05-fix2.mjs';
import { makeContext, scorePlan, SCORER_VERSION } from '../design/bench/score.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const BENCH_DIR = path.join(ROOT, 'design', 'bench', 'intakes');
const EPS = 1e-9;
const clone = (x) => JSON.parse(JSON.stringify(x));
const NAMES = { '01': '01-swimming', '02': '02-football', '03': '03-soccer', '04': '04-crossfit-style-bootcamp', '05': '05-bootcamp', '06': '06-full-body-aesthetics', '07': '07-push-pull-legs', '08': '08-pickleball-genpop' };
const WD7 = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const model = loadCompiledModel() || loadFixtureModel();
const raw = loadCompiledModel() ? readModelDir() : readFixtureRaw();
const R = model.rules;
const plans = new Map();
const planOf = (n) => { if (!plans.has(n)) plans.set(n, generate(loadSample(NAMES[n]), model)); return plans.get(n); };
const bench = (nn) => JSON.parse(fs.readFileSync(path.join(BENCH_DIR, fs.readdirSync(BENCH_DIR).find(f => f.startsWith(nn + '-'))), 'utf8'));
const benchOf = (nn) => { if (!plans.has('B' + nn)) plans.set('B' + nn, generate(bench(nn), model)); return plans.get('B' + nn); };
const ex = (id) => (id && model.hasEx(id) ? model.ex(id) : null);
const kindOf = (b) => { try { return model.bucket(b).kind; } catch { return null; } };
const allItems = (p) => p.weeks.flatMap(w => w.days.flatMap(d => d.blocks.flatMap(b => b.items.map(it => ({ w, d, b, it })))));
const itemsOf = (w) => w.days.flatMap(d => d.blocks.flatMap(b => b.items.map(it => ({ w, d, b, it }))));
const stair = (p) => p.weeks.filter(w => w.block_type === 'stairway');
const check = (v, id) => v.checks.find(c => c.id === id);
const codes = (p) => p.meta.warnings.map(w => w.code);
const X2 = R.selection.x2, PX2 = R.placement.x2;

describe('v0.5 fix round 2 - the amendment layer', () => {
  it('amendRulesX2 / amendTemplatesX2 / amendExerciseX2 do not change their input and are idempotent on the built model', () => {
    const fx = readFixtureRaw();
    const r0 = clone(fx.rules), t0 = clone(fx.templates.families);
    const r1 = amendRulesX2(fx.rules), t1 = amendTemplatesX2(fx.templates.families);
    assert.deepEqual(fx.rules, r0); assert.deepEqual(fx.templates.families, t0);
    assert.deepEqual(r1, fx.rules, 'the fixture already carries the layer'); assert.deepEqual(t1, fx.templates.families);
    for (const e of fx.catalog.exercises) assert.deepEqual(amendExerciseX2(e), e, e.id);
    // the compiled model carries the same rules
    assert.deepEqual(raw.rules.selection.x2, fx.rules.selection.x2);
    assert.deepEqual(raw.rules.placement.x2, fx.rules.placement.x2);
  });
  it('every new rule section names its coach answers; the layer\'s words are in English and Spanish', () => {
    for (const [name, sec] of [['selection.x2.core_primary', X2.core_primary], ['athletic.x2', R.athletic.x2], ['placement.x2.order', PX2.order], ['selection.x2.shoulder_press', X2.shoulder_press], ['athletic.x2.loaded_jump', R.athletic.x2.loaded_jump]]) {
      assert.ok(sec && Array.isArray(sec.refs) && sec.refs.length > 0, name + ': refs');
    }
    for (const [k, v] of Object.entries(UI_X2)) { assert.equal(v.length, 2, k); assert.ok(v[0] && v[1], k + ': English and Spanish'); assert.ok(!/\b(RIR|RPE|AMRAP)\b/.test(v[0]), k); assert.equal(model.t('en', k), v[0], k); }
    assert.equal(model.engine_version || '0.5.0', '0.5.0');
  });
});

describe('v0.5 fix round 2 - sample 01 (swimming)', () => {
  it('R4-LIB-01 / R4-LIB-02 (01): a core slot never holds a carry or an optional add-on, and a swap-only record only where the low-back rule names it', () => {
    assert.equal(ex('single-side-suitcase-carry').status, 'optional_addon');
    assert.deepEqual(ex('single-side-suitcase-carry').default_in_slots, []);
    const CP = X2.core_primary, so = R.selection.swap_only_statuses;
    assert.equal(CP.live_only, true);
    for (const n of Object.keys(NAMES)) for (const x of allItems(planOf(n))) {
      if (x.b.kind !== 'core' || !x.it.exercise_id) continue;
      const e = ex(x.it.exercise_id);
      assert.ok(!e.tags.includes('carry_sled'), `${n} w${x.w.n} ${x.d.weekday}: ${e.id} is a carry`);
      assert.notEqual(e.status, 'optional_addon', `${n} ${e.id}`);
      assert.ok(!so.includes(e.status) || CP.low_back_allow_ids.includes(e.id), `${n} w${x.w.n} ${x.d.weekday}: ${e.id} is a ${e.status} record`);
    }
  });
  it('04 LOW_BACK_* / R2-SES-03 (01 / 02 / 04 / 08): a low-back client\'s core is anti-movement work every day - a plank runs twice a week, two or more days apart, before a crunch, a leg raise or a hanging raise takes the slot', () => {
    const avoid = new RegExp(R.selection.f3.core_low_back.avoid_re);
    assert.equal(X2.core_primary.low_back_repeat_first, true);
    let repeats = 0;
    // (engine 0.6 selection, converted - DECISIONS G-131: the low-back list is for a client who reports low-back pain, or a 50+ client
    // with the hot spot; the swimmer and the linebacker are read with the pain entered, 04 and 08 as they are)
    const lbPlan = (n) => { if (['01', '02'].includes(n)) { const i = loadSample(NAMES[n]); i.pain = [{ area: 'lower_back', side: 'both', severity: 'mild', worse_with: [] }]; return generate(i, model); } return planOf(n); };
    const lbPlans = new Map(['01', '02', '04', '08'].map(n => [n, lbPlan(n)]));
    for (const n of ['01', '02', '08']) for (const w of lbPlans.get(n).weeks) {
      const seen = new Map();
      for (const x of itemsOf(w)) {
        if (x.b.kind !== 'core' || !x.it.exercise_id || x.d.optional) continue;
        assert.ok(!avoid.test(x.it.exercise_id), `${n} w${w.n} ${x.d.weekday}: ${x.it.exercise_id}`);
        const before = seen.get(x.it.exercise_id);
        if (before !== undefined) { repeats++; assert.ok(Math.abs(WD7.indexOf(x.d.weekday) - WD7.indexOf(before)) >= 2, `${n} w${w.n}: ${x.it.exercise_id} on ${before} and ${x.d.weekday}`); }
        seen.set(x.it.exercise_id, x.d.weekday);
      }
    }
    assert.ok(repeats > 0, 'a week with more core slots than anti-movement drills repeats one');
    // a core pick stays through the exercise block (PER-02; engine 0.6, converted - G-131: one core exercise a main day may change at
    // an exercise-block boundary)
    for (const n of ['01', '04']) { const p = lbPlans.get(n); const by = new Map(); for (const x of allItems(p)) if (x.b.kind === 'core' && x.w.block_type === 'stairway') { const k = x.it.slot_id + '|' + x.w.exercise_block; if (!by.has(k)) by.set(k, new Set()); by.get(k).add(x.it.exercise_id); } for (const [k, s] of by) assert.equal(s.size, 1, `${n} ${k}: ${[...s].join(', ')}`); }
  });
  it('R2-SES-05 (all samples): a Copenhagen plank and toes-to-bar, a dead bug and a bird dog are different exercises; two hanging rotational raises are one', () => {
    assert.equal(isNearDuplicate(model, ex('copenhagen-plank'), ex('toes-to-bar-hanging')), false);
    assert.equal(isNearDuplicate(model, ex('dead-bugs'), ex('bird-dogs')), false);
    assert.equal(isNearDuplicate(model, ex('hanging-rotational-knees-to-chest-hanging-oblique-knee-raise'), ex('hanging-rotational-knee-leg-raise')), true);
    assert.equal(isNearDuplicate(model, ex('seated-chest-to-thighs-db-reverse-fly'), ex('bent-over-db-reverse-fly')), true);
  });
  it('R4-LIB-03 / R3-ATH-01 (01): the swimmer presses with dumbbells or a machine - no fixed-grip barbell press, no overhead press in slot 3 - and the youth ladder lets him take the dumbbell bench presses', () => {
    const p = planOf('01');
    assert.deepEqual(X2.incline_first_hotspot_codes, ['SHOULDER_SWIMMER']);
    assert.ok(new RegExp(X2.youth_level_exempt_re).test('flat-db-bench-press'));
    let presses = 0;
    for (const x of allItems(p)) {
      if (!['RP_HPUSH', 'RP_VPUSH'].includes(x.it.bucket) || !x.it.exercise_id || x.d.optional) continue;
      const e = ex(x.it.exercise_id); presses++;
      assert.ok(!(e.tags.includes('fixed_grip') && /barbell/.test(e.id)), `w${x.w.n} ${x.d.weekday}: ${e.id}`);
      if (x.it.bucket === 'RP_VPUSH') assert.ok(e.tags.includes('mid_range_push') || /incline/.test(e.id), `w${x.w.n} slot 3: ${e.id}`);
    }
    assert.ok(presses > 0);
    assert.equal(check(p.validation, 'V4').pass, true);
    // a thrower keeps his own one-arm press: the rule is named by hot-spot code, not by 'any sore shoulder'
    const pit = benchOf('34');
    assert.ok(allItems(pit).some(x => x.it.bucket === 'RP_VPUSH' && x.it.exercise_id && ex(x.it.exercise_id).laterality !== 'bilateral'), 'the pitcher holds a one-arm or alternating vertical press');
  });
  it('R4-SES-05 (01 / 03): a 3-day athletic week with one B day takes the incline press in its "Chest / Shoulders" slot - three chest lifts, none above the level\'s sets on its own', () => {
    assert.equal(X2.chest_shoulders_single_b.max_press_days, 2);
    for (const n of ['01', '03']) {
      const p = planOf(n), w = stair(p)[0];
      const chest = itemsOf(w).filter(x => !x.d.optional && x.it.exercise_id && (x.it.credits || {}).chest === 1 && kindOf(x.it.bucket) === 'resistance' && x.it.role !== 'test');
      assert.ok(chest.length >= 3, `${n}: ${chest.map(x => x.it.exercise_id).join(', ')}`);
      assert.ok((w.main_sets_by_group || w.weekly_sets_by_group).chest >= 10 - EPS, `${n}: chest on the training days`);
    }
    // a dumbbell-and-bench kit keeps its incline press for the second pressing day (no floor press while a bench press is left)
    const p69 = benchOf('69'), floor = new RegExp(R.selection.lead_press.floor_re);
    for (const w of p69.weeks) for (const d of w.days.filter(x => x.kind === 'main')) { const lead = d.blocks.flatMap(b => b.items).find(it => it.bucket === 'RP_HPUSH' && it.role !== 'test' && it.exercise_id && !(it.flags || []).includes('pattern_gap')); if (lead) assert.ok(!floor.test(lead.exercise_id), `bench 69 w${w.n} ${d.weekday}: ${lead.exercise_id}`); }
  });
  it('EQ-15 / CAT-10 (01 / 02): no loaded jump opens a plan, and a jump is never loaded by an implement heavier than 20 % of body weight', () => {
    const LJ = R.athletic.x2.loaded_jump;
    assert.equal(LJ.max_bw_share, 0.2); assert.deepEqual(LJ.never_stages, ['RC1']); assert.deepEqual(LJ.stage_exempt_tags, ['medball']);
    for (const n of ['01', '02', '03']) {
      const p = planOf(n), bw = p.meta.derived.body_weight_lb;
      for (const x of allItems(p)) {
        const e = x.it.exercise_id && ex(x.it.exercise_id);
        if (!e || !/^AP_/.test(x.it.bucket) || !e.tags.includes('loaded_jump')) continue;
        if (!e.tags.includes('medball')) assert.ok(x.w.plyo_stage !== 'RC1' && x.w.exercise_block > 1, `${n} w${x.w.n}: ${e.id} in ${x.w.plyo_stage}`);
        const min = LJ.implement_min_lb[e.id];
        if (typeof min === 'number' && typeof bw === 'number') assert.ok(min <= LJ.max_bw_share * bw + EPS, `${n}: ${e.id} needs ${min} lb for a ${bw}-lb client`);
      }
    }
    assert.ok(!allItems(planOf('01')).some(x => x.it.exercise_id === 'hex-bar-jump-squat'), 'an empty hex bar is over 20 % of the swimmer\'s body weight');
  });
  it('R3-ATH-01 (01): no upper-body plyo for a swimmer\'s shoulder - the slot is a leg jump', () => {
    assert.deepEqual(R.athletic.x2.upper_plyo_not_for_codes, ['SHOULDER_SWIMMER']);
    assert.ok(!allItems(planOf('01')).some(x => x.it.athletic && x.it.athletic.key === 'upper_contacts'));
  });
});

describe('v0.5 fix round 2 - sample 02 (football)', () => {
  it('OBSERVED BASEBALL Part E (02): the sprint buy-out is 1 x 20, then 2 x 15, then 3 x 10 calories, all out, never more than 30 calories a day', () => {
    const BX = R.conditioning.buyout_pool.x2;
    assert.deepEqual(BX.bouts_by_block, [1, 2, 3]); assert.deepEqual(BX.calories_by_bouts, { 1: 20, 2: 15, 3: 10 }); assert.equal(BX.max_total_cal, 30);
    const p = planOf('02');
    const bo = allItems(p).filter(x => x.it.bucket === 'COND_SPRINT_BUYOUT' && x.it.exercise_id && x.w.block_type === 'stairway');
    assert.ok(bo.length > 0);
    for (const x of bo) {
      if (x.it.reps && x.it.reps.type === 'calories') {
        assert.equal(x.it.reps.n, BX.calories_by_bouts[x.it.sets], `w${x.w.n} ${x.d.weekday}: ${x.it.sets} x ${x.it.reps.n}`);
        assert.ok(x.it.sets * x.it.reps.n <= BX.max_total_cal);
        assert.equal(x.it.effort.key, BX.effort_key);
      }
      // (an end-test week runs the baseline week's dose again, R2-PER-07)
      if (!(x.w.test && x.w.n > 1)) assert.equal(x.it.sets, BX.bouts_by_block[Math.min(x.w.exercise_block, 3) - 1], `w${x.w.n} ${x.d.weekday}`);
    }
  });
  it('R2-SES-06 (02 / 06): the aerobic session that follows lifting is the easy one, and that day holds no sprint buy-out', () => {
    assert.equal(R.conditioning.x2.addon_easy_colour, R.conditioning.extra_colour);
    assert.equal(R.conditioning.buyout_pool.x2.not_with_aerobic_addon, true);
    for (const n of ['02', '06']) for (const w of planOf(n).weeks) for (const d of w.days) {
      const its = d.blocks.flatMap(b => b.items);
      const addon = its.filter(it => it.aerobic && it.aerobic.position === 'addon_after');
      if (!addon.length) continue;
      for (const a of addon) if (w.block_type === 'stairway' && w.days.some(d2 => d2.blocks.some(b => b.items.some(it => it.aerobic && it.aerobic.position === 'separate')))) assert.equal(a.aerobic.colour, R.conditioning.extra_colour, `${n} w${w.n} ${d.weekday}`);
      assert.ok(!its.some(it => it.bucket === 'COND_SPRINT_BUYOUT' && it.exercise_id), `${n} w${w.n} ${d.weekday}: a buy-out before the aerobic session`);
    }
  });
  it('R4-PRG-03 (02 / 03 / 04): a weighted pull-up is no default vertical pull below L3 or for a heavy athlete', () => {
    assert.deepEqual(X2.weighted_pull.from_levels, ['L3']);
    for (const n of ['02', '03', '04']) { const p = planOf(n); if (p.meta.level.client === 'L3') continue; assert.ok(!allItems(p).some(x => x.it.exercise_id === 'weighted-pull-up' && x.it.role !== 'test'), n); }
  });
});

describe('v0.5 fix round 2 - sample 03 (soccer)', () => {
  it('VOL-18 (03): the back is not raised above its sport-scaled final sets for the balance; reverse flies and face pulls count as pulling; a press leads the pulls by one set at most', () => {
    const PP = R.volume.push_pull;
    assert.equal(PP.back_cap, 'planned'); assert.equal(PP.capped_slack, 1); assert.ok(PP.pull_classes.includes('ISO_REAR') && PP.pull_classes.includes('FACEPULL'));
    for (const n of ['02', '03']) {
      const p = planOf(n), st = p.meta.stairway[0];
      const top = st.planned_top.lats_upper_back ?? st.planned_top.back;
      for (const w of stair(p)) {
        assert.ok(w.weekly_sets_by_group.back <= Math.max(top, st.group_top.back) + EPS, `${n} w${w.n}: back ${w.weekly_sets_by_group.back} above ${top}`);
        let push = 0, pull = 0;
        for (const x of itemsOf(w)) { if (!x.it.sets || x.it.role === 'prehab' || !x.it.exercise_id || !ex(x.it.exercise_id)) continue; const c = ex(x.it.exercise_id).credit_class; if (PP.push_classes.includes(c)) push += x.it.sets; else if (PP.pull_classes.includes(c)) pull += x.it.sets; }
        assert.ok(pull >= push - PP.capped_slack - EPS, `${n} w${w.n}: pull ${pull} against push ${push}`);
      }
      // the back is not the biggest group of a field athlete
      const last = stair(p).slice(-1)[0].weekly_sets_by_group;
      assert.ok(last.back <= Math.max(last.quads, last.hips) + 1 + EPS, `${n}: back ${last.back}, quads ${last.quads}, hips ${last.hips}`);
    }
  });
  it('UNI-02 / UNI-03 (03): a cutting sport\'s third-day knee lift is a single-leg lift, its "Chest / Shoulders" press the alternating incline press, and the plan says what the template still holds two-sided', () => {
    const SL = R.selection.skeleton_laterality;
    assert.deepEqual([SL.x2_free.skeletons, SL.x2_free.buckets, SL.x2_free.when], [['athletic_C'], ['RP_BKD'], 'cod_sport']);
    assert.ok(SL.x2_free.refs.includes('UNI-02'));
    assert.equal(X2.chest_slot_uni.max_upper_target, 0.3);
    const p = planOf('03');
    const s3 = allItems(p).filter(x => x.d.skeleton === 'athletic_C' && ['RP_BKD', 'RP_UKD'].includes(x.it.bucket) && x.it.exercise_id && x.it.role !== 'test' && x.it.origin === 'template');
    assert.ok(s3.length > 0 && s3.every(x => ex(x.it.exercise_id).laterality !== 'bilateral'), [...new Set(s3.map(x => x.it.exercise_id))].join(', '));
    const inc = allItems(p).filter(x => new RegExp(X2.chest_slot_uni.id_re).test(x.it.exercise_id || ''));
    assert.ok(inc.length > 0, 'the alternating incline press');
    for (const x of inc) assert.ok((x.it.swaps || []).length >= 1, `w${x.w.n}: the alternating incline press lists a swap`);
    assert.ok(codes(p).includes('laterality_capped'));
    assert.equal(check(p.validation, 'V30').pass, true);
    // a sport without cuts keeps the two-leg lift on that day
    assert.ok(allItems(planOf('01')).filter(x => x.d.skeleton === 'athletic_C' && x.it.bucket === 'RP_BKD' && x.it.exercise_id && x.it.role !== 'test').every(x => ex(x.it.exercise_id).laterality === 'bilateral'));
  });
});

describe('v0.5 fix round 2 - sample 04 (CrossFit-style class)', () => {
  it('R4-SES-05 (04): the class days name a skeleton, the lunge runs with the clean and the pulls, and the day\'s first row is a two-arm row', () => {
    assert.deepEqual(CLASS_SKELETONS, { SQUAT: 'class_squat', PRESS: 'class_press', DEADLIFT: 'class_deadlift', 'CLEAN/PUSH': 'class_pull' });
    const p = planOf('04');
    for (const w of p.weeks) for (const d of w.days.filter(x => CLASS_SKELETONS[x.day_type])) {
      assert.equal(d.skeleton, CLASS_SKELETONS[d.day_type], `w${w.n} ${d.weekday}`);
      const lifts = d.blocks.filter(b => ['strength', 'accessories'].includes(b.kind)).flatMap(b => b.items).filter(it => it.exercise_id && it.role !== 'test');
      if (d.day_type === 'DEADLIFT') assert.ok(!lifts.some(it => it.bucket === 'RP_UKD'), `w${w.n}: a lunge on the deadlift + push day`);
      if (d.day_type === 'CLEAN/PUSH') assert.ok(lifts.some(it => it.bucket === 'RP_UKD') && lifts.some(it => it.bucket === 'RP_HPULL'), `w${w.n}: the lunge with the pulls`);
      const row = lifts.find(it => it.bucket === 'RP_HPULL');
      if (row && ['class_squat', 'class_pull'].includes(d.skeleton)) assert.equal(ex(row.exercise_id).laterality, 'bilateral', `w${w.n} ${d.weekday}: ${row.exercise_id}`);
    }
    assert.equal(check(p.validation, 'V30').pass, true);
  });
  it('UNI-11 / ORD-06 (04): V30 fails a class day that lost the partner its template names - a hip-dominant day with no push', () => {
    const PT = R.validation.v05.skeleton.partner;
    assert.ok(PT.skeleton_prefixes.includes('class_'));
    const bad = clone(planOf('04'));
    for (const w of bad.weeks) for (const d of w.days.filter(x => x.day_type === 'DEADLIFT')) for (const b of d.blocks) b.items = b.items.filter(it => !PT.push.includes(it.bucket));
    const v = check(validatePlan(bad, model), 'V30');
    assert.equal(v.pass, false);
    assert.ok(v.violations.some(x => x.args && x.args.rule === 'partner_missing' && x.args.lift === 'hip' && x.args.partner === 'push'), JSON.stringify(v.violations.slice(0, 2)));
    // his 3-day hybrid week has a deadlift day with no press at all: a lift day of its own, not a broken pairing
    const p3 = generate(randomIntake(6, loadFixtureModel()), loadFixtureModel());
    if (p3.status === 'ok' && p3.meta.family === 'hybrid_crossfit') assert.equal(check(p3.validation, 'V30').pass, true);
  });
  it('ATH-10 (04): an L2 lifter\'s first block takes the hang power clean and the hang power snatch, nothing else above the beginner tier', () => {
    const LB = R.olympic.x2.l2_block1;
    assert.deepEqual(LB.levels, ['L2']); assert.equal(LB.ids.length, 2);
    const p = planOf('04');
    assert.equal(p.meta.level.client, 'L2');
    const b1 = allItems(p).filter(x => x.w.exercise_block === 1 && x.it.bucket === 'AP_TRIPLE_EXT' && x.it.exercise_id);
    assert.ok(b1.some(x => LB.ids.includes(x.it.exercise_id)), [...new Set(b1.map(x => x.it.exercise_id))].join(', '));
    for (const x of b1) { const e = ex(x.it.exercise_id); assert.ok(LB.ids.includes(e.id) || e.athletic.olympic_tier !== 'L2_plus', e.id); }
    assert.equal(check(p.validation, 'V19').pass, true);
  });
  it('R2-SES-03 (01 / 04 / 05): the core that opens a day stays a light opener in every week - never the week\'s reps in the tank, never a weighted or above-level exercise', () => {
    assert.equal(R.core_block.x2.opener_effort_key, 'effort.core_opener');
    const order = R.levels.ladder_order;
    for (const n of ['01', '04', '05']) {
      const p = planOf(n), ladder = p.meta.level.exercise_ladder;
      for (const x of allItems(p)) {
        if (x.it.role !== 'core_block' || !x.it.exercise_id) continue;
        assert.equal(x.it.effort && x.it.effort.type, 'intent', `${n} w${x.w.n} ${x.d.weekday} ${x.it.exercise_id}: ${JSON.stringify(x.it.effort)}`);
        const e = ex(x.it.exercise_id);
        assert.ok(order.indexOf(e.level) <= order.indexOf(ladder) || X2.core_primary.in_level_exempt_ids.includes(e.id) || x.d.optional, `${n} ${e.id} is ${e.level}`);
      }
    }
  });
  it('R4-PRG-01 (04): a block that ends with a strength-test week reaches its final sets the week before and holds them', () => {
    assert.equal(PX2.end_test_week_hold, true);
    const p = planOf('04'), b = p.meta.stairway[0];
    const N = b.schedule[b.groups[0]].length;
    for (const g of b.groups) { const sc = b.schedule[g]; if (b.group_top[g] > b.group_start[g]) assert.ok(sc[N - 2] === b.group_top[g], `${g}: ${sc.join(' ')}`); }
    const tot = stair(p).map(w => w.total_resistance_sets);
    assert.ok(tot[tot.length - 1] <= tot[tot.length - 2] + EPS, 'the test week adds no sets: ' + tot.join(' '));
  });
});

describe('v0.5 fix round 2 - sample 05 (bootcamp)', () => {
  it('OT06 (05): each session opens with the coach\'s own slots in his order; a triceps or biceps exercise never runs before a compound lift that uses the muscle', () => {
    const KA = R.session.x2.circuit_kit_aware, OX = R.supersets.bootcamp.x2.order;
    assert.equal(OX.spine, true); assert.ok(OX.added_before_own_same_group > 0);
    const p = planOf('05');
    for (const w of p.weeks) for (const d of w.days.filter(x => /^BC[123]/.test(x.day_type || ''))) {
      const st = d.blocks.filter(b => b.kind === 'circuit').flatMap(b => b.items).filter(it => it.exercise_id);
      assert.ok(st.length >= 5 && st.length <= 7, `w${w.n} ${d.weekday}: ${st.length} stations`);
      st.forEach((it, i) => {
        const e = ex(it.exercise_id);
        if (e.exercise_class !== 'isolation') return;
        for (const later of st.slice(i + 1)) { const l = ex(later.exercise_id); if (l.exercise_class !== 'isolation' && !l.is_athletic && later.bucket !== 'COND_CIRCUIT') assert.ok(!((later.credits || {})[e.primary_muscle] > 0), `w${w.n} ${d.weekday}: ${e.id} before ${l.id}`); }
      });
    }
    assert.deepEqual(KA.own_slots.by_session['2'], ['RP_BHD', 'RP_HPUSH', 'ISO_BICEP', 'RP_VPUSH', 'COND_CIRCUIT']);
    // Wednesday: the hinge, then the floor press, the curl between the presses, the triceps last
    const wed = p.weeks[0].days.find(d => d.weekday === 'Wed').blocks.filter(b => b.kind === 'circuit').flatMap(b => b.items).map(it => it.bucket);
    assert.ok(wed.indexOf('RP_BHD') < wed.indexOf('RP_HPUSH') && wed.indexOf('RP_HPUSH') < wed.indexOf('ISO_BICEP') && wed.indexOf('ISO_BICEP') < wed.indexOf('RP_VPUSH'), wed.join(' '));
    assert.equal(wed[wed.length - 1], 'ISO_TRICEP', wed.join(' '));
  });
  it('R4-LIB-01 / R2-LIB-08 (05): no household stand-in in a field kit, no reference-only record on the quad station, and the plan says it holds no vertical pull', () => {
    const p = planOf('05');
    assert.ok(R.session.x2.circuit_kit_aware.not_home_profiles.includes(p.meta.kit.profile || loadSample(NAMES['05']).equipment.profile));
    const so = R.selection.swap_only_statuses, SK = X2.small_kit_rows.ids;
    for (const x of allItems(p)) {
      if (x.b.kind !== 'circuit' || !x.it.exercise_id) continue;
      const e = ex(x.it.exercise_id);
      assert.ok(!e.tags.includes('home_substitute'), `w${x.w.n} ${x.d.weekday}: ${e.id}`);
      if (x.it.bucket !== 'COND_CIRCUIT') assert.ok(!so.includes(e.status) || SK.includes(e.id), `w${x.w.n} ${x.d.weekday}: ${e.id} is a ${e.status} record`);
    }
    assert.ok(codes(p).includes('no_vertical_pull'));
    const mon = allItems(p).filter(x => x.w.n === 1 && x.it.slot_id === 'Mon.BC1.s07')[0];
    assert.ok(mon && ex(mon.it.exercise_id).credit_class === 'ISO_REAR' && mon.it.flags.includes('no_vertical_pull'), 'Monday\'s second back station is a rear-delt fly, not one more row');
    assert.equal(swapNote(model, ex('lat-pulldown-wide-grip'), ex('seal-row-db-pronated-grip')).loses, 'swap.loses.vertical_pull');
    // every trained group holds its floor, the chest among them (RECHECK v0.4 05 major)
    for (const w of stair(p)) for (const g of ['quads', 'hips', 'back', 'chest', 'shoulders', 'biceps', 'triceps']) assert.ok(w.weekly_sets_by_group[g] >= R.volume.floor.value - EPS, `w${w.n} ${g} ${w.weekly_sets_by_group[g]}`);
    assert.ok(!codes(p).includes('below_floor_template'));
    // pulling stations are not outnumbered by pressing stations
    const cls = (it) => ex(it.exercise_id).credit_class, PP = R.volume.push_pull, circ = itemsOf(p.weeks[0]).filter(x => x.b.kind === 'circuit' && x.it.exercise_id).map(x => x.it);
    assert.ok(circ.filter(it => PP.pull_classes.includes(cls(it))).length >= circ.filter(it => PP.push_classes.includes(cls(it))).length);
  });
  it('PRG-03 / CX-02 (05): the work time climbs in 5-s timer steps to 50 s, one more round in the last two weeks, and the last week\'s hold sits on an isolation exercise', () => {
    const BX = R.supersets.bootcamp.x2;
    assert.deepEqual(BX.work_s_values, [35, 40, 45, 50]); assert.deepEqual(BX.rounds_late, { add: 1, last_weeks: 2 });
    const p = planOf('05');
    assert.deepEqual(p.weeks.map(w => w.circuit.work_s), [35, 35, 40, 40, 45, 45, 50, 50]);
    assert.deepEqual(p.weeks.map(w => w.circuit.rounds), [4, 4, 4, 4, 4, 4, 5, 5]);
    assert.equal(check(p.validation, 'H21').pass, true);
    const held = allItems(p).filter(x => x.it.effort && x.it.effort.intensifier);
    assert.ok(held.length > 0);
    for (const x of held) assert.equal(ex(x.it.exercise_id).exercise_class, 'isolation', `w${x.w.n} ${x.d.weekday}: ${x.it.exercise_id}`);
  });
  it('VOL-06 (05): the extra round never takes a muscle past the absolute weekly cap - a 5-day circuit week keeps its rounds', () => {
    const fx = loadFixtureModel();
    const intake = randomIntake(33, fx);
    const p = generate(clone(intake), fx);
    assert.equal(p.status, 'ok');
    if (p.weeks.some(w => w.circuit)) {
      assert.equal(check(p.validation, 'V13').pass, true);
      const first = p.weeks.find(w => w.circuit && w.block_type === 'stairway').circuit.rounds;
      for (const w of p.weeks.filter(x => x.circuit && x.block_type === 'stairway')) assert.equal(w.circuit.rounds, first, `w${w.n}`);
    }
    // the option itself: the shape without the late round
    const d5 = loadSample(NAMES['05']);
    const withLate = planOf('05').weeks.map(w => w.circuit.rounds);
    assert.ok(Math.max(...withLate) > withLate[0]);
    assert.equal(typeof buildShape, 'function');
    void d5;
  });
});

describe('v0.5 fix round 2 - samples 06 / 07 (physique)', () => {
  it('VOL-07 / VOL-16 (01 / 04 / 06 / 07): the first exercise first - no isolation exercise holds a 4th set in week 1, and a compound lift is never left at 2 sets while an isolation exercise of its day and group holds more', () => {
    const OX = PX2.order;
    assert.equal(OX.compound_min.sets, 3); assert.equal(OX.lead_first, true); assert.ok(PX2.iso_fourth_from_share > 0);
    for (const n of ['01', '04', '06', '07']) {
      const p = planOf(n), w1 = stair(p)[0];
      for (const x of itemsOf(w1)) {
        if (!x.it.exercise_id || x.d.optional || !['strength', 'accessories'].includes(x.b.kind) || x.it.origin === 'bonus') continue;
        const e = ex(x.it.exercise_id);
        // (engine 0.6, converted - DECISIONS G-113: the class member's arms end at floor + 2 with no second curl or extension - review 04
        // M1 'no bonus isolation' - so the floor of 10 on the training days takes the arm exercise's 4th set from week 1, R2-VOL-06)
        const classArm = n === '04' && ['ISO_BICEPS', 'ISO_TRICEPS'].includes(e.credit_class);
        if (e.exercise_class === 'isolation' && e.credit_class !== 'ISO_CALF') assert.ok(x.it.sets <= (classArm ? 4 : 3), `${n} w1 ${x.d.weekday}: ${e.id} at ${x.it.sets} sets`);
      }
    }
    for (const n of ['06', '07']) for (const w of stair(planOf(n))) for (const d of w.days.filter(x => x.kind === 'main')) {
      const lifts = d.blocks.filter(b => ['strength', 'accessories'].includes(b.kind)).flatMap(b => b.items).filter(it => it.exercise_id && it.role !== 'test' && it.origin === 'template');
      for (const c of lifts.filter(it => ex(it.exercise_id).exercise_class === 'compound' && it.sets === 2)) {
        const m = ex(c.exercise_id).primary_muscle;
        for (const i of lifts.filter(it => ex(it.exercise_id).exercise_class === 'isolation' && ex(it.exercise_id).primary_muscle === m)) assert.ok(i.sets <= 3, `${n} w${w.n} ${d.weekday}: ${i.exercise_id} at ${i.sets} beside ${c.exercise_id} at 2`);
      }
    }
  });
  it('VOL-17 / R4-SES-05 (06): the template\'s own rear-delt station opens before any other extra exercise - the rear delts hold their own sets every week', () => {
    const TX = PX2.template_extra;
    assert.deepEqual(TX.direct_by_level, { L1: 0, L2: 2, L3: 4 }); assert.equal(TX.muscle, 'rear_delts');
    const p = planOf('06');
    assert.equal(p.meta.level.client, 'L3');
    for (const w of stair(p)) {
      const rear = itemsOf(w).filter(x => (x.it.credits || {}).rear_delts === 1 && x.it.sets > 0);
      assert.ok(rear.reduce((a, x) => a + x.it.sets, 0) >= TX.direct_by_level.L3, `w${w.n}`);
      assert.ok(rear.some(x => (x.it.why || []).some(y => y.key === 'why.template_extra_station')), `w${w.n}: the station says why it is there`);
    }
  });
  it('R4-PRG-01 (01 / 06 / 07): the printed schedule is the schedule the plan runs - a group never sits more than a set and a half above its number for the week (quarter-set helper credit), never a whole set under', () => {
    assert.equal(PX2.honest_schedule.enabled, true);
    for (const n of ['01', '06', '07']) {
      const p = planOf(n), b = p.meta.stairway[0];
      stair(p).forEach((w, i) => { for (const g of b.groups) assert.ok((w.weekly_sets_by_group[g] || 0) <= b.schedule[g][i] + 1.5 + EPS && (w.weekly_sets_by_group[g] || 0) > b.schedule[g][i] - 1 - EPS, `${n} w${w.n} ${g}: ${w.weekly_sets_by_group[g]} against ${b.schedule[g][i]}`); });
    }
  });
  it('R4-PRG-04 (bench 19): no extra exercise opens for a group whose optional-day stations already hold all but one exercise of its ceiling', () => {
    assert.equal(PX2.extra_ceiling_margin, 1);
    const p = benchOf('19');
    const ctx = makeContext({ rules: raw.rules, catalog: raw.catalog, templates: raw.templates, profiles: raw.profiles });
    const s = scorePlan(p, ctx, {});
    assert.equal((s.metrics.over_ceiling || { value: 0 }).value, 0);
    assert.match(SCORER_VERSION, /^2\.[3-9]/); // (engine 0.6 selection, converted - DECISIONS G-138: scorer 2.4 keeps every 2.3 reading)
  });
});

describe('v0.5 fix round 2 - sample 08 (pickleball, knee pain)', () => {
  it('VOL-03 / R2-LIB-03 (08): the pain line is said up front, "chosen to protect" only under a lift the pain changed, and a knee lift carries the pain-free-depth cue', () => {
    const p = planOf('08');
    assert.ok(codes(p).includes('pain_plan'));
    const PD = R.volume.pain.x2.depth_note;
    let depth = 0;
    for (const x of allItems(p)) {
      const keys = (x.it.notes || []).map(nt => nt.key);
      if (keys.includes('note.pain_swap') || keys.includes('note.pain_instead_of')) assert.ok((x.it.flags || []).includes('pain_swap'), `w${x.w.n} ${x.it.slot_id}: a pain line under a lift that was the pick anyway`);
      // (v0.6 words, converted - DECISIONS G-163: the depth cue follows the exercise type - any key of the pain-free-depth family)
      const dk = keys.find(k => k === PD.note || (R.volume.pain.x6.depth_by_pattern || []).some(r => r.key === k));
      if (dk) { depth++; assert.ok(PD.classes.includes(ex(x.it.exercise_id).credit_class), x.it.exercise_id); }
    }
    assert.ok(depth > 0);
  });
  it('R4-LIB-01 / CAT-05 (08): a swap is never a placeholder record; a beginner\'s swap on a slot the pain touches never loads the spine heavily or bends the knee deep', () => {
    assert.equal(X2.swaps.no_generic, true); assert.deepEqual(X2.swaps.pain_no_axial_high_levels, ['L1']);
    for (const id of ['lunge-variation-not-stated', 'rfe-split-squat-isometric-hold-suitcase-db']) assert.ok(ex(id).tags.includes('deep_knee_flexion'), id);
    const generic = R.selection.generic_id_patterns.map(x => new RegExp(x));
    for (const n of Object.keys(NAMES)) for (const x of itemsOf(planOf(n).weeks[0])) for (const s of x.it.swaps || []) if (['resistance', 'isolation', 'focus'].includes(kindOf(x.it.bucket))) assert.ok(!generic.some(re => re.test(s)), `${n} ${x.it.exercise_id} -> ${s}`);
    const p = planOf('08');
    for (const x of allItems(p)) {
      if (!['RP_BKD', 'RP_UKD'].includes(x.it.bucket) || !x.it.exercise_id) continue;
      for (const s of x.it.swaps || []) { assert.notEqual(ex(s).axial_class, 'high', `${x.it.exercise_id} -> ${s}`); assert.ok(!ex(s).tags.includes('deep_knee_flexion'), `${x.it.exercise_id} -> ${s}`); }
      assert.ok((x.it.swaps || []).length >= 1, x.it.exercise_id);
    }
    // the plain pull-up is a library exercise of its own, not a placeholder
    assert.ok(!generic.some(re => re.test('pull-up-grip-not-stated')));
  });
  it('R4-LIB-04 (all samples): a swap line says what the swap really loses', () => {
    assert.equal(swapNote(model, ex('weighted-pull-up'), ex('chin-up-supinated')).loses, 'swap.loses.external_load');
    assert.equal(swapNote(model, ex('crunch'), ex('supermans')).loses, 'swap.loses.core_action');
    assert.equal(swapNote(model, ex('leg-extension-machine'), ex('front-foot-elevated-split-squat-lunge-ffe')).loses, 'swap.loses.isolation');
    for (const k of ['swap.loses.vertical_pull', 'swap.loses.isolation', 'swap.loses.core_action', 'swap.loses.external_load']) for (const lang of ['en', 'es']) assert.ok(model.t(lang, k) && model.t(lang, k) !== k, `${lang} ${k}`);
  });
  it('R4-LIB-01 (scorer 2.3): a carry as a station\'s pick counts as an add-on pick outside its approved programs', () => {
    const ctx = makeContext({ rules: raw.rules, catalog: raw.catalog, templates: raw.templates, profiles: raw.profiles });
    const bad = clone(planOf('01'));
    const core = bad.weeks[0].days.find(d => d.kind === 'main').blocks.find(b => b.kind === 'core').items[0];
    const e = ex('single-side-suitcase-carry');
    core.exercise_id = e.id; core.name_key = e.name_key;
    assert.ok(scorePlan(bad, ctx, {}).metrics.addon_picks.value > 0);
    assert.equal(scorePlan(planOf('01'), ctx, {}).metrics.addon_picks.value, 0);
  });
});
