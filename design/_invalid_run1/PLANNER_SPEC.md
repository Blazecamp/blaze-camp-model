# Blaze Camp planner specification (planner/1)

The dosing planner that replaces the volume engine of engine 0.4: who is trained directly, how many sets each week, where each
set goes, how the athletic work shares the minutes, and what the plan says when the time cannot hold everything.

Status: specification, 2026-10-09. Written from `design/diagnosis.md`, `design/algorithm_research.md`,
`design/rules_as_constraints.md` / `.json` (rule ids used below), the three judge files and the measurements in
`design/judge2/`, `design/judge3/` and `design/spec_proto/`. Companion: `design/IMPLEMENTATION_PLAN.md`.
Nothing outside `design/` was written to produce it.

**The three design documents (`design_milp.md`, `design_two-stage.md`, `design_template-parametric.md`) do not exist.** All
three judges scored the briefed angles and all three chose two-stage. So this spec was built from the diagnosis, the research,
the rule inventory and the judge files, and the two claims the judges marked "an argument, not a measurement" were built
and measured for it (section 2.3 and Appendix A). Where the spec fills a gap the coach has not decided, the item is marked
PROPOSED and listed in section 14.

---

## 0. Summary

**What is built.** A two-stage planner, "construct first, prove second":

| Stage | Decides | Method | Guarantee |
|---|---|---|---|
| S0 Candidates | the day grammar: which exercises of which group may sit on which day, in what order, with which pair partner | the coach's templates as data, plus extension candidates of the same group on a day that already trains it | the planner never invents a day and never rearranges one |
| SA Athletic | athletic stations, sets and weekly doses; their minutes per day and week | protected minimum first, scaled targets, whole-number doses that never drop | athletic minutes are inside the capacity before any set is placed |
| S1 Who is trained | the keep vector of R3-SES-02 step 2; then the days and exercise counts of every kept group | exact three-valued oracle on a reduced whole-number model; lexicographic in the coach's keep order | a group is left out only when no plan can train it with every higher-priority group |
| S2 Block table | week-1 and peak sets per group and per day | priority water-filling ladder, evening pass, "keep the level's climb"; an exact leximin improver on the same oracle | every hard row holds at both ends by construction |
| S3 Stairway | which week each added set lands in | exact dynamic program on the placed weeks, then a transportation flow with a unique optimum | step rules hold on the weeks really placed; the result is optimal for the tier order |
| S4 Placement | sets per exercise per day per week | one add sequence per group; week w is a prefix; inside a day the coach's VOL-07 staircase | no exercise ever loses a set; every middle week passes every row without being searched |
| S5 Dose and certify | reps, effort, rest inside the solved sets; supersets needed; the weekly progress cue | one time function shared with the dose; rule catalogue re-evaluated on the finished plan | printed minutes equal planned minutes; no volume changes after S4 |

**Why this shape.** The current engine fails because five greedy stages each decide part of the dose and four places cut for
time (diagnosis RC1-RC11). The planner makes one decision in one place, in the coach's unit (weekly credited sets per FOCUS
group), and each stage hands the next one something that is already legal.

**What was measured for this spec** (`design/spec_proto/`, details in Appendix A):

- The reduced exact oracle gives the same kept groups as an independent LP-based branch and bound on **609 of 609** cells of
  the template grid (family x 2-6 days x 30-120 min x L1-L3), with 0 unknown verdicts. Work per plan: median 80 search nodes,
  99th percentile 14,440, maximum 104,376; CPU median 1.1 ms, maximum 1.3 s. The LP reference needs a median of 34 ms and up
  to 14.5 s.
- With the settings of this spec (exact pair accounting, day limit = the chosen minutes, never one exercise) and a budget of
  20,000 nodes per question: 0 of 2,584 "fits" verdicts are lost; 9 of 1,637 "does not fit" verdicts stay unproven (the group
  is left out either way).
- The whole chain on 594 plans (7,128 plan-weeks): 0 days over the minutes, 0 group-weeks under a floor, 0 over a ceiling, 0
  exercises that lost a set, 0 staircase breaks, 0 step-rule breaks, 0 unknown. CPU median 10 ms, 99th percentile 1.7 s on a
  loaded laptop.
- The stairway scheduler equals a brute-force optimum on 5,788 small plans.

**What the coach must decide** (section 14; each has a default so the build is not blocked): the day limit when the person
keeps their time (default: the chosen minutes, no 10 % band); the hard limit on the weekly total rise (default 7 %); landing
every group in the last week against an even climb in the last weeks (default: even climb); ceilings on credited sets (default)
or on direct sets; one ceiling per FOCUS group (default); what keeps its place ahead of a big mover (default: the approved
profile defaults at their smallest dose); calves on fewer than four leg days (default: 3 sets per leg day is the whole rule);
below-floor training (default: off); the weekly progress cue that makes "never flat" checkable.

**Acceptance** (section 13): 0 hard-row violations on the benchmark; 100 % of trained groups at or above the floor in every
stairway week; every group not trained directly is listed with a reason; 100 % of non-test days within the day limit as
re-costed from the printed doses; flat weeks equal to the scheduler's optimum; the progress cue rises every week for every
trained group; every offer is exact; byte-identical plans in V8 and JavaScriptCore; every sample plan reviewed at B+ or better.

---

## 1. Scope, sources, authority

**In scope.** For every stairway training block: group states, structure (days and exercise counts per group), weekly sets
per slot, superset switches, athletic stations / sets / doses, the time check and its offers, the reasons. For flat blocks
(maintenance, pre-season, taper, in-season, recovery, flat Q1): sets and the time check. For timed circuits, the class model
and conjugate strength days: the format handlers of section 8.13.

**Out of scope** (kept as they are): intake and safety screen, the plan shape (training and exercise blocks, stair level,
planned effort, rep phase, Receive-Create stage per exercise block), exercise selection and variation, the rep / effort /
load text, rendering, i18n. They are touched only where section 12 says so.

**Authority** (when sources differ, the earlier wins): `coach_answers_round3.md` > `coach_answers_round2.md` >
`coach_answers_full.md` > `BLAZE_CAMP_BRAIN.md` v1.2 > `generator_spec_v1.json`, `synthesis/12`, `05`, `06`, `04`, `10`, `11` >
`engine/DECISIONS.md` and `model/rules.json`. Rule ids (`T0-SES-10`, `DEF-09`, `SF-3`, `C-16`, `P-13` ...) are those of
`design/rules_as_constraints.md`. Engine decisions E-11 (below-floor state), E-94 / E-145 (pattern stations) and E-143
(stay-active room cuts) are superseded by sections 5.4 and 8.3.

**Binding engine rules that stay** (`engine/CONTRACTS.md` 1.2-1.3): plain ES modules, Node 22 and browsers, no npm
dependency, no build step, engine files import only engine files, no clock, no randomness, pure functions, every number from
`model/`, every user-facing word an i18n key. This spec adds no runtime dependency. `BigInt` (ES2020) is used in one place
(section 8.9).

---

## 2. The design in one page

### 2.1 Data flow

```
intake -> deriveValues -> buildShape                                   [kept: intake.mjs, shape.mjs]
       -> buildWeekLayout (UNCUT: every template station is a candidate) [week.mjs, cuts removed - section 12]
       -> selectBlock per exercise block (picks for template stations)   [kept: select.mjs]
       -> planBlocks(ctx)                                                [NEW: engine/plan/index.mjs]
            S0  slotgraph: candidates, extension candidates (filled through fillSlot), epochs, whole-number tables
            SA  athletic pre-plan: protected minimum, ladder of levels, minutes per day and week
            S1  keep vector (exact oracle), pattern partners, structure by preference
            S2  ladder -> evening pass -> week 1 -> [leximin improver]
            S3  stairway (dynamic program + transportation)
            S4  add sequences -> sets per slot per week -> supersets needed -> progress cue
            offers and reasons (re-solves at valid intake values)
            certify (catalogue rows on every week)
       -> per week: layoutForWeek, dose (reps / effort / rest from the SAME dose parameters the time function used)
       -> validatePlan (catalogue rows) -> plan/2
```

### 2.2 The four ideas the design rests on

1. **The reduced model.** VOL-07 is a procedure, not a preference (judge 1, A4). Taken as the definition of how a group's
   sets sit on a day, it makes the sets of every exercise a function of one whole number per group-day (SF-3). The unknowns
   of a block are then, per candidate group-day: on / off with an exercise count, sets in week 1, sets in the peak week.
   That is 20-60 whole numbers instead of 130-210 slot variables with on / off links, and every rule is a monotone row
   (section 5).
2. **Two endpoints and prefixes.** Floors, minutes and ceilings are proved on the first and the peak week (and on a few
   more "epoch" vectors when costs change). Every middle week is a prefix of each group's own add sequence, so it lies between
   two proved vectors and passes every monotone row without being searched (sandwich lemma, section 7.1).
3. **Exact where a wrong answer drops a group; constructive where it does not.** "Does this set of groups fit?" is the one
   question whose wrong answer the coach sees as over-cutting. It is answered by an exact oracle with three verdicts. How
   high each group climbs is built by the coach's own procedure (the next set goes to the group that is behind, on the day
   that is behind) and then improved with the same oracle.
4. **Rules on the placed weeks.** Step limits are transitions of the schedule that is really printed, never limits read off
   the planned curve (judge 2, finding 1).

### 2.3 What changed against the research recommendation, and why

| Research (`algorithm_research.md` section 7) | This spec | Evidence |
|---|---|---|
| LP-based branch and bound on slot variables as the runtime oracle | integer-only search on the reduced model at run time; the LP kernel only as a test-time reference | the LP chain leaves 8.8 % of cells unproven at 2,000 nodes and returns no plan in 2 cells (`judge3/tail_summary.out.txt`); one call needs 189,968 nodes (`judge2/heavy_tail.out.txt`). The reduced oracle decides all 609 cells and agrees with the LP reference on every one (`spec_proto/crosscheck.out.txt`) |
| endpoint dosing as a lexicographic MILP (min-max shortfall, then sum) | priority water-filling ladder on relative progress, then an exact leximin improver | the MILP optimum lets shoulders climb 16 -> 24 while chest runs 16 -> 18 (judge 1, section 5); the ladder gives chest 17 -> 22 and shoulders 16 -> 23 on the same case (`spec_proto/examples.out.txt`, P7) |
| stairway as a min-cost flow with capacities from the planned curve | exact dynamic program with the total rule checked on the placed weeks | the flow breaks the 10 % rule in 159 of 20,000 plans and the 7 % rule in 5,025 (`judge2/flow_audit.out.txt`) |
| fixed tier weights 20000 / 10000 / 300 / 100 in the flow | weights computed from the instance; the tier order is data | judge 2, section 3.1 |
| a superset costs x 0.65 | DEF-09 exactly: one shared rest per shared round | optimistic by 0.08-0.34 min per round (`judge2/endpoint_audit.out.txt`) |
| "more minutes never untrains a group" (DR-4) | "the keep vector never gets lexicographically worse" | 5 of 268 steps break the first; 0 of 268 the second (`judge2/keep_sweep.out.txt`) |
| a day that trains a group holds all its template exercises | the exercise count is a decision (2-4, smallest first); extension candidates | with fixed skeletons no set vector exists in 54 of 63 cells (`judge3/link_summary.out.txt`) |
| day limit = chosen minutes x 1.10 | per branch, as data; default 1.00 once the person keeps their time | judge 1 A5; 60 of 204 day-weeks over the chosen minutes in the research cases |

---

## 3. Modules and file ownership

All new code lives in `engine/plan/` (runtime), `tests/plan/` (tests), `tests/reference/` (test-only reference solver) and
`tools/bench/` (the independent scorer). No new file imports anything outside `engine/`. Existing files are changed only in
the integration packages of `IMPLEMENTATION_PLAN.md`.

| File | Owner package | Exports | Job | Tested against |
|---|---|---|---|---|
| `engine/plan/units.mjs` | WP1 | `Q4`, `SEC`, `toQuarter`, `creditVector`, `ratioLess`, `floorDiv`, `ceilDiv` | whole-number units: credit in quarter sets, time in seconds; exact comparisons of ratios by cross-multiplication | unit tests; no float in any exported comparison |
| `engine/plan/timecost.mjs` | WP1 | `setSeconds`, `pairSaving`, `daySeconds`, `fixedSeconds`, `recost` | the one time function (section 6) | the coach's sheet sessions (BYOP day 1: 7 exercises, 19 sets, about 60 min); the capacity table of 12 v1.2 section 3.10; `recost(printed items) == planned` |
| `engine/plan/catalogue.mjs` | WP2 | `ROWS`, `TIERS`, `evaluateRow`, `evaluatePlan` | the rule catalogue: every row of section 5 with id, inventory ids, tier, kind, evaluator on a week of slot sets | one passing and one failing fixture per row |
| `engine/plan/slotgraph.mjs` | WP3 | `buildSlotGraph`, `staircase`, `groupDayTable` | S0: candidates, extension candidates, pair links, epochs, the per group-day tables `x[n]`, `seconds[n]`, `credit[n]` | staircase equals the coach's sequence 2/2/2 -> 3/2/2 -> ... on every prefix; tables monotone |
| `engine/plan/oracle.mjs` | WP4 | `fit`, `certifyWitness`, `ORACLE_VERSION` | the exact three-valued oracle on the reduced model (section 8.2) | brute force on small instances; the LP reference on the template grid (`tests/reference/`); the certified grid |
| `engine/plan/groups.mjs` | WP5 | `selectGroups`, `chooseStructure`, `choosePartners` | S1: keep vector, structure by preference, pattern partners (sections 8.3-8.5) | the coach's worked examples; lexicographic monotonicity in minutes; exhaustive keep vector on small intakes |
| `engine/plan/ladder.mjs` | WP6 | `buildEndpoints`, `eveningPass`, `weekOne`, `leximinImprove` | S2 (sections 8.6-8.8) | never under the oracle's witness; balance band (CF-3); every endpoint row |
| `engine/plan/stairway.mjs` | WP7 | `plannedCurve`, `scheduleStairway` | S3 (section 8.9) | brute force on small plans; certificate; distribution assertions |
| `engine/plan/placement.mjs` | WP8 | `addSequences`, `weeklySets`, `supersetsNeeded`, `progressCues` | S4 and the dose-side outputs (sections 8.10-8.12) | no slot loses a set; every prefix passes every row; staircase and evening on every week |
| `engine/plan/athletic_plan.mjs` | WP9 | `athleticLevels`, `planAthleticBlock` | SA (section 8.1) | every key non-decreasing; share within 5 points; stages only at exercise-block starts; planned >= 90 % of the scaled target |
| `engine/plan/formats.mjs` | WP10 | `planCircuitBlock`, `classSlots`, `conjugateSlots`, `planFlatBlock` | timed circuits, the class model, conjugate days, flat blocks (section 8.13) | circuit seconds by the approved steps; class lifts printed as class lifts; flat blocks never above their source week |
| `engine/plan/offers.mjs` | WP11 | `computeOffers`, `explainUntrained` | R3-SES-02 step 1 and the reasons (sections 9.2-9.3) | every offered schedule, run as an intake, gives exactly what the offer said |
| `engine/plan/index.mjs` | WP12 | `planBlocks`, `planWeeklySetsV1` | orchestration and the adapter with the `VolumePlan` shape | the benchmark; `generateWith` on stubs |
| `tests/reference/*.mjs` | WP4 | - | the research kernel (`kernel`, `lp`, `milp`, `mcf`) and the slot-level reference model, copied from `design/research/` and `design/judge2/` (certified pruning); test-only | its own brute-force harness |
| `tools/bench/score.mjs` | WP13 | - | the independent scorer: reads plan/2 JSON and `design/rules_as_constraints.json`, shares no code with `engine/` | flags the current engine on every failure of diagnosis section 1 |
| `tools/fixture/planner-v1.mjs` | WP0 | - | the amendment layer that adds `rules.planner`, extension buckets and the new i18n keys to the fixture and to `model/` | `check-model` |

Changed existing files and their one owner each: section 12.

---

## 4. Data contracts

Shapes are plain JSON-like objects. Key order in output is the order listed. All times inside the planner are whole seconds;
all credits are quarter sets (1 set = 4).

### 4.1 `PlanCtx` (input of `planBlocks`)

```js
/** @typedef {Object} PlanCtx
 * @property {Derived} derived            // intake.deriveValues (D1-D14), unchanged
 * @property {Shape} shape                // training blocks, exercise blocks, WeekShape per week
 * @property {WeekLayout[]} layouts       // one UNCUT base layout per training block (section 12: week.mjs stops cutting)
 * @property {Selection[]} selections     // picks per exercise block for template stations
 * @property {(slot:SlotDef, weekN:number)=>SlotFill} fillSlot       // picks for extension candidates (cached per exercise block)
 * @property {(slot:SlotDef, fill:SlotFill, week:WeekShape)=>DoseParams} doseParams   // section 6.1 (dose.mjs export)
 * @property {Model} model
 * @property {Object} [edits]             // user edits as constraints (T1-POL-14): blocks off per day, removed / added exercises
 */
```

### 4.2 `SlotGraph` (output of S0, one per stairway block)

```js
/** @typedef {Object} SlotGraph
 * @property {number} trainingBlock  @property {number} N              // stairway weeks
 * @property {string[]} groups                                         // FOCUS groups present, in keep order pi (section 8.3)
 * @property {GroupInfo[]} info                                        // per group, same order
 * @property {PlanDay[]} days                                          // main days first (week order), then optional days
 * @property {Epoch[]} epochs                                          // section 5.3
 * @property {GroupDay[]} groupDays                                    // candidate group-days with one variant per exercise count
 * @property {PairLink[]} pairs
 * @property {FixedItem[]} fixed                                       // warm-up, core, skill, tests, athletic (from SA), prehab, conditioning, aerobic add-ons, class lifts of untrained groups, pattern partners
 */
/** GroupInfo  {group, S4, C4, Ceff4, floor4, minClimb, focus:boolean, pinned:boolean, klass:'big'|'small'|'calves', creditOnly:boolean, pain:boolean}
 *    S4 / C4 = level start / ceiling in quarter sets on the credited tally (section 5.2); Ceff4 = the ceiling this block can plan to
 *  PlanDay    {weekday, kind:'main'|'optional', dayType, fullBody:boolean, limitSec:number[] (per epoch), exerciseBudget:number|null, athleteCap:number|null}
 *  Epoch      {id, weeks:[from,to], exerciseBlock, role:'week1'|'body'|'peak', fixedSec:number[] (per day), costKey}      // section 5.3
 *  GroupDay   {id, group, day, family, K, slots:SlotRef[], lo, hi, x:number[][], sec:number[][] (per epoch), credit:number[][][] (per epoch, per group), rankInFamily}
 *  SlotRef    {slot_id, origin:'template'|'extension'|'bonus'|'focus', fixedSets:number|null, min, max, pairId:string|null, role}
 *  PairLink   {id, day, a:{groupDay family, slotIndex}, b:{...}, restShareSec:number[] (per epoch)}
 *  FixedItem  {slot_id, day, kind, secByWeek:number[], toggle:boolean, protected:boolean}
 */
```

### 4.3 `BlockPlan` (output of S1-S4, one per stairway block)

```js
/** @typedef {Object} BlockPlan
 * @property {number} trainingBlock
 * @property {'full'|'lower_peak'|'fewer_groups'} outcome              // T1-POL-03 / 12 v1.2 3.10.1
 * @property {{factor:number, branch:'full_plan'|'keep_time'}} dayLimit
 * @property {GroupState[]} states
 *    // {group, state:'FULL'|'PATTERN'|'NONE', reason:null|'time'|'template'|'credit_only'|'no_station'|'class_lift'|'not_proven'|'pain',
 *    //  conflict:Conflict|null, creditByWeek4:number[]}
 * @property {Structure[]} structure                                   // {group, days:[{weekday, K, slots:string[]}], why:Why[]}
 * @property {{week1:Object<string,number>, peak:Object<string,number>}} endpoints   // sets per group-day id
 * @property {GroupTable[]} table                                      // {group, direct:number[N], credited4:number[N], main4:number[N], stoppedBy:Why[]}
 * @property {AddStep[][]} sequences                                   // per group: [{week, weekday, slot_id, why}] in the order sets are added
 * @property {Object<string,number>[]} setsBySlotByWeek                // week index -> slot_id -> whole sets
 * @property {SupersetPlan[]} supersets                                // {weekday, pairId, on:boolean, needed:boolean, savedSec:number[N]}
 * @property {number[][]} daySeconds                                   // [day][week], with the pairs that are on
 * @property {ProgressCue[][]} progress                                // [group][week] {dimension:'sets'|'effort'|'reps'|'load'|'start', why}
 * @property {AthleticBlockPlan} athletic                              // section 8.1
 * @property {Offer[]} offers  @property {Issue[]} warnings
 * @property {PlannerAudit} audit
 */
/** PlannerAudit {version:'planner/1', oracle:{calls, nodes, slices, unknown}, tiers:[{tier, status:'proven'|'best_found'|'constructed', value}],
 *                witnessHash, ladderSteps, eveningMoves, exercisesOpened, sessionRelaxed:string[], stairway:{rule, tiers, states, lateFlat, landings},
 *                epochs:number, envelopeBinding:boolean, defaultsUsed:string[] (ids of section 14)} */
```

### 4.4 The adapter: `VolumePlan` stays

`planWeeklySetsV1(ctx)` returns exactly today's `VolumePlan` (`engine/CONTRACTS.md` 4.0): `weeks[]` with `sets_by_slot`,
`added_slots`, `added_fills`, `supersets_on`, `target_by_muscle`, `weekly_sets_by_muscle`, `direct_sets_by_muscle`,
`step_by_muscle`, `total_resistance_sets`, `rise_vs_prev`, `est_minutes`, `changes`, `shortfalls`, `why`; plus `athletic`,
`warnings`, `offers`, `block_targets`, `time_check`. Differences in content, not in shape:

- `added_slots` holds the extension, bonus and Focus candidates that are active; they exist from the first week of the
  block (no exercise appears mid-block; T6-CNT-04, T0-SES-14).
- `target_by_muscle` equals what is placed for every trained line; it is `null` for a group that is not trained directly
  (DR-21: no planned-but-impossible targets).
- `est_minutes` is `daySeconds` rounded up to whole minutes.
- `banks` is `{}`. `shortfalls` is `[]`.
- `time_check` keeps its keys and gains, additively: `outcome`, `day_limit {factor, branch}`,
  `not_trained_directly[].conflict`, `lowered_peak[] = {group, peak, ceiling, stopped_by}`, `planner` (the audit).
  `trained_below_floor` is always `[]` unless the below-floor state is switched on (section 14, CD-8).

`plan/2` and `contracts_version` do not change. New facts go into `time_check`, `why` and `meta.planner`.

### 4.5 `DoseParams` (shared by the time function and the dose)

```js
/** @typedef {{repMin:number, repMax:number, perSide:boolean, holdSec:number|null, restClass:string, restMinSec:number, restMaxSec:number,
 *             timeClass:string, repClass:string}} DoseParams   // a pure function of (slot, pick, week shape, derived, model); never of the sets */
```

`dose.doseItem` must print exactly these values for the same inputs (section 6.1). This closes diagnosis RC9.

---

## 5. The reference model: what a legal plan is

The reference model is stated on whole sets per slot per week. It is the definition the planner, `validate.mjs`, the
test-time reference solver and the benchmark scorer all read (`engine/plan/catalogue.mjs`; RC10). The planner never solves it
in this form; section 5.6 gives the reduced form it solves, and section 7 proves that a reduced solution is a legal plan.

### 5.1 Index sets and variables (one stairway block)

| Symbol | Meaning |
|---|---|
| w = 1..N; e(w) | weeks of the block; the exercise block of week w (`rules.stairway.exercise_blocks_by_N`) |
| d | days: main days (week order), then optional days |
| g, h | FOCUS groups: quads, hips, back, chest, shoulders, biceps, triceps, calves |
| s | candidate slots of a day, in session order; g(s) its group, rank(s) its place among the candidates of (g, d) |
| a[h][s][e] in {0, 1, 2, 4} | quarter-set credit of one set of s to group h in exercise block e (DEF-02 ... DEF-05, DEF-07; a set counts at most 4 to a group) |
| tau[s][e] | seconds of one set of s (work + rest; section 6); constant inside an exercise block |
| state[g] in {FULL, PATTERN, NONE} | section 5.4 |
| K[g][d] | exercises of g on d: 0, or kmin..4 (calves exactly 1). The active slots of (g, d) are its first K candidates. Constant over the block |
| n[s][w] | whole sets of slot s in week w; 0 when s is not active |
| p[P] in {0, 1} | pair P runs as a superset (constant over the block) |

Derived: `Nd[g][d][w]` = sets of g on d; `D[g][w]` = direct sets of g on the main days, `Dall` with the optional days;
`Q[g][w]` = credited quarter sets of g on the main days (every active slot counts with its credit), `Qall` with the optional
days; `Tot[w]` = all resistance sets of the week (constant ones included); `Sec[d][w]` = day seconds (section 6).

### 5.2 One unit of account, two tallies

The unit is the weekly hard set per FOCUS group with exact credit (DR-7). There is no tolerance constant: quarter credits are
whole numbers (x 4), seconds are whole numbers, and every comparison of ratios is done by cross-multiplication.

| Read on the main days (`Q`, `D`) | Read on all days (`Qall`, `Dall`, `Tot`) |
|---|---|
| floor (T2-FLR-01 `counted_on: main_days`), minimum climb (T3-STW-03 "the main days carry the climb") | ceilings, helper spill, the absolute 30, relative progress, the step rules, the weekly total |

**Start and ceiling per group** (credited sets; one pair per FOCUS group, judge 1 A6):

```
line start / ceiling      = volume.computeTargets (DER-01 ... DER-09: level table, modifier, Focus + F, pain, ratios, cycles) - unchanged
S[g], C[g] for a one-line group = its line's start and ceiling
S[hips], C[hips]          = the larger of the hamstrings and glutes line values (a Focus on either line is already in it)   PROPOSED default, CD-5
Ceff[g]                   = max(S[g], min(C[g], floor(S[g] * G(N)), S[g] + N - 1))        // lambda <= lambda_max = 1 (C-01, P-09); one set a week
calves                    = structural: 3 sets per leg day at the start, at most `per_leg_day_max` (4) per leg day; athletes start + 2 (T5-CAP-02)
credit-only lines         = never FULL unless picked as a Focus (T2-FLR-04); listed with reason credit_only
pain-reduced groups       = start x pain factor, not floored (DER-06); minimum climb 1; the plan keeps them when they fit and lists reason pain otherwise
```

`G(N)` is read from `rules.stairway.by_N[N].growth` as a whole number of ten-thousandths.

**Relative progress** of a trained group, the quantity S2 balances: `rho[g] = (Qall[g][N] - 4 S[g]) / (4 Ceff[g] - 4 S[g])`
(when `Ceff = S` the denominator is taken as 4). Two values are compared by cross-multiplication. "One step" of g is one own set.

### 5.3 Epochs: where the minutes are checked

Per-set seconds change only at exercise-block starts (new picks, laterality share, rep phase). Fixed and athletic seconds
change by week (tests in week 1 and week N, Olympic sets and WOD minutes climbing). The block is cut into **epochs**; each epoch
has one cost table, the largest fixed seconds of its weeks, and one set vector that dominates every week in it:

| Epoch | Weeks | Set vector checked | Fixed seconds |
|---|---|---|---|
| `week1` | 1 | `x1` (the week-1 vector) | week 1 (baseline tests) |
| `body(e)` for each exercise block e | the weeks of e except 1 and N | `xN` (planner/1). The exact vector is the **envelope** `env(e)`: for every group the prefix of its add sequence of length `min(u[g], lastWeek(e) - 1)`, `u[g] = D[g][N] - D[g][1]` | the largest of those weeks |
| `peak` | N | `xN` | week N (end tests) |

Every week of an epoch lies under the epoch's vector (ROW.MONO), so the sandwich lemma applies (7.1). A `body` epoch whose cost
table is nowhere costlier than the peak's and whose fixed seconds are not larger is implied by the peak row and dropped; that
is the usual case (later exercise blocks cost at least as much: more single-leg work for field athletes, strength rests in
the last block, more Olympic sets). Where an earlier exercise block is costlier (bodybuilders and powerlifters: 50 % two-leg work
in block 1, 90 % in block 3), checking it on `xN` is safe and slightly conservative: the audit records `envelopeBinding` and
the benchmark counts it. Checking on `env(e)` instead is the exact refinement (a group adds at most one set a week, so in week
w it has added at most `min(u[g], w - 1)` sets); it is left for planner/1.1 because the envelope depends on week 1, which is
chosen after the peak. On a 12-week plan 2 to 5 epochs remain. The floor is checked on `x1` under the credits of **every**
exercise block (credits can change with the picks).

### 5.4 Group states (judge 1, A3)

| State | Meaning | Rows |
|---|---|---|
| FULL | trained directly | ROW.FLOOR, ROW.CLIMB, ROW.COUNT on every day it trains, ROW.CEIL |
| PATTERN | not trained directly; exactly one exercise of it stays as the **pair partner** of a kept group's lower work lift (the hinge keeps its push, the squat keeps its pull; UNI-11), 2 sets every week, at most `pattern_partner.max_per_week` (3) such exercises a week. Listed as "not trained directly", its credit shown | ROW.PARTNER; no floor, no climb, exempt from ROW.COUNT |
| NONE | compound credit only | listed with its reason and credit (ROW.LIST) |

There is no below-floor state (the outcome R3-SES-02 rejects; FM-02). The class model's lifts of groups that are not trained
are fixed items printed as class lifts (section 8.13), never as a state. If the coach approves a below-floor state it returns as
a named parameter (CD-8), not as an exemption.

### 5.5 The rows

Kind H = hard (feasibility). "Where" names the stage that makes the row true by construction; every row is also an evaluator
in the catalogue and is re-checked on the finished plan (S5) and by the independent scorer.

| Row | Inventory ids | Statement | Where |
|---|---|---|---|
| ROW.BOUNDS | T0-SES-15, T6-CNT-06 | an active slot holds `min[s] <= n[s][w] <= max[s]` (2 to 4 at L1, 5 at L2-L3, isolation 4, calf 3-4, a fixed-dose slot its dose); an inactive slot 0 | S0 tables |
| ROW.COUNT | T0-SES-10, T1-POL-09, T6-CNT-02 | `K[g][d]` is 0 or 2..4 for a FULL group on a main day; calves 1; an optional-day bonus or Focus slot 1-2; conjugate and circuit days as written; never 1 otherwise | structure domain (S1) |
| ROW.CALF | T0-SES-11, T2-FLR-02 | calves FULL: exactly one calf exercise with 3+ sets on every leg day (a main day where quads or hips are FULL), none on other main days, never a second one | S1 implication rows |
| ROW.STAIRCASE | T7-PLC-01 (VOL-07), SF-3 | for every active (g, d) and week: the sets of its exercises are `St(Nd[g][d][w])`, the coach's staircase (section 8.0) | S0 tables |
| ROW.EVEN | T7-PLC-02 (R3-VOL-03), T7-WEEK-02 | at week 1 and at the peak no **admissible evening move** exists (moving one set of a group from a day to another day of the same group that has fewer added sets, or to an earlier day with equally many minus one, while every other row still holds); every middle week is a prefix of the canonical add sequence | S2 evening pass, S4 |
| ROW.MONO | T3-STW-01, T0-SES-14, T3-STW-08 | `n[s][w] >= n[s][w-1]`; the active slots and their exercises are constant inside an exercise block; the stairway does not restart at an exercise-block start | S4 prefixes |
| ROW.FLOOR | T2-FLR-01, T2-FLR-04, T1-POL-01 a | FULL g, every week: `Q[g][w] >= 4 F[g]` (F = `rules.volume.floor.value`, 10) | S1 (on `x1`, every credit table), then monotone |
| ROW.CLIMB | T3-STW-02, T1-POL-01 c, T1-POL-12 | FULL g: `D[g][N] - D[g][1] >= mc[g]` (2; calves 1; 1 when N <= 7; pain 1) | S1, S2 |
| ROW.TIME | T1-POL-02, T4-TIME-01, DEF-09, UNI-09 | `Sec[d][w] <= limit[d][w]` = chosen minutes x 60 x the branch factor (+ the test allowance in test weeks); with the pairs that are switched on | S1 and S2 on every epoch, then monotone |
| ROW.SESSION | T5-CAP-05 | per day and group: credited quarter sets of the day `<= 44` (Focus 56); in the second ladder pass 56 for a group that could not otherwise go on | S1, S2 |
| ROW.CEIL | T5-CAP-01, T5-CAP-02, T5-CAP-06 | `Dall[g][w] <= C[g]`; an own set is added only while `Qall[g] + 4 <= 4 Ceff[g]`; no added set may lift another trained group above `4 C + spill` (spill = 4 quarter sets) | S2 |
| ROW.ABS30 | T5-CAP-03 | `Qall[g][w] <= 120` (30 sets; Pro setting excepted) | S2 |
| ROW.STEP.G | T0-STW-02, T0-STW-03 | `Dall[g][w] - Dall[g][w-1]` is 0 or 1 | S3 |
| ROW.STEP.C | T0-STW-03 (helper slack) | `Qall[g][w] - Qall[g][w-1] <= max(4, floor(7 % of last week)) + inflow[g]`, inflow = the largest helper credit the other trained groups can give g in one set each (2 quarter sets in every plan without a thruster or dips as a group exercise) | follows from ROW.STEP.G; re-checked |
| ROW.STEP.T | T0-STW-03, LK08 | rule 7 (default): `Tot[w] - Tot[w-1] <= max(1, floor(7 Tot[w-1] / 100))`. Rule 10: `10 Tot[w] - 11 Tot[w-1] <= -1`, or one set | S3 transitions |
| ROW.LAST | T3-STW-04 | `Tot[N]` is the largest week; with N = 12 every week 9-12 is at least every week 1-8 | follows from ROW.MONO; re-checked |
| ROW.ATHLETE12 | T0-SES-13, T6-CNT-07 | field athletes: counted exercises of a day `<= 12`, the athletic split inside it | S1 packing row; SA |
| ROW.EXBUDGET | T6-CNT-01 (VOL-08) | resistance exercises of a full-body day `<= cap(minutes) + full_body_margin` (PROPOSED hard, margin 2; CD-9). Split days: soft, as today | S1 packing row |
| ROW.STRUCT | T0-SES-14, T6-CNT-04, T6-CNT-05, T7-PLC-03, T7-PLC-04 | the active slots of the block are fixed from its first week (an extension, bonus or Focus exercise opens at 2 sets in week 1 of the block, never mid-block); optional days carry only Focus-group slots (at most 2, 2-3 sets), one bonus exercise of a small group (2-3 sets) and the calf slot when enabled; a big group that is not a Focus does not train on the optional day | S0 domain, S1 |
| ROW.PARTNER | T1-POL-07 as narrowed by judge 1 A3 | a PATTERN exercise is the template pair partner of a kept lower work lift, 2 sets, constant, supersetted with it | S1 (section 8.5) |
| ROW.PAIR | T0-SES-16, T0-SES-08 | a superset is a template pair link whose two exercises are both active; never two lower compounds | S0 |
| ROW.GRAMMAR | T0-SES-03 ... T0-SES-09, T0-SES-12, T0-SES-17 | block order, power before strength, horizontal before vertical, the work first, hip + push and knee + pull, two spine days, a rear-delt exercise while shoulders are trained, day spacing | template grammar, selection, the ordering pass of `week.mjs`; the planner only switches candidates on and off |
| ROW.ATH.* | T0-ATH-01 ... 05, T3-ATH-01, T5-ATH-01 | section 8.1 | SA |
| ROW.TEST | T0-TST-01 | tests in week 1 and week N only; a strength test replaces one planned set | shape, epochs |
| ROW.FLAT | T0-STW-01, T0-STW-04, DER-10 | flat blocks hold their sets; no deload inside a block | section 8.13 |
| ROW.OUT.* | T0-SYS-01, T0-SYS-03, T1-POL-04, T1-POL-10, T1-POL-11, T1-POL-14 | determinism; a reason on every decision; offers before the plan; every untrained group listed with its credit; superset recommendations with "needed"; edits as constraints | S5, offers |

Soft items of the inventory that are **not** rows of the planner, and where they live: T3-ATH-02 (plyometric share, target of
SA); T7-PLC-05 and T8-BAL-01 / 02 (laterality share: chosen with the picks before S1, because it sets the time classes; a
two-sided ratio cannot be a hard row on sets - section 7.6); T7-ORD-01 ... 03 (ordering pass); T7-PAIR-01 / 02 (template
grammar); T8-BAL-03 ... 05 and T8-VAR-01 ... 05 (selection).

### 5.6 The objective: tiers as data

Lexicographic. A lower tier never changes a higher tier's result. The list is `rules.planner.tiers` with these ids.

| Tier | Inventory ids | Goal | Solved by |
|---|---|---|---|
| G1 keep | T1-POL-03, T1-POL-05 | the keep vector in the keep order pi: FULL before not FULL, group by group | exact oracle (8.2, 8.3) |
| G2 structure | T2-FLR-06, SF-9, T7-WEEK-01, T6-CNT-03 | per kept group in keep order: (a) week 1 can start at the level start, (b) more exposure days, (c) fewer exercises, (d) earlier days | oracle with pins (8.4) |
| G3 partners | T1-POL-07 | pattern partners, in the keep order of their work lifts, while G1 and G2 stay | oracle with fixed items (8.5) |
| G4a athletic first | T1-POL-13, T5-ATH-02 | competitive athletes only: the highest athletic level that keeps G1-G3 | 8.1 |
| G5 attainment | T5-CAP-04, T8-BAL-04, T3-STW-09 | leximin of `rho` over the trained groups (the smallest first, then the next); ties in the keep order | ladder (8.6), improver (8.7) |
| G4b athletic after | T5-ATH-02 | everyone else: the highest athletic level that changes no resistance set | 8.1 |
| G6 start | T3-STW-08, DER-01, 12 v1.2 3.10.1 | week 1 at `peak - (Ceff - S)`, never under the floor, never above the level start | closed form (8.8) |
| G7 stairway | T3-STW-03 ... 07 | in this order: no flat week in the last third (the last week first); the weekly total close to the planned 3 % / 5 % curve; most groups stepping onto their peak in the last week; fewest flat weeks; fewest back-to-back flat weeks | dynamic program (8.9) |
| G8 who steps when | T3-STW-07 | each set as near as possible to the week its own planned curve reaches it; one canonical tie-break key | transportation (8.9) |
| G9 supersets | T7-PAIR-03, T1-POL-11 | fewest pairs switched on per day while every epoch holds | 8.11 |

Nothing that rewards less volume sits above G5 (inventory section 3, reading 6): G9 is last.

---

## 6. The time function

One function, in whole seconds, used by S1-S4, by `dose.mjs`, by `validate.mjs` and re-implemented by the scorer from this text.

### 6.1 One set

```
DoseParams p = doseParams(slot, pick, weekShape, derived, model)        // rep bracket, per-side, hold, rest class and range, time class
sides        = p.perSide ? 2 : 1
work(p)      = p.holdSec != null ? p.holdSec * sides
             : max( WORK[p.timeClass], ceil( (p.repMin + p.repMax) * sides * SEC_PER_REP / 2 ) )
rest(p)      = REST[p.restClass]                                         // the midpoint of the printed rest range
tau          = work + rest
```

`WORK` and `REST` are `rules.time_model.work_minutes` and `rest_class_minutes` x 60 (45 / 90 / 36 / 72 s of work; 90 / 75 /
270 s of rest ...). `SEC_PER_REP` is new: `rules.time_model.sec_per_rep` = 3 (PROPOSED). The `max` leaves ordinary sets at
today's constants and charges long per-side sets honestly (a 15-20 reps per side curl: 105 s of work, not 72; diagnosis 1.5).
`doseParams` is a pure function that never reads the sets, and `doseItem` prints the same bracket and rest: the plan's minutes
are the minutes of what is printed (DR-11).

### 6.2 An exercise, a pair, a day

```
straight exercise, n sets      n * tau + CHANGE                                        CHANGE = 60 s
pair (a, b) switched on        na * tau_a + nb * tau_b - min(na, nb) * min(rest_a, rest_b) + 2 * CHANGE_PAIR     CHANGE_PAIR = 30 s
day                            fixed(d, w) + athletic(d, w) + sum of its exercises and pairs
est_minutes                    ceil(daySeconds / 60)
```

The pair formula is DEF-09 exactly: in every round both partners still have, the pair works back to back and rests once (the
longer rest); a partner's extra sets are straight sets. `fixed(d, w)` holds the warm-up, the core opener, skill, tests,
joint care, conditioning, the WOD of that week, circuits and counted aerobic add-ons with today's constants
(`week.estimateMinutes`), in seconds; `athletic(d, w)` comes from SA. A block the person switched off (T1-POL-14) costs 0.

**Monotone.** `daySeconds` never decreases when any set count grows: one more set of a adds `tau_a` and gives back at most
`min(rest_a, rest_b) <= rest_a < tau_a`. Section 7 relies on this.

### 6.3 The day limit

`limit[d][w] = 60 * minutes * factor(branch, day) + testAllowance(d, w)`.

| Parameter | Default | Source |
|---|---|---|
| `rules.planner.fit.full_plan.full_body` | 1.10 | R2-SES-05 "it might be a little longer day"; judge 1 A5 |
| `rules.planner.fit.full_plan.split` | 1.00 | `long_day.split_day_factor` |
| `rules.planner.fit.keep_time` | 1.00 | R3-SES-02 "if they keep their time"; judge 1 A5 (PROPOSED, CD-1) |
| `rules.planner.fit.test_days` | `outside_warn`: the test seconds are allowed on top and the day carries `warning.test_day_long` | T4-TIME-01 today (CD-4: `inside` makes tests part of the limit) |

The **full-plan branch** applies only when every template group is FULL and reaches `Ceff` under it (outcome `full`).
Otherwise the person "keeps their time" and the keep-time factor applies to everything that is printed.

---

## 7. Why the construction is legal (the guarantees, with their hypotheses)

Every false claim found by the rigor judge came from a hypothesis nobody wrote down. These are the ones the planner depends on.

### 7.1 Sandwich lemma

Fix a stairway block. Let the active slots be fixed (H1), let `x1 <= xw <= envelope of its epoch <= xN` hold slot by slot for
every week w (H2), and let each epoch's fixed seconds be the largest of its weeks (H3). Then every week satisfies

- every **packing** row whose left side never decreases in any set count, because the row holds for the epoch vector: ROW.TIME
  (6.2), ROW.SESSION, ROW.CEIL, ROW.ABS30, ROW.EXBUDGET, ROW.ATHLETE12;
- every **covering** row whose left side never decreases, because it holds at `x1`: ROW.FLOOR.

H1 holds because the structure is fixed for the block (ROW.STRUCT). H2 holds because every week is a prefix of each group's
add sequence and the staircase is monotone (7.2). H3 is the definition of an epoch (5.3). Not covered by the lemma, and handled
elsewhere: the shape rows (7.2), the step rules (7.3), two-sided rows (7.6).

### 7.2 Staircase lemma

For a group-day with K active exercises the staircase `St(n)` (8.0) is defined for every total n in a contiguous range
`[lo, hi]` and `St(n) <= St(n + 1)` slot by slot. So "add one set to a group-day" is always a legal move while `n < hi`,
whatever the other group-days hold: the shape rows live inside one group-day and nothing else reads them. This is the chain
lemma of judge 2 (section 5.2) in the special case the planner uses; no placement step can get stuck on a shape row.

### 7.3 Stairway theorem (Gale 1957, Ryser 1957)

Groups add `u[g]` sets in weeks 2..N, at most one a week. A sequence of weekly rises `R[2..N]` with `sum R = sum u` can be
shared out among the groups if and only if taking each week's `R[w]` sets from the `R[w]` groups with the most sets left never
fails. Hence a dynamic program over (week, sorted vector of sets left) visits exactly the realizable total paths, and the total
rule can be checked in each transition on the true total of the week before. Who steps when is then a transportation problem
with fixed column sums: totally unimodular, integral. What the endpoint stage owes the scheduler: `u[g] <= N - 1` and
`D[g][N] <= floor(D[g][1] * G(N))` (8.8). If the total rule still leaves no schedule (very small plans), one deterministic cut
applies (8.9); it is never a repair loop.

### 7.4 Closures are permanent

In an add-only construction, if adding one set of g to day d breaks a packing row now, it breaks it at every later point:
the row's left side never decreases (6.2). So a day that is "full for g" stays full, the ladder never has to revisit a
refusal, and its result satisfies ROW.EVEN up to the moves the evening pass then makes.

### 7.5 Evening pass terminates

Each evening move lowers the pair (sum over group-days of added sets squared, sum of added sets x day position)
lexicographically. Both are bounded below. The pass ends at a vector with no admissible move, which is ROW.EVEN.

### 7.6 What is not monotone

A two-sided ratio is not preserved between two endpoints (judge 2, H6: a bilateral share of 0.80 +/- 0.03 holds at 8 + 2 and at
12 + 3 sets and at no vector with 12 sets in between). So the laterality share is fixed by the picks of each exercise block
before S1, measured as a soft metric, and never a row on sets.

### 7.7 Exactness of the oracle

The oracle of 8.2 answers a question about the reduced model: integers `n1 <= nN` per candidate group-day variant, at most one
variant per group-day, the rows of 5.5 that S1 owns. Its "fits" comes with a witness that an independent evaluator re-checks.
Its "does not fit" is the exhaustion of a search whose every pruning step is a whole-number inequality valid for all
completions (bounds propagation on monotone rows, the day-subset cut of 8.2.3, the dominance row of 8.2.2). Two things make the
reduced model equal to the reference model for this question: the staircase is the only legal shape (ROW.STAIRCASE), and the
evening rows are not part of the question (if any plan exists, the evening pass turns it into one that satisfies ROW.EVEN, or
leaves the split as it is where a move would break a row; 7.5).

### 7.8 Monotonicity that is true

Let `F(m)` be the set of legal plans at session length m. If `F(m)` is contained in `F(m')` for `m <= m'`, the best keep
vector at m' is lexicographically at least the one at m. The hypothesis is a modelling duty and holds here: a longer session
only raises limits; every station that appears from a given length is a candidate that may stay off; the athletic protected
minimum does not grow with the minutes. Set inclusion of the kept groups does **not** follow (a higher-priority group that
newly fits may push out a lower one), so an offer states what it adds and what it trades (9.2). For one more day the hypothesis
can fail (another template), so that offer is shown only when its keep vector is better.

---
