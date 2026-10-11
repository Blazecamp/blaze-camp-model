// tools/fixture/v05-words.mjs - engine 0.5.0, work package V3 (words and checks). Applied after v05-library.mjs by BOTH builds
// (tools/fixture/build-fixture.mjs and tools/compile-model.mjs), so model/rules.json keeps deep-equalling the fixture rules
// (tests/compile.test.mjs). Pure functions of their input (deterministic, no clock). Every value names its source: COACH-R4
// (coach_answers_round4.md), COACH-CT (coach_answers_time_2026-10-10.md), COACH-CX (coach_answers_codex_2026-10-10.md), an
// earlier coach answer, INFERRED or PROPOSED. Binding plan: design/ENGINE_V05_PLAN.md ("V3 words and checks"); decisions:
// engine/DECISIONS.md section G (G-37 ...).
//
// What V3 changes in the model:
//   * THE LIABILITY GATE (COACH-R4 R4-SCP-01 / R4-SCP-02): accepting the terms and the release is REQUIRED before a plan is
//     generated (rules.legal.gate), the plan's release stamp says it was accepted, and a short release line is printed on every
//     plan - on top and at the bottom of every view, in English and Spanish, linking DISCLAIMER.md / DISCLAIMER.es.md
//     (rules.legal.release_line). The wording is PROPOSED and, like the rest of the legal copy, a draft for attorney review.
//   * PROGRESSION AS A RULE THE PERSON APPLIES (R4-PRG-03, CX-02 / CX-03): rules.render.progression - "3 sets of 8-12. When you
//     hit 12 on every set with 1-2 reps left in the tank, add weight next time and start again at 8." Never a promised number.
//   * THE ACCELERATION NOTE (R4-PRG-02): a week that adds more than about 15 % is marked and said (rules.render.acceleration).
//   * THE TIME ESTIMATE IS INFORMATION ONLY (CT-01, R4-SES-01): printed as an average range (rules.render.estimate).
//   * EASY-TO-REMOVE HINTS (R4-SES-04): rules.render.easy_to_remove - the day names what is easiest to remove, nothing is removed.
//   * THE WEEKLY SETS PER GROUP TABLE, week by week, and the block / week / day macro views (R2-GEN-02): rules.render.views.
//   * THE v0.5 CHECK LIST: rules.validation.checks gains V30 ... V37 (template skeleton, optional add-ons, incline first, no
//     third-party video links, the progression rule, the acceleration note, nothing removed automatically, carries by distance
//     or time); V13, V15, V21, V22 are worded for v0.5. No check reads minutes.
//   * WORDS: the dead time-fitting words that outlived V1 are deleted (REMOVED_V3); the Spanish of the plan-facing lines is
//     reviewed for natural neutral Latin American wording with the English gym term in brackets (ES_REVIEW_V3, R2-GEN-08).

const clone = (o) => JSON.parse(JSON.stringify(o));
const uniqSorted = (a) => [...new Set(a)].sort();

/** the v0.5 checks this package adds: [id, key, severity, what it holds] */
export const CHECKS_V3 = [
  ['V30', 'check.v30_template_skeleton', 'error', 'a day built to one of the coach\'s skeletons holds his slots in his order, every lift of the pattern its slot names, and every counted lift of the template - nothing dropped (R4-SES-05, R4-SES-04)'],
  ['V31', 'check.v31_addons_optional', 'error', 'an optional add-on (or a proposed record) is never a template pick; wall balls and sled pushes only in HYROX station circuits and the CrossFit-style class WOD (R4-LIB-01)'],
  ['V32', 'check.v32_incline_first', 'warn', 'bodybuilding and general-population plans bias incline pressing in the vertical / mid-range push slot when the kit holds an incline press (R4-LIB-03)'],
  ['V33', 'check.v33_video_search', 'error', 'no third-party video link anywhere in the plan: a YouTube search built from the exercise name, or the coach\'s own video (R4-LIB-05)'],
  ['V34', 'check.v34_progression_rule', 'error', 'reps and load progress as a rule the person applies: every set-and-rep lift carries its rule and no item promises a number per week (R4-PRG-03)'],
  ['V35', 'check.v35_acceleration_note', 'error', 'a week that adds more than about 15 % for a muscle group carries the acceleration note (R4-PRG-02)'],
  ['V36', 'check.v36_easy_to_remove', 'error', 'nothing is removed automatically: the day only names what is easiest to remove, never the core block, a main lift or the first athletic station (R4-SES-04)'],
  ['V37', 'check.v37_carry_dose', 'error', 'carries and sled work: 2-4 trips of 20-40 m or 20-40 s, no muscle-set credit (R4-LIB-02)']
];

/** the v0.5 reading of checks that keep their id (documentation next to the check; the code is engine/validate.mjs) */
const CHECK_NOTES_V3 = {
  V13: 'session size by exercise count: a generated day holds at most the range maximum (R4-SES-02); no minutes are read anywhere',
  V21: 'the liability gate: an ok plan carries a release stamp that says the terms and the release were accepted, of the version its role and age ask for, and the release line can be printed in English and Spanish with its link (R4-SCP-01, R4-SCP-02)'
};

// ---------------------------------------------------------------------------------------------------------------------------
// rules
// ---------------------------------------------------------------------------------------------------------------------------

/**
 * v0.5 / V3 rule amendments (after amendRulesV2).
 * @param {object} rules @returns {object}
 */
export function amendRulesV3(rules) {
  const R = clone(rules);

  // ---- R4-SCP-01 / R4-SCP-02: the liability gate and the printed release line
  R.legal = { ...R.legal,
    gate: {
      required: true, field: 'release.accepted', before: 'plan_generated', applies_to: 'everyone',
      without_it: { status: 'invalid', error: 'release_missing', weeks: 0 },
      stamp: { field: 'release_stamp', accepted: true },
      refs: ['R4-SCP-01', 'R4-SCP-02', 'R3-GEN-01', 'R2-GEN-03'],
      status: 'approved (R4-SCP-02 "they need to click it before the plan shows"; R4-SCP-01 "all the plans should release liability before and after it gets kicked out")'
    },
    release_line: {
      label_key: 'ui.plan.own_risk_label', link_key: 'ui.plan.own_risk_link',
      by_version: { 'release.client': 'ui.plan.release_line', 'release.coach': 'ui.plan.release_line_coach', 'release.minor': 'ui.plan.release_line_minor' },
      short_key: 'ui.plan.release_line_short', footer_key: 'ui.plan.release_footer', no_plan_key: 'ui.plan.own_risk',
      positions: ['top', 'bottom'], views: ['full', 'overview', 'block', 'week', 'day'], langs: ['en', 'es'],
      files: { en: 'DISCLAIMER.md', es: 'DISCLAIMER.es.md' },
      refs: ['R4-SCP-01', 'R4-SCP-02'],
      status: 'approved rule (R4-SCP-02 "outputted in their program somewhere at the bottom or at the top: you\'ve released liability"); PROPOSED wording, a draft for attorney review like DISCLAIMER.md'
    },
    refs: uniqSorted([...(R.legal.refs || []), 'R4-SCP-01', 'R4-SCP-02']),
    status: 'COACH-R3 R3-GEN-01 and COACH-R4 R4-SCP-01 / R4-SCP-02 approved; release text DRAFT for attorney review'
  };

  // ---- how the plan is printed (V3)
  const note = (R.stairway.progression && R.stairway.progression.note_above) || 0.15;
  R.render = { ...(R.render || {}),
    // R4-PRG-03: rep and load progress is a rule the person applies; render writes it from item.progression
    progression: {
      section: true, per_item: true, promised_numbers: false,
      keys: { double_progression: 'ui.plan.progress.double', load_when_all_sets_done: 'ui.plan.progress.fixed', written_reps: 'ui.plan.progress.written' },
      per_side_suffix: '_side',
      rir_default: '1-2',
      refs: ['R4-PRG-03', 'CX-02', 'CX-03', 'R4-PRG-04'],
      status: 'approved (R4-PRG-03): "3 sets of 8-12. When you hit 12 on every set with 1-2 reps left in the tank, add weight next time and start again at 8." Never a promised number per week. PROPOSED: the wording of the fixed-rep and written-rep (pyramid) lines'
    },
    // R4-PRG-02: the note on a week that adds more than about 15 %
    acceleration: { mark: '↑', above: note, refs: ['R4-PRG-02'], status: 'approved (R4-PRG-02): no hard limit, a clear note; PROPOSED: the mark' },
    // CT-01 / R4-SES-01: the estimate is information - printed as an average range
    estimate: {
      information_only: true, range_factor: [0.9, 1.1], round_to_min: 5,
      refs: ['CT-01', 'R4-SES-01'],
      status: 'approved (R4-SES-01 "an estimate like about 60-75 minutes on each day, as information only"); PROPOSED: the width of the range (10 % each way, rounded to 5 min)'
    },
    // R4-SES-04: what the day names as easiest to remove (never removed for the person)
    easy_to_remove: {
      max_listed: 6,
      kind_keys: { conditioning_finisher: 'ui.plan.easy_kind.conditioning_finisher', extra_athletic_station: 'ui.plan.easy_kind.extra_athletic_station', small_muscle_accessory: 'ui.plan.easy_kind.small_muscle_accessory', bonus_exercise: 'ui.plan.easy_kind.bonus_exercise' },
      refs: ['R4-SES-04'], status: 'approved (R4-SES-04): the person picks; the plan only names the easiest'
    },
    // the macro views (R2-GEN-02 "the macro view of the week, the macro view of the block, and the macro view per day")
    views: {
      list: ['full', 'overview', 'block', 'week', 'day'], macro: ['block', 'week', 'day'],
      weekly_sets_by_week: true,
      refs: ['R2-GEN-02', 'CX-04'], status: 'approved direction (R2-GEN-02); PROPOSED: the layout of each table'
    },
    refs: uniqSorted([...((R.render && R.render.refs) || []), 'R4-PRG-02', 'R4-PRG-03', 'R4-SES-04', 'CT-01', 'R4-SES-01', 'R4-SCP-01', 'R4-SCP-02', 'R2-GEN-02'])
  };

  // ---- the v0.5 check list
  const V = R.validation;
  V.checks = V.checks.filter((c) => !CHECKS_V3.some(([id]) => id === c.id)).map((c) => (CHECK_NOTES_V3[c.id] ? { ...c, v05: CHECK_NOTES_V3[c.id] } : c));
  for (const [id, key, severity, what] of CHECKS_V3) V.checks.push({ id, key, severity, v05: what });
  V.v05 = {
    // what each v0.5 rule is checked by (design/ENGINE_V05_PLAN.md "V3 words and checks")
    by_rule: {
      no_time_fitting: ['V3'], template_skeleton: ['V30'], exercise_count: ['V13'], final_target_reached: ['V15', 'H10'],
      arrival_one_week_early_at_most: ['V15', 'H10'], floor_from_3_days: ['V22', 'H17'], two_day_rule: ['V22', 'H17'],
      addons_optional_only: ['V31'], incline_first: ['V32'], liability_gate: ['V21', 'H20'], no_video_urls: ['V33'],
      progression_rule: ['V34'], acceleration_note: ['V35'], nothing_removed_automatically: ['V30', 'V36'], carry_dose: ['V37']
    },
    skeleton: {
      // the pattern a template slot names (R4-SES-05: A = pull + knee dominant, B = push + hip dominant); a pick may change the
      // bucket inside its pattern (the laterality dial, a kit stand-in), never the pattern
      pattern_of_bucket: {
        RP_BKD: 'knee', RP_UKD: 'knee', ISO_QUAD: 'knee', RP_BHD: 'hip', RP_UHD: 'hip', ISO_LEG_FLEXION: 'hip',
        RP_HPULL: 'pull', RP_VPULL: 'pull', RP_HPUSH: 'push', RP_VPUSH: 'push', ISO_CHEST: 'push'
      },
      lift_blocks: ['strength', 'accessories'],
      ordered_bucket_prefix: 'RP_',
      complete_in_block_types: ['stairway'],
      not_required_buckets: ['FOCUS'],
      absent_ok_whys: ['why.left_out_exclusion', 'why.pain_cut', 'why.play_spacing', 'why.older_default'],
      refs: ['R4-SES-05', 'R4-SES-04'],
      status: 'approved rule (R4-SES-05, R4-SES-04); INFERRED: the reasons a station may be absent are the ones the plan already says on the day'
    },
    incline: { majority: 0.5, not_roles: ['work'], not_block_kinds: ['circuit'], not_flags: ['pain_swap'], refs: ['R4-LIB-03', 'VOL-03'], status: 'approved rule (R4-LIB-03 "bias incline pressing ... overhead stays, we should have that variability"); PROPOSED: read as at least half of the slot\'s picks over a training block' },
    video: { forbidden_re: 'youtu\\.be/|youtube\\.com/(watch|shorts|embed)|vimeo\\.com|instagram\\.com|tiktok\\.com|facebook\\.com', refs: ['R4-LIB-05'] },
    refs: ['CT-01', 'R4-SES-01', 'R4-SES-02', 'R4-SES-03', 'R4-SES-04', 'R4-SES-05', 'R4-PRG-01', 'R4-PRG-02', 'R4-PRG-03', 'R4-LIB-01', 'R4-LIB-02', 'R4-LIB-03', 'R4-LIB-05', 'R4-SCP-01', 'R4-SCP-02', 'CX-01']
  };
  return R;
}

// ---------------------------------------------------------------------------------------------------------------------------
// words (EN, ES). Every Spanish line is PROPOSED until the coach approves it (R2-GEN-08).
// ---------------------------------------------------------------------------------------------------------------------------

export const UI_V3 = {
  // ---- R4-SCP-01 / R4-SCP-02: the release line (a draft for attorney review, like DISCLAIMER.md)
  'ui.plan.release_line': ['You accepted the terms and released Lalo Vera, Blaze Camp and BFit Studios Corp. from all liability before this plan was built. You follow it entirely at your own risk. It is general fitness information, not medical advice: stop and see a professional if something hurts.', 'Aceptaste los términos y liberaste de toda responsabilidad a Lalo Vera, Blaze Camp y BFit Studios Corp. antes de que se creara este plan. Lo sigues por completo bajo tu propio riesgo. Es información general de acondicionamiento físico, no un consejo médico: detente y consulta a un profesional si algo te duele.'],
  'ui.plan.release_line_coach': ['A fitness professional built this plan and, before it was built, accepted the terms and released Lalo Vera, Blaze Camp and BFit Studios Corp. from all liability. The professional is responsible for the client\'s own health screening and release. General fitness information, not medical advice: stop and see a professional if something hurts.', 'Un profesional del fitness creó este plan y, antes de crearlo, aceptó los términos y liberó de toda responsabilidad a Lalo Vera, Blaze Camp y BFit Studios Corp. Ese profesional es responsable de la evaluación de salud y de la liberación de responsabilidad de su cliente. Es información general de acondicionamiento físico, no un consejo médico: detente y consulta a un profesional si algo te duele.'],
  'ui.plan.release_line_minor': ['A parent or legal guardian accepted the terms and released Lalo Vera, Blaze Camp and BFit Studios Corp. from all liability before this plan was built. A minor follows it under the supervision of a parent or guardian and a qualified coach, at their own risk. General fitness information, not medical advice: stop and see a professional if something hurts.', 'El padre, la madre o el tutor legal aceptó los términos y liberó de toda responsabilidad a Lalo Vera, Blaze Camp y BFit Studios Corp. antes de que se creara este plan. Un menor de edad lo sigue bajo la supervisión de su padre, madre o tutor y de un entrenador calificado, bajo su propio riesgo. Es información general de acondicionamiento físico, no un consejo médico: detente y consulta a un profesional si algo te duele.'],
  'ui.plan.release_line_short': ['Liability released before this plan was built: use it at your own risk. Not medical advice.', 'Responsabilidad liberada antes de crear este plan: úsalo bajo tu propio riesgo. No es un consejo médico.'],
  'ui.plan.release_footer': ['Liability released: the terms and the release were accepted before this plan was built.', 'Responsabilidad liberada: los términos y la liberación de responsabilidad se aceptaron antes de crear este plan.'],
  'ui.plan.own_risk_link': ['Read the full disclaimer and release', 'Lee el aviso legal y la liberación de responsabilidad completos'],
  'warning.release_missing': ['Read and accept the terms and the release of liability first. No plan is built without it.', 'Primero lee y acepta los términos y la liberación de responsabilidad. Sin eso no se crea ningún plan.'],
  'ui.plan.release_stamp_flat': ['Terms and release of liability accepted before this plan was built: {who}, {lang}', 'Términos y liberación de responsabilidad aceptados antes de crear este plan: {who}, en {lang}'],

  // ---- R4-PRG-03: progression as a rule the person applies
  'ui.plan.progress_title': ['How you progress', 'Cómo progresas'],
  'ui.plan.progress_rule': ['Reps and weight follow a rule you apply yourself, not a number this plan promises. Every lift shows a rep range. Example from your plan: {exercise}, {sets} sets of {low}-{high}. When you hit {high} on every set with the planned reps left in the tank and good form, add weight next time and start again at {low}. Not there yet? Keep the weight and add a rep where you can.', 'Las repeticiones y el peso siguen una regla que aplicas tú, no un número que este plan prometa. Cada ejercicio trae un rango de repeticiones. Ejemplo de tu plan: {exercise}, {sets} series de {low}-{high}. Cuando llegues a {high} en todas las series, con las repeticiones en reserva planeadas y buena técnica, sube el peso la próxima vez y vuelve a empezar en {low}. ¿Todavía no llegas? Mantén el peso y agrega una repetición donde puedas.'],
  'ui.plan.progress_rule_plain': ['Reps and weight follow a rule you apply yourself, not a number this plan promises: when every set of a lift reaches the top of its reps with the planned reps left in the tank and good form, add weight next time.', 'Las repeticiones y el peso siguen una regla que aplicas tú, no un número que este plan prometa: cuando todas las series de un ejercicio lleguen al tope de sus repeticiones, con las repeticiones en reserva planeadas y buena técnica, sube el peso la próxima vez.'],
  'ui.plan.progress_sets': ['Sets follow the stairway: the plan adds sets week by week until each muscle group reaches its final sets in the last week (see the week-by-week table). In a week with the same sets as the week before, you progress with reps or weight.', 'Las series siguen la escalera: el plan agrega series semana a semana hasta que cada grupo muscular llega a sus series finales en la última semana (mira la tabla semana a semana). En una semana con las mismas series que la anterior, progresas con repeticiones o peso.'],
  'ui.plan.progress_sets_flat': ['The sets stay the same through this plan: you progress with reps or weight.', 'Las series se mantienen iguales durante este plan: progresas con repeticiones o peso.'],
  'ui.plan.progress_circuit': ['Circuits: the rounds stay and the work time per station climbs week by week. Add a little weight only when you finish a station with more reps left in the tank than planned.', 'Circuitos: las rondas se mantienen y el tiempo de trabajo por estación sube semana a semana. Agrega un poco de peso solo cuando termines una estación con más repeticiones en reserva de las planeadas.'],
  'ui.plan.progress_accel': ['Weeks {weeks} add more than usual (over about {pct} % more sets for a muscle group, or in total). They are marked {mark}: adjust if needed.', 'Las semanas {weeks} suben más de lo habitual (más de un {pct} % de series para un grupo muscular, o en total). Están marcadas con {mark}: ajusta si hace falta.'],
  'ui.plan.progress_accel_one': ['Week {weeks} adds more than usual (over about {pct} % more sets for a muscle group, or in total). It is marked {mark}: adjust if needed.', 'La semana {weeks} sube más de lo habitual (más de un {pct} % de series para un grupo muscular, o en total). Está marcada con {mark}: ajusta si hace falta.'],
  'ui.plan.progress_next': ['Your next block starts a little above where this one started (about {pct} % more sets, in whole sets), never above the top number for your level. At the top, the sets stay and you progress with weight and reps.', 'Tu siguiente bloque empieza un poco por encima de donde empezó este (cerca de un {pct} % más de series, en series enteras), nunca por encima del número máximo de tu nivel. En el máximo, las series se mantienen y progresas con peso y repeticiones.'],
  'ui.plan.progress_edit': ['This plan is a template you can edit: change the sets of any exercise on any day or week, add or remove exercises, and switch blocks off.', 'Este plan es una plantilla que puedes editar: cambia las series de cualquier ejercicio en cualquier día o semana, agrega o quita ejercicios y desactiva bloques.'],
  'ui.plan.progress.double': ['Progress: when you hit {high} on every set with {rir} left in the tank, add weight next time and start again at {low}.', 'Progresión: cuando llegues a {high} en todas las series con {rir} en reserva, sube el peso la próxima vez y vuelve a empezar en {low}.'],
  'ui.plan.progress.double_side': ['Progress: when you hit {high} per side on every set with {rir} left in the tank, add weight next time and start again at {low}.', 'Progresión: cuando llegues a {high} por lado en todas las series con {rir} en reserva, sube el peso la próxima vez y vuelve a empezar en {low}.'],
  'ui.plan.progress.fixed': ['Progress: when you hit {high} on every set with {rir} left in the tank, add weight next time.', 'Progresión: cuando llegues a {high} en todas las series con {rir} en reserva, sube el peso la próxima vez.'],
  'ui.plan.progress.fixed_side': ['Progress: when you hit {high} per side on every set with {rir} left in the tank, add weight next time.', 'Progresión: cuando llegues a {high} por lado en todas las series con {rir} en reserva, sube el peso la próxima vez.'],
  'ui.plan.progress.written': ['Progress: when you hit the written reps on every set with {rir} left in the tank, add weight next time.', 'Progresión: cuando llegues a las repeticiones indicadas en todas las series con {rir} en reserva, sube el peso la próxima vez.'],

  // ---- R4-PRG-02: the acceleration note
  'ui.plan.accel_week': ['This week jumps more than usual ({pct} % more sets for {group}): adjust if needed.', 'Esta semana sube más de lo habitual ({pct} % más series para {group}): ajusta si hace falta.'],
  'ui.plan.accel_week_total': ['This week jumps more than usual ({pct} % more sets in total): adjust if needed.', 'Esta semana sube más de lo habitual ({pct} % más series en total): ajusta si hace falta.'],
  'ui.plan.accel_legend': ['{mark} = a week that adds more than usual: adjust if needed.', '{mark} = una semana que sube más de lo habitual: ajusta si hace falta.'],

  // ---- CT-01 / R4-SES-01: the time estimate, information only
  'ui.plan.est_range': ['about {low}-{high} min', 'aprox. {low}-{high} min'],
  'ui.plan.est_line': ['Average time: about {low}-{high} min (an estimate, for information only)', 'Tiempo promedio: aprox. {low}-{high} min (un estimado, solo como información)'],
  'ui.plan.est_line_one': ['Average time: about {min} min (an estimate, for information only)', 'Tiempo promedio: aprox. {min} min (un estimado, solo como información)'],
  'guide.adjust.time': ['The time shown on each day is an average estimate, for information only: nothing in this plan is cut or changed because of time. Want a shorter day? Use the suggested supersets, or remove what the day lists as easiest to remove.', 'El tiempo que aparece en cada día es un estimado promedio, solo como información: nada de este plan se recorta ni se cambia por tiempo. ¿Quieres un día más corto? Usa las superseries sugeridas o quita lo que el día marca como más fácil de quitar.'],
  'guide.adjust.time_no_list': ['The time shown on each day is an average estimate, for information only: nothing in this plan is cut or changed because of time.', 'El tiempo que aparece en cada día es un estimado promedio, solo como información: nada de este plan se recorta ni se cambia por tiempo.'],
  'guide.adjust.sets': ['You (or your coach) can also change the sets of any exercise on any day or week: the plan is a template.', 'Tú (o tu entrenador) también puedes cambiar las series de cualquier ejercicio en cualquier día o semana: el plan es una plantilla.'],

  // ---- R4-SES-04: what is easiest to remove (the person picks)
  'ui.plan.easy_to_remove_line': ['Easiest to remove if you want a shorter day (your choice): {list}', 'Lo más fácil de quitar si quieres un día más corto (tú decides): {list}'],
  'ui.plan.easy_kind.conditioning_finisher': ['finisher', 'cierre de acondicionamiento (finisher)'],
  'ui.plan.easy_kind.extra_athletic_station': ['extra jump / throw stations', 'estaciones extra de saltos / lanzamientos'],
  'ui.plan.easy_kind.small_muscle_accessory': ['small-muscle accessories', 'accesorios de músculos pequeños'],
  'ui.plan.easy_kind.bonus_exercise': ['bonus exercises', 'ejercicios extra'],
  'ui.plan.easy_more': ['{n} more', '{n} más'],

  // ---- the weekly sets per group table, week by week; macro views (R2-GEN-02)
  'ui.plan.sets_by_week_title': ['Weekly sets per muscle group, week by week', 'Series semanales por grupo muscular, semana a semana'],
  'ui.plan.sets_by_week_note': ['Counted from this plan\'s exercises, one number per week (a dot separates the exercise blocks). "Final sets" is where the stairway is planned to end; "{held} of {planned}" means this template\'s exercises hold {held} of the {planned} planned sets.', 'Contado con los ejercicios de este plan, un número por semana (un punto separa los bloques de ejercicios). "Series finales" es donde está planeado que termine la escalera; "{held} de {planned}" significa que los ejercicios de esta plantilla alcanzan {held} de las {planned} series planeadas.'],
  'ui.plan.sets_by_week_note_plain': ['Counted from this plan\'s exercises, one number per week (a dot separates the exercise blocks). "Final sets" is where the stairway is planned to end.', 'Contado con los ejercicios de este plan, un número por semana (un punto separa los bloques de ejercicios). "Series finales" es donde está planeado que termine la escalera.'],
  'ui.plan.sets_by_week_note_flat': ['Counted from this plan\'s exercises, one number per week (a dot separates the exercise blocks).', 'Contado con los ejercicios de este plan, un número por semana (un punto separa los bloques de ejercicios).'],
  'ui.plan.col.group': ['Muscle group', 'Grupo muscular'],
  'ui.plan.col.sets_by_week': ['Sets each week (weeks {from}-{to})', 'Series por semana (semanas {from}-{to})'],
  'ui.plan.col.final_sets': ['Final sets', 'Series finales'],
  'ui.plan.final_capped': ['{held} of {planned}', '{held} de {planned}'],
  'ui.plan.final_credit_only': ['no exercise of its own', 'sin ejercicio propio'],
  'ui.plan.sets_this_week': ['Sets this week', 'Series de esta semana'],
  'ui.plan.week_macro': ['Week {n} overview', 'Resumen de la semana {n}'],

  'ui.plan.weekly_sets_groups_note': ['Counted the coach\'s way: a set counts once for its group (hips = glutes + hamstrings; shoulders = front, side and rear delts); helpers 1/4 set; jumps, throws, sprints, swings, carries and Olympic lifts never count. "-" = no exercise of its own in this plan (in brackets: the sets it still gets from the other lifts).', 'Contado a la manera del coach: una serie cuenta una vez para su grupo (cadera = glúteos + isquiotibiales; hombros = deltoides anterior, lateral y posterior); los músculos de apoyo cuentan 1/4 de serie; los saltos, lanzamientos, sprints, swings, caminatas con carga y levantamientos olímpicos nunca cuentan. "-" = sin ejercicio propio en este plan (entre paréntesis: las series que igual recibe de los otros ejercicios).'],
  // ---- the v0.5 checks
  'check.v13_caps': ['Session size: no more exercises than the client type\'s range (and the absolute set cap)', 'Tamaño de la sesión: no más ejercicios que el rango del tipo de cliente (y el tope absoluto de series)'],
  'check.v21_release': ['Terms and release of liability accepted before the plan was built', 'Términos y liberación de responsabilidad aceptados antes de crear el plan'],
  'check.h20_release': ['Liability gate: no plan without the accepted release', 'Requisito de responsabilidad: no hay plan sin la liberación aceptada'],
  'check.v30_template_skeleton': ['The coach\'s template: his slots in his order, nothing dropped', 'La plantilla del coach: sus posiciones en su orden, sin quitar nada'],
  'check.v31_addons_optional': ['Optional add-ons are never a template pick', 'Los extras opcionales nunca son una elección de la plantilla'],
  'check.v32_incline_first': ['Incline pressing first in the vertical / mid-range push slot', 'Primero el press inclinado en la posición de empuje vertical / de rango medio'],
  'check.v33_video_search': ['No third-party video links: a YouTube search by exercise name', 'Sin enlaces a videos de terceros: una búsqueda en YouTube por nombre del ejercicio'],
  'check.v34_progression_rule': ['Reps and weight progress by a rule the person applies, never a promised number', 'Las repeticiones y el peso progresan con una regla que aplica la persona, nunca con un número prometido'],
  'check.v35_acceleration_note': ['A week that adds more than about 15 % carries a note', 'Una semana que sube más de un 15 % aproximadamente lleva una nota'],
  'check.v36_easy_to_remove': ['Nothing is removed automatically: the day only names what is easiest to remove', 'Nada se quita automáticamente: el día solo marca lo más fácil de quitar'],
  'check.v37_carry_dose': ['Carries and sled work by distance or time, no muscle sets', 'Caminatas con carga y trineo por distancia o tiempo, sin series musculares'],
  'check.failed.V32': ['Most of this plan\'s vertical pressing is overhead, not incline. For physique and general fitness the coach prefers incline pressing: swap an overhead press for a listed incline press if you want.', 'La mayor parte del empuje vertical de este plan es sobre la cabeza, no inclinado. Para físico y acondicionamiento general el coach prefiere el press inclinado: cambia un press sobre la cabeza por un press inclinado de la lista si quieres.']
};

/** UI_V3 keys that replace an earlier string of the same key */
export const V3_FINAL = ['ui.plan.weekly_sets_groups_note', 'ui.plan.own_risk_link', 'warning.release_missing', 'ui.plan.release_stamp_flat', 'check.v13_caps', 'check.v21_release', 'check.h20_release'];

/**
 * Dead words (COACH-CT CT-01, R4-SES-01, CX-01): lines of the time check, the schedule section and the retired 3 % / 7 % rate
 * caps that no engine file prints any more. Exact keys. Deleted from both languages by both builds.
 */
export const REMOVED_V3 = ['time.kept', 'ui.plan.not_trained_directly', 'ui.plan.trained_directly', 'ui.plan.trained_directly_block',
  'ui.plan.trained_directly_circuit', 'ui.plan.not_trained_station', 'ui.plan.not_trained_credit', 'ui.plan.not_trained_credit_all',
  'ui.plan.calves_line', 'ui.plan.calves_line_flat', 'warning.offer_longer_sessions', 'ui.plan.est_minutes_cardio', 'ui.plan.estimate_minutes',
  'ui.plan.easy_to_remove', 'why.placed_rise_cap', 'why.nonpriority_cap', 'why.older_step'];

/** is this i18n key one of the words V3 retires? */
export function isRemovedV3(key) { return REMOVED_V3.includes(key); }

/**
 * The Spanish review of this package (R2-GEN-08: neutral Latin American Spanish, the English gym term in brackets where gyms use
 * it). key -> the reviewed Spanish line; applied last by both builds, only to keys that exist. Every line keeps the placeholders of
 * its English twin (tools/compile/i18n.mjs refuses one that does not). What the review found and changed:
 *   - one word per idea on a plan: the release is a 'liberación de responsabilidad' everywhere, as in DISCLAIMER.es.md (some lines
 *     said 'descargo'); reps in the tank are 'en reserva' (the circuit lines said 'de sobra'); the health check is a 'revisión de
 *     salud' (the intake said 'chequeo', the plan header 'cuestionario'), and a weekly check-in is a 'seguimiento semanal', so the
 *     two never share a word and no plan line says 'chequeo';
 *   - 'repeticiones' inside sentences ('reps' stays in table headers and rep labels such as '8 a 12 reps');
 *   - regional words made neutral, the gym's English word in brackets: 'ligas' -> 'bandas elásticas (bands)', 'maneral en V' ->
 *     'agarre en V (V-handle)', 'entre menos ...' -> 'a menos ...', 'saltos en profundidad' -> 'saltos de profundidad (depth jumps)',
 *     'bisagra' -> 'bisagra de cadera (hinge)', 'balón de pared' -> 'balón medicinal (wall ball)', 'al sonar la alarma' -> 'al sonar
 *     la señal';
 *   - one ambiguous line: 'máxima intención; para cuando baje la calidad' read as a preposition - now 'detente cuando ...'.
 * Not reviewed line by line here: the 733 exercise names and their cues, the sport / profile names and the day labels (843 of them
 * are still the stage-B1 machine translation, listed in model/i18n/es_review.json) - they wait for the coach, as R2-GEN-08 asks.
 */
export const ES_REVIEW_V3 = {
  // ---- the release is a 'liberación de responsabilidad' (DISCLAIMER.es.md)
  'locked.release_every_build': 'La liberación de responsabilidad se acepta antes de crear cada plan',
  'release.minor': 'Menores de 18 años: un padre, madre o tutor legal debe leer y aceptar esta liberación de responsabilidad. Nombre del tutor: [ ] [REVISIÓN LEGAL]',
  'release.short.client': 'Liberación de responsabilidad (cliente)',
  'release.short.coach': 'Liberación de responsabilidad (profesional del fitness)',
  'release.short.minor': 'Liberación de responsabilidad (menor de edad, con tutor)',
  'ui.plan.release_stamp': 'Liberación de responsabilidad aceptada ({version}, {lang})',
  // ---- reps in the tank are 'en reserva'; a circuit ends at 'la señal'
  'effort.circuit_resistance': 'elige un peso con el que podrías seguir moviéndote con unas 2 repeticiones en reserva al sonar la señal',
  'effort.circuit_rir': 'elige un peso con el que podrías seguir con unas {rir} repeticiones en reserva al sonar la señal',
  'effort.circuit_rir_bw': 'elige una versión (o un ritmo) con la que podrías seguir con unas {rir} repeticiones en reserva al sonar la señal',
  'effort.circuit_rir_bw_one': 'elige una versión (o un ritmo) con la que podrías seguir con 1 repetición en reserva al sonar la señal',
  'effort.circuit_rir_one': 'elige un peso con el que podrías seguir con 1 repetición en reserva al sonar la señal',
  'guide.adjust.max': '¿Una serie se sintió como un máximo real (sin ninguna repetición en reserva)? La próxima vez quita una serie de ese ejercicio o un poco de peso.',
  // ---- 'repeticiones' inside a sentence
  'changes.at_cap': '{muscle} llegó a su tope semanal: sube el peso o las repeticiones, no las series',
  'changes.load_up': 'Mismas series: agrega un poco de peso o repeticiones esta semana',
  // ---- the health check is a 'revisión de salud' (the intake said 'chequeo', the plan 'cuestionario'); a weekly check-in is a
  // 'seguimiento semanal' - no line of a plan says 'chequeo' any more (R3-VOL-02: no check-in words on a plan)
  'ui.plan.health_check_ok': 'Revisión de salud: respondida; nada indicó consultar primero a un médico.',
  'intake.safety.label': 'Revisión de salud',
  'intake.health_route.label': 'Revisión de salud de tu cliente',
  'intake.health_route.opt.coach_screen': 'Hacer la revisión de salud (PAR-Q) con mi cliente ahora',
  'intake.error.health_route_required': '{field}: elige cómo se hace la revisión de salud',
  'warn.coach_bypass': 'Elegiste omitir la revisión de salud. Confirmas que eres profesional del fitness y que evalúas a este cliente con tus propios procedimientos de ingreso (cuestionario de salud y autorización médica cuando haga falta) antes de que empiece. Blaze Camp no ha evaluado a este cliente. [REVISIÓN LEGAL]',
  'warning.coach_bypass': 'Revisión de salud omitida por un profesional del fitness',
  'locked.no_checkin_no_change': 'El plan sigue su escalera planificada: sin seguimientos semanales, no se registra nada',
  'warning.checkin_retired': 'Los seguimientos semanales se retiraron: tu plan completo se arma una vez, con su escalera, y tú lo ajustas.',
  'why.planned_only': 'La semana planeada de la escalera (sin seguimientos semanales)',
  'check.h22_no_checkin_no_change': 'Solo la escalera planificada: cada semana sigue el calendario planificado (sin seguimientos semanales)',
  // ---- neutral words, the gym's English word in brackets
  'check.h01_no_bands': 'Sin bandas elásticas (bands) / cadenas / liberadores',
  'check.v9_bands': 'Sin bandas elásticas (bands) / cadenas',
  'locked.no_variable_resistance': 'Sin bandas elásticas (bands), cadenas ni liberadores de peso',
  'note.bodyweight_regress': 'Ejercicio con peso corporal: si no llegas a las repeticiones, usa la máquina asistida o una regresión sin bandas elásticas (pies en el piso, anillas o TRX).',
  'detail.v.neutral_grip_pull': 'agarre neutro cerrado (agarre en V, V-handle)',
  'detail.v.chin_grip': 'palmas hacia ti (agarre supino, chin-up)',
  'instruction.3': '***A menos repeticiones, más peso... Siempre busca 1-3 RIR (repeticiones en reserva), es decir RPE 7+.',
  'load.wall_ball': 'balón medicinal (wall ball) de {min}-{max} lb (nunca más de 20 lb)',
  'locked.horizontal_before_vertical': 'Horizontal antes que vertical (remos antes que jalones, press de pecho antes que press sobre la cabeza)',
  'locked.older_injured_never_list': 'Adultos mayores, lesionados o de alto volumen: nunca sentadilla sobre la cabeza (overhead squat) ni sentadilla con barra baja; sin arranques (snatches) ni saltos de profundidad (depth jumps) para lesionados o de alto volumen',
  'warn.older_athletic': 'A partir de los 60 años, tu plan incluye ejercicios de aterrizaje, equilibrio, pasos rápidos, lanzamientos ligeros de balón medicinal y trabajo rápido en máquinas. Los saltitos de tobillo, los demás saltos, los levantamientos olímpicos y los saltos de profundidad (depth jumps) están desactivados. Puedes activarlos. Asegúrate de contar con un profesional del fitness que te ayude a entender lo que esto implica.',
  'warn.racket_50_impact': 'Jugadores de pickleball, pádel y tenis desde los 50 años: tu plan usa trabajo de fuerza amable con las rodillas, trabajo de pantorrilla y tendón de Aquiles en cada día de pierna, trabajo del manguito rotador y solo saltos de bajo impacto. Los saltos de profundidad (depth jumps), los saltos de vallas (hurdle hops) y los saltos largos alternos (bounds) están desactivados. Puedes activarlos. Asegúrate de contar con un profesional del fitness que te ayude a entender lo que esto implica.',
  'why.older_default': '60+: sin olímpicos, pliometría ni saltos de profundidad (depth jumps) salvo que los elijas',
  'ui.plan.label_part.hinge': 'bisagra de cadera (hinge)',
  'ui.plan.label_part.single_leg_hinge': 'bisagra de cadera a una pierna (single-leg hinge)',
  // ---- an ambiguous line
  'effort.max_intent': 'máxima intención; detente cuando baje la calidad'
};

/** the Spanish lines of this package the coach should review first (additive to es_review.priority_review) */
export const ES_PRIORITY_V3 = ['ui.plan.release_line', 'ui.plan.release_line_coach', 'ui.plan.release_line_minor', 'ui.plan.release_line_short', 'ui.plan.release_footer',
  'warning.release_missing', 'ui.plan.progress_rule', 'ui.plan.progress.double', 'ui.plan.progress_sets', 'ui.plan.progress_next', 'ui.plan.accel_week',
  'ui.plan.est_line', 'guide.adjust.time', 'ui.plan.easy_to_remove_line', 'ui.plan.sets_by_week_note'];
