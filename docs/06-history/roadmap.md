# Roadmap: what is done, what is in progress, what comes next

On 2026-10-09 the model was complete enough to read and study: three rounds of the coach's answers were applied and traced, and 52 sports and 26 activities were covered. The plan engine was not finished. It built complete plans, but AI reviewers kept grading them low (C- to D, then D to B- after a first round of fixes), mostly for the dosing. So the dosing part is being redesigned as an optimizer. Next come the planner's specification, a benchmark that scores plans against his rules, new sample plans for him to grade, and the review of the Spanish and the legal texts. The website comes later. A public release has its own checklist, including review of the disclaimers by a Florida attorney. Nothing in this roadmap changes a coaching rule. Plans and estimates here are the team's, and they are marked PROPOSED or INFERRED where he has not confirmed them.

> **How to read this page.** The status is a snapshot of 2026-10-09. The steps that led here are on [timeline.md](timeline.md). For anything that moves, read the live file named in the row. **The team** means the people working with the coach plus the AI agents they ran. A **coach-eye reviewer** is an AI agent that reads a plan the way the coach would. It is not the coach. Ids such as `R2-GEN-07` point to his answers: no prefix is round 1, `R2-` is round 2, `R3-` is round 3.

## The rule: the order of the work

| # | Rule | Decided by |
|---|---|---|
| 1 | The model comes first. No website or app is built until the data and the context are organized. | Coach, in conversation |
| 2 | The first product is a simple, phone-friendly website, not an app. | GEN-03, R2-GEN-02 ([ADR-006](../04-decisions/adr-006-website-not-app.md)) |
| 3 | The repository is opened to everyone after he approves the model. | R2-GEN-02 |
| 4 | He grades sample plans before launch. | R2-GEN-07 |
| 5 | No check-ins, no tracking and no data kept, in any phase. So there are no accounts either (the team's reading of "I don't want any data kept"). | R3-VOL-02, R3-VOL-04, R3-GEN-01 |
| 6 | The license is MIT. The disclaimers exist in English and Spanish. | R3-GEN-01 ([ADR-009](../04-decisions/adr-009-mit-license-and-disclaimers.md)) |
| 7 | The planner is rebuilt as an optimizer before the sample plans go to him. | Team ([ADR-048](../04-decisions/adr-048-optimizer-rebuild-of-the-planner.md)) |

## Why

**Why the model before the product.** His idea of the product was open in round 1: "I was going to create a whole app, but that kind of fell through, so I don't want to create a whole app. Maybe just a website" (GEN-03). In the same answer he first raised giving the model away: "just give away the repo, open source it to any coach and person that wants to create a training app" (GEN-03).

**Why it must stay simple.** "Yeah, ideally, we want to make it as simple as possible. The fewer clicks, the better." (R2-GEN-02). And in round 3: "I want them to be able to kick out a program, and that's it." (R3-VOL-04)

**Why the planner is rebuilt first.** He asked for "the best mathematical, logical algorithms possible to make sure this is top of the line. Spare no expense." (conversation). The first engine's dosing did not meet that. Sending him plans that the team already knows are wrong would waste his grading.

**Why he grades the plans.** He said he would: "Yes, I will go ahead and go over five different sample plans" (R2-GEN-07). He then listed seven. In the proposal he approved, his grades become automatic tests.

## Done

| What | Where | Notes |
|---|---|---|
| Both Google Sheets exported and every tab dumped to text | [raw/](../../raw/), [dumps/](../../dumps/) | [source-sheets.md](source-sheets.md) |
| First-pass decode of the library, the reference tabs and every program | [analysis/](../../analysis/) | Each fact marked observed or inferred |
| Model documents on every topic | [synthesis/](../../synthesis/) | 01 to 13. Most end with the logs of their fact-checks |
| Three rounds of his answers: 140, 45 (+2), 13 | [coach_answers_full.md](../../coach_answers_full.md), [coach_answers_round2.md](../../coach_answers_round2.md), [coach_answers_round3.md](../../coach_answers_round3.md) | Never edited |
| Every answer traced to the master and the spec | [coverage_matrix.md](../../coverage_matrix.md), [coverage_matrix_round2.md](../../coverage_matrix_round2.md), [coverage_matrix_round3.md](../../coverage_matrix_round3.md) | No row left missing |
| Master document v1.2 and spec 1.2.0 | [BLAZE_CAMP_BRAIN.md](../../BLAZE_CAMP_BRAIN.md), [generator_spec_v1.json](../../generator_spec_v1.json) | Round 3 applied |
| Sport coverage: 127 profiles, 52 sports, 26 activities | [synthesis/04_profiles.json](../../synthesis/04_profiles.json) | Many inner numbers still PROPOSED: [sports.md](../02-model/sports.md) |
| MIT license | [LICENSE](../../LICENSE) | To Lalo Vera, doing business as Blaze Camp, and BFit Studios Corp. |
| Disclaimers in English and Spanish | [DISCLAIMER.md](../../DISCLAIMER.md), [DISCLAIMER.es.md](../../DISCLAIMER.es.md) | **Drafts.** Attorney review is open |
| Guides for agents, developers and contributors | [AGENTS.md](../../AGENTS.md), [llms.txt](../../llms.txt), [CONTRIBUTING.md](../../CONTRIBUTING.md), [adding-exercises.md](../adding-exercises.md), [adding-exercises.es.md](../adding-exercises.es.md) | |
| A first engine that builds a whole plan from one intake, the same plan every time, in English or Spanish | [engine/](../../engine/), [model/](../../model/), [tests/](../../tests/) | A first draft. Its dosing is being rebuilt |
| Eight sample clients | [samples/intakes/](../../samples/intakes/) | His seven plus a pickleball player |
| A measured diagnosis of the dosing, a study of methods, and every rule written as a constraint | [design/diagnosis.md](../../design/diagnosis.md), [design/algorithm_research.md](../../design/algorithm_research.md), [design/rules_as_constraints.md](../../design/rules_as_constraints.md) | |
| A guide and a research brief for the outside reviewer | [REVIEW_GUIDE.md](../../REVIEW_GUIDE.md), [CODEX_BRIEF.md](../../CODEX_BRIEF.md) | |

## In progress (2026-10-09)

| What | State on 2026-10-09 | Where to look |
|---|---|---|
| Engine v0.4 | Round 3 is applied. AI reviewers graded the plans C- to D. A first fix round is done. A second review graded them D to B-, and a second fix round was under way | [samples/REVIEW_LOG.md](../../samples/REVIEW_LOG.md), [engine/README.md](../../engine/README.md) |
| Planner design | The diagnosis, the research and the rule inventory are written. The step that should have produced three full design documents returned none, so three judges scored the three approaches as briefed. All three favoured the two-stage approach. No final specification yet | [design/](../../design/): `judge_1.md`, `judge_2.md`, `judge_3.md` |
| Guidance documents | Being written and fact-checked folder by folder | `docs/` |
| Outside review (Codex) | A first review exists on the git branch `review/codex`. The two reports the brief asks for are not written yet | [CODEX_BRIEF.md](../../CODEX_BRIEF.md) |

The **two-stage approach** means: first decide how many weekly sets each muscle group gets in each week, then fit those sets into days and exercises. The judges' scores are provisional. They are scores of approaches, not of finished designs.

## Next, in order

| # | Step | Who | Done when |
|---|---|---|---|
| 1 | Put the open rule conflicts to him | Team asks, coach answers | He has answered the questions below |
| 2 | Write the planner specification | Team | One document says exactly what the planner decides and in what order of priority |
| 3 | Build the optimizer planner | Team | It replaces the dosing part of the engine and passes the benchmark |
| 4 | Build the benchmark | Team | A set of test clients and a scorer that is separate from the planner |
| 5 | Regenerate the eight sample plans and review them with a coach's eye | Team | The reviewers find no blocker |
| 6 | He grades the sample plans | Coach | He signs off, or his corrections become new rules and tests |
| 7 | Review the Spanish | Coach or a coach he trusts | Every line approved (R2-GEN-08) |
| 8 | Legal review | A licensed Florida attorney | The disclaimers and the health check are final in both languages |
| 9 | Bring the top-level documents in line with round 3 | Team | README and AGENTS show the current versions and no retired feature |
| 10 | Public release | Coach | The checklist below is complete |
| 11 | The website | Later | See "The website, later" |

Steps 2 to 5 and the estimates below are the team's plan (PROPOSED). Steps 6, 7, 8 and 10 depend on him or on a lawyer.

### 1. Decisions only he can make

A solver needs a fixed priority for every pair of rules that can collide. The diagnosis found nine such places. None has been put to him yet.

| # | Question | Why the planner needs it |
|---|---|---|
| 1 | May a big muscle group ever be trained below 10 sets when time is short, or must the plan train fewer groups, each at 10 or more? | His approved order says fewer groups (R3-SES-02). The first engine sometimes kept a group below the floor |
| 2 | Must every day fit the chosen minutes exactly, or may a full-body day run about 10 % over? What about test weeks? | The first engine allowed 10 % |
| 3 | Is "never flat" measured on the week's total, or on every trained group? | Sets are whole numbers. A group with 2 or 3 sets to add over 11 weeks cannot add one every week |
| 4 | On 2 and 3-day plans, may a hip exercise go on the knee and pull day when that is the only way a group reaches 10? | The pairing rule and the floor can collide |
| 5 | For a group that is not trained directly, keep one exercise for its main pattern, or nothing? | His rule of 2 to 4 exercises per group, never 1 (R2-SES-05), collides with keeping every movement pattern in the week |
| 6 | Calves: is 3 sets on each leg day the whole rule, or do calves also need 10? | With few leg days, 3 sets a day stays under 10 |
| 7 | For hips (glutes and hamstrings) and shoulders: one ceiling for the group, or one for each part? | It changes how high the stairway can climb |
| 8 | In a short session for an athlete, what share goes to athletic work and what share to lifting? | The sport profiles give weekly targets with no time limit |
| 9 | Is the number of exercises per session (VOL-08) a hard limit or a guide? | Full-body days went past it |

Eighteen questions are also waiting from the model side. A few overlap with the nine above. They are listed in [BLAZE_CAMP_BRAIN.md](../../BLAZE_CAMP_BRAIN.md) §16.6 and in the spec under `open_decisions.round4_candidates_master`. Examples:

| Question | The team's suggestion (PROPOSED) |
|---|---|
| Some muscle lines cannot reach their ceiling with the approved 3 % and 5 % steps. Keep the small steps, or allow bigger late steps? | Keep the steps. The ceiling is a maximum |
| With his minimums, 2 sessions of 45 minutes hold one big group plus calves. Right? | Keep his minimums and say so up front |
| A Focus muscle that is an arm or the calves: still trained directly when time is short? | Yes |
| Focus muscles: +2 sets by default (he said 1 to 3)? | +2 |
| "Week by week": drop the name, or keep it as the week view of a 12-week plan? | Keep it as a view |
| Should the model ever learn from user data? | No. It improves through his reviews |

### 2 and 3. The optimizer planner

A **planner** is the code that turns his rules and one person's answers into sets per exercise per week. An **optimizer** looks at all the plans that obey the rules and picks the best one by a fixed order of priorities.

**What it must decide together.** Which groups are trained directly. On which days. How many sets each exercise gets in each week. How much athletic work. Which exercises are paired as supersets.

**The order of priorities** (PROPOSED by the team, from his answers; the judges have already suggested corrections to it):

| Rank | Tier | Source |
|---|---|---|
| 1 | Safety and his hard rules | GEN-08 and the hard rules in [AGENTS.md](../../AGENTS.md) §10 |
| 2 | His order for short time: say so, offer more time, train fewer groups, recommend supersets | R3-SES-02 |
| 3 | The floor of 10 on every trained group | R2-VOL-06, R3-VOL-01, R3-SES-02 |
| 4 | A stairway that climbs | R2-PER-03, R3-VOL-04 |
| 5 | The session fits the minutes | Team's reading of R3-SES-02. How strict is question 2 above |
| 6 | Ceilings | R2-VOL-06 |
| 7 | Exercise counts: 2 to 4 per group | R2-SES-05, R3-SES-01 |
| 8 | Pairing and order preferences | UNI-11, ORD answers |
| 9 | Balance and variety | VOL-18, PER-02 |

**What stays the same.** Plain JavaScript that runs in a browser. The same answers always give the same plan. Every decision carries its reason. The exercise catalog, the sport profiles, the choice of exercises and the printed plan are outside the rebuild. The research recommends a solver written in plain JavaScript with no outside dependency. That choice is not final.

**Where it will live.** The workflow is set to write `design/PLANNER_SPEC.md` and `design/IMPLEMENTATION_PLAN.md`. Neither existed on 2026-10-09.

### 4. The benchmark

A **benchmark** is a fixed set of test clients plus a scorer. The scorer reads a finished plan and measures it against each rule. It is written separately from the planner, so a passing score means something.

| Part | Plan (PROPOSED) |
|---|---|
| Test clients | At least 50 intakes: every goal family, 2 to 6 days, 30 to 120 minutes, every equipment profile, levels 1 to 3, youth to 70 and over, Focus muscles, pain, 15 or more sports, and hard cases such as an athlete with 2 sessions of 30 minutes |
| Scorer | One score from 0 to 100 per plan, and a list of every rule the plan breaks |
| Baseline | The current engine scored first, so the new planner has a number to beat |
| Properties | More time must never train fewer groups. The same intake must always give the same plan |

**Targets** (PROPOSED by the team, not his numbers):

| Measure | Target |
|---|---|
| Trained groups at or above the floor, or listed as "not trained directly" | 100 % |
| Flat weeks on a trained group | 0 |
| Days inside the chosen minutes, or warned with an offer | 100 % |
| Hard-rule violations | 0 |
| Coach-eye grade of each sample plan | B+ or better |

The workflow is set to write the benchmark to `design/bench/`. It did not exist on 2026-10-09.

### 5 and 6. Sample plans graded by the coach

| Sample | Who | Why this one |
|---|---|---|
| Swimming | A 16-year-old high-school swimmer, 3 gym days | First on his list. Dryland defaults approved in R3-ATH-01 |
| Football | A college linebacker, 4 days | The field-athlete day: up to 12 exercises plus 2 core |
| Soccer | A midfielder 10 weeks before the season, 3 days | The end of the off-season into pre-season. Spanish output |
| CrossFit-style bootcamp | A class member, 4 days of 60 minutes | The example used in question R3-SES-02 of a schedule that cannot hold the minimums |
| Bootcamp | A general-population client, 3 days of 45 minutes | The stairway in rounds and seconds. Spanish output |
| Full-body aesthetics | A 29-year-old, 4 days | 2 to 4 exercises per group on full-body days |
| Push / pull / legs | A 24-year-old, 6 days | Split days |
| Pickleball (bonus) | A 52-year-old who plays 3 times a week, 2 gym days of 45 minutes | Stay athletic and active, and a very short week |

The first seven are the ones he named (R2-GEN-07). The pickleball player is the team's addition.

**What he will be asked to do.** Read each plan as if he had written it for that client. Mark what he would change. His corrections become rules, and where a rule is clear, a test. The plans in [samples/plans/](../../samples/plans/) on 2026-10-09 come from the first engine. **They are not approved by him. Do not treat them as examples of his programming.**

### 7. Spanish

The Spanish is neutral Latin American Spanish with the English gym word in brackets where gyms use it (R2-GEN-08). Part of it is machine-translated and marked for review in [model/i18n/](../../model/i18n/). The approved process is that he, or a coach he trusts, approves every line. See [ADR-007](../04-decisions/adr-007-bilingual-english-first-full-spanish.md).

### 8. Legal review

| Text | State | Who finishes it |
|---|---|---|
| [DISCLAIMER.md](../../DISCLAIMER.md), [DISCLAIMER.es.md](../../DISCLAIMER.es.md) | Drafts. Each file says so at the top | A licensed Florida attorney |
| The short health check shown before a plan is built | Not written. He approved that a lawyer writes it, in English and Spanish, with a link to the official PAR-Q+ (R3-GEN-01) | A lawyer |
| The "use at your own risk" tick, the terms and the release shown at every build | Placeholder wording | A lawyer |

He asked for the Spanish to be "translated as legally equivalent as possible" (R3-GEN-01). See [ADR-010](../04-decisions/adr-010-health-check-and-release-every-build.md) and [safety-and-liability.md](../00-overview/safety-and-liability.md).

### 9. Top-level documents

The master document lists the fixes other files still owe after round 3 ([BLAZE_CAMP_BRAIN.md](../../BLAZE_CAMP_BRAIN.md) §16.4). Two matter to a new reader. On 2026-10-09 [README.md](../../README.md) still said "Model: v1.1" and listed "the weekly check-in screens, and accounts" as not built yet. Round 3 retired both. The model is v1.2.

## The website, later

No website is being built now. This is what is already decided and what is still only a plan.

| Item | Status | Source |
|---|---|---|
| A phone-friendly website, not an app | His decision | GEN-03, R2-GEN-02 |
| Few inputs in, the whole plan out, visible ahead of time | His decision | R3-VOL-04 |
| Views of the block, the week and the day, easy to switch | His decision | R2-GEN-02 |
| A coach can screenshot 12 weeks or one week and send it | His decision | R2-GEN-02 |
| Users can switch off a day's athletic or core block, add or remove exercises, and see superset suggestions | His decision | R3-SES-02 |
| English first, with a full Spanish toggle | His decision | GEN-01, R2-GEN-08 |
| A health check with a coach bypass, and a "use at your own risk" tick at every build | His decision | R2-GEN-03, R3-GEN-01 |
| No data kept | His decision | R3-GEN-01 |
| No accounts and no database | PROPOSED: how the team carries out "no data kept" | [ADR-002](../04-decisions/adr-002-no-data-kept.md) |
| Videos are optional | His decision | R2-GEN-02 |
| Save a day as an image, a PDF, a Google Sheet download | In the proposal he marked RIGHT | R2-GEN-02 |
| The full export list (block and week images, a plan link, a plan file, a calendar) and how each export looks | PROPOSED | [synthesis/13_product_options.md](../../synthesis/13_product_options.md) §14 |
| Technology and hosting | PROPOSED | 13, Appendix E |
| Effort: about 13.5 to 20 developer-weeks for the first version | INFERRED estimate for one developer | 13 §6 and §9 |
| Free or paid coach tools | Open | 13 §11 |

## Public release checklist

The repository has a license and the notices he asked for. It still has open items before it can be called a finished public release. Check [README.md](../../README.md) for the current status line: on 2026-10-09 it read "work in progress, public for review". His approved order was to open the repository after he approves the model (R2-GEN-02), and in conversation he called it private for now. The "public for review" line is newer than both and is not recorded in an answer file or in the conversation file. Treat it as a draft shown for review, not as the finished release.

| # | Item | Status on 2026-10-09 | Source |
|---|---|---|---|
| 1 | MIT license in the repo, in his name, Blaze Camp and BFit Studios Corp. | Done | R3-GEN-01 |
| 2 | README says: at your own expense and risk; if you use it for other people, have your own liability release | Done, in English and Spanish | R3-GEN-01 |
| 3 | Disclaimers in English and Spanish | Drafts | R3-GEN-01 |
| 4 | **A licensed Florida attorney reviews both disclaimers**, and confirms the Spanish is legally equivalent | **Open** | The files themselves; R3-GEN-01 |
| 5 | He approves the model | Open | R2-GEN-02 |
| 6 | He grades the sample plans | Open | R2-GEN-07 |
| 7 | The planner is rebuilt, or the engine is clearly labelled as a draft | Labelled as a draft in the README. Rebuild in progress | Team |
| 8 | The sample plans in the repo are ones he approved | Open | Team (PROPOSED) |
| 9 | The Spanish is approved line by line | Open | R2-GEN-08 |
| 10 | He decides whether the sheet exports in `raw/` and `dumps/` stay in the public repo | Open. He has said the repo may include copies of his sheets "so people can download it and play with it." | Conversation |
| 11 | The sheet exports are checked for client names and for content that is not his: third-party video links and the half-marathon plan credited to someone else | Open | Team (PROPOSED). See [source-sheets.md](source-sheets.md) |
| 12 | The lawyer advises on the Blaze Camp name. The MIT license covers copyright. It does not grant rights in the name | Open | Team (INFERRED, 13 §8) |
| 13 | README and AGENTS show the current versions and no retired feature | Open | [BLAZE_CAMP_BRAIN.md](../../BLAZE_CAMP_BRAIN.md) §16.4 |
| 14 | A last search for retired ideas presented as current | Open. Repeat before release | [REVIEW_GUIDE.md](../../REVIEW_GUIDE.md) |
| 15 | The outside review is read, and each finding is fixed or listed "for discussion with the coach" | Open | [CODEX_BRIEF.md](../../CODEX_BRIEF.md) |
| 16 | The guide for adding exercises exists in both languages | Done | Conversation |
| 17 | Every number that is not his is marked PROPOSED | Ongoing | [method.md](method.md) |

What he wants the release to be, in his words: "the most comprehensive training model that there is out there," free "for anybody to use in their own app and their own training." (conversation). And on the name: "The Blaze Camp name is the culture." (conversation)

## Not on the roadmap

These were considered and then set aside. Each row names the answer behind it. They are listed so nobody plans them again without asking him.

| Retired | By | Record |
|---|---|---|
| A weekly check-in, a logbook, tracking | R3-VOL-02, R3-VOL-04 | [ADR-001](../04-decisions/adr-001-answers-in-plan-out-no-check-ins.md) |
| Stored data | R3-GEN-01 | [ADR-002](../04-decisions/adr-002-no-data-kept.md) |
| Accounts, and learning from users' data | The team's reading of R3-GEN-01. In round 1 he expected the tool to learn from users' data (VOL-01), so "off for good?" is still a question for him | [ADR-002](../04-decisions/adr-002-no-data-kept.md) |
| Sleep, stress and lifestyle questions | R2-GEN-04 | [ADR-003](../04-decisions/adr-003-no-lifestyle-inputs.md) |
| A native app | GEN-03 | [ADR-006](../04-decisions/adr-006-website-not-app.md) |
| A video for every exercise before launch | R2-GEN-02 | [ADR-008](../04-decisions/adr-008-videos-optional.md) |
| Bands and variable resistance | EQ-01, EQ-12. Not for now: "We will work with that later on." (EQ-12) | [ADR-034](../04-decisions/adr-034-no-bands-no-variable-resistance.md) |

The full list is on [what-he-rejected.md](../01-philosophy/what-he-rejected.md).

## Where it lives in the data

| What | File | Key or section |
|---|---|---|
| Questions waiting for him | [generator_spec_v1.json](../../generator_spec_v1.json) | `open_decisions.round4_candidates`, `open_decisions.round4_candidates_master` |
| The same list, with the team's suggestion for each | [BLAZE_CAMP_BRAIN.md](../../BLAZE_CAMP_BRAIN.md) | §16.6 |
| Fixes that other files still owe | [BLAZE_CAMP_BRAIN.md](../../BLAZE_CAMP_BRAIN.md) | §16.4 |
| The product phases and their estimates | [synthesis/13_product_options.md](../../synthesis/13_product_options.md) | §6, §9 |
| The nine decisions the planner needs | [design/diagnosis.md](../../design/diagnosis.md) | §3 |
| What the new planner must do, with a test for each requirement | [design/diagnosis.md](../../design/diagnosis.md) | §4 |
| Every rule as a constraint, with its priority tier | [design/rules_as_constraints.json](../../design/rules_as_constraints.json) | whole file |
| The planned steps of the planner work | [workflows/planner_design.js](../../workflows/planner_design.js) | phases Diagnose, Design panel, Judge, Spec, Benchmark |
| Live versions | [model/MODEL_VERSION](../../model/MODEL_VERSION), [engine/version.mjs](../../engine/version.mjs), [generator_spec_v1.json](../../generator_spec_v1.json) `_meta.version` | |

## Related

[timeline.md](timeline.md) · [method.md](method.md) · [source-sheets.md](source-sheets.md) · [ADR-048](../04-decisions/adr-048-optimizer-rebuild-of-the-planner.md) · [Decision records](../04-decisions/index.md)
