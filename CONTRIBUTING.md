# Contributing to the Blaze Camp model

Thank you for helping. This repository holds the training model of coach Lalo Vera (Blaze Camp, BFit Studios Corp.) in machine-readable form, and a plan generator built on it. The model is his: our job is to capture it faithfully, explain it and make the generator follow it.

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

The coach's round-3 answers (`coach_answers_round3.md`) set the shape of the product. A change that goes against these is rejected, however good the code is.

| The product | Source |
|---|---|
| **Outputs the whole plan once**, with its built-in stairway, from a few inputs. People and coaches see the whole plan ahead of time and adjust it themselves. | COACH-R3 R3-VOL-02, R3-VOL-04 |
| **No check-ins, no tracking, no adaptive inputs.** Check-in, weekly-step-from-feedback, readiness and `adapt()` paths are being retired from the docs and the engine; don't build on them. | COACH-R3 R3-VOL-02, R3-VOL-04 |
| **Keeps no user data.** Nothing a person enters is stored. | COACH-R3 R3-GEN-01 |
| **The stairway**: weekly sets grow about 3 % a week until the halfway week and about 5 % after it, each trained group reaches its ceiling in the last week, and effort drifts from 3 reps in reserve to 2, to 1-2, to 1 + intensifiers in the last week, always inside 1-3. | COACH-R3 R3-VOL-04 |
| **When time can't hold the minimums**: tell the person up front and offer another day or longer sessions; if they keep their time, train fewer groups directly (big movers first); recommend supersets; the stairway always climbs on the trained groups. Never squeeze 2-4 exercises per group into a day that can't hold them. | COACH-R3 R3-SES-02 |
| **People and coaches can edit the plan**: switch off a day's athletic block or core block, add or remove exercises or whole blocks. The plan recommends supersets. | COACH-R3 R3-SES-02 |
| **Counts focus groups**: hips = glutes + hamstrings, shoulders = front + side + rear delts (rear delts are not a muscle of their own); calves one exercise x 3 sets per leg day. Up to two Focus muscles get 1-3 extra weekly sets. | COACH-R3 R3-SES-01, R3-VOL-01 |
| **The easy week after a block is a recommendation**, not mandatory; when a block ends, the person builds the next one. | COACH-R3 R3-PER-01 |
| **A short health check** (English and Spanish, written by a lawyer, linking to the official PAR-Q+; a coach may skip it with a warning) and **a "use at your own risk" release ticked every time a plan is built**. | COACH-R3 R3-GEN-01 |
| **Never**: a sex or gender field; sleep, stress, job or life questions; bands, chains or weight releasers; the V-squat. | COACH-ANSWER GEN-02, EQ-01, GEN-08; COACH-R2 R2-GEN-04 |
| **English by default with full Spanish.** | COACH-ANSWER GEN-01; COACH-R2 R2-GEN-08 |

The athlete defaults (swimming dryland, older adults, racket sports 50+, HYROX, plyometric shares by sport, stay-active play days) are in `coach_answers_round3.md` R3-ATH-01 … R3-ATH-05 and `BLAZE_CAMP_BRAIN.md` §9.

## 2. Authority order: who decides

When two sources disagree, the higher one wins:

1. `coach_answers_round3.md` (COACH-R3, newest)
2. `coach_answers_round2.md` (COACH-R2)
3. `coach_answers_full.md` (COACH-ANSWER, round 1)
4. `coach_answers.md` (his earlier chat statements)
5. `OBSERVED` facts from his sheets (`raw/`, decoded in `dumps/`)
6. `INFERRED`, `SCIENCE` and `PROPOSED` content written by the team

- A document or rule that contradicts a coach answer is a bug.
- A coach answer you think is scientifically questionable is **not** a bug. Raise it separately, marked "for discussion", with your sources.
- For shapes, names, file layout and APIs, `engine/CONTRACTS.md` is the authority; every gap or conflict decided once is in `engine/DECISIONS.md` (C-nn, D-nn).
- Some documents still describe round 2 as the newest authority or describe check-ins; they are being updated. Round 3 wins.

## 3. Evidence labels

Every rule, number and catalog field carries the label of where it came from. A claim without a label is incomplete.

| Label | Meaning | Example |
|---|---|---|
| `OBSERVED` | Read from his sheets (give the tab and cell) | `OBSERVED BYOP MASTER EXERCISE LIBRARY G48` |
| `COACH-ANSWER <id>` | His round-1 answer | `COACH-ANSWER VOL-09` (prime mover 1.0, helpers 0.25) |
| `COACH-R2 <id>` | His round-2 answer | `COACH-R2 R2-VOL-05` (KB swings never count as glute sets) |
| `COACH-R3 <id>` | His round-3 answer | `COACH-R3 R3-SES-02` (time vs minimums order) |
| `COACH-CHAT <date>` | Something he said in chat | `COACH-CHAT 2026-10-08` (cover every popular US sport) |
| `INFERRED` | Our reading of his sheets or answers | a level read from a load position |
| `SCIENCE` | From cited literature | NSCA contact limits |
| `PROPOSED` | Our suggestion, waiting for his approval | every new exercise until he approves it |

Keep his vocabulary: labels quoted from his sheets keep his spelling inside quotes (`'SAGITAL'`, `'TRIPPLE EXTENSION'`); canonical names use correct spelling. Both are intended.

## 4. Ways to contribute and where each change goes

| You want to | Change | Guide |
|---|---|---|
| Add an exercise or a variation | `synthesis/02_exercise_catalog.json` + its Spanish name, then recompile | [docs/adding-exercises.md](docs/adding-exercises.md) |
| Change a coaching rule or number | First an issue with the evidence. Once the coach has decided: the synthesis document and spec, the compile layer (`tools/compile/*.mjs`, `tools/fixture/review-v12.mjs`), `engine/DECISIONS.md`, tests | section 5; `AGENTS.md` §11 |
| Fix or improve the engine | `engine/*.mjs` and its tests; a shape or signature change starts as an entry in `engine/CONTRACT_REQUESTS.md` | `engine/README.md`, `engine/CONTRACTS.md`, `AGENTS.md` §11.5 |
| Improve the Spanish | `tools/compile/es/*.mjs` (every line stays PROPOSED until the coach or a coach he trusts approves it) | section 8 |
| Improve the documents | `BLAZE_CAMP_BRAIN.md`, `synthesis/*.md`, `engine/*.md`, `docs/` | keep the labels |
| Report a problem | An issue with: file, section or JSON key, what is wrong, the evidence, a suggested fix | `REVIEW_GUIDE.md` |
| Change legal text | Don't edit it. Open an issue: legal text changes go through the attorney | section 10 |

**Never edit**: the coach's Google Sheets; `raw/`, `dumps/`, `analysis/`, `answers_raw*/` (exports and decodes of his sheets and answers); `coach_answers*.md` (his words; maintainers add new rounds); anything in `model/` or `engine/fixtures/` by hand (they are generated: run the tools).

## 5. How to propose a change

1. **Open an issue first** for anything that changes coaching content (a rule, a number, a default, an exercise's classification). Say what you would change, why, and the evidence with its label.
2. **Coaching decisions belong to the coach.** If the sources are silent or conflict, the maintainers turn your proposal into a question for his next round (as in `round3_questions.json` and `coach-questions.html`: our proposal, then his verdict and his words). Until he answers, the change can ship only as `PROPOSED` (for exercises: swap-only, never a default pick) or as a documented decision in `engine/DECISIONS.md`.
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
- The coach's hard rules H01-H22 (no bands, never to failure on heavy compounds, power before strength, core first, two spine days, credits, athletic work never counts, step limits, 60+ rules, no sex field, full Spanish, no deload inside a block, floor of 10, 2-4 exercises per group, tests only at the start and end, release every build, stairway shape) are tests and validation checks. **Never weaken a hard-rule test to make a change pass.** If a test is wrong, say why in the pull request with the coach id.
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
- **Third-party content**: don't copy copyrighted material into the repository. The official PAR-Q+ is linked, never copied or changed. Video links from his sheets belong to their owners; new videos are optional and should be the coach's own.

## 10. License, disclaimer and liability

- The repository is licensed under the [MIT License](LICENSE), copyright 2026 Lalo Vera, doing business as Blaze Camp, and BFit Studios Corp. (a Florida corporation). Keep the copyright and permission notice in every copy and in substantial portions.
- **By submitting a contribution you agree that it is licensed under the same MIT License** (inbound = outbound), and that you have the right to submit it.
- [DISCLAIMER.md](DISCLAIMER.md) and [DISCLAIMER.es.md](DISCLAIMER.es.md) apply to all the training content here, including what you contribute. They release Lalo Vera, Blaze Camp, BFit Studios Corp. and the contributors from liability, and say that anyone who programs for others needs their own health screening, release and insurance.
- The disclaimer files, the license and the health-check and release copy are **drafts for review by a Florida attorney**. Don't edit them; open an issue if you see a problem. The terms in this section are part of that review.
- Nothing here is medical advice. Contributions that read as medical advice (diagnosis, treatment, rehab protocols for an injury) are out of scope; the plan refers people to a professional instead.

## 11. Pull request checklist

- [ ] One topic; data changes separate from compiler or engine changes.
- [ ] Follows the product rules in section 1 (no check-ins, no tracking, no stored data, no sex field, no lifestyle inputs, no bands).
- [ ] Every new or changed rule, number or field has an evidence label; coaching changes cite the coach id or are marked `PROPOSED`.
- [ ] No hand edits in `model/` or `engine/fixtures/`; regenerated files committed with their sources.
- [ ] `node tools/compile-model.mjs` and `node tools/check-model.mjs` pass ("errors":0).
- [ ] `node --test tests/` has 0 failures; pinned numbers updated with a reason; no hard-rule test weakened.
- [ ] `node tools/generate-samples.mjs`: every sample ok; the sample-plan diff explained.
- [ ] English and Spanish for every new user-facing string; Spanish marked for review.
- [ ] Engine code follows section 7 (no clock, no random, no `Intl`, data-driven, `why` on decisions).
- [ ] No personal data, no copied third-party content, legal files untouched.
