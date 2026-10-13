# Blaze Camp model: start here (the map)

This folder explains the training model of Coach Lalo (Gerardo Vera, Blaze Camp) in plain language, and this page is its map. It shows what every folder and file is for, gives a reading path for a coach, a developer, an AI agent and a reviewer, sums up the model on one screen, and ends with a table that takes you from a question to the page that answers it. The model itself lives in the repo root, as a master document and as data files. The pages here explain it, record everything the coach answered, and say why each rule is the way it is. Anything he has not confirmed is marked **PROPOSED**, which means the team suggested it and it waits for his approval. This folder is at model v1.3: it includes his round-4 answers and the two clarifications of 2026-10-10. A plan engine (version 0.5) builds plans from the model. He graded its sample plans in round 5: A for three, B+ for five (R5-GRD-01 ... 08).

> **Not medical advice. Use at your own risk.** This is general fitness information. If you use it with clients or anyone else, you need your own health screening, liability release and insurance. Read [safety and liability](00-overview/safety-and-liability.md) and [DISCLAIMER.md](../DISCLAIMER.md).

*Español: [qué es esto](00-overview/what-this-is.es.md) · [glosario](05-reference/glossary.es.md) · [cómo agregar un ejercicio](adding-exercises.es.md) · [descargo de responsabilidad](../DISCLAIMER.es.md).*

## The rule

Five things hold on every page of this folder.

| # | Rule | Decided by |
|---|---|---|
| 1 | **The product is simple.** A few answers go in. The whole plan comes out once. People adjust it themselves. No check-ins, no tracking, no data kept, no session-length question and no fitting of plans to time. | Coach: R3-VOL-02, R3-VOL-04, R3-GEN-01, CT-01, R4-SES-01 |
| 2 | **His newest answer wins.** Round 4 and the time clarification (CT-01) come first. Then the progression clarification (CX-01..04), on its subjects. Then round 3, round 2, round 1. Any questionnaire answer beats a thing he said in conversation. Anything he said beats what was read from his sheets. Team work comes last. | Team method: [ADR-047](04-decisions/adr-047-authority-order-and-evidence-labels.md) |
| 3 | **Every statement says where it came from.** An answer id (`VOL-09`, `R2-SES-05`, `R3-VOL-04`, `R4-SES-05`, `CT-01`, `CX-01`) means he decided it. OBSERVED means it was read from his sheets. INFERRED, SCIENCE and PROPOSED are the team's work, not his rule. | [method](06-history/method.md) |
| 4 | **Each page leads with the rule, then his reason, then the data.** The reason is in his own words, with the answer id. The data is a file and a JSON key. | Writing rule of this folder |
| 5 | **A plan is a template.** The tool does the math. A person or a coach fits it to the day, and can edit all of it. | Coach: R3-VOL-04, R3-SES-02, CX-04 |

## Why

These are his words. "Conversation" means things he said while the model was built ([coach_chat_statements.md](../coach_chat_statements.md)).

> "The hardest thing to understand is the categorization of everything" (conversation)

> "I want this to be very simple. This works. We're not going to need a lot of inputs for this." (R3-VOL-04)

> "It's already a template, and you need to adjust it as you need to." (R3-VOL-04)

> "You need to stop trying to be responsible for the people's time." (CT-01)

He wants the repo to be "the most comprehensive training model that there is out there", free "for anybody to use in their own app and their own training" (conversation). He also asked that people can add exercises, with the repo explaining how, and that AI agents can read it and take what they need (conversation, paraphrased). This folder is the explaining part.

## Where it lives in the data

| Layer | File | What it is |
|---|---|---|
| His words | [coach_answers_round4.md](../coach_answers_round4.md), [coach_answers_time_2026-10-10.md](../coach_answers_time_2026-10-10.md), [coach_answers_codex_2026-10-10.md](../coach_answers_codex_2026-10-10.md), [coach_answers_round3.md](../coach_answers_round3.md), [coach_answers_round2.md](../coach_answers_round2.md), [coach_answers_full.md](../coach_answers_full.md), [coach_chat_statements.md](../coach_chat_statements.md), [coach_answers.md](../coach_answers.md) | The final authority. Never edited. |
| His sheets | `raw/`, `dumps/` | His two Google Sheets, as Excel copies and as text |
| The model in words | [BLAZE_CAMP_BRAIN.md](../BLAZE_CAMP_BRAIN.md) (v1.3), `synthesis/*.md` | Every rule, with its evidence label |
| The model as data | [generator_spec_v1.json](../generator_spec_v1.json), `synthesis/*.json`; compiled for the engine in `model/` | The same rules as JSON |
| The explanation | this folder | Plain-language guides, his answers by topic, decision records, reference pages, history |

The full repo map is [further down](#map-of-the-whole-repo).

## Reading paths

### Coach: 20 minutes

You do not need to read code.

| Minutes | Read | You learn |
|---|---|---|
| 3 | [what this is](00-overview/what-this-is.md) | What the model is and is not |
| 5 | [how a plan is made](00-overview/how-a-plan-is-made.md) | One plan, from the answers to the finished week |
| 5 | [principles](01-philosophy/principles.md), the table at the top | His 30 principles at a glance |
| 4 | [volume](02-model/volume.md) and [stairway](02-model/stairway.md), "The rule" sections | How much work, and how it grows |
| 3 | [sessions](02-model/sessions.md), "The rule" section | How a day is ordered |

Then read [for coaches](00-overview/for-coaches.md). It says what you can change for your own gym and what is locked. After that, go to what you coach:

| You coach | Read |
|---|---|
| Physique and general fitness | [volume](02-model/volume.md), [plans and calendar](02-model/plans-and-calendar.md) |
| Athletes | [athletes](02-model/athletes.md), [sports](02-model/sports.md), [bilateral and unilateral](02-model/bilateral-unilateral.md), [swimming](02-model/swimming.md) |
| Adults who play for fun | [stay athletic and active](02-model/stay-athletic-and-active.md) |
| Older adults, youth, people in pain | [special populations](02-model/special-populations.md) |
| A gym with limited equipment | [equipment](02-model/equipment.md), [exercise library](02-model/exercise-library.md) |

### Developer

| Step | Read | You learn |
|---|---|---|
| 1 | [for developers](00-overview/for-developers.md) | Where the data is, what is stable and what is moving, two ways to build on it |
| 2 | [AGENTS.md](../AGENTS.md) | The working guide: authority order, where each rule lives, commands, the hard rules, how to change things safely |
| 3 | [generator_spec_v1.json](../generator_spec_v1.json) | The model as one JSON file. Start with `inputs_schema`, `rule_tables`, `plan_types`, `validation_checks`. |
| 4 | [data dictionary](05-reference/data-dictionary.md) | Every field of an exercise, a profile, a template, the intake and the plan |
| 5 | [parameters](05-reference/parameters.md) | Every number, its key, and whether he confirmed it |
| 6 | [how a plan is made](00-overview/how-a-plan-is-made.md) | One worked case with every number |
| 7 | [decision records](04-decisions/index.md) | Why a rule exists, before you touch it |
| 8 | [adding exercises](adding-exercises.md), [CONTRIBUTING.md](../CONTRIBUTING.md) | How to add data and propose a change |
| 9 | [engine/README.md](../engine/README.md), [engine/CONTRACTS.md](../engine/CONTRACTS.md), [samples/STATUS_v0.5.md](../samples/STATUS_v0.5.md) | Only if you run the engine. Version 0.5 is template-first, with no time-fitting ([ADR-058](04-decisions/adr-058-engine-v05-template-first-not-the-large-planner.md)). The status page gives its test counts and known gaps. |

### AI agent

| Step | Read | Use it for |
|---|---|---|
| 1 | [CONTEXT_FOR_AI.md](CONTEXT_FOR_AI.md) | One self-contained briefing of the whole model. Load it first. |
| 2 | [AGENTS.md](../AGENTS.md) | The working rules of the repo: commands, hard rules H01 to H22, what never to edit |
| 3 | [llms.txt](../llms.txt) | A link index of the repo |
| 4 | [parameters](05-reference/parameters.md) | Looking up a number and its status before you state it |
| 5 | [his answers by topic](03-coach-answers/index.md) | Finding his exact words for an answer id |
| 6 | [what he rejected](01-philosophy/what-he-rejected.md) | Checking an idea before you propose it. Most obvious additions are already on that list. |
| 7 | [CODEX_BRIEF.md](../CODEX_BRIEF.md) | Only if your job is the outside research review |

### Reviewer

| Step | Read | You learn |
|---|---|---|
| 1 | [REVIEW_GUIDE.md](../REVIEW_GUIDE.md) | What to check and how to report. Whatever authority list it prints, the order on this page holds: round 4 and CT-01 first, then CX, then rounds 3, 2 and 1. |
| 2 | [CODEX_BRIEF.md](../CODEX_BRIEF.md) | The two research jobs: back up the science, and find what is missing |
| 3 | [method](06-history/method.md) | Evidence labels, the authority order, how answers were applied and checked |
| 4 | [coverage_matrix_round4.md](../coverage_matrix_round4.md) (round 4, CT-01, CX-01..04), [coverage_matrix_round3.md](../coverage_matrix_round3.md), [coverage_matrix_round2.md](../coverage_matrix_round2.md), [coverage_matrix.md](../coverage_matrix.md) | Each answer traced to where it is applied |
| 5 | [changes across rounds](03-coach-answers/changes-across-rounds.md) | Every place a later answer changed an earlier one |
| 6 | [what he rejected](01-philosophy/what-he-rejected.md) and the retired list in [decision records](04-decisions/index.md) | Ideas that must not come back |
| 7 | [parameters](05-reference/parameters.md), the Status column | Which numbers are his and which are PROPOSED |
| 8 | [lineage](01-philosophy/lineage.md), [synthesis/07_science_lineage.md](../synthesis/07_science_lineage.md), [synthesis/12_volume_algorithm_v1.md](../synthesis/12_volume_algorithm_v1.md) | The sources and the research already cited |
| 9 | [roadmap](06-history/roadmap.md) | What is done, what is in progress, what is open |

A coach answer you disagree with is not an error. Report it as "for discussion with the coach".

### A person who trains

Read [what this is](00-overview/what-this-is.md), then [how a plan is made](00-overview/how-a-plan-is-made.md), then the [FAQ](05-reference/faq.md) and [safety and liability](00-overview/safety-and-liability.md). The website that would build a plan in a few taps does not exist yet.

## The model on one screen

Words used below. A **hard set** is a working set that ends with 1 to 3 **reps in reserve (RIR)**, which means 1 to 3 more reps were possible. A **focus group** is the unit sets are counted on. The **stairway** is his word for how a plan climbs week by week. **Plyometric** jumps have short, bouncy ground contacts. **Ballistic** work is one big push, such as a box jump or a medball throw. **Bilateral** means both sides work together. **Unilateral** means one side at a time. **Knee dominant** means the knee does most of the bending, as in a squat. **Hip dominant** means the hip does, as in a deadlift. A **compound** lift moves more than one joint. A **superset** is two exercises done back to back before resting. A **block** is a run of weeks that climbs and is meant to be finished.

| Topic | The rule | His answer | Not confirmed yet |
|---|---|---|---|
| Product | A few answers in. The whole plan out once, every week visible. A complete template that people edit. No check-ins, no tracking, no data kept. | R3-VOL-02, R3-VOL-04, R3-GEN-01, CX-04 | Screens and exports |
| What is asked | Goal, sport or activity, training experience, age, body weight, days, equipment, pain. Optional: Focus muscle 1 and 2. Never sex, sleep, stress or job. Never session length. | GEN-02, R2-GEN-04, R3-SES-01, R4-SES-01 | |
| Categories | Every exercise is tagged on all lenses at once: family (athletic, resistance, core, cardio, functional), pattern (with a mid-range push and a mid-range pull between horizontal and vertical), one side or two, plane, big or small muscle, equipment, level. | CAT-01, CAT-02, R4-LIB-03 | Size class of front delts, traps, adductors, neck |
| Counting | Weekly hard sets per group. The main mover gets 1 set. Each helper gets 0.25. Jumps, throws, Olympic lifts, sprints, kettlebell swings, carries and sled work count for no muscle. | VOL-09, VOL-10, R2-VOL-05, R4-LIB-02 | A set counting at most once per group |
| Groups | Quads, hips (glutes + hamstrings), back, chest, shoulders (front, side and rear delts), biceps, triceps, calves, core. Rear delts are part of shoulders. | R3-SES-01, R3-VOL-01 | |
| Starting sets | By level 1 / 2 / 3. Big muscles 10 / 15 / 20. Shoulders, biceps, triceps 10 / 12 / 15. | VOL-01, R2-VOL-04 | The level-3 start of 20; the definition of level 3 |
| Floor and top number | With 3 or more training days, never under 10 sets a week on a group a training block trains. With 2 days, every big muscle at about 6 to 8 sets, and the plan suggests a third day. Top numbers 14 / 22 / 25 by level. | R2-VOL-06, R4-SES-03 | The same top numbers for the small groups (INFERRED); small groups on 2 days |
| Focus muscles | Up to 2. Each gets 1 to 3 extra sets a week. | R3-SES-01 | The default of +2 |
| Stairway | Usually about 3 % more sets a week until the halfway week, about 5 % after. Each trained group reaches its final sets in the last week (one week early is fine), with bigger steps when needed. No hard limit; a week that adds more than about 15 % carries a note. A week may hold its sets while reps or load progress. Reps and load are a rule the person applies. Week 1 feels like a 2, the last week like an 11. | R2-PER-03, R3-VOL-04, CX-01..03, R4-PRG-01..03, R2-PER-05 | Never flagging a single added set |
| Effort and reps | 1 to 3 reps in reserve: 3 early, then 2, then 1-2, then 1 plus intensifiers in the last week. 5 to 30 reps. Never to failure on heavy compound lifts. | VOL-13, R3-VOL-04, GEN-08 | Which week each effort step starts |
| Session order | Warm-up. Core opener (2 exercises × 2 sets). Jumps and throws. Olympic lifts. The main lift. The rest of the strength work. Isolation. Conditioning. Power before strength. Horizontal before vertical. | ORD-08, ATH-11, R2-SES-03, ORD-03, ORD-01, ORD-02 | |
| Pairing and spine | Hip-dominant lower body with a push. Knee-dominant with a pull. One heavy squat day and one heavy deadlift day a week, on different days. | UNI-11, ORD-06, PER-04, R2-SES-01 | |
| Day templates | His own templates are the skeleton. A full-body day is Day A (pull + knee dominant) or Day B (push + hip dominant): about 6 exercises, up to 8. Push / pull / legs is the other main layout. On a split day a group gets 2 to 4 exercises, never 1. Calves: one exercise × 3 sets every leg day. | R4-SES-05, R2-SES-05, R3-SES-01, VOL-17 | The order inside an A / B pair; split days after round 4 (INFERRED) |
| Session size | By number of exercises, not counting the warm-up or the 2 core exercises: general 5 to 7; aesthetics 6 to 8; strength 5 to 6; bootcamp 5 to 7 stations; field athletes up to 12; older adults 5 to 6. Recommendations. | R4-SES-02, VOL-08, R2-SES-04 | The default inside each range; two client types he did not list |
| Time | Not asked and never a limit. Each day prints an average time as information. Nothing is dropped automatically: the person picks what to remove. | CT-01, R4-SES-01, R4-SES-04 | The minutes behind the estimate |
| Editing | People can change the sets of any day or week, switch off a day's athletic block or core block, add or remove exercises, add an optional add-on, and swap inside a category. | R3-SES-02, GEN-04, CX-02, CX-04 | How editing works on screen |
| Two legs or one | A scale from 90/10 to 10/90. Bodybuilders and powerlifters move toward bilateral. Field athletes stay 80 to 90 % unilateral. | UNI-02, UNI-10 | Most per-sport numbers |
| Equipment and library | No bands. No variable resistance. Machines are not ranked. Equipment is described by how much it holds you in place, on a constraint scale from 1 to 5. More machines for older, injured and high-volume clients. Exercises the team proposed are optional add-ons, never a template's pick. Incline pressing before overhead pressing for bodybuilders and the general population. A swap says what it keeps and loses. | EQ-01, EQ-12, EQ-11, EQ-13, EQ-03, R4-LIB-01, R4-LIB-03, R4-LIB-04 | "Maybe CrossFit" for wall balls and sled pushes |
| Athletes | Time on the ground decides the plyometric share of jump work: 75, 60, 50, 40 or 25 % by sport. Each block starts 15 points more ballistic. Jumps are taught in three Receive-Create stages. Everyone in athletic training gets Olympic lifts. Medballs stay light: 8 to 10 lb for passes, never over 20 lb. | ATH-01, R2-ATH-01, R3-ATH-04, R2-ATH-03, ATH-10, EQ-06, conversation | Sports he was not asked about |
| Sports and activities | 52 sports with positions, 26 "stay athletic and active" activities, 127 profiles. Each profile carries a label: confirmed by coach (23), based on a similar sport (67) or proposed (37). | Conversation; R3-ATH-01 to R3-ATH-05; R4-SCP-03 | Many numbers inside the profiles |
| Age and pain | From 60: jumps and Olympic lifts off unless switched on with his warning. Racket players from 50: knee-friendly strength, calf and Achilles work, low-impact jumps. Pain: cut that area 30 to 50 %, move to machines, or drop the exercise. No rules by sex. | R2-ATH-08, R3-ATH-02, VOL-03, ATH-09 | The pain factor the tool uses (0.6) |
| Plans | 12 weeks (preferred). 8 weeks. Maintenance at 50 to 70 % of the volume, length chosen by the person. A year for the general population. The season for athletes. | PER-01, R2-PER-01, R2-PER-06 | Week layout of the year |
| Easy weeks | Never inside a block. After a block, an easy week at about half the sets is recommended, not required. | R2-VOL-07, R3-PER-01 | |
| Tests | Before or at the start, and at the end. Never during the block. Never a 1-rep max from zero. | R2-PER-07 | |
| Legal | MIT license. The model is the experience and intellectual property of Coach Lalo (Gerardo Vera), Master NASM coach. Disclaimers in English and Spanish. Everyone may use the plans; the terms and release must be accepted before a plan is generated, and every plan prints a release line. A short health check, which a coach may skip with a warning. No third-party video links: a YouTube search link per exercise. | R3-GEN-01, R2-GEN-03, R4-SCP-01, R4-SCP-02, R4-REL-03, R4-LIB-05 | The legal wording waits for a Florida attorney; whether a flagged health answer still stops a plan |

Every number, with its file, key and status: [parameters](05-reference/parameters.md).

## One topic, six places

Each topic is written at six depths. Pick the one you need.

| Topic | Explained | His answers | Why it was decided | Numbers ([parameters](05-reference/parameters.md) section) | Master ([BRAIN](../BLAZE_CAMP_BRAIN.md) section) | Data ([spec](../generator_spec_v1.json) key or file) |
|---|---|---|---|---|---|---|
| Categories and library | [categories](02-model/categories.md), [exercise library](02-model/exercise-library.md) | [categorization](03-coach-answers/categorization.md), [library details](03-coach-answers/library-details.md) | [ADR-011](04-decisions/adr-011-tag-every-exercise-on-all-lenses.md), [014](04-decisions/adr-014-leg-flexion-own-segment.md), [015](04-decisions/adr-015-library-source-of-truth-one-detail-variations.md), [054](04-decisions/adr-054-proposed-exercises-are-optional-add-ons.md), [055](04-decisions/adr-055-incline-preference-and-mid-range-pull.md) | see [data dictionary](05-reference/data-dictionary.md) §1 | §2, §4 | `rule_tables > taxonomy`; `synthesis/01_taxonomy.json`; `synthesis/02_exercise_catalog.json` |
| Levels and zones | [levels and zones](02-model/levels-and-zones.md) | [levels and zones](03-coach-answers/levels-and-zones.md) | [ADR-012](04-decisions/adr-012-levels-from-load-position.md), [013](04-decisions/adr-013-davidson-zones-as-tags.md), [016](04-decisions/adr-016-client-levels-by-training-experience.md) | §2 | §3 | `vocab > levels`; `rule_tables > levels_exercise` |
| Volume | [volume](02-model/volume.md) | [volume](03-coach-answers/volume.md) | [ADR-017](04-decisions/adr-017-floor-of-10-on-focus-groups.md) to [021](04-decisions/adr-021-starting-sets-and-ceilings-by-level.md), [024](04-decisions/adr-024-focus-muscle-1-and-2.md) | §1, §3 to §6 | §5 | `rule_tables > weekly_sets`, `counting`, `priority`, `pain` |
| Stairway | [stairway](02-model/stairway.md) | [progression](03-coach-answers/progression.md) | [ADR-022](04-decisions/adr-022-every-plan-is-a-stairway.md), [023](04-decisions/adr-023-weekly-percentages-by-size-or-by-person-retired.md), [025](04-decisions/adr-025-where-a-new-set-goes.md), [026](04-decisions/adr-026-effort-in-reps-in-reserve.md), [049](04-decisions/adr-049-endpoint-priority-and-editable-progression.md), [053](04-decisions/adr-053-progression-written-as-a-rule.md) | §7, §8, §14 | §5, §7 | `rule_tables > rate_engine`, `banking`, `set_placement`, `effort` |
| Sessions | [sessions](02-model/sessions.md) | [sessions and order](03-coach-answers/sessions-and-order.md) | [ADR-027](04-decisions/adr-027-core-first.md) to [031](04-decisions/adr-031-two-to-four-exercises-per-group.md), [050](04-decisions/adr-050-no-time-fitting-sessions-sized-by-exercise-count.md), [051](04-decisions/adr-051-coach-templates-are-the-skeleton.md), [052](04-decisions/adr-052-two-day-rule.md); retired: [032](04-decisions/adr-032-time-vs-minimums-order.md) | §9 to §11, §13 | §10 | `rule_tables > ordering`, `pairing`, `axial_loading`, `session_limits`, `time_model` |
| Two legs or one | [bilateral and unilateral](02-model/bilateral-unilateral.md) | [bilateral and unilateral](03-coach-answers/bilateral-unilateral.md) | [ADR-033](04-decisions/adr-033-bilateral-unilateral-scale.md) | §12 | §6 | `rule_tables > bilateral_unilateral`, `contra_ipsi` |
| Equipment | [equipment](02-model/equipment.md) | [equipment](03-coach-answers/equipment.md) | [ADR-034](04-decisions/adr-034-no-bands-no-variable-resistance.md), [035](04-decisions/adr-035-machines-not-ranked.md), [036](04-decisions/adr-036-light-medballs.md) | §17 | §8 | `rule_tables > equipment`; `synthesis/10_equipment_model.json` |
| Athletes and sports | [athletes](02-model/athletes.md), [sports](02-model/sports.md), [swimming](02-model/swimming.md), [stay athletic and active](02-model/stay-athletic-and-active.md) | [athletes and sports](03-coach-answers/athletes-and-sports.md) | [ADR-037](04-decisions/adr-037-plyometric-vs-ballistic-by-ground-contact.md), [038](04-decisions/adr-038-receive-create-stages.md), [039](04-decisions/adr-039-olympic-lifts-policy.md), [041](04-decisions/adr-041-every-sport-and-stay-athletic.md), [057](04-decisions/adr-057-sport-profile-confidence-labels.md) | §15, §16 | §9 | `rule_tables > athletic`, `conditioning`; `synthesis/04_profiles.json` |
| Older adults, youth, pain | [special populations](02-model/special-populations.md) | [athletes and sports](03-coach-answers/athletes-and-sports.md), [volume](03-coach-answers/volume.md) | [ADR-040](04-decisions/adr-040-older-adult-defaults.md), [004](04-decisions/adr-004-no-sex-field.md) | §6, §18 | §9 | `rule_tables > athletic > older`, `youth`; `rule_tables > pain` |
| Plans and calendar | [plans and calendar](02-model/plans-and-calendar.md) | [plans and calendar](03-coach-answers/plans-and-calendar.md) | [ADR-042](04-decisions/adr-042-plan-lengths.md), [043](04-decisions/adr-043-no-deload-inside-a-block.md), [045](04-decisions/adr-045-same-exercises-within-a-block.md) | §19 | §11 | `plan_types` |
| Testing | [testing](02-model/testing.md) | [testing](03-coach-answers/testing.md) | [ADR-044](04-decisions/adr-044-tests-at-start-and-end.md) | §20 | §12 | `tests` |
| Product and legal | [what this is](00-overview/what-this-is.md), [safety and liability](00-overview/safety-and-liability.md) | [product and generator](03-coach-answers/product-and-generator.md), [legal and open source](03-coach-answers/legal-and-open-source.md) | [ADR-001](04-decisions/adr-001-answers-in-plan-out-no-check-ins.md) to [010](04-decisions/adr-010-health-check-and-release-every-build.md), [056](04-decisions/adr-056-liability-gate-before-every-plan.md) | §21 | §13, §14 | `inputs_schema`, `plan_editing`, `legal_and_privacy`, `output` |

## Map of the docs folder

### This folder's own files

| File | What it is |
|---|---|
| [README.md](README.md) | This map |
| [CONTEXT_FOR_AI.md](CONTEXT_FOR_AI.md) | One briefing an AI agent can load to understand the whole model |
| [adding-exercises.md](adding-exercises.md) | How to add an exercise or a variation so the tool files it and counts it his way |
| [adding-exercises.es.md](adding-exercises.es.md) | The same guide in Spanish |

### 00-overview: what it is and how to use it

| File | What it is |
|---|---|
| [what-this-is.md](00-overview/what-this-is.md) | The model in one page: what goes in, what comes out, who it is for, what it is not, the counts |
| [what-this-is.es.md](00-overview/what-this-is.es.md) | The same page in Spanish |
| [how-a-plan-is-made.md](00-overview/how-a-plan-is-made.md) | One beginner followed from the answers to a finished week and a 12-week stairway, with real output of engine 0.5 |
| [for-coaches.md](00-overview/for-coaches.md) | How to read the model, what you can change for your gym, what is locked |
| [for-developers.md](00-overview/for-developers.md) | Where the data is, what is stable, two ways to build an app on it |
| [safety-and-liability.md](00-overview/safety-and-liability.md) | The disclaimer in plain words and the safety rules built into the model. Not the legal text. |

### 01-philosophy: how he thinks

| File | What it is |
|---|---|
| [principles.md](01-philosophy/principles.md) | His 30 principles, each with his reason and its data key |
| [how-he-thinks.md](01-philosophy/how-he-thinks.md) | The mental model behind the rules, so you can predict a case the rules do not cover |
| [lineage.md](01-philosophy/lineage.md) | Where the ideas come from (Dr. Pat Davidson, Dr. Mike Israetel, first principles) and what he does not build on |
| [what-he-rejected.md](01-philosophy/what-he-rejected.md) | Every idea he turned down, in his words. Read it before you add a feature. |

### 02-model: the model, topic by topic

| File | What it is |
|---|---|
| [categories.md](02-model/categories.md) | How every exercise is sorted: families, patterns, planes, big and small muscles, focus groups |
| [levels-and-zones.md](02-model/levels-and-zones.md) | Exercise level, client level, Davidson zones and Receive-Create stages, kept apart |
| [exercise-library.md](02-model/exercise-library.md) | The library: counts, default picks, swaps, optional add-ons, the one-detail variation rule, what was renamed or removed |
| [equipment.md](02-model/equipment.md) | The constraint scale, who gets machines, substitutions, no bands, medball rules |
| [volume.md](02-model/volume.md) | Weekly sets per group: counting, starts, top numbers, the floor of 10, the 2-day rule, Focus muscles, pain |
| [stairway.md](02-model/stairway.md) | How a plan climbs week to week to its final sets, the progression rule for reps and load, where new sets go, how it feels |
| [bilateral-unilateral.md](02-model/bilateral-unilateral.md) | The 90/10 to 10/90 scale and which hand holds the weight |
| [sessions.md](02-model/sessions.md) | Order, pairing, spine days, his day templates (Day A, Day B, push / pull / legs), session size by exercise count, supersets, editing, and why nothing is cut for time |
| [plans-and-calendar.md](02-model/plans-and-calendar.md) | Plan types, blocks, easy weeks, maintenance, the year, the season |
| [testing.md](02-model/testing.md) | What to test and when |
| [athletes.md](02-model/athletes.md) | Jumps, throws, Olympic lifts, medballs, cardio and the season for athletes |
| [sports.md](02-model/sports.md) | All 52 sports with their positions and dials, which numbers he confirmed, and the confidence label of every profile |
| [stay-athletic-and-active.md](02-model/stay-athletic-and-active.md) | Pickleball, padel, HYROX, rec leagues, running: people who play but do not compete |
| [special-populations.md](02-model/special-populations.md) | Older adults, youth, pain and injury, and no rules by sex |
| [swimming.md](02-model/swimming.md) | One sport worked from the first question to a finished week |

### 03-coach-answers: everything he answered

All 223 ids, sorted by topic: 218 questionnaire answers from four rounds, plus the 5 ids of the two clarifications of 2026-10-10 (CX-01 to CX-04, CT-01). Each entry gives the question, his final answer, a short quote, what the team added, and where the rule lives.

| File | What it is |
|---|---|
| [index.md](03-coach-answers/index.md) | Every id mapped to its page, with the final rule in one line |
| [changes-across-rounds.md](03-coach-answers/changes-across-rounds.md) | Every place a later answer (round 2, round 3, the 2026-10-10 clarifications, round 4) changed an earlier one |
| [categorization.md](03-coach-answers/categorization.md) | How exercises are tagged; bigger and smaller muscles; core; leg flexion |
| [levels-and-zones.md](03-coach-answers/levels-and-zones.md) | Exercise levels, client levels, what "zone" means |
| [volume.md](03-coach-answers/volume.md) | Weekly sets, the floor and ceilings, counting, reps, effort, rest, pain |
| [progression.md](03-coach-answers/progression.md) | The stairway, reaching the final sets, the written progression rule, where added sets go, and the full history of the removed check-in |
| [bilateral-unilateral.md](03-coach-answers/bilateral-unilateral.md) | The share of two-sided and one-sided work |
| [sessions-and-order.md](03-coach-answers/sessions-and-order.md) | Order, pairing, spine loading, session size, his A / B template, 2-day weeks, no time-fitting, supersets, editing, cardio |
| [equipment.md](03-coach-answers/equipment.md) | No bands, machines, substitutions, medballs, cardio tools |
| [athletes-and-sports.md](03-coach-answers/athletes-and-sports.md) | Plyometric and ballistic work, Olympic lifts, seasons, older adults, swimming, HYROX, staying active |
| [plans-and-calendar.md](03-coach-answers/plans-and-calendar.md) | Plan lengths, blocks, easy weeks, maintenance, the year, seasons |
| [testing.md](03-coach-answers/testing.md) | When and what to test |
| [library-details.md](03-coach-answers/library-details.md) | Item-by-item decisions on single exercises and sheet labels; optional add-ons, carries, mid-range pull, swap notes, video links |
| [product-and-generator.md](03-coach-answers/product-and-generator.md) | Who it is for, the form, the output as an editable template, hard rules, sample plans, the release |
| [legal-and-open-source.md](03-coach-answers/legal-and-open-source.md) | Health check, the liability gate and release line, no data kept, MIT, credit, open source |

### 04-decisions: why each rule is the way it is

One short record per decision: the rule, who decided it, what else was considered, what follows. Start with the [index](04-decisions/index.md). It also lists the retired ideas and the points that still go back to the coach.

| Theme | Records |
|---|---|
| Product | [001](04-decisions/adr-001-answers-in-plan-out-no-check-ins.md) answers in, plan out, no check-ins · [002](04-decisions/adr-002-no-data-kept.md) no data kept · [003](04-decisions/adr-003-no-lifestyle-inputs.md) no lifestyle inputs · [004](04-decisions/adr-004-no-sex-field.md) no sex field · [005](04-decisions/adr-005-editable-plan-switches-and-supersets.md) editable plan, switches, supersets · [056](04-decisions/adr-056-liability-gate-before-every-plan.md) the liability gate and release line · [006](04-decisions/adr-006-website-not-app.md) website, not app · [007](04-decisions/adr-007-bilingual-english-first-full-spanish.md) English first, full Spanish · [008](04-decisions/adr-008-videos-optional.md) videos optional · [009](04-decisions/adr-009-mit-license-and-disclaimers.md) MIT and disclaimers · [010](04-decisions/adr-010-health-check-and-release-every-build.md) health check and release at every build |
| Categorization | [011](04-decisions/adr-011-tag-every-exercise-on-all-lenses.md) tag on all lenses · [012](04-decisions/adr-012-levels-from-load-position.md) levels from load position · [013](04-decisions/adr-013-davidson-zones-as-tags.md) Davidson zones as tags · [014](04-decisions/adr-014-leg-flexion-own-segment.md) leg flexion as its own segment · [015](04-decisions/adr-015-library-source-of-truth-one-detail-variations.md) library is the source of truth · [054](04-decisions/adr-054-proposed-exercises-are-optional-add-ons.md) proposed exercises are optional add-ons · [055](04-decisions/adr-055-incline-preference-and-mid-range-pull.md) incline first, mid-range pull · [016](04-decisions/adr-016-client-levels-by-training-experience.md) client levels by training experience |
| Volume | [017](04-decisions/adr-017-floor-of-10-on-focus-groups.md) floor of 10 on focus groups · [018](04-decisions/adr-018-rear-delts-part-of-shoulders.md) rear delts are part of shoulders · [019](04-decisions/adr-019-helper-credit-0-25.md) helper credit 0.25 · [020](04-decisions/adr-020-athletic-work-never-counts-as-muscle-sets.md) athletic work never counts as muscle sets · [021](04-decisions/adr-021-starting-sets-and-ceilings-by-level.md) starts and ceilings by level · [049](04-decisions/adr-049-endpoint-priority-and-editable-progression.md) final sets reached, editable sets · [052](04-decisions/adr-052-two-day-rule.md) the 2-day rule · [053](04-decisions/adr-053-progression-written-as-a-rule.md) progression written as a rule · [022](04-decisions/adr-022-every-plan-is-a-stairway.md) every plan is a stairway · [023](04-decisions/adr-023-weekly-percentages-by-size-or-by-person-retired.md) weekly percentages (retired) · [024](04-decisions/adr-024-focus-muscle-1-and-2.md) Focus muscle 1 and 2 · [025](04-decisions/adr-025-where-a-new-set-goes.md) where a new set goes · [026](04-decisions/adr-026-effort-in-reps-in-reserve.md) effort in reps in reserve |
| Sessions | [027](04-decisions/adr-027-core-first.md) core first · [028](04-decisions/adr-028-power-first-horizontal-before-vertical.md) power first, horizontal before vertical · [029](04-decisions/adr-029-pairing-hip-push-knee-pull.md) hip + push, knee + pull · [030](04-decisions/adr-030-axial-loading-once-per-pattern.md) spine loaded once a week per pattern · [031](04-decisions/adr-031-two-to-four-exercises-per-group.md) 2 to 4 exercises per group (split days) · [050](04-decisions/adr-050-no-time-fitting-sessions-sized-by-exercise-count.md) no time-fitting, session size by exercise count · [051](04-decisions/adr-051-coach-templates-are-the-skeleton.md) his templates are the skeleton · [032](04-decisions/adr-032-time-vs-minimums-order.md) time against the minimums |
| Bilateral work and equipment | [033](04-decisions/adr-033-bilateral-unilateral-scale.md) bilateral to unilateral scale · [034](04-decisions/adr-034-no-bands-no-variable-resistance.md) no bands, no variable resistance · [035](04-decisions/adr-035-machines-not-ranked.md) machines not ranked · [036](04-decisions/adr-036-light-medballs.md) light medballs |
| Athletes | [037](04-decisions/adr-037-plyometric-vs-ballistic-by-ground-contact.md) plyometric or ballistic by ground contact · [038](04-decisions/adr-038-receive-create-stages.md) Receive-Create stages · [039](04-decisions/adr-039-olympic-lifts-policy.md) Olympic lifts · [040](04-decisions/adr-040-older-adult-defaults.md) older-adult defaults · [041](04-decisions/adr-041-every-sport-and-stay-athletic.md) every sport, and stay athletic · [057](04-decisions/adr-057-sport-profile-confidence-labels.md) profile confidence labels |
| Plans | [042](04-decisions/adr-042-plan-lengths.md) plan lengths · [043](04-decisions/adr-043-no-deload-inside-a-block.md) no deload inside a block · [044](04-decisions/adr-044-tests-at-start-and-end.md) tests at the start and the end · [045](04-decisions/adr-045-same-exercises-within-a-block.md) same exercises within a block |
| Method and engineering | [046](04-decisions/adr-046-built-from-first-principles.md) built from first principles · [047](04-decisions/adr-047-authority-order-and-evidence-labels.md) authority order and evidence labels · [048](04-decisions/adr-048-optimizer-rebuild-of-the-planner.md) rebuilding the planner as an optimizer (team; superseded, not built) · [058](04-decisions/adr-058-engine-v05-template-first-not-the-large-planner.md) engine 0.5, template-first (team) |

### 05-reference: look things up

| File | What it is |
|---|---|
| [glossary.md](05-reference/glossary.md) | Every term, his and the team's, with the answer id that decided it |
| [glossary.es.md](05-reference/glossary.es.md) | The glossary in Spanish |
| [parameters.md](05-reference/parameters.md) | Every tunable number: value, unit, file and key, source, status. Ends with the retired numbers. |
| [data-dictionary.md](05-reference/data-dictionary.md) | Every field of an exercise, a profile, a template, the intake and the plan |
| [faq.md](05-reference/faq.md) | 30 questions a coach or developer would ask, each with the short answer first |

### 06-history: how it got here

| File | What it is |
|---|---|
| [timeline.md](06-history/timeline.md) | The build, step by step, from 2026-10-07 on |
| [source-sheets.md](06-history/source-sheets.md) | His two Google Sheets, tab by tab, and how each was used |
| [method.md](06-history/method.md) | Evidence labels, authority order, how answers were applied and checked |
| [roadmap.md](06-history/roadmap.md) | What is done, what is in progress, what comes next, the public release checklist |

## Map of the whole repo

"Edit?" follows [AGENTS.md](../AGENTS.md) §5 and §13.

| Path | What it is | Edit? |
|---|---|---|
| [README.md](../README.md) | Project overview, status, the risk notice in English and Spanish | Yes |
| [AGENTS.md](../AGENTS.md) | Working guide for AI agents and developers | Yes |
| [llms.txt](../llms.txt) | Link index for AI agents | Yes |
| [CODEX_BRIEF.md](../CODEX_BRIEF.md) | Research brief for the outside reviewer | Yes |
| [REVIEW_GUIDE.md](../REVIEW_GUIDE.md) | What reviewers check and how they report | Yes |
| [CONTRIBUTING.md](../CONTRIBUTING.md) | How to propose a change | Yes |
| [LICENSE](../LICENSE), [DISCLAIMER.md](../DISCLAIMER.md), [DISCLAIMER.es.md](../DISCLAIMER.es.md) | MIT license. Disclaimer and release, drafts until a Florida attorney reviews them. | Only through the owner |
| [BLAZE_CAMP_BRAIN.md](../BLAZE_CAMP_BRAIN.md) | The master document, v1.3. Every rule with its evidence label. | Yes, with labels |
| `BLAZE_CAMP_BRAIN_v0.md`, `_v1.md`, `_v1_1.md`, `_v1_2.md`, `generator_spec_v0.json` | Earlier snapshots, kept as history | Never |
| [generator_spec_v1.json](../generator_spec_v1.json) | The model as a machine spec. The twin of the master document. | Yes, with labels |
| `synthesis/` | One detailed document per topic (01 to 13), most with a `.json` twin. `synthesis/sports/` holds the per-group sport research. | Yes, with labels |
| `coach_answers_round4.md`, `coach_answers_time_2026-10-10.md`, `coach_answers_codex_2026-10-10.md`, `coach_answers_round3.md`, `coach_answers_round2.md`, `coach_answers_full.md`, `coach_answers.md`, `coach_chat_statements.md` | His own words. The final authority. | Never |
| `answers_raw/`, `answers_raw_r2/`, `answers_raw_r3/`, `answers_raw_r4/` | The raw questionnaire answers | Never |
| `coach-questions.html`, `round2_questions.json`, `round3_questions.json`, `round4_questions.json` | The questionnaire page and the question lists. All questions are answered. | Rarely |
| `coverage_matrix.md`, `coverage_matrix_round2.md`, `coverage_matrix_round3.md`, `coverage_matrix_round4.md` | Each answer traced to where it is applied. The round-4 matrix also covers CT-01 and CX-01..04. | Yes |
| `raw/`, `dumps/`, `dump.py` | His two workbooks as Excel copies, every tab as text, and the script that made the text | Never (regenerate only) |
| `analysis/` | The first-pass decode of the library, the reference tabs and every program | Rarely |
| `docs/` | This folder | Yes |
| `model/` | The compiled model the engine reads. Generated by `tools/compile-model.mjs`. | Never by hand |
| `engine/` | The plan engine in plain JavaScript, version 0.5: template-first, no time-fitting. | Yes, per [AGENTS.md](../AGENTS.md) |
| `tools/` | Command-line tools: compile the model, check it, generate the samples | Yes |
| `tests/` | The test suites. Run with `node --test tests/`. | Yes |
| `samples/` | 8 sample clients (`intakes/`) and the plans generated for them (`plans/`), with `STATUS_v0.5.md` (what the engine does, test counts, known gaps). Drafts. The coach's grades (round 5): A for 01, 02, 07; B+ for 03, 04, 05, 06, 08. | Intakes yes; plans are generated |
| `design/` | Team notes: `ENGINE_V05_PLAN.md` (the plan engine 0.5 was built from), the benchmark in `design/bench/`, and research for a large optimizer planner that was **not built** (`PLANNER_SPEC.md`, `IMPLEMENTATION_PLAN.md`, diagnosis, the rules written as constraints) | Team |
| `workflows/` | The multi-agent scripts used to build and check the model | Rarely |

Counts and version numbers can move. Read the live values from `model/MODEL_VERSION`, `engine/version.mjs` and `generator_spec_v1.json > _meta > version`.

## I want to know X → read Y

### The product

| I want to know | Read |
|---|---|
| What this is, in one page | [what this is](00-overview/what-this-is.md) |
| How one plan is built, step by step | [how a plan is made](00-overview/how-a-plan-is-made.md) |
| Why there are no check-ins and no tracking | [ADR-001](04-decisions/adr-001-answers-in-plan-out-no-check-ins.md); the check-in history in [progression](03-coach-answers/progression.md) |
| Whether any data is kept | [ADR-002](04-decisions/adr-002-no-data-kept.md); [safety and liability](00-overview/safety-and-liability.md) |
| Why it never asks about sex, sleep or stress | [ADR-004](04-decisions/adr-004-no-sex-field.md), [ADR-003](04-decisions/adr-003-no-lifestyle-inputs.md) |
| What a person can change after the plan is built | [sessions](02-model/sessions.md) §9; [ADR-005](04-decisions/adr-005-editable-plan-switches-and-supersets.md), [ADR-049](04-decisions/adr-049-endpoint-priority-and-editable-progression.md) |
| What the health check and the release are | [safety and liability](00-overview/safety-and-liability.md); [ADR-010](04-decisions/adr-010-health-check-and-release-every-build.md), [ADR-056](04-decisions/adr-056-liability-gate-before-every-plan.md); [DISCLAIMER.md](../DISCLAIMER.md) |
| Why it never asks how long I want to train | [ADR-050](04-decisions/adr-050-no-time-fitting-sessions-sized-by-exercise-count.md); [his words](03-coach-answers/sessions-and-order.md#ct-01) |
| What the license allows | [ADR-009](04-decisions/adr-009-mit-license-and-disclaimers.md); [LICENSE](../LICENSE) |
| Whether there is a website or an app | [ADR-006](04-decisions/adr-006-website-not-app.md); [roadmap](06-history/roadmap.md). Neither is built yet. |

### His answers and his thinking

| I want to know | Read |
|---|---|
| Everything he answered, by topic | [his answers: index](03-coach-answers/index.md) |
| What one answer id says (for example `R2-SES-05`) | The id table in the [index](03-coach-answers/index.md), then the topic page |
| What a later answer changed | [changes across rounds](03-coach-answers/changes-across-rounds.md) |
| What round 4 and the 2026-10-10 clarifications decided, and where each is applied | [coverage_matrix_round4.md](../coverage_matrix_round4.md); [ADR-049](04-decisions/adr-049-endpoint-priority-and-editable-progression.md) to [ADR-058](04-decisions/adr-058-engine-v05-template-first-not-the-large-planner.md) |
| What he said in conversation | [coach_chat_statements.md](../coach_chat_statements.md), [coach_answers.md](../coach_answers.md) |
| His full answers, unsorted, as he gave them | [round 1](../coach_answers_full.md), [round 2](../coach_answers_round2.md), [round 3](../coach_answers_round3.md), [round 4](../coach_answers_round4.md), [CX](../coach_answers_codex_2026-10-10.md), [CT](../coach_answers_time_2026-10-10.md) |
| What he turned down | [what he rejected](01-philosophy/what-he-rejected.md) |
| His principles in one table | [principles](01-philosophy/principles.md) |
| How he would reason about a new case | [how he thinks](01-philosophy/how-he-thinks.md) |
| Where his ideas come from | [lineage](01-philosophy/lineage.md) |
| Which parts are his and which are PROPOSED | The Status column in [parameters](05-reference/parameters.md); "Points that still go back to the coach" in [decision records](04-decisions/index.md); [BLAZE_CAMP_BRAIN.md](../BLAZE_CAMP_BRAIN.md) §16 |

### Categories and exercises

| I want to know | Read |
|---|---|
| How an exercise is categorized | [categories](02-model/categories.md) |
| Which muscles are big, which are small, and what a focus group is | [categories](02-model/categories.md) §7 and §8 |
| Why rear delts are not their own muscle | [ADR-018](04-decisions/adr-018-rear-delts-part-of-shoulders.md) |
| The difference between exercise level, client level, zone and stage | [levels and zones](02-model/levels-and-zones.md) |
| What is in the library and how swaps work | [exercise library](02-model/exercise-library.md) |
| What an optional add-on is, and why carries are not in my template | [ADR-054](04-decisions/adr-054-proposed-exercises-are-optional-add-ons.md) |
| Why my plan has an incline press where I expected an overhead press | [ADR-055](04-decisions/adr-055-incline-preference-and-mid-range-pull.md) |
| How to add an exercise | [adding exercises](adding-exercises.md) |
| What a word means | [glossary](05-reference/glossary.md) |

### How much work, and how it grows

| I want to know | Read |
|---|---|
| How many sets per muscle group | [volume](02-model/volume.md) |
| How a set is counted, and why helpers get a quarter | [volume](02-model/volume.md) §2; [ADR-019](04-decisions/adr-019-helper-credit-0-25.md) |
| Why jumps and Olympic lifts do not count as muscle sets | [ADR-020](04-decisions/adr-020-athletic-work-never-counts-as-muscle-sets.md) |
| What the floor of 10 covers and what it does not | [ADR-017](04-decisions/adr-017-floor-of-10-on-focus-groups.md) |
| What happens with only 2 training days | [ADR-052](04-decisions/adr-052-two-day-rule.md); [volume](02-model/volume.md) §6a |
| What a Focus muscle is | [volume](02-model/volume.md) §7; [ADR-024](04-decisions/adr-024-focus-muscle-1-and-2.md) |
| How a plan climbs week to week, and how reps and load progress | [stairway](02-model/stairway.md); [ADR-053](04-decisions/adr-053-progression-written-as-a-rule.md) |
| Where a new set goes | [stairway](02-model/stairway.md) §4; [ADR-025](04-decisions/adr-025-where-a-new-set-goes.md) |
| How hard each set should be, the reps and the rest | [parameters](05-reference/parameters.md) §14; [ADR-026](04-decisions/adr-026-effort-in-reps-in-reserve.md) |
| What happens with pain | [special populations](02-model/special-populations.md); [parameters](05-reference/parameters.md) §6 |

### Sessions and equipment

| I want to know | Read |
|---|---|
| The order of a session | [sessions](02-model/sessions.md) §1 |
| Why hip with push and knee with pull | [ADR-029](04-decisions/adr-029-pairing-hip-push-knee-pull.md) |
| Which lifts count as loading the spine | [sessions](02-model/sessions.md) §5; [ADR-030](04-decisions/adr-030-axial-loading-once-per-pattern.md) |
| How a day is laid out (Day A, Day B, push / pull / legs) and how big a session is | [sessions](02-model/sessions.md) §6 and §7; [ADR-051](04-decisions/adr-051-coach-templates-are-the-skeleton.md), [ADR-050](04-decisions/adr-050-no-time-fitting-sessions-sized-by-exercise-count.md) |
| What gives when sessions are short | Nothing is cut for time: [sessions](02-model/sessions.md) §10; [ADR-050](04-decisions/adr-050-no-time-fitting-sessions-sized-by-exercise-count.md). The round-3 order is retired ([ADR-032](04-decisions/adr-032-time-vs-minimums-order.md)). |
| How much one-leg and two-leg work | [bilateral and unilateral](02-model/bilateral-unilateral.md) |
| Why no bands, and which machine is best | [equipment](02-model/equipment.md) §7 and §4.3 |
| What to use when equipment is missing | [equipment](02-model/equipment.md) §6 |
| How much cardio | [parameters](05-reference/parameters.md) §16 |

### Athletes and people

| I want to know | Read |
|---|---|
| How athletes are trained | [athletes](02-model/athletes.md) |
| The dials for one sport or position, and how sure they are | [sports](02-model/sports.md) (§5.1 for the confidence label); `synthesis/04_profiles.json > profiles`; [ADR-057](04-decisions/adr-057-sport-profile-confidence-labels.md) |
| A sport worked from start to finish | [swimming](02-model/swimming.md) |
| Plans for pickleball, HYROX, running, rec leagues | [stay athletic and active](02-model/stay-athletic-and-active.md) |
| What changes from age 60, for racket players from 50, and for youth | [special populations](02-model/special-populations.md); [ADR-040](04-decisions/adr-040-older-adult-defaults.md) |

### Plans and tests

| I want to know | Read |
|---|---|
| Which plan lengths exist | [plans and calendar](02-model/plans-and-calendar.md) §2; [ADR-042](04-decisions/adr-042-plan-lengths.md) |
| Why there is no deload week in the middle | [ADR-043](04-decisions/adr-043-no-deload-inside-a-block.md) |
| What happens when a block ends | [plans and calendar](02-model/plans-and-calendar.md) §6 and §7 |
| How the year and the season are laid out | [plans and calendar](02-model/plans-and-calendar.md) §10 and §11 |
| When and how to test | [testing](02-model/testing.md) |

### Data and code

| I want to know | Read |
|---|---|
| A number, its key and who decided it | [parameters](05-reference/parameters.md) |
| What a JSON field means | [data dictionary](05-reference/data-dictionary.md) |
| Where each kind of rule lives in the files | [for developers](00-overview/for-developers.md); [AGENTS.md](../AGENTS.md) §6 |
| How to run the engine and the tests | [for developers](00-overview/for-developers.md); [engine/README.md](../engine/README.md) §1; [AGENTS.md](../AGENTS.md) |
| The rules that must never break | [AGENTS.md](../AGENTS.md) |
| The shape of the plan JSON | [data dictionary](05-reference/data-dictionary.md) §5; [engine/CONTRACTS.md](../engine/CONTRACTS.md) |
| Why the engine is built the way it is, and what it measures today | [ADR-058](04-decisions/adr-058-engine-v05-template-first-not-the-large-planner.md); [samples/STATUS_v0.5.md](../samples/STATUS_v0.5.md); [design/ENGINE_V05_PLAN.md](../design/ENGINE_V05_PLAN.md). The optimizer of [ADR-048](04-decisions/adr-048-optimizer-rebuild-of-the-planner.md) was not built. |
| How to change a rule safely | [AGENTS.md](../AGENTS.md) §11; [CONTRIBUTING.md](../CONTRIBUTING.md) |

### History and review

| I want to know | Read |
|---|---|
| How the model was built | [timeline](06-history/timeline.md) |
| How far to trust a statement | [method](06-history/method.md) |
| What is in his original sheets | [source sheets](06-history/source-sheets.md) |
| What comes next | [roadmap](06-history/roadmap.md) |
| How to review the repo | [REVIEW_GUIDE.md](../REVIEW_GUIDE.md), [CODEX_BRIEF.md](../CODEX_BRIEF.md) |
| A quick answer to a common question | [FAQ](05-reference/faq.md) |

## How to read ids and labels

| You see | It means |
|---|---|
| `CAT-01`, `VOL-09`, `ORD-06` (no prefix) | His answer in round 1 ([coach_answers_full.md](../coach_answers_full.md)) |
| `R2-...` | His answer in round 2 ([coach_answers_round2.md](../coach_answers_round2.md)) |
| `R3-...` | His answer in round 3 ([coach_answers_round3.md](../coach_answers_round3.md)) |
| `R4-...` | His answer in round 4, the newest questionnaire ([coach_answers_round4.md](../coach_answers_round4.md)) |
| `CT-01` | His clarification of 2026-10-10 about time ([coach_answers_time_2026-10-10.md](../coach_answers_time_2026-10-10.md)) |
| `CX-01` to `CX-04` | His clarification of 2026-10-10 about progression and editing ([coach_answers_codex_2026-10-10.md](../coach_answers_codex_2026-10-10.md)) |
| "conversation" or "chat" | Something he said while the model was built ([coach_chat_statements.md](../coach_chat_statements.md), [coach_answers.md](../coach_answers.md)) |
| RIGHT with no words | He approved the team's wording as his rule. The wording is the team's. The rule is his. |
| **OBSERVED** | Read from his sheets |
| **INFERRED** | The team's reading of his sheets or answers. Treat it like PROPOSED. |
| **SCIENCE** | From published research. It fills a gap. It never overrules him. |
| **PROPOSED** | Suggested by the team. Not his rule until he approves it. |
| **RETIRED** | Removed by one of his answers. Do not rebuild it. |
| `ADR-nnn` | A decision record in [04-decisions](04-decisions/index.md) |
| `F..`, `D..`, `V..`, `H..` | An intake field, a derived value, a validation check and a hard rule. See [data dictionary](05-reference/data-dictionary.md) and [AGENTS.md](../AGENTS.md) §10. |

His sheets keep his own spelling inside quotes ('SAGITAL', 'TRIPPLE EXTENSION'). The model uses the corrected spelling. Both are intended.

## What is not settled

| Open point | Where to look |
|---|---|
| The numbers and mechanics marked PROPOSED or INFERRED | [parameters](05-reference/parameters.md); [decision records](04-decisions/index.md), last table |
| What engine 0.5 still does not do, and the open readings of round 4 | [samples/STATUS_v0.5.md](../samples/STATUS_v0.5.md); [ADR-058](04-decisions/adr-058-engine-v05-template-first-not-the-large-planner.md); [changes across rounds](03-coach-answers/changes-across-rounds.md), open readings; [roadmap](06-history/roadmap.md) |
| His grades of the sample plans | [roadmap](06-history/roadmap.md). Round 5: A for 01, 02, 07; B+ for 03, 04, 05, 06, 08 ([coach_answers_round5.md](../coach_answers_round5.md)). |
| His approval of the Spanish lines | [ADR-007](04-decisions/adr-007-bilingual-english-first-full-spanish.md) |
| Attorney review of the disclaimer, health check and release | [ADR-009](04-decisions/adr-009-mit-license-and-disclaimers.md), [ADR-010](04-decisions/adr-010-health-check-and-release-every-build.md), [ADR-056](04-decisions/adr-056-liability-gate-before-every-plan.md) |

Some files in the repo root were written before round 4. They may still describe retired things, such as a session-length question, a time check, check-in screens, a week-by-week mode or an authority list that stops at round 2 or 3. Where a file differs from his newest answers, the answers win.

## Keeping this map true

- When a page is added, moved or renamed, add or fix its row here and in [CONTEXT_FOR_AI.md](CONTEXT_FOR_AI.md).
- When he answers something new, update the topic page in `03-coach-answers/`, the model guide in `02-model/`, the number in [parameters](05-reference/parameters.md), and the decision record. Then check the one-screen table above.
- Never write a statement for him. Quote his answer files, with the id.
- Mark anything he has not confirmed as PROPOSED.
