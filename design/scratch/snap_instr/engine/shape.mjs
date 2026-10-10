// engine/shape.mjs - plan shape: training blocks (stairway / pre-season / taper / in-season / maintenance / recovery), exercise
// blocks, stairway fields per week, tests and circuits (engine/CONTRACTS.md §4.4; D-10, D-19, D-25, D-26, D-40). Owner: B2.
// Pure: no I/O, no clock, no randomness. H15: nothing is ever inserted inside a stairway block.
import { EngineError, WEEKDAYS, why, round2, roundHalfUp, weeksBetween } from './util.mjs';
import { stagesForStairway } from './athletic.mjs';

/** @typedef {import('./util.mjs').Why} Why */

const FLAT_PHASE = { pre_season: 'PRE_SEASON', taper: 'TAPER', in_season: 'IN_SEASON', maintenance: 'MAINTENANCE', recovery: 'RECOVERY' };
const STAGE_NEXT = { RC1: 'RC2', RC2: 'RC3' }; // Receive-Create one stage up (R2-ATH-03; F2 pre-season advance)

function phaseForWeeks(W, model) {
  const th = Object.entries(model.rules.plan_types.season.weeks_to_season).sort((a, b) => b[1] - a[1]);
  if (W < 0) return 'IN';
  for (const [phase, min] of th) if (W >= min) return phase;
  return th[th.length - 1][0];
}

function maintFactor(derived, model) {
  const M = model.rules.plan_types.maintenance_4_6;
  let f = M.factor[derived.maint_reason];
  if (typeof f !== 'number') f = M.factor.planned_maintenance;
  if (derived.age >= model.rules.population.older.from_age) f = Math.max(f, M.older_floor);
  return { factor: f, reason: derived.maint_reason };
}

/**
 * Training-block layout of the plan (shared by shape and intake.deriveValues for D13 / V6).
 * @param {import('./util.mjs').Derived} derived  (needs D2, D4, D5, start_date, event_date, age, maint_reason)
 * @param {object} model
 * @returns {{training_blocks:Array<{type:string, weeks:[number,number], factor:Object|null}>, weeks_total:number, open_ended:boolean,
 *            after_plan:{next:'pre_season'|'pre_season_rest'|'block_choice'|'maintenance_end', weeks:number|null, date:string|null}}}
 */
export function planTrainingBlocks(derived, model) {
  const R = model.rules, PT = R.plan_types, SE = PT.season, PF = R.volume.phase_factors;
  const D5 = derived.D5_plan_shape, D4 = derived.D4_season_phase || {};
  const mode = D5.mode, N = D5.weeks;
  if (!Number.isInteger(N) || N < 1) throw new EngineError('shape.bad_weeks', `plan weeks ${N}`);
  const blocks = [];
  const push = (type, a, b, factor = null) => { if (b >= a) blocks.push({ type, weeks: [a, b], factor }); };
  const preF = { of: PF.pre_season.of, factor: PF.pre_season.factor };
  const taperF = { of: PF.taper.of, factor: PF.taper.factor };
  const inF = { modifier: PF.in_season.modifier };
  let after = { next: 'block_choice', weeks: null, date: null };
  let weeks_total = N;
  const open_ended = mode === 'week_by_week';
  const minOff = SE.min_offseason_stairway_weeks;

  if (mode === 'maintenance_4_6') {
    push('maintenance', 1, N, maintFactor(derived, model));
    after = { next: 'maintenance_end', weeks: null, date: null };
  } else if (mode === 'year') {
    // D-26: Q1 stairway, recovery, Q2, recovery, Q3 maintenance, Q4 stairway, holidays; a recovery week next to a maintenance
    // block is skipped (rules.recovery.skip_when_maintenance_adjacent): the maintenance replaces it (R2-VOL-07, V24)
    const lay = PT.year.layout.map(x => ({ ...x, weeks: x.weeks.slice() }));
    const kept = [];
    for (let k = 0; k < lay.length; k++) {
      const b = lay[k];
      if (b.type === 'recovery' && R.recovery.skip_when_maintenance_adjacent) {
        const next = lay[k + 1], prev = kept[kept.length - 1];
        if (next && next.type === 'maintenance') { next.weeks[0] = b.weeks[0]; continue; }
        if (prev && prev.type === 'maintenance') { prev.weeks[1] = b.weeks[1]; continue; }
      }
      kept.push(b);
    }
    const older = derived.age >= R.population.older.from_age;
    for (const b of kept) {
      const extra = {};
      for (const [k, v] of Object.entries(b)) if (k !== 'type' && k !== 'weeks') extra[k] = v;
      if (b.type === 'maintenance' && typeof extra.factor === 'number' && older) extra.factor = Math.max(extra.factor, PT.maintenance_4_6.older_floor);
      if (b.type === 'recovery') { extra.sets_factor = R.recovery.sets_factor; extra.of = R.recovery.of; }
      push(b.type, b.weeks[0], b.weeks[1], Object.keys(extra).length ? extra : null);
    }
    weeks_total = Math.max(...kept.map(b => b.weeks[1]));
  } else if (D5.overlay === 'season' && D4.phase === 'IN') {
    // in season now; when the in-season ends inside the plan and >= 4 weeks remain, an off-season stairway follows (INFERRED)
    const E = D4.in_season_until ? weeksBetween(derived.start_date, D4.in_season_until) : null;
    if (E === null || E >= N) push('in_season', 1, N, inF);
    else if (E <= 0) push('stairway', 1, N);
    else if (N - E >= minOff) { push('in_season', 1, E, inF); push('stairway', E + 1, N); }
    else push('in_season', 1, N, inF);
  } else if (D5.overlay === 'season' && D4.weeks_to_season !== null && D4.weeks_to_season !== undefined) {
    // D-10 season overlay
    const W = D4.weeks_to_season, pre = SE.pre_weeks_default;
    const noTaper = SE.no_taper_before_first_meet_season_types.includes(D4.season_type);
    const maxLen = Math.max(...Object.keys(SE.taper_weeks_by_pre_len).map(Number));
    const taperFor = (len) => (noTaper ? 0 : (SE.taper_weeks_by_pre_len[String(Math.min(Math.max(len, 1), maxLen))] || 0));
    const date = D4.season_date;
    if (W - pre >= N) {
      push('stairway', 1, N);
      after = W - pre === N ? { next: 'pre_season', weeks: pre, date } : { next: 'block_choice', weeks: null, date };
    } else if (W <= 0) {
      push('in_season', 1, N, inF);
      after = { next: 'block_choice', weeks: null, date };
    } else {
      let preStart, preLen;
      if (W - pre >= minOff) { push('stairway', 1, W - pre); preStart = W - pre + 1; preLen = pre; }
      else { preStart = 1; preLen = W; }
      const t = taperFor(preLen);
      push('pre_season', preStart, Math.min(N, W - t), preF);
      if (t > 0) push('taper', W - t + 1, Math.min(N, W), taperF);
      push('in_season', W + 1, N, inF);
      after = W > N ? { next: 'pre_season_rest', weeks: W - N, date } : { next: 'block_choice', weeks: null, date };
    }
  } else if (D5.overlay === 'prep') {
    // competition / event date (INFERRED: stairway to the week before, taper in the event week, plan ends at the event)
    const date = D4.competition_date || derived.event_date;
    const W = date ? weeksBetween(derived.start_date, date) : -1;
    const E = W + 1;
    const competitive = !!D4.competition_date;
    // COACH-R3 R3-ATH-01 (stage B2): a 2-week dryland taper lines up with the swim taper before the main championship meet
    const prof = derived.D2_profile && model.hasSport(derived.D2_profile.id) ? model.sport(derived.D2_profile.id) : null;
    const bySport = (PT.prep.taper_weeks_by_sport || {})[prof && prof.sport];
    const t = competitive ? (typeof bySport === 'number' ? bySport : PT.prep.taper_weeks[0]) : PT.prep.gen_pop_event.taper_weeks;
    const f = competitive ? taperF : { of: 'last_stairway_week_sets', factor: PT.prep.gen_pop_event.taper_factor };
    if (W >= 0 && E <= N && E - t >= minOff) {
      push('stairway', 1, E - t);
      push('taper', E - t + 1, E, f);
      weeks_total = E;
    } else push('stairway', 1, N);
    after = { next: 'block_choice', weeks: null, date: date || null };
  } else {
    push('stairway', 1, N);
  }
  for (const b of blocks) if (b.type === 'stairway') {
    const len = b.weeks[1] - b.weeks[0] + 1;
    if (len < 2 || !R.stairway.by_N[String(len)]) throw new EngineError('shape.bad_stairway', `stairway of ${len} weeks`);
  }
  return { training_blocks: blocks, weeks_total, open_ended, after_plan: after };
}

function phaseOf(ranges, w) {
  let found = null, lastStarted = null;
  for (const [label, r] of Object.entries(ranges || {})) {
    if (!r) continue;
    if (w >= r[0] && w <= r[1]) found = found || label;
    if (r[0] <= w) lastStarted = label;
  }
  return found || lastStarted || 'ACCLIMATION';
}

function plannedRir(effortKey, model) {
  const m = model.rules.effort.planned_map[effortKey];
  if (!m) throw new EngineError('shape.bad_effort', `no planned_map entry ${effortKey}`);
  return { min: m.min, max: m.max, intensifiers: !!m.intensifiers };
}

/**
 * v1.2 circuit stairway (D-19 revised): work seconds per stairway week. The planned steps (rules.stairway standard steps)
 * grow the start; when the product overshoots work_s_max the steps are scaled by one lambda (bisection) so week N lands on
 * the top; values are rounded to the fine step and forced to rise by at least one step a week while below the top.
 * @param {number} N stairway length @param {Object<string,number>} steps standard steps by week ('2'..'N') @param {object} CS
 *        rules.supersets.bootcamp.stairway @returns {number[]} work seconds for weeks 1..N
 */
export function circuitWorkSeconds(N, steps, CS, maxStep) {
  const fine = CS.work_s_fine_step || 1;
  const grow = (lam) => { const out = [CS.work_s_start]; for (let k = 2; k <= N; k++) out.push(out[k - 2] * (1 + lam * (steps[String(k)] || 0))); return out; };
  let lam = 1;
  if (grow(1)[N - 1] > CS.work_s_max) {
    let lo = 0, hi = 1;
    for (let i = 0; i < 40; i++) { const mid = (lo + hi) / 2; if (grow(mid)[N - 1] > CS.work_s_max) hi = mid; else lo = mid; }
    lam = lo;
  } else if (typeof maxStep === 'number' && grow(1)[N - 1] < CS.work_s_max) {
    // v0.4 fix round 1 (RECHECK 05 major: an 8-week circuit stopped at 46 s of its 50-s top): the planned steps scale UP so week N
    // reaches the top (COACH-R3 R3-VOL-04 'reaches its ceiling exactly in the last week'), never above the planned-step maximum
    const big = Math.max(...Object.values(steps).filter(x => typeof x === 'number'), 0);
    const hiLam = big > 0 ? maxStep / big : 1;
    if (grow(hiLam)[N - 1] >= CS.work_s_max) {
      let lo = 1, hi = hiLam;
      for (let i = 0; i < 40; i++) { const mid = (lo + hi) / 2; if (grow(mid)[N - 1] >= CS.work_s_max) hi = mid; else lo = mid; }
      lam = hi;
    } else lam = hiLam;
  }
  const raw = grow(lam);
  const out = [];
  for (let i = 0; i < N; i++) {
    let v = Math.min(CS.work_s_max, Math.round(raw[i] / fine) * fine);
    if (i > 0 && v <= out[i - 1] && out[i - 1] < CS.work_s_max) v = out[i - 1] + fine;
    // (fix round 1: the rounded seconds never step more than the planned-step maximum - 7 %, R2-VOL-01)
    if (i > 0 && typeof maxStep === 'number') v = Math.max(out[i - 1] + (out[i - 1] < CS.work_s_max ? fine : 0), Math.min(v, Math.floor(out[i - 1] * (1 + maxStep) / fine + 1e-9) * fine));
    out.push(Math.min(CS.work_s_max, v));
  }
  // (fix round 1: week N lands on the top - the earlier weeks are lifted from the top down so no step passes the planned maximum)
  if (typeof maxStep === 'number' && N > 1 && out[N - 1] < CS.work_s_max) {
    out[N - 1] = CS.work_s_max;
    for (let i = N - 2; i >= 0; i--) out[i] = Math.min(out[i + 1], Math.max(out[i], Math.ceil(out[i + 1] / (1 + maxStep) / fine - 1e-9) * fine));
  }
  return out;
}

/** true when the chosen template's main days are timed circuits (bootcamp, D-19) */
function isCircuitPlan(derived, model) {
  const D6 = derived.D6_week_layout;
  const t = model.template(D6.family, D6.days);
  const dt = model.dayTypes(t, D6.variant);
  return WEEKDAYS.some(d => { const e = dt.week_layout[d]; const x = e && e.day_type && dt.day_types[e.day_type]; return !!x && e.kind === 'main' && x.format === 'circuit'; });
}

function circuitRounds(minutes, model) {
  const S = model.rules.supersets.bootcamp.stairway;
  const keys = Object.keys(S.rounds_max_by_minutes).map(Number).sort((a, b) => a - b);
  let k = keys[0];
  for (const x of keys) if (x <= minutes) k = x;
  let rounds = S.rounds_max_by_minutes[String(k)];
  if (minutes <= 45) rounds = Math.min(rounds, S.rounds_start); // D-19: 3 rounds at <= 45 min
  return rounds;
}

/**
 * The plan shape (CONTRACTS §4.4).
 * @param {import('./util.mjs').Derived} derived
 * @param {object} model
 * @returns {import('./util.mjs').Shape}
 */
export function buildShape(derived, model) {
  const R = model.rules, PT = R.plan_types;
  const L = derived.D3_client_level.level;
  const mode = derived.D5_plan_shape.mode;
  const D4 = derived.D4_season_phase || {};
  const D11 = derived.D11_athletic_budget || { enabled: false, plyo_share: null };
  const D13 = derived.D13_tests || { items: [], from_zero: false };
  const plan = planTrainingBlocks(derived, model);
  const athleteReps = derived.D1_family === 'athletic';
  const plyoOn = !!(D11.enabled && D11.plyo_share);
  const AV = R.reps.athlete_vol_phases;
  const circuit = isCircuitPlan(derived, model);
  const CS = R.supersets.bootcamp.stairway;
  const rounds = circuit ? circuitRounds(derived.session_minutes, model) : null;
  const roundTo5 = (x) => CS.work_s_step * roundHalfUp(x / CS.work_s_step);

  const training_blocks = [], exercise_blocks = [], weeks = [];
  let ebN = 0, firstStair = true, lastStage = null, lastRep = null, lastStairEbs = null;
  // the season phase of each exercise block's first week (stage B3: the athletes' rep phase follows it)
  const ebSeason = new Map();
  const ebSeasonPhase = (eb, sp) => { if (!ebSeason.has(eb.n)) ebSeason.set(eb.n, sp); return ebSeason.get(eb.n); };
  plan.training_blocks.forEach((b, idx) => {
    const n = idx + 1;
    const stair_N = b.type === 'stairway' ? b.weeks[1] - b.weeks[0] + 1 : null;
    const st = stair_N ? model.stair(stair_N) : null;
    const ebs = st ? st.exercise_blocks : [[1, b.weeks[1] - b.weeks[0] + 1]];
    const firstEb = ebN + 1;
    for (const [a, z] of ebs) { ebN++; exercise_blocks.push({ n: ebN, training_block: n, weeks: [b.weeks[0] + a - 1, b.weeks[0] + z - 1] }); }
    training_blocks.push({ n, type: b.type, weeks: b.weeks.slice(), stair_N, first_exercise_block: firstEb, label_key: 'plan.block_type.' + b.type, factor: b.factor });
    for (let wk = b.weeks[0]; wk <= b.weeks[1]; wk++) {
      const w = wk - b.weeks[0] + 1;
      const eb = exercise_blocks.find(e => e.training_block === n && wk >= e.weeks[0] && wk <= e.weeks[1]);
      const ebIndex = eb.n - firstEb;
      const whys = [];
      let stair_week = null, stair_level = null, standard_step = null, phase, planned_rir;
      if (st) {
        stair_week = w;
        stair_level = st.display_level[String(w)];
        if (w >= 2) {
          standard_step = { early: R.stairway.standard_steps.early, late: R.stairway.standard_steps.late, this_week: st.standard_steps[String(w)] };
          whys.push(why('why.stairway_step', 'R2-PER-03', { pct: round2(standard_step.this_week * 100), part: w <= st.halfway ? 'early' : 'late' }));
        }
        phase = phaseOf(st.phases[L], w);
        planned_rir = plannedRir(st.planned_effort[String(w)], model);
        if (planned_rir.intensifiers) whys.push(why('why.intensifier_last_week', 'R2-PER-05'));
      } else {
        phase = FLAT_PHASE[b.type];
        const e = R.effort.by_block_type[b.type];
        planned_rir = { min: e.min, max: e.max, intensifiers: false };
        if (w === 1) {
          if (b.type === 'pre_season') whys.push(why('why.pre_season', 'R2-PER-06'));
          else if (b.type === 'taper') whys.push(why('why.taper', 'R2-PER-06'));
          else if (b.type === 'in_season') whys.push(why('why.in_season', 'R2-ATH-07'));
          else if (b.type === 'maintenance' && b.factor && typeof b.factor.factor === 'number') whys.push(why('why.maintenance', 'PER-01', { pct: roundHalfUp(b.factor.factor * 100) }));
        }
      }
      if (wk === 1 && derived.D5_plan_shape.overlay === 'season' && D4.weeks_to_season !== null && D4.weeks_to_season !== undefined) {
        whys.push(why('why.season_plan', 'D-10', { weeks: D4.weeks_to_season }));
      }

      // season phase per week (PRE inside pre-season / taper, IN in season)
      let season_phase = null;
      if (D4.phase) {
        if (b.type === 'pre_season' || b.type === 'taper') season_phase = 'PRE';
        else if (b.type === 'in_season') season_phase = 'IN';
        else if (D4.weeks_to_season !== null && D4.weeks_to_season !== undefined) {
          season_phase = phaseForWeeks(D4.weeks_to_season - (wk - 1), model);
          if (season_phase === 'PRE' || season_phase === 'IN') season_phase = 'OFF_LATE';
        } else season_phase = D4.phase === 'IN' ? 'OFF_EARLY' : D4.phase;
      }

      // athlete rep phase (PER-11) and Receive-Create stage (R2-ATH-03)
      let rep_phase = null;
      if (athleteReps) {
        // v0.4 stage B3 (minimal): the rep phase follows the season phase of the exercise block's first week when the rules give
        // the table (athlete_vol_phases.by_season_phase: OFF_LATE starts at VOL2; PER-11; RECHECK 03 major 'VOL1 for 6 weeks in
        // the late off-season')
        const bySeason = AV.by_season_phase && season_phase && AV.by_season_phase[ebSeasonPhase(eb, season_phase)];
        if (st && Array.isArray(bySeason) && bySeason.length) rep_phase = bySeason[Math.min(ebIndex, bySeason.length - 1)];
        else if (st) rep_phase = AV.by_exercise_block[Math.min(ebIndex, AV.by_exercise_block.length - 1)];
        else if (b.type === 'pre_season' || b.type === 'taper') rep_phase = AV.pre_season;
        else if (b.type === 'in_season') rep_phase = AV.in_season;
        else rep_phase = lastRep || AV.by_exercise_block[0];
        // v0.4 fix round 1 / F3 (minimal; E-125, COACH-ANSWER PER-11 'VOL 3 late off-season'; RECHECK 03 major: a six-week late off-season
        // stairway - one exercise block - held 8-12 for all six weeks): a single-block late off-season stairway steps to VOL3 after its
        // halfway week (rules.reps.athlete_vol_phases.off_late_single_block_step; the exercises stay, only the reps move)
        const OLS = AV.off_late_single_block_step;
        if (OLS && OLS.enabled && st && rep_phase === OLS.from && season_phase && ebSeasonPhase(eb, season_phase) === 'OFF_LATE' && (st.exercise_blocks || []).length === 1 && typeof st.halfway === 'number' && w > st.halfway) rep_phase = OLS.to;
        lastRep = rep_phase;
      }
      let plyo_stage = null;
      if (plyoOn) {
        // v0.4 stage B2 (athletic.stagesForStairway, E-26): the stage changes only where an exercise block starts (PER-02), so no
        // jump exercise changes mid-block; flat blocks hold the stage reached (R2-ATH-03 'stay put in maintenance')
        if (st) plyo_stage = stagesForStairway(model, st, L)[w - 1] || lastStage || R.athletic.stages.start_stage;
        else plyo_stage = lastStage || R.athletic.stages.start_stage;
        // v0.4 fix round 1 / F2 (RECHECK 03 major: a single-block soccer stairway held 'Land & Go' for 6 weeks and the pre-season
        // after it never reached 'Repeat'): the pre-season block after a single-exercise-block stairway moves one stage up
        if (!st && w === 1 && b.type === 'pre_season' && R.athletic.stages.pre_season_after_single_block === 'advance_one' && lastStairEbs === 1 &&
            lastStage && STAGE_NEXT[lastStage]) { plyo_stage = STAGE_NEXT[lastStage]; whys.push(why('why.plyo_stage', 'R2-ATH-03', { stage: plyo_stage })); }
        if (st) lastStairEbs = st.exercise_blocks ? st.exercise_blocks.length : 1;
        if (plyo_stage !== lastStage && lastStage !== null && st && w > 1) whys.push(why('why.plyo_stage', 'R2-ATH-03', { stage: plyo_stage }));
        lastStage = plyo_stage;
      }

      // tests (H19): week 1 and the last week of a stairway only
      let test = null;
      if (D13.items && D13.items.length && st) {
        const yearOk = mode !== 'year' || PT.year.test_weeks.includes(wk);
        if (w === 1 && yearOk) test = { type: 'baseline', items: D13.items.slice(), from_zero: firstStair ? !!D13.from_zero : false };
        else if (w === stair_N && yearOk) test = { type: 'end', items: D13.items.slice(), from_zero: false };
        if (test) {
          whys.push(why('why.test_timing', 'R2-PER-07'));
          if (test.from_zero) whys.push(why('why.test_from_zero', 'R2-PER-07'));
        }
      }

      // bootcamp circuit (D-19)
      let circ = null;
      if (circuit) {
        if (st) {
          if (CS.by_planned_steps) {
            // v1.2 (review 05 blocker 1): the circuit climbs by the D12 planned steps (3 % early, 5 % after halfway) applied to
            // the work seconds, lambda-scaled so the last week reaches the top, in 1-s steps: every week rises and no week rises
            // more than the 7 % step (R2-PER-03, UNI-05)
            circ = { rounds, work_s: circuitWorkSeconds(stair_N, st.standard_steps, CS, R.stairway.limits.planned_step_max)[w - 1] };
            if (w === 1) whys.push(why('why.circuit_stairway', 'D-19', { from: CS.work_s_start, to: CS.work_s_max }));
          } else {
            const lv1 = st.display_level['1'], lvN = st.display_level[String(stair_N)];
            const frac = lvN > lv1 ? (stair_level - lv1) / (lvN - lv1) : 1;
            circ = { rounds, work_s: roundTo5(CS.work_s_start + (CS.work_s_max - CS.work_s_start) * frac) };
            if (w === 1) whys.push(why('why.circuit_stairway', 'D-19', { from: CS.work_s_start, to: CS.work_s_max }));
          }
        } else {
          circ = { rounds: b.type === 'recovery' ? Math.max(1, Math.ceil(rounds * R.recovery.sets_factor)) : rounds, work_s: CS.work_s_start };
        }
      }

      weeks.push({
        n: wk, training_block: n, block_type: b.type, exercise_block: eb.n, stair_week, stair_level, standard_step,
        // stairway length and the week inside its exercise block (stairway weeks; null in flat blocks) - B3 request, 1.1.1
        stair_N: st ? stair_N : null, exercise_block_week: st ? wk - eb.weeks[0] + 1 : null,
        phase, phase_key: 'plan.phase.' + phase, planned_rir, season_phase, rep_phase, plyo_stage, test, circuit: circ,
        is_exercise_block_start: wk === eb.weeks[0], is_training_block_start: w === 1, is_last_stair_week: !!st && w === stair_N,
        why: whys
      });
    }
    if (st) firstStair = false;
  });
  return {
    mode, skeleton: derived.D5_plan_shape.skeleton, weeks_total: plan.weeks_total, open_ended: plan.open_ended,
    training_blocks, exercise_blocks, weeks, after_plan: plan.after_plan
  };
}
