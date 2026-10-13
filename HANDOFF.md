# Handoff: current state and next steps

Last updated 2026-10-13, at the release **"model v1.4 + engine 0.7.0"**. For any person or AI agent picking this project up without the original conversation.

## What this project is

The training model of Coach Lalo (Gerardo Vera), Master NASM coach, captured from his two Google Sheets and his own answers to 261 questions (five rounds) and a few chat answers, plus an experimental engine that turns a person's basic information into a complete, editable training template in his style. The model is his intellectual property. It is shared free under the MIT license.

Start with [README.md](README.md), [MODEL_CARD.md](MODEL_CARD.md), `docs/README.md` (the map), `docs/CONTEXT_FOR_AI.md` (one-file briefing) and [AGENTS.md](AGENTS.md).

## Where things stand

The coach wants this version finished so the front-end tool can be built next. It is.

| Part | State |
|---|---|
| Model v1.4 (`BLAZE_CAMP_BRAIN.md` v1.4, `generator_spec_v1.json` 1.4.0, compiled `model/` 1.4.0) | **Complete.** Rounds 1 to 5, CT-01, CX-01..04, CH5 and CH6 are applied. Every round-5 and chat answer is traced in [coverage_matrix_round5.md](coverage_matrix_round5.md). Complete does not mean every number is his: see "Confirmed and proposed" in `MODEL_CARD.md`. |
| Engine 0.7.0 (`engine/`) | **Experimental.** Template-first, no time-fitting, all tests pass. |
| Exercise library | 742 runtime exercises (731 from the 939 source records + 11 added). 32 optional add-ons. 2 neck records stay hidden. |
| Sports and activities | 127 profiles: 52 sports, 26 "stay athletic and active" activities. 23 confirmed by the coach, 67 built on a similar sport, 37 proposed. |
| Spanish | Reviewed by the team for neutral Latin American wording. **Accepted by the coach as the starting version (CH6-03).** The 832 machine-translated lines stay listed in `model/i18n/es_review.json` for later polishing. |
| Disclaimers and the health warning | In use as written. The coach set the attorney review aside (CH6-03); the `[LEGAL REVIEW]` markers stay in the data as a reminder. |
| Front-end tool (website or form) | **Not started. It is the next step.** |
| Large planner (`design/PLANNER_SPEC.md`) | Parked as research. Do not build it. |

## What engine 0.6 and 0.7 did

**Engine 0.6** (2026-10-11 and 12) fixed what the AI coach-eye reviews found in rounds 4 to 7 (`engine/DECISIONS.md` G-100 ... G-225):
- volume: the main lift takes the first added set, every held group is said in the plan, a big group may take a bonus exercise to reach its final sets, no group above 35 sets (CH5-03)
- selection: every athletic A / B day has an arm slot (CH5-02), team practices are left to the athlete (CH5-01), safer power lifts, cleaner block changes
- words: circuit progression told from the real weeks, "What changes" by exercise, one acceleration line a week

**Engine 0.7** (2026-10-12 and 13) applied his round-5 answers and notes (G-230 ... G-305):
- **a health-check yes warns, it does not stop the plan** (R5-GEN-02)
- **2 days a week = two full-body days** (R5-GEN-01)
- high-incline press counts 1.0 chest (R5-VOL-01); no group starts at its top number (R5-CLS-07); the one-set shortfall, the heavy deadlift at 3 sets, the light chest exercise on the optional day
- jumps go two-leg and low first, single-leg and higher later (R5-GRD-03); assisted jumps with knee pain and a "skip above 6 of 10 pain" line (R5-GRD-08)
- named CrossFit workouts in the class: a Girl a week, a Hero a block (R5-GRD-04); bootcamp alternates rounds and station by station (R5-GRD-05); circuit rounds climb 3, 4, 5 in thirds (R5-CLS-03)
- incline first for throwers and volleyball, and overhead pressing kept for shoulder health (R5-ATH-04)
- the core block printed as optional (R5-GRD-06)
- `raw/`, `dumps/`, `analysis/` kept public, link-stripped, checked for client names (R5-PUB-01); credentials "Master NASM coach" only (R5-PUB-02)
- two fix rounds: the round-9 AI reviews (G-291 ... G-300) and the sweep (G-301 ... G-304)
- the release: model label 1.4.0 with the 1.3.0 seed, so no plan changed with the label (G-305)

## Grades

The coach graded the engine 0.6 plans in round 5. The AI coach-eye reviewers graded the engine 0.7 plans after his notes were applied (round 9; round 10 re-read the three plans round 9 left below A-).

| Sample | The coach's grades (round 5) | AI round 9 | AI round 10 |
|---|---|---|---|
| 01 Swimming | **A** | A | - |
| 02 Football | **A** | A | - |
| 03 Soccer | **B+** | A- | - |
| 04 CrossFit-style class | **B+** | B+ | A- |
| 05 Bootcamp | **B+** | A- | - |
| 06 Full-body aesthetics | **B+** | A- | - |
| 07 Push / pull / legs | **A** | B+ (a regression, fixed in G-291 / G-292) | A |
| 08 Pickleball, 52, knee pain | **B+** | B+ | A- |

AI grades are not his. Every sample is at A- or better by the AI reviewers' reading; he has not graded engine 0.7.

## Numbers (2026-10-13, engine 0.7.0)

| Check | Result |
|---|---|
| `node --test tests/` | 1,692 tests: 1,687 pass, 0 fail, 3 to-do, 2 skipped |
| `node tools/check-model.mjs` | 0 errors, 0 warnings |
| 8 sample plans | 8 of 8 `ok`, 0 failing error checks |
| Sweep, 1,578 intakes x 2 models (1,500 random, one per sport, one per activity) | 0 failing error checks, 0 render problems, 0 crashes |
| Benchmark, 102 plans, scorer 2.7 ([design/bench/V07.md](design/bench/V07.md)) | mean 98.04, lowest 89.35, 2 hard-rule violations in 1 plan, 60 plans pass every row |

Read with care: a benchmark score is a team tool, not a coach grade. Passing tests does not prove a plan is right for every person.

## Open items

1. **Set aside by the coach (CH6-03), not open:** an attorney review of the disclaimers, the release wording and the health warning; a line-by-line review of the Spanish (the current neutral Latin American Spanish is accepted as the starting version).
2. (Closed by CH6-03: the Spanish is accepted as a start.)
3. **Coach: severe pain.** It now builds with the moderate pain rules and the health warning (G-271, PROPOSED). Is that right?
4. **02 Football, lateral jump on Tuesday and Friday** (G-298). The library has two two-foot lateral jumps, so the first block holds one on Monday and Thursday only. A third and fourth record would close it.
5. **12 benchmark plans score slightly below engine 0.6** (by 0.1 to 1.05; G-300 lists why): the high-incline credit (bench 34, 05), the first lift's first step landing on one exposure a week before the other (seven physique and combat plans), 07's dip at 5 next to the bench at 4 in weeks 11-12 (CH6-01: he is fine with it), and athletic share (38, 02, 63).
6. **random-1332** (sweep): chest is held at 11 of its 13 final sets and the plan says so (G-301). A one-set display note, not fixed.
7. Open minors from the AI reviews (round 10) are listed in `reviews/coach-eye-r10/`. None is a hard-rule break.
8. PROPOSED readings waiting for his word are marked in `coverage_matrix_round5.md` (for example which slots go to which of the two full-body days, the weekly light overhead press in general plans, the named-WOD scaling).

## Next step: the front-end tool

Build the tool people will see (the website or form) on top of `engine/`. The engine is pure JavaScript with no I/O, so it runs in the browser as it is. Proposal: `synthesis/13_product_options.md`. Intake shape: `engine/CONTRACTS.md` §2.1. How to call it: `AGENTS.md` section 8.

Must-haves from his answers:
- the release accepted before every plan (H20), the release line on every plan, the health check with its warning (R5-GEN-02)
- few inputs, no session length, no sex, sleep or stress fields
- English and Spanish
- everything editable (CX-04): sets, exercises, blocks on or off (`engine/edit.mjs`)
- **the person's own exercise (CH6-02, approved):** they may put their own exercise anywhere with the sets they choose, answering one question only, "which muscle does it mainly work?" (chest, back, quads, hips, shoulders, biceps, triceps, calves, core, or "a jump / cardio, not a lifting set"). It counts 1.0 to that group, is flagged `custom: true`, is left out of the library-only checks, and prints "your exercise: not checked by Blaze Camp rules" in English and Spanish. Today `edit.mjs > add_exercise` takes library exercises only, so this needs a small engine addition. Adding an exercise to the official library still needs the full tagging (`docs/adding-exercises.md`) and his approval.

**Do not add accounts or stored data on your own.** R3-GEN-01 says no data is kept. Saving plans, logins or analytics would go against that. Ask the coach first; until he decides, the tool keeps nothing (the plan can be downloaded or printed).

## Git state

- Branch `engine-v06`. The release commit is on top of `24014c3` (the round-10 reviews). The lead tags and merges to `main`.
- `main` is still at engine 0.4. Do not push to `main` without the owner's say-so.
- Any change to a compile source (the spec, `coach_answers_round2.md`, `synthesis/*.json`, a layer in `tools/fixture/`) needs `node tools/fixture/build-fixture.mjs`, `node tools/compile-model.mjs` and `node tools/generate-samples.mjs` again, or a test fails.

## Authority order

1. `coach_answers_round5.md` (R5), `coach_answers_chat_2026-10-11.md` (CH5) and `coach_answers_chat_2026-10-13.md` (CH6); the chats only on their own subjects
2. `coach_answers_round4.md` (R4) and `coach_answers_time_2026-10-10.md` (CT-01)
3. `coach_answers_codex_2026-10-10.md` (CX-01..04)
4. `coach_answers_round3.md`, then `coach_answers_round2.md`, then `coach_answers_full.md` (round 1)
5. `coach_chat_statements.md` and `coach_answers.md`
6. His sheets (`raw/`, `dumps/`; programs in `analysis/programs/*.md`)
7. Anything inferred or proposed by the team

## Parked: the large planner

The two-stage optimizer in `design/PLANNER_SPEC.md` and `design/IMPLEMENTATION_PLAN.md` is research. Its hard part was fitting plans into session minutes, and CT-01 removed that. Do not build it, and do not run `workflows/planner_build.js`. The progression arithmetic from that work lives on in `engine/progression/`. The benchmark (`design/bench/`) is in use.

## Validation limits

- The coach graded the samples once (round 5, engine 0.6). Later rounds are AI-graded until he grades again.
- Edited plans: `engine/edit.mjs` recomputes totals, marks the plan `edited` and drops the old validation. It does not promise that an edit follows every rule.
- No website, accounts, stored data or tracking exist. See "Next step".

## Rules that must never be broken

See `AGENTS.md` section 10 and `docs/01-philosophy/what-he-rejected.md`. In short:

- core first (printed as optional); power before strength; horizontal before vertical
- knee-dominant work with a pull; hip-dominant work with a push
- heavy squat and heavy deadlift on different days, once each a week
- floor of 10 weekly sets from 3 training days; on 2 days (two full-body days) every big group at about 6-8
- helpers count a quarter set; athletic work never counts as muscle sets
- no bands or variable resistance
- no check-ins, tracking or stored data
- no sex or lifestyle inputs; no session-minutes input and no time-fitting
- no deload inside a block; tests only at the start and end of a block
- older adults: no Olympic lifts or plyos unless they opt in
- the release is accepted before any plan is built; a health-check yes warns, it does not stop
- English and Spanish
