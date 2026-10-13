// tools/fixture/v07-words.mjs - engine 0.7 work package "safety gate, printed words, public files" (coach_answers_round5.md).
// Applied after the v0.6 layers (v06-volume, v06-select, v06-words) by BOTH builds (tools/fixture/build-fixture.mjs and
// tools/compile-model.mjs), so model/*.json keeps deep-equalling the fixture (tests/compile.test.mjs). Pure functions of their
// input (deterministic, no clock). Every value names its source: COACH-R5 (coach_answers_round5.md), an earlier coach answer,
// INFERRED or PROPOSED. Decisions: engine/DECISIONS.md section G (G-270 ... G-289); tests: tests/v07-words.test.mjs.
//
// What this layer changes in the model (rules: rules.legal.health_flag, rules.render.v7; words: UI_W7):
//   * R5-GEN-02 A HEALTH-CHECK FLAG NO LONGER STOPS THE PLAN ("It doesn't stop because we're not taking on any liability, but it
//     should warn them"). A true health answer (heart, recent surgery, pregnancy, an injury in treatment, a doctor's no) builds the
//     plan; the plan carries `warning.health_flag` and prints the warning up front in every view, in English and Spanish, with what
//     raised it ('a yes on the health check' - never which question, G-274 - and / or 'severe pain'). The liability gate is unchanged and still checked first (R4-SCP-02, H20): no release, no plan.
//   * SEVERE PAIN (PROPOSED, G-271): read the same way as the coach's answer - the plan is built, with the pain rules of the
//     strictest non-severe level (moderate: the painful lifts left out, the area's groups held, the pain-free depth cues) and the
//     same health warning, with 'Severe pain' named among its reasons.
//   * THE COACH ROUTES (G-272): `health_route: coach_screen` - the coach's client answers the check, a flag gives the warning;
//     `coach_own_sop` - the check is not read and the coach's skip warning prints (as before); severe pain still gives the warning.
//   * R5-GRD-06 THE CORE BLOCK IS PRINTED AS OPTIONAL ("Make sure you make the core work optional, everything should be
//     adjustable/adaptable"): its heading on the day card says the person may switch it off or change it, and 'How to adjust this
//     plan' says so once. The engine still builds it by default and never drops it on its own (H05, R4-SES-04).
// The engine reads only keys (engine/intake.mjs, engine/generate.mjs, engine/validate.mjs, engine/render.mjs); every word is below.

const clone = (o) => JSON.parse(JSON.stringify(o));
const uniqSorted = (a) => [...new Set(a)].sort();

/**
 * v0.7 words rule amendments (after the v0.6 layers).
 * @param {object} rules @returns {object}
 */
export function amendRulesW7(rules) {
  const R = clone(rules);
  R.legal = R.legal || {};
  // R5-GEN-02 (G-270 ... G-273): the health check warns, it does not stop the plan
  R.legal.health_flag = {
    // 'warn' = the plan is built and carries the warning (R5-GEN-02); 'refer' = the retired stop (engine 0.6 and earlier: plan
    // status 'refer', no weeks). The engine reads this value; a model without the key keeps the old stop.
    on_flag: 'warn',
    warning_code: 'health_flag',
    warning_key: 'warning.health_flag',
    // printed up front: the full line in the full and overview views, the short line in the block / week / day views
    label_key: 'ui.plan.health_warning_label',
    line_key: 'ui.plan.health_warning',
    reasons_key: 'ui.plan.health_warning_reasons',
    short_key: 'ui.plan.health_warning_short',
    // the 'Before you start' stamp of a flagged plan (replaces 'nothing in it asked for a doctor first', which would be untrue)
    stamp_key: 'ui.plan.health_check_flagged',
    // what raised it is named with the reason words; the health answers themselves are never named (G-274: the plan never says
    // which health question was a yes - spec legal_and_privacy.no_data_kept.health_answers 'never in the plan, links, exports',
    // R3-GEN-01): every yes on the health check is the one reason 'a yes on the health check'; severe pain (a plan input) is named
    reason_prefix: 'refer.reason.',
    answer_reason_key: 'refer.reason.health_check',
    // G-271 (PROPOSED): severe pain builds the plan with the moderate pain rules and the same warning
    severe_pain: { build_as: 'moderate', warn: true, status: 'PROPOSED (G-271: read from R5-GEN-02; the coach has not ruled on severe pain itself)' },
    // G-272: how the coach's health_route options work now
    coach_routes: {
      coach_screen: 'the client answers the health check; a yes builds the plan with the warning',
      coach_own_sop: 'the health check is not read; warning.coach_bypass prints; severe pain still gives the warning'
    },
    // the release gate is not changed (H20, R4-SCP-02): it is checked before the health screen
    gate_unchanged: true,
    legal_review: true,
    refs: ['R5-GEN-02', 'R4-SCP-01', 'R4-SCP-02', 'R3-GEN-01', 'R2-GEN-03'],
    status: 'approved rule (COACH-R5 R5-GEN-02); the warning wording is a draft for attorney review [LEGAL REVIEW]; severe pain PROPOSED'
  };
  R.legal.refs = uniqSorted([...(R.legal.refs || []), 'R5-GEN-02']);
  // the registry says what V1 / V21 hold now (G-273); H20 (the liability gate) is unchanged and still runs before the health screen
  R.validation = R.validation || {};
  R.validation.checks = (R.validation.checks || []).map(c => (c.id === 'V1'
    ? { ...c, v07: 'the health check warns, it does not stop (R5-GEN-02): a flag (or severe pain) builds an ok plan that carries meta.health.warn and warning.health_flag; severe pain is built with the moderate pain rules (PROPOSED, G-271); status refer is a violation while rules.legal.health_flag.on_flag is warn' }
    : c.id === 'V21'
      ? { ...c, v07: 'a plan built with a health flag can print the health warning in English and Spanish, with what raised it, never naming a health answer (R5-GEN-02, G-274)' }
      : c));

  R.render = R.render || {};
  R.render.v7 = {
    // R5-GRD-06 (G-275): the core block's heading says it is optional; the guide says so once. Words only - H05 holds.
    core_optional: { kinds: ['core'], heading_suffix_key: 'block.optional_suffix', guide_key: 'guide.adjust.core_optional', refs: ['R5-GRD-06', 'R3-SES-02', 'CX-04'] },
    // R5-GEN-02 (G-274): the health warning sits under the release line, not in the 'Before you start' list a second time
    health_warning_up_front: true,
    refs: ['R5-GRD-06', 'R5-GEN-02', 'R3-SES-02', 'CX-04'],
    status: 'approved rules (the coach ids above); PROPOSED: the wording of the core line; [LEGAL REVIEW]: the health warning'
  };
  R.render.refs = uniqSorted([...(R.render.refs || []), 'R5-GRD-06', 'R5-GEN-02']);
  return R;
}

/** v0.7 words: key -> [EN, ES]. Every key wins over the earlier layers. */
export const UI_W7 = {
  // G-297 (R5-ATH-02 'reach the block's final number'; R2-PER-07; review r9 02 m2): a test week whose athletic work is lighter says why
  'ui.plan.athletic_test_lighter': ['Test week: jumps, throws and sprints are lighter so you test fresh.', 'Semana de pruebas: los saltos, lanzamientos y sprints son más ligeros para que hagas las pruebas descansado.'],
  // ---- R5-GEN-02: the health warning ([LEGAL REVIEW]: the attorney review of the wording is deferred, not a blocker)
  'warning.health_flag': ['Health check: you answered yes to at least one question. This plan was built anyway; read the warning at the top of the plan. [LEGAL REVIEW]', 'Revisión de salud: respondiste que sí a al menos una pregunta. Este plan se creó de todos modos; lee la advertencia al inicio del plan. [REVISIÓN LEGAL]'],
  'ui.plan.health_warning_label': ['Health warning.', 'Advertencia de salud.'],
  'ui.plan.health_warning': ['This plan is general fitness information, built from general good training practice. It is not a plan from a doctor, and no medical professional has tailored it to you. See a medical professional to make sure it is safe and healthy for you before you start. [LEGAL REVIEW]', 'Este plan es información general de acondicionamiento físico, basada en buenas prácticas generales de entrenamiento. No es un plan de un médico y ningún profesional de la salud lo adaptó a ti. Consulta a un profesional de la salud para asegurarte de que es seguro y saludable para ti antes de empezar. [REVISIÓN LEGAL]'],
  'ui.plan.health_warning_reasons': ['Why you see this: {reasons}.', 'Por qué ves esto: {reasons}.'],
  'refer.reason.health_check': ['A yes on the health check', 'Un sí en la revisión de salud'],
  'ui.plan.health_warning_short': ['Health warning: not a plan from a doctor. See a medical professional to make sure it is safe for you. [LEGAL REVIEW]', 'Advertencia de salud: no es un plan de un médico. Consulta a un profesional de la salud para asegurarte de que es seguro para ti. [REVISIÓN LEGAL]'],
  'ui.plan.health_check_flagged': ['Health check: answered; you said yes to at least one question. Read the health warning at the top of this plan.', 'Revisión de salud: respondida; respondiste que sí a al menos una pregunta. Lee la advertencia de salud al inicio de este plan.'],
  'why.health_flag': ['Built with a health warning: a health-check answer no longer stops the plan', 'Creado con una advertencia de salud: una respuesta de la revisión de salud ya no detiene el plan'],
  // ---- R5-GRD-06: the core block is optional and adjustable
  'block.optional_suffix': ['(optional: you may switch it off or change it)', '(opcional: puedes desactivarlo o cambiarlo)'],
  'guide.adjust.core_optional': ['The core block is optional: you may switch it off or change its exercises on any day. Everything in this plan is adjustable.', 'El bloque de core es opcional: puedes desactivarlo o cambiar sus ejercicios cualquier día. Todo en este plan se puede ajustar.']
};

/** the Spanish lines of this layer the coach should review first (additive to es_review.priority_review; machine-written, R2-GEN-08) */
export const ES_PRIORITY_W7 = Object.keys(UI_W7).sort();
