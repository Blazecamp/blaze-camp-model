// engine/progression/stairway.mjs - the arithmetic kernel of the weekly-set stairway (engine 0.5.0).
// Coach answers: CX-01 (reach the planned final target, faster steps allowed), CX-02 / CX-03 (the same sets may hold while reps or
// load progress), R4-PRG-01 (reach the top number in the last week, one week early at most), R4-PRG-02 (no hard limit; a note when
// a week adds more than about 15 %). Moved from design/progression/ with the fixes of reviews/claude-codex-audit.md:
//   MEDIUM-2  a loose logTolerance can no longer return status 'ok' (MAX_LOG_TOLERANCE)
//   MEDIUM-3  acceleration is reported from the INTEGER schedule (accelerationReport), not only from the smooth curve
//   MEDIUM-4  the default rounding is arrival-preserving ('arrival': half up, held one set under the top until the arrival week)
// Pure arithmetic: no I/O, no clock, no randomness, no model access. It is not a safety model.
// Units: curve values may be credited sets; scheduled coordinates are actual work sets.

/** MEDIUM-2: numerical controls are engineering parameters; a tolerance above this bound is refused, never 'ok'. */
export const MAX_LOG_TOLERANCE = 1e-6;
/** The engine's default numerical controls (computational only, never training limits). */
export const DEFAULT_NUMERICS = Object.freeze({ logTolerance: 1e-12, maxIterations: 200, maxBracketDoublings: 80 });

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
  // MEDIUM-2 (reviews/claude-codex-audit.md): a loose tolerance pinned the endpoint with most of the growth missing and still said
  // 'ok'. The controls may not turn a numerical failure into success: above the bound the curve is unresolved.
  if (logTolerance > MAX_LOG_TOLERANCE) return curveFailure('unresolved', 'tolerance_too_loose', { logTolerance, maxLogTolerance: MAX_LOG_TOLERANCE });
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

/**
 * MEDIUM-4 / R4-PRG-01: arrival-preserving whole sets. Half up ("you round up, you round down", VOL-06), but the count stays at
 * least one set under the top until the arrival week, so the top number is reached in the last week (weeksEarly 0, the default)
 * or one week early (weeksEarly 1) and never earlier. `progress` is the curve's progress vector (0 ... 1).
 * @param {{start:number, peak:number, progress:number[], weeksEarly?:number}} input whole sets, peak >= start
 * @returns {number[]} whole sets per week, non-decreasing, first = start, last = peak
 */
export function arrivalSchedule(input) {
  object(input, 'input');
  const { start, peak, progress } = input;
  const weeksEarly = input.weeksEarly === undefined ? 0 : input.weeksEarly;
  integer(start, 'start'); integer(peak, 'peak'); integer(weeksEarly, 'weeksEarly');
  if (weeksEarly > 1) throw new RangeError('weeksEarly must be 0 or 1 (R4-PRG-01: one week early at most)');
  if (peak < start) throw new RangeError('peak must be >= start');
  const grows = peak > start;
  progressVector(progress, grows);
  const n = progress.length;
  if (grows && n === 1) throw new RangeError('a one-week block cannot grow');
  const h = peak - start;
  const arrival = Math.max(1, n - weeksEarly); // 1-based week the top number is first allowed
  const out = [];
  for (let w = 1; w <= n; w += 1) {
    let add = quantize(h, progress[w - 1], 'half_up');
    if (w < arrival) add = Math.min(add, Math.max(0, h - 1));
    if (w >= arrival && w === n) add = h;
    if (w > 1) add = Math.max(add, out[w - 2] - start);
    out.push(start + add);
  }
  if (n > 1 || !grows) out[n - 1] = peak;
  return out;
}

/**
 * MEDIUM-3 / R4-PRG-02: what the INTEGER schedule does, week by week. Information only - none of these numbers is a cap (CX-01).
 * @param {{sets:number[], referenceRates:number[], noteAbove:number, minWholeSets?:number}} input
 *   sets: whole (or credited) sets per week; referenceRates: the default pattern's rise for each transition (3 % / 5 %);
 *   noteAbove: the fraction above which a week is noted (about 0.15); minWholeSets: a rise smaller than this many sets is never
 *   noted (one whole set is the smallest step a group can take).
 * @returns {{weeks:Array<{week:number, from:number, to:number, added:number, rise:number|null, defaultRise:number,
 *   aboveDefault:boolean, noted:boolean}>, accelerated:boolean, noted:number[]}}
 */
export function accelerationReport(input) {
  object(input, 'input');
  const { sets, referenceRates, noteAbove } = input;
  const minWholeSets = input.minWholeSets === undefined ? 0 : input.minWholeSets;
  if (!Array.isArray(sets) || sets.length === 0) throw new TypeError('sets must be a nonempty array');
  if (!Array.isArray(referenceRates) || referenceRates.length !== sets.length - 1) throw new RangeError('referenceRates must give one rate per transition');
  finite(noteAbove, 'noteAbove'); finite(minWholeSets, 'minWholeSets');
  for (let i = 0; i < sets.length; i += 1) finite(sets[i], `sets[${i}]`);
  const weeks = [];
  for (let i = 1; i < sets.length; i += 1) {
    finite(referenceRates[i - 1], `referenceRates[${i - 1}]`);
    const from = sets[i - 1], to = sets[i], added = to - from;
    const rise = from === 0 ? (added === 0 ? 0 : null) : added / from;
    const defaultRise = referenceRates[i - 1];
    const tiny = 1e-9;
    const aboveDefault = added > 0 && (rise === null || rise > defaultRise + tiny);
    const noted = added > 0 && added >= minWholeSets - tiny && (rise === null || rise > noteAbove + tiny);
    weeks.push({ week: i + 1, from, to, added, rise, defaultRise, aboveDefault, noted });
  }
  return freeze({ weeks, accelerated: weeks.some((w) => w.aboveDefault), noted: weeks.filter((w) => w.noted).map((w) => w.week) });
}

/**
 * One group's whole-set stairway from start to the planned final target (CX-01: the target is reached; lambda may pass 1).
 * @param {{start:number, peak:number, rates:number[], weeksEarly?:number, noteAbove:number, minWholeSets?:number, numerics?:object}} input
 * @returns {{status:string, sets:number[], lambda:number|null, curveAccelerated:boolean, report:object, code?:string}}
 */
export function planStairway(input) {
  object(input, 'input');
  const { start, peak, rates } = input;
  integer(start, 'start'); integer(peak, 'peak');
  if (peak < start) throw new RangeError('peak must be >= start');
  const c = stairwayProgress({ start, peak, rates, numerics: input.numerics });
  const sets = c.progress ? arrivalSchedule({ start, peak, progress: c.progress, weeksEarly: input.weeksEarly }) : Array(rates.length + 1).fill(start);
  const report = accelerationReport({ sets, referenceRates: rates, noteAbove: input.noteAbove, minWholeSets: input.minWholeSets });
  return freeze({ status: c.status, sets, lambda: c.lambda, curveAccelerated: c.curveAccelerated, report, ...(c.code ? { code: c.code } : {}) });
}

/**
 * The curve of one group as a progress vector (0 in the first week ... 1 in the last): the 3 % / 5 % weights scaled by one lambda so
 * the curve runs from start to peak (solveEndpointCurve), or - a zero start, an all-zero weight vector, a numerical failure - the
 * whole sets spread evenly, the endpoint still reached (CX-01); a failure is reported, never hidden. `progress` is null when the
 * group does not grow.
 * @param {{start:number, peak:number, rates:number[], numerics?:object}} input
 * @returns {{status:string, progress:number[]|null, lambda:number|null, curveAccelerated:boolean, code?:string}}
 */
export function stairwayProgress(input) {
  object(input, 'input');
  const { start, peak, rates } = input;
  integer(start, 'start'); integer(peak, 'peak');
  const numerics = input.numerics || DEFAULT_NUMERICS;
  if (peak < start) throw new RangeError('peak must be >= start');
  if (peak === start || rates.length === 0) return { status: 'ok', progress: null, lambda: 0, curveAccelerated: false };
  const usable = start > 0 && rates.some((r) => r > 0);
  const curve = usable ? solveEndpointCurve({ start, peak, rates, numerics }) : null;
  if (curve && curve.status === 'ok') return { status: 'ok', progress: curve.progress.slice(), lambda: curve.lambda, curveAccelerated: curve.accelerated };
  const n = rates.length + 1;
  const progress = Array.from({ length: n }, (_, i) => (i === n - 1 ? 1 : i / (n - 1)));
  if (curve && curve.status === 'unresolved') return { status: 'unresolved_curve_linear_fallback', progress, lambda: null, curveAccelerated: false, code: curve.code };
  return { status: 'linear_fallback', progress, lambda: null, curveAccelerated: false, code: curve ? curve.code : (start === 0 ? 'zero_start' : 'no_positive_rate') };
}

/**
 * Engine 0.5.0, fix round 1 (R3-VOL-04 'about 3 % a week to halfway, about 5 % after'; R2-PER-03 / R2-PER-04 'like steps up a
 * stairway ... the last 4 weeks ... week by week'; R4-PRG-01 'reach it in the last week ... one week early is fine, never earlier';
 * the coach-eye reviews of samples 01 / 02 / 03 / 06 / 08: every group stepped in the same weeks, so the week's total sat flat and
 * then jumped, and every group took its last set in the final week).
 *
 * The whole-set schedules of ALL the groups of one block, fitted together. Each group still runs from its start to its final sets
 * on its own curve; what is shared is WHEN the whole sets land:
 *   - the week's total follows the sum of the groups' curves, rounded half up (never down);
 *   - the sets a week adds go to the groups that will be furthest behind their own curve (largest remainder, read one week
 *     ahead so a steep curve steps before it has to jump), one set at a time, a group that has not stepped this week first - the
 *     groups take turns instead of all stepping together;
 *   - a group is never a whole set or more behind its own curve;
 *   - a group stays at least one set under its final sets until the first week it may arrive (the last week, or `weeksEarly` weeks
 *     before it - 1 at most, R4-PRG-01), and at most half of the groups still climbing arrive a week early, so the last steps are
 *     shared between the last two weeks instead of landing in one;
 *   - `cap[g][w]` (optional) is the most a group can hold in a week; a schedule never passes it.
 * Pure arithmetic, deterministic: ties go to the group that waited longest for a set, then to the earlier group in `groups`.
 * @param {{groups:Array<{id:string, start:number, peak:number, progress:number[]|null, cap?:number[]}>, weeks:number, weeksEarly?:number}} input
 * @returns {{sets:Object<string,number[]>, total:number[]}} whole sets per group and week; first = start, last = peak (or the cap)
 */
export function staggerStairways(input) {
  object(input, 'input');
  const { groups, weeks } = input;
  const weeksEarly = input.weeksEarly === undefined ? 0 : input.weeksEarly;
  if (!Array.isArray(groups)) throw new TypeError('groups must be an array');
  integer(weeks, 'weeks'); integer(weeksEarly, 'weeksEarly');
  if (weeks < 1) throw new RangeError('weeks must be >= 1');
  if (weeksEarly > 1) throw new RangeError('weeksEarly must be 0 or 1 (R4-PRG-01: one week early at most)');
  const tiny = 1e-9;
  const firstArrival = Math.max(1, weeks - 1 - weeksEarly); // 0-based index of the first week a group may hold its final sets
  const G = groups.map((g, order) => {
    object(g, 'group');
    integer(g.start, 'start'); integer(g.peak, 'peak');
    if (g.peak < g.start) throw new RangeError('peak must be >= start');
    const grows = g.peak > g.start && weeks > 1;
    if (grows) { progressVector(g.progress, true); if (g.progress.length !== weeks) throw new RangeError('progress must give one value per week'); }
    if (g.cap !== undefined && (!Array.isArray(g.cap) || g.cap.length !== weeks)) throw new RangeError('cap must give one value per week');
    const h = g.peak - g.start;
    // the group's own curve. A group with a small climb (2 or 3 sets) would reach 'one set under the top' long before it may
    // arrive and then sit flat for weeks: until the first arrival week its curve is the same shape scaled to end one set under
    // the top in the week before, so its early steps are spread over the block instead
    const pre = grows && firstArrival >= 2 ? g.progress[firstArrival - 1] : 0;
    const scaled = grows && pre > 0 && h * pre > h - 1;
    const ideal = (w) => (!grows ? g.start : w < firstArrival && scaled ? g.start + (h - 1) * (g.progress[w] / pre) : g.start + h * g.progress[w]);
    return { id: g.id, order, start: g.start, peak: grows ? g.peak : g.start, grows, ideal, cap: g.cap || null, cur: g.start, waited: 0, out: [g.start] };
  });
  // the groups that arrive a week early are at most half of those still climbing: the last steps are shared between the last two weeks
  let earlyLeft = 0;
  const room = (g, w) => {
    let max = g.peak;
    if (g.grows && w < firstArrival) max = g.peak - 1;
    if (g.grows && w === firstArrival && w < weeks - 1 && earlyLeft <= 0) max = g.peak - 1;
    if (g.cap) max = Math.min(max, g.cap[w]);
    return Math.max(g.cur, max);
  };
  const total = [G.reduce((a, g) => a + g.cur, 0)];
  for (let w = 1; w < weeks; w += 1) {
    const last = w === weeks - 1;
    const stepped = new Set();
    if (w === firstArrival && w < weeks - 1) earlyLeft = Math.floor(G.filter((g) => g.grows && g.cur < g.peak).length / 2);
    const give = (g) => { g.cur += 1; stepped.add(g); if (g.grows && g.cur === g.peak && w === firstArrival && w < weeks - 1) earlyLeft -= 1; };
    // a group is never a whole set or more behind its own curve; in the last week every group arrives
    for (const g of G) while (g.cur < room(g, w) && (last ? g.cur < g.peak : g.ideal(w) - g.cur >= 1 - tiny)) give(g);
    // the week's total follows the sum of the curves; its sets go to the groups furthest behind their own curve
    const want = Math.floor(G.reduce((a, g) => a + g.ideal(w), 0) + 0.5 + tiny);
    for (let guard = 0; guard < 10000; guard += 1) {
      if (G.reduce((a, g) => a + g.cur, 0) >= want) break;
      const open = G.filter((g) => g.cur < room(g, w));
      if (!open.length) break;
      // (a group already half a set ahead of its curve takes no set just to fill the total; a group that has not stepped this week
      // goes first; then the group that will be furthest behind its curve next week - a steep curve steps before it has to jump)
      const ok = open.filter((g) => g.ideal(w) - g.cur > -0.5 + tiny);
      if (!ok.length) break;
      const next = Math.min(w + 1, weeks - 1);
      const need = (g) => Math.round((g.ideal(next) - g.cur) * 1e9) / 1e9;
      ok.sort((a, b) => ((stepped.has(a) ? 1 : 0) - (stepped.has(b) ? 1 : 0)) || (need(b) - need(a)) || (b.waited - a.waited) || (a.order - b.order));
      give(ok[0]);
    }
    for (const g of G) { g.waited = stepped.has(g) ? 0 : g.waited + 1; g.out.push(g.cur); }
    total.push(G.reduce((a, g) => a + g.cur, 0));
  }
  return freeze({ sets: Object.fromEntries(G.map((g) => [g.id, g.out])), total });
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
  if (grows && progress.length > 1 && progress[progress.length - 1] !== 1) {
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
    const prevWeeks = scheduled[index - 1].weeks;
    const previous = prevWeeks[prevWeeks.length - 1]; // (no Array.prototype.at: Safari < 15.4, G-311)
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
