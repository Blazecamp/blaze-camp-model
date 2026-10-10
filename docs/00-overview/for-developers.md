# For developers: where the data is and how to use it in an app

This page tells a developer where the model lives as data, which files are stable and which are still moving, and how to build on it. The coach's rules exist in three forms: his own answers, a plain-language master document, and machine-readable files. The two files to open first are [AGENTS.md](../../AGENTS.md), the working guide for developers and AI agents, and [generator_spec_v1.json](../../generator_spec_v1.json), the model as a machine spec. There is also a JavaScript plan engine. The part of it that decides the sets is being rebuilt, so build on the data and the documented rules, and treat the engine's code and output as a draft.

> **Use at your own risk.** This is general fitness information, not medical advice. If you ship an app built on it, the health screening, liability release, insurance and privacy terms are yours. Read [safety-and-liability.md](safety-and-liability.md) and [DISCLAIMER.md](../../DISCLAIMER.md) §5 and §7.

## The rule

1. **The coach's answers are the authority.** Data and code follow them. The newest round wins.
2. **The spec and the `synthesis/*.json` files are the model as data.** They are twins of the human documents.
3. **The engine reads only the compiled model in `model/`.** That folder is generated, never edited by hand.
4. **The product is simple by decision.** Few inputs, the whole plan once, no check-ins, no data kept.
5. **The engine is being rebuilt.** Its interface and output can change.

## Why

He first raised giving the model away in round 1, as an idea he was still weighing. He confirmed it later (R2-GEN-02, R3-GEN-01):

> "Or I should just create the website and also create the repo, and just give away the repo, open source it to any coach and person that wants to create a training app and just use this model to put it all together." (GEN-03)

He wants the tool to do the math: "I need this tool that we're building eventually to figure out the percentages." (VOL-06). He asked for "the best mathematical, logical algorithms possible to make sure this is top of the line" (conversation).

He wants it small and private: "We're not going to need a lot of inputs for this." (R3-VOL-04) and "I don't want any data kept" (R3-GEN-01).

He also asked that people can add exercises, with the repository explaining how, and that AI agents can read it and take what they need (conversation).

## Start with these two files

| File | What it gives you |
|---|---|
| [AGENTS.md](../../AGENTS.md) | The authority order, a map of the repository, a table of where each kind of rule lives (file and JSON key), how to generate a plan from the command line and from JavaScript, the 22 hard rules, how to change a rule or an exercise safely, the tests, and what never to edit. |
| [generator_spec_v1.json](../../generator_spec_v1.json) | The model as one JSON file, version 1.2.0: the intake form, the values worked out from it, every rule table, the plan types, the tests, plan editing, legal and privacy rules, and the checks a plan must pass. |

For an AI agent, [CONTEXT_FOR_AI.md](../CONTEXT_FOR_AI.md) is a single briefing of the whole model, and [llms.txt](../../llms.txt) is a link index.

## What is stable and what is moving

| Layer | Files | State | Build on it? |
|---|---|---|---|
| The coach's words | `coach_answers_round3.md`, `coach_answers_round2.md`, `coach_answers_full.md`, `coach_answers.md`, `coach_chat_statements.md`, `answers_raw*/` | Final. Never edited. | Yes. This is the source. |
| His sheets | `raw/*.xlsx`, `dumps/` | Fixed copies | Yes, as evidence |
| Master document | [BLAZE_CAMP_BRAIN.md](../../BLAZE_CAMP_BRAIN.md) v1.2 | Stable. Changes only when he answers something new. | Yes |
| Machine spec | `generator_spec_v1.json` 1.2.0 | Stable, same rule | Yes |
| Topic data | `synthesis/*.json` | Stable, same rule | Yes |
| Compiled model | `model/` | Generated. Changing while the engine is rebuilt. | With care. Read the version from `model/MODEL_VERSION`. |
| Plan engine | `engine/` | The dosing part is being rebuilt | Not yet for production |
| Tests, samples, tools, design notes | `tests/`, `samples/`, `tools/`, `design/` | Changing | Read, do not depend on |

Version numbers printed in other documents can be out of date. Read the live values from `model/MODEL_VERSION`, `engine/version.mjs` and `generator_spec_v1.json > _meta.version`.

## How a rule gets from the coach to a plan

```
 his answers + his sheets
          |
          v
 BLAZE_CAMP_BRAIN.md and synthesis/*.md        the rules in words, each with an evidence label
          |
          v
 generator_spec_v1.json and synthesis/*.json   the same rules as data
          |   tools/compile-model.mjs
          v
 model/*.json                                  the compiled copy the engine reads
          |   generate(intake, model)
          v
 the plan as JSON                              codes and reasons, no prose
          |   renderPlan(plan, model, {lang})
          v
 the plan in English or Spanish
```

A longer version, with the compiler's details, is in [AGENTS.md](../../AGENTS.md) §7.

## Where the data is

| You need | File | Key | Size |
|---|---|---|---|
| Exercises with all their tags | `synthesis/02_exercise_catalog.json` | a list of records; see [data dictionary](../05-reference/data-dictionary.md) | 939 records, 732 active |
| Categories and tag values | `synthesis/01_taxonomy.json` | `nodes`, `facets`, `muscles` | 91 nodes, 47 facets |
| Sports, positions, activities | `synthesis/04_profiles.json` | `profiles`, `sports.list`, `activities.list`, `age_overlays` | 127 profiles, 52 sports, 26 activities |
| Week and day templates | `synthesis/05_templates.json` | `generator_split_templates.<family>.<days>` | 6 families × 2 to 6 days |
| Weekly sets: starts, ceilings, floor | `generator_spec_v1.json` | `rule_tables.weekly_sets`, `.priority`, `.pain`, `.goal_phase_modifiers` | |
| How sets are counted | `generator_spec_v1.json` | `rule_tables.counting.credit_map`, `vocab.muscles.focus_groups` | |
| The stairway | `generator_spec_v1.json` | `rule_tables.rate_engine`, `.banking`, `.set_placement` | |
| The volume method in full, with worked examples | `synthesis/12_volume_algorithm_v1.json` | `starting_table`, `stairway`, `time_model`, `examples` | |
| Session rules | `generator_spec_v1.json` | `rule_tables.session_limits`, `.time_model`, `.ordering`, `.pairing`, `.axial_loading`, `.core_block`, `.supersets_contrast_circuits` | |
| Two legs or one | `generator_spec_v1.json` | `rule_tables.bilateral_unilateral`, `.contra_ipsi` | |
| Reps, effort, rest | `generator_spec_v1.json`; `synthesis/11_training_variables.json` | `rule_tables.reps`, `.effort`, `.rest` | |
| Equipment | `generator_spec_v1.json`; `synthesis/10_equipment_model.json` | `rule_tables.equipment`; `constraint_scale`, `kit_tokens`, `access_profiles`, `substitution_by_category` | 10 equipment profiles |
| Jumps, throws, Olympic lifts, cardio | `generator_spec_v1.json` | `rule_tables.athletic`, `.conditioning` | |
| Plan types | `generator_spec_v1.json`; `synthesis/06_periodization.json` | `plan_types`; `plan_length_model` | |
| Tests | `generator_spec_v1.json` | `tests` | |
| The intake form | `generator_spec_v1.json` | `inputs_schema.fields`, `.start_flow`, `.removed_fields` | 39 fields, F00 to F46 |
| Values worked out from the answers | `generator_spec_v1.json` | `derived_values` | D1 to D15 |
| The build steps in words | `generator_spec_v1.json` | `pipeline` | 9 steps |
| Checks before a plan is shown | `generator_spec_v1.json` | `validation_checks` | V1 to V31 |
| What a person can edit | `generator_spec_v1.json` | `plan_editing` | |
| Privacy, health check, release, license | `generator_spec_v1.json` | `legal_and_privacy` | |
| Words in English and Spanish | `model/i18n/en.json`, `model/i18n/es.json` | flat key to text | Spanish lines not yet approved are listed in `model/i18n/es_review.json` |
| Which answer backs which rule | `coverage_matrix.md`, `coverage_matrix_round2.md`, `coverage_matrix_round3.md` | | |

The same table by topic, with the engine module that reads each key, is in [AGENTS.md](../../AGENTS.md) §6. Every tunable number in one place: [parameters](../05-reference/parameters.md).

## Reading the status of a value

Do not treat every number in the data as the coach's.

| In the data | Meaning |
|---|---|
| A `tag` with `COACH-ANSWER <id>`, `COACH-R2 <id>` or `COACH-R3 <id>` | He decided it. The id points to his answer. |
| `APPROVED (COACH-R2 ...)` or `APPROVED (COACH-R3 ...)` | The team proposed it and he marked it RIGHT |
| `OBSERVED` | Read from his sheets |
| `INFERRED`, `SCIENCE` | The team's reasoning, or published research |
| `PROPOSED - PENDING COACH APPROVAL` | Not his rule yet. The spec carries this string in about 180 places. Search for it. |
| `LEGAL REVIEW` | Placeholder wording that a lawyer must write |
| `RETIRED (...)` | Removed by a later answer. Kept so nobody rebuilds it. |

Retired things you will still find in the files: `adaptation` and `rule_tables.learning` in the spec (check-ins and learning from user data), the `week_by_week` plan mode, and rear delts and side delts as lines of their own. Do not build on them. The full list is in [AGENTS.md](../../AGENTS.md) §13 and [what he rejected](../01-philosophy/what-he-rejected.md).

## Two ways to use it in an app

### Route A: use the data and write your own planner

This works in any language and does not depend on the engine.

1. Build the intake from `inputs_schema.fields`. Keep it short. Never add a sex field or lifestyle questions.
2. Work out the derived values (`derived_values`): family, profile, level, plan shape, week layout.
3. Pick the week template for the family and the number of days (`synthesis/05_templates.json`).
4. Run the time check before anything else is dosed (`derived_values.D15_time_fit`).
5. Set weekly sets per group from `rule_tables.weekly_sets`, with the floor, Focus muscles and pain.
6. Fill each slot from the exercise catalog, filtered by equipment, level, age rules and pain. Offer swaps from the same category.
7. Compute the whole stairway at build time (`rule_tables.rate_engine`). Add whole sets in the order of `rule_tables.set_placement`.
8. Check the result against `validation_checks` and the hard rules in [AGENTS.md](../../AGENTS.md) §10.
9. Show the whole plan. Let people edit it (`plan_editing`). Store nothing.

One worked case with every number is in [how-a-plan-is-made.md](how-a-plan-is-made.md). The steps as pseudo-code are in [BLAZE_CAMP_BRAIN.md](../../BLAZE_CAMP_BRAIN.md) §13.3.

### Route B: run the JavaScript engine

| Fact | Detail |
|---|---|
| Language | Plain JavaScript ES modules. Node 22 or a browser. No npm packages, no build step. |
| Behaviour | Deterministic: the same answers and model give the same plan. No file or network access inside `engine/`. |
| Entry points | `loadModel(raw)` in `engine/model.mjs`, `generate(intake, model)` in `engine/generate.mjs`, `renderPlan(plan, model, options)` in `engine/render.mjs`, `validatePlan` in `engine/validate.mjs` |
| Shapes | The intake and plan schemas are defined in `engine/CONTRACTS.md` |
| How to run it | Commands and a complete JavaScript example are in [AGENTS.md](../../AGENTS.md) §2 and §8 |
| Sample people | `samples/intakes/*.json` (8 intakes) |

On 2026-10-09 the JavaScript example in AGENTS.md §8.2 ran on engine 0.4.0 with model 1.3.0 and returned a 12-week plan that passed its own checks. That says the code runs. It does not say the dosing is right.

**Why the engine is being rebuilt.** The first engine decided the sets in separate steps. Reviewers who read the sample plans the way the coach would found the structure right and the dosing wrong: groups left under the floor of 10, stairways that stayed flat, and days longer than the time chosen. The team is rebuilding the planner so that it decides the whole plan together and checks exactly whether the coach's rules fit the time. The coach's rules do not change. This is a team decision, and the design is not final. See [ADR-048](../04-decisions/adr-048-optimizer-rebuild-of-the-planner.md), `design/diagnosis.md` and the [roadmap](../06-history/roadmap.md).

Until that is done:

- Treat `samples/plans/` as drafts. The coach has not graded them.
- Expect the plan JSON to gain and lose keys. Read `engine/CONTRACTS.md` before you depend on one.
- Where the engine and a coach answer disagree, the coach answer is right and the code is out of date.

## Rules your app must keep to be the coach's model

The MIT license lets you build anything. These are the rules that make a tool his.

| Rule | Source | In the data |
|---|---|---|
| Few inputs. The whole plan comes out once, with every week visible. | R3-VOL-04 | `plan_types`, `rule_tables.rate_engine.no_feedback` |
| No check-ins, no tracking, no input after the build | R3-VOL-02, R3-VOL-04 | `adaptation.status`, `validation_checks.V26_inputs` |
| No user data kept: no accounts, no stored answers, no analytics with personal fields | R3-GEN-01 | `legal_and_privacy.no_data_kept`, `validation_checks.V27_no_data_kept` |
| No sex or gender field | GEN-02, ATH-09 | `inputs_schema.removed_fields` |
| No sleep, stress, job or life questions | R2-GEN-04 | `inputs_schema.removed_fields` |
| A health check, and a "use at your own risk" box at every build | R2-GEN-03, R3-GEN-01 | `legal_and_privacy.health_check`, `.release_every_build` |
| People can edit the plan: switch off blocks, add or remove exercises, take the suggested supersets | R3-SES-02 | `plan_editing` (mechanism PROPOSED) |
| No bands, chains or weight releasers | EQ-01, EQ-12 | `rule_tables.equipment.no_variable_resistance` |
| English first, with a full Spanish switch | GEN-01, R2-GEN-08 | `model/i18n/` |
| The 22 hard rules | see [AGENTS.md](../../AGENTS.md) §10 | `model/rules.json > locked`, `validation` |

If your product breaks one of these on purpose, say that it is your own version and not his model.

## Changing or adding data

| You want to | Read |
|---|---|
| Add an exercise or a variation | [adding-exercises.md](../adding-exercises.md) (Spanish: [adding-exercises.es.md](../adding-exercises.es.md)) |
| Change a rule or a number | [AGENTS.md](../../AGENTS.md) §11, [CONTRIBUTING.md](../../CONTRIBUTING.md) §5 |
| Understand why a rule exists before you touch it | [decision records](../04-decisions/index.md) |
| Report a problem | [REVIEW_GUIDE.md](../../REVIEW_GUIDE.md) |

Three things to remember:

- Never edit his answers, his sheets or their exports, the generated folders, or the legal files.
- A new coaching rule needs a coach answer. Until he gives one, it is PROPOSED.
- Never upgrade a label. INFERRED does not become OBSERVED because it looks right.

## License and your duties

| Topic | What applies |
|---|---|
| License | MIT. Keep the copyright and permission notice in every copy. See [LICENSE](../../LICENSE). |
| Name | The license covers copyright. It gives no right to the Blaze Camp name. This is the team's reading of the license, and a lawyer confirms it ([ADR-009](../04-decisions/adr-009-mit-license-and-disclaimers.md)). |
| Liability | You release Blaze Camp when you use this. Your users are your responsibility. See [DISCLAIMER.md](../../DISCLAIMER.md) §4 and §5. |
| Privacy | The Blaze Camp tool keeps nothing. If your app keeps data, the privacy terms and the handling are yours. See DISCLAIMER.md §7. |
| Legal text | The disclaimer, the health check and the release are drafts waiting for a Florida attorney. Do not ship them as final. |
| Videos | The video links in his sheets belong to other people. See DISCLAIMER.md §8. |

## Related pages

[what-this-is.md](what-this-is.md) · [how-a-plan-is-made.md](how-a-plan-is-made.md) · [for-coaches.md](for-coaches.md) · [safety-and-liability.md](safety-and-liability.md) · [data dictionary](../05-reference/data-dictionary.md) · [parameters](../05-reference/parameters.md) · [method](../06-history/method.md) · [docs map](../README.md)
