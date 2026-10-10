// tools/fixture/fix-r1-f3.mjs - model 1.3.0, engine 0.4.0 FIX ROUND 1 / F3 (selection, dosing and the printed plan). Applied after
// fix-r1-f2.mjs by BOTH builds (tools/fixture/build-fixture.mjs and tools/compile-model.mjs), so model/rules.json keeps
// deep-equalling the fixture rules (tests/compile.test.mjs). Pure functions of their input (deterministic, no clock). Every value
// names its source: COACH-ANSWER / COACH-R2 / COACH-R3 <id>, OBSERVED, INFERRED or PROPOSED.
//
// What F3 changes in the model (engine/DECISIONS.md section E, fix round 1 / F3, E-110 ...; samples/REVIEW_LOG.md v0.4 fix round 1 /
// F3):
//   * rules.selection.f3 - the laterality dial on every non-locked lower station (BRAIN §6.5 #2 / #3: slot conversion for athletes,
//     the stance swap for physique / strength clients; UNI-02 / UNI-03), the non-spinal hinge on the second hinge day (R2-SES-01),
//     the swimmer's horizontal press first (SHOULDER_SWIMMER), the core opener for a low-back hot spot, the side-delt pick for a
//     shoulders Focus (R3-VOL-01 / R3-SES-01), week-wide movement families (pull-ups by foot position, the staggered / kickstand /
//     rear-foot-on-wall DB hinges, lying triceps extensions), no axial-high pick on a non-axial day, the level filter
//   * rules.reps / rules.effort / rules.rest additions - the late off-season step to VOL3 at the halfway week of a single-block
//     stairway (PER-11), the rep hint as a ceiling in every block for main compounds, the last-week circuit intensifier
//     (R3-VOL-04), a superset pair always carries its rest in numbers (VOL-14), the class strength table on the squat / press /
//     deadlift work slots only (OBSERVED HALF TIME class split)
//   * rules.legal.parq_url - the official PAR-Q+ (COACH-R3 R3-GEN-01: 'a link to the official PAR-Q+'; spec health.parq_link)
//   * words: the printed plan in the client's words (EN / ES): supersets that do not fit the minutes, every switchable block, the
//     direction of the two-leg / single-leg advice, Focus vs bonus labels, the bridge under the coach's '1 in the tank', the weekly
//     sets table with every group, the release stamp, the health-check line, change lines by FOCUS group, 'How to adjust this plan'

const clone = (o) => JSON.parse(JSON.stringify(o));

/**
 * F3 rule amendments (after amendRulesF2).
 * @param {object} rules @returns {object}
 */
export function amendRulesF3(rules) {
  const R = clone(rules);
  R.legal = { ...R.legal, parq_url: 'https://eparmedx.com/', parq_status: 'COACH-R3 R3-GEN-01 (approved: a link to the official PAR-Q+; spec health.parq_link, RESEARCH eparmedx.com 2026-10-08)' };
  // one-detail variations that read as a contradiction (RECHECK 04 minor 'Flat DB Fly - on an incline bench'; 07 minor 'Rear-Foot-on-Wall
  // DB Deadlift (RDL) - with kettlebells'; 05 major 'holding a plate at the chest' with no plate in the kit): the record's own name
  // rules the detail out; a sissy squat with only dumbbells / kettlebells holds one of those (R2-LIB-01 'show it as ...'; EQ-01 / EQ-09
  // kit-aware words)
  const V = R.selection.variations;
  if (V && Array.isArray(V.values)) {
    V.values = V.values.map((v) => {
      if (v.id === 'incline_bench') return { ...v, when: { ...v.when, not_re: 'incline|decline|flat' } };
      if (v.id === 'kettlebell') return { ...v, when: { ...v.when, not_re: v.when.not_re + '|(^|-)db(-|$)|dumbbell' } };
      if (v.id === 'plate_at_chest') return { ...v, when: { ...v.when, kit: ['weight_plate'] } };
      return v;
    });
    const at = V.values.findIndex((v) => v.id === 'plate_at_chest');
    const dbChest = { id: 'db_at_chest', axis: 'implement', when: { cc: ['BKD', 'LEG_EXTENSION'], impl: ['bodyweight'], re: 'sissy', kit: ['dumbbell', 'kettlebell'] } };
    if (at >= 0 && !V.values.some((v) => v.id === 'db_at_chest')) V.values.splice(at + 1, 0, dbChest);
    V.f3_status = 'PROPOSED (F3, E-110): no detail that contradicts the record name; kit-aware load words';
  }
  // selection (DECISIONS E-127 ... E-133; every weight PROPOSED)
  R.selection.f3 = {
    // BRAIN §6.5 #2 / #3 (UNI-02, UNI-03, R2-SES-01 / R2-SES-02): every lower station but the tested lifts and the counted axial squat /
    // hinge takes part in the bilateral : unilateral dial; a station the dial turns two-legged prefers a counted bilateral lift (a
    // squat / deadlift / back extension, not a glute bridge) so the share moves
    dial: { all_lower: true, keep_axial: true, skip_roles: ['circuit_station'], flipped_bilateral_counted: 4, refs: ['UNI-02', 'UNI-03', 'R2-SES-01', 'BRAIN 6.5'], status: 'PROPOSED (F3, E-127)' },
    // COACH-R2 R2-SES-01 (the second hinge day is a non-spinal hinge: hip thrust, back extension, reverse hyper), PER-04 ('I don't want to
    // always load the lower back'); a low-back hot spot (04 LOW_BACK_EXTENSION / LOW_BACK_LOADING) leans harder; one two-legged
    // deadlift-pattern exercise a day
    non_spinal_hinge: {
      prefer_re: 'hip-thrust|hyperextension|back-extension|reverse-hyper|glute-ham|b-stance', avoid_re: 'deadlift|rdl|good-morning',
      deadlift_re: 'deadlift|rdl', weight: 0, hotspot_extra: 5, hotspot_avoid: -3, second_bilateral_deadlift: -4,
      hotspots: ['LOW_BACK_EXTENSION', 'LOW_BACK_LOADING'], refs: ['R2-SES-01', 'PER-04'], status: 'PROPOSED (F3, E-128)'
    },
    // R2-SES-03 (light core opener) + 04 LOW_BACK_EXTENSION 'core first as anti-extension / anti-rotation' (INFERRED + SCIENCE AQ4)
    core_low_back: { hotspots: ['LOW_BACK_EXTENSION', 'LOW_BACK_LOADING'], anti_bonus: 3, avoid_re: 'russian-twist|leg-raise|v-up|sit-up|toes-to-bar|knees-to-chest|woodchop|crunch', avoid: -3, refs: ['R2-SES-03', 'SCIENCE AQ4'], status: 'PROPOSED (F3, E-129)' },
    // no hanging (grip / lat) core right before the day's pulls or its deadlift (R2-SES-03 'light opener'; RECHECK 06 / 07 minors)
    hanging_core: { re: 'hanging|toes-to-bar|knees-to-chest-hanging', penalty: -3, status: 'PROPOSED (F3, E-129)' },
    core_swaps_by_category: true,
    swaps_not_on_day: true,
    // R2-SES-01 (two spine days): an axial-high pick (barbell calf raise) stays off a day with no axial station (RECHECK 02 minor)
    axial_high_non_axial_day: -7,
    // PER-04 / RECHECK R02-16 (the second exposure is a different exercise): versions of one movement count as one in the week
    families: [
      { id: 'strict_pull_up', re: '^(strict-pull-up|pull-up-|wide-grip-pull-up|weighted-pull-up|l-sit-pull-up)' },
      { id: 'db_staggered_hinge', re: 'kickstand|staggered-stance|rear-foot-on-wall' },
      { id: 'lying_triceps', re: 'skullcrusher|tate-press|lying-triceps|french-press', lying: true },
      { id: 'reverse_fly', re: 'reverse-fly|rear-delt-pec-deck' },
      { id: 'sissy', re: 'sissy' },
      { id: 'side_plank', re: 'side-plank|star-side' },
      { id: 'front_plank', re: '^(plank|high-plank|plank-with|plank-shoulder|plank-db)' }
    ],
    family_penalty: -2.5, lying_week_max: 2,
    // VOL-12 (heavier, powerlifting-style compounds; RECHECK 07 minor): the work lifts are the canonical barbell lifts
    powerlifting_canonical: { lift_style: 'heavy_powerlifting', prefer: { RP_BKD: 'back-squat', RP_BHD: 'conventional|sumo-deadlift', RP_HPUSH: '^barbell-bench-press$' }, weight: 4, status: 'PROPOSED (F3, E-131)' },
    // COACH-R3 R3-SES-01 ('RDL + hip thrust + leg curl'; RECHECK 08 major: two single-leg hinges and two leg curls, no glute work)
    // (built, switched OFF: on the 2 x 45 pickleball sample the single-leg glute bridge counts as an isolation in the time model and the
    // volume engine's VOL-07 order then grows the leg curl past it and flattens the hips stairway - 10 -> 13 became 12 x 6 -> 14; open)
    glute_with_leg_curl: { enabled: false, re: 'hip-thrust|glute-bridge|step-up', weight: 5, racket_only: true, status: 'PROPOSED (F3, E-132): racket profiles (R3-ATH-02 knee-friendly strength); switched off - open' },
    // CAT-05 level ladder (RECHECK 05 major): above-ladder high-skill picks, or any above-ladder pick in a timed circuit, are fallbacks
    level_hard: { skills: ['high'], max_ladder: 'intermediate', circuit_any_above: true, refs: ['CAT-05'], status: 'PROPOSED (F3, E-130)' },
    // COACH-R3 R3-VOL-01 / R3-SES-01 (RECHECK 06 major / 02 minor): side raises for a side-delt / shoulders Focus, one side + one rear
    delt_variants: { side_focus_choices: ['side_delts', 'shoulders'], side_focus_keep_rear: 1, second_rear_to_side: true, refs: ['R3-VOL-01', 'R3-SES-01'], status: 'PROPOSED (F3, E-133)' },
    refs: ['R2-SES-01', 'R2-SES-03', 'R2-SES-05', 'PER-04', 'UNI-02', 'CAT-05', 'R3-VOL-01', 'R3-SES-01'],
    status: 'PROPOSED (F3): selection weights of fix round 1'
  };
  // the knee-dominant athlete hot spot (04 ACL_LANDING_CUTTING): no sissy squat as the quad isolation (deep loaded knee flexion, high skill;
  // RECHECK 02 minor: sissy squats twice a week for a 230-lb linebacker in a full gym) - INFERRED
  R.selection.hotspots = { ...R.selection.hotspots, ACL_LANDING_CUTTING: { avoid_tags: [], avoid_id_patterns: ['sissy'], prefer_tags: [], prefer_id_patterns: [] },
    // the low-back loading hot spot (04 LOW_BACK_LOADING: CrossFit class, football): the barbell row bent over at the hips loads the low
    // back a third time in the week (R2-SES-01 'load the spine once and correctly'; RECHECK 04 minor: a Yates row the day after the
    // deadlift) - a chest-supported or single-arm row instead (INFERRED)
    LOW_BACK_LOADING: { avoid_tags: [], avoid_id_patterns: ['^bent-over-barbell-row'], prefer_tags: ['chest_supported'], prefer_id_patterns: [] } };
  // VOL-12 'style moves big-compound reps (squat 3-6 vs 10-15)' (RECHECK 07 minor: 6-8 on the first lift only): two rep classes down
  if (R.reps.preference && R.reps.preference.heavy_powerlifting) R.reps.preference.heavy_powerlifting = { ...R.reps.preference.heavy_powerlifting, first_lift_of_day_shift: -2, f3_status: 'PROPOSED (F3, E-131): two classes (was -1)' };
  // a superset pair rests in numbers (VOL-14 'rest stated for every set'; RECHECK 02 / 06 minors: 'rest after the pair' with no time)
  R.rest = { ...R.rest, after_pair_numbers: true, after_pair_status: 'PROPOSED (F3, E-118): each item\'s own class rest; the pair rests the longest' };
  // an athlete's heavy two-legged compound keeps its own top rep (catalog rep hint, e.g. front squat 5-10) in every block (VOL-11
  // 'reps capped for this exercise'; RECHECK 02 minor: 7-10 in block 1, then 8-12 in block 2 under a printed 7-10 cap)
  R.reps.rep_hint = { ...R.reps.rep_hint, cap_max_compound_lte: 10, cap_max_status: 'PROPOSED (F3, E-124): athletes\' VOL phases only' };
  // the last stairway week's intensifier in a timed circuit (COACH-R3 R3-VOL-04 '1 + intensifiers in the last week'; RECHECK 05 major:
  // promised in the copy, carried by no station): the day's first big-group station ends its last round with a 10-s hold at the
  // hardest point - inside 1-3 RIR, never to failure
  // the late off-season's rep phase (COACH-ANSWER PER-11 'VOL 1 early 12-15, VOL 2 mid 8-12, VOL 3 late off-season / pre-season 6-8';
  // RECHECK 03 major: a 6-week late off-season stairway - one exercise block - held VOL2 8-12 for all six weeks): a single-block late
  // off-season stairway steps to VOL3 after its halfway week (the exercises stay; only the reps move, PER-02)
  // OFF by default: at the step the work lifts take their 3-6 min strength rest (VOL-14), and the time check, which sizes the block at
  // its peak week (E-82), then drops chest and calves from the soccer sample's 3 x 75 week (62 -> 42 sets) - a trade the coach decides
  R.reps.athlete_vol_phases = { ...R.reps.athlete_vol_phases, off_late_single_block_step: { enabled: false, from: 'VOL2', to: 'VOL3', at: 'after_halfway', refs: ['PER-11'], status: 'PROPOSED (F3, E-125): built, switched off - open question for the coach (minutes vs groups)' } };
  // the class strength table belongs to the class lifts (OBSERVED HALF TIME class split: STRENGTH = squat / press / deadlift; RECHECK 04
  // minor: a Yates row on 3 x 7 -> 4 x 4 the day after the deadlift)
  if (R.reps.class_levels) R.reps.class_levels = { ...R.reps.class_levels, strength_buckets: ['RP_BKD', 'RP_BHD', 'RP_VPUSH', 'RP_HPUSH'], strength_buckets_status: 'PROPOSED (F3, E-126)' };
  R.effort.circuit_intensifier = { enabled: true, kind: 'hold', per_day: 1, hold_s: 10, refs: ['R3-VOL-04', 'VOL-15'], status: 'PROPOSED (F3, E-119): the hold as the circuit intensifier' };
  return R;
}

/**
 * F3 exercise amendments (after amendExerciseB3): none yet.
 * @param {object} ex @returns {object}
 */
export function amendExerciseF3(ex) {
  return ex;
}

// ---------------------------------------------------------------------------------------------------------------- words

/** [key]: [en, es] - Spanish PROPOSED (neutral Latin American; coach ES review, D-64) */
export const UI_F3 = {
  // E-111: the minutes promise only when it is true (COACH-R3 R3-SES-02 'tell them up front'; RECHECK 01 / 02 / 03 / 04 / 06 / 08)
  'ui.plan.supersets_today_over': [
    'Even with the supersets marked today this day runs over your {min} min: use the extra supersets below, or switch off a block, to save more time.',
    'Incluso con las superseries marcadas hoy este día pasa de tus {min} min: usa las superseries extra de abajo, o desactiva un bloque, para ahorrar más tiempo.'
  ],
  'ui.plan.supersets_today_over_none': [
    'Even with the supersets marked today this day runs over your {min} min: switch off a block, or plan the extra minutes.',
    'Incluso con las superseries marcadas hoy este día pasa de tus {min} min: desactiva un bloque o planea los minutos extra.'
  ],
  'ui.plan.day_over': [
    'This day runs over your {min} min: use the supersets below, or switch off a block, to save time.',
    'Este día pasa de tus {min} min: usa las superseries de abajo, o desactiva un bloque, para ahorrar tiempo.'
  ],
  'ui.plan.day_over_none': [
    'This day runs over your {min} min: switch off a block, or plan the extra minutes.',
    'Este día pasa de tus {min} min: desactiva un bloque o planea los minutos extra.'
  ],
  'warning.supersets_needed_over': [
    'Do the marked supersets on {day} to save time: some weeks still run a few minutes over - each day shows its minutes and what else saves time.',
    'Haz las superseries marcadas el {day} para ahorrar tiempo: algunas semanas igual se pasan unos minutos; cada día muestra sus minutos y qué más ahorra tiempo.'
  ],
  'warning.test_day_long_tests': [
    'Test day ({day}, week {week}): about {min} min with the warm-up and the tests (you picked {limit})',
    'Día de prueba ({day}, semana {week}): unos {min} min con el calentamiento y las pruebas (elegiste {limit})'
  ],
  // E-112: every block the person can switch off, in their words (R3-SES-02; RECHECK 01 ... 07 minors); 'desactivar', not 'apagar'
  'ui.plan.edit_day': [
    'You can switch off these blocks today: {blocks}. You can also add or remove exercises.',
    'Hoy puedes desactivar (o quitar) estos bloques: {blocks}. También puedes agregar o quitar ejercicios.'
  ],
  'ui.plan.block_toggle_hint': ['You can switch off today\'s {blocks} block', 'Puedes desactivar el bloque de {blocks} de hoy'],
  'block.short.cooldown': ['walk after the workout', 'caminata después del entrenamiento'],
  'ui.plan.edit_aerobic_day': [
    'Optional: you can switch off this cardio session, or move it to another day.',
    'Opcional: puedes desactivar esta sesión de cardio o pasarla a otro día.'
  ],
  // E-113: the two-leg / single-leg advice follows the direction of the gap (RECHECK 01 / 02 / 03 / 04 / 06 / 07)
  'check.failed.V28_more_single': [
    'Your two-leg / single-leg mix is {share}% two-leg, against about {target}% for your goal: swap a two-leg exercise for a single-leg one of the same pattern if you want to match it.',
    'Tu mezcla de ejercicios a dos piernas / una pierna es {share}% a dos piernas, frente a cerca de {target}% para tu objetivo: cambia un ejercicio a dos piernas por uno a una pierna del mismo patrón si quieres igualarlo.'
  ],
  'check.failed.V28_more_two': [
    'Your two-leg / single-leg mix is {share}% two-leg, against about {target}% for your goal: swap a single-leg exercise for a two-leg one of the same pattern if you want to match it.',
    'Tu mezcla de ejercicios a dos piernas / una pierna es {share}% a dos piernas, frente a cerca de {target}% para tu objetivo: cambia un ejercicio a una pierna por uno a dos piernas del mismo patrón si quieres igualarlo.'
  ],
  // E-114: Focus vs bonus, the Focus muscles line, the profile label (R3-SES-01; RECHECK 01 / 02 / 03 / 06 / 07 / 08)
  'ui.plan.profile_label': ['Profile', 'Perfil'],
  'ui.plan.focus_add': ['(+{n} sets a week over the balanced plan, built into the stairway)', '(+{n} series por semana sobre el plan equilibrado, incluidas en la escalera)'],
  'note.pattern_kept': [
    'Keeps this movement in your week (2 sets, not counted toward your weekly sets).',
    'Mantiene este movimiento en tu semana (2 series, no cuentan para tus series semanales).'
  ],
  // E-115: the legal lines (R3-GEN-01; RECHECK 01 / 03 / 05 / 08 minors)
  'ui.plan.release_stamp_flat': ['Use at your own risk, terms and release accepted: {who}, {lang}', 'Uso bajo tu propio riesgo, términos y liberación de responsabilidad aceptados: {who}, en {lang}'],
  'release.who.client': ['client', 'cliente'],
  'release.who.coach': ['fitness professional', 'profesional del fitness'],
  'release.who.minor': ['a guardian for a minor', 'un tutor por un menor de edad'],
  'ui.plan.health_check_ok': ['Health check: answered; nothing in it asked for a doctor first.', 'Cuestionario de salud: respondido; nada indicó consultar primero a un médico.'],
  'ui.plan.parq_link': ['Official PAR-Q+ (in English)', 'PAR-Q+ oficial (en inglés)'],
  // E-116: the schedule says what is true (R3-VOL-04, R3-SES-01; RECHECK 01 / 04 / 05 / 07 / 08)
  'ui.plan.trained_directly_block': ['Trained directly (10+ sets a week, climbing through the block): {groups}', 'Se entrenan directamente (10+ series por semana, subiendo a lo largo del bloque): {groups}'],
  'ui.plan.schedule_fits_block': [
    'Your {days} x {minutes}-minute schedule holds the full plan: every muscle group trained directly, 10+ weekly sets, climbing through the block.',
    'Tu horario de {days} x {minutes} minutos alcanza para el plan completo: cada grupo muscular entrenado directamente, 10+ series por semana, subiendo a lo largo del bloque.'
  ],
  'ui.plan.calves_line': ['Calves: one exercise each leg day ({from} to {to} sets a week)', 'Pantorrillas: un ejercicio cada día de pierna (de {from} a {to} series por semana)'],
  'ui.plan.calves_line_flat': ['Calves: one exercise each leg day ({n} sets a week)', 'Pantorrillas: un ejercicio cada día de pierna ({n} series por semana)'],
  'ui.plan.trained_directly_circuit': ['Trained directly (10+ sets a week; the work per station climbs through the block): {groups}', 'Se entrenan directamente (10+ series por semana; el trabajo por estación sube a lo largo del bloque): {groups}'],
  'warning.time_lower_peak_block': [
    'Your {minutes}-minute sessions hold a lower peak for {group}: they still climb through the block, to fewer sets than the full plan.',
    'Tus sesiones de {minutes} minutos permiten un pico más bajo para {group}: igual suben a lo largo del bloque, hasta menos series que el plan completo.'
  ],
  'ui.plan.heavy_play_plan': [
    'You play 3 or more times a week: every week has half the jumps and no extra agility drills.',
    'Juegas 3 o más veces por semana: cada semana tiene la mitad de los saltos y ningún ejercicio extra de agilidad.'
  ],
  // E-117: the weekly sets table holds every group (RECHECK 01 / 04 / 08 minors)
  'ui.plan.sets_not_direct': ['- ({n})', '- ({n})'],
  'ui.plan.sets_class_lift': ['{n} (class lift)', '{n} (levantamiento de la clase)'],
  'ui.plan.weekly_sets_groups_note': [
    'Counted the coach\'s way: a set counts once for its group (hips = glutes + hamstrings; shoulders = front, side and rear delts); helpers 1/4 set; jumps, throws, sprints, swings and Olympic lifts never count. "-" = not trained directly (in brackets: the sets it still gets from other lifts or a kept movement, with no climb).',
    'Contado a la manera del coach: una serie cuenta una vez para su grupo (cadera = glúteos + isquiotibiales; hombros = deltoides anterior, lateral y posterior); ayudantes 1/4 de serie; saltos, lanzamientos, sprints, swings y olímpicos nunca cuentan. "-" = no se entrena directamente (entre paréntesis: las series que igual recibe de otros ejercicios o de un movimiento que se mantiene, sin subir).'
  ],
  // E-118: supersets in numbers, the leftover sets (VOL-14, ORD-05; RECHECK 02 / 06 minors)
  'rest.after_pair_seconds': ['rest {min}-{max} s after the pair', 'descansa {min}-{max} s después del par'],
  'ui.plan.superset_leftover': ['Then do its last {n} sets on their own', 'Luego haz sus últimas {n} series solas'],
  'ui.plan.superset_leftover_one': ['Then do its last set on its own', 'Luego haz su última serie sola'],
  // E-119: effort words (R3-VOL-04; RECHECK 01 ... 08)
  'effort.circuit_rir_one': ['pick a weight you could keep moving with about 1 rep left at the bell', 'elige un peso con el que podrías seguir con 1 repetición de sobra al sonar la alarma'],
  'effort.circuit_rir_bw_one': ['pick a version (or a tempo) you could keep going with about 1 rep left at the bell', 'elige una versión (o un ritmo) con la que podrías seguir con 1 repetición de sobra al sonar la alarma'],
  'effort.last_set.hold': ['last round: hold the hardest point for 10 s at the end', 'última ronda: sostén el punto más difícil 10 s al final'],
  'effort.drift_intensifier_days': [
    'Week {week}: one intensifier on each of these days ({days}): a MYO set on the day\'s last small-muscle or machine exercise.',
    'Semana {week}: un intensificador en cada uno de estos días ({days}): una serie MYO en el último ejercicio de músculo pequeño o de máquina del día.'
  ],
  'effort.drift_intensifier_days_circuit': [
    'Week {week}: one intensifier on each of these days ({days}): on the marked circuit stations, hold the hardest point for 10 s at the end of the last round.',
    'Semana {week}: un intensificador en cada uno de estos días ({days}): en las estaciones marcadas del circuito, sostén el punto más difícil 10 s al final de la última ronda.'
  ],
  'effort.intensifier_days': [
    'Last week: one intensifier on each of these days ({days}): a MYO set on the day\'s last small-muscle or machine exercise',
    'Última semana: un intensificador en cada uno de estos días ({days}): una serie MYO en el último ejercicio de músculo pequeño o de máquina del día'
  ],
  'effort.intensifier_days_circuit': [
    'Last week: one intensifier on each of these days ({days}): hold the hardest point for 10 s at the end of the last round on the marked stations',
    'Última semana: un intensificador en cada uno de estos días ({days}): sostén el punto más difícil 10 s al final de la última ronda en las estaciones marcadas'
  ],
  'effort.how_hard_no_int': [
    'How heavy? Each exercise tells you how many reps to leave in the tank: "leave 2 in the tank" means you could do 2 more reps at the end of the set (about RPE 8; 3 left = RPE 7, 1 left = RPE 9). Your plan starts with 3 in the tank, then 2, then 1-2, and ends at 1 in the last week. Week 1: start a little lighter, with a weight you could lift 2-3 more times.',
    '¿Cuánto peso? Cada ejercicio te dice cuántas repeticiones dejar en reserva: "deja 2 en reserva" significa que podrías hacer 2 repeticiones más al final de la serie (aproximadamente RPE 8; 3 en reserva = RPE 7, 1 en reserva = RPE 9). Tu plan empieza con 3 en reserva, luego 2, luego 1-2, y termina con 1 en la última semana. Semana 1: empieza un poco más ligero, con un peso que podrías levantar 2-3 veces más.'
  ],
  'instruction.1_bridge': [
    'This plan starts at {start} in the tank and ends at {end} in the last week: the coach\'s "1 in the tank" is where you finish, so follow each week\'s number.',
    'Este plan empieza con {start} en reserva y termina con {end} en la última semana: el "1 en reserva" del coach es donde terminas, así que sigue el número de cada semana.'
  ],
  'ui.plan.core_supersets_line': [
    'Core supersets are optional anywhere: you can pair a core exercise with any exercise to save time.',
    'Las superseries de core son opcionales en cualquier parte: puedes juntar un ejercicio de core con cualquier ejercicio para ahorrar tiempo.'
  ],
  // E-120: 'How to adjust this plan' (R3-VOL-02, R3-VOL-04; BRAIN §5.4c / §5.7; RECHECK 03 / 06 majors) - wording PROPOSED
  'guide.adjust.title': ['How to adjust this plan', 'Cómo ajustar este plan'],
  'guide.adjust.missed': [
    'Missed most of a week? Repeat that week before you move on. Missed one session? Do it on the next free day or let it go: never squeeze two sessions into one.',
    '¿Faltaste a la mayor parte de una semana? Repite esa semana antes de seguir. ¿Faltaste a una sesión? Hazla el siguiente día libre o déjala pasar: nunca juntes dos sesiones en una.'
  ],
  'guide.adjust.max': [
    'A set felt like a true max (no rep left)? Next time take one set off that exercise, or a little weight.',
    '¿Una serie se sintió como un máximo real (sin ninguna repetición de sobra)? La próxima vez quita una serie de ese ejercicio o un poco de peso.'
  ],
  'guide.adjust.easy': [
    'Everything feels easy? Add a little weight or a rep first; never jump ahead more than one week.',
    '¿Todo se siente fácil? Primero agrega un poco de peso o una repetición; nunca te adelantes más de una semana.'
  ],
  'guide.adjust.pain': [
    'Something hurts? First use a listed swap, then cut that exercise\'s sets by a third to a half, then drop it for the rest of the block. See a professional if it keeps hurting.',
    '¿Algo te duele? Primero usa uno de los cambios de la lista, luego quita entre un tercio y la mitad de las series de ese ejercicio y, si sigue, quítalo por el resto del bloque. Consulta a un profesional si el dolor sigue.'
  ],
  'guide.adjust.life': [
    'Life got in the way for several weeks (sick, travel, busy)? Stop the block, take the recommended easy week if you want, then build a new block.',
    '¿La vida se interpuso por varias semanas (enfermedad, viajes, trabajo)? Detén el bloque, toma la semana suave recomendada si quieres y luego crea un bloque nuevo.'
  ],
  'guide.adjust.edit': [
    'You (or your coach) can switch off a day\'s jumps, core or joint care, add or remove exercises (more rear-delt work, for example) and use the suggested supersets to save time.',
    'Tú (o tu entrenador) puedes desactivar los saltos, el core o el cuidado articular de un día, agregar o quitar ejercicios (por ejemplo, más trabajo de deltoides posterior) y usar las superseries sugeridas para ahorrar tiempo.'
  ],
  // E-121: the stairway words follow the halfway week (R3-VOL-04; RECHECK 02 / 05 / 06 minors)
  'plan.stairway_intro_half': [
    'Your plan climbs like a stairway: small steps up to week {half}, a bit bigger from week {next}, the hardest weeks at the end.',
    'Tu plan sube como una escalera: pasos pequeños hasta la semana {half}, un poco más grandes desde la semana {next}, y las semanas más duras al final.'
  ],
  'plan.phase.DRIVE': ['Driving it', 'Subiendo el ritmo'],
  // E-122: change lines per FOCUS group (R3-SES-01; RECHECK 01 / 02 / 04 / 07 / 08 minors)
  'changes.held_group': ['{group}: no new set this week (to fit your sessions) - add a little load or a rep', '{group}: sin serie nueva esta semana (para caber en tus sesiones): agrega un poco de peso o una repetición'],
  'changes.at_target_group': ['{group}: at this plan\'s set target - add a little load or a rep', '{group}: en la meta de series de este plan: agrega un poco de peso o una repetición'],
  // E-123: smaller copy fixes (RECHECK 02 / 03 / 04 / 05 / 07 / 08 minors)
  'note.rep_cap': ['Keep this lift at {min}-{max} reps.', 'Mantén este ejercicio en {min}-{max} repeticiones.'],
  'ui.plan.reminder': ['Test dates (mark your calendar; the plan sends no reminders): {dates}', 'Fechas de prueba (anótalas en tu calendario; el plan no envía recordatorios): {dates}'],
  'plan.next.block_choice': [
    'you choose: next block (an easy week first is recommended, not required), maintenance, or a new plan',
    'tú eliges: siguiente bloque (se recomienda una semana suave antes, no es obligatoria), mantenimiento o un plan nuevo'
  ],
  'note.cardio_options': ['Or use another of your cardio tools: {list}. Go by time, not distance.', 'O usa otra de tus opciones de cardio: {list}. Guíate por el tiempo, no por la distancia.'],
  'season.OFF_LATE': ['Late off-season', 'Fase final fuera de temporada'],
  'ui.plan.label_part.arms': ['arms', 'brazos'],
  // selection why-codes (E-127 ... E-133)
  'why.non_spinal_hinge': ['The second hinge day is a non-spinal hinge (hip thrust, back extension, reverse hyper): the low back is loaded once a week', 'El segundo día de bisagra es una bisagra sin carga en la columna (hip thrust, extensión de espalda, hiperextensión inversa): la zona lumbar se carga una vez por semana'],
  'why.core_low_back': ['Core opener for your low back: anti-extension and anti-rotation first', 'Core inicial para tu zona lumbar: primero anti-extensión y anti-rotación'],
  'why.delt_variant': ['Shoulders are one group (front, side and rear delts): this station trains the part your plan needs', 'Los hombros son un grupo (deltoides anterior, lateral y posterior): esta estación entrena la parte que tu plan necesita']
};

/** UI_F3 keys that replace an earlier string of the same key */
export const F3_FINAL = ['ui.plan.edit_day', 'ui.plan.block_toggle_hint', 'ui.plan.weekly_sets_groups_note', 'plan.phase.DRIVE', 'note.rep_cap', 'ui.plan.reminder',
  'plan.next.block_choice', 'note.cardio_options', 'season.OFF_LATE'];

/** names / profile names / day labels F3 rewrites (applied after the exercise, profile and day names, like EXERCISE_TEXT_B3):
 *  [en|null, es|null] */
export const TEXT_F3 = {
  // RECHECK 04 minor: '(HALF TIME)' is the coach's sheet name, not the client's
  'profile.crossfit_class.name': ['CrossFit - class member', 'CrossFit - miembro de clase'],
  // RECHECK 05 minor: 'presses' untranslated; the rear-foot-on-wall RDL is not a kickstand RDL (R2-GEN-08: English gym term in brackets)
  'day.fat_loss_bootcamp.3.BC2': [null, 'Bootcamp 2 - bisagra + empujes (press)'],
  'day.fat_loss_bootcamp.6.BC2': [null, 'Bootcamp 2 - bisagra + empujes (press)'],
  'day.no_equipment.3.BC2_BW': [null, 'Bootcamp 2 - bisagra + empujes (press) (peso corporal)'],
  'day.no_equipment.6.BC2_BW': [null, 'Bootcamp 2 - bisagra + empujes (press) (peso corporal)'],
  'exercise.rear-foot-on-wall-db-deadlift-rdl.name': [null, 'Peso muerto rumano con mancuernas y pie trasero en la pared (Rear-Foot-on-Wall RDL)']
};

/** ES lines the coach should review first (es_review.priority_review; RECHECK 03 / 05 minors) */
export const ES_PRIORITY_F3 = ['season.OFF_LATE', 'plan.phase.DRIVE', 'note.cardio_options', 'ui.plan.edit_day', 'ui.plan.release_stamp_flat', 'warning.test_day_long_tests',
  'day.fat_loss_bootcamp.3.BC2', 'exercise.rear-foot-on-wall-db-deadlift-rdl.name', 'guide.adjust.title', 'guide.adjust.missed', 'guide.adjust.max', 'guide.adjust.easy',
  'guide.adjust.pain', 'guide.adjust.life', 'guide.adjust.edit', 'instruction.1_bridge'];
