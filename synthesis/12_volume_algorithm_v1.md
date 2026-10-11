# 12 · Volume algorithm v1.3 (research + design)

**What this is.** The weekly-volume engine for the Blaze Camp plan generator: how many hard sets each muscle group gets per week, how that number climbs week to week (the **stairway**), where each new set goes, how those sets are split over the slots of his own day templates, what the plan says when a template cannot hold a group, and what the user or coach may edit in the finished plan (v1.3: session minutes are no longer an input or a limit, COACH-CT CT-01). It answers the coach's request: *"go find charts that show those averages and match them with my experience"*, *"what has been studied on volume"*, *"what would be the best algorithm for us"* and *"this tool should figure out the percentages"* (COACH-ANSWER VOL-01, UNI-01, VOL-06). The machine-readable twin is `12_volume_algorithm_v1.json` (same folder; the JSON twin is still v1.2 and was not re-issued in v1.3: the compiler layers `tools/fixture/v05-*.mjs` carry the v1.3 rules into `model/`, and the working arithmetic is `engine/progression/` and `engine/volume.mjs`, engine 0.5.0).

**Status.** v1.3, 2026-10-11: round 4, CT-01 and CX-01..04 applied (the v1.3 section below; it wins over every later section). Before that: v1.2, 2026-10-09. Built on the coach's round-1 answers (`coach_answers_full.md`), his round-2 answers (`coach_answers_round2.md`) and his round-3 answers (`coach_answers_round3.md`, read in full first). **Authority order (v1.3): round-4 answers and CT-01 > CX-01..04 > round-3 answers > round-2 answers > round-1 answers > everything else** (sheets, science, team decisions). Where he left a gap or asked us to propose, the rule is marked **PROPOSED - PENDING COACH APPROVAL** (short form below: **PROPOSED**).

**Evidence tags (on every rule).**

| Tag | Meaning |
|---|---|
| **COACH-R4 <ID>** | The coach's round-4 answer (question R4-<ID> in `coach_answers_round4.md`, 2026-10-11). **Outranks everything below**, together with CT-01. |
| **COACH-CT CT-01** | His clarification of 2026-10-10: session time is the user's responsibility (`coach_answers_time_2026-10-10.md`). It supersedes earlier answers only on fitting plans into a session length. |
| **COACH-CX CX-01..04** | His clarifications of 2026-10-10 on progression and editable templates (`coach_answers_codex_2026-10-10.md`). Above round 3, below round 4 and CT-01. |
| **COACH-R3 <ID>** | The coach's round-3 answer (question R3-<ID> in `coach_answers_round3.md`, e.g. COACH-R3 VOL-04 = R3-VOL-04). A RIGHT chip with no text makes our proposal his rule; PARTLY means his words define the rule. **Outranks everything below.** |
| **COACH-R2 <ID>** | The coach's round-2 answer (question R2-<ID> in `coach_answers_round2.md`, e.g. COACH-R2 VOL-06 = R2-VOL-06; LIB-10 and LIB-12 are the round-1 leftovers answered there). |
| **COACH-ANSWER <ID>** | The coach's round-1 answer (question ID from `coach_answers_full.md`). A RIGHT chip with no text makes our assumption his rule. |
| **OBSERVED** | Read from his Google Sheets (via the dumps and decode notes). |
| **SCIENCE** | Published research, a practitioner survey or a published coaching reference, cited with a URL (section 8). |
| **INFERRED** | Our reasoning from observed data or from his words. |
| **PROPOSED** | Our design to fill a gap. It needs his OK before it ships. |

**How the numbers were made.** *v1.3:* the stairway tables of the v1.3 section were computed with the engine kernel (`engine/progression/stairway.mjs`, `planStairway`); the worked examples of section 5 are v1.2 numbers and are marked as such. *v1.2:* Every worked example in section 5 and every stairway table in section 3.7 was computed by the reference prototype v1.2 (`r3_vol/vol_engine_v1_2.py`, `tvm.py` for the time-vs-minimums policy, `ex51_v12.py`, `ex12_v12.py`, `mk_tables_v12.py`; outputs `examples_v1_2.json` and `md_tables_v12.json`, in the session scratchpad; see the computation notes at the end). The v1.1 prototype (`r2_vol/vol_engine_v1_1.py`) is kept unchanged for the record. Nothing in the coach's Google Sheets was opened or changed.

---

## v1.3 - round 4, CT-01 and CX-01..04 applied (2026-10-11)

The coach's newest answers outrank everything below: round 4 (`coach_answers_round4.md`, 20 answers, 2026-10-11), his clarification on session time (`coach_answers_time_2026-10-10.md`, **CT-01**) and his clarifications on progression and editing (`coach_answers_codex_2026-10-10.md`, **CX-01..04**). **Authority order: round 4 and CT-01 > CX-01..04 > round 3 > round 2 > round 1 > chat statements > sheets.** **Where this section and a later section of this file disagree, this section wins.** Later sections that v1.3 supersedes carry a "RETIRED in v1.3" or "Changed in v1.3" note under their heading; the text under such a note is history. The master record is `BLAZE_CAMP_BRAIN.md` v1.3 (what changed: §0d). The JSON twin `12_volume_algorithm_v1.json` was not re-issued.

### V1. What v1.3 changes in this file

| # | Change | Sections below it replaces | Source |
|---|---|---|---|
| 1 | **No time-fitting.** Session minutes are not an input and not a limit. The time-vs-minimums algorithm is retired with its offers, its keep order, its keep-time ceilings, its minimum climb and "never flat". The time model stays only as the arithmetic of a printed estimate | §0 rule 11; §3.10 (time model as a limit); §3.10.1; §4 (the time check); §5.1; §5.5; §7 items 4, 5, 12 | COACH-CT CT-01; COACH-R4 R4-SES-01 |
| 2 | **Session size by exercise count**, by client type; a recommendation in a template | §0 rule 10; §3.10 table | COACH-R4 R4-SES-02 |
| 3 | **His templates are the skeleton**; the weekly sets are split over the template's slots; on full-body days the A / B template gives each group its exercises (1-4), on split days 2-4 | §0 rules 9, 10; §3.9; §3.10 | COACH-R4 R4-SES-05 |
| 4 | **Two training days**: every big group at about 6-8 weekly sets, a third day suggested; the floor of 10 applies from 3 training days | §3.3 (floor); §5.5 | COACH-R4 R4-SES-03 |
| 5 | **Nothing dropped automatically**; what a template cannot hold is said | §3.10.1 step 2 | COACH-R4 R4-SES-04 |
| 6 | **The planned final sets are reached**; steps may be faster than 3 % / 5 % (λ may pass 1) | §0 rule 6; §3.7.1; §7 item 16 | COACH-CX CX-01; COACH-R4 R4-PRG-01 |
| 7 | **No rate limit; a note above about 15 %** | §3.7.4; §7 item 8 | COACH-CX CX-01; COACH-R4 R4-PRG-02 |
| 8 | **A week may keep the same sets** while reps or load progress; at the top, sets stay | §3.7; §3.10.1 step 4 | COACH-CX CX-02, CX-03 |
| 9 | **Reps and load progress by a rule the person applies** | §3.7.2 (adds to it) | COACH-R4 R4-PRG-03 |
| 10 | **Next block**: about 5 % above the last block's start, never above the level's top; "ceiling + 1" retired | §0 rule 14; §3.12; §7 item 7 | COACH-R4 R4-PRG-04 |
| 11 | **Everything is editable**, the sets of any day or week included; after an edit the totals are recomputed and the plan is marked edited (an edit does not rebuild the plan) | §0 rule 12; §3.10.2 | COACH-CX CX-02, CX-04 |
| 12 | **Credit map**: carries and sled work credit no muscle; a 30-45 degree incline press counts 1.0 chest, a high-incline press 1.0 front delts + 0.5 chest + 0.25 triceps (PROPOSED) | §3.1 | COACH-R4 R4-LIB-02, R4-LIB-03 |

### V2. Session size, groups and the time estimate

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

**Time vs minimums: retired.**

v1.2 ran a time check before every plan (R3-SES-02: tell up front and offer another day or longer sessions; with the time kept, train fewer groups directly, big movers first; supersets; the stairway climbs, never flat). The coach removed it: "You need to stop trying to be responsible for the people's time ... I want you to not get complicated over the time."

| v1.2 piece | v1.3 |
|---|---|
| The session-length question and the time check | gone; a time estimate is printed as information |
| Offers (another day, longer sessions, switch blocks off to save minutes) | gone; the 2-day plan suggests a third day (master §5.6.2) |
| "Keep my time": fewer groups trained directly; keep order; "not trained directly (time)" | gone; nothing is dropped automatically (R4-SES-04) |
| Supersets "needed" for a day to fit | gone; supersets are a recommendation the person switches on (R3-SES-02 stands here) |
| Keep-time ceilings, the minimum climb, "never flat" | gone; every group reaches its planned final sets, or the plan says what its template cannot hold (master §5.6.3) |
| The worked examples by minutes (4 × 60, 2 × 45, the class at 4 × 60) and the 30-template table | history only (`BLAZE_CAMP_BRAIN_v1_2.md` master §5.6.1; 12 §5.1, master §5.5; 05 §8.7.1) |

What stays from R3-SES-02: supersets recommended to save time; a day's athletic or core block can be switched off; exercises and blocks can be added or removed (master §10.10).

### V3. The stairway in v1.3: the planned final sets are reached

**(a) The planned stairway (the math; pattern APPROVED R3-VOL-04; endpoint COACH-CX CX-01, COACH-R4 R4-PRG-01; kernel `engine/progression/stairway.mjs`)**

```
halfway week          h = ceil(N / 2)                                   (N = weeks in the training block)
default pattern       s_w = 3 %  if 2 <= w <= h      ("a little bit smaller")
                      s_w = 5 %  if h <  w <= N      ("a little bit higher, but not too much")
start                 S = the group's start for the level (+ Focus F); on a 2-day plan 6 for a big group        (master §5.3, master §5.6.2)
planned final sets    P = the group's top for the level (+ Focus F), whole sets; on a 2-day plan 8             (R4-SES-03)
scale factor          lambda solves  S x product over w = 2..N of (1 + lambda x s_w) = P
                      lambda < 1: smaller steps than the pattern (the range is narrow or the plan is long)
                      lambda > 1: FASTER steps than the pattern - allowed, with no cap on lambda                (CX-01)
curve                 T(1) = S;  T(w) = T(w-1) x (1 + lambda x s_w);  T(N) = P
whole sets            round T(w) half up, but hold the count at least one set under P until the arrival week;
                      the arrival week is the last week (one week early at most); never fewer sets than the week before   (R4-PRG-01)
note                  a week that adds more than about 15 % carries a note; one whole set alone is never noted  (R4-PRG-02; detail PROPOSED)
the template          a week's number is also capped at what the group's slots hold that week (2-5 sets an exercise, 2-4 at L1);
                      what the slots cannot hold goes to the bonus exercise, or the group is capped and the plan says so   (master §5.5, master §5.6.3)
flat blocks           P = S (the year's cut quarter, a maintenance plan, a group already at its top):
                      the sets stay and reps and load carry the progress                                         (CX-02, CX-03)
```

**Retired from this block in v1.3:** `P = min(C, S x G(N))` with λ never above 1; "planned step ≤ 7 %; total weekly resistance sets strictly below +10 %"; "other lines ≤ 3 % while a priority push runs"; the "time / exercise limits" clause with its minimum climb.

**Planned weekly sets (whole sets; one group on its own, computed with the engine kernel for this file; Focus lines carry the default +2):**

| Plan | Group (start → planned final sets) | λ | Weeks 1 → N | Biggest week | Noted weeks |
|---|---|---|---|---|---|
| 12 wk | L1 big / shoulders / arms 10 → 14 | 0.76 | 10 · 10 · 10 · 11 · 11 · 11 · 12 · 12 · 13 · 13 · 13 · 14 | +1 set | none |
| 12 wk | L2 big 15 → 22 | 0.87 | 15 · 15 · 16 · 16 · 17 · 17 · 18 · 19 · 19 · 20 · 21 · 22 | +1 set | none |
| 12 wk | L3 big 20 → 25 | 0.50 | 20 · 20 · 21 · 21 · 21 · 22 · 22 · 23 · 23 · 24 · 24 · 25 | +1 set | none |
| 12 wk | L2 shoulders / arms 12 → 22 | 1.39 | 12 · 12 · 13 · 14 · 14 · 15 · 16 · 17 · 18 · 19 · 21 · 22 | +2 sets (10.5 %) | none |
| 12 wk | L3 shoulders / arms 15 → 25 | 1.16 | 15 · 16 · 16 · 17 · 17 · 18 · 19 · 20 · 21 · 22 · 24 · 25 | +2 sets (9.1 %) | none |
| 12 wk | L1 Focus muscle (+2) 12 → 16 | 0.65 | 12 · 12 · 12 · 13 · 13 · 13 · 14 · 14 · 15 · 15 · 15 · 16 | +1 set | none |
| 12 wk | L2 Focus muscle (+2) 17 → 24 | 0.78 | 17 · 17 · 18 · 18 · 19 · 19 · 20 · 21 · 21 · 22 · 23 · 24 | +1 set | none |
| 12 wk | L3 Focus muscle (+2) 22 → 27 | 0.46 | 22 · 22 · 23 · 23 · 23 · 24 · 24 · 25 · 25 · 26 · 26 · 27 | +1 set | none |
| 12 wk | 2-day plan, big group 6 → 8 | 0.65 | 6 · 6 · 6 · 6 · 6 · 7 · 7 · 7 · 7 · 7 · 7 · 8 | +1 set | none |
| 8 wk | L1 big / shoulders / arms 10 → 14 | 1.19 | 10 · 10 · 11 · 11 · 12 · 12 · 13 · 14 | +1 set | none |
| 8 wk | L2 big 15 → 22 | 1.36 | 15 · 16 · 16 · 17 · 18 · 19 · 21 · 22 | +2 sets (10.5 %) | none |
| 8 wk | L3 big 20 → 25 | 0.78 | 20 · 20 · 21 · 21 · 22 · 23 · 24 · 25 | +1 set | none |
| 8 wk | L2 shoulders / arms 12 → 22 | 2.19 | 12 · 13 · 14 · 15 · 16 · 18 · 20 · 22 | +2 sets (12.5 %) | none |
| 8 wk | L3 shoulders / arms 15 → 25 | 1.83 | 15 · 16 · 17 · 18 · 19 · 21 · 23 · 25 | +2 sets (10.5 %) | none |
| 8 wk | L1 Focus muscle (+2) 12 → 16 | 1.01 | 12 · 12 · 13 · 13 · 14 · 14 · 15 · 16 | +1 set | none |
| 8 wk | L2 Focus muscle (+2) 17 → 24 | 1.22 | 17 · 18 · 18 · 19 · 20 · 21 · 23 · 24 | +2 sets (9.5 %) | none |
| 8 wk | L3 Focus muscle (+2) 22 → 27 | 0.72 | 22 · 22 · 23 · 23 · 24 · 25 · 26 · 27 | +1 set | none |
| 6 wk | L2 big 15 → 22 | 1.90 | 15 · 16 · 17 · 18 · 20 · 22 | +2 sets (11.1 %) | none |
| 6 wk | L2 shoulders / arms 12 → 22 | 3.08 | 12 · 13 · 14 · 17 · 19 · 22 | +3 sets (21.4 %) | weeks 4 and 6 |
| 4 wk | L2 big 15 → 22 | 3.15 | 15 · 16 · 19 · 22 | +3 sets (18.8 %) | weeks 3 and 4 |
| 4 wk | L2 shoulders / arms 12 → 22 | 5.19 | 12 · 14 · 17 · 22 | +5 sets (29.4 %) | weeks 2, 3 and 4 |

A 12-week L2 big group goes 15 → 22 with its last four weeks at 19, 20, 21, 22: **his approved example** (R3-VOL-04) still holds. **What changed against v1.2:** the 12-week L2 / L3 shoulders and arms now reach 22 and 25 (v1.2 stopped at 18 and 23), and every 8-week group reaches the same final sets as on 12 weeks, with faster steps. An 8-week plan still starts at the normal start (no "start hard"). **Short blocks with a big target** are where the note shows: a 4-week L2 block adds 3 to 5 sets in one week, and the plan prints "this week jumps more than usual: adjust if needed" on those weeks (R4-PRG-02). **In a plan** the groups take turns, so the week's total climbs a set or two most weeks and the last steps are shared between the last two weeks (PROPOSED staggering; R4-PRG-01 allows one week early). A week's number is also what the template's slots can hold (master §5.6.3). **L1 note:** on 12 weeks an L1 group adds its first set in week 4, so the first weeks progress through reps, load and RIR, which is allowed (CX-02).

**(d) No rate limit; a note instead (v1.3).** There is no maximum step and no maximum weekly rise (COACH-CX CX-01; COACH-R4 R4-PRG-02: "No hard limit, but the plan prints a clear note when any week adds more than about 15 %"). The note reads "This week jumps more than usual (17 % more sets for Shoulders): adjust if needed", is printed on that week and in "How you progress", and the week is marked in the stairway table. PROPOSED details: a group is noted when it adds 2 or more whole sets and more than 15 %; the week's total is noted above 15 %; one whole set alone is never noted. A coach may still set a slower pattern by hand at build time. A pain area keeps slow steps (about 3 %; VOL-03). **Retired in v1.3:** planned step ≤ 7 % (R2-VOL-01); total weekly resistance sets strictly below +10 % (UNI-05) with its one-set allowance and exemptions; "10 % is never offered as a step"; release staggering to stay under 10 %. **Retired in v1.2:** the 60+ ≤ 3 % cap (older adults are protected through exercise choice, R3-ATH-02, and constrained machines, EQ-03).

**Reps and load: the rule the person applies (v1.3; COACH-R4 R4-PRG-03; COACH-CX CX-02, CX-03).** There are no check-ins, so rep and load progress is written as a rule and never as a promised number for a week: "3 sets of 8-12. When you hit 12 on every set with 1-2 reps left in the tank, add weight next time and start again at 8." Every lift prints its own line ("Progress: when you hit 12 on every set with 2 left in the tank, add weight next time and start again at 8"); the reps in the tank are that week's planned effort. A fixed-rep lift reads "when every set is done with N left in the tank, add weight next time"; a lift with its reps written per set (12 / 10 / 8) says "the written reps" (these two wordings PROPOSED). A week that keeps its sets progresses through this rule. That is planned progress; an unchanged prescription is never labelled progress (CX-02).

### V4. Allocation: where the weekly sets go

The plan's own words (`design/ENGINE_V05_PLAN.md`, "How volume is allocated"): weekly sets per group come from the stairway; they are split over the template's slots; each exercise stays inside its set range; credits are recomputed from the actual exercises.

```
1 weekly sets     for each trained group and week: the stairway of §5.4 (start -> planned final sets)                # CX-01, R4-PRG-01
2 split           over the slots of the template that train the group as a main mover, in session order:
                  the next set goes to the exercise with the fewest sets, the earlier one on a tie
                     (2/2/2 -> 3/2/2 -> 3/3/2 -> 3/3/3 -> 4/3/3)                                                    # VOL-07
                  a day type that runs twice a week alternates: Monday's first exercise, then Thursday's           # R3-VOL-03 (APPROVED)
                  main days before the optional day
3 per exercise    2-5 sets (2-4 at L1); isolation on a main day 3 (4 in the hardest weeks)                           # VOL-16; numbers PROPOSED
                  calves: one exercise x 3 sets on every leg day (2-3 on an optional day), never a second
                     calf exercise on a leg day                                                                     # VOL-17, R3-SES-01
4 no room         the coach's bonus exercise on the optional day (2-4 sets; at most 2 added a day, one a group)      # VOL-07, ORD-10, ORD-11; numbers PROPOSED
                  a Focus slot on the optional day for the person's Focus muscle (2-3 sets)                          # ORD-11, R3-SES-01
                  a small-muscle extra on a main day that already trains it (one a day, 2-3 sets),
                     never as that day's only exercise for it                                                       # R3-VOL-03; numbers PROPOSED
                  no optional day and no room: the group is CAPPED at what its slots hold, and the plan SAYS SO
                     (which group, how many sets of how many planned); nothing is dropped, nothing is hidden        # R4-SES-04
5 recount         credits from the actual exercises: main mover 1.0, helpers 0.25, at most 1.0 a set to a group;
                  the plan prints weekly sets per group, week by week                                               # VOL-09; group credit PROPOSED
6 at the top      a group at its planned final sets keeps them; reps and load carry the progress                     # CX-03
7 hard rules      light core opener first (the person may switch it off for a day, master §10.10); hip + push / knee + pull;
                  heavy squat and heavy deadlift on different days; row before pulldown; power before strength; no bands;
                  exercises fixed inside the exercise block   # R2-SES-01..03, UNI-11, ORD-01, ORD-03, EQ-01, PER-02
```

**Laterality.** On his A / B / C days, the athletic days and push / pull / legs each slot keeps the laterality his template names (two-leg squat or hinge in slot 2, single-leg in slot 4, a two-arm row first on the A day; R4-SES-05). The bilateral : unilateral dial (master §6) moves only the slots the template leaves open.

**Retired from v1.2's placement:** "stop when the person's total would rise 10 % this week"; "session minutes ≤ the chosen length"; the soft per-session set ceilings (11 fractional sets per group, 14 for a Focus line) as a rule (the template's slots and the per-exercise range bound a session now; the research note stays in §5.6); "the line's ceiling becomes what the week holds ... never flat" as a time rule; supersets switched on because a day ran out of minutes.

### V5. Two training days, and what a template cannot hold

"Every big muscle still gets trained, with fewer weekly sets (about 6-8 instead of 10), and the plan says so and suggests a 3rd day. We do NOT drop whole muscles, and we do NOT pile on more exercises" - "That sounds right ... People can add or remove or adjust accordingly. That's fine. We can maybe give them a small recommendation, but it's only a recommendation."

| Item | Rule | Tag |
|---|---|---|
| Days | one A day and one B day: together they train every big group | R4-SES-03; R4-SES-05 |
| Weekly sets | every big group starts at 6 and tops at 8 (+ the Focus add); small groups take the same numbers at most; a 2-day maintenance plan holds no line above 8 | "about 6-8" R4-SES-03; exact numbers PROPOSED |
| The floor of 10 | applies from 3 training days | R4-SES-03; R2-VOL-06 |
| What the plan says | a plain note up front: with 2 days each big muscle gets about 6-8 sets a week; a third day would bring it to 10 or more | R4-SES-03 |
| Never | drop whole muscle groups; pile on more exercises | R4-SES-03 |

This replaces v1.2's reading of R3-SES-02 step 2 ("train fewer muscles directly") and closes round-4 candidate 2 (very short weeks).

Six to eight exercises a day at 2-5 sets each do not always hold every group at its planned final sets. The plan never drops anything to solve that, and it never hides it:

| Case | What the plan does |
|---|---|
| The slots cannot hold the group's planned sets, and there is an optional day | his bonus exercise on the optional day (2-4 sets), opened at the exercise-block start that first needs it |
| No optional day | the group is capped at what its slots hold; the plan says "Chest: 13 of 25 planned sets - your template holds 13; add a day or an exercise to reach more" |
| The slots hold fewer than the floor (10, or 6 on 2 days) | the plan says the group is under its floor, and by how much |
| The group has no exercise of its own (a field athlete's arms; a line a client type leaves to the compound lifts) | listed as "trained through the compound lifts" |
| The person wants a shorter day | each day lists the easiest things to remove, in this order: the conditioning finisher, extra jump / throw stations, small-muscle accessories, bonus exercises. Always kept by the generator: the 2 core exercises, the main lifts and, for athletes, the first athletic station. The person decides (R4-SES-04: "they get to pick what they want to keep or what they want to take away") |

### V6. The next block

| Level (top) | Block 1 | Block 2 | Block 3 | Block 4 |
|---|---|---|---|---|
| L1 (14) | 10 → 14 (λ 0.76) | 11 → 14 (λ 0.54) | 12 → 14 (λ 0.35) | 13 → 14 (λ 0.17) |
| L2 (22) | 15 → 22 (λ 0.87) | 16 → 22 (λ 0.72) | 17 → 22 (λ 0.58) | 18 → 22 (λ 0.45) |
| L3 (25) | 20 → 25 (λ 0.50) | 21 → 25 (λ 0.39) | 22 → 25 (λ 0.29) | 23 → 25 (λ 0.19) |

Each completed block raises the start by about 5 % (one whole set at these numbers; at least one set while below the top, PROPOSED) and **the top does not move**: "never above the level's top number" (R4-PRG-04). So the steps get smaller as the start nears the top, and a group that starts at its top (L1 after four blocks: 14 → 14) keeps its sets while load and reps carry the progress (CX-03). For advanced lifters "one level higher" comes from heavier loads, intensifiers (MYO, supersets), a Focus muscle or a coach priority push up to 30 (APPROVED, R2-PER-05; R3-SES-01), or moving up a level; the optional Pro setting goes above 30 (R2-VOL-06, PROPOSED numbers). Nothing is stored, so the rebuild asks how many blocks were completed in a row (PROPOSED). After a **stopped** block the start repeats (PROPOSED). *(Retired: v1.2's "cap + 1" per block, which ran L1 to 13 → 17 and L2 to 18 → 25 by block 4.)*

### V7. Still PROPOSED after v1.3 (replaces the matching items of section 7)

Group credit; the shoulders line's side-delt dose; the Focus default +2; the 2-day numbers (start 6, top 8); the session-size defaults inside his ranges and what sits outside the count; the 7th and 8th exercise of the A / B days; the allocation details (2-5 sets an exercise, isolation 3 / 4, the bonus exercise at 2-4 sets, at most 2 added a day, a main-day extra for small muscles); what the plan says when a template cannot hold a group; the incline-press credit; the acceleration-note details (one set alone is never noted); staggering (the groups take turns; the last steps shared between the last two weeks); "at least one whole set" in the next-block start; "blocks completed in a row" as the rebuild input; the time-estimate numbers and the printed range; the items of section 7 that v1.3 does not touch (1-3, 6, 9-11, 13-15).

---


## v1.2 - round 3 applied

> **Changed again in v1.3.** This list is the v1.2 change record, kept as written. Its rows about the time check and time vs minimums (R3-SES-02: offers, "fewer groups trained directly", "never flat"), about the 7 % and 10 % limits, and about the next block's "cap + 1" were changed again by COACH-CT CT-01, COACH-CX CX-01..04 and round 4. The v1.3 section above wins.

Edited in place: every table, rule, example and the JSON twin now carry the round-3 answers; this list says what changed and why. The v1.1 list below is history (its rows that round 3 changed are marked ‡).

| # | Change in v1.2 | Coach answer | Where |
|---|---|---|---|
| 1 | **No check-ins, no tracking, no adaptive inputs, nothing stored.** The generator builds the whole plan once, on its planned stairway, and shows every week ahead of time; people and coaches adjust it themselves. Retired: the weekly check-in and its step table (effort, completion, pain), the 'Failed' answer, the "10 → hold and -1 set" rule, the repeated week, the block-at-risk prompt, the logbook, level-up from logs, the week-by-week mode and every "how the engine learns" step. A short printed **self-adjust guide** replaces them (the plan tells the reader how to adjust; no data comes back). | COACH-R3 VOL-02 (RIGHT + "I want to take away all check-in info. We're only doing outputs"), VOL-04 (RIGHT + "kick out a program, and that's it"), GEN-01 ("I don't want any data kept") | §0, §3.6, §3.7.3, §3.8, §3.12, §3.14, §4 |
| 2 | **The stairway is approved**: about 3 % a week to the halfway week, about 5 % after it, each trained line's steps sized (λ) so it reaches its ceiling in the last week; the planned effort drifts 3 RIR → 2 → 1-2 → 1 RIR + intensifiers in the last week, always inside his 1-3 RIR. The v1.1 flag against VOL-13 ("no planned RIR ramp") is closed. | COACH-R3 VOL-04 (RIGHT) | §3.7.1, §3.7.2 |
| 3 | **Rear delts are not an individual muscle.** Side, rear and front delts are one **shoulders** line (his FOCUS header 'SHOULDERS/TRAPS'): start 10 / 12 / 15, caps 14 / 22 / 25, counted with **group credit** (a set never counts more than one set to a group: side raise, rear-delt fly, face pull, vertical press 1.0; horizontal press and row 0.25). The floor of 10 is read on the group. Rear delts' own 4 / 6 / 8 sets are retired as a target; every plan still holds a rear-delt exercise each week and the user or coach can add more ("People and coaches should always be able to add more rear delts"). | COACH-R3 VOL-01 (PARTLY) | §3.1, §3.3, §3.9, §3.10.2 |
| 4 | **The floor of 10 is counted on groups**: quads, hips (glutes + hamstrings), chest, back, shoulders, biceps, triceps, calves. Glutes and hamstrings keep their own starting lines (separate FOCUS headers); the hips group must reach 10 (hip thrust + RDL + leg curl all count). | COACH-R3 VOL-01, SES-01 (RIGHT) | §3.3 |
| 5 | **Focus muscle 1 and Focus muscle 2** (intake, max 2, any line: quads, hamstrings, glutes, chest, back, shoulders, biceps, triceps, calves): each gets **+1 to +3 extra weekly sets** over the balanced plan (default +2), on its start and on its ceiling, so the stairway carries the extra all block; its exercise goes first in its session. The extra does not slow the other lines. VOL-02's priority push (+4 / +6, the others ≤ 3 % a week) stays only as an optional coach setting. No sex field. | COACH-R3 SES-01 (RIGHT + words) | §3.5, §3.3 |
| 6 | **Placement approved**: an added set alternates between the two exposures of the same day type (Monday's first back exercise, then Thursday's); extra small-muscle sets become a short bonus exercise on the optional day, or on a day that already trains that muscle, never as that day's only exercise for it. Calves never get a second calf exercise on a leg day (one exercise × 3 sets, item 7). | COACH-R3 VOL-03 (RIGHT) | §3.9 |
| 7 | **Groups and calves approved**: exercises per day are counted on the FOCUS groups (hips = glutes + hamstrings, e.g. RDL + hip thrust + leg curl = 3 hip exercises; shoulders = front + side + rear delts); **calves = one exercise × 3 sets per leg day**; field athletes get 2-4 exercises for each group trained that day inside 12 + the 2-exercise core block, which with the cross pattern leaves 2 jump / throw stations + 1 Olympic lift; cross pattern is the default for most athletes, the same-pattern athletic template (3-4 jump stations) for size-focused and high-level athletes. | COACH-R3 SES-01 (RIGHT) | §3.10 |
| 8 | **Time vs minimums, as an exact algorithm**: (1) detect the shortfall at the peak week and tell the user up front with an offer (another day, or the session length that fits); (2) if they keep their time, train fewer groups directly - big movers kept first, arms, calves and shoulder isolation left to compound credit - instead of every group under the floor; (3) recommend supersets; (4) the stairway always climbs on the groups that are trained (never flat); never squeeze 2-4 exercises per group into a day that cannot hold them. | COACH-R3 SES-02 (RIGHT + words) | §3.10.1, §5.1, §5.5 |
| 9 | **User editing is a plan feature**: every day's blocks carry stable ids and an on/off flag (athletic block and core block can be switched off for that day), exercises and whole blocks can be added or removed, and the plan recommends supersets per eligible pair. Edits rebuild the same plan with the edits as constraints; nothing is stored. | COACH-R3 SES-02 | §3.10.2, §3.10.3 |
| 10 | **Calendar**: the easy week after a block is a **recommendation**, not mandatory; when a block ends it ends and the user builds the next one (the "next block × 1.05, cap + 1" rule applies when the user says the previous block was completed); holidays are planned between blocks. The maintenance "end prompt" becomes a printed note. | COACH-R3 PER-01 (RIGHT + words) | §3.12 |
| 11 | **Athlete defaults placed** (the profiles own the details; 04 / 06): swimming 25 % plyometric at block end and 0 extra cardio; older adults (60+) landing drills, balance, quick stepping, light medball throws and fast machine work on, ankle hops, other jumps, Olympic lifts and depth jumps off by default (on with the warning); pickleball / padel / tennis 50+ calf and Achilles work every leg day (a pinned group for the time policy); HYROX station circuits are finishers that never count as muscle sets; the R3-ATH-04 plyo shares for the remaining sports. | COACH-R3 ATH-01..05 | §3.4, §3.13 |
| 12 | **Retired**: the "older adults ≤ 3 %" step cap (PROPOSED in v1.1; it contradicts the approved "reaches its ceiling in the last week") - older adults are protected through exercise choice (R3-ATH-02) and constrained machines (EQ-03). | COACH-R3 VOL-04, ATH-02 | §3.4, §3.7.4 |
| 13 | **Worked examples recomputed** with the v1.2 prototype: 5.1 L1 full body (the client asked 60 min: the shortfall, the offer and both branches); 5.2 L2 bodybuilder with Focus muscle 1 = chest; 5.3 tennis (shoulders line); 5.4 the recommended easy week and the maintenance option; **5.5 new**: the coach's own R3-SES-02 example, a pickleball player who keeps 2 × 45 min. | all of the above | §5 |

**Flags for the master file (not decided here).** (a) Shoulders start 10 / 12 / 15 counted with group credit carries less direct side-delt work than v1.1's separate side-delt line (12 §5.2: side delts 3-4 direct sets a week for an L2 bodybuilder); a V-taper bias or Focus = shoulders restores it - confirm. (b) Focus muscle default +2 (range 1-3) on both start and ceiling. (c) The drop order inside step 2 of the time policy (arms → calves → shoulder isolation → chest → back → quads → hips; Focus and sport-pinned groups never dropped). (d) The 10 % "a little longer day" tolerance of the fit test. (e) With 2 × 45 min the coach's own minimums leave only the hips group (and the pinned calves) trained directly (§5.5); the plan says so up front.

---

## v1.1 - round 2 applied (history)

History (kept as written in v1.1). Rows marked ‡ were changed again by round 3; the v1.2 table above and the sections below take precedence.

| # | Change in v1.1 | Coach answer | Where |
|---|---|---|---|
| 1 ‡ | **The stairway.** Every plan climbs in weekly steps: small steps in the first half (standard 3 %), slightly bigger after the halfway week (standard 5 %), the hardest weeks last. When a muscle's level cap would be reached early, all its steps are scaled down by one factor λ so the planned peak lands on the cap in the final week. Replaces the 12-week acclimation cap (≤ 3 %), the 8-week "start hard" (start × 1.10, weeks 1-4 ≤ 5 %) and target-seeking. | COACH-R2 PER-03 (NOT RIGHT), PER-04 (PARTLY) | §3.7, §3.12, §4, §5 |
| 2 ‡ | **"Start at a 2, end at an 11"** is perceived overall load, not sets: each week shows a level from 2 to 11 that follows the stairway, and the planned effort drifts from 3 RIR to 1 RIR inside his 1-3 RIR band; lifters already at their caps get the "11" from load, intensifiers and a rotating priority muscle. | COACH-R2 PER-05 (RIGHT + words) | §3.7.2 |
| 3 ‡ | **Never above 7 %/week planned; 10 % absolute.** Standard steps are 3-5 %; a "too easy" week adds 2 points (max 7 %); the person's total weekly resistance sets must rise by less than 10 %. A hand-set step runs 0-7 % (fixes 03's conflict 4). | COACH-R2 VOL-01; COACH-ANSWER UNI-05 | §3.7.4 |
| 4 ‡ | **Check-in step table approved, minus the life column.** Effort mostly 1-6 → the planned step + 2 points (= his +7 % in the late half); effort 7-8 → the planned step (= his +5 % in the late half); effort 9 → hold; any 10 → hold and remove 1 set from that day; under half the sessions → repeat the week. The step is decided from **effort, completion and pain only**: the "life was harder / better" cells are dropped because he wants no lifestyle inputs (**flagged**). | COACH-R2 VOL-01 (RIGHT), GEN-04 (NOT RIGHT) | §3.7.3 |
| 5 | **Retired:** the readiness score R (effort 40 / completion 20 / performance 20 / life 20), the intake "recovery signal" (sleep, stress, physical job), the 3 % default for stressed clients, "7 % only once logs earn it" and the "hold 2 weeks → deload" gate. | COACH-R2 GEN-04, VOL-03, VOL-07 | §3.7.5, §3.14 |
| 6 ‡ | **No check-in = no adaptation:** the plan follows its planned stairway ("there is no data to go off of"). | COACH-R2 VOL-03 | §3.7.3, §3.14 |
| 7 ‡ | **Effort 10 = "the max I could do, but successful"** (0 RIR), not a fail; an optional separate 'Failed' answer is proposed. '8 - That was perfect' = hit the target the plan gave; '9' = harder than planned. | COACH-R2 VOL-02 (PARTLY) | §3.7.3, §3.14 |
| 8 ‡ | **Floor 10 sets a week per trained muscle; small muscles grow by the same idea.** Small-muscle starts L1 **10** (was 8) / L2 12 / L3 15; the level caps 14 / 22 / 25 now apply to every target muscle (small caps were 12 / 18 / 22); priority caps L1 18 / L2 26-28 / L3 30 approved; every cap is customizable; an optional **Pro** setting may let one priority muscle pass 30 (numbers PROPOSED). | COACH-R2 VOL-04, VOL-06 | §3.3, §3.5 |
| 9 | **"Most people train 20-30 sets per muscle per week"**: researched (surveys of bodybuilders and gym-goers, dose-response meta-analyses, RP landmarks) and placed next to his statement. | COACH-R2 VOL-06 | §2.11 |
| 10 ‡ | **Rear delts:** own sets 4 / 6 / 8 approved. Reconciled with the floor of 10 by reading the floor on his SHOULDERS/TRAPS muscle group (rear + side delt work together) - INFERRED and **flagged** for round 3. | COACH-R2 VOL-04, VOL-06 | §3.3 |
| 11 | **Glute credit:** squats, lunges, deadlifts and RDLs give glutes **0.25** (hinges were 0.5 PROPOSED); hip thrusts and bridges 1.0; **KB swings are ballistic and never count as glute volume**; thruster = 1.0 quads + 0.5 shoulders + 0.25 glutes. | COACH-R2 VOL-05 | §3.1 |
| 12 ‡ | **No deload or maintenance week inside a block.** A block is completed; the deload (about half of the hardest week, same exercises, 3+ RIR) sits only between blocks. A block that cannot be completed is cancelled → maintenance phase (length chosen, extendable) → at its end the app asks: keep maintaining / change the plan / start a training block. Triggered mid-block deloads are retired. | COACH-R2 VOL-07, PER-06 | §3.12 |
| 13 ‡ | **R2-VOL-08 was not understood:** the default stays (alternate the first exercise between the two weekly exposures; bonus exercise on the optional day; with no optional day, on a day that already trains that muscle group) and is marked for a simpler re-ask. | COACH-R2 VOL-08 (not understood) | §3.9 |
| 14 ‡ | **Full-body days: 2-4 exercises per muscle group that day, never 1.** Full-body days grow to 7-10 resistance exercises and 55-80 minutes; the time model adds a 1-minute changeover per exercise; the capacity table and every example were recomputed. | COACH-R2 SES-05 (PARTLY) | §3.10, §5 |
| 15 ‡ | **Cardio count is adjustable** up or down by the user; aesthetics clients 4 (Orange, Green, Blue + a second Orange) plus optional 20-30-minute walks; athletes by sport off-season. | COACH-R2 SES-06, ATH-06 | §3.10 |
| 16 | **Session rules:** heavy squat and heavy deadlift on two different days, non-axial alternatives on the other days, the counted list of axial lifts; light core opener (2 exercises × 2 sets short of failure) with optional core supersets or monster sets anywhere; field athletes 12 exercises + the 2-exercise core block; athletic-template slots default to 2 sets (03's conflict 1); exercises by session length 45 ≈ 5, 60 ≈ 6-7, 75-90 ≈ 8-9 (03's conflict 6). | COACH-R2 SES-01..04; COACH-ANSWER VOL-08, VOL-16 | §3.9, §3.10 |
| 17 ‡ | **Athletic budget:** plyo:ballistic shares by sport approved (end of block; each block starts 15 points more ballistic; share counted over jump **and** throw work); ballistic vs plyometric lists; "Receive-Create stages" (1 Land, 2 Land & Go, 3 Repeat) with their week timing; Olympic lifts up to 4 times a week (cleans on squat-pattern days, snatches on hinge days); full squat cleans/snatches 3-5 reps with the same weekly reps; % only when tested (RPE otherwise); in-season reductions for game-heavy sports; older adults (60+) no Olympic lifts, plyos or depth jumps by default (optional with a warning); youth Olympic lifts from the floor from about 14 after a hang block; intermediates get the full Olympic scope (11's I14). | COACH-R2 ATH-01..08, GEN-06 | §3.13 |
| 18 | **Pre-season** = a 4-6-week block at about 60 % of off-season sets with more speed and power, then a 1-2-week taper; **maintenance** length is chosen and extendable. | COACH-R2 PER-06 | §3.4, §3.12 |
| 19 ‡ | **Year plan** = gen-pop "stay in shape" planning, fully tunable by the user (re-order blocks, more or less cardio, a winter powerlifting-style block; own calendar and holiday weeks). | COACH-R2 PER-01, PER-02 | §3.12 |
| 20 | **Tests** before the block (or in week 1) and at the end, never mid-block; untrained people never test a 1RM or a max mile from zero (5RM / 3RM or 80-90 % submax efforts). | COACH-R2 PER-07 | §3.12 |
| 21 ‡ | **Next block** after a completed block: start × 1.05, cap + 1 (max 25 non-priority / 30 priority) approved; after a cancelled block: the same start (PROPOSED). | COACH-R2 VOL-06 | §3.12 |
| 22 ‡ | **"Stay athletic and active" gen-pop path** (pickleball, HYROX for fitness and similar, from the coach's request of 2026-10-08): uses the general-fitness volume factors and the floor of 10; its athletic work comes from the 04 sport profiles. | coach request 2026-10-08; numbers PROPOSED | §3.4 |
| 23 | **Inconsistencies flagged by 03 and 11 fixed here:** priority add +4 (L1-L2) / +6 (L3) everywhere (I10); factor results round half up (I11); intermediates get the full Olympic scope (I14); the bodybuilder upper-body share is PROPOSED, not his number (I15); 8-9 exercises at 75-90 min is his VOL-08 answer (I16); hand-set step 0-7 % and RIR stays 1-3 (03 conflicts 2 and 4). | COACH-ANSWER VOL-02, ATH-10, UNI-03, VOL-08, UNI-05, VOL-13 | §3.3, §3.5, §3.10, §3.11, §3.13 |
| 24 ‡ | **Worked examples 5.1-5.4 recomputed** with the v1.1 prototype: L1 full-body 12 weeks with no check-in; L2 chest-priority split with check-ins (holds, a repeated week, a "10", a pain swap); tennis 8 weeks; the maintenance flow. | all of the above | §5 |

**Flags for the master file and round 3 (v1.1; closed or carried by v1.2):** (a) the life column of R2-VOL-01 vs R2-GEN-04 (resolved by dropping the column, item 4); (b) rear-delt 4 / 6 / 8 vs "nobody needs less than 10" (item 10); (c) R2-VOL-08 needs a plain re-ask with an example (item 13); (d) the planned effort drift 3 → 1 RIR inside the 1-3 RIR band vs VOL-13's "no planned RIR ramp" (item 2); (e) the floor of 10 lifts field athletes' chest and back from 7.5 to 10 (§3.4).

---

## 0. The algorithm on one page

| # | Rule | Tag |
|---|---|---|
| 1 | Count **weekly hard sets per line** (the coach's FOCUS headers: quads, hamstrings, glutes, chest, back, **shoulders**, biceps, triceps, calves; core = the opener). Main mover = 1.0 set; helpers = **0.25**; squats, lunges, deadlifts and RDLs give glutes 0.25; hip thrusts and bridges 1.0 glutes; dips = 0.5 triceps + 0.5 chest; thruster = 1.0 quads + 0.5 shoulders + 0.25 glutes. **A set counts at most 1.0 to a line or group** (a face pull is 1 shoulder set, not 1.25). A **10/10** unilateral set = **1 set**. Plyos, ballistics (KB swings included), throws, Olympic lifts, sprints, change of direction and HYROX station circuits **never** count toward muscles. | COACH-ANSWER VOL-09, LIB-16, UNI-01, VOL-10; COACH-R2 VOL-05; COACH-R3 VOL-01, ATH-03; group credit PROPOSED |
| 2 | **Starting weekly sets:** big lines beginner **10-12**, intermediate **15-20**, advanced **20+** (engine 10 / 15 / 20); shoulders, biceps, triceps **10 / 12 / 15**; calves **one exercise × 3 sets every leg day**; core opener 2 × 2. **Nobody below 10 sets a week per trained group** (quads, hips, chest, back, shoulders, biceps, triceps, calves) when there are 3 or more training days; with 2 days every big group is trained at about 6-8 (v1.3, COACH-R4 R4-SES-03). 15-20 = maintenance to some growth, 20-25 = growth; most trained people end up around 20-30 (§2.11). | COACH-ANSWER VOL-01, UNI-01, VOL-17; COACH-R2 VOL-04, VOL-06; COACH-R3 VOL-01, SES-01 |
| 3 | **Ceilings per 12-week plan:** 14 / 22 / 25 by level for every line; all customizable; above 30 only through an optional Pro setting for a very advanced, determined person (PROPOSED). | COACH-R2 VOL-06 |
| 4 | **Focus muscle 1 and Focus muscle 2** (intake, max 2): **+1 to +3 extra sets a week** each (default +2) on the start and on the ceiling, never above 18 / 26-28 / 30; first in its session; the others keep their own stairway. The coach-only priority push (+4 / +6, others ≤ 3 %) is an optional setting. | COACH-R3 SES-01; COACH-ANSWER VOL-02, ORD-04; COACH-R2 VOL-06; default +2 PROPOSED |
| 5 | **Pain** declared at intake: that group or pattern -30 to -50 %, constrained machines or split grips, or drop the exercise. During the plan the printed self-adjust guide tells the user what to do (swap, cut, drop); nothing is logged. | COACH-ANSWER VOL-03, UNI-08, EQ-03; COACH-R3 VOL-04 |
| 6 | **The stairway (pattern approved; v1.3 endpoint rule):** every plan climbs week by week; the default pattern is about 3 % of each group's weekly sets in the first half and about 5 % after the halfway week, scaled by λ so every trained group **reaches its planned final sets** in the last week (one week early at most); λ may be above 1, so steps may be faster than the pattern; **no hard limit**, a note on any week that adds more than about 15 %; a week may keep the same sets while reps or load progress; display level 2 → 11; planned effort 3 RIR → 2 → 1-2 → 1 RIR + intensifiers, always inside 1-3 RIR. *(Retired: "never above 7 % planned; total below +10 %".)* | COACH-R3 VOL-04; COACH-R2 PER-03, PER-04, PER-05; COACH-CX CX-01, CX-02, CX-03; COACH-R4 R4-PRG-01, R4-PRG-02 |
| 7 | **No check-in, no tracking, no adaptive inputs, nothing stored.** The whole plan is computed once and shown ahead of time; the user or coach adjusts it. A printed self-adjust guide replaces the v1.1 check-in table (retired, §3.7.3). | COACH-R3 VOL-02, VOL-04, GEN-01 |
| 8 | **Rounding:** the tool turns the percentages into whole sets: half up, held one set under the final sets until the arrival week (v1.3; v1.2 banked the fraction and added a set when the bank reached 1). | COACH-ANSWER VOL-06; COACH-R4 R4-PRG-01 |
| 9 | **Where a new set goes:** the first exercise for that line in the day's order, then the next (2/2/2 → 3/2/2 → 3/3/2 → 3/3/3 → 4/3/3); the two exposures of a day type alternate (Monday's first back exercise, then Thursday's); v1.3: the sets are split over the slots of his template, and each slot keeps the laterality he names (the bilateral:unilateral target acts only on the slots the template leaves open). No room → a short bonus exercise on the optional day, or on a day that already trains that muscle, never as that day's only exercise for it (calves: never a second calf exercise on a leg day); v1.3: with no room and no optional day the group is capped at what its slots hold and the plan says so. | COACH-ANSWER VOL-07, ORD-10, ORD-11; COACH-R3 VOL-03 |
| 10 | **Sessions (v1.3):** sized by exercise count, not minutes: general fitness / fat loss 5-7, aesthetics 6-8, strength 5-6, bootcamp 5-7 stations, field athletes up to 12 + the 2-exercise core block, older adults 5-6 (not counting the warm-up or the 2 core exercises). A full-body day is his A day (pull + knee dominant) or B day (push + hip dominant), about 6 exercises and up to 8; on split days 2-4 exercises per FOCUS group, never 1; calves one exercise × 3 sets per leg day; light core opener (2 × 2); heavy squat and heavy deadlift on different days. *(Retired: ≈ 5 / 6-7 / 8-9 exercises at 45 / 60 / 75-90 min.)* | COACH-R4 R4-SES-02, R4-SES-05; COACH-ANSWER VOL-07, VOL-08; COACH-R2 SES-01..05; COACH-R3 SES-01 |
| 11 | **No time-fitting (v1.3).** The plan is never cut, reshaped or flagged because of time; each day prints an average time estimate as information. With 2 training days every big group is trained at about 6-8 weekly sets and the plan suggests a third day. Nothing is dropped automatically. *(Retired: the time-vs-minimums algorithm, §3.10.1.)* | COACH-CT CT-01; COACH-R4 R4-SES-01, R4-SES-03, R4-SES-04 |
| 12 | **Editing:** blocks carry stable ids; the athletic and core blocks of any day can be switched off; exercises and blocks can be added or removed (e.g. "add rear delts"); the plan recommends supersets per eligible pair. v1.3: the sets of any day or week can be changed too; an edit recomputes the weekly totals and marks the plan edited (it does not rebuild the plan); nothing is stored. | COACH-R3 SES-02, VOL-01; COACH-CX CX-02, CX-04 |
| 13 | **Bilateral:unilateral share** from 90/10 to 10/90 by athlete, goal, phase and pain. | COACH-ANSWER UNI-02, UNI-03, UNI-10, CAT-13 |
| 14 | **Blocks:** no deload or maintenance week inside a block; after a block the easy week (about half of the hardest week) is a **recommendation**; when a block ends it ends and the user builds the next (v1.3: every group starts about 5 % above the last block's start, never above the level's top, if the user says the last block was completed; COACH-R4 R4-PRG-04); holidays between blocks. Pre-season 4-6 weeks at ~60 % + taper. Tests before and at the end only. | COACH-R2 VOL-07, PER-06, PER-07, VOL-06; COACH-R3 PER-01 |
| 15 | **Athletic budget:** contacts, throws, sprints, cuts and Olympic reps in their own units; plyo share by sport (approved, R3-ATH-04 adds the remaining sports), Receive-Create stages, Olympic lifts up to 4 × a week; older-adult and sport defaults from the profiles. | COACH-ANSWER VOL-10; COACH-R2 ATH-01..05; COACH-R3 ATH-01..05 |

**What v1 retired (COACH-ANSWER VOL-05)** stays retired: every "big muscle = 3 %, medium = 5 %, small = 7 %" mapping. **What v1.1 retired (round 2)** stays retired: the readiness score and its life input, the intake recovery signal, target-seeking, acclimation and 8-week phase caps, the 8-week × 1.10 start, triggered mid-block deloads, hinge glute credit 0.5, KB-swing glute credit, small-muscle start 8 and small caps 12 / 18 / 22. **What v1.2 retires (round 3):** the weekly check-in and its step table, the 'Failed' answer, "10 → hold and -1 set", the repeated week, the block-at-risk prompt, the logbook and every learning step, level-up from logs, the week-by-week mode, rear delts as a line with its own 4 / 6 / 8 sets, side delts as a separate line, the "older adults ≤ 3 %" step cap, the mandatory transition deload and the maintenance end prompt. **What v1.3 retires (round 4, CT-01, CX):** the time-vs-minimums algorithm and every use of session minutes as a limit; exercise caps by minutes; the 7 % step limit, the 10 % weekly limit, the one-set allowance and release staggering under 10 %; λ ≤ 1 ("the ceiling is a maximum"); the minimum climb and "never flat"; the next block's "ceiling + 1"; "2-4 exercises per group, never 1" on full-body days (his A / B template decides there). Full lists in section 6.

---

## 1. What the coach decided (the inputs to this design)

His round-1 answers, grouped by what the engine needs (quotes are short; the full text is in `coach_answers_full.md`), then the round-2 answers that changed the engine. Round 2 wins where they differ; superseded round-1 lines are marked → R2.

**Counting**
- 10/10 means 10 on each leg; three sets of 10/10 rear-foot-elevated lunges count "mostly for quads" (glutes undecided → R2: 0.25, COACH-R2 VOL-05). (COACH-ANSWER UNI-01)
- Alternating lifts count like unilateral ones. (COACH-ANSWER UNI-07)
- Helpers get **0.25**, not 0.5. (COACH-ANSWER VOL-09)
- Dips: "more tricep than chest but still .5 and .5". (COACH-ANSWER LIB-16) Thrusters: 1.0 quads, 0.5 shoulders (COACH-ANSWER LIB-14; → R2: + 0.25 glutes, COACH-R2 VOL-05).
- Leg curls, nordics and slider curls are a **leg flexion** segment, not hip dominant. (COACH-ANSWER CAT-09)
- Plyos, Olympic lifts, sprints and throws do not count toward muscles: "counting towards muscles is more for resistance patterns, not for athletic patterns." (COACH-ANSWER VOL-10)
- Big muscles: quads, glutes, hamstrings, lats/upper back, chest. Small: biceps, triceps, side and rear delts, calves, forearms, abs. Traps, front delts, adductors and neck are not placed. (COACH-ANSWER CAT-02)

**How much**
- Start: beginner 10-12, intermediate 15-20, advanced 20+ ("sounds about right"); the tool should learn from everyone's data (→ R3: no data is kept, so nothing is learned from users; the coach changes the defaults by hand, COACH-R3 GEN-01, §3.14). (COACH-ANSWER VOL-01)
- 15-20 sets is "a good foundation for maintenance to a little bit of growth", 20-25 "a good growth foundation"; 40 sets of chest is "way too much", 5 "too little". (COACH-ANSWER UNI-01)
- Priority: +4 to +6, cap about 25-30. (COACH-ANSWER VOL-02, PARTLY: "that's the idea... we'll collect data"; → R3: Focus muscle 1 / 2 at +1-3 is the intake path, the push an optional coach setting, COACH-R3 SES-01; no data is collected, COACH-R3 GEN-01)
- Pain: cut 30-50 %, machines or split grips, "maybe even drop the exercise altogether". (COACH-ANSWER VOL-03)
- Calves get 3 sets every leg day; rear delts get their own sets; about 2 core exercises. (COACH-ANSWER VOL-17)
- The chest-vs-side-delt imbalance in his templates was not intended; balance it, but allow a V-taper bias when the athlete wants it. (COACH-ANSWER VOL-18)

**How it moves**
- The 3/5/7 % is a percentage of weekly sets per muscle. (COACH-ANSWER VOL-04)
- "It doesn't really go by muscle... It's just more on what's going on with the person"; the person or their coach adjusts it. (COACH-ANSWER VOL-05)
- "It can progress week by week by 10 %. That's way too much." Unilateral and bilateral progress the same way. (COACH-ANSWER UNI-05)
- Bank the fraction; "I need this tool... to figure out the percentages." (COACH-ANSWER VOL-06)
- 3-4 exercises per muscle group per day; add to the first exercise, then the second (2/2/2 → 3/2/2 → 3/3/2 → 3/3/3 → 4/3/3); small muscles at the end get a bonus exercise. (COACH-ANSWER VOL-07)
- Smooth increases for hypertrophy and general clients; steps and waves for fight or competition prep. (COACH-ANSWER PER-10)

**Session and week**
- Core first by default (warm-up), movable. (COACH-ANSWER ATH-11)
- Hip dominant + push, knee dominant + pull, for full body and bootcamps. (COACH-ANSWER UNI-11, ORD-06)
- No axial loading twice a week: squat once, leg press or belt squat the other day; deadlifts also load the spine. (COACH-ANSWER PER-04, EQ-11; → R2: heavy squat and heavy deadlift on two different days, COACH-R2 SES-01)
- 5-7 exercises in resistance sessions; field athletes off-season up to 10-12. (COACH-ANSWER VOL-08, VOL-16, VOL-17; → R2: 12 + the 2-exercise core block, COACH-R2 SES-04; full-body days 2-4 exercises per muscle, SES-05)
- About 1.5 h (max 2 h) for athletes, bodybuilders and powerlifters; 45-60 min for weight loss and everyday clients; unilateral work takes longer and "has to be accounted for". (COACH-ANSWER UNI-09)
- Supersets are a fatigue and density tool: short time, advanced clients who need more stimulus, off-season VO2/mitochondrial work, and beginners who don't fatigue. (COACH-ANSWER ORD-05)
- Optional days: add-on or separate, ideally separate. Focus slots can both hit the same muscle. (COACH-ANSWER ORD-10, ORD-11)
- Priority small muscles may go first in the session. (COACH-ANSWER ORD-04)

**Bilateral vs unilateral**
- Bodybuilders and powerlifters: ~50/50 at the start, then 80/20 or 90/10; field athletes 80-90 % unilateral; anywhere from 90/10 to 10/90; adjustable; pain adjusts it. Unilateral = health and rotational foundation, bilateral = driving force. Upper body follows the same logic. (COACH-ANSWER UNI-02, UNI-03)
- In-season: minimal bilateral. (COACH-ANSWER UNI-10)
- Contralateral load pulls you into the hip (change-of-direction athletes: football, soccer, basketball, tennis); ipsilateral helps you out of the hip (sprint acceleration step-ups); for bodybuilders and powerlifters contra/ipsi are health accessories mostly in the first 2-4 weeks. (COACH-ANSWER CAT-13)
- Same-pattern pairing (squat + lunge) drives a muscle harder for high-level and aesthetics clients; cross-pattern for bootcamp (less soreness). (COACH-ANSWER UNI-06)

**Plan shapes** (COACH-ANSWER PER-01, PER-02, PER-05, PER-07)
- 4-6 weeks: maintenance or transition (vacation, travel, off-season to in-season, moving) at about 50-70 % volume.
- 8 weeks: first 4 adapting, next 4 driving hard; "an 8-week program wants to modify you, so you have to start hard." (→ R2: NOT RIGHT; every plan is a stairway, COACH-R2 PER-03)
- 12 weeks (his preferred): 2-4 weeks getting used to the movements, 4-6 weeks driving hard "not all the way to the top", last weeks hardest. The next 12 weeks start one level higher ("start at a 2 and end at an 11").
- Week-by-week mode with no fixed length (→ R3: retired, it needed the check-in, COACH-R3 VOL-02); yearly mode with quarter themes and automatic maintenance over the holidays (→ R3: holidays planned between blocks, COACH-R3 PER-01).
- Blocks of 4-6 weeks with small variable changes between blocks. Deload = about half the sets, lighter (→ R2: never inside a block, COACH-R2 VOL-07). Tests chosen by checkbox, or none (→ R2: before and at the end only, PER-07).

**Athletes** (COACH-ANSWER ATH-01, ATH-02, ATH-04, ATH-05, ATH-07, ATH-09, ATH-10, CAT-10, CAT-11, PER-08)
- Plyo vs ballistic is set by the sport's time on the ground: more ground time (karate, fighters) → more ballistics; less (sprinters) → more plyos; basketball a mix; baseball ballistics + rotational + sprints, few plyos. Programs start more ballistic and become more plyometric.
- Plyo method progression: receive and pause → receive then create → repeated receive/create. Not "zones"; he has not named it yet (→ R2: "Receive-Create stages", COACH-R2 ATH-03). Unilateral plyos are harder than bilateral.
- Everyone in athletic training gets Olympic lifts (beginners: DB/KB snatches, hex-bar jumps, hang pulls/cleans).
- Boxers: reduce pressing/arm volume when punching volume is high; do not cut it.
- No medball for aesthetics or bodybuilders except warm-up; medballs never over 20 lb.
- Aerobic sessions/week: 3 general/fat loss, 2 athletes in season, 4 aesthetics/bodybuilders, plus walks after workouts (→ R2: adjustable by the user, COACH-R2 SES-06; off-season by sport, ATH-06).
- Older clients: few plyos unless requested (→ R2: no Olympic lifts, plyos or depth jumps by default, optional with a warning, COACH-R2 ATH-08); no sex-based rules (age, foundation, goal, injuries decide).

**Levels and intake** (COACH-ANSWER PRG-05, GEN-02, CAT-06)
- Novice = under about 6-12 months; intermediate = consistent for over a year; more than 6-12 months off → the body is treated as a beginner (skills come back fast); ex-pros start at Level 1 only briefly. Level 1/2/3 naming is fine.
- Intake: drop sex; ask training experience in years; add body weight; competitive sport → sport, position, season; recreational → sport only.
- The client's level (volume) and the exercise's level (difficulty) are separate.

**Generator** (COACH-ANSWER GEN-03, GEN-05, GEN-08)
- Adjust week to week from logged EFFORT and HOW IT FELT: RIGHT. But for the output he is unsure whether people should track inside the tool ("They should be tracking it themselves"). (→ R2: settled - the plan works with no tracking, the weekly check-in is optional, COACH-R2 GEN-01; no check-in = no adaptation, VOL-03. → R3: no check-in at all, no tracking, nothing stored, COACH-R3 VOL-02, VOL-04, GEN-01.)
- Coaches can add their own rules.

### Round 2 (`coach_answers_round2.md`, 2026-10-08): what changed the engine

Quotes are short; the full text is in `coach_answers_round2.md`. Round 2 wins over round 1 where they differ.

**Counting**
- Glutes: compounds that include glutes count "a quarter" (squats, lunges, deadlifts, RDLs = 0.25); hip thrusts and bridges 1 set; **"kettlebell swings are not glutes ... mostly supposed to be used for the ballistic movements, not for resistance training"**; thruster = 1 set quads, half a set shoulders, a quarter set glutes ("that's good math"). (COACH-R2 VOL-05)

**How much**
- Small muscles at 8 / 12 / 15 = RIGHT, "but 8 sets a week is probably just barely maintenance ... the little muscles also grow the same idea". (COACH-R2 VOL-04)
- Caps 14 / 22 / 25, priority 18 / 26-28 / 30, others ≤ 3 % while a priority runs, next cycle +5 % and cap + 1 = RIGHT, "but this is all customizable. **I don't think anybody needs less than 10 sets a week per muscle** ... More than 30 sets per week of a muscle group should probably be for a very advanced person. Maybe we can add a pro level ... I think most people train around that: 20 to 30 sets per muscle per week. I believe so, but you can do some research." (COACH-R2 VOL-06)
- Rear delts 4 / 6 / 8 own sets = part of the approved VOL-04 proposal. (COACH-R2 VOL-04; → R3: rear delts are part of the shoulders group, COACH-R3 VOL-01)

**How it moves**
- The step table by effort (3 / 5 / 7 %, hold, -1 set, repeat the week under half the sessions) = RIGHT. (COACH-R2 VOL-01; → R3: retired with the check-in, COACH-R3 VOL-02)
- But lifestyle inputs = NOT RIGHT: "I just need the workouts here. There's no need to talk about sleep or stress or anything else." (COACH-R2 GEN-04)
- Effort 10 = "That was the max I can do, not a fail ... I gave it all I had, but it was successful"; a 'fail' can be added. (COACH-R2 VOL-02, PARTLY)
- No check-in: "the plan doesn't change. There is no data to go off of." (COACH-R2 VOL-03; → R3: there is no check-in at all, COACH-R3 VOL-02)
- Every plan is a stairway: "In the beginning, the first 2, 3, 4 weeks, the steps are a little bit smaller ... When they get to that halfway point and upwards, the steps get a little bit higher, but not too much ... that goes for every plan." (COACH-R2 PER-03, NOT RIGHT on 4 + 4 and "start hard")
- 12 weeks: "the last 4 weeks are going to be brutal ... week by week, it just gets gradually worse. I mean worse, meaning better, more volume." (COACH-R2 PER-04, PARTLY)
- "Start at a 2 and end at an 11" = "the amount of volume that they're putting themselves at as far as level, not the amount of sets ... The last week might feel like an 11 ... pushed yourself a little bit past your limits." (COACH-R2 PER-05)
- Deload = half of the hardest week (RIGHT), but "It should never be thrown in the middle of a block ... If they can't complete it, they should cancel the block and start a maintenance phase ... then start a whole new block." (COACH-R2 VOL-07)
- R2-VOL-08 (where a new set and a bonus exercise go when a day repeats): "I don't understand this question." (COACH-R2 VOL-08; → R3: re-asked in plain words and approved, COACH-R3 VOL-03)

**Session and week**
- Heavy squat and heavy deadlift on two different days; non-spinal hinge, leg press or belt squat on the other days; the counted axial list = RIGHT. (COACH-R2 SES-01, SES-02)
- Core opener light (2 × 2 short of failure) = RIGHT; core supersets or monster sets "optional to be thrown anywhere". (COACH-R2 SES-03)
- Field athletes: 12 exercises + the 2-exercise core block = RIGHT. (COACH-R2 SES-04)
- Full-body days: "need to have the same 2-4 exercises per muscle that day, so it might be a little longer day. It could start really short ... there's never one exercise." (COACH-R2 SES-05, PARTLY)
- Cardio: aesthetics 4 incl. a second Orange + walks = RIGHT, "but also adjustable ... I need more cardio ... it just adds it ... less cardio, it takes away". (COACH-R2 SES-06)

**Plans, year and tests**
- Year plan = RIGHT "for the general population that wants to just stay in shape"; the user may re-order and tune it ("go into deep winter ... ramp it up to powerlifting style"). (COACH-R2 PER-01, PER-02)
- Pre-season = a 4-6-week block at ~60 % with more speed and power and a 1-2-week taper = RIGHT; maintenance length chosen and extendable, then "keep going on maintenance? change your plan? a block of training?". (COACH-R2 PER-06)
- Test before the block (or at its start) and at the end, never during; never from zero to a 1RM or a max mile: 5RM, 3RM, or 80-90 %. (COACH-R2 PER-07)

**Athletes** (COACH-R2 ATH-01 ... ATH-08, all RIGHT): plyo:ballistic shares by sport; ballistic vs plyometric jump lists; "Receive-Create stages" and their timing; Olympic lifts up to four times a week ("cleans ... more squatty ... snatches ... more hingy"); squat cleans and snatches 3-5 reps with the coach's eye on speed; aerobic sessions per sport; in-season reductions for game-heavy sports; older adults without Olympic lifts, plyos or depth jumps unless they choose it, with a warning; youth floor Olympic lifts from about 14 after a hang block.

**Product inputs** (COACH-R2 GEN-01, GEN-05, GEN-06): optional check-in (→ R3: retired), the plan works with no tracking; season start date and practice/game days for competitive athletes; weight guidance by RIR/RPE, Olympic lifts explained as power output, % only for tested or competitive lifters.

**New request (2026-10-08, relayed by the session):** every popular US sport must be covered (swimming included), and gen-pop clients who "want to stay athletic and active" (pickleball, "high rows" - read as HYROX) need a path. The sport profiles are being written in `04_athlete_profiles` / `synthesis/sports/`; this engine gives that path its volume rules (§3.4).

### Round 3 (`coach_answers_round3.md`, 2026-10-09): what changed the engine

Quotes are short; the full text is in `coach_answers_round3.md`. Round 3 wins over rounds 1 and 2 where they differ.

**Outputs only**
- Check-ins: "we're not going to have check-ins, correct? I want to take away all check-in info. We're only doing outputs, and people can change accordingly." (COACH-R3 VOL-02, RIGHT)
- The stairway (3 % then 5 %, every muscle reaching its ceiling in the last week, effort 3 → 2 → 1-2 → 1 RIR + intensifiers) = RIGHT, "but remember that we can just kick out the program designed already without the input of somebody saying how they feel ... The program will just have its natural algorithm recommendation of growth throughout it ... I want them to be able to kick out a program, and that's it. That's the program ... and the program will tell you to adjust accordingly. It's already a template, and you need to adjust it as you need to ... very simple for them to see the whole thing ahead of time." (COACH-R3 VOL-04)
- "I don't want any data kept." (COACH-R3 GEN-01)

**Counting**
- Rear delts: "I wouldn't categorize the rear delt as an individual muscle, so it should always be adaptable. People and coaches should always be able to add more rear delts ... If you put together all the sets of shoulders, it'll equate to more than 10 sets ... I think the rear delts also get worked when you do back." (COACH-R3 VOL-01, PARTLY)
- Groups: FOCUS groups with glutes + hamstrings = 'hips' (RDL + hip thrust + leg curl = 3 hip exercises) and front / side / rear delts = 'shoulders'; calves one exercise × 3 sets per leg day; field athletes 2-4 exercises per group trained that day inside 12 + 2 core, cross pattern by default, the same-pattern athletic template for size-focused and high-level athletes = RIGHT. (COACH-R3 SES-01)
- Focus muscles: "they should be able to choose one of the main muscles that they want to work on the most. The program will then automatically choose extra sets for that one ... an extra set or two or three ... a main focus muscle 1 and a main focus muscle 2, and that should be enough for the whole thing." (COACH-R3 SES-01; his "female ... glutes" is an example only: no sex field, COACH-ANSWER GEN-02, ATH-09)

**Where sets go**
- Monday's first back exercise, then Thursday's; extra small-muscle sets as a short bonus exercise on the optional day, or on a day that already trains that muscle, never as its only exercise that day = RIGHT. (COACH-R3 VOL-03)

**When the time is short**
- (1) tell them up front and offer a 3rd day or longer sessions; (2) if they keep their time, train fewer muscles directly; (3) supersets; (4) the stairway climbs on the trained muscles = RIGHT: "Recommend doing supersets so that it's a faster workout, but they should be able to get things done." Users "should be able to turn off that day's athletic training or that day's core training ... or they can delete certain exercises, because an athlete or a coach should be able to modify accordingly. The options should be: Recommend supersets; Adding or removing exercises or blocks within the training session." (COACH-R3 SES-02)

**Calendar and athletes**
- Easy / maintenance weeks "are a recommendation. They don't have to be mandatory ... when the block ends, it just ends, and then you have to go back into the app and build whatever you want next." (COACH-R3 PER-01)
- Swimming dryland, older and racket-sport defaults, the HYROX plan, the remaining sports' plyo shares and the stay-active rules = RIGHT. (COACH-R3 ATH-01..05)

---

## 2. What the research says (the charts he asked for)

### 2.1 Weekly sets and muscle growth: the main studies

| Study | What it did | Key numbers | Tag |
|---|---|---|---|
| Schoenfeld, Ogborn, Krieger (J Sports Sci 2017, online 2016) | Meta-analysis, 15 studies, 34 groups | Each extra weekly set ≈ **+0.37 %** muscle growth; **10+ sets/week** beat 5-9, which beat <5. Few data above ~20. | SCIENCE |
| Schoenfeld et al. (MSSE 2019) | 34 trained men, 1 vs 3 vs 5 sets per exercise (≈6-9 / 18-27 / 30-45 weekly sets) for 8 weeks | Most growth at the highest volume; **strength the same** in all groups. | SCIENCE |
| Baz-Valle et al. (J Hum Kinet 2022) | Systematic review, 7 studies (6 meta-analysed), trained men | **12-20 weekly sets** recommended; above 20 helped triceps only (no extra for quads or biceps). | SCIENCE |
| Barbalho et al. (IJSPP 2020) | 37 trained men, 5 / 10 / 15 / 20 sets per muscle per week for 24 weeks | 5-10 sets gave strength gains equal to or larger than 15-20; growth showed the same trend, not significant. | SCIENCE |
| Aube et al. (JSCR 2022) | 35 trained people, 12 / 18 / 24 lower-body sets per week, 8 weeks | **18 best**, 12 adequate, 24 no better ("inverted U"). | SCIENCE |
| **Pelland, Remmert, Robinson, Hinson, Zourdos (Sports Med 2026; 56(2):481-505)** | Bayesian meta-regression, **67 studies, 2,058 people**; compared three ways of counting indirect sets (1, **0.5**, 0) | The **0.5 "fractional"** count fit best. Growth rises with volume with **diminishing returns** (+0.24 % per extra fractional set at the mean of 12.25 sets); strength plateaus much earlier. Frequency barely matters for growth when volume is equal, but helps strength. | SCIENCE |
| Remmert, Pelland, Robinson et al. (SportRxiv preprint) | Same team, **per-session** volume | Extra sets stop being detectably better at about **11 fractional sets per muscle per session** for growth and about **2 direct sets per session** for strength. | SCIENCE |

**Pelland's efficiency tiers** (preprint v2, Table 2A; the clearest "chart" in the literature). The smallest detectable change in muscle size was 2.05 %.

| Weekly fractional sets | Tier | Extra sets needed for the next detectable gain |
|---|---|---|
| 4 | minimum effective dose | - |
| 5-10 | higher efficiency | ~6 |
| 11-18 | intermediate efficiency | ~8.5 |
| 19-29 | lower efficiency | ~10.75 |
| 30-42 | lowest efficiency | ~12.5 |
| 43+ | unclear (few data, possibly less growth) | - |

For **strength** the tiers end much sooner: 1 set is the minimum, and above about 5 weekly sets more sets did not reliably add strength (Table 2B). Strength responds more to frequency and load.

### 2.2 The chart: his numbers against the research

One character = one weekly set per muscle.

```
                                     0    5    10   15   20   25   30   35   40   45
                                    ||----|----|----|----|----|----|----|----|----|
Pelland 2026: minimum dose          |    #
  higher efficiency (+1 step/6 sets)|     ======
  intermediate (+1 step/8.5 sets)   |           ========
  lower (+1 step/10.75 sets)        |                   -----------
  lowest (+1 step/12.5 sets)        |                              .............
  unclear, little data (43+)        |                                           ???
Schoenfeld 2017: <5 | 5-9 | 10+     |.....-----=============
Baz-Valle 2022: standard 12-20      |            =========
Barbalho 2020 (24 wk): 5-10 = best  |     ======
Aube 2022: 12 ok, 18 best, 24 worse |            o     #     x
RP chest: MEV . MAV = MRV -         |    ...==========--------
RP chest priority MRV*P 24-32+      |                        ---------
COACH beginner 10-12                |          BBB
COACH intermediate / maint.+ 15-20  |               IIIIII
COACH growth 20-25 / advanced 20+   |                    GGGGGG
COACH priority cap 25-30            |                         PPPPPP
COACH "5 too little", "40 too much" |     x                                  x
COACH-R2 floor 10 ("nobody less")   |          F
COACH-R2 "most people 20-30"        |                    MMMMMMMMMMM
```

**How his experience matches (verdicts).**

| His number | Where the research puts it | Verdict |
|---|---|---|
| Beginner 10-12 (VOL-01) | Top of Pelland's high-efficiency tier, inside Schoenfeld's best category (10+), at the floor of Baz-Valle's 12-20. RP: beginners' landmarks are "substantially lower" than intermediates'. | **Matches.** Enough to grow, little waste. |
| Intermediate 15-20 = "maintenance to some growth" (VOL-01, UNI-01) | Pelland's intermediate tier; exactly Baz-Valle's standard; Aube's best (18). | **Matches as a productive baseline.** Science says true maintenance needs far less (section 2.4), so his "maintenance" here means "keeps you progressing slowly", not "the minimum to keep muscle". |
| Growth 20-25, advanced 20+ (UNI-01, VOL-01) | Pelland's lower-efficiency tier: still more growth, but each detectable step costs ~11 more sets. Baz-Valle found >20 helped triceps, not quads or biceps. | **Matches for trained people who recover well**, with a clear cost. Good for limited periods (end of a block), not all year. |
| Priority cap 25-30 (VOL-02) | Edge of Pelland's lower/lowest tiers; inside RP's priority ranges (chest MRV*P 24-32+). | **Matches** for one or two muscles at a time, with other muscles held back. |
| "5 too little, 40 too much" (UNI-01) | 5 = Pelland's minimum dose; 40 = lowest efficiency / almost no data. | **Matches.** |
| "10 % per week is too much" (UNI-05) | No study tested weekly % caps directly. Related evidence in section 2.5. | **Supported indirectly.** 3-7 % is conservative and sensible. |
| Floor of 10 sets per muscle (COACH-R2 VOL-06) | Top of Pelland's high-efficiency tier; Schoenfeld's "10+" category; RP MEV is lower (4-10) | **Matches** as a growth floor (true maintenance needs less, §2.4). |
| "Most people train 20-30" (COACH-R2 VOL-06) | Surveys: bodybuilders ~16 direct sets per muscle (one session a week) and 8-17 (natural, pre-contest); RP MRV 16-26; Pelland lower-efficiency tier | **Matches for trained people counting indirect work; high as a population average** (§2.11). |

**Counting difference to keep in mind.** Pelland counted indirect sets at 0.5; the coach counts helpers at 0.25 (COACH-ANSWER VOL-09). For chest, quads, hamstrings and back (mostly direct work) both counts are almost the same. For glutes, triceps, biceps and the delts the coach's count is lower than Pelland's for the same program. The engine steers on the coach count and may **show** the Pelland count beside it; v1.2 stores nothing (COACH-R3 GEN-01), so the v1.1 idea of testing which count predicts results better on user data is retired (section 3.14).

### 2.3 Per-muscle landmarks (Renaissance Periodization, intermediate lifters, direct sets/week)

MV = maintenance volume, MEV = minimum effective, MAV = maximum adaptive, MRV = maximum recoverable, "*P" = when the muscle is the priority and other training is cut back. RP notes beginners' landmarks are lower and advanced lifters' are similar to these. Chest, quads and rear delts re-checked on rpstrength.com on 2026-10-08; the rest from the team's 2026-10-07 fetch (`03_volume_dosing.md` §3.6).

| Muscle | MV | MEV | MAV | MRV | MAV*P | MRV*P | Frequency |
|---|---|---|---|---|---|---|---|
| Chest | 2-4 | 4-6 | 6-16 | 16-24 | 16-24 | 24-32+ | 2-4x |
| Quads | 2-4 | 4-6 | 6-14 | 14-18 | 10-18 | 18-24+ | 2-5x |
| Hamstrings | 0-2 | 2-4 | 2-8 | 8-14 | 8-14 | 14-20 | 2-3x |
| Glutes | 2-6 | 6-8 | 8-24 | 24-30 | 24-30 | 30-40+ | 2-5x |
| Back | ~6 | ~10 | 4-12 per session | ~20-25 | - | - | 2-4x |
| Biceps | 6-8 | 8-10 | 14-20 | 20-26 | 20-26 | 26-35 | 3-6x |
| Triceps | 0-4 | 4-6 | 6-16 | 16-20 | 16-20 | 20-26+ | 2-4x |
| Front delts | 0-2 | 0-2 | 4-8 | 8-12 | 12-16 | 16-20+ | 2-3x |
| Side delts (older RP figures, secondary source) | 0-6 | 8 | 16-22 | 26+ | - | - | 2-6x |
| Rear delts | 0-4 | 0-4 | 4-12 | 12-20 | 24-30 | 30-40+ | 3-6x |
| Calves | 2-4 | 4-6 | 6-16 | 16-24 | 16-24 | 24-32+ | 3-6x |
| Abs | 0-4 | 0-4 | 4-12 | 12-20 | 16-24 | 24-32+ | 3-6x |

RP also puts a practical per-session ceiling at about **8-12 sets per muscle**, close to Remmert's ~11. (SCIENCE)

**Why RP's numbers look lower than his.** RP counts direct sets only and assumes the indirect work is "free". His totals include helper credit (0.25) and his clients often run more sessions. On the big muscles his 15-20 sits at RP's MAV-to-MRV range: an intermediate pushing toward the top of a block, which is what his 12-week shape describes.

### 2.4 Maintenance (what a 4-6-week maintenance block needs)

- **Spiering et al. (JSCR 2021), review:** strength and size were kept for up to 32 weeks with **1 session/week and 1 set per exercise** if the load stayed heavy, in younger adults; older adults needed about **2 sessions/week and 2-3 sets per exercise** to keep size. (SCIENCE)
- **Bickel, Cross, Bamman (MSSE 2011):** after 16 weeks of 3 days/week × 3 sets, 32 weeks at **1/3 of the dose** (1 day/week, 3 sets) or **1/9** (1 day/week, 1 set). Young adults: 1/3 kept growing, 1/9 kept size. Older adults (60-75): neither dose kept the muscle-fibre growth, though strength was largely kept; the authors conclude older adults need more weekly sets than younger adults to keep size. (SCIENCE)
- **RP:** MV about 6 sets per muscle per week. (SCIENCE)
- **Barsuhn et al. (J Appl Physiol 2024):** trained men who simply kept their previous weekly sets grew and got stronger as much as (slightly more than) those who added 30 % or 60 %. (SCIENCE)

**Verdict for his 50-70 % rule (PER-01).** 50-70 % of an intermediate's working volume (about 8-14 sets per muscle) is **well above** the minimum the research needs to keep muscle in younger adults, so a 4-6-week block at that level should keep size and most strength while giving real recovery. For older adults the research says keep the high end (PROPOSED: floor 70 %).

### 2.5 Adding sets inside a block

- **RP:** start a block near MEV and add sets while recovery allows; the RP app's default is about **+1 set per muscle per week**, with soreness, pump and performance deciding; advanced lifters typically add only **2-3 sets per muscle per session over the whole 4-week accumulation**. RP argues autoregulated additions beat pre-planned ones. (SCIENCE; the "+1 per week" figure is from a secondary summary of the RP app)
- **Enes et al. (MSSE 2023/2024):** trained men, 12 weeks, quads, all starting at 22 sets/week: fixed 22, **+4 sets every 2 weeks (to 42)** or **+6 every 2 weeks (to 52)**. Strength: +6 > +4 > fixed. Growth: no significant group difference (a trend that levelled off at the higher volumes). The +6 group reported clearly less pleasant sessions and the highest training strain. (SCIENCE)
- **Scarpelli et al. (2022):** one leg on a fixed 22 sets/week, the other on **1.2 × the person's previous volume** (+20 %): the individualized leg grew more. (SCIENCE)
- **Barsuhn et al. (2024):** +30 % and +60 % above previous volume did not beat staying at the previous volume over 8 weeks. (SCIENCE)

**What this means for 3/5/7 %.** At 15-20 sets, 3 % adds ~0.5 set/week, 5 % ~0.8, 7 % ~1.1, i.e. RP's "about one set per week" at the top end. Big jumps (+30-60 %, or +4-6 sets every 2 weeks from 22) add strain without reliably adding growth. A 3-7 % step with a 10 % ceiling is a conservative, defensible design; the v1.1 stairway's standard steps (3 % then 5 %) and their λ-scaled versions sit at or below RP's ~1 set a week. (INFERRED from the above) **v1.3:** the 3 % then 5 % pattern is the shape every plan starts from, not a limit. The coach chose to reach the planned final sets with faster steps when that is what it takes (COACH-CX CX-01), with no hard limit and a note on any week that adds more than about 15 % (COACH-R4 R4-PRG-02). The 7 % and 10 % ceilings are retired; the evidence above is why the note exists.

**The 10 % question in other sports.** In team sports, week-to-week load jumps above ~10-15 % have been linked to more injuries (Gabbett 2016, the acute:chronic workload model), but that model has been heavily criticised as a statistical artefact (Impellizzeri et al. 2021). In runners the "10 % rule" is weakly supported: injured runners in one cohort had ~32 % average weekly increases vs ~22 % in healthy runners, a difference that was not statistically significant (Nielsen et al. 2013). So 10 % is a sensible **caution**, not a target. (SCIENCE) *(v1.3: it is not a rule of the model; see the note above.)*

### 2.6 Readiness and autoregulation (choosing 3, 5 or 7 %)

- **RIR scale:** reps in reserve map to RPE (RPE 8 = 2 RIR, RPE 9 = 1 RIR). (Helms et al. 2016; Zourdos et al. 2016; SCIENCE)
- **People misjudge RIR by about one rep** (they think they have fewer reps left than they do); accuracy improves near failure and in sets under ~12 reps. (Halperin et al. 2022; SCIENCE) → use effort as a **trend**, not a single-set truth.
- **Autoregulated loading (RPE/RIR or bar speed) works as well as percentage-based loading** for strength (meta-analysis, 1RM difference 2.07 kg, not significant). (Hickmott et al. 2022; SCIENCE)
- **Life stress slows progress:** in 135 students over 12 weeks, high-stress lifters gained less bench and squat strength (Bartholomew et al. 2008); chronic stress slowed muscle recovery over 96 h (Stults-Kolehmainen et al. 2014). (SCIENCE)
- **Sleep:** several nights of short sleep lower force on multi-joint lifts (Knowles et al. 2018). (SCIENCE)

→ The coach's "it depends on how tired they are and what's going on in their life" (UNI-05, VOL-05) has direct research support, and v1's readiness score used exactly these inputs. **v1.1:** he does not want lifestyle questions ("I just need the workouts here", COACH-R2 GEN-04), so sleep and stress stay here as background only. **v1.2:** there is no weekly step from the person at all - no check-in, nothing stored (COACH-R3 VOL-02, VOL-04, GEN-01); the plan's planned stairway runs as written, and the printed self-adjust guide (§3.7.3) tells the person how to adjust after a hard week.

### 2.7 Deloads

- **Bell et al. (Sports Med Open 2023), Delphi consensus of strength and physique coaches:** the consensus defines a deload as a planned period of lower training stress that clears physical and mental fatigue, helps recovery and prepares for the next block. Full agreement that deloads cut **sets** and **proximity to failure**; 95 % agreed a deload can sit in the **last week** of a block, 75 % in the **first week of the next block**; it can be pre-planned or autoregulated; keep the main multi-joint lifts. (SCIENCE)
- **Survey of 246 strength and physique athletes (Rogerson, Bell et al. 2024):** deload every **5.6 ± 2.3 weeks**, lasting **6.4 ± 1.7 days**; 79 % cut sets; most also cut effort; 47 % pre-plan, 39 % mix planned and reactive. (SCIENCE)
- **Coleman et al. (PeerJ 2024):** a full week off at the middle of a 9-week program did not change muscle growth but slightly reduced strength gains. (SCIENCE)

→ His "about half the sets, lighter" (PER-05) is in the middle of practice. Round 2 settles the timing: **never inside a block**, only between blocks (COACH-R2 VOL-07); the Delphi panel's agreement that a deload can sit in the last week of a block or the first week of the next one fits that. v1's triggered mid-block deloads are retired, and in v1.2 the easy week between blocks is a recommendation, not a mandatory week (COACH-R3 PER-01; §3.12).

### 2.8 Older adults

- **Borde, Hortobágyi, Granacher (Sports Med 2015), 25 trials, age 65+:** best strength results with 2-3 sets per exercise, 7-9 reps, 70-79 % 1RM, 2 sessions/week; none of the volume variables predicted changes in muscle size. (SCIENCE)
- **NSCA position statement (Fragala et al. 2019):** 2-3 sets per major muscle group, 2-3 days/week, start from single sets and progress individually; power work at 40-60 % 1RM; 2 min rest. (SCIENCE)
- **Bickel 2011:** older adults need more weekly sets than younger adults to keep size. (SCIENCE)
- **Plyometrics for masters athletes:** 3-4 days between plyo sessions (NSCA guidance as summarised for the CSCS exam). (SCIENCE)

→ Fits the coach: older clients go to constrained machines for extra volume (EQ-03); round 2 tightened his "few plyos unless they ask" (ATH-09) to **no Olympic lifts, plyos or depth jumps by default**, available as an option with a warning to work with a fitness professional (COACH-R2 ATH-08); round 3 fixed the defaults from 60: landing drills (no bounce), balance, quick stepping, light medball throws and fast machine work on; low ankle hops, other jumps, Olympic lifts and depth jumps off unless switched on with the warning (COACH-R3 ATH-02; §3.4, §3.13). The NSCA's slow progression from single sets fits the stairway's small early steps.

### 2.9 Unilateral vs bilateral

- **Liao et al. (Biol Sport 2022), 14 studies, 392 athletes aged 16-26:** unilateral training improved **single-leg jumps** much more (effect size 0.89); bilateral training improved **bilateral strength** more (-0.43, favouring bilateral); sprint, change of direction and single-leg strength showed no reliable difference. (SCIENCE)

→ Training is specific: bilateral drives force (powerlifters, bodybuilders), unilateral carries over to single-leg athletic actions. This is the coach's split (UNI-02).

### 2.10 Plyometrics vs ballistics and contact counts

- **Ground contact time classifies jumps:** fast stretch-shortening cycle (SSC) under **~250 ms** (sprinting ~80-90 ms, hurdle hops ~150 ms, low depth jumps) vs slow SSC over 250 ms (countermovement jumps ~500 ms). The 250 ms line is usually credited to Schmidtbleicher and is a continuum, not a hard border; newer work proposes refined thresholds. (SCIENCE)
- **NSCA lower-body contacts per session:** beginner 80-100, intermediate 100-120, advanced 120-140; 48-72 h between plyo sessions on the same area; 2-3 min between sets of depth jumps. (SCIENCE)
- **Observed in his sheets:** his own sessions sit at or below the NSCA beginner range (18-77 counted contacts per session; `03_volume_dosing.md` §6). (OBSERVED)

→ The coach's rule maps cleanly: sports that live in short contacts (sprinters, jumpers, basketball) get more fast-SSC plyos; sports with long ground time (karate, fighters, baseball) get more slow-SSC/ballistic work (ATH-01).

### 2.11 "Most people train around 20 to 30 sets per muscle per week" (COACH-R2 VOL-06): what the research and the surveys say

**His statement:** "I think most people train around that: 20 to 30 sets per muscle per week. I believe so, but you can do some research and figure it out." (COACH-R2 VOL-06)

**What trained people report doing (practitioner surveys).**

| Survey | Who | Weekly sets per muscle | How it was counted | Tag |
|---|---|---|---|---|
| Hackett, Johnson, Chow, JSCR 2013 | 127 competitive male bodybuilders (off-season) | 95 % did 3-6 sets per exercise and 74 % used 4-5 exercises per muscle group; the typical answer was about 4 sets × 4 exercises ≈ **16 sets per muscle in one session**; 69 % trained each muscle **once** a week (31 % twice), so about **16 per week for most, ~30+ for the twice-a-week minority** | sets per exercise × exercises per muscle (direct work) | SCIENCE (abstract + secondary summaries) |
| Baz-Valle et al., Sports 2026; 14(1):20 | 56 drug-tested Spanish elite bodybuilders (27 amateur, 29 professional), pre-contest | **8-17 direct sets per muscle per week** on average: back 15.3 (amateur) / 17.0 (pro), chest 11.8 / 12.7, hamstrings 8.6 / 8.1; most muscles trained more than once and less than three times a week | direct sets only | SCIENCE |
| Teixeira et al., Motriz 2018; 24(2) | 105 trained gym-goers in Brazil (63 men, 42 women) | men's medians: chest 30, back 24, deltoids 80, biceps 51, triceps 54, quads 16, hamstrings 8, glutes 12; women's: glutes 41, quads 30, hamstrings 16, deltoids 28, chest 10.5 | every set in which the muscle takes part counted as a full set (helpers = 1.0) | SCIENCE |

**What the dose-response research supports.**

| Source | Finding | Tag |
|---|---|---|
| Schoenfeld, Ogborn, Krieger 2017 | 10+ weekly sets beat 5-9; few data above ~20 | SCIENCE (§2.1) |
| Schoenfeld et al. 2019 | trained men grew most on ~30-45 weekly sets (5 sets per exercise); strength the same | SCIENCE (§2.1) |
| Baz-Valle et al. 2022 | **12-20** weekly sets is the standard recommendation; above 20 helped triceps only | SCIENCE (§2.1) |
| Pelland et al. 2026 (67 studies) | growth keeps rising with diminishing returns: **19-29 = "lower efficiency"** (~11 more sets per detectable gain), **30-42 = "lowest efficiency"**, evidence above ~30 thin | SCIENCE (§2.1) |
| Enes et al. 2023/2024 | from 22 sets, +4 or +6 every 2 weeks (to 42 / 52) gave no significant extra growth and much more strain | SCIENCE (§2.5) |
| Renaissance Periodization landmarks | MRV (most you can recover from) for intermediates: chest 16-24, biceps 20-26, glutes 24-30, quads 14-18, side delts 26+ (direct sets) | SCIENCE (§2.3) |

**Verdict, next to his statement (INFERRED).**
- **As "what trained, hypertrophy-focused people work up to, counting the indirect work", 20-30 fits.** It is RP's MRV range, Pelland's lower-efficiency tier, and what the twice-a-week minority of competitive bodybuilders do. Counted the coach's way (helpers 0.25), the bodybuilder direct-set averages (8-17) rise by roughly 1-4 sets for the upper body, so the busiest trained muscles reach the low 20s.
- **As "what most people do", it is high.** Direct-set surveys of bodybuilders put the typical muscle at about 8-17 a week (natural, pre-contest) or about 16 (once a week); general gym-goers vary enormously from muscle to muscle (from 8 sets for hamstrings to 50-80 for arms and shoulders when every helping set is counted as a full set), which shows the counting method decides the number.
- **His caps already sit inside it:** non-priority caps 22 (L2) and 25 (L3), priority 26-30. Above 30 the research is thin (Pelland) and the extra growth costly (Enes), which supports his "more than 30 ... for a very advanced person" and an opt-in Pro setting rather than a default.
- **Engine consequence:** no number changes. L2-L3 12-week stairways finish at 22-25 sets for non-priority muscles and 26-30 for a priority (§3.7.1), inside his 20-30; L1 plans stay 10-14; the floor is 10 (COACH-R2 VOL-06). v1.2: the tool collects no data (COACH-R3 GEN-01); the coach changes the defaults by hand if he sees real users sit elsewhere.

---

## 3. The engine v1.2

> **Changed in v1.3.** Sections 3.1, 3.3 and 3.7 to 3.12 carry notes where round 4, CT-01 or CX changed them; the v1.3 engine is described in the v1.3 section at the top of this file (V2 to V6).

### 3.1 Counting units

> **Changed in v1.3** (COACH-R4 R4-LIB-02, R4-LIB-03). Carries and sled work credit no muscle. A 30-45 degree incline press counts 1.0 for chest; a high-incline press counts 1.0 front delts + 0.5 chest + 0.25 triceps (PROPOSED). Where the text below differs, the v1.3 section at the top of this file wins.

**Credit map** (one working set; RIR 1-3, 5-30 reps). Main mover 1.0, helpers 0.25 (COACH-ANSWER VOL-09).

| Category (canonical bucket) | 1.0 | 0.5 | 0.25 | Tag |
|---|---|---|---|---|
| Bilateral knee dominant (squat, leg press, hack, belt squat) | quads | - | glutes, adductors | COACH-ANSWER VOL-09; glute 0.25 COACH-R2 VOL-05 |
| Unilateral knee dominant (split squat, lunge, step-up) | quads | - | glutes, adductors | COACH-ANSWER UNI-01 ("mostly quads"); glute 0.25 COACH-R2 VOL-05 |
| Bilateral / unilateral hip dominant (deadlift, RDL, single-leg RDL, back extension) | hamstrings | - | **glutes** (v1: 0.5 PROPOSED) | COACH-R2 VOL-05 ("a quarter") |
| Glute isolation (hip thrust, bridge, kickback, abduction) | glutes | - | hamstrings | COACH-R2 VOL-05 (hip thrusts, bridges = 1 set); hamstring 0.25 COACH-ANSWER VOL-09 |
| Leg flexion (leg curl, nordic, slider/swiss-ball curl) | hamstrings | - | - | COACH-ANSWER CAT-09 |
| Leg extension | quads | - | - | COACH-ANSWER VOL-09 |
| Horizontal push | chest | - | triceps, front delts | COACH-ANSWER VOL-09 |
| Vertical push | front delts | - | side delts, triceps | COACH-ANSWER VOL-09 |
| Dips | - | triceps, chest | - | COACH-ANSWER LIB-16 |
| Thruster | quads | front delts ("shoulders") | glutes | COACH-ANSWER LIB-14; COACH-R2 VOL-05 (1 / 0.5 / 0.25) |
| Horizontal pull (rows; Kong row = double-KB row, low stimulus) | lats/upper back | - | biceps, rear delts | COACH-ANSWER VOL-09, LIB-09 |
| Vertical pull | lats/upper back | - | biceps | COACH-ANSWER VOL-09 |
| Lat pull-over ("pull under") | lats/upper back | - | - | COACH-ANSWER LIB-09 |
| Face pull (cable or KB) | rear delts | - | side delts | COACH-R2 LIB-04, LIB-10 ("shoulder work": side/rear delts/traps, on pull or shoulder days); split PROPOSED; on the v1.2 shoulders line it counts 1.0 (group credit, COACH-R3 VOL-01) |
| Chest fly, side raise (and upright row), rear-delt fly, curls, triceps isolation, calf raise | the target muscle | - | forearms 0.25 on curls | COACH-ANSWER VOL-09, LIB-16 assumption |
| Core (thorax / pelvis) | abs/obliques | - | - | COACH-ANSWER CAT-08 |
| Plyo, ballistic (**KB swing included**), throw, Olympic, sprint, change of direction | **none** (own budget, §3.13) | | | COACH-ANSWER VOL-10; COACH-R2 VOL-05 ("kettlebell swings are not glutes") |

**Other counting rules**
- **10/10 = one set** for the muscle (each side does one set). Alternating = unilateral. (COACH-ANSWER UNI-01, UNI-07)
- **Unilateral sets cost more time** (both sides): 1.5 × a bilateral set in the time model. (COACH-ANSWER UNI-09; factor PROPOSED)
- **MYO set** = 2 hard sets (INFERRED; only on the last machine or isolation exercise, COACH-ANSWER VOL-15).
- **Hard set** = a working set at 1-3 RIR (COACH-ANSWER VOL-13). Warm-up sets and A-drills never count (ORD-08); core sets in the light opener count toward abs (COACH-R2 SES-03 approved the 2 × 2 opener).
- **Group credit (v1.2):** a set counts at most 1.0 to a line or group - the shoulders line (front + side + rear delts) and the hips group (glutes + hamstrings) add their members' credits and cap them at 1 (§3.3). (COACH-R3 VOL-01, SES-01; rule PROPOSED)
- The engine steers on the **coach count (helpers 0.25)** and may show the **Pelland count (indirect 0.5)** beside it; nothing is stored (COACH-R3 GEN-01). (PROPOSED)
- **What the glute change does:** with every compound at 0.25, a physique plan reaches its glute start only with direct glute work (hip thrust family or Focus slots); examples 5.1 and 5.2 carry two glute exercises on one hip day (§5).

### 3.2 Levels (client volume level, separate from exercise difficulty)

| Level | Who | Tag |
|---|---|---|
| **L1** (novice / "newby", the same thing) | Under about 6-12 months of consistent training, **or** more than 6-12 months off (body treated as a beginner; exercise level can stay higher because skills return fast). Ex-pros: L1 for one short block only, then up. | COACH-ANSWER PRG-05, CAT-06 |
| **L2** (intermediate) | Consistent training for more than 1 year. | COACH-ANSWER PRG-05 |
| **L3** (advanced) | 3+ years of consistent training **and** currently training 4+ days/week, or a competitive physique/strength athlete. | PROPOSED (he did not define advanced) |
| **Pro setting** (optional, not a level) | L3 only, set by the coach at build time (or for a client who is "really adamant about growing that muscle"); lets **one** priority-push muscle pass 30 sets, up to 35 (PROPOSED number); other muscles held at ≤ 3 %/week; shows a warning. (v1.1's "needs the weekly check-in" is retired with the check-in, COACH-R3 VOL-02.) | COACH-R2 VOL-06 ("maybe we can add a pro level"); numbers PROPOSED |
| Level up | At the end of a block the user (or coach) chooses the level for the next build; the plan's last page says when to move up ("if the block mostly felt like '8 - That was perfect' or easier, with no pain"). No logs are read (COACH-R3 VOL-02, GEN-01). | COACH-ANSWER PER-06; COACH-R3 VOL-04 |

The old L4 is retired: competition level now changes the **athlete profile** (sport, position, season), not the volume level. (COACH-ANSWER PRG-05)

### 3.3 Starting weekly sets per line (aesthetics / hypertrophy goal; coach count)

> **Changed in v1.3** (COACH-R4 R4-SES-03). The floor of 10 applies from 3 training days. With 2 training days every big group starts at 6 and tops at 8 (section V5). Where the text below differs, the v1.3 section at the top of this file wins.

"Fill policy" says what the engine does when a line is below its start: **target** = add direct sets; **credit** = count helper credit only, no direct slot unless it is a Focus muscle or the sport needs it; **floor** = indirect only, report it, never add; **core block** = set by the session count. The lines are the coach's FOCUS headers ('QUADS', 'HAMSTRINGS', 'GLUTES', 'CHEST', 'BACK', 'SHOULDERS/TRAPS', 'BICEP', 'TRICEP', 'CALVES', 'CORE'; OBSERVED); the floor of 10 is read on the R3-SES-01 groups, where hips = glutes + hamstrings.

| Line | Group (floor of 10) | Class (CAT-02) | Fill policy | L1 start | L2 start | L3 start | Ceiling L1 / L2 / L3 | Focus muscle (+F, default +2) | RP intermediate direct (MEV / MAV / MRV) |
|---|---|---|---|---|---|---|---|---|---|
| Quads | quads | big | target | **10** | **15** | **20** | 14 / 22 / 25 | start + F, ceiling + F (≤ 18 / 26 / 30) | 4-6 / 6-14 / 14-18 |
| Hamstrings (hinge + leg flexion) | hips | big | target | **10** | **15** | **20** | 14 / 22 / 25 | same | 2-4 / 2-8 / 8-14 |
| Glutes | hips | big | target (field athletes: credit) | **10** | **15** | **20** | 14 / 22 / 25 | same | 6-8 / 8-24 / 24-30 |
| Chest | chest | big | target | **10** | **15** | **20** | 14 / 22 / 25 | same (≤ 18 / 28 / 30) | 4-6 / 6-16 / 16-24 |
| Lats / upper back | back | big | target | **10** | **15** | **20** | 14 / 22 / 25 | same | ~10 / - / ~20-25 |
| **Shoulders** (front + side + rear delts, traps) | shoulders | small | target (field athletes: at the floor, through the shoulder-care station and presses) | **10** | **12** | **15** | 14 / 22 / 25 | same | side 8 / 16-22 / 26+; rear 0-4 / 4-12 / 12-20 |
| Biceps | biceps | small | target (field athletes: credit) | **10** | **12** | **15** | 14 / 22 / 25 | same | 8-10 / 14-20 / 20-26 |
| Triceps | triceps | small | target (field athletes: credit) | **10** | **12** | **15** | 14 / 22 / 25 | same | 4-6 / 6-16 / 16-20 |
| Calves | calves | small | target | **one exercise × 3 sets every leg day** | same | 3-4 per leg day | 14 / 22 / 25 | +F sets on the existing calf exercise, then the optional-day slot | 4-6 / 6-16 / 16-24 |
| Abs / obliques | core | small | core block | 2 exercises × 2 sets per session, first, short of failure | same | same | 16 / 20 / 20 | - | 0-4 / 4-12 / 12-20 |
| Traps, forearms, adductors, neck | - | unplaced / small | floor | indirect | indirect | indirect | - | direct slot only if chosen | - |

Tags: big-line starts **COACH-ANSWER VOL-01**; small-line starts 12 / 15 **COACH-R2 VOL-04 (RIGHT)**, read on the shoulders group because the coach "figured the shoulders were what we were talking about" (**COACH-R3 VOL-01**); L1 small 10 (instead of 8) and the floor of 10 **COACH-R2 VOL-04, VOL-06**; the floor counted on groups **COACH-R3 VOL-01, SES-01**; caps 14 / 22 / 25 **COACH-R2 VOL-06 (RIGHT; "all customizable")**; small lines on the same caps as big ones **INFERRED** from "the little muscles also grow the same idea" (VOL-04); calves one exercise × 3 per leg day **COACH-ANSWER VOL-17, COACH-R3 SES-01**; core opener **COACH-R2 SES-03**; Focus muscles **COACH-R3 SES-01** (default +2, the bound by the priority caps 18 / 26-28 / 30 of R2-VOL-06, PROPOSED); the L3 start of 20 as the low end of "20+" PROPOSED.

**Group credit (PROPOSED, needed by R3-VOL-01).** Lines and groups count a set at most once: line credit = the smaller of 1 and the sum of its member muscles' credits. Shoulders: a side raise, a rear-delt fly, a face pull (rear 1.0 + side 0.25 → 1.0), a vertical press (front 1.0 + side 0.25 → 1.0) and an upright row are 1 shoulder set each; a thruster 0.5; a horizontal press (front delts 0.25) and a row (rear delts 0.25) 0.25. Hips: a hinge, a hip thrust and a leg curl are 1 hip set each; a squat or lunge 0.25 (glutes). The engine still reports side, rear and front delts and glutes / hamstrings separately for display.

**The floor of 10 on groups (COACH-R2 VOL-06, COACH-R3 VOL-01).** Every directly trained **group** - quads, hips, chest, back, shoulders, biceps, triceps, calves - holds 10 or more sets a week in any training block, after the goal and phase factors (§3.4). Not floored: maintenance phases, pre-season and in-season blocks (maintenance by the coach's own definition, PER-01, R2-PER-06), a pain-reduced group (VOL-03 wins), groups left to compound credit by the time policy (§3.10.1) and credit-only lines of field athletes. Calves: the coach's own minimum is 3 sets per leg day; with fewer than 4 leg days they reach 10 through a 4th set and the optional-day 'Calves' slot (PROPOSED) - never through a second calf exercise on a leg day (COACH-R3 SES-01). Abs reach 10+ through the core opener at 3+ sessions a week.

**Rear delts inside the shoulders group (COACH-R3 VOL-01, resolves the v1.1 flag).** "Rear delts are weird because they're part of the shoulder cap ... I wouldn't categorize the rear delt as an individual muscle." Their own 4 / 6 / 8 sets (COACH-R2 VOL-04) are retired as a number; the content rule stays: every plan holds at least one rear-delt exercise a week (reverse fly or KB face pull, 2+ sets; VOL-17 "rear delts get their own sets"), rows give rear delts 0.25 a set ("the rear delts also get worked when you do back"), and the plan editor offers **"add rear delts"** (a 2-set rear-delt exercise on a pull day, §3.10.2). Example 5.2: shoulders 13 → 20 sets over the block for an L2 bodybuilder, of which about 6-8 rear-delt credit.

**Why small lines start below big ones at L2-L3 (COACH-R2 VOL-04, RIGHT).** It fits the session time, and arms and delts also grow from presses and rows (Gentil et al. 2015; SCIENCE). At L1 the floor lifts them to the big-line start (10).

**Week 1 above the start.** Two exercises × 2 sets on every day a group is trained (R2-SES-05) often put a line above its start in week 1 (e.g. shoulders 12 against a start of 10 in example 5.1). The stairway then climbs from the week-1 sets, not from the table value (§3.7.1), so no line runs flat while its planned target catches up (COACH-R3 SES-02 step 4).

### 3.4 Goal, phase and population modifiers (multiply the start values; then the floor of 10 on groups)

Factor results round half up (11's I11, PROPOSED). The sport and activity profiles (`04_athlete_profiles`, `06_periodization`) own the athletic details; the rows below are what the volume engine reads.

| Situation | Lower body | Upper body | Small lines | Rate / notes | Tag |
|---|---|---|---|---|---|
| Aesthetics / bodybuilding / hypertrophy | 1.0 | 1.0 | 1.0 | same-pattern pairing allowed (squat + lunge); 4 aerobic sessions, adjustable | COACH-ANSWER VOL-01, UNI-06; COACH-R2 SES-06 |
| Strength / powerlifting | 1.0 | 1.0 | 0.75, then floor 10 | weekly sets stay similar; preference moves the **reps** on big lifts; 2 easy (Orange) aerobic sessions | COACH-ANSWER VOL-12; COACH-R2 ATH-06; small factor PROPOSED |
| General fitness, weekend-warrior athletic, **"stay athletic and active"** (recreational pickleball, padel, tennis, HYROX for fitness, rec leagues) | 0.8 | 0.8 | 0.8, then floor 10 | 45-60 min (longer on full-body days, §3.10); cross-pattern pairing; athletic work from the 04 profile of the activity; **play days** (the hardest gym day at least 48 h before the biggest play day; weeks with 3+ play sessions drop the extra agility drills and half the jumps), a 45-60+ min session of the activity counts as one of the 3 cardio sessions (up to 2), an optional **event date** (the hardest weeks end 1 week before, then 1 easy week at about half the sets) | COACH-ANSWER UNI-09, UNI-06, ATH-13; COACH-R3 ATH-05; factor PROPOSED |
| Pickleball / padel / tennis players 50+ | as the row above | | | knee-friendly strength; **calf and Achilles work every leg day** (a pinned group in the time policy, §3.10.1); rotator-cuff work (warm-up / shoulder-care station, never bands); only low-impact jumps unless switched on | COACH-R3 ATH-02 (RIGHT) |
| HYROX (fitness racing) | 0.8 | 0.8 | 0.8, then floor 10 | 2 strength days (squat + pull, deadlift + push) + 2 hybrid days; 4 cardio sessions (Blue, Green, Orange + a second Orange); 2 short station circuits a week as finishers that **never count as muscle sets**; wall balls with the race ball (never over 20 lb); 40-rep / AMRAP sets only inside these circuits; jumps 50 % plyometric | COACH-R3 ATH-03 (RIGHT); factor PROPOSED |
| Bootcamp | circuits 3-5 rounds × 30-50 s, 5-7 stations, 35-45 min | | | not set-based | COACH-ANSWER PRG-03 |
| Fat loss | 0.8 | 0.8 | 0.8, then floor 10 | + 3 aerobic sessions/week, adjustable | COACH-ANSWER ATH-07; COACH-R2 SES-06; factor PROPOSED |
| Field/court athlete, off-season | 0.7 | 0.5, **then floor 10** | biceps, triceps and glutes credit only; **shoulders at the floor** (shoulder-care station + presses, group credit) | resistance is 2-4 exercises per group trained that day after core, plyo and Olympic work (12 + 2 core); the floor lifts chest and back from 7.5 to 10 at L2 (flagged) | COACH-ANSWER VOL-08, VOL-17, UNI-02; COACH-R2 VOL-06; COACH-R3 SES-01, VOL-01; factors PROPOSED |
| Competitive swimmers (dryland) | 0.7 | 0.5, then floor 10 | as field athletes; shoulder care every session (external rotation, floor Y/T raises, KB face pulls; never bands) | 3 dryland gym days + 1 optional (2 for younger or lower-level swimmers); **0 extra cardio** by default (the pool is the aerobic work; user can add one); jumps mostly ballistic, 25 % plyometric at block end; Olympic lifts 2-3 days; a 2-week dryland taper lined up with the swim taper before the main meet (1 week or none before smaller meets) | COACH-R3 ATH-01 (RIGHT); factors PROPOSED |
| Strength-type athlete off-season (linemen, wrestlers, rugby forwards, throwers, heavyweight fighters) | 0.9 | 0.8 | 0.6, then floor 10 | the same-pattern athletic template when the goal is size (COACH-R3 SES-01) | COACH-ANSWER ATH-03; factors PROPOSED |
| Athlete pre-season | about **0.6 of the off-season sets** | | credit | 4-6 weeks, more speed and power, 1-2-week taper before the first game; no floor (maintenance) | COACH-R2 PER-06 (RIGHT) |
| Athlete in-season | 0.4-0.5 | 0.3-0.4 | credit | 2 days/week, flat (no stairway); game-heavy sports (basketball, volleyball, soccer, football, hockey; R3-ATH-04 adds lacrosse, field hockey, rugby, ultimate, flag football, beach volleyball): gym plyos about half, no extra change of direction, sprints only for speed athletes, the one hard gym day at least 48 h before a game | COACH-ANSWER PER-08, UNI-10; COACH-R2 ATH-07; COACH-R3 ATH-04; factors PROPOSED |
| Boxer / striker in high-punching weeks | as profile | pressing × 0.5-0.7 | arms × 0.5-0.7 | reduce, never cut to zero | COACH-ANSWER ATH-04; factor PROPOSED |
| Older adult (60+) | as goal | as goal | as goal | the same stairway as everyone (v1.1's PROPOSED ≤ 3 % step cap is retired: every trained group reaches its ceiling in the last week, COACH-R3 VOL-04); extra volume on constrained machines; **on by default:** landing drills (step down and stick, no bounce), balance, quick stepping without a hop, light medball throws, fast machine work; **off by default:** low ankle hops, other jumps, Olympic lifts, depth jumps - switchable on with the warning "Make sure that you have a fitness professional to help you understand what this means"; overhead squats and low-bar squats stay out | COACH-ANSWER EQ-03, EQ-04; COACH-R2 ATH-08; COACH-R3 ATH-02; SCIENCE (Borde, Fragala, Bickel) |
| Youth | as goal | as goal | as goal | Olympic lifts from the floor from about 14, after one block of hang work | COACH-R2 ATH-08 |
| No sex-based rules | - | - | - | age, foundation, goal and injuries decide (a Focus muscle is the user's choice, never inferred from sex) | COACH-ANSWER ATH-09, GEN-02; COACH-R3 SES-01 |

### 3.5 Focus muscle 1 and Focus muscle 2 (COACH-R3 SES-01)

1. **Intake:** the user may pick **Focus muscle 1** and **Focus muscle 2** (none, one or two; never more): any line - quads, hamstrings, glutes, chest, back, shoulders, biceps, triceps, calves. "There could be a main focus muscle 1 and a main focus muscle 2, and that should be enough for the whole thing." No sex field: his "if it's a female and she chooses glutes" is an example of a choice, never a default (COACH-ANSWER GEN-02, ATH-09). (COACH-R3 SES-01)
2. **Dose:** each Focus muscle gets **+F extra weekly sets over the balanced plan, F = 1-3** ("an extra set or two or three"); default **F = 2** (PROPOSED; the user or coach may pick 1 or 3). F is added to the start **and** to the ceiling, so the extra is there from week 1 to the last week and the stairway includes it ("throughout this program"); the ceiling never passes the approved priority caps 18 / 26-28 / 30 (COACH-R2 VOL-06). Example: L2 glutes 15 → 22 balanced becomes 17 → 24 (12-week λ 0.78: 17 · 17 · 17 · 18 · 18 · 19 · 19 · 20 · 21 · 22 · 23 · 24).
3. **The Focus muscle's exercise goes first** in its session, small muscles included (COACH-ANSWER ORD-04).
4. **Delivery order for the extra sets:** its own exercises (VOL-07 order) → the optional day's Focus 1 / Focus 2 slots (both may hit the same muscle, 2-3 sets each; COACH-ANSWER ORD-10, ORD-11) → a bonus exercise on a day that already trains it (§3.9).
5. **The other lines are not slowed.** Focus muscles are a small bias inside a balanced plan, and every trained line still reaches its own ceiling in the last week (COACH-R3 VOL-04). (INFERRED resolution; see 6.)
6. **The coach-only priority push (optional, off by default):** VOL-02's specialization stays available to a coach: one or two muscles start +4 (L1-L2) / +6 (L3) with the priority caps 18 / 26-28 / 30, and while it runs **the other muscles grow at most 3 % a week** (COACH-ANSWER VOL-02; COACH-R2 VOL-06, RIGHT). The **Pro setting** (L3, coach-set) lets one such muscle pass 30, up to 35, with a warning (COACH-R2 VOL-06 "maybe we can add a pro level"; numbers PROPOSED). The push is a build-time setting: nothing is tracked.
7. **Per-session ceiling:** 14 fractional sets for a Focus or priority muscle (soft ceiling 11 for the rest). (PROPOSED; SCIENCE Remmert ~11)
8. **Bias (COACH-ANSWER VOL-18):** a V-taper is expressed as Focus 1 = shoulders (the extra sets go to side raises first) and Focus 2 = back, chest held at its start (PROPOSED mechanism).

### 3.6 Pain and injury (intake rules + the printed self-adjust guide)

The plan cannot react to pain during the block - nothing is logged (COACH-R3 VOL-02, GEN-01). Pain declared at intake shapes the plan; during the block the plan prints what the user (or coach) should do, and they do it themselves ("the program will tell you to adjust accordingly ... you need to adjust it as you need to", COACH-R3 VOL-04).

| Trigger | What happens | Tag |
|---|---|---|
| Pain area declared at intake | The affected group / pattern starts at 50-70 % of its start (-30 to -50 %; the floor of 10 does not apply); its exercises move to constraint 4-5 machines or split grips; positions that hurt are excluded; that line's ceiling = its start + 1 set (a gentle climb, never flat). | COACH-ANSWER VOL-03, EQ-03; climb PROPOSED |
| Printed guide: "an exercise hurts" | 1) swap to the listed alternative in the same category (more constrained, split grip or unilateral) and keep the sets if you can; 2) if it still hurts, cut that exercise's sets by a third to a half; 3) if it still hurts, drop it for the rest of the block. | COACH-ANSWER UNI-08, VOL-03 ("maybe even drop the exercise altogether"); wording PROPOSED |
| Printed guide: "you feel the wrong muscle" / "you can't do it" | change one small variable (grip, stance, range) in the same category / use the easier listed version or an assisted one; the sets stay. | COACH-ANSWER GEN-05, PER-02 |
| Printed guide: "several things hurt in one week" | stop the block and switch to the recommended easy week or a maintenance phase; build a new block when ready. The app never inserts a deload by itself. | COACH-R2 VOL-07; COACH-R3 PER-01 |
| Pain shifts the bilateral:unilateral share (intake) | Low-back pain under axial bilateral loads → 20 points toward unilateral/belt squat/machines; knee or hip pain in single-leg positions → 20 points toward bilateral machines. | COACH-ANSWER UNI-02, EQ-11; 20 points PROPOSED |
| Rotation bias | Keep external- and internal-rotation positions in every week; the listed swap for a painful exercise uses the other bias (not by sport). | COACH-R2 LIB-03 |

**Retired in v1.2:** the logged triggers ('Felt a PAIN' once / twice / three times, pain on 2+ exercises → block-at-risk prompt) and "that muscle's step = 0 until 2 pain-free weeks" - they needed the check-in (COACH-R3 VOL-02).

### 3.7 The stairway (approved): planned weekly steps, computed once

> **Changed in v1.3** (COACH-CX CX-01, CX-02, CX-03; COACH-R4 R4-PRG-01, R4-PRG-02). The 3 % / 5 % pattern stays; every trained group now reaches its planned final sets, with faster steps when needed, no hard limit and a note above about 15 % (section V3). Where the text below differs, the v1.3 section at the top of this file wins.

**The coach's rule.** Every plan climbs "like steps up a stairway ... In the beginning, the first 2, 3, 4 weeks, the steps are a little bit smaller, but they're gradually going up. When they get to that halfway point and upwards, the steps get a little bit higher, but not too much ... that goes for every plan" (COACH-R2 PER-03); on 12 weeks "the last 4 weeks are going to be brutal" (PER-04). Round 3 approved the numbers below as his rule - "Yeah, but remember that we can just kick out the program designed already without the input of somebody saying how they feel ... The program will just have its natural algorithm recommendation of growth throughout it" (COACH-R3 VOL-04, RIGHT). The step is a % of each line's weekly sets (COACH-ANSWER VOL-04), one rule for every person (never by muscle size, VOL-05).

#### 3.7.1 The planned stairway (the math)

> **Changed in v1.3** (COACH-CX CX-01; COACH-R4 R4-PRG-01). The v1.2 formula below caps λ at 1 and lets a line stop under its ceiling; in v1.3 λ is free and the final sets are reached. The v1.2 tables below differ from the v1.3 table of section V3. Where the text below differs, the v1.3 section at the top of this file wins.

For a training block of **N** weeks and a line m with start S (the larger of its table start and its week-1 sets, §3.3) and ceiling C:

```
halfway week          h = ceil(N / 2)
standard step into w  s_w = 3 %  if 2 <= w <= h        (early: "a little bit smaller")
                      s_w = 5 %  if h <  w <= N        (late: "a little bit higher, but not too much"; ratio 5/3)
planned growth        G(N) = Π_{w=2..N} (1 + s_w)
planned peak          P = min(C, S × G(N))
scale factor          λ = 1                           if S × G(N) <= C
                      λ in (0, 1) solving  S × Π (1 + λ·s_w) = C   otherwise   (peak lands on the ceiling in week N)
planned target        T(1) = S;  T(w) = T(w-1) × (1 + λ·s_w)
bank                  bank(w) = T(w) - current weekly sets;  add one whole set each time bank >= 1   (VOL-06)
limits                planned step <= 7 %;  total weekly resistance sets below +10 % (one whole set may always be added) (UNI-05);
                      coach priority push only: other lines <= 3 % (R2-VOL-06)
time and exercise     if the days or the exercise maxima cannot hold P, the line's ceiling becomes what they hold
limits                (never below S + 1, §3.10.1 step 4) and λ is re-solved so the line still lands on it in week N
```

Tags: shape COACH-R2 PER-03, PER-04; 3 % / 5 % and the λ peak-anchoring **COACH-R3 VOL-04 (approved: "each muscle's steps are sized so it reaches its ceiling exactly in the last week")**; limits COACH-R2 VOL-01, VOL-06, COACH-ANSWER UNI-05; the one-set allowance and the time-limited ceiling PROPOSED (they keep a small plan, or a full day, climbing: COACH-R3 SES-02 step 4).

**Step sizes by plan length and week (standard steps, λ = 1).**

| Plan length N | halfway week h | step into week 2..h | step into week h+1..N | planned growth G(N) at standard steps | display level by week (2 -> 11) |
|---|---|---|---|---|---|
| 4 | 2 | 3 % | 5 % | ×1.136 (+13.6 %) | 2 · 4.1 · 7.5 · 11 |
| 6 | 3 | 3 % | 5 % | ×1.228 (+22.8 %) | 2 · 3.3 · 4.6 · 6.7 · 8.9 · 11 |
| 8 | 4 | 3 % | 5 % | ×1.328 (+32.8 %) | 2 · 2.9 · 3.9 · 4.8 · 6.3 · 7.9 · 9.4 · 11 |
| 10 | 5 | 3 % | 5 % | ×1.437 (+43.7 %) | 2 · 2.7 · 3.5 · 4.2 · 4.9 · 6.1 · 7.4 · 8.6 · 9.8 · 11 |
| 12 | 6 | 3 % | 5 % | ×1.554 (+55.4 %) | 2 · 2.6 · 3.2 · 3.8 · 4.4 · 5 · 6 · 7 · 8 · 9 · 10 · 11 |
| 16 | 8 | 3 % | 5 % | ×1.817 (+81.7 %) | 2 · 2.4 · 2.9 · 3.3 · 3.8 · 4.2 · 4.7 · 5.1 · 5.8 · 6.6 · 7.3 · 8 · 8.8 · 9.5 · 10.3 · 11 |

**Planned weekly sets by level (computed; whole sets).** The early steps add a set every 3-4 weeks, the late steps one almost every week, and the last weeks are the highest. A line whose ceiling would come early gets λ < 1 (all steps shrink together) so it still peaks in the final week. Ceilings are per 12-week plan (COACH-R2 VOL-06), so an 8-week plan at standard steps peaks below them. Focus muscles carry +2 on start and ceiling (§3.5).

| Plan | Line (start -> cap) | λ | early step | late step | planned weekly sets, week 1 -> N (whole sets) |
|---|---|---|---|---|---|
| 8wk | L1 big / shoulders / arms 10 -> cap 14 | 1.00 | 3.00 % | 5.00 % | 10 · 10 · 10 · 10 · 11 · 12 · 12 · 13 |
| 8wk | L2 big 15 -> cap 22 | 1.00 | 3.00 % | 5.00 % | 15 · 15 · 15 · 16 · 17 · 18 · 18 · 19 |
| 8wk | L3 big 20 -> cap 25 | 0.78 | 2.35 % | 3.91 % | 20 · 20 · 20 · 21 · 22 · 23 · 24 · 25 |
| 8wk | L2 shoulders / arms 12 -> cap 22 | 1.00 | 3.00 % | 5.00 % | 12 · 12 · 12 · 13 · 13 · 14 · 15 · 15 |
| 8wk | L3 shoulders / arms 15 -> cap 25 | 1.00 | 3.00 % | 5.00 % | 15 · 15 · 15 · 16 · 17 · 18 · 18 · 19 |
| 8wk | L1 Focus muscle (+2) 12 -> cap 16 | 1.00 | 3.00 % | 5.00 % | 12 · 12 · 12 · 13 · 13 · 14 · 15 · 15 |
| 8wk | L2 Focus muscle (+2) 17 -> cap 24 | 1.00 | 3.00 % | 5.00 % | 17 · 17 · 18 · 18 · 19 · 20 · 21 · 22 |
| 8wk | L3 Focus muscle (+2) 22 -> cap 27 | 0.72 | 2.15 % | 3.59 % | 22 · 22 · 22 · 23 · 24 · 25 · 26 · 27 |
| 12wk | L1 big / shoulders / arms 10 -> cap 14 | 0.76 | 2.28 % | 3.80 % | 10 · 10 · 10 · 10 · 10 · 11 · 11 · 12 · 12 · 12 · 13 · 14 |
| 12wk | L2 big 15 -> cap 22 | 0.87 | 2.60 % | 4.33 % | 15 · 15 · 15 · 16 · 16 · 17 · 17 · 18 · 19 · 20 · 21 · 22 |
| 12wk | L3 big 20 -> cap 25 | 0.50 | 1.50 % | 2.51 % | 20 · 20 · 20 · 20 · 21 · 21 · 22 · 22 · 23 · 23 · 24 · 25 |
| 12wk | L2 shoulders / arms 12 -> cap 22 | 1.00 | 3.00 % | 5.00 % | 12 · 12 · 12 · 13 · 13 · 13 · 14 · 15 · 16 · 16 · 17 · 18 |
| 12wk | L3 shoulders / arms 15 -> cap 25 | 1.00 | 3.00 % | 5.00 % | 15 · 15 · 15 · 16 · 16 · 17 · 18 · 19 · 20 · 21 · 22 · 23 |
| 12wk | L1 Focus muscle (+2) 12 -> cap 16 | 0.65 | 1.94 % | 3.24 % | 12 · 12 · 12 · 12 · 12 · 13 · 13 · 14 · 14 · 15 · 15 · 16 |
| 12wk | L2 Focus muscle (+2) 17 -> cap 24 | 0.78 | 2.34 % | 3.90 % | 17 · 17 · 17 · 18 · 18 · 19 · 19 · 20 · 21 · 22 · 23 · 24 |
| 12wk | L3 Focus muscle (+2) 22 -> cap 27 | 0.46 | 1.38 % | 2.30 % | 22 · 22 · 22 · 22 · 23 · 23 · 24 · 24 · 25 · 25 · 26 · 27 |

Reading the table: a 12-week L2 big line goes 15 → 22 with its last four weeks at 19, 20, 21, 22 - the coach's approved example ("the last four weeks 19, 20, 21, 22", R3-VOL-04); an L3 big line needs only +25 % (20 → 25), so its steps are half-size (λ 0.50: 1.5 % / 2.5 %, about RP's "2-3 sets per muscle over a whole block" for advanced lifters); an L2 Focus muscle runs 17 → 24, two sets above the balanced line every week.

**When the standard steps cannot reach the ceiling: SETTLED in v1.3 - the final sets are reached with faster steps (COACH-CX CX-01; COACH-R4 R4-PRG-01). The v1.2 reading, kept as history:** λ is never above 1, so a line whose ceiling is more than × G(N) above its start peaks **below** its ceiling, still in the last week: in a 12-week plan the L2 shoulders / arms line runs 12 → 18 (ceiling 22) and the L3 one 15 → 23 (ceiling 25); every 8-week line peaks below the 12-week ceilings. The approved proposal says both "about 3 % ... about 5 %" and "each muscle's steps are sized so it reaches its ceiling exactly in the last week" (R3-VOL-04); when the two cannot both hold, this engine keeps the step sizes and treats the ceiling as a maximum (the planned peak P = min(C, S × G(N)) always lands in the last week). The alternative - λ up to 1.4, i.e. late steps up to his 7 % limit (R2-VOL-01), which takes 12 → 22 - is the coach's call.

#### 3.7.2 "Start at a 2, end at an 11": the effort drift (approved)

The 2 → 11 is "how it feels and what level you're starting at", the overall load, not the set count (COACH-R2 PER-05). Each week shows a **level** that follows the same step weights as the sets: `level(w) = 2 + 9 × A(w) / A(N)`, where A(w) adds 1 for each early step and 5/3 for each late step (display PROPOSED). The planned effort drifts **inside his 1-3 RIR band** as the level climbs - approved: "To make week 1 feel like a 2 and the last week like an 11, effort goes from 3 reps in the tank early, to 2, to 1-2, to 1 + intensifiers in the last week, always inside your 1-3" (COACH-R3 VOL-04, RIGHT):

| Week (12-week plan) | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| display level | 2 | 2.6 | 3.2 | 3.8 | 4.4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 |
| planned effort (inside 1-3 RIR) | 3 RIR | 3 RIR | 3 RIR | 3 RIR | 3 RIR | 3 RIR | 2 RIR | 2 RIR | 2 RIR | 1-2 RIR | 1-2 RIR | 1 RIR + intensifiers |

In the last week MYO sets on the last machine or isolation exercise (VOL-15) and supersets (ORD-05) are allowed: that is the "a little bit past your limits". For lifters already at their ceilings (many L3s), the 11 comes from heavier loads and intensifiers (COACH-R2 PER-05). The v1.1 flag against VOL-13 ("no planned RIR ramp") is closed by R3-VOL-04: the drift never leaves 1-3 RIR.

#### 3.7.3 The weekly check-in: RETIRED

**Retired by COACH-R3 VOL-02 and VOL-04** ("we're not going to have check-ins ... I want to take away all check-in info. We're only doing outputs, and people can change accordingly"; "I don't want people to be checking back on their phone in their program"). Gone: the step table read from effort, completion and pain (R2-VOL-01), "too easy = planned step + 2 points", "effort 9 = hold", "a 10 = hold and remove 1 set from that day", the optional 'Failed' answer, "under half the sessions = repeat the week", the life-column resolution and the effort reading of R2-VOL-02 as an input. The plan follows its planned stairway from week 1 to the last week; nothing adapts and nothing is stored (COACH-R3 GEN-01).

**What replaces it: the printed self-adjust guide (wording PROPOSED, EN / ES).** The plan tells the reader how to adjust it themselves ("the program will tell you to adjust accordingly", R3-VOL-04):
- Missed most of a week? Repeat that week before moving on.
- A set felt like a true max (no rep left)? Next time take one set off that exercise, or a little weight.
- Everything feels easy? Add weight or reps first; never jump ahead more than one week.
- Something hurts? Use the listed swap, then cut the sets, then drop the exercise (§3.6).
- Life got in the way for several weeks? Stop the block, take the recommended easy week, build a new block (§3.12).

#### 3.7.4 Ceilings - RETIRED in v1.3

> **RETIRED in v1.3** (COACH-CX CX-01; COACH-R4 R4-PRG-02). There is no maximum step and no maximum weekly rise; a week that adds more than about 15 % carries a note (section V3). The text below is kept as history only.

- **Planned step ≤ 7 %**; standard steps 3-5 %; λ ≤ 1. (COACH-R2 VOL-01: "Never more than 7 % a week")
- **Total weekly resistance sets below +10 %** week over week ("it can progress week by week by 10 %. That's way too much", COACH-ANSWER UNI-05). One whole set may always be added in a week, so a plan under 10 resistance sets can still climb (PROPOSED). Exempt (PROPOSED): the first week after an easy week or a maintenance phase, and block-boundary swaps that add no sets.
- **Hand-set step** by the coach at build time: 0-7 %; 10 % is never offered as a step. (COACH-ANSWER VOL-05, UNI-05, GEN-08)
- **Retired:** the older-adult ≤ 3 % cap (v1.1 PROPOSED; COACH-R3 VOL-04 wants every trained group at its ceiling in the last week).

#### 3.7.5 Retired by rounds 2 and 3

Round 2: the readiness score `R = 0.40·E + 0.20·C + 0.20·P + 0.20·L` and its bands; the planned rate before logs (5 % default, 3 % for high stress, under 6 h sleep, a physical job, 60+, layoff or pain) and the 3-tap intake question; "7 % only once logs earn it"; target-seeking; the 12-week acclimation cap and the 8-week weeks-1-4 cap with its × 1.10 start; the "hold 2 weeks in a row → deload next week" gate. Round 3: the check-in step table and everything read from it (3.7.3); the block-at-risk prompt; the older-adult ≤ 3 % step cap.

### 3.8 Banking and rounding

> **Changed in v1.3** (COACH-R4 R4-PRG-01). Whole sets are the curve rounded half up and held one set under the final sets until the arrival week (the last week; one week early at most). Where the text below differs, the v1.3 section at the top of this file wins.

```
T[m] = S[m]  (the larger of the table start and the week-1 sets)       # week 1
every week w:  T[m] = min(C[m], T[m] × (1 + λ[m]·s_w))                  # the planned step, §3.7.1 (computed once)
while T[m] - current[m] >= 1 and current[m] + 1 <= C[m]:
    place one set (§3.9)
if current[m] >= C[m]: progress load / reps / intensifiers instead
```
(COACH-ANSWER VOL-06: bank the fraction, add a whole set at 1; "round up, round down, that's fine".) The bank is the planned target minus the current sets, the same as banking the weekly fraction, but anchored on the stairway so the whole sets land on its shape and the peak lands in the final week. The whole calculation runs once, when the plan is built (COACH-R3 VOL-04); v1.1's "a hold leaves T unchanged; a repeated week does not advance the stairway" is retired with the check-in.

Helper credit gained when another line's set is placed counts toward T and does not need a direct set. A line can exceed its ceiling by up to ~1 set through helper spill-over; the engine reports it and never adds direct sets above the ceiling. (PROPOSED)

### 3.9 Where a new set goes (COACH-R3 VOL-03, approved)

> **Changed in v1.3** (COACH-R4 R4-SES-04, R4-SES-05). The VOL-07 order and the day alternation stand. The sets are split over the slots of his template; each slot keeps its laterality; the per-session set ceilings (11 / 14) and "session minutes ≤ the chosen length" are no longer rules; with no room and no optional day the group is capped and the plan says so (section V4). Where the text below differs, the v1.3 section at the top of this file wins.

1. **Day:** alternate through the days that train the line as a main mover. When a day type repeats twice a week, "the back set goes to Monday's first back exercise this time and Thursday's first back exercise the next time, so both days stay even" (COACH-R3 VOL-03, RIGHT; the order inside a day is COACH-ANSWER VOL-07).
2. **Laterality group first** (big lower and upper lines): if the current bilateral share is more than 3 points below target, the set goes to a bilateral exercise; more than 3 above, to a unilateral one; otherwise no preference. (PROPOSED, joins COACH-ANSWER UNI-02 with VOL-07)
3. **Inside the day, the coach's order:** add to the first exercise (in session order) whose sets are below the first exercise's; if all are equal, add to the first. This produces exactly 2/2/2 → 3/2/2 → 3/3/2 → 3/3/3 → 4/3/3. (COACH-ANSWER VOL-07)
4. **Limits:** sets per exercise ≤ 4 (L1) or 5 (L2-L3), isolation ≤ 4; the line's per-session fractional sets ≤ 11 (Focus 14); session minutes ≤ the chosen length (or the length the user accepted, §3.10.1). (COACH-ANSWER VOL-16 defaults; limits PROPOSED; SCIENCE ~11 per session)
5. **No room on the day:**
   - first, superset the lower/upper pairs on that day if that frees the time (COACH-ANSWER ORD-05; recommended, §3.10.3);
   - **small line → a short bonus exercise** (2 sets, same category) "on the optional day (e.g. Saturday); with no optional day, on a day that already trains biceps, never as the only biceps exercise of that day" (COACH-R3 VOL-03, RIGHT): optional day first, else the training day that already trains that muscle with the fewest exercises, as its 2nd-4th exercise (2-4 rule, R2-SES-05);
   - **calves never get a second calf exercise on a leg day** (one exercise × 3 sets per leg day, COACH-R3 SES-01): extra calf sets go to the existing calf exercise (max 4), then to the optional-day 'Calves' slot;
   - **big line → a Focus slot** (2 sets) on the optional day, otherwise on a day that already trains that region (COACH-ANSWER ORD-11; big-line use PROPOSED);
   - still no room → that line's ceiling becomes what the week holds and its stairway lands there (§3.7.1); load, reps and intensifiers carry the rest (MYO on the last machine/isolation, supersets) (COACH-ANSWER VOL-15, ORD-05).
6. **Hard rules:** core opener first (light, 2 exercises × 2 sets short of failure; movable; can be switched off for a day by the user, §3.10.2; core supersets or monster sets may be added anywhere); hip dominant + push, knee dominant + pull; **heavy squat and heavy deadlift on two different days**, non-axial hinge, leg press or belt squat on the other days; row before pulldown; power before strength; no bands or variable resistance. **Axial lifts (count):** barbell back, front, zercher, overhead and Smith squats; barbell or trap-bar deadlifts and RDLs; good mornings. **Not axial:** leg press, belt squat, hip thrust, back extension, reverse hyper, single-leg DB work, Olympic lifts, loaded jumps. Goblet squat, hack squat and pendulum: fine on the second day if not sore. Powerlifters may add a light technique squat or deadlift. (COACH-ANSWER ATH-11, ORD-06, UNI-11, ORD-01, ORD-03, EQ-01, EQ-12; COACH-R2 SES-01, SES-02, SES-03; COACH-R3 SES-02)
7. Exercises stay fixed inside a 4-6-week **exercise block**; only sets, reps, load and RIR change. Between exercise blocks change one or two small variables (grip, stance, implement, range of motion, rep range) or a one-detail library variation shown as "Reverse lunge - dumbbell in opposite hand"; the tool never invents an exercise (COACH-R2 LIB-01); a stance change may swap laterality (examples 5.2, 11-A). The stairway does **not** restart at an exercise-block boundary: it runs through the whole plan (INFERRED from R2-PER-04 and R2-VOL-07). A/B lead-lift weeks only for clients who want variety. (COACH-ANSWER PER-02, PER-03; SCIENCE Kassiano 2022)

### 3.10 Session limits, groups and the time model

> **Changed in v1.3** (COACH-CT CT-01; COACH-R4 R4-SES-01, R4-SES-02, R4-SES-05). Sessions are sized by exercise count by client type; a full-body day is his A or B day; the time model is the arithmetic of a printed estimate and nothing more (section V2). The exercise counts by minutes and the session lengths below are not limits. Where the text below differs, the v1.3 section at the top of this file wins.

| Limit | Value | Tag |
|---|---|---|
| Resistance exercises per session | by length: **45 min ≈ 5, 60 min ≈ 6-7, 75-90 min ≈ 8-9** ("usually 7") | COACH-ANSWER VOL-08 (RIGHT), VOL-16 |
| **Exercises per group on every day it is trained** | **2-4, never 1** (split and full-body days alike; full-body days "might be a little longer") | COACH-R2 SES-05 (PARTLY); COACH-R3 SES-01 |
| Groups for that rule (approved) | the coach's FOCUS groups: quads; **hips = glutes + hamstrings** (RDL + hip thrust + leg curl = 3 hip exercises); chest; back; **shoulders = front + side + rear delts** (+ traps); biceps; triceps; **calves = one exercise × 3 sets per leg day**; core = the 2-exercise opener; a group the time policy leaves to compound credit, or a field athlete's credit-only line, is not "trained that day" | COACH-R3 SES-01 (RIGHT) |
| Field athlete, off-season | up to **12 exercises + the 2-exercise core block (14 listed)**; 2-4 exercises for each group trained that day; **cross pattern** (default for most athletes): the resistance groups take 9 of the 12, leaving **2 jump / throw stations + 1 Olympic lift**; **same-pattern athletic template** (size-focused and high-level athletes): fewer resistance exercises, **3-4 jump stations + 1 Olympic lift**; warm-up drills never count; a superset of two small isolations counts as one | COACH-ANSWER VOL-08, VOL-17; COACH-R2 SES-04; COACH-R3 SES-01 (RIGHT) |
| Default sets | 3 compounds, 2 isolation, 3 calves; **athletic-template slots 2**; minimum 2 per exercise | COACH-ANSWER VOL-16, VOL-17; minimum PROPOSED |
| Session length | athletes/bodybuilders/powerlifters ~90 min (max 120); general/weight loss 45-60 (full-body days with 2-4 exercises per group: 55-85); bootcamp 35-45; the time policy (3.10.1) decides what a chosen length can hold | COACH-ANSWER UNI-09, PRG-03; COACH-R2 SES-05; COACH-R3 SES-02 |
| Per line per session | soft 11 fractional sets, Focus / priority 14 | SCIENCE Remmert; RP 8-12; values PROPOSED |
| Rest | hypertrophy 1-2 min (up to 3), strength 3-6 min, athletic as prescribed | COACH-ANSWER VOL-14 |
| Core | 2 exercises × 2 sets, short of failure, as the warm-up; optional core supersets or monster sets anywhere; **the user can switch the core block off for a day** | COACH-R2 SES-03; COACH-R3 SES-02 |
| Aerobic sessions/week (**adjustable up or down by the user**) | general/fat loss 3; aesthetics/bodybuilders 4 (Orange, Green, Blue + a second Orange) + optional 20-30-min easy walks; athletes in season 2; off-season by sport: baseball, softball, sprinters 2 · basketball, volleyball, football, tennis, golf, boxing, BJJ 3 · soccer, hockey, kickboxing, karate 3-4 · MMA, wrestling 4 · the remaining sports 2-4 like this list, **0 extra for swimmers, runners, rowers and endurance cyclists** (their practice is the cardio); pre-season 2; powerlifters 2 easy (Orange); HYROX 4 (Blue, Green, Orange + a second Orange); stay-active users: a 45-60+ min session of their activity counts as one of the 3 (up to 2) | COACH-ANSWER ATH-07; COACH-R2 SES-06, ATH-06; COACH-R3 ATH-01, ATH-03, ATH-04, ATH-05 |

**Time model** (PROPOSED; minutes per working set including rest): warm-up 8 (COACH-ANSWER ORD-08: 5 min cardio + drills); core opener 2 × 2 sets × 1.5; bilateral compound 2.5; unilateral compound 3.75 (1.5 ×); isolation 1.75 (unilateral 2.5); plyo/ballistic 1.5; Olympic 3.0; throw 1.25; supersetted pair × 0.65; + 1.0 min changeover per exercise (0.5 inside a superset pair). Check against his own BYOP day 1 (7 exercises, 19 sets, OBSERVED): 8 + 7 + 19 × ~2.3 ≈ 59 min, i.e. his 60-minute session. Capacity, mixed hypertrophy work with the core opener: **45 min ≈ 5 exercises / 11 sets, 60 ≈ 7 / 17, 75 ≈ 8 / 23, 90 ≈ 9-10 / 29**; supersets add ~25-35 %. (`05_session_architecture` §7.4 keeps its own per-station model for the template checks; where they differ, sets come from here.)

#### 3.10.1 Time vs minimums: the exact algorithm (COACH-R3 SES-02) - RETIRED in v1.3

> **RETIRED in v1.3** (COACH-CT CT-01; COACH-R4 R4-SES-01, R4-SES-03, R4-SES-04). No time check runs. The 2-day rule and "nothing dropped automatically" replace its steps 1, 2 and 4; supersets stay a recommendation (section V2, V5). The text below is kept as history only.

**The coach's order (approved):** "(1) tell them up front and offer a 3rd day or longer sessions; (2) if they keep their time, train fewer muscles directly (big movers first; arms, calves and rear delts only from compound credit) instead of dropping below the floor on everything; (3) use supersets to save time; (4) the stairway climbs on the muscles that are trained, never flat. Never squeeze 2-4 exercises per muscle into a day that can't hold them" - "Yeah, this is fine. Recommend doing supersets so that it's a faster workout, but they should be able to get things done." (COACH-R3 SES-02, RIGHT)

**Definitions.**
- *Minimums of a directly trained group:* (a) 10 sets a week in week 1 (the floor, read on the group with group credit; calves: 3 sets per leg day); (b) 2-4 exercises on every day it is trained (calves: 1); (c) a climbing stairway: the last week at least 2 whole sets above week 1 (calves at least 1: 3 → 4 sets on a leg day) (COACH-ANSWER VOL-17; COACH-R2 SES-05, VOL-06; COACH-R3 SES-01, SES-02; the 2-set climb PROPOSED).
- *A day holds the plan* when its week-1 minutes with every eligible pair supersetted are at most the chosen length × 1.10 (the coach's "a little longer day", R2-SES-05; 10 % PROPOSED), and the stairway's added sets fit the chosen length with supersets recommended on that day.
- *Level plan:* every line at its level start and ceiling (§3.3-3.5). *Peak-week need:* the longest day's minutes in the last week of the level plan built with no time limit, all eligible pairs supersetted.

**Algorithm** (runs once, when the plan is built; all PROPOSED inside the approved order):

```
0. build the level plan inside the chosen days x minutes (supersets on wherever a day needs them)
   if every trained group meets its minimums AND every line reaches its planned peak:  -> output, no warning
1. TELL UP FRONT + OFFER (R3-SES-02 step 1), always shown before the plan:
     offer A  "another training day": the next template up (05 §8) - its days checked the same way
     offer B  "longer sessions": ceil5(peak-week need) minutes
     offer C  (when it helps) "switch off the core block / the athletic block on these days saves N min" (3.10.2)
   if the user takes an offer: rebuild from 0 with it
   if every trained group meets its minimums but some lines peak lower than planned:
     -> output with the time-limited ceilings (step 4) and the note "your time holds a lower peak for X"
2. KEEP THE TIME -> TRAIN FEWER GROUPS DIRECTLY (R3-SES-02 step 2)
     try every group at its minimum plan (group-level lines: hips and shoulders as one line, start at the floor);
     if that fails, build the kept set in priority order and keep a group only if every kept group still meets
     its minimums:
        1st  Focus-muscle groups and groups the sport profile pins (e.g. calves/Achilles for pickleball,
             padel and tennis players 50+, R3-ATH-02)
        2nd  big movers: hips, quads, back, chest
        3rd  shoulders (isolation), calves, triceps, biceps          (the coach's "arms, calves, rear delts")
     a group left out keeps its compound credit (rows -> biceps and rear delts, presses -> triceps and front delts,
     squats / hinges -> glutes) and is listed on the plan as "not trained directly (time)" with that credit;
     its exercises leave the week, and the remaining groups keep 2-4 exercises on their days (never squeezed)
3. SUPERSETS (R3-SES-02 step 3): every UNI-11 lower/upper pair and every small-isolation pair is marked
     "recommended superset" with the minutes it saves; when the fit depends on them the plan says
     "do these as supersets to finish on time"
4. STAIRWAY ON THE TRAINED GROUPS (R3-SES-02 step 4): each trained line climbs from its week-1 sets to the ceiling
     the time holds (two passes: run, then re-solve lambda so the line lands on what it reached), never below
     week 1 + the minimum climb, never flat
```

**Step-2 ceiling (found in the v1.2 verification; PROPOSED, flagged in §7 item 4).** In the keep-time plan the prototype (`tvm.py`) gives a group whose 2-exercise minimum puts it above its floor in week 1 a ceiling of *its week-1 sets + the level's climb* (ceiling − start), before step 4 lowers it to what the time holds. That ceiling can pass the level ceiling of R2-VOL-06: in 5.1 shoulders 12 + 4 = 16 and biceps 11 + 4 = 15 against the L1 ceiling 14 (time-lowered to 15 and 14). The full-plan rule (§3.7.1) keeps the level ceiling. Re-run in this check with the step-2 ceiling clamped to the level ceiling (never below week 1 + 2): example 5.5 is unchanged; in 5.1 the 4 × 60 client keeps hips, quads, back, chest and shoulders (quads and back then reach 14) and **biceps join triceps and calves on compound credit**. The engine should clamp (PROPOSED); the 5.1 branch below is the unclamped prototype run.

**What it does on the coach's two examples** (computed, §5.1 and §5.5; time model above):

| Client | Chosen | Step 0-1 result | Offer | If they keep their time (step 2) |
|---|---|---|---|---|
| L1 aesthetics, 4 full-body days (example 5.1) | 4 × 60 | shortfall: the week-1 days are already 56-61 min and quads would climb only 10 → 11 | about **85 min** sessions (the full plan's peak week needs 84.6 min on Friday with supersets); a 5th day (arms moved to Saturday) still does not hold every group at 60 | quads, hips, back, chest, shoulders and biceps trained directly (each line climbs to 13-14.25 by week 12); **triceps and calves** from compound credit (triceps 4.25 sets of credit, calves none); days 52-60 min in the last week |
| Pickleball player 55 y, L2, stay-active (example 5.5) | 2 × 45 | shortfall: the base week is already 58-62 min | about **105 min** sessions (a full plan for every group on 2 days needs 92-100 min a day); a 3rd 45-min day still fails | **hips (glutes + hamstrings) 10 → 14 and the pinned calves 6 → 7** trained directly; everything else not trained directly; with 2 × 60: + quads; with 2 × 75: + quads and back. The plan says this up front. |

A CrossFit-class member with 4 × 60 (the coach's other example) is computed on the 05 class template in `05_session_architecture` §8.7.1 (time-vs-minimums table).

#### 3.10.2 User editing: block toggles, add / remove (COACH-R3 SES-02)

> **Changed in v1.3** (COACH-CX CX-02, CX-04; COACH-R4 R4-SES-04). Everything is editable, the sets of any day or week included. An edit recomputes the weekly totals and marks the plan edited; it does not rebuild the plan and nothing is moved or dropped automatically. Each day names the easiest things to remove. Where the text below differs, the v1.3 section at the top of this file wins.

"They should be able to turn off that day's athletic training or that day's core training and just focus on resistance ... or they can delete certain exercises, because an athlete or a coach should be able to modify accordingly. The options should be: Recommend supersets; Adding or removing exercises or blocks within the training session." (COACH-R3 SES-02)

| Feature | Rule | Tag |
|---|---|---|
| Blocks with stable ids | every day lists its blocks with ids that do not change between weeks of a block: `warmup`, `core`, `skill`, `athletic` (plyo / ballistic / throws / COD / sprints), `olympic`, `resistance`, `focus` (optional-day Focus slots), `conditioning` (buy-outs, WODs, station circuits) | COACH-R3 SES-02; ids PROPOSED (shared with 05 and the engine contract) |
| On / off per day | `core`, `athletic`, `olympic`, `skill`, `focus` and `conditioning` carry `toggle: true` (on by default; the user or coach may switch them off for that day, e.g. a pickleball player with sore calves switches off Thursday's jumps); `warmup` and `resistance` cannot be switched off as a block (exercises inside `resistance` can be removed) | COACH-R3 SES-02 |
| What a toggle changes | athletic, Olympic, core and conditioning work never count as muscle sets (VOL-10), so switching them off changes no stairway and no weekly set number (the core opener's abs credit drops for that day); the session gets shorter by that block's minutes | COACH-ANSWER VOL-10; COACH-R3 SES-02 |
| Remove an exercise | the plan is rebuilt with that exercise excluded: its sets move to the group's remaining exercises on that day (VOL-07 order) when it still has 2+ exercises; if the removal leaves the group with 1 exercise that day, the editor says so and offers "remove the group from this day" (its sets move to the group's other days, R3-VOL-03 placement) or "keep it anyway" - the user's choice wins | COACH-R3 SES-02; COACH-R2 SES-05; mechanism PROPOSED |
| Add an exercise or a block | an added exercise joins its group on that day (its sets count from week 1 and climb with the group's stairway); "add rear delts" adds a 2-set rear-delt exercise on a pull day (COACH-R3 VOL-01); an added block (e.g. a core finisher, an aerobic add-on) is placed by the ordering rules | COACH-R3 SES-02, VOL-01 |
| Nothing is stored | an edit is a rebuild of the same plan with the edits as constraints; no account, no log | COACH-R3 GEN-01, VOL-04 |
| Rendering | every day prints which blocks can be switched off ("You can switch off today's athletic block or core block"), the recommended supersets, and, when the time policy left groups to compound credit, the "not trained directly (time)" list and the offer | COACH-R3 SES-02 |

#### 3.10.3 Superset recommendation (COACH-R3 SES-02 step 3; COACH-ANSWER ORD-05)

> **Changed in v1.3** (COACH-CT CT-01). Supersets are a recommendation the person switches on; no session length switches them on and none is ever "needed". Pairs are only suggested between neighbouring exercises. Where the text below differs, the v1.3 section at the top of this file wins.

The plan recommends a superset for every eligible pair of every day: the UNI-11 lower/upper pairs (knee lift + pull, hip lift + push) and small-isolation pairs (biceps + rear delts, triceps + side delts, calves + delts); never two lower compounds, never a heavy lift with a fatiguing lift for the same muscle (contrast complexes excepted, ATH-12). Each recommendation carries the minutes it saves (pair × 0.65 + 0.5 min changeover in the time model). It is marked **needed** when the day only fits with it (3.10.1), **recommended** otherwise ("Recommend doing supersets so that it's a faster workout", R3-SES-02); the user can ignore it. ORD-05's other use cases (more stimulus for advanced lifters, VO2 / mitochondrial work for off-season athletes, beginners who do not fatigue) also switch it on.

### 3.11 Bilateral : unilateral share

Share = bilateral sets ÷ (bilateral + unilateral sets) in the lower-body knee- and hip-dominant compound slots. Leg flexion, leg extension and isolation are excluded (COACH-ANSWER CAT-09). The same logic runs for upper-body push/pull (alternating = unilateral) (COACH-ANSWER UNI-03, UNI-07). A coach slider can set anything from 90/10 to 10/90 (COACH-ANSWER UNI-02).

| Profile | Start of block / weeks 1-4 | Later blocks / off-season | Pre-season | In-season | Upper body | Tag |
|---|---|---|---|---|---|---|
| Bodybuilder, powerlifter (L2-L3) | **50/50** for weeks 1-3/4 | **80/20 → 90/10** by the peak; keep a unilateral accessory if something bugs them | - | - | 80-90 % bilateral (PROPOSED: he gave the upper body "the same" logic, no number; 11's I15) | COACH-ANSWER UNI-02, CAT-13 (lower) |
| Beginner aesthetics / general (L1) | 50/50 | 50/50 → 60/40 in later cycles | - | - | 70/30 | PROPOSED |
| Weekend-warrior athletic, "stay athletic and active", bootcamp | 50/50, cross-pattern pairing | 50/50 | - | - | 60/40 | COACH-ANSWER UNI-06; numbers PROPOSED |
| Field/court change-of-direction athletes (tennis, soccer, basketball, football skill) | 20/80 | 15/85 | 15/85 | **10/90** (bilateral minimal) | 20/80 | COACH-ANSWER UNI-02 (80-90 % unilateral), UNI-10 |
| Sprinters / acceleration | 40/60 | 40/60 | 30/70 | 20/80 | 40/60 | PROPOSED (force need + ipsilateral step-ups, CAT-13) |
| Strength-type athletes (linemen, wrestlers, rugby, throwers) | 60/40 | 60/40 | 40/60 | 25/75 | 60/40 | PROPOSED (ATH-03) |
| Baseball / softball | 50/50 (OBSERVED: 4 bilateral + 4 unilateral sets) | 50/50 | 35/65 | 20/80 | 30/70 (pitchers: less overhead) | OBSERVED; COACH-ANSWER ATH-08; rest PROPOSED |
| Combat (boxing, MMA, karate) | 40/60 | 40/60 | 30/70 | 20/80 | 30/70 rotational | PROPOSED |
| Older / injured | 60/40 on constrained machines with supported unilateral work | | | | 70/30 | COACH-ANSWER EQ-03; numbers PROPOSED |
| Pain | shift 20 points toward the pain-free side | | | | | COACH-ANSWER UNI-02; 20 points PROPOSED |

**Inside the unilateral share** (COACH-ANSWER CAT-13; percentages PROPOSED): change-of-direction athletes load ~70 % of unilateral sets **contralaterally** (into the hip); sprinters use **ipsilateral** step-ups for acceleration (~60 % of unilateral sets); bodybuilders and powerlifters use contra/ipsi mostly in weeks 1-4 as health accessories. Court and combat athletes also get more frontal/transverse unilateral work (lateral lunges, cossacks, lateral step-ups) (COACH-ANSWER UNI-12).

**Pairing** (COACH-ANSWER UNI-06): same-pattern (squat + lunge) for high-level and aesthetics clients who need more stimulus on one muscle; cross-pattern for bootcamp and general clients (less soreness, more frequent sessions).

### 3.12 Plan shapes, blocks, the recommended easy week and tests

| Mode | Shape | Tag |
|---|---|---|
| **12-week (preferred)** | One stairway, N = 12: 3 % steps to week 6, 5 % from week 7 (λ-scaled to land on the ceiling in week 12); the last 4 weeks are the hardest ("brutal"): the highest sets, 2 → 1 RIR, intensifiers allowed in week 12. No deload or maintenance week inside. | COACH-R2 PER-04, PER-05; COACH-R3 VOL-04 |
| **8-week** | One stairway, N = 8: 3 % to week 4, 5 % from week 5; starts at the normal start. | COACH-R2 PER-03 (NOT RIGHT to "start hard"); COACH-R3 VOL-04 |
| **4-6-week training block** | One stairway, N = 4-6 (table §3.7.1), when the user wants a short training block. | COACH-R2 PER-03 ("that goes for every plan") |
| **Maintenance phase** | Flat at **50-70 %** of the last block's final 4 weeks (new clients: of their level start): 50 % vacation or limited kit, 60 % travel, moving or a season change, 70 % planned maintenance; older adults ≥ 70 %; RIR 2-3, no intensifiers; not floored. The user picks its length. At its end the plan simply ends: the printed note says "build your next plan: keep maintaining, change the plan or start a training block" (the app does not prompt; nothing is stored). | COACH-ANSWER PER-01; COACH-R2 PER-06; COACH-R3 PER-01; splits PROPOSED |
| **Pre-season** | A 4-6-week block at about **60 % of off-season sets** with more speed and power, then a **1-2-week taper** before the first game. | COACH-R2 PER-06 (RIGHT) |
| ~~Week by week~~ | **Retired in v1.2**: it needed the weekly check-in (COACH-R3 VOL-02, VOL-04: the whole plan is shown ahead of time). Use a 12-week block and build the next one. | COACH-R3 VOL-02, VOL-04 |
| **Yearly (gen-pop "stay in shape")** | Jan-Mar: hard work + more cardio, start cutting (sets stay at the starting level). Apr-Jun: summer shape, keep losing fat while building a little muscle. Jul-Sep: maintain at about 70 % of the volume. Oct-mid-Dec: build muscle, less cardio. Last 2 weeks of December: maintenance (recommended). Uses the user's hemisphere and their own holiday weeks (Christmas, Semana Santa, Thanksgiving ...), **planned between blocks**. **Fully tunable**: re-order the blocks, more or less cardio, e.g. a deep-winter powerlifting-style block. Athletes follow their season instead. The year plan is generated once with all its blocks visible; each block is a stairway. | COACH-R2 PER-01, PER-02; COACH-R3 PER-01 |
| **Fight / competition prep** | 2-week steps and waves instead of smooth weekly adds; same average. | COACH-ANSWER PER-10; step size PROPOSED |
| **Event date (stay-active users)** | Optional (a first HYROX race, a pickleball tournament, a 10K): the hardest weeks end 1 week before, then 1 easy week at about half the sets. | COACH-R3 ATH-05 (RIGHT) |
| **Athlete seasons** | Off-season: most volume, stairway. Pre-season: as above. In-season: 2 days, flat, game-heavy reductions (§3.4). Post-season: recovery, general. Swimmers: a 2-week dryland taper lined up with the swim coach's taper before the main championship meet (1 week or none before smaller meets). | COACH-ANSWER PER-08; COACH-R2 ATH-07, PER-06; COACH-R3 ATH-01 |

**Blocks, the easy week and the next block (COACH-R2 VOL-07, COACH-R3 PER-01).**
- **No deload or maintenance week inside a block**, whatever its length: "It should never be thrown in the middle of a block ... they need to be able to manage their block and complete it." (R2-VOL-07)
- **After a block: a recommended easy week**, not a mandatory one: about **half of the hardest (last) week's sets**, same exercises, lighter load or 3+ RIR, no buy-out, finisher, MYO or supersets; plyos only low-amplitude landings at about half the contacts; Olympic lifts at half the sets with light technique loads; conditioning Orange only. "Maintenance weeks are a recommendation. They don't have to be mandatory, so people can go ahead and start one, or when the block ends, it just ends, and then you have to go back into the app and build whatever you want next." (COACH-R3 PER-01; the dose is COACH-R2 VOL-07 "half of the current (hardest) week" RIGHT; athletic details PROPOSED). In the year plan the easy week is an extra week between blocks (12 + 1 = a 13-week quarter), so each block keeps all its weeks (R3-PER-01 proposal, approved).
- **Holidays and vacations** the user marks are planned **between blocks**. A mark that falls inside a block ends that block there (then, if the user wants, the recommended easy week or a maintenance phase; then a new block the user builds) unless the user removes the mark. (COACH-R3 PER-01: the proposal's "stop, maintenance, then a new block" with his "maintenance weeks are a recommendation")
- **A block the user cannot finish:** the user stops it and builds a maintenance phase or a new block; the app no longer asks (the v1.1 block-at-risk prompt needed check-ins and is retired). (COACH-R2 VOL-07; COACH-R3 VOL-02)
- **Next block - changed in v1.3 (COACH-R4 R4-PRG-04):** every group starts about 5 % above the last block's start, in whole sets, never above the level's top; at the top the sets stay and load and reps progress (section V6). The v1.2 rule, kept as history (COACH-R2 VOL-06): when the user builds the next block and says the previous one was **completed**, start = previous start × 1.05, ceiling = previous ceiling + 1, never above 25 (non-priority) or 30 (Focus / priority; Pro setting excepted). Example L2 big line: 15/22 → 16/23 → 17/24 → 18/25. Because nothing is stored, the user enters "blocks completed in a row" (0 by default) when rebuilding (PROPOSED input); after a stopped block the start stays the same (PROPOSED).

**Tests (COACH-R2 PER-07, RIGHT + words).** Ticked at block start: strength (beginners a 5-8-rep max; intermediate and up a 3-rep max or work up to a 1-rep max), cardio (1-mile run or an erg time trial), speed and agility (10-30 m sprint, 5-10-5, L-test), jumps, body weight. **Test before the block (or in week 1) and at the end, never during the block**; the end test replaces that week's top sets and is not counted as stairway sets. **Never from zero:** someone untrained, or not coming off a completed block, tests a 5RM or 3RM (beginners 5-8RM) and 80-90 % efforts, never a 1RM or a max-effort mile. The results are the user's own: the plan prints where to write them; the app keeps nothing (COACH-R3 GEN-01).

### 3.13 Athletic volume (its own budget, never muscle sets)

| Rule | Value | Tag |
|---|---|---|
| Counting | contacts (plyos), reps/sets (ballistics, Olympic), throws, meters or bouts (sprints), cuts (change of direction) | COACH-ANSWER VOL-10 |
| Ballistic vs plyometric | **Ballistic** (longer contact or one big effort): squat jumps, box jumps, broad jumps, loaded or hex-bar jumps, medball throws, KB swings. **Plyometric** (short, bouncy contacts): pogo and ankle hops, hurdle hops, depth jumps, bounds, squirrel jumps, repeated jumps. Stick-the-landing drills are the "receive" stage. | COACH-R2 ATH-02 (RIGHT); KB swing COACH-R2 VOL-05 |
| Plyo share (end of block) | **share of jump and throw work that is plyometric by the end of a block** (table below); **each block starts 15 points more ballistic** and climbs to it; set by fast, bouncy contact demand, not total jumps | COACH-R2 ATH-01 (RIGHT) |
| Receive-Create stages | **1 Land** (receive and pause) → **2 Land & Go** (receive then create) → **3 Repeat** (repeated receive/create). 12-week plan: weeks 1-3 / 4-7 / 8-12; 8-week: 1-2 / 3-5 / 6-8; restart at stage 1 each off-season; stay put in maintenance; intermediate and advanced athletes may start at stage 2. Bilateral before unilateral inside each stage (unilateral is harder). | COACH-R2 ATH-03 (RIGHT); COACH-ANSWER CAT-10, CAT-11 |
| Contacts per session ceiling | L1 80, L2 100, L3 120 (NSCA lower ends); his own sessions run lower and that is fine | SCIENCE NSCA; OBSERVED; caps PROPOSED |
| Sessions with plyos | 2-3/week off-season, 48-72 h apart for the same area; older/masters 3-4 days apart | SCIENCE NSCA |
| Olympic lifts: who | everyone in athletic training: beginners and "beginning intermediates" DB/KB snatches, hex-bar jumps, hang pulls/cleans (incl. the new hang clean, single-arm DB snatch, KB squat clean); **intermediate and up the full scope**, from hang power versions to 'Squat Snatch' / 'Squat Clean' / 'Squat Clean & Jerk' (11's I14 fixed) | COACH-ANSWER ATH-10, LIB-07; COACH-R2 LIB-07 |
| Olympic lifts: how often | **up to 4 times a week** (swimmers 2-3 days, COACH-R3 ATH-01); clean days are squat-pattern days, snatch days are hinge-pattern days ("snatches a little bit more hingy than squatty"); in season a light piece (2 × 3 hang power clean or DB snatch), dropped in heavy game weeks | COACH-R2 ATH-04 (RIGHT + words); COACH-R3 ATH-01 |
| Olympic lifts: reps and load | DB/KB and pull variants keep his ramp 4 × 8 @ 75 % → 4 × 6 @ 80 % → 4 × 6 @ 85 % → 4 × 4 @ 90 %; **full squat cleans and snatches use 3-5 reps per set with the same weekly reps** (e.g. 6 × 5 @ 75 %), with the coach's eye on speed; barbell power and hang-power catches follow the 3-5-rep rule (INFERRED). **% only if the athlete has tested that lift's own max, otherwise RPE/RIR**; the plan explains Olympic lifts as power output; % programming belongs to competitive Olympic lifters (their own programming) | COACH-R2 ATH-05, GEN-06; COACH-ANSWER PER-09 |
| Medball | rotational/athletic only; never over 20 lb (HYROX wall balls with the race ball, never over 20 lb); light (8-10 lb) for speed; none for aesthetics/bodybuilders except warm-up; light medball throws stay on for older adults | COACH-ANSWER ATH-05, EQ-06; COACH-R3 ATH-02, ATH-03 |
| Older clients (60+) | **on by default:** landing drills (step down and stick, no bounce), balance, quick stepping without a hop, light medball throws, fast machine work; **off by default:** low ankle hops, other jumps, Olympic lifts, depth jumps - on only with the warning "Make sure that you have a fitness professional to help you understand what this means"; overhead and low-bar squats stay out | COACH-R2 ATH-08; COACH-R3 ATH-02 (RIGHT); COACH-ANSWER ATH-09, EQ-03 |
| Youth | Olympic lifts from the floor from about 14, after one block of hang work | COACH-R2 ATH-08 |
| In-season, game-heavy sports | basketball, volleyball, soccer, football, hockey + lacrosse, field hockey, rugby, ultimate, flag football, beach volleyball: gym plyos about half; no extra change of direction; sprints only for speed athletes; the one hard gym day ≥ 48 h before a game | COACH-R2 ATH-07; COACH-R3 ATH-04 |
| HYROX station circuits | 2 short circuits a week (sled push / pull, burpee broad jumps, wall balls, farmers carry, sandbag lunges, SkiErg / row) as finishers; never muscle sets; 40-rep / AMRAP sets only inside them | COACH-R3 ATH-03 (RIGHT) |
| Stay-active play days | the hardest gym day ≥ 48 h before the biggest play day; weeks with 3+ play sessions drop the extra agility drills and half the jumps | COACH-R3 ATH-05 (RIGHT) |
| Easy week after a block (recommended, COACH-R3 PER-01) | contacts and throws about half; landings only | COACH-ANSWER PER-05; PROPOSED |

**Plyo share by sport** (COACH-R2 ATH-01, RIGHT; the remaining sports COACH-R3 ATH-04, RIGHT; start of block = end - 15 points):

| Plyo share at block end | Sports (R2-ATH-01 ranked list; R3-ATH-04 additions in italics) | Block start |
|---|---|---|
| 75 % | sprinters; *runners* | 60 % |
| 60 % | volleyball, soccer, football skill positions; *lacrosse, field hockey, flag football, ultimate cutters, rugby sevens, high jump, pole vault, gymnastics, cheer flyers* | 45 % |
| 50 % | basketball, tennis, football big-skill, weekend warriors; *beach volleyball, pickleball, padel, rugby backs, goalkeepers, javelin, HYROX* | 35 % |
| 40 % | baseball, softball, hockey, linemen, MMA; *rugby forwards, cheer bases, throwers, diving, alpine skiing, cycling* | 25 % |
| 25 % | boxing, karate, kickboxing, wrestling, BJJ, golf; *swimming, water polo, rowing, judo, taekwondo, climbing* | 10 % |
| only if chosen | older adults (60+): jumps off by default, landing drills on (§3.4) | - |
| no plyo block | aesthetics, bodybuilding | - |

**Recreational players** use their activity's share (golf 25 %, running 75 %, rec soccer 60 %); "a bit of everything" stays 50 % (COACH-R3 ATH-04). **Swimming** (R3-ATH-01): jumps mostly ballistic, 25 % plyometric by the end of a block (starts and turns are single big efforts) - this replaces v1.1's INFERRED "class 4 → 40 %". **HYROX** (R3-ATH-03): 50 %, "like basketball". The in-season game-heavy rule (§3.4) also covers lacrosse, field hockey, rugby, ultimate, flag football and beach volleyball (R3-ATH-04). Whatever the share, the resistance volume of these sports follows this engine (starts, floor of 10 on groups, stairway); the 04 profiles own the contacts, throws and drills. v1's PROPOSED table (e.g. basketball 45 → 60 %, tennis 30 → 55 %, baseball 15 → 30 %, golf 10 → 20 %) stays retired.

### 3.14 What the engine stores and learns: nothing (v1.1's learning section RETIRED)

**Outputs only (COACH-R3 VOL-02, VOL-04, GEN-01).** "We're only doing outputs, and people can change accordingly"; "I don't want people to be checking back on their phone in their program. I want them to be able to kick out a program, and that's it"; "I don't want any data kept." The generator takes a few inputs, builds the whole plan once and shows every week ahead of time; the user or coach adjusts it (the printed self-adjust guide, §3.7.3; the plan editor, §3.10.2).

**Retired in v1.2** (kept here as a short note so nobody rebuilds them): the two delivery modes (static vs optional weekly check-in); the log schema (DONE, reps, WEIGHT USED or SCORE, EFFORT 1-10, 'Failed', HOW IT FELT, pain location) as an input to the engine; the per-week check-in; tuning each person's step scale, personal ceiling (MRV) and next start from logs; tuning the population tables from users' outcomes; testing the 0.25 helper count against Pelland's 0.5 on user data; experiments and consent flows. The coach's EFFORT and HOW IT FELT menus stay as words the plan may print for the user's own notes, never read back.

**What stays.** The defaults are changed by the coach, by hand, in one place (the JSON twins) - "this is all customizable" (COACH-R2 VOL-06) - and coaches may add their own rules (COACH-ANSWER GEN-08). The plan may show the Pelland count (indirect 0.5) next to the coach count (helpers 0.25) as a display; it is not stored. The guardrails stay fixed in the generator: planned step ≤ 7 %, total < +10 %/week; no deload or maintenance inside a block; floor of 10 per trained group; the time policy (§3.10.1); the pain rules (§3.6); the easy week ≈ half of the hardest week, recommended between blocks; heavy squat and heavy deadlift on different days; core opener first by default; older-adult defaults; no bands / variable resistance; Focus / priority ceilings ≤ 30 (Pro setting excepted).

---

## 4. Pseudo-code

> **Changed in v1.3** (COACH-CT CT-01; COACH-CX CX-01..04; round 4). The v1.3 pipeline is `BLAZE_CAMP_BRAIN.md` §13.3 and the working code is `engine/` 0.5.0. In the v1.2 pseudo-code below, ignore: the time check and everything it sets; the 7 % and 10 % limits; λ capped at 1; "the ceiling the time holds"; the next block's "ceiling + 1". Where the text below differs, the v1.3 section at the top of this file wins.

```python
# ---------- 0. intake -> profile (few inputs; no sleep / stress / job questions; nothing stored: COACH-R2 GEN-04, COACH-R3 GEN-01) ----------
level = level_from_experience(years_consistent, months_off, ex_pro)        # PRG-05 (L1/L2/L3)
goal, sport, position, season_start, practice_game_days = intake...        # GEN-02, R2-GEN-05
age, body_weight, pain_areas = intake...                                    # GEN-02 (age and pain are training inputs)
days, minutes = intake...                                                   # chosen week; checked by the time policy (3.10.1)
focus = intake.focus_muscles               # 0-2 lines, each +F (default 2, 1-3): COACH-R3 SES-01
play_days, event_date = intake...          # stay-active users (COACH-R3 ATH-05), optional
blocks_completed = intake.blocks_completed # 0 by default; drives start x 1.05 and ceiling + 1 (R2-VOL-06; input PROPOSED)
mode = intake.plan_mode                    # '12wk' | '8wk' | 'block_4_6' | 'maintenance' | 'pre_season' | 'yearly'  (week-by-week retired)

# ---------- 1. weekly targets per LINE (FOCUS headers; shoulders = all delts) ----------
LINES = [quads, hamstrings, glutes, chest, back, shoulders, biceps, triceps, calves]          # COACH-R3 VOL-01
GROUPS = {quads:[quads], hips:[hamstrings, glutes], chest, back, shoulders, biceps, triceps, calves}   # COACH-R3 SES-01
for m in LINES:
    start[m] = START_TABLE[m][level]                                                         # 3.3 (VOL-01, R2-VOL-04)
    start[m] = round_half_up(start[m] * GOAL_PHASE_FACTOR[goal, season][region(m)])          # 3.4
    for k in range(blocks_completed): start[m] = round_half_up(start[m] * 1.05)              # R2-VOL-06
    cap[m] = CAP_TABLE[level] + blocks_completed (max 25 / 30)
    if m in focus: start[m] += F[m]; cap[m] = min(cap[m] + F[m], PRIORITY_CAP[level])          # COACH-R3 SES-01
    if m in pain_lines: start[m] *= 0.5 to 0.7; cap[m] = start[m] + 1                        # VOL-03 (pain wins over the floor)
    if mode == 'maintenance': start[m] = factor * last_block_final4_avg[m]; cap[m] = start[m]  # flat, not floored
    if mode == 'pre_season':  start[m] = 0.6 * off_season_sets[m]; cap[m] = start[m]          # flat, not floored
floor_groups(start, 10)            # every directly trained GROUP >= 10 with group credit (R2-VOL-06, COACH-R3 VOL-01)
share_target = SHARE_TABLE[profile][phase]; apply pain shift                                 # 3.11

# ---------- 2. week-1 build ----------
slots = template(goal, days, minutes)       # 05: 2-4 exercises per group per trained day, calves 1 x 3 per leg day,
                                            # core opener 2x2, hip+push / knee+pull, heavy squat and deadlift on different days
fit: trim lines > start+1 (latest isolation first, min 2 sets); add to lines < start-1 with place_set()
S[m] = max(start[m], week1_sets[m])         # the stairway climbs from the week-1 build (3.3, 3.7.1)

# ---------- 3. the planned stairway (3.7.1; approved COACH-R3 VOL-04) ----------
N = block_length(mode); h = ceil(N / 2)
std = {w: 0.03 if w <= h else 0.05 for w in 2..N}
for m in LINES:
    lam[m] = 1 if S[m] * prod(1 + s for s in std) <= cap[m] else solve(S[m] * prod(1 + lam*s) == cap[m])
    if coach_priority_push and m not in push: plan_step[m][w] = min(lam[m] * std[w], 0.03)   # optional (R2-VOL-06)
level_display[w] = 2 + 9 * A(w) / A(N); rir[w] = rir_for_level(level_display[w])           # 3 -> 2 -> 1-2 -> 1 RIR + intensifiers

# ---------- 4. time vs minimums (3.10.1; COACH-R3 SES-02) ----------
plan = run_block(slots, targets)            # inside the chosen minutes, supersets where a day needs them
if not meets_minimums(plan) or peaks_lower(plan):
    show_up_front(offer_extra_day(), offer_minutes(ceil5(peak_week_need)), offer_block_toggles())
    if user_takes_offer: rebuild with it
    elif not meets_minimums(plan):
        kept = pinned + focus_groups; for g in [hips, quads, back, chest, shoulders, calves, triceps, biceps]:
            if meets_minimums(plan_for(kept + [g], start_at_floor=True)): kept.append(g)
        list_not_trained_directly(GROUPS - kept, with their compound credit)
mark_superset_recommendations(every eligible pair)                      # step 3
plan = two_pass_stairway(plan)            # step 4: each kept line lands on the ceiling its time holds, never flat

# ---------- 5. the weekly loop: computed once, all weeks shown (no deload inside the block; no check-in) ----------
T = dict(S)
for w in 2..N:
    for m in LINES (Focus and pinned first, then big, then small):
        T[m] = min(cap[m], T[m] * (1 + plan_step[m][w]))
        while T[m] - weekly_sets[m] >= 1 and weekly_sets[m] + 1 <= cap[m]:
            if total_after_add >= 1.10 * total_last_week and some set was already added this week: break   # UNI-05
            if not place_set(m): break                                          # time, exercise or session limits
    if exercise_block_boundary(w): change_one_small_variable(); rebalance_share(share_target)   # PER-02, R2-LIB-01
    emit(week)                              # with blocks, toggles, superset recommendations, effort cue, self-adjust guide

# ---------- 6. after the block ----------
print('recommended: an easy week at about half of the hardest week, then build your next block')    # COACH-R3 PER-01
tests: before the block (or week 1) and at the end; untrained -> 5RM/3RM or 80-90 % efforts, never 1RM or max mile   # R2-PER-07

def place_set(m):                                                       # COACH-R3 VOL-03
    for day in alternate(days_training(m)):                            # Monday's first exercise, then Thursday's
        group = laterality_group(m, share_target)
        ex = first exercise in session order with sets < sets of the first, else the first (below max)   # VOL-07
        if fits(ex, per_exercise_max, per_session_line_cap=11 (14 Focus), session_minutes): ex.sets += 1; return True
        if superset_frees_time(day): enable_superset(day); retry
    if m == calves: return add_to_optional_day_calves_slot()           # never a 2nd calf exercise on a leg day (R3-SES-01)
    if m is small: return add_bonus(m, prefer=optional_day, else=a day that already trains m, never its only exercise there)
    if m is big:   return add_focus_slot(m, prefer=optional_day, else=a day that already trains the region)
    return False

def edit(plan, edits):                     # COACH-R3 SES-02: toggles, add / remove exercise or block -> rebuild, nothing stored
    return build(intake, constraints=edits)

# athletic block (separate budget, VOL-10)
plyo_share(week) = (SPORT_PLYO_SHARE[sport] - 0.15) + progress(week) * 0.15    # R2-ATH-01, R3-ATH-04, over jump AND throw sets
rc_stage(week)   = {12: [1-3, 4-7, 8-12], 8: [1-2, 3-5, 6-8]}[N]                # R2-ATH-03 (1 Land, 2 Land & Go, 3 Repeat)
olympic: up to 4 slots/week (swimmers 2-3); clean family on squat days, snatch family on hinge days;
         pulls/DB/KB 4x8@75 -> 4x4@90; barbell catches 3-5 reps; % only if tested, otherwise RPE      # R2-ATH-04, ATH-05, GEN-06, R3-ATH-01
older (60+): landing drills, balance, quick stepping, light medball, fast machine work ON; hops/jumps/Olympic/depth jumps OFF   # R3-ATH-02
contacts_per_session <= NSCA[level]
```

---

## 5. Worked examples (computed with the reference prototype v1.2)

> **Changed in v1.3** (COACH-CT CT-01; COACH-CX CX-01; round 4). These are v1.2 numbers. Examples 5.1 and 5.5 are built on session minutes and are retired. Examples 5.2-5.4 still show the counting and the placement order, but their stairways stop under the final sets where λ was capped; in v1.3 every trained group reaches its final sets (section V3). The current sample plans are in `samples/plans/` (engine 0.5.0). Where the text below differs, the v1.3 section at the top of this file wins.

Reading the tables: numbers are **weekly sets per line (coach count, helpers 0.25, a set at most 1.0 to a line)**; "hips (group)" is the R3-SES-01 group the floor of 10 is read on (glutes + hamstrings with group credit). "level / planned effort" is the 2 → 11 display and its approved effort cue (COACH-R3 VOL-04). "resist. sets" = total resistance working sets in the week (core opener not included). Every plan is computed once and shown whole; no example uses a check-in (COACH-R3 VOL-02).

### 5.1 Beginner (L1) aesthetics, 12 weeks, 4 full-body days: the client asked for 60 minutes - RETIRED in v1.3

> **RETIRED in v1.3** (COACH-CT CT-01; COACH-R4 R4-SES-05). The example fits a plan into 60 minutes and builds full-body days with 2-4 exercises for every group. In v1.3 this client gets his A / B days (about 6-8 exercises), every trained group reaches its final sets, and the day prints a time estimate. The text below is kept as history only.

**Inputs.** 9 months of training (L1), aesthetics goal, no Focus muscle, no pain, 4 days, 60 minutes chosen. Starts: every line **10** (shoulders, biceps, triceps lifted from 8 by the floor, COACH-R2 VOL-04/06), calves 3 per leg day (12), abs from the core opener (16). Ceilings 14. Days: Mon and Thu knee dominant + pull, Tue and Fri hip dominant + push (ORD-06); the beginner has no axial lift (goblet squat Monday, leg press Thursday, DB RDL Tuesday; R2-SES-02 list); core opener 2 × 2 every day; calves one exercise × 3 sets every day (COACH-R3 SES-01). Each group a day trains gets 2-4 exercises: Mon quads 3 / back 2 / biceps 2; Tue hips 3 / chest 2 / shoulders 2 (press + side raise); Thu quads 2 / back 2 / shoulders 2 (reverse fly + face pull) / biceps 2; Fri hips 4 / chest 2 / triceps 2.

**Step 1 of the time policy (COACH-R3 SES-02), before the plan is shown.** At 60 minutes the week-1 days already take 56-61 minutes with every pair supersetted and quads could climb only 10 → 11. The plan says so up front and offers: **(A) sessions of about 85 minutes** (the full plan's peak week needs 84.6 minutes on Friday with supersets, 101.5 straight), or **(B) a 5th day** - checked the same way: moving the arm work to a Saturday still leaves Thursday at 61 minutes and the hips group climbing only 18 → 19 at 60 minutes, so the 5th day alone does not fix it; or **(C) keep 60 minutes** and train fewer groups directly:

| Branch | Groups trained directly | Not trained directly (compound credit in the last week) | Longest day, week 1 → week 12 |
|---|---|---|---|
| keep 4 × 60 | hips, quads, back, chest, shoulders, biceps - each line climbs to 13-14.25 by week 12 (ceilings lowered to what the time holds: quads and back 14 → 13; shoulders 16 → 15 and biceps 15 → 14 come from the unclamped step-2 ceiling, §3.10.1 note - with the level ceiling of 14 kept, biceps also go to compound credit) | triceps (4.25 sets of credit from presses), calves (0) | 54.7 → 59.7 min |
| takes offer A: 4 × 85 | every group (table below) | - | 71.8 → 82.9 min |

**The client takes offer A.** The run below is at 85 minutes, supersets on Thursday and Friday.

**Week 1:**
- **Mon:** Dead bug 2 · Side plank 2 · Goblet squat 2 · Chest-supported DB row 3 · DB split squat 10/10 2 · Lat pulldown 2 · Leg extension 2 · DB curl 2 · Hammer curl 2 · Calf raise 3
- **Tue:** Bird dog 2 · Pallof hold 2 · DB Romanian deadlift 2 · DB bench press 3 · DB single-leg RDL 10/10 2 · Seated DB shoulder press 2 · Incline DB press 2 · Leg curl 2 · DB side raise 2 · Calf raise 3
- **Thu:** Dead bug 2 · Side plank 2 · Leg press 2 · 1-arm DB row 10/10 3 · DB step-up 10/10 2 · Neutral-grip pulldown 2 · Reverse DB fly 2 · Face pull 2 · Incline DB curl 2 · Cable curl 2 · Single-leg calf raise 10/10 3
- **Fri:** Bird dog 2 · Pallof hold 2 · Hip thrust 3 · Machine chest press 3 · Cable glute kickback 10/10 3 · Push-up 2 · Cable pushdown 4 · Overhead DB triceps extension 3 · B-stance DB RDL 10/10 2 · Swiss-ball leg curl 2 · Calf raise 3

| Wk | level / planned effort | quads | hams | glutes | hips (group) | chest | back | shoulders | biceps | triceps | calves | abs | resist. sets |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | 2 / 3 RIR | 10 | 11.5 | 9.5 | 18 | 10 | 10 | 12 | 10.5 | 10 | 12 | 16 | 81 |
| 2 | 2.6 / 3 RIR | 10 | 11.5 | 9.5 | 18 | 10 | 10 | 12 | 10.5 | 10 | 12 | 16 | 81 |
| 3 | 3.2 / 3 RIR | 10 | 11.5 | 9.5 | 18 | 10 | 10 | 12 | 10.5 | 10 | 12 | 16 | 81 |
| 4 | 3.8 / 3 RIR | 10 | 11.75 | 10.5 | 19 | 10 | 10 | 12 | 10.5 | 10 | 12 | 16 | 82 |
| 5 | 4.4 / 3 RIR | 10 | 11.75 | 10.5 | 19 | 10 | 10 | 12 | 10.5 | 10 | 12 | 16 | 82 |
| 6 | 5 / 3 RIR | 11 | 11.75 | 10.75 | 19.25 | 11 | 11 | 12.25 | 10.75 | 10.25 | 12 | 16 | 85 |
| 7 | 6 / 2 RIR | 11 | 11.75 | 10.75 | 19.25 | 11 | 11 | 12.25 | 11.75 | 10.25 | 12 | 16 | 86 |
| 8 | 7 / 2 RIR | 12 | 12.75 | 11.25 | 20.5 | 12 | 12 | 12.5 | 12 | 10.5 | 13 | 16 | 91 |
| 9 | 8 / 2 RIR | 12 | 12.75 | 11.25 | 20.5 | 12 | 12 | 12.5 | 12 | 10.5 | 13 | 16 | 91 |
| 10 | 9 / 1-2 RIR | 12 | 13 | 12.25 | 21.5 | 12 | 12 | 13.5 | 13 | 10.75 | 13 | 16 | 94 |
| 11 | 10 / 1-2 RIR | 13 | 13 | 12.5 | 21.75 | 13 | 13 | 14 | 13.25 | 11 | 13 | 16 | 97 |
| 12 | 11 / 1 RIR + intensifiers | 14 | 14 | 13 | 23 | 14 | 14 | 14.5 | 13.5 | 11.25 | 14 | 16 | 102 |

**What happened.**
- **The approved stairway, computed once.** Weeks 2-6 use the small steps (2.28 % for the lines that start at 10); the first sets arrive in weeks 4 (glutes) and 6 (quads, chest, back). From week 7 the steps are bigger and sets arrive every 1-3 weeks. The last four weeks are the highest (91, 94, 97, 102 resistance sets); quads, hamstrings, chest, back and calves land on 14 in week 12. The level climbs 2 → 11 and the planned effort 3 RIR → 1 RIR + intensifiers.
- **Lines that start above their table start climb from where they are.** Hamstrings (11.5) and shoulders (12) start above 10 because every trained group needs 2 exercises a day; their λ is re-solved from the week-1 sets (0.44 and 0.35), so they still climb to 14 and 14.5 instead of running flat.
- **Two lines land on a lower ceiling.** Triceps are trained on Friday only and its two exercises reach their maxima; glutes run out of Friday minutes in the last week. Their ceilings become what the week holds (triceps 12, glutes 13) and their stairways land there in week 12 (triceps 11.25 with the bank at 0.75, glutes 13) (COACH-R3 SES-02 step 4) - the plan lists both.
- **The coach's add order with day alternation (COACH-R3 VOL-03):** quads went Goblet squat 2 → 3 (week 6), Leg press 2 → 3 (week 8), DB split squat 2 → 3 (week 11), DB step-up 2 → 3 (week 12): Monday first, then Thursday, first exercise first.
- **2-4 exercises per group, every week** (script check: 0 violations; calves one exercise every leg day).
- **Shoulders as one line (COACH-R3 VOL-01).** 12 → 14.5 sets: the press and side raise on Tuesday, reverse fly and face pull on Thursday, plus 0.25 credit from every row and horizontal press (side delts 3 direct-credit sets, rear delts 5.5-6).
- Total resistance sets 81 → 102 (+26 % in 12 weeks); the largest weekly rise is +5.8 % (week 8), under the 10 % ceiling.

### 5.2 Intermediate (L2) bodybuilder, Focus muscle 1 = chest, 12-week split + optional Focus day

**Inputs.** 4 years of training, bodybuilding, **Focus muscle 1 = chest (+2, COACH-R3 SES-01)**: chest starts 17 with ceiling 24 (15 + 2, 22 + 2); other big lines 15 (ceiling 22), shoulders, biceps and triceps 12 (22), calves 10 (floor), abs 20. The other lines keep their own stairway (the Focus extra does not slow them). Split: Mon Push (chest first, ORD-04), **Tue Legs A (back squat: the week's heavy squat)**, Wed Pull (row before pulldown), Thu optional Focus day (45 min, up to 6 exercises; Focus slots on chest, ORD-11), Fri Upper (chest, back, triceps), **Sat Legs B (barbell RDL: the heavy hinge; belt squat, non-axial)** (COACH-R2 SES-01, SES-02). Shoulders are trained Monday (press + side raise) and Wednesday (reverse pec-deck + face pull). Lower share 50/50 in weeks 1-4, 80/20 from the week-5 exercise-block change (UNI-02, CAT-13). 90-minute sessions.

**Step 1 of the time policy.** Every group meets its minimums at 90 minutes, but the time holds a lower peak for some lines: the full climb needs Saturday at about 110 minutes. The plan says so up front ("your 90-minute Saturday holds quads 19, glutes 18 and hamstrings and back 21 in the last week; a longer Saturday or a 7th day gets 22") and the client keeps 90 minutes; those lines land on the lower ceilings (step 4). Biceps (Wednesday only, two exercises at their maxima) land on 14-15 and calves (one exercise per leg day + the Thursday slot) on 11-12.

| Wk | level / planned effort | quads | hams | glutes | hips (group) | chest | back | shoulders | biceps | triceps | calves | abs | resist. sets |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | 2 / 3 RIR | 15 | 14.5 | 15.25 | 25 | 18 | 16 | 13.25 | 11.5 | 11.75 | 10 | 20 | 105 |
| 2 | 2.6 / 3 RIR | 15 | 14.5 | 15.25 | 25 | 18 | 16 | 13.25 | 11.5 | 11.75 | 10 | 20 | 105 |
| 3 | 3.2 / 3 RIR | 15 | 15.5 | 15.25 | 26 | 18 | 16 | 13.25 | 11.5 | 11.75 | 10 | 20 | 106 |
| 4 | 3.8 / 3 RIR | 15 | 15.5 | 15.25 | 26 | 19 | 16 | 13.5 | 11.5 | 13 | 10 | 20 | 108 |
| 5 | 4.4 / 3 RIR | 15 | 15.5 | 15.25 | 26 | 19 | 17 | 14.75 | 11.75 | 13.25 | 10 | 20 | 110 |
| 6 | 5 / 3 RIR | 16 | 16.5 | 15.75 | 27.25 | 19 | 17 | 14.75 | 11.75 | 13.25 | 10 | 20 | 112 |
| 7 | 6 / 2 RIR | 16 | 16.5 | 15.75 | 27.25 | 20 | 18 | 15.25 | 12 | 14.5 | 10 | 20 | 115 |
| 8 | 7 / 2 RIR | 17 | 17.5 | 16.25 | 28.5 | 21 | 18 | 16.5 | 14 | 14.75 | 11 | 20 | 122 |
| 9 | 8 / 2 RIR | 17 | 18.5 | 16.5 | 29.5 | 21 | 19 | 17.5 | 14.25 | 15.75 | 11 | 20 | 126 |
| 10 | 9 / 1-2 RIR | 19 | 18.5 | 16.5 | 29.5 | 22 | 19 | 17.75 | 14.25 | 16 | 11 | 20 | 129 |
| 11 | 10 / 1-2 RIR | 19 | 20.75 | 17.5 | 32.5 | 23 | 20 | 19 | 14.5 | 17 | 11 | 20 | 136 |
| 12 | 11 / 1 RIR + intensifiers | 19 | 20.75 | 17.5 | 32.5 | 24 | 21 | 20.25 | 14.75 | 19.5 | 11 | 20 | 141 |

**Chest, exercise by exercise** (Mon = bench / incline DB / machine press / cable fly; Fri = incline machine / flat DB / dips, where dips are triceps-led at 0.5 + 0.5; Thu = the two Focus slots):

| Week | Mon | Fri | Thu (Focus) |
|---|---|---|---|
| 1-3 | 3/2/2/2 | 2/2/2 | 2/2 |
| 4-6 | 3/**3**/2/2 | 2/2/2 | 2/2 |
| 7 | 3/3/2/2 | **3**/2/2 | 2/2 |
| 8-9 | 3/3/**3**/2 | 3/2/2 | 2/2 |
| 10 | 3/3/3/2 | 3/**3**/2 | 2/2 |
| 11 | 3/3/3/**3** | 3/3/2 | 2/2 |
| 12 | 3/3/3/3 | **4**/3/2 | 2/2 |

**What happened.**
- **Focus muscle chest:** 18 → 24 (its ceiling 24), two sets above the balanced line all block; its new sets alternate Monday → Friday → Monday (COACH-R3 VOL-03) in the VOL-07 order.
- **No check-ins, no holds, no repeated week:** the 12 weeks are the 12 planned stairway weeks (v1.1's 13-week run with holds is retired).
- **Placement (COACH-R3 VOL-03):** biceps got a 'Cable curl (bonus)' on the optional Thursday in week 8; triceps a 'Rope pushdown (bonus)' on Friday, a day that already trains triceps (dips + overhead extension), in week 12; quads, hamstrings and glutes got Focus slots (leg extension on Thursday, Nordic curl on Tuesday, cable pull-through on Thursday); calves never got a second calf exercise on a leg day.
- **Exercise-block change at week 5 (PER-02, UNI-02, CAT-13):** walking-lunge sets moved to the back squat, one staggered-stance set to the barbell RDL, and the staggered-stance DB deadlift became a reverse hyper / 45-degree back extension (non-axial, R2-SES-02). Lower bilateral share 0.57 → 0.81, 0.77 at the end.
- **Shoulders (COACH-R3 VOL-01):** 13.25 → 20.25 as one line (side delts 3 → 4.25 direct-credit sets, rear delts 6 → 7.75); "add rear delts" or a V-taper bias would raise the direct side- and rear-delt work (flag a).
- Total resistance sets 105 → 141 (+34 %); the largest weekly rise +6.1 % (week 8). Sessions in the last week: Mon 79, Tue 82, Wed 78, Fri 81, Sat 90, Thu 42 minutes (no supersets needed).
- Pelland count in the last week (indirect 0.5): glutes 24 vs 17.5 on the coach count; triceps 25 vs 19.5; shoulders 27.5 vs 20.25 (display only; nothing is stored).

### 5.3 Tennis player (L2) off-season, 8 weeks, 80-90 % unilateral, 4 days × 90 min

**Inputs.** Competitive tennis, off-season, 2 years of structured training. Base (field athlete off-season: lower × 0.7, upper × 0.5, round half up, then the floor of 10 on groups): quads and hamstrings 11; **chest and back 7.5 → 10 (floor; flagged)**; **shoulders 6 → 10** (one line, at the floor, through the Thursday shoulder-care station and the presses; COACH-R3 VOL-01); calves 3 per leg day (12); glutes, biceps and triceps credit only (UNI-02); the hips group is trained through hamstrings (floor met). Ceilings = base × 1.3 (quads/hamstrings 14, chest/back/shoulders 13, calves 14; PROPOSED). 8-week stairway. Days (≤ 12 exercises + the 2-exercise core block, cross pattern: 2 jump / throw stations + 1 Olympic lift, COACH-R3 SES-01): Mon knee + pull with the clean-family lift (hang power clean); Tue hip + push with the snatch-family lift (single-arm DB snatch) and the week's only axial lift (trap-bar RDL); Thu knee + pull (hang clean pull) + shoulder care (reverse fly + KB face pull); Fri hip + push (KB swing = ballistic, no glute credit). Athletic slots 2 sets each (VOL-16). Time check: fits at 90 minutes (no warning).

**Week 1:**
- **Mon:** Pallof press 10/10 2 · Copenhagen side plank 2 · Lateral bound 2 · Medball rotational scoop toss 8 lb 2 · Hang power clean 3 · RFE split squat 8/8, contralateral DB 3 · 1-arm DB row 10/10 3 · Lateral lunge 8/8 3 · Half-kneeling 1-arm pulldown 10/10 2 · Single-leg calf raise 12/12 3
- **Tue:** Dead bug 2 · Side plank 2 · Seated box jump 2 · Medball side toss 8 lb 2 · Single-arm DB snatch 5/5 3 · Trap-bar RDL 2 · Alternating DB bench press 4 · Single-leg RDL 8/8, contralateral DB 3 · Push-up 2 · Nordic curl (assisted) 2 · Single-leg calf raise 12/12 3
- **Thu:** Pallof press 10/10 2 · Copenhagen side plank 2 · Skater hop 2 · Medball shot-put throw 8 lb 2 · Hang clean pull 3 · Lateral step-up 8/8 3 · Pull-up 3 · Cossack squat 6/6 2 · 1-arm cable row 10/10 2 · Reverse DB fly 3 · KB face pull 3 · Single-leg calf raise 12/12 3
- **Fri:** Dead bug 2 · Side plank 2 · Broad jump (stick) 2 · Medball overhead slam 10 lb 2 · KB swing 2 · 45-degree back extension 2 · 1-arm DB bench 8/8 2 · Slider leg curl 2 · Feet-elevated push-up 2 · Single-leg hip thrust 10/10 2 · Single-leg calf raise 12/12 3

| Wk | level / planned effort | quads | hams | glutes | hips (group) | chest | back | shoulders | biceps | triceps | calves | abs | resist. sets |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | 2 / 3 RIR | 11 | 11.5 | 6.5 | 15.75 | 10 | 10 | 9.75 | 2.5 | 2.5 | 12 | 16 | 62 |
| 2 | 2.9 / 3 RIR | 11 | 11.5 | 6.5 | 15.75 | 10 | 10 | 9.75 | 2.5 | 2.5 | 12 | 16 | 62 |
| 3 | 3.9 / 3 RIR | 11 | 11.5 | 6.5 | 15.75 | 10 | 10 | 9.75 | 2.5 | 2.5 | 12 | 16 | 62 |
| 4 | 4.8 / 3 RIR | 11 | 11.5 | 6.5 | 15.75 | 10 | 10 | 10.75 | 2.5 | 2.5 | 12 | 16 | 63 |
| 5 | 6.3 / 2 RIR | 12 | 12.5 | 7 | 17 | 11 | 11 | 11 | 2.75 | 2.75 | 12 | 16 | 67 |
| 6 | 7.9 / 2 RIR | 12 | 12.5 | 7 | 17 | 11 | 11 | 11 | 2.75 | 2.75 | 13 | 16 | 68 |
| 7 | 9.4 / 1-2 RIR | 13 | 13.5 | 7.5 | 18.25 | 12 | 12 | 11.5 | 3 | 3 | 13 | 16 | 72 |
| 8 | 11 / 1 RIR + intensifiers | 14 | 13.5 | 7.75 | 18.5 | 13 | 13 | 13 | 3.25 | 3.25 | 14 | 16 | 77 |

Lower-body bilateral share **0.22** in weeks 1 and 8 (trap-bar RDL and 45-degree back extension are the only bilateral lifts: 78 % unilateral, the low edge of his 80-90 %); upper 0.27. 10-12 listed exercises a day (≤ 14 with the core block); every group trained on a day has 2-3 exercises, calves 1 (0 violations).

**Athletic budget (separate; never in the table above).** Plyo share counted over jump **and** throw sets (COACH-R2 ATH-01): tennis ends at 50 % and starts 15 points more ballistic (35 %); Receive-Create stages on the 8-week timing 1-2 / 3-5 / 6-8 (COACH-R2 ATH-03). Unchanged by round 3.

| Wk | jump + throw sets | plyo sets | ballistic sets (incl. throws) | plyo share | Receive-Create stage | plyo contacts / week | per plyo day | throws / week | Olympic sets / week |
|---|---|---|---|---|---|---|---|---|---|
| 1 | 18 | 6 | 12 | 33 % | RC1 Land | 48 | 24 | 140 | 9 |
| 2 | 18 | 7 | 11 | 39 % | RC1 Land | 56 | 28 | 140 | 9 |
| 3 | 18 | 7 | 11 | 39 % | RC2 Land & Go | 70 | 35 | 140 | 9 |
| 4 | 19 | 8 | 11 | 42 % | RC2 Land & Go | 80 | 40 | 140 | 9 |
| 5 | 19 | 8 | 11 | 42 % | RC2 Land & Go | 80 | 40 | 140 | 9 |
| 6 | 20 | 9 | 11 | 45 % | RC3 Repeat | 126 | 63 | 140 | 9 |
| 7 | 20 | 10 | 10 | 50 % | RC3 Repeat | 140 | 70 | 140 | 9 |
| 8 | 20 | 10 | 10 | 50 % | RC3 Repeat | 140 | 70 | 140 | 9 |

(Contacts: 8 per plyo set in stage 1 (4 per side), 10 in stage 2, 14 in stage 3; throws: scoop, side toss and shot-put are 2 × 10 per side, slams 2 × 10. The generator meets the rising share by turning ballistic slots into plyometric variants of the same pattern, e.g. broad jump stick → repeated broad jumps.)

**What happened.** Resistance volume follows the 8-week stairway and peaks in week 8 (62 → 77 sets, +24 %; largest weekly rise +6.9 % in week 8), with quads, chest, back, shoulders and calves landing on their ceilings in the last week. Sessions run 79-87 minutes in week 8. The athletic side carries the "drive" (ballistic → plyometric, stage 1 → 3): contacts rise 48 → 140 a week, 24 → 70 per plyo day, inside his own observed sessions (18-77 contacts) and under NSCA's L2 guide (100). The user may switch off a day's athletic block (§3.10.2); that changes no set number above.

### 5.4 After the block: the recommended easy week and the maintenance option (the bodybuilder of 5.2)

**When the 12 weeks end, the block ends** (COACH-R3 PER-01). The plan's last page recommends, and does not impose:
- **An easy week** at about half of the hardest week (week 12 of 5.2): **82 resistance sets** (quads 12, hamstrings 11.5, glutes 10, chest 14.5, back 13, shoulders 12.5, biceps 8, triceps 10.75, calves 6), same exercises, 3+ RIR (COACH-R2 VOL-07 dose; recommendation COACH-R3 PER-01).
- **Or a maintenance phase** the user builds (e.g. while travelling, 4 weeks): base = average of the last 4 weeks of 5.2 (133 resistance sets/week).

| Factor | quads | hams | glutes | chest | back | shoulders | biceps | triceps | calves |
|---|---|---|---|---|---|---|---|---|---|
| 50 % (vacation, limited kit) | 9 | 10 | 9 | 11 | 10 | 9 | 7 | 9 | 6 |
| **60 % (travel, hotel gym)** | 11 | 12 | 10 | 14 | 12 | 11 | 9 | 10 | 7 |
| 70 % (planned maintenance; older adults' floor) | 13 | 14 | 12 | 16 | 14 | 13 | 10 | 12 | 8 |

**4 × 60-minute hotel-gym week at 60 %** (flat, RIR 2-3, machines and DBs; 2-4 exercises per trained group): 80 resistance sets; quads 11, hamstrings 11.5, glutes 9.75, chest 14, back 12, shoulders 12.25, biceps 9, triceps 9.25, calves 7; 50-59 minutes with supersets.
- **Mon:** Dead bug 2 · Leg press 2 · Machine chest press 4 · DB split squat 10/10 2 · Incline DB press 3 · Leg extension 2 · Cable pushdown 3 · Overhead DB triceps extension 3 · Calf raise 4
- **Tue:** Pallof press 2 · Seated cable row 3 · DB Romanian deadlift 3 · Lat pulldown 3 · Leg curl 2 · DB curl 3 · Hammer curl 3 · Reverse DB fly 2 · Face pull 2
- **Thu:** Dead bug 2 · Hack squat or Smith squat 3 · Flat DB press 4 · Step-up 10/10 2 · Cable fly 3 · Seated DB shoulder press 2 · DB side raise 2 · Calf raise 3
- **Fri:** Pallof press 2 · Chest-supported DB row 3 · Hip thrust 3 · Neutral-grip pulldown 3 · 45-degree back extension 3 · Cable glute kickback 10/10 3 · Leg curl 2

**The next block.** When he builds it and enters "1 block completed": start × 1.05 and ceiling + 1 (COACH-R2 VOL-06): chest 17 → 18 (ceiling 25), other big lines 15 → 16 (23), shoulders, biceps and triceps 12 → 13 (23). Maintenance is not floored at 10 (it is maintenance by definition); 50-70 % of this base is still well above the research minimum to keep muscle in a younger adult (§2.4); for an older adult the engine keeps ≥ 70 %. If he stopped the block early, he builds the next one at the same start (PROPOSED). Nothing is stored between the two builds (COACH-R3 GEN-01).

### 5.5 The coach's own example (COACH-R3 SES-02): a pickleball player who keeps 2 × 45 minutes - RETIRED in v1.3

> **RETIRED in v1.3** (COACH-CT CT-01; COACH-R4 R4-SES-03). In v1.3 a 2-day player gets one A day and one B day, every big group trained at about 6-8 weekly sets, and the plan suggests a third day. No group is left to compound credit because of time. The text below is kept as history only.

**Inputs.** 55 years old, L2 (2 years of training), "stay athletic and active" with pickleball 3+ times a week (general-fitness factor 0.8: big lines start 12, shoulders and arms 10 by the floor, ceilings 18; calves one exercise × 3 sets per leg day, ceiling 4 per leg day), 2 days (Mon, Thu) × 45 minutes. Profile defaults (COACH-R3 ATH-02, ATH-05): knee-friendly, mostly bilateral and machine strength; **calf and Achilles work every leg day (pinned: never dropped by the time policy)**; rotator-cuff work in the warm-up (no bands); low-impact jumps only; with 3+ play sessions a week the extra agility drills and half the jumps go, so one athletic station a day (Monday a light rotational medball throw, Thursday a step-down-and-stick landing). The full plan trains every group with 2 exercises per day it is trained (Monday quads, hips, back, shoulders, biceps; Thursday hips, chest, quads, back, triceps), paired as supersets.

**Step 1: tell up front and offer.** The full plan's base week already takes 58-62 minutes a day with supersets; its peak week needs **92-100 minutes a day**. Offers: **about 105-minute sessions**, or more days (a 3rd 45-minute day that takes the arms and shoulder isolation still leaves Monday at 53 minutes in week 1, so 2 → 3 days at 45 minutes is not enough either), or the block toggles (switching off the core opener saves about 8 minutes a day).

**Step 2: he keeps 2 × 45.** Every group at its minimum plan does not fit, so the kept set is built in priority order (pinned calves, then hips, quads, back, chest, shoulders, triceps, biceps), keeping a group only if every kept group still meets its minimums:

| Kept | Week 1 → week 12 | Not trained directly (time) - compound credit in week 12 |
|---|---|---|
| calves (pinned) | 6 → 7 | quads, chest, back, shoulders, biceps, triceps: shoulders 2 (the shoulder press kept as a compound), triceps 0.5, the rest 0 |
| hips (glutes + hamstrings: DB RDL + seated leg curl on Monday, hip thrust + lying leg curl on Thursday) | 10 → 14 | |

**Step 3:** supersets recommended (Monday needs them); **step 4:** the stairway climbs on both kept lines (hips λ 0.76 to 14, calves 6 → 7). Days run 39-42 minutes in week 1 and 45 in week 12.

**Monday / Thursday, week 12:** Dead bug 2 · Side plank 2 · Medball rotational throw 6 lb 2 · DB Romanian deadlift 4 · Seated DB shoulder press 2 · Seated leg curl 3 · Standing calf raise 4 / Bird dog 2 · Pallof press 2 · Low box step-down and stick 2 · Hip thrust 3 · Lying leg curl 4 · Single-leg calf raise 10/10 3.

| Wk | level / planned effort | quads | hams | glutes | hips (group) | chest | back | shoulders | biceps | triceps | calves | abs | resist. sets |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | 2 / 3 RIR | 0 | 7.75 | 3.75 | 10 | 0 | 0 | 2 | 0 | 0.5 | 6 | 8 | 18 |
| 2 | 2.6 / 3 RIR | 0 | 7.75 | 3.75 | 10 | 0 | 0 | 2 | 0 | 0.5 | 6 | 8 | 18 |
| 3 | 3.2 / 3 RIR | 0 | 7.75 | 3.75 | 10 | 0 | 0 | 2 | 0 | 0.5 | 6 | 8 | 18 |
| 4 | 3.8 / 3 RIR | 0 | 7.75 | 3.75 | 10 | 0 | 0 | 2 | 0 | 0.5 | 6 | 8 | 18 |
| 5 | 4.4 / 3 RIR | 0 | 7.75 | 3.75 | 10 | 0 | 0 | 2 | 0 | 0.5 | 6 | 8 | 18 |
| 6 | 5 / 3 RIR | 0 | 8.75 | 3.75 | 11 | 0 | 0 | 2 | 0 | 0.5 | 6 | 8 | 19 |
| 7 | 6 / 2 RIR | 0 | 8.75 | 3.75 | 11 | 0 | 0 | 2 | 0 | 0.5 | 6 | 8 | 19 |
| 8 | 7 / 2 RIR | 0 | 9.75 | 3.75 | 12 | 0 | 0 | 2 | 0 | 0.5 | 6 | 8 | 20 |
| 9 | 8 / 2 RIR | 0 | 9.75 | 3.75 | 12 | 0 | 0 | 2 | 0 | 0.5 | 6 | 8 | 20 |
| 10 | 9 / 1-2 RIR | 0 | 9.75 | 3.75 | 12 | 0 | 0 | 2 | 0 | 0.5 | 6 | 8 | 20 |
| 11 | 10 / 1-2 RIR | 0 | 10.75 | 4 | 13 | 0 | 0 | 2 | 0 | 0.5 | 6 | 8 | 21 |
| 12 | 11 / 1 RIR + intensifiers | 0 | 11.75 | 4 | 14 | 0 | 0 | 2 | 0 | 0.5 | 7 | 8 | 23 |

**The same player with other choices** (computed the same way):

| Choice | Groups trained directly | Week 1 → week 12 |
|---|---|---|
| 2 × 45, core opener switched off (R3-SES-02 toggle) | calves, hips | hips 10 → 15, calves 6 → 8 |
| 2 × 60 | calves, hips, quads | quads 10 → 13, hips 9.5 → 12.75, calves 6 → 7 |
| 2 × 75 | calves, hips, quads, back | quads 10 → 15, back 10 → 15, hips 9.5 → 15, calves 6 → 8 |
| about 2 × 105 (the offer) | every group | the full plan |

**What it shows.** The coach's minimums (10 sets a week per trained group, 2-4 exercises a day, 3 calf sets per leg day, a climbing stairway) cost about 25-30 minutes of lifting per group per week in this time model, so 2 × 45 minutes with the warm-up, the core opener and one athletic station holds one big group plus the pinned calves. The policy does what he approved - tells the player first, offers more time or days, then trains fewer groups properly instead of every group under the floor - and the plan states the trade-off before it is used (flag e).

---

## 6. What changed (for the integrator)

### 6.1 What v1 changed in the v0 files (round 1; rows marked † were changed again in v1.1, see 6.2)

| v0 location | v0 rule | v1 rule | Why |
|---|---|---|---|
| † `generator_spec_v0.json > rule_tables.muscles.list[*].rate`, `.focus_rule`; `> progression.engine.rates`; `03_volume_rules.json > generator_rules.progression`; `03_volume_dosing.md` §9.6; `BLAZE_CAMP_BRAIN.md` §7.3 | big lower 3 %, big upper 5 %, small 7 %; focus "one class up" | person-based 3/5/7 % from readiness; priority = +4-6 sets on the start, not a faster rate | COACH-ANSWER VOL-05, VOL-02 |
| † `rule_tables.counting.credit`; `03_volume_rules.json > counting.fractional_credit_map` | synergists 0.5 | helpers 0.25; dips 0.5/0.5; thruster 1.0/0.5; glute values PROPOSED | COACH-ANSWER VOL-09, LIB-16, LIB-14 |
| `rule_tables.counting.unilateral_set` | "'10/10' = 1 set (pending)" | 10/10 = 1 set, resolved | COACH-ANSWER UNI-01 |
| `rule_tables.weekly_sets` (hypertrophy_peak L1-L4; "15-20 read as the peak week") | peak-week targets, start back-solved | **start** table (10-12 / 15-20 / 20+), level caps, priority caps; L4 retired | COACH-ANSWER VOL-01, UNI-01, VOL-02, PRG-05 |
| `progression.engine.release` | threshold 1.0 with chunk = clamp(round(0.10 × current), 1, 2) | one whole set per bank unit; 10 % ceiling on the weekly total | COACH-ANSWER VOL-06, UNI-05 |
| `progression.engine.placement` | round-robin, never the same exercise twice in a row | his order: first exercise first (2/2/2 → 3/2/2 → …), day rotation, bonus/Focus fallback | COACH-ANSWER VOL-07 |
| † `progression.deload.dose` | round(min(0.85 × W1, 0.75 × peak)) | ≈ 0.5 × current week's sets, lighter | COACH-ANSWER PER-05 |
| † `progression.plan_shapes` 6 / 8 / 12 | 6 = 6 loading; 8 = 7 + deload; 12 = 6 + deload + 5 | 4-6 = maintenance 50-70 %; 8 = start hard, 4 + 4; 12 = 2-4 acclimation, 4-6 drive, last weeks hardest; week-by-week; yearly | COACH-ANSWER PER-01 (NOT RIGHT on v0) |
| `rule_tables.bilateral_unilateral.target_bilateral_share_lower` | 0.35-0.70 by goal | 90/10 ↔ 10/90 table (section 3.11) | COACH-ANSWER UNI-02, UNI-03, UNI-10, CAT-13 |
| † `rule_tables.session_budget` | 15-24 sets by level; athletic 24-30 | 5-7 exercises; athletes 10-12; 90 / 45-60 min; time model | COACH-ANSWER VOL-08, VOL-16, VOL-17, UNI-09 |
| `vocab.levels` L1-L4 | four levels, NOVICE below NEWBY | L1 (novice = newby), L2, L3 | COACH-ANSWER PRG-05 |
| † `progression.autoregulation` | EFFORT bands per muscle | person-level readiness score + gates (section 3.7) | COACH-ANSWER VOL-05, GEN-05 |
| `03_volume_rules.json > generator_rules.priority_muscles` | +4-6 and rate +2 points | +4-6 on the start, cap 25-30, non-priority ≤ 3 % | COACH-ANSWER VOL-02; PROPOSED |
| Band substitutes anywhere in volume swaps | banded leg extension etc. | removed; no bands or variable resistance | COACH-ANSWER EQ-01, EQ-07, EQ-08, EQ-12 |

### 6.2 What v1.1 changes in v1 (round 2)

| v1 location | v1 rule | v1.1 rule | Why |
|---|---|---|---|
| §3.7 readiness score; JSON `rate_engine.readiness_score` | R = 0.40·E + 0.20·C + 0.20·P + 0.20·L → 7 / 5 / 3 % / hold | retired; step = planned stairway step, changed by the check-in table (effort, completion, pain) | COACH-R2 VOL-01, GEN-04 |
| §3.7 step 3; JSON `rate_engine.planned_rate_before_logs` | 5 % default, 3 % for stress / sleep / physical job / 60+ / layoff / pain; 7 % only after logs; target-seeking; new 3-tap intake question | retired; the planned stairway (§3.7.1); older adults ≤ 3 % kept as an age rule (PROPOSED) | COACH-R2 GEN-04, PER-03, PER-04, VOL-03 |
| §3.7 phase limits; §3.12 12-week / 8-week rows | acclimation ≤ 3 %; 8-week start × 1.10, weeks 1-4 ≤ 5 % | stairway for every plan length; 8-week starts at the normal start | COACH-R2 PER-03 (NOT RIGHT), PER-04 |
| §3.7 gates; §3.12 deload triggers; JSON `deload.when` | hold 2 weeks → deload; triggered deloads inside the plan; resume at the volume of 2 weeks before | no deload or maintenance inside a block; block-at-risk prompt → cancel → maintenance → new block; deload only between blocks (half of the hardest week) | COACH-R2 VOL-07 |
| §3.7 step 4 | hand-set rate 0-10 % | 0-7 %; total < +10 % | COACH-ANSWER UNI-05 (03 conflict 4) |
| §3.1 credit map | hinges → glutes 0.5 (PROPOSED); thruster 1.0 / 0.5 | hinges → glutes 0.25; thruster 1.0 / 0.5 / 0.25; KB swing ballistic (0); face pull = shoulder work | COACH-R2 VOL-05, LIB-04, LIB-10 |
| §3.3 starting table | small muscles 8 / 12 / 15; small caps 12 / 18 / 22; floors 4 (big) / 2 (small) | small 10 / 12 / 15; caps 14 / 22 / 25 for every target muscle; floor 10 per trained muscle; priority caps 18 / 26-28 / 30; Pro setting | COACH-R2 VOL-04, VOL-06 |
| §3.3 / §3.5 priority add | +5 at L2 in the table vs +4 in the text and JSON | +4 at L1-L2, +6 at L3 everywhere | 11's I10 |
| §3.10 session limits | 5-7 exercises, 8 PROPOSED; 3-4 exercises per muscle on its day; 3 / 2 / 3 default sets | by length 5 / 6-7 / 8-9; full-body days 2-4 per muscle group; field athletes 12 + 2 core; athletic slots 2 sets | COACH-ANSWER VOL-08, VOL-16; COACH-R2 SES-04, SES-05 |
| §3.10 time model | per-set minutes only; 60 min ≈ 19-20 sets | + 1 min changeover per exercise, core opener included; 60 min ≈ 7 exercises / 17 sets | COACH-R2 SES-05 (realistic session lengths) |
| §3.10 aerobic sessions | 3 / 2 / 4 fixed | adjustable up or down by the user; off-season by sport; powerlifters 2 easy | COACH-R2 SES-06, ATH-06 |
| §3.9 hard rules | no second axial-loaded day | heavy squat and heavy deadlift on two different days + the counted axial list | COACH-R2 SES-01, SES-02 |
| §3.12 maintenance; pre-season | 4-6 weeks at 50-70 %, fixed length; pre-season 0.6 lower / 0.4 upper | maintenance length chosen and extendable with an end prompt; pre-season 4-6 weeks at ~60 % of off-season sets + 1-2-week taper | COACH-R2 PER-06 |
| §3.12 cycles | same start after a maintenance block | × 1.05 after a completed block (even with maintenance after it); same start after a cancelled block (PROPOSED) | COACH-R2 VOL-06, VOL-07 |
| §3.12 tests | checkbox at block start; test week replaces the last loading week's top sets | before (or week 1) and at the end, never mid-block; untrained 5RM / 3RM or 80-90 %, never 1RM or max mile | COACH-R2 PER-07 |
| §3.13 plyo share; method stage; Olympic | PROPOSED shares (e.g. basketball 45 → 60 %); stages weeks 1-2 / 3-5 / 6+; Olympic L2 hang power, L3 full lifts | approved shares (end of block, start 15 points lower, jump + throw work); Receive-Create stages 1-3 / 4-7 / 8-12 (12 wk), 1-2 / 3-5 / 6-8 (8 wk); L2+ full scope; up to 4 × a week; 3-5-rep catches | COACH-R2 ATH-01..05; 11's I14 |
| §3.14 logs | weekly sleep / stress / energy / body weight | sessions done, effort, pain, how it felt; 10 = successful max; optional 'Failed' | COACH-R2 GEN-04, VOL-02 |
| §5 examples | readiness-based rates, acclimation caps, 8-week start-hard | recomputed with the v1.1 prototype | all of the above |

### 6.3 What v1.2 changes in v1.1 (round 3)

| v1.1 location | v1.1 rule | v1.2 rule | Why |
|---|---|---|---|
| §3.7.3 check-in table; JSON `stairway.checkin_table`, `checkin_inputs`, `effort_reading`, `life_column_removed` | optional weekly check-in moves next week's step (effort 1-6 +2 points, 7-8 planned, 9 hold, 10 hold -1 set, under half the sessions repeat the week); 'Failed' answer | **retired**: the planned stairway only, computed once; a printed self-adjust guide | COACH-R3 VOL-02, VOL-04 |
| §3.14 learning; JSON `learning` | two delivery modes, log schema, tuning of personal step scale / cap / start and population tables from logs | **retired**: outputs only, nothing stored; defaults changed by the coach by hand | COACH-R3 VOL-04, GEN-01 |
| §3.12 week-by-week mode; block-at-risk prompt; maintenance end prompt; transition deload after every completed block | rolling 12-week stairway with check-ins; app prompts | week-by-week retired; the easy week is a recommendation; the plan ends and the user builds the next; "blocks completed" entered at rebuild | COACH-R3 PER-01, VOL-02 |
| §3.3 rear delts (own 4 / 6 / 8, caps 8 / 12 / 16), side delts (10 / 12 / 15); floor read per muscle (rear delts on SHOULDERS/TRAPS, INFERRED) | two delt lines | **one shoulders line** (10 / 12 / 15, caps 14 / 22 / 25), group credit; floor read on the R3-SES-01 groups (hips, shoulders ...); "add rear delts" editing option | COACH-R3 VOL-01, SES-01 |
| §3.5 priority muscles (+4 / +6, caps 18 / 26-28 / 30, others ≤ 3 %) | the intake path for "more of one muscle" | **Focus muscle 1 / 2: +1-3 (default +2) on start and ceiling**, others not slowed; the +4 / +6 push only as an optional coach setting | COACH-R3 SES-01 |
| §3.9 step 1 and step 5 (R2-VOL-08 default, flagged for a re-ask) | alternate the first exercise; bonus on the optional day, else a day that trains that group | approved as the coach's rule; calves never get a second calf exercise on a leg day | COACH-R3 VOL-03, SES-01 |
| §3.10 groups (INFERRED), calves "one exercise" (PROPOSED), time "might be a little longer" | full-body days 55-80 min; a client who insists on 60 min gets fewer groups per day or supersets ("the plan says so") | groups approved (hips, shoulders), calves one exercise × 3 per leg day approved; **the exact time-vs-minimums algorithm** (§3.10.1); editing and superset recommendations (§3.10.2-3) | COACH-R3 SES-01, SES-02 |
| §3.7.2 effort drift 3 → 1 RIR (PROPOSED, flagged against VOL-13) | planned drift | approved | COACH-R3 VOL-04 |
| §3.4 older adults: stairway ≤ 3 %; no Olympic lifts, plyos or depth jumps by default | | step cap retired; R3-ATH-02 on / off defaults (landing drills, balance, quick stepping, light medball, fast machine work on; hops, jumps, Olympic lifts, depth jumps off; OH and low-bar squats out) | COACH-R3 VOL-04, ATH-02 |
| §3.13 swimming "class 4 → 40 %" (INFERRED); pickleball / padel / HYROX class 3 "50 %, PROPOSED" | | swimming 25 % (approved), HYROX 50 % (approved), the R3-ATH-04 shares for the remaining sports | COACH-R3 ATH-01, ATH-03, ATH-04 |
| §3.10 aerobic counts for sports outside his list | "from the sport profile (PROPOSED)" | 0 extra for swimmers, runners, rowers and endurance cyclists; HYROX 4; stay-active activity sessions count (up to 2) | COACH-R3 ATH-01, ATH-03, ATH-04, ATH-05 |
| §3.7.4 10 % total ceiling | strictly below +10 % | strictly below +10 %, but one whole set may always be added in a week (PROPOSED: a small plan could otherwise never climb) | COACH-R3 SES-02 step 4 |
| §3.7.1 start of the stairway | T(1) = the table start | T(1) = the larger of the table start and the week-1 sets; a line the time or the exercise maxima cannot take to its planned peak gets the ceiling it reaches and lands there in the last week | COACH-R3 VOL-04, SES-02 |
| §5 examples | v1.1 runs with check-ins (5.2: holds, repeated week; 11-A: weekly check-ins) | recomputed with no check-ins; 5.5 new | COACH-R3 VOL-02 |
| §3.12 tests | reminders at block start, 7 days before and the day before | no reminders (they need a stored plan); the plan prints the test weeks | COACH-R3 GEN-01 |

---

### 6.4 What v1.3 changes in v1.2 (round 4, CT-01, CX-01..04)

See the table V1 at the top of this file. In one line each: no time-fitting; session size by exercise count; his templates as the skeleton; the 2-day rule; nothing dropped automatically; the planned final sets reached with faster steps when needed; no rate limit and a note above about 15 %; the same sets allowed while reps or load progress; reps and load as a rule the person applies; the next block about 5 % above the last start and never above the top; everything editable.

## 7. Decisions waiting for the coach (PROPOSED - PENDING COACH APPROVAL)

**Settled or retired in v1.3:** item 4 (the time-policy details: retired, CT-01); item 5 (2 × 45 minutes: the 2-day rule, R4-SES-03); item 7 (the next block: R4-PRG-04; only the "blocks completed in a row" input is still PROPOSED); item 8 (the one-set allowance: retired with the 10 % limit); item 12 (the time model: an estimate only); item 16 (ceiling vs step size: the final sets are reached, CX-01, R4-PRG-01); in item 15 the per-session limits 11 / 14 are no longer rules. The v1.3 list of what is still PROPOSED is section V7.

**Settled by round 3 (removed from this list):** the stairway numbers and the λ peak-anchoring (R3-VOL-04); the effort drift (R3-VOL-04); the check-in questions (retired, R3-VOL-02); the life column (retired with the check-in); 'Failed' and "10 lowers the plan" (retired); the repeated week and the block-at-risk prompt (retired); rear delts vs the floor (R3-VOL-01: one shoulders group); the R2-SES-05 grouping (R3-SES-01); calves one exercise × 3 per leg day (R3-SES-01); the R2-VOL-08 placement default (R3-VOL-03); the Pro setting's check-in requirement (gone).

**Still waiting:**
1. **Group credit**: a set counts at most 1.0 to a line or group (a face pull = 1 shoulder set; a press 1.0 shoulders + 0.25 side-delt credit not double counted) (§3.3).
2. **Shoulders start 10 / 12 / 15 counted with group credit** - it gives an L2 bodybuilder about 3-4 direct side-delt sets a week (§5.2); keep it, or keep a minimum side-delt dose inside the shoulders line?
3. **Focus muscles**: default +2 (user 1-3) on start and ceiling, bounded by 18 / 26-28 / 30; the other lines not slowed; the +4 / +6 push only as a coach setting (§3.5).
4. **Time policy details** (§3.10.1): the 10 % "a little longer day" tolerance; the minimum climb (2 whole sets; calves 1); the keep order (pinned and Focus → hips, quads, back, chest → shoulders, calves, triceps, biceps); planning the kept groups from the floor; the offers (another day = the next template up; longer = ceil5 of the peak-week need; block toggles); **the step-2 ceiling clamped to the level ceiling** (v1.2 verification: the prototype let it pass the level ceiling; clamped, 5.1 also leaves biceps to compound credit).
5. **2 × 45 minutes (§5.5)**: with his minimums only one big group plus the pinned calves can be trained directly; is that the answer he wants, or should short plans train big movers once a week at the floor?
6. **Editing mechanism** (§3.10.2): removing an exercise that leaves a group with 1 exercise that day - offer "remove the group from this day" or "keep it anyway".
7. **"Blocks completed in a row"** as the rebuild input for start × 1.05 and ceiling + 1 (nothing is stored), and the same start after a stopped block (§3.12).
8. **The one-set allowance under the 10 % ceiling** (§3.7.4).
9. **The printed self-adjust guide** wording (§3.7.3, §3.6), EN / ES.
10. **Floor of 10 for field athletes' chest, back and shoulders** (raises 7.5 / 6 to 10; §3.4) and **small lines on the same ceilings as big ones** (§3.3).
11. **Pro setting:** L3 only, one priority muscle, up to 35 sets (§3.5).
12. **Time model:** 1-minute changeover per exercise (0.5 in a superset pair) on top of v1's per-set minutes (§3.10).
13. **Calves to 10 a week** with a 4th set or the optional-day 'Calves' slot when there are fewer than 4 leg days (§3.3).
14. **Barbell power / hang-power catches** follow the 3-5-rep rule of the full squat lifts (§3.13).
15. From v1, still open: L3 definition (§3.2); share numbers he did not give (sprinters, strength-type athletes, baseball, combat, beginners, older; the 20-point pain shift; ~70 % contralateral for COD athletes; the bodybuilder upper-body 80-90 %); per-session limits (11 / 14 fractional, max 4 / 5 sets per exercise); glutes credit-only for field athletes; contacts per session caps; the optional-day size of 6; maintenance factors 50 / 60 / 70 % and the base.
16. **Ceiling vs step size** (§3.7.1, v1.2 verification): with steps kept at about 3 % / 5 % (λ ≤ 1), 12-week L2 / L3 shoulders and arms peak at 18 / 23, below their ceilings 22 / 25; keep the steps (ceiling = a maximum), or let λ rise up to 1.4 (late steps up to 7 %) so every trained line reaches its ceiling?

---

## 8. Sources

**Coach and sheets.** `coach_answers_round3.md` (round 3, 2026-10-09; authoritative over rounds 1 and 2), `coach_answers_round2.md` (round 2, 2026-10-08; authoritative over round 1), `coach_answers_full.md` (138 of 140 answers, 2026-10-08), `coach_answers.md`; `synthesis/03_volume_dosing.md`, `03_volume_rules.json`, `generator_spec_v0.json`, `09_generator_inputs.md`; BYOP EFFORT and HOW IT FELT menus (`dumps/BYOP/`, 'MASTER EXERCISE LIBRARY' AX8:AY17). Google Sheets were not opened or changed.

**SCIENCE** (fetched or verified 2026-10-08 unless noted)
- Schoenfeld BJ, Ogborn D, Krieger JW. Dose-response relationship between weekly resistance training volume and increases in muscle mass. J Sports Sci 2017 (online 2016). [PDF](https://paulogentil.com/pdf/Dose-response%20relationship%20between%20weekly%20resistance%20training%20volume%20and%20increases%20in%20muscle%20mass%20-%20A%20systematic%20review%20and%20metaanalysis.pdf)
- Schoenfeld BJ et al. Resistance training volume enhances muscle hypertrophy but not strength in trained men. MSSE 2019;51(1):94-103. [PubMed](https://pubmed.ncbi.nlm.nih.gov/30153194/)
- Baz-Valle E et al. A systematic review of the effects of different resistance training volumes on muscle hypertrophy. J Hum Kinet 2022;81:199-210. [PMC](https://pmc.ncbi.nlm.nih.gov/articles/PMC8884877/)
- Barbalho M et al. Evidence of a ceiling effect for training volume in muscle hypertrophy and strength in trained men - less is more? IJSPP 2020. [record](https://pure.solent.ac.uk/en/publications/evidence-of-a-ceiling-effect-for-training-volume-in-muscle-hypert/)
- Aube D et al. Progressive resistance training volume: effects on muscle thickness, mass, and strength adaptations in resistance-trained individuals. JSCR 2022. [PubMed](https://pubmed.ncbi.nlm.nih.gov/32058362/)
- Pelland JC, Remmert JF, Robinson ZP, Hinson SR, Zourdos MC. The resistance training dose response: meta-regressions exploring the effects of weekly volume and frequency on muscle hypertrophy and strength gains. Sports Med 2026;56(2):481-505, doi 10.1007/s40279-025-02344-w. [record](https://sponet.de/sponet/Record/4097139?lng=en) · [preprint v2 (efficiency tiers, slopes)](https://sportrxiv.org/index.php/server/preprint/view/460)
- Remmert JF, Pelland JC, Robinson ZP et al. Is there too much of a good thing? Meta-regressions of the effect of per-session volume on hypertrophy and strength. SportRxiv preprint. [preprint](https://sportrxiv.org/index.php/server/preprint/view/537)
- Renaissance Periodization: [volume landmarks](https://rpstrength.com/training-volume-landmarks-muscle-growth/), [chest](https://rpstrength.com/chest-training-tips-hypertrophy/), [quads](https://rpstrength.com/quad-training-tips-hypertrophy/), [rear delts](https://rpstrength.com/expert-advice/rear-delt-size-training-tips), [in defense of set increases within the mesocycle](https://rpstrength.com/expert-advice/in-defense-of-set-increases-within-the-hypertrophy-mesocycle); other muscle guides as listed in `03_volume_dosing.md` §12 (fetched 2026-10-07). Secondary summary of the RP app's +1 set/muscle/week and ~50 % deload: [arvo.guru](https://arvo.guru/resources/methods/rp-training). Side-delt figures: [secondary summary](https://mrpotato.substack.com/p/build-big-shoulders).
- Spiering BA et al. Maintaining physical performance: the minimal dose of exercise needed to preserve endurance and strength over time. JSCR 2021;35(5):1449-1458. [PubMed](https://pubmed.ncbi.nlm.nih.gov/33629972/)
- Bickel CS, Cross JM, Bamman MM. Exercise dosing to retain resistance training adaptations in young and older adults. MSSE 2011. [PubMed](https://pubmed.ncbi.nlm.nih.gov/21131862/) · [full text](https://paulogentil.com/pdf/Exercise%20Dosing%20to%20Retain%20Resistance%20Training%20Adaptations%20in%20Young%20and%20Older%20Adults.pdf)
- Enes A et al. Effects of different weekly set progressions on muscular adaptations in trained males. MSSE 2023/2024. [summary](https://www.fisiologiadelejercicio.com/efectos-de-diferentes-progresiones-en-el-aumento-de-series-semanales-en-entrenamiento-de-fuerza/) · companion perceptual paper [J Hum Kinet](https://jhk.termedia.pl/Exploring-the-Dose-Response-Relationship-between-Resistance-Training-Volume-and-Psychophysiological,209051,0,2.html)
- Scarpelli MC et al. Muscle hypertrophy response is affected by previous resistance training volume in trained individuals. JSCR 2022. [PubMed](https://pubmed.ncbi.nlm.nih.gov/32108724/)
- Barsuhn A et al. Training volume increases or maintenance based on previous volume: the effects on muscular adaptations in trained males. J Appl Physiol 2024, doi 10.1152/japplphysiol.00476.2024. [record](https://openrepository.aut.ac.nz/items/87b4d27e-50d0-4dd4-b652-1cf456281ded/full)
- Gabbett TJ. The training-injury prevention paradox. BJSM 2016. [PMC](https://pmc.ncbi.nlm.nih.gov/articles/PMC4789704) · Impellizzeri FM et al. What role do chronic workloads play in the acute to chronic workload ratio? Time to dismiss ACWR. Sports Med 2021. [PDF](https://iris.univr.it/retrieve/e34cfb98-e922-4c2f-aab5-18583ab7e31b/Impellizzeri_What%20Role%20Do%20Chronic%20Workloads%20Play_SportMed_2021.pdf) · Nielsen RO et al. Can GPS be used to detect deleterious progression in training volume among runners? JSCR 2013. [record](https://research.rug.nl/en/publications/can-gps-be-used-to-detect-deleterious-progression-in-training-vol/)
- Helms ER et al. Application of the repetitions in reserve-based RPE scale. SCJ 2016. [record](https://openrepository.aut.ac.nz/items/92cefeac-7c32-44f1-bfbc-f48f4a5dd8cf/full) · Zourdos MC et al. Novel RT-specific RPE scale measuring RIR. JSCR 2016. [record](https://openrepository.aut.ac.nz/items/efef3b25-6701-4fb5-bb82-55fcd2a26027/full)
- Halperin I et al. Accuracy in predicting repetitions to task failure in resistance exercise. 2022. [preprint](https://sportrxiv.org/index.php/server/preprint/view/67)
- Hickmott LM et al. The effect of load and volume autoregulation on muscular strength and hypertrophy. Sports Med Open 2022. [PMC](https://pmc.ncbi.nlm.nih.gov/articles/PMC8762534)
- Bartholomew JB et al. Strength gains after resistance training: the effect of stressful, negative life events. JSCR 2008. [record](https://pure.psu.edu/en/publications/strength-gains-after-resistance-training-the-effect-of-stressful-/) · Stults-Kolehmainen MA et al. Chronic psychological stress impairs recovery of muscular function and somatic sensations over a 96-hour period. JSCR 2014. [PubMed](https://pubmed.ncbi.nlm.nih.gov/24343323/)
- Knowles OE et al. Inadequate sleep and muscle strength: implications for resistance training. J Sci Med Sport 2018. [PubMed](https://pubmed.ncbi.nlm.nih.gov/29422383/)
- Bell L et al. Integrating deloading into strength and physique sports training programmes: an international Delphi consensus approach. Sports Med Open 2023. [record](https://shura.shu.ac.uk/32417/)
- Rogerson D, Bell L et al. Deloading practices in strength and physique sports: a cross-sectional survey. Sports Med Open 2024. [PMC](https://pmc.ncbi.nlm.nih.gov/articles/PMC10948666/)
- Coleman M et al. Gaining more from doing less? The effects of a one-week deload period during supervised resistance training on muscular adaptations. PeerJ 2024. [PeerJ](https://peerj.com/articles/16777)
- Borde R, Hortobágyi T, Granacher U. Dose-response relationships of resistance training in healthy old adults. Sports Med 2015. [PMC](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC4656698/)
- Fragala MS et al. Resistance training for older adults: position statement from the NSCA. JSCR 2019. [PubMed](https://pubmed.ncbi.nlm.nih.gov/31343601/) · [summary](https://www.unm.edu/~lkravitz/Article%20folder/NSCApositionstand.html)
- Liao K et al. Effects of unilateral vs. bilateral resistance training interventions on measures of strength, jump, linear and change of direction speed. Biol Sport 2022;39(3):485-497. [Termedia](https://termedia.pl/Effects-of-unilateral-vs-bilateral-resistance-training-interventions-on-measures-of-strength-jump-linear-and-change-of-direction-speed-a-systematic-review-and-meta-analysis,78,44423,0,1.html)
- Gentil P et al. Single vs. multi-joint resistance exercises: effects on muscle strength and hypertrophy. Asian J Sports Med 2015. [article](https://brieflands.com/articles/asjsm-21609.html)
- Kassiano W et al. Does varying resistance exercises promote superior muscle hypertrophy and strength gains? A systematic review. JSCR 2022. [record](https://lida.sport-iat.de/ta/Record/4077216?lng=en)
- NSCA plyometric program design (CSCS chapter 18 summary). [PT Pioneer](https://www.ptpioneer.com/personal-training/certifications/nsca-cscs/cscs-chapter-18/)
- Fast vs slow stretch-shortening cycle (<250 ms vs >250 ms). [Science for Sport](https://www.scienceforsport.com/stretch-shortening-cycle/) · [UKSCA technical models](https://cdn.uksca.org.uk/assets/pdfs/UkscaIqPdfs/plyometric-technical-models-biomechanical-principles-636806567189424439.pdf) · refined thresholds: [A new approach for classification of SSC: beyond 250 ms](https://www.sponet.de/sponet/Record/4091532?lng=en)
- **Added in v1.1 (research for COACH-R2 VOL-06, "most people train 20-30 sets"; fetched or searched 2026-10-08):**
  - Hackett DA, Johnson NA, Chow CM. Training practices and ergogenic aids used by male bodybuilders. JSCR 2013;27(6):1609-1617. [PubMed](https://pubmed.ncbi.nlm.nih.gov/22990567/) · [PDF](https://paulogentil.com/pdf/Training%20practices%20and%20ergogenic%20aids%20used%20by%20male%20bodybuilders.pdf) · secondary summaries used for the per-muscle figures: [EliteFTS](https://elitefts.com/blogs/training/how-do-bodybuilders-really-eat-and-train) (3-6 sets per exercise 95 %, 4-5 exercises per muscle 74 %), [Burn the Fat](https://burnthefatblog.com/?p=14365) (~4 × 4 ≈ 16 sets; 69 % once a week)
  - Baz-Valle E, Martínez-Gómez S, Gene-Morales J, Jiménez-Martínez P, Alix-Fages C, Santos-Concejero J. Training practices among Spanish natural elite bodybuilders in the pre-contest phase. Sports 2026;14(1):20, doi 10.3390/sports14010020. [record](https://ekoizpen-zientifikoa.ehu.eus/documentos/6996f6498abc0d7df38912e9?lang=fr) · [MDPI](https://www.mdpi.com/2075-4663/14/1/20)
  - Teixeira CVL, Pereira EFM, Evangelista AL et al. Is the weekly sets volume training performed by trained subjects in accordance with training recommendations guidelines for muscle hypertrophy? Motriz 2018;24(2). [SciELO](https://scielo.br/j/motriz/a/mHgY83THKzb4rx46c7p3FGD/?lang=en)
  - Schoenfeld BJ, Grgic J. Evidence-based guidelines for resistance training volume to maximize muscle hypertrophy. Strength Cond J 2018. [record](https://vuir.vu.edu.au/43248/)
  - Pelland et al. 2026 data density above ~30 weekly sets (limited evidence, diminishing returns): [preprint v2](https://sportrxiv.org/index.php/server/preprint/view/460) and the efficiency tiers already cited above

---

## Verification log

- **Coach answers:** `coach_answers_full.md` read in full (CAT-01 … FIX-04, 140 questions; LIB-10 and LIB-12 unanswered) and `coach_answers.md`. Every COACH-ANSWER tag in this file cites the question it comes from.
- **Research:** each SCIENCE claim was fetched or searched on 2026-10-08 (Pelland preprint text and Table 2A/2B, Bickel full text, Bell Delphi full text extracted locally; others from the abstract page or a cited summary, labelled where secondary). RP chest, quads and rear-delt landmarks re-fetched; other RP rows carried from the 2026-10-07 fetch in `03_volume_dosing.md`.
- **Computation:** a reference prototype of sections 3-4 (`vol_engine_v1.py`, `ex1.py`, `ex_all.py`) was run with the team venv (`.venv/bin/python`); output `ex_all_out.txt` and `examples_out.json`, all in the session scratchpad (`/private/tmp/claude-501/.../scratchpad/`). The four examples, the chest/quads add-order traces, the weeks-to-cap table (L1 10 → 14, L2 15 → 22, L3 20 → 25 at 3/5/7 %), the cycle progression (15/22 → 16/23 → 17/24 → 18/25) and the band chart were all produced by those scripts.
- **Prototype findings that changed the rules:** (1) at 4 × 60 min a beginner's week 1 already fills the time, so the superset fallback (ORD-05) was added; (2) hamstrings and glutes stalled once their only exercise hit the per-exercise maximum, so the big-muscle Focus fallback (ORD-11) was added; (3) bonus exercises pushed a push day to 10 exercises, so the exercise-count limit (VOL-08) now applies to bonus and Focus slots; (4) moving sets could not reach 80/20 while unilateral lifts keep 2 sets, so the block-boundary stance swap (PER-02) was added; (5) at 5 % an advanced lifter hits the cap by week 7, so the planned rate became target-seeking (3 % for L3).
- **v1.1 (round 2), 2026-10-08.** `coach_answers_round2.md` read in full first (R2-VOL, R2-SES, R2-ATH, R2-LIB, R2-PER, R2-GEN and the LIB-10 / LIB-12 leftovers), then this file and its JSON, `03_volume_dosing.md` / `03_volume_rules.json` and `11_training_variables.md` / `.json` in full. Every R2-VOL answer, R2-PER-03/04/05/06/07, R2-GEN-01/04/06, R2-SES-01..06, R2-ATH-01..08 and R2-LIB-01/03/04/07 was traced into the rules, the tables, the examples and the JSON (not only the change list above).
- **Prototype v1.1** (`r2_vol/vol_engine_v1_1.py`; v1's `vol_engine_v1.py` untouched): stairway (standard 3 % / 5 %, λ peak-anchoring by bisection), target-tracking bank, check-in step table (effort, completion, pain), non-priority ≤ 3 % applied to planned and check-in steps, the hard 10 % ceiling, new credit map, floor 10, changeover time, R2-SES-05 check (`ses05_violations`), maintenance and deload helpers. Scripts: `stair_tables.py` (§3.7.1 tables), `ex51.py` + `ex12_all.py` (§5), `mk_tables.py` (Markdown tables generated from the JSON outputs, so no number was retyped). Checks run on every example and every week: no planned step above 7 %, no week at or above +10 % total sets (largest +7.4 %), every full-body or athletic day has 2-4 exercises per trained muscle group (0 violations), listed exercises ≤ 14 per field-athlete day, heavy squat and heavy deadlift never on the same day, no deload or maintenance week inside a block.
- **Prototype-driven findings:** (1) with 2-4 exercises per group, a 4-day beginner full body needs ~55-80 minutes (the 60-minute request cannot hold every group twice a week); (2) a muscle trained directly on one day only (triceps in 5.1) stops at the per-session ceiling, so the generator should consolidate it onto 2 days with 2 exercises each when the stairway needs more; (3) the check-in "too easy" bump must also respect the 3 % priority rule (fixed); (4) holds and repeated weeks lower the final peak (chest 26 instead of 28 in 5.2), which is the intended behaviour (the plan does not catch up).
- **Research:** the "20-30 sets" claim was checked with WebSearch / WebFetch (Hackett 2013 abstract and summaries, Baz-Valle 2026 abstract, Teixeira 2018 full text, Pelland 2026 preprint page); figures taken from secondary summaries are labelled as such in §2.11 and §8.
- No Google Sheet was opened or changed. Only the files named in the task were written (12, 03 and 11, Markdown and JSON); scratch work stays in the session scratchpad (`r2_vol/`).

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

## v1.2 computation notes (2026-10-09)

- **Read first:** `coach_answers_round3.md` in full; then this file and its JSON, `03_volume_dosing.md` / `03_volume_rules.json`, `11_training_variables.md` / `.json` and `05_session_architecture.md` / `05_templates.json` in full (the four pairs were updated together to v1.2).
- **Prototype v1.2** (`r3_vol/vol_engine_v1_2.py`, a copy of v1.1 with the round-3 rules; v1.1 untouched): no check-in path; lines = FOCUS headers with one shoulders line; group credit (a set ≤ 1.0 per line or group); groups for the 2-4 rule and the floor (hips = glutes + hamstrings); calves one exercise per leg day (extra calf sets never become a second calf exercise on a leg day); Focus muscles (+F on start and ceiling, bounded by the priority caps); the stairway starts from the week-1 sets; the two-pass run that lands a time- or exercise-limited line on what it reaches; the one-set allowance under the 10 % ceiling. `tvm.py` implements the time-vs-minimums policy (§3.10.1); `ex51_v12.py` + `ex12_v12.py` compute §5; `mk_tables_v12.py` renders every Markdown table in §3.7.1 and §5 from the JSON outputs, so no number was retyped.
- **Checks on every example and week:** no planned step above 7 %; no week at or above +10 % total sets except a single added set (largest rise +6.9 %, example 5.3 week 8); 2-4 exercises per trained group on every day and exactly one calf exercise per leg day (0 violations in 5.1-5.5 and 11's A and B); heavy squat and heavy deadlift never on the same day; no deload or maintenance week inside a block; every trained line climbs at least 2 whole sets (calves 1) over the block.
- **Prototype-driven findings:** (1) with 2-4 exercises per group, a line often starts above its table start in week 1; planning its stairway from the table start would leave it flat for weeks, so the stairway now starts from the week-1 sets; (2) "reaches its ceiling in the last week" needs the ceiling a line can actually reach when the time or its exercise maxima stop it (5.1 triceps, 5.2 quads), hence the two-pass run; (3) a 10 % ceiling on a 10-set week blocks every added set, hence the one-set allowance; (4) in the time policy the hips group must be read with group credit, otherwise 2-day plans try to give glutes and hamstrings 10 sets each; (5) the coach's 2 × 45-minute example holds one big group plus the pinned calves (§5.5).
- No Google Sheet was opened or changed. Only the eight files of this task were written; scratch work stays in the session scratchpad (`r3_vol/`, backups in `r3_vol/backup/`).

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


## v1.3 computation notes and verification log (2026-10-11)

- Read first, in full: `design/ENGINE_V05_PLAN.md`, `coach_answers_round4.md`, `coach_answers_time_2026-10-10.md`, `coach_answers_codex_2026-10-10.md`.
- The stairway table of section V3 was computed with `engine/progression/stairway.mjs` (`planStairway`, rates 3 % to the halfway week and 5 % after, `noteAbove` 0.15, `minWholeSets` 2) and the next-block rows of section V6 with `engine/progression/prescription.mjs` (`nextBlockStart`, 105 / 100). Check: the 12-week L2 big group is 15 → 22 with its last four weeks at 19, 20, 21, 22, his approved example (R3-VOL-04).
- The blocks of sections V2 to V6 are the same text as `BLAZE_CAMP_BRAIN.md` v1.3 §5.4 to §5.6 and §11.4, so the two files cannot drift; "master §" in them points to that file.
- Not changed: sections 1 and 2 (his answers of rounds 1-3 and the research), the v1.2 tables and worked examples (marked as history where v1.3 supersedes them), and the JSON twin.