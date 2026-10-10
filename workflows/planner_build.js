export const meta = {
  name: 'blaze-camp-planner-build',
  description: 'Build the two-stage optimizer planner per design/PLANNER_SPEC.md and IMPLEMENTATION_PLAN.md: 22 work packages as a dependency graph (implement + adversarial review each), shadow scoring on the 94-plan benchmark, the gate, the switch, coach-eye reviews of the 8 samples until B+',
  phases: [
    { title: 'Phase 0 foundation', detail: 'WP-00 contracts, model data, scaffolding' },
    { title: 'Phase 1-2 pieces and seams', detail: 'WP-01..10 in parallel, each reviewed' },
    { title: 'Phase 3 planner core', detail: 'WP-11..15' },
    { title: 'Phase 4 integration', detail: 'WP-16..19, shadow scoring loop' },
    { title: 'Gate and switch', detail: 'WP-20 gate, WP-21 migration, benchmark vs baseline' },
    { title: 'Coach review', detail: '8 sample plans graded as the coach; fix loop to B+' },
  ],
}

const BASE = args.base
const DZ = BASE + '/design'

const CONTEXT = `
Blaze Camp plan engine for coach Lalo Vera. Repo root: ${BASE} (git branch planner-build; do NOT push; only agents explicitly told to may make LOCAL commits). You are building the new two-stage optimizer planner ("planner/1") that replaces the dosing core of the current engine (v0.4, "v04").
BINDING DOCUMENTS - read before writing code: ${DZ}/PLANNER_SPEC.md (the formal spec: sections 3 modules, 4 data contracts, 5 formal model + rule ids, 6 proofs, 7 pseudo-code per stage, 8 infeasibility policy + messages, 9 determinism, 10 performance, 12 tests, 13 acceptance criteria A1-A24, 14 coach decisions with defaults, 15 limits) and ${DZ}/IMPLEMENTATION_PLAN.md (22 work packages WP-00..WP-21, section 2 file ownership - every file has exactly ONE owning package, section 3 the detail and the named tests of each package, section 4 slices, section 7 rules for every agent). Also: ${DZ}/rules_as_constraints.json (the 127 rules as constraints), ${DZ}/diagnosis.md (why the old engine fails, DR-1..DR-25), ${DZ}/bench/ (94 benchmark intakes, score.mjs scorer, run.mjs runner, BASELINE.md), prototypes under ${DZ}/ (evidence, not code to copy blindly - spec 12.2).
COACH AUTHORITY: coach_answers_round3.md > round2 > coach_answers_full.md > coach_chat_statements.md. The coach's rules are the point of all this: floors on trained groups, a stairway that never goes flat, days inside the chosen minutes, 2-4 exercises per trained group, core first, power before strength, horizontal before vertical, hip+push / knee+pull pairing, axial once per pattern per week, no bands, no check-ins (input in, whole plan out), the R3-SES-02 order when time is short. Where the spec lists a coach decision D1-D15, use the spec default and record it in meta.planner.defaults_used.
RULES FOR EVERY AGENT (IMPLEMENTATION_PLAN section 7): write only the files your package owns; anything else goes as an appended request to engine/CONTRACT_REQUESTS.md; no number that exists in model/rules.json is typed in code; whole numbers in every decision, no tolerance, no clock, no randomness, no iteration over unordered collections in a decision; every test names its rule id or spec section and uses the shared generators; the OLD engine stays the default (rules.planner.engine = "v04") until the gate and its output must not change (the 8 sample plans stay byte-identical - never run tools/generate-samples.mjs, generate in memory instead); plain ES modules, Node 22, no dependencies, JSDoc on exports.
SHARED WORKING TREE: other packages are being written by other agents at the same time in this same folder. While developing, run only your own test files (node --test tests/plan/<yours>.test.mjs). Run the full suite (node --test tests/) at the end; if a failure is in a file you do not own, re-run once after a short wait, and if it persists report it (file + owner package) instead of editing it.
`

const REPORT = { type: 'object', properties: { files_written: { type: 'array', items: { type: 'string' } }, summary: { type: 'array', items: { type: 'string' } }, tests: { type: 'string', description: 'test command(s) run and pass/fail counts' }, open_issues: { type: 'array', items: { type: 'string' } } }, required: ['files_written', 'summary', 'tests', 'open_issues'] }
const REVIEW = { type: 'object', properties: { verdict: { type: 'string', enum: ['pass', 'pass_after_fixes', 'fail'] }, fixes: { type: 'array', items: { type: 'string' } }, open_issues: { type: 'array', items: { type: 'string' } } }, required: ['verdict', 'fixes', 'open_issues'] }
const GRADE = { type: 'object', properties: { grade: { type: 'string' }, violations: { type: 'array', items: { type: 'object', properties: { where: { type: 'string' }, problem: { type: 'string' }, rule: { type: 'string' }, severity: { type: 'string', enum: ['blocker', 'major', 'minor'] }, engine_fix_hint: { type: 'string' } }, required: ['where', 'problem', 'rule', 'severity', 'engine_fix_hint'] } }, praise: { type: 'array', items: { type: 'string' } } }, required: ['grade', 'violations', 'praise'] }

const WPS = [
  { id: 'WP-00', title: 'Contracts, model data, scaffolding', deps: [], phase: 'Phase 0 foundation' },
  { id: 'WP-01', title: 'Units, the time function, the staircase', deps: ['WP-00'], phase: 'Phase 1-2 pieces and seams' },
  { id: 'WP-02', title: 'The generic search (plan/fd.mjs)', deps: ['WP-00'], phase: 'Phase 1-2 pieces and seams' },
  { id: 'WP-03', title: 'The stairway scheduler', deps: ['WP-00'], phase: 'Phase 1-2 pieces and seams' },
  { id: 'WP-04', title: 'The rule catalogue and the certifier', deps: ['WP-00'], phase: 'Phase 1-2 pieces and seams' },
  { id: 'WP-05', title: 'The reference model (tools only)', deps: ['WP-00'], phase: 'Phase 1-2 pieces and seams' },
  { id: 'WP-06', title: 'Benchmark wiring', deps: ['WP-00'], phase: 'Phase 1-2 pieces and seams' },
  { id: 'WP-07', title: 'The uncut layout and the template notes', deps: ['WP-00'], phase: 'Phase 1-2 pieces and seams' },
  { id: 'WP-08', title: 'Selection and the laterality pre-pass', deps: ['WP-00'], phase: 'Phase 1-2 pieces and seams' },
  { id: 'WP-09', title: 'Dose parameters and the progression card', deps: ['WP-00'], phase: 'Phase 1-2 pieces and seams' },
  { id: 'WP-10', title: 'The athletic plan and the room ladder', deps: ['WP-00'], phase: 'Phase 1-2 pieces and seams' },
  { id: 'WP-12', title: 'The oracle', deps: ['WP-01', 'WP-02', 'WP-04'], phase: 'Phase 3 planner core' },
  { id: 'WP-14', title: 'Placement (S2)', deps: ['WP-01', 'WP-03', 'WP-04'], phase: 'Phase 3 planner core' },
  { id: 'WP-11', title: 'The grammar builder (S0)', deps: ['WP-01', 'WP-04', 'WP-07', 'WP-08', 'WP-09', 'WP-10'], phase: 'Phase 3 planner core' },
  { id: 'WP-13', title: 'The tiers (S1)', deps: ['WP-12', 'WP-03'], phase: 'Phase 3 planner core' },
  { id: 'WP-16', title: 'The planner chain, the adapter, the switch', deps: ['WP-11', 'WP-13', 'WP-14'], phase: 'Phase 4 integration' },
  { id: 'WP-15', title: 'Formats', deps: ['WP-11', 'WP-13', 'WP-14', 'WP-16'], phase: 'Phase 4 integration' },
  { id: 'WP-18', title: 'Conflicts in rule ids', deps: ['WP-12', 'WP-13'], phase: 'Phase 4 integration' },
  { id: 'WP-17', title: 'Offers, reasons, the decision table', deps: ['WP-16'], phase: 'Phase 4 integration' },
  { id: 'WP-19', title: 'Validate, render, words', deps: ['WP-04', 'WP-16'], phase: 'Phase 4 integration' },
]

const runWithRetry = async (make, tries) => {
  for (let i = 1; i <= tries; i++) {
    const r = await make(i)
    if (r) return r
    log('agent returned nothing (attempt ' + i + '), retrying')
  }
  return null
}

const done = {}
const results = {}
const buildWP = (wp) => (async () => {
  await Promise.all(wp.deps.map(d => done[d]))
  const depNotes = wp.deps.map(d => results[d] ? d + ': ' + results[d].impl.summary.slice(0, 4).join(' | ') + (results[d].review ? ' [review: ' + results[d].review.verdict + ']' : '') : d + ': (no report)').join('\n')
  const impl = await runWithRetry((i) => agent(CONTEXT + `\nYOUR TASK: IMPLEMENT ${wp.id} - ${wp.title}. Read IMPLEMENTATION_PLAN.md section 3 "${wp.id}" in full (scope, files, the tests it must add, its done-criteria) and the PLANNER_SPEC sections it cites; implement exactly that, in the files ${wp.id} owns per section 2, with every named test. Packages you depend on are finished:\n${depNotes || '(none)'}\nIf something you need from another package is missing or different from the spec, code against the spec, append a request to engine/CONTRACT_REQUESTS.md and list it in open_issues. Finish with your own tests green and the full suite green under the default engine setting.` + (i > 1 ? ' (This is attempt ' + i + ': a previous attempt was cut off; inspect what exists in your files and complete it.)' : ''), { label: wp.id + ' implement: ' + wp.title, phase: wp.phase, schema: REPORT }), 3)
  if (!impl) { results[wp.id] = { impl: { summary: ['FAILED to implement'], files_written: [], tests: 'none', open_issues: ['package did not complete'] }, review: null }; return results[wp.id] }
  const review = await runWithRetry((i) => agent(CONTEXT + `\nYOUR TASK: ADVERSARIAL REVIEW OF ${wp.id} - ${wp.title}. The implementer reports:\n- ${impl.summary.join('\n- ')}\nTests: ${impl.tests}\nOpen issues: ${impl.open_issues.join(' | ') || 'none'}\nCheck against IMPLEMENTATION_PLAN section 3 "${wp.id}" and the spec: (1) only owned files were written (git status / git diff --stat); (2) every named test exists, is not vacuous (try to break the code and see the test fail: mutate a constant or a comparison in a scratch copy), uses the shared generators and asserts its drawn distribution; (3) the code matches the spec's formal model and pseudo-code (rule ids, tiers, whole-number arithmetic, no tolerance, determinism, no hard-coded model numbers); (4) the old engine's output is unchanged and the full suite is green; (5) edge cases from design/diagnosis.md that this package must handle. Fix every defect you find inside this package's files (you now own them for this review) and add the missing tests. Return verdict, fixes, open_issues.`, { label: wp.id + ' review', phase: wp.phase, schema: REVIEW }), 2)
  results[wp.id] = { impl, review }
  return results[wp.id]
})()

for (const wp of WPS) done[wp.id] = buildWP(wp)

// ---- slice gates (run as their dependencies finish) ----
const gate = (label, phaseName, deps, task) => (async () => {
  await Promise.all(deps.map(d => done[d]))
  return runWithRetry(() => agent(CONTEXT + `\nYOUR TASK: ${label}. ${task}\nYou may fix defects in any planner file (engine/plan/*, tools/planner/*, tests/plan/*) and in the seam files of finished packages when a slice criterion fails; record each fix in engine/DECISIONS.md (section F, planner build). When the slice passes, make ONE local git commit on the current branch (git add -A; git commit -m "<slice> ..."; never push). Return what you measured (numbers), what you fixed and what is still open.`, { label, phase: phaseName, schema: REPORT }), 2)
})()

const slice12 = gate('SLICE 1-2 CHECK: baseline + stairway and placement', 'Phase 3 planner core', ['WP-01', 'WP-03', 'WP-04', 'WP-06', 'WP-14'], `Per IMPLEMENTATION_PLAN section 4 slices 1 and 2: confirm the benchmark baseline is saved and the scorer reproduces the diagnosis failures; re-schedule the v04 plans with tools/planner/reschedule.mjs where their ends certify and show A7 = 0 and A9 = 0 on the re-scheduled plans.`)

const slice3 = (async () => {
  await Promise.all(['WP-02', 'WP-05', 'WP-07', 'WP-08', 'WP-09', 'WP-10', 'WP-11', 'WP-12', 'WP-13', 'WP-16'].map(d => done[d]))
  await slice12
  let last = null
  for (let round = 1; round <= 4; round++) {
    last = await runWithRetry(() => agent(CONTEXT + `\nYOUR TASK: SLICE 3 - THE PLANNER IN SHADOW (round ${round}). Run the planner in shadow mode (rules.planner.engine = "shadow" via tools/planner/shadow.mjs and the benchmark runner) on C1 (the 8 samples) and C2 (the 94 bench intakes). Target per IMPLEMENTATION_PLAN section 4 slice 3: A2, A3, A5, A6, A10, A11, A13 = 0 on C1; properties P5 and P8 green; no crash, no 'unknown' verdict, every plan certified. Read the 8 shadow summaries yourself as a coach would. Find the root cause of every failing metric (in the planner, not by loosening the scorer), fix it with a test, and re-run. Also report the C2 score distribution against design/bench/BASELINE.md and the p50/p99 time per plan. Previous round: ${last ? last.summary.join(' | ') : 'first round'}. In your summary's FIRST line write exactly "SLICE3 PASS" if every slice-3 criterion holds on C1, otherwise "SLICE3 FAIL: <failing criteria>".`, { label: 'slice 3 shadow scoring r' + round, phase: 'Phase 4 integration', schema: REPORT }), 2)
    if (last && /^SLICE3 PASS/.test((last.summary[0] || '').trim())) break
  }
  return last
})()

await Promise.all(WPS.map(w => done[w.id]))
const s3 = await slice3
log('Work packages done: ' + WPS.filter(w => results[w.id] && results[w.id].review && results[w.id].review.verdict !== 'fail').length + '/' + WPS.length + '; slice 3: ' + (s3 ? s3.summary[0] : 'n/a'))

// ---- slices 4-6 + gate (WP-20) + migration (WP-21) ----
phase('Gate and switch')
const WPSUM = WPS.map(w => w.id + ' ' + (results[w.id] && results[w.id].review ? results[w.id].review.verdict : 'n/a') + (results[w.id] && results[w.id].impl.open_issues.length ? ' open: ' + results[w.id].impl.open_issues.slice(0, 3).join('; ') : '')).join('\n')
let gateRes = null
for (let round = 1; round <= 4; round++) {
  gateRes = await runWithRetry(() => agent(CONTEXT + `\nYOUR TASK: WP-20 - GRID, CERTIFICATION, TIMING, THE GATE (round ${round}) plus slices 4-6. Package status:\n${WPSUM}\nSlice 3: ${s3 ? s3.summary.join(' | ') : 'n/a'}\nImplement WP-20 per IMPLEMENTATION_PLAN section 3 (tools/planner/grid.mjs, certify-grid.mjs, bench-time.mjs, staircase-price.mjs, tests/golden/planner-grid.json) and drive slices 4 (athletic and room: A18), 5 (offers and words: A16, A17 = 0; the spec 8.3 block renders in EN and ES) and 6 (formats: samples 04 CrossFit class and 05 bootcamp at A1-A13 = 0) in shadow mode, fixing root causes with tests. Then evaluate THE GATE of spec 13.3 on C1 + C2: every acceptance row A1-A24 (100% of trained groups at or above floor or explicitly listed; 0 avoidable flat weeks and one progression entry per trained group per week; 100% of days within minutes or told with an offer; 0 hard-rule violations; determinism; no plan's score below its baseline score; p99 time within budget or the node cap documented). Write design/bench/GATE.md with the full table (baseline vs planner per metric, score distribution, the 8 samples). Make a local commit when done. FIRST summary line: exactly "GATE PASS" if every gate item holds, else "GATE FAIL: <items>". Previous round: ${gateRes ? gateRes.summary.join(' | ') : 'first round'}`, { label: 'WP-20 gate r' + round, phase: 'Gate and switch', schema: REPORT }), 2)
  if (gateRes && /^GATE PASS/.test((gateRes.summary[0] || '').trim())) break
}
const gatePassed = !!(gateRes && /^GATE PASS/.test((gateRes.summary[0] || '').trim()))
log('Gate: ' + (gateRes ? gateRes.summary[0] : 'n/a'))

const migrate = await runWithRetry(() => agent(CONTEXT + `\nYOUR TASK: WP-21 - MIGRATION AND SWITCH. Gate result: ${gateRes ? gateRes.summary.join(' | ') : 'n/a'}.\n${gatePassed ? 'The gate passed: do the full WP-21 of IMPLEMENTATION_PLAN section 3 - switch the default to the two-stage planner (rules.planner.engine = "two_stage"), delete or retire the old dosing code per the hand-over rule, convert the ten tests/review-*.test.mjs files into rule-id properties or retire each with a written reason, update tools/generate-samples.mjs and tools/sweep.mjs, regenerate the 8 sample plans (now allowed), update engine/README.md, engine/CONTRACTS.md, samples/SAMPLES.md and docs/ pages that describe the engine.' : 'The gate did NOT fully pass: make the two-stage planner the default ONLY for the intakes/plan types where every gate row holds (document the exact condition in engine/DECISIONS.md and GATE.md) and keep v04 for the rest; regenerate the 8 sample plans with the planner where it is the default; list precisely what blocks the full switch.'} Run the full suite and the benchmark (results_planner.json + PLANNER.md beside the baseline, with the per-plan score comparison). Make a local commit. Return the numbers.`, { label: 'WP-21 migration + switch', phase: 'Gate and switch', schema: REPORT }), 2)

// ---- coach-eye review loop ----
phase('Coach review')
const SAMPLES = ['01-swimming', '02-football', '03-soccer', '04-crossfit-style-bootcamp', '05-bootcamp', '06-full-body-aesthetics', '07-push-pull-legs', '08-pickleball-genpop']
const reviewAll = (round) => parallel(SAMPLES.map(name => () => agent(CONTEXT + `\nYOUR TASK: COACH-EYE REVIEW (round ${round}) of samples/plans/${name}.* (the .md, the .es.md if present, the .json; intake in samples/intakes/). First study how Lalo programs: all coach answer files (round 3 newest), docs/01-philosophy/, docs/02-model/, BLAZE_CAMP_BRAIN.md, the profile in synthesis/04_profiles.json, and his real programs decoded in analysis/programs/*.md. Grade as he would - would he hand this to a client today? A = as is; B+ / B = after small tweaks; C = several real coaching problems; D = would not use. Check exercise choice and order, pairing, core first, power before strength, horizontal before vertical, axial loading, exercises and sets per group per session, floors on trained groups and the honest 'not trained directly' list with the offer, the stairway climbing every week (sets or the stated progression), time fit, effort language and drift, bilateral:unilateral share, athletic work for the sport and its climb, aerobic work, focus muscles, block toggles and superset recommendations, block-to-block variations, tests, Spanish quality if ES, the disclaimer line, and anything un-coach-like. Every problem: where / problem / rule / severity / ENGINE fix hint.`, { label: 'coach review r' + round + ': ' + name, phase: 'Coach review', schema: GRADE }).then(r => r ? { name, ...r } : null))).then(a => a.filter(Boolean))
const good = (g) => /^(A|B\+)/.test((g || '').trim())
const needsWork = (rs) => rs.length < SAMPLES.length || rs.some(r => !good(r.grade) || r.violations.some(v => v.severity === 'blocker'))
const fmt = (rs) => rs.map(r => '### ' + r.name + ' - grade ' + r.grade + '\n' + r.violations.map(v => '- [' + v.severity + '] ' + v.where + ': ' + v.problem + ' (rule ' + v.rule + ') -> ' + v.engine_fix_hint).join('\n')).join('\n\n')

let reviews = await reviewAll(1)
const history = [{ round: 1, grades: reviews.map(r => r.name + ' ' + r.grade) }]
log('Coach review round 1: ' + history[0].grades.join(', '))
let round = 1
while (needsWork(reviews) && round <= 4) {
  const issues = fmt(reviews)
  const AREAS = [
    { key: 'planner core (tiers, oracle, stairway, placement, formats, offers)', own: 'engine/plan/*.mjs, tools/planner/*, model planner rules via tools/fixture/planner-rules.mjs' },
    { key: 'athletic plan, selection, laterality, dose', own: 'engine/plan/athletic_plan.mjs, laterality.mjs, engine/athletic.mjs, select.mjs, dose.mjs, budget.mjs' },
    { key: 'validate, render, words, Spanish', own: 'engine/validate.mjs, render.mjs, explain.mjs, tools/fixture/planner-words.mjs, i18n' },
  ]
  for (const a of AREAS) {
    await runWithRetry(() => agent(CONTEXT + `\nYOUR TASK: FIX ROUND ${round} - ${a.key}. You own: ${a.own} (+ tests). Coach-eye reviews of the current plans:\n${issues}\nFix every blocker and major issue in your area at the root (a rule, a constraint, a tier order, data - never a hand-edited plan), each with a property test tied to a rule id; minors where cheap. If a fix needs a coach decision, use the spec default and record it. Then run the full suite, the benchmark (no plan's score may drop: run.mjs --compare) and regenerate the 8 samples. Local commit.`, { label: 'fix r' + round + ': ' + a.key.split(' ')[0], phase: 'Coach review', schema: REPORT }), 2)
  }
  round++
  reviews = await reviewAll(round)
  history.push({ round, grades: reviews.map(r => r.name + ' ' + r.grade) })
  log('Coach review round ' + round + ': ' + history[history.length - 1].grades.join(', '))
}

const final = await runWithRetry(() => agent(CONTEXT + `\nYOUR TASK: FINAL REPORT. Run node --test tests/, the full benchmark with --compare against the baseline, and generate the samples once more. Write ${BASE}/samples/STATUS_planner.md for the coach in plain language: what the new planner is and why it is better (measured: baseline vs now on the 94-plan benchmark - mean score, hard violations, flat weeks, days over time, floor misses), the final grade of each of the 8 sample plans with the remaining issues, the coach decisions D1-D15 used as defaults that he should confirm (each with the measured trade-off table from tools/planner/decision-table.mjs), and what is still open. Also write ${BASE}/round4_questions.json: the D1-D15 decisions (only the ones that change plans materially) as plain-language questions in the same format as round3_questions.json (ids R4-...), each with the default as the proposal. Local commit. Latest reviews:\n${fmt(reviews)}`, { label: 'final status + round 4 questions', phase: 'Coach review', schema: REPORT }), 2)

return { packages: WPS.map(w => ({ id: w.id, verdict: results[w.id] && results[w.id].review ? results[w.id].review.verdict : 'n/a', open: results[w.id] ? results[w.id].impl.open_issues : [] })), slice3: s3 && s3.summary, gate: gateRes && gateRes.summary, gatePassed, migrate: migrate && migrate.summary, history, finalReviews: reviews.map(r => ({ name: r.name, grade: r.grade, blockers: r.violations.filter(v => v.severity === 'blocker').length, majors: r.violations.filter(v => v.severity === 'major').length })), final: final && final.summary }
