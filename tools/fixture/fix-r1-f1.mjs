// tools/fixture/fix-r1-f1.mjs - model 1.3.0, engine 0.4.0 FIX ROUND 1 / F1 (time, volume and structure). Applied after
// integrate-b4.mjs by BOTH builds (tools/fixture/build-fixture.mjs and tools/compile-model.mjs), so model/rules.json keeps
// deep-equalling the fixture rules (tests/compile.test.mjs). Pure functions of their input (deterministic, no clock). Every value
// names its source: COACH-ANSWER / COACH-R2 / COACH-R3 <id>, OBSERVED, INFERRED or PROPOSED.
//
// What F1 changes in the model (engine/DECISIONS.md section E, fix round 1, E-81 ... ; samples/REVIEW_LOG.md v0.4 fix round 1):
//   * rules.volume.one_target_groups - a FOCUS group of two lines (hips = hamstrings + glutes) carries ONE weekly target for the
//     non-physique plans (COACH-R3 R3-SES-01 'glutes + hamstrings as one hips group'; RECHECK 03 major: hips ran 1.6-1.8 x every
//     other group for a soccer player because glutes and hamstrings were filled as two lines). The group's carrier line takes the
//     target (hips: hamstrings, or glutes when the client picks glutes as a Focus muscle); the other line follows as credit.
//   * rules.stairway.release_rounding - whole sets follow the planned T(w) rounded half up (VOL-06 'you round up, you round
//     down'), so a group's steps spread through the block instead of waiting for a full bank (RECHECK 02 / 07: flat for 6-9 weeks)
//   * rules.placement.added_slots - an added (bonus / Focus) exercise opens at 2 sets, only in the first week of an exercise
//     block, and never as a 1-set station (VOL-16 / VOL-07, PER-02; RECHECK 01 / 04 / 06 majors)

const clone = (o) => JSON.parse(JSON.stringify(o));

/**
 * F1 rule amendments (after amendRulesB4).
 * @param {object} rules @returns {object}
 */
export function amendRulesF1(rules) {
  const R = clone(rules);
  R.volume.one_target_groups = {
    groups: ['hips'],
    // the physique and strength plans keep glutes and hamstrings as two lines (their own weekly sets, OBSERVED aesthetics templates)
    modifiers: ['field_off', 'strength_athlete_off', 'stay_active', 'general', 'fat_loss', 'athlete_in'],
    unless_focus: true,
    refs: ['R3-SES-01', 'R2-VOL-06'],
    status: 'PROPOSED (F1, E-84): one target per FOCUS group outside physique / strength plans; glutes follow the hamstrings line as credit unless picked as a Focus muscle'
  };
  R.stairway.release_rounding = {
    mode: 'half_up',
    refs: ['VOL-06', 'R3-VOL-04'],
    status: 'PROPOSED (F1, E-85): whole sets follow round-half-up of the planned T(w) (the coach: "you round up, you round down")'
  };
  R.volume.calves = {
    ...R.volume.calves,
    athlete_cap_modifiers: ['field_off', 'strength_athlete_off', 'stay_active', 'athlete_in'],
    athlete_climb: 2,
    optional_slot_below_leg_days: 4,
    f1_refs: ['R3-SES-01', 'BRAIN V13', 'OBSERVED BYOP ATHLETIC'],
    f1_status: 'PROPOSED (F1, E-88): athletes climb their calves 2 sets over 3 a leg day; the optional-day Calves slot only below 4 main leg days'
  };
  // the coach's joint care ('survival' work, ORD-07) is done every time and is not counted as working sets toward the floor
  // (R2-VOL-06 / R3-VOL-01 count working sets; RECHECK 01 minor / 08 major: easy prehab sets padded the shoulders and calves)
  R.prehab = { ...R.prehab, credits: 'none', credits_status: 'PROPOSED (F1, E-89): joint care credits no muscle (was by_catalog)' };
  // a skill folded into the warm-up keeps its minimum practice time beyond the 8-minute warm-up (OBSERVED OT18 'WARMUP/SKILL',
  // the dose text '6-10 min of quality practice'; RECHECK 04 major: costed at 0)
  R.time_model = { ...R.time_model, skill_in_warmup_min: 6, skill_in_warmup_short: { at_or_below_minutes: 45, min: 3 } }; // a short class keeps 3 min of skill
  // the strength test is that week's top set (COACH-R2 R2-PER-07 'tested in the last week instead of that week's top sets'): the
  // work-up to the rep max replaces one planned set, the others become back-off sets a step easier (RECHECK 01 / 02 / 04 / 07 majors)
  R.tests = { ...R.tests, replaces_top_set: { back_off_rir_add: 1, back_off_rir_min: 2, refs: ['R2-PER-07'], status: 'PROPOSED (F1, E-91): the back-off dose (planned RIR + 1, at least 2)' } };
  // every round-3 answer is approved (coach_answers_round3.md, 2026-10-09): none is listed as pending in a plan any more
  R.r3_approved = ['R3-VOL-01', 'R3-VOL-02', 'R3-VOL-03', 'R3-VOL-04', 'R3-SES-01', 'R3-SES-02', 'R3-PER-01', 'R3-ATH-01', 'R3-ATH-02', 'R3-ATH-03', 'R3-ATH-04', 'R3-ATH-05', 'R3-GEN-01'];
  // H21 (validate): in a block of 8+ weeks a trained group gains a set in the second half and never holds its sets longer than half
  // the block (COACH-R3 R3-VOL-04 / R3-SES-02 step 4; RECHECK 01 / 02 / 07 majors)
  R.stairway.hold_rules = { min_N: 8, min_climb: 3, hold_extra_weeks: 1, refs: ['R3-VOL-04', 'R3-SES-02'], status: 'PROPOSED (F1, E-92)' };
  // the week's rows count toward the rear delts (COACH-R3 R3-VOL-01 'they also get worked when you do back'): V18's weekly rear-delt
  // rule holds with 1.5+ rear-delt sets of row credit when the week has no rear-delt station (RECHECK 05 major)
  R.volume.rear_from_rows_min = 1.5; // 6 sets of horizontal rows (0.25 rear-delt credit each)
  // a big mover the time check leaves untrained directly keeps its movement pattern on the optional day (one exercise, fixed 2 sets,
  // no stairway, not counted toward the floor; BRAIN 10.7 'every primary pattern at least once'; RECHECK 08 blocker / 01 major)
  R.volume.pattern_keep = {
    buckets: { back: 'RP_HPULL', chest: 'RP_HPUSH', quads: 'RP_UKD', hips: 'RP_UHD' },
    order: ['back', 'chest', 'quads', 'hips'],
    sets: 2, max_per_week: 3,
    refs: ['R3-SES-02', 'BRAIN 10.7'],
    status: 'PROPOSED (F1, E-94): pattern stations on the optional day for the big movers the minutes leave untrained directly'
  };
  R.placement.added_slots = {
    entry_sets: 2,
    only_at_exercise_block_start: true,
    big_lines_on_optional_day: true,
    refs: ['VOL-07', 'VOL-16', 'PER-02', 'R3-VOL-03'],
    status: 'PROPOSED (F1, E-86): a bonus / Focus exercise opens at 2 sets in the first week of an exercise block; a big line\'s climb may open a 2-set Focus exercise on the optional day when the main days are full (R3-VOL-03 / D-33 spirit)'
  };
  // block ids carry the weekday (RECHECK 03 / 07 minors: 'blk.Push.core.1' on Monday and Thursday, 'blk.Legs 1.core.1' with a space,
  // one aerobic id on two days): an edit to one day's block never hits another day of the same type (E-90)
  if (R.ordering && R.ordering.block_editing) R.ordering.block_editing = { ...R.ordering.block_editing, id_format: 'blk.<weekday>-<day_type slug>.<kind>.<n>', id_format_status: 'PROPOSED (F1, E-90): lower-case weekday + day-type slug (a-z, 0-9, -)' };
  return R;
}

// ---------------------------------------------------------------------------------------------------------------- words

/** [key]: [en, es] - Spanish PROPOSED (neutral Latin American; coach ES review, D-64) */
export const UI_F1 = {
  // E-91: the strength test replaces the lift's top set
  'note.test_top_set_replaces': [
    'Test first: warm up and work up to one top set ({test}). It replaces this lift\'s top set this week.',
    'Prueba primero: calienta y sube hasta una serie máxima ({test}). Reemplaza la serie más pesada de este ejercicio esta semana.'
  ],
  'note.test_back_off': [
    'Then {n} back-off sets, about {rir} reps in the tank.',
    'Luego {n} series de descarga, dejando unas {rir} repeticiones en reserva.'
  ],
  'ui.plan.test_end_strength': [
    'End test this week: on the tested lifts, work up to one top set - it replaces that lift\'s top set - then do its back-off sets',
    'Prueba final esta semana: en los ejercicios de prueba sube hasta una serie máxima - reemplaza la serie más pesada - y luego haz sus series de descarga'
  ],
  'why.pattern_kept': [
    'Your main days cannot hold {group} at 10+ sets, so the optional day keeps one exercise of its pattern',
    'Tus días principales no alcanzan para {group} con 10+ series, así que el día opcional mantiene un ejercicio de su patrón'
  ],
  'why.prehab_not_calf': [
    'The day already has its calf exercise, so the Achilles care is a shin exercise (calves: one exercise a leg day)',
    'El día ya tiene su ejercicio de pantorrilla, así que el cuidado del Aquiles es un ejercicio de tibial (pantorrillas: un ejercicio por día de pierna)'
  ],
  'why.test_replaces_top_set': [
    'The test replaces this week\'s top set; the other sets are back-off sets',
    'La prueba reemplaza la serie más pesada de la semana; las demás son series de descarga'
  ],
  // E-84: the hips group carries one weekly target (its carrier line); the other line follows as credit
  'why.group_one_target': [
    'Counted as one {group} group: one weekly target for the whole group',
    'Contado como un solo grupo de {group}: una meta semanal para todo el grupo'
  ]
};

/** UI_F1 keys that replace an earlier string of the same key */
export const F1_FINAL = ['ui.plan.test_end_strength'];
