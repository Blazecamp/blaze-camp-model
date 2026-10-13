// tools/fixture/v07-volume.mjs - engine 0.7 work package "volume, credits, set placement, circuit rounds" (COACH-R5, the coach's
// round-5 answers, coach_answers_round5.md; the round-8 coach-eye reviews' bonus-timing minor, reviews/coach-eye-r8/01 m2, 06 m1).
// Applied after the v0.6 layers (v06-volume.mjs, v06-select.mjs, v06-words.mjs) by BOTH builds (tools/fixture/build-fixture.mjs and
// tools/compile-model.mjs), so model/*.json keeps deep-equalling the fixture (tests/compile.test.mjs). Pure functions of their input
// (deterministic, no clock). Every value names its source: COACH-R5 (coach_answers_round5.md), COACH-CH5
// (coach_answers_chat_2026-10-11.md), an earlier coach answer, OBSERVED, INFERRED or PROPOSED. Decisions: engine/DECISIONS.md
// section G (G-230 ... G-249).

const clone = (o) => JSON.parse(JSON.stringify(o));

/** R5-VOL-01: a high-incline press counts 1.0 chest, 0.25 front delts, 0.25 triceps (replaces the v0.5 1.0 front delts + 0.5 chest) */
export const MRPUSH_CREDITS_V07 = { chest: 1, front_delts: 0.25, triceps: 0.25 };

/**
 * v0.7 exercise amendments (after amendExerciseS6): the high-incline presses (credit class MRPUSH) count for chest (R5-VOL-01).
 * @param {object} ex runtime exercise record @returns {object}
 */
export function amendExerciseV07(ex) {
  if (ex.credit_class !== 'MRPUSH') return ex;
  const e = clone(ex);
  e.credits = { ...MRPUSH_CREDITS_V07 };
  e.primary_muscle = 'chest';
  e.rule_refs = [...new Set([...(e.rule_refs || []), 'R5-VOL-01'])];
  return e;
}

/**
 * v0.7 rule amendments (after amendRulesS6).
 * @param {object} rules @returns {object}
 */
export function amendRulesV07(rules) {
  const R = clone(rules);

  // ---- credits (G-230; R5-VOL-01 "Its mostly upper chest for me like a 1 for chest and a .25 front delts .25 tricep")
  R.credit.classes.MRPUSH = { ...MRPUSH_CREDITS_V07 };
  R.credit.exceptions = { ...(R.credit.exceptions || {}), MRPUSH: 'R5-VOL-01 (coach, 2026-10-12): a high-incline (mid-range) press counts 1.0 chest + 0.25 front delts + 0.25 triceps - mostly upper chest; it stays the vertical / mid-range push slot\'s press (R4-SES-05, R4-LIB-03)' };

  // ---- where the sets go (engine/volume.mjs runBlock, planStairs, addSet)
  R.placement.x7 = {
    // G-231 (R5-VOL-07 "That's right": 'Allow a light chest exercise (fly or machine press) on the optional day even after a press day.
    // Machines and flies are easy on recovery'): the exception to the no-repeat rule of G-104 / G-210 for that case - a chest bonus on an
    // optional day may follow a press day when it is a fly or a machine press; a free-weight press still may not
    // optional_day_max: the training days being full (the question's premise), such a light chest exercise may take one more place on
    // the optional day than placement.bonus.max_added_per_optional_day (2) - PROPOSED reading of where the coach's exercise goes
    light_chest_optional: { enabled: true, groups: ['chest'], credit_classes: ['ISO_CHEST'], machine_press: { credit_classes: ['HPUSH'], tags: ['machine'] }, bucket: 'ISO_CHEST',
      optional_day_max: 3,
      refs: ['R5-VOL-07', 'R3-VOL-03', 'CH5-03'], status: 'approved (COACH-R5 R5-VOL-07); the third optional-day place for it PROPOSED' },
    // G-232 (R5-VOL-09 'Partly': "It can go up more as well depends on focus and goals"): the athlete's flat-press cap of 4
    // (placement.x3.athlete_press_max, G-101) is the default; with chest a Focus muscle the press may go to the level's per-exercise top
    athlete_press_focus: { enabled: true, refs: ['R5-VOL-09', 'R3-SES-01'], status: 'approved (COACH-R5 R5-VOL-09); "goals" other than a Focus pick is not an intake field (no new input)' },
    // G-235 (R5-VOL-11 "That's right": 'Give the day's first press a 5th set in the last block, so it reaches 13'): a shortfall smaller
    // than a whole bonus exercise - the day's first lift of the group (the first training day that trains it) takes `sets` extra set
    // over its own top, never above the level's per-exercise top, in the block's last exercise block, so the group reaches its final
    // sets (retires G-219's hold for that case)
    one_set_shortfall: { enabled: true, sets: 1, refs: ['R5-VOL-11', 'VOL-07', 'CH5-03', 'R4-PRG-04'], status: 'approved (COACH-R5 R5-VOL-11)' },
    // G-236 (R5-ATH-12 "That's right": 'Start the heavy deadlift at 3 sets and give it the next added set ahead of the other hip lifts,
    // even if that breaks the even 3/3/3 pattern of that day'): the week's counted heavy hinge (the main two-leg hinge - slot 2 - of an
    // athletic B day, flag axial_counted) starts at `start_sets` and takes its group's next set ahead of the other hip lifts
    heavy_hinge_lead: { enabled: true, families: ['athletic'], bucket: 'RP_BHD', role: 'work', flag: 'axial_counted', start_sets: 3, steps_ahead: 1,
      refs: ['R5-ATH-12', 'PER-04', 'VOL-07', 'R4-SES-05'], status: 'approved (COACH-R5 R5-ATH-12); steps_ahead 1 reads "the next added set"' },
    // G-238 (round-8 coach-eye reviews 01 m2, 06 m1: 'open a bonus in the WEEK its group's template lifts all reach their tops, not at
    // the start of its exercise block'; VOL-07; CH5-03 'if needed'; G-218): a group's bonus exercise comes in the first week whose
    // number the template's lifts, every one at its top that week, cannot hold - not before. The exercise is chosen with its exercise
    // block (PER-02) and waits at 0 sets until that week.
    bonus_open_week: { enabled: true, refs: ['VOL-07', 'CH5-03', 'R3-VOL-03', 'R4-PRG-01'], status: 'PROPOSED reading (round-8 coach-eye minor 01 m2 / 06 m1)' },
    refs: ['R5-VOL-07', 'R5-VOL-09', 'R5-VOL-11', 'R5-ATH-12'],
    status: 'engine 0.7 volume package (coach answers round 5); approved answers, the readings named per key'
  };

  // ---- weekly targets (engine/volume.mjs planStairs)
  R.volume.x7 = {
    // G-237 (R5-CLS-07 'Partly': "Nothing should start at their top number. It should all be gradual, and whatever the focus is, that
    // should be a little bit higher to start"): a stairway group whose start would sit at its top while its lifts can hold more climbs
    // at least `min_climb` sets (its top is raised inside the level's top and what the lifts hold); calves (their own dose a leg day,
    // R3-SES-01) and a group held by the person's pain (the pain rule) keep their numbers. A Focus group already starts higher
    // (R3-SES-01 focus add). Circuits: the rounds climb in thirds (supersets.bootcamp.x7, R5-CLS-03).
    start_below_top: { enabled: true, min_climb: 1, exempt_groups: ['calves'], exempt_pain: true,
      refs: ['R5-CLS-07', 'R3-SES-01', 'R2-PER-03', 'R4-PRG-04'], status: 'approved (COACH-R5 R5-CLS-07); min_climb 1 PROPOSED' },
    refs: ['R5-CLS-07'],
    status: 'engine 0.7 volume package'
  };

  // ---- the athletic / racket day (engine/week.mjs buildDay)
  R.session.x7 = {
    // G-233 (R5-VOL-10 "That's right": 'Keep the calf raise on both days for racket players 50+ (Achilles care) and let the day hold one
    // more exercise'; R3-ATH-02 'calf and Achilles work every leg day'): a racket player 50+ keeps the template's calf station on every
    // training day that holds one, even when slot 5 (CH5-02) took its place; that day may hold `size_plus` exercise above the session
    // size and says so (warning.racket_calf_both_days; V13 reads the day's why)
    racket_calf_both_days: { enabled: true, from_age: 50, racket_profiles: ((R.population && R.population.active_aging_50 && R.population.active_aging_50.racket_profiles) || []).slice(),
      bucket: 'ISO_CALF', size_plus: 1, why_key: 'why.racket_calf_both_days', warning_key: 'warning.racket_calf_both_days',
      refs: ['R5-VOL-10', 'R3-ATH-02', 'R4-SES-02'], status: 'approved (COACH-R5 R5-VOL-10)' },
    refs: ['R5-VOL-10'],
    status: 'engine 0.7 volume package'
  };

  // ---- circuits (engine/shape.mjs buildShape)
  // G-234 (R5-CLS-03 'Partly': "Mathematically, say it's a 12-week program: 3 rounds the first 4 weeks ... 4 rounds the next 4 weeks,
  // then 5 rounds the next 4 weeks, and then people can adjust as they need to"): the rounds of a timed circuit climb with the
  // stairway in thirds (12 weeks: 3 / 4 / 5 in weeks 1-4 / 5-8 / 9-12; a shorter block splits the same way); replaces the level's
  // round count + one late round (G-09, fix round 2). The plan says people adjust (warning.circuit_rounds_thirds).
  R.supersets.bootcamp.x7 = {
    rounds_by_third: { rounds: [3, 4, 5], warning_key: 'warning.circuit_rounds_thirds', floor_key: 'warning.circuit_rounds_floor', refs: ['R5-CLS-03', 'PRG-03', 'CX-04'], status: 'approved (COACH-R5 R5-CLS-03)' }
  };

  // ---- validation: V13 reads the stated racket-calf day (R5-VOL-10)
  if (R.validation && R.validation.v05) R.validation.v05.size_plus_whys = [...new Set([...(R.validation.v05.size_plus_whys || []), 'why.racket_calf_both_days'])];
  return R;
}

/** v0.7 volume words: key -> [EN, ES]. Every key wins over the earlier layers. Spanish PROPOSED (R2-GEN-08). */
export const UI_V07 = {
  // G-231 (R5-VOL-07)
  'why.light_chest_optional': ['A light chest exercise (a fly or a machine press) on the optional day: easy on recovery, so it may follow a press day', 'Un ejercicio ligero de pecho (aperturas o press en máquina) en el día opcional: se recupera fácil, así que puede ir después de un día de press'],
  // G-233 (R5-VOL-10)
  'why.racket_calf_both_days': ['Calf raise on both training days (racket player 50+, Achilles care): this day holds one exercise more than the usual range', 'Elevación de talones en los dos días de entrenamiento (jugador de raqueta de 50+, cuidado del tendón de Aquiles): este día lleva un ejercicio más que el rango habitual'],
  'warning.racket_calf_both_days': ['Calf raises stay on both training days for Achilles care (racket players 50+), so {days} holds one exercise more than the usual range. Remove it if you need a shorter session.', 'La elevación de talones se queda en los dos días de entrenamiento para cuidar el tendón de Aquiles (jugadores de raqueta de 50+), así que {days} lleva un ejercicio más que el rango habitual. Quítala si necesitas una sesión más corta.'],
  // G-234 (R5-CLS-03)
  'warning.circuit_rounds_thirds': ['Circuit rounds climb with the plan, one more round each third of the block ({from} to {to} rounds). These are a guide: add or take away a round as you need.', 'Las rondas del circuito suben con el plan, una ronda más en cada tercio del bloque (de {from} a {to} rondas). Son una guía: agrega o quita una ronda según lo necesites.'],
  'warning.circuit_rounds_floor': ['{group}: weeks 1-{last} run {rounds} rounds a station, so these groups sit under {floor} weekly sets until week {week}, when the rounds go up. Add a round if you want more sooner.', '{group}: las semanas 1-{last} llevan {rounds} rondas por estación, así que estos grupos quedan por debajo de {floor} series semanales hasta la semana {week}, cuando suben las rondas. Agrega una ronda si quieres más antes.'],
  // G-230 (R5-VOL-01): a high-incline press is an upper-chest press now (was 'the shoulder press with some chest')
  'swap.keeps.MRPUSH': ['the upper-chest press', 'el press de pecho superior']
};
