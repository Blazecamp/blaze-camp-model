// tools/fixture/v06-select.mjs - engine 0.6 work package "selection, templates and week layout" (the round-4 coach-eye reviews of
// the 8 sample plans, reviews/coach-eye-r4/). Applied after v05-fix2.mjs by BOTH builds (tools/fixture/build-fixture.mjs and
// tools/compile-model.mjs), so model/*.json keeps deep-equalling the fixture (tests/compile.test.mjs). Pure functions of their
// input (deterministic, no clock), idempotent. Every value names its source: COACH-R4 (coach_answers_round4.md), CT-01, CX-01..04,
// an earlier coach answer, OBSERVED (dumps/), INFERRED or PROPOSED. Decisions: engine/DECISIONS.md section G (G-130 ...).
// Tests: tests/v06-select.test.mjs.

const clone = (o) => JSON.parse(JSON.stringify(o));
const uniq = (a) => [...new Set(a)];

/**
 * v0.6 selection record amendments (after amendExerciseX2). No record changes in this package.
 * @param {object} ex0 @returns {object}
 */
export function amendExerciseS6(ex0) {
  return clone(ex0);
}

/**
 * v0.6 selection rule amendments (after amendRulesX2).
 * @param {object} rules @returns {object}
 */
export function amendRulesS6(rules) {
  const R = clone(rules);
  R.selection.s6 = {
    // G-131 (02 M3; R2-SES-03 the light opener; 04 profile injuries are hot spots, not a diagnosis): the low-back core list (planks,
    // dead bugs, bird dogs only) is for a client who REPORTS low-back pain. A profile whose injury list names a low-back hot spot
    // keeps a small lean toward anti-movement drills and the profile's core plane shares (rotational / anti-rotation included)
    core: {
      low_back_list_only_with_pain: true,
      // (a 50+ client with a low-back hot spot keeps the list: the v0.4 review of the 52-year-old court player asked for it - PROPOSED)
      hotspot_list_from_age: 50,
      hotspot_anti_bonus: 2, hotspot_flexion_re: 'weighted|sit-up|crunch|v-up|leg-raise|toes-to-bar|knees-to-chest', hotspot_flexion: -2,
      // a profile with a transverse core share holds at least one transverse / anti-rotation drill on a main day
      transverse_min_pct: 20, transverse_bonus: 4,
      // block changes: one core exercise a main day changes at an exercise-block boundary, inside its plane and kind (PER-02)
      block_change_per_day: 1,
      refs: ['R2-SES-03', 'PER-02', 'CAT-08', 'R4-SES-05'],
      status: 'approved rules (R2-SES-03 light opener; PER-02 one change a block); PROPOSED: the weights and the one-core-change-a-day reading'
    },
    // G-132 (03 M3; R2-ATH-03 'an intermediate athlete may start at stage 2'; CAT-13 COD athletes get in and out of the hip): a plan
    // that starts its jump work at Receive-Create stage 2 or 3 may take single-leg and lateral jumps from its first exercise block -
    // the two-foot rule of the first reactive block (E-32) stays for depth jumps and drops only; a cutting field / court sport holds
    // at least one single-leg or lateral jump station on every training day
    jumps: {
      start_stages: ['RC2', 'RC3'],
      depth_re: 'depth',
      cutting: { families: ['field_court'], cod_sport: true, bonus: 8 },
      refs: ['R2-ATH-03', 'CAT-13', 'CAT-10', 'UNI-12'],
      status: 'approved stages (R2-ATH-03); PROPOSED: the per-day single-leg / lateral station and its weight'
    },
    // G-133 (08 M1; EQ-03 'old, injured or a lot of high volume: collect that volume in a safe place with more constraints'; ATH-10
    // beginners DB / KB, hex-bar jumps; 04 rec_pickleball triple_ext.level_note 'older / injured / high-volume clients: no snatch
    // variants'): with declared pain, 3+ play days a week or the 50+ racket overlay the snatch family leaves the power slot (the
    // DB / KB high pull stays); a snatch-day station takes a KB swing or a high pull; a beginner with pain gets no barbell power lift
    olympic_safe: {
      when_pain: true, when_play_days_min: 3, when_racket50: true,
      drop_families: ['snatch'], keep_id_re: 'high-pull',
      snatch_station_adds: ['swing'],
      barbell_exclude_levels_with_pain: ['L1'],
      refs: ['EQ-03', 'ATH-10', 'R3-ATH-02'],
      status: 'approved rule (EQ-03, ATH-10); PROPOSED: the play-day threshold (3, the heavy play week of R3-ATH-05)'
    },
    // G-134 (07 M2; R2-LIB-01 / PER-02 one detail between blocks; PER-04 the second exposure of a slot is a different exercise): a
    // block change is the same exercise with one detail, or a new exercise that keeps the laterality and the support of the old one
    // and differs in one detail; the upper-body dial no longer turns a one-arm row into a two-arm one (or back) at a block boundary on
    // the coach's gym and push / pull / legs days
    block_change: {
      keep_upper_laterality_skeleton_prefixes: ['gym_', 'ppl_', 'class_'],
      max_distance_new_exercise: 1,
      same_support: true,
      supported_re: '(^|-)(seal|chest-supported|incline-bench|prone)(-|$)|machine|cable|lat-pulldown|pulldown',
      refs: ['R2-LIB-01', 'PER-02', 'PER-04'],
      status: 'approved rule (R2-LIB-01, PER-02); PROPOSED: the support classes read from the record ids'
    },
    // G-135 (05 M1; OBSERVED BYOP 'BOOTCAMP - OPTION 2' Cardio station in 1A / 2A / 3A; PRG-03 timed circuits): the bootcamp's
    // cardio station takes a cardio pick the kit holds (jump rope, jumping jacks, high knees, mountain climbers, step-ups ...) before a
    // ballistic KB swing or medball throw; it keeps its place in the coach's station order and is dosed as continuous work
    circuit_cardio_first: {
      families: ['fat_loss_bootcamp'], bucket: 'COND_CIRCUIT', ballistic_penalty: -14,
      refs: ['PRG-03', 'OT06', 'R4-SES-05'],
      status: 'OBSERVED station (his OPTION 2 Cardio slot); PROPOSED: the weight'
    },
    refs: ['R4-SES-05', 'R2-LIB-01', 'EQ-03', 'R2-ATH-03', 'R2-SES-03'],
    status: 'PROPOSED (engine 0.6 selection package): readings of approved answers from the round-4 coach-eye reviews'
  };
  // G-134 (07 M2: two seal rows in one week, DB on Tuesday and barbell on Friday): the seal rows are one movement family, once a week
  // (E-182 rules.selection.r2.families)
  if (R.selection.r2 && Array.isArray(R.selection.r2.families) && !R.selection.r2.families.some((f) => f.id === 'seal_row')) {
    R.selection.r2.families = [...R.selection.r2.families, { id: 'seal_row', re: '^seal-row', week_max: 1 }];
  }
  // G-136 (03 M1; R3-ATH-05 'a 45-60+ min session of the activity counts as one of the cardio sessions (up to 2)'; R2-ATH-06 the
  // soccer off-season aerobic count): a competitive athlete's team practices count as aerobic sessions the same way (PROPOSED for
  // competitive athletes), the template's 'sport or off' days show as team practice (or off), and a hard aerobic colour never sits on
  // the day before a top-speed sprint or a heavy hinge
  R.conditioning.s6 = {
    practice: { counts_as_aerobic: true, competitive_only: true, max_replaced: 2, keep_gym_led_min: 1, prefer_note: 'sport_or_off',
      refs: ['R3-ATH-05', 'R2-ATH-06'], status: 'PROPOSED for competitive athletes (R3-ATH-05 is approved for activities)' },
    hard_eve: { colours: ['A'], sprint_kinds: ['max_velocity'], heavy_hinge: true, refs: ['ORD-03', 'R2-SES-06', 'R2-ATH-07'],
      status: 'PROPOSED: the hard interval colour is never the day before top-speed sprints or the week\'s heavy hinge' },
    refs: ['R3-ATH-05', 'R2-ATH-06', 'R2-SES-06'],
    status: 'PROPOSED (engine 0.6 selection package)'
  };
  // G-139 (T3-ATH-02 / R2-ATH-01 the weekly plyo share; CAT-13 side effect): a stairway week the backward never-a-drop pass leaves
  // under its share band takes its ankle / reactive work back up, inside the band and under the next week's family total; with no
  // ankle room left, the ballistic jumps the climb raised give a step back (never below the week before)
  R.athletic.s6 = { share_up_after_backward: 'ankle_then_jumps', refs: ['T3-ATH-02', 'R2-ATH-01'], status: 'INFERRED (keeps the approved share band)' };
  void uniq;
  return R;
}

/** the athletic A / B skeletons that take the arm slot (R4-SES-05 slot 5) and the bucket each takes */
export const ARM_SLOT = { athletic_A: 'ISO_BICEP', athletic_B: 'ISO_TRICEP' };

/**
 * v0.6 selection template amendments (after amendTemplatesX2).
 * G-130 (01 M1, 02 M1; COACH-R4 R4-SES-05 'athletic days: the athletic block, then the same A / B lifts' - slot 5 biceps on the A day,
 * triceps on the B day): the athletic A / B day types take the arm slot. It is the day's last counted rank (a small-muscle accessory,
 * the first thing the person may remove, R4-SES-04) and prints in slot 5's place, before the leg extension / leg curl. It is for the
 * competitive athlete whose sport profile writes direct arm sets (04 weekly_sets ISO_BICEP / ISO_TRICEP > 0: the swimmer, the
 * linebacker; condition `if_athletic_arm_sets`): the other field sports and the stay-active adult keep his athletic sheet (no arm
 * isolation - OBSERVED BYOP ATHLETIC; the soccer reviewer asked to keep it so), and the in-season variant stays as written.
 * @param {object} families @returns {object}
 */
export function amendTemplatesS6(families) {
  const F = clone(families);
  const fam = F.athletic;
  if (!fam) return F;
  for (const [, t] of Object.entries(fam.days || {})) {
    const lists = [Object.entries(t.day_types || {})];
    for (const [vn, v] of Object.entries(t.variants || {})) if (vn !== 'in_season' && v && v.day_types) lists.push(Object.entries(v.day_types));
    for (const list of lists) for (const [name, def] of list) {
      const bucket = ARM_SLOT[def.skeleton];
      if (!bucket || def.stations.some((s) => s.bucket === bucket)) continue;
      const iso = def.stations.find((s) => s.bucket === (bucket === 'ISO_BICEP' ? 'ISO_QUAD' : 'ISO_LEG_FLEXION'));
      const lastRP = [...def.stations].reverse().find((s) => /^RP_/.test(s.bucket));
      const proto = iso || lastRP;
      if (!proto) continue;
      const n = Math.max(...def.stations.map((x) => Number((/\.s(\d+)$/.exec(x.id) || [0, 0])[1]))) + 1;
      const counted = def.stations.filter((s) => typeof s.rank === 'number' && s.rank < 99).map((s) => s.rank);
      const st = { ...clone(proto), id: `${name}.s${String(n).padStart(2, '0')}`, bucket, role: 'iso', block: 'accessories', group: bucket === 'ISO_BICEP' ? 'biceps' : 'triceps',
        sets_hint: [2, 2], pair: null, superset: null, circuit: null, axial: null, variant: null, variant_text: null, laterality_dial: false, loading: null,
        condition: 'if_athletic_arm_sets', condition_text: 'competitive athlete\'s session, sport profile with direct arm sets (G-130)', care_code: undefined, pool_filter: null,
        note: `slot 5: ${bucket === 'ISO_BICEP' ? 'biceps curl' : 'triceps extension'} (R4-SES-05 'athletic days: the athletic block, then the same A / B lifts'; v0.6, G-130)`,
        rank: (counted.length ? Math.max(...counted) : 0) + 1 };
      delete st.care_code;
      const at = iso ? def.stations.indexOf(iso) : def.stations.indexOf(lastRP) + 1;
      def.stations.splice(at, 0, st);
    }
  }
  return F;
}

/**
 * v0.6 selection sport-profile amendments (after amendSportX2). No profile changes in this package.
 * @param {object} sport @returns {object}
 */
export function amendSportS6(sport) {
  return clone(sport);
}

/** v0.6 selection words: key -> [EN, ES]. Every key wins over the earlier layers. (Wording is minimal: the words package owns copy.) */
export const UI_S6 = {
  'why.practice_counts': ['Your {n} team practices a week count as aerobic sessions', 'Tus {n} prácticas de equipo por semana cuentan como sesiones aeróbicas'],
  'why.practice_day': ['Team practice (or a day off)', 'Práctica de equipo (o día libre)'],
  'why.olympic_safe': ['A KB swing or a high pull here: with your joints, play days or age the plan keeps the power work in a safe place', 'Un swing con pesa rusa o un jalón alto aquí: por tus articulaciones, tus días de juego o tu edad, el plan mantiene el trabajo de potencia en un lugar seguro'],
  'why.hard_eve': ['The hard intervals moved off the day before your top-speed sprints or heavy hinge', 'Los intervalos intensos se movieron fuera del día anterior a tus sprints a máxima velocidad o tu bisagra pesada']
};
