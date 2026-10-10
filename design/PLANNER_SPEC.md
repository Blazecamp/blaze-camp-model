# Blaze Camp planner specification (planner/1)

The dosing planner that replaces the volume engine of engine 0.4: who is trained directly, how many sets each week, where each
set goes, how the athletic work shares the minutes, and what the plan says when the time cannot hold everything.

Status: specification, 2026-10-10. It is the synthesis of the design panel: the winning design `design/design_two-stage.md`
(all three judges), with the grafts the judges named from `design/design_template-parametric.md` and `design/design_milp.md`.
Read with it: `design/diagnosis.md` (why the current engine fails), `design/rules_as_constraints.md` / `.json` (the rule
inventory; every id of the form `T<tier>-...`, `DEF-`, `DER-`, `SF-`, `FM-`, `C-`, `P-`, `O-` below is from that file),
`design/judge_1.md`, `judge_2.md`, `judge_3.md`. Companion: `design/IMPLEMENTATION_PLAN.md` (work packages).
Nothing outside `design/` was written to produce it, and no git command was run.

## Current Policy Amendment: 2026-10-10

**Controlling source:** [coach answers CX-01 through CX-04](../coach_answers_codex_2026-10-10.md), newer than round 3 for these topics. The original prototype results and proofs below are historical evidence for the earlier, rate-limited design, not validation of this amendment. Runtime, compiled model, and prototypes have not been changed by this documentation update.

- **CX-01, approved:** accelerate the planned increase when needed to reach the intended endpoint instead of finishing below it solely because of the former weekly rate limit. The 3%/5% shape remains the ordinary reference; `lambda > 1` is permitted when needed. This does not approve a new numerical maximum rate, establish a scientifically validated safe rate, raise the applicable set ceiling, or override equipment, time, execution-quality or clinical-scope constraints. Existing PROPOSED targets remain PROPOSED. A genuinely infeasible endpoint must still be disclosed with the authorized alternatives.
- **CX-02, approved:** occasional same-set weeks may progress reps or load. This is not permission to substitute a rising display number for training progression. A nonsaturated accumulation block still progresses overall; maintenance and saturation are distinct regimes.
- **CX-03, approved:** at the applicable set ceiling, hold sets and progress load/reps. No positive minimum set climb or division by `C-S` applies when `S=C`. Reconcile the canonical iterative rounding before each next-block calculation. The exact bounded recurrence `C_next = min(C + 1, applicable_cap); S_next = min(C_next, round_half_up(1.05*S))` is **PROPOSED implementation**, consistent with holding the ceiling, not a newly approved numerical coaching rule. If imported state has `S>C`, report the inconsistency and resolve it before planning.
- **CX-04, approved:** the person or coach may edit sets in any week/day. Edits are explicit prescription overrides; they require re-tallying credits, time and constraints. The original certificate does not automatically survive an edit, and an edited prescription must not be represented as certified when a rule fails. This creates no check-ins, tracking or stored personal data, and makes no prediction of the individual's future outcomes.

**Implementation gate.** This spec is not yet a complete algorithm for the amended policy. R-LAMBDA, R-TOP, R-REACH, R-STEP.G, R-STEP.T, positive minimum climbs, the peak objective at zero headroom, and the scheduler's fallback/proofs must be revised and independently checked before enabling the new planner. The one-set-per-group-per-week model is only a candidate fast path when it can reach the authorized endpoint. Failure of that restricted path does not prove the endpoint infeasible. L5/L6, T1/T3, existing fuzz results and the arithmetic-minimum-flat claim do not certify an accelerated path with different bounds. No full planner build is authorized by this amendment.

**Required boundary checks before that gate:** six weeks, calves 3 to 4 (standard growth reaches 3.684373, so an exact curve needs `lambda > 1`); twelve weeks, 12 to 22; an endpoint needing more than one added set per group in a week; `S=C`; an imported `S>C`; repeated blocks with iterative rounding and saturation; a user edit that exceeds time or the ceiling; and a continuously reachable endpoint that has no legal integer allocation. Numerical root-finding, discrete scheduling, rounding/tolerance and edited-plan reporting remain implementation proposals to verify, not new coach answers.

Before the current policy amendment, changes from the winning design were built on a copy of its prototype and run before being written
down. Those runs are in `design/spec_checks/` and are summarized in Appendix A. A number marked *measured* comes from a saved
output there or from a design or judge file named beside it. A number marked *target* has not been measured.

---

## 0. Summary

**What is built.** A two-stage planner. Stage 1 decides the numbers; stage 2 writes the sessions; a certificate links them, so
stage 2 can never fail, cut or change what stage 1 decided.

| Stage | Decides | Method | Guarantee |
|---|---|---|---|
| S0 grammar | which exercises of which group may sit on which day, in what order, with which pair partner; the fixed blocks; the kept-movement stations; the room items; the proved weeks | compiled from the coach's templates by a short catalogue of edit rules (data) | the planner never invents a day and never reorders one |
| SA athletic | athletic stations, sets and weekly doses; their minutes per day and week | a protected minimum per profile class, then room items in keep order; doses scaled once per key | athletic minutes are inside the day before any set is placed; no dose ever drops |
| S1 block table | who is trained directly; which room items stay; which movements are kept; the smallest overrun; how high each group climbs; week 1; the structure | lexicographic tiers; every question goes to an exact three-valued oracle on a small whole-number model | a group is left out only when no legal plan trains it with every higher-priority group; "not proven" is never read as "does not fit" |
| S1 stairway | the week each added set lands in | dynamic program on the totals really placed, then a transportation flow | step limits hold on the placed weeks; fewest flat weeks the sets allow |
| S2 placement | sets per exercise per day per week; supersets needed; what climbs each week | one add sequence per group, week w is a prefix; the coach's staircase inside a day | no exercise ever loses a set; every week passes every hard rule without being searched |
| S3 dose and certify | reps, effort, rest inside the solved sets; every rule re-evaluated on every week | one time function shared with the dose; the rule catalogue | printed minutes equal planned minutes; nothing changes after S2 |

**What the spec changes in the winning design** (each traced to its judge in Appendix B):

| Change | Why | Evidence |
|---|---|---|
| Every keep question leaves every later group free; every row, pruning rows included, is built from the credit table | judge 2 found two false "does not fit" verdicts | *measured*: both counterexamples pass; 4,800 questions against brute force with own credit of 0, 2 and 4 quarter sets, 0 verdicts differ (the unpatched prototype: 48 false "no"); keep vector equal to exhaustive enumeration in 1,200 of 1,200 |
| The day keeps its pattern: a big mover that is not trained keeps its own work lift at 2 sets on its own day; an active lower work lift always keeps its upper partner | the reviewed blockers "the knee day became a second hinge day" and "no press on the hip + push day" | *measured*: pickleball 2 x 45 comes out as step-up + row on Monday and hinge + press on Thursday; the swimmer gets a squat and two presses |
| Two day limits: trained groups are decided inside the chosen minutes; kept movements may use "a little longer day"; the smallest overrun is found exactly and frozen before any peak is raised | the coach's order (who is trained must not depend on a tolerance) and the review finding "days over the minutes" | *measured*: 20 plans on three samples, 0 violations; overrun 0 to 3.5 minutes, always told |
| Room items (second athletic station, power piece, extra joint care, an athletic set) are a ladder the oracle walks; a block is cut only when a kept group needs its minutes | one care item more cost the pickleball plan its only big mover | specified; the ladder is data per profile class |
| The proved weeks come from a dominance test (one more proved vector for every week no later week dominates) | reserved maximum costs cost physique plans peak sets | specified; reserved costs stay as a fallback mode |
| Tests sit inside the day limit; a strength test only on a lift the plan trains | tests on top of a full day ran to 128 % of the minutes | specified |
| Twin days (A1 / A2) are tied first, proved untied | the search tail lives in this symmetry | *measured* on sample 06: 20,967 nodes tied against 153,187 untied, same budget |
| Stairway order `last, flat, hold, late, shape, land`; each group's final set as late as the rises allow | flat weeks ahead of the curve; groups at their ceiling weeks early | *measured* on 3,891 random tables: flat weeks at the arithmetic minimum in 3,891 (prototype order: 3,356); groups at their peak before week N-1 in 88 plans (205 without the late rule) |
| One node cap per plan; a generic propagator separate from the training model; every pruning row named, switchable and tested on its own | judge 3's conditions | specified; gate in 13.3 |
| "One more day is never worse" by construction; a minimum session length per template; a plan when no group fits; conflicts in rule ids on demand; the certified grid; shadow mode | grafts from both other designs | specified |

**The state of the evidence.**

- Legality held in every run of every prototype, including the ones made for this spec: no trained group under its floor,
  no exercise losing a set, no day over the limit it was given.
- The first full-size plan of this panel (sample 06: 8 groups on 4 days, written out by hand) trains all 8 groups inside
  75 minutes with 9-10 exercises a day and a weekly total that rises every week (98 -> 142). It also shows the cost: the
  unoptimized prototype needs 61,615 search nodes and 3.6 s at the smallest budget and 54 s at the largest, against a target
  of 250 ms. Section 10 says what has to be built to close that gap and what happens if it does not close.
- Samples 02, 03, 05 and 07 have not been run by any prototype. The grammar builder (S0) is the largest unbuilt piece.

**What needs the coach** (section 14): the original panel listed fifteen choices with prototype defaults. CX-01..03 resolve the policy portions of D10/D15; they do not approve the remaining defaults or waive the new implementation gate. The three that move
the plans most: whether kept movements may run a day 2-4 minutes long (the 2 x 45 table of 14.1), which fixed blocks stay
ahead of a big mover for each kind of client, and the late-block strength rest of athletes' heavy lifts.

---

## 1. Scope, sources, words

### 1.1 Scope

In scope: the dosing layer of one plan. For every stairway block: which FOCUS groups are trained directly, which movements
are kept, sets per exercise per week, athletic stations and doses, supersets needed, the time check and its offers, the
reason for every decision. For flat blocks, classes, circuits and four-role strength days: the format handlers of 7.13.

Out of scope: the intake and its safety screen, the exercise catalogue, selection scoring, rep / effort / load text except
the progression card (7.8), rendering except the new keys (section 8). They are kept modules; section 11 lists every seam.

### 1.2 Sources and authority

When sources differ, the earlier wins: `coach_answers_codex_2026-10-10.md` (CX-01..04, within their scope) > `coach_answers_round3.md` > `coach_answers_round2.md` > `coach_answers_full.md` >
`BLAZE_CAMP_BRAIN.md` v1.2 > `generator_spec_v1.json`, `synthesis/12_volume_algorithm_v1.md` > `engine/DECISIONS.md`,
`model/rules.json` 1.3.0. A value marked PROPOSED is ours and waits for the coach. The binding engine rules of
`engine/CONTRACTS.md` 1.2 and 1.3 stay binding: plain ES modules, no npm dependency, no build step, no clock, no randomness,
synchronous `generate()`, byte-identical output.

### 1.3 Words used in this document

| Word | Meaning |
|---|---|
| group | one of the coach's FOCUS groups: quads, hips (glutes + hamstrings), back, chest, shoulders, biceps, triceps, calves |
| trained directly | the group has its own exercises, holds its floor every week and climbs (state FULL) |
| kept movement, pattern station | one exercise at 2 sets, constant over the block, for a big mover that is not trained directly. It credits its muscles and is never counted as trained (state PATTERN). Three kinds: **lead** (the day's own work lift), **partner** (the upper lift paired with an active lower work lift), **keep** (any other template station of the coach's pattern list) |
| class lift | the heavy lift of a class day (3 sets, the class's own progression): a fixed item that credits its group |
| group-day | one group on one day: its candidate exercises in session order |
| candidate | an exercise that may be switched on: a template station, a minute-gated template station, or an extension exercise of the same group |
| work lift, home day | the day's main lower lift (template role `work`); the day that holds a group's work lift is that group's home day |
| fixed block | minutes that do not depend on the dose: warm-up, core opener, skill, athletic and Olympic stations, joint care, WOD, tests |
| room item | a fixed block or an extra athletic set that the planner may leave out, in a fixed order, when a kept group needs the minutes |
| keep order, keep vector | the coach's priority order of the groups; the list of yes / no "trained directly" read in that order |
| oracle | the search that answers "is there a legal plan with these pins?" with **fits** (and a plan), **no** (a proof) or **unknown** (budget spent) |
| certificate | what stage 1 hands to stage 2: the structure and the set vector of every proved week, checked against every hard rule |
| epoch, proved week | a week whose set vector is a variable of the oracle: week 1, the last week, and every week no later proved week dominates in cost |
| tier | one level of the lexicographic objective; a tier is frozen as a pin before the next is asked |
| stairway block, exercise block | the 6 / 8 / 12-week block with one continuous climb; the 4-6-week stretch inside it in which the exercises stay the same |
| chosen minutes, band, overrun | the session length the person picked; the extra seconds a day may run when a rule allows it; the seconds a day really runs over |

---

## 2. Architecture

### 2.1 Data flow

```
intake -> validateIntake, safetyScreen, deriveValues, buildShape                         [kept: intake.mjs, shape.mjs]
   buildWeekLayout(uncut)        every template station of every day, nothing cut        [week.mjs, changed]
   lateralityPlan                bilateral or unilateral per compound slot and exercise block   [plan/laterality.mjs]
   selectBlock (uncut week)      one pick per candidate and exercise block               [select.mjs, kept + two additions]
   S0  buildGrammar              the instance: groups, days, group-days, stations, pairs, room items, epochs, tests
   SA  planAthleticStations      protected minimum + room items with their seconds and capacities
   S1  planTable                 G1 keep -> G2 room -> G3 kept movements -> G3b overrun -> G4a room -> G5s sessions -> G5 peaks
                                 -> G6 week 1 -> G7 structure -> G7b middle epochs -> G4b room   (every question to the oracle)
       scheduleStairway          own sets per group per week between the proved weeks
   S2  placeBlock                add sequences -> sets per exercise per week -> supersets needed -> progression facts
   S3  certifyBlock              every catalogue rule on every week; doses of the athletic keys
   adapter -> VolumePlan         the shape generate.mjs reads today, plus the planner payload
   doseItem, finishWeek          reps / effort / rest from the SAME dose parameters the time function used   [dose.mjs]
   validatePlan                  the catalogue again, on the plan JSON                                         [validate.mjs]
-> plan/2 (same contract, new fields in time_check, offers, weeks[].progression, meta.planner)
```

One planner run handles one stairway block. A plan with several training blocks runs the chain once per block; the next
block takes its starts from DER-09 and is otherwise independent.

### 2.2 One owner per decision

| Decision | Owner | Never touched again by |
|---|---|---|
| day types, block order, pairs, spine days, which group may train on which day, which exercise may be third or fourth | S0 (template data + edit rules) | any stage: the planner only switches candidates on and off |
| laterality of every compound slot | laterality pre-pass, then the pick | the planner reads the pick's time class and never changes it |
| athletic stations, their sets, weekly doses, their minutes | SA | S1 reads the minutes and decides the room prefix; S2 and S3 move nothing |
| who is trained; room items kept; kept movements; overrun; exposure days; exercise counts; week-1, middle and peak vectors | S1 | S2, S3, dose, validate |
| own sets per group per week | S1 scheduler | S2, S3 |
| sets per exercise per week; which pairs run as supersets | S2 | S3, dose |
| exercise picks, reps, effort, load cue, words | selection and dose | may not change a time class, a credit class or a set |

This table is the answer to diagnosis RC1 (four independent time cutters) and RC4 (targets, packing and verification as
three computations).

### 2.3 Five readings of "a legal plan", on purpose

| Implementation | Where | Shares with the planner | Role |
|---|---|---|---|
| the oracle's rows | `engine/plan/oracle.mjs` | - | decides |
| the certifier | `engine/plan/certify.mjs` | the catalogue entries, the time function, the credit tally; none of the search | re-evaluates every week of the block the planner built; a failure is a planner defect and the plan is not returned |
| the validator | `engine/validate.mjs` | the catalogue ids and parameters | re-computes from the plan JSON, after dosing |
| the scorer | `design/bench/score.mjs` | the rule ids only | the definition of done (section 13); written from the coach's rules, with no exemption that is not a named parameter |
| the reference model (build time) | `tools/planner/ref/` | the instance JSON only | a second, slot-level model with its own search; certifies the keep vector of every grid cell offline (12.4) |

---

## 3. Modules and file ownership

Owners are the work packages of `IMPLEMENTATION_PLAN.md`. A file has one owner; nobody else writes it.

### 3.1 New engine modules (`engine/plan/`)

All are pure ES modules that import only `engine/**/*.mjs`. `CONTRACTS.md` 1.1 and 1.2 are amended to allow the subfolder
(owner WP-00).

| File | Job | Main exports | Owner |
|---|---|---|---|
| `plan/types.mjs` | JSDoc typedefs of section 4, no code | typedefs | WP-00 |
| `plan/units.mjs` | whole-number units and their assertions | `SEC`, `Q`, `toSeconds`, `toQuarters`, `growth10k`, `cmpRatio` | WP-01 |
| `plan/timecost.mjs` | THE time function | `doseSeconds`, `straightSeconds`, `pairSaving`, `daySeconds` | WP-01 |
| `plan/staircase.mjs` | the staircase inside a group-day, the add sequence, the twin split | `staircase`, `addSequence`, `twinSplit` | WP-01 |
| `plan/fd.mjs` | generic finite-domain search: variables with table values, rows that are sums of table values, pair terms; knows nothing about training | `createModel`, `solve` | WP-02 |
| `plan/stairway.mjs` | the scheduler, its existence test, its certificate, the fallback order | `existsSchedule`, `scheduleStairway`, `certifyTable` | WP-03 |
| `plan/catalogue.mjs` | the rule catalogue: binds every data entry to its row builder and its evaluator; registers custom rules | `loadCatalogue`, `registerRule`, `evaluateRule` | WP-04 |
| `plan/certify.mjs` | every catalogue rule on every week of a placed block | `certifyBlock` | WP-04 |
| `plan/laterality.mjs` | the laterality pre-pass | `lateralityPlan`, `shareReached` | WP-08 |
| `plan/athletic_plan.mjs` | SA: protected minimum, room items, doses per key, stages | `planAthleticStations`, `doseAthleticKeys` | WP-10 |
| `plan/grammar.mjs` | S0: template -> instance; H1-H5 assertions; minimum length; structural "no" | `buildGrammar`, `assertInstance`, `minimumMinutes` | WP-11 |
| `plan/oracle.mjs` | the fd model of a question, the implied rows, the tied-first protocol, the budget ladder | `buildOracle`, `ask` | WP-12 |
| `plan/table.mjs` | S1: the tiers | `planTable` | WP-13 |
| `plan/placement.mjs` | S2: weeks, supersets needed, progression facts | `placeBlock` | WP-14 |
| `plan/formats.mjs` | class lifts, timed circuits, four-role strength days, flat blocks | `formatFor`, `planFlatBlock`, `planCircuitBlock` | WP-15 |
| `plan/planner.mjs` | the chain, the branches, "one more day", the `VolumePlan` adapter | `planBlock`, `planForIntake`, `planWeeklySetsV2` | WP-16 |
| `plan/offers.mjs` | reasons, offers and switches by re-solving | `reasonsFor`, `offersFor` | WP-17 |
| `plan/conflict.mjs` | minimal conflict in rule ids, on demand | `conflictFor` | WP-18 |

### 3.2 Engine files that change (one owner each; detail in section 11)

| File | Change | Owner |
|---|---|---|
| `week.mjs` | uncut layout; cuts deleted; `estimateMinutes` becomes a wrapper | WP-07 |
| `select.mjs` | honours the laterality plan; picks for extension candidates and stations; class-preserving re-pick | WP-08 |
| `dose.mjs` | exports `doseParams`; prints the progression card | WP-09 |
| `athletic.mjs`, `budget.mjs` | targets kept; station building and the reconcile deleted | WP-10 |
| `timefit.mjs` | lines, groups and credits kept; `setCost` / `supersetMinutes` call `plan/timecost` | WP-01 |
| `volume.mjs` | `computeTargets`, `calvesFloor`, `weeklyCredits`, `stairwayPlan` kept; `planWeeklySets` body replaced by the adapter call, then deleted | WP-16 (WP-21 deletes) |
| `generate.mjs` | reads `rules.planner.engine`; one planner call; no reconcile; shadow summary | WP-16 |
| `validate.mjs`, `render.mjs`, `explain.mjs` | read the catalogue; new sections and keys | WP-19 |
| `util.mjs`, `model.mjs`, `version.mjs`, `CONTRACTS.md`, `DECISIONS.md` | typedef import, `rules.planner` accessor, version 0.5.0, contract amendments | WP-00 |

### 3.3 Model data, tools, tests

| Path | Content | Owner |
|---|---|---|
| `tools/fixture/planner-rules.mjs` | the amendment layer for `rules.planner` (4.7), the catalogue (4.8) and the edit rules (4.9); wired into `build-fixture.mjs` and `compile-model.mjs` | WP-00 |
| `tools/fixture/planner-templates.mjs` | template annotations: lead and partner flags, extension lists, optional-day cells, room tags | WP-07 |
| `tools/fixture/planner-words.mjs` | EN / ES strings of section 8; wired into `tools/compile/i18n.mjs` | WP-19 |
| `tools/planner/ref/*.mjs` | the reference model and its search | WP-05 |
| `tools/planner/grid.mjs`, `certify-grid.mjs`, `bench-time.mjs`, `staircase-price.mjs` | the grid sweep, the certification, the timing, the price of the hard staircase | WP-20 |
| `tools/planner/decision-table.mjs`, `shadow.mjs` | the coach's decision table; both engines side by side | WP-17, WP-16 |
| `tools/planner/score-all.mjs`, `sweep.mjs`, `bench-fd.mjs`, `reschedule.mjs` | the benchmark on every corpus; the minutes and days sweep; the node-cost bench; the old engine's plans re-scheduled (slice 2) | WP-06, WP-06, WP-02, WP-14 |
| `tests/plan/*.test.mjs`, `tests/helpers/plan-gen.mjs`, `tests/golden/planner-*.json` | one test file per module; the shared generators; golden data | the module's owner; helpers WP-00 |
| `tests/review-*.test.mjs` | re-expressed as rule-id properties or retired | WP-21 |
| `design/bench/` | intakes, scorer, baseline | the benchmark phase of this workflow |

---

## 4. Data contracts

Typedefs live in `engine/plan/types.mjs`. Names of existing typedefs (`Derived`, `Shape`, `WeekLayout`, `SlotDef`,
`Selection`, `Targets`, `VolumePlan`, `WeekVolume`, `Why`, `Issue`) are those of `engine/CONTRACTS.md` 4.0. All planner
objects are plain JSON plus typed arrays; none holds a function, so an instance can be saved and replayed in a test.

### 4.1 Input of the planner: `PlanCtx`

```js
/** @typedef {Object} PlanCtx
 * @property {Derived} derived   @property {Shape} shape   @property {TrainingBlock} trainingBlock   @property {Model} model
 * @property {WeekLayout} layout         // the UNCUT layout of this block: every template station, nothing removed for time
 * @property {Selection[]} selections    // one per exercise block of this training block, picked on the uncut layout
 * @property {Targets} targets           // volume.computeTargets (kept)
 * @property {AthleticBudget[]} athletic // volume.athleticBudget: the profile's weekly targets (kept)
 * @property {(slot:SlotDef, exerciseBlock:number)=>SlotFill} fillSlot   // picks for candidates the layout does not hold
 * @property {PlanOverrides} [overrides] // offers, switches and user edits are re-solves with overrides (7.11, 7.14)
 */
/** @typedef {{minutes?:number, switches_off?:Array<{block:string, weekdays:string[]}>, removed_slots?:string[],
 *             added_slots?:SlotDef[], trained_factor?:number, pattern_factor?:number, laterality?:'plan'|'cheapest',
 *             tiers_until?:string}} PlanOverrides          // tiers_until: 'G3' = keep-level solve (offers) */
```

### 4.2 The instance (output of S0, input of everything else)

```js
/** @typedef {Object} PlannerInstance            // schema 'planner-instance/1'; one stairway block
 * @property {{family:string, template_id:string, variant:string|null, level:'L1'|'L2'|'L3', profile_class:string,
 *             N:number, exercise_blocks:Array<[number,number]>, G10k:number, time_quantum_s:number,
 *             branch:'chosen'|'full_plan', pattern_order:string[]}} meta
 * @property {PGroup[]} groups                   // in keep order (index = priority)
 * @property {PDay[]} days                       // in week order, main and optional
 * @property {PEpoch[]} epochs                   // epochs[0].week = 1, last .week = N
 * @property {PGroupDay[]} gds
 * @property {Array<{a:number, b:number, identical:boolean}>} twins   // group-day indices of the two exposures of one day type, earlier first
 * @property {PStation[]} stations
 * @property {PPair[]} pairs
 * @property {PPartnerRule[]} partner_rules
 * @property {PRoomItem[]} room                  // in keep priority: room[0] is kept longest
 * @property {PTest[]} tests
 * @property {Object<string,{tier:string, params:object}>} rules      // the catalogue entries that apply, parameters resolved
 */
/** @typedef {{id:string, S:number, C:number, F:number, mc:number, focus:boolean, pinned:boolean, calves:boolean, pain:boolean,
 *             fixed_state:null|'credit_only'|'no_station', session_soft_q:number, session_hard_q:number,
 *             cmin_q:number, cmax_q:number, key_num:number, key_den:number}} PGroup
 *   S, C, F, mc in whole sets (credited start, ceiling, floor, minimum climb); cmin_q / cmax_q = smallest / largest own credit of
 *   its candidates on main days (quarter sets); key_num / key_den = its average own credit per set as a fraction (ladder key, 7.6) */
/** @typedef {{id:string, day_type:string, main:boolean, full_body:boolean, minutes:number, limit_s:number, band_s:number,
 *             ex_budget:number|null, athlete_cap:number|null, protected_s:Int32Array, protected_counted:number,
 *             fixed_credit_q:Int16Array, lower_focus:'knee'|'hip'|null}} PDay
 *   limit_s = floor(60 x minutes x fit.trained_factor); band_s = seconds the day may run over in this branch (5.6);
 *   protected_s[w-1] = seconds of the blocks the planner never cuts, in week w, tests excluded */
/** @typedef {{week:number, covers:number[], fixed_s:Int32Array}} PEpoch     // fixed_s per day: protected seconds of the epoch (largest of the weeks it covers) */
/** @typedef {{id:string, g:number, d:number, home:boolean, Ks:number[], cands:PCandidate[]}} PGroupDay
 *   Ks = allowed exercise counts when on: [2,3,4]; calves [1]; beside a class lift [1,2,3] */
/** @typedef {{slot_id:string, origin:'template'|'gated'|'extension'|'focus'|'bonus', bucket:string, role:string, lo:number, hi:number,
 *             cred_q:Int8Array, cost:Array<{work_s:number, rest_s:number}>, pclass:string, axial:Array<'squat'|'hinge'|null>,
 *             rear:boolean, counted:boolean, laterality:string[]}} PCandidate
 *   cost[e], axial[e], laterality[e] per exercise block e; cred_q per group, 0 / 1 / 2 / 4, the same in every exercise block (H1) */
/** @typedef {{id:string, kind:'lead'|'partner'|'keep', g:number, d:number, sets:number, slot_id:string, lead_pair:boolean,
 *             cred_q:Int8Array, cost:Array<{work_s:number, rest_s:number}>, pclass:string, axial:Array<string|null>, counted:boolean,
 *             same_exercise_as:number|null}} PStation          // same_exercise_as: the partner form and the keep form of one exercise exclude each other */
/** @typedef {{d:number, tag:string, a:PSide, b:PSide}} PPair
 *  PSide = {t:'c', gd:number, ci:number} | {t:'s', si:number} | {t:'m', sets:number, cost:Array<{work_s, rest_s}>, room:number|null} */
/** @typedef {{id:string, d:number, pclass:'push'|'pull', lead_fixed:boolean, lead_gds:number[], lead_stations:number[],
 *             sat_gds:number[], sat_stations:number[]}} PPartnerRule */
/** @typedef {{id:string, block_id:string, label_key:string, tier:'before_patterns'|'after_patterns'|'after_peaks',
 *             seconds:Int32Array[], counted:Int8Array, athletic:{key:string, sets:number[], station:string}|null}} PRoomItem
 *   seconds[d][w-1]; counted[d] = exercises it adds to the field-athlete count */
/** @typedef {{d:number, week:number, kind:'timed'|'strength', seconds:number, group:number|null, replaces:string|null}} PTest */
```

### 4.3 Questions and verdicts

```js
/** @typedef {Object} Question
 * @property {number[]} [must]  @property {number[]} [not]                 // groups trained / not trained; the others are free
 * @property {number[]} [station_must]  @property {number[]} [station_not]
 * @property {number} [room_min]  @property {number} [room_max]            // bounds on the room prefix r
 * @property {number[]} [band_s]                                           // seconds over the chosen minutes allowed per day (default: days[d].band_s)
 * @property {boolean} [core_row]                                          // also ask R-TIME.CORE (tiers G1, G2)
 * @property {Object<number,number>} [peak_min] [peak_max] [w1_min] [w1_max]   // own sets of a group, all days / main days
 * @property {Object<number,number>} [session_q]                           // per-session limit of a group (quarter sets)
 * @property {Array<{gd:number, epoch:number, K?:number, n_min?:number, n_max?:number}>} [pins]   // structure pins
 * @property {boolean} [no_time]  @property {number} [extra_s]  @property {number[]} [extra_by_day_s]   // reasons (7.11)
 * @property {string[]} [rows_off]                                         // rule ids left out (conflict explanation only, 7.12)
 */
/** @typedef {{status:'fits'|'no'|'unknown', plan?:EndpointPlan, nodes:number, tied:boolean}} Verdict */
/** @typedef {{z:boolean[], y:boolean[], r:number, delta_s:number[], K:number[], n:number[][]}} EndpointPlan   // n[epoch][gd] */
```

### 4.4 Results

```js
/** @typedef {Object} Certificate
 * @property {EndpointPlan} plan
 * @property {number[]} kept                              // group indices trained directly
 * @property {Object<number,{code:'time'|'template'|'credit_only'|'no_station'|'not_proven', minutes_missing?:number, days?:string[]}>} reasons
 * @property {Object<number,'ceiling'|'growth'|'time'|'schedule'|'not_proven'>} stopped   // why each ladder ended
 * @property {boolean[]} session_soft                     // per group: the usual 11 sets a session holds
 * @property {Array<{tier:string, status:'proven'|'best_found'|'skipped', questions:number, nodes:number}>} tiers
 * @property {{questions:number, nodes:number, unknown:number, budget:number}} audit
 */
/** @typedef {{D:number[][], total:number[], rule:7|10, flats:number, min_flats:number, notes:string[]}} BlockTable   // D[k][w-1], k over kept */
/** @typedef {Object} PlacedBlock
 * @property {Array<{w:number, sets:number[][], seconds:number[], q_main:number[], q_all:number[], own:number[], total:number,
 *                   exercises:number[]}>} weeks        // sets[gd][exercise index]; seconds per day with the pairs that are on
 * @property {boolean[]} pairs_on  @property {boolean[]} pairs_needed
 * @property {number[][]} add_sequences                 // per kept group: the group-day that takes the 1st, 2nd, ... added set
 * @property {Array<Array<{g:number, dimension:'sets'|'reps'|'effort'|'load', gd?:number, ci?:number}>>} progression   // per week
 */
/** @typedef {{key:string, kind:'longer_sessions'|'more_days'|'switch'|'exact_minutes'|'laterality'|'keep_time',
 *             schedule:{days:number, minutes:number}|null, switch:{block:string, weekdays:string[]}|null,
 *             adds:string[], trades:string[], args:object, chosen?:boolean}} Offer */
/** @typedef {{outcome:'full'|'full_longer_day'|'keep_time'|'format_min', instance:PlannerInstance, certificate:Certificate|null,
 *             table:BlockTable|null, placed:PlacedBlock|null, athletic:object, offers:Offer[], violations:string[],
 *             format_min_minutes?:number}} PlannerResult        // violations must be empty; a non-empty list throws EngineError('planner.certificate_failed') */
```

### 4.5 The adapter: `VolumePlan` stays

`planWeeklySetsV2(ctx)` returns the `VolumePlan` of `CONTRACTS.md` 4.0 so that `generate.mjs` keeps its shape:
`weeks[].sets_by_slot` (0 for a candidate that is off, 2 for a station that is on), `added_slots` / `added_fills` (extension
candidates and stations that are on, each with the pick the planner priced), `supersets_on`, `est_minutes` (= `ceil(seconds / 60)`
of the planner's own seconds), `weekly_sets_by_muscle`, `direct_sets_by_muscle`, `total_resistance_sets`, `rise_vs_prev`,
`changes`, plus `athletic`, `warnings`, `time_check`, `offers` as today. `target_by_muscle` is printed only for the lines of
trained groups and equals what is placed (DR-21). New field: `volume.planner = PlannerResult` without the instance tables
(the certificate, the table, the audit), which `generate.mjs` copies into `meta.planner`.

### 4.6 What `plan/2` gains (no field is removed; key order as listed)

```jsonc
"time_check": {
  "training_block": 1,
  "outcome": "keep_time",                    // full | full_longer_day | keep_time | format_min
  "fits": false, "kept_time": true,          // kept for old readers: fits = (outcome == "full")
  "day_limit": {"trained_factor": 1, "pattern_factor": 1.1, "test_days": "inside"},
  "trained_groups": ["calves", "hips"],
  "not_trained_directly": [{"group": "quads", "reason": "time", "minutes_missing": 10, "days": ["Mon"], "credit": [2.5, 2.5]}],
  "pattern_stations": [{"group": "quads", "weekday": "Mon", "slot_id": "Mon.A.s08", "kind": "lead"}],
  "class_lifts": [],
  "lowered_peak": [{"group": "hips", "peak": 12.5, "ceiling": 13, "stopped_by": "time"}],
  "overrun": [{"weekday": "Thu", "minutes": 4, "cause": "kept_movements"}],        // every day that runs over, in its longest week
  "room": {"kept": ["blk.thu-b.athletic.1"], "cut": [{"block": "power", "weekdays": ["Mon"], "minutes": 7}]},
  "sessions_over_soft": [],                  // groups above 11 sets in one session
  "tests": {"inside": true, "dropped": []},
  "supersets_recommended": true, "supersets_needed": ["Mon", "Thu"],
  "trained_below_floor": [],                 // always empty; the key stays for old readers
  "by_block": ["..."]
},
"offers": [{"key": "offer.longer_sessions_adds", "kind": "longer_sessions", "schedule": {"days": 2, "minutes": 60},
            "adds": ["quads"], "trades": [], "args": {"days": 2, "min": 60, "adds": ["quads"]}}],
"weeks[].progression": [{"group": "hips", "dimension": "sets", "slot_id": "Mon.A.s14"}, {"group": "calves", "dimension": "reps"}],
"weeks[].days[].over_minutes": 3,            // 0 on a day inside the chosen minutes
"meta.planner": {"engine": "two_stage", "version": "planner/1", "questions": 61, "nodes": 125, "budget": 25000, "unknown": 0,
                 "tiers": [{"tier": "G1", "status": "proven"}], "epochs": [1, 12], "defaults_used": ["D1", "D4"],
                 "laterality": {"lower": [{"exercise_block": 1, "target": 0.5, "reached": 0.5}]},
                 "athletic": {"scale": {"throws": 0.58}, "room_prefix": 0}}
```

### 4.7 Model data: `rules.planner` (written by `tools/fixture/planner-rules.mjs`; every value PROPOSED unless marked)

```jsonc
"planner": {
  "engine": "v04",                                       // v04 | shadow | two_stage                         (11.2)
  "version": "planner/1",
  "formats_enabled": ["stairway"],                       // + class | circuit | strength_roles | flat as 7.13 lands
  "fit": {
    "trained_factor":   {"full_body": 1.0, "split": 1.0},   // who is trained and how high: inside the chosen minutes
    "full_plan_factor": {"full_body": 1.1, "split": 1.0},   // branch full_longer_day (R2-SES-05)
    "pattern_factor":   {"full_body": 1.1, "split": 1.0},   // kept movements only (5.6)
    "test_days": "inside",                               // inside | outside_warn
    "exercise_margin": 1                                 // R-EXBUDGET: session.exercise_cap_by_minutes + margin on full-body days
  },
  "patterns": {"lead": true, "keep": true, "lone_partner_for_trained": false, "before_peaks": true},
  "calves": {"floor": "per_leg_day"},                    // per_leg_day (3 x leg days) | model_formula (DER-04) | ten_with_optional_slot
  "group_targets": {"two_line_groups": "carrier_max"},   // one start and one ceiling per FOCUS group
  "work_lift_three_sets": "prefer",                      // T6-CNT-06 as a preference, never a lower bound (7.6, G7)
  "session": {"hard_for_every_group": true},             // the hard limit of volume.per_session.priority (14) holds for every group
  "extension": {"max_per_group_day": 4,
                "buckets": {"quads": ["RP_UKD", "ISO_QUAD", "RP_BKD"], "hips": ["RP_UHD", "ISO_LEG_FLEXION", "RP_BHD"],
                            "back": ["RP_VPULL", "RP_HPULL"], "chest": ["ISO_CHEST", "RP_HPUSH"],
                            "shoulders": ["ISO_SIDE_REAR_DELT:side", "ISO_SIDE_REAR_DELT:rear", "RP_VPUSH"],
                            "biceps": ["ISO_BICEP"], "triceps": ["ISO_TRICEP"], "calves": []}},
  "room": {                                              // per profile class: what is never cut, and the ladder in keep priority
    "competitive": {"protected": ["warmup", "core", "sport_care", "athletic:first_station_per_day", "olympic:min_sets"],
                    "items": [{"match": "olympic:budget_sets", "tier": "after_patterns"}, {"match": "athletic:third_set", "tier": "after_patterns"},
                              {"match": "athletic:second_station", "tier": "after_patterns"}, {"match": "conditioning:buyout", "tier": "after_peaks"}]},
    "stay_active": {"protected": ["warmup", "core", "athletic:one_piece_per_day", "joint_care:first_item"],
                    "items": [{"match": "joint_care:second_item", "tier": "before_patterns"}, {"match": "athletic:ankle_block", "tier": "after_peaks"},
                              {"match": "athletic:second_station", "tier": "after_peaks"}, {"match": "power:olympic", "tier": "after_peaks"}]},
    "class": {"protected": ["warmup", "core", "skill", "class_lift", "olympic", "wod:short"], "items": [{"match": "wod:growth", "tier": "after_peaks"}]},
    "default": {"protected": ["warmup", "core"], "items": []}
  },
  "epochs": {"mode": "dominance", "max_middle": 2},      // dominance | reserved
  "stairway": {"tiers": ["last", "flat", "hold", "late", "shape", "land"], "final_set_late": true,
               "total_rule_pct": 7, "fallback_pct": 10}, // HISTORICAL rate-limited path; CX-01 acceleration contract pending
  "laterality": {"mode": "prepass"},
  "oracle": {"implied": {"peak_floor": true, "optimistic_time": true, "day_subset": true, "twin_lex": true}, "tied_first": true},
  "budget": {"plan_nodes": 25000, "question_first": 500, "question_growth": 8, "keep_share": 0.6,
             "offers_nodes": 15000, "conflict_nodes": 20000, "certify_nodes": 5000000},
  "offers": {"more_days": true, "switches": ["core", "athletic", "power", "skill", "prehab"], "detail": "keep_vector"},
  "catalogue": ["... 4.8 ..."], "edit_rules": ["... 4.9 ..."]
}
```

Every other number is read from the keys that exist today: `session.time_fit.keep_order`, `keep_first`, `keep_order_r2`,
`volume.pattern_keep`, `volume.per_session`, `volume.floor`, `volume.calves`, `stairway.*`, `placement.*`, `time_model.*`,
`session.exercise_cap_by_minutes`, `session.athlete_cap`, `athletic.reconcile.*`, `olympic.sets`, `tests.*`,
`session.minutes_allowed`. `session.time_fit.fit_factor`, `session.long_day.warn_above_factor`,
`placement.work_min_sets_from_minutes` and the fix-round flags of `volume` are no longer read by the planner (11.4).

### 4.8 A catalogue entry (the single source of rows; judge 3, graft 8)

```jsonc
{"id": "R-FLOOR", "inventory": ["T2-FLR-01", "T2-FLR-04", "T1-POL-01"], "refs": ["R2-VOL-06", "R3-SES-01"],
 "tier": "T0", "kind": "hard_conditional", "shape": "lower_week1",        // shape: 7.14
 "scope": "group", "params": {"F": "volume.floor.value", "counted_on": "volume.floor.counted_on"},
 "why": "reason.R-FLOOR", "status": "approved"}
```

`plan/catalogue.mjs` holds one code entry per id: `rows(instance, entry)` (what the oracle adds) and
`evaluate(instance, week, entry)` (what the certifier checks). A model entry without a code entry, or the reverse, fails
`tests/plan/catalogue.test.mjs`. An exemption exists only as a parameter of an entry. `validate.mjs` and the scorer read
the same ids and parameters and bring their own evaluation code.

### 4.9 The edit-rule catalogue: the only ways an exercise or a block enters or leaves (judge 1 graft 4, judge 3 graft 2)

Data in `rules.planner.edit_rules`: id, precondition, effect, tier, source. S0 applies the A-rules when it builds the
candidates; the planner applies the R-rules only through the tiers named.

| Id | Rule | Precondition | Effect | Decided at | Sources |
|---|---|---|---|---|---|
| R-GROUP | a group is not trained directly | no legal plan trains it with every higher-priority group | all its group-days off; listed with its reason and its credit | G1 | R3-SES-02 step 2; T1-POL-05, -09, -10 |
| R-DAY | a trained group leaves one of its days | never its home day; never down to 1 exercise | that group-day off | G7 (most exposure days first) | R3-SES-02 "never squeeze"; T1-POL-09; SF-9 |
| R-LEAD | a trained group trains on its home day; its work lift is exercise 1 | group trained | home group-day on | hard row | T0-SES-06; T0-EFF-06 |
| R-PARTNER | an active lower work lift keeps a push (hip day) or a pull (knee day) beside it | the work lift is on (trained group, lead station or class lift) | the partner group trains that day, or the partner station is on at 2 sets | hard row | T0-SES-08; UNI-11; ORD-06 |
| A-PATTERN.lead | the day keeps its own work lift | big mover not trained directly; the day's work lift is its lift | lead station, 2 sets, constant; brings its partner | G3, days in week order | T1-POL-07; BRAIN 10.7; review R08-patterns |
| A-PATTERN.keep | a big mover with no station keeps one movement | big mover not trained, no lead or partner station on | its `pattern_keep` exercise: the partner form on its lead-pair day first, else the first day whose template lists the bucket | G3, `pattern_keep.order` | T1-POL-07 |
| R-ROOM | a room item is left out | a kept group needs its minutes (tier `before_patterns`), or a kept movement does (`after_patterns`), or a peak set does (`after_peaks`) | the items after it in keep priority are off too; offered back with their minutes | G2, G4a, G4b | T1-POL-06, -13; R3-SES-02 |
| R-TEST | test week swap | test day in week 1 or the last week | a timed test takes the place of the station of its quality; the day's room items are skipped that week; a strength test adds its work-up only on a lift the plan trains | hard row | T0-TST-01; E-165 |
| A-DEPTH | third and fourth exercise of a group on a day | - | candidates 3 and 4 = minute-gated template stations of the group first, then `extension.buckets[group]` in order | S0 (candidates); the count K is decided by the oracle and G7 | VOL-07; R2-SES-05; T6-CNT-03 |
| A-CLASS | the class lift stays | class model | fixed item, class dose, counts as exercise 1 of its group that day | S0 | T4-TIME-03; OT18 |
| A-ATH-SET | one more set on an athletic station | its key is under target with the per-set dose at its maximum | a room item of the day | room tiers | T5-ATH-02; D-73 |
| A-FOCUS | Focus slots on the optional day | group is a Focus group | up to 2 candidates x 2-3 sets on the optional day; count for the peak, never for the floor or the minimum climb | G5 | T6-CNT-05; ORD-11 |
| A-BONUS | bonus exercise of a small group | small group trained on a main day | one candidate x 2 sets on the optional day, else an extension candidate on a day that already trains it | G5 | R3-VOL-03; T7-PLC-03 |
| A-CALF-OPT | optional-day calf slot | off unless calves are a Focus group or `calves.floor = ten_with_optional_slot` | one calf candidate on the optional day | G5 | E-139; C-04 |
| A-EDIT | the person removes or adds an exercise or switches a block off | a rebuild with pins | candidate deleted or appended; block seconds removed | S0 | T1-POL-14; R3-SES-02 |
| A-GUEST | a group gets candidates on a day whose template has none | coach rule pack only (off) | new group-day from the group's pattern bucket | - | diagnosis 3.4 (open) |

---

## 5. The formal model

### 5.1 Units and notation

Time is in whole seconds; every value of `rules.time_model` times 60 must be a whole number (asserted by S0). The time
quantum `q_t` of an instance is the greatest common divisor of its per-set seconds, changeovers, fixed seconds and limits
(3 s with today's model). Credit is in quarter sets (1 set = 4 q); a set credits a group with 0, 1, 2 or 4 q (DEF-02 ... 05).
Sets are whole. No comparison uses a tolerance; ratios are compared by cross-multiplication. `G10k(N)` is the planned growth
of an N-week stairway times 10,000, read from `rules.stairway.by_N[N].growth` (15,535 for 12 weeks, 13,282 for 8).

| Symbol | Meaning |
|---|---|
| g in G, in keep order pi | the FOCUS groups. pi = Focus groups, then groups the profile pins (racket 50+: calves), then the profile's big priorities, then `session.time_fit.keep_order` (athletic families: `keep_order_r2.athletic`) (T1-POL-05) |
| d in D, D^main | days of the week in week order; the main days. Optional days carry candidates too; they never count for a floor or a minimum climb |
| w = 1..N, e(w) | weeks of the stairway block; the exercise block of week w |
| j = 0..m, w_j | the proved weeks (5.3): w_0 = 1, w_m = N |
| gamma = (g, d) | a group-day; its candidates c_1 ... c_M in session order |
| c | a candidate: bounds lo(c) <= hi(c) (T0-SES-15), credit a_h(c) q to every group h, work_e(c) and rest_e(c) seconds per set in exercise block e |
| s | a pattern station: 2 sets, constant, with its own credit and seconds |
| r in 0..R | the room prefix: room items 1..r are on, r+1..R are off |
| Fix_d(w; r, z) | fixed seconds of day d in week w: protected blocks + room items 1..r + test seconds (a strength test only when its group is trained, 5.5 R-TEST) |
| L_d, Delta_d, delta_d | day limit in seconds (60 x chosen minutes x `fit.trained_factor`); the band of the day in this branch; the overrun allowed, 0 <= delta_d <= Delta_d |
| S_g, C_g, F_g, mc_g | level start, ceiling, floor and minimum climb of a group in credited sets (DER-01 ... 09; T2-FLR-01/02; T3-STW-02): F = 10; calves F = 3 x leg days; a pain-reduced group F = its reduced start; mc = 2, calves and pain groups 1, every group 1 when N <= 7 |

Derived tallies, all linear in the sets (the one unit of account, DR-7):

- `Q_g(w)` = credited quarter sets of g on the main days: every active exercise, pattern station and class lift with its
  credit. `Qall_g(w)` = the same with the optional days.
- `Own_g(w)` = sets of g's own exercises on the main days; `OwnAll_g(w)` with the optional days.
- `Tot(w)` = every resistance set of the week (stations, class lifts and optional days included).
- `Sec_d(w)` = seconds of day d (5.2 b).

### 5.2 Three functions shared by every stage

**(a) The staircase `St(gamma, K, n)`** (VOL-07, T7-PLC-01, SF-3). The first K candidates of the group-day are used. Each
starts at its minimum; every further set goes to *the earliest exercise among those with the fewest sets that still has
room*. This yields 2/2/2 -> 3/2/2 -> 3/3/2 -> 3/3/3 -> 4/3/3 and is defined for every n from the sum of the minimums to the
sum of the maximums. It is the definition of how n sets sit on a group-day, in every stage. A class lift keeps its class dose
and is exercise 1 of its group-day without taking part in the staircase.

**(b) The time function** (DEF-09). `CH` = 60 s is the changeover of an exercise, `CHP` = 30 s inside a pair.

```
straight exercise, x sets      x * (work + rest) + CH
pair (a, b) that is on         straight(a) + straight(b) - [ min(xa, xb) * min(rest_a, rest_b) + 2 * (CH - CHP) ]
day                            Sec_d = Fix_d + sum of its active exercises and stations - sum of the savings of its pairs that are on
```

For two members this equals `timefit.supersetMinutes` (round k holds the partners that still have a k-th set: their work,
then the longer rest); `tests/plan/timecost.test.mjs` asserts the equality on every pair of time classes. `work` and `rest`
come from `dose.doseParams(slot, pick, weekShape)`: the rep bracket, per-side work, holds and the rest class the dose will
print. It is a pure function that never reads the sets, and `doseItem` must print exactly these values (DR-11). A side of a
pair is a candidate, a station or a fixed mate (a class lift, a joint-care item); an exercise is a side of at most one pair
that can be active (H3).

**(c) The add sequence of a group.** Between two consecutive proved weeks with vectors n^{j-1} <= n^j, sets are added one
at a time: the next set goes to the group-day that is behind (fewest sets added in this segment among those still under
n^j; main days before optional days; ties: the day after the one used last, so Monday this time and Thursday the next,
R3-VOL-03). The add sequence of the block is the concatenation of its segments. Week w holds the prefix of length
`OwnAll_g(w) - OwnAll_g(1)`.

### 5.3 The proved weeks (epochs)

Per-set seconds change only when the exercises change (exercise-block starts). Fixed seconds change by week (Olympic sets by
exercise block, a WOD, the tests of week 1 and week N). Write `cost(w)` for the vector of every `Fix_d(w)` at r = R and every
`work_{e(w)}(c)`, `rest_{e(w)}(c)`. Week v **dominates** week w when v >= w and cost(w) <= cost(v) in every component.

```
epochs(instance):                                     # rules.planner.epochs.mode = 'dominance'
  E <- {N}
  for w = N-1 down to 2:   if some v in E, v > w, dominates w:  cover(w) <- the smallest such v     else: E <- E + {w}; cover(w) <- w
  week 1 is always its own epoch (it carries the floors)
  if E holds more than max_middle weeks between 1 and N: keep the latest max_middle; every dropped week x is covered by the
     next kept epoch v, whose costs become the component-wise maximum of cost(v) and cost(x)          # sound, conservative
mode 'reserved' (the winning design's two vectors): E = {1, N}; cost(N) <- component-wise maximum over weeks 2..N
```

Examples. Athletes (strength rests and more Olympic sets late): E = {1, N}. A physique plan whose first exercise block is the
costliest (50 % single-leg work in block 1, 90 % two-leg in block 3): E = {1, 4, N}. Tests inside the limit with a room
item larger than the test: E = {1, N-1, N}.

Each proved week has its own set vector n^j. Vectors are nested, n^0 <= n^1 <= ... <= n^m, and a group adds at most
`w_j - w_{j-1}` sets between two of them (one set a week).

### 5.4 Decision variables

| Variable | Decided in | Meaning |
|---|---|---|
| z_g in {0, 1} | G1 | group g is trained directly |
| r in 0..R | G2, G4a, G4b | room prefix |
| y_s in {0, 1} | G3 (lead, keep); rows (partner) | pattern station s is in the week |
| delta_d in {0, q_t, 2 q_t, ..., Delta_d} | G3b (or after G5 in the full-plan branch) | seconds day d may run over the chosen minutes |
| K_gamma in {0} or its allowed counts | G7 | exercises of g on d; constant over the block |
| n^j_gamma, j = 0..m | G5 (peak), G6 (week 1), G7 (split), G7b (middle) | sets of g on d in proved week j |
| t_g in {0, 1} | oracle | which branch of R-LAMBDA holds (short blocks only) |
| OwnAll_g(w) | scheduler | own sets of g in week w, equal to the certificate in every proved week |
| n_gamma(w), x_{gamma,i}(w) | S2 | sets of the group-day and of its i-th exercise in week w |
| p_P in {0, 1} | S2 | pair P runs as a superset |

### 5.5 The hard rows (what a legal plan is)

Every row is a catalogue entry (4.8). "Made true by" names the stage that holds it by construction; the certifier, the
validator and the scorer re-check it on every week whatever that column says.

| Row | Inventory ids | Statement | Made true by |
|---|---|---|---|
| R-BOUNDS | T0-SES-15, T6-CNT-06 | every active exercise holds lo..hi sets: 2 to 4 (L1) or 5 (L2-L3), isolation 4, calf 3-4; a class lift its class dose. lo does not depend on the minutes | staircase tables |
| R-COUNT | T0-SES-10, T1-POL-09, T6-CNT-02 | K is 0 or 2..4 for a trained group on a day; calves exactly 1; beside a class lift 1..3 more. Never 1. (Four-role strength days: 7.13) | variable domain |
| R-CALF | T0-SES-11, T2-FLR-02 | calves trained: exactly one calf exercise with 3+ sets on every leg day, never a second | oracle row |
| R-LEAD | T0-EFF-06, T0-SES-06 | a trained group trains on its home days; the work lift is exercise 1 | oracle row |
| R-PARTNER | T0-SES-08 | on every day whose lower work lift is active (its group-day is on, or its lead station is on, or it is a class lift): at least one exercise of the partner class is active (hip: push; knee: pull): a group-day whose first exercise is of that class, or the partner station. A partner station is on only beside an active work lift, and never for a group that is trained (`patterns.lone_partner_for_trained = false`) | oracle rows |
| R-AXIAL | T0-SES-09 | in every exercise block: at most one counted squat and one counted hinge among the active exercises and stations of the week, never both on one day | oracle rows; S0 gives extension candidates and keep stations non-axial picks |
| R-REAR | T0-SES-12 | shoulders trained: at least one active rear-delt exercise in the week | oracle row |
| R-STAIRCASE | T7-PLC-01 | sets of a group-day are St(gamma, K, n) in every week | definition |
| R-MONO | T3-STW-01, T0-SES-14, T3-STW-08 | no exercise ever loses a set inside the block; the active exercises are constant; the climb does not restart at an exercise block | S2 prefixes |
| R-FLOOR | T2-FLR-01, -04, T1-POL-01 | trained g: Q_g(w) >= 4 F_g in every week | oracle on week 1; L3 |
| R-CLIMB | T3-STW-02, T1-POL-01, T1-POL-12, CX-02/03 | nonsaturated accumulation: the proposed minimum climb applies only where compatible with the endpoint; saturated S=C: mc=0 and load/rep progression; occasional same-set weeks allowed | amended row requires verification |
| R-REACH | T0-STW-02, CX-01 | HISTORICAL restricted-path bound: OwnAll_g(w_j) - OwnAll_g(w_{j-1}) <= w_j - w_{j-1}. It must not reject an endpoint requiring acceleration; generalized reachability is pending | restricted path only |
| R-TIME | T1-POL-02, T4-TIME-01, DEF-09 | Sec_d(w) <= L_d + delta_d in every week, with the pairs that are on (5.6) | oracle on every proved week; L3 |
| R-TIME.CORE | T1-POL-02, T1-POL-05 | asked in G1 and G2 only: the day without its pattern stations fits L_d in every proved week (5.6) | oracle |
| R-TEST | T0-TST-01 | test seconds are part of Fix_d(1) and Fix_d(N): a timed test takes the place of the station of its quality, the day's room items are skipped that week, a strength test adds its work-up only when its group is trained on that lift (`fit.test_days = inside`) | Fix tables; a column on z_g |
| R-CEIL | T5-CAP-01, -02, -06 | OwnAll_g <= C_g; Qall_g <= 4 C_g + 4 (helper spill of at most one set) | oracle on week N |
| R-ABS30 | T5-CAP-03 | Qall_g <= 120 q | oracle on week N |
| R-LAMBDA | T3-STW-05, -06, DEF-10, CX-01 | continuous endpoint P>=S: solve S*product(1+lambda*s_w)=P with lambda>=0, including lambda>1 when needed; P=S uses lambda=0. This is an endpoint-shape calculation, not proof of discrete/time feasibility. No former growth-factor bound may alone lower P | replacement procedure PROPOSED; verification pending |
| R-TOP | T3-STW-06, T2-FLR-06, DER-01, CX-01/03 | applicable policy ceiling still holds; the former S*G10k rate-based peak truncation is superseded when acceleration is needed. Define a jointly feasible endpoint without relabeling proposed targets as approved | replacement allocation contract pending |
| R-SESSION | T5-CAP-05 | credited sets of g on one day <= 14 (hard, every group). The usual 11 is tier G5s | oracle on week N |
| R-STEP.G | T0-STW-02, CX-01/02 | 0-or-1 own-set additions describe the old restricted path, not an absolute bound after CX-01. Same-set weeks are allowed; more than one addition may be needed for the endpoint. Revised integer bounds must be verified | accelerated scheduler pending |
| R-STEP.T | T0-STW-03, LK08, CX-01 | historical 7% / below-10% rules cannot force a lower endpoint when acceleration is needed. Report the planned rates and the exception; no replacement numerical maximum was approved | revised scheduling contract pending |
| R-LAST | T3-STW-04 | the last week is the largest; with 12 weeks the last four are the four largest | R-MONO |
| R-ATHLETE12 | T0-SES-13, T6-CNT-07 | field athletes: counted exercises of a day <= 12, athletic stations of the room prefix included (core and warm-up outside) | oracle row |
| R-EXBUDGET | T6-CNT-01 (PROPOSED as hard) | counted resistance exercises of a full-body day <= `exercise_cap_by_minutes` + `fit.exercise_margin` (split days: soft metric) | oracle row |
| R-PATTERN | T1-POL-07 | a station belongs to a big mover that is not trained; lead and keep stations: at most one per group and `pattern_keep.max_per_week` a week; the partner form and the keep form of one exercise exclude each other | oracle rows |
| R-ROOM | T1-POL-06, -13 | room items are on as a prefix of the profile's list; the protected blocks are always on | variable r |
| R-OPT | T6-CNT-05, T7-PLC-03, -04 | optional-day candidates exist only for Focus groups (up to 2 x 2-3 sets), for the bonus exercise of a small group (1 x 2 sets) and for A-CALF-OPT; their sets count in Qall and OwnAll, never in Q or Own | S0 domains |
| R-PAIR | T0-SES-16 | a superset is a template pair whose two sides are active | S0 |
| R-GRAMMAR | T0-SES-01 ... 07, -17, T0-SAFE-*, T0-EFF-* | block order, core first, power before strength, horizontal before vertical, day spacing, every safety and dose rule | template, selection, ordering pass, dose (kept code); the planner only switches candidates |
| R-ATH.* | T0-ATH-01 ... 05, T3-ATH-01, T5-ATH-01 | 7.3 | SA |
| R-OUT.* | T0-SYS-01, -03, T1-POL-04, -10, -11, -14 | determinism; a reason on every decision; offers before the plan; honest lists; superset recommendations; edits as constraints | S3, offers |

Two-sided ratio rules (the bilateral share T8-BAL-01/02, push : pull) are not rows on sets: a ratio is not preserved between
two nested vectors. The share is set before S1 (7.2) and measured after.

### 5.6 The two day rows, the band and the overrun

Three wishes pull on the day limit: who is trained must not depend on a tolerance; the day should keep its pattern (a knee
day has a knee lift and a pull); and the person asked for a session length. They are met by two rows and one tier.

```
Sec_d      = Fix_d + active exercises + stations that are on - savings of every pair that is on           (everything)
SecCore_d  = Fix_d + active exercises                         - savings of pairs with no station side     (the day without its kept movements)

R-TIME        Sec_d(w_j)     <= L_d + delta_d      every tier, every proved week;  0 <= delta_d <= Delta_d
R-TIME.CORE   SecCore_d(w_j) <= L_d                tiers G1 and G2 only
```

- `Delta_d = floor(60 x minutes x fit.pattern_factor) - L_d` on a full-body main day, 0 on a split day (default 10 %).
- **G1 and G2 ask both rows.** So a group is trained directly only if the trained work alone fits the chosen minutes, and a
  partner station that a kept work lift needs can ride in the band instead of costing that group its place.
- **From G3 on only R-TIME is asked.** A lead station may then push trained sets of the same week onto another day, into
  that day's band. Without this the pickleball player's Monday cannot keep its step-up (*measured*: with R-TIME.CORE in
  every tier Monday keeps a row and still has no knee lift: run D1-x of `spec_checks/graft/run.out.txt`).
- **G3b minimizes the overrun exactly** (bisection on the oracle, 7.6) and freezes delta before any peak is raised. No set
  above the minimums can lengthen a day (C-16).
- With `fit.pattern_factor = 1.0` both rows are the same row and every day is inside the chosen minutes.

In the full-plan branch (7.10) the band is `floor(60 x minutes x fit.full_plan_factor) - L_d` on full-body days,
R-TIME.CORE is not asked (the trained work itself may use the band), and the overrun is minimized after the peaks instead
of before them. That branch is accepted only when it gives the full plan.

### 5.7 The objective: lexicographic tiers, as data

A lower tier never changes a higher tier's result. Each tier is frozen as a pin before the next is asked.

| Tier | Inventory | Goal | How |
|---|---|---|---|
| G0 | T0 | every hard row | the rows are in every question |
| G1 keep | T1-POL-03, -05 | the keep vector, lexicographically largest in keep order | one exact question per group; every later group, every station, the room prefix and the overrun are free |
| G2 room A | T1-POL-06 | the largest prefix of the `before_patterns` room items | exact questions (feasibility is monotone in r) |
| G3 kept movements | T1-POL-07 | lead stations in week order, then partner stations pinned off wherever the plan fits without, then keep stations in the coach's pattern order | exact questions with pins |
| G3b overrun | T4-TIME-01 | the smallest largest overrun, then each day's overrun in week order | bisection on exact questions |
| G4a room B | T1-POL-13, T5-ATH-02 | the largest prefix of the `after_patterns` items (competitive athletes: athletic work before the peaks) | exact questions |
| G5s sessions | T5-CAP-05 | the usual 11 sets a session, group by group in keep order | exact questions |
| G5 peaks | T5-CAP-04, T8-BAL-04 | lexicographic max-min of relative progress (peak - start) / (ceiling - start); ties in keep order; every raise must leave a stairway | exact water-filling |
| G6 week 1 | T3-STW-08, T2-FLR-06 | week 1 = peak - (C - S), never under the floor, never above the level start; nearest legal value, lower first | pinned questions |
| G7 structure | T7-WEEK-01, T6-CNT-03, T7-PLC-02, -04 | most exposure days; fewest exercises; fewest optional-day sets; the most even split, the earlier day taking the odd set, twins tied, the home day first | pinned questions |
| G7b middle epochs | T3-STW-05 | the totals of every middle proved week nearest the planned curve | evaluation, no search |
| G4b room C | T5-ATH-02 | the largest prefix of the `after_peaks` items that changes no set | evaluation, no search |
| G8 stairway | T3-STW-03 ... 07 | last, flat, hold, late, shape, land (7.7) | dynamic program + flow |
| G9 supersets | T7-PAIR-03, T1-POL-11 | fewest pairs switched on while every week holds | exact, per day |
| G10 | T8-* | variety, balance, preference | selection, inside fixed time and credit classes |

Three places where this order differs from the inventory's filing, each on purpose:

1. **Kept movements rank below the trained groups and below the room cuts they could force** (the inventory writes one
   state vector FULL > PATTERN > NONE per group). A 2-set quad station never outranks training back at its floor, and never
   forces joint care off the day. The one kept movement that is not optional is the partner of an active work lift.
2. **Exposure days rank above the exercise count inside G7** (the inventory files frequency in T7 and exercise economy in
   T6). The template's frequency is the day's identity; the count is already bounded by R-EXBUDGET. G6 pins week 1 before
   G7, so more exposure days can never push week 1 up.
3. **Time fit has no soft term above the peaks.** The only time objective is the overrun of G3b, which is frozen before G5;
   "fewest supersets" is last (inventory reading 6).

### 5.8 Where each of the 127 inventory rules lives

| Inventory | Lives in |
|---|---|
| T0-SYS-01 ... 04 | section 9; intake (kept); the why records of section 8 |
| T0-SAFE-01 ... 13 | intake screen, catalogue, selection filters (kept). They decide which exercise fills a candidate, never the dose |
| T0-SES-01 ... 05, -07, -17 | fixed blocks and the ordering pass of `week.mjs` (kept): R-GRAMMAR |
| T0-SES-06, -08, -09, -10, -11, -12, -13, -14, -15, -16 | R-LEAD, R-PARTNER, R-AXIAL, R-COUNT, R-CALF, R-REAR, R-ATHLETE12, R-MONO, R-BOUNDS, R-PAIR |
| T0-EFF-01 ... 07 | `dose.mjs` (kept). EFF-03 and EFF-07 set the rest class, which `doseParams` hands to the time function |
| T0-STW-01 ... 05 | R-MONO; R-STEP.G, R-LAMBDA; R-STEP.T; flat blocks (7.13); `shape.mjs` (kept) |
| T0-TST-01 | R-TEST |
| T0-ATH-01 ... 05, T3-ATH-01, -02, T5-ATH-01 ... 03 | SA (7.3): R-ATH.*, the room tiers, the printed scale |
| T1-POL-01, -02, -03 | R-FLOOR + R-COUNT + R-CLIMB; R-TIME and 5.6; outcome `full` |
| T1-POL-04, -10, -11, -14 | offers (7.11); the lists of section 8; G9; edits (7.14) |
| T1-POL-05, -06, -07, -09, -12, -13 | G1; G2 / G4; G3 and R-PATTERN; R-COUNT; R-CLIMB; the room tags per profile class |
| T1-POL-08, T2-FLR-05 | **not used.** There is no below-floor state. The class lift is A-CLASS, a fixed item |
| T2-FLR-01, -02, -04, -06 | R-FLOOR; R-CALF; credit-only groups in the targets; G6 and G7 |
| T2-FLR-03 | group credit in the tallies of 5.1 |
| T3-STW-01, -02, -04, -08 | R-MONO; R-CLIMB; R-LAST; G6 |
| T3-STW-03, -05, -06, -07 | G8; R-LAMBDA and R-TOP; the planned curve of the scheduler |
| T3-STW-09 | the progression card (7.8) and the display level |
| T3-STW-10, T4-TIME-03 | the circuit and class format handlers (7.13) |
| T4-TIME-01, -02 | G3b; offers at the legal lengths only |
| T5-CAP-01 ... 03, -05, -06 | R-CEIL, R-ABS30, R-SESSION and G5s; Focus in the targets |
| T5-CAP-04 | G5 |
| T6-CNT-01 ... 08 | R-EXBUDGET; the K domains; G7; structure constant over the block (15.3); R-OPT; R-BOUNDS; R-ATHLETE12; joint care as fixed blocks outside the count |
| T7-PLC-01 ... 05 | R-STAIRCASE; the add sequence and G7; A-BONUS; R-OPT; the laterality pre-pass |
| T7-ORD-*, T7-PAIR-01, -02 | ordering pass and template pairs (kept) |
| T7-PAIR-03, T7-WEEK-01, -02 | G9; G7 |
| T8-BAL-01, -02 | laterality pre-pass, share reported |
| T8-BAL-03 ... 05, T8-VAR-* | selection (kept); reported metrics |

---

## 6. Guarantees: what is proved, and under which hypotheses

**Historical proof scope after CX-01..03:** the arguments below describe the original fixed, one-set-per-group-per-week, rate-limited design. They remain useful reference lemmas under those hypotheses, but are not proof of the amended policy. In particular, L5/L6 and T1/T3 need review for accelerated schedules and zero-headroom groups. This section does not waive the implementation gate above.

The hypotheses are written out because every false guarantee found so far in this project came from one nobody wrote down.
S0 asserts H1, H2, H3 and H5 on every instance; the scheduler's certificate asserts H4.

- **H1 (fixed structure).** z, y, r and K do not change inside the stairway block. Exercises may change at exercise-block
  starts, but the i-th exercise of a group-day keeps its credit vector.
- **H2 (covering epochs).** Every week w >= 2 has a proved week cover(w) >= w whose fixed seconds and per-set seconds are at
  least those of w, component by component (5.3).
- **H3 (pairs).** An exercise is a side of at most one pair that can be active.
- **H4 (table).** In every proved week the table equals the certificate, OwnAll_g(w_j) = sum over d of n^j_gamma; between
  two weeks it never drops and rises by at most one set.
- **H5 (monotone room).** Switching a room item on never lowers the fixed seconds or the counted exercises of any day in
  any week, and a fixed mate's own seconds are at least the largest saving it can give.

**L1 (the staircase is monotone).** St(n + 1) equals St(n) plus one set on exactly one exercise. *Proof.* St is built by
adding one set at a time. QED. So "one more set" is always legal inside a group-day below its top, and no exercise loses a
set when n grows.

**L2 (the time function is monotone).** Sec_d and SecCore_d never decrease when a set count, a work or rest time, a station
or a fixed second is added. *Proof.* One more set of a straight exercise adds work + rest > 0. In a pair, one more set of a
adds work_a + rest_a and raises the saving by at most min(rest_a, rest_b) <= rest_a. Raising rest_a by one second adds xa and
takes back at most min(xa, xb) <= xa. A station that comes on adds its straight cost and saves at most its own rest per
shared round and one changeover. H3 makes the pairs independent. QED.

**L3 (sandwich).** Under H1-H3, let week w lie between proved weeks w_{j-1} < w <= w_j with n^{j-1} <= n(w) <= n^j group-day
by group-day. Then week w satisfies R-TIME, R-CEIL, R-ABS30, R-TOP, R-SESSION, R-ATHLETE12, R-EXBUDGET and R-FLOOR.
*Proof.* R-TIME: by L1 and L2, Sec_d of week w with its own costs is at most Sec_d of n^j with the costs of w, which by H2
is at most Sec_d of n^{cover(w)} with the costs of cover(w) (vectors are nested and cover(w) >= w_j), which is at most
L_d + delta_d. The other upper rows have non-negative coefficients and hold at n^m >= n(w). R-FLOOR has non-negative
coefficients and holds at n^0 <= n(w); credits do not change (H1). Counts depend only on K, y and r. QED.

**L4 (the add sequence never gets stuck).** In every segment the add sequence has exactly sum over d of (n^j - n^{j-1})
steps, and after any number of them every group-day holds between n^{j-1} and n^j sets. *Proof.* A step goes to a group-day
with room; the room adds up to the number of steps. By L1 the staircase is defined in between. QED.

**L5 (Gale 1957, Ryser 1957).** Inside a segment, groups add u_g sets, at most one a week. A sequence of weekly rises can be
shared out among the groups if and only if taking each week's sets from the groups with the most sets left never fails. So a
dynamic program over (week, sorted vector of sets left) visits exactly the realizable paths of the weekly total, and the rule
on the total can be checked on the total really placed the week before.

**L6 (existence by greed).** A stairway exists for a segment under R-STEP.T if and only if "every week take as many sets as
the rule allows, from the groups with the most left" ends with nothing left. *Proof.* Taking a set earlier never lowers a
later cap (the cap grows with the placed total) and never raises what is left; by L5 the choice of groups is right. QED.
*Measured:* equal to the dynamic program on 8,000 of 8,000 random tables.

**T1 (link theorem).** Under H1-H4, stage 2 produces for every week a vector such that (a) the own sets of every group equal
the table, (b) no exercise loses a set from one week to the next, (c) every row of 5.5 holds. Stage 2 never fails and never
changes the table. *Proof.* (a) and "never fails": L4 in every segment. (b): prefixes of one add sequence are nested, and
L1. (c): L3; R-STAIRCASE by definition; R-MONO is (b); the step rows are H4 and the scheduler's transitions (L5); the
remaining rows are rows of the certificate and do not depend on the week. QED.

**T2 (the keep vector is exact).** If every G1 question is answered "fits" or "no", the kept set is the lexicographically
largest keep vector over all plans that satisfy the rows of G1 (5.5 with both rows of 5.6). *Proof.* G1 maximizes z
coordinate by coordinate in keep order; each question fixes the earlier coordinates and leaves everything else free. The
reduced model loses no legal plan: the staircase is the only legal shape inside a group-day, the exercise count is a
variable, and "every eligible pair supersetted" is the definition of a day that holds. QED. (The winning design fixed some
later groups to "off"; that lost plans and is removed. *Measured:* equal to exhaustive enumeration in 1,200 of 1,200
instances after the change, different in 72 before it, on a generator with hosted stations and partial own credit.)

**T3 (the peaks are the lexicographic max-min optimum).** Give every (group, own peak v) the key
rho_g(v) = (a_g v + h_g - 4 S_g) / (4 C_g - 4 S_g), **only for C_g>S_g**; saturated groups are excluded from this set-growth objective under CX-03 and use load/rep progression. The generalized objective remains to be checked. Here a_g is the group's average own credit per set and h_g its helper
allowance, both constants of the instance; ties go to the earlier group in keep order. The ladder always tries to raise the
group with the smallest key by one set, asking "is there a legal plan with peaks at least the current vector plus this
set?", and freezes the group on "no". If every answer is exact, the final vector is the unique optimum of the lexicographic
max-min order of the keys over the legal plans that have a stairway. *Proof.* As in `design_two-stage.md` section 3 (T3):
the questions test the down-closure of the legal peak vectors, and a group frozen at a value can only be passed by lowering
a group with a smaller key. QED. One consequence to say plainly: a tie goes to the higher-priority group before anything
else is compared, so the result is the priority-refined optimum, not the plain one. (*Measured* by judge 2: equal to
exhaustive search in 431 of 431 plans.)

**T4 (the monotonicity that is true).** If the legal plans at session length m are all legal at m' > m, the keep vector at
m' is lexicographically at least the keep vector at m. The hypothesis holds here by construction: a longer session only
raises L_d, Delta_d and the exercise budget; every minute-gated station is a candidate that may stay off; set minimums do
not depend on the minutes (the "work lift 3 sets from 60 minutes" rule is a preference of G7, not a bound); the protected
blocks do not grow with the minutes. What does **not** follow, and is false for any exact planner with a priority order:
"more minutes never untrains a group" and "more minutes never lowers a peak". A higher-priority group that newly fits may
push a lower one out. Offers therefore say what they add and what they trade.

**T5 (one more day is never worse).** By construction (7.10): the plan for n days is the better of the n-day template and
the (n-1)-day plan with the extra day as an optional day.

**What is not guaranteed.** (1) Optimality after an "unknown" verdict: the plan is legal, the tier is marked "best found".
(2) Any two-sided ratio on sets. (3) Optimality of the stairway across segments when there are middle epochs: it is optimal
inside each segment for the totals G7b chose. (4) That the minutes are true: the planner and the dose share one time
model; calibrating that model on the coach's own sessions is a separate task (DR-11).

---

## 7. Algorithms

Pseudo-code is normative for *what* is computed and in which order. How many questions a tier asks is an implementation
matter, as long as the result is the optimum the tier names (the tests of section 12 compare results, not question counts).

**Amendment precedence:** the pseudocode below has not been re-proved for CX-01..04. Its rate restrictions, schedule-based freezes, fallback group removal and positive-climb assumptions are historical where they conflict with the current policy amendment. Do not implement those conflicts as fresh coach rules.

### 7.1 S0: the grammar builder

```
buildGrammar(ctx):
  layout   <- ctx.layout, UNCUT: every template station of every day (include_from_minutes is a default, not a gate)
  groups   <- per FOCUS group from ctx.targets: S, C from its carrier lines (two-line groups: the larger start and the larger
              ceiling; the Focus add once); F = volume.floor.value; calves F = 3 x leg days, at most 4 sets a leg day;
              a pain-reduced group: F = its reduced start, mc = 1, C = S + 1; credit-only and no-station groups: fixed_state
              sorted in keep order pi (5.1)
  days     <- limit_s and band_s by day kind and branch (5.6); ex_budget = exercise_cap_by_minutes[minutes] + exercise_margin
              on full-body days; athlete_cap for field athletes
  candidates: for every station of block strength / accessories that has a group:
              bounds (R-BOUNDS), cred_q of its pick's credit class per group (min(4, sum of the members' credits x 4)),
              cost[e] = doseSeconds(doseParams(slot, pick_e, weekShape_e)), pclass, axial[e], rear, counted, laterality[e]
  group-days: candidates by (group, day) in session order, the work lift first, minute-gated stations after the others, then
              extension candidates (A-DEPTH) up to extension.max_per_group_day, each picked through ctx.fillSlot;
              Ks = [2 .. min(4, M)]; calves [1]; beside a class lift [1 .. 3]; home = the first candidate has role work
              optional-day group-days by A-FOCUS, A-BONUS, A-CALF-OPT
  stations:   lead    = the lower work lift of every main day whose group is a big mover (2 sets)
              partner = the template partner of every lower work lift (role paired_upper, same pair tag; 2 sets)
              keep    = the keep form of every partner (same exercise, lead_pair) + for every big mover its
                        volume.pattern_keep bucket on each day whose template lists that bucket
              keep stations and extension candidates get non-axial picks
  partner_rules: per main day with a lower work lift: lead = its group-day / its lead station / fixed (class lift);
              satisfied by every group-day of that day whose first candidate has the partner class, or by the partner station
  pairs:      template pair and superset tags; the same tags with a station side; fixed mates (class lift, a care item done in the rests)
  twins:      the group-days of the two exposures of one day type (rules: A1 / A2, B1 / B2, Legs 1 / Legs 2 ...);
              identical = same bounds, credits, costs, pairs, limits and fixed seconds on both days
  room, tests, epochs: 7.3, R-TEST, 5.3
  assertInstance(instance): H1, H2, H3, H5; every time parameter a whole number of seconds; group credits in {0, 1, 2, 4}
  minimum length: if on some day the protected seconds (+ tests) exceed L_d + Delta_d in some proved week:
              return outcome 'format_min' with the first legal session length at which no day does          (4.4, section 8)
  structural no, per group, before any search: if (largest credited peak the group can reach with every candidate at its
              maximum, the hard per-session limit on each of its days, and every other group's largest helper credit)
              < 4 F + cmin x mc, the group's reason is 'template': no session length helps, another day does
```

The instance is the only thing the later stages read. `tools/planner/grid.mjs` builds it for every cell of
family x days x variant x minutes x level x profile class; a cell that does not build fails the build.

### 7.2 The laterality pre-pass (judge 1, graft 3)

The pick's laterality decides its time class (a one-leg compound set costs 3.0 minutes, a two-leg set 2.25), so it must be
fixed before S1, and the share the coach calls "very important" must not be the first thing traded for minutes.

```
lateralityPlan(layout, derived, model):
  for region in (lower, upper), for each exercise block e:
     beta   <- D10_bilateral_share[region].by_exercise_block[e] (with the pain shift)
     slots  <- the region's compound candidates that carry a laterality dial, extension candidates included, ordered by
               (rank inside their group-day, day in week order, session order)         # the first K of every group-day is close to a prefix
     walk the slots: the next slot is 'bilateral' when that keeps the running bilateral share at least as close to beta as
               'unilateral' would, else 'unilateral'                                    # a divisor rule: every prefix is as close as a prefix can be
     a slot without a dial keeps its bucket's laterality
  -> {slot_id: [laterality per exercise block]}
```

`selectBlock` must return a pick of the planned laterality when the client's filters leave one; otherwise it flips and flags
`laterality_flip`. The planner prices what was really picked. After S2, `shareReached` measures the share on the sets of
each exercise block; it is printed (`meta.planner.laterality`) and scored as T8-BAL-01. When a group is left out for time
and the same solve with every dial slot at its cheaper laterality would keep it, the offers list carries that switch with the
share it gives (7.11). Laterality as a choice of the oracle (judge 2, graft 10) is deferred with a measurement (15.3).

### 7.3 SA: the athletic plan and the room ladder

Athletic work is its own budget, never muscle sets (DEF-03, LK07), but it spends the same minutes.

```
planAthleticStations(ctx):
  class     <- profile class of the client: competitive | stay_active | class | default        (rules.planner.room)
  protected <- the blocks of rules.planner.room[class].protected: seconds per day and week, never cut by the planner
               (the person may still switch a block off: that is an override, 7.14)
  items     <- rules.planner.room[class].items matched against the uncut layout, in keep priority, each with its tier tag,
               its seconds per day and week, its counted exercises, and for an athletic item its key, station and sets per exercise block
               sorted so that before_patterns < after_patterns < after_peaks
  test weeks: on a tested day the athletic and Olympic stations run their week-1 dose (E-165); a timed test replaces its station
  -> protected_s, room[]

doseAthleticKeys(instance, r, athleticTargets):                    # after S1 has fixed the room prefix r
  for every budget key k (jump contacts, low contacts, plyometric contacts, throws, cuts, sprint metres, Olympic sets):
     capacity_k(w) = sum over its stations that are on of sets x largest dose per set       (athletic.reconcile.per_set_max)
     scale_k       = min(1, min over w of capacity_k(w) / target_k(w))                       one scale per key, printed
     planned_k(w)  = max( planned_k(w-1), min(capacity_k(w), round_half_up(scale_k x target_k(w))) )
     stations      : planned_k(w) shared over the stations' sets by a divisor rule            (a larger total never takes from a station)
     per set       : ceil(station total / sets) inside [per_set_min, per_set_max], never below last week's
     the end-test week holds the week before on untested days
  the plyometric share (T3-ATH-02) splits the jump work between plyometric and ballistic stations by the stage's share, same rounding
  Receive-Create stage: one per exercise block (shape.mjs, kept); a stage changes the drills, never a station or a set
  told: a key with scale below athletic.reconcile.warn_below_share (0.85) is printed with its scale and the room item that would raise it
```

Which blocks are protected and where each item is tagged is the coach's decision D4. The defaults follow the winning design:
competitive athletes keep the sport's tracks at their smallest dose and take the athletic extras before the peaks (G4a);
everyone else keeps one athletic piece and one joint-care item a day and takes extras only when no set changes (G4b). A
second joint-care item is tagged `before_patterns`: a kept group may cut it, a kept movement may not.

### 7.4 The propagator (`plan/fd.mjs`): generic, with no knowledge of training (judge 3, condition 2)

```
model:  variables v with a finite domain of states 0 .. S_v - 1
        rows      sum over terms of val_term[state of its variable]  - sum over pair terms  (<= | >=) rhs
        pair term u x min(fa[state of a], fb[state of b]) + k x [fa > 0 and fb > 0]     (only in <= rows, subtracted)
        every row has a name and a flag `implied`; implied rows can be switched off one by one
solve(model, restrictions, order, budget) -> {status: 'fits' | 'no' | 'unknown', states, nodes}
  depth-first; at every node propagate to a fixpoint:
        '<=' row: lower bound of the sum minus the largest value the pair terms can still take; fail when above rhs;
                  delete every state that pushes it above
        '>=' row: upper bound of the sum; fail when below rhs; delete every state that leaves it below
  incremental bounds (a row keeps its running minimum and maximum; a trail undoes them on backtrack), typed arrays, no allocation per node
  variable and value order are given by the caller; ties by index; the node budget is the only stop
```

"No" is a proof by exhaustion with whole-number bounds; "unknown" means the budget ended first. The module is fuzzed against
brute force on random table models that have nothing to do with training (12.2, P1).

### 7.5 The oracle (`plan/oracle.mjs`)

**Variables** of a question: z_g; r; y_s; delta_d (only while it is free); per group-day one variable per proved week,
whose states are "off" and every (K, n) the staircase holds; t_g where R-LAMBDA has two branches. With twins tied (below) a
twin pair shares one variable per proved week.

**Rows**: every catalogue entry of 5.5 through its `rows(instance, entry)`: table values per state are the seconds of the
group-day in that proved week, its credit to each group, its exercise count, its sets, its counted squats and hinges, a flag
for its first candidate's class. Channel rows tie the proved weeks of a group-day (same K; n never drops). Conditional rows
carry a column on z_g. The room prefix enters every day row as a table value of r; the overrun as a table value of delta_d.

**Implied rows** (valid for every legal plan, added only for speed). Each is a named entry, can be switched off in
`rules.planner.oracle.implied`, and has its own test that (a) every brute-force-feasible point satisfies it and (b) verdicts
are the same with it on and off (judge 3, condition 4):

| Name | Statement | Why it is valid |
|---|---|---|
| `peak_floor` | credited peak of a trained group >= 4 F + cmin_g x mc_g | the climb adds at least mc own sets, each worth at least the smallest own credit of the group's candidates. **Not** "4 mc": dips credit half a set, a KB swing none (judge 2, D2) |
| `optimistic_time` | the day rows with doubled seconds in which an exercise paired with another exercise is charged (2 tau - m) per set and half a changeover less, and one paired with a fixed mate (2 tau - 2 m) and no changeover (m = the pair's shorter rest); no pair term | each side is charged at most its share of the largest saving it can ever get |
| `day_subset` | for every set T of main days: the cheapest seconds (and exercise count) the trained groups must spend inside T to hold their smallest possible own peak, summed, fit the capacity of T. The smallest own peak is ceil((4 F + cmin x mc - largest helper credit still possible) / cmax) | a relaxation: exercises on other days are free, helper credit is at its upper bound, credit per own set at its largest |
| `twin_lex` | for a twin pair whose two days are identical in every table: the state vector of the earlier day is lexicographically >= that of the later day | swapping the two days maps legal plans to legal plans |

Subset tables for `day_subset` are precomputed per question (2^days x groups small knapsacks), never per node.

**The question protocol.**

```
ask(instance, question, budget):
  if the instance has twins and oracle.tied_first:
      v <- search(TIED model: every twin pair has the same K and sets that differ by 0 or 1, the earlier day taking the odd set)
      if v = 'fits': return v                        # a witness is a witness
      # a 'no' or 'unknown' of the tied model proves nothing: go on
  return search(UNTIED model)

search(model): for rung b = question_first, x question_growth, ... while nodes are left in min(budget, what the plan has left):
      for strategy in (cheapest peak first, largest peak first):  r <- fd.solve(..., b);  'fits' or 'no' -> return it
  'unknown'
variable order: z in keep order; r; stations; delta; the peak variables (smallest domain first, ties in keep order);
                middle weeks; week 1 (largest value first: floors are covering rows)
every 'fits' witness is re-checked by the catalogue evaluators before it is returned
```

**Budget** (judge 3, condition 1). One number bounds the whole plan: `budget.plan_nodes`. G1 may spend up to `keep_share`
of it; every rung and both strategies spend inside it; when it is spent, every open question is "unknown". Consequences:
in G1 the group is not kept in this plan and is listed "not proven to fit" (never "does not fit"); in every later tier the
tier stops where it stands and is marked `best_found`. The plan in hand is a legal certificate in both cases. The certified
grid (12.4) fails the build when any G1 question of any cell is unknown at the run-time budget.

### 7.6 S1: the tiers (`plan/table.mjs`)

```
planTable(I):
  # G1 keep vector (R3-SES-02 step 2). Rows: 5.5 with BOTH day rows, session limit hard (14) for every group.
  kept <- []
  for g in keep order:
      if g.fixed_state: reason[g] <- g.fixed_state; continue
      if structural no (7.1): reason[g] <- 'template'; continue
      v <- ask(must = kept + g; EVERY later group, every station, r, delta free; core_row)
      'fits': kept += g
      'no':   reason[g] <- (ask(same, no_time) = 'no') ? 'template' : 'time'
      'unknown': reason[g] <- 'not_proven'
  if nothing fits at all (not even kept = [] with the partner stations the class lifts need): outcome 'format_min'      # 7.1 normally catches it

  # G2 room A: the largest prefix of the before_patterns items (same rows as G1)
  r <- largest a such that ask(kept, room_min = a, core_row) fits               # feasibility is monotone in r (H5): scan upward or bisect

  # G3 kept movements. From here on the questions carry R-TIME only (5.6); the band is open.
  for s in lead stations, days in week order:   if its group is not kept and has no station: on if ask(pins + s) fits
  for s in partner stations:                    off if ask(pins + s off) fits, else on        # the rows decide; this only makes it canonical
  for s in keep stations, groups in pattern_keep.order; for one group: lead_pair first, then week order:
        if its group is not kept and has no station of any kind, and fewer than max_per_week optional stations are on: on if ask fits

  # G3b overrun (T4-TIME-01): the smallest common allowance, then day by day in week order; steps of the time quantum
  if ask(pins, band = 0 on every day) fits: delta <- 0
  else: u <- smallest x with ask(pins, band_d = min(Delta_d, x)) fits (bisection);  delta_d <- min(Delta_d, u)
        for d in week order: delta_d <- smallest x <= delta_d with ask(pins, band with x on day d) fits (bisection)
  pin delta

  # G4a room B: the largest prefix of the after_patterns items
  # G5s sessions: for g in kept, keep order: pin 'at most 11 sets of g in a session' if ask fits, else note it

  # G5 peaks: priority water-filling
  h_g <- helper allowance of every kept group: what the kept donors give it at their floors, at their average credit rate;
         a_g <- its average own credit per set. Both are constants once the keep vector is pinned; they order the ladder (T3) and set R-TOP
  v_g <- for every kept group the smallest own peak of any legal plan (structural minimum of its forced days + mc)
  loop:
      g <- the unfrozen group with the smallest key rho_g(v_g) (T3); ties in keep order; stop when none is left
      if v_g = C_g: freeze ('ceiling'); continue
      if a witness in hand already has peaks >= v + e_g and a stairway: v_g += 1; continue                # no search
      a <- ask(pins, peak_min = v + e_g)
      'fits' and existsSchedule(witness ends, rule 7): v_g += 1
      'fits' but no stairway:                          freeze ('schedule')
      'no':   freeze ( ask(same, no_time) = 'no' ? 'growth' : 'time' )
      'unknown': freeze ('not_proven')
  pin the peaks (own sets, all days)

  # G6 week 1, for g in kept, keep order
      want <- clamp(credited peak - 4 (C - S), 4 F, 4 S), converted to own sets with the group's constants a_g, h_g
      w1_g <- the legal own week-1 value nearest to want, lower first        # the legal values form an interval: ask with ranges, not one value at a time

  # G7 structure (pinned questions; first that fits), for g in kept, keep order
      exposure days: every main group-day 'on' if it fits, else 'off'       (home days are on by R-LEAD)
      exercise counts: the smallest K that fits on every active group-day
      optional days:   the fewest optional-day sets that keep the pinned peak
      splits (peak, then week 1): the most even split over the active days, the earlier day taking the odd set; twins tied;
                       from 60 minutes the odd set of week 1 goes to a home day first (work lift at 3 sets, T6-CNT-06 as a preference);
                       then the next most even ...   (a day yields only when it is full; the reason is printed)

  # G7b middle proved weeks (only when the instance has any), j = 1 .. m-1 in week order: evaluation, no search
      target_g <- round_half_up of the planned curve of g at week w_j, clamped to [lo_g, hi_g]
                  lo_g = max(total at j-1, peak - (N - w_j));   hi_g = min(peak, total at j-1 + (w_j - w_{j-1}))
      loop: n^j <- add-sequence vectors for these totals (5.2 c)
            if every day fits at the costs of w_j and existsSchedule(segment j): break
            lower by one the group with the largest (target_g - lo_g), ties to the lowest priority; if none can be lowered:
                  take the oracle's own witness for week j (legal by the certificate) and break

  # G4b room C: raise r through the after_peaks items while every proved week still fits (evaluation)
  certificate <- the pinned plan;  assert certifyEndpoints(certificate) is empty
```

Notes.

- **Every later group is free in G1** (judge 2, D1). The prototype's shortcut ("a later group that credits nobody may be
  switched off") loses plans when a later group hosts a station that credits a group of the question.
- **The session limit.** G1 runs at the hard 14 for every group and G5s brings the usual 11 back in keep order. The
  prototype lifted 11 to 14 only for the group being asked, so its keep vector is not the optimum of any one model
  (*measured*: with a limit drawn per group, 5 of 600 keep vectors differ from brute force at those limits,
  `spec_checks/fix/check_fixes.limits_drawn.out.txt`; with one limit for every group, 0 of 1,200).
- **A raise must leave a stairway.** `existsSchedule` (L6) costs microseconds, so the ladder checks it at every raise and
  the fallback of 7.7 is needed only for the base vector.
- **Zero kept groups is a plan** (judge 2, D3): the tiers G2-G3b still run; the result holds the protected blocks, class
  lifts, kept movements and offers, and the stairway is flat in sets (the progression card and the athletic doses climb).
- **Cost centres** (*measured* on sample 06): the last "no" of each ladder and the week-1 pins of G6 take most of the
  nodes. Ask G6 with ranges, reuse witnesses, and let the tied model answer first.

### 7.7 The stairway scheduler (`plan/stairway.mjs`)

```
existsSchedule(groups {from, to}, weeks, base, rule):      # L6: every week take as many sets as the rule allows, most-left first
scheduleStairway(I, certificate):
  segments  <- consecutive proved weeks (w_{j-1}, w_j] with per-group needs u_g = OwnAll_g(w_j) - OwnAll_g(w_{j-1})
  curve     <- PROPOSED endpoint shape under CX-01: base 3 % / 5 % weights, solve lambda >= 0 so T_g(N) = peak;
               lambda may exceed 1; a fixed upper bracket of 1 is invalid. At S=peak, lambda=0 (CX-03).
               Numerical procedure and accelerated integer scheduler still require verification; the DP below is the historical restricted path.
               ideal(w) = sum over groups of T_g(w) - T_g(1)
  DP over weeks 2..N, state = (sorted vector of sets left in the current segment, was last week flat):
      for D in 0 .. min(cap(total placed so far), groups with sets left):          # R-STEP.T on the PLACED total
          take one set from each of the D groups with the most left                 # L5
          reject if a group has more sets left than weeks left in the segment; at the segment's last week everything is placed
          cost += tier weights x [ last | flat | hold | late | shape | land ]
      at a segment boundary the vector is re-set to the next segment's needs
  tier terms (rules.planner.stairway.tiers, most important first; default last, flat, hold, late, shape, land):
      last   week N adds no set although sets were added in the block
      flat   a week with no added set while sets are still to come
      hold   a flat week right after a flat week
      late   a flat week in the last third, later weeks weighing more
      shape  100 x |sets placed by week w - ideal(w)|, summed
      land   groups that do not step in week N
      weights are whole numbers, each larger than everything below it can sum to; asserted below 2^53
  who steps when: a transportation flow with the DP's rises as column sums, one set per group per week; cost of unit j of
      group g in week w = [final set of the group: BIG x (N - w)] + 1000 x |w - the week its curve reaches that set| + keep rank
      (final_set_late: every group's last set as late as the rises allow, before the curve timing is looked at)
  certifyTable: never down, one set a week per group, the total rule on every placed week, every proved week equal to the certificate
when no schedule exists, in this order, each with a printed note (judge 2, issue 2):
  1. rule 10 (strictly below 10 %, one set always)      2. undo the ladder's raises last in, first out, down to the minimum climbs
  3. un-keep the lowest-priority kept group and run S1 again
```

**CX-01 supersession:** that fallback order applies only to the historical restricted model. A failed 7%/10% or one-set-per-group schedule is not grounds to lower the endpoint or un-keep a group under the new policy. Try a verified accelerated formulation; until one exists, report the planning result as unresolved, not proven infeasible. Genuine time, equipment, ceiling or integer-allocation conflicts still use the authorized feasibility policy.

*Measured* (`spec_checks/stairway_v2.out.txt`, 3,891 schedulable random tables of 1-8 groups and 6-16 weeks): with the
default order the flat weeks equal the arithmetic minimum (weeks - 1 - sets added, at least 0) in every table; the
winning design's order reached it in 3,356. Putting `land` above `shape` (judge 2's exact order) squeezes week N-1 to make
room for a jump in week N in 1,035 tables against 50, so `shape` goes first. The coach's own line 15 -> 22 comes out as
15 15 16 16 17 17 18 18 19 20 21 22: "the last four weeks 19, 20, 21, 22" (R3-VOL-04). An L2 full plan (five big groups
15 -> 22, three small 12 -> 18, calves 12 -> 16) runs 123 126 129 133 136 140 146 152 159 165 173 180: every week rises,
the largest rise is 4.8 %.

### 7.8 S2: placement, supersets, the progression card (`plan/placement.mjs`)

```
placeBlock(I, certificate, table):
  for every kept group: seq <- add sequence through its proved weeks                              # 5.2 (c)
  for w in 1..N:  n(w) <- week-1 vector + the first OwnAll_g(w) - OwnAll_g(1) steps of every seq;   x(w) <- staircase of every group-day
  supersets, per day: the smallest set of the day's eligible pairs such that every week fits L_d + delta_d
       (at most 5 pairs: all subsets by size, then by larger total saving, then session order); those are 'needed';
       every other eligible pair is 'recommended' with the minutes it saves
  progression facts, per week w >= 2 and trained group g (the card of section 8; T3-STW-09):
       'sets'    the group gained a set this week (with the exercise that took it)
       'effort'  else, the planned effort steps this week (3 RIR -> 2 -> 1-2 -> 1 + intensifiers)
       'reps'    else, on the 1st, 3rd, ... such week since its last 'sets' or 'load': the first exercise moves up its rep bracket
       'load'    else: a little more weight, back to the low end of the bracket
```

**CX-02/03:** same-set weeks with rep/load progression are approved; saturated groups hold sets. A display-level change alone is not progression. The precise automatic progression-card procedure above remains PROPOSED, including its feasibility under the prescribed reps and loads. The earlier reading was: the display level of week w rises every week by construction, Q_g never drops, and
every trained group has exactly one progression fact in every week from week 2 on: "started
at 2 and ended at 11, I mean the amount of volume that they're putting themselves at as far as level, not the amount of
sets" (R2-PER-05). In whole sets the flat weeks are at their arithmetic minimum (7.7).

### 7.9 S3: certify (`plan/certify.mjs`)

For every week: every catalogue entry's `evaluate` on the placed sets, with that week's own costs and fixed seconds; the
table against the placed sets; both ends against the certificate. Whole numbers, no tolerance. A non-empty result throws
`EngineError('planner.certificate_failed')`: a plan that fails its own certificate is a defect and is never shown.

### 7.10 Branches and "one more day" (`plan/planner.mjs`)

```
planForIntake(ctx):
  A <- chain(ctx, branch 'chosen')                                   # trained factor 1.00, kept movements in their band
  if A is full (every trainable group kept, every ladder ended on 'ceiling' or 'growth', no room item cut): outcome 'full'
  else if fit.full_plan_factor > fit.trained_factor on some day:
      B0 <- chain(ctx, branch 'full_plan', tiers_until 'G1')         # the band is the full-plan band, no CORE row; keep-level solve first: cheap
      if B0 keeps every trainable group: B <- chain(ctx, branch 'full_plan');  if B is full: outcome 'full_longer_day'
           (the overrun over the chosen minutes is minimized after G5; every long day is told with its minutes)
  otherwise outcome 'keep_time' with A
  one more day is never worse (T5), only when days >= 3 and the outcome is not 'full':
      C0 <- chain(the (days - 1)-day template on the weekdays with the widest spacing, the left-over day as an optional day, tiers_until 'G3')
      if C0's keep vector is lexicographically better than the outcome's: the plan is the full chain of that layout
  chain(ctx, branch) = buildGrammar -> planAthleticStations -> planTable -> scheduleStairway -> placeBlock -> certifyBlock -> doseAthleticKeys
```

### 7.11 Reasons, offers, switches: always by re-solving (`plan/offers.mjs`)

```
reasonsFor(result):  for every group not kept for 'time':
     minutes_missing <- the smallest whole minutes x such that kept + g fits with x more on every day (bisection, extra_s)
     days            <- the days for which kept + g fits once only that day's limit is lifted
offersFor(ctx, result):          each is a keep-level solve (tiers G1-G3) under budget.offers_nodes; a solve that ends 'unknown' is left out
     every longer legal session length (session.minutes_allowed)                       -> adds, trades
     one more day, on the template that intake would really get (T5 applies)           -> adds, trades
     every switch of rules.planner.offers.switches the plan really has, and every room item that was cut -> what it buys
     'exact minutes' when a day runs over for kept movements: the same solve with pattern_factor 1.0 -> what it drops
     'laterality' when a group is out for time and the cheaper laterality would keep it -> the group and the share
an offer is shown only if its keep vector or kept movements differ; it names what it adds and what it trades (T4)
offerDetail(ctx, offer): the full chain for one offer, on demand: first and last week of every group
```

Seven session lengths exist, so the lengths are solved, never computed by arithmetic. Every offered schedule is a valid
intake and gives exactly what the offer says, because the offer is that solve (property P14).

### 7.12 Why, in rule ids, on demand (`plan/conflict.mjs`)

```
conflictFor(ctx, result, g, budget.conflict_nodes):       # g not kept; the question 'kept + g' was answered 'no'
  families <- the rows of the question grouped by rule id and scope (a day's minutes in a proved week, a group's floor, a group's climb ...)
  deletion filter, rules a person cannot change first:  drop a family (rows_off); if still 'no': leave it out; else put it back: it is in the conflict
  -> a minimal list of {rule id, scope}; removing any one of them lets g fit
  budget spent -> 'conflict.not_computed' (a legal answer)
```

It is not part of `generate()`: the plan carries the cheap reasons of 7.11, and the page or the coach tool calls
`conflictFor` when someone asks. Later: QuickXplain's divide-and-conquer on the same interface.

### 7.13 Formats that do not climb in sets per group (`plan/formats.mjs`)

| Format | Handler | What the common machinery still does |
|---|---|---|
| class model (hybrid / CrossFit-style) | class lifts are fixed items (A-CLASS: 3 sets, strength rest, the class's own level table), skill, Olympic piece and the short WOD are protected, WOD growth is a room item | everything: the accessories carry the stairway; R-PARTNER holds for the class squat and deadlift |
| timed circuits (bootcamp) | sets = rounds x stations; the climb is work seconds 35 -> 50 in closed form (T3-STW-10); rounds and stations per group by exact enumeration (at most 3 x 2^stations cases) in keep order, floors and day seconds as rows | keep order, reasons, offers, certificate |
| four-role strength days | the work and the survival are protected; accessory and nuance are candidates with their own bounds; R-COUNT does not apply (`session.exercises_per_group.exempt_families`) | oracle, certificate, stairway on the accessory groups |
| flat blocks (maintenance, pre-season, taper, in-season, recovery) | sets = factor x the reference week, realized by the add rule; no floor, no climb; one oracle question checks the minutes; when it fails the same keep order decides what is trained at the factor | grammar, time function, certificate, offers |

`rules.planner.formats_enabled` lists the formats the planner handles; a block of any other format goes through the old
volume code until its handler lands (11.3).

### 7.14 Selection, block-to-block change, edits, a coach's own rules

**Selection contract.** `selectBlock` runs before the planner on the uncut week and picks an exercise for every candidate
and exercise block. The planner reads three things from a pick: its time class and dose parameters, its credit class, its
set bounds. Inside a stairway block the i-th exercise of a group-day may change at an exercise-block start, but its credit
vector stays the same (H1). After planning, a second pass may swap picks of active exercises for variety or duplicates
**inside the same time and credit class**; nothing is re-proved. Selection can no longer change laterality after the plan
is built, and can never add or remove an exercise.

**Next block.** A new instance using DER-09 with canonical iterative half-up rounding, not one final rounding of `S0*1.05^k`. CX-03 holds the applicable ceiling and uses load/rep progression at saturation. The exact bounded recurrence in the current policy amendment is PROPOSED and must be verified; do not compound the start beyond its ceiling or evaluate the set-growth objective at zero headroom. Nothing is stored.

**Edits** (T1-POL-14). Removing or adding an exercise, or switching a block off, is a rebuild with `PlanOverrides`: a removed
exercise leaves the candidates, an added one is appended to its group-day, a block switched off leaves the fixed seconds.
The same chain runs where its constraints remain satisfied. CX-04 also permits explicit set edits in any week/day. An edit invalidates the old certificate until its credits, time, ceilings and other rules are rechecked; preserve the human edit and disclose conflicts rather than falsely certifying it. The exact edited-plan schema and reporting procedure remain PROPOSED. Editing does not add tracking or automatic adaptation.

**A coach's own rules.** Three layers, all data (locked > coach rule pack > Blaze defaults > client preferences):

1. *Parameters*: the 55 tunables P-01 ... P-55 and `rules.planner`. Changing one changes a constant of a row.
2. *Rule packs*: a custom rule declares one of four shapes, the shapes the proofs of section 6 cover, and registration
   tests the declaration on sampled points before the rule is loaded (judge 3, graft 7):

   | Shape | Example | Why the guarantees survive | Registration test |
   |---|---|---|---|
   | `upper_peak`: upper limit on a tally that never decreases in the sets | "no more than 9 sets of shoulders in a session", "Friday at most 50 minutes" | holds at the peak, so in every week (L3) | the tally never drops when a set is added, on 200 sampled week pairs |
   | `lower_week1`: lower limit on such a tally | "chest at least 12 from week 1" | holds at week 1, so in every week (L3) | the same |
   | `structure`: a rule on z, K, y, r | "always keep the squat pattern", "chest on two days" | constant over the block (H1) | the rule reads no set count |
   | `tier`: a term or an order | "landing before shape", "prefer three exposure days" | a pin order cannot disturb a higher tier | the term is a whole number with a stated bound |

   Anything else (a two-sided ratio, a rule on one middle week) is loaded as a scored soft metric and flagged.
3. *Catalogue*: every rule, built-in or custom, is one entry (4.8).

---

## 8. When the time is short: the policy and what the person reads

### 8.1 R3-SES-02, step by step

| Coach's step (approved) | What the planner does | Where |
|---|---|---|
| 0. The full plan when it fits | outcome `full`: every trainable group is kept and every ladder ends on its ceiling or on the planned growth. No warning | 7.10; T1-POL-03 |
| "It might be a little longer day" (R2-SES-05) | outcome `full_longer_day`: the full plan fits only inside the full-plan factor. The plan is shown with every long day and its minutes, the offer of the next session length, and the switch "keep my minutes exactly" | 7.10; D2 |
| 1. Tell up front and offer a day or longer sessions | before week 1: what the time holds; for every group not trained directly its reason and the minutes it would need; offers at every longer legal length and for one more day on the template that intake would really get; switches with what each buys. Every line is a re-solve | 7.11; T1-POL-04 |
| 2. Keep the time: fewer groups directly, big movers first | G1, exact. A group is trained directly only with its floor, 2-4 exercises a day and its climb. There is no below-floor state | 7.6; T1-POL-05, -09 |
| "... arms, calves and rear delts only from compound credit" | groups not kept are listed with their credited sets per week. The day keeps its pattern: the work lift and its partner stay at 2 sets where they fit, named as kept movements | 7.6 G3; T1-POL-07, -10 |
| 3. Recommend supersets | every eligible pair carries a recommendation with the minutes it saves; a pair is "needed" and switched on only when a day does not hold without it | 7.8; T1-POL-11 |
| 4. The stairway climbs on the trained groups, never flat | R-CLIMB is part of being kept; the ladder lifts every kept group as far as the time holds; the schedule has the fewest flat weeks those sets allow; the progression card names what climbs in every other week | 7.6, 7.7, 7.8; T1-POL-12 |
| "They should be able to turn off that day's athletic or core training" | switches are constraints of a rebuild; the list shows what each one buys before the person decides | 7.14; T1-POL-14 |

### 8.2 Outcomes

| `time_check.outcome` | Meaning | The person sees |
|---|---|---|
| `full` | the full level plan inside the chosen minutes | no time message |
| `full_longer_day` | the full level plan, with named days up to 10 % longer | `timecheck.longer_day`, one offer, one switch |
| `keep_time` | fewer groups trained directly; kept movements; offers | the block of 8.3 |
| `keep_time` with no trained group | the time holds no group at its minimums | `timecheck.no_group`, the kept movements, the offers |
| `format_min` | the protected blocks alone do not fit | plan status `invalid`, `timecheck.format_starts_at` with the first length that fits |

### 8.3 The printed block

Built from plan data; every line is an i18n key with arguments. The example is the pickleball player of 14.1 under the
defaults (sets and minutes *measured*, run D1-a of `spec_checks/graft/run.out.txt`; the minutes missing and the offers are
those of `design_two-stage.md` 12.1 and the same run at 60, 75 and 90 minutes).

```
Your 2 x 45 minutes hold: calves 6 -> 7 sets a week, hips 10.5 -> 12.5.                                     [timecheck.holds]
Kept at 2 sets each, not counted as trained: step-up and row (Mon), chest press (Thu).                        [timecheck.kept_movements]
Monday runs about 46-48 minutes and Thursday up to 49: 1-4 over your 45, the least that keeps them.           [timecheck.kept_movements_over]
  quads: not trained directly (time). It would need about 10 more minutes a day (Mon).                        [timecheck.not_direct.time]
  triceps: no exercise of its own in this week layout; it counts from the big lifts.                          [timecheck.not_direct.no_station]
Offers:
  2 x 60 minutes also trains quads.   2 x 75 also trains quads, back and chest.   2 x 90 also trains shoulders.   [offer.longer_sessions_adds]
  Keep 45 minutes exactly: without the step-up and the row.                                                     [offer.exact_minutes]
  Core opener off on both days: everything inside 45; calves 6 -> 8, hips 10.5 -> 13.5.                         [offer.switch_buys]
Do these as supersets to finish on time: step-up + row (Mon), hinge + press (Thu).                            [superset.needed]
This week: hips +1 set (leg curl, Thu). Calves: same sets, add a rep or two.                                  [progress.sets, progress.reps]
```

### 8.4 Message keys (EN / ES)

New keys go into `model/i18n` through `tools/fixture/planner-words.mjs`. Every Spanish line is PROPOSED until the coach
approves it (neutral Latin American Spanish, the English gym term in brackets where one exists). Existing keys that stay:
`offer.keep_time`, `offer.block_off`, `offer.block_on`, `note.pattern_kept`, `warning.athletic_capacity`,
`why.superset_recommended`. Keys the planner no longer emits are listed in 11.4.

| Key | English | Español |
|---|---|---|
| `timecheck.holds` | Your {days} x {minutes} minutes hold: {lines}. | Tus {days} x {minutes} minutos alcanzan para: {lines}. |
| `timecheck.full` | Your {days} x {minutes} minutes hold the full plan. | Tus {days} x {minutes} minutos alcanzan para el plan completo. |
| `timecheck.longer_day` | {day} runs about {min} minutes in its longest week, {over} over your {minutes}: that is what the full plan needs. | El {day} dura unos {min} minutos en su semana más larga, {over} más que tus {minutes}: es lo que necesita el plan completo. |
| `timecheck.kept_movements` | Kept at 2 sets each, not counted as trained: {stations}. | Se mantienen a 2 series cada uno, sin contar como entrenados: {stations}. |
| `timecheck.kept_movements_over` | {day} runs about {min} minutes, {over} over your {minutes}: the least that keeps these movements. | El {day} dura unos {min} minutos, {over} más que tus {minutes}: lo mínimo para mantener estos movimientos. |
| `timecheck.class_lifts` | {lifts} stay as class lifts ({sets} sets, heavier by the week). | {lifts} se mantienen como levantamientos de la clase ({sets} series, más pesadas cada semana). |
| `timecheck.not_direct.time` | {group}: not trained directly (time). It would need about {min} more minutes a day ({days}). | {group}: no se entrena directamente (tiempo). Necesitaría unos {min} minutos más por día ({days}). |
| `timecheck.not_direct.template` | {group}: this week layout cannot hold it at any session length; another training day can. | {group}: esta distribución semanal no lo permite con ninguna duración; otro día de entrenamiento sí. |
| `timecheck.not_direct.no_station` | {group}: no exercise of its own in this week layout; it counts from the big lifts ({credit} sets a week). | {group}: sin ejercicio propio en esta distribución; cuenta por los ejercicios compuestos ({credit} series por semana). |
| `timecheck.not_direct.credit_only` | {group}: counted from the big lifts for this goal ({credit} sets a week). | {group}: cuenta por los ejercicios compuestos para este objetivo ({credit} series por semana). |
| `timecheck.not_proven` | {group}: we could not finish checking whether it fits, so it is left out for now. A longer session settles it. | {group}: no pudimos terminar de comprobar si cabe, así que por ahora queda fuera. Una sesión más larga lo resuelve. |
| `timecheck.lower_peak` | {group} climbs {from} -> {to} (the level's top is {ceiling}): {reason}. | {group} sube de {from} a {to} (el tope del nivel es {ceiling}): {reason}. |
| `why.stopped_by_time` | {days} are full | {days} están llenos |
| `why.stopped_by_growth` | that is the planned growth for {weeks} weeks | es el crecimiento planeado para {weeks} semanas |
| `why.stopped_by_schedule` | more sets than the weekly steps allow | más series de las que permiten los pasos semanales |
| `timecheck.room_cut` | To make room for {groups}, {block} is off on {days}. You can switch it back on. | Para hacer espacio para {groups}, {block} queda desactivado el {days}. Puedes volver a activarlo. |
| `timecheck.no_group` | Your {days} x {minutes} minutes hold no muscle group at a full dose. The plan keeps {stations} and {blocks}. | Tus {days} x {minutes} minutos no alcanzan para ningún grupo muscular a dosis completa. El plan mantiene {stations} y {blocks}. |
| `timecheck.format_starts_at` | This format needs at least {min} minutes a session: {blocks} alone take {need}. | Este formato necesita al menos {min} minutos por sesión: solo {blocks} ocupan {need}. |
| `timecheck.session_over` | {group}: {sets} sets in one session ({day}), more than the usual 11: the only way your days hold it. | {group}: {sets} series en una sesión ({day}), más que las 11 habituales: la única forma de que quepa en tus días. |
| `timecheck.tests` | Test days ({days}): the test takes the place of {station}; {items} are skipped that day. | Días de prueba ({days}): la prueba ocupa el lugar de {station}; ese día se omiten {items}. |
| `timecheck.test_dropped` | No {test} test: the plan does not train {lift} directly. | Sin prueba de {test}: el plan no entrena {lift} directamente. |
| `offer.longer_sessions_adds` | {days} x {min} minutes also trains {adds}.{trade} | {days} x {min} minutos también entrena {adds}.{trade} |
| `offer.more_days_adds` | {days} x {min} minutes (one more day) also trains {adds}.{trade} | {days} x {min} minutos (un día más) también entrena {adds}.{trade} |
| `offer.trades` | {lost} then counts from the big lifts only. | {lost} pasa a contar solo por los ejercicios compuestos. |
| `offer.same_groups_higher` | {days} x {min} minutes: the same groups, higher peaks. | {days} x {min} minutos: los mismos grupos, picos más altos. |
| `offer.switch_buys` | {block} off on {days}: {effect}. | {block} desactivado el {days}: {effect}. |
| `offer.exact_minutes` | Keep {minutes} minutes exactly: without {stations}. | Mantener {minutes} minutos exactos: sin {stations}. |
| `offer.laterality` | With more two-leg work {group} fits ({share} % two-leg instead of {target} %). | Con más trabajo a dos piernas cabe {group} ({share} % a dos piernas en lugar de {target} %). |
| `superset.needed` | Do these as supersets to finish on time: {pairs}. | Haz estos ejercicios en superserie (superset) para terminar a tiempo: {pairs}. |
| `superset.recommended` | Supersets that save time: {pairs} (about {min} minutes). | Superseries (supersets) que ahorran tiempo: {pairs} (unos {min} minutos). |
| `progress.sets` | +1 set: {exercise} ({day}) | +1 serie: {exercise} ({day}) |
| `progress.reps` | {group}: same sets, add a rep or two on {exercise} | {group}: mismas series, agrega una o dos repeticiones en {exercise} |
| `progress.effort` | {group}: same sets, one rep closer to your limit this week ({rir}) | {group}: mismas series, una repetición más cerca de tu límite esta semana ({rir}) |
| `progress.load` | {group}: same sets, a little more weight on {exercise}, back to the low end of the reps | {group}: mismas series, un poco más de peso en {exercise}, de vuelta al mínimo de repeticiones |
| `why.exposure_behind` | This set goes to {day}: the day that was behind | Esta serie va al {day}: el día que iba atrás |
| `why.day_full` | {day} is full, so the set goes to {other} | El {day} está lleno, así que la serie va al {other} |
| `why.first_fewest` | It goes to {exercise}: the first exercise with the fewest sets | Va a {exercise}: el primer ejercicio con menos series |
| `why.lead_kept` | {day} keeps its {lift} at 2 sets | El {day} mantiene su {lift} a 2 series |
| `why.partner_kept` | The {lift} keeps its {partner} | El {lift} mantiene su {partner} |
| `athletic.next_item` | The full {key} dose needs {item}: it would cost {cost}. | La dosis completa de {key} necesita {item}: costaría {cost}. |
| `laterality.share` | Two-leg : one-leg work this block: {reached} % two-leg (planned {target} %) | Trabajo a dos piernas y a una pierna en este bloque: {reached} % a dos piernas (planeado {target} %) |
| `plan.proof.best_found` | Checked as far as this device allowed: {what} may be one set short of the best. | Comprobado hasta donde este dispositivo permitió: {what} puede quedar una serie por debajo de lo mejor. |
| `conflict.intro` | Why not {group} as well: {reasons}. | Por qué no también {group}: {reasons}. |
| `conflict.not_computed` | The reason was not worked out in the time this page had. | La razón no se calculó en el tiempo que tuvo esta página. |
| `reason.R-TIME` | {day} is full in week {week} | el {day} está lleno en la semana {week} |
| `reason.R-FLOOR` | {group} needs its {F} weekly sets | {group} necesita sus {F} series semanales |
| `reason.R-CLIMB` | {group} has to climb at least {mc} sets | {group} debe subir al menos {mc} series |
| `reason.R-LEAD` | the {lift} stays on its day | el {lift} se queda en su día |
| `reason.R-PARTNER` | the {lift} keeps its {partner} | el {lift} mantiene su {partner} |
| `reason.R-COUNT` | a trained group needs 2 to 4 exercises a day | un grupo entrenado necesita de 2 a 4 ejercicios por día |
| `reason.R-CALF` | calves need every leg day | las pantorrillas necesitan cada día de pierna |
| `reason.R-BOUNDS` | an exercise holds at most {max} sets | un ejercicio admite como máximo {max} series |
| `reason.R-SESSION` | a session holds at most {max} sets of one group | una sesión admite como máximo {max} series de un grupo |
| `reason.R-EXBUDGET` | {day} holds at most {max} exercises | el {day} admite como máximo {max} ejercicios |
| `reason.R-ATHLETE12` | {day} holds at most 12 exercises | el {day} admite como máximo 12 ejercicios |
| `reason.R-LAMBDA` | the planned growth for {weeks} weeks | el crecimiento planeado para {weeks} semanas |
| `reason.R-CEIL` | {group} is at the top of its level | {group} está en el tope de su nivel |

---

## 9. Determinism

1. **Whole numbers decide.** Seconds, quarter sets, sets, tier weights below 2^53. No tolerance constant in any comparison
   of the planner; `EPS`, `CLIMB_TOL` and the 0.5-set slack are not read.
2. **Floating point appears in one place:** the planned curve of the scheduler (60 bisection steps, + - x / only, no
   `Math.pow`, `exp` or `log`), and it enters decisions only as hundredths rounded half up.
3. **Budgets are node counts**, never milliseconds. A slow phone prints the same plan as a fast laptop.
4. **Fixed orders everywhere:** keep order, week order, session order, state order, the two search strategies, the tier
   list, subsets of days by bit mask. No iteration over `Map`, `Set` or object keys in a decision path.
5. **Canonical results, not only repeatable ones.** Every value a search could choose freely is pinned by a tier: G3 pins
   the stations, G3b the overrun, G6 week 1, G7 the exposure days, counts and splits, G7b the middle weeks; the ladder's
   keys use constants of the instance, never a witness; the transportation cost carries the keep rank. A rewrite of the
   search cannot change a published plan whose tiers are proven.
6. **What is not canonical says so.** A tier that ends `best_found` depends on the budget and the search order; the plan
   lists it (`meta.planner.tiers`) and the benchmark counts it.
7. **No clock, no randomness, no I/O** in `engine/plan/` (the rules of `CONTRACTS.md` 1.2).
8. **Measured for the prototype this spec builds on:** six plans, identical bytes in V8 and JavaScriptCore
   (`design/two-stage/out/det.*.txt`, checksum e905a0f2; judge 2 and judge 3 reran it). The release gate repeats this on the
   8 samples and the bench corpus.

---

## 10. Performance budget

### 10.1 Targets (DR-22, judge 3's gate)

| Quantity | Target | Where measured |
|---|---|---|
| `generate()` for one plan, offers at keep level included | p50 <= 60 ms, p99 <= 250 ms on the reference laptop, in V8 and in JavaScriptCore | the grid and the bench corpus, `tools/planner/bench-time.mjs` |
| the same on one real mid-range phone | p99 <= 1 s | once, by hand, recorded in `DECISIONS.md` |
| search nodes per plan | <= `budget.plan_nodes` by construction | `meta.planner.nodes` |
| cost of one node | median <= 6 microseconds, p99 <= 20 | `bench-time.mjs` |
| one offer detail, one conflict explanation (on demand) | <= 250 ms each, under their own budgets | the same script |
| `generate()` stays synchronous | yes; a Web Worker is the page's choice | - |

### 10.2 What was measured, and what it means

| Run (prototype, one laptop) | Questions | Nodes | Time | Unknown | Violations |
|---|---|---|---|---|---|
| winning design, 71 sample plans (its section 5) | 56 on average | median 267 | median 33 ms, 90 % under 0.17 s, worst 4.1 s | 0 | 0 |
| judge 3, random instances of 8 groups x 4 days | - | - | median 83 ms, 90th percentile 1.1 s, worst 4.5 s | 1 in 30 | 0 |
| this spec, 20 plans of three samples with the grafts (plus one length at which the class format does not start) | 33-92 | 109-15,833 | 11 ms to 0.5 s | 0 | 0 |
| this spec, sample 06 (8 groups x 4 days, twins), 500 nodes a rung | 184 | 61,615 | about 3.6 s | 31 tier steps | 0 |
| the same, 2,000 nodes a rung | 189 | 153,187 | about 10.5 s | 22 | 0 |
| the same, 2,000 a rung, twins tied | 171 | 20,967 | about 1.3 s | 1 | 0 |
| the same, 20,000 a rung | 187 | 758,493 | about 54 s | 3 | 0 |

Reading. (1) Small and medium plans are already inside the target. (2) The full-size plan is not: the prototype costs
about 60-70 microseconds a node (it re-scans every row at every node and enumerates day subsets inside the search) and it searches
an untied, symmetric model. (3) Legality never depended on the budget: at 500 nodes a rung the plan trains the same 8 groups
and ends at 134 weekly sets instead of 142. (4) Where the nodes go on sample 06: the peaks ladder (the last "no" of every
group), the week-1 pins of G6, then the structure pins; the keep vector itself took 2,720-10,220 nodes.

### 10.3 What must be built to meet the target, in order of measured or expected gain

| Measure | Evidence |
|---|---|
| incremental propagation with a trail, typed arrays, no allocation per node; subset tables computed once per question | prototype cost about 60-70 microseconds a node; the target of 6 is the largest single factor (*target*, to be measured in WP-02) |
| twins tied first, untied proof (7.5) | *measured*: 7.3 times fewer nodes on sample 06 |
| G6 asked with ranges; witnesses reused across questions | *measured*: G6 takes a third to a half of the nodes on sample 06 |
| the `twin_lex` row on identical twin days | halves the untied space per twin pair (*target*) |
| conflict-directed backjumping in `fd.solve` | chronological today; listed by the winning design (*target*) |
| the per-plan node cap | bounds the worst case: time <= plan_nodes x node cost |

### 10.4 If the target is not met

The fallback is a smaller budget with honest `best_found` marks, never another solver (judge 3): legality does not depend on
a proof in this design. `budget.plan_nodes` is set to the largest value for which the worst grid cell stays inside 200 ms
on the reference laptop. Two things may not be traded away: an "unknown" in G1 on any grid cell blocks a release (12.4), and
`best_found` on more than 5 % of the grid cells blocks a release (13.2).

---

## 11. Migration from engine 0.4

### 11.1 Per file: keep, change, replace, delete

| File (lines today) | Fate | Detail |
|---|---|---|
| `intake.mjs` (1,093), `shape.mjs` (380), `model.mjs` (399), `util.mjs` (293), `budget.mjs` (144) | **keep** | `model.mjs` gains the `rules.planner` accessor; `util.mjs` re-exports the planner typedefs |
| `select.mjs` (1,906) | **keep, two additions** | honours `ctx.laterality_plan`; picks extension candidates and stations through `fillSlot` on the uncut day; the class-preserving re-pick after planning. No scoring change |
| `dose.mjs` (1,218) | **keep, two additions** | exports `doseParams(slot, pick, weekShape)`; `doseItem` prints exactly those values; the progression card (`weeks[].progression`, `progress.*`) |
| `timefit.mjs` (170) | **keep lines, groups, credits** | `setCost`, `supersetMinutes`, `testMinutes` become wrappers over `plan/timecost` (the single definition) |
| `week.mjs` (2,002) | **change** | `buildWeekLayout(derived, shape, tb, model, {uncut: true})` returns every template station; **delete** `applyCuts`, `enforceAthleteCap`, `moveGroupsToOptional`, `movePrehabToOptional`, `trimOlympicExposures` and the cutting half of `ensureAthleticTracks` (their work is the room ladder and R-ATHLETE12); keep the calendar, weekdays, play and game spacing, ordering pass, aerobic placement, test marking; `layoutForWeek` applies the plan's active set; `estimateMinutes` calls `plan/timecost` |
| `athletic.mjs` (1,216) | **split** | keep `athleticBudget` (targets), stages, drill rules, `perSetBounds`, cues; **delete** `ensureAthleticStations` and `planAthletic` (stations are SA's protected blocks and room items; doses are `doseAthleticKeys`) |
| `volume.mjs` (2,830) | **replace** | keep `computeTargets`, `calvesFloor`, `weeklyCredits`, `stairwayPlan`, `plannedGrowth` (display); `planWeeklySets` becomes a call to `plan/planner.planWeeklySetsV2`; **delete** `runBlock` and everything in it: `structureCut`, `timeCheck`, the probes, `finishCheck`, `trimToTime`, `placeInc`, `placeSet`, `tryBonus`, `addPatternKept`, `buildSchedule`, the 40-attempt retry |
| `generate.mjs` (1,104) | **change** | reads `rules.planner.engine`; with `two_stage`: uncut layouts, the laterality plan, one planner call, no athletic reconcile in `collectWeek`, `est_minutes` = the planner's seconds, `time_check` / `offers` / `meta.planner` from the result; with `shadow`: the old plan plus `meta.planner_shadow` |
| `validate.mjs` (1,399) | **change** | the dosing checks (V13, V22, V23, V27, H17, H18, H21) read the catalogue ids and parameters; the exemptions of diagnosis RC10 (V22 skips, the 0.5-set tolerance, 110 % as "fits", warned days) are deleted or become named parameters |
| `render.mjs` (1,265), `explain.mjs` (160) | **change** | the time block of 8.3, kept movements, the progression card, offers with adds and trades; new keys |
| `version.mjs` | **change** | 0.5.0 |
| `tests/review-*.test.mjs` (10 files, about 4,000 lines) | **re-express or retire** | each asserted patch becomes a rule-id property of section 12, or is retired with the decision that made it obsolete, in a table in `DECISIONS.md` |

An estimate, not a measurement: about 1,900 lines of new planner code (the prototype is 1,174 without S0, the room ladder,
the formats and the offers plumbing) replace about 2,500 lines of `volume.mjs`, 600 of `week.mjs` and 600 of `athletic.mjs`.

### 11.2 The switch and shadow mode (judge 3, graft 12)

`rules.planner.engine`: `v04` (default until the gate of 13.3), `shadow`, `two_stage`. In `shadow` the old engine's plan is
returned unchanged except for one added field, `meta.planner_shadow = {outcome, trained_groups, pattern_stations, peaks,
longest_day_minutes, tiers, nodes}`, so both can be scored on every corpus at every slice without showing the new plan.
`tools/planner/shadow.mjs` prints the two side by side.

### 11.3 Slices (each scored on the benchmark before the next)

1. **Baseline.** Catalogue, time function, certifier evaluators; the benchmark scores the old engine.
2. **Stairway and placement** on the old engine's own ends where they certify: the scheduler and the add sequence replace
   the four rounding regimes. Lowest risk, removes most avoidable flat weeks.
3. **Uncut layout, grammar, oracle, S1** in shadow mode. Keep vector, kept movements and peaks from the new chain.
4. **SA and the room ladder**; cuts and the athletic reconcile removed.
5. **Offers and reasons** by re-solving; the time block of 8.3.
6. **Formats** one at a time (`formats_enabled`); a block whose format is not enabled still goes through the old code.
7. **Switch** to `two_stage` after the gate; delete the old volume code and the retired tests.

### 11.4 Decisions and data that retire

| Retired | Replaced by |
|---|---|
| E-11 / E-93 "trained below the floor"; `time_check.trained_below_floor` (stays as an empty list) | a group is trained at its floor or listed |
| E-94 / E-145 pattern stations as repairs; E-144 day patterns as a pass | A-PATTERN, R-LEAD, R-PARTNER |
| E-143 stay-active room cuts as a retry; `cut_order.*` as code paths | the room ladder (the cut orders stay as the source of its data) |
| E-83 group-day reduction as a repair | exposure days are decided by G7 |
| E-85 / E-146 release rounding modes; the bank | the scheduler |
| `session.time_fit.fit_factor`, `long_day.warn_above_factor`, `error_above_factor` | `rules.planner.fit` |
| `placement.work_min_sets_from_minutes` as a bound | a preference of G7 |
| `stairway.limits.placed.helper_slack`, `CLIMB_TOL`, `EPS` in dosing comparisons | whole numbers |
| keys `time.too_short`, `warning.time_check`, `warning.long_day`, `warning.floor_schedule`, `warning.time_lower_peak*`, `warning.test_day_long*`, `offer.more_days_min`, `offer.longer_sessions_some`, `offer.lower_start`, `changes.held_group`, `changes.at_time_cap` | the keys of 8.4 (the old keys stay in the word lists until the old engine is deleted) |

---

## 12. Tests

### 12.1 The definition of done is outside the planner

Acceptance is the scorer's numbers on the benchmark (section 13), never `validation.ok`. The scorer shares rule ids with
the planner and nothing else.

### 12.2 Property tests (`tests/plan/`; generators in `tests/helpers/plan-gen.mjs` use `Math.imul`, and every test prints and asserts the distribution it drew)

| # | Property | Checked against | Evidence so far |
|---|---|---|---|
| P1 | `fd.solve` verdicts are exact | brute force on random table models with pair terms, no training content | specified |
| P2 | the oracle's verdict is exact | brute force over the certifier's evaluators on small instances: 2-3 groups, 1-2 days, pairs, stations hosted by another group's exercise that credit a third group, fixed mates, strength rests, class credit, **own credit of 0, 2 and 4 quarter sets** | *measured*: 4,800 questions, 0 differ (`spec_checks/fix`) |
| P3 | every "fits" witness passes the evaluators | `certifyEndpoints` | same run: 0 rejected |
| P4 | every implied row is implied: each brute-force-feasible point satisfies it; verdicts equal with the row on and off | brute force, one test per row | specified (the prototype's test caught one invalid bound; judge 2 found a second) |
| P5 | the keep vector equals the exhaustive lexicographic maximum | enumeration of all 2^n group subsets on small instances | *measured*: 1,200 of 1,200 |
| P6 | the ladder is the priority-refined max-min optimum | exhaustive peak vectors on small instances | *measured* by judge 2: 431 of 431 |
| P7 | the scheduler is optimal for its tier order and certified; `existsSchedule` equals the dynamic program | brute force over every table on small plans; certificate on real sizes | *measured*: 3,000 small plans (prototype order); 8,000 existence verdicts, 0 differ; 3,891 certificates, 0 failures |
| P8 | the link: every week of every plan passes every hard row, recomputed with that week's own costs and fixed seconds, with costs that change by exercise block and fixed seconds that go up and down | the certifier | *measured*: 2,478 + 1,628 plan-weeks, 0 violations (winning design, judge 2) |
| P9 | no exercise ever loses a set; every week lies between its two proved weeks; the staircase holds; the table printed equals the table placed | direct check | same runs: 0 |
| P10 | middle epochs: with a costliest first exercise block, the plan in `dominance` mode is legal and its peaks are never below `reserved` mode | both modes on the same instances | specified |
| P11 | tied twins: every "fits" of the tied model passes the untied evaluators; the final plan with `tied_first` on equals the plan with it off whenever all tiers are proven | both protocols | specified |
| P12 | the keep vector never gets lexicographically worse with more minutes (T4), and never worse with one more day (T5) | the sweep at the 7 legal lengths and days + 1 | *measured* for minutes: 72 steps, 0 worse (winning design) |
| P13 | lexicographic order: changing a lower tier's data never changes a higher tier's result | rerun with permuted lower-tier parameters | specified |
| P14 | every offered schedule, run as an intake, is valid and gives exactly the stated adds and trades | the offer's own solve | specified |
| P15 | the room ladder: feasibility is monotone in r; a room item is off only if a higher tier needed it | exhaustive over r on small instances | specified |
| P16 | the overrun is minimal: no day's delta can be lowered with the pins of G1-G3 | exhaustive over delta on small instances | specified |
| P17 | no stage after the planner changes sets or minutes: `est_minutes` equals the re-cost of the dosed items by `plan/timecost` | every sample and bench plan | specified |
| P18 | parameter robustness: floors 8-12, total rule 7 or 10 %, factors 1.0-1.15, ceilings to 30, margin 0-2: P2-P9 still pass | the same generators | specified |
| P19 | determinism: same bytes twice, and in V8 and JavaScriptCore | 8 samples + bench corpus | *measured* for the prototype (six plans) |
| P20 | a custom rule that lies about its shape is rejected at registration | sampled points | specified |

### 12.3 Golden tests from the coach's own material

| Golden | Expected |
|---|---|
| his L2 line 15 -> 22, 12 weeks | 15 15 16 16 17 17 18 18 19 20 21 22: the last four weeks 19, 20, 21, 22 (R3-VOL-04) |
| the staircase | 2/2/2 -> 3/2/2 -> 3/3/2 -> 3/3/3 -> 4/3/3 (VOL-07) |
| the add order | Monday's first exercise this time, Thursday's the next (R3-VOL-03) |
| the worked example 12 v1.2 section 5.5 (2 x 45, kept movements off) | trained: hips and the pinned calves, nothing else; at 2 x 60 quads join; at 2 x 75 quads and back |
| BYOP day 1 (7 exercises, 19 sets) | the time function gives about 60 minutes (the calibration anchor of DR-11) |
| the three 2 x 45 plans of 14.1 | the tables of `spec_checks/graft/run.out.txt`, D1-a, D1-b, D1-c |

### 12.4 The certified grid and the reference model (judges 1, 2, 3)

- `tools/planner/grid.mjs` builds every cell: 6 families x 2-6 days x every variant x 7 session lengths x L1-L3 x the
  profile classes that change the fixed blocks (at least the 630 cells of the milp design's grid, with the 21
  `hybrid_crossfit` 4-day cells resolved through their variant).
- `tools/planner/ref/` holds the **reference model**: slot-level (one whole number per candidate and proved week, the pair
  rounds explicit), built from the instance JSON by code that shares nothing with `engine/plan/`, searched by a plain
  whole-number depth-first search with its own bounds. Judge 2 measured this approach on the milp slot model: 44 of 44 keep
  questions of the three samples decided, 0 differ, under one second in all.
- `tools/planner/certify-grid.mjs` solves every G1 question of every cell with the reference model at
  `budget.certify_nodes` and stores the proven keep vector in `tests/golden/planner-grid.json` with the model version.
- `tests/plan/grid.test.mjs` (CI): the run-time planner reproduces every certified keep vector inside
  `budget.plan_nodes`; no G1 question is unknown; every plan passes its certificate. A cell the reference search cannot
  decide is listed by name and blocks a release until it is decided or its template is changed.
- A strong external solver (HiGHS, MIT) may be used **as a development-only second opinion** under `tools/`, if the
  maintainers accept the dev dependency (decision M-1 in `IMPLEMENTATION_PLAN.md`). Nothing in CI or in the engine may
  need it.
- Optional third check: the day-layered search with a failure memo of the template-parametric prototype, on exact-total
  questions (judge 2 measured 5,322 questions against plain enumeration, 0 differ).

### 12.5 The price of a structural rule (judge 3, graft 13)

`tools/planner/staircase-price.mjs` solves the reference model on the grid with the in-day staircase relaxed to a tier and
lists every cell where that would keep one more group or raise a peak. The same script reports the price of the laterality
pre-pass (every dial slot free). The lists are saved with the grid summary; they are what the coach and the maintainers
look at before anyone proposes to soften VOL-07 or to make laterality a choice of the oracle.

---

## 13. Acceptance criteria

### 13.1 Corpora

| Corpus | Content |
|---|---|
| C1 samples | the 8 sample intakes of `samples/intakes/` |
| C2 bench | the intakes of `design/bench/intakes/` (50 or more: every family, 2-6 days, 30-120 minutes, levels, ages, Focus, pain, sports, edge cases) |
| C3 sweep | C1 at the 7 legal session lengths and at days + 1 (the 105-plan sweep of diagnosis 1.8) |
| C4 grid | the template grid of 12.4 |
| C5 random | 1,500 random intakes of `tests/helpers/random-intake.mjs` |

### 13.2 Thresholds (the scorer computes each on `plan/2`; "trained" = listed in `time_check.trained_groups`)

| # | Metric | Definition | Corpus | Pass |
|---|---|---|---|---|
| A1 | `hard_violations` | sum of every metric of `rules_as_constraints.json > metrics_index` whose kind is hard or hard_conditional | C1-C5 | 0 |
| A2 | `floor_misses`, `calf_floor_misses` | stairway group-weeks with `main_sets_by_group[g]` under the floor of a trained group (10; calves 3 x leg days; a pain-reduced group its start) | C1-C5 | 0: **100 % of trained groups at or above their floor in every week** |
| A3 | `below_floor_states` | entries of `trained_below_floor`, plus groups with 2 or more exercises on a day that are not in `trained_groups` | C1-C5 | 0: a group is trained or explicitly listed as not trained |
| A4 | `unlisted_untrained` | groups neither in `trained_groups` nor in `not_trained_directly` with a reason | C1-C5 | 0 |
| A5 | `one_exercise_groups` | (day, group) with exactly one exercise that is neither calves, nor a class lift, nor a station listed in `time_check.pattern_stations` with 2 constant sets and a group that is not trained | C1-C5 | 0 |
| A6 | `trained_not_climbing`, `set_drops` | trained groups whose main-day own sets rise by less than the minimum climb over the block; any exercise or group with fewer sets than the week before | C1-C5 | 0 |
| A7 | `flat_weeks_excess` | flat weeks of `total_resistance_sets` in the stairway block minus max(0, N - 1 - sets added in the block) | C1-C5 | 0 in every plan: **no flat week that whole sets could have avoided** |
| A8 | `progression_missing` | trained group-weeks from week 2 on without exactly one entry in `weeks[].progression`; weeks whose display level does not rise | C1-C5 | 0: **0 flat weeks on trained groups in the coach's sense** (level, then sets, reps, effort or load) |
| A9 | `weekly_rise_over`, `last_week_not_hardest` | a weekly total rising by more than max(1 set, 7 %) (10 % only with the printed note); a last week that is not the largest | C1-C5 | 0 |
| A10 | `days_over_unwarned` | days of any week, test weeks included, with `est_minutes` above the chosen minutes that are not listed in `time_check.overrun` with an offer that removes the overrun | C1-C5 | 0: **100 % of days within the minutes, or told with an offer** |
| A11 | `days_over_band` | days with `est_minutes` above ceil(chosen minutes x 1.10), any week | C1-C5 | 0 |
| A12 | `minutes_recost_gap` | days where `est_minutes` differs from the scorer's own DEF-09 re-cost of the dosed items | C1, C2 | 0 |
| A13 | `exbudget_over`, `athlete_cap` | full-body days with more counted resistance exercises than the cap by minutes + the margin; field-athlete days over 12 | C1-C5 | 0 |
| A14 | `keep_vector_mismatch`, `unknown_keep` | cells whose keep vector differs from the certified one; G1 questions that end unknown at the run-time budget | C4 | 0 and 0 |
| A15 | `keep_worse_with_minutes`, `keep_worse_with_days` | steps of the sweep where the keep vector gets lexicographically worse | C3 | 0 and 0 |
| A16 | `offer_invalid`, `offer_mismatch` | offered schedules that are not valid intakes; offers whose re-run does not give exactly the stated adds and trades | C1-C3 | 0 and 0 |
| A17 | `unexplained_decisions` | a group not trained without a reason; a lowered peak without `stopped_by`; an overrun without a cause; an athletic key under 85 % of its target that is not told | C1-C5 | 0 |
| A18 | `athletic_drops`, `athletic_attainment` | a key whose weekly dose drops inside a block; planned dose under 0.9 x the scaled target in any week | C1, C2 | 0; 100 % of keys |
| A19 | `best_found_share` | plans with any tier marked `best_found` | C4 | <= 5 % of cells; G1 never |
| A20 | `early_peak_plans` | plans with a trained group (climb of 3 or more) whose last set arrives before week N-1 | C2, C5 | <= 5 % of plans (*measured* 2.3 % on random tables) |
| A21 | `laterality_error` | bilateral share reached against the target, per region and exercise block | C1, C2 | within 0.12 in >= 95 % of blocks; reported otherwise |
| A22 | `determinism` | byte-identical plan JSON twice; V8 and JavaScriptCore | C1, C2 | identical |
| A23 | `time` | 10.1 | C2, C4 | p99 <= 250 ms laptop; one phone measurement recorded |
| A24 | regression rule | a change that improves one sample's score may not lower another's | C1 | holds at every slice |

Notes for the scorer. (1) Floors, caps, margins and factors are read from the catalogue parameters (`volume.floor.value`,
`rules.planner.calves.floor`, `rules.planner.fit`, `session.exercise_cap_by_minutes` ...), never typed in. (2) A plan of the
old engine has no `time_check.pattern_stations`, `time_check.overrun` or `weeks[].progression`; the scorer treats a missing
field as empty, so the baseline is expected to fail A3, A5, A8 and A10: that is the measurement, not an error of the
scorer. (3) "Stairway block" = weeks with `block_type == "stairway"`; flat blocks, classes and circuits are scored on the
rows their format keeps (7.13): A2 and A10-A13 always, A6-A9 on the groups that climb in sets. (4) Every metric is
reported per plan with the weeks, days and groups that break it, so a failing number can be read.

### 13.3 The release gate (in this order; each is a script with a saved output)

1. S0 builds every grid cell from `model/templates.json`.
2. The grid through the run-time chain at the per-plan node cap: A1 = 0, A14 = 0 and 0, A19 inside its bound.
3. A23 on the laptop in V8 and JavaScriptCore, and one measurement on a real mid-range phone.
4. A1-A22 on C1, C2, C3, C5.
5. The ten `tests/review-*.test.mjs` files re-expressed as rule-id properties or retired, each with its line in `DECISIONS.md`.
6. The coach-eye review of 13.4.
7. The coach's answers to D1, D4 and D13 of section 14, or his explicit "use the defaults".
8. Reconcile and independently verify the CX-01..04 amendment: generalized endpoint reachability and scheduling, affected bounds/proofs, saturated next-block behavior, and manual-set-edit reporting. Re-run independent reference, boundary and benchmark checks under the revised policy. The existing prototype results cannot satisfy this new gate.

### 13.4 Coach-eye review targets

The eight sample plans are regenerated and reviewed with the protocol of `samples/REVIEW_LOG.md` (a reviewer per sample,
graded A-D, issues as blocker / major / minor).

| Target | Value |
|---|---|
| grade of every sample | B+ or better |
| blockers | 0 on every sample |
| majors in the dosing area (floors, flat stairway, minutes, exercise count, over-cutting, athletic dose) | 0 on every sample |
| the reviewed failures of the brief, each checked by name on each sample | none present: a flat main-day stairway that sets could have avoided; a trained group under 10; a day over the minutes that is not told; more exercises than the cap; a day that lost its pattern (R08-patterns, R01-press); athletic work that drops or is under its scaled budget untold |
| stability | the same grades or better on a second review round after any fix; no sample's `trained_groups` changes between two rounds unless a coach decision changed |

---

## 14. Decisions for the coach

The original defaults remain visible for comparison; they do not bypass the current policy amendment or its implementation gate. The plan must identify unresolved defaults it uses (`meta.planner.defaults_used`).
`tools/planner/decision-table.mjs` re-solves the 8 samples under each alternative and prints one table per decision in the
format of 14.1 (the milp design's D1-D10 table, judge 1 graft 10).

### 14.1 D1, the first table to put in front of him: the 2 x 45 day

Pickleball, 52 years, L1, mild knee pain, Monday knee + pull, Thursday hip + push, one athletic piece and one joint-care
item a day. *Measured* (`spec_checks/graft/run.out.txt`), every plan with 0 violations.

| Reading | Trained directly | Kept at 2 sets | Monday | Thursday | Longest days |
|---|---|---|---|---|---|
| **a. default**: who is trained is decided inside 45; kept movements may use up to 10 % | calves 6 -> 7, hips 10.5 -> 12.5 | step-up, row, chest press | step-up 2 with row 2, hinge 2, leg curl 2, calf raise 3 -> 4 | hinge 3 -> 4 with press 2, leg curl 3 -> 4, calf raise 3 | Mon 45.7 -> 47.5, Thu 43.6 -> 48.5 |
| b. 45 exactly for everything | calves 6 -> 7, hips 10 -> 12 | chest press | hinge 3, leg curl 2 -> 3, calf raise 3 -> 4 | hinge 3 with press 2, leg curl 2 -> 3, calf raise 3 | Mon 43.9, Thu 43.6 |
| c. 45 exactly, the person switches the core opener off | calves 6 -> 8, hips 10.5 -> 13.5 | step-up, row, chest press | step-up 2 with row 2, hinge 3, leg curl 2, calf raise 3 -> 4 | hinge 3 -> 4 with press 2, leg curl 2 -> 4, calf raise 3 -> 4 | Mon 45.0, Thu 44.8 |
| d. no kept movements at all (the worked example of 12 section 5.5) | calves 6 -> 8, hips 10 -> 12 | - | hinge, leg curl, calf raise | hinge, leg curl, calf raise | Mon 43.9, Thu 44.0 |

Reading b is the reviewed blocker "the knee day became a second hinge day"; reading a is the reviewed finding "days over
the minutes", told and offered; reading c is what he asked for in R3-SES-02 and is always printed as a switch.

### 14.2 All decisions

| # | Decision | Default in this spec | What the other choice does (measured where a run exists) |
|---|---|---|---|
| D1 | May kept movements run a full-body day up to 10 % long? | yes (`fit.pattern_factor` 1.10); the overrun is the smallest possible and is told | 14.1. Swimmer 3 x 60 at exactly 60: back 12 -> 14, quads 12 -> 14, calves 9 -> 10 and **no hips** (the hip lifts cannot keep their presses inside 60); default: back 10 -> 12, hips 10.5 -> 12.5, a squat and two presses kept, days up to 61.1 |
| D2 | May the full plan run a little longer day? | yes, 10 % on full-body days, every long day told (`fit.full_plan_factor`) | 1.00: the person gets the keep-time plan and the offer instead |
| D3 | The day limit for who is trained | the chosen minutes (`fit.trained_factor` 1.00) | 1.10: more groups, every day up to 10 % long (the other two designs' samples: 46-49 of 45, 61-65 of 60) |
| D4 | Which fixed blocks are protected, and the order of the room items, per kind of client | 7.3: competitive: the sport's tracks at their smallest dose, athletic extras before the peaks; stay-active: one athletic piece and one joint-care item a day, extras after the peaks | winning design 12.1: a second joint-care item as protected costs the pickleball plan hips |
| D5 | Kept movements: on, and before the peaks? | on; before the peaks; at most 3 chosen ones a week (the partner of a kept work lift is outside that count) | 14.1 d. Swimmer: with the squat and the presses back peaks at 12, without them at 15 (winning design 12.3) |
| D6 | Calves on fewer than four leg days | 3 sets per leg day is the whole rule (floor 3 x leg days, at most 4 a day) | the model's formula (7 with two leg days) or 10 through an optional-day slot (C-04) |
| D7 | One ceiling per FOCUS group or per line | per group; hips takes the larger of its two lines | per line: hips could pass 30 on all days (FM-11, FM-12) |
| D8 | Athletic extras against resistance peaks | competitive athletes: before the peaks, never at the cost of a kept group or a kept movement; everyone else: after | swap the tags of the room items |
| D9 | Exercise count on full-body days | his count by session length + 1, hard (`fit.exercise_margin`) | *measured* on sample 06 at 4 x 75: 9-10 resistance exercises a day with all 8 groups trained; + 0 would cost a group or an exercise; + 2 is the winning design's value; "guide only" removes the row |
| D10 | What "never flat" means, and the stairway order | **Policy resolved by CX-02/03:** occasional same-set weeks with reps/load progression; hold sets at saturation. Display-only progression is insufficient. Exact tier order remains PROPOSED | historical tier comparisons in 7.7 are not new coach approvals |
| D11 | May a trained group keep a lone partner exercise on a day it does not otherwise train? | no ("there's never one exercise") | *measured*: class 4 x 75 trains hips, quads, chest and biceps but not back, because the class squat needs its row on Monday and Monday cannot hold two back exercises beside the quads; with "yes" back would train on Friday and keep the row on Monday |
| D12 | Tests inside the day limit | inside: a timed test replaces its station, room items are skipped that day, a strength test only on a trained lift | outside with a printed warning (today: test days up to 128 %) |
| D13 | The strength rest of athletes' heavy lifts in the last exercise block (O-17) | as the model (4.5 minutes) | *measured*: without it the swimmer trains quads directly as a third group at 3 x 60 |
| D14 | The per-session 11 | 11 where the plan fits, up to 14 when a group needs it, printed | 11 hard: one-day groups (chest on the 2-day template, quads and hips in the class) can never be trained |
| D15 | Lambda above 1 so small lines reach the intended endpoint (C-01) | **Policy resolved by CX-01:** increase faster when needed, including lambda>1; do not finish low solely because of the previous rate limit | exact accelerated integer scheduling remains to be specified and verified; applicable ceilings and other feasibility constraints remain |

---

## 15. Limits, risks, deferred work

### 15.1 Limits of the evidence

- No prototype builds its instances from `model/templates.json` except the template-parametric one, whose search is not
  used here. The instances behind every measured number of the winning design and of this spec are hand-written (three
  samples, one more for this spec) or random.
- The grafts are prototyped as far as the runs of Appendix A need them. Not prototyped: the room ladder as a variable, tests
  inside the day, middle epochs and G7b, the tied-first protocol (the twin run ties them outright), optional-day cells, the
  full-plan branch, "one more day", the conflict explanation, every format handler except the class lifts.
- Samples 02, 03, 05 and 07 have not been run. Sample 06 was run without its optional days.
- No phone was measured. Timings are from one laptop.

### 15.2 Risks

| Risk | Mitigation |
|---|---|
| The search tail on 8 groups x 4-6 days (10.2) | the measures of 10.3 in WP-02 and WP-12; the per-plan cap; the gate; `best_found` instead of a wrong answer |
| S0 is the largest unbuilt piece and touches `week.mjs` | WP-07 and WP-11 first in their lanes; the grid builds every cell in week one of the planner core |
| The hard pairing and never-1 rules can cost a group (D11) or, at exact minutes, a priority group (D1) | both are shown in the decision table with measured examples; both are parameters |
| A wrong pruning row gives a false "does not fit" (it has happened twice in prototypes) | P4: one brute-force test per implied row; rows switchable; the certified grid |
| The time model is not calibrated on real sessions | out of scope here; the planner and the dose at least share it (A12); DR-11 stays open |
| Ten review test files assert patch behaviour | costed as its own work package (WP-21); the gate requires it |

### 15.3 Deferred on purpose, each with the measurement that would reopen it

- **Laterality as a choice of the oracle** (slot variants). Reopen if `staircase-price.mjs` shows the pre-pass costing a
  group on more than 2 % of grid cells.
- **An exercise that enters at an exercise-block start** (T6-CNT-04). Version 1 keeps the structure constant over the block:
  an exercise the peak needs is in from week 1 at 2 sets. A mid-block entry is a + 2 step in one week, which collides with
  "one set a week per group"; it needs the coach's ruling first.
- **Stairway optimal across segments** when there are middle epochs. Reopen if P10 shows avoidable flat weeks.
- **QuickXplain** for the conflict explanation, and **conflict-directed backjumping**, if the gate needs them.

### 15.4 Do not repeat (negative results recorded by the panel)

- An LP or branch-and-bound kernel at run time: 4-26 ms a node, tolerances on the path that decides who is trained, and a
  fallback (HiGHS in a worker) that breaks three binding engine rules (judge 3).
- One weighted objective for a tier: nothing found in 3,001 nodes on a cell that six questions settle in 154 (milp 4.2).
- Generic rounding cuts on the time rows: no reliable gain (milp 5.3).
- The depth-first enumeration over days with a memo as the main search: 27 of 72 real-template cells past 20 s (judge 3).
- A keep test at one "minimum point": false "does not fit" when a third exercise makes a day cheaper (judge 2, D1 of the
  template-parametric design).
- Selection after planning, and a weekly cap taken from week 1: the first reorders the pipeline, the second is conservative
  where the dynamic program on the placed totals is exact (judge 3).
- A hard time row on the day without its kept movements in every tier (run D1-x of Appendix A).

---

## Appendix A. Evidence produced for this spec

All in `design/spec_checks/` (plain JS, Node 22, no dependency; `README.md` there lists the commands).

### A.1 The two repairs (`fix/`)

| Check | Result |
|---|---|
| judge 2's counterexample D1 (a hosted station that credits a higher-priority group) | prototype keeps [g1]; with every later group free it keeps [g0, g1], certificate clean |
| judge 2's counterexample D2 (dips: half a set of own credit) | prototype oracle "no"; rows from the credit table: "fits" |
| oracle against brute force, generator widened to own credit 0 / 2 / 4 q and hosted crediting stations, two seeds | 4,800 questions (1,311 fits, 3,489 no, 0 unknown): 0 verdicts differ, 0 witnesses rejected. The unpatched prototype on the same questions: 48 false "no" |
| keep vector against exhaustive enumeration, one session limit for every group, two seeds | 1,200 of 1,200 equal (unpatched: 72 differ) |
| the three samples | same plans; nodes 130 -> 141, 113 -> 130, 2,166 -> 2,200 |

### A.2 The stairway (`stairway_v2.mjs`)

| Order | Tables | Flat weeks at the arithmetic minimum | Plans with a flat week in the last third | Plans with a group at its peak before week N-1 | Week N-1 rise at most a third of week N | Distance to the planned curve |
|---|---|---|---|---|---|---|
| prototype: last, shape, land, late, flat, hold | 3,891 | 3,356 | 545 | 163 | 52 | 26,923 |
| judge 2: last, flat, hold, late, land, shape | 3,891 | 3,891 | 485 | 94 | 1,035 | 34,051 |
| **spec: last, flat, hold, late, shape, land + final set late** | 3,891 | 3,891 | 485 | 88 | 50 | 30,551 |

The greedy existence test equals the dynamic program on 8,000 of 8,000 verdicts. Of 4,000 random tables, 109 have no
schedule under the 7 % rule and 15 none under 10 %.

### A.3 The grafted rules on the three hard samples (`graft/run.mjs`): 20 plans, 0 violations, 0 unknown, 11 ms to 0.5 s each

| Plan | Trained directly | Kept at 2 sets | Longest day |
|---|---|---|---|
| pickleball 2 x 30 | calves 6 -> 7 | row (Mon), chest press (Thu) | 32.8 |
| pickleball 2 x 45 | 14.1 a | | 48.5 |
| pickleball 2 x 45, D1-x: R-TIME.CORE in every tier (rejected) | calves 6 -> 7, hips 10 -> 12 | row (Mon), chest press (Thu): no knee lift | 47.5 |
| pickleball 2 x 60 | calves 6 -> 8, hips 10 -> 12.25, quads 6 -> 7 | row (Mon), chest press (Thu) | 58.1 |
| pickleball 2 x 75 | calves, hips, quads, back 10 -> 13, chest 10 -> 12 | - | 74.8 |
| pickleball 2 x 90 | + shoulders 11.25 -> 13.75 | - | 89.5 |
| swimmer 3 x 45 | calves 9 -> 10 | deadlift and press (Fri), row (Mon) | 47.7 |
| swimmer 3 x 60 | back 10 -> 12, hips 10.5 -> 12.5 | squat (Mon), press (Wed), press (Fri) | 61.1 |
| swimmer 3 x 60, no late strength rest | back 10 -> 13, hips 10.25 -> 12.5, quads 10 -> 12 | press (Wed), press (Fri) | 58.8 |
| swimmer 3 x 75 | back 10 -> 12, hips 10.5 -> 13.75, quads 10 -> 12, chest 10 -> 12, calves 9 -> 10 | - | 74.3 |
| swimmer 3 x 90 | back 13 -> 19, hips 10.5 -> 15, quads 12 -> 14, chest 10 -> 13, calves 9 -> 11, shoulders 11.25 -> 14.25 | - | 89.7 |
| class 4 x 45 | no plan: the format starts at 60 | | |
| class 4 x 60 | back 12 -> 15 (squat, press, deadlift stay as class lifts) | bench press beside the class deadlift | 58.5 |
| class 4 x 75 | hips 10.75 -> 13, quads 10 -> 12, chest 12 -> 15, biceps 10.5 -> 12.5 (not back: D11) | row beside the class squat | 73.7 |
| class 4 x 90 | hips, quads, back, chest, calves, shoulders, biceps | - | 89.1 |

Against the winning design's own plans: the pickleball Monday is a knee + pull day again; the swimmer has a squat and two
presses, and back peaks at 12 instead of 15 (the squat's minutes; D5); the class plan is unchanged at 60.

### A.4 The first full-size plan (`graft/aesthetics.mjs`): sample 06, 4 x 75, L3, Focus glutes + side delts

| | Result |
|---|---|
| trained directly | all 8: hips 15.25 -> 23.5, shoulders 19.25 -> 28, quads 13 -> 18, back 12 -> 18, chest 12 -> 18, calves 12 -> 14, triceps 12.75 -> 19.75, biceps 14 -> 20.5 |
| weekly total | 98 100 103 105 108 111 115 120 125 130 136 142: no flat week |
| days | 56.0-75.0 minutes, none over 75; 9-10 resistance exercises a day (cap 10) |
| current engine on the same intake (diagnosis 1.5, 1.6) | 16 of 48 main days over 75; 10-12 exercises a day; 7 of 8 groups with a lowered peak |
| cost | 10.2: 61,615 to 758,493 nodes by budget; 20,967 with twins tied; 0 violations in every run |

## Appendix B. Where each graft of the judges landed

| Graft | Judges | Section |
|---|---|---|
| day pattern as a rule (lead station, partner), with its own band | J1-1, J1-9, J2-3 | 4.9, 5.5 R-LEAD / R-PARTNER, 5.6, 7.6 G3; *measured* A.3 |
| kept movements take only the room that is left; room cuts as variables in the cut order, before the stations | J1-11, J2-4 | 5.7 (G2 before G3), 7.3 |
| the band is spent on minimums only; the smallest overrun by bisection | J2-12 | 5.6, 7.6 G3b |
| tests inside the day limit | J1-2, J2-11, J3-6 | 4.9 R-TEST, 5.5 |
| laterality pre-pass; variants and athletic sets as variables | J1-3, J2-10 | 7.2 (variants deferred, 15.3); athletic sets are room items, 7.3 |
| the edit-rule catalogue; the rule catalogue as the single source of rows | J1-4, J3-2, J3-8 | 4.8, 4.9 |
| twin-day tying | J1-5, J2-14, J3-3 | 7.5; *measured* 10.2 |
| one more day is never worse | J1-6, J2-13, J3-5 | 7.10, T5 |
| the progression card | J1-7 | 7.8, 8.4 |
| minimum session length; structural "no" before search; a plan when no group fits | J1-8, J2-6, J3-4 | 7.1, 7.6, 8.2 |
| the template compiler as stage 0 | J2-15, J3-1 | 7.1 |
| every keep question with every later group free; rows from the credit table | J2-1, J2-2 | 7.5, 7.6; *measured* A.1 |
| axial squat and deadlift as a row | J2-3 | 5.5 R-AXIAL |
| epochs from the dominance test | J1-13, J2-5, J3-11 | 5.3, 7.6 G7b |
| stairway order with flat weeks ahead of the curve; the fallback order | J2-7, J2 issue 2 | 7.7; *measured* A.2 |
| "work lift 3 sets from 60 minutes" decided before promising monotonicity | J2 issue 1 | 5.5 R-BOUNDS, T4, 7.6 G7 |
| minimal conflict in rule ids, on demand | J1-12, J2-8, J3-10 | 7.12 |
| the decision table for the coach | J1-10 | 14 |
| the certified grid; the reference model at build time only; a cheap third cross-check | J1-14, J2-9, J2-16, J3-9 | 12.4 |
| shadow mode and the grid habit | J3-12 | 11.2, 12.4 |
| the price of the hard staircase; the negative results | J3-13 | 12.5, 15.4 |
| a custom rule declares its shape and is tested at registration | J3-7 | 7.14 |
| per-plan node cap; generic propagator; named, switchable pruning rows; incremental propagation; the release gate | J3 conditions 1-4, gate | 7.4, 7.5, 10, 13.3 |
| not grafted: any LP kernel at run time; the template-parametric search and its pipeline order; a week-1-based weekly cap | J3 | 15.4 |
