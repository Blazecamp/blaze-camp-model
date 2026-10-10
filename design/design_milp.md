# Planner design A: exact optimization (one whole-block integer program, lexicographic goals)

Angle: formulate the whole stairway block (weeks x days x groups x slots) as a mixed-integer program with lexicographic
(pre-emptive) goal programming; choose the solver strategy; decompose so it is fast; report infeasibility exactly.
Written 2026-10-10. Inputs: `design/diagnosis.md`, `design/algorithm_research.md`, `design/rules_as_constraints.md` (rule ids
`T<tier>-<TOPIC>-<nn>`, `DEF-`, `DER-`, `SF-`, `C-`, `P-` below are that file's), `model/rules.json` 1.3.0, `model/templates.json`.
Nothing outside `design/` was written; no package was installed; nothing was committed.

A working prototype of this design is in `design/milp_proto/` (plain JS, Node 22, no dependencies; it reuses the research
LP and propagation code in `design/research/`). Every number in this document marked *measured* comes from it; section 14 and
Appendix A say how to rerun it. The prototype is evidence for the design, not engine code.

---

## 0. Summary

**The design in four sentences.**

1. **One model is the definition of a legal, best plan.** Every dosing rule is a linear row over whole numbers (sets, time in
   3-second units, credit in quarter sets) with its rule id; the coach's priority order is a list of objective tiers, each
   optimized and then frozen exactly before the next (section 2).
2. **The block is never solved week by week and never as one giant program.** Three exact reductions (section 3) shrink
   "12 weeks x 6 days x 60 slots" to a model over the block's *epoch weeks* (normally the first and the peak week:
   130-230 integer variables, measured), an exact stairway on the placed weeks (a dynamic program), and the coach's own
   placement order (no optimization at all). A certificate re-checks every rule on every week in integers.
3. **Who is trained directly is decided by exact yes / no questions in the coach's keep order** (R3-SES-02 step 2). A group
   is left out only when it is *proven* that no plan holds it together with every group already kept, and the proof comes
   back as a minimal list of rule ids ("floor of quads + Monday's minutes in the last week + the squat keeps its row").
   Offers are the same questions re-asked at every legal session length.
4. **The solver is a small pure-JS branch-and-bound that we own** (integer propagation + LP bound + exact integer re-check),
   synchronous, deterministic, no dependency. HiGHS (MIT, WebAssembly) is a development-time certifier only: shipping it
   would break three binding engine rules (no npm dependency, no build step, synchronous `generate()`), and the measurements
   below show it is not needed for the decision that must be exact.

**What the prototype measured** (Node 22, an M3 laptop that was also running other workflows; CPU time, not wall time).

| Evidence | Result |
|---|---|
| The three hard samples, full tier stack (section 14) | every tier **proven optimal**; 59-377 nodes, 0.27-1.44 s CPU; certificate PASS on every week: 0 days over the limit, 0 group-weeks under the floor, 0 staircase breaks, 0 step-rule breaks |
| Pickleball 2 x 45 | trains **calves (pinned) + hips**, hips 10 -> 12, calves 7 -> 8, one 2-set station each for knee, pull and push, days 44.5-48.9 min. The same two groups as the worked example for this client that follows the coach's approved policy (12 v1.2 section 5.5: hips + pinned calves) |
| CrossFit class 4 x 60 | trains **back, chest, shoulders** (10+ credited sets, climbing); squat and deadlift stay as class lifts; proves that hips and quads cannot reach 10 on their one class day at 60 min |
| Swimmer 3 x 60 | trains **back, hips, chest**; proves quads cannot be added (the squat with its late-block strength rest and its row do not fit beside back and hips); 3 x 75 adds quads and shoulders |
| Keep vector (who is trained) on the template grid, 6 families x 2-6 days x 30-120 min x L1-L3 | **609 of 609 cells proven**, no "unknown"; 63 nodes a plan at the median, 809 at most. All 594 plans with a trained group pass the all-weeks certificate (section 6.2) |
| The same decision as ONE weighted objective | *fragile*: nothing found in 3,001 nodes on a cell that takes 154 nodes as six questions. Asking one question per group (what the coach's rule literally says) is the robust form (section 4.2) |
| Generic rounding cuts on the time rows | *no reliable gain* (section 5.3). Reported so nobody repeats it |
| Lower tiers (overrun, peak height) at 3,000 nodes per tier | proven in 98.4 % and 96.7 % of grid cells; the rest return the best plan found, flagged (section 6.2) |
| Run time of the prototype kernel | median 0.11 s for four tiers on the grid, but 3.3 s at the 90th percentile and 24 s at the 99th: **the model is small enough, the prototype LP is not fast enough** (section 6.3) |

**What it does not do, and where it is weak.** The prototype dosed fixed athletic stations (it does not yet co-optimize
athletic sets with resistance sets, section 9); its LP is the research prototype's (dense, restarted at every node: about
50 pivots a node), so large 5-6-day models cost seconds where a warm-started kernel should cost tenths; explaining *why*
a group does not fit is the costliest call and must be on demand; and several readings of the coach's rules change the
plans materially and are his to decide (section 15).

---

## 1. Architecture and data flow

```
intake/2 ──► intake.mjs, shape.mjs (kept)            level, family, profile, blocks, exercise blocks, stages, tests
          ──► plan/candidates.mjs                     UNCUT day types -> candidate slots (every station, any session length),
          │      + select.mjs (kept)                  fixed blocks with minutes, room-cut ladder, legal pairs, slot variants
          │                                           each candidate slot gets its pick, time class and credit class per exercise block
          ──► plan/catalogue.mjs                      rules.json -> rows {id, tier, scope, linear form}  +  coach rule pack rows
          ──► plan/model.mjs                          the compact epoch model (section 3.4) for this stairway block
          ──► plan/keep.mjs      [tier 1]             keep vector: one exact question per group, keep order
          │      └─ plan/explain.mjs                  minimal conflict (rule ids) for every group not kept
          │      └─ plan/offers.mjs                   the same questions at 30..120 min and days + 1
          ──► plan/tiers.mjs     [tiers 1b..9]        room cuts, pattern stations, overrun, peak height, start, counts, placement
          ──► plan/stairway.mjs  [tier 3 schedule]    exact dynamic program on the placed weeks
          ──► plan/placement.mjs                      the coach's order: exposure that is behind, then VOL-07 inside the day
          ──► plan/athletic.mjs                       per-key doses per week (exact small DP), stages per exercise block
          ──► plan/certify.mjs                        every catalogue row, every week, integers -> certificate + why-records
          ──► dose.mjs, render.mjs, explain.mjs (kept) reps, RIR, rest, load text from the planned sets; plan/2 JSON
          ──► validate.mjs (changed)                  reads the same catalogue; no exemptions of its own
plan/solver/{propagate,lp,bb}.mjs                     the kernel, isolated; knows nothing about training
```

Four objects carry the design:

| Object | What it is | Who reads it |
|---|---|---|
| **Catalogue** | every rule as data: id, tier, kind (hard row, conditional row, soft deviation, objective term), scope, linear form over named quantities, the `why` key | model builder, certifier, `validate.mjs`, the benchmark scorer |
| **Instance** | one stairway block: candidate slots per day (group, time class, credit, min / max sets, role, pair partner), fixed blocks with minutes per week, room-cut ladder, groups in keep order with start / ceiling / floor / minimum climb | model builder, explainer, offers |
| **Kernel** | bounded-integer linear model + lexicographic solve with exact freezes; four verdicts | keep vector, tiers, explainer |
| **Certificate** | the plan plus, per tier, value / status / bound, the binding rows, and the all-weeks check | `plan/2` (`time_check`, `why`), tests, CI |

No stage after the model may add or remove volume (DR-1, DR-6): `dose.mjs` only turns sets into reps / RIR / rest text with the
same per-set seconds the model used, and the certificate re-costs the printed doses.

---

## 2. The mathematical model

### 2.1 Sets, units, data

Notation follows `rules_as_constraints.md` section 2. One **stairway block** b with weeks w = 1..N and exercise blocks
e = 1..E (`rules.stairway.exercise_blocks_by_N`); main days d; groups g in **keep order** π (T1-POL-05); candidate slots
s ∈ S_d with group g(s), in session order.

| Symbol | Meaning | Source |
|---|---|---|
| time unit | 1/20 min (3 s). Every value of `rules.time_model` (0.4, 0.5, 0.6, 0.75, 1.1, 1.25, 1.5, 2.5, 4.5 ...) is a multiple, so all time coefficients are whole numbers between 8 and 105 (the research prototype needed 1/2000 min because of its x 0.65 pair factor; DEF-09's "a pair shares one rest" does not) | DEF-09 |
| credit unit | quarter set; `cr_{g,s}` ∈ {0, 1, 2, 4}, capped at 4 per set per group | DEF-02, DEF-04 |
| `τ_{s,w}` | work + dosed rest of one set of slot s in week w (constant inside an exercise block; strength rest for class lifts and for an athlete's axial work lift in VOL 3) | DEF-09, T0-EFF-03, T0-EFF-07 |
| `ρ_{p,w}` | what one shared round of pair p saves = min(rest of its two slots) | DEF-09 |
| κ = 20 | changeover per exercise (1 min); a pair saves 2 x (1 - 0.5) = 1 min | DEF-09 |
| `F_{d,w}` | fixed minutes of day d in week w: warm-up, skill, core pair, athletic and power stations, joint care, WOD, aerobic add-on | DEF-09 |
| `m_s, M_s` | min / max sets of slot s: 2 (work lift 3 from 60 min, calves 3) / 4 (L1), 5 (L2-L3), isolation and calves 4 | T0-SES-15 |
| `S_g, C_g, F_g, mc_g` | level start, ceiling, floor, minimum climb | DER-01..09, T5-CAP-02, T2-FLR-01/02, T3-STW-02 |
| `μ_d, φ` | chosen minutes, fit factor (1.10 full-body, 1.0 split days) | T1-POL-02, P-13 |
| `G(N)` | planned growth at λ = 1 (N = 12: 1.5535, N = 8: 1.3282) | DEF-10 |

Candidate slots are the **uncut** template day types: every station of the day type is a candidate at every session
length (`include_from_minutes` is a default, not a gate). This is what makes "more minutes never makes the keep vector
worse" a theorem (section 3.5) instead of a hope.

### 2.2 Decision variables (reference model: every week)

| Variable | Domain | Meaning |
|---|---|---|
| `y_g` | {0,1} | group g trained directly (state FULL) |
| `z_{g,d}` | {0,1} | g trained on day d |
| `u_s` | {0,1} | slot s holds an exercise of a trained group-day (constant over the stairway block; an added exercise is a slot with a later first week, section 10) |
| `q_s` | {0,1} | slot s kept as a 2-set **pattern station** of a group that is not trained directly (T1-POL-07) |
| `n_{s,w}` | integer 0..M_s | working sets of slot s in week w |
| `p_k` | {0,1} | superset pair k switched on |
| `r_{k,w}` | integer | shared rounds of pair k in week w (≤ both set counts) |
| `c_j` | {0,1} | room cut j taken (the family's cut order, T1-POL-06) |
| `a_{t,e}` | integer | sets of athletic station t in exercise block e (section 9) |
| `o_{d,w}` | integer ≥ 0 | time units of day d over the chosen minutes in week w |
| deviations | integer ≥ 0 | shortfall under the ceiling, distance of week 1 from the start, uneven exposures, sets over 11 a session ... one per soft rule |

Derived, all linear: direct sets `V_{g,w} = Σ_{g(s)=g} n_{s,w}`; credited sets `4·Q_{g,w} = Σ_s cr_{g,s} n_{s,w}`;
total `Tot_w = Σ_s n_{s,w}`; day minutes

```
Min_{d,w} = F_{d,w} − Σ_j save_{j,d,w}·c_j + Σ_{s∈S_d} ( τ_{s,w}·n_{s,w} + κ·(u_s + q_s) ) − Σ_{k on d} ( ρ_{k,w}·r_{k,w} + κ·p_k )
```

(The pair term is DEF-09 exactly: rounds both exercises share cost both works + the longer rest, i.e. they save the shorter
rest; the remaining rounds are straight sets.)

### 2.3 Rows (hard and conditional-hard rules)

| # | Row | Rule ids |
|---|---|---|
| R1 | `z_{g,d} ≤ y_g`; `y_g ≤ Σ_d z_{g,d}`; `u_s ≤ z_{g(s),d(s)}`; slots open in session order | T1-POL-01, T6-CNT-03 |
| R2 | `2·z_{g,d} ≤ Σ_{s∈(g,d)} u_s ≤ 4·z_{g,d}` (calves: exactly 1 on every leg day when trained; a class lift counts as one) | T0-SES-10, T0-SES-11, T1-POL-09 |
| R3 | `m_s·u_s + 2·q_s ≤ n_{s,w} ≤ M_s·u_s + 2·q_s`; `n_{s,w} ≤ n_{s,w+1}` | T0-SES-15, T0-SES-14, T3-STW-01 |
| R4 | staircase inside a group-day, session order s_1..s_k: `n_{s_1,w} ≥ n_{s_2,w} ≥ … ≥ n_{s_k,w} ≥ n_{s_1,w} − 1` | T7-PLC-01 (VOL-07), made structural, see 2.5 |
| R5 | `p_k ≤` both exercises on; `r_{k,w} ≤ n_{s,w}`, `r_{k,w} ≤ n_{s',w}`, `r_{k,w} ≤ M·p_k`; only legal pairs exist as k | T0-SES-16, DEF-09, T1-POL-11 |
| R6 | a lower-body work lift that is on keeps its upper partner (trained or as a pattern station); the work-lift day of a trained group trains it | T0-SES-08, T0-SES-06, `cut_order.keep_work_pair`, `never_cut.roles` |
| R7 | **the day holds**: `Min_{d,w} ≤ φ·μ_d` for every week | T1-POL-02 |
| R8 | `o_{d,w} ≥ Min_{d,w} − μ_d` | T4-TIME-01 |
| R9 | **floor**: `Σ_s cr_{g,s} n_{s,w} ≥ 4·F_g·y_g` for every week | T2-FLR-01/02/04, T1-POL-01 |
| R10 | **minimum climb**: `V_{g,N} − V_{g,1} ≥ mc_g·y_g` | T3-STW-02, T1-POL-12 |
| R11 | group step on the placed weeks: `V_{g,w} − V_{g,w−1} ≤ max(1, ⌊0.07·V_{g,w−1}⌋)` (= 1 below 29 sets) | T0-STW-02 (placed), P-12 |
| R12 | weekly total on the placed weeks: `10·(Tot_w − Tot_{w−1}) ≤ Tot_{w−1} − 1` **or** `Tot_w − Tot_{w−1} ≤ 1` (one binary a week) | T0-STW-03, LK08 |
| R13 | λ ≤ 1 in whole sets: `V_{g,N} ≤ round_half_up(G(N)·V_{g,1})`, written `20000·V_{g,N} − ⌊20000·G(N)⌉·V_{g,1} ≤ 10000` | T3-STW-06, C-01 (P-09 changes G) |
| R14 | ceilings: `V_{g,w} ≤ C_g`; credited `4·Q_{g,w} ≤ 4·(C_g + 1)`; `≤ 30` | T5-CAP-01, T5-CAP-03 |
| R15 | pattern stations: at most one per group, only when `y_g = 0`, at most 3 a week | T1-POL-07 |
| R16 | room cuts in the family's order: `c_{j+1} ≤ c_j` | T1-POL-06, T1-POL-13 |
| R17 | field athletes: counted exercises of the day ≤ 12 | T0-SES-13, T6-CNT-07 |
| R18 | one counted squat day, one counted hinge day, never the same day: rows over the `u_s` of axial candidate slots | T0-SES-09 |
| R19 | athletic: station sets 2..4, never down inside the block, contacts per session, Olympic exposures ≤ 4, budget cap | T0-ATH-01/03, T3-ATH-01, T5-ATH-01 (section 9) |
| R20 | user edits and toggles are fixed values of `u`, `q`, `c`, `a` | T1-POL-14 |

*Prototype coverage:* R1-R10 and R13-R17 are in `planner.mjs` with these ids in the row tags; R11-R12 live in its
stairway; R20 as instance options. R18 and R19 are specified here and not prototyped (the three sample templates hold
their axial squat and axial hinge on different days by construction; athletic sets are fixed inputs, section 9).

Rules about **order** (core first, power before strength, horizontal before vertical, bilateral before unilateral, work
first: T0-SES-02..07) never change minutes or sets; they are a deterministic sort of the solved day and are checked by the
certificate. Rules about **picks** (equipment, pain tags, age lists, library only: T0-SAFE-*) filter the candidate slots
before the model exists.

### 2.4 Objective: the tiers, in order

Each tier is one integer objective. It is optimized over the set where all earlier tiers are frozen at their optimum
(`objective ≤ value` as an exact integer row). No weights between tiers.

| Tier | Sense | Objective | Rule ids | Notes |
|---|---|---|---|---|
| L0 | feasible | all hard rows | T0-* | a plan that cannot satisfy T0 is not shown |
| **L1a** | lex max | `(y_{π_1}, y_{π_2}, …)`: groups trained directly, keep order | T1-POL-05, T1-POL-01/02/03 | solved as one exact question per group (4.2) |
| L1b | min | number of room cuts taken | T1-POL-06, T1-POL-13 | a cut is kept only if a kept group needs it |
| L1c | lex max | pattern stations in the coach's pattern order (back, chest, quads, hips, then the rest) | T1-POL-07 | see reading 2 below |
| (L1d) | lex max | optional BELOW_FLOOR states; then L2 = min their deficit | T1-POL-08, T2-FLR-05 | **off by default** (reading 1) |
| (L3f) | min | flat weeks of the weekly total, `(N − 1 − Σ_g (V_{g,N} − V_{g,1}))⁺` | T3-STW-03 | **off by default** (reading 3) |
| L4 | min | `Σ_d (o_{d,1} + o_{d,peak})` minutes over the chosen length | T4-TIME-01 | the 10 % band is spent on the minimums only (C-16) |
| L5s | min | credited sets over 11 a session (14 Focus) | T5-CAP-05 | soft, as the model names it |
| L5a | leximin | peak shortfall `C_g − V_{g,N}` of the trained groups: worst first, then the rest | T5-CAP-04, T8-BAL-04 | prototype: worst, then total |
| L5h | min | athletic attainment gap (before L5a for competitive athletes) | T5-ATH-02 | section 9 |
| L5c | min | `Σ_g |V_{g,1} − S_g|`: week 1 at the level start when the peak allows it | T3-STW-08, T2-FLR-06, DER-01 | never "week 1 at the ceiling" |
| L3s | lex min | the stairway schedule: flat weeks, landings in week N, flat weeks in a row, distance to the coach's rounded λ-curve, weeks above 7 % | T3-STW-03/04/05/06/07 | exact DP on the endpoints of L1-L5 (3.3) |
| L6 | min | exercises (`Σ u_s`); split days: excess over the cap by minutes | T6-CNT-01/02/03 | |
| L7a | min | uneven exposures: added sets (and week-1 sets) of a group differ by more than 1 between its days, or the later day is ahead | T7-PLC-02, T7-WEEK-02 | |
| L7b | min | supersets switched on | T7-PAIR-03 | what stays on is "needed" (T1-POL-11) |
| L8 | min | laterality, push : pull, selection preferences | T8-* | slot variants (section 10) |
| L9 | lex min | canonical tie-break: the solution vector in a fixed variable order | T0-SYS-01 | a published plan does not change when the kernel is refactored |

**Three readings this design fixes, each one line to change** (they are coach decisions; section 15 shows what each does).

1. **A trained group holds its floor.** FULL or not trained directly; "trained below the floor" (E-11) is off. R3-SES-02
   says "train fewer muscles directly ... instead of dropping below the floor", and the diagnosis measured E-11 as the cause
   of 4 of 8 plans training a group under 10. The class lift of the class model is not a below-floor *state*: it is a fixed
   block of the class (3 sets, strength rest) that credits its group.
2. **Pattern stations rank below the trained groups and below the room cuts.** The inventory writes one state vector
   (FULL 3 > BELOW 2 > PATTERN 1 > NONE 0) and maximizes it lexicographically by group. Taken literally, a 2-set quad
   station outranks training back at its floor, and a pattern station can force joint care off the day. Here the vector of
   trained groups is maximized first (L1a), room cuts are minimized (L1b), and only then pattern stations take the room
   that is left (L1c). The one pattern station that is *not* optional is the upper partner of a work lift that is on (R6:
   hip + push, knee + pull, approved UNI-11 / ORD-06).
3. **"Never flat" is a property of the schedule, and of a trained group over the block (the minimum climb).** The number
   of whole sets a block adds is decided by the minutes (L4) and the ceilings (L5); the stairway (L3s) then makes the
   fewest flat weeks those sets allow. The alternative - flat weeks of the total rank above the chosen minutes (tier L3f) -
   is implemented and measured (pickleball: hips 10 -> 13 instead of 10 -> 12, Monday 49.3 min instead of 46.3).

### 2.5 Why VOL-07 is a row and R3-VOL-03 is a goal

The inventory files both under T7 ("what yields in a conflict"). They behave differently:

- **VOL-07 inside a day** is made a row (R4). The payoff is large: the slot vector of a group-day becomes a *function*
  of its total, `n_{s_i} = ⌊N/k⌋ + [i ≤ N mod k]` (SF-3), "no slot ever loses a set" follows (3.2), and the planner can
  never buy minutes by loading the cheap isolation instead of the lift that matters most (the reason the coach gave for
  the rule). The price is that a set which would fit only on the cheaper exercise of the day is not placed. That price is
  *measured*, not assumed: the CI certifier also solves the model with the staircase as a tier and lists every intake
  where it would have kept a group or raised a peak (5.2).
- **R3-VOL-03 across days** does conflict with the tiers above it: a group whose Monday is full must be allowed to put
  its sets on Thursday, or it is dropped by a formula although a plan exists (an earlier audit measured exactly this:
  a strict even split fails to build 25 of 117 feasible cells, `design/_invalid_run1/judge3/ladder_summary.out.txt`).
  So evenness is tier L7a: it holds whenever it is free and yields to the keep vector, the minutes and the peak. The
  certificate reports every uneven pair with the row that forced it.

### 2.6 Size

| | Reference model (every week) | Compact model (epoch weeks, section 3.4) |
|---|---|---|
| pickleball 2 x 45, N = 12 | 18 slots x 12 weeks + structure ≈ 320 integers | **130 integers, 351 rows** (measured) |
| swimmer 3 x 60, N = 12 | 27 slots x 12 ≈ 480 | **190 integers, 505 rows** |
| template grid, worst cell (6 days) | 60 slots x 12 ≈ 900 integers, 4,000+ rows | **235 integers, about 640 rows** (median 151 / 420) |

The reference model is not solved at run time. An earlier audit in this repository built it on the research kernel and
measured 0.5-0.7 s per node and no plan in 40 nodes (`design/_invalid_run1/judge3/monolith.out.txt`, 460 variables,
1,690 rows). It stays as the definition, and as the model the CI certifier solves with HiGHS (section 5.2).

---

## 3. Three exact reductions

Each reduction is a statement with hypotheses, because every false guarantee found so far in this project came from a
hypothesis nobody wrote down.

### 3.1 Epochs: floors, minutes and caps are checked on a few weeks and hold on all

**Lemma (sandwich).** Fix the structure (`u`, `q`, `p`, `c`). Let week v be at or after week w, and let
`x^w ≤ x^v` componentwise. If v **dominates** w in cost - `F_{d,w} ≤ F_{d,v}` for every day and `τ_{s,w} ≤ τ_{s,v}`,
rest_{s,w} ≤ rest_{s,v} for every slot - then `Min_{d,w}(x^w) ≤ Min_{d,v}(x^v)`: the DEF-09 day minutes are
non-decreasing in every set count, every per-set time, every rest and every fixed block. Likewise every upper row with
non-negative coefficients (ceilings, per-session sets, counts) holds at x^w if it holds at x^v, and every lower row with
non-negative coefficients (floors) holds at x^v if it holds at x^w.

*Use.* Sets never drop (R3), so with monotone costs only two weeks carry rows: **week 1** (floors) and **week N**
(minutes, ceilings). The compiler computes the epoch set from data, not from luck:

```
timeEpochs  = { last week of exercise block e : no later epoch dominates it in cost }  ∪ { N }
floorEpochs = { first week of exercise block e : credits changed against the previous block } ∪ { 1 }
```

A week that is not dominated (a bodybuilder's first exercise block is 50 % unilateral, so its sets cost more than the last
block's; a test week if tests count inside the limit) becomes one more epoch with its own set variables, linked by
`n_{s,first} ≤ n_{s,epoch} ≤ n_{s,N}`. For the three samples the epochs are {1, N}: the swimmer's costs rise (VOL 3
strength rest on the squat and the deadlift from week 9, more Olympic sets), the others are constant.

*Not covered by the lemma, handled elsewhere:* the staircase (3.2), the step rules (3.3), two-sided ratio rows
(a bilateral share of 0.80 ± 0.03 is not preserved along a monotone path, so ratio targets are tiers on exercises, never
hard rows on sets).

### 3.2 Placement: the weeks between two epochs need no solver

Inside a group-day, R4 leaves exactly one slot vector per total (the staircase). So between the week-1 vector and the
peak vector of a group, a plan is a sequence of single added sets, each of which names a **day**; inside the day the
slot is forced, and it is the coach's VOL-07 rule ("the first exercise below the first one's sets, else the first").

**Lemma (any order is legal).** Let x¹ ≤ x^N be the epoch vectors and let each week's vector be obtained from the
previous one by adding sets to group-days that are still below their peak. Then every week's vector is a staircase in
every group-day, lies between x¹ and x^N, and by 3.1 satisfies the floors, the minutes and every cap of its week.
No choice of days can get stuck: a group that still has sets to add has a day below its peak.

So the *which day* choice is free of feasibility concerns, and it is given to the coach's rule (R3-VOL-03): the exposure
with the fewest added sets takes the next one, the earlier day on ties. Every added set carries a why-record
("week 6: +1 hips -> Thursday (the exposure that is behind) -> Romanian deadlift (first exercise)").

### 3.3 The stairway: an exact dynamic program on the placed weeks

After the epochs, each trained group g has a week-1 total `S̃_g`, a peak `P_g` and `u_g = P_g − S̃_g` sets to add.
What remains of the whole-block model is rows R11 and R12 and the schedule tier L3s, and all of them depend only on the
weekly group totals. That subproblem is solved exactly:

- state = (week, sets still to add per group, was the previous week flat);
- transition = the set J of groups that step this week, legal iff `|J| ≤ max(1, ⌈0.10·Tot_{w−1}⌉ − 1)` - the 10 % rule
  **on the total really placed in the previous week**, which is the form the coach's rule has (an earlier audit showed
  that taking the limit from the *planned* curve, as the research flow does, breaks the rule in small plans);
- cost = the lexicographic tuple of L3s; the "ideal week" of each added set is the week the coach's λ-curve, rounded half
  up, reaches it (SF-1), with λ re-solved on (S̃_g, P_g) by bisection using multiplication only.

Measured: 30-1,272 states on the sample runs, 2-33 ms including placement and the certificate. For 8 groups with long
climbs the state is the *sorted* vector of sets left (the groups are interchangeable for the total rule; who steps is then
a transportation problem), which the earlier audit measured at 0.2 ms median, 13 ms worst (`stairway_exact.mjs`);
a state budget with a fixed fallback order (largest remaining first) bounds the work.

**The link back to the epoch model.** The epoch model must only produce endpoints the stairway can schedule.
Necessary rows are in the model (`u_g ≤ N − 1`, R13). The total rule is not a linear row on the endpoints, so it is
handled as branch-and-check: if the dynamic program finds no schedule for an incumbent, the exact cut "total added sets
≤ D − 1 unless week 1 holds more sets" is added and the tier is re-solved. This is finite (D drops) and rare: the
dynamic program found a schedule for every plan of the grid of section 6.2, so the cut was never needed (the prototype
reports such a failure instead of adding the cut).

### 3.4 The compact epoch model (what the kernel solves)

Rows R1-R10, R13-R18 on the epoch weeks only, `n_{s,1} ≤ n_{s,N}`, and the tiers L1a-L9 except L3s. With epochs {1, N}:
two integers per candidate slot, two per pair, one binary per group, group-day, slot, pair, cut and pattern candidate.

**Theorem (the reductions are exact).** Assume (i) the hypotheses of 3.1 for the chosen epochs, (ii) the schedule tier L3s
depends on the weekly group totals only. Then: the epoch model has a solution iff the reference model has one; for every
optimal solution of the epoch model, the stairway of 3.3 and the placement of 3.2 extend it to an optimal solution of the
reference model for the tier order of 2.4; and the certificate of 4.8 checks that extension row by row.
*Proof sketch.* Restricting a reference solution to the epochs satisfies the epoch rows (they are a subset, plus rows
implied by R11). Conversely the stairway returns totals between the endpoints satisfying R11-R12 (or the cut removes the
endpoint), placement realizes them (3.2), and 3.1 gives every remaining row in every week. All tiers except L3s read
only epoch quantities; L3s is optimized exactly on the endpoints the earlier tiers fixed.

### 3.5 What is monotone, exactly

Let `k(μ)` be the keep vector at session length μ. Because candidate slots do not depend on μ and a longer session only
raises right-hand sides, the feasible set grows with μ, so **`k(μ)` never gets lexicographically worse when minutes are
added** (a maximum over a larger set). The same holds for one more day when the larger template contains the smaller
one's day types. What does *not* follow is "no group is ever untrained by more time": a higher-priority group that newly
fits may push a lower one out. None of the minute ladders of section 14 shows it, but an earlier audit of the research
oracle found it in 5 of 268 five-minute steps (40 min kept calves, hips, chest; 45 min kept calves, hips, quads). That
is the coach's priority order at work, and the offer text must say it as a trade (section 8).

---

## 4. Algorithms

### 4.1 Compile: intake to instance

```
compile(intake, model):
  derive level, family, profile, modifiers, keep order π, S_g / C_g / F_g / mc_g          # intake.mjs, DER-01..09 (kept)
  blocks, exercise blocks, stages, test weeks                                              # shape.mjs (kept)
  for each main day: candidate slots = ALL stations of the day type (session order)        # never filtered by minutes
       each slot: pick + time class + credit class per exercise block                      # select.mjs on the uncut layout
       fixed blocks with minutes per week (warm-up, skill, core pair, athletic, power, joint care, WOD, aerobic add-on)
  legal pairs (template superset tags that pass T0-SES-16), work-lift partners (R6)
  room-cut ladder of the family (rules.cut_order.*), with the minutes each cut frees per day
  epochs by the dominance test of 3.1
  rows from the catalogue + the coach rule pack; user edits as fixed values (T1-POL-14)
```

The laterality of a pick changes its minutes per set (unilateral 3.0 vs bilateral 2.25), so the pick is part of the
candidate slot *before* the model is built; this removes the "probe picks vs real picks" drift of the current engine.
Where the coach allows either laterality, both are offered as **variants** of the slot and the model chooses (section 10).

### 4.2 The keep vector: one exact question per group (tier L1a)

```
keepVector(M):                                   # M = the compact model, all rows, no objective
  fixed = {}
  for g in π:                                    # Focus and pinned groups first, then the keep order
      r = feasible?( M + fixed + {y_g = 1},  other groups free, tried "off" first,  budget B )
      if r = FITS (witness re-checked in integers):   fixed += {y_g = 1};  start = witness
      if r = PROVEN NOT TO FIT:                        fixed += {y_g = 0};  reason[g] = explain(g)          # 4.10
      if r = UNKNOWN (budget):   retry with the next search order and 4 x the budget, at most 3 times;
                                 still unknown -> fixed += {y_g = 0}, plan.proven = false, reason[g] = "not_proven"
  return fixed, start
```

Keeping g iff the answer is yes is, by definition, the lexicographic maximum of `(y_{π_1}, …)`: this is pre-emptive goal
programming with one binary goal per level. It is also literally the coach's sentence ("big movers first ... a group is
kept only if every kept group still meets its minimums"). Two things make it sound where the current engine is not:

- the question is asked of the **whole** model - days, exercises, pairs, cuts and both epochs are free in every question,
  so "does not fit" means no plan exists, not "the first packing I tried failed" (RC3, RC4);
- three verdicts. *Unknown* is never read as *does not fit*. The plan then says "not proven" for that group and CI treats
  it as a failure of the budget, not of the client. (No question of any measured run came back unknown, so the retry
  ladder is specified, not exercised.)

*Measured (section 6.2):* every question on the template grid is decided, in about 60 nodes a plan at the median. The
same decision posed as one weighted objective `max Σ 2^{n−i} y_{π_i}` and searched depth-first is fragile
(`design/milp_proto/exp_t1.mjs`, 3,000-node budget): athletic 3 x 75 L3 returns *nothing* at 3,001 nodes as one objective
and takes 3 + 13 + 25 + 46 + 23 + 44 nodes as six questions; fat-loss 6 x 45 L2 and L3 need 1,893 and 1,849 nodes as one
objective and at most 502 in any single question. (A first grid run with the weighted form, before the staircase rows
were tightened, hit the budget in 5 of 361 cells.) A feasibility question stops at the first plan or the first
contradiction; an optimization has to disprove every better combination at once.

### 4.3 The remaining tiers

```
lexSolve(M, tiers, start):
  for tier in [L1b, L1c, (L3f), L4, L5s, L5a.., L5c, L6, L7a, L7b, L8, L9]:
      (value, sol, status, bound) = minimize( tier.objective over M, start = previous sol, budget B_tier )
      M += { tier.objective ≤ value }                 # exact: objectives are integers, no tolerance
      record status ∈ { proven, best found (bound) }
  return sol
```

- The previous tier's solution is always a feasible start, so a tier can never come back empty (the research chain could:
  "no solution" after 50,001 nodes on a model whose witness had just been found).
- A tier that hits its budget keeps its best solution and its bound (the root LP bound, or the open-node bound of a
  best-bound search); the plan is still legal on every row, and the certificate says which tier is "best found" and how
  far the bound is (for L5a: at most that many sets). The prototype records the status only.
- Leximin for L5a without weights: minimize the worst shortfall, then for ℓ from that value down to 1 minimize the number
  of trained groups whose shortfall is at least ℓ. Each is a count over at most 8 binaries, branched in keep order.
- L9 fixes the remaining free values one at a time in a fixed variable order (at this point almost everything is forced;
  the prototype uses one weighted tier).

### 4.4 The kernel

```
solve(M, objective|none, start, budget):               # depth-first branch-and-bound
  propagate bounds to a fixpoint (integer arithmetic; exact; infeasible -> prune)
  LP relaxation of the node (bounded dual simplex) -> infeasible: prune;  ⌈LP value⌉ ≥ incumbent: prune
  all integers whole -> re-check every row in integers -> new incumbent, objective row tightened to value − 1
  else branch on the first fractional variable in priority order:
        who is trained ≻ pattern stations ≻ cuts ≻ days ≻ exercises ≻ pairs ≻ sets (keep order, peak before week 1)
  verdict: OPTIMAL | INFEASIBLE | FEASIBLE (budget, incumbent kept) | UNKNOWN (budget, nothing found)
```

- **Budgets are node counts**, never milliseconds (`Date.now()` and `performance.now()` are banned in the engine anyway):
  a slow phone prints the same plan as a fast laptop.
- **Every "fits" is an integer fact**: the witness is re-evaluated row by row in whole numbers. **Every "does not fit"
  should be one too**: for the LP prunes the design adopts certified pruning - round the LP's row multipliers, evaluate the
  weak-duality bound in exact integer arithmetic, and branch instead of pruning when the proof fails (Neumaier and
  Shcherbina 2004; an earlier audit here re-proved 19,160 of 19,160 prunes at 2 % extra time,
  `design/_invalid_run1/judge2/cert_audit.out.txt`). The prototype does not have this yet; its "infeasible" verdicts rest on
  the floating-point LP with integer coefficients of at most 105 per row (time) and 4 (credit) and one scaled row (R13).
- **Part bounds** (optional): a sum objective that splits by day or by group is bounded part by part first, and
  "part ≥ its own minimum" is added as a valid row. Measured: the tier itself then closes much faster (aesthetics 4 x 45 L2:
  312 -> 52 and 295 -> 30 nodes) but the part solves cost more than they save with a depth-first search, so it is off by
  default and kept for the best-bound search of the hardening list.

### 4.5 Stairway (tier L3s)

```
stairway(lines {S̃_g, P_g}, N, Tot_1, order = [flat, land, flat2, shape, over7]):
  ideal[g][k] = first week whose rounded λ-curve value reaches S̃_g + k        (λ by bisection, multiplication only)
  go(w, rem, prevFlat):                                                        # memo on (w, rem, prevFlat)
      cap = max(1, ⌈0.10·Tot_{w−1}⌉ − 1)                                       # Tot_{w−1} = Tot_1 + sets placed so far
      for every set J of groups with rem > 0, |J| ≤ cap, in a fixed order:
          cost = [ flat week?, (w = N) lines that do not step now, flat after flat?, Σ_{g∈J} |w − ideal|, |J| above 7 %? ] + go(w+1, rem − J, |J| = 0)
      keep the lexicographically smallest cost (first found on ties)
```

The order of the cost tuple is data. Default: fewest flat weeks, then most lines landing in week N, then no two flat
weeks in a row, then nearest the coach's curve. "Landing first" is one switch (section 15, decision D4).

### 4.6 Placement

```
for w = 2..N, for each trained group in keep order, while it is below its total of week w:
    day  = among its days still below their peak: the one with the fewest sets added so far; ties -> the earlier day
    slot = the first exercise below the first one's sets, else the first      (VOL-07; forced by R4)
    add the set; why.push({week, group, day, slot, rule: 'R3-VOL-03 / VOL-07'})
```

### 4.7 Athletic doses

Section 9. Station sets are model variables; per-set doses are a small exact dynamic program per key.

### 4.8 Certificate

For every week: day minutes re-costed from the slot vector with the one time function; credited floors; ceilings;
staircase; slot never loses a set; vector between the epochs; group step; the 10 % rule on consecutive placed totals;
peak reached in week N. In integers, no tolerance. A plan whose certificate fails is a defect of the planner and is not
returned (the engine falls back to the previous tier's solution and reports `planner.certificate_failed`).

### 4.9 Offers (R3-SES-02 step 1)

```
offers(intake):
  for μ in the legal lengths (30, 45, 60, 75, 90, 105, 120) and for days + 1 (the template the intake would get):
        k[μ] = keepVector(compile(intake with μ))            # tiers L1a-L1c only
  show the smallest change that makes the keep vector lexicographically better, and say what it trades
  block toggles: the same question with one fixed block switched off (the room-cut ladder in reverse)
```

Seven lengths, so all seven are solved (no binary search, no rounded arithmetic that proposes 65 or 70 minutes).
Every offered schedule is a valid intake and produces exactly the stated keep vector, because it *is* that solve.

### 4.10 Exact reasons (R3-SES-02 step 2 "say why")

```
explain(g):   M' = M + {kept so far} + {y_g = 1}                 # proven infeasible by 4.2
  families = the catalogue rows of M', grouped by rule id and scope (a day's minutes in an epoch, a group's floor, ...)
  for f in families, rules a person cannot change first:
        drop f;  if M' is still infeasible: leave it out   else: put it back, f ∈ conflict
  return conflict                                                # a minimal set of rule families that cannot hold together
```

A deletion filter over rule families: the result is irreducible (removing any one member makes the group fit), and the
order makes it a *preferred* explanation - definitional rows are never candidates, and minutes, floors and climbs are
tested last, so they stay in the answer whenever they can. Each test is one feasibility question. Measured for a whole
explanation: 18-304 nodes on the 2- and 4-day samples (1,537 in one variant), 1,700-3,400 nodes (16 s) on the swimmer,
and over 30,000 nodes (minutes) on the swimmer variant with four kept groups. So explanations are computed on demand, under their own budget, and the
production version uses QuickXplain's divide-and-conquer (about k·log2(n/k) questions for a conflict of k families out
of n, instead of n).

---

## 5. Solver strategy

### 5.1 Decision: an owned pure-JS kernel; HiGHS only as a development-time certifier

| Criterion | Own kernel (propagation + LP bound + branch-and-bound) | HiGHS via `highs` (MIT, wasm 3.5 MB) |
|---|---|---|
| Binding engine rules (CONTRACTS 1.2, CONTRIBUTING: plain ES modules, **no npm dependencies, no build step**, runs unchanged in a browser, synchronous `generate()`) | fits | breaks three: a dependency, a binary artefact, asynchronous start-up |
| The decision that must be exact (keep vector) | measured: every grid question proven, median 63 nodes per plan | not needed |
| Determinism | same bytes on every engine by construction (IEEE + − × ÷ only, fixed rules, node budgets) | single-threaded build is deterministic per version; must be pinned and re-verified |
| "Does not fit" as a proof | certified pruning on our own rows (4.4) | no certificate for MIP infeasibility; IIS is LP-only |
| Explanations | conflict over catalogue rule ids, same kernel | would still need our deletion filter around it |
| Lower-tier optimality proofs in the tail | budgeted: "best found" in 1.6-3.3 % of grid cells per tier at 3,000 nodes, and slow (6.2) | very likely proven and fast; **not measured** (installing a package was not authorized in this run) |
| Size shipped | about 20 kB of source | 3.5 MB + 168 kB |

So: **ship the own kernel; use HiGHS in CI** (a dev dependency under `tests/`, after the maintainers approve it) to solve
the reference model (2.2) and the compact model for every benchmark intake and assert the same tier values. That is where
a strong solver earns its place: checking us, not running on a phone.

### 5.2 What the CI certifier does

1. Emits each benchmark intake's compact model and reference model as LP text from the same catalogue.
2. Solves tier by tier with HiGHS, freezes exactly, and compares every tier value with the planner's.
3. Solves the reference model with the staircase rows relaxed (VOL-07 as a tier) and reports every intake where that
   would have kept one more group or reached a higher peak: this *measures* what making VOL-07 structural costs (2.5).
4. Stores, for every grid cell, the proven keep vector. The run-time planner must reproduce it within its node budget;
   a cell that does not is a release blocker (section 13).

### 5.3 Hardening list for the kernel, with what the measurements say

| Item | Why (measured) |
|---|---|
| Warm-started bounded dual simplex (keep the parent's basis) | the prototype restarts the LP at every node: 40-200 pivots per node; a child differs from its parent by one bound |
| Certified pruning | makes "does not fit" independent of floating point (4.4) |
| Staircase rows in the exact form `n_1 ≥ … ≥ n_k ≥ n_1 − 1` | with only neighbouring rows the model admitted 4/3/2, placement left the staircase, and proofs were slower; found by the certificate on the grid (5 failing cells), fixed, 0 since |
| Sequential questions for the keep vector | 4.2 |
| Best-bound node selection with depth-first dives + part bounds for the sum tiers | the residual tail is in optimization proofs (L4, L5a), not in feasibility |
| **Not** generic Chvátal-Gomory rounding cuts on the time rows | tried on the research slot model (`exp_cuts.mjs`): 581 -> 463 nodes on one cell, 2,904 nodes proven -> not proven at 3,000 per tier on another, no change on a third. The hard part is which group-day is open, not the leftover minutes of a knapsack |
| A fixed portfolio of three search orders with growing budgets for UNKNOWN | cheap insurance; an earlier audit found the same model solved in 17-28 nodes under five orders and 190,000 under a sixth |

---

## 6. Complexity and expected run time

### 6.1 Complexity

| Stage | Work | Bound |
|---|---|---|
| compile | linear in stations | microseconds |
| keep vector | at most 8 feasibility questions on a model of 130-235 integers | NP-hard in theory (it contains knapsack); bounded by the node budget per question; measured median 63 nodes per plan, maximum 809 |
| tiers L1b-L9 | about 10 integer programs on the same model, each started from a feasible solution | budget per tier; anytime |
| stairway | states ≤ Π_g (u_g + 1) x N x 2, transitions ≤ 2^{groups}; sorted-vector form for 8 long lines | measured 30-1,272 states on the samples |
| placement, certificate | O(N x slots) | 2-33 ms measured, stairway included |
| offers | 7 lengths x the keep vector (+ days + 1) | 8 x the keep-vector cost |
| explanation | one feasibility question per rule family in the model (30-60) | the costliest step; computed for the first two groups left out, on demand for the rest |

### 6.2 Measured

The three samples (full tier stack, explanation and offers apart):

| Sample | Integers / rows | Nodes (all tiers) | LP pivots | CPU | Proven |
|---|---|---|---|---|---|
| pickleball 2 x 45 | 130 / 351 | 59 | 2,258 | 0.27 s | all tiers |
| CrossFit class 4 x 60 | 130 / 354 | 79 | 3,597 | 0.34 s | all tiers |
| swimmer 3 x 60 | 190 / 505 | 377 | 27,299 | 1.44 s | all tiers |
| swimmer 3 x 60 without the VOL 3 strength rest | 190 / 505 | 665 | 56,512 | 2.61 s | all tiers |

Offers (7 lengths, tiers L1a-L1c): 9-87 ms per length for pickleball, 4-93 ms CrossFit, 6-835 ms swimmer; all proven.

The template grid (`grid.mjs`: the research instance builder on `model/templates.json`, 6 families x 2-6 days x 30-120 min
x L1-L3, tiers L1a, L4, L5s, L5a, 3,000 nodes per question or tier), then stairway, placement and certificate:

| Quantity | Result |
|---|---|
| Cells | 630; 21 cannot be built by the research builder (`hybrid_crossfit` has no 4-day day types); **609 solved, every one returned a plan** (in 15 of them no group can be trained directly at that length) |
| Model size | integers: median 151, maximum 235; rows: median about 420, maximum about 640 |
| **L1a keep vector** | **609 of 609 proven; 0 unknown; 0 budget hits.** Nodes per plan, all questions together: median 63, 90th percentile 212, 99th percentile 624, maximum 809 |
| L4 minutes over the chosen length | proven in 599 (98.4 %); "best found" at 3,000 nodes in 10 |
| L5s sets over 11 a session | proven in all 205 cells where the row can bind |
| L5a worst peak shortfall | proven in 589 (96.7 %); "best found" in 20 |
| Cells with any tier "best found" | 28 of 609 (4.6 %): hybrid 5 x 60 (2), and the fat-loss and no-equipment families (13 each; their templates are identical), 4-6 days x 45-75 min |
| Stairway + placement + certificate | 594 plans with at least one trained group: **certificate PASS 594, FAIL 0**; the dynamic program found a schedule every time |
| LP pivots per node | median 47-67 by tier (the LP is rebuilt at every node) |
| CPU for these four tiers, loaded laptop | median 0.11 s, 90th percentile 3.3 s, 99th percentile 24.5 s, maximum 42 s. 2-4-day plans: median 0.05 s, 90th percentile 1.7 s; 5-6-day plans: median 0.32 s, 90th percentile 5.3 s. 129 cells took over 1 s, 45 over 5 s |

Reading. (1) The decision the coach cares most about - who is trained - is exact everywhere, in tens to hundreds of
nodes. (2) The tail is in *optimization proofs*: showing that the peak cannot be one set higher (L5a) or the overrun one
minute lower (L4). Those cells still return a certified plan, flagged "best found". (3) The sum tiers are the most
expensive to prove. On four hard aesthetics cells at 5,000 nodes a tier (`exp_sum_tiers.out.txt`): 3 x 60 L2 and 4 x 45 L2
proven on every tier (2,858 and 1,095 nodes, 3.1 and 1.9 s), 4 x 60 L3 proven (6,780 nodes, 25 s), 4 x 60 L1 "best found"
on total shortfall and week-1 distance. (4) **The prototype kernel is not fast enough for the tail**: one cell in five
needs more than a second for four tiers. That is a statement about a cold-started dense LP at 4-26 ms a node, not about
the model; 6.3 says what the production kernel must do, and what happens until it does.

### 6.3 Expected run time in a browser

- The prototype costs **about 4 ms per node** on the laptop for 130-190 integers (38-85 LP pivots per node on a dense
  tableau rebuilt from scratch, 0.06-0.12 ms a pivot), 6 ms per node at 226 integers, and 26 ms per node on the worst
  6-day cell (210 pivots a node).
- The three samples: 59-377 nodes, 0.27-1.44 s for the full tier stack on the laptop. On a mid-range phone at 4 x slower
  (assumption) that is 1-6 s with the prototype kernel: usable for the 2-day plan, too slow for the swimmer.
- What the production kernel must do: keep the parent's basis (a child node differs by one bound, so a handful of dual
  pivots instead of 40-200: an expectation from the structure of the search, **not measured**), and search best-bound
  first on the optimization tiers. If that gives 5-10 x (to be measured), the samples cost 0.03-0.3 s on the laptop.
- Until then, and as the permanent safety net, the budget decides: **2,000 nodes per keep question** (2.5 x the largest
  whole-plan total measured), **500 nodes per lower tier**, 8,000 per plan. With those numbers the keep vector is still
  proven in every measured cell; a lower tier that runs out is "best found". The engine stays synchronous and the page
  calls it in a Web Worker; offers and explanations are computed after the plan is shown, on demand.
- 5-6-day templates repeat day types (A1 = A2), so their models are symmetric; R4 breaks the symmetry inside a day, the
  evenness tier between twin days (the grid ran without it). These are the models where the tail lives and the first
  target of the hardening list.

No phone was measured. HiGHS was not measured.

---

## 7. Determinism

- **Whole numbers decide.** Sets, 3-second time units, quarter credits; tier values are integers and freezes are exact
  rows. No `CLIMB_TOL`, no epsilon comparisons on set counts.
- **Floating point only orders the search.** The LP proposes bounds and branching variables; incumbents are re-checked in
  integers; prunes are certified (4.4). `Math.pow / exp / log` are not used anywhere (λ by bisection with multiplication).
- **Budgets in nodes**, fixed branching order (keep order, then ids), fixed subset order in the stairway, first-found on
  ties, no `Map` or object-key iteration in a decision path.
- **A canonical last tier** (L9) makes the plan a function of the model, not of the kernel version: a kernel refactor that
  changes pivoting cannot change a published plan whose tiers are proven.
- **What is not canonical, and says so:** a tier that ends "best found" depends on the budget and the search order. The
  certificate lists it, and the benchmark counts it.
- *Measured:* two runs of the pickleball sample are byte-identical (CPU lines apart). The research kernel this builds on
  was byte-identical between V8 and JavaScriptCore; the new code uses the same arithmetic rules but was not re-run in
  JavaScriptCore (it reads files through `node:fs`).

---

## 8. Infeasibility, the R3-SES-02 way

| Coach step | In this design |
|---|---|
| Step 0: the full level plan when it fits | every group answers "fits" and L5a = 0: no warning (T1-POL-03) |
| Step 1: tell up front and offer | `time_check` is built from the keep vector, the conflicts and the offers of 4.9 before week 1 is rendered (T1-POL-04) |
| Step 2: keep the time, train fewer groups directly, big movers first | 4.2; groups not kept keep their compound credit and are listed with it (T1-POL-10); the upper partner of a work lift and, where room is left, one 2-set station per big mover stay (R6, T1-POL-07) |
| Step 3: supersets | every legal pair is available to the model; the pairs still on after tier L7b are exactly the ones the fit needs and are marked "needed"; the others are printed as recommendations with the minutes they save (T1-POL-11) |
| Step 4: the stairway climbs on every trained group | R10 is a row; the peak is what the minutes hold (L4, L5a); the schedule has the fewest flat weeks those sets allow (L3s) |
| "They should be able to turn off that day's athletic or core training" | toggles are fixed values; the offer list says what each toggle buys, from a re-solve (T1-POL-14) |

**The user-facing text is assembled from the certificate, never written by hand.** Keys (EN / ES in `model/i18n`):

| Key | English | Español |
|---|---|---|
| `time.told` | Your {days} x {min} minutes hold {n} muscle groups at a full dose: {kept}. | Tus {days} x {min} minutos alcanzan para entrenar a dosis completa {n} grupos: {kept}. |
| `time.pattern` | {groups} keep one 2-set movement each ({stations}). | {groups} conservan un movimiento de 2 series cada uno ({stations}). |
| `time.cut` | To make room, {cut} - you can switch it back on. | Para hacer espacio, {cut}; puedes volver a activarlo. |
| `time.why` | Why not {group} as well: {reasons}. | Por qué no también {group}: {reasons}. |
| `reason.T1-POL-02` | {day} is full in {week} | el {day} está lleno en {week} |
| `reason.T2-FLR-01` | {group} needs its {F} weekly sets | {group} necesita sus {F} series semanales |
| `reason.T3-STW-02` | {group} has to climb at least {mc} sets | {group} debe subir al menos {mc} series |
| `reason.T0-SES-06` | the {lift} stays on its day | el {lift} se queda en su día |
| `reason.T0-SES-08` | the {lift} keeps its {partner} | el {lift} conserva su {partner} |
| `reason.T0-SES-11` | calves need every leg day | las pantorrillas necesitan cada día de pierna |
| `reason.T0-SES-15` | an exercise holds at most {max} sets | un ejercicio admite como máximo {max} series |
| `offer.longer` | {days} x {min2} minutes also trains {added}{trade}. | {days} x {min2} minutos también entrena {added}{trade}. |
| `offer.trade` | ; {lost} then counts from compound credit only | ; {lost} pasa a contar solo por crédito compuesto |
| `offer.toggle` | Switching off {block} on {day} frees {m} minutes{effect}. | Desactivar {block} el {day} libera {m} minutos{effect}. |
| `supersets.needed` | Do {a} and {b} back to back to finish on time ({m} min saved). | Haz {a} y {b} seguidos para terminar a tiempo (ahorras {m} min). |
| `plan.not_proven` | We could not finish checking whether {group} fits; it is left out for now. | No pudimos terminar de comprobar si {group} cabe; por ahora queda fuera. |

Rendered for the pickleball sample (from the run in section 14.1):

> Your 2 x 45 minutes hold 2 muscle groups at a full dose: calves and hips. Quads, back and chest keep one 2-set movement
> each (step-up, row, chest press). To make room, the Olympic lift is off and joint care moves to the optional day - you can
> switch them back on. Why not quads as well: Monday and Thursday are full in the last week; calves, hips and quads each
> need their weekly sets and have to climb; the step-up stays on its day and keeps its row. 2 x 60 minutes also trains quads
> and back. 2 x 75 minutes does it with the Olympic lift and the joint care back on the day.

---

## 9. Athletic budgets and Receive-Create stages

**In the model.** Athletic work never credits a muscle (DEF-03) and shares only the minutes:

| Item | Formulation | Rule ids |
|---|---|---|
| station on / off | the room-cut ladder `c_j` (stay-active: Olympic over budget, joint care to the optional day, ankle block, second station ...); competitive athletes: the sport's tracks are not on the ladder | T1-POL-06, T1-POL-13 |
| station sets | `a_{t,e}` ∈ [2, 4] per exercise block, `a_{t,e} ≤ a_{t,e+1}`; minutes `a·(work + rest) + κ` enter `F_{d,w}`, so athletic growth competes for minutes exactly | T3-ATH-01, T6-CNT-06 |
| capacity for the budget | per key k and exercise block: `Σ_t a_{t,e}·dose^max_t ≥ Â_{k}(last week of e) − gap_{k,e}` | T5-ATH-02 |
| budget cap | `Σ_t a_{t,e}·dose^min_t ≤ 1.25·Â_k + dose^max` | T5-ATH-01 |
| session and week limits | contacts per session ≤ 80 / 100 / 120 by level; Olympic exposures ≤ 4; stations per day by bucket; inside the 12 | T0-ATH-01, T0-ATH-03, T0-SES-13, T6-CNT-07 |
| tier | `min Σ gap_{k,e} / Â_k` at L5h: before the resistance peaks for competitive athletes, after them for everyone else | T5-ATH-02 (order PROPOSED in the inventory) |

**After the model: doses per week.** Per-set doses cost no minutes (a set of 5 or of 8 contacts is one set), so they are
realized exactly afterwards, per key: the weekly dose follows the target ramp where the stations can hold it, is clipped
to the suffix minimum of the weekly capacities (a week never plans what a later week cannot hold), never drops, and is
shared over the stations' sets by a house-monotone rule (the station that is behind first). The end-test week holds the
week before. Where capacity is below target the plan says so with the number: this is where the diagnosis found 16-20 %
of the soccer jump target; here it is a visible gap the model traded against named minutes, not a surprise.

*Measured on the samples (stations fixed at their current sets, see 14):* pickleball throws 40 of 51-69 (one throw
station x 2 sets holds 40: "told"), ankle contacts 35 -> 50 of 35 -> 73; swimmer throws and ankle contacts on target every
week, jumps 32 of 37-49 (two 2-set stations hold 32).

**Receive-Create stages** (T0-ATH-02) are a function of the exercise blocks: stage(e) from the approved week table,
majority of the block's weeks, ties lower, one step at a time (computed in `shape.mjs`, kept). The stage decides which
drills are eligible for an athletic slot in block e and their per-set dose bounds; it never changes inside an exercise
block because picks never do (T0-SES-14). The plyometric share (T3-ATH-02) is a soft row on the doses of the DP.

**What the prototype did not do:** it kept each station's sets as the current plans have them and did not let the model
trade a third throw set against a hip set. The rows above are the design; section 15 lists this as open work.

---

## 10. Blocks, variation and exercise selection

- **Several stairway blocks** (a year plan): solved in order; block b + 1 takes its starts from DER-09 (x 1.05, ceiling + 1)
  and is otherwise independent. Flat blocks (maintenance, pre-season, taper, in-season) have no stairway: their sets are a
  factor of a known week and one feasibility question checks the day minutes (the same policy applies when it fails).
- **Exercise blocks inside a stairway block.** Picks are fixed inside an exercise block and change by one or two details
  at its start (T0-SES-14, T8-VAR-02). `select.mjs` gives every candidate slot a pick per exercise block. If the change
  keeps the time class and the credit class (the usual case: grip, stance, implement), nothing changes in the model. If it
  swaps laterality or the rest class (an athlete's VOL 1 -> 2 -> 3), `τ_{s,w}` differs by block and the dominance test of
  3.1 adds the block's last week as an epoch.
- **An exercise added at an exercise-block start** (T6-CNT-04) would be a candidate slot whose first week is that block's
  first week: 0 sets before, 2 sets on entry. That is + 2 sets for its group in one week, which the placed step rule R11
  (one set a week below 29 sets) forbids. The two approved-with-our-numbers rules collide, so this design keeps the
  structure constant over the stairway block (an exercise the peak needs is in the plan from week 1 at 2 sets, as in the
  prototype) and lists the mid-block entry as a question for the coach: allow a + 2 step in the entry week, or let the
  new exercise take one set from its neighbour.
- **Slot variants.** Where the template says `laterality_dial` or the coach allows either pick, the slot carries variants
  (bilateral 2.25 min a set, unilateral 3.0; credit classes; a preference score). One binary per variant, exactly one when
  the slot is on. The laterality share (T8-BAL-01) is a deviation at tier L8, so the keep vector and the peak may override
  it and the certificate says when they did ("unilateral share 20 % instead of 50 %: the bilateral pick kept hips").
  *Measured:* giving the pickleball player's Thursday hinge a unilateral pick (3.0 min a set instead of 2.25) keeps the
  same two groups and the same two cuts but moves the hip sets to Monday (8 there, 4 on Thursday, instead of 4 and 8) and
  swaps the knee station for a shoulder press (`out_pickleball_unilateral_hinge.txt`). The pick's time class changes the
  plan, so it has to be in the model.
- **Selection after the plan** only resolves what does not change minutes or credit: the concrete exercise inside the
  chosen variant, near-duplicates, second-exposure differences (T8-VAR-01/03). The time class is pinned.

---

## 11. Coach rule packs

A rule is data in the catalogue; a coach's rule pack adds or re-ranks rows without code.

```json
{ "id": "COACH-glute-iso", "tier": "T0", "kind": "row",
  "why": "why.coach.glute_iso", "when": { "focus_includes": "glutes" },
  "sum": [ { "of": "sets", "slots": { "credit_class": "GLUTE_ISO" }, "weeks": "every" } ], "op": ">=", "rhs": 4 }

{ "id": "COACH-short-days", "tier": "T6", "kind": "soft",
  "sum": [ { "of": "exercises", "days": "main" } ], "op": "<=", "rhs": 6, "per": "day" }

{ "id": "COACH-pull-push", "tier": "T8", "kind": "soft",
  "sum": [ { "of": "credited", "group": "back" }, { "of": "credited", "group": "chest", "times": -1.2 } ], "op": ">=", "rhs": 0 }
```

- **Vocabulary:** sets, credited sets, exercises, minutes, athletic dose; filtered by group, slot tag, day, week
  (first, peak, every); linear sums, `≤ ≥ =`, a tier, a `when` clause over intake fields. Helpers linearize the common
  non-linear shapes (ratio, absolute deviation, "if trained then", counts).
- **Parameters** (the 55 tunables P-01..P-55) are values the compiler reads; changing a floor, a ceiling, the fit factor,
  the keep order or the stairway steps needs no row at all.
- **Layers** (generator spec): locked rows (LK01-LK18) cannot be relaxed or re-ranked; a rule pack may add hard rows, add or
  re-rank soft rows inside T4-T8, and change parameters inside their ranges.
- **A coach rule that cannot hold** is found by the same machinery: the keep-vector question fails and the explanation
  names the coach's row by id ("COACH-glute-iso | floor quads | Tuesday peak"). A hard coach row that makes the whole
  model infeasible is reported before any plan is built.
- **Safety net:** the build runs every rule pack through the property suite of section 13 with the pack's rows in the
  certificate.

---

## 12. Migration from the current engine

`generate.mjs` already injects its stages (`generateWith(deps, …)`, `REQUIRED_DEPS`), and the volume stage returns one
object. The planner enters behind that seam.

| File | Fate | Notes |
|---|---|---|
| `intake.mjs`, `shape.mjs`, `model.mjs`, `util.mjs` | **keep** | level, blocks, exercise blocks, stages, test weeks |
| `select.mjs` | **keep**, called earlier | picks per candidate slot on the uncut layout; time class pinned before planning |
| `timefit.mjs` | **becomes** `plan/time.mjs` | the one time function (integer units), used by model, dose, certificate, scorer |
| `week.mjs` | **keep the layout, delete the cuts** | `applyCuts`, `enforceAthleteCap`, `moveGroupsToOptional`, `ensureAthleticTracks` go; the layout only lists candidates and fixed blocks |
| `volume.mjs` | **replace** by `plan/*` | `planWeeklySets` survives as a thin adapter returning the same `VolumePlan` shape (`weeks[].sets_by_slot`, `supersets_on`, `est_minutes`, `time_check`, `offers`) |
| `budget.mjs`, `athletic.mjs` | targets **kept**, dosing **replaced** | `athleticBudget` targets feed section 9; `planAthletic` and the reconcile in `generate.collectWeek` go |
| `dose.mjs` | **keep**, constrained | reps / RIR / rest text from planned sets; reads the same per-set seconds |
| `validate.mjs` | **rewrite around the catalogue** | no exemption that is not a named parameter |
| `render.mjs`, `explain.mjs` | **keep** | new why-records fit the existing `why` arrays |
| `plan/2` schema | **unchanged** | additions: `time_check.proof` per tier, `time_check.conflicts`, `superset.needed` |

Steps, each scored on the benchmark before the next:

1. **M0** catalogue + time function + independent scorer; the old engine scored as the baseline.
2. **M1** planner in shadow mode behind `rules.planner.engine = "v04" | "exact"`: both plans generated, only the old one shown.
3. **M2** stairway + placement on the old engine's endpoints (smallest risk, removes most flat weeks).
4. **M3** keep vector, explanations and offers (the R3-SES-02 decisions).
5. **M4** candidates from the uncut layout; cuts removed from `week.mjs`; tiers L1b-L9.
6. **M5** athletic sets in the model; the reconcile removed.
7. **M6** old volume engine and the tests that assert its patches retired; each retired test is replaced by the
   catalogue row it was guarding or listed with the decision that made it obsolete.

Risk: the nine `review-*.test.mjs` files assert patch behaviour (E-11 states, the 0.5-set tolerance). They will fail by
design at M3-M4; the migration budget must include re-expressing them as rule-id properties.

---

## 13. Test strategy

**Kernel (unit).** Brute-force cross-checks on random lexicographic integer programs with a sound generator
(`Math.imul`-based, with an assertion on the distribution each test draws - an earlier audit found the research tests'
generator had lost its low bits); models with the real structure (time rows in 3-second units, quarter credits,
on / off links); LP against exact rational arithmetic on small cases; certified-prune checker.

**Reductions (property tests on random valid intakes and on the grid).**

| Property | Pass |
|---|---|
| P1 certificate: every row of the catalogue on every week | 0 violations, no tolerance |
| P2 sandwich: every week's slot vector between its epochs; staircase in every group-day | 0 |
| P3 stairway equals a brute-force optimum on small plans for the configured tier order; placed-week rules hold | equal / 0 |
| P4 keep vector equals exhaustive enumeration over all 2^n group subsets on small intakes (2-3 days) | equal |
| P5 keep vector at the 7 legal lengths never lexicographically worse with more minutes; same for days + 1 where templates nest | 0 violations |
| P6 every offered schedule, run as an intake, is valid and gives exactly the stated keep vector | 100 % |
| P7 every "does not fit" has a conflict; removing any one member of the conflict makes the group fit | 100 % |
| P8 tier freeze: changing a lower tier's objective never changes a higher tier's value | 0 changes |
| P9 no stage after the model changes sets or minutes: `est_minutes` = the re-cost of the printed items | equal |
| P10 determinism: two runs, and V8 vs JavaScriptCore, byte-identical | identical |
| P11 parameters inside their ranges (floor 8-12, fit 1.0-1.15, total rule 7 or 10 %, ceilings to 30): P1-P9 still pass | pass |

**Certified grid (CI).** The exact keep vector of every grid cell (families x days x minutes x levels x Focus x the
profile classes that change fixed blocks) is computed offline with a large budget and HiGHS as the second opinion;
the run-time planner must reproduce every cell inside its node budget. `unknown` anywhere is a release blocker.

**Golden tests.** The coach's worked examples as data: 12 v1.2 section 5.5 (pickleball 2 x 45: hips + pinned calves;
2 x 60 adds quads), section 5.1 (L1 aesthetics 4 x 60), his sheet sessions for the time function (BYOP day 1: 7 exercises,
19 sets, about 60 min).

**Benchmark (`design/bench/`).** The scorer reads only the plan and the catalogue. Thresholds for this planner:
floor misses 0; trained-not-climbing 0; days over the limit 0; 1-exercise trained groups 0; flat weeks of the total =
the arithmetic minimum for the plan's own endpoints; keep-order inversions 0 against exhaustive search; keep vector
proven in 100 % of plans; lower tiers "best found" counted and bounded (target under 5 % of plans with the hardened
kernel); p99 nodes inside the budget.

### 13.1 The diagnosis requirements (DR-1 .. DR-25), one line each

| DR | Status in this design |
|---|---|
| DR-1 one block-level model | yes (section 2); the prototype holds athletic sets fixed |
| DR-2 lexicographic tiers as data | yes (2.4), exact integer freezes, test P8 |
| DR-3 exact feasibility with the binding constraint | yes (4.2, 4.10); measured on the samples and the grid |
| DR-4 monotone in minutes and days | restated as it can be true: the keep vector never gets lexicographically worse (3.5, test P5) |
| DR-5 templates give patterns, not capacity | yes: uncut candidates, days are decisions; "each day keeps its pattern" is decision D10 |
| DR-6 no post-hoc repair | yes: after the solve there is only the certificate |
| DR-7 one unit of account | yes: quarter credits in every row, no tolerance |
| DR-8 integer stairway as constraints | yes (3.3); flat weeks equal the arithmetic minimum on the three samples |
| DR-9 progression when sets cannot climb | partly: the certificate marks the weeks without a set step so `dose.mjs` prints the rep / effort step; the composite index is not prototyped |
| DR-10 floors exactly | yes; below-floor training is one switch, off (D1) |
| DR-11 one time function | by design (`plan/time.mjs`, integer units); the prototype uses the per-class seconds of `rules.time_model`, not per-rep seconds |
| DR-12 day time is a hard capacity | yes (R7) with the fit factor as a parameter; test work-ups apart (D8) |
| DR-13 fixed blocks budgeted first and visibly | yes: listed with minutes in the instance; toggles are re-solves |
| DR-14 exercise counts | 2-4 a group, calves 1 and 12 + 2 are rows; counts by minutes are tier L6 (samples: 5 and 4 at 45 min, 5 / 5 / 4 at 60) |
| DR-15, DR-16 athletic co-planned and scaled | designed (section 9), not prototyped; the per-key doses are |
| DR-17 offers by re-solving at valid values | yes (4.9), measured |
| DR-18 priority-ordered selection, coach examples | 5.5 reproduced in structure (hips + pinned calves); 5.1 not run |
| DR-19 independent scorer | the catalogue is shared; the scorer lives outside the engine |
| DR-20 every decision explained | conflicts in rule ids, why-records per added set |
| DR-21 printed targets equal placed sets | yes: the plan prints what the model solved |
| DR-22 browser-ready, deterministic, about 1 s | deterministic: yes; 1 s on a phone: **not with the prototype kernel** (6.3) |
| DR-23 parameters as data | yes (section 11) |
| DR-24 keep what works | VOL-07 as a row, R3-VOL-03 as placement, picks fixed inside an exercise block |
| DR-25 benchmark and properties as the definition of done | section 13 |

---

## 14. The planner on the three hardest samples

Run with `node design/milp_proto/run_samples.mjs` (outputs saved as `design/milp_proto/out_*.txt`). "Hand simulation" here
means: the instance is written out by hand from the templates and the rules (`samples.mjs`), the decisive arithmetic is
shown so it can be checked with a calculator, and the prototype does the search and the proofs.

**What is in every instance.** Candidate exercises: the uncut day types of `model/templates.json` (`athletic.2`,
`hybrid_crossfit.4` variant `crossfit_style_bootcamp`, `athletic.3`). Minutes per set from `rules.time_model` (work + dosed
rest): bilateral compound 2.25, unilateral compound 3.0, isolation and calves 1.85, strength rest 5.25; changeover 1 min
(0.5 inside a pair); a pair saves the shorter rest of each shared round. Fixed blocks: warm-up 8, core opener as a pair
5.5, an athletic station of 2 sets 4.2-4.3, an Olympic lift 3.0 a set + 1, a joint-care item of 2 sets 3.7.
Starts, ceilings and floors from `rules.volume` with the client's modifier. Fit factor 1.10 (`rules.session.time_fit`).
Default readings of section 2.4. Test work-ups (10 min per tested lift, 6 for the jump test) are reported apart, as
`rules.tests.test_week_note` has them ("the rest of the test week stays as planned"); decision D8 in section 15.

**Limits of these runs.** Athletic stations keep the sets the current plans give them (section 9); the optional day,
Focus slots and the aerobic day are outside the model (they add room, never remove it); hips is one line (these three
clients are one-target profiles, DER-07); laterality of each pick is the template bucket's, except where noted.

### 14.1 Pickleball, 52 years, L1, knee pain, 2 x 45 min, 12 weeks

Keep order: calves (pinned for racket players 50+), hips, quads, back, chest, shoulders, triceps, biceps. Starts /
ceilings / floors: big groups 10 / 13 / 10 (stay-active x 0.8, lifted to the floor); quads 6 / 8 with no floor of 10
(knee pain x 0.6, DER-06); calves 6 / 8, floor 7 (DER-04 with 2 leg days). L1: 4 sets an exercise at most.

Fixed blocks before any cut: Monday 8 + 5.5 + throw 4.2 + Olympic lift 7 + two joint-care items 7.4 = **32.1 min**;
Thursday 8 + 5.5 + low box jump 4.3 + ankle hops 2.8 + Olympic lift 7 + joint care 7.4 = **35.0 min**. The limit is 49.5.
Room-cut ladder (stay-active order): Olympic lift off; joint care to the optional day; ankle hops off.

**The decisive arithmetic.**

- *Calves* (3 + 4 sets, one exercise a leg day): 6.55 and 8.4 min. Fits.
- *Hips with calves, no cut:* Thursday has 49.5 − 35.0 − 8.4 + 2.5 (the calf raise shares rests with a joint-care item)
  = 8.6 min; the smallest hip block there (deadlift 2 + leg curl 2) is 2 x 2.25 + 2 x 1.85 + 2 = 10.2. Does not fit.
- *One cut (Olympic lift off):* in the last week calves are 4 + 4, so Monday has 18.5 and Thursday 15.6 min. Hips need 12
  sets by then, and Thursday's deadlift keeps its chest press (2 sets inside the deadlift's rests: + 1.5). Thursday 3 + 3
  is 14.3 + 1.5 = 15.8 > 15.6; Thursday 3 + 2 is 13.95, which leaves 7 hip sets for Monday: 4 x 3.0 + 3 x 1.85 + 2 = 19.55 >
  18.5. Does not fit - by 0.2 and by 1.05 minutes.
- *Two cuts (joint care to the optional day):* Monday has 23.4, Thursday 20.5. Thursday deadlift 4 + leg curl 4 + chest
  press 2 = 18.4 + 1.5 = 19.9. Fits. Monday hips 2 + 2 = 11.7, and the room left takes the knee and pull stations:
  step-up 2 + row 2 as a pair = 12.5 − 4 = 8.5. Monday total 17.7 + 8.4 + 11.7 + 8.5 = **46.3**; Thursday
  20.6 + 8.4 + 19.9 = **48.9**. These are the last-week minutes of the table below.
- *Quads as a third group:* its knee lift keeps its row, and 3 + 3 sets with the row cost 18.05 min on Monday; that leaves
  5.35 for hips, whose smallest block is 11.7; all hips on Thursday is at most 4 + 4 = 8 < 10. Proven not to fit.

**Solver result** (130 integers, 351 rows; every tier proven; 59 nodes, 0.27 s CPU).

| Tier | Value | Nodes |
|---|---|---|
| L1a keep vector | calves fits (2 nodes), hips fits (8), quads no (1), back no (1), chest / shoulders no (0), arms: no station | 12 |
| L1b room cuts | 2: Olympic lift off, joint care to the optional day (ankle hops stay) | 17 |
| L1c pattern stations | back (row), chest (press), quads (step-up) | 1 |
| L4 minutes over 45 | 5.2 (week 1: 0; last week: Monday 1.3, Thursday 3.9) | 12 |
| L5a / L5b peak shortfall | 1 / 1 (hips 12 of 13; calves 8 of 8) | 1 / 1 |
| L5c week 1 vs start | 1 (calves 7, start 6) | 0 |
| L6 exercises, L7a uneven exposures, L7b supersets on | 6, 3, 2 | 3, 4, 4 |

Weekly hard sets per group (credited group sets, main days):

| Group | State | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| calves | trained | 7 | 7 | 7 | 7 | 7 | 7 | 7 | 7 | 7 | 8 | 8 | 8 |
| hips | trained (10 -> 12 direct) | 10.5 | 10.5 | 10.5 | 10.5 | 10.5 | 11.5 | 11.5 | 11.5 | 11.5 | 11.5 | 11.5 | 12.5 |
| quads | pattern (step-up) | 2 | 2 | 2 | 2 | 2 | 2 | 2 | 2 | 2 | 2 | 2 | 2 |
| back | pattern (row) | 2 | 2 | 2 | 2 | 2 | 2 | 2 | 2 | 2 | 2 | 2 | 2 |
| chest | pattern (press) | 2 | 2 | 2 | 2 | 2 | 2 | 2 | 2 | 2 | 2 | 2 | 2 |
| **total resistance sets** | | 23 | 23 | 23 | 23 | 23 | 24 | 24 | 24 | 24 | 25 | 25 | 26 |

Compound credit only, every week: shoulders 1, triceps 0.5, biceps 0.5.

Minutes per day (supersets on where needed; chosen 45, limit 49.5):

| Day | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | straight sets, week 12 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Mon | 44.5 | 44.5 | 44.5 | 44.5 | 44.5 | 44.5 | 44.5 | 44.5 | 44.5 | 46.3 | 46.3 | 46.3 | 50.3 |
| Thu | 44.8 | 44.8 | 44.8 | 44.8 | 44.8 | 47.1 | 47.1 | 47.1 | 47.1 | 47.1 | 47.1 | 48.9 | 52.9 |

Week 1 -> week 12, by day: **Monday** core pair, medball throw 2; step-up 2 + row 2 (pair); single-leg RDL 2, leg curl 2;
calf raise 3 -> 4. **Thursday** core pair, low box jump 2, ankle hops 2; Romanian deadlift 3 -> 4 + chest press 2 (pair);
leg curl 3 -> 4; calf raise 4. Resistance exercises: 5 and 4. Joint care (rotator cuff, tibialis) on the optional day.

- **Stairway:** 3 whole sets over 11 week-steps, so 8 flat weeks of the total are the arithmetic minimum, and the plan has
  8. Hips step in weeks 6 and 12, calves in week 10. Both lines could take their last set in week 12 (24 -> 26 is + 8.3 %,
  inside the 10 % rule), but then 9 weeks are flat; "landing first" (decision D4) gives exactly that: 23 x 5, 24 x 6, 26.
  In the flat weeks the climb is the planned effort drift (3 RIR -> 1 RIR) and reps in the bracket (DR-9).
- **Athletic doses:** throws 40 a week (target 51 -> 69: one 2-set station holds 40; told), ankle contacts 35 -> 50
  (target 35 -> 73), jump contacts 7.
- **Certificate:** PASS (0 days over the limit, 0 group-weeks under a floor, 0 staircase breaks, 0 step breaks).
- **Why not quads:** minimal conflict = {Monday and Thursday minutes in the last week; floors and minimum climbs of calves,
  hips and quads; the step-up stays on its day and keeps its row} (297 nodes). **Why not back:** {Monday and Thursday
  minutes in the last week; floors of back, calves, hips; minimum climb of hips} (80 nodes).

Offers (keep vector re-solved; all proven; 9-87 ms each):

| Schedule | Trained directly | Pattern stations | Room cuts needed |
|---|---|---|---|
| 2 x 30 | calves | back | Olympic lift, joint care |
| **2 x 45** | calves, hips | quads, back, chest | Olympic lift, joint care |
| 2 x 60 | calves, hips, quads, back | shoulders, chest | Olympic lift, joint care |
| 2 x 75 ... 120 | calves, hips, quads, back | shoulders, chest | none |

Chest and shoulders are never trained directly on this 2-day template at any length: each has two exercises on one day,
at most 4 + 4 = 8 direct sets. The offer for them is a third day or a third exercise (decision D9), not minutes.

What the coach's open decisions do to this client (each a one-line change, each re-solved):

| Reading | Trained | Sets week 1 -> 12 | Cuts | Pattern stations | Days (min) |
|---|---|---|---|---|---|
| **default** (fit 1.10, calves floor 7) | calves, hips | hips 10 -> 12, calves 7 -> 8, total 23 -> 26 | 2 | step-up, row, chest press | 44.5 - 48.9 |
| calves floor 6 (3 sets a leg day, as in 12 v1.2 section 5.5) | calves, hips | hips 10 -> 12, calves 6 -> 7, total 20 -> 23 | 1 (Olympic lift only) | chest press, shoulder press | 45.4 - 49.1 |
| fit factor 1.00 (every day inside 45) | calves, hips | hips 10 -> 12, calves 7 -> 8, total 21 -> 24 | 2 | chest press, shoulder press | 40.5 - 44.8 |
| "never flat" above the minutes (tier L3f) | calves, hips | hips 10 -> **13**, calves 7 -> 8, total 23 -> 27, 7 flat weeks | 2 | step-up, row, chest press | 44.5 - 49.3 |

Against the current engine (diagnosis 1.2, 1.5): it trains quads 4 -> 6 and hips 4.5 -> 6.75 below the floor, calves 7 -> 8,
one row station and no press on the main days, with printed doses that re-cost to 51-54 min. The worked example that
follows the coach's approved policy for this client (12 v1.2 section 5.5) is hips + pinned calves with the shoulder press
kept beside the hinge; the calves-floor-6 row above reproduces that structure.

### 14.2 CrossFit-style class, 35 years, L2, 4 x 60 min, 8 weeks

Keep order: hips, quads, back, chest, shoulders, calves, triceps, biceps. Starts / ceilings / floors: big 12 / 18 / 10,
shoulders and arms 10 / 18 / 10, calves 6 / 8 / 7. L2: 5 sets an exercise (isolation 4). The class is the format: every
day has warm-up 8, core 5.5, WOD 11; squat and deadlift days add the skill 6; press and clean days an Olympic lift of
3 sets (10). The class lifts (front squat Monday, press Tuesday, deadlift Thursday) are 3 sets at strength rest:
3 x 5.25 + 1 = 16.75 min each. So before any accessory: Monday and Thursday **47.25**, Tuesday **51.25**, Friday 34.5 of 66.

**The decisive arithmetic.**

- *Hips* have one day. Ten credited sets there (the squats give 0.75) are deadlift 4, single-leg RDL 3, leg curl 3:
  21 + 9 + 5.55 + 3 changeovers = 38.55 on top of 30.5 fixed = 69.05 > 66 in week 1, before the climb. Proven not to fit.
- *Quads* have one day and two exercises: 5 + 5 is the floor *and* the maximum (no room to climb), and it costs
  26.25 + 15 + 2 = 43.25 on top of 30.5. Proven not to fit at any length without a third knee exercise.
- *Back* trains Monday (row inside the squat's rests) and Friday. *Chest* trains Tuesday and Thursday (press inside the
  deadlift's rests). *Shoulders*: the class press 3 sets + Monday's rear and side raises, with the quarter credit of
  rows and presses, reach 10.
- *Calves* need both leg days; Monday is full. Not at 60.

**Solver result** (130 integers, 354 rows; every tier proven; 79 nodes, 0.34 s CPU): trained directly back, chest,
shoulders; hips and quads keep their class lift; L4 = 6.55 min over 60 in total (Monday 0.15 -> 3.35, Tuesday 1.45,
Thursday 0.15 in week 8).

| Group | State | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 |
|---|---|---|---|---|---|---|---|---|---|
| hips | class lift (deadlift 3) | 3.75 | 3.75 | 3.75 | 3.75 | 3.75 | 3.75 | 3.75 | 3.75 |
| quads | class lift (front squat 3) | 3 | 3 | 3 | 3 | 3 | 3 | 3 | 3 |
| back | trained (13 -> 15 direct) | 13 | 13 | 14 | 14 | 14 | 15 | 15 | 15 |
| chest | trained (10 -> 12 direct) | 10 | 10 | 10 | 11 | 11 | 11 | 12 | 12 |
| shoulders | trained (7 -> 9 direct + credit) | 10 | 10 | 10.25 | 10.5 | 11.5 | 11.5 | 11.5 | 12.5 |
| calves | not trained (time) | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| **total resistance sets** | | 36 | 36 | 37 | 38 | 39 | 40 | 41 | 42 |

Compound credit only: triceps 2 -> 2.25, biceps 3.25 -> 3.75.

| Day | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | straight sets, week 8 |
|---|---|---|---|---|---|---|---|---|---|
| Mon | 60.2 | 60.2 | 60.9 | 60.9 | 62.8 | 62.8 | 62.8 | 63.4 | 73.6 |
| Tue | 61.5 | 61.5 | 61.5 | 61.5 | 61.5 | 61.5 | 61.5 | 61.5 | 61.5 |
| Thu | 56.1 | 56.1 | 56.1 | 58.3 | 58.3 | 58.3 | 60.2 | 60.2 | 65.7 |
| Fri | 56.8 | 56.8 | 56.8 | 56.8 | 56.8 | 59.0 | 59.0 | 59.0 | 59.0 |

Week 1 -> week 8: **Monday** front squat 3 + row 2 -> 3 (pair), pull-up 2, rear-delt raise 2 -> 3 + side raise 2 -> 3 (pair).
**Tuesday** snatch work, press 3, bench press 2, fly 2. **Thursday** deadlift 3 + bench press 3 -> 4 (pair), fly 3 -> 4.
**Friday** clean work, row 5, chin-up 4 -> 5. Strength tests in weeks 1 and 8 add a 10-min work-up on Monday, Tuesday and
Thursday (reported apart).

- **Stairway:** 6 whole sets in 7 week-steps: 1 flat week (the minimum), none in a row; one line lands in week 8 and two
  in weeks 6-7 ("landing first" gives 36 36 37 38 38 39 39 42: all three land, 3 flat weeks, + 7.7 % in the last week).
- Back starts at 13, not at its level start 12, because the shoulders floor counts the rows' rear-delt credit: with one
  row set fewer, shoulders would be at 9.75. The certificate shows that coupling; a greedy pass would not see it.
- Back is 5 sets on Monday and 10 on Friday (the pull day of the class). Evenness yields to the peak here (tier L7a = 7).
- **Why not hips:** {floor of hips, minimum climb of hips, Thursday's minutes in the last week} (58 nodes).
  **Why not quads:** {floor of quads, Monday's minutes in week 1} (18 nodes).

| Schedule | Trained directly | Note |
|---|---|---|
| 4 x 30, 4 x 45 | no plan | the class blocks and the class lift alone need 47-51 min: the class format starts at 60 (T4-TIME-03) |
| **4 x 60** | back, chest, shoulders | |
| 4 x 75 | hips, back, chest, shoulders, biceps | hips then hold 12 sets on the one deadlift day at the peak, one above the 11-a-session guide (soft, T5-CAP-05) |
| 4 x 90 ... 120 | hips, back, chest, shoulders, calves, biceps | quads never: one knee day with two exercises |
| 4 x 60 with fit factor 1.00 | back only (13 -> 17), chest as a 2-set press beside the deadlift | days 51.3 - 59.5 |

Against the current engine: quads 5 -> 6 and hips 6.25 -> 7.5 "trained below the floor", back 10 -> 12, test days at 64-70.

### 14.3 Swimmer, 16 years, L2, competitive, 3 x 60 min, 12 weeks

Keep order: back (profile priority), hips, quads, chest, shoulders, calves; arms are credit-only for field-type
athletes. Starts / ceilings / floors: back 15 / 21 / 10 (the swimmer ratio), hips and quads 11 / 16 / 10, chest 10 / 14 / 10,
shoulders 10 / 16 / 10, calves 9 / 12 / 10 (3 leg days). At most 12 counted exercises a day. Competitive: the sport's
tracks are not on the cut ladder, shoulder care is in every session. Fixed blocks (weeks 1-4 / 5-8 / 9-12, Olympic sets
6 -> 7 -> 8 a week): Monday 26.5 / 29.5 / 29.5; Wednesday 32.6 / 33.5 / 36.5; Friday 27.5. Rep phases VOL 1 -> 2 -> 3: from
week 9 the axial work lifts (Monday squat, Friday deadlift) take strength rest, 5.25 min a set instead of 2.25, so week 12
dominates every week in cost and the epochs are {1, 12}.

**The decisive arithmetic.** In the last week the three days have 36.5, 29.5 and 38.5 min for lifting: 104.5 in all.
Back (12 sets, two days), hips (12 sets; the tested deadlift 3 x 5.25 on Friday with its press) and quads (12 sets; the
tested squat 3 x 5.25 on Monday with its row, which puts back on Monday with two exercises) cost about 31 + 40 + 40 min
of straight sets. On a weekly total with supersets that is close to fitting; day by day it does not, and the search
proves it (17 nodes; the conflict below names all three days). This is the case where a planner that checks weekly
capacity promises a group it cannot pack. Without the squat requirement quads would fit on Wednesday and Friday with
unilateral work - which is the plan a model without rule R6 produced first (no squat, no deadlift), and why R6 is in
the model.

**Solver result** (190 integers, 505 rows; every tier proven; 377 nodes, 1.44 s CPU): trained directly back, hips, chest.

| Group | State | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| back | trained | 10 | 10 | 11 | 11 | 11 | 11 | 11 | 11 | 12 | 12 | 12 | 12 |
| hips | trained (10 -> 12 direct) | 10.5 | 10.5 | 10.5 | 10.5 | 11.5 | 11.5 | 11.5 | 11.5 | 11.5 | 11.5 | 12.5 | 12.5 |
| quads | pattern (split squat 2) | 2 | 2 | 2 | 2 | 2 | 2 | 2 | 2 | 2 | 2 | 2 | 2 |
| chest | trained | 10 | 10 | 10 | 10 | 10 | 10 | 11 | 11 | 11 | 11 | 11 | 12 |
| shoulders | pattern (press 2) + credit | 4.5 | 4.5 | 4.75 | 4.75 | 4.75 | 4.75 | 5 | 5 | 5.25 | 5.25 | 5.25 | 5.25 |
| calves | not trained (time) | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| **total resistance sets** | | 34 | 34 | 35 | 35 | 36 | 36 | 37 | 37 | 38 | 38 | 39 | 40 |

| Day | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | straight sets, week 12 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Mon | 55.2 | 55.2 | 57.5 | 57.5 | 60.5 | 60.5 | 60.5 | 60.5 | 60.5 | 60.5 | 60.5 | 60.5 | 64.5 |
| Wed | 56.8 | 56.8 | 56.8 | 56.8 | 57.7 | 57.7 | 57.7 | 57.7 | 63.0 | 63.0 | 63.0 | 63.0 | 67.0 |
| Fri | 45.9 | 45.9 | 45.9 | 45.9 | 48.1 | 48.1 | 48.9 | 48.9 | 60.9 | 60.9 | 62.7 | 63.3 | 76.3 |

Week 1 -> week 12: **Monday** box jump, clean work; row 3 -> 4, pulldown 3; single-leg RDL 2 + shoulder press 2 (pair),
leg curl 2. **Wednesday** throw, upper-body plyo, ankle hops, snatch work; bench press 2, fly 2; split squat 2 + row 2 -> 3
(pair), pulldown 2. **Friday** jump + throw, clean pull; trap-bar deadlift 3 -> 4 + DB press 3 -> 4 (pair), leg curl 3 -> 4 +
fly 3 -> 4 (pair). Friday jumps from 48.9 to 60.9 min in week 9 with no added set: four deadlift sets each rest 3 minutes
longer in VOL 3, and the model priced that in week 1. Test weeks add the jump test (6 min, Monday) and the deadlift
work-up (10 min, Friday); the squat test goes with the squat.

- **Stairway:** 6 whole sets over 11 steps: 5 flat weeks (the minimum), none in a row; total 34 -> 40.
- **Athletic doses:** throws 35 -> 45 and ankle contacts 8 -> 27 on target every week; Olympic sets 6 -> 7 -> 8; jumps 32 a
  week against 37 -> 49 (two 2-set stations hold 32; told).
- **Why not quads:** {the squat stays on Monday and keeps its row; floors of back, hips, quads; minimum climb of hips;
  the minutes of Monday, Wednesday and Friday in the last week; 5 sets an exercise at most} (3,401 nodes, 16 s: the
  explanation is the costly step on this model and is computed on demand).

| Schedule | Trained directly | Pattern stations |
|---|---|---|
| 3 x 30 | no plan (fixed blocks alone are 27-37 min) | |
| 3 x 45 | back | hips, chest, quads |
| **3 x 60** | back, hips, chest | quads, shoulders |
| 3 x 75 | back, hips, quads, chest, shoulders | |
| 3 x 90 ... 120 | back, hips, quads, chest, shoulders, calves | |

Two readings that change this plan:

| Reading | Trained directly | Sets week 1 -> 12 | Days, last week |
|---|---|---|---|
| **default** | back, hips, chest | each 10 -> 12; total 34 -> 40 | 60.5 / 63.0 / 63.3 |
| no strength rest in VOL 3 (open item O-17) | back, hips, **quads**, chest - with the squat and the deadlift | each 10 -> 12; total 42 -> 50; 3 flat weeks | 60.4 / 60.6 / 60.5 |
| fit factor 1.00 | back, hips | back 12 -> 14, hips 10 -> 12; total 28 -> 32 | 58.2 / 59.5 / 59.4 |

So for this swimmer the question "does the late-block squat rest 3-6 minutes?" is worth one whole muscle group at
3 x 60. The model cannot answer it; it can put the number in front of the coach.

Against the current engine: quads 5 -> 6 below the floor, hips 10.75 -> 12.75, back 10 -> 13, days at 60-66 with test days
at 77.

### 14.4 What the three runs have in common

- No trained group is ever under its floor, in any week; every trained group climbs at least its minimum; every day of
  every week is inside the limit the model was given; nothing was repaired after the solve.
- Every group that is not trained has a proof and a reason in rule ids; every offer is a solved plan.
- The plans are small: 2-3 groups at 10 -> 12 sets plus pattern stations. That is what 45-60 minutes hold once warm-up,
  core, athletic work and class blocks are paid for (pickleball 18-21 min a day after the cuts, the swimmer 27-37, the
  class 47-51 with its class lift), and it is the coach's approved policy ("fewer muscles directly ... instead of
  dropping below the floor on everything"). Where that is not what he wants, the levers are the readings of section 15,
  not the algorithm.

---

## 15. Decisions for the coach, risks, limits

### 15.1 Decisions (each is one parameter or one tier position; measured effect where the prototype ran it)

| # | Decision | Default here | Measured effect of the other choice |
|---|---|---|---|
| D1 | May a big mover be trained below its floor on its work lift (E-11)? | no (approved R3-SES-02) | the current engine's answer: swimmer quads 5 -> 6, class quads and hips 5 - 7.5, pickleball quads and hips 4 - 6.75. Here those groups are "not trained directly" with a pattern station or a class lift, and the offer says what trains them |
| D2 | Fit factor: 1.10 or 1.00 | 1.10 (model) | pickleball: same two groups, one pattern station fewer, days ≤ 44.8; class: back only; swimmer: back and hips only |
| D3 | "Never flat": may it use the 10 % band? | no (band for the minimums) | pickleball hips 10 -> 13 instead of 12, Monday 49.3 |
| D4 | Stairway: fewest flat weeks first, or every line landing in week N first | flat weeks first | class: 3 flat weeks and + 7.7 % in week 8 instead of 1 flat week; pickleball: 9 flat weeks instead of 8 |
| D5 | Pattern stations: after the room cuts, or able to force them | after | an earlier run of the prototype with the inventory's single state vector took all three room cuts for the pickleball player (the ankle hops too) to hold three pattern stations |
| D6 | Calves floor with 2 leg days: 7 (DER-04) or 6 | 7 (model) | pickleball needs one room cut instead of two |
| D7 | VOL 3: strength rest on an athlete's axial work lifts (O-17) | yes (model) | swimmer trains quads as a fourth group without it |
| D8 | Test work-ups: reported apart, or inside the day limit | apart (`rules.tests.test_week_note`) | inside: weeks 1 and N become epochs with 6-16 more fixed minutes; not run |
| D9 | A third exercise for a group that has only one day (chest on the 2-day template, quads in the class) | not offered | would let those groups reach 10 at longer sessions; today the honest offer is another day |
| D10 | Each day keeps the pattern its label names (E-144) | not a rule here | the swimmer's Monday has no knee lift (quads are not trained directly); as a tier it would put the 2-set knee station on Monday |

### 15.2 Risks

- **Lower-tier proofs have a tail, and the prototype kernel is slow.** 28 of 609 grid cells (4.6 %) end a tier "best
  found" at 3,000 nodes, and the 90th-percentile cell needs 3.3 s for four tiers. The plan is legal and the keep vector
  exact, but the peak may be a set below the best. Mitigation: the hardening list of 5.3, small budgets for the lower
  tiers, the certified grid, the bound in the certificate. If the hardened kernel still misses the budget on 5-6-day
  plans, the fallback is the HiGHS backend in a worker for those plans only - a decision for the maintainers, because it
  breaks the engine rules (5.1).
- **The explanation is the most expensive call** (one question per rule family; 16 s on the swimmer, minutes on a
  four-group variant). It must be on demand, use QuickXplain's divide-and-conquer (about k·log2(n/k) questions for a
  conflict of k families instead of n), and run under its own budget with "reason not computed" as a legal answer.
- **The LP is floating point** until certified pruning is in (4.4). Coefficients are small integers (at most 160) except
  row R13.
- **The kernel is the research prototype's**: correct on everything checked, slow per node. The run-time projection of 6.3
  depends on a warm start that was not built.
- **Model fidelity.** Not in the prototype: athletic sets as variables, the optional day and Focus slots, two lines inside
  hips for physique plans, slot variants, non-dominated middle epochs, tests inside the limit. All are rows of the same
  kind; each needs its property test. Timed circuits (bootcamp) and the four-role strength day are other *formats* with
  their own small models (work seconds, T3-STW-10), not instances of this one.
- **The grid uses the research instance builder** (fixed athletic minutes, no joint care, no class lifts), so its timings
  are for models of the right size and shape, not for the final catalogue.

### 15.3 What this design would take from the other angles

A constructed start (place the minimums by the coach's order) for every keep question costs microseconds and would give
most questions their witness before any search; the templates as reviewable data including day variants by minutes;
and the coach's worked examples as golden tests. None of them changes the model.

---

## Appendix A. Reproduce

All files are in `design/milp_proto/`; nothing outside `design/` is written. They read `model/rules.json`,
`model/templates.json` and `design/research/{kernel,lp,proto_endpoint}.mjs`.

```
node design/milp_proto/run_samples.mjs                        # section 14 (all three, with offers and explanations)
node design/milp_proto/run_samples.mjs pickleball phi=1 noOffers=1         # variants: phi=1 | calvesFloor=6 | flatFirst=1 | order=land
node design/milp_proto/run_samples.mjs swimmer vol3Rest=off noOffers=1 nodeLimit=2500
node design/milp_proto/grid.mjs FAMS=aesthetics,strength LIMIT=3000 SKIP=T1b,T1c,T5b,T5c,T6,T7a,T7b,T9 OUT=./grid_t1_aesthetics.jsonl
node design/milp_proto/grid_summary.mjs design/milp_proto/grid_t1_*.jsonl   # section 6.2
node design/milp_proto/exp_t1.mjs                             # 4.2: one weighted objective vs one question per group
LIMIT=3000 node design/milp_proto/exp_cuts.mjs aesthetics:4:60:L1,aesthetics:3:60:L2,aesthetics:4:45:L2   # 5.3: rounding cuts
```

The grid of 6.2 was run as five processes (`FAMS=aesthetics,strength`, `athletic,hybrid_crossfit`,
`fat_loss_bootcamp,no_equipment`, and `strength`, `no_equipment` again in parallel; the summary removes duplicate cells);
about 35 minutes on the loaded laptop. The four-group swimmer explanation quoted in 4.10 comes from
`run_samples.mjs swimmer vol3Rest=off noOffers=1 nodeLimit=2500` without `noExplain=1` (several minutes).

| File | What it is |
|---|---|
| `planner.mjs` | compact epoch model (rows tagged with rule ids), tiers, sequential keep vector, exact stairway, placement, certificate, explanation, athletic key |
| `kern.mjs` | branch-and-bound over the research `Model`: start solutions, four verdicts, node budgets, optional rounding cuts |
| `samples.mjs` | the three instances, written out from the templates and the rules |
| `run_samples.mjs`, `out_*.txt` | reports and their saved outputs |
| `grid.mjs`, `grid_summary.mjs`, `grid_t1_*.jsonl`, `grid_summary.out.txt` | the grid sweep and its summary |
| `exp_t1.mjs`, `exp_cuts.mjs`, `exp_cuts.out.txt`, `exp_sum_tiers.out.txt` | the solver experiments (keep vector two ways, rounding cuts, sum tiers) |
| `dump_plan.mjs` | read-only dump of a current sample plan (used to read picks and fixed blocks) |

Node counts, kept groups, tier values and set tables are deterministic and must reproduce exactly. CPU times were taken
on a laptop that was running other workflows and will differ. The row count printed in `out_*.txt` is taken after the
solve and includes the ten tier-freeze rows (361 / 364 / 515); the model sizes quoted in this document are before them
(351 / 354 / 505).
