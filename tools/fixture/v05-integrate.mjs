// tools/fixture/v05-integrate.mjs - engine 0.5.0, work package V4 (integrate). Applied after v05-words.mjs by BOTH builds
// (tools/fixture/build-fixture.mjs and tools/compile-model.mjs), so model/rules.json and model/templates.json keep deep-equalling
// the fixture (tests/compile.test.mjs). Pure functions of their input (deterministic, no clock). Every value names its source:
// COACH-R4 (coach_answers_round4.md), an earlier coach answer, OBSERVED (dumps/BYOP), INFERRED or PROPOSED. Binding plan:
// design/ENGINE_V05_PLAN.md ("V4 integrate"); decisions: engine/DECISIONS.md section G (G-51 ...).
//
// What V4 changes in the model (each one found by reading the 8 regenerated samples against the coach's sheets, or by the
// benchmark run of the 94 + 8 intakes):
//   * THE SKELETON KEEPS ITS LATERALITY (COACH-R4 R4-SES-05 "horizontal pull, bilateral, symmetrical ... knee-dominant movement,
//     bilateral ... knee-dominant movement, unilateral"; OBSERVED BYOP 'Bilateral KD', 'Unilateral KD', 'Bilateral HD', 'Unilateral
//     HD' in AESTHETICS - FULL BODY - 4 DAYS, 3 DAY BUILDER and PUSHPULLLEGS): on a gym A / B / C day and a push / pull / legs day a
//     two-leg slot keeps a two-leg lift and a single-leg slot a single-leg lift in every exercise block, and the A day's first row is
//     a two-arm row. The laterality dial (COACH-ANSWER UNI-02 / UNI-03) no longer turns a lunge slot into a machine squat or a
//     single-leg hinge into a back extension there; it still moves the slots the skeleton leaves open (the vertical pull, the
//     optional day) and every athletic day (rules.selection.skeleton_laterality). V30 and V28 read the same table.
//   * PUSH / PULL / LEGS PRINTS IN THE SHEET'S ORDER (OBSERVED BYOP PUSHPULLLEGS: ... Incline, Flies, Dips, Tricep ... and
//     ... Unilateral KD, Leg Extensions, Leg Curls, Unilateral HD): the flies, the leg extension and the leg curl sit in the
//     strength block of their day so the day reads slot for slot (a day prints block by block).
//     The push day's two triceps slots pick their kind ('Tricep - Push', 'Tricep - Overhead'; rules.selection.slot_variants).
//   * A FOCUS SLOT NEVER PUSHES A GROUP OVER ITS FINAL SETS (the level's top number, COACH-R4 R4-PRG-04 "never above the level's top
//     number"; ORD-11 "Focus ... used to bring a priority muscle up to its weekly target"): where a group's exercises at their fewest
//     sets already hold more than its planned final sets, the optional day's Focus slots for that group close, last one first, while
//     the group still starts at or above its level's start (rules.placement.optional_focus.close_when_over_top). The main days'
//     template lifts always stay (R4-SES-04).
//   * EVERY MAIN DAY OPENS WITH A WARM-UP (COACH-ANSWER ORD-08 "always"): the 5-day hybrid week's Friday (written as "easy aerobic
//     first") gets the general warm-up line like every other day.
//   * THE SPEED-SESSION ORDER HOLDS (rules.ordering.hard SPEED_SESSION_ORDER): the jump + throw pair is a recommendation between
//     neighbours, it never moves the throw ahead of the ankle station (engine/athletic.mjs pairAthleticBlock; no model data).

const clone = (o) => JSON.parse(JSON.stringify(o));
const uniq = (a) => [...new Set(a)];

/** the skeletons whose slots name their laterality in the coach's sheets and in R4-SES-05 (the athletic days keep the dial) */
export const PINNED_SKELETON_PREFIXES = ['gym_', 'ppl_'];

/**
 * v0.5 / V4 record amendments (after amendExerciseV2). Found by the benchmark: a 74-year-old beginner with body weight only and "no
 * floor work" was given handstand skill work three times in one circuit, because every push-up - the hands-elevated one too -
 * carried the floor tag and the handstand record was filed as a foundational, low-skill lift that is fine for older adults.
 *   - handstand skill work: an advanced, high-skill lift, never for the 60+ default (PROPOSED correction of an INFERRED level;
 *     synthesis/02 itself notes 'LEVEL QUESTION' on the handstand records); the wall handstand push-up: never for the 60+ default
 * (The other half of the fix is rules.selection.floor_work: what the "no floor work" exclusion covers.)
 * @param {object} ex0 @returns {object}
 */
export function amendExerciseV4(ex0) {
  const ex = clone(ex0);
  const refs = new Set(ex.rule_refs || []);
  const tags = new Set(ex.tags || []);
  if (ex.id === 'handstand-skill-work-h-s') { ex.level = 'advanced'; ex.skill = 'high'; ex.older_ok = false; ex.older_opt_in_ok = false; refs.add('EQ-03'); refs.add('R2-ATH-08'); }
  if (ex.id === 'handstand-push-up-wall-supported') { ex.older_ok = false; ex.older_opt_in_ok = false; refs.add('EQ-03'); refs.add('R2-ATH-08'); }
  ex.tags = [...tags].sort();
  ex.rule_refs = [...refs].sort();
  return ex;
}

/**
 * v0.5 / V4 rule amendments (after amendRulesV3).
 * @param {object} rules @returns {object}
 */
export function amendRulesV4(rules) {
  const R = clone(rules);

  // ---- the skeleton keeps its laterality (R4-SES-05)
  R.selection.skeleton_laterality = {
    skeleton_prefixes: PINNED_SKELETON_PREFIXES.slice(),
    // the lower-body dial leaves these days alone: a two-leg slot keeps a two-leg lift, a single-leg slot a single-leg lift
    lower_fixed: true,
    laterality_of_bucket: { RP_BKD: 'bilateral', RP_BHD: 'bilateral', RP_UKD: 'unilateral', RP_UHD: 'unilateral' },
    // 'unilateral' in his sheets covers one side at a time and alternating sides (COACH-ANSWER UNI-07)
    unilateral_lateralities: ['unilateral', 'alternating'],
    // the A day's slot 1: 'horizontal pull, bilateral, symmetrical' - a two-arm row while the kit holds one
    lead_row: { skeletons: ['gym_A'], bucket: 'RP_HPULL', penalty: -6 },
    refs: ['R4-SES-05', 'UNI-02', 'UNI-03', 'UNI-07'],
    status: 'approved rule (R4-SES-05: his template names each slot\'s laterality; OBSERVED BYOP categories); INFERRED: the athletic days keep the dial (UNI-02 / UNI-03 "field athletes ... more like 80 % or 90 % unilateral work") - open question for the coach; the penalty weight is PROPOSED'
  };

  // ---- a slot that names a kind of exercise in his sheet picks that kind (OBSERVED BYOP PUSHPULLLEGS 'Tricep - Push', 'Tricep -
  // Overhead'): a preference weight, not a filter - the other kind stays in the pool and in the swaps
  R.selection.slot_variants = {
    ISO_TRICEP: {
      push: { id_re: 'push-?down|kickback', weight: 4 },
      overhead: { id_re: 'overhead|skullcrusher', weight: 4 }
    },
    refs: ['R4-SES-05'],
    status: 'OBSERVED slots (BYOP PUSHPULLLEGS); PROPOSED reading: push = push-downs and kickbacks, overhead = overhead extensions and skullcrushers; the weight is PROPOSED'
  };

  // ---- what "no floor work" (intake exclusion floor_work, F38) covers. It used to cover the floor core records and every push-up -
  // the hands-elevated one too - and none of the lifts done lying or kneeling on the floor (glute bridges, slider curls, floor
  // presses, kneeling presses), so the 74-year-old who ticked it got glute bridges and no push at all.
  R.selection.floor_work = {
    // a push-up with the hands on a bench, a table or a counter is not floor work: nobody gets down on the floor
    not_floor_id_re: '^incline-push-up-hands-elevated$',
    // lifts done lying, sitting or kneeling on the floor
    floor_lift_id_re: 'floor-press|seated-on-floor|glute-bridge|floor-dumbbell-skullcrusher|floor-prone|kneeling|nordic|ball-hamstring-curl|slider-hamstring|supine-slider|prone-dumbbell-hamstring|supine-lay-down|side-lying-db|floor-catch-and-release',
    refs: ['F38', 'EQ-03'],
    status: 'INFERRED (V4, G-55): the intake exclusion "floor work" read as any exercise that needs getting down on the floor; the id lists are PROPOSED until the catalog carries a position field'
  };

  // ---- the Focus slot of the optional day and the group's final sets
  R.placement.optional_focus = {
    ...(R.placement.optional_focus || { sets: [2, 3] }),
    close_when_over_top: true,
    close_refs: ['R4-PRG-04', 'ORD-11', 'R4-SES-04'],
    close_status: 'PROPOSED (V4, G-52): an optional-day Focus slot closes when the group\'s exercises at their fewest sets already hold more than its planned final sets; the main days\' template lifts never close'
  };

  // ---- validation: V30 also holds the skeleton's laterality; V28 reads the share on the stations the dial may move
  const V5 = R.validation.v05;
  V5.skeleton = {
    ...V5.skeleton,
    laterality_of_bucket: clone(R.selection.skeleton_laterality.laterality_of_bucket),
    laterality_skeleton_prefixes: PINNED_SKELETON_PREFIXES.slice(),
    unilateral_lateralities: ['unilateral', 'alternating'],
    // a pick that stands in for pain, an exclusion or a kit with no lift of that laterality is not judged
    laterality_exempt_flags: ['pain_swap', 'pattern_gap', 'no_candidate'],
    refs: uniq([...(V5.skeleton.refs || []), 'R4-SES-05'])
  };
  for (const c of R.validation.checks || []) {
    if (c.id === 'V30') c.v05 = 'a day built to one of the coach\'s skeletons holds his slots in his order; on a gym A / B / C or push / pull / legs day a two-leg slot holds a two-leg lift and a single-leg slot a single-leg lift (R4-SES-05)';
    if (c.id === 'V28') c.v05 = 'the bilateral share is read on the stations the laterality dial may move: the slots of a gym A / B / C or push / pull / legs day keep the laterality the coach\'s template names (R4-SES-05)';
  }
  return R;
}

/** the push / pull / legs stations that sit between two compound lifts in his sheet: printed with them (the strength block) */
const PPL_IN_STRENGTH = { ppl_push: ['ISO_CHEST'], ppl_legs: ['ISO_QUAD', 'ISO_LEG_FLEXION'] };

/**
 * v0.5 / V4 template amendments (after amendTemplatesV05).
 * @param {object} families @returns {object}
 */
export function amendTemplatesV4(families) {
  const F = clone(families);
  const eachDay = (fn) => {
    for (const [fam, f] of Object.entries(F)) for (const [d, t] of Object.entries(f.days || {})) {
      for (const [name, def] of Object.entries(t.day_types || {})) fn(def, { fam, days: d, variant: null, name, template: t });
      for (const [vn, v] of Object.entries(t.variants || {})) for (const [name, def] of Object.entries((v && v.day_types) || {})) fn(def, { fam, days: d, variant: vn, name, template: t });
    }
  };
  // ---- push / pull / legs prints in the sheet's order
  eachDay((def) => {
    const move = PPL_IN_STRENGTH[def.skeleton];
    if (!move) return;
    const st = def.stations || [];
    const lastRP = st.reduce((a, s, i) => (/^RP_/.test(s.bucket) && s.block === 'strength' ? i : a), -1);
    st.forEach((s, i) => { if (i < lastRP && move.includes(s.bucket) && s.block === 'accessories') s.block = 'strength'; });
  });
  // ---- the two triceps slots of his push day name their kind ('Tricep - Push', 'Tricep - Overhead')
  eachDay((def) => {
    if (def.skeleton !== 'ppl_push') return;
    for (const s of def.stations || []) {
      if (s.bucket !== 'ISO_TRICEP' || s.variant) continue;
      if (/push/i.test(String(s.variant_text || ''))) s.variant = 'push';
      else if (/overhead/i.test(String(s.variant_text || ''))) s.variant = 'overhead';
    }
  });
  // ---- every main day opens with a warm-up (ORD-08)
  let proto = null;
  eachDay((def) => { if (!proto) proto = (def.stations || []).find(s => s.bucket === 'WARMUP_GENERAL') || null; });
  eachDay((def, at) => {
    if (def.kind !== 'main' || !proto || (def.stations || []).some(s => s.bucket === 'WARMUP_GENERAL')) return;
    const w = clone(proto);
    w.id = `${at.name}.w01`;
    w.note = 'general warm-up before the day\'s work (COACH-ANSWER ORD-08 "always"; V4: the day was written with its easy aerobic block first)';
    w.rank = null;
    def.stations = [w, ...(def.stations || [])];
  });
  return F;
}
