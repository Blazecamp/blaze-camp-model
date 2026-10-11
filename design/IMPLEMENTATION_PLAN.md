# Blaze Camp planner: implementation plan (planner/1)

> **2026-10-10 controlling update:** [COACH-CX CX-01..04](../coach_answers_codex_2026-10-10.md) changes endpoint priority, same-set progression, at-cap behavior and editability. Read [PLANNER_SPEC.md](PLANNER_SPEC.md), [PROGRESSION_MATH.md](PROGRESSION_MATH.md), and [PROGRESSION_VERIFICATION.md](PROGRESSION_VERIFICATION.md). The isolated progression references and independent focused suites are implemented and passing; the production planner packages below are not thereby complete. Remaining blockers are the actual-credit endpoint oracle, full inherited cost-envelope certification, integrated validation, and a resolved or honestly limited T3 optimizer. The workflow must stop at preflight while `rules_as_constraints.json > policy_amendment.implementation_ready` is false. Default-engine promotion also requires explicit approval after technical and coaching gates; there is no automatic switch or guaranteed resume after a usage reset.

Ordered work packages for a multi-agent build of `design/PLANNER_SPEC.md`. Written 2026-10-10. Section numbers such as
"spec 7.5" point into that file. The full planner is not built. Current preparatory references are `design/progression/stairway.mjs` and `prescription.mjs`, with independent tests under `tests/progression/`; no default-engine migration is part of that preparation.

---

## 0. Summary

- **22 work packages** (WP-00 ... WP-21) in **five phases**. Inside a phase the packages run in parallel; a package starts
  when the packages it depends on are merged.
- **One owner per file.** Section 2 lists every file the build touches with its single owning package. An agent writes only
  the files its package owns. A need in another package's file goes to `engine/CONTRACT_REQUESTS.md` (append-only, as today)
  and is resolved by that file's owner.
- **The old engine stays the default until the gate.** `rules.planner.engine = "v04"` until every item of spec 13.3 passes.
  After every merge `node --test tests/` is green with that default and the 8 sample plans are byte-identical to before.
- **Each slice is scored before the next** on the benchmark of `design/bench/` in shadow mode (section 4).
- **Three things come first because everything hangs on them:** the contracts and the model data (WP-00), the generic
  search with its brute-force fuzz (WP-02), and the uncut layout (WP-07), which is the largest change to existing code.
- **Open decisions:** the coach's D1, D4 and D13 (spec 14), and the maintainers' M-1 ... M-4 (section 5), are not silently approved by CX. A future shadow build can use only explicitly declared provisional policies after readiness is reconciled; default promotion needs the separate approvals and gates.

---

## 1. Order of work

```
Phase 0  foundation            WP-00 contracts, model data, scaffolding
                                 |
Phase 1  pure pieces           WP-01 units, time function, staircase     WP-02 generic search (fd)      WP-03 stairway
(parallel)                     WP-04 rule catalogue + certifier          WP-05 reference model (tools)  WP-06 benchmark wiring
                                 |
Phase 2  seams in kept code    WP-07 uncut layout + template notes       WP-08 selection + laterality
(parallel, start with phase 1) WP-09 dose parameters + progression card  WP-10 athletic plan + room ladder
                                 |
Phase 3  planner core          WP-12 oracle (after 01, 02, 04)           WP-14 placement (after 01, 03, 04)
                               WP-11 grammar builder (after 01, 04, 07, 08, 09, 10)
                               WP-13 the tiers (after 12, 03)            WP-15 formats (after 11, 13, 14)
                                 |
Phase 4  integration           WP-16 planner chain, adapter, generate switch (after 11, 13, 14)
                               WP-17 offers + decision table (after 16)  WP-18 conflicts in rule ids (after 12, 13)
                               WP-19 validate, render, words (after 04, 16)
                               WP-20 grid, certification, timing, gate (after 05, 16)
                               WP-21 migration clean-up (after the gate)
```

The longest chain is 00 -> 07 -> 11 -> 16 -> 20 -> 21. WP-12 and WP-13 do not wait for the grammar builder: they are built and
tested on generated instances (`tests/helpers/plan-gen.mjs`), which is how the prototype's oracle was tested.

| Phase | Packages | Can start when | Size |
|---|---|---|---|
| 0 | WP-00 | after the current readiness blockers are resolved and preflight passes | M |
| 1 | WP-01, 02, 03, 04, 05, 06 | WP-00 merged | S, L, M, M, M, S |
| 2 | WP-07, 08, 09, 10 | WP-00 merged | L, M, S, M |
| 3 | WP-11, 12, 13, 14, 15 | their dependencies | L, L, L, M, M |
| 4 | WP-16, 17, 18, 19, 20, 21 | their dependencies | L, M, S, M, L, L |

Size: S = a few hundred lines with tests, M = up to about a thousand, L = more, or risky because it changes kept code.

---

## 2. File ownership (every file once)

### 2.1 New files

| File | Owner |
|---|---|
| `engine/plan/types.mjs` | WP-00 |
| `engine/plan/units.mjs`, `timecost.mjs`, `staircase.mjs` | WP-01 |
| `engine/plan/fd.mjs` | WP-02 |
| `engine/plan/stairway.mjs` | WP-03 |
| `engine/plan/catalogue.mjs`, `certify.mjs` | WP-04 |
| `engine/plan/laterality.mjs` | WP-08 |
| `engine/plan/athletic_plan.mjs` | WP-10 |
| `engine/plan/grammar.mjs` | WP-11 |
| `engine/plan/oracle.mjs` | WP-12 |
| `engine/plan/table.mjs` | WP-13 |
| `engine/plan/placement.mjs` | WP-14 |
| `engine/plan/formats.mjs` | WP-15 |
| `engine/plan/planner.mjs` | WP-16 |
| `engine/plan/offers.mjs` | WP-17 |
| `engine/plan/conflict.mjs` | WP-18 |
| `tools/fixture/planner-rules.mjs` | WP-00 |
| `tools/fixture/planner-templates.mjs` | WP-07 (WP-00 creates it as an identity stub and wires it) |
| `tools/fixture/planner-words.mjs` | WP-19 (WP-00 creates it as an empty stub and wires it) |
| `tools/planner/ref/model.mjs`, `ref/search.mjs`, `ref/README.md` | WP-05 |
| `tools/planner/score-all.mjs`, `sweep.mjs` | WP-06 |
| `tools/planner/bench-fd.mjs` | WP-02 |
| `tools/planner/shadow.mjs` | WP-16 |
| `tools/planner/reschedule.mjs` | WP-14 |
| `tools/planner/decision-table.mjs` | WP-17 |
| `tools/planner/grid.mjs`, `certify-grid.mjs`, `bench-time.mjs`, `staircase-price.mjs` | WP-20 |
| `tests/helpers/plan-gen.mjs`, `tests/plan/contracts.test.mjs` | WP-00 |
| `tests/plan/<module>.test.mjs` | the module's owner (names in section 3) |
| `tests/golden/planner-stairway.json` | WP-03 |
| `tests/golden/planner-instances/*.json` | WP-11 |
| `tests/golden/planner-plans/*.json` | WP-13 |
| `tests/golden/planner-grid.json` | WP-20 |
| `tests/plan/fixtures/<package>/*` (saved instances, plans, breaking weeks) | the package named in the path |

### 2.2 Existing files that change

| File | Owner | Other packages that need something in it |
|---|---|---|
| `engine/CONTRACTS.md`, `engine/DECISIONS.md`, `engine/util.mjs`, `engine/model.mjs`, `engine/version.mjs` | WP-00 | all, through `CONTRACT_REQUESTS.md` |
| `tools/fixture/build-fixture.mjs`, `tools/compile-model.mjs`, `tools/compile/i18n.mjs`, `tools/check-model.mjs`, `tools/fixture/check-fixture.mjs` (wiring lines only) | WP-00 | WP-07, WP-19 |
| `engine/timefit.mjs` | WP-01 | - |
| `engine/week.mjs`, `tests/week.test.mjs` | WP-07 | WP-10 (station building leaves `week.mjs`: request), WP-11 |
| `engine/select.mjs`, `tests/select.test.mjs` | WP-08 | WP-11 |
| `engine/dose.mjs`, `tests/dose.test.mjs` | WP-09 | WP-01 (reads `doseParams`), WP-14 (progression facts) |
| `engine/athletic.mjs`, `engine/budget.mjs` | WP-10 | WP-16 |
| `engine/volume.mjs`, `engine/generate.mjs`, `tests/volume.test.mjs`, `tests/generate.test.mjs`, `tests/determinism.test.mjs` | WP-16 | WP-17, WP-19 |
| `engine/validate.mjs`, `engine/render.mjs`, `engine/explain.mjs`, `tests/validate.test.mjs`, `tests/render.test.mjs`, `tests/explain.test.mjs`, `tests/i18n.test.mjs` | WP-19 | WP-09 (card lines), WP-17 |
| `tests/compile.test.mjs`, `tests/model.test.mjs` | WP-00 | - |
| `tests/review-*.test.mjs` (10 files), `tests/invariants/invariants.test.mjs`, `tools/generate-samples.mjs`, `tools/sweep.mjs`, `samples/`, `engine/README.md`, `docs/` | WP-21 | - |
| `engine/intake.mjs`, `engine/shape.mjs`, `tests/intake.test.mjs`, `tests/shape.test.mjs` | nobody: unchanged | - |
| `engine/CONTRACT_REQUESTS.md` | shared, append-only, as today (`CONTRACTS.md` 1.1): the one file every package may add lines to | all |

Hand-over rule for WP-21: it deletes old code in `volume.mjs`, `week.mjs` and `athletic.mjs` only after WP-16, WP-07 and
WP-10 are closed and the gate has passed; from that moment those files are WP-21's.

---

## 3. Work packages

Every package: (a) writes only its files; (b) adds the tests named here, each with a sound generator
(`tests/helpers/plan-gen.mjs`: `Math.imul`-based, the drawn distribution printed and asserted); (c) keeps
`node --test tests/` green with `rules.planner.engine = "v04"`; (d) follows `engine/CONTRACTS.md` 1.2 and 1.3 (plain ES
modules, no dependency, no clock, no randomness, JSDoc on every export); (e) names the rule id (spec 5.5) or the spec
section in every test title.

### WP-00 Contracts, model data, scaffolding

- **Goal.** Everything the other packages import or read, so they can start in parallel.
- **Depends on.** Nothing.
- **Delivers.**
  - `engine/plan/types.mjs`: the typedefs of spec 4.1-4.4.
  - `CONTRACTS.md`: `engine/plan/` allowed (1.1, 1.2); the new `plan/2` fields (spec 4.6); the planner module signatures.
    `DECISIONS.md`: a section "planner/1" with one entry per default of spec 14 and per retirement of spec 11.4.
  - `tools/fixture/planner-rules.mjs`: `rules.planner` exactly as spec 4.7, the catalogue entries of spec 5.5 (id,
    inventory ids, refs, tier, kind, shape, scope, params, why key, status) and the edit rules of spec 4.9; wired into
    both builds. Stubs for `planner-templates.mjs` and `planner-words.mjs`, wired.
  - `model.mjs`: `model.planner()` accessor with defaults; `version.mjs`: 0.5.0-dev.
  - `tests/helpers/plan-gen.mjs`: `rng(seed)`; `randomInstance(opts)` (2-8 groups, 1-6 days, pairs, stations of the three
    kinds with hosts, partner rules, fixed mates, class credit, strength rests, own credit drawn from 0 / 2 / 4 q, room
    items, twins, middle epochs, tests on z); `randomTable(opts)`; `bruteForce(instance, question)` over the certifier's
    evaluators (injected, so the helper has no planner import).
- **Tests to add.** `tests/plan/contracts.test.mjs`: `rules.planner` present and deep-equal in fixture and model; every
  catalogue entry has a known shape and existing parameter paths; every `why` key exists in EN and ES or is listed for
  WP-19; `plan-gen` draws every feature (distribution assertions). `tests/compile.test.mjs`, `tests/model.test.mjs`
  updated for the new keys.
- **Done when.** Both model builds and both checkers run clean; the existing suite passes unchanged; the 8 sample plans are
  byte-identical.

### WP-01 Units, the time function, the staircase

- **Goal.** The three shared functions of spec 5.2, in whole numbers, as the single definition.
- **Depends on.** WP-00. Uses `dose.doseParams` once WP-09 lands; until then the class constants of `rules.time_model`.
- **Delivers.** `plan/units.mjs`, `plan/timecost.mjs`, `plan/staircase.mjs`; `timefit.setCost`, `supersetMinutes`,
  `testMinutes` as wrappers over `plan/timecost`.
- **Tests to add** (`tests/plan/units.test.mjs`, `timecost.test.mjs`, `staircase.test.mjs`).
  - every value of `rules.time_model` times 60 is a whole number; historical `growth10k` values remain reference data, never endpoint caps after CX-01.
  - R-STAIRCASE golden: 2/2/2 -> 3/2/2 -> 3/3/2 -> 3/3/3 -> 4/3/3; with unequal bounds; a class lift never moves.
  - L1: St(n + 1) = St(n) plus one set on one exercise, for every legal n of 500 random group-days.
  - pair saving = the old `supersetMinutes` for two members, every pair of time classes, sets 0..5 on each side.
  - L2: on 2,000 random days, adding a set, a second of work or rest, a station or a fixed second never lowers the day.
  - the add sequence: Monday then Thursday (R3-VOL-03 golden); L4 on random vectors; segments through middle weeks; twin split.
  - calibration golden: BYOP day 1 (7 exercises, 19 sets) within 55-65 minutes (reported, DR-11).
  - `timefit` wrappers return the same minutes as before on the 8 samples.
- **Done when.** The tests pass and `tests/week.test.mjs`, `tests/volume.test.mjs` still pass through the wrappers.

### WP-02 The generic search (`plan/fd.mjs`)

- **Goal.** Spec 7.4: finite-domain search over sums of table values with pair terms; three verdicts; node budget; fast.
- **Depends on.** WP-00.
- **Delivers.** `plan/fd.mjs` with incremental bounds, a trail, typed arrays, no allocation per node, caller-given variable
  and value order; `tools/planner/bench-fd.mjs` (nodes per second on saved models).
- **Tests to add** (`tests/plan/fd.test.mjs`).
  - P1: 5,000 random table models (2-7 variables, 2-12 states, 2-10 rows of both senses, 0-3 pair terms) against brute
    force: equal verdicts, every "fits" assignment satisfies every row; distribution asserted (at least a third of each verdict).
  - budget: never more nodes than the budget; "unknown" exactly when the budget ends first; the same node count twice.
  - trail: after random push / pop sequences every row's running bounds equal a recomputation from scratch.
  - implied rows can be switched off by name without changing any verdict of the P1 set.
- **Done when.** P1 passes and `bench-fd.mjs` reports the median cost of a node on the saved sample-06 model. Target: 6
  microseconds; the measured number goes into `DECISIONS.md` and decides `budget.plan_nodes` (spec 10.4).

### WP-03 The stairway scheduler

- **Goal.** Integrate spec 7.7 and the scoped proofs in PROGRESSION_MATH. The isolated reference already exists; this package still owns production integration.
- **Depends on.** WP-00.
- **Delivers.** `plan/stairway.mjs`: bounded endpoint curves, aggregate group-prefix schedules across certified nested epochs, exact endpoint/monotonicity checks, actual integer rate metadata and scoped failure states. Carry cyclic day state across segments. Preserve explicit numerical/rounding policies. No legacy rate-capped fallback may truncate endpoints or remove groups.
- **Tests to add** (`tests/plan/stairway.test.mjs`, `tests/golden/planner-stairway.json`).
  - Port the independent `tests/progression/stairway.test.mjs` cases without replacing their reference enumeration with implementation helpers: accelerated endpoints, more than one addition/group/week, exact binary quantization, short blocks, zero headroom and scoped numerical/resource failures.
  - R3 worked-line intent: 15 -> 22 and last four 19,20,21,22 under the declared reference shape/rounding; retain earlier whole-line schedules as historical comparisons, not an undocumented universal shape rule.
  - P7: endpoints exact, all weeks within their nested interval, additions nonnegative; prefix totals agree with aggregate group rounding and the declared alternating tie policy.
  - Segments: matching certified boundary vectors, explicit cursor continuity, and no endpoint loss with one or two middle epochs. Full envelope and weekly-row checks belong to WP-04/WP-11/WP-14.
  - A half-up short-block curve may arrive at the ceiling early; subsequent flat sets require concrete rep/load progression, not rejection under a retired flat-week objective.
  - Neither 7%/10% exceedance nor failure of the historical one-set scheduler lowers a feasible endpoint. Test honest relative-rate reporting, including zero-to-positive undefined percentages.
- **Done when.** Integrated tests and independent actual-week certificate checks pass; performance is measured, not presumed from the old DP. No general tier/flat-week optimum is claimed.

### WP-04 The rule catalogue and the certifier

- **Goal.** Spec 4.8, 7.9: one code entry per catalogue id with `rows` and `evaluate`; `certifyBlock`; custom rules.
- **Depends on.** WP-00, WP-01.
- **Delivers.** `plan/catalogue.mjs`, `plan/certify.mjs`.
- **Tests to add** (`tests/plan/catalogue.test.mjs`, `certify.test.mjs`).
  - one data entry <-> one code entry, both directions.
  - per rule id of spec 5.5: one hand-built week that breaks only that rule is flagged with that id; one legal week passes.
  - P20: a custom rule of each of the four shapes registers; a rule that claims `upper_peak` and drops when a set is added
    is rejected.
  - the three sample plans and sample 06 of the prototypes (`design/two-stage/proto/`, `design/spec_checks/graft/`), saved
    as instance + plan JSON under `tests/plan/fixtures/WP-04/`, certify clean.
- **Done when.** The tests pass and `evaluate` covers every row id of spec 5.5.

### WP-05 The reference model (tools only)

- **Goal.** Spec 12.4: a second, slot-level model with its own search, sharing no code with `engine/plan/`.
- **Depends on.** WP-00 (the instance JSON schema).
- **Delivers.** `tools/planner/ref/model.mjs` (one whole number per candidate and proved week, pair rounds explicit, the rows
  of spec 5.5 written out from the spec), `ref/search.mjs` (depth-first, whole numbers, its own bounds), a README.
- **Tests to add** (`tests/plan/ref.test.mjs`): the reference search against brute force on the small generator (equal
  verdicts); the keep questions of the three samples decided (the milp slot model needed at most 3,412 nodes a question).
- **Done when.** The tests pass. Its cross-check against the oracle belongs to WP-20.

### WP-06 Benchmark wiring

- **Goal.** One command scores an engine setting on every corpus of spec 13.1.
- **Depends on.** WP-00; the scorer and intakes of `design/bench/` (the benchmark phase).
- **Delivers.** `tools/planner/score-all.mjs` (`--engine v04|shadow|two_stage`, corpora C1-C5, a saved JSON and a summary
  table), `tools/planner/sweep.mjs` (C3).
- **Tests to add** (`tests/plan/bench.test.mjs`): the scorer flags a hand-broken copy of a sample plan on A2, A5, A7, A10
  and A13, each on the week, day and group that was broken; on the old engine's sample plans it reports a floor miss for
  every group the plan itself lists in `time_check.trained_below_floor`.
- **Done when.** The baseline of the old engine is saved; every later slice is compared with it.

### WP-07 The uncut layout and the template notes

- **Goal.** `week.mjs` can return every template station of every day, and the templates say which station is the day's
  work lift, its partner, the twins, the optional-day cells.
- **Depends on.** WP-00.
- **Delivers.** `buildWeekLayout(derived, shape, tb, model, {uncut: true})` (no `applyCuts`, `enforceAthleteCap`,
  `moveGroupsToOptional`, `movePrehabToOptional`, `trimOlympicExposures`, no cutting in `ensureAthleticTracks`; calendar,
  weekdays, ordering, aerobic placement and test marking as today); without the option the function is unchanged.
  `layoutForWeek(base, weekShape, derived, model, active)` applies a plan's active set.
  `tools/fixture/planner-templates.mjs`: per day type the lead station, its partner by pair tag, the twin day types,
  extension lists that differ from the default, optional-day cells, room tags of athletic and care stations.
- **Tests to add** (`tests/plan/layout-uncut.test.mjs`, updates in `tests/week.test.mjs`).
  - the uncut layout of every template and variant holds every station of its day types (count asserted per template).
  - without `uncut` the layouts of the 8 samples and of 200 random intakes are byte-identical to before.
  - every full-body day with a lower work lift has exactly one lead station and its partner; twin day types are symmetric.
  - H3 on every template: no station is a side of two pairs that can both be active.
  - T0-SES-03 ... 07: the ordering pass holds on the uncut layout.
- **Done when.** The tests pass; the old path is untouched.

### WP-08 Selection and the laterality pre-pass

- **Goal.** Spec 7.2 and the selection contract of spec 7.14.
- **Depends on.** WP-00; WP-07 for the uncut layout (can start on the cut layout).
- **Delivers.** `plan/laterality.mjs`; in `select.mjs`: `ctx.laterality_plan` honoured, picks for extension candidates and
  stations on their day (no duplicate on a day, non-axial where the spec says so), `repickSameClass(selection, plan)`.
- **Tests to add** (`tests/plan/laterality.test.mjs`, additions to `tests/select.test.mjs`).
  - T8-BAL-01: for every share 0.1 ... 0.9 and 1-20 slots, every prefix is within one slot of the target share.
  - selection returns the planned laterality whenever the filters leave one; a flip carries `laterality_flip`.
  - H1: on the 8 samples and the bench corpus the credit class of every candidate is the same in every exercise block.
  - `repickSameClass` never changes a time class or a credit class (property over every sample plan).
  - R-AXIAL: with every candidate of the uncut week on, each exercise block has at most one counted squat and one counted
    hinge, on different days.
- **Done when.** The tests pass; the selection tests of today pass unchanged without a laterality plan.

### WP-09 Dose parameters and the progression card

- **Goal.** One source for seconds per set (DR-11) and the card of spec 7.8.
- **Depends on.** WP-00.
- **Delivers.** `dose.doseParams(slot, pick, weekShape) -> {work_s, rest_s, rest_class, time_class}`; `doseItem` prints exactly
  those; `progressionLines(facts)`.
- **Tests to add** (`tests/plan/dose-params.test.mjs`, additions to `tests/dose.test.mjs`).
  - for every resistance item of the 8 samples the printed work and rest equal `doseParams`.
  - `doseParams` gives the same result for 2, 3, 4 and 5 sets (it never reads the sets).
  - strength-rest cases (an athlete's heavy lift in the last exercise block, class lifts, the strength family) equal
    `timefit.restClassOf` of today.
  - card: same-set weeks have a concrete permitted rep/load prescription or an explicit unresolved result; effort/display changes alone cannot fabricate that prescription. Port `planProgression` cases from the isolated prescription suite; recost changed work/rest prescriptions.
- **Done when.** The tests pass and the dose tests of today pass unchanged.

### WP-10 The athletic plan and the room ladder

- **Goal.** Spec 7.3.
- **Depends on.** WP-00; WP-07 for the room tags.
- **Delivers.** `plan/athletic_plan.mjs` (`planAthleticStations`, `doseAthleticKeys`); `athletic.mjs` keeps targets, stages,
  drill rules and per-set bounds and loses `ensureAthleticStations` and `planAthletic` once WP-16 no longer calls them.
- **Tests to add** (`tests/plan/athletic-plan.test.mjs`).
  - T3-ATH-01: no key ever drops, for 2,000 random targets and capacities; the end-test week holds.
  - one scale per key; planned >= 0.9 x scaled target in every week; the dose lands on the capacity when the scale is below 1.
  - divisor sharing: a larger total never takes a contact from any station.
  - H5: for every profile class and template, switching a room item on never lowers a day's fixed seconds or counted exercises.
  - the protected set of each profile class equals `rules.planner.room`; R3-ATH-01 (swimmers' care) and R3-ATH-02 (racket 50+)
    blocks are protected.
  - T0-ATH-02: one stage per exercise block, never backwards. T0-ATH-03: contacts per session inside the cap.
- **Done when.** The tests pass on the 5 athletic samples (01, 02, 03, 05, 08).

### WP-11 The grammar builder (S0)

- **Goal.** Spec 7.1: any template into an instance.
- **Depends on.** WP-01, 04, 07, 08, 09, 10.
- **Delivers.** `plan/grammar.mjs`.
- **Tests to add** (`tests/plan/grammar.test.mjs`, `tests/golden/planner-instances/`).
  - every grid cell builds (count asserted) and passes `assertInstance` (H1, H2, H3, H5, whole seconds, credits in 0 / 1 / 2 / 4).
  - goldens: the instances of samples 01, 04, 08 equal the hand-written ones of `design/two-stage/proto/samples.mjs` in
    candidates, pairs and fixed seconds (differences listed and explained in the test); sample 06 equals
    `design/spec_checks/graft/aesthetics.mjs` plus its optional days.
  - minimum length: the class template at 30 and 45 minutes returns `format_min` with 60; `athletic.3` with tests at 30.
  - structural "no": a one-day group whose candidates cannot reach floor + climb gets reason `template` with no search.
  - epochs: an athlete's block {1, N}; a physique block with a costliest first exercise block {1, 4, N}; tests inside with
    a larger room item {1, N-1, N}; compressed envelopes dominate every inherited covered week's fixed/work/rest costs, not only the dropped epoch's raw costs. Independently assert cover(w)>=w and full cost dominance for every week.
  - R-TEST: a strength test's seconds sit on z of its group; a timed test replaces its station.
  - edit rules: every candidate, station and room item of an instance names the edit rule that brought it in.
- **Done when.** The tests pass and `tools/planner/grid.mjs` (WP-20) can list every cell.

### WP-12 The oracle

- **Goal.** Spec 7.5.
- **Depends on.** WP-01, 02, 04.
- **Delivers.** `plan/oracle.mjs`: `buildOracle(instance)` (tables once per instance), `ask(question, budget)`.
- **Tests to add** (`tests/plan/oracle.test.mjs`, `oracle-implied.test.mjs`).
  - P2, P3: 6,000 questions on the widened generator against brute force: 0 verdicts differ, 0 witnesses rejected, at
    least a quarter of each verdict; the generator must draw room prefixes, both day rows, partner rules, twins, a middle
    epoch, tests on z, own credit of 0, 2 and 4 q.
  - judge 2's two counterexamples as fixtures (`design/judge2/twostage_*_counterexample.mjs`): "fits".
  - P4: one test per implied row: every brute-force-feasible point satisfies it; verdicts equal with the row on and off.
  - P11: every "fits" of the tied model passes the untied evaluators; a "no" of the tied model is never returned.
  - budget: nodes never exceed what the plan has left; a spent budget returns "unknown", never "no".
- **Done when.** The tests pass; the sample-06 model answers its keep questions inside the run-time budget (reported).

### WP-13 The tiers (S1)

- **Goal.** Spec 7.6.
- **Depends on.** WP-12, WP-03.
- **Delivers.** `plan/table.mjs`.
- **Tests to add** (`tests/plan/table.test.mjs`, `tests/golden/planner-plans/`).
  - P5: keep vector equal to the exhaustive lexicographic maximum on 1,200 small instances (hosted stations, partial credit).
  - P6: define the exact actual-credit objective and compare it with finite exhaustive candidates; S=C is excluded from growth scoring, S>C conflicts. Do not use average credits as exact heterogeneous staircase tallies. A retained unproved ladder is best_found, not a general optimum; no legacy rate-cap failure freezes a peak.
  - P15: the room prefix is the largest that keeps the keep vector; P16: no day's overrun can be lowered.
  - G3: lead before keep; a partner is on exactly when its work lift is active and its group is not trained; at most
    `max_per_week` chosen stations; the keep form on its lead-pair day first.
  - G5s: the usual 11 holds for every group for which the pinned question fits, in keep order.
  - G6: week 1 = the legal value nearest to peak - (C - S), lower first; G7: most exposure days, fewest exercises, even
    split, twins tied, home day first; G7b: totals nearest the curve, the witness as the fallback.
  - P13: permuting lower-tier parameters never changes a higher tier's result.
  - zero kept groups returns a certified plan with stations and class lifts.
  - goldens: the plans of `design/spec_checks/graft/run.out.txt` (D1-a, D1-b, D1-c, swimmer and class defaults) and sample 06.
  - budget: with 500 nodes a rung the sample-06 plan still certifies and every unfinished tier is `best_found`.
- **Done when.** The tests pass.

### WP-14 Placement (S2)

- **Goal.** Spec 7.8, 7.9 in the chain.
- **Depends on.** WP-01, 03, 04.
- **Delivers.** `plan/placement.mjs`; `tools/planner/reschedule.mjs` (takes a plan of the old engine, keeps its first and last
  week, and re-builds the weeks between with the scheduler and the add sequence where those two ends certify: slice 2).
- **Tests to add** (`tests/plan/placement.test.mjs`, `link.test.mjs`).
  - P8, P9: 300 random plans with exercise-block costs that change, fixed seconds that go up and down, and a middle epoch:
    0 violations of any hard row in any week; no exercise loses a set; table printed = table placed.
  - supersets: the chosen set is the smallest that makes every week fit (against all subsets); the rest are "recommended".
  - progression prescriptions: actual set additions or concrete permitted rep/load instructions on flat weeks, including early ceiling arrival; no invented change when no progression is available.
  - edit rechecks: discard stale plan/week/day/item certificate metadata, preserve the user's edit and conflicts, and check per-item nondecrease/removal/RIR, main-only floors, all-day targets/ceilings, optional daily limits and time. The isolated subset validator is a reference, not a substitute for full model checks.
  - golden: the add order of the coach's example (quads: first exercise Monday, first exercise Thursday, second Monday ...).
- **Done when.** The tests pass.

### WP-15 Formats

- **Goal.** Spec 7.13.
- **Depends on.** WP-11, 13, 14.
- **Delivers.** `plan/formats.mjs`; `formats_enabled` extended one format at a time.
- **Tests to add** (`tests/plan/formats.test.mjs`).
  - class: class lifts fixed and credited, R-PARTNER for the class squat and deadlift, sample 04 equals its golden.
  - circuits: work seconds follow the approved steps (T3-STW-10); rounds and stations by enumeration hold the floors of the
    kept groups; sample 05 trains no group under its floor.
  - strength roles: the work and the survival are never cut; R-COUNT is not applied.
  - flat blocks: sets = factor x reference; no floor; the minutes hold; a block that does not fit follows the keep order.
  - every handler's result passes `certifyBlock`.
- **Done when.** The tests pass for each format before it is added to `formats_enabled`.

### WP-16 The planner chain, the adapter, the switch

- **Goal.** Spec 7.10, 4.5, 11.2.
- **Depends on.** WP-11, 13, 14 (WP-15 per format).
- **Delivers.** `plan/planner.mjs`; `volume.planWeeklySets` delegating by `rules.planner.engine`; `generate.mjs` with the
  uncut layouts, the laterality plan, one planner call, no athletic reconcile, the new plan fields, shadow mode;
  `tools/planner/shadow.mjs`.
- **Tests to add** (`tests/plan/planner.test.mjs`, updates in `tests/generate.test.mjs`, `volume.test.mjs`, `determinism.test.mjs`).
  - `v04`: the 8 sample plans are byte-identical to the plans before the package.
  - `shadow`: equal to `v04` except `meta.planner_shadow`.
  - `two_stage`: the 8 samples generate with status ok; `certifyBlock` empty; P17 (`est_minutes` = re-cost of the dosed
    items); P19 (same bytes twice).
  - the four outcomes, each on a constructed intake; `format_min` returns status invalid with the first length that fits.
  - T5: over the sweep, the plan at days + 1 is never lexicographically worse.
  - the adapter's `VolumePlan` has every field of `CONTRACTS.md` 4.0; `target_by_muscle` equals what is placed for trained
    groups and is null otherwise.
  - no stage after the planner changes a set (the set map before and after dosing is equal).
- **Done when.** The tests pass and the first shadow scores are saved (section 4, slice 3).

### WP-17 Offers, reasons, the decision table

- **Goal.** Spec 7.11 and the coach's table of spec 14.
- **Depends on.** WP-16.
- **Delivers.** `plan/offers.mjs`; `tools/planner/decision-table.mjs` (one table per decision D1-D15 on the 8 samples).
- **Tests to add** (`tests/plan/offers.test.mjs`).
  - P14: every offered schedule is a valid intake and its plan has exactly the stated adds and trades.
  - `minutes_missing` equals a linear scan; the day list is right on constructed cases.
  - offers exist only at legal session lengths; a solve that ends "unknown" is left out, never guessed.
  - the "exact minutes" offer appears exactly when a day runs over for kept movements.
  - the decision table reproduces spec 14.1 for sample 08.
- **Done when.** The tests pass; the decision tables for the 8 samples are saved for the coach.

### WP-18 Conflicts in rule ids

- **Goal.** Spec 7.12.
- **Depends on.** WP-12, 13.
- **Delivers.** `plan/conflict.mjs`.
- **Tests to add** (`tests/plan/conflict.test.mjs`): on small instances the result is minimal (removing any member makes
  the group fit) and repeatable; rules a person cannot change are tried first; a spent budget returns
  `conflict.not_computed`; the swimmer's "why not quads" names the squat's day, its row and the days' minutes.
- **Done when.** The tests pass; cost on the samples reported.

### WP-19 Validate, render, words

- **Goal.** The plan JSON is checked by the catalogue and printed with the block of spec 8.3.
- **Depends on.** WP-04, WP-16.
- **Delivers.** `validate.mjs` (dosing checks read catalogue ids and parameters; no exemption that is not a parameter),
  `render.mjs` / `explain.mjs` (time block, kept movements, progression card, offers), `tools/fixture/planner-words.mjs`
  (every key of spec 8.4, EN and ES).
- **Tests to add** (updates in `tests/validate.test.mjs`, `render.test.mjs`, `explain.test.mjs`, `i18n.test.mjs`;
  `tests/plan/words.test.mjs`).
  - every key of spec 8.4 exists in EN and ES; every key the planner can emit is in the word lists (H14).
  - `validatePlan` flags each of WP-04's breaking weeks, turned into plan JSON, with the same rule id.
  - a static list of the exemptions left in `validate.mjs`, each tied to a catalogue parameter.
  - render golden: the block of spec 8.3 for sample 08, EN and ES.
- **Done when.** The tests pass; all 8 samples render in both languages.

### WP-20 Grid, certification, timing, the gate

- **Goal.** Spec 12.4, 12.5, 10, 13.3.
- **Depends on.** WP-05, WP-16.
- **Delivers.** `tools/planner/grid.mjs`, `certify-grid.mjs`, `bench-time.mjs`, `staircase-price.mjs`;
  `tests/golden/planner-grid.json`; the gate report.
- **Tests to add** (`tests/plan/grid.test.mjs`, a CI job of its own): every cell builds; the run-time keep vector equals the
  certified one; no G1 question unknown at the run-time budget; `best_found` on at most 5 % of cells; every plan certifies;
  the oracle and the reference search agree on every question of the small generator.
- **Done when.** Items 1-4 of spec 13.3 pass with saved outputs. Performance work it finds goes back to the owners of
  `fd.mjs` and `oracle.mjs` as requests.

### WP-21 Migration clean-up

- **Goal.** Spec 11.1, 11.3 slice 7, 11.4.
- **Depends on.** The gate (spec 13.3 items 1-4), the coach-eye review, the coach's defaults.
- **Delivers.** Each of the ten `tests/review-*.test.mjs` re-expressed as rule-id properties or retired, with a table in
  `DECISIONS.md` (test, rule id or retiring decision); `rules.planner.engine = "two_stage"`; old code deleted from
  `volume.mjs`, `week.mjs`, `athletic.mjs`; samples regenerated; `engine/README.md`, `docs/` and `samples/SAMPLES.md` updated;
  `tools/sweep.mjs` on the new engine.
- **Tests to add.** For every retired test file, the properties that replace it (named in the table); the 1,500-intake
  sweep with 0 failing error checks and A1-A13 at 0.
- **Done when.** Items 5-7 of spec 13.3 pass.

---

## 4. Slices and what each must show before the next

Scores are the scorer's (spec 13.2) on C1 and C2 unless stated; "no worse" means no sample's score drops (A24).

| Slice | Packages merged | Engine setting scored | Must show |
|---|---|---|---|
| 1 baseline | 00, 01, 04, 06 | `v04` | the baseline saved; the scorer reproduces the failures of the diagnosis |
| 2 stairway and placement | 03, 14 | shadow-only rescheduling where the actual endpoints and complete cost envelopes certify | current A6/A8/A9 = 0; A7/A20 reported as diagnostics, not former flat-week rejections |
| 3 the planner in shadow | 02, 05, 07, 08, 09, 10, 11, 12, 13, 16 | `shadow` | A2, A3, A5, A6, A10, A11, A13 = 0 on C1; P5 and P8 green; the 8 shadow summaries read by a person |
| 4 athletic and room | 10 complete | `shadow` | A18 holds; no sample loses a kept group against slice 3 unless a room rule says so |
| 5 offers and words | 17, 18, 19 | `shadow` | A16, A17 = 0; the block of spec 8.3 renders in EN and ES |
| 6 formats | 15, one format at a time | `shadow` | samples 04 and 05 at A1-A13 = 0 |
| 7 switch | 20, 21 | `two_stage` | the gate of spec 13.3 |

---

## 5. Decisions the build needs

| Id | Decision | Needed by | Default if nobody answers |
|---|---|---|---|
| D1 | may kept movements run a day up to 10 % long (spec 14.1) | the gate | yes |
| D4 | protected blocks and room order per kind of client (spec 7.3) | WP-10 data; the gate | the spec's defaults |
| D13 | the late-block strength rest of athletes' heavy lifts | the gate | as the model |
| D2, D3, D5 ... D12, D14, D15 | spec 14.2 | the coach-eye review | the spec's defaults, printed in every plan |
| M-1 | a strong external solver (HiGHS, MIT) as a development-only second opinion under `tools/` | WP-20, optional | not used; the reference search alone certifies |
| M-2 | the subfolder `engine/plan/` (an amendment of `CONTRACTS.md` 1.1, 1.2) | WP-00 | accepted with WP-00 |
| M-3 | `plan/2` keeps its name; the new fields are additions | WP-00 | yes |
| M-4 | the reference laptop and the phone for the timing gate | WP-20 | the CI runner class; one mid-range Android phone |

---

## 6. Risks to the plan

| Risk | Sign | Response |
|---|---|---|
| the search does not reach 6 microseconds a node | `bench-fd.mjs` after WP-02 | lower `budget.plan_nodes` (spec 10.4); tied twins and range questions first; never another solver at run time |
| the uncut layout breaks the old path | the byte-identity test of WP-07 | the `uncut` option is the only new behaviour; the old path stays until WP-21 |
| the grammar builder cannot express a template | a grid cell fails to build in WP-11 | fix the template note (WP-07) or add an edit rule (data); never a branch in the planner for one template |
| a pruning row is wrong | P4 or the grid mismatch (A14) | switch the row off by name, ship without it, fix it with its own test |
| the grafted hard rows cost groups a coach would keep (D1, D11) | the decision tables of WP-17 | the parameters exist; the coach decides with the tables in front of him |
| ten review test files block the switch | WP-21 backlog | costed as its own package; a test is either a rule-id property or retired with a written reason, never deleted silently |

---

## 7. Rules for every agent

1. Write only the files your package owns (section 2). For anything else, append a request to `engine/CONTRACT_REQUESTS.md`.
2. Read `design/PLANNER_SPEC.md` sections 4, 5 and the part of 7 your package implements before writing code.
3. No number that exists in `model/rules.json` is typed in code. A literal is allowed only for structure or with
   `// INFERRED: <why>` and a request to move it into the rules.
4. Whole numbers in every decision; no tolerance; no clock; no randomness; no iteration over unordered collections in a decision.
5. Every test names its rule id or spec section, uses the shared generators, and asserts the distribution it drew.
6. The old engine is the default until the gate. Never change its output.
7. A prototype in `design/` is evidence, not code to copy without reading: two of its pruning bounds were wrong before
   tests caught them (spec 12.2, P4).
