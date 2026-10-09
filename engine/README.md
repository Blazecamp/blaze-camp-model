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

Binding documents: `engine/CONTRACTS.md` (shapes, names, signatures; contracts/1.1.1), `engine/DECISIONS.md` (every gap or conflict
decided once: C-01 … C-19, D-01 … D-66), `engine/BUILD_PLAN.md` (who built what). Authority for coaching rules:
`coach_answers_round2.md` > `coach_answers_full.md` > `generator_spec_v1.json` > `synthesis/`.

## 1. How to run

All commands from the code root (`blaze-camp-model/`), Node 22:

```sh
node tools/compile-model.mjs            # sources (synthesis/, spec, coach answers) -> model/*.json   (exit 1 on a contract error)
node tools/check-model.mjs              # contract checks on model/: shapes, bands, credits, i18n coverage, rules == fixture rules
node --test tests/                      # the whole suite (also: `node --test`)        -> 711 tests, 705 pass, 6 todo
node tools/generate-samples.mjs         # the 8 sample plans -> samples/plans/<name>.json + <name>.<lang>.md (+ .en.md for ES)
```

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
console.log(renderPlan(plan, model, { lang: 'en', view: 'full' }));   // views: full | block | week | day; format: markdown | text
```

(`tests/helpers/models.mjs > loadCompiledModel()` does the same read; `tools/generate-samples.mjs` too.)

## 2. Layout

```
model/          compiled runtime data (never hand-edited): manifest, catalog (731 exercises), rules, templates (30, 1,821 stations),
                profiles (127 + 52-sport picker + 26 activities), i18n/en.json, es.json (2,121 keys each), es_review.json,
                MODEL_VERSION (1.2.0: the v1.2 review amendments, tools/fixture/review-v12.mjs), CHANGELOG.md (coach corrections applied), COMPILE_REPORT.json (drops, patches, cross-checks)
engine/         the generator (pure functions) + CONTRACTS / DECISIONS / BUILD_PLAN / CONTRACT_REQUESTS
  fixtures/mini-model.json   the architect's reference compile (shape reference for tests)
tools/          CLIs (the only place with file I/O): compile-model.mjs + compile/*.mjs, check-model.mjs, generate-samples.mjs,
                fixture/*.mjs (reference fixture builder)
tests/          node:test suites; helpers/ (models, random intakes, stubs); invariants/; run-all.mjs + package.json (runner entry)
samples/        intakes/ (the coach's 7 sample clients + the pickleball bonus), plans/ (generated), SAMPLES.md (what the engine decided)
synthesis/ analysis/ dumps/ raw/ answers_raw*/   read-only sources
```

## 3. Module map

| File | Exports | What it does |
|---|---|---|
| `util.mjs` | `canonicalJSON`, `hash53`, `makeSeed`, `tieBreak`, `roundHalfUp`, `round2`, `why`, date helpers, `forbiddenKeys`, typedefs | shared helpers and the §4.0 JSDoc typedefs; `forbiddenKeys` finds sleep / stress / job / sex keys anywhere |
| `model.mjs` | `loadModel`, `assertModel` | wraps the model JSON in read-only accessors (`ex`, `bySlot`, `credits`, `kitAvailable`, `stair(N)`, `templateFor`, `sport`, `groupOf`, `t(lang, key, args)`, `has`); `assertModel` checks every §3 shape and the coach's data rules (no bands, credit maps, KB swing 0, thruster 1 / 0.5 / 0.25, medball ≤ 20 lb, 60+ never-list, ES coverage) |
| `intake.mjs` | `validateIntake`, `safetyScreen`, `checkRelease`, `deriveValues` | intake/2 validation (no sleep / stress / job / sex fields, release required), health screen (coach bypass), derived values D1-D14: family, profile, level L1-L3, season, plan shape, template, constraint band, kit, targets (via volume), bilateral share, athletic budget, planned step, tests, aerobic count |
| `shape.mjs` | `buildShape`, `planTrainingBlocks` | training blocks (stairway / pre-season / taper / in-season / maintenance / recovery), exercise blocks, per-week stair level 2 -> 11, phase, planned RIR, rep phase, Receive-Create stage, test weeks, circuit dose |
| `volume.mjs` | `computeTargets`, `stairwayPlan`, `planWeeklySets`, `athleticBudget`, `weeklyCredits` | the 12_volume_algorithm v1.1 engine: starts / caps / floor 10 / priority / pain, λ-scaled stairway (3 % then 5 %, T(N) = cap), whole-set placement in the coach's order (VOL-07), < 10 % weekly total rise, bonus / Focus slots, shortfalls and schedule warnings |
| `week.mjs` | `buildWeekLayout`, `layoutForWeek`, `estimateMinutes`, … | template -> weekdays (optional days skip play days), stations -> slots, block order (core first, power before strength, H before V), pairing, supersets, 2-4 per group, caps and the cut order, prehab, warm-up, aerobic placement and colours, the time model |
| `select.mjs` | `selectBlock`, `fillSlot`, `candidates`, … | picks exercises: hard filters in order (kit, never-list, KB swing never in resistance slots, 60+ and youth rules, pain, exclusions, medball, two spine days, second exposure), scoring from `rules.selection.weights`, laterality share, Olympic day pattern, swaps 2-4, exercise-block changes / one-detail variations |
| `dose.mjs` | `doseItem`, `doseAerobic`, `doseConditioning`, `repClassFor`, `positionFor` | reps (goal column, VOL phases, pyramid, per side), effort (planned RIR, never below 1 on compounds, MAX / MYO only where allowed), rest, load hints (power language, ramp, medball ≤ 20 lb), athletic counts, tests, WOD / circuit / aerobic doses, notes |
| `validate.mjs` | `validatePlan`, `CHECK_IDS`, `plannedStairway` | V1-V29 and H01-H22 (CONTRACTS §6; V27 athletic budget, V28 bilateral share (warn), V29 push : pull (warn) added in v1.2), each a list of structured violations; recomputes credits, weekly sets, group counts and the stairway independently |
| `explain.mjs` | `whyText`, `explainItem`, `levelText`, `changesText`, `stairText`, `resolveArgs` | human explanations from the why-codes; resolves id arguments (exercise, weekday, muscle, joint-care code …) to words |
| `render.mjs` | `renderPlan`, `renderBlockView`, `renderWeek`, `renderDay`, `format*` | markdown or text, EN or ES, phone-friendly; the coach's instruction block first; only `model.t` words (no hard-coded text) |
| `generate.mjs` | `generate`, `adapt`, `generateWith`, `adaptWith`, `checkinRow` | the orchestrator (pipeline below); `generateWith(deps, …)` runs it on injected modules (tests use stubs) |
| `version.mjs` | `ENGINE_VERSION` | `0.3.0` (v1.2 review round) |

Pipeline (`generate.mjs`, CONTRACTS §4.12):

```
validateIntake -> safetyScreen -> deriveValues (D1-D14) -> buildShape -> buildWeekLayout (per training block)
  -> selectBlock (per exercise block) -> planWeeklySets (+ fillSlot for added bonus / Focus slots, estimateMinutes)
  -> athleticBudget -> per week: layoutForWeek, relocate rep-max tests (D-46), doseItem / doseAerobic / doseConditioning,
     distinct details for a same-day repeat (D-48) -> meta (warnings incl. long_day, stairway_time) -> summary -> validatePlan
```

The output is a `plan/2` JSON (CONTRACTS §5): codes and keys only (no prose), stamped with model, engine and contracts versions,
the release stamp, the full derived values for audit, the stairway, every week / day / item with sets, reps, effort, rest, load,
credits, swaps, notes and `why`, a summary and the validation result. `adapt(plan, checkins, intake, model)` applies weekly check-ins
(Phase 0: the stairway waits a week on repeat / hold rows); `adapt(plan, [])` is byte-identical to `generate` (no check-in = no change).

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
(`warning.floor_schedule` with advice) -> `validate` V22 / H17 re-checks every stairway week -> `tests/invariants` re-checks it
independently on 8 samples + 378 random / sweep intakes.

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
| Floor of 10 sets per trained muscle | `rules.volume.floor` | volume | V22 / H17 | volume, invariants |
| 2-4 exercises per muscle group per day | `rules.session.exercises_per_group` | week, select | V23 / H18 | week, invariants |
| Tests only week 1 / last week; never a 1RM or max mile from zero | `rules.tests` | shape, dose, generate (D-46) | V25 / H19 | shape, dose, invariants |
| Release every build | intake/2 `release` | intake | V21 / H20 | intake, validate |
| Stairway shape (small steps early, bigger late, last weeks hardest) | `rules.stairway` | volume | H21 | volume, invariants |
| No check-in = no change | `rules.stairway.no_checkin` | generate | H22 | generate, determinism, invariants |

## 6. Tests (`node --test tests/`: 711 tests, 705 pass, 6 todo)

| File | Tests | Covers |
|---|---|---|
| `compile.test.mjs` | 26 | model == fresh compile, rules == fixture rules, credits, bands, KB swings, ES coverage, pinned cross-check values |
| `model.test.mjs` | 30 | `assertModel` passes on fixture + model/ and catches 19 kinds of injected defects (incl. an unresolved `[PLACEHOLDER]`) |
| `intake.test.mjs` / `shape.test.mjs` / `volume.test.mjs` | 42 / 24 / 62 | the coach's worked numbers: L1 / L2 / L3 stairways (λ 0.76 / 0.867 / 0.501), §9 starts / caps / λ for all 8 samples, VOL-07 placement, < 10 % staggering, floor, pain freeze, circuits, season shapes |
| `week.test.mjs` / `select.test.mjs` / `dose.test.mjs` | 24 / 19 / 20 | templates and weekdays, caps and cuts, filters in order, spine days, swaps, rep classes, effort, tests |
| `validate.test.mjs` | 74 | one failing mutation per check id (V1-V29, H01-H22; v1.2 adds stairway_flat, V27, V28, V29) |
| `generate.test.mjs` / `explain.test.mjs` / `render.test.mjs` | 34 / 6 / 17 | orchestration on stubs and real modules, §9 facts, warnings, views and formats |
| `i18n.test.mjs` | 18 | every sample in EN + ES, all views, markdown + text: no undefined, no placeholder, no raw key or engine code |
| `determinism.test.mjs` | 10 | twice-identical, shuffled keys, no clock / random / Intl in engine sources |
| `review-v12.test.mjs` | 81 | one regression test per fixed coach-eye review issue on the 8 sample plans (IDs as in `samples/REVIEW_LOG.md`) |
| `invariants/invariants.test.mjs` | 224 (6 todo) | 8 samples x 2 models + 300 random + 52 sports + 26 activities: generate ok, every error check, independent re-checks of H01-H22, no same-day duplicate, rep-max tests on bilateral lifts |

## 7. Known limits (Phase 0)

* Session time vs. volume is the main open coaching question: with 2-4 exercises per group and the floor of 10, short or very full
  weeks either run long (`warning.long_day`) or stop adding sets before the peak (`warning.stairway_time`). See `samples/SAMPLES.md`.
* Athletic weekly budgets (04) are reported next to what the slots prescribe, not enforced (D-63).
* Check-in adaptation is partial (the stairway waits; finer rows need hooks, CONTRACT_REQUESTS B4) and all Spanish is PROPOSED.
* Round-3 defaults in use are listed per plan in `meta.r3_pending`.
