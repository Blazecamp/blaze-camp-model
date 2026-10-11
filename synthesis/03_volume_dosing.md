# 03 - Volume and dosing model (Blaze Camp) - v1.3

**What this is.** A single model of how much training the coach prescribes: exercises per session, working sets per session and per week, weekly sets per muscle, rep ranges, effort, rest, athletic-pattern dosing (contacts, throws, sprints, cuts, Olympic lifts) and conditioning. It ends with a generator-ready rule set (section 9). The machine-readable companion is `03_volume_rules.json` (same folder).

**How it fits with the volume engine.** The weekly-volume engine (starting sets per line, the planned stairway, banking, where each new set goes, Focus muscles, pain, bilateral:unilateral share, the split of the weekly sets over his templates, plan editing, plan shapes and the recommended easy week) is **`12_volume_algorithm_v1.md` / `12_volume_algorithm_v1.json` (v1.3 section first), which is authoritative**. This document keeps the evidence from the sheets (sections 2-8), states each coach rule in one line with its question ID and points to the 12 section for the numbers, and fully specifies only what 12 does not: rep selection, effort and rest, session caps by population, the athletic sport dial and conditioning dose. Since v1.2 the plan is an output only: no check-in, no tracking, nothing stored (COACH-R3 VOL-02, VOL-04, GEN-01). Where 12 and a coach answer disagree, the coach answer wins and the conflict is listed in the v1 section below.

**Status.** v1.3, 2026-10-11: round 4 (`coach_answers_round4.md`), CT-01 (`coach_answers_time_2026-10-10.md`) and CX-01..04 (`coach_answers_codex_2026-10-10.md`) applied; the v1.3 section below wins over every later section. **Round 4 and CT-01 outrank CX, which outranks round 3.** v1.2, 2026-10-09: round 3 applied (`coach_answers_round3.md`; changes in the v1.2 section below). v1.1, 2026-10-08: round 2 applied (`coach_answers_round2.md`). **Round-3 answers outrank round-2 answers, which outrank round-1 answers, which outrank everything else.** v1 (same day): the coach answered 138 of 140 questions (`coach_answers_full.md`; earlier chat statements in `coach_answers.md`). **His answers override every inference from the sheets and every earlier team decision in this file.** Where he asked the team to propose, or left a gap, the rule is marked **PROPOSED - PENDING COACH APPROVAL** (short form: PROPOSED). The v0 file (2026-10-07, two verification passes) is backed up in the session scratchpad (`v1_03/03_volume_dosing.v0_backup.md`). An adversarial v1 verification (2026-10-08, last section of this file) checked every volume-relevant coach answer against the rules, tables, examples and JSON and fixed what it found (v1 change rows 42-47, conflicts 4-6).

**Audience.** The coach (to check that this is how he thinks) and the engineer who will build the generator (to encode it).

**Evidence tags (used on every claim).** Authority order, highest first:
- **COACH-R4 <ID>** = the coach's round-4 answer in `coach_answers_round4.md` (question R4-<ID>). Outranks everything below, together with **COACH-CT CT-01** (session time is the user's responsibility; `coach_answers_time_2026-10-10.md`).
- **COACH-CX CX-01..04** = his clarifications on progression and editable templates (`coach_answers_codex_2026-10-10.md`). Above round 3, below round 4 and CT-01.
- **COACH-R3 <ID>** = the coach's round-3 answer in `coach_answers_round3.md` (question R3-<ID>, e.g. COACH-R3 SES-02 = R3-SES-02). Outranks everything below.
- **COACH-R2 <ID>** = the coach's round-2 answer in `coach_answers_round2.md` (question R2-<ID>, e.g. COACH-R2 VOL-06 = R2-VOL-06; LIB-10 and LIB-12 are the round-1 leftovers answered there).
- **COACH-ANSWER <ID>** = the coach's own answer in `coach_answers_full.md` (question ID, e.g. COACH-ANSWER VOL-07). A RIGHT chip with no text makes the team's assumption his rule.
- **OBSERVED** = read from a cell, colour, merge or formula in the coach's sheets. The location is cited as workbook / tab / cell or the decode file that holds it.
- **SCIENCE** = external literature or published coaching references, cited inline and listed in section 12 (and in `12_volume_algorithm_v1.md` §8).
- **INFERRED** = team reasoning from the observed data.
- **PROPOSED** = team design to fill a gap; needs the coach's OK before it ships.

**Sources read.** `coach_answers_round3.md` (in full, first, v1.2), `coach_answers_round2.md` (in full), `coach_answers_full.md` (in full), `coach_answers.md`, `12_volume_algorithm_v1.md` and `.json`; all decode files in `analysis/programs/` (every `*.md` quantitative section and every `*.volume.json`), `analysis/library/L4_dosing_vocab.json`, `L4_notes.md`, `analysis/reference/specialty_notes.md`, `sheet23_notes.md`, and these raw dumps for verbatim checks: `MASTER_MODEL/08_AEROBIC_CAPACITY_CHEAT_SHEET.txt`, `10_ALL_ABOUT_SQUATS.txt`, `14_NOT_DONE_ALL_ABOUT_BALLISTICS.txt`. Nothing in Google Sheets was opened or changed.

**Abbreviations.** BYOP = workbook 'BUILD YOUR OWN PROGRAM - BLAZE CAMP MODEL'. MM = workbook 'BLAZE CAMP MASTER MODEL'. Canonical buckets: RP_BKD/BHD = bilateral knee/hip dominant, RP_UKD/UHD = unilateral knee/hip dominant, RP_HPUSH/VPUSH/HPULL/VPULL = horizontal/vertical push/pull, ISO_* = single-joint isolation (ISO_HAM = the **leg-flexion** segment: leg curls, nordics, slider curls, COACH-ANSWER CAT-09), AP_* = athletic pattern (PLYO, JUMP_LIMITED_KNEE, THROW, COD, SPRINT, TRIPLE_EXT), CT/CP = core thorax/pelvis. RIR = reps in reserve. RPE = rating of perceived exertion. L1-L3 = client volume levels (COACH-ANSWER PRG-05). 'JUSTICE LEAGUE' is the sheet tab name of a weekend-warrior athletic program for non-competitive adults and youth (COACH-ANSWER ATH-13); it is cited here only as a source, and the generator must use a generic name (COACH-ANSWER FIX-03). Contacts are plyometric ground contacts; RC1-RC3 = the "Receive-Create stages": 1 Land (receive and pause), 2 Land & Go (receive then create), 3 Repeat (repeated receive/create); name and timing approved (COACH-R2 ATH-03; COACH-ANSWER CAT-10, CAT-11: "not necessarily a plyo zone").

---

## v1.3 - round 4, CT-01 and CX-01..04 applied (2026-10-11)

The coach's newest answers outrank everything below: round 4 (`coach_answers_round4.md`, 20 answers, 2026-10-11), his clarification on session time (`coach_answers_time_2026-10-10.md`, **CT-01**) and his clarifications on progression and editing (`coach_answers_codex_2026-10-10.md`, **CX-01..04**). **Authority order: round 4 and CT-01 > CX-01..04 > round 3 > round 2 > round 1 > chat statements > sheets.** **Where this section and a later section of this file disagree, this section wins.** Later sections that v1.3 supersedes carry a "RETIRED in v1.3" or "Changed in v1.3" note under their heading; the text under such a note is history. The master record is `BLAZE_CAMP_BRAIN.md` v1.3 (what changed: §0d). The weekly-volume engine is `12_volume_algorithm_v1.md` (its v1.3 section: the stairway, the allocation, the 2-day rule); this file states the dosing rules that are its own.

### V1. What v1.3 changes in this file

| # | Change | Sections below it replaces | Source |
|---|---|---|---|
| 1 | **Exercises per session by client type, not by minutes**: general fitness / fat loss 5-7, aesthetics / bodybuilding 6-8, strength 5-6, bootcamp 5-7 stations, field athletes off-season up to 12, older adults 60+ 5-6 (not counting the warm-up or the 2 core exercises). A recommendation; the person adds or removes | §0 row 1; §9.1; §9.7; §9.10 | COACH-R4 R4-SES-02 |
| 2 | **No time-fitting.** Session length is not an input and not a limit; each day prints an average time estimate as information. The time-vs-minimums policy is retired | §0 row 1; §9.1; §9.7; §9.10; §10 tension 29 | COACH-CT CT-01; COACH-R4 R4-SES-01 |
| 3 | **A full-body day is his A day or B day** (about 6 exercises, up to 8); "2-4 exercises per group, never 1" stays on split days | §0 row 1; §9.10 | COACH-R4 R4-SES-05 |
| 4 | **Two training days**: every big group at about 6-8 weekly sets, a third day suggested; the floor of 10 applies from 3 training days | §9.3 | COACH-R4 R4-SES-03 |
| 5 | **The planned final sets are reached**; steps may be faster than 3 % / 5 %; **no 7 % or 10 % limit**; a note on any week that adds more than about 15 %; a week may keep the same sets while reps or load progress | §0 row "Weekly increase"; §9.6; §9.7 | COACH-CX CX-01, CX-02, CX-03; COACH-R4 R4-PRG-01, R4-PRG-02 |
| 6 | **Reps and load progress by a rule the person applies**, never a promised number per week | §9.9 (adds to it) | COACH-R4 R4-PRG-03 |
| 7 | **Next block**: about 5 % above the last block's start, never above the level's top ("ceiling + 1" retired) | §9.1 row "blocks completed in a row"; §9.8 | COACH-R4 R4-PRG-04 |
| 8 | **Carries and sled work**: 2-4 trips of 20-40 m (or 20-40 s); not muscle sets; with core / conditioning | §9.12 (adds to it) | COACH-R4 R4-LIB-02 |
| 9 | **Nothing is dropped automatically**; everything is editable, the sets of any day or week included | §9.13 (adds to it) | COACH-R4 R4-SES-04; COACH-CX CX-02, CX-04 |

### V2. Session size, groups and the time estimate (replaces §9.10's lengths and §9.7's session rows)

| Limit | Value | Tag |
|---|---|---|
| **Exercises per session** (not counting the warm-up or the 2 core exercises) | general fitness / fat loss **5-7**; aesthetics / bodybuilding **6-8**; strength **5-6**; bootcamp **5-7 stations**; field athletes off-season **up to 12**; older adults 60+ **5-6**. Recommendations in a template: "They can add 1 if they want to" | **COACH-R4 R4-SES-02 (RIGHT + words)**; CT-01 |
| Default inside each range (what the template prints) | general 7; aesthetics 7; strength 6; bootcamp 7 stations; field athletes 12; older adults 6. Non-competitive "stay athletic" days 5-10 (default 10: his JUSTICE LEAGUE sheet has 10 slots); CrossFit-style class 5-7 around its skill and WOD | PROPOSED (he gave the ranges; "double-check with whatever data is out there and adjust accordingly within those parameters") |
| Outside the count | warm-up; the 2 core exercises; also joint care, skill practice, conditioning and cardio, the cool-down, test rows | R4-SES-02 (the first two); the rest PROPOSED |
| **A full-body day** | his **A day or B day: about 6 exercises, up to 8** (master §10.3) | **COACH-R4 R4-SES-05** |
| **Exercises per group on a day** | on an A / B day what his template gives (1-4: back 2, quads 3, hips 3, biceps or triceps 1); on a split day (push, pull, legs) **2-4, never 1** | **R4-SES-05**; R2-SES-05; R3-SES-01 |
| **Groups (APPROVED)** | the FOCUS groups: quads; **hips = glutes + hamstrings** (RDL + hip thrust + leg curl = 3 hip exercises); chest; back; **shoulders = front + side + rear delts** (+ traps); biceps; triceps; **calves = one exercise × 3 sets per leg day**; core = the 2-exercise opener; a field athlete's credit-only line is not "trained that day" | **R3-SES-01 (RIGHT)**, R3-VOL-01 |
| Field athlete, off-season | **up to 12 exercises + the 2-exercise core block**: the athletic block, then the A / B lifts; **cross pattern (default for most athletes): 2 jump / throw stations + 1 Olympic lift; same-pattern athletic template (size-focused and high-level athletes): 3-4 jump stations + 1 Olympic lift**; warm-up drills never count; a superset of two small isolations counts as one | VOL-08, VOL-17; **R2-SES-04 (APPROVED)**; **R3-SES-01 (APPROVED)**; R4-SES-02 |
| Sets per exercise | 2-5 (2-4 at L1); default when blank 3 compound / 2 isolation / 3 calves; 2 per slot in athletic templates | VOL-16; range PROPOSED |
| Per group per session (reference, not a rule in v1.3) | about 11 fractional sets is where one session's return flattens | SCIENCE Remmert (~11), RP (8-12) |
| Core | 2 exercises × 2 sets, short of failure, as the warm-up; optional core supersets or monster sets anywhere; **the person can switch a day's core block off** (the generator never leaves it out) | R2-SES-03; **R3-SES-02** |
| **Session length** | **not an input and not a limit** | **COACH-CT CT-01; COACH-R4 R4-SES-01** |

**The time estimate (information only; CT-01, R4-SES-01).** Each day prints one line, for example "Average time: about 60-75 min (an estimate, for information only)". "We can give an average recommendation of what it should take, but we will never know what it's going to take." The plan is never cut, reshaped or flagged because of it. The arithmetic behind the estimate (PROPOSED numbers; minutes per working set including rest): warm-up 8 per session (ORD-08); core set 1.5; bilateral compound 2.5; unilateral compound 3.75 (1.5 × bilateral, UNI-09); isolation 1.75 (unilateral 2.5); plyo / ballistic 1.5; Olympic 3.0; throw 1.25; a supersetted pair × 0.65; + 1.0 min changeover per exercise (0.5 inside a superset pair). The printed range is the estimate 10 % each way, rounded to 5 minutes (PROPOSED). Check against his BYOP day 1 (7 exercises, 19 sets, OBSERVED): 8 + 7 + 19 × ~2.3 ≈ 59 min. His typical lengths (athletes, bodybuilders and powerlifters about 90 minutes, general and weight-loss clients 45-60, a bootcamp class 35-45; UNI-09, PRG-03) are descriptions of what sessions usually take, not limits. *(Retired: "capacity" by minutes - 45 min ≈ 5 exercises / 11 sets, 60 ≈ 7 / 17, 75 ≈ 8 / 23, 90 ≈ 9-10 / 29.)*

### V3. Weekly progression in v1.3 (replaces the limits of §9.6 and §9.7)

The pattern is the approved stairway: about 3 % a week to the halfway week, about 5 % after it. Each trained group's steps are scaled so it **reaches its planned final sets** in the last week (one week early at most). Steps may be faster than the pattern when that is what it takes. The full math, the table and the allocation are in 12 (v1.3 sections V3 and V4).

**(d) No rate limit; a note instead (v1.3).** There is no maximum step and no maximum weekly rise (COACH-CX CX-01; COACH-R4 R4-PRG-02: "No hard limit, but the plan prints a clear note when any week adds more than about 15 %"). The note reads "This week jumps more than usual (17 % more sets for Shoulders): adjust if needed", is printed on that week and in "How you progress", and the week is marked in the stairway table. PROPOSED details: a group is noted when it adds 2 or more whole sets and more than 15 %; the week's total is noted above 15 %; one whole set alone is never noted. A coach may still set a slower pattern by hand at build time. A pain area keeps slow steps (about 3 %; VOL-03). **Retired in v1.3:** planned step ≤ 7 % (R2-VOL-01); total weekly resistance sets strictly below +10 % (UNI-05) with its one-set allowance and exemptions; "10 % is never offered as a step"; release staggering to stay under 10 %. **Retired in v1.2:** the 60+ ≤ 3 % cap (older adults are protected through exercise choice, R3-ATH-02, and constrained machines, EQ-03).

**Reps and load: the rule the person applies (v1.3; COACH-R4 R4-PRG-03; COACH-CX CX-02, CX-03).** There are no check-ins, so rep and load progress is written as a rule and never as a promised number for a week: "3 sets of 8-12. When you hit 12 on every set with 1-2 reps left in the tank, add weight next time and start again at 8." Every lift prints its own line ("Progress: when you hit 12 on every set with 2 left in the tank, add weight next time and start again at 8"); the reps in the tank are that week's planned effort. A fixed-rep lift reads "when every set is done with N left in the tank, add weight next time"; a lift with its reps written per set (12 / 10 / 8) says "the written reps" (these two wordings PROPOSED). A week that keeps its sets progresses through this rule. That is planned progress; an unchanged prescription is never labelled progress (CX-02).

### V4. Two training days

"Every big muscle still gets trained, with fewer weekly sets (about 6-8 instead of 10), and the plan says so and suggests a 3rd day. We do NOT drop whole muscles, and we do NOT pile on more exercises" - "That sounds right ... People can add or remove or adjust accordingly. That's fine. We can maybe give them a small recommendation, but it's only a recommendation."

| Item | Rule | Tag |
|---|---|---|
| Days | one A day and one B day: together they train every big group | R4-SES-03; R4-SES-05 |
| Weekly sets | every big group starts at 6 and tops at 8 (+ the Focus add); small groups take the same numbers at most; a 2-day maintenance plan holds no line above 8 | "about 6-8" R4-SES-03; exact numbers PROPOSED |
| The floor of 10 | applies from 3 training days | R4-SES-03; R2-VOL-06 |
| What the plan says | a plain note up front: with 2 days each big muscle gets about 6-8 sets a week; a third day would bring it to 10 or more | R4-SES-03 |
| Never | drop whole muscle groups; pile on more exercises | R4-SES-03 |

This replaces v1.2's reading of R3-SES-02 step 2 ("train fewer muscles directly") and closes round-4 candidate 2 (very short weeks).

### V5. Carries and sled work (COACH-R4 R4-LIB-02)

By distance or time, not reps: 2-4 trips of 20-40 meters (or 20-40 seconds), per side when one-sided. They are not muscle sets and they sit with core / conditioning. Wall balls and sled pushes may be primary picks only in HYROX station circuits (and the CrossFit-style class WOD, PROPOSED); everywhere else they are optional add-ons (R4-LIB-01).

---


## v1.2 - round 3 applied

> **Changed again in v1.3.** This list is the v1.2 change record, kept as written. Its rows about the time check and time vs minimums (R3-SES-02: offers, "fewer groups trained directly", "never flat"), about the 7 % and 10 % limits, and about the next block's "cap + 1" were changed again by COACH-CT CT-01, COACH-CX CX-01..04 and round 4. The v1.3 section above wins.

**Authority:** the coach's round-3 answers (`coach_answers_round3.md`, tag COACH-R3 <ID>, read in full first) outrank his round-2 answers, which outrank round 1 and everything else. Edited in place (rules, tables and the JSON); the v1.1 and v1 sections below are kept as history; the v1.1 rows that round 3 changed are marked ‡.

| # | Change in v1.2 | Coach answer | Where |
|---|---|---|---|
| 1 | **No check-in, no tracking, nothing stored.** The weekly check-in, its step table (effort, completion, pain), the 'Failed' answer, "a 10 = hold and -1 set", the repeated week, the block-at-risk prompt and the EFFORT-against-target logging are retired; the whole plan is built once on its planned stairway and shown ahead of time; a printed self-adjust guide tells the user how to adjust it. §9.13 is now a short retired note. | COACH-R3 VOL-02, VOL-04, GEN-01 | §0, §9.1, §9.5, §9.6, §9.9, §9.13; JSON `feedback_loop`, `inputs`, `progression` |
| 2 | **Stairway and effort drift approved**: about 3 % to the halfway week, about 5 % after, every trained line at its planned peak in the last week (its ceiling whenever the standard steps can reach it; tension 33); 3 RIR → 2 → 1-2 → 1 RIR + intensifiers, inside 1-3 RIR (tension 20 closed). | COACH-R3 VOL-04 | §0, §9.6, §9.9, §10; JSON `effort_targets`, `progression` |
| 3 | **Shoulders = one line; the floor is read on groups.** Side, rear and front delts are the shoulders line (start 10 / 12 / 15, group credit: a set counts at most 1.0); rear delts' own 4 / 6 / 8 sets are retired as a number (a rear-delt exercise stays in every week; "add rear delts" is an editing option); the floor of 10 is counted on quads, hips (glutes + hamstrings), chest, back, shoulders, biceps, triceps, calves (tension 27 closed). | COACH-R3 VOL-01, SES-01 | §0, §1, §9.2, §9.3; JSON `weekly_sets`, `counting` |
| 4 | **Focus muscle 1 and Focus muscle 2** replace the intake "priority muscles": +1 to +3 extra weekly sets each (default +2) on start and ceiling; the VOL-02 +4 / +6 push stays only as an optional coach setting. | COACH-R3 SES-01 | §9.1, §9.4; JSON `generator_rules.priority_muscles`, `inputs` |
| 5 | **Sessions**: the FOCUS groups (hips, shoulders) and calves as one exercise × 3 sets per leg day are approved; field athletes 2-4 exercises per group inside 12 + 2 core (cross pattern: 2 jump / throw stations + 1 Olympic; same-pattern template for size-focused and high-level athletes); bonus placement approved. | COACH-R3 SES-01, VOL-03 | §9.7, §9.10; JSON `caps`, `session_caps_by_population` |
| 6 | **Time vs minimums - RETIRED in v1.3 (COACH-CT CT-01)** (12 §3.10.1): tell up front + offer another day or longer sessions → if the user keeps the time, fewer groups trained directly (big movers kept; arms, calves, shoulder isolation from compound credit) → recommended supersets → the stairway climbs on every trained group. **Plan editing**: a day's athletic and core blocks can be switched off, exercises and blocks added or removed. Replaces tension 29's "the generator says so". | COACH-R3 SES-02 | §9.7, §9.10, §10; JSON `session_caps_by_population`, `caps` |
| 7 | **Calendar**: the easy week after a block is a recommendation; the block ends and the user builds the next; holidays between blocks. | COACH-R3 PER-01 | §0, §9.8; JSON `deload`, `plan_layouts` |
| 8 | **Sport dial and conditioning**: swimming 25 % plyo, 3 dryland days + 1 optional, 0 extra cardio, Olympic 2-3 days, shoulder care every session (no bands), taper with the swim taper; older adults (60+) landing drills, balance, quick stepping, light medball and fast machine work on, ankle hops / jumps / Olympic lifts / depth jumps off by default; pickleball, padel and tennis 50+ calf and Achilles work every leg day, rotator cuff, low-impact jumps; HYROX plan (2 strength + 2 hybrid days, 4 cardio, 2 station circuits as finishers never counted as muscle sets, wall balls ≤ 20 lb, 40-rep / AMRAP sets only inside them, 50 % plyo); the R3-ATH-04 shares for the remaining sports; stay-active play days, activity sessions as cardio (up to 2), event dates. | COACH-R3 ATH-01..05 | §0, §9.9, §9.11, §9.12, §11; JSON `sport_profiles_L2_weekly`, `conditioning`, `plyo_block_progression` |
| 9 | **HYROX confirmed** ("high rows" = HYROX, R3-ATH-03 RIGHT): 40-rep / AMRAP sets live inside the HYROX station circuits and CrossFit-style WODs only; questions 11.3-8 and 11.4-1 answered. | COACH-R3 ATH-03 | §9.9, §11 |
| 10 | **Tensions and questions updated**: tensions 17, 20, 24, 26, 27 and 29 closed by round 3; new tensions 30-32; new questions 11.5. | as listed | §10, §11 |

---

## v1.1 - round 2 applied (history)

**Authority (v1.1):** the coach's round-2 answers (`coach_answers_round2.md`, tag COACH-R2 <ID>) outrank his round-1 answers, which outrank everything else. Edited in place (rules, tables, recomputed views and the JSON); the v1 section below is kept as history, with its rows that round 2 changed marked †. Rows of this table that round 3 changed are marked ‡ (v1.2 table above).

| # | Change in v1.1 | Coach answer | Where |
|---|---|---|---|
| 1 ‡ | **Weekly progression = the stairway** of 12 v1.1: small weekly steps in the first half (standard 3 %), slightly bigger after the halfway week (5 %), the hardest weeks last, scaled so the planned peak lands on the cap in the final week; never above 7 % planned, total weekly resistance sets below +10 %. Replaces "3 / 5 / 7 % chosen each week by the person's state". The 9.6 banking illustration is recomputed on the stairway. | COACH-R2 PER-03, PER-04, PER-05, VOL-01; COACH-ANSWER UNI-05 | §0, §8, §9.6; JSON `generator_rules.progression` |
| 2 ‡ | **Optional check-in, step from effort, completion and pain only** (his approved table without the life column): effort mostly 1-6 → planned step + 2 points (= his +7 % late in the plan); 7-8 → the planned step (= +5 %); 9 → hold; any 10 → hold and remove 1 set from that day; under half the sessions → repeat the week. **No check-in → the plan follows its planned stairway.** v1's readiness score, deload trigger and 3 % default for stressed clients are gone. | COACH-R2 VOL-01, VOL-03, GEN-01, GEN-04 | §9.6, §9.13; JSON `feedback_loop` |
| 3 | **No lifestyle inputs:** the intake "recovery signal" (sleep, stress, physical job) and the weekly sleep/stress questions are removed. | COACH-R2 GEN-04 (NOT RIGHT) | §9.1, §9.13; JSON `inputs` |
| 4 ‡ | **EFFORT reading:** '8 - That was perfect' = hit the target, '9' = harder than planned, **'10' = "the max I could do, but successful"** (0 RIR, not a fail); an optional 'Failed' answer. Tension 24 is resolved. | COACH-R2 VOL-02 (PARTLY) | §5.1, §5.3, §9.9, §10; JSON `effort_targets` |
| 5 ‡ | **Floor of 10 sets a week per trained muscle**; small muscles start 10 / 12 / 15 ("8 is barely maintenance ... the little muscles also grow the same idea"); caps 14 / 22 / 25 for every target muscle, priority 18 / 26-28 / 30, all customizable; an optional Pro level above 30. v1 floors (big 4, small 2) retired. | COACH-R2 VOL-04, VOL-06 | §0, §9.3, §9.4, §9.7; JSON `weekly_sets`, `caps` |
| 6 | **"Most people train 20-30 sets per muscle per week"** researched in 12 §2.11 (bodybuilder and gym-goer surveys, dose-response meta-analyses, RP landmarks) and summarised next to his numbers. | COACH-R2 VOL-06 | §3.6, §9.3 |
| 7 | **Glutes:** squats, lunges, deadlifts and RDLs give glutes 0.25 (hinges were 0.5 PROPOSED); hip thrusts and bridges 1.0; **KB swings are ballistic and never glute volume**; thruster 1.0 quads + 0.5 shoulders + 0.25 glutes. All 61 program views recomputed (only glutes change): hypertrophy-family median 9 → 6, and no view now reaches 15. | COACH-R2 VOL-05 | §1, §2.4, §3.1-3.6; JSON `counting`, `observed.program_views[].normalized_muscles_coach_v1_1`, `observed.coach_count_summary` |
| 8 ‡ | **No deload or maintenance week inside a block.** Deload = about half of the hardest week, only between blocks; a block that cannot be completed is cancelled → maintenance phase (length chosen, extendable; end prompt: keep maintaining / change plan / start a block) → a new block. Pre-season = 4-6 weeks at ~60 % of off-season sets with more speed and power + a 1-2-week taper. | COACH-R2 VOL-07, PER-06 | §9.8; JSON `deload`, `plan_layouts` |
| 9 | **Plans:** 8- and 12-week plans and short training blocks are all stairways (no "start hard"); the yearly plan is gen-pop "stay in shape" planning, fully tunable; tests before the block (or week 1) and at the end, never mid-block, and never a 1RM or max mile from zero (5RM / 3RM or 80-90 %). | COACH-R2 PER-01..04, PER-07 | §0, §9.1, §9.8; JSON `plan_layouts` |
| 10 ‡ | **Sessions:** full-body days give every muscle group trained that day 2-4 exercises, never 1 (7-10 exercises, 55-80 min); field athletes 12 exercises + the 2-exercise core block; light core opener (2 × 2 short of failure) with optional core supersets or monster sets anywhere; heavy squat and heavy deadlift on two different days, with the counted axial list. The time capacity is recomputed with changeovers and the core opener. | COACH-R2 SES-01..05 | §0, §9.7, §9.10; JSON `caps`, `session_caps_by_population` |
| 11 ‡ | **Conditioning counts are adjustable** up or down by the user; aesthetics 4 = Orange, Green, Blue + a second Orange, plus optional 20-30-min walks; athletes off-season by sport (2-4), pre-season 2, powerlifters 2 easy. | COACH-R2 SES-06, ATH-06 | §0, §7, §9.12; JSON `conditioning` |
| 12 ‡ | **Sport dial:** plyo shares approved (end of block; each block starts 15 points more ballistic; counted over jump **and** throw work); ballistic vs plyometric lists; "Receive-Create stages" (1 Land, 2 Land & Go, 3 Repeat) with their timing; Olympic lifts up to 4 × a week (cleans on squat days, snatches on hinge days), full squat cleans/snatches 3-5 reps with the same weekly reps, % of that lift's own max only when tested (RPE otherwise); in-season reductions for game-heavy sports; older adults no Olympic lifts, plyos or depth jumps by default (optional with a warning); youth floor lifts from about 14 after a hang block. | COACH-R2 ATH-01..08, GEN-06 | §0, §6, §9.9, §9.11; JSON `sport_profiles_L2_weekly`, `plyo_block_progression`, `rep_selection` |
| 13 | **Library answers that touch dosing:** KB face pulls are shoulder work (rear/side delts, traps) on pull or shoulder days; bench push-ups in both versions (hands on the bench foundational, feet on the bench advanced); the '21.6 mile run' is removed from plans and tests. | COACH-R2 LIB-04, LIB-05, LIB-06; LIB-10, LIB-12 | §1, §7.2, §10, §11 |
| 14 ‡ | **HYROX:** the coach's request of 2026-10-08 says gen-pop clients want "things like high rows and pickleball" to stay athletic and active. "High rows" is the same dictation as VOL-11's "high-raw athletes", so the HYROX reading is now well supported (still INFERRED); 40-rep sets stay optional (AMRAP, CrossFit or HYROX-style work); the "stay athletic and active" path uses the general-fitness dose. | coach request 2026-10-08; COACH-ANSWER VOL-11 | §9.1, §9.9, §9.11 |
| 15 ‡ | **Conflicts with 12 v1 closed:** 12 v1.1 adopted conflicts 1 (athletic slots 2 sets), 4 (hand-set step 0-7 %), 5 (+4 at L1-L2 / +6 at L3) and 6 (exercises by session length); conflict 3 is settled by COACH-R2 SES-04; conflict 2 (effort drift toward 1 RIR) is now one flagged proposal in both files. | as listed | v1 conflicts list |
| 16 ‡ | **Tensions and questions updated:** of the 14 questions raised in v1, round 2 answers 10, partly answers 1 (HYROX) and leaves 3 open (heavy unilateral, rotational core, V-taper); new tensions 26-29 (life column, rear-delt floor, athletes' upper-body floor, full-body session length). | as listed | §10, §11 |


---

## v1 - coach answers applied

History (round 1, kept as written). Rows that round 2 changed are marked †; the v1.1 table above says how.

### What changed (one line each, with the question that changed it)

| # | Change in v1 | Coach answer | Where |
|---|---|---|---|
| 1 † | The weekly 3 / 5 / 7 % increase is chosen each week by the **person's** state (fatigue, life, response to training), never by muscle size; the coach (or client, if allowed) can set it by hand from 0 to 7 % (his 3/5/7 band; 10 % is never offered as a rate because he called it "way too much", UNI-05; v1 verification). Every "big muscle 3 %, chest/back 5 %, small 7 %" mapping is retired. | VOL-05, UNI-05 | §0, §9.2, §9.6; JSON `generator_rules.muscle_classes`, `.progression` |
| 2 | The % is a percentage of **weekly sets per muscle** (load and volume load are tracked, not driven by %). | VOL-04 | §9.6 |
| 3 | **10 %/week is a hard ceiling** on total weekly resistance sets ("way too much"), no longer labelled INFERRED smoothing; a week must stay **below** +10 % (a +10 % week is what he called too much; v1 verification). | UNI-05 | §9.7 |
| 4 | Rounding: **bank the fraction, add a whole set when the bank reaches 1.0** (v0 released at 0.75). | VOL-06 | §9.6 |
| 5 † | New sets go to the **first exercise for that muscle in session order, then the next** (2/2/2 → 3/2/2 → 3/3/2 → 3/3/3 → 4/3/3); 3-4 exercises per muscle group on its day; a small muscle trained at the end of a session gets extra volume as a **bonus exercise**. v0's "isolation slot first / alternate bilateral-unilateral" rule is retired. | VOL-07 | §9.6, §9.7 |
| 6 † | Helper credit **0.25** (v0: 0.5, and glutes 1.0 from every hinge and unilateral knee set). Dips 0.5 triceps + 0.5 chest; thrusters 1.0 quads + 0.5 shoulders. Section 3 tables are recomputed with this coach count. | VOL-09, LIB-16, LIB-14 | §1, §3; JSON `counting`, `program_views[].normalized_muscles_coach_v1` |
| 7 † | One **10/10** unilateral set = **1 set** to the primary muscle (RFE lunge → quads; glute credit still to be decided); alternating lifts count the same way. | UNI-01, UNI-07 | §1 |
| 8 | **Athletic patterns never count** toward muscle sets (plyos, ballistics, throws, Olympic lifts, sprints, change of direction). This is now his rule, not an accounting convention; v0's "0.5 set-equivalent against a lower-body fatigue budget" is retired. | VOL-10 | §1, §6.5, §9.7 |
| 9 | Leg curls, nordics and slider curls are a **leg-flexion** segment, not hip dominant. | CAT-09 | §1, §3.4 |
| 10 † | Weekly sets per muscle are **starting** volumes by level: beginner **10-12**, intermediate **15-20**, advanced **20+**; 15-20 = maintenance to some growth, 20-25 = growth. v0's peak-week table (15-20 read as the destination, start back-solved) and level L4 are retired; the engine's start table is 12 §3.3. | VOL-01, UNI-01, PRG-05 | §0, §9.3 |
| 11 † | Priority muscle: **+4 to +6 sets** on the start, cap **about 25-30**, 1-2 at a time, its exercise first in the session; delivery = own exercises → Focus slots (both may hit the same muscle) → bonus exercise. v0's "+2 percentage points of rate" is retired. | VOL-02, ORD-04, ORD-10, ORD-11 | §9.4 |
| 12 | Pain: that muscle or pattern **-30 to -50 %**, move it to constrained machines or split grips, or **drop the exercise**; a bilateral lift swapped to unilateral keeps its sets "ideally, but adjust accordingly". | VOL-03, UNI-08, EQ-03 | §9.5 |
| 13 † | **Calves 3 sets every leg day** (single-leg on a ramp/plate/deficit or bilateral, treated like any other muscle); **rear delts get their own sets**; **about 2 core exercises** per session, done first by default. | VOL-17, ATH-11 | §0, §3.5, §9.3, §9.10 |
| 14 | The templates' chest-low / side-delt-high pattern was not intended: the generator **balances** to the start table, with a **V-taper bias** available as an optional per-client bias (mechanism PROPOSED). | VOL-18 | §3.5, §9.4 |
| 15 † | Session caps by population: resistance sessions **5-7 exercises**; off-season field athletes **up to 10-12** (2 core + 2-4 plyo/ballistic + 2-3 Olympic/power + 3-4 resistance); athletes, bodybuilders and powerlifters **~1.5 h (max 2 h)**; general and weight-loss **45-60 min**; unilateral time must be accounted for. v0's minutes-by-level table is retired. | VOL-08, VOL-16, VOL-17, UNI-09 | §0, §9.7, §9.10 |
| 16 | Default sets when blank: **3 on compounds, 2 on isolation, 3 on calves; 2 per slot in athletic templates.** | VOL-16, VOL-17 | §9.7, §9.10 |
| 17 | Reps: small muscles **12-30** (20s, MAX, MYO), big muscles **5-15 mixed**. **40-rep sets are removed from the defaults** (incl. the fat-loss matrix); they exist only as an optional CrossFit/AMRAP style. | VOL-11 | §4.3, §9.9 |
| 18 | Preference style ("lighter, more sets" vs powerlifting "heavier, fewer reps") moves the **rep range on big compound lifts only**; **weekly sets stay the same** (v0's ×1.1 / ×0.85 set factors removed); small muscles stay high-rep. | VOL-12 | §9.9 |
| 19 | Unilateral lifts default to moderate-high reps; **heavy low-rep unilateral work is an optional toggle** for the athlete or coach. Unilateral and bilateral volume progress the same way. | UNI-04, UNI-05 | §9.6, §9.9 |
| 20 | Effort: **RIR is the primary scale, 1-3 RIR on every working set** ("leave 1 in the tank"), no planned RIR ramp; **MAX = technical failure, only on small-muscle or bodyweight work**; RPE is shown next to RIR as an explanation; % of 1RM stays in the strength and Olympic templates. | VOL-13, PER-09 | §5, §9.9 |
| 21 | Rest: hypertrophy **1-2 min** (up to 3), strength **3-6 min**, athletic "as prescribed"; supersets rest after the pair. | VOL-14 | §5, §9.9 |
| 22 | **MYO sets only on the last exercise**, machine or isolation. | VOL-15 | §9.9 |
| 23 † | Aerobic sessions/week: **3** general and fat loss, **2** athletes in season, **4** aesthetics/bodybuilders, **plus long walks after workouts**; any erg, tracked by calories, time or distance. | ATH-07, EQ-14 | §0, §7.3, §9.12 |
| 24 † | Deload = **about half the sets**, same exercises, lighter or 3+ RIR, no buy-out or finisher (v0's 0.85 × week 1, built from the shallower observed deloads, is retired; the observed shapes stay as evidence). | PER-05 | §9.8 |
| 25 † | Plan lengths: 4-6 weeks = maintenance/transition at **50-70 %**; 8 weeks start hard (4 adapting + 4 driving); 12 weeks preferred (2-4 acclimation, 4-6 driving, last weeks hardest); week-by-week and yearly modes. v0's 6/8/12 layouts are retired (12 §3.12; `06_periodization`). | PER-01 | §9.8 |
| 26 | Smooth weekly adds for hypertrophy and general clients; 2-week steps and waves for fight or competition prep. | PER-10 | §8, §9.6 |
| 27 | Levels **L1-L3**: novice = newby (under ~6-12 months, or 6-12+ months off); intermediate = over 1 year consistent; ex-pros start at L1 only briefly. "NOVICE below NEWBY" and L4 are retired. | PRG-05 | §9.2 |
| 28 † | Plyo "zones" are not zones (Davidson zones are rotation biases and do not apply to plyos). Plyo method = receive & pause → receive then create → repeated receive/create; unilateral harder than bilateral; programs start ballistic and become plyometric. | CAT-10, CAT-11, ATH-01 | §6.1, §9.9, §9.11 |
| 29 † | Sport dial: plyo vs ballistic share set by the sport's **ground-contact time**; total jump volume follows his ranking (baseball now below MMA and tennis); **everyone in athletic training gets Olympic lifts** (baseball no longer "optional, pre-season only"); boxers **reduce, never cut** pressing/arm volume in high-punching weeks. | ATH-01, ATH-02, ATH-10, ATH-04 | §9.3, §9.11 |
| 30 | No medball work for aesthetics/bodybuilders except warm-up; medballs never over 20 lb. | ATH-05, EQ-06 | §9.9, §9.11 |
| 31 | **No bands and no variable resistance** in any generator rule; banded, chained and reverse-banded items in the sheets stay as evidence only. | EQ-01, EQ-07, EQ-08, EQ-12 | §4.1, §6.1, §9.11 |
| 32 † | Older clients: few plyos unless they ask; extra volume on constrained machines; never overhead squat, snatch, low-bar or depth jumps; **no sex-based rules** (age, foundation, goal, injuries decide). | ATH-09, EQ-03, GEN-02 | §9.1, §9.11 |
| 33 | Rep notation: '10/10' = 10 per side; '12/10/8 -20' = pyramid (12 mid weight, 10 heavier, 8 heaviest) then a light 20-rep set. The UL upper-day rep rise with level was a fill error: rep and set rules must be the same for every level. | PRG-07, UNI-01, PRG-06 | §1, §4.3, §9.9 |
| 34 | VOL 1 / VOL 2 / VOL 3 compound/isolation rep phases apply to all athletes, one per block. | PER-11 | §9.9 |
| 35 † | Week-to-week adjustment from EFFORT and HOW IT FELT confirmed; the rate is set per person (12 §3.7); two output modes proposed because he is unsure whether people should track in the tool. | GEN-05, GEN-03 | §9.13 |
| 36 † | '21.6 mile run' in the cardio list is "a marathon" to the coach. Flag: a marathon is 26.2 miles. | LIB-18 | §7.2 |
| 37 | A 'MYO SET' counts as **2 hard sets** (stated here so 03 matches 12 §3.1; INFERRED), and only on the last machine or isolation exercise. | VOL-15 | §1 |
| 38 | **Same-pattern pairing** (squat + lunge) is allowed for aesthetics and high-level clients to drive one muscle harder; cross-pattern pairing stays for bootcamp and general clients (less soreness). | UNI-06 | §9.10 |
| 39 † | **No second axial squat in a week, for every population** (squat one day, leg press or belt squat the other); deadlifts also load the spine, so the hinge gets the same treatment (one axial hinge a week, the other hinge exposure non-axial, as `05_session_architecture` rule 18; that reading INFERRED, §11.3 item 13), and **hip dominant + push / knee dominant + pull** on every full-body and bootcamp day. v1 had stated both only for general clients. | PER-04, EQ-11, UNI-11, ORD-06 | §9.10 |
| 40 † | Client effort explanation: RIR first with RPE beside it, and the EFFORT menu is **read against each set's planned RIR** ('8 - That was perfect' = landed on the target). Otherwise a client working at 1 RIR as told ("leave 1 in the tank" = RPE 9) logs '9 - That was terrible' and the engine holds every week (PROPOSED). | VOL-13, GEN-05 | §5.3, §9.9, §10 (24), §11.3 |
| 41 † | "high-raw athletes" in his 40-rep answer is read as **HYROX** athletes (INFERRED from the dictation; to confirm). 40-rep sets stay optional only. | VOL-11 | §9.9, §11.3 |
| 42 | **Bilateral : unilateral share stated here in his words** (v1 had only a pointer to 12): range 90/10 to 10/90 by athlete, adjustable; bodybuilders/powerlifters about 50/50 at the start → 80/20-90/10 bilateral; field/COD athletes 80-90 % unilateral; in-season bilateral minimal; pain adjusts it; upper body the same logic; contralateral loading pulls into the hip (COD athletes), ipsilateral helps out of the hip (sprint acceleration); contra/ipsi for bodybuilders and powerlifters as health accessories mostly in weeks 1-4. | UNI-02, UNI-03, UNI-10, CAT-13, UNI-12 | §9.3 |
| 43 | **Core first on every population row**, including the weekend-warrior athletic program (v1 had "athletic block first" there) and the observed athletic-block reading in §6.4. | ATH-11 | §6.4, §9.10 |
| 44 | **Olympic lifts by level follow ATH-10**: beginners and "beginning intermediates" use DB/KB snatches, hex-bar jumps, hang pulls and hang cleans; intermediate and up get the full scope (v1's matrix held the full lifts back to L3). | ATH-10 | §9.9 |
| 45 † | **Older clients in the sport dial**: no snatch variants and no depth jumps (v1's row allowed "DB/KB" Olympic work without that limit). | EQ-03, ATH-09 | §9.11 |
| 46 | **Deload keeps the same exercises**, Olympic lifts included at half the sets and light technique loads (the v1 JSON removed Olympic work, against "same exercises"). | PER-05, ATH-10 | §9.8 |
| 47 | **Exercises by session length are his confirmed numbers**: 45 min ≈ 5, 60 min ≈ 6-7, 75-90 min ≈ 8-9 (the VOL-08 assumption he marked RIGHT); v1 had capped resistance sessions at 7, "up to 8 PROPOSED". | VOL-08, VOL-16 | §0, §9.7, §9.10 |

Rows 37-41 were added in the v1 audit pass (2026-10-08, verification log); rows 1-36 are the first v1 pass; rows 42-47 come from the v1 verification (last log entry).

### Conflicts with `12_volume_algorithm_v1` (resolved in favour of the coach)

**Status in v1.1:** 12 v1.1 adopted conflicts 1, 4, 5 and 6; conflict 3 is settled by COACH-R2 SES-04 (12 exercises + the 2-exercise core block); conflict 2 is now one flagged proposal in both files (planned effort drift toward 1 RIR inside his 1-3 RIR band, 12 §3.7.2).

1. **Default sets in athletic templates.** 12 §3.10 (`session_limits.default_sets`) gives every template 3 / 2 / 3 (compound / isolation / calves), and its tennis example uses 3 sets on most slots. COACH-ANSWER VOL-16 confirmed the assumption "Athletic templates use 2 everywhere". **Here: athletic-template slots default to 2 sets**; the engine may still add sets by VOL-07. 12 should add this default.
2. **RIR in the last weeks.** 12 §3.12 lets weeks 10-12 move "RIR toward 1". COACH-ANSWER VOL-13 confirmed "1-3 RIR at all times ... no planned RIR ramp". **Here: RIR stays inside 1-3 on every working set**; drifting to the 1-RIR end in the hardest weeks stays inside his band and is PROPOSED, not a ramp.
3. **Field-athlete exercise cap (not a conflict with 12; an ambiguity inside his answers).** 12 and this file both use "up to 10-12" (COACH-ANSWER VOL-08: "max maybe 12 different exercises"). In VOL-17 he lists 2 core + 2-4 plyo + 2-3 Olympic + 3-4 resistance (up to 13) and says "12 to 14". **Both files: 12 is the cap** (his direct answer to the cap question); the 12-vs-14 question is in §11.3.
4. **Hand-set rate (added in the v1 verification).** 12 §3.7 step 4 lets the coach or client "set the rate by hand from 0 to 10 %". COACH-ANSWER UNI-05: "it can progress week by week by 10 %. That's way too much." **Here: a hand-set rate runs from 0 to 7 % (his 3/5/7 band), and a week's total increase must stay below +10 %**; 10 % is a guardrail, never a rate. A coach who wants a different rule adds it as his own rule (COACH-ANSWER GEN-08). 12 should change step 4.
5. **Priority add per level (inside 12, added in the v1 verification).** 12 §3.5 says +4 (L1-L2) to +6 (L3); 12 §3.3's table gives big muscles +5 at L2. The coach gave only "+4-6" (COACH-ANSWER VOL-02). **Here: +4 to +6, with the split by level PROPOSED**; 12 should make its two sections agree.
6. **Exercises per resistance session (added in the v1 verification).** 12 §3.10 gives "5-7 (default 7); up to 8 in 90-min ... sessions", with 8 PROPOSED. COACH-ANSWER VOL-08 marked RIGHT the assumption "45 min ≈ 5, 60 min ≈ 6-7, 75-90 min ≈ 8-9 exercises". **Here: his length mapping**, with "usually 7" as the default for a 60-min resistance session; 12 should adopt it.

### Still pending after v1 (history; what is pending now is in §11 and in 12 §7)

- Every PROPOSED item in `12_volume_algorithm_v1.md` §7 (20 decisions: small muscles at ~80 % of the big-muscle start, rear-delt 4 / 6 / 8, glute credit values and the athlete glute policy, L3 definition, readiness score and bands, intake rate defaults, acclimation caps, no fixed deload inside a plan, cycle step, maintenance base, non-priority 3 % cap, share numbers he did not give, plyo:ballistic table, per-session limits, core block counting, two output modes, yearly quarters, plyo stage name, time model).
- 03-specific PROPOSED items in this file: the V-taper bias mechanism (§9.4); reading the EFFORT menu against each set's planned RIR (§9.9); the heavy-unilateral toggle parameters (§9.9); the sport-dial numbers (plyo contacts, throws, cuts, Olympic sets per week; §9.11); aerobic sessions for off-season athletes and strength clients and the colour rotation at 4 sessions (§9.12); rep brackets for pain (§9.5); in-season plyo contacts at about half (§9.11) and the in-season Olympic/jump maintenance dose (§10, tension 22); Olympic lifts kept in the deload at half the sets (§9.8); the Kong row used for pain clients, not to fill back volume (§1); the one-axial-hinge reading of PER-04 (§9.10).
- For the owner of 12: conflicts 4 (hand-set rate 0-10 %), 5 (priority +5 vs +4/+6) and 6 (exercises by session length) above.
- Unanswered from v0: the % basis of the Olympic and STRENGTH-12 percentages (COACH-ANSWER PER-09 confirmed the template "I just want to make sure it's correct", not the basis); whether a set's RIR / % applies to every set or only the last; the level unlock of aerobic colours.
- Not answered at all: LIB-10 (KB face pulls under vertical pull: rear-delt credit or not) and LIB-12 (bench push-ups hands vs feet on the bench).
- New questions raised by the answers: §11.3.

---

## 0. The short answers

| Question | Coach rule (v1) | What the sheets show (OBSERVED unless tagged) |
|---|---|---|
| 1. Exercises per session | **v1.3: by client type, not by minutes** - general fitness / fat loss 5-7, aesthetics 6-8, strength 5-6, bootcamp 5-7 stations, field athletes up to 12, older adults 5-6; a full-body day is his A or B day of about 6 exercises, up to 8; session length is not an input and nothing is cut for time (COACH-R4 R4-SES-02, R4-SES-05; COACH-CT CT-01). *v1.2, superseded where it differs:* Resistance sessions by length **45 min ≈ 5, 60 ≈ 6-7, 75-90 ≈ 8-9** ("usually 7") (COACH-ANSWER VOL-08, VOL-16); split days 3-4 exercises per muscle group (VOL-07); **full-body days 2-4 exercises per muscle group trained that day, never 1, so 7-10 exercises** (COACH-R2 SES-05); groups = the FOCUS groups, hips = glutes + hamstrings, shoulders = all delts, calves one exercise × 3 sets per leg day (COACH-R3 SES-01); off-season field athletes **up to 12 + the 2-exercise core block** with 2-4 exercises per group trained that day (cross pattern: 2 jump / throw stations + 1 Olympic lift; same-pattern template for size-focused or high-level athletes) (COACH-ANSWER VOL-08, VOL-17; COACH-R2 SES-04; COACH-R3 SES-01); light core opener 2 × 2 (SES-03), switchable off for a day (COACH-R3 SES-02). When the chosen time cannot hold the minimums: tell up front + offer, fewer groups trained directly, supersets, stairway on the trained groups (COACH-R3 SES-02; 12 §3.10.1). Session length: athletes, bodybuilders, powerlifters ~1.5 h (max 2 h); general and weight loss 45-60 min, full-body days 55-80 (UNI-09; SES-05); bootcamp 35-45 min, 5-7 stations (PRG-03). Optional days ideally separate (ORD-10). | Physique main day **5-7** lifts (BYOP 7, 3-day 5, fat-burn 5), plus (MM UL/PPL tabs only) a 5-min 'Any Cardio Equipment' warm-up and 3 A-drills on lower days. Athletic day: **10** slots in BYOP (4-5 athletic + 5-6 resistance); 6-16 lines in MM athletic; baseball median **9** (6-11). Strength tracks **3-4** slots ('the work' / 'the accessory' / 'the nuance' / 'the survival'). Optional day **5** slots ('Calves', 'Cardio', 'Core', 'Focus 1', 'Focus 2'). |
| 2. Working sets | Defaults when blank: **3 on compounds, 2 on isolation, 3 on calves, 2 per slot in athletic templates** (VOL-16, VOL-17). Sets per session follow from exercises × sets and the time model (12 §3.10, PROPOSED; v1.1 counts changeovers and the core opener: 45 min ≈ 11 sets, 60 ≈ 17, 75 ≈ 23, 90 ≈ 29; supersets +25-35 %). | Physique main day **15-21** (the one filled BYOP day: 7 exercises, 19 sets). Athletic BYOP day **20** (10 slots × 2 sets, 'JUSTICE LEAGUE'). Baseball median **29** per session (22-51, supersets/tri-sets/complexes). Strength track **11-16**. Per week **44-84** resistance sets on 3-4 main days (up to 132 on the 6-day push/pull/legs and 158 in the 12-week aesthetics peak, 148 without its 10 superset-finisher sets); **97-174** total working sets in athletic programs once jumps, core and throw sets are counted. Sets per exercise **2-4** almost everywhere; 5-7 on main lifts in strength/peak weeks. |
| 3. Weekly sets per muscle | **Start** (not peak): beginner **10-12**, intermediate **15-20**, advanced **20+** (VOL-01); shoulders (front + side + rear delts as one line), biceps, triceps **10 / 12 / 15** (COACH-R2 VOL-04; COACH-R3 VOL-01); **nobody below 10 a week per trained group** - quads, hips (glutes + hamstrings), chest, back, shoulders, biceps, triceps, calves (COACH-R2 VOL-06; COACH-R3 VOL-01, SES-01); Focus muscle 1 / 2 +1-3 sets each (COACH-R3 SES-01); caps 14 / 22 / 25, priority 18 / 26-28 / 30, customizable, optional Pro level above 30 (VOL-06); 15-20 = "maintenance to a little bit of growth", 20-25 = "growth" (UNI-01); he believes most people train 20-30 (VOL-06; checked in 12 §2.11). The +4-6 priority push (VOL-02) is an optional coach setting (COACH-R3 SES-01). Calves **one exercise × 3 sets every leg day**, a rear-delt exercise every week inside the shoulders line (v1.1's own 4 / 6 / 8 retired), **core opener 2 × 2** (VOL-17; COACH-R2 SES-03; COACH-R3 VOL-01, SES-01). Counting: main mover 1.0, **helpers 0.25**, compounds → glutes 0.25, KB swings 0, 10/10 = 1 set, athletic work never counts (VOL-09, UNI-01, VOL-10; COACH-R2 VOL-05). Engine start table: 12 §3.3. | Coach count (section 3): quads (median 16) and hamstrings (12-16 by goal family) sit in his 15-20 band in about 40 % of views; **glutes only 5-6** (almost all helper credit, every compound at 0.25); upper body below 15 except the 6-day push/pull/legs and the 12-week aesthetics track (chest median 10 in hypertrophy programs, 4 in athletic ones). Rear delts (<6 in 51 of 58 views), calves (median 3) and abs (often 0 outside athletic programs) chronically low - not intended (VOL-17). |
| 4. Rep ranges | Small muscles **12-30** (20s, MAX, MYO), big muscles **5-15 mixed** (VOL-11). **No 40-rep sets** except an optional CrossFit/AMRAP style (VOL-11). Preference moves reps on **big compound lifts only**; weekly sets unchanged (VOL-12). Unilateral moderate-high by default, heavy low-rep optional (UNI-04). | Compounds **6-15** (mean ~10-12 physique, ~10 baseball, 6-8 heavy/athletic, 1-5 strength/peak). Isolation **15-20** or 'MAX REPS'/'MYO SET' (up to 30-40 in the fat-burn template). In practice single-joint = more reps (leg extensions get 20s and MYO sets). Section 4. |
| 5. Effort and rest | **RIR primary, 1-3 RIR on every working set**, the planned drift never leaves the band; **MAX = technical failure on small-muscle or bodyweight work only**; RPE shown as an explanation; % in strength/Olympic templates (VOL-13, PER-09); the planned cue drifts 3 RIR → 2 → 1-2 → 1 RIR + intensifiers across a block, inside 1-3 RIR (COACH-R3 VOL-04). Effort is not logged back (COACH-R3 VOL-02). Rest **1-2 min** hypertrophy (up to 3), **3-6 min** strength, athletic as prescribed; supersets rest after the pair (VOL-14). | '*Always leave 1 rep in the tank, never work up to failure but get as close as you can' and 'Always go for 1-3 RIR (REPS IN RESERVE) aka RPE 7+' (MM UL/PPL A4/A6; MM athletic A3/A5). Squat menus '(1 RIR) *RPE8+'. Strength ladder '1RIR' → '2RIR' → 'MAX' → 'ALL'. EFFORT menu: '8 - That was perfect' is the bullseye. Rest: '*REST 1-2 MIN BETWEEN SETS', '*REST 3-6 MIN BETWEEN SETS', '*REST AS PRESCRIBED'. Section 5. |
| 6. Athletic dosing | **Never counted as muscle sets** (VOL-10). Plyo share by sport **approved** (end of block): sprinters 75 %; volleyball, soccer, football skill 60 %; basketball, tennis, football big-skill, weekend warriors 50 %; baseball, softball, hockey, linemen, MMA 40 %; boxing, karate, kickboxing, wrestling, BJJ, golf 25 %; each block starts 15 points more ballistic, counted over jump and throw work (COACH-R2 ATH-01); the remaining sports placed by COACH-R3 ATH-04 (e.g. runners 75 %, lacrosse 60 %, pickleball and HYROX 50 %, swimming 25 %); Receive-Create stages 1 Land → 2 Land & Go → 3 Repeat (ATH-03); **Olympic lifts for everyone in athletic training** (ATH-10), up to 4 × a week (COACH-R2 ATH-04). Numbers per sport: §9.11 (contacts PROPOSED). | Lower-body plyo contacts **72-96/week** (BYOP template at 2 sets, INFERRED from rep picks), **132-191/week** (MM athletic), **258-306/week** (boxer weeks 3-8, of which 113-129 high intensity), **116-324/week** (baseball). Per session **18-77**, at or below the NSCA beginner 80-100. Throws **64-96/week** (BYOP), **70-290** (baseball), **190-420** (MM athletic and boxer). Cuts **48-64/week** (BYOP), zero in every MM example. Section 6. |
| 7. Conditioning | Aerobic sessions/week: **3** general/fat loss, **4** aesthetics/bodybuilders (Orange, Green, Blue + a second Orange) **+ optional 20-30-min walks after workouts**, **2** athletes in season, off-season by sport (2-4), pre-season 2, powerlifters 2 easy; HYROX 4; **0 extra for swimmers, runners, rowers and endurance cyclists**; a stay-active user's 45-60+ min activity session counts (up to 2); **every count adjustable up or down by the user** (ATH-07; COACH-R2 SES-06, ATH-06; COACH-R3 ATH-01, ATH-03, ATH-04, ATH-05); any erg, tracked by calories, time or distance (EQ-14). | Colour system: Blue 'A' short/high, Green 'B' moderate, Orange 'C' long/low; 'one of each colour every week, total of 3 Aerobic capacity workouts per week'; 'LVL 1 = C' ... 'LVL 4 = LACTATE CLERANCE'. Most templates schedule 2 ('WEDNESDAYS & SATURDAYS max 40 min of steady'); BYOP '3 DAY BUILDER' 3, bootcamp 2 six, CrossFit grids 2/2/3/4 by level, baseball buy-outs only. Section 7. |
| Weekly increase | **v1.3: the planned final sets are reached; steps may be faster than the pattern; no 7 % or 10 % limit; a note above about 15 %; a week may keep the same sets while reps or load progress** (COACH-CX CX-01, CX-02; COACH-R4 R4-PRG-01, R4-PRG-02). **The stairway** (COACH-R2 PER-03, PER-04, PER-05): small weekly steps in the first half (standard 3 %), slightly bigger after the halfway week (5 %), the hardest weeks last, scaled so the planned peak lands on the cap in the final week; % of weekly sets per muscle (VOL-04), never by muscle size (VOL-05); ~~never above 7 % planned, total below +10 %~~ (retired in v1.3); bank the fraction, add whole sets, first exercise first, Monday's exposure then Thursday's (VOL-06, VOL-07; COACH-R3 VOL-03). **Approved and computed once** (COACH-R3 VOL-04); **no check-in, nothing adapts, nothing stored** (COACH-R3 VOL-02, GEN-01; v1.1's check-in table is retired). Steps/waves for fight or competition prep (PER-10). Engine: 12 §3.7-3.9. | Never written as a percentage. Observed ramps are **whole-set steps every 2-3 weeks** with flat weeks between; the step weeks are +20 to +50 %. Block averages: **+4.75 %/week** (AESTHETICS-12), **+5.2 %** (STRENGTH-12), **+5.5 %** (CrossFit, if one level per month), but **+16.5 %** (AESTHETICS-8) and **+10.4 %** (HYBRID 8-week). Section 8. |
| Plan length and deload | Every plan is a stairway (8- and 12-week, short training blocks); 12 weeks preferred, last 4 weeks the hardest (COACH-R2 PER-03, PER-04); maintenance at 50-70 %, length chosen (no end prompt since v1.2: the plan just ends, COACH-R3 PER-01); pre-season 4-6 weeks at ~60 % + 1-2-week taper (PER-01; COACH-R2 PER-06); yearly gen-pop plan, tunable (COACH-R2 PER-01, PER-02); tests before and at the end only (PER-07). **No deload or maintenance inside a block**; the easy week (about half of the hardest week) between blocks is a **recommendation**; the block ends and the user builds the next (PER-05; COACH-R2 VOL-07; COACH-R3 PER-01). Engine: 12 §3.12. | Written deloads return to about week-1 volume (0.75-1.0 × week 1, -25 to -50 % from the peak); two 8-week athletic blocks end at the peak. Section 9.8. |

---

## 1. Counting conventions (read before any number)

1. **One working set** (a hard set at 1-3 RIR; warm-up sets and A-drills never count) = **1.0 set to the main mover and 0.25 to each clear helper** (COACH-ANSWER VOL-09: "I would suggest a 0.25 to the helpers, not a 0.5"; VOL-13, ORD-08). His exercise-level exceptions: **dips 0.5 triceps + 0.5 chest**, done on push days (COACH-ANSWER LIB-16); **thrusters 1.0 quads + 0.5 shoulders** (COACH-ANSWER LIB-14); leg extension and leg curl count fully to quads and hamstrings (COACH-ANSWER VOL-09); leg curls, nordics and slider/swiss-ball curls form their own **leg-flexion** segment, not hip dominant (COACH-ANSWER CAT-09); 'Pull under' = lat pull-over → lats 1.0 (COACH-ANSWER LIB-09); the Kong row (double-KB row from the floor) counts as a row but "doesn't really create a lot of stimulus", so the generator uses it for clients with shoulder or back pain, not to fill back volume (COACH-ANSWER LIB-09; use PROPOSED). Thrusters = 1.0 quads + 0.5 shoulders + 0.25 glutes ("that's good math", COACH-R2 VOL-05; it answers §11.3 item 14). Glutes: squats, lunges, deadlifts and RDLs 0.25, hip thrusts and bridges 1.0, **KB swings never** ("kettlebell swings are not glutes ... mostly supposed to be used for the ballistic movements", COACH-R2 VOL-05). KB face pulls are shoulder work (rear/side delts, traps) on pull or shoulder days (COACH-R2 LIB-04, LIB-10). **v1.2:** side, rear and front delts form one shoulders line, and a set counts at most 1.0 to a line or group (a face pull = 1 shoulder set; group credit, COACH-R3 VOL-01; rule PROPOSED in 12 §3.3); the observed tables below keep the delt heads separate as evidence. The full credit map lives in `12_volume_algorithm_v1.json > counting.credit_map`. A **'MYO SET'** (15 reps, then 5-rep clusters to 40 total, OBSERVED 'ALL ABOUT SQUATS' A30) counts as **2 hard sets** for its muscle, the same convention as 12 §3.1 (INFERRED, unchanged from v0); it is only allowed on the last machine or isolation exercise (COACH-ANSWER VOL-15).
   - SCIENCE: Pelland et al. (Sports Medicine, 2026) compared three ways of counting indirect sets (1, 0.5, 0) across 67 studies and found the **0.5 fractional count** fit hypertrophy best. The coach's 0.25 is lower. For chest, quads, hamstrings and back (mostly direct work) the two counts barely differ; for glutes, arms and delts his count is lower. The engine steers on the coach count; the 0.5 count may be shown beside it, never stored (v1.2: no data is kept, COACH-R3 GEN-01).
2. **Unilateral and alternating sets.** '10/10' means 10 reps on each side, and one 10/10 set = **1 set** to the primary muscle: 3 × 10/10 rear-foot-elevated lunges = 3 quad sets ("I don't necessarily count it for glutes, but we can figure out a way"; glute credit 0.25, COACH-R2 VOL-05) (COACH-ANSWER UNI-01). Alternating lifts count the same way (COACH-ANSWER UNI-07). A unilateral set takes longer and "has to be accounted for" in session time (COACH-ANSWER UNI-09; 1.5 × a bilateral set, PROPOSED in 12 §3.10).
3. **Athletic sets never count toward muscle sets** (COACH-ANSWER VOL-10: "counting towards muscles is more for resistance patterns, not for athletic patterns"); KB swings are ballistic and never glute volume (COACH-R2 VOL-05). Plyos, ballistics, throws, Olympic lifts, sprints and change of direction are tracked in their own units (contacts, throws, reps, meters or bouts, cuts; 12 §3.13). SCIENCE background, kept from v0: in combat-sport athletes plyometric training did not change muscle mass (Ramirez-Campillo et al., Sports 2023; ES -0.01 to -0.06), while a review of 6 plyometric-vs-resistance trials found similar lower-body hypertrophy in untrained or recreational people over up to 12 weeks (Grgic, Schoenfeld, Mikulic, J Sport Health Sci 2021). The coach's rule decides the accounting. The v0 rule that charged athletic sets 0.5 each against a "lower-body fatigue budget" is retired: the recovery cost of athletic work is handled by the athlete volume factors (12 §3.4) and the separate athletic budget with NSCA contact caps (12 §3.13).
4. **Single canonical credit map for the comparison tables (section 3), v1 coach count.** Every program is recomputed from its bucket totals with one map:

| Bucket | 1.0 | 0.5 | 0.25 | Tag |
|---|---|---|---|---|
| RP_BKD (squat, leg press) | quads | - | glutes | COACH-ANSWER VOL-09; glute 0.25 COACH-R2 VOL-05 |
| RP_UKD (split squat, lunge, step-up) | quads | - | glutes | COACH-ANSWER UNI-01 ("mostly for quads"), VOL-09; glute 0.25 COACH-R2 VOL-05 |
| RP_BHD, RP_UHD (hinges, single-leg RDL) | hamstrings | - | glutes | COACH-R2 VOL-05 ("a quarter"; v1: 0.5 PROPOSED) |
| RP_HPUSH | chest | - | front delts, triceps | COACH-ANSWER VOL-09 |
| RP_VPUSH | front delts | - | side delts, triceps | COACH-ANSWER VOL-09 |
| RP_HPULL | lats/upper back | - | rear delts, biceps | COACH-ANSWER VOL-09 |
| RP_VPULL | lats/upper back | - | biceps | COACH-ANSWER VOL-09 |
| ISO_QUAD / ISO_HAM (leg flexion) / ISO_CHEST / ISO_BICEP / ISO_TRICEP / ISO_CALF | the target muscle | - | - | COACH-ANSWER VOL-09, CAT-09 |
| ISO_SIDE_REAR_DELT | split by the exercise written (below) | - | - | OBSERVED |
| any core bucket | abs/obliques | - | - | COACH-ANSWER CAT-08 |
| AP_* (plyo, jump, throw, COD, sprint, triple extension) | none | - | - | COACH-ANSWER VOL-10 |

   The bucket recompute cannot see per-exercise overrides (dips, thrusters, upright rows, plyo push-ups, curl-to-press), so a cell can differ by 1-3 sets from an exercise-level count. The ISO_SIDE_REAR_DELT bucket is split by the exercise actually written (unchanged from the v0 second verification pass): 'Reverse Flies' (BYOP PPL), 'DB Reverse Flies or Machine' (MM PPL), 'face pulls' / 'machine or db Reverse flies' (AESTHETICS-12) → rear delts 1.0; 'Front Raises' (MM athletic STARTING, boxer weeks 3-8) → front delts 1.0; side raises and upright rows → side delts 1.0. Baseball's few 'bent over db Reverse flies' / 'db front raises' rows (about 1 set/week) stay in side delts.
   - **What the v1 count changes:** the v0 analyst map gave synergists 0.5 and credited glutes 1.0 from every hinge and unilateral knee set, so glutes looked like the most-trained muscle in the model (median 21 in hypertrophy programs). Under the coach count the same programs give glutes a median of 9 in v1 (hinges 0.5) and **6 in v1.1** (every compound 0.25, COACH-R2 VOL-05). The v0 numbers stay in `03_volume_rules.json > observed.program_views[].normalized_muscles` (labelled v0 analyst map), the v1 numbers are in `normalized_muscles_coach_v1` (hinges 0.5), the v1.1 numbers in `normalized_muscles_coach_v1_1` (all compounds 0.25; only glutes differ), and the decode files' own numbers stay in `reported_muscles`.
5. **"As written" vs "assumed".** Most BYOP templates are empty ('CHOOSE 👇'), so their volume is slot count × an assumed set number. Two assumptions recur, and the coach confirmed both as his defaults (COACH-ANSWER VOL-16): **3 sets on compounds and calves, 2 on other isolation** (taken from the only filled BYOP day) and **2 sets per slot in athletic templates** (every filled 'JUSTICE LEAGUE' slot). MM tabs are fully typed, so their numbers are observed except where the coach left a dose blank (noted).
6. **Reps stored as dates; rep notation.** Google Sheets turned '12/12', '8/8', '6-8', '3-4', '10/10' into dates in many MM cells (OBSERVED, all decode files). The generator must store reps as text. 'N/N' = N per side (COACH-ANSWER UNI-01, PRG-07: "10 and 10 means 10 on each arm. If I put it bilateral on purpose, then it would be a set of 10 and then another set of 10"). '12/10/8 -20' = four sets: 12 at mid weight, 10 heavier, 8 heaviest, then a light 20 (COACH-ANSWER PRG-07).

---

## 2. Exercises and working sets per session (questions 1 and 2)

### 2.1 Per program (OBSERVED counts; sets assumed where the template is empty)

| Program (tab) | Goal | Level | Days/wk | Exercises per session | Working sets per session | Sets per exercise |
|---|---|---|---|---|---|---|
| BYOP 'AESTHETICS - FULL BODY - 4 DAYS' | physique | per slot | 4 (+2 optional) | 7 / 7 / 7 / 7; optional 5 | 19 (Day 1 as written), 19-21 assumed; optional ~12 | compounds 3, isolation 2, calves 3, one 'DB Push press' 5 |
| BYOP '3 DAY BUILDER' | physique | per slot | 3 (+3 optional) | 5 / 5 / 5; optional 5 | 14-15 | 3 (assumed) |
| BYOP 'NO ACCESS - AESTHETICS - FB - 4' (hidden) | physique logbook | per slot | 4 + 2 optional | 7 / 7 / 5 / 7 / 7 / 5 | 17-21 | assumed |
| BYOP 'ATHLETIC - FULL BODY - 4 DAYS A' | athletic | per slot | 4 (+2 optional) | 10 / 10 / 10 / 10 (A day 5 athletic + 5 resistance; B day 4 + 6); optional 5 | 20 at 2 sets, 30 at 3 | template blank except G12 'MYO SET' pre-filled on the Monday 'Leg Extensions' slot |
| BYOP 'JUSTICE LEAGUE' (a weekend-warrior athletic program for non-competitive adults and youth, not a real team; COACH-ANSWER ATH-13) | athletic, non-competitive | mixed per slot | 4 (+2) | 10 (Monday fully filled) | **20** (Monday: 10 athletic + 10 resistance) | **2 on every filled slot** (11 of 11 cells) |
| BYOP 'PUSHPULLLEGS - 3 or 6 DAYS A WK' | hypertrophy | per slot | 6 (or 3) | 7 every day | 21 at 3 sets; 17-18 coach-default | assumed |
| BYOP 'BOOTCAMP - OPTION 1' | bootcamp | per slot | 4 (+2) | 7 / 7 / 5 / 7 / 7 / 5 | 21 / 12 at 3 sets | assumed |
| BYOP 'BOOTCAMP - OPTION 2' (title cell A1 reads 'BOOTCAMP OPTION 1') | bootcamp | per slot | 6 short (sessions '1A'-'3B', no weekdays; 'SUNDAY' 'OFF') | 5 (4 + 'Cardio') | 12 + 1 cardio bout (assumed 3 sets) | no dose columns at all |
| MM 'EXAMPLE UPPERLOWER SPLIT' | hypertrophy/general | 'NOVICE' / 'NEWBY' / 'INTERMEDIATE' | 4 (inferred A/B/A/B) | lower 10 (3 A-drills + 7 lifts), upper 8 | NOV 20 / 24, NEW 30 / 24, INT 32 / 27 | 2-4 |
| MM 'EXAMPLE PUSHPULLLEGS SPLIT' | hypertrophy | same three | 3 or 6 | push 6, pull 6, legs 10 | NOV 16 / 18 / 20, NEW 18 / 20 / 30, INT 20 / 23 / 32 | 2-5 (pulldown 5 x 12 at INT) |
| MM 'EXAMPLE FAT BURNBODY TONING PRO' | fat loss | one | 4 lifting + 2 cardio | 5 every lifting day + a 4-station circuit on 2 days | 14-18 (WK1 15, WK4 17-18) | 2-4 (never more than 4) |
| MM 'EXAMPLE ATHLETIC FULL BODY SPLI' | athletic off-season | 'STARTING' / ' MID' / ' ADVANCED' | 3 / 4 / 4 | lines 10 / 7 / 7; 10 / 14 / 8 / 16; 6 / 6 / 8 / 6 | 35 / 24 / 30; 21 / 10 / 25 / 16; 14 / 19 / 17 / 9 (excl. throws; every superset/complex component counted as its own set - analyst convention, the sheet gives one set number per line) | Starting 1-5 (mostly 2-3; 'Side Plank presses' 5 x ':30 sec./ :30 sec.'), Mid 1-4 (mostly 1-2; 'Lateral Step ups' 4, 'HEX bar loaded Jumps' 3, one line '2 to 4'), Advanced 1-3 |
| MM 'EXAMPLE BOXING 8 WEEK BUILD UP' | fighter | one | 4 | wk1-2 8 / 7 / 7 / 6; wk3-8 8 / 5 / 7 / 5 lines (10 / 9 / 12 / 10 movements) | wk1-2 24 / 18 / 20 / 18; wk3 30 / 24 / 36 / 23; wk8 30 / 30 / 39 / 37 | wk1-2 3; wk3-8 2-3, ramping rows to 4-6 in wk8 |
| MM 'BASEBALL' (24 weeks) | baseball | int-adv | 4 | median 9 (6-11); recovery week 3 | median 29 (22-51; 51 = complex rounds counted per component) | Part C/D 4 (5 late pre-season, 3 deload); Part A 2-3 |
| MM 'EXAMPLE CROSSFIT SPLIT' competitor | CrossFit | macro levels 1-4 | 4 (+SAT) | 1-4 quality components/day | 2-15 lifting sets/day | strength 3-6, power 3-6, resistance 2-3 |
| MM '4 TRACKS' STRENGTH-8 / 'EXAMPLE CONJUGATE' | strength | int-adv | 4 | 4 / 4 / 4 / 3 | 14 / 15 / 16 / 11 (v04); 15 / 16 / 16 / 13 (draft) | column B (week 1): Mon/Wed 5 / 3 / 4 / 2-3, Thu 3 / 5 / 4 / 4, Sat 3 / 4 / 4 (no 4th row). So 'the work' is 5 on the 'M.E.' days but 3 on Thu ('EASY' plyo 3 x 6) and Sat ('FAST BANDED BENCH PRESS'); accessory 3-5; nuance 4; survival 2-4. Ladders in E4:L6, colour-matched to the cells that say 'SEE': green B6D7A8 5,5,4,4,3,3,2,1 (same green as the 'the work' set cells B9/B13/B17/B21, read as weekly sets, INFERRED); pink EAD1DC 5,4,3,2,1,3,2,1 (= reps for the Mon/Wed 'SEE' cells C9/C13); blue CFE2F3 3,3,2,1,3,2,1,1 (= reps for the Thu/Sat 'FAST' 'SEE' cells C18/C21) |
| MM '4 TRACKS' STRENGTH-12 | strength | int | 4 | 4 / 4 / 4 / 4 | 10-13 as written, 13-16 with accessory assumed | header 'SETS' 4,4,5,5,6,6,3,5,6,6,7,7 |
| MM '4 TRACKS' AESTHETICS-8 | physique | gen-int | 4 + 2 cardio | 5 / 5 / 5 / 4 | 10 / 10 / 10 / 8 (wk1) -> 25 / 25 / 25 / 20 (wk7) | header 'SETS' 2,3,3,3,4,4,5 |
| MM '4 TRACKS' AESTHETICS-12 (push/pull/legs x2) | physique | int | 6 | 5-6 | 15-18 (wk1) -> 23-25 (wk12) | header 3,3,3,4,4,4,3,4,4,4,4,5 |
| MM '4 TRACKS' HYBRID | hybrid | int | 5 | 4-6 components | 8-12 (wk1) -> 15-22 (wk8) assumed | header 2,2,2,3,3,3,4,4 |

### 2.2 What the session counts say (INFERRED rules, read against the coach's answers)

- **The coach thinks in exercises and minutes, not in a set budget.** His answers: 5-7 exercises for resistance sessions, up to 10-12 for off-season field athletes; ~1.5 h (max 2 h) for athletes, bodybuilders and powerlifters, 45-60 min for general and weight-loss clients (COACH-ANSWER VOL-08, VOL-16, VOL-17, UNI-09). The ~20-set day below is what a 60-minute, 7-exercise session holds (12 §3.10 time model), so it stays as an observation, not as a cap (section 9.10).
- **A fixed session budget of about 20 working sets** is the most stable number in the whole model. AESTHETICS Day 1 (7 exercises, 19 sets), the athletic 'JUSTICE LEAGUE' Monday (10 exercises, 20 sets), PPL (21 at 3 sets, 17-18 coach-default), bootcamp (21), UL/PPL examples (16-32) and the 4-track peaks (20-25) all cluster at 15-25. Baseball goes higher (median 29) because Part C is a superset and Part D a tri-set, so density is higher per minute.
- **Athletic work buys slots by lowering sets per exercise.** The athletic template keeps the ~20-set session and spends about 45 % of it (36 of 80 weekly sets) on athletic qualities, which drops sets per exercise from 3 to 2 (OBSERVED in 'JUSTICE LEAGUE': 2 sets on all 11 filled slots; confirmed as his athletic-template default, COACH-ANSWER VOL-16).
- **Level changes the dose, not the number of exercises**, in the gym splits (UL/PPL keep the same 8-10 exercises at every level). In the athletic off-season ladder the opposite happens: higher level = **fewer** exercises and sets per session (Advanced 6-8 lines, 9-19 sets) and higher intensity. This holds for working sets excluding the medicine-ball throws (89 -> 72 -> 59 per week); counting each throw line as a set, MID (112) sits above STARTING (108) because MID doubles the throw volume, and only ADVANCED drops (97). MID also has more lines per session than STARTING (10 / 14 / 8 / 16 vs 10 / 7 / 7).
- **Optional days hold 5 low-cost slots** (calves, cardio, core, two Focus slots). They are where specialisation volume lives. The coach: they can be add-ons or separate days, "ideally separate days, so they don't get in the way"; both Focus slots may hit the same muscle (COACH-ANSWER ORD-10, ORD-11).

### 2.3 Weekly totals (sets per week, all sources)

| View | Resistance (RP+ISO) | Core | Athletic excl. throws | Throw sets | Focus | Total |
|---|---|---|---|---|---|---|
| BYOP AESTHETICS 4 main days (coach-default) | 78 | 0 | 0 | 0 | 0 | 78 |
| ... + 2 optional days | 84 | 6 | 0 | 0 | 12 | 102 |
| BYOP 3 DAY BUILDER main / + optional | 44 / 53 | 0 / 9 | 0 | 0 | 0 / 18 | 44 / 80 |
| BYOP ATHLETIC 4 main days @2 / @3 | 44 / 66 | 0 | 28 / 42 | 8 / 12 | 0 | 80 / 120 |
| BYOP PPL 6-day @3 / coach-default | 120 / 102 | 0 | 0 | 0 | 6 / 4 | 126 / 106 |
| BYOP BOOTCAMP 1 4-day @3 / + Wed-Sat | 84 / 90 | 0 / 6 | 0 | 0 | 0 / 12 | 84 / 108 |
| BYOP BOOTCAMP 2 6 sessions @3 | 66 | 6 | 0 | 0 | 0 | 72 |
| MM UL NOV / NEW / INT (4 d) | 76 / 90 / 102 | 0 | 12 / 18 / 16 (A-drills) | 0 | 0 | 88 / 108 / 118 |
| MM PPL NOV / NEW / INT, 6 d | 94 / 116 / 132 | 2 | 12 / 18 / 16 | 0 | 0 | 108 / 136 / 150 |
| MM FAT BURN WK1 -> WK4 (lifting only) | 60 -> 70 | 0 (core in circuits: 9-15) | 0 | 0 | 0 | 60 -> 70 (+ circuits 24 -> 40 station-sets) |
| MM ATHLETIC STARTING / MID / ADVANCED | 44 / 44 / 24 | 20 / 14 / 26 | 25 / 14 / 9 | 19 / 40 / 38 | 0 | 89 / 72 / 59 excl. throws; 108 / 112 / 97 incl. throws |
| MM BOXING wk1-2 / wk3-6 / wk7 / wk8 | 66 / 57 / 50 / 68 | 14 / 16-18 / 16 / 20 | 0 / 40-42 / 38 / 48 | 19 / 38 / 38 / 38 | 0 | 80 / 113-117 / 104 / 136 excl. throws; 99 / 151-155 / 142 / 174 incl. throws |
| MM BASEBALL block means B1 / B2 / B3 | 72 / 78 / 72 | 11 / 16 / 16 | 16 / 26 / 21 | 9 / 11 / 12 | 0 | 105-151 per week; deload 82 |
| MM CrossFit competitor JULY (peak lifting) | 60 (24 strength + 36 illustrative resistance) | 0 | 0 | 0 | 0 | 36 as written |
| MM STRENGTH-8 (mean wk1-7) / STRENGTH-12 (mean loading) | 53 / 58 | 0 | 3 / 0 | 0 | 0 | 56 / 48-64 |
| MM AESTHETICS-8 wk1 -> wk7 | 32 -> 80 | 0 | 0 | 0 | 6 -> 15 | 38 -> 95 |
| MM AESTHETICS-12 wk1 / wk6 / wk12 | 96 / 128 / 158 | 0 | 0 | 0 | 0 | 96 / 128 / 158 (wk12 = 148 written exercise sets + 10 superset-finisher sets: Tue Z41 'Superset with 15 squats with no weight every set' and Thu Z52 'superset with a set of max bench dips', 5 each) |
| MM HYBRID wk1 -> wk8 | 27 -> 56 | 11 -> 16 | 10 | 0 | 6 -> 12 | 54 -> 94 |

**Reps per session (OBSERVED arithmetic in the decodes).** AESTHETICS Day 1 about 275 reps (rep-range midpoints). 'JUSTICE LEAGUE' Monday about 204-256 reps (64-88 athletic, 140-168 resistance, of which 80 are two MYO sets). UL sessions 248-360 reps. FAT BURN 781 -> 1040 reps per week.

### 2.4 Against the science (SCIENCE)

- **Per-session ceiling.** A per-session meta-regression (Remmert, Pelland, Robinson, Hinson, Zourdos; SportRxiv preprint) found hypertrophy gains stop being detectably better beyond about **11 fractional sets per muscle per session**, and strength beyond about **2 direct sets per session** (point of undetectable outcome superiority, not a harm threshold). Many of the coach's sessions sit below 11 (AESTHETICS A day: quads 3 BKD + 3 UKD + 2 leg extension = 8; baseball Part C+D: quads or hamstrings about 8). Quads reach it on the MM UL/PPL 'INTERMEDIATE' lower day (squat 4 + lunges 4 + leg ext 3 = 11) and pass it on the AESTHETICS-12 week-12 legs day (front squat 5 + leg press 5 + lunges 5 + supersets). Under the v0 analyst map several lower days also passed it for **glutes** (UL/PPL 'INTERMEDIATE' 13, FAT BURN WK4 12) because every lower slot credited glutes 0.5-1.0; under the coach count (helpers 0.25; every compound 0.25 for glutes since COACH-R2 VOL-05; section 1) glute credit per lower day drops to a quarter or less and stays well under 11. The engine uses 11 fractional sets per muscle per session as a soft ceiling, 14 for a priority muscle (12 §3.10, PROPOSED).
- **Frequency.** In the 4-day full-body, 6-day push/pull/legs, bootcamp and athletic templates every main pattern is trained **2x/week** (OBSERVED). It is **not** universal: BYOP '3 DAY BUILDER' trains vertical pull, vertical push, unilateral hip, leg curls and calves **once** a week (bilateral knee/hip, horizontal push/pull and unilateral knee twice), and the 3-day variants of both push/pull/legs tabs train every pattern once a week. A volume-equated meta-analysis (Schoenfeld et al., 2019) found frequency does not matter much for hypertrophy when weekly sets are equal, and practical guidance is at least 2x/week; Pelland et al. found frequency matters more for strength. The 2x/week default is well supported; the 1x/week cases are where the coach accepts lower frequency for fewer days.

---

## 3. Weekly sets per muscle and per bucket (question 3)

### 3.1 Every decoded program on one convention (v1 coach count, section 1)

Columns: days per week; weekly resistance (RP+ISO), core, athletic excluding throws, throw and Focus sets; then fractional sets per muscle with **main mover 1.0 and helpers 0.25** (COACH-ANSWER VOL-09; glutes 0.25 from every compound, COACH-R2 VOL-05; recomputed in v1.1). Bold = inside the coach's 15-20 band ("a good foundation for maintenance to a little bit of growth", COACH-ANSWER UNI-01). Means (baseball blocks, strength tracks) are shown to one decimal. Athletic sets are never credited (COACH-ANSWER VOL-10). **KB swings get no muscle credit** (COACH-R2 VOL-05): the decodes file them under bilateral hip dominant, as his library does (OBSERVED), so they stay in the `res` column as written, but their sets (MM athletic STARTING 3 a week; boxer weeks 3-6 3, week 7 4, week 8 6; baseball 2-5 a week) no longer credit hamstrings 1.0 and glutes 0.25 (fixed in the v1.1 adversarial verification; per view in the JSON field `kb_swing_sets_no_credit_v1_1`).

| View | days | res | core | ath | throws | focus | quads | glutes | hams | chest | back | f.delt | s.delt | r.delt | biceps | triceps | calves | abs |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| BYOP_AES4 main (coach-default) | 4 | 78 | 0 | 0 | 0 | 0 | **16** | 6 | **16** | 6 | 12 | 11.5 | 6.5 | 1.5 | 7 | 8 | 6 | 0 |
| BYOP_AES4 + optional | 6 | 84 | 6 | 0 | 0 | 12 | **16** | 6 | **16** | 6 | 12 | 11.5 | 6.5 | 1.5 | 7 | 8 | 12 | 6 |
| BYOP_AES3 main | 3 | 44 | 0 | 0 | 0 | 0 | 12 | 5.25 | 11 | 6 | 9 | 4.5 | 0.75 | 1.5 | 2.25 | 2.25 | 3 | 0 |
| BYOP_AES3 + optional | 6 | 53 | 9 | 0 | 0 | 18 | 12 | 5.25 | 11 | 6 | 9 | 4.5 | 0.75 | 1.5 | 2.25 | 2.25 | 12 | 9 |
| BYOP_ATH4 @2 sets | 4 | 44 | 0 | 28 | 8 | 0 | 12 | 4 | 12 | 4 | 8 | 5 | 5 | 1 | 2 | 2 | 0 | 0 |
| BYOP_ATH4 @3 sets | 4 | 66 | 0 | 42 | 12 | 0 | **18** | 6 | **18** | 6 | 12 | 7.5 | 7.5 | 1.5 | 3 | 3 | 0 | 0 |
| BYOP_ATH4 @2, 6 days | 6 | 48 | 4 | 28 | 8 | 8 | 12 | 4 | 12 | 4 | 8 | 5 | 5 | 1 | 2 | 2 | 4 | 4 |
| BYOP_PPL 6-day @3 | 6 | 120 | 0 | 0 | 0 | 6 | **18** | 6 | **18** | 24 | **18** | 10.5 | 7.5 | 9 | **16.5** | **18** | 0 | 0 |
| BYOP_PPL 6-day coach-default | 6 | 102 | 0 | 0 | 0 | 4 | **16** | 6 | **16** | 22 | **18** | 10.5 | 5.5 | 7 | 12.5 | 14 | 0 | 0 |
| BYOP_PPL 3-day @3 | 3 | 60 | 0 | 0 | 0 | 3 | 9 | 3 | 9 | 12 | 9 | 5.25 | 3.75 | 4.5 | 8.25 | 9 | 0 | 0 |
| BYOP_BOOT1 4-day @3 | 4 | 84 | 0 | 0 | 0 | 0 | **18** | 6 | **18** | 6 | 12 | 7.5 | 7.5 | 1.5 | 9 | 9 | 6 | 0 |
| BYOP_BOOT1 6-day @3 | 6 | 90 | 6 | 0 | 0 | 12 | **18** | 6 | **18** | 6 | 12 | 7.5 | 7.5 | 1.5 | 9 | 9 | 12 | 6 |
| BYOP_BOOT2 6 sessions @3 | 6 | 66 | 6 | 0 | 0 | 0 | 12 | 6 | 12 | 6 | 12 | 7.5 | 7.5 | 1.5 | 9 | 9 | 0 | 6 |
| MM_UL 'NOVICE' 4d | 4 | 76 | 0 | 12 | 0 | 0 | 12 | 4 | 12 | 6 | 12 | 7.5 | 13.5 | 1.5 | 9 | 9 | 4 | 0 |
| MM_UL 'NEWBY' 4d | 4 | 90 | 0 | 18 | 0 | 0 | **18** | 6 | **18** | 6 | 12 | 7.5 | 13.5 | 1.5 | 9 | 9 | 6 | 0 |
| MM_UL 'INTERMEDIATE' 4d | 4 | 102 | 0 | 16 | 0 | 0 | 22 | 7.5 | **20** | 8 | 14 | 10 | 14 | 1.5 | 9.5 | 10 | 6 | 0 |
| MM_PPL 'NOVICE' 3d | 3 | 47 | 1 | 6 | 0 | 0 | 6 | 2 | 6 | 9 | 6 | 2.25 | 6 | 3.75 | 7.5 | 5.25 | 2 | 1 |
| MM_PPL 'NOVICE' 6d | 6 | 94 | 2 | 12 | 0 | 0 | 12 | 4 | 12 | **18** | 12 | 4.5 | 12 | 7.5 | **15** | 10.5 | 4 | 2 |
| MM_PPL 'NEWBY' 6d | 6 | 116 | 2 | 18 | 0 | 0 | **18** | 6 | **18** | **20** | **16** | 5 | 14 | 8 | **16** | 11 | 6 | 2 |
| MM_PPL 'INTERMEDIATE' 3d | 3 | 66 | 1 | 8 | 0 | 0 | 11 | 3.75 | 10 | 12 | 9 | 3 | 8 | 5 | 8.25 | 6 | 3 | 1 |
| MM_PPL 'INTERMEDIATE' 6d | 6 | 132 | 2 | 16 | 0 | 0 | 22 | 7.5 | **20** | 24 | **18** | 6 | **16** | 10 | **16.5** | 12 | 6 | 2 |
| MM_FATBURN WK1 | 4 | 60 | 0 | 0 | 0 | 0 | **16** | 5.5 | 14 | 7 | 13 | 4.75 | 3.75 | 1.5 | 5.25 | 4.5 | 0 | 0 |
| MM_FATBURN WK4 | 4 | 70 | 0 | 0 | 0 | 0 | **17** | 7 | **17** | 8 | **15** | 5 | 4.75 | 1.75 | 6.75 | 5.75 | 0 | 0 |
| MM_ATH 'STARTING' | 3 | 44 | 20 | 25 | 19 | 0 | 11 | 4.25 | **15** | 0 | 6 | 6 | 3.75 | 0.75 | 1.5 | 0.75 | 0 | **20** |
| MM_ATH ' MID' | 4 | 44 | 14 | 14 | 40 | 0 | 9 | 4 | 11 | 4 | 6 | 3 | 2.5 | 0.5 | 6.5 | 6.5 | 0 | 14 |
| MM_ATH ' ADVANCED' | 4 | 24 | 26 | 9 | 38 | 0 | 5 | 2.5 | 7 | 0 | 2 | 2 | 2.5 | 0.5 | 2.5 | 2.5 | 2 | 26 |
| MM_BOX wk1-2 | 4 | 66 | 14 | 0 | 19 | 0 | **18** | 6 | **18** | 6 | 12 | 7.5 | 1.5 | 1.5 | 6 | 6 | 0 | 14 |
| MM_BOX wk3 (= wk4) | 4 | 57 | 16 | 40 | 38 | 0 | 21 | 6 | **18** | 0 | 3 | 6 | 3.75 | 0.75 | 0.75 | 0.75 | 3 | **16** |
| MM_BOX wk7 (mini-deload) | 4 | 50 | 16 | 38 | 38 | 0 | **16** | 5 | 14 | 0 | 4 | 7 | 4 | 1 | 1 | 1 | 2 | **16** |
| MM_BOX wk8 (peak) | 4 | 68 | 20 | 48 | 38 | 0 | 21 | 7 | 22 | 0 | 6 | 8 | 3.5 | 1.5 | 1.5 | 1.5 | 3 | **20** |
| MM_BASEBALL block 1 mean | 4 | 72 | 11 | 16 | 9 | 0 | 14.3 | 5.85 | 12.1 | 5.1 | 8.6 | 6.4 | 5.9 | 1.1 | 10.8 | 8.8 | 4.6 | 11.4 |
| MM_BASEBALL block 2 mean | 4 | 78 | 16 | 26 | 11 | 0 | **16.6** | 6.91 | 14.1 | 6.4 | 9.4 | 5.9 | 7.1 | 0.9 | 10.1 | 8 | 4.9 | **15.5** |
| MM_BASEBALL block 2 'WEEK 8' (peak) | 4 | 84 | 15 | 36 | 16 | 0 | **19** | 8.5 | **15** | 5 | 10 | 6.25 | 8.25 | 0 | 9.5 | 8.5 | 5 | **15** |
| MM_BASEBALL block 2 'DELOAD WEEK' | 4 | 58 | 7 | 9 | 8 | 0 | 12.5 | 5.38 | 9 | 3 | 6.5 | 3.75 | 6.75 | 0.88 | 7.62 | 7.5 | 3 | 7 |
| MM_BASEBALL block 3 mean (in-season) | 4 | 72 | 16 | 21 | 12 | 0 | 12.5 | 6.12 | 14 | 6 | 8.5 | 6 | 6.6 | 1.1 | 10.1 | 9.1 | 4.5 | **16.3** |
| MM_CF competitor JULY (illustrative resistance) | 4 | 60 | 0 | 0 | 0 | 0 | **15** | 6 | **15** | 6 | 12 | 7.5 | 4.5 | 1.5 | 4.5 | 4.5 | 0 | 0 |
| MM_CF class wk1 ('HALF TIME') | 6 | 9 | 0 | 6 | 0 | 0 | 3 | 1.5 | 3 | 0 | 0 | 3 | 0.75 | 0 | 0 | 0.75 | 0 | 0 |
| MM STRENGTH-8 v04 mean wk1-7 | 4 | 53 | 0 | 3 | 0 | 0 | 10.4 | 4.75 | 8.6 | 12.6 | **15** | 6.6 | 0.9 | 1.9 | 6.8 | 4 | 0 | 0 |
| MM STRENGTH-12 mean of loading weeks | 4 | 58 | 0 | 0 | 0 | 0 | 14.4 | 5.77 | 14.7 | 14.1 | 6 | 2.8 | 1.4 | 0.8 | 3.1 | 8.8 | 0 | 0 |
| MM AESTHETICS-8 wk1 | 4 | 32 | 0 | 0 | 0 | 6 | 8 | 4 | 8 | 4 | 8 | 5 | 1 | 1 | 2 | 2 | 0 | 0 |
| MM AESTHETICS-8 wk7 | 4 | 80 | 0 | 0 | 0 | 15 | **20** | 10 | **20** | 10 | **20** | 2.5 | 10 | 2.5 | 5 | 2.5 | 0 | 0 |
| MM AESTHETICS-12 wk1 | 6 | 96 | 0 | 0 | 0 | 0 | **18** | 7.5 | 12 | **15** | **18** | 2.25 | 6 | 7.5 | 10.5 | **17.25** | 0 | 0 |
| MM AESTHETICS-12 wk6 | 6 | 128 | 0 | 0 | 0 | 0 | 28 | 9 | 12 | 24 | 24 | 4 | **16** | 2 | 14 | **20** | 0 | 0 |
| MM AESTHETICS-12 wk12 | 6 | 158 | 0 | 0 | 0 | 0 | 33 | 10.75 | **20** | 30 | 30 | **15** | 2.5 | **15** | **17.5** | 22.5 | 0 | 0 |
| MM HYBRID wk1 | 5 | 27 | 11 | 10 | 0 | 6 | 8 | 4 | 8 | 5 | 4 | 3.25 | 0.5 | 1 | 1 | 1.75 | 0 | 11 |
| MM HYBRID wk8 | 5 | 56 | 16 | 10 | 0 | 12 | **16** | 8 | **16** | 4 | 12 | 9 | 2 | 2 | 3 | 3 | 0 | **16** |

The full list of 61 views (every scenario, every boxing week, every level) is in `03_volume_rules.json` → `observed.program_views`, each with `normalized_muscles_coach_v1_1` (this table: every compound 0.25 for glutes, KB swings uncredited), `normalized_muscles_coach_v1` (v1 history: hinges 0.5 for glutes) and `normalized_muscles` (the v0 analyst map, synergists 0.5 and glutes 0.5-1.0 from every lower slot).

### 3.2 Medians by goal family (coach count; [min-max]; delt columns use the exercise-level split of section 1.4)

| Goal family (views) | quads | glutes | hams | chest | back | f.delt | s.delt | r.delt | biceps | triceps | calves | abs |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| hypertrophy/aesthetics (23) | 16 [6-33] | 6 [2-10.75] | 12 [6-20] | 10 [4-30] | 12 [6-30] | 5.2 [2.2-15] | 6.5 [0.8-16] | 3.5 [1-15] | 8.2 [2-17.5] | 9 [2-22.5] | 3 [0-12] | 0 [0-9] |
| bootcamp/general (6) | 16 [12-18] | 6 [6-6] | 16 [12-18] | 6 | 12 | 7.5 | 6.5 [5.5-7.5] | 1.5 | 8 [7-9] | 8 [7-9] | 6 [0-12] | 4 [0-6] |
| fat loss, 4 weeks (4) | 15.5 [15-17] | 6 [5.5-7] | 14.5 [13-17] | 7.5 [7-8] | 14 [13-15] | 3.4 [1.8-5] | 5.4 [3.8-7] | 1.6 [1.5-1.8] | 6 [5.2-6.8] | 4.8 [3.8-5.8] | 0 | 0 |
| athletic incl. baseball, boxing, hybrid (20) | 16 [5-21] | 6 [2.5-8.5] | 14.5 [7-22] | 4 [0-6.4] | 6.2 [2-12] | 6 [2-9] | 3.8 [0.5-8.2] | 1 [0-2] | 2.2 [0.8-10.8] | 2.2 [0.8-9.1] | 3 [0-5] | 15.8 [0-26] |
| strength/CrossFit (5) | 10.9 [3-15] | 5 [1.5-6] | 9.1 [3-15] | 12.6 [0-14.1] | 12 [0-16] | 6.6 [2.8-7.7] | 1.1 [0.8-4.5] | 1.5 [0-2] | 4.5 [0-7] | 4.5 [0.8-8.8] | 0 | 0 |

### 3.3 Where each muscle lands (count of the 58 comparable views, coach count)

Bands follow the coach's own numbers: 10-12 = beginner start, **15-20** = intermediate start / maintenance to some growth, 20-25 = growth, 25-30 = priority cap (COACH-ANSWER VOL-01, UNI-01, VOL-02).

| Muscle | <6 | 6-9.9 | 10-14.9 | **15-20** | 20.1-25 | >25 |
|---|---|---|---|---|---|---|
| quads | 2 | 7 | 17 | **23** | 7 | 2 |
| glutes | 25 | 31 | 2 | **0** | 0 | 0 |
| hamstrings | 1 | 10 | 20 | **26** | 1 | 0 |
| chest | 18 | 24 | 8 | **3** | 4 | 1 |
| lats / upper back | 8 | 18 | 21 | **9** | 1 | 1 |
| front delts | 26 | 26 | 5 | **1** | 0 | 0 |
| side delts | 33 | 17 | 6 | **2** | 0 | 0 |
| rear delts | 51 | 5 | 1 | **1** | 0 | 0 |
| biceps | 23 | 24 | 6 | **5** | 0 | 0 |
| triceps | 28 | 21 | 5 | **3** | 1 | 0 |
| calves | 47 | 7 | 4 | **0** | 0 | 0 |
| abs / obliques | 37 | 5 | 4 | **11** | 0 | 1 |

Under the v0 analyst map the 15-20 / above-20 counts were: quads 23 / 9, glutes 9 / 36, hamstrings 25 / 5, chest 3 / 5, back 9 / 2, front delts 3 / 0, side delts 5 / 0, rear delts 1 / 0, biceps 5 / 3, triceps 5 / 3. Main movers (quads, hamstrings, chest, back) do not move; glutes, delts and arms drop because most of their sets in the templates are helper sets. Under the v1 coach count (hinges 0.5) the glute row was 7 / 39 / 11 / **1** / 0 / 0; v1.1 (every compound 0.25 and KB swings uncredited, COACH-R2 VOL-05) gives the row above; uncrediting KB swings also moves the hamstring row from 1 / 9 / 18 / **25** / 4 / 1 to the one above.

### 3.4 Weekly sets per bucket (pattern view)

- **BYOP templates (OBSERVED slot counts):** every main pattern appears **2x/week** in the 4-day, bootcamp and athletic templates (the '3 DAY BUILDER' has VPULL, VPUSH, UHD, leg curls and calves once a week). At 2-3 sets per slot that is **4-6 sets per pattern per week** (BKD, BHD, UKD, UHD, HPUSH, VPUSH, HPULL, VPULL), plus 4-6 for each isolation slot. PPL is the exception: horizontal push 6 slots (18 sets at 3) and horizontal pull 4 slots (12). Leg curls are counted as the leg-flexion segment, not as hinge volume (COACH-ANSWER CAT-09).
- **Baseball (OBSERVED):** each lower pattern slot asks for **8 sets/week** (2 exposures × 4 sets) and each upper pattern 4 sets/week. Part of the lower slots is filled with jumps or hamstring curls, so resistance sets per lower pattern are 4-9.
- **Athletic buckets (BYOP template):** plyo 6 slots, throws 4, COD 4, triple extension 4 per week → 12 / 8 / 8 / 8 sets at 2 sets/slot. None of these count toward muscles (COACH-ANSWER VOL-10).

### 3.5 What the numbers mean (INFERRED, read against the coach's answers)

1. **The coach's 15-20 is a lower-body reality and an upper-body aspiration.** Quads reach 15-20 in 23 of 58 views and pass 20 in 9 (UL/PPL 'INTERMEDIATE', AESTHETICS-12 weeks 6 and 12, boxer weeks 3-8); hamstrings reach 15-20 in 26 views (after KB swings lost their hamstring credit, COACH-R2 VOL-05). Chest is in 15-20 or above in only 8 of 58 views. The generator now starts an intermediate at 15 for every big muscle (COACH-ANSWER VOL-01; 12 §3.3), so upper-body volume in the generated plans will sit above most of his written templates.
2. **Glutes are mostly helper credit.** Counted his way (every compound 0.25, COACH-R2 VOL-05), glutes never reach 15 in any of the 58 views (maximum 10.75; median 6 in hypertrophy programs; v1's hinge 0.5 gave a median of 9), because the templates train glutes through squats, lunges and hinges, not through hip-thrust-type work. A client with a glute goal, and in practice every physique plan, needs direct glute exercises or Focus slots (12 §5.1 and §5.2 carry two glute exercises on one hip day).
3. **The upper body reaches 15-20 only through specialisation**: the 6-day push/pull/legs splits and the 12-week aesthetics track. In the 4-day templates the coach's lever is the 'Focus 1'/'Focus 2' slots (+12 to +18 sets/week available on optional days; both may hit the same muscle, COACH-ANSWER ORD-11).
4. **Athletes run low upper-body volume by design** (chest median 4). This matches his rule that field athletes "don't need to get bigger and stronger that much" (COACH-ANSWER UNI-02). One observed case goes further than his rule: the boxer's chest drops to 0 in weeks 3-8, but he now says to bring pressing and arm volume "down, down, down ... but not completely cut it out" (COACH-ANSWER ATH-04).
5. **Small and "forgotten" muscles get almost nothing directly**: rear delts under 6 sets in 51 of 58 views (direct work only in the push/pull/legs tabs, 'Reverse Flies' / 'DB Reverse Flies or Machine', and AESTHETICS-12 'face pulls' / 'machine or db Reverse flies'), calves median 3 (0 in fat burn, strength, CrossFit and every 4-track), abs 0 outside athletic programs and optional days. **The coach: "They don't, but they should ... It wasn't intentional. I just usually didn't put it in there because I usually just didn't show it to the athletes"** (COACH-ANSWER VOL-17). v1 rule: calves 3 sets every leg day, rear delts their own sets every week, about 2 core exercises per session (section 9.3).
6. **Chest low, side delts high in UL and fat burn** (UL chest 6-8 vs side delts 13.5-14 coach count) was not intended; the generator balances to the start table, and a V-taper bias is an optional per-client choice (COACH-ANSWER VOL-18; section 9.4).

### 3.6 Against the science (SCIENCE)

- **Dose-response.** Schoenfeld, Ogborn and Krieger (2017; 15 studies) found 10+ weekly sets per muscle beat 5-9, which beat <5. Baz-Valle et al. (2022) proposed **12-20 weekly sets** as the standard recommendation for trained men, with no extra benefit above 20 for quads and biceps (triceps an exception). Schoenfeld et al. (2019) showed 1 vs 3 vs 5 sets per exercise (6-9 / 18-27 / 30-45 weekly sets) gave more hypertrophy with more volume but similar strength. Pelland et al. (2026) confirmed a positive dose-response with diminishing returns, stronger diminishing returns for strength. The full research comparison with his numbers (Pelland efficiency tiers, Aube, Barbalho, the chart he asked for) is in 12 §2.1-2.2.
  - **Fit:** his intermediate 15-20 sits inside the 12-20 consensus band and his "20-25 = growth" sits in Pelland's lower-efficiency tier (more growth at a higher cost per set) (12 §2.2). His written templates put quads and hamstrings at 12-22 and most upper-body muscles at 6-12, i.e. at or below the 10-set threshold he now sets as the floor (COACH-R2 VOL-06) unless Focus slots are used.
  - **"Most people train 20-30" (COACH-R2 VOL-06), checked in 12 §2.11:** it fits trained, hypertrophy-focused lifters near the top of a block when indirect work is counted (RP MRV 16-26 for most muscles; Pelland's 19-29 "lower efficiency" tier); surveys report about 16 direct sets per muscle per session with most bodybuilders training each muscle once a week (Hackett 2013) and 8-17 direct sets per week in natural elite bodybuilders (Baz-Valle 2026); his own written templates (3.1-3.3) sit lower still. Above 30 the evidence is thin, which matches his "very advanced person" / Pro level.
- **RP volume landmarks (current RP Strength muscle guides, intermediate lifters, direct sets/week).** Volume landmarks: MV = maintenance volume, MEV = minimum effective volume, MAV = maximum adaptive volume, MRV = maximum recoverable volume; "*P" = when the muscle is the primary priority and other training is reduced (RP's definition).

| Muscle | MV | MEV | MAV | MRV | MAV*P | MRV*P | RP frequency |
|---|---|---|---|---|---|---|---|
| Chest | 2-4 | 4-6 | 6-16 | 16-24 | 16-24 | 24-32+ | 2-4x |
| Quads | 2-4 | 4-6 | 6-14 | 14-18 | 10-18 | 18-24+ | 2-5x |
| Hamstrings | 0-2 | 2-4 | 2-8 | 8-14 | 8-14 | 14-20 | 2-3x |
| Glutes | 2-6 | 6-8 | 8-24 | 24-30 | 24-30 | 30-40+ | 2-5x |
| Back (text, not chart) | ~6 | ~10 | 4-12 per session | ~20 (2x/wk) to ~25 (3x/wk) | - | - | 2-4x |
| Biceps | 6-8 | 8-10 | 14-20 | 20-26 | 20-26 | 26-35 | 3-6x |
| Triceps | 0-4 | 4-6 | 6-16 | 16-20 | 16-20 | 20-26+ | 2-4x |
| Front delts | 0-2 | 0-2 | 4-8 | 8-12 | 12-16 | 16-20+ | 2-3x |
| Side delts (older RP figures via a secondary summary) | 6 | 8 | 16-22 | 26+ | - | - | 2-6x |
| Rear delts | 0-4 | 0-4 | 4-12 | 12-20 | 24-30 | 30-40+ | 3-6x |
| Calves | 2-4 | 4-6 | 6-16 | 16-24 | 16-24 | 24-32+ | 3-6x |
| Abs | 0-4 | 0-4 | 4-12 | 12-20 | 16-24 | 24-32+ | 3-6x |

  - **Fit and tension.** RP counts **direct** sets. Quads and hamstrings are almost all direct sets under the coach count, so the high-volume views pass RP's direct quad MRV (14-18) and hamstring MRV (8-14): UL/PPL 'INTERMEDIATE' quads 22, AESTHETICS-12 week 12 quads 33, boxer week 8 hamstrings 22 (28 before KB swings lost their credit, COACH-R2 VOL-05). These sit at or above his own 20-25 growth band and priority cap, so they are peak-week values, not starting values.
  - **Glutes (v0 tension retired).** v0 reported glutes at 26-35 in peak weeks, above RP's glute MRV (24-30). That came from the v0 analyst map (glutes 1.0 from every hinge and unilateral knee set). Under the coach count no view reaches 15 (maximum 10.75 in v1.1), so the over-MRV concern does not apply; the open issue is the opposite (glutes under-served unless they get direct work, section 3.5 point 2).
  - **Front delts:** RP says most people need no direct front-delt work because pressing covers it. The coach agrees in practice (no front-delt slot; 'ABdution' menu front raises are rare) and does not place front delts in his big or small class (COACH-ANSWER CAT-02); they are a floor muscle in the engine (12 §3.3).
  - **Rear delts:** at 1-2 coach-count sets in most templates they are below RP's MAV (4-12); the 6-day push/pull/legs tabs (7-10) and AESTHETICS-12 weeks 1 and 12 (7.5 and 15) reach it. v1 gives rear delts their own sets every week (COACH-ANSWER VOL-17; 4 / 6 / 8 by level, COACH-R2 VOL-04); v1.2: rear delts are part of the shoulders group with no floor of their own - the 4 / 6 / 8 is retired as a number, a rear-delt exercise stays in every week and users can add more (COACH-R3 VOL-01).

---

## 4. Rep ranges (question 4)

**Coach rule (v1).** Small muscles 12-30 reps (20s, 'MAX', MYO sets), big muscles 5-15 "mixed" (COACH-ANSWER VOL-11, RIGHT); no 40-rep sets except an optional CrossFit/AMRAP style (VOL-11); preference moves the reps of big compound lifts only (VOL-12); unilateral lifts moderate-high by default, heavy low reps optional (UNI-04); VOL 1 / 2 / 3 rep phases for all athletes (PER-11); the same rep rules at every level (PRG-06). The generator matrix is section 9.9. Sections 4.1-4.4 below are the evidence from the sheets.

### 4.1 The coach's own statements and menus (OBSERVED)

- Coach (request text): "smaller muscles are going to take a lot more reps because you can't really go that heavy, and bigger muscles are going to take more of a mix. Essentially, everybody tries to pick whatever is best for them between 5 and 30 reps."
- BYOP SETS menu (`AV8:AV16`): 1, 2, 3, 4, 5, 6, 7, 8, 'SUPERSET W/ 👇'.
- BYOP REPS menu (`'MASTER EXERCISE LIBRARY'!AW8:AW14`): '4 to 6 Reps', '6 to 8 Reps', '8 to 12 Reps', '10 to 15 Reps', '15 Reps', '20 Reps', 'MYO SET'. No 1-3, no 25-30, no per-side, no time, no distance.
- 'MYO SET' (MM 'ALL ABOUT SQUATS' A30): 15 reps, ~3 s pause, 5 reps, repeat 5 x 5 -> **40 reps**, labelled '**MYO SET - ADVANCED' and prescribed 3 x '15/5/5/5/5/5'. Also '2 sets LEG PRESS MYO - 15-5-5-5-5-5' (4 TRACKS W61).
- BASEBALL legend (rows 19-22; header A19 'RESISTANCE PATTERNS', column headers B19 'COMPOUND' and C19 'SMALLER ISOLATIONS'; E19 'ATHLETIC PATTERNS' heads the speed zones): 'VOL 1' '12-15 Reps' / '10-12 Reps'; 'VOL 2' '8-12 Reps' / '15 REPS'; 'VOL 3' '6-8 Reps' / 'MAX REPS'. As compound reps fall, 'SMALLER ISOLATIONS' reps rise. Note the coach's own column name combines both ideas (small muscle + single joint).
- 'ALL ABOUT SQUATS' menus (exercise cell 'Whatever Squat', rows 23-26 'Whatever + Max air squats', row 27 '**MYO SET - ADVANCED'): hypertrophy 3x15, 3x12, 3x10, 3x8, 4x15, 4x12, 4x10, 4x8, then 4x15/4x12/4x10/5x8 + 'Max air squats', then 3 x MYO; strength 5x3, 6x3, 5x4, 6x4, 7x3, 6x4, 8x2, 7x2, 4x4, 4x5, 5x5, 6x4; athletic ('ATHLETIC FOCUSED WORKOUTS', G13) 'OFF SEASON' 'FRENCH CONTRAST' sets '3-4' (cell stored as date 2022-03-04) x '3/3/3/3/3': '78% of 1RM whatever squat immediately into tuck jumps, immediately into Goblet squats, immediately into reverse banded squat jumps'. Rule A5: "****Modify sets/reps as you want, just don't go too far into changing it, you may ruin the stimulus". Banded/chained loads: 'BOTTOM BANDED' 'Weight should be lower ranges around 50% so you can move fast'; 'REVERSE BANDED' 'Weight should be lower ranges and fast speed'; 'BOTTOM CHAINS' 'Weght can be moderate around 70%'. **Out of scope for the generator:** the coach does not program bands and wants no variable resistance (bands, chains, weight releasers) for now (COACH-ANSWER EQ-01, EQ-12), so the banded/chained rows and the 'reverse banded squat jumps' are kept here as evidence only; the French contrast uses an unbanded jump in its place (PROPOSED).
- Notation (COACH-ANSWER PRG-07): '12/10/8 -20' on curls = 12 reps at mid weight, 10 heavier, 8 heaviest, then a light 20-rep set; '10/10' = 10 per arm (a bilateral 10/10 written on purpose would be two sets of 10).

### 4.2 Observed rep distributions (set-weighted)

**BYOP filled cells (AESTHETICS + 'JUSTICE LEAGUE'):** compounds 3 x '15 Reps' (leg press, pulldown, DB deadlift, push-ups) or 3 x '8 to 12 Reps' (barbell row, reverse lunge); explosive compound 'DB Push press' 5 x '6 to 8 Reps'; isolation 2 x '20 Reps' (EZ curls, leg extensions); calves 3 x '15 Reps'; athletic and front squat 2 x '6 to 8 Reps'; throws, rows, lunges, pull-ups 2 x '8 to 12 Reps'; leg extensions 2 x 'MYO SET'. Set-weighted mean: compounds ~12 reps/set, isolation + calves ~18.

**MM gym splits (decode bins):**

| Program / level | Big compounds | Small/isolation |
|---|---|---|
| UL NOVICE | 6-8: 45 %, 9-12: 55 % (mean 10.2) | 16-20: 72 %, AMRAP: 28 % (mean 20) |
| UL NEWBY | 9-12: 100 % (mean 10.25) | 16-20: 71 %, AMRAP 29 % |
| UL INTERMEDIATE | 6-8: 50 %, 9-12: 50 % (mean 10.0) | 16-20: 71 %, AMRAP 29 % |
| PPL NOVICE | 6-8: 48 %, 13-15: 52 % (mean 11.7) | 13-15: 38 %, 16-20: 54 % (mean 18.0) |
| PPL NEWBY | 9-12: 100 % (mean 10.0) | 6-8 14 %, 9-12 21 %, 16-20 54 % (mean 15.7) |
| PPL INTERMEDIATE | 6-8: 75 %, 9-12: 14 %, AMRAP 11 % (mean 8.6) | 6-8 40 %, 16-20 50 % (mean 14.7) |
| FAT BURN WK1 -> WK4 | mean 11.0 -> 8.9 (6-8 share 27 % -> 70 %) | mean 19.0 -> 35.0 (31-40 reps 75 % in WK4) |

**MM athletic, boxing and baseball (computed from item rows, set-weighted; `03_volume_rules.json` -> `observed.rep_distributions`):**

| Class | Baseball (24 wks) | Athletic STARTING | ' MID' | ' ADVANCED' | Boxer wk1-2 | Boxer wk3-8 |
|---|---|---|---|---|---|---|
| Big compound (RP_*) | 9-12: 55 %, 6-8: 26 %, AMRAP 8 %, 1-5: 2 %; median 10; 4.05 sets/line | median 12 (9-12 48 %, 6-8 31 %, 1-5 10 %) | median 8 (6-8 61 %) | median 6 (6-8 79 %, 1-5 21 %) | 10 (100 %) | median 6 (6-8 50 %, 1-5 29 %) |
| Big-muscle isolation (leg ext/curl, flies) | 16-20: 55 %, time 31 %; median 20 | median 16 | 8 | 20 | 10 | 6 and 20 in the same week |
| Small-muscle isolation (arms, delts) | 9-12: 36 %, **AMRAP 34 %**, 13-15: 15 %, MYO 4 %; median 11 | 8 | 12 | 12 | 10-15 | 20 |
| Calves | **AMRAP 58 %**, 9-12: 27 %, 16-20: 12 % | - | - | 8 | - | 3 (deficit, unclear) |
| Core | time/accumulate 51 %, 9-12: 29 % | time 65 % | median 20 | median 20 | 15 | 10 |
| Plyo (contacts per set) | median 10 (1-5: 23 %, 9-12: 47 %) | 8 | 8 (squirrel 40) | 20 | - | 5 (complexes) |
| Throws | median 10 per set | 10 | 10 | 10 | 10 | 10 |
| Triple extension / Olympic | median 6 (6-8: 79 %) | 8 | 7 | 3 | - | 10 |

### 4.3 What the coach actually does (INFERRED rules, with his answers)

0. **His answer settles the framing.** He confirmed the size framing "small muscles 12-30 (20s, MAX, myo sets); big muscles 5-15 mixed" (COACH-ANSWER VOL-11). The single-joint observation below fits inside it: big-muscle isolation at 15-20 is part of the "mix".
1. **Single-joint = higher reps.** Isolation (including big-muscle isolation such as leg extensions and leg curls) sits at 15-20, 'MAX REPS' or 'MYO SET'. Compounds sit at 8-15. That is a stronger pattern than "small muscle = high reps": PPL 'INTERMEDIATE' gives side raises, reverse flies and upright rows 4 x 8 (side raises are already 4 x 8 at 'NEWBY'), and the athletic tabs give curls 12. The coach's own baseball label is 'SMALLER ISOLATIONS', so his category is small-muscle single-joint work; big-muscle isolation (leg extensions, leg curls) follows the same high-rep rule in practice.
2. **Compounds mostly move down with level; isolation stays fixed or moves up.** OBSERVED per tab: PPL push/pull compounds 15 -> 10 -> 8 (rows '15/15' -> '10/10' -> '8/8'); UL lower compounds 12 -> 10 -> 8; but PPL legs go 8 -> 10 -> 8 and UL upper pressing/pulling goes **up** 8 -> 10 -> 12 (a fill error per COACH-ANSWER PRG-06; the generator uses one rep rule at every level), so the UL set-weighted compound mean is flat (10.2 / 10.25 / 10.0) while PPL falls (11.7 / 10.0 / 8.6). Arm isolation stays 3 x 20 at every level (UL curls are 3 x 'MAX REPS' at every level). FAT BURN compounds 11.0 -> 8.9 mean over 4 weeks while isolation goes 19 -> 35. BASEBALL legend VOL 1 -> 3 does the same (compound 12-15 -> 6-8, isolation 10-12 -> MAX).
3. **Big muscles get "a mix"** (the coach's words): heavy bilateral 6-8 (or 4-6/1-5 in strength), secondary 8-12, machine and unilateral 12-15, isolation 20.
4. **Role decides reps on athletic days**: high-intent items (plyo, COD, power clean, main squat) '6 to 8 Reps'; secondary/unilateral/upper '8 to 12 Reps'; finisher MYO ('JUSTICE LEAGUE').
5. **The 5-30 envelope** holds for most work. Outside it: strength singles/doubles (1-3) in strength and pre-season blocks, 40-50-rep core lines, MYO sets (40), and the fat-burn isolation sets of 40. The coach on the 40s: "I'm not really a big fan of 40 reps ... it's not necessarily more fat-burning ... it's optional", e.g. inside an AMRAP (COACH-ANSWER VOL-11), so the generator never uses them by default.
6. **Preference styles appear as two tracks.** "More sets of squats with less weight" = the hypertrophy menu (3-5 x 8-15, 1-2 min rest). "Powerlifting style, heavier, fewer reps" = the strength menu (4-8 x 2-5, 3-6 min rest) and the conjugate tracks ('the work' 5,4,3,2,1 at '1RIR'). The coach confirmed that preference moves only the rep range of the big compound lifts, with weekly sets similar and small muscles still high-rep (COACH-ANSWER VOL-12).
7. **Unilateral reps** (OBSERVED: bilateral 4-15 reps, e.g. 12/10/8/8; unilateral 8/8 to 12/12): moderate-high by default; "sometimes they use heavy low reps ... That might be something that can be optional" (COACH-ANSWER UNI-04).

### 4.4 Against the science (SCIENCE)

- **Wide loading range works for hypertrophy.** Schoenfeld, Grgic, Van Every and Plotkin (Sports, 2021) propose that similar hypertrophy happens from about **5 to 30+ reps** when sets are equated and taken close to failure. RP's muscle guides give the same window ("weights in the 30%-85% 1RM range ... between 5 and 30 reps") and split weekly sets about **25 % heavy (5-10), 50 % moderate (10-20), 25 % light (20-30)**. The coach's "everybody picks between 5 and 30 reps" matches both almost word for word.
- **Muscle-specific notes from RP that support the coach's small-muscle rule:** rear delts respond poorly at 5-10 and "very productive" at 20-30; hamstring hinges 5-10 but leg curls 10-30; chest flies 10-20. There is no strong evidence that small muscles *need* high reps; the practical reasons are joint stress, load increments and technique, which is close to the coach's "you can't really go that heavy".
- **Strength needs heavier loads.** Strength gains are greater with heavier loads (same 2021 review). The coach's strength menu (2-5 reps) and conjugate ladders are consistent.
- **Prilepin's chart (a reference point, not the coach's model).**

| % 1RM | Reps per set | Optimal total | Range |
|---|---|---|---|
| 55-65 | 3-6 | 24 | 18-30 |
| 70-80 | 3-6 | 18 | 12-24 |
| 80-90 | 2-4 | 15 | 10-20 |
| 90+ | 1-2 | 7 | 4-10 |

  - **Tension 1 (baseball optional Olympic piece, 'OPTIONAL PIECE' 'OLY', hang cleans and hang snatches on alternate days):** 'Hang cleans @ 75%' 4 x 8 = 32 reps (Prilepin 70-80 %: 3-6 per set, 12-24 total), '@ 80%' 4 x 6 = 24 (exactly the top edge of the 70-80 % row, above the 80-90 % row), '@ 85%' 4 x 6 = 24 (80-90 %: 2-4 per set, 10-20 total), '@ 90%' 4 x 4 = 16 (90+ %: 1-2 per set, 4-10 total). Every prescription except @80 % (read as the 70-80 % row) exceeds Prilepin's range, and the reps per set are about 1.3-2x the top of Prilepin's reps-per-set range (8 vs 6, 6 vs 4, 4 vs 2). Either the % is of a different max (for example a training max well below true 1RM) or the volume is intentionally high. The coach confirmed the template itself ("That's right. That's essentially it. I just want to make sure it's correct", COACH-ANSWER PER-09) but not the max it is taken from; still open (section 10, tension 3).
  - **Tension 2 (STRENGTH-12):** 6 x 3 at 90 % (18 reps) in weeks 5-6 and 7 x 2 in weeks 11-12 at RPE 9-10 sit far above Prilepin's 4-10 total reps at 90+ %. Wave 1 weeks 1-4 (4 x 5 at 80 % = 20; 5 x 4 at 85 % = 20) fit the 70-80 % and the top of the 80-90 % rows.
  - **Tension 3 ('ALL ABOUT SQUATS' strength menu at '(1 RIR)'):** 1 RIR on sets of 2-5 implies roughly 3RM-6RM loads (about 85-93 % 1RM by common rep-max tables; a set of 3 at 1 RIR is a 4RM, about 88-92 %). The menu totals are 14-25 reps (7x2 = 14 ... 5x5 = 25). The 2-3-rep schemes (5x3 = 15, 6x3 = 18, 7x3 = 21, 8x2 = 16, 7x2 = 14) fit inside the 80-90 % row (10-20, optimal 15) except 7x3 = 21, but are far above the 90+ % row (4-10) that a ~90 % load belongs to; the 4-5-rep schemes at ~85-87 % (6x4 = 24, 5x5 = 25) exceed the 80-90 % row. If the 1 RIR applies to the **last** set only, the earlier sets are lighter and the totals are plausible. Still open after the answers (section 11.2).

---

## 5. Effort (RIR/RPE) and rest (question 5)

**Coach rule (v1).** "There's RIR, there are percentages, and there's RPE ... I like RIR in my model, so that's what I'm going to be using. We can also add the explanation of RIR and kind of mix it with RPE" (COACH-ANSWER VOL-13). He confirmed **1-3 RIR at all times, no planned RIR ramp, and MAX / MAX REPS = technical failure only on small-muscle or bodyweight work** (VOL-13, RIGHT). Percentages stay in his strength and Olympic templates (PER-09). Rest: "1 to 2 minutes is usually fine" for hypertrophy, "maybe ... 1 to 3 minutes", strength 3-6 min, athletic as prescribed, supersets rest after the pair (VOL-14). The generator rules and the client-facing RIR/RPE explanation are in section 9.9; 5.1-5.3 are the evidence.

### 5.1 Every effort cue in the sheets (OBSERVED) and its decoded target (INFERRED)

| Cue (verbatim) | Where | Decoded target |
|---|---|---|
| '*Always leave 1 rep in the tank, never work up to failure but get as close as you can ' | MM UL/PPL A4, athletic A3, conjugate A5 | 1 RIR (RPE 9) on working sets |
| '***The lower the reps, the higher the weight... Always go for 1-3 RIR (REPS IN RESERVE) aka RPE 7+' | MM UL/PPL A6, athletic A5 | 1-3 RIR. The coach equates this with "RPE 7+" |
| 'HYPERTROPHY FOCUSED WORKOUTS (1 RIR) *RPE8+' / 'STRENGTH FOCUSED WORKOUTS (1 RIR) RPE 8+' | 'ALL ABOUT SQUATS' A13/D13 | 1 RIR (RPE 9). See tension below |
| '1-2 RIR' on every row | 4 TRACKS AESTHETICS-8 column D | RPE 8-9 |
| Monday/Wednesday ('M.E.', written only in N9/N13) rows 9-12 / 13-16: '1RIR' (main lift), '2RIR', 'MAX', 'ALL'. Thursday rows 17-20: 'EASY' (plyo), '1RIR' ('FAST ...' lift), '2RIR', 'MAX'. Saturday rows 21-23: '1RIR' ('FAST ...' lift), '2RIR', 'MAX' (no 4th row). "D.E." (dynamic effort) for Thu/Sat is the analyst's label: the sheet writes 'FAST ...' in the lift names and N17/N21 'FAST RPE6 or about 60-70%' | 4 TRACKS STRENGTH-8 / conjugate column D. Row labels in column M ('the work', 'the accessory', 'the nuance', 'the survival') are row-aligned, so on Thursday the '1RIR' lift sits on 'the accessory' row and 'MAX' on 'the survival' row | 1 RIR -> 2 RIR -> ~0-1 RIR heaviest for the reps -> to technical failure; plyos submaximal amplitude |
| RPE header 7,7,7,8,8,9,7,8,9,9,9,10 with % 80,80,85,85,90,90 | 4 TRACKS STRENGTH-12 | main lift RPE climbs 7 -> 9, deload 7, wave 2 8 -> 10 |
| 'FAST RPE6 or about 60-70%' | STRENGTH-12 Thu/Sat | speed work ~4 RIR, maximal bar speed |
| 'DEADLIFTS (1RIR)' 3 x 1; 'DEADLIFTS (1-2RIR) + 3 min Jump Rope' | MM athletic ADVANCED, boxer wk3-8 | explicit RIR only on the heaviest hinge |
| 'HEAVY' / 'Heavy' (14 athletic lines), '(MID WEIGHT)', 'light weights - same speed for all reps', 'FAST', 'slow' | MM athletic, boxing, baseball | load words instead of numbers; INFERRED: HEAVY ≈ 1-2 RIR at 3-8 reps, MID ≈ 3 RIR |
| 'MAX REPS', 'MAX', 'max', 'myo set(s)', 'UNBROKEN' | UL/PPL calves and curls, baseball isolation (34 % of small-muscle sets AMRAP/MAX, plus 4 % MYO), core | AMRAP / to technical failure on isolation only |
| '*INSTEAD OF WORKING TO FAILURE, PUSH YOUR LIMITS OVER THE COURSE OF TIME' | MM CrossFit A4 | progressive overload across weeks, not failure in a session |
| EFFORT menu '1 - Way Too Easy' ... '7 - That was tough', '8 - That was perfect', '9 - That was terrible', "10 - I'm done" | BYOP `AX8:AX17` (tracking tabs) | 8 = hit the target; 9 = harder than planned; 10 = "the max I could do, but successful", not a fail (COACH-R2 VOL-02; v0 read 8 as RPE 8 / 2 RIR) |
| HOW IT FELT? 'Felt the RIGHT muscles', 'Felt the WRONG muscle', 'Felt a PAIN', "Couldn't do it" | BYOP `AY8:AY11` | target-tissue and pain screen (section 9.13) |

**Rule visible across programs (INFERRED):** effort rises as exercise complexity and systemic cost fall. Heavy multi-joint lifts stay at 1-2 RIR; isolation and pump work may go to 'MAX'/'ALL'; plyometrics and speed work are never taken near failure.

### 5.2 Rest (OBSERVED)

| Context | Rest written by the coach |
|---|---|
| Hypertrophy squats | '*REST 1-2 MIN BETWEEN SETS' ('ALL ABOUT SQUATS' B28) |
| Strength squats | '*REST 3-6 MIN BETWEEN SETS' (E28) |
| Athletic squat work | '*REST AS PRESCRIBED' (H28) |
| Blue (A) aerobic intervals | rest periods '3 Minutes' ... '8 Minutes' (cheat sheet A36:A41; INFERRED between blocks) |
| Green (B) | '1:1', '1:2', '1:3 Work:Rest' |
| Orange (C) | 'Active', ':30 sec', '1 Minute', '2 Minutes', '3 Minutes' |
| Lactate clearance | '2 - Rest 1 min btwn SETS', '3 - Rest 2 min btwn SETS', '4 - Rest 3 min btwn SETS' |
| Buy-outs | '3x 10 cal bike sprint (2 min rest)'; 'Fast run/ walk back or 3 min walk/rest' (baseball) |
| Everything else (BYOP, UL/PPL, fat burn, 4 tracks) | not written |

### 5.3 Against the science (SCIENCE) and tensions

- **RIR-RPE scale.** On the resistance-training RPE scale (Zourdos et al., 2016), RPE 10 = 0 RIR, RPE 9 = 1 RIR, **RPE 8 = 2 RIR**. So '(1 RIR) *RPE8+' is not a contradiction - 1 RIR is RPE 9, which satisfies "8+" - but the RPE floor is one point looser than the RIR it is paired with; '1-3 RIR aka RPE 7+' is exact as a floor (3 RIR = RPE 7). v0 read the client EFFORT menu's '8 - That was perfect' as RPE 8 = 2 RIR. That reading breaks his own cue: a client who stops at 1 RIR as told ("leave 1 in the tank" = RPE 9) would log '9 - That was terrible', and the feedback loop treats a median of 9 as an overshoot (hold). v1 therefore reads the EFFORT menu **against the set's planned RIR** ('8 - That was perfect' = landed on the target, whether the target was 1, 2 or 3 RIR; section 9.9; tension 24). Round 2 kept that reading for 8 and 9 and defined 10 as "the max I can do, not a fail ... but it was successful" (COACH-R2 VOL-02, PARTLY). v0's INFERRED resolution (1-2 RIR on compounds, 0-1 on isolation last sets) is replaced by the coach's rule: **1-3 RIR on every working set, 0 RIR ('MAX') only on small-muscle or bodyweight last sets; strength main lifts follow his % / RPE template; speed work RPE 6** (COACH-ANSWER VOL-13, PER-09).
- **Proximity to failure.** A dose-response meta-analysis (Robinson et al., 2023 preprint, later published) found hypertrophy improves as sets get closer to failure while strength is largely insensitive. Refalo et al. (2024) found training to failure and stopping 1-2 RIR gave similar growth over 8 weeks, but failure caused more fatigue. The coach's "close but not to failure" for compounds and 'MAX'/'ALL' only on isolation fits this well.
- **"Never to failure" vs 'MAX REPS'.** A4 forbids failure while UL/PPL calves, curls and dips and 34 % of baseball small-muscle isolation sets (58 % of baseball calf sets) are AMRAP/MAX. Resolved by COACH-ANSWER VOL-13: 'MAX' = technical failure on small-muscle or bodyweight work only (last set).
- **Rest.** A Bayesian meta-analysis (Singer et al., 2024; 9 studies) found a small hypertrophy benefit from resting **more than 60 s**, with no further benefit beyond about **90 s**. The coach's 1-2 min hypertrophy rest fits, and his "up to 3 minutes" (COACH-ANSWER VOL-14) covers heavy compounds, where the generator defaults to the top of the 1-2 min range or longer. NSCA plyometric guidance: work:rest 1:5 to 1:10, depth jumps 5-10 s between reps and 2-3 min between sets, 48-72 h between plyometric sessions (Cortland lecture summarising NSCA).

---

## 6. Athletic-pattern dosing vs resistance dosing (question 6)

**Coach rule (v1).** Athletic sets "don't go towards muscles" (COACH-ANSWER VOL-10). The plyo vs ballistic mix is set by how long the sport keeps the athlete on the ground (more ground time → more ballistics; less → more plyos), with his sport ranking for jump volume (ATH-01, ATH-02). Programs start more ballistic and become more plyometric; the plyo method goes receive & pause → receive then create → repeated receive/create, and these are not "zones" (CAT-10, CAT-11). Everyone in athletic training gets Olympic lifts (ATH-10). **Round 2 approved the numbers:** plyo share by sport at the end of a block (sprinters 75 % ... boxing, karate, kickboxing, wrestling, BJJ, golf 25 %), 15 points more ballistic at the start, counted over jump and throw work; the ballistic vs plyometric lists; the name "Receive-Create stages" (1 Land, 2 Land & Go, 3 Repeat) and their timing; Olympic lifts up to 4 × a week, cleans on squat days and snatches on hinge days (COACH-R2 ATH-01..04). The sport dial is section 9.11; the athletic budget engine is 12 §3.13. 6.1-6.5 are the evidence.

### 6.1 Plyometric ground contacts

| Program | High-intensity contacts/wk | Low-amplitude contacts/wk | Total/wk | Per session | Notes (OBSERVED) |
|---|---|---|---|---|---|
| BYOP ATHLETIC template @2 sets (INFERRED from 6 plyo slots x 2 x '6 to 8 Reps') | - | - | 72-96 (108-144 @3) | A day 24-32, B day 12-16 | 2 plyo slots on A days, 1 on B days |
| 'JUSTICE LEAGUE' Monday | - | - | 24-32 that day | - | 'Medium Depth Drop' + 'Ankle Hops ' 2 x '6 to 8 Reps' |
| MM athletic 'STARTING' (3 d) | 146 | 0 | 146 (+210 est. from 'High Knee Runs FAST' 2 x :30) | 48.7 | max-intent jumps 2 x 8, repeat jump squats 3 x 10, lunge jumps, box step-up jumps |
| MM athletic ' MID' (4 d) | 71 | 120 | 191 | 47.8 (17.8 high) | landings 1 x 8 'Drop & Stick - Hold for 3 seconds', squirrel jumps 1 x 40 and 40 & 40 |
| MM athletic ' ADVANCED' (4 d) | 32 | 100 | 132 | 33 (8 high) | single-leg/plate jumps, squirrel 1 x 40 |
| MM boxer wk1-2 | 0 | 0 | 0 | 0 | hypertrophy base |
| MM boxer wk3-8 | 113-129 | 142-177 | 258-306 (+720-1440 jump rope est.) | 64.5-76.5 (28-32 high) | complexes with 5-rep jumps, SL squirrel 20/20 reverse banded |
| MM baseball (training weeks) | - | - | 116-324; block means 199 / 241 / 201 | ~60-160 on the 2 lower-plyo days (INFERRED split) | 'LOWER ballistics/plyo' Tue/Fri, jump variants in 'bkd'/'bhd'/'calfs' slots |
| MM conjugate STRENGTH-8 | 18/wk | - | 18 | 18 on Thursday (the only plyo line of the week) | 'the work' plyo 3 x 6 'EASY' (E17:K17 'WEIGHTED DEPTH DROP', 'DEPTH DROP & JUMP', 'HIGH SQUAT JUMPS', 'REPEAT HIGH JUMPS') |
| MM HYBRID | ~36 (assumed 3 x 6, 2 days) | - | ~36 | 18 | landing -> reactive ladder |
| MM UL/PPL (A-drills, not plyo) | - | UL 72 / 90 / 64 and PPL 48 / 90 / 64 reps per leg per lower day (NOV / NEW / INT; PPL 'NOVICE' is 2 x '8/8', UL 'NOVICE' 2 x '12/12'); about 128-180 per leg per week on the 4-day UL | - | - | primer; unlabelled in UL/PPL. The same drills appear in the aerobic cheat sheet 'RUNNING WARMUP' block (E23) and in baseball BA46 'A Marches / A skips / A runners' |

**Progression levers inside plyos (labels OBSERVED in the ballistics tab + Sheet23 key; reading them as a left-to-right progression is INFERRED):** force phase 'TAKING IN FORCES' -> 'DELIVER FORCES FAST' -> 'AMORTIZATION OF FORCES' (columns A-C under A22 'BALLISTIC PURPOSE - BE EXPLOSIVELY & FAST', '*I USE THESE FOR MUSCULAR FORCE PRODUCTION') -> 'REBOUNDING ' (column D under D22 'PLYOMETRIC PURPOSE - BE REACTIVE & BOUNCY', '*I USE THESE FOR REACTIVE CONNECTIVE TISSUE ADAPTATIONS'); zone 'ZONE 1' 'Receive pause/creat' -> 'ZONE 2' 'Receive/create' -> 'ZONE 3 ' 'Repeat receive create'; bilateral -> unilateral; unloaded -> weighted; drop height low -> medium -> 'High Depth Drop (above hip)'; reverse-banded last. Within the athletic off-season ladder, **high-intensity contacts fall 146 -> 71 -> 32** while low-amplitude reactive contacts rise 0 -> 120 -> 100.

**What the coach said about these labels.** The 'ZONE 1/2/3' plyo labels are "not necessarily a plyo zone ... I just gave it a name ... I don't know what to call it yet" (COACH-ANSWER CAT-11); the zones from Pat Davidson's book are rotation biases of body positions and "don't apply to the plyos" (CAT-10). The plyo labels describe how the jump is done: receive and pause first ("your connective tissue need to learn how to receive forces before we teach it how to create"), then receive then create (stick then jump or hop), then repeated receive/create (hops); unilateral is harder than bilateral (CAT-10). This file calls them RC1 / RC2 / RC3; the name "Receive-Create stages" (1 Land, 2 Land & Go, 3 Repeat) and the week timing are approved (COACH-R2 ATH-03). Reverse-banded and banded variants are out of scope (COACH-ANSWER EQ-01, EQ-12).

### 6.2 Medicine-ball throws

| Program | Throws/wk | Dose rule |
|---|---|---|
| BYOP athletic template | 4 throw slots x 2 x 8-12 = **64-96** | 'Situps to overhead throw' 2 x '8 to 12 Reps' (JL) |
| MM 'MEDBALL CHEAT SHEET' (ballistics A51:D71) | 1 pass = 19 throws, **210 reps** | '1' x '10' each, '1' x '20' for the two sit-up throws; most rotational/step throws are listed as R/L pairs (the side-to-side slams and alternating back-to-wall scoops are single lines), 5 throws are bilateral ('Chest pass', 'Overhead throw', 'Squat to Chest Pass', 2 sit-up throws). Rows 72-89 add 9 'SPECIALTIES' and 7 'CORE EXTRAS' (1 x 10 each) outside the 19-throw pass (the boxer's 19-item list uses 10 on the sit-up throws, = 190) |
| MM athletic STARTING / MID / ADVANCED | **210 / 400 / 420** | Mid = only the 10 rotational/half-kneeling throws at 2 x 10, twice a week |
| MM boxer wk1-2 / wk3-8 | **190 / 380** | 19 x 10 per list |
| MM baseball | **70-290** (block means 178 / 192 / 176) | 'Upper Ballistics/plyo' Mon/Thu, also inside 'Transverse core' |

### 6.3 Sprints, change of direction, Olympic lifts

| Quality | OBSERVED dosing |
|---|---|
| Sprint / acceleration | Baseball buy-outs 1-3 bouts of 10-20 cal bike/row/ski or 15-30 s runs, ~3-4 bouts/week, almost all in 'SPEED POWER' '10-39 Secs' (note DI29: 'Fast run/ walk back or 3 min walk/rest - This is NOT a sprint, this is a fast run'); '30m acceleration sprint' 5; 'accelerations baseball starts'. Boxer 'Sprint 20/ Recover 40' 5,5,6,6,7,8 rounds (100 -> 160 s of work). HYBRID 10/12/15 x 15 s at 1:2, then 10/12/15 x 20 s at 1:2, then 5/10 x 30 s at 1:4 'fastest'. Cheat-sheet blue 10 x '10X10m Sprints'. Warm-up 2 x 10 yd A-drills + 5 x 10 yd 'Falling start accelerations'. UL/PPL A-drills 2-4 sets x 8-12 per leg. |
| Change of direction | BYOP 4 'COD' slots/week; JL 'DIG/OUT' 2 x '6 to 8 Reps' with note 'LATERAL' -> **12-16 cuts/session, 48-64/week** at 2 sets (INFERRED). **Zero** dedicated COD drills in every MM example (athletic, boxing, baseball); the only frontal-plane jumping is baseball 'skater jumps over hurdle' (DT47) and 'skater jumps with MB rotations' (AJ64), which are plyos, not cuts. |
| Olympic / triple extension | BYOP JL 'Power Clean' 2 x '6 to 8 Reps'; MM athletic 'Low Hang Power Cleans (mid weight)' 3 x 8 -> 'Heavy Power Cleans' 2 x 8 -> 'Power Cleans' 3 x 3; boxer 'Clean Pull/ hang Power Clean' 3 x 8, 'Hang Power Clean & Press' 3-6 x 12; baseball optional 4 x 8 @75 % -> 4 x 6 @80 % -> 4 x 6 @85 % -> 4 x 4 @90 % (16 sets/wk, never in-season); CrossFit POWER FULL TIME 3x3 -> 4x3 -> 5x3 -> 6x3, HALF TIME 3x4 -> 3x3 -> 3x2 -> 3x1; HYBRID 2-4 sets x 1-5 'heavy'. |
| Energy-system zones (baseball legend E19:F22) | 'SPEED ENDURANCE' '>40 Secs'; 'SPEED POWER' '10-39 Secs'; 'SPEED STRENGTH & POWER' '0-12 Secs' |

### 6.4 Athletic vs resistance dosing (INFERRED reading)

- **Athletic work is dosed by count and quality, resistance by sets x reps near failure.** Plyos 1-3 sets of 5-10 contacts (squirrel/rebound 20-40), throws 1-2 x 10 per side, Olympic 2-4 x 3-8, cuts 2 x 6-8, sprints by bout duration.
- **The athletic block sits first in the session** in the templates (plyo -> throw -> COD -> triple extension -> strength -> isolation; OBSERVED order). The generator puts about 2 core exercises **before** it by default, movable by the client (COACH-ANSWER ATH-11, NOT RIGHT on "core after the power block"). The athletic block **costs resistance volume**: BYOP athletic resistance sets are 44/week at 2 sets (66 at 3) vs 78 in the aesthetics version of the same skeleton (coach-default convention; 84 at a flat 3). Same-assumption comparison: 66 vs 84 at 3 sets, i.e. 22 resistance slots vs 28.
- **The sport dial is not "fewer contacts" for boxers.** The boxer's weeks 3-8 carry more total contacts (258-306) than the generic athletic example (132-191). What is lower is **high-amplitude bilateral jumping per session** (28-32 vs 48.7) and **bilateral max-height work**; the boxer's volume is low-amplitude, single-leg, stiffness-type bouncing (squirrel jumps, jump rope). INFERRED: "boxers and karate athletes don't need that many plyos" means fewer **rebounding/high-amplitude** contacts, not less elastic work. The coach's answer agrees with this reading: the more time on the ground (karate, fighters), the more ballistics and the fewer plyos, but "some plyos are always good because I need them to have other tissues really strong" (COACH-ANSWER ATH-01).
- **Olympic lifts for everyone in athletic training.** Observed Olympic work is limited to some programs (baseball's is an 'OPTIONAL PIECE', never in-season). The coach: "everyone gets Olympic lifts" - beginners DB/KB snatches, hex-bar jumps, hang pulls and hang cleans; intermediate+ the full lifts (COACH-ANSWER ATH-10).

### 6.5 Against the science (SCIENCE)

- **NSCA contact guidance:** about **80-100 contacts per session (beginner), 100-120 (intermediate), 120-140 (advanced)** (NSCA CSCS chapter 18 as summarised by PT Pioneer; re-checked 2026-10-07); 48-72 h between plyometric sessions; off-season 2-3 sessions/week for football, 3-4 for track; in-season 1 (football) / 2-3 (track) (SUNY Cortland lecture page, which gives the same numbers but cites no source). The coach's sessions (18-77 counted contacts) sit **at or below the beginner range**, even for advanced athletes; only baseball peak days and the boxer's complex days approach it. That is conservative and consistent with his "Bring athletes back to feeling/moving great" note.
- **Meta-analysis of what drives jump gains:** more than 10 weeks, more than 20 sessions and **more than 50 jumps per session** maximised vertical-jump improvement (de Villarreal et al., 2009; 56 studies). The BYOP template at 2 sets (24-32 per A day) is below 50; the MM athletic Starting (48.7) and boxer (64-77) are at or above it.
- **Low volume is often enough.** In youth basketball players (a study in the University of Zaragoza repository), 49 vs 99 jumps per session twice a week for 6 weeks gave similar jump gains, with the low volume more efficient per rep. Combat-sport plyo programs typically ran 2-3 sessions/week for 4-12 weeks and improved jump, strength and COD (Ramirez-Campillo et al., Sports 2023).
- **Should athletic sets count toward the 15-20?** The evidence is mixed: in combat-sport athletes plyometrics did not change muscle mass (Ramirez-Campillo 2023, ES -0.01 to -0.06), but in untrained/recreational people plyometric training produced lower-body hypertrophy similar to resistance training (Grgic, Schoenfeld, Mikulic 2021 review, 6 comparison trials, up to 12 weeks). **Settled by the coach: they do not count** ("I think counting towards muscles is more for resistance patterns, not for athletic patterns. That's important", COACH-ANSWER VOL-10). Their lower-body and tendon cost is handled by the athlete volume factors (12 §3.4) and the separate athletic budget with NSCA contact caps (12 §3.13); v0's 0.5 charge against a lower-body fatigue budget is retired.

---

## 7. Conditioning dosing (question 7)

**Coach rule (v1).** "Both are important. This just needs to be picked accordingly": **3 aerobic sessions/week for general and fat-loss clients, 2 for athletes in season, 4 for aesthetics/bodybuilders, and long walks after their workouts** (COACH-ANSWER ATH-07). The colour work can run on any tool and be tracked by calories, time or distance; "doing the block is the important part" (EQ-14). Fighters' daily opening cardio is a real aerobic block (ORD-09); fat-burn circuits are finishers (PRG-11). **Round 2:** every count is adjustable up or down by the user; the aesthetics 4th session is a second Orange; the walks are extra, 20-30 minutes easy; athletes off-season get 2-4 by sport, pre-season 2, powerlifters 2 easy (COACH-R2 SES-06, ATH-06). Generator rules: section 9.12.

### 7.1 The aerobic colour system (OBSERVED, 'AEROBIC CAPACITY CHEAT SHEET')

Rules (A3:A5, cyan): '*These are only recomendations & samples'; '**Follow Running Warmups'; '***Never do the same color workout in the same week. You should do one of each color (Blue, Green, Orange) every week with a total of 3 Aerobic capacity workouts per week'.

| Letter / colour | Duration | Intensity | Work | Rest |
|---|---|---|---|---|
| 'A' Blue A4C2F4 | 'Short Duration ' | 'High Intensity' | 'Seconds ': '15/45', '20/40', '30/30', '40/20', '45/15 Work:Rest' | '3 Minutes' ... '8 Minutes' |
| 'B' Green B6D7A8 | 'Moderate Duration' | 'Moderate Intensity' | '1 Minute', '2 Minutes', '3 Minutes' | '1:1', '1:2', '1:3 Work:Rest' |
| 'C' Orange F9CB9C | 'Long Duration' | 'Low intensity' | '4+ Minutes' | 'Active', ':30 sec' ... '3 Minutes' |

Level grid (A8:I21; 'BEGGINER WORKOUTS' green, ' INTERMEDIATE WORKOUTS' yellow, ' ADVANCED WORKOUTS' red):

| Colour | Beginner | Intermediate | Advanced |
|---|---|---|---|
| Blue | 10 x '10X10m Sprints' MODERATE; 10 x '15 Sec Run/ 45 Sec Walk' EASY; 10 x '20 Sec Run/ 40 Sec Walk' EASY | 10 x 10 m MODERATE; 10 x '30 Sec Run/ 30 Sec Walk' MODERATE; 10 x '40 Sec Run/ 20 Sec Walk' MODERATE | 10 x 10 m SPRINT; 10 x 15/45 FAST; 10 x 20/40 FAST |
| Green | 5 x '1 Minute run/ 3 Min Walk' FAST; 5 x 2'/4' FAST; 5 x '3 Minute Run/ 3 Min Walk' MODERATE | 7 x 1'/3' MODERATE; 7 x 2'/4' FAST; 5 x 3'/3' FAST | '4-6' x 1'/3' FASTEST; '3-5' x 2'/4' FASTEST; '2-4' x 3'/3' FASTEST |
| Orange | 4 x '5 Minute Run/ :30 Sec Walk', 3 x '8 Minute Run/ 1 Minute Walk', 2 x '11 Minute Run/ 2 Min Walk' EASY; 1 / 2 / 3 mile EASY | 6 x 5'/:30, 4 x 8'/1', 3 x 11'/2' MODERATE; 1 mile FAST, 3 mile MODERATE, 5 mile EASY | 4 x 5'/:30, 3 x 8'/1', 2 x 11'/2' FASTEST; 1 / 3 / 5+ mile FASTEST |

Level unlock (MM 'EXAMPLE CROSSFIT SPLIT' D21:D24, repeated T21:T24): 'LVL 1 = C', 'LVL 2 = C, B', 'LVL 3 = C,B, A', 'LVL 4 = LACTATE CLERANCE'; the CrossFit monthly grids schedule **2, 2, 3, 4** aerobic sessions/week ('YES' cells) for levels 1-4. Back in the cheat sheet: lactate clearance, 16 surge-and-float formats (G26:I41), e.g. '1 min MODERATE/20 Sec FASTEST/ 2 Min EASY' x '4 (NO REST)'. Running warm-up (cheat sheet 'RUNNING WARMUP', D26:F32): 2 x 10 yd 'A March', 'A Skip', 'A Runs', 'Bilateral forward hops', 'Bilateral backward hops', 2 x '10/10' 'Single leg in place hops', 5 x 10 yd 'Falling start accelerations'.

### 7.2 What programs actually schedule (OBSERVED)

| Program | Conditioning |
|---|---|
| UL / PPL / athletic MM | "**Do steady cardio whenever you want, just don't over do it... I reccomend doing it WEDNESDAYS & SATURDAYS max 40 min of steady" (UL/PPL A5, athletic A4). UL/PPL only: 'Any Cardio Equipment' 1 x '5 Minutes' warm-up each session (6 cells in UL, 9 in PPL; none in the athletic tab) |
| BYOP athletic / aesthetics / bootcamp 1 | 2 'Aerobic Capacity'/'Cardio' slots per week (Wed/Sat in athletic and bootcamp 1; the two 'Optional' blocks in aesthetics), no rep dropdown, dose in the item (library column B, e.g. '3 min Fast - 2 min walk', '1 mile run - 1 min walk', distance tests up to '21.6 mile run', which the coach calls "a marathon, don't know when/where we need that" (COACH-ANSWER LIB-18; a marathon is 26.2 miles) - **removed from plans and tests** (COACH-R2 LIB-06)). The library also lists '400m' (B125) and '20 cals' (B135), but those rows sit outside the slot dropdown range B7:B122, so a client cannot pick them |
| BYOP '3 DAY BUILDER' | 3 'Cardio' slots per week, one in each 'Optional' block (B9, B19, B29) |
| BYOP push/pull/legs | no cardio slot |
| BYOP bootcamp 2 | 'Cardio' in every session (6/week) |
| FAT BURN | '30-40 mi slow/steady CARDIO' Wed + Sat (60-80 min/week) + circuits 3 x 30 s -> 4 x 35 s -> 4 x 40 s -> 5 x 50 s (12.0 -> 33.3 min of work/week, x2.78 in 4 weeks) |
| AESTHETICS-8 | '30-40 mi slow/steady CARDIO' Wed + Sat |
| Boxer | wk1-2 '20 sec fast/ 40 sec slow (cardio of choice)' + 'Easy cardio of choice (steady pace)' '20 min'; wk3-8 'Cardio of any choice' '20-40 min' + 'Sprint 20/ Recover 40' 5 -> 8 rounds |
| Baseball | buy-outs only (SPEED POWER), recovery week 'Paced Cardio - easy' 4 x '10 min'; no aerobic base in-season or pre-season |
| HYBRID | Tue 'SPEED' sprints (A) + Fri 'DISTANCE' '15-40 min constant cardo easy' (C) |
| CrossFit competitor | 2-4 aerobic sessions/week by level + WODs 'LVL 1 = 1 a week', 'LVL 2 = 2 wods a week', 'LVL 3 = 3 wods a week', 'LVL 4 = wods a week' (no number written for level 4) |
| Half marathon (Sheet24, 'HALF MARATHON PROGRAM by CHRIS HINSHAW ') | 2 training days/week for 21 weeks; the longer day grows 3 -> 12 miles, cut-back weeks 3, 6, 8, 12, 18, week 21 taper + race. In 7 weeks (2, 5, 7, 10, 14, 17, 20) the long day is split a.m./p.m. (e.g. week 20 '12 miles (7 miles a.m. + 5 miles p.m.)'), so the longest single continuous run is 11 miles (week 19) |

### 7.3 Against the science (SCIENCE) and tensions

- **Intensity distribution.** Elite endurance athletes do roughly 80 % of sessions at low intensity and 20 % hard (Seiler's polarised model). One blue + one green + one orange per week is 33 % low by session count, i.e. **not** polarised; but for strength and team-sport athletes, where conditioning is a minority of training, a 1:1:1 rotation that caps high-intensity work at 1-2 sessions/week is a reasonable concurrent-training choice.
- **Interference.** The interference of endurance work with strength, power and hypertrophy grows with endurance **frequency and duration** (Wilson et al., 2012; 21 studies). The coach's 'max 40 min of steady' and placement on non-lifting days fit that evidence.
- **Tension: 2 vs 3 sessions.** The cheat sheet asks for 3 per week; most templates have 2 slots (exceptions: the '3 DAY BUILDER' with 3, bootcamp 2 with 6 'Cardio' lines, CrossFit grids with 2-4 by level). **Resolved by the coach** (COACH-ANSWER ATH-07): 3 general/fat loss, 2 athletes in season, 4 aesthetics/bodybuilders + long walks. v0's level-based proposal (2 for L1-L2, 3 for L3+) is retired. Round 2: the 4th aesthetics session is a second Orange and the counts are adjustable (COACH-R2 SES-06). Still open: whether the level unlock ('LVL 1 = C') holds when a beginner needs 3 sessions (section 11).

---

## 8. Progression as observed (evidence for rule 9.6)

**Coach rule (v1.1).** Every plan is a stairway: small weekly steps early, slightly bigger after the halfway week, the hardest weeks last (COACH-R2 PER-03, PER-04); % of weekly sets per muscle (VOL-04); *retired in v1.3: "never above 7 % planned and below +10 % total" (COACH-CX CX-01; COACH-R4 R4-PRG-02: the planned final sets are reached, no hard limit, a note above about 15 %)*; whole sets from a bank, first exercise first (VOL-06, VOL-07); computed once, no check-in (COACH-R3 VOL-02, VOL-04); smooth weekly adds for hypertrophy and general clients, steps and waves for fight or competition prep (PER-10). The table below is how his sheets actually progress.

| Program | Lever | Weekly-equivalent rate (computed in decodes) |
|---|---|---|
| CrossFit FULL TIME strength | +1 set per level (3 x 7 -> 4 x 6 -> 5 x 5 -> 6 x 4) | about +26 %/level; = **+5.5 %/week** only if one level per month (INFERRED; the macro row actually runs STRENGTH levels APR 1, JUNE 3, JULY 4, OCT 2, NOV 2, so levels jump and fall) |
| CrossFit HALF TIME / class | sets fixed at 3, reps 7 -> 4 then 1RM | intensification only (reps -14 to -20 % per step) |
| STRENGTH-12 'the work' | sets 4,4,5,5,6,6 / 3 (deload) / 5,6,6,7,7; reps 5 -> 2; % 80 -> 90, +5 % every 2 weeks | **+5.2 %/week** sets; session totals +6.7 to +7.7 % per step |
| AESTHETICS-12 | sets/exercise 3,3,3,4,4,4,3,4,4,4,4,5 | **+4.75 %/week** |
| AESTHETICS-8 | sets 2,3,3,3,4,4,5; reps 12,10,8 wave | +16.5 %/week (from a 2-set start) |
| HYBRID | sets 2,2,2,3,3,3,4,4 (D71); reps 6,8,10,6,8,10,6,8 (D72); 'AMRAP' row D70 12,15,16,17,18,19,20,20 (a density/time lever; what it applies to is not written - the decode reads it as minutes for the Saturday circuit, INFERRED) | +10.4 %/week sets, +15 %/week reps; AMRAP +25 % in week 2, then +1 per week to 20 (12 -> 20 = +7.6 %/week compounded over wk1-wk8) |
| Conjugate / STRENGTH-8 | sets flat or falling (green ladder 5,5,4,4,3,3,2,1) | volume traded for intensity |
| Baseball block 2 (pre-season) | Part C/D 4 -> 5 sets | resistance 76, 74, 75, 76, 78, 81, 84: last steps **+2.6, +3.8, +3.7 %**, then deload -31 % |
| Baseball block 3 (in-season) | sets locked at 4, reps 10 | flat |
| FAT BURN (4 weeks) | compounds +sets, -reps; isolation +reps (leg ext/curl 4 x 15 -> 3 x 20 -> 2 x 40 -> 3 x 40; arm isolation 2 x 30 -> 2 x 30 -> 3 x 30 -> 3 x 40; side raises 3 x 15 -> 4 x 15 -> 3 x 20 -> 4 x 20) | sets 60, 60, 64, 70 (**0, +6.7, +9.4 %**); reps 781, 822, 924, 1040 (+5.2, +12.4, +12.6 %) |
| Boxer | 2-week steps + wave | 0, +41 % (phase change), 0, +3.5, 0, -11 (mini-deload), +31 % (peak) |
| UL/PPL levels | NOV -> NEWBY -> INT | resistance sets +18-23 %, then +13-14 % per level |
| Athletic off-season levels | STARTING -> MID -> ADVANCED | working sets excl. throws -19 %, -18 % (89 -> 72 -> 59); incl. throw sets +4 %, -13 % (108 -> 112 -> 97); intensity and specificity up |
| Squat hypertrophy menu | 3 runs of 15/12/10/8 reps (rows 15-18, 19-22, 23-26); 3 -> 4 -> 4-5 sets | +33 % sets between the first two runs, +25 % on the last row only. The sheet has no week labels; reading each row as one week (3 x 4-week waves) is INFERRED |

**Summary (INFERRED).** The coach never writes "+5 %". He adds **whole sets to individual slots every 2-3 weeks** and waves reps, so his week-over-week changes are step-shaped: 0 % for 1-2 weeks, then +20 to +50 % in one step. Averaged over a block, the 12-week products and the CrossFit levels land at **+4.75 to +5.5 % per week**, inside his stated 3-7 %; the 8-week AESTHETICS (+16.5 %/week from 2 sets) and 8-week HYBRID (+10.4 %/week) ramp 2-3x faster, above his stated range. Athletic blocks progress by **phase change and quality** (exercise level, contrast, peak) more than by % volume. In-season is flat. AESTHETICS-8, STRENGTH-8, STRENGTH-12, AESTHETICS-12 and the CrossFit class block have a scheduled deload or test; the 8-week HYBRID (week 8 = 4 sets, 'AMRAP' 20, '2x 1 heavy squat clean') and the 8-week boxer build-up (mini-deload in week 7, peak in week 8) end at the peak with nothing written after it.

**Against his answers.** The 12-week products' block averages (+4.75 to +5.5 %/week) sit inside his 3-7 %; the step shape of his sheets (flat, then +20 to +50 %) and the two 8-week products (+10.4 and +16.5 %/week) exceed his own "10 % is way too much" (COACH-ANSWER UNI-05). The generator follows his stated rule; his step/wave pattern survives only for fight or competition prep (COACH-ANSWER PER-10). His sheets' "flat for 1-2 weeks, then a jump" shape is also the opposite of the round-2 stairway (small, steady steps; COACH-R2 PER-03). The observed level jumps (UL/PPL +13-23 % per level) are between levels, not week to week.

---

## 9. Generator-ready rule set (v1)

Every rule carries its tag. Where `12_volume_algorithm_v1` covers a topic, the rule is stated in one line with the coach's question ID and the numbers are read from `12_volume_algorithm_v1.json` (the section is named); they are not repeated here so the two files cannot drift. Topics 12 does not cover (rep selection, effort, rest, session caps by population, the athletic sport dial, conditioning) are specified here in full; v1.2: the feedback mapping is retired (§9.13). Every number is a default the coach can change in one place in `03_volume_rules.json` or `12_volume_algorithm_v1.json` ("this is all customizable", COACH-R2 VOL-06); coaches using the tool can add their own rules on top (COACH-ANSWER GEN-08). v1.1: round-2 answers applied throughout (COACH-R2 tags); v1.2: round-3 answers (COACH-R3 tags).

### 9.1 Inputs that change the dose

The full intake is in `09_generator_inputs.md`; these are the fields the volume and dosing rules read.

| Input | Values | Why it matters | Tag |
|---|---|---|---|
| goal | aesthetics/bodybuilding, strength/powerlifting, athletic (competitive sport), weekend-warrior athletic (non-competitive adults and youth), "stay athletic and active" (recreational pickleball, HYROX for fitness, rec leagues and similar; coach request 2026-10-08), fat loss, general fitness, bootcamp | goal factors (12 §3.4), rep matrix (9.9), session caps (9.10), conditioning (9.12) | COACH-ANSWER GEN-02, ATH-13 |
| sport, position, season | competitive sport → sport + position + **next season start date + practice and game days per week** (the tool works out off-, pre- and in-season); recreational sport or activity → that only | athletic dial (9.11), bilateral share (12 §3.11), phase factors (12 §3.4), in-season game spacing | COACH-ANSWER GEN-02, PER-08; COACH-R2 GEN-05 |
| training experience | years of consistent training, months off, ex-pro yes/no | level L1-L3 (9.2) | COACH-ANSWER GEN-02, PRG-05 |
| age, body weight | numbers; **no sex field** | older-adult rules, loaded-jump loads (10-20 % of body weight, EQ-15) | COACH-ANSWER GEN-02, ATH-09, EQ-15 |
| days per week | 2-6 days (v1.3: **session length is no longer an input**, COACH-CT CT-01, COACH-R4 R4-SES-01) | the week template; with 2 days the 2-day rule (every big group at about 6-8 weekly sets, a third day suggested; COACH-R4 R4-SES-03); session size comes from the client type (9.10, V2) | COACH-ANSWER PRG-02; COACH-R4 R4-SES-01, R4-SES-03 |
| plan mode | maintenance/transition (length chosen), pre-season block, 8-week, 12-week, short training block, yearly (gen-pop, tunable); v1.1's week-by-week mode is retired (it needed the check-in) | the stairway and its length (12 §3.7, §3.12) | COACH-ANSWER PER-01; COACH-R2 PER-01..06; COACH-R3 VOL-02, VOL-04 |
| **Focus muscle 1, Focus muscle 2** | none, one or two lines (quads, hamstrings, glutes, chest, back, shoulders, biceps, triceps, calves); +1 to +3 sets each (default +2); optional bias (e.g. V-taper) | 9.4 | COACH-R3 SES-01; COACH-ANSWER VOL-18 |
| pain / injury areas | joints or muscles | 9.5 | COACH-ANSWER VOL-03 |
| preference style | 'volume_lighter', 'balanced', 'heavy_powerlifting'; optional heavy-unilateral toggle | rep brackets only (9.9) | COACH-ANSWER VOL-12, UNI-04 |
| equipment | full commercial gym, basic gym, home gym, home DBs + bench, kettlebells only, bodyweight only, hotel gym, field/track kit (no bands) | exercise filtering (`10_equipment_model`) | COACH-ANSWER EQ-01 |
| ~~recovery signal~~ | **removed in v1.1**: no sleep, stress or physical-job questions | v1.2: no input changes the step; the planned stairway runs as written | COACH-R2 GEN-04 (NOT RIGHT); COACH-R3 VOL-02 |
| tests | checkboxes at block start (strength, cardio, speed, jumps, body weight) or "no testing"; before the block (or week 1) and at the end, never mid-block; untrained: 5RM / 3RM or 80-90 % efforts, never a 1RM or max mile; the plan prints the test weeks (no reminders: nothing is stored) | test weeks (12 §3.12) | COACH-ANSWER PER-07; COACH-R2 PER-07; COACH-R3 GEN-01 |
| ~~weekly check-in~~ | **retired in v1.2**: the plan is an output only; no check-in, no tracking, nothing stored | the planned stairway runs as written; the printed self-adjust guide (9.13) | COACH-R3 VOL-02, VOL-04, GEN-01 |
| play days, event date (stay-active users) | the days they play; an optional event (first HYROX race, pickleball tournament, 10K) | hardest gym day ≥ 48 h before the biggest play day; 3+ play sessions a week → no extra agility drills, half the jumps; activity sessions count as cardio (up to 2); hardest weeks end 1 week before the event, then 1 easy week | COACH-R3 ATH-05 |
| blocks completed in a row | 0 by default; entered when the user rebuilds | v1.3: every group starts about 5 % above the last block's start, in whole sets, never above the level's top (COACH-R4 R4-PRG-04); v1.2's "ceiling + 1" is retired | COACH-R4 R4-PRG-04; COACH-R2 VOL-06; input PROPOSED (nothing is stored, COACH-R3 GEN-01) |

### 9.2 Levels and muscle classes

- **Levels (COACH-ANSWER PRG-05, CAT-06).** **L1** = novice (he uses "novice" and "newbie" for the same thing): under about 6-12 months of training, **or** more than 6-12 months off (the body is treated as a beginner; exercise skill can stay higher because it returns fast). **L2** = intermediate: consistent training for more than a year. **L3** = advanced: definition PROPOSED in 12 §3.2 (3+ years consistent and 4+ days/week now, or a competitive physique/strength athlete). Ex-pro athletes start at L1 only for a short acclimation, then move up. Level up: at the end of a block the user (or coach) picks the level for the next build; the plan's last page says when to move up ("if the block mostly felt like '8 - That was perfect' or easier, with no pain"); no logs are read (COACH-ANSWER PER-06; COACH-R3 VOL-02, GEN-01). **L4 is retired**: competition level now changes the athlete profile (sport, position, season), not the volume level (12 §3.2).
- **How the sheet labels map (INFERRED from his definitions):** gym 'NOVICE' and 'NEWBY' → L1 (same thing; the v0 claim that 'NOVICE' sits below 'NEWBY' is retired); gym 'INTERMEDIATE' → L2; aerobic 'BEGGINER' / ' INTERMEDIATE' / ' ADVANCED' → L1 / L2 / L3. The athletic 'STARTING' / ' MID' / ' ADVANCED OFF SEASON' tabs can be used either as back-to-back blocks or as levels, "depends on whatever is needed" (COACH-ANSWER PRG-04). Level colours (OBSERVED, for display only): green 93C47D, yellow FFD966, orange F6B26B (gym) / red E06666 (athletic, aerobic).
- **Client level and exercise level are separate axes** (COACH-ANSWER CAT-06; OBSERVED: UL/PPL give leg press and barbell deadlift to 'NOVICE'). Level sets the **dose**; the exercise's difficulty is chosen per slot, and levels add options without removing any (COACH-ANSWER CAT-05).
- **Muscle classes (COACH-ANSWER CAT-02, RIGHT).** Big: quads, glutes, hamstrings, lats/upper back, chest. Small: biceps, triceps, side and rear delts, calves, forearms, abs. Not placed: traps, front delts, adductors, neck (floor muscles in 12 §3.3). **The class drives rep defaults (9.9) and the small-muscle starts at L2-L3 (12 / 15, COACH-R2 VOL-04; L1 10 by the floor). It never drives the weekly step** (COACH-ANSWER VOL-05).
- **Accounting lines** = the coach's 10 FOCUS headers ('QUADS 👇', 'SHOULDERS/TRAPS 👇', 'BACK 👇', 'TRICEP 👇', 'GLUTES 👇', 'HAMSTRINGS 👇', 'CHEST 👇', 'CORE 👇', 'BICEP 👇', 'CALVES 👇'). **v1.2:** shoulders are one line (front + side + rear delts, traps), because "I wouldn't categorize the rear delt as an individual muscle" (COACH-R3 VOL-01); the floor of 10 is read on the R3-SES-01 groups (hips = glutes + hamstrings). The delt heads, traps, forearms, adductors and neck stay reported for display.

### 9.3 Weekly sets per muscle: starting volumes, caps, other goals

> **Changed in v1.3** (COACH-R4 R4-SES-03). The floor of 10 applies from 3 training days. With 2 training days every big group starts at 6 and tops at 8 (section V4). Where the text below differs, the v1.3 section at the top of this file wins.

**The coach's numbers (all COACH-ANSWER):**

| What | Value | ID |
|---|---|---|
| Starting weekly hard sets per muscle | beginner **10-12**, intermediate **15-20**, advanced **20+** ("sounds about right ... we just got to make sure we adjust accordingly") | VOL-01 |
| What the bands mean | 15-20 = "a good foundation for maintenance to a little bit of growth"; 20-25 = "a good growth foundation"; 40 sets of chest "way too much", 5 "too little" | UNI-01 |
| Priority muscle → **Focus muscle** | v1: +4 to +6 sets, cap about 25-30 (by level 18 / 26-28 / 30). **v1.2:** Focus muscle 1 / 2 get "an extra set or two or three" (+1-3, default +2) on the balanced plan; the +4 / +6 push is an optional coach setting | VOL-02; COACH-R2 VOL-06; COACH-R3 SES-01 |
| Floor | "I don't think anybody needs less than 10 sets a week per muscle"; small muscles: 8 is "probably just barely maintenance ... the little muscles also grow the same idea" | COACH-R2 VOL-06, VOL-04 |
| Small lines (shoulders, biceps, triceps) | beginner 8 → **10** (floor), intermediate 12, advanced 15; v1.2: read on the whole shoulders group | COACH-R2 VOL-04 (RIGHT); COACH-R3 VOL-01 |
| Caps per 12-week plan | 14 / 22 / 25 by level; "all customizable"; above 30 only for a very advanced person, maybe through a Pro level | COACH-R2 VOL-06 |
| Typical trained volume | "most people train around that: 20 to 30 sets per muscle per week" (checked in 12 §2.11) | COACH-R2 VOL-06 |
| Calves | 3 sets every leg day, **one exercise** (v1.2) | VOL-17; COACH-R3 SES-01 |
| Rear delts | v1.1: their own sets and reps every week (4 / 6 / 8 by level). **v1.2:** part of the shoulders group ("I wouldn't categorize the rear delt as an individual muscle"); a rear-delt exercise every week; users and coaches can add more | VOL-17; COACH-R2 VOL-04; COACH-R3 VOL-01 |
| Core | about 2 core exercises per session, first, light (2 × 2 short of failure); optional core supersets or monster sets anywhere | VOL-17, ATH-11; COACH-R2 SES-03 |
| The tool learns | "this eventually will be something that learns from the data of all the people that use it" (v1.2: parked - "I don't want any data kept", COACH-R3 GEN-01; the coach changes the defaults by hand) | VOL-01; COACH-R3 GEN-01 |

**Engine values** (start per level, level caps, fill policy per line, shoulders / biceps / triceps 10 / 12 / 15, core opener 2 × 2, floor 10 on groups, Focus +F): `12_volume_algorithm_v1.json > starting_table` and `focus_muscles` (12 §3.3, §3.5; approved in rounds 2 and 3 except INFERRED / PROPOSED items: small lines on the same caps as big ones, group credit, the Focus default +2). **Other goals, phases and populations** are multipliers on those starts (`goal_phase_modifiers`, 12 §3.4): strength keeps weekly sets similar and moves reps (COACH-ANSWER VOL-12); general, fat loss and "stay athletic and active" 0.8, then the floor of 10 (PROPOSED); field athletes off-season lower 0.7 / upper 0.5, then the floor (chest and back 7.5 → 10 at L2, flagged), with arms and glutes on helper credit and shoulders held at the floor through the shoulder-care station and presses (COACH-ANSWER UNI-02; COACH-R2 VOL-06; COACH-R3 VOL-01; factors PROPOSED); pre-season about 60 % of off-season sets (COACH-R2 PER-06); in-season 0.4-0.5 lower (COACH-ANSWER PER-08, UNI-10; factors PROPOSED); boxers in high-punching weeks **pressing and arms × 0.5-0.7, never zero** (COACH-ANSWER ATH-04; factor PROPOSED).

**What the start table changes against his written templates (coach count, hypertrophy family medians from 3.2 vs the L2 start):**

| Muscle | L2 start (12 §3.3) | His templates, median | Change |
|---|---|---|---|
| quads | 15 | 16 | about the same |
| hamstrings | 15 | 12 | +3 |
| glutes | 15 (athletes: helper credit only, PROPOSED) | 6 | +9, direct glute work or Focus (compounds give 0.25, COACH-R2 VOL-05) |
| chest | 15 | 10 | +5 |
| lats/upper back | 15 | 12 | +3 |
| shoulders (front + side + rear delts, group credit) | 12 (COACH-R2 VOL-04; COACH-R3 VOL-01) | side 6.5 + rear 3.5 (heads counted separately in the templates) | about the same as the template sum; a rear-delt exercise every week (VOL-17) |
| biceps / triceps | 12 (COACH-R2 VOL-04) | 8.2 / 9 | +3-4 |
| calves | one exercise × 3 sets per leg day, at least 10 a week (floor) | 3 | +7-9 (VOL-17; COACH-R2 VOL-06; COACH-R3 SES-01) |
| abs | 2 exercises × 2 sets per session, light (VOL-17; COACH-R2 SES-03) | 0 | new (VOL-17) |

**Retired (v0):** the peak-week target table with back-solved starts (`start = peak / (1 + rate)^(weeks - 1)`), the "other goals L2" peak table and its level multipliers (L1 × 0.75 ... L4 × 1.15; athletic L3 × 0.9, L4 × 0.75). The coach gave starting volumes (COACH-ANSWER VOL-01), so the start is set first and the rate moves it (12 §3.3, §3.7).

**Floor (COACH-R2 VOL-06, COACH-R3 VOL-01): 10 sets a week per trained group** in any training block ("I don't think anybody needs less than 10 sets a week per muscle"; "If you put together all the sets of shoulders, it'll equate to more than 10 sets"): quads, hips (glutes + hamstrings), chest, back, shoulders, biceps, triceps, calves, counted with group credit; not applied to maintenance, pre-season or in-season blocks, a pain-reduced group, groups the time policy leaves to compound credit, a field athlete's credit-only lines or floor muscles (12 §3.3). v1's floors (big 4, small 2) are retired; v1.1's rear-delt 4 / 6 / 8 is retired as a number (tension 27 closed). SCIENCE (true maintenance needs far less): strength and size were kept for up to 32 weeks with 1 session/week and 1 set per exercise if intensity stayed high, in younger adults; older adults needed about 2 sessions/week and 2-3 sets to keep size (Spiering et al. 2021; Bickel et al. 2011; 12 §2.4). The v0 exception "fighter pressing may go to ~0" is retired (COACH-ANSWER ATH-04).

**Bilateral : unilateral share of the weekly sets** (the coach called this relationship "very important", `coach_answers.md`). His rules, all COACH-ANSWER; the profile table, the share filter and the numbers he did not give are in 12 §3.11 (PROPOSED there):
- **The range is 90/10 to 10/90**, set by the athlete, adjustable by the coach, and "we got to figure that out and put that algorithm together" (UNI-02). "The unilateral work is more for health and keeping rotational foundations, and the bilateral is more for driving and creating forces" (UNI-02).
- **Bodybuilders and powerlifters:** unilateral "stays at the beginning just as a small foundation, maybe 50", then "turns more into an 80/20 or 90/10" bilateral (UNI-02). Contralateral and ipsilateral lunges are health accessories, given "much more of that at the beginning of their program ... the first couple of weeks, 3 weeks, up to 4", then bilateral-dominant; one stays in as an accessory "if there is anything bugging them" (CAT-13).
- **Field and change-of-direction athletes** (tennis, soccer, basketball, football skill positions): **80-90 % unilateral** so they keep their rotational forces; bilateral work is their health and connective-tissue foundation (UNI-02). Contralateral loading pulls the athlete **into** the hip and is their main unilateral loading; ipsilateral loading helps **out of** the hip, e.g. ipsilateral step-ups for a sprinter's acceleration (CAT-13). Court and combat athletes get more frontal and transverse unilateral work (UNI-12).
- **Season:** unilateral share rises toward the season; in-season bilateral work stays minimal, "maintain their strength and their potentiation" (UNI-10).
- **Upper body:** the same logic and the same 90/10-10/90 range (UNI-03); alternating lifts count as unilateral (UNI-07).
- **Pain or injury** moves the share: "we need to adjust accordingly" (UNI-02); a lift swapped for pain keeps its sets "ideally" (UNI-08; section 9.5).
- **Counting and progression:** one 10/10 set = 1 set (UNI-01); unilateral and bilateral volume progress the same way (UNI-05); unilateral reps stay moderate-high unless the heavy-unilateral toggle is on (UNI-04; section 9.9).

### 9.4 Focus muscles, priority and biases

- **Focus muscle 1 and Focus muscle 2 (COACH-R3 SES-01, v1.2; replaces the intake "priority muscles"):** "There could be a main focus muscle 1 and a main focus muscle 2, and that should be enough for the whole thing"; each gets "an extra set or two or three ... throughout this program". The user may pick none, one or two lines (quads, hamstrings, glutes, chest, back, shoulders, biceps, triceps, calves); each gets **+F weekly sets, F = 1-3, default 2** (default PROPOSED), added to its start **and** its ceiling, so the extra is there from week 1 and the stairway includes it; the ceiling never passes 18 / 26-28 / 30 by level (COACH-R2 VOL-06). Example: L2 glutes 15 → 22 balanced becomes 17 → 24 (12 §3.5). No sex default: "if it's a female and she chooses glutes" is a choice, not a rule (COACH-ANSWER GEN-02).
- **Its exercise goes first** in its session, small Focus muscles included (COACH-ANSWER ORD-04: calves first on aesthetics A-days and side raises first on push days were priority/pre-fatigue).
- **Delivery order:** its own exercises in the VOL-07 order (first exercise first) → 'Focus 1' / 'Focus 2' on the optional day (2-3 sets each; both may hit the same muscle) → a bonus exercise on a day that already trains it (COACH-ANSWER VOL-07, ORD-10, ORD-11; COACH-R3 VOL-03).
- **The other lines are not slowed:** Focus muscles are a small bias inside a balanced plan and every trained line still climbs to its own planned peak in the last week - its ceiling, or start × G(N) when the standard 3 % / 5 % steps cannot reach it (COACH-R3 VOL-04; INFERRED resolution, tension 31; the ceiling-vs-step question is 12 §7 item 16).
- **The coach's priority push (optional, coach-only, off by default; COACH-ANSWER VOL-02, PARTLY: "That's the idea ... we'll collect data to see if we need to adjust it"):** 1-2 muscles start + 4 (L1-L2) / + 6 (L3) with caps 18 / 26-28 / 30 by level, and while it runs the other muscles grow at most 3 % a week (COACH-R2 VOL-06, RIGHT). The split by level is PROPOSED. An optional Pro setting may let one priority muscle of a very advanced, determined lifter pass 30, up to 35 (COACH-R2 VOL-06; numbers PROPOSED). It is a build-time setting; the v1.1 wording "check-in bumps included" is gone with the check-in (COACH-R3 VOL-02). v0's "+2 percentage points of rate for a priority muscle" stays retired (COACH-ANSWER VOL-05).
- SCIENCE: RP defines MAV*P as the volume for a primary-priority muscle "if you prioritize its training and reduce the training for other muscles substantially"; their MAV*P values are roughly 1.3-2 × normal MAV, which bounds the +4 to +6 push; the +1-3 Focus dose sits well inside it.
- **Bias (COACH-ANSWER VOL-18: "it can work into that V-taper bias. It just depends on the bias of the athlete, so the model needs to be able to understand that").** Default = **no bias**: the generator balances every line to the start table (the chest-low / side-delt-high pattern in UL and fat burn was not intended). Optional bias, PROPOSED mechanism (v1.2): **'v_taper'** = Focus 1 shoulders (the extra sets go to side raises first) and Focus 2 back, chest held at its start, all other rules unchanged. Other biases (glute, arm) use the same Focus slots. PENDING COACH APPROVAL.

### 9.5 Pain and injury

The coach's rules (all COACH-ANSWER), applied in this order; the trigger table with the engine actions is 12 §3.6:

1. **Pain area declared at intake:** that muscle or pattern starts **30-50 % lower**, its exercises move to **constrained machines** (constraint 4-5 on the approved 1-5 scale) or **split grips** (dumbbells, kettlebells, individual handles), positions that hurt are excluded (VOL-03, EQ-03, EQ-13; OBSERVED UL/PPL A7: '****When there are joint pains, usually getting away from fixed grips (barbells, bars) and going split grips (dumbbells, kbs, indivitual grips) help take care of some stuff'; athletic A6 adds 'usually going unilateral'). Older, injured and high-volume clients collect volume "in a safe place with more constraints" and never get overhead squat, snatch, low-bar squat or depth jumps (EQ-03).
2. **During the block (printed self-adjust guide; nothing is logged, COACH-R3 VOL-02, GEN-01):** an exercise hurts → swap inside the same category to the listed more constrained, split-grip or unilateral variant; **keep the sets "ideally, but you have to adjust accordingly"** (UNI-08).
3. **Still hurts:** cut that exercise's sets by a third to a half (VOL-03; wording PROPOSED, 12 §3.6).
4. **Still too much:** "maybe even drop the exercise altogether" for the block (VOL-03).
5. **Pain moves the bilateral:unilateral share** toward the pain-free side (UNI-02 "we need to adjust accordingly"; 20 points PROPOSED, 12 §3.11). Low back sore after axial loading → belt squat (no spinal load) (EQ-11, PER-04).
6. Feels the wrong muscle → change one small variable in the same category; can't do it → the easier listed version or an assisted one; volume unchanged (GEN-05 assumption RIGHT, PER-02) - printed guidance, the user applies it.
7. **Several things hurt in one week** → the guide says: stop the block, take the recommended easy week or a maintenance phase, build a new block when ready; the app never inserts a deload and no longer asks (the v1.1 block-at-risk prompt is retired with the check-in) (COACH-R2 VOL-07; COACH-R3 VOL-02, PER-01).
8. **Rotation bias:** keep external- and internal-rotation positions in every week and use the bias to choose a swap when something hurts (not by sport) (COACH-R2 LIB-03).

Dosing details this file adds (PROPOSED, kept from the v0 INFERRED rule): on the painful pattern, shift the rep bracket up one notch (e.g. '8 to 12' → '10 to 15'), no MYO or MAX sets, and for an injured lower-limb joint only the first plyo stage (RC1, receive & pause landings).

### 9.6 Weekly progression: the stairway (approved, computed once)

> **Changed in v1.3** (COACH-CX CX-01, CX-02, CX-03; COACH-R4 R4-PRG-01, R4-PRG-02). The pattern stands; the planned final sets are now reached, with faster steps when needed, no hard limit and a note above about 15 % (section V3). Where the text below differs, the v1.3 section at the top of this file wins.

**The rule (coach):**
- **Every plan is a stairway:** "In the beginning, the first 2, 3, 4 weeks, the steps are a little bit smaller, but they're gradually going up. When they get to that halfway point and upwards, the steps get a little bit higher, but not too much ... that goes for every plan" (COACH-R2 PER-03); on 12 weeks "the last 4 weeks are going to be brutal" (PER-04); "start at a 2 and end at an 11" is the perceived overall load, not the set count (PER-05).
- The step is a % **of that muscle's weekly sets** (COACH-ANSWER VOL-04: "your chest example: 20 → 22 sets at the same load"; load and volume load are tracked, not driven by %), one rule for every person, never by muscle size (VOL-05).
- **RETIRED in v1.3 (COACH-CX CX-01; COACH-R4 R4-PRG-02: no hard limit, a note above about 15 %).** v1.2 text: **Never more than 7 % a week** (COACH-R2 VOL-01) and the person's total weekly resistance sets must rise by less than 10 % ("It's hard to sustain a program like that", COACH-ANSWER UNI-05). A hand-set step runs 0-7 %.
- **The stairway numbers are his rule** (COACH-R3 VOL-04, RIGHT): about 3 % a week to the halfway week, about 5 % after it, each line's steps sized so it reaches its ceiling in the last week ("intermediate big muscle 15 to 22 sets, the last four weeks 19, 20, 21, 22").
- **No check-in, nothing adapts, nothing stored** (COACH-R3 VOL-02: "I want to take away all check-in info. We're only doing outputs, and people can change accordingly"; VOL-04: "kick out a program, and that's it ... the program will tell you to adjust accordingly"; GEN-01). v1.1's optional check-in and its step table are retired; the printed self-adjust guide (9.13) replaces them.
- **Unilateral and bilateral volume progress the same way** (UNI-05).
- **Rounding:** bank the fraction and add a whole set when it reaches 1 ("round up, round down. That's fine"); the tool, not the client, does the math (VOL-06).
- **Where the new set goes:** the first exercise for that line in the day's order, then the next: 2/2/2 → 3/2/2 → 3/3/2 → 3/3/3 → 4/3/3 (VOL-07); the two exposures of a day type alternate (Monday's first back exercise, then Thursday's); extra small-muscle sets become a short **bonus exercise** on the optional day, or on a day that already trains that muscle, never as that day's only exercise for it (COACH-R3 VOL-03, RIGHT); calves never get a second calf exercise on a leg day (COACH-R3 SES-01).
- **Focus muscles** carry +1-3 sets on their own stairway and do not slow the others (COACH-R3 SES-01, VOL-04); the "others ≤ 3 %" rule (COACH-R2 VOL-06) applies only to the optional coach priority push.
- **Shape for fighters:** 2-week steps and waves for fight or competition prep (PER-10).

**Engine (12 v1.2 §3.7-3.10):** the planned stairway (standard 3 % to the halfway week, 5 % after it, one scale factor λ per line so the planned peak lands on its ceiling in the final week; it climbs from the week-1 sets; a line the time cannot take to its peak lands on the ceiling its time holds), the display level 2 → 11 with planned effort drifting 3 → 2 → 1-2 → 1 RIR + intensifiers inside his 1-3 RIR band (approved, COACH-R3 VOL-04), banking against the planned target, placement with day alternation and the bilateral:unilateral filter, and the time-vs-minimums policy (COACH-R3 SES-02). Retired in v1.2: the check-in table, holds, repeated weeks and the block-at-risk prompt (COACH-R3 VOL-02). Retired from v1: the readiness score, the 5 % / 3 % intake defaults, "7 % only after logs", acclimation and 8-week phase caps and the 8-week × 1.10 start (COACH-R2 GEN-04, PER-03, PER-04). Retired from v0: size-class rates, the 0.75 release threshold, the "isolation slot first / alternate bilateral and unilateral" placement and the compounding target formula (COACH-ANSWER VOL-05, VOL-06, VOL-07).

**Illustration (computed with the session scratchpad script `r2_vol/bank_example_v1_1.py`; replaces v1's readiness-rate illustration).** L2 quads, 12-week plan, start 15, cap 22 (λ = 0.87: 2.6 % then 4.33 %), no check-in: day A (Tue) back squat 3 / Bulgarian split squat 10/10 3 / leg extension 2; day B (Sat) leg press 3 / walking lunge 10/10 2 / leg extension 2. The share filter of 12 §3.9 step 2 is left out to show his order alone.

| Week | planned step | planned target | quads sets | bank (target - sets) | Day A (squat / Bulgarian / leg ext.) | Day B (leg press / lunge / leg ext.) | level | planned effort |
|---|---|---|---|---|---|---|---|---|
| 1 | - | 15 | 15 | 0 | 3/3/2 | 3/2/2 | 2 | 3 RIR |
| 2 | 2.6 % | 15.39 | 15 | 0.39 | 3/3/2 | 3/2/2 | 2.6 | 3 RIR |
| 3 | 2.6 % | 15.79 | 15 | 0.79 | 3/3/2 | 3/2/2 | 3.2 | 3 RIR |
| 4 | 2.6 % | 16.2 | 16 | 0.2 | 3/3/3 | 3/2/2 | 3.8 | 3 RIR |
| 5 | 2.6 % | 16.62 | 16 | 0.62 | 3/3/3 | 3/2/2 | 4.4 | 3 RIR |
| 6 | 2.6 % | 17.05 | 17 | 0.05 | 3/3/3 | 3/3/2 | 5 | 3 RIR |
| 7 | 4.33 % | 17.79 | 17 | 0.79 | 3/3/3 | 3/3/2 | 6 | 2 RIR |
| 8 | 4.33 % | 18.57 | 18 | 0.57 | 4/3/3 | 3/3/2 | 7 | 2 RIR |
| 9 | 4.33 % | 19.37 | 19 | 0.37 | 4/3/3 | 3/3/3 | 8 | 2 RIR |
| 10 | 4.33 % | 20.21 | 20 | 0.21 | 4/4/3 | 3/3/3 | 9 | 1-2 RIR |
| 11 | 4.33 % | 21.09 | 21 | 0.09 | 4/4/3 | 4/3/3 | 10 | 1-2 RIR |
| 12 | 4.33 % | 22 | 22 | -0 | 4/4/4 | 4/3/3 | 11 | 1 RIR + intensifiers allowed |

The bank is the planned target minus the current sets (the banked fraction of VOL-06). Days alternate (A, then B) and inside a day the set goes to the first exercise whose sets are below the first exercise's, otherwise to the first: exactly his 3/3/2 → 3/3/3 → 4/3/3. The early steps add a set every 2-3 weeks; after the halfway week a set arrives almost every week, and weeks 9-12 (19 → 22) are the hardest. The whole table is computed once, when the plan is built (COACH-R3 VOL-04); v1.1's check-in variants (a "too easy" bump, holds, repeated weeks) are retired. Full multi-line runs with the share filter, supersets, bonus exercises, Focus muscles and the time policy: 12 §5.1-5.5.

**What progresses, by goal:**

| Goal | What the stairway moves | What else progresses | Tag |
|---|---|---|---|
| Aesthetics / hypertrophy | weekly sets per muscle | reps inside the bracket, then load; MYO on the last machine/isolation exercise; in the last week intensifiers are allowed | COACH-ANSWER VOL-04, VOL-15; COACH-R2 PER-05 |
| Fat loss | weekly sets on compounds | isolation reps step up inside 12-30 (OBSERVED FAT BURN steps; 40 only in the optional AMRAP/CrossFit/HYROX-style work); finisher circuits add rounds and work time (OBSERVED rounds 3 → 5, work 30 → 50 s) | COACH-ANSWER VOL-11, PRG-11 |
| Strength / powerlifting | load on the main lifts by his % template (4 Tracks: 80/80/85/85/90/90 %, RPE 7 → 10) when a recent tested best is entered, otherwise RIR (COACH-R2 GEN-06); Olympic: DB/KB and pull variants 75 → 80 → 85 → 90 % with 4 × 8 → 4 × 6 → 4 × 6 → 4 × 4, full squat cleans and snatches 3-5 reps with the same weekly reps, % only when that lift was tested (COACH-R2 ATH-05, GEN-06) | main-lift sets per the template; accessories on the stairway; the preference style moves reps, not weekly sets | COACH-ANSWER PER-09, VOL-12; COACH-R2 ATH-05, GEN-06 |
| Athletic | quality first: ballistic → plyometric share, Receive-Create stage 1 → 3, exercise level, Olympic intensity, VOL 1 → VOL 3 rep phases | resistance sets on the stairway inside the athlete factors; pre-season ~60 % + taper; in-season flat | COACH-ANSWER ATH-01, CAT-10, PER-08, PER-11; COACH-R2 ATH-01, ATH-03, PER-06 |
| General / weekend-warrior / "stay athletic and active" / bootcamp | weekly sets (bootcamp: rounds and station time) | reps, conditioning density | COACH-ANSWER VOL-05, PRG-03 |
| Fight or competition prep | the same average step, applied as 2-week steps and waves | | COACH-ANSWER PER-10 |

**His written step pattern vs his rule.** His own products step +20 to +50 % on a step week with flat weeks between, and two 8-week products average +10.4 and +16.5 %/week (section 8). Those are above his stated "10 % is way too much" and the opposite of the stairway's small, steady steps. The generator follows his stated rules (COACH-ANSWER UNI-05, PER-10; COACH-R2 PER-03); the observed steps stay as evidence of how the sheets were written.

### 9.7 Caps

> **Changed in v1.3** (COACH-CT CT-01; COACH-CX CX-01; COACH-R4 R4-SES-02, R4-PRG-02). The step and weekly-rise caps, the exercise counts by minutes, the time-vs-minimums row and the session lengths are retired as rules (rows marked below). The spine, effort, medball and counting caps stand. Where the text below differs, the v1.3 section at the top of this file wins.

| Cap | v1 value | Tag |
|---|---|---|
| ~~Planned weekly step per line~~ **RETIRED in v1.3** (no limit; CX-01, R4-PRG-02) | v1.2: **≤ 7 %** (standard 3 % early, 5 % late, λ ≤ 1; approved COACH-R3 VOL-04); ≤ 3 % for other lines only under the optional coach priority push | COACH-R2 VOL-01, VOL-06; COACH-R3 VOL-04; 12 §3.7 |
| ~~Week-over-week increase in total weekly resistance sets~~ **RETIRED in v1.3** (a note above about 15 %; R4-PRG-02) | v1.2: **below +10 %** (hard ceiling; +10 % itself is "way too much"); one whole set may always be added (a small plan must still climb); exempt: the first week after an easy week or maintenance phase, block-boundary swaps that add no sets | COACH-ANSWER UNI-05; allowance and exemptions PROPOSED (12 §3.7.4) |
| Hand-set weekly step (coach, at build time) | 0-7 % (his 3/5/7 band) | COACH-ANSWER VOL-05, UNI-05 |
| Weekly sets per line / group | **floor 10** per trained group (quads, hips, chest, back, shoulders, biceps, triceps, calves); ceilings 14 / 22 / 25 by level for every line (customizable); his outer bounds "5 too little, 40 way too much" | COACH-R2 VOL-06; COACH-R3 VOL-01, SES-01; COACH-ANSWER UNI-01 |
| Focus muscle | start and ceiling + F (F = 1-3, default 2), ceiling ≤ 18 / 26-28 / 30 by level; optional coach priority push and Pro setting above 30 (numbers PROPOSED) | COACH-R3 SES-01; COACH-ANSWER VOL-02; COACH-R2 VOL-06 |
| Per muscle per session | soft 11 fractional sets, Focus / priority 14 | SCIENCE Remmert (~11), RP (8-12); values PROPOSED (12 §3.10) |
| Resistance exercises per session | **v1.3, by client type**: general fitness / fat loss 5-7, aesthetics 6-8, strength 5-6, bootcamp 5-7 stations, field athletes up to 12, older adults 5-6 (not counting the warm-up or the 2 core exercises); "usually 7" stays his typical number. *(Retired: by session length 45 min ≈ 5, 60 min ≈ 6-7, 75-90 min ≈ 8-9.)* | COACH-R4 R4-SES-02; COACH-ANSWER VOL-08, VOL-16 |
| Exercises per group per day | every FOCUS group trained that day gets **2-4 exercises, never 1** (hips = glutes + hamstrings, shoulders = all delts); calves **one exercise × 3 sets per leg day** | COACH-R2 SES-05 (PARTLY); COACH-R3 SES-01 (RIGHT) |
| ~~Time vs minimums~~ **RETIRED in v1.3** (CT-01; R4-SES-03 and R4-SES-04 replace it) | v1.2: when the chosen days × minutes cannot hold the minimums at the peak week: tell up front + offer another day or longer sessions → if kept, fewer groups trained directly (big movers kept; arms, calves, shoulder isolation from compound credit) → recommended supersets → the stairway climbs on every trained group; never squeeze 2-4 exercises per group into a day that cannot hold them | COACH-R3 SES-02 (12 §3.10.1) |
| Field athlete, off-season | **up to 12 exercises + the 2-exercise core block** (14 listed), with 2-4 exercises for each group trained that day: cross pattern (default for most athletes) leaves 2 jump / throw stations + 1 Olympic lift; the same-pattern athletic template (size-focused and high-level athletes) holds 3-4 jump stations + 1 Olympic lift; warm-up drills never count; a superset of two small isolations counts as one | COACH-ANSWER VOL-08, VOL-17; COACH-R2 SES-04; COACH-R3 SES-01 (RIGHT) |
| Exercises per muscle group on its day | split days 3-4; full-body days 2-4 (counted on the FOCUS groups) | COACH-ANSWER VOL-07; COACH-R2 SES-05; COACH-R3 SES-01 |
| Sets per exercise | defaults: 3 compound, 2 isolation, 3 calves, **2 per slot in athletic templates**; max 4 (L1) / 5 (L2-L3), isolation 4 (PROPOSED, 12 §3.9); strength 'the work' up to 7 (OBSERVED STRENGTH-12 header); BYOP SETS menu 1-8 + 'SUPERSET W/ 👇' (OBSERVED 'MASTER EXERCISE LIBRARY'!AV8:AV16) | COACH-ANSWER VOL-16, VOL-17; OBSERVED; PROPOSED |
| Session length | **not an input and not a limit (v1.3)**; the plan prints an average time estimate per day. His typical lengths - athletes, bodybuilders, powerlifters ~90 min; general and weight loss 45-60; bootcamp 35-45 - describe what sessions usually take | COACH-CT CT-01; COACH-R4 R4-SES-01; COACH-ANSWER UNI-09, PRG-03 |
| Plyo contacts per session | L1 80, L2 100, L3 120 (lower ends of NSCA ranges; his own sessions run lower and that is fine) | SCIENCE NSCA; OBSERVED; using the lower ends as caps PROPOSED |
| Plyo spacing | 48-72 h between plyo sessions for the same area; older/masters 3-4 days | SCIENCE NSCA (12 §2.8, §3.13) |
| Medball weight | never over 20 lb; 8-10 lb for speed passes and rotations; slams 10-20 lb (slam ball), overhead throws 6-10 lb, sit-up throws 6-8 lb; lighter for youth and older clients; heavier balls only for specific work (heavy medball hang clean, wall balls) | COACH-ANSWER EQ-06 (RIGHT); coach chat statement (coach_answers.md) |
| Loaded jumps | 10-20 % of body weight; too heavy when jump height or speed clearly drops | COACH-ANSWER EQ-15 |

**Retired (v0):** per-session working-set caps by level (L1 15 / L2 20 / L3 22 / L4 24; athletic 24-30) → replaced by exercise counts, minutes and the time model (COACH-ANSWER VOL-08, UNI-09); the lower-body fatigue budget that charged athletic sets 0.5 each (COACH-ANSWER VOL-10); L4 values (COACH-ANSWER PRG-05); "≤ +10 %/week as INFERRED smoothing" (now his rule). **Retired (v1, round 2):** floors 4 / 2, small-muscle caps 12 / 18 / 22, the "10-12" field-athlete cap and the readiness-based rate (COACH-R2 VOL-06, SES-04, VOL-01, GEN-04). **Retired (v1.2, round 3):** the check-in bump (+2 points), rear-delt caps 8 / 12 / 16, the older-adult ≤ 3 % step cap (COACH-R3 VOL-02, VOL-01, VOL-04).

### 9.8 Plan length, blocks and deload

> **Changed in v1.3** (COACH-R4 R4-PRG-04). The next block starts about 5 % above the last block's start, in whole sets, never above the level's top; at the top the sets stay and load and reps progress. "Ceiling + 1" is retired. Where the text below differs, the v1.3 section at the top of this file wins.

**The rules (COACH-ANSWER PER-01, PER-02, PER-03, PER-05, PER-07, PER-10; COACH-R2 PER-01..07, VOL-07, VOL-06):**
- **Every plan is a stairway** (8-week, 12-week and short training blocks): smaller steps first, slightly bigger after the halfway week, the hardest weeks last; 12 weeks is his preferred shape, with "the last 4 weeks ... brutal" (COACH-R2 PER-03, PER-04). v1's "8 weeks start hard (4 adapting + 4 driving)" and the 12-week acclimation cap are retired. Engine numbers: 12 §3.7.1.
- **No deload or maintenance week inside a block** ("It should never be thrown in the middle of a block ... they need to be able to manage their block and complete it"). A block that cannot be completed is stopped → a maintenance phase or a new block, built by the user (COACH-R2 VOL-07; COACH-R3 PER-01). v1.1's in-block tools (holds, -1 set after a "10", repeated weeks) are retired with the check-in (COACH-R3 VOL-02); the printed self-adjust guide covers what the user may do.
- **Maintenance phase** at about **50-70 %** (vacation, travel, season change, moving; PER-01); the user picks its length (COACH-R2 PER-06); at its end the plan simply ends and a printed note suggests the next build (no app prompt, nothing stored; COACH-R3 PER-01, GEN-01).
- **The easy week after a block is a recommendation**, not mandatory: "maintenance weeks are a recommendation. They don't have to be mandatory ... when the block ends, it just ends, and then you have to go back into the app and build whatever you want next" (COACH-R3 PER-01). Holidays and vacations are planned between blocks.
- **Pre-season** = a 4-6-week block at about **60 % of off-season sets** with more speed and power, then a **1-2-week taper** before the first game (COACH-R2 PER-06, RIGHT).
- **Yearly plan** = gen-pop "stay in shape" planning (Jan-Mar hard work + more cardio, start cutting; Apr-Jun summer shape; Jul-Sep maintain at ~70 %; Oct-mid-Dec build muscle, less cardio; last 2 weeks of December recommended maintenance), on the user's own calendar with holiday weeks planned between blocks (COACH-R3 PER-01), **fully tunable** (re-order blocks, more or less cardio, a winter powerlifting-style block) (COACH-R2 PER-01, PER-02).
- **Next block** after a completed block starts 5 % higher with the ceiling 1 set higher (never above 25, or 30 for a Focus / priority line) (COACH-R2 VOL-06, RIGHT); since nothing is stored, the user enters "blocks completed in a row" when rebuilding (PROPOSED); after a stopped block, the same start (PROPOSED).
- **Exercise blocks** of 4-6 weeks keep their exercises and change one or two small variables between them (PER-02); one-detail library variations are allowed between blocks, invented exercises never (COACH-R2 LIB-01). A/B lead-lift weeks are an option for clients who want variety, not a default (PER-03). The stairway runs through the exercise-block boundaries (INFERRED from R2-PER-04).
- **Tests** (COACH-R2 PER-07): before the block (or in week 1) and at the end, never during the block; someone untrained, or not coming off a completed block, never tests a 1RM or a max-effort mile from zero: 5RM / 3RM (beginners 5-8RM) and 80-90 % efforts.

**Deload dose (v1.1):** about **0.5 × the hardest (last) week's sets** of the block (round up, at least 1 set per exercise), same exercises and frequency, lighter or 3+ RIR; no AMRAP/MAX, MYO, supersets, buy-outs or finishers; Olympic lifts stay (same exercises; everyone in athletic training keeps them, ATH-10) at half the sets with light technique loads; plyos only stage-1 landings or low-amplitude hops at about half the contacts; conditioning Orange (C) only. **It is recommended only for the week after a completed block, never mandatory (COACH-R3 PER-01)**, and a chosen maintenance phase replaces it (COACH-R2 VOL-07: "half of the current (hardest) week" RIGHT; COACH-ANSWER PER-05, ATH-10; athletic and conditioning details PROPOSED, 12 §3.12). The observed baseball deload dropped its optional Olympic piece; that stays evidence only.

**Observed deloads (evidence only; his written deloads were shallower than his stated rule, and some sat mid-plan):**
- Baseball 'DELOAD WEEK': same template, Part C '3 or 4' × 8, Part D 3 × 8/8, Part A 1-2 sets, no buy-out, no Olympic piece; resistance -31 %, all sets -46 %.
- AESTHETICS-12 week 7: 3 sets of '8/8/8-12' (-25 % sets). STRENGTH-12 week 7: 3 × 4 at RPE 7 (-50 % work sets). Boxer week 7: eleven rows 3 → 2 sets while three rows go 3 → 4 (I20, I35 'Hang Power Clean & Press', I46 complex) and the sprints 6 → 7 rounds (net -11 %) before the week-8 peak. These mid-plan deloads are not reproduced (COACH-R2 VOL-07).
- They cut **25-50 % from the peak** and land at **0.75-1.0 × week-1 volume** (AESTHETICS-12 1.0, STRENGTH-12 0.75, baseball 0.76, boxer 0.92 of week 3). The v0 rule (0.85 × week 1) was built from these and is retired by COACH-ANSWER PER-05. Half of a peak week that is 1.3-1.5 × week 1 lands at about 0.65-0.75 × week 1, close to the deepest observed deloads.
- SCIENCE: deloads every 5.6 ± 2.3 weeks lasting 6.4 ± 1.7 days, mostly cutting sets (Rogerson, Bell et al. 2024); Delphi consensus: deloads cut sets and proximity to failure, may be planned or autoregulated, and may sit in the last week of a block or the first week of the next (Bell et al. 2023); details 12 §2.7.

**Maintenance and plan-length SCIENCE:** 12 §2.4 (Spiering 2021, Bickel 2011, Barsuhn 2024): 50-70 % of an intermediate's volume is well above the research minimum to keep muscle in younger adults; older adults keep the high end (≥ 70 %, PROPOSED).

### 9.9 Rep-range, effort and rest selection

> **Changed in v1.3** (COACH-R4 R4-PRG-03). Rep and load progress is written as a rule the person applies ("When you hit 12 on every set with 1-2 reps left in the tank, add weight next time and start again at 8"), never a promised number per week (section V3). Where the text below differs, the v1.3 section at the top of this file wins.

**Base matrix (goal × exercise class), using the coach's own menu labels; new labels in italics.**

| Exercise class | Aesthetics / hypertrophy | Strength / powerlifting | Athletic | Fat loss | General / weekend-warrior |
|---|---|---|---|---|---|
| Main bilateral compound (squat, hinge, bench, row, press) | '8 to 12 Reps' (L1 '10 to 15' / '15 Reps'); L2+ may run the pyramid *'12/10/8 -20'* (12 mid, 10 heavier, 8 heaviest, light 20) | his % template (PER-09) when a recent tested best is entered, otherwise RIR (COACH-R2 GEN-06); 'the work' 5,4,3,2,1 ladder at '1RIR'; speed work 'FAST RPE6 or about 60-70%' | VOL 1 '12-15 Reps' → VOL 2 '8-12 Reps' → VOL 3 '6-8 Reps', one per block (PER-11); pre-season *'1 to 3'* - '4 to 6' | '10 to 15' → '8 to 12' over the block | '10 to 15' |
| Machine / stable compound (leg press, pulldown, pendulum) | '15 Reps' or '10 to 15'; 'MYO SET' only if it is the last exercise | '6 to 8' at 2 RIR (accessory) | '8 to 12' | '15 Reps' | '15 Reps' |
| Unilateral compound (lunge, step-up, SL hinge, 1-arm row; alternating lifts the same) | '8 to 12' per side (*'N/N'*); heavy '4 to 6' / '6 to 8' per side only with the heavy-unilateral toggle | '8 to 12' per side at 1-2 RIR | '6 to 8' per side, or contrast (intermediate+ off-season, heavy lift ~78-85 %, no rest within the complex, ATH-12) | '8 to 12' / *'10/10'* | '10 to 15' per side |
| Big-muscle isolation (leg extension, leg curl, flies) | '15 Reps' - '20 Reps'; 'MYO SET' only as the last exercise | '8 to 12' ('3x8' survival) | '8 to 12', or MYO finisher if last | '15 Reps' → '20 Reps' (OBSERVED WK1-2), up to *'30'*; *'40'* only in the optional AMRAP/CrossFit style | '15 Reps' |
| Small-muscle isolation (curls, triceps, side and rear delts) | '15 Reps' - '20 Reps' (12-30 range); rear delts *'20 to 30'*; last set 'MAX' allowed | '8 to 12' 'ALL'; triceps '20 Reps' (TATE PRESS 3 × 20) | '10 to 15' | arms *'30'* (OBSERVED WK1-3); side raises '15' → '20'; *'40'* only in the optional style | '15 to 20' |
| Calves (3 sets every leg day) | '15 Reps' - '20 Reps', last set 'MAX'; single-leg (ramp, plate, deficit) or bilateral | '10 to 15' | '8 to 12' heavy single-leg; ankle hops count as contacts, not calf sets | '15 to 20' | '15 to 20' |
| Core (about 2 exercises, first) | '10 to 15' or *'20-60 s'* / *'Accumulate N min'* | '8 to 12' | by plane; *'20-50 s'*; 'UNBROKEN'; more rotational core where the sport needs it (VOL-17) | circuit *'30-50 s'* | '10 to 15' / time |
| Plyo (contacts per set; never muscle sets) | none (no plyo block) | 'EASY' 3 × 6 (conjugate Thursday) | stage 1 Land (receive and pause) 6-8 (stick 3 s); stage 2 Land & Go 5-8; stage 3 Repeat 10-20; squirrel/ankle 20-40 (COACH-R2 ATH-03) | - | stages 1-2 |
| Throws (medball ≤ 20 lb) | none; warm-up only (ATH-05) | - | 10 per side per set (sit-up throws 20); 8-10 lb for speed | - | light, 10 per side |
| Olympic | - | his % template (PER-09) only when that lift was tested, otherwise RPE/RIR; % programming proper belongs to competitive Olympic lifters (COACH-R2 GEN-06) | L1 and early L2 (his "beginning intermediates"): DB/KB snatch, hex-bar jump, hang pull or hang clean (incl. the new hang clean, single-arm DB snatch, KB squat clean, COACH-R2 LIB-07) '6 to 8'; L2-L3 the full scope: hang and power variants '3 to 5' up to the full lifts (*'Squat Snatch'*, *'Squat Clean'*, *'Squat Clean & Jerk'*) (ATH-10); **up to 4 × a week, cleans on squat days and snatches on hinge days; DB/KB and pulls keep the 4 × 8 → 4 × 4 ramp, full squat cleans and snatches 3-5 reps with the same weekly reps (e.g. 6 × 5 @ 75 %); % of that lift's own max only when tested, otherwise RPE/RIR; explained as power output** (COACH-R2 ATH-04, ATH-05, GEN-06); push press before push jerk; older or injured clients never snatch (EQ-03); older adults none by default (COACH-R2 ATH-08) | - | L1 variants |

Tags for the matrix: COACH-ANSWER VOL-11, VOL-12, VOL-15, VOL-17, UNI-04, PRG-07, PER-09, PER-11, ATH-05, ATH-10, ATH-12, LIB-07 (full lifts named with "Squat"), LIB-13 (push press easier, push jerk intermediate/advanced), CAT-10/11 (plyo stages); cells without a coach answer keep their v0 OBSERVED/INFERRED source (section 4).

**Rep rules by muscle size (COACH-ANSWER VOL-11, RIGHT):** small muscles **12-30** (20s, 'MAX', 'MYO SET'); big muscles **5-15**, "a mix" (bilateral slot heavier, unilateral and machine moderate, isolation lighter). The observed habit of 15-20 on big-muscle isolation (leg extensions, leg curls) fits inside "a mix". SCIENCE: similar hypertrophy from about 5 to 30+ reps when sets are close to failure (Schoenfeld et al. 2021); RP splits weekly sets about 25 % heavy (5-10), 50 % moderate (10-20), 25 % light (20-30).

**40-rep sets (COACH-ANSWER VOL-11; COACH-R3 ATH-03):** "I'm not really a big fan of 40 reps ... it's not necessarily more fat-burning ... it's optional. It can be put together into different styles of workouts, like maybe an AMRAP." → never a default; available only inside an AMRAP / CrossFit-style WOD or the HYROX station circuits ("40-rep / AMRAP sets only inside these circuits", COACH-R3 ATH-03, RIGHT). He also said a 40-rep set "would be more for CrossFit, maybe, or for high-raw athletes"; we read "high-raw" as **HYROX** (fitness-racing) athletes. The coach's request of 2026-10-08 uses the same dictation for gen-pop clients who want to stay athletic and active ("things like high rows and pickleball"), so the HYROX reading was well supported, and round 3 confirmed it ("Yes, HYROX", COACH-R3 ATH-03, RIGHT): HYROX station circuits are the second home for 40-rep sets, and HYROX for fitness sits on the "stay athletic and active" path (9.1, 9.11). The OBSERVED FAT BURN 40s (section 4.2, 8) stay as evidence only.

**Preference style (COACH-ANSWER VOL-12, RIGHT: "It moves the rep range on the big compound lifts only ... Weekly sets stay similar and small muscles stay high-rep"):**

| Style | Big compound lifts | Weekly sets | Small muscles | Rest on the big lifts | Effort |
|---|---|---|---|---|---|
| 'volume_lighter' ("more sets of squats with less weight") | one bracket up ('10 to 15' / '15 Reps'; squat-menu rows 3-4 × 12-15) | **unchanged** | unchanged (high-rep) | 1-2 min | 1-3 RIR |
| 'balanced' | matrix default | **unchanged** | unchanged | 1-2 min (up to 3 on heavy compounds) | 1-3 RIR |
| 'heavy_powerlifting' ("heavier on the weight and fewer reps") | one bracket down ('4 to 6' / '6 to 8'); strength-menu rows (5 × 3, 5 × 4, 6 × 4) on the first lift of each day | **unchanged** | unchanged | 3-5 min | 1-2 RIR; never MAX on compounds |

v0's weekly-set factors (×1.1 for volume_lighter, ×0.85 for heavy_powerlifting) are removed.

**Heavy unilateral toggle (COACH-ANSWER UNI-04: "sometimes they use heavy low reps ... That might be something that can be optional in our algorithm. If the athlete or the coach wants to submit that").** Off by default. PROPOSED when on: the first unilateral lower lift of the day may use '4 to 6' or '6 to 8' per side at 1-2 RIR (constrained or supported variants for older clients); other unilateral lifts stay moderate-high.

**Effort (COACH-ANSWER VOL-13; COACH-R3 VOL-04):** **RIR is the scale**, 1-3 RIR on every working set at all times ("leave 1 in the tank"); inside the band the planned cue drifts across the block: 3 RIR (first half) → 2 RIR → 1-2 RIR → 1 RIR + intensifiers in the last week (approved, COACH-R3 VOL-04; VOL-13's "no planned ramp" now means never outside 1-3 RIR); **'MAX' / 'MAX REPS' = technical failure, only on small-muscle or bodyweight work** (last set). % of 1RM and RPE stay where his templates use them (strength and Olympic, COACH-ANSWER PER-09), but only when the client enters a recent tested best; otherwise RIR with the week-1 tip "pick a weight you could lift 2-3 more times", and Olympic lifts are explained as power output (COACH-R2 GEN-06). Speed work 'FAST RPE6 or about 60-70%'; plyos, throws and sprints at maximum intent and stopped when quality drops. Deload 3+ RIR (PER-05).

**How the client sees it (he asked to "add the explanation of RIR and kind of mix it with RPE"; text PROPOSED, needs the Spanish version too, COACH-ANSWER GEN-01).** Every working set shows its **target RIR** (his scale) with the RPE beside it:

| Target RIR (reps left in the tank) | RPE | Plain words |
|---|---|---|
| 3 | 7 | hard; 3 more clean reps were possible |
| 2 | 8 | very hard; 2 more clean reps |
| 1 | 9 | "leave 1 in the tank": only 1 more clean rep |
| 0 ('MAX') | 10 | technical failure: no more clean reps (small-muscle or bodyweight last sets only, VOL-13) |

**Logging EFFORT against the target: RETIRED in v1.2.** v1.1 read the client's EFFORT menu against each set's planned RIR ('8 - That was perfect' = hit the target, '9' = harder than planned, "10 - I'm done" = the max, successful; COACH-R2 VOL-02) to drive the check-in. The check-in is gone (COACH-R3 VOL-02: "I want to take away all check-in info"), so nothing is logged back. The plan still prints each set's **target RIR** with its RPE (table above) and the week's planned effort cue (3 RIR → 2 → 1-2 → 1 RIR + intensifiers, COACH-R3 VOL-04), and the self-adjust guide tells the user what to do after a true max set (take one set off that exercise next time, 9.13). The EFFORT menu may be printed for the user's own notes.

SCIENCE: RPE 10 = 0 RIR, 9 = 1, 8 = 2, 7 = 3 (Zourdos et al. 2016; Helms et al. 2016); people misjudge RIR by about one rep, more so far from failure and above ~12 reps, so effort is read as a weekly trend (Halperin et al. 2022; 12 §2.6).

**Rest (COACH-ANSWER VOL-14):** hypertrophy **1-2 min** default, up to **3 min** (heavy compounds); strength **3-6 min**; athletic "as prescribed" (OBSERVED 'ALL ABOUT SQUATS' B28/E28/H28); supersets rest after the pair; "every time they do a set, they do it correctly and they do it with effort". Seconds in the JSON: hypertrophy compound 60-180 (default 60-120), isolation 60-120, strength main lift 180-360, strength accessory 120-180, Olympic 120-180, superset round 60-120. Plyo work:rest 1:5-1:10, depth jumps 5-10 s between reps and 2-3 min between sets (SCIENCE NSCA). SCIENCE: a small hypertrophy benefit from resting more than 60 s, little beyond ~90 s (Singer et al. 2024).

**Same rules at every level (COACH-ANSWER PRG-06):** the UL upper-day rise 3 × 8 → 3 × 10 → 4 × 12 by level was "probably a fill error"; the generator applies the same compound rule on upper and lower days at every level.

### 9.10 Session caps by population

> **Changed in v1.3** (COACH-R4 R4-SES-02, R4-SES-05; COACH-CT CT-01). Read the "Session length" column as a typical length, not a limit; the exercise counts are those of section V2 (aesthetics 6-8, general 5-7, strength 5-6, bootcamp 5-7 stations, athletes up to 12, older adults 5-6); a full-body day is his A or B day, not "2-4 exercises per group (7-10 in all)". Where the text below differs, the v1.3 section at the top of this file wins.

| Population | Session length | Exercises | Order inside the session | Default sets | Tag |
|---|---|---|---|---|---|
| Aesthetics / bodybuilding / powerlifting | ~90 min (max 120) | 5-7 resistance on average; 8-9 in a 75-90-min session (VOL-08); full-body days 2-4 exercises per FOCUS group (COACH-R2 SES-05; COACH-R3 SES-01) | warm-up → light core opener (2 × 2, short of failure; COACH-R2 SES-03) → main lift ('the work') → accessories → small muscles last (bonus exercise if more volume is needed); calves one exercise × 3 sets each leg day; Focus muscle first; same-pattern pairing allowed (squat + lunge) to drive one muscle harder | 3 compound / 2 isolation / 3 calves | COACH-ANSWER VOL-08, VOL-16, VOL-17, UNI-09, UNI-06, ATH-11, ORD-02, ORD-04, ORD-08 |
| General fitness / weight loss / "stay athletic and active" | 45-60 min; full-body days 55-85; a shorter chosen length → the time-vs-minimums policy (COACH-R3 SES-02) | 5-7 on split days; full-body days 2-4 exercises per FOCUS group (7-10 in all); stay-active: hardest gym day ≥ 48 h before the biggest play day (COACH-R3 ATH-05) | light core opener first; hip dominant + push and knee dominant + pull pairs; heavy squat and heavy deadlift on two different days | 3 / 2 | COACH-ANSWER UNI-09, UNI-11, ORD-06, ATH-11; COACH-R2 SES-01, SES-05 |
| Bootcamp | 35-45 min | 5-7 stations, 3-5 rounds × 30-50 s | core first; cross-pattern pairing (less soreness); hip dominant + push, knee dominant + pull | time-based | COACH-ANSWER PRG-03, UNI-06, ORD-06, ATH-11 |
| Field/court athlete, off-season | ~90 min (max 120) | up to 12 + the 2-exercise core block (COACH-R2 SES-04); 2-4 exercises per group trained that day; cross pattern by default = 2 jump / throw stations + 1 Olympic lift; same-pattern template for size-focused / high-level athletes = 3-4 jump stations + 1 Olympic lift (COACH-R3 SES-01) | core (2) → plyo/ballistic → Olympic/power → strength → resistance accessories | **2 per slot** | COACH-ANSWER VOL-08, VOL-16, VOL-17, ORD-03, ATH-11; COACH-R3 SES-01 |
| Athlete pre-season / in-season | shorter; in-season 2 days/week | fewer | in-season: sprints for speed athletes, strength maintenance or jumps for others | 2 | COACH-ANSWER PER-08; minutes PROPOSED |
| Weekend-warrior athletic (non-competitive adults and youth) | 60-90 min (PROPOSED) | ~10 (OBSERVED 'JUSTICE LEAGUE' Monday: 10 slots) | core (~2) → athletic block → resistance | 2 per slot (OBSERVED) | COACH-ANSWER ATH-13, VOL-16, ATH-11 |
| Optional day | separate day ideally, or added on | 5 slots: 'Calves', 'Cardio', 'Core', 'Focus 1', 'Focus 2' | - | Focus 2-3 sets each | COACH-ANSWER ORD-10, ORD-11 |
| Swimmers (dryland) | around pool training | 3 dryland gym days + 1 optional (2 for younger / lower-level swimmers); shoulder care every session (external rotation, floor Y/T raises, KB face pulls; never bands); Olympic lifts 2-3 days | core → jumps (mostly ballistic) → Olympic → strength | 2 per slot | COACH-R3 ATH-01 |
| HYROX | 60-75 min | 2 strength days (squat + pull, deadlift + push) + 2 hybrid days (run intervals, or 1 km run + 1 station repeated); 2 short station circuits a week as finishers (never muscle sets) | core → strength → station circuit / run | 3 / 2 | COACH-R3 ATH-03 |

Core goes first by default, light (2 exercises × 2 sets short of failure), and the client may move it after the plyos or after the strength work (COACH-ANSWER ATH-11; COACH-R2 SES-03); coaches or users may add core supersets or monster sets anywhere (COACH-R2 SES-03). **Plan editing (COACH-R3 SES-02):** every day's blocks carry stable ids; the user or coach may switch off that day's athletic block or core block ("a pickleball player that played a lot of pickleball has a lot of soreness in their calves ... Then it could be turned off"), and add or remove exercises or whole blocks; athletic and core work never count as muscle sets, so a toggle changes no weekly set number (12 §3.10.2). A warm-up is always written (5 min any cardio + A-drills or mobility) and never counts as volume (COACH-ANSWER ORD-08).

**Rules for every population (not only general clients).** On full-body and bootcamp days pair **hip dominant with push and knee dominant with pull** (lower posterior with upper anterior) so the work does not bleed over (COACH-ANSWER UNI-11, ORD-06; the Bootcamp Option 1 Tue/Fri wiring was a mistake). **Heavy squat and heavy deadlift on two different days**, with a non-axial hinge, leg press or belt squat on the other days (COACH-R2 SES-01, RIGHT; his PER-04 words: "I don't want to always load the lower back and the spine twice per week"). **Axial (count):** barbell back, front, zercher, overhead and Smith squats; barbell or trap-bar deadlifts and RDLs; good mornings. **Not axial:** leg press, belt squat, hip thrust, back extension, reverse hyper, single-leg DB work, Olympic lifts, loaded jumps; goblet, hack and pendulum squats are fine on the second day if not sore; powerlifters may add a light technique squat or deadlift (COACH-R2 SES-02, RIGHT). A client already sore from axial loading moves to the belt squat (COACH-ANSWER PER-04, EQ-11). The full session rules live in `05_session_architecture`; they matter here because they limit which exercise a new set may go to (12 §3.9 step 6). **Pairing by goal** (COACH-ANSWER UNI-06): same pattern (squat + lunge) for aesthetics and high-level clients who need more stimulus on one muscle; cross pattern for bootcamp and general clients, so they are less sore and can train more often.

**RETIRED in v1.3 as a capacity rule (COACH-CT CT-01): the numbers below only feed the printed time estimate.** v1.2 text: **What fits in the time (12 §3.10, PROPOSED time model, v1.1 with a 1-minute changeover per exercise and the core opener):** 45 min ≈ 5 exercises / 11 sets, 60 ≈ 7 / 17, 75 ≈ 8 / 23, 90 ≈ 9-10 / 29 (check: his AESTHETICS Day 1, 7 exercises and 19 sets without a core block, comes out at about 59 minutes). A unilateral set costs 1.5 × a bilateral set (COACH-ANSWER UNI-09 "has to be accounted for"); supersets add 25-35 %. **Full-body days with 2-4 exercises per group (COACH-R2 SES-05)** therefore run longer: a 4-day L1 full body needs about 85 minutes at its peak week with supersets (12 §5.1). **When the chosen time cannot hold the minimums, the time-vs-minimums policy applies (COACH-R3 SES-02, 12 §3.10.1):** the plan says so up front and offers another day or the length that fits; if the user keeps the time, fewer groups are trained directly (big movers kept; arms, calves and shoulder isolation from compound credit), supersets are recommended and the stairway climbs on every trained group. 12 §5.1 (4 × 60: triceps and calves from compound credit) and §5.5 (a pickleball player who keeps 2 × 45: hips and the pinned calves trained directly) show it.

**Supersets (COACH-ANSWER ORD-05, PARTLY): a fatigue and density tool**, used when time is short, for advanced clients who need more stimulus, for off-season athletes' VO2 max and mitochondrial work, and for beginners who do not fatigue on their own ("a tool to use to fatigue the heart more and compress the time"). The superset pairs follow the pairing rule (lower posterior with upper anterior, knee dominant with pull). **v1.2:** the plan recommends a superset for every eligible pair ("Recommend doing supersets so that it's a faster workout", COACH-R3 SES-02), marked "needed" when the day only fits with it.

**Retired (v0):** the minutes-by-level table (30-90 min × L1-L4); its minute rows were INFERRED and the coach gave lengths by population instead (COACH-ANSWER UNI-09).

### 9.11 Sport profiles: the athletic dial

**The coach's rules:**
- **Plyo vs ballistic is set by the sport's fast, bouncy contact demand** (approved shares in the table below, COACH-R2 ATH-01; ballistic = squat, box, broad, loaded or hex-bar jumps, medball throws; plyometric = pogo/ankle hops, hurdle hops, depth jumps, bounds, squirrel and repeated jumps, ATH-02): "the more time on the ground ... like a karate athlete, the more ballistics and less plyos. The less time on the ground, like a sprinter, the more plyos and less ballistics" (COACH-ANSWER ATH-01). Basketball "a good mix"; baseball "doesn't need a lot of plyos. They need more ballistics and rotational forces ... Sprinting is going to be there" (ATH-01).
- **Sport ranking for jump volume (COACH-ANSWER ATH-02, RIGHT):** basketball ≈ volleyball > sprinters > football skill positions > soccer > MMA > tennis > baseball > hockey > wrestling/BJJ > boxing ≈ karate > golf.
- **Programs start more ballistic and become more plyometric**: each block starts 15 points more ballistic than its end-of-block share (COACH-R2 ATH-01); Receive-Create stages 1 Land → 2 Land & Go → 3 Repeat (COACH-R2 ATH-03); unilateral plyos are harder than bilateral (COACH-ANSWER CAT-10, CAT-11).
- **Everyone in athletic training gets Olympic lifts**: beginners DB/KB snatches, hex-bar jumps, hang pulls and hang cleans; intermediate+ the full lifts (COACH-ANSWER ATH-10); **up to 4 × a week, cleans on squat days and snatches on hinge days** (COACH-R2 ATH-04). Youth from the floor from about 14, after one block of hang work (COACH-R2 ATH-08).
- **Resistance emphasis:** more strength/size for football linemen, wrestlers, rugby, heavyweight fighters, throwers; more speed/power for sprinters, basketball, skill positions, volleyball (COACH-ANSWER ATH-03). Bilateral:unilateral share: his rules in §9.3 (field/COD athletes 80-90 % unilateral, in-season bilateral minimal, contralateral into the hip for COD athletes, ipsilateral out of the hip for acceleration); numbers by profile in 12 §3.11 (COACH-ANSWER UNI-02, UNI-10, CAT-13).
- **Medball throws:** high for baseball, boxing, MMA, tennis and golf (rotational), moderate for basketball and football, none for aesthetics/bodybuilders except warm-up (COACH-ANSWER ATH-05); medballs ≤ 20 lb (EQ-06).
- **Change of direction** drills (the football route names, tiered by turn angle) are for every athlete (COACH-ANSWER ATH-06).
- **Boxers/strikers:** reduce pressing and arm volume when punching volume is high, never cut it out (COACH-ANSWER ATH-04). **Pitchers:** less overhead pressing, more arm care, rotational throws kept light (ATH-08). **Older adults (60+):** on by default - landing drills (step down and stick, no bounce), balance, quick stepping without a hop, light medball throws, fast machine work; off by default - low ankle hops, other jumps, Olympic lifts, depth jumps, available only with the warning "Make sure that you have a fitness professional to help you understand what this means"; overhead and low-bar squats stay out (COACH-R2 ATH-08; COACH-R3 ATH-02, RIGHT). **Pickleball, padel and tennis players 50+:** knee-friendly strength, calf and Achilles work every leg day, rotator-cuff work, only low-impact jumps (no depth jumps, hurdle hops or bounds) unless switched on (COACH-R3 ATH-02).
- **Seasons:** off-season most volume (strength + plyos); pre-season a 4-6-week block at about 60 % of off-season sets with more speed and power, then a 1-2-week taper (COACH-R2 PER-06); in-season 2 days/week, low volume, sprints for speed athletes and strength maintenance or jumps for others (COACH-ANSWER PER-08); **game-heavy sports in season** (basketball, volleyball, soccer, football, hockey; R3-ATH-04 adds lacrosse, field hockey, rugby, ultimate, flag football, beach volleyball): gym plyos about half, no extra change of direction, sprints only for speed athletes, the one hard gym day at least 48 h before a game (COACH-R2 ATH-07); post-season recovery.

**Weekly targets at L2 (PROPOSED - PENDING COACH APPROVAL).** He gave the rule and the ranking but no numbers (ATH-01). Plyo contacts are fast-SSC contacts (short ground contact) at the **end** of an off-season block; the block starts at about 30-40 % of that (RC1 landings, more ballistic), as in 12's tennis example (40 → 140 contacts/week, 12 §5.3). Ranges follow his ranking, stay inside the NSCA per-session caps (9.7) over 2-3 plyo days, and scale L1 × 0.7, L3 × 1.2. In-season: about half (COACH-R2 ATH-07 for game-heavy sports). **v1.1:** the plyo-share column now holds his approved end-of-block shares with the start 15 points lower (COACH-R2 ATH-01), counted over jump and throw work; the contact, throw, cut and Olympic columns are still PROPOSED and were not re-derived for the new shares; the per-sport profiles for every US sport (04 v1.1, being rebuilt) carry the full numbers.

| ATH-02 rank | Sport profile | Plyo share (12 §3.13) | Plyo contacts/week, block end | Throws/week | Cuts/week | Sprint / buy-out | Olympic sets/week | Resistance emphasis |
|---|---|---|---|---|---|---|---|---|
| 1 | Basketball / volleyball | basketball 35 → 50 %; volleyball 45 → 60 % | 180-240 | 60-120 | 60-100 | accelerations 6-10 × 10-20 m, 2×/wk | 6-8 | legs high, upper moderate; COD → unilateral 80-90 % |
| 2 | Sprinters / jumpers | 60 → 75 % | 160-220 | 30-60 | 0-20 | speed sessions: squirrel jumps → MACH drills / acceleration starts → max velocity (OBSERVED Sheet23 order, LIB-21) | 6-8 | ipsilateral step-ups for acceleration (CAT-13) |
| 3 | Football skill positions | 45 → 60 % | 140-180 | 64-120 | 48-80 (OBSERVED BYOP 48-64) | 3-5 bouts 10-30 s | 8 (OBSERVED 4 slots × 2) | legs high, upper low-moderate |
| 4 | Soccer | 45 → 60 % | 130-170 | 64-100 | 48-80 | 3-5 bouts 10-30 s | 6-8 | legs high, upper low |
| 5 | MMA | 25 → 40 % | 110-150 | 200-400 rotational | 20-40 lateral | 20/40 sprints 5-8 rounds + lactate clearance | 6-9 | legs moderate-high, upper moderate |
| 6 | Tennis / racket | 35 → 50 % | 100-140 | 120-200 rotational | 60-100 lateral | short repeated sprints (PROPOSED) | 6-9 | unilateral 80-90 %, contralateral loading, frontal-plane work (UNI-12) |
| 7 | Baseball / softball | 25 → 40 % | 60-100 | 150-250 rotational, R/L pairs | 10-30 (base running) | 3-5 buy-outs 10-39 s ('SPEED POWER', OBSERVED) | 6-16 every block (OBSERVED optional piece 16/wk pre-season) | glutes/hams high, chest low, DB pressing; pitchers less overhead |
| 8 | Hockey | 25 → 40 % | 55-90 | 80-150 | 40-60 | 3-5 bouts | 6-8 | legs high |
| - | Football linemen / strength-type (ATH-03) | 25 → 40 % (linemen) | 50-80 | 60-100 | 20-40 | short bouts | 8-9 | resistance high, bilateral-leaning |
| 9 | Wrestling / BJJ | 10 → 25 % | 45-80 | 100-200 | 20-40 | 20/40 rounds | 6-9 | resistance high |
| 10 | Boxing / karate / kickboxing | 10 → 25 % | 40-70 high-amplitude (jump rope and ankle bouncing are conditioning, not counted) | 190-380 rotational (OBSERVED boxer) | 0-20 | 20/40 sprints 5 → 8 rounds (OBSERVED) | 6-9 (pulls, hang clean & press) | legs high; pressing/arms × 0.5-0.7 in high-punching weeks |
| 11 | Golf | 10 → 25 % | 0-30 | 100-160 rotational | 0 | - | 2-4 | rotational core, hips |
| - | CrossFit | (HYBRID, OBSERVED) | 36-80 | 0-60 | 0 | per macro level | 6-24 by level | balanced |
| - | Weekend-warrior athletic | 35 → 50 % | 60-100 | 40-80 | 20-40 | 3-5 bouts | 4-8 (L1 variants) | balanced, cross-pattern |
| - | Older adults (60+) | jumps off by default; landing drills, balance and quick stepping on (COACH-R3 ATH-02) | landings (no bounce) by default; if switched on: 0-30 low-amplitude (low ankle hops); never depth jumps (EQ-03) | light medball throws (on by default) | 0 | - | none by default; if switched on: DB/KB cleans, hang pulls, hex-bar jumps; never snatch variants (EQ-03; COACH-R2 ATH-08; COACH-R3 ATH-02) | constrained machines; fast machine work on |
| - | "Stay athletic and active" (recreational pickleball, padel, tennis, rec leagues ...) | the activity's share (pickleball / padel 50 %, golf 25 %, running 75 %, rec soccer 60 %, 'a bit of everything' 50 %; COACH-R3 ATH-04) | from the 04 profile; weeks with 3+ play sessions: no extra agility drills, half the jumps (COACH-R3 ATH-05) | from the 04 profile | from the 04 profile | from the 04 profile | L1 variants if any | general-fitness dose (0.8, floor 10); hardest gym day ≥ 48 h before the biggest play day (COACH-R3 ATH-05) |
| - | HYROX | 50 % (COACH-R3 ATH-03) | from the 04 profile | wall balls with the race ball, ≤ 20 lb | 0 | run intervals / 1 km + station on 2 hybrid days; 2 station circuits a week as finishers (never muscle sets) | L1 variants if any | 2 strength days (squat + pull, deadlift + push); general-fitness dose (COACH-R3 ATH-03) |
| - | Swimmers (dryland) | 25 % at block end (mostly ballistic: starts and turns are single big efforts; COACH-R3 ATH-01) | low (slow block and wall push-offs) | overhead and rotational | 0 | - | 2-3 days | shoulder care every session (no bands); 0 extra cardio; dryland taper with the swim taper |
| - | Aesthetics / bodybuilding / fat loss / general | no plyo block (A-drills primer 2-4 × 8-12 per leg on lower days, OBSERVED UL/PPL, warm-up) | 0 | 0 (medball warm-up only) | 0 | conditioning only | 0 | per goal |

**Other US sports (coach request 2026-10-08; placed by the coach in round 3).** The table above keeps the sports he ranked. The remaining sports use his approved R3-ATH-04 shares at block end (start 15 points lower): **75 %** runners; **60 %** lacrosse, field hockey, flag football, ultimate cutters, rugby sevens, high jump, pole vault, gymnastics, cheer flyers; **50 %** beach volleyball, pickleball, padel, rugby backs, goalkeepers, javelin, HYROX; **40 %** rugby forwards, cheer bases, throwers, diving, alpine skiing, cycling; **25 %** swimming, water polo, rowing, judo, taekwondo, climbing (COACH-R3 ATH-04, RIGHT; swimming 25 % also COACH-R3 ATH-01, replacing v1.1's INFERRED class-4 40 %). Their contacts, throws, cuts and Olympic sets are PROPOSED in the 04 profiles; off-season cardio 2-4 like his list, 0 extra for swimmers, runners, rowers and endurance cyclists (COACH-R3 ATH-04); their resistance volume follows 12 (starts, floor of 10 on groups, stairway).

What changed from v0: v0 put baseball (120-180 high-intensity contacts) above MMA (80-140), against his ranking; baseball's Olympic work was "optional, pre-season only", against ATH-10; boxing pressing was "near zero after base", against ATH-04; tennis and golf had no row. OBSERVED anchors are unchanged (section 6): baseball's 116-324 lower-body jump contacts per week are mostly ballistic or jump-limited items under the ATH-01 rule.

**Plyo progression inside a block (Receive-Create stages; COACH-R2 ATH-03, RIGHT; COACH-ANSWER CAT-10, CAT-11):** stage 1 Land (receive and pause: stick-the-landing, 3 s holds) → stage 2 Land & Go (receive then create: stick then jump or hop) → stage 3 Repeat (repeated receive/create: hops, rebounds) for sports that need them, low-amplitude reactive work for long-ground-time sports. 12-week plan: weeks 1-3 / 4-7 / 8-12; 8-week plan: weeks 1-2 / 3-5 / 6-8; restart at stage 1 each off-season; stay put in maintenance blocks; intermediate and advanced athletes may start at stage 2. Bilateral before unilateral inside each stage; unloaded before loaded (loaded jumps 10-20 % of body weight, EQ-15); box and hurdle heights low 6-12 in, medium 12-18 in, high above hip; hurdles 6 in moderate, 12+ in advanced (EQ-16). **No reverse-banded or banded jumps** (COACH-ANSWER EQ-01, EQ-12).

**Athletic sets and muscle volume:** athletic sets never count toward muscle sets (COACH-ANSWER VOL-10). Ankle hops in a 'calfs' slot count as contacts (OBSERVED: 16 of the 42 calf-labelled slots in 'BASEBALL', about 40 %, hold ankle hops); calves still get their 3 resistance sets each leg day (COACH-ANSWER VOL-17).

### 9.12 Conditioning rules

> **Changed in v1.3** (COACH-R4 R4-LIB-02). Carries and sled work are dosed by distance or time (2-4 trips of 20-40 m or 20-40 s) and count no muscle sets (section V5). Where the text below differs, the v1.3 section at the top of this file wins.

| Population | Aerobic sessions/week | Content | Tag |
|---|---|---|---|
| General fitness, fat loss | **3** | one of each colour (Blue A, Green B, Orange C) per week, as the cheat sheet says | COACH-ANSWER ATH-07; OBSERVED cheat sheet A5 |
| Aesthetics / bodybuilders | **4** + optional 20-30-min easy walks after workouts (extra, not counted) | Orange (C), Green (B), Blue (A) + a second Orange (long, low) | COACH-ANSWER ATH-07; COACH-R2 SES-06 (RIGHT) |
| Athletes, in-season | **2** | plus speed work: sprints for speed athletes (PER-08) | COACH-ANSWER ATH-07, PER-08 |
| Athletes, off-season | by sport: baseball, softball, sprinters **2**; basketball, volleyball, football, tennis, golf, boxing, BJJ **3**; soccer, hockey, kickboxing, karate **3-4**; MMA, wrestling **4**; the remaining sports 2-4 like this list; **0 extra for swimmers, runners, rowers and endurance cyclists** (their practice is the cardio); VO2 max / mitochondrial work also through supersets (ORD-05) | baseball and boxing OBSERVED as anchors (section 7.2) | COACH-R2 ATH-06 (RIGHT); COACH-R3 ATH-01, ATH-04 |
| Athletes, pre-season | **2** | - | COACH-R2 ATH-06 |
| Strength / powerlifting | **2** easy (Orange) | - | COACH-R2 ATH-06 |
| Fighters | the daily opening cardio is a real aerobic block (Orange/easy) | OBSERVED boxer | COACH-ANSWER ORD-09 |
| Fat-loss circuits | finisher after lifting, not a separate session; rounds 3 → 5, work 30 → 50 s (OBSERVED) | - | COACH-ANSWER PRG-11 |
| Bootcamp | the circuit is the session (9.10) | - | COACH-ANSWER PRG-03 |
| Endurance event | Sheet24 'HALF MARATHON PROGRAM by CHRIS HINSHAW ' used as is, half marathon only | - | COACH-ANSWER PRG-12 |
| HYROX | **4** (Blue, Green, Orange + a second Orange: running is about half the race) + 2 short station circuits as finishers | - | COACH-R3 ATH-03 (RIGHT) |
| "Stay athletic and active" | 3, and a 45-60+ min session of their activity counts as one of them (up to 2) | - | COACH-R3 ATH-05 (RIGHT) |

- **Every count is adjustable (COACH-R2 SES-06):** "You can always say, 'I need more cardio,' and then it just adds it to the program. Where I need less cardio, it takes away from the program."
- **Equipment and tracking (COACH-ANSWER EQ-14):** the Blue/Green/Orange work runs on any tool (run, bike, rower, ski erg); track by calories, time or distance ("I wouldn't completely throw away distance"); "doing the block is the important part, and being able to track it and see any changes week to week".
- **Level unlock** (OBSERVED 'LVL 1 = C', 'LVL 2 = C, B', 'LVL 3 = C,B, A', 'LVL 4 = LACTATE CLERANCE') stays the PROPOSED default; with L4 retired, lactate clearance is unlocked at L3 for competitors. The 4th aesthetics session is a second Orange (COACH-R2 SES-06); whether the unlock still applies when a beginner needs 3 sessions stays open (§11).
- **Progression** (OBSERVED in the level grid): beginner → intermediate adds volume/density at moderate pace (green 5 → 7 sets; orange ~20-24 → ~30-33 min); intermediate → advanced raises pace (FAST/FASTEST/SPRINT) and drops volume ('4-6', '3-5', '2-4' sets). Running warm-up before every run (OBSERVED cheat sheet 'RUNNING WARMUP').
- **Placement:** steady cardio ≤ 40 min (OBSERVED 'max 40 min of steady'), on non-lifting days or after lifting; long walks after workouts for aesthetics clients (ATH-07). SCIENCE: interference with strength and hypertrophy grows with endurance frequency and duration (Wilson et al. 2012).

### 9.13 Feedback loop: RETIRED in v1.2 (the printed self-adjust guide)

**Retired by COACH-R3 VOL-02 (RIGHT: "I want to take away all check-in info. We're only doing outputs, and people can change accordingly"), VOL-04 ("I want them to be able to kick out a program, and that's it ... the program will tell you to adjust accordingly") and GEN-01 ("I don't want any data kept").** v1.1's optional weekly check-in and everything read from it are gone: the step table (effort 1-6 → +2 points, 7-8 → the planned step, 9 → hold, any 10 → hold and -1 set that day, 'Failed' → hold and -1 set, under half the sessions → repeat the week), the 'Felt the RIGHT / WRONG muscle', 'Felt a PAIN' and "Couldn't do it" readings as inputs, the two-week hold gate and its block-at-risk prompt, the 'WEIGHT USED or SCORE' e1RM display and the week-by-week mode (COACH-R2 VOL-01, VOL-02, VOL-03, GEN-01 are superseded on these points). The plan is built once on its planned stairway (9.6) and shown ahead of time; nothing adapts and nothing is stored.

**What replaces it: the printed self-adjust guide** (wording PROPOSED, EN / ES; the same five lines as 12 §3.7.3):

| Situation | What the plan tells the user | Tag |
|---|---|---|
| Missed most of a week | repeat that week before moving on | COACH-R3 VOL-04 ("adjust accordingly"); wording PROPOSED |
| A set felt like a true max (no rep left) | next time take one set off that exercise, or a little weight | COACH-R2 VOL-02 (what a 10 means); wording PROPOSED |
| Everything feels easy | add weight or reps first; never jump ahead more than one week | COACH-ANSWER VOL-04; wording PROPOSED |
| Something hurts | the listed swap, then cut the sets by a third to a half, then drop the exercise (9.5) | COACH-ANSWER UNI-08, VOL-03 |
| Feels the wrong muscle / can't do it | change one small variable in the same category / use the easier or assisted version; the sets stay | COACH-ANSWER GEN-05, PER-02 |
| Life got in the way for several weeks, or several things hurt | stop the block, take the recommended easy week or a maintenance phase, build a new block | COACH-R2 VOL-07; COACH-R3 PER-01 |

The BYOP logbook columns (EFFORT, 'WEIGHT USED or SCORE', the feel answers) may still be printed for the user's own notes (OBSERVED in his sheets); the generator never reads them back.

**No lifestyle questions:** sleep, stress, energy and "how was life" are not asked ("I just need the workouts here", COACH-R2 GEN-04); with no check-in the v1.1 life-column resolution is moot (tension 26 closed).

---

## 10. Tensions and flags (status after the coach's answers)

| # | Tension | Status (v1.1) |
|---|---|---|
| 1 | '(1 RIR) *RPE8+' pairs an exact RIR with a looser RPE floor; EFFORT '8 - That was perfect' and '1-3 RIR aka RPE 7+' point to 2 RIR | **Resolved** (COACH-ANSWER VOL-13): RIR is his scale, 1-3 RIR on every working set; RPE is shown only as an explanation (9.9). |
| 2 | 'never work up to failure' vs 'MAX REPS'/'ALL' on isolation | **Resolved** (VOL-13): MAX = technical failure, only on small-muscle or bodyweight work. |
| 3 | Olympic percentages exceed Prilepin's chart (4 × 8 @75 % ... 4 × 4 @90 %); STRENGTH-12 6 × 3 @90 % and 7 × 2 @RPE 10 too | **Resolved** (COACH-R2 ATH-05, GEN-06): the % is of that lift's own 1-rep max; athletes who have not tested it go by RPE/RIR, and the plan explains Olympic lifts as power output; full squat cleans and snatches use 3-5 reps with the same weekly reps while DB/KB and pull variants keep his ramp; % programming belongs to competitive Olympic lifters (their own programming). Whether STRENGTH-12's % applies to every set stays open (§11.2). |
| 4 | Upper-body volume below the 10-set threshold in most templates and all athletic programs | **Resolved by rule.** Athletes are low on purpose (UNI-02); aesthetics clients now start at 15 per big muscle (L2, VOL-01) and the imbalance is balanced unless a bias is chosen (VOL-18). |
| 5 | Glutes credited above RP's MRV (26-35) in peak weeks | **Retired.** Artefact of the v0 map; under the coach count no view reaches 15 (max 10.75 since every compound gives glutes 0.25, COACH-R2 VOL-05). New concern: glutes under-served without direct work (3.5 point 2). |
| 6 | Calves, rear delts and abs near zero | **Resolved** (VOL-17): not intended; calves 3 sets each leg day, rear delts own sets, ~2 core exercises (v1.2: one calf exercise per leg day; a rear-delt exercise every week inside the shoulders line, COACH-R3 SES-01, VOL-01). |
| 7 | 40-rep isolation sets (fat burn) outside his 5-30 | **Resolved** (VOL-11): not a default; optional AMRAP/CrossFit style only. |
| 8 | 3/5/7 % never written; observed progression is whole-set steps; 8-week products ramp 10-16 %/week | **Resolved** (VOL-04, VOL-05, UNI-05, PER-10): a % of weekly sets per muscle, one rule per person (v1.1: the stairway, COACH-R2 PER-03, PER-04, VOL-01; v1.2: approved, computed once, no check-in, COACH-R3 VOL-04, VOL-02; v1.3: the planned final sets are reached and the 10 % ceiling is retired, COACH-CX CX-01, COACH-R4 R4-PRG-02), smooth for hypertrophy/general, steps for fight/competition prep; his faster 8-week ramps stay as evidence only. |
| 9 | 2 aerobic slots in templates vs 3 in the cheat sheet | **Resolved** (ATH-07; COACH-R2 SES-06, ATH-06): 3 general/fat loss, 4 aesthetics (the 4th a second Orange) + optional walks, 2 athletes in season, 2-4 off-season by sport; every count adjustable by the user. |
| 10 | UL upper-day reps rise with level | **Resolved** (PRG-06): fill error; same rep rules at every level. |
| 11 | Plyo contacts per session at or below NSCA beginner ranges | **Mostly resolved** (COACH-R2 ATH-01): plyo shares by sport approved; contacts, throws and cuts per week still PROPOSED (9.11), inside NSCA caps. |
| 12 | "Boxers need fewer plyos" not visible as fewer contacts; it shows as lower amplitude | **Resolved** (ATH-01): more ground time → more ballistics, fewer plyos; jump rope and ankle bouncing are conditioning. |
| 13 | RP landmarks are direct sets; the coach's totals are fractional | **Updated** (VOL-09): his count is helpers 0.25; RP and Pelland comparisons in 12 §2.2-2.3; the engine steers on the coach count and may show the Pelland count beside it - nothing is stored (v1.2, COACH-R3 GEN-01; v1.1 said "both counts stored"). |
| 14 | Pat Davidson: no dosing numbers found | **Updated** (CAT-04, CAT-10): his Davidson link is the zones (rotation biases; level by load position), which shape exercise level, not dose; zones do not apply to plyos. Still no Davidson dosing numbers. |
| 15 | Smoothing vs steps | **Resolved** (PER-10). |
| 16 | Written deloads (0.75-1.0 × week 1) shallower than textbook deloads | **Resolved** (PER-05; COACH-R2 VOL-07): about half of the hardest week, only between blocks, never mid-block; the written shapes stay as evidence. |
| 17 | **New:** GEN-05 (adjust from logs, RIGHT) vs GEN-03 ("they should be tracking it themselves") | **Resolved** (COACH-R2 GEN-01; v1.2 COACH-R3 VOL-02, VOL-04, GEN-01): no check-in, no tracking, nothing stored; the plan is an output and people adjust it themselves. |
| 18 | **New:** athletic templates 2 sets per slot (VOL-16) vs 12's 3 / 2 / 3 defaults everywhere | Resolved here for the coach (v1 section, conflict 1); adopted by 12 v1.1. |
| 19 | **New:** max ~12 exercises (VOL-08) vs "12 to 14" (VOL-17) for off-season field athletes | **Resolved** (COACH-R2 SES-04): up to 12 exercises plus the 2-exercise core block (14 listed). |
| 20 | **New:** no planned RIR ramp (VOL-13) vs 12's "RIR toward 1" in the last weeks | **Resolved** (COACH-R3 VOL-04, RIGHT): the drift 3 RIR → 2 → 1-2 → 1 RIR + intensifiers in the last week, always inside 1-3 RIR, is his rule. |
| 21 | **New:** observed boxer weeks 3-8 cut chest work to 0 vs "don't completely cut it" (ATH-04) | Generator reduces (× 0.5-0.7), never zero. |
| 22 | **New:** observed baseball in-season block has no Olympic lifts vs "everyone gets Olympic lifts" (ATH-10) with in-season maintenance (PER-08) | **Resolved** (COACH-R2 ATH-04): in season a light piece (2 × 3 hang power clean or DB snatch), dropped in heavy game weeks; his programming can run Olympic lifts up to 4 × a week. |
| 23 | **New:** the cardio list's '21.6 mile run' is "a marathon" to him (LIB-18), but a marathon is 26.2 miles; "don't know when/where we need that" | **Resolved** (COACH-R2 LIB-06): removed from plans and tests; the longest run stays the half-marathon plan. |
| 24 | **New:** the EFFORT menu read as raw RPE ('8 - That was perfect' = RPE 8, '9 - That was terrible' = RPE 9) vs his 1-3 RIR band and "leave 1 in the tank" (= RPE 9) (VOL-13). A client training at 1 RIR as told would log 9 and the GEN-05 loop would hold every week. | **Resolved, then moot** (COACH-R2 VOL-02; COACH-R3 VOL-02): nothing is logged back any more; the plan prints target RIR with RPE. |
| 25 | **New (v1 verification):** 12 §3.7 lets a coach or client hand-set the rate up to 10 % vs "10 % ... That's way too much" (UNI-05) | Coach wins: hand-set 0-7 %, weekly total below +10 %; adopted by 12 v1.1. **v1.3: both limits are retired** (COACH-CX CX-01; COACH-R4 R4-PRG-02); a coach edits sets directly (CX-04). |
| 26 | **New (v1.1):** R2-VOL-01 approved a step table with a "life was harder / better" column, but R2-GEN-04 rejects every lifestyle input | **Closed** (COACH-R3 VOL-02, RIGHT): the whole check-in is retired. |
| 27 | **New (v1.1):** rear delts' own sets 4 / 6 / 8 (COACH-R2 VOL-04) vs "I don't think anybody needs less than 10 sets a week per muscle" (VOL-06) | **Resolved** (COACH-R3 VOL-01, PARTLY): rear delts are part of one shoulders line; the floor of 10 counts on the shoulders group; users and coaches can add more rear delts. |
| 28 | **New (v1.1):** the floor of 10 (COACH-R2 VOL-06) vs field athletes' upper-body factor 0.5 ("don't need to get bigger and stronger that much", UNI-02) | Floor applied: chest and back 7.5 → 10 at L2 (12 §5.3); flagged. |
| 29 | **New (v1.1):** full-body days with 2-4 exercises per muscle group (COACH-R2 SES-05) vs 45-60-minute general sessions (UNI-09) | **Resolved** (COACH-R3 SES-02, RIGHT): the time-vs-minimums policy - tell up front + offer, fewer groups trained directly, supersets, stairway on the trained groups (12 §3.10.1). **v1.3: moot** - there is no time limit (CT-01) and a full-body day is his A or B day of about 6 exercises (R4-SES-05). |
| 30 | **New (v1.2):** shoulders as one line with group credit (COACH-R3 VOL-01) vs v1.1's separate side-delt line at 12 / 15 | An L2 bodybuilder gets about 3-4 direct side-delt sets a week (12 §5.2); V-taper bias or Focus = shoulders adds more; flagged for the coach. |
| 31 | **New (v1.2):** Focus muscles +1-3 (COACH-R3 SES-01) vs VOL-02's priority +4-6 with the others ≤ 3 % (COACH-R2 VOL-06) | Focus muscles are the intake path and do not slow the others (R3-VOL-04: every line climbs to its planned peak in the last week); the +4 / +6 push is an optional coach setting (INFERRED resolution, flagged). |
| 32 | **New (v1.2):** the coach's minimums (10 sets per group, 2-4 exercises per day, 3 calf sets per leg day, a climbing stairway) vs very short weeks (2 × 45 min) | The time policy keeps only what fits: one big group plus pinned calves at 2 × 45 (12 §5.5); the plan says so up front; flagged. |
| 33 | **New (v1.2 verification):** "about 3 % ... about 5 %" vs "each muscle ... reaches its ceiling exactly in the last week" (both in R3-VOL-04) when the ceiling is more than × G(N) above the start | 12 keeps the steps (λ ≤ 1) and treats the ceiling as a maximum: 12-week L2 / L3 shoulders and arms peak at 18 / 23 (ceilings 22 / 25); λ up to 1.4 (late steps up to 7 %) would reach them. Flagged (12 §3.7.1, §7 item 16). |

---

## 11. Open questions for the coach

### 11.1 The v0 questions and what his answers settled

| # | v0 question (short) | Status | Answer |
|---|---|---|---|
| 1 | 3 / 5 / 7 %: by muscle size? of what? | Answered | % of weekly sets per muscle (VOL-04); by the person, not the muscle (VOL-05, UNI-05); v1.1: the stairway (COACH-R2 PER-03, PER-04) |
| 2 | 15-20 sets: peak week or week 1? | Answered | Starting volume by level: 10-12 / 15-20 / 20+ (VOL-01); 20-25 = growth (UNI-01) |
| 3 | Do athletic sets count toward muscles? Ankle hops as calf sets? | Answered | No (VOL-10); ankle hops are contacts |
| 4 | 2 sets/slot athletic, 3 compound / 2 isolation physique? | Answered | Yes (VOL-16) |
| 5 | RIR target 1 or 2? | Answered | 1-3 RIR at all times, RIR primary, RPE explained (VOL-13) |
| 6 | 'MAX' / 'ALL' true failure, isolation only? | Answered | Technical failure, small-muscle or bodyweight only (VOL-13) |
| 7 | Baseball Olympic %: of what max? | Partly | Template confirmed (PER-09); % basis open (§11.2) |
| 8 | RIR / % on the last set or every set? | Open | §11.2 |
| 9 | Contacts per week by sport; amplitude or count? | Partly | Rule by ground-contact time and ranking (ATH-01, ATH-02); numbers PROPOSED (9.11) |
| 10 | Aerobic 2 or 3; colours by level? | Partly | 3 / 2 / 4 + walks (ATH-07); colour unlock open |
| 11 | 6-week plans? | Answered | 4-6 weeks = maintenance/transition at 50-70 % (PER-01); v1.1: a 4-6-week training block is also a short stairway, and maintenance length is chosen and extendable (COACH-R2 PER-03, PER-06) |
| 12 | Deload dose; planned or triggered? | Answered | About half the sets, lighter (PER-05); v1.1: half of the hardest week, only between blocks, never triggered mid-block (COACH-R2 VOL-07; the block-at-risk prompt replaced the v1 triggers, 12 §3.12; v1.2: that prompt is retired too, and the easy week is a recommendation, COACH-R3 VOL-02, PER-01) |
| 13 | Priority muscles: how many, how much, both Focus slots? | Answered | 1-2, +4-6, cap ~25-30 (VOL-02); both Focus slots may hit one muscle (ORD-11); v1.2: Focus muscle 1 / 2 +1-3 at intake, the +4-6 push an optional coach setting (COACH-R3 SES-01) |
| 14 | Pain: swap first, cut if it repeats? | Answered | Keep sets ideally, adjust (UNI-08); -30-50 %, machines, drop (VOL-03) |
| 15 | Minimum sets for calves, rear delts, abs? | Answered | Calves 3 per leg day, rear delts own sets, ~2 core exercises (VOL-17); v1.2: one calf exercise × 3 sets per leg day, rear delts inside the shoulders group (COACH-R3 SES-01, VOL-01) |
| 16 | 40 reps a fat-loss rule? | Answered | No; optional AMRAP/CrossFit style (VOL-11) |
| 17 | NOVICE below NEWBY? L1-L4? | Answered | Same thing; L1-L3 (PRG-05) |
| 18 | Athlete volume down with level? | Partly | "Depends on whatever is needed" (PRG-04); 12 uses phase factors |
| 19 | Rest 1-2 or 2-3 min? Supersets, complexes, plyos? | Answered | 1-2 min, up to 3; supersets after the pair; athletic as prescribed (VOL-14) |
| 20 | Typical session lengths? | Answered | ~1.5 h (max 2 h) athletes/bodybuilders/powerlifters; 45-60 min general (UNI-09) |
| 21 | Keep whole-set steps or smooth 3/5/7 %? | Answered | Smooth for hypertrophy/general, steps/waves for fight/competition (PER-10); 10 %/week too much (UNI-05) |

### 11.2 Still open from v0 (or PROPOSED in this file)

1. ~~What max are the Olympic percentages taken from?~~ **Answered (COACH-R2 ATH-05, GEN-06):** that lift's own 1-rep max; RPE/RIR when untested. Still open for STRENGTH-12's main lifts: training max or true 1RM?
2. In STRENGTH-12 and the squat strength menu, does the RIR or % apply to every set or only the last set?
3. The sport-dial numbers in 9.11 (plyo contacts, throws, cuts, Olympic sets per week by sport) - right order of magnitude?
4. Aerobic colours by level ('LVL 1 = C' ... 'LVL 3 = C, B, A'): keep the unlock?
5. The V-taper bias mechanism (9.4), the heavy-unilateral toggle (9.9), the pain rep-bracket shift (9.5). (In-season Olympic maintenance was answered by COACH-R2 ATH-04, tension 22.)
6. ~~LIB-10 and LIB-12~~ **Answered (COACH-R2):** KB face pulls are shoulder work (side/rear delts, traps) on pull or shoulder days (LIB-10, R2-LIB-04); bench push-ups in both versions, hands on the bench foundational and feet on the bench advanced (LIB-12, R2-LIB-05).
7. Everything listed in 12 §7 (v1.2).

### 11.3 New questions raised by the round-1 answers (status after round 2)

1. **[Answered: COACH-R2 SES-04, 12 + the 2-exercise core block]** **Exercise cap for off-season field athletes:** VOL-08 says "max maybe 12 different exercises"; VOL-17 lists 2 core + 2-4 plyo + 2-3 Olympic + 3-4 resistance (up to 13) and says "12 to 14 sets". Is the cap 12 or 14 exercises, and did "sets" mean exercises there?
2. **[Answered: COACH-R2 SES-05, 2-4 per muscle group, longer days]** **3-4 exercises per muscle group per day (VOL-07) on full-body days:** with 5-7 exercises per session (VOL-08), should a full-body day give each muscle 1-2 exercises, or should full-body days go past 7?
3. **[Partly answered: COACH-R2 SES-06, a second Orange; the beginner unlock stays open]** **Aerobic colours at 4 sessions:** aesthetics clients get 4 sessions (ATH-07) but there are only 3 colours and the cheat sheet says never the same colour twice in a week. Which colour repeats? And does 'LVL 1 = C only' still apply when a beginner fat-loss client needs 3 sessions?
4. **[Answered: COACH-R2 SES-06, extra, 20-30 min easy]** **Long walks after workouts:** how long, and do they count as aerobic sessions or come on top?
5. **[Answered: COACH-R2 ATH-06]** **Aerobic sessions for athletes off-season / pre-season and for strength/powerlifting clients** (ATH-07 named only in-season athletes): how many?
6. **[Answered: COACH-R2 VOL-07, half of the hardest week, between blocks only]** **Deload "about half the sets":** half of the current (peak) week or half of week 1? His written deloads land at 0.75-1.0 × week 1, which is closer to half of a peak week.
7. **[Open]** **Heavy unilateral option (UNI-04):** which reps (e.g. 4-6 per side) and which lifts?
8. **[Answered: COACH-R3 ATH-03 - HYROX confirmed; 40-rep / AMRAP sets only inside HYROX station circuits and CrossFit-style WODs; the fat-loss-finisher part stays open]** **40-rep sets (VOL-11):** only inside AMRAP/CrossFit-style workouts, or also as an optional fat-loss finisher? And did "high-raw athletes" mean HYROX athletes (our reading of the dictation), so a HYROX-style option should carry them too?
9. **[Open]** **Rotational core (VOL-17: "some athletes need a lot more rotational core"):** which sports get more than about 2 core exercises, and do extra core exercises count inside the 10-12 exercise cap?
10. **[Open]** **V-taper and other biases (VOL-18):** which muscles define the V-taper bias (side delts and lats up, chest held?), and should other biases exist (glutes, arms)?
11. **[Answered: COACH-R2 LIB-06, removed]** **'21.6 mile run' (LIB-18):** correct it to the marathon distance (26.2 miles), keep it as written, or drop it?
12. **[Answered: COACH-R2 VOL-02]** **EFFORT menu vs RIR (VOL-13, GEN-05):** "leave 1 in the tank" is RPE 9, but your EFFORT menu calls 9 'That was terrible', and the tool holds volume when a week's median is 9. Should clients rate EFFORT against the RIR each set asks for ('8 - That was perfect' = "I hit the RIR you gave me"), as PROPOSED in 9.9, or should the log ask for RIR directly?
13. **[Answered: COACH-R2 SES-01, two different days]** **Spinal loading (PER-04):** you squat once a week and said deadlifts load the spine too. Should the week have one axial squat and one axial deadlift on different days (our current reading, as in `05_session_architecture`), or should the squat and the deadlift share one day so the spine is loaded on one day only?
14. **[Answered: COACH-R2 VOL-05, 1.0 / 0.5 / 0.25]** **Thrusters (LIB-14 vs VOL-09):** you confirmed thrusters = 1.0 quads + 0.5 shoulders, and later set helpers to 0.25. Keep 0.5 shoulders for thrusters as an exception (like dips 0.5 / 0.5), or use 0.25?

### 11.4 New after round 2 (03-specific; the engine questions are in 12 §7)

1. **[Answered: COACH-R3 ATH-03 - 2 strength + 2 hybrid days, 4 cardio, 2 station circuits as finishers that are not muscle sets, wall balls ≤ 20 lb, 40-rep / AMRAP sets only inside the circuits, 50 % plyo]** **HYROX for gen pop:** should the "stay athletic and active" HYROX option carry the optional 40-rep / AMRAP sets and HYROX-style stations (sled push and pull, wall balls, farmers carries, sandbag lunges, ski / row / run), dosed by time or calories like his conditioning, or stay a resistance plan plus aerobic sessions? (follows VOL-11 and the 2026-10-08 request)
2. **Aerobic colours when the count is adjustable:** if a client adds a 5th or 6th aerobic session (R2-SES-06), which colours repeat (more Orange first?), and does the level unlock (LVL 1 = C only) still limit beginners?
3. **[Partly answered: COACH-R3 ATH-04 placed every remaining sport's plyo share; the weekly contact, throw and cut numbers per sport stay PROPOSED in the 04 profiles]** **Plyo contacts for the newly covered sports** (swimming, lacrosse, beach volleyball, pickleball and the rest of the US sport set) - one review pass by the coach?

### 11.5 New after round 3 (v1.2)

1. **Shoulders as one line:** with group credit an L2 bodybuilder gets about 3-4 direct side-delt sets a week (12 §5.2). Keep it (shoulders work counted together, as you said), or keep a minimum side-delt dose inside the shoulders line?
2. **Focus muscles:** +2 sets by default on the start and on the ceiling (you said 1-3); should the coach's old +4-6 priority push stay as a coach-only option?
3. **Very short weeks:** with your minimums, 2 × 45 minutes holds one big group (hips) plus the calf work (12 §5.5). Is that right, or should short weeks train the big movers once a week each at 10 sets?
4. **Rebuilding the next block:** since nothing is stored, may the plan ask "how many blocks did you finish in a row?" to apply your 5 % higher start and +1 ceiling?
5. **Ceiling vs step size (v1.2 verification, tension 33):** an intermediate's shoulders or arms start at 12 with a ceiling of 22; at about 3 % then 5 % a week they reach 18 in week 12. Keep the small steps and stop at 18, or make the late steps bigger (up to your 7 %) so they reach 22?

---

### 11.6 After round 4 (v1.3)

Round 4, CT-01 and CX-01..04 answered the questions that blocked the engine: ceiling vs step size (the final sets are reached), very short weeks (the 2-day rule), the next block, and session length (not an input). What is still open after v1.3 is listed in `BLAZE_CAMP_BRAIN.md` §0d.3 (the readings the coach should see) and in 12, section V7.

## 12. Sources

**Coach's answers (COACH-R3, COACH-R2, COACH-ANSWER).** `coach_answers_round3.md` (round 3, 2026-10-09; outranks rounds 1 and 2); `coach_answers_round2.md` (round 2, 2026-10-08; outranks round 1); `coach_answers_full.md` (138 of 140 questions answered, collected 2026-10-08; question IDs CAT, UNI, VOL, PER, ATH, ORD, EQ, GEN, LIB, PRG, FIX); `coach_answers.md` (his earlier chat statements).

**Volume engine (authoritative for weekly sets per muscle).** `12_volume_algorithm_v1.md` and `12_volume_algorithm_v1.json` (same folder, v1.2: the stairway §3.7, the time-vs-minimums policy §3.10.1, plan editing §3.10.2, the "20-30 sets" research §2.11 with Hackett 2013, Baz-Valle 2026 and Teixeira 2018), including its research section (§2) and sources (§8: Pelland 2026 efficiency tiers, Aube 2022, Barbalho 2020, Enes 2023/2024, Scarpelli 2022, Barsuhn 2024, Bickel 2011, Spiering 2021, Bell 2023, Rogerson 2024, Coleman 2024, Borde 2015, Fragala 2019, Liao 2022, Halperin 2022, Hickmott 2022, Gabbett 2016 / Impellizzeri 2021, Nielsen 2013, Helms 2016, Gentil 2015, Kassiano 2022, fast/slow SSC sources).

**Coach's sheets (OBSERVED).** Decode files: `analysis/programs/prog_byop_aesthetics.md/.volume.json`, `prog_byop_athletic.*`, `prog_byop_ppl_bootcamp.*`, `prog_mm_gym.*`, `prog_mm_athletic_boxing.*`, `prog_mm_baseball.*`, `prog_mm_crossfit_tracks.*`; `analysis/library/L4_dosing_vocab.json`, `L4_notes.md`; `analysis/reference/specialty_notes.md`, `sheet23_notes.md`; dumps `MASTER_MODEL/08_AEROBIC_CAPACITY_CHEAT_SHEET.txt`, `10_ALL_ABOUT_SQUATS.txt`, `14_NOT_DONE_ALL_ABOUT_BALLISTICS.txt`. Computation scripts (scratchpad): v0 `build_volume_compare.py`, `rep_dist.py`, `worked_example.py`; v1 `v1_03/recount.py` (coach-count recompute of all 61 views), `v1_03/tables.py` / `tables2.py` (section 3 tables), `v1_03/bank_example.py` (9.6 illustration), `v1_03/update_json.py` (JSON v1).

**SCIENCE.**
- RP Strength muscle guides (current versions, fetched 2026-10-07): [Chest](https://rpstrength.com/chest-training-tips-hypertrophy/), [Quads](https://rpstrength.com/quad-training-tips-hypertrophy/), [Hamstrings](https://rpstrength.com/expert-advice/hamstring-size-training-tips), [Glutes](https://rpstrength.com/glute-training-tips-hypertrophy/), [Biceps](https://rpstrength.com/bicep-training-tips-hypertrophy/), [Triceps](https://rpstrength.com/triceps-hypertrophy-training-tips/), [Front delts](https://rpstrength.com/front-delt-training-tips-hypertrophy/), [Rear delts](https://rpstrength.com/expert-advice/rear-delt-size-training-tips), [Calves](https://rpstrength.com/calves-training-tips-hypertrophy), [Abs](https://rpstrength.com/ab-training/), [Back](https://rpstrength.com/back-training-tips-hypertrophy/), [Volume landmarks](https://rpstrength.com/training-volume-landmarks-muscle-growth/), [In defense of set increases within the mesocycle](https://rpstrength.com/expert-advice/in-defense-of-set-increases-within-the-hypertrophy-mesocycle). Side-delt figures via a secondary summary ([mrpotato substack](https://mrpotato.substack.com/p/build-big-shoulders)).
- Schoenfeld, Ogborn, Krieger (2017) J Sports Sci 35(11): dose-response of weekly sets ([PDF](https://researchgate.net/profile/Brad-Schoenfeld/publication/305455324_Dose-response_relationship_between_weekly_resistance_training_volume_and_increases_in_muscle_mass_A_systematic_review_and_meta-analysis/links/59dc0269458515e9ab4527d6/Dose-response-relationship-between-weekly-resistance-training-volume-and-increases-in-muscle-mass-A-systematic-review-and-meta-analysis.pdf)).
- Schoenfeld et al. (2019) MSSE 51(1): 1/3/5 sets per exercise ([PubMed](https://pubmed.ncbi.nlm.nih.gov/30153194/)).
- Baz-Valle et al. (2022) J Hum Kinet: 12-20 weekly sets ([PMC](https://pmc.ncbi.nlm.nih.gov/articles/PMC8884877/)).
- Pelland, Remmert, Robinson, Hinson, Zourdos (2026) Sports Medicine 56(2): weekly volume and frequency meta-regressions ([preprint](https://sportrxiv.org/index.php/server/preprint/view/460)); Remmert et al. per-session preprint ([SportRxiv 537](https://sportrxiv.org/index.php/server/preprint/view/537)).
- Ralston et al. (2017) Sports Med: weekly sets and strength ([PMC](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC5684266/)).
- Schoenfeld et al. (2019) frequency meta-analysis ([summary](https://ro.ecu.edu.au/ecuworkspost2013/5665)).
- Schoenfeld, Grgic, Van Every, Plotkin (2021) Sports 9(2): repetition continuum ([PMC](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC7927075/)).
- Zourdos et al. (2016) JSCR: RIR-based RPE scale ([record](https://openrepository.aut.ac.nz/items/efef3b25-6701-4fb5-bb82-55fcd2a26027/full)).
- Robinson et al. (2023) proximity to failure dose-response; Refalo et al. (2024) failure vs RIR ([summary](https://biolayne.com/reps/issue-32/the-failure-factor-the-relationship-between-proximity-to-failure-and-strength-and-hypertrophy/)).
- Singer et al. (2024) Front Sports Act Living: inter-set rest ([PubMed](https://pubmed.ncbi.nlm.nih.gov/39205815/)).
- Rogerson, Bell et al. (2024) Sports Med Open: deloading practices ([PMC](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC10948666/)); Bell et al. (2023) deload Delphi consensus ([SHURA](https://shura.shu.ac.uk/32417/)).
- Spiering et al. (2021) JSCR: minimal maintenance dose ([PubMed](https://pubmed.ncbi.nlm.nih.gov/33629972/)).
- Prilepin's chart ([70sBig](https://70sbig.com/blog/2012/05/prilepins-chart/), [Torokhtiy](https://torokhtiy.com/blogs/guides/prilepins-chart)).
- NSCA plyometric volume guidance as summarised in a SUNY Cortland lecture ([page](https://web.cortland.edu/buckenmeyerp/plyometrics.htm)) and [PT Pioneer CSCS chapter 18](https://www.ptpioneer.com/personal-training/certifications/nsca-cscs/cscs-chapter-18/).
- de Villarreal et al. (2009) JSCR 23(2): plyometric variables ([PubMed](https://pubmed.ncbi.nlm.nih.gov/19197203/)).
- Ramirez-Campillo et al. (2023) Sports: plyometric training in combat sports ([PMC](https://pmc.ncbi.nlm.nih.gov/articles/PMC9965890/)); youth basketball plyometric volume ([record](https://zaguan.unizar.es/record/144751)).
- Grgic, Schoenfeld, Mikulic (2021) J Sport Health Sci 10(5):530-536: plyometric vs resistance training and hypertrophy ([PMC](https://pmc.ncbi.nlm.nih.gov/articles/PMC8500805)).
- Wilson et al. (2012) JSCR: concurrent training interference ([PEDro](https://search.pedro.org.au/search-results/record-detail/34457)).
- Seiler polarised training ([Fast Talk Labs](https://www.fasttalklabs.com/pathways/polarized-training/)).
- Pat Davidson public profile and program descriptions ([Escape Fitness](https://escapefitness.com/us/discover/unlocking-your-physical-potential-insights-from-dr-pat-davidson/) - search summary only, the page blocked direct fetching; [Self Made Podcast ep. 107](https://theselfmadepodcast.buzzsprout.com/1772275/11734865); [Ganbaru Method](https://ganbarumethod.com/pages/patdavidson)); no set/rep table verifiable.

---

## Verification log

The two v0 passes below refer to the v0 section contents (e.g. the v0 9.6 size-class rates and 9.8 deload factor); those rules are now retired as listed in the v1 section at the top. The v1 entry is last.

Adversarial fact-check, 2026-10-07. Every OBSERVED claim in sections 0-9 was checked against the raw dumps (`dumps/BYOP`, `dumps/MASTER_MODEL`), the raw xlsx files (openpyxl, read-only) and the decode files in `analysis/programs/`. The SCIENCE claims were checked against the sources (RP chest and glute pages, Remmert and Pelland preprints, Ramirez-Campillo 2023, NSCA contact tables, Grgic 2021). Nothing in Google Sheets was opened or changed. A backup of the JSON before the edits is in the session scratchpad (`03_volume_rules.before_verify.json`).

**Recomputed independently (python on the raw xlsx). These match the doc:**
1. AESTHETICS Day 1: 7 exercises, 19 sets, 275 reps at rep-range midpoints.
2. 'JUSTICE LEAGUE': the 11 filled SETS cells (F3:F13) are all 2. Monday has 10 slots and 20 sets, 204-256 reps (athletic 64-88, resistance 140-168).
3. MM UL sets per session (excluding the 5-min cardio) NOV 20/24, NEWBY 30/24, INT 32/27. MM PPL push/pull/legs NOV 16/18/20, NEWBY 18/20/30, INT 20/23/32. Weekly resistance UL 76/90/102, PPL 6-day 94/116/132.
4. FAT BURN: weekly sets 60/60/64/70, reps 781/822/924/1040, compound mean reps 11.0 -> 8.9 (6-8 share 27 % -> 70 %), isolation mean 19 -> 35, circuit work 12.0 / 18.7 / 21.3 / 33.3 min (24 -> 40 station-sets).
5. Medball cheat sheet: 19 throws, 210 reps. MM athletic MID: 400 throws/week.
6. Progression averages: STRENGTH-12 +5.22 %/week, AESTHETICS-12 +4.75 %, AESTHETICS-8 +16.5 %, HYBRID +10.4 %.
7. Section 3.3 band counts reproduce exactly from `program_views` (58 = 61 views minus the two BOOT2 'A only' views and one CrossFit view). The hypertrophy-family medians in 3.2 reproduce.
8. Prilepin values, the Zourdos RIR-RPE mapping, the RP chest and glute landmarks (re-fetched), the Remmert per-session PUOS (~11 fractional / ~2 direct), the Pelland 67-study fractional-counting result and the NSCA 80-100 / 100-120 / 120-140 contacts per session are all correct.

**Corrected (claim -> problem -> fix):**
1. Conjugate STRENGTH-8 plyo contacts were "54/wk". There is one plyo line a week (Thursday 3 x 6 'EASY'), so the count is **18/wk**. Fixed in 6.1, section 0 (per-session range is now 18-77) and the JSON.
2. MM athletic sets per exercise were "Starting 2-3, Mid 1-2". The sheet has Starting {1, 2, 3, 5} (A21 = 5) and Mid {1, 2, 3, 4, '2 to 4'}. Fixed. Also noted that superset components are counted as separate sets, which is an analyst convention.
3. "Every main pattern is trained 2x/week in every 3-6 day template (OBSERVED)" was false. The '3 DAY BUILDER' has VPULL, VPUSH, UHD, leg curls and calves once a week, and the 3-day PPL variants train every pattern once a week. Fixed in 2.4 and 3.4.
4. "Only the AESTHETICS-12 week-12 legs day passes ~11 fractional sets/session" was false. The UL/PPL 'INTERMEDIATE' lower day gives glutes 13 and quads 11, and FAT BURN WK4 lower days give glutes 12. Fixed in 2.4.
5. FAT BURN isolation reps were given as "15 -> 20 -> 30 -> 40", a sequence that is not in the sheet. Observed: leg ext/curl 15 -> 20 -> 40 -> 40; arm isolation 30 -> 30 -> 30 -> 40; side raises 15 -> 15 -> 20 -> 20. The invented "25 to 30" step was removed from the 9.9 matrix. Fixed in 8, 9.6, 9.9 and the JSON.
6. Progression was presented as "+4.75 to +5.5 %/week, inside his 3-7 %". That summary left out AESTHETICS-8 (+16.5 %/week) and HYBRID (+10.4 %/week) and hid the step shape (+20 to +50 % on step weeks). Fixed in section 0, section 8, tension 8 and the JSON. Tension 15 and open question 21 were added.
7. The 9.7 cap "<= +10 %/week" was justified as "OBSERVED steps are 0-9.4 %". Only FAT BURN and baseball pre-season fit that; the coach's other step weeks are +20 to +50 %. The cap is now labelled INFERRED smoothing.
8. The deload rule "about 60 % of week-1 sets (50-70 %)" was attributed to observed deloads. Every observed deload lands at 0.75-1.0 x week 1 (AESTHETICS-12 1.0, STRENGTH-12 0.75, baseball 0.76, boxer 0.92 of wk3). The rule is now 0.85 x week 1 (range 0.75-1.0, i.e. -25 to -50 % from the peak). The worked-example deload columns were recomputed (W8 and the 12-week D values), open question 12 was rewritten and tension 16 was added. The JSON `deload` and worked examples were updated.
9. The level colours were described as "athletic and aerobic ... with the same colours" as the gym scale. The athletic and aerobic scales are green / yellow / **red** E06666; the gym 'INTERMEDIATE' is **orange** F6B26B; the aerobic ' INTERMEDIATE' is yellow (the NEWBY colour). L4 is INFERRED, and only CrossFit has 4 tiers. Fixed in 9.2 and the JSON levels.
10. UL/PPL compounds were said to go "15 -> 10 -> 8 by level". That holds only for PPL push/pull. UL lower goes 12 -> 10 -> 8, UL upper goes 8 -> 10 -> 12 and PPL legs go 8 -> 10 -> 8. Fixed in 4.3 and tension 10.
11. Baseball AMRAP share of small-muscle isolation was "35 %". The decode gives 33.9 %, so it now reads 34 % (+4 % MYO). Fixed in 5.1 and 5.3.
12. The 'Any Cardio Equipment' 5-min warm-up was listed for "UL / PPL / athletic MM". It is in the UL/PPL tabs only. Fixed in section 0 and 7.2.
13. The BYOP cardio dose examples '400m' and '20 cals' sit at library B125/B135, outside the dropdown range B7:B122, so a client cannot select them. Fixed in 7.2.
14. The athletic-tab instruction rows were cited as "A4/A6". They are A3/A5 (UL/PPL A4/A6). Fixed in section 0.
15. The ATHLETIC template was described as "blank". G12 'MYO SET' is pre-filled on the leg-extension slot. Fixed.
16. The glute-over-MRV weeks were said to be followed by a deload "in 3 of 4 cases". The correct count is 2 of 4 (AESTHETICS-8, baseball); the boxer week 8 and AESTHETICS-12 week 12 end at the peak. Fixed in 3.6 and tension 5.
17. The medball list was described as "always R/L pairs". It has 5 bilateral throws and 2 single-line rotational throws, and 16 extra specialty/core rows sit outside the 19-throw pass. Fixed in 6.2.
18. The plyo force-phase order was labelled OBSERVED. The labels are OBSERVED, but reading them as a progression is INFERRED; A-C sit under 'BALLISTIC PURPOSE', D under 'PLYOMETRIC PURPOSE'. Fixed in 6.1.
19. The squat hypertrophy menu was called "3 x 4-week waves" and labelled OBSERVED. The rows carry no week labels, so the waves are INFERRED. The missing athletic 'FRENCH CONTRAST' menu ('3-4' x '3/3/3/3/3' at 78 %), rule A5 and the banded/chain load cues (~50 %, ~70 %) were added to 4.1.
20. CrossFit "+1 set per level per month" depended on an unstated assumption. The macro STRENGTH levels jump (APR 1, JUNE 3, JULY 4, OCT 2, NOV 2), so "per month" is now labelled INFERRED.
21. The Olympic Prilepin tension said "every week exceeds". 4 x 6 @80 % is exactly the top edge of the 70-80 % row, and hang snatches alternate with cleans. Fixed in 4.4.
22. Session-length rows in 9.10 were marked OBSERVED. No sheet states a duration, so only the counts are OBSERVED. Labelled.
23. The 9.11 sport rows were marked "(OBSERVED ...)" although the values are inferred targets. Labelled, and the observed boxer (113-129 high; bilateral jumps excluding landings 53-69) and baseball totals were added beside the targets.
24. The 9.3 anchors misquoted boxer week 1-2 upper body ("9-12"; chest is 6 and side delts 3) and fat-loss legs. Restated from table 3.1.
25. SCIENCE: the doc said plyometrics "do not build meaningful muscle mass". The evidence is mixed: Ramirez-Campillo ES is -0.01 to -0.06 (not "0.02"), and Grgic, Schoenfeld and Mikulic 2021 found similar lower-body hypertrophy from plyometric and resistance training in untrained samples. The AP exclusion is now labelled an INFERRED convention (1.2, 6.5, JSON). Spiering 2021 is now limited to younger adults. The NSCA citation was clarified (the Cortland page cites no source).
26. Table repair: the STRENGTH-12 row in section 8 had unescaped '|' inside a cell (broke the table); replaced with '/'.
27. Other small fixes: throws range (baseball 70-290 added), aerobic 2-vs-3 exceptions (bootcamp 2, CrossFit grids), the 'BOOTCAMP - OPTION 2' title cell, the BYOP SETS menu incl. 'SUPERSET W/ 👇', the baseball 'This is NOT a sprint' note, and the MM COD statement (skater jumps are plyos, not cuts).

**Not changed (checked or spot-checked against dumps and decodes, no fault found):** section 2.1 session counts, 2.3 weekly totals (spot-checked), 3.1 normalized table (spot-checked: AES4, UL, FAT BURN rows recomputed), 4.2 rep distributions (UL/PPL/FAT BURN recomputed; baseball/boxer taken from the decode), 5.2 rest cues, 7.1 cheat-sheet values (every grid cell checked), Sheet24 half-marathon structure, the STRENGTH-12 header (% / RPE / SETS / REPS) and the boxer week-to-week ramp (80, 80, 113, 113, 117, 117, 104, 136).

### Second verification pass (2026-10-08)

A second adversarial check of the whole document against `dumps/BYOP`, `dumps/MASTER_MODEL`, the raw xlsx files (openpyxl, read-only) and the decodes in `analysis/`. Nothing in Google Sheets was opened or changed. A backup of the JSON before these edits is in the session scratchpad (`fc03b/03_volume_rules.before_verify2.json`); the recompute scripts are `fc03b/recompute5.py` and `fc03b/recheck_bands.py`.

**Recomputed independently (python on the raw xlsx and on `program_views`). These match the doc:**
1. BYOP AESTHETICS Day 1 SETS cells E3:E9 = 3, 3, 3, 3, 3, 2, 2 = 19.
2. FAT BURN weekly lifting sets 60 / 60 / 64 / 70; circuit work 12.0 / 18.7 / 21.3 / 33.3 min; WK1 isolation mean 19.0, WK4 35.0 (75 % of sets at 40).
3. AESTHETICS-12 weekly sets 96 (wk1), 128 (wk6), 148 written + 10 superset-finisher sets = 158 (wk12).
4. Progression rates: STRENGTH-12 +5.22 %/week (4 -> 7 sets over 11 weeks), AESTHETICS-12 +4.75 %, AESTHETICS-8 +16.5 %, CrossFit +26 %/level = +5.5 %/week at one level per month; boxer steps +41 / +3.5 / -11 / +31 %.
5. Medball cheat sheet: 19 throws, 210 reps; 9 'SPECIALTIES' and 7 'CORE EXTRAS' outside the pass.
6. MM athletic contacts: STARTING high-intensity 146 (48.7 per session); MID 71 high + 120 low = 191; ADVANCED 32 + 100 = 132.
7. MM UL and PPL sets per session, weekly resistance totals, all rep-bin shares in 4.2 for UL/PPL, the cheat-sheet grid, the 'ALL ABOUT SQUATS' menus, the STRENGTH-12 header rows, the CrossFit 'LVL' tables and the 2 / 2 / 3 / 4 'YES' aerobic cells.
8. Section 3.2 and 3.3 reproduce exactly from `program_views` before the fix below (58 views).

**Corrected (claim -> problem -> fix):**
1. Normalized delt credits (3.1, 3.2, 3.3, section 0, 3.5, 3.6, 9.3, tension 6). The single-bucket recompute credited every ISO_SIDE_REAR_DELT set to side delts, so the 'Reverse Flies' / 'DB Reverse Flies or Machine' sets in both push/pull/legs tabs and the AESTHETICS-12 'face pulls' / 'machine or db Reverse flies' were counted as side-delt work (AESTHETICS-12 wk12 showed side 15 / rear 10; the sheet gives side 5 / rear 20). The front raises in MM athletic STARTING and boxer weeks 3-8 were also counted as side delts. The bucket is now split by the exercise written (19 views). Hypertrophy medians: side delts 11 -> 8, rear delts 3 -> 5 [2-20]; athletic: front 5 -> 6, side 7.5 -> 4.75. Band counts: rear delts <6 in 49 of 58 views (was 55), one view in 15-20 (was 0). "Rear delts median 3 / spill-over from rows only" is no longer true for PPL (6-12) and AESTHETICS-12 (9-20).
2. Section 0 said "59-151 total working sets ... once jumps, core and throw sets are counted (MM athletic 59-89, boxer 80-136, ...)". The MM athletic and boxer figures excluded the throw sets while baseball's included them. With throws: MM athletic 97-112, boxer 99-174, baseball 105-151 (deload 82). Fixed in section 0 and 2.3.
3. "MM athletic STARTING -> ADVANCED cut total sets 89 -> 59" (9.3, 8, open question 18, JSON multiplier note) holds only without the throws. Counting each throw line as a set it is 108 -> 112 -> 97, so MID is higher than STARTING. Qualified everywhere; 2.2 also notes MID has more lines per session than STARTING.
4. AESTHETICS-12 week 12 "158" includes 10 superset-finisher sets (Z41 '15 squats with no weight', Z52 'max bench dips'); the written exercises give 148 (the decode's own figure). Noted in section 0 and 2.3.
5. STRENGTH-8 sets per exercise (2.1) said "'the work' 5 ... accessory 3-4". Column B gives 'the work' 5 only on Mon/Wed; Thu 3 ('EASY' plyo) and Sat 3 ('FAST BANDED BENCH PRESS'); accessory 3-5. The three colour-matched ladders (green 5,5,4,4,3,3,2,1; pink 5,4,3,2,1,3,2,1; blue 3,3,2,1,3,2,1,1) are now all listed, with the blue one tied to the Thu/Sat 'SEE' cells.
6. "D.E." was presented inside a verbatim cue (5.1, 9.8, JSON). The sheet writes 'M.E.' only (N9/N13); Thu/Sat carry 'FAST ...' lift names and 'FAST RPE6 or about 60-70%'. Marked as an analyst label.
7. SCIENCE/logic: "'(1 RIR) *RPE8+' is internally inconsistent" was too strong. 1 RIR = RPE 9, which satisfies "8+"; the RPE floor is just looser than the RIR. Fixed in 5.3, tension 1 and the JSON.
8. Tension 3 (squat strength menu vs Prilepin) said "totals of 15-24 ... exceed the 90+ % row". The totals are 14-25; the 2-3-rep schemes fit the 80-90 % row except 7x3 = 21 but far exceed the 90+ % row; the 4-5-rep schemes (24-25) exceed the 80-90 % row. Rewritten. Tension 1 "reps per set 1.5-2x" -> 1.3-2x the top of Prilepin's range.
9. BASEBALL legend: the coach's column headers are 'COMPOUND' and 'SMALLER ISOLATIONS' (under 'RESISTANCE PATTERNS'), not "compound / isolation". Added verbatim to 4.1 and the JSON; 4.3 rule 1 now notes that his own label is small-muscle isolation.
10. Conditioning (section 0, 7.2, 7.3): the BYOP '3 DAY BUILDER' has a 'Cardio' slot in each of its 3 'Optional' blocks (3/week, matching the cheat sheet) and was missing from the exception list; BYOP push/pull/legs has none. CrossFit 'LVL 4 = wods a week' has no number, so "1-4 WODs" was partly inferred. Sheet24: the long day is split a.m./p.m. in 7 of 21 weeks (week 20 '12 miles (7 miles a.m. + 5 miles p.m.)'), so the longest continuous run is 11 miles.
11. Section 8 said "Every 8- or 12-week product has a scheduled deload or test". HYBRID-8 and the boxer 8-week build-up end at the peak. Fixed in section 8, the 9.8 table (athletic test + deload now INFERRED), tension 16 and the JSON plan layout.
12. Section 8 HYBRID row omitted the 'AMRAP' header row D70 (12, 15, 16, 17, 18, 19, 20, 20), a density lever (+7.6 %/week compounded). Added; what it applies to is not written (INFERRED as the Saturday circuit minutes).
13. 9.8 boxer deload: "eleven rows 3 -> 2 sets" left out that three rows go 3 -> 4 (I20, I35 'Hang Power Clean & Press', I46 complex) and the sprints 6 -> 7. Added.
14. 9.11 "43 % of baseball calf slots are ankle hops": the sheet has 16 ankle-hop fills in 42 calf-labelled slots (38 %; about 40 % after removing two empty and one row-shifted slot). Changed to "16 of 42, about 40 %".
15. 6.1 A-drill reps "72 / 90 / 64 per leg per lower day" applied to UL only; PPL 'NOVICE' is 2 x '8/8' = 48. Split into UL and PPL values.

**Not changed (checked, no fault found):** BYOP slot structures of all eight program tabs, the dropdown ranges (AV/AW/AX/AY), the 10 FOCUS headers, 'JUSTICE LEAGUE' doses and notes, bootcamp 1/2 layouts, the aerobic cheat sheet values and colours, the level colours, 'ALL ABOUT SQUATS' cells A5/A13/D13/G13/G18/B28/E28/H28/A30/B36/B38/B40, the baseball Olympic piece (4 x 8 @75 % ... 4 x 4 @90 %), the medball list, the STRENGTH-12 header, AESTHETICS-8 header and '1-2 RIR' column, FAT BURN rows, the 1RIR/2RIR/MAX/ALL ladder, CrossFit level tables and macro STRENGTH levels, the RIR-RPE mapping (Zourdos 2016), Prilepin values, NSCA contact ranges, de Villarreal 2009, Rogerson 2024 deload survey, Spiering 2021, Schoenfeld 2017/2019 and Baz-Valle 2022 summaries.

### v1 update: coach answers applied (2026-10-08)

**Method.** `coach_answers_full.md` read in full (CAT-01 ... FIX-04; LIB-10 and LIB-12 unanswered) and `coach_answers.md`; `12_volume_algorithm_v1.md` and `.json` read in full and used as the authoritative engine. Every rule that a coach answer confirms or overrules now carries its question ID. Nothing in Google Sheets was opened or changed. Scripts and backups of both v0 files are in the session scratchpad (`v1_03/`); all computation used the team venv (`.venv/bin/python`).

**Recomputed.**
1. Reproduced the v0 `normalized_muscles` of all 61 program views from their bucket totals with the v0 analyst map and the exercise-level delt split: identical except 34 rounding-only differences (≤ 0.05) on six mean views stored at one decimal (`recount.py`). The recompute method is therefore exact, and swapping in the coach map gives apples-to-apples v1 numbers.
2. Recomputed all 61 views with the coach count (helpers 0.25, glute values as PROPOSED in 12) → `normalized_muscles_coach_v1` in the JSON and the section 3.1-3.3 tables (`tables.py`, `tables2.py`). Main movers (quads, hamstrings, chest, back) are unchanged; hypertrophy-family medians changed for glutes 21 → 9, front delts 9 → 5.2, side delts 8 → 6.5, rear delts 5 → 3.5, biceps 10.5 → 8.2, triceps 12 → 9; glutes now reach 15 in 1 of 58 views (v0: 15-20 in 9, above 20 in 36); rear delts < 6 in 51 of 58 views (v0: 49).
3. Computed the 9.6 banking and set-placement illustration (`bank_example.py`); the sequence reproduces his 3/3/2 → 3/3/3 → 4/3/3 order with day rotation.
4. Rebuilt `03_volume_rules.json` to v1 (`update_json.py`) and validated it with `json.load`.

**Changed sections.** Header and evidence tags (COACH-ANSWER, PROPOSED added), the new "v1 - coach answers applied" section, 0, 1, 2.1-2.2 and 2.4 (coach notes; glute per-session claim), 3 (all tables and readings recomputed), 4 (coach rule, band scope, notation, 40-rep, preference, unilateral), 5 (coach rule; 5.3 resolutions), 6 (coach rule; plyo "zones"; Olympic for all; 6.5 settled), 7 (coach rule; marathon flag; 7.3 resolved), 8 (coach rule vs observed steps), 9 (rewritten), 10 (statuses + 7 new tensions), 11 (answered / still open / 11 new questions), 12 (coach answers and 12 added).

**Conflicts with 12 found and resolved for the coach:** athletic-template default sets (VOL-16), RIR in the last weeks (VOL-13), field-athlete exercise cap (VOL-08 vs VOL-17). Listed in the v1 section.

**Not changed (still valid evidence):** session counts (2.1), weekly totals (2.3), the RP landmark table, rep distributions (4.2), effort cues and rest (5.1-5.2), athletic dosing (6.1-6.3), the aerobic cheat sheet (7.1-7.2), progression evidence (8 table), science summaries and sources.

### v1 audit pass (2026-10-08, continuation run)

**Method.** Re-read `coach_answers_full.md` in full and `12_volume_algorithm_v1.md` in full (its files are dated before the first v1 pass of this file, so nothing in 12 changed in between). Checked every VOL answer (VOL-01 ... VOL-18), UNI-01/04/05/07/08/09, ATH-07 and the session rules against sections 0-11 and the JSON. Scanned both files for v0 rules that survived outside a "retired" note (size-class rates, 0.5 helpers, L4, the fatigue budget, the 0.75 release, the 0.85 deload, preference set factors, 40-rep defaults, bands): none found. The remaining hits are OBSERVED evidence (banded squat cues) or v0 verification entries. Re-checked the 9.6 banking illustration by hand (15 → 16 → 18 → 19, release at 1.0, 3/3/2 → 3/3/3 → 4/3/3): correct. The 12 conflicts listed at the top still stand: 12 §3.10 still has no 2-set athletic default, and 12 §3.12 still says "RIR toward 1". Backups of both files before this pass: session scratchpad `v1_03/03_volume_dosing.v1_pre_audit.md`, `v1_03/03_volume_rules.v1_pre_audit.json`.

**Changed (v1 change rows 37-41):** MYO = 2 hard sets now stated in §1 (it was in the JSON and 12, not in this file); same-pattern pairing for aesthetics added to 9.10 (UNI-06); axial-once and hip+push / knee+pull now apply to every population (PER-04, EQ-11, UNI-11, ORD-06); the client effort explanation is split into RIR/RPE and an EFFORT-against-target reading, which resolves a real conflict between VOL-13 and the GEN-05 hold gate (tension 24, question 11.3 item 12); "high-raw athletes" read as HYROX (VOL-11, INFERRED); conflict 3 is relabelled as an ambiguity inside his answers, not a conflict with 12; the abs row in 9.3 marks the 2 sets per exercise as PROPOSED.

## v1 verification log

**Date and method.** 2026-10-08, adversarial check of the v1 files (`03_volume_dosing.md`, `03_volume_rules.json`). `coach_answers_full.md` was re-read in full and `coach_answers.md` for his chat statements. Every answer that bears on volume or dosing was checked against the rules, tables, worked example and JSON of both files, not only against the change log. `12_volume_algorithm_v1.md` §3.3-3.12 and `05_session_architecture.md` rule 18 were read to check the cross-references. Nothing in Google Sheets was opened or changed. Computation used the team venv. Backups from before this pass are in the session scratchpad: `adv03/03_volume_dosing.pre_adv.md` and `adv03/03_volume_rules.pre_adv.json`. The JSON update script is `adv03/update_json_adv.py`.

**Coach answers relevant to volume, and where they now live.** These were checked against both files. "OK" means the files already said it correctly. "Fixed" means this pass changed it.

| Answers | Rule | Where | Status |
|---|---|---|---|
| VOL-01, UNI-01, VOL-02 | starts 10-12 / 15-20 / 20+; 15-20 = maintenance to some growth, 20-25 = growth; priority +4-6, cap 25-30; the tool learns from data | §0, §3.3, §9.3, §9.4 | OK. The priority split by level is now tagged PROPOSED (fixed). |
| VOL-03, UNI-08, EQ-03, EQ-13 | pain: -30-50 %, constrained machines or split grips, drop the exercise; a swapped lift keeps its sets "ideally" | §9.5 | OK |
| VOL-04, VOL-05, VOL-06, UNI-05 | 3/5/7 % of weekly sets, chosen from the person's state and never by muscle size; bank the fraction; 10 %/week too much | §0, §9.6, §9.7, JSON `progression`, `caps` | Fixed. The hand-set rate was 0-10 % and is now 0-7 %; the weekly ceiling is now "below +10 %". |
| VOL-07 | 3-4 exercises per muscle per day; first exercise first (2/2/2 → 4/3/3); bonus exercise for small muscles | §9.6 table and illustration, §9.7 | OK (illustration recomputed by hand: 15 → 16 → 18 → 19) |
| VOL-08, VOL-16, VOL-17, UNI-09 | 5-7 exercises (45 ≈ 5, 60 ≈ 6-7, 75-90 ≈ 8-9); field athletes up to 10-12; ~1.5 h / 45-60 min; calves 3 per leg day; rear delts own sets; ~2 core | §0, §9.3, §9.7, §9.10 | Fixed. His length mapping (RIGHT) replaced "5-7, up to 8 PROPOSED". |
| VOL-09, LIB-14, LIB-16, LIB-09, CAT-09, UNI-07 | helpers 0.25; dips 0.5/0.5; thrusters 1.0/0.5; pull under = lat pull-over; leg flexion own segment; 10/10 = 1 set | §1, §3, JSON `counting` | OK. The Kong row note and the thrusters question (§11.3 item 14) were added. |
| VOL-10 | athletic patterns never count | §1, §6.5, §9.11 | OK |
| VOL-11, VOL-12, VOL-13, VOL-14, VOL-15, UNI-04, PRG-06, PRG-07, PER-11 | reps, effort, rest, MYO, preference, unilateral reps, notation, same rules at every level, VOL 1-3 | §4, §5, §9.9 | OK |
| VOL-18 | balance by default; V-taper as an optional bias | §9.4 | OK |
| UNI-02, UNI-03, UNI-10, UNI-12, CAT-13 | bilateral : unilateral share from 90/10 to 10/90; bodybuilders ~50/50 → 80/20-90/10; COD athletes 80-90 % unilateral; in-season bilateral minimal; contra/ipsi | §9.3, §9.11, JSON `bilateral_unilateral_share` | Fixed. v1 had only a pointer to 12 and none of his rules. |
| UNI-06, UNI-11, ORD-06, PER-04, EQ-11 | same-pattern vs cross-pattern pairing; hip + push / knee + pull; spinal loading | §9.10 | Fixed. The axial rule now reads "no second axial squat; one axial hinge" (as 05 rule 18), with question §11.3 item 13. |
| ATH-11, ORD-08, ORD-10, ORD-11, ORD-05 | core first and movable; warm-up; optional days; Focus slots; supersets | §6.4, §9.10 | Fixed. Weekend-warrior order and §6.4 now put core first; bootcamp and general rows list core first. |
| PER-01, PER-02, PER-03, PER-05, PER-07, PER-10 | plan modes; blocks; A/B weeks optional; deload ≈ half with the same exercises; tests; smooth vs steps | §9.8, JSON `plan_layouts`, `deload` | Fixed. The JSON deload removed Olympic lifts, against "same exercises"; PER-03 was added. |
| ATH-01, ATH-02, ATH-03, ATH-04, ATH-05, ATH-06, ATH-08, ATH-10, ATH-12, PER-08, CAT-10, CAT-11, EQ-15, EQ-16, LIB-07, LIB-13, LIB-21 | sport dial, plyo stages, Olympic lifts for everyone, boxers reduce but never cut | §6, §9.9, §9.11 | Fixed. Olympic levels follow ATH-10 (intermediate+ get the full scope); the ATH-12 "no rest within the complex" detail was added. |
| ATH-09, EQ-03, GEN-02 | older clients; no sex rules; youth Olympic lifts from the floor | §9.1, §9.11 | Fixed. The older-adults row had no snatch or depth-jump limit. |
| ATH-07, EQ-14, ORD-09, PRG-03, PRG-11, PRG-12, LIB-18 | conditioning sessions, tools, finishers, bootcamp, half marathon, marathon flag | §7, §9.12 | OK |
| EQ-01, EQ-07, EQ-08, EQ-12, EQ-06 | no bands or variable resistance; medballs ≤ 20 lb | §4.1, §6.1, §9.7, §9.11 | OK. Fixed: the EQ-06 weights per throw type (RIGHT) were missing. |
| PRG-05, PRG-04, CAT-05, CAT-06, PER-06 | L1-L3; athletic tabs as blocks or levels; client level separate from exercise level; level-up | §9.2 | OK |
| GEN-01, GEN-03, GEN-05, GEN-08, ATH-13, FIX-03 | Spanish; output modes; feedback; coach rules; generic names | §9.1, §9.9, §9.13 | OK |

**Retired ideas: grep of both files (python regex over the md and over every JSON string).**
1. Size-based 3/5/7 % (large lower 3 %, large upper 5 %, small 7 %): appears only in "retired" notes, in the v0 question text inside `open_questions.answered_v0`, and in log entries. No rule uses it. The muscle class drives rep defaults only.
2. Helper credit 0.5: appears only as the dips and thrusters exceptions he confirmed, the PROPOSED glute 0.5 on hinges, the Pelland 0.5 research count, and the superseded v0 map (labelled). No rule uses it.
3. Band, chain and weight-releaser substitutes: none. Banded items survive only as OBSERVED sheet evidence and are marked out of scope (EQ-01, EQ-12). There are no band chops, banded leg extensions, band home kits or "bands only" options.
4. Plyo zones as a fixed exercise property: the 'ZONE 1/2/3' strings are quoted only as sheet labels, followed by his correction (CAT-10, CAT-11). Rules use the method stages RC1-RC3 (name PROPOSED).
5. Core after the power block as the default: no hit for "Part B" or "after the power". One place put the athletic block first (the weekend-warrior row) and was fixed. §6.4 is now annotated.
6. Sex-based rules: only "no sex field / no sex-based rules".
7. Justice League as a program name: 'JUSTICE LEAGUE' appears only as the sheet tab cited as a source. The generator goal is `weekend_warrior_athletic`.
8. Hack squat ranked last: no hit. Machines are not ranked anywhere in 03.
9. 6-week = 5 weeks + deload: appears only in the v0 question text and the `plan_layouts.retired_v0` note.

**Recomputed independently.**
1. `normalized_muscles_coach_v1` for all 61 program views, from their bucket totals with the coach map (helpers 0.25, PROPOSED glute values) and the exercise-level delt split: 0 differences above 0.05.
2. §3.3 band counts (58 views = 61 minus the two BOOT2 'A only' views and MM_CF_FT_AUG): all 12 muscles reproduce exactly. The §3.5 statements also hold: quads 23 / 9, hamstrings 25, chest 8, glutes 1, rear delts 51.
3. §9.6 banking illustration: 0.75, 1.50 → 16 (0.50), 0.98, hold, 2.10 → 18 (0.10), 1.00 → 19 (0.00), 0.95; placement 3/3/2 → 3/3/3 → 4/3/3 with day rotation. Correct.

**Corrected (claim → problem → fix).**
1. "Coach or client can set the rate by hand from 0 to 10 %" (md v1 row 1, JSON `progression.rule.rate`) → he called 10 %/week "way too much" (UNI-05) → the hand-set rate is now 0-7 %, a week must stay below +10 %, and `caps.hand_set_rate_max` = 0.07. This is listed as conflict 4 with 12 §3.7 step 4 and tension 25.
2. The bilateral : unilateral share, which he called very important, was only a pointer to 12 → his rules (UNI-02, UNI-03, UNI-10, CAT-13, UNI-12) are now in §9.3 and `generator_rules.bilateral_unilateral_share`. Numbers stay in 12 §3.11.
3. The weekend-warrior session order "athletic block first, then resistance" contradicted ATH-11 (NOT RIGHT on core after the power block) → now core (~2) → athletic block → resistance. Core first was added to the bootcamp and general rows, and §6.4's observed reading was annotated.
4. The Olympic matrix gave the full lifts at L3 only (L2 = hang power variants), while §9.11 and ATH-10 say intermediate and up get the full scope → L1 and early L2 use the variants, and L2-L3 get the full scope.
5. The older-adults sport row allowed "DB/KB" Olympic work with no limit → no snatch variants and never depth jumps (EQ-03).
6. The JSON deload removed "Olympic/max-effort work", against PER-05 "same exercises" (RIGHT) and ATH-10 → Olympic lifts stay at half the sets with light technique loads (PROPOSED). The md now says the same.
7. "Load the spine axially once a week ... deadlifts count" could be read as one axial exercise a week in total, which would forbid a deadlift on any non-squat day, and it disagreed with `05` rule 18 → now "no second axial squat; one axial hinge a week" (reading INFERRED), with question §11.3 item 13.
8. Priority "+4 (L1-L2) to +6 (L3)" was presented as the coach's rule → the split is now tagged PROPOSED. 12's internal mismatch (+5 at L2 in §3.3) is conflict 5.
9. "Resistance exercises 5-7 (default 7); up to 8 ... PROPOSED" understated his confirmed numbers (VOL-08 RIGHT: 75-90 min ≈ 8-9) → the length mapping is restored in §0, §9.7, §9.10 and the JSON. This is conflict 6 with 12 §3.10.
10. The medball cap held only "≤ 20 lb, 8-10 lb speed" → the EQ-06 weights he marked RIGHT were added (slams 10-20, overhead 6-10, sit-up 6-8, lighter for youth and older clients).
11. Thrusters 0.5 shoulders (LIB-14) sat next to helpers 0.25 (VOL-09) without a note → kept as his exercise-level answer and asked in §11.3 item 14. A note on the Kong row's low stimulus (LIB-09) was added.
12. Plyo contacts per-session caps were tagged SCIENCE/OBSERVED only → choosing the NSCA lower ends as caps is now tagged PROPOSED.
13. PER-03 (A/B lead-lift weeks only for variety seekers) was missing from §9.8 and `plan_layouts` → added.
14. ATH-12 "no rest within the complex" was missing from the contrast cell → added.
15. JSON list references written by this pass use the file's 1-based convention, which `meta.how_to_use` now states.

**Not changed (checked, no fault found):** §2-§8 observed evidence and tables (2.1 counts, 2.3 totals, 3.1-3.3 recomputed above, 4.2 distributions, 5.1-5.2 cues, 6.1-6.3 athletic dosing, 7.1-7.2 conditioning, the 8 progression table), §9.5 pain steps, §9.9 effort and the EFFORT-against-target proposal, §9.12 conditioning, §9.13 feedback loop, tensions 1-24, and the RP/science summaries. Both files parse. The md tables were checked for column counts (0 broken rows) and the JSON was re-loaded with `json.load`.

## v1.1 update: round 2 applied (2026-10-08)

**Method.** `coach_answers_round2.md` read in full first, then this file, `03_volume_rules.json`, `12_volume_algorithm_v1.md` / `.json` and `11_training_variables.md` / `.json` in full. Every round-2 answer that bears on dosing (R2-VOL-01..08, R2-PER-01..07, R2-SES-01..06, R2-ATH-01..08, R2-GEN-01/04/05/06, R2-LIB-01/03..06, LIB-10, LIB-12) was traced to the rules, tables, illustration and JSON of this file, not only to the change table. 12 v1.1 (rewritten in the same run) is the engine of record; this file states his rules and points to it. Nothing in Google Sheets was opened or changed. Scripts and backups: session scratchpad `r2_vol/` (`edit03md.py`, `edit03md_p2.py`, `edit03md_p3.py`, `patch03json.py`; backups in `r2_vol/backup/`).

**Recomputed.**
1. All 61 program views with every compound crediting glutes 0.25 (`r2_vol/t03/tables_v1_1.py`): only the glute column changes (0 differences in the other 11 muscles against the stored v1 coach count); 46 of the 3.1 glute cells changed; hypertrophy-family glute median 9 → 6; the §3.3 glute row 7 / 39 / 11 / 1 / 0 / 0 → 22 / 34 / 2 / 0 / 0 / 0. Stored as `observed.program_views[].normalized_muscles_coach_v1_1`.
2. The §9.6 illustration on the 12-week stairway (`r2_vol/bank_example_v1_1.py`): 15 → 22 with weeks 9-12 at 19, 20, 21, 22 and his 3/3/2 → 3/3/3 → 4/3/3 order with day alternation; the table is generated from the script's JSON.

**Changed sections.** Header and evidence tags (COACH-R2), the new v1.1 section, † marks on the v1 rows that round 2 changed, the conflicts status, §0 (rows 1-3, 5-7, weekly increase, plan length), §1, §2.4, §3 (tables 3.1-3.3, readings 3.5-3.6, the 20-30 research note), §5.1, §5.3, §6, §7, §8, §9 (9.1, 9.2, 9.3, 9.4, 9.5, 9.6 rewritten, 9.7, 9.8 rewritten, 9.9, 9.10, 9.11, 9.12, 9.13 rewritten), §10 (13 statuses + tensions 26-29), §11 (answered items marked; 11.4 new), §12.

**Retired-idea scan (after the edits):** "person's state" rates, the readiness score, the recovery-signal intake, triggered or mid-block deloads, start-hard 8-week plans, hinge glute credit 0.5, KB-swing glute credit, small-muscle start 8 and the 4 / 2 floors appear only as history (v1 rows marked †, "retired" notes, observed evidence or the verification logs).

**Checks.** Every Markdown table row has its header's column count; `03_volume_rules.json` parses; every COACH-R2 ID cited exists in `coach_answers_round2.md`.


---

## v1.1 verification log

*History (v1.1). Round 3 retired or settled what this log treats as current for R2-VOL-01 / VOL-02 / VOL-03 / GEN-01 (check-in), R2-VOL-04 (rear delts 4 / 6 / 8), R2-VOL-08 (placement) and R2-PER-06 (end prompt); the "Flags kept" list is closed or carried in the v1.2 verification log at the end of this file.*

**Adversarial check of the round-2 update, 2026-10-08.** One log for the three volume files; the same text is appended to `12_volume_algorithm_v1.md`, `03_volume_dosing.md` and `11_training_variables.md`, and a short JSON twin sits in each JSON (`verification.v1_1_adversarial` in 12, `verification_log.v1_1_adversarial` in 03 and 11).

**Method.** `coach_answers_round2.md` read in full first. Then the rule sections, tables, worked examples, pseudo-code and JSON of 12, 03 and 11 (v1.1). Every round-2 answer that touches volume was traced to the rule that carries it in each file, in the Markdown **and** the JSON (a change-log line alone did not count). Leftover scans (regex over all six files, history sections and "retired" notes excluded, every remaining hit read by hand) for: acclimation caps / start-hard 8-week / target-seeking; early or triggered deloads inside a block; sleep, stress, life or physical-job inputs; effort 10 = fail; KB-swing glute credit; 1 exercise per muscle on full-body days; an Olympic once-a-week cap; mid-block tests; 1RM tests for untrained people; mandatory videos. A citation count of every COACH-R2 ID per file was used to find thin spots. All three JSON files parse; their indent (1) and character encoding are unchanged. Backups of the six files before this pass: session scratchpad `adv/backup/`. No Google Sheet was opened or changed.

**Round-2 answers traced (✔ = applied in rules, tables, examples and JSON; FIXED = gap closed in this pass).**

| Answer | Rule | 12 (engine) | 03 (dosing) | 11 (variables) | Status |
|---|---|---|---|---|---|
| R2-VOL-01 | step table (effort, completion, pain); never > 7 %; repeat the week under half the sessions | §0 r7, §3.7.3-3.7.4; JSON `stairway.checkin_table`, `limits` | §0, §9.6, §9.7, §9.13; JSON `progression.rule`, `feedback_loop`, `caps` | 3.1, 3.5; JSON `progression_engine.checkin` | ✔ |
| R2-GEN-04 (+ VOL-01 life cells) | no sleep / stress / life / physical-job inputs at intake or check-in; life cells dropped and flagged | §2.6 (research kept as background only), §3.7.3, §3.7.5, §3.14, §4 step 0; JSON `life_column_removed`, `learning.modes` | §9.1 (struck row), §9.13, tension 26; JSON `inputs.recovery_signal_removed`, `feedback_loop` | 3.5; JSON `checkin.life_column_removed` | ✔ (flag kept) |
| R2-VOL-02 | 10 = "the max I could do, but successful"; optional 'Failed' | §3.7.3, §3.14; JSON `effort_reading`, `log_schema` | §5.1, §9.9, §9.13, tension 24; JSON `effort_targets` | 3.5, V08 | ✔ |
| R2-VOL-03 | no check-in = no adaptation (planned stairway) | §3.7.3, §3.14, §4; examples 5.1, 5.3 | §9.6, §9.13; JSON `feedback_loop.no_checkin` | 3.5; Example B | ✔ |
| R2-VOL-04 | small muscles 10 / 12 / 15 (8 lifted by the floor); rear delts 4 / 6 / 8 | §3.3; JSON `starting_table` | §9.3; JSON `weekly_sets.small_muscles` | 3.8 | ✔ |
| R2-VOL-05 | compounds → glutes 0.25; hip thrust / bridge 1.0; KB swings ballistic, never muscle volume; thruster 1 / 0.5 / 0.25 | §3.1; JSON `counting.credit_map` | §1, §3; JSON `counting`, `observed.program_views` | 3.2; JSON `unit.credit_map` | **FIXED in 03** (observed views still credited KB swings, fix 1) |
| R2-VOL-06 | floor 10; caps 14 / 22 / 25, priority 18 / 26-28 / 30, customizable; Pro above 30; next block × 1.05, cap + 1; "most people 20-30" researched | §2.11, §3.2, §3.3, §3.5, §3.12; JSON | §9.3, §9.7, §9.8; JSON `weekly_sets`, `caps` | 3.8, 3.10 | **FIXED in 12** (JSON calves / rear-delt priority caps, fix 4; pseudo-code × 1.05, fix 2) |
| R2-VOL-04 / VOL-06 tension | rear delts 4 / 6 / 8 vs "nobody needs less than 10" | §3.3 (floor read on the SHOULDERS/TRAPS group), §7 item 8 | §9.3, tension 27 | 3.6, 3.8 | ✔ (INFERRED, flagged) |
| R2-VOL-07 | no deload or maintenance inside a block; cancel → maintenance → new block; deload = half of the hardest week, between blocks | §3.6, §3.12, §4; JSON `deload` | §9.5, §9.8, §9.13; JSON `deload` | 3.5, 3.10; JSON `progression_engine.deload` | **FIXED** (03 §11.1 #12 and JSON `answered_v0[11]` still said "triggers PROPOSED"; 11 Q15) |
| R2-VOL-08 | not understood → default (alternate the first exercise; bonus on the optional day) marked for a re-ask | §3.9, §7 item 13; JSON `set_placement` | §9.6 | 3.6 | ✔ |
| R2-SES-01 / SES-02 | heavy squat and heavy deadlift on different days; the counted axial list | §3.9 item 6; JSON `set_placement.hard_rules` | §9.10 | V25, 3.6, CA-11 | ✔ |
| R2-SES-03 | light core opener 2 × 2; core supersets / monster sets anywhere | §3.10; JSON `session_limits.core_opener` | §9.3, §9.10 | 3.6, R10-core | ✔ |
| R2-SES-04 | field athletes 12 + the 2-exercise core block | §3.10 | §9.7, §9.10 | 3.8 | ✔ |
| R2-SES-05 | full-body days 2-4 exercises per muscle group, never 1 | §3.9, §3.10, example 5.1; JSON | §9.7, §9.10, tension 29 | 3.6, 3.8, Example A, VP-8 | ✔ (flag below on example 5.3) |
| R2-SES-06 | cardio count adjustable; aesthetics 4 incl. a second Orange + optional walks | §3.10; JSON | §9.12 | 3.8, V21, CA-17 | ✔ |
| R2-ATH-01 / ATH-02 / ATH-03 | plyo shares by sport; ballistic vs plyometric lists; Receive-Create stages | §3.13; JSON `athletic` | §0, §9.9, §9.11; JSON | V19, LV-14, Example B | ✔ |
| R2-ATH-04 | Olympic lifts up to 4 × a week (cleans squat days, snatches hinge days) | §3.13 | §9.9, §9.11 | LV-12, 3.9 | **FIXED in 03** (§11.2 #5 and JSON `still_open` still listed in-season Olympic maintenance as open) |
| R2-ATH-05 | full squat cleans / snatches 3-5 reps, same weekly reps; ramp kept for DB/KB and pulls | §3.13 | §9.9, tension 3 | CA-14, 3.9, QM-1 | **FIXED in 03** (JSON `rep_selection.olympic.L3` said "1 to 3 - 3 to 5"; §9.6 strength row and JSON `progression.by_goal.strength` gave the 4 × 8 ramp for every Olympic lift) |
| R2-ATH-06 / ATH-07 | aerobic sessions by sport; in-season game-heavy reductions | §3.4, §3.10, §3.13 | §9.11, §9.12 | 3.3, 3.8 | ✔ |
| R2-ATH-08 | 60+: no Olympic lifts, plyos or depth jumps by default (optional with a warning); youth floor lifts from about 14 | §3.4, §3.13 | §9.11 | LV-11, 3.3 | **FIXED** (12 §2.8 still read "few plyos unless they ask"; 03 v1 rows 32 and 45 lacked †) |
| R2-PER-01 / PER-02 | year plan = gen-pop "stay in shape", fully tunable | §3.12; JSON `plan_shapes.yearly_gen_pop` | §9.8 | 3.10 | ✔ |
| R2-PER-03 / PER-04 | every plan a stairway; 12 weeks: last 4 weeks the hardest | §3.7.1, §3.12, §5; JSON `stairway` | §0, §8, §9.6, §9.8 | 3.3, 3.10 | ✔ (12 JSON `supersedes` rows that still showed "8 start hard / acclimation" as the current rule now carry `changed_again_in_v1_1`, fix 5) |
| R2-PER-05 | "start at a 2, end at an 11" = felt overall load | §3.7.2 (display level; RIR drift flagged against VOL-13) | tension 20; JSON `effort_targets` flag added | 3.3 | ✔ (flag kept) |
| R2-PER-06 | maintenance length chosen and extendable + end prompt; pre-season 4-6 weeks at ~60 % + 1-2-week taper | §3.4, §3.12; JSON | §9.8 | 3.3, 3.10 | **FIXED in 12** (pseudo-code applied × 1.05 to maintenance and pre-season starts, fix 2) |
| R2-PER-07 | tests before (or week 1) and at the end, never mid-block; untrained: 5RM / 3RM or 80-90 %, never a 1RM or max mile | §3.12; JSON `plan_shapes.tests` | §9.1, §9.8 | 3.10 | ✔ |
| R2-GEN-01 | plan works without tracking; optional check-in; week-by-week needs it | §3.12, §3.14 | §9.13 | 3.5 | ✔ |
| R2-GEN-05 | season start date + practice / game days | §4 step 0 | §9.1; JSON `inputs.season_rule` | Example B | ✔ |
| R2-GEN-06 | RIR / RPE weight guidance; % only when tested; Olympic lifts explained as power output | §3.13 | §9.6, §9.9 | 3.9, LV-8 | **FIXED in 03** (strength and Olympic % had no "only when tested" qualifier in §9.6, §9.9 and the JSON; 11 §3.3 strength row) |
| R2-GEN-02 | videos optional | no video rule in these files | none | none | ✔ (nothing to retire) |
| R2-LIB-01 | one-detail variations between blocks, never invented exercises | §3.9 item 7 | §9.8 | VP-4, 4.4 | ✔ |
| R2-LIB-03 | keep both rotation biases weekly; use them to pick swaps | §3.6 | §9.5 | V13 | ✔ |
| R2-LIB-04 / LIB-10 | KB face pulls = shoulder work on pull or shoulder days | §3.1 | §1 | 3.2 | ✔ |
| R2-LIB-06 | '21.6 mile run' removed | - | §7.2, tension 23 | V21 | **FIXED in 03 JSON** (`observed.conditioning.marathon_flag` lacked the removal) |
| R2-LIB-07 | library additions (belt squat, seated machine shoulder press, hang clean, single-arm DB snatch, KB squat clean, hex-bar jump ...) | §3.13, example 5.2 | §9.9 (tag added) | V10 | ✔ |
| Coach request 2026-10-08 | all popular US sports incl. swimming; pickleball and HYROX for gen pop ("stay athletic and active") | §3.4 row; **§3.10 and §3.13 now map the sports outside his list to the 04 ground-contact classes** | §9.1, §9.11 row; **new §9.11 paragraph + JSON `other_us_sports_v1_1`** | 3.3 row | **FIXED** (fix 8) |

**Fixes made in this pass.**
1. **KB swings still credited in the observed program views (03; R2-VOL-05, VOL-10).** The decode files bucket KB swings as bilateral hip dominant (his library files them there, OBSERVED), so the v1.1 recompute still gave them hamstrings 1.0 and glutes 0.25. Twelve views changed: MM athletic STARTING (3 swing sets a week), boxer weeks 3-6 (3), 7 (4), 8 (6), baseball block 1 mean (2.29), block 2 mean (3.14), block 2 'WEEK 8' (5), block 2 'DELOAD WEEK' (3), block 3 mean (2). JSON: `normalized_muscles_coach_v1_1` corrected, new per-view field `kb_swing_sets_no_credit_v1_1`, `coach_count_summary.v1_1` medians and band counts recomputed (only glutes and hamstrings move; the other ten muscles reproduce the stored values exactly). Markdown: §3.1 (nine rows), §3.2 athletic row (glutes 6.28 → 6, hamstrings 17.6 → 14.5), §3.3 rows (glutes 25 / 31 / 2 / 0 / 0 / 0; hamstrings 1 / 10 / 20 / 26 / 1 / 0), §0 and the §3.5 / §3.6 sentences (boxer week 8 hamstrings 28 → 22). The `res` column and the §2 / §8 observed totals keep the swings as written (library category); only muscle credit changed.
2. **Next-block start in 12's pseudo-code (MD and JSON; R2-VOL-06, PER-06).** It multiplied the table start by 1.05 after the maintenance and pre-season overrides, so a maintenance phase or a pre-season block after a completed block was inflated by 5 %, and it never compounded block to block. Now: stairway blocks start at the previous start × 1.05 (round half up; 15 → 16 → 17 → 18 as in §3.12 and example 5.4), the same start after a cancelled block (PROPOSED), the table start only for a first block; maintenance and pre-season stay flat with no × 1.05 and no floor.
3. **12 §2.8** still said older clients get "few plyos unless they ask"; now R2-ATH-08 (none by default, optional with the warning).
4. **12 JSON priority caps:** calves were L2 22 / L3 26 (a v1 small-cap leftover) against 12 §3.3's 18 / 26 / 30; rear delts lacked L1 12. Aligned with the Markdown.
5. **12 JSON `supersedes`:** the v1 rows the Markdown marks † (rates from readiness, credit 0.5, deload dose, "8 start hard / 12 acclimation" plan shapes, session budget, readiness gates) carried no marker, so a JSON reader saw retired rules as current. Each now has `changed_again_in_v1_1`. `stairway.retired_v1.phase_limits` now says that only the acclimation and 8-week caps are retired (flat maintenance, flat in-season and fight-prep waves stay live).
6. **12 §7 item 14 (older adults ≤ 3 %):** note added that the R2-VOL-03 proposal he answered "No" listed 60+ among the 3 % defaults; his reason was missing check-in data, not age, so the rule stays PROPOSED for a re-ask.
7. **03 / 11 weight guidance (R2-GEN-06) and Olympic reps (R2-ATH-05):** "% only when a recent tested best is entered, otherwise RIR; Olympic lifts explained as power output" added to 03 §9.6 (strength row), §9.9 (matrix strength and Olympic cells, effort paragraph), the 03 JSON (`progression.by_goal.strength`, `rep_selection.matrix`, `effort_targets`) and 11 §3.3 / JSON `goal_modifiers[1]`; 03 JSON `rep_selection.olympic.L3` "1 to 3 - 3 to 5" → 3-5 reps.
8. **New sports (coach request 2026-10-08):** 12 §3.13 and 03 §9.11 now say how any sport outside his ranked list is placed: by its ground-contact class from `04_athlete_profiles` / `synthesis/sports/` (class 1-5 = 75 / 60 / 50 / 40 / 25 %, his approved shares), e.g. swimming class 4 (25 → 40 %), pickleball, padel and HYROX class 3 (50 %, PROPOSED); 12 §3.10 takes the aerobic count of those sports from their profile (competitive swimmers 0 gym aerobic sessions by default, PROPOSED there). JSON twins: 12 `athletic.plyo_share_by_sport.classes_04`, `session_limits.aerobic_sessions_per_week.other_sports`; 03 `sport_profiles_L2_weekly.other_us_sports_v1_1`.
9. **History and status cleanup:** 03 tension 8, §11.1 #1 / #11 / #12, §11.2 #5 and their JSON twins (`tensions[7]`, `open_questions.answered_v0`, `still_open`) updated to the stairway, short training blocks and between-block deloads; 03 v1 change rows 5, 7, 11, 32, 45 marked † (JSON `changed_again_in_v1_1`); 03 JSON `observed.conditioning.marathon_flag` records R2-LIB-06; 03 JSON `effort_targets.planned_drift_flag_v1_1` and `progression.by_goal_key_note` (the v1 key `person_rate_moves` now means what the stairway moves); 03 §3.1 note names `normalized_muscles_coach_v1_1` as the table source; 11 §8 Q15 and Q23 (and JSON `answered_v0_questions`) and the UNI-05 row (†).

**Leftover scans after the fixes (all six files).** Acclimation / start-hard / target-seeking / × 1.10: only in retired notes, † history and change logs. Triggered or mid-block deloads: only in retired notes (`readiness_gate` and `deload.retired_v1` carry `"retired": true`), the block-at-risk prompt and observed evidence (CA-16, 03 §9.8). Sleep / stress / life / physical job: only in the "removed" rows, the dropped-life-cells flag and 12 §2.6 research marked background only. Effort 10 = fail: none ("10 - I'm done" survives only as his menu label, read as the successful max). KB-swing glute credit: none after fix 1. One exercise per muscle on full-body days: only in the answered question texts. Olympic once a week: none (the in-season light piece is a dose, not a cap). Mid-block tests: none. 1RM tests from zero: none (every test row carries the "never from zero" rule). Mandatory videos: no video rule in these files.

**Flags kept (not decided here; round 3).**
- The life cells of R2-VOL-01 are dropped because of R2-GEN-04 (resolution stated in 12 §3.7.3, 03 §9.13, 11 3.5).
- Rear delts 4 / 6 / 8 vs the floor of 10 (read on the shoulders group, INFERRED).
- The planned 3 → 1 RIR drift (PER-05) vs VOL-13's "no planned RIR ramp".
- R2-VOL-08 default to re-ask with an example.
- The floor lifts field athletes' chest and back from 7.5 to 10.
- New: an L1 12-week plan (λ 0.76) adds no set until weeks 5-6, so its first weeks climb through reps and load (double progression) and the display level, not through sets; worth showing the coach against his "the steps are a little bit smaller, but they're gradually going up".
- New: example 5.3 (tennis) Friday has one direct glute exercise (single-leg hip thrust) while glutes are credit-only for field athletes; whether R2-SES-05 applies to an athlete's resistance block is 11's open question 20.
- New: 03's observed `res` totals still count KB swings as written (library category); 03 JSON `normalized_muscles_coach_v1` (v1 history) keeps the old KB credit.

**Not re-run.** The v1.1 prototype (`r2_vol/`) sits in another session's scratchpad; no fix changes a number in the worked examples (none credits a KB swing to a muscle; example 5.4's next-block numbers already equal the previous start × 1.05), so 12 §5, 11 3.12-3.13 and the stairway tables were checked, not recomputed (12's 18 planned-stairway rows match its JSON exactly).

---

## v1.2 update: round 3 applied (2026-10-09)

`coach_answers_round3.md` read in full first, then this file and its JSON, `12_volume_algorithm_v1` (v1.2, written in the same pass), `11_training_variables` and `05_session_architecture`. Every round-3 answer that touches dosing was traced into the rules (sections 0, 1, 8, 9), the tensions and questions (10, 11) and the JSON (`meta`, `v1_2_changes`, `inputs`, `counting`, `generator_rules`, `feedback_loop`, `tensions`, `open_questions`). The observed evidence (sections 2-7) is unchanged: it records what his sheets show. The numbers that 12 owns (starts, ceilings, Focus muscles, the stairway tables, the worked examples) were recomputed there with the v1.2 prototype (`r3_vol/` in the session scratchpad); the 9.6 bank illustration is unchanged because it never used a check-in. No Google Sheet was opened or changed.

---

## v1.2 verification log

**Adversarial check of the round-3 update, 2026-10-09.** One log for the four volume and session files; the same text is appended to `12_volume_algorithm_v1.md`, `03_volume_dosing.md`, `11_training_variables.md` and `05_session_architecture.md`. JSON twins: `verification.v1_2_adversarial` (12), `verification_log.v1_2_adversarial` (03, 11), `_meta.v1_2_adversarial_verification` (05).

**Method.** `coach_answers_round3.md` read in full first. Then the v1.2 change tables, rule sections, tables, worked examples, pseudo-code and JSON of 12, 03, 11 and 05. Every round-3 answer that touches these files was traced to the rule that carries it in each file, in the Markdown **and** the JSON (a change-log line alone did not count). Leftover scans (regex over all eight files; every hit outside history sections and "retired" notes read by hand) for: check-in; readiness; a weekly step from effort or feedback; `adapt()`; logbook-driven changes and "learn from users' data"; stored user data; rear delts as a line with a floor of their own; Apache / CC BY licensing; a mandatory maintenance or easy week; the old PAR-Q wording. The time policy of the v1.2 prototype (`r3_vol/tvm.py`) was re-run once with one change (fix 6). All four JSON files parse; indent 1, UTF-8 and the missing final newline are unchanged. `node --test tests/` gives the same 7 failures before and after this pass (the stale compiled `model/` and the cross-checks that wait on the engine, flag 3); no new failure. Backups of the eight files before this pass: session scratchpad `r3_adv/backup/`. No Google Sheet was opened or changed.

**Round-3 answers traced (✔ = applied in rules, tables, examples and JSON; FIXED = gap closed in this pass).**

| Answer | Rule | 12 (engine) | 03 (dosing) | 11 (variables) | 05 (sessions) | Status |
|---|---|---|---|---|---|---|
| R3-VOL-01 | one shoulders line (front + side + rear delts), group credit, floor of 10 read on groups, a rear-delt exercise every week, "add rear delts" | §0, §3.1, §3.3, §3.10.2; JSON `starting_table.muscles.shoulders`, `counting` | §1, §9.2, §9.3, tension 27; JSON `counting.group_credit_v1_2`, `weekly_sets` | 3.2, 3.6 item 10, 3.8 | 0, 6.13, 9 step 11; station notes | **FIXED** (03 §3 rear-delt evidence line; 05 JSON: 40 station evidence strings and 7 station notes still said "rear delts get their own sets") |
| R3-VOL-02 | no check-in, nothing adapts; printed self-adjust guide | §3.7.3, §3.14 | §9.13 | 3.5 | 6.12, 6.13, 9 | ✔ (history leftovers marked, fixes 1, 8) |
| R3-VOL-03 | Monday's first exercise, then Thursday's; bonus on the optional day or a day that already trains it | §3.9 | §9.6 | 3.6 | 6.13 | ✔ |
| R3-VOL-04 | stairway ~3 % then ~5 %, peak in the last week, effort 3 → 2 → 1-2 → 1 RIR + intensifiers; outputs only | §3.7.1-3.7.2; JSON `stairway` | §9.6, §9.9, tension 20 | 3.3, 3.10 | 6.12, 9 | **FIXED** (fix 4; 11's 12-week row still said "numbers PROPOSED"; 05 6.12 lacked the approval) |
| R3-SES-01 | FOCUS groups (hips, shoulders); calves one exercise × 3 sets per leg day; field athletes 2-4 per group inside 12 + 2 core, cross pattern default, same-pattern template for size / high level; Focus muscle 1 / 2 +1-3, no sex field | §3.3, §3.5, §3.10 | §9.1, §9.4, §9.7, §9.10 | 3.6, 3.8 | 0, 4.7, 6.6, 7.2, 8 | ✔ (flag 4) |
| R3-SES-02 | tell up front + offer → fewer groups directly → supersets → stairway on the trained groups; block ids, on/off toggles, add / remove, superset recommendation per pair | §3.10.1-3.10.3, §5.1, §5.5 | §9.7, §9.10 | 3.6 items 11-12, 3.8 | 5.1, 8.7.1, 9; JSON `blocks_R3SES02`, `superset_recommendation_R3SES02` | **FIXED** (fix 6; 5.5 keep order) |
| R3-PER-01 | easy week recommended, never mandatory; the block ends and the user builds the next; holidays between blocks | §3.12 | §9.8 | 3.10 | 6.12, 9 step 10, 10 | **FIXED** (12 holiday mark "then maintenance"; 05 6.12 "does a maintenance phase"; 05 section 10; 05 JSON `deload_test_architecture.status` still named the v1.1 rule current) |
| R3-ATH-01..05 | swimming dryland; 60+ and racket 50+ defaults; HYROX; R3-ATH-04 shares and in-season list; play days, cardio credit, event dates | §3.4, §3.10, §3.13 | §9.10-9.12 | 3.3, 3.8 | 6.7, 8.2, 8.5, 8.8, 8.9 | **FIXED in 11** (swimmers row; in-season game-heavy list lacked the R3-ATH-04 sports) |
| R3-GEN-01 | nothing stored; short Blaze Camp health check (EN / ES, link to the official PAR-Q+), coach skip after the warning, "use at your own risk" + terms + liability release at every build | §2.2, §3.14, §1 | §9.3, tension 13 | 3.2, v1 item 26 | 9 step 1 | **FIXED** (fix 2; 05 still read "PAR-Q for clients ... R2-GEN-03") |

**Fixes made in this pass.**
1. **12 ‡ markers.** The v1.2 change table carried ‡ on its rows 2, 4, 6, 7, 8, 10, 12 and 13, which are the numbers of the v1.1 rows that round 3 changed (the intro says the v1.1 rows carry ‡). Moved to v1.1 rows 2, 4, 6, 7, 8, 10, 12, 13, and rows 1 and 3 marked too (start from the week-1 sets; the "too easy +2 points" inside row 3). JSON: every changed v1.1 entry of 12, 03 and 11 now carries `changed_again_in_v1_2`, and each `v1_1_*` block says it is history; 12 `supersedes[13]` (stairway "+ check-in table") marked; 12 `verification._note` says its top-level keys are the v1.1 run.
2. **Stored data (R3-GEN-01).** 12 §2.2 said "the engine stores both counts so the data can later show which predicts results better"; 03 tension 13 (MD and JSON) said "both counts stored". Both now: the Pelland count may be shown, nothing is stored. 12 §1 and 03 §9.3 ("the tool learns from the data of all the people", "we'll collect data") carry the R3 marker; 11 v1 item 26 ("level up when logs read ...") says no logs are read.
3. **Health check (R3-GEN-01).** 05 section 9 step 1 and JSON `generator_algorithm[0]`: the short Blaze Camp health check in English and Spanish with a link to the official PAR-Q+, the coach's skip after the legal warning, the "use at your own risk" box and the terms and liability release at every build, nothing stored, pointing to `DISCLAIMER.md` / `DISCLAIMER.es.md` (not rewritten).
4. **Ceiling vs step size (R3-VOL-04).** The approved text asks for both "about 3 % ... about 5 %" and "reaches its ceiling exactly in the last week". With λ ≤ 1 a line whose ceiling is more than × G(N) above its start peaks below it: 12-week L2 / L3 shoulders and arms reach 18 / 23 against 22 / 25 (12 §3.7.1 table), while 03 §9.4, 03's v1.2 change row and 11 3.3 said "every trained line reaches its ceiling". Stated as an INFERRED reading in 12 §3.7.1 (JSON `stairway.ceiling_reach_v1_2`) and 11 3.3, wording corrected in 03 and 11, flagged: 12 §7 item 16, 03 tension 33 and question 11.5-5, 11 question 25. No number changed.
5. **Machine-readable regressions in 12 JSON.** `stairway.limits.nonpriority_while_priority` had become a string (the compiler's cross-check X05 reads a number): restored to 0.03, scope in `nonpriority_scope_v1_2`; `stairway.limits.tag` no longer calls the retired older-adult cap PROPOSED. 03 JSON `generator_rules.caps.retired_v1_1` held round-3 retirements: renamed `retired_v1_2` (no tool reads it); 03 MD §9.7 "Retired (v1.1, round 3)" → v1.2. 03 JSON `focus_muscles.others` and `feedback_loop` pointed at `tensions[31]` / `tensions[26]` (0-based indexes of the wrong tensions) → `tensions[30]` / `tensions[25]`. 11 JSON `checkin.retired_v1_1.source_12` pointed at 12 paths that no longer exist; `readiness_gate` gained a v1.2 status (its v1.1 replacements are retired too).
6. **Time policy, step 2 (R3-SES-02).** The prototype gives a kept group that starts above its floor a ceiling of *its week-1 sets + the level's climb*, which can pass the level ceiling (R2-VOL-06): in 12 §5.1 shoulders 16 and biceps 15 against the L1 ceiling 14 (time-lowered to 15 and 14), and §5.1 / §3.10.1 printed "ceilings lowered to ... shoulders 15, biceps 14". Re-run here with the step-2 ceiling clamped to the level ceiling (never below week 1 + 2): §5.5 is unchanged; in §5.1 the 4 × 60 client keeps hips, quads, back, chest and shoulders (quads and back reach 14) and biceps join triceps and calves on compound credit. Documented in 12 §3.10.1 and §5.1 and JSON `session_limits.time_vs_minimums_R3SES02.step2_ceiling_flag_v1_2`; clamping proposed, 12 §7 item 4. The published 5.1 numbers are the unclamped run.
7. **Smaller round-3 gaps.** 12 §3.12: a holiday mark inside a block ends it "then maintenance" → maintenance optional (R3-PER-01); 05 6.12 and section 10 likewise; 05 6.12 now carries the R3-VOL-04 approval; 12 §5.5 keep order listed calves twice; 11 3.10 / JSON `plan_shapes[0]` "numbers PROPOSED" → approved (R3-VOL-04); 11 3.3 swimmers row (2 days for younger or lower-level swimmers, Olympic 2-3 days, 25 % plyo) and in-season game-heavy list (R3-ATH-04 sports) completed in MD and JSON; 03 tensions 6, 8 and answered v0 questions 1, 12 and 15 got their v1.2 status; 03 §11.2 item 7 pointed at "12 §7 (v1.1)".
8. **History logs.** The v1.1 verification logs of 12, 03 and 11 now open with a one-line note that round 3 retired or settled what they treat as current (check-in, rear delts 4 / 6 / 8, R2-VOL-08, the end prompt).

**Leftover scans after the fixes (all eight files).** Check-in, step tables, 'Failed', holds, repeated weeks, the block-at-risk prompt, the week-by-week mode, readiness and the life column: only in "retired" notes, ‡ / † history rows, `*_retired_*` JSON keys, the v1.1 tables kept "for the record" and the verification logs. `adapt()`: none. Logbook: only as a printed page for the user's own notes ("never read back") and as OBSERVED sheet evidence. Stored data / learning from users: only "nothing is stored" statements and retired notes. Rear delts with their own 4 / 6 / 8 or caps 8 / 12 / 16: only in retired notes, v1.1 history and the observed evidence; every current rule reads them inside the shoulders group. Apache / CC BY / Creative Commons: none in these files. A mandatory maintenance or easy week: none ("recommendation, not mandatory" everywhere). PAR-Q: only in 05 section 9 step 1 (now R3-GEN-01) and the v1.1 05 verification table (history). Level up on '8 - That was perfect' or easier stays: it is the coach's own PER-06 rule (RIGHT), judged by the user or coach at the rebuild, never read from logs.

**Flags (not decided here).**
1. Ceiling vs step size (fix 4): keep the small steps or let the late steps rise to 7 % - 12 §7 item 16.
2. The step-2 ceiling clamp (fix 6), which changes §5.1's keep-time branch (biceps to compound credit) - 12 §7 item 4.
3. Engine / compiler follow-ups (outside these files): the compiler cross-checks X01 / X02 / X05 still compare the engine's v1.1 rules (side and rear delts as separate lines, 3 % for 60+) with 12 v1.2; `tools/compile/templates-profiles.mjs` maps the optional-day Calves condition to `if_priority:calves` only when it contains "priority", and 05 v1.2 now says "a Focus muscle", so those 14 stations compile to a plain-text condition; `model/` needs a recompile. The 05 station notes changed here keep the word "rear", which the compiler reads to pick the rear-delt variant, and add no exercise keyword the engine matches.
4. 12 §5.4 hotel-gym maintenance week: calves on Monday and Thursday only, while Tuesday and Friday train hips (RDL, hip thrust, leg curl); maintenance is not floored, but one calf exercise per leg day (R3-SES-01) is not met there. Prototype output, not recomputed.
5. 03 JSON `v1_changes[39].where` ("tensions[24]", 0-based would be [23]) is v1 history and left as written.

**Not re-run.** Apart from the clamp experiment (a copy of `tvm.py` with a CLAMP switch in `r3_adv/proto/`; the published numbers stay the unclamped run), no worked example or table was recomputed; no fix changes a published number.


## v1.3 update: round 4, CT-01 and CX-01..04 applied (2026-10-11)

- Read first, in full: `design/ENGINE_V05_PLAN.md`, `coach_answers_round4.md`, `coach_answers_time_2026-10-10.md`, `coach_answers_codex_2026-10-10.md`.
- Added the v1.3 section; marked §9.3, §9.6-§9.10 and §9.12 as changed; retired the 7 % and 10 % rows, the exercise counts by minutes, the time-vs-minimums row and the session lengths as limits; fixed §0 rows 1 and "Weekly increase", the §9.1 input rows and tension 29.
- The blocks of sections V2 to V4 are the same text as `BLAZE_CAMP_BRAIN.md` v1.3 (§5.4, §5.6, §7.4); "master §" in them points to that file.
- Not changed: the observed evidence of sections 2-8, the v1 / v1.1 / v1.2 change logs and verification logs (history), and `03_volume_rules.json` (v1.2; not re-issued - the compiler layers in `tools/fixture/v05-*.mjs` carry the v1.3 rules into `model/`).