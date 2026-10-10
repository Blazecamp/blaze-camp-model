# Judge 2 - mathematical rigor and robustness

Lens: are the guarantees real (floors, monotone climb, time fit)? Edge cases, infeasibility, numeric stability, determinism.
Written 2026-10-09 22:30 (local). Nothing outside `design/` was written; no git command was run. My scripts and their saved
outputs are in `design/judge2/` (section 9 says how to rerun them).

---

## 0. Status: the three design documents do not exist

The task was to read the three planner designs and score them. The list of files to read arrived empty, and the files are not on
disk: `design/design_milp.md`, `design/design_two-stage.md` and `design/design_template-parametric.md` do not exist (checked at
21:41, 21:42 and 22:26). `workflows/planner_design.js` builds the judge prompt from the designs that returned a result, so all three
design agents returned nothing.

**What this file judges instead.** I scored the three design *angles* exactly as the workflow briefed them (the `ANGLES` list in
`workflows/planner_design.js`), on my lens, against the only evidence that exists: `design/diagnosis.md`,
`design/rules_as_constraints.md`, `design/algorithm_research.md` and the research prototypes in `design/research/`. Because every
angle would be built on those prototypes, most of my time went into **testing whether their claimed guarantees are true**. Several
are not. Section 3 has the measurements; they matter more than the scores.

**How far to trust the scores.** They are provisional scores of approaches, not reviews of documents. A real document could move
any of them by about one point; section 4 says what would move each one.

**For whoever runs the workflow.** The Spec phase is told to "take the winning design". There is no design to take. Either re-run
the Design panel, or let the spec writer build from the diagnosis, the research, the rule inventory and the judge files. Sections
5 to 8 are written to be used directly in that case. Judge 1 (`design/judge_1.md`) reached the same reading of the situation.

---

## 1. Verdict on one page

| Angle (as briefed) | Score (1-10) | One-line reason on this lens |
|---|---|---|
| **two-stage** | **7.7 (8)** | The only angle where floors, climb and time fit can be theorems with whole-number arithmetic and bounded work. The price is the link between the stages, and the link the research built is broken in three places (section 3). All three are fixable; two fixes are verified here. |
| template-parametric | 7.4 (7) | The smallest model, so the strongest computational guarantees: always terminates, integers only, trivially deterministic. But "no plan on this skeleton" is not "no plan", so the R3-SES-02 answer is not exact, and the fixed skeleton is the measured root cause of the short-time failures. |
| milp | 7.0 (7) | The most complete statement of the rules: everything the other two need a lemma for is simply a row. But a guarantee that holds "when the solver finishes" is only as real as the solver, and the pure-JS solver does not finish on mainstream intakes at a third of the whole-block size or less. |

**Winner: two-stage**, with the template angle's small closed-form parameterization inside it and the MILP angle's model kept as
the reference definition and certifier.

**The five findings that should change the spec** (details and files in section 3):

1. **The stairway flow breaks a hard rule.** Its limits come from the planned curve, the coach's rules are stated on the week that
   was really placed. On the distribution the research meant to test, 159 of 20,000 plans have a week whose total rises 10 % or
   more; in small plans (1-4 trained groups, the pickleball and swimmer class) 2,867 weeks in 20,000 plans. An exact replacement
   is verified here: 0 violations by construction, equal to a brute-force optimum on 8,000 small plans, fewer flat weeks than
   the flow overall, 0.2 ms median and 13 ms worst case at real sizes.
2. **The research's random tests tested almost nothing random.** Their generator loses its low bits in floating point: 99.6 % of
   the "random" lines came from one row of the level table, and plans had 1, 5 or 9 lines. Repeated with a sound generator, the
   solver kernel's correctness claims hold (0 mismatches in 12,000 + 13,406 + 20,000 checks); the stairway claim does not (item 1).
3. **The exact solver is correct but not robust.** On the racket-player template at 3 days x 80 min one feasibility question takes
   189,968 nodes and 11 s on an idle laptop (and is "unknown" at the research budget). At 3 days x 60 min the dosing step
   returns **no plan** after 50,001 nodes and 18 s, although a plan exists and is found in 14 nodes with a different value
   order. Same solver, same model, four orders of magnitude apart.
4. **Two rule conflicts are far more common than the research reported.** The model's own placed limit says "the week total at
   most 7 %"; "every group reaches its ceiling in the last week" then cannot hold in 25 % of plans (63 % of small plans, 32 % of
   full level plans), because all the last sets land in one week. And ceilings are enforced on direct sets while the coach's unit
   is credited sets: 8 of the 32 trained groups in the research's own five cases end more than one set above their ceiling.
5. **"More time never untrains a group" is not a property any correct planner can have.** With the exact oracle, 5 of 268
   five-minute steps untrain a group, each time because a higher-priority group now fits. What is provable, and held in 268 of
   268 steps, is that the keep vector never gets lexicographically worse. The acceptance test (DR-4) must be restated.

**The grafts** are listed in section 7.

---

## 2. The lens

Eight criteria. Weights reflect the problem statement: the coach's complaints are about guarantees that were claimed and not
delivered (floors, flat stairways, minutes, over-cutting), so "is it exact" and "does it always answer" weigh most.

| # | Criterion | Question | Weight |
|---|---|---|---|
| R1 | Floors | Does every directly trained group hold its floor in every week, on the coach's tally (credited group sets), by construction? | 12 % |
| R2 | Climb | Never down, minimum climb, step limits on the weeks really placed, the last week the hardest, the fewest flat weeks arithmetic allows: proved or sampled? | 12 % |
| R3 | Time fit | Is every day of every week inside the limit by proof, with one time function, including test weeks and exercise-block changes? | 12 % |
| R4 | Infeasibility | Is "this group cannot be trained" exact (dropped only if no plan exists), is the kept set the lexicographic best, are offers re-solved, is "unknown" kept apart from "no"? | 18 % |
| R5 | Termination | Is the work bounded? What happens in the tail? Is a valid plan always returned? | 18 % |
| R6 | Numeric stability | Whole-number arithmetic in decisions; if floating point is used, is every verdict that rests on it certified? | 10 % |
| R7 | Determinism | Same input, same bytes, on every engine; budgets in nodes, never in milliseconds; total tie-breaks. | 6 % |
| R8 | Edge cases | Tiny plans, template capacity, helper credit, twin days, non-monotone weeks, parameters changed by a coach. | 12 % |

---

## 3. What I checked, and what I found

All three angles rest on the research prototypes (`design/research/`): the flow stairway, the LP-based branch-and-bound kernel, the
endpoint model and the "sandwich" argument. So the first job of a rigor judge is to check that evidence.

### 3.1 Summary table

| Research claim (`algorithm_research.md`) | Verdict | Measured here | File in `design/judge2/` |
|---|---|---|---|
| "2,000 random plans", "1,500 random IPs", "3,000 random LPs" | **Much weaker than stated** | The generator `seed = (seed * 1103515245 + 12345) % 2147483648` is evaluated in doubles; the product reaches 2^61, so its low bits are rounded away. In the stairway stress, 10,027 of 10,070 lines came from row 0 of the level table (10 -> 14), with Focus added to 99.7 % of them, and plans had 1, 5 or 9 lines in 1,990 of 2,000 cases. In the kernel tests `rnd(2)` returned 0 in 99.6 % of draws, so lower bounds and branching directions were constant and domains were 0..2. | `prng_audit.out.txt` part 1 |
| Kernel and LP-based B&B agree with brute force | **Holds** | Sound generator, varied domains, one row in four with coefficients up to 6,000: 12,000 solves, 0 mismatches. Models with the real structure (day time rows in 1/2000 min, quarter credits, big-M links, VOL-07 rows; mean 23 variables): 13,406 verdicts against the integer-only kernel, 0 mismatches. LP alone: 20,000 LPs, 0 false "infeasible", 0 bounds above an integer optimum. | `prng_audit.out.txt` parts 2-3, `kernel_fuzz.out.txt` |
| "Infeasible" verdicts of the oracle on real templates | **Holds on the sample** | 40 intakes on real templates: 123 "infeasible" verdicts; the integer-only kernel confirmed 122, contradicted 0, could not decide 1 in 1.5 M nodes. | `oracle_crosscheck.out.txt` |
| "0 weekly totals rising >= 10 %" | **False** | Intended distribution, sound generator: 159 weeks in 159 of 20,000 plans. Small plans: 2,867 weeks in 20,000 plans. Example: lines 12 -> 14 and 6 -> 7 over 14 weeks give totals `18 ... 19 19 19 19 19 21` (+10.5 %). Against an exact optimum on 5,972 small plans the flow is never worse, and "better" 138 times, which is only possible by breaking the rule. | `prng_audit.out.txt` part 4, `flow_audit.out.txt` |
| "0 group steps over max(1 set, 7 %)" | **False for ceilings of 29 or more** | A line planned above 28.57 gets a capacity of 2 while the placed line is still at 28: `... 27 28 30` (+7.14 %). 4 line-weeks in 5,000 full level plans (lines with a ceiling of 30, which the rules allow only as the L3 priority cap), 3,282 in 20,000 plans when groups are dosed as one line with ceilings up to 35 (the Pro setting). | `flow_audit.out.txt` |
| "0 flat weeks whenever the arithmetic allows it" | **Holds** | 0 of 15,929 plans with at least N - 2 non-final sets. Note the tier weights in the prototype (20000 / 10000 / 300 / 100 per week) are fixed numbers, not computed from the instance, so dominance is not proved: re-timing sets by more than 100 set-weeks in all costs more than one flat week. It did not happen in the samples. | `prng_audit.out.txt` part 4 |
| S1 "max weekly rise 9.0 % -> 7.7 %" reported as a success | **Breaks the model's own placed limit** | `rules.stairway.limits.placed.total_pct = 0.07` ("the week total at most 7 %; 10 % is never reached"). The flow exceeds it in 5,053 of 20,000 plans, always in the last week, always because every line lands there. In each of those plans landing every line is arithmetically impossible under 7 %. | `flow_audit.out.txt` part B |
| "Every tier proven optimal; selection 3-743 ms, dosing 1-356 ms" | **True on the five cases, not robust** | Racket-player template, 3 days x 80 min, 133 variables: the sixth oracle call needs 189,968 nodes (10.9 s on an idle laptop, 37.8 s while another job ran) and is UNKNOWN at the research budget of 20,000 nodes. Under five other deterministic value orders the same solver needs 17-28 nodes. Same template, 3 days x 60 min: selection keeps 6 groups in 0.4 s, then dosing returns NO SOLUTION after 50,001 nodes and 18.2 s. A plan exists: found in 14 nodes with sets tried at their minimum first; the three tiers then take 4.9 s. | `heavy_tail.out.txt`, `heavy_tail_orders.out.txt`, `dose_tail.out.txt`, `dose_tail_fix.out.txt` |
| "0 time violations in 60 weeks" | **True against minutes x 1.10 with every pair supersetted** | Against the chosen minutes, with every pair supersetted: 17 of 48 day-weeks over in E1 (worst +5.9 min), 18 of 24 in E2, 9 of 48 in E3, 0 of 48 in E4, 16 of 36 in E5 (worst +8.6). The prototype also costs a pair at x 0.65, while DEF-09 says a pair shares one rest (the longest): the factor is optimistic by 0.08 to 0.34 min per round. | `endpoint_audit.out.txt` |
| Ceilings respected | **On direct sets only** | With helper credit, 8 of the 32 trained groups in E1-E5 peak more than one set above their ceiling (E3 hips 28 against 24 + 1; E4 shoulders 28.5 against 25 + 1). T5-CAP-01 allows +1. The credited step rule (max(1 set, 7 %) + 0.5) held on these five cases, but nothing in the flow enforces it. | `endpoint_audit.out.txt` |
| "0 floor violations, 0 slot decreases, 0 VOL-07 breaks" | **Reproduced; the general argument is missing** | The research states the sandwich lemma for time and floors and says the shape rows "hold because placement inserts sets in order (0 breaks in 60 weeks)". That is a sample, not a proof. Section 5.2 gives the missing lemma. | section 5 |
| "Byte-identical in V8 and JavaScriptCore" | **Confirmed** | `bench_runtime.mjs` in Node 22 and the macOS `jsc` shell: identical selections, tier optima, totals and checksum. | rerun |
| DR-4 "more minutes never untrains a group" | **Not achievable; a different property is** | Exact oracle, 15 intake variants, 30-120 min in 5-min steps: a group is untrained by more minutes in 5 of 268 steps (E2 template, 3 days: 40 min keeps calves, hips, chest; 45 min keeps calves, hips, quads). The keep vector is lexicographically worse in 0 of 268. | `keep_sweep.out.txt` |

### 3.2 Notes on the findings

**The broken generator.** This is the most important finding about method. The research is honest and careful; its tests were
written to be hard. But `Math` on doubles silently turned "1-12 lines from 8 rows" into "1, 5 or 9 near-identical lines". Every
"0 violations" in the research summary table is a statement about that narrow family. The spec's test rules must require a
generator built on `Math.imul` (or BigInt) and an assertion on the distribution each test draws.

**Why the flow breaks the 10 % rule.** `Tot_w - Tot_(w-1) < 0.10 * Tot_(w-1)` is the same as `10*c_w - 11*c_(w-1) <= Tot_1 - 1`
on the cumulative count c of placed sets. That row has coefficients 10 and 11: it is not a network row, so no choice of arc
capacities can express it. The prototype uses capacities from the planned total instead. When the flow delays a set (the landing
rule forces delays), the placed total is below the planned one and the capacity is too generous by one set. It bites exactly
where one set is 5-10 % of the week: plans with one to four trained groups. Those are the plans the coach is unhappy with today.

**Correct but not robust.** The kernel's answers were right every time I could check them. Its running time is not controlled. A
depth-first search with a fixed value order can be lucky (17 nodes) or lost (190,000 nodes) on the same model, and the research
order happens to be the lost one on a mainstream intake. The 3 x 60 case is worse: the plan handed to the dosing step by the
selection step is itself a feasible dosing answer, but the dosing search does not start from it and finds nothing in its budget.
None of this is a reason to drop exact search. It is a reason to (a) make the models much smaller, (b) always start from a known
plan, (c) run a small deterministic portfolio of orders, and (d) never ship "no solution" or drop a group because a budget ran
out.

**Verified here: pruning can be certified at almost no cost.** A node pruned because floating-point LP says "infeasible" is an
opinion. For any row multipliers y >= 0, weak duality gives a bound that can be evaluated in exact integers (section 5.5).
`milp_cert.mjs` does that for every prune and branches on when the proof fails. On 10 real intakes: 19,160 prunes, 19,160
re-proved exactly, identical kept groups and tier optima, 2 % more time (`cert_audit.out.txt`). With this, "infeasible" and
"optimal" are theorems.

**Verified here: an exact stairway.** `stairway_exact.mjs` chooses the weekly total path by dynamic programming over the sorted
vector of sets each line still has to add, then shares the sets out with a transportation flow, then certifies the table
(section 5.3 has the theorem). Against a brute-force reference on 8,000 small plans, landings and flat weeks are identical under
both the 10 % and the 7 % rule. On 20,000 plans of the intended distribution it has 0 violations by certificate, where the
research flow breaks the 10 % rule in 159 plans and the 7 % rule in 5,025; it also leaves fewer flat weeks (15,242 against
15,387). Time at real sizes (up to 8 groups, up to 12 weeks): median 0.2 ms, 99th percentile 7.4 ms, worst 12.7 ms. At 12
lines x 16 weeks the worst case was 5.5 s, so it needs a state budget and a fallback, like every other exact step.
The coach's 2 x 45 example under either rule: totals `16 16 17 17 17 18 18 19 19 20 20 21`, six flat weeks (the minimum: five
sets, eleven steps), one line landing in week 12 (two cannot: the total is 20).

---

## 4. Scores

Scale per criterion 1-10; total is the weighted sum.

| Criterion (weight) | two-stage | template-parametric | milp |
|---|---|---|---|
| R1 floors (12) | 9 | 8 | 9 |
| R2 climb (12) | 8 | 8 | 9 |
| R3 time fit (12) | 8 | 9 | 9 |
| R4 infeasibility (18) | 8 | 4 | 8 |
| R5 termination (18) | 6 | 8 | 3 |
| R6 numeric stability (10) | 8 | 10 | 5 |
| R7 determinism (6) | 9 | 10 | 7 |
| R8 edge cases (12) | 7 | 5 | 7 |
| **Weighted** | **7.70** | **7.36** | **6.98** |

### 4.1 two-stage: 7.7

Brief: stage 1 decides weekly sets per group per week (monotone stairway by isotonic / apportionment math, floors, caps, Focus,
R3-SES-02 group selection by an exact feasibility check against time capacity); stage 2 packs sets into days and slots; a
provable feasibility guarantee links the stages.

Why it leads on this lens:

- **The guarantees can be theorems, not solver outcomes.** Floors and time are proved on two weeks per exercise block and carried
  to every week by the sandwich lemma (5.1). The shape rows are carried by the chain lemma (5.2). The step rules are satisfied by
  construction in the exact stairway (5.3). None of these depends on a search finishing.
- **Whole numbers where it matters.** The stairway, the placement and the certificates are integer-only. Floating point appears
  only inside the feasibility oracle, and there it can be certified (5.5).
- **The unit is right.** Stage 1 works on weekly sets per group, which is the coach's unit and the scorer's unit.
- **R4 (8).** Lexicographic selection with an exact three-valued oracle is exactly R3-SES-02 step 2, and offers can be re-solves.

Where it loses points:

- **R5 (6).** If either stage is a generic integer program on slot variables, the heavy tails of section 3 apply to it: they were
  measured on the research chain, which is a two-stage design. The cure is the closed form of 5.6, which this angle allows but
  does not promise.
- **R8 (7), R2 (8).** The link must be proved on the quantities the coach's rules name: placed weeks, credited sets. The
  research link is broken in three places (section 3): step limits are taken from the planned curve instead of the placed
  weeks; ceilings and steps are on direct instead of credited sets; the shape rows are carried by a sample instead of a proof.
  The first is repaired by 5.3 and the third by 5.2, both verified here; the second needs rows on credited sets. A two-stage
  document that inherits "min-cost flow, hence exact" without these corrections would score 6 here.
- **R3 (8).** One pair of endpoints per stairway block is not enough. Exercises, time classes and rest classes change at every
  exercise block (weeks 1-4, 5-8, 9-12), and tests add minutes in the first and last week. Every such week must be an endpoint
  of the same model (5.1, hypothesis H3). The research's "isotonic envelope, then a Benders cut if needed" has no proof.

What would move the score: a document that states 5.1-5.6 with their hypotheses, makes stage 2 the closed-form placement, and
shows bounded work for stage 1 is a 9. One with an aggregate-minutes capacity check and a repair loop between the stages is a 5:
that is the current engine.

### 4.2 template-parametric: 7.4

Brief: the coach's day templates as fixed skeletons chosen by goal x days x minutes; a small set of parameters (sets per slot per
week) solved exactly by a small integer program or dynamic programming; slots added or removed only by explicit rules.

Why it scores well on this lens:

- **R5, R6, R7 (8, 10, 10).** A handful of integers per group can be solved by enumeration or dynamic programming: bounded work,
  no floating point, nothing to certify, the same bytes everywhere. It is the only angle that can promise an answer in a fixed
  number of steps. (R5 is 8 and not 10 because "sets per slot per week", taken literally, is 700 variables, and even a
  fixed-structure slot model needed 4.9-18 s in section 3. The promise holds only with the group-level parameterization of 5.6.)
- **R1-R3 (8, 8, 9).** Inside a skeleton the floors, the climb and the minutes are easy to prove.

Where it loses points:

- **R4 (4).** The exactness is relative to the skeleton. "Chest cannot reach 10 on the 2-day template at any length" is a fact
  about a template, not about the client. The diagnosis measured the consequence (RC2): at 3 x 45 the pickleball player trains
  chest and calves while Monday has 11 free minutes. So the lexicographic best kept set, the thing R3-SES-02 asks for, is not
  delivered, and "add or remove slots by explicit rules" puts the unproven part back into rules.
- **R8 (5).** Skeletons chosen by days x minutes make the feasible set jump at every boundary. Then not even the lexicographic
  monotonicity of 5.4 holds, and an offer ("add a day") can make things worse. Offers would have to be checked case by case.

What would move the score: if which days a group trains on, and which of its slots are active, are solved choices inside the
skeleton (a slot may be switched off, never forced on by a longer session), R4 and R8 rise to about 7 and the total to about 8.
At that point it is the recommended design.

### 4.3 milp: 7.0

Brief: the whole block (weeks x days x groups x slots) as one mixed-integer program with lexicographic goal programming; a solver
strategy (pure-JS branch-and-bound or a justified MIT / Apache wasm solver); decomposition; exact infeasibility reporting.

Why it scores well on this lens:

- **R1-R3 (9, 9, 9).** Every rule is a row in every week. The things the other angles need lemmas for are native: the 10 % rule
  on placed totals (`10*Tot_w - 11*Tot_(w-1) <= -1`), credited steps with helper coupling, ceilings on credited sets, test weeks,
  a strength phase with longer rests. A returned plan satisfies all of it, with integer objectives frozen exactly tier by tier.
- **R4 (8).** In principle the most exact: "no plan exists" means no plan in the whole model.

Where it loses points:

- **R5 (3).** The guarantee exists only when the solve finishes. The research reports 9.6 s and an unproven tier on E1 when
  structure and dosing are solved together, and that model still holds only two weeks of the block. I measured 11 s (and
  "unknown" at the research budget) on one call of a 133-variable two-week model, and no plan at all from a 146-variable one.
  Judge 3 built the whole-block model on the same kernel (`design/judge3/monolith.out.txt`, as read at 22:30): E1 over 12 weeks
  is 460 variables and 1,690 rows, its first LP alone takes 1.9 s, and 41 nodes take 29 s without finding any plan. So with the
  pure-JS kernel "unknown" is the normal answer. With HiGHS (MIT, wasm, 3.5 MB) it would probably be fine, but nobody has
  measured it, a plan needs dozens of solves (up to 8 selection calls, 3-9 tiers, 7 session lengths for offers), and the
  guarantee becomes trust in a tolerance-based solver.
- **R6 (5).** Rows mixing 1 and 6,000 with big-M links are where floating-point LP is weakest; the research itself met a false
  "infeasible" before adding scaling. Certified pruning (5.5) repairs this for a kernel we own. For HiGHS only the incumbent can
  be re-checked exactly; an "infeasible" stays uncertified.
- **R7 (7).** Deterministic with node budgets, but when a budget is hit the plan depends on the budget.

What would move the score: measured HiGHS times under a phone-sized budget with an exact incumbent check would lift R5 to about 7
and the total to about 7.7. A pure-JS monolith stays at 6.

---

## 5. The guarantees, stated so they can be proved

This is what the spec must contain, whichever design is built. Each item names its hypotheses, because every false claim found in
section 3 came from a hypothesis nobody wrote down.

### 5.1 Sandwich lemma (floors, time and caps on every week from two weeks)

Fix one exercise block (its exercises and active slots do not change) with first week a and last week n. Let x^a <= x^n be
integer set vectors, both satisfying every row of their own week. Assume:

- **H1** the active slot set is fixed and every active slot has at least its minimum sets in x^a;
- **H2** x^a <= x^w <= x^n componentwise for every week w of the block;
- **H3** week n dominates every week in cost: fixed minutes F_d(w) <= F_d(n), athletic minutes A_d(w) <= A_d(n), per-set minutes
  tau_s(w) <= tau_s(n). (Monotone in w is enough but not needed. A week that is not dominated, such as a first week with tests,
  becomes an extra endpoint of the same model.)

Then in every week w:

- every **upper row with non-negative coefficients** holds because it holds at x^n: the day's minutes (straight sets; and the
  DEF-09 superset formula, which is non-decreasing in each set count), the per-session credited limit, the credited ceiling, the
  exercise counts;
- every **lower row with non-negative coefficients** holds because it holds at x^a: the credited floors.

Not covered, and to be handled as stated:

- **H4 shape rows** (VOL-07 inside a day, even twin days): lemma 5.2.
- **H5 step rules** (per group, weekly total): the scheduler of 5.3.
- **H6 two-sided rows** are not preserved at all. Example: a bilateral share of 0.80 +/- 0.03. Week a has 8 bilateral and 2
  unilateral sets (0.80), week n has 12 and 3 (0.80). Every monotone path between them passes 12 sets, where the only choices are
  10 + 2 (0.833) and 9 + 3 (0.75): both outside the band. So ratio targets must be soft, or defined on exercises (constant
  inside a block), never hard rows on sets.
- **H7 the stairway crosses exercise blocks.** One model must hold all block endpoints (weeks 1, 4, 5, 8, 9, 12 on a 12-week
  plan), linked by "group totals never drop and rise by at most the step limit across the boundary". Solving block by block and
  repairing afterwards has no feasibility guarantee.

### 5.2 Chain lemma (the missing half of the sandwich)

Let S be the integer points of a system of difference rows `x_i - x_j <= c_ij` with every `c_ij` in {0, 1, 2, ...}, plus box
bounds. Suppose the rows with `c_ij = 0` contain no directed cycle. If x <= y are both in S and x != y, then there is an index i
with `x_i < y_i` and `x + e_i` in S.

*Proof.* Let I = {i : x_i < y_i}. Raising x_i by one can only break a row `x_i - x_j <= c_ij` that is tight at x. If j is not in
I then `y_j = x_j`, so `y_i - y_j >= x_i + 1 - x_j = c_ij + 1`, contradicting y in S. So every blocked i in I is blocked by some j
in I. If all of I were blocked we could follow blockers forever inside the finite set I and close a cycle of tight rows;
summing them gives `0 = sum of c`, so every c on the cycle is 0, a directed cycle of zero rows: excluded. QED.

Use. VOL-07 is `x_(k+1) - x_k <= 0` and `x_k - x_(k+1) <= 1`; twin days are `|x_s - x_s'| <= 1`. The zero rows point from each
exercise to the one before it in the session: a path, no cycle. All these rows stay inside one group. Therefore, for every
group, there is a path of single added sets from x^a to x^n on which every prefix keeps VOL-07 and the twin rule, and **the
rule "add the set to the preferred slot among those that keep the shape rows" can never get stuck**. The coach's order (the
exposure that is behind first, then the first exercise below the first one's sets) picks among the admissible slots. With 5.1
this gives: every week between the endpoints satisfies floors, minutes, caps and shape, for any number of sets the stairway
releases to the group that week.

The closed forms SF-3 and SF-4 of the rule inventory are this chain written out; they make it canonical (5.6).

### 5.3 Exact stairway (step rules on the weeks really placed)

Setting: m groups, group g adds `u_g = P_g - S_g` sets between week 1 and week N, at most one per week.

**Theorem (Gale 1957, Ryser 1957, in the form used here).** A sequence of weekly rises D_2..D_N with `sum D_w = sum u_g` can be
shared out among the groups, one set per group per week, if and only if this rule never fails: go through the weeks in order and
take each week's D_w sets from the D_w groups with the most sets left. *Proof sketch.* If some sharing exists but week 2 uses
group a and not group b with more sets left, then b has a set in some later week where a has none; swap the two. Row and column
sums are unchanged. Repeat until week 2 uses the largest; continue with the remaining weeks.

Consequences, all implemented in `judge2/stairway_exact.mjs`:

1. A dynamic program over (week, sorted vector of sets left) visits exactly the realizable total paths. The total rule is checked
   in each transition on the true previous total (10 % strict, or 7 %, with "one set is always allowed"). The per-group rule holds
   because a group adds at most one set a week, which is never above max(1 set, 7 %).
2. Landings (the last-week rise), flat weeks, back-to-back flat weeks and the distance to the planned 3 % / 5 % total curve are
   functions of the total path alone. The program optimizes them lexicographically with integer weights computed from N and the
   number of sets so that each tier dominates the next; the largest weight is below 10^10.
3. Who steps in which week is then a transportation problem with fixed column sums: totally unimodular, integral, solved by the
   research's own `mcf.mjs` with each set as near as possible to the week its planned curve reaches it. It cannot change tiers
   above it.
4. A final pass re-checks every rule on the table and throws on failure.

What the upstream stage owes it (the link): `P_g <= S_g + N - 1`, and `P_g <= floor(S_g * G(N))` while lambda is capped at 1.
Both are linear rows on the endpoint variables. With them no plan was unschedulable in 40,000 runs (20,000 under each total
rule). I have not proved that this always holds, so the spec must do one of two things: prove it for the total rule the coach
chooses, or define "unreachable" as one deterministic cut (lower the peak that cannot be reached, solve once more). It must
never be a failure and never a repair loop.

Open choices, all coach decisions: which total rule is hard (6.1); whether a group that cannot land in week N should land in
week N - 1 before anything else; whether groups above 28 sets may take two sets in a week.

### 5.4 Monotonicity that is true

Let F(mu) be the set of legal plans at session length mu, and k(mu) the lexicographically largest keep vector over F(mu).

**Lemma.** If F(mu) is contained in F(mu') whenever mu <= mu', then k(mu) <= k(mu') in lexicographic order. (A maximum over a
larger set is not smaller.)

Two things follow.

- The hypothesis is a modelling duty: nothing may be *forced* by a longer session. A station that appears from 75 minutes must be
  a slot the solver may leave empty. In the research prototype a trained day holds all its template slots, so nesting is not
  guaranteed there. The same goes for "+1 day": it is monotone only if the larger template can express the smaller one.
- Set inclusion of the kept groups does **not** follow and is false (5 of 268 steps). A strict priority order means a
  higher-priority group that newly fits may push out a lower one. DR-4 and the benchmark metric "more minutes untrains a group"
  must be replaced by "the keep vector never gets lexicographically worse", and an offer must say what it trades ("60 minutes adds
  quads; chest then counts from pressing credit only").

Binary search for offers needs the same hypothesis. There are only seven legal session lengths; solve all seven.

### 5.5 Certified pruning (verdicts that do not depend on floating point)

For `min c.x` over `A x <= b`, `l <= x <= u` and **any** vector `y >= 0`:

`c.x >= sum_j min over [l_j, u_j] of (c + A'y)_j x_j - y.b`.

So take the LP's multipliers, round them to multiples of 2^-24, clamp negatives to 0, and evaluate the right-hand side in BigInt
with the model's integer data. If it proves the bound (or, with c = 0, a positive value: infeasible), prune. If not, do not
prune; branch. Domains are finite and integer propagation decides fully fixed nodes, so the search still ends. Measured:
19,160 of 19,160 prunes re-proved, 2 % overhead (`cert_audit.out.txt`). References: Neumaier and Shcherbina, "Safe bounds in
linear and mixed-integer linear programming", Mathematical Programming 99 (2004); Cook, Koch, Steffy and Wolter, "A hybrid
branch-and-bound approach for exact rational mixed-integer programming", Mathematical Programming Computation 5 (2013).

A feasible verdict already carries a witness that is re-checked in integers. With this, an infeasible verdict carries a proof.
The third verdict, unknown, must exist and must never drop a group.

### 5.6 Why the models can be small (bounded work)

The inventory's SF-3, SF-4 and SF-5 say: once the layout is fixed, the sets of every slot are a closed-form, set-by-set
(house-monotone) function of the group's weekly total and its training days, and the minutes are a non-decreasing function of
those totals. So the real unknowns are, per group and per endpoint week, one integer (the weekly total), plus a small choice of
training days. That is about 16-48 integers instead of 130-210 slot variables with big-M links.

I did not build this, so it is a claim to be proved in the spec, not a result: with it, the selection and dosing questions become
small enough for integer-only search with the capacity bound SF-6, and the tails of section 3 should disappear. Until that is
measured, the planner needs the safety net of section 7, graft 11.

---

## 6. Conflicts the mathematics exposes (decisions for the coach)

The research listed five (its section 8). These are new or much larger than reported.

| # | Conflict | How often | Options |
|---|---|---|---|
| 6.1 | "The week total at most 7 %" (`limits.placed.total_pct`) against "every group reaches its ceiling exactly in the last week" (R3-VOL-04). All last sets land in one week. | 25 % of plans; 63 % of small plans; 32 % of full level plans. Under 7 %, with the exact scheduler, every group lands in 74 % of plans and 95 % of groups land. | (a) 10 % is the only hard total limit, 7 % a target (what the research prototype silently does); (b) 7 % is hard and a group may land in week N - 1; (c) the last week is exempt. |
| 6.2 | Ceilings on direct sets against the one unit of account (credited sets). | 8 of 32 trained groups in the research cases are more than 1 set over. | (a) ceiling on credited sets (peaks in direct sets get lower); (b) ceiling on direct sets and the +1 allowance of T5-CAP-01 is dropped; (c) per group. |
| 6.3 | "Fits the chosen minutes" against the 1.10 band with every pair supersetted. | In the research cases 60 of 204 day-weeks are over the chosen minutes even with supersets everywhere. | The inventory's reading C-16 (the band is for the minimums only) is not what the prototype does. Decide the factor, and whether "supersets needed" plans are acceptable by default. |
| 6.4 | "Never flat" in whole sets. | A group with 2 sets to add in 11 steps is flat in 9 of them; the weekly total of the 2 x 45 plan is flat in 6 weeks at best. | Already raised by the diagnosis (DR-9). On this lens: define the weekly progress index (sets, then reps in the bracket, then planned effort) and prove it rises every week for every trained group. Without that definition "never flat" is not a checkable property. |
| 6.5 | More time can untrain a lower-priority group. | 5 of 268 five-minute steps. | It follows from his own priority order. The only question is the wording of the offer. |

---

## 7. Grafts

Onto the two-stage design. Numbers 9-14 come from this audit; without 9-12 the two-stage guarantees are not real.

From **milp**:

1. **One declarative rule catalogue as the definition of a legal plan**: every hard rule a linear row on slot-week integers, time
   in whole seconds, credit in quarter sets, read by the planner, the certifier and the benchmark scorer. The whole-block
   program is kept as the reference model and run with HiGHS in CI (a dev dependency only) to confirm stage optima.
2. **Lexicographic tiers with integer objectives and exact freezes.** Weights inside a tier are computed from instance bounds so
   that each term provably dominates the next, and the build checks the largest value stays below 2^53.
3. **Rules on the placed weeks as exact rows or transitions**, never as limits taken from the planned curve: the weekly total
   (`10*Tot_w - 11*Tot_(w-1) <= -1` or the 7 % form), the credited step max(1 set, 7 %) + 0.5, the credited ceiling.
4. **A three-valued oracle**: feasible with a witness re-checked in integers, infeasible with a certificate, unknown. A group is
   never dropped on unknown. A minimal conflict explains every dropped group.
5. **Certified pruning** (5.5) inside the kernel.

From **template-parametric**:

6. **The coach's templates as the layout grammar, and the closed-form placement as the parameterization** (5.6): unknowns are
   group-level integers; slots follow by VOL-07 and R3-VOL-03. Slot activation is a decision, so feasible sets nest in minutes.
7. **Template capacity tables computed once**: the most credited sets each group can reach on each template at any length. They
   give the "add a day, not minutes" offer immediately and feed the pruning bound SF-6.
8. **The coach's worked examples as golden tests** (12 v1.2 sections 5.1 and 5.5).

From **this audit**:

9. **The exact stairway of 5.3** in place of the planned-capacity flow, with the reachability rows in the endpoint stage.
10. **The sandwich lemma with its hypotheses and the chain lemma** in the spec; every exercise-block boundary and every test week
    an endpoint of one model; ratio targets soft.
11. **A search that always answers**: dosing starts from the selection witness; a fixed, ordered portfolio of value orders runs
    with doubling node budgets; the best certified plan is always shipped, flagged "not proven best" when a budget ends; "no
    solution" and "dropped for time" are impossible outcomes of a budget.
12. **The true monotonicity property** (5.4) in DR-4 and in the benchmark; offers computed at all seven legal lengths and worded
    as trades.
13. **Evidence rules**: generators on `Math.imul`, a distribution assertion in every random test, tests at the size of real
    models, V8 and JavaScriptCore equality in CI, and every "0 violations" stated with the rule's exact reading (placed or
    planned, direct or credited, chosen minutes or the band).
14. **One time function in whole seconds**, with the DEF-09 pair formula linearized exactly: a "shared rounds" variable
    `r <= n_1`, `r <= n_2` that saves `min(rest_1, rest_2)` per round, instead of the x 0.65 factor.

---

## 8. Rigor acceptance tests (for `design/bench/`)

Each is automatic and has a pass condition. P1-P4 are the three headline guarantees.

| # | Property | Pass |
|---|---|---|
| P1 | Every trained group, every week of a stairway block: credited sets on main days at or above the floor | 0 misses, no tolerance |
| P2 | Placed weeks: no group or total ever drops; group step <= max(1 set, 7 %) + 0.5 on credited sets; total step below the chosen limit of the previous placed week | 0 violations |
| P3 | Landings and flat weeks of the total equal the exact scheduler's optimum (`stairway_exact.mjs`) for the plan's own endpoints and the chosen tier order | equal |
| P4 | Every day of every week, re-costed from the printed doses with the one time function: within the chosen limit | 0 over; the limit is a named parameter |
| P5 | Sandwich: every week's slot vector lies between its block endpoints; VOL-07 and twin rows hold in every week | 0 breaks |
| P6 | Exhaustive check on small intakes (2-3 days, at most 6 groups): the kept vector equals the brute-force lexicographic optimum | equal |
| P7 | Minutes sweep at the seven legal lengths: keep vector never lexicographically worse | 0 violations (set inclusion is reported, not required) |
| P8 | Every offered schedule, run as an intake, is valid and gives exactly the stated change | 100 % |
| P9 | Oracle statuses over the benchmark corpus: share of unknown; no group dropped on unknown; no intake without a plan | unknown below 1 %; 0 drops; 0 without a plan |
| P10 | Every "infeasible" and "optimal" verdict carries a certificate that an independent checker accepts | 100 % |
| P11 | Same intake twice, and in Node and JavaScriptCore: identical plan bytes | identical |
| P12 | Work bound: nodes and DP states per plan under fixed budgets | 99th percentile inside the budget; the tail returns a flagged plan |
| P13 | Parameter robustness: floors 8-12, total limit 7 or 10 %, ceilings up to 30, fit factor 1.0-1.1: P1-P5 still pass | pass |
| P14 | Random tests assert their own distribution (number of lines, level rows, domains) | pass |

---

## 9. Reproduce

All scripts read `design/research/` and `model/` and write nothing; outputs were saved with shell redirection next to each script.

```
node design/judge2/prng_audit.mjs          # the generator; kernel, LP and stairway stress with a sound generator   (8 s)
node design/judge2/kernel_fuzz.mjs 3000    # LP-based B&B against the integer-only kernel on real-structure models (60 s)
node design/judge2/flow_audit.mjs          # the research flow against the placed-week rules; exact comparator     (45 s)
node design/judge2/stairway_exact.mjs      # the exact stairway: brute-force check, 2 x 20,000 plans               (14 min)
node design/judge2/endpoint_audit.mjs      # credited rules, chosen minutes, keep vector at the 7 legal lengths    (30 s)
node design/judge2/keep_sweep.mjs          # keep vector on a 5-minute grid, 15 intake variants                    (2.5 min)
node design/judge2/oracle_crosscheck.mjs   # "infeasible" verdicts on real templates against the integer kernel    (6 min)
node design/judge2/heavy_tail.mjs 80       # the 190,000-node oracle call                                          (40 s)
node design/judge2/heavy_tail_orders.mjs   # the same call under six value orders                                  (45 s)
OFFERS=0 node design/judge2/dose_tail.mjs  # the unchanged research chain returns NO SOLUTION at 3 x 60            (20 s)
node design/judge2/dose_tail_fix.mjs       # the same model, feasibility first                                     (5 s)
node design/judge2/cert_audit.mjs          # certified pruning (lp_cert.mjs, milp_cert.mjs) on 10 real intakes     (55 s)
```

`lp_cert.mjs` and `milp_cert.mjs` are copies of the research files with the certificate added; `stairway_exact.mjs` is new.
They are evidence for the spec, not engine code.

Limits of this audit. I tested the research prototypes, not the missing designs. The prototypes leave out optional days, Focus
slots, tests, conditioning and the athletic budget, so nothing here says the athletic side is sound; the same method (rules on
placed weeks, integer dynamic programming, a certificate) applies, but it is untested. Timings are from one laptop (Node 22).
The claim in 5.6 is an argument, not a measurement.
