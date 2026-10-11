// tools/fixture/round3.mjs - model 1.3.0: the coach's round-3 answers (coach_answers_round3.md, newest authority) applied to
// the runtime rules and words, on top of the v1.2 review amendments (review-v12.mjs). Shared by the reference fixture build
// (tools/fixture/build-fixture.mjs) and the model compiler (tools/compile-model.mjs), so model/rules.json keeps deep-equalling
// the fixture rules (tests/compile.test.mjs). Every change names the round-3 answer behind it (COACH-R3 <id>) or is tagged
// INFERRED / PROPOSED. Pure functions of their input (deterministic, no clock).
//
// Engine stage B1 (time, volume and structure, engine 0.4.0):
//   R3-VOL-02 / R3-VOL-04  no check-ins, no tracking, no adaptive inputs: the plan is built once with its planned stairway
//   R3-VOL-01              rear delts are part of one shoulders line (front + side + rear delts, group credit)
//   R3-SES-01              FOCUS groups (hips = glutes + hamstrings, shoulders), 2-4 exercises per group trained that day,
//                          calves one exercise x 3 sets per leg day, Focus muscle 1 / 2 = +1 to +3 weekly sets
//   R3-SES-02              time vs minimums: tell + offer, fewer groups trained directly, supersets, the stairway always climbs;
//                          block ids and on / off toggles, superset recommendations
//   R3-VOL-03              placement: alternate the two exposures of a day type; small-muscle extras as a bonus exercise

export const R3_VERSION = '1.3.0';

const clone = (o) => JSON.parse(JSON.stringify(o));
const L = (a, b, c) => ({ L1: a, L2: b, L3: c });

/**
 * Round-3 rule amendments (applied after amendRules of review-v12.mjs in both builds).
 * @param {object} rules @returns {object}
 */
export function amendRulesR3(rules) {
  const R = clone(rules);
  R.rules_version = R3_VERSION;

  // ---- locked layer: 'no check-in = no change' becomes 'the plan follows its planned stairway' (R3-VOL-02, R3-VOL-04)
  for (const l of R.locked) if (l.key === 'locked.no_checkin_no_change') l.refs = ['R2-VOL-03', 'R3-VOL-02', 'R3-VOL-04'];

  // ---- lines and groups (R3-VOL-01, R3-SES-01): the stairway runs on lines; the floor, the 2-4 rule and the time check read groups.
  // A set counts at most 1.0 to a line or a group ("group credit", 12 v1.2 §3.3, PROPOSED): line credit = min(1, sum of member credits).
  R.muscles.lines = {
    order: ['quads', 'hamstrings', 'glutes', 'chest', 'lats_upper_back', 'shoulders', 'biceps', 'triceps', 'calves'],
    defs: {
      quads: { members: ['quads'], class: 'big', region: 'lower', group: 'quads' },
      hamstrings: { members: ['hamstrings'], class: 'big', region: 'lower', group: 'hips' },
      glutes: { members: ['glutes'], class: 'big', region: 'lower', group: 'hips' },
      chest: { members: ['chest'], class: 'big', region: 'upper', group: 'chest' },
      lats_upper_back: { members: ['lats_upper_back'], class: 'big', region: 'upper', group: 'back' },
      shoulders: { members: ['side_delts', 'rear_delts', 'front_delts'], class: 'small', region: 'upper', group: 'shoulders', focus_muscle: 'side_delts', iso_variant: 'side' },
      biceps: { members: ['biceps'], class: 'small', region: 'upper', group: 'biceps' },
      triceps: { members: ['triceps'], class: 'small', region: 'upper', group: 'triceps' },
      calves: { members: ['calves'], class: 'small', region: 'lower', group: 'calves', per_leg_day: true }
    },
    credit: 'min(1, sum of member credits)',
    refs: ['R3-VOL-01', 'R3-SES-01', 'VOL-09'],
    status: 'one shoulders line approved (R3-VOL-01); group credit PROPOSED (12 v1.2 §3.3)'
  };
  // side and rear delts are reported apart for display; their weekly sets come from the shoulders line (rear delts' own 4 / 6 / 8
  // retired: "I wouldn't categorize the rear delt as an individual muscle", R3-VOL-01)
  for (const m of ['side_delts', 'rear_delts', 'front_delts']) {
    const d = { ...R.muscles.defs[m], line: 'shoulders' };
    if (m !== 'front_delts') { d.target = false; d.fill = 'line'; }
    delete d.own_sets; delete d.floor_on_group;
    R.muscles.defs[m] = d;
  }
  R.muscles.groups.r3_status = 'approved (R3-SES-01): hips = glutes + hamstrings, shoulders = front + side + rear delts';
  delete R.muscles.groups.r3;

  // ---- volume (12 v1.2 §3.3): shoulders line 10 / 12 / 15, ceilings 14 / 22 / 25; the rear-delt own-sets rows retire
  R.volume.start.shoulders = L(10, 12, 15);
  R.volume.cap.shoulders = L(14, 22, 25);
  delete R.volume.start.side_delts; delete R.volume.start.rear_delts;
  delete R.volume.cap.side_delts; delete R.volume.cap.rear_delts;
  R.volume.priority.cap = { default: R.volume.priority.cap.default, chest: R.volume.priority.cap.chest };
  // the floor of 10 is read on groups with group credit, on the main days of a training block (R2-VOL-06, R3-VOL-01, R3-SES-01)
  R.volume.floor = {
    ...R.volume.floor,
    on: 'groups', group_credit: true, counted_on: 'main_days',
    // the hips floor is carried by the hamstrings line (hinges, leg curls), or by glutes when glutes is a Focus muscle (INFERRED)
    carriers: { quads: ['quads'], hips: ['hamstrings', 'glutes'], back: ['lats_upper_back'], chest: ['chest'], shoulders: ['shoulders'], biceps: ['biceps'], triceps: ['triceps'], calves: ['calves'] },
    // calves: 3 sets per leg day is the coach's minimum; the weekly 10 needs a 4th set and the optional-day calves slot (PROPOSED)
    calves_rule: 'per_leg_day',
    exempt: ['block_types:pre_season,in_season,maintenance,taper,recovery', 'pain_reduced', 'credit_only', 'not_trained_directly_time'],
    r3: undefined, r3_status: 'R3-VOL-01 / R3-SES-01 applied: floor on groups',
    refs: ['R2-VOL-06', 'R3-VOL-01', 'R3-SES-01']
  };
  delete R.volume.floor.r3;
  // Focus muscle 1 / 2 (R3-SES-01): + F weekly sets on the start AND the ceiling, F = 1-3 (default 2, PROPOSED), bounded by the
  // priority ceilings 18 / 26-28 / 30; the other groups are not slowed (the v1 3 % cap on non-priority muscles retires)
  R.volume.focus = {
    max: 2, add_default: 2, add_range: [1, 3], applies_to: ['start', 'cap'], cap_bound: 'volume.priority.cap', slow_others: false,
    intake_map: {
      quads: ['quads'], glutes: ['glutes'], hamstrings: ['hamstrings'], back: ['lats_upper_back'], chest: ['chest'], shoulders: ['shoulders'],
      biceps: ['biceps'], triceps: ['triceps'], calves: ['calves'], core: [], v_taper: ['shoulders', 'lats_upper_back'],
      side_delts: ['shoulders'], rear_delts: ['shoulders'] // retired values -> shoulders (R3-VOL-01)
    },
    // muscles a Focus line steers in exercise selection (select / week read derived.priority_muscles as muscle ids)
    steer_muscles: { shoulders: ['side_delts', 'rear_delts'], core: ['abs_obliques'] },
    uses_both_slots: ['v_taper'],
    refs: ['R3-SES-01', 'VOL-02', 'VOL-18'], status: 'Focus 1 / 2 approved (R3-SES-01); +2 default PROPOSED'
  };
  R.volume.priority.add = L(2, 2, 2);
  R.volume.priority.intake_map = R.volume.focus.intake_map;
  R.volume.priority.status = 'v1.3: Focus muscle 1 / 2 (R3-SES-01) +2 sets on start and ceiling; the v1 +4 / +4 / +6 and the 3 % cap on the others retire';
  // v_taper no longer holds chest flat at its start (VOL-18 'we need to balance this out'; R3-SES-01 'as much as everything else
  // is balanced'; R3-SES-02 'never flat'): back + shoulders get the Focus sets, chest keeps its own stairway (INFERRED)
  delete R.volume.priority.v_taper_hold;
  R.volume.priority.v_taper_hold_retired = 'R3-SES-01 / R3-SES-02: the other lines stay balanced and climb';

  // ---- stairway: planned only; check-in rows retire (R3-VOL-02, R3-VOL-04). The approved stairway (3 % to halfway, 5 % after,
  // each trained line on its ceiling in the last week) stays; every trained group climbs (R3-SES-02 step 4)
  delete R.stairway.checkin;
  R.stairway.no_checkin = 'planned_only';
  R.stairway.planned_only = { refs: ['R3-VOL-02', 'R3-VOL-04'], note: 'the generator outputs the whole plan once; people and coaches adjust it themselves; nothing is kept' };
  R.stairway.r3 = undefined; delete R.stairway.r3;
  R.stairway.status = '3 % / 5 %, lambda, display, RIR drift approved (R3-VOL-04)';
  R.stairway.limits.nonpriority_scope_v1_3 = 'retired: Focus muscles do not slow the other groups (R3-SES-01)';
  // the older-adult 3 % step cap retires: every trained group reaches its ceiling in the last week (R3-VOL-04; 12 v1.2 §3.7.4)
  R.stairway.limits.older_cap_retired = true;
  // the minimum climb of a trained group across a stairway block (12 v1.2 §3.10.1, PROPOSED): 2 whole sets, calves 1
  // a short block (6 weeks of 3 % / 5 % steps under the 7 % weekly total) grows a 10-set group by about 2 sets in all: its
  // groups climb at least 1 set (never flat), longer blocks 2 (PROPOSED)
  R.stairway.min_climb = { group: 2, calves: 1, line: 1, short_block: { max_N: 7, group: 1 }, refs: ['R3-SES-02', 'R2-PER-03', 'R2-PER-04'], status: 'PROPOSED (2-set climb; 1 set in blocks of 7 weeks or less)' };

  // ---- placement (R3-VOL-03 approved): alternate the two exposures of a day type; small-muscle extras become a short bonus
  // exercise on the optional day, else on a day that already trains the muscle, never as that day's only exercise for it
  R.placement.day_rotation = 'alternate_same_day_type';
  delete R.placement.day_rotation_r3;
  R.placement.day_rotation_refs = ['R3-VOL-03', 'VOL-07'];
  R.placement.bonus = { ...R.placement.bonus, prefer: ['optional_day', 'day_training_group_fewest_exercises'], never_only_exercise_of_group: true, optional_day_for_small_lines: true, refs: ['R3-VOL-03'] };
  delete R.placement.bonus.r3;
  R.placement.optional_days = { ...R.placement.optional_days, stairway_sets: false, small_line_bonus: true, refs: ['ORD-10', 'ORD-11', 'R3-VOL-03'] };
  R.placement.group_day_reduction = { ...R.placement.group_day_reduction, keep_roles: ['work', 'core_block', 'survival'] };

  // ---- session (R3-SES-01): 2-4 exercises for each group trained that day, split days alike; field athletes 12 + 2 core
  R.session.exercises_per_group = { ...R.session.exercises_per_group, split_day: [2, 4], calves_per_day: [1, 1], r3_status: 'approved (R3-SES-01)' };
  delete R.session.exercises_per_group.r3;
  R.session.athlete_cap_hard = true; // the cap of 12 + 2 core is never excused by a long-day warning (R2-SES-04, R3-SES-01)
  // time vs minimums (R3-SES-02 approved order; 12 v1.2 §3.10.1, spec D15_time_fit)
  R.session.time_fit = {
    fit_factor: 1.10, // "a little longer day" (R2-SES-05; 10 % PROPOSED)
    keep_order: ['hips', 'quads', 'back', 'chest', 'shoulders', 'calves', 'triceps', 'biceps'],
    keep_first: ['focus', 'profile_priority'],
    offers: ['offer.more_days', 'offer.longer_sessions', 'offer.keep_time'],
    round_minutes_to: 5,
    supersets: 'recommended',
    refs: ['R3-SES-02', 'R3-SES-01', 'R2-SES-05', 'UNI-09'],
    status: 'order approved (R3-SES-02); keep order with Focus and sport-pinned groups first PROPOSED (13 N-PROD-27)'
  };
  R.session.long_day.warn_above_factor = 1.1;

  // ---- time model (v1.3, review 07 major 'a flat 2.5 min a set'): a set costs its work time plus the rest it is dosed with
  // (midpoint of rules.rest); strength rest (3-6 min) for heavy work lifts and Olympic work; a rep-max test is a full work-up;
  // a superset shares the rest after the pair (INFERRED reading of VOL-14, UNI-09; numbers PROPOSED)
  R.time_model.work_minutes = { compound_bilateral: 0.75, compound_unilateral: 1.5, isolation: 0.6, isolation_unilateral: 1.2, core_set: 0.75, plyo_or_ballistic: 0.4, olympic: 0.5, throw: 0.5, cod: 1.25, sprint: 2.0, prehab: 0.6 };
  R.time_model.rest_class_minutes = { strength: 4.5, olympic: 2.5, hypertrophy: 1.5, isolation: 1.25, core: 0.75, plyo: 1.25, throw: 1.1, cod: 1.25, sprint: 2.5, prehab: 0.75 };
  R.time_model.rest_class_by_time_class = { compound_bilateral: 'hypertrophy', compound_unilateral: 'hypertrophy', isolation: 'isolation', isolation_unilateral: 'isolation', core_set: 'core', plyo_or_ballistic: 'plyo', olympic: 'olympic', throw: 'throw', cod: 'cod', sprint: 'sprint', prehab: 'prehab' };
  R.time_model.strength_rest_for = ['work_heavy', 'class_model_work', 'strength_family_work'];
  R.time_model.test_workup_minutes = 10; // warm-up sets + work up to one top set (R2-PER-07)
  R.time_model.test_item_minutes = { jumps: 6, sprint: 8, cod: 8, cardio: 15 }; // timed protocols (INFERRED)
  R.time_model.superset_rule = 'pair_shares_rest';
  R.time_model.refs = ['ORD-08', 'VOL-14', 'UNI-09', 'R2-SES-05', 'R3-SES-02'];
  R.time_model.status = 'PROPOSED (v1.3: work + dosed rest)';

  // ---- cut order: whole groups never move to the optional day any more; the time check trains fewer groups directly instead
  for (const fam of Object.keys(R.cut_order)) if (Array.isArray(R.cut_order[fam])) R.cut_order[fam] = R.cut_order[fam].filter(x => !(x.match && x.match.group_to_optional));
  R.cut_order.group_moves = 'retired (v1.3): the time check (R3-SES-02) decides which groups are trained directly';

  // ---- supersets (R3-SES-02 step 3; ORD-05): every eligible pair is a recommendation with the minutes it saves
  R.supersets.recommend = {
    pairs: [['knee', 'pull'], ['hip', 'push'], ['ISO_BICEP', 'rear'], ['ISO_TRICEP', 'side'], ['ISO_CALF', 'delts'], ['core', 'core']],
    never: R.supersets.never.slice(),
    on_when: 'needed_for_time',
    pref_key: 'superset_recommendations',
    refs: ['R3-SES-02', 'ORD-05'], status: 'recommendation approved (R3-SES-02); pair list PROPOSED'
  };

  // ---- plan editing (R3-SES-02): stable block ids and on / off switches (spec plan_editing)
  R.ordering.block_editing = {
    id_format: 'blk.<day_type>.<kind>.<n>',
    toggle: { warmup: false, core: true, skill: true, athletic: true, power: true, strength: false, accessories: true, prehab: true, circuit: false, conditioning: true, aerobic: true, cooldown: true, test: false },
    removable: { strength: true, accessories: true, prehab: true },
    refs: ['R3-SES-02'], status: 'toggles approved (R3-SES-02); per-kind flags PROPOSED'
  };

  // ---- plan types: week-by-week retires as a check-in mode (alias of a 12-week plan, R3-VOL-02)
  R.plan_types.week_by_week = { alias_of: 'fixed_12', view: 'week', refs: ['R3-VOL-02', 'R3-VOL-04'], status: 'retired as a check-in mode' };
  if (R.levels.pro_setting) {
    R.levels.pro_setting = { ...R.levels.pro_setting, requires: 'coach_rule_pack (Phase 1)' };
    delete R.levels.pro_setting.requires_output_mode; // check-ins retired (R3-VOL-02)
  }
  R.cycles.same_start_if = ['last_block_not_finished'];

  // ---- validation: V22 reads groups (no exemption for a warned group), H22 = planned stairway only
  for (const c of R.validation.checks) if (c.id === 'V22') c.key = 'check.v22_floor';
  return R;
}

/**
 * Round-3 words (EN + ES PROPOSED, neutral Latin American Spanish). [key]: [en, es].
 */
export const UI_R3 = {
  'muscle.shoulders': ['Shoulders', 'Hombros'],
  'locked.no_checkin_no_change': ['The plan follows its planned stairway: no check-ins, nothing is tracked', 'El plan sigue su escalera planificada: sin chequeos semanales, no se registra nada'],
  'check.h22_no_checkin_no_change': ['Planned stairway only (no check-ins)', 'Solo la escalera planificada (sin chequeos)'],
  'check.v22_floor': ['Every trained muscle group gets at least 10 sets a week', 'Cada grupo muscular entrenado recibe al menos 10 series por semana'],
  'warning.time_check': ['Your {days} x {minutes}-minute schedule cannot hold the full plan (10+ weekly sets for every muscle group, 2-4 exercises per group, a climbing stairway). See your schedule options below.', 'Tu horario de {days} x {minutes} minutos no alcanza para el plan completo (10+ series por semana para cada grupo muscular, 2-4 ejercicios por grupo, una escalera que sube). Mira tus opciones de horario abajo.'],
  'warning.not_trained_directly': ['Not trained directly (time): {group}. They still get work from your compound lifts. Add a day or longer sessions to train them directly.', 'No se entrenan directamente (tiempo): {group}. Igual trabajan con tus ejercicios compuestos. Agrega un día o sesiones más largas para entrenarlos directamente.'],
  'warning.time_lower_peak': ['Your {minutes}-minute sessions hold a lower peak for {group}: they still climb every week, to fewer sets than the full plan.', 'Tus sesiones de {minutes} minutos permiten un pico más bajo para {group}: igual suben cada semana, hasta menos series que el plan completo.'],
  'warning.supersets_needed': ['Do the marked supersets on {day} to finish on time.', 'Haz las superseries marcadas el {day} para terminar a tiempo.'],
  'warning.credit_only_groups': ['Trained through your sport work and compound lifts (no extra sets): {group}.', 'Se entrenan con el trabajo de tu deporte y los ejercicios compuestos (sin series extra): {group}.'],
  'warning.checkin_retired': ['Weekly check-ins are retired: your whole plan is built once, with its stairway, and you adjust it yourself.', 'Los chequeos semanales se retiraron: tu plan completo se arma una vez, con su escalera, y tú lo ajustas.'],
  'warning.calves_per_leg_day': ['Calves get 3-4 sets on each leg day; a third leg day or the optional calves slot brings them to 10 a week.', 'Las pantorrillas reciben 3-4 series cada día de piernas; un tercer día de piernas o el espacio opcional de pantorrillas las lleva a 10 por semana.'],
  'offer.keep_time': ['Keep {days} x {minutes} min: fewer muscle groups trained directly, every trained group still climbs', 'Mantener {days} x {minutes} min: menos grupos musculares entrenados directamente, cada grupo entrenado igual sube'],
  'offer.keep_time_lower_peak': ['Keep {days} x {minutes} min: every group trained, a lower peak for some', 'Mantener {days} x {minutes} min: todos los grupos entrenados, un pico más bajo para algunos'],
  'offer.longer_sessions': ['Longer sessions: about {min} min trains every group fully', 'Sesiones más largas: unos {min} min entrenan todos los grupos por completo'],
  'offer.more_days': ['One more training day ({days} days)', 'Un día más de entrenamiento ({days} días)'],
  'offer.more_days_min': ['One more training day ({days} days of about {min} min)', 'Un día más de entrenamiento ({days} días de unos {min} min)'],
  'changes.at_time_cap': ['{muscle} stays at these sets to fit your sessions: add a little load or a rep', '{muscle} se queda en estas series para caber en tus sesiones: agrega un poco de peso o una repetición'],
  'why.athlete_cap': ['Field athletes: up to {cap} exercises plus the core block', 'Atletas de campo: hasta {cap} ejercicios más el bloque de core'],
  'warning.test_day_long': ['Test day ({day}, week {week}): about {min} min with the warm-up and work-up to your top sets (you picked {limit})', 'Día de prueba ({day}, semana {week}): unos {min} min con el calentamiento y la subida a tu serie máxima (elegiste {limit})'],
  'warning.below_floor_work_lift': ['Your {minutes}-minute sessions hold {group} below 10 weekly sets: the main lift stays and climbs every week; add a day or longer sessions for the full 10.', 'Tus sesiones de {minutes} minutos dejan {group} por debajo de 10 series semanales: el ejercicio principal se queda y sube cada semana; agrega un día o sesiones más largas para las 10 completas.'],
  'why.time_fit': ['Your schedule holds these groups directly; the rest get compound credit (time vs minimums)', 'Tu horario permite estos grupos directamente; el resto recibe crédito de los compuestos (tiempo vs mínimos)'],
  'why.aerobic_separate': ['Your cardio session is done at another time of the day so the session fits your minutes', 'Tu sesión de cardio se hace en otro momento del día para que la sesión quepa en tus minutos'],
  'why.group_not_trained': ['{group} is not trained directly to fit your time', '{group} no se entrena directamente para caber en tu tiempo'],
  'why.focus_add': ['Focus muscle: +{n} weekly sets', 'Músculo de enfoque: +{n} series por semana'],
  'why.test_top_set': ['Test: work up to one top set, then the planned sets', 'Prueba: sube hasta una serie máxima y luego las series planeadas'],
  'why.superset_recommended': ['Superset recommended: saves about {min} min', 'Superserie recomendada: ahorra unos {min} min'],
  'why.planned_only': ['The planned stairway week (no check-ins)', 'La semana planeada de la escalera (sin chequeos)'],
  'why.bonus_optional_day': ['Extra small-muscle sets go to a short bonus exercise on the optional day', 'Las series extra de músculos pequeños van a un ejercicio extra corto en el día opcional'],
  'note.test_top_set': ['Test first: warm up and work up to one top set ({test}); then do the planned sets below', 'Primero la prueba: calienta y sube hasta una serie máxima ({test}); luego haz las series planeadas'],
  'ui.plan.not_trained_directly': ['Not trained directly (time)', 'No se entrenan directamente (tiempo)'],
  'ui.plan.superset_suggested': ['Superset suggested: saves about {min} min', 'Superserie sugerida: ahorra unos {min} min'],
  'ui.plan.block_toggle_hint': ['You can switch off today\'s {blocks} block', 'Puedes apagar el bloque de {blocks} de hoy'],
  'intake.focus.label': ['Focus muscles (optional)', 'Músculos de enfoque (opcional)'],
  'intake.priority.label': ['Focus muscles (optional)', 'Músculos de enfoque (opcional)'],
  'intake.activity.play_minutes': ['How long do you usually play?', '¿Cuánto juegas normalmente?'],
  'check.v8_priorities': ['At most 2 Focus muscles', 'Máximo 2 músculos de enfoque'],
  'warning.v8_priorities': ['Only 2 Focus muscles at a time: we kept {kept}', 'Solo 2 músculos de enfoque a la vez: dejamos {kept}']
};

/** UI_R3 keys that replace a v1 spec copy string put later in the i18n build */
export const R3_FINAL = ['locked.no_checkin_no_change', 'check.h22_no_checkin_no_change', 'offer.longer_sessions', 'offer.more_days', 'check.v22_floor', 'intake.focus.label', 'check.v8_priorities', 'warning.v8_priorities'];
