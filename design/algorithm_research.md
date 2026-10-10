# Algorithm research: an exact, explainable planner for Blaze Camp dosing

Status: research input for the planner design panel (`workflows/planner_design.js`, phase "Diagnose"). Written 2026-10-09.
Scope: which optimization techniques fit the dosing problem (weekly sets per group, per day, per slot, per week; time; floors;
the stairway; athletic budgets; the R3-SES-02 infeasibility policy), how each would apply, whether it can run in a browser in
plain JS, and a concrete recommendation. Everything here was read from the repo (read-only) and the web; the prototypes and their
outputs live in `design/research/` (section 6 and Appendix A say how to rerun them).

---

## 0. Summary

**The recommendation:** an exact layered planner. Make each layer as strong as the structure allows: exact polynomial
algorithms where the problem has special structure, and one small mixed-integer program where it does not. Every layer is
deterministic and every decision carries a certificate.

| Layer | What it decides | Technique | Guarantee |
|---|---|---|---|
| A. Rules → model | one declarative constraint catalogue used by the solver **and** the validator | data, not code | generator and validator can never disagree |
| B. Structure (per exercise block) | which groups are trained directly (R3-SES-02 step 2), which slots and days, superset pairs | lexicographic goal programming over a **0-1 integer program** solved by an **exact feasibility oracle** (LP-based branch-and-bound) | a group is dropped only if no plan can train it together with every higher-priority group |
| B'. Offers (R3-SES-02 step 1) | "another day" / "the session length that fits" | the same oracle, binary search on the 5-min grid | the offered minutes are the exact minimum, not an estimate |
| C. Endpoint dosing (per block) | sets per slot in the block's first and last week | lexicographic MILP: (1) worst peak shortfall, (2) total shortfall (leximin recommended), (3) week 1 nearest the level start | proven optimal per tier, integer objectives, exact freezes |
| D. Stairway over weeks | which week each added whole set lands in, per group | **min-cost network flow** (totally unimodular → integral) | no flat week whenever arithmetic allows it, every line lands in its last week, 7 % / 10 % caps hard |
| E. Placement | which slot gets each added set | **house-monotone sequential apportionment** (VOL-07 inside the day, "the exposure that is behind" across days, R3-VOL-03) | no slot ever loses a set; by the **sandwich lemma** (7.3) every middle week fits its minutes and floors automatically |
| F. Athletic budget | contacts / throws / metres / COD / Olympic reps per week and station | exact small DP (change-making) + house-monotone rounding; minutes reserved before C | budget met within its tolerance each week and never dips inside a stage |
| G. Certify | every rule on every week | the catalogue of A re-evaluated; HiGHS (MIT, wasm) as a CI cross-check of B / C optima | "proven optimal" is checked, not assumed |

**Solver backend:** a dependency-free, deterministic pure-JS kernel for B and C. It is bounds propagation plus an LP-bounded
branch-and-bound (prototype about 310 lines). It sits behind a solver-agnostic model interface. HiGHS-js (MIT, 3.5 MB wasm) is
the reference certifier in CI and an optional drop-in backend (Web Worker) for future heavier rules. Not chosen: CP-SAT
(OR-Tools wasm needs cross-origin isolation for threads and is large), glpk.js (GPL-3.0), javascript-lp-solver (Unlicense,
slower), and YALPS on its own (MIT and small, but no presolve or cuts, it re-solves every node from scratch, and it depends on
`heap`).

**What the prototypes measured (pure JS, Node 22 / V8 and the macOS JavaScriptCore shell, same code, identical answers):**

| Evidence | Result |
|---|---|
| Stairway as min-cost flow vs the λ-bank rounding, L1 full body 12 wk | flat weeks in the weekly total **7 → 0**; max weekly rise 9.0 % → 7.7 %; every line still lands in week 12 |
| Same, 2,000 random plans (1-12 lines, 4-16 weeks) | 0 decreases, 0 steps over max(1, 7 %), 0 totals rising ≥ 10 %, every line lands in week N whenever the 10 % rule allows; **0 flat weeks whenever the arithmetic allows it**; mean 0.09 ms, max 4.3 ms |
| Full chain on real templates (E1-E5: L1 4×60, coach's 2×45 racket player, L2 Focus 4×75, L3 4×90, athlete 3×90) | every tier **proven optimal**; group selection 3-743 ms, dosing 1-356 ms, middle weeks ≤ 4 ms; **0** time, floor, VOL-07, twin-day, 7 % or 10 % violations in any of the 60 weeks |
| Coach's own R3-SES-02 example (2 × 45 min racket player) | exact oracle keeps **hips + the pinned calves**, the coach-approved answer (12 v1.2 §5.5); at 2 × 60 it adds quads and back; chest can never reach 10 on that 2-day template at any length (2 chest exercises on one day, max 5 + 4 = 9), so the offer is "add a day", not "longer sessions" |
| Propagation-only search (no LP bound) on the same models | fast on easy cases, but **fails to prove optimality** (E1, E4) or finds **no plan at all** (E5) within 2 million nodes. As a selection oracle it needs 22,180 nodes to show biceps fits the 4 × 60 plan (LP-based: 148). With a 1,000-20,000 node budget read as "infeasible", it drops biceps (and triceps at 1,000) from a plan that holds all eight groups, which is the same over-cutting the coach saw |
| Cross-engine determinism | V8 and JavaScriptCore give byte-identical selections, tier optima, totals and flow checksums |

**Rule conflicts the math exposes (for the coach, section 8):** (1) "every line reaches its ceiling exactly in the last
week" vs "the weekly total never goes flat". Once every final set must land in week N, the middle weeks are fed only by the
other added sets; with fewer than N − 2 of those, flat weeks are unavoidable. (2) In tiny plans (about 20 sets), "below +10 %"
allows one added set a week, so two lines cannot both land in the last week. (3) Template capacity: some groups cannot reach
10 sets on some templates at any session length.

---

## 1. The problem, stated formally

Notation (one exercise block b of n weeks; a 12-week plan has 2-3 blocks; the stairway runs through all blocks):

* slots `s` (an exercise position on a day, from the coach's day templates in `model/templates.json`), with day `d(s)`, prime
  group `g(s)`, time class (compound bilateral / unilateral, isolation, calf ...), minutes per set `τ_s` = work + dosed rest
  (`rules.time_model`: 2.25 / 3.0 / 1.85 min), changeover κ = 1 min (0.5 inside a superset pair; pair time × 0.65);
* group credit `a_{g,s}` ∈ {0, 0.25, 0.5, 1} (`rules.credit`, capped at 1 per set per group, R3-VOL-01);
* decisions: `x_{s,w}` ∈ {0} ∪ [min_s, max_s] sets of slot s in week w; `y_s` slot active; `t_{g,d}` group g trained on day d;
  `z_g` group trained directly; `u_p` superset pair p used.

| # | Constraint family (coach source) | Linear form |
|---|---|---|
| C1 | sets per exercise 2 ... 4/5, calves 3-4 (VOL-16, VOL-17, R3-SES-01) | `min_s·y_s ≤ x_{s,w} ≤ max_s·y_s` |
| C2 | 2-4 exercises per trained group per day, never 1; calves one exercise per leg day (R2-SES-05, R3-SES-01) | `2·t_{g,d} ≤ Σ_{s∈(g,d)} y_s ≤ 4·t_{g,d}` ; `t_{g,d} ≤ z_g ≤ Σ_d t_{g,d}` |
| C3 | floor 10 on trained groups, credited sets, main days (R2-VOL-06, R3-VOL-01) | `Σ_s a_{g,s} x_{s,1} ≥ 10·z_g` |
| C4 | ceilings 14 / 22 / 25, Focus +F, priority caps (R2-VOL-06, R3-SES-01) | `Σ_{g(s)=g} x_{s,N} ≤ C_g` |
| C5 | the stairway climbs, never flat (R3-SES-02 step 4) | `Σ_{g(s)=g} (x_{s,N} − x_{s,1}) ≥ δ_g·z_g` |
| C6 | fixed exercises inside a block, sets only climb (PER-02/03) | `x_{s,w} ≤ x_{s,w+1}` |
| C7 | the chosen minutes per day (R3-SES-02; long-day factor 1.10) | `F_d(w) + A_d(w) + Σ_s τ_s(w)·x_{s,w} + κ·Σ y_s − savings(u) ≤ 1.10·M_d` |
| C8 | per-session ceiling 11 (Focus 14) credited sets per group (12 v1.2 §3.5) | `Σ_{s on d} a_{g,s} x_{s,w} ≤ 11` |
| C9 | exercises per session by minutes (split days), field athletes 12 + 2 core (VOL-08, R2-SES-04) | `Σ_{s on d} y_s ≤ E(M_d)` |
| C10 | step caps: ≤ 7 % planned per group, total < +10 % (R2-VOL-01, UNI-05) | per-week differences, linear |
| C11 | heavy axial squat and deadlift on different days, ≤ 1 per pattern per week (R2-SES-01, ATH-11) | `Σ_d h^{sq}_d ≤ 1`, `h^{sq}_d + h^{dl}_d ≤ 1` |
| C12 | bilateral:unilateral share 90/10 … 10/90 (UNI-02) | `|Σ_bil x − σ·Σ_comp x| ≤ 0.03·Σ_comp x` (linear both ways) |
| C13 | VOL-07 order inside a day; R3-VOL-03 exposures stay even | `x_{s_i} ≥ x_{s_{i+1}} ≥ x_{s_i} − 1` ; `|x_s − x_{twin(s)}| ≤ 1` |
| C14 | pairing (hip + push, knee + pull), core first, power before strength, horizontal before vertical | sequence rules: a deterministic ordering pass after dosing (order does not change minutes except through superset pairs, which C7 models) |

Objectives are **preemptive tiers** in the coach's stated order (the exact tier list is the rules-inventory agent's
`rules_as_constraints.md`). The planner needs: keep groups by priority → every trained group as close to its ceiling as
the time allows (leximin) → week 1 at the level start → stairway shape (3 % / 5 %) → placement preferences → fewest
supersets needed → variety and canonical tie-break.

**How the layers map onto `design/rules_as_constraints.md`'s tiers** (T0 hard → T1 R3-SES-02 → T2 floors → T3 stairway →
T4 time overrun → T5 caps and ceiling attainment → T6 exercise counts → T7 pairing / order / placement → T8 balance / variety):

| Layer (section 7) | Tiers it settles |
|---|---|
| B structure + offers | T0 structural rows (2-4 per trained day, calves, 12 + 2, spine days), T1 (the keep vector, the "day holds" band × 1.10, offers) |
| C endpoint dosing | T2 floors (hard rows at the first week), T3's hard minimum climb, T5 (ceilings, then attainment), and T4 overrun only below T5 (the inventory's reading 6: nothing that rewards less volume sits above ceiling attainment) |
| D stairway flow | T3 shape (no flat week, last week hardest, 3 % / 5 %, the 7 % and 10 % limits) |
| E placement + ordering pass | T7 (VOL-07, R3-VOL-03, bonus placement) and the T0 sequence rules (core first, power before strength, horizontal before vertical, pairs) |
| F athletic | T3 athletic climb, T5 athletic caps and attainment |
| C lower tiers / selection | T6, T8 |

Solving T5 attainment in C before T3 shape in D does not break the order, because the planned curve T(w) is re-anchored on
the attained peak (12 v1.2 §3.7.1: "the line's ceiling becomes what they hold and λ is re-solved"). The T3 shape terms
therefore cost the same for any peak height. A higher peak only adds whole sets, which can only remove flat weeks, and the hard
7 % / 10 % rows sit in both layers.

**Sizes.** The brief's worst case is 12 weeks × 6 days × 15 groups × ~10 slots/day. A monolithic model has about 60 slots × 12
weeks = 720 integer set variables, plus about 60 + 90 + 15 binaries and the superset pairs: about 900 variables and 3,000-5,000
rows. The decomposition in section 7 cuts the hard part to about 120-210 integer variables and 300-800 rows per exercise block
(measured: 102-213 variables, 311-774 rows on E1-E5). The rest are polynomial problems with at most about 150 flow units.

---

## 2. Why the current dosing keeps failing (algorithmic root causes)

The diagnosis agent measures this in detail (`design/diagnosis.md`); here each recurring failure is mapped to the kind of
algorithm that causes it. References are to `engine/volume.mjs` as read on 2026-10-09 (the file is being edited, so line numbers
move; function names are stable).

| Recurring failure (REVIEW_LOG, RECHECK_v0.3) | Algorithmic cause | Fix class |
|---|---|---|
| Stairways flat on main days; totals hold for weeks (swimming 52 → 58 with 5 flat steps; pickleball 7 flat weeks) | each line's λ-curve is rounded **independently** ("bank: add a whole set when the target passes it", `stairwayFrom` + VOL-06 banking). Lines with the same start and ceiling cross their integer thresholds in the **same** week, giving spikes and flat runs (prototype S1: 92 92 92 92 92 100 100 109 109 109 117 126). The in-progress fix (E-146 `buildSchedule`, "scheduled release rounding") moves steps around with greedy passes | joint integer scheduling: **min-cost flow** (6.2) gives the provably best schedule for the same rules in milliseconds |
| Trained groups below the floor; floors excused by warnings | floors, time and exercise counts live in **different passes** (`fit`, `structureCut`, `reduceGroups`, `trimToTime`, `nextRoomCut`); the **40-attempt retry loop** in `planWeeklySets` (`capCut` / `drop`) repairs one symptom at a time | one model holding C1-C13 at once; floors are hard rows, not post-hoc checks |
| Days over the chosen minutes | the time check probes the week-1 fit and a peak estimate (`probe`, `peakNeed`, `timeCheck`); sets added later by banking are not re-proven against every week | solve the **peak week exactly** and use the **sandwich lemma** (7.3): every middle week is then within the minutes, with no checking needed |
| Too many exercises per day | exercise caps are enforced by cutting after volume is placed | C2 / C9 rows in the same model |
| Time check over-cuts (a pickleball client left with only hinges) | the R3-SES-02 step-2 keep order uses a **heuristic** oracle. A wrong "does not fit" drops a group that does fit. The prototype reproduced this: a propagation-only oracle with a 1,000-20,000 node budget read as "infeasible" drops biceps (and triceps) from a 4 × 60 plan that provably holds all 8 groups (6.4) | an **exact** oracle; budget exhaustion is never read as "infeasible" |
| Athletic work below its budget and not climbing (soccer COD 96 vs 120-160 every week) | fixed station sets and per-station rounding; the time check cuts athletic stations after the fact; tests asserted 60 % while titled 75 % | weekly targets realized by an exact DP, house-monotone rounding, minutes reserved before dosing (7.6) |
| Patch on patch (E-01 … E-146; 77 lines of `volume.mjs` cite an E-decision) | greedy stages with no global view, each fix adding a special case | a declarative model: a new coach rule is a new row or tier term with its id, not a new pass |

---

## 3. Survey of techniques and how each applies

### 3.1 Integer linear programming / mixed-integer programming (ILP / MILP)

*What:* linear constraints, some integer variables, solved by LP-based branch-and-bound / branch-and-cut (Land & Doig 1960,
the basis of every modern MIP solver). HiGHS is the strongest open-source MIP solver alongside SCIP in Mittelmann's
benchmarks [8, 9]. *Fit:* every rule in section 1 is linear once the structure binaries are in. Sets are integers, credits are
0.25-multiples (scale by 4) and minutes are scaled to integers, so the whole model has integer coefficients. *Caveat:* MILP is
NP-hard (it contains knapsack), but our instances are tiny. The real risks are a weak LP relaxation (big-M links between
`y`/`t` and `x`) and symmetry (identical twin days). Both are handled by decomposition (3.11) and symmetry-breaking rows
(C13). *Verdict:* **the core formalism.** Use it for the coupled packing (structure + endpoint sets), not for everything.

### 3.2 Lexicographic (preemptive) goal programming, and leximin

*What:* goals in strict priority levels. Minimize the deviations of level 1, freeze that optimum, then level 2, and so on.
Charnes & Cooper's goal programming; Ignizio showed that a lexicographic goal programme is a sequence of linear programmes
[10]. Commercial solvers expose the same as "hierarchical objectives" with optional degradation tolerances [11]. *Fit:* this is
exactly how the coach states his rules (R3-SES-02 is an ordered list). Two details matter:
1. **Integer objectives make the freeze exact.** Shortfalls are counted in whole sets and quarter-credits are scaled ×4, so
   "freeze tier k at its optimum v" is the integer row `obj_k ≤ v`. No tolerance is needed, and a lower tier can never quietly
   degrade a higher one (the usual weakness of weighted sums and floating tolerances).
2. **Fairness among groups is leximin, not a sum.** "Every trained group reaches its ceiling" with too little time means
   making the worst shortfall as small as possible, then the second worst, and so on: lexicographic max-min [12, 13]. A plain
   sum can starve one group (the prototype's first, structure-free model gave shoulders 22 while back and chest stayed at 12).
   The standard exact procedure is a sequence of min-max solves, each fixing the groups that cannot do better ("saturation")
   [12, 13]. That costs at most one extra solve per group. The prototype used min-max then sum, which is already much better
   than a sum; full leximin is the recommended refinement.

*Weighted sums* (big-M weights between tiers) are a valid shortcut only when the weights provably dominate. Within one tier,
weights are fine (e.g. stairway shape vs timing in 6.2). *Verdict:* **use it for every objective**; tiers come from
`rules_as_constraints.md`.

### 3.3 Constraint programming / CP-SAT

*What:* domains plus propagators plus search. CP-SAT (OR-Tools) adds SAT clause learning and LP relaxations and is the
state of the art for rostering-style problems with many logical side constraints and soft preferences. The OR-Tools
employee-scheduling example is structurally the closest public analogue: coverage floors, fairness, hard and soft rules
[14, 15]. *Fit:* our logical rules (axial days, pairing, "never 1 exercise", twin evenness) are natural in CP. Our objectives
(fill time knapsacks toward ceilings) are LP-shaped. *Evidence:* a pure propagation + DFS kernel (no LP bound, no learning)
was fast where the answer is easy. It failed exactly where knapsack-style time rows interact with covering floors: it proved
nothing in 2 million nodes on E1, E4 and E5 (6.4). That is the textbook reason CP-SAT and MIP solvers carry LP relaxations.
*Browser:* `or-tools-wasm` (Apache-2.0) exposes CP-SAT, but its threaded build needs COOP/COEP cross-origin isolation; a single
worker (`numWorkers: 1`) is possible and the bundle is large [16]. *Verdict:* **borrow the ideas** (propagation before every LP,
symmetry breaking, explanation via conflicts); do not ship CP-SAT.

### 3.4 Knapsack and bin packing with time capacities

*What:* each day is a knapsack. Capacity = chosen minutes × 1.10 minus warm-up, core and athletic minutes; items = sets with
weights τ_s plus changeovers. Assigning exercises to days is a multiple-knapsack / bin-packing problem with assignment
restrictions (Martello & Toth [17]). Greedy rules such as first-fit-decreasing are only approximations (FFD ≤ 11/9·OPT + 6/9,
tight [18]). *Fit:* this is **why the current greedy cuts go wrong**. A greedy packer cannot tell "does not fit" from "did not
find the fit" (the pickleball over-cut). The coach's templates fix which groups appear on which day, so the packing that
remains (how many exercises and sets per group-day under the minutes) is small and exactly solvable inside the MILP.
*Verdict:* **model it exactly** as C1/C2/C7 rows; never decide feasibility greedily.

### 3.5 Network flow

*What:* min-cost flow has integral optimal solutions whenever capacities are integral, because the node-arc incidence matrix
is totally unimodular (Hoffman-Kruskal) [19]. Successive shortest paths solve it exactly with integer arithmetic only.
Controlled rounding (Cox & Ernst 1982) uses the same fact to round a 2-D table so that row and column totals are kept [20].
*Fit:* two places.
1. **The stairway (6.2, 7.4):** units = the whole sets each group must add between week 1 and the peak; arcs to the weeks;
   capacities = the 7 % per-group and the < 10 % total rules; costs = distance from the coach's 3 % / 5 % λ-curve, a bonus for
   no flat week, and a large cost for a line that does not land in week N. This is a group × week controlled-rounding problem
   with monotone rows, and it is exact.
2. **Apportioning a group's weekly sets across its days** would be a transportation problem if all set-times were equal. With
   unequal τ it is a generalized flow (not TU), so it stays in the MILP. Inside one week, the sequential rule of 3.8 is
   exact anyway.

*Verdict:* **use it for the stairway** (it replaces the λ-bank rounding and the E-146 move passes).

### 3.6 Dynamic programming over weeks with monotonicity

*What:* for one group alone, the best integer path from S to P in N weeks with step ≤ max(1, 7 %) and minimum Σ|x_w − T_w| is
a shortest path in a layered graph (states: week × sets), O(N·R²), with R ≤ 30. DP is also the natural exact tool for small
one-dimensional choices: block lengths 4/5/6 that cover 12 weeks, sets × reps on athletic stations to hit a contact target
(change-making), and Receive-Create stage boundaries. *Fit:* the per-group DP is the special case of 3.5 without coupling.
"The weekly total never flat" couples the groups, so the flow is the right generalization. *Verdict:* **use DP for the
one-dimensional subproblems** (block partition, athletic realization), the flow for the stairway.

### 3.7 Isotonic regression

*What:* projection of a sequence onto monotone sequences. Pool-adjacent-violators (PAVA) is O(n) for L2 [21, 22]. For L1 an
optimal solution can always use data values [23], so integer data gives integer answers. Projection onto "monotone and
≤ cap_w" is the same as clipping to the suffix minimum min_{v≥w} cap_v and then PAVA. *Fit:* whenever a capacity limit varies
by week (a later block with more unilateral work costs more minutes, a test week, a taper), the reachable targets
`min(T_w, cap_w)` can go down and up again. Monotone feasibility requires `T_w ≤ min_{v≥w} cap_v`, so **plan backwards from
the binding week**. Clipping each week to its own cap, which is what week-by-week greedy code does, creates the flat-then-jump
artifacts. *Verdict:* **use it as the pre-processing** of per-week upper envelopes before the flow (7.4). It is also the right
smoother for any monotone athletic target inside a stage.

### 3.8 Apportionment: largest remainder (Hamilton) vs divisor and quota methods

*What:* rounding proportional shares to integers. Hamilton (largest remainder) satisfies quota but is **not house-monotone**:
when the total grows by one, a party can lose a seat (the Alabama paradox). All divisor methods (Jefferson / D'Hondt, Webster /
Sainte-Laguë, Huntington-Hill) are house-monotone. The Balinski-Young quota method is both house-monotone and quota-satisfying
[24, 25, 26]. The impossibility theorem rules out quota together with *population* monotonicity, not house monotonicity [24].
*Fit:* this is the decisive property for a stairway. When a group's weekly total climbs from 14 to 15, **no slot may lose a
set**, so every allocation that is recomputed as a total grows must be house-monotone:
* group sets → days: "the next set goes to the exposure that is behind, ties rotate" (R3-VOL-03) is a sequential divisor-type
  rule;
* day sets → exercises: VOL-07 "first exercise below the first one's sets, else the first" (2/2/2 → 3/2/2 → 3/3/2 → 3/3/3 →
  4/3/3) is sequential, hence house-monotone;
* athletic contacts → stations and the bilateral:unilateral split of a growing total: Webster (least biased), or the quota
  method when quota is also needed.

Largest remainder stays acceptable only for **one-shot** splits that are never recomputed with a bigger total. *Verdict:*
**ban largest-remainder for anything that changes week to week**; use sequential divisor rules (the prototype's placement had
0 slot decreases in 60 weeks).

### 3.9 Local search, simulated annealing, late-acceptance hill climbing

*What:* improve a complete solution by moves accepted under a temperature (SA [27]) or a history list (LAHC, one parameter,
Burke & Bykov [28]). Timefold / OptaPlanner (school timetabling, rostering) pairs a construction heuristic with local search
[29]. *Fit:* good for very large or very soft problems. Ours is small and its rules are hard, and local search proves
nothing: it cannot certify "no plan trains chest at 10 sets on this template", which is the sentence the coach's policy
needs. With a seeded PRNG (derived from the intake hash) it is deterministic. *Verdict:* **fallback only.** Polish
low tiers (cosmetic tie-breaks, variety) from the exact incumbent when the node budget runs out, and never touch hard rows
(every move is re-checked against the catalogue).

### 3.10 Exact small-scale branch-and-bound

*What:* Land & Doig's B&B with LP bounds [30]: propagate bounds, solve the LP relaxation, prune by infeasibility or bound,
branch on a fractional variable. *Evidence (6.4):* a 310-line pure-JS kernel (bounds propagation + bounded dual simplex +
depth-first B&B with a priority order + exact integer freezes) solves the decomposed models to proven optimality in 1-356 ms
per tier set. It matches brute force on 1,500 random lexicographic integer programs and 3,000 random LPs. *Verdict:* **this is
the engine core**, hardened (section 7.7).

### 3.11 Decomposition (logic-based Benders) and symmetry

*What:* logic-based Benders decomposition splits a problem into a master (here: structure, which groups and days) and
subproblems (here: sets per block). Infeasible subproblems return "no-good" cuts to the master [31]. Symmetric ILPs (identical
twin days) are slow because branch-and-bound explores equivalent solutions; ordering constraints break the symmetry [32, 33].
*Evidence:* fixing the structure first cut the dosing solve on E1 from about 9.6 s (budget exhausted on one tier) to **0.33 s,
proven optimal on all tiers**. The VOL-07 order rows and the twin-day evenness rows are both coach rules **and** symmetry
breakers. *Verdict:* **decompose** structure → endpoint dosing → stairway → placement. The cut-back loop is needed only when a
middle block cannot realize the global stairway (7.4).

### 3.12 Explaining infeasibility and trade-offs

*What:* an irreducible infeasible subsystem (IIS) is a minimal set of rows that is jointly infeasible. Deletion and elastic
filters find one (Chinneck) [34, 35]; HiGHS currently computes IIS for LPs only [36]. In constraint-based recommenders,
QuickXplain finds *preferred* minimal conflicts given a priority order over constraints [37], and FastDiag finds preferred
minimal *diagnoses*, i.e. which user requirements to relax [38]. *Fit:* R3-SES-02 needs exactly these two sentences:
* "why was triceps not trained directly?" → a minimal conflict among {the kept groups' minimums, Monday's minutes, ...};
* "what would make it fit?" → a minimal diagnosis among the user's choices {days, minutes, athletic block on, core block on,
  Focus}, e.g. "65 min" or "add a day".

*Verdict:* **use QuickXplain over the catalogue rows** for drop explanations (oracle calls are cheap), and **exact offers by
binary search** for the "what would fit" side.

---

## 4. Published work on training-plan generation and sports scheduling

| Work | What it optimizes | Method | Relevance |
|---|---|---|---|
| Tatarenko 2025, *Modelling and Data Analysis* 15(4) [1] | exercise selection and intensity for handball sessions, learned from expert plans plus a fatigue model | MILP (PuLP + CBC), 32 binaries, < 0.5 s per plan | closest published MILP use. It confirms MILP speed at this scale; it has no set-volume stairway, floors or time packing |
| Kumyaito, Yupapin, Tamee 2018, *BMC Research Notes* [2] | a cycling plan under monotony, chronic-load ramp-rate and daily-load constraints | adaptive particle swarm + ε-constraint | treats a ramp-rate cap as a constraint (our 7 % / 10 %); a metaheuristic, no optimality proof |
| Fister et al. 2015, bat algorithm; "Artificial Sport Trainer" [3, 4] | session plans from sports-watch archives | swarm intelligence | shows the field's reliance on metaheuristics; not rule-exact |
| Fitness-fatigue (Banister / Busso) optimal control, arXiv 2505.20859 [5] | load over time to peak at competition | optimal control (forward-backward sweep) | load, not sets; the authors note gaps between optimized loads and taper / periodization practice |
| Kendall, Knust, Ribeiro, Urrutia 2010, "Scheduling in sports: an annotated bibliography" [6] | tournaments, referees, travel | IP, CP, hybrids, decomposition, local search | in sports scheduling, exact IP/CP with decomposition dominates when constraints are hard |
| US 11,621,067 B1 [7]; PlanFitting (LLM, arXiv 2309.12555) [39] | personalized RT programs | rule / ranking based; LLM dialogue | no optimization guarantees |
| Nurse / employee rostering (OR-Tools CP-SAT examples [14], CP-SAT primer [15]) | coverage floors + fairness + hard / soft rules | CP-SAT / MIP | structurally the closest mature analogue |

No published system optimizes **per-muscle-group weekly hard sets with floors, ceilings, a monotone integer stairway,
session-time packing and a priority infeasibility policy**. The method has to be assembled from the OR building blocks above,
and section 7 does that.

---

## 5. JS / browser feasibility

### 5.1 Solver options

| Option | License | Size (shipped) | Determinism | Speed at our sizes | Notes |
|---|---|---|---|---|---|
| **Own kernel** (prototype `kernel.mjs` + `lp.mjs` + `milp.mjs`, about 310 lines) | ours (repo MIT) | about 18 kB unminified, with comments | bit-identical across engines (only IEEE + − × ÷, `Math.floor/ceil/round/abs/min/max`; fixed pivot and branching rules; node budget, no clock) | **measured**: selection 3-743 ms, dosing 1-356 ms per plan (V8); JavaScriptCore 10-20 % faster | synchronous, no build step, fits the engine's "plain ES modules, no deps" rule; needs hardening (7.7) |
| **HiGHS via `highs` (highs-js) 1.15.3** [40, 41] | MIT (wrapper and HiGHS) | `highs.wasm` 3,531,385 B + `highs.mjs` 168 kB (jsDelivr listing [42]) | deterministic single-threaded (the wasm build is single-threaded; parallel branch-and-cut is non-deterministic in native builds [43]); use node / iteration limits, never `time_limit` | **not measured here** (installing packages was not authorized in this run); typical HiGHS MIP times for a few hundred variables are milliseconds | async init (`await` the module), manual `dispose()`; LP-format text or a structured model API; IIS for LP only [36] |
| YALPS 0.6.4 [44] | MIT | about 15 kB (+ `heap` dependency) | deterministic unless its `timeout` option is set (it reads `Date.now()`); best-first B&B (source read) | README: a few hundred integer variables at most; dense tableau; no presolve or cutting planes despite the "branchAndCut" name; re-solves every node from the root tableau | an acceptable stopgap, weaker than the decomposed own kernel |
| javascript-lp-solver 1.0.3 [45] | **Unlicense** | 2.4 MB unpacked | – | YALPS reports 3-10 × faster | outside the stated MIT / Apache policy (public-domain-like) |
| glpk.js 5.0.0 | **GPL-3.0** | 2.6 MB | – | – | license incompatible with the MIT repo |
| or-tools-wasm (CP-SAT, GLOP, CBC, SCIP ...) [16] | Apache-2.0 | large (not stated) | single worker deterministic | – | threads need COOP / COEP headers; heavy for a phone page |
| SCIP | Apache-2.0 since 8.0.3 [46] | no maintained browser build found | – | – | native only in practice |

### 5.2 Determinism rules for any choice

* **JS arithmetic:** `+ − × ÷` are IEEE-754 double with round-to-nearest, with no FMA contraction, so the same operation order
  gives the same bits on every engine. `Math.pow / exp / log / sin` are *implementation-approximated* in the ECMAScript spec and
  differ between browsers [47], so keep them out of every decision path. (The current engine already solves λ by bisection with
  multiplication only; keep it that way.)
* **Wasm:** deterministic except NaN payload bits and resource exhaustion [48]. Pin the exact HiGHS build.
* **Budgets:** never stop on wall-clock time (`Date.now`, `time_limit`). Stop on node / iteration counts, so a slow phone gets
  the same plan as a fast laptop.
* **Ties:** every choice among equals is broken by a stable key (priority order, then id), never by object-key or `Map`
  insertion accidents.
* **Verified:** the prototypes give byte-identical results run-to-run and between V8 and JavaScriptCore (6.5).

### 5.3 Threading and loading

The engine's `generate()` is synchronous today. The own kernel keeps it synchronous; at about 1 s worst case it should still run
in a Web Worker so the page stays responsive. HiGHS forces `async` (module instantiation), which is a contract change. CP-SAT
with threads forces cross-origin isolation for the whole site.

---

## 6. Prototype evidence (all pure JS, `design/research/`)

### 6.1 What was built

| File | What it is |
|---|---|
| `mcf.mjs` | deterministic min-cost flow (successive shortest paths, SPFA, integer only) |
| `proto_stairway_flow.mjs` | the stairway as min-cost flow vs the current λ-bank rounding, 6 scenarios |
| `proto_stairway_stress.mjs` | 2,000 random plans, invariant checks |
| `kernel.mjs` | integer model, bounds propagation, DFS B&B, lexicographic tiers |
| `lp.mjs` | bounded dual simplex (row equilibration, relative pivot tolerance, two-pass Harris ratio test, Bland fallback) |
| `milp.mjs` | LP-based branch-and-bound + lexicographic tiers |
| `kernel.test.mjs`, `lp.test.mjs` | brute-force cross-checks (400 + 1,500 random lexicographic IPs, 3,000 random LPs: **0 mismatches**) |
| `proto_endpoint.mjs` | the whole chain on `model/templates.json` + `model/rules.json`: selection → endpoint dosing → flow → placement → week-by-week checks → exact offers |
| `bench_runtime.mjs`, `env.mjs` | same-code timing in Node (V8) and the macOS JavaScriptCore shell |
| `*.out.txt` | the outputs quoted below |

Prototype simplifications (stated in its output): hips is dosed as one group line; optional days, FOCUS slots, conditioning and
tests are left out; athletic minutes are template sets × a peak factor; calves floor = min(10, 3 × leg days) on main days. The
time model is the repo's v1.3 one (work + dosed rest), so its minutes differ from the 12 v1.2 worked examples (2.5 / 3.75 / 1.75
min per set). **The method is what is being tested here, not the exact numbers.**

### 6.2 Stairway: min-cost flow vs λ-bank rounding (`proto_stairway_flow.out.txt`)

| Scenario | Bank totals (current method) | Flow totals | Flat weeks bank → flow | Max weekly rise bank → flow |
|---|---|---|---|---|
| S1 L1 full body 12 wk (8 lines 10 → 14, calves 12 → 14) | 92 92 92 92 92 100 100 109 109 109 117 126 | 92 93 94 96 98 100 104 108 109 113 117 126 | **7 → 0** | 9.0 % → 7.7 % |
| S2 L2 12 wk (big 15 → 22; small 12 → 22 cap) | 123 123 123 132 132 137 141 150 159 164 173 182 | 123 125 129 132 136 140 146 153 160 168 173 182 | 3 → 0 | 7.3 % → 5.2 % |
| S3 L3 12 wk | 160 160 160 164 169 173 182 186 195 199 208 217 | 160 161 165 168 172 175 181 188 195 202 208 217 | 2 → 0 | 5.2 % → 4.3 % |
| S4 L2 8-week block | 123 123 123 132 137 146 150 155 (only 5/9 lines step in week 8) | 123 125 128 132 139 145 146 155 (9/9) | 2 → 0 | 7.3 % → 6.2 % |
| S5 L2 Focus glutes +2 | 125 125 125 134 134 139 143 152 161 166 175 184 | 125 127 131 134 138 142 148 155 162 170 175 184 | 3 → 0 | 7.2 % → 5.1 % |
| S6 the coach's 2 × 45 keep-time plan (hips 10 → 14, calves 6 → 7) | 16 16 16 16 16 17 17 18 18 18 19 **21** | 16 16 16 16 17 17 17 18 18 19 20 21 | 7 → 6 (5 sets over 11 steps: ≥ 6 flats are unavoidable) | **10.5 %** (breaks the coach's 10 % rule) → 6.3 % |

The coach's approved example line (L2 big 15 → 22: "the last four weeks 19, 20, 21, 22") keeps its shape in the flow (S2 quads:
15 15 16 16 16 17 18 19 20 20 21 22). The flow staggers the lines so that the *total* climbs every week. The bank gives every
identical line the same flat weeks.

Stress (`proto_stairway_stress.out.txt`), 2,000 random plans: 0 decreases; 0 group steps over max(1, ⌊7 %⌋); 0 weekly
totals rising ≥ 10 %; every climbing line lands in week N in 2000/2000 plans where the 10 % rule allows it; **0/1,216 plans with
a flat week whenever at least N − 2 non-final sets exist**; mean 0.09 ms, max 4.3 ms. The 133 plans that still have a flat week
are all cases where the landing rule plus integrality force it (section 8).

### 6.3 Snapshot of the current engine's sample totals (in-progress engine, `samples/plans/*.json`, 21:15 on 2026-10-09)

| Sample | Weekly total resistance sets | Flat steps | Max rise |
|---|---|---|---|
| 01 swimming | 31 31 31 32 32 33 33 34 34 35 36 37 | 5 | 3.2 % |
| 04 CrossFit-style class | 25 25 25 26 26 27 28 29 | 3 | 4.0 % |
| 06 full-body aesthetics | 116 123 125 127 132 136 139 144 151 156 161 166 | 0 | 6.0 % |
| 08 pickleball | 19 19 19 20 20 20 20 20 20 21 22 23 | 7 | 5.3 % |

(05 bootcamp is a timed circuit, flat by design; 03 soccer drops by design into its pre-season block.) The in-progress E-146
"scheduled release rounding" improves some samples, but it is a greedy local-move version of 6.2's flow.

### 6.4 The full chain on real templates (`proto_endpoint.out.txt`, LP-based kernel)

| Case | Model | Group selection (exact oracle) | Dosing tiers T1 / T2 / T3 (all proven optimal) | Weekly direct sets, week 1 → 12 | Minutes week 1 → 12 (limit) | Exact offer |
|---|---|---|---|---|---|---|
| E1 L1 aesthetics 4 × 60 (the coach's 12 v1.2 §5.1 client) | 209 vars, 752 rows | all 8 groups kept, 743 ms | 1 / 2 / 4 in 356 ms | quads 12 → 14, hips 12 → 14, back 10 → 14, chest 10 → 14, shoulders 10 → 13, biceps 10 → 13, triceps 10 → 14, calves 12 → 14 | Mon 58 → 66, Tue 58 → 66, Thu 56 → 65, Fri 52 → 65 (66); supersets needed all 4 days | every group reaches its ceiling at **65 min** |
| E2 L2 racket player 55 y, 2 × 45 (the coach's §5.5 example) | 102, 311 | **calves (pinned) + hips**; quads, back, chest, shoulders not trained directly, 4 ms | 14 / 20 / 1 in 1 ms | hips 14 → 16, calves 6 → 8 | Mon 46 → 48, Thu 43 → 49 (50) | at 2 × 60: + quads, back; **chest / shoulders: no length fits** (template capacity) → "add a day" |
| E3 L2 4 × 75, Focus hips | 209, 752 | all 8, 118 ms | 6 / 24 / 4 in 83 ms | quads 15 → 22, hips 17 → 24, back 15 → 20, chest 15 → 18, shoulders 16 → 22, arms and calves 12 → 16 | 60-82 (83) | all trained from 75 min |
| E4 L3 4 × 90 | 213, 774 | all 8, 111 ms | 9 / 43 / 7 in 80 ms | quads 20 → 22, hips 20 → 22, back 20 → 22, chest 16 → 18, shoulders 16 → 24, … | 67-86 (99) | – |
| E5 L2 athlete 3 × 90, athletic minutes +30 % by the peak | 146, 450 | 6 groups kept, 50 ms | 13 / 36 / 5 in 131 ms | hips 15 → 22, quads 15 → 18, chest 15 → 18, back 15 → 17, shoulders 7 → 9 direct (credited 11 → 13.75), calves 9 → 12 | 69-99 (99) | – |

Checks on every one of the 60 weeks: **0** time violations, **0** floor violations, **0** slot decreases, **0** VOL-07 shape
breaks, **0** uneven twin days, **0** group steps over 7 %, **0** weekly totals rising ≥ 10 %. Flat weekly totals: 0 everywhere
except E2, where 4 added sets over 11 steps make flats unavoidable.

**Propagation-only vs LP-based kernel on identical models** (`proto_endpoint.cp.out.txt`):

| Case | Propagation-only DFS (2 M node budget) | LP-based B&B |
|---|---|---|
| E1 dosing | T1 = 2, T2 = 3 **unproven**, 11.6 s | T1 = 1, T2 = 2, T3 = 4 proven, 0.36 s |
| E2 | proven, 1 ms | proven, 1 ms |
| E3 | proven, 4 ms | proven, 83 ms |
| E4 | T3 = 11 **unproven**, 9.6 s | T3 = 7 proven, 80 ms |
| E5 | **no plan found** in 2 M nodes | proven, 131 ms |

Lessons recorded during the build (each is a design rule in section 7):
1. **Budget ≠ infeasible.** Read as "does not fit", an exhausted search drops groups that fit. On the corrected E1 model the
   propagation-only oracle drops biceps at 5,000 or 20,000 nodes, and triceps and biceps at 1,000; the LP-based oracle proves
   all 8 fit in ≤ 194 nodes per call. (The very first run also had a model bug, a variable index 0 tested for truthiness, which
   made it drop hips, quads and back; never test an index for truthiness.) The oracle must return
   `feasible | infeasible | unknown`, and `unknown` must never drop a group.
2. **LP bounds are required** for time-knapsack + floor-covering models; propagation alone has heavy tails.
3. **Fix the structure, then dose.** Fixing the structure cut the dosing time about 30× and turned unproven tiers into proven
   ones.
4. **Numerics matter even at this size.** Rows mixing coefficients 1 … 6,000 made a naive dual simplex cycle or report a false
   "infeasible". Row equilibration, a relative pivot tolerance, a Harris two-pass ratio test and a Bland fallback fixed it, and
   each incumbent is re-checked exactly in integers.
5. **"The exposure that is behind gets the set"** is the correct reading of R3-VOL-03. Plain rotation broke twin-day evenness in
   22 week-slots of E1, and this rule fixed all of them.

### 6.5 Cross-engine timing (`bench_runtime.out.txt`, best of 3)

| Case | V8 (Node 22): select / dose / weeks | JavaScriptCore (Safari's engine): select / dose / weeks | Same answer |
|---|---|---|---|
| E1 | 632 / 319 / 1 ms | 489 / 265 / 1 ms | yes |
| E2 | 3 / 1 / 0 | 3 / 1 / 0 | yes |
| E3 | 116 / 82 / 1 | 99 / 66 / 1 | yes |
| E4 | 111 / 80 / 1 | 92 / 64 / 0 | yes |
| E5 | 49 / 130 / 0 | 41 / 111 / 0 | yes |
| 500 random stairways | 35 ms | 45 ms | identical checksum |

Offers (R3-SES-02 step 1) used a linear scan over the 5-min grid (0.2-2.4 s). Feasibility is monotone in minutes, so a binary
search needs about 4-5 oracle calls instead.

---

## 7. Recommendation: the exact layered planner

### 7.1 Architecture and data flow

```
intake ──► derive (level, starts S_g, ceilings C_g, Focus, pinned groups, family, template)        [kept: intake.mjs, shape.mjs]
        ──► A. compile rules → catalogue: rows {id, coach ref, tier, scope, linear form}             [new: model/constraints from rules.json]
        ──► F. athletic plan per week (targets → exact realization → minutes A_d(w))                [replaces budget/athletic dosing]
        ──► block partition (DP over 4-6-week blocks; Receive-Create stage per block)
        ──► B. structure per block: lexicographic keep-groups with the exact oracle; witness = days, slots, superset pairs
             └─ B'. offers: exact minimum minutes (binary search) / next template; QuickXplain reasons
        ──► C. endpoint dosing per block: lexicographic MILP on x(first week), x(last week) (+ any non-monotone week)
        ──► D. stairway: isotonic upper envelope → min-cost flow on unit increments (all weeks, all blocks)
        ──► E. placement: house-monotone sequential rules → x(w) for every week (sandwiched)
        ──► ordering pass (core first, power before strength, horizontal before vertical, pairs) → dose text (reps, RIR) [kept: dose.mjs, render.mjs]
        ──► G. certify: evaluate every catalogue row on every week; attach why-records                [validate.mjs reads the same catalogue]
```

### 7.2 Layer B: structure and R3-SES-02 as lexicographic goal programming

* Order the groups by the coach's keep order (`rules.session.time_fit`: Focus and sport-pinned first, then hips, quads, back,
  chest, shoulders, calves, triceps, biceps).
* For each group g in that order, ask the oracle: *is there a plan satisfying C1-C13 in which every group kept so far and g are
  trained directly, with the others free?* Keep g if yes; otherwise mark it "not trained directly (time)" with its compound
  credit. This is exactly preemptive goal programming on the binary goals z_g, so the result is the lexicographically best
  kept set by construction. (Feasibility need not be downward-closed: helper credit from a dropped group can matter. "Others
  free" handles that correctly.)
* Oracle: the decomposed MILP with branching priority z → t → pairs → sets. Feasibility search tries "undecided group off"
  and "minimum sets" first. Results are `feasible` (with a witness), `infeasible` (proven), or `unknown` (budget). On
  `unknown`: raise the budget → switch to the HiGHS backend if loaded → otherwise **keep the group** and flag the plan "not
  proven". Never drop on `unknown`.
* Pattern coverage (the E-94 "a row and a press" complaint): a lower tier may add 1-exercise maintenance stations for
  groups not trained directly, only in minutes left after every higher tier. That makes the coach's trade explicit instead of
  hard-coded.
* Offers (step 1): `min M on the 5-min grid s.t. oracle(all groups, M) = feasible`, by binary search. The same for "every group
  reaches its ceiling" (C-tier T1 = 0). The next template up is tested with the same oracle. If no length works, the reason
  comes from QuickXplain over the catalogue rows of the blocking group, e.g. "chest has 2 exercises on one day here: at most 9
  sets a week".

### 7.3 Layer C: endpoint dosing and the sandwich lemma

With the structure fixed, solve one lexicographic MILP per exercise block over x(first week) and x(last week): C1, C3-C13 with
y, t and u fixed. Every eligible superset pair is allowed (supersets only save time); "supersets needed on day d" is read off
the final sets. Tiers, integer-valued:
1. leximin of peak shortfalls `C_g − Σ_prime x_{s,last}` (the prototype's min-max + sum is the first two steps of it);
2. `Σ_g |direct week-1 − S_g|` (start at the level start; this avoids "quads 18 = cap in week 1, +2 sets in 12 weeks", E-83);
3. placement and shape preferences, then the fewest days needing supersets, then a canonical tie-break.

**Sandwich lemma.** Fix a block with weeks 1..n, the active slot set, and endpoint vectors x¹ ≤ xⁿ (componentwise) that both
satisfy every constraint of their week. Suppose the week-dependent data are nondecreasing in w: fixed minutes F_d(w),
athletic minutes A_d(w), per-set minutes τ_s(w). Then every x^w with x¹ ≤ x^w ≤ xⁿ satisfies, in week w:
* the minutes: `F_d(w) + A_d(w) + Σ τ_s(w)·x^w_s + κ·|active| ≤ F_d(n) + A_d(n) + Σ τ_s(n)·xⁿ_s + κ·|active| ≤ cap_d`, because all
  terms are nonnegative and nondecreasing and the active set is fixed (x¹_s ≥ min_s > 0 on active slots);
* the floors: `Σ a_{g,s} x^w_s ≥ Σ a_{g,s} x¹_s ≥ 10` (credits are nonnegative);
* every upper row with nonnegative coefficients (ceilings, 11 per session, sets per exercise), because it holds at xⁿ.

Shape rows (VOL-07, twins) are not implied by the sandwich. They hold because placement inserts sets in VOL-07 / R3-VOL-03
order (prototype: 0 breaks in 60 weeks). **Consequence:** the hard part (minutes, floors, caps) is proven on two weeks per
block, and the middle weeks need no repair loops. If some data are **not** monotone (an end-test week, a strength phase with
longer rests early, an athletic taper), add that week as an extra endpoint in the same MILP. Each one costs |S| more integer
variables.

### 7.4 Layer D: the stairway as min-cost flow

* Per trained line: S_g = direct sets in the first week (from C), P_g = peak (from C, ≤ C_g). Each of the P_g − S_g added sets is
  a unit with an ideal week t_{g,k}: when the coach's λ-curve (3 % to the halfway week, 5 % after, λ-scaled; 12 v1.2 §3.7.1)
  passes S_g + k. Compute the curve with multiplication and bisection only, and clamp it to the whole-set peak (an unclamped
  curve gives a negative planned rise into week N; prototype bug found and fixed).
* Graph: source → unit(g,k) → (g,w) → week w → sink. Unit arcs cost `|w − t_{g,k}|` (hundredths of a week), plus the landing
  penalty for a final unit placed before week N. (g,w) → w has capacity `max(1, ⌊0.07·T_g(w−1)⌋)` (7 %, one whole set always
  allowed). week → sink has three arcs: capacity 1 at −(never-flat bonus); capacity D_w − 1 at 0 (D_w = the house-monotone
  rounding of the coach's total-curve rise); and the rest up to `⌈0.10·Tot(w−1)⌉ − 1` (< 10 %) at a shape penalty.
* Tiers: landing in the last week ≻ never-flat ≻ (shape + timing, one weighted tier). Compute tier weights from instance
  bounds so each tier dominates everything below it, or run the flow once per tier with the previous tier frozen.
* Multi-block plans: the units cross block boundaries freely (the stairway "does not restart at an exercise-block boundary",
  12 v1.2 §3.9 item 7). Each block's slot vectors then realize the group totals at its first and last weeks (C solved with
  equality rows). If a middle block cannot hold a total (a unilateral block costs more minutes), its per-week caps enter the
  flow as the isotonic upper envelope `min_{v≥w} cap_v` (3.7). In the rare case that the joint packing still fails, a
  logic-based Benders cut ("this block cannot hold this vector") goes back to the flow.
* Cost: < 5 ms for any realistic plan (measured max 4.3 ms over 2,000 random plans). Integral by total unimodularity, exact in
  integers.

### 7.5 Layer E: placement (house-monotone, explainable)

For week w, each group adds its scheduled units one at a time: to the **day that is behind** (fewest sets of that group;
ties → rotate after the last day used), then inside the day to the **first exercise below the first one's sets, else the
first**. Both rules are sequential, so totals growing never take a set from any slot. Every added set gets a why-record:
"week 7: +1 back set → Thursday (Monday was ahead) → first back exercise". Extra small-muscle sets that do not fit a main day go
to the optional day's bonus slot (R3-VOL-03), modelled in C as optional-day slots with activation binaries.

### 7.6 Layer F: athletic budget, stages and blocks

* Weekly targets per track k (lower-body contacts, upper contacts, throws, sprint metres, COD, Olympic reps):
  `A_k(w) = base_k × progress(w)`. They climb with the stairway in off-season blocks, stay flat in-season, and go down only in
  a taper (by design). Within a stage, smooth any monotone target with isotonic regression.
* Realization: allowed (sets, reps or contacts) grids per station from the sport profile. Choose integer sets per station so
  the week's sum lands within tolerance of `A_k(w)`: a bounded change-making problem, solved exactly by DP over the count, tiny.
  Inside a stage the per-station counts grow by a sequential divisor rule, so they never dip. Plyometric : ballistic share by
  sport is a row on the same DP (Webster rounding of the share).
* Receive-Create stages: one stage per exercise block (1 Land → 2 Land & Go → 3 Repeat), chosen by the block-partition DP, so
  stage changes always fall on block boundaries.
* Minutes: the realized athletic minutes `A_d(w)` are inputs to C (reserved first). Whether the athletic minimum outranks
  resistance peaks or floors is a tier decision for the coach. Proposed: hard structure (12 + 2) ≻ resistance floors ≻ athletic
  budget minimum ≻ resistance peaks. Switching the athletic block off (R3-SES-02) simply sets `A_d = 0` and frees those minutes.

### 7.7 Solver backend decision and hardening list

**Default: the own pure-JS kernel** behind an interface `solve(model, tiers, {budget}) → {status, values, solution, proof}`.

| Why the own kernel | Why not HiGHS by default |
|---|---|
| keeps the engine synchronous, dependency-free, no build step (`engine/README.md`) | 3.5 MB wasm for a phone page; async init changes `generate()`'s contract |
| measured fast enough after decomposition (≤ 0.75 s per stage and ≤ 1.1 s selection + dosing on the hardest case; mostly < 0.2 s) | its power (presolve, cuts, heuristics) is not needed at 100-200 variables |
| bit-identical across engines by construction | determinism must be re-verified per HiGHS release (pin a version) |
| explanations come from our own rows (QuickXplain over catalogue ids) | HiGHS IIS is LP-only today |

**HiGHS's role:** (1) **CI certifier.** A dev-only test (in `tests/`, `npm i -D highs` after approval) solves every benchmark
model with HiGHS and asserts the same tier optima. (2) **Optional backend**, lazy-loaded in a Web Worker when the kernel
reports `unknown`, or for coach "pro" custom rules that make models bigger.

**Kernel hardening before production** (the prototype is a proof of concept):
1. warm-started dual simplex between parent and child nodes (store the basis, not the tableau);
2. presolve: drop rows that cannot be violated, substitute fixed variables (done), tighten coefficients;
3. branching: priority order first, then pseudo-cost or reliability branching; best-bound node selection with depth-first
   dives;
4. exact incumbent check in integers (done) and a safety margin on LP bounds (`ceil(lp − 1e-6)`);
5. deterministic node budgets per call and a plan-level budget; an `unknown` status;
6. full leximin (sequential min-max with saturation) for tier 1;
7. binary-search offers;
8. a test suite: the brute-force cross-checks (kept), property tests over random intakes, and the HiGHS certifier.

### 7.8 Explainability

Every tier optimum comes with its binding rows: the rows with zero slack at the optimum. LP duals at the final node rank them.
They are rendered from the catalogue: "Biceps peaks at 13 of 14 because Monday is full (66 of 66 min in week 12)." Drop
decisions carry a QuickXplain conflict. Offers carry the exact minimum. Stairway weeks carry "ideal week vs placed week".
Because the validator reads the **same catalogue**, an exemption like D-74 ("any muscle named in a warning is exempt") can no
longer hide a failure: a row is either satisfied, or it is relaxed by a named, coach-approved tier decision.

### 7.9 Performance budget (proposal)

Whole plan ≤ 1.5 s on a mid-range phone in a Web Worker. Measured in V8 / JSC on a laptop: ≤ 1.1 s for selection + dosing on
the hardest case; offers lazily or in parallel. Node budgets are sized so the 99th percentile of the benchmark corpus finishes
proven. The HiGHS fallback covers the tail.

### 7.10 Migration (for the spec writer)

Keep: intake, shape (blocks), template selection, exercise selection / variation (`select.mjs`), dose text (reps / RIR /
intensifiers, `dose.mjs`), render, explain. Replace: `volume.mjs`'s block loop (fit, structureCut, reduceGroups, probe /
peakNeed / timeCheck, trimToTime, nextRoomCut, the 40-attempt retry, banking, E-146 scheduling) with layers B-E; the athletic
dosing with layer F. Change: `validate.mjs` to read the catalogue. Add: the kernel (`engine/opt/…`), the flow, the catalogue
compiler, the certifier test.

---

## 8. Rule conflicts the math exposes (decisions for the coach)

| # | Conflict | When it bites | Options |
|---|---|---|---|
| 1 | "Each muscle reaches its ceiling exactly in the last week" (R3-VOL-04) vs "never flat" read on the weekly total (reviewers, H21) | with every line's final set in week N, the middle weeks can only use the other added sets; with fewer than N − 2 of them, some weeks stay flat (133 of 2,000 random plans, mostly small or short plans) | (a) keep landing first (prototype default) and let reps / load / RIR carry the flat weeks; (b) allow a line to land one week early when that removes a flat week |
| 2 | Total "< +10 %" (UNI-05) vs every line landing in week N, in tiny plans | about 20 total sets → only 1 added set a week; two lines cannot both step in week 12 (the coach's 2 × 45 example: the bank gives 19 → 21 = +10.5 %, the flow lands calves in week 12 and hips in week 11) | (a) the 10 % rule wins (prototype); (b) "one set per line may always be added" |
| 3 | Floor 10 vs template capacity | a 2-day template with 2 chest exercises on one day holds at most 9 chest sets at any length | (a) "add a day" (exact oracle); (b) allow a 3rd exercise of that group on that day |
| 4 | Week-1 sets above the level start | 2 exercises × 2 sets on every trained day can exceed the start (12 v1.2 §3.3) | tier 2 of C minimizes the excess; the coach decides whether the start or "2 × 2 everywhere" wins when they conflict |
| 5 | Athletic budget vs resistance peaks inside the minutes | athletes at 60-75 min | tier order (7.6 proposal) |

---

## 9. Risks and open questions

* **Own-solver correctness.** Mitigated by brute-force tests (kept), exact integer re-checks of incumbents, and the HiGHS
  certifier in CI.
* **Heavy tails.** Some intake may need far more nodes. Use budgets → `unknown` → HiGHS, or keep the group and flag; never a
  silent drop.
* **Model fidelity.** The prototype simplifies hips lines, optional days, FOCUS slots and tests. The spec must model glutes and
  hamstrings lines inside the hips group (two line ceilings, one group floor) and optional-day slots with activation binaries.
  All of these stay linear.
* **Weights inside one tier** (shape vs timing in the flow) are judgment calls. Expose them as coach-tunable parameters with
  defaults in `rules.json`.
* **HiGHS speed was not measured locally.** Installing packages was not authorized in this run. The judges should treat the
  "milliseconds" figure as an expectation until the certifier test runs.

---

## 10. References

1. Tatarenko, M. N. (2025). Application of linear programming methods for automated planning of personalized training programs. *Modelling and Data Analysis* 15(4). https://psyjournals.ru/en/journals/mda/archive/2025_n4/Tatarenko
2. Kumyaito, N., Yupapin, P., Tamee, K. (2018). Planning a sports training program using Adaptive Particle Swarm Optimization with emphasis on physiological constraints. *BMC Research Notes*. https://www.ncbi.nlm.nih.gov/pmc/articles/PMC5759209/
3. Fister, I. et al. (2015). Planning the sports training sessions with the bat algorithm. https://repository.mdx.ac.uk/item/85361
4. Fister, I. et al. Computational intelligence algorithms for the development of an Artificial Sport Trainer. *Informatica*. https://informatica.si/index.php/informatica/article/view/1905
5. Mathematical Modelling and Optimisation of Athletic Performance: Tapering and Periodisation (2025). arXiv 2505.20859. https://arxiv.org/abs/2505.20859v1
6. Kendall, G., Knust, S., Ribeiro, C. C., Urrutia, S. (2010). Scheduling in sports: an annotated bibliography. *Computers & Operations Research*. https://www.dcs.gla.ac.uk/~pat/jchoco/boatAllocation/papers/1-s2.0-S0305054809001543-main.pdf
7. US 11,621,067 B1, Method for generating personalized resistance training program. https://patents.google.com/patent/US11621067
8. Mittelmann, H. Benchmarks of optimization software (INFORMS 2025 talk). https://plato.asu.edu/talks/informs2025.pdf
9. HiGHS project (README). https://github.com/jannicklange/HiGHS/blob/master/README.md
10. Goal programming (lexicographic / preemptive and weighted variants; Ignizio's sequential LP algorithm). https://en.wikipedia.org/wiki/Goal_programming
11. Gurobi Optimizer: Multiple objectives (hierarchical, degradation tolerances). https://docs.gurobi.com/projects/optimizer/en/11.0/features/multiobjective.html
12. Lexicographic max-min optimization. https://en.wikipedia.org/wiki/Lexicographic_max-min_optimization
13. Nace, D., Pióro, M. Max-min fairness and its applications to routing and load-balancing in communication networks: a tutorial. https://www.lunduniversity.lu.se/lup/publication/894cac2f-f372-4eff-81a6-aaed7535b479
14. Google OR-Tools: Employee scheduling (CP-SAT). https://developers.google.com/optimization/scheduling/employee_scheduling
15. Krupke, D. et al. The CP-SAT Primer. https://d-krupke.github.io/cpsat-primer/
16. or-tools-wasm (Apache-2.0; threads need cross-origin isolation; `numWorkers: 1`). https://github.com/Axelwickm/or-tools-wasm
17. Martello, S., Toth, P. (1990). *Knapsack Problems: Algorithms and Computer Implementations*. Wiley (implementations: https://mknapsack.readthedocs.io/)
18. First-fit-decreasing bin packing (Dósa's tight 11/9·OPT + 6/9). https://en.wikipedia.org/wiki/First-fit-decreasing_bin_packing
19. Network flows, total unimodularity and integrality (lecture notes, SDU DM545). https://imada.sdu.dk/u/marco/DM545/Slides/dm545-netflow-handout.pdf
20. Controlled rounding via network flow (Cox & Ernst 1982, INFOR 20:423-452; U.S. Census research report RR88-02). https://census.gov/content/dam/Census/library/working-papers/1988/adrm/rr88-02.pdf
21. Accelerating the pool-adjacent-violators algorithm for isotonic distributional regression. arXiv 2006.05527. https://arxiv.org/pdf/2006.05527
22. Optimal solutions to the isotonic regression problem. arXiv 1904.04761. https://arxiv.org/pdf/1904.04761
23. Stout, Q. F. L1 isotonic regression (values can be chosen among data values). https://web.eecs.umich.edu/~qstout/pap/L1IsoReg.pdf
24. House monotonicity (Hamilton violates it; divisor, rank-index and the Balinski-Young quota method satisfy it). https://en.wikipedia.org/wiki/House_monotonicity
25. Balinski, M. L., Young, H. P. (1975). The Quota Method of Apportionment. *American Mathematical Monthly* 82(7):701-730, doi:10.1080/00029890.1975.11993911 (IIASA version: https://pure.iiasa.ac.at/752/1/PP-77-003.pdf)
26. Apportionment methods (MathWorld). https://mathworld.wolfram.com/ApportionmentMethod.html
27. Kirkpatrick, S., Gelatt, C. D., Vecchi, M. P. (1983). Optimization by simulated annealing. *Science* 220:671-680. https://zhanggroup.org/teaching/literature/Kirkpatrick_Annealing_Science_1983.pdf
28. Late acceptance hill climbing (Burke & Bykov, EJOR 258(1):70-78, 2017). https://en.wikipedia.org/wiki/Late_acceptance_hill_climbing
29. Timefold Solver: school timetabling (construction heuristics + local search). https://docs.timefold.ai/timefold-solver/latest/quickstart/shared/school-timetabling/school-timetabling-constraints
30. Land, A. H., Doig, A. G. (1960). An automatic method of solving discrete programming problems. *Econometrica* 28(3):497-520. https://jmvidal.cse.sc.edu/lib/land60a.html
31. Hooker, J. N., Ottosson, G. (2003). Logic-based Benders decomposition. *Mathematical Programming* 96:33-60. https://link.springer.com/article/10.1007/s10107-003-0375-9
32. Margot, F. Symmetry in integer linear programming. https://kilthub.cmu.edu/articles/journal_contribution/Symmetry_in_Integer_Linear_Programming/6708215/1
33. Bödi, R., Herr, K., Joswig, M. Symmetries of linear programs / Symmetries in linear and integer programs. arXiv 0908.3329. https://arxiv.org/pdf/0908.3329
34. MathWorks: Investigate linear infeasibilities (deletion / elastic filters, Chinneck). https://www.mathworks.com/help/optim/ug/investigate-linear-infeasibilities.html
35. Chinneck, J. MINOS(IIS). https://www.sce.carleton.ca/faculty/chinneck/minosiis.html
36. GAMS / HiGHS solver manual (IIS: LP only, under development). https://gams.com/54/docs/S_HIGHS.html
37. Junker, U. (2004). QuickXplain: preferred explanations and relaxations for over-constrained problems. AAAI. https://mlanthology.org/aaai/2004/junker2004aaai-quickxplain
38. Felfernig, A., Schubert, M., Zehentner, C. An efficient diagnosis algorithm for inconsistent constraint sets (FastDiag). arXiv 2102.09005. https://arxiv.org/pdf/2102.09005
39. PlanFitting: Personalized exercise planning with large-language-model-driven conversational agent. arXiv 2309.12555. https://arxiv.org/pdf/2309.12555
40. highs-js (MIT; HiGHS compiled to WebAssembly; single-threaded; LP format and model API). https://github.com/lovasoa/highs-js
41. `highs` on npm (1.15.3, MIT). https://npmjs.com/package/highs
42. jsDelivr package file listing for highs@1.15.3 (`highs.wasm` 3,531,385 B). https://data.jsdelivr.com/v1/packages/npm/highs@1.15.3
43. HiGHS MIP solver notes (parallel branch-and-cut non-deterministic; single thread for reproducibility). https://metricgate.com/docs/highs-mixed-integer-solver/
44. YALPS (MIT; "a few hundred integer variables at most"). https://github.com/IanManske/YALPS
45. jsLPSolver / javascript-lp-solver (Unlicense on npm 1.0.3). https://github.com/JWally/jsLPSolver
46. SCIP Optimization Suite (Apache-2.0 since 8.0.3). https://scipopt.org
47. ES accuracy of special functions (Math.pow / exp are implementation-approximated). https://esdiscuss.org/topic/es6-accuracy-of-special-functions
48. WebAssembly nondeterminism (NaN payloads, resource exhaustion, host functions). https://www.webassembly.org/docs/nondeterminism/

Package facts (license, version, unpacked size) for `highs`, `yalps`, `javascript-lp-solver`, `glpk.js` and `lp-model` were
read from the npm registry with `npm view` on 2026-10-09. The YALPS branch-and-bound behaviour (best-first heap, re-solve from
the root tableau per node, `Date.now()` only when `timeout` is set) was read from its published `dist/index.js` source.

---

## Appendix A. Reproducing the evidence

All files are in `design/research/`. Nothing outside `design/` is written. The prototypes read `model/rules.json` and
`model/templates.json`.

```
node design/research/kernel.test.mjs          # kernel + LP-based B&B vs brute force (400 + 1,500 random lexicographic IPs)
node design/research/lp.test.mjs              # bounded dual simplex: 3,000 random LPs
node design/research/proto_stairway_flow.mjs  # section 6.2 table
node design/research/proto_stairway_stress.mjs
node design/research/proto_endpoint.mjs       # section 6.4 (LP-based); ENGINE=cp OFFERS=0 ON_LIMIT=drop for the propagation-only run
node design/research/bench_runtime.mjs        # V8 timing
/System/Library/Frameworks/JavaScriptCore.framework/Versions/Current/Helpers/jsc -m design/research/bench_runtime.mjs   # JSC timing
```

Expected outputs are saved next to each script (`*.out.txt`, `tests.out.txt`). Timings vary by machine; selections, tier
optima, totals and checksums must be identical.
