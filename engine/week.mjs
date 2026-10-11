// engine/week.mjs - owner B3 (engine/CONTRACTS.md §4.6).
// Builds the week grammar of one training block: template + variant, weekday mapping, stations -> slots, block order,
// core position, pairing, supersets, warm-up, skill / WOD, prehab and aerobic placement.
// v0.5 (COACH-CT CT-01, COACH-R4 R4-SES-01 / 02 / 04 / 05): template-first. A day holds the coach's template stations whose rank
// is inside the day's exercise count (rules.session.size); nothing is cut, moved or dropped for time. estimateMinutes is an
// average estimate (information only).
// Pure: no I/O, no clock, no randomness. Every number / list comes from model.rules or the templates.
import { EngineError, why, WEEKDAYS, EPS } from './util.mjs';
import { olympicSetsPerExposure, warmupMode } from './budget.mjs';
import { setCost, supersetMinutes, testMinutes } from './estimate.mjs';
import { ensureAthleticStations, pairAthleticBlock, olympicAboveCeiling } from './athletic.mjs';
import { NEVER_PICK_STATUS } from './library.mjs';

/** @typedef {import('./util.mjs').Why} Why */

const WDI = Object.freeze(Object.fromEntries(WEEKDAYS.map((d, i) => [d, i])));
const sortWd = (arr) => [...new Set(arr || [])].filter((d) => d in WDI).sort((a, b) => WDI[a] - WDI[b]);
const clone = (o) => (o === undefined ? undefined : JSON.parse(JSON.stringify(o)));

// Structural bucket ids (§1.4 vocabulary).
const PLYO_BUCKETS = ['AP_PLYO', 'AP_JUMP_LIMITED_KNEE'];
const SMALL_ISO_BUCKETS = ['ISO_SIDE_REAR_DELT', 'ISO_BICEP', 'ISO_TRICEP', 'ISO_CALF'];
const PULL_BUCKETS = ['RP_HPULL', 'RP_VPULL'];
const UPPER_RES_BUCKETS = ['RP_HPUSH', 'RP_VPUSH', 'RP_HPULL', 'RP_VPULL', 'ISO_CHEST', 'ISO_SIDE_REAR_DELT', 'ISO_BICEP', 'ISO_TRICEP'];
const LOWER_RES_BUCKETS = ['RP_BKD', 'RP_UKD', 'RP_BHD', 'RP_UHD', 'ISO_QUAD', 'ISO_LEG_FLEXION'];
const RES_KINDS = ['resistance', 'isolation', 'focus'];
const SWAP_ONLY_STATUS = NEVER_PICK_STATUS; // never a pick (CAT-07; v0.5 / V2, R4-LIB-01: the optional add-ons too)

/** all slots of a day in session order @param {object} day @returns {object[]} */
export function daySlots(day) {
  const out = [];
  for (const b of day.blocks || []) for (const s of b.slots) out.push(s);
  return out;
}

/** muscle a slot serves (FOCUS -> focus muscle, ISO_SIDE_REAR_DELT -> variant muscle, ISO_* -> bucket muscle) */
export function slotMuscle(slot, model) {
  if (slot.focus_muscle) return slot.focus_muscle;
  const b = model.bucket(slot.bucket);
  if (b.muscle_by_variant) return b.muscle_by_variant[slot.variant || 'side'] || null;
  return b.muscle || null;
}

/** sets used for the time estimate when no volume plan is given (week 1 of the block) */
export function baseSets(slot) {
  if (slot.sets_hint) return slot.sets_hint[0];
  return slot.default_sets || 0;
}

// ------------------------------------------------------------------------------------------------------------------
// estimateMinutes
// ------------------------------------------------------------------------------------------------------------------

/**
 * Estimated minutes of a day (time_model; supersets; changeovers; circuits). An average, printed as information only: the plan
 * is never sized, cut or flagged by it (COACH-CT CT-01 'we can give an average recommendation of what it should take, but we will
 * never know what it's going to take').
 * v0.4 (review 07 major 'a flat 2.5 min a set'): a set costs its work time plus the rest it is dosed with (strength
 * rest 3-6 min for heavy work lifts, estimate.setCost); a superset rests once after the pair; a rep-max test is a full work-up
 * and a jump / sprint / agility test its protocol's minutes (testMinutes).
 * @param {object} day DayLayout
 * @param {Object<string,number>} [setsBySlot] slot_id -> sets (missing = base sets of the slot)
 * @param {Object<string,object>} [fillsBySlot] slot_id -> SlotFill (laterality of the pick)
 * @param {object} model Model
 * @param {{week?:object, derived?:object, lifting_only?:boolean, supersets?:boolean}} [opts]
 * @returns {number} whole minutes
 */
export function estimateMinutes(day, setsBySlot, fillsBySlot, model, opts = {}) {
  const T = model.rules.time_model;
  const mps = T.minutes_per_set;
  const week = opts.week || null;
  const derived = opts.derived || null;
  const setsOf = (s) => {
    if (setsBySlot && Object.prototype.hasOwnProperty.call(setsBySlot, s.slot_id)) return setsBySlot[s.slot_id] || 0;
    return s._base_sets != null ? s._base_sets : baseSets(s);
  };
  const slots = daySlots(day);
  let total = 0;
  if (slots.some((s) => s.bucket === 'WARMUP_GENERAL' && s.role === 'warmup')) total += mps.warmup_session;
  const supersetGroups = new Map();
  // stage B2 (R3-ATH-03): a HYROX station circuit costs rounds x stations x (work + transition), as dosed (circuit_finisher)
  const HY = model.rules.athletic.hyrox;
  const hyroxStations = [];
  for (const s of slots) {
    if (s.role === 'warmup' || s.role === 'cooldown') continue;
    // v0.4 fix round 2 / F2 (minimal seam, E-162 / E-165): a second ankle day done in the warm-up window costs no session minutes of
    // its own; a station this week's timed test replaces is not done
    if (s.prep_in_warmup || s.test_replaced) continue;
    if (HY && s.bucket === 'COND_CIRCUIT' && (HY.station_variants || []).includes(s.variant)) { hyroxStations.push(s); continue; }
    if (s.aerobic) {
      // aerobic sessions carry their own minutes: an aerobic day, a fighter's opening block and (v1.2, review 02 / 03 / 06 / 07)
      // an add-on after lifting all count; a 'separate_session' is done at another time of day and is not session time
      const counts = day.kind === 'aerobic' || s.aerobic.position === 'open_day' || (T.aerobic_addon_counts && s.aerobic.position !== 'separate_session');
      if (counts && !opts.lifting_only) total += T.aerobic_addon_minutes[s.aerobic.colour] || 0;
      continue;
    }
    if (s.bucket === 'TEST') { total += testMinutes(s, model); continue; }
    if (s.block === 'circuit') continue; // circuits below
    // v0.4 fix round 1 (RECHECK 04 major: '6-10 min of quality practice' folded into the warm-up was costed at 0): a folded skill costs
    // its minimum practice time beyond the warm-up (rules.time_model.skill_in_warmup_min)
    if (s.bucket === 'SKILL') {
      total += s.in_warmup ? (isNumber(T.skill_in_warmup_min) ? T.skill_in_warmup_min : 0) : (isNumber(T.skill_extra_min) ? T.skill_extra_min : mps.skill_block);
      continue;
    }
    if (s.bucket === 'COND_WOD') {
      const W = model.rules.conditioning.wod;
      const r0 = day.kind === 'optional' ? W.wod_only_day_minutes : (W.minutes || T.wod_minutes);
      const r = r0;
      // v1.2 (review 04): the WOD's dosed minutes of this week (10 -> 20 by the stair level), not a fixed midpoint
      if (T.wod_minutes_from_dose && week) total += Math.round(r[0] + (r[1] - r[0]) * stairFrac(week));
      else total += T.wod_minutes_from_dose ? r[1] : (r[0] + r[1]) / 2;
      continue;
    }
    const n = setsOf(s);
    if (s.test && n > 0) total += testMinutes(s, model); // the work-up to the test top set comes before the planned sets
    if (!n) continue;
    const cost = setCost(s, fillsBySlot && fillsBySlot[s.slot_id], model, derived, week);
    // supersets: the day's active pairs (default), every eligible template pair ('eligible') or none (false)
    const ssId = opts.supersets === false ? null : (opts.supersets === 'eligible' ? (s.superset || s.superset_eligible || null) : s.superset);
    if (ssId) {
      if (!supersetGroups.has(ssId)) supersetGroups.set(ssId, []);
      supersetGroups.get(ssId).push({ sets: n, cost });
    } else {
      total += n * cost.minutes + T.changeover_min_per_exercise;
    }
  }
  for (const ms of supersetGroups.values()) total += supersetMinutes(ms, model);
  if (hyroxStations.length) {
    const cf = HY.finisher || model.rules.conditioning.circuit_finisher;
    const p = stairFrac(week);
    const rounds = Math.round(cf.rounds[0] + (cf.rounds[1] - cf.rounds[0]) * p + EPS);
    const work = Math.round((cf.work_s[0] + (cf.work_s[1] - cf.work_s[0]) * p) / 5) * 5;
    total += (rounds * hyroxStations.length * (work + T.circuit.transition_s)) / 60 + T.changeover_min_per_exercise;
  }
  // circuits: rounds x stations x (work + transition) + rests between rounds (+ 1 min between circuits, 05 v1.1 5.3; v1.2 the
  // week's own work seconds, review 05)
  const wc = week && week.circuit ? week.circuit : null;
  const cd = wc ? { work_s: wc.work_s, transition_s: wc.transition_s ?? T.circuit.transition_s, between_rounds_s: wc.between_rounds_s ?? T.circuit.between_rounds_s } : (day.circuit_dose || null);
  const bc = model.rules.supersets.bootcamp;
  const workS = cd ? cd.work_s : bc.stairway.work_s_start;
  const transS = cd ? cd.transition_s : T.circuit.transition_s;
  const betweenS = cd ? cd.between_rounds_s : T.circuit.between_rounds_s;
  let circuits = 0;
  for (const b of day.blocks || []) {
    if (b.kind !== 'circuit') continue;
    const st = b.slots.filter((s) => setsOf(s) > 0);
    if (!st.length) continue;
    circuits++;
    const rounds = Math.max(...st.map(setsOf));
    total += (rounds * st.length * (workS + transS)) / 60 + (Math.max(0, rounds - 1) * betweenS) / 60;
  }
  if (circuits > 1 && isNumber(T.between_circuits_s)) total += ((circuits - 1) * T.between_circuits_s) / 60;
  return Math.round(total + EPS);
}

const isNumber = (v) => typeof v === 'number' && Number.isFinite(v);
/** stair progress 0..1 used for WOD minutes (the same formula as dose.mjs stairProgress) */
function stairFrac(week) {
  if (week && week.stair_level != null) return Math.min(1, Math.max(0, (week.stair_level - 2) / 9));
  return 1;
}

/** minutes of aerobic add-ons on a day (counted ones, v1.2) @returns {number} */
export function aerobicMinutes(day, model) {
  const T = model.rules.time_model;
  let n = 0;
  for (const s of daySlots(day)) if (s.aerobic && day.kind !== 'aerobic' && s.aerobic.position !== 'separate_session' && (T.aerobic_addon_counts || s.aerobic.position === 'open_day')) n += T.aerobic_addon_minutes[s.aerobic.colour] || 0;
  return n;
}


// ------------------------------------------------------------------------------------------------------------------
// buildWeekLayout
// ------------------------------------------------------------------------------------------------------------------

/**
 * Base week of one training block.
 * @param {object} derived Derived (D1-D14)
 * @param {object} shape Shape
 * @param {object} trainingBlock TrainingBlock
 * @param {object} model Model
 * @returns {object} WeekLayout (+ `warnings: Issue[]`, see CONTRACT_REQUESTS B3)
 */
export function buildWeekLayout(derived, shape, trainingBlock, model) {
  if (!derived || !trainingBlock || !model) throw new EngineError('week.bad_args', 'buildWeekLayout needs derived, trainingBlock, model');
  const R = model.rules;
  const D6 = derived.D6_week_layout;
  const tb = trainingBlock;
  const weekWhy = [];
  const warnings = [];

  // --- template + variant -----------------------------------------------------------------------------------------
  let tsel;
  if (tb.type === 'in_season') {
    const is = R.plan_types.season.in_season;
    const [fam, d] = String(is.template).split('.');
    tsel = model.templateFor(fam, Number(d), is.variant);
    weekWhy.push(why('why.in_season', 'R2-ATH-07'));
  } else {
    tsel = model.templateFor(D6.family, D6.days, D6.variant);
  }
  const template = tsel.template;
  const variant = tsel.variant || null;
  const dt = model.dayTypes(template, variant);
  const family = template.family;
  weekWhy.push(why('why.template', 'VOL-08', { template: template.id }));
  if (variant) weekWhy.push(why('why.template_variant', variant === D6.variant && D6.variant ? 'R2-GEN-07' : 'D-22', { variant }));
  const D11w = derived.D11_athletic_budget || {};
  if (D11w.heavy_play_week) weekWhy.push(why('why.heavy_play', 'R2-ATH-07')); // R3-pending: R3-ATH-05
  if (tb.type === 'in_season' && D11w.game_heavy) weekWhy.push(why('why.game_heavy', 'R2-ATH-07'));
  const pairing = tb.type === 'in_season' ? 'cross_pattern' : D6.pairing;
  const programId = programIdFor(derived, model);
  const profile = profileDef(derived, model);
  const ctx = makeCtx(derived, shape, tb, model, template, variant, dt, profile);

  // --- weekdays ---------------------------------------------------------------------------------------------------
  const blocked = new Set([...sortWd(derived.play_days), ...sortWd(gameDays(derived))]);
  const occupied = new Map(); // weekday -> placement
  const offMin = R.session.off_days_min;
  const freeDays = () => WEEKDAYS.filter((wd) => !occupied.has(wd) && !blocked.has(wd));
  const canTakeFree = () => freeDays().length - 1 >= offMin;
  const nearestFree = (tplWd) => {
    const free = freeDays();
    if (!free.length || !canTakeFree()) return null;
    const i0 = WDI[tplWd];
    const ranked = free.map((wd) => ({ wd, d: Math.abs(WDI[wd] - i0), sun: wd === 'Sun' ? 1 : 0 }))
      .sort((a, b) => a.d - b.d || a.sun - b.sun || WDI[b.wd] - WDI[a.wd]); // ties: later (Sunday kept OFF when possible)
    return ranked[0].wd;
  };
  const entries = WEEKDAYS.map((wd) => ({ tplWd: wd, ...(dt.week_layout[wd] || { day_type: null, kind: 'off', optional: false, note: null }) }));
  let userDays = sortWd(derived.weekdays);
  if (tb.type === 'in_season') userDays = inSeasonDays(userDays, derived, R);
  const planned = entries.filter((e) => e.kind === 'main' || (e.kind === 'optional' && !e.optional));
  const optionals = entries.filter((e) => e.kind === 'optional' && e.optional);
  const aerobicEntries = entries.filter((e) => e.kind === 'aerobic');

  let ui = 0;
  for (const e of planned) {
    if (ui < userDays.length) { occupied.set(userDays[ui], { entry: e, kind: kindOf(e, dt), optional: false }); ui++; }
    else {
      const wd = nearestFree(e.tplWd); // fewer weekdays than planned days (V2 warns in intake)
      if (wd) occupied.set(wd, { entry: e, kind: kindOf(e, dt), optional: false });
    }
  }
  const optQueue = optionals.slice();
  while (ui < userDays.length && optQueue.length) { // more weekdays than planned days: optional days become planned
    const e = optQueue.shift();
    occupied.set(userDays[ui], { entry: e, kind: dayTypeKind(e, dt) === 'main' ? 'main' : 'optional', optional: false });
    ui++;
  }
  for (const e of optQueue) {
    const wd = nearestFree(e.tplWd);
    if (wd) occupied.set(wd, { entry: e, kind: 'optional', optional: true, moved: wd !== e.tplWd });
  }

  // v0.6 (G-136, 03 M1; template week_layout note 'sport_or_off'; R3-ATH-05): a competitive athlete's team practices show on the
  // template's 'sport or off' days (the nearest free weekday when the client trains there), as long as the week keeps its OFF days;
  // no aerobic session is placed on a practice day
  const practiceDays = [];
  {
    const PRw = R.conditioning.s6 && R.conditioning.s6.practice;
    const nP = (derived.D14_aerobic_sessions && derived.D14_aerobic_sessions.practice_days) || 0;
    if (PRw && nP > 0 && tb.type !== 'in_season') {
      const want = entries.filter((e) => e.note === PRw.prefer_note).map((e) => e.tplWd);
      for (const tplWd of [...want, ...WEEKDAYS.filter((w) => !want.includes(w) && w !== 'Sun')]) {
        if (practiceDays.length >= nP) break;
        const wd = !occupied.has(tplWd) && !blocked.has(tplWd) && canTakeFree() ? tplWd : null;
        if (!wd) continue;
        occupied.set(wd, { entry: null, kind: 'sport', optional: false, practice: true });
        practiceDays.push(wd);
      }
      if (practiceDays.length) weekWhy.push(why('why.practice_counts', 'R3-ATH-05', { n: nP }));
    }
  }

  // --- days without aerobic sessions yet -------------------------------------------------------------------------
  const days = [];
  const mainOrder = [...occupied.keys()].sort((a, b) => WDI[a] - WDI[b]);
  const focusPlan = planFocus(occupied, dt, ctx);
  let dayIndex = 0;
  for (const wd of mainOrder) {
    const p = occupied.get(wd);
    const def = dayTypeDef(p.entry, dt);
    if (!def) continue;
    days.push(buildDay(wd, p, def, ctx, focusPlan, dayIndex++));
  }
  ensureCoreBlock(days, ctx);
  ensureThrowStation(days, ctx);
  // fix round 1 / F2: the Olympic budget trim runs on the template's own stations, before the athletic tracks size their stations
  // against the days' room (the 12 + 2 count)
  const f2Tracks = !!(R.athletic.f2 && R.athletic.f2.tracks && R.athletic.f2.tracks.from_budget);
  if (f2Tracks) trimOlympicExposures(days, ctx);
  ensureAthleticTracks(days, ctx);
  heavyPlayStations(days, ctx);
  ensureWarmupPrep(days, ctx);
  addPrehab(days, ctx);
  if (!f2Tracks) trimOlympicExposures(days, ctx);
  ctx.olyExposures = days.filter((d) => d.kind === 'main').reduce((a, d) => a + d._slots.filter((s) => s.bucket === 'AP_TRIPLE_EXT').length, 0);
  for (const d of days) for (const s of d._slots) s._base_sets = templateSetsOf(s, ctx);

  // --- aerobic sessions (D14, R2-SES-06) ---------------------------------------------------------------------------
  const aer = aerobicPlan(derived, tb, profile, model);
  let colourIdx = 0;
  let remaining = aer.n;
  // stage B2 (R3-ATH-03 HYROX hybrid days): a template COND_AEROBIC station whose variant names a colour takes that colour from
  // the week's queue (run intervals = Blue, 1 km run + station = Green); the other sessions keep the D14 order
  const colourQueue = aer.colours.slice();
  const nextColour = () => (colourIdx++, colourQueue.length ? colourQueue.shift() : R.conditioning.extra_colour);
  const takeColour = (v) => { const i = v ? colourQueue.indexOf(v) : -1; if (i < 0) return nextColour(); colourIdx++; return colourQueue.splice(i, 1)[0]; };
  // 1) template aerobic days and optional / main days holding a COND_AEROBIC station, in template weekday order
  const capacity = [];
  for (const e of aerobicEntries) capacity.push({ type: 'aerobic_day', entry: e, order: WDI[e.tplWd] });
  for (const day of days) for (const s of day._aerobic_stations) capacity.push({ type: 'station', day, station: s, order: WDI[day.weekday] + (day.kind === 'main' ? 7 : 0) });
  capacity.sort((a, b) => a.order - b.order);
  // v0.5 fix round 2 (sample 02 minor: the one add-on after the longest lifting day was the hardest colour - Blue intervals): when a
  // session has to ride on a training day, that add-on is the easy steady one (Orange) and the separate days take the others
  {
    const AX = R.conditioning.x2 && R.conditioning.x2.addon_easy_colour;
    const separate = capacity.filter((c) => !(c.type === 'station' && c.day.kind === 'main')).length;
    if (AX && remaining > separate && capacity.some((c) => c.type === 'station' && c.day.kind === 'main')) {
      const i = colourQueue.indexOf(AX);
      if (i >= 0 && i < separate) { colourQueue.splice(i, 1); colourQueue.splice(Math.min(separate, colourQueue.length), 0, AX); }
    }
  }
  for (const c of capacity) {
    if (remaining <= 0) break;
    if (c.type === 'aerobic_day') {
      const wd = blocked.has(c.entry.tplWd) || occupied.has(c.entry.tplWd) || !canTakeFree() ? nearestFree(c.entry.tplWd) : c.entry.tplWd;
      if (!wd) continue;
      occupied.set(wd, { entry: c.entry, kind: 'aerobic', optional: !!c.entry.optional });
      const def = dayTypeDef(c.entry, dt);
      const day = buildAerobicDay(wd, def, c.entry, nextColour(), ctx, dayIndex++);
      days.push(day);
      remaining--;
    } else {
      const colour = takeColour(c.station.variant);
      const a = aerobicSlotFromStation(c.day, c.station, colour, ctx);
      if (c.day.kind === 'optional') a.aerobic.required = true; // the cardio counts even when the optional lifting is skipped (review 02)
      c.day._aerobic_used.push(a);
      remaining--;
    }
  }
  // 2) new aerobic days on free weekdays while >= off_days_min OFF days remain (never on play days)
  while (remaining > 0 && canTakeFree()) {
    const free = freeDays().sort((a, b) => (a === 'Sun') - (b === 'Sun') || WDI[a] - WDI[b]);
    const wd = free[0];
    occupied.set(wd, { entry: null, kind: 'aerobic', optional: false });
    days.push(buildAerobicDay(wd, null, null, nextColour(), ctx, dayIndex++));
    remaining--;
  }
  // 3) optional lifting days without a session take one (v1.2, master 10.7: separate / optional days before add-ons)
  for (const d of days.filter((x) => x.kind === 'optional' && !x._aerobic_used.length)) {
    if (remaining <= 0) break;
    const a = makeAerobicSlot(`${d.weekday}.${d.day_type}.a01`, `${d.day_type}.a01`, nextColour(), 'separate', ctx, []);
    a.aerobic.required = true;
    a.day_index = d._day_index;
    d._aerobic_used.push(a);
    remaining--;
  }
  // v0.5 fix round 2 (sample 02 major 'Tuesday carries this finisher and the Blue intervals back to back'): a training day that
  // holds an aerobic add-on takes no sprint buy-out (rules.conditioning.buyout_pool.x2.not_with_aerobic_addon)
  {
    const BXw = R.conditioning.buyout_pool && R.conditioning.buyout_pool.x2;
    if (BXw && BXw.not_with_aerobic_addon) for (const d of days) if (d.kind === 'main' && d._aerobic_used && d._aerobic_used.length) d._slots = d._slots.filter((sl) => sl.bucket !== 'COND_SPRINT_BUYOUT');
  }
  if (aer.n === 0) {
    const reason = derived.D14_aerobic_sessions && derived.D14_aerobic_sessions.sport_is_aerobic
      ? why('why.sport_is_aerobic', 'R3-ATH-01') : why('why.aerobic_count', 'R2-SES-06', { n: 0 });
    weekWhy.push(reason);
  } else {
    weekWhy.push(why('why.aerobic_count', 'ATH-07', { n: aer.n }));
    if (aer.adjust) weekWhy.push(why('why.cardio_adjust', 'R2-SES-06', { delta: aer.adjust }));
    if (aer.replaced) weekWhy.push( // R3-pending: R3-ATH-05
      why('why.activity_counts', 'R3-ATH-05', { activity: (derived.D2_profile.activity_ids || [])[0] || derived.D2_profile.id, n: aer.replaced }));
  }

  // --- play / game days --------------------------------------------------------------------------------------------
  const playDays = sortWd(derived.play_days).filter((wd) => !occupied.has(wd));
  for (const wd of playDays) {
    days.push({ weekday: wd, day_type: null, kind: 'play', optional: false, label_key: 'ui.plan.play_day', lower_focus: null, full_body: false,
      format: 'straight', supersets_on: false, est_minutes: 0, groups: [], blocks: [],
      why: aer.replaced ? [why('why.activity_counts', 'R3-ATH-05', { activity: (derived.D2_profile.activity_ids || [])[0] || derived.D2_profile.id, n: aer.replaced })] : [],
      circuit_dose: null, _slots: [], _aerobic_used: [], _aerobic_stations: [] });
  }
  for (const wd of practiceDays) {
    days.push({ weekday: wd, day_type: null, kind: 'sport', optional: false, label_key: 'ui.plan.sport_day', lower_focus: null, full_body: false,
      format: 'straight', supersets_on: false, est_minutes: 0, groups: [], blocks: [], why: [why('why.practice_day', 'R3-ATH-05')],
      circuit_dose: null, _slots: [], _aerobic_used: [], _aerobic_stations: [] });
  }
  for (const wd of sortWd(gameDays(derived)).filter((d) => !occupied.has(d) && !playDays.includes(d))) {
    days.push({ weekday: wd, day_type: null, kind: 'sport', optional: false, label_key: 'ui.plan.sport_day', lower_focus: null, full_body: false,
      format: 'straight', supersets_on: false, est_minutes: 0, groups: [], blocks: [], why: [],
      circuit_dose: null, _slots: [], _aerobic_used: [], _aerobic_stations: [] });
  }

  // --- finalize: blocks, order, supersets. v0.5: no caps and no cuts - the template comes out complete (R4-SES-04) ----------
  days.sort((a, b) => WDI[a.weekday] - WDI[b.weekday]);
  const finals = [];
  for (const d of days) finals.push(finalizeDay(d, ctx, false));
  for (const f of finals) if (f.kind === 'main' || f.kind === 'optional') pairRemaining(f, ctx);
  // fix round 1 / F2: a day's jump and medball throw are a recommended contrast pair (R3-SES-02 supersets)
  if (R.athletic.f2 && R.athletic.f2.tracks) for (const f of finals) if (f.kind === 'main') pairAthleticBlock(f);
  // 4) the remaining sessions: an add-on after the main day with the fewest cardio sessions and the shortest estimate (after
  // lifting or at another time of that day - the person decides; v0.5: never a time decision, CT-01)
  const mainsF = finals.filter((d) => d.kind === 'main');
  if (remaining > 0 && mainsF.length) {
    let k = 0;
    while (remaining > 0) {
      const ranked = mainsF.map((d) => ({ d, est: estimateMinutes(d, null, null, model, { week: ctx.peakWeek, derived: ctx.derived }), n: daySlots(d).filter((s) => s.aerobic).length }))
        .sort((a, b) => a.n - b.n || a.est - b.est || WDI[a.d.weekday] - WDI[b.d.weekday]);
      const pick = ranked[0];
      const colour = nextColour();
      const n = pick.n + 1;
      const fighter = derived.D14_aerobic_sessions && derived.D14_aerobic_sessions.fighter_open;
      const pos = fighter ? 'open_day' : 'addon_after';
      const a = makeAerobicSlot(`${pick.d.weekday}.${pick.d.day_type}.a0${n}`, `${pick.d.day_type}.a0${n}`, colour, pos, ctx,
        pos === 'open_day' ? [why('why.aerobic_fighter_open', 'ORD-09')] : []);
      a.day_index = null;
      let blk = pick.d.blocks.find((b) => b.kind === 'aerobic');
      if (!blk) { blk = { kind: 'aerobic', movable: false, circuit: null, slots: [] }; const at = pick.d.blocks.findIndex((b) => b.kind === 'cooldown'); if (at < 0) pick.d.blocks.push(blk); else pick.d.blocks.splice(at, 0, blk); }
      if (pos === 'open_day') { blk.slots.push(a); } else blk.slots.push(a);
      // (fix round 2, sample 02 minor: the add-on after a training day is the easy steady session - it trades colours with a
      // separate day that holds the easy one, rules.conditioning.x2.addon_easy_colour)
      const AXc = R.conditioning.x2 && R.conditioning.x2.addon_easy_colour;
      if (AXc && pos === 'addon_after' && a.aerobic.colour !== AXc) {
        const other = finals.flatMap((f) => daySlots(f)).find((x) => x.aerobic && x.aerobic.position === 'separate' && x.aerobic.colour === AXc && !x.aerobic.traded);
        if (other) { const c0 = a.aerobic.colour, m0 = a.aerobic.minutes; a.aerobic.colour = other.aerobic.colour; a.aerobic.minutes = other.aerobic.minutes; other.aerobic.colour = c0; other.aerobic.minutes = m0; other.aerobic.traded = true; }
      }
      remaining--; k++;
      if (k > 20) break;
    }
  }
  // v0.6 (G-136, 03 M1: Blue intervals on Thursday before Friday's top-speed sprints and heavy hex-bar deadlift): a hard aerobic colour
  // never sits on the day before a sprint day or the week's heavy hinge - it trades colours with a session that is not, else it
  // becomes the easy steady session (rules.conditioning.s6.hard_eve)
  {
    const HE = R.conditioning.s6 && R.conditioning.s6.hard_eve;
    if (HE) {
      const protectedDays = new Set(finals.filter((f) => f.kind === 'main' && daySlots(f).some((x) => (HE.sprint_kinds && x.bucket === 'AP_SPRINT') || (HE.heavy_hinge && x.bucket === 'RP_BHD' && x.axial_req === 'axial'))).map((f) => f.weekday));
      const eve = (wd) => protectedDays.has(WEEKDAYS[(WDI[wd] + 1) % 7]);
      const sessions = finals.flatMap((f) => daySlots(f).filter((x) => x.aerobic).map((x) => ({ f, x })));
      for (const h of sessions) {
        if (!(HE.colours || []).includes(h.x.aerobic.colour) || !eve(h.f.weekday)) continue;
        // (a separate session first: the add-on after lifting stays the easy one, G-82)
        const ok = (o) => o !== h && !(HE.colours || []).includes(o.x.aerobic.colour) && !eve(o.f.weekday);
        const other = sessions.find((o) => ok(o) && o.x.aerobic.position !== 'addon_after') || sessions.find(ok);
        if (other) {
          const c0 = h.x.aerobic.colour, m0 = h.x.aerobic.minutes;
          h.x.aerobic.colour = other.x.aerobic.colour; h.x.aerobic.minutes = other.x.aerobic.minutes;
          other.x.aerobic.colour = c0; other.x.aerobic.minutes = m0;
        } else { h.x.aerobic.colour = R.conditioning.extra_colour; h.x.aerobic.minutes = R.conditioning.minutes[R.conditioning.extra_colour].slice(); }
        h.x.why.push(why('why.hard_eve', 'R2-SES-06'));
      }
    }
  }
  // (fix round 2, sample 02 major: a training day that holds an aerobic add-on takes no sprint buy-out)
  {
    const BXf = R.conditioning.buyout_pool && R.conditioning.buyout_pool.x2;
    if (BXf && BXf.not_with_aerobic_addon) for (const f of mainsF) {
      if (!daySlots(f).some((x) => x.aerobic)) continue;
      for (const b of f.blocks) b.slots = b.slots.filter((x) => x.bucket !== 'COND_SPRINT_BUYOUT');
      f.blocks = f.blocks.filter((b) => b.slots.length > 0);
    }
    for (const f of finals) for (const x of daySlots(f)) if (x.aerobic && x.aerobic.traded) delete x.aerobic.traded;
  }
  for (const f of finals) {
    f.est_minutes = estimateMinutes(f, null, null, model, { derived: ctx.derived, week: ctx.firstWeek });
    f.aerobic_minutes = aerobicMinutes(f, model);
    f.groups = dayGroups(f, model);
  }
  // play / game spacing: a counted spine lift < 48 h before a play or game day (R3-ATH-05)
  const hardGapDays = Math.ceil((R.athletic.heavy_play_weeks.hard_day_gap_h || 48) / 24);
  for (const f of finals) {
    if (f.kind !== 'main') continue;
    const counted = daySlots(f).some((s) => s.axial_req === 'axial');
    if (!counted) continue;
    for (const pd of [...blocked]) {
      const gap = (WDI[pd] - WDI[f.weekday] + 7) % 7;
      if (gap > 0 && gap < hardGapDays) warnings.push({ code: 'play_48h', key: 'warning.play_48h', args: { day: pd } });
    }
  }
  const offDays = WEEKDAYS.filter((wd) => !finals.some((d) => d.weekday === wd));
  return {
    template_id: template.id,
    variant,
    family,
    pairing,
    program_id: programId,
    training_block: tb.n,
    days: finals,
    off_days: offDays,
    play_days: sortWd(derived.play_days),
    why: weekWhy,
    warnings: dedupeIssues(warnings)
  };
}

// ------------------------------------------------------------------------------------------------------------------
// layoutForWeek
// ------------------------------------------------------------------------------------------------------------------

/**
 * Per-week view of a base layout: taper / recovery removals, test flags, aerobic recolouring, circuit dose.
 * @param {object} base WeekLayout from buildWeekLayout (plus any volume added_slots already merged by the caller)
 * @param {object} weekShape WeekShape
 * @param {object} derived Derived
 * @param {object} model Model
 * @returns {object} WeekLayout (a new object; `base` is not mutated)
 */
export function layoutForWeek(base, weekShape, derived, model) {
  const R = model.rules;
  const L = clone(base);
  const type = weekShape.block_type;
  const light = type === 'taper' || type === 'recovery';
  const removeBuckets = new Set();
  if (light) for (const b of ['COND_SPRINT_BUYOUT']) removeBuckets.add(b); // buy-outs (R2-VOL-07 recovery removals)
  for (const day of L.days) {
    for (const blk of day.blocks) {
      blk.slots = blk.slots.filter((s) => {
        if (removeBuckets.has(s.bucket)) return false;
        if (light && s.bucket === 'COND_CIRCUIT' && day.format !== 'circuit') return false; // finishers
        return true;
      });
      for (const s of blk.slots) {
        s.test = null;
        // light weeks drop supersets (R2-VOL-07 removals) except pairs of small isolations (no added fatigue; the cap
        // counts them as one exercise) - INFERRED reading, CONTRACT_REQUESTS B3
        if (light && s.superset) {
          const mates = blk.slots.filter((x) => x.superset === s.superset);
          if (!(mates.length >= 2 && mates.every((x) => SMALL_ISO_BUCKETS.includes(x.bucket)))) s.superset = null;
        }
        if (s.aerobic && type === 'recovery' && R.recovery.conditioning === 'C_only') { // R3-pending: R3-PER-01
          s.aerobic = { ...s.aerobic, colour: 'C', minutes: R.conditioning.minutes.C.slice() };
        }
      }
    }
    day.blocks = day.blocks.filter((b) => b.slots.length);
    if (light) day.supersets_on = day.blocks.some((b) => b.slots.some((s) => !!s.superset));
    if (day.format === 'circuit' && weekShape.circuit) {
      const bc = R.supersets.bootcamp;
      day.circuit_dose = { rounds: weekShape.circuit.rounds, work_s: weekShape.circuit.work_s, transition_s: bc.transition_s, between_rounds_s: bc.between_rounds_s };
    }
  }
  // test week: mark the first item of each tested pattern (H19, D-17)
  if (weekShape.test && weekShape.test.items && weekShape.test.items.length) markTests(L, weekShape, derived, model);
  for (const day of L.days) day.est_minutes = estimateMinutes(day, null, null, model, { derived, week: weekShape });
  L.week = weekShape.n;
  return L;
}

/**
 * v0.4: the minutes a test week's tests add per weekday (the same marks layoutForWeek makes), so the volume engine sizes a test
 * week with its work-ups (R2-PER-07 'test as a full work-up'; review 07 major). @returns {{byDay:Object<string,number>, tested:string[]}}
 */
export function testPlan(base, weekShape, derived, model) {
  const out = { byDay: {}, bySlot: {}, tested: [] };
  if (!weekShape || !weekShape.test || !weekShape.test.items || !weekShape.test.items.length) return out;
  const L = clone(base);
  for (const day of L.days || []) for (const blk of day.blocks || []) for (const s of blk.slots || []) s.test = null;
  markTests(L, weekShape, derived, model);
  for (const day of L.days || []) for (const s of daySlots(day)) {
    if (!s.test) continue;
    const m = testMinutes(s, model);
    // a timed test item counts on its day; a rep-max work-up counts only while its lift is in the week (bySlot)
    if (s.bucket === 'TEST') { if (m) out.byDay[day.weekday] = (out.byDay[day.weekday] || 0) + m; }
    else { out.tested.push(s.slot_id); if (m) out.bySlot[s.slot_id] = m; }
  }
  // v0.4 fix round 2 / F2 (minimal seam, E-165; R2-PER-07 'tested ... instead of'): a timed test replaces its station on its day, so
  // the day's test minutes are net of that station's own minutes (the volume engine's estimate still counts the station)
  out.replaced = [];
  const T = model.rules.time_model;
  for (const day of L.days || []) for (const s of daySlots(day)) {
    if (!s.test_replaced) continue;
    const n = baseSets(s);
    out.replaced.push(s.slot_id);
    if (n > 0) out.byDay[day.weekday] = (out.byDay[day.weekday] || 0) - (n * setCost(s, null, model, derived, weekShape).minutes + T.changeover_min_per_exercise);
  }
  return out;
}

/**
 * Rep-max tests go on bilateral compound lifts (a 3RM on an alternating cable press or a split squat is not a useful
 * strength test). markTests marks the station before the pick is known; here the mark moves to another station
 * of the same bucket whose pick is bilateral (the work lift first), or is dropped for that pattern (the squat / hinge
 * tests remain). Integration decision D-46 (INFERRED). Moved here from generate.mjs in v0.5 fix round 1 so the volume engine
 * reads the same tested lifts (a tested lift takes no stairway step in its test week).
 * @param {object} L WeekLayout of the test week (mutated) @param {Object<string,object>} fills slot id -> fill @param {object} model
 */
export function relocateStrengthTests(L, fills, model) {
  const cat = model.rules.tests.catalogue.strength;
  const strength = new Set([...Object.values(cat.from_zero), ...Object.values(cat.after_completed_block), cat.older, cat.pro]);
  const slots = [];
  for (const d of L.days || []) for (const b of d.blocks || []) for (const sl of b.slots || []) slots.push(sl);
  // v0.4 fix round 1 (RECHECK 02 major: a 3RM / 1RM on a stiff-leg deadlift / RDL for an athlete with hamstring and low-back hot
  // spots): a hinge test takes a canonical deadlift (hex / trap bar, conventional, sumo) - never a Romanian / stiff-leg or single-leg
  // hinge - when the week holds one (E-49 extended to every family)
  const LONG_LEVER = /romanian|rdl|stiff-leg|stiff-legged|good-morning|single-leg/;
  const exOfSlot = (sl) => { const f = fills ? fills[sl.slot_id] : null; return f && f.exercise_id && model.hasEx(f.exercise_id) ? model.ex(f.exercise_id) : null; };
  // v0.5 fix round 1 (sample 02: the hinge test moved from the RDL to a 45-degree back extension - '1 x 3 rep max' on a body-weight
  // hip extension): a squat or hinge test is taken on a lift that loads heavy - the week's counted spine lift or a machine / bar
  // lift with a high load ceiling (rules.tests.x1.lower_test_needs); with none in the week the pattern is not tested
  const TX = (model.rules.tests.x1 && model.rules.tests.x1.lower_test_needs) || null;
  const heavyEnough = (sl, ex) => !TX || !(TX.buckets || []).includes(sl.bucket) || ex.axial === true || (TX.load_ceilings || []).includes(ex.load_ceiling);
  const ok = (sl) => {
    const ex = exOfSlot(sl);
    if (sl.bucket === 'RP_BHD' && ex && LONG_LEVER.test(ex.id)) return false;
    return !!ex && ex.laterality === 'bilateral' && ex.exercise_class === 'compound' && !ex.is_athletic && heavyEnough(sl, ex);
  };
  for (const sl of slots) {
    if (!sl.test || !strength.has(sl.test) || ok(sl)) continue;
    const alts = slots.filter(x => x !== sl && !x.test && x.bucket === sl.bucket && x.block !== 'circuit' && ok(x));
    const alt = alts.find(x => x.role === 'work') || alts.find(x => x.axial_req === 'axial') || alts[0] || null;
    if (alt) alt.test = sl.test;
    sl.test = null;
  }
}

/**
 * v0.5 fix round 1 (COACH-R2 R2-PER-07 'test at the beginning and at the end ... instead of that week's top sets'; ORD-02 'the work
 * comes first'; the coach-eye reviews of samples 01 / 02: the 3RM came after 4-5 sets of single-arm rows or a cable press, under a
 * note that said 'Test first'): on a day with a rep-max test the tested lift opens the day's lifts - it moves to the top of its
 * strength block, ahead of its paired upper lift (two tested lifts keep their own order). The back-off sets stay with the test.
 * @param {object} L WeekLayout of the test week, tests already marked and relocated (mutated) @param {object} model
 */
export function testedLiftFirst(L, model) {
  const TX = model.rules.tests.x1;
  if (!TX || !TX.tested_lift_first) return;
  const cat = model.rules.tests.catalogue.strength;
  const strength = new Set([...Object.values(cat.from_zero), ...Object.values(cat.after_completed_block), cat.older, cat.pro]);
  for (const d of L.days || []) for (const b of d.blocks || []) {
    if (b.kind !== 'strength' || !Array.isArray(b.slots)) continue;
    const tested = b.slots.filter(sl => sl.test && strength.has(sl.test) && sl.bucket !== 'TEST');
    if (!tested.length) continue;
    for (const sl of tested) sl.test_first = true;
    // (power before strength, ORD-03: a jump, throw or Olympic station written inside the strength block stays ahead of the lifts)
    const isPower = (sl) => ['athletic', 'power'].includes((model.bucket(sl.bucket) || {}).kind);
    const firstAt = b.slots.indexOf(tested[0]);
    const lead = b.slots.filter((sl, i) => i < firstAt && isPower(sl) && !tested.includes(sl));
    const order = [...lead, ...tested, ...b.slots.filter(sl => !tested.includes(sl) && !lead.includes(sl))];
    if (order.every((sl, i) => b.slots[i] === sl)) continue;
    b.slots = order;
  }
}

/**
 * The lifts a week tests with a rep max, as the plan will print them (marked, relocated to a bilateral heavy lift).
 * @param {object} base WeekLayout @param {object} weekShape @param {object} derived @param {object} model
 * @param {Object<string,object>} fills slot id -> fill of the week's exercise block @returns {string[]} slot ids
 */
export function strengthTestSlots(base, weekShape, derived, model, fills) {
  if (!weekShape || !weekShape.test || !weekShape.test.items || !weekShape.test.items.includes('strength')) return [];
  const L = clone(base);
  for (const day of L.days || []) for (const blk of day.blocks || []) for (const s of blk.slots || []) s.test = null;
  markTests(L, weekShape, derived, model);
  relocateStrengthTests(L, fills || {}, model);
  const out = [];
  for (const day of L.days || []) for (const s of daySlots(day)) if (s.test && s.bucket !== 'TEST' && !s.aerobic) out.push(s.slot_id);
  return out;
}

function markTests(L, weekShape, derived, model) {
  const R = model.rules;
  const cat = R.tests.catalogue;
  const lvl = (derived.D3_client_level && derived.D3_client_level.level) || 'L1';
  const fromZero = !!weekShape.test.from_zero;
  const older = (derived.age || 0) >= R.population.older.from_age;
  const profile = derived.D2_profile && model.hasSport(derived.D2_profile.id) ? model.sport(derived.D2_profile.id) : null;
  const allSlots = [];
  for (const day of L.days) if (day.kind === 'main' || day.kind === 'optional' || day.kind === 'aerobic') for (const s of daySlots(day)) allSlots.push({ day, s });
  const firstOf = (pred) => { // the week's counted (heavy) station first, then the work lift, then the first one
    const axial = allSlots.find(({ s }) => pred(s) && s.axial_req === 'axial');
    const work = allSlots.find(({ s }) => pred(s) && s.role === 'work');
    return axial || work || allSlots.find(({ s }) => pred(s)) || null;
  };
  const mark = (hit, test) => { if (hit && !hit.s.test) hit.s.test = test; };
  // v1.2 (review 01 / 02 / 03 / 04): jump, speed / agility and cardio tests are their own items, placed after the warm-up and
  // core opener, the same protocol in the baseline and the end week ("test before and at the end", R2-PER-07)
  const mains = L.days.filter((d) => d.kind === 'main');
  const strengthDays = new Set();
  const addTestItem = (day, key, test, text) => {
    if (!day) return;
    const slot = {
      slot_id: `${day.weekday}.test.${key}`, station_id: `test.${key}`, bucket: 'TEST', role: 'test', block: 'test', group: null, sets_hint: null,
      default_sets: 0, pair: null, superset: null, circuit: null, axial_req: null, variant: null, laterality_dial: false, loading: null, focus_muscle: null,
      time_class: null, counts_in_cap: false, counts_as_volume: false, text_key: text, aerobic: null, origin: 'test', why: [why('why.test_timing', 'R2-PER-07')],
      day_index: null, test, calf_index: null, note_tokens: []
    };
    let blk = day.blocks.find((b) => b.kind === 'test');
    if (!blk) {
      blk = { kind: 'test', movable: false, circuit: null, slots: [] };
      const order = R.ordering.block_order;
      const at = day.blocks.findIndex((b) => order.indexOf(b.kind) > order.indexOf('test'));
      if (at < 0) day.blocks.push(blk); else day.blocks.splice(at, 0, blk);
    }
    blk.slots.push(slot);
  };
  // v0.4 fix round 1 (RECHECK 04 major: the class's Tuesday test landed on a 3 x 10 incline-bench accessory after the strict press):
  // in the class model (rules.session.class_lift) the strength test is the class lifts - squat, press, deadlift: each
  // day's work lift of a tested pattern
  const KWL = R.session.class_lift;
  const classModel = !!(KWL && (KWL.families || []).includes(derived.D1_family));
  for (const item of weekShape.test.items) {
    if (item === 'strength') {
      const c = cat.strength;
      const test = older ? 'submax' : (fromZero ? c.from_zero[lvl] : c.after_completed_block[lvl]);
      const buckets = classModel ? [['RP_BKD'], ['RP_BHD'], ['RP_VPUSH', 'RP_HPUSH']] : [['RP_BKD'], ['RP_BHD'], ['RP_HPUSH']];
      for (const bs of buckets) {
        const hit = classModel
          ? (allSlots.find(({ s }) => bs.includes(s.bucket) && s.role === 'work' && s.block !== 'circuit') || firstOf((s) => bs.includes(s.bucket) && s.block !== 'circuit'))
          : firstOf((s) => bs.includes(s.bucket) && s.block !== 'circuit');
        mark(hit, test);
        if (hit) strengthDays.add(hit.day.weekday);
      }
    }
  }
  // v0.4 B4 (sample 02: the end-test Monday ran 131 min for 90 - the squat test, the sprint, the 5-10-5 and the jump test on one
  // day): the jump test goes to a day with jumps that holds no strength test and comes after the speed / agility day when one
  // is free (the tests spread over the test week, R2-PER-07)
  const order = ['strength', 'speed_agility', 'cardio', 'jumps', 'body'];
  const items = weekShape.test.items.slice().sort((a, b) => (order.indexOf(a) < 0 ? 99 : order.indexOf(a)) - (order.indexOf(b) < 0 ? 99 : order.indexOf(b)));
  const testDays = new Set();
  for (const item of items) {
    if (item === 'jumps') {
      if (older && !(derived.prefs && derived.prefs.older_athletic_opt_in) && cat.jumps.older_default === false) continue;
      // (fix round 2 / F2, E-165: a day with a lower-body jump station the test can replace comes first)
      const RSj = R.athletic.r2 && R.athletic.r2.tests && R.athletic.r2.tests.replace_station;
      const lowerJump = (s) => s.bucket === 'AP_PLYO' && s.variant !== 'upper' && !s.ankle_block;
      const jumpy = (d) => daySlots(d).some((s) => (RSj ? lowerJump(s) : PLYO_BUCKETS.includes(s.bucket))) || (RSj && !mains.some((x) => daySlots(x).some(lowerJump)) && daySlots(d).some((s) => PLYO_BUCKETS.includes(s.bucket)));
      // (fix round 1 / F2: a second sprint day can take the speed tests; the jump test then joins them before it joins a rep max)
      const day = mains.find((d) => jumpy(d) && !strengthDays.has(d.weekday) && !testDays.has(d.weekday)) || mains.find((d) => jumpy(d) && !strengthDays.has(d.weekday)) ||
        mains.find((d) => jumpy(d) && !testDays.has(d.weekday)) || mains.find(jumpy) || mains[0];
      addTestItem(day, 'jumps', cat.jumps.items[0], 'tests.' + cat.jumps.items[0]);
    } else if (item === 'speed_agility') {
      const c = cat.speed_agility;
      const aw = (derived.D11_athletic_budget && derived.D11_athletic_budget.weekly) || {};
      const sprinty = Array.isArray(aw.sprint_m) ? aw.sprint_m[0] > 0 : !!(profile && profile.speed_athlete);
      const cody = (Array.isArray(aw.cod_cuts) && aw.cod_cuts[0] > 0) || !!(profile && profile.cod_sport);
      const day = mains.find((d) => daySlots(d).some((s) => ['AP_SPRINT', 'AP_COD'].includes(s.bucket)) && !strengthDays.has(d.weekday)) ||
        mains.find((d) => daySlots(d).some((s) => ['AP_SPRINT', 'AP_COD'].includes(s.bucket))) || mains[0];
      const ib = c.items_by_profile || { sprint: c.items[0], cod: c.items[1] };
      // v0.4 fix round 2 / F2 (minimal seam, E-165; RECHECK v0.4 03 major 'let the 10-30 m sprint test replace Wednesday's acceleration
      // station, the 5-10-5 replace Monday's shuffle station'): each timed test goes to a day that holds its own station (no strength
      // test there), so the test replaces that station instead of adding to the day
      const RSs = R.athletic.r2 && R.athletic.r2.tests && R.athletic.r2.tests.replace_station;
      const dayWith = (bucket) => (RSs ? mains.find((d) => daySlots(d).some((s) => s.bucket === bucket) && !strengthDays.has(d.weekday)) : null) || day;
      const sprintDay = dayWith('AP_SPRINT'), codDay = dayWith('AP_COD');
      if (sprinty || !cody) { addTestItem(sprintDay, 'sprint', fromZero ? c.from_zero : ib.sprint, null); if (sprintDay) testDays.add(sprintDay.weekday); }
      if (cody) { addTestItem(codDay, 'cod', ib.cod, null); if (codDay) testDays.add(codDay.weekday); }
      if (day && !RSs) testDays.add(day.weekday);
    } else if (item === 'cardio') {
      const c = cat.cardio;
      const hasRun = (derived.D8_kit && (derived.D8_kit.tokens || []).includes('open_space_long'));
      const test = fromZero ? c.from_zero : (hasRun ? c.after_completed_block[0] : c.after_completed_block[1]);
      // the aerobic day (or the lightest day without a strength test), never after a max test or a WOD (review 04)
      const aero = allSlots.find(({ day, s }) => !!s.aerobic && day.kind === 'aerobic');
      if (aero) mark(aero, test);
      else {
        const light = mains.filter((d) => !strengthDays.has(d.weekday)).sort((a, b) => (a.est_minutes || 0) - (b.est_minutes || 0))[0] || mains[mains.length - 1];
        const aerSlot = light && daySlots(light).find((s) => !!s.aerobic);
        if (aerSlot && !daySlots(light).some((s) => s.bucket === 'COND_WOD')) aerSlot.test = test;
        else addTestItem(light, 'cardio', test, null);
      }
    }
    // 'body': no exercise item (rendered in the tests section)
  }
  // v0.4 fix round 2 / F2 (minimal seam, E-165; COACH-R2 R2-PER-07 'tested in the last week instead of that week's top sets'; RECHECK
  // v0.4 02 / 03 majors: the sprint, 5-10-5 and jump tests came on top of the day's own sprint, COD and jump stations): a timed test
  // replaces one station of its kind on its day (rules.athletic.r2.tests.replace_station) - the station is marked, left out of the
  // week's items and of the day's minutes
  const RS = R.athletic.r2 && R.athletic.r2.tests && R.athletic.r2.tests.replace_station;
  if (RS) for (const day of mains) {
    for (const t of daySlots(day).filter((s) => s.bucket === 'TEST')) {
      const kind = String(t.slot_id).split('.').pop();
      const buckets = RS[kind];
      if (!Array.isArray(buckets)) continue;
      const hit = daySlots(day).find((s) => buckets.includes(s.bucket) && !s.test_replaced && !s.ankle_block && !(s.bucket === 'AP_PLYO' && s.variant === 'upper'));
      if (hit) hit.test_replaced = t.test;
    }
  }
}

// ------------------------------------------------------------------------------------------------------------------
// internals
// ------------------------------------------------------------------------------------------------------------------

function makeCtx(derived, shape, tb, model, template, variant, dt, profile) {
  const R = model.rules;
  const age = derived.age || 0;
  const older = age >= R.population.older.from_age;
  const optIn = !!(derived.prefs && derived.prefs.older_athletic_opt_in) && older;
  const level = (derived.D3_client_level && derived.D3_client_level.level) || 'L1';
  const dropped = new Map(); // bucket -> Why
  const ex = new Set(derived.exclusions || []);
  if (ex.has('running')) for (const b of R.volume.pain.worse_with.running.avoid_buckets) dropped.set(b, why('why.left_out_exclusion', 'F38', { reason: 'running' }));
  if (ex.has('jumping')) for (const b of PLYO_BUCKETS) dropped.set(b, why('why.left_out_exclusion', 'F38', { reason: 'jumping' }));
  for (const p of derived.pain || []) for (const w of p.worse_with || []) {
    const ww = R.volume.pain.worse_with[w];
    if (ww && ww.avoid_buckets) for (const b of ww.avoid_buckets) dropped.set(b, why('why.pain_cut', 'VOL-03', { muscle: b, area: p.area }));
  }
  const D11 = derived.D11_athletic_budget || {};
  if (D11.heavy_play_week) dropped.set('AP_COD', why('why.heavy_play', 'R2-ATH-07'));
  if (tb.type === 'in_season' && D11.game_heavy) dropped.set('AP_COD', why('why.game_heavy', 'R2-ATH-07')); // R3-pending: R3-ATH-04
  const supersetsActive = (st) => {
    // v0.5: a template pair is a superset RECOMMENDATION (superset_eligible); it is switched on only by the client's preference
    if (!st.superset) return false;
    if (derived.prefs && derived.prefs.supersets_for_fatigue && (level === 'L1' || level === 'L3')) return true;
    return false;
  };
  const tbWeeks = ((shape && shape.weeks) || []).filter((w) => w.training_block === tb.n);
  const blockedDays = new Set([...(derived.play_days || []), ...((derived.D4_season_phase && derived.D4_season_phase.game_days) || [])].filter((d) => d in WDI));
  // the session size (R4-SES-02): the day's exercise count = the template day's own size, else the client type's default, inside
  // the type's range (older adults 5-6 whatever the template)
  const size = (derived.D6_week_layout && derived.D6_week_layout.session_size) || null;
  const countFor = (def) => {
    if (!size) return Infinity;
    const want = def && typeof def.count === 'number' ? def.count : size.default;
    return Math.min(size.range[1], Math.max(size.range[0], want));
  };
  return { derived, shape, tb, model, R, template, variant, dt, profile, size, countFor, older, optIn, level, dropped, supersetsActive,
    family: template.family, origSuperset: new Map(), peakWeek: tbWeeks[tbWeeks.length - 1] || null, firstWeek: tbWeeks[0] || null,
    blockedDays, warmup: warmupMode(derived, model, profile), olyExposures: 0 };
}

/** an optional day less than the hard-day gap before a play / game day takes upper-body, core and easy aerobic work only (R2-ATH-07 / R3-ATH-05 spacing, review 08) */
function nearPlay(wd, ctx) {
  const gapDays = Math.ceil((ctx.R.athletic.heavy_play_weeks.hard_day_gap_h || 48) / 24);
  for (const pd of ctx.blockedDays) { const g = (WDI[pd] - WDI[wd] + 7) % 7; if (g > 0 && g < gapDays + 1) return true; }
  return false;
}

/** the sets a template slot starts with before the volume plan (the layout's first time estimate) */
function templateSetsOf(s, ctx) {
  const R = ctx.R;
  if (s.bucket === 'AP_TRIPLE_EXT') { const per = olympicSetsPerExposure(ctx.derived, ctx.model, ctx.olyExposures, ctx.peakWeek); if (per != null) return per; }
  if (s.bucket === 'ISO_CALF' && s.role !== 'focus') return R.volume.calves.per_leg_day[ctx.level] || baseSets(s);
  return baseSets(s);
}

// INFERRED keyword table: a template station's note / pool filter names the coach's intended pick ('single-leg glute bridge',
// 'nordic curls', 'HEAVY single-arm row', 'KB face pull', 'DUBS' ...); select gives a matching exercise id a bonus (review 03)
const NOTE_KEYWORDS = [
  [/glute bridge/i, ['glute-bridge']], [/hip thrust/i, ['hip-thrust']], [/back extension/i, ['back-extension', 'hyperextension']], [/reverse hyper/i, ['reverse-hyper']],
  [/nordic/i, ['nordic']], [/single-arm row/i, ['single-arm']], [/face pull/i, ['face-pull']], [/\bdips?\b/i, ['dip']], [/push-up/i, ['push-up']],
  [/leg extension/i, ['leg-extension']], [/leg curl/i, ['leg-curl', 'hamstring-curl']], [/landmine/i, ['landmine']], [/\bDUBS\b|double-under/i, ['double-under']],
  [/GYMNASTICS/, ['toes-to-bar', 'muscle-up', 'handstand', 'kipping', 'ring']], [/loaded jump/i, ['jump-squat', 'loaded']], [/leg press/i, ['leg-press']],
  [/belt squat/i, ['belt-squat']], [/pull-through/i, ['pull-through']], [/walking lunge/i, ['walking-lunge']], [/plyo push-ups/i, ['plyometric-push-up']],
  [/staggered DB snatch/i, ['db-snatch']], [/hang power clean|hang clean/i, ['hang']]
];
function noteTokens(st) {
  const txt = [st.note, st.pool_filter].filter(Boolean).join(' ');
  if (!txt) return [];
  const out = [];
  for (const [re, toks] of NOTE_KEYWORDS) if (re.test(txt)) for (const t of toks) if (!out.includes(t)) out.push(t);
  return out;
}

function profileDef(derived, model) {
  const id = derived.D2_profile && derived.D2_profile.id;
  return id && model.hasSport(id) ? model.sport(id) : null;
}

function gameDays(derived) {
  const g = (derived.D4_season_phase && derived.D4_season_phase.game_days) || [];
  return g.filter((d) => d in WDI);
}

function inSeasonDays(userDays, derived, R) {
  const n = R.plan_types.season.in_season.days;
  const games = new Set(gameDays(derived));
  const ok = userDays.filter((wd) => !games.has(WEEKDAYS[(WDI[wd] + 1) % 7])); // hard day >= 48 h before a game
  const pick = (ok.length >= n ? ok : userDays).slice(0, n);
  return pick;
}

function kindOf(entry) {
  return entry.kind === 'main' ? 'main' : entry.kind === 'optional' ? 'optional' : entry.kind;
}
function dayTypeKind(entry, dt) {
  const def = dt.day_types[entry.day_type];
  return def ? def.kind : entry.kind;
}
function dayTypeDef(entry, dt) {
  if (!entry) return null;
  const d = dt.day_types[entry.day_type];
  if (d) return d;
  if (entry.kind === 'aerobic') { // e.g. no_equipment templates name the aerobic day type 'run'
    const k = Object.keys(dt.day_types).sort().find((x) => dt.day_types[x].kind === 'aerobic');
    return k ? dt.day_types[k] : null;
  }
  return null;
}

/** program id: first match of templates.program_names (keys family, days, variant, goal, format, competitive, profile_family) */
export function programIdFor(derived, model) {
  const D6 = derived.D6_week_layout;
  const prof = derived.D2_profile || {};
  const sd = prof.id && model.hasSport(prof.id) ? model.sport(prof.id) : null;
  const facts = {
    family: D6.family, days: D6.days, variant: D6.variant || null, goal: derived.goal, format: D6.format || derived.format || 'gym',
    competitive: prof.competitive || 'none', profile_family: sd ? sd.family : null
  };
  for (const row of model.templates.program_names) {
    let ok = true;
    for (const [k, vals] of Object.entries(row.when)) {
      if (!Array.isArray(vals) || !vals.includes(facts[k])) { ok = false; break; }
    }
    if (ok) return row.id;
  }
  return null;
}

/** v0.6 (G-130): the arm slot of the athletic A / B days is in this model */
function st6Arm(ctx) { return !!(ctx.R.selection.s6); }

/** focus muscles for template FOCUS stations: priorities rotate over days; otherwise least-covered target muscles */
function planFocus(occupied, dt, ctx) {
  const { derived, model } = ctx;
  const targets = derived.D9_start_sets || { fill: {} };
  const fill = targets.fill || {};
  const prio = [...(derived.priority_muscles || [])].filter((m) => fill[m] === 'target' || fill[m] === 'own_sets');
  const profPrio = ((ctx.profile && ctx.profile.priority_muscles) || []).filter((m) => (fill[m] === 'target' || fill[m] === 'own_sets') && !prio.includes(m) && model.groupOf(m) !== 'calves');
  const coverage = {};
  for (const [, p] of occupied) {
    if (p.kind !== 'main') continue;
    const def = dayTypeDef(p.entry, dt);
    if (!def) continue;
    for (const st of def.stations) if (st.group && RES_KINDS.includes(model.bucket(st.bucket).kind)) coverage[st.group] = (coverage[st.group] || 0) + 1;
  }
  const ratioFirst = (ctx.profile && ctx.profile.volume_ratios || []).map((r) => r.muscle);
  // v1.2 (review 08 / 06, ORD-11): Focus serves a priority muscle (the client's, then the sport profile's) or a floor-lifted
  // small muscle (side delts, arms, glutes, rear delts) - never extra chest flies or leg extensions for nobody's priority
  const FOCUS_SMALL = ['side_delts', 'rear_delts', 'biceps', 'triceps', 'glutes'];
  const ds = (ctx.profile && ctx.profile.direct_sets_wk) || {};
  const direct = { triceps: ds.ISO_TRICEP > 0, biceps: ds.ISO_BICEP > 0 }; // the sport profile's own direct arm sets (04 weekly_sets)
  // v0.6 (G-130): an arm the main days already train in the template's slot 5 needs no optional-day Focus slot for the profile's direct
  // sets (sample bench 27: three triceps Focus slots on top of the B days' triceps exercises took the group past its ceiling)
  const armKept = new Set();
  for (const [, p] of occupied) {
    if (p.kind !== 'main') continue;
    const def = dayTypeDef(p.entry, dt);
    if (def) for (const st of def.stations) if ((st.bucket === 'ISO_BICEP' || st.bucket === 'ISO_TRICEP') && st.condition === 'if_athletic_arm_sets' && keepStation(st, ctx, ctx.countFor(def))) armKept.add(st.bucket === 'ISO_BICEP' ? 'biceps' : 'triceps');
  }
  if (!st6Arm(ctx)) armKept.clear();
  const fallback = model.muscleIds({ target: true })
    // v0.4 fix round 1 (RECHECK 02 minor: credit-only triceps took 6 direct sets on the optional days, labelled Focus): a muscle the
    // plan keeps to compound credit never fills a Focus slot
    .filter((m) => (fill[m] === 'target' || fill[m] === 'own_sets') && model.groupOf(m) !== 'calves' && (FOCUS_SMALL.includes(m) || profPrio.includes(m) || ratioFirst.includes(m)))
    // and an arm muscle the sport profile writes 0 direct sets for (04 weekly_sets ISO_BICEP / ISO_TRICEP 0; RECHECK 08 major: the
    // racket player's only upper-body work was curls and kickbacks labelled Focus)
    .filter((m) => !((m === 'biceps' && ds.ISO_BICEP === 0) || (m === 'triceps' && ds.ISO_TRICEP === 0)))
    // (v0.6, G-130: an arm the main days train in the template's slot 5 - the client's own Focus choice aside, `prio`)
    .filter((m) => !armKept.has(m))
    .map((m, i) => ({ m, i, r: profPrio.includes(m) || ratioFirst.includes(m) ? (profPrio.indexOf(m) >= 0 ? profPrio.indexOf(m) : 0) : (direct[m] ? 50 : 99), c: coverage[model.groupOf(m)] || 0 }))
    .sort((a, b) => a.r - b.r || a.c - b.c || a.i - b.i)
    .map((x) => x.m);
  return { prio, fallback, optIdx: 0, mainIdx: 0, distinct: !prio.length };
}

function chooseFocus(day, stationsKept, ctx, focusPlan, isOptional) {
  const { model } = ctx;
  const list = focusPlan.prio.length ? focusPlan.prio : focusPlan.fallback;
  if (!list.length) return null;
  if (isOptional) {
    const near = day && day.near_play;
    const pool = near ? list.filter((m) => model.muscle(m).region !== 'lower') : list;
    if (!pool.length) return null;
    const m = pool[focusPlan.optIdx % pool.length];
    focusPlan.optIdx++;
    return m;
  }
  // main day: a muscle whose group already has 1-3 exercises today (keeps 2-4 per group, R2-SES-05)
  const counts = {};
  for (const st of stationsKept) if (st.group && RES_KINDS.includes(model.bucket(st.bucket).kind)) counts[st.group] = (counts[st.group] || 0) + 1;
  const ok = list.filter((m) => { const c = counts[model.groupOf(m)] || 0; return c >= 1 && c <= 3; });
  if (!ok.length) return null;
  const m = ok[focusPlan.mainIdx % ok.length];
  focusPlan.mainIdx++;
  return m;
}

/** rank of a template extra: a station outside the count that is not part of the default session (set by the template build) */
const EXTRA_RANK = 99;
const OUTSIDE_COUNT_BLOCKS = (ctx) => ctx.R.session.outside_cap_blocks || [];

/**
 * Does the day hold this template station? v0.5 (R4-SES-02): a counted station stays when its rank is inside the day's exercise
 * count (`count`; Infinity = any rank); stations outside the count (warm-up, core, joint care, cardio ...) always stay.
 */
function keepStation(st, ctx, count = Infinity) {
  const { derived } = ctx;
  if (typeof st.rank === 'number' && st.rank > count) return false;
  // a template extra (skill practice or a cardio station v0.4 added only to a longer session): there to add, never in the
  // default session - the day's count is exercises, and these sit outside it (tools/fixture/v05-structure.mjs EXTRA_RANK)
  if (typeof st.rank === 'number' && st.rank >= EXTRA_RANK && OUTSIDE_COUNT_BLOCKS(ctx).includes(st.block)) return false;
  // the sprint buy-out (the finisher of his athletic example week) belongs to the competitive athlete's session; a stay-active or
  // older plan does not get it by default (rules.session.size.finisher_types; v0.4 gave it from 75 minutes - PROPOSED, G-08)
  if (st.bucket === 'COND_SPRINT_BUYOUT' && ctx.size && ctx.R.session.size.finisher_types && !ctx.R.session.size.finisher_types.includes(ctx.size.type)) return false;
  if (st.condition) {
    const m = /^if_priority:(.+)$/.exec(st.condition);
    if (m) {
      const want = m[1];
      const pri = derived.priority_muscles || [];
      if (!pri.includes(want)) return false;
    }
    // v0.6 (G-130, R4-SES-05 slot 5 on the athletic A / B days): a station for one client type's session only - the competitive
    // athlete's arm slot is not in the stay-active adult's or the older adult's day (his athletic sheet holds no arm isolation)
    const t = /^if_session_type:(.+)$/.exec(st.condition);
    if (t && !(ctx.size && t[1].split('|').includes(ctx.size.type))) return false;
    // (... and for a sport whose profile writes direct arm sets - 04 weekly_sets ISO_BICEP / ISO_TRICEP; most field sports leave the
    // arms to the compound lifts, OBSERVED BYOP ATHLETIC, and the soccer reviewer asked to keep it so)
    if (st.condition === 'if_athletic_arm_sets') {
      const ds = (ctx.profile && ctx.profile.direct_sets_wk) || {};
      if (!(ctx.size && ctx.size.type === 'athletic' && ((ds.ISO_BICEP || 0) > 0 || (ds.ISO_TRICEP || 0) > 0))) return false;
    }
  }
  return true;
}

/** fix round 2: does the client's kit hold a library exercise (not a swap-only or home-substitute record, not above the client's
 *  level) for this circuit station's bucket? A bucket the selection gives a library stand-in (the quad and leg-curl stations with
 *  no machine) counts as fillable. */
function circuitFillable(st, ctx, KA) {
  const { model, derived, R } = ctx;
  let b = null;
  try { b = model.bucket(st.bucket); } catch { b = null; }
  if (!b || !['resistance', 'isolation'].includes(b.kind)) return true;
  if ((KA.stand_in_buckets || []).includes(st.bucket)) return true;
  const kitD = derived.D8_kit || { tokens: [], machines: [] };
  // (the second chest station takes a push-up variant in a gym or field kit - rules.selection.x2.circuit.stand_in.ISO_CHEST)
  if ((KA.stand_in_buckets_not_home || []).includes(st.bucket) && (KA.not_home_profiles || []).includes(kitD.profile)) return true;
  const kitObj = { tokens: new Set(kitD.tokens || []), machines: kitD.machines || [] };
  const swapOnly = R.selection.swap_only_statuses || [];
  const order = R.levels.ladder_order;
  const lvl = (derived.D3_client_level && derived.D3_client_level.level) || 'L1';
  const ladder = (derived.D3_client_level && derived.D3_client_level.exercise_ladder) || R.levels.exercise_ladder[lvl];
  const generic = (R.selection.generic_id_patterns || []).map((x) => new RegExp(x));
  // (a home or body-weight kit fills a station with the coach's home substitutes - R2-LIB-07 'for home clients'; a gym or a field
  // kit does not)
  const homeKit = !(KA.not_home_profiles || []).includes(kitD.profile);
  const ok = (e, extraIds = []) => !SWAP_ONLY_STATUS.includes(e.status) && (!swapOnly.includes(e.status) || extraIds.includes(e.id)) && (homeKit || !(e.tags || []).includes('home_substitute')) &&
    !generic.some((re) => re.test(e.id)) && order.indexOf(e.level) <= order.indexOf(ladder) && model.kitAvailable(e, kitObj);
  if (model.bySlot(st.bucket).some((e) => ok(e))) return true;
  // (a vertical-pull station the kit cannot fill is only given up when the kit holds two or more different rows - a kit with one
  // row keeps the station as that row again, so the week's pulling does not fall under its pressing; VOL-18)
  if (st.bucket === 'RP_VPULL') {
    const SK = R.selection.x2 && R.selection.x2.small_kit_rows;
    const rows = model.bySlot('RP_HPULL').filter((e) => ok(e, (SK && SK.ids) || []));
    // (with two or more rows the station is not one more row: it becomes a rear-delt fly - rules.selection.x2.circuit.stand_in.RP_VPULL)
    return rows.length < 2 || (KA.hand_over_buckets || []).includes(st.bucket);
  }
  return false;
}

function defaultSetsFor(st, bucketDef, ctx, calfIndex) {
  const ds = ctx.R.session.default_sets;
  if (st.block === 'circuit') return ctx.R.supersets.bootcamp.stairway.rounds_start; // a round = 1 set (D-19)
  switch (bucketDef.kind) {
    case 'resistance': return ds.compound;
    case 'isolation':
      if (st.bucket === 'ISO_CALF') return calfIndex === 0 ? ds.calves_first : ds.calves_second;
      return ds.isolation;
    case 'core': return ds.core;
    case 'athletic': case 'power': return ds.athletic;
    case 'focus': return ds.focus;
    case 'conditioning': return st.bucket === 'COND_SPRINT_BUYOUT' ? ds.athletic : 0;
    default: return 0;
  }
}

function normAxial(a) {
  if (a === 'axial' || a === 'non_axial' || a === 'light_or_non_axial') return a;
  if (a === 'light_technique') return 'light_or_non_axial';
  return null;
}

function warmupTextKey(st, def, ctx) {
  const W = ctx.R.warmup;
  if (st.bucket === 'WARMUP_GENERAL') return W.general.text_key;
  // WARMUP_PREP: A-drills on lower / athletic days, mobility before pressing (ORD-08); v1.2: the sport profile decides first
  // (mobility for non-running sports / shoulder hot spots / no running space / lower-limb pain; balance for court fall risk)
  if (ctx.warmup === 'mobility') return 'warmup.mobility_prep';
  if (ctx.warmup === 'balance') return 'warmup.balance_prep';
  if (ctx.warmup === 'drills') return W.before_sprints;
  const lower = def.lower_focus || ctx.family === 'athletic';
  return lower ? W.before_sprints : 'warmup.mobility';
}

function slotFromStation(wd, st, def, ctx, extras) {
  const { model } = ctx;
  const b = model.bucket(st.bucket);
  const active = ctx.supersetsActive(st);
  const slotId = `${wd}.${st.id}`;
  if (st.superset) ctx.origSuperset.set(slotId, st.superset);
  const s = {
    slot_id: slotId,
    station_id: st.id,
    bucket: st.bucket,
    role: st.role,
    block: st.block,
    group: st.group || null,
    sets_hint: st.sets_hint ? st.sets_hint.slice() : null,
    default_sets: defaultSetsFor(st, b, ctx, extras.calfIndex),
    pair: st.pair || null,
    superset: active ? st.superset : null,
    // v0.4 (R3-SES-02 step 3): the template pair this station may be supersetted with (a recommendation; on when the time needs it)
    superset_eligible: st.superset || null,
    circuit: st.circuit == null ? null : st.circuit,
    axial_req: normAxial(st.axial),
    variant: st.variant || null,
    laterality_dial: !!st.laterality_dial,
    loading: st.loading ? 'contra_ipsi' : null,
    focus_muscle: extras.focus || null,
    time_class: b.time_class || null,
    counts_in_cap: !ctx.R.session.outside_cap_blocks.includes(st.block),
    counts_as_volume: st.counts_as_volume !== false,
    text_key: b.kind === 'warmup' ? warmupTextKey(st, def, ctx) : null,
    aerobic: null,
    origin: 'template',
    why: [],
    day_index: extras.dayIndex,
    test: null,
    calf_index: st.bucket === 'ISO_CALF' ? extras.calfIndex : null,
    note_tokens: noteTokens(st)
  };
  if (b.kind === 'focus' && s.focus_muscle) s.group = model.groupOf(s.focus_muscle);
  if (b.kind === 'warmup') s.why.push(why('why.warmup', 'ORD-08'));
  if (b.kind === 'core') s.why.push(ctx.derived.prefs && ctx.derived.prefs.core_position && ctx.derived.prefs.core_position !== 'start'
    ? why('why.core_moved', 'R2-SES-03') : why('why.core_first', 'ATH-11'));
  if (st.bucket === 'COND_WOD') s.why.push(why('why.wod', 'D-20'));
  if (b.kind === 'focus') s.why.push(why('why.focus', 'ORD-11'));
  if (extras.olderLanding) s.why.push(why('why.older_default', 'R2-ATH-08'));
  return s;
}

function buildDay(wd, placement, def, ctx, focusPlan, dayIndex) {
  const { model, derived, R } = ctx;
  const dayWhy = [];
  const isOptional = placement.kind === 'optional';
  const near = isOptional && nearPlay(wd, ctx);
  const kept = [];
  const aerobicStations = [];
  const count = ctx.countFor(def);
  // v0.5 fix round 2 (sample 05 majors; rules.session.x2.circuit_kit_aware): in a timed circuit a station the ENGINE added that the
  // kit cannot fill with a library exercise at the client's level gives its place to the template's next station; one of the
  // coach's own slots (`own`) always stays - select gives it the nearest pattern and the plan says what that loses
  let circuitKeep = null;
  const ownIds = new Set();
  const KA = R.session.x2 && R.session.x2.circuit_kit_aware;
  if (KA && KA.enabled && def.format === 'circuit' && Number.isFinite(count)) {
    circuitKeep = new Set();
    const ranked = def.stations.filter((x) => x.block === 'circuit' && typeof x.rank === 'number' && x.rank < EXTRA_RANK).slice().sort((a, b) => a.rank - b.rank);
    // (the coach's own slots of the session: rules.session.x2.circuit_kit_aware.own_slots, the first station of each named bucket)
    const OS = KA.own_slots || null;
    const mm = OS ? new RegExp(OS.day_re).exec(String(placement.entry.day_type || '')) : null;
    const left = mm && OS.by_session[mm[1]] ? OS.by_session[mm[1]].slice() : [];
    for (const x of ranked) { const i = left.indexOf(x.bucket); if (i >= 0) { ownIds.add(x.id); left.splice(i, 1); } }
    let n = 0;
    for (const x of ranked) {
      if (n >= count) break;
      if (!ownIds.has(x.id) && !circuitFillable(x, ctx, KA)) { dayWhy.push(why('why.kit', 'EQ-09')); continue; }
      circuitKeep.add(x.id); n++;
    }
  }
  for (const st of def.stations) {
    if (circuitKeep && st.block === 'circuit' && typeof st.rank === 'number' && st.rank < EXTRA_RANK) { if (!circuitKeep.has(st.id) || !keepStation(st, ctx, Infinity)) continue; }
    else if (!keepStation(st, ctx, count)) continue;
    if (near && st.bucket !== 'FOCUS' && ctx.model.bucket(st.bucket).region === 'lower' && st.bucket !== 'COND_AEROBIC') { dayWhy.push(why('why.play_spacing', 'R2-ATH-07')); continue; }
    if (near && ['ISO_CALF', 'ISO_QUAD', 'ISO_LEG_FLEXION', 'RP_BKD', 'RP_UKD', 'RP_BHD', 'RP_UHD', 'AP_PLYO', 'AP_JUMP_LIMITED_KNEE', 'AP_COD', 'AP_SPRINT'].includes(st.bucket)) { dayWhy.push(why('why.play_spacing', 'R2-ATH-07')); continue; }
    if (ctx.dropped.has(st.bucket)) { dayWhy.push(ctx.dropped.get(st.bucket)); continue; }
    let olderLanding = false;
    if (st.older_default_excluded && ctx.older && !ctx.optIn) { // R3-pending: R3-ATH-02
      if (PLYO_BUCKETS.includes(st.bucket)) olderLanding = true; // landing / easy version (select restricts the pool)
      else { dayWhy.push(why('why.older_default', 'R2-ATH-08')); continue; }
    }
    if (st.bucket === 'COND_AEROBIC') { aerobicStations.push(st); continue; }
    kept.push({ st, olderLanding });
  }
  const slots = [];
  let calfIndex = 0;
  let optFocus; // both Focus slots of one optional day hit the same muscle (ORD-11, R2-SES-05)
  for (const { st, olderLanding } of kept) {
    let focus = null;
    if (model.bucket(st.bucket).kind === 'focus') {
      if (isOptional) {
        if (focusPlan.distinct) focus = chooseFocus({ near_play: near }, [], ctx, focusPlan, true);
        else { if (optFocus === undefined) optFocus = chooseFocus({ near_play: near }, [], ctx, focusPlan, true); focus = optFocus; }
      } else {
        focus = chooseFocus(null, kept.map((k) => k.st), ctx, focusPlan, false);
      }
      if (!focus) continue;
    }
    const s = slotFromStation(wd, st, def, ctx, { calfIndex, focus, olderLanding, dayIndex });
    if (ownIds.has(st.id)) s.own = true;
    if (st.bucket === 'ISO_CALF') calfIndex++;
    slots.push(s);
  }
  repairSmallSupersets(slots, ctx);
  // prehab (rules.prehab.by_injury_code; 50-59 racket rules) is added after all days exist (addPrehab)
  const day = {
    weekday: wd,
    day_type: placement.entry.day_type,
    kind: placement.kind,
    optional: !!placement.optional,
    label_key: def.label_key,
    lower_focus: def.lower_focus || null,
    full_body: !!def.full_body,
    format: def.format || 'straight',
    exercise_count: Number.isFinite(count) ? count : null,
    supersets_on: false,
    est_minutes: 0,
    groups: [],
    blocks: [],
    why: dayWhy,
    circuit_dose: null,
    _slots: slots,
    _aerobic_stations: aerobicStations,
    _aerobic_used: [],
    _day_index: dayIndex,
    _def: def
  };
  if (day.lower_focus || slots.some((s) => s.axial_req === 'axial')) {
    if (def.axial && def.axial.squat) day.why.push(why('why.two_spine_days', 'R2-SES-01', { pattern: 'squat' }));
    if (def.axial && def.axial.hinge) day.why.push(why('why.two_spine_days', 'R2-SES-01', { pattern: 'hinge' }));
  }
  if (day.kind === 'main' && ctx.derived.D14_aerobic_sessions && ctx.derived.D14_aerobic_sessions.walks) {
    const id = `${placement.entry.day_type}.c01`; // cooldown
    slots.push({
      slot_id: `${wd}.${id}`, station_id: id, bucket: 'WARMUP_GENERAL', role: 'cooldown', block: 'cooldown', group: null,
      sets_hint: null, default_sets: 0, pair: null, superset: null, circuit: null, axial_req: null, variant: null,
      laterality_dial: false, loading: null, focus_muscle: null, time_class: null, counts_in_cap: false, counts_as_volume: false,
      text_key: 'note.walk_after', aerobic: null, origin: 'cooldown', why: [why('why.walks', 'ATH-07')], day_index: dayIndex, test: null
    });
  }
  return day;
}

/**
 * v1.2 (master 10.6 PROPOSED, review 02 / 03 / 07 minors): two exercises for the same muscle group are never supersetted with
 * each other; small isolations re-pair across groups by rules.supersets.pairs (calves with a delt, biceps with rear delts,
 * triceps with side delts). Works on the template superset ids (the time cut turns them on later).
 */
function repairSmallSupersets(slots, ctx) {
  const { model } = ctx;
  const groupOfS = (s) => (s.bucket === 'ISO_SIDE_REAR_DELT' ? (s.variant === 'rear' ? 'rear' : 'side') : s.bucket === 'ISO_CALF' ? 'calves' : s.bucket === 'ISO_BICEP' ? 'biceps' : s.bucket === 'ISO_TRICEP' ? 'triceps' : null);
  const orig = (s) => ctx.origSuperset.get(s.slot_id) || s.superset || null;
  const byId = new Map();
  for (const s of slots) { const id = orig(s); if (id && SMALL_ISO_BUCKETS.includes(s.bucket)) { if (!byId.has(id)) byId.set(id, []); byId.get(id).push(s); } }
  const loose = [];
  for (const [id, mates] of byId) {
    const groups = new Set(mates.map((s) => (s.bucket === 'ISO_SIDE_REAR_DELT' ? 'shoulders' : groupOfS(s))));
    if (mates.length >= 2 && groups.size === 1) for (const s of mates) loose.push({ s, id });
  }
  if (!loose.length) return;
  const wants = { calves: ['side', 'rear'], biceps: ['rear'], triceps: ['side'], rear: ['biceps', 'calves'], side: ['triceps', 'calves'] };
  const free = loose.slice();
  const paired = new Set();
  for (const a of loose) {
    if (paired.has(a.s)) continue;
    const ga = groupOfS(a.s);
    const b = free.find((x) => x.s !== a.s && !paired.has(x.s) && (wants[ga] || []).includes(groupOfS(x.s)));
    if (!b) continue;
    paired.add(a.s); paired.add(b.s);
    const id = a.id;
    for (const s of [a.s, b.s]) { const active = !!s.superset; ctx.origSuperset.set(s.slot_id, id); s.superset = active ? id : null; s.superset_eligible = id; }
  }
  for (const { s } of loose) if (!paired.has(s)) { ctx.origSuperset.delete(s.slot_id); s.superset = null; s.superset_eligible = null; }
  void model;
}

function makeAerobicSlot(slotId, stationId, colour, position, ctx, whys) {
  const R = ctx.R;
  return {
    slot_id: slotId, station_id: stationId, bucket: 'COND_AEROBIC', role: 'aerobic_block', block: 'aerobic', group: null,
    sets_hint: null, default_sets: 0, pair: null, superset: null, circuit: null, axial_req: null, variant: null,
    laterality_dial: false, loading: null, focus_muscle: null, time_class: null, counts_in_cap: false, counts_as_volume: false,
    text_key: null, aerobic: { colour, minutes: R.conditioning.minutes[colour].slice(), position },
    origin: position === 'separate' ? 'template' : 'aerobic_addon',
    why: [why('why.aerobic_colour', 'R2-SES-06'), ...(whys || [])], day_index: null, test: null
  };
}

function aerobicSlotFromStation(day, st, colour, ctx) {
  const s = makeAerobicSlot(`${day.weekday}.${st.id}`, st.id, colour, day.kind === 'main' ? 'addon_after' : 'separate', ctx, []);
  s.origin = 'template';
  s.day_index = day._day_index;
  return s;
}

function buildAerobicDay(wd, def, entry, colour, ctx, dayIndex) {
  const slots = [];
  if (def) {
    for (const st of def.stations) {
      if (!keepStation(st, ctx)) continue;
      if (st.bucket === 'COND_AEROBIC') { const a = makeAerobicSlot(`${wd}.${st.id}`, st.id, colour, 'separate', ctx, []); a.day_index = dayIndex; slots.push(a); }
      else if (ctx.model.bucket(st.bucket).kind === 'warmup') slots.push(slotFromStation(wd, st, def, ctx, { calfIndex: 0, focus: null, olderLanding: false, dayIndex }));
    }
  }
  if (!slots.some((s) => s.aerobic)) {
    const a = makeAerobicSlot(`${wd}.aerobic.a01`, 'aerobic.a01', colour, 'separate', ctx, []);
    a.day_index = dayIndex;
    slots.push(a);
  }
  return {
    weekday: wd, day_type: entry ? entry.day_type : 'aerobic', kind: 'aerobic', optional: !!(entry && entry.optional),
    label_key: def ? def.label_key : 'ui.plan.aerobic_day', lower_focus: null, full_body: false, format: 'straight',
    supersets_on: false, est_minutes: 0, groups: [], blocks: [], why: [why('why.aerobic_count', 'R2-SES-06', { n: 1 })],
    circuit_dose: null, _slots: slots, _aerobic_stations: [], _aerobic_used: [], _day_index: dayIndex
  };
}

function aerobicPlan(derived, tb, profile, model) {
  const R = model.rules;
  const D14 = derived.D14_aerobic_sessions || { per_week: 0, base: 0, adjust: 0, replaced_by_activity: 0, colours: [] };
  let n = D14.per_week || 0;
  let base = D14.base || 0;
  const adjust = D14.adjust || 0;
  let colours = Array.isArray(D14.colours) ? D14.colours.slice() : [];
  if (tb.type === 'pre_season' || tb.type === 'taper' || tb.type === 'in_season') {
    const key = tb.type === 'in_season' ? 'in' : 'pre';
    const fromProfile = profile && profile.aerobic && profile.aerobic[key] != null ? profile.aerobic[key] : null;
    base = D14.sport_is_aerobic ? 0 : (fromProfile != null ? fromProfile : R.conditioning.sessions[tb.type === 'in_season' ? 'athlete_in' : 'athlete_pre']);
    // v0.6 (G-136): the team practices count in these blocks too (rules.conditioning.s6.practice, PROPOSED)
    const PRc = R.conditioning.s6 && R.conditioning.s6.practice;
    const rp = PRc && D14.practice_days > 0 && base >= 1 ? Math.max(0, Math.min(D14.practice_days, PRc.max_replaced, base - PRc.keep_gym_led_min)) : 0;
    n = Math.max(R.conditioning.cardio_adjust.floor_total, base - rp + adjust);
    colours = [];
  } else if (tb.type === 'recovery') {
    colours = colours.map(() => 'C');
  }
  if (colours.length < n) {
    // fill_order [C, B, A] for the base sessions, extra sessions Orange (never the same colour twice except the extra C)
    const fo = R.conditioning.fill_order;
    colours = [];
    for (let k = 0; k < n; k++) colours.push(k < fo.length && k < Math.max(base, 0) ? fo[k] : R.conditioning.extra_colour);
  }
  return { n, colours, adjust, replaced: D14.replaced_by_activity || 0 };
}

function blockOrderFor(ctx) {
  const R = ctx.R;
  const order = R.ordering.block_order.slice();
  const pos = (ctx.derived.prefs && ctx.derived.prefs.core_position) || R.core_block.position_default;
  if (pos !== 'start') {
    const i = order.indexOf('core');
    order.splice(i, 1);
    const after = R.ordering.core_positions[pos];
    if (after === 'after_athletic') order.splice(order.indexOf('athletic') + 1, 0, 'core');
    else if (after === 'after_strength') order.splice(order.indexOf('strength') + 1, 0, 'core');
    else if (after === 'end') order.splice(order.indexOf('cooldown'), 0, 'core');
    else order.splice(order.indexOf('warmup') + 1, 0, 'core');
  }
  return order;
}

/** group slots into ordered blocks; apply athletic order, priority-small-first, H before V, supersets */
function finalizeDay(d, ctx, preview) {
  const { model, R, derived } = ctx;
  const slots = [...d._slots, ...d._aerobic_used].map((s) => ({ ...s, why: s.why.slice() }));
  const order = blockOrderFor(ctx);
  const fighterOpen = slots.filter((s) => s.aerobic && s.aerobic.position === 'open_day');
  const byBlock = new Map();
  for (const s of slots) {
    if (fighterOpen.includes(s)) continue;
    const k = s.block === 'circuit' ? `circuit:${s.circuit || 1}` : s.block;
    if (!byBlock.has(k)) byBlock.set(k, []);
    byBlock.get(k).push(s);
  }
  // athletic block: AP_SPRINT, AP_PLYO, AP_JUMP_LIMITED_KNEE, AP_THROW, AP_COD (speed session order)
  if (byBlock.has('athletic')) {
    const ao = R.ordering.athletic_bucket_order;
    const arr = byBlock.get('athletic').map((s, i) => ({ s, i }));
    arr.sort((a, b) => (ao.indexOf(a.s.bucket) + 99) % 99 - (ao.indexOf(b.s.bucket) + 99) % 99 || a.i - b.i);
    byBlock.set('athletic', arr.map((x) => x.s));
  }
  const blocks = [];
  for (const kind of order) {
    if (kind === 'circuit') {
      const keys = [...byBlock.keys()].filter((k) => k.startsWith('circuit:')).sort();
      for (const k of keys) blocks.push({ kind: 'circuit', movable: false, circuit: Number(k.split(':')[1]), slots: byBlock.get(k) });
      continue;
    }
    if (!byBlock.has(kind)) continue;
    blocks.push({ kind, movable: kind === 'core', circuit: null, slots: byBlock.get(kind) });
    if (kind === 'warmup' && fighterOpen.length) blocks.push({ kind: 'aerobic', movable: false, circuit: null, slots: fighterOpen });
  }
  if (fighterOpen.length && !blocks.some((b) => b.slots === fighterOpen)) blocks.unshift({ kind: 'aerobic', movable: false, circuit: null, slots: fighterOpen });
  const day = {
    weekday: d.weekday, day_type: d.day_type, kind: d.kind, optional: d.optional, label_key: d.label_key,
    lower_focus: d.lower_focus, full_body: d.full_body, format: d.format, exercise_count: d.exercise_count ?? null,
    // v0.5 / V3 (COACH-R4 R4-SES-05): the coach's skeleton this day was built to (the template day type's own: gym_A, gym_B ...)
    skeleton: (d._def && d._def.skeleton) || null,
    supersets_on: false, est_minutes: 0, groups: [], blocks, why: d.why.slice(), circuit_dose: d.circuit_dose
  };
  if (preview) return day;

  // priority small muscle first (ORD-04, allowed override): the first such isolation moves to the front of strength
  const smallPrio = (derived.priority_muscles || []).filter((m) => model.muscle(m).class === 'small');
  const strength = day.blocks.find((b) => b.kind === 'strength');
  const acc = day.blocks.find((b) => b.kind === 'accessories');
  // only when the kit holds an exercise whose prime mover is that muscle (else select falls back to another class and the
  // moved item would no longer be the priority isolation)
  const kitObj = { tokens: new Set((derived.D8_kit && derived.D8_kit.tokens) || []), machines: (derived.D8_kit && derived.D8_kit.machines) || [] };
  const inKit = (s) => model.bySlot(s.bucket).some((e) => e.primary_muscle === slotMuscle(s, model) && model.kitAvailable(e, kitObj));
  if (smallPrio.length && strength && acc) {
    const idx = acc.slots.findIndex((s) => model.bucket(s.bucket).kind === 'isolation' && smallPrio.includes(slotMuscle(s, model)) && inKit(s));
    if (idx >= 0) {
      const [s] = acc.slots.splice(idx, 1);
      // v0.4 fix round 1 (RECHECK 06 major: the moved isolation stayed the eligible partner of an accessory, so the printed pair
      // spanned two blocks): the moved item leaves its pair - active and recommended - and a lone partner is freed
      const pid = s.superset || s.superset_eligible || ctx.origSuperset.get(s.slot_id) || null;
      if (pid) for (const x of acc.slots) if (x.superset === pid || x.superset_eligible === pid) { x.superset = null; x.superset_eligible = null; ctx.origSuperset.delete(x.slot_id); }
      s.superset = null; s.superset_eligible = null; ctx.origSuperset.delete(s.slot_id);
      s.why.push(why('why.priority_first', 'ORD-04'));
      strength.slots.unshift(s);
      if (!acc.slots.length) day.blocks.splice(day.blocks.indexOf(acc), 1);
    }
  }
  // H before V (ORD-01), exempt when the vertical lift is the day's work (ORD-02, D-30)
  for (const [h, v] of [['RP_HPULL', 'RP_VPULL'], ['RP_HPUSH', 'RP_VPUSH']]) {
    const flat = daySlots(day);
    const iH = flat.findIndex((s) => s.bucket === h && s.block !== 'circuit');
    const iV = flat.findIndex((s) => s.bucket === v && s.block !== 'circuit');
    if (iH < 0 || iV < 0) continue;
    if (iV < iH) {
      if (flat[iV].role === 'work') { day.why.push(why('why.work_first_vertical', 'D-30')); continue; }
      swapSlots(day, flat[iV], flat[iH]);
    }
    day.why.push(why('why.h_before_v', 'ORD-01'));
  }
  // power before strength (ORD-03) and pairing whys (UNI-11)
  if (day.blocks.some((b) => b.kind === 'athletic' || b.kind === 'power') && strength) day.why.push(why('why.power_before_strength', 'ORD-03'));
  if (!R.pairing.not_for_variants.includes(ctx.variant)) {
    const pairs = new Map();
    for (const s of daySlots(day)) if (s.pair) { if (!pairs.has(s.pair)) pairs.set(s.pair, []); pairs.get(s.pair).push(s); }
    for (const members of pairs.values()) for (const s of members) {
      if (R.pairing.hip_buckets.includes(s.bucket)) s.why.push(why('why.pair_hip_push', 'UNI-11'));
      if (R.pairing.knee_buckets.includes(s.bucket)) s.why.push(why('why.pair_knee_pull', 'UNI-11'));
    }
  }
  // supersets: a superset id needs >= 2 active members in the day
  const ss = new Map();
  for (const s of daySlots(day)) if (s.superset) ss.set(s.superset, (ss.get(s.superset) || 0) + 1);
  for (const s of daySlots(day)) if (s.superset && ss.get(s.superset) < 2) s.superset = null;
  day.supersets_on = daySlots(day).some((s) => !!s.superset);
  if (day.supersets_on && daySlots(day).some((s) => s.superset && RES_KINDS.includes(model.bucket(s.bucket).kind) && model.bucket(s.bucket).kind === 'resistance')) {
    day.why.push(why('why.superset_short', 'ORD-05'));
  }
  return day;
}

/**
 * v0.4 fix round 1 (E-90; COACH-R3 R3-SES-02 'recommend supersets so that it's a faster workout'; RECHECK 01 / 05 / 07 / 08: only the
 * template pairs or the core pair were ever recommended): after the cuts, the day's remaining non-competing isolations are paired
 * as recommendations (superset_eligible; switched on only when the time needs them): two isolations of different groups
 * (rules.supersets.pairs first: biceps + rear delts, triceps + side delts, calves + delts; a knee-extension + knee-flexion pair; a
 * chest fly + a triceps isolation), an isolation + joint care. Never a work lift, never two lower compounds, never across blocks:
 * the partner moves next to its pair in the block (the printed page reads top to bottom).
 */
function pairRemaining(day, ctx) {
  const { model, R } = ctx;
  const kindOfS = (s) => { try { return model.bucket(s.bucket).kind; } catch { return null; } };
  // (the region of the muscle a slot serves - bucket defs carry none; v0.4 fix round 1)
  const regionOf = (s) => { let m = null; try { m = slotMuscle(s, model); } catch { m = null; } const d = m && R.muscles && R.muscles.defs[m]; return d ? d.region || null : (/LOWER|CALF|QUAD|LEG_|HIP|GLUTE/.test(s.bucket || '') ? 'lower' : null); };
  const grp = (s) => (s.bucket === 'ISO_SIDE_REAR_DELT' ? (s.variant === 'rear' ? 'rear' : 'side') : s.bucket === 'ISO_CALF' ? 'calves' : s.bucket === 'ISO_BICEP' ? 'biceps'
    : s.bucket === 'ISO_TRICEP' ? 'triceps' : (s.group || (s.focus_muscle ? model.groupOf(s.focus_muscle) : null) || s.bucket));
  const eligible = (s) => !s.superset && !s.superset_eligible && !s.test && !s.aerobic && s.role !== 'work' && s.role !== 'core_block' && s.block !== 'circuit' &&
    (['isolation', 'focus', 'prehab'].includes(kindOfS(s)) || s.role === 'prehab');
  const compatible = (a, b) => {
    if (grp(a) === grp(b)) return false; // two exercises of one group are never supersetted (master 10.6)
    if (a.role === 'prehab' && b.role === 'prehab') return false;
    const la = regionOf(a) === 'lower', lb = regionOf(b) === 'lower';
    if (la && lb) return (a.bucket === 'ISO_QUAD' && b.bucket === 'ISO_LEG_FLEXION') || (a.bucket === 'ISO_LEG_FLEXION' && b.bucket === 'ISO_QUAD');
    return true;
  };
  let k = 0;
  for (const blk of day.blocks) {
    if (!['strength', 'accessories', 'prehab'].includes(blk.kind)) continue;
    for (let i = 0; i < blk.slots.length; i++) {
      const a = blk.slots[i];
      if (!eligible(a)) continue;
      // v0.5 (COACH-R4 R4-SES-05): the template's slot order is the coach's and is never rearranged to print a pair - an isolation
      // is paired with the NEXT exercise of its block when the two are compatible (triceps + leg curl, biceps + leg extension)
      const nxt = blk.slots[i + 1];
      const b = nxt && eligible(nxt) && compatible(a, nxt) ? nxt : null;
      if (!b) continue;
      const id = 'X' + (++k);
      a.superset_eligible = id; b.superset_eligible = id;
      i++;
    }
  }
  // v0.4 fix round 1 (E-90; RECHECK 08 major: only the core pair was recommended while Monday ran 49 min for 45): the last unpaired
  // exercise of a block and a compatible one at the head of the next block (an isolation and the joint care right after it) are a
  // pair too - done back to back, they save the rest between them; the partner moves to the head of its block (no order rule there)
  const work = day.blocks.map((b, bi) => ({ b, bi })).filter(({ b }) => ['strength', 'accessories', 'prehab'].includes(b.kind));
  for (let j = 0; j + 1 < work.length; j++) {
    const A = work[j].b, B = work[j + 1].b;
    if (work[j + 1].bi !== work[j].bi + 1 || !A.slots.length) continue;
    const a = A.slots[A.slots.length - 1];
    if (!eligible(a)) continue;
    const b = B.slots[0] && eligible(B.slots[0]) && compatible(a, B.slots[0]) ? B.slots[0] : null; // (v0.5: never reordered, see above)
    if (!b) continue;
    const id = 'X' + (++k);
    a.superset_eligible = id; b.superset_eligible = id;
  }
  // the day's two core exercises are always a recommended pair (R2-SES-03 'core supersets anywhere'; RECHECK 05 major: the longest
  // bootcamp day was the only one without its core pair)
  const CSO = R.supersets && R.supersets.core_supersets_optional;
  if (CSO && CSO.anywhere) {
    const core = daySlots(day).filter((s) => s.role === 'core_block' && !s.superset && !s.superset_eligible);
    if (core.length >= 2 && !daySlots(day).some((s) => s.superset === 'core_pair')) for (const s of core.slice(0, 2)) s.superset_eligible = 'core_pair';
  }
  // an item cut out of a template pair keeps no lone eligible id (the printed pair needs both partners)
  const ids = new Map();
  for (const s of daySlots(day)) { const id = s.superset || s.superset_eligible; if (id) ids.set(id, (ids.get(id) || 0) + 1); }
  for (const s of daySlots(day)) { if (s.superset_eligible && (ids.get(s.superset_eligible) || 0) < 2 && !s.superset) s.superset_eligible = null; }
}

function swapSlots(day, a, b) {
  // swap positions but keep each position's pair / superset (both are upper lifts of the same direction: pairing holds)
  let pa = null, pb = null;
  for (const blk of day.blocks) {
    const ia = blk.slots.indexOf(a); if (ia >= 0) pa = [blk, ia];
    const ib = blk.slots.indexOf(b); if (ib >= 0) pb = [blk, ib];
  }
  if (!pa || !pb) return;
  const [ap, as, ae] = [a.pair, a.superset, a.superset_eligible];
  a.pair = b.pair; a.superset = b.superset; a.superset_eligible = b.superset_eligible;
  b.pair = ap; b.superset = as; b.superset_eligible = ae;
  pa[0].slots[pa[1]] = b;
  pb[0].slots[pb[1]] = a;
}

function isRear(s, model) {
  return (s.bucket === 'ISO_SIDE_REAR_DELT' && s.variant === 'rear') || (model.bucket(s.bucket).kind === 'focus' && s.focus_muscle === 'rear_delts');
}

// R3-pending: R3-SES-01 (muscle groups and 2-4 exercises per group)
function groupCounts(day, model) {
  const c = {};
  for (const s of daySlots(day)) if (s.group && RES_KINDS.includes(model.bucket(s.bucket).kind)) c[s.group] = (c[s.group] || 0) + 1;
  return c;
}

function dayGroups(day, model) {
  const c = groupCounts(day, model);
  return model.rules.muscles.groups.order.filter((g) => c[g]);
}

function dedupeIssues(list) {
  const seen = new Set();
  const out = [];
  for (const w of list) { const k = w.key + '|' + JSON.stringify(w.args || {}); if (!seen.has(k)) { seen.add(k); out.push(w); } }
  return out;
}

/** core block never skipped: core_block.exercises (2) items on every main day (ATH-11, R2-SES-03, V18; R4-SES-02 'the 2 core exercises') */
function ensureCoreBlock(days, ctx) {
  const { R, model } = ctx;
  for (const d of days) {
    if (d.kind !== 'main') continue;
    const core = d._slots.filter((s) => model.bucket(s.bucket).kind === 'core');
    const need = R.core_block.exercises;
    for (let k = core.length; k < need; k++) {
      const has = (b) => d._slots.some((s) => s.bucket === b);
      const bucket = !has('CT_CORE_THORAX') ? 'CT_CORE_THORAX' : !has('CP_CORE_PELVIS') ? 'CP_CORE_PELVIS' : 'CORE_ANY';
      const id = `${d.day_type}.k0${k + 1}`; // core top-up
      const st = { id, bucket, role: 'core_block', block: 'core', group: null, sets_hint: [R.core_block.sets_when_first, R.core_block.sets_when_first],
        pair: null, superset: null, circuit: null, axial: null, variant: null,
        laterality_dial: false, loading: null, movable: true, counts_as_volume: true, condition: null, older_default_excluded: false };
      const slot = slotFromStation(d.weekday, st, d._def, ctx, { calfIndex: 0, focus: null, olderLanding: false, dayIndex: d._day_index });
      const at = d._slots.findIndex((s) => model.bucket(s.bucket).kind === 'core');
      const after = at < 0 ? d._slots.findIndex((s) => model.bucket(s.bucket).kind !== 'warmup') : at + core.length;
      d._slots.splice(after < 0 ? d._slots.length : after, 0, slot);
      core.push(slot);
    }
  }
}

/** a template station the athletic tracks may add whatever its rank (its condition still holds) */
function keepStationAnyRank(st, ctx) {
  return keepStation(st, ctx, Infinity);
}

/**
 * injury-code prehab (rules.prehab.by_injury_code) + 50-59 racket rules (population.active_aging_50), block 'prehab'.
 * v1.2 (review 08 major 5): one entry per injury code (not per bucket), the slot carries its code so select takes the code's
 * preferred exercise (rules.prehab.preferred_by_code) and render its label; at most rules.prehab.per_day_max items a day.
 */
function addPrehab(days, ctx) {
  const { R, derived, profile, model } = ctx;
  const entries = []; // {code, bucket, per_week, days, sets, each}
  const injuries = [...new Set(profile ? profile.injuries || [] : [])];
  const vName = derived.D2_profile && derived.D2_profile.variant;
  if (profile && vName && profile.variants && profile.variants[vName]) for (const c of profile.variants[vName].injuries_add || []) if (!injuries.includes(c)) injuries.push(c); // D-23
  const setsFor = (bucket) => {
    const r = Object.values(R.prehab.by_injury_code).find((x) => x.bucket === bucket);
    return r ? r.sets : R.session.default_sets.isolation;
  };
  // v0.4 fix round 1 (RECHECK 08 major: a racket player's rotator-cuff and elbow care sat only on the optional day): for a racket
  // player 50-59 (COACH-R3 R3-ATH-02 'rotator-cuff work') the upper-body joint care stays on a main day - never a time cut
  const A0 = R.population.active_aging_50;
  const racket50 = !!(A0 && (derived.age || 0) >= A0.from_age && (derived.age || 0) <= A0.to_age && derived.D2_profile && A0.racket_profiles.includes(derived.D2_profile.id));
  for (const code of injuries.slice().sort()) {
    const r = R.prehab.by_injury_code[code];
    if (!r) continue;
    // COACH-R3 R3-ATH-01 (stage B2): a swimmer's shoulder care runs every session (each_session)
    const every = !!r.each_session && (!Array.isArray(r.each_session_sports) || r.each_session_sports.includes(profile && profile.sport));
    entries.push({ code, bucket: r.bucket, per_week: r.per_week, days: every ? 'all' : r.days, sets: every && r.each_session_sets ? r.each_session_sets : r.sets, each: every, every_session: every,
      keep_main_day: racket50 && r.bucket === 'RECOVERY_ARM_CARE',
      // (fix round 2 / F2 minimal seam, E-175: every-session shoulder care done inside the rests of the day's pulls has its own time class)
      time_class: every && r.each_session_time_class ? r.each_session_time_class : null });
  }
  const A = R.population.active_aging_50;
  const age = derived.age || 0;
  if (age >= A.from_age && age <= A.to_age && derived.D2_profile && A.racket_profiles.includes(derived.D2_profile.id)) { // R3-pending: R3-ATH-02
    for (const b of A.prehab_each_leg_day) {
      const own = entries.find((e) => e.bucket === b && e.code === 'ACHILLES_CALF') || entries.find((e) => e.bucket === b);
      if (own) { own.each = true; own.days = 'lower'; } else entries.push({ code: 'AGE_50_RACKET', bucket: b, per_week: 1, days: 'lower', sets: setsFor(b), each: true });
    }
    for (const b of A.prehab_weekly) if (!entries.some((e) => e.bucket === b)) entries.push({ code: 'AGE_50_RACKET', bucket: b, per_week: 1, days: 'pull_or_upper', sets: setsFor(b), each: false });
  }
  // a code whose bucket has no approved record and no preferred pick gets no slot (CAT-07)
  const pref = R.prehab.preferred_by_code || {};
  // v0.5 / V2 (COACH-R4 R4-LIB-01): a code is placed only when it has a LIVE exercise of its own that the kit holds - a code whose
  // exercises are all optional add-ons (Achilles / calf: soleus and tibialis raises; balance reach; wrist extension) gets no
  // station: the add-ons are offered on the plan instead (generate: plan.meta.addons)
  const kitD = derived.D8_kit || { tokens: [], machines: [] };
  const kitObj = { tokens: new Set(kitD.tokens || []), machines: kitD.machines || [] };
  const live = (x) => !SWAP_ONLY_STATUS.includes(x.status);
  const usable = (e) => ((pref[e.code] || []).length
    ? pref[e.code].some((id) => model.hasEx(id) && live(model.ex(id)) && model.kitAvailable(model.ex(id), kitObj))
    : model.bySlot(e.bucket).some(live));
  let list = entries.filter(usable);
  // v0.5 fix round 1 (sample 08 majors: calf raises came back as uncounted 'joint care' next to a dropped calf slot, and a leg
  // extension was added to the hip day; R4-SES-02 'counts exclude only the warm-up and the 2 core exercises'): joint care lives
  // inside the template's own slot where the day holds one that does the same job - the calf raise is the Achilles care, the leg
  // extension the knee care, the rear-delt slot the shoulder care - and no extra item is added (rules.prehab.x1.in_template_slot).
  // A code served that way on one day of the week adds no item on the other days.
  const PXc = R.prehab.x1 || null;
  if (PXc && PXc.in_template_slot) {
    const mains0 = days.filter((d) => d.kind === 'main');
    const mapOf = (e) => PXc.in_template_slot[e.code + ':' + e.bucket] || PXc.in_template_slot[e.code] || [];
    const servedBy = (e, d) => d._slots.find((s) => mapOf(e).some((m) => s.bucket === m.bucket && (!m.variant || s.variant === m.variant) && s.origin === 'template')) || null;
    const kept = [];
    for (const e of list) {
      const served = mains0.map((d) => ({ d, sl: servedBy(e, d) })).filter((x) => x.sl);
      if (!served.length) { kept.push(e); continue; }
      for (const { sl } of served) { sl.care_code = e.code; sl.why.push(why(e.code === 'AGE_50_RACKET' ? 'why.age_50_racket' : 'why.prehab', e.code === 'AGE_50_RACKET' ? 'R3-ATH-02' : 'D-23', { code: e.code })); }
      // a code that runs on every leg day (R3-ATH-02 'calf and Achilles work every leg day') keeps its own item on a leg day whose
      // template slot the session size left out; a weekly code is done once a slot serves it
      if (e.each) { e.served_days = new Set(served.map((x) => x.d.weekday)); kept.push(e); }
    }
    list = kept;
  }
  if (!list.length) return;
  // order: every-leg-day codes first, then by per_week (desc), then code
  list.sort((a, b) => (b.each ? 1 : 0) - (a.each ? 1 : 0) || b.per_week - a.per_week || (a.code < b.code ? -1 : 1));
  const mains = days.filter((d) => d.kind === 'main');
  const has = (d, l) => d._slots.some((s) => l.includes(s.bucket));
  const perDayMax = typeof R.prehab.per_day_max === 'number' ? R.prehab.per_day_max : 2;
  const counters = new Map();
  // the candidate days of an entry, in preference order (the filters of the v1.2 placement)
  const poolFor = (e) => {
    let pool;
    if (e.days === 'lower') pool = mains.filter((d) => d.lower_focus || has(d, LOWER_RES_BUCKETS));
    else if (e.days === 'pull_or_upper') { pool = mains.filter((d) => has(d, PULL_BUCKETS)); if (!pool.length) pool = mains.filter((d) => has(d, UPPER_RES_BUCKETS)); }
    else pool = mains.slice();
    if (!pool.length) pool = mains.slice();
    pool = pool.filter((d) => (counters.get(d.weekday) || 0) < perDayMax);
    if (!pool.length) return pool;
    // shoulder care goes where the day has no rear-delt work yet (never a third rear-delt exercise; review 01 / 08); a code that
    // runs every session takes every main day (select picks the external rotation where the day already holds rear-delt work)
    if (e.bucket === 'RECOVERY_ARM_CARE' && !e.every_session) {
      const rears = (d) => d._slots.filter((x) => isRear(x, model)).length;
      const lean = pool.filter((d) => rears(d) === 0);
      const some = pool.filter((d) => rears(d) === 1);
      pool = [...lean, ...some]; // a day that already holds two rear-delt exercises takes no third (prehab credits rear delts, v1.2)
      // the weekly count still holds (SHOULDER_SWIMMER twice a week): another upper day takes the second session
      if (pool.length < e.per_week) {
        const extra = mains.filter((d) => !pool.includes(d) && has(d, UPPER_RES_BUCKETS) && rears(d) < 2 && (counters.get(d.weekday) || 0) < perDayMax);
        pool = [...pool, ...extra];
      }
      return pool;
    }
    // the least-loaded days first (spread the joint care over the week); shoulder care keeps its no-rear-delt order
    return pool.slice().sort((a, b) => (counters.get(a.weekday) || 0) - (counters.get(b.weekday) || 0) || a._day_index - b._day_index);
  };
  const place = (e, d) => {
    const c = (counters.get(d.weekday) || 0) + 1;
    counters.set(d.weekday, c);
    const id = `${d.day_type}.p0${c}`; // prehab_added (volume owns .xNN)
    d._slots.push({
      slot_id: `${d.weekday}.${id}`, station_id: id, bucket: e.bucket, role: 'prehab', block: R.prehab.block, group: null,
      sets_hint: null, default_sets: e.sets, pair: null, superset: null, circuit: null, axial_req: null, variant: null,
      laterality_dial: false, loading: null, focus_muscle: null, time_class: e.time_class || model.bucket(e.bucket).time_class || null,
      counts_in_cap: !!R.prehab.counts_in_cap, counts_as_volume: R.prehab.credits === 'by_catalog', text_key: null, aerobic: null, origin: 'prehab_added',
      prehab_code: e.code, every_session: !!e.every_session, keep_main_day: !!e.keep_main_day,
      why: [why(e.code === 'AGE_50_RACKET' ? 'why.age_50_racket' : 'why.prehab', e.code === 'AGE_50_RACKET' ? 'R3-ATH-02' : 'D-23', { code: e.code }), ...(e.every_session ? [why('why.shoulder_care_each_session', 'R3-ATH-01')] : [])],
      day_index: d._day_index, test: null, calf_index: null, note_tokens: []
    });
  };
  // every-leg-day / every-session codes first (each takes all its days)
  for (const e of list.filter((x) => x.each)) for (const d of poolFor(e)) { if (e.served_days && e.served_days.has(d.weekday)) continue; place(e, d); }
  // v0.4 B4 (integration, sample 08: the racket player's rotator-cuff care - COACH-R3 R3-ATH-02 'rotator-cuff work' - lost both
  // slots to the racket-elbow care): the weekly codes take turns, one session each, before any code takes its second
  const weekly = list.filter((x) => !x.each);
  const used = new Map(weekly.map((e) => [e, new Set()]));
  const rounds = Math.max(0, ...weekly.map((e) => e.per_week || 0));
  for (let round = 1; round <= rounds; round++) {
    for (const e of weekly) {
      if ((e.per_week || 0) < round) continue;
      let d = poolFor(e).find((x) => !used.get(e).has(x.weekday));
      // v0.5 (R4-SES-04; was the time cut's 'joint care moves to the optional day'): a code that finds every main day at its
      // joint-care maximum does its first weekly session on the optional day - upper-body care always, knee / Achilles care
      // only when the day is not right before play (rules.prehab.per_day_max holds there too)
      if (!d && round === 1 && !used.get(e).size) {
        d = days.filter((x) => x.kind === 'optional' && !used.get(e).has(x.weekday) && (counters.get(x.weekday) || 0) < perDayMax &&
          (e.bucket !== 'PREHAB_LOWER' || !nearPlay(x.weekday, ctx))).sort((a, b) => (counters.get(a.weekday) || 0) - (counters.get(b.weekday) || 0) || a._day_index - b._day_index)[0] || null;
      }
      if (!d) continue;
      used.get(e).add(d.weekday);
      place(e, d);
    }
  }
}

/**
 * v1.2 (D-63 resolved; review 01 / 02 / 03 / 08): the sport profile's weekly athletic tracks get the stations their targets
 * need - a medball throw station for every profile with throws (ATH-05; racket players' rotation), a low-amplitude ankle block
 * for low-contact targets (bone loading, Achilles; AP_JUMP_LIMITED_KNEE), change-of-direction and sprint stations for COD /
 * speed sports - at most rules.athletic.reconcile.stations_per_day_max a day; doses are sized in dose.mjs (perSetFor).
 */
function ensureAthleticTracks(days, ctx) {
  const { R, derived, model } = ctx;
  const RC = R.athletic.reconcile;
  const D11 = derived.D11_athletic_budget || {};
  if (!RC || !RC.enabled || !D11.enabled || derived.goal === 'muscle') return;
  // COACH-R3 R3-ATH-02 (approved, stage B2): from 60 the default keeps quick stepping without a hop (the COD track, easy drills)
  // and light throws (ensureThrowStation); jumps, ankle hops, sprints stay off unless switched on
  const OLD = R.population.older;
  const olderDefault = ctx.older && !ctx.optIn;
  if (olderDefault && !(OLD.default_on && OLD.default_on.quick_stepping)) return;
  const weekly = D11.weekly || {};
  const mains = days.filter((d) => d.kind === 'main' && d._def && (d._def.format || 'straight') !== 'circuit' && (d._def.stations || []).some((st) => st.block === 'athletic' || st.block === 'power'));
  if (!mains.length) return;
  const kit = new Set((derived.D8_kit && derived.D8_kit.tokens) || []);
  // v0.4 fix round 1 / F2: the tracks are sized from the plan's own weekly targets (engine/athletic.mjs ensureAthleticStations)
  if (R.athletic.f2 && R.athletic.f2.tracks && R.athletic.f2.tracks.from_budget) {
    ensureAthleticStations(mains, ctx, kit, olderDefault, { slotFromStation, keepStationAnyRank, daySlotsOf: (d) => d._slots, weekdayIndex: WDI });
    return;
  }
  const tracks = [
    { key: 'throws', bucket: 'AP_THROW', ok: kit.has('medball') || kit.has('slam_ball') },
    { key: 'low_contacts', bucket: 'AP_JUMP_LIMITED_KNEE', ok: true },
    { key: 'cod_cuts', bucket: 'AP_COD', ok: !ctx.dropped.has('AP_COD') },
    { key: 'sprint_m', bucket: 'AP_SPRINT', ok: !ctx.dropped.has('AP_SPRINT') && (kit.has('open_space_long') || kit.has('open_space_short')) }
  ];
  for (const t of tracks) {
    const r = weekly[t.key];
    if (olderDefault && t.key !== 'cod_cuts') continue;
    if (!t.ok || !Array.isArray(r) || !(r[0] > 0) || ctx.dropped.has(t.bucket)) continue;
    const setsPer = 2;
    const perMax = RC.per_set_max[t.key] || 1;
    const lowWant = (1 - RC.tolerance) * r[0];
    const need = Math.max(1, Math.ceil(lowWant / (setsPer * perMax) - EPS));
    const have = () => mains.reduce((a, d) => a + d._slots.filter((s) => s.bucket === t.bucket).length, 0);
    // a single existing station written at 1 set takes 2 when that is what the weekly target needs (e.g. the swimmer's throw)
    for (const d of mains) for (const sl of d._slots) if (sl.bucket === t.bucket && Array.isArray(sl.sets_hint) && sl.sets_hint[0] < setsPer && have() * sl.sets_hint[0] * perMax < lowWant) sl.sets_hint = [setsPer, Math.max(setsPer, sl.sets_hint[1])];
    const dayMax = (RC.stations_per_day_max && RC.stations_per_day_max[t.bucket]) || 1;
    // the first station of the track is protected from the time cut (it is the track)
    const first = mains.flatMap((d) => d._slots.filter((s) => s.bucket === t.bucket))[0];
    if (first) first.track = t.key;
    let guard = 0;
    while (have() < need && guard++ < 12) {
      const cands = mains.filter((d) => d._slots.filter((s) => s.bucket === t.bucket).length < dayMax)
        .sort((a, b) => a._slots.filter((s) => s.bucket === t.bucket).length - b._slots.filter((s) => s.bucket === t.bucket).length || a._day_index - b._day_index);
      const d = cands[0];
      if (!d) break;
      const tpl = (d._def.stations || []).find((x) => x.bucket === t.bucket && !d._slots.some((s) => s.station_id === x.id) && keepStationAnyRank(x, ctx));
      const k = d._slots.filter((s) => /\.t\d+$/.test(s.station_id)).length + 1;
      const st = tpl || { id: `${d.day_type}.t0${k}`, bucket: t.bucket, role: 'athletic', block: 'athletic', group: null, sets_hint: [setsPer, setsPer], pair: null,
        superset: null, circuit: null, axial: null, variant: null, laterality_dial: false, loading: null,
        movable: false, counts_as_volume: true, condition: null, older_default_excluded: false, note: null, pool_filter: null };
      const slot = slotFromStation(d.weekday, st, d._def, ctx, { calfIndex: 0, focus: null, olderLanding: false, dayIndex: d._day_index });
      slot.why.push(why('why.athletic_reconcile', 'D-63'));
      if (!first && !have()) slot.track = t.key;
      const at = d._slots.findIndex((s) => s.block === 'power' || s.block === 'strength' || s.block === 'accessories');
      d._slots.splice(at < 0 ? d._slots.length : at, 0, slot);
    }
  }
}

/**
 * v0.5 fix round 1 (COACH-R3 R3-ATH-05 'half the jumps in heavy play weeks'; ATH-05 medball volume is high for racket sports; sample
 * 08: both days held two jump stations and Thursday no throw, 11 exercises against 5-8): in a heavy-play week a training day keeps
 * ONE jump station - the days take turns between the jump drill and the ankle hops - and a day whose cuts station was dropped for
 * the play takes a medball throw instead (rules.athletic.x1.heavy_play).
 */
function heavyPlayStations(days, ctx) {
  const { R, derived } = ctx;
  const X = R.athletic.x1 && R.athletic.x1.heavy_play;
  const D11 = derived.D11_athletic_budget || {};
  if (!X || !D11.enabled || !D11.heavy_play_week) return;
  const mains = days.filter((d) => d.kind === 'main' && d._def && (d._def.format || 'straight') !== 'circuit');
  const kit = new Set((derived.D8_kit && derived.D8_kit.tokens) || []);
  const jumpOf = (d) => d._slots.filter((s) => s.bucket === 'AP_PLYO' && s.variant !== 'upper');
  const ankleOf = (d) => d._slots.filter((s) => s.bucket === 'AP_JUMP_LIMITED_KNEE');
  // (the week keeps both kinds of jump work: a day that holds both gives up its jump drill while another day jumps, else its ankle hops)
  let jumpDays = mains.filter((d) => jumpOf(d).length && !ankleOf(d).length).length;
  for (const d of mains) {
    const jump = jumpOf(d);
    const ankle = ankleOf(d);
    if (X.one_jump_station_a_day && jump.length && ankle.length) {
      const drop = jumpDays > 0 ? jump : ankle;
      if (drop === ankle) jumpDays++;
      d._slots = d._slots.filter((s) => !drop.includes(s));
      // (the ankle hops that are the day's one jump station are a station like any other: counted, never 'prep in the warm-up')
      if (drop === jump) for (const s of ankle) { s.track_index = 0; s.ankle_keep = true; delete s.prep_in_warmup; s.ankle_block = false; s.counts_in_cap = true; }
      d.why.push(why('why.heavy_play', 'R3-ATH-05'));
    }
    const throwsWk = D11.weekly && Array.isArray(D11.weekly.throws) ? D11.weekly.throws[1] : 0;
    const sizeMax = ctx.size && Array.isArray(ctx.size.range) ? ctx.size.range[1] : Infinity;
    const counted = d._slots.filter((s) => s.counts_in_cap).length;
    const olderDefault = ctx.older && !ctx.optIn;
    if (X.throw_replaces_cuts && throwsWk > 0 && counted < sizeMax && !olderDefault && ctx.dropped.has('AP_COD') && (d._def.stations || []).some((x) => x.bucket === 'AP_COD') && !d._slots.some((s) => s.bucket === 'AP_THROW') && (kit.has('medball') || kit.has('slam_ball'))) {
      const k = d._slots.filter((s) => /\.t\d+$/.test(s.station_id)).length + 1;
      const st = { id: `${d.day_type}.t0${k}`, bucket: 'AP_THROW', role: 'athletic', block: 'athletic', group: null, sets_hint: [2, 2], pair: null, superset: null, circuit: null, axial: null,
        variant: null, laterality_dial: false, loading: null, movable: false, counts_as_volume: true, condition: null, older_default_excluded: false, note: null, pool_filter: null };
      const slot = slotFromStation(d.weekday, st, d._def, ctx, { calfIndex: 0, focus: null, olderLanding: false, dayIndex: d._day_index });
      slot.track = 'throws'; slot.track_added = true;
      slot.why.push(why('why.heavy_play', 'R3-ATH-05'));
      const at = d._slots.findIndex((s) => s.block === 'power' || s.block === 'strength' || s.block === 'accessories');
      d._slots.splice(at < 0 ? d._slots.length : at, 0, slot);
    }
  }
}

/** a medball throw station for every profile with throws, even when the session is short (ATH-05; review 08 major 4) */
function ensureThrowStation(days, ctx) {
  const { derived, profile } = ctx;
  const D11 = derived.D11_athletic_budget || {};
  const r = D11.weekly && D11.weekly.throws;
  const lo = Array.isArray(r) ? r[0] : ((profile && profile.medball && profile.medball.throws_wk) || [0])[0];
  if (!D11.enabled || !(lo > 0) || derived.goal === 'muscle' || ctx.dropped.has('AP_THROW')) return;
  const kit = new Set((derived.D8_kit && derived.D8_kit.tokens) || []);
  if (!kit.has('medball') && !kit.has('slam_ball')) return;
  const mains = days.filter((d) => d.kind === 'main' && d._def && (d._def.format || 'straight') !== 'circuit');
  if (!mains.length || mains.some((d) => d._slots.some((s) => s.bucket === 'AP_THROW'))) return;
  // v0.5 (R4-SES-02): the added throw station keeps its day inside the session size - a day with room inside its own count
  // first, else a day with room under the size range's maximum; no day with room, no added station (the plan says what the
  // template holds of the throws, warning.athletic_capacity)
  const sizeMax = ctx.size && Array.isArray(ctx.size.range) ? ctx.size.range[1] : Infinity;
  const countedOf = (d) => d._slots.filter((s) => s.counts_in_cap).length;
  const roomOf = (d) => ctx.countFor(d._def) - countedOf(d);
  const hardRoomOf = (d) => Math.max(ctx.countFor(d._def), sizeMax) - countedOf(d);
  const cand = mains.map((d) => ({ d, st: (d._def.stations || []).find((x) => x.bucket === 'AP_THROW' && keepStationAnyRank(x, ctx)) })).filter((x) => x.st && hardRoomOf(x.d) >= 1)
    .sort((a, b) => (roomOf(b.d) >= 1 ? 1 : 0) - (roomOf(a.d) >= 1 ? 1 : 0) || (a.d.lower_focus === 'hip' ? 0 : 1) - (b.d.lower_focus === 'hip' ? 0 : 1) || a.d._day_index - b.d._day_index)[0];
  if (!cand) return;
  const slot = slotFromStation(cand.d.weekday, cand.st, cand.d._def, ctx, { calfIndex: 0, focus: null, olderLanding: false, dayIndex: cand.d._day_index });
  slot.track = 'throws';
  slot.why.push(why('why.athletic_reconcile', 'ATH-05'));
  const at = cand.d._slots.findIndex((s) => s.block === 'power' || s.block === 'strength' || s.block === 'accessories');
  cand.d._slots.splice(at < 0 ? cand.d._slots.length : at, 0, slot);
}

/**
 * v1.2 (review 03 / 04 majors, V27): the week's Olympic stations never exceed what the profile's weekly Olympic budget can
 * dose at the minimum sets a station - a 2-5 set soccer budget keeps 2 stations, a 5-7 set class budget keeps 2 at 3 sets.
 * The kettlebell swing goes first (it is a ballistic WOD move, R2-VOL-05), then the latest day; clean / snatch day pattern
 * otherwise as the template wrote it.
 */
function trimOlympicExposures(days, ctx) {
  const { derived, R } = ctx;
  const O = R.olympic.sets;
  const D11 = derived.D11_athletic_budget || {};
  const r = D11.weekly && Array.isArray(D11.weekly.olympic_sets) ? D11.weekly.olympic_sets : null;
  if (!O || !O.from_budget || !r || !(r[1] > 0)) return;
  const per = derived.D1_family === 'hybrid_crossfit' && R.reps.class_levels ? R.reps.class_levels.power[0].sets
    : (derived.D1_family === 'athletic' && derived.D2_profile && derived.D2_profile.competitive !== 'competitive' ? O.stay_active.sets : O.min_per_exposure);
  const maxExp = Math.max(1, Math.min(Math.floor(r[1] / per + EPS), D11.olympic_exposures_wk || Infinity));
  const all = [];
  for (const d of days) if (d.kind === 'main') for (const s of d._slots) if (s.bucket === 'AP_TRIPLE_EXT') all.push({ d, s });
  if (all.length <= maxExp) return;
  const swing = (x) => /SWING/i.test(String(x.s.variant || '')) || /swing/i.test(String((x.s.note || '') + ' ' + (x.s.pool_filter || '')));
  // v0.4 B4 (integration, random sweep: a 52-year-old with knee pain kept the clean on the squat day - no clean passes the knee
  // filter - and lost the DB snatch on the hinge day, so the week held no Olympic lift, V19 / R2-ATH-04): a station no record
  // can fill for this client (kit, pain, youth ladder, floor lifts, the station's day pattern) goes first
  const fillable = olympicFillable(ctx);
  // v0.4 fix round 1 (RECHECK 03 major: Friday 'Olympic + strength' lost its only power piece while Monday kept four athletic stations
  // and the clean pull): after the unfillable stations and the swings, the day already holding the most athletic work gives its
  // exposure first, then the latest day (v1.2)
  // (fix round 1 / F2: the stations the athletic tracks added count by the template they joined, not as the day's own work - the
  // swimmer's / soccer player's Friday takes the week's jumps and throws and keeps its Olympic lift)
  const athN = (d) => d._slots.filter((x) => (['athletic', 'power'].includes(x.block) || /^AP_/.test(x.bucket)) && !x.track_added).length;
  const order = all.slice().sort((a, b) => (fillable(a.s) ? 1 : 0) - (fillable(b.s) ? 1 : 0) || (swing(b) ? 1 : 0) - (swing(a) ? 1 : 0) || athN(b.d) - athN(a.d) || b.d._day_index - a.d._day_index);
  for (const x of order.slice(0, all.length - maxExp)) {
    x.d._slots.splice(x.d._slots.indexOf(x.s), 1);
    x.d.why = x.d.why || [];
    x.d.why.push(why('why.olympic_budget', 'R2-ATH-04', { sets: r[1] }));
  }
}

/**
 * v0.4 B4: can some Olympic / triple-extension record fill this station for this client? A static mirror of select's filters 1-6
 * for AP_TRIPLE_EXT (the station's family by its day pattern - relaxed, as select's last step -, kit and bumpers, never-picks,
 * youth ladder and floor lifts, 60+ opt-in, pain avoid-tags and axial limit, the barbell exclusion, the medball the client owns).
 * Used only to order which exposures the budget trim removes first (trimOlympicExposures); select still makes the pick.
 * @param {object} ctx week-layout context @returns {(slot:object) => boolean}
 */
function olympicFillable(ctx) {
  const { model, derived, R } = ctx;
  const kit = (derived && derived.D8_kit) || { tokens: [], machines: [] };
  const kitObj = { tokens: new Set(kit.tokens || []), machines: kit.machines || [] };
  const age = (derived && derived.age) || 0;
  const L = R.levels, youth = age < L.youth_age;
  const older = R.population && R.population.older && age >= R.population.older.from_age;
  const optIn = !!(derived && derived.prefs && derived.prefs.older_athletic_opt_in);
  const lvl = (derived && derived.D3_client_level && derived.D3_client_level.level) || 'L1';
  const cycles = (derived && derived.previous_cycles && derived.previous_cycles.count) || 0;
  const P = R.volume.pain, AX = ['none', 'low', 'moderate', 'high'];
  const avoid = new Set();
  let maxAx = null;
  const lower = (x) => { if (x && (maxAx === null || AX.indexOf(x) < AX.indexOf(maxAx))) maxAx = x; };
  for (const p of (derived && derived.pain) || []) {
    const a = P.areas[p.area];
    if (a) { (a.avoid_tags || []).forEach((t) => avoid.add(t)); lower(a.max_axial_class); }
    for (const w of p.worse_with || []) { const x = P.worse_with[w]; if (x) { (x.avoid_tags || []).forEach((t) => avoid.add(t)); lower(x.max_axial_class); } }
  }
  const noBarbell = ((derived && derived.exclusions) || []).includes('barbell');
  const owned = kit.medball_max_lb ?? null;
  const famsOf = (v) => (v === 'clean' ? ['clean', 'loaded_jump', 'jerk'] : v === 'snatch' ? ['snatch', 'swing', 'jerk'] : v === 'swing' ? ['swing'] : null);
  const pool = model.bySlot('AP_TRIPLE_EXT');
  const memo = new Map();
  return (slot) => {
    const v = slot.variant || null;
    if (memo.has(v)) return memo.get(v);
    const fams = famsOf(v);
    const ok = pool.some((e) => {
      const fam = e.athletic && e.athletic.olympic_family;
      if (!fam || (fams && !fams.includes(fam))) return false;
      if (SWAP_ONLY_STATUS.includes(e.status) || !model.kitAvailable(e, kitObj)) return false;
      if (e.tags.includes('olympic_from_floor') && !kitObj.tokens.has('barbell_bumpers_platform')) return false;
      if (youth && (L.ladder_order.indexOf(e.level) > L.ladder_order.indexOf(L.youth_max_ladder) ||
        (e.tags.includes('olympic_from_floor') && !(age >= R.olympic.youth_floor_min_age && e.tags.includes('youth_floor_ok') && cycles >= 1)))) return false;
      if (older && !(optIn && e.older_opt_in_ok)) return false;
      if (e.athletic.olympic_tier === 'L2_plus' && lvl !== 'L3') return false;
      if (olympicAboveCeiling(e, ctx.profile, R, derived)) return false; // F2: the sport's Olympic ceiling (select's filter)
      if (e.tags.some((t) => avoid.has(t)) || (maxAx !== null && AX.indexOf(e.axial_class) > AX.indexOf(maxAx))) return false;
      if (noBarbell && e.tags.includes('barbell')) return false;
      if (e.medball && (e.medball.min_lb > R.medball.max_lb || (owned !== null && e.medball.min_lb > owned))) return false;
      return true;
    });
    memo.set(v, ok);
    return ok;
  };
}

/** every main day opens with 5 min cardio + A-drills or mobility (ORD-08; review 05 minor: bootcamp days had the cardio only) */
function ensureWarmupPrep(days, ctx) {
  for (const d of days) {
    if (d.kind !== 'main' || !d._def) continue;
    if (d._slots.some((s) => s.bucket === 'WARMUP_PREP')) continue;
    const gi = d._slots.findIndex((s) => s.bucket === 'WARMUP_GENERAL' && s.role === 'warmup');
    if (gi < 0) continue;
    const st = { id: `${d.day_type}.w02`, bucket: 'WARMUP_PREP', role: 'warmup', block: 'warmup', group: null, sets_hint: null, pair: null, superset: null,
      circuit: null, axial: null, variant: null, laterality_dial: false, loading: null, movable: false,
      counts_as_volume: false, condition: null, older_default_excluded: false, note: null, pool_filter: null };
    const slot = slotFromStation(d.weekday, st, d._def, ctx, { calfIndex: 0, focus: null, olderLanding: false, dayIndex: d._day_index });
    d._slots.splice(gi + 1, 0, slot);
  }
}
