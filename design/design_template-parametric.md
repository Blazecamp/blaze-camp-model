# Planner design: coach templates as skeletons, the dose as a small exact integer problem ("template-parametric")

Status: design-panel entry for `workflows/planner_design.js` (angle: COACH-TEMPLATE PARAMETRIC). Written 2026-10-10.
Inputs read: `design/diagnosis.md`, `design/algorithm_research.md`, `design/rules_as_constraints.md` (rule ids below are from that
inventory), `coach_answers_round3.md`, `synthesis/12_volume_algorithm_v1.md`, `synthesis/05_session_architecture.md`,
`model/templates.json`, `model/rules.json`, `model/profiles.json`, `engine/timefit.mjs`, the sample intakes and plans.
Only `design/` was written. No git command was run. The engine, model, tests and samples were only read.

A working prototype of the core is in `design/sim_template-parametric/` (939 lines of plain JS, no dependency). Every number in
section 14 is its output on the real templates and time model. Section 16 says how to rerun it.

---

## 0. Summary

**The idea.** A plan is a **skeleton** plus a **parameter vector**.

- The skeleton is the coach's own day template (`model/templates.json`: BYOP full body, athletic A/B and S1-S3, the class split,
  bootcamp circuits, 4 TRACKS ...), chosen by goal x days, with slots switched on or off **only by a short list of explicit edit
  rules** (section 3.2). Nothing else can add or remove an exercise.
- The parameters are **how many sets a trained group does on each of its days in the peak week** (at most about 20 integers), one
  start value per group, and the week each added set lands in. Everything else is closed form: the coach's own placement rules
  (VOL-07 inside a day, R3-VOL-03 across the days) turn those few integers into sets per exercise per week.

**How it is solved.** One evaluation function (minutes per day, credited sets per group) is shared by the solver and the scorer.
On top of it:

| Step | Decides | Method | Guarantee |
|---|---|---|---|
| T1 keep search | which groups are trained directly and which only keep their movement (R3-SES-02 step 2) | best-first depth-first search over the coach's keep order; every leaf is an **exact oracle** (a dynamic programme over the days) | the lexicographically best keep vector; "does not fit" is always a proof, never a budget |
| T4 | the smallest overrun of the chosen minutes that this keep vector needs | binary search on the oracle | minimal by construction |
| room | which optional blocks stay (power piece, second jump station, ankle hops ...) | cut order of the family, one oracle call each | a room item never adds overrun on any day |
| exposures | on which of its template days each trained group trains | explicit rule order (work-lift day always; the lift paired with a work lift next; then the rest), one oracle call per day | the template's frequency and day identity are kept whenever they fit |
| T5 | the peak of every trained group | leximin on the peak shortfall by oracle point tests | the largest shortfall is as small as the minutes allow, then the next largest |
| starts | week-1 sets | closed form | floor, lambda <= 1, minimum climb |
| stairway | the week of every added set | min-cost flow (integral) | monotone, 7 % and 10 % limits hard |
| weeks | sets per exercise in every week | closed form (house-monotone) | **sandwich lemma**: every week fits because the peak week fits |
| certify | every rule on every week | the same evaluation function | measured, not assumed |

**What the prototype measured** (section 14; `node design/sim_template-parametric/run.mjs`, `variants.mjs`):

| Sample | Current engine (diagnosis 1.1-1.5) | This planner (model fit factor 1.10) | Solve |
|---|---|---|---|
| 08 pickleball 2 x 45 | quads 4 -> 6 and hips 4.5 -> 6.75 **below the floor**, calves 7 -> 8; no press on a main day; 8 of 24 days over 45 | **hips 10 -> 12 and the pinned calves 7 -> 8 trained at their floors**; squat, row and press kept as 2-set movement stations; Monday 47 min, Thursday 43 -> 49 | 9 ms |
| 04 CrossFit class 4 x 60 | quads 5 -> 6 and hips 6.25 -> 7.5 below the floor, back 10 -> 12 | **back 10 -> 12, chest 10 -> 12, calves 7 -> 8** at their floors; squat, deadlift and press stay as class lifts (3 sets, heavier by the week); days 56-65 min | 9 ms |
| 01 swimming 3 x 60 | quads 5 -> 6 below the floor, hips 10.75 -> 12.75, back 10 -> 13 | **back 10 -> 14, hips 10 -> 12, chest 10 -> 12**; the squat kept as a 2-set movement; days 49-65 min, the two test days inside the band | 49 ms |

In all 42 plan solves of the sweeps (36 in the session-length sweep and the toggles: lengths 30-120 min, strict minutes, block
toggles, one more day; 6 for the stairway order): **0 trained groups below their floor, 0 trained groups under two exercises on
a day (calves keep their single exercise by rule), 0 days over their limit, 0 set drops, 0 step-limit breaks**. Over the 15
comparable session-length steps the keep vector never got worse with more minutes. The prototype also proves two structural
facts the current engine can only discover by probing: on the class template quads and hips can never reach the floor **at any
session length** while a session holds at most 11 sets of a group (they have one day each), and on the 2-day athletic template
chest cannot either. The honest offer there is "one more day", not "longer sessions".

**What is exact and what is a rule.** Exact: the keep vector (with the floor read on guaranteed credit, 4.5), the overrun, the
peaks (first leximin level; later levels in a fixed priority order), the stairway for its cost order, and every "does not fit".
Rule-driven on purpose: exercise order and pairs (template), how many exercises a group has on a day (a third opens only when
the first two are full), on which days a group trains (template first), starts (closed form). Section 15 lists the limits honestly, including the two places where this design
is conservative (helper credit toward a floor, the weekly 10 % bound).

**Decisions it needs from the coach** (section 15.2): whether kept movement stations may use the "a little longer day" band;
whether they exist at all; the 11-sets-a-session cap on one-day groups; tests inside the peak week; the late strength rests of
athletes; "ceiling in the last week" vs "no flat week".

---

## 1. Why this angle, and what it changes

### 1.1 The one-sentence design

The coach's templates already encode his hard structure (core first, power before strength, knee + pull / hip + push pairs, the
two spine days, 2 exercises per group, horizontal before vertical). So the planner **never invents structure**. It only decides
(a) which template parts stay, by rules he approved, and (b) a handful of set counts, exactly.

### 1.2 What it fixes (root causes of `diagnosis.md`)

| Root cause | Mechanism here |
|---|---|
| RC1 greedy pipeline, four time cutters | one evaluation function; one search with strict tiers; no stage can add or remove volume after the solve |
| RC2 structure fixed before capacity | the template fixes order and pairs only. Which of its days a group uses, and how its sets split across them, are solved (section 14.1: hips 4 sets on Monday and 6 -> 8 on Thursday so that Monday can keep the squat and the row) |
| RC3 subset search by simulation | exact oracle; "does not fit" is exhaustive; lexicographic keep search, monotone in minutes |
| RC4 targets, packing and verification disagree | there is one object: the peak point. Week 1 and every middle week are derived from it by closed forms; no verify-and-drop loop exists |
| RC5 mixed units | one unit: weekly sets per group. Integers for direct sets, quarter sets for credit, minutes in 1/20 min. No tolerance constants |
| RC6 whole-set granularity | the flat weeks are stated (arithmetic minimum given the steps) and every week carries a progression card: set, reps, effort or load (section 5.8) |
| RC7 rule conflicts re-ranked per fix | the tier order is data (section 4.6). The three places where this design files a rule differently from the inventory are named |
| RC8 athletic budget outside the model | athletic stations are fixed blocks or room items in the same minutes; targets are scaled to the stations that are kept, and the scale is printed |
| RC9 time model decoupled, "fits" = 110 % | the band is spent on group states only; everything else must fit the chosen minutes; the overrun is minimized exactly |
| RC10 validators mirror the engine | the scorer evaluates the same rows with no exemption; kept movement stations and class lifts are named states |
| RC11 patch build-up | an edit rule or a parameter is data; the solver has no sample-specific branch |

### 1.3 Terms

| Term | Meaning |
|---|---|
| slot | one exercise position of a day template (a station of `model/templates.json`) |
| cell (g, d) | the slots of group g on day d, in session order. Example: quads on the athletic A day = [bilateral knee-dominant work lift, leg extension] |
| lead cell | a cell whose first slot is the day's work lift (role `work`) |
| fixed block | warm-up, core opener, protected athletic stations, class pieces, joint care, tests: minutes that do not depend on the dose |
| room item | an optional fixed block (second jump station, power piece, ankle hops, buy-out ...), kept only if it fits |
| skeleton | template + states of the groups + room items on or off + kept movement stations |
| peak point | the cell totals N(g, d) of the last week |
| keep vector | one level per group in the coach's keep order (FULL 3, PATTERN 1, NONE 0) |

---

## 2. Architecture and data flow

```
intake ──► derive                                             [KEPT: engine/intake.mjs, shape.mjs]
            level, family, template id, blocks (4-6 weeks), targets per group (F floor, S start, C ceiling, climb),
            keep order, pins, pain lines, tests, play days, season phase
        ──► compile(template, minutes, profile rules) ──► problem                       [NEW plan/compile.mjs]
            cells and slots (min / max sets, time class, credit, pair tag, lead flag), fixed blocks per day and week,
            room items in keep priority, kept-movement candidates, test minutes
        ──► athletic layer: stations kept by rule, sets, weekly doses scaled to the stations  [NEW plan/athletic.mjs]
        ──► KEEP SEARCH (T1)  ── exact oracle ──►  keep vector                           [NEW plan/keep.mjs, plan/oracle.mjs]
        ──► OVERRUN (T4) ──► ROOM ITEMS ──► EXPOSURES ──► minimum point
        ──► PEAK (T5 leximin) ──► canonical peak point                                   [NEW plan/dose.mjs]
        ──► starts ──► STAIRWAY (min-cost flow) ──► weekly totals per group              [NEW plan/stairway.mjs, opt/mcf.mjs]
        ──► realize: sets per exercise per week (closed form); supersets needed; progression card   [NEW plan/realize.mjs]
        ──► select exercises per slot and exercise block (bucket, laterality, kit, level, pain, stage)   [KEPT: engine/select.mjs]
        ──► dose text: reps, RIR, load cue, intensifier                                  [KEPT: engine/dose.mjs]
        ──► offers: re-solve at the next session lengths, one more day, block toggles     [NEW plan/offers.mjs]
        ──► certify: every catalogue row on every week (same eval)                        [NEW plan/certify.mjs; validate.mjs reads it]
        ──► render EN / ES                                                               [KEPT: engine/render.mjs, explain.mjs]
```

`plan/eval.mjs` (minutes of a day, credited sets) is the only place that knows the time model and the credit map. The oracle,
the realization, the dose text check and the scorer all call it.

One planner run handles one **stairway block** (the 6 / 8 / 12-week block with one continuous stairway). Flat blocks
(maintenance, pre-season, taper, in-season) reuse the same compile and eval with a fixed total and no search (section 9.4).

---

## 3. The skeleton

### 3.0 Which template

Selection is kept from the engine: goal -> family (`templates.goal_to_family`, the kit override), family x days ->
`families[family].days[n]`, the variant from the profile and the season (same-pattern athletic, BASEBALL Parts, in-season,
upper / lower, PPL x 2, bootcamp circuit, CrossFit-style class; `program_names`, `profiles.sports[].template_hint`). Minutes act in
three places only: the `include_from_minutes` gates (rule A-DEPTH and the room items), the work-lift minimum (3 sets from 60 min),
and the **minimum length of a template**: the T0 blocks of every day (warm-up, core opener, protected athletic tracks, the
class lift and its conditioning piece, the tests) must fit the band with no group trained. A chosen length below that is refused
with the first length that fits as the offer. Measured (14.4): the class template does not fit 30 or 45 min (Tuesday holds
33.5 min of fixed blocks + 16.75 min of class press = 50.25 > 49) and fits 60; athletic.3 with tests does not fit 30 min
(Monday 26.0 + 11.7 of tests). The prototype finds this as the keep search's last leaf (no group trained) in 0-1 ms.

### 3.1 Compiling a template

For the template of (family, days, variant) and the chosen minutes:

1. **Cells.** Every station with a `group` in the `strength` or `accessories` block becomes a slot of the cell (group, weekday).
   Session order = template order. A slot carries: bucket, role, time class (`buckets[].time_class`), credit in quarter sets per
   group (`rules.credit.classes`, capped at 4 per group, DEF-02 / DEF-04), pair tag (`pair` / `superset`), minimum and maximum
   sets (2 to 4 at L1, 5 at L2-L3, isolation 4, calves 3 to 4, the work lift 3 from 60 min; T0-SES-15, T6-CNT-06).
2. **Depth.** A cell is used with its first k slots, k from 2 (calves 1) to 4. Stations gated by `include_from_minutes` and the
   group's expansion list (the coach's own third exercises: single-leg knee, leg extension; single-leg hinge, leg curl; pulldown,
   second row; chest isolation, second press ...) are slots 3 and 4. They open by rule A-DEPTH only.
3. **Lead and pair flags.** `lead` = the first slot is a work lift. `pairedTo` = the first slot is the template partner of
   another group's work lift (knee + pull, hip + push; T0-SES-08).
4. **Class lifts.** In the class model the work lift is a fixed slot (3 sets, strength rest, the coach's HALF TIME table); it
   stays in the day whatever its group's state (T1-POL-08, T4-TIME-03).
5. **Fixed blocks per day**: warm-up, core opener (2 exercises x 2 sets, as a pair), skill, protected athletic stations, Olympic
   piece, joint care by profile rule (T0-SAFE-06 racket 50+, T0-ATH-05 swimmers), WOD at its short length.
6. **Room items in keep priority** = the family's cut order reversed (`rules.cut_order`, T1-POL-06 / T1-POL-13): for stay-active
   clients the power piece and the second athletic station; for athletes the budget-driven second stations inside the
   2 jump / throw + 1 Olympic split (T6-CNT-07); buy-outs; WOD growth.
7. **Test minutes** on the test days of week 1 and the last week (T0-TST-01).

The three sample problems compile to 10 cells / 34 slots (pickleball), 11 / 38 (class), 15 / 51 (swimming).

### 3.2 The edit-rule catalogue: the only ways a slot is added or removed

| Id | Rule | Precondition | Effect | Tier | Sources |
|---|---|---|---|---|---|
| R-GROUP | a group leaves the week whole | decided only by the keep search | state NONE; its slots leave every day; listed "not trained directly (time)" with its credit | T1 | R3-SES-02 step 2; T1-POL-05, -09, -10 |
| R-DAY | a trained group leaves one of its days | never its lead day; the other days must hold its floor with 2-4 exercises | cell = 0; "never squeezed to 1 exercise" | exposures | R3-SES-02 ("never squeeze"); T1-POL-09; T2-FLR-06 (start not above the ceiling) |
| R-LEAD | a trained group keeps its work-lift day | group FULL | the lead cell cannot be 0; the squat day keeps its squat | hard | T0-SES-06 ("the work first"); never-cut roles `work`, `paired_upper` |
| R-ROOM | a room item is switched off | its day would pass the chosen minutes, or some day would need more overrun than the group states alone | block off, offered back with its minutes | below every group and below T4 | T1-POL-06, T1-POL-13; R3-SES-02 (block toggles) |
| R-TEST | test-week swap | test day, week 1 or last week | a quality test replaces the station of that quality; that day's room items are skipped that week; the rest of the test rides in the band | hard | T0-TST-01; PROPOSED swap order |
| A-PATTERN | one 2-set station of a big mover that is not trained | group in {back, chest, quads, hips}; at most 3 a week | its own work lift on its lead day if the template has one, else the rule bucket (`rules.volume.pattern_keep`), paired with the day's work lift; state PATTERN, never counted as trained | T1 (level 1 of the group) | T1-POL-07 (PROPOSED); BRAIN 10.7 |
| A-DEPTH | third / fourth exercise of a group on a day | the peak sets of the cell exceed what its open exercises hold | the next slot of the cell opens for the whole block, at 2 sets from week 1 | by construction | VOL-07; R2-SES-05; T6-CNT-03, -04 |
| A-CLASS | the class lift stays | class model | fixed slot, 3 sets | T0 | T1-POL-08; OT18 |
| A-ATH-SET | a third set on an athletic station | its key is under target with the per-set dose at its maximum | +1 set; ranked as a room item | room | T5-ATH-02; D-73 |
| A-BONUS / A-FOCUS / A-CALF-OPT | optional-day cells | small line's extra sets, Focus line, calves under 4 leg days | an optional cell (2 sets, Focus 2 x 2-3) that counts for the peak, never for the floor | T5 | R3-VOL-03; ORD-11; T6-CNT-05; T7-PLC-03, -04 |
| A-GUEST | a group gets a cell on a day whose template has none | coach rule pack only (off) | new cell from the group's pattern bucket | - | diagnosis section 3 item 4 (open) |

A-BONUS / A-FOCUS / A-CALF-OPT, A-ATH-SET and A-GUEST are specified but not in the prototype.

### 3.3 The keep list

```
keep list = [ groups in the keep order pi ];   after the overrun: [ room items in keep priority ]
pi        = Focus groups, profile pins (racket 50+: calves), profile big priorities, rules.session.time_fit.keep_order
            (athletic families: keep_order_r2.athletic)                                              (T1-POL-05)
levels    = FULL (3) > PATTERN (1) > NONE (0) for a big mover with A-PATTERN on;  FULL > NONE otherwise.
            BELOW_FLOOR (2, E-11) exists as a level but is off: it contradicts the approved R3-SES-02.
```

Protected athletic tracks of competitive athletes and the T0 defaults of a profile are fixed blocks, not list entries.

---

## 4. The mathematical model

### 4.1 Sets, data, units

| Symbol | Meaning |
|---|---|
| g in G; d in D; H subset of G x D | groups; main days; cells of the template |
| s in slots(g,d), in session order | slot data: min_s, max_s, work_s, rest_s(w), credit q_{s,h} in quarter sets to every group h, pair tag |
| k in {2,3,4} (calves 1) | depth of a cell; lo(k) = sum of the first k minimums; hi(k) = min(11, sum of the first k maximums) (T5-CAP-05) |
| w = 1..N; e(w) | weeks of the stairway block; exercise blocks |
| mu_d; phi; B_d = floor(phi mu_d) | chosen minutes; fit factor (`rules.session.time_fit.fit_factor` = 1.10); band limit |
| F_g, S_g, C_g, mc_g | floor (10; calves by leg days; a pain line its reduced start), level start, ceiling, minimum climb (2; calves 1; N <= 7: 1) - credited sets |
| G(N) | planned growth of N weeks (12: 1.5535, 8: 1.3282) |
| Fix_d(w, S) | minutes of the fixed blocks and of the room items that are on; tests in week 1 and N by rule R-TEST |

Units: minutes in TU = 1/20 min (every time parameter of `rules.time_model` is a multiple of 0.05), credit in quarter sets, sets
in whole sets. All comparisons are on integers. "A day fits L minutes" is read on the printed whole minutes: Min < L + 0.5.

### 4.2 Decision variables

| Variable | Domain | Meaning |
|---|---|---|
| state_g | {FULL, PATTERN, NONE} | T1 |
| r_i | {0,1} | room item i on (decided after T4) |
| p | at most 3 (group, day, slot) | kept movement stations |
| N(g,d) | {0} or [lo(2) .. hi(4)]; never 0 on a lead cell or a calf cell | sets of group g on day d in the peak week |
| z_g = sum_d N(g,d) | | peak of the group, direct sets |
| a_g | integer | week-1 direct sets |
| v_{g,w} | a_g = v_{g,1} <= ... <= v_{g,N} = z_g | the stairway |

Depth is not a variable: k(g,d) = the smallest k with hi(k) >= N(g,d) (rule A-DEPTH). With at most 15 cells that can be on, a
block has **at most about 20 integer parameters**; the three samples have 4 to 6.

### 4.3 The closed forms (the coach's placement rules)

**Inside a day (VOL-07, T7-PLC-01).** `cell(n, k)`: every one of the k exercises at its minimum; then one set at a time to the first
exercise (session order) whose sets are below the first exercise's, else to the first; never past a maximum; a class lift never
moves. This gives 2/2 -> 3/2 -> 3/3 -> 4/3 -> 4/4, and 3/2/2 -> 3/3/2 -> 3/3/3 -> 4/3/3 with a work lift.

**Across the days (R3-VOL-03, T7-PLC-02).** `fill(base, cap, total)`: starting from `base`, one set at a time to the cell with the
fewest sets added so far that is still under its `cap`; ties go to the earlier weekday ("Monday first, then Thursday").

```
week 1:  N1(g, .) = fill( lo(k(g, .)),  N(g, .),  a_g )
week w:  Nw(g, .) = fill( N1(g, .),     N(g, .),  v_{g,w} )          sets of slot s in week w = cell(Nw(g,d), k(g,d))[s]
```

**L1 (house monotone).** Both rules are sequential, so for totals t <= t' no cell and no slot gets fewer sets at t' than at t.
With v non-decreasing, no exercise ever loses a set from one week to the next, and week N reproduces the peak point exactly.

### 4.4 The evaluation function

```
Min_d(x, w, S)  =  Fix_d(w, S)
                 + sum over pairs P of day d that are on:      sum_{k=1..max n} [ sum_{s in P, n_s >= k} work_s + max_{s in P, n_s >= k} rest_s(w) ] + 0.5 |P|
                 + sum over the other active slots:            n_s (work_s + rest_s(w)) + 1
Q_h(x)          =  sum over active slots  n_s q_{s,h} / 4                                   (credited sets of group h)
```

This is `engine/timefit.mjs` (setCost, supersetMinutes) and DEF-09 unchanged. Pairs: template tags first, then the legal-pair
list (`rules.supersets.recommend.pairs`) in session order, so a kept movement station pairs with the day's work lift. The oracle
evaluates with every eligible pair on (T1-POL-02); section 5.7 then switches on only the pairs a day needs.

### 4.5 Constraints

| # | Constraint | Form | Where it is enforced | Rules |
|---|---|---|---|---|
| K1 | sets per exercise | min_s <= n_s <= max_s | by `cell` | T0-SES-15, T6-CNT-06 |
| K2 | 2-4 exercises per trained group per day, never 1; calves exactly 1 on every leg day | cell = 0 or k in [2,4]; calf cells never 0 | domain of N | T0-SES-10, T0-SES-11, T1-POL-09 |
| K3 | the work-lift day stays | N(lead cell) > 0 | domain of N | R-LEAD; T0-SES-06 |
| K4 | floor of a trained group | Q_g(week 1) >= F_g | oracle (guaranteed credit, below) and exact on week 1 | T1-POL-01a, T2-FLR-01, -02, -04 |
| K5 | minimum climb, whole sets, no tolerance | z_g - a_g >= mc_g, hence z_g - sum_d lo(k(g,d)) >= mc_g | oracle | T1-POL-01c, T1-POL-12, T3-STW-02 |
| K6 | the day holds | Min_d(peak, N) <= lim_d(S); lim_d = min(B_d, mu_d + delta), and mu_d on a day that holds a room item | oracle | T1-POL-02, T4-TIME-01 |
| K7 | test weeks | Min_d(peak, N, tests on, that day's room items skipped) <= B_d | oracle | T0-TST-01; R-TEST |
| K8 | ceilings | z_g <= C_g; N(g,d) <= 11; z_g <= floor(start x G(N)) - frozen credit | oracle (C_g, 11), T5 (the rest) | T5-CAP-01, -03, -05; T3-STW-06 (lambda <= 1) |
| K9 | field athletes | counted exercises of a day <= 12 | oracle | T0-SES-13, T6-CNT-07 |
| K10 | exercises fixed inside the block | depth and slots constant over the weeks | by construction | T0-SES-14, T6-CNT-04 |
| K11 | never down; step limits | v non-decreasing; v_{g,w} - v_{g,w-1} <= max(1, floor(7 %)); weekly total rise <= max(1, ceil(10 % of week 1) - 1) | stairway flow | T3-STW-01, T0-STW-02, T0-STW-03 |
| K12 | order, pairs, spine days, power before strength | properties of the template and of the picks | compile + selection + ordering pass | T0-SES-03 ... -09 |
| K13 | athletic safety | contacts per session, per-set bounds, stage qualities | athletic layer | T0-ATH-01 ... -05, T5-ATH-01 |

**Guaranteed credit (K4 in the oracle).** A floor may lean on helper credit only from sets that are in every week of the block:
class lifts, kept movement stations and the minimum sets of the other trained groups' open exercises. Then the oracle needs no
week-1 vector: `(z_g - mc_g) + guaranteed credit >= F_g` is sufficient, and the true week 1 (built afterwards by adding sets
donors-first until every credited floor holds on the evaluator) is at or below `z_g - mc_g`. This is the inventory's SF-1 advice
("hold helper credit fixed per exercise choice"). It is conservative by at most the helper credit of the donors' non-minimum
sets (section 15.1).

### 4.6 Objective: strict tiers

| Order | Tier | Objective | Inventory |
|---|---|---|---|
| 0 | T0 | feasibility: K1-K3, K7-K13 and the T0 rows of the catalogue | all T0 |
| 1 | T1 | lexicographic maximum of the keep vector (levels of the groups in pi); a group counts FULL only with K4, K5, K6 | T1-POL-01 ... -12 (T2 and the hard part of T3 live inside "FULL") |
| 2 | T4 | the smallest delta such that the keep vector holds with every day at most mu_d + delta | T4-TIME-01 |
| 2b | room | room items in keep priority; each stays only if its own day fits mu_d and no day needs more than delta | T1-POL-06, T1-POL-13 (see D2) |
| 3 | frequency | most template exposures: first the cells paired with an active work lift, then the others, each in keep order | T7-WEEK-01, T0-SES-08 (see D1) |
| 4 | T5 | leximin of the peak shortfall c_g - z_g, with day limits max(mu_d, minutes of the minimum point) | T5-CAP-04 |
| 5 | T6 / T7 | canonical point: fewest exercises, most even split, the earlier day takes the odd set; groups in keep order | T6-CNT-03, T7-PLC-02 |
| 6 | T3 soft | starts: the level start, lowered only for K5, lambda <= 1 and to give the weekly total a step in every week it can have | T3-STW-03, T3-STW-08, T2-FLR-06 |
| 7 | T3 shape | stairway flow: last-week landing, no flat week, 3 % / 5 % steps, timing | T3-STW-04 ... -07 |
| 8 | T7 | fewest supersets needed per exercise block | T7-PAIR-03, T1-POL-11 |
| 9 | T8 | laterality share, variety, preference score (selection) | T8-* |

Three deliberate differences from the inventory's filing:

- **D1 frequency before peak height.** The inventory files "week shape and frequency" in T7, below T5. Here a trained group gives
  up a template day only to keep a T1 state or to lower the overrun, never to gain a peak set. Reason: that is the angle (the
  template is the proven skeleton) and it makes the structure search cheap (one oracle call per cell). A coach who prefers the
  other order sets `exposure_policy: "attainment_first"`; the search then compares exposures by their T5 result.
- **D2 the band is for group states only.** T1-POL-02 lets "the plan" use phi mu. Here only the minimums of FULL groups and kept
  movement stations may. Room items and every set above the minimum must fit the chosen minutes, and a room item may not push
  a group's sets into the band on another day either: room items are decided after the overrun (inventory reading C-16, made
  structural). `fit_factor = 1.00` gives strict minutes for everything (section 14.5 shows it for all three samples).
- **D3 T5 before the stairway shape.** As in `algorithm_research.md` section 1: the planned curve is re-anchored on the attained
  peak, and a higher peak only adds whole sets, which can only remove flat weeks.

### 4.7 Lemmas the design rests on

**L1 house monotone** (4.3).

**L2 sandwich** (after `algorithm_research.md` 7.3). Fix the skeleton and depths. If the regular fixed minutes and rest_s(w) are
non-decreasing in w (they are: athletic sets never drop, the strength rest of athletes comes in the last exercise block), then
for every week w: N1 <= Nw <= N cell-wise (L1), so `Min_d(Nw, w) <= Min_d(N, N) <= lim_d`, `Q_g(Nw) >= Q_g(N1) >= F_g`, and every
upper cap holds because it holds at N. Tests add the same minutes in week 1 and in week N, so the test week 1 is bounded by the
test week N (K7). Hence **only the peak point is searched**, once without and once with its tests; week 1 and the middle weeks
need no check. When a later exercise block is cheaper than an earlier one (laterality moves toward bilateral), the oracle
evaluates the peak with each slot's most expensive block cost, which restores the premise (conservative; section 10). The
prototype re-evaluates every week anyway: 0 violations in 42 plan solves.

**L3 monotone feasibility.** For a fixed depth, Min_d is non-decreasing in every cell value, and K8, K9 are upper bounds. So the
set of feasible peak points is a down-set, and "every group at least at need_g" is decided by testing the single point
z = need. Across a depth change (a third exercise opens) minutes can only drop if the opened exercise is much cheaper per set than
the ones it relieves (a strength-rest work lift). Compile is specified to check every cell table for this (the prototype does
not). Where it happens, the oracle's exact-total test stays **sound** (every returned point is evaluated) but the peak may miss
a set.

**L4 monotone in minutes.** A peak point that fits mu fits mu' > mu: same skeleton, same sets, the limits only grow. Gated
stations enter as options (A-DEPTH candidates or room items), never as obligations. So the keep vector at mu' is
lexicographically at least the one at mu. The one data rule that can break this is "the work lift starts at 3 sets from 60 min"
(T6-CNT-06): it raises a minimum when minutes grow. It is covered by a property test (section 13) and did not bite:
0 worse keep vectors in 15 steps.

**L5 flat weeks.** With K whole-set steps in N - 1 transitions, at least N - 1 - K weeks add no set. The stairway reaches this
minimum when "never flat" is ranked first, and is above it by the number of lines that share the last week when "the ceiling in
the last week" is ranked first (14.6).

### 4.8 Where every part of the inventory lives

| Inventory | Handled by |
|---|---|
| T0-SYS-01 ... -04 | determinism (section 6), no stored state, why-records (section 7), no sex field |
| T0-SAFE-01 ... -13, T8-VAR-*, T8-BAL-05 | intake screen and selection filters (kept); they decide which exercise fills a slot, never the dose |
| T0-SES-01 ... -09, -12, -16, -17 | template and compile: warm-up and core as fixed blocks, block order, pairs, spine days, rear-delt station, play-day spacing |
| T0-SES-10, -11, -13, -14, -15 | K2, K9, K10, K1 |
| T0-EFF-01 ... -07 | dose text (kept); rest classes enter the evaluation function |
| T0-STW-01 ... -05, T3-STW-* | K11, the stairway flow, starts, flat blocks (9.4) |
| T0-TST-01 | R-TEST, K7 |
| T0-ATH-*, T3-ATH-*, T5-ATH-* | section 8 |
| T1-POL-01 ... -14 | keep search (01, 02, 05, 07, 08, 09, 12), room items (06, 13), offers and lists (03, 04, 10, 11), editor (14: a toggle removes a block and changes no set) |
| T2-FLR-01 ... -06 | K4; pain lines and field athletes through the targets F, S, C |
| T4-TIME-01 ... -03 | T4 delta, allowed lengths in the offers, class and circuit formats (9.1, 9.2) |
| T5-CAP-01 ... -06 | K8, T5, Focus through the targets |
| T6-CNT-01 ... -08 | A-DEPTH (fewest exercises, entry at 2 sets), split-day caps as an "upper" row, Focus slots (9.5), joint care outside the count |
| T7-PLC-*, T7-ORD-*, T7-PAIR-*, T7-WEEK-* | `cell` and `fill` (PLC-01, -02), optional cells (PLC-03, -04), ordering pass, supersets needed (5.7), exposures (tier 3) |
| T8-BAL-01 ... -04 | laterality pre-pass (section 10), ratios as target derivations |

---

## 5. Algorithms

### 5.1 The oracle EXISTS: is there a peak point?

A query fixes: the skeleton S, the set FULL, the allowed values of every cell (0 = "not on that day"), the day limits, and either
`target = null` (the **minimum point**: every group at max(direct floor, base) + mc for its exposure) or exact totals per group.

```
EXISTS(S, FULL, allow, limits, target):
  Gq[g]   <- guaranteed credit of g (class lifts, kept stations, the least a trained donor gives over its allowed days)
  quick proof of "no": sum_g need_g * cheapest minutes per set of g  >  sum_d (limit_d - Fix_d)            # SF-6
  state: z[g], base[g], classOn[g] (partial sums over the days already decided)
  DAY(i):                                             # days in week order
    if i = last + 1: return true
    if target and remaining need * cheapest minutes > remaining room: return false
    key <- (i, state of the groups that still have a later cell);  if key in DEAD: return false
    for every vector x of the cells of day i, cell by cell, values ordered by |value - even share of the target|, 0 last:
        skip if z[g] + value > upper[g]; or the later days cannot close the gap to an exact target (too little / too much)
        skip if Fix + lower bound of the minutes of the cells chosen so far > limit         # a slot costs at least its work,
                                                                                            # a pair changeover and half its rest
        skip if the day would pass the 12 + 2 cap
        if this is the last cell of g that may be on: require DONE(g):
              z = target (or the minimum-point value), z <= C_g, z - base >= mc_g, 4 (z - mc_g) + Gq[g] (+ own class lift if its cell is off) >= 4 F_g
        at the end of the day: t <- minutes of the day (cache by skeleton + day vector);  require t <= limit_d and, on a test day,
              resistance minutes + Fix_d(test week) <= B_d;  then  if DAY(i + 1): return true
    DEAD <- DEAD + key;  return false
  return DAY(first) ? the picks : null
```

It is a depth-first search over day layers with memoised failures, i.e. a dynamic programme over the days whose state is the
partial sums of the groups that are still open. **`null` is a proof**: no node or time budget is ever read as "does not fit"
(the over-cut of `algorithm_research.md` 6.4 cannot happen). The witness is not canonical; the callers pin what they need.

### 5.2 T1: the keep search

```
BEST(i, S):                                           # i runs over the groups in keep order; limits = the band B_d
  if i = end: return EXISTS(S, FULL(S), free cells, limits, minimum point) ? S : none
  g <- group i
  for level in [FULL, PATTERN (each candidate station, best completion), NONE]:
     if level = FULL and not EXISTS(states decided so far only, optimistic helper credit, later groups absent): continue   # bound
     r <- BEST(i + 1, S + {g: level});  if r: return r          # a higher level at i beats every lower one
```

The bound is valid because it only relaxes: later groups absent, every pending donor at its largest helper credit. Removing a
later group can make an earlier group harder (it loses helper credit), so the leaf is always the exact test (SF-8 respected).
Result: the lexicographic maximum over states x exposures x distributions.

### 5.3 T4, room items, exposures, the minimum point

```
delta <- smallest TU in [0, B - mu] with EXISTS(limits = min(B_d, mu_d + delta))                   # binary search
for room items in keep priority:  switch it on;  if not EXISTS(limits: mu_d on its day, min(B_d, mu_d + delta) elsewhere): off (R-ROOM)
for cells in rule order (pass 0: paired with an active work lift; pass 1: the rest; each in keep order; lead and calf cells are on already):
    require the cell on;  if not EXISTS: the cell is off (R-DAY)
Gq <- exact guaranteed credit of the fixed exposures
zmin <- totals of EXISTS(minimum point);   minimum point <- CANONICAL(zmin)
CANONICAL(totals): for g in keep order: for its splits of totals[g] over its cells, sorted by (exercises, max - min, earlier day heavier):
                       pin the split if EXISTS still says yes
```

### 5.4 T5: the peak (leximin)

```
limits_d <- max(mu_d, minutes of the minimum point on d)                 # no set above the minimum adds overrun (D2)
c_g      <- min(C_g, floor(max(S_g, credited week 1 of the minimum point) x G(N))) - frozen helper credit     # ceiling in direct sets
t*       <- smallest t with EXISTS(target z_g = max(zmin_g, c_g - t))                                         # min-max by point tests (L3)
for tau = t* .. 1:   find the smallest set R of not-yet-fixed groups, lowest priority first among equals, such that
                     EXISTS(z_g = c_g - tau for g in R and c_g - (tau - 1) for the others);  fix R at c_g - tau
peak point <- CANONICAL(z)
```

The first level is the exact min-max. The later levels keep the smallest number of groups at each shortfall; among equal-size
choices the lower-priority groups stay behind ("priority-refined leximin": deterministic and explainable; the pure leximin would
also branch over the ties).

### 5.5 Starts

```
alo_g <- week 1 built on the evaluator from the peak point (every exercise at its minimum, then sets donors-first until Q_g >= F_g)
a_g   <- clamp( S_g - frozen helper credit,   max(alo_g, ceil(z_g / G(N))),   z_g - mc_g )
while sum_g (z_g - a_g) < N - 1 and some a_g is above its lower bound:  a_g <- a_g - 1, round robin in keep order
```

The last line is tier 6: when the plan has fewer whole-set steps than weeks, starts move toward the floor so the weekly total can
step more often. By this formula the two worked examples of `12_volume_algorithm_v1.md` keep their starts: 5.2 stays at the level
start 15 (many groups, many steps), 5.5 starts hips at the floor 10 instead of 12 (two groups, five steps). (Derived from the
formula; those two examples were not run in the prototype.)

### 5.6 The stairway over the weeks

Min-cost flow on unit increments, as proposed in `algorithm_research.md` 7.4 and reusing `design/research/mcf.mjs`, with one
change: the weekly-total limit is taken from the plan's **real** week-1 total (every resistance set, class lifts and kept
stations included): `cap = max(1, ceil(10 % x Tot_1) - 1)` sets a week. Totals only grow, so this is strictly below +10 % of
any earlier week (T0-STW-03). The research flow bounds against its planned totals; while building this prototype that let the
real total rise by 10 % or more in the last week of 3 variant plans. With this bound the count is 0. Cost order: last-week
landing (R3-VOL-04), then no flat week, then the 3 % / 5 % step sizes, then each set near the week its lambda curve reaches it.
`landing: "after_never_flat"` swaps the first two (14.6).

### 5.7 Weeks, supersets, and the day the client sees

`fill` and `cell` give every week (4.3). For each exercise block, each day gets the **fewest pairs** that bring its first and
last week to the lowest reachable overrun (subset enumeration over at most 5 pairs); those are marked "needed", the others
"recommended" with the minutes they save (T1-POL-11, T7-PAIR-03).

### 5.8 The progression card (DR-9: never flat when sets cannot climb)

Every week, every trained group shows what climbs:

1. a set (which exercise, from the realization), or
2. reps: the first exercise of the group moves one step up its rep bracket (double progression), or
3. effort: the planned RIR step of DER-13 (3 -> 2 -> 1-2 -> 1 + intensifier), or
4. load: "add a little weight, back to the bottom of the bracket" when the bracket top was reached.

The time model prices a set at its class constants, so a rep step never changes the minutes. The stair level (2 -> 11) rises every
week (T3-STW-09). This is a dose-text rule in `dose.mjs`; it changes no set count.

### 5.9 Certify

`certify(plan)` evaluates on every week: floors of FULL groups (credited), 2-4 exercises per trained group per day, set bounds,
never down, per-group step, weekly-total rise, every day against its limit, no slot ever losing a set. The scorer of the benchmark
is this function plus the output rows (lists, offers). No row has an exemption: PATTERN stations and class lifts are states.

---

## 6. Complexity, runtime, determinism

**Sizes.** At most 8 groups, 6 days, 15-20 cells that can be on, 9 values per cell (0, 4 ... 11), 12-16 weeks.

**Oracle.** One call explores, per day layer, the vectors of that day's cells (at most 9^6, far fewer after the minute bound) for
each distinct partial-sum state of the still-open groups. Worst case exponential in the number of groups sharing a day, as for
any exact method (the problem contains a multiple knapsack); the memo, the exact-total windows and the capacity bound keep it
small in practice. A plan needs about 60-90 oracle calls (keep search, binary search, one per room item and cell, pins, leximin).

**Measured** (Node 22.22 on this Mac; 20 fresh solves each; identical plans in every run):

| Problem | Oracle calls | Search nodes | Day evaluations (cached) | Median solve | First run in a fresh process |
|---|---|---|---|---|---|
| 08 pickleball 2 x 45 | 86 | 1,741 | 582 | 9 ms | 37 ms |
| 04 class 4 x 60 | 59 | 3,150 | 770 | 9 ms | 25 ms |
| 01 swimming 3 x 60 | 88 | 46,703 | 1,987 | 49 ms | 97 ms |

Timings vary by a few milliseconds between runs; these are the values of the saved outputs. Across the 36 plans of the sweep and
the toggles the slowest solve was **about 0.7 s** (swimming 3 x 120: six trained groups with three days each, far from any
limit; 3 x 90 and 3 x 105 take 0.5-0.6 s). That is the heavy tail of this design. The prototype allocates objects per node; a production
version with typed arrays, precomputed cell-cost tables, twin-day tying (A1/A2 of the 4-6-day templates are one decision) and a
"canonical split first" fast path should cut it by an order of magnitude, but that is an expectation, not a measurement.
Not measured: a phone, JavaScriptCore, the 4-6-day twin templates, split templates.

**Budget for the browser.** Main plan: target under 150 ms on a mid-range phone for 95 % of intakes, hard node budget per plan.
On budget exhaustion the answer is `unknown`: the planner keeps the best *proved* keep vector found so far, never drops a group
because a search ran out, and flags the plan "not proven optimal". Offers are separate re-solves, run lazily in a Web Worker.

**Determinism.** Integers only in every decision (TU, quarter sets, sets). No clock, no randomness, no `Math.pow` / `exp` / `log`
(the lambda curve is bisection with multiplications, kept from the engine). Every order is explicit: keep order, weekday order,
session order, value order by distance to the even share then by value. Budgets are node counts. The stairway flow is integral
(successive shortest paths on integer costs, FIFO queue).

---

## 7. Infeasibility: R3-SES-02, step by step

| Coach step | Planner | Output |
|---|---|---|
| 0 the full plan fits | the first leaf of the keep search (every group FULL) is feasible, delta = 0, every room item stays and every peak reaches its ceiling | no warning (T1-POL-03) |
| 1 tell up front, offer a day or longer sessions | **offers are re-solves** at the next allowed lengths (30/45/60/75/90/105/120; L4 makes this a monotone scan), at days + 1 on the template the intake would really get, and with each block toggle (core off, athletic off, tests off). An offer is shown only if its keep vector or a peak is strictly better, and it names the gain | before week 1 (T1-POL-04) |
| 2 keep the time: fewer groups, big movers first | the T1 keep vector | "trained directly", "movement kept (2 sets)", "not trained directly (time), credit x" (T1-POL-10) |
| 3 supersets | 5.7 | needed / recommended with minutes (T1-POL-11) |
| 4 the stairway climbs on every trained group, never flat | K5 (whole sets), 5.6, 5.8 | the weekly table and the progression card |

**Why-records.** Every non-FULL group gets a proof and a number:

- the proof is the oracle's `null` for "this group FULL together with every group kept above it";
- the number is the smallest session length of the offer scan at which it becomes FULL, or "no session length: this template
  gives the group one day, and a session holds at most 11 sets of a group" when the scan never succeeds;
- for the binding day: its fixed minutes, the minutes of the kept groups at their minimum, and what the group would add.

Example texts for sample 08 (keys in brackets; EN shown, ES by the same keys):

```
[timefit.summary]      Your 2 x 45 min hold two groups at full volume: hips and calves. Squat, row and press stay in as 2-set movements.
[timefit.kept]         Trained directly: Hips 10 -> 12 sets a week, Calves 7 -> 8.
[timefit.pattern]      Movement kept, not counted as trained: Quads (squat 2 sets), Back (row 2 sets), Chest (press 2 sets).
[timefit.credit_only]  From other lifts only: Shoulders 1, Biceps 0.5, Triceps 0.5.
[timefit.minutes]      Monday runs about 47 min and Thursday up to 49: 2-4 min over your 45, the least that keeps these movements.
[offer.longer]         60 min: Quads and Back are trained directly too (Back 10 -> 12).   75 min: + Shoulders and the ankle hops.   90 min: + both power pieces.
[offer.more_days]      3 x 45 min: Calves 10 -> 11, Hips 10 -> 12, Quads, Back 10 -> 12 trained directly.
[offer.block_off]      Core opener off: every day inside 45 min and the ankle hops fit (same sets).
[why.chest]            Chest has one day on this template; a day holds at most 11 sets of a group, the floor plus the climb need 12. More days fix it, longer sessions do not.
```

All of these numbers are prototype output (14.1, 14.4).

**One more day never makes it worse.** Templates change with the day count, so monotonicity in days is not automatic. Rule: the
plan for n days is the lexicographically better of "the n-day template" and "the (n-1)-day plan with the extra day as an optional
day". The second is always valid, so the property holds by construction (property test P4).

---

## 8. Athletic budgets and Receive-Create stages

**Stations.** Athletic stations are template slots too (`AP_PLYO`, `AP_THROW`, `AP_COD`, `AP_SPRINT`, `AP_TRIPLE_EXT`,
`AP_JUMP_LIMITED_KNEE`). By profile rule each is one of:

| Class | Who | In the model |
|---|---|---|
| protected track | competitive athletes: one jump / throw station a day where the template has one, the Olympic lift (T1-POL-13, T0-ATH-01); swimmers' shoulder care, racket 50+ joint care (T0-ATH-05, T0-SAFE-06) | fixed block: its minutes are reserved before any group |
| room item | stay-active clients: power piece, ankle hops, second athletic station; athletes: second jump / throw stations inside the 2 + 1 split (T6-CNT-07), buy-out; a third set (A-ATH-SET) | keep list, below every group; must fit the chosen minutes |
| dropped by profile | COD for a sport without cuts, jumps halved and extra agility off in heavy play weeks (T0-ATH-04, R3-ATH-05), 60+ defaults (T0-SAFE-05) | not compiled |

**Doses.** With the kept stations known, each key k (jump, plyometric, low contacts, throws, cuts, sprint metres) is dosed in closed
form, "dose first, sets second":

```
capacity_k   = sum over the kept stations of k:  sets x per-set maximum          (rules.athletic.reconcile.per_set_max, contacts per session cap)
scale_k      = min(1, capacity_k / target_k(N))                                  # one factor for the block: the target keeps its shape (T5-ATH-02)
planned_k(w) = sets x clamp(round(scale_k target_k(w) / sets), per-set minimum, per-set maximum),  running maximum over w   (never down, T3-ATH-01)
```

The scale is printed ("your sessions hold 65 % of the sport's jump work"), and a key under 60 % carries the warning and the offer
that would raise it (DR-16). Olympic sets follow `rules.olympic.sets`; an added set is A-ATH-SET. The plyometric share
(T3-ATH-02) is met by the drill of each station per stage and by splitting the per-set doses between plyometric and ballistic
stations; where a profile needs both keys on one station the split is a 2-number search inside the bounds.

Because athletic sets never drop inside a block, Fix_d(w) is non-decreasing and L2 holds. Whether athletic attainment or
resistance peaks get the remaining minutes is the position of the A-ATH-SET items against T5: before T5 for competitive athletes,
after it for everyone else (inventory f5, PROPOSED).

**Receive-Create stages.** One stage per exercise block, from `rules.athletic.stages` with the snap rule already in the model
(majority of the block's weeks, ties lower, one step at a time; L2-L3 may start at stage 2): 12 weeks = RC1 / RC2 / RC3 on blocks
1-4 / 5-8 / 9-12. The stage is a **selection filter** (allowed drill qualities) and a **dose table** (contacts per set); it does
not change a station's time class, so stages never touch the resistance dose. Stage changes fall on exercise-block starts because
the skeleton only changes picks there (K10).

**Measured on the samples** (14.1, 14.3): swimming jumps 24 -> 32 a week against 37 -> 49 (scale 0.65, two jump stations kept),
throws 32 -> 40 against 35 -> 45, low contacts 36 -> 50 against 51 -> 69; pickleball throws 30 -> 40 against 51 -> 69
(scale 0.58: told), jumps on target, ankle hops and the power piece off for the minutes and offered back.

---

## 9. The other plan shapes on the same machinery

| Shape | What changes | Status |
|---|---|---|
| 9.1 Class model (hybrid / CrossFit class) | class lifts are fixed slots; skill, Olympic piece and the short WOD are fixed blocks; WOD growth is the lowest room item; accessories carry the stairway | prototyped (14.2) |
| 9.2 Timed circuits (bootcamp) | parameters are rounds (3-5) and stations per group; sets = rounds x stations, flat by design; the stairway is work seconds 35 -> 50 in closed form (T3-STW-10); floors by choosing rounds and stations (at most 3 x 2^stations combinations, enumerated); minutes from the circuit formula | specified, not prototyped |
| 9.3 Strength family (four roles) | exempt from 2-4 per group (T0-SES-10); parameters are sets per role; the work and the survival are fixed blocks (never cut) | specified, not prototyped |
| 9.4 Flat blocks (maintenance, pre-season, taper, in-season, easy week) | no search: totals = round(factor x reference), realized by `fill` / `cell`; no floor; one EXISTS call checks the minutes when the template differs (in-season variant) | specified |
| 9.5 Optional days, Focus slots, bonus exercises | optional cells count for the peak (T5), never for the floor (`floor.counted_on = main_days`); only a Focus line or a small line's bonus may climb there (T7-PLC-03, -04) | specified |
| 9.6 Focus muscles | S + F and C + F on the group's targets, first in the keep order, 14 a session, first in its session (ordering pass) | parameters only |
| 9.7 4-6-day templates with twin days | twin cells (A1 / A2) are tied: N(A1) - N(A2) in {0, 1}, the earlier day takes the odd set (R3-VOL-03 literally). One decision per twin pair | specified, not prototyped |
| 9.8 Tests | R-TEST; test minutes are part of K7, so a test never sits "on top" of a day that is already full | prototyped (14.3) |
| 9.9 Next block (cycles) | S x 1.05, C + 1 per completed block (DER-09): targets only | derive |

---

## 10. Exercise selection and block-to-block variation

Selection stays `engine/select.mjs`. The contract between planner and selection is the slot:

```
slot = { day, bucket, variant, role, laterality (bilateral | unilateral), pair partner, sets per week, exercise block }
```

- **The planner fixes the time class before selection.** A slot's minutes depend on its bucket and its laterality. A small
  pre-pass sets the laterality of each compound slot per exercise block to hit the bilateral share of the profile (T8-BAL-01:
  divisor rounding of the share over the block's compound sets, session order as tie-break). Selection must return an exercise of
  that bucket and laterality, so the pick can never change the minutes the plan was solved with (the engine's "probe pick vs real
  pick" gap disappears).
- **Costs that differ by exercise block.** The oracle prices the peak with each slot's most expensive block cost (L2). Exact
  alternative when that costs peak sets: evaluate each block's last week as its own endpoint, as in research 7.4.
- **No pick found** for a slot (kit, pain, level): explicit rule, in this order: swap ladder of `rules.equipment.substitution_order`;
  flip the laterality; drop the slot and re-solve with that slot banned. The loop is bounded by the number of slots.
- **Block-to-block variation.** The skeleton, depths and sets are block-invariant; only picks change at exercise-block starts
  (T0-SES-14, T8-VAR-02: one or two small variables, work lifts and tested lifts stay). Variation therefore needs nothing from the
  planner except the slot list per exercise block. An A-DEPTH exercise exists from week 1, so no exercise appears mid-block (FM-09).
- **Second exposure different, spine days.** Template properties (axial flags per day type) and selection filters, unchanged.

---

## 11. Coach rule packs

| Layer | What a coach changes | How it reaches the planner |
|---|---|---|
| parameters | the 55 tunables of the inventory (floors, starts, ceilings, fit factor, keep order, cut order, time model, per-session cap, pattern stations, minimum climb ...) | read at compile; no code |
| templates | new or edited day templates: stations in order, group, role, pair tag, minute gates; optional `lead`, expansion lists, room priorities | compile turns any template into cells; the planner has no template-specific code |
| edit rules | switch A-PATTERN, A-GUEST, A-DEPTH limits, R-TEST order on or off; `exposure_policy`; `landing` | flags of the catalogue in 3.2 |
| rows | a new rule as a row `{id, tier, kind, predicate over the evaluation output, source}` | see below |

A custom row declares its **kind**, and registration tests the declaration on sampled points:

| Kind | Example | Where it runs |
|---|---|---|
| upper bound on something that grows with sets | "no day over 9 exercises", "at most 8 press sets on Monday" | inside the oracle (keeps L3) |
| lower bound at week 1 | "rear delts at least 4 sets a week" | week-1 construction and K4 |
| structure predicate | "no squat on the day after games" | filters cells at compile |
| anything else (ratios, shares) | "pull sets at least 1.5 x push sets" | a target derivation (as DER-08 does for swimmers) or a tie-break in the canonical point; if declared hard, checked on the final plan and reported, never silently repaired |

Because the oracle evaluates points instead of solving linear rows, a custom rule does not have to be linear; it has to be honest
about its kind.

---

## 12. Migration from engine v0.4

| File | Fate | Detail |
|---|---|---|
| `intake.mjs`, `model.mjs`, `util.mjs`, `version.mjs` | keep | - |
| `shape.mjs` | keep | training blocks, exercise blocks, block types, levels by week |
| `timefit.mjs` | keep, move | becomes `plan/eval.mjs` with `setCost`, `supersetMinutes`, line / group credit; the only time function |
| `budget.mjs`, target derivation of `volume.mjs` (`targetsFor`) | keep | F, S, C, pain, Focus, ratios, cycles (DER-01 ... -09) |
| `volume.mjs` `runBlock` (structureCut, timeCheck, probe, finishCheck, placeInc, tryBonus, buildSchedule, the retry loop) | **replace** | `plan/keep.mjs`, `plan/oracle.mjs`, `plan/dose.mjs`, `plan/stairway.mjs`, `plan/realize.mjs` |
| `week.mjs` | split | keep: week layout, weekdays, calendar, play / game spacing, prehab and test placement; remove: `applyCuts`, `enforceAthleteCap`, `moveGroupsToOptional`, `ensureAthleticTracks` (they become compile rules and room items) |
| `athletic.mjs` | split | keep: targets, stages, drill rules; replace station building and the reconcile by `plan/athletic.mjs` |
| `select.mjs` | keep | called with the slot contract of section 10 |
| `dose.mjs` | keep | plus the progression card; reads the minutes from `plan/eval.mjs` |
| `generate.mjs` | rewrite | a short orchestrator (the pipeline of section 2) |
| `validate.mjs` | thin | hard rows come from `plan/certify.mjs`; exemptions for warned muscles are deleted |
| `render.mjs`, `explain.mjs` | keep | new keys for kept movements, proofs, offers with gains |
| `model/rules.json` | data | new: room priorities per family, expansion lists, `pattern_keep` (exists), `exposure_policy`, `landing`, `fit_factor_pattern`; retire the fix-round flags of `volume` once the old code is gone |

Plan JSON (`plan/2`): unchanged fields for weeks, days, blocks, items, `weekly_sets_by_group`, `main_sets_by_group`, `est_minutes`,
`time_check.trained_groups / not_trained_directly`, `offers`. Added: `time_check.keep_vector`, `time_check.kept_movements`,
`time_check.proofs[]`, `time_check.overrun_delta`, `offers[].gain`, `weeks[].progression`. Removed: `trained_below_floor`.

Order of work (each step ships behind a flag and is scored by the benchmark):
1. `plan/eval.mjs` + `plan/compile.mjs` + `plan/certify.mjs`, run as an independent scorer on today's engine output (baseline).
2. Oracle and keep search; compare keep vectors on the 8 samples and the sweep.
3. Dose, stairway, realization; the old `runBlock` is switched off per family.
4. Athletic layer, offers, why-records.
5. Circuits, strength roles, optional days, twin tying; delete the old code.

---

## 13. Test strategy

**Unit.** `cell` against the VOL-07 sequences of the coach (2/2/2 -> 3/2/2 -> ... -> 4/3/3); `fill` evenness and "earlier day
first"; superset minutes against `engine/timefit.mjs`; credit against the worked examples of 12 section 3.1.

**Oracle against brute force.** Random small problems (2-3 days, 2-4 groups): enumerate every peak point, compare feasible /
infeasible and the minimum point with EXISTS. In CI also cross-check a sample of queries against the LP-based kernel of
`design/research/milp.mjs` on the slot-level model.

**Properties** (random valid intakes plus the sweeps; all must be 0):

| # | Property | Rules |
|---|---|---|
| P1 | same intake, same plan (fresh processes; V8 and JavaScriptCore) | T0-SYS-01 |
| P2 | `certify` finds no hard violation in any week | T0, T2, K1-K11 |
| P3 | more minutes: the keep vector is never lexicographically worse | DR-4, L4 |
| P4 | one more day: never worse (section 7 rule) | DR-4 |
| P5 | every non-FULL group has a proof: forcing it FULL with the groups above it gives `null` | DR-3 |
| P6 | every offer, run as an intake, is valid and gives exactly its stated gain | DR-17 |
| P7 | every week of every day inside its limit (sandwich), test weeks included | DR-12, L2 |
| P8 | no exercise loses a set week over week; no exercise appears or disappears inside the block | L1, T0-SES-14 |
| P9 | printed minutes = re-cost of the dosed items by `plan/eval.mjs` | DR-11 |
| P10 | a peak can only be lower with more minutes when the keep vector got strictly better, and the plan says which group was added | DR-4 (restated) |
| P11 | flat weeks of the total = L5's bound for the chosen `landing` | DR-8 |
| P12 | switching a block off in the editor changes no weekly set number | T1-POL-14 |
| P13 | athletic: planned / scaled target >= 0.9 for every kept key, never down, scale printed | DR-15, DR-16 |

**Benchmark.** `design/bench/score.mjs` (the metrics of `rules_as_constraints.json`) on the 8 samples, the bench intakes and the
minutes / days sweep of the diagnosis (105 plans). Acceptance: `floor_misses`, `one_exercise_groups`, `days_not_holding`,
`set_drops`, `weekly_rise_over`, `keep_order_inversion`, `unlisted_untrained` all 0; `overrun_minutes` equal to the proved minimum
delta; the worked examples: sample 08 with A-PATTERN off must keep exactly hips and the pinned calves (it does: 14.5).
A fix that improves one sample may not lower another sample's score.

**What the prototype already checks**: P2, P7, P8 on 42 plan solves (0 failures), P3 on 15 steps (0), P1 as 20 identical repeat
solves per sample in one process, P10 (one case, reported in 14.4).

---

## 14. Simulation on the three hardest samples

Everything below is the output of `design/sim_template-parametric/run.mjs` and `variants.mjs` (saved as `out_samples.txt` and
`out_variants.txt`) on `model/templates.json` and `model/rules.json` as read on 2026-10-10. Targets F / S / C are the engine's own
(`samples/plans/*.json > meta.targets.level_start / level_cap`). Fixed blocks and room items are listed with their rule in
`samples.mjs`. Minutes use the model's time parameters: bilateral compound 2.25 min a set, unilateral 3.0, isolation 1.85, core
1.5, throw 1.6, jump 1.65, Olympic 3.0, strength rest 4.5, changeover 1 (0.5 in a pair), warm-up 8, joint care inside the rests
0.6 a set. Sets are credited the coach's way (prime 1.0, helpers 0.25, at most 1.0 a set). Simplifications: bucket-level time
classes and credits (no exercise picks), no optional day, plans print whole minutes (one decimal is shown here).

### 14.1 Sample 08: pickleball, 52 years, L1, 2 x 45 min, mild knee pain, plays 3 x a week, 12 weeks

Template `athletic.2`: Monday A (squat + pull), Thursday B (deadlift + push). Keep order: calves (racket 50+ pin), hips, quads,
back, chest, shoulders, arms (no station on this template). Targets: hips, back, chest, shoulders F 10 / S 10 / C 13; calves F 7
(two leg days), C 8; quads is a pain line: 6 -> 7, not floored.

**By hand, step by step.**

Fixed minutes: Monday = warm-up 8 + core pair 2 x (0.75 + 0.75 + 0.75) + 1 = 5.5 + throw 2 x 1.6 + 1 = 4.2 + two joint-care items
2 x 2 x 0.6 = 2.4 -> **20.1**. Thursday = 8 + 5.5 + landing 2 x 1.65 + 1 = 4.3 + 2.4 -> **20.2**. Limits: 45 chosen, band 49.

T1, in keep order:

1. *calves FULL* (pinned): minimum point 4 + 4 sets: 4 x 1.85 + 1 = 8.4 min a day. Fits.
2. *hips FULL*: minimum point 10 + 2 = 12 sets. Thursday is its work-lift day (R-LEAD). Fits (shown below).
3. *quads FULL* (6 -> 7 on Monday, its work-lift day: squat 4 + leg extension 3 = 4 x 2.25 + 3 x 1.85 + 2 = 16.55 min). Even with
   hips at its smallest Monday cell (single-leg hinge 2 + leg curl 2 = 7.0 + 4.7 = 11.7): 20.1 + 8.4 + 16.55 + 11.7 = **56.75 > 49**.
   Hips cannot leave Monday either: 12 hip sets on Thursday alone would exceed 11 a session and take that day to about 60 min. The
   oracle returns `null`: quads cannot be FULL. *quads PATTERN*: the squat itself, 2 sets, paired with the row.
4. *back FULL*: with calves and hips at their minimum the two days have about 12 free minutes in total; 12 back sets need at
   least 12 x 1.5 = 18 even perfectly paired; `null`. *back PATTERN*: row 2 sets.
   Pair [squat 2 | row 2] = 2 x (0.75 + 0.75 + 1.5) + 1 = **7.0 min** for both.
5. *chest FULL*: one day on this template, at most 11 sets a session < 12: `null` at any length. *chest PATTERN*: press 2 sets,
   paired with the hinge.
6. *shoulders*: `null`.

Keep vector: calves FULL, hips FULL, quads / back / chest PATTERN, shoulders NONE.

T4: the smallest overrun is Thursday at 48.5 (3.5 min over 45). Room items (ankle hops, power pieces): a day holding one must
fit 45; none does. Exposures: hips on Monday too (fits).
Minimum point = peak point (no day has room under its limit): hips Monday 4, Thursday 8; calves 4 + 4.

- Monday = 20.1 + [squat 2 | row 2] 7.0 + single-leg hinge 2 x 3.0 + 1 = 7.0 + leg curl 2 x 1.85 + 1 = 4.7 + calves 8.4 = **47.2**
- Thursday (week 12) = 20.2 + [hinge 4 | press 2] (2 x 3.0 + 2 x 2.25 + 1 = 11.5) + leg curl 4 x 1.85 + 1 = 8.4 + calves 8.4 = **48.5**

T5: hips ceiling 13; a 13th set fits neither day (Monday is at its limit 47.2, Thursday at 48.5): hips 12 of 13. Starts: hips 10
(floor), calves 7. Stairway: 3 whole-set steps for 11 transitions (L5: at least 8 flat weeks; 9 with last-week landing).

**Weekly sets per group** (credited; `*` trained directly, `~` movement kept, blank = credit only):

| Group | w1 | w2 | w3 | w4 | w5 | w6 | w7 | w8 | w9 | w10 | w11 | w12 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| * hips (direct 10 -> 12) | 10.5 | 10.5 | 10.5 | 10.5 | 10.5 | 10.5 | 10.5 | 11.5 | 11.5 | 11.5 | 11.5 | 12.5 |
| * calves | 7 | 7 | 7 | 7 | 7 | 7 | 7 | 7 | 7 | 7 | 7 | 8 |
| ~ quads (squat) | 2 | 2 | 2 | 2 | 2 | 2 | 2 | 2 | 2 | 2 | 2 | 2 |
| ~ back (row) | 2 | 2 | 2 | 2 | 2 | 2 | 2 | 2 | 2 | 2 | 2 | 2 |
| ~ chest (press) | 2 | 2 | 2 | 2 | 2 | 2 | 2 | 2 | 2 | 2 | 2 | 2 |
| shoulders / biceps / triceps | 1 / 0.5 / 0.5 | | | | | | | | | | | same |
| total resistance sets | 23 | 23 | 23 | 23 | 23 | 23 | 23 | 24 | 24 | 24 | 24 | 26 |

**Minutes per day** (needed supersets on):

| Day | w1-w7 | w8-w11 | w12 | Chosen / band |
|---|---|---|---|---|
| Monday A | 47.2 | 47.2 | 47.2 | 45 / 49 |
| Thursday B | 42.5 | 44.8 | 48.5 | 45 / 49 |

**The sessions.** Monday: core 2 x 2, medball throw 2, **[squat 2 | row 2]**, single-leg hinge 2, leg curl 2, calf raise 4, joint
care. Thursday: core 2 x 2, landing drill 2, **[hinge 3 -> 4 | press 2]**, leg curl 3 -> 4, calf raise 3 -> 4, joint care. 5 and 4
resistance exercises (coach guide: about 5 at 45 min). Both days keep their template identity (knee + pull, hip + push).

Athletic work: throws 30 -> 40 a week against 51 -> 69 (scale 0.58, told); jumps 8 -> 10 against 7 -> 9 (target halved for 3+ play
days); ankle hops and the power piece are room items that did not fit and are offered back (+3 and +7 min).

**Reading.** This is the coach's own answer for this client (12 section 5.5: hips and the pinned calves at their floors, the rest
not trained directly), plus the three movements the reviews asked for, at the price of 2-4 minutes. Monday is identical all block
in sets: its progress is reps, effort and load (5.8). With `fit_factor = 1.00` the squat and the row go and every day is inside 45
(14.5).

### 14.2 Sample 04: CrossFit-style class, 35 years, L2, 4 x 60 min, 8 weeks

Template `hybrid_crossfit.4 / crossfit_style_bootcamp`: Monday squat, Tuesday press + snatch, Thursday deadlift, Friday clean +
pull. Class lifts (squat, press, deadlift, row) are fixed at 3 sets with strength rest. Fixed minutes: warm-up 8, skill 6 (Monday,
Thursday), core 5.5, Olympic piece 3 x 3.0 + 1 = 10 (Tuesday, Friday), WOD 10. With the class lift (3 x 5.25 + 1 = 16.75) every day
starts at 46.25-50.25 min. Keep order: hips, quads, back, chest, calves, shoulders, triceps (no station), biceps. Targets: big
groups F 10 / S 12 / C 18, shoulders and biceps F 10 / S 10, calves F 7 / C 8; 8 weeks: climb 2, G = 1.3282.

**T1 by hand.**

- *hips FULL, quads FULL*: each has one day. Floor 10 + climb 2 = 12 sets in one session > 11 (T5-CAP-05). `null` **at any session
  length** (confirmed by the sweep to 120 min). Their class lifts stay: squat 3, deadlift 3.
- *back FULL*: Monday [squat 3 | row 3] = 3 x (0.75 + 0.75 + 4.5) + 1 = 19.0 (the row rides in the squat's rest: + 2.25 min) and
  pulldown 2 = 5.5; Friday class row 3 + pulldown. Fits.
- *chest FULL*: Tuesday press 3 + chest isolation 2-3; Thursday [deadlift 3 | press 3] + isolation. Fits.
- *calves FULL*: Monday 4 sets (8.4) and Thursday. Fits: Monday = 29.5 + 19.0 + 5.5 + 8.4 = **62.4**.
- *shoulders FULL*: its work-lift day is Tuesday (class press + a second shoulder exercise, at least 4.7 min). Tuesday with
  chest's even split is already 50.25 + 7.75 + 6.55 = 64.55, and moving chest sets to Thursday overloads Thursday. `null`.
  *biceps*: `null`.

Keep vector: back, chest, calves FULL; hips, quads, shoulders on their class lifts. T4: the smallest overrun is Tuesday at 64.5
(4.5 min over 60). T5: no day has room for one more set inside its limit, so the peaks are the minimum point (back 12 of 15,
chest 12 of 15, calves 8 of 8).

Hand check of week 8: Tuesday = 33.5 + class press 16.75 + bench press 3 x 2.25 + 1 = 7.75 + chest isolation 3 x 1.85 + 1 = 6.55 =
**64.55**; Thursday = 29.5 + [deadlift 3 | press 3] 19.0 + chest isolation 6.55 + calves 8.4 = **63.45**; Friday = 33.5 + class row
16.75 + pulldown 4 x 2.25 + 1 = 10.0 = **60.25**.

**Weekly sets per group** (credited):

| Group | w1 | w2 | w3 | w4 | w5 | w6 | w7 | w8 |
|---|---|---|---|---|---|---|---|---|
| * back | 10 | 10 | 10 | 10 | 10 | 11 | 11 | 12 |
| * chest | 10 | 10 | 10 | 10 | 11 | 11 | 11 | 12 |
| * calves | 7 | 7 | 7 | 7 | 7 | 7 | 7 | 8 |
| quads (class squat) | 3 | 3 | 3 | 3 | 3 | 3 | 3 | 3 |
| hips (class deadlift + squat credit) | 3.75 | 3.75 | 3.75 | 3.75 | 3.75 | 3.75 | 3.75 | 3.75 |
| shoulders (class press + credit) | 6 | 6 | 6 | 6 | 6 | 6 | 6 | 6 |
| biceps / triceps (credit) | 2.5 / 2.25 | | | | | 2.75 / 2.25 | | 3 / 2.25 |
| total resistance sets | 36 | 36 | 36 | 36 | 37 | 38 | 38 | 41 |

**Minutes per day**:

| Day | w1 | w2 | w3 | w4 | w5 | w6 | w7 | w8 | Chosen / band |
|---|---|---|---|---|---|---|---|---|---|
| Mon squat | 62.4 | 62.4 | 62.4 | 62.4 | 62.4 | 62.4 | 62.4 | 62.4 | 60 / 66 |
| Tue press + snatch | 62.7 | 62.7 | 62.7 | 62.7 | 64.5 | 64.5 | 64.5 | 64.5 | 60 / 66 |
| Thu deadlift | 59.8 | 59.8 | 59.8 | 59.8 | 59.8 | 59.8 | 59.8 | 63.5 | 60 / 66 |
| Fri clean + pull | 55.8 | 55.8 | 55.8 | 55.8 | 55.8 | 58.0 | 58.0 | 60.3 | 60 / 66 |

**The sessions** (week 1 -> 8). Mon: [squat 3 | row 3], pulldown 2, calf raise 4. Tue: snatch 3, press 3 (class), bench press 3,
chest isolation 2 -> 3. Thu: [deadlift 3 | press 3], chest isolation 2 -> 3, calf raise 3 -> 4. Fri: clean 3, row 3 (class),
pulldown 2 -> 4. Class lifts progress by the HALF TIME table (3 x 7 -> 3 x 4, heavier), not by sets.

**Reading.** Three groups are trained honestly at the floor instead of two below it. The plan states that squat, deadlift and press
are class lifts and that quads and hips cannot be trained at full volume on this template at any length. The offers the re-solves
give: 4 x 75 adds shoulders and biceps (back 11 -> 13, chest 12 -> 15); if the coach lets a one-day group pass 11 sets in a session
(cap 14, PROPOSED), 4 x 75 trains hips 9 -> 11 and quads 10 -> 12 directly as well, with back, chest, calves and shoulders.

### 14.3 Sample 01: competitive swimmer, 16 years, L2, 3 x 60 min, 12 weeks, tests in week 1 and 12

Template `athletic.3`: Monday S1 (jump + knee + pull), Wednesday S2 (medball + hip + push), Friday S3 (Olympic + strength).
Protected: one jump or throw station a day where the template has one, the Olympic lift every day (2 sets), shoulder care every
session. Room items: ankle hops (Friday), upper-body plyo (Wednesday), second jump station (Monday). Tests: squat rep-max work-up
(10 min) and jump test on Monday (it replaces the jump station: + 1.7), deadlift work-up (10 min) on Friday. Athletes' last
exercise block (weeks 9-12): the bilateral work lift takes strength rest (T0-EFF-07). Keep order: back, hips, quads (profile
priorities), chest, calves, shoulders; arms credit only. Targets: back F 10 / S 15 / C 21, hips and quads 10 / 11 / 16, chest
10 / 10 / 14, calves F 10 (three leg days), shoulders 10 / 10 / 16.

Fixed minutes: Monday 26.0 (8 + 5.5 + 4.3 + 7.0 + 1.2), Wednesday 25.9, Friday 21.7; in the test weeks Monday + 11.7, Friday + 10
with that day's room items skipped (R-TEST).

**T1** (oracle answers): back FULL yes; hips FULL yes (its work lifts are Wednesday and Friday: both stay, R-LEAD); **quads FULL
`null`** (its work-lift day is Monday; with back and hips kept, the squat at strength rest, the test week and the two hip days do
not leave 12 quad sets); quads PATTERN: the squat, 2 sets on Monday; chest FULL yes (paired with the hip work lifts on Wednesday
and Friday); calves `null`; shoulders `null`. Room: ankle hops and the second jump station fit inside 60, the upper-body plyo
does not.

T4: the smallest overrun is Wednesday at 64.1 (4 min over 60) in weeks 9-12, when the hip thrust takes strength rest. Exposures:
back Monday + Wednesday, hips Wednesday + Friday, chest Wednesday + Friday. T5 leximin: back has the largest shortfall and the
only free minutes (Monday): back 14 of 21, hips 12 of 16, chest 12 of 14.

Hand check of week 12 (strength rest on the work lifts, tests on Monday and Friday):

- Monday = 26.0 + tests 11.7 (the second jump station is skipped) + [squat 2 | row 5] (2 x 3.0 + 3 x 2.25 + 1 = 13.75) + pulldown
  5 x 2.25 + 1 = 12.25 = **63.7**
- Wednesday = 25.9 + [hip thrust 3 | press 3] 3 x (0.75 + 0.75 + 4.5) + 1 = 19.0 + row 2 x 2.25 + 1 = 5.5 + [single-leg hinge 2 |
  chest isolation 2] 2 x (1.5 + 0.6 + 1.5) + 1 = 8.2 + pulldown 5.5 = **64.1**
- Friday = 21.7 + test 10 (the ankle hops are skipped) + [deadlift 4 | press 4] 4 x 6.0 + 1 = 25.0 + [leg curl 3 | chest isolation 3]
  3 x (0.6 + 0.6 + 1.25) + 1 = 8.35 = **65.05**

**Weekly sets per group** (credited):

| Group | w1 | w2 | w3 | w4 | w5 | w6 | w7 | w8 | w9 | w10 | w11 | w12 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| * back | 10 | 10 | 10 | 10 | 11 | 11 | 11 | 12 | 12 | 13 | 13 | 14 |
| * hips (direct 10 -> 12) | 10.5 | 10.5 | 10.5 | 10.5 | 10.5 | 10.5 | 10.5 | 10.5 | 11.5 | 11.5 | 11.5 | 12.5 |
| * chest | 10 | 10 | 10 | 10 | 10 | 10 | 11 | 11 | 11 | 11 | 11 | 12 |
| ~ quads (squat) | 2 | 2 | 2 | 2 | 2 | 2 | 2 | 2 | 2 | 2 | 2 | 2 |
| shoulders (credit) | 2.75 | 2.75 | 2.75 | 2.75 | 3 | 3 | 3 | 3 | 3 | 3.25 | 3.25 | 3.5 |
| biceps / triceps (credit) | 2.5 / 1.5 | | | | 2.75 / 1.5 | | | 3 / 1.5 | | 3.25 / 1.5 | | 3.5 / 1.75 |
| total resistance sets | 32 | 32 | 32 | 32 | 33 | 33 | 34 | 35 | 36 | 37 | 37 | 40 |

**Minutes per day** (week 1 and week 12 hold the tests):

| Day | w1 | w2 | w3 | w4 | w5 | w6 | w7 | w8 | w9 | w10 | w11 | w12 | Chosen / band |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Mon S1 | 58.7 | 51.3 | 51.3 | 51.3 | 53.5 | 53.5 | 53.5 | 55.8 | 51.8 | 54.0 | 54.0 | 63.7 | 60 / 66 |
| Wed S2 | 58.6 | 58.6 | 58.6 | 58.6 | 58.6 | 58.6 | 58.6 | 58.6 | 64.1 | 64.1 | 64.1 | 64.1 | 60 / 66 |
| Fri S3 | 56.6 | 49.4 | 49.4 | 49.4 | 49.4 | 49.4 | 51.3 | 51.3 | 51.9 | 51.9 | 51.9 | 65.0 | 60 / 66 |

(Monday drops from week 8 to week 9 because the squat + row superset is switched on for the last exercise block.)

**The sessions** (week 1 -> 12). Mon: jump station x 2, clean-family lift, [squat 2 | row 3 -> 5], pulldown 3 -> 5. Wed: medball
throws, snatch-family lift, [hip thrust 3 | press 3], row 2, [single-leg hinge 2 | chest isolation 2], pulldown 2. Fri:
clean-family lift, ankle hops, [deadlift 3 -> 4 | press 3 -> 4], [leg curl 2 -> 3 | chest isolation 2 -> 3]. Every day keeps its
template identity; counted exercises 5-8 a day (cap 12).

Athletic work a week: jumps 24 -> 32 against 37 -> 49 (4 sets, scale 0.65); throws 32 -> 40 against 35 -> 45; low contacts 36 -> 50
against 51 -> 69; Olympic 6 sets every week against 4.5 -> 7.5.

**Reading.** Three groups at their floors with a real climb (back + 4), and the swimmer's first priority (back) gets the free
minutes. Monday and Friday run at 49-56 min in the middle weeks: the peak is sized by weeks 9-12 (strength rests) and by the test
week, and sets never drop. The re-solves price both: **without the end-of-block tests quads is trained directly too**
(back, hips, quads, chest all 10 -> 12), and without the late strength rest as well (quads 10 -> 13). Both are coach decisions
(section 15.2), stated in the plan as offers.

One coupling is left open. The Monday rep-max work-up sits on the squat, which this plan keeps only as a 2-set movement, and
Friday already tests the deadlift. A one-off re-solve with Monday reduced to its jump test
(`swimmer(60, { tests: { Mon: { 1: 1.7, 12: 1.7 }, Fri: { 1: 10, 12: 10 } } })`) gives back 10 -> 12, hips 10 -> 12, **quads
10 -> 12** trained and **chest kept as a 2-set movement** (quads outranks chest in this profile), longest day 66.0, 0 violations.
So the choice of tests decides between quads and chest here. The design rule: a strength test is placed only on a lift the plan
trains; when the first solve keeps the tested lift as a movement, the test is dropped or moved, the plan is solved once more,
and the better keep vector wins. The prototype takes the test days as given.

### 14.4 Offers: the session-length sweep (each line is a full re-solve; `a->z` = direct sets week 1 -> last)

| Minutes | 08 pickleball, 2 days | 04 class, 4 days | 01 swimming, 3 days |
|---|---|---|---|
| 30 | calves 7->8 | does not fit (the class needs 60) | does not fit |
| 45 | **calves 7->8, hips 10->12; kept: quads, back, chest** | does not fit | back 10->12; kept: hips, quads, chest |
| 60 | + quads 6->7, back 10->12; kept: chest | **back 10->12, chest 10->12, calves 7->8** | **back 10->14, hips 10->12, chest 10->12; kept: quads** |
| 75 | + shoulders 8->11, back 10->13; ankle hops on | back 11->13, chest 12->15, calves 7->8, shoulders 9->11, biceps 8->10 | back 10->13, hips 10->12, quads 10->12, chest 10->12, calves 10->11; all room items on |
| 90 | hips 10->13; both power pieces on | back 12->15, chest 12->15, calves 7->8, shoulders 10->12, biceps 9->11 | back 15->20, hips 10->14, quads 13->16, chest 10->13, calves 10->11, shoulders 8->11 |
| 105-120 | as 90 | as 90 | back 15->21, hips 10->15, quads 13->16, chest 10->14, calves 10->12, shoulders 8->11 |

Bold = the chosen length. Checks over the 15 comparable steps (a step from a length that does not fit is not counted): keep
vector worse with more minutes **0**; certify violations **0**; a trained group's peak (direct sets) lower with more minutes
**1** (swimming back 14 -> 13 from 60 to 75 min, because quads and calves joined: T1 outranks T5; the plan says so, property
P10). Chest on the 2-day template and quads / hips on the class template never become FULL: one day, 11 sets a session. There
the "more days" offer applies: pickleball 3 x 45 trains calves 10->11, hips 10->12, quads 6->7 and back 10->12 directly; 3 x 60
adds chest 10->13 and shoulders 7->10.

### 14.5 Readings and toggles (re-solves)

| Variant | Result | Longest day |
|---|---|---|
| 08 as planned (fit factor 1.10, movement stations on) | calves 7->8, hips 10->12; kept: quads, back, chest | 48.5 |
| 08 strict minutes (fit factor 1.00) | calves 7->8, hips 10->12; kept: chest | 45.0 |
| 08 no movement stations (the selection of 12 section 5.5) | **calves 7->8, hips 10->13** | 45.1 |
| 08 strict minutes, no movement stations | calves 7->8, hips 10->13 | 45.1 |
| 08 core opener switched off by the user | as planned; ankle hops on | 44.7 |
| 08 athletic station switched off by the user | as planned | 44.5 |
| 08 one more day, 3 x 45 | calves 10->11, hips 10->12, quads 6->7, back 10->12 | 49.3 |
| 04 as planned | back 10->12, chest 10->12, calves 7->8 | 64.5 |
| 04 strict minutes | back 11->14, chest 10->12 | 60.5 |
| 04 at 4 x 75 | back 11->13, chest 12->15, calves 7->8, shoulders 9->11, biceps 8->10 | 77.3 |
| 04 at 4 x 75, 14 sets of a group allowed in a session | hips 9->11, quads 10->12, back 11->13, chest 10->12, calves 7->8, shoulders 9->11 | 79.5 |
| 01 as planned | back 10->14, hips 10->12, chest 10->12; kept: quads | 65.0 |
| 01 strict minutes | back 11->16, quads 13->15; kept: hips, chest | 60.3 |
| 01 no tests | back, hips, quads, chest 10->12 | 63.4 |
| 01 work lifts without the late strength rest | back 10->13, hips 10->12, quads 10->13, chest 10->12 | 66.1 |

### 14.6 "Ceiling in the last week" vs "no flat week" (weekly total of every resistance set)

| Sample | Landing first (default) | Never flat first |
|---|---|---|
| 08 | 23 23 23 23 23 23 23 24 24 24 24 26 (9 flat) | 23 23 23 23 23 23 23 24 24 24 25 26 (8 flat, the minimum for 3 steps) |
| 04 | 36 36 36 36 37 38 38 41 (4 flat) | 36 36 36 37 38 39 40 41 (2 flat, the minimum for 5 steps; back reaches 12 in week 6) |
| 01 | 32 32 32 32 33 33 34 35 36 37 37 40 (5 flat) | 32 32 32 32 33 34 35 36 37 38 39 40 (3 flat, the minimum for 8 steps; back reaches 14 in week 10) |

Both are the same peak and the same minutes; only the weeks of the steps differ. The reviews complained about both flat runs
and ceilings reached early, so this is the coach's call (15.2 item 6).

---

## 15. Limits, risks, decisions

### 15.1 Limits of this design (stated, not hidden)

1. **Conservative helper credit in the oracle.** A floor may lean only on credit that is in the week at every exposure choice. A
   group that could reach its floor through donors' sets above their minimum is tested with up to about one direct set too many.
   The final week 1 is exact on the evaluator. Exact alternative: carry the donors' credit as extra state of the day programme.
2. **Leximin beyond the first level is priority-refined**, not pure. Deterministic; documented.
3. **L3 at depth changes.** Proven for fixed depth. The per-cell check at compile is specified, not prototyped. Sound in any case.
4. **Heavy tail.** About 0.7 s in the worst sweep case, in unoptimized code. If the optimized oracle still has tails, the fallback is
   the LP-based kernel of `design/research/` as a second backend behind the same EXISTS interface, never a silent drop.
5. **The weekly-total bound of the stairway is conservative** (10 % of the week-1 total for every week). In large plans this caps
   late steps slightly below what the rule allows. Exact alternative: a 2-stage flow with the caps recomputed from the realized totals.
6. **Not prototyped**: twin tying on 4-6-day templates, split templates, circuits, strength roles, optional-day cells, Focus,
   multi-block plans, exercise picks (so laterality-driven time classes), JavaScriptCore.
7. **Frequency before peak height (D1)** can leave a peak one set lower than a plan that gives up a template day would reach.
8. **R-LEAD costs flexibility**: a group with two work-lift days (swimmer's hips) must hold both.
9. **Time model.** The minutes are the model's class constants; the design shares them between solver and dose but cannot make
   them true. Calibration on the coach's own sessions stays a separate task (DR-11).

### 15.2 Decisions for the coach that this design surfaces

| # | Decision | Default here | Measured effect |
|---|---|---|---|
| 1 | May a kept movement station use the "a little longer day" band? | yes (T1-POL-02 as filed) | 08: squat + row kept, Monday 47 instead of 45 (14.5) |
| 2 | Kept movement stations at all (T1-POL-07)? | yes, at most 3 a week | 08 without: hips reaches 13 instead of 12 |
| 3 | 11 sets of a group in a session when the template gives the group one day | 11 (model) | class: quads and hips can never be trained directly; with 14, 4 x 75 trains both |
| 4 | Tests inside the last, hardest week | inside the band, room items skipped that day (R-TEST) | swimmer: without tests quads is trained directly at 3 x 60 (14.5) |
| 5 | Athletes' late strength rest on work lifts (E-125, O-17) | as the model | swimmer: without it quads is trained directly too (14.5) |
| 6 | Stairway: "ceiling in the last week" or "no flat week" first | ceiling in the last week | 14.6 |
| 7 | Fit factor (C-03) | 1.10 for group states, 1.00 for everything else (D2) | strict column of 14.5 |
| 8 | Frequency before peak height (D1) | yes | not measured: the other policy is not in the prototype |
| 9 | Starts move toward the floor when the plan has fewer steps than weeks | yes (by its formula it gives the starts of 12 section 5.2 and 5.5) | swimmer: back starts at 10, not 12, so the block has 8 whole-set steps instead of 6 |

---

## 16. Reproduce

```
node design/sim_template-parametric/run.mjs all        # the three plans: keep vector, weekly sets, minutes, sessions, athletic work, certify
node design/sim_template-parametric/run.mjs swimmer 75 # one sample at another session length
node design/sim_template-parametric/variants.mjs       # session-length sweep, toggles, stairway order, timing and repeatability
```

Files: `tpp.mjs` (compile, evaluation, oracle, planner, stairway, certify: 638 lines), `samples.mjs` (the three intakes as planner
inputs, with the rule behind every fixed block), `run.mjs`, `variants.mjs`, saved outputs `out_samples.txt`, `out_variants.txt`.
The prototype imports `design/research/mcf.mjs` (min-cost flow) and the lambda curve of `design/research/proto_stairway_flow.mjs`,
and reads `model/rules.json` and `model/templates.json`. It writes nothing.
