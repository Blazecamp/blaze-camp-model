export const meta = {
  name: 'blaze-camp-planner-build',
  description: 'Policy-gated experimental planner build: isolated package ownership, independent checks, stable coaching reviews, shadow output by default. No automatic commits, reset handling, or durable resume.',
  phases: [
    { title: 'Preflight', detail: 'Verify policy reconciliation, proofs, branch and workspace before writing' },
    { title: 'Phase 0 foundation', detail: 'WP-00 contracts, model data, scaffolding' },
    { title: 'Phase 1-2 pieces and seams', detail: 'WP-01..10 with dependency and ownership checks' },
    { title: 'Phase 3 planner core', detail: 'WP-11..14' },
    { title: 'Phase 4 integration', detail: 'WP-15..19, then serialized slice checks' },
    { title: 'Shadow verification', detail: 'WP-20 and independent technical gates' },
    { title: 'Coach review', detail: 'Two stable clean rounds on shadow samples' },
    { title: 'Explicit promotion', detail: 'Only with separately verified human authorization' },
  ],
}

const BASE = args.base
const DZ = BASE + '/design'
const SHADOW = DZ + '/bench/planner-shadow'
const SAMPLES = ['01-swimming', '02-football', '03-soccer', '04-crossfit-style-bootcamp', '05-bootcamp', '06-full-body-aesthetics', '07-push-pull-legs', '08-pickleball-genpop']
const REQUIRED_APPROVALS = ['D1', 'D4', 'D13']
const TECHNICAL_CHECKS = ['authority', 'contracts', 'default_engine', 'legacy_output', 'unit_tests', 'benchmark', 'grid', 'sweep', 'random', 'certification', 'determinism', 'performance', 'review_regressions']
const STRINGS = { type: 'array', items: { type: 'string' } }
const REPORT = { type: 'object', properties: {
  status: { type: 'string', enum: ['pass', 'fail', 'blocked'] }, files_written: STRINGS, summary: STRINGS,
  tests: { type: 'object', properties: { commands: STRINGS, failed: { type: 'integer', minimum: 0 } }, required: ['commands', 'failed'] },
  open_issues: STRINGS,
}, required: ['status', 'files_written', 'summary', 'tests', 'open_issues'] }
const REVIEW = { type: 'object', properties: { verdict: { type: 'string', enum: ['pass', 'pass_after_fixes', 'fail'] }, fixes: STRINGS, open_issues: STRINGS }, required: ['verdict', 'fixes', 'open_issues'] }
const PREFLIGHT = { type: 'object', properties: { ready: { type: 'boolean' }, policy_reconciled: { type: 'boolean' }, implementation_ready: { type: 'boolean' }, reconciliation_status: { type: 'string' }, branch: { type: 'string' }, source_fingerprint: { type: 'string' }, unresolved: STRINGS }, required: ['ready', 'policy_reconciled', 'implementation_ready', 'reconciliation_status', 'branch', 'source_fingerprint', 'unresolved'] }
const GATE = { type: 'object', properties: {
  passed: { type: 'boolean' }, source_fingerprint: { type: 'string' }, reviewed_source_fingerprint: { type: 'string' }, failures: STRINGS, defaults_used: STRINGS,
  checks: { type: 'array', items: { type: 'object', properties: { id: { type: 'string' }, passed: { type: 'boolean' } }, required: ['id', 'passed'] } },
}, required: ['passed', 'source_fingerprint', 'failures', 'defaults_used', 'checks'] }
const APPROVAL = { type: 'object', properties: { authorized: { type: 'boolean' }, approval_reference: { type: 'string' }, approved_decisions: STRINGS, source_fingerprint: { type: 'string' }, unresolved: STRINGS }, required: ['authorized', 'approval_reference', 'approved_decisions', 'source_fingerprint', 'unresolved'] }
const GRADE = { type: 'object', properties: {
  grade: { type: 'string', enum: ['A+', 'A', 'A-', 'B+', 'B', 'B-', 'C', 'D', 'F'] }, trained_groups: STRINGS, source_fingerprint: { type: 'string' },
  violations: { type: 'array', items: { type: 'object', properties: { where: { type: 'string' }, problem: { type: 'string' }, rule: { type: 'string' }, severity: { type: 'string', enum: ['blocker', 'major', 'minor'] }, engine_fix_hint: { type: 'string' } }, required: ['where', 'problem', 'rule', 'severity', 'engine_fix_hint'] } },
  praise: STRINGS,
}, required: ['grade', 'trained_groups', 'source_fingerprint', 'violations', 'praise'] }

const CONTEXT = `
Blaze Camp experimental planner. Repository: ${BASE}; required branch: planner-build.
AUTHORITY: read coach_answers_codex_2026-10-10.md FIRST, above coach_answers_round3.md > coach_answers_round2.md > coach_answers_full.md > coach_chat_statements.md. CX-01..04 do NOT authorize D1/D4/D13, all other proposed defaults, or production promotion. Read AGENTS.md and the current policy record. Never edit the coach's answers.
BINDING DESIGN, ONLY AFTER RECONCILIATION: ${DZ}/PLANNER_SPEC.md, IMPLEMENTATION_PLAN.md, rules_as_constraints.json, diagnosis.md and the benchmark. Historical proofs/prototypes are evidence, not authority. Do not implement a reconciliation_required section or reuse a proof invalidated by faster endpoint growth. Report it as blocked.
Before separately verified promotion, keep the tracked default v04 and samples/plans/* unchanged. Use an in-memory model override to exercise two_stage; put experimental plans only in ${SHADOW}/plans. The sole exception is the explicit WP-21 promotion task supplied with verified human authorization after all shadow gates; its following read-only gate/report must verify that authorized two_stage state rather than restore v04. No other stage may promote or publish. Do not weaken a scorer, validator or acceptance threshold to pass. Preserve the historical benchmark; a current v04 baseline must have an exact source fingerprint and be reported separately.
Every applicable coach rule remains authoritative. Unresolved policy choices are explicit experimental defaults, never silently upgraded to approval. No bands, tracking, stored client data, sex/lifestyle inputs, or new mandatory intake fields. Use synthetic benchmark intakes only. Plain ES modules, Node 22, no dependencies; deterministic decisions and model-sourced constants.
NO GIT WRITES: never stage, commit, switch branches, reset, or push. Leave changes for owner review. Do not edit other agents' files or append to shared request/decision files during parallel packages; return requests in open_issues. During parallel work run only package-owned tests. Full-suite and cross-package repairs happen after the explicit ownership barrier. No background agents or detached tasks may remain when you return.
This workflow has no persistent execution checkpoint and no account-reset scheduler. Only read-only checks may retry an empty response; a mutating agent's missing report or exception stops its stage because partial writes may exist. Do not claim automatic resume, elapsed-time guarantees, or token-budget guarantees.
`

const WPS = [
  { id: 'WP-00', title: 'Contracts, model data, scaffolding', deps: [], phase: 'Phase 0 foundation' },
  { id: 'WP-01', title: 'Units, the time function, the staircase', deps: ['WP-00'], phase: 'Phase 1-2 pieces and seams' },
  { id: 'WP-02', title: 'The generic search', deps: ['WP-00'], phase: 'Phase 1-2 pieces and seams' },
  { id: 'WP-03', title: 'The stairway scheduler', deps: ['WP-00'], phase: 'Phase 1-2 pieces and seams' },
  { id: 'WP-04', title: 'The rule catalogue and certifier', deps: ['WP-00'], phase: 'Phase 1-2 pieces and seams' },
  { id: 'WP-05', title: 'The independent reference model', deps: ['WP-00'], phase: 'Phase 1-2 pieces and seams' },
  { id: 'WP-06', title: 'Benchmark wiring', deps: ['WP-00'], phase: 'Phase 1-2 pieces and seams' },
  { id: 'WP-07', title: 'The uncut layout and template notes', deps: ['WP-00'], phase: 'Phase 1-2 pieces and seams' },
  { id: 'WP-08', title: 'Selection and laterality pre-pass', deps: ['WP-00'], phase: 'Phase 1-2 pieces and seams' },
  { id: 'WP-09', title: 'Dose parameters and progression card', deps: ['WP-00'], phase: 'Phase 1-2 pieces and seams' },
  { id: 'WP-10', title: 'The athletic plan and room ladder', deps: ['WP-00'], phase: 'Phase 1-2 pieces and seams' },
  { id: 'WP-12', title: 'The oracle', deps: ['WP-01', 'WP-02', 'WP-04'], phase: 'Phase 3 planner core' },
  { id: 'WP-14', title: 'Placement', deps: ['WP-01', 'WP-03', 'WP-04'], phase: 'Phase 3 planner core' },
  { id: 'WP-11', title: 'The grammar builder', deps: ['WP-01', 'WP-04', 'WP-07', 'WP-08', 'WP-09', 'WP-10'], phase: 'Phase 3 planner core' },
  { id: 'WP-13', title: 'The tiers', deps: ['WP-12', 'WP-03'], phase: 'Phase 3 planner core' },
  { id: 'WP-16', title: 'Planner chain and adapter, not default promotion', deps: ['WP-11', 'WP-13', 'WP-14'], phase: 'Phase 4 integration' },
  { id: 'WP-15', title: 'Formats', deps: ['WP-11', 'WP-13', 'WP-14', 'WP-16'], phase: 'Phase 4 integration' },
  { id: 'WP-18', title: 'Conflicts in rule ids', deps: ['WP-12', 'WP-13'], phase: 'Phase 4 integration' },
  { id: 'WP-17', title: 'Offers, reasons and decision table', deps: ['WP-16'], phase: 'Phase 4 integration' },
  { id: 'WP-19', title: 'Validate, render and words', deps: ['WP-04', 'WP-16'], phase: 'Phase 4 integration' },
]

const nonempty = value => typeof value === 'string' && value.trim().length > 0
const strings = value => Array.isArray(value) && value.every(nonempty)
const empty = value => Array.isArray(value) && value.length === 0
const requireReport = (r, label) => {
  if (!r || r.status !== 'pass' || !strings(r.files_written) || !strings(r.summary) || !r.tests || !strings(r.tests.commands) || r.tests.commands.length === 0 || r.tests.failed !== 0 || !empty(r.open_issues)) {
    throw new Error(label + ' did not pass: ' + JSON.stringify(r))
  }
  return r
}
const runWithRetry = async (make, tries = 2) => {
  for (let attempt = 1; attempt <= tries; attempt++) {
    const result = await make(attempt)
    if (result != null) return result
    log('Empty agent response; bounded in-run retry ' + attempt + '/' + tries)
  }
  throw new Error('Agent returned no report after ' + tries + ' attempts; manual inspection required')
}
const task = async (label, phaseName, prompt) => requireReport(await agent(CONTEXT + '\n' + prompt, { label, phase: phaseName, schema: REPORT }), label)
const checkGate = (gate, required) => {
  if (!gate || gate.passed !== true || !nonempty(gate.source_fingerprint) || !empty(gate.failures) || !strings(gate.defaults_used) || !Array.isArray(gate.checks)) throw new Error('Gate failed: ' + JSON.stringify(gate))
  const ids = gate.checks.map(check => check.id)
  if (new Set(ids).size !== ids.length || gate.checks.some(check => check.passed !== true) || required.some(id => !ids.includes(id))) throw new Error('Gate has missing, duplicate or failed checks: ' + JSON.stringify(gate))
  return gate
}
const gradeRanks = { 'A+': 6, A: 5, 'A-': 4, 'B+': 3, B: 2, 'B-': 1, C: 0, D: -1, F: -2 }
const good = r => gradeRanks[r.grade] >= gradeRanks['B+'] && r.violations.every(v => v.severity === 'minor')
const stable = (previous, current) => current.every(r => {
  const before = previous.find(p => p.name === r.name)
  return before && gradeRanks[r.grade] >= gradeRanks[before.grade] && JSON.stringify([...r.trained_groups].sort()) === JSON.stringify([...before.trained_groups].sort())
})

let stage = 'input'
let promotionAttempted = false
let latestGate = null
const results = {}
const history = []

try {
  if (!nonempty(BASE)) throw new Error('args.base must name the repository')
  if (Object.prototype.hasOwnProperty.call(args, 'resume')) throw new Error('args.resume is unsupported: inspect the working tree and begin a fresh, reviewed invocation; no durable workflow checkpoint exists')
  const requestedApproval = args.promotion_approval
  if (requestedApproval !== undefined) {
    if (!requestedApproval || requestedApproval.explicitly_authorized !== true || !nonempty(requestedApproval.approval_reference) || requestedApproval.approval_reference.startsWith('/') || requestedApproval.approval_reference.includes('..') || !strings(requestedApproval.approved_decisions) || REQUIRED_APPROVALS.some(id => !requestedApproval.approved_decisions.includes(id))) {
      throw new Error('Promotion needs explicit authorization, a repository-relative human approval record, and approvals for D1/D4/D13; the three CX policy answers alone do not authorize promotion')
    }
  }

  stage = 'preflight'
  phase('Preflight')
  const preflight = await runWithRetry(() => agent(CONTEXT + `\nREAD-ONLY PREFLIGHT. Verify the actual repository is on planner-build with a clean working tree; do not change it. Read design/rules_as_constraints.json.policy_amendment and report its implementation_ready and reconciliation_status verbatim. Require implementation_ready=true and reconciliation_status="reconciled" from a reviewed revision; the current false/pending_math_reconciliation must block, even though CX policy answers are approved. Read the newest CX authority and every design reconciliation/status notice. Require the active specification, rule inventory, scheduler, growth bounds, saturation handling and proofs to agree with the new policy. An unresolved reconciliation_required notice or historical proof without its necessary replacement is a blocker, not permission to improvise during implementation. Check ownership and dependency declarations too. Return ready=true only if implementation can follow a reconciled design with verified supporting work. Compute source_fingerprint for the exact training-affecting source/design/rule state; list every unresolved blocker. No builds, code generation, commits or writes.`, { label: 'preflight: verify policy and workspace', phase: 'Preflight', schema: PREFLIGHT }))
  if (!preflight || preflight.ready !== true || preflight.policy_reconciled !== true || preflight.implementation_ready !== true || preflight.reconciliation_status !== 'reconciled' || preflight.branch !== 'planner-build' || !nonempty(preflight.source_fingerprint) || !empty(preflight.unresolved)) throw new Error('Preflight blocked: ' + JSON.stringify(preflight))

  stage = 'packages'
  const done = {}
  const buildWP = wp => (async () => {
    const dependencies = await Promise.all(wp.deps.map(id => done[id]))
    if (dependencies.some(result => result.ok !== true)) return (results[wp.id] = { ok: false, skipped: true, error: 'A required package failed' })
    try {
      const impl = await task(wp.id + ' implement: ' + wp.title, wp.phase, `IMPLEMENT ${wp.id}: ${wp.title}. Read its complete IMPLEMENTATION_PLAN scope, ownership, named tests and done criteria. Dependencies have passed implementation and independent review. Write only package-owned files. Run owned tests, not the full suite while other packages may be writing. Do not launch migration, change the tracked default or publish samples. Return blocked for any missing contract or unresolved policy; report shared-file requests without writing those files. For WP-06, preserve the historical baseline and establish a separately fingerprinted current-v04 comparison. An interrupted attempt may have partial files: inspect them before completing your own work.`)
      const review = await agent(CONTEXT + `\nADVERSARIAL REVIEW ${wp.id}: ${wp.title}. Read the actual package diff, spec and named tests. Implementer report: ${JSON.stringify(impl)}. Only this package has handed you ownership; other packages may still be active. Verify claimed work, test meaningful counterexamples in package-owned scratch space, and repair only this package. Run owned tests. Verify no default or published-sample changes. Return fail if unresolved issues remain; do not fix another package or a shared file.`, { label: wp.id + ' review', phase: wp.phase, schema: REVIEW })
      if (!review || !['pass', 'pass_after_fixes'].includes(review.verdict) || !strings(review.fixes) || !empty(review.open_issues)) throw new Error('Package review failed: ' + JSON.stringify(review))
      return (results[wp.id] = { ok: true, impl, review })
    } catch (error) {
      return (results[wp.id] = { ok: false, error: String(error.message || error) })
    }
  })()
  for (const wp of WPS) done[wp.id] = buildWP(wp)
  // Settle every active owner before any cross-package repair or failure report.
  await Promise.all(WPS.map(wp => done[wp.id]))
  const failed = WPS.filter(wp => !results[wp.id].ok)
  if (failed.length) throw new Error('Packages failed or were blocked: ' + failed.map(wp => wp.id).join(', '))

  stage = 'slices'
  await task('slice 1-2: serialized verification', 'Phase 4 integration', `All package owners have finished. You now own cross-package planner repairs for this call only. Evaluate implementation-plan slices 1-2, run the full suite, independently check the baseline fingerprint and re-scheduled plans. Repair root causes with named tests, not changed acceptance thresholds. Return pass only with no outstanding failures. Do not commit.`)
  await task('slice 3: serialized shadow verification', 'Phase 4 integration', `Evaluate slice 3 on C1/C2 using an in-memory two_stage override, with the tracked default still v04. Every applicable slice criterion must pass; do not treat 'unknown' as infeasible or success. Repair with tests only while you are the sole writer. Record any unresolved criterion as fail. Do not publish samples or commit.`)
  await task('WP-20 implement and shadow samples', 'Shadow verification', `Implement WP-20 tools and verification evidence for slices 4-6 and the complete gate. Cover C1/C2/C3/C4/C5, not just samples and the benchmark. Preserve the historical baseline and compare against the independently fingerprinted current v04 baseline. Prepare rule-id regression coverage without deleting old tests or code. Generate all 8 experimental samples (JSON, English and Spanish where applicable) only under ${SHADOW}/plans. Save measured evidence and candidate-manifest.json under ${SHADOW}; the manifest documents deterministic fingerprint scope and per-file byte hashes for training-affecting source, authority, design, rules, synthetic intakes and generated shadow plans, excluding itself and reporting-only outputs. Independent gates/reviewers must recompute it, not trust stored claims. Report unavailable measurements as blockers. No default switch, production sample regeneration or commits.`)

  const gateRun = async (label, reviews, promoted = false) => {
    const required = [...TECHNICAL_CHECKS.filter(id => !promoted || id !== 'legacy_output'), ...(promoted ? ['published_equivalence'] : []), ...(reviews ? ['coach_review'] : [])]
    const report = await runWithRetry(() => agent(CONTEXT + `\nINDEPENDENT READ-ONLY GATE. Do not repair code, change thresholds, write files or commit. Required check IDs: ${required.join(', ')}. Recompute/check all applicable specification 13.3 evidence, every acceptance row A1-A24 on its specified corpora, independent certifications, the sweep/random cases, unit tests, deterministic output, exact time accounting, current-baseline comparisons, rule-id regression coverage and required performance measurements. Missing or unavailable evidence fails. The tracked default must be ${promoted ? 'two_stage; published samples must exactly match the approved shadow prescriptions' : 'v04 and published samples must be unchanged'}. Check the current CX authority and reconciled proofs again. ${reviews ? 'Verify two stable clean review rounds against the actual shadow artifacts and these reports: ' + JSON.stringify(reviews) : 'This is technical verification only; human policy approval and coach-eye acceptance are still separate.'} Fingerprint sorted repository-relative paths and byte hashes for all training-affecting source, coach authority, active design, rules, synthetic intake files and the actual generated shadow prescriptions/rendered plans. Use one documented deterministic scheme shared by every gate and reviewer; exclude verification/report outputs and git metadata. Report the checked per-file fingerprint manifest in the evidence so the authorized publication delta can be independently checked. Return every check as a structured boolean, actual defaults_used (all material policy decisions), failures, and the current source_fingerprint. ${promoted ? 'Also return reviewed_source_fingerprint for the approved shadow snapshot, verifying against its manifest that only the authorized default switch and production sample publication separate it from the current source and that published prescriptions match. Any other source or candidate-artifact change fails.' : 'When reviews are provided, their source fingerprints must match the current fingerprint exactly.'} A summary string is not a pass.`, { label, phase: 'Shadow verification', schema: GATE }))
    latestGate = report
    checkGate(report, required)
    if (reviews && reviews.some(round => round.some(review => review.source_fingerprint !== (promoted ? report.reviewed_source_fingerprint : report.source_fingerprint)))) throw new Error('Gate source does not match the reviewed shadow snapshot')
    return report
  }
  stage = 'technical gate'
  await gateRun('gate: shadow technical verification', null)

  stage = 'coach review'
  phase('Coach review')
  let priorClean = null
  let acceptedReviews = null
  let fixes = 0
  for (let round = 1; round <= 10; round++) {
    const reviews = await parallel(SAMPLES.map(name => async () => {
      try {
        const report = await runWithRetry(() => agent(CONTEXT + `\nREAD-ONLY COACH-EYE REVIEW round ${round}: ${SHADOW}/plans/${name}.*. Read the newest CX policy, R3/R2/full answers, model and relevant sport profile. Inspect the actual experimental JSON and rendered plan. Recompute source_fingerprint using the gate's documented scheme, including all training-affecting source and shadow-plan bytes; expected snapshot ${latestGate.source_fingerprint}. Do not simply echo that value. Grade A+ through F with an exact enum value. Check dose, time, progression, effort, orders, pairing, spine loading, focus, athletic work, sport practice, language and scope. Classify every blocker/major/minor with a location and rule. All dosing majors block acceptance; this workflow also blocks other majors. Report the sorted set of actually trained group ids in trained_groups, not the intended targets. Never modify files or grade the unchanged production samples.`, { label: 'coach review r' + round + ': ' + name, phase: 'Coach review', schema: GRADE }))
        if (!report || report.source_fingerprint !== latestGate.source_fingerprint || !Object.prototype.hasOwnProperty.call(gradeRanks, report.grade) || !strings(report.trained_groups) || new Set(report.trained_groups).size !== report.trained_groups.length || !Array.isArray(report.violations) || report.violations.some(v => !['blocker', 'major', 'minor'].includes(v.severity))) throw new Error('Incomplete or stale coaching review for ' + name)
        return { ...report, name }
      } catch (error) {
        return { name, error: String(error.message || error) }
      }
    }))
    if (!Array.isArray(reviews) || reviews.length !== SAMPLES.length || new Set(reviews.map(r => r.name)).size !== SAMPLES.length || reviews.some(r => r.error)) throw new Error('Missing, stale or failed sample coaching reviews: ' + JSON.stringify(reviews))
    history.push({ round, reviews })
    if (reviews.every(good)) {
      if (priorClean && stable(priorClean, reviews)) { acceptedReviews = [priorClean, reviews]; break }
      priorClean = reviews
      continue
    }
    priorClean = null
    if (fixes >= 4) throw new Error('Coaching acceptance not reached after four fix rounds')
    fixes++
    await task('coach fixes r' + fixes, 'Coach review', `All reviewers have finished and no package is active. You are the sole repair owner for this call. Fix the actual blockers/majors from ${JSON.stringify(reviews)} at their source with rule-id tests; do not reinterpret a coach rule or use an unapproved policy to force acceptance. Preserve default v04 and production samples. Run the full suite and current-baseline benchmark; regenerate only the shadow samples and refresh their candidate-manifest.json using the same documented scope. Report fail/blocked if any required issue cannot be resolved. Do not commit.`)
    stage = 'post-fix technical gate'
    await gateRun('gate: post-fix technical verification', null)
    stage = 'coach review'
  }
  if (!acceptedReviews) throw new Error('Two stable clean coaching review rounds were not achieved')
  stage = 'final shadow gate'
  const shadowGate = await gateRun('gate: final shadow verification', acceptedReviews)

  if (requestedApproval !== undefined) {
    stage = 'promotion approval'
    phase('Explicit promotion')
    const requiredDecisions = [...new Set([...REQUIRED_APPROVALS, ...shadowGate.defaults_used])]
    if (requiredDecisions.some(id => !requestedApproval.approved_decisions.includes(id))) throw new Error('Promotion input does not cover every material default used: ' + requiredDecisions.join(', '))
    const authorization = await runWithRetry(() => agent(CONTEXT + `\nREAD-ONLY HUMAN AUTHORIZATION CHECK. Request: ${JSON.stringify(requestedApproval)}. Read the referenced repository approval record and verify it is an actual explicit human/coach authorization to promote this planner after its checks, not an agent recommendation, a draft, or the three CX answers. Verify explicit approval/resolution of every material decision: ${requiredDecisions.join(', ')}. Compare the actual current training-affecting source fingerprint to ${shadowGate.source_fingerprint}; any mismatch requires a fresh gate. Return unauthorized for missing, ambiguous or inaccessible evidence. No writes, commits or default changes.`, { label: 'approval: verify human promotion authorization', phase: 'Explicit promotion', schema: APPROVAL }))
    if (!authorization || authorization.authorized !== true || authorization.approval_reference !== requestedApproval.approval_reference || authorization.source_fingerprint !== shadowGate.source_fingerprint || !strings(authorization.approved_decisions) || requiredDecisions.some(id => !authorization.approved_decisions.includes(id)) || !empty(authorization.unresolved)) throw new Error('Human promotion authorization was not verified: ' + JSON.stringify(authorization))
    stage = 'explicit promotion'
    promotionAttempted = true
    await task('WP-21 explicitly authorized promotion', 'Explicit promotion', `The complete shadow gate and two stable coaching review rounds passed. Human authorization was independently verified: ${JSON.stringify(authorization)}. Perform the narrow authorized switch to two_stage and regenerate production samples from the approved shadow prescriptions. Preserve the old engine, old tests, shadow artifacts and their pre-promotion candidate-manifest.json for independent comparison and manual recovery; deletion/retirement is a separate change, not permission granted here. Do not change policy, constraints, or dose during migration. Verify source fingerprint before any write and stop if it differs from ${shadowGate.source_fingerprint}. Check published prescriptions match shadow, run the full suite and report every change. No commits or push. Do not claim automatic rollback; if interrupted or verification fails, report the exact default state and files needing manual recovery.`)
    stage = 'post-promotion verification'
    await gateRun('gate: post-promotion verification', acceptedReviews, true)
  }

  stage = 'final report'
  await task('final status and pending coach questions', 'Coach review', `Write only samples/STATUS_planner.md and round4_questions.json. Status is ${promotionAttempted ? 'promoted after separately verified human authorization' : 'shadow_ready, experimental; v04 remains the default'}. Report actual measured results against the current fingerprinted v04 baseline, separately label historical baseline numbers, include both final review rounds and all unresolved human decisions. Never describe a test score as proof of physiological superiority. Do not ask again for CX-01..04; their answers are authoritative. Keep pending unapproved defaults distinct from answered questions. Do not run generation or change implementation, model, tests or published samples. Check the report against the existing evidence and list that verification command in tests.commands. No commit. No automatic resume/reset or duration/token-budget promises.`)
  return { status: promotionAttempted ? 'promoted' : 'shadow_ready', stage: 'complete', packages: results, gate: latestGate, history, automatic_resume: false }
} catch (error) {
  const status = promotionAttempted ? 'promotion_failed_manual_recovery_required' : 'blocked'
  log(status + ' at ' + stage + ': ' + String(error.message || error))
  return { status, stage, error: String(error.message || error), packages: results, gate: latestGate, history, automatic_resume: false }
}
