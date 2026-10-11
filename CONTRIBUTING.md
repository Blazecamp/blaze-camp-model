# Contributing to the Blaze Camp model

Thank you for helping. This repository holds the training model of Coach Lalo (Gerardo Vera), Master NASM coach (Blaze Camp, BFit Studios Corp.) in machine-readable form, and an experimental plan generator built on it. The model is his work and his intellectual property (COACH-R4 R4-REL-03): our job is to capture it faithfully, explain it and make the generator follow it.

*Español: la guía para agregar ejercicios está en [docs/adding-exercises.es.md](docs/adding-exercises.es.md) y el descargo de responsabilidad en [DISCLAIMER.es.md](DISCLAIMER.es.md).*

> **Use at your own risk.** Everything here is general fitness information, not medical advice. Downloading, using or contributing to this repository is at your own expense and risk. If you use it to program for clients or anyone else, you need your own health screening, liability release and insurance. Read [DISCLAIMER.md](DISCLAIMER.md) (English) or [DISCLAIMER.es.md](DISCLAIMER.es.md) (Spanish). License: [MIT](LICENSE).

## Contents

1. [What the product is, and what it is not](#1-what-the-product-is-and-what-it-is-not)
2. [Authority order: who decides](#2-authority-order-who-decides)
3. [Evidence labels](#3-evidence-labels)
4. [Ways to contribute and where each change goes](#4-ways-to-contribute-and-where-each-change-goes)
5. [How to propose a change](#5-how-to-propose-a-change)
6. [Running the checks](#6-running-the-checks)
7. [Rules for engine and tool code](#7-rules-for-engine-and-tool-code)
8. [Spanish](#8-spanish)
9. [Data, privacy and safety](#9-data-privacy-and-safety)
10. [License, disclaimer and liability](#10-license-disclaimer-and-liability)
11. [Pull request checklist](#11-pull-request-checklist)

## 1. What the product is, and what it is not

The coach's answers set the shape of the product: round 3 (`coach_answers_round3.md`), then his clarifications CT-01 and CX-01..04, then round 4 (`coach_answers_round4.md`), which is the newest. A change that goes against these is rejected, however good the code is.

| The product | Source |
|---|---|
| **Outputs the whole plan once**, with its built-in stairway, from a few inputs. People and coaches see the whole plan ahead of time and adjust it themselves. The output is an editable template. | COACH-R3 R3-VOL-02, R3-VOL-04; COACH-CX CX-04 |
| **No time-fitting.** Session minutes are not an input and not a limit. A session is sized by its number of exercises (general 5-7, aesthetics 6-8, strength 5-6, bootcamp 5-7 stations, field athletes up to 12, older adults 5-6). The plan prints an average time as information only. | COACH-CT CT-01; COACH-R4 R4-SES-01, R4-SES-02 |
| **The coach's own templates are the skeleton**: A day = pull + knee dominant, B day = push + hip dominant, push / pull / legs and the others in his sheets. Don't invent day layouts. | COACH-R4 R4-SES-05 |
| **Nothing is dropped automatically.** The template comes out complete and the person chooses what to remove. On 2 days a week every big group is still trained, at about 6-8 weekly sets, and the plan suggests a third day. | COACH-R4 R4-SES-03, R4-SES-04 |
| **No check-ins, no tracking, no adaptive inputs.** Check-in, weekly-step-from-feedback, readiness and `adapt()` paths are retired from the docs and the engine; don't rebuild them. | COACH-R3 R3-VOL-02, R3-VOL-04 |
| **Keeps no user data.** Nothing a person enters is stored. | COACH-R3 R3-GEN-01 |
| **The stairway**: weekly sets per group climb from a start to a planned final number, and the final number is reached, in the last week or one week early. About 3 % a week early and 5 % later is the usual feel, not a limit: faster steps are allowed, and a week that adds more than about 15 % carries a note. A week may hold the same sets while reps or load progress. Effort drifts from 3 reps in reserve to 2, to 1-2, to 1 + intensifiers in the last week, always inside 1-3. | COACH-R3 R3-VOL-04; COACH-CX CX-01..03; COACH-R4 R4-PRG-01, R4-PRG-02 |
| **Reps and load progress by a rule the person applies** ("when you hit 12 on every set with 1-2 reps left in the tank, add weight next time and start again at 8"), never a promised number per week. | COACH-R4 R4-PRG-03 |
| **People and coaches can edit everything**: sets for any day or week, add or remove exercises or whole blocks, switch off a day's athletic block or core block. The plan recommends supersets as a way to save time. (The time-fit parts of R3-SES-02 are retired by CT-01 and round 4.) | COACH-R3 R3-SES-02; COACH-CX CX-02, CX-04 |
| **Counts focus groups**: hips = glutes + hamstrings, shoulders = front + side + rear delts (rear delts are not a muscle of their own); calves one exercise x 3 sets per leg day. Up to two Focus muscles get 1-3 extra weekly sets. | COACH-R3 R3-SES-01, R3-VOL-01 |
| **The easy week after a block is a recommendation**, not mandatory; when a block ends, the person builds the next one. | COACH-R3 R3-PER-01 |
| **A short health check** (English and Spanish, written by a lawyer, linking to the official PAR-Q+; a coach may skip it with a warning). **Everyone may use the plans, and the terms and release of liability must be accepted before a plan is generated.** A short release line is printed on every plan in English and Spanish. | COACH-R3 R3-GEN-01; COACH-R4 R4-SCP-01, R4-SCP-02 |
| **Proposed exercises are optional add-ons**, never a template pick (wall balls and sled pushes in HYROX and the CrossFit-style class excepted). **No third-party video links**: each exercise carries a YouTube search link built from its name. | COACH-R4 R4-LIB-01, R4-LIB-05 |
| **Never**: a sex or gender field; sleep, stress, job or life questions; bands, chains or weight releasers; the V-squat; a claim that the model is the best or that it prevents injury. | COACH-ANSWER GEN-02, EQ-01, GEN-08; COACH-R2 R2-GEN-04; COACH-R4 R4-REL-03 |
| **English by default with full Spanish.** | COACH-ANSWER GEN-01; COACH-R2 R2-GEN-08 |

The athlete defaults (swimming dryland, older adults, racket sports 50+, HYROX, plyometric shares by sport, stay-active play days) are in `coach_answers_round3.md` R3-ATH-01 … R3-ATH-05 and `BLAZE_CAMP_BRAIN.md` §9.

## 2. Authority order: who decides

When two sources disagree, the higher one wins:

1. `coach_answers_round4.md` (COACH-R4, the newest round) and `coach_answers_time_2026-10-10.md` (COACH-CT CT-01, on session time only)
2. `coach_answers_codex_2026-10-10.md` (COACH-CX CX-01..04, on progression and editing only)
3. `coach_answers_round3.md` (COACH-R3)
4. `coach_answers_round2.md` (COACH-R2)
5. `coach_answers_full.md` (COACH-ANSWER, round 1)
6. `coach_chat_statements.md` and `coach_answers.md` (things he said in conversation)
7. `OBSERVED` facts from his sheets (`raw/`, decoded in `dumps/`)
8. `INFERRED`, `SCIENCE` and `PROPOSED` content written by the team

- A document or rule that contradicts a coach answer is a bug.
- A coach answer you think is scientifically questionable is **not** a bug. Raise it separately, marked "for discussion", with your sources.
- For shapes, names, file layout and APIs, `engine/CONTRACTS.md` is the authority (its engine 0.5.0 amendment boxes at the top supersede the older text); every gap or conflict decided once is in `engine/DECISIONS.md` (C-nn, D-nn, E-nn, G-nn).
- If an older document still describes a session-length input, a time check, a hard cap on the weekly step or check-ins, it is out of date. The newest answer wins. Report it.

## 3. Evidence labels

Every rule, number and catalog field carries the label of where it came from. A claim without a label is incomplete.

| Label | Meaning | Example |
|---|---|---|
| `OBSERVED` | Read from his sheets (give the tab and cell) | `OBSERVED BYOP MASTER EXERCISE LIBRARY G48` |
| `COACH-ANSWER <id>` | His round-1 answer | `COACH-ANSWER VOL-09` (prime mover 1.0, helpers 0.25) |
| `COACH-R2 <id>` | His round-2 answer | `COACH-R2 R2-VOL-05` (KB swings never count as glute sets) |
| `COACH-R3 <id>` | His round-3 answer | `COACH-R3 R3-VOL-04` (the whole plan, once, with few inputs) |
| `COACH-CX <id>` | His clarification on progression and editing | `COACH-CX CX-01` (reach the planned final sets) |
| `COACH-CT CT-01` | His clarification on session time | `COACH-CT CT-01` (no time-fitting) |
| `COACH-R4 <id>` | His round-4 answer | `COACH-R4 R4-SES-05` (the A day and B day templates) |
| `COACH-CHAT <date>` | Something he said in chat | `COACH-CHAT 2026-10-08` (cover every popular US sport) |
| `INFERRED` | Our reading of his sheets or answers | a level read from a load position |
| `SCIENCE` | From cited literature | NSCA contact limits |
| `PROPOSED` | Our suggestion, waiting for his approval | every new exercise until he approves it (an optional add-on at most) |

Keep his vocabulary: labels quoted from his sheets keep his spelling inside quotes (`'SAGITAL'`, `'TRIPPLE EXTENSION'`); canonical names use correct spelling. Both are intended.

## 4. Ways to contribute and where each change goes

| You want to | Change | Guide |
|---|---|---|
| Add an exercise or a variation | `synthesis/02_exercise_catalog.json` + its Spanish name, then recompile | [docs/adding-exercises.md](docs/adding-exercises.md) |
| Change a coaching rule or number | First an issue with the evidence. Once the coach has decided: the synthesis document and spec, the compile layer (`tools/compile/*.mjs` and the shared amendment layers in `tools/fixture/`), `engine/DECISIONS.md`, tests | section 5; `AGENTS.md` §11 |
| Fix or improve the engine | `engine/*.mjs` and its tests; a shape or signature change starts as an entry in `engine/CONTRACT_REQUESTS.md` | `engine/README.md`, `engine/CONTRACTS.md`, `AGENTS.md` §11.5 |
| Improve the Spanish | `tools/compile/es/*.mjs` (every line stays PROPOSED until the coach or a coach he trusts approves it) | section 8 |
| Improve the documents | `BLAZE_CAMP_BRAIN.md`, `synthesis/*.md`, `engine/*.md`, `docs/` | keep the labels |
| Report a problem | An issue with: file, section or JSON key, what is wrong, the evidence, a suggested fix | `REVIEW_GUIDE.md` |
| Change legal text | Don't edit it. Open an issue: legal text changes go through the attorney | section 10 |

**Never edit**: the coach's Google Sheets; `raw/`, `dumps/`, `analysis/`, `answers_raw*/` (exports and decodes of his sheets and answers); `coach_answers*.md` (his words; maintainers add new rounds); anything in `model/` or `engine/fixtures/` by hand (they are generated: run the tools).

## 5. How to propose a change

1. **Open an issue first** for anything that changes coaching content (a rule, a number, a default, an exercise's classification). Say what you would change, why, and the evidence with its label.
2. **Coaching decisions belong to the coach.** If the sources are silent or conflict, the maintainers turn your proposal into a question for his next round (as in `round4_questions.json` and `coach-questions.html`: our proposal, then his verdict and his words). Until he answers, the change can ship only as `PROPOSED` (for exercises: an optional add-on, never a template pick) or as a documented decision in `engine/DECISIONS.md`.
3. **Work on a branch** (or a fork once the repository is public); never push to `main`. One topic per pull request: a data change (catalog, Spanish) is separate from a compiler or engine change.
4. **Make the change, regenerate, test** (section 6). Commit the regenerated `model/`, fixture and sample plans together with the change that caused them.
5. **Open the pull request** with: what changed and why; the evidence labels and coach ids; the commands you ran and their results; what changed in the sample plans and why. Use the checklist in section 11.

Engine contract changes: append an entry to `engine/CONTRACT_REQUESTS.md` (the format is at the top of that file) and implement the closest compliant thing meanwhile; never diverge from `engine/CONTRACTS.md` silently.

## 6. Running the checks

Node 22, no npm install (there are no dependencies). Python 3 standard library only for JSON helpers. From the repo root:

```sh
node tools/compile-model.mjs                       # sources -> model/ (exit 1 = contract error, nothing written)
node tools/check-model.mjs                         # contract checks on model/ (must report "errors":0)
node tools/fixture/build-fixture.mjs && node tools/fixture/check-fixture.mjs   # when the sources changed
node --test tests/                                 # the whole suite: 0 failures (a few tests are "todo" on purpose)
node tools/generate-samples.mjs                    # the 8 sample plans -> samples/plans/ (every sample must say ok)
```

One module's tests: `node --test tests/volume.test.mjs`. One sample: `node tools/generate-samples.mjs --only 08`.

What the suite guards:
- `model/` on disk must be the current compile of the sources (`tests/compile.test.mjs`). If you changed a source, recompile and commit `model/`.
- The coach's hard rules H01-H22 (no bands, never to failure on heavy compounds, power before strength, core first, two spine days, credits, athletic work never counts, final sets reached, 60+ rules, no sex field, full Spanish, no deload inside a block, floor of 10 from 3 training days and the 2-day rule, the template's exercises per group, tests only at the start and end, the liability gate, stairway shape) and the v0.5 rules (no time-fitting, his template slot for slot, optional add-ons never picked, no third-party video links, progression as a rule, nothing removed automatically) are tests and validation checks. **Never weaken a hard-rule test to make a change pass.** If a test is wrong, say why in the pull request with the coach id.
- Determinism: the same intake and model give a byte-identical plan. Two compiles of the same sources are byte-identical.
- Some numbers are pinned on purpose (exercise counts, machine-translated Spanish lines) so that a change is noticed. Update them in the same pull request and say why.

## 7. Rules for engine and tool code

From `engine/CONTRACTS.md` §1.2-1.3 (binding):

- Plain ES modules (`.mjs`), Node 22, **no npm dependencies**, no TypeScript, no build step.
- Engine files import only other `engine/*.mjs` files: no `node:` imports, no file system, no `process`, no `console`, no `fetch`. They run unchanged in a browser. File I/O lives in `tools/`.
- **No** `Date.now()`, `new Date()` without an argument, `Math.random()`, `performance.now()`, `Intl`, `toLocaleString` or `localeCompare`. Dates are `YYYY-MM-DD` strings; tie-breaks use the seeded helpers in `engine/util.mjs`.
- Pure functions: never mutate inputs. Every exported function has a JSDoc block with the typedef names of CONTRACTS §4.0.
- **Data-driven**: every number or list that exists in `model/rules.json`, `templates.json` or `profiles.json` is read from the model, never re-typed. A literal is allowed only for structure, or with `// INFERRED: <why>` plus a `CONTRACT_REQUESTS.md` entry so it can move into the rules.
- Every non-trivial decision carries a `why` (`{key, ref, args}`) whose `ref` is the coach id, rule or decision behind it.
- Every user-facing word is an i18n key with English and Spanish; the engine stores keys, `render.mjs` / `explain.mjs` turn them into words.
- Programmer errors throw `EngineError`; problems with a person's input are returned as issues, never thrown.

## 8. Spanish

- Neutral Latin American Spanish with the English gym term in brackets: "Empuje de cadera con barra (Hip Thrust)" (COACH-R2 R2-GEN-08). Legal texts in Spanish must be as legally equivalent to the English as possible (COACH-R3 R3-GEN-01); that is the attorney's job, not a translation table's.
- Every Spanish line is `PROPOSED` until the coach, or a coach he trusts, approves it. Lines written by the compiler's tables are listed in `model/i18n/es_review.json > machine_translated`.
- Copy marked `[LEGAL REVIEW]` (health check, release, coach bypass warning) and the disclaimer files are never edited by contributors.
- Band words fail the check in Spanish too ("liga", "banda", "cadena").

## 9. Data, privacy and safety

- **No personal data in the repository**: no real client names, emails, health details or photos. Sample intakes describe made-up people.
- **The generator keeps no data** (R3-GEN-01). Don't add analytics, accounts, tracking, storage of inputs or check-in history. Anyone who builds an app from this repository is responsible for their own privacy terms (DISCLAIMER.md §7).
- **No sex or gender field** and no sleep, stress, job or life inputs anywhere: intake, derived values, plan (hard rules H13, H16).
- **Safety rules are not optional**: the never-lists for older adults and injured or high-volume clients, the medball limit of 20 lb, never to failure on heavy compounds, no bands. A contribution that loosens one needs a coach answer behind it.
- **Third-party content**: don't copy copyrighted material into the repository. The official PAR-Q+ is linked, never copied or changed. Video links from his sheets belong to their owners and are not part of the model data: never add a third-party video link (COACH-R4 R4-LIB-05). Each exercise gets a YouTube search link built from its name; new videos are optional and should be the coach's own.

## 10. License, disclaimer and liability

- The repository is licensed under the [MIT License](LICENSE), copyright 2026 Lalo Vera, doing business as Blaze Camp, and BFit Studios Corp. (a Florida corporation). Keep the copyright and permission notice in every copy and in substantial portions.
- **By submitting a contribution you agree that it is licensed under the same MIT License** (inbound = outbound), and that you have the right to submit it.
- [DISCLAIMER.md](DISCLAIMER.md) and [DISCLAIMER.es.md](DISCLAIMER.es.md) apply to all the training content here, including what you contribute. They release Lalo Vera, Blaze Camp, BFit Studios Corp. and the contributors from liability, and say that anyone who programs for others needs their own health screening, release and insurance.
- The disclaimer files, the license and the health-check and release copy are **drafts for review by a Florida attorney**. Don't edit them; open an issue if you see a problem. The terms in this section are part of that review.
- Nothing here is medical advice. Contributions that read as medical advice (diagnosis, treatment, rehab protocols for an injury) are out of scope; the plan refers people to a professional instead.

## 11. Pull request checklist

- [ ] One topic; data changes separate from compiler or engine changes.
- [ ] Follows the product rules in section 1 (no time-fitting, no check-ins, no tracking, no stored data, no sex field, no lifestyle inputs, no bands, no third-party video links).
- [ ] Every new or changed rule, number or field has an evidence label; coaching changes cite the coach id or are marked `PROPOSED`.
- [ ] No hand edits in `model/` or `engine/fixtures/`; regenerated files committed with their sources.
- [ ] `node tools/compile-model.mjs` and `node tools/check-model.mjs` pass ("errors":0).
- [ ] `node --test tests/` has 0 failures; pinned numbers updated with a reason; no hard-rule test weakened.
- [ ] `node tools/generate-samples.mjs`: every sample ok; the sample-plan diff explained.
- [ ] English and Spanish for every new user-facing string; Spanish marked for review.
- [ ] Engine code follows section 7 (no clock, no random, no `Intl`, data-driven, `why` on decisions).
- [ ] No personal data, no copied third-party content, legal files untouched.
