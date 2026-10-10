# Brief for Codex (research job)

**Goal:** understand coach Lalo Vera's training model, then research outside sources to find (1) data that supports or challenges its science and (2) exercises, categories or rules it is missing.

## Where things are

| What | File |
|---|---|
| The whole model, explained | `BLAZE_CAMP_BRAIN.md` (v1.2) |
| The same model as data (parameters, rule tables, intake fields) | `generator_spec_v1.json` |
| Exercise library (every exercise with its tags) | `synthesis/02_exercise_catalog.json`, summary in `synthesis/02_exercise_catalog.md` |
| How exercises are categorized | `synthesis/01_taxonomy.md` |
| Volume rules and the science behind them | `synthesis/12_volume_algorithm_v1.md`, `synthesis/03_volume_dosing.md` |
| Sports and "stay active" profiles (52 sports, 26 activities) | `synthesis/04_athlete_profiles.md`, `synthesis/04_profiles.json` |
| Sessions, plan lengths, equipment, variables | `synthesis/05_*`, `06_*`, `10_*`, `11_*` |
| Science sources already cited | `synthesis/07_science_lineage.md`, `synthesis/10b_equipment_variables_science.md` |
| The coach's own words (final authority) | `coach_answers_round3.md` > `coach_answers_round2.md` > `coach_answers_full.md` |
| His original sheets | `raw/*.xlsx`, as text in `dumps/` |
| How to add an exercise | `docs/adding-exercises.md` |

**Ignore for now:** `engine/`, `model/`, `tests/`, `samples/`, `tools/`, `design/`. The plan engine is being rebuilt.

## Job 1: back up the science
For each major rule, find the strongest published evidence for or against it, and say whether the model's numbers are well supported, debatable or unsupported. The rules to cover:
- weekly sets per muscle
- the stairway progression
- 0.25 credit for helper muscles
- the bilateral:unilateral share by sport
- plyometric vs ballistic work by ground-contact time
- core first
- horizontal before vertical
- heavy spinal loading once a week per pattern
- machines for older, injured and high-volume clients
- the light medball rule
- the testing rules
- rep ranges by muscle size
- 4–6 week blocks with stable exercises

Give full citations with links. Compare with other models and systems too: Renaissance Periodization, NSCA guidelines, Juggernaut, Volt, CrossFit, and the published needs analyses for each sport.

## Job 2: what's missing
- Exercises, equipment or movement categories that a complete library should have and this one lacks. Check against open databases (free-exercise-db, wger, ExerciseDB) and the major coaching systems.
- Sports, positions or populations with thin or missing profiles.
- Rules or parameters that other serious models have and this one doesn't.

## How to report
Write your findings to `reviews/codex-science.md` and `reviews/codex-gaps.md` on a branch such as `review/codex`. Don't push to `main`.

For each finding give: what it is, where in the repo it applies, your evidence with links, and a suggested change.

A coach answer you disagree with is not an error. List it under "for discussion with the coach".
