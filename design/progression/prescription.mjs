// Experimental CX reference contract, not the production plan/2 validator.
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

/** A loadIndex is an instruction to attempt the next available increment, never a prediction or kg value. */
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
    return { week: index + 1, sets: value, reps, rir: rir[index], loadIndex, action,
      conditional: action === 'load',
      condition: action === 'load' ? 'maintain_prescribed_rir_and_technique_otherwise_hold' : null };
  });
  return { status: issues.length ? 'unresolved' : 'ok', weeks, issues,
    loadMeaning: 'relative_available_increment_not_absolute_weight_or_guaranteed_performance' };
}

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
      finite(day.limitSeconds, 'limitSeconds'); finite(day.fixedSeconds, 'fixedSeconds');
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
        demand(pair.changeoverSavingSeconds <= a.changeoverSeconds + b.changeoverSeconds,
          'pair changeover saving exceeds its changeovers');
      }
    }
  }
}

/** Recompute only the declared arithmetic subset. This never certifies exercise/population/clinical suitability. */
export function evaluatePrescription(plan) {
  validateShape(plan);
  const issues = [];
  const totals = [];
  let previousItems = new Map();
  const issue = (code, where, actual, limit) => issues.push({ code, ...where, actual, limit });
  plan.weeks.forEach((week, index) => {
    const credits = Object.fromEntries(plan.groups.map(group => [group.id, 0]));
    const mainCredits = Object.fromEntries(plan.groups.map(group => [group.id, 0]));
    const currentItems = new Map();
    const days = week.days.map(day => {
      let seconds = day.fixedSeconds;
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
      if (seconds > day.limitSeconds) issue('time_exceeded', { week: index + 1, day: day.id }, seconds, day.limitSeconds);
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
      'credited_monotonicity', 'session_time', 'requested_endpoints'], issues, totals };
}

/** Preserve explicit human overrides; remove obsolete validation rather than moving other sets silently. */
export function applySetEdits(plan, edits) {
  validateShape(plan);
  demand(Array.isArray(edits), 'edits must be an array');
  const seen = new Set();
  const next = structuredClone(plan);
  const clearValidation = value => {
    for (const key of ['validation', 'certificate', 'certified', 'status']) delete value[key];
  };
  clearValidation(next);
  for (const week of next.weeks) {
    clearValidation(week);
    for (const day of week.days) {
      clearValidation(day);
      for (const item of day.items) clearValidation(item);
    }
  }
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
  return { plan: next, validation: evaluatePrescription(next), edited: true, priorValidationDiscarded: true };
}
