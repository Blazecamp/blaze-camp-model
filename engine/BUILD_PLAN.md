# Blaze Camp engine — BUILD PLAN (Phase 0, v1.1)

> **Status (2026-10-11, engine 0.5.0).** History. This is the build plan of the first engine (four parallel builders, contracts/1.1, October 8-9). Engine 0.5.0 was built to `design/ENGINE_V05_PLAN.md` (template-first, no time-fitting). Lines below about session minutes, time fitting, check-ins or the 7 % / 10 % limits describe that first build and are retired (COACH-CT CT-01; COACH-CX CX-01..04; COACH-R3 R3-VOL-02; round 4). Current state: `engine/README.md` and `samples/STATUS_v0.5.md`.

**Status (2026-10-09): integration step done** - contracts/1.1.1, `node --test tests/` 621 / 621 green, the 8 sample plans generate
from `model/` with zero failing error checks. How to run everything and the module map: `engine/README.md`; the samples:
`samples/SAMPLES.md`.

Owner: architect. Binding companions: `engine/CONTRACTS.md` (contracts/1.1.0: shapes, names, signatures, behaviour) and
`engine/DECISIONS.md` (every gap / conflict decision). Four builders work **in parallel**; each owns a disjoint set of files and
codes against the contract, never against another builder's half-finished code. Phase 0 is done when the 8 sample plans
generate, validate with zero failing `error` checks, render in EN and ES, and `node --test tests/` is green.

## 0. Ready now (shipped by the architect)

| Asset | Path | Notes |
|---|---|---|
| Contract | `engine/CONTRACTS.md` | binding; read §1-§9 before coding |
| Decisions | `engine/DECISIONS.md` | C-01 … C-19 (round-2 conflicts resolved), D-01 … D-45 (gaps) |
| **Fixture model** | `engine/fixtures/mini-model.json` (≈ 4 MB) | the reference compile: `rules` complete and **normative**; 731 exercises; all 30 templates + variants (1,821 stations); 127 profiles + 52-sport picker + 26 activities; EN complete, ES partial (866 keys on purpose → fallback path) |
| Fixture builder / checker | `tools/fixture/build-fixture.mjs`, `catalog.mjs`, `rules.mjs`, `templates-profiles.mjs`, `i18n.mjs`, `i18n-v11.mjs`, `check-fixture.mjs` | `node tools/fixture/build-fixture.mjs && node tools/fixture/check-fixture.mjs` → 0 errors, 0 warnings. Only the architect / integrator edits these (B1 copies code from them) |
| Sample intakes | `samples/intakes/01-swimming.json` … `08-pickleball-genpop.json` | intake/2; the coach's R2-GEN-07 list + the pickleball bonus; acceptance numbers in CONTRACTS §9 |
| Shared code | `engine/util.mjs`, `engine/model.mjs`, `engine/version.mjs` | first working versions (smoke-tested on the fixture) so B2 / B3 start at once; **owner B4** from now on |
| Retired | `samples/_retired_v1_0/intakes/` | v1.0 intakes (intake/1); never run |

Load the fixture in tests exactly like this (B4 puts it in `tests/helpers/models.mjs` on day 1; until then copy the 4 lines):

```js
import fs from 'node:fs'; import { loadModel } from '../../engine/model.mjs';
const raw = JSON.parse(fs.readFileSync(new URL('../../engine/fixtures/mini-model.json', import.meta.url), 'utf8'));
delete raw._fixture;
export const model = loadModel(raw);
```

## 1. Who owns what

| Builder | Owns (creates / edits) | Must not touch |
|---|---|---|
| **B1 model compiler** | `tools/compile-model.mjs`, `tools/check-model.mjs`, `model/**` (manifest, catalog, rules, templates, profiles, i18n/en, es, es_review, MODEL_VERSION, CHANGELOG.md, COMPILE_REPORT.json), `tests/compile.test.mjs` | `engine/**`, `tools/fixture/**` (copy code from it instead) |
| **B2 intake · shape · volume** | `engine/intake.mjs`, `engine/shape.mjs`, `engine/volume.mjs`, `tests/intake.test.mjs`, `tests/shape.test.mjs`, `tests/volume.test.mjs`, `tests/helpers/simple-layout.mjs` | other engine files |
| **B3 week · select · dose** | `engine/week.mjs`, `engine/select.mjs`, `engine/dose.mjs`, `tests/week.test.mjs`, `tests/select.test.mjs`, `tests/dose.test.mjs`, `tests/helpers/stub-derived.mjs` | other engine files |
| **B4 integrator** | `engine/util.mjs`, `engine/model.mjs`, `engine/version.mjs`, `engine/validate.mjs`, `engine/explain.mjs`, `engine/render.mjs`, `engine/generate.mjs`, `tools/generate-samples.mjs`, `tests/helpers/models.mjs`, `tests/helpers/random-intake.mjs`, `tests/helpers/stub-modules.mjs`, `tests/fixtures/plan-min.json`, `tests/model.test.mjs`, `tests/validate.test.mjs`, `tests/explain.test.mjs`, `tests/render.test.mjs`, `tests/generate.test.mjs`, `tests/invariants/**`, `tests/determinism.test.mjs`, `tests/i18n.test.mjs`, `samples/plans/**` (generated) | other engine files (B4 may fix wiring bugs in any file **only in the integration step**, after the builders report) |

**Contract changes**: nobody edits `CONTRACTS.md` / `DECISIONS.md` during the build. Need a change? Append to
`engine/CONTRACT_REQUESTS.md` (`## <builder> · <section> · <one-line ask>` + why + the fallback you implemented). Keep coding
against your best reading; the integrator resolves the requests and updates the contract + fixture.

## 2. Dependencies and what to stub while the others build

```
          sources (read-only)                fixture (ready)  util/model (ready)
               │                                    │                │
   B1 compile-model ──► model/*  ··· later ··► tests run on both fixture and model/
                                                    │
   B2 intake ─► derived ─► shape ─► volume.computeTargets / stairwayPlan / planWeeklySets / athleticBudget
                    │          │                ▲ needs WeekLayout[] + Selection[] + fillSlot (B3)  → stub: simple-layout
   B3          week.buildWeekLayout ─► select.selectBlock ─► dose.doseItem
                    ▲ needs Derived + Shape + Targets (B2)                     → stub: stub-derived
   B4 generate (orchestrator) ─► validate ─► explain ─► render ─► tools/generate-samples
                    ▲ needs everything                                        → stub: stub-modules + plan-min.json
```

| Builder | Needs from others | Stub it with (owner writes, contract-shaped, kept as a test helper) |
|---|---|---|
| B1 | nothing (sources + `tools/fixture/*.mjs` as the executable reading of §3) | — |
| B2 | `WeekLayout` (B3), `Selection` / `fillSlot` (B3) for `planWeeklySets` | **`tests/helpers/simple-layout.mjs`**: `simpleLayout(model, templateId, variant, weekdays, minutes)` → a `WeekLayout` that maps the template's planned days onto the weekdays in order and turns every station with `include_from_minutes ≤ minutes` into a `SlotDef` (`slot_id = weekday + '.' + station.id`, `default_sets` per `rules.session.default_sets`, no cuts, no aerobic placement); `simpleFill(slot, model)` → `SlotFill` with the first record of `model.bySlot(bucket)` that is `isDefaultIn` and has no `kb_swing` tag in an `RP_*` slot, `swaps: []`. Enough for credits, placement and the 10 % guard. |
| B3 | `Derived` (D1-D14), `Shape`, `Targets` (B2) | **`tests/helpers/stub-derived.mjs`**: `stubDerived(sampleName, model)` → a `Derived` hand-built from the intake + the CONTRACTS §9 table (D1, D2, D3, D6, D7, D8 tokens via the rules, D10, D11, D13, D14, `prefs`, `weekdays`, `session_minutes`, `pain`, `age`), `D9` = §9 starts / caps; `stubShape(sampleName)` → one stairway block of N weeks (soccer: 1-6 stairway + 7-8 pre-season) with `stair(N)` fields. Replace with the real B2 functions as soon as they land (the tests must pass with both). |
| B4 | all engine modules | **`tests/helpers/stub-modules.mjs`**: contract-shaped stubs of every B2 / B3 export returning the smallest valid values; `generate.mjs` exposes `generateWith(deps, intake, model, opts)` (deps = the module functions) and `generate = (i, m, o) => generateWith(REAL, i, m, o)`, so B4 tests the orchestrator with stubs. **`tests/fixtures/plan-min.json`**: a hand-written `plan/2` (one stairway week, two days, ~12 items) that passes every check; `validate.test.mjs` mutates copies of it to trigger each V / H check (bands, spine same day, H before V, missing release, lifestyle key, 1 exercise in a group, drop inside a stairway, test mid-block …). Render tests use the same file. |

Rules for stubs: same exported names and shapes as the contract; deterministic; no shortcuts that would hide a contract bug
(e.g. B3 must not invent fields `Derived` does not have). Once the real module exists, every test runs against it.

## 3. Work packages and definition of done

### B1 — model compiler (`tools/compile-model.mjs`, `tools/check-model.mjs`)
1. Port / extend `tools/fixture/*.mjs` into a CLI that writes `model/*.json` exactly per CONTRACTS §3 (relative paths from
   `import.meta.url`; `--out` dir; no timestamps; `sources_sha256` with `node:crypto`).
2. `rules.json` **deep-equals** the fixture's `rules` (assert in `compile.test.mjs`). Any value you believe is wrong → `CONTRACT_REQUESTS.md`.
3. Catalog: every active 02 v1.1 record (expect 731 kept / 208 dropped; log each drop reason); coach corrections from
   `generator_spec_v1.json > rule_tables.library_decisions` and 02 `v1_1_changes` applied and listed in `model/CHANGELOG.md`;
   the compile **fails** if a patch target is missing.
4. Templates (30) and profiles (127 + picker + activities) per §3.4 / §3.5 (same output as the fixture builder).
5. **Spanish**: translate every exercise name and cue, day label, slot / block name, profile / sport / position / activity name
   missing from ES, in neutral Latin American Spanish with the English gym term in brackets (R2-GEN-08). Mark every
   machine-translated line in `model/i18n/es_review.json > machine_translated`; `missing_keys` must end empty for keys used by the
   8 sample plans. Never edit copy marked `[LEGAL REVIEW]` (take it verbatim from the spec).
6. `tools/check-model.mjs`: `assertModel` + `check-fixture` checks on the assembled model + i18n coverage.
7. DoD: `node tools/compile-model.mjs && node tools/check-model.mjs` exit 0; `node --test tests/compile.test.mjs` green; report
   counts (kept / dropped / aliases / templates built-unbuilt / ES machine-translated).

### B2 — intake, shape, volume
1. `intake.mjs`: §2.1 validation + normalization (all errors / warnings listed there), `safetyScreen` (coach bypass), `checkRelease`,
   `deriveValues` D1-D14 exactly as §4.3 (D2's 7 steps; D3 L3 rule; D4 thresholds; D8 kit; D11 heavy play week; D12 planned step
   only; D13; D14 with cardio adjust and activity replacement).
2. `shape.mjs`: training blocks (incl. the season overlay D-10), exercise blocks, stairway fields per week, tests, circuits (§4.4).
3. `volume.mjs`: `computeTargets` (order of operations, floor, cap rule D-02, priority, pain, ratios, calves), `stairwayPlan`
   (λ bisection, T(N) = cap), `planWeeklySets` (week-1 fit, VOL-07 placement, alternating days, bonus / focus, strict < 10 % with
   staggering, shortfalls → `warning.floor_schedule`, pre-season / taper / in-season / maintenance / recovery / circuit / year-Q1 flat
   rules), `athleticBudget`, `weeklyCredits` (§4.5).
4. Tests (required numbers in CONTRACTS §8): the single-muscle stairways (L1 / L2 / L3, 12 and 8 weeks), every §9 start / cap / λ /
   T curve for the 8 samples, soccer shape, circuit seconds, floor lifts 7.5 → 10, priority lands on 30, total rise < 10 % with
   staggering, pain freeze, KB swing 0, thruster 1 / 0.5 / 0.25, intake errors for `sleep` / `stress` / `sex` keys and a missing release.
5. DoD: `node --test tests/intake.test.mjs tests/shape.test.mjs tests/volume.test.mjs` green against the fixture (and against
   `model/` when present).

### B3 — week, select, dose
1. `week.mjs`: template + variant, weekday mapping (optional days skip play / game days), stations → slots (minutes, conditions,
   older defaults, prehab), block order, core position, pairing, supersets, split-day caps vs full-body days (2-4 per group, never
   cut below 2), athlete cap 12, warm-up, skill / WOD, aerobic placement and colours (cardio adjust, activity replacement,
   sport-is-aerobic), `layoutForWeek`, `estimateMinutes` (§4.6).
2. `select.mjs`: hard filters 1-11 in order (incl. older default / opt-in, 50-59 racket rules, youth floor lifts, two spine days
   never the same day, KB swing never in RP slots), scoring, plyo / ballistic share by exercise block, Olympic tier and station
   family, laterality share, contra / ipsi, swaps 2-4, block changes / one-detail variations (§4.7).
3. `dose.mjs`: rep class and column, VOL phases, preference, pyramid, per-side, planned RIR from the stairway (min 1 on compounds),
   MAX / MYO rules, rest, load (week-1 tip, power language, ramp, full catch 3-5, loaded jumps, medball ≤ 20, wall balls), athletic
   counts and the session contact cap, tests in test weeks, WOD / skill / circuit doses, notes (§4.8).
4. Tests: every hard rule the modules own (H02-H07, H09, H11, H12, H18 at day level, D-30 exemption), the §9 template / weekday /
   aerobic / Olympic / prehab facts for each sample, swaps never break H01 / H12, determinism of picks (same seed → same pick).
5. DoD: `node --test tests/week.test.mjs tests/select.test.mjs tests/dose.test.mjs` green with `stub-derived` **and** with B2's real
   modules once present.

### B4 — model access, validation, explanation, rendering, orchestration, samples, test scaffold
1. Day 1: `tests/helpers/models.mjs`, `tests/helpers/random-intake.mjs`, `tests/fixtures/plan-min.json`, `tests/helpers/stub-modules.mjs`;
   complete `util.mjs` typedefs (copy §4.0) and `model.mjs > assertModel` (every §3 shape).
2. `validate.mjs`: V1-V26, H01-H22 exactly per §6 (pure; recomputes credits, stairway steps and group counts).
3. `explain.mjs`, `render.mjs` (full / block / week / day views, EN and ES, phone-friendly, instruction block first, release stamp,
   YouTube search links, no hard-coded words, never renders template notes), `generate.mjs` (`generateWith` + `generate` + `adapt`
   with checkin/2 rows; `adapt(plan, [])` byte-identical).
4. `tools/generate-samples.mjs` → `samples/plans/<name>.json`, `<name>.<lang>.md` (+ `.en.md` for ES intakes); summary line per sample.
5. Tests: `validate.test.mjs` (one failing mutation per check), `render.test.mjs`, `generate.test.mjs`, `invariants/invariants.test.mjs`
   (8 samples + 300 seeded random intakes; every error check passes; explicit H01-H22 properties from CONTRACTS §8),
   `determinism.test.mjs` (twice-identical, key-order-independent, source grep for clock / random / Intl), `i18n.test.mjs`.
6. DoD: `node --test tests/` green (B2 / B3 module tests included); `node tools/generate-samples.mjs --fixture` writes 8 plans with
   zero failing error checks (warnings allowed and listed); EN + ES markdown readable.

## 4. Integration step (after the four builders report)

Order: (1) `node tools/compile-model.mjs` → (2) `node tools/check-model.mjs` → (3) `node --test tests/` against the fixture and the
compiled model → (4) `node tools/generate-samples.mjs` (model) → (5) read every markdown plan as the coach would (CONTRACTS §9:
template, weekdays, spine days, groups 2-4, sets per muscle week 1 → last, stair levels, RIR drift, tests, aerobic counts, Olympic
day pattern, swimmer pool = 0 cardio, pickleball 45-min warnings) → (6) resolve `CONTRACT_REQUESTS.md`, update CONTRACTS /
DECISIONS / fixture together, re-run everything. The integrator may edit any engine / tools / tests file in this step.

## 5. Commands

```
node tools/fixture/build-fixture.mjs        # rebuild the fixture (architect / integrator only)
node tools/fixture/check-fixture.mjs        # structural checks of the fixture (or any assembled model.json)
node tools/compile-model.mjs                # B1: sources -> model/
node tools/check-model.mjs                  # B1: model contract checks
node --test tests/                          # everything (Node 22; tests/package.json -> run-all.mjs). `node --test` also works
node tools/generate-samples.mjs --fixture --out <dir>   # B4: 8 sample plans from the fixture (keep samples/plans on model/)
node tools/generate-samples.mjs             # B4: 8 sample plans from model/
```

## 6. Known risks (tell the integrator if you hit them)

* **Time vs volume**: floor 10 + 2-4 exercises per group make some days long (05 v1.1 measured 60-min athletic days at ~63-72 min
  in week 1 and ~90-106 min late in the block). The contract answers with supersets, optional-day Focus / bonus slots, the cut
  order (never below 2 per group) and then warnings (`warning.long_day`, `warning.floor_schedule`), never by breaking a hard rule.
  Sample 08 (2 × 45 min) is expected to warn.
* **Spine days in templates**: the template marks the counted station (`axial: 'axial'`); select must keep every other squat /
  hinge non-counted (goblet / hack / pendulum are `second_day`, leg press / belt squat / hip thrust `not_counted`).
* **Credit-only muscles**: athletes and stay-active plans never steer glutes / arms / side delts; do not "fix" a low glute count by
  adding sets (C-15, D-07).
* **KB swings** appear only in power / WOD slots; a swing in a hip-dominant slot is a contract bug (C-04).
* **Determinism**: sort with explicit keys; no `localeCompare`; no `Set` iteration order assumptions on unsorted inserts.
