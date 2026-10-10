# Planner design: two-stage (the block table first, then the placement)

Design-panel entry for the angle "two-stage decomposition". Written 2026-10-10.
Inputs read first: `design/diagnosis.md`, `design/algorithm_research.md`, `design/rules_as_constraints.md` (rule ids below are from
that file), then the coach answers (round 3 > round 2 > round 1), `synthesis/12_volume_algorithm_v1.md`, `05_session_architecture.md`,
`model/rules.json`, `model/templates.json`, `model/profiles.json` and the engine.
A working prototype of the whole chain is in `design/two-stage/proto/` and its saved outputs in `design/two-stage/out/`
(section 14 says how to rerun them). Nothing outside `design/` was written and no git command was run.

---

## 0. Summary

**The design in one paragraph.** The planner answers the coach's two questions in his order. **Stage 1** decides the *block
table*: which groups are trained directly, and how many weekly sets each gets in every week. **Stage 2** decides *where each set
goes*: the day, the exercise, the superset, using his own rules (the staircase 2/2/2 -> 3/2/2 -> 3/3/2 inside a day, "the
exposure that is behind gets the set" across days). The two stages are linked by a **certificate**: stage 1 never states a table
without also holding a fully placed first week and a fully placed last week for it, checked with the same time function the
dose uses. Stage 2 then builds every week in between as a prefix of one fixed add sequence per group. A short proof (section 3)
shows that every such week fits its minutes, holds its floors and respects every cap. So stage 2 cannot fail, cannot cut and
cannot change the table. There is no verify-and-repair loop anywhere.

**What is exact.** Three things are decided by exact methods with whole-number arithmetic:

| Decision | Method | Guarantee |
|---|---|---|
| Which groups are trained directly (R3-SES-02 step 2) | lexicographic in the coach's keep order; each question "is there a legal plan with these groups?" goes to an exact three-valued oracle on a small model (one or two whole numbers per group and day) | a group is left out only when no legal plan trains it together with every higher-priority group; "not proven" is never read as "does not fit" |
| How high each trained group climbs | priority water-filling on relative progress (start -> ceiling), each step an exact question | the peak vector is the lexicographic max-min optimum (section 3, T3): no group can go higher without taking from a group that is at or below it |
| Which week each added set lands in | dynamic program over the placed weekly totals (Gale-Ryser), then a transportation flow | step limits hold on the weeks really placed; the schedule is optimal for the tier order; equal to brute force on 3,000 small plans |

Everything else is a closed form: the staircase, the add sequence, the time function, the athletic doses.

**What the prototype measured** (pure JS, Node 22; same bytes in JavaScriptCore; details in section 5 and 11):

| Check | Result |
|---|---|
| Oracle against brute force over an independent evaluator | 1,500 random small instances, 6,000 questions (1,883 "fits", 4,117 "no"): 0 verdicts differ, 0 witnesses rejected, 0 unknown. While this design was written the same test caught one real bug in a pruning bound (fixed; described in 4.3) |
| Stairway scheduler against brute force | 3,000 small plans, 0 differences; 10,000 plans of real size, 0 certificate failures, about 1 ms each |
| The link between the stages (every week of every plan re-checked from the definitions with that week's own costs) | 286 random plans (2,478 plan-weeks) with changing costs by exercise block and non-monotone fixed minutes: 0 violations. 71 sample plans (772 plan-weeks): 0 violations |
| Work | 71 sample plans: median 267 search nodes and 33 ms per plan; 90 % under 0.17 s; worst 4.1 s (one proof of 69,000 nodes). 96 % of all oracle questions end within 50 nodes. 0 "unknown" verdicts |
| Monotonicity that is true | 72 steps of +15 minutes: the keep vector is never lexicographically worse |

**The three hardest samples** (section 12 has the full tables, the minutes per day and what each switch buys):

| Sample | Today's engine (diagnosis 1.2 and 1.5) | This planner, same time model | Longest day |
|---|---|---|---|
| 08 pickleball, 2 x 45 | quads 4 -> 6 and hips 4.5 -> 6.75 "trained below the floor", calves 7 -> 8; days up to 49 min | calves 6 -> 7 (pinned), **hips 10 -> 12** on both days, one press kept as a pattern station; quads, back, chest, shoulders listed with the minutes each would need | 43.9 of 45 |
| 04 CrossFit class, 4 x 60 | quads 5 -> 6 and hips 6.25 -> 7.5 below the floor, back 10 -> 12; days up to 62 (70 in test weeks) | **back 12 -> 15**; the class squat, press and deadlift stay as class lifts (3 sets each, credited, printed as class lifts); offer: 4 x 75 trains hips, quads, back and chest at 10 or more | 58.5 of 60 |
| 01 swimmer, 3 x 60 | quads 5 -> 6 below the floor, hips 10.75 -> 12.75, back 10 -> 13; days up to 66 (77 in test weeks) | **back 10 -> 15, hips 10.5 -> 12.5**, one single-leg knee exercise kept as a pattern station; offer: 3 x 75 trains back, hips, quads, chest and calves | 59.9 of 60 |

In all three plans no group is printed as trained while under its floor (10 sets; calves 3 per leg day), no day is over the
chosen minutes in any week, and every offer was computed by re-solving at a legal session length.

**What needs the coach** (section 13): nine choices, each with a default so the build is not blocked. The three that move
these samples most are (1) which fixed blocks keep their place ahead of a big mover (for the pickleball player: one joint-care
item or two decides whether hips fit at all), (2) the 4.5-minute strength rest of the heavy lift in the athletes' last exercise
block (it costs the swimmer his quads at 60 minutes), and (3) the day limit when the person keeps their time (100 % here).

---

## 1. Architecture and data flow

### 1.1 Stages

```
intake -> deriveValues -> buildShape                               [kept: intake.mjs, shape.mjs]
   S0  GRAMMAR      the uncut template week as candidates:          which exercises of which group may sit on which day,
                    in session order, with pair links; per-set seconds and credits from the picks (select.mjs, kept)
   SA  ATHLETIC     stations, sets and doses of the athletic prefix by LEVEL (0 = protected minimum); minutes per day and week
   S1  BLOCK TABLE  G1 keep vector -> G3 pattern stations -> G4 athletic level -> G5 peaks -> G6 week 1 -> G7 canonical structure
                    (every question to the exact oracle; the last witness is the CERTIFICATE)
                    then the stairway scheduler: own sets per group per week between the two certified ends
   S2  PLACEMENT    add sequence per group -> sets per exercise per week (staircase) -> supersets needed -> progress cue
   S3  DOSE + CERTIFY   reps / effort / rest from the SAME dose parameters the time function used (dose.mjs, kept);
                    every rule of the catalogue re-evaluated on every week; reasons and offers attached
-> plan/2 (same JSON contract)
```

Stage 1 is "decide the numbers", stage 2 is "write the sessions". Stage 0 and SA only prepare data; S3 changes no set.

### 1.2 Who owns which decision (exactly one owner each)

| Decision | Owner | Never touched again by |
|---|---|---|
| day types, block order, pairs, spine days, which group may train on which day | S0 (template data) | any stage: the planner only switches candidates on and off |
| athletic stations, their sets, weekly doses, their minutes | SA | S1 reads the minutes; S2 and S3 do not move them |
| which groups are trained directly; pattern stations | S1 (G1, G3) | S2, S3 |
| exposure days and exercise count of every trained group | S1 (G7) | S2, S3 |
| sets per group and day in week 1 and in the last week | S1 (G5-G7) | S2, S3 |
| sets per group per week | S1 (scheduler) | S2, S3 |
| sets per exercise per week, which pairs run as supersets | S2 | S3 |
| exercise picks, reps, effort, load cue, words | selection and dose (kept modules) | may not change a time class, a credit class or a set |

This table is the answer to diagnosis RC1 (four independent time cutters) and RC4 (targets, packing and verification as three
computations): time is checked in one place (the oracle, with the one time function), targets and packing are the same object
(the certificate), and verification is a re-evaluation that can only confirm.

### 1.3 Module shape (engine files it would become)

| Module | Job | Lines in the prototype |
|---|---|---|
| `plan/units + timecost` (`proto/core.mjs`) | seconds, quarter sets, the staircase, the one time function, credited tallies, the independent evaluator | 232 |
| `plan/grammar` (`proto/samples.mjs` holds three instances as data) | S0: candidates, pairs, pattern stations, fixed blocks, epochs | data |
| `plan/oracle` (`proto/oracle.mjs`) | the exact three-valued oracle | 302 |
| `plan/table` (`proto/stage1.mjs`) | G1, G3, G5, G6, G7 | 181 |
| `plan/stairway` (`proto/stairway.mjs`) | the scheduler, its certificate and the brute-force reference | 166 |
| `plan/placement` (`proto/stage2.mjs`) | S2, the per-week certificate and the report | 125 |
| `plan/athletic` (`proto/athletic.mjs`) | SA (level 0; one G4a step in `athlevel.mjs`) | 77 |
| `plan/offers` (`proto/offers.mjs`, `explain.mjs`) | reasons, offers, switches by re-solving | 91 |

About 1,200 lines of plain ES modules with no dependency (1,174 in the prototype, without the grammar builder, which is
data there) replace the 2,830-line `volume.mjs`, the cuts in `week.mjs` and the athletic reconcile. No library is needed:
the model is small enough for a purpose-built search, and a general solver would add a WASM file and floating point.

---

## 2. The formal model

### 2.1 Units and notation

Time is in whole seconds, credit in quarter sets (1 set = 4 q). Sets are whole numbers. No comparison uses a tolerance; ratios
are compared by cross-multiplication. One stairway training block has weeks w = 1..N and exercise blocks e (4-6 weeks each,
`rules.stairway.exercise_blocks_by_N`).

| Symbol | Meaning |
|---|---|
| g in G, in keep order pi | FOCUS groups (quads, hips, back, chest, shoulders, biceps, triceps, calves); pi = Focus groups, then groups the profile pins (racket 50+: calves), then the profile's big priorities, then `time_fit.keep_order` (T1-POL-05) |
| d in D | main days of the week (optional days carry the same objects with a flag; they never count for the floor or the climb) |
| gamma = (g, d) | a **group-day**: group g may train on day d. Its candidates c_1 ... c_m are the template's exercises of g on d in session order, followed by extension candidates of the same group (R3-VOL-03: "a day that already trains it") up to four |
| c | a candidate exercise: work_e(c), rest_e(c) seconds per set in exercise block e (from the dose parameters of its pick), credit a_h(c) in {0, 1, 2, 4} q to every group h (DEF-02 ... DEF-05, at most 4 q to a group), set bounds lo(c) <= hi(c) (T0-SES-15), role |
| P | superset pairs of a day. A side is a candidate, a pattern station or a fixed mate (a class lift, a joint-care item). An exercise is a side of at most one pair that can be active (template pair tags are disjoint; alternatives exclude each other) |
| F_d(w) | fixed seconds of day d in week w: warm-up, skill, core opener, athletic and Olympic stations (from SA), joint care, WOD, counted aerobic add-on, class lifts |
| L_d | day limit in seconds = 60 x chosen minutes x factor of the branch (section 6) |
| S_g, C_g, F_g, mc_g | level start, ceiling, floor and minimum climb of a group in credited sets (DER-01 ... DER-09, T2-FLR-01/02, T3-STW-02); one start and one ceiling per group |

**Decision variables.**

| Variable | Stage | Meaning |
|---|---|---|
| z_g in {0, 1} | S1 / G1 | group g is trained directly (state FULL) |
| y_s in {0, 1} | S1 / G3 | pattern station s (one exercise, 2 sets, constant) is in the week |
| K_gamma in {0} or {2, 3, 4} | S1 / G7 | exercises of g on d (0 = not that day; calves exactly 1; beside a class lift 1-3). The first K candidates are used. Constant over the block |
| n1_gamma <= nN_gamma | S1 / G5-G7 | sets of g on d in week 1 and in the last week |
| D_g(w) | S1 / scheduler | own sets of g on the main days in week w, from D_g(1) = sum n1 to D_g(N) = sum nN |
| n_gamma(w), x_{gamma,i}(w) | S2 | sets of the group-day and of its i-th exercise in week w |
| p_P in {0, 1} | S2 | pair P runs as a superset |

**Derived tallies** (the one unit of account, DR-7): `Q_g(w)` = credited quarter sets of g on the main days = every active
exercise, pattern station and class lift counted with its credit; `Qall_g(w)` the same with optional days; `Tot(w)` = all
resistance sets of the week; `Sec_d(w)` = day seconds.

### 2.2 The realization: three functions shared by every stage

**(a) The staircase `St(gamma, K, n)`** (VOL-07, T7-PLC-01, SF-3). Start every one of the K exercises at its minimum; every
further set goes to *the earliest exercise among those with the fewest sets that still has room*. This yields exactly
2/2/2 -> 3/2/2 -> 3/3/2 -> 3/3/3 -> 4/3/3, keeps the work lift at least as high as every other exercise of its group, and is
defined for every n between the sum of the minimums and the sum of the maximums. It is the *definition* of how n sets sit on a
group-day (hard inside a group-day, as the coach-fidelity lens asks), not a preference.

**(b) The time function** (DEF-09, one function for S1, S2, the dose and the validator):

```
straight exercise, x sets      x * (work + rest) + 60
pair (a, b) switched on        the two straight costs  -  [ min(xa, xb) * min(rest_a, rest_b) + 2 * 30 ]
day                            Sec_d = F_d + sum of its exercises and pattern stations - sum of the savings of its pairs that are on
```

The pair formula is "every round both partners still have, they work back to back and rest once, the longer rest; the
changeover inside a pair is half". `work` and `rest` are the dose parameters of the pick (rep bracket, per side, hold, rest
class), a pure function of (slot, pick, week shape) that never reads the sets; `dose.doseItem` must print the same values
(DR-11, closes RC9).

**(c) The add sequence of a group.** From its week-1 vector to its peak vector, one set at a time: the next set goes to the
exposure that is behind (fewest sets added so far among the days that still have room; ties: the day after the one used
last, so Monday this time and Thursday the next, R3-VOL-03). Week w is the prefix of length D_g(w) - D_g(1).

### 2.3 What is proved on two vectors: epochs

Per-set seconds change only when the exercises change (exercise-block starts); fixed seconds change by week (Olympic sets
climbing by exercise block, a WOD). Stage 1 proves the minutes on two vectors:

| Epoch | Weeks | Set vector | Per-set seconds | Fixed seconds |
|---|---|---|---|---|
| E0 | 1 | week-1 vector | exercise block 1 | F_d(1) |
| E1 | 2 ... N | peak vector | **reserved** = the largest work and the largest rest of the candidate over the exercise blocks | the largest F_d(w) of weeks 2..N |

Reserved costs make week N's proof cover every earlier week whatever the exercise block (section 3, L3). They are exact when
the last exercise block is the costliest (athletes: more single-leg work and strength rests late) and slightly conservative
when an early block is costlier (bodybuilders: 50 % two-leg work in block 1, 90 % in block 3); the audit reports the unused
seconds, and the exact refinement (one more proved vector per exercise block) is listed in 13.3. Test minutes in week 1 and
week N are outside the limit by default and printed (`fit.test_days = outside_warn`, T4-TIME-01 today); setting `inside` adds
them to F_d and the same proof covers them.

### 2.4 The hard rows (what a legal plan is)

"Where" names the stage that makes the row true by construction. Every row is also an evaluator in the rule catalogue and is
re-checked on every week by S3 and by the independent scorer.

| Row | Inventory ids | Statement | Where |
|---|---|---|---|
| R-BOUNDS | T0-SES-15, T6-CNT-06 | every active exercise holds lo..hi sets (2 to 4 at L1, 5 at L2-L3, isolation 4, calf 3-4); a class lift its class dose | S0 tables |
| R-COUNT | T0-SES-10, T1-POL-09, T6-CNT-02 | K is 0 or 2..4 for a trained group on a day (calves 1); never 1 | variable domain |
| R-CALF | T0-SES-11, T2-FLR-02 | calves trained: exactly one calf exercise with 3+ sets on every leg day of the template, never a second one | oracle row |
| R-WORK | T0-EFF-06, T0-SES-06 | a trained group trains on every day where the template gives it the day's work lift ("the work first"; the work lift is candidate 1 and cannot be skipped) | oracle row |
| R-STAIRCASE | T7-PLC-01 (VOL-07) | sets of a group-day are St(gamma, K, n) in every week | definition 2.2 (a) |
| R-MONO | T3-STW-01, T0-SES-14, T3-STW-08 | no exercise ever loses a set inside the block; the active exercises are constant; the stairway does not restart at an exercise block | S2 prefixes |
| R-FLOOR | T2-FLR-01, T2-FLR-04, T1-POL-01 a | trained g: Q_g(w) >= 4 F_g in every week (F = 10; calves 3 per leg day, see 13.1; a pain-reduced group its reduced start, DER-06) | oracle on E0, then L3 |
| R-CLIMB | T3-STW-02, T1-POL-01 c, T1-POL-12 | trained g: D_g(N) - D_g(1) >= mc_g (2; calves 1; 1 when N <= 7) | oracle |
| R-TIME | T1-POL-02, T4-TIME-01, DEF-09 | Sec_d(w) <= L_d in every week, with the pairs that are on | oracle on E0 and E1, then L3 |
| R-CEIL | T5-CAP-01, T5-CAP-02, T5-CAP-06 | own sets of g <= C_g; Qall_g <= 4 C_g + 4 (helper spill of at most one set) | oracle on E1 |
| R-ABS30 | T5-CAP-03 | Qall_g <= 120 q | S0 clamps C |
| R-LAMBDA | T3-STW-05, T3-STW-06, DEF-10 | credited peak <= credited week 1 x G(N) (the standard steps, lambda <= 1; 13.1) | oracle |
| R-SESSION | T5-CAP-05 | credited sets of g on one day <= 11 (Focus 14). Lower tier than keeping a group: G1 may lift it to the hard 14 for a group that cannot be kept otherwise, with a printed note | oracle |
| R-STEP.G | T0-STW-02 | D_g(w) - D_g(w-1) is 0 or 1 | scheduler |
| R-STEP.T | T0-STW-03, LK08 | Tot(w) - Tot(w-1) <= max(1, floor(7 % of Tot(w-1))) on the placed weeks (rule 10 %: strictly below 10 %); one set may always be added | scheduler transitions |
| R-LAST | T3-STW-04 | the last week is the largest | R-MONO |
| R-ATHLETE12 | T0-SES-13, T6-CNT-07 | field athletes: exercises of a day <= 12 minus the athletic stations (core and warm-up outside) | oracle row |
| R-EXBUDGET | T6-CNT-01 (VOL-08) | resistance exercises of a full-body day <= count for the session length + 2 (PROPOSED hard sanity cap; split days soft) | oracle row |
| R-PATTERN | T1-POL-07 | a pattern station belongs to a big mover that is not trained directly; one per group, at most 3 a week, 2 sets, constant | oracle rows |
| R-PAIR | T0-SES-16, T0-SES-08 | a superset is a template pair whose two sides are active; hip + push, knee + pull | S0 |
| R-GRAMMAR | T0-SES-01 ... 09, T0-SES-12, T0-SES-17, T0-SAFE-* | block order, core first, power before strength, horizontal before vertical, two spine days, rear-delt exercise, day spacing, every safety rule | template grammar, selection and the ordering pass (kept code); the planner cannot break them because it only switches candidates |
| R-ATH.* | T0-ATH-01 ... 05, T3-ATH-01, T5-ATH-01 | section 7 | SA |
| R-OUT.* | T0-SYS-01, T0-SYS-03, T1-POL-04, T1-POL-10, T1-POL-11, T1-POL-14 | determinism, a reason on every decision, offers before the plan, honest lists, superset recommendations, edits as constraints | S3, offers |

Two-sided ratio rules (the bilateral share T8-BAL-01/02, T7-PLC-05) are **not** rows on sets: a ratio is not preserved between
two endpoint vectors. The laterality of every candidate is fixed by the picks of each exercise block before S1 (it sets the
time class), and the share is measured as a soft metric.

### 2.5 The objective: lexicographic tiers, as data

A lower tier never changes a higher tier's result. Each tier is frozen as a pin before the next is asked.

| Tier | Inventory | Goal | How |
|---|---|---|---|
| G0 | T0 | every hard row | the rows are in every question |
| G1 keep | T1-POL-03, T1-POL-05 | the keep vector (z in keep order), lexicographically largest | exact oracle, group by group |
| G3 patterns | T1-POL-07 | pattern stations for big movers that are not trained directly, in keep order | exact oracle with pins |
| G4a athletic | T1-POL-13, T5-ATH-02 | competitive athletes: the highest athletic level that keeps G1 and G3 | SA level ladder + oracle |
| G5 peaks | T5-CAP-04, T8-BAL-04, T3-STW-09 | lexicographic max-min of relative progress (peak - start) / (ceiling - start); ties in keep order | exact water-filling |
| G4b athletic | T5-ATH-02 | everyone else: the highest athletic level that changes no resistance set | SA level ladder |
| G6 week 1 | T3-STW-08, T2-FLR-06, DER-01 | week 1 = peak - (C - S), never under the floor, never above the level start; nearest legal value, lower first | pinned questions |
| G7 structure | T7-WEEK-01, T6-CNT-03, T7-PLC-02 | most exposure days, then fewest exercises, then the most even split, the earlier day taking the odd set | pinned questions |
| G8 stairway | T3-STW-03 ... 07 | in this order: the last week adds a set; the weekly total closest to the planned 3 % / 5 % curve; most groups stepping onto their peak in the last week; no flat week in the last third; fewest flat weeks; fewest back-to-back flat weeks | dynamic program |
| G9 supersets | T7-PAIR-03, T1-POL-11 | fewest pairs switched on while every week holds | S2 |
| G10 | T8-* | variety, balance, preference scores | selection (kept), inside fixed time and credit classes |

Time fit (T4) has no soft term here: the day limit is a hard capacity in every question, so "nothing that rewards less volume
sits above the ceiling attainment" (inventory reading 6) holds trivially, and G9 (fewest supersets) is last.

**How the inventory's 127 rules map.** T0 (52): the set, count, time, step and cap rules are the rows above; the grammar,
safety and dose rules stay in the kept modules (R-GRAMMAR, R-ATH, selection, dose). T1 (14): G1, G3, R-PATTERN, R-OUT, section 6. T1-POL-08 (the
below-floor state) is **not used** (default off, 13.1). T1-POL-06 (room cuts) is replaced by the SA level ladder and the
switch list. T2 (6): R-FLOOR, R-CALF; T2-FLR-05 unused. T3 (12): R-CLIMB, R-MONO, R-LAMBDA, G8, section 7 for T3-ATH; T3-STW-10
(timed circuits) is a format handler (10.4). T4 (3): R-TIME, the legal lengths in offers. T5 (9): R-CEIL, R-ABS30, R-SESSION,
G5, SA. T6 (8): R-COUNT, R-EXBUDGET, R-ATHLETE12, G7. T7 (13): R-STAIRCASE, the add sequence, G7, G9, the ordering pass. T8
(10): selection.

---

## 3. The link between the stages: what is proved, and under which hypotheses

A *certificate* is a tuple (z, y, K, n1, nN) that satisfies every row of 2.4 on the two epochs of 2.3. Stage 1 hands stage 2 a
certificate and a table D. The hypotheses are written out because every false guarantee found so far in this project came from
a hypothesis nobody wrote down.

- **H1 (fixed structure).** z, y and K do not change inside the stairway block. Exercises may change at exercise-block starts
  (variation), but the i-th exercise of a group-day keeps its credit vector, and its per-set seconds never exceed the reserved
  seconds. Selection guarantees this by construction (section 8).
- **H2 (dominating epoch).** For every week w >= 2: F_d(w) <= fixed seconds of E1, and work and rest of every candidate in the
  exercise block of w are at most its reserved work and rest. This is the definition of E1.
- **H3 (pairs).** An exercise is a side of at most one pair that can be active.
- **H4 (table).** D_g(1) = sum of n1, D_g(N) = sum of nN, and D_g never drops and rises by at most one set a week.

**L1 (the staircase is monotone).** For a fixed group-day and K, St(n + 1) equals St(n) plus one set on exactly one exercise.
*Proof.* St is built by adding one set at a time; St(n) is the state after n - (sum of minimums) additions. QED.
Consequence: inside a group-day "one more set" is always a legal move while n is below the top, whatever the other group-days
hold, and no exercise ever loses a set when n grows.

**L2 (the time function is monotone).** Sec_d never decreases when any set count, any work or rest, or F_d grows.
*Proof.* One more set of a straight exercise adds work + rest > 0. In a pair, one more set of a adds work_a + rest_a and
raises the saving by at most min(rest_a, rest_b) <= rest_a, so the day grows by at least work_a > 0. For the rests: the cost
of a pair is xa (wa + ra) + xb (wb + rb) - min(xa, xb) min(ra, rb); raising ra by one second adds xa and takes back at most
min(xa, xb) <= xa. H3 makes the pairs independent of each other. QED.

**L3 (sandwich).** Under H1-H3, let x1 <= x(w) <= xN exercise by exercise for a week w >= 2, where x1 and xN are the week-1
and peak vectors of a certificate. Then week w satisfies R-TIME, R-CEIL, R-SESSION, R-ATHLETE12, R-EXBUDGET and R-FLOOR.
*Proof.* R-TIME: by L2 and H2, Sec_d(w) with the true costs of week w is at most Sec_d of xN with reserved costs and the fixed
seconds of E1, which is at most L_d. The other upper rows have non-negative coefficients and hold at xN. R-FLOOR has
non-negative coefficients and holds at x1; credits are the same in every exercise block (H1). The exercise counts depend only
on K. Week 1 is E0 itself. QED.

**L4 (the add sequence never gets stuck).** For every trained group the add sequence of 2.2 (c) has exactly
D_g(N) - D_g(1) steps, and after any number of them every group-day holds between n1 and nN sets.
*Proof.* A step goes to a group-day that still has room (n < nN); the total room is the sum of nN - n1 = D_g(N) - D_g(1); a
day's count never passes nN and never goes under n1. By L1 the staircase is defined for every value in between. QED.

**L5 (Gale 1957, Ryser 1957).** Groups add u_g sets in weeks 2..N, at most one a week. A sequence of weekly rises R(2..N) with
sum R = sum u can be shared out among the groups if and only if taking each week's R(w) sets from the R(w) groups with the
most sets left never fails. So a dynamic program over (week, sorted vector of sets left) visits exactly the realizable paths
of the weekly total, and a rule on the total can be checked in each transition on the total really placed the week before.

**T1 (link theorem).** Under H1-H4, stage 2 produces for every week w a vector x(w) such that (a) the own sets of every group
equal the table, (b) no exercise loses a set from one week to the next, (c) every row of 2.4 holds in week w. Stage 2 never
fails and never changes the table.
*Proof.* (a) and "never fails": L4. (b): prefixes of one add sequence are nested, and L1. (c): x1 <= x(w) <= xN by L4 and L1,
then L3; R-STAIRCASE by definition; R-MONO is (b); the step rows are H4 and the scheduler's transitions (L5); R-CLIMB,
R-LAMBDA, R-COUNT, R-CALF, R-WORK and R-PATTERN are rows of the certificate and do not depend on the week. QED.

**T2 (the keep vector is exact).** If every G1 question is answered "fits" or "no", the kept set is the lexicographically
largest keep vector over all legal plans.
*Proof.* G1 maximizes z coordinate by coordinate in keep order; each question fixes the earlier coordinates and leaves the
later groups free. That is the definition of a lexicographic maximum. Two details. (i) The reduced model loses no legal plan:
the staircase is the only legal shape inside a group-day, every exercise count is a variable, and "every eligible pair
supersetted" is the definition of a day that holds (T1-POL-02). (ii) The implementation fixes later groups that credit no
group of the question to "off". This loses nothing: switching off a trained group that credits nobody removes its rows and
its seconds, and the saving its exercises gave a partner is never larger than their own cost (L2), so every other row still
holds. QED.

**T3 (the peaks are the lexicographic max-min optimum).** Give every (group, own peak v) the key
rho_g(v) = (4 v + h_g - 4 S_g) / (4 C_g - 4 S_g) with ties broken by keep order (h_g is a constant of the instance, 4.4). The
ladder always tries to raise the group with the smallest key by one set, asking "is there a legal plan whose peaks are at
least the current vector plus this set (and at most the ceilings)?", and freezes the group on "no". If every answer is exact,
the final vector x is the unique optimum of the lexicographic max-min order of the keys over all legal plans.
*Proof.* The questions ask for peaks *at least* v, so the set tested is the down-closure P' of the legal peak vectors. Let y
in P', y != x. Let m be the group with the smallest min(key at x_m, key at y_m) among the groups where x and y differ.
If y_m > x_m: m was frozen at x_m when the vector was some x' <= x with x'_m = x_m, and (x' + e_m) is not in P'. Since P' is
down-closed and y_m >= x_m + 1, some group h has y_h < x'_h. The start vector is a lower bound of every legal plan, so h was
raised to x'_h at some time, and at that time it had the smallest key: key_h(x'_h - 1) < key_m(x_m). So h differs between x
and y and its smaller key is below m's, a contradiction. Hence y_m < x_m at the first difference, and y is worse. Finally the
witness of the last question dominates x and lies in P', so it equals x. QED.
(After a "not proven" answer the plan is still a legal certificate; the tier is reported as "best found".)

**T4 (the monotonicity that is true).** Let F(m) be the set of legal plans at session length m. If F(m) is contained in F(m')
for m <= m', the keep vector at m' is lexicographically at least the keep vector at m. The hypothesis is a modelling duty and
holds here: a longer session only raises L_d and the exercise budget; every station that appears "from 75 minutes" is a
candidate or an athletic level that may stay off; the protected athletic minimum does not grow with the minutes.
What does **not** follow, and is false for any exact planner with a priority order: "more minutes never untrains a group"
and "more minutes never lowers a peak". A higher-priority group that newly fits may push a lower one out (3 of 72 steps in the
sweep), and a newly kept group takes minutes from the peaks of the others. Offers therefore say what they add and what they
trade (section 6).

**What is not guaranteed.** (1) Optimality after an "unknown" verdict (legality is unaffected). (2) Any two-sided ratio on
sets. (3) Tightness of E1 when an early exercise block is costlier than the last one (the plan is legal, the peak may be a set
lower than the true optimum).

---

## 4. Algorithms

### 4.1 S0: the grammar

```
buildGrammar(derived, shape, template, selections):
  days      <- the template's main days in week order (optional days flagged)
  for each day, each resistance / isolation station of the UNCUT template day type (stations gated by minutes become candidates
            from that length on; nothing is ever forced by a longer session):
      candidate c <- { role, pair tag, set bounds, credit vector of its class,
                       work_e, rest_e for every exercise block e  <- doseParams(slot, pick_e, weekShape_e) }
  group-days <- candidates grouped by (group, day) in session order, the work lift first;
               + extension candidates of the same group (rules.planner.extension_buckets) up to four
  pairs     <- template pair tags (work + its opposite partner, second pairs, isolation pairs); mates for class lifts and joint care
  patterns  <- for every big mover: its pattern exercise (row, press, single-leg knee, single-leg hinge) on the days whose
               template lists it (rules.volume.pattern_keep), 2 sets, with the same pair tag
  fixed     <- F_d(w) from the warm-up, skill, core opener, class lifts, WOD, joint care and SA(level)
  targets   <- S, C, F, mc per group from computeTargets (kept: level table, modifier, Focus, pain, ratios, cycles)
  keep order pi <- Focus, profile pins, profile big priorities, time_fit.keep_order
```

The three instances of section 12 are written out as data in `proto/samples.mjs`: a coach can read them like a sheet.

### 4.2 SA: the athletic pre-plan

See section 7. Its output for S1 is one number per day and week and level: the athletic seconds inside F_d(w).

### 4.3 The oracle

*Question.* "Is there a certificate with these groups trained (must), these not (not), the rest free, these pattern stations
on or off, own peaks at least / at most given values, own week-1 sets equal to given values, and these structure pins?"

*Model.* Per group-day two finite-domain variables, A = (K, sets in the peak week) and B = (K, sets in week 1); per group z;
per pattern station y. Each has at most about 30 states (off, then every K and every n the staircase holds). **Every row of 2.4
is a sum over variables of a table value of the variable's state**, compared with a constant: the seconds of a group-day
state on E0 or E1, its credit to each group, its exercise count, its sets. Conditional rows ("if z_g = 1") carry a column for
z. The only non-separable term is the pair saving in R-TIME, bounded as described below. Channel rows tie A and B (same K,
week 1 <= peak).

```
ask(question, budget):
  for b in (2,000, 16,000, 128,000, ... up to budget):          # deterministic doubling, counted in nodes, never a clock
      for strategy in (cheapest peak first, largest peak first):
          r <- search(question, b, strategy);  if r is 'fits' or 'no': return r
  return 'unknown'

search: depth-first
  propagate to a fixpoint:  for every row, lower / upper bound of the sum from the domains;
        '<=' row: fail if the lower bound is above the constant; delete every state that pushes it above
        '>=' row: fail if the upper bound is below; delete every state that leaves it below
  implied rows (valid for every legal plan, added for strength):
        peak floor       credited peak of a trained group >= 4 F + 4 mc
        optimistic time  the same day rows with doubled seconds in which an exercise paired with another exercise is charged
                         (2 tau - m) per set and half a changeover less, and an exercise paired with a FIXED mate (2 tau - 2 m)
                         and no changeover (m = the pair's shorter rest); no pair term, so it filters well
        day-subset cut   for every set of days T and for seconds and exercise count: sum over the trained groups of the cheapest
                         amount they must spend INSIDE T to hold their smallest possible peak (a small knapsack per group,
                         exercises on other days free) <= capacity of T
  choose the next variable: z in keep order, then the peak variables (smallest domain first, ties in keep order),
        then pattern stations, then the week-1 variables (largest value first: the floors are covering rows)
  all variables fixed -> 'fits' with the witness (re-checked by the independent evaluator)
  search space exhausted -> 'no';  node budget reached -> stop this strategy
```

Every pruning step is a whole-number inequality that holds for every completion of the node, so "no" is a proof by
exhaustion and needs no tolerance. *The brute-force test earned its place:* an earlier form of the optimistic row charged an
exercise paired with a fixed mate (a class lift, a care item) as if the mate shared the saving; that bound is not valid, and
the oracle said "no" on 6 of 6,000 random questions that had a plan. The test caught it; the corrected row is the one above.
The same test showed that the generator had put one exercise into two pairs that could both be active, which breaks H3:
the grammar builder must assert H3 on every template (one line, in CI).

*Why every day has its own row.* The class member of 12.2 has 29 free minutes in the week after the back work, more than
chest needs. But Tuesday has 9.75 free and the smallest chest day is 10.2 min, and Thursday alone cannot hold ten sets. A
weekly capacity check would promise chest and the placement would have to cut it. The oracle answers "no, by one minute".

### 4.4 S1: the tiers

```
planEndpoints(instance):
  # G1 keep vector (R3-SES-02 step 2)
  kept <- []
  for g in keep order:
      if g has no candidate or is credit-only: reason[g] <- 'no_station' | 'credit_only'; continue
      free <- later groups that credit a group of kept + g            # T2 (ii)
      r <- ask(must = kept + g, free)
      if r = 'no':  r <- ask(same, session limit of g = 14)           # the usual 11 a session never costs a group its place
      if r = 'fits': kept += g
      else if r = 'no':  reason[g] <- ask(same, no time rows) = 'no' ? 'template' : 'time'
      else: reason[g] <- 'not_proven'                                  # never 'does not fit'
  # G3 pattern stations, in keep order of their groups, one per group, at most 3
  for s in pattern stations of groups not kept: if ask(kept, patterns so far + s) = 'fits': keep s
  # G4a (competitive athletes): for level = 1, 2, ...: F_d <- SA(level); stop at the first level that changes the kept set or a
  #      pattern station, keep the level before it          (one step prototyped: proto/athlevel.mjs)
  # G5 peaks: priority water-filling
  v <- for every kept group: smallest structural week 1 + mc          # a lower bound of every legal plan
  h_g <- helper allowance: what the kept donors give g at their floors, at their average credit rate   (a constant)
  top_g <- own sets that keep the credited peak at min(C, floor(S x G(N)))
  loop:
      g <- the unfrozen group with the smallest key rho_g(v_g); ties in keep order;  stop when none is left
      if v_g = top_g: freeze g ('ceiling'); continue
      if some known witness already has peaks >= v + e_g: v_g += 1; continue          # no search needed
      r <- ask(kept, patterns, peaks >= v + e_g, peaks <= top)
      r = 'fits' ? (v_g += 1; remember the witness) : freeze g ('time' | 'not_proven')
  pin the peaks to v
  # G4b (everyone else): raise the athletic level while the certificate in hand still holds with the new F_d (a re-evaluation, no search)
  # G6 week 1
  for g in keep order:  want <- clamp(credited peak - (C - S), floor, level start) as own sets
      w1_g <- the value nearest to want (lower first) for which ask(pins + week-1 sets of g = value) fits
  # G7 canonical structure (pinned questions, first that fits)
  for every group-day of a kept group in keep and week order:  try 'on', else pin 'off'
  for every active group-day:  the smallest K that fits
  for the peak, then week 1, for every kept group:  the most even split over its days, the earlier day taking the odd set;
        then the next most even ...                                   # the day yields only when it is full; the reason is printed
  certificate <- the last witness;  assert evaluator(certificate) = no violation
```

Why week 1 is "peak minus the level's climb": when the time holds less than the ceiling, starting at the floor instead of the
level start gives the group more steps, which is the stairway the coach wants (12 v1.2 section 3.10.1 plans kept groups from
the floor). When the ceiling is reached, the formula gives the level start.

### 4.5 The stairway scheduler

```
schedule(groups with S_g = D_g(1), P_g = D_g(N); N; constant sets of the week; rule 7 % | 10 %):
  planned curve T_g(w): 3 % a week to the halfway week, 5 % after it, one lambda <= 1 per group so that T_g(N) = P_g   (DEF-10)
  ideal(w) <- sum over groups of T_g(w) - S_g
  DP over weeks 2..N, state = (sorted vector of sets left, was last week flat):
      for D in 0 .. min(cap(total placed so far), number of groups with sets left):      # R-STEP.T on the PLACED total
          take one set from each of the D groups with the most left                       # L5
          reject if some group has more sets left than weeks left;  in week N everything must be placed
          cost += tier weights x [ last week flat | 100 x |placed - ideal(w)| | groups not landing | late flat | flat | hold ]
  tier weights are whole numbers computed from N and the number of sets so that each tier exceeds everything below it (< 2^53)
  who steps when: transportation flow, unit j of group g to week w at cost |w - week its own curve reaches S_g + j - 0.5|,
      one set per group per week, column sums = the rises of the DP (totally unimodular: whole numbers)
  certificate: never down, one set a week per group, the total rule on every placed week, both ends equal the certificate
```

Default tier order (data, `rules.planner.stairway.tiers`): **last, shape, land, late, flat, hold**. With it the coach's own
example line (L2, 15 -> 22) comes out as 15 15 16 16 17 17 18 19 19 20 21 22: "the last four weeks 19, 20, 21, 22"
(R3-VOL-04). His 2 x 45 example (hips 10 -> 14, calves 6 -> 7) comes out as 18 18 19 19 19 20 20 21 21 22 22 23. An L1
full-body week (eight groups 10 -> 14, calves 12 -> 14) runs 92 94 96 98 100 102 106 110 113 117 122 126: every week
rises, the largest rise is 4.3 %.

A schedule can fail to exist under the total rule: when the week total is small the cap is one or two sets a week, and
the peaks may ask for more added sets than the caps allow (41 of 5,000 random tables of real size under 7 %, 4 under 10 %).
Then, in this order and with a printed note: (1) the 10 % reading of the rule is tried; (2) the ladder's raises are undone
last in, first out until a schedule exists (every prefix of the ladder is a certified plan, so the result is again a
certificate). Neither step was needed in any of the 357 plans of the two sweeps, whose peaks come from the ladder: the 7 %
rule with "one set may always be added" was enough.

### 4.6 S2: placement

```
placeBlock(certificate, table):
  for every trained group: seq <- add sequence from n1 to nN            # 2.2 (c)
  for w in 1..N:  n(w) <- n1 + the first D_g(w) - D_g(1) steps of every seq;  x(w) <- staircase of every group-day
  supersets: start with every pair off; for each day, while some week is over L_d: switch on the pair with the largest
             saving in the last week ('needed'); every other eligible pair is printed as 'recommended' with its minutes saved
  progress cue of week w, per trained group: 'sets' when it gains a set, else 'effort' when the planned effort steps
             (3 RIR -> 2 -> 1-2 -> 1 + intensifiers), else 'reps / load' (top of the bracket, then the smallest load step)
  per-week certificate: every row of 2.4 re-evaluated from the definitions with that week's own costs and fixed seconds
```

"Never flat" as a checkable property: the display level of week w (2 -> 11, `stairway.by_N[N].display_level`) rises every
week by construction, and Q_g never drops, so the pair (level, credited sets) of every trained group rises every week. This
is the coach's own reading: "started at 2 and ended at 11, I mean the amount of volume that they're putting themselves at as
far as level, not the amount of sets" (R2-PER-05). The plan prints which dimension climbs in each week.

### 4.7 Offers and reasons: always by re-solving

```
offers(intake):
  for every longer legal session length (30 / 45 / 60 / 75 / 90 / 105 / 120):  plan <- the whole chain at that length
        say what it adds, what it trades and the new first and last week of every group
  one more day:  the whole chain on the template that intake would really get
  switches of the profile (core opener, athletic block, Olympic lift, joint care, skill ...):  the whole chain with the block off
reason(g not kept):
  'template'  no session length helps on this week layout -> the offer is another day
  'time'      the smallest whole number of extra minutes a day at which kept + g fits (bisection on exact questions),
              and the day that refuses it: the days d for which kept + g fits once only d's limit is lifted
```

Each re-solve costs what a plan costs (tens of milliseconds), so the whole list for one intake is about a dozen solves.

---

## 5. Complexity, runtime in a browser, determinism

### 5.1 Sizes

| | pickleball 2 days | CrossFit 4 days | swimmer 3 days | bound for any template |
|---|---|---|---|---|
| group-days | 10 | 11 | 15 | groups x main days <= 8 x 6 = 48 (in practice 10-30) |
| oracle variables (z, A, B, y) | 35 | 32 | 46 | about 2 x group-days + 16 |
| states per variable | <= 12 | <= 17 | <= 16 | <= 1 + sum over K of (top - bottom + 1), about 30 |
| rows | 129 | 142 | 165 | a few hundred |

### 5.2 Cost of each part

| Part | Complexity | Measured (laptop, Node 22 / V8) |
|---|---|---|
| S0, SA | linear in the stations | under 1 ms |
| one propagation pass | rows x variables-per-row x states | microseconds |
| oracle question | exponential in the worst case (the question contains a multi-knapsack), bounded by the node budget | "fits": median 6 nodes, 90th percentile 15, 99th 2,023, largest 18,619. "No": median 1, 90th 4, 99th 1,350, largest 68,817. 96 % of both within 50 nodes |
| questions per plan | G1 <= 2 per group; G3 <= patterns; G5 <= sum of (ceiling - start) + groups; G6, G7 a few per group-day | 38, 57 and 40 questions for the three samples; 56 on average over the 84 runs of the sweep. A further 1,517 ladder steps (a quarter of all) were answered by a witness already in hand, with no search |
| stairway DP | states = sorted vectors of sets left, at most a few thousand | largest 4,275 states at 8 groups x 16 weeks; about 1 ms |
| transportation | at most 60 units x 15 weeks | under 1 ms |
| S2 and certificate | weeks x exercises | under 1 ms |
| **whole plan** | | 71 sample plans: median 33 ms, 90th percentile 0.17 s, worst 4.1 s; 286 random plans (2-5 groups, 2-4 days): 9 s in all |
| offers + switches | about a dozen whole plans | the three samples with every reason, offer and switch (31 whole plans plus the reason questions): 2.7 s in all |

A phone is roughly four times slower than this laptop (assumption, not measured): about 0.15 s for the median plan and under
1 s for nine plans in ten.

### 5.3 The tail, and what happens in it

The worst cases are proofs that one more set does **not** fit when six groups are packed within a minute of the limit (the
69,000-node question: the swimmer at 75 minutes x 1.10, six groups kept). Legality never depends on such a proof. The policy:

1. Budgets are counted in nodes, never in milliseconds, so a slow phone prints the same plan as a fast laptop.
2. A budget that runs out gives the verdict "unknown". In G5-G7 the group is frozen where it stands and the tier is marked
   "best found": the plan is a legal certificate one set lower at worst. In G1 the group is not kept in this plan and is listed
   as "not proven to fit" (never "does not fit"), with the offer attached.
3. With a runtime budget of 20,000 nodes per question the sweep would have lost no "fits" answer and left one "no" unproven
   (same plan either way).
4. The structural inputs of the problem are finite (family, days, minutes, level, profile class, Focus). CI runs the whole
   grid with a large budget and asserts that no G1 question is unknown at the runtime budget (section 11.4). The tail becomes a
   build-time cost.
5. Known ways to shrink the tail further, in order of expected gain: conflict-directed backjumping (the search is
   chronological today), symmetry between twin days, a dominance row between exercise counts, a tighter pair bound. None is
   needed for correctness.

`generate()` stays synchronous. A Web Worker is optional and only matters for the offers list.

### 5.4 Determinism

- Whole numbers in every decision: seconds, quarter sets, sets, tier weights below 2^53. The only floating point is the
  planned curve (multiplication and bisection, no `Math.pow` / `exp`) and it enters as rounded hundredths.
- Fixed orders everywhere: keep order, week order, state order, the two strategies, the tier list. No clock, no randomness,
  no iteration over unordered collections in a decision.
- Canonical results, not only repeatable ones: every value a search could choose freely is pinned by a tier (G7 fixes the
  exposure days, the exercise counts and the split; the ladder's keys use a constant helper allowance, never a witness; the
  transportation cost carries the keep order). A refactor of the search cannot change a published plan as long as the answers
  are exact.
- Measured: six plans, identical bytes in Node 22 (V8) and the macOS JavaScriptCore shell (`out/det.node.txt`,
  `out/det.jsc.txt`, checksum e905a0f2).

---

## 6. Infeasibility: R3-SES-02, step by step, and what the person reads

| Coach's step (approved) | What the planner does | Tier |
|---|---|---|
| 0. The full plan when it fits | Branch "full plan": the chain is run with the full-plan day limit (factor 1.10 on full-body days, R2-SES-05). If every trainable group is kept and every ladder ends on "ceiling", the plan is printed with no warning. Otherwise the person "keeps their time" and the chain is run with the keep-time limit (factor 1.00 by default, 13.1) | T1-POL-03 |
| 1. Tell up front and offer a day or longer sessions | Before week 1: what the time holds; for every group not trained directly its reason and the minutes it would need; offers at every longer legal length and for one more day on the template that intake would really get; the profile's switches with what each buys. Every line is a re-solve | T1-POL-04 |
| 2. Keep the time: fewer groups directly, big movers first | G1 (exact, T2). A group is trained directly only with its floor, 2-4 exercises a day and its climb. There is no below-floor state | T1-POL-05, T1-POL-09 |
| "... arms, calves and rear delts only from compound credit" | groups not kept are listed with their credited sets per week; big movers keep one pattern station when it fits (G3) | T1-POL-10, T1-POL-07 |
| 3. Recommend supersets | every eligible pair carries a recommendation with the minutes it saves; a pair is marked "needed" and switched on only when a day does not hold without it | T1-POL-11 |
| 4. The stairway climbs on the trained groups, never flat | R-CLIMB is part of being kept; the ladder lifts every kept group as far as the time holds; the scheduler places the steps; the progress cue names what climbs in a week without a new set | T1-POL-12, T3-STW-02 |
| "They should be able to turn off that day's athletic or core training" | switches are constraints of a rebuild (T1-POL-14); the list shows what each one buys before the person decides | T1-POL-14 |

**The printed block** (EN strings built from plan data; each is an i18n key with arguments, EN and ES):

```
Your 2 x 45 minutes hold: calves 6 -> 7, hips 10 -> 12; one chest exercise stays as a pattern station.     [timecheck.holds]
  quads: not trained directly (time) - it would need about 10 more minutes a day beside the groups above.   [timecheck.not_direct.time]
  triceps: no exercise of its own in this week layout; counted from compound credit.                        [timecheck.not_direct.no_station]
Offers:
  2 x 60 adds quads.   2 x 75 adds quads, back and chest.   2 x 90 adds quads, back, chest and shoulders.   [offer.longer_sessions_adds]
  3 x 45 (one more day) adds quads and takes hips to its ceiling.                                           [offer.more_days_adds]
Switches:
  Core opener off on both days: hips 10.5 -> 13.5, calves 6 -> 8.                                           [offer.switch_buys]
Do these as supersets to finish on time: hinge + press (Thu), calf raise + cuff work (Mon, Thu).           [superset.needed]
```

Other keys: `timecheck.not_direct.template` ("this week layout cannot hold it at any session length; another training day
can"), `timecheck.not_direct.credit_only`, `timecheck.not_proven` ("not proven to fit in the time this page had; try a longer
session"), `offer.trades` ("... and chest then counts from pressing credit only"), `why.stopped_by_time`, `why.ceiling`,
`plan.proof.best_found`. Every "why" names the tier and the binding row: a group that is not kept for time carries the day
or days that refuse it (the days for which the same question fits once only that day's limit is lifted; "Mon or Thu" means
either one would do).

---

## 7. Athletic budgets and Receive-Create stages

Athletic work is its own budget, never muscle sets (DEF-03, LK07), but it spends the same minutes. Stage SA plans it **before**
any resistance set, so its minutes are inside F_d(w) when stage 1 asks its first question (DR-13, DR-15, DR-16; closes RC8).

**Levels.** A level is a complete list of athletic stations per day with their sets per exercise block. Level 0 is the
*protected minimum* of the profile class; each further level adds the next station or set in the profile's order until the
level whose capacity meets every weekly target. Seconds per day and week are a function of the level only (stations and
sets), and never drop from one week to the next.

| Profile class | Level 0 (PROPOSED defaults, 13.1 item 4) | Where the level is raised |
|---|---|---|
| competitive athlete | the approved structure at its smallest dose: the template's jump / throw stations at 2 sets, one Olympic lift on its days (T0-ATH-01), sport care every session where approved (swimmers: R3-ATH-01) | G4a: before the peaks, never at the cost of a kept group |
| stay-active, general | the approved profile defaults at their smallest dose: one athletic piece a day, one joint-care item (racket 50+: R3-ATH-02) | G4b: after the peaks, only if no resistance set changes |

**Doses.** For every budget key k (jump contacts, low contacts, throws, cuts, sprint metres, Olympic sets) with weekly target
A*_k(w) from the profile (DER-11: range low -> high along the stair progress, phase factors):

```
capacity_k(w) = sum over its stations of sets x largest dose per set          (rules.athletic.reconcile.per_set_max)
scale_k       = min(1, min over w of capacity_k(w) / A*_k(w))                 one scale per key, printed
A_k(w)        = max( A_k(w-1), min(capacity_k(w), round(scale_k x A*_k(w))) )  climbs with the stairway, lands on the capacity, never drops
stations      : A_k(w) shared out by a divisor (Webster) rule on the sets     a larger total never takes from any station
per set       : ceil(station total / sets), inside [per_set_min, per_set_max]; never below last week's
plyometric share: the split of jump work between plyometric and ballistic stations follows the stage share
                  (end share by ground-contact class, 15 points more ballistic at block start), rounded the same way (T3-ATH-02)
```

Largest-remainder rounding is not used for anything that is recomputed with a growing total: it can take a contact away from
a station when the total grows. Divisor rules cannot.

**Receive-Create stages** (T0-ATH-02). One stage per exercise block (RC1 Land, RC2 Land & Go, RC3 Repeat; the shape's
snapped table), never backwards. A stage changes the *drills* (selection picks from the stage's qualities), which happens
only at an exercise-block start, the same boundary where the resistance exercises change. Stations and sets belong to the
level, so a stage change does not move minutes unless the level says so, and then E1 already covers it (2.3).

**Honesty.** A key whose level has no station is printed as such with its target, and the switch list says what the next
athletic level costs. For the pickleball player at 2 x 45: throws 30 -> 40 a week (58 % of the profile's 51 -> 69: one throw
station of 2 sets), low jumps 2 x 4, no ankle-hop station at this level ("fits from 2 x 60"). For the swimmer: throws 35 -> 45
(100 %), ankle contacts 12 -> 27 (100 %), jumps 26 -> 32 (70 %: two jump stations of 2 sets; a third set on each is the next
level), Olympic sets 6 -> 7 -> 8 by exercise block. Output of `proto/athletic.mjs` in `out/athletic.out.txt`.

**One G4a step, run** (`proto/athlevel.mjs`, `out/athlevel.out.txt`). The swimmer's level 1 is a third set on both jump
stations (jumps to 100 % of the target; 1.65 min more on Monday, 2.15 on Friday). Re-solved with those minutes, back and
hips are still kept (10 -> 14, 10 -> 12) but the single-leg knee station no longer fits. Level 1 changes a pattern station,
so the default order keeps level 0 and prints: "jumps at 70 %; the full jump dose costs the knee exercise on Friday".

---

## 8. Exercise selection and block-to-block variation

**Order of work.** `selectBlock` runs before the planner, as today, but on the **uncut** week: it picks an exercise for every
candidate of every exercise block (ladder, kit, pain, age, laterality share by exercise block, one-detail variations,
T8-VAR-02). The planner reads from each pick only three things: time class and dose parameters (seconds per set), credit
class (quarter credits), and set bounds.

**The contract that keeps the guarantees.** Inside a stairway block, the i-th exercise of a group-day may change at an
exercise-block start (the block's variation) but

- its credit vector stays the same (same credit class; H1), and
- its seconds per set stay at or under the reserved seconds the certificate used (H2).

Selection already varies exercises by one or two small details inside the same bucket, so the first holds by construction;
the second is the reason E1 uses the largest seconds over the exercise blocks. After planning, a second selection pass may
swap picks of active exercises for variety or duplicates **inside the same time and credit class** (a class-preserving swap
cannot change a minute or a credit, so nothing is re-proved).

**What selection can no longer do.** It cannot change laterality after the plan is built (unilateral work costs 1.5 x the
time); the bilateral share is a decision of the picks before S1. It cannot add or remove an exercise.

**Block-to-block.** The next training block is a new instance: start x 1.05 and ceiling + 1 per completed block (DER-09), new
picks, the stairway restarts from its own week 1. Nothing is stored; the count of completed blocks is an intake field.

**User edits** (T1-POL-14). Removing or adding an exercise or switching a block off is a rebuild with pins: a removed
exercise is deleted from the candidates, an added one is appended to its group-day, a block switched off removes its seconds
from F_d. The same chain runs; the result is again a certificate.

---

## 9. How a coach's own rules plug in

Three layers, all data (generator spec layers: locked > coach rule pack > Blaze defaults > client preferences).

1. **Parameters.** All 55 tunable parameters of the inventory (P-01 ... P-55) are read where the rows are built: floor,
   ceilings, Focus add, minimum climb, keep order, pins, day-limit factors, time model, exercise budgets, per-session limit,
   stairway steps and tier order, athletic levels and per-set doses. Changing one changes a constant of a row, never code.
   Section 12 shows five such switches re-solved per sample.
2. **Rule packs.** A custom rule is accepted when it has one of four shapes, because those are the shapes the proofs of
   section 3 cover:

   | Shape | Examples | Why the guarantees survive |
   |---|---|---|
   | upper limit on a tally that never decreases in the sets (seconds, credited sets of a group or a day, exercise count) | "no more than 9 sets of shoulders in a session", "Friday at most 50 minutes", "at most 6 exercises a day" | holds at the peak vector, so in every week (L3) |
   | lower limit on such a tally at week 1 | "chest at least 12 from week 1", "rear delts at least 4 own sets" | holds at week 1, so in every week (L3) |
   | structure rule on z, K, y | "always keep the squat pattern", "chest on two days", "never three exercises of arms", "calves are Focus" | constant over the block (H1) |
   | tier term or order | "landing before shape", "Focus groups first in the ladder", "prefer three exposure days" | a pin order; lexicographic, cannot disturb a higher tier |

   Anything else (a two-sided ratio on sets, a rule on one middle week) is loaded as a scored soft metric and flagged; it
   cannot silently break a proof.
3. **Catalogue.** Every rule, built-in or custom, is one entry: id, inventory ids, coach reference, tier, shape, and an
   evaluator on a week of sets. The oracle builds its rows from the entries; `validate.mjs` and the benchmark scorer evaluate
   the same entries on the finished plan. An exemption can only exist as a named parameter.

---

## 10. Migration from the current engine

### 10.1 Per file

| File | Fate | Detail |
|---|---|---|
| `intake.mjs`, `shape.mjs`, `model.mjs`, `util.mjs`, `render.mjs`, `explain.mjs`, `budget.mjs`, `version.mjs` | keep | the plan JSON (`plan/2`) keeps its shape; new facts go into `time_check`, `why`, `meta.planner` |
| `select.mjs` | keep, called on the uncut week | plus the class-preserving re-pick (section 8) |
| `dose.mjs` | keep | export `doseParams(slot, pick, weekShape)`; `doseItem` prints exactly these (one time function) |
| `timefit.mjs` | keep lines, groups, credits | `setCost`, `supersetMinutes` move into `plan/timecost` as the single definition |
| `week.mjs` | change | `buildWeekLayout` returns every template station as a candidate (no `applyCuts`, `enforceAthleteCap`, `moveGroupsToOptional`, `ensureAthleticTracks` at build time); `layoutForWeek` applies the plan's active set; `estimateMinutes` calls `plan/timecost` |
| `athletic.mjs` | split | targets (`athleticBudget`) kept; stations and doses become SA levels; the reconcile in `generate.collectWeek` is deleted |
| `volume.mjs` | replace | `computeTargets` kept (moved); `planWeeklySets` becomes an adapter over the new modules with the same `VolumePlan` shape; `timeCheck`, the probes, `finishCheck`, `trimToTime`, the placement passes, `buildSchedule` and the 40-attempt retry are deleted |
| `validate.mjs` | change | reads the catalogue; the exemptions of RC10 (V22 skips, the 0.5-set tolerance, 110 % as "fits") become parameters or disappear |
| `generate.mjs` | small change | one call to the planner between selection and dosing; `est_minutes` is the planner's seconds |
| `tests/review-*.test.mjs` | re-express or retire | each asserted patch becomes a rule-id property of the catalogue, or is retired with the decision it tested |

### 10.2 Slices (each scored on the benchmark before the next; the old engine stays behind the existing `generateWith(deps)` seam)

1. Units, time function, catalogue and the independent scorer. The current engine is scored as the baseline.
2. Scheduler and placement behind a model flag, fed with certificates of today's layouts where they certify. This alone
   replaces the four rounding regimes.
3. Grammar (uncut week), oracle and S1. The keep vector, peaks and structure come from the new chain.
4. SA levels; cuts and the athletic reconcile removed.
5. Offers and reasons by re-solving; old volume code and retired tests deleted.

### 10.3 What the plan JSON gains

`time_check.outcome` (full | keep_time), `day_limit`, `not_trained_directly[].reason` and `.minutes_missing`,
`pattern_stations[]`, `lowered_peak[] = {group, peak, ceiling, stopped_by}`, `offers[]` with `adds` / `trades`, `switches[]`,
`meta.planner = {questions, nodes, unknown, tiers: [{tier, status: proven | best_found}], defaults_used}`.
`trained_below_floor` is always empty.

New model data lives under one new key, `rules.planner` (day-limit factors per branch, `test_days`, extension buckets, the
exercise-budget margin, the stairway tier order, the node budget, the athletic levels per profile class). Every other number
is read from the keys that exist today (`session.time_fit.keep_order`, `volume.pattern_keep`, `stairway.*`, `time_model.*`,
`athletic.reconcile.*`).

### 10.4 Formats that do not climb in sets per group

Timed circuits (bootcamp: work seconds 35 -> 50, rounds), the class model's lifts (HALF TIME levels on a fixed 3 sets),
conjugate strength days (the work, the accessory, the nuance, the survival) and flat blocks (maintenance, pre-season, taper,
in-season) keep small format handlers. Each produces fixed items for the grammar (seconds and credits per week), so the same
oracle, certificate and proofs cover the rest of the day. Section 12.2 shows this for the class.

---

## 11. Test strategy

### 11.1 The definition of done is outside the planner

An independent scorer (to be written first, slice 1; it shares only the rule catalogue with the planner) computes every
metric of the inventory on the plan JSON. Acceptance is its numbers on the benchmark corpus, never `validation.ok`. In the
prototype this role is played by `core.checkEndpoints` and the per-week certificate of `stage2.mjs`, which share the time
function with the oracle but none of its search or pruning code.

### 11.2 Property tests (the prototype's are in `proto/test_*.mjs`; generators use `Math.imul`, and every test prints and asserts the distribution it drew)

| Property | Oracle it is tested against | Prototype result |
|---|---|---|
| P1 the oracle's verdict is exact | brute force over the independent evaluator on random small instances (2-3 groups, 1-2 days, pairs, pattern stations, fixed mates, strength rests, class credits) | 1,500 instances, 6,000 questions: 1,883 fits, 4,117 no, 0 unknown; **0 verdicts differ** (`out/test_oracle.out.txt`). Earlier runs of this test found the bug described in 4.3 |
| P2 every "fits" witness passes the evaluator | `checkEndpoints` | same run: 0 rejected |
| P3 the scheduler is optimal for its tier order and certified | brute force over every table on small plans; certificate on real sizes | 3,000 small plans, 0 differences; 10,000 real-size plans, 0 failures |
| P4 the link: every week of every plan passes every hard row, re-computed from the definitions with that week's own costs | the evaluator, on random instances with changing costs by exercise block and non-monotone fixed minutes | 286 plans, 2,478 plan-weeks, 0 violations |
| P5 no exercise ever loses a set; every week lies between the certified ends; the staircase holds | direct check | same run, 0 |
| P6 the table printed equals the table placed, and both ends equal the certificate | direct check | same run, 0 |
| P7 the keep vector never gets lexicographically worse with more minutes | sweep at the seven legal lengths | 72 steps, 0 worse (3 steps where a kept group left for a higher-priority one: reported, allowed) |
| P8 determinism | same bytes twice and in V8 and JavaScriptCore | identical |
| P9 no day over the limit in any week of any plan | direct check | largest (day seconds - limit) = 0 over 772 plan-weeks |
| P10 lexicographic order: changing a lower tier's data never changes a higher tier's result | re-run with permuted tier data (planned) | - |
| P11 the ladder's optimum equals exhaustive search on small instances | brute force over peak vectors (planned) | - |
| P12 every offered schedule, run as an intake, is valid and gives exactly what the offer said | by construction (offers are re-solves); asserted | - |
| P13 parameter robustness: floors 8-12, total rule 7 or 10 %, day factor 1.0-1.1, ceilings to 30: P1-P9 still pass | planned | - |

### 11.3 Golden tests from the coach's own material

His L2 line 15 -> 22 ("the last four weeks 19, 20, 21, 22"): reproduced by the scheduler. His 2 x 45 example (12 v1.2 section
5.5): the keep sets at 45, 60 and 75 minutes (calves + hips; + quads; + quads, back). The BYOP day 1 (7 exercises, 19 sets,
about 60 minutes) for the time function.

### 11.4 The certified grid (CI)

Every cell of family x days x minutes x level x profile class (a few thousand) is solved offline with a large budget. CI asserts:
no G1 question unknown at the runtime budget; the runtime keep vector equals the certified one; peaks within one set; 0
violations of P4-P9. A second, independent solver (the research kernel `design/research/milp.mjs` on the slot-level model, or
HiGHS as a dev dependency) confirms the keep vectors on the grid. Nothing in the shipped plan depends on it.

### 11.5 The benchmark

The 8 samples, the minutes and days sweep of diagnosis 1.8 with the corrected property (P7), a random corpus, and the metrics
of `rules_as_constraints.json` (`metrics_index`): floor misses, set drops, days not holding, exercise counts, athletic
adherence and climb, offer validity. A change that improves one sample may not lower another sample's score.

---

## 12. Hand simulation on the three hardest samples

**Method.** Each sample is written out as a stage-0 instance in `proto/samples.mjs` (candidates per group and day from the
template day types; fixed blocks from the layouts the frozen engine snapshot builds for the same intake; per-set seconds from
`rules.time_model`: bilateral compound 2.25 min, unilateral compound 3.0, isolation 1.85, heavy lift with strength rest 5.25,
changeover 1.0 or 0.5 in a pair; warm-up 8, core opener 5.5 as a pair). The chain of section 4 was then run by the prototype;
the arithmetic of one day per sample is repeated by hand below so the numbers can be checked without the code. Every decision
quoted is an exact oracle verdict (0 unknown). Full output: `out/samples.out.txt`, `out/detail.out.txt`.

Simplifications of these three instances: no Focus muscle and no optional-day slots (none of the three intakes has a Focus;
the optional days carry only core and cardio), tests outside the day limit (default), laterality of candidates the engine cut
taken from the bucket default. Day limit: the keep-time branch, 100 % of the chosen minutes.

### 12.1 Sample 08: pickleball, 52 years, L1, stay-active, mild knee pain, 2 x 45 (Mon A knee + pull, Thu B hip + push), 12 weeks

**Stage 0.**

| Item | Value | Source |
|---|---|---|
| keep order | calves (pinned), hips, quads, back, chest, shoulders; triceps and biceps have no station in this layout | R3-ATH-02 pin, `time_fit.keep_order_r2` |
| targets (start -> ceiling, credited sets) | calves 6 -> 8 (3 per leg day, 4 at most), hips 10 -> 13, quads 6 -> 7 (knee pain: start x 0.6, not floored, gentle climb), back, chest, shoulders 10 -> 13 | engine `D9_start_sets` (L1 x 0.8, floor 10); DER-04, DER-06 |
| fixed blocks, minutes | Mon: warm-up 8.0 + core opener 5.5 + medball throw 2 sets 4.2 + one cuff-care item 3.7 = **21.4**. Thu: 8.0 + 5.5 + low jump 2 sets 4.3 + 3.7 = **21.5** | SA level 0 (one athletic piece a day; R3-ATH-02 defaults at their smallest dose) |
| candidates | Mon: hips [single-leg hinge, leg curl, glute bridge], quads [step-up (the work), leg extension, +1], back [row, pulldown, +1], shoulders [press, shoulder isolation, +1], calves [calf raise]. Thu: hips [single-leg hinge (the work), leg curl, +1], chest [press, fly, +1], quads [+3], back [+3], calves | template `athletic.2` day types A and B; picks' laterality from the engine |
| pairs | Mon: step-up + row, hinge + press, leg extension + pulldown. Thu: hinge + press, single-leg knee + row, leg curl + fly, leg extension + pulldown. Calf raise + cuff care | template pair tags |

**Stage 1, G1 (who is trained).** Free minutes after the fixed blocks: 23.6 on Monday, 23.5 on Thursday.

| Question | Verdict | The arithmetic behind it |
|---|---|---|
| calves | fits | 3 sets on each leg day: 3 x 1.85 + 1 = 6.55 min, 4.05 as a superset with the cuff item |
| calves + hips | fits | hips need 10 in week 1 and 12 at the peak with 2 exercises a day: 6 sets a day at the peak = 3 x 3.0 + 3 x 1.85 + 2 = 16.55. Monday at the peak: 21.4 + 5.9 (4 calf sets, superset) + 16.55 = **43.85 <= 45** |
| + quads (6 -> 7; it must train on Monday, where it holds the day's work lift) | no (proved in 1 node) | the smallest quads day is 2 exercises x 2 sets: 2 x 3.0 + 2 x 1.85 + 2 = 11.7 min; Monday has about 3 min left beside calves and hips. The oracle's exact answer: about 10 more minutes a day; Monday is the day that refuses it |
| + back / + chest / + shoulders | no | they would need about 14, 14 and 15 more minutes a day (back: Monday or Thursday; chest: Thursday; shoulders: Monday) |

**G3 (pattern stations).** In keep order: a single-leg knee exercise (no: 2 sets cost 7 min), a row (no: 5.5 min), a press on
Thursday as the hinge's pair partner (fits: 2 sets inside the hinge's rests cost 5.5 - 4.0 = 1.5 min). **G5 (peaks).** Calves to 8: no. Hips to 13: no. Both
frozen by time. **G6 (week 1).** Hips: peak 12 minus the level's climb 3 gives 9, clamped to the floor: 10. Calves 6.
**G7.** Both hip days stay, 2 exercises each, split 6 / 6 at the peak and 5 / 5 in week 1; the odd calf set goes to Monday.
38 questions, 130 search nodes in all, 0 unknown.

**Scheduler.** Three sets to add in eleven steps: 8 flat weeks are the arithmetic minimum. Steps in week 4 (hips, Monday),
week 8 (calves, Monday) and week 12 (hips, Thursday).

**Weekly credited sets per group (main days).**

| Group | w1 | w2 | w3 | w4 | w5 | w6 | w7 | w8 | w9 | w10 | w11 | w12 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| calves (trained) | 6 | 6 | 6 | 6 | 6 | 6 | 6 | 7 | 7 | 7 | 7 | 7 |
| hips (trained) | 10 | 10 | 10 | 11 | 11 | 11 | 11 | 11 | 11 | 11 | 11 | 12 |
| chest (pattern station) | 2 | 2 | 2 | 2 | 2 | 2 | 2 | 2 | 2 | 2 | 2 | 2 |
| shoulders, triceps (credit) | 0.5 | 0.5 | 0.5 | 0.5 | 0.5 | 0.5 | 0.5 | 0.5 | 0.5 | 0.5 | 0.5 | 0.5 |
| all resistance sets | 18 | 18 | 18 | 19 | 19 | 19 | 19 | 20 | 20 | 20 | 20 | 21 |

In the eight weeks without a new set the plan names what climbs instead: reps to the top of the bracket, then the smallest
load step, and the planned effort step of the week (4.6). The display level runs 2 -> 11 as in every 12-week block.

**Minutes per day** (limit 45; supersets on only where needed: calf raise + cuff care on both days, hinge + press on Thursday).

| Day | w1 | w2 | w3 | w4 | w5 | w6 | w7 | w8 | w9 | w10 | w11 | w12 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Mon | 40.2 | 40.2 | 40.2 | 42.0 | 42.0 | 42.0 | 42.0 | 43.9 | 43.9 | 43.9 | 43.9 | 43.9 |
| Thu | 41.8 | 41.8 | 41.8 | 41.8 | 41.8 | 41.8 | 41.8 | 41.8 | 41.8 | 41.8 | 41.8 | 43.6 |

**Sets per exercise (stage 2).** Mon: calf raise 3 (4 from week 8), single-leg hinge 3, leg curl 2 (3 from week 4). Thu: calf
raise 3, single-leg hinge 3, leg curl 2 (3 in week 12), press 2 (pattern). Three resistance exercises on Monday, four on
Thursday, beside the two core exercises, one athletic piece and one care item.

**Athletic (SA level 0).** Throws 30 -> 40 a week (2 x 15 -> 2 x 20; 58 % of the profile's target, printed), low jumps
2 x 4, no ankle-hop station and no Olympic piece at this level; stage RC1, RC2, RC3 by exercise block.

**Told before week 1, offers and switches (every line re-solved).**

| | Result |
|---|---|
| 2 x 60 | adds quads: calves 6 -> 8, hips 10 -> 12.25, quads 6 -> 7 |
| 2 x 75 | adds quads, back and chest: hips 10.75 -> 13, back 10 -> 13, chest 10 -> 12 (12 chest sets on Thursday: above the usual 11 a session, printed) |
| 2 x 90 and longer | adds shoulders too: the full plan of this layout (50 -> 62 sets) |
| 3 x 45 (one more day, template `athletic.3`, Mon / Tue / Thu) | calves 9 -> 10, hips 10.75 -> 13 (its ceiling), quads 6 -> 7 (its ceiling), a press as pattern station; 27 -> 31 sets; longest days 45.0 / 44.4 / 45.0 |
| core opener off | calves 6 -> 8, hips 10.5 -> 13.5, pattern stations for quads, back and chest |
| athletic piece off | hips 10.5 -> 12.5, pattern stations for quads, back and chest |
| cuff care inside the warm-up (as in the coach's example) | calves 6 -> 8, hips 10 -> 12 |
| two joint-care items a day (the engine's layout today) | **only calves 6 -> 7**; hips, quads and back as pattern stations. The second care item costs the plan its one big mover |
| day limit 110 % | hips 10.5 -> 12.5, pattern stations for quads, back and chest; days up to 48.5 |

**Against the documents.** The coach's worked example for this kind of client (12 v1.2 section 5.5) keeps calves + hips at
2 x 45, adds quads at 2 x 60 and quads + back at 2 x 75. The planner reproduces those keep sets (and finds that chest also
fits at 75). The example's client is L2 with hips 10 -> 14; this sample is L1 with a ceiling of 13 and reaches 12 at 2 x 45
and 13 at 2 x 75 or with a third day.
Of the current engine the diagnosis records "pickleball 3 x 45 trains only chest and calves"; here one more day adds quads
and lifts hips to the ceiling.

### 12.2 Sample 04: CrossFit-style class, 35 years, L2, stay-active, 4 x 60 (Mon squat, Tue press + snatch, Thu deadlift, Fri clean + pull), 8 weeks

**Stage 0.** The class stays a class: its lifts are fixed items (format handler, 10.4).

| Item | Value |
|---|---|
| keep order | hips, quads, back, chest, calves, shoulders, biceps; triceps have no station |
| targets | hips, quads, back, chest 12 -> 18; shoulders, biceps 10 -> 18; calves 6 -> 8 |
| fixed blocks, minutes | Mon: warm-up 8.0 + skill 6.0 + core 5.5 + **class squat 3 sets 16.75** + WOD 10.0 = **46.25**. Tue: 8.0 + 5.5 + snatch 3 sets 10.0 + **class press 16.75** + WOD 10.0 = **50.25**. Thu: 8.0 + 6.0 + 5.5 + **class deadlift 16.75** + 10.0 = **46.25**. Fri: 8.0 + 5.5 + clean 3 sets 10.0 + WOD 10.0 = **33.5** |
| class lifts | 3 sets at the HALF TIME level, strength rest (5.25 min a set in the time model); credited: quads 3, hips 3 + 0.75, shoulders 3; printed as class lifts, never as a trained group; they count as exercise 1 of their group on that day when the group is trained |
| candidates | Mon: quads [single-leg knee, leg extension, +1] beside the class squat, back [single-arm row, pull-up, +1], calves, shoulders [three isolation exercises]. Tue: shoulders [isolation, +2] beside the class press, chest [press, fly, +1]. Thu: hips [single-leg hinge, glute, leg curl] beside the deadlift, chest [bench, fly, +1], calves. Fri: back [row (the work), chin-up, +1], biceps [curl, curl, +1] |
| pairs | Mon: row with the class squat (the row rides in the squat's rest), single-leg knee + pull-up. Thu: bench with the class deadlift, single-leg hinge + fly |

Free minutes: Mon 13.75, Tue 9.75, Thu 13.75, Fri 26.5.

**Stage 1.**

| Question | Verdict | Arithmetic |
|---|---|---|
| hips | no | 10 credited needs 7 own sets on Thursday beside the deadlift's 3.75 credited, and 9 at the peak: three exercises of 3 sets cost 3 x 3.0 + 3 x 2.25 + 3 x 1.85 + 3 = 24.3 min against 13.75 free. About 11 more minutes a day; Thursday is the day |
| quads | no | the same on Monday: about 16 more minutes a day |
| back | **fits** | Mon single-arm row 3 + pull-up 3: 3 x 3.0 + 3 x 2.25 + 2 = 17.75, minus 5.5 for the row done in the squat's rests = 12.25 <= 13.75. Fri row + chin-up up to 9 sets |
| back + chest | no, by about 1 minute a day | Tuesday has 9.75 free; the smallest chest day (2 exercises x 2 sets) is 10.2. Thursday alone cannot hold 10 |
| + calves / shoulders / biceps | no | about 2, 5 and 6 more minutes a day |

The chest line is the reason stage 1 must check **per day**: the week has 29 free minutes after back, more than chest needs,
but no day can hold its minimum. A weekly capacity check would promise chest and stage 2 would have to cut it.

**G3.** The bench stays on Thursday as the deadlift's pair partner (2 sets: 5.5 min straight, 1.5 min inside the deadlift's
rests; Thursday holds it straight, so the superset is only recommended). **G5.** Back climbs to 15: that is the
most the standard steps allow from 12 in 8 weeks (12 x 1.328 = 15.9), so the ladder stops on "ceiling", not on time.
**G6.** Week 1 = 12 (the level start). **G7.** Both back days stay with 2 exercises. Monday cannot take a seventh set (58.5 + 3.0 = 61.5), so Monday holds 6
and Friday takes the climb to 9; the plan prints that reason. 40 questions, 113 nodes, 0 unknown.

**Weekly credited sets per group (main days).**

| Group | w1 | w2 | w3 | w4 | w5 | w6 | w7 | w8 |
|---|---|---|---|---|---|---|---|---|
| back (trained) | 12 | 12 | 13 | 13 | 13 | 14 | 14 | 15 |
| quads (class squat, credit) | 3 | 3 | 3 | 3 | 3 | 3 | 3 | 3 |
| hips (class deadlift + squat credit) | 3.75 | 3.75 | 3.75 | 3.75 | 3.75 | 3.75 | 3.75 | 3.75 |
| shoulders (class press + row credit) | 5 | 5 | 5.25 | 5.25 | 5.25 | 5.25 | 5.25 | 5.5 |
| chest (pattern station) | 2 | 2 | 2 | 2 | 2 | 2 | 2 | 2 |
| biceps (credit) | 3 | 3 | 3.25 | 3.25 | 3.25 | 3.5 | 3.5 | 3.75 |
| triceps (credit) | 1.25 | 1.25 | 1.25 | 1.25 | 1.25 | 1.25 | 1.25 | 1.25 |
| all resistance sets (class lifts included) | 23 | 23 | 24 | 24 | 24 | 25 | 25 | 26 |

The class lifts climb in their own variable (HALF TIME level: 3 x 7 toward 3 x 4, heavier each week), not in sets.

**Minutes per day** (limit 60; the row + squat superset is needed on Monday).

| Day | w1 | w2 | w3 | w4 | w5 | w6 | w7 | w8 |
|---|---|---|---|---|---|---|---|---|
| Mon | 58.5 | 58.5 | 58.5 | 58.5 | 58.5 | 58.5 | 58.5 | 58.5 |
| Tue | 50.3 | 50.3 | 50.3 | 50.3 | 50.3 | 50.3 | 50.3 | 50.3 |
| Thu | 51.8 | 51.8 | 51.8 | 51.8 | 51.8 | 51.8 | 51.8 | 51.8 |
| Fri | 49.0 | 49.0 | 51.3 | 51.3 | 51.3 | 53.5 | 53.5 | 55.8 |

Check of Friday, week 8 by hand: 33.5 + row 5 x 2.25 + chin-up 4 x 2.25 + 2 changeovers = 33.5 + 11.25 + 9.0 + 2.0 = 55.75.

**Offers and switches.**

| | Result |
|---|---|
| 4 x 75 | adds hips, quads and chest: hips 10.75 -> 14, quads 10 -> 12, back 11 -> 14, chest 12 -> 15 (quads and hips each sit on one day there, with 12 or more credited sets in that session: above the usual 11, printed) |
| 4 x 90 | adds calves, shoulders and biceps as well: seven groups, 65 -> 81 sets |
| 4 x 105 | the full plan of this layout |
| skill block off (Mon, Thu) | back 12 -> 15, calves 6 -> 7 |
| core opener off | back 12 -> 15, chest 10 -> 13, calves 6 -> 7 |
| class-lift rest 3 min instead of 4.5 (a time-model parameter) | back 11 -> 14, chest 10 -> 12, calves 6 -> 7 |
| WOD 15 min instead of 10 | back 10 -> 12 only |
| day limit 110 % | back 12 -> 15, chest 11 -> 14, calves 6 -> 7; days up to 65.7 |

**Against the documents.** `05_session_architecture` 8.7.1 says of this class at 60 minutes: "step 1: tell + offer 90 min (peak ~95) or
another day". The planner agrees and is specific: one group is trained directly at 60; the heavy lifts with their long
rests, the skill block and the WOD take 46-50 of the 60 minutes on three of the four days. It prints no group under the floor
as "trained" (today: quads 5 -> 6 and hips 6.25 -> 7.5).

### 12.3 Sample 01: competitive swimmer, 16 years, L2, off-season, 3 x 60 (Mon S1 knee + pull, Wed S2 hip + push, Fri S3 hip + push), 12 weeks

**Stage 0.**

| Item | Value |
|---|---|
| keep order | back, hips, quads (the profile's priorities: lats and upper back, glutes, quads), chest, calves, shoulders; arms are credit-only for field athletes (T2-FLR-04) |
| targets | back 15 -> 21 (1.5 x chest, DER-08), hips 11 -> 16, quads 11 -> 16, chest 10 -> 14, calves 9 -> 12, shoulders 10 -> 16 |
| fixed blocks, minutes (SA level 0) | Mon: warm-up 8.0 + core 5.5 + box jump 2 sets 4.3 + hang power clean 2 sets 7.0 (3 sets from week 5: 10.0) + shoulder care 2.35 = **27.15, then 30.15**. Wed: 8.0 + 5.5 + upper plyo, ankle hops and throw 11.3 + DB snatch 7.0 (10.0 from week 9) + 2.35 = **34.15, then 37.15**. Fri: 8.0 + 5.5 + jump + throw as a pair 5.3 + clean pull 7.0 + 2.35 = **28.15** |
| field-athlete cap | 12 exercises a day minus the athletic stations: 10, 9, 9 for resistance |
| candidates | Mon: quads [squat (the work; strength rest in weeks 9-12), leg extension, +1], back [single-arm row, pulldown, +1], hips [single-leg hinge, leg curl, +1], shoulders [press, shoulder isolation, +1], calves. Wed: hips [hip extension (the work), single-leg deadlift, +1], chest [press, fly, +1], quads [single-leg knee, leg extension, +1], back [row, pulldown, +1], calves. Fri: hips [trap-bar deadlift (the work; strength rest in weeks 9-12), leg curl, +1], chest, quads, back, calves |

Free minutes in the last weeks: Mon 29.85, Wed 22.85, Fri 31.85.

**Stage 1.**

| Question | Verdict | Arithmetic |
|---|---|---|
| back | fits | |
| back + hips | fits | hips train on Wednesday and Friday (they hold the work lift on both) |
| back + hips + quads | no | quads must train on Monday with the squat as its work lift, and in weeks 9-12 a squat set costs 5.25 min: the smallest quads day there (squat 2 + leg extension 2) is 16.2 min, and quads need 12 sets at the peak beside back's 12 and hips' 12. Exact answer: about 6 more minutes a day; lifting any one day's limit would do |
| + chest / calves / shoulders | no | about 4, 7 and 6 more minutes a day (chest and calves: Wednesday or Friday; shoulders: Monday or Wednesday) |

**G3.** A single-leg knee exercise stays on Friday as a pattern station for quads (2 sets, paired with the row). **G4a.** The
next athletic level (a third set on both jump stations: jumps from 70 % to 100 % of the target, 1.65 min more on Monday and
2.15 on Friday) was re-solved: back 10 -> 14 and hips 10 -> 12 stay, the knee station does not. A pattern station would
change, so level 0 stays (`out/athlevel.out.txt`); 13.1 item 8 is the coach's choice here. **G5.** Back to 15, hips to 12 own sets (12.5 credited with the knee
station's quarter credit); both stop on time. **G6.** Week 1: back 10, hips 10. **G7.** Back on Monday (3 exercises) and
Friday (2); hips on Wednesday (3) and Friday (2). Friday is full from week 9 (59.9), so Friday holds its 4 + 4 sets and the
climbs go to Monday and Wednesday: the day yields only when it is full, and the plan says so. 57 questions, 2,166 nodes,
0 unknown.

**Weekly credited sets per group (main days).**

| Group | w1 | w2 | w3 | w4 | w5 | w6 | w7 | w8 | w9 | w10 | w11 | w12 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| back (trained) | 10 | 10 | 11 | 11 | 11 | 11 | 12 | 13 | 13 | 14 | 14 | 15 |
| hips (trained) | 10.5 | 10.5 | 10.5 | 10.5 | 11.5 | 11.5 | 11.5 | 11.5 | 11.5 | 11.5 | 12.5 | 12.5 |
| quads (pattern station) | 2 | 2 | 2 | 2 | 2 | 2 | 2 | 2 | 2 | 2 | 2 | 2 |
| shoulders (credit) | 1 | 1 | 1.25 | 1.25 | 1.25 | 1.25 | 1.25 | 1.25 | 1.25 | 1.5 | 1.5 | 1.5 |
| biceps (credit) | 2.5 | 2.5 | 2.75 | 2.75 | 2.75 | 2.75 | 3 | 3.25 | 3.25 | 3.5 | 3.5 | 3.75 |
| all resistance sets | 22 | 22 | 23 | 23 | 24 | 24 | 25 | 26 | 26 | 27 | 28 | 29 |

Seven sets are added in eleven steps: 4 flat weeks are the minimum, and the schedule has 4. The last three weeks each add
a set.

**Minutes per day** (limit 60; supersets needed only on Friday: single-leg knee + row).

| Day | w1 | w2 | w3 | w4 | w5 | w6 | w7 | w8 | w9 | w10 | w11 | w12 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Mon | 44.4 | 44.4 | 47.4 | 47.4 | 50.4 | 50.4 | 52.6 | 54.5 | 54.5 | 57.5 | 57.5 | 59.7 |
| Wed | 51.4 | 51.4 | 51.4 | 51.4 | 53.6 | 53.6 | 53.6 | 53.6 | 56.6 | 56.6 | 59.6 | 59.6 |
| Fri | 53.9 | 53.9 | 53.9 | 53.9 | 53.9 | 53.9 | 53.9 | 53.9 | 59.9 | 59.9 | 59.9 | 59.9 |

Check of Friday, week 12 by hand: fixed 28.15 + back (row 2 x 2.25 + single-arm pulldown 2 x 3.0 + 2 = 12.5) + hips
(deadlift 2 x 5.25 + leg curl 2 x 1.85 + 2 = 16.2) + single-leg knee (2 x 3.0 + 1 = 7.0) = 63.85, minus 4.0 for the
knee + row superset = 59.85. Monday, week 12: 30.15 + back (4 x 3.0 + 4 x 2.25 + 3 x 1.85 + 3 = 29.55) = 59.7. Friday jumps by 6 minutes
in week 9 with no new set: that is the deadlift's strength rest in the last exercise block. The certificate had already
reserved it (2.3), which is why weeks 1-8 leave Friday at 53.9.

**Sets per exercise.** Mon: single-arm row 2 -> 4, pulldown 2 -> 4, second pulldown 2 -> 3. Wed: hip extension 2 -> 3, single-leg
deadlift 2 -> 3, leg curl 2. Fri: row 2, pulldown 2, deadlift 2, leg curl 2, single-leg knee 2 (pattern).

**Athletic (SA level 0, `out/athletic.out.txt`).** Throws 35 -> 45 a week (100 % of the target, 2 x 9 -> 2 x 12 and 2 x 11),
ankle contacts 12 -> 27 (100 %), jumps 26 -> 32 (70 %, printed; a third set on the jump stations is the next level), Olympic sets
6 -> 7 -> 8 by exercise block, shoulder care every session, stages RC1 / RC2 / RC3 by exercise block. No dose ever drops.

**Offers and switches.**

| | Result |
|---|---|
| 3 x 75 | adds quads, chest and calves: back 10 -> 12, hips 10.5 -> 13.75, quads 10 -> 12, chest 10 -> 12, calves 9 -> 10. (Back's peak is lower than at 60: three more groups share the time. The offer says so) |
| 3 x 90 | adds shoulders: six groups, 61 -> 80 sets |
| 3 x 105 | the full level plan: back 15 -> 21, hips and quads to 16, chest 14, calves 12 |
| no strength rests in the last exercise block (open item O-17) | **adds quads**: back 10 -> 14, hips 10.25 -> 12.5, quads 10 -> 12 |
| core opener off | adds chest: back 10 -> 15, hips 10.5 -> 12.5, chest 10 -> 12 |
| Olympic lift off | back 10 -> 12, hips 10.25 -> 14.5, quads 10 -> 12, chest 10 -> 13 |
| athletic block off | five groups: back 10 -> 15, hips, quads, chest, calves |
| day limit 110 % | adds quads: back 10 -> 12, hips 11.5 -> 15.5, quads 10 -> 12; days up to 65.9 |

**Against the documents.** `05` 8.7.1 says of the athletic 3-day week at 60 minutes: "step 1: tell + offer 80 min
(peak ~95) or another day". The planner agrees: at 60 minutes two groups are trained properly (today: three listed, one of them at 5-6
sets), 75 minutes hold five. The one parameter that decides the third group is the 4.5-minute rest of the heavy lift in the
last exercise block.

### 12.4 What the three simulations show

1. **The decisive facts are the fixed blocks and two time-model parameters, not the volume math.** One care item more, a
   4.5-minute rest, a skill block: each one costs a whole group. A planner that reports this exactly gives the coach the
   choice; a planner that hides it behind below-floor groups takes the choice away.
2. **Per-day exactness matters** (the chest line of 12.2), and so does the template's day identity (R-WORK: the swimmer's quads
   cannot be "trained" by skipping the squat on the squat day).
3. **The answers are stable in the right sense.** Across 30-120 minutes and four switch settings per sample (72 steps) the keep
   vector never got lexicographically worse; where a kept group left, a higher-priority one had entered.
4. **Whole-set flatness is arithmetic.** 3, 3 and 7 added sets in 11, 7 and 11 steps leave 8, 4 and 4 flat weeks at best; the
   schedules hit those minimums, the last week always adds a set, and the plan names what climbs in the other weeks.

---

## 13. Decisions for the coach, limits and risks

### 13.1 Decisions (each has a default, so nothing blocks the build; the plan prints the defaults it used)

| # | Decision | Default in this design | What changes if he says otherwise |
|---|---|---|---|
| 1 | Below-floor training (E-11) | off: a group is trained at its floor or listed as not trained directly | a fourth state as a named parameter with a cap on the shortfall |
| 2 | Day limit when the person keeps their time; the full plan; test days | 100 %; 110 % on full-body days for the full plan only; tests outside the limit and printed | one factor per branch in `rules.planner.fit`; section 12 shows the 110 % line of every sample |
| 3 | What "never flat" means | the pair (display level, credited sets) rises every week for every trained group; the plan names the dimension; the stairway order is last, shape, land, late, flat, hold | the tier list is data |
| 4 | Which fixed blocks stay ahead of a big mover, by profile class | level 0 = the approved profile defaults at their smallest dose (stay-active: one athletic piece and one care item a day; competitive: the template's stations at 2 sets, one Olympic lift, sport care) | the level 0 list per profile class; 12.1 shows it decides the pickleball plan |
| 5 | Pattern stations for big movers that are not trained | on: one exercise, 2 sets, at most 3 a week, in keep order, before the peaks | off, or after the peaks |
| 6 | Calves on fewer than four leg days | 3 sets per leg day is the whole rule (floor = 3 x leg days, at most 4 a day); no optional-day calf slot unless calves are a Focus | floor 10 through an optional-day slot (C-04) |
| 7 | Ceilings | one per FOCUS group, on credited sets, helper spill of at most one set | per line (hips could pass 30) |
| 8 | Athletic work against resistance peaks | competitive athletes: athletic level before the peaks, never at the cost of a kept group; everyone else: after the peaks | swap G4a and G5 |
| 9 | Exercise count on full-body days | his counts by session length + 2 as a hard sanity cap | soft, or another margin |

Parameters of the time model and the stairway that move the samples and are already open items: the strength rest of the
athletes' last exercise block (O-17), the class lift's rest (P-18), lambda above 1 so small lines reach the level ceiling
(C-01; here lambda <= 1, which is why the class member's back stops at 15 in 8 weeks), the total-rise rule (7 % here, 10 % as
the fallback), and the per-session 11 (here it yields up to 14 before a group loses its place).

### 13.2 Limits of the evidence

- The prototype holds three hand-written instances and a random generator, not the whole template grid. Not prototyped:
  optional-day and Focus slots, tests inside the limit, the athletic level ladder beyond one step (G4; `athlevel.mjs`), the
  last-in-first-out cut of 4.5, the grammar builder from `templates.json` (S0), the properties P10-P13. Each is specified above and none changes the proofs.
- The fixed blocks of the samples follow the frozen engine snapshot's layouts and the model's time parameters. Other
  parameters give other plans; that is what the switch tables show.
- Timings are from one laptop. No phone was measured.
- The oracle has a tail (5.3). Legality never depends on it; optimality of a peak can.

### 13.3 Refinements that are specified but deliberately left out of version 1

- **One proved vector per exercise block** instead of reserved costs, for plans whose early blocks are costlier than the last
  (bodybuilders). It needs the scheduler to respect per-block allowances; the gain is at most a set or two of peak.
- **Exercise counts that grow at an exercise-block start** (a third exercise entering at 2 sets in block 2). Version 1 keeps
  the structure constant over the stairway block, which is what keeps L3 two vectors wide.
- **Conflict-directed search** in the oracle (5.3).

---

## 14. Reproduce

Everything is in `design/two-stage/`. Plain JS, Node 22, no dependency; the planner modules read no file (the instances are
data), the inspection scripts read the frozen engine snapshot `design/scratch/snap/` only.

```sh
cd design/two-stage/proto
node explain.mjs            # the three samples: plan, reasons, offers, switches        -> ../out/samples.out.txt   (3 s)
node detail.mjs swimmer     # sets per exercise per week, add sequences                  -> ../out/detail.out.txt
node run.mjs pickleball '{"care":"one","minutes":60}'      # any variant; TRACE=1 prints every oracle question
node athletic.mjs           # stage SA for the swimmer and the pickleball player         -> ../out/athletic.out.txt
node athlevel.mjs           # one G4a step: the swimmer's next athletic level, re-solved  -> ../out/athlevel.out.txt
node sweep.mjs              # 3 samples x 4 settings x 7 legal lengths, monotonicity     -> ../out/sweep.out.txt     (12 s)
node test_oracle.mjs 1500 7 # oracle against brute force                                 -> ../out/test_oracle.out.txt (minutes)
node test_stairway.mjs 1500 5000   # scheduler against brute force, certificates        -> ../out/test_stairway.out.txt (2 min)
node test_link.mjs 300      # the link theorem as a property test                        -> ../out/test_link.out.txt (9 s)
node det.mjs                # determinism; the same file runs in the JavaScriptCore shell (jsc -m det.mjs)
node dumpdays.mjs 01-swimming 2,last    # inspection: the frozen engine's own layout for a sample (also tplc.mjs, targets.mjs)
```

| File | Content |
|---|---|
| `core.mjs` | units, staircase, the one time function, credited tallies, the independent evaluator |
| `oracle.mjs` | the exact three-valued oracle |
| `stage1.mjs` | G1, G3, G5, G6, G7 |
| `stairway.mjs` | the scheduler, its certificate, the brute-force reference |
| `stage2.mjs` | placement, supersets needed, the per-week certificate, the report |
| `athletic.mjs`, `athlevel.mjs` | stage SA (level 0); one G4a step |
| `offers.mjs`, `explain.mjs` | reasons, offers and switches by re-solving |
| `samples.mjs` | the stage-0 instances as data: pickleball 2 days, pickleball 3 days (the offer), swimmer, CrossFit class |
