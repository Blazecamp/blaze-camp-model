// design/milp_proto/samples.mjs - the three hard samples of design/design_milp.md section 14 as planner instances.
// Candidate exercises come from model/templates.json (the UNCUT day types: every station is a candidate at any session
// length); time and credit numbers from model/rules.json; the fixed blocks (warm-up, core, athletic, power, joint care,
// skill, WOD) are listed per day with their own minutes so the trade-offs are visible. Laterality of each pick (which
// changes minutes per set) is read from the current sample plans (samples/plans/*.json, 2026-10-10 regeneration).
import fs from 'node:fs';
import { tu } from './planner.mjs';
const R = JSON.parse(fs.readFileSync(new URL('../../model/rules.json', import.meta.url), 'utf8'));
const TM = R.time_model;
const CLASS = { RP_BKD: 'BKD', RP_UKD: 'UKD', RP_BHD: 'BHD', RP_UHD: 'UHD', RP_HPUSH: 'HPUSH', RP_VPUSH: 'VPUSH', RP_HPULL: 'HPULL', RP_VPULL: 'VPULL',
  ISO_QUAD: 'LEG_EXTENSION', ISO_LEG_FLEXION: 'LEG_FLEXION', ISO_CHEST: 'ISO_CHEST', ISO_SIDE: 'ISO_SIDE', ISO_REAR: 'ISO_REAR', ISO_BICEP: 'ISO_BICEPS', ISO_TRICEP: 'ISO_TRICEPS', ISO_CALF: 'ISO_CALF' };
const TC = { RP_BKD: 'compound_bilateral', RP_UKD: 'compound_unilateral', RP_BHD: 'compound_bilateral', RP_UHD: 'compound_unilateral', RP_HPUSH: 'compound_bilateral', RP_VPUSH: 'compound_bilateral',
  RP_HPULL: 'compound_bilateral', RP_VPULL: 'compound_bilateral', ISO_QUAD: 'isolation', ISO_LEG_FLEXION: 'isolation', ISO_CHEST: 'isolation', ISO_SIDE: 'isolation', ISO_REAR: 'isolation', ISO_BICEP: 'isolation', ISO_TRICEP: 'isolation', ISO_CALF: 'isolation' };
const groupOfMuscle = Object.fromEntries(Object.entries(R.muscles.groups.members).flatMap(([g, ms]) => ms.map((mm) => [mm, g])));
const credits = (bucket) => { const out = {}; for (const [mus, c] of Object.entries(R.credit.classes[CLASS[bucket]] || {})) { const g = groupOfMuscle[mus]; if (g && g !== 'core') out[g] = Math.min(4, (out[g] || 0) + Math.round(4 * c)); } return out; };
const restOf = (tc) => TM.rest_class_minutes[TM.rest_class_by_time_class[tc]];
/** per-set minutes of a fixed-block class (work + dosed rest) */
export const perSet = (cls) => TM.work_minutes[cls] + restOf(cls);

/**
 * slot('Mon.s08', 'quads', 'RP_BKD', { name, tc, heavy:'always'|'peak', min, max, optional, pattern, classLift }, level)
 * heavy = strength rest (4.5 min): class lifts always, an athlete's axial work lift in the VOL 3 exercise block ('peak').
 */
function slot(id, g, bucket, o = {}, maxSets = 5) {
  const tc = o.tc || TC[bucket], iso = tc.startsWith('isolation');
  const w = TM.work_minutes[tc], r = restOf(tc), rs = TM.rest_class_minutes.strength;
  const r1 = o.heavy === 'always' ? rs : r, rN = o.heavy ? rs : r;
  return { id, g, bucket, name: o.name || bucket, tc, heavy: o.heavy || null, c1: tu(w + r1), cN: tu(w + rN), r1: tu(r1), rN: tu(rN), w: tu(w),
    min: o.min ?? (bucket === 'ISO_CALF' ? 3 : 2), max: o.max ?? (bucket === 'ISO_CALF' ? 4 : iso ? Math.min(4, maxSets) : maxSets),
    cr: credits(bucket), optional: !!o.optional, pattern: !!o.pattern, classLift: !!o.classLift, role: o.role || null, must: !!o.must };
}
const fixedSum = (items) => tu(items.reduce((a, it) => a + it.min, 0));
const st = (name, cls, sets, co = 1) => ({ name, min: sets * perSet(cls) + co, sets, cls });   // a fixed station: sets x (work + rest) + changeover
const WARM = { name: 'warm-up', min: TM.minutes_per_set.warmup_session };
const CORE = { name: 'core opener 2 x 2 (as a pair)', min: 2 * (2 * TM.work_minutes.core_set + TM.rest_class_minutes.core) + 2 * TM.changeover_in_superset_pair };   // 5.5
const G12 = R.stairway.by_N['12'].growth, G8 = R.stairway.by_N['8'].growth;

// ------------------------------------------------------------------------------------------------ 08 pickleball 2 x 45
export function pickleball(o = {}) {
  const L = 4;   // L1: 4 sets per exercise at most
  const mon = [WARM, CORE, st('medball rotational throw', 'throw', 2), st('Olympic lift (DB / KB, clean family)', 'olympic', 2), st('joint care: rotator cuff', 'prehab', 2), st('joint care: tibialis / soleus', 'prehab', 2)];
  const thu = [WARM, CORE, st('low box jump (landing)', 'plyo_or_ballistic', 2), st('ankle hops (low contacts)', 'ankle', 2), st('Olympic lift (DB / KB, snatch family)', 'olympic', 2), st('joint care: wrist / elbow', 'prehab', 2), st('joint care: tibialis / soleus', 'prehab', 2)];
  const I = {
    name: '08 pickleball, 52 y, L1, stay-active, knee pain, 2 x 45 min, 12 weeks', N: 12, mu: o.mu ?? 45, phi: o.phi ?? R.session.time_fit.fit_factor, growth: G12, athlete: false, maxPattern: R.volume.pattern_keep.max_per_week,
    groups: [
      { id: 'calves', S: 6, C: 8, F: o.calvesFloor ?? 7, mc: 1, single: true, pinned: 'allLegDays', note: 'pinned first (racket 50+, R3-ATH-02); floor max(3n, min(10, 4n - 1)) = 7 with 2 leg days (DER-04)' },
      { id: 'hips', S: 10, C: 13, F: 10, mc: 2 },
      { id: 'quads', S: 6, C: 8, F: 6, mc: 1, note: 'knee pain: start 10 x 0.6 = 6, not floored at 10 (DER-06)' },
      { id: 'back', S: 10, C: 13, F: 10, mc: 2 }, { id: 'chest', S: 10, C: 13, F: 10, mc: 2 }, { id: 'shoulders', S: 10, C: 13, F: 10, mc: 2 },
      { id: 'triceps', S: 10, C: 13, F: 10, mc: 2 }, { id: 'biceps', S: 10, C: 13, F: 10, mc: 2 },
    ],
    days: [
      { id: 'Mon', label: 'A knee + pull', items: mon, counted: 0, slots: [
        slot('Mon.s08', 'quads', 'RP_BKD', { name: 'step-up (knee-friendly, unilateral)', tc: 'compound_unilateral', pattern: true, role: 'work', must: true }, L),
        slot('Mon.s12', 'quads', 'ISO_QUAD', { name: 'leg extension' }, L),
        slot('Mon.s09', 'back', 'RP_HPULL', { name: 'row', pattern: true, role: 'paired_upper' }, L), slot('Mon.s13', 'back', 'RP_VPULL', { name: 'pulldown' }, L),
        slot('Mon.s10', 'hips', 'RP_UHD', { name: 'single-leg / staggered RDL', pattern: true }, L), slot('Mon.s14', 'hips', 'ISO_LEG_FLEXION', { name: 'leg curl' }, L),
        slot('Mon.s11', 'shoulders', 'RP_VPUSH', { name: 'shoulder press', pattern: true, role: 'paired_upper' }, L), slot('Mon.s15', 'shoulders', 'ISO_REAR', { name: 'rear-delt raise' }, L),
        slot('Mon.s16', 'calves', 'ISO_CALF', { name: 'calf raise' }, L)] },
      { id: 'Thu', label: 'B hinge + push', items: thu, counted: 0, slots: [
        slot('Thu.s08', 'hips', 'RP_BHD', { name: 'DB Romanian deadlift (bilateral)', tc: o.thuHinge === 'unilateral' ? 'compound_unilateral' : 'compound_bilateral', role: 'work', must: true }, L), slot('Thu.s12', 'hips', 'ISO_LEG_FLEXION', { name: 'leg curl' }, L),
        slot('Thu.s09', 'chest', 'RP_HPUSH', { name: 'chest press', pattern: true, role: 'paired_upper' }, L), slot('Thu.s13', 'chest', 'ISO_CHEST', { name: 'fly' }, L),
        slot('Thu.s10', 'quads', 'RP_UKD', { name: 'split squat / step-down', pattern: true }, L), slot('Thu.s14', 'quads', 'ISO_QUAD', { name: 'leg extension' }, L),
        slot('Thu.s11', 'back', 'RP_HPULL', { name: 'row', pattern: true, role: 'paired_upper' }, L), slot('Thu.s15', 'back', 'RP_VPULL', { name: 'pulldown' }, L),
        slot('Thu.s16', 'calves', 'ISO_CALF', { name: 'calf raise' }, L)] },
    ],
    pairs: [{ a: 'Mon.s08', b: 'Mon.s09' }, { a: 'Mon.s10', b: 'Mon.s11' }, { a: 'Mon.s12', b: 'Mon.s13' },
      { a: 'Thu.s08', b: 'Thu.s09' }, { a: 'Thu.s10', b: 'Thu.s11' }, { a: 'Thu.s12', b: 'Thu.s13' }, { a: 'Thu.s14', b: 'Thu.s15' }],
    // room cuts in the stay-active order (rules.cut_order.athletic_stay_active; T1-POL-06 / T1-POL-13): taken only if they raise the keep vector
    cuts: [
      { id: 'power_off', label: 'Olympic lift off (switchable back on)', save: { Mon: [tu(7), tu(7)], Thu: [tu(7), tu(7)] } },
      { id: 'joint_care_to_optional', label: 'joint care moves to the optional day', save: { Mon: [tu(7.4), tu(7.4)], Thu: [tu(7.4), tu(7.4)] } },
      { id: 'ankle_block_off', label: 'ankle hops off', save: { Thu: [tu(2.8), tu(2.8)] } },
    ],
    // the calf raise is supersetted with the rotator-cuff item while that item is on the day: 2 shared rounds x 0.75 + 1 min changeovers
    bonus: [{ slot: 'Mon.s16', units: tu(2.5), unlessCut: 'joint_care_to_optional' }, { slot: 'Thu.s16', units: tu(2.5), unlessCut: 'joint_care_to_optional' }],
  };
  for (const d of I.days) { d.fix1 = d.fixN = fixedSum(d.items); }
  if (o.maxCuts != null) I.cuts = I.cuts.slice(0, o.maxCuts);
  const two = Array(12).fill(2), PS = R.athletic.reconcile;
  // weekly targets as the current engine prints them for this client (04 profile ranges x heavy-play factor); per-set bounds from rules.athletic.reconcile
  I.athletic = [
    { key: 'throws', target: [51, 69], stations: [{ name: 'Mon medball throw', sets: two, min: PS.per_set_min.throws, max: PS.per_set_max.throws }] },
    { key: 'low_contacts', target: [35, 73], stations: [{ name: 'Thu ankle hops', sets: two, min: PS.per_set_min.low_contacts, max: PS.per_set_max.low_contacts }] },
    { key: 'jump_contacts', target: [7, 7], stations: [{ name: 'Thu low box jump', sets: two, min: PS.per_set_min.jump_contacts, max: PS.per_set_max.jump_contacts }] },
  ];
  return I;
}

// ------------------------------------------------------------------------------------------------ 04 CrossFit class 4 x 60
export function crossfit(o = {}) {
  const L = 5;
  const WOD = { name: 'WOD (10 min) + transition', min: 11 }, SKILL = { name: 'skill (in the warm-up)', min: TM.skill_in_warmup_min };
  const oly = (n) => st(`Olympic lift (${n})`, 'olympic', 3);
  const I = {
    name: '04 CrossFit-style class, 35 y, L2, stay-active, 4 x 60 min, 8 weeks', N: 8, mu: o.mu ?? 60, phi: o.phi ?? R.session.time_fit.fit_factor, growth: G8, athlete: false, maxPattern: R.volume.pattern_keep.max_per_week,
    groups: [
      { id: 'hips', S: 12, C: 18, F: 10, mc: 2 }, { id: 'quads', S: 12, C: 18, F: 10, mc: 2 }, { id: 'back', S: 12, C: 18, F: 10, mc: 2 }, { id: 'chest', S: 12, C: 18, F: 10, mc: 2 },
      { id: 'shoulders', S: 10, C: 18, F: 10, mc: 2 }, { id: 'calves', S: 6, C: 8, F: 7, mc: 1, single: true, pinned: 'allLegDays' },
      { id: 'triceps', S: 10, C: 18, F: 10, mc: 2 }, { id: 'biceps', S: 10, C: 18, F: 10, mc: 2 },
    ],
    days: [
      { id: 'Mon', label: 'Squat day', items: [WARM, SKILL, CORE, WOD], counted: 0, slots: [
        slot('Mon.s06', 'quads', 'RP_BKD', { name: 'front squat (class lift)', heavy: 'always', classLift: true, min: 3, role: 'work' }, L), slot('Mon.s08', 'quads', 'RP_UKD', { name: 'reverse lunge' }, L),
        slot('Mon.s07', 'back', 'RP_HPULL', { name: 'row', pattern: true, role: 'paired_upper' }, L), slot('Mon.s09', 'back', 'RP_VPULL', { name: 'pull-up' }, L),
        slot('Mon.s11', 'shoulders', 'ISO_REAR', { name: 'rear-delt raise' }, L), slot('Mon.s12', 'shoulders', 'ISO_SIDE', { name: 'side raise' }, L),
        slot('Mon.s10', 'calves', 'ISO_CALF', { name: 'calf raise' }, L)] },
      { id: 'Tue', label: 'Press + snatch day', items: [WARM, CORE, oly('snatch family'), WOD], counted: 0, slots: [
        slot('Tue.s07', 'shoulders', 'RP_VPUSH', { name: 'overhead press (class lift)', heavy: 'always', classLift: true, min: 3, role: 'work' }, L), slot('Tue.s10', 'shoulders', 'ISO_SIDE', { name: 'side raise' }, L),
        slot('Tue.s08', 'chest', 'RP_HPUSH', { name: 'bench press', pattern: true }, L), slot('Tue.s09', 'chest', 'ISO_CHEST', { name: 'fly' }, L)] },
      { id: 'Thu', label: 'Deadlift + push day', items: [WARM, SKILL, CORE, WOD], counted: 0, slots: [
        slot('Thu.s07', 'hips', 'RP_BHD', { name: 'deadlift (class lift)', heavy: 'always', classLift: true, min: 3, role: 'work' }, L), slot('Thu.s08', 'hips', 'RP_UHD', { name: 'single-leg RDL' }, L), slot('Thu.s09', 'hips', 'ISO_LEG_FLEXION', { name: 'leg curl', optional: true }, L),
        slot('Thu.s14', 'chest', 'RP_HPUSH', { name: 'bench press', pattern: true, role: 'paired_upper' }, L), slot('Thu.s15', 'chest', 'ISO_CHEST', { name: 'fly' }, L),
        slot('Thu.s10', 'calves', 'ISO_CALF', { name: 'calf raise' }, L)] },
      { id: 'Fri', label: 'Clean + pull day', items: [WARM, CORE, oly('clean family'), WOD], counted: 0, slots: [
        slot('Fri.s07', 'back', 'RP_HPULL', { name: 'row (work)', min: 3, pattern: true, role: 'work', must: true }, L), slot('Fri.s08', 'back', 'RP_VPULL', { name: 'chin-up' }, L),
        slot('Fri.s09', 'biceps', 'ISO_BICEP', { name: 'curl' }, L), slot('Fri.s12', 'biceps', 'ISO_BICEP', { name: 'curl 2' }, L)] },
    ],
    pairs: [{ a: 'Mon.s06', b: 'Mon.s07' }, { a: 'Mon.s08', b: 'Mon.s09' }, { a: 'Mon.s11', b: 'Mon.s12' }, { a: 'Thu.s07', b: 'Thu.s14' }, { a: 'Thu.s08', b: 'Thu.s15' }],
    cuts: [], bonus: [],
    tests: { Mon: 10, Tue: 10, Thu: 10 },   // strength test work-up minutes in weeks 1 and 8 (T0-TST-01: the test is the top set; the work-up is reported, see section 14)
  };
  for (const d of I.days) { d.fix1 = d.fixN = fixedSum(d.items); }
  return I;
}

// ------------------------------------------------------------------------------------------------ 01 swimming 3 x 60
export function swimmer(o = {}) {
  const L = 5;
  const care = { name: 'shoulder care (inside a rest, every session)', min: 2 * TM.work_minutes.prehab_in_rest + 0.5 };
  const mon = (oly) => [WARM, CORE, st('box jump', 'plyo_or_ballistic', 2), st('Olympic lift (clean family)', 'olympic', oly), care];
  const wed = (ank, oly) => [WARM, CORE, st('medball throw', 'throw', 2), st('upper-body plyo', 'plyo_or_ballistic', 2), st('ankle hops', 'ankle', ank), st('Olympic lift (snatch family)', 'olympic', oly), care];
  const fri = () => [WARM, CORE, { name: 'jump + medball throw (as a pair)', min: 2 * perSet('plyo_or_ballistic') + 2 * perSet('throw') + 2 - (2 * TM.rest_class_minutes.throw + 1) }, st('Olympic lift (clean pull)', 'olympic', 2), care];
  const byBlock = (a, b, c) => [a, a, a, a, b, b, b, b, c, c, c, c].map(fixedSum);
  const I = {
    name: '01 swimming, 16 y, L2, competitive off-season, 3 x 60 min, 12 weeks', N: 12, mu: o.mu ?? 60, phi: o.phi ?? R.session.time_fit.fit_factor, growth: G12, athlete: true, athleteCap: R.session.athlete_cap, heavyFrom: 9,
    maxPattern: R.volume.pattern_keep.max_per_week,
    groups: [
      { id: 'back', S: 15, C: 21, F: 10, mc: 2, note: 'profile priority (back >= 1.5 x chest on start and ceiling)' },
      { id: 'hips', S: 11, C: 16, F: 10, mc: 2 }, { id: 'quads', S: 11, C: 16, F: 10, mc: 2 }, { id: 'chest', S: 10, C: 14, F: 10, mc: 2 },
      { id: 'shoulders', S: 10, C: 16, F: 10, mc: 2 }, { id: 'calves', S: 9, C: 12, F: 10, mc: 1, single: true, pinned: 'allLegDays' },
    ],
    days: [
      { id: 'Mon', label: 'S1 jump + knee + pull', fixW: byBlock(mon(2), mon(3), mon(3)), counted: 2, slots: [
        slot('Mon.s09', 'quads', 'RP_BKD', { name: 'squat (axial work lift, tested)', heavy: 'peak', min: 3, role: 'work', must: true }, L), slot('Mon.s13', 'quads', 'ISO_QUAD', { name: 'leg extension' }, L),
        slot('Mon.s10', 'back', 'RP_HPULL', { name: 'row', pattern: true, role: 'paired_upper' }, L), slot('Mon.s14', 'back', 'RP_VPULL', { name: 'pulldown' }, L),
        slot('Mon.s11', 'hips', 'RP_UHD', { name: 'single-leg RDL', pattern: true }, L), slot('Mon.s15', 'hips', 'ISO_LEG_FLEXION', { name: 'leg curl' }, L),
        slot('Mon.s12', 'shoulders', 'RP_VPUSH', { name: 'shoulder press', pattern: true, role: 'paired_upper' }, L), slot('Mon.s16', 'shoulders', 'ISO_REAR', { name: 'rear-delt raise' }, L),
        slot('Mon.s17', 'calves', 'ISO_CALF', { name: 'calf raise' }, L)] },
      { id: 'Wed', label: 'S2 medball + hip + push', fixW: byBlock(wed(1, 2), wed(2, 2), wed(2, 3)), counted: 3, slots: [
        slot('Wed.s09', 'hips', 'RP_BHD', { name: 'back extension / hip hinge (non-axial work)', min: 3, role: 'work' }, L), slot('Wed.s13', 'hips', 'RP_UHD', { name: 'staggered DB deadlift' }, L),
        slot('Wed.s10', 'chest', 'RP_HPUSH', { name: 'bench press', pattern: true, role: 'paired_upper' }, L), slot('Wed.s14', 'chest', 'ISO_CHEST', { name: 'fly' }, L),
        slot('Wed.s11', 'quads', 'RP_UKD', { name: 'split squat', pattern: true }, L), slot('Wed.s15', 'quads', 'ISO_QUAD', { name: 'leg extension' }, L),
        slot('Wed.s12', 'back', 'RP_HPULL', { name: 'row', pattern: true, role: 'paired_upper' }, L), slot('Wed.s16', 'back', 'RP_VPULL', { name: 'pulldown' }, L),
        slot('Wed.s17', 'calves', 'ISO_CALF', { name: 'calf raise' }, L)] },
      { id: 'Fri', label: 'S3 Olympic + strength', fixW: byBlock(fri(), fri(), fri()), counted: 3, slots: [
        slot('Fri.s06', 'hips', 'RP_BHD', { name: 'trap-bar deadlift (axial work lift, tested)', heavy: 'peak', min: 3, role: 'work', must: true }, L), slot('Fri.s10', 'hips', 'ISO_LEG_FLEXION', { name: 'leg curl' }, L),
        slot('Fri.s07', 'chest', 'RP_HPUSH', { name: 'DB press', pattern: true, role: 'paired_upper' }, L), slot('Fri.s11', 'chest', 'ISO_CHEST', { name: 'fly' }, L),
        slot('Fri.s08', 'quads', 'RP_UKD', { name: 'step-up', pattern: true }, L), slot('Fri.s12', 'quads', 'ISO_QUAD', { name: 'leg extension' }, L),
        slot('Fri.s09', 'back', 'RP_HPULL', { name: 'row', pattern: true, role: 'paired_upper' }, L), slot('Fri.s13', 'back', 'RP_VPULL', { name: 'pulldown' }, L),
        slot('Fri.s14', 'calves', 'ISO_CALF', { name: 'calf raise' }, L)] },
    ],
    pairs: [{ a: 'Mon.s09', b: 'Mon.s10' }, { a: 'Mon.s11', b: 'Mon.s12' }, { a: 'Mon.s13', b: 'Mon.s14' },
      { a: 'Wed.s09', b: 'Wed.s10' }, { a: 'Wed.s11', b: 'Wed.s12' }, { a: 'Wed.s13', b: 'Wed.s14' }, { a: 'Wed.s15', b: 'Wed.s16' },
      { a: 'Fri.s06', b: 'Fri.s07' }, { a: 'Fri.s08', b: 'Fri.s09' }, { a: 'Fri.s10', b: 'Fri.s11' }, { a: 'Fri.s12', b: 'Fri.s13' }],
    cuts: [], bonus: [],   // competitive athlete: the sport's tracks are protected (T1-POL-13), shoulder care is never cut (T0-ATH-05)
    tests: { Mon: 16, Fri: 10 },   // week 1 and week 12: squat work-up 10 + jump test 6 on Monday, deadlift work-up 10 on Friday
  };
  for (const d of I.days) { d.fix1 = d.fixW[0]; d.fixN = Math.max(...d.fixW); d.items = null; d.itemsByBlock = true; }
  I.fixedNote = { Mon: [mon(2), mon(3), mon(3)], Wed: [wed(1, 2), wed(2, 2), wed(2, 3)], Fri: [fri(), fri(), fri()] };
  const two = Array(12).fill(2), PS = R.athletic.reconcile, blk = (a, b, c) => [a, a, a, a, b, b, b, b, c, c, c, c];
  I.athletic = [
    { key: 'jump_contacts', target: [37, 49], stations: [{ name: 'Mon box jump', sets: two, min: PS.per_set_min.jump_contacts, max: PS.per_set_max.jump_contacts }, { name: 'Fri jump', sets: two, min: PS.per_set_min.jump_contacts, max: PS.per_set_max.jump_contacts }] },
    { key: 'throws', target: [35, 45], stations: [{ name: 'Wed medball throw', sets: two, min: PS.per_set_min.throws, max: PS.per_set_max.throws }, { name: 'Fri medball throw', sets: two, min: PS.per_set_min.throws, max: PS.per_set_max.throws }] },
    { key: 'low_contacts', target: [8, 27], stations: [{ name: 'Wed ankle hops', sets: blk(1, 2, 2), min: PS.per_set_min.low_contacts, max: PS.per_set_max.low_contacts }] },
    { key: 'olympic_sets', target: [6, 8], stations: [{ name: 'Mon / Wed / Fri Olympic lifts', sets: blk(6, 7, 8), min: 1, max: 1 }] },
  ];
  if (o.vol3Rest === 'off') for (const d of I.days) for (const s of d.slots) if (s.heavy === 'peak') { s.cN = s.c1; s.rN = s.r1; s.heavy = null; }
  return I;
}
