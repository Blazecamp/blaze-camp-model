# AGENTS.md: working in the Blaze Camp model repo

This file is for AI agents and developers. It tells you what the repo is, which source wins when two disagree, where every kind of rule lives, how to generate a plan, which rules must never break, and how to change things without breaking the coach's model. Read it before you edit anything.

> **Use at your own risk.** Everything here is general fitness information, not medical advice. Downloading or using this repository, or any plan generated from it, is at your own expense and risk. If you program for anyone else, you need your own health screening, liability release, insurance and privacy terms. Read [DISCLAIMER.md](DISCLAIMER.md) (EN) and [DISCLAIMER.es.md](DISCLAIMER.es.md) (ES); both are drafts pending review by a Florida attorney. License: [MIT](LICENSE), © 2026 Lalo Vera, d/b/a Blaze Camp, and BFit Studios Corp.

---

## 1. What this is

* **The model.** A machine-readable copy of how coach Lalo Vera (Blaze Camp, BFit Studios Corp.) designs strength, physique, fat-loss and athletic training. It covers how exercises are categorized, an exercise catalog (731 runtime exercises compiled from 939 source records), weekly sets per muscle and the volume "stairway", session and week templates, 127 athlete and population profiles (a 52-sport picker plus 26 "stay athletic and active" activities), periodization, testing, equipment, and English and Spanish wording.
* **The engine.** Plain JavaScript ES modules (Node 22 or a browser, no npm dependencies, no build step, deterministic). It turns one intake (goal, sport or activity, days, minutes, equipment, pain, experience) into the **whole plan at once**: a 4-6, 8 or 12-week block, or a year plan, in English or Spanish. Every decision carries a machine-readable `why`.
* **The product principle (COACH-R3 R3-VOL-02, R3-VOL-04, R3-GEN-01).** Few inputs go in and the whole plan comes out, visible ahead of time, and the person or their coach adjusts it themselves. There are no check-ins, no tracking and no adaptive inputs, and no user data is kept.

Versions on 2026-10-09 (always read the live value from the file named):

| Thing | Value | Where |
|---|---|---|
| Model (compiled runtime data) | 1.2.0 | `model/MODEL_VERSION`, `model/manifest.json` |
| Engine | 0.3.0 (0.4 in progress: round 3) | `engine/version.mjs` |
| Contracts | 1.1.1 | header of `engine/CONTRACTS.md` |
| Generator spec | 1.1.0 (moving to 1.2.0 with round 3) | `generator_spec_v1.json > _meta.version` |
| Schemas | `intake/2`, `plan/2`, `manifest/2`, `catalog/2`, `rules/2`, `templates/2`, `profiles/2` | `engine/CONTRACTS.md` §2, §3, §5 |

**Status.** Private work in progress, to be open-sourced once the coach approves. The engine produces complete, valid plans for any intake. Coach-eye reviewers grade the 8 sample plans C to D: the structure is right, but the dosing is not there yet. `samples/RECHECK_v0.3.md` lists the 136 open issues.

---

## 2. Quick start (every command below was run on this repo, Node v22)

```sh
node --test tests/                                         # whole suite: 711 tests, 705 pass, 0 fail, 6 todo (~35 s)
node tools/check-model.mjs                                 # contract checks on model/ (read-only)
node tools/generate-samples.mjs --only 08 --out /tmp/bc-plans   # one sample plan -> /tmp/bc-plans/08-pickleball-genpop.{json,en.md}
node tools/compile-model.mjs --out /tmp/bc-model           # compile the sources into a scratch dir ...
diff -rq /tmp/bc-model model && echo "model/ is up to date" # ... and compare with the committed model
```

These rewrite tracked files, so run them only when your change should update those outputs:

```sh
node tools/fixture/build-fixture.mjs && node tools/fixture/check-fixture.mjs   # engine/fixtures/mini-model.json (reference compile)
node tools/compile-model.mjs                                                  # model/*.json (exits 1 and writes nothing on a contract error)
node tools/generate-samples.mjs                                               # samples/plans/* (exits 1 if any plan fails an error check)
```

---

## 3. Authority order and evidence labels

When two sources disagree, the higher one wins:

| Rank | Source | Cited as | Ids |
|---|---|---|---|
| 1 (newest) | `coach_answers_round3.md` | `COACH-R3 <id>` | `R3-VOL-01..04`, `R3-SES-01..02`, `R3-PER-01`, `R3-ATH-01..05`, `R3-GEN-01` (13) |
| 2 | `coach_answers_round2.md` | `COACH-R2 <id>` | `R2-VOL`, `R2-SES`, `R2-PER`, `R2-ATH`, `R2-LIB`, `R2-GEN` (45 + 2 round-1 leftovers) |
| 3 | `coach_answers_full.md` | `COACH-ANSWER <id>` | `CAT UNI VOL PER ATH ORD EQ GEN LIB PRG FIX-nn` (140) |
| 4 | `coach_answers.md` | `COACH-CHAT <date>` | his earlier chat statements |
| 5 | His two Google Sheets: `raw/*.xlsx`, decoded cell by cell in `dumps/` | `OBSERVED` | cell references |
| 6 | Team work | `INFERRED` (reasoned from the sheets), `SCIENCE` (cited literature), `PROPOSED` (waiting for his approval) | |

* "RIGHT" with no text means the team's proposal is approved as his rule. The raw questionnaire answers are in `answers_raw/`, `answers_raw_r2/` and `answers_raw_r3/`.
* Text that contradicts a coach answer is a bug. A coach answer you think is scientifically questionable is **not** a bug: write it up "for discussion" and leave the rule alone.
* For engine **shapes, names, file layout and APIs**, the authority is `engine/CONTRACTS.md` (where it disagrees with `engine/fixtures/mini-model.json` on a shape, the fixture wins). Judgement calls where the sources are silent or conflict are decided once in `engine/DECISIONS.md` (`C-nn`, `D-nn`). The engine docs were written before round 3 and still name round 2 as the newest source; round 3 sits above it.
* Every rule you write needs an evidence label. Labels quoted from his sheets keep his spelling inside quotes (e.g. 'SAGITAL', 'TRIPPLE EXTENSION'); canonical ids use correct spelling. Both are intended.

---

## 4. Round 3 in one screen (approved 2026-10-09; do not undo)

* **Output only (R3-VOL-02, R3-VOL-04).** The plan is generated once with its built-in stairway; people and coaches adjust it themselves. Check-ins, weekly steps from feedback, readiness, logbook-driven changes and `adapt()` are **retired**.
* **Stairway approved (R3-VOL-04).** About 3 % a week until the halfway week, about 5 % after. Each trained group reaches its ceiling in the last week. The effort cue drifts 3 reps in reserve (RIR), then 2, then 1-2, then 1 + intensifiers in the last week, always inside 1-3 RIR.
* **When time can't fit the minimums (R3-SES-02), in this order:** (1) tell the user up front and offer another day or longer sessions; (2) if they keep their time, train fewer groups directly (big movers first; arms, calves and shoulder isolation from compound credit) rather than every group under the floor; (3) recommend supersets; (4) the stairway always climbs on the trained groups, never flat. Never squeeze 2-4 exercises per group into a day that can't hold them.
* **User editing (R3-SES-02).** Users and coaches can switch off a day's athletic block or core block, add or remove exercises or whole blocks, and the plan recommends supersets.
* **Groups (R3-SES-01).** Count focus groups: hips = glutes + hamstrings, shoulders = front + side + rear delts. Calves get one exercise × 3 sets per leg day. Field athletes get 2-4 exercises for each group trained that day, inside 12 exercises + 2 core. Cross pattern is the default for most athletes; the same-pattern athletic template is for size-focused and high-level athletes.
* **Rear delts (R3-VOL-01)** are part of the shoulders group, not a muscle of their own. The floor of 10 is counted on the shoulders group, and users and coaches can add more rear-delt work.
* **Focus muscles (R3-SES-01).** The user may pick Focus muscle 1 and Focus muscle 2 (max 2). Each gets +1 to +3 weekly sets over the balanced plan, and the stairway includes them. There is never a sex field.
* **Placement (R3-VOL-03).** An added set alternates between the two exposures of the same day type (Monday's first back exercise, then Thursday's). Extra small-muscle sets become a short bonus exercise on the optional day, or on a day that already trains that muscle, never as that day's only exercise for it.
* **Calendar (R3-PER-01).** The easy week after a block is a recommendation, not mandatory. When a block ends, it ends, and the user builds the next one. Holidays are planned between blocks.
* **Athletes (R3-ATH-01..05).** The full wording is in `coach_answers_round3.md`.
  * *Swimming dryland (R3-ATH-01):* 3 gym days + 1 optional (2 for younger or lower-level swimmers); 0 extra cardio; jumps mostly ballistic (25 % plyometric at the end of a block); Olympic lifts 2-3 days; shoulder care every session, never with bands; a 2-week dryland taper lined up with the swim taper before the main meet.
  * *60+ (R3-ATH-02):* landing drills, balance, quick stepping without a hop, light medball throws and fast machine work are on. Low ankle hops, other jumps, Olympic lifts and depth jumps are off unless switched on with the warning. Overhead and low-bar squats stay out. *Pickleball, padel and tennis 50+:* knee-friendly strength, calf and Achilles work every leg day, rotator-cuff work, and only low-impact jumps (no depth jumps, hurdle hops or bounds) unless switched on.
  * *HYROX (R3-ATH-03):* 2 strength days + 2 hybrid days, 4 cardio sessions, and 2 short station circuits a week as finishers that never count as muscle sets. Wall balls ≤ 20 lb; 40-rep / AMRAP sets only inside those circuits; 50 % plyometric.
  * *Other sports (R3-ATH-04):* plyometric share at the end of a block from 75 % (runners) down to 25 % (swimming, water polo, rowing, judo, taekwondo, climbing). Off-season cardio is 2-4 sessions, with 0 extra for swimmers, runners, rowers and endurance cyclists.
  * *Stay active (R3-ATH-05):* the user enters play days. The hardest gym day stays at least 48 h before the biggest play day, and weeks with 3+ play sessions drop the extra agility drills and half the jumps. A 45-60+ min session of the activity counts as one of the 3 cardio sessions (up to 2). With an optional event date, the hardest weeks end 1 week before the event, followed by 1 easy week at about half the sets.
* **Legal (R3-GEN-01).** A short Blaze Camp health check (EN/ES, written by a lawyer, linking to the official PAR-Q+), which a coach can skip with a warning. A "use at your own risk" checkbox plus terms and liability release every time a plan is built. Nothing is stored. MIT license to Lalo Vera / Blaze Camp / BFit Studios Corp.

**Not yet in engine 0.3.0 / model 1.2.0** (team work in progress; until it lands, treat the round-3 rule as the truth and the code as out of date):
* `adapt()`, `adaptWith()`, `checkinRow()`, the `checkin/2` schema, `output_mode: checkin | logbook`, `rules.stairway.checkin`, `plan.offers`, and `plan.mode: week_by_week` (which `validateIntake` only accepts with check-ins). These are all retired. Don't call them or build on them.
* The intake field `priority_muscles` (max 2) is today's carrier for Focus 1 / 2, but `rules.volume.priority.add` is still `L1 4 / L2 4 / L3 6` sets, not +1 to +3.
* The plan does not yet carry stable block ids, block on/off flags, superset recommendations or a "not trained directly (time)" list. When they land, they will be in `engine/CONTRACTS.md` §5.
* `"r3"` tags in `model/rules.json`, `// R3-pending:` comments and `meta.r3_pending` still mark the round-3 proposals the engine used. Round 3 is now answered, so these become plain `ref`s.
* 60+: R3-ATH-02 allows depth jumps when switched on with the warning. The engine is stricter in Phase 0 (`DECISIONS.md` D-05: depth jumps, high depth drops and snatches stay locked even with the opt-in), and stricter is the safe side.

---

## 5. Repository map

| Path | What it is | Edit? |
|---|---|---|
| `BLAZE_CAMP_BRAIN.md` | **Master document** (start here): philosophy, categories, levels, volume engine, bilateral vs unilateral, variables, equipment, athletes and sports, templates, plan types, testing, generator, product | yes, with labels |
| `generator_spec_v1.json` | The same model as a machine spec: `inputs_schema`, `derived_values` (D1-D14), `vocab`, `rule_tables`, `template_refs`, `plan_types`, `tests`, `adaptation` (retired by round 3), `coach_rule_hooks`, `pipeline`, `validation_checks`, `output`, `open_decisions` | yes, with labels |
| `synthesis/` | Detailed model docs (`.md`, most with a `.json` twin): 01 taxonomy, 02 exercise catalog, 03 volume dosing, 04 athlete profiles, 05 session architecture, 06 periodization, 07 science lineage, 08 open questions, 09 generator inputs, 10 / 10b equipment, 11 training variables, 12 volume algorithm, 13 product options; `sports/` (per-group sport research, merged into 04) | yes, with labels |
| `coach_answers*.md`, `answers_raw*/` | The coach's own answers | **never** |
| `raw/`, `dumps/`, `dump.py` | His two workbooks ("BUILD YOUR OWN PROGRAM" = BYOP, "MASTER MODEL") as `.xlsx`, and every tab as text produced by `dump.py` | **never** (regenerate only) |
| `analysis/` | First-pass decode of the library, the reference tabs and every program (`analysis/programs/*.md`) | rarely |
| `model/` | Compiled runtime model: `manifest.json`, `catalog.json`, `rules.json`, `templates.json`, `profiles.json`, `i18n/{en,es,es_review}.json`, `MODEL_VERSION`, `CHANGELOG.md`, `COMPILE_REPORT.json` | **generated**, never by hand |
| `engine/` | The plan engine (`*.mjs`) + `README.md`, `CONTRACTS.md`, `DECISIONS.md`, `BUILD_PLAN.md`, `CONTRACT_REQUESTS.md`; `fixtures/mini-model.json` (reference compile, generated) | yes, per §11 |
| `tools/` | CLIs (the only code with file I/O): `compile-model.mjs` + `compile/*.mjs` (+ `compile/es/` Spanish tables), `check-model.mjs`, `generate-samples.mjs`, `fixture/*.mjs` (reference fixture builder and the v1.2 amendment layer `fixture/review-v12.mjs`) | yes |
| `tests/` | `node:test` suites, `helpers/`, `invariants/`, `fixtures/plan-min.json`, `run-all.mjs` + `package.json` (make `node --test tests/` work) | yes |
| `samples/` | `intakes/` (the coach's 7 sample clients + a 52-year-old pickleball player), `plans/` (generated JSON + Markdown, two also in Spanish), `SAMPLES.md`, `REVIEW_LOG.md`, `RECHECK_v0.3.md`, `_retired_v1_0/` | intakes yes; plans generated |
| `coverage_matrix*.md` | Each coach answer → master section + spec key | yes |
| `round2_questions.json`, `round3_questions.json`, `coach-questions.html` | The questionnaire content and page | rarely |
| `BLAZE_CAMP_BRAIN_v*.md`, `generator_spec_v0.json` | Earlier snapshots of the master and the spec | **never** |
| `workflows/` | Multi-agent workflow scripts used to build the model | rarely |
| `README.md`, `REVIEW_GUIDE.md`, `LICENSE`, `DISCLAIMER.md`, `DISCLAIMER.es.md` | Overview, reviewer guide, MIT license, liability release drafts (attorney review pending) | LICENSE / DISCLAIMER: **never** without the owner |

---

## 6. Where each kind of rule lives

Human docs explain the rule. The compiler reads the machine sources (the spec and the `synthesis/*.json` files). The engine reads only `model/`. Key paths use `>` for nesting.

| Topic | Coach ids | Human docs | Machine source | Runtime key (`model/`) | Engine / checks |
|---|---|---|---|---|---|
| Muscles, focus groups, credits (1.0 prime, 0.25 helpers, dips 0.5 / 0.5, thruster 1 / 0.5 / 0.25, KB swings 0) | VOL-09, VOL-10, LIB-16, R2-VOL-05, R3-SES-01, R3-VOL-01 | BRAIN §5; `synthesis/03_volume_dosing.md` | spec `rule_tables > muscles, counting`; `synthesis/12_volume_algorithm_v1.json > counting` | `rules.json > muscles` (`order`, `defs`, `groups`), `credit` (`classes`, `helper`, `never_credit_tags`); `catalog.json > exercises[].credit_class, credits` | `volume.mjs`; V14 / H08, H09 |
| Weekly sets: start, cap, floor 10, Focus / priority, pain, goal modifiers | VOL-*, R2-VOL-04, R2-VOL-06, R3-VOL-01, R3-SES-01 | BRAIN §5; `synthesis/12_volume_algorithm_v1.md` | spec `rule_tables > weekly_sets, priority, pain, goal_phase_modifiers`; 12 `> starting_table, priority, pain, goal_phase_modifiers` | `rules.json > volume` (`start`, `cap`, `floor`, `priority`, `pain`, `modifiers`, `phase_factors`) | `volume.computeTargets`; V13, V22 / H17 |
| Stairway and effort drift | R2-PER-03, R2-PER-04, R2-PER-05, R3-VOL-04 | BRAIN §5; 12 §3.7 | spec `rule_tables > rate_engine, banking`; 12 `> stairway` | `rules.json > stairway` (`standard_steps`, `halfway`, `lambda`, `by_N`, `limits`, `release`), `effort` (`rir_band`, `planned_map`) | `volume.stairwayPlan / planWeeklySets`, `dose.mjs`; V15 / H10, H21, V17 / H02 |
| Set placement (first exercises first, alternate exposures, bonus slots) | VOL-07, ORD-11, R3-VOL-03 | 12 | spec `rule_tables > set_placement`; 12 `> set_placement` | `rules.json > placement` | `volume.planWeeklySets` |
| Session limits, time model, cuts, supersets | R2-SES-04, R2-SES-05, R3-SES-02 | BRAIN §10; `synthesis/05_session_architecture.md` | spec `rule_tables > session_limits, time_model, supersets_contrast_circuits`; 12 `> session_limits, time_model` | `rules.json > session`, `time_model`, `cut_order`, `supersets` | `week.mjs` (`estimateMinutes`); V18, V23 / H18 |
| Order and pairing (core first, power before strength, H before V, hip + push / knee + pull) | ORD-*, UNI-11, GEN-08, R2-SES-03 | BRAIN §7, §10; `synthesis/11_training_variables.md` | spec `rule_tables > ordering, pairing`; 11 `> ordering_rules` | `rules.json > ordering`, `pairing`, `core_block` | `week.mjs`; V11 / H06, V12 / H03-H05 |
| Two spine days | PER-04, EQ-11, R2-SES-01, R2-SES-02 | BRAIN §5, §8 | spec `rule_tables > axial_loading`; 02 records `axial_spinal_load.spine_day_v1_1` | `rules.json > axial`; `catalog.json > exercises[].axial, spine_class, axial_pattern` | `select.mjs`; V10 / H07 |
| Bilateral vs unilateral share | UNI-* | BRAIN §6 | spec `rule_tables > bilateral_unilateral`; 12 `> bilateral_share` | `rules.json > bilateral_share`, `contra_ipsi`, `frontal_transverse` | `intake` (D10), `select.mjs`; V28 (warn) |
| Reps, effort, rest, load hints | VOL-13, VOL-15, GEN-08, R2-VOL-02 | BRAIN §7; `synthesis/11_training_variables.md` | spec `rule_tables > reps, effort, rest` | `rules.json > reps`, `effort`, `rest` | `dose.mjs`; V17 / H02 |
| Exercise catalog | CAT-*, LIB-*, EQ-*, R2-LIB-* | `synthesis/02_exercise_catalog.md` | `synthesis/02_exercise_catalog.json` (array of 939 source records); coach patches `tools/compile/patches.mjs`; amendments `tools/fixture/review-v12.mjs > amendExercise` | `catalog.json > exercises[]` (731), `id_aliases` | `select.mjs`; V9 / H01 |
| Equipment, kit tokens, constraint 1-5 | EQ-* | BRAIN §8; `synthesis/10_equipment_model.md` | spec `rule_tables > equipment`; `synthesis/10_equipment_model.json > kit_tokens, access_profiles, client_families` | `rules.json > equipment` (`profiles`, `machines`, `banned_tokens`, `client_families`) | `intake` (D7, D8), `select.mjs`; V7, V9 |
| Week and day templates | PRG-*, R2-SES-*, R3-SES-01 | BRAIN §10; `synthesis/05_session_architecture.md` | `synthesis/05_templates.json > generator_split_templates`; amendments `review-v12.mjs > amendTemplates` | `templates.json > families`, `buckets`, `goal_to_family`; `rules.json > template_select` | `intake` (D6), `week.mjs` |
| Athletes, sports, positions, activities, age overlays | ATH-*, R2-ATH-*, R3-ATH-01..05 | BRAIN §9; `synthesis/04_athlete_profiles.md` | `synthesis/04_profiles.json > profiles` (127), `sports.list` (52), `activities.list` (26), `age_overlays`, `goal_defaults` | `profiles.json > sports`, `picker`; `rules.json > athletic`, `olympic`, `medball`, `population` (`older`, `active_aging_50`, `youth`), `prehab` | `intake` (D2, D11), `budget.mjs`, `select.mjs`, `dose.mjs`; V5 / H12, V16 / H11, V19, V27 |
| Conditioning and aerobic colours | ATH-*, R3-ATH-03, R3-ATH-05 | BRAIN §9 | spec `rule_tables > conditioning` | `rules.json > conditioning` | `intake` (D14), `week.mjs`, `dose.doseAerobic` |
| Plan types, seasons, recovery week, next cycle | PER-*, R2-PER-*, R3-PER-01 | BRAIN §11; `synthesis/06_periodization.md` | spec `plan_types`; `synthesis/06_periodization.json` | `rules.json > plan_types`, `recovery`, `cycles` | `shape.mjs`; V24 / H15 |
| Tests (baseline and end only) | R2-PER-07 | BRAIN §12 | spec `tests` | `rules.json > tests` | `shape.mjs`, `dose.mjs`, `generate.mjs` (D-46); V25 / H19 |
| Intake fields | GEN-*, R2-GEN-*, R3-SES-01 | BRAIN §13; `synthesis/09_generator_inputs.md`, `13_product_options.md` | spec `inputs_schema > fields` (F00-F46) | n/a (shape in CONTRACTS §2.1) | `intake.validateIntake`; V26 / H13, H16 |
| Health check, release, legal copy | R2-GEN-03, R3-GEN-01 | `DISCLAIMER*.md`; BRAIN §14 | spec `inputs_schema > copy_placeholders`, `output > copy` (`[LEGAL REVIEW]`, verbatim) | `i18n/*.json > health.*, release.*` | `intake.safetyScreen / checkRelease`; V1, V21 / H20 |
| Words, EN and ES | GEN-01, R2-GEN-08 | | `tools/compile/i18n.mjs`, `tools/compile/es/*.mjs` | `i18n/en.json`, `es.json`, `es_review.json` (machine-translated lines pending his approval) | `render.mjs`, `explain.mjs`; H14 |
| Locked rules and validation registry | GEN-08 + all hard rules | | spec `validation_checks`, `coach_rule_hooks` | `rules.json > locked` (LK01-LK18), `validation > checks` (V1-V29), `validation > hard` (H01-H22) | `validate.mjs` |
| Check-ins (**RETIRED**, R3-VOL-02 / R3-VOL-04) | R2-VOL-01, R2-GEN-01 | | spec `adaptation` | `rules.json > stairway > checkin` | `generate.adapt` (being removed); H22 |

---

## 7. How a rule flows from source to plan

```
coach answers ─┐
sheets (dumps) ┼─> BLAZE_CAMP_BRAIN.md, synthesis/*.md   (human, labelled)
team work ─────┘          │
                          v
   generator_spec_v1.json + synthesis/{02,03,04,05,06,10,11,12}*.json + coach_answers_round2.md   (what the compiler reads)
                          │  tools/compile-model.mjs  (+ tools/compile/*.mjs, coach patches, tools/fixture/review-v12.mjs amendments)
                          v
   model/*.json  ── loadModel(raw) ──>  generate(intake, model)  ──>  plan/2 JSON (codes + why, no prose)
                                                                      └─ renderPlan(plan, model, {lang}) ──> Markdown / text, EN or ES
```

* `tools/fixture/rules.mjs` (the architect's normative reading) and `tools/compile/rules.mjs` (the compiler's port) both build `rules`. `model/rules.json` must deep-equal the fixture's `rules` (`tests/compile.test.mjs`). The v1.2 amendment layer `tools/fixture/review-v12.mjs` (`amendRules`, `amendExercise`, `amendTemplates`, `amendSport`) is shared by both builders, so a rule change made there reaches both.
* The compiler does not read `BLAZE_CAMP_BRAIN.md` or `coach_answers_round3.md`. A round-3 number reaches the engine only through the spec / synthesis JSON plus the rule builders or the amendment layer.
* The compiler cross-checks key numbers against the sources (`tools/compile/crosscheck.mjs`, results in `model/COMPILE_REPORT.json`) and records every coach-correction patch in `model/CHANGELOG.md`.

---

## 8. Generate a plan

### 8.1 Command line (the sample intakes)

```sh
node tools/generate-samples.mjs --only 03 --out /tmp/bc-plans   # samples/intakes/03-*.json -> /tmp/bc-plans/03-soccer.{json,en.md,es.md}
node tools/generate-samples.mjs --fixture --out /tmp/bc-plans   # the same, from the reference fixture model
```

It prints one line per sample (template, training blocks, total sets week 1 → last, failing checks, warnings) and exits 1 if any plan is not `ok` or fails an `error` check. Leave out `--out` only when you mean to update `samples/plans/`.

### 8.2 From JavaScript (any intake)

Save as `try-plan.mjs` in the repo root, then run `node try-plan.mjs` (built-in minimal intake) or `node try-plan.mjs samples/intakes/03-soccer.json`. Both were run on engine 0.3.0 / model 1.2.0.

```js
// try-plan.mjs - save in the repo root, then: node try-plan.mjs [path/to/intake.json]
import fs from 'node:fs';
import { loadModel } from './engine/model.mjs';
import { generate } from './engine/generate.mjs';
import { renderPlan } from './engine/render.mjs';

// 1. Load the compiled model (the engine itself never reads files; you pass it plain objects).
const read = (f) => JSON.parse(fs.readFileSync(`model/${f}`, 'utf8'));
const model = loadModel({
  manifest: read('manifest.json'), catalog: read('catalog.json'), rules: read('rules.json'),
  templates: read('templates.json'), profiles: read('profiles.json'),
  i18n: { en: read('i18n/en.json'), es: read('i18n/es.json'), es_review: read('i18n/es_review.json') },
});

// 2. An intake/2 object: a file you pass, or this minimal one (every other field takes its default).
const intake = process.argv[2] ? JSON.parse(fs.readFileSync(process.argv[2], 'utf8')) : {
  schema: 'intake/2',
  role: 'self',
  safety: { heart: false, surgery_6mo: false, pregnant_postpartum_6mo: false, injury_in_treatment: false, doctor_said_no: false },
  release: { accepted: true, version: 'release.client', lang: 'en' },   // the release is ticked for THIS build (H20)
  age: 34,
  body_weight: { value: 170, unit: 'lb' },
  experience: { years_consistent: 2 },
  goal: 'muscle',
  schedule: { days_per_week: 4, weekdays: ['Mon', 'Tue', 'Thu', 'Fri'], session_minutes: 60, start_date: '2026-10-12' },
  equipment: { profile: 'FULL_GYM' },
  pain: [],
};

// 3. Generate once (pure and deterministic), check it, render it.
const plan = generate(intake, model);
if (plan.status !== 'ok') { console.log(plan.status, JSON.stringify(plan.errors.length ? plan.errors : plan.refer)); process.exit(1); }
console.log(plan.status, 'valid:', plan.validation.ok, '| template:', plan.meta.template.id, '|', plan.weeks.length, 'weeks');
console.log('total sets by week:', plan.summary.total_resistance_sets_by_week.join(' '));
console.log(renderPlan(plan, model, { lang: 'en', view: 'week', weeks: [1] }).split('\n').slice(0, 8).join('\n'));
// renderPlan options: lang 'en' | 'es', view 'full' | 'block' | 'week' | 'day', format 'markdown' | 'text', weeks 'all' | [n, ...]
```

Output with the built-in intake: `ok valid: true | template: aesthetics.4 | 12 weeks`, total sets 97 → 108 across the 12 weeks, then the week-1 card. (`tests/helpers/models.mjs > loadCompiledModel()` and `tools/generate-samples.mjs` load the model the same way.)

### 8.3 What `generate` returns

| `plan.status` | When | Content |
|---|---|---|
| `ok` | valid intake, cleared health check | full `plan/2`; `plan.validation.ok` is true when no `error` check fails; `meta.warnings` lists advisories (e.g. `warning.floor_schedule`, `warning.long_day`, `warning.stairway_time`) |
| `invalid` | missing or out-of-range field, forbidden key (`sex`, `gender`, `sleep`, `stress`, `recovery`, `job`, `life`, `energy` …), release not accepted or wrong version | `errors[]` such as `{code: 'forbidden_key', field: 'sex'}` or `{code: 'release_missing', field: 'release.accepted'}`; no weeks |
| `refer` | any health-check answer true (unless a coach chose `health_route: coach_own_sop`), or any `severe` pain (always) | `refer.reasons`, e.g. `["refer.reason.heart"]`; no weeks |

* **Intake shape:** `engine/CONTRACTS.md` §2.1 (`intake/2`), with every field, enum and default. The full examples are in `samples/intakes/*.json`. `role: 'client'` (coach mode) needs `health_route` and `release.version: 'release.coach'`; under 18 needs `release.minor` with `guardian: true`.
* **Deterministic:** the same intake and model give a byte-identical plan. There is no clock, no randomness and no `Intl`, and tie-breaks are seeded from the intake hash.
* **Pure:** engine files import only other `engine/*.mjs` files and do no I/O, so they run unchanged in a browser and store nothing.

---

## 9. Plan JSON schema

* **`plan/2` is defined in `engine/CONTRACTS.md` §5**, with the key order, every field and the rules for refer and invalid plans. Related: §2.1 `intake/2`, §3 the model files, §4.0 JSDoc typedefs, §6 the validation checks (V1-V29, H01-H22), §7 the why-code registry.
* Real examples: `samples/plans/*.json` (8 full plans). Minimal: `tests/fixtures/plan-min.json` (passes every check; used by the validate and render tests).
* Top level: `schema status model_version engine_version contracts_version seed intake_hash lang units release_stamp refer errors offers meta shape weeks summary validation`.
  `weeks[]` → `days[]` → `blocks[]` (`kind position movable circuit items`) → `items[]` (exercise id, sets, reps, effort `{rir, rpe}`, rest, load, credits, swaps, notes, `why`).
* The plan holds **codes and i18n keys only**, never prose. Words come from `model.t(lang, key, args)` at render time. Every non-trivial decision has `why: [{key, ref, args}]`, where `ref` is a coach id (`R2-SES-01`), a rule id (`V10`) or a decision id (`D-46`).
* Round-3 additions (block ids and on/off flags, superset recommendations, the "not trained directly" list, focus muscles) are being added in engine 0.4. Read §5 for the final key names before you depend on them.

---

## 10. Hard rules: never break these

Each one is a locked rule (`rules.json > locked`), a validation check, and a test. If a change makes any of them fail, the change is wrong.

| Id | Rule | Source |
|---|---|---|
| H01 | No bands, chains or weight releasers anywhere (exercise, swap, kit token, name, id) | EQ-01, EQ-07, EQ-08, EQ-12 |
| H02 | Never to failure on heavy compounds: effort stays inside 1-3 reps in reserve (min 1 on compounds); `MAX` only on the last set of small-muscle or bodyweight work; `MYO` only on the day's last machine or isolation exercise | GEN-08, VOL-13, VOL-15, R3-VOL-04 |
| H03 | Power before strength | ORD-03, GEN-08 |
| H04 | Horizontal before vertical (pull and push), unless the vertical lift is the day's main `work` (D-30) | ORD-01, ORD-02 |
| H05 | Core block first by default and never skipped on a training day. In round 3 the user or coach may switch it off themselves (R3-SES-02); the engine never drops it on its own | ATH-11, R2-SES-03, R3-SES-02 |
| H06 | Hip-dominant lower with a push, knee-dominant lower with a pull | UNI-11, ORD-06 |
| H07 | Two spine days: at most one counted heavy squat and one counted heavy hinge a week, never on the same day | PER-04, EQ-11, R2-SES-01, R2-SES-02 |
| H08 | Credits: prime mover 1.0, helpers 0.25; dips 0.5 triceps + 0.5 chest; thruster 1.0 quads + 0.5 front delts + 0.25 glutes; face pull rear delts 1.0 + side 0.25 | VOL-09, LIB-16, R2-VOL-05, R2-LIB-04 |
| H09 | Athletic work (plyos, ballistics, KB swings, throws, Olympic lifts, sprints, change of direction, conditioning, WODs, HYROX station circuits) never counts toward muscle sets | VOL-10, R2-VOL-05, R3-ATH-03 |
| H10 | Planned step ≤ 7 % per muscle; the total weekly resistance sets rise by strictly less than 10 % | UNI-05, R2-VOL-01 |
| H11 | No medball in physique (`muscle` goal) main work; no medball or wall ball above 20 lb anywhere | ATH-05, EQ-06, R3-ATH-03 |
| H12 | Never overhead or low-bar squats for 60+; 60+ default: no Olympic lifts, plyos, jumps or depth jumps unless switched on with the warning (engine Phase 0 keeps depth jumps, high depth drops and snatches locked, D-05) | EQ-03, R2-ATH-08, R3-ATH-02 |
| H13 | **No sex or gender field**, anywhere | GEN-02, ATH-09 |
| H14 | English default with a full Spanish twin; every user-facing string goes through i18n | GEN-01, R2-GEN-08 |
| H15 | No deload or maintenance week inside a training block; the easy week goes only between blocks and is a recommendation | R2-VOL-07, R3-PER-01 |
| H16 | **No sleep, stress, job or life input**, anywhere | R2-GEN-04 |
| H17 | Floor of 10 weekly sets for every trained group in a stairway block (shoulders counted as a group; pain-reduced and maintenance-type blocks excepted). When time is short, train fewer groups directly instead of leaving every group under the floor | R2-VOL-06, R3-VOL-01, R3-SES-02 |
| H18 | 2-4 exercises per group trained on a day, never 1 (calves and the core opener excepted); never squeeze 2-4 into a day that can't hold them | R2-SES-05, R3-SES-01, R3-SES-02 |
| H19 | Tests only in week 1 and the last week, never mid-block; never a 1RM or max-effort mile without a completed block | R2-PER-07 |
| H20 | The release (and the "use at your own risk" checkbox) is accepted for every build; the health check runs unless a coach skips it with the warning | R2-GEN-03, R3-GEN-01 |
| H21 | The stairway climbs: small steps early, bigger late, weekly sets never drop, the last week is the hardest, RIR never rises, and it never stays flat on a trained group | R2-PER-03, R2-PER-04, R2-PER-05, R3-VOL-04, R3-SES-02 |
| H22 | The plan is the planned stairway: built once, no input changes it afterwards | R2-VOL-03, R3-VOL-02, R3-VOL-04 |

Product rules from round 3 that are just as hard:
* **No data kept (R3-GEN-01).** No storage, accounts, analytics or logging of intakes in anything built here. The engine has no I/O; keep it that way.
* **No check-ins, tracking or adaptive inputs (R3-VOL-02, R3-VOL-04).** Never add a feedback loop, readiness score or "how did it feel" input.
* **Few inputs.** Every new intake field needs a coach answer behind it.

---

## 11. Changing things safely

### 11.1 The general workflow

1. **Find the authority.** Look up the coach answer that owns the behaviour (§3). If there is none, the change is `INFERRED` or `PROPOSED`: write it down in `engine/DECISIONS.md` (engine) or the doc's open questions, and don't present it as his rule.
2. **Change the human doc** (`BLAZE_CAMP_BRAIN.md` and the matching `synthesis/*.md`) with its evidence label, then the **machine source** (spec key or `synthesis/*.json`) so the two stay twins.
3. **Change what the engine reads** (§11.2 for rules, §11.3 for exercises). Never edit `model/`, `engine/fixtures/mini-model.json` or `samples/plans/` by hand; regenerate them.
4. **Rebuild and check:** `node tools/fixture/build-fixture.mjs && node tools/fixture/check-fixture.mjs`, `node tools/compile-model.mjs`, `node tools/check-model.mjs`, `node --test tests/`, `node tools/generate-samples.mjs`. All must pass with 0 failures.
5. **Add a test** that fails without your change (for a review issue, name it after the issue id, as in `tests/review-v12.test.mjs`), and log engine decisions in `engine/DECISIONS.md` and plan-level fixes in `samples/REVIEW_LOG.md`.

### 11.2 Adding or changing a rule (a number, a table, a list)

* Find the runtime key in §6 and the module that reads it. Engine code reads `model.rules`, usually through `const R = model.rules`, so search both forms: `grep -nE "(rules|R)\.<section>" engine/*.mjs`.
* Make the change in the shared amendment layer `tools/fixture/review-v12.mjs` (`amendRules`, `amendTemplates`, `amendSport`). Or change both rule builders identically: `tools/fixture/rules.mjs` (normative) and `tools/compile/rules.mjs` (port). The deep-equal test fails if they drift.
* A brand-new key in `rules.json` is a contract change: record it in `engine/CONTRACT_REQUESTS.md` (append-only) and update `engine/CONTRACTS.md` §3.3.
* Engine code reads every number from `model.rules`. A literal in engine code is allowed only for structure, or with an `// INFERRED: <why>` comment (then also request a rules key).
* Keep `ref`s on everything: values carry `refs` (coach ids), and plan decisions carry `why(key, ref, args)` from `engine/util.mjs`.

### 11.3 Adding or correcting an exercise

* The source is `synthesis/02_exercise_catalog.json` (one record per exercise; copy a record of the same pattern as your template). The runtime record (`model/catalog.json`, CONTRACTS §3.2) is derived from it: `slots` from `generator.pools`, `credit_class` and `credits` from the pattern and `volume_credit`, `axial` from `axial_spinal_load.spine_day_v1_1`, the 60+ flags from `athletic_quality` / `older_default_excluded`, and so on.
* Fill every lens the coach uses: family, pattern, laterality, plane, level, big / small muscle, primary muscles and credits, equipment set-ups and constraint 1-5, spine load, athletic quality (plyometric vs ballistic, Receive-Create stage), and older / youth suitability. **Never** a band, chain or weight-releaser set-up; the compile fails on the band regex.
* A new exercise the coach has not approved gets a proposed status (`proposed_v1_1`). It is then a swap only, never a default pick (`default_in_slots: []`), until he approves it.
* A correction to an existing record goes in `tools/fixture/review-v12.mjs > amendExercise` (shared by the fixture and the compiler) or in the coach-patch layer `tools/compile/patches.mjs` (which fails the compile if its target is missing).
* Add the Spanish name in `tools/compile/es/exercises.mjs` (neutral Latin American Spanish, English gym term in brackets; R2-GEN-08). Any missing key shows up in `model/i18n/es_review.json`.
* The full field-by-field guide with worked examples is `docs/adding-exercises.md` (Spanish: `docs/adding-exercises.es.md`). Contribution rules are in `CONTRIBUTING.md`.

### 11.4 Words (EN / ES)

* Engine and plan use keys only (`exercise.<id>.name`, `note.*`, `warning.*`, `why.*` …; namespaces in CONTRACTS §1.6). No hard-coded words in `engine/`.
* Every key needs EN and ES. Machine-translated ES lines are listed in `model/i18n/es_review.json > machine_translated` until the coach approves them.
* `[LEGAL REVIEW]` copy (health check, release, coach bypass warning) is used verbatim from the spec and never edited by the engine or by you.

### 11.5 Engine code

* Plain `.mjs`, Node 22, **no npm dependencies**, no TypeScript, no build step. Engine files import only `engine/*.mjs`: no `node:` imports, `fs`, `process`, `console` or `fetch`.
* No `Date.now()`, `new Date()` without an argument, `Math.random()`, `performance.now()`, `Intl`, `toLocaleString` or `localeCompare`. Dates are ISO `YYYY-MM-DD` strings handled with `Date.UTC`. Round sets with `roundHalfUp`.
* Pure functions; inputs are never mutated. Programmer errors throw `EngineError`; user-input problems come back as issues.
* Module map and pipeline: `engine/README.md` §3 (`util`, `model`, `intake`, `shape`, `volume`, `budget` (athletic / Olympic budgets), `week`, `select`, `dose`, `validate`, `explain`, `render`, `generate`, `version`). Bump `ENGINE_VERSION` on every behaviour change.
* If the contract is wrong or missing something, implement the closest compliant thing and write it to `engine/CONTRACT_REQUESTS.md`. Don't silently diverge.

---

## 12. Tests and checks

```sh
node --test tests/                          # everything (tests/package.json -> run-all.mjs imports every tests/**/*.test.mjs)
node --test tests/volume.test.mjs           # one module
node tools/check-model.mjs [model-dir | --fixture]   # model contract checks (shapes, bands, credits, i18n coverage, rules == fixture rules)
node tools/fixture/check-fixture.mjs        # reference fixture checks
node tools/generate-samples.mjs --out /tmp/bc-plans  # all 8 samples; exit 1 on any failing error check
```

| Suite | Covers |
|---|---|
| `compile.test.mjs`, `model.test.mjs` | `model/` equals a fresh compile; `rules` deep-equals the fixture; credits, bands, KB swings, ES coverage; `assertModel` catches injected defects |
| `intake`, `shape`, `volume`, `week`, `select`, `dose` `.test.mjs` | the coach's worked numbers (stairways, starts, caps, placement, floor, pain), templates, filters, spine days, reps, effort, tests |
| `validate.test.mjs` | one failing mutation per check id (V1-V29, H01-H22) |
| `generate`, `explain`, `render`, `i18n` `.test.mjs` | orchestration, views and formats, every sample in EN + ES with no raw key, placeholder or `undefined` |
| `determinism.test.mjs` | twice-identical plans; no clock, random or `Intl` in engine sources |
| `review-v12.test.mjs` | one regression test per fixed coach-eye review issue (ids from `samples/REVIEW_LOG.md`) |
| `invariants/invariants.test.mjs` | samples × 2 models + random intakes + all 52 sports + 26 activities, re-checking H01-H22 independently |

Validation severities live in `rules.json > validation > checks` (`error` or `warn`). A plan the coach would not sign is still a bug even when every check passes. That is why the samples are also read "with a coach's eye" (`REVIEW_GUIDE.md`, `samples/REVIEW_LOG.md`, `samples/RECHECK_v0.3.md`).

---

## 13. What not to change

* **The coach's words:** `coach_answers.md`, `coach_answers_full.md`, `coach_answers_round2.md`, `coach_answers_round3.md`, `answers_raw*/`. Quote them; never edit or "correct" them.
* **His sheets and their exports:** never modify the coach's Google Sheets; never edit `raw/` or `dumps/` (regenerate with `dump.py` only).
* **Evidence labels and ids:** never remove, upgrade (e.g. `INFERRED` → `OBSERVED`) or invent a label or a coach id. Keep his verbatim labels in quotes as written.
* **Retired ideas stay retired.** Don't reintroduce any of these: a weekly % by muscle size; 0.5 helper credit; bands, chains or releasers; sex as an input; sleep, stress or lifestyle questions; deloads or maintenance inside a block; core after the power block as the default; KB swings counted as glute volume; 1 exercise per muscle on full-body days; 1RM or max-mile tests from zero; check-ins and adaptive steps (round 3); rear delts with their own floor; a mandatory easy week (round 3); "Justice League" as a program name; hack squat ranked last.
* **Generated files by hand:** `model/*`, `engine/fixtures/mini-model.json`, `samples/plans/*`.
* **Historical files:** `BLAZE_CAMP_BRAIN_v*.md` snapshots, `generator_spec_v0.json`, `samples/_retired_v1_0/`.
* **Legal files:** `LICENSE`, `DISCLAIMER.md`, `DISCLAIMER.es.md`. Reference them; changes go through the owner and his attorney.
* **Git:** don't push to `main` without the owner's say-so; reviewers put findings on a branch or in issues (`REVIEW_GUIDE.md`).

---

## 14. License, disclaimer and data

* **License:** MIT ([LICENSE](LICENSE)), copyright 2026 Lalo Vera, doing business as Blaze Camp, and BFit Studios Corp. (a Florida corporation). Keep the copyright and permission notice in every copy.
* **Disclaimer and release:** [DISCLAIMER.md](DISCLAIMER.md) (EN) and [DISCLAIMER.es.md](DISCLAIMER.es.md) (ES), meant to be legally equivalent; both are drafts pending review by a Florida attorney. In short: not medical advice; use at your own expense and risk; no warranty; liability released; coaches and gyms need their own screening, release and insurance; minors need a parent or guardian and a qualified coach.
* **Every generated plan** requires the release for that build (`intake.release`, H20; stamped as `plan.release_stamp`). The rendered plan opens with the coach's instruction block and ends with a short "not medical advice" footer (`ui.disclaimer`).
* **Data:** the generator keeps no personal data (R3-GEN-01, DISCLAIMER §7). If you build an app or service on this, privacy and data handling are yours.
* **Third-party content:** exercise video links from the original sheets are not owned by Blaze Camp.
