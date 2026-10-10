# design/spec_checks

Checks run while `design/PLANNER_SPEC.md` was written. They are evidence for the changes the spec makes to the winning design
(`design/design_two-stage.md`); they are not engine code. Plain JS, Node 22, no dependency. Every script imports the two-stage
prototype in `design/two-stage/proto/` read-only and writes nothing (outputs are shell redirects saved beside the scripts).

| Path | What it shows | Spec section |
|---|---|---|
| `fix/oracle.mjs`, `fix/stage1.mjs` | the prototype's oracle and stage 1 with the two repairs judge 2 asked for: rows built from the credit table, every later group left free in a keep question | 7.5, 7.6 |
| `fix/check_fixes.mjs`, `.out.txt`, `check_fixes.limits_drawn.out.txt` | both of judge 2's counterexamples now pass; oracle against brute force on a widened generator (own credit of 0, 2 and 4 quarter sets, hosted pattern stations that credit another group); keep vector against exhaustive enumeration (with one per-session limit for every group; the second output shows what the prototype's per-group 11 -> 14 rule does); the three samples unchanged | 7.5, 7.6, 12 |
| `stairway_v2.mjs`, `.out.txt` | the scheduler as specified: tier order `last, flat, hold, late, shape, land`, the final set of every group as late as the rises allow, the greedy "is there any schedule" test against the dynamic program, three tier orders on 4,000 random tables | 7.7 |
| `graft/oracle.mjs`, `graft/eval.mjs`, `graft/stage1.mjs` | the patched prototype plus the rules the spec grafts on: lead pattern stations, R-PARTNER, the pattern band, the smallest overrun, the 11-sets-a-session tier, an independent evaluator for all of it | 5.5, 5.6, 7.6 |
| `graft/run.mjs`, `run.out.txt` | decision table D1 (the 2 x 45 pickleball plan under the three readings) and the default plans of the three hard samples at several session lengths: 20 plans, 0 violations, 0 unknown verdicts | 14, Appendix A |
| `graft/aesthetics.mjs`, `aesthetics_75.out.txt` | sample 06 (aesthetics, L3, Focus glutes + side delts, 4 x 75) written out by hand from `model/templates.json`: the first full-size plan (8 groups, 4 days) any prototype of this panel has produced | 10, Appendix A |
| `graft/aes_budget.mjs`, `.out.txt` | the same plan at per-question budgets of 500, 2,000 and 20,000 nodes: what a small budget costs (legal in every case) | 10 |
| `graft/aes_twins.mjs`, `.out.txt` | the same plan with the twin days tied against untied: 20,967 nodes instead of 153,187 at the same budget | 7.5, 10 |

Reproduce:

```sh
node design/spec_checks/fix/check_fixes.mjs 600 20261010 400     # about 2 minutes; second seed: 600 777 400; without the 4th argument: limits drawn per group
node design/spec_checks/stairway_v2.mjs 4000 20261010            # about 1 minute
node design/spec_checks/graft/run.mjs                            # about 3 seconds; TRACE=1 prints every oracle question
node design/spec_checks/graft/aesthetics.mjs 75 20000            # about 1 minute
node design/spec_checks/graft/aes_budget.mjs 75                  # about 70 seconds
node design/spec_checks/graft/aes_twins.mjs 2000                 # about 12 seconds
```

Verdicts, node counts and set tables reproduce exactly. Times were taken on one laptop and will differ.

Limits. The instances are the prototype's hand-written ones (three samples) plus one more written for this check (sample 06,
without its optional days). The grafts are prototyped only as far as these runs need them: no room ladder, no tests inside the
day, no middle epochs, no twin "tied first, untied proof" protocol (the twin run ties them outright), no optional-day cells.
