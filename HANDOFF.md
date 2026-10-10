# Handoff: current state and next steps

Last updated 2026-10-10. For any person or AI agent picking this project up without the original conversation.

## What this project is
Coach Lalo Vera's training model (Blaze Camp), captured from his two Google Sheets and 198 answered questions, plus an engine that turns a person's basic information into a full training plan in his style. It is being prepared as a free, open-source resource (MIT).

Start with `docs/README.md` (the map), `docs/CONTEXT_FOR_AI.md` (one-file briefing) and `AGENTS.md`.

## Authority order
`coach_answers_round3.md` > `coach_answers_round2.md` > `coach_answers_full.md` > `coach_chat_statements.md` / `coach_answers.md` > facts observed in his sheets (`raw/`, `dumps/`) > anything inferred or proposed.

## State

| Part | State |
|---|---|
| Model (`BLAZE_CAMP_BRAIN.md` v1.2, `generator_spec_v1.json` 1.2.0, `synthesis/`) | Done. All 198 answers applied. Coverage matrices check each answer. |
| Exercise library | Done: about 730 active exercises with full tags. `synthesis/02_exercise_catalog.json`. |
| Sports and activities | Done: 52 sports, 26 "stay athletic and active" activities. `synthesis/04_profiles.json`. |
| Docs (`docs/`) | Done: 102 files, fact-checked. |
| License and disclaimers | MIT in `LICENSE`. `DISCLAIMER.md` and `DISCLAIMER.es.md` are drafts and **need a Florida attorney's review**. |
| Engine v0.4 (`engine/`, `model/`, `tests/`, `samples/`) | Works and passes its tests, but coach-eye reviewers graded the sample plans C to D. Structure is right; dosing is not. Benchmark baseline: mean 64.6 / 100 over 94 plans (`design/bench/BASELINE.md`). |
| New planner ("planner/1") | **Designed, not yet built.** Spec: `design/PLANNER_SPEC.md`. Build plan: `design/IMPLEMENTATION_PLAN.md` (22 work packages). Build workflow: `workflows/planner_build.js`. |
| Website | Not started, by design. Proposal in `synthesis/13_product_options.md`. |

## Next steps, in order
1. Commit the engine v0.4 working-tree state to `main` (it may be uncommitted locally if a run was interrupted).
2. Create branch `planner-build` and run `workflows/planner_build.js` with `{ "base": "<repo path>" }`. It builds the planner, scores it on the benchmark in shadow mode, runs the gate (`design/PLANNER_SPEC.md` section 13.3), switches the default engine, regenerates the 8 sample plans, and loops coach-eye reviews until every plan is B+ or better.
3. Read `samples/STATUS_planner.md` and `round4_questions.json` when the build finishes. Round 4 is the short list of coaching trade-offs (decisions D1 to D15 in the spec, each with a default).
4. Merge `planner-build` into `main` once the gate passes and the coach has graded the plans.
5. Clean-ups flagged by fact-checkers:
   - `generator_spec_v1.json` still has an older-adult 3% step cap marked both PROPOSED and retired.
   - A "learning from users' data" note is stale. No data is kept.
   - `model/rules.json` still has a retired cut-order table.
   - The catalog's 60+ flag still excludes landing drills that round 3 switched on by default.
   - The master doc lists the Z-press as intermediate. The catalog says advanced.
6. Open question for the coach: must the "use at your own risk" box be ticked before a plan is shown? He said "it doesn't matter if they click it; it comes out". The engine currently requires it.
7. Before calling the public release final:
   - attorney review of the disclaimers
   - coach review of the Spanish
   - the coach grades the sample plans
   - map exercise ids to open databases (free-exercise-db, wger) for images and instructions

## Outside review
`CODEX_BRIEF.md` asks an outside agent (Codex) to research evidence for the model's science and to find missing exercises and rules. Its findings go on a `review/codex` branch under `reviews/`. Nothing had been posted as of this note.

## Rules that must never be broken
See `AGENTS.md` section "hard rules" and `docs/01-philosophy/what-he-rejected.md`. In short:
- no bands or variable resistance
- no check-ins, tracking or stored data
- no sex or lifestyle inputs
- core first
- power before strength
- horizontal before vertical
- hip-dominant work pairs with a push; knee-dominant work pairs with a pull
- heavy spinal loading once a week per pattern
- floor of 10 weekly sets on every trained group
- the stairway never goes flat
- no deload inside a block
- older adults get no Olympic lifts or plyos unless they opt in
