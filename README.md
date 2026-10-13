# Blaze Camp Model

A complete coaching model from the experience of **Coach Lalo (Gerardo Vera), Master NASM coach**. It holds his exercise library, his categories, his programming rules, his sport profiles and his own answers to 261 questions, written so that people and AI agents can read it, check it and build on it. It also holds an experimental engine that turns a short intake (goal, sport, experience, training days, equipment) into a complete, editable training template in English or Spanish.

> **Author and owner.** This model is the work and the intellectual property of Coach Lalo (Gerardo Vera). It is his coaching experience, condensed and consolidated, and the way he thinks through putting a program together (COACH-R4 R4-REL-03). "Blaze Camp" is the name and the culture behind it. He shares it under the MIT license so that anyone can use it in their own training or their own app.

One page that sums up what this is, who it is for and where its limits are: [MODEL_CARD.md](MODEL_CARD.md).

## Status (2026-10-13): model v1.4 + engine 0.7.0

| Part | Status | What that means |
|---|---|---|
| **Model v1.4** | **Complete** | Every answer the coach has given is applied and traced to its source: five questionnaire rounds (140 + 45 + 13 + 20 + 43 questions) and his clarifications in conversation (CT-01, CX-01..04, CH5, CH6). "Complete" does not mean every number is his: [MODEL_CARD.md](MODEL_CARD.md) lists what he confirmed and what is still proposed. |
| **Engine 0.7.0** | **Experimental** | It builds a complete plan for any valid intake from the coach's own day templates, sized by exercise count, with no time-fitting. **The coach graded the 8 sample plans in round 5: A for 3, B+ for 5.** His notes became rules in engine 0.7. |
| Disclaimers, release text and the health warning | In use | The coach set an attorney review aside for now (CH6-03). |
| Spanish | Accepted as the starting version (CH6-03) | Neutral Latin American Spanish, reviewed by the team. 832 machine-translated lines stay marked for later polishing. |
| Front-end tool (website or form) | **Next step** | Not built yet. The model and the logic came first. See [HANDOFF.md](HANDOFF.md). |

Current state, open items and next steps: [HANDOFF.md](HANDOFF.md).

### What changed in round 5 (short)

- A yes on the health check **no longer stops the plan**. The plan is built with a clear health warning (R5-GEN-02).
- 2 days a week = **two full-body days** (R5-GEN-01).
- Jumps start two-leg and low, and get single-leg and higher later. With knee pain, jumps start assisted (R5-GRD-03, R5-GRD-08).
- The CrossFit-style class uses named community workouts; bootcamp alternates rounds and station by station; circuit rounds climb 3, 4, 5 (R5-GRD-04, R5-GRD-05, R5-CLS-03).
- No group starts at its top number. A high-incline press counts for chest (R5-CLS-07, R5-VOL-01).
- Incline first for pressing, and overhead pressing stays for shoulder health (R5-ATH-04).
- The core block is printed as optional. Everything is adjustable (R5-GRD-06).

Every answer and where it lives: [coverage_matrix_round5.md](coverage_matrix_round5.md).

### Engine 0.7.0: measured results

Run of 2026-10-13 on engine 0.7.0 and model 1.4.0. For live numbers, run the commands in "Quick start".

| Check | Result |
|---|---|
| Tests (`node --test tests/`) | 1,692 tests: 1,687 pass, 0 fail, 3 to-do, 2 skipped |
| Model contract check (`node tools/check-model.mjs`) | 0 errors, 0 warnings |
| The 8 sample plans | 8 of 8 built, 0 failing error checks |
| Sweep of 1,578 intakes (1,500 random, one per sport, one per activity), on the reference model and on the compiled model | 0 failing error checks, 0 render problems, 0 crashes |
| Benchmark of 102 plans (94 test intakes + the 8 samples), scorer 2.7 | Mean 98.04, lowest 89.35 |
| Benchmark hard-rule violations | 2, in 1 of the 102 plans |

How to read these numbers:

- A benchmark score is the scorer's number, not a coach grade ([design/bench/V07.md](design/bench/V07.md)).
- What still fails somewhere: athletic work (jumps, throws, sprints, Olympic sets) under the sport's weekly target in 38 of the 59 athletic plans, and one CrossFit plan with more jumps than its target in two weeks.

**Sample plan grades.** The coach graded the engine 0.6 plans (round 5). AI "coach-eye" reviewers then read the engine 0.7 plans the way he would (round 9, and round 10 for the three below A-). They are not the coach.

| Sample | The coach's grades (round 5) | AI round 9 | AI round 10 |
|---|---|---|---|
| 01 Swimming | **A** | A | - |
| 02 Football | **A** | A | - |
| 03 Soccer | **B+** | A- | - |
| 04 CrossFit-style class | **B+** | B+ | A- |
| 05 Bootcamp | **B+** | A- | - |
| 06 Full-body aesthetics (A/B days) | **B+** | A- | - |
| 07 Push / pull / legs | **A** | B+ | A |
| 08 Pickleball, 52, knee pain | **B+** | B+ | A- |

"The coach's grades (round 5)" are his own (COACH-R5 R5-GRD-01 ... 08, [coach_answers_round5.md](coach_answers_round5.md)). He has not graded engine 0.7 yet.

## Use at your own risk / Uso bajo su propio riesgo

**EN:** This is general fitness information, not medical advice. Downloading or using this repository, or any plan generated from it, is entirely at your own expense and risk. Lalo Vera, Blaze Camp and BFit Studios Corp. are released from all liability. If you use it to program for clients or anyone else, you must have your own health screening, liability release and insurance. Read [DISCLAIMER.md](DISCLAIMER.md) in full.

**ES:** Esto es información general de acondicionamiento físico, no asesoría médica. Descargar o usar este repositorio, o cualquier plan generado con él, es por completo por su propia cuenta y riesgo. Lalo Vera, Blaze Camp y BFit Studios Corp. quedan liberados de toda responsabilidad. Si lo usa para programar a clientes u otras personas, debe tener su propia evaluación de salud, liberación de responsabilidad y seguro. Lea [DISCLAIMER.es.md](DISCLAIMER.es.md) completo.

Everyone may use the plans (COACH-R4 R4-SCP-01). The engine builds no plan until the terms and the release of liability are accepted, and every plan prints a short release line at the top and at the bottom, in English and Spanish (COACH-R4 R4-SCP-02). A yes on the health check does not stop the plan: the plan prints a health warning to see a medical professional (COACH-R5 R5-GEN-02).

License: [MIT](LICENSE). Copyright 2026 Lalo Vera, doing business as Blaze Camp, and BFit Studios Corp.

## The model in ten lines

1. **Few answers in, the whole plan out, once.** No check-ins, no tracking, no stored data. The person or their coach edits the plan.
2. **The plan is a template built from the coach's own day layouts.** A day = pull + knee dominant (row, squat, pulldown, lunge, biceps, leg extension). B day = push + hip dominant (press, hinge or hip thrust, vertical or incline press, single-leg hinge, triceps, leg curl). On 2 days a week: two full-body days built from the same slots. Push / pull / legs, the 3-day builder, athletic days, bootcamp, a CrossFit-style class, HYROX and strength days come from his sheets.
3. **Sessions are sized by exercise count, not by minutes.** General fitness 5-7 (default 7), aesthetics 6-8 (7), strength 5-6 (6), bootcamp 5-7 stations (7), field athletes up to 12 (12), older adults 5-6 (6). The warm-up and the 2 core exercises are outside the count. The plan prints an average time as information only.
4. **Nothing is dropped automatically.** The template comes out complete, and each day names what is easiest to remove.
5. **Weekly sets per muscle group climb like a stairway** from a starting number (never the top number) to a planned final number, and the final number is reached. A week that adds more than about 15% carries a note. When a template's exercises cannot hold a group's planned sets, the group is held at what they can hold and the plan says so (for example "24 of 25").
6. **Reps and load progress by a rule the person applies**, never a promised number per week.
7. **Floor of 10 weekly sets** for every trained group when there are 3 or more training days. On 2 days (two full-body days) every big group is still trained, at about 6-8 sets, and the plan suggests a third day.
8. **Order and pairing:** core first (printed as optional), power before strength, horizontal before vertical, knee-dominant work with a pull and hip-dominant work with a push, heavy squat and heavy deadlift on different days.
9. **Counting:** the prime mover counts 1 set, helpers count a quarter. Jumps, throws, sprints, Olympic lifts, carries and conditioning never count as muscle sets.
10. **Never:** bands or variable resistance, a sex field, sleep or stress questions, a deload inside a block, tests in the middle of a block.

## Quick start

Node 22, no dependencies, no build step.

```sh
node --test tests/                                             # the whole test suite
node tools/check-model.mjs                                     # contract checks on the compiled model (read-only)
node tools/generate-samples.mjs --only 08 --out /tmp/bc-plans  # one sample plan as JSON and Markdown
node design/bench/selftest.mjs                                 # the benchmark scorer checks itself
```

How to generate a plan from your own intake, in JavaScript: [AGENTS.md](AGENTS.md) section 8.

## Documentation

| File | For whom | What it is |
|---|---|---|
| [MODEL_CARD.md](MODEL_CARD.md) | Everyone | One page: what the model is, who it is for, its scope and limits, what is confirmed and what is proposed. |
| [docs/README.md](docs/README.md) | Everyone | The map of the documentation: reading paths for coaches, developers, AI agents and reviewers, and a table from a question to the page that answers it. |
| [docs/CONTEXT_FOR_AI.md](docs/CONTEXT_FOR_AI.md) | AI agents | One self-contained briefing of the whole model. |
| [AGENTS.md](AGENTS.md) | AI agents and developers | The working guide: which source wins, where each rule lives, how to generate a plan, the hard rules, how to change things safely. |
| [HANDOFF.md](HANDOFF.md) | Whoever continues the work | Current state and next steps. |
| [coverage_matrix_round5.md](coverage_matrix_round5.md) | Whoever checks the model | Every round-5, CH5 and CH6 answer and where it lives (document, rule key, decision, test). |
| [RELEASE_CHECK_v1.3.md](RELEASE_CHECK_v1.3.md) | Whoever releases | The consistency check of the v1.3 release (history). |
| [REVIEW_GUIDE.md](REVIEW_GUIDE.md), [CODEX_BRIEF.md](CODEX_BRIEF.md) | Outside reviewers | How to review the model, and the research brief. |
| [CONTRIBUTING.md](CONTRIBUTING.md), [docs/adding-exercises.md](docs/adding-exercises.md) | Contributors | How to propose a change and how to add an exercise (Spanish: [docs/adding-exercises.es.md](docs/adding-exercises.es.md)). |

## What's in here

| Path | What it is |
|---|---|
| `BLAZE_CAMP_BRAIN.md` | **The master document** (v1.4). Philosophy, categories, levels, volume, bilateral vs unilateral, equipment, athletes and sports, session and week templates, plan types, testing and the generator. Earlier versions are kept as `BLAZE_CAMP_BRAIN_v0.md`, `_v1.md`, `_v1_1.md`, `_v1_2.md` and `_v1_3.md`. |
| `generator_spec_v1.json` | The same model in machine-readable form: intake fields, derived values, rule tables, plan types, coach-rule hooks and validation checks. |
| `synthesis/` | Detailed model documents (01 taxonomy, 02 exercise catalog, 03 volume, 04 athlete and sport profiles, 05 session architecture, 06 periodization, 07 science lineage, 10 equipment, 11 training variables, 12 volume algorithm, 13 product options). Each has a `.md` and most have a `.json`. |
| `coach_answers_round5.md`, `coach_answers_chat_2026-10-13.md`, `coach_answers_chat_2026-10-11.md`, `coach_answers_round4.md`, `coach_answers_time_2026-10-10.md`, `coach_answers_codex_2026-10-10.md`, `coach_answers_round3.md`, `coach_answers_round2.md`, `coach_answers_full.md`, `coach_chat_statements.md`, `coach_answers.md` | The coach's own words, newest first. **They are the final authority** over everything read or inferred from his sheets. They are never edited. |
| `coverage_matrix*.md` | Each coach answer mapped to where the master document and the spec state it. |
| `docs/` | Plain-language guides: overview, philosophy, each part of the model, everything he answered by topic, decision records, reference and history. |
| `raw/`, `dumps/` | Excel exports of his two original Google Sheets ("BUILD YOUR OWN PROGRAM" and "MASTER MODEL"), and every tab as plain text. Public, with third-party video links removed (R5-PUB-01). |
| `analysis/` | The first-pass decode of the library, the reference tabs and every program in the sheets. |
| `model/` | The compiled runtime model the engine reads (1.4.0): 742 exercises, 30 templates, 127 sport and activity profiles (52 sports, 26 "stay athletic and active" activities), the rules, and English and Spanish text (2,834 strings each). Built from the sources by `tools/compile-model.mjs`. Never edited by hand. |
| `engine/` | The plan engine (experimental): plain JavaScript for Node 22 and browsers, no dependencies, the same plan every time for the same intake. Start with `engine/README.md`. Shapes are in `engine/CONTRACTS.md`. Every judgement call is logged in `engine/DECISIONS.md`. |
| `tests/` | The test suite. The v0.5 to v0.7 tests are named after the coach answer each one reads. |
| `samples/` | 8 sample clients (`samples/intakes/`) and the plans the engine built for them (`samples/plans/`, Markdown and JSON, three of them also in Spanish). `samples/STATUS_v0.5.md` has the results of every round, up to engine 0.7.0 at its end. |
| `design/` | `ENGINE_V05_PLAN.md` (the plan engine 0.5 was built to), `bench/` (94 benchmark intakes, the scorer and the results; `V07.md` is the latest), and the research for a larger optimizer planner, which is parked and not being built. |
| `reviews/` | The outside model review, the independent audit of the progression arithmetic, and the AI coach-eye reviews of the samples (`coach-eye-r*/`). |
| `workflows/` | The multi-agent workflow scripts used to build and verify the model. |
| `coach-questions.html`, `round*_questions.json` | The questionnaire page and the questions as asked. |

## Which source wins

When two sources disagree, the higher one wins.

1. `coach_answers_round5.md` (COACH-R5), with `coach_answers_chat_2026-10-11.md` (COACH-CH5) and `coach_answers_chat_2026-10-13.md` (COACH-CH6)
2. `coach_answers_round4.md` (COACH-R4) and `coach_answers_time_2026-10-10.md` (COACH-CT CT-01)
3. `coach_answers_codex_2026-10-10.md` (COACH-CX CX-01..04)
4. `coach_answers_round3.md` (COACH-R3)
5. `coach_answers_round2.md` (COACH-R2)
6. `coach_answers_full.md` (COACH-ANSWER, round 1)
7. `coach_chat_statements.md` and `coach_answers.md` (things he said in conversation)
8. Facts read from his sheets (`raw/`, `dumps/`)
9. Team work: inferred, from the literature, or proposed

The chat answers (CT-01, CX, CH5, CH6) win only on the subjects they answer.

## How the model was built

1. Both Google Sheets were exported in full and every tab was decoded: the exercise library, the reference tabs and every program.
2. Specialist analyses turned that into categories, an exercise catalog, volume rules, athlete profiles, session architecture, periodization, equipment and training variables. Each one was fact-checked against the raw data.
3. The coach answered five rounds of questions (140, 45, 13, 20 and 43) and gave clarifications in conversation (CT-01, CX, CH5, CH6). Every answer was folded back in, and a coverage check traces each answer to the master document and the spec.
4. Volume and periodization rules were compared with published research. Sources are cited in `synthesis/12_volume_algorithm_v1.md` and `synthesis/07_science_lineage.md`. An outside review of the science is in `reviews/codex-model-review.md`.
5. The engine was built on the compiled model and checked four ways: a test suite, a sweep of random intakes, a benchmark with its own scorer, and AI reviewers reading sample plans against his real programs.

The full story, step by step: [docs/06-history/timeline.md](docs/06-history/timeline.md). What comes next: [docs/06-history/roadmap.md](docs/06-history/roadmap.md).

## Evidence labels

Every rule in the documents is tagged with where it came from.

- `OBSERVED`: read from the coach's sheets
- `COACH-ANSWER <id>`, `COACH-R2 <id>`, `COACH-R3 <id>`, `COACH-R4 <id>`, `COACH-R5 <id>`, `COACH-CT CT-01`, `COACH-CX <id>`, `COACH-CH5 <id>`, `COACH-CH6 <id>`: the coach said so
- `COACH-CHAT <date>`: he said so in conversation
- `INFERRED`: reasoned from the sheets or his answers
- `SCIENCE`: from the cited literature
- `PROPOSED`: suggested by the team and waiting for the coach's approval

## Notes

- This repository makes no claim to be the best model, and no claim that following a plan prevents injury. It is one coach's system, written down faithfully and labelled by source.
- Third-party exercise video links are not part of the compiled model or the library source. Each exercise carries a YouTube search link built from its name, and a plan prints the exact name to copy (COACH-R4 R4-LIB-05). By the coach's decision (R5-PUB-01) the exports of his original sheets (`raw/`, `dumps/`), the first-pass files in `analysis/`, the source-cell map `synthesis/02_exercise_catalog_crosswalk.json` and the old model snapshots in `design/scratch/snap*/` stay public as link-stripped exports: every third-party video link was replaced with `[video link removed]`, and they were checked for client names (none found).
- No personal data is kept. The engine has no storage, accounts, analytics or network calls.
- License: MIT (see `LICENSE`), copyright Lalo Vera, doing business as Blaze Camp, and BFit Studios Corp. (Florida). The disclaimer and liability release are in `DISCLAIMER.md` (EN) and `DISCLAIMER.es.md` (ES). Both are drafts pending review by a Florida attorney.
