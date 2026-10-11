# Handoff: current state and next steps

Last updated 2026-10-11. For any person or AI agent picking this project up without the original conversation.

## What this project is

The training model of Coach Lalo (Gerardo Vera), Master NASM coach, captured from his two Google Sheets and his own answers to 218 questions, plus an experimental engine that turns a person's basic information into a complete, editable training template in his style. The model is his intellectual property. It is shared as a free, open-source resource under the MIT license.

Start with [README.md](README.md), [MODEL_CARD.md](MODEL_CARD.md), `docs/README.md` (the map), `docs/CONTEXT_FOR_AI.md` (one-file briefing) and [AGENTS.md](AGENTS.md).

## Authority order

1. [coach_answers_round4.md](coach_answers_round4.md) (`R4-*`, 20 answers) and [coach_answers_time_2026-10-10.md](coach_answers_time_2026-10-10.md) (`CT-01`)
2. [coach_answers_codex_2026-10-10.md](coach_answers_codex_2026-10-10.md) (`CX-01..04`)
3. `coach_answers_round3.md`
4. `coach_answers_round2.md`
5. `coach_answers_full.md` (round 1)
6. `coach_chat_statements.md` and `coach_answers.md` (things he said in conversation)
7. Facts observed in his sheets (`raw/`, `dumps/`; his real programs are decoded in `analysis/programs/*.md`)
8. Anything inferred or proposed by the team

CT-01 and CX-01..04 win only on their own subjects (session time; progression and editing).

## The big change since the last handoff

**The coach removed time-fitting (CT-01, R4-SES-01).** Session minutes are no longer an input or a limit. A plan is sized by exercise count, built from his own templates, comes out complete, and the person edits it. That removed most of the difficulty the large planner was designed to solve, so the next step changed: engine 0.5 was built on the plan in [design/ENGINE_V05_PLAN.md](design/ENGINE_V05_PLAN.md), and the large planner is parked (see "Parked" below).

The other round-4 decisions, in short:

- **Session size by exercise count** (R4-SES-02): general 5-7, aesthetics 6-8, strength 5-6, bootcamp 5-7 stations, field athletes up to 12, older adults 5-6.
- **His templates are the skeleton** (R4-SES-05): A day = pull + knee dominant, B day = push + hip dominant, push / pull / legs, and the others in his sheets.
- **2 days a week** (R4-SES-03): every big group is trained at about 6-8 weekly sets, and the plan suggests a third day.
- **Nothing is dropped automatically** (R4-SES-04). The person chooses what to remove.
- **Progression** (CX-01..03, R4-PRG-01..04): reach the planned final sets, in the last week or one week early. Faster steps are allowed, with a note above about 15%. Reps and load are a rule the person applies. The next block starts about 5% higher.
- **Everything is editable** (CX-04).
- **Library** (R4-LIB-01..05): proposed exercises are optional add-ons, carries and sleds go by distance or time, a mid-range pull category, incline before overhead pressing, swaps say what they keep and lose, YouTube search links replace third-party video links.
- **Safety and scope** (R4-SCP-01..03): everyone may use the plans, the terms and release must be accepted before a plan is built, a release line is printed on every plan, and each sport profile carries a confidence label.
- **Release** (R4-REL-01..03): release the model as the finished product, keep the engine labelled experimental, and credit Coach Lalo as the author and owner.

The decision records for these are ADR-050 to ADR-058 in [docs/04-decisions/](docs/04-decisions/index.md).

## State

| Part | State |
|---|---|
| Model v1.3 (`BLAZE_CAMP_BRAIN.md`, `generator_spec_v1.json`, `synthesis/`, `docs/`, compiled `model/` 1.3.0) | **Complete.** Rounds 1 to 4, CT-01 and CX-01..04 are applied. `coverage_matrix*.md` trace each answer. Complete does not mean every number is his: see "Confirmed and proposed" in `MODEL_CARD.md`. |
| Exercise library | 733 runtime exercises compiled from 939 source records (`synthesis/02_exercise_catalog.json`). 32 are optional add-ons. 2 neck records stay proposed and are never shown. |
| Sports and activities | 127 profiles, 52 sports, 26 "stay athletic and active" activities. Confidence labels: 23 confirmed by the coach, 67 based on a similar sport, 37 proposed. |
| Engine 0.5.0 (`engine/`, `tests/`, `samples/`, `tools/`) | **Experimental.** Template-first, no time-fitting. All tests pass. The coach has not graded its plans. Results below. |
| Docs | Front door: `README.md`, `MODEL_CARD.md`, this file, `AGENTS.md`, `REVIEW_GUIDE.md`, `CODEX_BRIEF.md`. Guides in `docs/`. |
| License and disclaimers | MIT in `LICENSE`. `DISCLAIMER.md` and `DISCLAIMER.es.md` are drafts and **need a Florida attorney's review**. |
| Spanish | The team reviewed the plan-facing lines for neutral Latin American wording. The coach has not approved any Spanish yet. 842 machine-translated lines (mostly exercise names and cues) are marked for his review (`model/i18n/es_review.json`). |
| Large planner ("planner/1") | **Parked as research. Not being built.** |
| Website or form | Not started, by decision. The model, the logic and its testing come first. |

## Engine 0.5 in numbers

From [samples/STATUS_v0.5.md](samples/STATUS_v0.5.md) and [design/bench/V05.md](design/bench/V05.md), run of 2026-10-11. The test count was re-run for this handoff and matched.

| Check | Result |
|---|---|
| `node --test tests/` | 1,407 tests: 1,401 pass, 0 fail, 4 to-do, 2 skipped |
| `node tools/check-model.mjs` | 0 errors, 0 warnings |
| 8 sample plans | 8 of 8 `ok`, 0 failing error checks |
| Sweep, 1,578 intakes (1,500 random, one per sport, one per activity) on the reference model and on the compiled model | 0 failing error checks, 0 render problems, 0 crashes |
| Benchmark, 102 plans, scorer 2.3 | Mean 97.67, lowest 89.35. 3 hard-rule violations in 2 plans. 53 plans pass every row |
| Benchmark, engine 0.4 baseline (older scorer) | Mean 64.4, lowest 27.6. 2,228 hard-rule violations. 1 plan passed every row |
| AI coach-eye grades, third review | 01 Swimming B, 02 Football B, 03 Soccer B, 04 CrossFit-style class B-, 05 Bootcamp B-, 06 Full-body aesthetics B, 07 Push / pull / legs B+, 08 Pickleball B+ |

Read the numbers with care:

- The third-review grades come from the build workflow's last review pass, which ran after fix round 2. `samples/STATUS_v0.5.md` lists the first two reviews. The plans in `samples/plans/` are the ones the third review read.
- The plan's goal is B+ or better on every sample. **2 of 8 are there.**
- The benchmark scorer was corrected during v0.5 (2.0 to 2.3), and part of the rise in score comes from those corrections. Each one is listed in `samples/STATUS_v0.5.md`.
- Passing tests and checks does not show that a plan is right for every person.

## Git state

- Branch `planner-build`. The last commit is `50fd654` ("Add engine v0.5 plan (template-first, no time-fitting) and its workflow").
- **Engine 0.5, the regenerated model and samples, and the v1.3 documents are in the working tree and were not committed by the agents that wrote them.** The lead commits. Check `git status` before acting.
- `main` is at `04637ed` (engine 0.4). `review/codex` and `review/claude-codex` are merged into `planner-build`.
- [RELEASE_CHECK_v1.3.md](RELEASE_CHECK_v1.3.md) is the final consistency check of this release (run on 2026-10-11): what was searched and fixed, the leftovers in code and data, the test and benchmark numbers, the sample grades and the items for the coach and the attorney. It rebuilt the reference fixture and recompiled `model/` after the last documentation edit to the spec. Only the spec's version and hash changed in `model/manifest.json`, `model/CHANGELOG.md` and `model/COMPILE_REPORT.json` (and the same version string in the fixture); every runtime file is byte for byte the same. **Any later change to a compile source (the spec, `coach_answers_round2.md` or the `synthesis/*.json` files) needs `node tools/compile-model.mjs` again, or one test fails.**

## Next steps, in order

1. **Lead: consolidate.** Review the working tree, run the pipeline from clean (`node tools/fixture/build-fixture.mjs`, `node tools/compile-model.mjs`, `node tools/check-model.mjs`, `node --test tests/`, `node tools/generate-samples.mjs`), commit, and merge into `main` when satisfied. The coach approved this in R4-REL-01: "go ahead and finish it all, and then after you're done, consolidate everything."
2. **Coach: his certifications.** `README.md` and `MODEL_CARD.md` carry a marked placeholder. Nothing was looked up or invented.
3. **Coach: grade the 8 sample plans** (R2-GEN-07). His corrections become rules and tests.
4. **Coach: the 14 open questions** at the end of `samples/STATUS_v0.5.md`. Examples: the chest credit of a high-incline press, single-leg work on athletic A/B days, the scale for 2- and 3-day athletic weeks, whether every plan holds pulling at or above pressing.
5. **Engine, toward B+ on every sample:**
   - The athletic layer: jumps, throws, cuts, sprint metres and Olympic sets are under the sport's weekly target in 45 of the 63 athletic benchmark plans. 4 to-do tests are open there.
   - Say every shortfall in the plan (35 cases in 30 benchmark plans).
   - The 3 remaining hard-rule violations (one CrossFit plan's jumps, one MYO placement).
   - Samples 04 and 05 (class and bootcamp) are still graded B- after both fix rounds.
   - The printed-copy items listed under "Not fixed in this round" in `samples/STATUS_v0.5.md`.
   - New fix-round rules are held by tests and the scorer, not yet by a validator check.
   - A leftover in the rule data: `model/rules.json > locked` still lists LK08 ("total weekly sets rise by less than 10%"), and every plan carries its key in `meta.locked_rule_keys`. CX-01 retired that cap and nothing enforces it. Remove it in the rule builders (`tools/fixture/rules.mjs`, `tools/compile/rules.mjs`) and the word tables.
   - The other leftovers in code and data (two unused word-list lines that still speak of minutes, three unread minute keys in the rule data, the retired intake fields in the sample and benchmark intakes, comments about the time check) are listed in `RELEASE_CHECK_v1.3.md` section 4. None of them changes a plan.
6. **Before the public release is called final:**
   - attorney review of both disclaimers and of the release wording
   - the coach's review of the Spanish
   - third-party video links: they are gone from `model/` and the library source, but remain in the sheet exports (`raw/`, `dumps/`), in `analysis/`, in `synthesis/02_exercise_catalog_crosswalk.json` (185 links) and in the old model snapshots under `design/scratch/snap/` and `design/scratch/snap_instr/` (136 links in each of 4 files). Decide whether those files stay public as they are (R4-LIB-05)
   - a check of the sheet exports for client names
   - advice on the Blaze Camp name (the team's reading is that the MIT license covers copyright and not the name)
   - optional: map exercise ids to open databases (free-exercise-db, wger) for images and instructions
7. **Then, and only then, the tool people will see** (the website or form). It is not started. Proposal: `synthesis/13_product_options.md`.

## Parked: the large planner

The two-stage optimizer planner in `design/PLANNER_SPEC.md` and `design/IMPLEMENTATION_PLAN.md` is **research, not a build target.** Most of its difficulty came from fitting plans into session minutes, and CT-01 removed that requirement. Do not implement it, and do not run `workflows/planner_build.js`.

| Kept | Where |
|---|---|
| The diagnosis of engine 0.4 and the algorithm research | `design/diagnosis.md`, `design/algorithm_research.md`, `design/design_*.md`, `design/judge_*.md` |
| Every rule written as a constraint (a snapshot from before round 4) | `design/rules_as_constraints.md`, `.json`. Its flag `policy_amendment.implementation_ready` stays `false` |
| The progression arithmetic | Moved into `engine/progression/` with the fixes from `reviews/claude-codex-audit.md`. The engine uses it. Proof notes: `design/PROGRESSION_MATH.md`, `design/PROGRESSION_VERIFICATION.md` |
| The benchmark | `design/bench/` (94 intakes, the scorer, the 0.4 baseline and the 0.5 results). In use |
| The decision records | [ADR-048](docs/04-decisions/adr-048-optimizer-rebuild-of-the-planner.md) (the optimizer rebuild, replaced as the next step by [ADR-058](docs/04-decisions/adr-058-engine-v05-template-first-not-the-large-planner.md)) and [ADR-049](docs/04-decisions/adr-049-endpoint-priority-and-editable-progression.md) (endpoint priority and editing, still in force) |

If the coach later wants plans fitted to something the templates cannot express, this research is the place to start again.

## Outside review

- `reviews/codex-model-review.md`: an outside evidence review of the model foundation (as of commit `c13cbaa`, before round 4). Treat it as research context, not policy. Its Appendix F1 record fixes were applied in engine 0.5 work package V2.
- `reviews/claude-codex-audit.md`: an independent audit of the progression arithmetic. Its fixes (HIGH-2, MEDIUM-1 to MEDIUM-5) were applied when the kernel moved into `engine/progression/`.
- A coach answer a reviewer disagrees with is not an error. It goes on a list "for discussion with the coach".

## Validation limits

- The sample grades are from AI reviewers, not from the coach.
- The benchmark scorer is a team tool. A score is not a coach grade.
- Edited plans: `engine/edit.mjs` recomputes totals, marks the plan `edited` and discards the old validation. It does not promise that an arbitrary edit still follows every rule.
- No website, account system, personal-data storage or adaptive tracking exists. Accounts, stored personal data and adaptive tracking must never be added. The website comes last (next steps, item 7).

## Rules that must never be broken

See `AGENTS.md` section 10 and `docs/01-philosophy/what-he-rejected.md`. In short:

- core first; power before strength; horizontal before vertical
- knee-dominant work pairs with a pull; hip-dominant work pairs with a push
- heavy squat and heavy deadlift on different days, once per pattern per week
- floor of 10 weekly sets on every trained group when there are 3 or more training days; on 2 days, every big group at about 6-8
- helpers count a quarter set; athletic work never counts as muscle sets
- no bands or variable resistance
- no check-ins, tracking or stored data
- no sex or lifestyle inputs
- no session-minutes input and no time-fitting
- no deload inside a block
- older adults get no Olympic lifts or plyos unless they opt in
- tests only at the start and end of a block
- exercises stay the same inside a block
- the terms and release are accepted before any plan is built
- English and Spanish
