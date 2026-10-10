// PROPOSED numerical implementation of CX-01..03, not the planner or a safety model.
// Units: curve values may be credited sets; scheduled coordinates are actual work sets.

function object(value, name) {
  if (value === null || typeof value !== 'object' || Array.isArray(value)) {
    throw new TypeError(`${name} must be an object`);
  }
}

function finite(value, name, minimum = 0) {
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    throw new TypeError(`${name} must be finite`);
  }
  if (value < minimum) throw new RangeError(`${name} must be >= ${minimum}`);
}

function integer(value, name) {
  if (!Number.isSafeInteger(value) || value < 0) {
    throw new RangeError(`${name} must be a nonnegative safe integer`);
  }
}

function vector(value, name) {
  if (!Array.isArray(value) || value.length === 0) {
    throw new TypeError(`${name} must be a nonempty array`);
  }
  for (let index = 0; index < value.length; index += 1) {
    integer(value[index], `${name}[${index}]`);
  }
}

function freeze(value) {
  if (value !== null && typeof value === 'object') {
    for (const child of Object.values(value)) freeze(child);
    Object.freeze(value);
  }
  return value;
}

function sumSafe(values, name) {
  let total = 0n;
  for (const value of values) total += BigInt(value);
  if (total > BigInt(Number.MAX_SAFE_INTEGER)) {
    throw new RangeError(`${name} exceeds the safe-integer range`);
  }
  return Number(total);
}

function logFactor(lambda, rate) {
  if (lambda === 0 || rate === 0) return 0;
  const product = lambda * rate;
  if (Number.isFinite(product)) return Math.log1p(product);
  return Math.log(lambda) + Math.log(rate);
}

function logGrowth(lambda, rates) {
  let value = 0;
  for (const rate of rates) value += logFactor(lambda, rate);
  return value;
}

function curveFailure(status, code, details = {}) {
  return freeze({ status, scope: 'multiplicative_curve', code, ...details });
}

/**
 * Solve start * product(1 + lambda * rates[i]) = peak, with lambda >= 0.
 * `rates` explicitly supplies every transition; no calendar or rate defaults.
 * Numerical controls are mandatory, computational only, and never training limits.
 * Only the multiplicative curve is called unreachable. A numerical failure is unresolved.
 * The log residual must meet logTolerance * min(1, targetLogGrowth), so tiny
 * headroom also has relative precision. Only then are supplied endpoints pinned.
 */
export function solveEndpointCurve(input) {
  object(input, 'input');
  const { start, peak, rates, numerics } = input;
  finite(start, 'start');
  finite(peak, 'peak');
  if (!Array.isArray(rates)) throw new TypeError('rates must be an array');
  for (let index = 0; index < rates.length; index += 1) {
    finite(rates[index], `rates[${index}]`);
  }
  object(numerics, 'numerics');
  const { logTolerance, maxIterations, maxBracketDoublings } = numerics;
  finite(logTolerance, 'numerics.logTolerance');
  if (logTolerance === 0) throw new RangeError('logTolerance must be positive');
  integer(maxIterations, 'numerics.maxIterations');
  integer(maxBracketDoublings, 'numerics.maxBracketDoublings');
  if (peak < start) return curveFailure('unreachable', 'peak_below_start');

  const referenceLogGrowth = logGrowth(1, rates);
  const rawReferencePeak = start === 0 ? 0 : Math.exp(Math.log(start) + referenceLogGrowth);
  const referencePeak = Number.isFinite(rawReferencePeak) ? rawReferencePeak : null;
  if (peak === start) {
    return freeze({
      status: 'ok', scope: 'multiplicative_curve', lambda: 0,
      values: Array(rates.length + 1).fill(start), progress: Array(rates.length + 1).fill(0),
      referenceRates: [...rates], scaledRates: rates.map(() => 0),
      referencePeak, referenceLogGrowth, targetLogGrowth: 0,
      endpointLogResidual: 0, effectiveLogTolerance: 0,
      accelerated: false, iterations: 0, bracketDoublings: 0,
      numerics: { logTolerance, maxIterations, maxBracketDoublings },
    });
  }
  if (start === 0) return curveFailure('unreachable', 'zero_start');
  if (rates.length === 0) return curveFailure('unreachable', 'single_week_endpoint_mismatch');
  if (!rates.some((rate) => rate > 0)) return curveFailure('unreachable', 'no_positive_rate');

  const relativeGrowth = (peak - start) / start;
  const targetLogGrowth = Number.isFinite(relativeGrowth)
    ? Math.log1p(relativeGrowth) : Math.log(peak) - Math.log(start);
  const effectiveLogTolerance = logTolerance * Math.min(1, targetLogGrowth);
  if (effectiveLogTolerance === 0) {
    return curveFailure('unresolved', 'tolerance_underflow', { effectiveLogTolerance });
  }
  let low = 0;
  let high = 1;
  let highGrowth = referenceLogGrowth;
  let bracketDoublings = 0;
  while (highGrowth < targetLogGrowth - effectiveLogTolerance) {
    if (bracketDoublings === maxBracketDoublings) {
      return curveFailure('unresolved', 'bracket_budget', { bracketDoublings });
    }
    const nextHigh = high * 2;
    if (!Number.isFinite(nextHigh)) {
      return curveFailure('unresolved', 'lambda_range', { bracketDoublings });
    }
    low = high;
    high = nextHigh;
    highGrowth = logGrowth(high, rates);
    bracketDoublings += 1;
  }

  let lambda = high;
  let endpointLogResidual = highGrowth - targetLogGrowth;
  let iterations = 0;
  while (Math.abs(endpointLogResidual) > effectiveLogTolerance) {
    if (iterations === maxIterations) {
      return curveFailure('unresolved', 'iteration_budget', {
        iterations, bracketDoublings, endpointLogResidual,
      });
    }
    const middle = low + (high - low) / 2;
    if (middle === low || middle === high) {
      return curveFailure('unresolved', 'floating_point_resolution', {
        iterations, bracketDoublings, endpointLogResidual,
      });
    }
    lambda = middle;
    const growth = logGrowth(lambda, rates);
    endpointLogResidual = growth - targetLogGrowth;
    if (endpointLogResidual < 0) low = lambda;
    else high = lambda;
    iterations += 1;
  }

  // expm1 avoids cancellation for small growth; the scaled form avoids overflow.
  const denominator = Math.expm1(targetLogGrowth);
  const progress = [0];
  const values = [start];
  let cumulativeLogGrowth = 0;
  for (let index = 0; index < rates.length; index += 1) {
    cumulativeLogGrowth += logFactor(lambda, rates[index]);
    const fraction = Number.isFinite(denominator)
      ? Math.expm1(cumulativeLogGrowth) / denominator
      : Math.exp(cumulativeLogGrowth - targetLogGrowth)
        * (-Math.expm1(-cumulativeLogGrowth)) / (-Math.expm1(-targetLogGrowth));
    const p = index === rates.length - 1 ? 1 : Math.max(progress[index], Math.min(1, fraction));
    progress.push(p);
    const increment = start * Math.expm1(cumulativeLogGrowth);
    const value = Number.isFinite(increment)
      ? start + increment : Math.exp(Math.log(start) + cumulativeLogGrowth);
    values.push(index === rates.length - 1 ? peak : Math.max(values[index], Math.min(peak, value)));
  }
  return freeze({
    status: 'ok', scope: 'multiplicative_curve', lambda, values, progress,
    referenceRates: [...rates], scaledRates: rates.map((rate) => {
      const scaled = rate * lambda;
      return Number.isFinite(scaled) ? scaled : null;
    }),
    referencePeak, referenceLogGrowth, targetLogGrowth, endpointLogResidual, effectiveLogTolerance,
    accelerated: lambda > 1, iterations, bracketDoublings,
    numerics: { logTolerance, maxIterations, maxBracketDoublings },
  });
}

function roundingMode(rounding) {
  if (rounding !== 'floor' && rounding !== 'half_up') {
    throw new RangeError('rounding must be floor or half_up');
  }
}

function progressVector(progress, grows) {
  if (!Array.isArray(progress) || progress.length === 0) {
    throw new TypeError('progress must be a nonempty array');
  }
  for (let index = 0; index < progress.length; index += 1) {
    const p = progress[index];
    finite(p, `progress[${index}]`);
    if (p > 1) throw new RangeError('progress must be <= 1');
    if (index > 0 && p < progress[index - 1]) throw new RangeError('progress must not decrease');
  }
  if (progress[0] !== 0) throw new RangeError('progress must start at 0');
  if (grows && progress.length > 1 && progress.at(-1) !== 1) {
    throw new RangeError('growing progress must end at 1');
  }
}

function endpoints(startSets, peakSets) {
  vector(startSets, 'startSets');
  vector(peakSets, 'peakSets');
  if (startSets.length !== peakSets.length) throw new RangeError('endpoint dimensions differ');
  sumSafe(startSets, 'start total');
  sumSafe(peakSets, 'peak total');
  return peakSets.findIndex((peak, index) => peak < startSets[index]);
}

// Quantize the exact binary value of p, not a rounded floating-point delta * p.
function quantize(delta, p, rounding) {
  if (p === 0 || delta === 0) return 0;
  if (p === 1) return delta;
  const bytes = new DataView(new ArrayBuffer(8));
  bytes.setFloat64(0, p, false);
  const high = bytes.getUint32(0, false);
  const low = bytes.getUint32(4, false);
  const exponent = (high >>> 20) & 0x7ff;
  let significand = (BigInt(high & 0xfffff) << 32n) | BigInt(low);
  if (exponent !== 0) significand += 1n << 52n;
  const shift = BigInt(exponent === 0 ? 1074 : 1075 - exponent);
  const denominator = 1n << shift;
  const product = BigInt(delta) * significand;
  return Number(rounding === 'floor' ? product / denominator
    : (2n * product + denominator) / (2n * denominator));
}

function tableFacts(weeks) {
  const totalSets = weeks.map((week) => sumSafe(week, 'week total'));
  const deltas = [];
  const riseFractions = [];
  const zeroBaseIncreases = [];
  const totalDeltas = [];
  const totalRiseFractions = [];
  const totalZeroBaseIncreases = [];
  for (let week = 1; week < weeks.length; week += 1) {
    const delta = weeks[week].map((sets, coordinate) => sets - weeks[week - 1][coordinate]);
    deltas.push(delta);
    riseFractions.push(delta.map((added, coordinate) => {
      const prior = weeks[week - 1][coordinate];
      return prior === 0 ? (added === 0 ? 0 : null) : added / prior;
    }));
    zeroBaseIncreases.push(delta.map((added, coordinate) => added > 0 && weeks[week - 1][coordinate] === 0));
    const totalDelta = totalSets[week] - totalSets[week - 1];
    totalDeltas.push(totalDelta);
    totalRiseFractions.push(totalSets[week - 1] === 0
      ? (totalDelta === 0 ? 0 : null) : totalDelta / totalSets[week - 1]);
    totalZeroBaseIncreases.push(totalDelta > 0 && totalSets[week - 1] === 0);
  }
  return { weeks, deltas, riseFractions, zeroBaseIncreases,
    totalSets, totalDeltas, totalRiseFractions, totalZeroBaseIncreases };
}

/**
 * Low-level coordinatewise interpolation between nested integer endpoints.
 * No time/credit certificate, exercise placement rule or optimality is established.
 * A failure of this construction is never evidence of general plan infeasibility.
 */
export function scheduleNestedSets(input) {
  object(input, 'input');
  const { startSets, peakSets, progress, rounding } = input;
  const nonNested = endpoints(startSets, peakSets);
  roundingMode(rounding);
  const grows = peakSets.some((peak, index) => peak > startSets[index]);
  progressVector(progress, grows);
  if (nonNested !== -1) return freeze({
    status: 'unsupported', scope: 'nested_construction', code: 'non_nested_endpoints', coordinate: nonNested,
  });
  if (grows && progress.length === 1) return freeze({
    status: 'unreachable', scope: 'nested_construction', code: 'single_week_endpoint_mismatch',
  });
  const weeks = progress.map((p) => startSets.map((start, coordinate) =>
    start + quantize(peakSets[coordinate] - start, p, rounding)));
  return freeze({ status: 'ok', scope: 'nested_construction', units: 'actual_work_sets',
    rounding, ...tableFacts(weeks) });
}

/** Join nested-vector epochs, sharing each certified boundary exactly once. */
export function scheduleEpochs(input) {
  object(input, 'input');
  const { epochs } = input;
  if (!Array.isArray(epochs) || epochs.length === 0) {
    throw new TypeError('epochs must be a nonempty array');
  }
  const scheduled = epochs.map((epoch) => scheduleNestedSets(epoch));
  const failed = scheduled.findIndex((epoch) => epoch.status !== 'ok');
  if (failed !== -1) return freeze({
    status: scheduled[failed].status, scope: 'epoch_construction',
    code: 'epoch_failed', epoch: failed, cause: scheduled[failed],
  });
  for (let index = 1; index < scheduled.length; index += 1) {
    const previous = scheduled[index - 1].weeks.at(-1);
    const next = scheduled[index].weeks[0];
    if (previous.length !== next.length || previous.some((sets, coordinate) => sets !== next[coordinate])) {
      return freeze({ status: 'unsupported', scope: 'epoch_construction',
        code: 'boundary_mismatch', epoch: index });
    }
  }
  const weeks = scheduled.flatMap((epoch, index) => epoch.weeks.slice(index === 0 ? 0 : 1));
  let firstWeek = 0;
  const boundaries = scheduled.map((epoch) => {
    const boundary = { firstWeek, lastWeek: firstWeek + epoch.weeks.length - 1 };
    firstWeek = boundary.lastWeek;
    return boundary;
  });
  return freeze({ status: 'ok', scope: 'epoch_construction', units: 'actual_work_sets',
    ...tableFacts(weeks), epochs: scheduled, boundaries });
}

/**
 * Preferred group-day construction: quantize one aggregate addition count per group,
 * then place that many entries of its deterministic add sequence (spec 5.2c).
 * All inputs, including cyclic tie state and computational addition budget, are explicit.
 * This handles group-day placement, not exercise-level distribution or credit/time checks.
 */
export function scheduleGroupPrefixes(input) {
  object(input, 'input');
  const { groups, rounding, maxAdditions } = input;
  roundingMode(rounding);
  integer(maxAdditions, 'maxAdditions');
  if (!Array.isArray(groups) || groups.length === 0) {
    throw new TypeError('groups must be a nonempty array');
  }
  const ids = new Set();
  let weekCount;
  let unsupported;
  let totalAdditions = 0n;
  for (let index = 0; index < groups.length; index += 1) {
    const group = groups[index];
    object(group, `groups[${index}]`);
    const { id, startSets, peakSets, progress, optionalDays, nextDayIndex } = group;
    if (typeof id !== 'string' || id.length === 0 || ids.has(id)) {
      throw new TypeError('group ids must be unique nonempty strings');
    }
    ids.add(id);
    const nonNested = endpoints(startSets, peakSets);
    const grows = peakSets.some((peak, day) => peak > startSets[day]);
    progressVector(progress, grows);
    if (weekCount !== undefined && weekCount !== progress.length) {
      throw new RangeError('all groups must have the same number of weeks');
    }
    weekCount = progress.length;
    if (!Array.isArray(optionalDays) || optionalDays.length !== startSets.length
        || [...optionalDays].some((optional) => typeof optional !== 'boolean')) {
      throw new TypeError('optionalDays must contain one boolean per day');
    }
    integer(nextDayIndex, 'nextDayIndex');
    if (nextDayIndex >= startSets.length) throw new RangeError('nextDayIndex is outside the day vector');
    if (nonNested !== -1) unsupported ??= { status: 'unsupported', code: 'non_nested_endpoints', group: id, day: nonNested };
    if (grows && progress.length === 1) unsupported ??= { status: 'unreachable', code: 'single_week_endpoint_mismatch', group: id };
    for (let day = 0; day < peakSets.length; day += 1) {
      if (peakSets[day] >= startSets[day]) totalAdditions += BigInt(peakSets[day] - startSets[day]);
    }
  }
  sumSafe(groups.flatMap((group) => group.startSets), 'all-group start total');
  sumSafe(groups.flatMap((group) => group.peakSets), 'all-group peak total');
  if (unsupported) return freeze({ ...unsupported, scope: 'group_prefix_construction' });
  if (totalAdditions > BigInt(maxAdditions)) return freeze({
    status: 'unresolved', scope: 'group_prefix_construction', code: 'addition_budget', maxAdditions,
  });

  const weeks = Array.from({ length: weekCount }, () => []);
  let offset = 0;
  const groupFacts = groups.map((group) => {
    const { id, startSets, peakSets, progress, optionalDays } = group;
    const width = startSets.length;
    const room = peakSets.map((peak, day) => peak - startSets[day]);
    const additionCount = sumSafe(room, 'group additions');
    const added = Array(width).fill(0);
    let nextDayIndex = group.nextDayIndex;
    const addSequence = [];
    for (let step = 0; step < additionCount; step += 1) {
      let selected = -1;
      for (let distance = 0; distance < width; distance += 1) {
        const day = (nextDayIndex + distance) % width;
        if (added[day] === room[day]) continue;
        if (selected === -1 || added[day] < added[selected]
            || (added[day] === added[selected] && !optionalDays[day] && optionalDays[selected])) {
          selected = day;
        }
      }
      added[selected] += 1;
      addSequence.push(selected);
      nextDayIndex = (selected + 1) % width;
    }
    const cumulativeAdds = progress.map((p) => quantize(additionCount, p, rounding));
    const placed = [...startSets];
    const totals = [];
    let cursor = 0;
    for (let week = 0; week < weekCount; week += 1) {
      while (cursor < cumulativeAdds[week]) {
        placed[addSequence[cursor]] += 1;
        cursor += 1;
      }
      weeks[week].push(...placed);
      totals.push(sumSafe(placed, 'group week total'));
    }
    const result = { id, offset, width, addSequence, cumulativeAdds, totals, finalNextDayIndex: nextDayIndex };
    offset += width;
    return result;
  });
  return freeze({ status: 'ok', scope: 'group_prefix_construction', units: 'actual_work_sets',
    rounding, maxAdditions, ...tableFacts(weeks), groups: groupFacts });
}
