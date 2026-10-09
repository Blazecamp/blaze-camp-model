# 12 · Volume algorithm v1.1 (research + design)

**What this is.** The weekly-volume engine for the Blaze Camp plan generator: how many hard sets each muscle gets per week, how that number climbs week to week (the **stairway**), where each new set goes, and how the engine learns. It answers the coach's request: *"go find charts that show those averages and match them with my experience"*, *"what has been studied on volume"*, *"what would be the best algorithm for us"* and *"this tool should figure out the percentages"* (COACH-ANSWER VOL-01, UNI-01, VOL-06). The machine-readable twin is `12_volume_algorithm_v1.json` (same folder; the file names keep "v1", the content is v1.1).

**Status.** v1.1, 2026-10-08. Built on the coach's round-1 answers (`coach_answers_full.md`, 138 of 140) and his round-2 answers (`coach_answers_round2.md`). **Authority order: round-2 answers > round-1 answers > everything else** (sheets, science, team decisions). Where he left a gap or asked us to propose, the rule is marked **PROPOSED - PENDING COACH APPROVAL** (short form below: **PROPOSED**).

**Evidence tags (on every rule).**

| Tag | Meaning |
|---|---|
| **COACH-R2 <ID>** | The coach's round-2 answer (question R2-<ID> in `coach_answers_round2.md`, e.g. COACH-R2 VOL-06 = R2-VOL-06; LIB-10 and LIB-12 are the round-1 leftovers answered there). A RIGHT chip with no text makes our proposal his rule; PARTLY or NOT RIGHT means his words define the rule. |
| **COACH-ANSWER <ID>** | The coach's round-1 answer (question ID from `coach_answers_full.md`). A RIGHT chip with no text makes our assumption his rule. |
| **OBSERVED** | Read from his Google Sheets (via the dumps and decode notes). |
| **SCIENCE** | Published research, a practitioner survey or a published coaching reference, cited with a URL (section 8). |
| **INFERRED** | Our reasoning from observed data or from his words. |
| **PROPOSED** | Our design to fill a gap. It needs his OK before it ships. |

**How the numbers were made.** Every worked example in section 5 and every stairway table in section 3.7 was computed by the reference prototype v1.1 (`r2_vol/vol_engine_v1_1.py`, `ex51.py`, `ex12_all.py`, `stair_tables.py`, output `examples_v1_1.json` and `stair_tables.json`, in the session scratchpad; see the verification log). The v1 prototype (`vol_engine_v1.py`) is kept unchanged for the record. Nothing in the coach's Google Sheets was opened or changed.

---

## v1.1 - round 2 applied

Edited in place: every table, rule, example and the JSON twin now carry the round-2 answers; this list says what changed and why.

| # | Change in v1.1 | Coach answer | Where |
|---|---|---|---|
| 1 | **The stairway.** Every plan climbs in weekly steps: small steps in the first half (standard 3 %), slightly bigger after the halfway week (standard 5 %), the hardest weeks last. When a muscle's level cap would be reached early, all its steps are scaled down by one factor λ so the planned peak lands on the cap in the final week. Replaces the 12-week acclimation cap (≤ 3 %), the 8-week "start hard" (start × 1.10, weeks 1-4 ≤ 5 %) and target-seeking. | COACH-R2 PER-03 (NOT RIGHT), PER-04 (PARTLY) | §3.7, §3.12, §4, §5 |
| 2 | **"Start at a 2, end at an 11"** is perceived overall load, not sets: each week shows a level from 2 to 11 that follows the stairway, and the planned effort drifts from 3 RIR to 1 RIR inside his 1-3 RIR band; lifters already at their caps get the "11" from load, intensifiers and a rotating priority muscle. | COACH-R2 PER-05 (RIGHT + words) | §3.7.2 |
| 3 | **Never above 7 %/week planned; 10 % absolute.** Standard steps are 3-5 %; a "too easy" week adds 2 points (max 7 %); the person's total weekly resistance sets must rise by less than 10 %. A hand-set step runs 0-7 % (fixes 03's conflict 4). | COACH-R2 VOL-01; COACH-ANSWER UNI-05 | §3.7.4 |
| 4 | **Check-in step table approved, minus the life column.** Effort mostly 1-6 → the planned step + 2 points (= his +7 % in the late half); effort 7-8 → the planned step (= his +5 % in the late half); effort 9 → hold; any 10 → hold and remove 1 set from that day; under half the sessions → repeat the week. The step is decided from **effort, completion and pain only**: the "life was harder / better" cells are dropped because he wants no lifestyle inputs (**flagged**). | COACH-R2 VOL-01 (RIGHT), GEN-04 (NOT RIGHT) | §3.7.3 |
| 5 | **Retired:** the readiness score R (effort 40 / completion 20 / performance 20 / life 20), the intake "recovery signal" (sleep, stress, physical job), the 3 % default for stressed clients, "7 % only once logs earn it" and the "hold 2 weeks → deload" gate. | COACH-R2 GEN-04, VOL-03, VOL-07 | §3.7.5, §3.14 |
| 6 | **No check-in = no adaptation:** the plan follows its planned stairway ("there is no data to go off of"). | COACH-R2 VOL-03 | §3.7.3, §3.14 |
| 7 | **Effort 10 = "the max I could do, but successful"** (0 RIR), not a fail; an optional separate 'Failed' answer is proposed. '8 - That was perfect' = hit the target the plan gave; '9' = harder than planned. | COACH-R2 VOL-02 (PARTLY) | §3.7.3, §3.14 |
| 8 | **Floor 10 sets a week per trained muscle; small muscles grow by the same idea.** Small-muscle starts L1 **10** (was 8) / L2 12 / L3 15; the level caps 14 / 22 / 25 now apply to every target muscle (small caps were 12 / 18 / 22); priority caps L1 18 / L2 26-28 / L3 30 approved; every cap is customizable; an optional **Pro** setting may let one priority muscle pass 30 (numbers PROPOSED). | COACH-R2 VOL-04, VOL-06 | §3.3, §3.5 |
| 9 | **"Most people train 20-30 sets per muscle per week"**: researched (surveys of bodybuilders and gym-goers, dose-response meta-analyses, RP landmarks) and placed next to his statement. | COACH-R2 VOL-06 | §2.11 |
| 10 | **Rear delts:** own sets 4 / 6 / 8 approved. Reconciled with the floor of 10 by reading the floor on his SHOULDERS/TRAPS muscle group (rear + side delt work together) - INFERRED and **flagged** for round 3. | COACH-R2 VOL-04, VOL-06 | §3.3 |
| 11 | **Glute credit:** squats, lunges, deadlifts and RDLs give glutes **0.25** (hinges were 0.5 PROPOSED); hip thrusts and bridges 1.0; **KB swings are ballistic and never count as glute volume**; thruster = 1.0 quads + 0.5 shoulders + 0.25 glutes. | COACH-R2 VOL-05 | §3.1 |
| 12 | **No deload or maintenance week inside a block.** A block is completed; the deload (about half of the hardest week, same exercises, 3+ RIR) sits only between blocks. A block that cannot be completed is cancelled → maintenance phase (length chosen, extendable) → at its end the app asks: keep maintaining / change the plan / start a training block. Triggered mid-block deloads are retired. | COACH-R2 VOL-07, PER-06 | §3.12 |
| 13 | **R2-VOL-08 was not understood:** the default stays (alternate the first exercise between the two weekly exposures; bonus exercise on the optional day; with no optional day, on a day that already trains that muscle group) and is marked for a simpler re-ask. | COACH-R2 VOL-08 (not understood) | §3.9 |
| 14 | **Full-body days: 2-4 exercises per muscle group that day, never 1.** Full-body days grow to 7-10 resistance exercises and 55-80 minutes; the time model adds a 1-minute changeover per exercise; the capacity table and every example were recomputed. | COACH-R2 SES-05 (PARTLY) | §3.10, §5 |
| 15 | **Cardio count is adjustable** up or down by the user; aesthetics clients 4 (Orange, Green, Blue + a second Orange) plus optional 20-30-minute walks; athletes by sport off-season. | COACH-R2 SES-06, ATH-06 | §3.10 |
| 16 | **Session rules:** heavy squat and heavy deadlift on two different days, non-axial alternatives on the other days, the counted list of axial lifts; light core opener (2 exercises × 2 sets short of failure) with optional core supersets or monster sets anywhere; field athletes 12 exercises + the 2-exercise core block; athletic-template slots default to 2 sets (03's conflict 1); exercises by session length 45 ≈ 5, 60 ≈ 6-7, 75-90 ≈ 8-9 (03's conflict 6). | COACH-R2 SES-01..04; COACH-ANSWER VOL-08, VOL-16 | §3.9, §3.10 |
| 17 | **Athletic budget:** plyo:ballistic shares by sport approved (end of block; each block starts 15 points more ballistic; share counted over jump **and** throw work); ballistic vs plyometric lists; "Receive-Create stages" (1 Land, 2 Land & Go, 3 Repeat) with their week timing; Olympic lifts up to 4 times a week (cleans on squat-pattern days, snatches on hinge days); full squat cleans/snatches 3-5 reps with the same weekly reps; % only when tested (RPE otherwise); in-season reductions for game-heavy sports; older adults (60+) no Olympic lifts, plyos or depth jumps by default (optional with a warning); youth Olympic lifts from the floor from about 14 after a hang block; intermediates get the full Olympic scope (11's I14). | COACH-R2 ATH-01..08, GEN-06 | §3.13 |
| 18 | **Pre-season** = a 4-6-week block at about 60 % of off-season sets with more speed and power, then a 1-2-week taper; **maintenance** length is chosen and extendable. | COACH-R2 PER-06 | §3.4, §3.12 |
| 19 | **Year plan** = gen-pop "stay in shape" planning, fully tunable by the user (re-order blocks, more or less cardio, a winter powerlifting-style block; own calendar and holiday weeks). | COACH-R2 PER-01, PER-02 | §3.12 |
| 20 | **Tests** before the block (or in week 1) and at the end, never mid-block; untrained people never test a 1RM or a max mile from zero (5RM / 3RM or 80-90 % submax efforts). | COACH-R2 PER-07 | §3.12 |
| 21 | **Next block** after a completed block: start × 1.05, cap + 1 (max 25 non-priority / 30 priority) approved; after a cancelled block: the same start (PROPOSED). | COACH-R2 VOL-06 | §3.12 |
| 22 | **"Stay athletic and active" gen-pop path** (pickleball, HYROX for fitness and similar, from the coach's request of 2026-10-08): uses the general-fitness volume factors and the floor of 10; its athletic work comes from the 04 sport profiles. | coach request 2026-10-08; numbers PROPOSED | §3.4 |
| 23 | **Inconsistencies flagged by 03 and 11 fixed here:** priority add +4 (L1-L2) / +6 (L3) everywhere (I10); factor results round half up (I11); intermediates get the full Olympic scope (I14); the bodybuilder upper-body share is PROPOSED, not his number (I15); 8-9 exercises at 75-90 min is his VOL-08 answer (I16); hand-set step 0-7 % and RIR stays 1-3 (03 conflicts 2 and 4). | COACH-ANSWER VOL-02, ATH-10, UNI-03, VOL-08, UNI-05, VOL-13 | §3.3, §3.5, §3.10, §3.11, §3.13 |
| 24 | **Worked examples 5.1-5.4 recomputed** with the v1.1 prototype: L1 full-body 12 weeks with no check-in; L2 chest-priority split with check-ins (holds, a repeated week, a "10", a pain swap); tennis 8 weeks; the maintenance flow. | all of the above | §5 |

**Flags for the master file and round 3 (not decided here):** (a) the life column of R2-VOL-01 vs R2-GEN-04 (resolved by dropping the column, item 4); (b) rear-delt 4 / 6 / 8 vs "nobody needs less than 10" (item 10); (c) R2-VOL-08 needs a plain re-ask with an example (item 13); (d) the planned effort drift 3 → 1 RIR inside the 1-3 RIR band vs VOL-13's "no planned RIR ramp" (item 2); (e) the floor of 10 lifts field athletes' chest and back from 7.5 to 10 (§3.4).

---

## 0. The algorithm on one page

| # | Rule | Tag |
|---|---|---|
| 1 | Count **weekly hard sets per muscle**. Main mover = 1.0 set; helpers = **0.25**; squats, lunges, deadlifts and RDLs give glutes 0.25; hip thrusts and bridges 1.0 glutes; dips = 0.5 triceps + 0.5 chest; thruster = 1.0 quads + 0.5 shoulders + 0.25 glutes. A **10/10** unilateral set = **1 set**. Plyos, ballistics (KB swings included), throws, Olympic lifts, sprints and change of direction **never** count toward muscles. | COACH-ANSWER VOL-09, LIB-16, UNI-01, VOL-10; COACH-R2 VOL-05 |
| 2 | **Starting weekly sets:** big muscles beginner **10-12**, intermediate **15-20**, advanced **20+** (engine 10 / 15 / 20); small muscles **10 / 12 / 15**; rear delts 4 / 6 / 8 own sets; **nobody below 10 sets a week per trained muscle**. 15-20 = maintenance to some growth, 20-25 = growth; most trained people end up around 20-30 (§2.11). | COACH-ANSWER VOL-01, UNI-01; COACH-R2 VOL-04, VOL-06 |
| 3 | **Caps per 12-week plan:** 14 / 22 / 25 by level for every target muscle; priority 18 / 26-28 / 30; all customizable; above 30 only through an optional Pro setting for a very advanced, determined person (PROPOSED). | COACH-R2 VOL-06 |
| 4 | **Priority muscle:** +4 to +6 sets on the start (PROPOSED split +4 at L1-L2, +6 at L3), 1-2 at a time; the other muscles grow at most 3 % a week while it runs. | COACH-ANSWER VOL-02; COACH-R2 VOL-06 |
| 5 | **Pain:** that muscle or pattern -30 to -50 %, constrained machines or split grips, or drop the exercise. | COACH-ANSWER VOL-03, UNI-08, EQ-03 |
| 6 | **The stairway:** every plan climbs week by week; standard step 3 % of each muscle's weekly sets in the first half, 5 % after the halfway week; scaled by λ so the planned peak lands on the cap in the final week; display level 2 → 11. Never above 7 % planned; total weekly resistance sets strictly below +10 %. | COACH-R2 PER-03, PER-04, PER-05, VOL-01; COACH-ANSWER UNI-05; numbers PROPOSED |
| 7 | **Check-in (optional):** effort mostly 1-6 → step + 2 points; 7-8 → the planned step; 9 → hold; any 10 → hold and -1 set that day; under half the sessions → repeat the week; pain → pain protocol. Effort, completion and pain only. **No check-in → the planned stairway.** | COACH-R2 VOL-01, VOL-02, VOL-03, GEN-04 |
| 8 | **Rounding:** the bank = planned target - current sets; a whole set is added when it reaches 1. | COACH-ANSWER VOL-06 |
| 9 | **Where a new set goes:** the first exercise for that muscle in the day's order, then the next (2/2/2 → 3/2/2 → 3/3/2 → 3/3/3 → 4/3/3); days alternate; the bilateral:unilateral target picks the group first. No room → bonus exercise (small muscle) or Focus slot (big muscle), on the optional day first. | COACH-ANSWER VOL-07, ORD-10, ORD-11; COACH-R2 VOL-08 default |
| 10 | **Sessions:** split days 3-4 exercises per muscle group; **full-body days 2-4 per muscle group, never 1**; resistance sessions ≈ 5 / 6-7 / 8-9 exercises at 45 / 60 / 75-90 min; field athletes up to 12 + the 2-exercise core block; light core opener (2 × 2); heavy squat and heavy deadlift on different days. | COACH-ANSWER VOL-07, VOL-08; COACH-R2 SES-01..05 |
| 11 | **Bilateral:unilateral share** from 90/10 to 10/90 by athlete, goal, phase and pain. | COACH-ANSWER UNI-02, UNI-03, UNI-10, CAT-13 |
| 12 | **Blocks:** no deload or maintenance week inside a block; deload (half of the hardest week) or a maintenance phase only between blocks; a block that cannot be completed is cancelled → maintenance → new block; next block start × 1.05, cap + 1. Pre-season 4-6 weeks at ~60 % + taper. Tests before and at the end only. | COACH-R2 VOL-07, PER-06, PER-07, VOL-06 |
| 13 | **Athletic budget:** contacts, throws, sprints, cuts and Olympic reps in their own units; plyo share by sport (approved), Receive-Create stages, Olympic lifts up to 4 × a week. | COACH-ANSWER VOL-10; COACH-R2 ATH-01..05 |
| 14 | **Learning:** logs EFFORT (10 = successful max), HOW IT FELT, DONE, WEIGHT/SCORE; tunes each person's step scale and cap first, then the population tables, always inside fixed guardrails and with coach approval. No lifestyle inputs. | COACH-ANSWER VOL-01, GEN-05; COACH-R2 GEN-01, GEN-04; method PROPOSED |

**What v1 retired (COACH-ANSWER VOL-05)** stays retired: every "big muscle = 3 %, medium = 5 %, small = 7 %" mapping in `03_volume_dosing.md` §9.6, `03_volume_rules.json > generator_rules.progression`, `generator_spec_v0.json > rule_tables.muscles.list[*].rate`, `> rule_tables.muscles.focus_rule` and `> progression.engine.rates`. **What v1.1 retires (round 2):** the readiness score and its life input, the intake recovery signal, target-seeking, acclimation and 8-week phase caps, the 8-week × 1.10 start, triggered mid-block deloads, hinge glute credit 0.5, KB-swing glute credit, small-muscle start 8 and small caps 12 / 18 / 22. Full lists in section 6.

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
- Start: beginner 10-12, intermediate 15-20, advanced 20+ ("sounds about right"); the tool should learn from everyone's data. (COACH-ANSWER VOL-01)
- 15-20 sets is "a good foundation for maintenance to a little bit of growth", 20-25 "a good growth foundation"; 40 sets of chest is "way too much", 5 "too little". (COACH-ANSWER UNI-01)
- Priority: +4 to +6, cap about 25-30. (COACH-ANSWER VOL-02, PARTLY: "that's the idea... we'll collect data")
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
- Week-by-week mode with no fixed length; yearly mode with quarter themes and automatic maintenance over the holidays.
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
- Adjust week to week from logged EFFORT and HOW IT FELT: RIGHT. But for the output he is unsure whether people should track inside the tool ("They should be tracking it themselves"). (→ R2: settled - the plan works with no tracking, the weekly check-in is optional, COACH-R2 GEN-01; no check-in = no adaptation, VOL-03.)
- Coaches can add their own rules.

### Round 2 (`coach_answers_round2.md`, 2026-10-08): what changed the engine

Quotes are short; the full text is in `coach_answers_round2.md`. Round 2 wins over round 1 where they differ.

**Counting**
- Glutes: compounds that include glutes count "a quarter" (squats, lunges, deadlifts, RDLs = 0.25); hip thrusts and bridges 1 set; **"kettlebell swings are not glutes ... mostly supposed to be used for the ballistic movements, not for resistance training"**; thruster = 1 set quads, half a set shoulders, a quarter set glutes ("that's good math"). (COACH-R2 VOL-05)

**How much**
- Small muscles at 8 / 12 / 15 = RIGHT, "but 8 sets a week is probably just barely maintenance ... the little muscles also grow the same idea". (COACH-R2 VOL-04)
- Caps 14 / 22 / 25, priority 18 / 26-28 / 30, others ≤ 3 % while a priority runs, next cycle +5 % and cap + 1 = RIGHT, "but this is all customizable. **I don't think anybody needs less than 10 sets a week per muscle** ... More than 30 sets per week of a muscle group should probably be for a very advanced person. Maybe we can add a pro level ... I think most people train around that: 20 to 30 sets per muscle per week. I believe so, but you can do some research." (COACH-R2 VOL-06)
- Rear delts 4 / 6 / 8 own sets = part of the approved VOL-04 proposal. (COACH-R2 VOL-04)

**How it moves**
- The step table by effort (3 / 5 / 7 %, hold, -1 set, repeat the week under half the sessions) = RIGHT. (COACH-R2 VOL-01)
- But lifestyle inputs = NOT RIGHT: "I just need the workouts here. There's no need to talk about sleep or stress or anything else." (COACH-R2 GEN-04)
- Effort 10 = "That was the max I can do, not a fail ... I gave it all I had, but it was successful"; a 'fail' can be added. (COACH-R2 VOL-02, PARTLY)
- No check-in: "the plan doesn't change. There is no data to go off of." (COACH-R2 VOL-03)
- Every plan is a stairway: "In the beginning, the first 2, 3, 4 weeks, the steps are a little bit smaller ... When they get to that halfway point and upwards, the steps get a little bit higher, but not too much ... that goes for every plan." (COACH-R2 PER-03, NOT RIGHT on 4 + 4 and "start hard")
- 12 weeks: "the last 4 weeks are going to be brutal ... week by week, it just gets gradually worse. I mean worse, meaning better, more volume." (COACH-R2 PER-04, PARTLY)
- "Start at a 2 and end at an 11" = "the amount of volume that they're putting themselves at as far as level, not the amount of sets ... The last week might feel like an 11 ... pushed yourself a little bit past your limits." (COACH-R2 PER-05)
- Deload = half of the hardest week (RIGHT), but "It should never be thrown in the middle of a block ... If they can't complete it, they should cancel the block and start a maintenance phase ... then start a whole new block." (COACH-R2 VOL-07)
- R2-VOL-08 (where a new set and a bonus exercise go when a day repeats): "I don't understand this question." (COACH-R2 VOL-08)

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

**Product inputs** (COACH-R2 GEN-01, GEN-05, GEN-06): optional check-in, the plan works with no tracking; season start date and practice/game days for competitive athletes; weight guidance by RIR/RPE, Olympic lifts explained as power output, % only for tested or competitive lifters.

**New request (2026-10-08, relayed by the session):** every popular US sport must be covered (swimming included), and gen-pop clients who "want to stay athletic and active" (pickleball, "high rows" - read as HYROX) need a path. The sport profiles are being written in `04_athlete_profiles` / `synthesis/sports/`; this engine gives that path its volume rules (§3.4).

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

**Counting difference to keep in mind.** Pelland counted indirect sets at 0.5; the coach counts helpers at 0.25 (COACH-ANSWER VOL-09). For chest, quads, hamstrings and back (mostly direct work) both counts are almost the same. For glutes, triceps, biceps and the delts the coach's count is lower than Pelland's for the same program. The engine stores **both** counts so the data can later show which predicts results better (section 3.14).

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

**What this means for 3/5/7 %.** At 15-20 sets, 3 % adds ~0.5 set/week, 5 % ~0.8, 7 % ~1.1, i.e. RP's "about one set per week" at the top end. Big jumps (+30-60 %, or +4-6 sets every 2 weeks from 22) add strain without reliably adding growth. A 3-7 % step with a 10 % ceiling is a conservative, defensible design; the v1.1 stairway's standard steps (3 % then 5 %) and their λ-scaled versions sit at or below RP's ~1 set a week. (INFERRED from the above)

**The 10 % question in other sports.** In team sports, week-to-week load jumps above ~10-15 % have been linked to more injuries (Gabbett 2016, the acute:chronic workload model), but that model has been heavily criticised as a statistical artefact (Impellizzeri et al. 2021). In runners the "10 % rule" is weakly supported: injured runners in one cohort had ~32 % average weekly increases vs ~22 % in healthy runners, a difference that was not statistically significant (Nielsen et al. 2013). So 10 % is a sensible **ceiling**, not a target. (SCIENCE)

### 2.6 Readiness and autoregulation (choosing 3, 5 or 7 %)

- **RIR scale:** reps in reserve map to RPE (RPE 8 = 2 RIR, RPE 9 = 1 RIR). (Helms et al. 2016; Zourdos et al. 2016; SCIENCE)
- **People misjudge RIR by about one rep** (they think they have fewer reps left than they do); accuracy improves near failure and in sets under ~12 reps. (Halperin et al. 2022; SCIENCE) → use effort as a **trend**, not a single-set truth.
- **Autoregulated loading (RPE/RIR or bar speed) works as well as percentage-based loading** for strength (meta-analysis, 1RM difference 2.07 kg, not significant). (Hickmott et al. 2022; SCIENCE)
- **Life stress slows progress:** in 135 students over 12 weeks, high-stress lifters gained less bench and squat strength (Bartholomew et al. 2008); chronic stress slowed muscle recovery over 96 h (Stults-Kolehmainen et al. 2014). (SCIENCE)
- **Sleep:** several nights of short sleep lower force on multi-joint lifts (Knowles et al. 2018). (SCIENCE)

→ The coach's "it depends on how tired they are and what's going on in their life" (UNI-05, VOL-05) has direct research support, and v1's readiness score used exactly these inputs. **v1.1:** he does not want lifestyle questions ("I just need the workouts here", COACH-R2 GEN-04), so sleep and stress stay here as background only; the weekly step is decided from effort, completion and pain (§3.7.3). A hard week still shows up as higher effort or fewer sessions done.

### 2.7 Deloads

- **Bell et al. (Sports Med Open 2023), Delphi consensus of strength and physique coaches:** the consensus defines a deload as a planned period of lower training stress that clears physical and mental fatigue, helps recovery and prepares for the next block. Full agreement that deloads cut **sets** and **proximity to failure**; 95 % agreed a deload can sit in the **last week** of a block, 75 % in the **first week of the next block**; it can be pre-planned or autoregulated; keep the main multi-joint lifts. (SCIENCE)
- **Survey of 246 strength and physique athletes (Rogerson, Bell et al. 2024):** deload every **5.6 ± 2.3 weeks**, lasting **6.4 ± 1.7 days**; 79 % cut sets; most also cut effort; 47 % pre-plan, 39 % mix planned and reactive. (SCIENCE)
- **Coleman et al. (PeerJ 2024):** a full week off at the middle of a 9-week program did not change muscle growth but slightly reduced strength gains. (SCIENCE)

→ His "about half the sets, lighter" (PER-05) is in the middle of practice. Round 2 settles the timing: **never inside a block**, only between blocks (COACH-R2 VOL-07); the Delphi panel's agreement that a deload can sit in the last week of a block or the first week of the next one fits that. v1's triggered mid-block deloads are retired (§3.12).

### 2.8 Older adults

- **Borde, Hortobágyi, Granacher (Sports Med 2015), 25 trials, age 65+:** best strength results with 2-3 sets per exercise, 7-9 reps, 70-79 % 1RM, 2 sessions/week; none of the volume variables predicted changes in muscle size. (SCIENCE)
- **NSCA position statement (Fragala et al. 2019):** 2-3 sets per major muscle group, 2-3 days/week, start from single sets and progress individually; power work at 40-60 % 1RM; 2 min rest. (SCIENCE)
- **Bickel 2011:** older adults need more weekly sets than younger adults to keep size. (SCIENCE)
- **Plyometrics for masters athletes:** 3-4 days between plyo sessions (NSCA guidance as summarised for the CSCS exam). (SCIENCE)

→ Fits the coach: older clients go to constrained machines for extra volume (EQ-03); round 2 tightened his "few plyos unless they ask" (ATH-09) to **no Olympic lifts, plyos or depth jumps by default**, available as an option with a warning to work with a fitness professional (COACH-R2 ATH-08; §3.4, §3.13).

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
- **Engine consequence:** no number changes. L2-L3 12-week stairways finish at 22-25 sets for non-priority muscles and 26-30 for a priority (§3.7.1), inside his 20-30; L1 plans stay 10-14; the floor is 10 (COACH-R2 VOL-06). The data the tool collects (§3.14) will show where real users sit.

---

## 3. The engine v1.1

### 3.1 Counting units

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
| Face pull (cable or KB) | rear delts | - | side delts | COACH-R2 LIB-04, LIB-10 ("shoulder work": side/rear delts/traps, on pull or shoulder days); split PROPOSED |
| Chest fly, side raise (and upright row), rear-delt fly, curls, triceps isolation, calf raise | the target muscle | - | forearms 0.25 on curls | COACH-ANSWER VOL-09, LIB-16 assumption |
| Core (thorax / pelvis) | abs/obliques | - | - | COACH-ANSWER CAT-08 |
| Plyo, ballistic (**KB swing included**), throw, Olympic, sprint, change of direction | **none** (own budget, §3.13) | | | COACH-ANSWER VOL-10; COACH-R2 VOL-05 ("kettlebell swings are not glutes") |

**Other counting rules**
- **10/10 = one set** for the muscle (each side does one set). Alternating = unilateral. (COACH-ANSWER UNI-01, UNI-07)
- **Unilateral sets cost more time** (both sides): 1.5 × a bilateral set in the time model. (COACH-ANSWER UNI-09; factor PROPOSED)
- **MYO set** = 2 hard sets (INFERRED; only on the last machine or isolation exercise, COACH-ANSWER VOL-15).
- **Hard set** = a working set at 1-3 RIR (COACH-ANSWER VOL-13). Warm-up sets and A-drills never count (ORD-08); core sets in the light opener count toward abs (COACH-R2 SES-03 approved the 2 × 2 opener).
- The engine steers on the **coach count (helpers 0.25)** and stores the **Pelland count (indirect 0.5)** for research comparison. (PROPOSED)
- **What the glute change does:** with every compound at 0.25, a physique plan reaches its glute start only with direct glute work (hip thrust family or Focus slots); examples 5.1 and 5.2 carry two glute exercises on one hip day (§5).

### 3.2 Levels (client volume level, separate from exercise difficulty)

| Level | Who | Tag |
|---|---|---|
| **L1** (novice / "newby", the same thing) | Under about 6-12 months of consistent training, **or** more than 6-12 months off (body treated as a beginner; exercise level can stay higher because skills return fast). Ex-pros: L1 for one short block only, then up. | COACH-ANSWER PRG-05, CAT-06 |
| **L2** (intermediate) | Consistent training for more than 1 year. | COACH-ANSWER PRG-05 |
| **L3** (advanced) | 3+ years of consistent training **and** currently training 4+ days/week, or a competitive physique/strength athlete. | PROPOSED (he did not define advanced) |
| **Pro setting** (optional, not a level) | L3 only, chosen by the coach (or a client who is "really adamant about growing that muscle"); lets **one** priority muscle pass 30 sets, up to 35 (PROPOSED number); other muscles held at ≤ 3 %/week; needs the weekly check-in; shows a warning. | COACH-R2 VOL-06 ("maybe we can add a pro level"); numbers PROPOSED |
| Level up | At the end of a block, when the client's logs show mostly "8 - That was perfect" or easier with no pain. | COACH-ANSWER PER-06 |

The old L4 is retired: competition level now changes the **athlete profile** (sport, position, season), not the volume level. (COACH-ANSWER PRG-05)

### 3.3 Starting weekly sets per muscle (aesthetics / hypertrophy goal; coach count)

"Fill policy" says what the engine does when a muscle is below its start: **target** = add direct sets; **credit** = count helper credit only, no direct slot unless it is a priority or the sport needs it; **floor** = indirect only, report it, never add; **core block** = set by the session count.

| Muscle | Class (CAT-02) | Fill policy | L1 start | L2 start | L3 start | Level cap L1 / L2 / L3 | Priority start / cap L1 / L2 / L3 | RP intermediate direct (MEV / MAV / MRV) |
|---|---|---|---|---|---|---|---|---|
| Quads | big | target | **10** | **15** | **20** | 14 / 22 / 25 | +4 / +4 / +6; 18 / 26 / 30 | 4-6 / 6-14 / 14-18 |
| Hamstrings (hinge + leg flexion) | big | target | **10** | **15** | **20** | 14 / 22 / 25 | same | 2-4 / 2-8 / 8-14 |
| Glutes | big | target (field athletes: credit) | **10** | **15** | **20** | 14 / 22 / 25 | same | 6-8 / 8-24 / 24-30 |
| Chest | big | target | **10** | **15** | **20** | 14 / 22 / 25 | +4 / +4 / +6; 18 / 26-28 / 30 | 4-6 / 6-16 / 16-24 |
| Lats / upper back | big | target | **10** | **15** | **20** | 14 / 22 / 25 | +4 / +4 / +6; 18 / 26 / 30 | ~10 / - / ~20-25 |
| Side delts | small | target (field athletes: credit) | **10** | **12** | **15** | 14 / 22 / 25 | +4 / +4 / +6; 18 / 26 / 30 | 8 / 16-22 / 26+ |
| Biceps | small | target (field athletes: credit) | **10** | **12** | **15** | 14 / 22 / 25 | same | 8-10 / 14-20 / 20-26 |
| Triceps | small | target (field athletes: credit) | **10** | **12** | **15** | 14 / 22 / 25 | same | 4-6 / 6-16 / 16-20 |
| Calves | small | target | **3 per leg day, at least 10 a week** | same | 3-4 per leg day, at least 10 | 14 / 22 / 25 | +4; 18 / 26 / 30 | 4-6 / 6-16 / 16-24 |
| Rear delts | small | target (own sets) | **4** own | **6** own | **8** own | 8 / 12 / 16 | +4; 12 / 16 / 20 | 0-4 / 4-12 / 12-20 |
| Abs / obliques | small | core block | 2 exercises × 2 sets per session, first, short of failure | same | same | 16 / 20 / 20 | - | 0-4 / 4-12 / 12-20 |
| Front delts | unplaced | floor | indirect | indirect | indirect | - | direct slot only if chosen | 0-2 / 4-8 / 8-12 |
| Traps, forearms, adductors, neck | unplaced / small | floor | indirect | indirect | indirect | - | direct slot only if chosen | - |

Tags: big-muscle starts **COACH-ANSWER VOL-01**; small-muscle starts 12 / 15 and rear delts 4 / 6 / 8 **COACH-R2 VOL-04 (RIGHT)**; small L1 start 10 (instead of 8) and the floor of 10 **COACH-R2 VOL-04, VOL-06** ("8 sets ... barely maintenance"; "I don't think anybody needs less than 10"); caps 14 / 22 / 25 and priority 18 / 26-28 / 30 **COACH-R2 VOL-06 (RIGHT; "all customizable")**; small muscles on the same caps as big ones **INFERRED** from "the little muscles also grow the same idea" (VOL-04) and VOL-06 giving one cap per level (v1 small caps 12 / 18 / 22 retired); calves 3 per leg day **COACH-ANSWER VOL-17**; core opener **COACH-R2 SES-03**; priority add +4 to +6 **COACH-ANSWER VOL-02**, split by level PROPOSED (now the same everywhere, fixing 11's I10); the L3 start of 20 as the low end of "20+" PROPOSED; rear-delt and calf caps PROPOSED.

**The floor of 10 (COACH-R2 VOL-06).** Every **target** muscle starts at 10 or more in any training block, after the goal and phase factors (§3.4). Not floored: maintenance phases, pre-season and in-season blocks (they are maintenance by the coach's own definition, PER-01, R2-PER-06), a pain-reduced muscle (VOL-03 wins), credit-only muscles of field athletes (UNI-02), and floor muscles. Calves reach 10 by 3 sets per leg day plus a fourth set (or the optional-day 'Calves' slot) when there are fewer than 4 leg days (PROPOSED). Abs reach 10+ through the core opener at 3+ sessions a week.

**Rear delts vs the floor (flagged).** He approved 4 / 6 / 8 rear-delt sets of their own (COACH-R2 VOL-04) and also said nobody needs less than 10 per muscle (VOL-06). v1.1 keeps 4 / 6 / 8 direct sets and checks the floor on his **SHOULDERS/TRAPS** muscle group (his FOCUS header joins the delts): side-delt work (10 / 12 / 15) plus rear-delt work plus face pulls is well above 10 (INFERRED). Rows also give rear delts 0.25 a set, so their own count reaches 5-7 at L1. Round 3 should ask whether rear delts need their own 10.

**Why small muscles start below big ones at L2-L3 (COACH-R2 VOL-04, RIGHT).** It fits the session time, and arms and delts also grow from presses and rows (Gentil et al. 2015; SCIENCE). At L1 the floor lifts them to the big-muscle start (10).

### 3.4 Goal, phase and population modifiers (multiply the start values; then the floor of 10)

Factor results round half up (11's I11, PROPOSED).

| Situation | Lower body | Upper body | Small muscles | Rate / notes | Tag |
|---|---|---|---|---|---|
| Aesthetics / bodybuilding / hypertrophy | 1.0 | 1.0 | 1.0 | same-pattern pairing allowed (squat + lunge); 4 aerobic sessions, adjustable | COACH-ANSWER VOL-01, UNI-06; COACH-R2 SES-06 |
| Strength / powerlifting | 1.0 | 1.0 | 0.75, then floor 10 | weekly sets stay similar; preference moves the **reps** on big lifts; 2 easy (Orange) aerobic sessions | COACH-ANSWER VOL-12; COACH-R2 ATH-06; small factor PROPOSED |
| General fitness, weekend-warrior athletic, **"stay athletic and active"** (recreational pickleball, HYROX for fitness, rec leagues and similar) | 0.8 | 0.8 | 0.8, then floor 10 | 45-60 min (longer on full-body days, §3.10); cross-pattern pairing; athletic work from the 04 profile of the activity | COACH-ANSWER UNI-09, UNI-06, ATH-13; coach request 2026-10-08; factor PROPOSED |
| Bootcamp | circuits 3-5 rounds × 30-50 s, 5-7 stations, 35-45 min | | | not set-based | COACH-ANSWER PRG-03 |
| Fat loss | 0.8 | 0.8 | 0.8, then floor 10 | + 3 aerobic sessions/week, adjustable | COACH-ANSWER ATH-07; COACH-R2 SES-06; factor PROPOSED |
| Field/court athlete, off-season | 0.7 | 0.5, **then floor 10** | credit only (side delts, arms, glutes) | resistance is 3-4 exercises after core, plyo and Olympic work; the floor lifts chest and back from 7.5 to 10 at L2 (flagged) | COACH-ANSWER VOL-08, VOL-17, UNI-02; COACH-R2 VOL-06; factors PROPOSED |
| Strength-type athlete off-season (linemen, wrestlers, rugby, throwers, heavyweight fighters) | 0.9 | 0.8 | 0.6, then floor 10 | | COACH-ANSWER ATH-03; factors PROPOSED |
| Athlete pre-season | about **0.6 of the off-season sets** | | credit | 4-6 weeks, more speed and power, 1-2-week taper before the first game; no floor (maintenance) | COACH-R2 PER-06 (RIGHT) |
| Athlete in-season | 0.4-0.5 | 0.3-0.4 | credit | 2 days/week, flat (no stairway); game-heavy sports (basketball, volleyball, soccer, football, hockey): gym plyos about half, no extra change of direction, sprints only for speed athletes, the one hard gym day at least 48 h before a game | COACH-ANSWER PER-08, UNI-10; COACH-R2 ATH-07; factors PROPOSED |
| Boxer / striker in high-punching weeks | as profile | pressing × 0.5-0.7 | arms × 0.5-0.7 | reduce, never cut to zero | COACH-ANSWER ATH-04; factor PROPOSED |
| Older adult (60+) | as goal | as goal | as goal | stairway steps capped at 3 % (PROPOSED; age is a training input, not a lifestyle input); extra volume on constrained machines; **no Olympic lifts, plyos or depth jumps by default**, available as an option with the warning "make sure you have a fitness professional to help you understand what this means" | COACH-ANSWER EQ-03, EQ-04; COACH-R2 ATH-08; SCIENCE (Borde, Fragala, Bickel) |
| Youth | as goal | as goal | as goal | Olympic lifts from the floor from about 14, after one block of hang work | COACH-R2 ATH-08 |
| No sex-based rules | - | - | - | age, foundation, goal and injuries decide | COACH-ANSWER ATH-09, GEN-02 |

### 3.5 Priority muscles

1. One or two at a time; start = level start + 4 (L1-L2) or + 6 (L3); caps L1 18, L2 26-28, L3 30. (COACH-ANSWER VOL-02; caps COACH-R2 VOL-06; split by level PROPOSED)
2. The priority muscle's exercise goes **first** in its session (small priority muscles included). (COACH-ANSWER ORD-04)
3. Delivery order for the extra sets: its own exercises (VOL-07 order) → Focus 1 / Focus 2 slots on the optional day (both may hit the same muscle, 2-3 sets each) → a bonus exercise. (COACH-ANSWER ORD-10, ORD-11, VOL-07)
4. While a priority runs, **the other muscles grow at most 3 % a week** (planned steps and check-in bumps). (COACH-R2 VOL-06, RIGHT)
5. Per-session ceiling for the priority muscle: 14 fractional sets (soft ceiling 11 for the rest). (PROPOSED; SCIENCE Remmert ~11)
6. Pro setting (L3, optional): one priority muscle up to 35 (§3.2). (COACH-R2 VOL-06; number PROPOSED)

### 3.6 Pain and injury

| Trigger | Action | Tag |
|---|---|---|
| Pain area declared at intake | Affected muscle/pattern starts at 50-70 % of its start (-30 to -50 %; the floor of 10 does not apply); its exercises move to constraint 4-5 machines or split grips; positions that hurt are excluded; that muscle's step = 0 until 2 pain-free weeks. | COACH-ANSWER VOL-03, EQ-03; 2-week rule PROPOSED |
| 'Felt a PAIN' logged once | Next exposure: swap inside the same category to a more constrained, split-grip or unilateral variant; **keep the sets** if possible; that muscle's step 0 that week. | COACH-ANSWER UNI-08, GEN-05 |
| 'Felt a PAIN' on the same slot again | That slot -30 to -50 %; muscle step 0. Removed sets may move to a pain-free exercise for the same muscle (e.g. hinge pain → leg curl + hip thrust). | COACH-ANSWER VOL-03; move PROPOSED |
| Third time | Drop the exercise for the block; flag for coach review. | COACH-ANSWER VOL-03 ("drop the exercise altogether") |
| Pain on 2+ exercises in one week | A **block-at-risk prompt** (continue the block, or cancel it and start maintenance, §3.12), never an automatic mid-block deload. | COACH-R2 VOL-07; prompt PROPOSED |
| Pain shifts the bilateral:unilateral share | Low-back pain under axial bilateral loads → 20 points toward unilateral/belt squat/machines; knee or hip pain in single-leg positions → 20 points toward bilateral machines. | COACH-ANSWER UNI-02, EQ-11; 20 points PROPOSED |
| 'Felt the WRONG muscle' | Change one variable in the same category; volume unchanged. | COACH-ANSWER GEN-05, PER-02 |
| "Couldn't do it" | Regress one exercise level or use an assisted version; volume unchanged. | COACH-ANSWER GEN-05 |
| Rotation bias | Keep external- and internal-rotation positions in every week; use the bias to pick a swap when something hurts (not by sport). | COACH-R2 LIB-03 |

### 3.7 The stairway: planned weekly steps, and how a check-in changes them

**The coach's rule.** Every plan climbs "like steps up a stairway ... In the beginning, the first 2, 3, 4 weeks, the steps are a little bit smaller, but they're gradually going up. When they get to that halfway point and upwards, the steps get a little bit higher, but not too much ... that goes for every plan" (COACH-R2 PER-03); on 12 weeks "the last 4 weeks are going to be brutal" (PER-04). The step is a % of each muscle's weekly sets (COACH-ANSWER VOL-04), one rule for every person (never by muscle size, VOL-05). His 3 / 5 / 7 % vocabulary (VOL-04, R2-VOL-01) supplies the numbers.

#### 3.7.1 The planned stairway (the math)

For a training block of **N** weeks and a muscle m with start S and cap C:

```
halfway week          h = ceil(N / 2)
standard step into w  s_w = 3 %  if 2 <= w <= h        (early: "a little bit smaller")
                      s_w = 5 %  if h <  w <= N        (late: "a little bit higher, but not too much"; ratio 5/3)
planned growth        G(N) = Π_{w=2..N} (1 + s_w)
planned peak          P = min(C, S × G(N))
scale factor          λ = 1                           if S × G(N) <= C
                      λ in (0, 1) solving  S × Π (1 + λ·s_w) = C   otherwise   (peak lands on the cap in week N)
planned target        T(1) = S;  T(w) = T(w-1) × (1 + λ·s_w)
bank                  bank(w) = T(w) - current weekly sets;  add one whole set each time bank >= 1   (VOL-06)
limits                planned step <= 7 %;  other muscles <= 3 % while a priority runs (R2-VOL-06);
                      older adults (60+) <= 3 % (PROPOSED); total weekly resistance sets strictly below +10 % (UNI-05)
```

Tags: shape COACH-R2 PER-03, PER-04; 3 % / 5 % and the λ peak-anchoring PROPOSED (built from his own 3 / 5 / 7 % table, R2-VOL-01); limits COACH-R2 VOL-01, VOL-06, COACH-ANSWER UNI-05.

**Step sizes by plan length and week (standard steps, λ = 1).**

| Plan length N | halfway week h | step into week 2..h | step into week h+1..N | planned growth G(N) at standard steps | display level by week (2 -> 11) |
|---|---|---|---|---|---|
| 4 | 2 | 3 % | 5 % | ×1.136 (+13.6 %) | 2 · 4.1 · 7.5 · 11 |
| 6 | 3 | 3 % | 5 % | ×1.228 (+22.8 %) | 2 · 3.3 · 4.6 · 6.7 · 8.9 · 11 |
| 8 | 4 | 3 % | 5 % | ×1.328 (+32.8 %) | 2 · 2.9 · 3.9 · 4.8 · 6.3 · 7.9 · 9.4 · 11 |
| 10 | 5 | 3 % | 5 % | ×1.437 (+43.7 %) | 2 · 2.7 · 3.5 · 4.2 · 4.9 · 6.1 · 7.4 · 8.6 · 9.8 · 11 |
| 12 | 6 | 3 % | 5 % | ×1.554 (+55.4 %) | 2 · 2.6 · 3.2 · 3.8 · 4.4 · 5 · 6 · 7 · 8 · 9 · 10 · 11 |
| 16 | 8 | 3 % | 5 % | ×1.817 (+81.7 %) | 2 · 2.4 · 2.9 · 3.3 · 3.8 · 4.2 · 4.7 · 5.1 · 5.8 · 6.6 · 7.3 · 8 · 8.8 · 9.5 · 10.3 · 11 |

**Planned weekly sets by level (computed; whole sets, no check-in).** The early steps add a set every 3-4 weeks, the late steps one almost every week, and the last weeks are the highest. A muscle whose cap would come early gets λ < 1 (all steps shrink together) so it still peaks in the final week.

| Plan | Muscle (start -> cap) | λ | early step | late step | planned weekly sets, week 1 -> N (whole sets) |
|---|---|---|---|---|---|
| 8wk | L1 big/small 10 -> cap 14 | 1.00 | 3.00 % | 5.00 % | 10 · 10 · 10 · 10 · 11 · 12 · 12 · 13 |
| 8wk | L2 big 15 -> cap 22 | 1.00 | 3.00 % | 5.00 % | 15 · 15 · 15 · 16 · 17 · 18 · 18 · 19 |
| 8wk | L3 big 20 -> cap 25 | 0.78 | 2.35 % | 3.91 % | 20 · 20 · 20 · 21 · 22 · 23 · 24 · 25 |
| 8wk | L2 small 12 -> cap 22 | 1.00 | 3.00 % | 5.00 % | 12 · 12 · 12 · 13 · 13 · 14 · 15 · 15 |
| 8wk | L3 small 15 -> cap 25 | 1.00 | 3.00 % | 5.00 % | 15 · 15 · 15 · 16 · 17 · 18 · 18 · 19 |
| 8wk | L1 rear delts 4 -> cap 8 | 1.00 | 3.00 % | 5.00 % | 4 · 4 · 4 · 4 · 4 · 4 · 5 · 5 |
| 8wk | L2 rear delts 6 -> cap 12 | 1.00 | 3.00 % | 5.00 % | 6 · 6 · 6 · 6 · 6 · 7 · 7 · 7 |
| 8wk | L2 priority 19 -> cap 28 | 1.00 | 3.00 % | 5.00 % | 19 · 19 · 20 · 20 · 21 · 22 · 24 · 25 |
| 8wk | L3 priority 26 -> cap 30 | 0.50 | 1.50 % | 2.49 % | 26 · 26 · 26 · 27 · 27 · 28 · 29 · 30 |
| 12wk | L1 big/small 10 -> cap 14 | 0.76 | 2.28 % | 3.80 % | 10 · 10 · 10 · 10 · 10 · 11 · 11 · 12 · 12 · 12 · 13 · 14 |
| 12wk | L2 big 15 -> cap 22 | 0.87 | 2.60 % | 4.33 % | 15 · 15 · 15 · 16 · 16 · 17 · 17 · 18 · 19 · 20 · 21 · 22 |
| 12wk | L3 big 20 -> cap 25 | 0.50 | 1.50 % | 2.51 % | 20 · 20 · 20 · 20 · 21 · 21 · 22 · 22 · 23 · 23 · 24 · 25 |
| 12wk | L2 small 12 -> cap 22 | 1.00 | 3.00 % | 5.00 % | 12 · 12 · 12 · 13 · 13 · 13 · 14 · 15 · 16 · 16 · 17 · 18 |
| 12wk | L3 small 15 -> cap 25 | 1.00 | 3.00 % | 5.00 % | 15 · 15 · 15 · 16 · 16 · 17 · 18 · 19 · 20 · 21 · 22 · 23 |
| 12wk | L1 rear delts 4 -> cap 8 | 1.00 | 3.00 % | 5.00 % | 4 · 4 · 4 · 4 · 4 · 4 · 4 · 5 · 5 · 5 · 5 · 6 |
| 12wk | L2 rear delts 6 -> cap 12 | 1.00 | 3.00 % | 5.00 % | 6 · 6 · 6 · 6 · 6 · 6 · 7 · 7 · 8 · 8 · 8 · 9 |
| 12wk | L2 priority 19 -> cap 28 | 0.88 | 2.63 % | 4.39 % | 19 · 19 · 20 · 20 · 21 · 21 · 22 · 23 · 24 · 25 · 26 · 28 |
| 12wk | L3 priority 26 -> cap 30 | 0.32 | 0.96 % | 1.60 % | 26 · 26 · 26 · 26 · 27 · 27 · 27 · 28 · 28 · 29 · 29 · 30 |

Reading the table: a 12-week L2 big muscle goes 15 → 22 with its last four weeks at 19, 20, 21, 22 ("brutal", PER-04); an L3 big muscle needs only +25 % (20 → 25), so its steps are half-size (λ 0.50: 1.5 % / 2.5 %, about RP's "2-3 sets per muscle over a whole block" for advanced lifters); an 8-week L2 plan starts at the normal start (no "start hard") and reaches 19.

#### 3.7.2 "Start at a 2, end at an 11" (COACH-R2 PER-05)

The 2 → 11 is "how it feels and what level you're starting at", the overall load, not the set count. Each week shows a **level** that follows the same step weights as the sets: `level(w) = 2 + 9 × A(w) / A(N)`, where A(w) adds 1 for each early step and 5/3 for each late step (PROPOSED display). Planned effort drifts **inside his 1-3 RIR band** (VOL-13) as the level climbs:

| Week (12-week plan) | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| display level | 2 | 2.6 | 3.2 | 3.8 | 4.4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 |
| planned effort (inside 1-3 RIR) | 3 RIR | 3 RIR | 3 RIR | 3 RIR | 3 RIR | 3 RIR | 2 RIR | 2 RIR | 2 RIR | 1-2 RIR | 1-2 RIR | 1 RIR + intensifiers |

In the last week MYO sets on the last machine or isolation exercise (VOL-15) and supersets (ORD-05) are allowed: that is the "a little bit past your limits". For lifters already at their caps (many L3s), the 11 comes from heavier loads, intensifiers and a rotating priority muscle that may reach 30 (COACH-R2 PER-05, RIGHT). **Flag:** VOL-13 confirmed "1-3 RIR at all times, no planned RIR ramp"; this drift never leaves 1-3 RIR, but it is a planned drift (PROPOSED; round 3).

#### 3.7.3 The weekly check-in (optional): effort, completion and pain only

The plan works with no tracking (COACH-R2 GEN-01, RIGHT). With the optional 1-minute weekly check-in, his approved table (COACH-R2 VOL-01, RIGHT) sets next week's step, **read against the stairway**:

| This week's check-in | Next week's step | His approved number (late half) | Tag |
|---|---|---|---|
| Effort mostly 1-6 ("too easy") | the planned step **+ 2 points**, max 7 % | +7 % | COACH-R2 VOL-01 |
| Effort mostly 7-8 ("That was tough" / "That was perfect") | the planned step | +5 % | COACH-R2 VOL-01 |
| Effort mostly 9 | **hold** (0 %) | hold | COACH-R2 VOL-01 |
| Any "10 - the max I could do" | **hold** and remove 1 set from the day it happened (that exercise) | hold, -1 set | COACH-R2 VOL-01, VOL-02 |
| 'Failed' (optional extra answer) | hold; that exercise -1 set and a lighter load or easier variant | - | COACH-R2 VOL-02 ("we can add a fail"); handling PROPOSED |
| Under half the planned sessions done | **repeat the week** (the block becomes one week longer) | repeat | COACH-R2 VOL-01; "one week longer" PROPOSED |
| 'Felt a PAIN' | pain protocol (§3.6); that muscle 0 % | - | COACH-ANSWER VOL-03 |
| **No check-in** | **the planned step** (the plan does not change) | - | COACH-R2 VOL-03 |

Always: never more than 7 % in a week; other muscles ≤ 3 % while a priority runs; total weekly resistance sets strictly below +10 %. In the early half the same rows give 3 % ("perfect") and 5 % ("too easy"), because those weeks' steps are "a little bit smaller" (PER-03). A "10" also lowers that muscle's planned target by the removed set, so the stairway continues from the lower level (PROPOSED).

**The life column is removed (flag).** The approved table also had "+5 % if life was harder", "+3 % if life was harder", "+3 % only if life was better" and "life much harder (sick, travel, no sleep): hold". He then rejected lifestyle inputs: "I just need the workouts here. There's no need to talk about sleep or stress or anything else" (COACH-R2 GEN-04, NOT RIGHT). Both answers are round 2; the later, more specific one (no lifestyle inputs at all) decides the life cells, so v1.1 keeps the effort rows and drops every life cell: **the step is decided from effort, completion and pain only.** A person who was ill simply logs fewer sessions (repeat the week) or high effort (hold).

**How effort is read (COACH-R2 VOL-02, PARTLY).** '8 - That was perfect' = "I hit the target the plan gave me"; '9 - That was terrible' = harder than planned; **'10' = "That was the max I can do, not a fail ... I gave it all I had, but it was successful"** (0 RIR). An optional 'Failed' answer covers a set that could not be completed.

#### 3.7.4 Ceilings

- **Planned step ≤ 7 %**; standard steps 3-5 %; λ ≤ 1. (COACH-R2 VOL-01: "Never more than 7 % a week")
- **Total weekly resistance sets strictly below +10 %** week over week ("it can progress week by week by 10 %. That's way too much", COACH-ANSWER UNI-05). Exempt (PROPOSED): the first week after a deload or maintenance phase, and block-boundary swaps that add no sets.
- **Hand-set step** by the coach (or the client, if allowed): 0-7 %; 10 % is never offered as a step (fixes v1 §3.7 step 4 and 03's conflict 4). (COACH-ANSWER VOL-05, UNI-05, GEN-08)

#### 3.7.5 Retired by round 2

The readiness score `R = 0.40·E + 0.20·C + 0.20·P + 0.20·L` and its bands (life input L rejected, COACH-R2 GEN-04; performance P is not one of effort, completion or pain); the planned rate before logs (5 % default, 3 % for high stress, under 6 h sleep, a physical job, 60+, layoff or pain) and the new 3-tap intake question (GEN-04; age and pain keep their own rules in §3.4 and §3.6); "7 % only once logs earn it"; target-seeking; the 12-week acclimation cap (≤ 3 % in weeks 1-3) and the 8-week weeks-1-4 cap (≤ 5 %) with its × 1.10 start (PER-03, PER-04: the stairway replaces them); the "hold 2 weeks in a row → deload next week" gate (VOL-07).

### 3.8 Banking and rounding

```
T[m] = start[m]                                      # week 1
every week w:  T[m] = min(cap[m], T[m] × (1 + step[m, w]))     # planned (or check-in) step, §3.7
while T[m] - current[m] >= 1 and current[m] + 1 <= cap[m]:
    place one set (§3.9)
if current[m] >= cap[m]: progress load / reps / intensifiers instead
```
(COACH-ANSWER VOL-06: bank the fraction, add a whole set at 1; "round up, round down, that's fine".) The bank is the planned target minus the current sets, the same as banking the weekly fraction, but anchored on the stairway so the whole sets land on its shape and the peak lands in the final week. A hold leaves T unchanged; a repeated week does not advance the stairway.

Helper credit gained when another muscle's set is placed counts toward T and does not need a direct set. A muscle can exceed its cap by up to ~1 set through helper spill-over; the engine reports it and never adds direct sets above the cap. (PROPOSED)

### 3.9 Where a new set goes

1. **Day:** alternate through the days that train the muscle as a main mover (day A, then day B, …). When a day repeats twice a week, the new set goes to day A's first exercise, then day B's first exercise, so both days stay even. (COACH-ANSWER VOL-07 for the order inside a day; **R2-VOL-08 default**: the coach did not understand the question, so the proposed default stays and will be re-asked in plain words with an example)
2. **Laterality group first** (big lower and upper muscles): if the current bilateral share is more than 3 points below target, the set goes to a bilateral exercise; more than 3 above, to a unilateral one; otherwise no preference. (PROPOSED, joins COACH-ANSWER UNI-02 with VOL-07)
3. **Inside the day, the coach's order:** add to the first exercise (in session order) whose sets are below the first exercise's; if all are equal, add to the first. This produces exactly 2/2/2 → 3/2/2 → 3/3/2 → 3/3/3 → 4/3/3. (COACH-ANSWER VOL-07)
4. **Limits:** sets per exercise ≤ 4 (L1) or 5 (L2-L3), isolation ≤ 4; the muscle's per-session fractional sets ≤ 11 (priority 14); session minutes ≤ the client's limit. (COACH-ANSWER VOL-16 defaults; limits PROPOSED; SCIENCE ~11 per session)
5. **No room on any day:**
   - first, superset the lower/upper pairs on that day if that frees the time (COACH-ANSWER ORD-05);
   - **small muscle → bonus exercise** (2 sets, same category): on the optional day first (as a Focus slot; R2-VOL-08 default); with no optional day, on a training day that **already trains that muscle group** (so it becomes its 2nd-4th exercise that day, COACH-R2 SES-05), the one with the fewest exercises; never on a day where it would be that muscle's only exercise (PROPOSED);
   - **big muscle → Focus slot** (2 sets) on the optional day, otherwise on a day that already trains that region (COACH-ANSWER ORD-11; big-muscle use PROPOSED);
   - still no room → the bank waits and progress comes from load, reps and intensifiers (MYO on the last machine/isolation, supersets) (COACH-ANSWER VOL-15, ORD-05).
6. **Hard rules:** core opener first (light, 2 exercises × 2 sets short of failure; movable; core supersets or monster sets may be added anywhere); hip dominant + push, knee dominant + pull; **heavy squat and heavy deadlift on two different days**, non-axial hinge, leg press or belt squat on the other days; row before pulldown; power before strength; no bands or variable resistance. **Axial lifts (count):** barbell back, front, zercher, overhead and Smith squats; barbell or trap-bar deadlifts and RDLs; good mornings. **Not axial:** leg press, belt squat, hip thrust, back extension, reverse hyper, single-leg DB work, Olympic lifts, loaded jumps. Goblet squat, hack squat and pendulum: fine on the second day if not sore. Powerlifters may add a light technique squat or deadlift. (COACH-ANSWER ATH-11, ORD-06, UNI-11, ORD-01, ORD-03, EQ-01, EQ-12; COACH-R2 SES-01, SES-02, SES-03)
7. Exercises stay fixed inside a 4-6-week **exercise block**; only sets, reps, load and RIR change. Between exercise blocks change one or two small variables (grip, stance, implement, range of motion, rep range) or a one-detail library variation shown as "Reverse lunge - dumbbell in opposite hand"; the tool never invents an exercise (COACH-R2 LIB-01); a stance change may swap laterality (examples 5.2, 11-A). The stairway does **not** restart at an exercise-block boundary: it runs through the whole plan (INFERRED from R2-PER-04 and R2-VOL-07). A/B lead-lift weeks only for clients who want variety. (COACH-ANSWER PER-02, PER-03; SCIENCE Kassiano 2022)

### 3.10 Session limits and the time model

| Limit | Value | Tag |
|---|---|---|
| Resistance exercises per session | by length: **45 min ≈ 5, 60 min ≈ 6-7, 75-90 min ≈ 8-9** ("usually 7") | COACH-ANSWER VOL-08 (RIGHT), VOL-16 (03's conflict 6 adopted; v1 "8 PROPOSED" retired) |
| **Full-body days** | **every muscle group trained that day gets 2-4 exercises, never 1**; the day "might be a little longer" | COACH-R2 SES-05 (PARTLY) |
| Muscle groups for that rule | his FOCUS headers: quads, hamstrings, glutes, chest, back, shoulders (front/side/rear work together), biceps, triceps; calves keep VOL-17's 3 sets per leg day (one exercise); core = the 2-exercise opener; a field athlete's credit-only muscles are not "trained that day" | INFERRED grouping |
| Exercises per muscle group on its day | split days 3-4; full-body days 2-4 | COACH-ANSWER VOL-07; COACH-R2 SES-05 |
| Field athlete, off-season | up to **12 exercises + the 2-exercise core block (14 listed)**: 2-4 plyo/ballistic + 2-3 Olympic/power + 3-4 resistance (+ calves); warm-up drills never count; a superset of two small isolations counts as one | COACH-ANSWER VOL-08, VOL-17; COACH-R2 SES-04 |
| Default sets | 3 compounds, 2 isolation, 3 calves; **athletic-template slots 2**; minimum 2 per exercise | COACH-ANSWER VOL-16, VOL-17 (03's conflict 1 adopted); minimum PROPOSED |
| Session length | athletes/bodybuilders/powerlifters ~90 min (max 120); general/weight loss 45-60 (full-body days with 2-4 exercises per group: 55-80); bootcamp 35-45 | COACH-ANSWER UNI-09, PRG-03; COACH-R2 SES-05 |
| Per muscle per session | soft 11 fractional sets, priority 14 | SCIENCE Remmert; RP 8-12; values PROPOSED |
| Rest | hypertrophy 1-2 min (up to 3), strength 3-6 min, athletic as prescribed | COACH-ANSWER VOL-14 |
| Core | 2 exercises × 2 sets, short of failure, as the warm-up; optional core supersets or monster sets anywhere | COACH-R2 SES-03 |
| Aerobic sessions/week (**adjustable up or down by the user**) | general/fat loss 3; aesthetics/bodybuilders 4 (Orange, Green, Blue + a second Orange, long and low) + optional 20-30-min easy walks after workouts; athletes in season 2; off-season by sport: baseball, softball, sprinters 2 · basketball, volleyball, football, tennis, golf, boxing, BJJ 3 · soccer, hockey, kickboxing, karate 3-4 · MMA, wrestling 4; pre-season 2; powerlifters 2 easy (Orange); sports he did not list (swimming, lacrosse, pickleball, HYROX and the rest of the US sport set) take their count from their sport profile in `synthesis/sports/` (e.g. competitive swimmers 0 gym aerobic sessions by default because the pool is the aerobic work, adjustable; PROPOSED there) | COACH-ANSWER ATH-07; COACH-R2 SES-06, ATH-06; other sports PROPOSED |

**What R2-SES-05 does to the week (computed, §5.1 and 11's Example A).** A 4-day full-body plan trains 3-4 muscle groups a day with knee-dominant + pull and hip-dominant + push days, 2-3 exercises each: **8-10 resistance exercises plus the core opener**. A beginner's week starts at about 55-72 minutes per session (2-3 sets per exercise, supersets on) and ends at about 66-79 minutes in week 12; an intermediate's 4-day full body runs 77-90 minutes. Where a muscle cannot get 2 exercises on a day, the generator trains it on fewer days with 2 exercises each instead of one exercise on more days (PROPOSED). A client who insists on 60 minutes gets fewer muscle groups per day (5-6 days a week) or supersets throughout; the plan says so.

**Time model** (PROPOSED; minutes per working set including rest): warm-up 8 (COACH-ANSWER ORD-08: 5 min cardio + drills); core opener 2 × 2 sets × 1.5; bilateral compound 2.5; unilateral compound 3.75 (1.5 ×); isolation 1.75 (unilateral 2.5); plyo/ballistic 1.5; Olympic 3.0; throw 1.25; supersetted pair × 0.65; **+ 1.0 min changeover per exercise (0.5 inside a superset pair; new in v1.1)**. Check against his own BYOP day 1 (7 exercises, 19 sets, OBSERVED): 8 + 7 + 19 × ~2.3 ≈ 59 min, i.e. his 60-minute session.
Capacity, mixed hypertrophy work with the core opener: **45 min ≈ 5 exercises / 11 sets, 60 ≈ 7 / 17, 75 ≈ 8 / 23, 90 ≈ 9-10 / 29**; supersets add ~25-35 %. (v1's 13-14 / 19-20 / 25-26 / 31-32 left out the core opener and the changeovers.)

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

### 3.12 Plan shapes, blocks, maintenance and tests

| Mode | Shape | Tag |
|---|---|---|
| **12-week (preferred)** | One stairway, N = 12: 3 % steps to week 6, 5 % from week 7 (λ-scaled to land on the cap in week 12); the last 4 weeks are the hardest ("brutal"): the highest sets, 2 → 1 RIR, intensifiers allowed in week 12. No deload or maintenance week inside. | COACH-R2 PER-04, PER-05; numbers PROPOSED |
| **8-week** | One stairway, N = 8: 3 % to week 4, 5 % from week 5; starts at the normal start. v1's "start hard" (× 1.10) and "4 adapting + 4 driving" are retired. | COACH-R2 PER-03 (NOT RIGHT) |
| **4-6-week training block** | One stairway, N = 4-6 (table §3.7.1), when the user wants a short training block. | COACH-R2 PER-03 ("that goes for every plan") |
| **Maintenance phase** | Flat at **50-70 %** of the last block's final 4 weeks (new clients: of their level start): 50 % vacation or limited kit, 60 % travel, moving or a season change, 70 % planned maintenance; older adults ≥ 70 %; RIR 2-3, no intensifiers; not floored. **The user picks its length and can add weeks; at its end the app asks: keep going on maintenance? change the plan? start a training block?** | COACH-ANSWER PER-01; COACH-R2 PER-06; splits PROPOSED; SCIENCE Bickel, Spiering |
| **Pre-season** | A 4-6-week block at about **60 % of off-season sets** with more speed and power, then a **1-2-week taper** before the first game. | COACH-R2 PER-06 (RIGHT) |
| **Week by week** (no end date) | Runs on a rolling 12-week stairway; at week 12 the end-of-block prompt (new block, maintenance, change plan). Needs the weekly check-in. | COACH-ANSWER PER-01; COACH-R2 GEN-01; rolling 12 PROPOSED |
| **Yearly (gen-pop "stay in shape")** | Jan-Mar: hard work + more cardio, start cutting (sets stay at the starting level). Apr-Jun: summer shape, keep losing fat while building a little muscle. Jul-Sep: maintain at about 70 % of the volume. Oct-mid-Dec: build muscle, less cardio. Last 2 weeks of December: automatic maintenance. Uses the user's hemisphere and their own holiday weeks (Christmas, Semana Santa, Thanksgiving ...), which switch to maintenance. **Fully tunable**: re-order the blocks, more or less cardio, e.g. a deep-winter powerlifting-style block. Athletes follow their season instead. | COACH-R2 PER-01, PER-02 (RIGHT + words) |
| **Fight / competition prep** | 2-week steps and waves instead of smooth weekly adds; same average. | COACH-ANSWER PER-10; step size PROPOSED |
| **Athlete seasons** | Off-season: most volume, stairway. Pre-season: as above. In-season: 2 days, flat, game-heavy reductions (§3.4). Post-season: recovery, general. | COACH-ANSWER PER-08; COACH-R2 ATH-07, PER-06 |

**Blocks and deloads (COACH-R2 VOL-07).**
- **No deload or maintenance week inside a block**, whatever its length: "It should never be thrown in the middle of a block ... they need to be able to manage their block and complete it." Inside a block the tools are holds, -1 set after a "10", repeated weeks and the pain protocol.
- **Block-at-risk prompt (PROPOSED):** two holds in a row, effort mostly 9-10 two weeks in a row, pain on 2+ exercises in one week, or under half the sessions two weeks in a row → the app asks the person (or coach): continue the block, or **cancel it and start a maintenance phase**. It never deloads on its own.
- **Cancelled block → maintenance phase** (length chosen, extendable, end prompt) **→ a whole new block** at the same start as the cancelled one (same start PROPOSED).
- **Completed block → a transition week**: deload at about **half of the hardest (last) week's sets**, same exercises, lighter load or 3+ RIR, no buy-out, finisher, MYO or supersets; plyos only low-amplitude landings at about half the contacts; Olympic lifts at half the sets with light technique loads; conditioning Orange only. If the user chooses a maintenance phase instead, it replaces the deload week. (COACH-R2 VOL-07: the "half of the current (hardest) week" proposal is RIGHT; COACH-ANSWER PER-05; athletic details PROPOSED)
- **Next block** (COACH-R2 VOL-06, RIGHT): start = previous start × 1.05, cap = previous cap + 1, never above 25 (non-priority) or 30 (priority; Pro setting excepted). Example L2 big muscle: 15/22 → 16/23 → 17/24 → 18/25.

**Tests (COACH-R2 PER-07, RIGHT + words).** Ticked at block start: strength (beginners a 5-8-rep max; intermediate and up a 3-rep max or work up to a 1-rep max), cardio (1-mile run or an erg time trial), speed and agility (10-30 m sprint, 5-10-5, L-test), jumps, body weight. **Test before the block (or in week 1) and at the end, never during the block**; the end test replaces that week's top sets. **Never from zero:** someone untrained, or not coming off a completed block, tests a 5RM or 3RM (beginners 5-8RM) and 80-90 % efforts, never a 1RM or a max-effort mile. Reminders at block start, 7 days before and the day before.

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
| Olympic lifts: how often | **up to 4 times a week**; clean days are squat-pattern days, snatch days are hinge-pattern days ("snatches a little bit more hingy than squatty"); in season a light piece (2 × 3 hang power clean or DB snatch), dropped in heavy game weeks | COACH-R2 ATH-04 (RIGHT + words) |
| Olympic lifts: reps and load | DB/KB and pull variants keep his ramp 4 × 8 @ 75 % → 4 × 6 @ 80 % → 4 × 6 @ 85 % → 4 × 4 @ 90 %; **full squat cleans and snatches use 3-5 reps per set with the same weekly reps** (e.g. 6 × 5 @ 75 %), with the coach's eye on speed; barbell power and hang-power catches follow the 3-5-rep rule (INFERRED). **% only if the athlete has tested that lift's own max, otherwise RPE/RIR**; the plan explains Olympic lifts as power output; % programming belongs to competitive Olympic lifters (their own programming) | COACH-R2 ATH-05, GEN-06; COACH-ANSWER PER-09 |
| Medball | rotational/athletic only; never over 20 lb; light (8-10 lb) for speed; none for aesthetics/bodybuilders except warm-up | COACH-ANSWER ATH-05, EQ-06 |
| Older clients (60+) | no Olympic lifts, plyos or depth jumps by default; optional with the warning (§3.4); landing drills and low ankle hops when chosen | COACH-R2 ATH-08; COACH-ANSWER ATH-09 |
| Youth | Olympic lifts from the floor from about 14, after one block of hang work | COACH-R2 ATH-08 |
| In-season, game-heavy sports | gym plyos about half; no extra change of direction; sprints only for speed athletes; the one hard gym day ≥ 48 h before a game | COACH-R2 ATH-07 |
| Deload | contacts and throws about half; landings only | COACH-ANSWER PER-05; PROPOSED |

**Plyo share by sport** (COACH-R2 ATH-01, RIGHT; start of block = end - 15 points):

| Sport | Plyo share at block end | Block start |
|---|---|---|
| Sprinters | 75 % | 60 % |
| Volleyball, soccer, football skill positions | 60 % | 45 % |
| Basketball, tennis, football big-skill, weekend warriors | 50 % | 35 % |
| Baseball, softball, hockey, linemen, MMA | 40 % | 25 % |
| Boxing, karate, kickboxing, wrestling, BJJ, golf | 25 % | 10 % |
| Older adults | only if chosen (§3.4) | - |
| Aesthetics, bodybuilding | no plyo block | - |

Sports not in his list (swimming, lacrosse, pickleball, HYROX and the rest of the US sport set) take their share from the 04 sport profiles, placed by the same rule (fast, bouncy contacts → higher share). The 04 files name the five rows of this table ground-contact **classes**: class 1 = 75 %, 2 = 60 %, 3 = 50 %, 4 = 40 %, 5 = 25 % (the shares are his, COACH-R2 ATH-01; the class of each new sport is INFERRED or PROPOSED in `04_athlete_profiles` and `synthesis/sports/`). Examples from those files: swimming (sprint, middle, distance) class 4 → 25 % at block start, 40 % at the end (slow push-offs from block and wall); pickleball, padel and HYROX class 3 (50 %, PROPOSED, to confirm with the coach); the "stay athletic and active" gen-pop path uses the class of its activity (§3.4). Whatever the class, the resistance volume of these sports follows this engine (starts, floor of 10, stairway). v1's PROPOSED table (e.g. basketball 45 → 60 %, tennis 30 → 55 %, baseball 15 → 30 %, golf 10 → 20 %) is retired.

### 3.14 How the engine learns

**Two delivery modes** (COACH-R2 GEN-01, RIGHT; VOL-03)
- **No tracking (static plan):** the whole plan follows its planned stairway; nothing adapts ("there is no data to go off of").
- **Optional weekly check-in (about 1 minute):** effort, how it felt, anything hurting, sessions done → next week's step (§3.7.3). Required for the week-by-week mode. No sleep, stress, energy or life questions (COACH-R2 GEN-04). Learning uses only people who opt in.

**What to log** (minimum, phone-friendly; COACH-ANSWER GEN-02, GEN-05, PER-07; COACH-R2 VOL-02, GEN-04)

| Level | Fields |
|---|---|
| Per exercise per session | DONE (sets done), reps or "hit target" yes/no, WEIGHT USED or SCORE, EFFORT 1-10 (his menu; '8 - That was perfect' = hit the target, '9' = harder than planned, '10' = the max I could do, successful), optional 'Failed', HOW IT FELT ('Felt the RIGHT muscles', 'Felt the WRONG muscle', 'Felt a PAIN', "Couldn't do it"), pain location if any |
| Per week (check-in) | sessions done; the effort and pain answers above summarised |
| Per block | tests ticked at the start and repeated at the end (strength, cardio, speed, jumps, body weight, or none) |
| Computed | weekly fractional sets per muscle (coach 0.25 count and Pelland 0.5 count), planned target and λ per muscle, steps used, holds, repeated weeks, "10"s, pain events, adherence, e1RM per main lift (Epley) and rep PRs at fixed loads |

**What it tunes, in order** (PROPOSED)
1. **Each person's step scale.** If "too easy" weeks keep coming with no "10"s or pain, the person's λ (and standard steps) can rise next block; if holds and "10"s keep coming, it falls.
2. **Each person's cap (personal MRV).** The weekly sets at which lifts stall and holds/"10"s cluster become next block's cap minus 1-2 sets (RP's MRV idea, measured instead of guessed).
3. **Each person's next start.** × 1.05 after a completed block; same start after a cancelled one.
4. **Population tables** (start, caps, step sizes, share targets, plyo shares) by level × goal × age band × sport, updated from many people's outcomes with a hierarchical model; a cell changes only after enough completed blocks (e.g. 200+) and **only with coach approval**. No sex-based cells (COACH-ANSWER ATH-09, GEN-02).
5. **Counting rules.** Test whether the 0.25 helper count or Pelland's 0.5 predicts each muscle's progress better. Keep 0.25 unless the data and the coach agree to change.

**Guardrails the learning can never remove:** planned step ≤ 7 %, total < +10 %/week; no deload or maintenance inside a block; floor of 10 per trained muscle; pain protocol; deload ≈ half of the hardest week between blocks; hard ordering and safety rules (heavy squat and deadlift on different days, core opener, older-adult defaults, no bands/variable resistance); priority cap 30 (Pro setting excepted); coaches' own added rules (COACH-ANSWER GEN-08). Every parameter set is versioned; any experiment needs the user's consent.

---

## 4. Pseudo-code

```python
# ---------- 0. intake -> profile (no sleep / stress / job questions: COACH-R2 GEN-04) ----------
level = level_from_experience(years_consistent, months_off, ex_pro)        # PRG-05 (L1/L2/L3)
goal, sport, position, season_start, practice_game_days = intake...        # GEN-02, R2-GEN-05
age, body_weight, pain_areas = intake...                                    # GEN-02 (age and pain are training inputs)
mode = intake.plan_mode            # '12wk' | '8wk' | 'block_4_6' | 'maintenance' | 'pre_season' | 'week_by_week' | 'yearly'
checkin = intake.weekly_checkin    # False = plan never adapts (R2-VOL-03); True = optional 1-minute check-in (R2-GEN-01)

# ---------- 1. weekly targets ----------
STAIRWAY_MODES = ('12wk', '8wk', 'block_4_6', 'week_by_week', 'yearly')   # training blocks; maintenance and pre-season are flat
for m in MUSCLES:
    if mode in STAIRWAY_MODES and previous_block == 'completed':
        start[m] = round_half_up(previous_start[m] * 1.05)                # R2-VOL-06: the PREVIOUS start x 1.05, compounding block to block
    elif mode in STAIRWAY_MODES and previous_block == 'cancelled':
        start[m] = previous_start[m]                                       # same start after a cancelled block (PROPOSED)
    else:                                                                  # first block (or a new goal)
        start[m] = START_TABLE[m][level]                                   # 3.3 (VOL-01, R2-VOL-04)
        start[m] = round_half_up(start[m] * GOAL_PHASE_FACTOR[goal, season][region(m)])   # 3.4
    if m in new_priorities: start[m] += 4 if level in ('L1', 'L2') else 6 # VOL-02 (a muscle that becomes the priority this block)
    if is_target(m) and mode not in ('maintenance', 'pre_season', 'in_season'):
        start[m] = max(start[m], 10)                                       # floor 10 (R2-VOL-06)
    if m in pain_muscles: start[m] *= 0.5 to 0.7                           # VOL-03 (pain wins over the floor)
    cap[m] = CAP_TABLE[level] (priority: PRIORITY_CAP[level]; Pro: up to 35) (+1 per completed block, max 25/30)
    if mode == 'maintenance': start[m] = factor(context, age) * last_block_final4_avg[m]   # PER-01, R2-PER-06 (flat: no x1.05, no floor)
    if mode == 'pre_season':  start[m] = 0.6 * off_season_sets[m]                          # R2-PER-06 (flat: no x1.05, no floor)
share_target = SHARE_TABLE[profile][phase]; apply pain shift                # 3.11

# ---------- 2. the planned stairway (3.7.1) ----------
N = block_length(mode); h = ceil(N / 2)
std = {w: 0.03 if w <= h else 0.05 for w in 2..N}
for m in targets:
    lam[m] = 1 if start[m] * prod(1 + s for s in std) <= cap[m] else solve(start[m] * prod(1 + lam*s) == cap[m])
    plan_step[m][w] = lam[m] * std[w]
    if priorities and m not in priorities: plan_step[m][w] = min(plan_step[m][w], 0.03)   # R2-VOL-06
    if age >= 60: plan_step[m][w] = min(plan_step[m][w], 0.03)                           # PROPOSED
level_display[w] = 2 + 9 * A(w) / A(N); rir[w] = rir_for_level(level_display[w])     # R2-PER-05, inside 1-3 RIR

# ---------- 3. week-1 build ----------
slots = template(goal, days, minutes)       # pairing hip+push / knee+pull; core opener 2x2; heavy squat and heavy deadlift on different days
assert every muscle group trained on a full-body day has 2-4 exercises        # R2-SES-05
set defaults: compound 3, isolation 2, calves 3, athletic slot 2               # VOL-16, VOL-17
fit: trim muscles > start+1 (latest isolation first, min 2 sets); add to muscles < start-1 with place_set()

# ---------- 4. weekly loop (no deload or maintenance inside the block: R2-VOL-07) ----------
T = dict(start); stair_w = 1
while stair_w < N:
    log = checkin_log(this_week) if checkin else None
    for m in targets:
        step = plan_step[m][stair_w + 1]
        if log:                                                            # R2-VOL-01 table, effort/completion/pain only
            if log.sessions_done < 0.5 * log.sessions_planned: step = 'repeat'
            elif log.failed:            step = 0;  cut_one_set_and_lighten(log.failed_exercise)      # PROPOSED
            elif log.any_10:            step = 0;  remove_one_set(log.day_of_10)                     # 10 = successful max (R2-VOL-02)
            elif log.median_effort >= 9: step = 0
            elif log.median_effort <= 6: step = min(step + 0.02, 0.07)
            if m in log.pain_muscles:   step = 0;  pain_protocol(m)
            if priorities and m not in priorities and step != 'repeat': step = min(step, 0.03)
        T[m] = min(cap[m], T[m] * (1 + (0 if step == 'repeat' else step)))
        while T[m] - weekly_sets[m] >= 1 and weekly_sets[m] + 1 <= cap[m]:
            if total_sets_after_add >= 1.10 * total_sets_last_week: break  # hard ceiling (UNI-05)
            if not place_set(m): break
        if weekly_sets[m] >= cap[m]: use_load_reps_intensifiers(m)
    if not any(step == 'repeat'): stair_w += 1
    if block_at_risk(logs): ask('continue the block, or cancel it and start maintenance?')         # PROPOSED (R2-VOL-07)
    if exercise_block_boundary(stair_w): change_one_small_variable(); rebalance_share(share_target) # PER-02, R2-LIB-01
    emit(week)

# ---------- 5. after the block ----------
if completed: transition_week = deload(hardest_week, factor=0.5) or maintenance(chosen_length)   # R2-VOL-07, R2-PER-06
if cancelled: maintenance(chosen_length, extendable); at its end ask: keep maintaining / change plan / start a block
tests: before the block (or week 1) and at the end; untrained -> 5RM/3RM or 80-90 % efforts, never 1RM or max mile   # R2-PER-07

def place_set(m):
    for day in alternate(days_training(m)):                                # day A, then B ... (R2-VOL-08 default)
        group = laterality_group(m, share_target)                         # bilateral vs unilateral first
        ex = first exercise in session order with sets < sets of the first, else the first (below max)   # VOL-07
        if fits(ex, per_exercise_max, per_session_muscle_cap=11 (14 priority), session_minutes): ex.sets += 1; return True
        if superset_frees_time(day): enable_superset(day); retry           # ORD-05
    if m is small: return add_bonus(m, prefer=optional_day, else=day_already_training_its_group)   # VOL-07, R2-VOL-08, R2-SES-05
    if m is big:   return add_focus_slot(m, prefer=optional_day)           # ORD-11
    return False

# athletic block (separate budget, VOL-10)
plyo_share(week) = (SPORT_PLYO_SHARE[sport] - 0.15) + progress(week) * 0.15    # R2-ATH-01, over jump AND throw sets
rc_stage(week)   = {12: [1-3, 4-7, 8-12], 8: [1-2, 3-5, 6-8]}[N]                # R2-ATH-03 (1 Land, 2 Land & Go, 3 Repeat)
olympic: up to 4 slots/week; clean family on squat days, snatch family on hinge days; pulls/DB/KB 4x8@75 -> 4x4@90;
         barbell catches 3-5 reps with the same weekly reps; % only if tested, otherwise RPE      # R2-ATH-04, ATH-05, GEN-06
contacts_per_session <= NSCA[level]
```

---

## 5. Worked examples (computed with the reference prototype v1.1)

Reading the tables: numbers are **weekly fractional sets per muscle (coach count, helpers 0.25)**. "stair wk" is the stairway week (it does not advance in a repeated week); "level" is the 2 → 11 display; "step taken" is the step used to build that week (for 5.2: chest / other big muscles / side delts; 11's Example A uses chest / every other muscle). "resist. sets" = total resistance working sets in the week (core opener not included).

### 5.1 Beginner (L1) aesthetics, 12 weeks, 4 full-body days, **no check-in**

**Inputs.** 9 months of training (L1), aesthetics goal, no priority, no pain; no weekly check-in, so the plan is the planned stairway (COACH-R2 VOL-03). Starts: every target muscle **10** (small muscles lifted from 8 by the floor, COACH-R2 VOL-04/06), rear delts 4 own sets, calves 3 per leg day (12), abs from the core opener (16). Caps 14 (rear delts 8). Stairway λ: big and small muscles 0.76 (10 → 14 over 12 weeks: 2.28 % then 3.80 %), rear delts 1.0 (4 → 6), calves 0.35. Days: Mon and Thu knee dominant + pull, Tue and Fri hip dominant + push (ORD-06); the beginner has no axial lift (goblet squat Monday, leg press Thursday, DB RDL Tuesday; R2-SES-02 list); core opener 2 × 2 every day (R2-SES-03); calves 3 sets every day (VOL-17). **R2-SES-05:** each muscle group trained on a day gets 2-3 exercises, so the days carry 8-10 resistance exercises. The client asked for 60-minute sessions; the generator states that this plan needs about 55-80 minutes with supersets (limit set to 80) or more training days.

**Week 1:**
- **Mon:** Dead bug 2 · Side plank 2 · Goblet squat 2 · Chest-supported DB row 3 · DB split squat 10/10 2 · Lat pulldown 2 · Leg extension 2 · DB curl 2 · Hammer curl 2 · Calf raise 3
- **Tue:** Bird dog 2 · Pallof hold 2 · DB Romanian deadlift 2 · DB bench press 3 · DB single-leg RDL 10/10 2 · Seated DB shoulder press 2 · Incline DB press 2 · Leg curl 2 · DB side raise 4 · Cable lean-away side raise 4 · Calf raise 3
- **Thu:** Dead bug 2 · Side plank 2 · Leg press 2 · 1-arm DB row 10/10 3 · DB step-up 10/10 2 · Neutral-grip pulldown 2 · Reverse DB fly 2 · Face pull 2 · Incline DB curl 2 · Cable curl 2 · Single-leg calf raise 10/10 3 · Cable side raise (bonus) 2
- **Fri:** Bird dog 2 · Pallof hold 2 · Hip thrust 3 · Machine chest press 3 · Cable glute kickback 10/10 3 · Push-up 2 · Cable pushdown 4 · Overhead DB triceps extension 3 · B-stance DB RDL 10/10 2 · Swiss-ball leg curl 2 · Calf raise 3

| Wk | stair wk | level | step taken | quads | hams | glutes | chest | back | biceps | triceps | side d. | rear d. | calves | abs | resist. sets |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | 1 | 2 | - | 10 | 11.5 | 9.5 | 10 | 10 | 10.5 | 10 | 11 | 5.5 | 12 | 16 | 89 |
| 2 | 2 | 2.6 | 2.28 % | 10 | 11.5 | 9.5 | 10 | 10 | 10.5 | 10 | 11 | 5.5 | 12 | 16 | 89 |
| 3 | 3 | 3.2 | 2.28 % | 10 | 11.5 | 9.5 | 10 | 10 | 10.5 | 10 | 11 | 5.5 | 12 | 16 | 89 |
| 4 | 4 | 3.8 | 2.28 % | 10 | 11.75 | 10.5 | 10 | 10 | 10.5 | 10 | 11 | 5.5 | 12 | 16 | 90 |
| 5 | 5 | 4.4 | 2.28 % | 10 | 11.75 | 10.5 | 10 | 10 | 10.5 | 10 | 11 | 5.5 | 12 | 16 | 90 |
| 6 | 6 | 5 | 2.28 % | 11 | 11.75 | 10.75 | 11 | 11 | 10.75 | 10.25 | 11 | 5.5 | 12 | 16 | 93 |
| 7 | 7 | 6 | 3.8 % | 11 | 11.75 | 10.75 | 11 | 11 | 10.75 | 11.25 | 11 | 5.5 | 12 | 16 | 94 |
| 8 | 8 | 7 | 3.8 % | 12 | 12 | 12 | 12 | 12 | 12 | 11.5 | 12 | 5.5 | 13 | 16 | 101 |
| 9 | 9 | 8 | 3.8 % | 12 | 12 | 12 | 12 | 12 | 12 | 11.5 | 12 | 5.5 | 13 | 16 | 101 |
| 10 | 10 | 9 | 3.8 % | 12 | 12 | 12 | 12 | 12 | 12 | 11.5 | 12 | 5.5 | 13 | 16 | 101 |
| 11 | 11 | 10 | 3.8 % | 13 | 13 | 12.5 | 13 | 13 | 13.25 | 11.75 | 13 | 5.75 | 13 | 16 | 107 |
| 12 | 12 | 11 | 3.8 % | 14 | 14 | 13 | 14 | 14 | 13.5 | 12 | 13 | 5.75 | 14 | 16 | 112 |

**What happened.**
- **The stairway, no check-in.** Weeks 2-6 use the small steps (2.28 %): the bank fills and the first sets arrive in weeks 4 (glutes) and 6 (quads, chest, back). From week 7 the steps are bigger (3.8 %) and sets arrive every 1-3 weeks. The last four weeks are the highest (101, 101, 107, 112 resistance sets); quads, hamstrings, chest, back and calves land on the cap (14) in week 12, exactly the planned peak. The level climbs 2 → 11 and planned effort 3 RIR → 1 RIR. Nothing adapted, because there was no check-in (R2-VOL-03).
- **The coach's add order with day alternation:** quads went Goblet squat 2 → 3 (week 6), Leg press 2 → 3 (week 8), DB split squat 2 → 3 (week 11), DB step-up 2 → 3 (week 12): Monday first, then Thursday, first exercise first (VOL-07, R2-VOL-08 default).
- **R2-SES-05 held every week:** Mon quads 3 / back 2 / biceps 2; Tue hamstrings 3 / chest 2 / shoulders 3; Thu quads 2 / back 2 / shoulders 3 / biceps 2; Fri glutes 2 / chest 2 / triceps 2 / hamstrings 2. The side-delt bonus went to Thursday, a day that already trains shoulders (3 shoulder exercises), never as a lone exercise.
- **Time is the cost of R2-SES-05:** week 1 sessions run 54 / 67 / 68 / 72 minutes and week 12 66 / 79 / 79 / 79 minutes with supersets on all four days. Triceps are trained directly only on Friday and stop at 12 from week 9 (per-session ceiling and time); glutes (13), biceps (13.5) and side delts (13) end just under the cap. Those muscles progress by load and reps in the last weeks.
- **Glutes** reach 10 only with two direct glute exercises on Friday (hip thrust, kickback): with squats and hinges at 0.25 (R2-VOL-05), compounds give glutes little credit.
- Total resistance sets 89 → 112 (+26 % in 12 weeks); the largest weekly rise is +7.4 % (week 8), under the 10 % ceiling.

### 5.2 Intermediate (L2) bodybuilder, chest priority, 12-week split + optional Focus day, **weekly check-ins**

**Inputs.** 4 years of training, bodybuilding, priority = chest. Starts: chest 15 + 4 = **19** (cap 28), other big muscles 15 (cap 22), small muscles 12 (cap 22), rear delts 6 (cap 12), calves 10 (floor), abs 20. While chest is the priority, every other muscle grows at most 3 % a week (COACH-R2 VOL-06). λ: chest 0.88 (19 → 28: 2.63 % then 4.39 %); other big muscles 2.6 % then 3 %. Split: Mon Push (chest first, ORD-04), **Tue Legs A (back squat: the week's heavy squat day)**, Wed Pull (row before pulldown), Thu optional Focus day (45 min, up to 6 exercises; Focus 1 and 2 both chest, ORD-11), Fri Upper, **Sat Legs B (barbell RDL: the heavy hinge day; belt squat, non-axial)** (COACH-R2 SES-01, SES-02). Lower share 50/50 in weeks 1-4, 80/20 from the week-5 exercise-block change (UNI-02, CAT-13).

**The check-ins (effort, completion and pain only; R2-VOL-01 without the life column, R2-GEN-04):**

| Check-in after week | Logged | Next week |
|---|---|---|
| 1, 2 | effort mostly 7-8, all 5 sessions | the planned step |
| 3 | effort mostly 5-6 ("too easy") | planned + 2 points: chest 4.63 %; others stay at 3 % (priority rule) |
| 4 | a "10 - the max I could do" on the belt squat (Saturday) | hold; belt squat -1 set (and the week-5 exercise-block change) |
| 5 | effort mostly 8 | the planned step |
| 6 | 2 of 5 sessions done | **repeat week 6** (the block becomes 13 weeks) |
| 7 | effort mostly 8 | the planned step (stairway week 7, the first late step: chest 4.39 %) |
| 8 | effort mostly 9 | hold |
| 9 | effort mostly 8, 'Felt a PAIN' on the seated DB shoulder press | the planned step; side delts 0 %; the press is swapped in category to a seated machine shoulder press with the same sets (UNI-08; R2-LIB-07 addition) |
| 10-12 | effort mostly 7-8 | the planned step |

| Wk | stair wk | level | step taken | quads | hams | glutes | chest | back | biceps | triceps | side d. | rear d. | calves | abs | resist. sets |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | 1 | 2 | - | 15 | 14.5 | 15.25 | 20 | 16 | 11.5 | 12.5 | 11.25 | 7 | 10 | 20 | 117 |
| 2 | 2 | 2.6 | 2.63 % / 2.6 % / 3 % | 15 | 14.5 | 15.25 | 20 | 16 | 11.5 | 12.5 | 12.25 | 7 | 10 | 20 | 118 |
| 3 | 3 | 3.2 | 2.63 % / 2.6 % / 3 % | 15 | 15.5 | 15.25 | 20 | 16 | 13.5 | 12.5 | 12.25 | 7 | 10 | 20 | 121 |
| 4 | 4 | 3.8 | 4.63 % / 3 % / 3 % | 16 | 15.5 | 15.5 | 20 | 16 | 13.5 | 12.5 | 12.25 | 7 | 10 | 20 | 122 |
| 5 | 5 | 4.4 | 0 % / 0 % / 0 % | 15 | 15.75 | 16.25 | 20 | 16 | 13.5 | 12.5 | 12.25 | 7 | 10 | 20 | 122 |
| 6 | 6 | 5 | 2.63 % / 2.6 % / 3 % | 15 | 15.75 | 16.25 | 21 | 16 | 13.5 | 12.75 | 13.25 | 7 | 11 | 20 | 125 |
| 7 | 6 | 5 | repeat | 15 | 15.75 | 16.25 | 21 | 16 | 13.5 | 12.75 | 13.25 | 7 | 11 | 20 | 125 |
| 8 | 7 | 6 | 4.39 % / 3 % / 3 % | 16 | 16.75 | 16.75 | 22 | 17 | 13.75 | 13 | 13.25 | 7.25 | 11 | 20 | 129 |
| 9 | 8 | 7 | 0 % / 0 % / 0 % | 16 | 16.75 | 16.75 | 22 | 17 | 13.75 | 13 | 13.25 | 7.25 | 11 | 20 | 129 |
| 10 | 9 | 8 | 4.39 % / 3 % / 0 % | 16 | 16.75 | 16.75 | 23 | 17 | 13.75 | 14 | 13.25 | 7.25 | 11 | 20 | 131 |
| 11 | 10 | 9 | 4.39 % / 3 % / 3 % | 17 | 17.75 | 17.25 | 24 | 18 | 14 | 14.25 | 15.25 | 7.5 | 12 | 20 | 138 |
| 12 | 11 | 10 | 4.39 % / 3 % / 3 % | 17 | 20 | 18.25 | 25 | 18 | 14 | 14.5 | 15.25 | 7.5 | 12 | 20 | 142 |
| 13 | 12 | 11 | 4.39 % / 3 % / 3 % | 17 | 20 | 18.25 | 26 | 19 | 14.25 | 14.75 | 15.25 | 7.5 | 12 | 20 | 144 |

**The coach's add order, live** (chest exercises in session order; Mon = bench / incline DB / machine press / cable fly; Fri = incline machine / flat DB / dips, where dips are triceps-led at 0.5 + 0.5; Thu = the two Focus slots):

| Week | Mon | Fri | Thu (Focus) |
|---|---|---|---|
| 1-5 | 3/3/2/2 | 3/2/2 | 2/2 |
| 6-7 | 3/3/**3**/2 | 3/2/2 | 2/2 |
| 8-9 | 3/3/3/2 | 3/**3**/2 | 2/2 |
| 10 | 3/3/3/**3** | 3/3/2 | 2/2 |
| 11 | 3/3/3/3 | **4**/3/2 | 2/2 |
| 12 | **4**/3/3/3 | 4/3/2 | 2/2 |
| 13 | 4/3/3/3 | 4/**4**/2 | 2/2 |

**What happened.**
- **Check-ins move the stairway, they do not replace it.** The "too easy" week gave chest one bigger step; the "10" and the "mostly 9" weeks held; the 2-session week was repeated, so the 12-step stairway took 13 calendar weeks. Two holds cost chest about two steps: it ends at **26** instead of the planned 28. Every other muscle stayed at ≤ 3 % a week. No deload was inserted at any point (R2-VOL-07).
- **Exercise-block change at week 5 (PER-02, UNI-02, CAT-13):** three walking-lunge sets moved to back squat and belt squat, one staggered-stance set to the barbell RDL, and the staggered-stance DB deadlift became a reverse hyper / 45-degree back extension (non-axial, R2-SES-02). Lower bilateral share 0.57 → 0.82, then 0.76 at the end.
- **Fallbacks:** biceps got a "Cable curl (bonus)" on the optional Thursday in week 3, side delts a "Machine side raise (bonus)" there in week 11 (R2-VOL-08 default), glutes a cable pull-through Focus slot (weeks 5 and 12), hamstrings a Nordic-curl Focus slot on Tuesday (week 12). In the last week quads, glutes, biceps and calves had no room left (time or per-session ceiling): they progress by load and reps.
- Total resistance sets 117 → 144 (+23 %); the largest weekly rise is +5.3 % (week 11). Sessions at the end: Mon 79, Tue 82, Wed 77, Fri 87, Sat 89, Thu 44 minutes (90-minute limit; no supersets needed).
- Pelland count at the end (indirect 0.5): glutes 24.5 vs 18.25 on the coach count; biceps 18.5 vs 14.25; triceps 20.5 vs 14.75. Both are stored (§3.1).

### 5.3 Tennis player (L2) off-season, 8 weeks, 80-90 % unilateral, 4 days × 90 min, **no check-in**

**Inputs.** Competitive tennis, off-season, 2 years of structured training. Base (field athlete off-season: lower × 0.7, upper × 0.5, round half up, then the floor): quads and hamstrings 11; **chest and back 7.5 → 10 (floor of 10, COACH-R2 VOL-06; flagged)**; rear delts 6 (own sets, shoulder health); calves 3 per leg day (12); glutes, biceps, triceps and side delts credit only (UNI-02). Caps = base × 1.3 (quads/hamstrings 14, chest/back 13, rear delts 8, calves 14; PROPOSED). 8-week stairway (no "start hard", R2-PER-03): λ quads/hamstrings 0.85, chest/back 0.92, calves 0.54. Days (≤ 12 exercises + the 2-exercise core block, R2-SES-04): Mon knee + pull with the clean-family lift (hang power clean); Tue hip + push with the snatch-family lift (single-arm DB snatch) and the week's only axial lift (trap-bar RDL); Thu knee + pull (hang clean pull); Fri hip + push (KB swing = ballistic, no glute credit, R2-VOL-05). Athletic slots 2 sets each (VOL-16).

**Week 1:**
- **Mon:** Pallof press 10/10 2 · Copenhagen side plank 2 · Lateral bound 2 · Medball rotational scoop toss 8 lb 2 · Hang power clean 3 · RFE split squat 8/8, contralateral DB 3 · 1-arm DB row 10/10 3 · Lateral lunge 8/8 3 · Half-kneeling 1-arm pulldown 10/10 2 · Single-leg calf raise 12/12 3
- **Tue:** Dead bug 2 · Side plank 2 · Seated box jump 2 · Medball side toss 8 lb 2 · Single-arm DB snatch 5/5 3 · Trap-bar RDL 2 · Alternating DB bench press 4 · Single-leg RDL 8/8, contralateral DB 3 · Push-up 2 · Nordic curl (assisted) 2 · Single-leg calf raise 12/12 3
- **Thu:** Pallof press 10/10 2 · Copenhagen side plank 2 · Skater hop 2 · Medball shot-put throw 8 lb 2 · Hang clean pull 3 · Lateral step-up 8/8 3 · Pull-up 3 · Cossack squat 6/6 2 · 1-arm cable row 10/10 2 · Reverse DB fly 2 · KB face pull 2 · Single-leg calf raise 12/12 3
- **Fri:** Dead bug 2 · Side plank 2 · Broad jump (stick) 2 · Medball overhead slam 10 lb 2 · KB swing 2 · 45-degree back extension 2 · 1-arm DB bench 8/8 2 · Slider leg curl 2 · Feet-elevated push-up 2 · Single-leg hip thrust 10/10 2 · Single-leg calf raise 12/12 3

| Wk | stair wk | level | step taken | quads | hams | glutes | chest | back | biceps | triceps | side d. | rear d. | calves | abs | resist. sets |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | 1 | 2 | - | 11 | 11.5 | 6.5 | 10 | 10 | 2.5 | 2.5 | 0.5 | 5.25 | 12 | 16 | 60 |
| 2 | 2 | 2.93 | 2.54 % | 11 | 11.5 | 6.5 | 10 | 10 | 2.5 | 2.5 | 0.5 | 5.25 | 12 | 16 | 60 |
| 3 | 3 | 3.86 | 2.54 % | 11 | 11.5 | 6.5 | 10 | 10 | 2.5 | 2.5 | 0.5 | 6.25 | 12 | 16 | 61 |
| 4 | 4 | 4.79 | 2.54 % | 11 | 11.5 | 6.5 | 10 | 10 | 2.5 | 2.5 | 0.5 | 6.25 | 12 | 16 | 61 |
| 5 | 5 | 6.34 | 4.23 % | 12 | 11.5 | 6.75 | 11 | 11 | 2.75 | 2.75 | 0.5 | 6.25 | 12 | 16 | 64 |
| 6 | 6 | 7.9 | 4.23 % | 12 | 12.5 | 7 | 11 | 11 | 2.75 | 2.75 | 0.5 | 6.25 | 13 | 16 | 66 |
| 7 | 7 | 9.45 | 4.23 % | 13 | 12.5 | 7.25 | 12 | 12 | 3 | 3 | 0.75 | 7.5 | 13 | 16 | 70 |
| 8 | 8 | 11 | 4.23 % | 14 | 13.5 | 7.75 | 13 | 13 | 3.25 | 3.25 | 0.75 | 7.75 | 14 | 16 | 75 |

Lower-body bilateral share **0.22** in weeks 1 and 8 (trap-bar RDL and 45-degree back extension are the only bilateral lifts: 78 % unilateral, the low edge of his 80-90 %); upper 0.27. 10-12 listed exercises a day (≤ 14 with the core block, R2-SES-04); every muscle group trained on a day has 2-3 exercises (glutes and arms are credit-only, so not "trained" by this rule).

**Athletic budget (separate; never in the table above).** Plyo share counted over jump **and** throw sets (COACH-R2 ATH-01): tennis ends at 50 % and starts 15 points more ballistic (35 %); Receive-Create stages on the 8-week timing 1-2 / 3-5 / 6-8 (COACH-R2 ATH-03).

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

**What happened.** Resistance volume follows the 8-week stairway and peaks in week 8 (60 → 75 sets, +25 %; largest weekly rise +7.1 % in week 8), with quads, chest, back and calves landing on their caps in the last week. Sessions run 79-83 minutes in week 8. The athletic side carries the "drive" (ballistic → plyometric, stage 1 → 3): contacts rise 48 → 140 a week, 24 → 70 per plyo day, inside his own observed sessions (18-77 contacts) and under NSCA's L2 guide (100).

### 5.4 Maintenance flow (the same bodybuilder after 5.2)

**After a completed block** the person chooses: a transition week (deload) or a maintenance phase, then a new block (COACH-R2 VOL-07, PER-06).
- **Transition deload** = about half of the hardest week (week 13 of 5.2): **80 resistance sets** (quads 11, hamstrings 10.5, glutes 9.75, chest 14.5, back 11, biceps 7.5, triceps 8.75, side delts 7.75, rear delts 4.5, calves 6), same exercises, 3+ RIR.
- **Maintenance phase while travelling** (length picked: 4 weeks; extendable): base = average of the last 4 stairway weeks of 5.2 (138.8 resistance sets/week).

| Factor | quads | hams | glutes | chest | back | biceps | triceps | side d. | rear d. | calves |
|---|---|---|---|---|---|---|---|---|---|---|
| 50 % (vacation, limited kit) | 8 | 9 | 9 | 12 | 9 | 7 | 7 | 7 | 4 | 6 |
| **60 % (travel, hotel gym)** | 10 | 11 | 11 | 15 | 11 | 8 | 9 | 9 | 4 | 7 |
| 70 % (planned maintenance; older adults' floor) | 12 | 13 | 12 | 17 | 13 | 10 | 10 | 10 | 5 | 8 |

**4 × 60-minute hotel-gym week at 60 %** (flat, RIR 2-3, machines and DBs; R2-SES-05 also holds here: every trained group has 2+ exercises): 82 resistance sets (59 % of the base); quads 10, hamstrings 10.75, glutes 10.25, chest 15, back 11, biceps 7.75, triceps 8.75, side delts 8.5, rear delts 5.5, calves 7; 49-59 minutes with supersets.
- **Mon:** Dead bug 2 · Leg press 2 · Machine chest press 4 · DB split squat 10/10 2 · Incline DB press 3 · Leg extension 2 · Cable pushdown 3 · Overhead DB triceps extension 3 · Calf raise 4
- **Tue:** Pallof press 2 · Seated cable row 3 · DB Romanian deadlift 3 · Lat pulldown 3 · Leg curl 2 · DB curl 3 · Hammer curl 2 · Reverse DB fly 2 · Face pull 2
- **Thu:** Dead bug 2 · Hack squat or Smith squat 2 · Flat DB press 4 · Step-up 10/10 2 · Cable fly 4 · DB side raise 4 · Cable side raise 4 · Calf raise 3
- **Fri:** Pallof press 2 · Chest-supported DB row 3 · Hip thrust 4 · Neutral-grip pulldown 2 · 45-degree back extension 2 · Cable glute kickback 10/10 3 · Leg curl 2

**At the end of the 4 weeks** the app asks: keep going on maintenance (add weeks), change the plan, or start a training block (COACH-R2 PER-06). If he starts a block: start × 1.05 and cap + 1 (COACH-R2 VOL-06): chest 19 → 20 (cap 29), other big muscles 15 → 16 (cap 23), small muscles 12 → 13 (cap 23). The maintenance phase replaces the transition deload. Maintenance is not floored at 10 (it is maintenance by definition); 50-70 % of this base is still well above the research minimum to keep muscle in a younger adult (§2.4); for an older adult the engine keeps ≥ 70 %.

**If he had cancelled the block** (for example in week 9, after the hold weeks), the same maintenance phase would follow, and the new block would start at the **same** start as the cancelled one (19 / 15 / 12; PROPOSED).

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

---

## 7. Decisions waiting for the coach (PROPOSED - PENDING COACH APPROVAL)

**Settled by round 2 (removed from this list):** small-muscle starts (VOL-04), rear delts 4 / 6 / 8 (VOL-04), glute counting (VOL-05), caps and the next-cycle step (VOL-06), non-priority ≤ 3 % (VOL-06), deload size and its place between blocks (VOL-07), the step table (VOL-01), the stage name and timing (ATH-03), the plyo:ballistic table (ATH-01), the core opener (SES-03), the field-athlete cap (SES-04), the yearly quarters (PER-01), the two output modes (GEN-01). **Retired:** the readiness score and its weights, the intake rate defaults, acclimation caps and the 8-week start (GEN-04, PER-03, PER-04).

**Still waiting:**
1. **The stairway numbers:** 3 % before the halfway week and 5 % after it, and the λ scaling that makes the planned peak land on the cap in the last week (§3.7.1).
2. **Check-in read against the stairway:** in the first half "perfect" = 3 % and "too easy" = 5 %; his +5 % / +7 % apply after the halfway week (§3.7.3).
3. **The life column dropped** from his approved step table because of R2-GEN-04 (§3.7.3).
4. **Effort drift 3 → 1 RIR inside his 1-3 RIR band** to make the weeks feel like 2 → 11 (§3.7.2; VOL-13 said no planned RIR ramp).
5. **'Failed' answer** handling (hold, -1 set, lighter) and **a "10" lowering that muscle's plan by one set** (§3.7.3).
6. **Repeated week makes the block one week longer** (§3.7.3); **block-at-risk prompt** wording and triggers (§3.12).
7. **After a cancelled block, the new block starts at the same start** (§3.12).
8. **Rear delts vs the floor of 10:** floor read on the SHOULDERS/TRAPS group (§3.3).
9. **Floor of 10 for field athletes' chest and back** (raises 7.5 to 10; §3.4) and **small muscles on the same caps as big ones** (§3.3).
10. **Pro setting:** L3 only, one priority muscle, up to 35 sets, check-in required (§3.2).
11. **R2-SES-05 details:** groups = his FOCUS headers (shoulders together), calves keep one exercise × 3 sets per leg day, the generator consolidates a muscle onto fewer days rather than one exercise per day (§3.10).
12. **Time model:** 1-minute changeover per exercise (0.5 in a superset pair) on top of v1's per-set minutes (§3.10).
13. **R2-VOL-08 default** (to re-ask in plain words): alternate the first exercise between the two weekly exposures; bonus on the optional day, else on a day that already trains that muscle group (§3.9).
14. **Older adults (60+) steps ≤ 3 %** (an age rule, not a lifestyle input; §3.4). Note for the re-ask: the R2-VOL-03 proposal that he answered with "No ... the plan doesn't change" listed 60+ among the 3 % defaults; his reason was the missing check-in data, not age, so this stays a PROPOSED plan-shape rule until he confirms it.
15. **Calves to 10 a week** with a 4th set or the optional-day 'Calves' slot when there are fewer than 4 leg days (§3.3).
16. **Barbell power / hang-power catches** follow the 3-5-rep rule of the full squat lifts (§3.13).
17. From v1, still open: L3 definition (§3.2); share numbers he did not give (sprinters, strength-type athletes, baseball, combat, beginners, older; the 20-point pain shift; ~70 % contralateral for COD athletes; the bodybuilder upper-body 80-90 %); per-session limits (11 / 14 fractional, max 4 / 5 sets per exercise); glutes credit-only for field athletes; contacts per session caps; the optional-day size of 6; maintenance factors 50 / 60 / 70 % and the base.

---

## 8. Sources

**Coach and sheets.** `coach_answers_round2.md` (round 2, 2026-10-08; authoritative over round 1), `coach_answers_full.md` (138 of 140 answers, 2026-10-08), `coach_answers.md`; `synthesis/03_volume_dosing.md`, `03_volume_rules.json`, `generator_spec_v0.json`, `09_generator_inputs.md`; BYOP EFFORT and HOW IT FELT menus (`dumps/BYOP/`, 'MASTER EXERCISE LIBRARY' AX8:AY17). Google Sheets were not opened or changed.

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
