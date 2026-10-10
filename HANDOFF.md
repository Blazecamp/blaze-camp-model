# Handoff: current state and next steps

Last updated 2026-10-10. For any person or AI agent picking this project up without the original conversation.

## What this project is
Coach Lalo Vera's training model (Blaze Camp), captured from his two Google Sheets and 198 answered questions, plus an engine that turns a person's basic information into a full training plan in his style. It is being prepared as a free, open-source resource (MIT).

Start with `docs/README.md` (the map), `docs/CONTEXT_FOR_AI.md` (one-file briefing) and `AGENTS.md`.

## Authority order
[coach_answers_codex_2026-10-10.md](coach_answers_codex_2026-10-10.md) (`CX-01..04`, only its specific subjects) > `coach_answers_round3.md` > `coach_answers_round2.md` > `coach_answers_full.md` > earlier `coach_chat_statements.md` / `coach_answers.md` > facts observed in his sheets (`raw/`, `dumps/`) > anything inferred or proposed.

## Latest coaching decisions

- Reach the planned final set target, allowing faster increases when needed. No replacement numeric rate maximum was specified.
- A week may keep the same sets while progressing through reps or load. At the set ceiling, sets may stay there while reps or load progress.
- The complete template is editable, explicitly including sets for any day or week. No stored data, tracking, check-ins or adaptive follow-up.
- These are approved coaching directions, not proof that the current engine implements them. They do not approve other unresolved planner defaults or a production switch. See [ADR-049](docs/04-decisions/adr-049-endpoint-priority-and-editable-progression.md).

## State

| Part | State |
|---|---|
| Model (`BLAZE_CAMP_BRAIN.md` v1.2, `generator_spec_v1.json` 1.2.0, `synthesis/`) | Round-3 baseline. Coverage matrices map the 198 questionnaire ids. CX-01..04 now takes precedence, but canonical numeric tables still need reconciliation. |
| Exercise library | Compiled runtime: 731 exercises. Source: `synthesis/02_exercise_catalog.json`. Inventory coverage is not universal suitability. |
| Sports and activities | 52 sports, 26 "stay athletic and active" activities, 127 profiles. Many profile values remain inferred or proposed. |
| Docs (`docs/`) | Authority entry points updated for CX-01..04. Older topic pages can still describe superseded rates or no-flat-set wording. |
| License and disclaimers | MIT in `LICENSE`. `DISCLAIMER.md` and `DISCLAIMER.es.md` are drafts and **need a Florida attorney's review**. |
| Engine v0.4 (`engine/`, `model/`, `tests/`, `samples/`) | Commit `04637ed` independently passed all 1,035 tests and read-only model checks on 2026-10-10. Historical sample reviews still identify dosing issues; no fresh coach-eye regrade of that exact commit was found. The 64.6/100 baseline over 94 cases used an earlier dirty working tree, not that final commit, and is not a coach grade. |
| Progression reference | **Implemented and independently tested**, separate from the default engine. Accelerated endpoints, integer/group-day prefix schedules, flat-set reps/load instructions, bounded block rounding and set-edit arithmetic checks. See [verification](design/PROGRESSION_VERIFICATION.md) and [proof scope](design/PROGRESSION_MATH.md). |
| New planner ("planner/1") | **Not built; integration pending.** `design/rules_as_constraints.json > policy_amendment.implementation_ready` remains false. Actual-credit endpoint selection, covering-envelope construction, exercise-level placement and final plan/edit contracts still need integration and verification. The build workflow is fail-closed and shadow-only by default. |
| Website | Not started, by design. Proposal in `synthesis/13_product_options.md`. |

## Next steps, in order
1. Do not recommit the old engine or recreate the branch: v0.4 is already committed and on `origin/main` as `04637ed`; the local `planner-build` branch exists. Verify current Git state before acting. This clarification/workflow work has not been pushed.
2. Integrate the verified progression reference with the planner's real exercise/credit/time instance. Certify all covered week costs (including reassigned epochs), use actual credited endpoints, handle zero-headroom objectives, settle the unproved peak-allocator claims, and validate the final plan/edit contract. The isolated arithmetic work is finished; the full planner is not. Do not flip the readiness flag just to bypass preflight.
3. Once the design is genuinely ready, run the workflow in shadow mode using the documented host. Failed packages or reviews must block dependent work. Integration writers wait for package owners to finish. Technical gates and two stable clean coach-eye review rounds must pass. No automatic commits, merge, engine switch or deletion of the old engine is authorized by a shadow build.
4. Review the artifacts and resolve remaining coach defaults, including D1, D4 and D13. Promotion requires separate explicit human authorization tied to the reviewed candidate and successful release checks. The current CX answers are not that authorization. Merge into `main` only after review and approval.
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
`CODEX_BRIEF.md` requested an independent evidence review. A local `review/codex` worktree contains `reviews/codex-model-review.md`; it has not been pushed, and it is not on `planner-build`. On this Mac the worktree is `../blaze-camp-model-review`. Do not claim it is publicly available or merge it without reviewing the diff.

## Workflow and validation limits

- Verification of this update (2026-10-10): **1,139/1,139 tests passed**, including 48 isolated progression tests and 56 mocked workflow tests. The final full `node --test --test-reporter=spec tests/` rerun took about 133 seconds, with zero failures or skips. `node tools/check-model.mjs` reported zero errors/warnings; the constraint JSON parses and `git diff --check` passes. See [PROGRESSION_VERIFICATION.md](design/PROGRESSION_VERIFICATION.md). These are not tests of a completed CX-compliant planner.
- No real planner-build run was launched by this clarification. Workflow regression tests use mocked agents and do not prove the future planner's training quality or its host integration.
- The workflow keeps its orchestration state in memory. There is no verified automatic resume after a usage reset; inspect the working tree and artifacts before an explicit restart. Do not treat token counts or usage forecasts as evidence of correctness.
- Default progression and edited templates need separate validation. The new reference preserves explicit set edits, discards stale validation and recomputes every week's credits/time plus declared bounds and progression checks. This is a normalized arithmetic contract, not a complete `plan/2` validator or an exercise-suitability check. Final edit integration remains pending. Do not promise users that an arbitrary edit still satisfies the generated plan's guarantees.
- No website, account system, personal-data storage or adaptive tracking has been added.

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
- the generated prescription progresses, but sets may stay level with reps/load progression, including at the ceiling (CX-02, CX-03)
- no deload inside a block
- older adults get no Olympic lifts or plyos unless they opt in
