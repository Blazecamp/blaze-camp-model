# Independent audit of Codex's published Blaze Camp work

Date: 2026-10-10. Auditor: Claude Code, as an independent reviewer. Branch: `review/claude-codex`, created from the verified `planner-build` tip.

## Revisions audited

| Ref | Commit | Verified |
|---|---|---|
| `origin/planner-build` tip | `640b42b75ca8f83d96037ac0768ed1e6c94e2c64` | Yes. It is the branch tip, and nothing newer was on the remote when fetched. Its only change over `f76884e` is `HANDOFF.md` (4 lines added, 2 removed). |
| Clarification and workflow gate | `585b0c3d5c27f0a579c6a1bfcb595581e8237801` | Yes. Parent `04637ed`; 14 files changed. |
| Progression reference | `f76884eb6efb0902cce6b2e3530fb5301b133b98` | Yes. Parent `585b0c3`; 12 files changed. |
| `origin/review/codex` tip | `9483ea18e52fc023ac996411337547f1704878a4` | Yes. It is the branch tip and adds only `reviews/codex-model-review.md` on top of `c13cbaa`. |
| `origin/main` | `04637edf06db80940b55af4549689d2ee444e448` | Yes. Unchanged, and it is the merge base of `planner-build`. |

This branch adds only this report and `tests/audit/claude-codex-audit.test.mjs`. I did not run the planner-build workflow, flip `implementation_ready`, switch engines, regenerate model or sample files, or touch `main`.

## Plain-English verdict

**What is correct:**
* The isolated arithmetic is sound for the cases it claims to cover.
* The endpoint solver finds the right multiplier, including multipliers above 1. Integer schedules hit the exact start and end, never go down, and may add several sets in one week, as CX-01 allows. The group-day alternation matches PLANNER_SPEC 5.2(c).
* Pair (superset) time matches a round-by-round simulation of the engine's own superset rule.
* Block-to-block rounding stays bounded.
* I checked all of these against my own reference calculations, not against Codex's helpers.
* The coach clarification record, `coach_answers_codex_2026-10-10.md`, is faithful to the quoted answers. It clearly limits what CX-01..04 approve.
* I reproduced the reported test results: **1,139 / 1,139 pass**, including 48 progression tests and 56 mocked workflow tests.

**What is incorrect** (all fixable, none fatal):
1. Same-load rep increases are written as unconditional targets. They quietly assume the person keeps getting stronger.
2. The time-certification design assumes per-set time changes only when exercises change. CX-02 rep progression breaks that assumption.
3. Edits leave approval-like metadata in place unless it uses one of four key names.
4. A loose numerical tolerance can return `status: 'ok'` with most of the growth missing.
5. The only "accelerated" signal comes from the smooth curve. It can say "not accelerated" while the real integer plan exceeds both the default pattern and the former limits.
6. Half-up rounding can reach the ceiling weeks early. That conflicts with the approved R3-VOL-04 wording ("reaches its ceiling exactly in the last week").

**What is unfinished** (clearly disclosed by Codex; not a defect in the scoped component):
* None of this is wired into the engine: no `engine/plan/`, nothing imports `design/progression/`.
* There is no actual-credit endpoint selection and no optimizer. The leximin objective is a proposal only.
* There is no covering-envelope builder.
* There is no exercise-level placement and no `plan/2` edit contract.
* The workflow has never run on a real host, and its safeguards depend on prompts.
* The readiness flag correctly stays `false`.

**Bottom line:** Codex's own status labels ("isolated reference verified, integration pending") are mostly honest. The HANDOFF phrase "independently tested" overstates things: the same author wrote the tests and the code. Treat this as a correct, partially tested arithmetic kernel. It is not a planner. It needs the fixes below before anyone builds on it.

---

## Findings ranked by severity

Severity reflects the risk to the eventual product if the work is integrated as it stands. "Repro" points to a test in `tests/audit/claude-codex-audit.test.mjs` (AT-n) or a one-off command.

### HIGH-1: Time certification misses flat-set rep-progression weeks (proof and spec mismatch)

* **Where:**
  * `design/PLANNER_SPEC.md:547` says "Per-set seconds change only when the exercises change (exercise-block starts)".
  * `design/PROGRESSION_MATH.md` §4.3 and §4.4 (P5).
  * `design/progression/prescription.mjs:185-194` charges work as `sets × reps × secondsPerRep`.
  * `prescription.mjs:70-73` raises reps on flat-set weeks.
* **Problem:**
  * Under CX-02, reps rise during weeks where sets stay the same, then reset after a load step. So per-set work seconds change from week to week inside one exercise block, and they do not only go up.
  * The epoch-dominance procedure in spec 5.3 assumes per-set cost is constant between exercise blocks. Built that way, it treats the endpoint week as dominating earlier weeks that actually cost more.
  * P5 is still correct if the covering envelope truly bounds every week's work. But the spec tells the implementer to build the envelope from a premise that is now false.
* **Repro (AT-6):** sets `4,4,4,5`, reps 6→12 by 6, then a load step resets reps to 6.
  * Modeled seconds by week: 176, **272**, 176, 220. Limit: 250.
  * Week 1 and the endpoint week both fit. Week 2 does not.
  * `evaluatePrescription` (direct per-week check) does catch it. An envelope built per spec 5.3 would not.
* **Fix:**
  * Drop the "constant per-set seconds" premise.
  * Either include each week's rep and rest prescription in `cost(w)`, or skip epoch envelopes and evaluate every week directly. Direct evaluation is cheap: N ≤ 52 weeks × a handful of days.
  * Also reconcile the time model. The engine (`engine/timefit.mjs:125-158`) uses minutes per set by time class, which does not depend on reps. The prototype uses per-rep time. Pick one model and use it everywhere.

### HIGH-2: Rep progression presumes future performance (unconditional)

* **Where:** `design/progression/prescription.mjs:70-73` and `83-85`. Only `action === 'load'` gets `conditional: true` and a condition string.
* **Problem:**
  * Example output: 3×8 @ 3 RIR → 3×10 @ 3 RIR → 3×12 @ 3 RIR at the same load.
  * By the definition of RIR (reps done + reps in reserve ≈ reps to failure at that load), that is an implied 11RM → 13RM → 15RM at one weight. The person would need to gain about two reps of capacity every week.
  * The output gives this as a fixed target with `conditional: false`, which is exactly the "pretend to know future performance" pattern the brief asked me to rule out.
  * The load step is properly conditional. The rep steps are not.
  * When RIR also drops (the approved 3 → 2 → 1-2 → 1 drift), the presumption shrinks but does not go away.
* **Repro:** AT-10 (todo).
* **Fix:**
  * Make every flat-week instruction conditional, as in standard double progression: "if all sets reached the top of the range at or above the prescribed RIR with good technique, add reps or add load; otherwise repeat."
  * Give a rep *range* and a rule, not a predicted number.
  * This is wording and data shape in a prewritten, output-only template. It needs no tracking or check-in, so it stays within R3-VOL-02.

### MEDIUM-1: Edits keep stale approval and certification metadata

* **Where:** `prescription.mjs:238-248`. The denylist is `validation`, `certificate`, `certified`, `status`, applied at the plan, week, day and item levels only.
* **Problem:**
  * After `applySetEdits`, these all survive: `approved`, `approvedBy`, `fingerprint`, `summary`, `meta.validation`, `groups[].certified`, and item `approval`.
  * The returned `plan` object carries no edited or uncertified marker of its own. `edited` and `validation` sit beside it, so a caller that saves only `plan` loses them.
  * This is item 8 of the brief: "invalidate stale approval metadata".
* **Repro:** AT-9 (todo).
* **Fix:**
  * Rebuild the edited plan from an allowlist of prescription fields.
  * Stamp `plan.edited = true` and `plan.certified = false`.
  * Recompute any summary from the edited weeks.

### MEDIUM-2: Unbounded `logTolerance` can certify a bad curve

* **Where:** `stairway.mjs:85-86`, `112`, `137` and `173`. The tolerance only has to be greater than 0. The final value is pinned to `peak` whatever the remaining error.
* **Repro (AT-8, todo):** `solveEndpointCurve({start:10, peak:20, rates:[.01,.01,.01], numerics:{logTolerance:0.9, maxIterations:0, maxBracketDoublings:10}})`.
  * Returns `status:'ok'`, `lambda: 4`, residual −0.575.
  * Values: 10, 10.40, 10.82, then a pinned jump to **20** (+85 % in one transition).
* **Fix:**
  * Reject `logTolerance` above a small bound (for example 1e-6).
  * Or return `unresolved` when |residual| is large relative to the requested growth.
  * These controls are engineering parameters. They still must not be able to turn a numerical failure into "ok".

### MEDIUM-3: The acceleration flag disagrees with the real integer plan

* **Where:** `stairway.mjs:182` (`accelerated: lambda > 1`). Integer outputs (`tableFacts`) report rises, but nothing compares them with the default pattern or the former limits.
* **Problem:**
  * The clarification record's engineering requirement 2 reads "Show when the default rate pattern was accelerated".
  * Example: 12 weeks, 10 → 11. The curve gives λ ≈ 0.21 and `accelerated: false`. Yet the integer plan rises 10 % in one week, above both the 3 %/5 % pattern and the former 7 % per-group limit.
  * The reverse can also happen: λ slightly above 1 because of tolerance, while every integer step stays small.
* **Repro:** AT-7.
* **Fix:** Derive acceleration from the integer schedule. For each group and week, report the actual rise, the default-pattern rise, and whether the former 7 % per-group or 10 % total limits were exceeded. Report these as information only, not as caps (CX-01).

### MEDIUM-4: Half-up rounding conflicts with the approved arrival timing

* **Where:** the rounding choice in `stairway.mjs` (`quantize`, `half_up`). The test `tests/progression/stairway.test.mjs:81` ("half-up ... may reach the ceiling early and then hold it") treats early arrival as acceptable.
* **Problem:**
  * R3-VOL-04 was approved ("✅ RIGHT") on the wording "each muscle's steps are sized so it reaches its ceiling exactly in the last week".
  * CX-03 allows *holding* at the ceiling once reached. It does not approve reaching it early.
  * With `half_up`, 12 weeks 10 → 11 hits 11 in week 8 and stays flat for 5 weeks (AT-7). 6 weeks 3 → 4 arrives in week 5.
  * With `floor`, arrival is always the last week (floor(h·p) < h for p < 1), but small headroom gives long flat stretches.
  * Both roundings reproduce the coach's 15 → 22 example's last four weeks (19, 20, 21, 22). Both are "valid" under P1.
* **Fix:**
  * Default to an arrival-preserving rounding: floor, or half-up capped at h − 1 before the last week.
  * Keep half-up only as an explicit option.
  * If the team prefers early arrival, put it to the coach as a question. It is not a settled rule.

### MEDIUM-5: P4 / P5 assume "fixed active slots", but the code accepts zero starts

* **Where:**
  * `PROGRESSION_MATH.md` §2 (fixed active slots), §4.2 (P4) and §4.4 (P5).
  * `prescription.mjs:135-136` allows a pair changeover saving up to `ca + cb`.
  * `prescription.mjs:182` makes a pair active only when both sides have more than 0 sets.
  * `scheduleNestedSets` and `scheduleGroupPrefixes` accept 0 start sets (`stairway.test.mjs:301` exercises `[0,3]`).
* **Problem:** When a slot goes from 0 to 1 set and that switches its pair on, modeled time can *drop*: the change is `work_a + (max(ra,rb) − rb) + ca − saving`, which is negative when `saving > ca + work_a`. A covering argument across such a week is then invalid.
  * With the spec constants (CH = 60, CHP = 30, so saving = 60 = ca), the change is never negative.
  * The validator, however, accepts larger savings.
* **Repro (AT-5):** a 0 → 1 activation lowers modeled seconds.
* **Fix:**
  * Either require `saving ≤ min(ca, cb)`, which makes P4 hold through activation.
  * Or require that no slot or pair changes its active state inside a certified epoch, and check every week where that happens directly.

### MEDIUM-6: Workflow safeguards depend on prompts; some checks are not independent

These matter only once the workflow is launched. It is currently fail-closed, because preflight requires `implementation_ready=true`.

* **Ownership is not enforced** (`workflows/planner_build.js:128-142`).
  * WP-01..WP-10 implement and review at the same time in one working tree. The package reviewer may also "repair".
  * `IMPLEMENTATION_PLAN.md` §2 defines one owner per file, but `files_written` is never checked against it.
  * The mocked "writer barrier" tests only check the order of calls.
* **The fingerprint check can be satisfied by copying** (`planner_build.js:170-171`). Coach reviewers are *given* the expected fingerprint and told "do not simply echo". The equality check then passes for any reviewer that does echo it. Fingerprints come only from agents; there is no deterministic fingerprint script.
* **The promotion approval could be created during the run** (`planner_build.js:116`, `201-202`).
  * The approval record is a repository path checked by an agent.
  * Writer agents earlier in the same run could create or edit it.
  * The path check rejects only a leading `/` and `..`.
* **Package order is fragile** (`planner_build.js:129`). `deps` is resolved from `done[...]` when the package starts, so the order of `WPS` must be topological. Today it is. A dependency listed later would raise a TypeError and block the run; that fails safe but is fragile.
* **What is correct:**
  * Retries happen only on read-only stages.
  * Mutating failures stop the run.
  * Resume is explicitly rejected.
  * Failed dependencies skip their dependents.
  * Promotion needs D1/D4/D13 plus every reported default.
  * The 56 mocked tests check this control flow well. As Codex says, mocks do not prove the workflow works on a real host.
* **Fix:**
  * Add a deterministic `tools/fingerprint.mjs` and have the workflow compare its output.
  * Run packages in separate worktrees (or one after another), and diff the files they wrote against §2.
  * Require the approval record to be committed before the run starts, with its blob hash passed in `args`.
  * Sort the packages topologically in code.

### LOW findings

| Id | Finding | Where | Recommendation |
|---|---|---|---|
| L1 | "Independently tested" overstates what was done: the same author wrote the code and the tests. Some oracles are weak. The "tiny exhaustive reference" only checks that the result is *some* monotone path, not the quantizer's value. The random group-prefix test rebuilds weeks from the implementation's own `addSequence` and never checks the alternation rule independently (only 2 hand-written cases). | `HANDOFF.md:30`, `PROGRESSION_VERIFICATION.md:7,41`; `stairway.test.mjs:138-166,312-323` | Reword as "tested by its author". AT-2 and AT-3 now supply exact-rational and exhaustive 5.2(c) oracles (more than 600 cases); all pass. |
| L2 | `scheduleEpochs` joins only per-coordinate nested schedules. There is no epoch composer for the preferred group-prefix construction, so the caller must chain `finalNextDayIndex` by hand. | `stairway.mjs:287-316` | Add `scheduleGroupPrefixEpochs`, which carries the cursor and checks boundaries. |
| L3 | Edits are item-level sets only. There is no day- or week-level "group +N sets" operation and no reps edit. `planProgression` throws on decreasing sets, so it cannot rewrite instructions for an edited week. | `prescription.mjs:233-262`, `61` | Define edit operations in the `plan/2` contract. Let the progression card regenerate from the edited sets. |
| L4 | Edit conflicts carry no severity. A legitimate week-5 reduction (allowed by CX-02) is reported in the same list as a time overrun or a ceiling breach. | `prescription.mjs:143-230` | Classify each conflict: `hard_rule` (time, ceiling, effort band, H-rules), `plan_shape` (monotonicity, endpoint) or `info`. |
| L5 | Interpretation drift. `rules_as_constraints.json > policy_amendment.resolutions[CX-02]` says "*Occasional* same-set weeks ..." and "nonsaturated accumulation progresses overall". The coach said "yes", with no frequency limit. | `design/rules_as_constraints.json` | Drop "occasional", or label it PROPOSED. |
| L6 | Arithmetic outside the declared scope is never checked: H18 (2-4 exercises per group per day; an edit to 0 sets can leave 1), calves 1×3, H07 spine days, order and pairing, equipment, 60+ locks. This is disclosed as out of scope. | `prescription.mjs:227-229` | Mandatory part of integration (see the path below). |
| L7 | `node --test tests/progression/` (directory form) fails with "1 test, 1 fail", because the subdirectory has no `package.json`. The documented file-list command works. | `tests/progression/` | Document the file-list form only, or add a runner. |
| L8 | `advanceBlocks` can stay stuck below the ceiling (for example start 1 × 1.3 rounds back to 1 forever while the ceiling grows). This is disclosed in §7.1. It is an engineering policy, not a coach rule; CX-03 approved no next-block formula. | `prescription.mjs:24-43` | Keep it labeled PROPOSED. Report "no set growth" to the user explicitly. |

---

## Mathematical review (items 1-6 of the brief)

* **Endpoint curve (§3.1).** f(λ) = Σ log(1+λrᵢ) − log(P/S) is continuous and strictly increasing when some rᵢ > 0, and it tends to infinity. The root is therefore unique, and doubling then bisecting is correct.
  * I checked λ against the closed form ((P/S)^(1/n) − 1)/r for equal weights. The relative error is ≤ 1e-9 across five cases, up to P/S = 10⁶ (AT-1).
  * Overflow paths are sound: `logFactor` falls back to `log λ + log r`, and `expm1` scaling is used.
  * Zero start (S = 0 < P) and all-zero weights correctly return `unreachable`, scoped to this curve only.
  * Defect: the tolerance is not bounded (MEDIUM-2).
* **Units.** Curve values may be credited sets, while schedules are physical own sets. Progress p is unitless, so carrying p across is dimensionally fine. But helper credits mean the realized credited trajectory ≠ the ideal curve. §3.1 discloses this. Nothing in the code computes the realized credited curve; integration must.
* **Quantizer (P1).** The exact decomposition of the IEEE double into significand and exponent is correct for normal and subnormal numbers. Half-up equals floor((2hk + D) / 2D). Verified against BigInt dyadic rationals for h up to 2⁵³ − 4 (AT-2). P1's proof is correct.
* **Group prefixes (P2, P3).** The proofs are correct. The implementation matches an independent reading of 5.2(c) exhaustively: widths 1-3, room 0-2 per day, every optional mask and cursor; the add sequence, final cursor and every weekly prefix agree (AT-3). Multiple additions per week are allowed.
* **Time monotonicity (P4).** The prototype's pair formula, `shared·max(r) + unshared rests + changeovers − saving`, equals spec 5.2(b) algebraically and matches a round-by-round superset simulation exhaustively (AT-4). P4 holds for fixed active slots. It fails when a slot switches on (MEDIUM-5).
* **P5 (sandwich).** Correct under its stated assumptions. But one premise the spec uses to *build* the cost cover is false under CX-02 (HIGH-1), and the activation assumption is not enforced (MEDIUM-5). The ratio counterexample (1,1)/(1,3)/(3,3) in §4.4 is correct and honestly scopes the theorem.
* **Bounded block iteration (P6).** The proof is correct, and the code uses exact BigInt rounding. A fixed point exists at the absolute cap. Getting stuck below the cap is possible and disclosed.
* **Endpoint selection and optimizer (item 6).** **Nothing is implemented.**
  * §6.1 leximin is labeled INFERRED/PROPOSED. Its finite-comparator argument is trivially correct, and it explicitly does not claim the candidate set is complete.
  * Spec 7.6 G5/G6 still use average credits (`a_g`, `h_g`); the spec labels this `best_found` at most.
  * Status categories (exact, best found, unsupported, unresolved, infeasible) are distinguished correctly in the kernel's return values. That is the right design. There is nothing yet to optimize.
* **Credits, floors and ceilings (item 4).** `evaluatePrescription` uses actual per-item quarter-set credits (≤ 4 per group per set, matching the spec 7.1 aggregation). Floors use main days only; ceilings and targets use all days; daily caps include optional days. This matches spec 5.1 (`Q_g` versus `Qall_g`). There are no average-credit shortcuts in the kernel. The callers that would supply group-aggregated credits do not exist yet.
* **Complexity and limits.** `scheduleGroupPrefixes` runs in O(H × width) with an explicit `maxAdditions`. The curve is bounded by the iteration and doubling budgets. `advanceBlocks` is limited to 10,000 blocks. Safe-integer guards are present.

## What is tested, proved, proposed or missing

| Area | Tested implementation | Proof only | Proposed policy (not coach-approved) | Missing integration |
|---|---|---|---|---|
| Endpoint curve, λ > 1 | ✅ (author tests + AT-1) | §3.1 uniqueness | uniform λ scaling of 3 %/5 % weights; numerical controls | tolerance bound (M-2) |
| Integer schedules, multi-set weeks | ✅ (AT-2) | P1 | floor versus half-up choice (M-4) | integer-level acceleration report (M-3) |
| Group-day alternation | ✅ (AT-3) | P2, P3 | main-before-optional tie order | epoch composer with cursor (L2) |
| Exercise staircase inside a group-day | ❌ | §4.1 prefix property | n/a | `plan/placement.mjs` |
| Session time | ✅ per-week direct check (AT-4) | P4 (fixed slots) | per-rep time model | covering-envelope builder (H-1, M-5); one time model |
| Feasible endpoint certification | ❌ | P5 (conditional) | n/a | certified instance builder |
| Endpoint selection / optimizer | ❌ | §6.1 finite comparator | leximin; G5 ladder | actual-credit oracle |
| Flat-set reps/load | ✅, but unconditional reps (H-2) | n/a | rep step, reset to repMin | rep/rest envelope into time; wording EN/ES |
| Next-block rounding | ✅ | P6 | multiplier, cap increment, half-up | DER-09 migration |
| Edits | ✅ arithmetic subset; stale fields survive (M-1) | §7.3 (scope) | conflict reporting shape | `plan/2` edit schema; full rule recheck (L6) |
| Workflow | ✅ mocked control flow (56) | n/a | gates, rounds, D1/D4/D13 | real host run; deterministic fingerprint; ownership enforcement (M-6) |

## Commands and results (Node v22.22.0, this container)

| Command | Result |
|---|---|
| `git fetch origin`; `git rev-parse` / `git branch -r --contains` for the five commits | All exist on the stated branches. Tips: planner-build `640b42b`, review/codex `9483ea1`, main `04637ed`. |
| `node --test tests/` at `640b42b` (before audit tests) | **1,139 tests, 1,139 pass, 0 fail, 0 skip** (45 suites), 336 s wall time here (Codex reported about 133 s; my machine is slower). |
| `node --test tests/progression/stairway.test.mjs tests/progression/prescription.test.mjs` | 48 / 48 pass |
| `node --test tests/workflows/planner-build.test.mjs` | 56 / 56 pass (21 top-level tests) |
| `node --test tests/progression/` (directory form) | 1 fail: module resolution, not a code failure (L7) |
| `node tools/check-model.mjs` | `errors: 0, warnings: 0` (model 1.3.0, 731 exercises, 127 profiles, 2,595 EN = ES keys) |
| `git diff --check 04637ed 640b42b`; `git diff --check c13cbaa 9483ea1` | clean |
| `rules_as_constraints.json` parse | OK; `implementation_ready: false`, `reconciliation_status: progression_reference_verified_integration_pending` |
| `node --test tests/audit/claude-codex-audit.test.mjs` | 10 tests: 7 pass, 3 todo (the confirmed defects M-2, M-1, H-2) |
| `node --test tests/` with the audit file added | **1,149 tests: 1,146 pass, 0 fail, 3 todo** (338 s) |

I also reproduced every "Concrete Checks" row in PROGRESSION_VERIFICATION.md for the curve and schedules. For example, 12→22 half-up gives `12 12 13 14 14 15 16 17 18 19 21 22` with λ ≈ 1.38698, and 15→22 gives `15 15 16 16 17 17 18 19 19 20 21 22`.

## Verification limits

* I did not run the workflow on a real host (doing so was out of scope). My workflow review is code reading plus Codex's mocked tests.
* I made no scientific claims that need literature support. HIGH-2 rests only on the definition of RIR. A literature search on RIR accuracy failed (search quota exhausted), so I cite nothing. Nothing here says the model is safe, optimal or suitable for every population. Mathematical consistency is not training validation.
* The old engine v0.4 (`04637ed`) was outside the new-work scope, apart from re-running its tests and checks.
* `reviews/codex-model-review.md` (9483ea1) was read only as historical context. Its open questions predate CX-01..04, and its proposals are not approved rules.

## Prioritized path to a complete backend

1. **Fix the kernel defects:** H-2 (conditional rep instructions), M-1 (allowlist edits), M-2 (tolerance bound), M-3 (integer-level acceleration report), M-5 (activation rule). Each has a test ready to switch from `todo` to a normal test. Small.
2. **Make time certification correct.** Replace the epoch-dominance premise with direct per-week evaluation (or envelopes that include reps and rest). Choose one time model, either the engine's time-class minutes or per-rep, and use it for reps, rest, supersets, and week-1 and week-N tests. (H-1)
3. **Build the certified instance from real data:** the template, kept groups, exercises per group-day (2-4), actual credits with the spec 7.1 group aggregation, optional days, calves 1×3, and fixed stations and tests.
4. **Endpoint selection with actual credits:** a G5 replacement that evaluates real credited endpoints. Mark results `exact` only where they come from exhaustive search over a declared candidate set, otherwise `best_found`.
5. **Exercise-level placement** (the 5.2(a) staircase), plus group-prefix epoch composition (L2).
6. **`plan/2` contract:** focus muscles, block ids and on/off switches, superset recommendations, the "not trained directly" list, acceleration flags, conditional progression cards (EN/ES), edit operations with severity-classed conflicts (L3, L4), and a whole-model recheck after edits (L6).
7. **Workflow hardening before any launch:** a deterministic fingerprint tool, ownership enforcement, and an approval record committed before the run (M-6). Then a shadow run, the technical gates, and coach-eye rounds. Keep v0.4 as the default until promotion is separately authorized.

**Coach decisions that are genuinely needed** (everything else is engineering):
* **Arrival timing (M-4):** when rounding allows it, may a muscle reach its set ceiling before the last week and then hold it with reps/load (CX-03), or should it reach the ceiling exactly in the last week as approved in R3-VOL-04?
* **Remaining defaults D1, D4, D13:** already listed as required before promotion. No new decision was found that blocks the kernel fixes.
* **For discussion with the coach (not a defect):** CX-01 allows unlimited acceleration. Very short blocks with large headroom produce big jumps; for example 4 weeks, 10 → 30 gives `10 13 19/20 30`, up to +58 % in a week. Showing that up front, as engineering requirement 2 asks, is the agreed mitigation. Whether any limit is wanted remains his call.
