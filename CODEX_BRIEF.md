# Brief for Codex (research job)

**Goal:** understand the training model of Coach Lalo (Gerardo Vera), then research outside sources to find (1) data that supports or challenges its science and (2) exercises, categories or rules it is missing.

The model is his intellectual property and his coaching experience (COACH-R4 R4-REL-03). You are checking it and looking for gaps. You are not redesigning it.

## Status of this brief (2026-10-11; updated 2026-10-13)

- A first review was delivered: [reviews/codex-model-review.md](reviews/codex-model-review.md). It read the model as of commit `c13cbaa`, before round 4. Keep it as background.
- Since then the coach answered **round 4** and gave two clarifications (**CT-01**, **CX-01..04**). The model is now v1.3. Several things that were open when the first review was written are now settled. Do not report them as open:
  - **Session time.** Plans are no longer fitted to minutes. They are sized by exercise count, and time is printed as an estimate only (CT-01, R4-SES-01, R4-SES-02).
  - **Mid-range pull** is now its own category (R4-LIB-03).
  - **Rate limits against the final target.** The planned final sets are reached, faster steps are allowed, and a week that adds more than about 15% carries a note (CX-01, R4-PRG-01, R4-PRG-02).
  - **Proposed exercises** are optional add-ons, never template picks (R4-LIB-01).
- **Round 5 (2026-10-12) and the chats CH5 / CH6 are in too: the model is now v1.4.** Settled there: a health-check yes warns and does not stop the plan (R5-GEN-02); 2 days = two full-body days (R5-GEN-01); a high-incline press counts 1.0 chest (R5-VOL-01); jumps two-leg first (R5-GRD-03); overhead pressing kept for shoulder health (R5-ATH-04); no group above 35 weekly sets (CH5-03). Full list: [coverage_matrix_round5.md](coverage_matrix_round5.md).
- A second research pass should work from the v1.4 files below.

## Which source wins

`coach_answers_round4.md` and `coach_answers_time_2026-10-10.md` (CT-01) > `coach_answers_codex_2026-10-10.md` (CX-01..04) > `coach_answers_round3.md` > `coach_answers_round2.md` > `coach_answers_full.md` > `coach_chat_statements.md` > facts read from his sheets > inferred, science and proposed content written by the team.

## Where things are

| What | File |
|---|---|
| One page on the model, its scope and its limits | `MODEL_CARD.md` |
| The whole model, explained | `BLAZE_CAMP_BRAIN.md` (v1.4; section 0e lists what round 5 changed, 0d what round 4 changed) |
| The same model as data (parameters, rule tables, intake fields) | `generator_spec_v1.json` |
| Exercise library (every exercise with its tags) | `synthesis/02_exercise_catalog.json`, summary in `synthesis/02_exercise_catalog.md`; the compiled runtime library is `model/catalog.json` (742 exercises) |
| How exercises are categorized | `synthesis/01_taxonomy.md` |
| Volume rules and the science behind them | `synthesis/12_volume_algorithm_v1.md`, `synthesis/03_volume_dosing.md` |
| Sports and "stay active" profiles (52 sports, 26 activities), each with a confidence label | `synthesis/04_athlete_profiles.md`, `synthesis/04_profiles.json`, `docs/02-model/sports.md` |
| Sessions, plan lengths, equipment, variables | `synthesis/05_*`, `06_*`, `10_*`, `11_*` |
| His real programs, to compare any claim against | `analysis/programs/*.md`, `dumps/` |
| Science sources already cited | `synthesis/07_science_lineage.md`, `synthesis/10b_equipment_variables_science.md` |
| The coach's own words (final authority) | the answer files in the order above |
| Decisions and why | `docs/04-decisions/` (ADR-050 to ADR-058 record round 4) |
| How to add an exercise | `docs/adding-exercises.md` |

**The engine** (`engine/`, `model/`, `tests/`, `samples/`, `tools/`) is experimental and is not the subject of this brief. If you want to see what the rules produce, read the 8 sample plans in `samples/plans/` and the results in `samples/STATUS_v0.5.md`. **Ignore** the parked planner research in `design/` (`PLANNER_SPEC.md` and the files around it): it is not being built.

## Job 1: back up the science

For each major rule, find the strongest published evidence for or against it, and say whether the model's numbers are well supported, debatable or unsupported. The rules to cover:

- weekly sets per muscle group, by level
- the floor of 10 weekly sets with 3 or more training days, and about 6-8 sets per big group on 2 days
- the stairway: weekly sets climbing to a planned final number, with faster steps allowed when needed and a note above about 15% in one week
- progression of reps and load written as a rule the person applies (a double-progression rule)
- 0.25 credit for helper muscles
- sessions sized by exercise count (5-7 general, 6-8 aesthetics, 5-6 strength, up to 12 for field athletes, 5-6 for older adults)
- the A day / B day split: pull with knee-dominant work, push with hip-dominant work
- the bilateral:unilateral share by sport
- plyometric vs ballistic work by ground-contact time
- core first
- horizontal before vertical
- incline pressing before overhead pressing for bodybuilders and the general population
- heavy spinal loading once a week per pattern
- machines for older, injured and high-volume clients
- the light medball rule
- carries and sled work dosed by distance or time
- the testing rules
- rep ranges by muscle size
- 4-6 week blocks with stable exercises, and no deload inside a block

Give full citations with links. Compare with other models and systems too: Renaissance Periodization, NSCA guidelines, Juggernaut, Volt, CrossFit, and the published needs analyses for each sport.

## Job 2: what's missing

- Exercises, equipment or movement categories that a complete library should have and this one lacks. Check against open databases (free-exercise-db, wger, ExerciseDB) and the major coaching systems.
- Sports, positions or populations with thin or missing profiles. Start with the profiles labelled `proposed` (37) and `similar_sport` (67).
- Rules or parameters that other serious models have and this one doesn't.

## How to report

Write your findings to `reviews/codex-science.md` and `reviews/codex-gaps.md` on a branch such as `review/codex`. Don't push to `main`.

For each finding give: what it is, where in the repo it applies, your evidence with links, and a suggested change.

Rules for the report:

- A coach answer you disagree with is not an error. List it under "for discussion with the coach".
- Say which evidence is a trial, which is a review, which is expert practice and which is only a convention.
- Do not write that the model is the best of its kind, and do not write that it prevents injury. The repo makes neither claim.
- Do not look up or list the coach's certifications. His credential line is "Master NASM coach" only (R5-PUB-02).
