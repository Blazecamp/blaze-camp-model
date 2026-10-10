# Judge 3 - engineering

Lens: browser performance, simplicity, testability, explainability, maintainability by open-source contributors, migration risk
from the current engine (v0.4, 15,595 lines in `engine/*.mjs`, of which `volume.mjs` is 2,830).
Written 2026-10-10. Read in full: `design/design_milp.md`, `design/design_two-stage.md`, `design/design_template-parametric.md`,
the three prototypes, `engine/CONTRACTS.md` (binding rules), `engine/generate.mjs` (the pipeline seam), `design/diagnosis.md` DR-22.
Nothing outside `design/` was written; no package was installed; nothing was committed. My probe scripts and their outputs
are in `design/judge3/` (section 6).

Coach fidelity (which reading of a rule is right, which sample plan he would grade higher) is another judge's lens. I score
only whether each design can be built, tested, shipped in a browser and maintained.

---

## 0. Verdict

| Design | Score (1-10) | One-line reason |
|---|---|---|
| **two-stage** | **7.5** | The only design whose every exact part is already checked against brute force, in whole numbers only, in about 1,200 lines with one owner per decision. Fastest on realistic sizes. Its gaps: no builder from `templates.json` yet, and a tail on the largest plans that its own tests did not draw. |
| template-parametric | 6 | The simplest model and the best data contract (templates + a short list of edit rules). But its search does not scale past its three tight samples: on a slice of the real template grid 27 of 72 cells ran past 20 s and 3 crashed (section 1.3). Its exactness also carries four stated approximations. |
| milp | 5 | The broadest evidence (609 grid cells, every keep vector proven) and the best explanations (conflicts in rule ids). But it puts a floating-point LP solver that does not exist yet on the critical path, is the slowest by one to two orders of magnitude, and is the hardest for a contributor to change safely. |

**Winner: two-stage.** Build it, with the grafts of section 4. The two most important are (1) the template-parametric
compile step and edit-rule catalogue as its missing stage 0, and (2) the MILP reference model as a build-time certifier,
never as run-time code.

**One warning for whoever writes the spec.** DR-22 asks for about 1 s per plan on a phone, i.e. about 250 ms on a laptop.
On a full 4-day plan (8 groups, about 20 group-days) **none of the three prototypes meets that in the tail today**: MILP
needs 20 s and more, template-parametric times out, two-stage is at 83 ms median but 1.1 s at the 90th percentile and 4.5 s
at worst on random instances of that size (section 1.2). The winner is the closest, and its fixes are ordinary search
engineering, but the gate in section 5 has to be passed before the old engine is switched off.

---

## 1. What I checked myself

All three prototypes run as documented and reproduce their own sample numbers. Timings are wall time on the same loaded
laptop the designs used (Node 22.22); some of my probes overlapped, so read them to one significant figure.

### 1.1 Re-runs of the designs' own commands

| Check | Result |
|---|---|
| `sim_template-parametric/run.mjs all` | 3 plans in 0.16 s; `certify: 0 violations`. `variants.mjs`: 3.1 s, slowest plan 395 ms, 0 violations |
| `two-stage/proto/run.mjs` x 3 | 0.07 / 0.09 / 0.14 s per sample |
| `two-stage/proto/sweep.mjs` | 71 plans, 772 plan-weeks, 0 violations; median 31 ms, p90 158 ms, max 3.8 s; 0 unknown |
| `two-stage/proto/test_link.mjs 300` | 286 plans, 2,478 plan-weeks, 0 hard-row violations |
| `two-stage/proto/test_oracle.mjs 200 7` | 800 questions, 0 verdicts differ from brute force, 0 witnesses rejected |
| `two-stage/proto/test_stairway.mjs 300 500` | 0 differences from brute force, 0 certificate failures |
| `two-stage/proto/det.mjs` | checksum `e905a0f2`, the value the document quotes for V8 and JavaScriptCore |
| `milp_proto/run_samples.mjs` x 3 (no offers, no explanation) | 0.14 / 0.18 / 1.05 s; tier tables as in the document |
| `milp_proto/grid_summary.out.txt`, `exp_t1.out.txt` (read, not re-run: 35 min) | as quoted. One number the summary table of the document does not show: the keep vector **alone** takes 18.8-19.4 s on `fat_loss_bootcamp 6 x 45` (8 questions, 3-502 nodes each) |

### 1.2 Probe: two-stage beyond the sizes its tests drew

Its property tests use 2-5 groups x 2-4 days. Real templates go to 8 groups on 4-6 main days (`aesthetics.4` has 20
group-days, `no_equipment.4` 24, `aesthetics.6 / ppl_x2` 18). I re-used its random generator with the size as a parameter
(`judge3/probe_ts_scale.mjs`) and the document's proposed runtime budget of 20,000 nodes per question.

| Groups x days | Group-days (median) | ms p50 | ms p90 | ms max | Plans under 250 ms | Plans with an "unknown" verdict | Hard-row violations |
|---|---|---|---|---|---|---|---|
| 6-8 x 3 | 14 | 29 | 55 | 71 | 30 of 30 | 0 | 0 |
| 6-8 x 4 | 18 | 62 | 131 | 617 | 29 of 30 | 0 | 0 |
| 8 x 4 | 20 | 83 | 1,081 | 4,451 | 23 of 30 | 1 | 0 |
| 8 x 5 | 25 | 190 | 5,166 | 20,772 | 22 of 30 | 2 | 0 |
| 8 x 6 (larger than any template) | 29 | 339 | 31,121 | 39,945 | 8 of 20 | 3 | 0 |

Three findings.

- **Legality held everywhere**: 0 violations in 140 instances, including the ones with an unknown verdict. The link theorem does
  what it says at sizes it was not tested on.
- **The tail is real at the top of the realistic range** and the document's "0 unknown" does not extend to it.
- **The budget is not what its name says.** `ask()` runs two strategies at 2,000, 16,000 and then the budget, so a question
  "at 20,000" can spend 76,000 nodes (the largest question in the table is exactly 76,006), and the prototype costs
  50-120 microseconds a node (propagation re-scans every row; the day-subset cut enumerates 2^days subsets). One unproven
  question is therefore 4-8 s. This is a specification defect, not a design defect: section 4.3 item 1.

### 1.3 Probe: template-parametric on real templates

Its prototype compiles any template of `model/templates.json`, which let me run it on templates it never saw
(`judge3/probe_tpp_grid.mjs`): 9 templates x 45 / 60 / 75 / 90 min x L1 / L2, a generic client (warm-up and core opener as the
only fixed blocks, level starts and ceilings from `rules.volume`, the model's keep order), one process per cell, 20 s limit.

| Template | Cells | Solved in 20 s | Timed out | Crashed | ms of the solved cells (min / median / max) |
|---|---|---|---|---|---|
| `athletic.2` | 8 | 8 | 0 | 0 | 40 / 67 / 97 |
| `aesthetics.2` | 8 | 8 | 0 | 0 | 88 / 1,621 / 4,468 |
| `aesthetics.3` | 8 | 7 | 1 | 0 | 519 / 1,815 / 12,912 |
| `athletic.3` | 8 | 8 | 0 | 0 | 641 / 5,194 / 17,683 |
| `aesthetics.4` | 8 | 3 | 5 | 0 | 1,382 / 1,437 / 5,358 |
| `aesthetics.4 / upper_lower` | 8 | 6 | 2 | 0 | 72 / 3,116 / 13,838 |
| `athletic.4` | 8 | 2 | 6 | 0 | 14,376 / 15,690 / 15,690 |
| `no_equipment.4` | 8 | 0 | 8 | 0 | - |
| `aesthetics.6 / ppl_x2` | 8 | 0 | 5 | 3 | - |
| **all** | **72** | **42** | **27** | **3** | 19 cells under 1 s, 12 under 250 ms |

- Every solved plan certifies with 0 violations: the model is sound. The **search** is the problem: up to 21.9 million nodes
  for one plan. The oracle is a depth-first enumeration over day layers with a failure memo and a weak minute bound, with
  no propagation and, in the prototype, no node budget. It is fast when the fixed blocks leave little room (the three
  samples: 1,741-46,703 nodes) and explodes when many groups fit, which is the ordinary bodybuilding client.
- The document says "not measured: the 4-6-day twin templates, split templates" and expects "an order of magnitude" from
  typed arrays and twin tying. The gap measured here is three orders of magnitude on `aesthetics.4`, the most common case.
- The 3 crashes are `Cannot read properties of null (reading 'd1')` on the split template at 45-60 min. I did not diagnose
  them (it may be my generic client meeting an unhandled "no week 1" case); they show the prototype has one code path the
  samples never exercised.
- The `athletic.*` rows are harsher than a real athlete's plan would be, because my generic client has no athletic fixed
  blocks. The `aesthetics.*` rows are representative.

### 1.4 The same cell in all three

| `aesthetics` 4 x 60 (8 groups, 20 group-days) | Time on the laptop | Source |
|---|---|---|
| milp | 22-25 s for six of its tiers (L1, L3; two tiers "best found" at L1) | its own `exp_sum_tiers.out.txt` |
| template-parametric | 5.4 s (L1), more than 20 s (L2) | my probe |
| two-stage | no real-template run exists (no builder). Random instances of that size: 83 ms median, 4.5 s worst | my probe |

---

## 2. Scores, criterion by criterion

| Criterion | milp | two-stage | template-parametric |
|---|---|---|---|
| Browser performance | 4 | 7 | 3 |
| Simplicity | 4 | 7 | 7.5 |
| Testability | 7 | 9 | 6 |
| Explainability | 8 | 7 | 7.5 |
| Maintainability by contributors | 4 | 7 | 7.5 |
| Migration risk (10 = lowest risk) | 4 | 7 | 5.5 |
| **Overall** (mean, rounded to a half) | **5** | **7.5** | **6** |

### 2.1 milp: 5

**For.**

- **The widest evidence of the three.** 609 cells of the real template grid, every keep vector proven, 594 of 594 plans
  pass an all-weeks certificate. It is the only design that looked at 5-6-day plans before claiming anything about them,
  and it reports its own tail honestly (p90 3.3 s, p99 24.5 s, max 42 s for four tiers).
- **One definition of a legal plan.** The catalogue (every rule a row with its id and tier) feeds the model, the
  certificate, `validate.mjs` and the scorer. That is the right shape for the rule data whatever solves it.
- **The best "why".** A minimal conflict in rule ids ("floor of quads + Monday's minutes in the last week + the squat keeps
  its row") is exactly what `time_check` and a contributor debugging a plan need.
- **Negative results written down** (one weighted objective is fragile; rounding cuts do not help), so nobody repeats them.
- A careful migration plan with a shadow mode (`rules.planner.engine`), behind the existing `generateWith(deps)` seam.

**Against.**

- **The shipped solver does not exist.** The run-time projection rests on a warm-started dual simplex, certified pruning,
  best-bound search and QuickXplain. All four are specified, none is built, and the speed-up is "an expectation, not
  measured". Until then the kernel costs 4-26 ms a node: 22-25 s for six tiers on `aesthetics 4 x 60`, 19 s for the keep
  vector alone on the worst cell, 16 s to minutes for one explanation. On a phone multiply by about four.
- **Floating point on a path that decides who is trained.** `research/lp.mjs` is a dense simplex with tolerances
  (`PTOL = DTOL = 1e-9`, `PIV = 1e-7`), a Harris ratio test and a Bland fallback. "Does not fit" verdicts rest on it until
  certified pruning is added. The repository's own history (the 0.5-set tolerance, `CLIMB_TOL`) is a list of bugs of this
  kind; the other two designs have no tolerance anywhere in a decision.
- **The grid ran 4 of about 17 tiers** (`SKIP=T1b,T1c,T5b,T5c,T6,T7a,T7b,T9`) on the research instance builder (no joint
  care, no class lifts). The numbers are for models of the right size, not for the final model.
- **Contributor barrier.** Adding a rule means writing a linear row, often with an on / off link or a linearised ratio;
  debugging a wrong plan means reading an LP relaxation. Very few open-source contributors to a training-plan engine can
  review a change to a simplex pivot rule. The kernel would have one maintainer.
- **The fallback breaks the engine's binding rules.** If the hardened kernel misses the budget, the document's answer is
  HiGHS in a worker: an npm dependency, a 3.5 MB binary and an asynchronous `generate()`. By the design's own count (5.1)
  that breaks three binding rules (`CONTRACTS.md` line 445: no npm dependencies, no build step). A design whose plan B is
  not allowed is a risk on its own.
- Athletic sets as variables, rows R18 / R19, the optional day, Focus slots, slot variants and tests inside the limit are
  specified and not prototyped.

### 2.2 two-stage: 7.5

**For.**

- **Test discipline is the design.** The oracle is checked against brute force over an independent evaluator (6,000
  questions; the test caught a real bug in a pruning bound and a broken hypothesis in the generator while the document was
  being written). The scheduler is checked against brute force. The link between the stages is a property test over 2,478
  plan-weeks with changing costs. I re-ran all three: 0 differences, 0 violations. No other design has run a single
  brute-force comparison of its exact core.
- **Whole numbers only** in every decision (seconds, quarter sets, sets, tier weights under 2^53). Identical bytes in V8 and
  JavaScriptCore, measured. No LP, no tolerance, no clock.
- **One owner per decision** (section 1.2 of the design). Stage 2 cannot fail, cannot cut and cannot change the table, and
  that is a five-lemma proof with its hypotheses written out, plus a test. This removes the class of bug the diagnosis
  calls "four independent time cutters", by construction rather than by care.
- **Size.** About 1,200 lines replace `volume.mjs` (2,830), the cuts of `week.mjs` and the athletic reconcile. A contributor
  needs to understand bounds propagation on sums of table values and a depth-first search, nothing else.
- **Performance on realistic sizes.** 31-33 ms median on the samples; 29-83 ms median up to 8 groups x 4 days in my probe;
  `generate()` stays synchronous.
- **The smallest change to the pipeline.** `generate.mjs` already calls `selectBlock` before `planWeeklySets`
  (lines 73-119). This design keeps that order and keeps `planWeeklySets` as an adapter with the same `VolumePlan` shape.
  `plan/2` gains fields and loses none.
- **Custom rules cannot silently break a proof**: a rule is accepted as a hard row only in one of four shapes that the
  sandwich lemma covers; anything else is loaded as a scored soft metric and flagged.
- Reasons are cheap and concrete: "template" or "time", the minutes missing (bisection on exact questions) and the day that
  refuses. Offers are re-solves.

**Against.**

- **Stage 0 is not prototyped.** The three instances are hand-written data; the grammar builder from `templates.json`
  (candidates, extension candidates, pairs, pattern stations, fixed blocks, epochs) is the largest unbuilt piece and the
  one that touches `week.mjs` (2,002 lines). No run on a real template exists.
- **A tail at the top of the realistic range** (section 1.2): 4.5 s worst and 1 unknown verdict in 30 at 8 groups x 4 days;
  worse at 5 main days. The listed remedies (backjumping, twin-day symmetry, a dominance row) are unbuilt.
- **The budget ladder triples the stated budget** and there is no per-plan cap, so the worst-case time of a plan is not
  bounded by any number in the document.
- **The pruning rows are subtle.** The optimistic time bound and the day-subset cut are where the one bug so far was found.
  Brute force only reaches 2-3 groups x 1-2 days, so at real sizes nothing independent checks a "no" today.
- Many pinned questions per plan (38-57) and nine tiers of them: correct, but a long chain to step through when debugging.
- Its explanation is coarser than the MILP's: it names minutes and days, not the set of rules that collide.
- Not prototyped: optional-day and Focus slots, tests inside the limit, the athletic level ladder beyond one step, the
  last-in-first-out undo when no schedule exists, properties P10-P13.

### 2.3 template-parametric: 6

**For.**

- **The simplest mental model**: a plan is a coach template plus about 20 integers. 638 lines for compile, evaluation,
  oracle, planner, stairway and certificate. A coach can read the skeleton; a contributor can read the planner in an hour.
  (Simplicity is 7.5 and not higher because the search it still needs is not in those 638 lines.)
- **The edit-rule catalogue** (section 3.2 of the design: R-GROUP, R-DAY, R-LEAD, R-ROOM, R-TEST, A-PATTERN, A-DEPTH ...):
  the only ways an exercise is added or removed, each with id, precondition, effect, tier and source. This is the best
  maintainability idea in the three documents, and it is data.
- **The only prototype that compiles real templates** (`buildProblem` reads `model/templates.json`; that is why I could
  probe it on nine templates).
- Explanations people can act on: "chest has one day on this template; a day holds at most 11 sets of a group; more days
  fix it, longer sessions do not" is a structural proof, found before any search.
- Useful small rules: the minimum length of a template, "one more day is never worse" by taking the better of two plans,
  the test-week swap, a custom rule that declares its kind.

**Against.**

- **The search does not scale** (section 1.3). 9-49 ms on the three samples; 27 of 72 real-template cells past 20 s. To fix
  it the oracle needs propagation, a node budget and three-valued answers, which is the two-stage oracle. The design's
  claim "`null` is a proof; no budget is ever read as does not fit" is true only because the prototype has no budget.
- **Exactness with four asterisks** it lists itself (15.1): helper credit toward a floor is conservative; leximin is exact
  only at the first level; monotone feasibility is unproven when a third exercise opens; the weekly 10 % bound is taken
  from week 1 for every week. Each is defensible; together they make "exact" hard to test, because there is no simple
  reference to compare against.
- **Thin tests.** 42 plan solves; no brute-force comparison was run (it is specified); not run in JavaScriptCore.
- **The scorer shares the solver's evaluation function** (`plan/eval.mjs` is "the only place that knows the time model and
  the credit map" and `certify` calls it). A wrong minute formula would pass its own certificate. DR-19 asks for an
  independent scorer.
- **Migration reorders the pipeline.** Selection moves after planning (today it runs before), `generate.mjs` is a rewrite,
  and "no pick found" becomes a ban-the-slot-and-re-solve loop between two modules.
- Depth and exposure days are rule-driven, not searched. That is the angle, and it is cheaper, but it is also the shape of
  the current engine (a chain of structural rules ahead of the numbers), which is where the patch-on-patch history came from.
- Twin days, split templates, circuits, strength roles, optional cells, Focus and exercise picks are specified, not
  prototyped; the one split template I tried crashed.

---

## 3. Why two-stage wins on this lens

The three designs agree on more than they differ: lexicographic tiers as data; the keep vector decided by one exact
question per group in the coach's keep order; the staircase inside a day as a closed form; "the exposure that is behind
takes the set" across days; proving minutes and floors on the first and last week only (the sandwich lemma); offers by
re-solving; a certificate that re-checks every week. A spec built on any of them inherits that common core.

They differ in the engine that answers "is there a legal plan with these groups?":

| | milp | two-stage | template-parametric |
|---|---|---|---|
| Engine | general LP-based branch and bound | purpose-built finite-domain search with propagation | depth-first enumeration over days with a memo |
| Arithmetic | floating point proposes, integers confirm "fits"; "no" rests on floats today | integers | integers |
| Checked against brute force | specified | **done, and it found a bug** | specified |
| Cost of one node (prototype) | 4-26 ms | 0.05-0.12 ms | about 0.001 ms |
| Nodes for a hard plan | hundreds to thousands | hundreds to tens of thousands | millions |
| Behaviour when it runs out | "best found", bound reported | "unknown", never read as "no" | none in the prototype |

Two-stage sits where an engine for this repository should: strong enough pruning that most questions end within 50 nodes,
no numerical machinery, and small enough to be tested exhaustively at small sizes. MILP is over-powered for a model of
130-235 integers and pays for it in everything a contributor touches. Template-parametric is under-powered exactly where
plans are largest.

---

## 4. Grafts onto two-stage

### 4.1 From template-parametric

1. **Its compile step as stage 0.** `buildProblem` already turns any template into cells, slots in session order, set
   bounds, time class, credit, pair tags, lead and paired flags, class lifts as fixed slots, gated stations as later slots,
   fixed blocks and test minutes. That is two-stage's unbuilt grammar builder. Port it first; it removes the winner's
   largest migration risk and lets the template grid run in week one.
2. **The edit-rule catalogue as the public contract of stage 0.** Every way a candidate, pattern station or fixed block
   enters or leaves, with id, precondition, effect, tier and coach source, as data in `model/rules.json`. The planner then
   has no template-specific code and a contributor changes structure without touching the search.
3. **Twin-day tying** (A1 / A2 are one decision: sets differ by 0 or 1, the earlier day takes the odd set). It is R3-VOL-03
   read literally, and it halves the variables on exactly the templates where section 1.2 found the tail.
4. **Structural "no" before any search**, with its sentence: one exposure day x the per-session cap below floor + climb
   means no session length helps and the offer is another day. Also the **minimum length of a template** (the fixed blocks
   alone must fit) checked at compile, with the first length that fits as the offer.
5. **"One more day is never worse" by construction**: the plan for n days is the better of the n-day template and the
   (n-1)-day plan with the extra day as optional. Templates do not nest, so no theorem gives this; the rule does.
6. **The test-week rule** (a test replaces the station of that quality, room items are skipped that day, a strength test
   sits only on a lift the plan trains) as the definition of two-stage's `fit.test_days = inside` option.
7. **A custom rule declares its kind and registration tests the declaration** on sampled points, on top of two-stage's four
   accepted shapes: a rule that claims to be "an upper limit that grows with sets" is checked for it before it is loaded.

### 4.2 From milp

8. **The catalogue as the single source of rows**: id, tier, kind, scope, the `why` key. The oracle's tables, the certifier,
   `validate.mjs` and the scorer all read it; an exemption exists only as a named parameter. (Two-stage says this in one
   paragraph; MILP specifies it.)
9. **The reference model as a build-time certifier, never as run-time code.** Brute force stops at 2-3 groups; the tail is
   at 8. Keep the MILP's every-week model, emitted from the same catalogue, and in CI solve the grid with a strong solver
   (HiGHS as a development-only tool outside `engine/`, if the maintainers accept it, else the research kernel with a long
   budget). The run-time planner must reproduce every certified keep vector inside its node budget; an "unknown" on the
   grid blocks a release.
10. **Conflict explanations in rule ids, on demand.** A deletion filter (later QuickXplain) over rule families, with the
    two-stage oracle as the yes / no engine. With 96 % of questions ending within 50 nodes, a conflict over 30-60 rule
    families should cost tenths of a second where the MILP needs 16 s (to be measured). Run it under its own budget
    with "reason not computed" as a legal answer.
11. **Epochs from a dominance test on the data** instead of "reserve the largest cost". Two-stage's reserved costs are
    conservative when an early exercise block is the expensive one (bodybuilders); MILP's rule adds one proved week only
    when no later week dominates. Two-stage lists this as a version-2 refinement; take the MILP's formulation of it.
12. **Shadow mode and the grid habit.** A model flag that generates both plans and shows the old one, scored on the
    benchmark at every slice; and a grid sweep (families x days x minutes x levels) with a saved summary as a standing
    script, the way `milp_proto/grid.mjs` does it.
13. **Measure what a structural rule costs.** In CI, solve the reference model with the in-day staircase relaxed to a tier
    and list every intake where that would keep a group or raise a peak. Without it nobody knows the price of making
    VOL-07 hard.

### 4.3 My own conditions on the winner (from section 1.2)

1. **A per-plan node cap, and a budget that means what it says.** One number bounds the whole plan; the doubling ladder and
   the second strategy spend inside it. On exhaustion: the certified plan in hand, tier marked "best found". With this the
   worst-case time is a product of two measured constants.
2. **Separate the propagator from the training model**: a small generic module ("variables with finite domains, rows that
   are sums of table values") that can be fuzzed against brute force on random table models, and a builder that fills the
   tables from the catalogue. The MILP design's "the kernel knows nothing about training" is the right layering.
3. **Incremental propagation and precomputed subset tables.** 50-120 microseconds a node is a prototype cost; the same
   search should run 10 x faster before any algorithmic change. Measure it, do not assume it.
4. **Every implied (pruning) row is a named, individually switchable entry with its own brute-force test.** That is where
   the one bug lived; a contributor who adds a bound must be able to prove it valid mechanically.

### 4.4 What not to graft

- Any LP or branch-and-bound kernel at run time.
- The template-parametric search, its selection-after-planning order, and its week-1-based weekly cap in the stairway
  (two-stage's dynamic program applies the rule to the totals really placed, and is exact).
- A weighted single objective for any tier (measured as fragile by the MILP design).

---

## 5. Gate before the old engine is switched off

In this order; each is a script with a saved output, not a judgement.

1. Stage 0 builds all 630 grid cells from `templates.json` (the MILP grid skipped 21 `hybrid_crossfit` cells for lack of
   4-day day types; decide them).
2. The full grid through the two-stage chain at the per-plan cap: 0 hard-row violations; keep vector equal to the certified
   one in every cell; no "unknown" in tier G1; lower tiers "best found" counted.
3. Time on the grid: p99 under 250 ms on the laptop (about 1 s on a phone, DR-22), measured in V8 and JavaScriptCore, and
   once on a real mid-range phone. No design has a phone measurement.
4. The ten `tests/review-*.test.mjs` files (about 4,000 lines) each re-expressed as a rule-id property or retired with the
   decision that made them obsolete. All three designs carry this cost; none has costed it.

If step 3 fails after twin tying, backjumping and the propagation rewrite, the fallback is a smaller budget with honest
"best found" marks, not a different solver: legality never depends on a proof in this design, which is the property that
makes the risk acceptable.

---

## 6. Reproduce

```
node design/judge3/probe_ts_scale.mjs 8 8 4 4 30 4242 20000     # groups min max, days min max, count, seed, node budget
node design/judge3/probe_tpp_grid.mjs 20                         # seconds per cell; calls probe_tpp_cell.mjs
node design/judge3/probe_tpp_cell.mjs aesthetics 4 - 60 L2       # one cell
```

| File | Content |
|---|---|
| `judge3/probe_ts_scale.mjs`, `probe_ts_scale.*.out.txt` | section 1.2: the two-stage generator of `test_link.mjs` with the size as a parameter (session limits 45-90 min, a group on about half of the days after its first) |
| `judge3/probe_tpp_cell.mjs`, `probe_tpp_grid.mjs`, `probe_tpp_grid.out.txt` | section 1.3 |

The probes import the prototypes and read `model/*.json`; they write nothing (outputs are shell redirects). Node counts and
verdicts reproduce exactly; times will differ.
