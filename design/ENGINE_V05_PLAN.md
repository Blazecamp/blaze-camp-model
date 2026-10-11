# Engine v0.5 plan: template-first, no time-fitting

Written 2026-10-11 after the coach's newest answers. This **replaces** the large two-stage planner build (`PLANNER_SPEC.md`, `IMPLEMENTATION_PLAN.md`) as the next step. Those documents stay as research. Most of their difficulty came from fitting plans into session minutes, and the coach has now removed that requirement.

## Authority (newest first)
`coach_answers_round4.md` (R4-*) and `coach_answers_time_2026-10-10.md` (CT-01) > `coach_answers_codex_2026-10-10.md` (CX-01..04) > round 3 > round 2 > round 1 > chat statements > sheets.

## What changed, in the coach's terms
1. **No time-fitting (CT-01, R4-SES-01).**
   - Session minutes are not an input and not a constraint.
   - The plan prints an average time estimate per day as information only.
   - Remove the time check, every time cutter, the "trained vs not trained because of time" logic, the 100% / 110% day rules, time-based offers, and every validator and benchmark metric about minutes.
2. **Sessions are sized by exercise count (R4-SES-02).** Counts exclude the warm-up and the 2 core exercises.

   | Client type | Exercises per session |
   |---|---|
   | General fitness / fat loss | 5–7 |
   | Aesthetics / bodybuilding | 6–8 |
   | Strength | 5–6 |
   | Bootcamp | 5–7 stations |
   | Field athletes, off-season | up to 12 |
   | Older adults 60+ | 5–6 |

   These are recommendations in a template. The user adds or removes.
3. **The coach's own templates are the skeleton (R4-SES-05).** Do not invent day layouts.
   - **A/B "full body" (the default for 4 days: A, B, rest, A, B):**

     | Slot | Day A = pull + knee dominant | Day B = push + hip dominant |
     |---|---|---|
     | 1 | horizontal pull (bilateral) | horizontal push |
     | 2 | bilateral knee-dominant (squat) | bilateral hip-dominant (deadlift / hip extension / hip thrust) |
     | 3 | vertical pull | vertical push, or incline |
     | 4 | unilateral knee-dominant (lunge) | unilateral hip-dominant |
     | 5 | biceps | triceps |
     | 6 | leg extension | leg curl |

     Up to 8 slots by adding a small-muscle or core exercise at the end. Calves 3 sets on leg days, shoulders (side / rear delt) and optional days as in his BYOP sheets.
   - **Push / pull / legs** (3 or 6 days), as in his sheets.
   - **Upper / lower**, **3-day builder**, **bootcamp**, **athletic A/B** (athletic block, then the same A/B lifts), **CrossFit class**, **HYROX**, **strength (the work / accessory / nuance / survival)**: as in `synthesis/05_templates.json`.
   - **2 days a week (R4-SES-03):** every big muscle group is trained with fewer weekly sets (about 6–8, not 10). The plan says so and suggests a third day. Never drop whole muscle groups, and never pile on more exercises. One A day and one B day covers every big group.
4. **Nothing is dropped automatically (R4-SES-04).** The template comes out complete. The user decides what to remove. Print which blocks and exercises are the easiest to remove (accessories, extra stations, finishers).
5. **Progression** (CX-01..04, R4-PRG-01..04):
   - Weekly sets per group follow the stairway from start to the planned final target, and **the target is reached**. Increases may be faster than the usual 3% / 5% when needed. No hard cap.
   - Print a note on any week that adds more than about 15%.
   - Reach the top number in the last week when the math allows. One week early is fine. Never earlier.
   - A week may keep the same sets when reps or load progress.
   - Rep and load progress is written as a **rule the person applies**: "3 sets of 8–12. When you hit 12 on every set with 1–2 reps left in the tank, add weight next time and start again at 8." Never a promised number per week.
   - Next block: start about 5% above the previous block's start, in whole sets, never above the level's top. At the top, sets stay and load and reps progress.
   - Use `design/progression/stairway.mjs` and `prescription.mjs` as the arithmetic kernel, with the audit's fixes (`reviews/claude-codex-audit.md`: HIGH-2, MEDIUM-1 to MEDIUM-5). Move the kernel into `engine/progression/`. The 3 `todo` tests in `tests/audit/` must pass.
6. **Everything is editable (CX-04).**
   - The plan JSON supports edits to sets for any day or week, add and remove exercise, and block on or off.
   - After an edit, weekly totals are recomputed, the plan is marked edited, and no stale "validated" flag remains.
7. **Library** (R4-LIB-01..05):
   - The 31 proposed exercises become **optional add-ons** (selectable swaps), never primary template picks. The exception is wall balls and sled pushes as primary in HYROX, and optionally CrossFit. Neck work stays proposed.
   - Carries and sleds are dosed by distance or time: 2–4 trips of 20–40 m or 20–40 s. They carry no muscle-set credit and sit with core / conditioning.
   - New category **mid-range pull** (high row, 45-degree row, face-pull angle), between horizontal and vertical pull.
   - **Incline pressing is preferred over overhead pressing** in the vertical / mid-range push slot for bodybuilders and general population. Overhead stays available.
   - Swaps print one line on what they keep and lose.
   - Remove third-party video links from public data. Each exercise carries a YouTube search link built from its name, and the plan output exposes the exact name for one-tap copy.
8. **Safety and scope** (R4-SCP-01..03):
   - Everyone may use the plans.
   - Accepting the terms and liability release is **required before a plan is generated**.
   - A short release line is printed on every plan in EN and ES, linking `DISCLAIMER.md`.
   - Each sport profile carries a confidence label in data and docs: `confirmed_by_coach`, `similar_sport`, or `proposed`. It is not shown on plans.
9. **Credit** (R4-REL-03): the model is the intellectual property and coaching experience of Coach Lalo (Gerardo Vera), Master NASM coach.

## Still in force (do not regress)
- core first
- power before strength
- horizontal before vertical
- knee-dominant + pull, hip-dominant + push
- heavy squat and heavy deadlift on different days, once per pattern per week
- floor of 10 weekly sets per trained group when there are 3 or more training days
- helper credit 0.25
- athletic work never counts as muscle sets
- no bands or variable resistance
- no check-ins, tracking or stored data
- no sex or lifestyle inputs
- no deload inside a block
- older adults get no Olympic lifts or plyos unless opted in
- tests only at the start and end of a block
- stable exercises inside a block, with one-detail changes between blocks
- English and Spanish

## How volume is allocated (simple and exact)
1. For each trained group, weekly sets per week come from the stairway: start and final target by level, goal and Focus 1/2.
2. Split the weekly sets across the template slots that train the group, in session order: first exercise first (VOL-07), alternating between the two exposures of a day type (R3-VOL-03).
3. Per-exercise sets stay within 2–5 (2–4 for L1). If the template's slots cannot hold a group's weekly sets, add the coach's bonus exercise on the optional day (Focus slot). If there is no optional day, cap the group at what the slots hold and say so.
4. Credits are recomputed from the actual exercises, and the plan prints weekly sets per group.

## Work packages (sequential, one owner at a time)
- **V1 structure and volume:**
  - remove time-fitting
  - template-first layouts with the exercise counts
  - the A/B skeleton exactly as above
  - the 2-day rule
  - stairway through `engine/progression/`
  - allocation, edits, intake without session minutes
- **V2 library and selection:**
  - optional-only proposed exercises
  - HYROX and CrossFit primaries
  - mid-range pull
  - incline preference
  - swap "keeps / loses" lines
  - YouTube search links
  - carries by distance or time
  - profile confidence labels
  - the five data clean-ups in `HANDOFF.md`
- **V3 words and checks:**
  - the liability gate and printed release line
  - rule-based progression wording
  - the acceleration note
  - the time estimate as information
  - "easy to remove" hints
  - validators and the benchmark scorer without time metrics
  - EN / ES
- **V4 integrate:** all tests green, regenerate the 8 samples, run the benchmark, write `samples/STATUS_v0.5.md`.

Then coach-eye reviews of the 8 sample plans, fixes, and a re-review.

## Done means
- no time-based behaviour anywhere
- the A/B, PPL and other templates match the coach's
- every trained group meets its target and its progression rule
- the hard rules hold in every benchmark plan
- every sample plan grades B+ or better
- tests pass
