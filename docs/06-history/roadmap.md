# Roadmap: what is done, what is open, what comes next

On 2026-10-11 the model is complete at version 1.3: four rounds of the coach's answers and his two later clarifications are applied and traced, and 52 sports and 26 activities are covered. The plan engine is at version 0.5 and is labelled experimental. It builds complete plans from his own templates with no time-fitting, passes its tests and checks, and its 8 sample plans get B- to B+ from AI reviewers. Update 2026-10-12: the coach graded them in round 5 (A for 3, B+ for 5; table below). The large optimizer planner that this page used to list as the next step is parked. Next come the coach's own review of the sample plans, his answers to 14 open questions, more engine work on athletic doses, the review of the Spanish and of the legal texts, and only then the tool that people will see. Nothing in this roadmap changes a coaching rule. Plans and estimates here are the team's, and they are marked PROPOSED or INFERRED where he has not confirmed them.

> **How to read this page.** The status is a snapshot of 2026-10-11. The steps that led here are on [timeline.md](timeline.md). For anything that moves, read the live file named in the row. **The team** means the people working with the coach plus the AI agents they ran. A **coach-eye reviewer** is an AI agent that reads a plan the way the coach would. It is not the coach. Ids such as `R2-GEN-07` point to his answers: no prefix is round 1, `R2-` is round 2, `R3-` is round 3, `R4-` is round 4, `CT-01` is his clarification on session time and `CX-01` to `CX-04` are his clarifications on progression and editing.

## The rule: the order of the work

| # | Rule | Decided by |
|---|---|---|
| 1 | The model comes first. No website or app is built until the logic, the model and its testing are finished. | Coach, in conversation ([coach_chat_statements.md](../../coach_chat_statements.md)). He said it again on 2026-10-11, in the session that built engine 0.5. That request is not recorded in an answer file |
| 2 | The first product is a simple, phone-friendly website, not an app. | GEN-03, R2-GEN-02 ([ADR-006](../04-decisions/adr-006-website-not-app.md)) |
| 3 | The model is released as the finished product. The engine stays labelled experimental until its plans are good enough. | R4-REL-01 |
| 4 | He grades sample plans before launch. | R2-GEN-07 |
| 5 | No check-ins, no tracking and no data kept, in any phase. So there are no accounts either (the team's reading of "I don't want any data kept"). | R3-VOL-02, R3-VOL-04, R3-GEN-01 |
| 6 | The license is MIT. The disclaimers exist in English and Spanish. The terms and release are accepted before any plan is built. | R3-GEN-01, R4-SCP-02 ([ADR-009](../04-decisions/adr-009-mit-license-and-disclaimers.md), [ADR-056](../04-decisions/adr-056-liability-gate-before-every-plan.md)) |
| 7 | The engine follows his templates and does no time-fitting. The large optimizer planner is parked as research. | Team ([ADR-058](../04-decisions/adr-058-engine-v05-template-first-not-the-large-planner.md)), following CT-01 and R4-REL-02 |
| 8 | The repo credits Coach Lalo (Gerardo Vera), Master NASM coach, as author and owner. It claims neither to be the best nor to prevent injury. | R4-REL-03 |

## Why

**Why the model before the product.** His idea of the product was open in round 1: "I was going to create a whole app, but that kind of fell through, so I don't want to create a whole app. Maybe just a website" (GEN-03). In the same answer he first raised giving the model away: "just give away the repo, open source it to any coach and person that wants to create a training app" (GEN-03).

**Why it must stay simple.** "Yeah, ideally, we want to make it as simple as possible. The fewer clicks, the better." (R2-GEN-02). In round 3: "I want them to be able to kick out a program, and that's it." (R3-VOL-04). And on time: "I want you to not get complicated over the time." (CT-01)

**Why the planner is parked.** The optimizer was designed to decide what to keep when a session's minutes could not hold his minimums. He removed that problem: "You need to stop trying to be responsible for the people's time." (CT-01). Without it, his own templates give the layout and the stairway gives the sets. A simpler engine could be built at once, and he asked for that: "I think you can try to build it now." (R4-REL-02)

**Why he grades the plans.** He said he would: "Yes, I will go ahead and go over five different sample plans" (R2-GEN-07). He then listed seven. In the proposal he approved, his grades become automatic tests.

## Done

| What | Where | Notes |
|---|---|---|
| Both Google Sheets exported and every tab dumped to text | [raw/](../../raw/), [dumps/](../../dumps/) | [source-sheets.md](source-sheets.md) |
| First-pass decode of the library, the reference tabs and every program | [analysis/](../../analysis/) | Each fact marked observed or inferred |
| Model documents on every topic | [synthesis/](../../synthesis/) | 01 to 13. Most end with the logs of their fact-checks |
| Four rounds of his answers: 140, 45 (+2), 13, 20 | [coach_answers_full.md](../../coach_answers_full.md), [coach_answers_round2.md](../../coach_answers_round2.md), [coach_answers_round3.md](../../coach_answers_round3.md), [coach_answers_round4.md](../../coach_answers_round4.md) | Never edited |
| Two clarifications: session time (CT-01) and progression and editing (CX-01..04) | [coach_answers_time_2026-10-10.md](../../coach_answers_time_2026-10-10.md), [coach_answers_codex_2026-10-10.md](../../coach_answers_codex_2026-10-10.md) | Each wins only on its own subject |
| Every answer traced to the master and the spec | `coverage_matrix.md`, `coverage_matrix_round2.md`, `coverage_matrix_round3.md`, `coverage_matrix_round4.md` | One file per round |
| Master document v1.3 and the matching spec | [BLAZE_CAMP_BRAIN.md](../../BLAZE_CAMP_BRAIN.md), [generator_spec_v1.json](../../generator_spec_v1.json) | Round 4, CT-01 and CX applied. Section 0d of the master lists the changes |
| Sport coverage: 127 profiles, 52 sports, 26 activities, each with a confidence label | [synthesis/04_profiles.json](../../synthesis/04_profiles.json), [sports.md](../02-model/sports.md) | 23 confirmed by him, 67 based on a similar sport, 37 proposed |
| Library: 733 runtime exercises, proposed ones as optional add-ons, no third-party video links in the model data | [model/catalog.json](../../model/catalog.json), [exercise-library.md](../02-model/exercise-library.md) | R4-LIB-01 to R4-LIB-05 |
| MIT license | [LICENSE](../../LICENSE) | To Lalo Vera, doing business as Blaze Camp, and BFit Studios Corp. |
| Disclaimers in English and Spanish | [DISCLAIMER.md](../../DISCLAIMER.md), [DISCLAIMER.es.md](../../DISCLAIMER.es.md) | **Drafts.** Attorney review is open |
| Guides for agents, developers, contributors and reviewers | [AGENTS.md](../../AGENTS.md), [llms.txt](../../llms.txt), [CONTRIBUTING.md](../../CONTRIBUTING.md), [REVIEW_GUIDE.md](../../REVIEW_GUIDE.md), [adding-exercises.md](../adding-exercises.md), [adding-exercises.es.md](../adding-exercises.es.md) | |
| The front door for release | [README.md](../../README.md), [MODEL_CARD.md](../../MODEL_CARD.md), [HANDOFF.md](../../HANDOFF.md) | Status, credit line, scope and limits |
| Decision records | [docs/04-decisions/](../04-decisions/index.md) | ADR-001 to ADR-058 |
| Engine 0.5: template-first, no time-fitting, the same plan every time, English or Spanish | [engine/](../../engine/), [model/](../../model/), [tests/](../../tests/) | Experimental. Results below |
| A benchmark with a scorer written separately from the engine | [design/bench/](../../design/bench/) | 94 intakes plus the 8 samples |
| Eight sample clients and their plans | [samples/intakes/](../../samples/intakes/), [samples/plans/](../../samples/plans/) | His seven plus a pickleball player. Graded by him in round 5: A for 3, B+ for 5 |
| An outside review of the model's evidence, and an independent audit of the progression arithmetic | [reviews/](../../reviews/) | Findings against his answers are "for discussion" |
| The research for a larger optimizer planner | [design/](../../design/) | Parked. Kept as research |

## Where the engine stands (2026-10-11)

All numbers are from [samples/STATUS_v0.5.md](../../samples/STATUS_v0.5.md) and [design/bench/V05.md](../../design/bench/V05.md).

| Measure | Target | Result |
|---|---|---|
| Tests failing | 0 | 0 of 1,407 (4 to-do, 2 skipped) |
| Failing error checks on the 8 samples and on the 1,578 sweep intakes (1,500 random, one per sport, one per activity) | 0 | 0 |
| No time-based behaviour anywhere | In every plan | Holds in all 102 benchmark plans |
| His templates, slot for slot | In every plan | Holds in every benchmark plan it applies to |
| Final sets reached; floor of 10 and the 2-day rule | In every plan | Holds in every benchmark plan it applies to |
| Hard-rule violations in the benchmark | 0 | 3, in 2 of 102 plans |
| Athletic work at the sport's weekly target | In every athletic plan | Short in 45 of 63 athletic plans |
| Every shortfall said in the plan | In every plan | 35 unsaid cases in 30 plans |
| Coach-eye grade of each sample plan | B+ or better | 2 of 8 (grades below) |

The targets are the team's, from [design/ENGINE_V05_PLAN.md](../../design/ENGINE_V05_PLAN.md) ("Done means"). They are not his numbers. Two targets of the earlier roadmap are retired: "no flat week on a trained group" (a week may hold the same sets while reps or load progress, CX-02) and "every day inside the chosen minutes" (CT-01).

| Sample | Who | AI grade, third review | The coach's grades (round 5) |
|---|---|---|---|
| Swimming | A 16-year-old high-school swimmer, 3 gym days | B | **A** |
| Football | A 20-year-old college linebacker, 4 days | B | **A** |
| Soccer | A 22-year-old midfielder 10 weeks before the season, 3 days. Spanish output | B | **B+** |
| CrossFit-style class | A 35-year-old class member, 4 days | B- | **B+** |
| Bootcamp | A 42-year-old general-population client, 3 circuit days, dumbbells and kettlebells. Spanish output | B- | **B+** |
| Full-body aesthetics | A 29-year-old, 4 days, his A/B days | B | **B+** |
| Push / pull / legs | A 24-year-old, 6 days | B+ | **A** |
| Pickleball (bonus) | A 52-year-old who plays 3 times a week, 2 gym days, knee pain. Also in Spanish | B+ | **B+** |

The first seven are the ones he named (R2-GEN-07). The pickleball player is the team's addition. **The coach's grades (round 5)** are in the last column (COACH-R5 R5-GRD-01 ... 08); his notes on the B+ plans are rules for engine 0.7. The plans in [samples/plans/](../../samples/plans/) are not yet approved by him as examples of his programming: treat them as graded drafts.

## Next, in order

| # | Step | Who | Done when |
|---|---|---|---|
| 1 | Consolidate: commit engine 0.5 and model v1.3, and merge into `main` | Lead | `main` holds the release (R4-REL-01) |
| 2 | His credentials | Coach | **Done (R5-PUB-02):** "Master NASM coach" only; the placeholder is removed, nothing added |
| 3 | Grade the sample plans | Coach | **Done (round 5):** A for 01, 02, 07; B+ for 03, 04, 05, 06, 08. His B+ notes become rules and tests (engine 0.7) |
| 4 | Answer the open questions below | Coach | Each one is his rule, or stays PROPOSED |
| 5 | Engine: athletic doses, saying every shortfall, the last hard-rule violations, the class and bootcamp samples | Team | Every sample grades B+ or better and the benchmark has no hard-rule violation |
| 6 | Review the Spanish | Coach or a coach he trusts | Every line approved (R2-GEN-08) |
| 7 | Legal review | A licensed Florida attorney | The disclaimers, the health check and the release line are final in both languages |
| 8 | Public release called final | Coach | The checklist below is complete |
| 9 | The tool people will see | Later | See "The website, later" |

Step 5 and the estimates below are the team's plan (PROPOSED). Steps 2, 3, 4, 6, 7 and 8 depend on him or on a lawyer.

### Decisions only he can make

**His credentials.** Decided in round 5: "Master NASM coach" only, as written (R5-PUB-02). The placeholder for a longer list is removed; the team adds nothing.

**Fourteen questions from the engine work.** They are written out in [samples/STATUS_v0.5.md](../../samples/STATUS_v0.5.md). Until he answers, the engine's choice is PROPOSED.

| # | Question | What the engine does today (PROPOSED) |
|---|---|---|
| 1 | Does a high-incline press count for chest? | 1 set for front delts and half a set for chest |
| 2 | Athletic A/B days: a two-leg lift in slot 2 on every day, so less single-leg work than his earlier 80-90% answer? | Yes, a two-leg lift in slot 2 |
| 3 | 2- and 3-day athletic weeks: what share of a 4-day profile's jumps, throws, cuts and sprints? | Three quarters |
| 4 | The class needs a second quad exposure in the week: a lunge, or a leg press or goblet squat? | A lunge, which now sits on the clean + pull day |
| 5 | Should every plan hold pulling at or above pressing? | Only for sports whose profile asks for it |
| 6 | A non-competitive adult (pickleball): how many exercises a day? | 5 to 10, from his sheet |
| 7 | Side delts on a physique plan: a minimum of direct sets? | 4, 6 or 8 by level |
| 8 | Small kits: may the two-arm dumbbell row and the chest-supported dumbbell row be regular picks? | Swaps only |
| 9 | In season: is the session on the day before a game the lighter one? | Yes |
| 10 | Bootcamp with no pull-up bar: does the freed station go to the hips or stay on the pulling side? | It stays on the pulling side (a rear-delt fly) |
| 11 | Which floor anti-rotation core drills should be regular picks? | Bird dogs and dead bugs beside the planks |
| 12 | Should throwers and volleyball players press incline-first like the swimmer? | Only the swimmer does |
| 13 | Circuits: one more round in the last two weeks? | Yes |
| 14 | May a press lead the pulls by one set while the back sits on its number for the week? | Yes |

**What became of the nine planner questions.** The earlier version of this page listed nine rule conflicts that the optimizer needed him to rank. None was put to him in that form. Most were settled when time-fitting was removed.

| The question then | What settled it |
|---|---|
| May a big group be trained below 10 sets when time is short? | There is no "short on time". The floor of 10 applies from 3 training days. On 2 days every big group is trained at about 6-8 (R4-SES-03) |
| Must every day fit the chosen minutes? | No minutes are chosen (CT-01, R4-SES-01) |
| Is "never flat" measured on the total or on every group? | A week may hold the same sets while reps or load progress. The final sets must be reached (CX-01, CX-02) |
| On 2- and 3-day plans, may a hip exercise go on the knee and pull day? | The days are his templates, and the knee + pull and hip + push pairing is checked on each of them (R4-SES-05) |
| For a group not trained directly, keep one exercise or nothing? | No group is left out. The template comes out complete (R4-SES-03, R4-SES-04) |
| In a short session for an athlete, what share is athletic work? | Field athletes get up to 12 exercises: the athletic block, then the lifts (R4-SES-02). The scale for 2- and 3-day weeks is open question 3 above |
| Is the number of exercises per session a hard limit or a guide? | A recommendation in a template: "They can add 1 if they want to." (R4-SES-02) |
| Calves: is 3 sets on each leg day the whole rule, or do calves also need 10? | **Still open.** The engine holds 3 sets on each leg day (R3-SES-01) and a weekly calf floor that is PROPOSED |
| Hips and shoulders: one final number for the group, or one for each part? | **Still open.** Outside physique and strength plans the engine uses one target per group (PROPOSED) |

Other open items from the model side are listed in [BLAZE_CAMP_BRAIN.md](../../BLAZE_CAMP_BRAIN.md) §16 and in the spec under `open_decisions`.

### The engine, toward B+ on every sample

| Area | What is open | Where |
|---|---|---|
| Athletic layer | Jumps, throws, cuts, sprint metres and Olympic sets are often under the sport's weekly target, or flat for weeks. 4 to-do tests | `samples/STATUS_v0.5.md`, "Athletic layer" |
| Saying it | A shortfall in Olympic sets, or a quality with a target and no station, is not yet said in the plan | Benchmark row A11 |
| Hard rules | One CrossFit plan has more jumps than its scaled target. One MYO set is placed differently by the scorer and the engine | Benchmark row A1 |
| Class and bootcamp samples | Still graded B- after both fix rounds. Small kits run out of library lifts | Samples 04 and 05 |
| Validator | The rules added in the fix rounds are held by tests and the scorer, not yet by a validator check | `engine/validate.mjs` |
| Printed copy | Minor items: whole sets in the weekly table, one exercise counter, swap lines once per block, the warm-up by day | `samples/STATUS_v0.5.md`, "Not fixed in this round" |
| Leftovers | The locked-rule list in the compiled model still names the retired "less than 10% a week" rule (LK08). Nothing enforces it | `model/rules.json > locked` |

### Spanish

The Spanish is neutral Latin American Spanish with the English gym word in brackets where gyms use it (R2-GEN-08). The team reviewed the plan-facing lines during engine 0.5. He has not approved any Spanish yet. 842 machine-translated lines, mostly exercise names and cues, are marked for review in [model/i18n/](../../model/i18n/). The approved process is that he, or a coach he trusts, approves every line. See [ADR-007](../04-decisions/adr-007-bilingual-english-first-full-spanish.md).

### Legal review

| Text | State | Who finishes it |
|---|---|---|
| [DISCLAIMER.md](../../DISCLAIMER.md), [DISCLAIMER.es.md](../../DISCLAIMER.es.md) | Drafts. Each file says so at the top | A licensed Florida attorney |
| The short health check shown before a plan is built | Placeholder wording. He approved that a lawyer writes it, in English and Spanish, with a link to the official PAR-Q+ (R3-GEN-01) | A lawyer |
| The terms and release accepted before every build, and the release line printed on every plan | Working draft wording. The gate itself is built (R4-SCP-01, R4-SCP-02) | A lawyer |

He asked for the Spanish to be "translated as legally equivalent as possible" (R3-GEN-01). See [ADR-010](../04-decisions/adr-010-health-check-and-release-every-build.md), [ADR-056](../04-decisions/adr-056-liability-gate-before-every-plan.md) and [safety-and-liability.md](../00-overview/safety-and-liability.md).

## The website, later

No website is being built now. This is what is already decided and what is still only a plan.

| Item | Status | Source |
|---|---|---|
| A phone-friendly website, not an app | His decision | GEN-03, R2-GEN-02 |
| Few inputs in, the whole plan out, visible ahead of time | His decision | R3-VOL-04 |
| The form does not ask for a session length | His decision | R4-SES-01 |
| The terms and release are ticked as part of entering the data, before the plan shows | His decision | R4-SCP-02 |
| Everything is editable: sets for any day or week, add or remove an exercise, a block on or off | His decision | CX-02, CX-04, R3-SES-02 |
| Each exercise has a "copy the name" control and a YouTube search link | His decision | R4-LIB-05 |
| Views of the block, the week and the day, easy to switch | His decision | R2-GEN-02 |
| A coach can screenshot 12 weeks or one week and send it | His decision | R2-GEN-02 |
| English first, with a full Spanish toggle | His decision | GEN-01, R2-GEN-08 |
| A health check with a coach bypass | His decision | R2-GEN-03, R3-GEN-01 |
| No data kept | His decision | R3-GEN-01 |
| No accounts and no database | PROPOSED: how the team carries out "no data kept" | [ADR-002](../04-decisions/adr-002-no-data-kept.md) |
| Videos are optional. His own videos can be added later | His decision | R2-GEN-02, R4-LIB-05 |
| Save a day as an image, a PDF, a Google Sheet download | In the proposal he marked RIGHT | R2-GEN-02 |
| The full export list (block and week images, a plan link, a plan file, a calendar) and how each export looks | PROPOSED | [synthesis/13_product_options.md](../../synthesis/13_product_options.md) |
| Technology and hosting | PROPOSED | 13, Appendix E |
| Effort: about 13.5 to 20 developer-weeks for the first version | INFERRED estimate for one developer, made before round 4 | 13 §6 and §9 |
| Free or paid coach tools | Open | 13 §11 |

## Public release checklist

He approved releasing the model as the finished product with the engine labelled experimental (R4-REL-01). The items below are what still stands between that and a release that can be called final.

| # | Item | Status on 2026-10-11 | Source |
|---|---|---|---|
| 1 | MIT license in the repo, in his name, Blaze Camp and BFit Studios Corp. | Done | R3-GEN-01 |
| 2 | README says: at your own expense and risk; if you use it for other people, have your own liability release | Done, in English and Spanish | R3-GEN-01 |
| 3 | The README credits him as author and owner, with no "best" claim and no injury-prevention claim | Done | R4-REL-03 |
| 4 | His credentials | **Done.** "Master NASM coach" only, as he wrote it; the placeholder is removed and nothing was added | R4-REL-03, R5-PUB-02 |
| 5 | Disclaimers in English and Spanish | Drafts | R3-GEN-01 |
| 6 | **A licensed Florida attorney reviews both disclaimers** and the release wording, and confirms the Spanish is legally equivalent | **Open** | The files themselves; R3-GEN-01 |
| 7 | The terms and release are accepted before any plan is built, and every plan prints the release line | Done in the engine | R4-SCP-01, R4-SCP-02 |
| 8 | The model is complete and consolidated on `main` | Model v1.3 complete. The merge is the lead's step | R4-REL-01 |
| 9 | The engine is clearly labelled experimental | Done in the README, the model card and the handoff | R4-REL-01 |
| 10 | He grades the sample plans | **Done** (round 5: A for 01, 02, 07; B+ for 03, 04, 05, 06, 08) | R2-GEN-07, R5-GRD-01 ... 08 |
| 11 | The sample plans in the repo are ones he approved | Open. He graded them (round 5); his B+ notes are being applied | Team (PROPOSED) |
| 12 | The Spanish is approved line by line | Open (842 lines) | R2-GEN-08 |
| 13 | No third-party video links in the public data | **Done.** The compiled model and the library source never held them; the sheet exports (`raw/`, `dumps/`), the first-pass files in `analysis/`, `synthesis/02_exercise_catalog_crosswalk.json` and the old model snapshots in `design/scratch/snap*/` are link-stripped (each link replaced with `[video link removed]`, 2026-10-12) | R4-LIB-05, R5-PUB-01 |
| 14 | He decides whether the sheet exports in `raw/` and `dumps/` stay in the public repo | **Done.** They stay public, link-stripped and checked for client names (none found) | R5-PUB-01 |
| 15 | The sheet exports are checked for client names and for content that is not his (the half-marathon plan credited to someone else) | Open | Team (PROPOSED). See [source-sheets.md](source-sheets.md) |
| 16 | The lawyer advises on the Blaze Camp name. The MIT license covers copyright. It does not grant rights in the name | Open | Team (INFERRED, 13 §8) |
| 17 | README and AGENTS show the current versions and no retired feature | Done on 2026-10-11 | Team |
| 18 | A last search for retired ideas presented as current | Run on 2026-10-11 as the final consistency check of v1.3 ([RELEASE_CHECK_v1.3.md](../../RELEASE_CHECK_v1.3.md)). Repeat before each release | [REVIEW_GUIDE.md](../../REVIEW_GUIDE.md) |
| 19 | The outside review is read, and each finding is fixed or listed "for discussion with the coach" | Partly. Its record fixes were applied, and points that were open at the time went to him in round 4. A second pass on v1.3 is briefed | [CODEX_BRIEF.md](../../CODEX_BRIEF.md) |
| 20 | The guide for adding exercises exists in both languages | Done | Conversation |
| 21 | Every number that is not his is marked PROPOSED | Ongoing. The compiled rules carry a status on each table | [method.md](method.md) |

What he wants the release to be, in his words: free "for anybody to use in their own app and their own training." (conversation). On how the repo describes itself: "a complete coaching model from the experience of Coach Lalo, who is Gerardo Vera." (R4-REL-03). And on the name: "The Blaze Camp name is the culture." (conversation)

## Not on the roadmap

These were considered and then set aside. Each row names the answer behind it. They are listed so nobody plans them again without asking him.

| Retired | By | Record |
|---|---|---|
| Fitting a plan to a session length: a session-length question, a time check, cutting for time, offers of longer sessions | CT-01, R4-SES-01 | [ADR-050](../04-decisions/adr-050-no-time-fitting-sessions-sized-by-exercise-count.md) |
| The large optimizer planner as a build target | Team, following CT-01 and R4-REL-02 | [ADR-058](../04-decisions/adr-058-engine-v05-template-first-not-the-large-planner.md) |
| A hard cap on the weekly step, and "sets must rise every week" | CX-01, CX-02 | [ADR-049](../04-decisions/adr-049-endpoint-priority-and-editable-progression.md) |
| Dropping muscle groups or exercises automatically | R4-SES-03, R4-SES-04 | [ADR-052](../04-decisions/adr-052-two-day-rule.md) |
| A weekly check-in, a logbook, tracking | R3-VOL-02, R3-VOL-04 | [ADR-001](../04-decisions/adr-001-answers-in-plan-out-no-check-ins.md) |
| Stored data | R3-GEN-01 | [ADR-002](../04-decisions/adr-002-no-data-kept.md) |
| Accounts, and learning from users' data | The team's reading of R3-GEN-01. In round 1 he expected the tool to learn from users' data (VOL-01), so "off for good?" is still a question for him | [ADR-002](../04-decisions/adr-002-no-data-kept.md) |
| Sleep, stress and lifestyle questions | R2-GEN-04 | [ADR-003](../04-decisions/adr-003-no-lifestyle-inputs.md) |
| A native app | GEN-03 | [ADR-006](../04-decisions/adr-006-website-not-app.md) |
| A video for every exercise before launch; third-party video links | R2-GEN-02, R4-LIB-05 | [ADR-008](../04-decisions/adr-008-videos-optional.md) |
| Bands and variable resistance | EQ-01, EQ-12. Not for now: "We will work with that later on." (EQ-12) | [ADR-034](../04-decisions/adr-034-no-bands-no-variable-resistance.md) |

The full list is on [what-he-rejected.md](../01-philosophy/what-he-rejected.md).

## Where it lives in the data

| What | File | Key or section |
|---|---|---|
| The plan engine 0.5 was built to, and what "done" means | [design/ENGINE_V05_PLAN.md](../../design/ENGINE_V05_PLAN.md) | whole file |
| Engine results, known gaps and the 14 open questions | [samples/STATUS_v0.5.md](../../samples/STATUS_v0.5.md) | whole file |
| The benchmark's latest run, plan by plan | [design/bench/V05.md](../../design/bench/V05.md), `results_v05.json` | whole file |
| Questions waiting for him from the model side | [generator_spec_v1.json](../../generator_spec_v1.json), [BLAZE_CAMP_BRAIN.md](../../BLAZE_CAMP_BRAIN.md) | `open_decisions`; §16 |
| Which rule tables or details are still proposed | [model/rules.json](../../model/rules.json) | the `status` of each table (about 130 of them contain the word PROPOSED) |
| Which sport profiles are confirmed | [model/profiles.json](../../model/profiles.json) | `sports[id].confidence` |
| The product phases and their estimates | [synthesis/13_product_options.md](../../synthesis/13_product_options.md) | §6, §9 |
| The parked planner research | [design/PLANNER_SPEC.md](../../design/PLANNER_SPEC.md), [design/diagnosis.md](../../design/diagnosis.md), [design/rules_as_constraints.json](../../design/rules_as_constraints.json) | whole files (history) |
| Live versions | [model/MODEL_VERSION](../../model/MODEL_VERSION), [engine/version.mjs](../../engine/version.mjs), [generator_spec_v1.json](../../generator_spec_v1.json) `_meta.version` | |
| Current state for whoever continues | [HANDOFF.md](../../HANDOFF.md) | whole file |

## Related

[timeline.md](timeline.md) · [method.md](method.md) · [source-sheets.md](source-sheets.md) · [ADR-058](../04-decisions/adr-058-engine-v05-template-first-not-the-large-planner.md) · [Decision records](../04-decisions/index.md) · [Model card](../../MODEL_CARD.md)
