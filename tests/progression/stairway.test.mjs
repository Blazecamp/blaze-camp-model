// CX-01..03 math checks for the isolated design module, not runtime-plan validation.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { solveEndpointCurve, scheduleNestedSets, scheduleEpochs, scheduleGroupPrefixes } from '../../design/progression/stairway.mjs';

const NUMERICS = Object.freeze({ logTolerance: 1e-12, maxIterations: 160, maxBracketDoublings: 80 });
const ratesFor = weeks => Array.from({ length: weeks - 1 }, (_, i) => i + 2 <= weeks / 2 ? 0.03 : 0.05);
const curve = (start, peak, weeks, extra = {}) => solveEndpointCurve({ start, peak, rates: ratesFor(weeks), numerics: NUMERICS, ...extra });
const close = (actual, expected, tolerance = 1e-10) => assert.ok(
  Math.abs(actual - expected) <= tolerance * Math.max(Math.abs(expected), Number.MIN_VALUE),
  `${actual} differs from ${expected}`,
);
const freeze = value => {
  if (value && typeof value === 'object') {
    for (const child of Object.values(value)) freeze(child);
    Object.freeze(value);
  }
  return value;
};
const random = seed => () => {
  seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
  return seed;
};

// Enumerate whole paths independently; there is no interpolation or production helper here.
function monotonePaths(start, peak, weeks) {
  const paths = [];
  const visit = path => {
    if (path.length === weeks - 1) { paths.push([...path, peak]); return; }
    for (let next = path.at(-1); next <= peak; next++) visit([...path, next]);
  };
  visit([start]);
  return paths;
}

for (const [weeks, start, peak] of [[6, 3, 4], [12, 12, 22], [12, 15, 22]]) {
  test(`CX-01: ${weeks} weeks ${start}->${peak} calibrates to the exact endpoint`, () => {
    const rates = ratesFor(weeks);
    const result = curve(start, peak, weeks);
    assert.equal(result.status, 'ok');
    const needsAcceleration = rates.reduce((v, rate) => v * (1 + rate), start) < peak;
    assert.equal(result.lambda > 1, needsAcceleration);
    assert.equal(result.accelerated, needsAcceleration);
    assert.equal(result.values.length, weeks);
    assert.equal(result.values[0], start);
    assert.equal(result.values.at(-1), peak);
    close(result.referencePeak, rates.reduce((v, rate) => v * (1 + rate), start));
    assert.equal(result.referencePeak < peak, needsAcceleration);
    // Check the unpinned mathematical endpoint, not only the displayed last value.
    close(rates.reduce((v, rate) => v * (1 + result.lambda * rate), start), peak);
    assert.ok(Math.abs(result.endpointLogResidual) <= NUMERICS.logTolerance * 2);
    assert.equal(result.progress[0], 0);
    assert.equal(result.progress.at(-1), 1);
    for (let i = 1; i < weeks; i++) {
      assert.ok(result.values[i] >= result.values[i - 1]);
      assert.ok(result.progress[i] >= result.progress[i - 1]);
      close(result.values[i], result.values[i - 1] * (1 + result.lambda * rates[i - 1]));
    }
  });
}

test('CX-03: starts at the ceiling have no division by zero or required set increase', () => {
  for (const start of [0, 3, 25]) {
    const result = curve(start, start, 12);
    assert.equal(result.status, 'ok');
    assert.equal(result.lambda, 0);
    assert.equal(result.accelerated, false);
    assert.deepEqual(result.values, Array(12).fill(start));
    assert.ok(result.progress.every(Number.isFinite));
    const scheduled = scheduleNestedSets({ startSets: [start], peakSets: [start], progress: result.progress, rounding: 'floor' });
    assert.equal(scheduled.status, 'ok');
    assert.deepEqual(scheduled.weeks, Array.from({ length: 12 }, () => [start]));
  }
});

test('approved 15->22 example retains its last four integer weeks', () => {
  const result = scheduleNestedSets({ startSets: [15], peakSets: [22], progress: curve(15, 22, 12).progress, rounding: 'half_up' });
  assert.deepEqual(result.weeks.slice(-4), [[19], [20], [21], [22]]);
});

test('CX-01/03: half-up 6-week 3->4 may reach the ceiling early and then hold it', () => {
  const result = scheduleNestedSets({ startSets: [3], peakSets: [4], progress: curve(3, 4, 6).progress, rounding: 'half_up' });
  assert.equal(result.status, 'ok');
  const firstArrival = result.weeks.findIndex(week => week[0] === 4);
  assert.ok(firstArrival > 0 && firstArrival < result.weeks.length - 1);
  assert.ok(result.weeks.slice(firstArrival).every(week => week[0] === 4));
  assert.equal(result.weeks.at(-1)[0], 4);
  assert.ok(result.deltas.slice(firstArrival).every(delta => delta[0] === 0));
});

test('binary-exact quantization stays correct near the safe integer boundary', () => {
  const maximum = Number.MAX_SAFE_INTEGER;
  const floor = scheduleNestedSets({ startSets: [0], peakSets: [maximum], progress: [0, 0.5, 1], rounding: 'floor' });
  const halfUp = scheduleNestedSets({ startSets: [0], peakSets: [maximum], progress: [0, 0.5, 1], rounding: 'half_up' });
  assert.equal(floor.weeks[1][0], 4503599627370495);
  assert.equal(halfUp.weeks[1][0], 4503599627370496);
  assert.throws(() => scheduleNestedSets({ startSets: [0, 0], peakSets: [maximum, 1], progress: [0, 1], rounding: 'floor' }));
});

const prefixGroup = overrides => ({ id: 'hips', startSets: [1, 1], peakSets: [4, 4], progress: [0, 0.5, 1], optionalDays: [false, false], nextDayIndex: 0, ...overrides });

test('group prefixes quantize aggregate additions then alternate main-day placements', () => {
  const result = scheduleGroupPrefixes({ groups: [prefixGroup()], rounding: 'half_up', maxAdditions: 6 });
  assert.equal(result.status, 'ok');
  assert.deepEqual(result.groups[0].addSequence, [0, 1, 0, 1, 0, 1]);
  assert.deepEqual(result.groups[0].cumulativeAdds, [0, 3, 6]);
  assert.deepEqual(result.weeks, [[1, 1], [3, 2], [4, 4]]);
  assert.deepEqual(result.totalDeltas, [3, 3]);
  assert.equal(result.groups[0].finalNextDayIndex, 0);
});

test('group prefix tie hierarchy is additions, main day, then carried cyclic position', () => {
  const group = prefixGroup({ startSets: [0, 0, 0], peakSets: [1, 3, 3], optionalDays: [true, false, false], nextDayIndex: 2 });
  const result = scheduleGroupPrefixes({ groups: [group], rounding: 'floor', maxAdditions: 7 });
  assert.deepEqual(result.groups[0].addSequence, [2, 1, 0, 1, 2, 1, 2]);
  assert.deepEqual(result.weeks.at(-1), [1, 3, 3]);
  const nextEpoch = scheduleGroupPrefixes({ groups: [prefixGroup({ startSets: [4, 4], peakSets: [5, 5], nextDayIndex: 1 })], rounding: 'floor', maxAdditions: 2 });
  assert.deepEqual(nextEpoch.groups[0].addSequence, [1, 0]);
});

test('group prefix budgets, nonnested endpoints and malformed inputs do not manufacture feasibility claims', () => {
  const input = { groups: [prefixGroup()], rounding: 'floor', maxAdditions: 5 };
  const result = scheduleGroupPrefixes(input);
  assert.equal(result.status, 'unresolved');
  assert.equal(result.scope, 'group_prefix_construction');
  assert.equal(result.code, 'addition_budget');
  const unsupported = scheduleGroupPrefixes({ ...input, groups: [prefixGroup({ startSets: [5, 1] })] });
  assert.equal(unsupported.status, 'unsupported');
  for (const change of [
    { groups: [] }, { maxAdditions: -1 }, { maxAdditions: undefined },
    { groups: [prefixGroup({ optionalDays: [true] })] },
    { groups: [prefixGroup({ nextDayIndex: 2 })] },
    { groups: [prefixGroup(), prefixGroup()] },
    { groups: [prefixGroup(), prefixGroup({ id: 'back', progress: [0, 1] })] },
  ]) assert.throws(() => scheduleGroupPrefixes({ ...input, ...change }));
});

test('fixed-seed prefixes conserve every group total and every add-sequence prefix', () => {
  const next = random(0x43585046);
  for (let i = 0; i < 100; i++) {
    const groups = Array.from({ length: 1 + next() % 3 }, (_, g) => {
      const startSets = Array.from({ length: 1 + next() % 4 }, () => next() % 4);
      return prefixGroup({ id: `g${g}`, startSets, peakSets: startSets.map(s => s + next() % 4),
        progress: [0, 0.25, 0.5, 0.75, 1], optionalDays: startSets.map(() => !!(next() % 2)), nextDayIndex: next() % startSets.length });
    });
    const input = freeze({ groups, rounding: 'half_up', maxAdditions: 100 });
    const result = scheduleGroupPrefixes(input);
    assert.equal(result.status, 'ok');
    assert.deepEqual(result, scheduleGroupPrefixes(structuredClone(input)));
    assert.ok(Object.isFrozen(result.weeks[0]));
    result.groups.forEach((facts, g) => {
      const group = groups[g];
      const delta = group.peakSets.reduce((sum, n, j) => sum + n - group.startSets[j], 0);
      const base = group.startSets.reduce((sum, n) => sum + n, 0);
      facts.cumulativeAdds.forEach((count, w) => {
        // Dyadic quarter points have exact small-number arithmetic, independent of production quantization.
        assert.equal(count, Math.floor(delta * group.progress[w] + 0.5));
        const reconstructed = [...group.startSets];
        for (const day of facts.addSequence.slice(0, count)) reconstructed[day]++;
        assert.deepEqual(result.weeks[w].slice(facts.offset, facts.offset + facts.width), reconstructed);
        assert.equal(facts.totals[w], base + count);
      });
      assert.deepEqual(result.weeks.at(-1).slice(facts.offset, facts.offset + facts.width), group.peakSets);
    });
  }
});

test('CX-03: inconsistent imported starts are not silently clamped or certified', () => {
  const result = curve(26, 25, 12);
  assert.equal(result.status, 'unreachable');
  assert.equal(result.scope, 'multiplicative_curve');
  assert.equal(result.code, 'peak_below_start');
  const scheduled = scheduleNestedSets({ startSets: [4, 2], peakSets: [3, 3], progress: [0, 1], rounding: 'floor' });
  assert.equal(scheduled.status, 'unsupported');
  assert.equal(scheduled.scope, 'nested_construction');
  assert.equal(scheduled.code, 'non_nested_endpoints');
});

test('curve-only reachability failures are scoped, not whole-program infeasibility claims', () => {
  for (const input of [
    { start: 0, peak: 3, rates: [0.03, 0.05] },
    { start: 3, peak: 4, rates: [] },
    { start: 3, peak: 4, rates: [0, 0] },
  ]) {
    const result = solveEndpointCurve({ ...input, numerics: NUMERICS });
    assert.equal(result.status, 'unreachable');
    assert.equal(result.scope, 'multiplicative_curve');
  }
  const single = solveEndpointCurve({ start: 3, peak: 3, rates: [], numerics: NUMERICS });
  assert.equal(single.status, 'ok');
  assert.deepEqual(single.values, [3]);
});

test('numerical limits return unresolved rather than a fabricated endpoint', () => {
  for (const numerics of [
    { ...NUMERICS, maxIterations: 0 },
    { ...NUMERICS, maxBracketDoublings: 0 },
  ]) {
    const result = curve(12, 22, 12, { numerics });
    assert.equal(result.status, 'unresolved');
    assert.notEqual(result.status, 'unreachable');
  }
});

test('floating-point scale and decimal representation do not undermine endpoint identity', () => {
  for (const [start, peak] of [[1e-200, 2e-200], [1e200, 2e200], [1e308, 1.7e308]]) {
    const result = solveEndpointCurve({ start, peak, rates: [1, 1], numerics: NUMERICS });
    assert.equal(result.status, 'ok');
    assert.ok(result.values.every(Number.isFinite));
    assert.equal(result.values.at(-1), peak);
    close((1 + result.lambda) ** 2, peak / start);
  }
  const a = solveEndpointCurve({ start: 1, peak: 2, rates: [0.1 + 0.2, 0.05], numerics: NUMERICS });
  const b = solveEndpointCurve({ start: 1, peak: 2, rates: [0.3, 0.05], numerics: NUMERICS });
  close(a.lambda, b.lambda);
  const overflow = solveEndpointCurve({ start: 1e308, peak: 1.7e308, rates: [1, 1], numerics: NUMERICS });
  assert.equal(overflow.referencePeak, null);
});

test('tiny positive headroom uses relative growth precision rather than merely pinning the endpoint', () => {
  for (const [start, peak] of [[1, 1 + Number.EPSILON], [Number.MAX_SAFE_INTEGER - 1, Number.MAX_SAFE_INTEGER]]) {
    const result = solveEndpointCurve({ start, peak, rates: [0.03], numerics: NUMERICS });
    assert.equal(result.status, 'ok');
    // For one transition the exact mathematical solution is available independently.
    close(result.lambda, ((peak - start) / start) / 0.03, 1e-10);
    assert.ok(result.effectiveLogTolerance < NUMERICS.logTolerance);
    assert.ok(Math.abs(result.endpointLogResidual) <= result.effectiveLogTolerance);
    assert.equal(result.values.at(-1), peak);
  }
  const underflow = solveEndpointCurve({ start: 1, peak: 1 + Number.EPSILON, rates: [0.03],
    numerics: { ...NUMERICS, logTolerance: Number.MIN_VALUE } });
  assert.equal(underflow.status, 'unresolved');
  assert.equal(underflow.code, 'tolerance_underflow');
});

test('extreme dynamic range preserves interior curve values even when normalized progress underflows', () => {
  const result = solveEndpointCurve({ start: 1e-300, peak: 1e300, rates: [1, 1, 1, 1],
    numerics: { ...NUMERICS, maxBracketDoublings: 1024 } });
  assert.equal(result.status, 'ok');
  assert.ok(result.values.every(Number.isFinite));
  assert.equal(result.progress[1], 0);
  assert.ok(result.values[1] > 1e-300);
  for (let week = 0; week < result.values.length; week++) {
    const independentLog = Math.log(1e-300) + week * Math.log1p(result.lambda);
    assert.ok(Math.abs(Math.log(result.values[week]) - independentLog) < 1e-8);
    if (week) assert.ok(result.values[week] >= result.values[week - 1]);
  }
});

test('sparse arrays never pass as fully specified curve or schedule inputs', () => {
  const hole = Array(2);
  const endpointHole = [1, , 3];
  const progressHole = [0, , 1];
  assert.throws(() => solveEndpointCurve({ start: 1, peak: 2, rates: hole, numerics: NUMERICS }));
  assert.throws(() => scheduleNestedSets({ startSets: endpointHole, peakSets: [2, 3, 4], progress: [0, 1], rounding: 'floor' }));
  assert.throws(() => scheduleNestedSets({ startSets: [1], peakSets: [3], progress: progressHole, rounding: 'floor' }));
  assert.throws(() => scheduleGroupPrefixes({ groups: [prefixGroup({ optionalDays: hole })], rounding: 'floor', maxAdditions: 10 }));
});

test('curve inputs remain immutable and repeated fixed-seed cases are identical', () => {
  const next = random(0x43583031);
  for (let i = 0; i < 100; i++) {
    const start = 1 + next() % 30;
    const peak = start + next() % 100;
    const weeks = 2 + next() % 11;
    const input = freeze({ start, peak, rates: Array.from({ length: weeks - 1 }, () => (1 + next() % 8) / 100), numerics: { ...NUMERICS } });
    const before = structuredClone(input);
    const a = solveEndpointCurve(input);
    assert.equal(a.status, 'ok');
    assert.deepEqual(a, solveEndpointCurve(structuredClone(input)));
    assert.deepEqual(input, before);
    assert.ok(Object.isFrozen(a));
    assert.ok(Object.isFrozen(a.values));
    assert.ok(Object.isFrozen(a.progress));
    close(input.rates.reduce((v, rate) => v * (1 + a.lambda * rate), start), peak);
  }
});

test('invalid curves reject malformed numerical controls and nonphysical values', () => {
  const valid = { start: 3, peak: 4, rates: [0.03], numerics: NUMERICS };
  for (const change of [
    { start: -1 }, { peak: Infinity }, { start: NaN }, { rates: [-0.01] },
    { rates: [NaN] }, { rates: '0.03' }, { numerics: undefined },
    { numerics: { ...NUMERICS, logTolerance: 0 } },
    { numerics: { ...NUMERICS, maxIterations: 0.5 } },
    { numerics: { ...NUMERICS, maxBracketDoublings: -1 } },
  ]) assert.throws(() => solveEndpointCurve({ ...valid, ...change }));
});

test('CX-01: integer schedules can add multiple sets per group in one transition', () => {
  const result = scheduleNestedSets({ startSets: [1, 2], peakSets: [7, 8], progress: [0, 0.5, 1], rounding: 'floor' });
  assert.equal(result.status, 'ok');
  assert.deepEqual(result.weeks, [[1, 2], [4, 5], [7, 8]]);
  assert.deepEqual(result.deltas, [[3, 3], [3, 3]]);
  assert.deepEqual(result.totalSets, [3, 9, 15]);
  assert.deepEqual(result.totalDeltas, [6, 6]);
  close(result.totalRiseFractions[0], 2);
  close(result.totalRiseFractions[1], 2 / 3);
});

test('rounding is explicit and zero-base rises never masquerade as a finite percentage', () => {
  const input = { startSets: [0, 3], peakSets: [1, 4], progress: [0, 0.5, 1] };
  const floor = scheduleNestedSets({ ...input, rounding: 'floor' });
  const halfUp = scheduleNestedSets({ ...input, rounding: 'half_up' });
  assert.deepEqual(floor.weeks, [[0, 3], [0, 3], [1, 4]]);
  assert.deepEqual(halfUp.weeks, [[0, 3], [1, 4], [1, 4]]);
  assert.ok(halfUp.zeroBaseIncreases.length > 0);
  assert.ok(halfUp.riseFractions.flat().includes(null));
  assert.throws(() => scheduleNestedSets(input));
});

test('tiny exhaustive reference: every nested candidate belongs to the full monotone integer path space', () => {
  for (let weeks = 2; weeks <= 5; weeks++) for (let start = 0; start <= 2; start++) for (let peak = start; peak <= 4; peak++) {
    const legal = new Set(monotonePaths(start, peak, weeks).map(JSON.stringify));
    const progress = Array.from({ length: weeks }, (_, i) => i / (weeks - 1));
    for (const rounding of ['floor', 'half_up']) {
      const result = scheduleNestedSets({ startSets: [start], peakSets: [peak], progress, rounding });
      assert.equal(result.status, 'ok');
      assert.ok(legal.has(JSON.stringify(result.weeks.map(w => w[0]))));
      assert.equal(result.weeks.at(-1)[0], peak);
    }
  }
});

test('nested schedule fixed-seed properties, immutable inputs and deterministic frozen results', () => {
  const next = random(0x43583032);
  for (let i = 0; i < 100; i++) {
    const startSets = Array.from({ length: 1 + next() % 4 }, () => next() % 8);
    const peakSets = startSets.map(start => start + next() % 20);
    const progress = [0, ...Array.from({ length: next() % 6 }, () => (next() % 1000) / 1000).sort((a, b) => a - b), 1];
    const input = freeze({ startSets, peakSets, progress, rounding: i % 2 ? 'floor' : 'half_up' });
    const before = structuredClone(input);
    const result = scheduleNestedSets(input);
    assert.equal(result.status, 'ok');
    assert.deepEqual(result, scheduleNestedSets(structuredClone(input)));
    assert.deepEqual(input, before);
    assert.ok(Object.isFrozen(result));
    assert.ok(Object.isFrozen(result.weeks));
    result.weeks.forEach((sets, w) => sets.forEach((count, j) => {
      assert.ok(Number.isSafeInteger(count));
      assert.ok(count >= startSets[j] && count <= peakSets[j]);
      assert.ok(Object.isFrozen(sets));
      if (w) assert.ok(count >= result.weeks[w - 1][j]);
    }));
  }
});

test('malformed nested schedule inputs never receive a success result', () => {
  const valid = { startSets: [1], peakSets: [3], progress: [0, 0.5, 1], rounding: 'floor' };
  for (const change of [
    { startSets: [1.5] }, { startSets: [-1] }, { peakSets: [Number.MAX_SAFE_INTEGER + 1] },
    { peakSets: [2, 3] }, { progress: [0, 0.8, 0.4, 1] }, { progress: [0, 2] },
    { progress: [0.1, 1] }, { progress: [0, 0.9] }, { rounding: 'nearest_even' },
  ]) assert.throws(() => scheduleNestedSets({ ...valid, ...change }));
});

test('epoch joins preserve the exact shared boundary without duplicating it', () => {
  const input = freeze({ epochs: [
    { startSets: [1, 2], peakSets: [3, 4], progress: [0, 0.5, 1], rounding: 'floor' },
    { startSets: [3, 4], peakSets: [5, 4], progress: [0, 0.5, 1], rounding: 'floor' },
  ] });
  const result = scheduleEpochs(input);
  assert.equal(result.status, 'ok');
  assert.deepEqual(result.weeks, [[1, 2], [2, 3], [3, 4], [4, 4], [5, 4]]);
  assert.deepEqual(result, scheduleEpochs(structuredClone(input)));
  assert.ok(Object.isFrozen(result));
});

test('epoch boundary mismatch cannot silently splice incompatible prescriptions', () => {
  const result = scheduleEpochs({ epochs: [
    { startSets: [1], peakSets: [3], progress: [0, 1], rounding: 'floor' },
    { startSets: [2], peakSets: [4], progress: [0, 1], rounding: 'floor' },
  ] });
  assert.notEqual(result.status, 'ok');
  assert.notEqual(result.status, 'infeasible');
});
