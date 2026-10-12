# Timeline: how the Blaze Camp model was built

The Blaze Camp model was built in five days, from 2026-10-07 to 2026-10-11. It is the coaching model of Coach Lalo (Gerardo Vera), Master NASM coach, and it is his intellectual property. His two Google Sheets were exported and decoded tab by tab. First-pass analyses were written and fact-checked against the sheets. Then he answered four rounds of questions (140, 45, 13 and 20) and gave two clarifications in conversation. Each one changed the model, and his newest answer always wins. The sport list grew to 52 sports and 26 "stay athletic and active" activities. A first plan engine was built. Its plans had the right structure but the wrong dosing, and a large optimizer planner was designed to fix that. Then the coach removed the hardest requirement: plans no longer have to fit a session length. So the optimizer was parked, and engine 0.5 was built around his own templates instead. The MIT license and the disclaimers were added in round 3, and outside reviewers checked the science and the arithmetic. This page lists the steps in order, with the files each step left behind.

> **How to read this page.**
> - Dates come from three places: the "Collected" line at the top of each answer file, the git log, and file dates. Times of day are approximate.
> - **The team** means the people working with the coach plus the AI agents they ran. An **agent** is one AI worker with one task. A **workflow** is a script that runs many agents in a fixed order. The scripts are in [workflows/](../../workflows/) and are explained in [method.md](method.md).
> - A **coach-eye reviewer** is an AI agent that reads a sample plan the way the coach would. It is not the coach. **The coach had not graded any sample plan yet on 2026-10-11.** He graded all 8 in round 5 (2026-10-12): the coach's grades (round 5) are A for 01 swimming, 02 football and 07 push / pull / legs, and B+ for 03 soccer, 04 CrossFit-style class, 05 bootcamp, 06 full-body aesthetics and 08 pickleball (R5-GRD-01 ... 08).
> - The **master document** is [BLAZE_CAMP_BRAIN.md](../../BLAZE_CAMP_BRAIN.md), the one file that explains the whole model. The **spec** is [generator_spec_v1.json](../../generator_spec_v1.json), the same model as data for a program to read.
> - A **block** usually means one training plan of a fixed length, such as 12 weeks. Inside a session, a block is one part of the day, such as the athletic block or the core block. The **stairway** is his rule that weekly sets climb through a plan, from a starting number to a planned final number. Since CX-02 a week may hold its sets while reps or load progress. Other terms are in the [glossary](../05-reference/glossary.md).
> - Ids with no prefix (`VOL-07`) are round 1, `R2-` is round 2, `R3-` is round 3, `R4-` is round 4. `CT-01` is his clarification on session time and `CX-01` to `CX-04` are his clarifications on progression and editing. **PROPOSED** means the team designed it and he has not confirmed it.
> - Sections 1 to 17 were written on 2026-10-09 and describe the work as it stood then. Where a later step changed the outcome, a line marked **Later** says so. Sections 18 to 26 cover 2026-10-10 and 2026-10-11. For anything that moves (versions, test counts, engine status), read the live file named in the text.

## The steps at a glance

| # | Date | Step | What it left behind |
|---|---|---|---|
| 1 | 2026-10-07 | The coach describes what he wants | [coach_chat_statements.md](../../coach_chat_statements.md) |
| 2 | 2026-10-07 | His two Google Sheets are exported, then every tab is dumped to text | [raw/](../../raw/), [dumps/](../../dumps/), [dump.py](../../dump.py) |
| 3 | 2026-10-07 | First-pass decode of the library, the reference tabs and every program | [analysis/](../../analysis/) |
| 4 | 2026-10-07 to 10-08 | First model documents, each fact-checked against the sheets; master v0 | [synthesis/](../../synthesis/), [BLAZE_CAMP_BRAIN_v0.md](../../BLAZE_CAMP_BRAIN_v0.md), [generator_spec_v0.json](../../generator_spec_v0.json) |
| 5 | 2026-10-08 | Round 1: 140 questions | [coach_answers.md](../../coach_answers.md), [coach_answers_full.md](../../coach_answers_full.md), `answers_raw/` |
| 6 | 2026-10-08 | Model v1, with a check that every answer was applied | [BLAZE_CAMP_BRAIN_v1.md](../../BLAZE_CAMP_BRAIN_v1.md), [coverage_matrix.md](../../coverage_matrix.md) |
| 7 | 2026-10-08 | Round 2: 45 questions, plus 2 left over from round 1 | [coach_answers_round2.md](../../coach_answers_round2.md), `answers_raw_r2/` |
| 8 | 2026-10-08 | Sport expansion: every popular US sport, swimming, pickleball, HYROX | [synthesis/sports/](../../synthesis/sports/), [synthesis/04_profiles.json](../../synthesis/04_profiles.json) |
| 9 | 2026-10-08 | Model v1.1 | [BLAZE_CAMP_BRAIN_v1_1.md](../../BLAZE_CAMP_BRAIN_v1_1.md), [coverage_matrix_round2.md](../../coverage_matrix_round2.md) |
| 10 | 2026-10-08 to 10-09 | The first engine and 8 sample plans | [engine/](../../engine/), [model/](../../model/), [tests/](../../tests/), [samples/](../../samples/) |
| 11 | 2026-10-09 | Round 3: 13 questions | [coach_answers_round3.md](../../coach_answers_round3.md), `answers_raw_r3/` |
| 12 | 2026-10-09 | MIT license and the two disclaimers | [LICENSE](../../LICENSE), [DISCLAIMER.md](../../DISCLAIMER.md), [DISCLAIMER.es.md](../../DISCLAIMER.es.md) |
| 13 | 2026-10-09 | Model v1.2 and the first open-source documents | [BLAZE_CAMP_BRAIN.md](../../BLAZE_CAMP_BRAIN.md), [coverage_matrix_round3.md](../../coverage_matrix_round3.md), [AGENTS.md](../../AGENTS.md), [CONTRIBUTING.md](../../CONTRIBUTING.md) |
| 14 | 2026-10-09 | Engine v0.4: round 3 applied, reviewed again | [samples/REVIEW_LOG.md](../../samples/REVIEW_LOG.md) |
| 15 | 2026-10-09 | Diagnosis of the dosing, and the decision to rebuild it as an optimizer (parked on 2026-10-11, see 23) | [design/](../../design/), [ADR-048](../04-decisions/adr-048-optimizer-rebuild-of-the-planner.md) |
| 16 | 2026-10-08 to 10-09 | Codex research: review guide, then a research brief | [REVIEW_GUIDE.md](../../REVIEW_GUIDE.md), [CODEX_BRIEF.md](../../CODEX_BRIEF.md) |
| 17 | 2026-10-09 | The guidance documents in this `docs/` folder | [workflows/docs_guidance.js](../../workflows/docs_guidance.js) |
| 18 | 2026-10-10 | The planner is designed: three designs, three judges, a specification, a 94-plan benchmark and the engine 0.4 baseline | [design/PLANNER_SPEC.md](../../design/PLANNER_SPEC.md), [design/bench/](../../design/bench/) |
| 19 | 2026-10-09 to 10-10 | The outside model review (Codex) | [reviews/codex-model-review.md](../../reviews/codex-model-review.md) |
| 20 | 2026-10-10 | His clarifications on progression and editing (CX-01..04), a progression reference, and an independent audit of it | [coach_answers_codex_2026-10-10.md](../../coach_answers_codex_2026-10-10.md), [ADR-049](../04-decisions/adr-049-endpoint-priority-and-editable-progression.md), [reviews/claude-codex-audit.md](../../reviews/claude-codex-audit.md) |
| 21 | 2026-10-10 | His clarification on session time (CT-01): no time-fitting | [coach_answers_time_2026-10-10.md](../../coach_answers_time_2026-10-10.md) |
| 22 | 2026-10-10 to 10-11 | Round 4: 20 questions | [coach_answers_round4.md](../../coach_answers_round4.md), `answers_raw_r4/` |
| 23 | 2026-10-11 | The plan for engine 0.5: template-first. The large planner is parked | [design/ENGINE_V05_PLAN.md](../../design/ENGINE_V05_PLAN.md), [ADR-058](../04-decisions/adr-058-engine-v05-template-first-not-the-large-planner.md) |
| 24 | 2026-10-11 | Engine 0.5 is built in four packages | [engine/](../../engine/), [samples/STATUS_v0.5.md](../../samples/STATUS_v0.5.md) |
| 25 | 2026-10-11 | Three coach-eye reviews of the 8 sample plans and two fix rounds | [samples/STATUS_v0.5.md](../../samples/STATUS_v0.5.md) |
| 26 | 2026-10-11 | Model v1.3 and the release documents | [BLAZE_CAMP_BRAIN.md](../../BLAZE_CAMP_BRAIN.md), [MODEL_CARD.md](../../MODEL_CARD.md), [README.md](../../README.md) |

What comes next is on [roadmap.md](roadmap.md).

## 1. The coach describes what he wants (2026-10-07)

**What happened.** He asked for his programming system to be captured so that a tool can take basic information and "kick out" a 6-, 8- or 12-week plan. He later widened the lengths to 4-6 week maintenance, 8, 12 and yearly plans. He named the main thing to understand: the MASTER EXERCISE LIBRARY tab in his "BUILD YOUR OWN PROGRAM" sheet.

**Why it started with the categories.** In his words, "The hardest thing to understand is the categorization of everything" (conversation). He was "building the segmentation and the buckets from the ground up" (conversation), from Dr. Pat Davidson, Dr. Mike Israetel and first principles, not from a packaged program. See [lineage.md](../01-philosophy/lineage.md).

**Where it lives.** His statements in conversation are collected in [coach_chat_statements.md](../../coach_chat_statements.md). The earliest ones are also at the top of [coach_answers.md](../../coach_answers.md).

## 2. Two Google Sheets exported and dumped (2026-10-07)

**What happened.** His two workbooks were exported as Excel files. A **workbook** is one Google Sheets file. A **tab** is one sheet inside it.

| Workbook | Short name | Tabs | Export |
|---|---|---|---|
| "BUILD YOUR OWN PROGRAM - BLAZE CAMP MODEL" | BYOP | 12 | [raw/BYOP.xlsx](../../raw/BYOP.xlsx) |
| "BLAZE CAMP MASTER MODEL" | MASTER MODEL (MM) | 22 | [raw/MASTER_MODEL.xlsx](../../raw/MASTER_MODEL.xlsx) |

Then a small script, [dump.py](../../dump.py), wrote every tab as plain text. This is a **dump**. Each tab gets two files: one read row by row, one read column by column. The dump keeps the cell address, the value, the fill colour, bold text, merged cells, links and the dropdown sources.

**Why colours and dropdowns were kept.** He colour-codes levels and categories, and his program tabs pick exercises from dropdowns that point at the library. Without those two things a tab cannot be read the way he reads it.

**The sheets were never changed.** The export is a copy. No Google Sheet was opened for writing at any step. The spec records this as `_meta.google_sheets_modified: false`.

**Where it lives.** [raw/](../../raw/), [dumps/BYOP/](../../dumps/BYOP/), [dumps/MASTER_MODEL/](../../dumps/MASTER_MODEL/). Every tab is described on [source-sheets.md](source-sheets.md).

## 3. First-pass decode (2026-10-07)

**What happened.** Two workflows read the dumps. **Decode** here means: turn a tab into structured notes and data, and mark each fact as read from the sheet or reasoned by the reader.

| Workflow | Decoders | What they read | Output |
|---|---|---|---|
| Library and programs | 14 | The library in four column ranges, three groups of reference tabs, seven groups of program tabs | [analysis/library/](../../analysis/library/), [analysis/reference/](../../analysis/reference/), [analysis/programs/](../../analysis/programs/) |
| Equipment and training variables | 6 | The equipment each exercise needs, the equipment order inside each session, the variables in the reference tabs, and the exercise order in every session | [analysis/equipment/](../../analysis/equipment/) |

Each decoder had to quote his labels exactly, typos included, and to mark every fact **OBSERVED** (read from a cell) or **INFERRED** (the reader's reasoning). Those two words are the first of the evidence labels explained in [method.md](method.md).

**What it found that matters later.**

- His program tabs are built from **slots**. A slot is one row with a purpose, a category and a dropdown into one library column. He programs by slot, not by exercise.
- Google Sheets had turned some typed text into dates. "10/10" (10 reps each side) and "5-10-5" (an agility drill) are stored as dates. The model stores reps and drill names as text.
- The order audit covered 466 sessions and tested his stated order rules against his own sheets. Some held everywhere and some did not. That produced round-1 questions such as ORD-01.
- The two hidden 'NO ACCESS' tabs had a dropdown pointing at the wrong library column. That became question FIX-01.

**Where it lives.** One notes file and one data file per decoder, all in [analysis/](../../analysis/). The slot map is [analysis/library/L4_slot_wiring.md](../../analysis/library/L4_slot_wiring.md). The order audit is [analysis/equipment/ordering_audit.md](../../analysis/equipment/ordering_audit.md).

## 4. First model documents and fact-checking (2026-10-07 to 2026-10-08)

**What happened.** Writers turned the decode into model documents, one topic each. Each document was then handed to a second agent whose only job was to find errors in it. This is the **adversarial fact-check**: the checker assumes the document is wrong, re-reads the raw dumps, recomputes key numbers on its own, fixes the file in place and adds a "Verification log" section at the end.

| File in [synthesis/](../../synthesis/) | Topic |
|---|---|
| `01_taxonomy` | How exercises are categorized |
| `02_exercise_catalog` | One merged exercise list, with every source cell |
| `03_volume_dosing` | Sets, reps, effort, rest |
| `04_athlete_profiles` | What each kind of athlete and goal needs |
| `05_session_architecture` | Session and week templates |
| `06_periodization` | Plan lengths and progression |
| `07_science_lineage` | Where each idea comes from |
| `10_equipment_model`, `10b_equipment_variables_science` | Equipment, who gets machines, substitutions |
| `11_training_variables` | Load, speed, range of motion, order, variation |
| `08_open_questions_for_coach`, `09_generator_inputs` | What only he could answer, and a first intake form |

A last agent assembled the first master document and the first machine-readable spec. Both are kept as archives: [BLAZE_CAMP_BRAIN_v0.md](../../BLAZE_CAMP_BRAIN_v0.md) and [generator_spec_v0.json](../../generator_spec_v0.json).

**Why v0 was not trusted.** It was the team's reading of his sheets. Many of its rules were guesses. Round 1 showed it: the master lists the 24 changes that moved the generator most ([BLAZE_CAMP_BRAIN.md](../../BLAZE_CAMP_BRAIN.md) §0.2).

## 5. Round 1: 140 questions (2026-10-08)

**What happened.** The team put 140 questions on one web page, [coach-questions.html](../../coach-questions.html). Each question showed what the team assumed. He tapped a chip ('That's right', 'Partly', 'Not right' or 'Skip / not sure') and dictated his answer where he had more to say. The answer files show the chips as RIGHT, PARTLY, NOT RIGHT and SKIP/NOT SURE. RIGHT with no words means the assumption became his rule.

| Section | Topic | Questions |
|---|---|---|
| CAT | How you categorize | 13 |
| UNI | Bilateral vs unilateral volume | 12 |
| VOL | Volume and dosing | 18 |
| PER | Progression and periodization | 11 |
| ATH | Athletes and sports | 13 |
| ORD | Session structure and order | 11 |
| EQ | Equipment | 16 |
| GEN | The generator | 8 |
| LIB | Library details | 22 |
| PRG | Program tabs | 12 |
| FIX | Sheet fixes | 4 |
| | **Total** | **140** |

| His verdict | Count |
|---|---|
| RIGHT | 84 |
| PARTLY | 18 |
| NOT RIGHT | 4 |
| Answered in words, no chip | 30 |
| Skipped | 2 (PRG-01, FIX-01) |
| Not answered | 2 (LIB-10, LIB-12) |

The first nine answers (CAT-01 to CAT-09) arrived first and are in [coach_answers.md](../../coach_answers.md). The full set is in [coach_answers_full.md](../../coach_answers_full.md). The four skipped or unanswered questions were answered in round 2.

**What it changed most.**

| Before (team's reading) | After (his rule) | Id |
|---|---|---|
| The weekly increase is sized by muscle size | "It doesn't really go by muscle". It is about the person | VOL-05 |
| Helper muscles count half a set | Helpers count a quarter of a set | VOL-09 |
| Core after the power block, for athletes | Core first, for everyone, and movable | ATH-11 |
| Bands, chains and weight releasers in the menus | None: "I don't do bands." | EQ-01, EQ-12 |
| Machines ranked, hack squat last | Machines are not ranked | EQ-11 |
| 6, 8 and 12-week plans with deload weeks inside | 4-6 weeks is maintenance; 12 weeks is his preferred plan | PER-01 |
| Sex on the intake form | Removed | GEN-02 |
| Olympic lifts for intermediate and up | Everyone in athletic training | ATH-10 |

Later rounds changed some of these again. The full trail is in [changes-across-rounds.md](../03-coach-answers/changes-across-rounds.md).

**Why he was asked instead of the sheets.** His sheets hold things he did not mean. On missing calf and rear-delt sets he said, "It wasn't intentional." (VOL-17). So an answer beats a cell. See [method.md](method.md).

## 6. Model v1 (2026-10-08)

**What happened.** A workflow folded the round-1 answers into every model document. Each update was checked by a second agent against the answer file. Two new documents were researched because he asked the team to propose:

| New file | Why it was written | His words |
|---|---|---|
| [synthesis/12_volume_algorithm_v1.md](../../synthesis/12_volume_algorithm_v1.md) | He wanted his set numbers matched against published charts | "You should probably go and find some charts out there that can show those averages and also match them with what my experience is." (VOL-01) |
| [synthesis/13_product_options.md](../../synthesis/13_product_options.md) | He had not decided what the output should be | "I think that you should be able to give me some ideas." (GEN-03) |

Then the master was rebuilt as v1 and a **coverage audit** traced every answered question to a section of the master and a key in the spec.

| Coverage audit, round 1 | Count |
|---|---|
| Answers traced | 138 |
| Already right in both files | 106 |
| Fixed during the audit | 32 (3 were wrong, 29 were missing or incomplete) |

**Where it lives.** [coverage_matrix.md](../../coverage_matrix.md). The 45 questions for round 2 were drafted in the same step: [round2_questions.json](../../round2_questions.json).

## 7. Round 2: 45 questions (2026-10-08)

**What happened.** Round 2 asked him to approve or fix the team's proposals, mostly numbers. It also re-asked the two round-1 leftovers.

| Section | Topic | Questions |
|---|---|---|
| R2-VOL | Your volume math: approve or fix | 8 |
| R2-SES | Sessions and weeks | 6 |
| R2-ATH | Athletes | 8 |
| R2-LIB | Library, levels and zones | 8 |
| R2-PER | Plans, the year and testing | 7 |
| R2-GEN | The generator and the product | 8 |
| | **Total** | **45** (+ LIB-10 and LIB-12) |

| His verdict (47 answers) | Count |
|---|---|
| RIGHT | 38 (18 of them with added words) |
| PARTLY | 3 |
| NOT RIGHT | 2 (R2-PER-03, R2-GEN-04) |
| Answered in words, no chip | 4 (one of them, R2-VOL-08, he did not understand) |

**What it changed most.**

| His rule | His words | Id |
|---|---|---|
| Every plan is a stairway | "That's how every program should be. It should be like steps up a stairway." | R2-PER-03 |
| No deload inside a block | "It should never be thrown in the middle of a block." | R2-VOL-07 |
| A floor of 10 sets | "I don't think anybody needs less than 10 sets a week per muscle" | R2-VOL-06 |
| 2 to 4 exercises per muscle on full-body days, never 1 | "there's never one exercise, so from 2 all the way to 4" | R2-SES-05 |
| No sleep or stress questions | "I just need the workouts here." | R2-GEN-04 |
| Kettlebell swings are not glute sets | "kettlebell swings are not glutes" | R2-VOL-05 |
| Test before a block and at its end, not in the middle | "they should not test during the weeks, during the block" | R2-PER-07 |

He also approved the product path (a phone-friendly website first, then open source, R2-GEN-02) and named the sample plans he would grade (R2-GEN-07).

## 8. Sport expansion (2026-10-08)

**What happened.** On the same day he asked, in conversation, for wider coverage. For athletes: "all of the different popular sports in the United States", and "include swimming as well." For the general population: pickleball ("very popular right now") and HYROX, a fitness race of eight 1 km runs, each followed by a workout station. He confirmed in round 3 that HYROX was what he meant (R3-ATH-03).

Four research agents each took one group of sports. Their work was merged into the profile file and checked for coverage.

| Research group | File in [synthesis/sports/](../../synthesis/sports/) |
|---|---|
| Team field and court sports | `team.md` / `.json` |
| Swimming, aquatic, endurance and track | `aquatic-endurance-track.md` / `.json` |
| Combat, strength and fitness sports | `combat-strength-fitness.md` / `.json` |
| General population: stay athletic and active | `genpop-active.md` / `.json` |

| Result in [synthesis/04_profiles.json](../../synthesis/04_profiles.json) | Count |
|---|---|
| Profiles | 127 (93 competitive, 31 recreational, 3 goal) |
| Sports in the picker | 52 |
| "Stay athletic and active" activities | 26 |

**What he confirmed and what he did not.** The plyometric shares for the sports he ranked were approved in round 2 (R2-ATH-01). The defaults for the sports he had not named were PROPOSED until he approved them in round 3 (R3-ATH-01 to R3-ATH-05). Many finer numbers inside the profiles are still PROPOSED. [sports.md](../02-model/sports.md) marks which is which. The decision record is [ADR-041](../04-decisions/adr-041-every-sport-and-stay-athletic.md).

## 9. Model v1.1 (2026-10-08)

**What happened.** The round-2 answers and the sport profiles went into the model documents, with the same update-then-check pattern. The master became v1.1 and the spec 1.1.0. The second coverage matrix traced all 47 answers plus his sport request. No row was left missing. Thirteen questions for round 3 were drafted: [round3_questions.json](../../round3_questions.json).

**Where it lives.** [coverage_matrix_round2.md](../../coverage_matrix_round2.md). The v1.1 master is archived as [BLAZE_CAMP_BRAIN_v1_1.md](../../BLAZE_CAMP_BRAIN_v1_1.md).

## 10. The first engine and 8 sample plans (2026-10-08 to 2026-10-09)

**What happened.** The team called this "Phase 0". The **engine** is the code that turns one person's answers (the **intake**) into a plan. It reads a **compiled model**: the rule tables, the exercise catalog, the templates and the sport profiles packed into the files in [model/](../../model/).

| Stage | What was built |
|---|---|
| Contracts | One architect agent fixed the file layout and the data shapes: [engine/CONTRACTS.md](../../engine/CONTRACTS.md) |
| Build | Four builder agents in parallel: the model compiler, intake and volume, week layout and exercise selection, checks and printing |
| Integrate | The parts were joined, tested, and the first sample plans generated |
| Review | One coach-eye reviewer per sample plan |
| Fix | Fixes went into the engine and the rules, never into a plan by hand. Each fix got a test |

The eight sample clients are the seven he chose in R2-GEN-07 plus one bonus: swimming, football, soccer, a CrossFit-style bootcamp, a bootcamp, full-body aesthetics, push/pull/legs, and a 52-year-old pickleball player. Their intakes are in [samples/intakes/](../../samples/intakes/).

| Review of the sample plans (AI coach-eye reviewers) | Result |
|---|---|
| First plans (engine 0.2.0) | All eight graded D. 151 issues: 17 blockers, 68 majors, 66 minors |
| After the first fix round (engine 0.3.0) | 97 fixed, 36 partly fixed, 18 deferred |
| Re-check of the 0.3.0 plans | Grades from C to D. 136 issues still open |

**What worked.** The engine produced a complete plan for any intake, the same plan every time for the same answers, in English or Spanish, with a recorded reason for each decision.

**What did not.** The structure of the plans was right. The **dosing** was not. Dosing means how many sets go to which exercise, on which day, in which week. Section 15 explains why.

**Where it lives.** [engine/README.md](../../engine/README.md), [engine/DECISIONS.md](../../engine/DECISIONS.md), [samples/REVIEW_LOG.md](../../samples/REVIEW_LOG.md), [samples/RECHECK_v0.3.md](../../samples/RECHECK_v0.3.md).

## 11. Round 3: 13 questions (2026-10-09)

**What happened.** Round 3 was short. It asked for the last numbers and for the biggest open decision: what gives when a person's time cannot hold his minimums.

| Section | Topic | Questions |
|---|---|---|
| R3-VOL | Your volume math: the last four numbers | 4 |
| R3-SES | Sessions | 2 |
| R3-PER | Blocks and the calendar | 1 |
| R3-ATH | Athletes, swimming and staying athletic | 5 |
| R3-GEN | Launch | 1 |
| | **Total** | **13** |

His verdicts: 12 RIGHT (6 of them with added words) and 1 PARTLY (R3-VOL-01). Nothing was skipped.

**What it changed most.** Round 3 made the product much simpler than round 2 had left it.

| His rule | His words | Id | Record |
|---|---|---|---|
| No check-ins, no tracking | "We're only doing outputs, and people can change accordingly." | R3-VOL-02 | [ADR-001](../04-decisions/adr-001-answers-in-plan-out-no-check-ins.md) |
| The whole plan, once, with few inputs | "I want this to be very simple." | R3-VOL-04 | [ADR-001](../04-decisions/adr-001-answers-in-plan-out-no-check-ins.md) |
| No data kept | "I don't want any data kept." | R3-GEN-01 | [ADR-002](../04-decisions/adr-002-no-data-kept.md) |
| The stairway approved in numbers | (RIGHT, with the words above) | R3-VOL-04 | [ADR-022](../04-decisions/adr-022-every-plan-is-a-stairway.md) |
| When time is short: say so, train fewer groups, recommend supersets, keep climbing. **Later:** the time-fit parts were retired by CT-01 and round 4 (sections 21 and 22). Supersets and switches stand | "Recommend doing supersets so that it's a faster workout" | R3-SES-02 | [ADR-032](../04-decisions/adr-032-time-vs-minimums-order.md) |
| Users can switch off a day's athletic or core block, and add or remove exercises | "an athlete or a coach should be able to modify accordingly" | R3-SES-02 | [ADR-005](../04-decisions/adr-005-editable-plan-switches-and-supersets.md) |
| Focus muscle 1 and 2 | "There could be a main focus muscle 1 and a main focus muscle 2, and that should be enough for the whole thing." | R3-SES-01 | [ADR-024](../04-decisions/adr-024-focus-muscle-1-and-2.md) |
| Rear delts are part of shoulders | "I wouldn't categorize the rear delt as an individual muscle" | R3-VOL-01 | [ADR-018](../04-decisions/adr-018-rear-delts-part-of-shoulders.md) |
| The easy week after a block is optional | "maintenance weeks are a recommendation." | R3-PER-01 | [ADR-043](../04-decisions/adr-043-no-deload-inside-a-block.md) |

The weekly check-in he had approved in round 2 (R2-GEN-01) was retired by these answers. So was the logbook. With no data kept, the team also dropped accounts and any learning from users' data. That last part is the team's reading of "I don't want any data kept" (R3-GEN-01). In round 1 he had said the tool would one day learn "from the data of all the people that use it" (VOL-01), so whether learning is off for good is still a question for him ([roadmap.md](roadmap.md)).

## 12. MIT license and disclaimers (2026-10-09)

**What happened.** In the same round-3 answer he set the license and the liability terms. The files were written that day.

| File | What it is | Status |
|---|---|---|
| [LICENSE](../../LICENSE) | MIT license. Copyright (c) 2026 Lalo Vera, doing business as Blaze Camp, and BFit Studios Corp. (a Florida corporation) | In place |
| [DISCLAIMER.md](../../DISCLAIMER.md) | Not medical advice, use at your own risk, no warranty, release of liability, what coaches and gyms must have of their own | **Draft.** Needs review by a licensed Florida attorney |
| [DISCLAIMER.es.md](../../DISCLAIMER.es.md) | The same in Spanish | **Draft.** Needs the same review |

**Why MIT, and why two languages.** His words: "it should be MIT to me so that the repo has that license to me." (R3-GEN-01). On the people who use it for clients: "you should have your own liability release" (R3-GEN-01). On Spanish: "it should be translated as legally equivalent as possible in English and Spanish." (R3-GEN-01).

**What it replaced.** In round 2 the team had proposed Apache for the code and CC BY for the model, and he had marked the whole proposal RIGHT (R2-GEN-02). MIT for everything replaced that. The record is [ADR-009](../04-decisions/adr-009-mit-license-and-disclaimers.md).

## 13. Model v1.2 and the first open-source documents (2026-10-09)

**What happened.** The round-3 answers went into the model documents that they touched (03, 04, 05, 06, 11, 12 and 13), each update checked by a second agent. The master became v1.2 and the spec 1.2.0. The third coverage matrix traced the 13 answers in 26 rows, because several answers had more than one part.

Two agents wrote the documents that make the repo usable by others:

| File | For whom |
|---|---|
| [AGENTS.md](../../AGENTS.md), [llms.txt](../../llms.txt) | AI agents and developers: where every kind of rule lives |
| [CONTRIBUTING.md](../../CONTRIBUTING.md) | Anyone proposing a change |
| [docs/adding-exercises.md](../adding-exercises.md), [adding-exercises.es.md](../adding-exercises.es.md) | Coaches and developers adding or varying an exercise |

**Why.** He wants people to be able to add and create exercises, with the repo explaining how, and he wants AI agents to be able to read it and build on it (conversation). The goal he stated is a model that is free "for anybody to use in their own app and their own training." (conversation).

**Where it lives.** [coverage_matrix_round3.md](../../coverage_matrix_round3.md). What round 3 changed is listed in [BLAZE_CAMP_BRAIN.md](../../BLAZE_CAMP_BRAIN.md) §0c.

## 14. Engine v0.4 (2026-10-09)

**What happened.** The engine was changed to follow round 3: no check-ins, a time check before the plan is built, Focus muscles, blocks that can be switched off, and superset recommendations. The work ran in ownership stages so that agents did not edit the same files.

| Stage | Area |
|---|---|
| B1 | Time, volume and structure |
| B2 | Athletic work (jumps, throws, Olympic lifts) |
| B3 | Exercise selection, variation between blocks, and the printed plan |
| B4 | Integration, plus a sweep of 1,500 random intakes, every sport and every activity |
| Review 1 | Coach-eye reviewers graded the eight plans again: C- to D |
| Fix round 1 (F1, F2, F3) | The blockers and majors of that review, by the same three areas |
| Review 2 | Coach-eye reviewers graded the fixed plans: D to B- |
| Fix round 2 (F1, F2, F3) | The same three areas again. Finished on 2026-10-10 |

**The warning sign.** After the integration stage and after each fix, no error-level check failed on any of the 1,578 swept intakes. The reviewers still graded the dosing poorly. Passing the engine's own checks did not mean a plan the coach would sign.

**Where it lives.** [samples/REVIEW_LOG.md](../../samples/REVIEW_LOG.md) lists every issue and its fix. [engine/DECISIONS.md](../../engine/DECISIONS.md) records each judgement call.

**Later.** Engine 0.4 was committed on 2026-10-10 with 1,035 tests passing (commit `04637ed`, which is still `main`). Its sample plans were time-fitted plans. Engine 0.5 replaced them on 2026-10-11 (section 24).

## 15. Why the dosing was to be rebuilt as an optimizer (2026-10-09)

> **Later.** This decision was replaced on 2026-10-11. The diagnosis below is still correct for engine 0.4. But several of its causes come from fitting plans into minutes (the places that cut for time, the day's shape fixed before the minutes were known, groups kept or dropped by trial), and the coach removed that requirement (CT-01, section 21). The optimizer was designed (section 18) and then parked (section 23). Engine 0.5 solved the dosing with his templates instead (section 24).

**The decision (as taken on 2026-10-09).** The part of the engine that decides the dose is being rebuilt. The coach's rules do not change. Only the way the tool satisfies them does. An **optimizer** looks at all the plans that obey the rules and picks the best one by a fixed order of priorities. This is a team decision. Nothing here has been put to the coach as a question yet.

**Why, in his words.** He asked for "the best mathematical, logical algorithms possible to make sure this is top of the line. Spare no expense." (conversation). In round 1 he said the tool, not the person, must work out the numbers: "This would be the most advanced algorithm for training for humans that has ever been created." (VOL-06). And: "we should make sure our mathematical algorithm for rep rises, set rises, and volume adaptations is equal and sound for every different model of athlete, level, and everything." (PRG-06).

**What was measured.** A diagnosis ran the engine on the eight sample intakes and measured the plans against his rules.

| Rule or expectation | Source | What the plans did |
|---|---|---|
| A trained group gets at least 10 sets a week (the **floor**) | R2-VOL-06, R3-SES-02 | 4 of 8 plans trained a group below the floor for the whole block |
| Every plan climbs like a stairway, never flat on what is trained | R2-PER-03, R3-SES-02 | 59 to 85 % of the week-to-week steps of trained groups added no set |
| The session fits the minutes the person chose | Team's reading of R3-SES-02. He also said a full-body day "might be a little longer day" (R2-SES-05), so how strict this is stays open | Days ran over. Example: 16 of 48 full-body aesthetics days were over their 75 minutes |
| About 5 exercises at 45 minutes, 8 to 9 at 75 to 90 | VOL-08 | Full-body days had no working limit: 10 to 12 resistance exercises in 75 minutes |
| Athletic work follows the sport | ATH-01 and R2-ATH-01 for the rule. The weekly jump targets in the sport profiles are PROPOSED | Soccer got 16 to 20 % of its jump target |
| More time should never mean less training | Team's own test, not a coach rule | In a sweep of 105 plans, adding minutes or a day removed a group that less time had trained, 22 times |

**The causes, in plain words.**

1. The engine works in steps, one after another. Layout, exercise choice, volume, athletic work and dose each decide part of the plan without seeing the others.
2. Four separate places cut for time, each with its own order.
3. The shape of each day is fixed before the minutes are known.
4. Which groups to keep is found by trial, so the answer depends on the order tried.
5. The stairway is planned by one calculation, placed by another and checked by a third.
6. Sets are whole numbers. A group with 2 or 3 sets to add over 11 weeks must stand still in most weeks. "Never flat" cannot hold in sets alone.
7. Where two of his rules pull against each other, there was no fixed order of priority. Each fix round re-ranked them.
8. The checks were patched together with the engine, so they agreed with it.

Each round of fixes solved the last review's problem and moved another. Example: the swimmer's directly trained groups were hips, back and shoulders after one stage, and quads, hips and back after the next.

**What the new planner must do.** Decide the whole block together. Follow his priorities in a fixed order. Use exact checks, so a group is dropped only when no plan can fit it. Count in one unit. Compute the "add a day" and "longer session" offers by actually solving them. Be scored by a checker that is separate from the planner. All of this stays plain JavaScript that runs in a browser and gives the same plan for the same answers.

**Where it lives.** [design/diagnosis.md](../../design/diagnosis.md) (measurements and causes), [design/algorithm_research.md](../../design/algorithm_research.md) (methods studied), [design/rules_as_constraints.md](../../design/rules_as_constraints.md) (every rule written as a constraint, with its source). The decision record is [ADR-048](../04-decisions/adr-048-optimizer-rebuild-of-the-planner.md). The next steps are on [roadmap.md](roadmap.md).

## 16. Codex research (2026-10-08 and 2026-10-09)

**What happened.** Codex is an outside AI agent used as an independent reviewer. Two files brief it.

| File | Date | What it asks |
|---|---|---|
| [REVIEW_GUIDE.md](../../REVIEW_GUIDE.md) | 2026-10-08 | Find errors, gaps and contradictions. Check that answers are applied and that retired ideas are gone. Do not rewrite the model |
| [CODEX_BRIEF.md](../../CODEX_BRIEF.md) | 2026-10-09 | Two research jobs: back up the science of each major rule, and find what the model is missing compared with other models and open exercise databases |

**Why.** These are the two things he asked reviewers to research: data to back up the science of the model, and exercises or anything else it might be missing (conversation).

**The rule for reviewers.** A coach answer that a reviewer disagrees with is not an error. It goes on a list "for discussion with the coach" and the rule stays as he set it.

**Status on 2026-10-09.** A first review existed on the git branch `review/codex`, in `reviews/codex-model-review.md`. It was not merged into `main`. The two reports the brief asks for (`reviews/codex-science.md` and `reviews/codex-gaps.md`) were not written yet.

**Later.** The review was finished on 2026-10-10 and merged into the working branch (section 19). The brief was updated for model v1.3 on 2026-10-11.

## 17. The guidance documents (2026-10-09)

**What happened.** The request was for folders that explain the context of the whole project and everything the coach answered, as guidance about the model. (It was made in the working session of 2026-10-09 and is not recorded in an answer file.) One workflow, [workflows/docs_guidance.js](../../workflows/docs_guidance.js), assigned one folder to each writer. Each folder was then fact-checked against his answers, newest round first.

| Folder | What it holds |
|---|---|
| [00-overview](../00-overview/) | What this is, for coaches and for developers |
| [01-philosophy](../01-philosophy/) | His principles and how he thinks |
| [02-model](../02-model/) | Plain-language guides to each part of the model |
| [03-coach-answers](../03-coach-answers/) | Everything he answered, by topic |
| [04-decisions](../04-decisions/) | One short record per decision |
| [05-reference](../05-reference/) | Glossary, parameters, data dictionary, FAQ |
| `06-history` | This folder |

## 18. The planner is designed (2026-10-10)

**What happened.** The optimizer planner of section 15 was designed in full, on paper.

| Step | What it produced |
|---|---|
| Three designs | A two-stage design, a template-parametric design and a mixed-integer design: [design/design_two-stage.md](../../design/design_two-stage.md), [design_template-parametric.md](../../design/design_template-parametric.md), [design_milp.md](../../design/design_milp.md) |
| Three judges | Each scored the three designs. All three chose the two-stage design: `design/judge_1.md`, `judge_2.md`, `judge_3.md` |
| A specification | [design/PLANNER_SPEC.md](../../design/PLANNER_SPEC.md) ("planner/1") and [design/IMPLEMENTATION_PLAN.md](../../design/IMPLEMENTATION_PLAN.md) |
| A benchmark | 94 test intakes, a scorer written separately from the engine, and the first measured run of engine 0.4: [design/bench/](../../design/bench/), [BASELINE.md](../../design/bench/BASELINE.md) |

**What the baseline showed.** Engine 0.4 scored a mean of about 64 out of 100 over 102 plans (the 94 intakes and the 8 samples), with 2,228 hard-rule violations. One plan passed every row. The engine's own validation said all 102 were fine. That gap is why the scorer is kept separate from the engine.

**Later.** The planner was never built (section 23). The benchmark was kept and is in use. Its scorer lost every metric about minutes.

## 19. The outside model review (2026-10-09 to 2026-10-10)

**What happened.** Codex, the outside reviewer of section 16, delivered a review of the model's foundation: [reviews/codex-model-review.md](../../reviews/codex-model-review.md). It read the master document v1.2, the spec and `synthesis/`, and left the engine out. It is a narrative review of the evidence, not a trial.

**What it said, in short.** Keep the foundation. The work to do is calibration and clarification, not a redesign. Its appendices propose a mathematical contract, precise library and coverage upgrades, and gates for publication.

**The rule for its findings.** A change that goes against one of the coach's answers is "for discussion with the coach". It is not applied.

**What was taken from it.** Round 4 then put points that were open at that time to the coach, among them the mid-range pull category and what to do with video links that are not his. The record fixes in its Appendix F1 were applied in engine 0.5. The review was merged into the working branch on 2026-10-10.

## 20. His clarifications on progression and editing: CX-01 to CX-04 (2026-10-10)

**What happened.** In the Codex conversation that reviewed this repository, he answered three questions about the stairway and added an explanation of what the product is. The answers are recorded in [coach_answers_codex_2026-10-10.md](../../coach_answers_codex_2026-10-10.md).

| His rule | His words | Id |
|---|---|---|
| Reach the planned final sets, even if the weekly steps must be bigger | "go ahead and increase faster if thats the need, they could edit accordingly" | CX-01 |
| A week may keep the same sets while reps or load progress | "yes but also should be editable if they want to adjust their sets on that week or that day" | CX-02 |
| At the top number, sets stay and reps or load progress | "yes but they should be able to edit accordingly" | CX-03 |
| The output is a template that people can edit in full | "it should be all editable as they need to" | CX-04 |

**What it replaced.** The limits of 7% per muscle and under 10% in total per week, and the reading that sets must rise every week. The record is [ADR-049](../04-decisions/adr-049-endpoint-priority-and-editable-progression.md).

**The progression reference and its audit.** Codex then wrote the stairway arithmetic as a small, separate reference with its own tests. An independent audit by Claude checked it against its own calculations: [reviews/claude-codex-audit.md](../../reviews/claude-codex-audit.md). The audit found the arithmetic sound, listed six defects that were fixable, and said plainly that it was a kernel and not a planner. On that day 1,139 tests passed.

**Later.** The kernel moved into `engine/progression/` with the audit's fixes and now drives the stairway of engine 0.5 (section 24).

## 21. His clarification on session time: CT-01 (2026-10-10)

**What happened.** He told the team to stop fitting plans to time. The answer is recorded in [coach_answers_time_2026-10-10.md](../../coach_answers_time_2026-10-10.md).

> "You need to stop trying to be responsible for the people's time." (CT-01)

> "I want you to not get complicated over the time." (CT-01)

| Before | After | 
|---|---|
| The person chose a session length and the plan had to fit it | The plan is sized by the number of exercises per session |
| Exercises and whole muscle groups were cut when time ran out | Nothing is cut because of time |
| A day over its minutes was a violation | A day prints an average time as information only |
| The planner had to decide which groups to train "directly" | The template comes out complete, and the person edits it |

**Why this was the turning point.** The time check was the hardest part of engine 0.4 and of the planner design, and much of the trouble described in sections 14 and 15 traced back to it. With it gone, a much simpler engine could follow his templates directly. The record is [ADR-050](../04-decisions/adr-050-no-time-fitting-sessions-sized-by-exercise-count.md).

## 22. Round 4: 20 questions (2026-10-10 to 2026-10-11)

**What happened.** Round 4 asked what CT-01 left open and what a release needed. He answered late on 2026-10-10 local time. The answer file is dated 2026-10-11.

| Section | Topic | Questions |
|---|---|---|
| R4-SES | Session size, now that time-fitting is gone | 5 |
| R4-PRG | Progression | 4 |
| R4-LIB | Library | 5 |
| R4-SCP | Who it is for, and safety | 3 |
| R4-REL | Release | 3 |
| | **Total** | **20** |

His verdicts: 15 RIGHT (9 of them with added words), 4 PARTLY (R4-SES-04, R4-SCP-02, R4-REL-02, R4-REL-03) and 1 NOT RIGHT (R4-SES-05). Nothing was skipped.

**What it changed most.**

| His rule | His words | Id | Record |
|---|---|---|---|
| The form no longer asks how long a session is | "Drop it. We don't need it." | R4-SES-01 | [ADR-050](../04-decisions/adr-050-no-time-fitting-sessions-sized-by-exercise-count.md) |
| Sessions are sized by exercise count, as a recommendation | "These are templates that we're giving them for them to add or take away" | R4-SES-02 | [ADR-050](../04-decisions/adr-050-no-time-fitting-sessions-sized-by-exercise-count.md) |
| Full-body days are his A day and B day, about 6 exercises each | "Day A: back, quads, and biceps. It's going to be more pull- and knee-dominant movements." | R4-SES-05 | [ADR-051](../04-decisions/adr-051-coach-templates-are-the-skeleton.md) |
| On 2 days, every big group is trained with fewer sets | "People can add or remove or adjust accordingly." | R4-SES-03 | [ADR-052](../04-decisions/adr-052-two-day-rule.md) |
| The person decides what to leave out | "they get to pick what they want to keep or what they want to take away" | R4-SES-04 | [ADR-050](../04-decisions/adr-050-no-time-fitting-sessions-sized-by-exercise-count.md) |
| Reps and load are a rule the person applies | (RIGHT, no words) | R4-PRG-03 | [ADR-053](../04-decisions/adr-053-progression-written-as-a-rule.md) |
| Proposed exercises are optional, never primary | "I don't want to make them primary exercises." | R4-LIB-01 | [ADR-054](../04-decisions/adr-054-proposed-exercises-are-optional-add-ons.md) |
| Incline pressing before overhead pressing; a mid-range pull category | "ideally we want to prioritize incline for the pushing instead of overhead pressing" | R4-LIB-03 | [ADR-055](../04-decisions/adr-055-incline-preference-and-mid-range-pull.md) |
| No third-party video links; a name to copy into YouTube | "Click here to copy it and put into YouTube." | R4-LIB-05 | [ADR-008](../04-decisions/adr-008-videos-optional.md) |
| The release must be accepted before a plan shows | "they need to click it before the plan shows" | R4-SCP-02 | [ADR-056](../04-decisions/adr-056-liability-gate-before-every-plan.md) |
| Each sport profile says how sure it is | (RIGHT, no words) | R4-SCP-03 | [ADR-057](../04-decisions/adr-057-sport-profile-confidence-labels.md) |
| The repo credits him as author and owner | "a complete coaching model from the experience of Coach Lalo, who is Gerardo Vera." | R4-REL-03 | [MODEL_CARD.md](../../MODEL_CARD.md) |
| Build the engine now | "I think you can try to build it now." | R4-REL-02 | [ADR-058](../04-decisions/adr-058-engine-v05-template-first-not-the-large-planner.md) |

**Two answers changed what earlier ones had said.** In round 2 he had said every muscle gets 2 to 4 exercises on a full-body day, never 1 (R2-SES-05). His A and B days give some muscles one exercise, and round 4 makes those days the rule. And he had said of the risk tick "it doesn't matter if they click it; it comes out". Round 4 makes the tick required (R4-SCP-02).

## 23. The plan for engine 0.5, and the planner parked (2026-10-11)

**The decision.** Build engine 0.5 around his templates, with no time-fitting. Do not build the large planner. This is a team decision that follows his answers. The plan is [design/ENGINE_V05_PLAN.md](../../design/ENGINE_V05_PLAN.md) and the record is [ADR-058](../04-decisions/adr-058-engine-v05-template-first-not-the-large-planner.md).

**Why.** The plan says it in one line: most of the planner's difficulty came from fitting plans into session minutes, and he removed that requirement. He also asked for the engine now: "I think you can try to build it now." (R4-REL-02)

| From the planner work | What happened to it |
|---|---|
| The specification and the three designs | Kept in `design/` as research. Not built |
| The stairway arithmetic | Moved into the engine, with the audit's fixes |
| The benchmark and its scorer | Kept and used. The time metrics were deleted |
| The order of priorities for short sessions | Not needed. Nothing is cut for time |

**What "done" means in the plan.** No time-based behaviour anywhere. The A/B, push / pull / legs and other templates match his. Every trained group meets its target and its progression rule. The hard rules hold in every benchmark plan. Every sample plan grades B+ or better. The tests pass.

## 24. Engine 0.5 (2026-10-11)

**What happened.** Four work packages ran one after another, each with one owner.

| Package | What it did |
|---|---|
| V1 Structure and volume | Removed time-fitting everywhere. Built days from his templates with his exercise counts. Added the 2-day rule. Drove weekly sets per group through the progression kernel so the final sets are reached. Added plan edits |
| V2 Library and selection | Made the proposed exercises optional add-ons. Dosed carries and sleds by distance or time. Added the mid-range pull and the incline preference. Gave every swap a "keeps and loses" line. Replaced third-party video links with a YouTube search by name. Added the confidence label to every sport profile |
| V3 Words and checks | Added the liability gate and the printed release line. Wrote progression as a rule. Added the note for a week that adds more than about 15%. Printed time as an estimate. Rewrote the validator and the scorer with no time metric |
| V4 Integrate | Ran everything from clean, read the 8 plans against his sheets and fixed what was wrong: each template slot keeps a two-leg or single-leg lift, push / pull / legs prints in his sheet's order, a Focus slot no longer pushes a group over its top number |

| Measure | Engine 0.4 | Engine 0.5 after V4 |
|---|---|---|
| Benchmark mean score (102 plans) | 64.4 | 95.59 |
| Hard-rule violations | 2,228 | 26, in 5 plans |
| Plans with no hard-rule violation | 12 | 97 |
| Tests | 1,035 | 1,333, none failing |

The two benchmark runs used different scorer versions, so the comparison is loose.

**Where it lives.** [engine/README.md](../../engine/README.md), [engine/DECISIONS.md](../../engine/DECISIONS.md) section G, [samples/STATUS_v0.5.md](../../samples/STATUS_v0.5.md), [design/bench/V05.md](../../design/bench/V05.md).

## 25. Three reviews and two fix rounds (2026-10-11)

**What happened.** Coach-eye reviewers read the 8 sample plans against his answers and his real programs. After each of the first two reviews, one fix round changed the engine or its data, never a plan by hand, and every fix got a test named after the coach answer it reads. The reviewers were told not to judge session length (CT-01).

| Sample | Review 1 | Review 2 | Review 3 |
|---|---|---|---|
| 01 Swimming | B- | B- | B |
| 02 Football | C+ | B | B |
| 03 Soccer | C+ | B- | B |
| 04 CrossFit-style class | C+ | B- | B- |
| 05 Bootcamp | B- | B- | B- |
| 06 Full-body aesthetics | C+ | B | B |
| 07 Push / pull / legs | B | B+ | B+ |
| 08 Pickleball, 52, knee pain | C | B | B+ |

A sample that already met the goal was not read again, and its grade is carried over.

| Measure | After V4 | After fix round 1 | After fix round 2 |
|---|---|---|---|
| Tests | 1,333 | 1,376 | 1,407 |
| Benchmark mean score | 95.59 | 97.49 | 97.67 |
| Benchmark lowest score | 86.71 | 88.57 | 89.35 |
| Hard-rule violations | 26 in 5 plans | 5 in 3 plans | 3 in 2 plans |

Part of the rise in score comes from corrections to the scorer, which are listed in the status file.

**Where it stands.** The goal was B+ or better on every sample. Two of eight reached it. The athletic layer (jumps, throws, sprints, Olympic sets) is the main part still short of its targets. The class and bootcamp samples were still graded B- after both fix rounds. Fourteen questions for the coach came out of the fix rounds. **These are AI grades. The coach has not graded a plan.**

**Where it lives.** [samples/STATUS_v0.5.md](../../samples/STATUS_v0.5.md) (the first two reviews, both fix rounds, the known gaps and the open questions). The third review's grades are recorded in [README.md](../../README.md) and [HANDOFF.md](../../HANDOFF.md).

## 26. Model v1.3 and the release documents (2026-10-11)

**What happened.** Round 4, CT-01 and CX-01..04 went into the model documents. The master became v1.3 and the v1.2 master was archived. Decision records ADR-050 to ADR-058 were written. The front door was rewritten for release.

| File | What changed |
|---|---|
| [BLAZE_CAMP_BRAIN.md](../../BLAZE_CAMP_BRAIN.md), [generator_spec_v1.json](../../generator_spec_v1.json), `synthesis/*.md` | Model v1.3. Section 0d of the master lists what changed. The v1.2 master is kept as `BLAZE_CAMP_BRAIN_v1_2.md` |
| `docs/` | Every page that described a superseded rule, the new answers by topic, and nine new decision records |
| `coverage_matrix_round4.md` | Each CX, CT and round-4 answer mapped to the master and the spec |
| [README.md](../../README.md), [MODEL_CARD.md](../../MODEL_CARD.md), [HANDOFF.md](../../HANDOFF.md), [AGENTS.md](../../AGENTS.md), [REVIEW_GUIDE.md](../../REVIEW_GUIDE.md), [CODEX_BRIEF.md](../../CODEX_BRIEF.md) | The status, the credit line, the authority order starting with round 4, the one-page model card |

**Why.** He approved releasing the model as the finished product with the engine labelled experimental: "go ahead and finish it all, and then after you're done, consolidate everything." (R4-REL-01). And he set how the repo describes itself: "a complete coaching model from the experience of Coach Lalo, who is Gerardo Vera. Master NASM coach." (R4-REL-03)

**What was left open on purpose.** His list of certifications. He said he has many and that they could be looked up. The team did not look them up or invent any. The README and the model card carried a marked placeholder for him to fill. Round 5 closed it: "Master NASM coach" only, the placeholder removed and nothing added (R5-PUB-02).

## Versions

Four things carry version numbers. They are four separate counters.

| Thing | Versions so far | Where to read the live value |
|---|---|---|
| Master document | v0, v1, v1.1, v1.2, v1.3 | Top of [BLAZE_CAMP_BRAIN.md](../../BLAZE_CAMP_BRAIN.md). Older ones are archived as `BLAZE_CAMP_BRAIN_v0.md`, `_v1.md`, `_v1_1.md`, `_v1_2.md` |
| Machine spec | 0.1.0 (the v0 file), 1.0.0, 1.0.1, 1.1.0, 1.2.0, 1.3.0 | [generator_spec_v1.json](../../generator_spec_v1.json) `_meta.version` |
| Compiled model | 1.1.0, 1.2.0, 1.3.0 | [model/MODEL_VERSION](../../model/MODEL_VERSION), [model/CHANGELOG.md](../../model/CHANGELOG.md) |
| Engine | 0.2.0, 0.3.0, 0.4.0, 0.5.0 | [engine/version.mjs](../../engine/version.mjs) |

The compiled model's number is a separate counter from the master's. It reached 1.3.0 with engine 0.4, while the master was still v1.2, and it stayed 1.3.0 through engine 0.5: the v0.5 changes are listed as layers in [model/CHANGELOG.md](../../model/CHANGELOG.md). `spec_version` in [model/manifest.json](../../model/manifest.json) records which spec a compile read. "Model v1.3" in the README means the master document v1.3 together with the spec and the compiled model.

## The git log

| Date | Commit | Message |
|---|---|---|
| 2026-10-08 | `7f7277d` | Initial import: Blaze Camp model v1 (docs, spec, sheet exports, analysis, coach answers) |
| 2026-10-08 | `1337b75` | Add review guide for external reviewers (Codex) |
| 2026-10-09 | `e74e833` | Model v1.1 (round 2 + 52 sports + stay-active) and engine v0.3 with 8 sample plans |
| 2026-10-09 | `6d9e0f7` | Questionnaire: add round 3 (13 questions incl. time vs minimums decision) |
| 2026-10-09 | `4d6cc82` | Add MIT license, EN/ES disclaimer and liability release (drafts), round-3 answers |
| 2026-10-09 | `8eb2082` | Model v1.2 snapshot (round 3 applied), agent docs, Codex research brief |
| 2026-10-09 | `16dde98` | Add coach conversation statements and workflow scripts |
| 2026-10-09 | `c13cbaa` | README: status is now public for review |
| 2026-10-09 | `3c373fa` | Add docs/ guidance layer: map, AI briefing, philosophy, model guides, answers by topic, decision records, reference, history |
| 2026-10-10 | `150d949` | Add planner design: diagnosis, algorithm research, rules as constraints, 3 designs, judges, PLANNER_SPEC, implementation plan, 94-plan benchmark + baseline |
| 2026-10-10 | `0a1da21` | Add HANDOFF.md: current state and next steps |
| 2026-10-10 | `04637ed` | Engine v0.4: round-3 rules, athletic stages per block, concrete variations, disclaimer line; 1,035 tests passing |
| 2026-10-10 | `585b0c3` | Record coach progression clarifications and gate planner workflow |
| 2026-10-10 | `f76884e` | Implement and verify isolated CX progression reference |
| 2026-10-10 | `972fa6f` | Add independent audit of Codex planner-build and review work |
| 2026-10-10 | `11c3260` | Record CT-01 (session time is the user's responsibility) and add round-4 questionnaire |
| 2026-10-10 | `235ff6f` | Add round-4 answers |
| 2026-10-10 | `866cb37`, `e7c85d4` | Merge review/codex (the model review) and review/claude-codex (the audit and its tests) |
| 2026-10-10 | `50fd654` | Add engine v0.5 plan (template-first, no time-fitting) and its workflow |

The outside model review was written on its own branch in three commits (`38a839a`, `6014c38`, `9483ea1`). Commits up to `04637ed` are on `main`. The later ones are on the branch `planner-build`. When this page was updated on 2026-10-11, engine 0.5 and the model v1.3 documents were in the working tree and not yet committed. Run `git log` for what came after.

## Where the history lives in the data

| What | File | Key or section |
|---|---|---|
| Which source wins | [generator_spec_v1.json](../../generator_spec_v1.json) | `_meta.authority_order` |
| What changed in v1.1, v1.2 and v1.3 | [generator_spec_v1.json](../../generator_spec_v1.json) | `_meta.v1_1_changelog`, `_meta.v1_2_changelog` and the v1.3 entry beside them |
| Where two team files disagreed and which was adopted | [generator_spec_v1.json](../../generator_spec_v1.json) | `_meta.integration_decisions` |
| Questions answered, skipped, or waiting for a next round | [generator_spec_v1.json](../../generator_spec_v1.json) | `open_decisions` |
| The sheets were not modified | [generator_spec_v1.json](../../generator_spec_v1.json) | `_meta.google_sheets_modified` |
| What each version of the master changed | [BLAZE_CAMP_BRAIN.md](../../BLAZE_CAMP_BRAIN.md) | §0 (v1), §0b (v1.1), §0c (v1.2), §0d (v1.3), Appendix B |
| What the compiler changed in the exercise data | [model/CHANGELOG.md](../../model/CHANGELOG.md) | "Coach corrections applied in the compile" |
| What engine 0.5 changed in the compiled rules, templates and words | [model/CHANGELOG.md](../../model/CHANGELOG.md) | the "v0.5 layer" sections |
| Every judgement call of engine 0.5, and every older test that was converted | [engine/DECISIONS.md](../../engine/DECISIONS.md) | section G |
| Engine 0.5 results, review by review | [samples/STATUS_v0.5.md](../../samples/STATUS_v0.5.md), [design/bench/](../../design/bench/) | `V05.md`, `V05_PRE_V4.md`, `V05_PRE_FIX1.md`, `V05_PRE_FIX2.md` |
| His raw questionnaire answers, one file per question | `answers_raw/`, `answers_raw_r2/`, `answers_raw_r3/`, `answers_raw_r4/` | `answers/<id>.json` |

## Related

[source-sheets.md](source-sheets.md) · [method.md](method.md) · [roadmap.md](roadmap.md) · [Decision records](../04-decisions/index.md) · [What he rejected](../01-philosophy/what-he-rejected.md) · [Model card](../../MODEL_CARD.md) · [Handoff](../../HANDOFF.md)
