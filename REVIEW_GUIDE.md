# Review guide (for Codex or any reviewing agent)

This repo holds the Blaze Camp training model: how one strength and athletic coach designs programs, made machine-readable so a generator can write plans in his style. Your job is to **find errors, gaps and contradictions** and report them. Please don't rewrite the model.

## Ground rules

1. **Don't push to `main`.** Another agent is syncing work into `main`. Put your findings in `reviews/<your-name>-<date>.md` on a branch (for example `review/codex`), or open GitHub issues. Each finding needs: file, section or JSON key, what's wrong, the evidence, and a suggested fix.
2. **Authority order (highest first).** When two sources disagree, the higher one wins:
   1. `coach_answers_round2.md`: the coach's round-2 answers (newest)
   2. `coach_answers_full.md`: the coach's round-1 answers (138 questions)
   3. `coach_answers.md`: the coach's earlier chat statements
   4. `OBSERVED` facts from his sheets (`raw/*.xlsx`, decoded in `dumps/`)
   5. `INFERRED`, `SCIENCE` and `PROPOSED` content written by the team

   A doc that contradicts a coach answer is a bug. A coach answer that you think is scientifically questionable is **not** a bug; report it separately as "for discussion".
3. **Don't "correct" his vocabulary.** Labels quoted from his sheets keep his spelling inside quotes (e.g. 'SAGITAL', 'TRIPPLE EXTENSION'). Canonical names in the model use correct spelling. Both are intended.
4. **Evidence labels matter.** Every rule should be tagged `OBSERVED` / `COACH-ANSWER <id>` / `COACH-R2 <id>` / `INFERRED` / `SCIENCE` / `PROPOSED`. Flag rules with no label, and labels that are wrong (e.g. a claim marked OBSERVED that isn't in the sheets).

## What to check (in priority order)

1. **Coach answers are applied.** For each answer in `coach_answers_round2.md` and `coach_answers_full.md`, check that `BLAZE_CAMP_BRAIN.md` and `generator_spec_v1.json` reflect it. `coverage_matrix.md` and `coverage_matrix_round2.md` claim they do; verify a sample of at least 30 rows.
2. **Retired ideas are gone.** These were rejected by the coach and must not appear as active rules:
   - the weekly % chosen by muscle size (it is chosen by the person's state)
   - 0.5 helper credit (it is 0.25)
   - bands, chains or weight releasers anywhere
   - sex as an input
   - sleep, stress or lifestyle questions
   - deloads or maintenance inside a block
   - core after the power block as the default (core is first)
   - KB swings counted as glute volume
   - one exercise per muscle on full-body days
   - 1RM or max-mile tests for untrained people
   - "Justice League" as a program name
   - hack squat ranked last
3. **Sheet fidelity.** Spot-check claims about his programs against `dumps/` (every tab of both sheets as text, with cell references). Examples: exercise lists in `synthesis/02_exercise_catalog.json`, ordering statistics in `analysis/equipment/ordering_audit.md`, set and rep numbers in `analysis/programs/*.md`.
4. **Internal consistency.**
   - The same rule should have the same numbers in `BLAZE_CAMP_BRAIN.md`, `generator_spec_v1.json` and `synthesis/*.json` (volume tables, caps, plan shapes, aerobic sessions per sport, bilateral:unilateral shares, plyo:ballistic shares).
   - JSON files must parse.
   - IDs referenced across files must exist.
5. **Sport coverage.** `synthesis/04_profiles.json` should cover every popular US sport (with positions where they matter), swimming in depth, and the general-population "stay athletic and active" options (pickleball, padel, HYROX, rec leagues, running, hiking, active aging, youth).
6. **Science claims.** Check that cited sources exist and say what is claimed, especially in `synthesis/12_volume_algorithm_v1.md`, `07_science_lineage.md` and `10b_equipment_variables_science.md`.
7. **Safety.** Check these rules: the PAR-Q health screen (with a coach bypass), the liability release, older-adult defaults (no Olympic lifts, plyos or depth jumps unless opted in with a warning), and youth Olympic lifts from the floor only from about age 14 after a hang block.
8. **Engine (when present).** `engine/`, `model/`, `tests/` and `samples/`:
   - Run `node --test tests/`.
   - Check that every hard rule above has a test.
   - Read the sample plans in `samples/plans/*.md` as a coach would.

## Map of the repo

See `README.md`. Start with `BLAZE_CAMP_BRAIN.md`, then `generator_spec_v1.json`, then the `synthesis/` docs it cites.
