# Blaze Camp plan generator: engine (Phase 0)

A person fills in the intake (goal, sport or activity, days, minutes, equipment, pain, experience). The engine turns it into a
training plan written the way the Blaze Camp coach programs: a 12-week (or 8-week) "stairway" of whole weekly sets per muscle,
2-4 exercises per muscle group per day, two spine days, power before strength, core first, effort by reps in reserve, tests only at
the start and the end, and every word in English or Spanish.

* **Rules, numbers and words** come from the compiled model in `model/` (built from the coach's answers and the synthesis docs).
* **Code** is plain ES modules in `engine/`, Node 22, no npm dependencies, no build step. Engine files import only other engine
  files, so they run unchanged in a browser.
* **Deterministic**: the same intake and model give a byte-identical plan (seeded tie-breaks; no clock, no random, no `Intl`).
* **Explainable**: every non-trivial decision carries a machine-readable `why` (`{key, ref, args}`), where `ref` is the coach answer,
  round-2 id, rule or decision id behind it.

Binding documents: `engine/CONTRACTS.md` (shapes, names, signatures; contracts/1.1.1 + the engine 0.4.0 amendment boxes of stages
B1 … B4), `engine/DECISIONS.md` (every gap or conflict decided once: C-01 … C-19, D-01 … D-81, round 3 E-01 … E-134), `engine/BUILD_PLAN.md`
(who built what). Authority for coaching rules: `coach_answers_round3.md` > `coach_answers_round2.md` > `coach_answers_full.md` >
`coach_answers.md` > OBSERVED sheet facts > `generator_spec_v1.json` / `synthesis/` (INFERRED / SCIENCE / PROPOSED).

**What the plan is (round 3).** The plan is built **once**, with its whole stairway visible ahead of time - no check-ins, no tracking,
nothing adapts and no user data is kept (R3-VOL-02, R3-VOL-04, R3-GEN-01). People and coaches adjust it themselves: every block has a
stable id and says whether it can be switched off (athletic, core, joint care, cardio ...), exercises can be added or removed, and each
day lists the supersets that save time (R3-SES-02). When the chosen days x minutes cannot hold the full plan, the plan says so up front,
offers one more day or longer sessions in numbers, trains fewer groups directly (big movers first) and every trained group still climbs.
Every plan opens with the use-at-your-own-risk line and the release link (DISCLAIMER.md / DISCLAIMER.es.md, drafts for attorney review).

## 1. How to run

All commands from the code root (`blaze-camp-model/`), Node 22:

```sh
node tools/compile-model.mjs            # sources (synthesis/, spec, coach answers) -> model/*.json   (exit 1 on a contract error)
node tools/check-model.mjs              # contract checks on model/: shapes, bands, credits, i18n coverage, rules == fixture rules
node --test tests/                      # the whole suite (also: `node --test`)        -> 935 tests, 935 pass, 0 todo
node tools/generate-samples.mjs         # the 8 sample plans -> samples/plans/<name>.json + <name>.<lang>.md (+ .en.md for ES)
node tools/sweep.mjs 1500 --render      # 1,500 random + 52 sports + 26 activities on the fixture and model/ (about 4 min)
```

From clean (what stage B4 ran): `node tools/fixture/build-fixture.mjs && node tools/fixture/check-fixture.mjs && node tools/compile-model.mjs
&& node tools/check-model.mjs && node --test tests/ && node tools/generate-samples.mjs && node tools/sweep.mjs 1500 --render`. The
sweep prints, per model, the plans ok, throws, failing error / warn checks, non-test days over 125 % of the minutes, plans that train
no group directly and render problems; it exits 1 on any failing error check (v0.4: 0 of 1,578 on both models).

Useful variants:

```sh
node --test tests/volume.test.mjs                       # one module's tests
node tools/generate-samples.mjs --only 08               # one sample (file-name prefix)
node tools/generate-samples.mjs --fixture --out /tmp/p  # the same plans from the reference fixture model
node tools/fixture/build-fixture.mjs && node tools/fixture/check-fixture.mjs   # rebuild + check engine/fixtures/mini-model.json
```

`generate-samples` prints one line per sample (template, program, training blocks, total sets week 1 -> last, failing checks,
warnings) and exits 1 if any plan is not `ok` or fails an `error` check.

Using the engine from code:

```js
import fs from 'node:fs';
import { loadModel } from './engine/model.mjs';
import { generate } from './engine/generate.mjs';
import { renderPlan } from './engine/render.mjs';

const dir = 'model';
const read = (f) => JSON.parse(fs.readFileSync(`${dir}/${f}`, 'utf8'));
const model = loadModel({ manifest: read('manifest.json'), catalog: read('catalog.json'), rules: read('rules.json'),
  templates: read('templates.json'), profiles: read('profiles.json'),
  i18n: { en: read('i18n/en.json'), es: read('i18n/es.json'), es_review: read('i18n/es_review.json') } });
const plan = generate(JSON.parse(fs.readFileSync('samples/intakes/08-pickleball-genpop.json', 'utf8')), model);
console.log(plan.status, plan.validation.ok);
console.log(renderPlan(plan, model, { lang: 'en', view: 'full' }));   // views: full | overview | block | week | day; format: markdown | text
```

(`tests/helpers/models.mjs > loadCompiledModel()` does the same read; `tools/generate-samples.mjs` too.)

## 2. Layout

```
model/          compiled runtime data (never hand-edited): manifest, catalog (731 exercises), rules, templates (30, 1,765 stations),
                profiles (127 + 52-sport picker + 26 activities), i18n/en.json, es.json (2,448 keys each), es_review.json,
                MODEL_VERSION (1.3.0: round 3 - amendment layers tools/fixture/round3.mjs, athletic-b2.mjs, render-b3.mjs,
                integrate-b4.mjs on top of review-v12.mjs), CHANGELOG.md (coach corrections applied), COMPILE_REPORT.json
engine/         the generator (pure functions) + CONTRACTS / DECISIONS / BUILD_PLAN / CONTRACT_REQUESTS
  fixtures/mini-model.json   the architect's reference compile (shape reference for tests)
tools/          CLIs (the only place with file I/O): compile-model.mjs + compile/*.mjs, check-model.mjs, generate-samples.mjs,
                sweep.mjs (the random-intake sweep), fixture/*.mjs (reference fixture builder + the amendment layers)
tests/          node:test suites; helpers/ (models, random intakes, stubs); invariants/; run-all.mjs + package.json (runner entry)
samples/        intakes/ (the coach's 7 sample clients + the pickleball bonus), plans/ (generated), SAMPLES.md (what the engine decided),
                REVIEW_LOG.md (every review issue and its fix, per stage), RECHECK_v0.3.md (the coach-eye re-check of the v0.3 plans)
synthesis/ analysis/ dumps/ raw/ answers_raw*/   read-only sources
```

## 3. Module map

| File | Exports | What it does |
|---|---|---|
| `util.mjs` | `canonicalJSON`, `hash53`, `makeSeed`, `tieBreak`, `roundHalfUp`, `round2`, `why`, date helpers, `forbiddenKeys`, typedefs | shared helpers and the §4.0 JSDoc typedefs; `forbiddenKeys` finds sleep / stress / job / sex keys anywhere |
| `model.mjs` | `loadModel`, `assertModel` | wraps the model JSON in read-only accessors (`ex`, `bySlot`, `credits`, `kitAvailable`, `stair(N)`, `templateFor`, `sport`, `groupOf`, `t(lang, key, args)`, `has`); `assertModel` checks every §3 shape and the coach's data rules (no bands, credit maps, KB swing 0, thruster 1 / 0.5 / 0.25, medball ≤ 20 lb, 60+ never-list, ES coverage) |
| `intake.mjs` | `validateIntake`, `safetyScreen`, `checkRelease`, `deriveValues` | intake/2 validation (no sleep / stress / job / sex fields, release required), health screen (coach bypass), derived values D1-D14: family, profile, level L1-L3, season, plan shape, template, constraint band, kit, targets (via volume), bilateral share, athletic budget, planned step, tests, aerobic count |
| `shape.mjs` | `buildShape`, `planTrainingBlocks` | training blocks (stairway / pre-season / taper / in-season / maintenance / recovery), exercise blocks, per-week stair level 2 -> 11, phase, planned RIR, rep phase, Receive-Create stage, test weeks, circuit dose |
| `volume.mjs` | `computeTargets`, `stairwayPlan`, `stairwayFrom`, `planWeeklySets`, `athleticBudget`, `weeklyCredits`, `calvesFloor`, `plannedGrowth` | the 12_volume_algorithm engine on lines (v0.4): starts / caps / floor 10 on the FOCUS groups / Focus +2 / pain, λ-scaled stairway (3 % then 5 %, T(N) = cap), **the time check** (R3-SES-02: warn up front with offers in numbers, room cuts - from the most loaded day, B4 -, fewer groups trained directly, supersets, every kept group climbs; `plan.time_check`), whole-set placement in the coach's order (VOL-07) replayed from the probed peak, < 10 % weekly total rise, bonus / Focus slots, circuits and flat blocks fitted to the minutes. v0.4 B4: the class model's work lifts stay (`class_lift`, E-64), a lone station leaves its day (E-69), `added_fills` (E-70) |
| `athletic.mjs` | `stagesForStairway`, `athleticBudget`, `planAthletic`, `splitContacts`, `athleticKeyOf`, `cueKeyFor`, `responseOf`, `perSetBounds`, `sprintMetres`, `circuitBallistic`, `plannedAthletic`, `plannedShare`, `ensureAthleticStations`, `pairAthleticBlock`, `isFloorJump`, `olympicAboveCeiling` | v0.4 stage B2: Receive-Create stages per exercise block (no jump exercise changes mid-block), how a drill is done and cued (landing / single / repeat), the weekly athletic targets (the 04 volume split by the coach's plyo share), **the athletic stairway** (doses land on the targets, scaled to what the block's stations hold, climbing week by week, the end-test week holding), circuit ballistic stations (R2-ATH-01/02/03, R3-ATH-01..05, E-26 ... E-45). Fix round 1 / F2: the plyo share held per week, the tracks' stations sized from the block's peak targets (ballistic jumps, a second sprint / max velocity, a second throw, the ankle block outside the jump / throw split and the 12 + 2 count), stage cues of a ballistic jump, the jump + throw contrast pair, the sport's Olympic ceiling (E-97 ... E-109) |
| `budget.mjs` | `olympicSetsPerExposure`, `olympicSetsForIndex`, `blockProgress`, `stayActiveOlympic`, `warmupMode`, … | Olympic sets per exposure (v0.4 B2: climbing one set at a time on the earliest exposures; B4: 2 x 3 once a week in a game-heavy in-season block, E-66), warm-up prep by profile (60+: balance) |
| `timefit.mjs` | `linesOf`, `lineCredits`, `groupCredits`, `primeLines`, `setCost`, `supersetMinutes`, `testMinutes`, `timeClassOf`, `restClassOf` | v0.4: lines and FOCUS groups (R3-VOL-01, R3-SES-01; a set counts at most 1.0 to a group) and the v1.3 time model (work + rest by rest class, supersets share the rest, test work-ups), shared by volume, week and validate |
| `week.mjs` | `buildWeekLayout`, `layoutForWeek`, `estimateMinutes`, … | template -> weekdays (optional days skip play days), stations -> slots, block order (core first, power before strength, H before V), pairing, supersets, 2-4 per group, caps and the cut order, prehab (B4: every injury code one session before any second, E-75), warm-up, aerobic placement and colours, the time model, test placement (B4: the jump test on a free jump day, E-79), the Olympic exposure trim (B4: unfillable stations first, E-68) |
| `select.mjs` | `selectBlock`, `fillSlot`, `candidates`, `variationValues`, `isNearDuplicate`, `detailDistance`, `aerobicPick`, … | picks exercises: hard filters in order (kit, never-list, KB swing never in resistance slots, 60+ and youth rules, pain, exclusions, medball, two spine days, second exposure), scoring from `rules.selection.weights`, laterality share, Olympic day pattern, swaps 2-4 (core swaps in the same plane), exercise-block changes. v0.4 stage B3: one-detail block changes with concrete values ('weight in the opposite hand'), no near-duplicates in a session, the lead chest press and the canonical work lift, home substitutes only when needed, core once a week, aerobic sessions by level and exercise block (E-46 ... E-57). Fix round 1 / F3: the laterality dial on every lower station (one way), the non-spinal second hinge and the low-back core, delt stations by the Focus, above-level picks as fallbacks, week-wide movement families, heavy-powerlifting canonical lifts (E-127 ... E-133) |
| `dose.mjs` | `doseItem`, `doseAerobic`, `doseConditioning`, `repClassFor`, `positionFor`, `intensifierEligible` | reps (goal column, VOL phases, pyramid decided per exercise block, per side), effort (planned RIR, never below 1 on compounds; v0.4 B3: one MYO intensifier a day in the last week only, circuits follow the planned RIR), rest (a supersetted work lift keeps its strength rest), load hints (power language, ramp, medball ≤ 20 lb, WOD station loads), athletic counts, tests, WOD / circuit / aerobic doses (the client's own cardio tool), notes. Fix round 1 / F3: `intensifierEligible` (the MYO on the day's last eligible item), the circuit hold intensifier, superset rest in numbers, per-side one-arm Olympic lifts, rep-hint tops in every block, the class table on the class lifts (E-118 ... E-126) |
| `validate.mjs` | `validatePlan`, `CHECK_IDS`, `plannedStairway` | V1-V29 and H01-H22 (CONTRACTS §6; V27 athletic budget, V28 bilateral share (warn), V29 push : pull (warn) added in v1.2; v0.4 B4 readings of V18 / V19 / V22 / V23 / H21), each a list of structured violations; recomputes credits, weekly sets, group counts and the stairway independently |
| `explain.mjs` | `whyText`, `explainItem`, `levelText`, `changesText`, `stairText`, `resolveArgs` | human explanations from the why-codes; resolves id arguments (exercise, weekday, muscle, joint-care code …) to words (v0.4 B3: lower-case weekdays inside Spanish sentences, singular reasons) |
| `render.mjs` | `renderPlan`, `renderBlockView`, `renderWeek`, `renderDay`, `format*` | markdown or text, EN or ES, phone-friendly; only `model.t` words (no hard-coded text). v0.4 stage B3: the use-at-your-own-risk line with the release link on top of every plan and view (R3-GEN-01), 'Your schedule' (the time check and the offers), per day the blocks that can be switched off and the supersets that save time (R3-SES-02), macro tables for screenshots (`view: 'overview'`), tests, notes and day titles in the client's words. Fix round 1 / F3: only what is true (the minutes, climbing, Focus, intensifier days, change lines per group), every switchable block, the flat release stamp + health-check / PAR-Q+ line, 'How to adjust this plan', the effort bridge, the weekly sets table with every group, superset partners side by side (E-111 ... E-123) |
| `generate.mjs` | `generate`, `generateWith`, `realModulesStatus`, `REQUIRED_DEPS` | the orchestrator (pipeline below); `generateWith(deps, …)` runs it on injected modules (tests use stubs). v0.4: `adapt` / check-ins retired (R3-VOL-02 / R3-VOL-04) |
| `version.mjs` | `ENGINE_VERSION` | `0.4.0` (round 3, stage B1: time, volume and structure; stage B2: athletic work; stage B3: selection, variation and rendering; stage B4: integration) |

Pipeline (`generate.mjs`, CONTRACTS §4.12):

```
validateIntake -> safetyScreen -> deriveValues (D1-D14) -> buildShape -> buildWeekLayout (per training block)
  -> selectBlock (per exercise block) -> planWeeklySets (+ fillSlot for added bonus / Focus slots, estimateMinutes)
  -> athleticBudget -> per week: layoutForWeek, relocate rep-max tests (D-46), the week's items (v0.4 B2: collected first)
  -> planAthletic (the athletic stairway of each block, v0.4 B2) -> per week: doseItem / doseAerobic / doseConditioning,
     distinct details for a same-day repeat (D-48), test top-set items -> meta (warnings incl. time_check, long_day,
     test_day_long) -> plan.time_check -> summary -> validatePlan
```

The output is a `plan/2` JSON (CONTRACTS §5): codes and keys only (no prose), stamped with model, engine and contracts versions,
the release stamp, the full derived values for audit, the stairway, every week / day / item with sets, reps, effort, rest, load,
credits, swaps, notes and `why`, a summary and the validation result. v0.4: the plan is built once with its planned stairway - no
check-ins, nothing is read back (R3-VOL-02 / R3-VOL-04); `plan.time_check` says up front what the chosen days x minutes hold, what
is not trained directly and what one more day or longer sessions would hold (R3-SES-02); days list superset recommendations and
blocks carry on / off switches.

## 4. How rules flow from `model/` to a plan

1. **Sources -> model.** `tools/compile-model.mjs` reads the read-only sources (spec v1.1, synthesis/02-12, coach answers), applies the
   16 coach corrections (bands removed, KB swings 0 credit, helpers 0.25, thruster 1 / 0.5 / 0.25, renames …; listed in
   `model/CHANGELOG.md`), and writes `rules.json` (every number and table), `catalog.json` (exercises with credit class, spine class,
   kit, 60+ / youth flags, variation axes), `templates.json` (the coach's week templates as stations), `profiles.json` (sport / activity
   profiles and the picker) and the EN / ES word lists. `rules.json` deep-equals the reference fixture's rules (a test asserts it).
2. **Model -> engine.** `loadModel` freezes the JSON and exposes accessors. Engine code reads numbers from `model.rules` (e.g. the
   floor `rules.volume.floor`, the stairway tables `rules.stairway.by_N`, caps, credit classes, cut order, time model, test catalogue);
   a literal in engine code is only allowed for structure or with an `// INFERRED` comment (DECISIONS D-66 lists the remaining ones).
3. **Engine -> plan.** Each decision is written into the plan with its `why` (`{key: 'why.two_spine_days', ref: 'R2-SES-01'}`), and
   every user-facing string is an i18n key (`exercise.<id>.name`, `note.*`, `warning.*` …).
4. **Plan -> words.** `render.mjs` / `explain.mjs` resolve keys through `model.t(lang, key, args)`; Spanish is a full twin
   (`model/i18n/es.json`, every machine-translated line listed in `es_review.json` for the coach to approve).

Example, the floor of 10 (R2-VOL-06): `rules.volume.floor = 10` -> `volume.computeTargets` lifts every target muscle's start to 10
(pain wins, credit-only muscles excluded) -> `planWeeklySets` places whole sets until each muscle reaches it or the schedule runs out
-> the time check (v0.4, R3-SES-02) keeps the groups the minutes hold at 10+ and climbing and names the others up front ->
`validate` V22 / H17 re-checks every stairway week -> `tests/invariants` re-checks it independently on 8 samples + 378 random / sweep
intakes, and `tools/sweep.mjs` on 1,578 intakes per model.

## 5. The coach's hard rules: where they live and how they are tested

| Rule | Model | Enforced in | Check | Test |
|---|---|---|---|---|
| No bands / chains / weight releasers | `rules.equipment.banned_tokens`; compile drops 36 records | compile, select | V9 / H01 | compile, model, invariants |
| Never to failure on heavy compounds (1-2 in the tank; MAX / MYO only where allowed) | `rules.effort` | dose | V17 / H02 | dose, validate, invariants |
| Power before strength; H before V; core first | `rules.ordering` | week | V12 / H03-H05 | week, validate, invariants |
| Hip + push, knee + pull | template pairs, `rules.pairing` | week | V11 / H06 | week, invariants |
| Two spine days (one counted squat, one counted hinge, different days) | catalog `axial`, `rules.axial` | select | V10 / H07 | select, invariants |
| Credits: helpers 0.25, dips 0.5 / 0.5, thruster 1 / 0.5 / 0.25; KB swings and athletic work never count | `rules.credit`, catalog `credit_class` | volume, generate | V14 / H08-H09 | volume, model, invariants |
| Planned step ≤ 7 %, weekly total < 10 % | `rules.stairway.limits` | volume | V15 / H10 | volume, invariants |
| No medball in aesthetics main work; ≤ 20 lb | `rules.medball` | select, dose | V16 / H11 | select, invariants |
| 60+: no Olympic / plyo / depth jumps by default; never overhead / low-bar squat, snatch, depth jumps | catalog `older_ok`, `rules.population.older` | week, select | V5 / H12 | select, invariants |
| No sex field; no sleep / stress / lifestyle inputs | `util.forbiddenKeys` | intake | H13, V26 / H16 | intake, invariants |
| English default, full Spanish | `model/i18n` | render | H14 | i18n, render, compile |
| No deload / maintenance week inside a block | `rules.plan_types` | shape | V24 / H15 | shape, invariants |
| Floor of 10 sets per trained FOCUS group (no warning exemption, v0.4) | `rules.volume.floor`, the time check | volume | V22 / H17 | volume, review-r3, invariants |
| 2-4 exercises per FOCUS group per day | `rules.session.exercises_per_group` | week, select, volume (day trim) | V23 / H18 | week, invariants |
| Tests only week 1 / last week; never a 1RM or max mile from zero | `rules.tests` | shape, dose, generate (D-46) | V25 / H19 | shape, dose, invariants |
| Release every build | intake/2 `release` | intake | V21 / H20 | intake, validate |
| Stairway shape (small steps early, bigger late, last weeks hardest; every trained group climbs, never flat) | `rules.stairway` (`min_climb`) | volume | H21 | volume, review-r3, invariants |
| No check-ins - the planned stairway only (R3-VOL-02 / R3-VOL-04) | `rules.stairway.no_checkin = planned_only` | intake, generate | H22 | generate, intake, invariants |
| The time check (R3-SES-02) | `rules.session.time_fit`, `rules.time_model` | volume | V22, H21, V13 | volume, review-r3, invariants |
| The class keeps its lifts (R3-SES-02 big movers first; OT18; v0.4 B4, PROPOSED) | `rules.session.time_fit.keep_work_lift` | volume | V22 / V23 / H17 / H18 (B4 readings) | review-b4, invariants |
| Athletic work: Receive-Create stages per exercise block, plyo share, the athletic stairway (climbs, never drops), first reactive exposures, sport-only drills (R2-ATH-01/02/03, R3-ATH-01..05) | `rules.athletic` (split, stages, response_cues, reconcile, first_reactive, cod, sprint, circuit_ballistic, hyrox), `rules.olympic.sets.climb`, catalog `athletic.response` | athletic, select, dose, budget | V27 | review-b2, shape, volume, invariants |

## 6. Tests (`node --test tests/`: 935 tests, 935 pass, 0 todo)

| File | Tests | Covers |
|---|---|---|
| `compile.test.mjs` | 26 | model == fresh compile, rules == fixture rules, credits, bands, KB swings, ES coverage, pinned cross-check values |
| `model.test.mjs` | 30 | `assertModel` passes on fixture + model/ and catches 19 kinds of injected defects (incl. an unresolved `[PLACEHOLDER]`) |
| `intake.test.mjs` / `shape.test.mjs` / `volume.test.mjs` | 42 / 24 / 64 | the coach's worked numbers: L1 / L2 / L3 stairways (λ 0.76 / 0.867 / 0.501), per-line starts / caps / λ for all 8 samples, Focus +2, calves floor, VOL-07 placement and day rotation, < 10 % rise, group floors and climbs, pain freeze, circuits, the time check, season shapes |
| `week.test.mjs` / `select.test.mjs` / `dose.test.mjs` | 24 / 19 / 20 | templates and weekdays, caps and cuts, filters in order, spine days, swaps, rep classes, effort, tests |
| `validate.test.mjs` | 77 | one failing mutation per check id (V1-V29, H01-H22; v0.4: group floors from the items, listed-but-trained, no warning exemption, check-ins retired) |
| `generate.test.mjs` / `explain.test.mjs` / `render.test.mjs` | 30 / 6 / 17 | orchestration on stubs and real modules, §9 facts, warnings, check-ins retired, views and formats |
| `i18n.test.mjs` | 18 | every sample in EN + ES, all views, markdown + text: no undefined, no placeholder, no raw key or engine code |
| `determinism.test.mjs` | 10 | twice-identical, shuffled keys, no clock / random / Intl in engine sources |
| `review-v12.test.mjs` | 81 | one regression test per fixed coach-eye review issue on the 8 sample plans (IDs as in `samples/REVIEW_LOG.md`) |
| `review-r3.test.mjs` | 33 | v0.4: one regression test per RECHECK_v0.3 issue fixed in stage B1 (`R<sample>-<slug>`) and per round-3 feature (`R3-<slug>`) |
| `review-b2.test.mjs` | 29 | v0.4 stage B2 (athletic work): one regression test per RECHECK_v0.3 athletic issue (`R<sample>-<slug>`) and per R3-ATH answer (`R3-ATH-01` ... `05`, toggles, the split and the bounds) |
| `review-b3.test.mjs` | 35 | v0.4 stage B3 (selection, variation, rendering): one regression test per RECHECK_v0.3 issue fixed in stage B3 (`R<sample>-<slug>`) and per round-3 feature of the printed plan (`R3-own-risk-line`, `R3-time-check-printed`, `R3-block-toggles-printed`, `R3-superset-recommendations-printed`, `R3-no-checkin-text`, `R3-macro-views`) |
| `review-b4.test.mjs` | 22 | v0.4 stage B4 (integration): one regression test per issue found reading the 8 regenerated plans (`R<sample>-<slug>`: class lifts, class day title, lower peaks, circuit throws, even pull days, rotator-cuff care, 'not trained in this plan' copy, test-day warning, tests spread) and per sweep intake that failed an error check (`B4-sweep-random-<n>-<slug>`); each fails on the pre-B4 engine |
| `review-f3.test.mjs` | 40 | v0.4 fix round 1 / F3 (selection, dosing and the printed plan): one regression test per fixed coach-eye review issue of the 8 samples (`R<sample>-<slug>`: the minutes promise, every switchable block, the two-leg / single-leg direction and the laterality dial, Focus vs bonus labels, the Focus muscles line, kept-pattern notes, the legal lines, the effort bridge, 'How to adjust this plan', truthful schedule lists, change lines per group, the halfway intro, the weekly sets table, copy fixes, pair rest and order, intensifier fallback and the circuit hold, non-spinal hinge, low-back core, delt variants, level fallbacks, hot-spot picks, class lifts' table, powerlifting lifts, week families, detail words, rep caps, the switched-off late off-season step) and per corpus intake the round's own changes broke on the way (`F3-sweep-<intake>-<slug>`), plus the V12 / V17 MYO reading |
| `review-f2.test.mjs` | 28 | v0.4 fix round 1 / F2 (athletic work): one regression test per fixed coach-eye review issue of the 8 samples (`R<sample>-<slug>`: ballistic jumps before the ankle block, Friday jump and throw, the share held, overhead throw first, stage drills and cues, the ankle block in place first, second sprint, medball dose, Olympic ceiling, jump ladder, the ankle block outside the split, max velocity, both-sides throws, COD reps, reactive COD, the pre-season's Repeat stage, split capacity warnings, power first in a circuit, the racket ankle track, low-impact stage drills) and per corpus intake the round's own changes broke on the way (`F2-sweep-<intake>-<slug>`), plus the V27 `share_over` check and a `planAthletic` unit |
| `review-f1.test.mjs` | 36 | v0.4 fix round 1 / F1 (time, volume, structure): one regression test per fixed coach-eye review issue of the 8 samples (`R<sample>-<slug>`: big movers kept, pattern stations, skill minutes, starts at the level, groups climb through the block, 2-set added exercises, compound order, calves, one hips target, the absolute ceiling, tests as top sets, block ids, supersets, circuit donors and seconds, joint care) and per sweep intake the round's own changes broke on the way (`F1-sweep-<intake>-<slug>`) |
| `invariants/invariants.test.mjs` | 224 | 8 samples x 2 models + 300 random + 52 sports + 26 activities: generate ok, every error check, independent re-checks of H01-H22 (v0.4: group floors / climbs from the items, listed groups untrained, time-check offers only), check-in output modes planned like plan-only, no same-day duplicate, rep-max tests on bilateral lifts |

## 7. Known limits (Phase 0)

* Session time vs. volume (v0.4, R3-SES-02): short schedules keep fewer groups trained directly (told up front, with one more day /
  longer sessions in numbers); the keep order, the minimum climb, the rest-class minutes and the work-lift below-floor exemption are
  PROPOSED (DECISIONS E). A CrossFit-style class at 4 x 60 min trains back and chest directly and keeps its squat, deadlift and
  strict press as class lifts (3 sets, heavier by the week; E-64, PROPOSED). A swimmer at 3 x 60 gets no squat or chest press and a
  pickleball player at 2 x 45 no row or press (the plan says 'not trained in this plan'); open question for the coach.
* 30-minute sessions (sweep, E-80): the fixed blocks (warm-up, core, athletic / Olympic / WOD) can fill the session - 35 of 1,578
  random plans train no group directly and 56 have non-test days over 125 % of the minutes; the plan says so and offers more time.
* Test weeks run long on the test days (work-ups and timed tests on top of the session; `warning.test_day_long`).
* V28 (bilateral share) and V29 (push : pull) are warnings; the sweep shows them on about a third of the random plans.
* Athletic weekly budgets (04): v0.4 stage B2 doses them as an athletic stairway (E-29) and V27 enforces over / under / drops;
  where the time check and the 12 + 2 cap leave few stations (soccer 3 x 75, pickleball 2 x 45) the work is scaled to what the
  stations hold and the client is told (`warning.athletic_capacity`). The share split of the 04 numbers is INFERRED (E-28).
  Fix round 1 / F2: the plyo share is held within 5 points every week where the doses allow it (V27 `share_over`); the soccer and
  football jump volume stays well under the 04 targets (told up front, jumps and ankle work apart); the share tolerance, the station
  sizes and the stage cue words are PROPOSED (E-97 ... E-109).
* Check-ins are retired (R3-VOL-02 / R3-VOL-04); all Spanish is PROPOSED.
* Block-to-block details (v0.4 B3, E-46): the one-detail rule is the coach's; the value vocabulary ('1-second pause at the bottom',
  'one leg at a time' ...) is PROPOSED; one MYO intensifier a day in the last week is PROPOSED (R3-VOL-04 says 'intensifiers').
* Round-3 defaults in use are listed per plan in `meta.r3_pending`.
* Fix round 1 / F3 (E-134): built and switched off for the coach - the late off-season VOL2 -> VOL3 step at the halfway week (it
  costs the 3 x 75 soccer week chest and calves) and the racket player's glute pick next to the leg curl (it flattened the 2 x 45 hips
  stairway); the upper-body laterality dial, the flat-bench press test and the schedule offers stay open. Every F3 weight and word is
  PROPOSED; the health-check / release lines are LEGAL REVIEW.
