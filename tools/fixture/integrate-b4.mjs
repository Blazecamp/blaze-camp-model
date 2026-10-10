// tools/fixture/integrate-b4.mjs - model 1.3.0, engine stage B4 (integration). Applied after render-b3.mjs by BOTH builds
// (tools/fixture/build-fixture.mjs and tools/compile-model.mjs), so model/rules.json keeps deep-equalling the fixture rules
// (tests/compile.test.mjs). Pure functions of their input (deterministic, no clock). Every value names its source:
// COACH-ANSWER / COACH-R2 / COACH-R3 <id>, OBSERVED, INFERRED or PROPOSED.
//
// What B4 changes in the model (engine/DECISIONS.md section E, stage B4 E-64 ... ; samples/REVIEW_LOG.md v0.4 stage B4):
//   * rules.session.time_fit.keep_work_lift - in the class model (CrossFit-style class, OBSERVED OT18 'HALF TIME') the day's work
//     lift is the class's strength piece: the time check (COACH-R3 R3-SES-02) never removes it. A group the time check does not
//     train directly keeps that one lift at the class table's 3 sets (OBSERVED reps.class_levels.strength 3 x 7 -> 3 x 4) and is
//     listed as not trained directly with reason 'class_lift' (PROPOSED, E-64; sample 04 printed a 'Squat + clean day' with no
//     squat and a 'Deadlift day' with no deadlift)
//   * words: the client copy of that reason, of a group the time check leaves with no credited set at all ('not trained in
//     this plan', sample 08) and of a class day title rebuilt from its own lifts ('Pull day', sample 04) - EN + ES; Spanish
//     PROPOSED, coach ES review D-64

const clone = (o) => JSON.parse(JSON.stringify(o));

/**
 * B4 rule amendments (after amendRulesB3). Shapes: one new object under rules.session.time_fit.
 * @param {object} rules @returns {object}
 */
export function amendRulesB4(rules) {
  const R = clone(rules);
  R.session.time_fit = {
    ...R.session.time_fit,
    keep_work_lift: {
      families: ['hybrid_crossfit'],  // the class model (CrossFit-style class, OT17 / OT18)
      roles: ['work'],                // the template's work lift ('the work', ORD-07): squat, press, deadlift, pull days
      sets: 3,                        // OBSERVED HALF TIME table: 3 x 7 -> 3 x 6 -> 3 x 5 -> 3 x 4 (reps.class_levels.strength)
      reason: 'class_lift',           // plan.time_check.not_trained_directly[].reason
      refs: ['OT18', 'ORD-07', 'R3-SES-02'],
      status: 'PROPOSED (B4, E-64): the coach approved fewer groups trained directly (R3-SES-02, his CrossFit-class example); keeping the class lift of a group not trained directly is PROPOSED'
    }
  };
  return R;
}

// ---------------------------------------------------------------------------------------------------------------- words

/** [key]: [en, es] - Spanish PROPOSED (neutral Latin American; coach ES review, D-64) */
export const UI_B4 = {
  // a group the time check leaves with no credited set at all in the block (no compound lift trains it either; sample 08)
  'ui.plan.not_trained_time_none': [
    'Not trained in this plan because of time: {groups}. Add a day or longer sessions to train them.',
    'No se entrenan en este plan por falta de tiempo: {groups}. Agrega un día o sesiones más largas para entrenarlos.'
  ],
  // a class day title (no day code) rebuilt from the day's own lifts when it names a piece the day no longer holds (sample 04)
  'ui.plan.day_title_plain': ['{label} day', 'Día de {label}'],
  'ui.plan.not_trained_class_lift': [
    'Your class lifts stay for these groups (3 sets, fewer reps and more weight as the weeks go; no extra sets): {groups}',
    'Tus levantamientos de la clase se quedan para estos grupos (3 series, menos repeticiones y más peso con las semanas; sin series extra): {groups}'
  ]
};

/** UI_B4 keys that replace an earlier string of the same key */
export const B4_FINAL = [];
