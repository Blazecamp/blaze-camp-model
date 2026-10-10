// The three hardest sample intakes as planner inputs (design study for design/design_template-parametric.md).
// Targets (floor F, level start S, level ceiling C; credited sets) are the engine's own derivation, read from
// samples/plans/*.json > meta.targets.level_start / level_cap on 2026-10-10 (the derive stage is kept as it is).
// Fixed blocks and room items are the template stations at the chosen minutes plus the profile rules named in each comment.
import { rules } from './tpp.mjs';

const core = { label: 'core opener (2 exercises x 2 sets, back to back)', pair: [{ sets: 2, tc: 'core_set' }, { sets: 2, tc: 'core_set' }] };
const warm = { label: 'warm-up', minutes: rules.time_model.minutes_per_set.warmup_session };
const care = (label) => ({ label, sets: 2, tc: 'prehab_in_rest', inRest: true });
const G = (n) => rules.stairway.by_N[String(n)].growth;
const PATTERN = { enabled: true, buckets: rules.volume.pattern_keep.buckets, sets: rules.volume.pattern_keep.sets, max: rules.volume.pattern_keep.max_per_week };

/** 08: pickleball player, 52, L1, stay-active (athletic.2), 2 x 45, mild knee pain, plays 3 x a week, 12 weeks, no tests */
export const pickleball = (minutes = 45, over = {}) => ({
  name: `08 pickleball 2 x ${minutes}`, family: 'athletic', days: 2, variant: null, minutes, phi: rules.session.time_fit.fit_factor, level: 'L1', N: 12,
  blocks: rules.stairway.exercise_blocks_by_N['12'], G: G(12),
  groups: {
    calves: { F: 7, S: 7, C: 8, mc: 1 },      // DER-04: 2 leg days -> floor 7; one exercise x 3-4 sets a leg day holds 8 (R3-SES-01)
    hips: { F: 10, S: 10, C: 13, mc: 2 },     // stay_active 0.8 x 10 = 8 -> floor 10; ceiling 10 + round(4 x 0.8)
    quads: { F: 6, S: 6, C: 7, mc: 1 },       // knee pain: 0.6 x 10, not floored (pain wins), gentle climb start + 1 (DER-06; 12 section 3.6)
    back: { F: 10, S: 10, C: 13, mc: 2 }, chest: { F: 10, S: 10, C: 13, mc: 2 }, shoulders: { F: 10, S: 10, C: 13, mc: 2 },
    biceps: { F: 10, S: 10, C: 13, mc: 2 }, triceps: { F: 10, S: 10, C: 13, mc: 2 },   // no station in athletic.2: credit only
  },
  // keep order: racket 50+ pin (calves) first, then the athletic keep order (rules.session.time_fit.keep_order_r2)
  keep: ['calves', 'hips', 'quads', 'back', 'chest', 'shoulders', 'triceps', 'biceps'],
  pattern: PATTERN,
  fixed: {
    // T0: warm-up, core opener, ONE low-impact athletic station a day (3+ play days: half the jumps, no extra agility, R3-ATH-05;
    // Monday a light rotational throw, Thursday a landing drill, 12 section 5.5), calf / Achilles care every leg day and
    // rotator-cuff / elbow care weekly on a main day for racket players 50+ (T0-SAFE-06), done inside the rests (E-175)
    Mon: [warm, core, { label: 'rotational medball throw', sets: 2, tc: 'throw' }, care('calf / Achilles care'), care('rotator-cuff care')],
    Thu: [warm, core, { label: 'low-impact landing / jump', sets: 2, tc: 'plyo_or_ballistic' }, care('calf / Achilles care'), care('elbow care')],
  },
  // room items in keep priority (reverse of rules.cut_order.athletic_stay_active: Olympic goes first, then the ankle block)
  room: [
    { id: 'ankle hops (Thu)', day: 'Thu', items: [{ label: 'low ankle hops', sets: 2, tc: 'ankle' }] },
    { id: 'power piece (Mon)', day: 'Mon', items: [{ label: 'clean-family pull 2 x 3', sets: 2, tc: 'olympic' }] },
    { id: 'power piece (Thu)', day: 'Thu', items: [{ label: 'snatch-family pull 2 x 3', sets: 2, tc: 'olympic' }] },
  ],
  // athletic budget: profiles.sports.rec_pickleball.athletic_weekly; 3+ play days halve the jumps and drop the extra agility (R3-ATH-05)
  athletic: [
    { key: 'throws', target: [51, 69], stations: [{ sets: 2 }] },
    { key: 'jump_contacts', target: [14 * 0.5, 18 * 0.5], stations: [{ sets: 2 }] },
    { key: 'low_contacts', target: [68 * 0.5, 92 * 0.5], stations: [{ sets: 2, room: 'ankle hops (Thu)' }] },
    { key: 'olympic_sets', target: [4, 8], stations: [{ sets: 2, room: 'power piece (Mon)' }, { sets: 2, room: 'power piece (Thu)' }] },
  ],
  ...over,
});

/** 04: CrossFit-style class member, 35, L2, class model (hybrid_crossfit.4 / crossfit_style_bootcamp), 4 x 60, 8 weeks */
export const crossfit = (minutes = 60, over = {}) => ({
  name: `04 CrossFit-style class 4 x ${minutes}`, family: 'hybrid_crossfit', days: 4, variant: 'crossfit_style_bootcamp', minutes, phi: rules.session.time_fit.fit_factor, level: 'L2', N: 8,
  blocks: rules.stairway.exercise_blocks_by_N['8'], G: G(8), classModel: true,
  heavy: (s) => s.role === 'work',                 // the class lift rests 3-6 min (VOL-14; rules.time_model.strength_rest_for class_model_work)
  groups: {
    hips: { F: 10, S: 12, C: 18, mc: 2 }, quads: { F: 10, S: 12, C: 18, mc: 2 }, back: { F: 10, S: 12, C: 18, mc: 2 }, chest: { F: 10, S: 12, C: 18, mc: 2 },
    calves: { F: 7, S: 7, C: 8, mc: 1 }, shoulders: { F: 10, S: 10, C: 18, mc: 2 }, triceps: { F: 10, S: 10, C: 18, mc: 2 }, biceps: { F: 10, S: 10, C: 18, mc: 2 },
  },
  keep: ['hips', 'quads', 'back', 'chest', 'calves', 'shoulders', 'triceps', 'biceps'],
  pattern: { enabled: false },                     // the class lifts are the patterns (squat, press, deadlift, row)
  fixed: {
    // class order (OT18): warm-up (+ skill folded in, 6 min) -> core -> Olympic piece -> class lift (in the cells) -> WOD (10 min, the short WOD)
    Mon: [warm, { label: 'skill (in the warm-up)', minutes: rules.time_model.skill_in_warmup_min }, core, { label: 'WOD', minutes: rules.time_model.wod_minutes[0] }],
    Tue: [warm, core, { label: 'snatch (class power piece)', sets: 3, tc: 'olympic' }, { label: 'WOD', minutes: rules.time_model.wod_minutes[0] }],
    Thu: [warm, { label: 'skill (in the warm-up)', minutes: rules.time_model.skill_in_warmup_min }, core, { label: 'WOD', minutes: rules.time_model.wod_minutes[0] }],
    Fri: [warm, core, { label: 'clean (class power piece)', sets: 3, tc: 'olympic' }, { label: 'WOD', minutes: rules.time_model.wod_minutes[0] }],
  },
  room: [],
  athletic: [{ key: 'olympic_sets', target: [4.8, 7.2], stations: [{ sets: 3 }, { sets: 3 }] }],      // profiles.sports.crossfit_class
  ...over,
});

/** 01: competitive swimmer, 16, L2, off-season dryland (athletic.3), 3 x 60, 12 weeks, tests: strength + jumps */
export const swimmer = (minutes = 60, over = {}) => ({
  name: `01 swimming 3 x ${minutes}`, family: 'athletic', days: 3, variant: null, minutes, phi: rules.session.time_fit.fit_factor, level: 'L2', N: 12,
  blocks: rules.stairway.exercise_blocks_by_N['12'], G: G(12), athleteCap: rules.session.athlete_cap,
  // athletes' VOL3 block (weeks 9-12): the bilateral work lift takes strength rest (T0-EFF-07, E-125)
  heavy: (s, w) => w >= 9 && s.role === 'work' && (s.bucket === 'RP_BKD' || s.bucket === 'RP_BHD'),
  groups: {
    back: { F: 10, S: 15, C: 21, mc: 2 },     // field_off upper 0.5 -> 8 -> floor 10; swimmers: back >= 1.5 x chest on start and ceiling (DER-08)
    hips: { F: 10, S: 11, C: 16, mc: 2 }, quads: { F: 10, S: 11, C: 16, mc: 2 }, chest: { F: 10, S: 10, C: 14, mc: 2 },
    calves: { F: 10, S: 10, C: 12, mc: 1 },   // 3 leg days: floor 10, athlete climb + 2
    shoulders: { F: 10, S: 10, C: 16, mc: 2 },
  },
  // keep order: the profile's big priorities (back, glutes -> hips, quads), then the athletic keep order
  keep: ['back', 'hips', 'quads', 'chest', 'calves', 'shoulders'],
  pattern: PATTERN,
  fixed: {
    // protected tracks (competitive, T1-POL-13): one jump / throw station a day where the template has one + the Olympic lift every day
    // (swimmers: Olympic 2-3 days, 25 % plyometric, no change of direction, R3-ATH-01); shoulder care every session (T0-ATH-05), inside the rests
    Mon: [warm, core, { label: 'jump station (ballistic)', sets: 2, tc: 'plyo_or_ballistic' }, { label: 'clean-family lift', sets: 2, tc: 'olympic' }, care('shoulder care')],
    Wed: [warm, core, { label: 'medball throws', sets: 2, tc: 'throw' }, { label: 'snatch-family lift', sets: 2, tc: 'olympic' }, care('shoulder care')],
    Fri: [warm, core, { label: 'clean-family lift', sets: 2, tc: 'olympic' }, care('shoulder care')],
  },
  // room items in keep priority: budget-driven additions inside the 2 jump / throw + 1 Olympic split (R3-SES-01), cut before any group
  room: [
    { id: 'ankle hops (Fri)', day: 'Fri', items: [{ label: 'low ankle hops', sets: 2, tc: 'ankle' }] },
    { id: 'upper plyo (Wed)', day: 'Wed', items: [{ label: 'plyo push-up', sets: 2, tc: 'plyo_or_ballistic' }], counted: 1 },
    { id: '2nd jump station (Mon)', day: 'Mon', items: [{ label: 'second jump station', sets: 2, tc: 'plyo_or_ballistic' }], counted: 1 },
  ],
  athleticCountedBase: { Mon: 2, Wed: 2, Fri: 1 },
  // tests in week 1 and week 12 (T0-TST-01): the rep-max work-up (10 min) on the squat day and the deadlift day;
  // the jump test (6 min) replaces Monday's jump station (2 sets x 1.65 + 1 = 4.3 min) -> + 1.7
  tests: { Mon: { 1: 11.7, 12: 11.7 }, Fri: { 1: 10, 12: 10 } },
  // athletic budget: profiles.sports.swimming_middle.athletic_weekly
  athletic: [
    { key: 'jump_contacts', target: [37, 49], stations: [{ sets: 2 }, { sets: 2, room: '2nd jump station (Mon)' }] },
    { key: 'throws', target: [35, 45], stations: [{ sets: 2 }] },
    { key: 'low_contacts', target: [51, 69], stations: [{ sets: 2, room: 'ankle hops (Fri)' }] },
    { key: 'upper_contacts', target: [6, 8], stations: [{ sets: 2, room: 'upper plyo (Wed)' }] },
    { key: 'olympic_sets', target: [4.5, 7.5], stations: [{ sets: 2 }, { sets: 2 }, { sets: 2 }] },
  ],
  ...over,
});

/** offer check for sample 08: the same player on 3 days (athletic.3), same profile rules */
export const pickleball3 = (minutes = 45, over = {}) => ({
  ...pickleball(minutes), name: `08 pickleball 3 x ${minutes} (offer: one more day)`, days: 3,
  groups: { ...pickleball(minutes).groups, calves: { F: 10, S: 10, C: 12, mc: 1 } },      // 3 leg days: floor 10 (DER-04)
  fixed: {
    Mon: [warm, core, { label: 'low-impact landing / jump', sets: 2, tc: 'plyo_or_ballistic' }, care('calf / Achilles care'), care('rotator-cuff care')],
    Wed: [warm, core, { label: 'rotational medball throw', sets: 2, tc: 'throw' }, care('calf / Achilles care'), care('elbow care')],
    Fri: [warm, core, care('calf / Achilles care')],
  },
  room: [
    { id: 'ankle hops (Fri)', day: 'Fri', items: [{ label: 'low ankle hops', sets: 2, tc: 'ankle' }] },
    { id: 'power piece (Mon)', day: 'Mon', items: [{ label: 'clean-family pull 2 x 3', sets: 2, tc: 'olympic' }] },
    { id: 'power piece (Fri)', day: 'Fri', items: [{ label: 'clean-family pull 2 x 3', sets: 2, tc: 'olympic' }] },
  ],
  ...over,
});
