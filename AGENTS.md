# AGENTS.md: working in the Blaze Camp model repo

This file is for AI agents and developers. It tells you what the repo is, which source wins when two disagree, where every kind of rule lives, how to generate a plan, which rules must never break, and how to change things without breaking the coach's model. Read it before you edit anything.

> **Latest policy, 2026-10-13: release "model v1.4 + engine 0.7.0".** The newest authority is [round 5](coach_answers_round5.md) (COACH-R5) together with his chat answers [CH5](coach_answers_chat_2026-10-11.md) and [CH6](coach_answers_chat_2026-10-13.md), then [round 4](coach_answers_round4.md) with [CT-01](coach_answers_time_2026-10-10.md), then [CX-01..04](coach_answers_codex_2026-10-10.md). In short: **no time-fitting**, sessions sized by exercise count, his own templates as the skeleton (2 days = two full-body days), the planned final sets are reached, reps and load are a rule the person applies, a health-check yes **warns and does not stop**, and everything is editable. Engine 0.7.0 implements this; every answer is traced in [coverage_matrix_round5.md](coverage_matrix_round5.md). The large planner in `design/PLANNER_SPEC.md` is parked as research: do not build it. **Next step: the front-end tool** ([HANDOFF.md](HANDOFF.md)).

> **Author and owner.** The model is the coaching experience and intellectual property of Coach Lalo (Gerardo Vera), Master NASM coach (COACH-R4 R4-REL-03). Our job is to capture it faithfully, not to redesign it.

> **Use at your own risk.** Everything here is general fitness information, not medical advice. Downloading or using this repository, or any plan generated from it, is at your own expense and risk. If you program for anyone else, you need your own health screening, liability release, insurance and privacy terms. Read [DISCLAIMER.md](DISCLAIMER.md) (EN) and [DISCLAIMER.es.md](DISCLAIMER.es.md) (ES); both are drafts pending review by a Florida attorney. License: [MIT](LICENSE), © 2026 Lalo Vera, d/b/a Blaze Camp, and BFit Studios Corp.

---

## 1. What this is

* **The model.** A machine-readable copy of how Coach Lalo (Gerardo Vera; Blaze Camp, BFit Studios Corp.) designs strength, physique, fat-loss and athletic training. It covers how exercises are categorized, an exercise catalog (742 runtime exercises: 731 from the 939 source records plus 11 added records), weekly sets per muscle group and the volume "stairway", session and week templates, 127 athlete and population profiles (a 52-sport picker plus 26 "stay athletic and active" activities), periodization, testing, equipment, and English and Spanish wording.
* **The engine.** Plain JavaScript ES modules (Node 22 or a browser, no npm dependencies, no build step, deterministic). It turns one intake (goal, sport or activity, training days, equipment, pain, experience; **no session length**) into the **whole plan at once**: a 4-6, 8 or 12-week block, or a year plan, in English or Spanish. Every decision carries a machine-readable `why`.
* **The product principle (COACH-R3 R3-VOL-02, R3-VOL-04, R3-GEN-01; COACH-CX CX-04; COACH-CT CT-01).** Few inputs go in and a complete template comes out, visible ahead of time. The person or their coach edits it, and owns the session time. There are no check-ins, no tracking and no adaptive inputs, and no user data is kept.

Versions of the release "model v1.4 + engine 0.7.0", 2026-10-13 (always read the live value from the file named):

| Thing | Value | Where |
|---|---|---|
| Model (compiled runtime data) | 1.4.0 | `model/MODEL_VERSION`, `model/manifest.json` |
| Master document | v1.4 | top of `BLAZE_CAMP_BRAIN.md` (§0e lists what v1.4 changed) |
| Generator spec | 1.4.0 | `generator_spec_v1.json > _meta.version` |
| Engine | 0.7.0 | `engine/version.mjs` |
| Contracts | 1.1.1, with the engine 0.5.0, 0.6.0, 0.7.0 and release boxes on top | header of `engine/CONTRACTS.md` |
| Schemas | `intake/2`, `plan/2`, `manifest/2`, `catalog/2`, `rules/2`, `templates/2`, `profiles/2` | `engine/CONTRACTS.md` §2, §3, §5 |

**Status.** Model v1.4 is complete: every coach answer through round 5, CH5 and CH6 is applied (CH6-02 is a design for the front-end tool, not built yet). The engine is **experimental**. On 2026-10-13 engine 0.7.0 ran the whole test suite with 0 failures, 0 failing error checks on the 8 samples and on a sweep of 1,578 intakes on both models (1,500 random, one per sport, one per activity), and a benchmark mean of 98.04 on 102 plans with 2 hard-rule violations in 1 plan. **The coach's grades (round 5, on the engine 0.6 plans): A for 01, 02, 07; B+ for 03, 04, 05, 06, 08.** AI coach-eye reviewers grade the engine 0.7 plans after his notes were applied. Passing tests does not prove a plan is right for every intake. Numbers, known gaps and open questions: [HANDOFF.md](HANDOFF.md) and [samples/STATUS_v0.5.md](samples/STATUS_v0.5.md) (the engine 0.7.0 sections at the end).

---

## 2. Quick start (every command below was run on this repo, Node v22)

```sh
node --test tests/                                         # whole suite (about 45 min on a laptop); use the live test report for counts
node tools/check-model.mjs                                 # contract checks on model/ (read-only)
node tools/generate-samples.mjs --only 08 --out /tmp/bc-plans   # one sample plan -> /tmp/bc-plans/08-pickleball-genpop.{json,en.md,es.md}
node design/bench/selftest.mjs                             # the benchmark scorer checks itself (read-only)
node tools/sweep.mjs 300 --model-only                      # random-intake sweep on model/ (read-only; the full run is `node tools/sweep.mjs 1500 --render`)
node tools/compile-model.mjs --out /tmp/bc-model           # compile the sources into a scratch dir ...
diff -rq /tmp/bc-model model && echo "model/ is up to date" # ... and compare with the committed model
```

These rewrite tracked files, so run them only when your change should update those outputs:

```sh
node tools/fixture/build-fixture.mjs && node tools/fixture/check-fixture.mjs   # engine/fixtures/mini-model.json (reference compile)
node tools/compile-model.mjs                                                  # model/*.json (exits 1 and writes nothing on a contract error)
node tools/generate-samples.mjs                                               # samples/plans/* (exits 1 if any plan fails an error check)
node design/bench/run.mjs --label v07                                         # design/bench/results_v07.json and V07.md (about 15 min; compare a change with --label <name> --compare design/bench/results_v07.json)
```

---

## 3. Authority order and evidence labels

When two sources disagree, the higher one wins:

| Rank | Source | Cited as | Ids |
|---|---|---|---|
| 1 (newest) | `coach_answers_round5.md` | `COACH-R5 <id>` | `R5-GRD-01..08`, `R5-VOL-01..05, 07..11`, `R5-ATH-01..05, 07..12`, `R5-CLS-01..07`, `R5-LIB-01..02`, `R5-GEN-01..03`, `R5-PUB-01..02` (43) |
| 1 (newest; scoped) | `coach_answers_chat_2026-10-11.md` | `COACH-CH5 <id>` | `CH5-01..03`; only team practices, the athletic arm slot, big groups above the template's slots |
| 1 (newest; scoped) | `coach_answers_chat_2026-10-13.md` | `COACH-CH6 <id>` | `CH6-01..02`; only a dip above the bench, and exercises people add themselves |
| 1 (newest; scoped) | `coach_answers_chat_2026-10-13b.md` | `COACH-CH7 <id>` | `CH7-01..08`; only the web tool: brands and the legal party, the public plan API, release acceptance by agents, the "More supersets" option (G-313), library-only edits in version 1 |
| 2 | `coach_answers_round4.md` | `COACH-R4 <id>` | `R4-SES-01..05`, `R4-PRG-01..04`, `R4-LIB-01..05`, `R4-SCP-01..03`, `R4-REL-01..03` (20) |
| 2 (scoped) | `coach_answers_time_2026-10-10.md` | `COACH-CT CT-01` | `CT-01`; only the subject of fitting plans to session time |
| 3 (scoped) | `coach_answers_codex_2026-10-10.md` | `COACH-CX <id>` | `CX-01..04`; only progression and editing |
| 4 | `coach_answers_round3.md` | `COACH-R3 <id>` | `R3-VOL-01..04`, `R3-SES-01..02`, `R3-PER-01`, `R3-ATH-01..05`, `R3-GEN-01` (13) |
| 5 | `coach_answers_round2.md` | `COACH-R2 <id>` | `R2-VOL`, `R2-SES`, `R2-PER`, `R2-ATH`, `R2-LIB`, `R2-GEN` (45 + 2 round-1 leftovers) |
| 6 | `coach_answers_full.md` | `COACH-ANSWER <id>` | `CAT UNI VOL PER ATH ORD EQ GEN LIB PRG FIX-nn` (140) |
| 7 | `coach_chat_statements.md`, `coach_answers.md` | `COACH-CHAT <date>` | his statements in conversation |
| 8 | His two Google Sheets: `raw/*.xlsx`, decoded cell by cell in `dumps/`; his real programs in `analysis/programs/*.md` | `OBSERVED` | cell references |
| 9 | Team work | `INFERRED` (reasoned from the sheets), `SCIENCE` (cited literature), `PROPOSED` (waiting for his approval) | |

* "RIGHT" with no text means the team's proposal is approved as his rule. The raw questionnaire answers are in `answers_raw/`, `answers_raw_r2/`, `answers_raw_r3/`, `answers_raw_r4/` and `answers_raw_r5/`.
* Round 4 and CT-01 agree with each other. Where round 4 refines an earlier scoped answer (for example R4-PRG-01 and R4-PRG-02 on top of CX-01), round 4 is the wording to follow. Where round 5 changes a round-4 rule (2 days, the health check, the high-incline credit), round 5 wins.
* Text that contradicts a coach answer is a bug. A coach answer you think is scientifically questionable is **not** a bug: write it up "for discussion" and leave the rule alone.
* For engine **shapes, names, file layout and APIs**, the authority is `engine/CONTRACTS.md`. Its amendment boxes at the top (engine 0.5.0, 0.6.0, 0.7.0 and the release box) supersede the older text below them. Where it disagrees with `engine/fixtures/mini-model.json` on a shape, the fixture wins. Judgement calls where the sources are silent or conflict are decided once in `engine/DECISIONS.md` (`C-nn`, `D-nn`, round 3 `E-nn`, engine 0.5-0.7 `G-nn`: 0.5 G-01..G-96, 0.6 G-100..G-225, 0.7 G-230..G-305).
* Every rule you write needs an evidence label. Labels quoted from his sheets keep his spelling inside quotes (e.g. 'SAGITAL', 'TRIPPLE EXTENSION'); canonical ids use correct spelling. Both are intended.

---

## 4. The newest answers in one screen (do not undo)

### 4.0 Round 5, CH5 and CH6 (2026-10-11 to 2026-10-13)

Full trace: [coverage_matrix_round5.md](coverage_matrix_round5.md). Decisions: `engine/DECISIONS.md` G-197..G-199, G-230..G-305.

* **His grades (R5-GRD-01..08), on the engine 0.6 plans.** A: 01 swimming, 02 football, 07 push / pull / legs. B+: 03 soccer, 04 CrossFit-style class, 05 bootcamp, 06 full-body aesthetics, 08 pickleball. His notes on the B+ plans are rules now (below).
* **The health check warns, it does not stop (R5-GEN-02).** A yes on any health question builds the plan with a health warning in English and Spanish: general fitness information, not a plan from a doctor; see a medical professional. The plan never says which question was a yes. Severe pain is built with the moderate pain rules and the same warning (PROPOSED). The wording is `[LEGAL REVIEW]` until the attorney signs off. The liability gate still runs first: no accepted release, no plan.
* **2 days a week = two full-body days (R5-GEN-01; replaces "one A day + one B day").** Day 1: horizontal pull + squat (knee + pull) and incline / vertical push + single-leg hinge (hip + push), biceps. Day 2: horizontal push + hinge (hip + push) and vertical pull + lunge (knee + pull), triceps. Every big group at about 6-8 sets (R4-SES-03). Which slot goes to which day is PROPOSED.
* **Credits and sets.** A high-incline press counts 1.0 chest, 0.25 front delts, 0.25 triceps (R5-VOL-01). Pulling at or above pressing; side delts at least 4 / 6 / 8 direct sets; one biceps and one triceps exercise on A / B days; A day 7th calves, 8th rear delts; B day 7th side delts, 8th calves; advanced physique Focus 22, others 16 (R5-VOL-02..05, 08). A light chest exercise may go on the optional day after a press day (R5-VOL-07). An athlete's flat press holds 4 sets by default, more with a chest Focus (R5-VOL-09). A one-set shortfall goes to the day's first press in the last block (R5-VOL-11). **No group starts at its top number**; a Focus group starts a little higher (R5-CLS-07). The heavy deadlift starts at 3 sets and takes its group's next set first (R5-ATH-12).
* **Big groups (CH5-03).** A big group reaches its planned final sets, with a bonus exercise if needed. No group goes above 35 weekly sets.
* **Athletes.** Every athletic A / B day holds the arm slot (CH5-02). Team practices are not built in or counted; one line tells the athlete to account for them (CH5-01). Jumps go two-leg and low first, single-leg and higher later; no single-leg hurdle hop in the first block (R5-GRD-03). Cutting sports: a lateral or single-leg jump each day, two-foot first (R5-ATH-10). Knee pain: assisted jumps first, and a line to skip jumps above 6 of 10 pain (R5-GRD-08). Athletic doses may hold up to 2 weeks and still reach the block's number (R5-ATH-02). Incline first for throwers and volleyball too, **and overhead pressing stays for shoulder health** (R5-ATH-04; the engine adds one light overhead press a week as joint care in incline-first plans, PROPOSED). Racket players 50+ keep the calf raise on both days (R5-VOL-10). Low-back core only with reported low-back pain; otherwise normal core with rotation (R5-ATH-08, R5-LIB-02). Confirmed as built: R5-ATH-01, 03, 05, 07, 09, 11.
* **Class and bootcamp.** The class uses named community workouts: a "Girl" each week, a "Hero" once a block, a benchmark every 2-4 weeks, the rest varied (R5-GRD-04). Bootcamp alternates "in rounds" and "station by station" (R5-GRD-05). Circuit rounds climb in thirds: 3, then 4, then 5 (R5-CLS-03). Class small muscles at 10-12 reps (R5-CLS-05). Confirmed: R5-CLS-01, 02, 04, 06.
* **Session size defaults (R5-GEN-03).** General 7, aesthetics 7, strength 6, bootcamp 7 stations, field athletes 12, older adults 6.
* **Printed words.** The core block prints as optional: "you may switch it off or change it" (R5-GRD-06).
* **Public repo.** `raw/`, `dumps/`, `analysis/` stay public as link-stripped exports, checked for client names (none found) (R5-PUB-01). Credentials: "Master NASM coach" only; nothing is added (R5-PUB-02).
* **CH6.** A dip above the bench in the last weeks is fine (CH6-01, no change). People and coaches may add **their own exercise** anywhere, answering one question (which muscle it mainly works, or "jump / cardio, no lifting sets"); it is labelled "your exercise: not checked by Blaze Camp rules" (CH6-02). This is a design for the front-end tool; today `engine/edit.mjs > add_exercise` takes library exercises only.

### 4.1 Round 4, CT-01 and CX-01..04 (2026-10-10 and 2026-10-11)

* **No time-fitting (CT-01, R4-SES-01).** Session minutes are not an input and not a limit. Nothing is cut, reshaped or flagged because of time. A day prints an average time as information only. An intake that still sends `schedule.session_minutes` is accepted and the field is ignored with a warning.
* **Session size by exercise count (R4-SES-02).** General fitness and fat loss 5-7, aesthetics and bodybuilding 6-8, strength 5-6, bootcamp 5-7 stations, field athletes in the off-season up to 12, older adults 60+ 5-6. The warm-up and the 2 core exercises are outside the count. These are recommendations in a template: the user adds or removes.
* **His templates are the skeleton (R4-SES-05).** Do not invent day layouts.

  | Slot | Day A = pull + knee dominant | Day B = push + hip dominant |
  |---|---|---|
  | 1 | horizontal pull (two-arm) | horizontal push |
  | 2 | two-leg knee-dominant lift (squat) | two-leg hip-dominant lift (deadlift, hip extension or hip thrust) |
  | 3 | vertical pull | vertical push, or incline |
  | 4 | single-leg knee-dominant lift (lunge) | single-leg hip-dominant lift |
  | 5 | biceps | triceps |
  | 6 | leg extension | leg curl |

  A 4-day week is A, B, rest, A, B. (2 days a week: two full-body days, R5-GEN-01, §4.0.) A day runs 6 to 8 exercises: the extra ones are a small-muscle or core exercise at the end. Push / pull / legs (3 or 6 days), the 3-day builder, athletic days (the athletic block, then the same A/B lifts), bootcamp, the CrossFit-style class, HYROX and strength days follow his sheets (`synthesis/05_templates.json`, `dumps/BYOP/`).
* **2 days a week (R4-SES-03).** Every big muscle group is still trained, at about 6-8 weekly sets instead of 10. The plan says so and suggests a third day. Never drop whole groups and never pile on more exercises. This replaces "train fewer muscles directly" from R3-SES-02. Round 5 builds the two days as two full-body days (R5-GEN-01).
* **Nothing is dropped automatically (R4-SES-04).** The template comes out complete. The person chooses what to remove. Each day names what is easiest to remove (finishers, extra athletic stations, small-muscle accessories, the bonus exercise), never the core block or a main lift.
* **Progression (CX-01..03, R4-PRG-01..04).**
  * Weekly sets per group climb from the start to the planned final sets, and the final sets are reached. Faster steps than about 3% and 5% are allowed. There is no hard cap.
  * The final number is reached in the last week when the math allows. One week early is fine. Never earlier.
  * A week that adds more than about 15% for a group carries a note.
  * A week may hold the same sets while reps or load progress. At the top number, sets stay and load and reps progress.
  * Reps and load are written as a rule the person applies: "3 sets of 8-12. When you hit 12 on every set with 1-2 reps left in the tank, add weight next time and start again at 8." Never a promised number for a week.
  * The next block starts about 5% above the last block's start, in whole sets, never above the level's top.
* **Everything is editable (CX-02, CX-04).** Sets for any day or week, add or remove an exercise, a block on or off. After an edit the totals are recomputed, the plan is marked edited and the old validation is discarded.
* **Library (R4-LIB-01..05).**
  * The exercises that were "proposed" are **optional add-ons**: selectable, never a template pick. The exception is wall balls and sled pushes in HYROX station circuits and in the CrossFit-style class workout. Neck work stays proposed and is never shown.
  * Carries and sled work are dosed by distance or time (2-4 trips of 20-40 m or 20-40 s), carry no muscle-set credit and sit with core and conditioning.
  * **Mid-range pull** is its own small category between horizontal and vertical pull (high row, 45-degree row, the face-pull angle).
  * **Incline pressing before overhead pressing** in the vertical / mid-range push slot for bodybuilders and the general population (and throwers and volleyball, R5-ATH-04). Overhead pressing stays in the plan for shoulder health.
  * A swap prints one line on what it keeps and what it loses.
  * No third-party video links in public data. Each exercise carries a YouTube search link built from its name, and the plan prints the exact name to copy.
* **Safety and scope (R4-SCP-01..03).** Everyone may use the plans. Accepting the terms and the release of liability is required **before** a plan is generated, and a short release line is printed on every plan in English and Spanish. Each sport profile carries a confidence label in data and docs (`confirmed_by_coach`, `similar_sport`, `proposed`); it is not printed on a plan.
* **Release (R4-REL-01..03).** The model is released as the finished product. The engine stays labelled experimental. Credit: Coach Lalo (Gerardo Vera), Master NASM coach, as author and owner. No "world's best" claim and no injury-prevention claim.

### 4.2 Round 3 (approved 2026-10-09), as it stands now

* **Output only (R3-VOL-02, R3-VOL-04).** The plan is generated once with its built-in stairway; people and coaches adjust it themselves. Check-ins, weekly steps from feedback, readiness, logbook-driven changes and `adapt()` are **retired**.
* **Stairway (R3-VOL-04), refined by CX-01 and R4-PRG-01..02.** About 3% a week until the halfway week and about 5% after is the default feel, no longer a limit. The effort cue drifts from 3 reps in reserve (RIR), to 2, to 1-2, to 1 + intensifiers in the last week, always inside 1-3 RIR.
* **R3-SES-02, what is left of it.** The time-fit parts are **retired** by CT-01 and R4-SES-03: no time check, no offers of longer sessions, no "train fewer groups because of time". What stands: users and coaches can switch off a day's athletic block or core block, add or remove exercises or whole blocks, and the plan recommends supersets as a way to save time.
* **Groups (R3-SES-01).** Count focus groups: hips = glutes + hamstrings, shoulders = front + side + rear delts. Calves get one exercise × 3 sets per leg day. Field athletes stay inside 12 exercises + 2 core. Cross pattern is the default for most athletes; the same-pattern athletic template is for size-focused and high-level athletes. How many exercises a group gets on a template day now comes from the template (R4-SES-05).
* **Rear delts (R3-VOL-01)** are part of the shoulders group, not a muscle of their own. The floor is counted on the shoulders group, and users and coaches can add more rear-delt work.
* **Focus muscles (R3-SES-01).** The user may pick Focus muscle 1 and Focus muscle 2 (max 2). Each gets +1 to +3 weekly sets over the balanced plan (default +2, PROPOSED), and the stairway includes them. There is never a sex field.
* **Placement (R3-VOL-03).** An added set alternates between the two exposures of the same day type (Monday's first back exercise, then Thursday's). Extra small-muscle sets become a short bonus exercise on the optional day, or on a day that already trains that muscle.
* **Calendar (R3-PER-01).** The easy week after a block is a recommendation, not mandatory. When a block ends, it ends, and the user builds the next one. Holidays are planned between blocks.
* **Athletes (R3-ATH-01..05).** The full wording is in `coach_answers_round3.md`.
  * *Swimming dryland (R3-ATH-01):* 3 gym days + 1 optional (2 for younger or lower-level swimmers); 0 extra cardio; jumps mostly ballistic (25% plyometric at the end of a block); Olympic lifts 2-3 days; shoulder care every session, never with bands; a 2-week dryland taper lined up with the swim taper before the main meet.
  * *60+ (R3-ATH-02):* landing drills, balance, quick stepping without a hop, light medball throws and fast machine work are on. Low ankle hops, other jumps, Olympic lifts and depth jumps are off unless switched on with the warning. Overhead and low-bar squats stay out. *Pickleball, padel and tennis 50+:* knee-friendly strength, calf and Achilles work every leg day, rotator-cuff work, and only low-impact jumps (no depth jumps, hurdle hops or bounds) unless switched on.
  * *HYROX (R3-ATH-03):* 2 strength days + 2 hybrid days, 4 cardio sessions, and 2 short station circuits a week as finishers that never count as muscle sets. Wall balls ≤ 20 lb; 40-rep / AMRAP sets only inside those circuits; 50% plyometric.
  * *Other sports (R3-ATH-04):* plyometric share at the end of a block from 75% (runners) down to 25% (swimming, water polo, rowing, judo, taekwondo, climbing). Off-season cardio is 2-4 sessions, with 0 extra for swimmers, runners, rowers and endurance cyclists.
  * *Stay active (R3-ATH-05):* the user enters play days. The hardest gym day stays at least 48 h before the biggest play day, and weeks with 3+ play sessions drop the extra agility drills and half the jumps. A 45-60+ min session of the activity counts as one of the 3 cardio sessions (up to 2). With an optional event date, the hardest weeks end 1 week before the event, followed by 1 easy week at about half the sets.
* **Legal (R3-GEN-01), tightened by R4-SCP-01 / R4-SCP-02, changed by R5-GEN-02.** A short Blaze Camp health check (EN/ES, to be written by a lawyer, linking to the official PAR-Q+), which a coach can skip with a warning. A yes on it now builds the plan with a health warning (R5-GEN-02). The terms and liability release are accepted every time a plan is built, before it is built. Nothing is stored. MIT license to Lalo Vera / Blaze Camp / BFit Studios Corp.

### 4.3 Retired in the engine (do not call, do not rebuild)

* Engine 0.4: `adapt()`, `adaptWith()`, `checkinRow()`, the `checkin/2` schema, `output_mode: checkin | logbook`, `rules.stairway.checkin`. `plan.mode: week_by_week` is read as `fixed_12` with the week view.
* Engine 0.5: `engine/timefit.mjs`, `plan.time_check`, `plan.offers`, `meta.session_minutes`, `day.minutes_limit`, `day.supersets_needed`, the rules `session.exercise_cap_by_minutes`, `cut_order`, the stairway step limits, and every warning and check that read minutes. The full list is in the V1 amendment box of `engine/CONTRACTS.md`.
* Engine 0.7: plan status `refer` (a health flag no longer stops a plan, R5-GEN-02); "one A day + one B day" on 2 days (R5-GEN-01); the 50+ low-back hot-spot core list without reported pain (R5-ATH-08); team practices counted as aerobic sessions (CH5-01).
* 60+: R3-ATH-02 allows depth jumps when switched on with the warning. The engine is stricter (`DECISIONS.md` D-05: depth jumps, high depth drops and snatches stay locked even with the opt-in), and stricter is the safe side.

---

## 5. Repository map

| Path | What it is | Edit? |
|---|---|---|
| `README.md`, `MODEL_CARD.md`, `HANDOFF.md`, `RELEASE_CHECK_v1.3.md` | The front door: overview and status, the one-page model card, current state and next steps, and the consistency check of the v1.3 release (history) | yes |
| `BLAZE_CAMP_BRAIN.md` | **Master document** (v1.4): philosophy, categories, levels, volume engine, bilateral vs unilateral, variables, equipment, athletes and sports, templates, plan types, testing, generator, product | yes, with labels |
| `generator_spec_v1.json` | The same model as a machine spec: `inputs_schema`, `derived_values`, `vocab`, `rule_tables`, `template_refs`, `plan_types`, `tests`, `plan_editing`, `legal_and_privacy`, `adaptation` (retired by round 3), `coach_rule_hooks`, `pipeline`, `validation_checks`, `output`, `open_decisions` | yes, with labels |
| `synthesis/` | Detailed model docs (`.md`, most with a `.json` twin): 01 taxonomy, 02 exercise catalog, 03 volume dosing, 04 athlete profiles, 05 session architecture, 06 periodization, 07 science lineage, 08 open questions, 09 generator inputs, 10 / 10b equipment, 11 training variables, 12 volume algorithm, 13 product options; `sports/` (per-group sport research, merged into 04) | yes, with labels |
| `coach_answers*.md` (round 1 to 5, CT, CX, the chats CH5 and CH6), `coach_chat_statements.md`, `answers_raw*/` | The coach's own answers | **never edit existing transcripts**; record a new answer in a separately dated file |
| `raw/`, `dumps/`, `dump.py` | His two workbooks ("BUILD YOUR OWN PROGRAM" = BYOP, "MASTER MODEL") as `.xlsx`, and every tab as text produced by `dump.py`. These are the **link-stripped public exports** (coach decision R5-PUB-01): every third-party video link is replaced with `[video link removed]`, and they were checked for client names (none found) | **never** (regenerate only) |
| `analysis/` | First-pass decode of the library, the reference tabs and every program (`analysis/programs/*.md`) | rarely |
| `docs/` | Plain-language guides: `00-overview`, `01-philosophy`, `02-model`, `03-coach-answers`, `04-decisions` (decision records), `05-reference`, `06-history`; `CONTEXT_FOR_AI.md`; `adding-exercises.md` (+ `.es.md`) | yes, with labels |
| `coverage_matrix*.md` | Each coach answer → master section + spec key (one file per round; `coverage_matrix_round5.md` also names the rules key, layer, decision and test) | yes |
| `model/` | Compiled runtime model: `manifest.json`, `catalog.json`, `rules.json`, `templates.json`, `profiles.json`, `i18n/{en,es,es_review}.json`, `MODEL_VERSION`, `CHANGELOG.md`, `COMPILE_REPORT.json` | **generated**, never by hand |
| `engine/` | The plan engine (`*.mjs`, `progression/`) + `README.md`, `CONTRACTS.md`, `DECISIONS.md`, `BUILD_PLAN.md`, `CONTRACT_REQUESTS.md`; `fixtures/mini-model.json` (reference compile, generated) | yes, per §11 |
| `agent/`, `api/`, `AGENT_PLAYBOOK.md`, `.claude/skills/build-plan/` | Agents that build plans in a conversation: the shared core, the questions as data, the MCP server, the HTTP API (Vercel functions), the playbook and the Claude Code skill (§15) | yes |
| `tools/` | CLIs (the only code with file I/O): `compile-model.mjs` + `compile/*.mjs` (+ `compile/es/` Spanish tables), `check-model.mjs`, `generate-samples.mjs`, `sweep.mjs`, `fixture/*.mjs` (reference fixture builder and the shared amendment layers, oldest `review-v12.mjs` to newest `v07-words.mjs`) | yes |
| `tests/` | `node:test` suites, `helpers/`, `invariants/`, `audit/`, `progression/`, `fixtures/plan-min.json`, `run-all.mjs` + `package.json` (make `node --test tests/` work) | yes |
| `samples/` | `intakes/` (the coach's 7 sample clients + a 52-year-old pickleball player), `plans/` (generated JSON + Markdown, three also in Spanish), `SAMPLES.md`, `STATUS_v0.5.md` (results, gaps, open questions; the engine 0.6 and 0.7 rounds are at its end), and the v0.4 history `REVIEW_LOG.md`, `RECHECK_v0.3.md`, `_retired_v1_0/` | intakes yes; plans generated |
| `design/` | `ENGINE_V05_PLAN.md` (the plan engine 0.5 was built to); `bench/` (94 benchmark intakes, the scorer 2.7, the baseline and the v0.5, v0.6 and v0.7 results; `V07.md` is the reference); the parked planner research (`PLANNER_SPEC.md`, `IMPLEMENTATION_PLAN.md`, `diagnosis.md`, `design_*.md`, `judge_*.md`, `rules_as_constraints.*`, `PROGRESSION_*.md`) | bench yes; research: leave as history |
| `reviews/` | `codex-model-review.md` (outside evidence review), `claude-codex-audit.md` (independent audit of the progression arithmetic), `coach-eye-r*/` (AI coach-eye reviews of the 8 samples, one folder per round) | no (add a new dated review instead) |
| `round*_questions.json`, `coach-questions.html` | The questionnaire content and page | rarely |
| `BLAZE_CAMP_BRAIN_v*.md`, `generator_spec_v0.json` | Earlier snapshots of the master and the spec | **never** |
| `workflows/` | Multi-agent workflow scripts used to build the model (`engine_v05.js` built engine 0.5; `planner_build.js` is parked: do not run it) | rarely |
| `REVIEW_GUIDE.md`, `CODEX_BRIEF.md`, `CONTRIBUTING.md`, `llms.txt` | Reviewer guide, research brief, contribution rules, link index for AI tools | yes |
| `LICENSE`, `DISCLAIMER.md`, `DISCLAIMER.es.md` | MIT license, liability release drafts (attorney review pending) | **never** without the owner |

---

## 6. Where each kind of rule lives

Human docs explain the rule. The compiler reads the machine sources (the spec and the `synthesis/*.json` files) and then applies the shared amendment layers in `tools/fixture/`. The engine reads only `model/`. Key paths use `>` for nesting.

| Topic | Coach ids | Human docs | Machine source | Runtime key (`model/`) | Engine / checks |
|---|---|---|---|---|---|
| Muscles, focus groups, credits (1.0 prime, 0.25 helpers, dips 0.5 / 0.5, thruster 1 / 0.5 / 0.25, high-incline press 1 chest / 0.25 / 0.25, KB swings 0) | VOL-09, VOL-10, LIB-16, R2-VOL-05, R3-SES-01, R3-VOL-01, R5-VOL-01 | BRAIN §5; `synthesis/03_volume_dosing.md` | spec `rule_tables > muscles, counting`; `synthesis/12_volume_algorithm_v1.json > counting` | `rules.json > muscles` (`order`, `defs`, `groups`, `lines`), `credit` (`classes`, `helper`, `never_credit_tags`); `catalog.json > exercises[].credit_class, credits` | `volume.mjs`, `lines.mjs`; V14 / H08, H09 |
| Weekly sets: start, final sets, floor 10 from 3 days, the 2-day rule, Focus muscles, pain, goal modifiers, no start at the top, the 35-set ceiling | VOL-*, R2-VOL-04, R2-VOL-06, R3-VOL-01, R3-SES-01, R4-SES-03, R5-CLS-07, R5-VOL-08, CH5-03 | BRAIN §5; `synthesis/12_volume_algorithm_v1.md` | spec `rule_tables > weekly_sets, priority, pain, goal_phase_modifiers`; 12 `> starting_table, priority, pain, goal_phase_modifiers` | `rules.json > volume` (`start`, `cap`, `floor`, `two_day`, `focus`, `priority`, `pain`, `modifiers`, `phase_factors`, `x3`, `x7`) | `volume.computeTargets`; V13, V22 / H17 |
| Stairway, progression and effort drift | R2-PER-03..05, R3-VOL-04, CX-01..03, R4-PRG-01..04 | BRAIN §5; 12 §3.7; `docs/02-model/stairway.md` | spec `rule_tables > rate_engine`; 12 `> stairway` | `rules.json > stairway` (`standard_steps`, `halfway`, `by_N`, `progression`), `cycles.next_block`, `effort` (`rir_band`, `planned_map`), `render.progression`, `render.acceleration` | `engine/progression/stairway.mjs`, `prescription.mjs`, `volume.stairwayPlan / planWeeklySets`, `dose.mjs`; V15 / H10, H21, H22, V34, V35, V17 / H02 |
| Set placement (first exercise first, alternate exposures, 2-5 sets an exercise, the bonus exercise, the light chest exercise, the one-set shortfall, the heavy deadlift's lead) | VOL-07, ORD-11, R3-VOL-03, CH5-03, R5-VOL-07, R5-VOL-09, R5-VOL-11, R5-ATH-12 | 12; `design/ENGINE_V05_PLAN.md` "How volume is allocated" | spec `rule_tables > set_placement`; 12 `> set_placement` | `rules.json > placement` (`min_sets`, `max_sets_per_exercise`, `bonus`, `optional_focus`, `x3`, `x7`) | `volume.planWeeklySets` |
| Session size, the time estimate, easy-to-remove hints, supersets, circuit rounds | R4-SES-01, R4-SES-02, R4-SES-04, CT-01, R2-SES-04, R3-SES-02 (supersets, switches), R5-GEN-03, R5-CLS-03 | BRAIN §10; `synthesis/05_session_architecture.md` | spec `rule_tables > session_limits, time_model, supersets_contrast_circuits` | `rules.json > session` (`size`, `easy_to_remove`), `time_model` (`use: estimate_only`), `supersets`, `render.estimate`, `render.easy_to_remove` | `intake.sessionSize`, `week.mjs`, `estimate.mjs`; V3, V13, V36 |
| Order and pairing (core first, power before strength, H before V, hip + push / knee + pull) | ORD-*, UNI-11, GEN-08, R2-SES-03 | BRAIN §7, §10; `synthesis/11_training_variables.md` | spec `rule_tables > ordering, pairing`; 11 `> ordering_rules` | `rules.json > ordering`, `pairing`, `core_block` | `week.mjs`; V11 / H06, V12 / H03-H05 |
| Two spine days | PER-04, EQ-11, R2-SES-01, R2-SES-02 | BRAIN §5, §8 | spec `rule_tables > axial_loading`; 02 records `axial_spinal_load.spine_day_v1_1` | `rules.json > axial`; `catalog.json > exercises[].axial, spine_class, axial_pattern` | `select.mjs`; V10 / H07 |
| Bilateral vs unilateral share | UNI-*, R4-SES-05 (a template slot keeps its laterality) | BRAIN §6 | spec `rule_tables > bilateral_unilateral`; 12 `> bilateral_share` | `rules.json > bilateral_share`, `contra_ipsi`, `frontal_transverse`, `selection.skeleton_laterality` | `intake` (D10), `select.mjs`; V28 (warn), V30 |
| Reps, effort, rest, load hints | VOL-13, VOL-15, GEN-08, R2-VOL-02, R4-PRG-03 | BRAIN §7; `synthesis/11_training_variables.md` | spec `rule_tables > reps, effort, rest` | `rules.json > reps`, `effort`, `rest` | `dose.mjs`; V17 / H02, V34 |
| Exercise catalog, optional add-ons, carries, mid-range pull, video search links | CAT-*, LIB-*, EQ-*, R2-LIB-*, R4-LIB-01..05 | `synthesis/02_exercise_catalog.md`; `docs/02-model/exercise-library.md` | `synthesis/02_exercise_catalog.json` (array of 939 source records); coach patches `tools/compile/patches.mjs`; amendments `tools/fixture/review-v12.mjs > amendExercise` ... `v05-library.mjs > amendExerciseV2` | `catalog.json > exercises[]` (733; `status`, `video`), `id_aliases`; `rules.json > selection` (`addons`, `mid_range`, `incline_first`, `swap_notes`), `conditioning.carry`, `render.video` | `select.mjs`, `library.mjs`; V9 / H01, V31, V32 (warn), V33, V37 |
| Equipment, kit tokens, constraint 1-5 | EQ-* | BRAIN §8; `synthesis/10_equipment_model.md` | spec `rule_tables > equipment`; `synthesis/10_equipment_model.json > kit_tokens, access_profiles, client_families` | `rules.json > equipment` (`profiles`, `machines`, `banned_tokens`, `client_families`) | `intake` (D7, D8), `select.mjs`; V7, V9 |
| Week and day templates (the A/B skeleton, the 2-day full-body days, push / pull / legs, athletic, class, bootcamp) | PRG-*, R2-SES-*, R3-SES-01, R4-SES-05, R5-GEN-01 | BRAIN §10; `synthesis/05_session_architecture.md`; `docs/02-model/sessions.md` | `synthesis/05_templates.json > generator_split_templates`; amendments `review-v12.mjs > amendTemplates` ... `v07-select.mjs > amendTemplatesV07` | `templates.json > families` (every station has a `rank`, every day type a `count` and a `skeleton`), `buckets`, `goal_to_family`; `rules.json > template_select`, `validation.v05.skeleton` | `intake` (D6), `week.mjs`; V30, V23 / H18 |
| Athletes, sports, positions, activities, age overlays, confidence labels, jump progression, assisted jumps | ATH-*, R2-ATH-*, R3-ATH-01..05, R4-SCP-03, R5-ATH-*, R5-GRD-03, R5-GRD-08, CH5-01, CH5-02 | BRAIN §9; `synthesis/04_athlete_profiles.md`; `docs/02-model/sports.md` | `synthesis/04_profiles.json > profiles` (127), `sports.list` (52), `activities.list` (26), `age_overlays`, `goal_defaults` | `profiles.json > sports` (each with `confidence`, `confidence_basis`), `picker`; `rules.json > athletic`, `olympic`, `medball`, `population` (`older`, `active_aging_50`, `youth`), `prehab` | `intake` (D2, D11), `budget.mjs`, `athletic.mjs`, `select.mjs`, `dose.mjs`; V5 / H12, V16 / H11, V19, V27 |
| Conditioning, aerobic colours, the class's named workouts, bootcamp formats | ATH-*, R3-ATH-03, R3-ATH-05, R5-GRD-04, R5-GRD-05 | BRAIN §9 | spec `rule_tables > conditioning` | `rules.json > conditioning` (`v7.named_wods`, `v7.vary`), `supersets.v7.bootcamp_format` | `intake` (D14), `week.mjs`, `dose.doseAerobic` |
| Plan types, seasons, recovery week, next block | PER-*, R2-PER-*, R3-PER-01, R4-PRG-04 | BRAIN §11; `synthesis/06_periodization.md` | spec `plan_types`; `synthesis/06_periodization.json` | `rules.json > plan_types`, `recovery`, `cycles` | `shape.mjs`; V24 / H15 |
| Tests (baseline and end only) | R2-PER-07 | BRAIN §12 | spec `tests` | `rules.json > tests` | `shape.mjs`, `dose.mjs`, `generate.mjs` (D-46); V25 / H19 |
| Intake fields (no session length) | GEN-*, R2-GEN-*, R3-SES-01, R4-SES-01 | BRAIN §13; `synthesis/09_generator_inputs.md`, `13_product_options.md` | spec `inputs_schema > fields` | n/a (shape in CONTRACTS §2.1 and the V1 amendment box) | `intake.validateIntake`; V26 / H13, H16 |
| Plan edits (and, for the front-end tool, the person's own exercise) | CX-02, CX-04, R3-SES-02, CH6-02 | BRAIN; `docs/04-decisions/adr-049-endpoint-priority-and-editable-progression.md`; `coach_answers_chat_2026-10-13.md` | spec `plan_editing` | plan `edited`, `edits` | `edit.applyPlanEdits` (library exercises only today) |
| Health check (a flag warns, it does not stop), liability gate, release line, legal copy | R2-GEN-03, R3-GEN-01, R4-SCP-01, R4-SCP-02, R5-GEN-02 | `DISCLAIMER*.md`; BRAIN §14 | spec `legal_and_privacy`, `inputs_schema > copy_placeholders`, `output > copy` (`[LEGAL REVIEW]`, verbatim) | `rules.json > legal` (`gate`, `release_line`, `disclaimer_url`, `health_flag`); `i18n/*.json > health.*, release.*`, `ui.plan.health_warning*` | `intake.safetyScreen / checkRelease`; V1, V21 / H20 |
| Words, EN and ES | GEN-01, R2-GEN-08 | | `tools/compile/i18n.mjs`, `tools/compile/es/*.mjs`, the `UI_*` tables of the amendment layers | `i18n/en.json`, `es.json`, `es_review.json` (machine-translated lines pending his approval) | `render.mjs`, `explain.mjs`; H14 |
| Locked rules and validation registry | GEN-08 + all hard rules | | spec `validation_checks`, `coach_rule_hooks` | `rules.json > locked` (LK01-LK18; LK08 retired), `validation > checks` (V1-V37), `validation > hard` (H01-H22), `validation > v05` (which check holds which v0.5 rule) | `validate.mjs` |
| Check-ins (**RETIRED**, R3-VOL-02 / R3-VOL-04) | R2-VOL-01, R2-GEN-01 | | spec `adaptation` | none | none (H22 holds "planned stairway only") |

---

## 7. How a rule flows from source to plan

```
coach answers ─┐
sheets (dumps) ┼─> BLAZE_CAMP_BRAIN.md, synthesis/*.md, docs/   (human, labelled)
team work ─────┘          │
                          v
   generator_spec_v1.json + synthesis/{02,03,04,05,06,10,11,12}*.json + coach_answers_round2.md   (what the compiler reads)
                          │  tools/compile-model.mjs  (+ tools/compile/*.mjs, coach patches, the tools/fixture/ amendment layers)
                          v
   model/*.json  ── loadModel(raw) ──>  generate(intake, model)  ──>  plan/2 JSON (codes + why, no prose)
                                                                      ├─ renderPlan(plan, model, {lang}) ──> Markdown / text, EN or ES
                                                                      └─ applyPlanEdits(plan, edits, model) ──> an edited plan
```

* `tools/fixture/rules.mjs` (the architect's normative reading) and `tools/compile/rules.mjs` (the compiler's port) both build `rules`. `model/rules.json` must deep-equal the fixture's `rules` (`tests/compile.test.mjs`).
* The **amendment layers** in `tools/fixture/` are shared by both builders and applied in order: `review-v12.mjs`, `round3.mjs`, `athletic-b2.mjs`, `render-b3.mjs`, `integrate-b4.mjs`, `fix-r1-f*.mjs`, `fix-r2-f*.mjs` (engine 0.4), then `v05-structure.mjs`, `v05-words.mjs`, `v05-library.mjs`, `v05-integrate.mjs`, `v05-fix1.mjs`, `v05-fix2.mjs` (engine 0.5), `v06-volume.mjs`, `v06-select.mjs`, `v06-words.mjs` (engine 0.6), `v07-volume.mjs`, `v07-select.mjs`, `v07-words.mjs` (engine 0.7; `v07-words.mjs` also holds the model version 1.4.0). A rule change made in a layer reaches both builds.
* The compiler does not read `BLAZE_CAMP_BRAIN.md` or the round-3, round-4, round-5 and chat answer files. Such a number reaches the engine only through the spec / synthesis JSON plus the rule builders or an amendment layer. So the documents and the layers must be kept in step by hand.
* The compiler cross-checks key numbers against the sources (`tools/compile/crosscheck.mjs`, results in `model/COMPILE_REPORT.json`) and records every coach-correction patch and every layer in `model/CHANGELOG.md`.

---

## 8. Generate a plan

For any single intake or the web tool's answers, `node tools/plan.mjs` writes Markdown, PDF, JSON or HTML for any brand (§15).

### 8.1 Command line (the sample intakes)

```sh
node tools/generate-samples.mjs --only 03 --out /tmp/bc-plans   # samples/intakes/03-*.json -> /tmp/bc-plans/03-soccer.{json,en.md,es.md}
node tools/generate-samples.mjs --fixture --out /tmp/bc-plans   # the same, from the reference fixture model
```

It prints one line per sample (template, training blocks, total sets week 1 → last, failing checks, warnings) and exits 1 if any plan is not `ok` or fails an `error` check. Leave out `--out` only when you mean to update `samples/plans/`.

### 8.2 From JavaScript (any intake)

Save as `try-plan.mjs` in the repo root, then run `node try-plan.mjs` (built-in minimal intake) or `node try-plan.mjs samples/intakes/03-soccer.json`. Run on engine 0.7.0 / model 1.4.0 on 2026-10-13.

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
  release: { accepted: true, version: 'release.client', lang: 'en' },   // the liability gate: no plan without it (R4-SCP-02, H20)
  age: 34,
  body_weight: { value: 170, unit: 'lb' },
  experience: { years_consistent: 2 },
  goal: 'muscle',
  schedule: { days_per_week: 4, weekdays: ['Mon', 'Tue', 'Thu', 'Fri'], start_date: '2026-10-12' },   // no session length (R4-SES-01)
  equipment: { profile: 'FULL_GYM' },
  pain: [],
};

// 3. Generate once (pure and deterministic), check it, render it.
const plan = generate(intake, model);
if (plan.status !== 'ok') { console.log(plan.status, JSON.stringify(plan.errors.length ? plan.errors : plan.refer)); process.exit(1); }
console.log(plan.status, 'valid:', plan.validation.ok, '| template:', plan.meta.template.id, '|', plan.weeks.length, 'weeks');
console.log('exercises per session:', plan.meta.session_size.range.join('-'), '| total sets by week:', plan.summary.total_resistance_sets_by_week.join(' '));
console.log(renderPlan(plan, model, { lang: 'en', view: 'week', weeks: [1] }).split('\n').slice(0, 8).join('\n'));
// renderPlan options: lang 'en' | 'es', view 'full' | 'block' | 'week' | 'day', format 'markdown' | 'text', weeks 'all' | [n, ...], macro true (compact tables)
```

Output with the built-in intake: `ok valid: true | template: aesthetics.4 | 12 weeks`, 6-8 exercises per session, total sets 94 → 144 across the 12 weeks, then the release line and the week-1 card with "Average time: about 80-95 min (an estimate, for information only)". (`tests/helpers/models.mjs > loadCompiledModel()` and `tools/generate-samples.mjs` load the model the same way.)

### 8.3 What `generate` returns

| `plan.status` | When | Content |
|---|---|---|
| `ok` | valid intake and accepted release. A health-check answer of yes, or `severe` pain, does **not** stop the plan (COACH-R5 R5-GEN-02): it is built with a health warning (`meta.health.warn`, `warning.health_flag`, printed in EN and ES under the release line; severe pain is planned with the moderate pain rules, PROPOSED, `engine/DECISIONS.md` G-270 ... G-272) | full `plan/2`; `plan.validation.ok` is true when no `error` check fails; `meta.warnings` lists advisories (e.g. `two_day_rule`, `acceleration`, `credit_only_groups`, `session_minutes_retired`; the full list of codes is in the `engine/CONTRACTS.md` amendment boxes) |
| `invalid` | release not accepted or wrong version (**checked first**), missing or out-of-range field, forbidden key (`sex`, `gender`, `sleep`, `stress`, `recovery`, `job`, `life`, `energy` …) | `errors[]` such as `{code: 'release_missing', field: 'release.accepted'}` or `{code: 'forbidden_key', field: 'sex'}`; no weeks |
| `refer` | **retired** (R5-GEN-02). The current model never returns it. Only an older model without `rules.legal.health_flag` keeps the engine 0.6 stop | `refer.reasons`; no weeks |

* **Intake shape:** `engine/CONTRACTS.md` §2.1 (`intake/2`) as amended by the V1 box at the top of that file (`schedule = {days_per_week, weekdays, start_date}`). The full examples are in `samples/intakes/*.json`. `role: 'client'` (coach mode) needs `health_route` and `release.version: 'release.coach'`; under 18 needs `release.version: 'release.minor'` with `guardian: true`.
* **Deterministic:** the same intake and model give a byte-identical plan. There is no clock, no randomness and no `Intl`, and tie-breaks are seeded from the intake hash and the model's seed version (`rules.determinism.seed_version_map`: model 1.4.0 seeds as 1.3.0, so the version label did not change any plan; G-305).
* **Pure:** engine files import only other `engine/*.mjs` files and do no I/O, so they run unchanged in a browser and store nothing.

### 8.4 Edit a plan

```js
import { applyPlanEdits } from './engine/edit.mjs';
const { plan: edited, applied, conflicts } = applyPlanEdits(plan, [
  { op: 'set_sets', weekday: 'Mon', slot_id: 'Mon.A1.s05', sets: 3, weeks: [1] },   // weeks is optional: leave it out for every week
], model);
```

* Operations: `set_sets`, `remove_exercise`, `add_exercise` (`{weekday, block, exercise_id, sets}`; library exercises only), `set_block` (`{weekday, block, on}`), `swap_exercise` (`{weekday, slot_id, exercise_id}`: the line keeps its place and dose, G-312), `link_exercises` (`{weekday, slot_ids: [2+]}`: the person's own superset, triset or giant set, in the engine's superset form; G-314) and `unlink_exercises` (`{weekday, slot_id}`; also on the engine's own supersets). A link that leaves an order rule (H03, H05, H06) is applied and named in `conflicts`. The web tool's day card uses all seven (`app/edit-ui.js`, app/README.md "Editing"). The person's own exercise (CH6-02: one muscle answer, labelled as theirs, not checked by Blaze Camp rules) is a front-end design, not built yet.
* The result is a new plan with `edited: true`, recomputed weekly totals and a fresh validation. `conflicts[]` tells the person what the edit changed against the plan's shape, for example `{code: 'group_below_target', week: 1, group: 'back', actual: 14, limit: 15}`. Conflicts are information: the edit is still applied (CX-04).
* An edited plan is not judged by the generated-plan size and schedule rules. Do not tell a user that an arbitrary edit still follows every rule.

---

## 9. Plan JSON schema

* **`plan/2` is defined in `engine/CONTRACTS.md` §5**, as amended by the boxes at the top of that file (engine 0.5.0 to 0.7.0). Related: §2.1 `intake/2`, §3 the model files, §4.0 JSDoc typedefs, §6 the validation checks (V1-V37, H01-H22), §7 the why-code registry.
* Real examples: `samples/plans/*.json` (8 full plans). Minimal: `tests/fixtures/plan-min.json` (passes every check; used by the validate and render tests).
* Top level: `schema status model_version engine_version contracts_version seed intake_hash lang units release_stamp refer errors edited meta shape weeks summary validation` (an edited plan adds `edits`).
  `weeks[]` → `days[]` → `blocks[]` (`kind position movable circuit items`) → `items[]` (exercise id, sets, reps, effort `{rir, rpe}`, rest, load, credits, swaps, `swap_notes`, `progression`, `video`, notes, `why`).
* v0.7 fields worth knowing: `meta.health {role, health_route, refer, warn, reasons, bypass}` (the health warning), `meta.stairway[].one_set_shortfall`, `meta.stairway[].main_bonus`.
* v0.5 fields worth knowing: `meta.session_size {type, range, default}`, `meta.two_day`, `meta.time: 'estimate_only'`, `meta.stairway[]` (per block: `group_start`, `group_top`, `schedule`, `capped`, `below_floor`, `bonus`, `acceleration`), `meta.addons` (optional add-ons that fit the client), `day.est_minutes` (information), `day.exercise_count`, `day.easy_to_remove`, `item.progression {kind: 'double_progression', rep_range, when, then, else, promised_numbers: false}`.
* The plan holds **codes and i18n keys only**, never prose. Words come from `model.t(lang, key, args)` at render time. Every non-trivial decision has `why: [{key, ref, args}]`, where `ref` is a coach id (`R4-SES-05`), a rule id (`V10`) or a decision id (`G-12`).

---

## 10. Hard rules: never break these

These map to locked rules (`rules.json > locked`), validation checks (`validation > hard`, `validation > checks`) and tests. The wording below is the current rule after round 5, CH5, CH6, round 4, CT-01 and CX.

| Id | Rule | Source |
|---|---|---|
| H01 | No bands, chains or weight releasers anywhere (exercise, swap, kit token, name, id) | EQ-01, EQ-07, EQ-08, EQ-12 |
| H02 | Never to failure on heavy compounds: effort stays inside 1-3 reps in reserve (min 1 on compounds); `MAX` only on the last set of small-muscle or bodyweight work; `MYO` only on the day's last machine or isolation exercise | GEN-08, VOL-13, VOL-15, R3-VOL-04 |
| H03 | Power before strength | ORD-03, GEN-08 |
| H04 | Horizontal before vertical (pull and push), unless the vertical lift is the day's main `work` (D-30) | ORD-01, ORD-02 |
| H05 | Core block first by default and never skipped on a training day. The user or coach may switch it off themselves; the engine never drops it on its own. The plan prints it as optional: "you may switch it off or change it" | ATH-11, R2-SES-03, R3-SES-02, R4-SES-04, R5-GRD-06 |
| H06 | Hip-dominant lower with a push, knee-dominant lower with a pull | UNI-11, ORD-06, R4-SES-05 |
| H07 | Two spine days: at most one counted heavy squat and one counted heavy hinge a week, never on the same day | PER-04, EQ-11, R2-SES-01, R2-SES-02 |
| H08 | Credits: prime mover 1.0, helpers 0.25; dips 0.5 triceps + 0.5 chest; thruster 1.0 quads + 0.5 front delts + 0.25 glutes; face pull rear delts 1.0 + side 0.25; high-incline press 1.0 chest + 0.25 front delts + 0.25 triceps | VOL-09, LIB-16, R2-VOL-05, R2-LIB-04, R5-VOL-01 |
| H09 | Athletic work (plyos, ballistics, KB swings, throws, Olympic lifts, sprints, change of direction, carries and sled work, conditioning, WODs, HYROX station circuits) never counts toward muscle sets | VOL-10, R2-VOL-05, R3-ATH-03, R4-LIB-02 |
| H10 | Every trained group reaches its planned final sets in the last week, one week early at most, and never sits under its weekly schedule. Faster weekly steps are allowed and there is no rate cap; a week that adds more than about 15% carries a note. A group its template cannot take that far is held at what the slots hold, and the plan says so (`meta.stairway[].capped`). A big group may take a bonus exercise to reach its final sets; no group goes above 35 weekly sets. No group starts at its top number. The earlier limits (7% per muscle, under 10% total) are retired | CX-01, R4-PRG-01, R4-PRG-02, CH5-03, R5-CLS-07 (earlier: UNI-05, R2-VOL-01) |
| H11 | No medball in physique (`muscle` goal) main work; no medball or wall ball above 20 lb anywhere | ATH-05, EQ-06, R3-ATH-03 |
| H12 | Never overhead or low-bar squats for 60+; 60+ default: no Olympic lifts, plyos, jumps or depth jumps unless switched on with the warning (the engine keeps depth jumps, high depth drops and snatches locked, D-05) | EQ-03, R2-ATH-08, R3-ATH-02 |
| H13 | **No sex or gender field**, anywhere | GEN-02, ATH-09 |
| H14 | English default with a full Spanish twin; every user-facing string goes through i18n | GEN-01, R2-GEN-08 |
| H15 | No deload or maintenance week inside a training block; the easy week goes only between blocks and is a recommendation | R2-VOL-07, R3-PER-01 |
| H16 | **No sleep, stress, job or life input**, anywhere | R2-GEN-04 |
| H17 | Floor of 10 weekly sets for every trained group when there are 3 or more training days (shoulders counted as a group; pain-reduced and maintenance-type blocks excepted). On 2 days (two full-body days) every big group is trained at about 6-8 sets, the plan says so and suggests a third day. A group the template cannot take to the floor is named in the plan, never hidden | R2-VOL-06, R3-VOL-01, R4-SES-03, R4-SES-04, R5-GEN-01 |
| H18 | 1-4 exercises per group on a full-body day: the coach's template gives each group its exercises. This replaces "never 1" (R2-SES-05) on his template days | R4-SES-05 (earlier: R2-SES-05, R3-SES-01) |
| H19 | Tests only in week 1 and the last week, never mid-block; never a 1RM or max-effort mile without a completed block | R2-PER-07 |
| H20 | The liability gate: no plan is generated until the terms and the release are accepted for that build (checked before the health screen); the release line is printed on every plan in EN and ES. The health check runs unless a coach skips it with the warning. **A yes on the health check does not stop the plan:** the plan is built and prints a health warning in EN and ES (never which question) | R2-GEN-03, R3-GEN-01, R4-SCP-01, R4-SCP-02, R5-GEN-02 |
| H21 | Stairway shape: weekly sets never decrease, RIR never increases, and the last week is the hardest. A week may hold the same sets while reps or load progress, also at the top number. No fake progress label on an unchanged prescription | R2-PER-03..05, R3-VOL-04, CX-02, CX-03 |
| H22 | Planned stairway only: the whole template is built once and every week follows the planned schedule. No check-ins, tracking or adaptive follow-up. The person or coach can edit anything, including sets for any day or week; an edited plan is marked edited and its old validation is discarded | R2-VOL-03, R3-VOL-02, R3-VOL-04, CX-02..04 |

Rules added in engine 0.5 that are just as hard (`rules.json > validation > v05`):

| Check | Rule | Source |
|---|---|---|
| V3 | **No time-fitting.** A plan carries no session length, minute limit, time check or time offer | CT-01, R4-SES-01 |
| V13 | A generated day holds no more exercises than the client type's range | R4-SES-02 |
| V30 | A day built to one of his skeletons holds his slots in his order, each slot keeps its laterality, and nothing is dropped | R4-SES-05, R4-SES-04 |
| V31 | An optional add-on or a proposed record is never a template pick (wall balls and sled pushes in HYROX circuits and the class workout excepted) | R4-LIB-01 |
| V33 | No third-party video link anywhere in a plan: a YouTube search by exercise name, or the coach's own video | R4-LIB-05 |
| V34 | Reps and load progress by a rule the person applies; no item promises a number for a week | R4-PRG-03 |
| V35 | A week that adds more than about 15% for a group carries the note | R4-PRG-02 |
| V36 | Nothing is removed automatically; a day only names what is easiest to remove | R4-SES-04 |
| V37 | Carries and sled work: 2-4 trips of 20-40 m or 20-40 s, no muscle-set credit | R4-LIB-02 |

Product rules that are just as hard:
* **No data kept (R3-GEN-01).** No storage, accounts, analytics or logging of intakes in anything built here. The engine has no I/O; keep it that way.
* **No check-ins, tracking or adaptive inputs (R3-VOL-02, R3-VOL-04).** Never add a feedback loop, readiness score or "how did it feel" input.
* **No session-length input and no time-fitting (CT-01, R4-SES-01).** Never bring back a time check, a cutter or a time offer.
* **Few inputs.** Every new intake field needs a coach answer behind it.
* **Accounts and stored data need the coach's decision first (R3-GEN-01).** The front-end tool may only store something if he changes that rule.

---

## 11. Changing things safely

### 11.1 The general workflow

1. **Find the authority.** Look up the coach answer that owns the behaviour (§3). If there is none, the change is `INFERRED` or `PROPOSED`: write it down in `engine/DECISIONS.md` (engine) or the doc's open questions, and don't present it as his rule.
2. **Change the human doc** (`BLAZE_CAMP_BRAIN.md` and the matching `synthesis/*.md` or `docs/` page) with its evidence label, then the **machine source** (spec key or `synthesis/*.json`) so the two stay twins.
3. **Change what the engine reads** (§11.2 for rules, §11.3 for exercises). Never edit `model/`, `engine/fixtures/mini-model.json` or `samples/plans/` by hand; regenerate them.
4. **Rebuild and check:** `node tools/fixture/build-fixture.mjs && node tools/fixture/check-fixture.mjs`, `node tools/compile-model.mjs`, `node tools/check-model.mjs`, `node --test tests/`, `node tools/generate-samples.mjs`. All must pass with 0 failures. For a change that can move plans, also run `node tools/sweep.mjs 1500 --render` and `node design/bench/run.mjs --label <name> --compare design/bench/results_v07.json` (a plan whose score drops needs a listed reason). A new model version changes the seed of every tie-break unless `rules.determinism.seed_version_map` maps it (G-305).
5. **Add a test** that fails without your change, named after the coach answer id it reads (as in `tests/v07-*.test.mjs`) or the review issue id (as in `tests/review-v12.test.mjs`). Log engine decisions in `engine/DECISIONS.md` (section G) and what changed for the samples in `samples/STATUS_v0.5.md`.
6. **Never fix a plan by hand.** A problem in a sample plan is fixed in the engine or its data, with a test.

### 11.2 Adding or changing a rule (a number, a table, a list)

* Find the runtime key in §6 and the module that reads it. Engine code reads `model.rules`, usually through `const R = model.rules`, so search both forms: `grep -nE "(rules|R)\.<section>" engine/*.mjs`.
* Make the change in a shared amendment layer in `tools/fixture/` (the newest one, or a new layer wired into both `tools/fixture/build-fixture.mjs` and `tools/compile-model.mjs`). Or change both rule builders identically: `tools/fixture/rules.mjs` (normative) and `tools/compile/rules.mjs` (port). The deep-equal test fails if they drift.
* A brand-new key in `rules.json` is a contract change: record it in `engine/CONTRACT_REQUESTS.md` (append-only) and update `engine/CONTRACTS.md` §3.3.
* Engine code reads every number from `model.rules`. A literal in engine code is allowed only for structure, or with an `// INFERRED: <why>` comment (then also request a rules key).
* Keep `ref`s on everything: values carry `refs` (coach ids) and a `status` that says approved or `PROPOSED`, and plan decisions carry `why(key, ref, args)` from `engine/util.mjs`.

### 11.3 Adding or correcting an exercise

* The source is `synthesis/02_exercise_catalog.json` (one record per exercise; copy a record of the same pattern as your template). The runtime record (`model/catalog.json`, CONTRACTS §3.2) is derived from it: `slots` from `generator.pools`, `credit_class` and `credits` from the pattern and `volume_credit`, `axial` from `axial_spinal_load.spine_day_v1_1`, the 60+ flags from `athletic_quality` / `older_default_excluded`, and so on.
* Fill every lens the coach uses: family, pattern, laterality, plane, level, big / small muscle, primary muscles and credits, equipment set-ups and constraint 1-5, spine load, athletic quality (plyometric vs ballistic, Receive-Create stage), and older / youth suitability. **Never** a band, chain or weight-releaser set-up; the compile fails on the band regex.
* **Never a third-party video link** (R4-LIB-05). The compile attaches a YouTube search link built from the English name; `assertModel` refuses anything else.
* A new exercise the coach has not approved is an **optional add-on** at most (`status: optional_addon`): a swap and an offered add-on, never a template pick (`default_in_slots: []`), until he approves it as a regular pick (R4-LIB-01). If you are unsure he would want it shown at all, keep it `proposed_v1_1` (never shown).
* A correction to an existing record goes in an amendment layer's `amendExercise*` function (shared by the fixture and the compiler) or in the coach-patch layer `tools/compile/patches.mjs` (which fails the compile if its target is missing).
* Add the Spanish name in `tools/compile/es/exercises.mjs` (neutral Latin American Spanish, English gym term in brackets; R2-GEN-08). Any missing key shows up in `model/i18n/es_review.json`.
* The full field-by-field guide with worked examples is `docs/adding-exercises.md` (Spanish: `docs/adding-exercises.es.md`). Contribution rules are in `CONTRIBUTING.md`.

### 11.4 Words (EN / ES)

* Engine and plan use keys only (`exercise.<id>.name`, `note.*`, `warning.*`, `why.*` …; namespaces in CONTRACTS §1.6). No hard-coded words in `engine/`.
* Every key needs EN and ES. Machine-translated ES lines are listed in `model/i18n/es_review.json > machine_translated` until the coach approves them.
* `[LEGAL REVIEW]` copy (health check, release, coach bypass warning, the release line) is used verbatim and never edited by the engine or by you.

### 11.5 Engine code

* Plain `.mjs`, Node 22, **no npm dependencies**, no TypeScript, no build step. Engine files import only `engine/*.mjs`: no `node:` imports, `fs`, `process`, `console` or `fetch`.
* No `Date.now()`, `new Date()` without an argument, `Math.random()`, `performance.now()`, `Intl`, `toLocaleString` or `localeCompare`. Dates are ISO `YYYY-MM-DD` strings handled with `Date.UTC`. Round sets with `roundHalfUp`.
* Pure functions; inputs are never mutated. Programmer errors throw `EngineError`; user-input problems come back as issues.
* Modules: `util`, `model`, `intake`, `shape`, `volume`, `lines`, `budget` and `athletic` (athletic and Olympic budgets and doses), `week`, `select`, `classwork` (the class's named workouts and the bootcamp formats), `library` (add-ons, carries, swap notes, video search), `dose`, `estimate` (the printed time estimate), `progression/stairway` and `progression/prescription` (the stairway and progression arithmetic), `edit`, `validate`, `explain`, `render`, `generate`, `version`. Pipeline: `engine/README.md`. Bump `ENGINE_VERSION` on every behaviour change.
* If the contract is wrong or missing something, implement the closest compliant thing and write it to `engine/CONTRACT_REQUESTS.md`. Don't silently diverge.
* **Do not bring back time-fitting** (no `timefit`, no minutes-based check, cutter, offer or validator), and **do not implement `design/PLANNER_SPEC.md`**.

---

## 12. Tests and checks

```sh
node --test tests/                          # everything (tests/package.json -> run-all.mjs imports every tests/**/*.test.mjs)
node --test tests/volume.test.mjs           # one module
node tools/check-model.mjs [model-dir | --fixture]   # model contract checks (shapes, bands, credits, i18n coverage, video links, rules == fixture rules)
node tools/fixture/check-fixture.mjs        # reference fixture checks
node tools/generate-samples.mjs --out /tmp/bc-plans  # all 8 samples; exit 1 on any failing error check
node tools/sweep.mjs 1500 --render          # 1,500 random intakes + every sport + every activity, on the fixture and on model/
node design/bench/selftest.mjs              # the scorer's own tests
```

| Suite | Covers |
|---|---|
| `compile.test.mjs`, `model.test.mjs` | `model/` equals a fresh compile; `rules` deep-equals the fixture; credits, bands, KB swings, ES coverage; `assertModel` catches injected defects |
| `intake`, `shape`, `volume`, `week`, `select`, `dose` `.test.mjs` | the coach's worked numbers (stairways, starts, final sets, placement, floor, pain), templates, filters, spine days, reps, effort, tests |
| `validate.test.mjs` | one failing mutation per check id (V1-V37, H01-H22) |
| `generate`, `explain`, `render`, `i18n` `.test.mjs` | orchestration, views and formats, every sample in EN + ES with no raw key, placeholder or `undefined` |
| `determinism.test.mjs` | twice-identical plans; no clock, random or `Intl` in engine sources |
| `progression/*.test.mjs`, `audit/claude-codex-audit.test.mjs` | the stairway and progression arithmetic against independent reference calculations |
| `v05-*`, `v06-*`, `v07-*` `.test.mjs` | the engine 0.5 to 0.7 rules, each test named by the coach answer it reads (CT-01, R4-*, CX-*, CH5-*, R5-*) or the rule id; `v07-release.test.mjs` holds the 1.4.0 label and its seed (G-305) |
| `review-*.test.mjs` | one regression test per fixed coach-eye review issue from engine 0.3 and 0.4 (converted where they asserted time-fitting; each conversion has a line in `engine/DECISIONS.md` section G) |
| `invariants/invariants.test.mjs` | samples × 2 models + random intakes + all 52 sports + 26 activities, re-checking H01-H22 independently |

Four ways a plan is checked, from cheapest to closest to the coach: the engine's own validation (`validate.mjs`, severities in `rules.json > validation > checks`), the test suite, the benchmark scorer (`design/bench/`, written separately from the engine; a score is not a coach grade), and reading the samples "with a coach's eye" against his real programs (`REVIEW_GUIDE.md`, `samples/STATUS_v0.5.md`). A plan the coach would not sign is still a bug even when every check passes.

---

## 13. What not to change

* **The coach's words:** `coach_answers.md`, `coach_answers_full.md`, `coach_answers_round2.md`, `coach_answers_round3.md`, `coach_answers_round4.md`, `coach_answers_round5.md`, `coach_answers_time_2026-10-10.md`, `coach_answers_codex_2026-10-10.md`, `coach_answers_chat_2026-10-11.md`, `coach_answers_chat_2026-10-13.md`, `coach_chat_statements.md`, `answers_raw*/`. Quote them; never edit or "correct" them.
* **His sheets and their exports:** never modify the coach's Google Sheets; never edit `raw/` or `dumps/` (regenerate with `dump.py` only). `raw/` and `dumps/` are the link-stripped public exports (R5-PUB-01): never put a third-party video link, a client name or a client's contact details back into them, or into `analysis/`. A fresh export of his live sheets must be stripped the same way before it is committed (`tests/v07-words.test.mjs` checks).
* **Evidence labels and ids:** never remove, upgrade (e.g. `INFERRED` → `OBSERVED`) or invent a label or a coach id. Keep his verbatim labels in quotes as written.
* **His credit and his credentials:** keep the author and owner line. His credentials are written as he gave them: "Master NASM coach" only (R5-PUB-02). Never add, invent or look up other certifications.
* **Retired ideas stay retired.** Don't reintroduce any of these: session minutes as an input or a limit, a time check, time cutters or time offers (CT-01, round 4); a hard cap on the weekly step (7% / 10%), or "sets must rise every week" (CX-01, CX-02); dropping groups or exercises automatically (R4-SES-04); a promised rep or load number per week (R4-PRG-03); a proposed exercise as a template pick (R4-LIB-01); third-party video links (R4-LIB-05); the large optimizer planner as a build target; a weekly % by muscle size; 0.5 helper credit; bands, chains or releasers; sex as an input; sleep, stress or lifestyle questions; deloads or maintenance inside a block; core after the power block as the default; KB swings counted as glute volume; 1RM or max-mile tests from zero; check-ins and adaptive steps (round 3); rear delts with their own floor; a mandatory easy week (round 3); "Justice League" as a program name; hack squat ranked last; a health flag that stops the plan, and one A day + one B day on 2 days (round 5); team practices counted as aerobic sessions (CH5-01).
* **Claims:** no "world's best" claim and no injury-prevention claim, anywhere (R4-REL-03).
* **Generated files by hand:** `model/*`, `engine/fixtures/mini-model.json`, `samples/plans/*`.
* **Historical files:** `BLAZE_CAMP_BRAIN_v*.md` snapshots, `generator_spec_v0.json`, `samples/_retired_v1_0/`, the planner research in `design/`.
* **Legal files:** `LICENSE`, `DISCLAIMER.md`, `DISCLAIMER.es.md`. Reference them; changes go through the owner and his attorney.
* **Git:** don't push to `main` without the owner's say-so; reviewers put findings on a branch or in issues (`REVIEW_GUIDE.md`).

---

## 14. License, disclaimer and data

* **License:** MIT ([LICENSE](LICENSE)), copyright 2026 Lalo Vera, doing business as Blaze Camp, and BFit Studios Corp. (a Florida corporation). Keep the copyright and permission notice in every copy.
* **Credit:** the model is the intellectual property and coaching experience of Coach Lalo (Gerardo Vera), Master NASM coach (R4-REL-03).
* **Disclaimer and release:** [DISCLAIMER.md](DISCLAIMER.md) (EN) and [DISCLAIMER.es.md](DISCLAIMER.es.md) (ES), meant to be legally equivalent; both are drafts pending review by a Florida attorney. In short: not medical advice; use at your own expense and risk; no warranty; liability released; coaches and gyms need their own screening, release and insurance; minors need a parent or guardian and a qualified coach.
* **Every generated plan** requires the accepted release for that build (`intake.release`, H20; stamped as `plan.release_stamp` with `accepted: true`). The rendered plan prints the release line at the top and at the bottom, and a short line on every block, week and day view, with the link to the disclaimer.
* **Data:** the generator keeps no personal data (R3-GEN-01, DISCLAIMER §7). If you build an app or service on this, privacy and data handling are yours.
* **Third-party content:** the compiled model and the library source hold no third-party video links (R4-LIB-05). By the coach's decision R5-PUB-01 the exports of his original sheets (`raw/`, `dumps/`) are kept public as **link-stripped exports**: every third-party video link in them, in the first-pass files in `analysis/`, in `synthesis/02_exercise_catalog_crosswalk.json` and in the old model snapshots in `design/scratch/snap*/` was replaced with `[video link removed]` (2026-10-12; `engine/DECISIONS.md` G-276). They were checked for client names and contact details; none were found. Only YouTube search links built from exercise names remain.

---

## 15. Agents that build plans

An AI agent (Claude Desktop, Claude Code, Claude in Chrome, ChatGPT, any MCP or shell agent) can build a plan when someone asks:
it asks the web tool's questions in conversation, shows the release and gets an explicit "I accept", builds the plan and gives
back a PDF and Markdown (EN or ES, in the right brand), or hands out a prefilled link to the web tool. How to talk to the person:
[AGENT_PLAYBOOK.md](AGENT_PLAYBOOK.md). Setup recipes: [agent/README.md](agent/README.md).

| Path | Entry |
|---|---|
| Shell / any agent | `node tools/plan.mjs --questions --lang es`; `node tools/plan.mjs --answers a.json --brand <id> --lang es --out plans --format md,pdf [--site https://...]`; `--intake`, `--link`, `--plan ... --edits ...` |
| MCP (stdio) | `node agent/mcp-server.mjs [--out dir]`: `get_questions`, `build_plan`, `render_plan`, `plan_slots`, `search_exercises`, `edit_plan`, `list_brands` |
| HTTP (each Vercel deployment) | `GET /api/questions?lang=`, `POST /api/plan`, `GET /api/openapi` (for a custom GPT Action) |
| Claude Code skill | `.claude/skills/build-plan/SKILL.md` |
| Prefilled web link | `app/prefill.js`: `https://<site>/#a=<base64url answers>&l=es`; the page opens on its last screen |

* **One source.** The questions are built from the wizard (`app/intake-builder.js`, `app/i18n.js`) and the model's words
  (`agent/questions.mjs`; `agent/questions.json` is checked current by a test). The brand's words and legal party wording come
  from `app/brands/<id>.js` through `tools/brand-legal.mjs > brandModelRaw`, the same function the site build uses. The PDF is
  `app/pdf.js` with the vendored jsPDF, run in Node. Nothing names a brand in `agent/`.
* **Gate and data rules.** The release must be accepted in the conversation before `accepted: true` is sent; the agent attests it
  (coach's decision, 2026-10-13), and the prefilled link is the recommended path when the person is not in the conversation (the
  link never carries `accepted`, `guardian` or the health answers, and the answers sit in the URL fragment, which never reaches a
  server). A health yes warns and does not stop the plan. Nothing is stored or logged; the API answers `Cache-Control: no-store`.
  The API is open like the web tool (coach's decision, 2026-10-13); no rate limit yet.
* **Brands.** A deployment answers with its env `BRAND`; the CLI and MCP take `--brand`. The site address (`--site`, env
  `SITE_URL_<ID>` / `SITE_URL`, or `site_url` in the brand file) gives the link, and for a brand with its own disclaimer pages
  (Son Hábitos) the release link, so it is required for that brand. A new brand is a new `app/brands/<id>.js` plus a Vercel
  project with `BRAND=<id>`.
* **Tests.** `tests/agent-cli.test.mjs`, `agent-questions`, `agent-mcp`, `agent-api` (mock req / res), `agent-prefill`.
