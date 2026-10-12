// tools/fixture/v06-words.mjs - engine 0.6 work package "words": what the plan prints, in English and Spanish. Applied after
// v05-fix2.mjs by BOTH builds (tools/fixture/build-fixture.mjs and tools/compile-model.mjs), so model/*.json keeps deep-equalling
// the fixture (tests/compile.test.mjs). Pure functions of their input (deterministic, no clock). Every value names its source:
// COACH-R4 (coach_answers_round4.md), CT-01, CX-01..04, an earlier coach answer, OBSERVED (dumps/), INFERRED or PROPOSED.
// Source of the work: the round-4 coach-eye reviews (reviews/coach-eye-r4/0*.md); decisions: engine/DECISIONS.md section G
// (G-160 ... G-189); tests: tests/v06-words.test.mjs.
//
// What this layer changes in the model (rules: rules.render.v6, rules.volume.pain.x6; words: UI_W6):
//   * CIRCUIT PROGRESSION FROM THE REAL WEEKS (05 M2; R4-PRG-03 a rule the person applies, R4-PRG-02, CX-02): the "How you
//     progress" line, the weekly-table note and "What changes" are built from the weeks' own rounds and work seconds - never
//     "the rounds stay" when a round is added.
//   * THE PYRAMID WRITTEN OUT (06 M3; COACH-ANSWER PRG-07 '12, 10, 8, and then 20 ... You drop back to the 20 for a light-weight,
//     high-rep set'): "12, 10, 8, then a light back-off set of 20" plus his own note; no single-range rep note under per-set reps.
//   * THE PAIN-FREE DEPTH CUE BY EXERCISE TYPE (08 M3; VOL-03, R3-ATH-02): a machine sets its range, a squat goes to a box, a lunge
//     shortens its range, a step-up uses a low step of about 6-12 in / 15-30 cm (the low_impact box of the athletic rules).
//   * "WHAT CHANGES" NAMES THE EXERCISES AND THE REAL SET DIFFERENCES (04 M2, 07 m8): '+2 sets on X (Saturday): 2 -> 4 sets';
//     a new exercise block lists what changed, day by day.
//   * The printed-copy minors of the reviews: singulars, the top of the effort scale (no "past your limits" next to "never to
//     failure", H02), "trained through your compound lifts" when there is no sport practice, the real exercise count per session,
//     the pain line only promises a note the plan prints, the class member's WOD line, no video search on a cardio colour,
//     one "jumps more than usual" line per week, whole sets in the tables (the JSON stays exact), no athlete jargon in a general-
//     population bootcamp, Spanish articles, lists and lower-case groups mid-sentence.
// The engine reads only keys (engine/render.mjs, engine/explain.mjs, engine/dose.mjs); every word is below, EN and ES.

const clone = (o) => JSON.parse(JSON.stringify(o));
const uniqSorted = (a) => [...new Set(a)].sort();

/**
 * v0.6 words rule amendments (after amendRulesX2).
 * @param {object} rules @returns {object}
 */
export function amendRulesW6(rules) {
  const R = clone(rules);
  R.render = R.render || {};
  R.render.v6 = {
    // 05 M2 (R4-PRG-03, R4-PRG-02, CX-02): circuit lines are built from week.circuit.rounds / work_s, week to week
    circuit_from_weeks: true,
    // 06 M3 (PRG-07): per-set reps are written out, the last light set named as a back-off set, his note under it; the
    // single-range rep note (note.rep_cap) never sits under per-set reps
    pyramid: { note_key: 'note.pyramid_backoff', drop_rep_cap: true, refs: ['PRG-07', 'R4-PRG-03'] },
    // 04 M2, 07 m8 (R4-PRG-03 'the person applies the plan alone'): "What changes" from the real set difference of each slot,
    // and the exercises a new exercise block changes, day by day
    changes_from_sets: true, block_changes_by_day: true,
    // 02 m9, 06 m11, 08 m9 (GEN-08, H02 'never to failure'): the top of the week-level scale reads "the hardest week of the plan"
    // (the word is in plan.stair_level; the effort rules do not change)
    // 02 m14, 08 m4: a group with no exercise of its own is "trained through your compound lifts" unless the client has sport
    // practice days (meta.season.practice_days > 0, competitive)
    credit_only_lifts_key: 'warning.credit_only_groups_lifts',
    // 02 m8, 03 m12, 06 m10 (R4-SES-02): the header prints the real range of day.exercise_count over the main days
    session_size_from_days: true,
    // 08 m2: the pain line drops 'says so on the lift' when no lift carries a pain-swap note
    pain_line_no_lift_suffix: '_no_lift', pain_lift_notes: ['note.pain_swap', 'note.pain_instead_of'],
    // 04 m11 (OBSERVED 'COMPETE CROSSFIT SPLIT' A3:A7 is competitor copy; CX-04): a class member who does not compete reads that
    // this plan's WODs replace the box's WOD on these days (PROPOSED wording, for the coach)
    class_member_instruction: { family: 'hybrid_crossfit', unless_competitive: true, replace: { 'instruction.cf.3': 'instruction.cf.3_class' } },
    // 03 m12, 07 m9 (R4-LIB-05): no 'Watch how' search on an aerobic colour session (a search for 'Blue (A): short / high
    // intensity' finds nothing useful; the session is written out in full on the card)
    aerobic_video: 'none',
    // 06 m12 (ORD-09 colours; his Basic Instruction 'max 40 min of steady'): an Orange (C, long / easy) session on a machine reads
    // 'steady pace' - the run / walk split of his sheet is for running only
    aerobic_steady_off_feet: ['C'],
    // 05 m10 (R4-PRG-02 one clear note): one 'jumps more than usual' line per week, the groups listed
    accel_one_line: true,
    // 05 m12 (STATUS v0.5 printed-copy minor): the weekly tables print whole sets; plan JSON keeps the exact quarter credits
    sets_display: 'whole',
    // 05 m13, 08 m9 (GEN-01 tone; the athletic layer is off for the general population): a general-population circuit plan prints
    // no 'Athletic work this week' line and calls its switchable station a conditioning station; a recreational profile's line
    // drops the plyometric share and the Receive-Create stage
    athletic_line: { hide_families: ['fat_loss_bootcamp'], hide_share_stage_unless: 'competitive' },
    circuit_station_label: { families: ['fat_loss_bootcamp'], key: 'block.short.circuit_station' },
    // COACH-CH5 CH5-01 ('team practice doesnt matter, just have the athlete take into account and they handle that'): a competitive
    // athlete with team practice days reads one line, up front, to take them into account and adjust the load himself
    team_practice_line: { key: 'ui.plan.team_practice', refs: ['CH5-01'] },
    // 03 m12: a one-leg jump says 'per leg'
    contacts_per_leg_key: 'reps.contacts_per_leg',
    // G-202 (COACH-CH5 CH5-02 'all should have it and be adjustable always'; reviews r5 01 / 02 M1, 03 m1): a group the stairway leaves
    // to the helper credit but that holds an exercise of its own (meta.stairway[].held_groups: the arm slot) is never called
    // 'no exercise of its own': the tables print its sets with its direct sets, the final column says it is held, not stepped
    held_groups: { cell_key: 'ui.plan.sets_with_direct', final_key: 'ui.plan.final_held', refs: ['CH5-02', 'R4-SES-05', 'CX-04'] },
    // G-203 (R4-PRG-04 'never above the level's top'; review r5 07 m11: chest 28 printed next to 'Final sets 27'): a weekly number
    // whose helper credit takes it less than one set above the group's final sets prints as the final sets (the JSON keeps the exact
    // quarter credits)
    sets_display_cap_final: true,
    // G-212 (R4-PRG-01 'arriving one week early and holding is fine'; review r6 02 m16: shoulders 12.5 printed 13 from week 9 against an
    // arrival in week 11): a weekly number still under the group's final sets never prints as the final sets
    sets_display_before_final: true,
    // G-213 (H08; review r6 02 m17: 'Chest 1, Shoulders 2' on a day whose bench and incline press are both chest by the plan's own
    // credits): the week-at-a-glance group of an exercise is the group it trains as a prime mover (credit 1)
    glance_by_credits: true,
    // G-211 (review r6 02 m15): the weekly table's legend lines are printed only for the kinds of cell the table holds
    sets_legend: { dash_key: 'ui.plan.sets_legend_dash', direct_key: 'ui.plan.sets_legend_direct', refs: ['R4-LIB-04', 'CH5-02'] },
    // G-204 (COACH-CH5 CH5-03 'they should reach more if needed'; H10 'said plainly'; review r5 06 m1: 5 of the back's 25 sets sit on
    // the optional days and the plan never says so): one line up front per big group whose final sets need an optional day's bonus
    // G-208 (review r6 08 M1; H17 'a group the template cannot take to the floor is named in the plan, never hidden'): every group whose
    // final sets hold an optional day's bonus exercise, not only the big groups
    optional_bonus_line: { key: 'ui.plan.optional_bonus_big', all_groups: true, refs: ['CH5-03', 'R3-VOL-03', 'CX-04', 'R4-SES-03', 'H17'] },
    refs: ['R4-PRG-02', 'R4-PRG-03', 'R4-SES-02', 'R4-LIB-05', 'CX-02', 'CX-04', 'CH5-01', 'PRG-07', 'VOL-03', 'GEN-01', 'GEN-08', 'R2-GEN-08'],
    status: 'approved rules (the coach ids above); PROPOSED: the wording of every new line (machine-written Spanish listed in es_review.priority_review)'
  };
  R.render.refs = uniqSorted([...(R.render.refs || []), 'PRG-07', 'GEN-08']);

  // 08 M3 (VOL-03 'painful positions out'; R3-ATH-02 knee-friendly strength for racket players 50+; 04 KNEE_DEGENERATIVE_COURT
  // 'pain-free depth, slow eccentrics'): the depth cue by exercise type, first match wins; the step height is the athletic rules'
  // low box (rules.athletic low_impact heights, 6-12 in)
  R.volume.pain.x6 = {
    depth_by_pattern: [
      { id_re: 'step-?up', key: 'note.pain_free_depth_step' },
      { machine: true, key: 'note.pain_free_depth_machine' },
      { classes: ['BKD'], key: 'note.pain_free_depth_squat' },
      { classes: ['UKD'], key: 'note.pain_free_depth_lunge' }
    ],
    step_height_in: [6, 12], step_height_cm: [15, 30],
    refs: ['VOL-03', 'R3-ATH-02', 'R2-GEN-08'],
    status: 'approved rule (VOL-03: pain - cut, do not push it); PROPOSED: the words and the 6-12 in step'
  };
  return R;
}

/** v0.6 words: key -> [EN, ES]. Every key wins over the earlier layers. */
export const UI_W6 = {
  // ---- 05 M2: circuit progression from the real weeks
  'ui.plan.progress_circuit_v6': ['Circuits: {rounds}; the work time per station goes from {from} s to {to} s, {when}. Add a little weight only when you finish a station with more reps left in the tank than planned.', 'Circuitos: {rounds}; el tiempo de trabajo por estación va de {from} s a {to} s, {when}. Agrega un poco de peso solo cuando termines una estación con más repeticiones en reserva de las planeadas.'],
  'ui.plan.progress_circuit_v6_flat': ['Circuits: {rounds}; the work time stays at {s} s per station. Add a little weight only when you finish a station with more reps left in the tank than planned.', 'Circuitos: {rounds}; el tiempo de trabajo se mantiene en {s} s por estación. Agrega un poco de peso solo cuando termines una estación con más repeticiones en reserva de las planeadas.'],
  'ui.plan.circuit_climb_note_v6': ['Circuit sets = rounds x stations: {rounds}. The work time per station climbs {when}.', 'Series del circuito = rondas x estaciones: {rounds}. El tiempo de trabajo por estación sube {when}.'],
  'ui.plan.circuit_climb_note_v6_flat': ['Circuit sets = rounds x stations: {rounds}. The work time per station stays at {s} s.', 'Series del circuito = rondas x estaciones: {rounds}. El tiempo de trabajo por estación se mantiene en {s} s.'],
  'circuit.rounds_stay': ['the rounds stay at {n}', 'las rondas se mantienen en {n}'],
  'circuit.rounds_up': ['{from} rounds, then {steps}', '{from} rondas, luego {steps}'],
  'circuit.rounds_step': ['{to} from week {week}', '{to} desde la semana {week}'],
  'circuit.time_every_week': ['a step every week', 'un paso cada semana'],
  'circuit.time_every_n': ['a step every {n} weeks', 'un paso cada {n} semanas'],
  'circuit.time_weeks': ['in weeks {weeks}', 'en las semanas {weeks}'],
  'circuit.time_week_one': ['in week {weeks}', 'en la semana {weeks}'],
  'changes.circuit_rounds_up': ['One more round: {to} rounds a station (was {from})', 'Una ronda más: {to} rondas por estación (antes {from})'],
  'changes.circuit_rounds_up_n': ['More rounds: {to} rounds a station (was {from})', 'Más rondas: {to} rondas por estación (antes {from})'],
  'ui.plan.accel_week_all_round': ['This week jumps more than usual ({pct} % more sets for every muscle group: one more circuit round): adjust if needed.', 'Esta semana sube más de lo habitual ({pct} % más series para todos los grupos musculares: una ronda más de circuito): ajusta si hace falta.'],
  'ui.plan.accel_week_groups': ['This week jumps more than usual ({pct} % more sets for {groups}): adjust if needed.', 'Esta semana sube más de lo habitual ({pct} % más series para {groups}): ajusta si hace falta.'],
  // ---- 06 M3: the pyramid (PRG-07)
  'reps.pyramid_sets': ['{sets} sets: {list}, then a light back-off set of {last}', '{sets} series: {list} y luego una serie ligera de descarga (back-off) de {last}'],
  'reps.pyramid_short': ['{list}, then {last} light', '{list} y luego {last} ligeras'],
  'note.pyramid_backoff': ['Pyramid: the first set at a mid weight, each set a little heavier as the reps drop, the last heavy set at your heaviest weight; then drop to a light weight for the back-off set.', 'Pirámide: la primera serie con un peso medio, cada serie un poco más pesada a medida que bajan las repeticiones, la última serie pesada con tu peso más alto; luego baja a un peso ligero para la serie de descarga (back-off).'],
  // ---- 08 M3: the pain-free depth cue by exercise type
  'note.pain_free_depth_machine': ['Pain-free range only: set the machine (seat, pad or range stops) so your knee bends only as far as it stays pain-free.', 'Solo en el rango sin dolor: ajusta la máquina (asiento, rodillo o topes) para que la rodilla se doble solo hasta donde no duela.'],
  'note.pain_free_depth_squat': ['Squat only as deep as stays pain-free: sit back to a box or bench set at that height.', 'Baja solo hasta donde no duela: siéntate hacia atrás sobre un cajón o banco a esa altura.'],
  'note.pain_free_depth_lunge': ['Go only as deep as stays pain-free: shorten the step and stop before the back knee goes all the way down.', 'Baja solo hasta donde no duela: acorta el paso y detente antes de que la rodilla de atrás llegue abajo.'],
  'note.pain_free_depth_step': ['Use a low step, about 6-12 in (15-30 cm); go higher only if it stays pain-free, and lower yourself slowly.', 'Usa un escalón bajo, de unos 15-30 cm (6-12 in); súbelo solo si no duele y baja despacio.'],
  // ---- 04 M2, 07 m8: what changes, by exercise and by the real set difference
  'changes.set_added_ft': ['+1 set on {exercise} ({day}): {from} → {to} sets', '+1 serie en {exercise} ({day}): {from} → {to} series'],
  'changes.sets_added_n': ['+{n} sets on {exercise} ({day}): {from} → {to} sets', '+{n} series en {exercise} ({day}): {from} → {to} series'],
  'changes.block_swaps_day': ['{dayname}: {list}', '{dayname}: {list}'],
  'changes.load_up_circuit_one': ['Keep your weights this week (the stations got longer); add load only where you finish a station with more than 1 rep left', 'Mantén tus pesos esta semana (las estaciones duran más); agrega peso solo donde termines una estación con más de 1 repetición en reserva'],
  'changes.load_up_circuit_same_one': ['Same work time this week: add a little load where you finish a station with more than 1 rep left', 'Mismo tiempo de trabajo esta semana: agrega un poco de peso donde termines una estación con más de 1 repetición en reserva'],
  'changes.load_up_test': ['Same sets: on a tested lift the test takes the place of the top set; on the other lifts add a little load or reps', 'Mismas series: en un ejercicio con prueba, la prueba toma el lugar de la serie más pesada; en los demás agrega un poco de peso o repeticiones'],
  // ---- minors
  'plan.stair_level': ['Week level: {level} of 11 (2 = the start, 11 = your hardest week)', 'Nivel de la semana: {level} de 11 (2 = el inicio, 11 = tu semana más dura)'],
  'warning.credit_only_groups_lifts': ['Trained through your compound lifts (no extra sets of their own): {group}.', 'Se entrenan con tus ejercicios compuestos (sin series extra propias): {group}.'],
  'ui.plan.session_size_range': ['about {low}-{high} exercises a session (plus the warm-up and the 2 core exercises)', 'unos {low}-{high} ejercicios por sesión (más el calentamiento y los 2 ejercicios de core)'],
  'warning.pain_plan_no_lift': ['You told us about pain in your {area} ({trigger}). What this plan does about it: it leaves out the lifts that load it hardest, it holds {groups} at the same sets instead of adding more (progress with reps and load), and it tells you where to stop on the lifts that bend it. If the pain grows, stop and see a professional.', 'Nos dijiste que tienes dolor en {area} ({trigger}). Lo que hace este plan: deja fuera los ejercicios que más cargan esa zona, mantiene {groups} en las mismas series en lugar de sumar más (progresa con repeticiones y carga) y te dice dónde parar en los ejercicios que la doblan. Si el dolor aumenta, detente y consulta a un profesional.'],
  'warning.pain_plan_plain_no_lift': ['You told us about pain in your {area}. What this plan does about it: it leaves out the lifts that load it hardest, and it holds {groups} at the same sets instead of adding more (progress with reps and load). If the pain grows, stop and see a professional.', 'Nos dijiste que tienes dolor en {area}. Lo que hace este plan: deja fuera los ejercicios que más cargan esa zona y mantiene {groups} en las mismas series en lugar de sumar más (progresa con repeticiones y carga). Si el dolor aumenta, detente y consulta a un profesional.'],
  // (Spanish: 'dolor en la rodilla', the area with its article inside a sentence - 08 m14, R2-GEN-08; English keeps the plain word)
  'pain.area_def.knee': ['knee', 'la rodilla'], 'pain.area_def.shoulder': ['shoulder', 'el hombro'], 'pain.area_def.lower_back': ['lower back', 'la espalda baja'],
  'pain.area_def.upper_back': ['upper back', 'la espalda alta'], 'pain.area_def.hip_groin': ['hip or groin', 'la cadera o la ingle'], 'pain.area_def.ankle_foot': ['ankle or foot', 'el tobillo o el pie'],
  'pain.area_def.elbow': ['elbow', 'el codo'], 'pain.area_def.wrist_hand': ['wrist or hand', 'la muñeca o la mano'], 'pain.area_def.neck': ['neck', 'el cuello'], 'pain.area_def.other': ['sore area', 'la zona adolorida'],
  'instruction.cf.3_class': ['***The WODs in this plan are your conditioning on these days: do them in place of your box\'s WOD, not on top of it.', '***Los WODs de este plan son tu acondicionamiento en estos días: hazlos en lugar del WOD de tu box, no además de él.'],
  'ui.plan.sets_rounded': ['Numbers are rounded to whole sets.', 'Los números están redondeados a series enteras.'],
  'ui.plan.block_view_title': ['{label}, week by week · {weeks}', '{label}, semana a semana · {weeks}'],
  'block.short.circuit_station': ['conditioning station', 'estación de acondicionamiento'],
  'reps.contacts_per_leg': ['{n} contacts per leg', '{n} contactos por pierna'],
  'list.or': ['or', 'o'],
  // COACH-CH5 CH5-01: team practices are the athlete's own to account for (PROPOSED wording)
  'ui.plan.team_practice': ['This plan does not count your {n} team practices a week: take them into account and adjust the load yourself (lighter on a hard practice day, a little more in a light week).', 'Este plan no cuenta tus {n} prácticas de equipo por semana: tómalas en cuenta y ajusta tú la carga (más ligero en un día de práctica dura, un poco más en una semana ligera).'],
  'ui.plan.team_practice_one': ['This plan does not count your weekly team practice: take it into account and adjust the load yourself (lighter on a hard practice day, a little more in a light week).', 'Este plan no cuenta tu práctica de equipo semanal: tómala en cuenta y ajusta tú la carga (más ligero en un día de práctica dura, un poco más en una semana ligera).'],
  'effort.intensifier_days_one': ['Last week: one intensifier on {days}: a MYO set on the day\'s last small-muscle or machine exercise', 'Última semana: un intensificador el {days}: una serie MYO en el último ejercicio de músculo pequeño o de máquina del día'],
  'effort.drift_intensifier_days_one': ['Week {week}: one intensifier on {days}: a MYO set on the day\'s last small-muscle or machine exercise.', 'Semana {week}: un intensificador el {days}: una serie MYO en el último ejercicio de músculo pequeño o de máquina del día.'],
  // G-202 (CH5-02): a group with its own slot exercise but no stairway target (PROPOSED wording)
  'warning.slot_held_groups': ['{group}: one exercise of their own on the training days (the template\'s arm slot), held at its sets. They are not stepped up like the other groups: progress them with weight and reps.', '{group}: un ejercicio propio en los días de entrenamiento (el espacio de brazos de la plantilla), con sus series fijas. No suben de series como los demás grupos: progrésalos con peso y repeticiones.'],
  'ui.plan.sets_with_direct': ['{n} ({direct} direct)', '{n} ({direct} directas)'],
  'ui.plan.final_held': ['held: {direct} direct sets a week', 'fijas: {direct} series directas por semana'],
  // G-204 (CH5-03): a big group whose final sets need the optional day's bonus exercises (PROPOSED wording)
  // (G-222, review r7 08 m3: 'shoulders ends' / 'hombros termina' - the line names the group's total, so the verb agrees in both languages)
  'ui.plan.optional_bonus_big': ['{group}: {n} of its {top} final sets sit on your optional days ({exercises}). Skip those days and the {group_lc} total ends at about {main}.', '{group}: {n} de sus {top} series finales están en tus días opcionales ({exercises}). Si te saltas esos días, el total de {group_lc} queda en unas {main}.'],
  // G-211 (review r6 02 m15: the legend explained '-' rows no table printed and read the brackets of '7 (4 direct)' the opposite way):
  // the counting note no longer carries the '-' sentence; each legend line is added only when its kind of cell is printed
  'ui.plan.weekly_sets_groups_note': ['Counted the coach\'s way: a set counts once for its group (hips = glutes + hamstrings; shoulders = front, side and rear delts); helpers 1/4 set; jumps, throws, sprints, swings, carries and Olympic lifts never count.', 'Contado a la manera del coach: una serie cuenta una vez para su grupo (cadera = glúteos + isquiotibiales; hombros = deltoides anterior, lateral y posterior); los músculos de apoyo cuentan 1/4 de serie; los saltos, lanzamientos, sprints, swings, caminatas con carga y levantamientos olímpicos nunca cuentan.'],
  'ui.plan.sets_legend_dash': ['"-" = no exercise of its own in this plan (in brackets: the sets it still gets from the other lifts).', '"-" = sin ejercicio propio en este plan (entre paréntesis: las series que igual recibe de los otros ejercicios).'],
  'ui.plan.sets_legend_direct': ['"{cell}" = {n} sets counted for the group, {direct} of them from its own exercise (the rest are helper sets from the other lifts).', '"{cell}" = {n} series contadas para el grupo, {direct} de ellas de su propio ejercicio (el resto son series de apoyo de los otros ejercicios).'],
  // G-208 (review r6 08 M1 'Skip that day and shoulders end at about 6'): one optional day
  'ui.plan.optional_bonus_one_day': ['{group}: {n} of its {top} final sets sit on your optional day ({exercises}). Skip that day and the {group_lc} total ends at about {main}.', '{group}: {n} de sus {top} series finales están en tu día opcional ({exercises}). Si te saltas ese día, el total de {group_lc} queda en unas {main}.'],
  'instruction.2_bridge_optional': ['In this plan your cardio sits on your optional day ({days}): do it there, or on any other free day.', 'En este plan tu cardio cae en tu día opcional ({days}): hazlo ahí o en cualquier otro día libre.']
};

/** the Spanish lines of this layer the coach should review first (additive to es_review.priority_review; machine-written, R2-GEN-08) */
export const ES_PRIORITY_W6 = Object.keys(UI_W6).sort();
