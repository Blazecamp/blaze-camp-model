# Judge 2: mathematical rigor and robustness

Lens: are the guarantees real (floors, monotone climb, time fit)? Edge cases, infeasibility, numeric stability, determinism.
Written 2026-10-10. Read: `design/design_milp.md`, `design/design_two-stage.md`, `design/design_template-parametric.md`, and
the three prototypes behind them. I did not take the documents' numbers on trust: I reran the prototypes, wrote nine checks of
my own (`design/judge2/`, section 8), and tried to break each design's central claim with a constructed case.
Nothing outside `design/` was written. No git command was run.

Two terms used throughout. The **keep vector** is the list of muscle groups a plan trains directly, read in the coach's
priority order (R3-SES-02 step 2). The **oracle** is the search each design uses to answer "is there a legal plan that
trains these groups?".

---

## 0. Verdict

| Design | Score (1-10) | One-line reason on this lens |
|---|---|---|
| **two-stage** | **7.5** | The only design whose legality is a written theorem with its hypotheses, whose search uses whole numbers only, and whose oracle, scheduler and stage link were tested against brute force. I found two real holes in its "exact" claims; both are one-line fixes. |
| milp | 6.5 | The most complete model and the widest evidence (594 certified plans on the real template grid). But every "does not fit" rests on a floating-point LP, the solver it needs is not built, and the measured tail is 3 s at the 90th percentile and 24 s at the 99th on a laptop. |
| template-parametric | 5.5 | Fastest and simplest, and its plans are legal. But "does not fit is always a proof" is false: I built a case on a real template where it leaves a group untrained although its own oracle finds a legal plan. It also carries tolerances it says it does not have. |

**Winner: two-stage.** Its defects are local (one row, one set of free variables, one tier order). The milp design's weakness
is its engine, and the template-parametric design's weakness is its structure (rules where the other two have variables).

**The most important fact for whoever builds this:** in every run of every prototype, no plan broke a floor, dropped a set,
or passed its day limit. All three produce *legal* plans. They differ in whether "this group does not fit" can be trusted,
in what the numbers rest on, and in how long the answer takes. The recurring coach complaint closest to this lens (a
client left with only hinges because a time check over-cut) is a false "does not fit". Section 3 shows two for
two-stage (both narrow, both small fixes) and one for template-parametric (structural).

---

## 1. What I ran

All scripts and outputs are in `design/judge2/`. They only read the prototypes.

| # | Check | Result |
|---|---|---|
| 1 | two-stage: its own oracle test and link test with new seeds | 600 instances, 2,400 questions (781 fit, 1,619 no): 0 verdicts differ from brute force, 0 witnesses rejected. 200 instances, 191 plans, 1,628 plan-weeks: 0 violations of any hard row |
| 2 | two-stage: the same six plans in Node (V8) and in JavaScriptCore | identical bytes, checksum `e905a0f2` (my rerun) |
| 3 | two-stage: stage 1 against exhaustive enumeration (new test; 800 random small instances, two seeds) | keep vector equals the exhaustive lexicographic maximum in 800 of 800. The peak ladder is the optimum inside its ceilings in 431 of 431 plans |
| 4 | two-stage: constructed case, a hosted pattern station that credits a higher-priority group | **defect**: stage 1 drops the first-priority group with reason "template"; a legal plan exists (section 3.1, D1) |
| 5 | two-stage: constructed case, an exercise that credits its own group with half a set (dips) | **defect**: the oracle answers "no" in 1 node; the independent evaluator accepts a hand plan (D2) |
| 6 | two-stage: stairway tier order, same 191 plans | default order: flat weeks at the arithmetic minimum in 159 of 191. With "flat" right after "last": 191 of 191, still 0 violations |
| 7 | milp: pickleball sample twice; grid summary reread | identical output apart from CPU lines; grid numbers match the document |
| 8 | milp: every keep question of the three samples (fit factor 1.10 and 1.00) against a pure-integer search on the same model | 44 questions: 0 verdicts differ, 0 undecided. The integer search needed at most 3,412 nodes a question and under 1 s for all 44 |
| 9 | template-parametric: `run.mjs all` | equals the saved output apart from timing lines; certify 0 violations |
| 10 | template-parametric: the oracle's exact-total queries against an independent forward enumeration (no pruning, no memo) | 5,322 questions on 10 problem / group-set combinations: 0 verdicts differ |
| 11 | template-parametric: is a group ever refused at the "minimum point" although larger exact totals fit? Samples at 45-90 min | 14 cases, up to 5,000,000 exact-total vectors in one case: 0 violations on the samples |
| 12 | template-parametric: constructed case on template `athletic.3` with the real time model | **defect**: the keep question returns "does not fit", exact total 13 fits, `plan()` leaves hips untrained (section 3.3, D1) |
| 13 | milp: does "no stairway schedule" depend only on the number of added sets D, as its repair cut assumes? Its own `stairway()` on 6,733 climb vectors | no: for example 6 weeks, week-1 total 30, D = 15: climbs 5 / 5 / 5 have no schedule, climbs 1 / 4 / 5 / 5 have one (section 3.2, D5) |

---

## 2. The guarantees, side by side

"Real" below means: made true by construction or by an exhaustive whole-number search, and re-checked by code that does not
share the search.

| Guarantee | two-stage | milp | template-parametric |
|---|---|---|---|
| Floor of every trained group, every week | Real. Week-1 vector is a variable of the oracle with exact helper credit; later weeks by the sandwich lemma (L3) | Real. Row R9 with exact credit coefficients; later weeks by the sandwich lemma (3.1) | Sound but conservative: the oracle counts only "guaranteed" helper credit, so it can refuse a group that fits (its own limit 15.1 item 1) |
| No exercise loses a set; climb at least the minimum | Real (L1, L4, prefixes of one add sequence) | Real (staircase rows R4 make the slot vector a function of the day total) | Real (house-monotone closed forms) |
| Every day inside its limit, every week | Real, and strict by default: limit = chosen minutes. Largest (day seconds - limit) = 0 over 772 + 1,628 plan-weeks | Real for the limit it is given, which is 1.10 x the chosen minutes. Sample days run 44.5-48.9 for 45 | Real for its own limit, which is the 1.10 band plus 0.45 min of rounding room. Sample days run 47.2 of 45 for twelve weeks |
| Costs that change by exercise block | Sound: week N is proved with the largest cost of every exercise over the blocks (conservative); tested with non-monotone fixed minutes | Exact in the design (an extra epoch for every non-dominated block); not prototyped for middle epochs | Design says "most expensive block cost"; the prototype prices week N only |
| "Does not fit" is a proof | Whole-number exhaustion, three verdicts. Holes D1 and D2 below | Floating-point LP prunes; certified pruning is designed, not built. Agreed with integer search on 44 of 44 | Not in general (D1 below); the search engine itself is sound (check 10) |
| Step limits on the weeks really placed | Real: 7 % on the placed total (10 % as a fallback), one set a week per group; equal to brute force on 3,000 small plans | Real: 10 % on the placed total, one set a week per group | Real but coarser: a constant cap from the week-1 total |
| Same plan on every engine | Measured V8 = JavaScriptCore | Same output twice in V8; the LP uses + - x / only | 20 identical repeats in one process; not run in a second engine |
| Time to answer | median 33 ms, 90 % under 0.17 s, worst 4.1 s (one 69,000-node proof) | median 0.11 s, 90th percentile 3.3 s, 99th 24.5 s, worst 42 s for four of about twelve tiers | 9-49 ms, worst 0.7 s; no budget path is implemented |

---

## 3. Findings, design by design

### 3.1 two-stage

**What holds up.**

- The link between the stages is a theorem (T1) with four written hypotheses, and the proof of the time lemma (L2) covers
  the one non-obvious term, the superset saving. I checked the proof and found no gap. The property test agrees: 0
  violations in 2,478 plan-weeks (theirs) and 1,628 (mine, new seed), with costs that change by exercise block and fixed
  minutes that go up and down.
- The oracle prunes only with whole-number inequalities. Its verdicts matched brute force on 6,000 questions (theirs) and
  2,400 (mine). The authors report that this test caught a real bug in a pruning bound while they wrote the design, which is
  the right kind of evidence.
- My new test (check 3) confirms two claims the authors listed as "planned": the keep vector equals exhaustive enumeration
  (800 of 800), and the peak ladder is the tie-broken max-min optimum inside its ceilings (431 of 431). In 10 of those 431
  plans a legal plan has a higher peak, but only by passing the ladder's own ceiling (level start x planned growth). In
  the three I inspected, that plan starts week 1 above the level start, which the design excludes on purpose.
- Theorem T3 (the ladder) is correct as stated. One consequence should be said plainly to the coach: a tie goes to the
  higher-priority group *before* anything else is compared, so the result is not always the plain max-min optimum (sort
  the progress values, compare from the lowest). A two-group thought example: if the peaks (1, 3) and (2, 1) are both
  legal and (2, 2) is not, the ladder returns (2, 1); plain max-min would return (1, 3). That is a priority choice, not
  an error.

**Defects.**

- **D1. The keep vector is not exact when a pattern station is hosted by a later group.** Theorem T2 (ii) says a later group
  that credits no group of the question may be switched off without loss. That ignores a later group that *hosts* a pattern
  station (the station needs its host exercise) which credits a group of the question. Constructed case
  (`judge2/twostage_keep_counterexample.mjs`): three groups, the first needs half a set of credit from a pattern row
  hosted by the second group's work lift. Stage 1 answers "no" in 1 node, drops the first-priority group and prints the
  reason "template" ("no session length helps"). Asking the same question with the later groups free returns a plan the
  independent evaluator accepts. In real data this is a Focus group (first in keep order) that leans on the credit of a
  row or press paired with a lower-body work lift. Fix: leave every later group free, as the milp design does, or count a
  host of a crediting station as a donor.
- **D2. The oracle is unsound when an exercise credits its own group with less than a full set.** The "implied" row
  (credited peak at least floor + minimum climb) and the day-subset bound assume that every set of a group's own exercise
  is one credited set. The coach's credit table has exercises that are not: dips 0.5 / 0.5, KB swing 0. Constructed case
  (`judge2/twostage_credit_counterexample.mjs`): one group, a press and dips. The oracle says "no" in 1 node; press 2 -> 3
  and dips 2 -> 3 is legal by the evaluator. The brute-force test could not see this because its generator always gives
  own exercises full credit. Fix: derive the implied rows from the credit table (smallest own credit per set), and widen
  the generator to the credit classes that exist.
- **D3. Two exits are not built.** When no group fits, stage 1 returns no plan at all (no pattern stations, no class
  lifts). When no stairway exists under 7 % and under 10 %, placement throws; the "undo the last raise" rule of 4.5 is
  specified only. The authors measured that the case is real on random tables (41 of 5,000 under 7 %, 4 under 10 %).
- **D4. The default stairway order leaves avoidable flat weeks.** "Shape" ranks above "flat". On 191 plans the default
  hits the arithmetic minimum of flat weeks in 159; with the order last, flat, hold, late, land, shape it is 191 of 191
  and fewer plans have a flat week in the last third (81 instead of 98). Flat stairways are the coach's first complaint,
  so this default should change.
- **D5. Rules that are rows in the milp design are only template properties here.** There is no row "a lower-body work
  lift keeps its upper partner" (T0-SES-08). The result is visible in its own pickleball plan: Monday is calf raise,
  single-leg hinge and leg curl, with no upper-body and no knee exercise. "Work lift 3 sets from 60 minutes" (T6-CNT-06)
  is cited but is not in its instances (every work lift starts at 2 sets).
- **D6. Thin coverage of real templates.** Three hand-written instances and random generators. No builder from
  `model/templates.json`, no grid, no 4-6-day twin templates, no optional day or Focus slots, one step of the athletic
  ladder. Hypothesis H3 (an exercise is a side of at most one active pair) must be asserted on every template; the authors
  say so.

### 3.2 milp

**What holds up.**

- The model is the most complete of the three, and every row carries its rule id. Helper credit is exact (the class
  member's back starts at 13 because the shoulders floor needs the rows' rear-delt credit). "Work lift keeps its upper
  partner" is a row (R6), which is why its pickleball Thursday keeps a press beside the hinge and its Monday step-up
  keeps its row.
- The staircase rows in the form `n_1 >= ... >= n_k >= n_1 - 1` do make the slot vector a function of the day total, also
  with unequal set bounds. I checked the argument: the reachable totals form an interval and every slot is monotone in the
  total, so lemma 3.2 ("any order is legal") is correct.
- 594 plans on the real template grid passed an all-weeks certificate in whole numbers. That is the widest evidence in the
  panel.
- Its keep verdicts agree with a search that uses no floating point (check 8: 44 of 44).
- It is the only design that returns a minimal list of rule ids for "why not this group", and it is candid about its own
  weak spots.

**Defects.**

- **D1. "Proven" means "proven by a floating-point LP".** `kern.mjs` prunes a node when the dual simplex reports
  infeasible (tolerances 1e-9 and 1e-7) or when the rounded LP bound cannot beat the incumbent (1e-6). The design says
  certified pruning will make these whole-number facts; it is not in the prototype. I found no wrong verdict, and an
  earlier audit re-proved 19,160 of 19,160 prunes, so the risk is small. But the headline "609 of 609 proven" rests on
  it.
- **D2. The engine the design needs does not exist yet.** The prototype LP is dense and restarts at every node. Measured:
  3.3 s at the 90th percentile and 24.5 s at the 99th for four tiers, on a laptop. The stated budget (8,000 nodes a plan)
  at the measured 4-26 ms a node is 32-208 s, so the budget bounds the work but not the wait. The warm-started kernel that
  would fix this is "an expectation ... not measured". The explanation costs 16 s on the swimmer and minutes on a
  four-group variant.
- **D3. Lower tiers end "best found" in 28 of 609 cells (4.6 %).** The plans are legal. But one of those tiers is the
  overrun of the chosen minutes: in the 6 x 45 and 6 x 60 cells, 12 to 26 minutes of overrun (summed over the days of
  week 1 and the peak week) are not proven minimal.
- **D4. The monotonicity theorem contradicts the design's own data.** Section 3.5 says a longer session "only raises
  right-hand sides". Section 2.1 gives the work lift a minimum of 3 sets "from 60 min", which raises a *lower* bound when
  minutes grow. The prototype hides this by using 3 at every length. The template-parametric design names the same rule
  as the one thing that can break the property.
- **D5. The link from the stairway back to the model is not exact as written, and not built.** When the dynamic program
  finds no schedule, the design adds "the exact cut: total added sets at most D - 1". Whether D sets can be scheduled
  depends on how they are spread over the groups (one set a week per group), not only on D. Check 13 shows it with the
  prototype's own scheduler: same D and same week-1 total, one climb vector has a schedule and another has none. So the
  cut can remove plans that have a schedule. The prototype reports the failure instead of cutting. It did not occur on
  the grid. The two-stage scheduler states the right condition (Gale-Ryser, on the sorted vector of sets left).
- **D6. Not prototyped:** athletic sets as variables (R19), the axial squat / deadlift row (R18), middle epochs, the true
  canonical last tier, the optional day and Focus slots. The grid used the research instance builder (no joint care, no
  class lifts, fixed athletic minutes).

### 3.3 template-parametric

**What holds up.**

- The closed forms (staircase inside a day, the exposure that is behind across days) are house-monotone, so no exercise
  loses a set. `certify` found 0 violations in 42 solves and my rerun matches the saved output.
- The oracle's search (day layers, failure memo, lower bounds) is sound on what I could test: 5,322 exact-total questions,
  0 differences from an enumeration that has no pruning.
- It is the only design whose prototype puts the test weeks inside the time model, and the only one that compiles its
  problems straight from `model/templates.json`.

**Defects.**

- **D1. "Does not fit is always a proof" is false.** The keep search tests one point per group set (the "minimum point")
  and relies on lemma L3: if any plan exists, one exists at the minimum totals. L3 is proved for a fixed exercise count
  only. When a third exercise opens, a day can get *cheaper* with one more set (4/4 with a strength-rest lift costs more
  than 3/3/3). The document admits the gap but says only "the peak may miss a set". It can cost a whole group.
  Constructed case (`judge2/tpp_minimum_point_counterexample.mjs`): template `athletic.3`, real time model, an L1 athlete
  at 45 minutes in the last exercise block, hips the only group in the keep list. The keep question returns null. Exact
  total 12 returns null. Exact total 13 fits (Wednesday 9 sets on 3 exercises, Friday 4 sets, every day inside the
  band, credited hips 13). `plan()` leaves hips at state NONE. On the three samples at 45-90 minutes the gap did not bite
  (check 11), so it is rare, but it is exactly the over-cut the coach has seen.
- **D2. The feasible set is smaller than the rules allow, by construction.** Helper credit toward a floor is the
  guaranteed part only. The exercise count of a cell is a rule ("a third opens only when the first two are full"), not a
  variable. Eleven sets a session is hard, so one-day groups are "impossible at any length" where the two-stage design
  trains them at 75 minutes. So its "lexicographically best keep vector" is best inside a narrower model.
- **D3. It has a tolerance and floats in decisions, and its summary says otherwise.** Every limit carries 9 time units
  (0.45 min; section 4.1 calls this reading the printed whole minutes): a "strict 45" plan shows a 45.1-minute day.
  Ceilings and starts multiply by a floating-point growth factor with 1e-9 offsets. The stairway costs use
  floating-point curve crossings. Section 6 says "integers only in every decision" and 1.2 says "no tolerance
  constants".
- **D4. The stairway has no exit and a weak default.** The min-cost flow throws when it cannot place every set; no policy
  is specified. The default "landing first" keeps the pickleball player's total at 23 sets for the first seven weeks and
  gives nine flat weeks in all (the minimum is eight), and last-week jumps of +7.9 % to +8.3 % on the three samples:
  inside the hard 10 % line, above the 7 % line the inventory proposes for placed totals.
- **D5. "0 days over their limit" is measured against the plan's own band.** With the default band several sample days
  run 2-5 minutes over the chosen minutes for the whole block (pickleball Monday 47.2 of 45 in all twelve weeks; class
  Monday and Tuesday 62-65 of 60 in all eight). That is a parameter, but the summary line reads stronger than it is.
- **D6. Smallest evidence base.** 42 solves on three templates, no brute-force test by the authors, no budget or
  "unknown" path in the prototype, nothing on twin-day templates, one engine.

---

## 4. Issues none of the three designs solves

1. **"More minutes never gives a worse keep vector" needs nested feasible sets.** The model's rule "work lift 3 sets
   from 60 minutes" breaks nesting in all three once it is in the data (only template-parametric has it there, and says
   so). Either make that minimum independent of the minutes, or treat it as a preference, or drop the property from the
   test list.
2. **A stairway may not exist under the total-rise rule.** Nobody built the fallback. It needs a defined order: the 10 %
   reading, then one raise undone at a time, then a group dropped.
3. **Exercises with partial own credit** (dips, thruster, KB swing) are in the credit table and in no test generator.
4. **"Never flat" in whole sets is arithmetic.** Three added sets in eleven steps leave eight flat weeks whatever the
   algorithm. All three answer with a progression cue (reps, effort, load). What can be guaranteed and tested is the
   arithmetic minimum of flat weeks for the plan's endpoints, and week 1 as low as the floor allows so there are more
   steps.
5. **No phone was measured** by anyone, and no design measured Focus slots, the optional day, or athletic sets competing
   with resistance sets for minutes.

---

## 5. Scores with reasons

**two-stage: 7.5.** For: legality is a proved and tested theorem; whole numbers decide everything; three verdicts; the
strict day limit; brute-force agreement on the oracle, the scheduler, the keep vector and the ladder; two engines; fast.
Against: two soundness holes in "does not fit" (D1, D2), found only because I varied what its generators held fixed; two
unbuilt exits (D3); a default stairway order that leaves avoidable flat weeks; rules missing as rows; no real-template
grid.

**milp: 6.5.** For: the model is the right definition of a legal plan; exact credit; 594 certified plans on the real
grid; keep verdicts confirmed by integer search; minimal explanations. Against: exactness rests on a floating-point LP
until certified pruning exists; the run-time tail makes the guarantees unusable in a browser today, and the fix is
unbuilt and unmeasured; a theorem whose hypothesis its own data violates; the stairway link is specified loosely and not
built; athletic co-planning is design only.

**template-parametric: 5.5.** For: legal plans, a sound search engine, tests inside the time model, real templates,
milliseconds. Against: the central exactness claim fails on a constructed real-template case; the model is narrower than
the rules by construction; tolerances and floats that the document denies; a stairway with no exit; the thinnest
evidence.

---

## 6. Winner and what to graft onto it

**Winner: two-stage.**

From **milp**:

1. Ask every keep question of the whole model: every later group stays free. This closes two-stage D1.
2. Build every row, implied rows included, from the credit table's coefficients. No row may assume a full set of own
   credit. This closes two-stage D2.
3. Make "a lower-body work lift keeps its upper partner" (R6) and "axial squat and axial deadlift on different days, once
   each" (R18) rows of the oracle, not template properties.
4. Put the room cuts into the oracle as variables in the profile's cut order, minimized right after the keep vector, and
   pattern stations after the cuts. Then a fixed block is cut only when a kept group needs the minutes, and the proof says
   so. In two-stage the list of blocks that stay is fixed in advance, and one care item more costs the pickleball plan
   its one big mover.
5. Choose the proved weeks by the dominance test (one more proved vector for every exercise block that no later week
   dominates) instead of reserved maximum costs.
6. Return a plan when no group fits (pattern stations, class lifts, offers) and a clear "this format starts at N minutes"
   when the fixed blocks alone do not fit.
7. Stairway order with the fewest flat weeks ahead of curve shape. Measured on two-stage: 191 of 191 plans at the
   arithmetic minimum instead of 159.
8. The minimal conflict in rule ids for "why not this group", on demand and under its own budget.
9. The certified grid: solve every template cell offline, store the proven keep vector, and fail the build when the
   run-time planner does not reproduce it. Keep the milp model as the second, independent implementation. A plain integer
   search on it answered all 44 sample keep questions in under a second.
10. Laterality as slot variants inside the oracle (a unilateral pick costs 3.0 min a set instead of 2.25 and changed the
    pickleball plan).

From **template-parametric**:

11. Test weeks inside the time model: weeks 1 and N as proved vectors with their test minutes, room items skipped on a
    test day, and a strength test only on a lift the plan trains.
12. If a band above the chosen minutes is ever allowed, spend it on group minimums only and find the smallest overrun by
    bisection on the oracle.
13. "One more day is never worse" by construction: the better of the n-day template and the (n-1)-day plan with an
    optional day.
14. Twin days of 4-6-day templates tied as one decision (the symmetry where the milp tail lives).
15. The builder that compiles any day template of `model/templates.json` into the oracle's data. Two-stage has none.
16. The day-layered search with a failure memo as a cheap independent cross-check of the oracle.

---

## 7. Must-fix list for the winner before it is specified

| # | Fix | Test that proves it |
|---|---|---|
| 1 | D1: later groups free in every keep question | `judge2/twostage_keep_counterexample.mjs` keeps the first group; keep vector equals exhaustive enumeration with hosted, crediting pattern stations in the generator |
| 2 | D2: implied rows from the credit table | `judge2/twostage_credit_counterexample.mjs` answers "fits"; brute-force generator draws own credit from {0, 2, 4} quarter sets |
| 3 | Assert H3 (one active pair per exercise) and "every implied row is implied" in the grammar builder | build-time assertion on every template |
| 4 | A plan for zero kept groups; the stairway fallback in a fixed order | random tables that have no schedule under 7 % return a certified plan and a note |
| 5 | Stairway tier order: last, flat, hold, late, land, shape (or the coach's choice) | flat weeks equal the arithmetic minimum on the benchmark |
| 6 | Decide the "work lift 3 sets from 60 minutes" rule before promising monotonicity in minutes | the minute sweep on the real grid |
| 7 | Run the oracle on the real template grid with the run-time node budget, including 5-6-day templates | no keep question "unknown"; time per plan at the 99th percentile reported on a phone |

---

## 8. Reproduce

```sh
cd design/judge2
node twostage_keep_ladder_exhaustive.mjs 400 11      # check 3 (about 2 min a seed); second seed 2027
node twostage_keep_counterexample.mjs                # check 4
node twostage_credit_counterexample.mjs              # check 5
node twostage_link_tiers.mjs 200 777                 # check 6, default order
node twostage_link_tiers.mjs 200 777 last,flat,hold,late,land,shape
node milp_keep_vs_integer_search.mjs 2000000         # check 8
node milp_stairway_cut_probe.mjs                     # check 13
node tpp_oracle_vs_enumeration.mjs                   # check 10
node tpp_minimum_point_probe.mjs                     # check 11 (about 7 min)
node tpp_minimum_point_counterexample.mjs            # check 12
# checks 1 and 2 are the two-stage prototype's own scripts with new arguments:
node ../two-stage/proto/test_oracle.mjs 600 987654321
node ../two-stage/proto/test_link.mjs 200 777
/System/Library/Frameworks/JavaScriptCore.framework/Versions/Current/Helpers/jsc -m ../two-stage/proto/det.mjs
```

Saved outputs: the `*.out.txt` files beside each script; `twostage_reruns.out.txt` holds checks 1 and 2.

**Limits of this review.** My constructed cases show that a claim can fail, not how often it fails on real intakes; on
the three samples none of them fired. I did not measure a phone. I did not review coach fidelity or build cost, which are
other judges' lenses.
