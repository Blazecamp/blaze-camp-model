# Progression Verification

Date: 2026-10-10. Branch: `planner-build`. Authority: [coach answers CX-01..04](../coach_answers_codex_2026-10-10.md).

## Bottom Line

The isolated progression component is implemented and independently tested. It supports faster increases when needed, weeks with unchanged sets and reps/load progression, holding sets at the ceiling, and editable day/week sets with fresh checks.

**This is not yet the complete workout generator.** The default engine is unchanged. No planner-build workflow, public release, website, tracking or personal-data storage was added. The full-build readiness flag remains false.

## What Works

| Component | Verified behavior |
|---|---|
| Endpoint calculation | Finds an accelerated curve when required, within an explicit numerical tolerance. No former `lambda <= 1` restriction. Numerical failure is reported as unresolved, not as proof no program can work. |
| Whole-set schedules | Matches supplied start/final integer endpoints; permits multiple added sets; preserves nondecreasing sets; supports deterministic group-day alternation and shared boundaries between segments. |
| Flat-set weeks | Can progress reps, then request the next available load increment. Load instructions are conditional on maintaining prescribed RIR and technique, not predicted kilograms or guaranteed performance. |
| At the ceiling | Holds sets; uses reps/load instructions. Reports unresolved progression if neither is available. Never invents set headroom or divides by zero. |
| Following blocks | Rounds after each block using exact rational arithmetic; stays within supplied ceilings. Rejects imported starts above the ceiling. |
| Arithmetic validation | Checks every week, not just endpoints: main-day floors, all-day ceilings/targets, optional daily caps, item bounds, nondecreasing sets/credits, nonincreasing RIR and session time including declared pairs. |
| Manual set edits | Preserves the requested edit, removes the old validation/certificate, recalculates checks and reports conflicts. Does not silently redistribute other work. |

## Concrete Checks

These are arithmetic examples, not training recommendations. Rates, bounds and rep ranges are supplied inputs. The examples use half-up integer rounding and explicit numerical controls.

| Example | Result |
|---|---|
| Six weeks, 3 to 4 sets, reference rates 3%, 3%, 5%, 5%, 5% | Scale about 1.41225; sets `3, 3, 3, 3, 4, 4`. The target is reached; the last flat-set week needs reps/load progression. |
| Twelve weeks, 12 to 22 sets, five 3% then six 5% transitions | Scale about 1.38698; sets `12, 12, 13, 14, 14, 15, 16, 17, 18, 19, 21, 22`. The two-set increase is allowed. |
| Twelve weeks, 15 to 22 sets, same reference rates | Sets `15, 15, 16, 16, 17, 17, 18, 19, 19, 20, 21, 22`; preserves the coach's final four weeks. |
| Start 20, fixed ceiling 25, 5% per completed block | Starts `21, 22, 23, 24, 25, 25, 25, 25`. No ceiling overrun. |
| Five weeks at 3 sets, rep range 8-10 | Reps `8, 9, 10, 8, 9`; week four conditionally requests the next load increment. |
| A middle week has higher fixed time than the last week | Middle-week violation is detected even when the endpoint fits. |
| User raises one day's sets above its time/volume allowance | Edit remains intact; specific conflicts are returned and previous validation is discarded. |

Rounding can reach the set ceiling before the final week. The reference does not optimize a "first arrival only in the last week" preference; reps/load progression remains necessary during a resulting plateau. It also does not claim that a mathematically valid acceleration is appropriate for every person.

## Tests And Reproduction

The focused suite passes **48/48 tests**. Tests were written independently of the numerical kernel and include tiny exhaustive reference spaces, 100 seeded group-prefix cases, floating-point/safe-integer extremes, immutability, invalid input, saturation, whole-week accounting and conflicting edits.

Independent code review also found and resolved two edge defects: floating-point cancellation in pair-time savings, and stale validation metadata surviving edits. Pair time now sums nonnegative components; edits clear `validation`, `certificate`, `certified` and `status` at the supported plan/week/day/item scopes without deleting identically named credit groups. Both fixes have dedicated regression tests.

```sh
node --test tests/progression/stairway.test.mjs tests/progression/prescription.test.mjs
node --test --test-reporter=spec tests/
node tools/check-model.mjs
git diff --check
```

Final full-suite rerun: **1,139 tests passed, zero failures, zero skipped**, including the 48 progression tests and 56 mocked workflow tests (about 133 seconds). Read-only model checks report **zero errors and zero warnings**. Constraint JSON parses, referenced files exist, the full-build readiness flag remains false, and `git diff --check` passes. No default-engine, compiled model, sample, synthesis or workflow files changed in this step.

A passing test suite verifies the stated software contract; it is not evidence of clinical safety, optimal training outcomes or universal sport/population coverage. Mocked workflow tests do not prove real-host orchestration or a completed planner build.

## Files

- [Numerical scheduling reference](progression/stairway.mjs)
- [Progression, arithmetic validation and edits](progression/prescription.mjs)
- [Independent scheduling tests](../tests/progression/stairway.test.mjs)
- [Independent prescription/edit tests](../tests/progression/prescription.test.mjs)
- [Mathematical assumptions and replacement proofs](PROGRESSION_MATH.md)

## Next Integration Gate

Connect this component to the real exercise library and program structure. Use actual credited sets rather than averaged approximations, certify time envelopes for every covered week, integrate exercise-level placement and the final plan/edit schema, and settle the remaining peak-selection objective and proof claims. Then run the complete planner's technical checks and coach-reviewed sample programs before any production switch.

The reference validator deliberately returns `certified: false` and labels a passing result `valid_subset`. It does not inspect clinical suitability, exercise eligibility, athletic-dose limits, equipment, complete ordering/pairing policy or all model constraints. Those are mandatory integration work, not guarantees supplied by these tests.
