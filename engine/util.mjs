// engine/util.mjs - shared helpers and typedefs (engine/CONTRACTS.md §4.0, §4.1).
// First version provided by the architect so every builder can start at once; owner from now on: B4
// (may add helpers; must not change these signatures). Pure: no I/O, no clock, no randomness.

/** @typedef {{key:string, ref:string, args?:Object<string,string|number>}} Why */
/** @typedef {{code:string, field?:string, key:string, args?:Object}} Issue */

/** @typedef {Object} Derived   — output of intake.deriveValues (D1-D14 + helpers); plain JSON, no functions
 * @property {'aesthetics'|'athletic'|'strength'|'fat_loss_bootcamp'|'hybrid_crossfit'|'no_equipment'} D1_family
 * @property {{id:string, variant:string|null, sport_id:string|null, position:string|null, position_detail:string|null,
 *             activity_ids:string[], overlays:string[], competitive:'competitive'|'recreational'|'none',
 *             ath03_group:string|null, ground_contact_class:number|null, season_type:string, name_key:string}} D2_profile
 * @property {{level:'L1'|'L2'|'L3', reason_keys:Array<{key:string,args:Object}>, exercise_ladder:'foundational'|'intermediate'|'advanced',
 *             replace_after_block:number|null}} D3_client_level
 * @property {{phase:string|null, weeks_to_season:number|null, season_date:string|null, competition_date:string|null,
 *             season_type:string|null, practice_days:number|null, game_days:string[]}} D4_season_phase
 * @property {{mode:string, overlay:'season'|'prep'|null, skeleton:string, weeks:number}} D5_plan_shape
 * @property {{template_id:string, family:string, days:number, variant:string|null, pairing:'same_pattern'|'cross_pattern', format:'gym'|'bootcamp'}} D6_week_layout
 * @property {{client_family:string, main:[number,number], iso:[number,number], machine_pen:number, skill_pen:number}} D7_constraint_band
 * @property {{profile:string, tokens:string[], machines:string[], medball_max_lb:number|null, heaviest_db_pair:number|null, box_height_in:number|null, buy_list:string[]}} D8_kit
 * @property {Targets} D9_start_sets
 * @property {{profile_id:string, lower:{by_exercise_block:number[], PRE:number|null, IN:number|null}, upper:{by_exercise_block:number[]}, pain_shift:number}} D10_bilateral_share
 * @property {{enabled:boolean, older_mode:'default'|'opt_in'|null, plyo_share:{start:number,end:number}|null, ground_contact_class:number|null,
 *             contacts_session_max:number, weekly:{plyo_contacts:[number,number]|null, jump_contacts:[number,number]|null, low_contacts:[number,number]|null,
 *             throws:[number,number]|null, cod_cuts:[number,number]|null, sprint_m:[number,number]|null, olympic_sets:[number,number]|null},
 *             olympic_exposures_wk:number|null, medball_main:boolean, cod_sport:boolean, game_heavy:boolean, heavy_play_week:boolean}} D11_athletic_budget
 * @property {{early:number, late:number, caps:{nonpriority_while_priority:number|null, older:number|null}, source:'planned_stairway'}} D12_planned_step
 * @property {{items:string[], baseline_week:number|null, end_weeks:number[], from_zero:boolean}} D13_tests
 * @property {{per_week:number, base:number, adjust:number, replaced_by_activity:number, walks:boolean, colours:string[], fighter_open:boolean, sport_is_aerobic:boolean}} D14_aerobic_sessions
 * @property {string} goal  @property {string} format  @property {'en'|'es'} lang  @property {'lb'|'kg'} units
 * @property {number} age  @property {'youth'|'adult'|'active_aging_50'|'older'} age_group  @property {number} body_weight_lb
 * @property {number} days_per_week  @property {string[]} weekdays  @property {string} start_date   // (v0.5: no session minutes, R4-SES-01)
 * @property {string[]} play_days  @property {string|null} event_date
 * @property {string[]} priority_muscles     // canonical muscle ids (rules.volume.priority.intake_map), max 2 intake choices
 * @property {Array<{area:string, side:string, severity:string, worse_with:string[]}>} pain
 * @property {string[]} exclusions  @property {string} lift_style  @property {string} output_mode
 * @property {{core_position:string, optional_days:string, variety_ab:boolean, heavy_unilateral:boolean, supersets_for_fatigue:boolean,
 *             cardio_adjust:number, older_athletic_opt_in:boolean, split_style:'default'|'upper_lower'|'ppl'}} prefs
 * @property {{count:number, last_had_holds_or_pain:boolean}} previous_cycles  @property {boolean} just_finished_block
 * @property {string|null} maint_reason  @property {number|null} maint_weeks
 * @property {{role:'self'|'client', health_route:string|null, refer:boolean, reasons:string[], bypass:boolean}} health
 * @property {{accepted:boolean, version:string, lang:string, guardian:boolean|null}} release
 * @property {string} equipment_preference   // F29b
 * @property {string} modifier_id            // rules.volume.modifiers key (also in D9)
 * @property {string[]} r3_pending
 * @property {Issue[]} warnings              // V2, V3, V6, V7, V8, older opt-in, minutes, split style …
 * @property {Why[]} why
 */

/** @typedef {Object} Targets   — volume.computeTargets (= D9)
 * @property {string} modifier_id
 * @property {Object<string,number|null>} start          // whole weekly sets per target muscle at week 1 of the first stairway (null = credit-only)
 * @property {Object<string,number|null>} cap
 * @property {Object<string,'target'|'credit'|'own_sets'|'core_block'|'floor'>} fill
 * @property {string[]} priority  @property {string[]} pain_muscles  @property {string[]} floored  @property {string[]} credit_only
 * @property {number} calves_per_leg_day  @property {{exercises:number, sets:number}} core_block
 * @property {Object<string,Why[]>} why                    // per muscle (modifier, priority, floor_10, pain, ratio …)
 */

/** @typedef {Object} TrainingBlock
 * @property {number} n  @property {'stairway'|'pre_season'|'taper'|'in_season'|'maintenance'|'recovery'} type
 * @property {[number,number]} weeks              // plan week numbers, inclusive
 * @property {number|null} stair_N                // stairway length (null for flat blocks)
 * @property {number} first_exercise_block  @property {string} label_key   // plan.block_type.<type>
 * @property {Object|null} factor                 // pre_season / taper / maintenance factor rule echoed from rules
 */
/** @typedef {Object} WeekShape
 * @property {number} n  @property {number} training_block  @property {string} block_type  @property {number} exercise_block
 * @property {number|null} stair_week             // 1..N inside a stairway, null otherwise
 * @property {number|null} stair_level            // rules.stairway.by_N[N].display_level[stair_week] (2 -> 11)
 * @property {{early:number, late:number, this_week:number}|null} standard_step   // the unscaled step INTO this week (null week 1 / flat)
 * @property {'ACCLIMATION'|'DRIVE'|'HARDEST'|'PRE_SEASON'|'TAPER'|'IN_SEASON'|'MAINTENANCE'|'RECOVERY'} phase  @property {string} phase_key
 * @property {{min:number, max:number, intensifiers:boolean}} planned_rir     // rules.effort.planned_map[planned_effort] or by_block_type
 * @property {string|null} season_phase  @property {'VOL1'|'VOL2'|'VOL3'|null} rep_phase  @property {'RC1'|'RC2'|'RC3'|null} plyo_stage
 * @property {{type:'baseline'|'end', items:string[], from_zero:boolean}|null} test
 * @property {{rounds:number, work_s:number}|null} circuit       // bootcamp circuit format only
 * @property {boolean} is_exercise_block_start  @property {boolean} is_training_block_start  @property {boolean} is_last_stair_week
 * @property {Why[]} why
 */
/** @typedef {{mode:string, skeleton:string, weeks_total:number, open_ended:boolean, training_blocks:TrainingBlock[],
 *             exercise_blocks:Array<{n:number, training_block:number, weeks:[number,number]}>, weeks:WeekShape[],
 *             after_plan:{next:'pre_season'|'pre_season_rest'|'block_choice'|'maintenance_end', weeks:number|null, date:string|null}}} Shape */

/** @typedef {Object} SlotDef   — one station instance on one weekday
 * @property {string} slot_id            // `${weekday}.${station.id}` e.g. "Mon.S1.s10"; engine-added `${weekday}.${day_type}.x01…`
 * @property {string} station_id  @property {string} bucket  @property {string} role  @property {string} block  @property {string|null} group
 * @property {[number,number]|null} sets_hint  @property {number} default_sets
 * @property {string|null} pair  @property {string|null} superset  @property {number|null} circuit
 * @property {'axial'|'non_axial'|'light_or_non_axial'|null} axial_req
 * @property {string|null} variant        // side|rear|front, clean|snatch|swing|jerk, upper
 * @property {boolean} laterality_dial  @property {string|null} loading
 * @property {string|null} focus_muscle   // FOCUS / bonus slots
 * @property {string} time_class  @property {boolean} counts_in_cap  @property {boolean} counts_as_volume
 * @property {string|null} text_key       // warm-up / cooldown text items (no exercise)
 * @property {{colour:string, minutes:[number,number], position:'separate'|'addon_after'|'open_day'}|null} aerobic
 * @property {'template'|'bonus'|'focus_added'|'aerobic_addon'|'cooldown'|'prehab_added'} origin
 * @property {Why[]} why
 */
/** @typedef {{weekday:string, day_type:string|null, kind:'main'|'optional'|'aerobic'|'play'|'sport', optional:boolean, label_key:string,
 *             lower_focus:'knee'|'hip'|null, full_body:boolean, format:'straight'|'circuit', exercise_count:number|null, supersets_on:boolean,
 *             est_minutes:number, groups:string[], blocks:Array<{kind:string, movable:boolean, circuit:number|null, slots:SlotDef[]}>, why:Why[]}} DayLayout */
/** @typedef {{template_id:string, variant:string|null, family:string, pairing:string, program_id:string, training_block:number,
 *             days:DayLayout[], off_days:string[], play_days:string[], why:Why[]}} WeekLayout */

/** @typedef {{slot_id:string, bucket:string, exercise_id:string|null, detail:{axis:string, key:string}|null, swaps:string[],
 *             laterality:string|null, loading:'contralateral'|'ipsilateral'|null, why:Why[], flags:string[]}} SlotFill
 *   flags ⊆ pain_swap level_shift pattern_gap no_candidate axial_counted second_day block_change detail_variation laterality_flip
 *           machine_iso_swap no_medball_sub older_default older_opt_in age_50_racket clean_day snatch_day kb_swing_power */
/** @typedef {{exercise_block:number, fills:Object<string,SlotFill>, buy_list:string[], why:Why[]}} Selection */

/** @typedef {Object} WeekVolume
 * @property {number} n  @property {Object<string,number>} sets_by_slot     // slot_id -> whole sets (0 = slot not used this week)
 * @property {SlotDef[]} added_slots                                         // bonus / focus slots created up to this week (persist in the block)
 * @property {Object<string,boolean>} supersets_on                          // weekday -> bool
 * @property {Object<string,number>} target_by_muscle                        // T(w) of the stairway (round2), null for credit-only
 * @property {Object<string,number>} weekly_sets_by_muscle                   // credited (coach count), round2, all muscles in order
 * @property {Object<string,number>} direct_sets_by_muscle
 * @property {Object<string,number>} step_by_muscle                          // planned step used INTO this week (0 week 1 / flat)
 * @property {number} total_resistance_sets  @property {number|null} rise_vs_prev
 * @property {Object<string,number>} banks  @property {Object<string,number>} est_minutes   // weekday -> minutes
 * @property {Array<{key:string, args:Object}>} changes  @property {Issue[]} shortfalls  @property {Why[]} why
 */
/** @typedef {{weeks:WeekVolume[], athletic:AthleticBudget[], warnings:Issue[]}} VolumePlan */
/** @typedef {{n:number, enabled:boolean, plyo_share:number|null, stage:string|null, factor:number,
 *             targets:{plyo_contacts:number|null, jump_contacts:number|null, low_contacts:number|null, throws:number|null, cod_cuts:number|null, sprint_m:number|null, olympic_sets:number|null},
 *             contacts_session_max:number}} AthleticBudget */

/** @typedef {{reps:RepSpec|null, set_reps:RepSpec[]|null, effort:Effort|null, rest:Rest|null, load:Load|null, tempo_key:string|null,
 *             athletic:{unit:string, per_set:number, total:number, stage:string|null, quality:string}|null,
 *             circuit:{rounds:number, work_s:number, transition_s:number}|null,
 *             wod:{format:'amrap'|'emom'|'for_time', minutes:[number,number], stations:string[]}|null,
 *             notes:Array<{key:string, args?:Object}>, why:Why[]}} Dose */
/** @typedef {{type:string, min?:number, max?:number, bracket?:string, value?:number, rounds?:number, work_s?:number, test?:string}} RepSpec
 *   RepSpec  = {type:'range', min, max, bracket?} | {type:'fixed', value} | {type:'per_side', min, max} | {type:'max'} | {type:'myo'}
 *            | {type:'seconds', min, max} | {type:'contacts', value} | {type:'throws_per_side', value} | {type:'metres', value}
 *            | {type:'minutes', min, max} | {type:'rounds_work', rounds, work_s} | {type:'cuts', value} | {type:'test', test} */
/** @typedef {{type:string, min?:number, max?:number, rpe_min?:number, rpe_max?:number, last_set?:'max'|'myo'|null, intensifier?:boolean, key?:string, role?:string, colour?:string}} Effort
 *   Effort   = {type:'rir', min, max, rpe_min, rpe_max, last_set:'max'|'myo'|null, intensifier:boolean}
 *            | {type:'intent', key} | {type:'role', role:'survival'} | {type:'aerobic', colour} | {type:'power', key} */
/** @typedef {{type:string, min?:number, max?:number, transition_s?:number, between_rounds_s?:number}} Rest
 *   Rest     = {type:'seconds', min, max} | {type:'after_pair'} | {type:'work_rest', min, max} | {type:'as_prescribed'} | {type:'circuit', transition_s, between_rounds_s} */
/** @typedef {{type:string, min?:number, max?:number, value?:string, pct?:number}} Load
 *   Load     = {type:'week1_tip'} | {type:'power'} | {type:'bw_pct', min, max} | {type:'medball_lb', min, max} | {type:'height', value:'low'|'medium'} | {type:'pct_hint', pct}   // pct_hint never emitted in Phase 0 (D-29) */

/** @typedef {Object} Model  — engine/model.mjs loadModel(raw); see CONTRACTS §4.2 for the members */
/** @typedef {Object} Plan   — plan/2, CONTRACTS §5 */

export const WEEKDAYS = Object.freeze(['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']);
export const EPS = 1e-9;

export class EngineError extends Error {
  /** @param {string} code @param {string} [message] @param {object} [details] */
  constructor(code, message, details) {
    super(message || code);
    this.name = 'EngineError';
    this.code = code;
    this.details = details || null;
  }
}

/** @param {*} value @returns {string} JSON with recursively sorted keys, no whitespace */
export function canonicalJSON(value) {
  if (value === null || typeof value !== 'object') return JSON.stringify(value === undefined ? null : value);
  if (Array.isArray(value)) return '[' + value.map(canonicalJSON).join(',') + ']';
  const keys = Object.keys(value).filter(k => value[k] !== undefined).sort();
  return '{' + keys.map(k => JSON.stringify(k) + ':' + canonicalJSON(value[k])).join(',') + '}';
}

/** cyrb53 @param {string} str @returns {string} 14 lowercase hex chars */
export function hash53(str) {
  let h1 = 0xdeadbeef ^ 0, h2 = 0x41c6ce57 ^ 0;
  for (let i = 0; i < str.length; i++) {
    const ch = str.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  const n = 4294967296 * (2097151 & h2) + (h1 >>> 0);
  return n.toString(16).padStart(14, '0');
}

/** @param {object} intakeForHash @param {string} modelVersion @returns {string} */
export function makeSeed(intakeForHash, modelVersion) {
  return 'c53:' + hash53(canonicalJSON(intakeForHash) + '|' + modelVersion);
}

/** @param {string} seed @param {...(string|number)} parts @returns {number} uint32 */
export function tieBreak(seed, ...parts) {
  return parseInt(hash53(seed + '|' + parts.join('|')).slice(0, 8), 16) >>> 0;
}

/** half away from zero, 2 decimals @param {number} x @returns {number} */
export function round2(x) {
  const s = x < 0 ? -1 : 1;
  return s * Math.round(Math.abs(x) * 100 + EPS) / 100;
}

/** @param {number} x @returns {number} */
export function roundHalfUp(x) {
  return Math.floor(x + 0.5 + EPS);
}

/** @param {number} x @param {number} lo @param {number} hi @returns {number} */
export function clamp(x, lo, hi) {
  return Math.min(hi, Math.max(lo, x));
}

/** @param {string} key @param {string} ref @param {Object<string,string|number>} [args] @returns {Why} */
export function why(key, ref, args) {
  const o = { key, ref };
  if (args && Object.keys(args).length) o.args = { ...args };
  return Object.freeze(o);
}

function parseIso(iso) {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(iso));
  if (!m) throw new EngineError('util.bad_date', `not an ISO date: ${iso}`);
  return Date.UTC(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
}
function toIso(ms) {
  const d = new Date(ms);
  return d.getUTCFullYear() + '-' + String(d.getUTCMonth() + 1).padStart(2, '0') + '-' + String(d.getUTCDate()).padStart(2, '0');
}

/** @param {string} isoDate @param {number} n @returns {string} */
export function addDays(isoDate, n) {
  return toIso(parseIso(isoDate) + n * 86400000);
}

/** @param {string} isoA @param {string} isoB @returns {number} floor((B - A) / 7 days) */
export function weeksBetween(isoA, isoB) {
  return Math.floor((parseIso(isoB) - parseIso(isoA)) / (7 * 86400000));
}

/** @param {string} isoDate @returns {string} 'Mon'..'Sun' */
export function weekdayOf(isoDate) {
  const d = new Date(parseIso(isoDate)).getUTCDay(); // 0 = Sunday
  return WEEKDAYS[(d + 6) % 7];
}

/** multi-key ascending sort on a copy; key functions return number|string @template T @param {T[]} arr @returns {T[]} */
export function stableSortBy(arr, ...keyFns) {
  return arr.map((v, i) => [v, i]).sort((a, b) => {
    for (const f of keyFns) {
      const x = f(a[0]), y = f(b[0]);
      if (x < y) return -1;
      if (x > y) return 1;
    }
    return a[1] - b[1];
  }).map(p => p[0]);
}

/** @template T @param {T} o @returns {T} */
export function deepFreeze(o) {
  if (o && typeof o === 'object' && !Object.isFrozen(o)) {
    Object.freeze(o);
    for (const k of Object.keys(o)) deepFreeze(o[k]);
  }
  return o;
}

/** half away from zero to d decimals (rates, lambda display) @param {number} x @param {number} d @returns {number} */
export function roundTo(x, d) {
  const f = 10 ** d;
  const s = x < 0 ? -1 : 1;
  return s * Math.round(Math.abs(x) * f + EPS) / f;
}

/** sorted unique strings (plain code-unit order, never localeCompare) @param {Iterable<string>} xs @returns {string[]} */
export function uniqueSorted(xs) {
  return [...new Set(xs)].sort((a, b) => (a < b ? -1 : a > b ? 1 : 0));
}

/** structural deep equality for plain JSON values (key order ignored) @param {*} a @param {*} b @returns {boolean} */
export function jsonEqual(a, b) {
  return canonicalJSON(a) === canonicalJSON(b);
}

const FORBIDDEN = /^(sex|gender|sleep|stress|recovery|job|hard_job_or_other_sport|life|energy)$/i;
/** dotted paths of keys that must never appear (H13, H16) @param {*} obj @returns {string[]} */
export function forbiddenKeys(obj, prefix = '') {
  const out = [];
  forbiddenWalk(obj, prefix, [], out);
  return out;
}
// (G-311, performance only: one accumulator and the path built only for a key that matches - the same paths in the same order)
function forbiddenPath(prefix, segs) {
  let p = prefix;
  for (const sg of segs) p = typeof sg === 'number' ? `${p}[${sg}]` : (p ? `${p}.${sg}` : sg);
  return p;
}
function forbiddenWalk(obj, prefix, segs, out) {
  if (obj && typeof obj === 'object') {
    if (Array.isArray(obj)) obj.forEach((v, i) => { segs.push(i); forbiddenWalk(v, prefix, segs, out); segs.pop(); });
    else for (const k of Object.keys(obj)) {
      segs.push(k);
      if (FORBIDDEN.test(k)) out.push(forbiddenPath(prefix, segs));
      forbiddenWalk(obj[k], prefix, segs, out);
      segs.pop();
    }
  }
}
