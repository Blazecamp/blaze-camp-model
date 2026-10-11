// Execute workflow control flow with in-memory agents; never launch a build or generate plans.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('../../', import.meta.url));
const SOURCE = fs.readFileSync(new URL('../../workflows/planner_build.js', import.meta.url), 'utf8');
const AsyncFunction = Object.getPrototypeOf(async function () {}).constructor;
assert.match(SOURCE, /^export const meta\s*=/);
const execute = new AsyncFunction('args', 'agent', 'parallel', 'phase', 'log', SOURCE.replace(/^export const meta\s*=/, 'const meta ='));
const FINGERPRINT = 'a'.repeat(64);

const report = (changes = {}) => ({
  status: 'pass', files_written: [], summary: ['Mock implementation complete'],
  tests: { commands: ['node --test tests/plan/mock.test.mjs'], failed: 0 },
  open_issues: [], ...changes,
});
const review = (changes = {}) => ({ verdict: 'pass', fixes: [], open_issues: [], ...changes });
const grade = (changes = {}) => ({ grade: 'A', source_fingerprint: FINGERPRINT, trained_groups: ['hips', 'quads'], violations: [], praise: [], ...changes });
const violation = (severity) => ({
  where: 'week 1', problem: 'Mock unresolved coaching issue', rule: 'R3-SES-02',
  severity, engine_fix_hint: 'Resolve the underlying constraint',
});
const GATE_IDS = [
  'authority', 'contracts', 'default_engine', 'legacy_output', 'unit_tests',
  'benchmark', 'grid', 'sweep', 'random', 'certification', 'determinism',
  'performance', 'review_regressions',
];
const gate = (changes = {}) => ({
  passed: true, source_fingerprint: FINGERPRINT, reviewed_source_fingerprint: FINGERPRINT,
  checks: [...GATE_IDS, 'coach_review'].map(id => ({ id, passed: true })),
  failures: [], defaults_used: [], ...changes,
});
// Hypothetical authorization data, consumed only by mocked read-only verification.
const APPROVAL = {
  explicitly_authorized: true, approval_reference: 'test-fixtures/human-promotion-approval.md',
  approved_decisions: ['D1', 'D4', 'D13'],
};
const approvedArgs = () => ({ promotion_approval: structuredClone(APPROVAL) });
const defaults = (call) => {
  const properties = call.schema?.properties ?? {};
  if ('ready' in properties) return {
    ready: true, policy_reconciled: true, branch: 'planner-build',
    implementation_ready: true, reconciliation_status: 'reconciled',
    source_fingerprint: FINGERPRINT, unresolved: [],
  };
  if ('authorized' in properties) return {
    authorized: true, approval_reference: APPROVAL.approval_reference,
    approved_decisions: [...APPROVAL.approved_decisions],
    source_fingerprint: FINGERPRINT, unresolved: [],
  };
  if ('passed' in properties) return call.label === 'gate: post-promotion verification'
    ? gate({ checks: [...GATE_IDS.filter(id => id !== 'legacy_output'), 'published_equivalence', 'coach_review'].map(id => ({ id, passed: true })) })
    : gate();
  if ('verdict' in properties) return review();
  if ('grade' in properties) return grade();
  return report();
};
const isPackage = call => /^WP-\d+ (implement|review)/.test(call.label);
const isMigration = call => /^WP-21\b/.test(call.label);
const isCoaching = call => /^coach review r\d+:/.test(call.label);
const coachingRound = call => Number(call.label.match(/^coach review r(\d+):/)?.[1]);
const noMigration = run => assert.equal(run.calls.some(isMigration), false, 'must not invoke migration');
const blocked = run => {
  assert.equal(run.error, undefined, 'workflow must return a structured failure');
  assert.equal(run.value?.status, 'blocked');
  noMigration(run);
};

async function runWorkflow({ args = {}, respond, defaultResponse = defaults } = {}) {
  const calls = [];
  const active = new Set();
  const pending = [];
  const phases = [];
  const logs = [];
  const agent = (prompt, options) => {
    assert.ok(calls.length < 500, 'workflow exceeded the bounded mock call budget');
    const call = { prompt, ...options, activeAtStart: [...active].map(c => c.label) };
    calls.push(call);
    active.add(call);
    const task = (async () => {
      try {
        // Let concurrently scheduled package agents overlap, exposing missing writer barriers.
        await new Promise(resolve => setImmediate(resolve));
        const result = respond ? await respond(call, calls) : undefined;
        return result === undefined ? defaultResponse(call) : result;
      } finally {
        active.delete(call);
      }
    })();
    pending.push(task);
    return task;
  };
  let value;
  let error;
  try {
    value = await execute(
      { base: ROOT, ...args }, agent,
      jobs => Promise.all(jobs.map(job => typeof job === 'function' ? job() : job)),
      name => phases.push(name), message => logs.push(message),
    );
  } catch (caught) {
    error = caught;
  }
  await Promise.allSettled(pending);
  return { value, error, calls, phases, logs };
}

test('planner workflow: successful build remains shadow-only without explicit promotion authorization', async () => {
  const run = await runWorkflow();
  assert.equal(run.error, undefined);
  assert.equal(run.value.status, 'shadow_ready');
  noMigration(run);
  assert.equal(run.calls.filter(c => /^WP-\d+ implement/.test(c.label)).length, 21);
  assert.equal(run.calls.filter(isCoaching).length, 16, 'two complete coaching rounds');
  assert.ok(run.calls.some(c => c.label === 'gate: final shadow verification'));
});

test('planner workflow: failed preflight cannot start package writers', async t => {
  for (const change of [
    { ready: false }, { policy_reconciled: false }, { branch: 'main' },
    { implementation_ready: false }, { reconciliation_status: 'pending_math_reconciliation' },
    { source_fingerprint: '' }, { unresolved: ['policy needs reconciliation'] },
  ]) await t.test(JSON.stringify(change), async () => {
    const run = await runWorkflow({ respond: call => call.label.startsWith('preflight:') ? { ...defaults(call), ...change } : undefined });
    blocked(run);
    assert.equal(run.calls.some(isPackage), false);
  });
});

test('planner workflow: failed or incomplete implementations block their reviews and dependents', async t => {
  const failures = [
    ['failed status', report({ status: 'fail' })],
    ['blocked status', report({ status: 'blocked' })],
    ['failing tests', report({ tests: { commands: ['mock'], failed: 1 } })],
    ['open issue', report({ open_issues: ['missing dependency'] })],
    ['null response', null],
  ];
  for (const [name, result] of failures) await t.test(name, async () => {
    const run = await runWorkflow({ respond: call => /^WP-00 implement/.test(call.label) ? result : undefined });
    blocked(run);
    assert.equal(run.calls.filter(c => /^WP-00 implement/.test(c.label)).length, 1, 'do not replay a writer after an ambiguous or failed result');
    assert.equal(run.calls.some(c => /^WP-00 review|^WP-01 implement/.test(c.label)), false);
  });
});

test('planner workflow: failed, missing, or unresolved reviews cannot unlock dependencies', async t => {
  for (const [name, result] of [
    ['failed verdict', review({ verdict: 'fail' })],
    ['null review', null],
    ['unresolved review', review({ open_issues: ['not fixed'] })],
  ]) await t.test(name, async () => {
    const run = await runWorkflow({ respond: call => call.label === 'WP-00 review' ? result : undefined });
    blocked(run);
    assert.equal(run.calls.filter(c => c.label === 'WP-00 review').length, 1, 'repairing reviewers are writers too');
    assert.equal(run.calls.some(c => /^WP-01 implement/.test(c.label)), false);
  });
});

test('planner workflow: agent exceptions return blocked and do not unlock downstream packages', async () => {
  const run = await runWorkflow({ respond: call => {
    if (/^WP-12 implement/.test(call.label)) throw new Error('Mock implementation crashed');
  } });
  blocked(run);
  assert.equal(run.calls.filter(c => /^WP-12 implement/.test(c.label)).length, 1, 'exceptions must not replay a potentially partial writer');
  assert.equal(run.calls.some(c => /^WP-(13|16) implement/.test(c.label)), false);
});

test('planner workflow: slice writers wait for every package writer and never overlap each other', async () => {
  const run = await runWorkflow();
  assert.equal(run.error, undefined);
  assert.ok(run.calls.some(c => isPackage(c) && c.activeAtStart.some(label => /^WP-\d+ (implement|review)/.test(label))), 'exercise package concurrency');
  const slices = run.calls.filter(c => /slice/i.test(c.label));
  assert.ok(slices.length > 0, 'exercise slice gates');
  for (const call of slices) assert.deepEqual(call.activeAtStart, [], call.label + ' must run behind a writer barrier');
});

test('planner workflow: failed slice blocks technical gate and promotion', async () => {
  const run = await runWorkflow({ args: approvedArgs(), respond: call => /slice/i.test(call.label) ? report({ status: 'fail' }) : undefined });
  blocked(run);
  assert.equal(run.calls.some(c => c.label === 'gate: shadow technical verification'), false);
});

test('planner workflow: structured gate failures cannot be overridden by PASS prose or authorization', async t => {
  const failures = [
    ['failed verdict', { passed: false }],
    ['failed check', { checks: GATE_IDS.map(id => ({ id, passed: id !== 'benchmark' })) }],
    ['missing checks', { checks: [] }],
    ['missing fingerprint', { source_fingerprint: '' }],
    ['reported failures', { failures: ['grid mismatch'] }],
  ];
  for (const [name, change] of failures) await t.test(name, async () => {
    const run = await runWorkflow({ args: approvedArgs(), respond: call => call.label === 'gate: shadow technical verification'
      ? { ...gate(change), summary: ['GATE PASS'] } : undefined });
    blocked(run);
    assert.equal(run.calls.some(isCoaching), false);
  });
});

test('planner workflow: unacceptable grades and unresolved major issues never promote', async t => {
  for (const [name, result] of [
    ['B is below B+', grade({ grade: 'B' })],
    ['prefix is not an exact grade', grade({ grade: 'Aardvark' })],
    ['A with major', grade({ violations: [violation('major')] })],
    ['A with blocker', grade({ violations: [violation('blocker')] })],
    ['missing reviewer', null],
  ]) await t.test(name, async () => {
    const run = await runWorkflow({ args: approvedArgs(), respond: call => isCoaching(call) && call.label.endsWith('01-swimming') ? result : undefined });
    blocked(run);
  });
});

test('planner workflow: passing grades cannot hide unstable trained-group coverage', async () => {
  const run = await runWorkflow({ args: approvedArgs(), respond: call => isCoaching(call)
    ? grade({ trained_groups: coachingRound(call) % 2 ? ['hips'] : ['quads'] }) : undefined });
  blocked(run);
  assert.ok(run.calls.filter(isCoaching).length >= 16);
});

test('planner workflow: a coaching fix requires a fresh full technical gate', async () => {
  const run = await runWorkflow({ respond: call => isCoaching(call) && coachingRound(call) === 1
    ? grade({ violations: [violation('major')] }) : undefined });
  assert.equal(run.error, undefined);
  assert.equal(run.value.status, 'shadow_ready');
  const firstReview = run.calls.findIndex(isCoaching);
  const repeatedGate = run.calls.findIndex(c => c.label === 'gate: post-fix technical verification');
  const secondReview = run.calls.findIndex(c => isCoaching(c) && coachingRound(c) === 2);
  assert.ok(firstReview < repeatedGate && repeatedGate < secondReview, 'full technical gate must follow the fix and precede regrading');
  assert.ok(run.calls.filter(isCoaching).length >= 24, 'two passing rounds still required after the failed round');
});

test('planner workflow: final gate failure cannot promote an otherwise clean build', async () => {
  const run = await runWorkflow({ args: approvedArgs(), respond: call => call.label === 'gate: final shadow verification' ? gate({ passed: false }) : undefined });
  blocked(run);
});

test('planner workflow: coaching reviews must identify the source verified by the technical gate', async t => {
  for (const fingerprint of ['', 'b'.repeat(64)]) await t.test(fingerprint || 'missing fingerprint', async () => {
    const run = await runWorkflow({ respond: call => isCoaching(call) ? grade({ source_fingerprint: fingerprint }) : undefined });
    blocked(run);
  });
});

test('planner workflow: final gate cannot bless a source changed after the accepted coaching reviews', async () => {
  const run = await runWorkflow({ respond: call => call.label === 'gate: final shadow verification'
    ? gate({ source_fingerprint: 'b'.repeat(64) }) : undefined });
  blocked(run);
});

test('planner workflow: promotion requires verified human approval, not just an argument', async t => {
  for (const [name, changes] of [
    ['reference is not authorized', { authorized: false }],
    ['missing decision approval', { approved_decisions: ['D1', 'D4'] }],
    ['unresolved authorization', { unresolved: ['approval is ambiguous'] }],
    ['different source fingerprint', { source_fingerprint: 'b'.repeat(64) }],
  ]) await t.test(name, async () => {
    const run = await runWorkflow({ args: approvedArgs(), respond: call => call.label === 'approval: verify human promotion authorization'
      ? { ...defaults(call), ...changes } : undefined });
    noMigration(run);
    assert.notEqual(run.value?.status, 'promoted');
    assert.ok(run.calls.some(c => c.label === 'approval: verify human promotion authorization'));
  });
});

test('planner workflow: incomplete promotion request blocks before any agents start', async t => {
  for (const change of [
    { explicitly_authorized: false }, { approved_decisions: ['D1', 'D4'] },
    { approval_reference: '' }, { approval_reference: '../external-approval.md' },
  ]) await t.test(JSON.stringify(change), async () => {
    const run = await runWorkflow({ args: { promotion_approval: { ...APPROVAL, ...change } } });
    blocked(run);
    assert.equal(run.calls.length, 0);
  });
});

test('planner workflow: every actual policy default also requires explicit approval', async () => {
  const run = await runWorkflow({ args: approvedArgs(), respond: call => call.schema?.properties?.passed
    ? gate({ defaults_used: ['D2'] }) : undefined });
  noMigration(run);
  assert.equal(run.error, undefined);
  assert.ok(run.calls.some(c => c.label === 'gate: final shadow verification'));
  assert.notEqual(run.value?.status, 'promoted');
});

test('planner workflow: authorized clean path can promote after coaching and final verification', async () => {
  const run = await runWorkflow({ args: approvedArgs() });
  assert.equal(run.error, undefined);
  assert.equal(run.value.status, 'promoted');
  assert.equal(run.calls.filter(isMigration).length, 1);
  const lastReview = run.calls.findLastIndex(isCoaching);
  const finalGate = run.calls.findIndex(c => c.label === 'gate: final shadow verification');
  const approval = run.calls.findIndex(c => c.label === 'approval: verify human promotion authorization');
  const migration = run.calls.findIndex(isMigration);
  assert.ok(lastReview < finalGate && finalGate < approval && approval < migration);
});

test('planner workflow: an interrupted promotion is not replayed or reported as successful', async () => {
  const run = await runWorkflow({ args: approvedArgs(), respond: call => isMigration(call) ? null : undefined });
  assert.equal(run.error, undefined);
  assert.equal(run.value.status, 'promotion_failed_manual_recovery_required');
  assert.equal(run.calls.filter(isMigration).length, 1);
  assert.equal(run.value.automatic_resume, false);
});

test('planner workflow: post-promotion verification remains bound to the approved shadow source', async () => {
  const run = await runWorkflow({ args: approvedArgs(), respond: call => call.label === 'gate: post-promotion verification'
    ? { ...defaults(call), reviewed_source_fingerprint: 'b'.repeat(64) } : undefined });
  assert.equal(run.error, undefined);
  assert.equal(run.value.status, 'promotion_failed_manual_recovery_required');
  assert.equal(run.calls.filter(isMigration).length, 1);
});

test('planner workflow: no broad staging, automatic commits, or hidden resume', async () => {
  const run = await runWorkflow();
  for (const call of run.calls) {
    assert.doesNotMatch(call.prompt, /git\s+add\s+(?:-A|--all|\.)(?:\s|;|$)/i, call.label);
    assert.doesNotMatch(call.prompt, /(?:make|create)\s+(?:one\s+|a\s+)?local\s+(?:git\s+)?commit|\bgit\s+commit\b|\bLocal commit\./i, call.label);
  }
  const resumed = await runWorkflow({ args: { resume: true } });
  blocked(resumed);
  assert.equal(resumed.calls.length, 0, 'unsupported resume must not silently start a fresh build');
});
