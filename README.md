# Blaze Camp Model

A complete, machine-readable model of how the Blaze Camp coach designs training programs, and a plan generator built on it. You enter basic information (goal, sport, experience, days, equipment) and get a 4–6, 8 or 12-week plan, a week-by-week plan or a year plan, written the way the coach programs.

> **Status: work in progress, public for review.** The model and library are complete enough to read and research. The plan engine is being rebuilt, and the coach has not yet graded the sample plans, so treat everything as a draft. The goal is a free, fully explained training model that anyone can use in their own app or training, and that AI agents can read and build on.

## ⚠️ Use at your own risk / Uso bajo su propio riesgo

**EN:** This is general fitness information, not medical advice. Downloading or using this repository, or any plan generated from it, is entirely at your own expense and risk. Lalo Vera, Blaze Camp and BFit Studios Corp. are released from all liability. If you use it to program for clients or anyone else, you must have your own health screening, liability release and insurance. Read [DISCLAIMER.md](DISCLAIMER.md) in full.

**ES:** Esto es información general de acondicionamiento físico, no asesoría médica. Descargar o usar este repositorio, o cualquier plan generado con él, es por completo por su propia cuenta y riesgo. Lalo Vera, Blaze Camp y BFit Studios Corp. quedan liberados de toda responsabilidad. Si lo usa para programar a clientes u otras personas, debe tener su propia evaluación de salud, liberación de responsabilidad y seguro. Lea [DISCLAIMER.es.md](DISCLAIMER.es.md) completo.

License: [MIT](LICENSE). © 2026 Lalo Vera, d/b/a Blaze Camp, and BFit Studios Corp.

## What's in here

| Path | What it is |
|---|---|
| `BLAZE_CAMP_BRAIN.md` | **Start here.** The master document: philosophy, categories, levels, volume engine, bilateral vs unilateral, equipment, athletes and sports, session and week templates, plan types, testing, and the generator. |
| `generator_spec_v1.json` | The same model in machine-readable form: intake fields, derived values, rule tables, plan types, check-in adaptation, coach-rule hooks and validation checks. |
| `synthesis/` | Detailed model documents (01 taxonomy, 02 exercise catalog, 03 volume, 04 athlete and sport profiles, 05 session architecture, 06 periodization, 07 science lineage, 10 equipment, 11 training variables, 12 volume algorithm, 13 product options). Each has a `.md` and most have a `.json`. |
| `coach_answers.md`, `coach_answers_full.md`, `coach_answers_round2.md` | The coach's own answers to 185 questions. **These are the final authority** over everything inferred from the sheets. |
| `raw/` | Excel exports of the coach's two original Google Sheets ("BUILD YOUR OWN PROGRAM" and "MASTER MODEL"). |
| `dumps/` | Every tab of those sheets as plain text, including dropdown sources, colours and merged cells. Produced by `dump.py`. |
| `analysis/` | The first-pass decode of the library, reference tabs and every program in the sheets. |
| `workflows/` | The multi-agent workflow scripts used to build and verify the model. |
| `coach-questions.html` | The questionnaire page used to collect the coach's answers. |
| `model/` | The compiled runtime model the engine reads: exercise catalog, rules, templates, sport and activity profiles, and English and Spanish text (2,121 strings each). Built from `synthesis/` by `tools/compile-model.mjs`. |
| `engine/` | The plan engine: plain JavaScript (Node 22 and browsers), no dependencies, deterministic. Start with `engine/README.md`. Contracts are in `engine/CONTRACTS.md` and every judgement call is logged in `engine/DECISIONS.md`. |
| `tests/` | `node --test tests/` runs 711 tests: 705 pass, 0 fail, 6 marked to-do. They cover the coach's hard rules, the round-2 rules, regressions from the review, and 1,578 generated intakes. |
| `samples/` | 8 sample clients (`samples/intakes/`) and the plans the engine generated for them (`samples/plans/`, Markdown and JSON, two of them in Spanish): swimming, football, soccer, CrossFit-style bootcamp, bootcamp, full-body aesthetics, push/pull/legs, and a bonus 52-year-old pickleball player. `samples/REVIEW_LOG.md` lists every issue the coach-eye reviewers found and how each was handled. |
| `round3_questions.json` | The next open questions for the coach (13). |

## Status (2026-10-09)

- **Model: v1.1.** All 185 coach answers are applied. Sport coverage is 52 sports with positions where they matter, plus 26 "stay athletic and active" activities including pickleball and HYROX. Coverage checks are in `coverage_matrix.md` and `coverage_matrix_round2.md`.
- **Engine: v0.3, first working draft.** It produces complete, valid plans for any intake. Reviewers read the 8 sample plans the way the coach would and graded them **C to D**: the structure is right, but the dosing isn't there yet. The main open problems, with full detail in `samples/REVIEW_LOG.md` and the re-check notes:
  - When the chosen session time is short, the coach's minimums can't all fit: 10 sets per muscle, 2–4 exercises per muscle, and a climbing stairway. Many muscles then sit below the floor and stay flat. This needs a coach decision (round-3 question R3-SES-02).
  - Some days run over the chosen minutes, or exceed the 12 + 2 exercise cap for field athletes.
  - Athletic work (jumps, throws, COD) doesn't always follow the sport budget or climb with the stairway. Jump exercises change mid-block where the Receive-Create stages and the exercise blocks don't line up.
  - Some block-to-block changes print as placeholders ("– different implement") instead of a real variation.
  - The Spanish needs the coach's review.
- **Not built yet:** the website, the weekly check-in screens, and accounts. See `synthesis/13_product_options.md` for the proposed product.

## How the model was built

1. Both Google Sheets were exported in full and every tab was decoded: the exercise library, the reference tabs and every program.
2. Specialist analyses turned that into categories, an exercise catalog, volume rules, athlete profiles, session architecture, periodization, equipment and training variables. Each one was fact-checked against the raw data.
3. The coach answered 140 questions in round 1 and 45 in round 2. Every answer was folded back in, and a coverage check confirms each answer appears in the master document and the spec.
4. Volume and periodization rules were checked against published research. Sources are cited in `synthesis/12_volume_algorithm_v1.md` and `synthesis/07_science_lineage.md`.

## Evidence labels

Every rule in the docs is tagged with where it came from:

- `OBSERVED`: read from the coach's sheets
- `COACH-ANSWER` / `COACH-R2 <id>`: the coach said so
- `INFERRED`: reasoned from the sheets
- `SCIENCE`: from the cited literature
- `PROPOSED`: suggested and waiting for the coach's approval

## Notes

- Exercise video links that appear in the original sheets are not owned by Blaze Camp.
- "Blaze Camp" is the name and culture behind this work.
- License: MIT (see `LICENSE`), copyright Lalo Vera, d/b/a Blaze Camp, and BFit Studios Corp. (Florida). The disclaimer and liability release are in `DISCLAIMER.md` (EN) and `DISCLAIMER.es.md` (ES). Both are drafts pending review by a Florida attorney.
