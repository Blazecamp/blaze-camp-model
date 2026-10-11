# Method: how the model was built and checked

The model belongs to Coach Lalo (Gerardo Vera). It is his coaching experience and his intellectual property (R4-REL-03). The method exists to keep it his. Four things do that work. Every rule carries an **evidence label** that says where it came from. Sources are ranked in a fixed **authority order**, with his newest answer on top. Every document was checked by a second reader whose only job was to find errors. And every one of his answers was traced to the exact place it is applied, in a **coverage matrix**. The writing, checking and tracing were done by AI agents run from the scripts in `workflows/`. He decided the rules, through three rounds of questions. This page explains each part, so you can judge how far to trust any statement in the repo and so you can follow the same method when you change something.

> **How to read this page.** Ids such as `VOL-17` point to his answers: no prefix is round 1, `R2-` is round 2, `R3-` is round 3, `R4-` is round 4, `CT-01` is his clarification on session time and `CX-01` to `CX-04` are his clarifications on progression and editing. **The team** means the people working with the coach plus the AI agents they ran. An **agent** is one AI worker with one task. The **master document** is [BLAZE_CAMP_BRAIN.md](../../BLAZE_CAMP_BRAIN.md), the one file that explains the whole model. The **spec** is [generator_spec_v1.json](../../generator_spec_v1.json), the same model as data for a program to read. Other terms are in the [glossary](../05-reference/glossary.md).

## The rule

| # | Rule | Set by |
|---|---|---|
| 1 | Every rule, number and exercise tag carries a label that says where it came from. | Team |
| 2 | When two sources disagree, the higher one in the authority order wins. His newest answer is the highest. | Team, [ADR-047](../04-decisions/adr-047-authority-order-and-evidence-labels.md) |
| 3 | RIGHT with no words makes the team's proposal his rule. PARTLY or NOT RIGHT means his words define the rule. | The RIGHT rule is stated at the top of each answer file. The rest is the team's reading |
| 4 | Anything he has not confirmed is marked **PROPOSED** and stays a default until he says yes. | Team |
| 5 | His answers and his sheets are never edited. | Team; FIX-04 for the sheets |
| 6 | Every document is checked by a second reader told to assume it is wrong. | Team |
| 7 | Every answer is traced to a section of the master document and a key in the spec. No row may stay missing. | Team |
| 8 | A retired idea stays on a list, so nobody rebuilds it. | Team |
| 9 | A coach answer that someone doubts is not an error. It is written up "for discussion" and the rule stays. | Team ([REVIEW_GUIDE.md](../../REVIEW_GUIDE.md), [CODEX_BRIEF.md](../../CODEX_BRIEF.md)) |

## Why

**Why his answers outrank his sheets.** The sheets hold things he did not mean. On calves and rear delts with almost no direct sets: "It wasn't intentional." (VOL-17). On a rep pattern in one tab: "That was probably a fill error or just a different program that I wrote" (PRG-06). A cell shows what he typed once. An answer shows what he means.

**Why his newest answer outranks his older ones.** His answers changed as the questions got sharper. In round 2 he approved an optional weekly check-in (R2-GEN-01). In round 3 he removed it: "I want to take away all check-in info." (R3-VOL-02). The later answer was given with more of the model in view.

**Why research never overrules him.** He asked for his numbers to be compared with published work, not replaced by it: "You should probably go and find some charts out there that can show those averages and also match them with what my experience is." (VOL-01). So research fills gaps and flags tensions. It does not change a rule he set.

**Why every rule is labelled.** He wants the result to be a resource that other coaches, gyms and developers can use (conversation). A reader who is not him must be able to tell his rule from the team's guess.

## Evidence labels

An **evidence label** is a short tag on a rule that says where the rule came from. The full set is defined at the top of [BLAZE_CAMP_BRAIN.md](../../BLAZE_CAMP_BRAIN.md).

| Label | Meaning | Weight |
|---|---|---|
| `COACH-R4 <id>` | His round-4 answer, for example `COACH-R4 R4-SES-05` | Highest |
| `COACH-CT CT-01` | His clarification on session time (2026-10-10) | Highest, on that subject only |
| `COACH-CX <id>` | His clarifications on progression and editing, `CX-01` to `CX-04` (2026-10-10) | His rule on those subjects, unless round 4 refined it |
| `COACH-R3 <id>` | His round-3 answer, for example `COACH-R3 R3-VOL-04` | His rule, unless CX, CT-01 or round 4 changed it |
| `COACH-R2 <id>` | His round-2 answer | His rule, unless a later answer changed it |
| `COACH-ANSWER <id>` | His round-1 answer, for example `COACH-ANSWER VOL-07` | His rule, unless a later round changed it |
| `COACH-CHAT` | Something he said in conversation | His meaning. A questionnaire answer wins where they differ |
| `APPROVED` | A proposal he marked RIGHT. Always shown with its id | His rule |
| `OBSERVED` | Read from a sheet cell, colour or dropdown, with his spelling kept | Evidence of how he has written programs |
| `SCIENCE` | Published research or a named practitioner source | Fills gaps and checks his numbers. Never overrules an answer |
| `RESEARCH` | Product, price, platform or legal facts from public pages | Re-check before acting |
| `INFERRED` | The team's reasoning from the sheets or the answers | A default until he confirms |
| `PROPOSED` | Short for "PROPOSED - PENDING COACH APPROVAL": the team's design where he asked for a proposal or left a gap | Ships only after his yes |
| `LEGAL REVIEW` | Health-check, terms, release and disclaimer wording | A placeholder until a lawyer writes it |
| `RETIRED` | A rule or feature one of his answers removed. The id is given | None. Kept as a short note only |
| `DORMANT` | Sheet content kept as an archive and never used, such as his notes on bands and chains | None |

The pages in this `docs/` folder use a lighter form: the answer id in brackets, such as (R3-VOL-04), and the word PROPOSED where a rule is not his yet.

**His vocabulary.** A label quoted from his sheets keeps his spelling inside quotes, for example 'SAGITAL' and 'TRIPPLE EXTENSION'. The model's own names use correct spelling. Both are intended (FIX-04).

## Authority order

| Rank | Source | File | Cited as |
|---|---|---|---|
| 1 (newest) | Round-4 answers, 20, and his clarification on session time | [coach_answers_round4.md](../../coach_answers_round4.md), [coach_answers_time_2026-10-10.md](../../coach_answers_time_2026-10-10.md) | `R4-…`, `CT-01` |
| 2 | His clarifications on progression and editing. They win only on those subjects | [coach_answers_codex_2026-10-10.md](../../coach_answers_codex_2026-10-10.md) | `CX-01` to `CX-04` |
| 3 | Round-3 answers, 13 | [coach_answers_round3.md](../../coach_answers_round3.md) | `R3-…` |
| 4 | Round-2 answers, 45 plus 2 left over from round 1 | [coach_answers_round2.md](../../coach_answers_round2.md) | `R2-…`, `LIB-10`, `LIB-12` |
| 5 | Round-1 answers, 140 questions | [coach_answers_full.md](../../coach_answers_full.md) | `CAT`, `UNI`, `VOL`, `PER`, `ATH`, `ORD`, `EQ`, `GEN`, `LIB`, `PRG`, `FIX` + number |
| 6 | What he said in conversation | [coach_chat_statements.md](../../coach_chat_statements.md), [coach_answers.md](../../coach_answers.md) | conversation |
| 7 | Facts read from his sheets | [raw/](../../raw/), [dumps/](../../dumps/) | `OBSERVED`, with tab and cell |
| 8 | Team work | [synthesis/](../../synthesis/), the master, the spec | `INFERRED`, `SCIENCE`, `PROPOSED` |

**How a verdict is read.**

| His response | What it means for the rule |
|---|---|
| RIGHT, no words | The team's assumption or proposal is now his rule |
| RIGHT, with words | The proposal stands and his words add to it |
| PARTLY or NOT RIGHT | His words define the rule. The proposal is dropped or rewritten |
| Words, no chip | His words define the rule |
| SKIP / NOT SURE, or no answer | Open. Asked again in the next round |
| "I don't understand this question." | Asked again in plain words. Example: R2-VOL-08 was re-asked as R3-VOL-03 |

**When two of his answers pull against each other.** The team writes down its reading, marks it INFERRED or PROPOSED, and puts the question on the list for the next round. The current list is in [BLAZE_CAMP_BRAIN.md](../../BLAZE_CAMP_BRAIN.md) §0c.3 and §16.6.

## How a question was asked

1. The team wrote each question with its own assumption or proposal next to it, so he could correct a concrete statement instead of starting from a blank.
2. The questions went on one web page, [coach-questions.html](../../coach-questions.html). Each had four chips ('That's right', 'Partly', 'Not right', 'Skip / not sure') and a text box. The answer files show the chips as RIGHT, PARTLY, NOT RIGHT and SKIP/NOT SURE.
3. He tapped a chip and dictated where he had more to say.
4. Each answer was saved as one small file per question, then written into a readable answer file with the question, the assumption, his chip and his words.

| Round | Questions asked | Raw answers | Readable answers |
|---|---|---|---|
| 1 | In the page itself | `answers_raw/answers/<id>.json` | [coach_answers_full.md](../../coach_answers_full.md) |
| 2 | [round2_questions.json](../../round2_questions.json) | `answers_raw_r2/answers/<id>.json` | [coach_answers_round2.md](../../coach_answers_round2.md) |
| 3 | [round3_questions.json](../../round3_questions.json) | `answers_raw_r3/answers/<id>.json` | [coach_answers_round3.md](../../coach_answers_round3.md) |

His words are dictation, kept as spoken. The conversation file is different: it is "paraphrased closely", with his exact phrases inside quotation marks. Treat a questionnaire answer as his exact wording and a conversation line as his meaning.

## How an answer was applied

Each round ran the same five steps.

| Step | What happens | Why |
|---|---|---|
| 1. Update | One agent per group of model documents reads the answer file in full, then rewrites its documents so that tables, examples and data all agree with the answers | A changelog at the top is not enough. The old rule must be gone from the body |
| 2. Check | A second agent lists every answer that touches those documents and confirms each is applied everywhere. It searches for leftovers of retired ideas. It fixes what it finds and adds a verification log | The writer does not grade its own work |
| 3. Master | The master document and the spec are rebuilt from the updated documents. The old master is archived unchanged first | One place to read the whole model |
| 4. Coverage | Every answer id is traced to a master section and a spec key. Gaps are fixed in place | Proof that no answer was dropped |
| 5. Next questions | Gaps, new proposals and tensions become the next round's questions | He decides, not the team |

## Verification

**The adversarial fact-check.** "Adversarial" means the checker is told to assume the document contains errors and to try to prove it. For the first documents the checker had to:

- check every claim marked OBSERVED against the raw dumps: wrong cell values, invented labels, wrong counts, a guess presented as an observation;
- recompute at least five key numbers on its own, with a script run on the dumps;
- check research claims for obvious errors;
- fix the file in place and add a "Verification log" at the end saying what changed;
- not soften his actual practice into textbook practice.

Most model files in [synthesis/](../../synthesis/) end with one or more verification logs, one per pass. They are the record of what was wrong and what was corrected.

**Machine checks.** Scripts confirmed things a reader can miss:

| Check | What it catches |
|---|---|
| Every answer id is cited at least once in the master and in the spec | A dropped answer |
| Every spec key and master section named in a coverage matrix exists | A trace that points nowhere |
| The spec and the question files parse as JSON and keep their format | A broken file |
| No Markdown table row has the wrong number of columns | A broken table |
| Key numbers are recomputed with a script, not typed by hand | A copying error |

**Cross-file decisions.** Where two model documents disagreed, the master picked one and recorded both sides. The spec holds 38 such rows under `_meta.integration_decisions`. The master shows them in [BLAZE_CAMP_BRAIN.md](../../BLAZE_CAMP_BRAIN.md) §0.3.

**Retired ideas.** Each round ended with a search for ideas he had rejected: the weekly percentage by muscle size, the 0.5 helper credit, bands and chains, a sex field, lifestyle questions, deloads inside a block, and, after round 3, check-ins, rear delts with sets and a floor of their own, and a mandatory easy week. After CT-01, CX and round 4 the list grew again: fitting a plan to session minutes, a hard cap on the weekly step, "sets must rise every week", dropping groups automatically, a proposed exercise as a template pick, and third-party video links. A hit outside a "retired" note is a bug. The list is in [AGENTS.md](../../AGENTS.md) and on [what-he-rejected.md](../01-philosophy/what-he-rejected.md).

## Coverage matrices

A **coverage matrix** is a table with one row per answer. Each row gives the rule in one line, the section of the master that carries it, the key in the spec that carries it, and a status.

| File | Round | Answers traced | Result |
|---|---|---|---|
| [coverage_matrix.md](../../coverage_matrix.md) | 1 | 138 | 106 already right; 32 fixed during the audit (3 were wrong, 29 missing or incomplete) |
| [coverage_matrix_round2.md](../../coverage_matrix_round2.md) | 2 | 47, plus his sport request | All added to the master. In the spec: 4 already right, 44 fixed |
| [coverage_matrix_round3.md](../../coverage_matrix_round3.md) | 3 | 13, in 26 rows | All added to the master. In the spec: 8 already right, 18 fixed |

In rounds 2 and 3 most rows read "fixed" because the older master had been written before that round, so each new answer was missing by definition. What matters is the last line of each matrix: no row is left missing or wrong.

The three wrong items found in round 1 show what the audit is for:

| What was wrong | Corrected to | Id |
|---|---|---|
| Glutes still got half a set from every hinge | A quarter set | VOL-09 |
| Bodybuilders' upper body was 80 to 90 % bilateral from week 1 | About 50/50 in weeks 1 to 4, then 80/20 to 90/10 (upper-body numbers PROPOSED) | UNI-03 |
| Push press was offered only to intermediate and up | Also offered at level 1 | LIB-13 |

## The workflow scripts

A **workflow** is a script that runs many agents in a fixed order. The ten scripts in [workflows/](../../workflows/) are kept as a record of what each agent was told. Nine of them ran. One, the planner build, was written and never run on the engine. They are plain JavaScript that calls a few helpers from the runner: `agent` starts one agent with a written task, `parallel` runs several at once, `pipeline` sends each piece of work through a writer and then a checker, and `phase` names the stage.

| Script | When | Phases | What it produced |
|---|---|---|---|
| `blaze-camp-brain-wf_25f93acb-288.js` | 2026-10-07 to 10-08 | Decode, Synthesize, Verify, Assemble | [analysis/](../../analysis/) library, reference and programs; `synthesis/01` to `09`; master v0; spec v0 |
| `blaze-camp-equipment-variables-wf_3240881f-e01.js` | 2026-10-07 to 10-08 | Decode, Science, Synthesize, Verify | [analysis/equipment/](../../analysis/equipment/); `synthesis/10`, `10b`, `11` |
| `v1_integrate.js` | 2026-10-08 | Research, Update, Verify, Master, Coverage | `synthesis/12` and `13`; all documents at v1; master v1; spec v1; `coverage_matrix.md`; the round-2 questions |
| `v1_1_round2_sports.js` | 2026-10-08 | Round 2, Sports, Merge, Verify, Master, Phase 0 | Documents at v1.1; [synthesis/sports/](../../synthesis/sports/); 127 profiles; master v1.1; `coverage_matrix_round2.md`; the round-3 questions |
| `phase0_engine.js` | 2026-10-08 to 10-09 | Contracts, Build, Integrate, Coach review, Fix | [engine/](../../engine/), [model/](../../model/), [tests/](../../tests/), [tools/](../../tools/), the 8 sample intakes and plans |
| `v1_2_engine_v0_4.js` | 2026-10-09 | Model v1.2, Open-source docs, Engine fixes, Coach review, Fix loop | Documents at v1.2; master v1.2; `coverage_matrix_round3.md`; `AGENTS.md`, `llms.txt`, `CONTRIBUTING.md`, the adding-exercises guide; engine 0.4 |
| `planner_design.js` | 2026-10-09 to 10-10 | Diagnose, Design panel, Judge, Spec, Benchmark | [design/](../../design/): the diagnosis, the algorithm research, the rules written as constraints, three designs, the judges' files, the planner specification, the benchmark and the engine 0.4 baseline. The planner itself was parked on 2026-10-11: see [timeline.md](timeline.md) section 23 |
| `planner_build.js` | 2026-10-10 | (not run) | The build workflow for the large planner. Parked with it. Do not run it |
| `docs_guidance.js` | 2026-10-09 | Write, Check, Map | The guidance folders in `docs/` |
| `engine_v05.js` | 2026-10-11 | Engine v0.5, Coach review, Model v1.3 | Engine 0.5 in four packages; three coach-eye reviews of the 8 samples with two fix rounds; the master at v1.3, the round-4 decision records and the release documents |

**Rules the scripts gave every agent.**

| Rule | Why |
|---|---|
| Read the newest answer file in full before anything else | So no agent works from a stale rule |
| Write only the files you own. Never write in another workflow's folders | Several workflows ran at the same time |
| Never open a Google Sheet for writing | The sheets are his |
| Quote his labels exactly | His vocabulary is part of the model |
| Mark what is observed, inferred, research or proposed | A reader must see the difference |
| Fix the engine or the rules, never a plan by hand | A hand-edited plan hides the fault |
| Do not commit | The lead reviews before anything is committed |

## How the engine was checked

The engine followed the same idea with code tools.

| Tool | What it is | Where |
|---|---|---|
| Contracts | The fixed shapes of the intake, the plan and the model files | [engine/CONTRACTS.md](../../engine/CONTRACTS.md) |
| Decision log | Every judgement call where the sources were silent or in conflict, decided once and numbered | [engine/DECISIONS.md](../../engine/DECISIONS.md) |
| Validators | Checks the engine runs on its own plan: his hard rules and the model's limits | [engine/validate.mjs](../../engine/validate.mjs) |
| Tests | One test for each hard rule and for each review issue that was fixed | [tests/](../../tests/) |
| Sweep | The engine run on 1,500 random intakes plus every sport and every activity | [tools/sweep.mjs](../../tools/sweep.mjs) |
| Benchmark | 94 test intakes plus the 8 samples, scored by a checker written separately from the engine | [design/bench/](../../design/bench/) |
| Coach-eye review | One AI reviewer per sample plan, reading it the way the coach would and grading it | [samples/STATUS_v0.5.md](../../samples/STATUS_v0.5.md) (engine 0.5), [samples/REVIEW_LOG.md](../../samples/REVIEW_LOG.md) (engine 0.3 and 0.4) |

**What this taught.** On 2026-10-09 no error-level check failed on any swept intake, and the reviewers still graded the plans C- to D (D to B- after the first round of fixes). The validators had been changed together with the engine, so they agreed with it. The lesson: the checker must be written separately from the engine, straight from his rules. See [ADR-048](../04-decisions/adr-048-optimizer-rebuild-of-the-planner.md). Engine 0.5 kept that lesson. Its benchmark scorer lives apart from the engine in `design/bench/`, and the sample plans are still read against his real programs after every change. Even so, where the scorer and the engine disagreed during v0.5, the scorer was sometimes the one corrected, and each such change is listed in `samples/STATUS_v0.5.md` so a reader can discount it.

## What the method does not guarantee

| Limit | What it means for you |
|---|---|
| The documents were written by AI agents | A second agent checked each one, but only he can confirm a rule. Trust an answer id more than any sentence around it |
| A coach-eye review is not the coach | He has not graded a sample plan yet (R2-GEN-07 says he will) |
| Research citations were checked for obvious errors only | A full check of the science is the job given to the outside reviewer in [CODEX_BRIEF.md](../../CODEX_BRIEF.md) |
| Many numbers are PROPOSED | They are defaults. Each is marked where it appears |
| Spanish is partly machine-translated | Those lines are marked for review. He or a coach he trusts approves every line (R2-GEN-08) |
| The legal texts are drafts | [DISCLAIMER.md](../../DISCLAIMER.md) and [DISCLAIMER.es.md](../../DISCLAIMER.es.md) need a licensed Florida attorney |
| Conversation lines are paraphrased closely | Only the phrases inside quotation marks are his exact words |
| The engine is changing | To learn his rules, read the model documents, not the engine code |

## If you change something

1. Find the newest answer on the topic. Start from [the answer index](../03-coach-answers/index.md).
2. If he has not answered it, your change is PROPOSED. Say so where you write it.
3. Label every rule you write.
4. Change the human document and the data together, so they keep the same numbers.
5. Do not edit his answer files, `raw/` or `dumps/`.
6. Run the checks listed in [CONTRIBUTING.md](../../CONTRIBUTING.md).

The full guide is [CONTRIBUTING.md](../../CONTRIBUTING.md). For exercises, use [adding-exercises.md](../adding-exercises.md).

## Where it lives in the data

| What | File | Key or section |
|---|---|---|
| The authority order | [generator_spec_v1.json](../../generator_spec_v1.json) | `_meta.authority_order` |
| The allowed labels | [generator_spec_v1.json](../../generator_spec_v1.json) | `_meta.status_values` |
| Cross-file decisions | [generator_spec_v1.json](../../generator_spec_v1.json) | `_meta.integration_decisions` |
| What each round changed in the spec | [generator_spec_v1.json](../../generator_spec_v1.json) | `_meta.v1_1_changelog`, `_meta.v1_2_changelog`, `_meta.coverage_audit`, `_meta.coverage_audit_round3` |
| Open, answered and next-round questions | [generator_spec_v1.json](../../generator_spec_v1.json) | `open_decisions` |
| Observed or inferred, field by field, for each exercise | [synthesis/02_exercise_catalog.json](../../synthesis/02_exercise_catalog.json) | `observed_fields`, `inferred_fields` |
| The label definitions | [BLAZE_CAMP_BRAIN.md](../../BLAZE_CAMP_BRAIN.md) | "Evidence labels", near the top |
| How each master version was built and checked | [BLAZE_CAMP_BRAIN.md](../../BLAZE_CAMP_BRAIN.md) | Appendix B |
| The verification logs | most files in [synthesis/](../../synthesis/) | the sections titled "Verification log" |
| What the compiler checked against the sources | [model/COMPILE_REPORT.json](../../model/COMPILE_REPORT.json) | whole file |

## Related

[timeline.md](timeline.md) · [source-sheets.md](source-sheets.md) · [roadmap.md](roadmap.md) · [ADR-047](../04-decisions/adr-047-authority-order-and-evidence-labels.md) · [AGENTS.md](../../AGENTS.md) §3
