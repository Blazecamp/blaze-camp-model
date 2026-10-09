// engine/budget.mjs - athletic and Olympic budgets shared by week.mjs (time estimates), volume.mjs (sets) and dose.mjs (doses).
// v1.2 review (D-63 resolved): the 04 sport profile's weekly targets (contacts, throws, cuts, sprint metres, Olympic sets) are
// targets the gym plan doses toward, ramping from the low to the high end across a stairway block (R2-ATH-01, ATH-01, ATH-06).
// Pure: no I/O, no clock, no randomness. Every number comes from model.rules or the sport profile.
import { clamp, roundHalfUp, EPS } from './util.mjs';

/** stairway progress 0..1 of a week (flat blocks: 1) @param {object} week WeekShape-like @returns {number} */
export function blockProgress(week) {
  if (!week || week.stair_week == null || !week.stair_N) return week && week.block_type === 'stairway' && week.stair_level != null ? clamp((week.stair_level - 2) / 9, 0, 1) : 1;
  return week.stair_N > 1 ? clamp((week.stair_week - 1) / (week.stair_N - 1), 0, 1) : 1;
}

/** true for plans that use the stay-active Olympic policy (gen-pop athletic family, R2-ATH-04 'light piece') */
export function stayActiveOlympic(derived) {
  return derived.D1_family === 'athletic' && derived.D2_profile && derived.D2_profile.competitive !== 'competitive';
}

/**
 * Olympic sets per exposure for a week (v1.2: weekly sets follow the profile budget, low -> high across the block, 2-4 a
 * station; stay-active plans 2 sets; heavy-play weeks 2; class model: the HALF TIME power table's 3 sets).
 * @param {object} derived @param {object} model @param {number} exposures stations of AP_TRIPLE_EXT on main days
 * @param {object|null} week WeekShape (null = week 1 of the block)
 * @returns {number|null} null = the rules do not size Olympic sets from a budget
 */
export function olympicSetsPerExposure(derived, model, exposures, week) {
  const O = model.rules.olympic.sets;
  if (!O || !O.from_budget) return null;
  if (derived.D1_family === 'hybrid_crossfit' && model.rules.reps.class_levels) return model.rules.reps.class_levels.power[0].sets;
  if (stayActiveOlympic(derived)) return O.stay_active.sets;
  const D11 = derived.D11_athletic_budget || {};
  const r = D11.weekly && Array.isArray(D11.weekly.olympic_sets) ? D11.weekly.olympic_sets : null;
  if (!r || !exposures) return null;
  // the same base as volume.athleticBudget: low -> high across a stairway, the low end in maintenance, the high end otherwise
  const frac = !week ? 0 : (week.block_type === 'maintenance' ? 0 : blockProgress(week));
  const weekly = r[0] + (r[1] - r[0]) * frac;
  return clamp(Math.floor(weekly / exposures + EPS), O.min_per_exposure, O.max_per_exposure);
}

/** the athletic budget key a dosed item feeds (planned counts, reconcile) */
export function budgetKeyOf(bucket, quality, unit) {
  if (bucket === 'AP_TRIPLE_EXT') return 'olympic_sets';
  if (unit === 'contacts' || ['AP_PLYO', 'AP_JUMP_LIMITED_KNEE'].includes(bucket)) {
    if (bucket === 'AP_JUMP_LIMITED_KNEE') return 'low_contacts';
    return quality === 'plyometric' ? 'plyo_contacts' : 'jump_contacts';
  }
  if (unit === 'throws' || bucket === 'AP_THROW') return 'throws';
  if (unit === 'cuts' || bucket === 'AP_COD') return 'cod_cuts';
  if (unit === 'metres' || bucket === 'AP_SPRINT') return 'sprint_m';
  return null;
}

/**
 * Per-set dose for a budget key so the week's stations land on the weekly target (D-63 resolved). The target ramps across the
 * block (athleticBudget already does); the per-set amount is clamped to rules.athletic.reconcile.per_set_min / per_set_max.
 * @param {object} model @param {string} key budget key @param {number|null} target weekly target @param {number} sets total sets
 *        of the stations that feed the key this week @param {number} fallback the matrix per-set dose
 * @returns {number}
 */
export function perSetFor(model, key, target, sets, fallback) {
  const RC = model.rules.athletic.reconcile;
  if (!RC || !RC.enabled || target == null || !(sets > 0)) return fallback;
  const lo = RC.per_set_min[key] ?? 1, hi = RC.per_set_max[key] ?? fallback;
  if (target <= 0) return fallback;
  return clamp(roundHalfUp(target / sets), lo, hi);
}

/**
 * Warm-up prep by sport profile (v1.2, ORD-08: 5 min cardio + A-drills OR mobility). 'balance' for court players with a fall
 * risk (FALLS_COURT), 'mobility' for non-running sports, shoulder hot spots (swimmer / thrower), no running space or lower-limb
 * pain, 'drills' for running sports; null = the template default (A-drills on lower days, mobility before pressing).
 * @param {object} derived @param {object} model @param {object|null} profile SportDef
 * @returns {'balance'|'mobility'|'drills'|null}
 */
export function warmupMode(derived, model, profile) {
  const W = model.rules.warmup.prep_by_profile;
  if (!W) return null;
  const inj = new Set((profile && profile.injuries) || []);
  const tokens = new Set((derived.D8_kit && derived.D8_kit.tokens) || []);
  const lowerPain = (derived.pain || []).some((p) => ['knee', 'ankle_foot', 'hip_groin'].includes(p.area));
  const noRun = !tokens.has('open_space_short') && !tokens.has('open_space_long');
  const running = !!(profile && profile.running_sport);
  if (inj.has('FALLS_COURT')) return 'balance';
  if (lowerPain || noRun) return 'mobility';
  if (inj.has('SHOULDER_SWIMMER') || (inj.has('SHOULDER_THROWER') && !running)) return 'mobility';
  if (profile && profile.sprint_tier === 'T0' && !running) return 'mobility';
  if (running) return 'drills';
  return null;
}
