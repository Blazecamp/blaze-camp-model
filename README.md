# Blaze Camp Model

A complete coaching model from the experience of **Coach Lalo (Gerardo Vera), Master NASM coach**. It holds his exercise library, his categories, his programming rules, his sport profiles and his own answers to 218 questions, written so that people and AI agents can read it, check it and build on it. It also holds an experimental engine that turns a short intake (goal, sport, experience, training days, equipment) into a complete, editable training template in English or Spanish.

> **Author and owner.** This model is the work and the intellectual property of Coach Lalo (Gerardo Vera). It is his coaching experience, condensed and consolidated, and the way he thinks through putting a program together (COACH-R4 R4-REL-03). "Blaze Camp" is the name and the culture behind it. He shares it under the MIT license so that anyone can use it in their own training or their own app.

One page that sums up what this is, who it is for and where its limits are: [MODEL_CARD.md](MODEL_CARD.md).

## Status (2026-10-11)

| Part | Status | What that means |
|---|---|---|
| **Model v1.3** | **Complete** | Every answer the coach has given is applied and can be traced to its source: four questionnaire rounds (140 + 45 + 13 + 20 questions) and two later clarifications (CT-01 and CX-01..04). "Complete" does not mean every number is his. What he confirmed and what is still proposed is listed in [MODEL_CARD.md](MODEL_CARD.md). |
| **Engine v0.5** | **Experimental** | It builds a complete plan for any valid intake from the coach's own day templates, sized by exercise count, with no time-fitting. Its measured results are below. AI reviewers grade the 8 sample plans B- to B+. **The coach's grades (round 5): A for 3 samples, B+ for 5** (table below). |
| Disclaimers and release text | Drafts | They need review by a licensed Florida attorney before the release is called final. |
| Spanish | Not yet approved by the coach | The team reviewed the plan-facing lines for neutral Latin American wording. 842 machine-translated lines (mostly exercise names and cues) are marked for the coach's review. |
| Website or form | Not built, by decision | The model and the logic come first. |

Current state and next steps for anyone picking the project up: [HANDOFF.md](HANDOFF.md).

### Engine v0.5: measured results

Source: [samples/STATUS_v0.5.md](samples/STATUS_v0.5.md) and [design/bench/V05.md](design/bench/V05.md), run of 2026-10-11 on engine 0.5.0 and compiled model 1.3.0. For live numbers, run the commands in "Quick start".

| Check | Result |
|---|---|
| Tests (`node --test tests/`) | 1,407 tests: 1,401 pass, 0 fail, 4 to-do, 2 skipped |
| Model contract check (`node tools/check-model.mjs`) | 0 errors, 0 warnings |
| The 8 sample plans | 8 of 8 built, 0 failing error checks |
| Sweep of 1,578 intakes (1,500 random, one per sport, one per activity), on the reference model and on the compiled model | 0 failing error checks, 0 render problems, 0 crashes |
| Benchmark of 102 plans (94 test intakes + the 8 samples) | Mean score 97.67, lowest 89.35 |
| Benchmark hard-rule violations | 3, in 2 of the 102 plans |
| The same benchmark on engine 0.4 | Mean 64.4, lowest 27.6, 2,228 hard-rule violations |

How to read these numbers:

- A benchmark score is the scorer's number, not a coach grade. The engine 0.4 run used an older scorer that still had time metrics, and the scorer was corrected several times during v0.5 (versions 2.0 to 2.3). Compare the two runs loosely. Each scorer change is listed in `samples/STATUS_v0.5.md`.
- Rules that hold in every benchmark plan they apply to: the floor of 10 sets and the 2-day rule, the coach's templates slot for slot, session size, final sets reached (or the plan says how far the template holds the group), no week with fewer sets than the week before, no time fields, progression written as a rule, the library rules, the liability gate, and the same plan every time for the same intake.
- What still fails somewhere: the 3 hard-rule violations (one CrossFit plan with more jumps than its target in two weeks, and one MYO set that the scorer and the engine place on different exercises), athletic work under the sport's weekly target in 45 of the 63 athletic plans, and 35 shortfalls in 30 plans that the plan does not yet say in words.

**Sample plan grades.** AI "coach-eye" reviewers read each sample plan the way the coach would and graded it up to three times, with an engine fix round after the first and the second review. They are not the coach. A sample that already met the goal was not read again, and its grade is carried over. The last column is **the coach's grades (round 5)**: Coach Lalo graded the 8 sample plans himself (COACH-R5 R5-GRD-01 ... 08, [coach_answers_round5.md](coach_answers_round5.md)); his notes on the B+ plans became rules.

| Sample | Review 1 | Review 2 | Review 3 (AI, latest) | The coach's grades (round 5) |
|---|---|---|---|---|
| 01 Swimming | B- | B- | B | **A** |
| 02 Football | C+ | B | B | **A** |
| 03 Soccer | C+ | B- | B | **B+** |
| 04 CrossFit-style class | C+ | B- | B- | **B+** |
| 05 Bootcamp | B- | B- | B- | **B+** |
| 06 Full-body aesthetics (A/B days) | C+ | B | B | **B+** |
| 07 Push / pull / legs | B | B+ | B+ | **A** |
| 08 Pickleball, 52, knee pain | C | B | B+ | **B+** |

The goal in [design/ENGINE_V05_PLAN.md](design/ENGINE_V05_PLAN.md) is B+ or better on every sample. Two of eight are there. The known gaps and the open questions for the coach are at the end of `samples/STATUS_v0.5.md`.

## Use at your own risk / Uso bajo su propio riesgo

**EN:** This is general fitness information, not medical advice. Downloading or using this repository, or any plan generated from it, is entirely at your own expense and risk. Lalo Vera, Blaze Camp and BFit Studios Corp. are released from all liability. If you use it to program for clients or anyone else, you must have your own health screening, liability release and insurance. Read [DISCLAIMER.md](DISCLAIMER.md) in full.

**ES:** Esto es información general de acondicionamiento físico, no asesoría médica. Descargar o usar este repositorio, o cualquier plan generado con él, es por completo por su propia cuenta y riesgo. Lalo Vera, Blaze Camp y BFit Studios Corp. quedan liberados de toda responsabilidad. Si lo usa para programar a clientes u otras personas, debe tener su propia evaluación de salud, liberación de responsabilidad y seguro. Lea [DISCLAIMER.es.md](DISCLAIMER.es.md) completo.

Everyone may use the plans (COACH-R4 R4-SCP-01). The engine builds no plan until the terms and the release of liability are accepted, and every plan prints a short release line at the top and at the bottom, in English and Spanish (COACH-R4 R4-SCP-02).

License: [MIT](LICENSE). Copyright 2026 Lalo Vera, doing business as Blaze Camp, and BFit Studios Corp.

## The model in ten lines

1. **Few answers in, the whole plan out, once.** No check-ins, no tracking, no stored data. The person or their coach edits the plan.
2. **The plan is a template built from the coach's own day layouts.** A day = pull + knee dominant (row, squat, pulldown, lunge, biceps, leg extension). B day = push + hip dominant (press, hinge or hip thrust, vertical or incline press, single-leg hinge, triceps, leg curl). Push / pull / legs, the 3-day builder, athletic days, bootcamp, a CrossFit-style class, HYROX and strength days come from his sheets.
3. **Sessions are sized by exercise count, not by minutes.** General fitness 5-7, aesthetics 6-8, strength 5-6, bootcamp 5-7 stations, field athletes up to 12, older adults 5-6. The warm-up and the 2 core exercises are outside the count. The plan prints an average time as information only.
4. **Nothing is dropped automatically.** The template comes out complete, and each day names what is easiest to remove.
5. **Weekly sets per muscle group climb like a stairway** from a starting number to a planned final number, and the final number is reached. A week that adds more than about 15% carries a note. When a template's exercises cannot hold a group's planned sets, the group is held at what they can hold and the plan says so (for example "24 of 25").
6. **Reps and load progress by a rule the person applies**, never a promised number per week.
7. **Floor of 10 weekly sets** for every trained group when there are 3 or more training days. On 2 days every big group is still trained, at about 6-8 sets, and the plan suggests a third day.
8. **Order and pairing:** core first, power before strength, horizontal before vertical, knee-dominant work with a pull and hip-dominant work with a push, heavy squat and heavy deadlift on different days.
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
| [RELEASE_CHECK_v1.3.md](RELEASE_CHECK_v1.3.md) | Whoever releases | The final consistency check of v1.3: what was searched and fixed, test and benchmark numbers, the sample grades, and what still needs the coach or an attorney. |
| [REVIEW_GUIDE.md](REVIEW_GUIDE.md), [CODEX_BRIEF.md](CODEX_BRIEF.md) | Outside reviewers | How to review the model, and the research brief. |
| [CONTRIBUTING.md](CONTRIBUTING.md), [docs/adding-exercises.md](docs/adding-exercises.md) | Contributors | How to propose a change and how to add an exercise (Spanish: [docs/adding-exercises.es.md](docs/adding-exercises.es.md)). |

## What's in here

| Path | What it is |
|---|---|
| `BLAZE_CAMP_BRAIN.md` | **The master document.** Philosophy, categories, levels, volume, bilateral vs unilateral, equipment, athletes and sports, session and week templates, plan types, testing and the generator. Earlier versions are kept as `BLAZE_CAMP_BRAIN_v0.md`, `_v1.md`, `_v1_1.md` and `_v1_2.md`. |
| `generator_spec_v1.json` | The same model in machine-readable form: intake fields, derived values, rule tables, plan types, coach-rule hooks and validation checks. |
| `synthesis/` | Detailed model documents (01 taxonomy, 02 exercise catalog, 03 volume, 04 athlete and sport profiles, 05 session architecture, 06 periodization, 07 science lineage, 10 equipment, 11 training variables, 12 volume algorithm, 13 product options). Each has a `.md` and most have a `.json`. |
| `coach_answers_round4.md`, `coach_answers_time_2026-10-10.md`, `coach_answers_codex_2026-10-10.md`, `coach_answers_round3.md`, `coach_answers_round2.md`, `coach_answers_full.md`, `coach_chat_statements.md`, `coach_answers.md` | The coach's own words, newest first. **They are the final authority** over everything read or inferred from his sheets. They are never edited. |
| `coverage_matrix*.md` | Each coach answer mapped to where the master document and the spec state it. |
| `docs/` | Plain-language guides: overview, philosophy, each part of the model, everything he answered by topic, decision records, reference and history. |
| `raw/`, `dumps/` | Excel exports of his two original Google Sheets ("BUILD YOUR OWN PROGRAM" and "MASTER MODEL"), and every tab as plain text. |
| `analysis/` | The first-pass decode of the library, the reference tabs and every program in the sheets. |
| `model/` | The compiled runtime model the engine reads: 733 exercises, 30 templates, 127 sport and activity profiles (52 sports, 26 "stay athletic and active" activities), the rules, and English and Spanish text (2,697 strings each). Built from the sources by `tools/compile-model.mjs`. Never edited by hand. |
| `engine/` | The plan engine (experimental): plain JavaScript for Node 22 and browsers, no dependencies, the same plan every time for the same intake. Start with `engine/README.md`. Shapes are in `engine/CONTRACTS.md`. Every judgement call is logged in `engine/DECISIONS.md`. |
| `tests/` | The test suite. The v0.5 tests are named after the coach answer each one reads. |
| `samples/` | 8 sample clients (`samples/intakes/`) and the plans the engine built for them (`samples/plans/`, Markdown and JSON, three of them also in Spanish). `samples/STATUS_v0.5.md` has the results, the known gaps and the open questions. |
| `design/` | `ENGINE_V05_PLAN.md` (the plan engine 0.5 was built to), `bench/` (94 benchmark intakes and the scorer), and the research for a larger optimizer planner, which is parked and not being built. |
| `reviews/` | The outside model review and the independent audit of the progression arithmetic. |
| `workflows/` | The multi-agent workflow scripts used to build and verify the model. |
| `coach-questions.html`, `round*_questions.json` | The questionnaire page and the questions as asked. |

## Which source wins

When two sources disagree, the higher one wins.

1. `coach_answers_round4.md` (COACH-R4) and `coach_answers_time_2026-10-10.md` (COACH-CT CT-01)
2. `coach_answers_codex_2026-10-10.md` (COACH-CX CX-01..04)
3. `coach_answers_round3.md` (COACH-R3)
4. `coach_answers_round2.md` (COACH-R2)
5. `coach_answers_full.md` (COACH-ANSWER, round 1)
6. `coach_chat_statements.md` and `coach_answers.md` (things he said in conversation)
7. Facts read from his sheets (`raw/`, `dumps/`)
8. Team work: inferred, from the literature, or proposed

CT-01 and CX-01..04 win only on the subjects they answer (session time; progression and editing).

## How the model was built

1. Both Google Sheets were exported in full and every tab was decoded: the exercise library, the reference tabs and every program.
2. Specialist analyses turned that into categories, an exercise catalog, volume rules, athlete profiles, session architecture, periodization, equipment and training variables. Each one was fact-checked against the raw data.
3. The coach answered four rounds of questions (140, 45, 13 and 20) and gave two clarifications in conversation. Every answer was folded back in, and a coverage check traces each answer to the master document and the spec.
4. Volume and periodization rules were compared with published research. Sources are cited in `synthesis/12_volume_algorithm_v1.md` and `synthesis/07_science_lineage.md`. An outside review of the science is in `reviews/codex-model-review.md`.
5. The engine was built on the compiled model and checked four ways: a test suite, a sweep of random intakes, a benchmark with its own scorer, and AI reviewers reading sample plans against his real programs.

The full story, step by step: [docs/06-history/timeline.md](docs/06-history/timeline.md). What comes next: [docs/06-history/roadmap.md](docs/06-history/roadmap.md).

## Evidence labels

Every rule in the documents is tagged with where it came from.

- `OBSERVED`: read from the coach's sheets
- `COACH-ANSWER <id>`, `COACH-R2 <id>`, `COACH-R3 <id>`, `COACH-R4 <id>`, `COACH-CT CT-01`, `COACH-CX <id>`: the coach said so
- `COACH-CHAT <date>`: he said so in conversation
- `INFERRED`: reasoned from the sheets or his answers
- `SCIENCE`: from the cited literature
- `PROPOSED`: suggested by the team and waiting for the coach's approval

## Notes

- This repository makes no claim to be the best model, and no claim that following a plan prevents injury. It is one coach's system, written down faithfully and labelled by source.
- Third-party exercise video links are not part of the compiled model or the library source. Each exercise carries a YouTube search link built from its name, and a plan prints the exact name to copy (COACH-R4 R4-LIB-05). The exports of his original sheets (`raw/`, `dumps/`), the first-pass files in `analysis/`, the source-cell map `synthesis/02_exercise_catalog_crosswalk.json` and the old model snapshots in `design/scratch/snap*/` still contain third-party links that Blaze Camp does not own. Whether those files stay public is an open release item ([RELEASE_CHECK_v1.3.md](RELEASE_CHECK_v1.3.md)).
- No personal data is kept. The engine has no storage, accounts, analytics or network calls.
- License: MIT (see `LICENSE`), copyright Lalo Vera, doing business as Blaze Camp, and BFit Studios Corp. (Florida). The disclaimer and liability release are in `DISCLAIMER.md` (EN) and `DISCLAIMER.es.md` (ES). Both are drafts pending review by a Florida attorney.
