# Release check: model v1.3

Run on 2026-10-11, on branch `planner-build` (last commit `50fd654`, with engine 0.5.0, the regenerated model and the v1.3 documents still uncommitted in the working tree). Model 1.3.0, spec 1.3.0, engine 0.5.0, benchmark scorer 2.3.0, Node 22.22.0.

This is the last search for retired ideas that are still written as if they were current. The newest coach answers decide what is current: round 4 and CT-01, then CX-01..04, then rounds 3, 2 and 1.

## In short

- **The documents and the spec now agree with his newest answers.** 37 files were corrected. Most needed a note or one line. The files a reader opens first (README, MODEL_CARD, AGENTS, HANDOFF, the `docs/` guides, the master document and the spec) were already in good shape.
- **The engine and the compiled model follow his newest answers.** No time-fitting, no hard limit on a weekly step, no check-ins, no sex field, no bands, and no third-party video link in any plan or in the compiled model. A few leftovers remain in code and data. None of them changes a plan. They are listed in section 4 and were not edited.
- **Tests: 1,407 tests, 1,401 pass, 0 fail,** 4 to-do, 2 skipped. Before this check one test failed, because the spec had been edited after the last compile. The model was recompiled; only the spec's version and hash changed.
- **Benchmark: 102 plans, mean 97.67, lowest 89.35,** 3 hard-rule violations in 2 plans. A fresh run on the final files gives the stored result plan for plan.
- **Sample plans: 8 of 8 build with no failing check.** AI reviewers grade them B- to B+. **2 of 8 reach the goal of B+.** The coach has not graded them.
- **Not final yet:** the attorney's review of the legal text (now including the new health warning, R5-GEN-02) and his approval of the Spanish. **Settled in round 5 (2026-10-12):** his grades of the 8 samples (A for 01, 02, 07; B+ for 03, 04, 05, 06, 08), his credentials ("Master NASM coach" only, R5-PUB-02), and the old sheet exports (kept public, link-stripped, checked for client names: none found, R5-PUB-01).

## 1. What was checked

**The eight subjects** (anything that contradicts round 4, CT-01 or CX):

| # | Retired idea | Retired by |
|---|---|---|
| 1 | Session minutes as an input or a limit | CT-01, R4-SES-01 |
| 2 | A time check, time cutters or time offers ("one more day or longer sessions") | CT-01, R4-SES-03, R4-SES-04 |
| 3 | "Sets must rise every week" ("never flat", a minimum climb) | CX-02, CX-03 |
| 4 | A hard limit of 7 % on a step or 10 % on the weekly total | CX-01, R4-PRG-02 |
| 5 | Check-ins or tracking described as current | R3-VOL-02, R3-VOL-04 |
| 6 | Third-party video links in public data | R4-LIB-05 |
| 7 | Bands or variable resistance as an option | EQ-01, EQ-12 |
| 8 | A sex field, or a rule by sex | GEN-02, ATH-09 |

**Where.** 313 files: every tracked and untracked file of the repository, except the places the task left out because they are history or raw material: `design/`, `reviews/`, `raw/`, `dumps/`, `analysis/`, `answers_raw*`, the archived master documents (`BLAZE_CAMP_BRAIN_v0.md`, `_v1.md`, `_v1_1.md`, `_v1_2.md`, `generator_spec_v0.json`), `docs/03-coach-answers/` (it quotes history), and the build folders `synthesis/_build_*`, `samples/_retired_v1_0`, `workflows/`. The coach's answer files and the questionnaire files were searched and never edited.

**How.**

1. A pattern search for each subject over the 313 files (about 24,000 raw hits, most of them harmless words such as "track and field", "constraint band", "10 % of body weight").
2. In the front-door documents, the `docs/` guides, the master document and the spec, every hit on subjects 1 to 4 was read, and every hit on subjects 5 to 8 that the script could not clear by a "retired", "no" or "never" in the same sentence.
3. In the long `synthesis/` documents the hits were sorted by script: inside a section that carries a "Changed in v1.3", "RETIRED" or "history" note; in a sentence that itself retires the idea; or neither. Every hit in the last group was read. The first two groups were sampled.
4. The spec and the compiled model (`model/*.json`) were searched by JSON path, so that a retired key inside an object marked retired is not counted as a leftover.
5. Every `http` link in the compiled model, the fixture, the spec, the `synthesis/*.json` files, the sample plans and the intakes was listed and sorted into YouTube search links, research links and third-party video links.
6. The compiled English and Spanish word lists (2,697 lines each) were searched for retired wording, and each hit was traced to see whether the engine still prints it.
7. The 8 rendered sample plans were searched for retired wording.
8. The pipeline was run: fixture, compile, model check, tests, sample plans, scorer self-test, benchmark, sweep.

## 2. Result by subject

| # | Subject | Documents and spec | Engine, tools, compiled model |
|---|---|---|---|
| 1 | Session minutes | Fixed where found (sections 3.2, 3.3, 3.5) | Clean. The intake accepts `schedule.session_minutes`, ignores it and says so. Check V3 fails any plan that carries a time field. A few unread minute keys remain in the rule and profile data (section 4) |
| 2 | Time check and offers | One live leftover in the spec and several in `synthesis/` and the engine documents, fixed | Clean. `engine/timefit.mjs` is deleted. `engine/model.mjs` refuses a model that still holds a time-fitting rule |
| 3 | Sets must rise every week | Fixed where found (sections 3.1, 3.3, 3.4) | Clean. `rules.stairway.progression.flat_weeks_ok` is true and there is no minimum climb |
| 4 | 7 % and 10 % limits | Fixed where found (sections 3.1 to 3.4) | Not enforced anywhere. **One leftover label:** locked rule LK08 "total weekly sets rise by less than 10%" is still listed in the rule data and carried in every plan's list of locked rules. It is not printed in a plan and no check uses it |
| 5 | Check-ins and tracking | The 11 `synthesis/` documents that were never re-issued after round 2 still described the weekly check-in. Each now opens with a status note | Clean. An intake that asks for a check-in mode gets the plan and a notice that check-ins are retired |
| 6 | Third-party video links | Wording made exact in 9 documents: the links are gone from the model data, not from the whole repository | **0 in the compiled model, the fixture, the library source, the spec and the sample plans.** 733 of 733 exercises carry a YouTube search link. Links remain in old data files (sections 4 and 7) |
| 7 | Bands | Nothing to fix. Bands appear only as "never" | Clean. The model check and a test fail on any band word, in English and in Spanish |
| 8 | Sex field | Nothing to fix. "Men's" and "women's" appear only as names of games and divisions | Clean. An intake with a `sex` or `gender` key is refused |

## 3. What was fixed

37 documentation and spec files. No engine code, tool code or test was edited.

### 3.1 The master document, `BLAZE_CAMP_BRAIN.md`

| Where | What it said | Now |
|---|---|---|
| §15, "His own contributions" | Listed "the time-vs-minimums order (tell, offer, train fewer groups, supersets, keep climbing)" as a rule to keep | His A / B template and sessions sized by exercise count, with the time left to the person; the round-3 order is named as retired |
| §15, same list | "never one exercise per muscle" | "on split days"; on his A / B days the template decides (R4-SES-05) |
| §12, year tuning | The Q1 cut keeps flat sets "while the stairway always climbs" (an open reading) | Settled: a block may keep its sets (CX-02) |
| §3, Pro setting; §5.8 | "others ≤ 3 %/week while it runs" | Struck. §0d.4 already listed it as retired |
| §16.4 | "recompile `model/`" owed by the lead | Done in this check |

### 3.2 The spec, `generator_spec_v1.json`

| Key | What it said | Now |
|---|---|---|
| `plan_types.maintenance_4_6.time_check` | "if the schedule cannot hold the factor, say so and offer an extra session, longer sessions or supersets" | Marked RETIRED (CT-01, R4-SES-01, R4-SES-04); the old text is kept as history inside the same value |
| `rule_tables.priority.nonpriority_rule` | "other groups <= 3 %/week only while a coach priority push runs" | Marked RETIRED as a limit (CX-01, R4-PRG-02). The same spec already listed it as retired under `derived_values.D12_planned_step` |

Only text values changed. No key was added, removed or renamed, so every key path the documents cite still resolves.

### 3.3 The `synthesis/` documents

**Re-issued for v1.3** (03, 04, 05, 06, 11, 12, 13). Each has a v1.3 section on top that wins, and notes under the sections it changes. These places had no note:

| File | Fixed |
|---|---|
| `03_volume_dosing.md` | §8 coach rule ("never above 7 % planned and below +10 % total"); §10 rows 8 and 25 ("10 % ceiling", "hand-set 0-7 %, weekly total below +10 %") |
| `04_athlete_profiles.md` | Round-3 rules table: "time short -> fewer groups trained directly, stairway still climbs" |
| `05_session_architecture.md` | §10 "How the coach thinks", items 6 and 9: session size by minutes, "8-12 exercises on full-body days", "when the time is too short he would rather train fewer muscles" |
| `06_periodization.md` | §3.1 lever table and §8.0 / §8.1 overlays: "offers more time, then trains fewer groups directly", "full-body days 2-4 exercises per muscle, never 1", "45-60 min sessions" as a limit; one row that called 10 % "his ceiling" |
| `11_training_variables.md` | §0 short answers ("never more than 7 % a week"); the volume row ("planned ≤ 7 %, total < +10 %"); the density row (a superset marked "needed" when the day only fits with it; "superset ON when time is short" and when a beginner "reports low fatigue") |
| `12_volume_algorithm_v1.md` | §2.5 research notes that called 10 % "a ceiling" of the design |
| `13_product_options.md` | Seven lines that still listed the time check as a screen, a build task, a renderer line ("Not trained directly this block (time)") or a test ("never flat") |
| All seven | A note under the "v1.2 - round 3 applied" change list: its rows on time, the 7 % and 10 % limits and "cap + 1" were changed again in v1.3 |

**Never re-issued after round 1 or 2** (`01_taxonomy.md`, `02_exercise_catalog.md`, `02_no_equipment_subset.md`, `07_science_lineage.md`, `08_open_questions_for_coach.md`, `10_equipment_model.md`, `10b_equipment_variables_science.md`, and the four files in `synthesis/sports/`). They described the weekly check-in and its step table, a weekly step "picked by the person's state", "never more than 7 %", "+10 % as a hard cap" and, in the catalog description, video links kept from his sheets. Each now opens with a status note that names what in that file is history and which answer replaced it. Their bodies were left as written.

### 3.4 The engine documents

| File | Fixed |
|---|---|
| `engine/README.md` | The authority order stopped at round 3; round 4, CT-01 and CX added. The module table described the time check, minute caps, the cut order and "< 10 % weekly total rise" as what the code does. The hard-rules table still held "Planned step ≤ 7 %, weekly total < 10 %", "never flat" with a minimum climb, "the time check" and "2-4 exercises per group per day" for every day. All rewritten to engine 0.5. Stale counts corrected (1,407 tests, 51 scorer self-checks, scorer 2.3, 2,697 strings). The limits that only applied to engine 0.4 are marked as history |
| `engine/CONTRACTS.md` | The engine 0.5 boxes at the top already override the older text. Five pointer notes were added where a reader lands first: the hard-rules table (H10, H17, H18, H21), the intake, the typedefs, the plan example and the check list |
| `engine/DECISIONS.md`, `BUILD_PLAN.md`, `CONTRACT_REQUESTS.md` | A status note on top: these are logs; section G (engine 0.5.0) replaces the older decisions on time, limits and check-ins |

### 3.5 The other documents

| File | Fixed |
|---|---|
| `docs/00-overview/what-this-is.md`, `what-this-is.es.md`, `for-developers.md`, `safety-and-liability.md`, `docs/05-reference/faq.md` | They said the video links "were removed from the public data". They are removed from the model data. The exports of his sheets in the repository still show them. Now said that way |
| `README.md`, `AGENTS.md`, `HANDOFF.md`, `docs/06-history/roadmap.md` | The list of places that still hold third-party links was missing two: `synthesis/02_exercise_catalog_crosswalk.json` and the old model snapshots in `design/scratch/snap*/` |
| `docs/02-model/bilateral-unilateral.md` | A link text: "how sets are added each week" |
| `samples/SAMPLES.md` | Its numbers were from the end of work package V4 and no longer matched the plans (for example, chest 13 in sample 06 where the plan now climbs 19 to 24; "V29 fails on sample 02" where no warning check fails now). A table of current numbers, computed from the plan files, and a note were added. The per-sample text below it was left as written and is marked as V4-era |
| `README.md`, `AGENTS.md`, `HANDOFF.md`, `llms.txt`, `BLAZE_CAMP_BRAIN.md` §16.4 | A link to this file |

## 4. Leftovers in engine and model code (listed, not edited)

None of these changes what a plan contains.

| # | Leftover | Where | Suggested action |
|---|---|---|---|
| 1 | **Locked rule LK08**, "Total weekly sets rise by less than 10%". Retired by CX-01 and R4-PRG-02. Nothing enforces it, and it is not printed in a plan, but it is in the rule data, in both word lists and in `meta.locked_rule_keys` of every plan | `tools/compile/rules.mjs:66`, `tools/fixture/rules.mjs:64`, `tools/fixture/i18n.mjs:177`; `model/rules.json > locked[7]`; `locked.weekly_rise_below_10pct` in `model/i18n/en.json` and `es.json` | Remove it in the two rule builders and the word table, rebuild, regenerate the samples |
| 2 | Two unused word-list lines with retired wording. No code emits them and no sample plan holds them | `why.circuit_station_swap` ("... holds its 10 weekly sets in your minutes"), `tools/fixture/round3.mjs:215`; `note.long_day` ("This full-body day runs a little longer: every muscle group gets at least 2 exercises"), `tools/fixture/i18n-v11.mjs:98` | Delete both keys |
| 3 | Minute keys that nothing reads | `model/rules.json > athletic.f2.ankle_block.keep_from_minutes` (45) and `athletic.f2.tracks.add_from_minutes` (60), from `tools/fixture/fix-r1-f2.mjs:39, 49`; `model/profiles.json > goals.*.default_minutes` (60 / 90), from `tools/compile/templates-profiles.mjs:358` and its fixture twin; the status text of `athletic.r2.set_climb` still says "only inside the day's minutes" | Delete the keys and reword the status |
| 4 | The rule builders still build the v1.2 tables first (step limits 0.07 and 0.10, the non-priority 3 % cap, the time-fit rules) and the v0.5 layers delete them afterwards. The compiled result is right | `tools/compile/rules.mjs:154, 225`, `tools/fixture/rules.mjs:152, 223`, removed by `tools/fixture/v05-structure.mjs` and `v05-library.mjs:297` | Fold the layers into the builders when there is time |
| 5 | The source data files were not re-issued in v1.3 and still hold v1.2 objects: station keys `include_from_minutes` and `superset_below_minutes` (808 in `05_templates.json`), the time-vs-minimums tables, the 7 % and 10 % limits (`06_periodization.json`, `03_volume_rules.json`, `12_volume_algorithm_v1.json`), check-in tables in the older ones | `synthesis/*.json`, `synthesis/sports/*.json` | Decide: re-issue the JSON files, or keep the compile layers as the record (already an open item in `BLAZE_CAMP_BRAIN.md` §16.4) |
| 6 | Retired intake fields still accepted and still present in test data. `output_mode: "plan_only"` and `email: null` are in the 8 sample intakes and the 94 benchmark intakes; `schedule.session_minutes` is in the 94 benchmark intakes. The engine always builds the whole plan once, ignores the session length and says so, and warns on any other output mode | `samples/intakes/*.json`, `design/bench/intakes/*.json`; `engine/intake.mjs:60, 396, 495` | Clean the intakes; keep the engine's "accepted and ignored" path |
| 7 | The spec keeps the retired session-length field (F24) and the empty `adaptation` stub, both marked retired, because two tools still read them | `tools/compile/i18n.mjs`, `tools/fixture/build-fixture.mjs` | Drop the reads, then delete the keys |
| 8 | Comments that still explain code by the time check | `engine/select.mjs` (14 lines), `engine/athletic.mjs:537`, `engine/version.mjs:2-18` (version history) | Reword when those files are next touched |
| 9 | **The athletic climb rules name a retired answer as one of their sources.** The rules that make jumps, throws, cuts and sprint metres climb in even steps ("one scale down the block", "no total held for more than two weeks") cite R3-VOL-04 and "R3-SES-02 step 4, never flat". The second was retired with the time policy, and CX-02 says a week may keep the same sets. These rules are about athletic doses, not muscle sets, they are marked PROPOSED, and one of the 4 to-do tests asserts "no total held for more than two weeks". The rule data also holds a 20 % weekly limit on jump contacts (`contact_rise_max`); R4-PRG-02's "no hard limit" was asked about sets, so it was left alone | `model/rules.json > athletic.r2.scale.refs`, `athletic.reconcile.contact_rise_max`; `engine/athletic.mjs:9, 661, 832`; `tests/review-r2f2.test.mjs` (to-do) | Ask the coach whether athletic doses must climb every week, then keep or relax the rule and the to-do test |
| 10 | The time estimate is used as a tie-break in two places: an extra cardio session, or the cardio test, goes to the main day with the shortest estimate. Nothing is cut or dropped by it, and the code says "never a time decision" | `engine/week.mjs:384, 710` | For the lead to know. No action needed unless the coach wants cardio placed another way |
| 11 | **185 third-party video links** in a public data file that maps his sheet cells to exercise ids | `synthesis/02_exercise_catalog_crosswalk.json` | See section 7 |
| 12 | **136 third-party video links in each of 4 old model snapshots** kept from the planner research | `design/scratch/snap/model/catalog.json`, `design/scratch/snap/engine/fixtures/mini-model.json`, and the same two files under `design/scratch/snap_instr/` | See section 7 |

Outside the scope of this search, and already known: the sheet exports in `dumps/` (974 link occurrences) and the first-pass files in `analysis/` (951) hold the same links. They are exports of the two workbooks in `raw/`.

## 5. Tests and checks

| Check | Before this check | After |
|---|---|---|
| `node --test tests/` | 1,407 tests: 1,400 pass, **1 fail**, 4 to-do, 2 skipped | **1,407 tests: 1,401 pass, 0 fail, 4 to-do, 2 skipped** |
| `node tools/check-model.mjs` | 0 errors, 0 warnings | 0 errors, 0 warnings (733 exercises, 30 templates, 1,682 stations, 127 profiles, 52 picker sports, 26 activities, 2,697 English and 2,697 Spanish lines, 842 machine-translated) |
| `node tools/check-model.mjs --fixture` | not run | 0 errors, 0 warnings |
| `node tools/fixture/check-fixture.mjs` | not run | 0 errors, 0 warnings |
| `node tools/generate-samples.mjs` (into a scratch folder) | not run | 8 of 8 `ok`, 0 failing error checks, 0 failing warning checks. **The 19 files are byte for byte the ones in `samples/plans/`** |
| `node design/bench/selftest.mjs` | not run | 51 passed, 0 failed |
| `node design/bench/run.mjs` (fresh run, compared with the stored `results_v05.json`) | stored run of 2026-10-11 | The same result: 102 plans compared, 0 lower, 0 higher |
| `node tools/sweep.mjs 1500 --render`, compiled model | stored result | 1,578 of 1,578 plans `ok`, 0 crashes, 0 failing error checks, 0 days above the session size, 0 render problems. Warning checks only: V29 on 174 plans, V28 on 91 |
| `node tools/sweep.mjs 1500 --render`, reference fixture | stored result | 1,578 of 1,578 plans `ok`, 0 crashes, 0 failing error checks, 0 days above the session size, 0 render problems. Warning checks only: V29 on 173 plans, V28 on 92 |

**The one failing test, and what was done.** The test "model/ on disk is the current compile of the sources" failed because the documentation step changed the spec (to version 1.3.0) after the model had last been compiled. The model's manifest records each source file's hash, so the stored model was out of date by that one hash. The master document already listed the recompile as owed. This check then made two more text fixes to the spec, so the steps were run here:

1. `node tools/fixture/build-fixture.mjs`: the fixture changed in two lines, both the spec version string ("1.2.0" to "1.3.0").
2. `node tools/compile-model.mjs`: `manifest.json`, `CHANGELOG.md` and `COMPILE_REPORT.json` changed, each only in the spec version and the spec hash. `catalog.json`, `rules.json`, `templates.json`, `profiles.json`, the three word-list files and `MODEL_VERSION` are byte for byte the same as before.
3. The full test suite, the model check, the samples and the benchmark were run again on the result.

No rule, exercise, template, profile or word changed, and no plan changed. **Any later edit to a compile source (the spec, `coach_answers_round2.md`, or a `synthesis/*.json` file the compiler reads) needs `node tools/compile-model.mjs` again, or that test fails.**

**The 4 to-do tests** are all in the athletic layer and were open before this check: sprint metres hold flat for 5 weeks in the football plan; the soccer week keeps a push-up box jump; the soccer pre-season holds 72 cuts against 108 in the last off-season week; one early-peak check needs a new test case. **The 2 skipped tests** need the compiled model and skip only on the fixture copy.

### Benchmark, 102 plans (94 benchmark intakes and the 8 samples)

| | Value |
|---|---|
| Mean score | 97.67 |
| Median | 99 |
| Lowest | 89.35 (a 66-year-old pickleball player, 2 days, opted in to power work) |
| Hard-rule violations | 3, in 2 of 102 plans |
| Plans passing every row | 53 |
| The same intake gives the same plan | 102 of 102 |
| Engine 0.4 baseline, older scorer with time metrics | Mean 64.4, lowest 27.6, 2,228 hard-rule violations |

Rows that pass in every plan they apply to: the floor of 10 and the 2-day rule; his templates slot for slot; session size; final sets reached; never fewer sets than the week before; no time field in any plan; the progression rule and the note above about 15 %; the library rules (no add-on picked, no third-party video link, carries by distance or time); the liability gate; the same plan every time.

Rows that still fail somewhere:

| Row | What | Number |
|---|---|---|
| A1 | Hard-rule violations | 3: a CrossFit individual plan with more jumps than its target in two weeks (2), and one MYO set that the scorer and the engine place on different exercises (1) |
| A11 | A shortfall the plan does not say in words | 35 cases in 30 plans |
| A12 | Athletic work under the sport's weekly target | 45 of the 63 athletic plans |
| A13 | Two-leg share near its target | 89.5 % of blocks within range, target 95 % |

A score is the scorer's number, not a coach grade. The scorer was corrected three times during engine 0.5 (versions 2.1, 2.2 and 2.3); each change is listed in `samples/STATUS_v0.5.md`.

## 6. Final grade of each sample plan

The grades are from AI "coach-eye" reviewers who read each plan against the coach's sheets and answers. They are not the coach's grades. **Update 2026-10-12, the coach's grades (round 5):** 01 Swimming A, 02 Football A, 03 Soccer B+, 04 CrossFit-style class B+, 05 Bootcamp B+, 06 Full-body aesthetics B+, 07 Push / pull / legs A, 08 Pickleball B+ (R5-GRD-01 ... 08; he read the engine 0.6 plans). There were three reviews, with an engine fix round after the first and after the second. No engine change followed the third review, and the plans in `samples/plans/` are the ones it read, so the third review is the final grade. The grades are recorded in `README.md`, `HANDOFF.md`, `docs/06-history/roadmap.md` and `docs/06-history/timeline.md`, and those four agree. The review texts themselves are not in the repository, so this check could confirm the record but not re-read the reviews.

| Sample | Review 1 | Review 2 | **Final (review 3)** | Benchmark score | Benchmark rows that fail | Failing engine checks |
|---|---|---|---|---|---|---|
| 01 Swimming, 16 years old, 3 days | B- | B- | **B** | 99.13 | A12 | none |
| 02 Football, college linebacker, 4 days | C+ | B | **B** | 98.85 | A12 | none |
| 03 Soccer, 3 days, season in 10 weeks (Spanish) | C+ | B- | **B** | 99.00 | A12 | none |
| 04 CrossFit-style class, 4 days | C+ | B- | **B-** | 92.83 | A12 | none |
| 05 Bootcamp, 3 days, dumbbells and kettlebells (Spanish) | B- | B- | **B-** | 92.23 | A11, A12 | none |
| 06 Full-body aesthetics, his A / B days, 4 days | C+ | B | **B** | 100 | none | none |
| 07 Push / pull / legs, 6 days | B | B+ | **B+** | 100 | none | none |
| 08 Pickleball, 52 years old, knee pain, 2 days | C | B | **B+** | 94.61 | A11, A12 | none |

**The goal in `design/ENGINE_V05_PLAN.md` is B+ or better on every sample. 2 of 8 are there.** Six are below it: four at B, and the class and the bootcamp at B-. What holds them back, by the reviews and the benchmark: athletic work under its weekly target (six of the eight samples), shortfalls not said in words (05 and 08), and for 04 and 05 the class and circuit items listed under "Not fixed in this round" in `samples/STATUS_v0.5.md`.

Current weekly sets of each sample, computed from the plan files, are in `samples/SAMPLES.md` ("Current numbers"). Two things those numbers show that a grader may want to look at first: in sample 05 the shoulders are the largest group (18 to 22.5 weekly sets, against 12 to 15 for back and for chest), and in sample 08 the quads stay at 6 weekly sets for all 12 weeks (the 2-day rule with a painful knee).

## 7. Needs the coach or an attorney before the public release is called final

### An attorney (licensed in Florida)

1. **`DISCLAIMER.md` and `DISCLAIMER.es.md`.** Both are drafts and say so at the top.
2. **The release wording printed on every plan** and the wording of the terms a person accepts before a plan is built, in English and Spanish, including the version for a parent or guardian of a minor (R4-SCP-01, R4-SCP-02).
3. **One box or separate ticks** for own risk, terms and release.
4. **The health check wording** and the coach's skip warning (placeholders marked LEGAL REVIEW in the data). **Added in round 5:** the health warning a flagged plan now prints instead of stopping (R5-GEN-02: `ui.plan.health_warning`, `_short`, `warning.health_flag`, EN and ES, marked `[LEGAL REVIEW]` in the text; `engine/DECISIONS.md` G-270 ... G-274). The attorney review is deferred; it does not block the engine work.
5. **The Blaze Camp name.** The team's reading is that the MIT license covers copyright and not the name.
6. **Third-party video links in the public repository: done (R5-PUB-01, 2026-10-12).** The coach chose to keep the files public and strip the links. Every third-party video link in `raw/MASTER_MODEL.xlsx` (cell text and hyperlink targets; `raw/BYOP.xlsx` had none), `dumps/`, `analysis/`, `synthesis/02_exercise_catalog_crosswalk.json` and `design/scratch/snap*/` is replaced with `[video link removed]`. `model/` did not change. `tests/v07-words.test.mjs` checks it.
7. **Client names: checked (R5-PUB-01).** No client name, roster, e-mail address or phone number was found in the workbooks, their dumps or `analysis/` (the names present are the coach's, public figures used as program or drill names, and cited authors). Nothing needed removing.

### The coach

1. **His credentials: done (R5-PUB-02).** "Master NASM coach" only; the placeholder is removed from `README.md` and `MODEL_CARD.md`, nothing added.
2. **His grades for the 8 sample plans: done (round 5).** The coach's grades (round 5): A for 01, 02, 07; B+ for 03, 04, 05, 06, 08 (R5-GRD-01 ... 08).
3. **The decision in item 6 above: done** (R5-PUB-01: keep public, strip the links).
4. **The 14 open questions** at the end of `samples/STATUS_v0.5.md` (for example: the chest credit of a high-incline press; single-leg work on athletic A / B days; the scale for 2- and 3-day athletic weeks; pulling against pressing).
5. **One new question from this check.** Must jumps, throws, cuts and sprint metres climb every week, or may they hold for some weeks the way sets may (CX-02)? The engine makes them climb, on a round-3 answer that was partly retired (section 4, row 9).
6. **The readings marked "yes" in `BLAZE_CAMP_BRAIN.md` §0d.3**, where two of his answers pull against each other. The main ones: on his A / B days biceps and triceps have one exercise each (R4-SES-05 against his earlier "never one exercise"); which exercises are the 7th and 8th of an A / B day; whether a health-check flag should still stop a plan now that "everyone" may use the plans (R4-SCP-01) - **answered in round 5: it does not stop, it warns (R5-GEN-02); engine 0.7 builds the plan with a health warning. Open for him: severe pain is planned with the moderate pain rules and the same warning (PROPOSED, G-271).**
7. **The Spanish.** He has approved none of it yet. 842 machine-translated lines, mostly exercise names and cues, are listed in `model/i18n/es_review.json`.

### The lead, before the commit

1. Review and commit the working tree. It holds engine 0.5.0, the model, the samples, the v1.3 documents, and this check's changes: 37 documents, the rebuilt fixture, the recompiled `model/` metadata and this file.
2. Decide on leftover 1 (LK08). It is the only leftover that is visible inside a plan file.
3. Engine work toward B+ on every sample is listed in `HANDOFF.md`, next steps, item 5. The website or form comes after that, by the coach's decision.

## 8. Limits of this check

- It searched for the eight subjects above. It did not re-audit every rule of the model against every answer; `coverage_matrix_round4.md` does that for round 4, CT-01 and CX.
- In the long `synthesis/` documents, text inside a section already marked "Changed in v1.3", "RETIRED" or "history" was sampled, not read line by line.
- `samples/SAMPLES.md` was given a current table and a note. Its per-sample paragraphs were not rewritten.
- Passing tests, checks and a benchmark do not show that a plan is right for a given person. The coach's grades are the missing measurement.
