// CX-01..04 reference math only: these checks do not certify production plans.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { advanceBlocks, planProgression, evaluatePrescription, applySetEdits } from '../../design/progression/prescription.mjs';
import { scheduleEpochs } from '../../design/progression/stairway.mjs';

const freeze = value => {
  if (value && typeof value === 'object') {
    for (const child of Object.values(value)) freeze(child);
    Object.freeze(value);
  }
  return value;
};
const blockInput = changes => ({ start: 10, ceiling: 20, absoluteCap: 30, blocks: 8,
  multiplier: { numerator: 105, denominator: 100 }, capIncrement: 1, ...changes });
const progression = changes => ({ sets: [3, 3, 3, 3, 3], repMin: 8, repMax: 10, startReps: 8,
  repStep: 1, allowLoadProgression: true, rir: [3, 3, 2, 2, 1], ...changes });
const item = (id, changes = {}) => ({ id, sets: 1, minSets: 0, maxSets: 10, reps: 8,
  minReps: 6, maxReps: 12, secondsPerRep: 2, restSeconds: 40, changeoverSeconds: 10,
  rir: 2, credits: { hips: 4 }, ...changes });
const day = (items, changes = {}) => ({ id: 'monday', limitSeconds: 1000, fixedSeconds: 60, items, pairs: [], ...changes });
const plan = (weeks, groups = [{ id: 'hips', minCredits: 0, maxCredits: 100 }]) => ({ groups, weeks: weeks.map(days => ({ days })) });
const codes = result => result.issues.map(issue => issue.code);

test('CX-03: next-block growth rounds after every block, not after a closed-form shortcut', () => {
  const input = freeze(blockInput());
  const result = advanceBlocks(input);
  assert.deepEqual(result.history.map(x => x.start), [11, 12, 13, 14, 15, 16, 17, 18]);
  assert.equal(result.start, 18);
  assert.equal(Math.round(10 * 1.05 ** 8), 15);
  assert.equal(result.ceiling, 28);
  assert.deepEqual(result, advanceBlocks(structuredClone(input)));
  assert.equal(input.start, 10);
});

test('CX-03: saturation refers to current ceiling, and long recurrences stay inside the absolute cap', () => {
  const result = advanceBlocks(blockInput({ start: 20, ceiling: 20, absoluteCap: 22, blocks: 10000 }));
  assert.equal(result.start, 22);
  assert.equal(result.ceiling, 22);
  assert.ok(result.history.every(x => x.start <= x.ceiling && x.ceiling <= 22));
  assert.ok(result.history.every(x => x.saturated));
  const current = advanceBlocks(blockInput({ start: 20, ceiling: 20, blocks: 0 }));
  assert.equal(current.saturated, true);
  assert.deepEqual(current.history, []);
  const capHold = advanceBlocks(blockInput({ start: 30, ceiling: 30, blocks: 20 }));
  assert.ok(capHold.history.every(x => x.start === 30 && x.ceiling === 30));
});

test('exact rational rounding handles ties and safe-integer-boundary multiplication', () => {
  const tie = advanceBlocks(blockInput({ start: 1, ceiling: 10, blocks: 3, multiplier: { numerator: 3, denominator: 2 }, capIncrement: 0 }));
  assert.deepEqual(tie.history.map(x => x.start), [2, 3, 5]);
  const max = Number.MAX_SAFE_INTEGER;
  const huge = advanceBlocks(blockInput({ start: max - 1, ceiling: max, absoluteCap: max, blocks: 2,
    multiplier: { numerator: max, denominator: max }, capIncrement: 1 }));
  assert.equal(huge.start, max - 1);
  assert.equal(huge.ceiling, max);
});

test('invalid imported block states and ambiguous multiplier controls are rejected', () => {
  for (const change of [
    { start: 21 }, { ceiling: 31 }, { blocks: 10001 }, { blocks: -1 }, { start: 1.5 },
    { capIncrement: -1 }, { multiplier: undefined }, { multiplier: { numerator: 1, denominator: 0 } },
    { multiplier: { numerator: 99, denominator: 100 } },
  ]) assert.throws(() => advanceBlocks(blockInput(change)));
});

test('CX-02: same-set weeks progress reps then conditionally request a relative load increment', () => {
  const input = freeze(progression());
  const result = planProgression(input);
  assert.equal(result.status, 'ok');
  assert.deepEqual(result.weeks.map(w => w.reps), [8, 9, 10, 8, 9]);
  assert.deepEqual(result.weeks.map(w => w.loadIndex), [0, 0, 0, 1, 1]);
  assert.deepEqual(result.weeks.map(w => w.action), ['start', 'reps', 'reps', 'load', 'reps']);
  assert.equal(result.weeks[3].conditional, true);
  assert.match(result.weeks[3].condition, /rir_and_technique/);
  assert.match(result.loadMeaning, /not_absolute_weight_or_guaranteed_performance/);
  assert.deepEqual(result, planProgression(structuredClone(input)));
});

test('set increases preserve prior reps/load, and rep steps stop exactly at the rep ceiling', () => {
  const result = planProgression(progression({ sets: [3, 3, 4, 4, 6], repStep: 2 }));
  assert.deepEqual(result.weeks.map(w => w.reps), [8, 10, 10, 8, 8]);
  assert.deepEqual(result.weeks.map(w => w.action), ['start', 'reps', 'sets', 'load', 'sets']);
  const clipped = planProgression(progression({ repStep: 5 }));
  assert.deepEqual(clipped.weeks.map(w => w.reps), [8, 10, 8, 10, 8]);
});

test('CX-02/03: unavailable reps/load progression remains unresolved even when RIR becomes harder', () => {
  const result = planProgression(progression({ startReps: 10, allowLoadProgression: false }));
  assert.equal(result.status, 'unresolved');
  assert.deepEqual(result.weeks.map(w => w.reps), [10, 10, 10, 10, 10]);
  assert.deepEqual(result.weeks.map(w => w.loadIndex), [0, 0, 0, 0, 0]);
  assert.equal(result.issues.length, 4);
  assert.ok(result.weeks.slice(1).every(w => w.action === 'unresolved'));
});

test('generated prescription rejects decreasing sets, easier RIR and missing explicit progression controls', () => {
  for (const change of [
    { sets: [3, 3, 2, 3, 3] }, { sets: [0, 1, 1, 1, 1] }, { rir: [3, 2, 3, 2, 1] },
    { rir: [3, 3, 2, 2, 0] }, { rir: [4, 3, 2, 2, 1] }, { repStep: 0 },
    { repMin: 11 }, { startReps: 20 }, { allowLoadProgression: undefined },
  ]) assert.throws(() => planProgression(progression(change)));
  assert.throws(() => planProgression(progression({ sets: [3, , 3, 3, 3] })));
  assert.throws(() => planProgression(progression({ rir: [3, , 2, 2, 1] })));
});

test('whole-week accounting retallies explicit quarter credits and paired time exactly', () => {
  const input = freeze(plan([[day([
    item('a', { sets: 3, credits: { hips: 4, back: 1 } }),
    item('b', { sets: 2, reps: 10, restSeconds: 30, changeoverSeconds: 20, credits: { back: 4 } }),
  ], { limitSeconds: 283, pairs: [{ a: 'a', b: 'b', changeoverSavingSeconds: 15 }] })]], [
    { id: 'hips', minCredits: 12, maxCredits: 12, targetCredits: 12 },
    { id: 'back', minCredits: 11, maxCredits: 11, targetCredits: 11 },
  ]));
  const result = evaluatePrescription(input);
  assert.equal(result.status, 'valid_subset');
  assert.equal(result.certified, false);
  assert.deepEqual(result.totals[0].credits, { hips: 12, back: 11 });
  assert.equal(result.totals[0].days[0].seconds, 283);
  assert.deepEqual(result, evaluatePrescription(structuredClone(input)));
  const withoutPair = structuredClone(input);
  withoutPair.weeks[0].days[0].pairs = [];
  assert.equal(evaluatePrescription(withoutPair).totals[0].days[0].seconds, 358);
  assert.ok(codes(evaluatePrescription(withoutPair)).includes('time_exceeded'));
});

test('inactive items charge no changeover and receive no pair-time saving', () => {
  const input = plan([[day([item('a', { sets: 0 }), item('b')], {
    pairs: [{ a: 'a', b: 'b', changeoverSavingSeconds: 20 }],
  })]]);
  assert.equal(evaluatePrescription(input).totals[0].days[0].seconds, 126);
});

test('paired changeover cancellation never produces negative time or depends on pair order', () => {
  const pairs = [{ a: 'c', b: 'd', changeoverSavingSeconds: 1 }, { a: 'a', b: 'b', changeoverSavingSeconds: 0.2 }];
  const items = ['a', 'b', 'c', 'd'].map((id, index) => item(id, {
    sets: 1, reps: 1, minReps: 1, secondsPerRep: 0, restSeconds: 0,
    changeoverSeconds: [0.1, 0.1, 1, 0][index],
  }));
  const results = [pairs, [...pairs].reverse()].map(order => evaluatePrescription(plan([[day(items, {
    pairs: order, fixedSeconds: 0, limitSeconds: 0,
  })]])));
  for (const result of results) {
    assert.equal(result.status, 'valid_subset');
    assert.equal(result.totals[0].days[0].seconds, 0);
    assert.equal(result.certified, false);
  }
  assert.deepEqual(results[0], results[1]);
});

test('every intermediate week is checked when epoch cost assumptions change', () => {
  const epochs = scheduleEpochs({ epochs: [
    { startSets: [1, 1], peakSets: [2, 2], progress: [0, 0.5, 1], rounding: 'floor' },
    { startSets: [2, 2], peakSets: [3, 3], progress: [0, 0.5, 1], rounding: 'floor' },
  ] });
  const input = plan(epochs.weeks.map((sets, w) => [day(sets.map((n, j) => item(`i${j}`, { sets: n })), {
    limitSeconds: 420, fixedSeconds: w === 3 ? 300 : 60,
  })]), [{ id: 'hips', minCredits: 8, maxCredits: 24, targetCredits: 24 }]);
  const result = evaluatePrescription(input);
  assert.equal(result.status, 'conflicts');
  assert.deepEqual(result.issues.filter(i => i.code === 'time_exceeded').map(i => i.week), [4]);
  assert.equal(result.totals.at(-1).days[0].seconds, 416);
  assert.equal(result.certified, false);
  input.weeks[3].days[0].fixedSeconds = 60;
  assert.equal(evaluatePrescription(input).status, 'valid_subset');
});

test('tiny exhaustive allocation reference distinguishes impossible time from one poor candidate', () => {
  const candidates = [];
  // Exhaustively enumerate this declared finite two-exercise space, independently of the validator.
  for (let a = 0; a <= 3; a++) for (let b = 0; b <= 3; b++) {
    if (4 * (a + b) === 12) candidates.push({ a, b, seconds: 10 * a + 20 * b });
  }
  assert.equal(Math.min(...candidates.map(x => x.seconds)), 30);
  for (const limitSeconds of [29, 30, 45, 60]) {
    let feasible = 0;
    for (const candidate of candidates) {
      const input = plan([[day([
        item('fast', { sets: candidate.a, maxSets: 3, reps: 1, minReps: 1, secondsPerRep: 10, restSeconds: 0, changeoverSeconds: 0 }),
        item('slow', { sets: candidate.b, maxSets: 3, reps: 1, minReps: 1, secondsPerRep: 20, restSeconds: 0, changeoverSeconds: 0 }),
      ], { limitSeconds, fixedSeconds: 0 })]], [{ id: 'hips', minCredits: 12, maxCredits: 12, targetCredits: 12 }]);
      const result = evaluatePrescription(input);
      assert.equal(result.status === 'valid_subset', candidate.seconds <= limitSeconds);
      assert.equal(result.totals[0].days[0].seconds, candidate.seconds);
      assert.equal(result.certified, false);
      assert.notEqual(result.status, 'infeasible');
      if (result.status === 'valid_subset') feasible++;
    }
    assert.equal(feasible, candidates.filter(x => x.seconds <= limitSeconds).length);
    if (limitSeconds === 29) assert.equal(feasible, 0);
    if (limitSeconds === 30) assert.equal(feasible, 1);
  }
});

test('item, group and endpoint violations stay distinct and carry their week', () => {
  const input = plan([[day([item('a', { sets: 3 })])], [day([item('a', { sets: 2, maxSets: 1, reps: 20, rir: 0 })])]], [
    { id: 'hips', minCredits: 10, maxCredits: 11, targetCredits: 10 },
  ]);
  const result = evaluatePrescription(input);
  for (const code of ['credits_above_max', 'credits_below_min', 'credits_decreased', 'endpoint_mismatch', 'sets_above_max', 'reps_above_max', 'rir_outside_band']) {
    assert.ok(codes(result).includes(code), code);
  }
  assert.ok(result.issues.every(i => Number.isInteger(i.week)));
});

test('aggregate credit growth cannot conceal a dropped logical slot or easier RIR', () => {
  const input = plan([
    [day([item('a', { sets: 3 }), item('b'), item('c')])],
    [day([item('a', { sets: 2, rir: 3 }), item('b', { sets: 4 })])],
  ]);
  const result = evaluatePrescription(input);
  assert.deepEqual(result.totals.map(w => w.credits.hips), [20, 24]);
  for (const code of ['item_sets_decreased', 'item_removed', 'rir_increased']) assert.ok(codes(result).includes(code));
  assert.equal(result.status, 'conflicts');
});

test('optional-day credits count for ceilings and endpoint but cannot replace a main-day floor', () => {
  const input = plan([[
    day([item('main', { sets: 2 })]),
    day([item('bonus', { sets: 2 })], { id: 'optional', optional: true }),
  ]], [{ id: 'hips', minCredits: 12, maxCredits: 16, targetCredits: 16, maxDailyCredits: 8 }]);
  const result = evaluatePrescription(input);
  assert.deepEqual(result.totals[0].credits, { hips: 16 });
  assert.deepEqual(result.totals[0].mainCredits, { hips: 8 });
  assert.deepEqual(result.totals[0].days.map(d => d.credits.hips), [8, 8]);
  assert.deepEqual(codes(result), ['credits_below_min']);
  input.weeks[0].days[0].items[0].sets = 3;
  input.weeks[0].days[1].items[0].sets = 1;
  const daily = evaluatePrescription(input);
  assert.deepEqual(codes(daily), ['daily_credits_above_max']);
  input.groups[0].maxDailyCredits = 12;
  assert.equal(evaluatePrescription(input).status, 'valid_subset');
  input.weeks[0].days[1].optional = 'yes';
  assert.throws(() => evaluatePrescription(input));
});

test('optional relabeling cannot conceal a decrease in main-day work', () => {
  const input = plan([
    [day([item('a', { sets: 3 })])],
    [day([item('a', { sets: 4 })], { optional: true })],
  ]);
  const result = evaluatePrescription(input);
  assert.deepEqual(result.totals.map(w => w.credits.hips), [12, 16]);
  assert.ok(codes(result).includes('main_credits_decreased'));
});

test('malformed pairings, duplicate identities, reserved IDs and unsafe arithmetic are rejected', () => {
  const base = plan([[day([item('a'), item('b'), item('c')])]]);
  const mutations = [
    p => { p.weeks[0].days[0].pairs = [{ a: 'a', b: 'a', changeoverSavingSeconds: 0 }]; },
    p => { p.weeks[0].days[0].pairs = [{ a: 'a', b: 'missing', changeoverSavingSeconds: 0 }]; },
    p => { p.weeks[0].days[0].pairs = [{ a: 'a', b: 'b', changeoverSavingSeconds: 21 }]; },
    p => { p.weeks[0].days[0].pairs = [{ a: 'a', b: 'b', changeoverSavingSeconds: 0 }, { a: 'b', b: 'c', changeoverSavingSeconds: 0 }]; },
    p => { p.weeks[0].days[0].items[1].id = 'a'; },
    p => { p.groups[0].id = 'constructor'; },
    p => { p.groups[0].id = '__proto__'; },
    p => { p.weeks[0].days[0].id = 'prototype'; },
    p => { p.weeks[0].days[0].items[0].credits = JSON.parse('{"__proto__":4}'); },
    p => { p.weeks[0].days[0].items[0].credits.hips = 5; },
    p => { p.weeks[0].days[0].items[0].secondsPerRep = Number.MAX_VALUE; },
    p => { p.weeks[0].days[0].items[0].sets = Number.MAX_SAFE_INTEGER; },
  ];
  for (const mutate of mutations) {
    const input = structuredClone(base);
    mutate(input);
    assert.throws(() => evaluatePrescription(input));
  }
});

test('CX-04: human edits are preserved even when they violate bounds, time or monotonicity', () => {
  const input = plan([[day([item('a', { sets: 2 })], { limitSeconds: 200 })], [day([item('a', { sets: 3 })])]], [
    { id: 'hips', minCredits: 8, maxCredits: 12, targetCredits: 12 },
  ]);
  input.validation = { status: 'old_pass' };
  input.certificate = { certified: true };
  freeze(input);
  const result = applySetEdits(input, freeze([{ week: 1, dayId: 'monday', itemId: 'a', sets: 12 }]));
  assert.equal(result.plan.weeks[0].days[0].items[0].sets, 12);
  assert.equal(input.weeks[0].days[0].items[0].sets, 2);
  assert.deepEqual(result.plan.weeks[1], input.weeks[1]);
  assert.equal(result.plan.validation, undefined);
  assert.equal(result.plan.certificate, undefined);
  assert.equal(result.edited, true);
  assert.equal(result.priorValidationDiscarded, true);
  assert.equal(result.validation.status, 'conflicts');
  assert.equal(result.validation.certified, false);
  for (const code of ['sets_above_max', 'time_exceeded', 'credits_above_max', 'credits_decreased']) {
    assert.ok(codes(result.validation).includes(code), code);
  }
});

test('empty edits still discard old certificates and recompute; duplicate or unknown coordinates reject', () => {
  const input = plan([[day([item('a')])]]);
  input.certificate = { certified: true };
  const untouched = applySetEdits(input, []);
  assert.notEqual(untouched.plan, input);
  assert.equal(untouched.plan.certificate, undefined);
  assert.equal(untouched.validation.certified, false);
  assert.deepEqual(untouched.validation, evaluatePrescription(input));
  const edit = { week: 1, dayId: 'monday', itemId: 'a', sets: 2 };
  for (const edits of [[edit, edit], [{ ...edit, week: 2 }], [{ ...edit, itemId: 'missing' }], [{ ...edit, sets: -1 }]]) {
    assert.throws(() => applySetEdits(input, edits));
  }
});

test('CX-04: edits discard nested approval labels but preserve identically named credit groups', () => {
  const labels = ['validation', 'certificate', 'certified', 'status'];
  const credits = Object.fromEntries(labels.map(key => [key, 4]));
  const input = plan([[day([item('a', { credits })])]], labels.map(id => ({
    id, minCredits: 0, maxCredits: 8, targetCredits: 8,
  })));
  const scopes = [input, input.weeks[0], input.weeks[0].days[0], input.weeks[0].days[0].items[0]];
  for (const scope of scopes) Object.assign(scope, {
    validation: { status: 'old_pass' }, certificate: { certified: true }, certified: true, status: 'approved',
  });
  freeze(input);
  const result = applySetEdits(input, [{ week: 1, dayId: 'monday', itemId: 'a', sets: 2 }]);
  const nextScopes = [result.plan, result.plan.weeks[0], result.plan.weeks[0].days[0], result.plan.weeks[0].days[0].items[0]];
  for (const scope of nextScopes) for (const label of labels) assert.equal(Object.hasOwn(scope, label), false);
  for (const scope of scopes) for (const label of labels) assert.equal(Object.hasOwn(scope, label), true);
  assert.deepEqual(result.plan.weeks[0].days[0].items[0].credits, credits);
  assert.deepEqual(result.validation.totals[0].credits, Object.fromEntries(labels.map(key => [key, 8])));
  assert.equal(result.validation.status, 'valid_subset');
  assert.equal(result.validation.certified, false);
});
