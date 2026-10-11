# Review guide (for Codex or any reviewing agent)

This repo holds the Blaze Camp training model: how Coach Lalo (Gerardo Vera), Master NASM coach, designs programs, made machine-readable so that a generator can write plans in his style. The model is his work and his intellectual property. Your job is to **find errors, gaps and contradictions** and report them. Please don't rewrite the model.

Status on 2026-10-11: model v1.3 is complete and the plan engine (v0.5) is experimental. Read [MODEL_CARD.md](MODEL_CARD.md) first, then [HANDOFF.md](HANDOFF.md).

## Ground rules

1. **Don't push to `main`.** Put your findings in `reviews/<your-name>-<date>.md` on a branch (for example `review/codex`), or open GitHub issues. Each finding needs: file, section or JSON key, what's wrong, the evidence, and a suggested fix.
2. **Authority order (highest first).** When two sources disagree, the higher one wins:
   1. `coach_answers_round4.md` (COACH-R4, the newest questionnaire round) and `coach_answers_time_2026-10-10.md` (COACH-CT CT-01, on session time only)
   2. `coach_answers_codex_2026-10-10.md` (COACH-CX CX-01..04, on progression and editing only)
   3. `coach_answers_round3.md` (COACH-R3)
   4. `coach_answers_round2.md` (COACH-R2)
   5. `coach_answers_full.md` (COACH-ANSWER, round 1, 140 questions)
   6. `coach_chat_statements.md` and `coach_answers.md` (things he said in conversation)
   7. `OBSERVED` facts from his sheets (`raw/*.xlsx`, decoded in `dumps/`; his real programs in `analysis/programs/*.md`)
   8. `INFERRED`, `SCIENCE` and `PROPOSED` content written by the team

   A doc that contradicts a coach answer is a bug. A coach answer that you think is scientifically questionable is **not** a bug; report it separately as "for discussion".
3. **Don't "correct" his vocabulary.** Labels quoted from his sheets keep his spelling inside quotes (e.g. 'SAGITAL', 'TRIPPLE EXTENSION'). Canonical names in the model use correct spelling. Both are intended.
4. **Evidence labels matter.** Every rule should be tagged `OBSERVED` / `COACH-ANSWER <id>` / `COACH-R2 <id>` / `COACH-R3 <id>` / `COACH-R4 <id>` / `COACH-CT CT-01` / `COACH-CX <id>` / `COACH-CHAT <date>` / `INFERRED` / `SCIENCE` / `PROPOSED`. Flag rules with no label, and labels that are wrong (e.g. a claim marked OBSERVED that isn't in the sheets, or a team proposal presented as his rule).
5. **Do not judge session length.** The coach removed time-fitting (CT-01): the user owns the time. A plan is sized by exercise count. A long or short day is not a finding. An exercise count outside his range is.
6. **Never hand-edit a plan.** A problem in a sample plan is a finding against the engine or its data.

## What to check (in priority order)

1. **Coach answers are applied.** For each answer in the files above, check that `BLAZE_CAMP_BRAIN.md` and `generator_spec_v1.json` reflect it. The `coverage_matrix*.md` files (one per round) claim they do; verify a sample of at least 30 rows, starting with round 4, CT-01 and CX.
2. **Retired ideas are gone.** These were rejected or replaced by the coach and must not appear as active rules:
   - session minutes as an input or a limit; a time check, time cutters, the 100% / 110% day-length rules, or offers of longer sessions (CT-01, R4-SES-01)
   - dropping muscle groups or exercises automatically, including "train fewer groups because of time" (R4-SES-03, R4-SES-04)
   - a hard cap on the weekly step (7% per muscle, 10% in total), or "sets must rise every week" (CX-01, CX-02)
   - a promised rep or load number for a given week (R4-PRG-03)
   - check-ins, tracking, a logbook, stored data, or anything that adapts the plan from feedback (round 3)
   - a proposed exercise used as a template pick (R4-LIB-01; wall balls and sled pushes in HYROX and the CrossFit-style class are the exception)
   - third-party video links in the public model data (R4-LIB-05)
   - the weekly % chosen by muscle size (it is chosen by the person's state)
   - 0.5 helper credit (it is 0.25)
   - bands, chains or weight releasers anywhere
   - sex as an input
   - sleep, stress or lifestyle questions
   - deloads or maintenance inside a block
   - core after the power block as the default (core is first)
   - KB swings counted as glute volume
   - rear delts with their own floor (they are part of shoulders); a mandatory easy week after a block
   - 1RM or max-mile tests for untrained people
   - "Justice League" as a program name
   - hack squat ranked last
   - the large optimizer planner (`design/PLANNER_SPEC.md`) described as the next thing to build
   - any claim that the model is the world's best, or that it prevents injury (R4-REL-03)

   One earlier item changed: "never one exercise per muscle on a full-body day" (R2-SES-05) was replaced by his own A/B template in R4-SES-05. On those days the template decides how many exercises each group gets (1 to 4).
3. **Sheet fidelity.** Spot-check claims about his programs against `dumps/` (every tab of both sheets as text, with cell references). Examples: the A/B full-body days against `dumps/BYOP/00_AESTHETICS_FULL_BODY_4_DAYS`, the 3-day builder against `01_3_DAY_BUILDER`, push / pull / legs against `02_PUSHPULLLEGS_3_or_6_DAYS_A_WK`; exercise lists in `synthesis/02_exercise_catalog.json`; ordering statistics in `analysis/equipment/ordering_audit.md`; set and rep numbers in `analysis/programs/*.md`.
4. **Internal consistency.**
   - The same rule should have the same numbers in `BLAZE_CAMP_BRAIN.md`, `generator_spec_v1.json`, `synthesis/*.json`, `docs/` and `model/rules.json` (exercise counts per session, volume tables, final sets, plan shapes, aerobic sessions per sport, bilateral:unilateral shares, plyo:ballistic shares).
   - JSON files must parse.
   - IDs referenced across files must exist.
   - A rule table whose own `status` says `PROPOSED` must not be described as confirmed anywhere.
5. **Sport coverage.** `synthesis/04_profiles.json` should cover every popular US sport (with positions where they matter), swimming in depth, and the general-population "stay athletic and active" options (pickleball, padel, HYROX, rec leagues, running, hiking, active aging, youth). Every profile carries a confidence label (`confirmed_by_coach`, `similar_sport`, `proposed`): check that the label is honest.
6. **Science claims.** Check that cited sources exist and say what is claimed, especially in `synthesis/12_volume_algorithm_v1.md`, `07_science_lineage.md` and `10b_equipment_variables_science.md`.
7. **Safety.** Check these rules: no plan is generated until the terms and the release of liability are accepted, and the release line is printed on every plan in English and Spanish (R4-SCP-01, R4-SCP-02); the health screen with a coach bypass; older-adult defaults (no Olympic lifts, plyos or depth jumps unless opted in with a warning); youth Olympic lifts from the floor only from about age 14 after a hang block. The disclaimers are drafts for an attorney: report problems, do not rewrite them.
8. **Engine (experimental).** `engine/`, `model/`, `tests/` and `samples/`:
   - Run `node --test tests/`, `node tools/check-model.mjs` and `node design/bench/selftest.mjs`. Compare with the numbers in `samples/STATUS_v0.5.md`.
   - Check that every hard rule in `AGENTS.md` section 10 has a test and a validation check.
   - Read the sample plans in `samples/plans/*.md` as a coach would (next section).

## Reading a sample plan with a coach's eye

Study how he programs first: the answer files (newest first), `docs/01-philosophy/`, the profile of the sport in `synthesis/04_profiles.json`, and his real programs in `analysis/programs/*.md` and `dumps/`. Then ask: would he hand this template to a client today?

| Grade | Meaning |
|---|---|
| A | As it is |
| B+ / B | After small tweaks |
| C | Several real coaching problems |
| D | He would not use it |

Check, in this order:

1. Does each day match **his** template slot for slot (A day = pull + knee dominant, B day = push + hip dominant, push / pull / legs, the athletic block first for athletes)?
2. Is the exercise count in his range for this kind of client?
3. Exercise choices and order: core first, power before strength, horizontal before vertical, the pairing, heavy squat and heavy deadlift on different days.
4. Sets per exercise and weekly sets per group: the floor of 10 with 3 or more days, the 2-day rule, the stairway reaching its final sets in sensible steps.
5. Progression written as a rule the person applies. Incline before overhead where it applies.
6. Athletic work for the sport, aerobic work, Focus muscles, block changes that are real one-detail variations.
7. The release line, and the quality of the Spanish if the plan is in Spanish.
8. Anything he would not do.

For every problem give: where, what, which rule, how serious (blocker, major, minor), and a hint for fixing it in the engine. Say clearly that your grade is a reviewer's grade. Only the coach's own grade counts as his.

## Map of the repo

See `README.md` and `AGENTS.md` section 5. Start with `MODEL_CARD.md`, then `BLAZE_CAMP_BRAIN.md`, then `generator_spec_v1.json`, then the `synthesis/` docs it cites. Earlier review reports are in `reviews/`.
