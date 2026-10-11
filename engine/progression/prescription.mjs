// engine/progression/prescription.mjs - progression instructions, next-block starts and set-edit arithmetic (engine 0.5.0).
// Coach answers: CX-02 / CX-03 (the same sets may hold while reps or load progress, also at the top), CX-04 (everything is
// editable: sets for any day or week), R4-PRG-03 (reps and load are written as a rule the person applies, never a promised number
// per week), R4-PRG-04 (the next block starts a little above the last one, never above the level's top), CT-01 (session time is
// never a limit: the seconds below are an estimate, information only).
// Moved from design/progression/ with the fixes of reviews/claude-codex-audit.md:
//   HIGH-2    every flat-week instruction is conditional (double progression): a rep range and a rule, never a predicted number
//   MEDIUM-1  an edited plan is rebuilt from an allowlist of prescription fields, stamped `edited`, its summary recomputed
//   MEDIUM-5  a pair's changeover saving may not exceed the smaller of its two changeovers (time never drops when a slot switches on)
//   HIGH-1    is closed by CT-01: no time certification exists any more; every week's estimate is computed directly
// Pure arithmetic: no I/O, no clock, no randomness, no model access. It never certifies exercise, population or clinical suitability.
const object = value => value !== null && typeof value === 'object' && !Array.isArray(value);
const demand = (condition, message) => { if (!condition) throw new TypeError(message); };
const integer = (value, name, min = 0) => {
  demand(Number.isSafeInteger(value) && value >= min, `${name} must be a safe integer >= ${min}`);
  return value;
};
const finite = (value, name, min = 0) => {
  demand(Number.isFinite(value) && value >= min, `${name} must be finite and >= ${min}`);
  return value;
};
const id = (value, name) => {
  demand(typeof value === 'string' && /^[A-Za-z0-9][A-Za-z0-9_.-]*$/.test(value), `${name} must be a nonempty identifier`);
  demand(!['__proto__', 'constructor', 'prototype'].includes(value), `${name} is reserved`);
  return value;
};
const unique = (values, name) => demand(new Set(values).size === values.length, `${name} must be unique`);
const checked = (value, name) => {
  demand(Number.isFinite(value) && value >= 0 && value <= Number.MAX_SAFE_INTEGER, `${name} exceeds nonnegative numeric bounds`);
  return value;
};

/** The condition every flat-week step carries (HIGH-2, R4-PRG-03): the person decides from what they did, the plan never predicts it. */
export const PROGRESSION_CONDITION = 'all_sets_at_top_of_range_within_planned_rir_with_good_technique_otherwise_repeat';

/** Caller supplies model parameters; rational arithmetic rounds after EACH completed block. */
export function advanceBlocks({ start, ceiling, absoluteCap, blocks, multiplier, capIncrement }) {
  integer(start, 'start'); integer(ceiling, 'ceiling'); integer(absoluteCap, 'absoluteCap');
  integer(blocks, 'blocks'); integer(capIncrement, 'capIncrement');
  demand(blocks <= 10000, 'blocks exceeds the reference execution budget (10000)');
  demand(start <= ceiling && ceiling <= absoluteCap, 'require start <= ceiling <= absoluteCap');
  demand(object(multiplier), 'multiplier is required');
  const n = BigInt(integer(multiplier.numerator, 'multiplier.numerator', 1));
  const d = BigInt(integer(multiplier.denominator, 'multiplier.denominator', 1));
  demand(n >= d, 'multiplier must not decrease the start');
  const cap = BigInt(absoluteCap);
  const history = [];
  for (let block = 1; block <= blocks; block++) {
    const nextCeiling = BigInt(ceiling) + BigInt(capIncrement);
    ceiling = Number(nextCeiling < cap ? nextCeiling : cap);
    const rounded = (2n * BigInt(start) * n + d) / (2n * d);
    start = Number(rounded < BigInt(ceiling) ? rounded : BigInt(ceiling));
    history.push({ block, start, ceiling, saturated: start === ceiling });
  }
  return { start, ceiling, saturated: start === ceiling, history };
}

/**
 * R4-PRG-04: where the next block's weekly sets start. "A little above where the last block started (about 5 % more, rounded to
 * whole sets), never above the level's top number. If they're already at the top, sets stay and progress comes from load and
 * reps." Exact rational arithmetic, half up. PROPOSED detail (audit L8): below the top the start rises by at least one whole
 * set, so a small start is never stuck at the same number (9 x 1.05 = 9.45 would round back to 9).
 * @param {{start:number, top:number, multiplier:{numerator:number, denominator:number}, blocks?:number}} input whole sets
 * @returns {{start:number, top:number, at_top:boolean, history:Array<{block:number, start:number, at_top:boolean}>}}
 */
export function nextBlockStart({ start, top, multiplier, blocks = 1 }) {
  integer(start, 'start'); integer(top, 'top'); integer(blocks, 'blocks');
  demand(blocks <= 10000, 'blocks exceeds the reference execution budget (10000)');
  demand(object(multiplier), 'multiplier is required');
  const n = BigInt(integer(multiplier.numerator, 'multiplier.numerator', 1));
  const d = BigInt(integer(multiplier.denominator, 'multiplier.denominator', 1));
  demand(n >= d, 'multiplier must not decrease the start');
  // a start already above the level's top (pain-free imports, edited plans) is kept, never raised and never silently lowered
  const history = [];
  let s = start;
  for (let block = 1; block <= blocks; block++) {
    if (s < top) {
      const rounded = Number((2n * BigInt(s) * n + d) / (2n * d));
      s = Math.min(top, Math.max(s + 1, rounded));
    }
    history.push({ block, start: s, at_top: s >= top });
  }
  return { start: s, top, at_top: s >= top, history };
}

/**
 * The week-by-week progression card of one exercise (CX-02 / CX-03, R4-PRG-03). A week that adds a set says so. A week that
 * keeps its sets carries a CONDITIONAL step (HIGH-2): "when every set reached the top of the range with the planned reps left
 * in the tank and good technique, add reps (or, at the top of the range, add load and start again at the bottom); otherwise
 * repeat". `reps` and `loadIndex` are the furthest the rule can have taken the person by that week - a ceiling for planning,
 * never a promised performance - and `repRange` is what the plan prints.
 * A loadIndex is an instruction to attempt the next available increment, never a prediction or kg value.
 */
export function planProgression({ sets, repMin, repMax, startReps, repStep, allowLoadProgression, rir }) {
  demand(Array.isArray(sets) && sets.length > 0, 'sets must contain at least one week');
  demand(Array.isArray(rir) && rir.length === sets.length, 'rir must cover every week');
  integer(repMin, 'repMin', 1); integer(repMax, 'repMax', repMin);
  integer(startReps, 'startReps', repMin); integer(repStep, 'repStep', 1);
  demand(startReps <= repMax, 'startReps exceeds repMax');
  demand(typeof allowLoadProgression === 'boolean', 'allowLoadProgression must be explicit');
  for (let index = 0; index < sets.length; index++) {
    demand(Object.hasOwn(sets, index) && Object.hasOwn(rir, index), 'week arrays must not contain holes');
  }
  sets.forEach((value, index) => {
    integer(value, `sets[${index}]`, 1);
    finite(rir[index], `rir[${index}]`, 1);
    demand(rir[index] <= 3, 'rir exceeds the approved band');
    if (index) {
      demand(value >= sets[index - 1], 'generated sets must not decrease');
      demand(rir[index] <= rir[index - 1], 'generated rir must not increase');
    }
  });
  let reps = startReps;
  let loadIndex = 0;
  const issues = [];
  const weeks = sets.map((value, index) => {
    let action = index ? 'sets' : 'start';
    if (index && value === sets[index - 1]) {
      if (reps < repMax) {
        reps += Math.min(repStep, repMax - reps);
        action = 'reps';
      } else if (allowLoadProgression) {
        loadIndex++;
        reps = repMin;
        action = 'load';
      } else {
        action = 'unresolved';
        issues.push({ code: 'progression_unavailable', week: index + 1 });
      }
    }
    // HIGH-2: both flat-week steps are conditional - the rep step as much as the load step
    const conditional = action === 'reps' || action === 'load';
    return { week: index + 1, sets: value, reps, repRange: [repMin, repMax], rir: rir[index], loadIndex, action,
      conditional, condition: conditional ? PROGRESSION_CONDITION : null };
  });
  return { status: issues.length ? 'unresolved' : 'ok', weeks, issues, rule: progressionRule({ repMin, repMax, allowLoadProgression }),
    repsMeaning: 'furthest_the_rule_allows_by_this_week_not_a_predicted_performance',
    loadMeaning: 'relative_available_increment_not_absolute_weight_or_guaranteed_performance' };
}

/**
 * R4-PRG-03: the rule the person applies, as data (render writes the words in EN / ES).
 * "3 sets of 8-12. When you hit 12 on every set with 1-2 reps left in the tank, add weight next time and start again at 8."
 * @param {{repMin:number, repMax:number, allowLoadProgression?:boolean}} input
 */
export function progressionRule({ repMin, repMax, allowLoadProgression = true }) {
  integer(repMin, 'repMin', 1); integer(repMax, 'repMax', repMin);
  return { kind: repMax > repMin ? 'double_progression' : (allowLoadProgression ? 'load_when_all_sets_done' : 'hold'),
    rep_range: [repMin, repMax], when: PROGRESSION_CONDITION,
    then: allowLoadProgression ? 'add_load_next_time_and_restart_at_bottom_of_range' : 'hold_reps_at_top_of_range', else: 'repeat',
    promised_numbers: false };
}

// ---------------------------------------------------------------------------------------------------------------------------
// the prescription arithmetic (credits, bounds, monotonicity, endpoints; the time estimate as information only, CT-01)
// ---------------------------------------------------------------------------------------------------------------------------

// MEDIUM-1: the prescription fields an edited plan is rebuilt from. Anything else (approval, fingerprint, validation, certificate,
// summary, meta ...) is not copied, so no stale approval can survive an edit.
const GROUP_FIELDS = ['id', 'minCredits', 'maxCredits', 'maxDailyCredits', 'targetCredits'];
const DAY_FIELDS = ['id', 'optional', 'fixedSeconds'];
const ITEM_FIELDS = ['id', 'sets', 'minSets', 'maxSets', 'reps', 'minReps', 'maxReps', 'secondsPerRep', 'restSeconds', 'changeoverSeconds', 'rir', 'credits'];
const PAIR_FIELDS = ['a', 'b', 'changeoverSavingSeconds'];
const pick = (source, fields) => {
  const out = {};
  for (const key of fields) if (Object.hasOwn(source, key) && source[key] !== undefined) out[key] = structuredClone(source[key]);
  return out;
};

function validateShape(plan) {
  demand(object(plan) && Array.isArray(plan.groups) && Array.isArray(plan.weeks) && plan.weeks.length > 0,
    'plan requires groups and nonempty weeks');
  const groupIds = plan.groups.map(group => {
    demand(object(group), 'group must be an object');
    id(group.id, 'group.id');
    integer(group.minCredits, 'minCredits'); integer(group.maxCredits, 'maxCredits', group.minCredits);
    if (group.maxDailyCredits !== undefined) integer(group.maxDailyCredits, 'maxDailyCredits');
    if (group.targetCredits !== undefined) {
      integer(group.targetCredits, 'targetCredits', group.minCredits);
      demand(group.targetCredits <= group.maxCredits, 'targetCredits exceeds maxCredits');
    }
    return group.id;
  });
  unique(groupIds, 'group ids');
  const groups = new Set(groupIds);
  for (const week of plan.weeks) {
    demand(object(week) && Array.isArray(week.days), 'week requires days');
    unique(week.days.map(day => id(day.id, 'day.id')), 'day ids within a week');
    for (const day of week.days) {
      demand(day.optional === undefined || typeof day.optional === 'boolean', 'optional must be boolean');
      if (day.fixedSeconds !== undefined) finite(day.fixedSeconds, 'fixedSeconds');
      demand(Array.isArray(day.items) && Array.isArray(day.pairs), 'day requires items and pairs');
      unique(day.items.map(item => id(item.id, 'item.id')), 'item ids within a day');
      for (const item of day.items) {
        integer(item.sets, 'sets'); integer(item.minSets, 'minSets'); integer(item.maxSets, 'maxSets', item.minSets);
        integer(item.reps, 'reps', 1); integer(item.minReps, 'minReps', 1); integer(item.maxReps, 'maxReps', item.minReps);
        finite(item.secondsPerRep, 'secondsPerRep'); finite(item.restSeconds, 'restSeconds');
        finite(item.changeoverSeconds, 'changeoverSeconds'); finite(item.rir, 'rir');
        demand(object(item.credits), 'credits must map groups to integer quarter-set coefficients');
        for (const [group, credit] of Object.entries(item.credits)) {
          demand(groups.has(group), `unknown credit group ${group}`);
          integer(credit, 'credit'); demand(credit <= 4, 'group credit must be <= 4 quarter sets per set');
        }
      }
      const used = new Set();
      for (const pair of day.pairs) {
        demand(object(pair), 'pair must be an object');
        const a = day.items.find(item => item.id === pair.a);
        const b = day.items.find(item => item.id === pair.b);
        demand(a && b && a !== b, 'pair must reference two distinct existing items');
        demand(!used.has(pair.a) && !used.has(pair.b), 'an item can belong to only one pair');
        used.add(pair.a); used.add(pair.b);
        finite(pair.changeoverSavingSeconds, 'changeoverSavingSeconds');
        // MEDIUM-5: the saving of a pair is bounded by the smaller changeover, so switching a slot on (0 -> 1 set) never lowers
        // the estimated time
        demand(pair.changeoverSavingSeconds <= Math.min(a.changeoverSeconds, b.changeoverSeconds),
          'pair changeover saving exceeds the smaller of its two changeovers');
      }
    }
  }
}

/**
 * Recompute the declared arithmetic subset of a prescription: item bounds, set and RIR monotonicity, weekly quarter credits
 * (all days, and main days for the floors), credited monotonicity and the requested endpoints. Every week is evaluated directly.
 * `seconds` per day is an ESTIMATE (information only, CT-01): no limit exists and time never raises an issue.
 * Each issue carries a class (audit L4): 'bound' (an item or group limit), 'plan_shape' (monotonicity, endpoint).
 */
export function evaluatePrescription(plan) {
  validateShape(plan);
  const issues = [];
  const totals = [];
  let previousItems = new Map();
  const CLASS = { item_sets_decreased: 'plan_shape', rir_increased: 'plan_shape', item_removed: 'plan_shape', credits_decreased: 'plan_shape',
    main_credits_decreased: 'plan_shape', endpoint_mismatch: 'plan_shape' };
  const issue = (code, where, actual, limit) => issues.push({ code, class: CLASS[code] || 'bound', ...where, actual, limit });
  plan.weeks.forEach((week, index) => {
    const credits = Object.fromEntries(plan.groups.map(group => [group.id, 0]));
    const mainCredits = Object.fromEntries(plan.groups.map(group => [group.id, 0]));
    const currentItems = new Map();
    const days = week.days.map(day => {
      let seconds = day.fixedSeconds || 0;
      const dayCredits = Object.fromEntries(plan.groups.map(group => [group.id, 0]));
      for (const item of day.items) {
        const where = { week: index + 1, day: day.id, item: item.id };
        const key = JSON.stringify([day.id, item.id]);
        currentItems.set(key, { ...item, day: day.id });
        const previous = previousItems.get(key);
        if (previous && item.sets < previous.sets) issue('item_sets_decreased', where, item.sets, previous.sets);
        if (previous && previous.sets > 0 && item.sets > 0 && item.rir > previous.rir) {
          issue('rir_increased', where, item.rir, previous.rir);
        }
        if (item.sets < item.minSets) issue('sets_below_min', where, item.sets, item.minSets);
        if (item.sets > item.maxSets) issue('sets_above_max', where, item.sets, item.maxSets);
        if (item.sets === 0) continue;
        if (item.reps < item.minReps) issue('reps_below_min', where, item.reps, item.minReps);
        if (item.reps > item.maxReps) issue('reps_above_max', where, item.reps, item.maxReps);
        if (item.rir < 1 || item.rir > 3) issue('rir_outside_band', where, item.rir, [1, 3]);
        for (const [group, credit] of Object.entries(item.credits)) {
          credits[group] = checked(credits[group] + item.sets * credit, 'weekly credits');
          dayCredits[group] = checked(dayCredits[group] + item.sets * credit, 'daily credits');
          if (!day.optional) mainCredits[group] = checked(mainCredits[group] + item.sets * credit, 'main-day credits');
        }
      }
      const paired = new Set();
      // Sum nonnegative pair components instead of subtracting savings from a large total.
      for (const pair of day.pairs) {
        const a = day.items.find(item => item.id === pair.a);
        const b = day.items.find(item => item.id === pair.b);
        if (!a.sets || !b.sets) continue;
        paired.add(a.id); paired.add(b.id);
        const shared = Math.min(a.sets, b.sets);
        const pairSeconds = a.sets * a.reps * a.secondsPerRep + b.sets * b.reps * b.secondsPerRep
          + shared * Math.max(a.restSeconds, b.restSeconds)
          + (a.sets - shared) * a.restSeconds + (b.sets - shared) * b.restSeconds
          + (a.changeoverSeconds + b.changeoverSeconds - pair.changeoverSavingSeconds);
        seconds = checked(seconds + pairSeconds, 'paired session seconds');
      }
      for (const item of day.items) {
        if (!item.sets || paired.has(item.id)) continue;
        seconds = checked(seconds + item.sets * (item.reps * item.secondsPerRep + item.restSeconds)
          + item.changeoverSeconds, 'session seconds');
      }
      checked(seconds, 'session seconds');
      for (const group of plan.groups) {
        if (group.maxDailyCredits !== undefined && dayCredits[group.id] > group.maxDailyCredits) {
          issue('daily_credits_above_max', { week: index + 1, day: day.id, group: group.id }, dayCredits[group.id], group.maxDailyCredits);
        }
      }
      return { id: day.id, seconds, credits: dayCredits };
    });
    for (const [key, previous] of previousItems) {
      if (previous.sets > 0 && !currentItems.has(key)) {
        issue('item_removed', { week: index + 1, day: previous.day, item: previous.id }, 0, previous.sets);
      }
    }
    for (const group of plan.groups) {
      const where = { week: index + 1, group: group.id };
      if (mainCredits[group.id] < group.minCredits) issue('credits_below_min', where, mainCredits[group.id], group.minCredits);
      if (credits[group.id] > group.maxCredits) issue('credits_above_max', where, credits[group.id], group.maxCredits);
      if (index && credits[group.id] < totals[index - 1].credits[group.id]) {
        issue('credits_decreased', where, credits[group.id], totals[index - 1].credits[group.id]);
      }
      if (index && mainCredits[group.id] < totals[index - 1].mainCredits[group.id]) {
        issue('main_credits_decreased', where, mainCredits[group.id], totals[index - 1].mainCredits[group.id]);
      }
      if (index === plan.weeks.length - 1 && group.targetCredits !== undefined && credits[group.id] !== group.targetCredits) {
        issue('endpoint_mismatch', where, credits[group.id], group.targetCredits);
      }
    }
    totals.push({ week: index + 1, credits, mainCredits, days });
    previousItems = currentItems;
  });
  return { status: issues.length ? 'conflicts' : 'valid_subset', certified: false,
    scope: ['item_bounds', 'item_set_monotonicity', 'rir_monotonicity', 'weekly_quarter_credits',
      'credited_monotonicity', 'requested_endpoints'], time: 'estimate_only', issues, totals };
}

/** the recomputed per-week numbers of a prescription (sets and quarter credits) - an edited plan's own summary */
function summarize(plan, evaluation) {
  return {
    setsByWeek: plan.weeks.map(week => week.days.reduce((total, day) => total + day.items.reduce((sum, item) => sum + item.sets, 0), 0)),
    creditsByWeek: evaluation.totals.map(total => ({ ...total.credits })),
  };
}

/**
 * CX-04: apply explicit human set edits (any week, any day, any item). The edited plan is REBUILT from the prescription fields
 * (MEDIUM-1), so approvals, fingerprints, certificates, validation results and summaries of the generated plan cannot survive;
 * it is stamped `edited: true` and carries a summary recomputed from the edited weeks. Other sets are never moved silently.
 */
export function applySetEdits(plan, edits) {
  validateShape(plan);
  demand(Array.isArray(edits), 'edits must be an array');
  const seen = new Set();
  const next = {
    groups: plan.groups.map(group => pick(group, GROUP_FIELDS)),
    weeks: plan.weeks.map(week => ({
      days: week.days.map(day => ({
        ...pick(day, DAY_FIELDS),
        items: day.items.map(item => pick(item, ITEM_FIELDS)),
        pairs: day.pairs.map(pair => pick(pair, PAIR_FIELDS)),
      })),
    })),
  };
  for (const edit of edits) {
    demand(object(edit), 'edit must be an object');
    integer(edit.week, 'edit.week', 1); integer(edit.sets, 'edit.sets');
    id(edit.dayId, 'edit.dayId'); id(edit.itemId, 'edit.itemId');
    const key = JSON.stringify([edit.week, edit.dayId, edit.itemId]);
    demand(!seen.has(key), 'duplicate edits are ambiguous');
    seen.add(key);
    const day = next.weeks[edit.week - 1]?.days.find(value => value.id === edit.dayId);
    const item = day?.items.find(value => value.id === edit.itemId);
    demand(item, 'edit references an unknown week/day/item');
    item.sets = edit.sets;
  }
  const validation = evaluatePrescription(next);
  next.edited = true;
  next.summary = summarize(next, validation);
  return { plan: next, validation, edited: true, priorValidationDiscarded: true };
}
