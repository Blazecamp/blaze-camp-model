# Blaze Camp Model

A complete, machine-readable model of how the Blaze Camp coach designs training programs, and a plan generator built on it. You enter basic information (goal, sport, experience, days, equipment) and get a 4–6, 8 or 12-week plan, a week-by-week plan or a year plan, written the way the coach programs.

> **Status: private work in progress.** The plan is to open-source this once the coach has graded the sample plans and approved the model. It will be a free, fully explained training model that anyone can use in their own app or training, and that AI agents can read and build on.

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
| `engine/`, `samples/`, `model/` | *(coming next)* The plan engine (plain JavaScript, no dependencies), the compiled runtime model, and sample plans graded by the coach. |

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
- Licensing for the public release is still to be decided. The proposal is Apache-2.0 for code and CC BY 4.0 for the model; see `synthesis/13_product_options.md`.
