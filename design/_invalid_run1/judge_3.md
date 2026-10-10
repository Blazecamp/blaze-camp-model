# Judge 3 - engineering

Lens: browser performance, simplicity, testability, explainability, maintainability by open-source contributors, and migration
risk from the current engine.
Written 2026-10-09 22:30 (local). Nothing outside `design/` was written; no package was installed; nothing was committed.
Evidence scripts and their outputs are in `design/judge3/` (section 9 says how to rerun them).

---

## 0. Status: there are no design documents to judge

The task was to read the three planner designs and score them. The list of files arrived empty, and the files do not exist:

- `design/design_milp.md`, `design/design_two-stage.md`, `design/design_template-parametric.md`: none is on disk (checked at
  21:41, 21:42, 22:10, 22:16 and 22:29). `workflows/planner_design.js` builds the judge prompt from the design agents that
  returned a result; all three returned nothing.

**What this file does instead.** It scores the three design *angles* exactly as the workflow briefed them (the `ANGLES` list in
`workflows/planner_design.js`), on the engineering lens, against what does exist: `design/diagnosis.md`,
`design/algorithm_research.md`, `design/rules_as_constraints.md`, the research prototypes in `design/research/`, the current
engine and its contracts, and **six measurements I ran for this judgement** (section 3). The scores are scores of approaches,
not reviews of documents. Section 8 says what a real document would have to show to move each score.

**For whoever runs the workflow.** The Spec phase is told to "take the winning design". There is none. Either re-run the Design
panel, or let the spec writer build from the diagnosis, the research, the rule inventory and the judge files. Sections 5 to 7 are
written to be usable in both cases.

**The measurements changed the picture.** The research file recommends an exact pure-JS branch-and-bound kernel and reports
"1-356 ms per tier set" and "at most 1.1 s on the hardest case", from five hand-picked cases. A sweep of the same prototype over
all 630 cells of the template grid shows that this does not hold in general (section 3.1). That finding decides most of this
judgement, so it comes first.

---

## 1. Verdict on one page

| Angle (as briefed) | Score (1-10) | One-line engineering reason |
|---|---|---|
| **two-stage** | **8** | Small pure stages with one job each. Every stage can be tested against a brute-force oracle, most of the work is polynomial and runs in milliseconds, and it can replace the current engine one stage at a time. Its one hard part is the link between the stages, which must be exact per day (measured, 3.4). |
| template-parametric | 7 | The cheapest to build and to run, and the smallest change to the engine. But today's skeletons cannot hold the minimums in 54 of 63 grid cells (3.5), so the "explicit add / remove rules" would be the real planner, and a rule chain is what the current engine already is. |
| milp | 5 | Measured: the whole-block model is not solvable on the pure-JS kernel (20-34 s of CPU for 40 nodes, no plan found, 3.3). Decomposed, it still leaves 8.8 % of grid cells unproven at 2,000 nodes per tier (3.1). The way out is a 3.5 MB WebAssembly solver, which breaks three binding engine rules. |

**Winner: two-stage**, built as "construct first, prove second" (section 5).

**Grafts** (full text in section 6):

1. From milp: one constraint catalogue as data, read by the planner, `validate.mjs` and the benchmark scorer.
2. From milp: the exact branch-and-bound kernel, used only as the feasibility oracle for group selection and as a bounded
   improver, plus a development-time certifier. It never runs as the whole planner.
3. From milp: a three-valued oracle result (fits / proven not to fit / unknown), with deterministic work budgets, never a clock.
4. From milp: whole-number arithmetic everywhere (quarter credits x 4, minutes x 2,000), so no tolerance constants.
5. From milp: strict tier-by-tier objectives with whole-number freezes, including inside the stairway flow.
6. From milp: offers computed by re-solving at valid intake values, and a minimal-conflict reason for every group not trained.
7. From template-parametric: the coach's templates are the day grammar and the list of candidate slots, never the capacity plan.
8. From template-parametric: the plan is parametrized by the coach's own placement rules, so the unknowns are a few whole
   numbers per group and "does it fit" is a handful of sums (measured, 3.6).
9. From template-parametric: his worked examples and sheets as golden tests; format-specific progressions for circuits and
   the class model.
10. From the measurements: always start from a constructed plan; certify the whole intake grid in CI; state the performance
    budget in deterministic work units; migrate behind the existing `generateWith(deps)` seam.

---

## 2. The lens

Six criteria. Weights reflect what has hurt this project so far: fix rounds that regress (migration, maintainability) and a
solver nobody has run at scale (performance).

| # | Criterion | What I looked for | Weight |
|---|---|---|---|
| E1 | Browser performance and determinism | Worst case, not the median: the 99th percentile over the whole intake grid on a phone. Memory per solve. Synchronous `generate()`. Shipped bytes. Byte-identical plans across engines and across refactors. | 20 % |
| E2 | Simplicity | Number of concepts a new contributor must hold. Lines of numerical code. How many parts must be right at once. | 15 % |
| E3 | Testability | Can each part be tested alone against an independent oracle? Can a failing plan be traced to one part? Are there properties (monotone in minutes, no slot loses a set) that tests can assert? | 15 % |
| E4 | Explainability | Does every decision produce a `why` in the coach's words, as CONTRACTS section 1.5 requires, without reverse-engineering a solver's answer? | 15 % |
| E5 | Maintainability by open-source contributors | Fit with the binding rules (CONTRIBUTING section 7, CONTRACTS section 1.2-1.3): plain ES modules, no npm dependencies, no build step, engine files import only engine files, data-driven, no clock. Can a coach rule be added without solver expertise? | 15 % |
| E6 | Migration risk | Seams in the current engine, how much must change at once, how many tests break at once, whether there is a fallback, whether the plan JSON changes. | 20 % |

---

## 3. Measurements made for this judgement

All runs: Node 22.22.0 (V8) on an Apple M3 laptop. Another workflow was running the engine's test suite on the same machine
(load average 5 to 280 during these runs), so I report **node counts, pivot counts and process CPU time**, not wall time, and I
say where CPU time was taken under load. A mid-range phone is slower than this laptop; I did not measure one. Where a phone
figure appears it assumes 4 times slower and is marked as an assumption.

The prototype model is simpler than the real problem (one line for hips, no optional days, no Focus slots, no tests, athletic
minutes fixed; `proto_endpoint.mjs` lists these). Every solver cost below is therefore a lower bound for the real model.

### 3.1 Heavy tails of the research chain over the whole template grid

`judge3/tail_sweep.mjs`: the research prototype's own chain (exact group selection, endpoint dosing, flow stairway, placement)
on every template family x 2-6 days x 30-120 minutes x L1-L3 = **630 cells** (the research measured 5). Selection budget
20,000 nodes per oracle call (the prototype's default); dosing budget 2,000 nodes per tier.

| | Result |
|---|---|
| Cells | 630; 21 cannot be built (`hybrid_crossfit` has no 4-day day types); 15 hold no group at all; 4 end in an unknown selection; 590 dosed |
| Model size | at most 213 variables, 774 rows |
| Group selection (a yes / no question) | nodes: median 60, 90th percentile 192, 99th percentile 7,106, maximum 7,108 |
| Selection returned **unknown** | **4 cells** (`fat_loss_bootcamp` and `no_equipment`, 5 days x 45 min, L2 and L3): 20,000 nodes were not enough to answer "does this group fit" |
| Selection, worst decided cells | athletic 4, 5 and 6 days x 75 min, L2 and L3: one oracle call needs 7,017 nodes, 3.7-8.0 s of CPU (under load) |
| Endpoint dosing **not proven optimal** at 2,000 nodes per tier | **52 of 590 cells (8.8 %)**: aesthetics 15 of 105, athletic 9 of 90, bootcamp 15 of 103, no-equipment 13 of 103, strength 0, hybrid 0 |
| ... of which **no plan found at all** | **2 cells** (`fat_loss_bootcamp` and `no_equipment`, 5 x 60, L3), although the selection step had just found a witness for the same model |
| Unproven cells include the most common schedules | aesthetics 3 x 60, 4 x 60 and 4 x 45 (L2, L3); athletic 4 x 75 (L2, L3) and 4 x 60 (L3) |
| Cost of a full proof, where I let it finish | aesthetics 4 x 45 L2: 28,427 nodes; 3 x 60 L3: 7,959 nodes; 3 x 60 L2: 4,093 nodes (3.6 s of CPU at low load) |

At about 0.5 ms of laptop CPU per dosing node (measured at low load, `judge3/anytime.out.txt`), 28,427 nodes is about 13 s
on the laptop and, on the 4x assumption, close to a minute on a phone. The research's proposed budget is 1.5 s per plan.

The rigor judge's scratch folder (`design/judge2/heavy_tail.out.txt`) shows the same class of tail found independently: one
oracle call that needs 189,968 nodes. I did not use that result; I note only that two separate probes agree.

**Reading.** The kernel is correct on everything it finishes (the research's brute-force cross-checks pass here too: 0
mismatches in 1,900 random integer programs and 3,000 linear programs, rerun 21:44). The problem is cost, and it sits in two
places: proving that a sum objective cannot be improved, and proving that a tight group does not fit. A design that puts a
branch-and-bound proof on the path of every plan inherits this.

### 3.2 A node budget gives nearly the same plan, with two holes

`judge3/anytime.mjs`: the same dosing with 100, 300, 1,000 and 3,000 nodes per tier (CPU at low load).

| Cell | Proven optimum (worst shortfall / total shortfall / week-1 distance) | At 300 nodes per tier | CPU at 300 | At 100 nodes per tier |
|---|---|---|---|---|
| aesthetics 4 x 45 L2 | 10 / 40 / 20 | 10 / 40 / 22, none proven | 454 ms | **no plan** |
| aesthetics 3 x 60 L2 | 14 / 65 / 19 | 14 / 66 / 21 | 693 ms | 14 / 66 / 21 |
| aesthetics 3 x 60 L3 | 17 / 86 / 43 | 17 / 87 / 44 | 786 ms | 17 / - (tier 2 found nothing new) |
| aesthetics 2 x 90 L2 | 14 / 58 / 12 (4,478 nodes in the unbudgeted run) | 14 / 58 / tier 3 found nothing new (13, unproven, at 3,000) | 299 ms | same |
| aesthetics 4 x 60 L1 (the research's E1) | 1 / 2 / 4 | 1 / 2 / 4, tier 2 not proven | 291 ms | 1 / 2 / 4 |

**Reading.** The *plans* are within one or two sets of the optimum long before the *proof* arrives. So a budgeted solver is
usable, on two conditions the prototype does not meet: it must never come back empty (a constructed starting plan), and the
output must say "best found" where it has no proof.

### 3.3 The whole block as one integer program

`judge3/monolith.mjs`: every week x every slot in one model, on the research kernel. This is the best case for the monolith:
the structure (groups, days, superset pairs) is already fixed from the exact selection, athletic work is not co-planned, and
there is one exercise block. Each N = 12 model was checked to be feasible by plugging in a plan built another way (3.6).

| Case, 12 weeks | Variables / rows | Dense tableau per node | Root relaxation | 40 nodes per tier |
|---|---|---|---|---|
| racket player 2 x 45 (6 active slots) | 88 / 244 | under 1 MB | 5 ms | solved and proven, 42 nodes, 0.1 s |
| athlete 3 x 90 (23 slots) | 300 / 815 | 7 MB | 0.2 s | 3.3 s of CPU, **no plan found** |
| aesthetics 4 x 60 L1 (36 slots) | 460 / 1,690 | 29 MB | 1.9 s | 29 s of CPU, **no plan found** |
| aesthetics 4 x 75 L2 (40 slots) | 508 / 1,854 | 35 MB | 0.6 s | 20 s of CPU, **no plan found** |

On the two aesthetics cases that is 0.5-0.7 s of CPU per node, on models that need hundreds to thousands of nodes. For comparison, the layered chain solves the
same aesthetics 4 x 60 L1 case in about 1 s, and the construction of 3.6 reaches the same worst shortfall (1 set) with no flat
week in a few milliseconds.

**Reading.** A whole-block integer program in the browser needs a real solver (HiGHS compiled to WebAssembly: 3.5 MB, loaded
asynchronously) or it needs decomposition, at which point it is the two-stage design with a solver inside.

### 3.4 The link between the two stages must be exact per day

`judge3/link.mjs`: the same lexicographic group selection run twice, once with the exact per-day minutes and once with a
weekly minutes total (the sum of the days), which is the natural "stage 1 checks against time capacity" shortcut. L2, 105
cells; the 5- and 6-day templates of these three families reuse the 4 main days, so 63 cells are distinct.

| | Distinct cells (of 63) | All cells (of 105) |
|---|---|---|
| Weekly-capacity stage 1 keeps a group that the exact per-day oracle proves cannot be packed | 10 | 20 |
| ... and also drops a group the exact oracle keeps (a different answer, not only an optimistic one) | 2 | 6 |

Examples: aesthetics 3 x 45 promises shoulders, 4 x 45 promises calves, athletic 4 x 60 promises shoulders, strength 4 x 45
promises back and loses shoulders.

**Reading.** In one cell in six, a stage 1 that reasons on weekly totals hands stage 2 a target it cannot pack. Stage 2 would
then have to cut, and "targets, packing and verification disagree" is root cause RC4 of the diagnosis. The two-stage angle is
only sound if stage 1's feasibility test evaluates the real per-day packing.

### 3.5 Today's template skeletons rarely hold the minimums

Same script: keep every template group on every template day (the fixed skeleton) and ask only whether *any* set vector holds
the floors, a 2-set climb and the minutes x 1.10.

| Family | Distinct cells where no set vector exists (of 21) | Shortest session at which the skeleton works |
|---|---|---|
| aesthetics | 16 | 4 days: 60 min; 2 and 3 days: never |
| athletic | 17 | 4 days: 75 min; 2 and 3 days: never |
| strength | 21 | never |
| **all three** | **54 of 63** | |

**Reading.** For the template-parametric angle, "scale the skeleton's sets" is the exception, and "add or remove slots by
explicit rules" is the normal path. Whatever those rules are, they decide which groups are trained, and that is the decision
the current engine gets wrong (RC3: 8 + 14 monotonicity violations in the diagnosis sweep).

### 3.6 Does dosing need a solver at all? A probe

`judge3/ladder_probe.mjs`. This is a feasibility probe by the judge, not a design. The idea comes from the template-parametric
angle: the coach's own placement rules already determine where a set goes (R3-VOL-03: the exposure that is behind gets the
set; VOL-07: 2/2/2, 3/2/2, 3/3/2 ...). So a plan can be *constructed* by adding one set at a time to the group furthest from
its ceiling, and week w is a prefix of that order. Each "does it still fit" is a few sums. I compared two variants with the
research MILP on the same instance and the same structure: 117 cells (aesthetics and athletic, 2-4 days, 30-120 min, L1-L3)
with at least one group kept.

| | Strict function (even exposures always) | Sequential, looks at the minutes | Research MILP, 2,000 nodes per tier |
|---|---|---|---|
| Builds a plan | 92 of 117 | 105 of 117 | 117 of 117 (107 fully proven) |
| Worst peak shortfall vs the MILP's proven optimum | equal in 74 of 87; +1 in 6; +2 in 6; +5 in 1 | **equal in 89 of 100**; +1 in 9; +2 in 1; +3 in 1 | - |
| Total peak shortfall vs the proven optimum | equal in 59 of 84 | equal in 79 of 97; +1 in 10; +2 in 7; +4 in 1 | - |
| In the 8 cells the MILP did not finish | - | equal worst shortfall in 6 | not proven |
| All 12 weeks checked: minutes, floors, VOL-07, twin days, session ceiling | 0 violations | 0 violations | (research: 0 in 60 weeks) |
| Slots that ever lose a set | 0 | 0 | 0 |
| CPU per plan | median 1.6 ms, maximum 10.5 ms | median 1.5 ms, maximum 15 ms | median 29 ms, 90th percentile 1.2 s, maximum 18 s |

Two things the probe got wrong, both instructive:

- **It misses plans that exist.** The sequential variant cannot place the kept set in 12 of 117 cells (10 %) where the exact
  oracle proved a plan exists (aesthetics 2 x 45, 2 x 75 and 3 x 60; athletic 3 x 60 and 3 x 75). A planner built only on a
  construction would drop a group there. This is the over-cutting the coach saw, reproduced by a third method.
- **Its first version failed 26 cells** because it tested a floor before the helper sets that credit it existed (the biceps
  floor needs the rows' quarter credit). I found that only because the exact oracle said those cells were feasible
  (`ladder_summary.v1.out.txt`).

**Reading.** Construction is three to four orders of magnitude cheaper and usually optimal. It cannot tell "does not fit"
from "did not find the fit". The exact oracle can, but it is slow in the tail. Neither is enough alone. Together they cover
each other: construct first, and call the exact oracle only for the question a construction cannot answer.

---

## 4. Scores

Scale per criterion 1-10; total = weighted sum.

| Criterion (weight) | two-stage | template-parametric | milp |
|---|---|---|---|
| E1 performance and determinism (20) | 8 | 9 | 3 |
| E2 simplicity (15) | 7 | 7 | 5 |
| E3 testability (15) | 9 | 5 | 6 |
| E4 explainability (15) | 8 | 7 | 6 |
| E5 maintainability (15) | 8 | 5 | 4 |
| E6 migration risk (20) | 7 | 6 | 4 |
| **Weighted** | **7.8** | **6.6** | **4.6** |
| **Score** | **8** | **7** | **5** |

### 4.1 two-stage: 8

*As briefed:* stage 1 decides weekly sets per group per week (monotone stairway by isotonic and apportionment math, floors,
caps, Focus, R3-SES-02 group selection by an exact feasibility check against time capacity); stage 2 packs the sets into days
and slots; a provable guarantee links the stages.

- **Performance (8).** Stage 1's stairway is polynomial: the research's min-cost flow takes 0.09 ms on average and at most
  4.6 ms over 2,000 random plans (rerun here), in whole numbers only. (Judge 2 reports that this flow computes its step
  limits on the planned curve and can break the 10 % rule; that is a correctness fix for the spec and does not change the
  cost class.) Placement is sequential and costs microseconds.
  The only search is "does this set of groups fit", and the angle isolates it in one function, so a construction can answer
  it in 90 % of cells (3.6) and the exact oracle is called for the rest. No dependency, synchronous, a few kilobytes. It is
  not a 10 because that oracle still has a tail (3.1: 4 unknown cells, 7,017-node calls), which the design must handle.
- **Simplicity (7).** Four or five small textbook algorithms, each with one job. The cost is the number of stages and the
  argument that links them, which must be written down once and kept true.
- **Testability (9).** Each stage is a pure function with a small input and an independent oracle: brute force for group
  selection on small instances, flow invariants (monotone, step limits, landing week), "no slot ever loses a set" for
  placement, and "every week sits between the two proven endpoint weeks" for the link. A failing plan can be traced to the
  stage whose invariant broke. Properties such as "adding minutes never makes the kept-group vector worse in keep order" are
  testable at the stage that owns them. (Judge 2 shows that the stronger form, "more time never untrains any group", is not
  a property an exact planner can have; the spec should state the weaker one.)
- **Explainability (8).** The stages speak the coach's units: weekly sets per group per week, then where each set goes. A
  refused set names the check that refused it ("Monday is full in week 12: 66 of 66 minutes"), with no duals or conflict
  analysis. "Not trained directly" needs the exact oracle's proof to be honest; that is graft 6.
- **Maintainability (8).** Plain JS in the engine's existing style, no floating-point numerics outside one isolated solver
  folder, and a new coach rule normally belongs to exactly one stage. The risk is a rule that spans stages (bilateral share,
  athletic minutes); the catalogue of graft 1 gives those a home.
- **Migration (7).** It can ship in slices behind the existing seam (section 7): the flow stairway first, then placement,
  then selection. Each slice can be compared against the old engine on the benchmark before the next. It is not higher
  because the last slice must also take over the time cuts in `week.mjs` and the athletic reconcile in `generate.mjs`.

### 4.2 template-parametric: 7

*As briefed:* the coach's templates as fixed skeletons selected by goal x days x minutes; sets per slot per week solved exactly
by a small integer program or dynamic program; slots added or removed only by explicit rules.

- **Performance (9).** With the structure fixed the unknowns are few, and the placement rules make the solve a construction
  (3.6: 1.5 ms median). Note that "small integer program" is not automatically fast: the 8.8 % of unproven cells in 3.1 are
  fixed-structure dosing problems. This score assumes the dynamic-program or construction route.
- **Simplicity (7).** The core is the simplest of the three. The explicit add / remove rules are not counted in that core, and
  3.5 says they run in 54 of 63 cells.
- **Testability (5).** Golden tests against the coach's own sheets are a real asset. But the part that decides which groups are
  trained is a rule chain, and a rule chain has no oracle to be tested against except itself. The current engine's rule chain
  passes all its own checks while 4 of 8 plans train a group below the floor (diagnosis RC10).
- **Explainability (7).** "This is the coach's day with the sets scaled" is the easiest story to tell. For a dropped group the
  reason is "rule 12 fired", which is a weaker answer than "no plan can hold it".
- **Maintainability (5).** Adding or correcting a template is a data change a non-programmer can review, which suits this
  repository. Against that, each days x minutes variant is another skeleton to keep approved (30 templates and 1,765 stations
  today), and explicit slot rules are the mechanism that produced 134 round-3 decisions and a 2,149-line function.
- **Migration (6).** The smallest code change: `week.mjs`, `select.mjs`, `dose.mjs` and `render.mjs` stay. But it keeps
  "structure before capacity" (RC2) and rule-based selection (RC3), so the chance that the next coach review finds the same
  class of failure is the highest of the three. A migration that is cheap and does not end the regressions is not low-risk.

### 4.3 milp: 5

*As briefed:* the whole block (weeks x days x groups x slots) as one mixed-integer program with lexicographic goal programming;
a pure-JS branch-and-bound or a justified WebAssembly solver; decomposition to keep it fast; exact infeasibility reporting.

- **Performance (3).** Measured in 3.3: the whole-block model costs 0.5-0.7 s per node on the pure-JS kernel and finds no
  plan in 40 nodes on three of four cases. Decomposed, 3.1 applies: 8.8 % of cells unproven, 2 cells with no plan, 4 unknown
  selections. The kernel allocates a new dense tableau at every node (up to 35 MB) and re-solves from scratch; the research's
  own hardening list (warm starts, presolve, pseudo-cost branching, best-bound search) is a solver-engineering project with
  an uncertain end. HiGHS would very probably be fast enough, but it is 3.5 MB of WebAssembly for a phone page and was not
  measured.
- **Simplicity (5).** One model is the simplest thing to *state*. To *run* it, the repository must own a simplex with
  equilibration, a Harris ratio test, a Bland fallback and four tolerance constants (1e-9, 1e-9, 1e-7, 1e-6), or own a build
  step for a WebAssembly binary.
- **Testability (6).** Rows are declarative and easy to unit-test, and the kernel has a good brute-force harness. But plan
  behaviour emerges from objective terms and tie-breaks, so plan-level tests are golden files, a failure cannot be traced to
  a stage, and adding one row can change solve time anywhere (a performance regression with no local cause).
- **Explainability (6).** The best of the three for infeasibility: an exact "no plan holds this group" plus a minimal
  conflict. The weakest for choices: "why is the extra set on Thursday" is answered by a tie-break in tier 7, and the binding
  rows of an optimum are not reasons a coach recognises. The why-records have to be reconstructed from the solution.
- **Maintainability (4).** Three binding rules stand in the way of the WebAssembly route: "no npm dependencies", "no build
  step" and "engine files import only other engine files ... they run unchanged in a browser" (CONTRACTS 1.2, CONTRIBUTING
  section 7), and `generate()` would become asynchronous. On the pure-JS route, a contributor who adds a rule must know how
  to linearize it and how it affects the relaxation. The prototype already shows how fragile hand-built models are: its
  author records a bug where a variable index of 0 was tested for truthiness and three big groups were dropped.
- **Migration (4).** All or nothing. One model replaces the volume engine, the time cuts in `week.mjs` and the athletic
  reconcile together; all 8 samples change at once; about 320 test lines that read dosing outputs, in 21 test files, are hit in one step; and the
  only fallback is the old engine.

The research file's own recommendation is not this angle. It is a layered planner that uses an integer program only for the
coupled sub-problems. That is the two-stage design with a solver inside one stage, and section 5 keeps that part.

---

## 5. The winner, in the shape the measurements support

Two-stage wins. The measurements say which version of it to build: **construct first, prove second.**

1. **One time function and one catalogue** (grafts 1 and 4). Day minutes, credits and every rule row are whole-number
   functions of the slot vector, in one module, read by the planner, the dose, `validate.mjs` and the benchmark scorer.
2. **Stage 2 is written first, as a function.** Sequential placement by the coach's rules (the exposure that is behind unless
   its day is full, then VOL-07 inside the day). It records the order in which each group's sets were added, so any week is a
   prefix. Properties to test: no slot ever loses a set; every prefix passes the rows of its week.
3. **Stage 1 owns the questions.**
   - *Does this set of groups fit?* Construction first. If it places the minimums (floor in week 1, minimum climb), the answer
     is yes, with a witness. If it cannot, ask the exact oracle (graft 2) under a deterministic budget. The oracle returns
     fits (with a witness the construction then starts from), proven not to fit (with the minimal conflict, graft 6), or
     unknown (graft 3).
   - *Which groups?* Lexicographic keep order over that question, exactly as the research's layer B.
   - *How high?* Water-filling toward the ceilings with the same placement function, then an optional bounded improvement by
     the exact kernel starting from that plan. The output records "proven" or "best found" per tier.
   - *Which week?* The min-cost-flow stairway on the group totals, tier by tier (graft 5).
4. **The link is the sandwich property, stated as a test.** Both endpoint weeks pass every row; every middle week is a prefix
   between them; time, floors and upper rows are monotone in the slot vector. The research proves this; 3.6 measured 0
   violations in 2,364 plan-weeks.
5. **What "unknown" means must be decided in the spec.** The research says "never drop a group on unknown: keep it and flag
   the plan". That cannot be implemented as written: with no witness there is no plan to print for that group. The honest
   options are to spend more budget, or to leave the group out and say "not proven to fit" (never "does not fit") with the
   offer attached. 3.1 shows the case is real (4 of 609 cells at 20,000 nodes).

Module shape I would hand to the spec writer (each file small, pure, in the existing engine style):

| New file (suggested) | Job | Tested against |
|---|---|---|
| `engine/plan/units.mjs` | whole-number scaling, credits, the one time function | the coach's sheet sessions (BYOP day 1: 7 exercises, 19 sets, about 60 min) |
| `engine/plan/catalogue.mjs` | rule rows from `rules.json` with ids, tiers and evaluators | every row has a passing and a failing fixture |
| `engine/plan/placement.mjs` | sequential placement, prefixes | no slot loses a set; VOL-07 and twin-day rows on every prefix |
| `engine/plan/fits.mjs` | construction, then exact oracle; three-valued result | brute force on small instances; the certified grid (graft 10) |
| `engine/plan/groups.mjs` | lexicographic keep, offers by re-solve, conflicts | the coach's worked examples (12 v1.2 section 5.1, 5.5); the kept vector never worse in keep order as minutes or days are added |
| `engine/plan/peaks.mjs` | endpoint weeks: water-filling plus bounded improvement | never worse than the construction; equals the exact optimum on the certified grid within a stated gap |
| `engine/plan/stairway.mjs` | isotonic envelope and min-cost flow | the step and rise limits checked on the weeks really placed, over a soundly generated random corpus (see judge 2 on the research's generator) |
| `engine/plan/solver/*.mjs` | the kernel (`kernel`, `lp`, `milp`, `mcf`), isolated | the research's brute-force harness, kept |
| `engine/plan/index.mjs` | `planWeeklySets`-compatible adapter | the benchmark scorer |

Risks that remain with the winner:

- The oracle's tail (3.1). Mitigations: construction first; the selection witness passed on as the starting plan; the
  certified grid in CI; budgets in work units; kernel hardening only as far as the certified grid needs.
- A construction is greedy. Where it is one or two sets under the optimum (11 of 100 cells in 3.6), the bounded improver
  closes the gap or the plan says "best found". The spec should set the accepted gap as a number.
- The prototype model leaves out hips as two lines, optional days, Focus slots, tests and athletic co-planning. Each must be
  added to the placement function and the catalogue, and each can break monotonicity if added carelessly (a capacity-aware
  tie-break is safe as a sequential process; it is not safe as a formula on one group's total).

---

## 6. Grafts

### From milp

1. **One constraint catalogue as data.** Every rule is a row with its id from `rules_as_constraints.json`, its tier, its coach
   reference and an evaluator. The planner, `validate.mjs` and the benchmark scorer read the same rows, so a green validation
   and a coach-acceptable plan can no longer mean different things (RC10). `validate.mjs` already imports `linesOf` and
   `groupCredits` from `timefit.mjs`, so the pattern exists.
2. **The exact kernel, in a confined role.** Keep the research's `kernel.mjs`, `lp.mjs`, `milp.mjs` and their brute-force
   tests, isolated in one folder. Use them (a) as the feasibility oracle when the construction cannot place a group, (b) as a
   bounded improver of the peaks, and (c) as a certifier in tests. Do not put a proof on the path of every plan.
3. **Three-valued answers and deterministic budgets.** "Fits", "proven not to fit", "unknown". Budgets count nodes or
   evaluations, never time, so a slow phone prints the same plan as a fast laptop (the engine already bans `Date.now()` and
   `performance.now()`).
4. **Whole numbers everywhere.** Quarter credits scaled by 4, minutes by 2,000. This removes `CLIMB_TOL`, `EPS` comparisons
   and the 0.5-set fudge (RC5), and it is why the prototypes are byte-identical in V8 and JavaScriptCore.
5. **Tier by tier, with whole-number freezes.** No weighted sums across tiers. This applies to the flow too: the prototype's
   `flowSchedule` separates its goals with fixed weights (20,000, 10,000, 300, 100 per week), which is a weighted sum. Either
   compute weights that provably dominate from the instance, or run the flow once per tier.
6. **Exact reasons and exact offers.** A minimal conflict for every group not trained ("chest has 2 exercises on one day
   here: at most 9 sets a week"), and offers found by re-solving at valid intake values (30, 45, ... 120 minutes; one more
   day), each stating what it adds. With construction first, most of those re-solves cost milliseconds.
7. **A canonical last tier.** Any solver-chosen value must be pinned by a final deterministic tie-break, so that refactoring
   the kernel (a different pivot rule) cannot change a published plan. The repository's determinism test only catches
   run-to-run differences, not version-to-version ones.

### From template-parametric

8. **Templates are the day grammar and the candidate slots.** Day types, pairing, spine days and block order come from the
   coach's templates; the planner switches candidate slots on and off and never invents a day. They are not a capacity plan
   (3.5, DR-5).
9. **Parametrize by the coach's own placement rules.** This is the idea that makes dosing cheap (3.6): the unknowns are a few
   whole numbers per group, and the slot vector follows from VOL-07 and R3-VOL-03.
10. **Golden tests from his material.** His worked examples and sheet sessions as fixtures for the time function and for
    group selection, kept as data so a coach can add one.
11. **Format-specific progressions.** Timed circuits climb in work seconds and the class model keeps its class lifts; give
    them their own small parametric rules instead of forcing them through the set stairway.
12. **Skeleton variants as reviewable data.** Where a days x minutes variant of a template is wanted, it is a data change the
    coach can approve, not a code path.

### From the measurements

13. **Never return empty.** The solver must start from a constructed plan or from the selection witness. In 3.1 two cells
    came back with no plan although a witness had just been found.
14. **A certified grid in CI.** The structural inputs of the dosing problem are finite (family, days, minutes, level, Focus,
    profile). A test runs the exact oracle offline with a large budget over that grid and asserts that the runtime planner
    keeps the same groups and stays within the stated gap on every cell. This turns the tail from a runtime risk into a
    build-time cost, and it would have caught both probe mistakes in 3.6. If some cells stay hard, their witnesses can be
    shipped as compiled model data and merely verified at run time.
15. **The performance budget in work units, on the whole grid.** For example: no cell returns unknown or empty; the 99th
    percentile stays under N evaluations and M oracle nodes. Five hand-picked cases are not a performance test.
16. **The stage link is tested, not assumed.** A property test that stage 1 never accepts a target stage 2 cannot place
    (3.4 shows what the shortcut costs).
17. **An independent scorer outside the engine** (`tools/` or `tests/`), sharing only the catalogue. The acceptance criteria
    are its numbers, not `validation.ok`.

---

## 7. Migration notes (current engine, read 21:45-22:10; `engine/` was being edited by another workflow)

**What helps.**

- `generate.mjs` already takes its stages by injection (`generateWith(deps, ...)`, `REQUIRED_DEPS`), and the volume stage
  returns one object: `weeks[].sets_by_slot`, `added_slots`, `supersets_on`, `est_minutes`, plus `warnings`, `offers`,
  `block_targets` and `time_check`. A new planner that returns the same shape can run beside the old one behind a model flag,
  and both can be scored on the benchmark.
- `select.mjs`, `dose.mjs`, `render.mjs`, `explain.mjs`, `intake.mjs` and `shape.mjs` do not need to change for the first
  slices. `timefit.mjs` is already the shared home of credits and set costs.
- The plan JSON (`plan/2`) can stay as it is. New facts (proven / best found, the conflict of a dropped group) fit in `why`
  and `time_check`.

**What hurts.**

- Time is cut in four places (`week.applyCuts`, `volume.timeCheck`, `volume.trimToTime`, the athletic reconcile in
  `generate.collectWeek`). The new planner needs the *uncut* template layout as its candidate slots, so `week.mjs` must stop
  cutting before the planner can own capacity. This is the real coupling, more than `volume.mjs` itself.
- Selection runs before volume, and laterality changes the time class (unilateral costs 1.5 x). Either the planner takes the
  picks as given (simplest, keeps the current order), or the time class becomes part of the candidate slot.
- Tests. 24 test files hold about 567 `test(` calls; 21 of the files read dosing outputs (about 320 lines), and the nine
  `review-*.test.mjs` files (332 tests) assert the behaviour of individual patches. Many of those assertions describe the old
  engine's exemptions and will fail by design. Each needs a decision: re-express it as a rule-id property, or retire it with
  the decision it tested.
- `volume.mjs` is 2,759 lines with one 2,149-line function. It should be replaced, not refactored; the adapter keeps its
  output shape alive while the rest of the engine is untouched.

**Order I would use.** (1) Catalogue, time function and independent scorer, with the old engine scored as the baseline.
(2) Flow stairway and placement function behind the flag, structure still from the old engine. (3) Group selection and peaks.
(4) Remove the cuts from `week.mjs` and the reconcile from `generate.mjs`; athletic minutes reserved before dosing.
(5) Delete the old volume engine and the retired tests. The benchmark must not regress at any step.

---

## 8. What a real design document would have to show to move a score

| Angle | Would go up if | Would go down if |
|---|---|---|
| two-stage | the link is proven per day and the oracle's unknown case has a defined output (up to 9) | stage 1 reasons on weekly capacity, or stage 2 is allowed to cut what stage 1 promised (down to 5: that is RC4 again) |
| template-parametric | the add / remove rules are replaced by an exact keep-order test on candidate slots, and a group may move to a day with room (up to 8; it is then the winner under another name) | it needs one skeleton per days x minutes x profile, or its rules are ordered lists of special cases (down to 5) |
| milp | it measures HiGHS on the 630-cell grid on a phone, shows a lazy-loaded worker that keeps `generate()` usable, and gets the three binding rules changed by the maintainers (up to 6-7); or it decomposes so far that no proof is on the path of every plan | it relies on the prototype kernel as it is for the whole block (down to 3) |

---

## 9. Reproduce

All scripts read `design/research/*.mjs` and `model/*.json` and write only into `design/judge3/`.

```sh
node design/research/kernel.test.mjs && node design/research/lp.test.mjs      # the research's cross-checks (pass)
node design/judge3/tail_sweep.mjs            # 3.1  -> tail_sweep.2000.jsonl   (DOSE_LIMIT, SEL_LIMIT, FAMS in env)
node design/judge3/tail_summary.mjs          # 3.1  -> tail_summary.out.txt
node design/judge3/anytime.mjs               # 3.2  -> anytime.out.txt         (BUDGETS in env)
NS=4,12 LIMIT=40 node design/judge3/monolith.mjs   # 3.3 -> monolith.out.txt
node design/judge3/link.mjs && node design/judge3/link_summary.mjs            # 3.4, 3.5 -> link.jsonl, link_summary.out.txt
FAMS=aesthetics,athletic DAYS=2,3,4 LIMIT=2000 node design/judge3/ladder_probe.mjs   # 3.6 -> ladder_probe.jsonl
node design/judge3/ladder_summary.mjs        # 3.6  -> ladder_summary.out.txt  (v1 files: the first, flawed probe)
```

Node counts, pivot counts, kept groups and tier values are deterministic and must reproduce exactly. CPU times will differ;
mine were taken on a machine that was also running the engine's test suite.

**Limits of this judgement.** No design document was read, because none exists. No phone was measured. HiGHS was not
measured (installing a package was not authorized). The prototype model is simpler than the real one. The probe in 3.6 is
evidence that a construction is cheap and usually optimal; it is not a finished algorithm, and it fails in 10 % of cells
without the oracle.
