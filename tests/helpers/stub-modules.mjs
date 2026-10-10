import { circuitWorkSeconds } from '../../engine/shape.mjs';
// tests/helpers/stub-modules.mjs - contract-shaped stand-ins for every B2 / B3 export (engine/BUILD_PLAN.md §2). Owner: B4.
// A deliberately simple, deterministic engine: the template's stations become slots, the first default catalog record that
// passes the hard filters fills each slot, sets come from the template hints and stay flat, efforts follow the planned
// stairway RIR. It is NOT the coach's volume engine (no floor / bonus / focus / aerobic placement); it exists so that
// generate / validate / render / tools can be exercised end to end before B2 / B3 land. Same exported names and shapes as
// engine/CONTRACTS.md §4.3-§4.8. Never used by engine code.
import { why, roundHalfUp, round2, WEEKDAYS, forbiddenKeys, weeksBetween, EPS, clamp } from '../../engine/util.mjs';
import { plannedStairway } from '../../engine/validate.mjs';

const RES_KINDS = ['resistance', 'isolation', 'focus'];
const ATHLETIC_KINDS = ['athletic', 'power'];
const SKIP_BUCKETS = ['COND_AEROBIC', 'COND_SPRINT_BUYOUT', 'FOCUS', 'COMPLEX', 'TEST'];

// ------------------------------------------------------------------------------------------------------------- intake

/** @returns {{ok:boolean, errors:object[], warnings:object[], intake:object}} */
export function validateIntake(intake, model) {
  const errors = [];
  if (!intake || intake.schema !== 'intake/2') errors.push({ code: 'schema', field: 'schema', key: 'check.v26_inputs' });
  const bad = intake ? forbiddenKeys(intake) : [];
  for (const p of bad) errors.push({ code: 'forbidden_key', field: p, key: /sex|gender/i.test(p) ? 'locked.no_sex_rules' : 'locked.no_lifestyle_inputs' });
  if (intake && !checkRelease(intake).ok) errors.push({ code: 'release_missing', field: 'release', key: 'warning.release_missing' });
  if (errors.length) return { ok: false, errors, warnings: [], intake };
  const i = JSON.parse(JSON.stringify(intake));
  i.lang = i.lang || 'en';
  i.units = i.units || 'lb';
  i.lift_style = i.lift_style || 'balanced';
  i.output_mode = i.output_mode || 'plan_only';
  i.prefs = { core_position: 'start', optional_days: 'separate', variety_ab: false, heavy_unilateral: false, supersets_for_fatigue: false, cardio_adjust: 0, older_athletic_opt_in: false, split_style: 'default', ...(i.prefs || {}) };
  i.plan = { mode: 'fixed_12', maint_reason: null, maint_weeks: null, previous_cycles: { count: 0, last_had_holds_or_pain: false }, tests: ['none'], just_finished_block: false, ...(i.plan || {}) };
  i.pain = i.pain || [];
  i.exclusions = i.exclusions || [];
  i.priority_muscles = (i.priority_muscles || []).slice(0, 2);
  return { ok: true, errors: [], warnings: [], intake: i };
}

/** @returns {{refer:boolean, reasons:string[], bypass:boolean}} */
export function safetyScreen(intake) {
  const bypass = intake.role === 'client' && intake.health_route === 'coach_own_sop';
  const reasons = [];
  if (!bypass) for (const [k, v] of Object.entries(intake.safety || {})) if (v === true) reasons.push('refer.reason.' + k);
  if ((intake.pain || []).some(p => p && p.severity === 'severe')) reasons.push('refer.reason.severe_pain');
  return { refer: reasons.length > 0, reasons, bypass };
}

/** @returns {{ok:boolean, issues:object[]}} */
export function checkRelease(intake) {
  const r = intake.release || {};
  const want = intake.age < 18 ? 'release.minor' : intake.role === 'client' ? 'release.coach' : 'release.client';
  const ok = r.accepted === true && r.version === want && (want !== 'release.minor' || r.guardian === true);
  return { ok, issues: ok ? [] : [{ code: 'release_missing', key: 'warning.release_missing' }] };
}

function matchWhen(when, ctx) {
  return Object.entries(when).every(([k, v]) => {
    if (k === 'body_weight_lb_gte') return ctx.body_weight_lb >= v;
    if (k === 'older' || k === 'pain_moderate') return ctx[k] === v;
    return Array.isArray(v) ? v.includes(ctx[k]) : ctx[k] === v;
  });
}

function resolveProfile(i, model) {
  const goal = i.goal;
  const sp = i.sport;
  let id = model.profiles.goal_defaults[goal], variant = null, sport_id = null, position = null, competitive = 'none';
  if (goal === 'athletic' && sp && sp.competitive === 'competitive') {
    competitive = 'competitive';
    sport_id = sp.sport;
    const ps = model.pickerSport(sp.sport);
    const pos = (ps.positions || []).find(p => p.value === sp.position);
    position = pos ? pos.value : null;
    id = (pos && ((pos.profile_by_choice || {})[sp.position_detail] || pos.profile)) || ps.default_profile || id;
    const sc = ps.second_choice && (ps.second_choice.options || []).find(o => o.value === sp.position_detail);
    variant = (pos && pos.variant) || (sc && sc.variant) || ps.default_variant || null;
  } else if (goal === 'active' || (goal === 'athletic' && sp && sp.competitive === 'recreational')) {
    competitive = 'recreational';
    const a = i.activity && i.activity.ids && i.activity.ids[0] ? model.activity(i.activity.ids[0]) : null;
    if (a && a.profile) id = a.profile;
  }
  if (!id || !model.hasSport(id)) id = model.profiles.goal_defaults[goal] || model.profiles.recreational_profile;
  const sd = model.sport(id);
  return { id: sd.id, variant: variant && sd.variants && sd.variants[variant] ? variant : null, sport_id, position, position_detail: sp ? sp.position_detail ?? null : null,
    activity_ids: (i.activity && i.activity.ids) || [], overlays: [], competitive, ath03_group: sd.ath03_group ?? null,
    ground_contact_class: sd.ground_contact_class ?? null, season_type: sd.season_type || 'I', name_key: sd.name_key, _sd: sd };
}

/** @returns {import('../../engine/util.mjs').Derived} */
export function deriveValues(i, model) {
  const R = model.rules;
  const D2 = resolveProfile(i, model);
  const sd = D2._sd; delete D2._sd;
  const hint = sd.template_hint || null;
  let family = (hint && hint.family) || model.templates.goal_to_family[i.goal];
  const ko = model.templates.kit_family_override;
  if (ko.profiles.includes(i.equipment.profile) && !ko.except_goals.includes(i.goal)) family = ko.family;
  const days = clamp(i.schedule.days_per_week, 2, 6);
  const years = i.experience.years_consistent;
  let level = years < R.levels.client.L1_below_years ? 'L1' : (years >= R.levels.client.L3_min_years && days >= R.levels.client.L3_min_days ? 'L3' : 'L2');
  if (i.experience.months_off_last_2y >= R.levels.client.layoff_months_body_L1 || i.experience.former_competitor) level = 'L1';
  let ladder = R.levels.exercise_ladder[level];
  if (i.age < R.levels.youth_age && R.levels.ladder_order.indexOf(ladder) > R.levels.ladder_order.indexOf(R.levels.youth_max_ladder)) ladder = R.levels.youth_max_ladder;
  const mode = i.plan.mode;
  const weeks = mode === 'fixed_8' ? 8 : mode === 'maintenance_4_6' ? (i.plan.maint_weeks || 4) : 12;
  let variant = null;
  let t = model.template(family, days);
  const ss = R.template_select.split_style_variants[i.prefs.split_style];
  if (ss && t.variants[ss]) variant = ss;
  else if (hint && hint.variant && t.variants[hint.variant]) variant = hint.variant;
  else if (family === 'fat_loss_bootcamp' && i.format === 'bootcamp' && t.variants.bootcamp_circuit) variant = 'bootcamp_circuit';
  const tf = model.templateFor(family, days, variant);
  t = tf.template; variant = tf.variant;
  const age = i.age;
  const pain_moderate = (i.pain || []).some(p => p.severity === 'moderate');
  const fsel = R.equipment.family_select.find(f => matchWhen(f.when, { older: age >= R.population.older.from_age, pain_moderate, family, competitive: D2.competitive, goal: i.goal, level }));
  const cf = R.equipment.client_families[fsel.use];
  const E = R.equipment;
  const tokens = new Set([...(E.profiles[i.equipment.profile] || { kit: [] }).kit, ...(i.equipment.extras || [])]);
  for (const m of i.equipment.machines || []) if (E.machines[m]) tokens.add(E.machines[m]);
  const det = i.equipment.detail || {};
  for (const c of det.cardio_options || []) if (E.cardio_tokens[c]) tokens.add(E.cardio_tokens[c]);
  const rs = E.running_space[det.running_space];
  if (rs) {
    for (const x of rs.drop || []) if (!(rs.unless_cardio_run && (det.cardio_options || []).includes('run') && x === 'open_space_long')) tokens.delete(x);
    for (const x of rs.add || []) tokens.add(x);
  }
  for (const b of E.banned_tokens) tokens.delete(b);
  const tokenList = [...tokens].sort();
  const machines = (i.equipment.machines || []).length ? i.equipment.machines.slice() : Object.keys(E.machines).filter(m => tokens.has(E.machines[m])).sort();
  const owned = det.medball_lb_owned || [];
  const derived = {
    D1_family: family,
    D2_profile: D2,
    D3_client_level: { level, reason_keys: [{ key: 'level.reason.exp_years', args: { years } }], exercise_ladder: ladder, replace_after_block: null },
    D4_season_phase: { phase: null, weeks_to_season: null, season_date: null, competition_date: null, season_type: D2.competitive === 'competitive' ? D2.season_type : null, practice_days: null, game_days: [] },
    D5_plan_shape: { mode, overlay: null, skeleton: (R.plan_types.skeleton_ids[i.goal] || R.plan_types.skeleton_ids.any)[mode] || R.plan_types.skeleton_ids.any[mode] || 'STUB', weeks },
    D6_week_layout: { template_id: t.id, family, days: t.days, variant, pairing: model.templates.families[family].pairing.startsWith('same') ? 'same_pattern' : 'cross_pattern', format: i.format || 'gym' },
    D7_constraint_band: { client_family: fsel.use, main: cf.main, iso: cf.iso, machine_pen: cf.machine_pen, skill_pen: cf.skill_pen },
    D8_kit: { profile: i.equipment.profile, tokens: tokenList, machines, medball_max_lb: owned.length ? Math.min(R.medball.max_lb, Math.max(...owned)) : null, heaviest_db_pair: det.heaviest_db_pair ?? null, box_height_in: det.box_height_in ?? null, buy_list: [] },
    D9_start_sets: null,
    D10_bilateral_share: { profile_id: 'sport', lower: { by_exercise_block: (sd.share && sd.share.lower && sd.share.lower.by_exercise_block) || [0.5], PRE: null, IN: null }, upper: { by_exercise_block: [0.5] }, pain_shift: 0 },
    D11_athletic_budget: { enabled: family === 'athletic', older_mode: age >= R.population.older.from_age ? (i.prefs.older_athletic_opt_in ? 'opt_in' : 'default') : null, plyo_share: sd.plyo_share || null, ground_contact_class: sd.ground_contact_class ?? null, contacts_session_max: R.athletic.contacts_per_session_max[level], weekly: sd.athletic_weekly || {}, olympic_exposures_wk: sd.olympic ? sd.olympic.exposures_wk : null, medball_main: true, cod_sport: !!sd.cod_sport, game_heavy: false, heavy_play_week: false },
    D12_planned_step: { early: R.stairway.standard_steps.early, late: R.stairway.standard_steps.late, caps: { nonpriority_while_priority: i.priority_muscles.length ? R.stairway.limits.nonpriority_while_priority : null, older: age >= R.population.older.from_age ? R.stairway.limits.older_60plus : null }, source: 'planned_stairway' },
    D13_tests: { items: (i.plan.tests || []).filter(x => x !== 'none'), baseline_week: 1, end_weeks: [weeks], from_zero: true },
    D14_aerobic_sessions: { per_week: 0, base: 0, adjust: 0, replaced_by_activity: 0, walks: false, colours: [], fighter_open: false, sport_is_aerobic: false },
    goal: i.goal, format: i.format || 'gym', lang: i.lang, units: i.units, age,
    age_group: age < 18 ? 'youth' : age >= 60 ? 'older' : age >= 50 ? 'active_aging_50' : 'adult',
    body_weight_lb: i.body_weight.unit === 'kg' ? round2(i.body_weight.value * 2.20462) : i.body_weight.value,
    days_per_week: days, weekdays: WEEKDAYS.filter(d => i.schedule.weekdays.includes(d)), session_minutes: i.schedule.session_minutes, start_date: i.schedule.start_date,
    play_days: (i.activity && i.activity.play_days) || [], event_date: (i.activity && i.activity.event_date) || null,
    priority_muscles: i.priority_muscles.flatMap(p => R.volume.priority.intake_map[p] || []),
    pain: i.pain, exclusions: i.exclusions, lift_style: i.lift_style, output_mode: i.output_mode, prefs: i.prefs,
    previous_cycles: i.plan.previous_cycles, just_finished_block: !!i.plan.just_finished_block, maint_reason: i.plan.maint_reason ?? null, maint_weeks: i.plan.maint_weeks ?? null,
    health: { role: i.role || 'self', health_route: i.health_route ?? null, refer: false, reasons: [], bypass: i.role === 'client' && i.health_route === 'coach_own_sop' },
    release: { accepted: true, version: i.release.version, lang: i.release.lang, guardian: i.release.guardian ?? null },
    equipment_preference: i.equipment.preference || 'none', modifier_id: null, r3_pending: [], warnings: [],
    why: [why('why.profile', 'COACH-CHAT 2026-10-08', { profile: D2.id }), why('why.template', 'VOL-08', { template: t.id })]
  };
  if (age >= R.population.older.from_age) derived.warnings.push({ code: 'older', key: R.population.older.warning_key });
  if (family === 'athletic' && i.schedule.session_minutes <= 30) derived.warnings.push({ code: 'V3', key: 'warning.v3_short_athletes' });
  if (derived.health.bypass) derived.warnings.push({ code: 'bypass', key: 'warning.coach_bypass' });
  derived.D9_start_sets = computeTargets(derived, model);
  derived.modifier_id = derived.D9_start_sets.modifier_id;
  return derived;
}

// ------------------------------------------------------------------------------------------------------------- shape / volume

/** @returns {import('../../engine/util.mjs').Targets} */
export function computeTargets(d, model) {
  const R = model.rules, V = R.volume, L = d.D3_client_level.level;
  const sel = V.modifier_select.find(s => matchWhen(s.when, { family: d.D1_family, competitive: d.D2_profile.competitive, ath03_group: d.D2_profile.ath03_group, body_weight_lb: d.body_weight_lb, goal: d.goal }));
  const mod = V.modifiers[sel.use];
  const start = {}, cap = {}, fill = {}, credit_only = [];
  const painMuscles = [...new Set((d.pain || []).flatMap(p => (V.pain.areas[p.area] || { muscles: [] }).muscles))];
  for (const m of R.muscles.order) {
    const def = R.muscles.defs[m];
    if (!def.target) continue;
    if (def.own_sets) { start[m] = V.start[m][L]; cap[m] = V.cap[m][L]; fill[m] = 'own_sets'; continue; }
    if (def.per_leg_day) { start[m] = V.calves.weekly_floor; cap[m] = V.cap[m][L]; fill[m] = 'target'; continue; }
    const factor = def.class === 'small' ? mod.small : mod[def.region];
    if (factor === 'credit' || (def.athlete_fill === 'credit' && mod.small === 'credit')) { start[m] = null; cap[m] = null; fill[m] = 'credit'; credit_only.push(m); continue; }
    let s = roundHalfUp(V.start[m][L] * factor);
    let c = Math.max(roundHalfUp(V.cap[m][L] * factor), s + roundHalfUp((V.cap[m][L] - V.start[m][L]) * factor));
    if (d.priority_muscles.includes(m)) { s += V.priority.add[L]; c = (V.priority.cap[m] || V.priority.cap.default)[L]; }
    if (painMuscles.includes(m)) s = roundHalfUp(s * V.pain.start_factor);
    start[m] = s; cap[m] = Math.max(c, s); fill[m] = 'target';
  }
  return { modifier_id: sel.use, start, cap, fill, priority: d.priority_muscles.slice(), pain_muscles: painMuscles.filter(m => m in fill), floored: [], credit_only,
    calves_per_leg_day: V.calves.per_leg_day[L], core_block: { exercises: V.core_block.exercises, sets: V.core_block.sets }, why: {} };
}

/** @returns {import('../../engine/util.mjs').Shape} */
export function buildShape(d, model) {
  const R = model.rules, mode = d.D5_plan_shape.mode, W = d.D5_plan_shape.weeks, L = d.D3_client_level.level;
  const maint = mode === 'maintenance_4_6';
  const tb = maint
    ? { n: 1, type: 'maintenance', weeks: [1, W], stair_N: null, first_exercise_block: 1, label_key: 'plan.block_type.maintenance',
      factor: { factor: Math.max(R.plan_types.maintenance_4_6.factor[d.maint_reason] ?? R.plan_types.maintenance_4_6.older_floor, d.age >= R.population.older.from_age ? R.plan_types.maintenance_4_6.older_floor : 0) } }
    : { n: 1, type: 'stairway', weeks: [1, W], stair_N: W, first_exercise_block: 1, label_key: 'plan.block_type.stairway', factor: null };
  const ebs = (maint ? [[1, W]] : R.stairway.exercise_blocks_by_N[String(W)]).map((r, i) => ({ n: i + 1, training_block: 1, weeks: [r[0], r[1]] }));
  const stair = maint ? null : model.stair(W);
  const athlete = d.D1_family === 'athletic';
  const circuit = d.D6_week_layout.format === 'bootcamp' && d.D1_family === 'fat_loss_bootcamp';
  const B = R.supersets.bootcamp.stairway;
  const weeks = [];
  for (let n = 1; n <= W; n++) {
    const eb = ebs.find(e => n >= e.weeks[0] && n <= e.weeks[1]);
    const ws = { n, training_block: 1, block_type: tb.type, exercise_block: eb.n, stair_week: maint ? null : n, stair_level: maint ? null : stair.display_level[n], standard_step: null, phase: 'MAINTENANCE', phase_key: 'plan.phase.MAINTENANCE', planned_rir: { min: R.effort.by_block_type.maintenance.min, max: R.effort.by_block_type.maintenance.max, intensifiers: false },
      season_phase: null, rep_phase: null, plyo_stage: null, test: null, circuit: null, is_exercise_block_start: n === eb.weeks[0], is_training_block_start: n === 1, is_last_stair_week: !maint && n === W, why: [why('why.no_checkin_planned', 'R2-VOL-03')] };
    if (!maint) {
      const ph = Object.entries(stair.phases[L] || stair.phases.L2).find(([, r]) => r && n >= r[0] && n <= r[1]);
      ws.phase = ph ? ph[0] : 'DRIVE'; ws.phase_key = 'plan.phase.' + ws.phase;
      const pe = R.effort.planned_map[stair.planned_effort[n]];
      ws.planned_rir = { min: pe.min, max: pe.max, intensifiers: !!pe.intensifiers };
      if (n > 1) ws.standard_step = { early: R.stairway.standard_steps.early, late: R.stairway.standard_steps.late, this_week: stair.standard_steps[n] };
      if (d.D13_tests.items.length && (n === 1 || n === W)) ws.test = { type: n === 1 ? 'baseline' : 'end', items: d.D13_tests.items.slice(), from_zero: n === 1 ? d.D13_tests.from_zero : false };
      if (athlete) {
        const ph2 = R.reps.athlete_vol_phases.by_exercise_block;
        ws.rep_phase = ph2[Math.min(eb.n, ph2.length) - 1];
        const rc = Object.entries(stair.rc_weeks).find(([, r]) => r && n >= r[0] && n <= r[1]);
        ws.plyo_stage = rc ? rc[0] : 'RC1';
      }
      if (circuit) {
        const rounds = Math.min(B.rounds_max_by_minutes[String(d.session_minutes)] ?? B.rounds_start, d.session_minutes <= 45 ? B.rounds_start : 99);
        if (B.by_planned_steps) {
          // v1.2 (D-19 revised): the planned steps on the work seconds, lambda-scaled to the top, 1-s steps (engine/shape.mjs)
          ws.circuit = { rounds, work_s: circuitWorkSeconds(W, stair.standard_steps, B)[n - 1] };
        } else ws.circuit = { rounds, work_s: Math.round((B.work_s_start + (B.work_s_max - B.work_s_start) * (ws.stair_level - 2) / 9) / 5) * 5 };
      }
    }
    weeks.push(ws);
  }
  return { mode, skeleton: d.D5_plan_shape.skeleton, weeks_total: W, open_ended: mode === 'week_by_week', training_blocks: [tb], exercise_blocks: ebs, weeks,
    after_plan: { next: 'block_choice', weeks: null, date: null } };
}

/** planned T(w) per target muscle @returns {{lambda:Object<string,number>, steps:Object<string,number[]>, T:Object<string,number[]>}} */
export function stairwayPlan(targets, tb, d, model) {
  const R = model.rules, out = { lambda: {}, steps: {}, T: {} };
  if (tb.type !== 'stairway') return out;
  const stair = model.stair(tb.stair_N), L = R.stairway.limits;
  for (const m of Object.keys(targets.start)) {
    if (typeof targets.start[m] !== 'number' || typeof targets.cap[m] !== 'number') continue;
    const caps = [L.planned_step_max];
    // v0.4 (R3-VOL-03): Focus muscles never slow the others; the 60+ planned-step cap is retired (stage A, R3)
    if (targets.priority.length && !targets.priority.includes(m) && !(R.volume.focus && R.volume.focus.slow_others === false)) caps.push(L.nonpriority_while_priority);
    if (d.age >= R.population.older.from_age && !L.older_cap_retired) caps.push(L.older_60plus);
    const pain = targets.pain_muscles.includes(m);
    const p = plannedStairway({ start: targets.start[m], cap: targets.cap[m] }, tb.stair_N, { early_late: stair.standard_steps, caps, freeze: pain ? R.volume.pain.freeze_weeks : 0, after_freeze: pain ? L.pain_after_freeze : null, iterations: R.stairway.lambda.iterations });
    out.lambda[m] = p.lambda; out.steps[m] = p.steps; out.T[m] = p.T;
  }
  return out;
}

const slotsOf = (layout) => layout.days.flatMap(d => d.blocks.flatMap(b => b.slots.map(s => ({ s, d }))));

/** weekly credited sets {muscle: number} */
export function weeklyCredits(layout, setsBySlot, fillsBySlot, model) {
  const out = {};
  for (const m of model.rules.muscles.order) out[m] = 0;
  for (const { s } of slotsOf(layout)) {
    const f = fillsBySlot[s.slot_id], n = setsBySlot[s.slot_id] || 0;
    if (!f || !f.exercise_id || !n) continue;
    const ex = model.ex(f.exercise_id);
    if (ex.tags.some(t => model.rules.credit.never_credit_tags.includes(t))) continue;
    for (const [m, v] of Object.entries(model.credits(ex, f.bucket))) out[m] = (out[m] || 0) + n * v;
  }
  for (const m of Object.keys(out)) out[m] = round2(out[m]);
  return out;
}

/** @returns {import('../../engine/util.mjs').VolumePlan} */
export function planWeeklySets(ctx) {
  const { derived: d, shape, layouts, selections, model } = ctx;
  const R = model.rules;
  const weeks = [];
  let prevTotal = null;
  for (const ws of shape.weeks) {
    const layout = layouts[ws.training_block - 1];
    const sel = selections[ws.exercise_block - 1];
    const tb = shape.training_blocks[ws.training_block - 1];
    const sp = stairwayPlan(d.D9_start_sets, tb, d, model);
    const sets = {};
    let total = 0;
    const direct = {};
    for (const { s } of slotsOf(layout)) {
      const bd = model.bucket(s.bucket);
      if (s.text_key || ['warmup', 'aerobic', 'skill'].includes(bd.kind) || s.bucket === 'COND_WOD') continue;
      const f = sel.fills[s.slot_id];
      if (!f || !f.exercise_id) { sets[s.slot_id] = 0; continue; }
      let n = s.sets_hint ? s.sets_hint[d.session_minutes >= 90 ? 1 : 0] : s.default_sets;
      if (ws.circuit && s.circuit) n = ws.circuit.rounds;
      sets[s.slot_id] = n;
      if (RES_KINDS.includes(bd.kind)) total += n;
      const ex = model.ex(f.exercise_id);
      for (const [m, v] of Object.entries(model.credits(ex, f.bucket))) if (v === 1 && RES_KINDS.includes(bd.kind)) direct[m] = (direct[m] || 0) + n;
    }
    const weekly = weeklyCredits(layout, sets, sel.fills, model);
    const target = {}, step = {};
    for (const m of R.muscles.order) {
      if (!(m in d.D9_start_sets.fill) || d.D9_start_sets.fill[m] === 'core_block') continue;
      const st = d.D9_start_sets.start[m];
      target[m] = typeof st !== 'number' ? null : (sp.T[m] ? round2(sp.T[m][ws.stair_week]) : st);
      if (typeof st === 'number') step[m] = sp.steps[m] && ws.stair_week ? sp.steps[m][ws.stair_week] : 0;
    }
    const est = {};
    for (const day of layout.days) est[day.weekday] = estimateMinutes(day, sets, sel.fills, model);
    weeks.push({ n: ws.n, sets_by_slot: sets, added_slots: [], supersets_on: Object.fromEntries(layout.days.map(x => [x.weekday, false])), target_by_muscle: target,
      weekly_sets_by_muscle: weekly, direct_sets_by_muscle: Object.fromEntries(R.muscles.order.map(m => [m, round2(direct[m] || 0)])), step_by_muscle: step,
      total_resistance_sets: total, rise_vs_prev: prevTotal ? (total - prevTotal) / prevTotal : null, banks: {}, est_minutes: est,
      changes: ws.is_exercise_block_start && ws.n > 1 ? [{ key: 'changes.new_exercise_block', args: {} }] : [], shortfalls: [], why: [] });
    prevTotal = total;
  }
  return { weeks, athletic: athleticBudget(d, shape, model), warnings: [] };
}

/** @returns {import('../../engine/util.mjs').AthleticBudget[]} */
export function athleticBudget(d, shape, model) {
  const A = d.D11_athletic_budget;
  return shape.weeks.map(ws => {
    const N = shape.training_blocks[ws.training_block - 1].stair_N || 1;
    const f = N > 1 && ws.stair_week ? (ws.stair_week - 1) / (N - 1) : 0;
    const lerp = (r) => (Array.isArray(r) ? Math.round(r[0] + (r[1] - r[0]) * f) : null);
    const w = A.weekly || {};
    return { n: ws.n, enabled: !!A.enabled, plyo_share: A.enabled && A.plyo_share ? round2(A.plyo_share.start + (A.plyo_share.end - A.plyo_share.start) * f) : null,
      stage: ws.plyo_stage, factor: 1,
      targets: { plyo_contacts: lerp(w.plyo_contacts), jump_contacts: lerp(w.jump_contacts), low_contacts: lerp(w.low_contacts), throws: lerp(w.throws), cod_cuts: lerp(w.cod_cuts), sprint_m: lerp(w.sprint_m), olympic_sets: lerp(w.olympic_sets) },
      contacts_session_max: A.contacts_session_max };
  });
}

// ------------------------------------------------------------------------------------------------------------- week

function programIdFor(d, model) {
  const D6 = d.D6_week_layout;
  const sd = model.sport(d.D2_profile.id);
  const ctx = { family: D6.family, days: D6.days, variant: D6.variant, goal: d.goal, format: d.format, competitive: d.D2_profile.competitive, profile_family: sd.family };
  const hit = model.templates.program_names.find(p => Object.entries(p.when).every(([k, v]) => v.includes(ctx[k])));
  return hit ? hit.id : null;
}

/** @returns {import('../../engine/util.mjs').WeekLayout} */
export function buildWeekLayout(d, shape, tb, model) {
  const R = model.rules, D6 = d.D6_week_layout;
  const t = model.template(D6.family, D6.days);
  const { week_layout, day_types } = model.dayTypes(t, D6.variant);
  const planned = WEEKDAYS.filter(wd => week_layout[wd] && week_layout[wd].kind === 'main' && !week_layout[wd].optional && week_layout[wd].day_type);
  const older = d.age >= R.population.older.from_age && !d.prefs.older_athletic_opt_in;
  const days = [];
  planned.forEach((twd, i) => {
    const wd = d.weekdays[i];
    if (!wd) return;
    const dtId = week_layout[twd].day_type, dt = day_types[dtId];
    const keep = dt.stations.filter(st => (st.include_from_minutes === null || st.include_from_minutes <= d.session_minutes) && !st.condition
      && !(older && st.older_default_excluded) && !SKIP_BUCKETS.includes(st.bucket));
    // R2-SES-05: a muscle group never holds a single exercise; the stub drops a lone non-work station instead of adding one
    const count = {};
    for (const st of keep) if (st.group && RES_KINDS.includes(model.bucket(st.bucket).kind) && !R.session.exercises_per_group.exempt_groups.includes(st.group)) count[st.group] = (count[st.group] || 0) + 1;
    const stations = keep.filter(st => !(st.group && count[st.group] === 1 && RES_KINDS.includes(model.bucket(st.bucket).kind) && st.role !== 'work' && !R.session.exercises_per_group.exempt_groups.includes(st.group)));
    const calfSeen = { n: 0 };
    const blocks = [];
    for (const kind of R.ordering.block_order) {
      const slots = stations.filter(st => st.block === kind).map(st => slotDef(st, wd, d, model, calfSeen));
      if (!slots.length) continue;
      if (kind === 'circuit') for (const c of [...new Set(slots.map(s => s.circuit || 1))].sort()) blocks.push({ kind, movable: false, circuit: c, slots: slots.filter(s => (s.circuit || 1) === c) });
      else blocks.push({ kind, movable: kind === 'core', circuit: null, slots });
    }
    days.push({ weekday: wd, day_type: dtId, kind: 'main', optional: false, label_key: dt.label_key, lower_focus: dt.lower_focus, full_body: !!dt.full_body,
      format: dt.format || 'straight', minutes_limit: d.session_minutes, supersets_on: false, est_minutes: 0, groups: dt.groups || [], blocks, why: [why('why.template', 'VOL-08', { template: t.id })] });
  });
  for (const wd of d.play_days || []) if (!days.some(x => x.weekday === wd)) days.push({ weekday: wd, day_type: null, kind: 'play', optional: false, label_key: 'ui.plan.play_day', lower_focus: null, full_body: false, format: 'straight', minutes_limit: 0, supersets_on: false, est_minutes: 0, groups: [], blocks: [], why: [] });
  days.sort((a, b) => WEEKDAYS.indexOf(a.weekday) - WEEKDAYS.indexOf(b.weekday));
  return { template_id: t.id, variant: D6.variant, family: D6.family, pairing: D6.pairing, program_id: programIdFor(d, model), training_block: tb.n, days,
    off_days: WEEKDAYS.filter(x => !days.some(y => y.weekday === x)), play_days: (d.play_days || []).slice(), why: [why('why.template', 'VOL-08', { template: t.id })] };
}

function slotDef(st, wd, d, model, calfSeen) {
  const R = model.rules, bd = model.bucket(st.bucket), S = R.session.default_sets;
  let def = bd.kind === 'core' ? S.core : ATHLETIC_KINDS.includes(bd.kind) ? (d.session_minutes >= 90 ? S.athletic_at_90 : S.athletic) : bd.kind === 'resistance' ? S.compound : S.isolation;
  if (st.bucket === 'ISO_CALF') def = calfSeen.n++ === 0 ? S.calves_first : S.calves_second;
  return { slot_id: wd + '.' + st.id, station_id: st.id, bucket: st.bucket, role: st.role, block: st.block, group: st.group, sets_hint: st.sets_hint, default_sets: def,
    pair: st.pair, superset: st.superset, circuit: st.circuit, axial_req: st.axial, variant: st.variant, laterality_dial: !!st.laterality_dial, loading: st.loading,
    focus_muscle: null, time_class: bd.time_class || 'isolation', counts_in_cap: !R.session.outside_cap_blocks.includes(st.block), counts_as_volume: st.counts_as_volume !== false,
    text_key: st.bucket === 'WARMUP_GENERAL' ? R.warmup.general.text_key : null, aerobic: null, origin: 'template', why: [] };
}

/** @returns {import('../../engine/util.mjs').WeekLayout} */
export function layoutForWeek(base) { return base; }

/** @returns {number} */
export function estimateMinutes(day, setsBySlot, fills, model) {
  const TM = model.rules.time_model;
  let min = 0;
  for (const b of day.blocks || []) for (const s of b.slots || []) {
    if (s.time_class === 'warmup_session') { min += TM.minutes_per_set.warmup_session; continue; }
    const n = setsBySlot[s.slot_id] || 0;
    if (!n) continue;
    min += n * (TM.minutes_per_set[s.time_class] || TM.minutes_per_set.isolation) + TM.changeover_min_per_exercise;
  }
  return Math.round(min);
}

// ------------------------------------------------------------------------------------------------------------- select

function filtered(slot, ctx, used, poolOverride) {
  const { derived: d, model, exerciseBlock } = ctx, R = model.rules;
  const kit = { tokens: d.D8_kit.tokens, machines: d.D8_kit.machines };
  const ladder = R.levels.ladder_order.indexOf(d.D3_client_level.exercise_ladder);
  const older = d.age >= R.population.older.from_age;
  const youth = d.age < R.levels.youth_age;
  const L = d.D3_client_level.level;
  const neverOlder = [...R.population.older.never_tags, ...R.population.older.never_tags_phase0_even_with_opt_in];
  return (poolOverride || model.bySlot(slot.bucket)).filter(e => {
    if (!model.kitAvailable(e, kit)) return false;
    if (e.tags.includes('v_squat') || (e.tags.includes('kb_swing') && slot.bucket.startsWith('RP_'))) return false;
    if (/proposed/.test(e.status)) return false;
    if (R.levels.ladder_order.indexOf(e.level) > ladder) return false;
    if (older && (neverOlder.some(t => e.tags.includes(t)) || !(d.prefs.older_athletic_opt_in ? e.older_opt_in_ok : e.older_ok))) return false;
    if (older && !d.prefs.older_athletic_opt_in && (e.tags.includes('loaded_jump') || (e.athletic && ['plyometric', 'olympic'].includes(e.athletic.quality)) || (slot.bucket === 'AP_PLYO' && (!e.athletic || e.athletic.quality !== 'landing')))) return false;
    if (d.D7_constraint_band.client_family === 'older_or_pain' && neverOlder.some(t => e.tags.includes(t))) return false;
    if (youth && e.tags.includes('olympic_from_floor')) return false;
    if (e.tags.includes('olympic_from_floor') && !d.D8_kit.tokens.includes('barbell_bumpers_platform')) return false;
    if ((e.tags.includes('medball') || e.medball) && (d.goal === 'muscle' && slot.block !== 'warmup')) return false;
    if (e.medball && (d.D8_kit.medball_max_lb === null || e.medball.min_lb > d.D8_kit.medball_max_lb)) return false;
    if (slot.bucket === 'AP_TRIPLE_EXT') {
      const fam = e.athletic && e.athletic.olympic_family;
      if (slot.variant && fam && R.olympic.day_pattern[fam] !== R.olympic.day_pattern[slot.variant]) return false;
      const tier = e.athletic && e.athletic.olympic_tier;
      if (tier === 'L2_plus' && !(L === 'L3' || (L === 'L2' && exerciseBlock >= 2))) return false;
    }
    if (slot.bucket === 'ISO_SIDE_REAR_DELT' && slot.variant) {
      const want = { side: ['ISO_SIDE'], rear: ['ISO_REAR', 'FACEPULL'], front: ['ISO_FRONT'] }[slot.variant] || [];
      if (!want.includes(e.credit_class) || (slot.variant === 'rear' && /front-raise/.test(e.id))) return false;
    }
    if (slot.axial_req === 'axial' && !e.axial) return false;
    if (slot.axial_req !== 'axial' && e.axial) return false;
    if (used && used.has(slot.bucket + '|' + e.id)) return false;
    return true;
  });
}

/** scored candidate list @returns {Array<{exercise_id:string, score:number, reasons:object[]}>} */
export function candidates(slot, ctx, used) {
  let pool = filtered(slot, ctx, used);
  if (!pool.length && used) pool = filtered(slot, ctx, null);                        // second exposure: repeat rather than drop
  if (!pool.length && ['resistance', 'isolation'].includes(ctx.model.bucket(slot.bucket).kind)) {
    // substitution: any non-athletic record whose prime mover is a muscle of the slot's group (never a counted spine lift)
    const ms = slot.group ? ctx.model.groupMembers(slot.group) : [];
    const subs = ctx.model.exercises().filter(e => !e.is_athletic && e.credit_class !== 'CORE' && ms.includes(e.primary_muscle));
    pool = filtered({ ...slot, axial_req: 'non_axial' }, ctx, null, subs);
  }
  return pool.map(e => ({ exercise_id: e.id, score: (ctx.model.isDefaultIn(e, slot.bucket) ? ctx.model.rules.selection.weights.default_in_slot : 0) + (e.default_in_slots.length ? 0.5 : 0), reasons: [why('why.default_pick', 'CAT-07')] }))
    .sort((a, b) => b.score - a.score || (a.exercise_id < b.exercise_id ? -1 : 1));
}

/** @returns {import('../../engine/util.mjs').SlotFill} */
export function fillSlot(slot, ctx, used) {
  const list = candidates(slot, ctx, used);
  const pick = list[0] ? ctx.model.ex(list[0].exercise_id) : null;
  return { slot_id: slot.slot_id, bucket: slot.bucket, exercise_id: pick ? pick.id : null, detail: null, swaps: list.slice(1, 4).map(c => c.exercise_id),
    laterality: pick ? pick.laterality : null, loading: null, why: pick ? [why('why.default_pick', 'CAT-07')] : [], flags: pick ? (pick.axial ? ['axial_counted'] : []) : ['no_candidate'] };
}

/** @returns {import('../../engine/util.mjs').Selection} */
export function selectBlock(ctx) {
  const { layout, model } = ctx;
  const fills = {}, buy = new Set(), used = new Set();
  const counted = { squat: null, hinge: null };
  for (const day of layout.days) for (const b of day.blocks) for (const s of b.slots) {
    if (s.text_key) continue;
    let slot = s;
    if (s.axial_req === 'axial') {
      const p = model.bucket(s.bucket).axial_pattern;
      const other = p === 'squat' ? counted.hinge : counted.squat;
      if (counted[p] || other === day.weekday) slot = { ...s, axial_req: 'non_axial' };
    }
    const f = fillSlot(slot, ctx, used);
    fills[s.slot_id] = f;
    if (f.exercise_id) {
      used.add(s.bucket + '|' + f.exercise_id);
      const ex = model.ex(f.exercise_id);
      if (ex.axial) counted[ex.axial_pattern] = day.weekday;
    } else for (const tkn of model.rules.equipment.buy_list[s.bucket] || []) buy.add(tkn);
  }
  return { exercise_block: ctx.exerciseBlock, fills, buy_list: [...buy].sort(), why: [] };
}

// ------------------------------------------------------------------------------------------------------------- dose

/** @returns {string} */
export function repClassFor(slot, exercise, model) {
  const bd = model.bucket(slot.bucket);
  if (bd.kind === 'prehab') return 'prehab';
  if (bd.kind === 'resistance' && exercise) {
    if (exercise.constraint >= 4) return 'machine_stable_compound';
    if (['unilateral', 'alternating'].includes(exercise.laterality)) return 'unilateral_compound';
  }
  if (slot.bucket === 'ISO_SIDE_REAR_DELT' && exercise && ['ISO_REAR', 'FACEPULL'].includes(exercise.credit_class)) return 'rear_delts';
  return bd.rep_class === 'by_exercise' ? 'small_muscle_isolation' : bd.rep_class;
}

function bracketRange(model, b) { const x = model.rules.reps.brackets[b]; return { type: 'range', min: x.min, max: x.max, bracket: b }; }

/** @returns {import('../../engine/util.mjs').Dose} */
export function doseItem(input) {
  const { slot, exercise: ex, sets, week: ws, derived: d, position, model } = input;
  const R = model.rules, bd = model.bucket(slot.bucket);
  const rc = repClassFor(slot, ex, model);
  const col = R.reps.goal_column[d.goal];
  const band = R.effort.rir_band;
  const out = { reps: null, set_reps: null, effort: null, rest: null, load: null, tempo_key: null, athletic: null, circuit: null, wod: null, notes: [], why: [why('why.reps_matrix', 'VOL-11')] };
  if (bd.kind === 'athletic') {
    const unit = bd.athletic_unit;
    const stage = ws.plyo_stage || 'RC1';
    const per = unit === 'contacts' ? R.reps.matrix.plyo[stage].contacts_per_set[0] : unit === 'throws' ? R.reps.matrix.throw.reps_per_side : unit === 'cuts' ? R.reps.matrix.cod.reps[0] : R.reps.matrix.sprint.metres[0];
    out.reps = unit === 'contacts' ? { type: 'contacts', value: per } : unit === 'throws' ? { type: 'throws_per_side', value: per } : unit === 'cuts' ? { type: 'cuts', value: per } : { type: 'metres', value: per };
    out.effort = { type: 'intent', key: R.effort.athletic.key };
    out.rest = unit === 'contacts' ? { type: 'work_rest', min: R.rest.plyo_work_rest[0], max: R.rest.plyo_work_rest[1] } : { type: 'seconds', min: R.rest.throw_s[0], max: R.rest.throw_s[1] };
    out.athletic = { unit, per_set: per, total: per * (sets || 0) * (unit === 'throws' ? 2 : 1), stage: ws.plyo_stage, quality: (ex && ex.athletic && ex.athletic.quality) || 'ballistic' };
    if (ex && ex.medball && d.D8_kit.medball_max_lb) {
      const M = R.medball, kind = M.loads_lb[ex.medball.kind] || [ex.medball.min_lb, ex.medball.max_lb];
      const minus = d.age < R.levels.youth_age || d.age >= R.population.older.from_age ? M.youth_older_minus_lb : 0;
      const hi = Math.max(M.min_lb, Math.min(kind[1] - minus, d.D8_kit.medball_max_lb, M.max_lb));
      out.load = { type: 'medball_lb', min: Math.min(Math.max(M.min_lb, kind[0] - minus), hi), max: hi };
    }
    return out;
  }
  if (bd.kind === 'power') {
    out.reps = bracketRange(model, R.reps.matrix.olympic[d.D3_client_level.level].bracket);
    out.effort = { type: 'power', key: R.effort.olympic.key };
    out.rest = { type: 'seconds', min: R.rest.olympic_s[0], max: R.rest.olympic_s[1] };
    out.load = { type: 'power' };
    out.notes.push({ key: 'note.olympic_power' });
    return out;
  }
  if (bd.kind === 'prehab') { out.reps = bracketRange(model, R.reps.matrix.prehab.bracket); out.effort = { type: 'intent', key: 'effort.prehab' }; out.rest = { type: 'seconds', min: R.rest.prehab_s[0], max: R.rest.prehab_s[1] }; return out; }
  const planned = ws.planned_rir;
  const neverFail = R.effort.never_failure_rep_classes.includes(rc);
  const lo = Math.max(clamp(planned.min, band[0], band[1]), neverFail ? R.effort.compound_floor_rir : band[0]);
  const hi = Math.max(clamp(planned.max, band[0], band[1]), lo);
  const rpe = (r) => R.effort.rpe_for_rir[String(r)];
  if (bd.kind === 'core') {
    const cm = R.reps.matrix.core[col] || R.reps.matrix.core.general;
    out.reps = cm.seconds ? { type: 'seconds', min: cm.seconds[0], max: cm.seconds[1] } : bracketRange(model, cm.bracket);
    out.effort = { type: 'rir', min: band[1], max: band[1], rpe_min: rpe(band[1]), rpe_max: rpe(band[1]), last_set: null, intensifier: false };
    out.rest = { type: 'seconds', min: R.rest.core_s[0], max: R.rest.core_s[1] };
    return out;
  }
  const m = R.reps.matrix[rc] && (R.reps.matrix[rc][col] || R.reps.matrix[rc].general);
  let bracket = 'b10_15';
  if (m) {
    if (m.bracket) bracket = m.bracket;
    else if (m.by_exercise_block) bracket = m.by_exercise_block[Math.min(ws.exercise_block, m.by_exercise_block.length) - 1];
    else if (m.vol_phase && ws.rep_phase) bracket = R.reps.athlete_vol_phases[ws.rep_phase].compound;
    else if (m.template) bracket = 'b6_8';
  }
  const range = bracketRange(model, bracket);
  out.reps = m && m.per_side ? { type: 'per_side', min: range.min, max: range.max } : range;
  if (m && m.per_side) out.notes.push({ key: 'note.per_side' });
  out.effort = { type: 'rir', min: lo, max: hi, rpe_min: rpe(hi), rpe_max: rpe(lo), last_set: null, intensifier: !!planned.intensifiers };
  out.rest = position.superset_active ? { type: 'after_pair' } : bd.kind === 'resistance' ? { type: 'seconds', min: R.rest.hypertrophy_s[0], max: R.rest.hypertrophy_s[1] } : { type: 'seconds', min: R.rest.isolation_s[0], max: R.rest.isolation_s[1] };
  if (ws.stair_week === 1 && slot.role === 'work') { out.load = { type: 'week1_tip' }; }
  if (ws.test && slot.role === 'work' && ws.test.items.includes('strength')) {
    const cat = R.tests.catalogue.strength[ws.test.from_zero ? 'from_zero' : 'after_completed_block'];
    out.test = { type: 'test', test: cat[d.D3_client_level.level] };
  }
  out.why.push(why('why.planned_rir', 'R2-PER-05', { rir: lo === hi ? String(lo) : lo + '-' + hi }));
  return out;
}

/** @returns {import('../../engine/util.mjs').Dose} */
export function doseAerobic(slot, ws, d, model) {
  const colour = (slot.aerobic && slot.aerobic.colour) || 'C';
  const mins = model.rules.conditioning.minutes[colour];
  return { reps: { type: 'minutes', min: mins[0], max: mins[1] }, set_reps: null, effort: { type: 'aerobic', colour }, rest: null, load: null, tempo_key: null, athletic: null, circuit: null, wod: null, notes: [{ key: 'note.any_erg' }], why: [] };
}

/** @returns {import('../../engine/util.mjs').Dose} */
export function doseConditioning(slot, fill, ws, d, model) {
  const R = model.rules;
  const base = { reps: null, set_reps: null, effort: null, rest: null, load: null, tempo_key: null, athletic: null, circuit: null, wod: null, notes: [], why: [] };
  if (slot.bucket === 'COND_WOD') return { ...base, wod: { format: R.conditioning.wod.formats[0], minutes: R.conditioning.wod.minutes.slice(), stations: [] }, effort: { type: 'intent', key: 'effort.wod' }, notes: [{ key: 'note.wod' }], why: [why('why.wod', 'OBSERVED OT18')] };
  if (slot.bucket === 'SKILL') return { ...base, reps: { type: 'minutes', min: R.reps.matrix.skill.minutes[0], max: R.reps.matrix.skill.minutes[1] }, effort: { type: 'intent', key: 'effort.max_intent' } };
  const c = ws.circuit || { rounds: R.supersets.bootcamp.stairway.rounds_start, work_s: R.supersets.bootcamp.stairway.work_s_start };
  return { ...base, reps: { type: 'rounds_work', rounds: c.rounds, work_s: c.work_s }, circuit: { rounds: c.rounds, work_s: c.work_s, transition_s: R.supersets.bootcamp.transition_s },
    effort: { type: 'intent', key: 'effort.circuit' }, rest: { type: 'circuit', transition_s: R.supersets.bootcamp.transition_s, between_rounds_s: R.supersets.bootcamp.between_rounds_s }, why: [why('why.circuit_stairway', 'PRG-03', { from: R.supersets.bootcamp.stairway.work_s_start, to: R.supersets.bootcamp.stairway.work_s_max })] };
}

/** every B2 / B3 export, for generateWith(STUB_DEPS, …) */
export const STUB_DEPS = Object.freeze({
  validateIntake, safetyScreen, checkRelease, deriveValues, buildShape, computeTargets, stairwayPlan, planWeeklySets, athleticBudget, weeklyCredits,
  buildWeekLayout, layoutForWeek, estimateMinutes, selectBlock, fillSlot, candidates, doseItem, doseAerobic, doseConditioning, repClassFor
});
