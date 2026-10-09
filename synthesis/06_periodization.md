# 06 · Periodization & progression model (Blaze Camp) · v1.1

**What this is.** This is the model of *how the coach moves a program through time*: which plan lengths exist, how the weeks inside a plan are shaped, which levers he pulls week to week, where deloads, tests and maintenance blocks go, and how athletes move through a season and a year. It is written for two readers:
* **the coach**, to check that it really is how he thinks (every claim is tagged and cited);
* **the engineer**, who needs rules precise enough to encode.

The machine-readable twin is `06_periodization.json` (same content, plus the v1.1 stairway grids and expanded skeleton weeks as data).

**Version.** v1.1, 2026-10-08. This version applies the coach's **round-2 answers** (`coach_answers_round2.md`) on top of v1. **Authority order: round-2 answers > round-1 answers (`coach_answers_full.md`) > everything else** (sheets, team decisions, research). It also answers his request of the same day to cover every popular US sport, swimming included, and to give the general population an athletic option (pickleball, HYROX). The big changes: every plan is a **stairway** (small steps first, a little bigger after halfway, hardest weeks last); **no deload or maintenance week inside a block** (cancel -> maintenance -> new block); maintenance of a chosen, extendable length; the gen-pop year approved and tunable; tests before and after only, submaximal from zero; and the approved athlete numbers (Receive-Create stages, Olympic frequency, in-season reductions, plyo shares, aerobic counts). The v1.1 changelog is the next section; the body of the file (tables, examples, JSON) has been updated in place.

*History (v1):* v1, 2026-10-08. The coach has answered 138 of 140 questions (`coach_answers_full.md`; earlier chat statements in `coach_answers.md`). **His answers are authoritative: they override every inference from the sheets and every earlier team decision.** This version applies PER-01 to PER-11, PRG-04, VOL-06 and GEN-05, plus every other answer that touches progression (listed in the next section). The observed evidence (sections 2, 3.1 and 8.3) is kept as the record of what his sheets show; where an answer reinterprets it, a **v1** note says so. Weekly-set numbers follow `12_volume_algorithm_v1.md` (the volume engine); this file owns the time structure (plan modes, phases, blocks, deloads, tests, seasons, the year).

**Status tags used everywhere**
* **OBSERVED**: in the sheets. The tab and cells are cited, and labels are quoted verbatim with the coach's typos ('INTERMIDIATE', 'CLERANCE', 'RECCOMENDED', 'mi').
* **OBSERVED-ADAPTED**: an observed shape that has been re-parameterised, for example for a different level base or compressed into fewer weeks.
* **COACH-ANSWER <ID>**: the coach's own answer to question <ID> in `coach_answers_full.md`. A RIGHT verdict with no text makes our stated assumption his rule.
* **COACH-R2 <ID>**: his round-2 answer (`coach_answers_round2.md`, IDs R2-VOL / R2-SES / R2-ATH / R2-LIB / R2-PER / R2-GEN, plus the leftovers LIB-10 and LIB-12). Round 2 outranks round 1. A RIGHT with no text makes our round-2 proposal his rule.
* **COACH-R2 REQ**: his chat request of 2026-10-08, quoted in section 8.2.6 ('all of the different popular sports in the United States ... Include swimming as well'; gen pop wanting 'high rows [HYROX] and pickleball ... to stay athletic and active').
* **INFERRED**: analyst reasoning from observed data. The coach should confirm it.
* **SCIENCE**: external literature (section 12).
* **PROPOSED - PENDING COACH APPROVAL** (short: **PROPOSED**): our design where he left a gap or asked us to propose. It needs his OK before it ships.

**Sources.** The decodes in `analysis/programs/` (BYOP aesthetics / athletic / PPL-bootcamp; MASTER_MODEL gym, athletic+boxing, baseball, crossfit+tracks), `analysis/reference/` (specialty cheat sheets, Sheet23, RESISTANCE PATTERNS) and `analysis/library/` (L1-L4), spot-checks against `dumps/`, the coach's answers (`coach_answers_round2.md` first, then `coach_answers_full.md` and `coach_answers.md`) and the volume engine (`synthesis/12_volume_algorithm_v1.md` / `.json`). No Google Sheet was opened for writing or modified. An adversarial check of this v1 against every coach answer is logged at the end ('v1 verification log').

**Terms used in the tables**
* **Vol idx** = weekly hard *resistance* sets ÷ week-1 sets × 100. When the slot count does not change, this equals sets per exercise ÷ week-1 sets per exercise × 100.
* **Ref sets** (v1.1 stairway grids, section 7) = weekly hard sets of one reference **big** muscle at the level start (L1 10, L2 15, L3 20; COACH-ANSWER VOL-01), moved by the planned stairway (3 % to the halfway week, then 5 %, multiplied by one factor λ per level so the peak lands on the cap in the last week; the method and numbers of `12_volume_algorithm` v1.1 §3.7.1, PROPOSED) and capped at the level cap (L1 14, L2 22, L3 25; approved in R2-VOL-06, customizable). Whole sets are placed while the planned target is at least one set above the current sets. Computed by `p06v11/curves.py` (session scratchpad); the curves reproduce 12's own table.
* **Training block** = one stairway unit (a 12- or 8-week block, a year block, one week-by-week stairway): what the coach means by 'a block' in R2-VOL-07 (completed or cancelled as a whole). **Exercise block** = the 4-6-week stretch inside it where exercises stay fixed (PER-02): 1-4 / 5-8 / 9-12.
* **Stair level** = how hard a week should feel on his 2 -> 11 scale (R2-PER-05): week 1 = 2, last week = 11. A display number (PROPOSED), computed with second-half steps weighing 5/3 of the first-half steps (the same display as 12_volume_algorithm v1.1 §3.7.2).
* **Total idx** (athlete tables only) = all working sets including plyo / Olympic / sprint sets (excluding med-ball throws and conditioning) ÷ week 1 × 100.
* **Counting (v1)**: one hard set credits **1.0** to the main mover and **0.25** to each helper (COACH-ANSWER VOL-09); dips 0.5 triceps + 0.5 chest (COACH-ANSWER LIB-16); a 10/10 unilateral set = **1 set** (COACH-ANSWER UNI-01). Athletic sets (plyos, ballistics, throws, Olympic lifts, sprints) **never** count toward muscle volume; they have their own budget (COACH-ANSWER VOL-10). v0 used 0.5 for synergists; the observed counts in section 2 are sets per exercise and are not affected. **v1.1:** KB swings are ballistic/athletic and never count as glute volume; compounds credit glutes 0.25; a thruster = 1.0 quads, 0.5 shoulders, 0.25 glutes (COACH-R2 R2-VOL-05).

---

## v1.1 - round 2 applied

Every change below comes from the coach's round-2 answers (`coach_answers_round2.md`, read in full) or his request of 2026-10-08. 'Where' points to the section that now carries the rule. Numbers that he did not give (step sizes, phase weeks of the 8-week plan, the stair-level display, the season allocation) stay PROPOSED.

### What changed in v1.1 (by round-2 ID)

| # | Change | Question ID | Where |
|---|---|---|---|
| 1 | Every training block is a STAIRWAY: gradual weekly steps, smaller in the first half, a little bigger after the halfway point ('but not too much'), hardest weeks last, for every plan length. 12-week: HARDEST = the last 4 weeks (9-12, 'brutal'); 8-week: the same stairway (the v1 '4 adapting + 4 driving' split and the x1.10 'start hard' are retired). Planned steps (PROPOSED numbers, the same as 12_volume_algorithm v1.1 §3.7.1, which owns the set math): 3 % to the halfway week, 5 % after; when a muscle's cap would come early, all its steps shrink by one factor λ so the peak lands on the cap in the last week (12-week λ: L1 0.76, L2 0.87, L3 0.50); older adults (60+) at most 3 %; nothing above 7 % is ever planned. | R2-PER-03, R2-PER-04 | §1.1, §4.2, §7.0-7.2, §8.0-8.1; JSON plan_length_model.stairway, grids, skeletons |
| 2 | 'Start at a 2, end at an 11' is how hard the week feels (overall volume and loading), not a set count: week 1 feels like a 2, the last week like an 11 ('a little bit past your limits'). Every week at least one dial climbs (a set, load or reps, or the RIR target); a 2-11 'stair level' is printed on each week (display PROPOSED). Advanced lifters at the set ceiling climb by heavier loads, intensifiers and a rotating priority muscle (approved proposal). | R2-PER-05 | §1.1, §5.2, §7.0.1, §7.4 |
| 3 | No check-in = no adaptation: the plan runs its planned stairway unchanged ('There is no data to go off of'). The v1 intake-based starting rate (3 % for stress, short sleep, physical job, 60+, layoff or pain; 'target-seeking' smallest rate) is retired: nothing in the stairway depends on sleep, stress or life. | R2-VOL-03, R2-GEN-04 | §1.1, §11, §13 |
| 4 | The optional weekly check-in picks the step from EFFORT, COMPLETION and PAIN only (the approved step table without its 'life' column; RESOLUTION FLAGGED, see below): on target (7-8) = the planned step; too easy (mostly 1-6) = the planned step + 2 points (never above 7 %); 9 = hold; any 10 ('the max I could do, but successful') = hold and -1 set on that day; under half the sessions = repeat the week; pain = pain protocol. A separate 'failed' option may sit next to 10. The v1 readiness score (with a 0.20 life weight) is retired. | R2-VOL-01, R2-VOL-02, R2-GEN-04, R2-GEN-01 | §7.0.1, §11 |
| 5 | No deload or maintenance week inside a block: blocks are completed. The v1 triggered mid-block deload (D6) is retired; its signals now only OFFER 'cancel this block' and the person or coach decides. Cancel -> maintenance phase -> a whole new block from week 1. | R2-VOL-07 | §6 (D2, D3, D6), §7.0.2, §11 |
| 6 | Between two completed blocks: one recovery week at about half the sets of the hardest week, same exercises, 3+ RIR (approved: 'week 1 of the next cycle is a deload'). It sits between the blocks and does not shorten the next block's stairway (counting PROPOSED; 14.3 #2); none after a maintenance phase. A maintenance phase at the end of a block only when the person or coach asks for it. | R2-VOL-07 | §6 D1-D3, §7.0.2 |
| 7 | Maintenance phase: the user picks its length (default 4 weeks) and can add weeks; at its end the plan stops and asks 'Keep maintaining / change your plan / start a training block'. Dose stays 50-70 % of the last block's final 4 weeks (PER-01) and is not floored: the floor of 10 sets (R2-VOL-06 'I don't think anybody needs less than 10') applies to training blocks, not to maintenance (12_volume_algorithm v1.1 §3.3; 14.3 #4). | R2-PER-06, R2-VOL-07, R2-VOL-06 | §6 D4, §7.3, JSON plan_length_model.maintenance |
| 8 | Next block after a COMPLETED block: start x1.05, cap +1 set (never above 25; priority 30), all customizable (approved). After a CANCELLED block: the same start. While 1-2 priority muscles are pushed, the others grow at most 3 %/week (approved). | R2-VOL-06, R2-PER-05 | §6 D12, §7.4 |
| 9 | Pre-season = the 4-6-week 'season change' maintenance-type block: about 60 % of the off-season's sets (flat), more speed and power, ending with a 1-2-week taper before the first game (approved); its length can be changed. The tool works out off-, pre- and in-season from the season start date plus practice and game days. | R2-PER-06, R2-GEN-05 | §8.2.0, §8.2.1; JSON athlete.season_calendar_v1_1, skeletons.ATHLETE_PRE_6 |
| 10 | Receive-Create stages approved: RC1 Land -> RC2 Land & Go -> RC3 Repeat. 12-week: weeks 1-3 / 4-7 / 8-12; 8-week: 1-2 / 3-5 / 6-8; restart at RC1 each off-season; stay put in maintenance blocks (pre-season included); intermediate and advanced athletes may start at RC2. (v1 used 1-2 / 3-5 / 6+.) | R2-ATH-03 | §3, §5.2, §8.2.2, §9.1, skeletons |
| 11 | Olympic lifts: up to 4 days a week; clean-family days count as squat-pattern (knee-dominant) days and snatch-family days as hinge-pattern days ('snatches a little bit more hingy than squatty'; OBSERVED basis: BASEBALL Block 2 Mon/Thu cleans, Tue/Fri snatches). In-season a light 2 x 3 piece (hang power clean or DB snatch), dropped in heavy game weeks. Full squat cleans/snatches 3-5 reps per set at the same weekly reps; DB/KB and hang-pull variants keep the 4 x 8 -> 4 x 4 ramp. Weight by RIR/RPE and bar speed ('these are for power output'); % only with a tested max of that exact lift; competitive weightlifters get their own programming. 60+: none by default (an option, with a warning); youth from the floor from about 14 after a hang block. | R2-ATH-04, R2-ATH-05, R2-GEN-06, R2-ATH-08 | §5.4, §8.2, §9.1; JSON intensity_model.olympic_v1_1 |
| 12 | In-season, game-heavy sports (basketball, volleyball, soccer, football, hockey): gym plyos at about half, no extra change-of-direction work, sprints only for speed athletes, and the one hard gym day at least 48 h before a game (approved). | R2-ATH-07 | §6 D11, §8.2.1, skeletons.ATHLETE_IN_2WK |
| 13 | Plyo:ballistic shares approved (plyometric share of jump and throw work at the END of a block: sprinters 75 %; volleyball, soccer, football skill 60 %; basketball, tennis, football big-skill, weekend warriors 50 %; baseball, softball, hockey, linemen, MMA 40 %; boxing, karate, kickboxing, wrestling, BJJ, golf 25 %); each block starts 15 points more ballistic. Ballistic vs plyometric jump lists approved. | R2-ATH-01, R2-ATH-02 | §8.2.5, §9.1 |
| 14 | Aerobic sessions approved: athletes off-season 2-4 by sport (baseball, softball, sprinters 2; basketball, volleyball, football, tennis, golf, boxing, BJJ 3; soccer, hockey, kickboxing, karate 3-4; MMA, wrestling 4), pre-season 2, in-season 2 (ATH-07), powerlifters 2 easy (Orange); aesthetics 4 including a second easy Orange, plus optional walks. Every count can be moved up or down by the user. | R2-ATH-06, R2-SES-06 | §3, §8.1, §8.2 |
| 15 | The yearly plan is approved as the GEN-POP 'stay in shape' plan: Jan-Mar hard work + more cardio, start cutting, sets stay at the starting level; Apr-Jun summer shape (keep losing fat while building a little muscle); Jul-Sep maintain at about 70 %; Oct-mid-Dec build muscle, less cardio; last 2 weeks of December automatic maintenance. Summer follows the user's hemisphere; users mark their own holiday and vacation weeks (they switch to maintenance); everything is tunable (re-order or change blocks, more or less cardio, e.g. a winter powerlifting-style block). Athletes follow their season instead. | R2-PER-01, R2-PER-02 | §7.6; JSON plan_length_model.yearly |
| 16 | Testing: before the block (or in week 1) and at the end (last week, instead of that week's top sets), never during the block. Anyone who has not completed a training block tests submaximally (5RM or 3RM; cardio and speed at 80-90 % effort), never a 1RM or a max-effort mile from zero. Menu and reminders (block start, 7 days and 1 day before) approved. The '21.6 mile run' is removed from plans and tests. | R2-PER-07, R2-LIB-06 | §6 D7, §6.1; JSON testing |
| 17 | Spine: heavy squat and heavy deadlift on two different days; non-axial hinge, leg press or belt squat on the other lower days; the counted list of axial lifts is approved. This replaces v1's 'squat once a week'. | R2-SES-01, R2-SES-02 | §8.0, §10.1 |
| 18 | Session rules carried into the overlays: core opens light (2 exercises x 2 sets, short of failure) and core supersets or monster sets may be added anywhere; field athletes up to 12 exercises + the 2-exercise core block; full-body days use 2-4 exercises per muscle (never 1), so they can run longer. | R2-SES-03, R2-SES-04, R2-SES-05 | §3.1 L15, §8.0 |
| 19 | Between exercise blocks the plan may change ONE detail of a library exercise (hand, grip, stance, implement, range), shown as e.g. 'Reverse lunge - dumbbell in opposite hand'; it never invents an exercise. | R2-LIB-01 | §10.1 |
| 20 | Every popular US sport, swimming included, is mapped to a season type (game-heavy team, diamond, meet/championship with a taper, combat with a date, tournament, event race, strength/physique meet, seasonal outdoor) with its periodization rules. Gen-pop 'stay athletic and active' (pickleball, HYROX and other recreational activities) gets the weekend-warrior athletic overlay inside the gen-pop stairway or year, play days handled like practice/game days, and an optional event date with a 1-week taper. Per-sport numbers live in 04_profiles v1.1. | COACH-R2 REQ, R2-ATH-01, R2-ATH-06, R2-ATH-07 | §8.2.5, §8.2.6; JSON athlete.season_types_v1_1, athlete.stay_athletic_active_v1_1 |
| 21 | The sample plans he will grade are mapped to their mode and skeleton: swimming, football, soccer, CrossFit-style bootcamp, bootcamp, full-body aesthetics, push/pull/legs. | R2-GEN-07 | §8.2.7 |
| 22 | Weight guidance: reps-in-reserve language with the week-1 tip ('pick a weight you could lift 2-3 more times'); % only for barbell main lifts with a recent tested best and for Olympic lifts with a tested max of that lift. | R2-GEN-06 | §5.4 |

### Resolutions flagged (answers that pull against each other)

| Topic | Answers in tension | Resolution used in this file |
|---|---|---|
| Check-in 'life' column | R2-VOL-01 vs R2-GEN-04 | R2-VOL-01 approved a step table with a 'life' column; R2-GEN-04 rejects every sleep/stress/life input ('I just need the workouts here'). The life column is removed: the step comes from effort, completion and pain only. The intake has no lifestyle questions. |
| Early steps with check-ins | R2-VOL-01 vs R2-PER-03 | The approved table gives +5 % (on target) and +7 % (too easy); the stairway wants smaller steps early. Resolved as in 12_volume_algorithm v1.1 §3.7.3: the check-in reads against the stairway: on target = the planned step, too easy = planned + 2 points (max 7 %). With standard steps that is +3 % / +5 % in the first half and exactly his table (+5 % / +7 %) from halfway (PROPOSED; 14.3 #3). |
| Holiday weeks vs 'never in the middle of a block' | R2-PER-02 vs R2-VOL-07 | Marked holiday/vacation weeks switch to maintenance (approved) but maintenance is never thrown into a block (approved). PROPOSED: the year planner always places marked weeks BETWEEN blocks (blocks are shortened or shifted around them); a week marked after a block has started ends that block early (his cancel -> maintenance -> new block flow) unless the user removes the mark (14.3 #1). |
| Floor of 10 sets vs maintenance 50-70 % | R2-VOL-06 vs PER-01 | 'I don't think anybody needs less than 10 sets a week per muscle' (round 2) applies to training blocks. Maintenance phases, pre-season and in-season stay at their lower maintenance volume and are not floored, because they are maintenance by his own definition (PER-01, R2-PER-06); the same reading as 12_volume_algorithm v1.1 §3.3 (to confirm: 14.3 #4). |
| Recovery week: end of the old block or week 1 of the new one | R2-VOL-07 | He approved 'week 1 of the next cycle is a deload' and said maintenance weeks belong 'at the end of a block'. Both describe the same calendar week between two blocks. PROPOSED counting: it is an extra week, so the next block keeps its full stairway (a 12-week block + 1 = a 13-week quarter in the year plan) (14.3 #2). |
| Week-by-week needs the check-in vs no check-in = no change | R2-GEN-01 vs R2-VOL-03 | Week-by-week asks for the weekly check-in (approved); a week without one simply runs the planned stairway step. |
| Planned RIR drift vs 'no planned ramp' | R2-PER-05 vs VOL-13 | VOL-13 (round 1) confirmed 1-3 RIR at all times; R2-PER-05 asks for a felt climb from a '2' to an '11'. The drift stays inside 1-3 RIR (3 RIR in the first half, 2 after halfway, 1-2 in the last weeks, 1 plus intensifiers in the final week), the same as 12_volume_algorithm v1.1 §3.7.2, which flags it for round 3. |
| R2-VOL-08 not understood | R2-VOL-08 | The default stays (alternate the first exercise between the two weekly exposures; bonus exercise on the optional day). It is a placement rule owned by 12_volume_algorithm v1.1; it does not change any time structure here. |
| Rear-delt own sets 4/6/8 vs the floor of 10 | R2-VOL-04 vs R2-VOL-06 | Owned by 12_volume_algorithm v1.1 §3.3, which keeps the approved 4 / 6 / 8 direct rear-delt sets and reads the floor of 10 on his SHOULDERS/TRAPS group (side-delt work 10 / 12 / 15 + rear-delt work + face pulls, well above 10; INFERRED) - FLAGGED for round 3. Not a time-structure item: the reference curves here use a big muscle (start 10/15/20); a rear-delt curve (4 -> 8 at L1) runs the same stairway (12 v1.1 §3.7.1 table). |
| 60+ default: low ankle hops | R2-ATH-08 (proposal) vs R2-ATH-08 (his text), R2-ATH-02 | The approved proposal kept 'landing drills and low ankle hops' for 60+; his text says no Olympic lifts, plyos or depth jumps by default, as an option only; ankle hops are plyometric by his approved list (R2-ATH-02). Resolution: landing drills (the 'receive' stage) stay by default; low ankle hops become opt-in with the warning (as 12_volume_algorithm v1.1 and 03 already read it: 'when chosen'); 05_session_architecture v1.1 still says 'landing drills and low ankle hops are fine' (integrator). |

### v1 rules superseded in v1.1

| v1 rule | v1.1 rule | Question ID |
|---|---|---|
| 8-week: start x1.10 ('start hard'), weeks 1-4 ADAPT at <= 5 %, weeks 5-8 DRIVE (4 + 4) | 8-week stairway from the level start: ACCLIMATION 1-2 (L1 1-3, L3 1), DRIVE to week 5, HARDEST 6-8; steps 3 % weeks 2-4, 5 % weeks 5-8 (λ-scaled when the cap would come early); phase name ADAPT retired | R2-PER-03 |
| 12-week: DRIVE to week 9, HARDEST 10-12 (L3 9-12) | HARDEST = weeks 9-12 at every level ('the last 4 weeks are going to be brutal'); DRIVE ends at week 8 | R2-PER-04 |
| Static plan rate from the intake (default 5 %; 3 % if stressed, older, returning or in pain); 'target-seeking' smallest of 3/5/7 % | planned stairway, the same rule for everyone (3 % then 5 %, λ-scaled per muscle so the peak lands on the cap; older adults <= 3 %); no lifestyle input | R2-VOL-03, R2-GEN-04, R2-PER-03 |
| Readiness score R = 0.40 effort + 0.20 completion + 0.20 performance + 0.20 life | step table from effort, completion and pain, read against the stairway; no life input | R2-VOL-01, R2-GEN-04 |
| D6 triggered deload inside a block (2 holds, effort >= 9 twice, pain on 2+ slots, performance down) | no deload inside a block; the same signals only OFFER 'cancel this block' -> maintenance -> new block | R2-VOL-07 |
| Week-by-week: deload on triggers or after 12 loading weeks at the latest; needs logs | rolling stairways (12 weeks + a recovery week, then the next one a step up); the check-in is asked; a week without it runs the planned step | R2-VOL-07, R2-GEN-01, R2-VOL-03 |
| Maintenance block of a fixed 4-6 weeks | maintenance phase of a chosen length, extendable, with the end-of-maintenance prompt | R2-PER-06 |
| Yearly: quarter themes as transcribed (ambiguous); Q1 cycle with a <= 3 % rate; tests weeks 13, 26, 50; fixed northern calendar | approved gen-pop year: Q1 sets stay at the starting level, Q3 about 70 %, tests at the end of each training block (weeks 12, 25, 50); user's hemisphere; user-marked holiday weeks; fully tunable | R2-PER-01, R2-PER-02, R2-PER-07 |
| Tests only in the last week of the block | a baseline before the block (or in week 1) and a test in the last week; never mid-block; submax from zero | R2-PER-07 |
| Receive-Create stage weeks 1-2 / 3-5 / 6+ (PROPOSED) | 12-week 1-3 / 4-7 / 8-12; 8-week 1-2 / 3-5 / 6-8 (approved) | R2-ATH-03 |
| Olympic piece: one 4-week % ramp per block; in-season Olympic lifts an open question | up to 4 days/week, clean = squat pattern, snatch = hinge pattern; weight by RPE/RIR unless a tested max; full lifts 3-5 reps per set; in-season light 2 x 3 | R2-ATH-04, R2-ATH-05, R2-GEN-06 |
| Axial loading once a week: squat one day, leg press or belt squat the other | heavy squat and heavy deadlift on two different days; non-axial hinge / leg press / belt squat on the other days | R2-SES-01, R2-SES-02 |
| Pre-season: lower x0.6 / upper x0.4 of the start table, rate 0-3 % | about 60 % of the off-season's final 4 weeks, flat sets, more speed and power, 1-2-week taper | R2-PER-06 |
| Aerobic: off-season 2-3/week; aesthetics 4 + walks | off-season by sport (R2-ATH-06); aesthetics 4 incl. a 2nd easy Orange + optional walks; every count adjustable | R2-ATH-06, R2-SES-06 |
| Plyo share by sport start -> end (PROPOSED) | approved end-of-block shares; start = end - 15 points | R2-ATH-01 |
| Older clients: few plyos unless they ask | 60+: no Olympic lifts, plyos or depth jumps by default; an option with a warning to work with a fitness professional | R2-ATH-08 |
| '21.6 mile run' kept out of tests but flagged | removed from plans and tests | R2-LIB-06 |
| Fat loss: rate <= 3 % while in a calorie deficit (PROPOSED) | standalone fat-loss blocks use the standard stairway on the x0.8 start (floor 10); in the year's Q1 cut sets stay at the starting level | R2-PER-01; 12_volume_algorithm v1.1 |
| Static plan before logs: L1/L2 5 %, L3 3 % (so an advanced lifter's cap lands late) | λ peak-anchoring: every muscle's steps shrink so its peak lands on its cap in the last week | R2-PER-03, R2-PER-04; 12_volume_algorithm v1.1 §3.7.1 |

The v1 objects they replace are kept in `06_periodization.json > retired_v1`.

### What happened to the v1 pending items

| # | v1 pending item | Status after round 2 |
|---|---|---|
| 1 | Yearly quarter themes and calendar | APPROVED (R2-PER-01, R2-PER-02); §7.6 |
| 2 | Deload placement inside the 12- and 8-week shapes | DECIDED: never inside a block; one recovery week between blocks (R2-VOL-07); counting PROPOSED |
| 3 | 12-week split, acclimation <= 3 %, 8-week x1.10 / <= 5 % | REPLACED by the stairway (R2-PER-03, R2-PER-04); acclimation weeks kept as the first small steps |
| 4 | Maintenance factors by reason | band kept (PER-01); length chosen and extendable (R2-PER-06); not floored (the floor of 10 is for training blocks, 12 v1.1); split 50/60/70 still PROPOSED |
| 5 | Repeated cycles x1.05 / cap +1 | APPROVED (R2-VOL-06); advanced at the ceiling climb by load, intensifiers, priority (R2-PER-05) |
| 6 | Week-by-week rules | REPLACED: rolling stairways with a recovery week (R2-VOL-07, R2-GEN-01, R2-VOL-03) |
| 7 | RIR ramp inside 1-3 RIR | kept, now the 2 -> 11 stair (R2-PER-05); exact RIR per phase still PROPOSED |
| 8 | Strength %-template placement | re-mapped to the v1.1 phases (HARDEST 9-12); PROPOSED |
| 9 | Test catalogue, test week, reminders | APPROVED (R2-PER-07) incl. submax-from-zero; rest-of-test-week 50-70 % still PROPOSED |
| 10 | In-season dose | PARTLY: game-heavy reductions (R2-ATH-07) and the light Olympic piece (R2-ATH-04) approved; resistance factors PROPOSED |
| 11 | Pre-season = season-change block | APPROVED (R2-PER-06) |
| 12 | PRG-04 STARTING/MID/ADVANCED decision rule | still PROPOSED (not asked in round 2) |
| 13 | Fat loss: rate in a calorie deficit | year Q1 approved: sets stay at the starting level (R2-PER-01); standalone fat-loss blocks use the standard stairway on the x0.8 start (12 v1.1); the deficit cap is retired |
| 14 | Fight prep steps and taper | still PROPOSED (v0 Q14 open) |
| 15 | Name and weeks of the plyo stages | APPROVED (R2-ATH-03) |
| 16 | Speed-lift effort label | OPEN |
| 17 | Static vs adaptive output | APPROVED (R2-GEN-01): works with no tracking; optional check-in; no check-in = no change (R2-VOL-03) |
| 18 | Variety preference switch (A/B weeks) | still PROPOSED |
| 19 | Plyo share by sport | APPROVED (R2-ATH-01) |
| 20 | Olympic reps for full lifts | APPROVED (R2-ATH-05) |
| 21 | 8-week split 4 + 4 or 3 + 5 | ANSWERED: neither; a stairway (R2-PER-03) |
| 22 | Small v0 items (HYBRID header, CrossFit grid overlap, AMRAP minutes, Olympic % basis) | OPEN, except the Olympic % basis: that lift's own 1RM (R2-ATH-05) |
| 23 | Release staggering (total < 10 %/week) | still PROPOSED and still needed: every L1 muscle now starts at 10 (12 v1.1), so they release together and the L1 total would rise +10.0 % in week 6 (12-week) and week 5 (8-week) |
| 24 | Fat-loss skeleton curves | REPLACED: fat loss uses the standard stairway (12 v1.1) |
| 25 | Complexes inside a fight camp | OPEN (not asked in round 2) |

The round-2 questions of v1 (old 14.2) and their answers are in section 14.2; the genuinely new questions are in section 14.3.

---

## v1 - coach answers applied (history)

Kept as the v1 record. Every change below came from the coach's round-1 answers. Rows that round 2 replaced are listed in 'v1 rules superseded in v1.1' above; where a 'Where' section number is given, that section now carries the v1.1 rule.

### What changed (by question ID)

| # | Change | Question ID | Where |
|---|---|---|---|
| 1 | Plan lengths rebuilt. The v0 fixed shapes (8 weeks = 7 loading + deload/test; 12 weeks = 6 + week-7 mid deload + 5; 6 weeks = first half of the 12) are retired. v1 modes: 4-6-week maintenance/transition at about 50-70 % volume (vacation, travel, season change, moving); 8 weeks = 4 adapting + 4 driving hard, starting hard; 12 weeks (preferred) = 2-4 acclimation + 4-6 driving hard (not to the top) + hardest last weeks; repeated 12-week cycles start one level higher ('start at a 2 and end at an 11'); open-ended week-by-week mode; yearly mode with quarter themes and automatic holiday maintenance. | PER-01 | §1, §7, §8 |
| 2 | Deloads: the v0 fixed deload/test weeks (week 8 of 8, week 7 of 12, week 6 of 6) are retired with the shapes he rejected. Deload dose confirmed: about half the sets, same exercises, lighter load or 3+ RIR, no buy-out or finisher. Placement is PROPOSED and aligned with 12_volume_algorithm_v1 §3.12: triggered by the logs, week 1 of the next cycle, or replaced by a maintenance block. | PER-01, PER-05 | §6 |
| 3 | Weekly progression = 3, 5 or 7 % of a muscle's weekly sets, chosen by the PERSON's state (fatigue, life, response), coach-adjustable; 10 %/week is too much (hard ceiling). The v0 size tiers (big 3 % / medium 5 % / small 7 %), the focus 'one tier up' rule and the v0 worked example are retired. | VOL-04, VOL-05, UNI-05 | §4 |
| 4 | Rounding: bank the fraction every week and add a whole set when the bank reaches 1; the tool computes the percentages, not the client. | VOL-06 | §4 |
| 5 | Where a new set goes: 3-4 exercises per muscle per day; add to the first exercise in session order, then the next (2/2/2 -> 3/2/2 -> 3/3/2 -> 3/3/3 -> 4/3/3); small muscles at the end of a session get extra volume as a bonus exercise. | VOL-07 | §4 |
| 6 | Smooth weekly increases for hypertrophy and general clients; 2-week steps and waves for fight or competition prep. The v0 'STEP mode default for strength/athlete/hybrid' is retired; the confirmed strength %-template is the competition-style step pattern for main lifts. | PER-10, PER-09 | §4.3, §5.4 |
| 7 | Strength %-template confirmed (Olympic lifts 75 -> 80 -> 85 -> 90 % with 4x8 -> 4x6 -> 4x6 -> 4x4; main lift 80/80/85/85/90/90 % with RPE 7 -> 10) and placed inside the v1 12-week shape. He added 'I just want to make sure it's correct', so a science check is attached: the main-lift loads sit within about 1-4 percentage points of the RPE chart; the Olympic 4 x 8 @ 75 % is above common power guidance (3-5 reps per set at 75-85 %) for full catch lifts and is flagged for round 2. | PER-09 | §5.4, §8.1, §14.2 |
| 8 | Set counting: helpers 0.25 (not 0.5); dips 0.5 triceps / 0.5 chest; a 10/10 unilateral set = 1 set; athletic patterns (plyos, ballistics, throws, Olympic lifts, sprints) never count toward muscle volume. | VOL-09, LIB-16, UNI-01, VOL-10 | header, §4 |
| 9 | Blocks are 4-6 weeks; exercises stay fixed inside a block; the next block changes 1-2 small variables (grip, stance, implement, range of motion, rep range). A/B lead-lift weeks are an option for clients who want variety, not a default. | PER-02, PER-03 | §8, §10 |
| 10 | The second exposure of a slot in a week is a different exercise from the same category, and axial spinal loading happens once a week (squat one day; leg press or belt squat the other; deadlifts load the spine too). | PER-04, EQ-11 | §8, §10 |
| 11 | A slot moves up a level at the end of a block if it felt '8 - That was perfect' or easier with no pain. Exercise levels are still theoretical; do not over-rely on them. | PER-06, CAT-05 | §10 |
| 12 | Tests: the client or coach ticks what to test at the start of a block (strength, cardio, speed, ...) or 'No need for testing'; the plan schedules the test at the end of the block and reminds them. | PER-07 | §6.1 |
| 13 | Athlete seasons confirmed: off-season most volume (strength + plyos); pre-season more speed/power, less volume; in-season 2 days/week, low volume (sprints for speed athletes, strength maintenance or jumps for others; bilateral work minimal); post-season recovery and general work. | PER-08, UNI-10 | §8.2 |
| 14 | VOL 1 / VOL 2 / VOL 3 (compound 12-15 / 8-12 / 6-8 reps) = one rep phase per off-season block for every athlete. | PER-11 | §8.2 |
| 15 | Off-season STARTING / MID / ADVANCED: back-to-back blocks or athlete levels, 'depends on whatever is needed' (decision rule PROPOSED). | PRG-04 | §8.2 |
| 16 | Week-to-week adjustment from logged EFFORT and HOW IT FELT confirmed; the person-level readiness rate of 12_volume_algorithm_v1 replaces the v0 per-muscle autoregulation table. The GEN-03 'they should track it themselves' conflict is handled by a static vs adaptive output mode (PROPOSED). | GEN-05, GEN-03 | §11 |
| 17 | Effort: RIR is the model (1-3 RIR at all times, RPE explained alongside); 'MAX' = technical failure only on small-muscle or bodyweight work; never to failure on heavy compounds. A ramp inside the 1-3 RIR band across the phases is PROPOSED. | VOL-13, GEN-08 | §5 |
| 18 | Rest: hypertrophy 1-2 min (up to 3), strength 3-6 min, athletic as prescribed. | VOL-14 | §5.5 |
| 19 | Methods: MYO sets only on the last machine/isolation exercise; supersets are a fatigue/density tool (short time, advanced clients needing more stimulus, off-season VO2/mitochondrial work, beginners who do not fatigue); contrast / French contrast and complexes for intermediate+ athletes in the off-season only (heavy lift about 78-85 %). | VOL-15, ORD-05, ATH-12 | §3, §8 |
| 20 | No bands and no variable resistance (bands, chains, weight releasers, reverse-banded assistance) in any generator rule; banded/chained cells stay only as OBSERVED evidence. Speed lifts use straight weight ('FAST RPE6 or about 60-70%'). | EQ-01, EQ-07, EQ-08, EQ-12 | §3, §5, §8, §9 |
| 21 | Plyo 'zones' are not zones: they are method stages, receive & pause -> receive then create -> repeated receive/create (name pending). Programs start more ballistic and become more plyometric; the plyo:ballistic ratio follows the sport's ground-contact time; unilateral plyos are harder than bilateral. Davidson zones (rotation biases) do not apply to plyos. | CAT-10, CAT-11, ATH-01, ATH-02 | §2.4, §3, §9 |
| 22 | Olympic lifts for everyone in athletic training (beginners: DB/KB snatches, hex-bar jumps, hang pulls/cleans; intermediate+: full lifts; youth may lift from the floor). Full lifts are named 'Squat Snatch', 'Squat Clean', 'Squat Clean & Jerk'; push press is easier, push jerk intermediate/advanced. | ATH-10, ATH-09, LIB-07, LIB-13 | §9, §8.2 |
| 23 | Aerobic sessions per week: 3 general/fat loss, 2 athletes in-season, 4 aesthetics/bodybuilders, plus long walks after workouts; any erg works, tracked by calories, time or distance. | ATH-07, EQ-14 | §8, §9 |
| 24 | Core first by default (warm-up), movable by the user; about 2 core exercises; calves 3 sets every leg day; rear delts get their own sets. | ATH-11, VOL-17 | §8 |
| 25 | Reps: small muscles 12-30, big muscles 5-15; 40-rep sets only as a CrossFit/AMRAP option (the FAT BURN 40-rep isolation ladder is not a generator default); client preference moves the reps on big compounds only; '12/10/8 -20' = pyramid 12 (mid) / 10 (heavier) / 8 (heaviest) then a light set of 20; '10/10' = per side. | VOL-11, VOL-12, PRG-07 | §2, §8 |
| 26 | Boxers/strikers: reduce (do not cut) pressing and arm volume in weeks of high punching volume. | ATH-04 | §8.2 |
| 27 | No medball work for aesthetics/bodybuilding clients except in the warm-up; medballs never over 20 lb; throws have no levels. | ATH-05, EQ-06, LIB-06 | §9 |
| 28 | Older clients: few plyos unless they ask; extra volume on constrained machines; never overhead squat, snatch, low-bar squat or depth jumps. No sex-based rules (age, foundation, goal, injuries decide). | ATH-09, EQ-03 | §8 |
| 29 | Bilateral:unilateral share spans 90/10 to 10/90 and moves across blocks: bodybuilders/powerlifters about 50/50 at the start (contra/ipsi health work in the first 2-4 weeks) -> 80/20-90/10; field/change-of-direction athletes 80-90 % unilateral; in-season minimal bilateral; pain adjusts it. | UNI-02, UNI-03, UNI-10, CAT-13 | §8, §10 |
| 30 | Pairing: same pattern (squat + lunge) for high-level/aesthetics clients, cross pattern for bootcamp; hip dominant + push and knee dominant + pull for full-body and bootcamp days. | UNI-06, UNI-11, ORD-06 | §8 |
| 31 | Session size: resistance-only 5-7 exercises; field athletes off-season up to 10-12 (2 core + 2-4 plyo/ballistic + 2-3 Olympic/power + 3-4 resistance); about 1.5 h (max 2 h) for athletes, bodybuilders and powerlifters, 45-60 min for general/weight loss. | VOL-08, VOL-16, VOL-17, UNI-09 | §3 |
| 32 | Bootcamp: timed circuits 3-5 rounds x 30-50 s, 5-7 stations, 35-45 min, 3-6 sessions a week; FAT BURN circuits are finishers after lifting. | PRG-03, PRG-11 | §8.1 |
| 33 | Levels L1/L2/L3 (novice = newby: under ~6-12 months; intermediate: consistent over a year; 6-12+ months off -> body treated as beginner, skills return fast; ex-pros at L1 only briefly). | PRG-05 | §7, §8 |
| 34 | CrossFit dose tables: FULL TIME = competitor, HALF TIME = class member. Half-marathon plan (Chris Hinshaw) used as-is. | PRG-10, PRG-12 | §2, §8.1 |
| 35 | 'JUSTICE LEAGUE' was a marketing name: the program is the weekend-warrior athletic program (non-competitive athletic adults and youth). Renamed everywhere outside verbatim cell quotes. | ATH-13, FIX-03 | throughout |
| 36 | Davidson zones are rotation biases (vertical = external-rotation bias; horizontal = internal-rotation bias, compressive); level reads from load position (front-loaded foundational, on the body intermediate, behind/overhead advanced; machines easier). | CAT-04, CAT-10 | §12 |
| 37 | 'camporini deadlift' and 'strap rotating in/out' are dropped from the generator (they remain as OBSERVED cell quotes). | LIB-09 | §2 |

### Still pending after v1

The v1 pending list (25 items) is now tracked in 'What happened to the v1 pending items' (v1.1 section above).

### Retired v0 rules and keys (for the integrator)

| v0 rule / key | v1 replacement | Question ID |
|---|---|---|
| plan_shapes['6'] (6 loading weeks = first half of the 12-week shape; standalone 5 + deload/test) | 4-6-week block = maintenance/transition at 50-70 % (no 6-week loading plan) | PER-01 |
| plan_shapes['8'] (7 loading weeks + week-8 deload/test) | 8 weeks = 4 adapting + 4 driving hard, starting hard; no planned deload | PER-01 |
| plan_shapes['12'] (weeks 1-6 + week-7 MID DELOAD + weeks 8-12) | 2-4 acclimation + 4-6 drive + hardest last weeks; no planned mid deload | PER-01 |
| volume_governor.size_tiers (LARGE 3 % / MEDIUM 5 % / SMALL 7 %), focus 'one tier up', worked example | one person-level rate 3/5/7 % from readiness (12_volume_algorithm_v1 §3.7) | VOL-05 |
| volume_governor.floors_ceilings (non-focus 20, focus 26, overreach 30-35) | level starts and caps (L1 10/14, L2 15/22, L3 20/25 big muscles; priority +4-6, cap ~25-30) | VOL-01, VOL-02, UNI-01 |
| volume_governor.algorithm 'deload = 0.6 x previous week; restart at the week-4 target' | deload = about half the sets; after a triggered deload resume at the volume of 2 weeks before | PER-05 |
| two_modes STEP (default strength/athlete/hybrid/packaged aesthetics) vs SMOOTH (focus muscles) | SMOOTH for hypertrophy/general; STEPS & WAVES for fight/competition prep and the strength main-lift template | PER-10, PER-09 |
| set_counting 1.0 prime / 0.5 synergist | 1.0 main mover / 0.25 helpers (dips 0.5/0.5); Pelland 0.5 kept only as a research comparison | VOL-09, LIB-16 |
| skeletons HYPERTROPHY_6, STRENGTH_6, FAT_LOSS_6/8/12 (beyond the observed 4 weeks), HYBRID_6, HYBRID_12, GENERAL_BEGINNER_6/8/12, ATHLETE_OFF_12, ATHLETE_OFF_6, ATHLETE_PRE_6, ATHLETE_IN_SEASON_6/12 | v1 skeletons = mode grid x family overlay (§8); observed programs kept as reference tables (§8.3) | PER-01 |
| D1_PLACEMENT_8, D2_PLACEMENT_12, D3_PLACEMENT_6 (fixed deload/test weeks) | D2/D3 v1 (no planned deload; triggers; week 1 of next cycle) and D7 tests by checkbox | PER-01, PER-05, PER-07 |
| deload dose '3 x 8 @ RPE ~7' and 'volume -25 to -50 %' | about half the sets, same exercises, lighter or 3+ RIR | PER-05 |
| autoregulation table (per-muscle EFFORT bands, governor hold) | person-level readiness rate + gates (12_volume_algorithm_v1 §3.7) and the pain protocol | GEN-05, VOL-05, VOL-03 |
| L12 'plyo ZONE' Z1/Z2/Z3 as zones | plyo method stages (receive & pause -> receive then create -> repeated); not zones | CAT-10, CAT-11 |
| accommodating resistance (bands, chains) as a strength/speed lever; reverse-banded plyos as the last rung | out of scope; straight-weight speed work | EQ-12, EQ-01 |
| Olympic lifts 'intermediate+ athletes off-season, optional piece' | everyone in athletic training; level picks the variant | ATH-10 |
| in-season default '4 days, Part C/D frozen at 4 sets, 4 x 8-10' (BASEBALL Block 3) | 2 days/week, low volume, rate 0, minimal bilateral (Block 3 stays as OBSERVED evidence) | PER-08, UNI-10 |
| complexes / contrast placed in pre-season | intermediate+ athletes, off-season only | ATH-12 |
| fat-loss isolation progression to 40 reps | 40-rep sets only as an AMRAP/CrossFit option | VOL-11 |

The retired v0 objects are kept in `06_periodization.json > retired_v0` for traceability.

---

## 1. The coach's progression brain on one page (v1.1)

### 1.1 His rules (coach answers, round 2 first)

These are the rules the generator follows. Each carries the question ID it comes from; details are in sections 4-11.

1. Plan modes chosen at intake: 12-week block (his preferred), 8-week block, maintenance phase (length chosen, extendable), week-by-week (rolling stairways) and the yearly gen-pop plan; prep (event/fight date) and season (competitive athlete) are overlays. No 6-week loading plan. (COACH-ANSWER PER-01; COACH-R2 R2-PER-01, R2-PER-06)
2. Every training block is a stairway: gradual weekly steps, smaller in the first weeks, a little bigger after the halfway point 'but not too much', hardest weeks last; 12-week: the last 4 weeks (9-12) are 'brutal'. It applies to every plan length. (COACH-R2 R2-PER-03, R2-PER-04)
3. 'Start at a 2, end at an 11' is how hard the week feels (overall volume and loading), not a set count: week 1 feels like a 2 and the last week like an 11, a little past the usual limits. Every week at least one dial climbs: a set, load or reps, or the RIR target. (COACH-R2 R2-PER-05; dial rule PROPOSED)
4. Planned steps (PROPOSED numbers, the same as 12_volume_algorithm v1.1, which owns the set math): 3 % to halfway, then 5 %; when a muscle's cap would come early, all its steps shrink by one factor λ so the peak lands on the cap in the last week; older adults (60+) at most 3 %; never above 7 % planned; the person's total weekly sets rise < 10 %. Phases: 12-week ACCLIMATION 1-3 (L1 1-4, L3 1-2) -> DRIVE to week 8 -> HARDEST 9-12; 8-week ACCLIMATION 1-2 (L1 1-3, L3 1) -> DRIVE to week 5 -> HARDEST 6-8. (COACH-R2 R2-PER-03, R2-PER-04; COACH-ANSWER PER-01, UNI-05)
5. No check-in = no adaptation: the plan runs its planned stairway (R2-VOL-03). The optional check-in decides the step from effort, completion and pain only: on target = planned step; too easy = planned step + 2 points (max 7 %); 9 = hold; 10 ('the max I could do, but successful') = hold and -1 set on that day; under half the sessions = repeat the week. No sleep, stress or life inputs anywhere. (COACH-R2 R2-VOL-01, R2-VOL-02, R2-VOL-03, R2-GEN-04; notch rule PROPOSED)
6. No deload or maintenance week inside a block: blocks are completed. Someone who cannot complete a block cancels it -> maintenance phase -> a whole new block from week 1. (COACH-R2 R2-VOL-07)
7. Between two completed blocks: one recovery week at about half the sets of the hardest week, same exercises, 3+ RIR; none after a maintenance phase; maintenance at the end of a block only if the person or coach asks. (COACH-R2 R2-VOL-07; COACH-ANSWER PER-05; counting PROPOSED)
8. Maintenance phase: length chosen and extendable; at its end the plan asks 'keep maintaining / change your plan / start a training block'. Dose 50-70 % of the last block's final 4 weeks (not floored), RIR 2-3, no intensifiers. (COACH-R2 R2-PER-06; COACH-ANSWER PER-01; factor split PROPOSED)
9. Next block after a completed one: start x1.05, cap +1 set (max 25, priority 30), customizable; advanced lifters at the ceiling climb by load, intensifiers and a rotating priority muscle; after a cancelled block the same start. (COACH-R2 R2-VOL-06, R2-PER-05)
10. Exercises stay fixed inside 4-6-week exercise blocks; between them 1-2 one-detail variations of library exercises, never invented ones; A/B lead-lift weeks only for variety seekers; heavy squat and heavy deadlift on two different days. (COACH-ANSWER PER-02, PER-03; COACH-R2 R2-LIB-01, R2-SES-01, R2-SES-02)
11. Tests: before the block (or in week 1) and in the last week, never during the block; anyone without a completed block tests submaximally (5RM/3RM, 80-90 % efforts), never a 1RM or a max-effort mile from zero; reminders at block start, 7 days and 1 day before. (COACH-R2 R2-PER-07)
12. Yearly plan (gen-pop 'stay in shape'): Q1 hard work + more cardio, start cutting, sets at the starting level; Q2 summer shape; Q3 maintain at ~70 %; Q4 build muscle, less cardio; last 2 weeks of December automatic maintenance; user's hemisphere and own holiday weeks; fully tunable. Athletes follow their season. (COACH-R2 R2-PER-01, R2-PER-02)
13. Competitive athletes: season start date + practice/game days -> off-season (stairway blocks, VOL 1 -> 2 -> 3), pre-season (4-6 weeks at ~60 % with speed/power and a 1-2-week taper), in-season (2 gym days, low volume; game-heavy sports: plyos ~half, no extra COD, sprints only for speed athletes, hard day >= 48 h before a game), post-season recovery. (COACH-ANSWER PER-08, PER-11; COACH-R2 R2-GEN-05, R2-PER-06, R2-ATH-07)
14. Athletic work has its own budget; Receive-Create stages RC1 Land -> RC2 Land & Go -> RC3 Repeat (12-week 1-3 / 4-7 / 8-12; 8-week 1-2 / 3-5 / 6-8; restart each off-season; hold in maintenance); end-of-block plyo shares by sport, each block starting 15 points more ballistic. (COACH-ANSWER VOL-10, CAT-10; COACH-R2 R2-ATH-01, R2-ATH-03)
15. Olympic lifts for everyone in athletic training, up to 4 days a week (clean days = squat pattern, snatch days = hinge pattern); weight by RIR/RPE and speed unless a tested max; full lifts 3-5 reps per set; in-season a light 2 x 3, dropped in heavy game weeks; 60+ none by default (option with a warning); youth from the floor from ~14 after a hang block. (COACH-ANSWER ATH-10; COACH-R2 R2-ATH-04, R2-ATH-05, R2-ATH-08, R2-GEN-06)
16. Effort stays inside 1-3 RIR: 3 RIR in the first half (the '2'), 2 RIR after halfway, 1-2 RIR in the last weeks and 1 RIR plus intensifiers (MYO, supersets; MAX only on small-muscle or bodyweight work) in the final week (the '11'); never to failure on heavy compounds. (COACH-ANSWER VOL-13, GEN-08; COACH-R2 R2-PER-05; drift PROPOSED as in 12_volume_algorithm v1.1 §3.7.2)
17. Stay athletic and active (gen pop: pickleball, HYROX and other recreational activities): the weekend-warrior athletic overlay inside the gen-pop stairway or year; play days count like practice/game days; an optional event date ends the last block with a 1-week taper. (COACH-R2 REQ; COACH-ANSWER ATH-13; rules PROPOSED)

### 1.2 What his sheets show (OBSERVED; the v0 rules, kept as evidence)

These are the rules read from the sheets before the coach answered. They stay as evidence of how he has written programs. Where an answer changes the generator rule, a **v1** line under the rule says so.

1. **He plans qualities, not exercises.** The CrossFit tab is a grid of 7 qualities × 12 months. Each cell holds a level from 1 to 4, and a separate table converts each level into a dose ('LVL 3 = 5 SETS x 5'). Exercises are filled in last. *(OBSERVED: 'EXAMPLE CROSSFIT SPLIT' A10:M17, A19:U25)*
2. **Every block that ends in a peak follows hypertrophy/base → strength → power → test**:
   * CrossFit: 'RESISTANCE' → 'STRENGTH' → 'POWER' → 'TEST/PEAK' within each ~4-month block.
   * Boxer: 3 x 10 base → athletic conversion.
   * Baseball: off-season build → pre-season potentiation → in-season maintenance.

   This matches Issurin's accumulation → transmutation → realization; the sequence is the coach's own, the Issurin label is the analyst's. *(OBSERVED for CrossFit and boxing; the BASEBALL blocks are labelled only 'BLOCK 1/2/3', so their off/pre/in-season reading is INFERRED; SCIENCE mapping)*
3. **Plan lengths are fixed shapes.**
   * **8 weeks** = 7 loading weeks + 'DELOAD WEEK' / 'TEST' in week 8. Exceptions in the sheets: the boxing build-up ends week 8 at its peak, HYBRID-8 has no deload, and the CrossFit class cycle ends with a 1RM test only.
   * **12 weeks** = 6 loading weeks + 'MID DELOAD' / 'A WEEK LOWER' in week 7 + 5 more loading weeks, peaking in week 12. Only AESTHETICS-12 changes the menu and adds intensifiers in weeks 8-12; STRENGTH-12 keeps its A/B menu and restarts at the week-3/4 dose.
   * **6 weeks**: there is no example. The best fit is the first half of the 12-week shape. *(OBSERVED / INFERRED)*
   * **v1:** superseded as a generator rule. The coach marked this reading NOT RIGHT and gave the v1 plan modes (COACH-ANSWER PER-01; section 7). The observed shapes stay as evidence of what he wrote.
   * **v1.1:** every plan is now a stairway with the hardest weeks last and no deload inside a block (COACH-R2 R2-PER-03, R2-PER-04, R2-VOL-07; section 7.0.1).
4. **Volume moves in whole-set steps inside rep waves.**
   * The steps: +1 set per exercise every 2-3 weeks (2→3→4→5; 4,4,5,5,6,6).
   * The waves: reps fall 12→10→8 inside each 3-week wave (AESTHETICS-8). Exception: the HYBRID header wave ascends 6→8→10 (D72:L72).
   * Compounded, those steps average **+4-6 % per week**: STRENGTH-12 +5.2 %, AESTHETICS-12 +4.75 %, FAT BURN +5.3 % (a CrossFit FULL TIME L1→L4 walk would give ≈ +5.5 %, but the macro never runs those levels in consecutive months). The 8-week products that start at 2 sets run faster (AESTHETICS-8 +16.5 %, HYBRID-8 +10.4 %). Reading that 4-6 % average as the stated "3 %, 5 % or 7 % increments" is an interpretation. *(OBSERVED numbers; INFERRED reconciliation)*
   * **v1:** the generator now adds volume smoothly, one set at a time, at 3/5/7 % of weekly sets chosen by the person (COACH-ANSWER VOL-04, VOL-05, VOL-07); his whole-set steps are what that looks like written by hand. 10 %/week is too much (COACH-ANSWER UNI-05), so the 8-week products' +10-16 %/week (2-set starts) are not copied.
5. **Big muscles and small muscles progress differently.**
   * Compounds lose reps and gain load and sets.
   * Isolations gain reps (FAT BURN leg ext/curl slot 15 → 20 → 40 → 40, arm slot 30 → 30 → 30 → 40) or go to 'MAX REPS' / 'MYO SET'. Exception: in PPL, side raises, rear-delt flies and upright rows follow the compound ladder (3 × 15 → 4 × 8).
   * The baseball legend makes this inverse relation explicit: 'VOL 1' '12-15 Reps' / '10-12 Reps' → 'VOL 3' '6-8 Reps' / 'MAX REPS'. *(OBSERVED)*
   * **v1:** the rep difference is confirmed (small muscles 12-30, big 5-15; COACH-ANSWER VOL-11), but the weekly SET rate is NOT tied to muscle size (COACH-ANSWER VOL-05). 40-rep sets are only an AMRAP/CrossFit option (COACH-ANSWER VOL-11).
6. **Effort words are written per row of the session.** In the conjugate tabs, on Monday and Wednesday the rows run 'the work' '1RIR' → 'the accessory' '2RIR' → 'the nuance' 'MAX' → 'the survival' 'ALL'. On Thursday the plyo row ('EASY') takes 'the work' position, so every word shifts down one slot name: 'the accessory' = DE squat '1RIR', 'the nuance' = pull-ups / DB rows '2RIR', 'the survival' = lunges / staggered DL 'MAX' (4T M17:M20 vs D17:D20; CJ M21:M24 vs D21:D24). Saturday has no 4th STRENGTH-8 row. The effort word therefore follows the exercise's role (ME/DE lift '1RIR', second compound 4 × 6 '2RIR', upper/unilateral accessory 4 × 8-10 'MAX', 2-3 × '8/8' finisher 'ALL'), not the M-column slot name. Strength waves climb RPE 7 → 9 → 10 (STRENGTH-12). Hypertrophy compounds get '1-2 RIR' (AESTHETICS-8; AESTHETICS-12 writes no effort). *(OBSERVED words and positions. INFERRED: reading 'MAX' as "unilateral" and 'ALL' as "isolation". STRENGTH-8's 'MAX' rows are pull-ups, DB bench and lunges, its 'ALL' rows are lunges and curls, and its dynamic-effort rows are also '1RIR'.)*
   * **v1:** the slot meanings are confirmed: the work = main lift at 1 RIR, the accessory = supporting lift at 2 RIR, the nuance = weak-point/unilateral/variation work at MAX, the survival = isolation or joint-health work done no matter what (COACH-ANSWER ORD-07). RIR is his effort language (COACH-ANSWER VOL-13).
7. **A deload is the same plan, smaller.**
   * Main exercises drop to 3 sets: BASEBALL 3 × 8, AESTHETICS-12 3 × '8/8/8-12', STRENGTH-12 3 × 4 @ RPE 7. Only STRENGTH-12 writes an RPE; a single "3 × 8 @ RPE ~7" default is INFERRED.
   * Intensifiers, conditioning buy-outs and the Olympic piece are removed.
   * Athletic Part A drops to 1-2 sets.
   * Volume falls 25-50 %.
   * The BASEBALL 'DELOAD WEEK' replays the **'WEEK 7' menu** (not 'WEEK 8'), stripped of its intensifiers: 'banded front squats' → 'goblet squats', 'banded kb swings' → 'kb swings', the 4-move complex → 'front squats', 'weighted Pull ups or max reps Close grip cable lat pull down' → 'Close grip cable lat pull down', 'heavy DB step ups ' → ' DB step ups ', 'myo set' / 'myo sets' removed; most Part A/B/D exercises are copied unchanged ('step to chest pass', 'single leg hops', 'lay down MB presses', 'camporini deadlift', 'OH rope tricep extension'). *(OBSERVED: BASEBALL 'DELOAD WEEK' DU42:EL55 vs 'WEEK 7' CL43:DC58, STRENGTH-12 week 7, AESTHETICS-12 week 7)*
   * **v1:** confirmed as 'about half the sets, same exercises, lighter load or 3+ RIR, no buy-out or finisher' (COACH-ANSWER PER-05). Placement is no longer a fixed week (section 6).
   * **v1.1:** the dose is approved again as 'half of the current (hardest) week' and the week sits only between two blocks, never inside one (COACH-R2 R2-VOL-07).
8. **Gym clients and athletes progress in opposite directions as they advance.**
   * Gym levels *add* volume: NOVICE → NEWBY → INTERMEDIATE goes 76 → 90 → 102 sets/week.
   * Athlete levels *cut* volume and raise intensity and specificity: STARTING → MID → ADVANCED goes 89 → 72 → 59 sets/week, with the heaviest hinge going from 3 × 6 'Heavy Snatch grip DL' to 3 × 1 'DEADLIFTS (1RIR)' (H15:J15). The 89/72/59 are the decode's component counts (each movement of a superset counted, throws excluded). Summing the written SETS cells once per line (medball lists excluded) gives about 61 → 53-55 → 44: the fall is the same in direction, smaller in size. Resistance sets do not fall from STARTING to MID (44 → 44); the cut is in athletic sets first, then resistance at ADVANCED (24), while core sets rise (14 → 26). *(OBSERVED cells; counts computed)*
   * **v1:** gym clients start by level (beginner 10-12, intermediate 15-20, advanced 20+; COACH-ANSWER VOL-01); field athletes 'don't need to get bigger and stronger that much' (COACH-ANSWER UNI-02). Whether STARTING -> MID -> ADVANCED is a time sequence or three levels 'depends on whatever is needed' (COACH-ANSWER PRG-04).
9. **Athletic work stays in every training phase.** Plyos and throws stay in the off-, pre- and in-season (baseball ≈ 200 contacts and ≈ 180 throws/week all year). Exceptions: the boxer's two base weeks (throws only, zero plyos), the baseball Block 1 'wk 8' recovery week (none) and deloads (Part A 1-2 sets). What changes is the *zone* (stick → single response → repeat), the amplitude, and whether a resistance slot becomes its speed version. *(OBSERVED; the BASEBALL off/pre/in-season labels are INFERRED, see rule 2)*
   * **v1:** the 'zone' words are method stages, not zones (COACH-ANSWER CAT-10, CAT-11). Everyone in athletic training gets Olympic lifts (COACH-ANSWER ATH-10). In-season: sprints for speed athletes, strength maintenance or jumps for others (COACH-ANSWER PER-08).
   * **v1.1:** the stages are named Receive-Create (RC1 Land, RC2 Land & Go, RC3 Repeat) with approved weeks (COACH-R2 R2-ATH-03).
10. **The slot skeleton is held inside a phase; variation changes one variable at a time.** Examples: A/B weeks; one lunge variable per week; front-loaded squat early in the week, back-loaded later. The skeleton itself changes at phase boundaries: BOXING week 3 swaps the whole menu (the Tuesday/Friday upper days dissolve into mixed sessions); AESTHETICS-12 drops the Monday/Thursday 'TRICEP EXT.' rows from week 8/9 and turns Friday into 'RFE Lunges (bulgarian)' / 'Staggered stance unilateral deadlifts' / one-leg extensions and curls / leg-press MYO. *(OBSERVED)*
    * **v1:** confirmed: exercises fixed inside a 4-6-week block, 1-2 small variables change at the next block (COACH-ANSWER PER-02); A/B weeks only for clients who want variety (COACH-ANSWER PER-03).
11. **Most intensification methods come late.** MYO, max-rep finishers and complexes are concentrated in the last phase of hypertrophy plans (AESTHETICS-12 weeks 9-12, squat-menu wave 3) and in the conversion / pre-season phases of athletic plans (BOXING weeks 3-8; BASEBALL 'myo set' / 'myo sets' and the '5 of each' complexes appear only in Block 2). They never appear in deload weeks or in the boxer's base weeks. Exceptions: 'MYO SET' is preset on leg extensions in week 1 of the BYOP athletic template; the athletic 'STARTING' block already uses heavy-to-jump contrast pairs; and in BASEBALL the upper-body pairs 'Superset - same reps' / 'Superset - max reps', 'heavy Max reps' sets and banded lifts run in all three blocks, from Block 1 week 1 (C34) through the in-season Block 3 (C70, 'SUPER SET 4X' AQ69, 'FAST BANDED DEADLFTS' DK68). *(OBSERVED)*
    * **v1:** MYO only on the last machine/isolation exercise (COACH-ANSWER VOL-15); supersets are a fatigue/density tool for short time, advanced clients, off-season VO2 work and beginners who do not fatigue (COACH-ANSWER ORD-05); complexes/contrast only for intermediate+ athletes in the off-season (COACH-ANSWER ATH-12). Banded lifts are out of scope (COACH-ANSWER EQ-12).
12. **Conditioning progresses by unlocking zones and by density.**
    * Zones unlock in order: C → C+B → C+B+A → 'LACTATE CLERANCE'.
    * Density rises: 3 × 30 s → 5 × 50 s; sprint rounds go 5 → 8.
    * Steady cardio sits on separate days (Wednesday / Saturday). *(OBSERVED)*
    * **v1:** aerobic sessions per week: 3 general/fat loss, 2 athletes in-season, 4 aesthetics/bodybuilders plus walks after workouts (COACH-ANSWER ATH-07); any erg, tracked by calories, time or distance (COACH-ANSWER EQ-14).
13. **In-season athletes maintain.**
    * Part C/D sets are frozen at 4 and reps sit at 8-10 (no Part C compound below 8). Part A stays at 1-3 sets (mostly 3) and Part B (core) at 2-4 sets or 'Accumulate' time blocks.
    * No Olympic lifts.
    * The weekly menu alternates between two familiar versions. *(OBSERVED: BASEBALL Block 3)*
    * **v1:** the generator default is 2 days/week, low volume, rate 0, bilateral minimal (COACH-ANSWER PER-08, UNI-10). The BASEBALL Block 3 doses (4 days, 4 x 8-10) stay as OBSERVED evidence.
    * **v1.1:** a light Olympic piece is now kept in-season (2 x 3, dropped in heavy game weeks; COACH-R2 R2-ATH-04), and game-heavy sports halve their gym plyos (R2-ATH-07).

---

## 2. Observed evidence: every progression the coach wrote

This section is the record of what the sheets show. Numbers and quotes are unchanged from v0 (two adversarial fact-check passes, see the verification log). v1 readings from the coach's answers are added after each table; v1.1 readings (round 2) are added where they change the reading.

### 2.1 Inventory

| Id | Source (tab, cells) | Length | Deload / test | Levers used | Computed reading | Status |
|---|---|---|---|---|---|---|
| OBS_CF_MACRO | MASTER_MODEL 'EXAMPLE CROSSFIT SPLIT' A10:M17 (macro), A19:E24 (FULL TIME), Q19:U25 (HALF TIME) | 12 months = 3 blocks of ~4 months, each ending in 'TEST/PEAK' level 4 (MAY, SEPT, JAN) | No deload weeks; 'TEST/PEAK' months strip strength/power/resistance (MAY, JAN) or keep power L4 (SEPT). WED and SUN 'OFF' every month. | L10_QUALITY_SEQUENCE; L01_SETS (FULL TIME); L02_REPS (HALF TIME); L13_AEROBIC_ZONE; L09_FREQUENCY (WOD levels 2-4 used in the macro, 2-4 WOD days in the grids; aerobic 2-4/wk) | FULL TIME table: +1 set per level (3->4->5->6) at 21-25 total reps. A hypothetical L1->L4 walk at one level per month = about +26%/month = about +5.5%/week, but that walk is INFERRED: the macro never runs strength L1->L2->L3->L4 in consecutive months (it uses L1 APRIL, L3 JUNE, L4 JULY, L2 OCT, L2 NOV; the only consecutive step is JUNE->JULY 5x5 -> 6x4 = +20% sets, 25 -> 24 reps). HALF TIME = reps -1/level at fixed 3 sets (-14% to -50% reps per step). Block order as written: FEB-MAY = RES L1-L2 -> STR L1 + POW L2 (APRIL) -> TEST (MAY); JUNE-SEPT = RES + STR (JUNE-JULY) -> POW (AUG) -> POW L4 + TEST (SEPT); OCT-JAN = RES + STR (OCT-NOV) -> POW (DEC) -> TEST (JAN). Aerobic levels run 1-2-3 \| 1-2-3-4 \| 2-3-4 and WOD levels 2-3 \| 2-3-4 \| 2-3-4: only block 3 restarts aerobic higher; block 1 peaks at level 3 for both. The AUGUST grid marks only 2 WOD days (C54, F54) although WODs = L3 ('3 wods a week'). The monthly day grids (rows 27-145) do not follow the macro exactly: the MARCH grid already schedules STRENGTH ('KNEE DOM'/'PULL'/'HIP DOM'/'PUSH', B121:F121) and POWER ('SNATCH'/'CLEAN', B122:F122) days with no level in column I although the macro gives MARCH no strength/power level; the APRIL grid keeps RESISTANCE 'LB'/'UB' days (B133:F133) with no level; SKILL days ('T2B/ DUBS', 'H.S./ DUBS') appear in 7 monthly grids although the macro SKILL row is empty. 'Block 1 = resistance alone in FEB-MARCH' is true of the macro row only. | OBSERVED |
| OBS_CF_CLASS8 | MASTER_MODEL 'EXAMPLE CROSSFIT SPLIT' P1, R3:T3, Q4:S11 ('CLASS PROGRAMMING SPLIT') | 8 weeks | WK 8 = 1RM test (HALF TIME 'LVL 5'); no deload. | L02_REPS; L03_LOAD (implicit) | Pure intensification at fixed 3 sets; strength reps/week -14%, -17%, -20% at each step; codes read as strength level / power level offset by one week (INFERRED). The same class split lists 'AEROBIC CAPACITY' 'LVL 4' (Q16, Monday column) and 'LVL 3' (T16, Thursday column) and skills 'DUBS' (Q15) / 'GYMNASTICS' (T15). | OBSERVED (codes stored as m/d dates; decoding INFERRED) |
| OBS_4T_STRENGTH12 | MASTER_MODEL '(NOT DONE) 4 TRACKS PROGRAMMING' N3:Z6 header rows, M8:Z24 | 12 weeks | WK7 'MID DELOAD' (3x4 @ RPE 7); WK6 column T8:T24 highlighted FFF2CC (wave-1 peak); WK12 RPE 10. | L03_LOAD +5% every 2 weeks; L04_EFFORT RPE 7->10; L01_SETS 4->7; L02_REPS 5->2; L06_VARIATION A/B weeks (exercises alternate weekly; 'A/B' is the analyst label - STRENGTH-12 has no 'A WEEK'/'B WEEK' cells) | work sets/week 16,16,20,20,24,24 \| 12 \| 20,24,24,28,28 = +5.2%/week compounded wk1->wk12; main-lift reps per session held at 18-20 in wk1-10 (12 in the deload) and cut to 14 in wk11-12 while load rises. | OBSERVED |
| OBS_4T_STRENGTH8 | MASTER_MODEL '(NOT DONE) 4 TRACKS PROGRAMMING' E4:L6 ladders, B3:L24 | 8 weeks | WK8 = 'TEST' (L9, L13 max-effort days) + 'DELOAD' (L17, L21 dynamic days). | L02_REPS (two descending waves 5->1, 3->1); L01_SETS (ladder down); L06_VARIATION (weekly conjugate rotation: squat ME week / deadlift ME week; 'KD/HD week' is the analyst's label, not written in STRENGTH-8); L08_METHODS (box, chains, bands, deficit) | Volume flat or falling (56 -> 50) while intensity rises: volume is traded for intensity. As written the B column is constant (56 sets/week); the fall exists only if the green E4:L4 ladder governs the green-filled set cells (INFERRED). WK8 as written: 'TEST' on the two ME rows, 'DELOAD' on the plyo row (L17) and the Saturday DE row (L21), every other row blank. | OBSERVED (ladder application INFERRED) |
| OBS_CJ_DRAFT | MASTER_MODEL '(NOT DONE) EXAMPLE CONJUGATE' | 8 weeks ('8 WEEK CYCLE') | WK8 TEST/DELOAD; J3 cyan 'TEST' above WK6 (unexplained). | as STRENGTH-8 | Draft = 60 sets/week; product version (4 TRACKS) cut to 56 (-6.7%). In the draft the M-column slot names sit beside its own rows: Thursday 'the work' = plyo row (M21, 3x6 'EASY'), the 5-set '1RIR' DE squat = 'the accessory' (M22); 'the nuance' = 'PULL UPS'/'DB ROWS 8/8' (Mon) and 'ALT INCLINE DB BENCH' (Wed), 'MAX'; 'the survival' = 'RFE LUNGES'/'STAGGERED STANCE DL' (Mon) and 'BICEP CURLS' (Wed), 'ALL'. | OBSERVED |
| OBS_4T_AESTHETICS8 | MASTER_MODEL '(NOT DONE) 4 TRACKS PROGRAMMING' C32:K33, D35:D62 ('1-2 RIR'), L35/L55 'DELOAD WEEK' | 8 weeks | WK8 'DELOAD WEEK'. | L01_SETS +1 at wk2, wk5, wk7; L02_REPS wave 12/10/8 x2 then 8; L06_VARIATION one variable per week (lunge) | +50%, 0, 0, +33%, 0, +25% weekly sets; 16.5%/week compounded (low 2-set start). | OBSERVED |
| OBS_4T_AESTHETICS12 | MASTER_MODEL '(NOT DONE) 4 TRACKS PROGRAMMING' N31:Z33, M35:Z66 | 12 weeks | WK7 'A WEEK LOWER' (3 x '8/8/8-12'); WK12 Z31/Z32 highlighted FCE5CD (peak). | L01_SETS 3->4->(3)->4->5; L02_REPS pyramids widen (12/10/8 -> 15/12/10/8 -> 15/15/12/12/12); L06_VARIATION A/B weeks; L08_METHODS wk9-12 supersets + 'MYO' | +4.75%/week (sets/exercise), +4.0%/week weekly sets (4.6% incl. superset partners). Rep strings: wk1-3 three numbers + '-20' for 3 sets; wk4-6 SETS = 4 but still only three numbers before the dash ('12/12/10-20', '12/12/12-20'); wk8-11 four numbers for 4 sets; wk12 five numbers for 5 sets and no '-20'. Reading '-20' as the isolation rep target is INFERRED (it may be an extra back-off set). No RIR/RPE is written anywhere in AESTHETICS-12. WK12 muscle sets (decode): quads 33, glutes 34, chest 32.5, lats/upper back 35, triceps 35. | OBSERVED |
| OBS_4T_HYBRID8 | MASTER_MODEL '(NOT DONE) 4 TRACKS PROGRAMMING' D70:L72 (AMRAP/SETS/REPS), rows 74-101 | 8 weeks | None written. | L02_REPS ascending 3-week wave 6/8/10; L01_SETS +1 every 3 weeks; L07_DENSITY (AMRAP minutes, sprint reps, rest ratio 1:2 -> 1:4); L12_PLYO_ZONE ladder | sets +10.4%/week, reps per exercise +15%/week compounded (header values). The header does NOT govern the written lifts: Tuesday bench is 3x6, 3x6, 3x8, 3x8, 3x10, 3x10, 4x6, 4x8 (reps step every 2 weeks, sets 3 -> 4 at wk7) and the Olympic rows carry their own sets x reps; the header can apply to the unwritten squat/deadlift sets (INFERRED); E78:L78, next to 'UPPER ACCESORY' (D78), repeats the header sets exactly (2,2,2,3,3,3,4,4), so the header also reaches the Monday upper accessory. E79:L79 holds unexplained numbers 2,2,3,2,2,3,2,2. The 'AMRAP' row (D70) is not tied to a day; reading it as a Saturday circuit in minutes is INFERRED. | OBSERVED |
| OBS_BB_BLOCKS | MASTER_MODEL 'BASEBALL' rows 22-76 (24 week-grids), legend A19:F22, calendars rows 4-17 | 3 blocks x 8 grids, labelled only 'BLOCK 1' / 'BLOCK 2' / 'BLOCK 3' (A24, A41, A59); the off-season / pre-season / in-season reading is INFERRED from content and from Block 3 dates ('March 20 - 26' AH61 ... '04/24 to 04/28' DN60), which fall in the calendar's 'IN SEASON' months | Block 1 'wk 8' = recovery / arm-care week ('Kettlebell arm bars', 'Half kneeling shoulder roll', 'Paced Cardio - easy' 4 x '10 min'); Block 2 'DELOAD WEEK' = same template at 3 x 8, Part A 1-2 sets, buy-out 'none', no OLY. Its exercises replay the 'WEEK 7' grid (CL43:DC58), not 'WEEK 8': Part A 'step to chest pass' / 'MB OH toss to rotational scoop', 'single leg hops' / 'staggered stace Box jump ', 'lay down MB presses' / 'In-out of hip Rotational medball scoop', Part D 'camporini deadlift', 'OH rope tricep extension', Part C 'seal DB row' and 'Alternating DB Bench press (botton up)' are copied; intensified versions are stripped ('banded front squats' -> 'goblet squats', 'banded kb swings' -> 'kb swings', the 4-move complex -> 'front squats', 'weighted Pull ups or max reps Close grip cable lat pull down' -> 'Close grip cable lat pull down', 'Single arm DB push press' -> 'Single arm DB press', 'heavy DB step ups ' -> ' DB step ups ', 'myo set' / 'myo sets' removed). Block 1 'wk 8' still carries the 'OPTIONAL PIECE' 'OLY' row with 4 x 6 written and no exercise (DS33:EH33). | L10_QUALITY_SEQUENCE by season (build / intensify-potentiate / maintain); L01_SETS (Part C/D 4->5 late pre-season); L02_REPS (VOL 1->3); L03_LOAD (OLY % only); L14_SLOT_QUALITY (speed vs strength version of a slot); L08_METHODS (contrast, complexes); L06_VARIATION (new weekly menus off-season; replayed menus pre-season; 2 alternating menus in-season) | Block 2 resistance +2.6%, +3.8%, +3.7% for the last three loading steps; deload -31% resistance / -46% all sets. In-season flat (+-11%). | OBSERVED (block-to-season mapping INFERRED) |
| OBS_AT_LEVELS | MASTER_MODEL 'EXAMPLE ATHLETIC FULL BODY SPLI' A9/D9/H9 headers, A41:A45 notes | 'First 8 weeks (8wk1)' (Starting); Mid and Advanced INFERRED as 8wk2 / 8wk3 | None written; one fixed weekly template per level. | L01_SETS DOWN with level; L03_LOAD UP; L12_PLYO_ZONE (bilateral height -> single-leg reactive); L11_ATHLETIC_DOSE (throws up, high contacts down); L15_SESSION_BUDGET down | Working sets -19%, -18% per level; high-intensity contacts -51%, -55%; throws +90%, +5%. Counting note: 89/72/59 are the decode's component counts (each movement of a superset/combination counted, throws excluded, assumptions for unnumbered cells). Summing the written SETS cells once per line, medball lists excluded, gives about 61 -> 53-55 -> 44 (-11 %, -18 %; MID D64 is '2 to 4'). Resistance sets are flat STARTING -> MID (44 -> 44); core sets rise at ADVANCED (14 -> 26). | OBSERVED (counts computed) |
| OBS_BX_8WK | MASTER_MODEL 'EXAMPLE BOXING 8 WEEK BUILD UP' (hidden) A5:L69 (wk1-2 in A-D, wk3-8 in E-L) | 8 weeks | No formal deload; wk7 = eleven rows 3->2 sets while 3 ramping rows 3->4 (net -11%); wk8 = peak (+31%). | L10 phase change at wk3 (base -> athletic conversion); L01_SETS 2-week steps; L07_DENSITY (sprint rounds); L08_METHODS (French-contrast complexes) | 0%, +41%, 0%, +3.5%, 0%, -11%, +31%; wk3->wk8 = +3.8%/week; sprint rounds +9.9%/week. Working sets are COMPONENT sets (each movement of a complex counted, excl. throws and conditioning); line-item sets actually fall from 76 to 69 at wk3. Week colours group wk1-2 (FFFF00), wk3-4 (EA9999), wk5-7 (E06666), wk8 (CC0000). No effort is written for wk1-2; the only RIR label in the tab is 'DEADLIFTS (1-2RIR) + 3 min Jump Rope' (L12). | OBSERVED |
| OBS_FB_4WK | MASTER_MODEL 'EXAMPLE FAT BURNBODY TONING PRO' B4:L33 ('MUSCLE BUILDING'), B36:L66 ('CIRCUITS RECCOMENDED') | 4 weeks | None; WK4 is the peak. | L01_SETS on compounds (+0/+6.7/+9.4%); L02_REPS compounds down / isolation up; L06_VARIATION 2-week mini-blocks (upgrade at WK3); L07_DENSITY circuits | +5.3%/week sets, +10%/week reps (per-side cells such as '8/8' counted once; counting both sides gives 973 -> 1248 reps = +8.7%/week). | OBSERVED |
| OBS_UL_PPL_LEVELS | MASTER_MODEL 'EXAMPLE UPPERLOWER SPLIT' (hidden) / MASTER_MODEL 'EXAMPLE PUSHPULLLEGS SPLIT' (hidden) (NOVICE A-D, NEWBY E-H, INTERMEDIATE I-L) | levels (no weeks) | n/a | L01_SETS + L02_REPS per level (more sets, fewer reps, heavier); isolation fixed-dose | +18.4%, +13.3% (UL); +23.4%, +13.8% (PPL) per level step. Two anomalies: UL upper compounds RISE in reps with level (3x8 -> 3x10 -> 4x12) and PPL leg compounds are LOWER at NOVICE than NEWBY (2x8 -> 3x10 -> 4x8). | OBSERVED |
| OBS_SQ_MENUS | MASTER_MODEL 'ALL ABOUT SQUATS' (hidden) A13:H28, A30, G15:I18 | 12 rows per menu (INFERRED: 12 weeks, 3 waves of 4) | none written | L02_REPS descending inside a wave; L01_SETS +1 between waves; L08_METHODS finisher in wave 3 | Hypertrophy total reps per wave: 45/36/30/24 \| 60/48/40/32 \| 60+/48+/40+/40+. | OBSERVED (12-week reading INFERRED) |
| OBS_AER_LEVELS | MASTER_MODEL 'AEROBIC CAPACITY CHEAT SHEET' A5, A8:I21, G23:I41, D25:F32 | levels | n/a | L13_AEROBIC_ZONE; L07_DENSITY then pace | Volume first, then intensity (same logic as squat waves). | OBSERVED |
| OBS_HM_BORROWED | MASTER_MODEL 'Sheet24' (HALF MARATHON PROGRAM by CHRIS HINSHAW) | 21 weeks x 2 runs/week | cut-back weeks every 2-6 weeks + taper | distance; sessions | Borrowed model ('HALF MARATHON PROGRAM by CHRIS HINSHAW '), but adopted as-is: A2 'Program we use for all Blaze Camp Athletes who are looking to run a half marathon.' Taper = 1 week ('21,1,Tapering: 6 miles, comfortable pace') then race day. | OBSERVED (borrowed model that the coach uses unchanged) |

**v1 readings of the inventory (coach answers).**
* OBS_4T_AESTHETICS12: '12/10/8 -20' means 12 reps (mid weight), 10 (heavier), 8 (heaviest), then a light set of 20 (COACH-ANSWER PRG-07), so the '-20' is an extra set, not the isolation rep target. Counting the numbers in each rep string gives 4, 4, 4, 4, 4, 4, 4 ('8/8/8-12'), 5, 5, 5, 5, 5 sets per exercise, against the SETS row 3, 3, 3, 4, 4, 4, 3, 4, 4, 4, 4, 5: the two disagree in weeks 1-3, 7 and 8-11 (open question 14.2).
* OBS_4T_STRENGTH12: the %/RPE/sets x reps rows are his strength default (COACH-ANSWER PER-09). The week-7 'MID DELOAD' is not part of his v1 12-week description (COACH-ANSWER PER-01; open question on deload placement).
* OBS_4T_STRENGTH8 / OBS_CJ_DRAFT: banded and chained variants are out of scope in v1 (COACH-ANSWER EQ-12).
* OBS_CF_MACRO / OBS_CF_CLASS8: FULL TIME = competitor, HALF TIME = class member (COACH-ANSWER PRG-10).
* OBS_BB_BLOCKS: VOL 1 / VOL 2 / VOL 3 is a rep phase per block for every athlete (COACH-ANSWER PER-11). Complexes and contrast are 'off-season only' (COACH-ANSWER ATH-12), so Block 2, which holds the '5 of each' complexes and VOL 3 work, may be late off-season rather than pre-season (open question). The 'camporini deadlift' rows are dropped from the generator (COACH-ANSWER LIB-09); banded rows are out of scope (EQ-12). Olympic rows under 'OPTIONAL PIECE': everyone in athletic training gets an Olympic variant (COACH-ANSWER ATH-10).
* OBS_AT_LEVELS: STARTING / MID / ADVANCED are back-to-back blocks or athlete levels, 'depends on whatever is needed' (COACH-ANSWER PRG-04).
* OBS_BX_8WK: the 2-week steps are his fight-prep pattern (COACH-ANSWER PER-10); pressing and arm volume is reduced, not cut, in high-punching weeks (COACH-ANSWER ATH-04).
* OBS_FB_4WK: circuits are finishers after lifting (COACH-ANSWER PRG-11); 40-rep isolation sets are not a default (COACH-ANSWER VOL-11).
* OBS_UL_PPL_LEVELS: NOVICE and NEWBY are the same level (L1); the UL upper-day rep rise was probably a fill error (COACH-ANSWER PRG-05, PRG-06).
* OBS_HM_BORROWED: used as-is for the half marathon (COACH-ANSWER PRG-12).

**v1.1 readings (round 2).**
* OBS_BB_BLOCKS: Block 2 'wk 5' runs the 'OPTIONAL PIECE' OLY on Mon/Thu (cleans) and Tue/Fri (snatches) at 4 x 8 @ 75 %: the observed basis of 'it could be done four times a week' (COACH-R2 R2-ATH-04). Block 3 (in-season) has none; v1.1 keeps a light 2 x 3 piece in-season (R2-ATH-04).
* OBS_4T_STRENGTH12: in the v1.1 stairway the observed weeks 1-5 are the DRIVE weeks 4-8 and the observed weeks 6, 10, 11, 12 are the HARDEST weeks 9-12 (section 5.4); the observed week-7 'MID DELOAD' drops out, which settles the v1 'open question on deload placement': no deload inside a block (COACH-R2 R2-VOL-07).
* OBS_CF_MACRO: the coach approved a yearly plan for gen-pop 'stay in shape' clients (COACH-R2 R2-PER-01); the CrossFit macro stays the observed annual example for competitors.

### 2.2 The CrossFit year (verbatim levels, 'EXAMPLE CROSSFIT SPLIT' A10:M17)

| Quality (row) | FEB | MARCH | APRIL | MAY | JUNE | JULY | AUG | SEPT | OCT | NOV | DEC | JAN |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 'AEROBIC C.' | - | 1 | 2 | 3 | 1 | 2 | 3 | 4 | 2 | 3 | 4 | - |
| 'SKILL' | - | - | - | - | - | - | - | - | - | - | - | - |
| 'STRENGTH' | - | - | 1 | - | 3 | 4 | - | - | 2 | 2 | - | - |
| 'POWER' | - | - | 2 | - | - | - | 3 | 4 | - | - | 3 | - |
| 'RESISTANCE' | 1 | 2 | - | - | 1 | 2 | - | - | 1 | 2 | - | - |
| 'WODs' | - | - | 2 | 3 | - | 2 | 3 | 4 | 2 | 3 | 4 | - |
| 'TEST/PEAK' | - | - | - | 4 | - | - | - | 4 | - | - | - | 4 |

How to read it:
* There are three blocks, each ending in 'TEST/PEAK' 4: FEB-MAY, JUNE-SEPT, OCT-JAN (event 'JAN 12-15th').
* In the macro grid, block 1 runs resistance alone (FEB-MARCH), then strength L1 + power L2 (APRIL), then tests (MAY). In blocks 2 and 3, resistance rides with strength (JUNE-JULY, OCT-NOV), strength gives way to power (AUG-SEPT, DEC), then the block tests.
* The monthly day grids (rows 27-145) add work the macro does not show. The MARCH grid already schedules STRENGTH days ('KNEE DOM' / 'PULL' / 'HIP DOM' / 'PUSH', B121:F121) and POWER days ('SNATCH' / 'CLEAN', B122:F122) with no level in column I. The APRIL grid keeps the RESISTANCE 'LB' / 'UB' days (B133:F133) with no level. SKILL days ('T2B/ DUBS', 'H.S./ DUBS') appear in the JUNE, JULY, NOV, DEC, JAN, MARCH and APRIL grids although the macro SKILL row is empty in every month. So "resistance alone in FEB-MARCH" holds only for the macro row; the grids overlap the qualities by a month.
* Aerobic levels run 1-2-3 | 1-2-3-4 | 2-3-4 and WOD levels 2-3 | 2-3-4 | 2-3-4. They climb inside each block, but only block 3 restarts aerobic higher (level 2); block 1 tops out at level 3, and block 2 restarts at level 1.
* The monthly grids do not always match the levels: AUGUST is WOD level 3 ('3 wods a week') but marks only 2 WOD days (C54, F54).
* The FULL TIME strength ladder is never walked L1 → L2 → L3 → L4 in consecutive months: the macro uses L1 (APRIL), L3 (JUNE), L4 (JULY), L2 (OCT, NOV).
* Dose changes only at month boundaries (4-5 weeks at one level).

Dose tables (verbatim):

| Quality | 'FULL TIME' (A19:E24) | 'HALF TIME' (Q19:U25) |
|---|---|---|
| RESISTANCE | 'LVL 1 = 2 SETS x 10' / 'LVL 2 = 3 SETS x 10 ' | 'LVL 1 = 2 SETS x 10' / 'LVL 2 = 3 SETS x 10 ' |
| STRENGTH | 'LVL 1 = 3 SETS x 7' / 'LVL 2 = 4 SETS x 6' / 'LVL 3 = 5 SETS x 5' / 'LVL 4 = 6 SETS x 4' | 'LVL 1 = 3 SETS x 7' / 'LVL 2 = 3 SETS x 6' / 'LVL 3 = 3 SETS x 5' / 'LVL 4 = 3 SETS x 4' / 'LVL 5 = Work up to 1RM' |
| POWER | 'LVL 1 = 3 SETS x 3' / 'LVL 2 = 4 SETS x 3' / 'LVL 3 = 5 SETS x 3' / 'LVL 4 = 6 SETS x 3' | 'LVL 1 = 3 SETS x 4' / 'LVL 2 = 3 SETS x 3' / 'LVL 3 = 3 SETS x 2' / 'LVL 4 = 3 SETS x 1' |
| AEROBIC | 'LVL 1 = C' / 'LVL 2 = C, B' / 'LVL 3 = C,B, A' / 'LVL 4 = LACTATE CLERANCE' | (same as FULL TIME) |
| WODS | 'LVL 1 = 1 a week' / 'LVL 2 = 2 wods a week' / 'LVL 3 = 3 wods a week' / 'LVL 4 = wods a week' (number missing; grids show 4) | (same as FULL TIME) |

**FULL TIME** adds sets as the level rises: total strength reps stay at 21-25 while reps per set drop. **HALF TIME** keeps 3 sets and cuts reps, ending in a 1RM. *INFERRED*: FULL TIME is the competitor's dosing and HALF TIME is class / part-time dosing; the class cycle 'WK 1'..'WK 8' with codes '1/1'…'5' uses HALF TIME.

**v1:** FULL TIME = the competitor's dose and HALF TIME = the class member's dose (COACH-ANSWER PRG-10). The macro is kept as the observed example of an annual plan; the v1 yearly mode for general clients is in section 7.6.

### 2.3 Measured weekly growth in the coach's own plans

| Program / measure | Source | Start -> end | Compounded weekly change | Status |
|---|---|---|---|---|
| STRENGTH-12 'the work' sets/week | 4T N5:Z5 | 16 -> 28 over 11 steps | +5.2 %/week | OBSERVED numbers |
| AESTHETICS-12 sets per exercise | 4T O31:Z31 | 3 -> 5 over 11 steps | +4.8 %/week | OBSERVED |
| AESTHETICS-12 weekly sets (incl. superset partners) | 4T rows 35-66 | 96 -> 158 over 11 steps | +4.6 %/week | OBSERVED counts |
| CROSSFIT FULL TIME strength sets/slot L1->L4 (~13 weeks, hypothetical walk) | CF A19:B24 | 3 -> 6 over 13 steps | +5.5 %/week | OBSERVED dose table; the L1->L4 monthly walk is INFERRED (the macro never runs strength L1-L4 in consecutive months) |
| FAT BURN weekly lifting sets wk1->wk4 | FB | 60 -> 70 over 3 steps | +5.3 %/week | OBSERVED counts |
| FAT BURN weekly reps wk1->wk4 (per-side cells counted once) | FB | 781 -> 1040 over 3 steps | +10.0 %/week | OBSERVED counts (both sides counted: 973 -> 1248 = +8.7 %/week) |
| BASEBALL Block 2 resistance sets wk2->'WEEK 8' | BB B2 | 74 -> 84 over 5 steps | +2.6 %/week | OBSERVED counts (5 grid-to-grid steps; Block 2 has no 'wk 3' grid, so if the 'wk 4' label is right the span is 6 calendar weeks = +2.1 %/week) |
| BASEBALL Block 2 all working sets wk2->'WEEK 8' | BB B2 | 118 -> 151 over 5 steps | +5.1 %/week | OBSERVED counts (5 grid steps; 6 calendar weeks = +4.2 %/week) |
| BOXING component working sets wk3->wk8 (each movement of a complex counted) | BX | 113 -> 136 over 5 steps | +3.8 %/week | OBSERVED counts |
| UL resistance sets NOVICE->INTERMEDIATE (if 4 weeks per level) | UL | 76 -> 102 over 8 steps | +3.7 %/week | OBSERVED counts, timing INFERRED |
| PPL resistance sets/rotation NOVICE->INTERMEDIATE (if 4 weeks per level) | PPL | 47 -> 66 over 8 steps | +4.3 %/week | OBSERVED counts, timing INFERRED |
| HYBRID header SETS wk1->wk8 | 4T E71:L71 | 2 -> 4 over 7 steps | +10.4 %/week | OBSERVED |
| AESTHETICS-8 weekly sets wk1->wk7 (2-set start) | 4T E32:K32 | 38 -> 95 over 6 steps | +16.5 %/week | OBSERVED |
| BOXING sprint rounds wk3->wk8 | BX E44:J44 | 5 -> 8 over 5 steps | +9.9 %/week | OBSERVED |

**Reading.**
* The 12-week products and the 4-week FAT BURN land at **+4-6 %/week** in the long run, and the late pre-season baseball steps land at **+2.6-3.8 %/week**. *INFERRED*: that is the coach's verbal 3/5/7 %. The CrossFit row is a hypothetical walk of the dose table, not a sequence the macro actually runs.
* The outliers have obvious causes:
  * AESTHETICS-8 starts at only 2 sets.
  * HYBRID starts at 2 sets.
  * FAT BURN reps rise because the isolation reps climb to 40.
  * The boxer's +41 % in week 3 is a phase change from zero plyos, not a % step.

**v1 reading.** The coach now defines the 3/5/7 % as a share of each muscle's weekly sets, chosen by the person's state rather than by muscle size (COACH-ANSWER VOL-04, VOL-05), and says 10 %/week 'is way too much ... hard to sustain' (COACH-ANSWER UNI-05). His 12-week products (+4-6 %/week) sit inside that band; the 8-week products that start at 2 sets (+10-16 %/week) exceed his ceiling and are not copied. The generator adds the sets smoothly, one at a time (COACH-ANSWER VOL-06, VOL-07).

**v1.1 reading.** Round 2 shapes those smooth adds into a stairway: smaller steps in the first half, a little bigger after halfway, hardest weeks last (COACH-R2 R2-PER-03, R2-PER-04). The planned steps (3 % then 5 %, λ-scaled so each muscle peaks on its cap in week 12) average about +3.5 %/week over a 12-week L2 block (15 -> 22 sets), a little under the +4-6 %/week his own 12-week products show.

### 2.4 Other progression ladders the coach wrote (exercise-level and quality-level)

These are the "within a category" ladders the generator moves along over a plan. They are summarized here; full detail is in the library and reference decodes.

**plyo**
* force_phase_order: 'TAKING IN FORCES' (stick / Z1 'Receive pause/creat') | 'DELIVER FORCES FAST' (hop/jump ON TO) | 'AMORTIZATION OF FORCES' (double bounce, drop & hop, weighted drop-release / Z2 'Receive/create') | 'REBOUNDING ' (repeat hops/jumps, reverse banded [v1: out of scope, EQ-12] / Z3 'Repeat receive create'). v1: the Z1/Z2/Z3 words are how a jump is performed, not a property of the exercises in these lists (COACH-ANSWER CAT-11)
* within_phase_rules: bilateral before unilateral | unloaded before weighted | no drop before drop | hop before jump | reverse-banded (assisted/overspeed) last [v1: out of scope, EQ-12]
* library_tiers: FOUNDATIONAL landings/box jumps/ankle hops -> MODERATE plate hops ('JUMPING LIMITED KNEE' track) or hurdle hops ('PLYOS' track) -> ADVANCED 'FULL JUMPING' (depth jumps, bounding, DB drop-release jumps)
* weekly_dose_rules: primer plyo 1 set (Mid/Advanced) or 2 sets (Starting) x 8 landings | max jumps 1-3 x 5-12 | fastest-SSC reactive (squirrel jumps) 1-3 x 20-80 contacts | loaded jumps 3 x 4-6 | deload: contacts -50-65 % | week-to-week contact increase <= ~10-15 % (INFERRED guardrail; ACWR 0.8-1.3 science, with caveats)
* status: OBSERVED lists (BALLISTICS A24:D46, Sheet23 C34:D36); within-phase rules INFERRED from list order; force-phase-to-zone mapping INFERRED; dose rules OBSERVED from programs; guardrail INFERRED

**throws**
* rule: level-free ('AP - THROWING'); rotational / step-forward / half-kneeling throws come as R/L pairs, bilateral throws (chest pass, overhead throw, squat to chest pass, floor slams, back-to-wall scoops, sit-up throws) are single entries; 1 x 10 each, sit-up throws 1 x 20 in the BALLISTICS cheat sheet (A70:B71) but 10 in the BOXING list (F68:F69)
* progression: observed: BOXING 1 list/week (190) -> 2 lists/week (380); ATHLETIC levels STARTING 1 x 'ALL LIST' (210; which list is INFERRED) -> MID the 10-throw rotational subset 2 x 10 in two sessions (400) -> ADVANCED 2 x 'ALL LIST' (420). The rotational subset is not a step before the full list (STARTING already uses the full list); the levers are list sessions per week and sets per throw
* status: OBSERVED (list identity INFERRED)

**olympic**
* skill_ladder: high hang -> mid hang (knee) -> low hang -> floor; power catch before squat catch; press -> push press -> push jerk -> split jerk; snatch depth separately ('*SQUAT SNATCH HAS ITS OWN MODEL ...')
* library_tiers: FOUNDATIONAL pulls (high/mid hang) -> MODERATE low-hang pulls -> ADVANCED power and full lifts
* loading_ramp: 4 sets: 8 @75 % -> 6 @80 % -> 6 @85 % -> 4 @90 % (BASEBALL); CROSSFIT FULL TIME 3x3 -> 6x3; HALF TIME 3x4 -> 3x1; HYBRID 'heavy' 2-4 sets x 1-5 rotating pull / power / squat variants
* never: BASEBALL: not in Block 3 (in-season reading INFERRED), not in the Block 2 deload, not before Block 1 wk6 (Block 1 'wk 8' keeps a 4 x 6 'OLY' row with no exercise, DS33:EH33). Other tabs start earlier: ATHLETIC 'STARTING' (first 8 weeks) 'SUPERSET: Low Hang Power Cleans (mid weight) ' 3 x 8 (A36); BOXING 'Clean Pull/ hang Power Clean' from week 3
* optional: every BASEBALL Olympic row sits under an 'OPTIONAL PIECE' label (CI33, DA33, DS33, BC51, BU51, CM51, DD50)
* status: OBSERVED

**sprint_conditioning**
* speed_session_order: '*FASTEST SSC*' (squirrel jumps) -> '*FAST BALLISTIC/WARMUP/SSC* (prior to sprint)' ('MACH DRILLS', 'Acceleration starts') -> '*SPRINT*' ('Max velocity running (top speed)')
* zones: 'SPEED STRENGTH & POWER' '0-12 Secs' -> 'SPEED POWER' '10-39 Secs' -> 'SPEED ENDURANCE' '>40 Secs'
* density_progressions: HYBRID 10/12/15 x 15 s (1:2) -> 10/12/15 x 20 s (1:2) -> 5 x 30 s fast (1:4) -> 10 x 30 s fastest (1:4) | BOXING 'Sprint 20/ Recover 40' rounds 5,5,6,6,7,8 | BASEBALL buy-outs 1-3 x 10-20 cal or 15-30 s runs, ~3-4/week, removed in deload
* status: OBSERVED

**aerobic**
* levels: 'LVL 1 = C' | 'LVL 2 = C, B' | 'LVL 3 = C,B, A' | 'LVL 4 = LACTATE CLERANCE'
* sessions_by_level_in_grids: 2 | 2 | 3 | 4
* within_level: beginner -> intermediate: more volume/density at moderate pace; intermediate -> advanced: faster pace, volume back down, set ranges '4-6','3-5','2-4'
* weekly_rule: one of each colour per week, never the same colour twice (3 sessions) vs templates with 2 'Aerobic Capacity' slots (open question)
* status: OBSERVED

**cod**
* tiers: 'EASY TURN' (FADE, SLANT, POST/CORNER, FLAT, Shuffles) -> 'MOD. TURN' (DIG/OUT, 'LEFT TEST') -> 'HARD TURN' (COMEBACK/CURL, 5-10-5)
* agility_vs_cod: 'COD: Proactive in nature - Cognitive Competence' first; 'Agility: Reactive in nature - Incognitive Competence' needs a live cue (INFERRED: later in the block / pre-season)
* status: OBSERVED tiers; timing INFERRED

**core**
* plane_ladder: SAGITAL ('EASY') -> FRONTAL ('MODERATE') -> TRANSVERSE ('HARD'/'ADVANCED')
* weekly_distribution: BASEBALL rotates planes by day: 'LATERAL CORE' (Mon), 'Transverse core' (Tue/Fri), 'Sagital core' (Thu)
* dose: accumulations ('Accumulate 2 minutes on each side'), reps 10-50, time 20-60 s; progress static before dynamic (INFERRED)
* status: OBSERVED

**squat_loading**
* ladder: 'Hex Bar Squat' (EASIEST) -> 'Goblet Squat' -> 'High Zercher Squat' -> 'Zercher Squat' -> 'Front Squat/ SSB Bar' -> 'High Bar Squat' -> 'Low Bar Squat' (HARDEST) -> 'Overhead Squat' (VERY HARD)
* use: posture difficulty, not program level; observed weekly variation front-loaded early in the week, back-loaded later (WEEKEND-WARRIOR ATHLETIC ('JUSTICE LEAGUE' tab): 'Front Squats' Mon, 'Low Bar Back Squat' Thu)
* status: OBSERVED

**lunge_variables**
* ladder_observed: 'FFE CONTRA' -> 'FFE IPSI' -> 'RFE CONTRA' -> 'RFE IPSI' -> 'RFE' -> 'RFE & FFE' (one variable per week, AESTHETICS-8); 'FE contra' -> 'FFE ipsi' -> 'FF & RFE ipsi' -> 'RFE contra' -> 'RFE ipsi' -> 'FF & RFE dcontra' -> 'RFE contra' -> 'RFE ipsi' (HYBRID E88:L88)
* grammar: 'Stance loads the FRONT TO BACK', 'Load position loads UP/DOWN & SIDE2SIDE', 'Movement orientations/guidance loads AROUND'
* status: OBSERVED

**v1 notes on these ladders (coach answers).**
* **plyo**: the Sheet23 'ZONE 1/2/3' words are not zones. They name how a plyo is performed: receive & pause -> receive then create -> repeatedly receive and create; he has not named it yet (COACH-ANSWER CAT-10, CAT-11). Programs start more ballistic and become more plyometric; unilateral plyos are harder than bilateral (CAT-10). The reverse-banded rung is out of scope (EQ-12). Davidson zones are rotation biases and do not apply to plyos (CAT-10).
* **throws**: no levels ('just do them right', COACH-ANSWER LIB-06); medballs never over 20 lb (EQ-06); no medball for aesthetics/bodybuilders except in the warm-up (ATH-05).
* **olympic**: everyone in athletic training gets an Olympic variant: beginners DB/KB snatches, hex-bar jumps, hang pulls/cleans; intermediate+ the full lifts (COACH-ANSWER ATH-10). Full versions are named 'Squat Snatch', 'Squat Clean', 'Squat Clean & Jerk' (LIB-07). Push press is easier; push jerk is intermediate/advanced (LIB-13). Youth may do some Olympic lifts from the floor (ATH-09). The % ramp is confirmed (PER-09).
* **aerobic**: sessions per week 3 general/fat loss, 2 athletes in-season, 4 aesthetics/bodybuilders plus walks (COACH-ANSWER ATH-07); any erg, by calories, time or distance (EQ-14).
* **cod**: the route tiers apply to every athlete (COACH-ANSWER ATH-06).
* **core**: core work goes first by default, movable (COACH-ANSWER ATH-11); about 2 exercises (VOL-17); thorax vs pelvis rule confirmed (CAT-08).
* **squat_loading**: the posture ladder matches his load-position levels (front-loaded foundational, on the body intermediate, behind the body advanced; COACH-ANSWER CAT-04). Squat once a week; the second lower day uses leg press or belt squat (COACH-ANSWER PER-04, EQ-11; replaced in v1.1, see below).
* **lunge_variables**: contralateral load pulls you into the hip (change-of-direction athletes), ipsilateral helps you out of it (sprint acceleration, ipsilateral step-ups); for bodybuilders and powerlifters contra/ipsi work is a health accessory, mostly in the first 2-4 weeks (COACH-ANSWER CAT-13).

**v1.1 notes (round 2).**
* **plyo**: the stages are named Receive-Create: RC1 Land -> RC2 Land & Go -> RC3 Repeat, 12-week weeks 1-3 / 4-7 / 8-12, 8-week 1-2 / 3-5 / 6-8; restart each off-season; hold in maintenance (COACH-R2 R2-ATH-03). Ballistic = longer contact or one big effort; plyometric = short bouncy contacts (R2-ATH-02). 60+: no plyos or depth jumps by default (R2-ATH-08).
* **olympic**: up to 4 days a week, clean days = squat pattern, snatch days = hinge pattern (R2-ATH-04); full squat cleans/snatches 3-5 reps per set (R2-ATH-05); by RPE and speed unless a tested max (R2-GEN-06); 60+ none by default; youth from the floor from ~14 after a hang block (R2-ATH-08).
* **aerobic**: athletes off-season 2-4 by sport, pre-season 2; powerlifters 2 easy Orange (R2-ATH-06); aesthetics 4 incl. a 2nd easy Orange + optional walks; every count adjustable (R2-SES-06).
* **core**: opens the session light (2 exercises x 2 sets, short of failure); core supersets or monster sets may be added anywhere (R2-SES-03).
* **squat_loading**: heavy squat and heavy deadlift on two different days; the counted axial list (R2-SES-01, R2-SES-02).

---

## 3. The levers

### 3.1 Lever catalog (what he changes, how much, and when)

Columns 3-8 are the observed record (v0). The last column is the v1 rule the generator follows, with the question IDs; a **v1.1** sentence at its end gives the round-2 change.

| Lever | Name | Coach vocabulary (verbatim) | What changes | Observed step / cadence | When he pulls it (observed) | Limits / rule (observed) | Status | v1 rule (coach answers) |
|---|---|---|---|---|---|---|---|---|
| L01_SETS | Sets per exercise / hard sets per muscle per week | 'SETS' header rows (4 TRACKS C32, N31, N5, D71) / BYOP SETS dropdown 1-8 + 'SUPERSET W/ 👇' / 'PART C 4x' (BASEBALL) / 'LVL n = k SETS x r' (CROSSFIT) | Whole-set steps: +1 set to every exercise of a block, or +1 set to one or two slots. | +1 set/exercise every 2-3 weeks (= +25-50% per step): AESTHETICS-8 2->3 (wk2), 3->4 (wk5), 4->5 (wk7); AESTHETICS-12 3->4 (wk4), ->3 deload (wk7), ->4 (wk8), ->5 (wk12); STRENGTH-12 main lift 4,4,5,5,6,6 \| 3 \| 5,6,6,7,7; HYBRID 2,2,2,3,3,3,4,4; BASEBALL Part C/D 4 -> 5 for the last 3 pre-season weeks; FAT BURN +1 set on 1-2 slots (weekly sets 60,60,64,70); CROSSFIT FULL TIME 3->4->5->6 per monthly level. | HYPERTROPHY: PRIMARY in accumulation (every 2-3 weeks); STRENGTH: main-lift sets rise as reps fall (load-driven); conjugate version lets sets FALL; FAT_LOSS: 1-2 compound slots per week; HYBRID: every 3 weeks; ATHLETE_OFF: 2-week steps; ATHLETE_PRE: only the last 2-3 weeks before the deload; ATHLETE_IN: FROZEN at 4 sets on Part C/D (Part A 1-3, Part B core 2-4 or 'Accumulate'); DELOAD: cut to 3 per main exercise (2 isolation) | max sets per slot observed: 4 (FAT BURN), 5 (AESTHETICS, BASEBALL), 6 (BOXING complex rows wk8; STRENGTH-12 wk5-6 and wk9-10; CROSSFIT FULL TIME L4), 7 (STRENGTH-12 wk11-12); dropdown max 8. | OBSERVED | Smooth: 3/5/7 % of each muscle's weekly sets per week, chosen by the person's state; banked; one set at a time on the first exercise of the day, then the next (COACH-ANSWER VOL-04, VOL-05, VOL-06, VOL-07). Total weekly sets rise by less than 10 % a week (UNI-05: 10 % is 'way too much'; releases staggered, PROPOSED). Deload = about half the sets (PER-05). In-season rate 0, 2 days/week (PER-08). Steps every 2 weeks only for fight/competition prep (PER-10). **v1.1:** Stairway: planned steps 3 % to halfway then 5 %, λ-scaled so each muscle peaks on its cap in the last week (older adults <= 3 %); a check-in moves the step from effort, completion and pain (+2 points if too easy, max 7 %; hold on 9-10); never a deload inside a block; one recovery week (half the sets) between blocks; pre-season flat at ~60 %; in-season 0 % (R2-PER-03/04, R2-VOL-01/03/07, R2-PER-06). |
| L02_REPS | Reps per set (rep wave / pyramid / rep ladder) | 'REPS ' row / '12/10/8 -20' pyramids / 'VOL 1/2/3' legend / BYOP REPS menu '4 to 6' ... '20 Reps', 'MYO SET' | Rep target per set. Compounds: descending waves (12->10->8, 15->12->10->8, 5->4->3->2->1). Isolation: rises (FAT BURN leg ext/curl slot 15->20->40->40, arm slot 30->30->30->40, side raises 15->15->20->20) or 'MAX'. Hybrid: ascending wave 6->8->10 then +1 set. | -2 reps per week inside a 3-week wave (AESTHETICS-8: 12,10,8); -1 rep per 2 weeks (STRENGTH-12: 5,5,4,4,3,3); isolation reps +33 %, +100 %, 0 % week to week on the FAT BURN leg ext/curl slot (15, 20, 40, 40). | HYPERTROPHY: PRIMARY inside a wave (load goes up as reps go down); STRENGTH: PRIMARY (5 -> 2 reps, or ME 5->1); FAT_LOSS: compounds down, isolation up; HYBRID: ascending 6/8/10 waves; ATHLETE_OFF: VOL 1 -> VOL 2 (12-15 -> 8-12); ATHLETE_PRE: VOL 3 and below (6-8, 4-6, 8/6/4/4); ATHLETE_IN: fixed 8-10 (no compound below 8 reps); DELOAD: 8 reps | OBSERVED inverse legend (BASEBALL A19:C22): as compound reps fall (12-15 -> 8-12 -> 6-8) isolation reps rise (10-12 -> 15 -> 'MAX REPS'). | OBSERVED | Small muscles 12-30, big 5-15 (VOL-11); preference moves reps on big compounds only (VOL-12); athletes VOL 1 -> VOL 2 -> VOL 3 one per off-season block (PER-11); '12/10/8 -20' = pyramid + light 20 (PRG-07); 40s only as AMRAP option (VOL-11). |
| L03_LOAD_PCT | Load as %1RM | '%' row 80,80,85,85,90,90 (STRENGTH-12) / 'Hang cleans @ 75%' ... '@ 90%' (BASEBALL OLY) / '78% of 1RM' (FRENCH CONTRAST) / 'FAST RPE6 or about 60-70%' / 'BOTTOM BANDED' 'Weight should be lower ranges around 50% so you can move fast' (B36) / 'BOTTOM CHAINS' 'Weght can be moderate around 70%' (B40) (ALL ABOUT SQUATS) | +5 % every 2 weeks (strength main lift); +5 % per week over 4 weeks with reps 8,6,6,4 (Olympic piece). |  | STRENGTH: PRIMARY; ATHLETE_PRE: OLY piece only (75->80->85->90); ATHLETE_IN: never (no OLY in-season); HYPERTROPHY: not written (implicit: heavier as reps drop); FAT_LOSS: not written |  | OBSERVED (only 4 places use %); everywhere else load is cued with words: 'HEAVY', 'light weights', 'FAST', 'MID WEIGHT', 'same speed for all reps'. | Confirmed for strength-focused plans and Olympic lifts: 80/80/85/85/90/90 % with RPE 7 -> 10; Olympic 75 -> 80 -> 85 -> 90 % with 4x8 -> 4x6 -> 4x6 -> 4x4 (COACH-ANSWER PER-09). Elsewhere load follows RIR. **v1.1:** % only for barbell main lifts with a recent tested best and for Olympic lifts with a tested max of that lift; otherwise RIR/RPE with the week-1 tip (R2-GEN-06, R2-ATH-05). |
| L04_EFFORT | Proximity to failure (RIR / RPE / MAX / ALL / EASY) | '*Always leave 1 rep in the tank, never work up to failure but get as close as you can ' / 'Always go for 1-3 RIR (REPS IN RESERVE) aka RPE 7+' / '(1 RIR) *RPE8+' / '1-2 RIR' (AESTHETICS-8 col D) / '1RIR','2RIR','MAX','ALL','EASY' (STRENGTH-8 col D) / RPE row 7..10 (STRENGTH-12) / BYOP EFFORT '8 - That was perfect' | By exercise role in the conjugate tabs (ME and dynamic-effort lifts '1RIR', second compound 4 x 6 '2RIR', upper/unilateral accessory 4 x 8-10 'MAX', 2-3 x '8/8' finisher 'ALL', plyo 'EASY'); on Monday/Wednesday these fall on the 1st-4th rows, but on Thursday the plyo row is first, so DE squat = 2nd row '1RIR', pull-ups = 3rd row '2RIR', lunges = 4th row 'MAX' (4T D17:D20) - and by week (RPE 7 -> 10 across a strength wave). The 3rd/4th rows are not one exercise class: STRENGTH-8 'MAX' rows hold pull-ups/DB rows, alt incline DB bench and lunges; its 'ALL' rows hold RFE lunges/staggered DL and bicep curls. |  | STRENGTH: RPE 7 -> 8 -> 9 (-> 10 in the last week); HYPERTROPHY: held at 1-2 RIR; isolations to 'MAX'; ATHLETE: 1-3 RIR on lifts; max intent / full quality on athletic work; 'EASY' on conjugate plyos; DELOAD: RPE 7 ('MID DELOAD' RPE 7) |  | OBSERVED words; exercise-class mapping INFERRED | RIR is the model: 1-3 RIR at all times, RPE explained alongside; 'MAX' only on small-muscle or bodyweight work; never to failure on heavy compounds (COACH-ANSWER VOL-13, GEN-08). Ramp inside the band by phase: PROPOSED. **v1.1:** The stair from a '2' to an '11': 3 RIR in the first half, 2 after halfway, 1-2 in the last weeks, 1 + intensifiers (MYO, supersets) in the final week; effort 10 = 'the max I could do, but successful' (R2-PER-05, R2-VOL-02; ladder PROPOSED). |
| L05_EXERCISE_TIER | Library tier FOUNDATIONAL -> MODERATE ('INTERMIDIATE') -> ADVANCED | BYOP row 3 'ZONE' ('EASY','MODERATE','ADVANCED','HARD','FOUNDATIONAL','ANY'; throws 'AP - THROWING') / Sheet23 'FOUNDATIONAL - RP - BS - ...' / RESISTANCE PATTERNS traffic light (green/yellow/red) | Move ONE slot one tier along its own ladder. Level is a property of the slot, not the person (WEEKEND-WARRIOR ATHLETIC ('JUSTICE LEAGUE' tab) mixes tiers in one day). |  | ALL: between blocks or at a phase change (BOXING wk3, AESTHETICS-12 wk8-9, FAT BURN wk3); ATHLETE_IN: never (familiar menus) |  | OBSERVED ladders; promotion timing INFERRED | Move up at the end of a block when the slot felt '8 - That was perfect' or easier with no pain (COACH-ANSWER PER-06); levels are theoretical (CAT-05); client level and exercise level are separate (CAT-06); older/injured clients may use any-level machines (EQ-04); client preference can pick between alternatives (EQ-10). **v1.1:** Level up at the end of an exercise block; level from load position, skill and stability, zone only a tag (PER-06, R2-LIB-02). |
| L06_VARIATION | Variation inside the pattern (one Pat-Davidson variable at a time) | A/B weeks ('A WEEK','B WEEK') / squat ME week / deadlift ME week (STRENGTH-8 alternates them; 'KD/HD' is written only in HYBRID, C74/C86 'KD', B76 'UNI HD') / 'FFE CONTRA' -> 'FFE IPSI' -> 'RFE CONTRA' -> 'RFE IPSI' / '(D)BOX' / '(T&G)BOX', 'DEFICIT', 'CHAINED', 'BANDED' / front-loaded -> back-loaded squat ladder | Stance (FFE/RFE), load position (contra/ipsi, front/back), implement (machine -> DB -> barbell), ROM (elevated/floor/deficit), end range (dead stop / touch & go), accommodating resistance, grip, angle (flat/incline). | weekly A/B swap (AESTHETICS-12, STRENGTH-12, FAT BURN); one lunge variable per week (AESTHETICS-8); 2-week mini-blocks (FAT BURN upgrade at WK3); new weekly menu (BASEBALL off-season); replayed menus (pre-season); 2 alternating familiar menus (in-season); conjugate weekly rotation (STRENGTH-8). | HYPERTROPHY: weekly A/B + one variable per week; STRENGTH: weekly conjugate rotation (squat ME week / deadlift ME week); FAT_LOSS: 2-week mini-blocks (upgrade at week 3); ATHLETE_OFF: new menu each week; ATHLETE_PRE: replay + intensify earlier menus; ATHLETE_IN: 2 alternating familiar menus; DELOAD: no new menu: BASEBALL replays the 'WEEK 7' exercises with bands, complexes, myo sets and 'heavy'/'weighted' versions stripped (simpler variants such as 'goblet squats' replace the banded ones) |  | OBSERVED | Exercises fixed inside a 4-6-week block; 1-2 small variables change at the next block (COACH-ANSWER PER-02). A/B lead-lift weeks only for variety seekers (PER-03). Second weekly exposure of a slot = different exercise; one axial-loading day per week (PER-04, EQ-11). Banded/chained variants out of scope (EQ-12). **v1.1:** One-detail variations of library exercises between exercise blocks, never invented exercises (R2-LIB-01); heavy squat and heavy deadlift on two different days (R2-SES-01/02). |
| L07_DENSITY | Density / time (rounds x work, AMRAP minutes, sprint reps, work:rest) | circuits '30 secs' -> '50 secs' / 'AMRAP' 12 -> 20 / 'Sprint 20/ Recover 40' rounds 5 -> 8 / '10x15 Sec sprint/30 sec walk' -> '10x 30 sec fastest/ 2 min walk' | Rounds and work interval together (FAT BURN 3x30 -> 5x50 s, x2.78 work in 4 weeks); rep count inside a fixed work:rest, then longer bouts at a longer rest ratio (HYBRID 1:2 -> 1:4). |  | FAT_LOSS: PRIMARY for circuits; HYBRID: PRIMARY for conditioning; ATHLETE: sprint/conditioning rounds; HYPERTROPHY: not used |  | OBSERVED | Bootcamp circuits 3-5 rounds x 30-50 s, 5-7 stations, 35-45 min (COACH-ANSWER PRG-03); FAT BURN circuits are finishers (PRG-11); supersets compress time and fatigue (ORD-05). **v1.1:** Bootcamp and fat-loss stairs climb rounds and seconds; in the year's Q1 cut the stair climbs by density and cardio while sets stay at the start (R2-PER-01). |
| L08_METHODS | Intensification methods (supersets, MYO, max-rep finishers, contrast / complexes, accommodating resistance) | '+ Superset with 15 squats with no weight every set' / '2 sets LEG PRESS MYO - 15-5-5-5-5-5' / '+ Max air squats' / 'FRENCH CONTRAST' / '3 Heavy SQUATs + 5 Tuck jumps + 5 DB squat jumps + 5 Squirrel jumps' / 'SUPERSET: HEAVY Hex bar Squats direclty into 10 Repeat Jump Squat HIGH JUMPs' / 'BANDED', 'CHAINED', '(D)BOX', '(T&G)BOX' | Concentrated in the LAST phase of hypertrophy plans (AESTHETICS-12 wk9-12; squat menu wave 3) and in the conversion / pre-season phases of athletic plans (BOXING wk3-8 complexes; BASEBALL Block 2 complexes). Never in deload weeks or the boxer base weeks. Exceptions: MYO SET preset on leg extensions in BYOP ATHLETIC week 1 (G12); contrast pairs in the athletic STARTING block; BASEBALL upper-body pairs 'Superset - same reps' / 'Superset - max reps', 'heavy Max reps' sets (CB34 Block 1, DX69 Block 3) and banded lifts run in all three blocks, from Block 1 week 1 (C34) to the in-season Block 3 (C70, AQ69 'SUPER SET 4X', DK68 'FAST BANDED DEADLFTS'); only the '5 of each' complexes and 'myo set' / 'myo sets' are confined to Block 2. |  | HYPERTROPHY: last phase only (weeks 9-12 of 12; peak week of 8); STRENGTH: accommodating resistance and box methods inside ME/DE variants; ATHLETE_OFF_BUILD: contrast pairs from the conversion phase (week 3); ATHLETE_PRE: complexes 5 x '5 of each', French-contrast style; 'myo set' / 'myo sets' on isolations; ATHLETE_IN: upper-body supersets ('Superset - same reps', 'SUPER SET 4X') and banded lifts continue; no complexes, no myo; BASE_or_DELOAD: never |  | OBSERVED | MYO only on the last machine/isolation exercise (VOL-15); supersets = fatigue tool (ORD-05); contrast/complexes intermediate+ off-season only, heavy lift ~78-85 % (ATH-12); no bands/chains/weight releasers (EQ-12). **v1.1:** Core supersets or monster sets may be added anywhere (R2-SES-03); intensifiers belong to the HARDEST weeks 9-12. |
| L09_FREQUENCY | Sessions per week of a quality / training days | 'LVL n = n wods a week' / aerobic 2,2,3,4 sessions by level / athletic STARTING 3 days -> MID/ADVANCED 4 days / '4 to 6 DAYS A WEEK' (optional Wed/Sat) | Add sessions of a quality per week (WODs 1->4, aerobic 2->4) or training days per level (3 -> 4). |  | HYBRID: WODs 1->4, aerobic 2->4 within a block; ATHLETE: +1 day from Starting to Mid; ALL: optional Wed/Sat days carry calves/core/focus/cardio |  | OBSERVED | Aerobic sessions 3 general/fat loss, 2 athletes in-season, 4 aesthetics + walks (ATH-07); in-season resistance 2 days (PER-08); optional days separate or add-on, ideally separate (ORD-10); days are adjustable (PRG-02). **v1.1:** Olympic lifts up to 4 days a week (R2-ATH-04); aerobic sessions by goal and sport, adjustable by the user (R2-ATH-06, R2-SES-06); in-season 2 gym days. |
| L10_QUALITY_SEQUENCE | Which quality is emphasised (hypertrophy -> strength -> power -> test; base -> conversion; build -> intensify -> maintain) | CROSSFIT macro rows / BASEBALL calendars ('OFF SEASON','PRE SEASON','IN SEASON','PLAYOFFS','POST SEASON','PEAK','DELOAD') / athletic notes 'Bring athletes back to feeling/moving great' ... 'Drive more strength/power/speed' | Switch the emphasised quality at block boundaries; earlier qualities drop to maintenance or disappear (power months drop resistance/strength). |  | ALL: at block boundaries (month in CROSSFIT; 8-week block in BASEBALL; wk3 phase change in BOXING) |  | OBSERVED | Athlete seasons off -> pre -> in -> post confirmed (PER-08); off-season phases by need (PRG-04); yearly mode quarter themes (PER-01). **v1.1:** Yearly gen-pop plan approved and tunable (R2-PER-01/02); athlete phases computed from the season start date (R2-GEN-05, R2-PER-06). |
| L11_ATHLETIC_DOSE | Athletic exposure (ground contacts, throws, sprint bouts) | Part A 2 -> 3 sets (BASEBALL) / '*MEDBALLS' 'ALL LIST' / 'SEE LIST' / Plyo slots per day (BYOP ATHLETIC 2 on A days, 1 on B days) | Contacts, throws and sprint bouts per week; set by sport, phase and level, cut ~65 % in deloads, held in-season. | BASEBALL contacts/week 199 (off) / 241 (pre) / 201 (in), deload 90; throws 178/192/176. ATHLETIC levels high-intensity contacts 146/71/32 + low-amplitude 0/120/100; throws 210/400/420. BOXING high 113-129 + low 142-177 (+ jump rope), throws 190 -> 380. | ATHLETE_OFF_BASE: throws only (fighters) or stick landings (Sheet23 'ZONE 1'; v1: stage 1 receive & pause); ATHLETE_OFF_BUILD: PRIMARY: athletic block added (phase change), then +1 set / +1 round every 2 weeks; ATHLETE_PRE: PRIMARY: peak contacts and throws (BASEBALL ~240 contacts/week); ATHLETE_IN: held near off-season level (~200 contacts, ~176 throws/week); STRENGTH: one plyo slot (3 x 6 'EASY'); DELOAD: cut ~65 % |  | OBSERVED | Own budget, never muscle sets (VOL-10); plyo vs ballistic share by the sport's ground-contact time (ATH-01, ATH-02); older clients few plyos unless asked (ATH-09); deload ~half (PER-05, 12_vol PROPOSED). **v1.1:** Plyo:ballistic end shares by sport approved, start 15 points lower (R2-ATH-01); in-season game-heavy sports ~half (R2-ATH-07); 60+ none by default (R2-ATH-08); recovery week ~half. |
| L12_PLYO_ZONE | Plyo method stage (v0: 'plyo zone') | Sheet23 C33:D36 'ZONE 1' 'Receive pause/creat', 'ZONE 2' 'Receive/create', 'ZONE 3 ' 'Repeat receive create' / BALLISTICS row 24 'TAKING IN FORCES' -> 'DELIVER FORCES FAST' -> 'AMORTIZATION OF FORCES' -> 'REBOUNDING ' / 'Drop & Stick - Hold for 3 seconds on each one' | Same jump done stick (Z1) -> single response (Z2) -> continuous (Z3); bilateral before unilateral; unloaded before weighted; no drop before drop; hop before jump; reverse-banded last. | HYBRID weekly ladder 'Depth drops' -> 'Weighted depth drops' -> 'depth drop to jump' -> 'weighted depth drops to jump' -> 'box jumps' x2 -> 'repeat hurdle hops' x2; STRENGTH-8 4-week cycle 'WEIGHTED DEPTH DROP' -> 'DEPTH DROP & JUMP' -> 'HIGH SQUAT JUMPS' -> 'REPEAT HIGH JUMPS'; WEEKEND-WARRIOR ATHLETIC ('JUSTICE LEAGUE' tab) within a week bilateral -> single-leg depth drop. | ATHLETE_OFF_BASE: Z1 only (none for fighters in weeks 1-2); ATHLETE_OFF_BUILD: Z1 -> Z2; ATHLETE_PRE: Z2 -> Z3 + contrast; ATHLETE_IN: hold Z2/Z3 at maintenance volume; STRENGTH: 4-week plyo ladder on the speed day (the plyo row is labelled 'the work' in the CONJUGATE draft M21); DELOAD: 1-2 sets, low amplitude |  | OBSERVED lists (BALLISTICS A24:D46, Sheet23 C34:D36); within-phase order rules INFERRED from list order; force-phase-to-zone mapping and zone-as-modifier INFERRED | Renamed: plyo METHOD STAGE, not a zone (CAT-10, CAT-11): receive & pause -> receive then create -> repeated receive/create; bilateral before unilateral (unilateral is harder); programs start ballistic and become plyometric. Reverse-banded rung removed (EQ-12). Stage weeks PROPOSED. **v1.1:** Receive-Create stages RC1 Land / RC2 Land & Go / RC3 Repeat: 12-week 1-3 / 4-7 / 8-12, 8-week 1-2 / 3-5 / 6-8; restart each off-season; hold in maintenance; int/adv may start at RC2 (R2-ATH-03). |
| L13_AEROBIC_ZONE | Aerobic zone unlock + pace | 'LVL 1 = C' / 'LVL 2 = C, B' / 'LVL 3 = C,B, A' / 'LVL 4 = LACTATE CLERANCE' / Blue 'A' / Green 'B' / Orange 'C' | Unlock faster zones by level; inside a level add volume/density first, then pace (FAST/FASTEST/SPRINT) with volume back down. |  | HYBRID: one level per month (C -> C+B -> C+B+A -> lactate clearance); FAT_LOSS: C 2x/week ('30-40 mi slow/steady CARDIO'); HYPERTROPHY: optional C on Wed/Sat ('max 40 min of steady'); ATHLETE: one A + one C per week; pre/in-season short 'SPEED POWER' buy-outs |  | OBSERVED | Blue/Green/Orange work on any erg, tracked by calories, time or distance (EQ-14); sessions per week by goal (ATH-07); real aerobic block at the start of fighter sessions (ORD-09). **v1.1:** Aerobic counts approved by sport (R2-ATH-06); aesthetics 4 incl. a 2nd easy Orange + optional walks; every count adjustable (R2-SES-06). |
| L14_SLOT_QUALITY | Quality of a slot (strength vs speed vs reactive version of the same pattern) | BASEBALL day tags 'Speed' (Mon), 'strength' (Tue), 'speed' (Fri) / 'bkd' slot filled with 'Hex bar squat jumps' / 'Front squats - light weights - same speed for all reps' / 'Oscilating drop squats' | Keep the slot, change the quality of the exercise put in it. Each lower pattern gets one speed and one strength exposure per week. |  | ATHLETE: every week: one speed + one strength exposure per lower pattern; STRENGTH: dynamic-effort day; ATHLETE_IN: speed lift alternates between Monday and Thursday week to week |  | OBSERVED (BASEBALL); rule INFERRED | Kept (OBSERVED baseball speed/strength days). In-season: speed athletes sprint, others keep strength or jumps (PER-08). |
| L15_SESSION_BUDGET | Exercises per session | BYOP ATHLETIC 10 slots/day / AESTHETICS 7 slots/day / FAT BURN 5/day / athletic levels 7-10 -> 6-8 lines per workout | Fewer exercises per session as athletes advance (lines per workout: Starting 10/7/7 -> Mid 10/14/8/16 incl. single throw lines, 10/4/8/6 without them -> Advanced 6/6/8/6); budget traded between athletic and resistance slots. |  | ATHLETE: fewer exercises per session as the level rises; ALL: cap ~7 exercises (physique), 10 (athletic), 5 (fat burn) per session; ~20 working sets |  | OBSERVED | Resistance-only 5-7 exercises; field athletes off-season up to 10-12 (2 core + 2-4 plyo/ballistic + 2-3 Olympic/power + 3-4 resistance); ~1.5 h (max 2 h) athletes/bodybuilders/powerlifters, 45-60 min general/weight loss; core first (VOL-08, VOL-16, VOL-17, UNI-09, ATH-11). **v1.1:** Field athletes up to 12 exercises + 2 core (R2-SES-04); core opens light 2 x 2 (R2-SES-03); full-body days 2-4 exercises per muscle, never 1, so they run longer than 5-7 exercises (about 7-10 resistance exercises, 55-80 min; R2-SES-05, 12_volume_algorithm v1.1 §3.10). |

### 3.2 Which lever is primary in which goal and phase

Legend: **P** = primary; **S** = secondary; **H** = held/frozen; **D** = cut in deload; **-** = not used. The athlete columns follow the baseball and boxing evidence. Cells changed in v1 carry the reason.

| Lever | HYPERTROPHY | STRENGTH | FAT_LOSS | HYBRID | ATH_OFF_BASE | ATH_OFF_BUILD | ATH_PRE | ATH_IN | DELOAD/TAPER |
|---|---|---|---|---|---|---|---|---|---|
| L01_SETS | P (stairway) | S | P (stairway; Q1 cut flat) | P | H | S (stairway) | flat ~60 % (R2-PER-06) | H (0 %, 2 days) | D (recovery week only) |
| L02_REPS | P | P | P | P | H | S | P | H | D |
| L03_LOAD_PCT | - | P (template; % only with a tested best, R2-GEN-06) | - | S | - | - | S (OLY by RPE/speed unless tested, R2-ATH-05) | S (OLY 2 x 3 light, R2-ATH-04) | keep/- |
| L04_EFFORT | S | P | S | S | S | S | S | H | D(3+ RIR) |
| L05_EXERCISE_TIER | S (end of block, PER-06) | S | S (end of block, PER-06) | S | - | S (end of block, PER-06) | S | H | H |
| L06_VARIATION | S (fixed per block, 1-2 variable changes; A/B only for variety seekers, PER-02, PER-03) | S (fixed per block; conjugate not required, PER-01, PER-02) | S (4-6-week blocks, PER-02) | S | S | S (fixed per block, 1-2 variable changes, PER-02) | S(replay) | S(2 menus) | H |
| L07_DENSITY | - | - | P | P | S | S | S | H | D |
| L08_METHODS | S (hardest weeks; MYO on the last isolation, VOL-15) | S (no bands/chains, EQ-12) | S | S | - | P(complexes) | S (no complexes, ATH-12) | S(supersets) | off |
| L09_FREQUENCY | - | - | S | P | - | S | - | H | keep |
| L10_QUALITY_SEQUENCE | block | block | - | P(monthly) | P | P | P | P(maintain) | - |
| L11_ATHLETIC_DOSE | - | S(1 plyo) | - | S | S(throws only) | P | P | H (game-heavy: plyos ~half, R2-ATH-07) | D(~half) |
| L12_PLYO_ZONE (RC stage) | - | S | - | S | RC1 Land (weeks 1-3) | RC2 Land & Go (4-7) -> RC3 Repeat (8-12) (R2-ATH-03) | hold the stage reached (R2-ATH-03) | hold | RC1 / low |
| L13_AEROBIC_ZONE | 4/wk incl. a 2nd Orange + optional walks; adjustable (R2-SES-06) | 2 easy Orange (powerlifters, R2-ATH-06) | 3/wk (ATH-07); Q1 cut +1 | P | by sport 2-4 (R2-ATH-06) | by sport 2-4 | 2/wk (R2-ATH-06) | 2/wk + short buy-outs (ATH-07) | C easy |
| L14_SLOT_QUALITY | - | S(DE day) | - | S | - | S | P | P(speed/strength alternation) | - |
| L15_SESSION_BUDGET | H | H | H | H | S | S | H | H | H |

**The rule of thumb behind the matrix (INFERRED from the pattern of P's):**
* Hypertrophy pulls **sets + reps + variation** and saves **methods** for the end.
* Strength pulls **reps + load + effort**, and lets sets rise or fall to keep 14-25 reps per session on the main lift (STRENGTH-12 18-20 in weeks 1-10, 14 in weeks 11-12; CrossFit FULL TIME 21-25).
* Fat loss pulls **density + sets on compounds + reps on isolation**.
* Hybrid pulls **frequency + density + reps**.
* Athletes pull **quality sequence + athletic dose + slot quality** and leave resistance sets nearly flat, except the last 2-3 pre-season weeks.

**v1 note.** The rule of thumb still describes his sheets. For the generator: volume moves smoothly by the person's rate in every family (COACH-ANSWER VOL-05) except fight/competition prep and the strength main-lift template, which step every 2 weeks (PER-10, PER-09); methods are limited to MYO on the last isolation, supersets as a fatigue tool and off-season contrast for intermediate+ athletes (VOL-15, ORD-05, ATH-12); no variable resistance (EQ-12).

**v1.1 note.** Every family runs the stairway (COACH-R2 R2-PER-03, R2-PER-04). The DELOAD/TAPER column now means the recovery week between blocks or the pre-season taper, never a week inside a block (R2-VOL-07). Plyo stages and aerobic counts follow the approved round-2 numbers (R2-ATH-03, R2-ATH-06).

---

## 4. Volume progression v1.1 (replaces the v0 'Volume Governor')

The weekly-set engine itself is specified in `12_volume_algorithm` (v1.1 owns the set math: counting, starts, caps, check-in steps, banking, placement, examples). This section states the parts that shape a plan over time (the stairway) and records what was retired. **If 12 v1.1 publishes stairway step sizes other than the ones below, its numbers win and the grids here are recomputed.**

### 4.1 What the coach said vs what the sheets show

> His words: the 3 %, 5 % or 7 % is a percentage of weekly sets (COACH-ANSWER VOL-04). 'It doesn't really go by muscle, so this is not a big muscle thing or small muscle thing. It's just more on what's going on with the person' (COACH-ANSWER VOL-05). 'It can progress week by week by 10 %. That's way too much' (COACH-ANSWER UNI-05). 'I need this tool that we're building eventually to figure out the percentages' (COACH-ANSWER VOL-06).

**OBSERVED.** No sheet contains a 3 % step. He adds **+1 set to every exercise of a block every 2-3 weeks** (+25-50 % per step) or **+1 set on one or two slots** (FAT BURN 60 → 60 → 64 → 70). In his 12-week products these steps average 4-6 %/week (table 2.3).

**v1 reconciliation.** The generator applies one person-level rate (3, 5 or 7 %) to every muscle's weekly sets, banks the fraction and releases whole sets on the first exercise of the day first (COACH-ANSWER VOL-04 to VOL-07). His hand-written steps are what that bank looks like when written by hand (INFERRED). The v0 size tiers (big 3 % / medium 5 % / small 7 %) are retired (COACH-ANSWER VOL-05).

**v1.1.** Round 2 adds the time shape: the steps form a stairway, smaller in the first half and a little bigger after halfway, hardest weeks last (COACH-R2 R2-PER-03, R2-PER-04); with no check-in the planned steps run unchanged (R2-VOL-03); a check-in moves the step from effort, completion and pain only (R2-VOL-01 without its life column, R2-GEN-04).

### 4.2 The v1.1 rules that shape a plan

| Rule | Value | Tag |
|---|---|---|
| Unit | weekly hard sets per muscle (coach count: main mover 1.0, helpers 0.25; KB swings never count as glute volume; thruster 1.0 quads / 0.5 shoulders / 0.25 glutes) | COACH-ANSWER VOL-04, VOL-09; COACH-R2 R2-VOL-05 |
| Start | big muscles L1 10-12, L2 15-20, L3 20+ (engine 10 / 15 / 20); small muscles 10 / 12 / 15 (he approved 8 / 12 / 15 but '8 sets a week is probably just barely maintenance'; L1 lifted to 10); 'I don't think anybody needs less than 10 sets a week per muscle' = the floor inside training blocks (not maintenance) | COACH-ANSWER VOL-01; COACH-R2 R2-VOL-04, R2-VOL-06; 12_volume_algorithm v1.1 §3.3 |
| What 15-20 and 20-25 mean | 15-20 = maintenance to a little growth; 20-25 = growth; most people train 20-30 sets per muscle per week (his estimate; research in 12 v1.1); 5 'too little', 40 'way too much' | COACH-ANSWER UNI-01; COACH-R2 R2-VOL-06 |
| Caps | L1 14, L2 22, L3 25 for every target muscle (non-priority); priority 25-30; an optional 'pro' level above 30 for very advanced people who insist; all customizable | COACH-R2 R2-VOL-06 (approved) |
| Priority | +4-6 sets on the start, cap about 25-30, 1-2 muscles at a time; others <= 3 %/week while a priority runs; the priority exercise goes first in its session | COACH-ANSWER VOL-02, ORD-04; COACH-R2 R2-VOL-06 |
| Pain | that muscle/pattern -30-50 %, constrained machines or split grips, or drop the exercise | COACH-ANSWER VOL-03, UNI-08, EQ-03 |
| Weekly step (no check-in) | the planned STAIRWAY (7.0.1): 3 % to the halfway week, then 5 %, multiplied by one factor λ per muscle so its peak lands on its cap in the last week (12-week big muscles: L1 0.76, L2 0.87, L3 0.50); older adults (60+) at most 3 %; no lifestyle input; never above 7 % planned | COACH-R2 R2-PER-03, R2-PER-04, R2-VOL-03, R2-GEN-04; step sizes and λ PROPOSED (12_volume_algorithm v1.1 §3.7.1) |
| Weekly step (with a check-in) | on target (effort 7-8) = the planned step; too easy (mostly 1-6) = the planned step + 2 points (max 7 %); 9 = hold; any 10 = hold and -1 set on that day; under half the sessions = repeat the week (the block becomes one week longer) | COACH-R2 R2-VOL-01, R2-VOL-02; reading against the stairway PROPOSED (12 v1.1 §3.7.3) |
| Ceiling | the person's total weekly sets rise by less than 10 % a week: he called 10 % 'way too much ... hard to sustain'; planned steps top out at 5 %, check-in steps at 7 %. A single muscle's +1 set can read +10 % on a 10-set start (rounding, VOL-06); when several muscles would release in the same week and push the total to 10 %, the smallest banks wait a week (staggering PROPOSED; every L1 muscle starts at 10 and would release together: +10.0 % in week 6 of a 12-week block and week 5 of an 8-week block) | COACH-ANSWER UNI-05, VOL-06; staggering PROPOSED |
| Rounding | bank the fraction weekly; place a whole set each time the bank (planned target - current sets) reaches 1: usually one set per muscle per week, two only when a λ-anchored final week needs it (e.g. the 11-week year Q4 block, week 50: 22 -> 24); the tool computes the % | COACH-ANSWER VOL-06; 12_volume_algorithm v1.1 §3.8 |
| Placement | first exercise for that muscle in that day's order, then the next (2/2/2 -> 3/2/2 -> 3/3/2 -> 3/3/3 -> 4/3/3); with two weekly exposures alternate the first exercise between them (R2-VOL-08 default, not understood by the coach); small muscles at the end -> bonus exercise on the optional day; big muscles that are full -> Focus slot | COACH-ANSWER VOL-07, ORD-10, ORD-11; R2-VOL-08 default |
| Phase limits (this file) | stairway halves (above); older adults <= 3 %; maintenance 0 %; pre-season and in-season 0 % (flat sets); fight/competition prep in 2-week steps | COACH-R2 R2-PER-03, R2-PER-04, R2-PER-06; COACH-ANSWER PER-08, PER-10 |
| Cap reached | the stair keeps climbing by load, reps, RIR and intensifiers (MYO on the last machine/isolation, supersets); advanced lifters also by a rotating priority muscle | COACH-ANSWER VOL-15, ORD-05; COACH-R2 R2-PER-05 |
| Unilateral | progresses the same way as bilateral | COACH-ANSWER UNI-05 |
| Deload | never inside a block; one recovery week between two completed blocks at about half the sets of the hardest week (section 6) | COACH-ANSWER PER-05; COACH-R2 R2-VOL-07 |

### 4.3 Smooth increases vs steps and waves (COACH-ANSWER PER-10)

He confirmed: smooth weekly increases for hypertrophy and general clients; 2-week steps and waves for fight or competition prep (PER-10). Round 2 makes every smooth plan a stairway (R2-PER-03, R2-PER-04).

| Family / piece | Pattern | How | Tag |
|---|---|---|---|
| hypertrophy / aesthetics | STAIRWAY (smooth weekly bank) | 3 % to halfway, then 5 %, λ-scaled per muscle so the peak lands on the cap in the last week | COACH-ANSWER PER-10; COACH-R2 R2-PER-03/04 |
| general, beginners, weekend-warrior athletic / stay athletic and active | STAIRWAY (smooth) | as above, general factor x0.8 | COACH-ANSWER PER-10; COACH-R2 R2-PER-03 |
| fat loss | STAIRWAY (smooth) | the standard stairway on the x0.8 start (floor 10); year Q1 cut: sets at the starting level, stair by cardio, density and load | COACH-R2 R2-PER-01; 12_volume_algorithm v1.1 |
| strength main lifts | STEPS inside the stairway | confirmed template, 2-week steps; weeks 4-8 = STRENGTH-12 weeks 1-5, 9-12 = weeks 6, 10, 11, 12 | COACH-ANSWER PER-09, PER-10 |
| fight / competition prep | STEPS & WAVES | 2-week steps, unload, taper | COACH-ANSWER PER-10 |
| athlete off-season | STAIRWAY sets inside rep steps | VOL 1 -> 2 -> 3 per exercise block | COACH-ANSWER PER-11; COACH-R2 R2-PER-03 |
| Olympic piece | STEPS | 4 x 8 -> 4 x 6 -> 4 x 6 -> 4 x 4, heavier while fast (by RPE; % only with a tested max) | COACH-ANSWER PER-09; COACH-R2 R2-ATH-05, R2-GEN-06 |

**Step size (PROPOSED).** A 2-week step releases what two weeks of the stairway would bank, so smooth and stepped plans reach the same weekly sets by the end of each pair of weeks.

### 4.4 What was retired, and why

* **Size tiers** (LARGE 3 % / MEDIUM 5 % / SMALL 7 %) and the 'focus muscle moves up one tier' modifier: contradicted by COACH-ANSWER VOL-05. A priority muscle now gets +4-6 sets on its start instead of a faster rate (VOL-02).
* **Ceilings 20 (non-focus) / 26 (focus) and the one-week 30-35-set overreach**: replaced by level starts and caps (12_volume_algorithm_v1 §3.3) and the priority cap of about 25-30 (VOL-02). The observed AESTHETICS-12 week 12 (32-35 sets on quads, glutes, chest, back, triceps) is not copied: '40 sets of chest per week might be way too much' (UNI-01).
* **The fat-loss '3 % cap' as a size-tier rule**: kept only as a PROPOSED deficit rule, not tied to muscle size; retired in v1.1: fat-loss blocks use the standard stairway on the x0.8 start (12_volume_algorithm v1.1), and the year's Q1 cut keeps sets at the starting level (R2-PER-01; SCIENCE Murphy & Koehler 2022).
* **The 'beginner uses the level-ladder steps' modifier**: beginners use the same smooth rate; the NOVICE → NEWBY → INTERMEDIATE ladder survives as the rep ladder of the L1 overlay (section 8.1).
* **The v0 worked example (4.6)**: it was built on the size tiers, so it is removed. Computed v1 examples with real sessions are in 12_volume_algorithm_v1 §5 (beginner, intermediate with chest priority, tennis player off-season, maintenance block); single-muscle plan curves are in section 7 below.
* **STEP vs SMOOTH modes**: v0 made STEP the default for strength, athletes, hybrid and the packaged aesthetics plans. v1 follows PER-10 (table 4.3).
* **Retired in v1.1** (round 2): the intake-based starting rate (5 %, or 3 % for stress, short sleep, a physical job, 60+, layoff or pain) and the 'target-seeking' smallest rate (R2-VOL-03, R2-GEN-04: the planned stairway is the same for everyone at a level); the readiness score with a 0.20 life weight (R2-GEN-04); the 8-week x1.10 'start hard' and <= 5 % cap (R2-PER-03); the 12-week acclimation <= 3 % cap as a separate rule (now the first-half stairway step); triggered deloads inside a block (R2-VOL-07).

---

## 5. Intensity and effort

### 5.1 Effort by exercise class (the coach's own grammar)

| Exercise class | Effort | Evidence | Status |
|---|---|---|---|
| Main bilateral compound ('the work', M.E.) | '1RIR' (RPE ~9); wave from RPE 7 to 9 (10 in the final week of a 12-week strength plan) | STRENGTH-8 col D; STRENGTH-12 RPE row | OBSERVED |
| Dynamic-effort / speed version | 'FAST RPE6 or about 60-70%' (STRENGTH-12); bands are the coach's speed tool ('Bands are designed for speed/velocity', 'Weight should be lower ranges around 50% so you can move fast'); chains are NOT a speed tool in his words ('*INTENSIONALLY SLOW YOU DOWN', 'Chains are designed for magnitude influence, loading.', 'Weght can be moderate around 70%') and STRENGTH-8 uses them on the max-effort day ('HEAVY CHAINED DEADLIFT' H9; the draft's speed-day 'FAST CHAINED DL' CJ H22 became 'FAST BANDED DL' 4T H18). CONFLICT: STRENGTH-8 and the CONJUGATE draft label their dynamic-effort rows '1RIR' (4T D18/D21, CJ D22/D25) | STRENGTH-12 N17/N21; ALL ABOUT SQUATS A35:C40; 4T D18/D21, H9, H18; CJ H22 | OBSERVED (conflicting labels; open question) |
| Secondary compound, 4 x 6 ('the accessory' on Mon/Wed/Sat; on Thursday the 4x6 pull-ups/DB rows sit in 'the nuance' row M19) | '2RIR' | STRENGTH-8 D10/D14/D19/D22 | OBSERVED |
| 3rd row of the day ('the nuance') | 'MAX' on the Monday/Wednesday/Saturday 3rd rows of STRENGTH-8/CONJUGATE: 'PULL UPS'/'DB ROWS 8/8' 4x8 (Mon) and 'ALT INCLINE DB BENCH' 4x10 (Wed, Sat). On Thursday the 3rd row ('the nuance', M19) is 'PULL UPS'/'DB ROWS 8/8' 4x6 at '2RIR' (D19) and the 'MAX' sits on the 4th row ('the survival', M20: RFE/FFE lunges or staggered DL 4x10, D20), because the plyo row takes the first position. INFERRED meaning of 'MAX': heaviest for the reps, 0-1 RIR | STRENGTH-8 D11/D15/D19/D20/D23 with M11/M15/M19/M20/M23; CJ D15/D19/D23/D24 with M15/M19/M23/M24 | OBSERVED word; in STRENGTH-12 the same slot holds unilateral lower, 'TATE PRESS' 3x20 and 'CABLE FLIES' with no effort word, so 'nuance = unilateral, MAX' is INFERRED |
| 4th row of the day ('the survival') and isolations generally | 'ALL' on STRENGTH-8/CONJUGATE rows 'RFE LUNGES'/'STAGGERED STANCE DL' 2x'8/8' (Mon) and 'BICEP CURLS' 3x'8/8' (Wed); elsewhere isolations get 'MAX REPS' / 'MAX' / 'MYO SET' (to or near technical failure) | STRENGTH-8 D12/D16; BASEBALL legend 'VOL 3' 'MAX REPS'; UL calves and curls, PPL calves 'MAX REPS' | OBSERVED words; 'survival = isolation' holds in STRENGTH-12 (leg ext/curls, side raises/curls, JM press) but not on STRENGTH-8 Monday (RFE lunges): mapping INFERRED |
| Hypertrophy compounds | '1-2 RIR' (AESTHETICS-8); '(1 RIR) *RPE8+' (squat menus); 'Always go for 1-3 RIR (REPS IN RESERVE) aka RPE 7+' (instruction blocks) | 4 TRACKS D35:D62; ALL ABOUT SQUATS A13; UL/PPL A6 | OBSERVED |
| Plyos / athletic | 'EASY' (conjugate plyo); 'Drop & Stick - Hold for 3 seconds on each one' (landings); intent words appear only on some rows ('Really high jump squats LOAD & jump hard' C14, 'High Knee Runs FAST' C15, 'Max speed banded lat pull downs half kneeling ipsilateral' F47 in ATHLETIC); a blanket 'max intent with full quality' rule for all athletic work is the analyst's default (INFERRED) | STRENGTH-8 B17:D17; ATHLETIC MID F12 / ADVANCED J12 | OBSERVED labels; intent default INFERRED |
| Deload | RPE 7 ('MID DELOAD' RPE 7) / 3-4 RIR | STRENGTH-12 U4 | OBSERVED (RPE); RIR translation INFERRED |

**v1 notes.** RIR is the effort language of the model: 1-3 RIR at all times, with RPE explained alongside (COACH-ANSWER VOL-13). 'MAX' / 'MAX REPS' means technical failure and is used only on small-muscle or bodyweight work (VOL-13); heavy compounds never go to failure (GEN-08). The four slot meanings are confirmed by role: the work 1 RIR, the accessory 2 RIR, the nuance at MAX, the survival done no matter what (COACH-ANSWER ORD-07). Speed lifts use straight weight; bands are out (EQ-12); the '1RIR' vs 'FAST RPE6 or about 60-70%' label is still open.

**v1.1 notes.** Effort 10 on the check-in menu means 'the max I could do, but successful' ('I gave it all I had, but it was successful'); a separate 'failed' option may sit next to it (COACH-R2 R2-VOL-02). Effort is rated against the week's target: '8 - That was perfect' = hit the target the plan gave, so the planned '11' week logged as 8 is on plan. Weight guidance uses reps in reserve with a week-1 tip ('pick a weight you could lift 2-3 more times'); percentages only for barbell main lifts with a recent tested best and for Olympic lifts with a tested max of that exact lift (R2-GEN-06).

### 5.2 Effort across the phases of a plan: the stair from 2 to 11 (v1.1)

> His words (R2-PER-05): 'When I say started at 2 and ended at 11, I mean the amount of volume that they're putting themselves at as far as level, not the amount of sets.' ... 'The last week might feel like an 11, like you're doing more than what you usually do.'

His band is 1-3 RIR always (VOL-13). The stair below stays inside it: the first half sits at the top of the band (3 RIR, the '2'), the weeks after halfway at 2 RIR, the last weeks at 1-2 RIR, and the final week at 1 RIR with the block's highest volume and loads plus intensifiers (MYO on the last machine/isolation, supersets; MAX only on small-muscle or bodyweight work): the '11'. Drift PROPOSED, the same as 12_volume_algorithm v1.1 §3.7.2 (which flags it against VOL-13's 'no planned RIR ramp'); shape COACH-R2 R2-PER-04, R2-PER-05.

| Phase | Stair level | Compounds | Isolation / small muscles | Strength main lift | Athletic work |
|---|---|---|---|---|---|
| ACCLIMATION | 2-3.8 | 3 RIR (the week-1 tip: 'pick a weight you could lift 2-3 more times') | 2-3 | RPE 6-7, ~70-75 % | RC1 Land; max intent, low volume |
| DRIVE | 3.8-7 | 3 RIR to halfway, then 2 RIR | 2 -> 1; 'MAX' allowed on the last set of small-muscle or bodyweight work after halfway | RPE 7 -> 8 | RC2 Land & Go (RC3 from week 8 of 12) |
| HARDEST (12-wk 9-12; 8-wk 6-8) | 8-11 | 2 RIR -> 1-2 RIR -> 1 RIR in the final week (never to failure on heavy compounds); the final week is the block's heaviest and biggest (the '11') | 'MAX' on the last set; MYO on the last machine/isolation and supersets in the final week | RPE 9 -> 10 | RC3 Repeat; full recovery between sets |
| MAINTENANCE / PRE- and IN-SEASON | flat (no stair) | 2-3 | 2 | RPE 7-8, loads kept | quality over volume; stage held |
| RECOVERY WEEK (between blocks) | - | 3+ | 3+ | RPE <= 7 | landings / low amplitude |

**Stair level printed on each week (display, PROPOSED).** 12 weeks: 2, 2.6, 3.2, 3.8, 4.4, 5, 6, 7, 8, 9, 10, 11. 8 weeks: 2, 2.9, 3.9, 4.8, 6.3, 7.9, 9.4, 11. 11-week year block: 2, 2.7, 3.3, 4, 4.7, 5.4, 6.5, 7.6, 8.8, 9.9, 11.

**Planned RIR by week (12 weeks).** 3, 3, 3, 3, 3, 3, 2, 2, 2, 1-2, 1-2, 1 (+ intensifiers). 8 weeks: 3, 3, 3, 3, 2, 2, 1-2, 1 (+ intensifiers).

Observed anchors: STRENGTH-12 RPE row 7, 7, 7, 8, 8, 9, 7, 8, 9, 9, 9, 10 (O4:Z4); AESTHETICS-8 '1-2 RIR' (column D); BYOP EFFORT target label '8 - That was perfect' (AX15).

### 5.3 RPE ↔ %1RM chart used to infer missing percentages (SCIENCE: RTS / Tuchscherer practitioner chart, approximate)

| RPE \ reps | 1 | 2 | 3 | 4 | 5 | 6 | 8 | 10 |
|---|---|---|---|---|---|---|---|---|
| RPE10 | 100 | 95.5 | 92.2 | 89.2 | 86.3 | 83.7 | 78.6 | 73.9 |
| RPE9 | 95.5 | 92.2 | 89.2 | 86.3 | 83.7 | 81.1 | 76.2 | 70.7 |
| RPE8 | 92.2 | 89.2 | 86.3 | 83.7 | 81.1 | 78.6 | 73.9 | 68.0 |
| RPE7 | 89.2 | 86.3 | 83.7 | 81.1 | 78.6 | 76.2 | 70.7 | 65.3 |

Check against the coach's numbers:
* STRENGTH-12 week 1 is 5 reps @ RPE 7 → chart 78.6 % (coach wrote 80 %).
* Week 4 is 4 @ RPE 8 → 83.7 % (coach 85 %).
* Week 6 is 3 @ RPE 9 → 89.2 % (coach 90 %).

His percentages sit about 1-4 % above the chart in the odd weeks, which means the load steps a week before the RPE does. On the squat menus, '(1 RIR)' and '*RPE8+' are not equal on this chart (1 RIR = RPE 9); this is an open question.

### 5.4 The strength %-template inside the v1.1 stairway (COACH-ANSWER PER-09; COACH-R2 R2-ATH-05, R2-GEN-06)

He confirmed the STRENGTH-12 rows and the Olympic ramp as the default for strength-focused plans. In the v1.1 stairway the DRIVE weeks 4-8 run the observed weeks 1-5 and the HARDEST weeks 9-12 run the observed weeks 6, 10, 11 and 12; the observed week 7 'MID DELOAD' and weeks 8-9 drop out (never a deload inside a block, COACH-R2 R2-VOL-07). The percentages apply when the person has a recent tested best; otherwise the same rows run by RPE (R2-GEN-06).

| Week | Phase | Main lift sets x reps | % 1RM | RPE | Source |
|---|---|---|---|---|---|
| 1 | ACCLIMATION | 3 x 8 | ~70 % | 6 | PROPOSED |
| 2 | ACCLIMATION | 4 x 6 | ~72.5 % | 6-7 | PROPOSED |
| 3 | ACCLIMATION | 4 x 6 | ~75 % | 7 | PROPOSED |
| 4 | DRIVE | 4 x 5 | 80 % | 7 | OBSERVED STRENGTH-12 wk1 (O3:O6); COACH-ANSWER PER-09 |
| 5 | DRIVE | 4 x 5 | 80 % | 7 | OBSERVED wk2 |
| 6 | DRIVE | 5 x 4 | 85 % | 7 | OBSERVED wk3 |
| 7 | DRIVE | 5 x 4 | 85 % | 8 | OBSERVED wk4 |
| 8 | DRIVE | 6 x 3 | 90 % | 8 | OBSERVED wk5 |
| 9 | HARDEST | 6 x 3 | 90 % | 9 | OBSERVED wk6 |
| 10 | HARDEST | 6 x 3 | ~90 % | 9 | OBSERVED wk10 sets/reps/RPE (X4:X6); % INFERRED |
| 11 | HARDEST | 7 x 2 | ~92 % | 9 | OBSERVED wk11 (Y4:Y6); % INFERRED |
| 12 | HARDEST / TEST | 7 x 2, or 'Work up to 1RM' if ticked (only after a completed block) | ~95 % / max | 10 | OBSERVED wk12 (Z4:Z6); test COACH-R2 R2-PER-07 |

* **Olympic lifts (v1.1).** Up to 4 days a week ('it could be done four times a week'); clean-family days count as squat-pattern (knee-dominant) days, snatch-family days as hinge-pattern (hip-dominant) days ('I take snatches a little bit more hingy than squatty'). OBSERVED basis: BASEBALL Block 2 'wk 5' runs the OLY piece on Mon/Thu (cleans) and Tue/Fri (snatches); HYBRID-8 cleans Monday, snatch Thursday. Load: by RIR/RPE and bar speed ('these are for power output'): pick weights that stay fast, stop the set when the speed drops (coach's eye, R2-ATH-05); the % ramp (75 -> 80 -> 85 -> 90 %) only when the person has a tested max of that exact lift (R2-ATH-05); competitive Olympic weightlifters need their own programming (R2-GEN-06). Reps: DB/KB and hang-pull/hang-power variants keep the 4 x 8 -> 4 x 6 -> 4 x 6 -> 4 x 4 ramp; full squat cleans and snatches 3-5 reps per set at the same weekly reps (e.g. 6 x 5 instead of 4 x 8). In-season: a light piece, 2 sets of 3 (hang power clean or DB snatch), 1-2 days; dropped in heavy game weeks. 60+: no Olympic lifts by default; available as an option with the warning 'Make sure that you have a fitness professional to help you understand what this means.' Youth: from the floor from about 14 years, after one block of hang work. *(COACH-ANSWER ATH-10, PER-09, LIB-07; COACH-R2 R2-ATH-04, R2-ATH-05, R2-ATH-08, R2-GEN-06)*

| Phase | L1 days/week | L2 days/week | L3 days/week |
|---|---|---|---|
| Off-season | 2 | 2-3 | 3-4 |
| Pre-season | 2 | 2-3 | 2-3 |
| In-season | 1 (2 x 3) | 1-2 (2 x 3) | 1-2 (2 x 3) |
| Gen-pop athletic / weekend warrior | 1-2 | 2 | 2 |

*Defaults PROPOSED inside his maximum of 4 days.*

* **Science check (he asked: 'That's right. That's essentially it. I just want to make sure it's correct', PER-09).** Main lift: his loads sit about 1-4 percentage points above the RTS RPE chart for the same reps and RPE (5 @ RPE 7 = 78.6 % vs his 80 %; 4 @ RPE 7 = 81.1 % vs 85 %; 4 @ RPE 8 = 83.7 % vs 85 %; 3 @ RPE 8 = 86.3 % vs 90 %; 3 @ RPE 9 = 89.2 % vs 90 %), so the template is internally consistent; linear 2-week steps are as effective as undulating schemes for strength (Harries 2015) and any planned scheme beats none (Williams 2017). The 7 x 2 weeks are one set above the usual 2-6-set strength range, acceptable for trained lifters. Olympic ramp: 4 x 6 @ 80-85 % and 4 x 4 @ 90 % sit close to common power guidance (75-85 % for 3-5 reps per set); 4 x 8 @ 75 % is more reps per set than usual for full catch lifts (SCIENCE SCI_OLY_REPS). v1.1: he approved 3-5 reps per set for full squat cleans and snatches at the same weekly reps, with the coach's eye on speed (COACH-R2 R2-ATH-05).
* 8-week strength plan (PROPOSED, v1.1 stairway; no 'start hard'):

| Week | Phase | Main lift sets x reps | % 1RM | RPE | Source |
|---|---|---|---|---|---|
| 1 | ACCLIMATION | 3 x 8 | ~70 % | 6 | PROPOSED |
| 2 | ACCLIMATION | 4 x 6 | ~75 % | 7 | PROPOSED |
| 3 | DRIVE | 4 x 5 | 80 % | 7 | OBSERVED STRENGTH-12 wk1 |
| 4 | DRIVE | 5 x 4 | 85 % | 7 | OBSERVED wk3 |
| 5 | DRIVE | 5 x 4 | 85 % | 8 | OBSERVED wk4 |
| 6 | HARDEST | 6 x 3 | 90 % | 8 | OBSERVED wk5 |
| 7 | HARDEST | 6 x 3 | 90 % | 9 | OBSERVED wk6 |
| 8 | HARDEST / TEST | 7 x 2 @ ~95 %, or the test if ticked | ~95 % / max | 10 | OBSERVED wk12; PROPOSED placement |

* Part-time / class clients: the HALF TIME table (3 sets; reps 7 → 6 → 5 → 4; then 'Work up to 1RM', only after a completed block, R2-PER-07) (OBSERVED CF Q19:U25; COACH-ANSWER PRG-10).
* Client preference ('lighter, more sets' vs 'heavier, fewer reps') moves the reps on the big compounds only; weekly sets stay similar (COACH-ANSWER VOL-12).

### 5.5 Rest

| Context | Rest | Tag |
|---|---|---|
| Hypertrophy | 1-2 min between sets (up to 3) | COACH-ANSWER VOL-14; OBSERVED ALL ABOUT SQUATS B28 '*REST 1-2 MIN BETWEEN SETS' |
| Strength | 3-6 min | COACH-ANSWER VOL-14; OBSERVED E28 '*REST 3-6 MIN BETWEEN SETS' |
| Athletic | as prescribed; full recovery between high-intensity jump/sprint sets (~60-180 s; 2-3 min between depth-jump sets) | COACH-ANSWER VOL-14; SCIENCE NSCA; seconds INFERRED |
| Supersets | rest after the pair | COACH-ANSWER VOL-14 |
| Intervals | written as work:rest ('20/40', '15/45', ':30 sec') | OBSERVED AEROBIC cheat sheet |

---

## 6. Deload, test, taper and transition rules (v1.1)

> His words (R2-VOL-07): 'No maintenance weeks are supposed to be at the end of a block, or if the athlete or coach demands a program of maintenance. It should never be thrown in the middle of a block. No matter what the athlete puts, they need to be able to manage their block and complete it. If they can't complete it, they should cancel the block and start a maintenance phase, but then, when they're done with maintenance, they should start a whole new block.'

The v0 placements (deload in week 8 of 8, week 7 of 12, week 6 of 6) were retired in v1; the v1 triggered deload (D6) is retired in v1.1. The 'v1 rule' column keeps the previous text.

| Rule | Rule text (v1.1) | Status | v1 rule |
|---|---|---|---|
| D1_DOSE | Recovery (deload) week = about HALF the sets of the hardest (last) week (round up, min 1 per exercise), the same exercises, lighter load or 3+ RIR, no buy-outs, finishers, MYO or supersets. Athletic work: landings / low amplitude at about half the contacts and throws; conditioning easy (Orange) only. | COACH-ANSWER PER-05; COACH-R2 R2-VOL-07 (approved: 'half of the current (hardest) week, same exercises, 3+ RIR'); MYO/superset removal and athletic/conditioning parts PROPOSED | Deload = about HALF the sets of the current week (round up, minimum 1 per exercise), the same exercises, lighter load or 3+ RIR, no buy-outs, finishers, MYO or supersets. Athletic work: landings / low amplitude at about half the contacts and throws; conditioning easy (Orange) only. |
| D2_PLACEMENT_12 | 12-week block: NO deload or maintenance week inside. One recovery week sits after week 12 and before the next block's week 1 (the approved 'week 1 of the next cycle is a deload', counted as an extra week so the next block keeps its 12 stairway weeks). No recovery week when a maintenance phase follows or precedes. | COACH-R2 R2-VOL-07 ('It should never be thrown in the middle of a block'); counting PROPOSED (14.3 #2) | 12-week cycle: no deload at a fixed week. A deload happens when the logs trigger it (D6), and the first week of the NEXT cycle is a deload (skip it when a maintenance block came between). |
| D3_PLACEMENT_8 | 8-week block: same as D2 (nothing inside; one recovery week after week 8 when another block follows). | COACH-R2 R2-VOL-07, R2-PER-03 | 8-week plan: no planned deload inside (it 'starts hard' and drives weeks 5-8); triggered deloads only; the next plan opens with a deload or a maintenance block. |
| D4_MAINTENANCE_PHASE | Maintenance phase for: a cancelled block; the end of a block when the person or coach asks; vacation, travel, moving; user-marked holiday weeks; the automatic last 2 weeks of December; year Q3; the athlete's season change (pre-season, D8). The user picks its length (default 4 weeks) and can add weeks; at its end the plan stops and asks 'Keep maintaining / Change your plan / Start a training block' (no answer -> keep maintaining, PROPOSED). Volume 50-70 % of the last block's final 4 weeks (50 % vacation/limited equipment, 60 % travel/moving/season change, 70 % planned maintenance and year Q3; older adults >= 70 %), not floored (the floor of 10 is for training blocks); flat; RIR 2-3; no intensifiers; loads kept, sets cut. Afterwards a whole new block from week 1. | COACH-ANSWER PER-01 (50-70 %, uses); COACH-R2 R2-PER-06 (length chosen, extendable, prompt), R2-VOL-07 (cancel flow), R2-PER-01 (Q3 ~70 %); factor split, older floor and default answer PROPOSED; floor reading as 12_volume_algorithm v1.1 §3.3 | A 4-6-week maintenance/transition block replaces loading when life needs it: vacation (1-2 weeks inside it), travel, moving, season change (off -> in), or planned maintenance. Volume about 50-70 % of the last block (50 % vacation/limited equipment, 60 % travel/moving/season change, 70 % planned maintenance; older adults >= 70 %), rate 0, RIR 2-3, no intensifiers; keep the loads, cut the sets. |
| D5_VACATION | Vacation and holiday weeks are maintenance weeks (50 % with what is available, or full rest). Planned ahead: the planner places them between blocks. Marked after a block has started and inside it: that block ends early (D6 flow) unless the user removes the mark. Return: a new block at the previous start. | COACH-ANSWER PER-01; COACH-R2 R2-PER-02, R2-VOL-07; placement PROPOSED (14.3 #1); SCIENCE Hwang 2017, Bosquet 2013 | Vacation of 1-2 weeks: train at ~50 % with what is available (bodyweight, hotel gym), or rest completely; return at the previous start (no opening deload, no level step). |
| D6_CANCEL_BLOCK | No triggered deload (the v1 D6 is retired). The plan shows a block-at-risk prompt ('continue the block' or 'cancel it and start a maintenance phase'; it never inserts lighter weeks by itself) when, with check-ins: 2 hold weeks in a row; effort mostly 9-10 two weeks in a row; under half the sessions 2 weeks running; 'Felt a PAIN' on 2+ exercises in one week; or the person taps 'I can't keep up'. The person or coach decides: continue (holds and repeated weeks are allowed) or cancel -> maintenance phase (D4) -> a whole new block from week 1 at the same start. Without check-ins there are no signals and the block runs as planned. | COACH-R2 R2-VOL-07 ('If they can't complete it, they should cancel the block and start a maintenance phase'), R2-VOL-03; offer signals PROPOSED | (D6_TRIGGERED_DELOAD) Early (unplanned) deload when: 2 weeks of hold in a row; median EFFORT >= 9 two weeks in a row; 'Felt a PAIN' on 2+ slots in one week; or performance down on 3+ main lifts for 2 exposures. After it, resume at the volume of 2 weeks before. |
| D7_TESTS | Tests are ticked at the start of the block (or 'No need for testing'). Baseline before the block or in week 1 (week 1 is the light '2' week); end test in the last week, replacing that week's top sets; the rest of that week at about 50-70 % of its sets. Never during the block. Anyone who has not completed a training block (new, untrained, or back after 6+ months off) tests submaximally: 5RM or 3RM for strength, 80-90 % efforts for cardio and speed; never a 1RM or a max-effort mile from zero. The previous block's end test is the next block's baseline. | COACH-ANSWER PER-07; COACH-R2 R2-PER-07 (before + end only; submax from zero; menu and reminders approved); rest-of-week dose and baseline reuse PROPOSED; SCIENCE Reynolds 2006, Pritchard 2016 | Tests are chosen by checkbox at the start of the block, or 'No need for testing'. The test day sits in the last week of the block and replaces that week's top sets; the rest of that week runs at about 50-70 % of its sets. Reminders before the test (section 6.1). |
| D8_TAPER | Taper = the last 1-2 weeks before a season opener, event or fight: volume about -40-60 % (progressive), intensity and frequency kept, no new exercises. Athletes: inside the 4-6-week pre-season block (1 week for a 4-5-week pre-season, 2 weeks for 6). Swimmers' main championship meet: 2 weeks of dryland taper lined up with the pool taper (PROPOSED, 14.3 #6). Gen-pop events (HYROX race, tournament, 10K): 1 week. | COACH-R2 R2-PER-06 ('ending with a 1-2-week taper before the first game'); COACH-ANSWER PER-08; SCIENCE Bosquet 2007, Pritchard 2016, Vachon 2020, Aouani 2024; swim and gen-pop lengths PROPOSED | Before a season opener, event or fight: 1-2 weeks, volume -40-60 % (progressive), intensity and frequency kept, no new exercises. |
| D9_RECOVERY_WEEK | Post-season / end of a throwing block: a recovery week that is not a scaled copy (arm care, mobility, easy aerobic, no main lifts), then general work or a maintenance phase before the next off-season. | OBSERVED (BASEBALL Block 1 'wk 8'); COACH-ANSWER PER-08 | Post-season / end of a throwing block: a recovery week that is not a scaled copy (arm care, mobility, easy aerobic, no main lifts), then general work before the next off-season. |
| D10_HOLIDAY_MAINTENANCE | Year plan: the last 2 weeks of December switch automatically to maintenance (about 60 %, 50-70 %), any equipment, RIR 2-3; January starts the Q1 block at week 1. User-marked holiday and vacation weeks (Christmas, Semana Santa, Thanksgiving, a trip) switch to maintenance too and are placed between blocks (D5). | COACH-ANSWER PER-01; COACH-R2 R2-PER-01, R2-PER-02; 60 % default PROPOSED; SCIENCE Yanovski 2000, Diaz-Zavala 2017 | Yearly mode: the last 2 weeks of December switch automatically to maintenance (about 50-70 %; default 60 %), any equipment, RIR 2-3; January restarts at the previous start. |
| D11_IN_SEASON | In-season: no planned deload; sets flat (0 %); 2 gym days. Game-heavy sports (basketball, volleyball, soccer, football, hockey): gym plyos about half, no extra change-of-direction work, sprints only for speed athletes, the one hard gym day at least 48 h before a game. Olympic piece light (2 x 3), dropped in heavy game weeks; a heavy game week (3+ games, or 2 + travel) keeps only the light day (PROPOSED). | COACH-ANSWER PER-08, UNI-10; COACH-R2 R2-ATH-07, R2-ATH-04; heavy-week definition PROPOSED | In-season: no planned deload; rate 0; a lighter week around congested game/travel weeks. |
| D12_NEXT_CYCLE | After a COMPLETED block the next one starts one step up: start x1.05 and cap +1 set (never above 25; priority 30), all customizable; advanced lifters already at the ceiling climb by heavier loads, intensifiers (MYO, supersets) and a rotating priority muscle up to 30. After a CANCELLED block: the same start. A block whose last 4 weeks were mostly holds or ended with an open pain flag also repeats its start (PROPOSED). | COACH-R2 R2-VOL-06 (approved, 'this is all customizable'), R2-PER-05, R2-VOL-07; hold/pain exception PROPOSED | After a productive 12-week cycle the next one starts one level higher (start x 1.05, cap + 1 set; max 25 non-priority, 30 priority). After holds, pain or a maintenance block: same start. |
| D13_REPEAT_WEEK | Under half of the week's sessions done (with a check-in): repeat that week; the block moves back one calendar week. With a fixed date ahead (season, event, booked test), the step is skipped (hold) instead so the block still ends on time. | COACH-R2 R2-VOL-01 (approved 'repeat the week if they did under half the sessions'); fixed-date handling PROPOSED | - |

### 6.1 Tests (COACH-ANSWER PER-07; COACH-R2 R2-PER-07)

**Rule.** Tests are ticked at the start of a block (strength, cardio, speed and agility, jumps, body weight) or 'No need for testing' (default). Test before the block (or in week 1) and at the end; never during the block. *(COACH-ANSWER PER-07; COACH-R2 R2-PER-07)*

> His words: R2-PER-07: 'You should be able to test before and then test at the end.' ... 'they should not test during the weeks, during the block.' ... 'you should not go from not training to a one-rep max test.' ... 'They should try to test at 80%, 90%, but not at 100%.'

**Safety from zero.** 'Starting from zero' = no completed training block (new, untrained, or back after 6+ months off): strength by a 5RM (or 3RM) with an estimated 1RM; cardio and speed at 80-90 % effort (e.g. a 1-mile at a hard but controlled pace, an erg piece at a fixed effort, sprints at 80-90 %); never a 1RM, a max-effort mile or an all-out sprint. After a completed block: intermediate and advanced may take a 3RM or work up to a 1RM at the END of a block. Older adults (60+): submax tests only (PROPOSED). *(COACH-R2 R2-PER-07; 60+ rule PROPOSED; SCIENCE Reynolds 2006)*

**What can be ticked.**

| Test | Options | Tag |
|---|---|---|
| Strength | beginners a 5-8-rep max (5RM default); intermediate and up a 3RM or 'Work up to 1RM' ('LVL 5 = Work up to 1RM', CF R25) only at the end of a completed block; e1RM from the rep max | COACH-R2 R2-PER-07; OBSERVED items; SCIENCE Reynolds 2006 |
| Cardio | 1-mile run or an erg time trial (calories, time or distance); 80-90 % effort from zero. The '21.6 mile run' is removed from plans and tests; the longest run stays the half-marathon plan (Chris Hinshaw), used as-is | COACH-R2 R2-PER-07, R2-LIB-06; COACH-ANSWER EQ-14, PRG-12 |
| Speed / agility | 10-30 m sprint; '5-10-5' pro agility ('5/10/05'); L-test ('LEFT TEST'); 80-90 % from zero | COACH-R2 R2-PER-07; OBSERVED items |
| Jumps (athletes) | countermovement jump or broad jump (not for 60+ by default, R2-ATH-08) | COACH-R2 R2-PER-07 |
| Body | body weight; optional photos or girths | COACH-R2 R2-PER-07; photos PROPOSED |

**When.** 12-week: baseline before or in week 1, end test week 12; 8-week: week 1 and week 8; maintenance: none unless ticked; week-by-week: start and end of each stairway; year: week 1 and the last week of each training block (12, 25, 50); athletes: start and end of each off-season block. The end test replaces that week's top sets; the rest of the week runs at about 50-70 % of its sets; strength tests 48-72 h after the last hard lower session. *(COACH-R2 R2-PER-07 (timing); dose and spacing PROPOSED; SCIENCE Pritchard 2016, Bosquet 2007)*

**Reminders.** At block start (confirm the ticks), 7 days before ('Get ready: your test is on <day>') and the day before. A printed or screenshot plan shows the test day and a 'get ready' line in the week before. *(COACH-R2 R2-PER-07 (approved), R2-GEN-02 (screenshots))*

**Placement summary for the generator (v1.1).**
* **12-week block**: nothing inside; baseline before or in week 1; end test week 12; then the end-of-block choice (recovery week + next block one step up, maintenance, or change plan).
* **8-week block**: the same with the end test in week 8.
* **Maintenance phase**: it is the recovery; length chosen and extendable; end prompt; no tests unless ticked; then a whole new block from week 1.
* **Cancelled block**: maintenance phase, then a new block at the same start.
* **Week-by-week**: rolling 12-week stairways with a recovery week every 13th week; tests at the start and end of each stairway.
* **Yearly (gen pop)**: recovery weeks 13 and 26; maintenance Q3 (27-39) and holidays (51-52); tests weeks 1, 12, 25 and 50 if ticked; user-marked holiday weeks between blocks.
* **Athletes**: pre-season 4-6 weeks ending in a 1-2-week taper; in-season no planned deload, game-heavy rule; post-season recovery week.

---

## 7. Plan-length model v1.1 (COACH-ANSWER PER-01; COACH-R2 R2-PER-01..07, R2-VOL-07)

> His words, round 1 (PER-01): 'the 6-week plans are not necessarily needed. I would like for people to be able to use the 4- to 6-week plans when they need to transition ... a maintenance phase ...' 'Usually, I like, personally, on my model, the 12-week programs ...' 'I don't need it to be conjugate or anything like that, but I do want to have good sound science behind it.'
>
> Round 2 (R2-PER-03): 'the 8-week plan should gradually go up like steps up a stairway. That's how every program should be.' (R2-PER-04): 'on a 12-week program, the last 4 weeks are going to be brutal.' (R2-VOL-07): 'It should never be thrown in the middle of a block.' (R2-PER-06): 'You should be able to pick how many weeks you're going to do with maintenance.'

### 7.0 The plan modes

| Mode | Name | When | Shape | Steps | Recovery / deload | Tests | Tag |
|---|---|---|---|---|---|---|---|
| C12 | 12-week block (preferred) | default for every goal with >= 12 weeks; repeated back-to-back one step up | stairway: ACCLIMATION (L1 1-4, L2 1-3, L3 1-2) -> DRIVE to week 8 -> HARDEST 9-12 ('the last 4 weeks are going to be brutal'); exercise blocks 1-4 / 5-8 / 9-12 | 3 % weeks 2-6, 5 % weeks 7-12, λ-scaled so each muscle peaks on its cap in week 12 (big muscles: L1 0.76, L2 0.87, L3 0.50); check-in: planned + 2 points if too easy (max 7 %), hold on 9-10 | none inside; one recovery week after it (before the next block) | baseline before or in week 1; end test week 12 | COACH-ANSWER PER-01; COACH-R2 R2-PER-04, R2-PER-05, R2-VOL-07, R2-PER-07; step sizes PROPOSED |
| C8 | 8-week block | a shorter plan | the same stairway from the level start (no 'start hard' x1.10): ACCLIMATION (L1 1-3, L2 1-2, L3 1) -> DRIVE to week 5 -> HARDEST 6-8; exercise blocks 1-4 / 5-8 | 3 % weeks 2-4, 5 % weeks 5-8 (λ only when the cap would come early: L3 0.78) | none inside; one recovery week after it | baseline before or in week 1; end test week 8 | COACH-R2 R2-PER-03 (NOT RIGHT on 4 + 4 / start hard); phase weeks and steps PROPOSED |
| MAINT | Maintenance phase | after a cancelled block; at the end of a block when the person or coach asks; vacation, travel, moving; user-marked holiday weeks; the last 2 weeks of December; year Q3 | flat at 50-70 % of the last block's final 4 weeks (not floored); loads kept, sets cut; RIR 2-3; no intensifiers; equipment = what is available | 0 % (it maintains; no stairway) | it is the recovery; the next block starts at week 1 without a recovery week | none unless ticked | COACH-ANSWER PER-01; COACH-R2 R2-PER-06 (length chosen, extendable, end prompt), R2-VOL-07; factor split PROPOSED |
| WBW | Week-by-week (open-ended) | no fixed length: 'just keep me in line, and then it does it by itself' | rolling 12-week stairways run back to back (the person sees one week at a time), each followed by a recovery week and the next one a step up; exercise blocks every 4 weeks | planned stairway; the weekly check-in (asked every week) moves the step; a week without it runs the planned step | the recovery week every 13th week; never inside a stairway | at the start and end of each stairway if ticked | COACH-ANSWER PER-01, PER-02; COACH-R2 R2-GEN-01, R2-VOL-03, R2-VOL-07; rolling 12-week default PROPOSED |
| YEAR | Yearly gen-pop plan ('stay in shape') | the general population that wants a plan for the whole year | Q1 (Jan-Mar) 12-week block, hard work + more cardio, start cutting, sets at the starting level + recovery week; Q2 (Apr-Jun) 12-week summer-shape block one step up + recovery week; Q3 (Jul-Sep) maintenance at ~70 % (13 weeks); Q4 (Oct-mid-Dec) 11-week build block, less cardio; last 2 weeks of December automatic maintenance; user's hemisphere, user-marked holiday weeks, every block tunable | per block (section 7.6) | weeks 13 and 26; maintenance Q3 and weeks 51-52 | week 1 (baseline) and the last week of each training block (12, 25, 50) if ticked | COACH-R2 R2-PER-01, R2-PER-02, R2-PER-07; block layout PROPOSED |
| PREP | Event / fight / competition prep (overlay) | a fight, meet, race, show or tournament date | fights and meets: 2-week steps and waves (PER-10, observed BOXING); gen-pop events (a HYROX race, a tournament, a 10K): the normal stairway timed so its hardest weeks end 1 week before the date; taper before the date | same average step, applied in 2-week steps for fight/competition prep | taper (D8) | the event | COACH-ANSWER PER-10; OBSERVED BOXING; gen-pop event peak COACH-R2 REQ (PROPOSED) |
| SEASON | Competitive athlete season (overlay) | competitive athlete: sport, position, season start date, practice and game days | off-season (stairway blocks, VOL 1 -> 2 -> 3) -> pre-season (4-6 weeks at ~60 %, speed/power, 1-2-week taper) -> in-season (2 gym days, low volume; game-heavy rule) -> post-season (recovery, then general work) | off-season stairway; pre-season and in-season 0 % (flat sets; speed/power quality climbs in pre-season) | recovery week between off-season blocks; taper ends the pre-season; recovery week post-season | baseline at the start of the off-season, end test at the end of each off-season block if ticked | COACH-ANSWER PER-08, PER-11, PRG-04, UNI-10; COACH-R2 R2-GEN-05, R2-PER-06, R2-ATH-07 |

### 7.0.1 The stairway (v1.1: every training block)

> R2-PER-03: 'the 8-week plan should gradually go up like steps up a stairway. That's how every program should be.' ... 'In the beginning, the first 2, 3, 4 weeks, the steps are a little bit smaller, but they're gradually going up. When they get to that halfway point and upwards, the steps get a little bit higher, but not too much.' ... 'that goes for every plan.'
> R2-PER-04: 'on a 12-week program, the last 4 weeks are going to be brutal. Again, like a stairway: steps up, steps up, and week by week, it just gets gradually worse. I mean worse, meaning better, more volume.'
> R2-PER-05: 'The last week might feel like an 11, like you're doing more than what you usually do.' ... 'I'm just talking about how it feels and what level you're starting at.'

| Rule | Value | Tag |
|---|---|---|
| Shape | smaller steps in the first half, a little bigger after the halfway point ('but not too much'), hardest weeks last; every plan length | COACH-R2 R2-PER-03, R2-PER-04 |
| Planned steps (no check-in) | standard: 3 % to the halfway week, then 5 %. λ: when start x growth would pass the cap, every step of that muscle is multiplied by one factor λ < 1 so its planned peak lands on the cap in the last week (12-week big muscles: L1 0.76, L2 0.87, L3 0.50; 8-week: L3 0.78). Older adults (60+): at most 3 %. Nothing above 7 % is ever planned. Target T(w) = T(w-1) x (1 + λ step); whole sets placed while T - current >= 1 | PROPOSED numbers (12_volume_algorithm v1.1 §3.7.1); R2-VOL-03 (no check-in = planned steps) |
| Halves | first half = weeks 2..ceil(N/2); second half = weeks ceil(N/2)+1..N (week 1 has no step). 12 weeks: 3 % in weeks 2-6, 5 % in weeks 7-12; 8 weeks: 3 % in weeks 2-4, 5 % in weeks 5-8. | PROPOSED |
| Phases | 12-week: ACCLIMATION L1 1-4 / L2 1-3 / L3 1-2 -> DRIVE to week 8 -> HARDEST 9-12 (every level). 8-week: ACCLIMATION L1 1-3 / L2 1-2 / L3 1 -> DRIVE to week 5 -> HARDEST 6-8. Other lengths: ACCLIMATION = the first ~quarter (at least week 1), HARDEST = the last third (rounded up), DRIVE in between (e.g. 11-week year block: ACCLIMATION 1-3, DRIVE 4-7, HARDEST 8-11) | COACH-R2 R2-PER-04 ('the last 4 weeks'); COACH-ANSWER PER-01 (2-4 acclimation weeks); 8-week weeks PROPOSED |
| Every week climbs | every week at least one dial moves up: a set is released, or the main lifts go heavier at the same RIR (or +1-2 reps), or the RIR target steps down per the phase table; the last week is the block's highest volume and load (PROPOSED, from R2-PER-04/05) | COACH-R2 R2-PER-04, R2-PER-05; PROPOSED |
| With a check-in | with a check-in (12_volume_algorithm v1.1 §3.7.3): on target (effort 7-8, sessions done, no pain) = the planned step; too easy (mostly 1-6) = the planned step + 2 points, max 7 %; effort 9 = hold (0 %); any 10 = hold and -1 set on that day; under half the sessions = repeat the week (the block becomes one week longer); 'Felt a PAIN' = pain protocol. With standard steps: +3 % / +5 % in the first half, exactly his approved table (+5 % / +7 %) from halfway (PROPOSED, 14.3 #3) | COACH-R2 R2-VOL-01, R2-VOL-02, R2-GEN-04; notch rule PROPOSED |
| Total ceiling | the person's total weekly sets rise by less than 10 % a week; when several muscles would release a set in the same week, the smallest banks wait one week (release staggering, PROPOSED; COACH-ANSWER UNI-05) | COACH-ANSWER UNI-05 |
| Bank rule | the bank is the planned target minus the current sets (T - current; the same as banking step x current sets each week); place one whole set each time it reaches 1 (12_volume_algorithm v1.1 §3.8): usually one set a week, two only when a λ-anchored final week needs it (e.g. the 11-week year Q4 block, week 50: 22 -> 24; release staggering spreads such jumps across muscles); at the cap the bank is cleared and the week climbs by load, reps, RIR or intensifiers (COACH-ANSWER VOL-06, VOL-07, VOL-15) | COACH-ANSWER VOL-06, VOL-07, VOL-15 |
| Stair level (display) | display only: level(w) = 2 + 9 x A(w) / A(N), where A adds 1 for each first-half step and 5/3 for each second-half step (the same weights as the steps); 12 weeks: 2, 2.6, 3.2, 3.8, 4.4, 5, 6, 7, 8, 9, 10, 11; 8 weeks: 2, 2.9, 3.9, 4.8, 6.3, 7.9, 9.4, 11 (PROPOSED; the same display as 12_volume_algorithm v1.1 §3.7.2) | COACH-R2 R2-PER-05; PROPOSED |
| Exercise blocks | 12-week 1-4 / 5-8 / 9-12; 8-week 1-4 / 5-8; exercises fixed inside each; 1-2 one-detail changes at the boundary (PER-02, R2-LIB-01) | COACH-ANSWER PER-02; COACH-R2 R2-LIB-01 |
| Who owns the numbers | 12_volume_algorithm v1.1 §3.7 owns the weekly set math; the grids here use its method and reproduce its tables row by row (recomputed with p06v11/curves.py) | - |

**Why these step sizes (PROPOSED, shared with 12_volume_algorithm v1.1).** 3 % is the 'getting used to it' cap of v1 (R2-PER-04 proposal), so the first half stays gentle; 5 % is his approved on-target step (R2-VOL-01), so after halfway a planned week equals an on-target checked week; 7 % is only earned by a too-easy check-in. Without λ an L3 lifter (20 -> 25) would reach the ceiling around week 8 and spend the brutal weeks flat; λ shrinks every step of a muscle by the same factor so the peak lands on the cap in the final week (L3: 1.5 % / 2.5 %, about RP's 'a few sets per block' for advanced lifters). Fat-loss blocks use the same stairway on their x0.8 start; in the year's Q1 cut the sets stay at the starting level (approved, R2-PER-01).

### 7.0.2 Blocks, cancel, maintenance and the end-of-block choice (COACH-R2 R2-VOL-07, R2-PER-06)

```
TRAINING BLOCK (a stairway: week 1 feels like a '2' ... last week feels like an '11')
  baseline test before the block or in week 1 (if ticked; submax if no completed block)
  weeks run in order; holds, repeated weeks and pain swaps are allowed; NO deload or maintenance week inside
  |
  +-- block COMPLETED -> end test in the last week (if ticked) -> END-OF-BLOCK CHOICE (PROPOSED):
  |      (a) next block (default for week-by-week, year and repeat plans):
  |          RECOVERY WEEK (about half the sets of the hardest week, same exercises, 3+ RIR)
  |          -> next block week 1 at start x1.05, cap +1
  |      (b) maintenance phase (the person or coach asks; choose its length) -> see below
  |      (c) change the plan (new goal or program)
  |
  +-- block CANNOT be completed -> the person or coach taps CANCEL (the plan only offers it)
         -> MAINTENANCE PHASE (choose the number of weeks; add weeks any time)
         -> END-OF-MAINTENANCE PROMPT: 'Keep maintaining' | 'Change your plan' | 'Start a training block'
         -> a whole new block from week 1 at the SAME start as the cancelled block (no recovery week: maintenance was the recovery)
```

* **Nothing inside a block.** No deload and no maintenance week is ever inserted into a block. Holds, repeated weeks (under half the sessions) and pain swaps are allowed; they change the step, not the structure (R2-VOL-07, R2-VOL-01).
* **Cancel is the person's or the coach's call.** With check-ins the plan offers 'cancel this block' when it sees 2 holds in a row, under half the sessions 2 weeks running, pain on 2+ exercises in a week, or the person taps 'I can't keep up' (signals PROPOSED). Without check-ins the block runs as planned (R2-VOL-03).
* **Maintenance phase**: length chosen (default 4 weeks), 'add a week' always available, and at its end the plan stops and asks 'Keep maintaining / Change your plan / Start a training block' (his three options, R2-PER-06). With no answer the plan keeps maintaining (PROPOSED).
* **After maintenance**: a whole new block from week 1, no recovery week (maintenance was the recovery); same start after a cancelled block, one step up after a completed one (R2-VOL-07, R2-VOL-06).
* **Recovery week between two completed blocks**: about half the sets of the hardest week, same exercises, 3+ RIR (approved in R2-VOL-07 as 'week 1 of the next cycle'); counted as an extra week so the next block keeps all its stairway weeks (PROPOSED, 14.3 #2).

### 7.1 12-week block (preferred)

With no check-in the plan runs exactly this stairway (R2-VOL-03); with check-ins the step moves from effort, completion and pain (+2 points if too easy, max 7 %; hold on 9-10; 7.0.1). Ref sets = one big muscle; the index in brackets = week 1 = 100.

| Wk | Stair | L1 phase | L1 step (λ 0.76) | L1 sets (idx) | L2 phase | L2 step (λ 0.87) | L2 sets (idx) | L3 phase | L3 step (λ 0.5) | L3 sets (idx) | Planned RIR | RC stage (athletes) | Exercise block / events |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | 2 | ACCLIMATION | - | 10 (100) | ACCLIMATION | - | 15 (100) | ACCLIMATION | - | 20 (100) | 3 | RC1 | block starts at the '2'; exercise block 1; baseline tests (submax if no completed block) |
| 2 | 2.6 | ACCLIMATION | 2.28 % | 10 (100) | ACCLIMATION | 2.6 % | 15 (100) | ACCLIMATION | 1.5 % | 20 (100) | 3 | RC1 |  |
| 3 | 3.2 | ACCLIMATION | 2.28 % | 10 (100) | ACCLIMATION | 2.6 % | 15 (100) | DRIVE | 1.5 % | 20 (100) | 3 | RC1 |  |
| 4 | 3.8 | ACCLIMATION | 2.28 % | 10 (100) | DRIVE | 2.6 % | 16 (107) | DRIVE | 1.5 % | 20 (100) | 3 | RC2 |  |
| 5 | 4.4 | DRIVE | 2.28 % | 10 (100) | DRIVE | 2.6 % | 16 (107) | DRIVE | 1.5 % | 21 (105) | 3 | RC2 | exercise block 2: 1-2 one-detail changes; bodybuilders/powerlifters bilateral 50/50 -> 80/20 |
| 6 | 5 | DRIVE | 2.28 % | 11 (110) | DRIVE | 2.6 % | 17 (113) | DRIVE | 1.5 % | 21 (105) | 3 | RC2 |  |
| 7 | 6 | DRIVE | 3.8 % | 11 (110) | DRIVE | 4.33 % | 17 (113) | DRIVE | 2.51 % | 22 (110) | 2 | RC2 | past halfway: bigger steps (5 %, λ-scaled) |
| 8 | 7 | DRIVE | 3.8 % | 12 (120) | DRIVE | 4.33 % | 18 (120) | DRIVE | 2.51 % | 22 (110) | 2 | RC3 |  |
| 9 | 8 | HARDEST | 3.8 % | 12 (120) | HARDEST | 4.33 % | 19 (127) | HARDEST | 2.51 % | 23 (115) | 2 | RC3 | exercise block 3; HARDEST: 'the last 4 weeks are going to be brutal' |
| 10 | 9 | HARDEST | 3.8 % | 12 (120) | HARDEST | 4.33 % | 20 (133) | HARDEST | 2.51 % | 23 (115) | 1-2 | RC3 |  |
| 11 | 10 | HARDEST | 3.8 % | 13 (130) | HARDEST | 4.33 % | 21 (140) | HARDEST | 2.51 % | 24 (120) | 1-2 | RC3 |  |
| 12 | 11 | HARDEST | 3.8 % | 14 (140) | HARDEST | 4.33 % | 22 (147) | HARDEST | 2.51 % | 25 (125) | 1 (+ intensifiers) | RC3 | the '11': every level's peak lands on its cap (λ); end test if ticked; then recovery week + next block, maintenance, or change plan |

*Tags: shape COACH-R2 R2-PER-04, R2-PER-05; acclimation weeks COACH-ANSWER PER-01; step sizes, RIR ladder and stair level PROPOSED; starts/caps COACH-ANSWER VOL-01 and COACH-R2 R2-VOL-06; RC stages COACH-R2 R2-ATH-03; exercise blocks COACH-ANSWER PER-02.*

**Reading.** L1 and L2 climb 40 % and 47 % and L3 25 %, and λ lands every level's peak on its cap in week 12, so the biggest weeks are the last 4 ('brutal') weeks. In the first half the sets barely move (L1 adds its first set in week 6): the stair climbs there through load and RIR (stair 2 -> 5). These are exactly the curves of 12_volume_algorithm v1.1 §3.7.1. Total-rise check (5 big + 5 small muscles, small muscles from 10 / 12 / 15): L2 at most +7.4 % and L3 +5.3 % in any week; every L1 muscle starts at 10 and releases together, so the L1 total would hit +10.0 % in week 6: the release staggering (PROPOSED) keeps it strictly below 10 % (computed).

### 7.2 8-week block

The same stairway, from the level start (the v1 x1.10 'start hard' and the 4 + 4 split are retired: R2-PER-03 NOT RIGHT).

| Wk | Stair | L1 phase | L1 step (λ 1.0) | L1 sets (idx) | L2 phase | L2 step (λ 1.0) | L2 sets (idx) | L3 phase | L3 step (λ 0.78) | L3 sets (idx) | Planned RIR | RC stage (athletes) | Exercise block / events |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | 2 | ACCLIMATION | - | 10 (100) | ACCLIMATION | - | 15 (100) | ACCLIMATION | - | 20 (100) | 3 | RC1 | block starts at the '2'; exercise block 1; baseline tests (submax if no completed block) |
| 2 | 2.9 | ACCLIMATION | 3 % | 10 (100) | ACCLIMATION | 3 % | 15 (100) | DRIVE | 2.35 % | 20 (100) | 3 | RC1 |  |
| 3 | 3.9 | ACCLIMATION | 3 % | 10 (100) | DRIVE | 3 % | 15 (100) | DRIVE | 2.35 % | 20 (100) | 3 | RC2 |  |
| 4 | 4.8 | DRIVE | 3 % | 10 (100) | DRIVE | 3 % | 16 (107) | DRIVE | 2.35 % | 21 (105) | 3 | RC2 |  |
| 5 | 6.3 | DRIVE | 5 % | 11 (110) | DRIVE | 5 % | 17 (113) | DRIVE | 3.91 % | 22 (110) | 2 | RC2 | exercise block 2: 1-2 one-detail changes; past halfway: bigger steps (5 %, λ-scaled) |
| 6 | 7.9 | HARDEST | 5 % | 12 (120) | HARDEST | 5 % | 18 (120) | HARDEST | 3.91 % | 23 (115) | 2 | RC3 | HARDEST (the last third) |
| 7 | 9.4 | HARDEST | 5 % | 12 (120) | HARDEST | 5 % | 18 (120) | HARDEST | 3.91 % | 24 (120) | 1-2 | RC3 |  |
| 8 | 11 | HARDEST | 5 % | 13 (130) | HARDEST | 5 % | 19 (127) | HARDEST | 3.91 % | 25 (125) | 1 (+ intensifiers) | RC3 | the '11': the block's peak (L3 on its cap; L1 and L2 below theirs); end test if ticked; then recovery week + next block, maintenance, or change plan |

*Tags: COACH-R2 R2-PER-03; phase weeks, steps and stair level PROPOSED; RC stages COACH-R2 R2-ATH-03.*

**Reading.** The 8-week block climbs to L1 13 / L2 19 / L3 25 sets (index 130 / 127 / 125): L3 reaches its cap in week 8 (λ 0.78), L1 and L2 do not, so eight weeks give less growth volume than twelve. Total-rise check: the L1 total would hit +10.0 % in week 5 if every muscle released its set together, so the release staggering (PROPOSED) is needed; L2 at most +7.4 %, L3 +5.7 %.

### 7.3 Maintenance phase (length chosen, extendable)

**Uses.** A cancelled block; the end of a block when the person or coach asks; vacation, travel, moving; user-marked holiday weeks; the last 2 weeks of December; the year's Q3; the athlete's season change (pre-season, 8.2.1). *(COACH-ANSWER PER-01; COACH-R2 R2-VOL-07, R2-PER-01, R2-PER-02, R2-PER-06)*

**Dose.** Base = the mean weekly sets of the last 4 weeks of the previous block (here the 12-week curves of 7.1: L1 12.75, L2 20.50, L3 23.75; new clients: their level start). Flat, RIR 2-3, loads kept, no intensifiers, exercises switched to what is available, RC stage held. Not floored: the floor of 10 sets ('I don't think anybody needs less than 10', R2-VOL-06) applies to training blocks, and maintenance is lower volume by his own definition (PER-01); same reading as 12_volume_algorithm v1.1 §3.3 (to confirm, 14.3 #4).

| Reason | Factor | L1 ref sets | L2 ref sets | L3 ref sets |
|---|---|---|---|---|
| Vacation, limited equipment, user-marked holiday weeks | 50 % | 6 | 10 | 12 |
| Travel, moving, season change; after a cancelled block (PROPOSED) | 60 % | 8 | 12 | 14 |
| End of a block when the person or coach asks; year Q3 'maintain' | 70 % | 9 | 14 | 17 |
| Older adults (any reason) | >= 70 % | 9 | 14 | 17 |

*Tags: COACH-ANSWER PER-01 (50-70 %); COACH-R2 R2-PER-06 (length, prompt), R2-PER-01 (Q3 ~70 %); factor split and base PROPOSED; SCIENCE Bickel 2011, Spiering 2021, Bosquet 2013, Ogasawara 2013.*

**Length and end.** The user picks the number of weeks (default 4) and can add weeks at any time; at the end: 'Keep maintaining / Change your plan / Start a training block' (R2-PER-06). Then a whole new block from week 1 without a recovery week (R2-VOL-07).

**Note.** His level starts sit at or just above the top of his maintenance band: the L2 start (15) is 73 % of the L2 block's final 4 weeks, L1 78 %, L3 84 % (computed), so restarting at the level start after a block is itself a light week-1.

### 7.4 Repeated blocks ('start at a 2 and end at an 11')

> Round 1: 'For your next 12-week program ... you might want to start at a 2 and end at an 11, meaning your volume slowly creates more' (PER-01). Round 2: 'When I say started at 2 and ended at 11, I mean the amount of volume that they're putting themselves at as far as level, not the amount of sets.' ... 'By the time you're done with your block, ideally, you've pushed yourself a little bit past your limits' (R2-PER-05).

So the 2 -> 11 lives inside every block (the stair, 7.0.1 and 5.2). Between blocks the next one starts one step up: start x1.05 and cap +1 set (never above 25; priority 30), all customizable (approved, COACH-R2 R2-VOL-06). After a cancelled block the start repeats (R2-VOL-07).

| Level | Block 1 | Block 2 | Block 3 | Block 4 |
|---|---|---|---|---|
| L1 | 10 -> 14 (λ 0.76, cap wk 12) | 11 -> 15 (λ 0.7, cap wk 12) | 12 -> 16 (λ 0.65, cap wk 12) | 13 -> 17 (λ 0.6, cap wk 12) |
| L2 | 15 -> 22 (λ 0.87, cap wk 12) | 16 -> 23 (λ 0.82, cap wk 12) | 17 -> 24 (λ 0.78, cap wk 12) | 18 -> 25 (λ 0.74, cap wk 12) |
| L3 | 20 -> 25 (λ 0.5, cap wk 12) | 21 -> 25 (λ 0.39, cap wk 12) | 22 -> 25 (λ 0.29, cap wk 12) | 23 -> 25 (λ 0.19, cap wk 12) |

**Reading (computed).** L1 and L2 climb one set per block at both ends; λ keeps every block's peak in week 12 but shrinks the steps as the start nears the ceiling (L3 block 4: λ 0.19, +2 sets in 12 weeks), so for advanced lifters 'one level higher' comes from heavier loads, intensifiers (MYO, supersets) and a rotating priority muscle up to 30 sets (approved, R2-PER-05); an optional 'pro' level above 30 is in 12 v1.1 (R2-VOL-06).

### 7.5 Week-by-week (open-ended)

> 'Just keep me in line, kind of thing, and then it does it by itself' (COACH-ANSWER PER-01).

* The engine runs rolling 12-week stairways back to back; the person sees one week at a time (PROPOSED default length).
* Each stairway is followed by a recovery week, and the next one starts a step up (7.4); exercise blocks change every 4 weeks (PER-02, R2-LIB-01).
* The weekly check-in is asked every week (R2-GEN-01); a week without it runs the planned step (R2-VOL-03).
* Cancel -> maintenance -> a new stairway (R2-VOL-07); tests at the start and end of each stairway if ticked (R2-PER-07).

### 7.6 Yearly gen-pop plan ('stay in shape', approved and tunable)

> 'This is correct, but this is for the general population that wants to just stay in shape and wants to have some type of planning for how the year works' (R2-PER-01). 'They can just switch it around if they don't like the blocks the way they're set up, or if they want to add something, change something, or change the variety (more cardio, less cardio).' ... 'just ramp it up to powerlifting style' (R2-PER-02).

| Quarter | Months (weeks) | Theme | Resistance | Aerobic | Last week / tests | Tag |
|---|---|---|---|---|---|---|
| Q1 | Jan-Mar (weeks 1-13) | HARD WORK + MORE CARDIO, start cutting | 12-week block, sets stay at the starting level (the person's level start; no set stairway in the cut); the stair climbs by cardio, density (finisher circuits, supersets), load and RIR; HARDEST weeks 9-12 | goal default + 1 session (e.g. 3 -> 4) | week 13 recovery week; test in week 12 if ticked | COACH-R2 R2-PER-01 (approved: 'start cutting (sets stay at the starting level)'); layout PROPOSED |
| Q2 | Apr-Jun (weeks 14-26) | SUMMER SHAPE: keep losing fat while building a little muscle | 12-week stairway one step up (start x1.05, cap +1); HARDEST weeks 22-25 | goal default | week 26 recovery week; test in week 25 if ticked | COACH-R2 R2-PER-01, R2-VOL-06 |
| Q3 | Jul-Sep (weeks 27-39) | MAINTAIN at about 70 % of the volume | maintenance phase, 70 % of Q2's final 4 weeks, flat, RIR 2-3; one exercise change mid-quarter (week 33, PROPOSED) | goal default; outdoor/summer activity counts | - | COACH-R2 R2-PER-01 ('maintain at about 70 % of the volume') |
| Q4 | Oct-mid-Dec (weeks 40-50) | BUILD MUSCLE, less cardio | 11-week stairway one more step up (priorities allowed); ACCLIMATION 40-42, DRIVE 43-46, HARDEST 47-50; no recovery week before it (Q3 was maintenance) | goal default - 1 (min 2) + optional walks | test in week 50 if ticked | COACH-R2 R2-PER-01; layout PROPOSED |
| Holidays | last 2 weeks of December (weeks 51-52) | AUTOMATIC MAINTENANCE | about 60 % (50-70 %) of Q4's final 4 weeks; any equipment; RIR 2-3 | walks / any activity | - | COACH-R2 R2-PER-01; COACH-ANSWER PER-01 |

**Tuning (R2-PER-02).**

| Tuning | What the user can do | Tag |
|---|---|---|
| Hemisphere | summer follows the user's hemisphere: southern-hemisphere users (Argentina, Chile, Uruguay...) shift the gen-pop year by 6 months (summer shape Oct-Dec, maintain Jan-Mar), keeping the 2 holiday weeks where the user marks them | COACH-R2 R2-PER-02; shift PROPOSED |
| Own holiday and vacation weeks | the user marks them (Christmas, Semana Santa, Thanksgiving, a trip); they switch to maintenance and the planner places them between blocks (blocks are shortened or shifted, never below 4 weeks) | COACH-R2 R2-PER-02, R2-VOL-07; placement PROPOSED |
| Re-order or change blocks | 'They can just switch it around if they don't like the blocks the way they're set up': drag blocks to other quarters, change a block's goal (build, cut, maintain, athletic, strength), add or remove a block | COACH-R2 R2-PER-02 |
| More or less cardio | per block, up or down; the change applies to that block only | COACH-R2 R2-PER-02, R2-SES-06 |
| Winter strength block | e.g. replace Q4 with a powerlifting-style block (strength family, the STRENGTH %-template inside the stairway, less cardio): 'just ramp it up to powerlifting style' | COACH-R2 R2-PER-02 |
| Guardrails that stay | every training block is a stairway; no maintenance inside a block; a recovery week between two back-to-back blocks; blocks 4-13 weeks; the floor of 10 sets inside training blocks | COACH-R2 R2-PER-03, R2-VOL-07, R2-VOL-06; 4-13 PROPOSED |

**A year for an L2 reference big muscle (computed; layout PROPOSED).**

| Segment | Weeks | Ref sets (L2 reference big muscle) |
|---|---|---|
| Q1 block (cut; sets at the starting level) | 1-12 | 15 / 15 / 15 / 15 / 15 / 15 / 15 / 15 / 15 / 15 / 15 / 15 |
| Recovery week (half of week 12) | 13 | 8 |
| Q2 summer-shape block (start 16, cap 23) | 14-25 | 16 / 16 / 16 / 17 / 17 / 18 / 18 / 19 / 20 / 21 / 22 / 23 |
| Recovery week (half of week 25) | 26 | 12 |
| Q3 maintenance (70 % of 21.50) | 27-39 | 15 / 15 / 15 / 15 / 15 / 15 / 15 / 15 / 15 / 15 / 15 / 15 / 15 |
| Q4 build block, 11 weeks (start 17, cap 24; no recovery week after maintenance) | 40-50 | 17 / 17 / 17 / 18 / 18 / 19 / 20 / 21 / 22 / 22 / 24 |
| Automatic holiday maintenance (60 % of 22.25) | 51-52 | 13 / 13 |

Q1 holds the starting level while the stair climbs by cardio, density and load; Q2 starts one step up (16 -> 23); Q3 maintains at 70 % of Q2's final 4 weeks (15 sets); Q4 starts one more step up (17 -> 24) and its hardest weeks are 47-50 (in week 50 the λ-anchored target lands on the cap, so the reference muscle places 2 sets that week; the release staggering spreads such jumps across muscles); the holidays run at 60 % of Q4's final weeks (13). Tests: week 1 (baseline, submax if new) and the last week of each training block (12, 25, 50) if ticked. Athletes follow their season calendar instead (8.2.0).

**The v1 ambiguities are answered** (R2-PER-01, R2-PER-02): Q2 = April-June; Q1 starts the cut with sets at the starting level; Q2 keeps losing fat while building a little muscle; Q3 is about 70 %; summer follows the user's hemisphere and holidays are the user's own.

### 7.7 Science behind each shape

What the research says about each piece of his plan-length model (studies in section 12).

| Shape | His rule | Evidence | Verdict |
|---|---|---|---|
| 12-week: 2-4 acclimation weeks | 'The first 2 to 4 weeks are going to be just you getting used to the movements' (PER-01) | Damas 2016: hypertrophy signal mostly after ~3 weeks, once damage drops; repeated bout effect: early exposures protect | Supported. v1.1: these are the first small steps of the stairway (3 %, λ-scaled) at 3 RIR. |
| 12-week stairway: small steps to halfway, bigger after, last 4 weeks hardest | 'steps up a stairway ... that goes for every plan' (R2-PER-03); 'the last 4 weeks are going to be brutal' (R2-PER-04) | RP/Enes/Pelland: more weekly sets -> more growth with diminishing returns; Grgic 2017, Harries 2015, Moesgaard 2022: the periodization model matters little when volume is equal; Williams 2017: planned plans beat unplanned for strength | Supported: a gradual volume ramp to a hard finish, then recovery, is the RP mesocycle logic; equal-volume models give similar growth (Grgic 2017), so the value is in the gradual ramp and the planned recovery. |
| No deload inside a block; a recovery week between blocks | 'It should never be thrown in the middle of a block' (R2-VOL-07) | Rogerson 2024: deload every ~5.6 weeks in practice; Bell 2023: planned or autoregulated both acceptable; Coleman 2024: a 1-week break mid-program did not change growth | Plausible: Coleman 2024 found a mid-program week off did not help growth; practitioners deload every ~5-6 weeks (Rogerson 2024), so his blocks rely on the 2 -> 11 stair, holds and the cancel option; the recovery week between blocks matches the Bell 2023 placement option. |
| 8-week stairway (no start-hard) | R2-PER-03 (NOT RIGHT on 4 + 4 and 'start hard'): the same stairway as every plan | Scarpelli 2022 / Barsuhn 2024 (in 12_vol): trained people do well starting from their previous volume; repeated bout effect | Supported: the same gradual ramp; the repeated bout effect and Damas 2016 favour small early steps. |
| Maintenance phase at 50-70 % (length chosen, extendable) | 'a lower-volume maintenance volume ... 70 % ... 50 %. This allows them to recover and not push too hard' (PER-01) | Bickel 2011 (1/3 of the dose keeps size in the young), Spiering 2021, Bosquet 2013 (strength stable ~4 weeks off), Ogasawara 2013 (breaks do not cost long-term growth) | Well supported; older adults stay >= 70 %; even a beginner's 6-9 sets are above the research minimum for keeping size (Bickel 2011). |
| Repeated cycles one level higher | 'start at a 2 and end at an 11' (PER-01) | Scarpelli 2022 (progressing from the person's own previous volume worked); Pelland 2026 (each extra step of growth costs more sets); Ogasawara 2013 | Supported with a ceiling: advanced clients climb by load, intensifiers and a rotating priority muscle, not only sets (approved, COACH-R2 R2-PER-05). |
| Week-by-week | 'Just keep me in line ... and then it does it by itself' (PER-01) | Kiely 2012 (responsive planning), Hickmott 2022 (autoregulation as good as % plans; in 12_vol) | Supported: rolling stairways with the optional check-in (Kiely 2012; Hickmott 2022 in 12_vol). |
| Yearly quarters + holiday maintenance | R2-PER-01/02 (approved for gen-pop 'stay in shape'; user-tunable) | No controlled trials of annual plans for general clients (Afonso 2017: no periodization trial longer than ~9 months); Issurin/Kiely frameworks; Murphy & Koehler 2022 (cut phases protect muscle, not grow it); Yanovski 2000 / Diaz-Zavala 2017 (holiday gain) | Coaching choice with sensible support; approved by the coach for gen pop. |
| Steps & waves for fight/competition prep | PER-10 (RIGHT) | Bompa step/wave loading (practitioner); taper evidence (Bosquet 2007, Pritchard 2016); no hypertrophy advantage for any model (Grgic 2017) | Supported as a peaking tool; smooth stays the default elsewhere. |
| Returning after a layoff (6-12+ months off) and ex-pros | body treated as a beginner, skills come back fast; ex-pros at Level 1 only briefly (PRG-05) | Psilander 2019, Blocquiaux 2020: strength and skill persist longer than size; regaining takes about half the time off | Supported: L1 volume with a 4-week acclimation, exercise level kept, level-up check after the first block (PROPOSED). |
| 1-2-week vacation inside a maintenance block | 'a vacation 1-week or vacation 2-week kind of thing' (PER-01) | Hwang 2017: strength and lean mass kept after 2 weeks off; Bosquet 2013: maximal strength mostly kept up to ~4 weeks | Supported: ~50 % with what is available, or full rest; return at the previous start. |
| Strength %-template and Olympic ramp (PER-09: 'I just want to make sure it's correct') | main lift 80/80/85/85/90/90 % at RPE 7 -> 10; Olympic 4 x 8 @ 75 -> 4 x 6 @ 80 -> 4 x 6 @ 85 -> 4 x 4 @ 90 % | RTS RPE chart (section 5.3); NSCA power guidance (75-85 % for 3-5 reps); Suchomel 2017 (pull variants allow heavier loads); Harries 2015 (linear steps as good as undulating for strength) | Main lift: consistent (loads within about 1-4 points of the chart). Olympic 4 x 8 @ 75 %: high for full catch lifts; fine for DB/KB and pull variants; flagged (14.2). v1.1: full squat cleans/snatches use 3-5 reps per set (R2-ATH-05); weight by RPE and speed unless a tested max (R2-GEN-06). |
| Athlete VOL 1 -> 2 -> 3 blocks | PER-11 (RIGHT) | Issurin 2010: accumulation 2-6 weeks -> transmutation 2-4 -> realization; strength residuals ~30 +/- 5 days, explosive ~5 +/- 3 days; Painter 2012 | Supported; keep plyos/sprints in every phase because explosive residuals are short. |
| Testing before and after, submax from zero | R2-PER-07: test before and at the end, never mid-block; 5RM/3RM or 80-90 % from zero | Reynolds 2006: a 5RM predicted the 1RM best (R2 0.99 bench, 0.97 leg press) in adults of mixed experience aged 18-69 | Supported: safe baselines lose little accuracy. |
| Pre-season 4-6 weeks at ~60 % + 1-2-week taper | R2-PER-06 | Bosquet 2007 (taper 8-14 days, volume -41-60 %, intensity kept); Vachon 2020 (team sports); Ronnestad 2011 / Spiering 2021 (maintenance with low volume when intensity is kept) | Supported. |
| Swimming championship taper | COACH-R2 REQ (swimming added); R2-PER-06 taper | Bosquet 2007; Aouani 2024 (2-week progressive taper, +3.5 % 50 m time) | Supported: 2-week dryland taper lined up with the pool taper (PROPOSED). |

**Overall.** When weekly volume is equal, the periodization model (linear, undulating, block) makes little difference to muscle growth (Grgic 2017, Moesgaard 2022) or strength (Harries 2015), while having a planned structure beats none for strength (Williams 2017). What drives results is weekly volume, effort and consistency, so the value of his shapes is that they ramp volume gradually, reach a hard finish, and build in recovery and life events. Responses vary widely between people (Kiely 2012), which is why the shapes are defaults and the optional check-in moves the step (with no check-in the planned stairway runs unchanged, R2-VOL-03) (SCIENCE).

---

## 8. Generator skeletons v1.1 (stairway grid × family overlay)

### 8.0 How to read

A v1.1 plan = **a stairway grid** (section 7: week -> phase, planned step, check-in maximum, stair level, RIR, exercise block, RC stage, events) **× a family overlay** (below: phase -> reps, effort, load, methods, variation, conditioning and athletic content) **× the volume engine** (12_volume_algorithm v1.1: weekly sets per muscle). The JSON expands every family × mode into week rows (`skeletons`). The v0 skeletons are retired (8.4); the v1 skeletons are in `retired_v1.skeletons_v1`; the programs he actually wrote stay as reference tables (8.3).

**Weeks in the overlay tables** are the default (L2) 12-week split: acclimation 1-3, drive 4-8, hardest 9-12 (the last 4 weeks at every level, R2-PER-04). L1 and returning clients run acclimation 1-4 and drive 5-8; L3 runs acclimation 1-2 and drive 3-8 (acclimation split PROPOSED). The JSON rows carry the per-level phase in `phase_by_level`. The strength main-lift table (5.4) keeps its own week numbers at every level (PROPOSED).

Rules shared by every family (COACH-ANSWER unless marked): core opens the session light, 2 exercises x 2 sets short of failure, movable, with core supersets or monster sets allowed anywhere (ATH-11; COACH-R2 R2-SES-03); hip dominant + push and knee dominant + pull (UNI-11, ORD-06); heavy squat and heavy deadlift on two different days, non-axial hinge / leg press / belt squat on the other lower days (COACH-R2 R2-SES-01, R2-SES-02); horizontal pull before vertical (ORD-01); power before strength (ORD-03); warm-up always (ORD-08); 5-7 resistance exercises on split days, field athletes off-season up to 12 + the 2-exercise core block (VOL-08; COACH-R2 R2-SES-04); full-body days 2-4 exercises per muscle, never 1, so they run longer (about 7-10 resistance exercises, 55-80 min; 'it might be a little longer day', COACH-R2 R2-SES-05; 12_volume_algorithm v1.1 §3.10); calves 3 sets each leg day, rear delts own sets (VOL-17; COACH-R2 R2-VOL-04); optional days separate or add-on, ideally separate (ORD-10); default exercise per slot with a same-category dropdown and one-detail variations only (GEN-04; COACH-R2 R2-LIB-01); rotation bias kept both ways every week (COACH-R2 R2-LIB-03); cardio sessions adjustable up or down by the user (COACH-R2 R2-SES-06); 60+: Olympic lifts, plyos and depth jumps off by default, opt-in with the warning (COACH-R2 R2-ATH-08); no bands or variable resistance (EQ-01, EQ-12).

### 8.1 Family overlays by phase

#### HYPERTROPHY (aesthetics / bodybuilding)
*Basis:* observed AESTHETICS-12 / AESTHETICS-8 rep strings and BYOP aesthetics days, re-shaped by PER-01 and the round-2 stairway (R2-PER-03/04).

| Phase | Weeks | Volume | Reps | Effort | Load | Methods | Variation / laterality / pairing | Conditioning / athletic / extras | Tags |
|---|---|---|---|---|---|---|---|---|---|
| ACCLIMATION | 1-3 (L1 1-4, L3 1-2); stair 2-3.8 | level start (big muscles L1 10 / L2 15 / L3 20; small 10 / 12 / 15); steps 3 % (λ-scaled) | compounds 10-15 or '12/10/8 -20'; small muscles 12-20 | 3 RIR (week-1 tip: 'pick a weight you could lift 2-3 more times') | add load at the same reps | none (supersets only if time is short or the client does not fatigue) | exercise block 1 fixed; bodybuilders 50/50 bilateral:unilateral with contralateral/ipsilateral health accessories | aerobic 4/week incl. a 2nd easy Orange + optional walks (adjustable); no medball (warm-up only); core opens light (2 x 2); calves 3 sets each leg day; rear delts own sets; full-body days 2-4 exercises per muscle | COACH-ANSWER PER-01, VOL-01, UNI-02, CAT-13, ATH-05, VOL-17; COACH-R2 R2-PER-04, R2-VOL-04, R2-SES-03, R2-SES-05, R2-SES-06, R2-GEN-06; RIR PROPOSED |
| DRIVE | 4-8 (L1 5-8, L3 3-8); stair 3.8-7 | stairway: 3 % to week 6, then 5 % (λ-scaled so the peak lands on the cap in week 12); new sets to the first exercise of the day; priority muscles first in their session; non-priority <= 3 % while a priority runs | pyramids '12/10/8 -20', '12/12/10-20' (12 mid, 10 heavier, 8 heaviest, light 20); small muscles 12-30 | 3 RIR to halfway, then 2 RIR | heavier inside the pyramid | bonus exercise for small muscles at the end; Focus slots on the optional day | exercise block 2 from week 5 (1-2 one-detail changes); bilateral share -> 80/20 (bodybuilders/powerlifters); A/B lead-lift weeks only for variety seekers; same-pattern pairing allowed | as above | COACH-ANSWER VOL-07, ORD-04, ORD-10, ORD-11, PER-02, PER-03, UNI-02, UNI-06, PRG-07; COACH-R2 R2-PER-03, R2-VOL-06, R2-LIB-01 |
| HARDEST | 9-12 (every level; 'the last 4 weeks are going to be brutal'); stair 8-11 | 5 % steps continue (λ-scaled) to the level cap in week 12 (L1 14 / L2 22 / L3 25; priority up to 30); muscles already at a cap: load, reps, intensifiers | wider pyramids '15/12/10/8-20'; small muscles to 'MAX' on the last set | 2 RIR (week 9) -> 1-2 RIR -> 1 RIR in week 12, the '11' (never to failure on heavy compounds) | heaviest of the block | MYO on the last machine/isolation exercise and supersets in week 12 (earlier for advanced clients); monster sets optional | exercise block 3 from week 9; bilateral 80/20-90/10 | end test week 12 if ticked | COACH-ANSWER VOL-02, VOL-13, VOL-15, ORD-05, GEN-08; COACH-R2 R2-PER-04, R2-PER-05, R2-PER-07, R2-SES-03 |
| AFTER THE BLOCK | next | recovery week (about half the sets of week 12), then the next block one step up (start x1.05, cap +1); or a maintenance phase when the person or coach asks | - | RIR 3+ in the recovery week | lighter | none | next block's one-detail variables | - | COACH-ANSWER PER-05; COACH-R2 R2-VOL-07, R2-VOL-06 |

#### STRENGTH (powerlifting style, 'heavier, fewer reps')
*Basis:* observed STRENGTH-12 (4 TRACKS) dose rows, confirmed by PER-09; day grammar the work / accessory / nuance / survival (ORD-07); phases re-mapped to the v1.1 stairway.

| Phase | Weeks | Volume | Reps | Effort | Load | Methods | Variation / laterality / pairing | Conditioning / athletic / extras | Tags |
|---|---|---|---|---|---|---|---|---|---|
| ACCLIMATION | 1-3; stair 2-3.2 | main lift 3-4 sets; accessories at the level start (small muscles x0.75, then floor 10) | main lift 6-8; accessory 6-8; nuance 8-10; survival 10-15 | main lift RPE 6-7; accessories 3 RIR | main lift ~70-75 % (with a recent tested best; otherwise RPE) | speed day: straight weight 'FAST RPE6 or about 60-70%' (no bands/chains) | heavy squat and heavy deadlift on two different days; leg press, belt squat or a non-axial hinge on the other lower days | core opens light; aerobic 2 easy Orange (powerlifters) | COACH-ANSWER PER-01, PER-04, EQ-11, EQ-12, ORD-07; COACH-R2 R2-SES-01, R2-SES-02, R2-ATH-06, R2-GEN-06; % PROPOSED |
| DRIVE | 4-8; stair 3.8-7 | main lift = STRENGTH-12 weeks 1-5: 4x5, 4x5, 5x4, 5x4, 6x3; accessories on the stairway | as written | main lift RPE 7, 7, 7, 8, 8; accessories 3 -> 2 RIR; nuance 'MAX'; survival done no matter what | 80, 80, 85, 85, 90 % (or by RPE without a tested best) | Olympic piece (if any) by RPE and speed | 2-week steps on the main lift (competition-style); exercise block 2 from week 5 | - | COACH-ANSWER PER-09, PER-10, ORD-07; COACH-R2 R2-GEN-06; OBSERVED 4T O3:S6 |
| HARDEST | 9-12; stair 8-11 | main lift = STRENGTH-12 weeks 6, 10, 11, 12: 6x3, 6x3, 7x2, 7x2 | as written | RPE 9, 9, 9, 10 | 90, ~90, ~92, ~95 % (weeks 10-12 INFERRED from the RPE chart) | accessories at the cap (load/reps) | exercise block 3 | end test week 12 if ticked: 'Work up to 1RM' (L2-L3 after a completed block) or a 3-5RM | OBSERVED 4T T3:T6, X4:Z6; COACH-R2 R2-PER-07; % INFERRED |
| PART-TIME / CLASS | any | HALF TIME table: 3 sets, reps fall 7 -> 6 -> 5 -> 4, then 'Work up to 1RM' (only after a completed block) | - | push limits, no failure | - | - | - | - | COACH-ANSWER PRG-10; COACH-R2 R2-PER-07; OBSERVED CF Q19:U25 |

#### FAT LOSS / BODY TONING
*Basis:* observed FAT BURN 4-week block ('MUSCLE BUILDING' + 'CIRCUITS RECCOMENDED'); the standard stairway on the x0.8 start (the v1 deficit cap is retired).

| Phase | Weeks | Volume | Reps | Effort | Load | Methods | Variation / laterality / pairing | Conditioning / athletic / extras | Tags |
|---|---|---|---|---|---|---|---|---|---|
| ACCLIMATION | 1-3 (L1 1-4); stair 2-3.8 | same lifting skeleton as hypertrophy at x0.8 the level start (then floor 10); max 4 sets per slot; steps 3 % (λ-scaled) | compounds 12-15; isolation 15-20 (small muscles up to 30) | 3 RIR | - | finisher circuits 2/week: 3 rounds x 30 s | exercise block 1 fixed | aerobic 3/week (steady, Orange), adjustable | COACH-ANSWER ATH-07, PRG-11, PRG-03, VOL-11; COACH-R2 R2-SES-06; factor PROPOSED; the v1 deficit cap (<= 3 %) retired (12 v1.1); SCIENCE Murphy & Koehler 2022 |
| DRIVE | 4-8; stair 3.8-7 | stairway: 3 % to week 6, then 5 % (λ-scaled) | compounds 10-12; isolation 15-20 | 3 RIR to halfway, then 2 RIR; isolation near failure | - | circuits 4 x 35-40 s; supersets to save time | exercise block 2 from week 5 (stability/ROM upgrade, e.g. walking -> rear-foot-elevated lunges) | aerobic 3/week | OBSERVED FB WK2-3; COACH-ANSWER ORD-05, PER-02 |
| HARDEST | 9-12; stair 8-11 | 5 % steps (λ-scaled); density and cardio climb too | compounds 8-10; isolation 15-20; 40-rep sets only if the client picks an AMRAP style | 2 -> 1-2 -> 1 RIR (final week) | - | circuits 5 x 50 s (5-7 stations) | exercise block 3 | end test week 12 if ticked (body weight, submax cardio) | OBSERVED FB WK4; COACH-ANSWER VOL-11; COACH-R2 R2-PER-07 |

#### GENERAL (beginner L1, weekend-warrior athletic / 'stay athletic and active', bootcamp)
*Basis:* observed UL/PPL level ladder, the weekend-warrior athletic program (sheet tab 'JUSTICE LEAGUE'), BOOTCAMP OPTION 1/2; the coach's 2026-10-08 request for gen-pop athletic options.

| Phase | Weeks | Volume | Reps | Effort | Load | Methods | Variation / laterality / pairing | Conditioning / athletic / extras | Tags |
|---|---|---|---|---|---|---|---|---|---|
| L1 BEGINNER: ACCLIMATION | 1-4; stair 2-3.8 | level start x0.8 (general), then the floor of 10; steps 3 % (λ-scaled) | NOVICE ladder: compounds 12-15 | 3 RIR (learning) | - | supersets if the client does not fatigue | cross-pattern pairing; hip dominant + push, knee dominant + pull | aerobic 3/week (adjustable); 45-60 min sessions; full-body days 2-4 exercises per muscle, never 1, so they run longer (about 7-10 resistance exercises, 55-80 min; R2-SES-05, 12_volume_algorithm v1.1 §3.10) | COACH-ANSWER PRG-05, UNI-06, ORD-06, ORD-05, ATH-07, UNI-09; COACH-R2 R2-SES-05, R2-SES-06; x0.8 PROPOSED |
| L1 BEGINNER: DRIVE | 5-8; stair 4.4-7 | steps 3 % to week 6, then 5 % (λ 0.76 for a 10 -> 14 muscle) | NEWBY ladder: compounds 10 (the UL upper-day rep rise is not copied) | 3 RIR to halfway, then 2 RIR | - | - | exercise block 2 from week 5 | - | COACH-ANSWER PRG-06; COACH-R2 R2-PER-03 |
| L1 BEGINNER: HARDEST | 9-12; stair 8-11 | 5 % steps (λ-scaled) to the L1 cap (14) in week 12 | INTERMEDIATE ladder: compounds 8 | 2 -> 1-2 RIR; 1 RIR in week 12 | - | - | exercise block 3; level up at the end if '8 - That was perfect' with no pain | end test week 12 if ticked (5RM / submax: starting from zero) | COACH-ANSWER PER-06; COACH-R2 R2-PER-04, R2-PER-07 |
| WEEKEND-WARRIOR ATHLETIC / STAY ATHLETIC AND ACTIVE | 12-week phases (or the year's blocks) | athletic template, 2 sets per slot, general volume x0.8, stairway | - | - | - | Olympic variant for everyone in athletic training (L1: DB/KB snatch, hex-bar jump, KB squat clean, hang pulls); 60+: none by default | core opens light -> plyo/ballistic -> Olympic -> resistance | plyo share 35 % -> 50 % across the block (RC1 -> RC3); 60+: no Olympic lifts, plyos or depth jumps by default (an option, with a warning); play days handled like practice/game days (8.2.6) | COACH-ANSWER ATH-13, ATH-10, ATH-11; COACH-R2 R2-ATH-01, R2-ATH-03, R2-ATH-08; COACH-R2 REQ; x0.8 PROPOSED |
| BOOTCAMP | any (3-6 sessions/week) | timed circuits, not sets | - | - | - | 3-5 rounds x 30-50 s, 5-7 stations, 35-45 min; the stair climbs rounds and seconds across the exercise blocks (3 x 30 -> 4 x 35 -> 4 x 40 -> 5 x 50) | new stations each exercise block; hinge + push / knee + pull; every muscle group trained that day gets 2+ stations (two circuits of 4-6 stations, R2-SES-05; 05_session_architecture v1.1) | - | COACH-ANSWER PRG-03, ORD-06; OBSERVED FB circuits; COACH-R2 R2-PER-03 |

#### HYBRID / CROSSFIT ('strenght - athletic - crossfitish training')
*Basis:* observed CrossFit macro and dose tables, HYBRID-8.

| Phase | Weeks | Volume | Reps | Effort | Load | Methods | Variation / laterality / pairing | Conditioning / athletic / extras | Tags |
|---|---|---|---|---|---|---|---|---|---|
| ACCLIMATION | 1-3; stair 2-3.2 | RESISTANCE L1-L2 + STRENGTH L1 (FULL TIME: add sets; HALF TIME: 3 sets, reps down) | 10 / 7 | push limits, no failure | - | WODs L1-L2 | - | aerobic C (Orange) 2/week | OBSERVED CF A19:U25; COACH-ANSWER PRG-10 |
| DRIVE | 4-8; stair 3.8-7 | STRENGTH L2-L3 -> POWER L2-L3 | 6-5 / 3 | - | heavier | WODs L2-L3; AMRAP and 40-rep sets live here (option) | cleans on knee-dominant days, snatches on hip-dominant days (R2-ATH-04) | aerobic C + B -> C + B + A | OBSERVED CF macro; COACH-ANSWER VOL-11; COACH-R2 R2-ATH-04 |
| HARDEST | 9-12; stair 8-11 | POWER L4 + WODs L3-L4 | 3 | - | heaviest | - | - | LACTATE CLERANCE | OBSERVED CF macro; COACH-R2 R2-PER-04 |
| 8-WEEK HYBRID | 1-8; stair 2-11 | weekly sets follow the 8-week stairway (3 % weeks 2-4, 5 % weeks 5-8); the sheet's 2 -> 3 -> 4 set steps (+50 %, +33 %) are not copied (over his 10 % ceiling, UNI-05) | content from observed HYBRID-8: 3-week rep waves 6 -> 8 -> 10 | 'heavy' Olympic, by RPE and speed | - | jumps Tue/Fri; sprint density 10-15 x 15 s -> 10 x 30 s | session order core first -> Olympic/power -> strength -> unilateral/accessory (ATH-11, ORD-03); cleans Monday, snatches Thursday | Fri easy cardio 15-40 min | OBSERVED 4T rows 70-101 (content); COACH-ANSWER UNI-05, ORD-03, ATH-11; COACH-R2 R2-PER-03, R2-ATH-04 |

8-week versions use the same rows on the 8-week stairway: ACCLIMATION weeks 1-2 (L1 1-3, L3 1), DRIVE to week 5, HARDEST weeks 6-8 with the hardest-row intensifiers; exercise blocks 1-4 / 5-8. Maintenance phases take the acclimation row's reps at RIR 2-3 with no intensifiers and no stairway (PROPOSED).

### 8.2 Athletes: seasons, blocks and sports (COACH-ANSWER PER-08, PER-11, PRG-04; COACH-R2 R2-GEN-05, R2-PER-06, R2-ATH-01..08)

> 'Yeah, for speed athletes, it'll be sprints on the on-season, but for other athletes, it might be just maintenance of strength. For some athletes, it might be high jumps. It can be different things' (PER-08). 'I would like for them to keep their bilateral work more minimal so that they're not trying to drive changes in their body during their season. I just want them to maintain their strength and their potentiation, and have their nervous system be up high and be able to be powerful' (UNI-10). Round 2: pre-season is the 4-6-week season-change block at about 60 % with speed and power and a 1-2-week taper, 'but that should always be able to be modified' (R2-PER-06); the game-heavy in-season reductions and the off-season aerobic counts were approved as proposed (R2-ATH-07, R2-ATH-06).

#### 8.2.0 Season calendar from the season start date (COACH-R2 R2-GEN-05)

**Inputs.** next season start date (first game) or 'in season until', plus practice days and game days per week (R2-GEN-05).

* In season now -> IN-SEASON until the 'in season until' date -> POST-SEASON 1-2 weeks -> OFF-SEASON.
* W = weeks from the plan start to the first game. PRE-SEASON = the last 6 weeks (4 when W is 7-9), ending with the taper (1 week for 4-5 weeks, 2 for 6); W <= 6 -> pre-season only (W weeks).
* OFF-SEASON = the weeks before the pre-season: 12-week block if >= 12 weeks remain (earlier weeks: a 4-8-week foundation block, or general/maintenance weeks if fewer than 4; L1-L2 athletes with >= 16 weeks may run STARTING -> MID -> ADVANCED as blocks, PRG-04 PROPOSED); 8-week block if 8-11 remain; a short 4-7-week stairway if 4-7 remain; 1-3 leftover weeks run as general weeks.
* Off-season blocks are stairways with a recovery week between them; the pre-season starts right after the last off-season block (its lower volume is the unload).

*close to the engine's D-15 thresholds (>= 20 weeks OFF_EARLY, >= 12 OFF_BUILD, >= 6 OFF_LATE, else PRE), which put the pre-season boundary one week later than this 6-week pre-season: D-15 should read PRE when 6 weeks or fewer remain (integrator). Tags: COACH-R2 R2-GEN-05, R2-PER-06; allocation PROPOSED.*

#### 8.2.1 Season phases

| Phase | Length | Resistance volume | Days | Reps | Athletic | Conditioning | Tags |
|---|---|---|---|---|---|---|---|
| OFF-SEASON | 8-16+ weeks (one 12-week block, an 8-week block, or STARTING -> MID -> ADVANCED blocks when long) | the year's highest; stairway (3 -> 5 %, λ-scaled); field/court athletes lower x0.7 / upper x0.5, strength-type x0.9 / x0.8 of the start table, then the floor of 10 on the muscles the block trains for size or strength (R2-VOL-06; 12_volume_algorithm v1.1 §3.4; the athletes' floor reading is flagged there and in the sports files) | 3-4 | VOL 1 (12-15) -> VOL 2 (8-12) -> VOL 3 (6-8), one per 4-week exercise block; isolation 10-12 -> 15 -> 'MAX REPS' | ballistic -> plyometric (end share by sport, start 15 points lower); RC1 1-3 / RC2 4-7 / RC3 8-12; Olympic 2-4 days (clean days = squat pattern, snatch days = hinge pattern); contrast/complexes intermediate+ only | aerobic by sport: 2 (baseball, softball, sprinters), 3 (basketball, volleyball, football, tennis, golf, boxing, BJJ), 3-4 (soccer, hockey, kickboxing, karate), 4 (MMA, wrestling); adjustable | COACH-ANSWER PER-08, PER-11, PRG-04, UNI-02, CAT-13, ATH-10, ATH-12; COACH-R2 R2-ATH-01, R2-ATH-03, R2-ATH-04, R2-ATH-06; factors PROPOSED |
| PRE-SEASON | 4-6 weeks before the first game (user can change it), the last 1-2 weeks a taper | about 60 % of the off-season's final 4 weeks, flat (no set stairway); taper weeks about -40-60 % of that, intensity kept | 3 (fewer when practices are daily) | VOL 3 / strength-speed (4-6 reps, fast intent) | more speed and power: sprints, COD 'HARD TURN' and reactive agility; RC stage held (usually RC3); Olympic 2-3 days, heavy-ish, low volume, by RPE and speed; no complexes (off-season only) | aerobic 2/week + sport practice | COACH-R2 R2-PER-06 (approved), R2-ATH-06 (pre-season 2), R2-ATH-03 (stage held); COACH-ANSWER PER-08, ATH-12; taper SCIENCE Bosquet 2007 |
| IN-SEASON | the season (repeating 2-week familiar menus) | low: lower x0.4-0.5 / upper x0.3-0.4; 0 % | 2 | 1-2 main lifts at 3-6 reps, RIR 2-3 (keep load, cut sets); accessories 2 x 8-10 | speed athletes: sprints; jumping athletes: jumps; others: strength maintenance; game-heavy sports (basketball, volleyball, soccer, football, hockey): gym plyos ~half, no extra COD, sprints only for speed athletes, hard day >= 48 h before a game; Olympic light 2 x 3 (hang power clean or DB snatch) 1-2 days, dropped in heavy game weeks; bilateral minimal | aerobic 2/week; short buy-outs | COACH-ANSWER PER-08, UNI-10, ATH-07; COACH-R2 R2-ATH-04, R2-ATH-07; factors PROPOSED; SCIENCE Ronnestad 2011, Spiering 2021 |
| POST-SEASON | 1-2 weeks recovery, then general work or a maintenance phase | recovery week: no main lifts; then maintenance 50-70 % | 2-3 | general | arm care, mobility, easy movement | paced easy cardio | COACH-ANSWER PER-08, PER-01; OBSERVED BASEBALL Block 1 'wk 8' |
| FIGHT / COMPETITION PREP | 6-8 weeks to a date | 2-week steps and waves (same average step) | as the sport allows | base 3 x 10 -> conversion (heavy rows 1-2 RIR; complexes intermediate+ only, their use in a camp still open) -> peak | boxers/strikers: reduce (not cut) pressing and arm volume in high-punching weeks; real aerobic block at the start of sessions | sprint 20/40 rounds 5 -> 8; taper the last 1-2 weeks if a date is set | COACH-ANSWER PER-10, ATH-04, ORD-09; OBSERVED BOXING; taper PROPOSED |

#### 8.2.2 Off-season blocks (VOL 1 -> VOL 2 -> VOL 3, one per exercise block)

**12-week off-season block.**

| Weeks | Phase / block | Resistance | Plyo / ballistic | Olympic piece | Session / methods / tests |
|---|---|---|---|---|---|
| 1-3 | ACCLIMATION (exercise block 1, VOL 1); stair 2-3.2; 3 RIR | compounds 12-15, isolation 10-12; steps 3 % (λ-scaled) | RC1 Land (stick the landing), bilateral first; plyo share = sport end share - 15 points (ballistic-heavy) | technique: L1 DB/KB snatch, hex-bar jumps, hang pulls; L2+ hang power / hang pulls, light and fast (RIR 3+), 2 days (clean day + snatch day) | core opens light (2 x 2) -> plyo/ballistic -> Olympic -> 3-4 resistance; up to 12 exercises + 2 core, ~1.5 h; baseline tests (submax if no completed block) |
| 4 | DRIVE (exercise block 1, VOL 1); stair 3.8; 3 RIR | steps 3 % (λ-scaled) | RC2 Land & Go starts (week 4) | technique block continues; L2+ by RPE and speed | - |
| 5-8 | DRIVE (exercise block 2, VOL 2); stair 4.4-7; 3 -> 2 RIR | compounds 8-12, isolation 15; 1-2 one-detail changes; steps 3 % (weeks 5-6) then 5 % (λ-scaled) | RC2 Land & Go to week 7; RC3 Repeat from week 8 (bilateral first); plyo share rising | the 4-step ramp, one step a week: 4 x 8 -> 4 x 6 -> 4 x 6 -> 4 x 4, heavier while the bar stays fast (by RIR/RPE; % only with a tested max of that lift); full squat cleans/snatches 3-5 reps per set at the same weekly reps (e.g. 6 x 5); up to 2-4 days (cleans on knee-dominant days, snatches on hip-dominant days) | contrast pairs for intermediate+ (heavy lift ~78-85 % -> same-pattern jump) |
| 9-12 | HARDEST (exercise block 3, VOL 3); stair 8-11 ('brutal'); 2 -> 1 RIR | compounds 6-8, isolation 'MAX REPS'; steps 5 % (λ-scaled), the cap lands in week 12 | RC3 Repeat, unilateral and higher amplitude; the block's most plyometric weeks (end share by sport) | ramp repeated one step up: 4 x 6 -> 4 x 6 -> 4 x 4 -> a heavy single by RPE and bar speed (L2+ after a completed block; never a max-effort single from zero, R2-PER-07; % only with a tested max, R2-GEN-06) (PROPOSED); L1 as in weeks 5-8 | French contrast / complexes (intermediate+); end tests week 12 if ticked (jumps, sprint, '5-10-5', strength) |

**8-week off-season block** (new in v1.1; the engine's C8_ATHLETE).

| Weeks | Phase / block | Resistance | Plyo / ballistic | Olympic piece | Session / methods / tests |
|---|---|---|---|---|---|
| 1-2 | ACCLIMATION (VOL 1); stair 2-2.9; 3 RIR | compounds 12-15; steps 3 % | RC1 Land | technique, light and fast, 2 days | baseline tests (submax if no completed block) |
| 3-5 | DRIVE (VOL 1 -> VOL 2 at week 5); stair 3.9-6.3; 3 -> 2 RIR | steps 3 % (weeks 3-4) then 5 %; exercise block 2 from week 5 | RC2 Land & Go | ramp 4 x 8 -> 4 x 6 -> 4 x 6 (by RPE/speed) | - |
| 6-8 | HARDEST (VOL 2 -> VOL 3); stair 7.9-11; 2 -> 1 RIR | steps 5 % (λ-scaled for L3); compounds 6-8 in weeks 7-8 | RC3 Repeat | 4 x 4 -> heavy doubles/singles by RPE and bar speed (L2+ after a completed block; never max-effort from zero, R2-PER-07; % only with a tested max, R2-GEN-06) | end tests week 8 if ticked |

*Tags: COACH-ANSWER PER-11 (VOL per block), PER-01, CAT-10, ATH-10, PER-09, ATH-12, VOL-08/VOL-17, PER-07; COACH-R2 R2-PER-03/04 (stairway), R2-ATH-01 (plyo shares), R2-ATH-03 (RC weeks), R2-ATH-04/05 (Olympic frequency and reps), R2-ATH-06 (aerobic), R2-SES-04 (12 + 2 core), R2-GEN-06 (RPE unless tested), R2-PER-07 (tests); Olympic frequency defaults and ramp placement PROPOSED.*

**STARTING / MID / ADVANCED (COACH-ANSWER PRG-04: 'Depends on whatever is needed').** PROPOSED rule: an off-season of 16+ weeks for an L1-L2 athlete runs them as consecutive blocks (observed '8wk1' label on STARTING); a shorter off-season or an L3 athlete gets the template that matches the athlete's level. Their observed dial is below.

#### 8.2.3 Athlete level dial (observed 'EXAMPLE ATHLETIC FULL BODY SPLI')

| Metric | 'STARTING' (green) | ' MID' (yellow) | ' ADVANCED' (red) |
|---|---|---|---|
| days / week | 3 | 4 | 4 |
| working sets / week (excl. throws; decode component count, each movement of a superset counted) | 89 | 72 | 59 |
| written SETS cells / week, one per line (excl. medball lists; recount) | ~61 | ~53-55 (D64 '2 to 4') | ~44 |
| resistance sets / week | 44 | 44 | 24 |
| athletic sets / week (excl. throws) | 25 | 14 | 9 |
| avg sets per exercise | 2.7 | 1.9 | 1.8 |
| high-intensity lower-body contacts / week | 146 | 71 | 32 |
| low-amplitude reactive contacts / week | 0 | 120 | 100 |
| med-ball throws / week | 210 | 400 | 420 |
| core sets / week | 20 | 14 | 26 |
| heaviest prescription | 'HEAVY Hex bar Squats' 3 reps (contrast); 'Heavy Snatch grip DL' 3x6 | 'Heavy Deadlifts' 2 x '6/8' (E18, stored as a date); 'Heavy Power Cleans' 2x8 | 'DEADLIFTS (1RIR)' 3x1; 'Power Cleans' 3x3 |
| primer plyo sets | 2 sets | 1 set | 1 set |

*INFERRED*: if STARTING → MID → ADVANCED are three consecutive 8-week off-season blocks ('8wk1' …), the coach's long off-season looks like this:
* volume falls about 19 % per block (component count; about -11 % then -18 % if each written line is counted once);
* main lifts move from 3 × 6 to 2 × 6-8 to 3 × 1 'DEADLIFTS (1RIR)';
* high-amplitude jumps give way to single-leg reactive work;
* throws roughly double from STARTING to MID (210 → 400), then hold (420).

Those are textbook block-periodization moves: accumulation → transmutation → realization.

#### 8.2.4 Annual planning for athletes (observed calendars)

The BASEBALL tab carries four season calendars (rows 4-17):
* **High-school months** (row 6): 'PRE SEASON' (Jan) → 'IN SEASON' × 2 → 'PLAYOFFS' → 'POST SEASON' → 'OFF SEASON' × 3 → 'SOFT SEASON' × 2 → 'OFF SEASON'. The month row (row 4) has no February ('JANUARY ' then 'MARCH'), and a second row (F5:H5) marks the three July-September 'OFF SEASON' months as 'SOFT SEASON' too.
* **Weekly** (row 9): 5 pre / 12 in / 18 off / 16 'FALL BALL', with a parallel row 10 marking all 16 'FALL BALL' weeks 'SOFT SEASON'. The week labels skip 'WK 2' ('WK 1', 'WK 3' … 'WK 52').
* **Pro months** (row 13): 'OFF SEASON', 'SOFT SEASON', 'IN SEASON' × 6, 'POST SEASON', 'OFF SEASON' × 2.
* **Pro weekly** (row 16): 'SOFT OFF SEASON', 'OFF SEASON' × 3, 'PITCHERS/CATCHERS', 'POSITIONS', 'IN SEASON' × 33, 'OFF' × 2, 'POST SEASON' × 2, 'OFF SEASON' × 5, then 'PEAK' and 'DELOAD' × 2.

Mapping to skeletons (*INFERRED*: the calendars are not linked to the 'BLOCK 1/2/3' grids anywhere in the tab):

| Calendar segment | Skeleton | Typical length |
|---|---|---|
| 'OFF SEASON' | OFF_SEASON blocks | 8-12 weeks each |
| 'PRE SEASON' / 'PITCHERS/CATCHERS' / 'POSITIONS' / fight camp | PRE_SEASON | 5-8 weeks in his calendars, ending in a deload/taper (v1.1 generator: 4-6 weeks, the last 1-2 a taper; R2-PER-06) |
| 'IN SEASON' / 'PLAYOFFS' | IN_SEASON | repeating 2-week A/B (v1.1: 2 gym days, light Olympic 2 x 3, game-heavy rule; R2-ATH-04, R2-ATH-07) |
| 'POST SEASON' / 'OFF' | TRANSITION | 1-2 weeks |

**v1:** the calendar segments map onto the season phases (8.2.1). **v1.1:** the tool computes the phases from the season start date and the practice/game days (8.2.0; COACH-R2 R2-GEN-05). High school, college and pro need about the same thing; loads and speeds change per athlete, pros need more care for their bodies (COACH-ANSWER PRG-09).

#### 8.2.5 Sports: approved numbers and season types (v1.1)

**Approved per-sport numbers** (COACH-R2 R2-ATH-01 shares, R2-ATH-06 aerobic counts, R2-ATH-07 in-season; laterality COACH-ANSWER UNI-02, CAT-13, ATH-03, ATH-04, ATH-08). Plyo share = the share of jump and throw work that is plyometric at the END of a block; every block starts 15 points more ballistic. Pre-season aerobic 2 and in-season 2 for every sport.

| Sport | Plyo share, end of block | Start of block | Aerobic sessions, off-season | Laterality / special rules | Season notes |
|---|---|---|---|---|---|
| Sprinters / jumpers (track) | 75 % | 60 % | 2 | ipsilateral step-ups for acceleration ('get out of the hip'); sprinters/acceleration 40/60 -> 20/80 bilateral | sprints; meet/championship taper |
| Volleyball | 60 % | 45 % | 3 | contralateral for change of direction; 80-90 % unilateral | game-heavy rule (R2-ATH-07); jumps |
| Soccer | 60 % | 45 % | 3-4 | contralateral; 80-90 % unilateral; frontal/transverse lunges | game-heavy rule |
| Football skill positions | 60 % | 45 % | 3 | contralateral; 80-90 % unilateral | game-heavy rule |
| Basketball | 50 % | 35 % | 3 | contralateral; 80-90 % unilateral | game-heavy rule; jumps |
| Tennis | 50 % | 35 % | 3 | contralateral; 80-90 % unilateral; frontal/transverse work | tournament mini-tapers (PROPOSED) |
| Football big-skill positions | 50 % | 35 % | 3 | per 04_profiles v1.1 | game-heavy rule |
| Weekend warriors (gen-pop athletic) | 50 % | 35 % | 3 (general count, adjustable) | 50/50, cross-pattern pairing | no season; play days handled like games (8.2.6) |
| Baseball / softball | 40 % | 25 % | 2 | pitchers: less overhead pressing, more arm care, rotational throws light | throws held at maintenance (OBSERVED); Olympic light |
| Ice hockey | 40 % | 25 % | 3-4 | per 04_profiles v1.1 | game-heavy rule |
| Football linemen | 40 % | 25 % | 3 | strength-type 60/40 bilateral off-season | game-heavy rule; strength maintenance |
| MMA | 40 % | 25 % | 4 | rotational work | fight prep = steps & waves |
| Boxing | 25 % | 10 % | 3 | reduce (not cut) pressing/arm volume in high-punching weeks | fight prep = steps & waves |
| Karate / kickboxing | 25 % | 10 % | 3-4 | as boxing | fight / tournament prep |
| Wrestling | 25 % | 10 % | 4 | strength-type | weight-class tournament season |
| Brazilian jiu-jitsu | 25 % | 10 % | 3 | per 04_profiles v1.1 | tournament prep |
| Golf | 25 % | 10 % | 3 | per 04_profiles v1.1 | tournament season |
| Powerlifters | no plyo block | - | 2 easy (Orange) | bilateral-leaning (50/50 -> 80/20-90/10) | meet peak: strength template + taper |
| Aesthetics / bodybuilding (not an athlete) | no plyo block; medball only in the warm-up | - | 4 incl. a 2nd easy Orange + optional walks | 50/50 -> 80/20-90/10 | show date: PREP |

**Every popular US sport, by season type (COACH-R2 REQ).** He asked that 'all of the different popular sports in the United States are there. Include swimming as well.' The sports he named in round 2 carry his numbers above; every other sport takes the periodization rules of its season type below, and its own numbers (plyo share by ground-contact class, aerobic sessions, injury notes, positions) live in `04_profiles` v1.1 (written in parallel by the sports team; referenced by sport id).

| Season type | Sports | Season shape | In-season / peak | Tags |
|---|---|---|---|---|
| A. Game-heavy team sports | basketball, volleyball (indoor and beach), soccer, American football (all positions; flag football), ice hockey [named by the coach]; lacrosse, field hockey, rugby, ultimate, cheer, water polo [INFERRED same class; 04_profiles v1.1 marks them game_heavy] | off-season blocks -> pre-season 4-6 weeks (~60 %, speed/power, 1-2-week taper) -> in-season 2 gym days -> post-season | game-heavy rule: gym plyos ~half, no extra COD, sprints only for speed athletes, hard day >= 48 h before a game; Olympic 2 x 3 light, out in heavy game weeks | COACH-R2 R2-ATH-07, R2-PER-06, R2-ATH-04; the INFERRED sports and their numbers: 04_profiles v1.1 |
| B. Diamond sports | baseball, softball | as A; long season with many games | 2 gym days; throws and plyos held at maintenance (OBSERVED ~200 contacts, ~176 throws/week); pitchers' arm care; Olympic 2 x 3 light | OBSERVED BASEBALL; COACH-ANSWER ATH-08; COACH-R2 R2-ATH-04 |
| C. Meet / championship sports | swimming and diving, track and field (sprints, hurdles, jumps, throws, middle distance), cross country, gymnastics, rowing, wrestling (dual + tournament season); figure skating, competitive dance [INFERRED same class; no 04 profile yet] | long competitive season with a championship peak; off-season blocks -> pre-season -> in-season (2 dryland/gym days) -> championship taper -> post-season | strength and power maintained 2 days/week; the sport's own volume is the conditioning; championship taper 1-3 weeks (swimming main meet: 2 weeks of dryland taper lined up with the pool taper, PROPOSED) | COACH-R2 REQ; SCIENCE Bosquet 2007, Aouani 2024; lengths PROPOSED |
| D. Combat sports with a date | boxing, MMA, kickboxing / Muay Thai, karate, taekwondo, judo, BJJ (and wrestling bouts) | off-season blocks between fights; PREP 6-8 weeks to the date (2-week steps and waves) with a 1-2-week taper | no 'season': fight camps; pressing/arm volume reduced (not cut) in high-punching weeks | COACH-ANSWER PER-10, ATH-04; OBSERVED BOXING |
| E. Tournament individual sports | tennis, golf, pickleball (competitive), padel; racquetball / squash, badminton, table tennis [INFERRED same class; no 04 profile yet] | rolling season of tournaments: off-season blocks in the quiet months, then 2 gym days in season | a short lighter 3-5-day run-in before key tournaments (PROPOSED); otherwise in-season rules | COACH-R2 REQ; PROPOSED |
| F. Endurance and event racing | road running (5K to marathon), triathlon, cycling, HYROX (competitive), obstacle course racing, CrossFit competitions | race date: strength stairway 2-3 days/week alongside the sport's endurance plan; the last block's hardest weeks end before the taper | taper 1-3 weeks by distance (HYROX about 1 week; half marathon: his Chris Hinshaw plan as-is with its 1-week taper); CrossFit: observed macro (resistance -> strength -> power -> test) | COACH-ANSWER PRG-12, PRG-10; OBSERVED CF macro; SCIENCE Bosquet 2007, Davids 2026; COACH-R2 REQ |
| G. Strength and physique sports | powerlifting, strongman, Olympic weightlifting (its own programming, R2-GEN-06), bodybuilding / physique | meet or show date: strength template or hypertrophy stairway; HARDEST weeks end before the taper/peak | meet: strength template weeks 9-12 then a taper (volume about -60 %, intensity kept); show: PREP | COACH-ANSWER PER-09, PER-10; COACH-R2 R2-GEN-06, R2-ATH-06 (powerlifters 2 easy Orange); SCIENCE Pritchard 2016 |
| H. Seasonal outdoor sports | alpine skiing and snowboarding (competitive), climbing, surfing | a pre-season block before the season (e.g. autumn for ski season), then 2 gym days during it | maintenance of strength and power; the season's own volume is the conditioning | COACH-R2 REQ; PROPOSED |
| I. Gen pop 'stay athletic and active' | recreational pickleball, padel, tennis, golf; HYROX for fitness; rec leagues (basketball, soccer, softball, flag football, volleyball, kickball); running for fitness; hiking/rucking; cycling; lap swimming; ski prep; surf/paddle; dance/fitness classes; bowling, disc golf [INFERRED]; weekend warriors; active aging 50+/60+; youth general athletic development | no season: the gen-pop 12-week stairway, 8-week or yearly plan with the weekend-warrior athletic overlay (8.2.6); optional event date | play days handled like practice/game days | COACH-R2 REQ; COACH-ANSWER ATH-13; PROPOSED |

**Swimming (added at his request).** Season type C. The pool already gives the conditioning and a huge shoulder volume, so dryland work is strength and power 2-3 days a week with 0-1 aerobic gym sessions (PROPOSED; the number is set in 04_profiles v1.1). Starts and turns are single big efforts, so jump work leans ballistic (INFERRED; share in 04 v1.1). Olympic lifts follow the athletic rule (everyone in athletic training; defaults 2-3 days). Shoulder care (external rotation, floor Y/T raises, R2-LIB-07) sits in every block. Season: off-season dryland stairway blocks -> pre-season -> in-season 2 days -> a 2-week dryland taper before the main championship meet, lined up with the swim coach's pool taper (PROPOSED, 14.3 #6; SCIENCE Bosquet 2007, Aouani 2024).

The v0 table (observed baseball/boxing contacts and INFERRED defaults) is kept in `06_periodization.json > athlete.sport_phase_modifiers_v0_observed`; the v1 table in `retired_v1.sport_phase_modifiers_v1`. Contacts per session follow 12_volume_algorithm §3.13 (NSCA ceilings; his own sessions run lower).

#### 8.2.6 Stay athletic and active (gen pop): pickleball, HYROX and other recreational activities (COACH-R2 REQ)

> 'for the athletes, all of the different popular sports in the United States are there. Include swimming as well.' ... 'Gen Pop and general fitness people are wanting to do things like high rows and pickleball, meaning they want to stay athletic and active, so we need to understand that that's an option for them.' ('high rows' is read as HYROX, the fitness race: INFERRED)

| Item | Rule | Tag |
|---|---|---|
| Who | gen-pop and general-fitness people with no competitive season who want to stay athletic: recreational pickleball, padel, tennis, golf, HYROX for fitness, rec leagues, running, hiking, cycling, lap swimming, weekend warriors, active aging. The picker asks the activity only (no position, no season dates). | COACH-R2 REQ; product picker owned by 13_product_options v1.1 |
| Plan | the gen-pop modes (12-week stairway, 8-week, year, week-by-week) with the weekend-warrior athletic overlay: core opens light -> plyo/ballistic (weekend-warrior end share 50 %, start 35 %) -> an Olympic variant (L1 DB/KB snatch, hex-bar jump, KB squat clean) -> resistance at the general factor x0.8 -> aerobic 3/week, adjustable. | COACH-ANSWER ATH-13, ATH-10, ATH-07; COACH-R2 R2-ATH-01, R2-SES-06; factor PROPOSED |
| Play days | their activity days are entered like practice/game days: the hardest gym day sits >= 48 h before the heaviest play day; in weeks with 3+ play sessions no extra change-of-direction or agility drills (the play is the agility work); plyos about half in those weeks. | R2-ATH-07 logic applied to recreation (PROPOSED) |
| Pickleball / padel / rec tennis | lateral and short multi-directional steps, split-step reaction, rotation, single-leg balance, calf/Achilles, shoulder and elbow care; low-amplitude plyos. Many players are older: the 60+ rules apply (no Olympic lifts, plyos or depth jumps by default; an option with a warning to work with a fitness professional). | COACH-R2 REQ; COACH-R2 R2-ATH-08; SCIENCE SFIA 2025; emphasis PROPOSED (detail in 04_profiles v1.1) |
| HYROX for fitness | race = 8 x 1 km runs, each followed by a station (SkiErg 1000 m, sled push 50 m, sled pull 50 m, burpee broad jumps 80 m, row 1000 m, farmers carry 200 m, sandbag lunges 100 m, wall balls 100 reps). Plan: hybrid overlay with aerobic 3-4 sessions (run intervals in Blue/Green, steady Orange), station circuits as finishers and density work, and a resistance stairway for legs, pulling, pushing and carries. | SCIENCE Davids 2026; COACH-R2 REQ; overlay PROPOSED |
| Event date (optional) | a race or tournament date turns the last block into a peak: its hardest weeks end 1 week before the event, then a 1-week taper (about half the sets, intensity kept). No date -> the normal stairway or year. | SCIENCE Bosquet 2007; PROPOSED (14.3 #5) |
| Year plan | the approved gen-pop year stays the default; the user can drop an athletic block where they want it (e.g. a pickleball-season block in spring, a HYROX block before a race) by re-ordering or changing blocks. | COACH-R2 R2-PER-01, R2-PER-02 |

*Science: SFIA 2025 (24.3 million US pickleball players in 2025, fastest-growing sport, strong 65+ engagement); Davids 2026 (HYROX demands: aerobic base, anaerobic power, local muscular endurance, maximal strength). Section 12, rows SCI_PICKLEBALL and SCI_HYROX.*

#### 8.2.7 The sample plans he will grade (COACH-R2 R2-GEN-07): periodization map

| Sample plan | Who (default intake) | Mode | Skeleton | Periodization in short |
|---|---|---|---|---|
| Swimming | competitive swimmer (high school / club / college), dryland 3 days | SEASON | ATHLETE_OFF_C12 (or ATHLETE_PRE_6 if the first meet is <= 6 weeks away) + the swimming profile (04 v1.1) | season type C: stairway dryland blocks, RC stages, Olympic up to 2-3 days, championship taper 2 weeks (PROPOSED) |
| Football | high-school player, skill position or lineman, off-season | SEASON | ATHLETE_OFF_C12 | type A: VOL 1 -> 3, plyo end 60 % (skill) / 40 % (linemen), aerobic 3, Olympic up to 4 days, pre-season 4-6 weeks, game-heavy in-season rule |
| Soccer | off-season or pre-season player | SEASON | ATHLETE_OFF_C12 / ATHLETE_PRE_6 | type A: plyo end 60 %, aerobic 3-4, game-heavy in-season rule |
| CrossFit-style bootcamp | gen-pop class member | C12 | C12_HYBRID (HALF TIME dose) + bootcamp circuits | stairway via levels and WODs; circuits 3-5 rounds x 30-50 s |
| Bootcamp | gen-pop, 3-6 sessions/week | C12 | C12_GENERAL (BOOTCAMP row) | stairway in rounds and seconds (3 x 30 -> 4 x 35 -> 4 x 40 -> 5 x 50 s across the exercise blocks) |
| Full-body aesthetics | gen-pop L1-L2 | C12 | C12_HYPERTROPHY (full-body template) | stairway 3 -> 5 %; 2-4 exercises per muscle per day (R2-SES-05); HARDEST 9-12 with MYO on the last isolation |
| Push / pull / legs | L2 | C12 | C12_HYPERTROPHY (PPL template) | stairway 3 -> 5 %; heavy squat and heavy deadlift on different days; HARDEST 9-12 |

*Mode and skeleton choices PROPOSED. This list replaces the five sample intakes in `samples/intakes/` (beginner fat loss, intermediate aesthetics, basketball off-season, boxer, home dumbbell); intakes for the new list still have to be written.*

### 8.3 Observed reference programs (what he wrote; source material, not generator defaults)

These tables are unchanged from v0 apart from the titles and the v1 notes. They show the doses, rep strings and menus the overlays borrow from.

#### Observed · AESTHETICS-12 (4 TRACKS), 12 weeks
*Basis:* OBS_4T_AESTHETICS12 (+ squat hypertrophy menu waves). Intermediate base = 3 sets/exercise. Beginner: start at 2 (AESTHETICS-8) and use the gym level ladder (shown after HYBRID-8 below). Advanced (INFERRED): same shape, MYO/supersets allowed from wave 1 (the squat menu lists '**MYO SET - ADVANCED' as a separate row A27, after wave 3; BYOP ATHLETIC presets 'MYO SET' on week-1 leg extensions G12). Vol idx here = sets per exercise with the slot count held constant (generator default). In the sheet the slot count falls in wave 2 (the Monday/Thursday 'TRICEP EXT.' rows end after wk7/wk8; Friday's MYO row is 2-3 sets), so the written weekly-set index is 100,100,100,133,133,133,100,129,124,124,124,154 (132/132/132/165 in wk9-12 with superset partners; wk9-11 counts row 63's own '(5 sets ...)').

| Wk | Phase | Role | Vol idx | Sets/exercise | Reps | Effort | Load | Methods / content | Levers changed | Status | Evidence |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | ACCUMULATION 1 | ACCUMULATE | 100 | 3 / 3 | '12/10/8' / iso '20' | compounds 2 RIR, iso 1 RIR |  | baseline menu (A variants) |  | OBSERVED-ADAPTED (effort INFERRED: AESTHETICS-12 writes no RIR/RPE) | 4T O31=3, O32 '12/10/8 -20', O33 'A WEEK'; '1-2 RIR' borrowed from AESTHETICS-8 (D35:D62) |
| 2 | ACCUMULATION 1 | ACCUMULATE | 100 | 3 / 3 | '12/10/8' / '20' | 1-2 RIR | add load at same reps | B variants (cable vs DB side raise, incline vs flat, barbell vs hammer curl) | L03_LOAD (implicit); L06_VARIATION A/B | OBSERVED (effort INFERRED: AESTHETICS-12 writes no RIR/RPE) | 4T P31:P33 'B WEEK' |
| 3 | ACCUMULATION 1 | ACCUMULATE | 100 | 3 / 3 | '12/10/8' / '20' | 1 RIR | add load | A variants | L04_EFFORT; L06_VARIATION A/B | OBSERVED (effort INFERRED: AESTHETICS-12 writes no RIR/RPE) | 4T Q31:Q33 |
| 4 | ACCUMULATION 2 | ACCUMULATE | 133 | 4 / 4 | '12/12/10' / '20' | 2 RIR (re-baseline after the set jump) |  | B variants; sheet: SETS = 4 but only three numbers before '-20' | L01_SETS +1/exercise (+33 %); L02_REPS | OBSERVED (effort INFERRED) | 4T R31=4, R32 '12/12/10-20' |
| 5 | ACCUMULATION 2 | ACCUMULATE | 133 | 4 / 4 | '12/12/10' / '20' | 1-2 RIR | add load | A variants; sheet: SETS = 4 but only three numbers before '-20' | L03_LOAD (implicit); L06_VARIATION | OBSERVED (effort INFERRED: AESTHETICS-12 writes no RIR/RPE) | 4T S31:S32 |
| 6 | ACCUMULATION 2 (wave peak) | PEAK | 133 | 4 / 4 | '12/12/12' / '20' | 1 RIR; iso 'MAX' |  | B variants; sheet: SETS = 4 but only three numbers before '-20' | L02_REPS (+6 % reps) | OBSERVED (effort INFERRED: AESTHETICS-12 writes no RIR/RPE) | 4T T31:T32 '12/12/12-20' |
| 7 | MID DELOAD ('A WEEK LOWER') | DELOAD | 100 | 3 / 3 | '8/8/8' / '12' | RPE ~7 (3 RIR) | moderate load, fewer reps | no intensifiers; A variants | L01_SETS -25 %; L02_REPS down; L08_METHODS off | OBSERVED (effort INFERRED) | 4T U31=3, U32 '8/8/8-12', U33 'A WEEK LOWER' |
| 8 | INTENSIFICATION 1 (phase change) | INTENSIFY | 133 | 4 / 4 | '15/12/10/8' / '20' | 1 RIR |  | new phase menu begins (wk8 'Arnold press', 'overhead cable rope tricep ext'; from wk9 'RFE Lunges (bulgarian)', 'Leg extension one leg at a time', 'machine or db Reverse flies') | L01_SETS back to 4; L02_REPS wider pyramid; L05/L06 new menu | OBSERVED (effort INFERRED: AESTHETICS-12 writes no RIR/RPE) | 4T V31=4, V32 '15/12/10/8-20' |
| 9 | INTENSIFICATION 2 | INTENSIFY | 133 | 4 / 4 (+ superset partner sets ~+6 %) | '15/12/10/8' / '20' | 1 RIR; partners to max |  | 'front squats + Superset with 15 squats with no weight every set'; 'bench press + superset with max pushup set'; '2 sets LEG PRESS MYO - 15-5-5-5-5-5'; 'machine rows or db rows (5 sets - 15/12/12/12/10)' | L08_METHODS on | OBSERVED (effort INFERRED: AESTHETICS-12 writes no RIR/RPE) | 4T W31:W32, rows 41-66 |
| 10 | INTENSIFICATION 3 | INTENSIFY | 133 | 4 / 4 (+partners) | '12/12/10/10' / '20' | 1 RIR |  | intensifiers continue ('incline bench press + superset with a set of max bench dips') | L02_REPS | OBSERVED (effort INFERRED: AESTHETICS-12 writes no RIR/RPE) | 4T X31:X32 |
| 11 | INTENSIFICATION 4 | INTENSIFY | 133 | 4 / 4 (+partners) | '12/12/12/12' / '20' | 1 RIR |  | intensifiers continue | L02_REPS (+9 %) | OBSERVED (effort INFERRED: AESTHETICS-12 writes no RIR/RPE) | 4T Y31:Y32 |
| 12 | PEAK / OVERREACH | PEAK | 167 | 5 / 5 | '15/15/12/12/12' | 0-1 RIR; iso 'MAX' |  | '3 sets LEG PRESS MYO - 15-5-5-5-5-5'; next plan opens with a deload or test week (INFERRED) | L01_SETS +25 % | OBSERVED (effort INFERRED: AESTHETICS-12 writes no RIR/RPE) | 4T Z31=5 / Z32 '15/15/12/12/12' (FCE5CD) |

**v1:** '12/10/8 -20' = pyramid + a light set of 20 (PRG-07); week 7 'A WEEK LOWER' is an observed mid deload, no longer planned (PER-01); the 32-35-set week 12 is not copied (VOL-02, UNI-01).

#### Observed-adapted · AESTHETICS-8 (4 TRACKS), 8 weeks
*Basis:* OBS_4T_AESTHETICS8 step timing (+1 set at wk2, wk5, wk7; reps 12/10/8 x2 then 8). Index shown for intermediate B=3 (3,4,4,4,5,5,5). Beginner B=2 reproduces the sheet exactly: 2,3,3,3,4,4,5 = 100,150,150,150,200,200,250.

| Wk | Phase | Role | Vol idx | Sets/exercise | Reps | Effort | Load | Methods / content | Levers changed | Status | Evidence |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | ACCUMULATION 1 | ACCUMULATE | 100 | B (3 int. / 2 beg.) | 12 | 1-2 RIR |  | baseline menu |  | OBSERVED-ADAPTED | 4T E32=2, E33=12, D col '1-2 RIR' |
| 2 | ACCUMULATION 1 | ACCUMULATE | 133 | B+1 | 10 | 1-2 RIR | heavier | lunge variable step ('FFE CONTRA' -> 'FFE IPSI') | L01_SETS +1; L02_REPS -2; L06_VARIATION | OBSERVED-ADAPTED | 4T F32=3, F33=10 |
| 3 | ACCUMULATION 1 | ACCUMULATE | 133 | B+1 | 8 | 1-2 RIR | heavier | 'RFE CONTRA LUNGES' | L02_REPS -2; L06_VARIATION | OBSERVED-ADAPTED | 4T G32=3, G33=8 |
| 4 | ACCUMULATION 2 | ACCUMULATE | 133 | B+1 | 12 | 1-2 RIR | reset load to the 12-rep weight | 'RFE IPSI LUNGES' | L02_REPS reset; L06_VARIATION | OBSERVED-ADAPTED | 4T H32=3, H33=12 |
| 5 | ACCUMULATION 2 | ACCUMULATE | 167 | B+2 | 10 | 1-2 RIR | heavier | 'RFE LUNGES' | L01_SETS +1; L02_REPS | OBSERVED-ADAPTED | 4T I32=4, I33=10 |
| 6 | ACCUMULATION 2 | ACCUMULATE | 167 | B+2 | 8 | 1-2 RIR | heavier | 'RFE & FFE LUNGES' | L02_REPS | OBSERVED-ADAPTED | 4T J32=4, J33=8 |
| 7 | PEAK | PEAK | 167 | B+3, capped at 5 (if capped: add MYO/superset to 1-2 slots/session) | 8 | 1 RIR; iso to 'MAX' | heaviest | intensifier only if the set cap was hit | L01_SETS +1 or L08_METHODS | OBSERVED-ADAPTED (cap INFERRED) | 4T K32=5, K33=8 |
| 8 | DELOAD WEEK | DELOAD | 60 | 3 main / 2 iso | 8 | RPE ~7 | moderate | cardio continues; no intensifiers | L01_SETS; L02_REPS; L08_METHODS off | OBSERVED label; dose INFERRED from BASEBALL deload | 4T L35/L55 'DELOAD WEEK' |

**Hypertrophy rules seen in these programs (OBSERVED).**
* **Slot skeleton**: AESTHETICS 4-day (knee + pull / hip + push, bilateral → unilateral → isolation, calves first on A days), or PPL 6-day, or upper/lower.
* **Default dose**: compounds 3 sets, isolation 2 sets, calves 3 sets (BYOP demo cells, 'Machine Calf Raises' 3 × '15 Reps'); one heavy or explosive compound per day may get 5 × '6 to 8 Reps' ('DB Push press').
* **Reps**: compounds 8-15 in descending pyramids or waves; isolation 15-20 (fat-loss variant up to 30-40).
* **Effort**: '1-2 RIR' on compounds (written only in AESTHETICS-8; AESTHETICS-12 writes no effort), isolations to 'MAX' (INFERRED for the aesthetics tracks).
* **Variation**: A/B weeks.
* **Intensifiers**: last phase (weeks 9-12 of 12; peak week of 8). *INFERRED* exception: MYO on machine isolations from week 1 for advanced clients. The basis is the 'MYO SET' preset on week-1 leg extensions in BYOP ATHLETIC (G12) and the squat menu's separate '**MYO SET - ADVANCED' row (A27).
* **Specialisation**: 'Focus 1' / 'Focus 2' run the SMOOTH governor.
* **v1:** effort is RIR 1-3 (VOL-13); intensifiers belong to the hardest weeks; A/B weeks only for variety seekers (PER-03); specialisation = priority +4-6 sets (VOL-02), not a SMOOTH-governor tier.

#### Observed · STRENGTH-12 (4 TRACKS), 12 weeks
*Basis:* OBS_4T_STRENGTH12. Volume index = 'the work' sets/week; session_index includes accessory (assumed 3 sets), nuance 3x8, survival 3x8.

| Wk | Phase | Role | Vol idx | Work sets/wk | Session idx | Sets/exercise | Reps | Effort | Load | Methods / content | Levers changed | Status | Evidence |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | WAVE 1 - VOLUME | ACCUMULATE | 100 | 16 | 100 | work 4 / acc. 3 / nuance 3 / survival 3 | work 5; acc. 6-8 (unset); nuance 3x8 (Wed nuance 'TATE PRESS' 3x20, N15); survival 3x8 | RPE 7 | 80 % | A week: 'HIGH BAR SQUAT' / 'BENCH PRESS' / fast 'LEG PRESS' / fast 'INCLINE BENCH'; Thu/Sat 'FAST RPE6 or about 60-70%' |  | OBSERVED (accessory dose INFERRED: unset in sheet) | 4T O3:O6, N8:N24 |
| 2 | WAVE 1 - VOLUME | ACCUMULATE | 100 | 16 | 100 | 4 | 5 | RPE 7 | 80 % | B week: 'RDL (stiff leg deadlift)' / 'INCLINE BENCH' / fast 'DEADLIFT' / fast 'BENCH PRESS' | L06_VARIATION A/B | OBSERVED | 4T P3:P6 |
| 3 | WAVE 1 - STRENGTH | INTENSIFY | 125 | 20 | 108 | 5 | 4 | RPE 7 | 85 % | A week | L01_SETS +1; L02_REPS -1; L03_LOAD +5 % | OBSERVED | 4T Q3:Q6 |
| 4 | WAVE 1 - STRENGTH | INTENSIFY | 125 | 20 | 108 | 5 | 4 | RPE 8 | 85 % | B week | L04_EFFORT +1 | OBSERVED | 4T R3:R6 |
| 5 | WAVE 1 - PEAK | INTENSIFY | 150 | 24 | 115 | 6 | 3 | RPE 8 | 90 % | A week; 'Front squat' / 'DEADLIFT' swap in | L01_SETS +1; L02_REPS -1; L03_LOAD +5 % | OBSERVED | 4T S3:S6 |
| 6 | WAVE 1 - PEAK | PEAK | 150 | 24 | 115 | 6 | 3 | RPE 9 | 90 % | B week; WK6 column highlighted FFF2CC | L04_EFFORT +1 | OBSERVED | 4T T3:T6, T8:T24 FFF2CC |
| 7 | 'MID DELOAD' | DELOAD | 75 | 12 | 92 | 3 | 4 | RPE 7 | ~81 % (INFERRED from RPE chart) | accessory/nuance/survival unchanged in sheet (generator: cut to 2 sets, INFERRED) | L01_SETS -50 %; L04_EFFORT down | OBSERVED | 4T U3:U6 'MID DELOAD' |
| 8 | WAVE 2 - VOLUME | ACCUMULATE | 125 | 20 | 108 | 5 | 4 | RPE 8 | ~85 % (INFERRED) | restart at the wk3/4 dose | L01_SETS; L04_EFFORT | OBSERVED (% INFERRED) | 4T V4:V6 |
| 9 | WAVE 2 - STRENGTH | INTENSIFY | 150 | 24 | 115 | 6 | 3 | RPE 9 | ~89-90 % (INFERRED) |  | L01_SETS +1; L02_REPS -1; L04_EFFORT +1 | OBSERVED (% INFERRED) | 4T W4:W6 |
| 10 | WAVE 2 - STRENGTH | INTENSIFY | 150 | 24 | 115 | 6 | 3 | RPE 9 | ~90 % (INFERRED) |  |  | OBSERVED (% INFERRED) | 4T X4:X6 |
| 11 | WAVE 2 - PEAK | INTENSIFY | 175 | 28 | 123 | 7 | 2 | RPE 9 | ~92 % (INFERRED) |  | L01_SETS +1; L02_REPS -1 | OBSERVED (% INFERRED) | 4T Y4:Y6 |
| 12 | REALIZATION | PEAK | 175 | 28 | 123 | 7 | 2 | RPE 10 | ~95 % (INFERRED) | 'DEADLIFT' + 'LOW BAR'; 1RM test = first week of the next plan (INFERRED) | L04_EFFORT to 10 | OBSERVED (% INFERRED) | 4T Z4:Z6 |

**v1:** the dose rows are confirmed (PER-09) and reused in the v1 strength overlay (section 5.4) without the week-7 'MID DELOAD'.

#### Observed · STRENGTH-8 conjugate (4 TRACKS), 8 weeks
*Basis:* OBS_4T_STRENGTH8 (product version of OBS_CJ_DRAFT). Intermediate-advanced. As written ME sets stay 5 (weekly 56 flat); the green ladder reading (shown) lets ME sets fall 5->1 (the same green fill is also on the plyo set cell B17 and the Saturday DE set cell B21). ME % INFERRED from reps at ~RPE 9.

| Wk | Phase | Role | Vol idx | ME reps/session | Weekly sets | Sets/exercise | Reps | Effort | Load | Methods / content | Levers changed | Status | Evidence |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | CONJUGATE WAVE 1 | ACCUMULATE | 100 | 25 | 56 | ME 5 (ladder) / DE 5 Thu (B18), 3 Sat (B21) / '2RIR' rows 3 Mon-Wed, 4 Thu-Sat / 'MAX' rows 4 / 'ALL' rows 2-3 / plyo 3 | ME 5; DE 3; '2RIR' rows 6; 'MAX' rows 8 (Mon) or 10; 'ALL' rows '8/8'; plyo 6 | ME and DE '1RIR' (as written); '2RIR'; 'MAX'; 'ALL'; plyo 'EASY' | ME ~84 % (5 @ RPE 9, INFERRED); DE written '1RIR' here (D18/D21) - 'FAST RPE6 or about 60-70%' is STRENGTH-12's wording (N17/N21), applying it is INFERRED | squat ME week: 'HEAVY FRONT SQUAT (D)BOX SQUAT '; Thu plyo row 3x6 'WEIGHTED DEPTH DROP' 'EASY' (labelled 'the work' in the CONJUGATE draft M21); opposite-dominance accessory 'SNATCH GRIP DL' |  | OBSERVED | 4T B9:D24, E4:E6 |
| 2 | CONJUGATE WAVE 1 | INTENSIFY | 100 | 20 | 56 | ME 5 | ME 4; DE 3 | as wk1 | ME ~86 % | deadlift ME week: 'HEAVY DEFICIT DEADLIFT'; plyo 'DEPTH DROP & JUMP'; DE 'FAST BANDED DL ' | L02_REPS -1; L06_VARIATION squat -> deadlift ME week | OBSERVED | 4T F4:F6 |
| 3 | CONJUGATE WAVE 1 | INTENSIFY | 96 | 12 | 54 | ME 4 | ME 3; DE 2 | as wk1 | ME ~89 % | 'HEAVY (D)BOX HIGH BAR SQUAT'; plyo 'HIGH SQUAT JUMPS' | L01_SETS -1 (ladder); L02_REPS -1 | OBSERVED | 4T G4:G6 |
| 4 | CONJUGATE WAVE 1 (peak) | PEAK | 96 | 8 | 54 | ME 4 | ME 2; DE 1 | as wk1 | ME ~92 % | 'HEAVY CHAINED DEADLIFT'; plyo 'REPEAT HIGH JUMPS' | L02_REPS -1; L08_METHODS chains | OBSERVED | 4T H4:H6 |
| 5 | CONJUGATE WAVE 2 | INTENSIFY | 93 | 3 | 52 | ME 3 | ME 1; DE 3 | as wk1 | ME ~95 % | 'HEAVY FRONT SQUAT '; plyo 'WEIGHTED DEPTH DROP' | L02_REPS; L01_SETS -1 | OBSERVED | 4T I4:I6 |
| 6 | CONJUGATE WAVE 2 | INTENSIFY | 93 | 9 | 52 | ME 3 | ME 3; DE 2 | as wk1 | ME ~89 % | 'HEAVY DEADLIFT'; plyo 'DEPTH DROP & JUMP' | L02_REPS second wave | OBSERVED | 4T J4:J6 (CONJUGATE J3 cyan 'TEST' above WK6) |
| 7 | CONJUGATE WAVE 2 (peak) | PEAK | 89 | 4 | 50 | ME 2 | ME 2; DE 1 | as wk1 | ME ~92 % | 'HEAVY HIGH BAR SQUAT'; plyo 'REPEAT HIGH JUMPS' | L01_SETS -1; L02_REPS -1 | OBSERVED | 4T K4:K6 |
| 8 | TEST + DELOAD | TEST | 18 | 1 | 10 | ME 1 (test) / DE deload | ME 1 (work up to 1RM) | max | 100 % | 'TEST' on M.E. days, 'DELOAD' on the plyo row (L17) and the Saturday DE row (L21); no accessories written | L10 realization | OBSERVED labels; weekly set count INFERRED (as written: TEST rows 5 + 5 sets, DELOAD rows unspecified) | 4T L4:L6, L9/L13 'TEST', L17/L21 'DELOAD' |

**v1:** 'conjugate' is not required ('I don't need it to be conjugate', PER-01); chained/banded rows are out of scope (EQ-12). Kept as an option for advanced strength clients.

#### Observed · CrossFit class cycle (HALF TIME), 8 weeks
*Basis:* OBS_CF_CLASS8 (HALF TIME table). Part-time / class / limited recovery: intensify at fixed 3 sets. Also the default for beginners who want 'strength' with 3 days or less (INFERRED).

| Wk | Phase | Role | Vol idx | Strength reps idx | Sets/exercise | Reps | Effort | Load | Methods / content | Levers changed | Status | Evidence |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | CLASS CYCLE '1/1' | ACCUMULATE | 100 | 100 | 3 | strength 7; power 4 | push limits, no failure (A4) |  | 'SQUAT' Mon, 'PRESS' Tue + 'SNATCH', 'DEADLIFT' Thu, 'CLEAN' Fri; every class 'WARMUP/SKILL' -> 'STRENGTH/POWER' -> 'WOD' |  | OBSERVED (codes decoded INFERRED) | CF S4 (1/1), R21, S21 |
| 2 | '2/1' | INTENSIFY | 100 | 86 | 3 | strength 6; power 4 |  |  |  | L02_REPS strength -1 | OBSERVED | CF S5 |
| 3 | '2/2' | INTENSIFY | 100 | 86 | 3 | strength 6; power 3 |  |  |  | L02_REPS power -1 | OBSERVED | CF S6 |
| 4 | '3/2' | INTENSIFY | 100 | 71 | 3 | strength 5; power 3 |  |  |  | L02_REPS strength -1 | OBSERVED | CF S7 |
| 5 | '3/3' | INTENSIFY | 100 | 71 | 3 | strength 5; power 2 |  |  |  | L02_REPS power -1 | OBSERVED | CF S8 |
| 6 | '4/3' | INTENSIFY | 100 | 57 | 3 | strength 4; power 2 |  |  |  | L02_REPS strength -1 | OBSERVED | CF S9 |
| 7 | '4/4' | PEAK | 100 | 57 | 3 | strength 4; power 1 |  |  |  | L02_REPS power -1 | OBSERVED | CF S10 |
| 8 | '5' TEST | TEST | 20 | 5 | 1 build-up | 'Work up to 1RM' | max | 100 % | no power level 5 | L10 test | OBSERVED | CF S11 = 5, R25 'LVL 5 = Work up to 1RM' |

**Strength rules seen in these programs (OBSERVED).**
* **Day grammar**: 'the work' (main bilateral) → 'the accessory' (opposite dominance, 3-4 × 6 '2RIR') → 'the nuance' → 'the survival'. In STRENGTH-12 the nuance slot is unilateral lower / 'TATE PRESS' / 'CABLE FLIES' and the survival slot is isolation, with no effort words. In STRENGTH-8 and the CONJUGATE draft the same rows carry 'MAX' (pull-ups / DB rows, alt incline DB bench, lunges) and 'ALL' (RFE lunges / staggered DL, bicep curls). So "nuance = unilateral, MAX" and "survival = isolation, ALL" is INFERRED. On Thursday the plyo row takes the 'the work' position, so the effort words sit one slot name lower (DE squat = 'the accessory' '1RIR', pull-ups = 'the nuance' '2RIR', lunges = 'the survival' 'MAX'; 4T M17:M20 / D17:D20).
* **Main lift**: alternates a squat (knee-dominant) week and a deadlift (hip-dominant) week on the max-effort day (8-week; "KD week / HD week" is the analyst's label, STRENGTH-8 writes no such words) or A/B (12-week).
* **Dynamic-effort day**: 'FAST RPE6 or about 60-70%' (STRENGTH-12 N17/N21). Of the accommodating methods only bands are a speed tool in the coach's words: 'BOTTOM BANDED' 'Bands are designed for speed/velocity' with 'Weight should be lower ranges around 50% so you can move fast' (ALL ABOUT SQUATS C35/B36). Chains are a loading tool: 'BOTTOM CHAINS' '*INTENSIONALLY SLOW YOU DOWN', 'Chains are designed for magnitude influence, loading.', 'Weght can be moderate around 70%' (A39:C40, B40). The sheets agree: STRENGTH-8 puts 'HEAVY CHAINED DEADLIFT' on the max-effort day (H9) and 'FAST BANDED DL' on the speed day (H18). The CONJUGATE draft's 'FAST CHAINED DL' (H22) became 'FAST BANDED DL' in the product version. Conflict: STRENGTH-8 and the CONJUGATE draft label their fast rows '1RIR' (4T D18/D21). This is an open question.
* **Plyo**: the first row of the speed day, 3 × 6 'EASY' (labelled 'the work' in the CONJUGATE draft M21), rotating weighted depth drop → depth drop & jump → high squat jumps → repeat high jumps.
* **Squat choice**: the 'Whatever Squat' menus show the goal picks the dose and the squat ladder picks the exercise. Hypertrophy is 3-5 × 8-15 '(1 RIR) *RPE8+' with 1-2 min rest; strength is 4-8 × 2-5 '(1 RIR) RPE 8+' with 3-6 min rest.
* **Unilateral pairing** differs between versions: STRENGTH-8 pairs the same dominance, STRENGTH-12 and HYBRID the opposite. This is an open question.
* **v1:** day grammar meanings confirmed (ORD-07); speed work uses straight weight (EQ-12); pairing is a rule by goal: same pattern for high-level/aesthetics clients, cross pattern for bootcamp (UNI-06), which settles the 'unilateral pairing differs between versions' question.

#### Observed · FAT BURN / BODY TONING, 4 weeks
*Basis:* OBS_FB_4WK (weeks 1-4 as written; the v0 INFERRED weeks 5-6 are removed).

| Wk | Phase | Role | Vol idx | Reps idx | Circuit work min/wk | Sets/exercise | Reps | Effort | Load | Methods / content | Levers changed | Status | Evidence |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | BLOCK A - week 1 | ACCUMULATE | 100 | 100 | 12.0 | lead 3, others 2-4 (max 4) | lead 3x15; 2nd 3x12; lunge 3x'8/8'; SL RDL 2x'12/12'; iso 4x15; arms 2x30 | not written (generator: 2 RIR compounds, iso near failure) |  | circuits Mon+Fri 3 x '30 secs' (12.0 min/wk); WED/SAT '30-40 mi slow/steady CARDIO' |  | OBSERVED (effort INFERRED) | FB B5:D33, B36:D66 |
| 2 | BLOCK A - week 2 | ACCUMULATE | 100 | 105 | 18.7 | same total (redistribution) | lead 3x12; 2nd 3x15; iso 3x20; arms 2x30 |  |  | A/B flip of lower and upper days; circuits Tue+Thu 4 x '35 secs' (18.7 min) | L02_REPS; L06_VARIATION A/B; L07_DENSITY | OBSERVED | FB E5:G33 |
| 3 | BLOCK A - week 3 (variation upgrade) | ACCUMULATE | 107 | 118 | 21.3 | lead 3->4, SL RDL 2->3, 1st upper slot 3->4 (rows 12/25), hammer/kickback arm slot 2->3; leg ext/curl 3->2 and the 3rd upper slot 4->3 (net +2 sets per half-week) | lead 4x12; 2nd 3x10; iso 2x40; arms 3x30 |  |  | upgrade: walking/stationary -> 'FRONT FOOT ELEVATED'/'REAR FOOT ELEVATED LUNGES'; 'MACHINE SUPPORTED ROW' -> 'DB ROWS'; single-arm -> 'LAT PULL DOWN/PULL UP'; flat -> incline; curls/rope -> hammer/kickbacks; circuits Mon+Fri 4 x '40 secs' (21.3 min) | L01_SETS +6.7 %; L06_VARIATION upgrade; L02_REPS iso up; L07_DENSITY | OBSERVED | FB H5:J33 |
| 4 | BLOCK A - week 4 (peak) | PEAK | 117 | 133 | 33.3 | 2nd lower slot 3->4, leg ext/curl 2->3, 3rd upper slot 3->4 (net +3 sets per half-week) | lead 4x10; 2nd 4x12; iso 3x40; arms 3x40 |  |  | circuits Tue+Thu 5 x '50 secs' (33.3 min); no deload written | L01_SETS +9.4 %; L02_REPS; L07_DENSITY | OBSERVED | FB K5:M33 |

**Fat-loss rules seen in this program (OBSERVED).**
* **Same lifting as hypertrophy.** The block is literally titled 'MUSCLE BUILDING'; the deficit levers sit around it:
  * 2 × '30-40 mi slow/steady CARDIO' (Wednesday/Saturday, zone C);
  * 2 'CIRCUITS RECCOMENDED' per week on lifting days, alternating Mon/Fri weeks (1 and 3: mixed full-body + core) with Tue/Thu weeks (2 and 4: Tuesday upper + core, Thursday lower + core).
* **Dose belongs to the slot (row)**, not to the exercise.
* **Weekly flips**: the A/B day flips every week. Tuesday upper is the lower-rep day and Friday the higher-rep day (daily undulation).
* **Exercise changes** come in 2-week mini-blocks (upgrade at week 3: stability/ROM ladder).
* **Caps**: never more than 4 sets per lifting slot. Isolation reps by slot: leg ext/curl 15 → 20 → 40 → 40, arms 30 → 30 → 30 → 40, side raises 15 → 15 → 20 → 20.
* **Circuits** progress rounds and seconds together: 3 × 30 → 4 × 35 → 4 × 40 → 5 × 50 s. Weekly work goes 12.0 → 33.3 min.
* *INFERRED*: under a calorie deficit every muscle's governor rate is capped at 3 % (v0 governor, retired; see the v1 line below).
* **v1:** circuits are finishers after lifting (PRG-11) inside the bootcamp range 3-5 rounds x 30-50 s (PRG-03); 40-rep isolation sets only as an AMRAP option (VOL-11); the deficit rate cap was a PROPOSED rule, not a size tier (retired in v1.1: fat-loss blocks use the standard stairway on the x0.8 start, 12_volume_algorithm v1.1).

#### Observed · HYBRID-8 (4 TRACKS), 8 weeks
*Basis:* OBS_4T_HYBRID8. No deload written (v1: the next plan opens with a deload or a maintenance block, section 6). The SETS/REPS header (D71:L72) does not match the written bench (3x6 ... 4x8) or Olympic sets; it can govern the unwritten squat/deadlift sets (INFERRED); E78:L78 beside 'UPPER ACCESORY' (D78) repeats it exactly (2,2,2,3,3,3,4,4).

| Wk | Phase | Role | Vol idx | Assumed weekly sets idx | Sets/exercise | Reps | Effort | Load | Methods / content | Levers changed | Status | Evidence |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | WAVE 1 | ACCUMULATE | 100 | 100 | strength 2 | strength 6 ('SETS'/'REPS' header) | 'heavy' Oly; strength not written |  | OLY Mon '2x 2 clean pulls, 2 power cleans' (Thu snatch twin); bench Tue '3x6 - DB bench press/ core'; jumps Tue/Fri 'Depth drops'; sprint Tue '10x15 Sec sprint/30 sec walk'; Fri '15-40 min constant cardo easy'; 'AMRAP' 12 (D70; Saturday circuit and minutes INFERRED) | L07_DENSITY; L12_PLYO ladder | OBSERVED | 4T E70:E72 and rows 74-101 |
| 2 | WAVE 1 | ACCUMULATE | 100 | 100 | strength 2 | strength 8 ('SETS'/'REPS' header) | 'heavy' Oly; strength not written |  | OLY Mon '2x 5 heavy touch and go cleans' (Thu snatch twin); bench Tue '3x6 db incline bench press/ core'; jumps Tue/Fri 'Weighted depth drops'; sprint Tue '12x 15 sec sprint/ 30 sec walk'; Fri '15-40 min constant cardo easy'; 'AMRAP' 15 (D70; Saturday circuit and minutes INFERRED) | L02_REPS +2; L07_DENSITY; L12_PLYO ladder | OBSERVED | 4T F70:F72 and rows 74-101 |
| 3 | WAVE 1 | ACCUMULATE | 100 | 100 | strength 2 | strength 10 ('SETS'/'REPS' header) | 'heavy' Oly; strength not written |  | OLY Mon '2x 3 clean pulls heavy' (Thu snatch twin); bench Tue '3x8 - barbell bench press/ core'; jumps Tue/Fri 'depth drop to jump'; sprint Tue '15 x 15 sec sprint/ 30 sec walk'; Fri '15-40 min constant cardo easy'; 'AMRAP' 16 (D70; Saturday circuit and minutes INFERRED) | L02_REPS +2; L07_DENSITY; L12_PLYO ladder | OBSERVED | 4T G70:G72 and rows 74-101 |
| 4 | WAVE 2 | ACCUMULATE | 150 | 139 | strength 3 | strength 6 ('SETS'/'REPS' header) | 'heavy' Oly; strength not written |  | OLY Mon '3x 3 heavy power cleans' (Thu snatch twin); bench Tue '3x8 - barbell incline bench press/ core'; jumps Tue/Fri 'weighted depth drops to jump'; sprint Tue '10x 20 sec sprint/ 40 sec walk'; Fri '15-40 min constant cardo easy'; 'AMRAP' 17 (D70; Saturday circuit and minutes INFERRED) | L01_SETS +1; L02_REPS reset to 6; L07_DENSITY; L12_PLYO ladder | OBSERVED | 4T H70:H72 and rows 74-101 |
| 5 | WAVE 2 | ACCUMULATE | 150 | 143 | strength 3 | strength 8 ('SETS'/'REPS' header) | 'heavy' Oly; strength not written |  | OLY Mon '4x 2 heavy squat cleans' (Thu snatch twin); bench Tue '3x10 DB bench press/ core'; jumps Tue/Fri 'box jumps'; sprint Tue '12x20 sec sprint/ 40 sec walk'; Fri '15-40 min constant cardo easy'; 'AMRAP' 18 (D70; Saturday circuit and minutes INFERRED) | L02_REPS +2; L07_DENSITY; L12_PLYO ladder | OBSERVED | 4T I70:I72 and rows 74-101 |
| 6 | WAVE 2 | ACCUMULATE | 150 | 135 | strength 3 | strength 10 ('SETS'/'REPS' header) | 'heavy' Oly; strength not written |  | OLY Mon '2x 3 heavy clean pulls' (Thu snatch twin); bench Tue '3x10 DB incline press/ core'; jumps Tue/Fri 'box jumps'; sprint Tue '15x 20 sec sprint/40 sec walk'; Fri '15-40 min constant cardo easy'; 'AMRAP' 19 (D70; Saturday circuit and minutes INFERRED) | L02_REPS +2; L07_DENSITY; L12_PLYO ladder | OBSERVED | 4T J70:J72 and rows 74-101 |
| 7 | WAVE 3 | ACCUMULATE | 200 | 174 | strength 4 | strength 6 ('SETS'/'REPS' header) | 'heavy' Oly; strength not written |  | OLY Mon '2x3 heavy squat cleans' (Thu snatch twin); bench Tue '4x6 bb bench/ core'; jumps Tue/Fri 'repeat hurdle hops'; sprint Tue '5x 30 sec fast/ 2 min walk'; Fri '15-40 min constant cardo easy'; 'AMRAP' 20 (D70; Saturday circuit and minutes INFERRED) | L01_SETS +1; L02_REPS reset to 6; L07_DENSITY; L12_PLYO ladder | OBSERVED | 4T K70:K72 and rows 74-101 |
| 8 | WAVE 3 | PEAK | 200 | 174 | strength 4 | strength 8 ('SETS'/'REPS' header) | 'heavy' Oly; strength not written |  | OLY Mon '2x 1 heavy squat clean' (Thu snatch twin); bench Tue '4x8/ bb incline bench/ core'; jumps Tue/Fri 'repeat hurdle hops'; sprint Tue '10x 30 sec fastest/ 2 min walk'; Fri '15-40 min constant cardo easy'; 'AMRAP' 20 (D70; Saturday circuit and minutes INFERRED) | L02_REPS +2; L07_DENSITY; L12_PLYO ladder | OBSERVED | 4T L70:L72 and rows 74-101 |

**v1:** its content (Olympic, jump, sprint and rep-wave ladders) is the source of the 8-week hybrid overlay (8.1), but not its set steps or its session order: the 2 -> 3 -> 4 sets per exercise rise +10.4 %/week (+50 % and +33 % at the steps), which he called 'way too much' (UNI-05; see 2.3), so sets follow the C8 grid; Olympic/power work goes before strength (ORD-03) and core goes first by default (ATH-11).

**Hybrid rules seen in these programs (OBSERVED).**
* **Session order**: strength (bilateral) → Olympic/power → unilateral tri-set (opposite dominance) with core and an upper push or pull → accessory.
* **Olympic lifts**: clean on Monday, snatch on Thursday, rotating pull → power → squat variants, always 'heavy'.
* **Jumps**: Tuesday and Friday (non-squat days).
* **Conditioning**: at least one A (sprint) day and one C ('15-40 min constant cardo easy') day per week ('Never do the same color workout in the same week').
* **Core**: always inside tri-sets.
* **Header vs written dose**: the 'SETS'/'REPS' header (2-4 × 6/8/10) does not match the written bench (3 × 6, 3 × 6, 3 × 8, 3 × 8, 3 × 10, 3 × 10, 4 × 6, 4 × 8) or the Olympic sets. *INFERRED*: the header governs the unwritten strength sets (squat/deadlift). Row 78, next to the label 'UPPER ACCESORY' (D78), repeats the header sets exactly (2,2,2,3,3,3,4,4), so the header also reaches the Monday upper accessory. Row 79 (2,2,3,2,2,3,2,2) is unexplained.
* **WODs**: box-prescribed. Their level (1-4/week) climbs inside each block.
* **v1:** the generator does not copy the observed order: core first by default and movable (COACH-ANSWER ATH-11), then Olympic/power before heavy strength (COACH-ANSWER ORD-03, RIGHT on our question about this very HYBRID order: cleans and snatches come before heavy strength), then unilateral and accessory work. Sets follow the v1 mode grid, not the header's +1 set every 3 weeks (UNI-05).

**The gym level ladder (OBSERVED UL/PPL; used as the L1 rep ladder in 8.1).** The UL/PPL tabs define three *levels* that change only the dose; the exercises stay the same. The ladder is:

| Exercise class | NOVICE | NEWBY | INTERMEDIATE |
|---|---|---|---|
| UL lower compounds | 2 × 12 | 3 × 10 | 4 × 8 |
| PPL leg compounds | 2 × 8 | 3 × 10 | 4 × 8 |
| UL upper compounds | 3 × 8 | 3 × 10 | 4 × 12 |
| PPL push/pull compounds (incline DB bench, barbell bench, DB rows) | 3 × 15 ('15/15' rows) | 3-4 × 10 | 4 × 8 |
| PPL 'Dips' | 3 × 8 | 3 × 10 | 4 × 'MAX' |
| PPL lat pulldown ('Cable Lat pulldown' → 'Pull ups or Cable Lat pull down') | 3 × 15 | 4 × 10 | 5 × 12 (reps rise again) |
| PPL side raises / rear-delt flies / upright rows | 3 × 15 | 4 × 8 / 3 × 10 / 3 × 10 | 4 × 8 |
| UL/PPL 'Single Leg Deadlift' | 2 × '12/12' (PPL '8/8') | 3 × '10/10' | 3 × '8/8' (stays at 3 sets) |
| Other isolation | 2-3 × 20 / 'MAX REPS' (reps fixed; UL lower isolations 2 → 3 → 3 sets) | same | same |

Walking a beginner up that ladder every 3-4 weeks gives +18 % then +13 % weekly sets, about **+3-4 %/week** (+3.7 %/week at 4 weeks per level; +2.7 %/week if NOVICE week 1 → INTERMEDIATE is spread over all 11 steps of a 12-week plan). That is the coach's own small-step progression, expressed with his own level vocabulary. The UL upper-day anomaly (reps *rising* with level: 3 × 8 → 4 × 12) and the PPL leg-day anomaly (NOVICE 2 × 8 below NEWBY 3 × 10) are not copied (open question in `prog_mm_gym.md`). A-drills ('A March', 'A Skip', 'A Run') stay on every lower day.
* **v1:** NOVICE = NEWBY = L1 (PRG-05); the UL upper-day rep rise is not copied (PRG-06).

#### Observed · BOXING 8-week build-up (fight prep)
*Basis:* OBS_BX_8WK (fighter build-up). The v0 general-athlete variant (week 8 = TEST + DELOAD, rule D1) is retired with the v0 shapes (PER-01). Index: res = resistance sets, total = all working sets excl. throws and conditioning.

| Wk | Phase | Role | Res idx | Total idx | LB contacts (high / low) | Throws | Olympic piece | Resistance dose | Effort | Athletic content | Conditioning | Levers | Status | Evidence |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | BASE / GPP ('Bring athletes back to feeling/moving great') | BASE | 100 | 100 | 0 / 0 | 190 | none | every lift 3x10 (skull crushers 3x15); upper/lower split Mon/Thu lower, Tue/Fri upper | 1-3 RIR (INFERRED default from the instruction line 'Always go for 1-3 RIR (REPS IN RESERVE) aka RPE 7+' of UL/PPL A6 and ATHLETIC A5; the BOXING tab writes no effort for wk1-2); throws max intent | one '*MEDBALLS' list (19 throws x 10); no plyos for the fighter (non-fighters: stage-1 receive & pause landings 1-2 x 8, INFERRED) | Mon '20 sec fast/ 40 sec slow (cardio of choice)' (A); Fri '20 min' 'Easy cardio of choice (steady pace)' (C) |  | OBSERVED | BX A7:D49 (wk1-2, FFFF00) |
| 2 | BASE / GPP | BASE | 100 | 100 | 0 / 0 | 190 | none | same as wk1 | 1-3 RIR (INFERRED default from the instruction line 'Always go for 1-3 RIR (REPS IN RESERVE) aka RPE 7+' of UL/PPL A6 and ATHLETIC A5; the BOXING tab writes no effort for wk1-2); throws max intent | same | same |  | OBSERVED | BX B col |
| 3 | CONVERSION 1 (phase change) | CONVERT | 86 | 141 | 113 / 177 | 380 | 'Clean Pull/ hang Power Clean' 3x8; 'DB snatches' 3x'10/ 10'; 'Hang Power Clean & Press' 3x12 | new menu: 'DEADLIFTS (1-2RIR) + 3 min Jump Rope' 3x6; step-ups 3x'6/6' IPSI/contra; 'Jefferson Lunge'; leg ext/curl '6 & 6' (Mon) and '20/20' (Thu); complexes '3 Heavy SQUATs + 5 Tuck jumps + 5 DB squat jumps + 5 Squirrel jumps', '4 Deadlifts - 5 broad jumps - 5 KB swings - 5/5 High Knee runs' 3 sets | heavy rows 1-2 RIR ('DEADLIFTS (1-2RIR)'); athletic max intent, full quality | 'Weighted Depth Drops' 3x8; 'Single Leg to high march jump' 3x'6/6'; 'Squirrel jumps single leg (REVERSE BANDED)' 3x'20/20'; 'Drop into Box Jumps' 1x8; medball list 2x/wk | Tue 'Cardio of any choice' '20-40 min' (C); Fri 'Sprint 20/ Recover 40' x5 FIRST in session (A) | L10_QUALITY_SEQUENCE; L14_SLOT_QUALITY; L11_ATHLETIC_DOSE; L08_METHODS | OBSERVED | BX E col (EA9999) |
| 4 | CONVERSION 1 | CONVERT | 86 | 141 | 113 / 177 | 380 | same | same | heavy rows 1-2 RIR ('DEADLIFTS (1-2RIR)'); athletic max intent, full quality | same | same |  | OBSERVED | BX F col |
| 5 | CONVERSION 2 | CONVERT | 86 | 146 | 129 / 177 | 380 | same | same | heavy rows 1-2 RIR ('DEADLIFTS (1-2RIR)'); athletic max intent, full quality | 'Drop into Box Jumps' 1 -> 3 sets | sprint rounds 6 | L11_ATHLETIC_DOSE +; L07_DENSITY +1 round | OBSERVED | BX G col (E06666) |
| 6 | CONVERSION 2 | CONVERT | 86 | 146 | 129 / 177 | 380 | same | same | heavy rows 1-2 RIR ('DEADLIFTS (1-2RIR)'); athletic max intent, full quality | same | same |  | OBSERVED | BX H col |
| 7 | UNLOAD ACCESSORIES / RAMP KEY ROWS | DELOAD | 76 | 130 | 116 / 142 | 380 | 'Hang Power Clean & Press' 3 -> 4 | eleven rows 3 -> 2 sets; 'DEADLIFTS ... + 3 min Jump Rope' 2; ramping rows ('Single Leg swiss ball knee tuck in + DB rows', 'Hang Power Clean & Press', hinge complex) 3 -> 4 | not written (INFERRED default RPE ~7 on the unloaded accessory rows); the athletic rows are NOT all cut: 'Weighted Depth Drops' and 'Single Leg to high march jump' stay at 3 sets, 'Squirrel jumps single leg (REVERSE BANDED)' and 'Drop into Box Jumps' drop to 2 | 'Squirrel jumps single leg (REVERSE BANDED)' and 'Drop into Box Jumps' cut to 2 sets; 'Weighted Depth Drops' and 'Single Leg to high march jump' stay at 3 (I8, I9) | sprint rounds 7 | L01_SETS (redistributed, net -11 %); L07_DENSITY +1 | OBSERVED | BX I col |
| 8 | PEAK / OVERREACH (CC0000) | PEAK | 103 | 170 | 116 / 167 | 380 | 'Hang Power Clean & Press' 6 sets | ramping rows 6 sets; deadlift + rope 4; most accessories back to 3 (side + front raises 2); jump rows 2 (weighted depth drops J8, SL march jumps J9, squirrel jumps J32) | not written except 'DEADLIFTS (1-2RIR) + 3 min Jump Rope' (L12); INFERRED default: heaviest week, 1 RIR on the ramped rows, complexes max intent. The BOXING tab has no % anywhere, so no Olympic % is implied | box jumps 2 | sprint rounds 8 | L01_SETS +31 %; L07_DENSITY | OBSERVED | BX J col |

**v1:** this is his fight-prep step-and-wave pattern (PER-10); pressing/arm volume is reduced, not cut (ATH-04); 'Squirrel jumps single leg (REVERSE BANDED)' is out of scope (EQ-12).

#### Observed · BASEBALL Block 2 (read as pre-season in v0; may be late off-season, see 14.2)
*Basis:* OBS_BB_BLOCKS Block 2 (the sheet's 'wk 3' is missing; grid labels kept; the sheet labels it only 'BLOCK 2' - pre-season reading INFERRED). contacts_high = all counted lower-body contacts in BASEBALL (no high/low split). Olympic lifts sit under an 'OPTIONAL PIECE' label (BC51, BU51, CM51, DD50).

| Wk | Phase | Role | Res idx | Total idx | LB contacts (high / low) | Throws | Olympic piece | Resistance dose | Effort | Athletic content | Conditioning | Levers | Status | Evidence |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | PRE-SEASON 1 ('WK 1') | INTENSIFY | 100 | 100 | 212 / 0 | 70 | none | 4 x 8 main lifts; contrast: 'Heavy front squats' + 'KB squat cleans' 10; 'Barbell deadlift' + 'Broad jumps' 10 | heavy 4-8 reps at 1-2 RIR; OLY by %; jumps max intent with full recovery | Part A 2-3 sets | buy-outs 4 |  | OBSERVED | BB B2 A42 'WK 1' 'DONE' |
| 2 | PRE-SEASON 2 ('wk 2') | INTENSIFY | 97 | 97 | 254 / 0 | 180 | none | back to 12s ('12/12/10/10'); 'KB Squat cleans' 5x12 | heavy 4-8 reps at 1-2 RIR; OLY by %; jumps max intent with full recovery |  | buy-outs 2 | L02_REPS | OBSERVED | BB B2 S42 |
| 3 | PRE-SEASON 3 ('wk 4' label) | INTENSIFY | 99 | 98 | 232 / 0 | 110 | none | true strength sets 'heavy hex bar squats' '8/6/4/4'; speed squats 4x'4/4/4/4' + 'Jump squats' '8/8/8/8'; 'fast barbell deadlifts' '8/8/8/8' | heavy 4-8 reps at 1-2 RIR; OLY by %; jumps max intent with full recovery |  | sprints 7 | L02_REPS (VOL 3); L14_SLOT_QUALITY | OBSERVED | BB B2 AK42 'wk 4' ' DONE' |
| 4 | PRE-SEASON 4 ('wk 5') | INTENSIFY | 100 | 98 | 162 / 0 | 240 | 'OPTIONAL PIECE' OLY 4x8 @75 % (Mon/Thu cleans, Tue/Fri snatches) | barbell high zercher 4x12; deadlifts 4x12; 'Hex bar jump squats' 4x8 | heavy 4-8 reps at 1-2 RIR; OLY by %; jumps max intent with full recovery |  | buy-outs 3 | L03_LOAD (OLY on) | OBSERVED | BB B2 BC43 'wk 5' |
| 5 | PRE-SEASON 5 ('wk 6') | INTENSIFY | 103 | 111 | 231 / 0 | 180 | OLY 4x6 @80 % | complex 5 x '5 of each' ('front squats/high jumps/hex bar squat jumps/ banded assisted hops'); 'heavy deadlifts' '6/6/5/4'; Monday Part C 5 sets | heavy 4-8 reps at 1-2 RIR; OLY by %; jumps max intent with full recovery |  | sprints | L08_METHODS complexes; L03_LOAD +5 %; L01_SETS (Mon) | OBSERVED | BB B2 BU43 'wk 6' |
| 6 | PRE-SEASON 6 ('WEEK 7') | INTENSIFY | 107 | 118 | 324 / 0 | 290 | OLY 4x6 @85 % | Part C/D 5 sets every day; complexes 5 x '5 each'; 'banded front squats' 5x10 | heavy 4-8 reps at 1-2 RIR; OLY by %; jumps max intent with full recovery |  | buy-outs | L01_SETS 4 -> 5; L03_LOAD +5 % | OBSERVED | BB B2 CL43 'WEEK 7' |
| 7 | PRE-SEASON 7 PEAK ('WEEK 8') | PEAK | 111 | 124 | 270 / 0 | 276 | OLY 4x4 @90 % | 'heavy deadlifts' 5 x '6/6/6/6'; 'zercher squat' 5x12; complexes; Part C/D 5 (Friday Part D 4, DR54) | heaviest week: 1 RIR on main lifts; OLY 90 %; complexes max intent |  | sprints 8 | L03_LOAD +5 % | OBSERVED | BB B2 DD42 'WEEK 8' |
| 8 | 'DELOAD WEEK' (taper into the season) | DELOAD | 76 | 67 | 90 / 0 | 104 | none (OLY labels left blank) | same slot template '3 or 4' / 3 x 8 on the 'WEEK 7' exercises with bands/complexes/myo stripped; isolations 8-15 | RPE ~7; athletic 1-2 sets | Part A 1-2 sets | buy-out 'none' | L01_SETS -31 %; L11 -67 % | OBSERVED | BB B2 DU42 'DELOAD WEEK' |

**v1:** VOL 3 work and complexes ('5 of each') point to late off-season (PER-11, ATH-12); banded rows out of scope (EQ-12). **v1.1:** 'wk 5' runs the OLY piece on four days (Mon/Thu cleans, Tue/Fri snatches): the observed basis of his 'four times a week' (R2-ATH-04).

#### Observed · BASEBALL Block 3 (in-season)
*Basis:* OBS_BB_BLOCKS Block 3 (weeks 3-8 dated 'March 20 - 26' (AH61) ... '04/24 to 04/28' (DN60); in-season reading INFERRED from those dates). Rules: no Olympic lifts; no compound set below 8 reps; Part C/D frozen at 4 sets; same plyo/throw exposure; alternate two familiar weekly menus. total_index = all working sets vs week 1.

| Wk | Phase | Role | Res idx | Total idx | LB contacts (high / low) | Throws | Olympic piece | Resistance dose | Effort | Athletic content | Conditioning | Levers | Status | Evidence |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | IN-SEASON A (menu = Block 1 wk1, overlap 0.89) | MAINTAIN | 100 | 100 | 186 / 0 | 198 | none | Part C 4 x 8; Part D 4 sets; isolation MAX share up | 8-10 reps at 1-3 RIR (no compound < 8 reps); isolations 'MAX'; athletic max intent | Part A 3 sets | '1x 30 Sec Fast Run' 3-4 days |  | OBSERVED | BB B3 A61 'Week 1' |
| 2 | IN-SEASON B (menu = Block 2 WK1, 0.65) | MAINTAIN | 106 | 102 | 160 / 0 | 90 | none | 4 x 8; one contrast pair | 8-10 reps at 1-3 RIR (no compound < 8 reps); isolations 'MAX'; athletic max intent |  | same | L06_VARIATION A/B | OBSERVED | BB B3 O61 |
| 3 | IN-SEASON A' ('March 20 - 26') | MAINTAIN | 106 | 107 | 190 / 0 | 210 | none | '10/10/8/8' | 8-10 reps at 1-3 RIR (no compound < 8 reps); isolations 'MAX'; athletic max intent |  | same | L02_REPS | OBSERVED | BB B3 AG61:AH61 |
| 4 | IN-SEASON (new menu, 'March 27th - 31st') | MAINTAIN | 100 | 108 | 116 / 0 | 90 | none | 4 x 10 from here on; speed squat moves to Thursday | 8-10 reps at 1-3 RIR (no compound < 8 reps); isolations 'MAX'; athletic max intent |  | same | L14_SLOT_QUALITY | OBSERVED | BB B3 AT61:AU61 |
| 5 | IN-SEASON A (= Block 1 wk2, 0.54) | MAINTAIN | 94 | 100 | 285 / 0 | 198 | none | 4 x 10 | 8-10 reps at 1-3 RIR (no compound < 8 reps); isolations 'MAX'; athletic max intent |  | '2x 15 cal bike sprint' + '3x 10 cal row sprint or ski' |  | OBSERVED | BB B3 BK61 |
| 6 | IN-SEASON B (= Block 1 wk6, 0.83) | MAINTAIN | 100 | 91 | 214 / 0 | 216 | none | 4 x 10 | 8-10 reps at 1-3 RIR (no compound < 8 reps); isolations 'MAX'; athletic max intent |  | '1 X 12 Cal' |  | OBSERVED | BB B3 CC61 |
| 7 | IN-SEASON A (= Block 1 wk2 again, 0.59) | MAINTAIN | 89 | 99 | 271 / 0 | 156 | none | 4 x 10 | 8-10 reps at 1-3 RIR (no compound < 8 reps); isolations 'MAX'; athletic max intent |  | 2 x 15 cal + 3 x 10 cal |  | OBSERVED | BB B3 CU61 |
| 8 | IN-SEASON B (= wk6 / Block 1 wk6) | MAINTAIN | 106 | 103 | 189 / 0 | 252 | none | 4 x 10 | 8-10 reps at 1-3 RIR (no compound < 8 reps); isolations 'MAX'; athletic max intent |  | 1 x 12 cal |  | OBSERVED | BB B3 DM60:DN60 'WEEK 8' '04/24 to 04/28' |

**v1:** the generator default in-season is 2 days/week, low volume, minimal bilateral (PER-08, UNI-10); this 4-day block stays as evidence. **v1.1:** a light Olympic piece (2 x 3) is now kept in-season (R2-ATH-04); this block has none.

#### Observed · BASEBALL Block 1 'wk 8' (post-season / recovery week)
*Basis:* BASEBALL Block 1 'wk 8' (+ pro calendar 'POST SEASON', 'OFF', 'PEAK', 'DELOAD'). 

| Wk | Phase | Role | Res idx | Total idx | LB contacts (high / low) | Throws | Olympic piece | Resistance dose | Effort | Athletic content | Conditioning | Levers | Status | Evidence |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | RECOVERY / ARM CARE | TRANSITION | 0 | 22 | 0 / 0 | 0 | none (OLY 4 x 6 left blank) | no Part C/D/E | easy (paced cardio, mobility) | Part A 'Kettlebell arm bars' 3 x '10/10'; Part B 'Half kneeling shoulder roll' 3 x '8/8' or 'floor windchield wipers' accumulate '5 min' | Part C 'Paced Cardio - easy' 4 x '10 min' | L10 transition | OBSERVED | BB DS25 'wk 8' |

### 8.4 Retired v0 skeletons

Removed as generator defaults because they were built on the v0 6/8/12 shapes that the coach rejected (COACH-ANSWER PER-01): HYPERTROPHY_6, STRENGTH_6, FAT_LOSS_6 / FAT_LOSS_8 / FAT_LOSS_12 (beyond the observed 4 weeks), HYBRID_6, HYBRID_12 (CrossFit block compressed with an inserted week-7 deload), GENERAL_BEGINNER_6 / 8 / 12 (level ladder as a time ladder with a week-7 deload), ATHLETE_OFF_12 (boxing + baseball composite), ATHLETE_OFF_6, ATHLETE_PRE_6, ATHLETE_IN_SEASON_6 / 12. Their keys and bases are listed in `06_periodization.json > retired_v0.skeletons_removed`.

The v1 skeletons (C12/C8 rows with the v1 phase split, x1.10 8-week start and intake rates) are kept in `retired_v1.skeletons_v1`; the v1.1 rows replace them under the same keys, plus `ATHLETE_OFF_C8` and `ATHLETE_PRE_4` (new).

### 8.5 Volume index by week: v1.1 stairways and the observed programs side by side

| Key | Kind | Weeks | W1 | W2 | W3 | W4 | W5 | W6 | W7 | W8 | W9 | W10 | W11 | W12 | Deload / test |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| V1_1_C12_L1 | v1.1 12-week stairway | 12 | 100 | 100 | 100 | 100 | 100 | 110 | 110 | 120 | 120 | 120 | 130 | 140 | none inside; recovery week after; tests wk 1 and 12 if ticked |
| V1_1_C12_L2 | v1.1 12-week stairway | 12 | 100 | 100 | 100 | 107 | 107 | 113 | 113 | 120 | 127 | 133 | 140 | 147 | none inside; recovery week after; tests wk 1 and 12 if ticked |
| V1_1_C12_L3 | v1.1 12-week stairway (λ 0.50) | 12 | 100 | 100 | 100 | 100 | 105 | 105 | 110 | 110 | 115 | 115 | 120 | 125 | none inside; recovery week after; tests wk 1 and 12 if ticked |
| V1_1_C8_L1 | v1.1 8-week stairway | 8 | 100 | 100 | 100 | 100 | 110 | 120 | 120 | 130 |  |  |  |  | none inside; tests wk 1 and 8 if ticked |
| V1_1_C8_L2 | v1.1 8-week stairway | 8 | 100 | 100 | 100 | 107 | 113 | 120 | 120 | 127 |  |  |  |  | none inside; tests wk 1 and 8 if ticked |
| V1_1_C8_L3 | v1.1 8-week stairway (λ 0.78) | 8 | 100 | 100 | 100 | 105 | 110 | 115 | 120 | 125 |  |  |  |  | none inside; tests wk 1 and 8 if ticked |
| V1_1_C12_L2_OLDER_60_PLUS | v1.1 12-week stairway, steps <= 3 % (60+) | 12 | 100 | 100 | 100 | 107 | 107 | 113 | 113 | 120 | 127 | 127 | 133 | 133 | none inside; peak 20 (cap 22 not reached) |
| V1_1_MAINT_50_L2 (vs previous block) | v1.1 maintenance phase | chosen | 49 | 49 | 49 | 49 | 49 | 49 |  |  |  |  |  |  | it is the recovery; end prompt |
| V1_1_MAINT_60_L2 (vs previous block) | v1.1 maintenance phase | chosen | 59 | 59 | 59 | 59 | 59 | 59 |  |  |  |  |  |  | it is the recovery; end prompt |
| V1_1_MAINT_70_L2 (vs previous block) | v1.1 maintenance phase | chosen | 68 | 68 | 68 | 68 | 68 | 68 |  |  |  |  |  |  | it is the recovery; end prompt |
| HYPERTROPHY_12 | OBS AESTHETICS-12 | 12 | 100 | 100 | 100 | 133 | 133 | 133 | 100 | 133 | 133 | 133 | 133 | 167 | as written |
| HYPERTROPHY_8 | OBS-ADAPTED AESTHETICS-8 | 8 | 100 | 133 | 133 | 133 | 167 | 167 | 167 | 60 |  |  |  |  | as written |
| STRENGTH_12 | OBS STRENGTH-12 | 12 | 100 | 100 | 125 | 125 | 150 | 150 | 75 | 125 | 150 | 150 | 175 | 175 | as written |
| STRENGTH_8 | OBS STRENGTH-8 | 8 | 100 | 100 | 96 | 96 | 93 | 93 | 89 | 18 |  |  |  |  | as written |
| STRENGTH_PARTTIME_8 | OBS CF class | 8 | 100 | 100 | 100 | 100 | 100 | 100 | 100 | 20 |  |  |  |  | as written |
| HYBRID_8 | OBS HYBRID-8 | 8 | 100 | 100 | 100 | 150 | 150 | 150 | 200 | 200 |  |  |  |  | as written |
| ATHLETE_OFF_8 | OBS BOXING | 8 | 100 | 100 | 86 | 86 | 86 | 86 | 76 | 103 |  |  |  |  | as written |
| ATHLETE_PRE_8 | OBS BASEBALL B2 | 8 | 100 | 97 | 99 | 100 | 103 | 107 | 111 | 76 |  |  |  |  | as written |
| ATHLETE_IN_SEASON | OBS BASEBALL B3 | any (repeat A/B pairs; 6 = wk1-6, 12 = wk1-8 + wk5-8) | 100 | 106 | 106 | 100 | 94 | 100 | 89 | 106 |  |  |  |  | as written |

The v1.1 stairways are smoother and flatter than his written products: the 12-week curves climb 25-47 % and reach the cap only in week 12, the 8-week curves 25-30 %, where his AESTHETICS-12 climbs 67 % to a 32-35-set peak and his 8-week products climb 50-150 % from 2-set starts. The hardest weeks also get their intensity from load, RIR 1 and intensifiers (the '11').

---

## 9. Athletic-quality periodization (how each athletic quality moves across a plan)

### 9.1 v1.1 rules (coach answers, round 2 first)

1. Own budget: plyos, ballistics, throws, Olympic lifts and sprints never count toward muscle sets; counted as contacts, reps, throws, meters. *(COACH-ANSWER VOL-10)*
2. Ballistic -> plyometric inside every block; plyometric share at the END of a block by sport (sprinters 75 %; volleyball, soccer, football skill 60 %; basketball, tennis, football big-skill, weekend warriors 50 %; baseball, softball, hockey, linemen, MMA 40 %; boxing, karate, kickboxing, wrestling, BJJ, golf 25 %); each block starts 15 points more ballistic. Ballistic = longer contact or one big effort (squat, box, broad, loaded/hex-bar jumps, medball throws); plyometric = short bouncy contacts (pogo/ankle hops, hurdle hops, depth jumps, bounds, squirrel jumps, repeated jumps). *(COACH-ANSWER CAT-10, ATH-01, ATH-02; COACH-R2 R2-ATH-01, R2-ATH-02)*
3. Receive-Create stages (not zones): RC1 Land (receive and pause, stick the landing) -> RC2 Land & Go (receive, then create once) -> RC3 Repeat (repeated receive/create). 12-week: weeks 1-3 / 4-7 / 8-12; 8-week: 1-2 / 3-5 / 6-8; other lengths in proportion (PROPOSED). Restart at RC1 each off-season; hold the stage in maintenance blocks (pre-season included); intermediate and advanced athletes may start at RC2. Bilateral before unilateral inside each stage. Davidson zones do not apply to plyos. *(COACH-ANSWER CAT-10, CAT-11; COACH-R2 R2-ATH-03)*
4. Olympic lifts for everyone in athletic training, up to 4 days a week (clean days = squat pattern, snatch days = hinge pattern); weight by RIR/RPE and speed unless a tested max; full lifts 3-5 reps per set; in-season light 2 x 3 dropped in heavy game weeks; youth from the floor from ~14 after a hang block. *(COACH-ANSWER ATH-10, LIB-07, LIB-13; COACH-R2 R2-ATH-04, R2-ATH-05, R2-ATH-08, R2-GEN-06)*
5. Throws: no levels; light balls (8-10 lb) for speed, never over 20 lb; none for aesthetics/bodybuilders except warm-up. *(COACH-ANSWER LIB-06, EQ-06, ATH-05)*
6. Contrast / French contrast / complexes: intermediate+ athletes, off-season only, heavy lift ~78-85 %. *(COACH-ANSWER ATH-12)*
7. In-season: sprints for speed athletes, jumps for jumping athletes, strength maintenance for others; game-heavy sports (basketball, volleyball, soccer, football, hockey): gym plyos ~half, no extra COD, sprints only for speed athletes, hard gym day >= 48 h before a game. *(COACH-ANSWER PER-08; COACH-R2 R2-ATH-07)*
8. Older adults (60+): no Olympic lifts, plyos or depth jumps by default; landing drills (stick the landing: the 'receive' stage, not a plyo by R2-ATH-02) stay in; low ankle hops, other plyos, Olympic variants and depth jumps are an option only, with the warning 'Make sure that you have a fitness professional to help you understand what this means.' RESOLUTION FLAGGED: the approved proposal kept 'landing drills and low ankle hops'; his text says no plyos by default and ankle hops are plyometric by his own list (R2-ATH-02), so ankle hops became opt-in; depth jumps were 'never' in round 1 (ATH-09, EQ-03) and are now a coach-guided option at most. *(COACH-ANSWER ATH-09; COACH-R2 R2-ATH-08)*
9. Change of direction: route tiers EASY -> MOD. -> HARD TURN for every athlete; no extra COD in-season for game-heavy sports. *(COACH-ANSWER ATH-06; COACH-R2 R2-ATH-07)*
10. Aerobic: general/fat loss 3; aesthetics 4 (a 2nd easy Orange) + optional walks; athletes off-season 2-4 by sport, pre-season 2, in-season 2; powerlifters 2 easy Orange; the user can add or remove sessions. *(COACH-ANSWER ATH-07; COACH-R2 R2-ATH-06, R2-SES-06)*
11. No bands: reverse-banded plyos and banded throws/chops are out of scope. *(COACH-ANSWER EQ-01, EQ-07, EQ-12)*

### 9.2 Observed detail (v0, kept as evidence)
1. **Plyometrics**, ordered by force phase:
   * The phases run 'TAKING IN FORCES' (stick) → 'DELIVER FORCES FAST' (jump onto) → 'AMORTIZATION OF FORCES' (double bounce / drop & go) → 'REBOUNDING ' (repeat). *INFERRED*: this matches the order of the Sheet23 plyo 'zones' (v1: method stages, CAT-10/CAT-11) 'ZONE 1' 'Receive pause/creat' → 'ZONE 2' 'Receive/create' → 'ZONE 3 ' 'Repeat receive create'. The coach never links the two lists.
   * Within a phase (*INFERRED from the order of the BALLISTICS lists A26:D46*): bilateral before unilateral; unloaded before weighted; no drop before drop; hop before jump; reverse-banded last (out of scope in v1, EQ-12).
   * Week-to-week pattern: a 2-week hold per rung is typical (HYBRID: 'box jumps' × 2 weeks, 'repeat hurdle hops' × 2 weeks). STRENGTH-8 cycles the 4-rung ladder every 4 weeks.
   * Dose by type: landings 1-3 × 8; max jumps 1-3 × 5-12; reactive squirrel jumps 1-3 × 20-80 contacts; loaded jumps 3 × 4-6.
   * Deload cuts contacts about 65 %.
   * *INFERRED guardrail*: weekly contact increases ≤ 10-15 % except at a planned phase change preceded by base weeks.
2. **Throws** have no level ('AP - THROWING'). Rotational, step-forward and half-kneeling throws come in R/L pairs; bilateral throws (chest pass, overhead throw, squat to chest pass, slams, sit-up throws) are single entries. Each is 1 × 10, except sit-up throws, which are 1 × 20 in the BALLISTICS cheat sheet but 10 in the boxing list. What the sheets show: the boxer goes from one 19-throw list per week (190) to two (380). The athletic levels go from one 'ALL LIST' per week at STARTING (210 if the list is the BALLISTICS medball cheat sheet, 17 throws × 10 + 2 sit-up throws × 20; which list 'ALL LIST' means is INFERRED), to the 10-throw rotational subset at 2 × 10 in two sessions at MID (400), to two 'ALL LIST' sessions at ADVANCED (420). So the rotational subset is not a beginner step before the full list: STARTING already uses the full list. *INFERRED*: the levers are the number of list sessions per week and, at MID, 2 sets of a rotational-only subset. Throws stay in-season.
3. **Olympic lifts** progress along a skill ladder and a % ramp:
   * Skill: high → mid → low hang → floor; power catch before squat catch.
   * Load: 4 sets of 8 @75 % → 6 @80 % → 6 @85 % → 4 @90 %.
   * In BASEBALL they appear only from Block 1 week 6 through the end of Block 2: never in Block 3 (in-season reading INFERRED), never in the Block 2 deload. Block 1 'wk 8' keeps the 'OPTIONAL PIECE' 'OLY' row with 4 × 6 written but no exercise named (DS33:EH33). Other tabs start earlier: the athletic 'STARTING' block, labelled 'First 8 weeks (8wk1)', already has 'SUPERSET: Low Hang Power Cleans (mid weight) ' 3 × 8 (A36:C36), and the boxer adds 'Clean Pull/ hang Power Clean' in week 3 (E10:L10).
   * In BASEBALL every Olympic row sits under an 'OPTIONAL PIECE' label (CI33, DA33, DS33, BC51, BU51, CM51, DD50), so the coach treats them as optional.
4. **Sprint and conditioning** progress by density and zone:
   * Density examples: 10-15 × 15 s (1:2) → 20 s (1:2) → 30 s (1:4); boxer 20/40 rounds 5 → 8.
   * Zone: 'SPEED STRENGTH & POWER' '0-12 Secs' work in pre-season; 'SPEED POWER' '10-39 Secs' buy-outs all year. *(The zones and their second ranges are OBSERVED in the BASEBALL legend E20:F22; their placement by phase is INFERRED.)*
   * A speed session runs fastest-SSC hops → MACH drills / acceleration starts → max-velocity sprint.
5. **COD**: 'EASY TURN' → 'MOD. TURN' → 'HARD TURN' across blocks. True agility ('Reactive in nature') comes after pre-planned COD ('Proactive in nature'). *(INFERRED timing)*
6. **Core**: plane ladder SAGITAL → FRONTAL → TRANSVERSE across blocks. Within a week, rotate planes by day, as BASEBALL does (Mon 'LATERAL CORE', Tue/Fri 'Transverse core', Thu 'Sagital core').
7. **Aerobic**: unlock C → C+B → C+B+A → lactate clearance as the level rises. Within a level, add volume or density first, then pace. Use 3 sessions/week (one per colour) when the template allows; templates with only 2 slots alternate (open question).

---

## 10. Exercise progression and variation across a plan

### 10.1 v1.1 rules (coach answers, round 2 first)

* Exercise blocks of 4-6 weeks inside a training block (12-week: 1-4 / 5-8 / 9-12; 8-week: 1-4 / 5-8): exercises fixed inside; the next exercise block changes one or two small details (grip, stance, implement, range of motion, rep range), never all at once. *(COACH-ANSWER PER-02)*
* Variations are one-detail changes of library exercises, shown as e.g. 'Reverse lunge - dumbbell in opposite hand'; the generator never invents an exercise. *(COACH-R2 R2-LIB-01)*
* A/B lead-lift weeks (squat-led / hinge-led; bench / overhead) only for people who want variety; off by default. *(COACH-ANSWER PER-03; intake switch PROPOSED)*
* Second exposure of a slot in a week = a different exercise from the same category. *(COACH-ANSWER PER-04)*
* Spine: heavy squat and heavy deadlift on two different days (e.g. squat Monday, deadlift Friday); non-axial hinge (hip thrust, back extension, reverse hyper) and leg press or belt squat on the other lower days. Axial = barbell back, front, zercher, overhead and Smith squats; barbell or trap-bar deadlifts and RDLs; good mornings. Not axial = leg press, belt squat, hip thrust, back extension, reverse hyper, single-leg DB work, Olympic lifts, loaded jumps. Goblet, hack squat and pendulum are fine on the second day if not sore. Powerlifters may add a light technique squat or deadlift. *(COACH-R2 R2-SES-01, R2-SES-02; COACH-ANSWER PER-04, EQ-11)*
* Level up a slot at the end of an exercise block if it felt '8 - That was perfect' or easier with no pain. Levels are still theoretical; client level and exercise level are separate; the level comes from load position, skill and stability (zone is only a tag). *(COACH-ANSWER PER-06, CAT-04, CAT-05, CAT-06; COACH-R2 R2-LIB-02)*
* Rotation bias (Davidson zones): every week keeps both external-rotation (vertical, zones 1 and 3) and internal-rotation (horizontal, zone 2) work; the bias is used to pick swaps when something hurts; not set by sport for now. The zone is a tag on the exercise; it does not set the level. *(COACH-R2 R2-LIB-02, R2-LIB-03 (approved))*
* Choice between alternatives: by client profile (older/injured -> machines or DBs; experienced -> barbell) and by preference; machines are not ranked; hack squat and leg press are more constrained than the Smith machine; belt squat avoids axial loading. *(COACH-ANSWER EQ-10, EQ-11)*
* Bilateral:unilateral share across blocks: bodybuilders/powerlifters ~50/50 in block 1 (contra/ipsi health work in the first 2-4 weeks) -> 80/20-90/10; field/COD athletes 80-90 % unilateral; in-season minimal bilateral; pain shifts it. *(COACH-ANSWER UNI-02, UNI-03, UNI-10, CAT-13)*
* Pain: swap within the category to a more constrained, split-grip or unilateral variant and keep the sets if possible; then cut 30-50 %; then drop the exercise. *(COACH-ANSWER UNI-08, VOL-03, EQ-03)*
* KB face pulls are shoulder work (side/rear delts, traps), placed on pull or shoulder days; bench push-ups exist in both versions (hands on the bench = foundational, feet on the bench = advanced). *(COACH-R2 R2-LIB-04, R2-LIB-05; COACH-ANSWER LIB-10, LIB-12)*
* No bands, chains or variable resistance in any generator rule. *(COACH-ANSWER EQ-01, EQ-12)*

### 10.2 Observed detail (v0, kept as evidence)
* **Two independent axes** (OBSERVED):
  * *client level* changes the **dose** (UL/PPL give leg press and deadlifts to NOVICE);
  * the *library tier* (FOUNDATIONAL → MODERATE → ADVANCED) is a **property of each slot** (WEEKEND-WARRIOR ATHLETIC ('JUSTICE LEAGUE' tab) mixes tiers in one day, and keeps a power-cleaning athlete on foundational landings).
* **Tier promotion points** (OBSERVED moments; rule INFERRED): block boundaries, or the phase change of a long plan. Examples: BOXING week 3, AESTHETICS-12 week 8, FAT BURN week 3 upgrade. v0 rule (INFERRED, superseded by PER-06 above): promote when the last two exposures logged EFFORT ≤ 8 and 'Felt the RIGHT muscles'; regress on "Couldn't do it" (kept in v1 as the GEN-05 assumption).
* **Variation cadence by phase** (OBSERVED):

  | Phase | Variation cadence | Example |
  |---|---|---|
  | Hypertrophy | Weekly A/B variants (v1: only for variety seekers, PER-03) | cable vs DB side raise; incline vs flat |
  | Hypertrophy | One Pat-Davidson variable per week | 'FFE CONTRA' → 'FFE IPSI' → 'RFE CONTRA' → 'RFE IPSI' |
  | Fat loss | 2-week mini-blocks (v1: 4-6-week blocks by default, PER-02) | |
  | Strength | Conjugate weekly rotation | '(D)BOX', 'DEFICIT', 'CHAINED', 'BANDED' (v1: chained/banded out of scope, EQ-12) |
  | Athlete off-season | A new weekly menu | baseball Block 1 week-to-week overlap ≤ 0.15 |
  | Athlete pre-season | Replay and intensify earlier menus | overlap up to 0.81 |
  | Athlete in-season | Two familiar menus alternating | overlap 0.54-0.89 |

* **Within-week variation**: the two weekly exposures of a slot use different variants.
  * Front-loaded squat early in the week, back-loaded later ('Front Squats' Monday → 'Low Bar Back Squat' Thursday).
  * Bilateral landing first, then single-leg ('Medium Depth Drop' → 'SL Depth Drops').
  * In baseball, each lower pattern gets one *speed* day and one *strength* day ('Speed' Monday / 'strength' Tuesday / 'speed' Friday tags).
* **Pain rule** (OBSERVED): 'EXAMPLE ATHLETIC FULL BODY SPLI' A6 says '****When there are joint pains, usually going unilateral or/and also getting away from fixed grips (barbells, bars) and going split grips (dumbbells, kbs, indivitual grips) help take care of some stuff'. The UL and PPL tabs (A7) say the same without 'going unilateral'. *INFERRED*: equipment and laterality substitution comes before cutting volume.

---

## 11. Autoregulation: what the check-in does to next week (v1.1)

> His words: 'No, if they don't check in, the plan doesn't change. There is no data to go off of' (R2-VOL-03). 'I don't want anything to do with anything else other than just workouts. I just need the workouts here. There's no need to talk about sleep or stress or anything else' (R2-GEN-04). '10 should be like, "I can't do any more than this. I gave it all I had, but it was successful"' (R2-VOL-02).

The plan works with no tracking at all; an optional 1-minute weekly check-in (effort, sessions done, how it felt, anything hurting) moves next week's step (COACH-R2 R2-GEN-01, R2-GEN-04). Week-by-week asks for it every week; a week without it runs the planned step. Effort is rated against the week's target: '8 - That was perfect' means the person hit the target the plan gave.

| Signal (check-in) | Next-week action | Tag |
|---|---|---|
| No check-in that week | the planned stairway step (no change: 'There is no data to go off of') | COACH-R2 R2-VOL-03 |
| Effort mostly 7-8 ('7 - That was tough' / '8 - That was perfect' = hit the target the plan gave), sessions done, no pain | the planned step (standard +3 % to halfway, +5 % after; λ-scaled for muscles close to their cap) | COACH-R2 R2-VOL-01 (+5 % 'tough / perfect'); reading against the stairway PROPOSED (12 v1.1 §3.7.3) |
| Effort mostly 1-6 (too easy) | the planned step + 2 points, max 7 % (standard: +5 % to halfway, +7 % after); raise load or reps first | COACH-R2 R2-VOL-01 (+7 %); COACH-ANSWER GEN-05 |
| Effort 9 ('harder than planned') | hold (0 %) | COACH-R2 R2-VOL-01 |
| Any effort 10 ('I can't do any more than this. I gave it all I had, but it was successful') | hold and remove 1 set from that day next week | COACH-R2 R2-VOL-01, R2-VOL-02 |
| 'Failed' (optional menu item next to 10) | hold; that exercise -1 set and a lighter load or easier variant next week (PROPOSED, as 12 v1.1) | COACH-R2 R2-VOL-02 ('We can add a fail with it if we need to'); action PROPOSED |
| Under half the sessions done | repeat the week: the block becomes one week longer (with a fixed date ahead: hold instead) | COACH-R2 R2-VOL-01; fixed-date handling PROPOSED |
| HOW IT FELT? 'Felt a PAIN' | next exposure: swap inside the category to a more constrained, split-grip or unilateral variant, keep the sets if possible; again -> that slot -30-50 %, muscle step 0; a third time -> drop the exercise for the block and flag for the coach | COACH-ANSWER UNI-08, VOL-03, EQ-03, GEN-05 |
| HOW IT FELT? 'Felt the WRONG muscle' | change one detail inside the same category; volume unchanged | COACH-ANSWER GEN-05, PER-02; COACH-R2 R2-LIB-01 |
| HOW IT FELT? "Couldn't do it" | regress one exercise level or use an assisted version; volume unchanged | COACH-ANSWER GEN-05 |
| 'Felt the RIGHT muscles' + '8 - That was perfect' or easier through the exercise block, no pain | slot moves up one level at the next exercise block | COACH-ANSWER PER-06 |
| 2 holds in a row, effort mostly 9-10 two weeks in a row, under half the sessions 2 weeks running, pain on 2+ exercises in a week, or 'I can't keep up' | block-at-risk prompt: continue the block, or cancel it -> maintenance -> new block; it never inserts a deload by itself | COACH-R2 R2-VOL-07; offer signals PROPOSED |
| Sleep, stress, energy, 'how life was' | not asked and not used anywhere | COACH-R2 R2-GEN-04 ('I just need the workouts here') |

**Resolution flagged (life column).** The step table he approved in R2-VOL-01 had a 'life' column (+3 % instead of +5 % 'if life was harder', hold if 'much harder'). In R2-GEN-04 he rejected every sleep, stress or life input. v1.1 removes the life column: the step comes from effort, completion and pain only, and the intake has no lifestyle questions.

**The check-in in numbers (PROPOSED; 12_volume_algorithm v1.1 §3.7.3).** On target = the planned step; too easy = the planned step + 2 points, never above 7 %. With standard steps: +3 % / +5 % in the first half, +5 % / +7 % from halfway (exactly his approved table); λ-scaled muscles get their own planned step + 2. Holds, -1 set after a 10, repeated weeks (the block becomes one week longer) and the pain protocol apply in both halves.

**Retired in v1.1.** The readiness score R = 0.40 effort + 0.20 completion + 0.20 performance + 0.20 life; the intake-based static rate (5 %, or 3 % if stressed, older, returning or in pain); triggered deloads inside a block (now a 'cancel' offer, R2-VOL-07). They are kept in `retired_v1.autoregulation_v1`.

## 12. Science grounding

Rows SCI_BLOCK to SCI_CONJ are from v0 (two fact-check passes); rows SCI_LP_DUP_HYP to SCI_OLY_REPS were added for v1 to ground the new plan shapes; rows SCI_SWIM_TAPER to SCI_RM_TEST were added for v1.1 (searched and fetched 2026-10-08). 'How it maps' cells carry a v1.1 sentence where round 2 changed the mapping.

| Id | Topic | Finding | How it maps to the coach's model | Citation | Link |
|---|---|---|---|---|---|
| SCI_BLOCK | Block periodization | Concentrated blocks: accumulation -> transmutation -> realization; residual training effects ~30 +/- 5 days for aerobic endurance and maximal strength, ~18 days anaerobic glycolytic, ~5 +/- 3 days explosive/speed qualities. | CROSSFIT macro (RES -> STR -> POW -> TEST); athlete OFF_12 (base/conversion -> intensification -> realization); short residuals for speed/power explain why the coach keeps plyos/throws in EVERY phase including in-season. v1: block durations accumulation 2-6 weeks, transmutation 2-4 fit his 4-week athlete blocks (VOL 1 -> 2 -> 3, PER-11). | Issurin VB. New horizons for the methodology and physiology of training periodization. Sports Med 2010;40(3):189-206 (summary source: Sportlyzer Academy 'Block Periodization') | https://academy.sportlyzer.com/wiki/block-periodization |
| SCI_DOSE | Weekly set dose-response | More weekly sets -> more hypertrophy with diminishing returns; counting indirect sets as 0.5 ('fractional') predicts outcomes best; strength shows stronger diminishing returns and benefits more from frequency. | v1 counts helpers at 0.25 (COACH-ANSWER VOL-09); Pelland's 0.5 is stored for research comparison (12_volume_algorithm_v1); 15-20 / 20-25 bands (UNI-01). | Pelland JC et al. The Resistance Training Dose Response: Meta-Regressions Exploring the Effects of Weekly Volume and Frequency on Muscle Hypertrophy and Strength Gains. Sports Med 2026;56(2):481-505 (online 2025). | https://consensus.app/papers/details/28976bf04deb591980a56525e2ba77d1/?utm_source=claude_desktop |
| SCI_DOSE2 | Weekly set dose-response | Graded dose-response: each additional weekly set ~ +0.37 % gain; 10+ sets/muscle/week trend best. | floors (>= ~10 sets for growth muscles). | Schoenfeld BJ, Ogborn D, Krieger JW. Dose-response relationship between weekly resistance training volume and increases in muscle mass. J Sports Sci 2017. | https://consensus.app/papers/details/0fec06fa365f5224b7c53cd5acdd007d/?utm_source=claude_desktop |
| SCI_1220 | Volume range in trained men | 12-20 weekly sets per muscle may be an optimum standard; >20 not clearly better for quads/biceps (triceps responded to higher). | the coach's 15-20 band (UNI-01) sits inside 12-20; his 20-25 'growth' range is where only triceps showed extra benefit (12_volume_algorithm_v1 §2.2); level caps L2 22 / L3 25 (approved and customizable, COACH-R2 R2-VOL-06). | Baz-Valle E et al. A Systematic Review of The Effects of Different Resistance Training Volumes on Muscle Hypertrophy. J Hum Kinet 2022. | https://consensus.app/papers/details/d82bc2b70af65cea97f69cdebc6ab92a/?utm_source=claude_desktop |
| SCI_RIR | Proximity to failure | Hypertrophy improves as sets end closer to failure; strength gains similar across a wide RIR range. | isolation 'MAX'/'ALL', compounds 1-2 RIR; strength waves can stay at RPE 7-9. | Robinson ZP et al. Exploring the Dose-Response Relationship Between Estimated Resistance Training Proximity to Failure, Strength Gain, and Muscle Hypertrophy. Sports Med 2024. | https://consensus.app/papers/details/57d3863cb2ff54ce95ae91cd5c4e2e35/?utm_source=claude_desktop |
| SCI_LOAD_REPS | Progressive overload by load or reps | Progressing repetitions at a fixed load produced hypertrophy and strength similar to progressing load in trained lifters. | supports progressing small-muscle work by reps (VOL-11: small muscles 12-30); 40-rep sets stay an AMRAP option only (VOL-11); the study used lower-body exercises, so it supports rep progression in general. | Plotkin D et al. Progressive overload without progressing load? PeerJ 2022; also Chaves TS et al. Int J Sports Med 2024. | https://peerj.com/articles/14142 |
| SCI_RX | Prescription network meta-analysis | Heavier loads (>80 %) maximise strength; multi-set prescriptions rank highest for hypertrophy; all loads build muscle. | strength family drives % to 80-95 %; hypertrophy family drives sets. | Currier BS et al. Resistance training prescription for muscle strength and hypertrophy in healthy adults: a systematic review and Bayesian network meta-analysis. Br J Sports Med 2023. | https://consensus.app/papers/details/d7159f4e02555ec4bfbe3a35124223f4/?utm_source=claude_desktop |
| SCI_PERIOD | Undulating vs linear | Volume-equated: periodized > non-periodized for 1RM; undulating slightly better for strength in trained people; no hypertrophy difference. | the coach's within-week undulation (BASEBALL speed/strength days; FAT BURN heavy Tue / light Fri; leg ext '6 & 6' Mon vs '20/20' Thu) is supported for strength; hypertrophy depends on volume, not the scheme. | Moesgaard L et al. Effects of Periodization on Strength and Muscle Hypertrophy in Volume-Equated Resistance Training Programs: A Systematic Review and Meta-analysis. Sports Med 2022. | https://pubmed.ncbi.nlm.nih.gov/35044672/ |
| SCI_TAPER | Tapering | Best taper: ~2 weeks, volume reduced 41-60 % (progressive/exponential), intensity and frequency maintained. | deload/taper depth: his v1 deload (about half the sets, PER-05) sits inside the 41-60 % taper range; pre-season ends with a taper (D8). v1.1: pre-season taper 1-2 weeks (R2-PER-06); swimming championship 2 weeks (PROPOSED). | Bosquet L et al. Effects of tapering on performance: a meta-analysis. Med Sci Sports Exerc 2007; Wang Z et al. PLOS ONE 2023; Mujika I, Padilla S. Med Sci Sports Exerc 2003; Vachon A et al. Eur J Sport Sci 2020 (team sports: taper improves power, RSA, COD, VO2max). | https://consensus.app/papers/details/e28eb39cfe0452a0ac57e1efb43b4e48/?utm_source=claude_desktop |
| SCI_DELOAD | Deloading | Expert consensus: deload = period of reduced training stress to mitigate fatigue; commonly 5-7 days every 4-6 weeks, highly variable; usually cut volume more than intensity. | v1: deload = about half the sets (PER-05); placement by triggers or week 1 of the next cycle (PROPOSED); deloads every 4-6(7) weeks in practice (open question on his 12-week shape). v1.1: he decided deloads are never inside a block (R2-VOL-07); one recovery week sits between blocks. | Bell L et al. Integrating Deloading into Strength and Physique Sports Training Programmes: An International Delphi Consensus Approach. Sports Med Open 2023 (definition); Bell L, Nolan D, Immonen V, et al. Front Sports Act Living 2022, qualitative interviews with 18 strength/physique coaches (deloads typically every 4-6 weeks, about 1 week long; range from every few weeks to 6-12 weeks). | https://www.ncbi.nlm.nih.gov/pmc/articles/PMC10511399/ |
| SCI_RP | Volume landmarks (practitioner model) | MEV -> MAV -> MRV; mesocycles of 4-6 weeks start near MEV, add sets weekly, deload at ~50 % volume when MRV is reached. Landmarks from RP's own muscle guides (practitioner, not peer-reviewed; intermediate lifters): chest MEV 4-6 / MAV 6-16 / MRV 16-24; quads 4-6 / 6-14 / 14-18; biceps 8-10 / 14-20 / 20-26; triceps 4-6 / 6-16 / 16-20; calves 4-6 / 6-16 / 16-24; specialisation (MRV*P) up to 24-35. Back values are published only as an image and were not extracted. | v1: his 12-week shape (acclimation -> drive -> hardest, then deload or maintenance) is the RP mesocycle logic; RP adds ~1 set/muscle/week, his person-level 3/5/7 % adds ~0.5-1.1 set/week at 15-20 sets (12_volume_algorithm_v1 §2.5); the v0 'INFERRED governor' comparison is retired. v1.1: one planned stairway for everyone (3 % then 5 %, λ-scaled: about 0.4-0.9 set a week for an L2 big muscle going 15 -> 22), moved only by the optional check-in; a recovery week between blocks, never a deload inside one (R2-PER-03/04, R2-VOL-03, R2-VOL-07). | Israetel M et al. (Renaissance Periodization) muscle training-tips guides at rpstrength.com (chest, quad, biceps, triceps, calves); framework summary at arvo.guru (which gives no per-muscle numbers). | https://rpstrength.com/blogs/articles/biceps-hypertrophy-training-tips |
| SCI_MAINT | In-season maintenance | Strength/size maintained for up to 32 weeks with as little as 1 session/week and 1 set/exercise if relative load (intensity) is maintained; 1 strength session/week maintained strength, sprint and jump in pro soccer for 12 weeks, every second week did not. | v1: in-season 2 days/week, low volume, keep intensity (COACH-ANSWER PER-08, UNI-10) now agrees with this evidence. | Spiering BA et al. J Strength Cond Res 2021; Ronnestad BR et al. J Strength Cond Res 2011; Cuthbert M et al. Sports Med 2021 (frequency can be distributed in-season). | https://consensus.app/papers/details/7e387b40e4865f3684bafd4344100e16/?utm_source=claude_desktop |
| SCI_CONCURRENT | Concurrent training | Aerobic + strength does not blunt hypertrophy or maximal strength, but explosive strength gains are attenuated, mostly when both are in the same session. | coach puts steady cardio on separate days (Wed/Sat) and short buy-outs at the END of sessions; CROSSFIT power months drop strength/resistance. | Schumann M et al. Compatibility of Concurrent Aerobic and Strength Training for Skeletal Muscle Size and Function: An Updated Systematic Review and Meta-Analysis. Sports Med 2021. | https://consensus.app/papers/details/1bee3a2b771c58eebf6a1f079729279d/?utm_source=claude_desktop |
| SCI_CONTRAST | Complex / contrast / French contrast | Complex training improves sprint (5-20 m), COD and CMJ more than resistance training alone (low certainty); French contrast meta: large sprint and moderate jump effects, not max strength; >= 7-8 weeks and ~3 sessions/week optimise effects. | v1: contrast / French contrast and complexes for intermediate+ athletes in the off-season only (COACH-ANSWER ATH-12), so they sit in the off-season drive and hardest blocks (8.2.2), not pre-season. | Thapa RK et al. J Sports Sci 2024; Cormier P et al. J Strength Cond Res 2020; Zhao ZR et al. Front Physiol 2025. | https://consensus.app/papers/details/18eba14dc25a5fd784513583456f1593/?utm_source=claude_desktop |
| SCI_PLYO_VOL | Plyometric volume | Common guideline: ~80-100 foot contacts/session beginner, 100-120 intermediate, 120-140 advanced (off-season). The PMC7873906 table is a study protocol (72 -> 126 contacts/session over 8 weeks in female basketball players, judged insufficient by its authors), not a ceiling; no source here supports a 200/400-contacts-per-session limit. | the coach's weekly contacts (32-324/week) sit well below per-session ceilings because plyos are spread over 2-4 short primers; low-amplitude reactive contacts can be much higher (squirrel jumps, rope). | NSCA Essentials (CSCS ch. 18) guideline as summarised by PT Pioneer; PMC7873906 (female basketball plyometric study, table 3). | https://www.ptpioneer.com/personal-training/certifications/nsca-cscs/cscs-chapter-18/ |
| SCI_ACWR | Load spikes | Acute:chronic workload ratio 0.8-1.3 described as a 'sweet spot'; spikes >1.5 associated with injury in team sports (the ratio is methodologically debated). | guardrail on week-to-week contact/sprint increases (<= ~10-15 %); the coach's 3/5/7 % is far inside it, his +41 % boxing wk3 jump is a phase change from 0 that should be preceded by base work. | Gabbett TJ. Br J Sports Med 2016 (summarised by Catapult / Vitruve). | https://playertekplus.catapultsports.com/hc/en-us/articles/7443928371471 |
| SCI_CONJ | Conjugate method | Max-effort (90-100 %) and dynamic-effort (Westside: roughly 50-60 % bar weight plus ~25 % band/chain tension, moved fast) days in the same week, rotating ME exercises every 1-3 weeks, with repeated-effort accessories. | STRENGTH-8 is conjugate in structure ('conjugate style training') but the coach adds his own grammar (the work / accessory / nuance / survival; KD-HD alternation; plyo row labelled 'the work' on the speed day in the CONJUGATE draft). v1: 'I don't need it to be conjugate' (PER-01); band/chain tension out of scope (EQ-12). | Westside Barbell 'Conjugate Method' (practitioner source); Zatsiorsky & Kraemer, Science and Practice of Strength Training. | https://www.westside-barbell.com/pages/conjugate-method |
| SCI_LP_DUP_HYP | Linear vs undulating (hypertrophy) | 13 studies: linear and daily undulating periodization gave similar muscle growth (d = -0.02, 95 % CI -0.25 to 0.21). | Smooth weekly increases for hypertrophy (PER-10) are as good as fancier schemes; volume and effort matter more than the model. Supports the simple 12-week shape. | Grgic J, Mikulic P, Podnar H, Pedisic Z. Effects of linear and daily undulating periodized resistance training programs on measures of muscle hypertrophy: a systematic review and meta-analysis. PeerJ 2017;5:e3695. | https://www.ncbi.nlm.nih.gov/pmc/articles/PMC5571788/ |
| SCI_LP_UP_STR | Linear vs undulating (strength) | 17 studies, 510 people: no difference between linear and undulating periodization for upper- or lower-body strength. | The confirmed 2-week %-steps for strength (PER-09) are a valid choice, not the only one; the generator can keep his template. | Harries SK, Lubans DR, Callister R. Systematic review and meta-analysis of linear and undulating periodized resistance training programs on muscular strength. J Strength Cond Res 2015;29(4). | https://pubmed.ncbi.nlm.nih.gov/25268290/ |
| SCI_PER_NONPER | Periodized vs non-periodized (strength) | 18 studies: periodized plans improved 1RM more than non-periodized plans (ES 0.43); undulating programs and higher frequency/longer studies favoured larger gains. | Planned variation between blocks (PER-02) and planned phases (PER-01) are worth having for strength; the shape itself is less important than having one. | Williams TD, Tolusso DV, Fedewa MV, Esco MR. Comparison of periodized and non-periodized resistance training on maximal strength: a meta-analysis. Sports Med 2017;47(10). | https://www.springermedicine.com/comparison-of-periodized-and-non-periodized-resistance-training-/22255106 |
| SCI_BLOCK_DUP | Block vs daily undulating (athletes) | 10 weeks in Division I track and field athletes: no significant difference; block training produced similar strength with less volume (higher 'efficiency'). | Athlete off-season blocks (VOL 1 -> 2 -> 3, PER-11) are a sound way to organise athletes. | Painter KB et al. Strength gains: block versus daily undulating periodization weight training among track and field athletes. Int J Sports Physiol Perform 2012;7(2). | https://lida.sport-iat.de/ta/Record/4026554?lng=en |
| SCI_DAMAGE | Early weeks of a new program | Muscle damage is highest in week 1, lower by week 3 and minimal by week 10; protein synthesis tracks muscle growth only once damage has dropped (weeks 3 and 10, not week 1). | Grounds his 2-4 'getting used to the movements' weeks: early volume mostly pays for repair, so the first steps are kept small. v1.1: there is no separate acclimation cap; the first-half stairway steps (3 %, λ-scaled) do this job (R2-PER-03, R2-PER-04). | Damas F et al. Resistance training-induced changes in integrated myofibrillar protein synthesis are related to hypertrophy only after attenuation of muscle damage. J Physiol 2016;594(18):5209-5222. | https://pubmed.ncbi.nlm.nih.gov/27219125/ |
| SCI_RBE | Repeated bout effect | A first exposure to a new exercise protects against damage on later bouts; protection can last weeks to months and can be induced by submaximal or small doses. | Supports a gentle acclimation. v1 also read it as support for an 8-week plan 'starting hard'; v1.1: that is retired (R2-PER-03 NOT RIGHT): every block, 8-week included, starts at the level start with small first steps, which is what the repeated-bout effect favours; after a layoff, use the 12-week acclimation (L1 weeks 1-4). | Nosaka K, Aoki MS. Repeated bout effect: research update and future perspective. Brazilian J Biomotricity 2011; McHugh MP. Recent advances in the understanding of the repeated bout effect. Scand J Med Sci Sports 2003. | https://ro.ecu.edu.au/ecuworks2011/697 |
| SCI_PERIODIC | Planned breaks between blocks | Three 6-week training blocks separated by 3-week breaks gave similar muscle growth to 24 weeks of continuous training; growth rate after each break returned to the early-training rate. | Maintenance/vacation blocks and repeated cycles do not cost long-term growth (PER-01); returning at the previous start after a maintenance block is safe. | Ogasawara R, Yasuda T, Ishii N, Abe T. Comparison of muscle hypertrophy following 6-month of continuous and periodic strength training. Eur J Appl Physiol 2013. | https://link.springer.com/article/10.1007/s00421-012-2511-9 |
| SCI_DETRAIN | Training cessation | Meta-analysis of 103 studies: strength losses grow with time off; maximal strength was mostly unaffected for up to ~4 weeks (trivial effects), losses accelerate after that and are larger in people over 65 and in inactive people. | A 1-2-week vacation (PER-01) costs little; older clients keep the high end of maintenance (>= 70 %). | Bosquet L et al. Effect of training cessation on muscular performance: a meta-analysis. Scand J Med Sci Sports 2013 (summary: Stronger by Science, 'Detraining'). | https://www.strongerbyscience.com/detraining/ |
| SCI_DEFICIT | Training in a calorie deficit | Resistance training in an energy deficit (RCTs of 3+ weeks) blunted lean-mass gains; in the meta-regression a deficit of about 500 kcal/day predicted no lean-mass gain on average, while strength gains were not impaired. | Fat-loss plans and the yearly Q1 cut hold volume near the level start (rate <= 3 %) and keep loads heavy; growth volume belongs to Q4 (PROPOSED). v1.1: the year's Q1 cut keeps sets at the starting level (R2-PER-01, approved); standalone fat-loss blocks use the standard stairway on the x0.8 start (12 v1.1); the v1 deficit cap is retired. | Murphy C, Koehler K. Energy deficiency impairs resistance training gains in lean mass but not strength: a meta-analysis and meta-regression. Scand J Med Sci Sports 2022. | https://lida.sport-iat.de/ta/Record/4071991 |
| SCI_HOLIDAY | Holiday season | Adults gain about 0.4-0.9 kg over the holiday season; the gain is small but is usually not lost later and is a large share of yearly weight gain. | Automatic holiday maintenance (PER-01) keeps the habit going at low volume instead of stopping. | Yanovski JA et al. A prospective study of holiday weight gain. N Engl J Med 2000; Diaz-Zavala RG et al. Effect of the holiday season on weight gain: a narrative review. J Obes 2017. | https://www.ncbi.nlm.nih.gov/pmc/articles/PMC5514330/ |
| SCI_TAPER_PL | Peaking for a test | Eleven elite raw powerlifters (interviews) peaked volume 5.2 +/- 1.7 weeks and intensity 1.9 +/- 0.8 weeks before competition, cut volume by 58.9 +/- 8.4 % in the taper while keeping intensity, and trained last 3.7 +/- 1.6 days out. | Test week: reduce the rest of that week's volume and keep load (PER-07, PROPOSED dose); strength 'hardest' weeks peak intensity, not volume. | Pritchard HJ et al. Tapering practices of New Zealand's elite raw powerlifters. J Strength Cond Res 2016;30(7). | https://pubmed.ncbi.nlm.nih.gov/26670988/ |
| SCI_DELOAD2 | Deload practice | Survey of 246 strength and physique athletes: deload every 5.6 +/- 2.3 weeks for 6.4 +/- 1.7 days, 79 % cut sets; a 1-week break in the middle of a 9-week program did not change growth and slightly reduced strength gains. | Most lifters deload more often than once per 12 weeks: the triggered deload (D6) will fire for many clients; the 'half the sets' dose (PER-05) matches practice. v1.1: no triggered deload any more (R2-VOL-07); the signals only offer 'cancel the block'; most lifters deload more often than every 12-13 weeks, so the 2 -> 11 stair, holds and the cancel option carry that load. | Rogerson D, Bell L et al. Sports Med Open 2024; Coleman M et al. PeerJ 2024 (carried from 12_volume_algorithm_v1 §2.7). | https://pmc.ncbi.nlm.nih.gov/articles/PMC10948666/ |
| SCI_MAINT2 | Maintenance dose | After 16 weeks of training, 1/3 of the dose kept (and in young adults slightly grew) muscle size for 32 weeks; 1/9 kept size in the young; older adults needed more. | His 50-70 % maintenance volume is well above the minimum; older clients >= 70 % (PER-01, PROPOSED floor). | Bickel CS, Cross JM, Bamman MM. Exercise dosing to retain resistance training adaptations in young and older adults. Med Sci Sports Exerc 2011 (carried from 12_volume_algorithm_v1 §2.4). | https://pubmed.ncbi.nlm.nih.gov/21131862/ |
| SCI_RESPONSIVE | Responsive planning | Classic periodization models rest on tradition more than evidence; responses vary widely between people, so plans should be responsive systems that adjust to the individual. A review of 42 periodization trials found mostly short studies of strength only, none longer than about 9 months, and individual responses ignored. | Supports the week-by-week mode (GEN-05): the 12-week shape is a default. v1.1: the readiness-based rate is retired; the optional check-in (effort, completion, pain) moves the step, and with no check-in the planned stairway runs unchanged (R2-VOL-01, R2-VOL-03, R2-GEN-04). | Kiely J. Periodization paradigms in the 21st century: evidence-led or tradition-driven? Int J Sports Physiol Perform 2012;7(3):242-250; Afonso J et al. Is empirical research on periodization trustworthy? J Sports Sci Med 2017. | https://pure.ul.ie/en/publications/periodization-paradigms-in-the-21st-century-evidence-led-or-tradi/ |
| SCI_STEP | Step and wave loading | Practitioner models describe three ways to raise loads: straight-line, stepped (a jump then a hold) and wave-like (rise, then a lighter microcycle); the stepped method lets athletes master higher loads (Bompa). | Steps and waves for fight/competition prep (PER-10). No controlled study shows steps beat smooth increases for hypertrophy (see SCI_LP_DUP_HYP), so smooth stays the default for hypertrophy/general. | Bompa TO. Theory and Methodology of Training (stepped vs rectilinear vs wave loading), summarised by Stadion Books. | https://stadionbooks.com/?p=3145 |
| SCI_RETRAIN | Detraining and retraining ('muscle memory') | After 20 weeks off, size returned to baseline but about 60 % of the strength gain remained (motor learning); older men regained their 1RM in under 8 weeks after 12 weeks off; regaining lost size and strength usually takes about half as long as the time off. | His layoff rule (PRG-05): after 6-12+ months off the body is treated as a beginner (L1 volume) while skills come back fast (exercise level kept); ex-pros stay at L1 only briefly. The 12-week acclimation (4 weeks for returning clients) fits. | Psilander N et al. Effects of training, detraining, and retraining on strength, hypertrophy, and myonuclear number in human skeletal muscle. J Appl Physiol 2019; Blocquiaux S et al. The effect of resistance training, detraining and retraining on muscle strength and power, myofibre size, satellite cells and myonuclei in older men. Exp Gerontol 2020; summary: Stronger by Science 'Detraining'. | https://consensus.app/papers/details/ab21739bd6275682b6665a0030fac250/?utm_source=claude_desktop |
| SCI_SHORT_BREAK | Two weeks off | Resistance-trained men kept their leg-press strength and lean mass after 2 weeks of detraining. | A 1-2-week vacation (PER-01) inside a maintenance block costs little: ~50 % with what is available, or full rest, then return at the previous start (D5, PROPOSED). | Hwang PS et al. Resistance training-induced elevations in muscular strength in trained men are maintained after 2 weeks of detraining and not differentially affected by whey protein supplementation. J Strength Cond Res 2017. | https://baylor-ir.tdl.org/handle/2104/9462 |
| SCI_OLY_REPS | Olympic lifts: reps and load | Common power guidance: multiple-effort power work at 75-85 % 1RM for 3-5 reps per set, single-effort at 80-90 % for 1-2 reps, 3-5 sets with 2-5 min rest; pulling derivatives (no catch) allow heavier loads and similar or greater force and velocity than catch variants. | Science check he asked for in PER-09: his 4 x 6 @ 80-85 % and 4 x 4 @ 90 % sit close to this guidance; 4 x 8 @ 75 % is more reps per set than usual for full catch lifts (technique fades late in long sets). Fine for DB/KB and hang-pull variants; for full lifts a 3-5-rep option is PROPOSED (round-2 question). v1.1: approved (R2-ATH-05): full lifts 3-5 reps per set; DB/KB and pull variants keep 4 x 8. | NSCA Essentials of Strength Training and Conditioning, power load assignment (summary); Suchomel TJ, Comfort P, Lake JP. Enhancing the force-velocity profile of athletes using weightlifting derivatives. Strength Cond J 2017. | https://eprints.chi.ac.uk/2332/ |
| SCI_SWIM_TAPER | Swimming taper | Meta-analysis (endurance athletes incl. swimmers): the best taper lasts about 8-14 days with a 41-60 % volume cut and intensity and frequency kept. A 2024 randomized trial in competitive swimmers: a 2-week progressive taper (-30 % then -50 % volume, sprint intensity kept) improved 50 m front-crawl time by 3.5 % (control 1.4 %) and lowered total mood disturbance by 14 %. | Swimmers' championship meets get a 2-week dryland taper lined up with the pool taper (PROPOSED, 14.3 #6); his 1-2-week pre-season taper (R2-PER-06) sits inside the evidence. | Bosquet L et al. Med Sci Sports Exerc 2007; Aouani H, Amara S, Rebai H, Barbosa TM, van den Tillaar R. Optimizing performance and mood state in competitive swimmers through tapering strategies. Front Psychol 2024;15:1307675. | https://www.frontiersin.org/journals/psychology/articles/10.3389/fpsyg.2024.1307675/full |
| SCI_HYROX | HYROX demands | HYROX = eight 1-km runs, each followed by a station (SkiErg 1000 m, sled push 50 m, sled pull 50 m, burpee broad jumps 80 m, row 1000 m, farmers carry 200 m, sandbag lunges 100 m, wall balls 100); performance depends on aerobic capacity (the foundation), anaerobic power, local muscular endurance and maximal strength; sport-specific research is still limited. | Gen-pop 'stay athletic and active' HYROX overlay: aerobic 3-4 sessions, station circuits as density work, a resistance stairway for legs, pulling and carries; 1-week taper before a race (PROPOSED). | Davids CJ. A performance analysis of HYROX: a review of the physiologic, mechanical, and technical demands. Strength Cond J 2026;48(1):88-100. | https://lida.sport-iat.de/ta/Record/4092970?lng=en |
| SCI_PICKLEBALL | Pickleball participation | 24.3 million Americans played pickleball in 2025 (about 4.2 million in 2020); +171.8 % from 2022 to 2025, the fastest-growing sport in the US; strong engagement among adults 25-44 and players 65+. | Supports a gen-pop 'stay athletic and active' path with pickleball (coach request) and the 60+ rules for many players (R2-ATH-08). | Sports & Fitness Industry Association (SFIA). U.S. Pickleball Participation (2025 data). | https://sfia.org/research/u-s-pickleball-participation/ |
| SCI_RM_TEST | Submaximal strength testing | In 70 adults aged 18-69 of mixed training experience, a 5RM predicted the 1RM best (R2 0.993 bench press, 0.974 leg press), better than 10RM or 20RM tests. | Supports his rule that people starting from zero test a 5RM (or 3RM) and estimate the max instead of testing a 1RM (R2-PER-07). | Reynolds JM, Gordon TJ, Robergs RA. Prediction of one repetition maximum strength from multiple repetition maximum testing and anthropometry. J Strength Cond Res 2006;20(3):584-592. | https://www.unm.edu/~rrobergs/478RMStrengthPrediction.pdf |

**Where the coach and the literature agree (v1).**
* Volume ramps gradually inside a block, with a hard finish and planned recovery (PER-01; RP, Pelland, Enes).
* Deload = about half the sets, keep the exercises (PER-05; Bell 2023, Rogerson 2024).
* Maintenance at 50-70 % keeps muscle and strength for weeks (PER-01; Bickel 2011, Spiering 2021, Bosquet 2013).
* The weekly rate depends on the person's fatigue and life (VOL-05; Bartholomew 2008, Stults-Kolehmainen 2014, Knowles 2018 in 12_vol). v1.1: retired as a generator input: no lifestyle questions anywhere (R2-GEN-04); the step comes from effort, completion and pain on the optional check-in, or the planned stairway without one (R2-VOL-03).
* 10 %/week is too much (UNI-05; RP's ~+1 set/muscle/week, Enes 2023).
* In-season: low volume, keep intensity (PER-08, UNI-10; Rønnestad 2011, Spiering 2021).
* Steady cardio kept away from power work; contrast work in the off-season (ATH-12; Thapa 2024, Cormier 2020).
* Rep progression for small muscles (VOL-11; Plotkin 2022).

**Added in v1.1 (round 2).**
* A gradual stairway with the hardest weeks last, then recovery (R2-PER-03/04; RP mesocycle logic, Grgic 2017, Damas 2016).
* Tests from zero at a 5RM or 80-90 % effort instead of a 1RM (R2-PER-07; Reynolds 2006).
* Pre-season at ~60 % with a 1-2-week taper (R2-PER-06; Bosquet 2007, Vachon 2020); swimming championship tapers of about 2 weeks (Aouani 2024).
* HYROX and pickleball as gen-pop athletic options (COACH-R2 REQ; Davids 2026, SFIA 2025).

**The two influences the coach names, as they show up in his periodization (v1).**
* *Dr. Mike Israetel (Renaissance Periodization)*: start a block near the low end of productive volume, add sets across the block, deload, repeat; isolations can go to failure while compounds keep reps in reserve. His v1 12-week shape (acclimation → drive → hardest, then a deload or maintenance and a slightly higher next cycle) is this logic. The difference: RP ties the set additions to soreness/pump/performance per muscle; he ties one rate to the person (VOL-05). v1.1: one planned stairway for everyone, moved only by the optional check-in (R2-PER-03/04, R2-VOL-03).
* *Dr. Pat Davidson* (A Coach's Guide to Optimizing Movement): same pattern, different position or variable. His 'zones' are rotation biases: vertical positions (arms down or overhead, deep squat) bias external rotation; horizontal positions (hands in front, knee at hip height) are zone 2, internal-rotation biased and compressive (COACH-ANSWER CAT-10). Load position sets the exercise level (CAT-04). The zones do not apply to plyos; the levels are still theoretical (CAT-05). Between blocks he changes one Davidson variable at a time (stance, load position, contra/ipsi, end range) while the slot stays (PER-02).

**Where they still pull apart (decisions for the coach).**
* **Deload frequency**: practitioners deload about every 5-6 weeks (Rogerson 2024); he decided that no deload or maintenance week ever goes inside a block (R2-VOL-07). His blocks carry that load through the 2 -> 11 stair (easy first weeks), holds, the cancel option and the recovery week between blocks; Coleman 2024 found a mid-program week off did not improve growth.
* **Hard work while cutting (yearly Q1)**: decided: sets stay at the starting level in the Q1 cut (R2-PER-01, approved), in line with Murphy & Koehler 2022 (a deficit blunts muscle gain, not strength).
* **The boxer's week-8 peak** is not followed by a written taper; with a fight date the evidence favours a 1-2-week taper (Bosquet 2007).

**Sources used for section 12.**
* [Pelland 2025](https://consensus.app/papers/details/28976bf04deb591980a56525e2ba77d1/?utm_source=claude_desktop) · [Schoenfeld 2017](https://consensus.app/papers/details/0fec06fa365f5224b7c53cd5acdd007d/?utm_source=claude_desktop) · [Baz-Valle 2022](https://consensus.app/papers/details/d82bc2b70af65cea97f69cdebc6ab92a/?utm_source=claude_desktop) · [Robinson 2024](https://consensus.app/papers/details/57d3863cb2ff54ce95ae91cd5c4e2e35/?utm_source=claude_desktop) · [Currier 2023](https://consensus.app/papers/details/d7159f4e02555ec4bfbe3a35124223f4/?utm_source=claude_desktop)
* [Plotkin 2022](https://peerj.com/articles/14142) · [Chaves 2024](https://consensus.app/papers/details/42c71acb7eab533b82745124fe669ce7/?utm_source=claude_desktop) · [Moesgaard 2022](https://pubmed.ncbi.nlm.nih.gov/35044672/)
* [Bosquet 2007](https://consensus.app/papers/details/e28eb39cfe0452a0ac57e1efb43b4e48/?utm_source=claude_desktop) · [Wang 2023](https://consensus.app/papers/details/9af705b8f35a5b738367d03130a3113b/?utm_source=claude_desktop) · [Mujika & Padilla 2003](https://consensus.app/papers/details/0712459223e657d78ecb3d7e60714cbc/?utm_source=claude_desktop) · [Vachon 2020](https://consensus.app/papers/details/5c8daf1e0a2e538f8bfa908ce362b76e/?utm_source=claude_desktop)
* [Bell 2023 Delphi](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC10511399/) · [Bell 2022 coach interviews on deloading](https://www.frontiersin.org/journals/sports-and-active-living/articles/10.3389/fspor.2022.1073223/full) · [RP framework summary (no per-muscle numbers)](https://arvo.guru/resources/methods/rp-training) · RP muscle guides: [chest](https://rpstrength.com/blogs/articles/chest-hypertrophy-training-tips), [quads](https://rpstrength.com/blogs/articles/quad-hypertrophy-training-tips), [biceps](https://rpstrength.com/blogs/articles/biceps-hypertrophy-training-tips), [triceps](https://rpstrength.com/blogs/articles/triceps-hypertrophy-training-tips), [calves](https://rpstrength.com/blogs/articles/calves-hypertrophy-training-tips)
* [Spiering 2021](https://consensus.app/papers/details/7e387b40e4865f3684bafd4344100e16/?utm_source=claude_desktop) · [Rønnestad 2011](https://consensus.app/papers/details/b6095a7a2934569e88e8a7d24397a9e1/?utm_source=claude_desktop) · [Cuthbert 2021](https://consensus.app/papers/details/908afb24a4445b8e876b9a317ff307c9/?utm_source=claude_desktop)
* [Schumann 2021](https://consensus.app/papers/details/1bee3a2b771c58eebf6a1f079729279d/?utm_source=claude_desktop) · [Thapa 2024](https://consensus.app/papers/details/18eba14dc25a5fd784513583456f1593/?utm_source=claude_desktop) · [Cormier 2020](https://consensus.app/papers/details/4d8e07d938015cd3987bc44f4cf7029c/?utm_source=claude_desktop) · [Zhao 2025](https://consensus.app/papers/details/beb707a7dcee5a338b7186c1de6f1264/?utm_source=claude_desktop)
* [Block periodization / Issurin summary](https://academy.sportlyzer.com/wiki/block-periodization) · [Westside conjugate method](https://www.westside-barbell.com/pages/conjugate-method) · [NSCA plyometric contact guideline (CSCS ch. 18)](https://www.ptpioneer.com/personal-training/certifications/nsca-cscs/cscs-chapter-18/) · [Plyometric study protocol table (PMC7873906)](https://pmc.ncbi.nlm.nih.gov/articles/PMC7873906/table/T3) · [RTS / Tuchscherer RPE chart](https://fitnessvolt.com/rpe-training/guides/tuchscherer-chart-explained) · [ACWR summary (Catapult)](https://playertekplus.catapultsports.com/hc/en-us/articles/7443928371471)
* v1: [Grgic 2017](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC5571788/) · [Harries 2015](https://pubmed.ncbi.nlm.nih.gov/25268290/) · [Williams 2017](https://www.springermedicine.com/comparison-of-periodized-and-non-periodized-resistance-training-/22255106) · [Painter 2012](https://lida.sport-iat.de/ta/Record/4026554?lng=en) · [Damas 2016](https://pubmed.ncbi.nlm.nih.gov/27219125/) · [Nosaka & Aoki 2011 (repeated bout effect)](https://ro.ecu.edu.au/ecuworks2011/697) · [Ogasawara 2013](https://link.springer.com/article/10.1007/s00421-012-2511-9) · [Bosquet 2013 (summary)](https://www.strongerbyscience.com/detraining/) · [Murphy & Koehler 2022](https://lida.sport-iat.de/ta/Record/4071991) · [Diaz-Zavala 2017 holiday review](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC5514330/) · [Pritchard 2016](https://pubmed.ncbi.nlm.nih.gov/26670988/) · [Rogerson 2024](https://pmc.ncbi.nlm.nih.gov/articles/PMC10948666/) · [Bickel 2011](https://pubmed.ncbi.nlm.nih.gov/21131862/) · [Kiely 2012](https://pure.ul.ie/en/publications/periodization-paradigms-in-the-21st-century-evidence-led-or-tradi/) · [Afonso 2017](https://jssm.org/jssm-16-27.xml-abst) · [Bompa step/wave loading (summary)](https://stadionbooks.com/?p=3145)
* v1 (added in the second v1 pass): [Psilander 2019](https://consensus.app/papers/details/ab21739bd6275682b6665a0030fac250/?utm_source=claude_desktop) · [Blocquiaux 2020](https://consensus.app/papers/details/feae82df195e5733bfc47e78cd9d2347/?utm_source=claude_desktop) · [Hwang 2017](https://baylor-ir.tdl.org/handle/2104/9462) · [Suchomel, Comfort & Lake 2017](https://eprints.chi.ac.uk/2332/) · [NSCA power load assignment (summary)](https://www.open.edu/openlearn/health-sports-psychology/training-speed-and-power-sport-and-fitness/content-section-3.3) · [Yanovski 2000 (NICHD release)](https://www.nichd.nih.gov/newsroom/releases/holidayweightgain) · [Issurin block durations (World Rugby summary)](https://passport.world.rugby/conditioning-for-rugby/advanced-conditioning-for-rugby-pre-level-2/programme-management-and-player-monitoring/periodisation-models/block-periodisation/)

* v1.1: [Aouani 2024 (swimming taper RCT)](https://www.frontiersin.org/journals/psychology/articles/10.3389/fpsyg.2024.1307675/full) · [Davids 2026 (HYROX review)](https://lida.sport-iat.de/ta/Record/4092970?lng=en) · [SFIA pickleball participation](https://sfia.org/research/u-s-pickleball-participation/) · [Reynolds 2006 (5RM -> 1RM)](https://www.unm.edu/~rrobergs/478RMStrengthPrediction.pdf)

*Paper search note (Consensus):* 3 searches left this month; resets to 30 on November 1st. Upgrade to Consensus Pro to get 500 searches per month, return 20 results per search instead of 10, and include more data like study design and key takeaways for every result.: https://consensus.app/pricing/?utm_source=claude_desktop

---

## 13. End-to-end generator logic (pseudo-code, v1.1)

```
generate_plan(client):                                   # v1.1 (round-2 answers applied)
  level  = level_from_experience(years, months_off, ex_pro)   # L1/L2/L3 (PRG-05)
  family = map_goal(goal)       # HYPERTROPHY | STRENGTH | FAT_LOSS | GENERAL (incl. 'stay athletic & active') | HYBRID | ATHLETE
  mode   = client.plan_mode     # C12 | C8 | MAINT(weeks chosen) | WBW | YEAR ; overlays PREP(date) | SEASON(season start, practice/game days)
  tests  = client.test_ticks    # strength / cardio / speed / jumps / body, or 'No need for testing' (R2-PER-07)
  # NO lifestyle inputs (R2-GEN-04): nothing below reads sleep, stress or job

  if SEASON: phases = season_calendar(start_date, season_start, practice_days, game_days)   # R2-GEN-05, R2-PER-06 (8.2.0)
  grid    = STAIRWAY_GRID[mode](level, q1_cut)   # q1_cut: year Q1 holds sets at the level start (R2-PER-01); week -> phase (ACCLIMATION/DRIVE/HARDEST), planned step, stair level 2..11, RIR, exercise block, RC stage
  overlay = FAMILY_OVERLAY[family]              # phase -> reps, effort, load, methods, laterality, conditioning, athletic content
  start   = volume_engine.start(level, family, season, priorities, pain)   # 12_volume_algorithm v1.1
  if previous_block == COMPLETED: start *= 1.05; cap += 1   (cap <= 25, priority 30)          # R2-VOL-06
  if previous_block == CANCELLED: start = previous_start                                  # R2-VOL-07
  if previous_block == COMPLETED and not maintenance_between: emit(RECOVERY_WEEK(half_sets(previous_last_week)))  # R2-VOL-07

  if tests: schedule baseline before the block or in week 1 (submax if no completed block)  # R2-PER-07
  for week in grid:                                        # never a deload or maintenance week inside (R2-VOL-07)
      step = week.planned_step                              # stairway 3 % -> 5 %, x lambda so the peak lands on the cap (R2-PER-03/04; 12 v1.1); 60+ <= 3 %
      if checkin(week-1) exists: step = read_against_stairway(step, effort, completion, pain)   # +2 pts if too easy (max 7 %), hold on 9/10, -1 set on that day after a 10, 'failed' = hold + lighter (R2-VOL-01 minus life, R2-VOL-02, R2-GEN-04)
      # no check-in -> planned step unchanged (R2-VOL-03)
      if under_half_sessions: repeat_week (or hold if a fixed date is ahead)     # R2-VOL-01
      T = min(cap, T * (1 + step)); place whole sets while T - current >= 1, total rise < 10 %   # VOL-06, VOL-07, UNI-05 (12 v1.1)
      if no set released: raise load/reps or step the RIR target                   # every week climbs (R2-PER-05)
      apply overlay[week.phase] -> reps, RIR, methods (MYO last isolation; supersets as a fatigue tool; contrast off-season int+)
      athletic block (own budget): plyo share start = end - 15 -> end (R2-ATH-01); RC stage by week (R2-ATH-03);
          Olympic up to 4 days, clean days = squat pattern, snatch days = hinge pattern, by RPE/speed unless a tested max (R2-ATH-04/05, R2-GEN-06);
          60+: Olympic lifts, plyos (ankle hops included) and depth jumps off by default, opt-in with the warning (R2-ATH-08)
      if season phase == IN: 2 days; game-heavy rule (R2-ATH-07); Olympic 2 x 3, none in heavy game weeks (R2-ATH-04)
      if week.exercise_block_boundary: one-detail changes (R2-LIB-01); level-up eligible slots (PER-06)
      if week.is_last and tests: end test replaces the top sets; reminders at start, -7 d, -1 d   # R2-PER-07
      if block_at_risk(checkins): ASK continue | cancel -> maintenance(weeks chosen) -> prompt -> new block   # R2-VOL-07, R2-PER-06
  after the block: END-OF-BLOCK CHOICE (next block | maintenance | change plan)                 # PROPOSED
```

---

## 14. Open questions

### 14.1 What happened to the v0 questions

| v0 # | Status | Answered by | Result |
|---|---|---|---|
| 1 | ANSWERED | VOL-04, VOL-05 | % of weekly sets; chosen by the person, not by muscle size. |
| 2 | ANSWERED | VOL-04, VOL-05, VOL-02, R2-VOL-06 | every muscle moves on the person's planned stairway (v1.1); a priority gets +4-6 sets on the start; non-priority <= 3 % while a priority runs (approved, R2-VOL-06). |
| 3 | ANSWERED | VOL-07, PER-10 | one set at a time to the first exercise, then the next; smooth for hypertrophy/general, steps for fight/competition prep. |
| 4 | ANSWERED | PER-01 | no 6-week loading plan; 4-6 weeks = maintenance/transition. |
| 5 | ANSWERED | PER-01, PER-10, R2-PER-03 | v1: 8 weeks = 4 adapt + 4 drive, starting hard; v1.1: replaced by the stairway from the level start (R2-PER-03 NOT RIGHT); the boxing peak is competition prep (steps & waves). |
| 6 | ANSWERED | PER-01, R2-VOL-07 | new 12-week shape and repeat one level higher; v1.1: never a deload inside a block, recovery week between blocks. |
| 7 | ANSWERED | PER-05 | about half the sets, same exercises, lighter or 3+ RIR, no buy-out or finisher. |
| 8 | ANSWERED | PER-05, PER-02, R2-VOL-07 | the same deload dose applies; new blocks change small variables; v1.1: placement decided: never inside a block, one recovery week between completed blocks (counting PROPOSED, 14.3 #2). |
| 9 | PARTLY | PER-09 | template confirmed; hardest-week % (~90/92/95) INFERRED from the RPE chart. |
| 10 | ANSWERED | PRG-04 | 'depends on whatever is needed' (decision rule: new question). |
| 11 | PARTLY | VOL-01, UNI-02, PER-08 | gym clients start by level; field athletes do not need size; the athlete level dial stays OBSERVED. |
| 12 | ANSWERED | PER-08, UNI-10 | 2 days/week, low volume, maintain strength and potentiation, minimal bilateral (reps PROPOSED). |
| 13 | ANSWERED | PER-09, ATH-10, R2-ATH-05, R2-GEN-06 | ramp confirmed; % from that lift's own 1RM, and only with a tested max (otherwise RPE); full lifts 3-5 reps per set. |
| 14 | OPEN | - | what follows the boxing week-8 peak / fight-camp length. |
| 15 | ANSWERED | CAT-10, CAT-11, R2-ATH-03 | Receive-Create stages RC1 Land -> RC2 Land & Go -> RC3 Repeat; weeks approved (12-week 1-3 / 4-7 / 8-12; 8-week 1-2 / 3-5 / 6-8). |
| 16 | ANSWERED | ATH-01, ATH-02, R2-ATH-01 | end-of-block plyo shares by sport approved; each block starts 15 points more ballistic. |
| 17 | ANSWERED | PER-06 | end of block, '8 - That was perfect' or easier, no pain. |
| 18 | ANSWERED | PER-02, PER-03 | fixed exercises per 4-6-week block; A/B only for variety seekers. |
| 19 | ANSWERED | VOL-10 | athletic sets never count toward muscles. |
| 20 | PARTLY | VOL-13, PER-01 | RIR 1-3 always; ramp inside the band PROPOSED. |
| 21 | ANSWERED | ATH-07 | 3 general/fat loss, 2 athletes in-season, 4 aesthetics + walks. |
| 22 | PARTLY | VOL-11, PER-05 | AMRAP is an option style; deload dose applies; AMRAP minutes still unknown. |
| 23 | ANSWERED | PRG-10 | FULL TIME = competitor, HALF TIME = class member (the <= 3-days rule stays INFERRED). |
| 24 | ANSWERED | VOL-02, UNI-01 | priority cap about 25-30; 40 sets 'way too much': the 32-35-set week is not copied. |
| 25 | OPEN | - | speed-lift label '1RIR' vs 'FAST RPE6 or about 60-70%' (bands are out: EQ-12). |
| 26 | ANSWERED | ORD-07 | the work / accessory / nuance / survival are defined by role. |
| 27 | ANSWERED | ATH-10 | everyone in athletic training; DB/KB snatches and cleans, hex-bar jumps, hang pulls without bumpers. |
| 28 | OPEN | - | HYBRID header vs written dose. |
| 29 | ANSWERED | PRG-07 | '-20' = a light set of 20 after the 12/10/8 pyramid (how it counts: new question). |
| 30 | OPEN | - | CrossFit MARCH/APRIL grid overlap vs the macro. |
| 31 | ANSWERED | EQ-12 | moot: no variable resistance for now. |

### 14.2 The round-2 questions of v1 and what he answered

| # | Round-2 question (v1 14.2) | Answered by | Result |
|---|---|---|---|
| 1 | Yearly quarters (Q2 months, which quarter cuts, Q3 maintenance level, Q1 volume) | R2-PER-01 RIGHT | Q2 = Apr-Jun; Q1 starts the cut with sets at the starting level; Q2 keeps losing fat while building a little muscle; Q3 about 70 %; for gen-pop 'stay in shape' |
| 2 | Calendar: fixed months or the user's own | R2-PER-02 RIGHT | user's hemisphere, own holiday weeks -> maintenance, fully tunable; athletes follow their season |
| 3 | Deloads in the 12-week shape | R2-VOL-07 RIGHT + text | never in the middle of a block; week 1 of the next cycle is a deload; can't complete -> cancel -> maintenance -> new block |
| 4 | Pre-season = season-change block? | R2-PER-06 RIGHT + text | yes, 4-6 weeks at ~60 % with speed/power and a 1-2-week taper; maintenance length chosen and extendable |
| 5 | '-20' light set: inside SETS or on top? | not asked in round 2 | OPEN |
| 6 | In-season Olympic lifts | R2-ATH-04 RIGHT + text | a light piece; Olympic lifts can run up to 4 days a week (cleans squat-like, snatches hinge-like) |
| 7 | Complexes in BASEBALL Block 2 and in fight camps | not asked in round 2 | OPEN |
| 8 | 'One level higher' for advanced lifters at the ceiling | R2-PER-05 RIGHT + text | heavier loads, intensifiers, rotating priority; '2 -> 11' is felt level, not sets |
| 9 | PRG-04 decision rule | not asked in round 2 | PROPOSED rule stays |
| 10 | Olympic ramp reps for full lifts | R2-ATH-05 RIGHT + text | 3-5 reps per set for full squat cleans/snatches; coach's eye on speed |
| 11 | 8-week: 4 + 4 or 3 + 5; 'start hard' | R2-PER-03 NOT RIGHT | a stairway like every plan; smaller steps first, a little bigger after halfway |
| 12 | Week-by-week check-in | R2-GEN-01 RIGHT | optional check-in; week-by-week needs it (life question removed by R2-GEN-04) |

### 14.3 New questions raised by the round-2 answers (v1.1)

Only genuinely new questions: each comes from two approved answers that pull against each other, or from the sports he added on 2026-10-08.

1. **A holiday or vacation week marked INSIDE a block that has already started: do we end the block there (your 'cancel -> maintenance -> new block' rule), or let that one week be a lighter 'hold' week and continue the block?** *(R2-PER-02, R2-VOL-07)* Proposal: The year planner always puts marked weeks between blocks. A week marked after a block started ends that block early (the user is warned and can remove the mark).
2. **After a finished 12-week block, the half-sets recovery week: is it an extra 13th week (the next block keeps all 12 weeks), or is it week 1 of the next 12?** *(R2-VOL-07)* Proposal: An extra week, so every block keeps its full stairway and a year quarter is 12 + 1 = 13 weeks.
3. **Check-ins in the first half of a block: your table gives +5 % for an on-target week and +7 % for an easy week, but the stairway wants small steps early. OK that the check-in reads against the stairway?** *(R2-VOL-01, R2-PER-03)* Proposal: On target = the planned step; too easy = the planned step + 2 points (max 7 %). First half: +3 % / +5 %; from the halfway point exactly your table (+5 % / +7 %).
4. **'Nobody needs less than 10 sets': does that floor also hold in maintenance phases? At 50-70 % a beginner maintains at 6-9 sets.** *(R2-VOL-06, PER-01)* Proposal: No: the floor is for training blocks; maintenance phases, pre-season and in-season keep your lower maintenance volume (50-70 %, round 1).
5. **Events for the general population (a HYROX race, a pickleball tournament, a 10K): should the user be able to set an event date?** *(COACH-R2 REQ)* Proposal: Yes: the last block ends at the event; its hardest weeks finish 1 week before, then a 1-week taper (about half the sets, same intensity). Without a date the plan runs the normal gen-pop stairway or year.
6. **Swimmers: should the gym (dryland) taper follow the swim coach's pool taper before the main championship meet, and how long should it be? Swim research favours about 2 weeks (8-14 days, volume -41-60 %, intensity kept).** *(COACH-R2 REQ, R2-PER-06)* Proposal: 2 weeks of dryland taper before the main championship meet, lined up with the pool taper; 1 week or none before smaller meets.

---

### Appendix · JSON field guide (`06_periodization.json`)

| Key | Contents |
|---|---|
| `_meta` | Version (v1.1), sources, status legend (incl. COACH-ANSWER, COACH-R2, COACH-R2 REQ and PROPOSED), definitions (training block, exercise block, stair level, planned step, ref sets), verification logs (`verification_log_v1_1`, `verification_log_v1_1_adversarial`). |
| `v1_1` | `changes` (with round-2 IDs), `resolutions_flagged`, `superseded_v1`, `v1_pending_status`, `round2_question_status`, `for_the_integrator`. |
| `v1` | the v1 change log, pending list and retired v0 rules (history). |
| `headline_rules` | Section 1.1 (v1.1 rules with tags); `retired_v1.headline_rules_v1` = the v1 list; `headline_rules_v0_observed` = the v0 R1-R13. |
| `observed_programs`, `observed_weekly_growth_rates` | Section 2 (unchanged; `v1_note` / `v1_1_note` where an answer reinterprets a program). |
| `levers`, `lever_priority_matrix` | Section 3; each lever has `v1_rule` and, where round 2 changed it, `v1_1_rule` (and `v1_1_name` for L12); the matrix has a `v1_1_note`. |
| `volume_governor` | v1.1 progression rules (stairway with λ, check-in steps, no deload inside a block, caps, floor) pointing to 12_volume_algorithm; `smooth_vs_steps`. |
| `intensity_model` | Effort by class, RPE->% chart, `effort_by_phase_v1_1`, `stair_level_display`, `strength_template_v1_1`, `strength_template_8wk_v1_1`, `olympic_v1_1` (frequency, pattern split, load by RPE unless tested, reps, in-season, older, youth), `rest`, `effort_v1_1_note`. |
| `deload_test_taper_rules`, `testing` | Section 6 (D1-D13 v1.1, each with its `v1` text), test catalogue, safety-from-zero rule, placement and reminders. |
| `plan_length_model` | Section 7: `modes`, `stairway`, `block_flow`, computed `grids` (C12/C8 by level with λ, target, planned RIR and stair level; 60+ variant; total-rise check), `maintenance`, `cycles`, `week_by_week`, `event_peak_genpop`, `yearly` (quarters, tuning, computed L2 year), `science_grounding`. |
| `family_overlays` | Section 8.1: family -> phase rows (v1.1) + `note_8_week` + `shared_rules_v1_1` (the section 8.0 rules shared by every family). |
| `skeletons` | v1.1 week rows: `C12_<FAMILY>`, `C8_<FAMILY>` (HYPERTROPHY, STRENGTH, FAT_LOSS, HYBRID, GENERAL), `MAINT_4`, `MAINT_6`, `ATHLETE_OFF_C12`, `ATHLETE_OFF_C8` (new), `ATHLETE_PRE_6`, `ATHLETE_PRE_4` (new), `ATHLETE_IN_2WK`, `ATHLETE_POST_2`, `PREP_8`. C12/C8 row fields: `week`, `phase` (L2), `phase_by_level`, `role`, `block` = `exercise_block`, `stair_level`, `planned_step_pct` by level (no check-in), `rate_cap_pct` / `rate_cap_pct_by_level` (most a check-in may give), `static_rate_pct` (alias of planned_step_pct), `rir`, `ref_sets`, `volume_index`, `overlay`, `events`, `rc_stage_if_athletic` (HYBRID/GENERAL), `main_lift` (STRENGTH), `status`, `tags`. |
| `skeleton_volume_index_summary` | Section 8.5: `V1_1_*` curves + observed programs. |
| `athlete` | `season_calendar_v1_1`, `season_phases_v1_1`, `off_season_12_v1_1`, `off_season_8_v1_1`, `sport_phase_modifiers` (approved numbers), `season_types_v1_1` (every popular US sport), `stay_athletic_active_v1_1`, `sample_plans_r2_gen_07`, `sport_phase_modifiers_v0_observed`, `level_dial`, `annual_planning`. |
| `quality_ladders` | Plyo, throws, Olympic, sprint/conditioning, aerobic, COD, core, squat loading, lunge variables; each with `v1` and, where changed, `v1_1` notes. |
| `athletic_quality_rules_v1_1`, `exercise_progression_rules_v1_1` | Sections 9.1 and 10.1. |
| `autoregulation`, `autoregulation_note`, `generator_pseudocode`, `science` | Sections 11-13 (v1.1). |
| `open_questions`, `open_questions_round2_status`, `open_questions_v0`, `open_questions_v0_status` | Section 14.3 (new v1.1 questions), 14.2 (round-2 status), 14.1 (v0). |
| `observed_reference_skeletons` | Section 8.3: the observed program rows. |
| `retired_v1` | Every v1 object replaced in v1.1 (headline rules, governor, effort by phase, strength/Olympic templates, deload rules, testing, plan-length model, overlays, skeletons, index summary, season tables, rule lists, autoregulation, pseudo-code, round-2 question list). |
| `retired_v0` | Every v0 object replaced in v1. |

---

## Verification log

### v1.1 (2026-10-08): round-2 answers applied

See the 'v1.1 verification log' at the end of the file. The v1 and v0 logs below are kept unchanged.

### v1 (2026-10-08): coach answers applied
* `coach_answers_full.md` (CAT-01 … FIX-04; 138 of 140 answered, LIB-10 and LIB-12 unanswered) and `coach_answers.md` were read in full before editing. Every v1 rule cites its question ID; PER-01 is transcribed, not paraphrased, in section 7.
* Alignment with `12_volume_algorithm_v1.md` / `.json` was checked for: starts and caps (L1 10/14, L2 15/22, L3 20/25), acclimation <= 3 %, 8-week x1.10 and <= 5 %, maintenance factors 0.5/0.6/0.7 and older floor 0.7, cycles x1.05 / cap +1 (example 15/22 → 16/23 → 17/24 → 18/25 reproduced), deload dose and triggers, yearly quarters, tests, plyo stages, counting.
* Curves were computed with the team venv (`.venv/bin/python`) by `p06r2/curves.py` in the session scratchpad (output `curves_out.json`), using the engine's bank rule (bank += rate x current sets; release whole sets at 1.0; stop at the cap). Spot check L2 12-week: 15 / 15 / 15 / 16 / 17 / 18 / 19 / 20 / 21 / 22 / 22 / 22.
* Research for the new shapes was searched and fetched on 2026-10-08 (Grgic 2017, Harries 2015, Williams 2017, Painter 2012, Damas 2016, repeated-bout reviews, Ogasawara 2013, Bosquet 2013 via a summary, Murphy & Koehler 2022, Yanovski 2000 / Diaz-Zavala 2017, Pritchard 2016, Kiely 2012, Afonso 2017, Bompa via a summary). Rogerson 2024, Coleman 2024 and Bickel 2011 are carried from 12_volume_algorithm_v1. Page numbers were left out where they could not be confirmed.
* Observed sections (2, 3.1 columns 3-8, 5.1, 5.3, 8.2.3-8.2.4, 8.3, 9.2, 10.2) keep the v0 text and numbers; only titles, the 'JUSTICE LEAGUE' program name (ATH-13) and v1 notes changed. The AESTHETICS-12 rep strings were re-read in `dumps/MASTER_MODEL/04_NOT_DONE_4_TRACKS_PROGRAMMING.txt` (O31:Z33) for the PRG-07 note.
* Second v1 pass (same day): the whole draft was re-read against `coach_answers_full.md` and `12_volume_algorithm_v1.md`. Fixed: change #2 now separates the coach's deload dose (PER-05) from the PROPOSED placement; lever-matrix cells that still showed v0 defaults (A/B and conjugate variation, mid-block tier promotion, aerobic counts, pre-season sets, hypertrophy methods) now carry the v1 rule and its ID; the off-season Olympic column now runs his 4-week ramp once per block (technique block first); the Murphy & Koehler 2022 and Pritchard 2016 numbers were corrected to the published values; v0 science 'maps to' cells that cited retired rules (non-focus ceiling 20, INFERRED governor, pre-season complexes, 40-rep isolation ladder) were updated; two basis lines pointing at retired v0 rules were rewritten.
* Every v1 citation was re-checked by web search on 2026-10-08: Grgic 2017 (13 studies, d = -0.02, 95 % CI -0.25 to 0.21), Harries 2015 (17 studies, 510 people), Williams 2017 (18 studies, ES 0.43, 95 % CI 0.27-0.58), Painter 2012, Damas 2016, Ogasawara 2013, Bosquet 2013 (trivial losses up to 28 days; g 0.76 in 65+ vs 0.31 younger, via SbS summary), Murphy & Koehler 2022, Yanovski 2000 (+0.37 kg, not reversed) / Diaz-Zavala 2017 (0.4-0.9 kg), Pritchard 2016, Kiely 2012, Afonso 2017 (42 trials, none over ~9 months), Issurin block durations. Added after the check: Psilander 2019 and Blocquiaux 2020 (retraining), Hwang 2017 (2 weeks off), NSCA power load guidance and Suchomel 2017 (the PER-09 science check).
* Built by `p06r2/build_v1.py` from the v0 files (backed up as `p06r2/v0_06_periodization.md` / `.json`). No Google Sheet was opened for writing or modified.

### v0 passes (kept)

An adversarial fact-check (2026-10-07) checked every OBSERVED claim in this document against the raw dumps (`dumps/MASTER_MODEL`, `dumps/BYOP`) and the decodes in `analysis/`. The source files (`periodization_data.py`, `06_template.md`, `build_periodization.py`) were corrected, and this file and the JSON were regenerated from them.

**Numbers recomputed independently from the raw dumps (python, `scratchpad/fc06/recompute.py`).** All of these matched the document:

| Number | Recomputed | Verdict |
|---|---|---|
| STRENGTH-12 'the work' sets/week (4 slots × N5:Z5) | 16,16,20,20,24,24,12,20,24,24,28,28 → +5.22 %/week | correct |
| AESTHETICS-12 weekly sets wk1 → wk12 | 96 → 148 (158 with the 2 superset partners) → +4.01 / +4.63 %/week | correct |
| FAT BURN weekly sets / reps | 60, 60, 64, 70 / 781 → 1040 (+5.27 / +10.02 %/week). Counting '8/8'-type cells per side gives 973 → 1248 (+8.65 %) | correct; counting convention added |
| UL weekly resistance sets / PPL sets per rotation | 76 → 90 → 102 (+18.4 %, +13.3 %) / 47 → 58 → 66 (+23.4 %, +13.8 %) | correct |
| BOXING sprint rounds; week-7 set changes; throws per list | 5,5,6,6,7,8 (+9.86 %/week); 11 rows 3→2 and 3 rows 3→4; 190 throws per list | correct |
| CrossFit block-2 lifting sets (HYBRID_12 index) | JUNE 28, JULY 36, AUG 20, SEPT 24 → 100 / 129 / 71 / 86 | correct |
| CONJUGATE draft vs 4 TRACKS STRENGTH-8 weekly sets | 60 vs 56 (−6.7 %) | correct |
| AESTHETICS-8 weekly sets (19 rows) | 38, 57, 57, 57, 76, 76, 95 → +16.5 %/week | correct |
| HYBRID header sets / sets × reps | 2→4 (+10.41 %/week) / 12→32 (+15.04 %/week) | correct |
| ATHLETIC MID med-ball throws/week | 400 | correct |

The BASEBALL block means (contacts 199 / 241 / 201, throws 178 / 192 / 176; Block 2 resistance 74 → 84, all sets 118 → 151; deload −31 % / −46 %) were recomputed from the decode's per-week table (`prog_mm_baseball.md` 6.1) and match.

**Corrections made.**

1. CrossFit macro (2.2, OBS_CF_MACRO): the claim that 'each block restarts aerobic and WOD levels higher' was WRONG. Aerobic runs 1-2-3 | 1-2-3-4 | 2-3-4 and WODs 2-3 | 2-3-4 | 2-3-4, so only block 3 restarts aerobic higher. 'Resistance rides with strength' is false for block 1 (FEB-MARCH resistance alone, APRIL strength + power). Added: the AUGUST grid marks 2 WOD days at WOD level 3.
2. CrossFit FULL TIME '+5.5 %/week' (rule 4, table 2.3) was presented as an observed rate. The macro never walks strength L1-L2-L3-L4 in consecutive months (L1 APRIL, L3 JUNE, L4 JULY, L2 OCT/NOV), so the rate is relabelled INFERRED (a hypothetical walk of the dose table).
3. Effort grammar (rule 6/R6, 5.1, strength rules) was presented as OBSERVED 'nuance = unilateral MAX, survival = isolation ALL'. It is a splice of STRENGTH-12 slot names with STRENGTH-8 effort words. In STRENGTH-8 and the CONJUGATE draft the 'MAX' rows are pull-ups / DB rows, alt incline DB bench and lunges, and the 'ALL' rows are RFE lunges / staggered DL and bicep curls. The class mapping is now marked INFERRED.
4. Dynamic-effort effort: STRENGTH-8 and the CONJUGATE draft label the fast rows '1RIR' (4T D18/D21). The STRENGTH_8 skeleton had borrowed STRENGTH-12's 'FAST RPE6 or about 60-70%' as if it were STRENGTH-8's own label. Fixed, flagged as a conflict, and added as an open question.
5. STRENGTH_8 week-1 doses were wrong. DE sets are 5 on Thursday but 3 on Saturday (B18/B21). Accessory sets are 3-4, not 3. The 'ALL' rows are 2-3 x '8/8' (not '8/8' or 10). The 10-rep rows are the 'MAX' rows. Added: the green ladder fill also covers B17 (plyo) and B21. The week-8 weekly set count of 10 is now marked INFERRED, and the 'the work' label for the plyo row is attributed to the CONJUGATE draft (M21).
6. STRENGTH_12 week 1: 'TATE PRESS' 3x20 was attributed to 'the survival'. It sits in the Wednesday NUANCE slot (N15). Also: main-lift reps per session are 18-20 in weeks 1-10 but 14 in weeks 11-12, not 'held 18-20'. The STRENGTH-12 'A/B weeks' are an analyst label: there are no 'A WEEK'/'B WEEK' cells.
7. HYPERTROPHY_12/6 effort: AESTHETICS-12 writes no RIR/RPE. Its rows were marked OBSERVED with '1-2 RIR' / '1 RIR' / '0-1 RIR' efforts borrowed from AESTHETICS-8 col D, so effort is now marked INFERRED. Also flagged: in weeks 4-6 the SETS row says 4 while the rep string lists 3 numbers before '-20'. Reading '-20' as the isolation reps is INFERRED.
8. AESTHETICS-12 week-12 overreach: chest (32.5 sets) was omitted from the '33-35 sets' list.
9. HYBRID-8: the evidence range was 'rows 76-101'; the program starts at row 74. Added: the header SETS/REPS do not match the written bench (3x6, 3x6, 3x8, 3x8, 3x10, 3x10, 4x6, 4x8) or the Olympic sets. Also added: the unexplained row 79 (2,2,3,2,2,3,2,2); that the AMRAP row is not tied to a day (Saturday attribution INFERRED); and the full Thursday lunge ladder (wk6-8 'FF & RFE dcontra', 'RFE contra', 'RFE ipsi' were missing).
10. HYBRID_12 week 8 claimed 'WODs L3 (3/wk)'; the AUGUST grid shows only 2 WOD days. Noted.
11. Isolation rep ladder '15 -> 20 -> 30 -> 40' (rules 5/R5, L02, governor) is not a single observed ladder. The FAT BURN slots are leg ext/curl 15-20-40-40, arms 30-30-30-40 and side raises 15-15-20-20. L02's '+33-50 % per step' was wrong: the steps are +33 %, +100 %, 0 %.
12. UL/PPL level ladder: PPL legs are 2x8 / 3x10 / 4x8, not 2x12, so 'lower compounds 2x12' holds only for UL; this is a second anomaly. Isolations are NOT fixed at every level: PPL side raises, rear-delt flies and upright rows follow the compound ladder (3x15 -> 4x8). PPL A-drills start at 2x'8/8'. Only UL curls are 'MAX REPS'. 'About +3 %/week' corrected to +3-4 %/week (+3.7 % at 4 weeks per level).
13. Pain rule (section 10, governor, autoregulation) was cited as 'A6/A7' with a quote containing 'going unilateral'. That wording is only in the ATHLETIC FULL BODY tab (A6); UL/PPL A7 mention split grips only. The quote is now verbatim and attributed to the right tab.
14. Throws: 'always R/L pairs' was wrong. Chest pass, overhead throw, squat to chest pass, slams, back-to-wall scoops and sit-up throws are bilateral single entries. Sit-up throws are 1x20 in BALLISTICS (A70:B71) but 10 in the boxing list (F68:F69).
15. Olympic lifts: the coach's 'OPTIONAL PIECE' label on every BASEBALL Olympic row (CI33, DA33, DS33, BC51, BU51, CM51, DD50) was missing. Added to the ladders, the PRE_8 skeleton and the open questions.
16. BASEBALL blocks are labelled only 'BLOCK 1/2/3'. Their off-season / pre-season / in-season reading is now marked INFERRED (Block 3 dates fall in the calendar's 'IN SEASON' months). Date cells corrected: AH61 'March 20 - 26', AU61 'March 27th - 31st', DN60 '04/24 to 04/28'. 'Dated March 20 - April 28' is corrected to weeks 3-8 only.
17. Deload rule (rule 7/R7/D4): '3 sets x 8 at RPE ~7' was presented as observed. Only STRENGTH-12 writes an RPE, and its deload is 3 x 4; AESTHETICS-12 is 3 x '8/8/8-12' and BASEBALL is 3 x 8. The unified default is now marked INFERRED. D1/plan shapes now list the 8-week exceptions: BOXING ends at a peak, HYBRID-8 has no deload, the CrossFit class tests only.
18. 12-week shape (rule 3/R3/D2/section 7): 'weeks 8-12 = new phase with intensifiers, week 12 = RPE 10 / 5 sets' merged two programs. Only AESTHETICS-12 changes the menu and adds intensifiers (5 sets + MYO); STRENGTH-12 keeps its A/B menu and peaks at 7 x 2 @ RPE 10.
19. Rule 9/R10 'athletic work never disappears' now lists its exceptions: the boxer's base weeks have zero plyos, the BASEBALL Block 1 'wk 8' recovery week has no plyos or throws, and deloads keep only 1-2 Part A sets.
20. BOXING: the 'Always go for 1-3 RIR...' quote in the base-week effort is not in the BOXING tab; it comes from UL/PPL A6 and ATHLETIC A5 and is now marked as an INFERRED default. Also clarified: working-set counts are component sets; the week colour groups are 1-2 / 3-4 / 5-7 / 8; and the week-8 detail (depth drops, SL march jumps, squirrel jumps, side+front raises stay at 2 sets). Sport table: upper-body work after week 2 is not 'removed' - it survives inside combos.
21. FAT BURN circuits are not 'one lower and one upper'. Mon/Fri weeks are mixed full-body + core; in Tue/Thu weeks, Tuesday is upper + core and Thursday is lower + core.
22. Worked governor example (4.6): the text said the focus muscle (chest +6) gets the largest increase, but biceps gains more (+7, 12 -> 19). The per-week increments are 0.21-0.84 sets, not '+0.4-0.6'. The reverse mapping would add ~0.36 sets/week to biceps, not ~0.2.
23. Floors (4.4): '6-8 sets for maintenance' was attributed to Schoenfeld 2017. It is not a Schoenfeld finding and is now marked INFERRED (practitioner range + Spiering 2021).
24. EFFORT '8 - That was perfect': the dropdown label is observed; calling it the 'bullseye'/target is an inference and is now labelled so (5.2, governor modifier, autoregulation).
25. Plyo ladders: the within-phase rules (bilateral before unilateral, etc.) and the BALLISTICS-phase-to-Sheet23-zone mapping are read from list order and were labelled OBSERVED. They are now INFERRED.
26. Science - RPE chart: the 10-rep column and RPE7 x 8 did not match the RTS/Tuchscherer chart. Corrected to RPE9x10 70.7, RPE8x10 68.0, RPE7x8 70.7, RPE7x10 65.3 (all were 1-2 points high). The chart is attributed to RTS, not Zourdos 2016. The 1-6-rep values used for inference were correct.
27. Science - plyometric volume: 'newer recommendations allow up to ~200 high-intensity or ~400 low-intensity contacts/session' is NOT supported by the cited PMC7873906 table, which is a study protocol of 72 -> 126 contacts/session. Removed.
28. Science - RP landmarks: the cited arvo.guru page gives no per-muscle numbers, and the quoted ranges did not match RP's own guides (e.g. biceps was 4-6/10-14/14-20; RP gives MEV 8-10, MAV 14-20, MRV 20-26). Replaced with RP's published chest/quads/biceps/triceps/calves values; back is marked not extracted. The governor cross-check was updated to match.
29. Science - Bell 2022 (Front Sports Act Living) is a qualitative interview study of 18 coaches, not a survey (deloads ~every 4-6 weeks, ~1 week). Westside dynamic effort is ~50-60 % bar weight plus band/chain tension, not '60-70 %'. Plotkin 2022 used lower-body exercises, so it does not support a small-muscle-only rule. All three have caveats.
30. Sheet24 half-marathon plan: added the coach's adoption line A2 ('Program we use for all Blaze Camp Athletes who are looking to run a half marathon.') and the 1-week taper. Tab names in sources now use the exported (31-character) names instead of reconstructed full names ('& PLYOS', 'LIFTING', 'EXERCISES LIBRARY', 'CONTROL PATTERNS/CORE').
31. Verified correct and left unchanged: the CrossFit level grid and dose tables (verbatim), class codes '1/1'..'5', the STRENGTH-12 %, RPE, SETS and REPS rows, the STRENGTH-8 ladders, the AESTHETICS-8 sets/reps/lunge ladder, the HYBRID sprint/Oly/bench/jump strings, the BASEBALL legend/calendars/OLY % ramp/deload/recovery-week contents/day tags, the ATHLETIC level notes and heaviest prescriptions, the ALL ABOUT SQUATS menus/rest/band-chain %, the AEROBIC rule A5 and set ranges, the BYOP dropdown values, the JUSTICE LEAGUE examples, the COD tiers and the agility/COD definitions.

### Pass 2 (2026-10-08)

A second adversarial fact-check re-read every OBSERVED claim against the raw workbooks (`raw/BYOP.xlsx`, `raw/MASTER_MODEL.xlsx`, read with openpyxl, cell values and fills), the `dumps/` and the `analysis/` decodes. It also checked every quoted label in the document for a verbatim match in the sheets (558 quotes) and checked the science rows against their sources (the RP landmark values were re-fetched from rpstrength.com). The fixes were made in `periodization_data.py`, `06_template.md` and `build_periodization.py`, and this file and the JSON were regenerated from them. Scripts: `scratchpad/fc06b/recompute2.py`, `quotes.py`, `patch_data2.py`, `patch_build2.py`.

**Numbers recomputed independently in pass 2.** They match the document unless the verdict says otherwise.

| Number | Recomputed (raw xlsx, openpyxl) | Verdict |
|---|---|---|
| STRENGTH-12 work sets/week (4 x O5:Z5), reps/session, RPE O4:Z4, % O3:Z3 | 16,16,20,20,24,24,12,20,24,24,28,28 (+5.22 %/week); 20,20,20,20,18,18,12,20,18,18,14,14; RPE 7,7,7,8,8,9,7,8,9,9,9,10; % 80,80,85,85,90,90,'MID DELOAD', blank x5 | correct; % is observed only for weeks 1-6 (5.2 said weeks 1-7, fixed) |
| STRENGTH-8 / CONJUGATE draft weekly sets (column B) | 56 / 60 (-6.7 %) | correct |
| AESTHETICS-8 weekly sets (19 rows x E32:K32) | 38, 57, 57, 57, 76, 76, 95 (+16.50 %/week) | correct |
| AESTHETICS-12 weekly sets (rows 35-66 x N31:Z31, MYO rows at 2/3 sets) | 96,96,96,128,128,128,96,124,118,118,118,148 (126 / 158 with superset partners); the document's 119/127 for wk9-11 honours row 63's own '(5 sets - ...)' | correct (+4.01 / +4.63 %/week); the skeleton's Vol idx is sets per exercise, so the weekly-set index (129/124/154 in wave 2) was added |
| FAT BURN weekly sets / reps (per-side cells once / twice) | 60, 60, 64, 70 (+5.27 %/week) / 781, 822, 924, 1040 (+10.02 %; idx 100, 105, 118, 133) / 973 -> 1248 (+8.65 %) | correct; week-3/4 set changes were incomplete (fixed) |
| UL weekly resistance sets / PPL sets per rotation | 76, 90, 102 / 47, 58, 66; UL +3.75 %/week at 4 weeks per level, +2.71 %/week over 11 steps | the '+3.0 %/week over 11 steps' was wrong (fixed to +2.7) |
| BOXING sprint rounds / week-7 set changes / line-item sets | 5,5,6,6,7,8 (+9.86 %/week) / I12-I14, I21-I23, I32, I36, I37, I45, I48 3->2 and I20, I35, I46 3->4 / 76, 76, 69, 69, 72, 72, 65, 79 | correct |
| HYBRID header sets and sets x reps; rows 78/79 | 2->4 (+10.41 %/week), 12->32 (+15.04 %/week); row 78 = 2,2,2,3,3,3,4,4 (beside 'UPPER ACCESORY'); row 79 = 2,2,3,2,2,3,2,2 | correct; row 78 was missing (added) |
| ATHLETIC levels, written SETS cells once per line, medball lists excluded | about 61 / 53-55 / 44 | the document's 89 / 72 / 59 are component counts from the decode; the counting basis is now stated |
| CrossFit macro levels and FULL TIME block-2 lifting sets | macro grid matches A10:M17 cell by cell; JUNE 28, JULY 36, AUG 20, SEPT 24 -> 100 / 129 / 71 / 86 | correct; the MARCH/APRIL day grids contradict the macro (added) |
| BASEBALL Block 2 resistance / all sets wk2 -> 'WEEK 8' (decode table) | 74 -> 84 (+2.6 %/week over 5 grid steps; +2.1 % over 6 calendar weeks), 118 -> 151 (+5.1 % / +4.2 %) | correct as grid steps; the missing 'wk 3' grid is now noted in table 2.3 |

**Corrections made in pass 2.**

1. Effort grammar (rule 6, R6, L04, table 5.1, strength rules): the 'MAX' on Thursday's lunges (D20) was filed under the 3rd row 'the nuance'. On Thursday the plyo row takes 'the work' position, so the DE squat is 'the accessory' ('1RIR'), pull-ups are 'the nuance' at '2RIR' (D19, M19) and the lunges are 'the survival' at 'MAX' (D20, M20); the CONJUGATE draft is identical (M21:M24). The rule 'work 1RIR -> accessory 2RIR -> nuance MAX -> survival ALL' holds on Monday and Wednesday only. The effort word follows the exercise role, not the slot name.
2. Chains were listed as a dynamic-effort/speed method ('bands ~50 %, chains ~70 %' in L03, table 5.1 and the strength rules), with non-verbatim quotes '~50%'/'~70%'. In ALL ABOUT SQUATS chains are a loading tool: 'BOTTOM CHAINS' '*INTENSIONALLY SLOW YOU DOWN', 'Chains are designed for magnitude influence, loading.', 'Weght can be moderate around 70%'. Bands are the speed tool: 'Bands are designed for speed/velocity', 'Weight should be lower ranges around 50% so you can move fast'. STRENGTH-8 is consistent with this ('HEAVY CHAINED DEADLIFT' on the max-effort day H9, 'FAST BANDED DL' on the speed day H18; the draft's speed-day 'FAST CHAINED DL' CJ H22 was changed to banded in the product). Quotes made verbatim, chains removed from the speed method, and an open question added.
3. STRENGTH-12 load (5.2): '(OBSERVED weeks 1-7; % for weeks 8-12 INFERRED)'. The % row is filled only for weeks 1-6 (O3:T3); U3 holds the text 'MID DELOAD' and V3:Z3 are blank. RPE is observed for all 12 weeks. Fixed.
4. BASEBALL deload (rule 7, D4, L06, PRE_8 week 8, open question 7): the 'DELOAD WEEK' was described as 'the same template'/'same exercises'. Read cell by cell, it replays the 'WEEK 7' grid (CL43:DC58), not 'WEEK 8'. It copies many exercises unchanged ('step to chest pass', 'single leg hops', 'lay down MB presses', 'camporini deadlift', 'OH rope tricep extension', 'seal DB row'), strips the intensified versions ('banded front squats' -> 'goblet squats', 'banded kb swings' -> 'kb swings', complex -> 'front squats', 'weighted Pull ups or max reps Close grip cable lat pull down' -> 'Close grip cable lat pull down', 'heavy DB step ups ' -> ' DB step ups ') and removes 'myo set' / 'myo sets'. This generator-relevant rule was missing; it was added.
5. Rule 11 / R12 / L08 / lever matrix said intensification methods are concentrated in the conversion/pre-season phases and are 'rare' in-season. BASEBALL writes upper-body 'Superset - same reps' / 'Superset - max reps' pairs and banded lifts in all three blocks: Block 1 week 1 (C34), in-season Block 3 (C70, AQ69 'SUPER SET 4X', DK68 'FAST BANDED DEADLFTS'). Only the '5 of each' complexes and 'myo set' / 'myo sets' are confined to Block 2. Fixed (matrix ATH_IN: 'S(supersets, bands)').
6. Rule 10 / R11 said the slot skeleton 'never changes inside a plan'. It changes at phase boundaries: BOXING week 3 replaces the whole menu (the Tuesday/Friday upper days dissolve into mixed sessions); AESTHETICS-12 drops the Monday/Thursday 'TRICEP EXT.' rows after weeks 7/8 and rebuilds Friday ('RFE Lunges (bulgarian)', 'Staggered stance unilateral deadlifts', one-leg extensions/curls, leg-press MYO). Reworded to 'held inside a phase'.
7. Rule 13 / R9 / L01 / governor modifier / open question 12 said in-season sets are 'frozen (4 per Part)'. Only Part C/D are 4 in Block 3; Part A is 1-3 sets (mostly 3) and Part B (core) 2-4 sets or 'Accumulate' time blocks. Fixed.
8. BASEBALL 'partC_D_sets' said '5 in Block 2 wk6-WEEK 8'. In 'wk 6' only Monday Part C is 5 (BW52); 'WEEK 7' is 5 everywhere; 'WEEK 8' is 5 except Friday Part D (DR54 = 4); Block 1 wk7 Monday Part D is 5 (DC37). Fixed; PRE_8 week 7 now notes Friday Part D 4.
9. CrossFit year (2.2, OBS_CF_MACRO): the day grids were not checked against the macro. The MARCH grid schedules STRENGTH ('KNEE DOM'/'PULL'/'HIP DOM'/'PUSH') and POWER ('SNATCH'/'CLEAN') days with no level, although the macro gives MARCH resistance only. The APRIL grid keeps RESISTANCE 'LB'/'UB' days. SKILL days appear in 7 grids although the macro SKILL row is empty. 'Block 1 runs resistance alone' is now limited to the macro row; an open question was added.
10. HYBRID-8 (OBS, skeleton note, hybrid rules, open question 28): row 78, beside 'UPPER ACCESORY' (D78), repeats the header sets 2,2,2,3,3,3,4,4. The document said the header 'can only' govern the unwritten squat/deadlift sets. Added row 78 and softened the claim.
11. Athlete levels (rule 8, R8, level dial, OBS_AT_LEVELS): 89 -> 72 -> 59 were presented as plain OBSERVED sets/week. They are the decode's component counts. One written line each gives about 61 -> 53-55 -> 44. Resistance sets are flat STARTING -> MID (44 -> 44) and core sets rise at ADVANCED. The quote '3 x 1 (1RIR)' is not a cell value: H15 = 3, I15 = 1, J15 = 'DEADLIFTS (1RIR)'. Fixed; the MID deadlift reps are the date-stored '6/8' (E18), not a typed '6-8'.
12. L15 session budget: 'Starting 10/6/7' was wrong; the STARTING workouts have 10 / 7 / 7 lines (A12:A21, A24:A30, A33:A39). MID is 10 / 14 / 8 / 16 lines including single throw lines (10 / 4 / 8 / 6 without them). Fixed.
13. Throws ladder (2.4, section 9.2): the progression 'rotational subset -> full list -> 2 lists/week' is not what the sheets show. STARTING already uses one 'ALL LIST' (210/week); MID uses the 10-throw rotational subset at 2 x 10 in two sessions (400); ADVANCED uses two 'ALL LIST' sessions (420); the boxer goes 1 list -> 2 lists (190 -> 380). Fixed; which list 'ALL LIST' means is marked INFERRED.
14. Olympic lifts (2.4, section 9.3): 'they appear only from the second half of the off-season' is BASEBALL-only. The ATHLETIC 'STARTING' block, labelled 'First 8 weeks (8wk1)', has 'SUPERSET: Low Hang Power Cleans (mid weight) ' 3 x 8 (A36). The boxer starts 'Clean Pull/ hang Power Clean' in week 3. BASEBALL Block 1 'wk 8' still has a 4 x 6 'OLY' row with no exercise. Fixed.
15. BOXING-based athlete rows: the week-8 effort default 'OLY 90 %' (from the generic PEAK default) was printed on an OBSERVED BOXING row, but the BOXING tab has no % anywhere. The week-7 default 'athletic 1-2 sets' contradicts I8/I9, where depth drops and SL march jumps stay at 3 sets. Both rows now carry explicit, correctly labelled effort text.
16. UL/PPL ladder table (8.5): the 'PPL push/pull compounds 3 x 15 -> 3-4 x 10 -> 4 x 8' row hid two exceptions. 'Dips' go 3 x 8 -> 3 x 10 -> 4 x 'MAX'. The lat pulldown goes 3 x 15 -> 4 x 10 -> 5 x 12, so reps rise again at INTERMEDIATE. The 'Single Leg Deadlift' stays at 3 sets at INTERMEDIATE. Added. GENERAL_BEGINNER_12 note: '+3.0 %/week over 11 steps' recomputed as +2.7 %/week.
17. FAT BURN week 3/4 'Sets/exercise' cells ('+1 set on lead + SL RDL', '+1 set on 2nd slot') were incomplete. Week 3 also adds a set to the 1st upper slot and the arm slot and removes one from leg ext/curl and the 3rd upper slot (net +2 per half-week). Week 4 adds sets to the 2nd lower slot, leg ext/curl and the 3rd upper slot (net +3). Fixed.
18. HYPERTROPHY_12 Vol idx is sets per exercise. The AESTHETICS-12 slot count falls in wave 2, so the written weekly-set index is 100,100,100,133,133,133,100,129,124,124,124,154, not ...133,133,133,133,167. Added to the skeleton note.
19. Annual calendars (8.6, JSON annual_planning): added what was missing. Row 4 has no FEBRUARY. Row 5 marks Jul-Sep 'SOFT SEASON' as well as 'OFF SEASON'. Row 10 marks the 16 'FALL BALL' weeks 'SOFT SEASON'. The week labels skip 'WK 2'. Pro months and pro weekly are now spelled out. The calendar-to-skeleton mapping and the JSON 'mapping' string were labelled OBSERVED and are now INFERRED.
20. Labels presented as the coach's vocabulary that he never wrote: 'KD week / HD week' for STRENGTH-8 (the alternation is real, but the words are written only in HYBRID); 'max intent with full quality' in table 5.1 (an analyst default; the sheets write intent words only on some rows, e.g. 'Really high jump squats LOAD & jump hard', 'High Knee Runs FAST'); '1-3 RIR aka RPE 7+' (the cell reads 'Always go for 1-3 RIR (REPS IN RESERVE) aka RPE 7+'). Fixed or labelled INFERRED.
21. Table 2.3: the BASEBALL Block 2 rates use 5 grid-to-grid steps. Block 2 has no 'wk 3' grid ('WK 1', 'wk 2', 'wk 4' …), so over 6 calendar weeks the rates are +2.1 % (resistance) and +4.2 % (all sets). Noted in the status column.
22. D7 (fighter week 7) said the 'key complex/power rows ramp (3 -> 4)'. Only the knee-tuck + DB rows, 'Hang Power Clean & Press' and the hinge complex ramp; the squat complex (I22) is cut to 2 and the depth drops / SL march jumps stay at 3. Fixed.
23. Secondary-compound row of table 5.1 was labelled 'the accessory' only; on Thursday the 4 x 6 '2RIR' pull-ups sit in 'the nuance' row (M19). Relabelled.
24. Hypertrophy default dose (8.1) and worked-example base (4.6): the BYOP demo writes calves at 3 sets and 'DB Push press' 5 x '6 to 8 Reps'; the worked example's flat 3 sets per slot is now marked INFERRED.
25. Science: the focus ceiling '26 (inside the ~20-26 MRV region of the RP model)' is true only for biceps. RP's own guides, re-fetched, give MRV quads 14-18, triceps 16-20, chest/calves 16-24, biceps 20-26 and MRV*P up to 24-32+ / 26-35. 26 is a specialisation-level ceiling, and the non-focus 20 is above RP's quad MRV. Reworded and marked INFERRED. The Israetel comparison ('his ramp is gentler, ~+0.5 set/muscle/week') confused the INFERRED governor with what he writes: his AESTHETICS-12 STEP ladder adds about +1.1 set/muscle/week, close to RP. Fixed in 12 and SCI_RP. The deload-depth comparison now notes that 41-60 % is taper evidence, not a deload prescription. RP landmark values, the RTS chart, Issurin residuals, Bosquet taper, Gabbett ACWR, NSCA contacts and Westside DE loading were re-checked and are correct.
26. Verified correct and left unchanged in pass 2: CrossFit macro levels and dose tables, class codes '1/1'..'5' (stored as dates), STRENGTH-12 RPE/SETS/REPS rows and exercise rotations, STRENGTH-8 ladders (E4:L6 green/pink/blue), CONJUGATE draft labels, AESTHETICS-8 lunge ladder and '1-2 RIR' column, AESTHETICS-12 rep strings, 'A WEEK'/'B WEEK'/'A WEEK LOWER' tags and MYO rows (2 sets wk9-11, 3 sets wk12), HYBRID sprint/Oly/bench/jump/lunge strings, BOXING week colours and every week-3/7/8 set and rep cell quoted, FAT BURN slot ladders and circuits (12.0 / 18.7 / 21.3 / 33.3 min), BASEBALL legend, OLY % ramp and 'OPTIONAL PIECE' cells, Block 3 dates, day tags 'Speed'/'strength'/'speed', in-season Part C reps (all >= 8, no OLY), ALL ABOUT SQUATS menus/rest/MYO, AEROBIC cheat-sheet colours, rule A5 and set ranges, Sheet23 zones (C34:D36 under 'Plyo' D33), BALLISTICS force phases and medball list, COD tiers, BYOP EFFORT/FEELING dropdowns and 'Focus 1'/'Focus 2' slots, JUSTICE LEAGUE examples, Sheet24 half-marathon plan.

## v1 verification log

Adversarial check of the v1 update (2026-10-08). `coach_answers_full.md` (all 140 entries) and `coach_answers.md` were re-read in full; every answer that touches time structure, progression, volume over time, athletic progression, exercise variation across blocks or tests was checked against the tables, examples and JSON of this file, not only against the changelog. Fixes were made in place in both files (md with Edit, JSON with python from the team venv); the pre-check JSON is backed up in the session scratchpad (`adv06/06_periodization.before_adv.json`). No Google Sheet was opened or modified.

**Answers checked and where they now live.** OK = reflected correctly before this check; FIXED = a table, example or JSON value still contradicted the answer and was corrected here.

| Answer(s) | What the coach said (short) | Where in this file | Result |
|---|---|---|---|
| PER-01 | 4-6 weeks = maintenance/transition at ~50-70 %; 8 weeks = 4 adapting + 4 driving, start hard; 12 weeks = 2-4 acclimation + 4-6 drive + hardest last weeks; repeat one level up; week-by-week; yearly | §1.1, §6, §7, §8, JSON `plan_length_model`, `skeletons` | FIXED: L3 ran a 7-week drive (2 / 7 / 3); now 2 / 6 / 4 in §1.1, §7.0, §7.1, §8.0, §8.1, pending #3 and JSON (headline_rules, modes, grids.C12_L3.phases, skeleton `phase_by_level`) |
| PER-02, PER-03, PER-04 | 4-6-week blocks, 1-2 small variables; A/B weeks only for variety seekers; second exposure = different exercise; one axial day | §3, §8, §10.1, JSON | OK; JSON gained `exercise_progression_rules_v1` (it had no §10.1 block) |
| PER-05 | deload = about half the sets, same exercises, lighter or 3+ RIR, no buy-out/finisher | §6 D1 | OK; D1 tag now separates his dose from the PROPOSED MYO/superset removal |
| PER-06, CAT-05, CAT-06 | level up at block end if '8 - That was perfect', no pain; levels theoretical; client and exercise level separate | §3, §10.1, §11 | OK |
| PER-07 | tests by checkbox at block start or 'No need for testing' | §6.1 | OK |
| PER-08, UNI-10 | off / pre / in / post season; in-season sprints for speed athletes, strength maintenance or jumps for others; bilateral minimal | §8.2 | OK |
| PER-09 | strength %-template and Olympic ramp; 'make sure it's correct' | §5.4, §8.2.2 | OK (science check present); off-season skeleton now one ramp step per week, with the L1 variant (ATH-10) |
| PER-10 | smooth for hypertrophy/general; steps and waves for fight/competition prep | §4.3, §7.0 | FIXED: the 8-week hybrid default copied HYBRID-8's 2 -> 3 -> 4 set steps (+10.4 %/week, +50 %/+33 % at the steps) although §2.3 says such curves are not copied; sets now follow the C8 grid |
| PER-11, PRG-04 | VOL 1 / 2 / 3 one per off-season block; STARTING/MID/ADVANCED by need | §8.2 | OK |
| VOL-04, VOL-05, VOL-06, VOL-07, UNI-05 | 3/5/7 % of weekly sets chosen by the person; bank the fraction; first exercise first; 10 %/week is 'way too much' | §4, §7.1, §11, JSON `volume_governor`, skeletons | FIXED: (a) skeleton `rate_cap_pct` was 5 in every drive/hardest week, blocking the person's 7 %; now 7 (acclimation 3, 8-week weeks 1-4 5) with `static_rate_pct` by level; (b) the ceiling read '10 %/week' and §7.1 claimed the largest weekly jump was +7 %, but L1 week 5 is +10 % (one set on 10) and an L1 static plan releasing every muscle together would jump +11 % (computed); ceiling now 'less than 10 % on the total', release staggering PROPOSED (pending #23) |
| VOL-01, VOL-02, VOL-03, UNI-01 | starts 10-12 / 15-20 / 20+; priority +4-6, cap ~25-30; pain -30-50 %, machines, drop; 15-20 maintenance-to-growth, 20-25 growth | §4.2, §7, §8.1 | OK |
| VOL-09, LIB-16, VOL-10 | helpers 0.25; dips 0.5 / 0.5; 10/10 = 1 set; athletic patterns never count | header, §4.2, §9.1 | OK (no 0.5 helper credit outside retired/science-comparison text) |
| VOL-11, VOL-12, PRG-07 | small 12-30, big 5-15; 40s only AMRAP/CrossFit; preference moves big-compound reps; '12/10/8 -20' pyramid + light 20 | §2, §5.4, §8.1 | OK |
| VOL-13, VOL-14, VOL-15, GEN-08 | RIR 1-3; MAX only small muscle/bodyweight; rest; MYO last isolation; never to failure on heavy compounds | §5, §8.1 | OK |
| VOL-08, VOL-16, VOL-17, UNI-09, ATH-11 | 5-7 exercises; field athletes 10-12; ~1.5 h / 45-60 min; calves 3 sets, rear delts own sets, ~2 core; core first, movable | §3.1, §8 | FIXED: the HYBRID-8 rules (observed: strength -> Olympic, core inside tri-sets) fed the 8-week hybrid default without a v1 line; v1 order added (core first, ATH-11; Olympic/power before strength, ORD-03) |
| ORD-05, ORD-07, ORD-09, ORD-10, ORD-11, ORD-04 | supersets = fatigue tool; work/accessory/nuance/survival; fighters' aerobic block; optional days; Focus slots; priority first | §3, §5, §8 | OK |
| UNI-02, UNI-03, CAT-13, UNI-06, UNI-11, ORD-06, UNI-12, UNI-08 | bilateral:unilateral 90/10-10/90 by athlete; contra into the hip / ipsi out; same vs cross pattern; hip + push / knee + pull | §8, §10.1 | OK |
| CAT-10, CAT-11, ATH-01, ATH-02 | plyo 'zones' are method stages; start ballistic -> plyometric; share by ground-contact time; unilateral harder; Davidson zones do not apply to plyos | §2.4, §3, §8.2.2, §9 | FIXED: (a) stage weeks were split two ways (RC1-RC3 = weeks 1-2 / 3-5 / 6+ in pending #15, §9.1 and 12_volume_algorithm_v1 §3.13, but stage 1 weeks 1-3 / stage 2 weeks 4-8 / stage 3 weeks 9-12 in §8.2.2, the §3.2 matrix, §5.2 and the JSON skeleton); all aligned to 1-2 / 3-5 / 6+; (b) 'Z1 landings' was still written as an INFERRED default (§3.1 L11, BOXING week 1, JSON); (c) the §2.4 force-phase lists now say the Z words are a way of performing a jump, not an exercise property |
| ATH-04, ATH-12, PER-10 | reduce (not cut) pressing/arm volume for boxers; contrast/complexes intermediate+ and off-season only | §8.2.1, JSON `PREP_8` | FIXED: fight-prep conversion used complexes with no level limit and no note against 'off-season only'; now intermediate+ and a round-2 question (14.2 #7, pending #25) |
| ATH-05, EQ-06, LIB-06, ATH-07, EQ-14 | no medball for aesthetics (warm-up only); never over 20 lb; throws no levels; aerobic 3 / 2 / 4 + walks; any erg | §8, §9.1 | OK |
| ATH-09, EQ-03, EQ-04 | older: few plyos; no sex-based rules; constrained machines; no overhead squat, snatch, low-bar, depth jumps; youth may lift from the floor | §8, §9.1, §10.1 | OK (no sex-based rule anywhere) |
| ATH-10, LIB-07, LIB-13 | Olympic lifts for everyone in athletic training; 'Squat Snatch/Clean/Clean & Jerk'; push press easier, push jerk int/adv | §2.4, §8.2, §9.1 | OK; L1 variant added to the per-week off-season rows |
| ATH-13, FIX-03 | 'Justice League' was only a marketing name | throughout | FIXED in JSON: `levers[4]`, `levers[11]`, `quality_ladders.squat_loading` and `_meta.sources.JL` still used it as the program name (the md was already renamed) |
| EQ-01, EQ-07, EQ-08, EQ-12 | no bands, no variable resistance | §3, §5, §8, §9, §10.1 | OK; reverse-banded plyo rungs in §2.4 / JSON `quality_ladders.plyo` now marked out of scope inline |
| EQ-10, EQ-11 | client preference picks between alternatives; machines not ranked; hack/leg press more constrained than Smith; belt squat avoids axial load | §10.1 | FIXED in JSON: the rule was missing (no `hack`/`Smith` anywhere); now in `exercise_progression_rules_v1`. The md never ranked hack squat |
| PRG-03, PRG-11, PRG-10, PRG-12, PRG-05, PRG-06 | bootcamp circuits; FAT BURN circuits = finishers; FULL TIME/HALF TIME; half-marathon as-is; L1/L2/L3 and layoffs; UL rep rise = fill error | §2, §7.7, §8.1 | OK; general x0.8 factor now tagged PROPOSED |
| LIB-18 | '21.6 mile run' = 'a marathon', 'dont know when/where we need that' | §6.1 | FIXED: excluded from the cardio test options and flagged (a marathon is 26.2 mi) |
| GEN-02, GEN-03, GEN-05 | intake (no sex, experience, weight); output undecided, 'they should track it themselves'; adjust from logs | §11, §13 | OK (static vs adaptive PROPOSED) |
| PER-01 (yearly) | quarter themes, holiday maintenance | §7.6 | FIXED (consistency): Q3 said 'rate 0-3 %' while its computed curve is flat; now rate 0 %; Q2's 2-week acclimation (used in the computed year) is now stated |

**Fat-loss curves recomputed (python, bank rule: bank += rate x current sets, release at 1.0, stop at the cap).** The fat-loss skeletons showed a 5 % rate cap and 5 % curves while their overlay says <= 3 % in a calorie deficit. At 3 % every week the unscaled reference curves are: 12-week L1 10 -> 13, L2 15 -> 20, L3 20 -> 25; 8-week (start x1.10) L1 11 -> 13, L2 17 -> 20, L3 22 -> 25. Other v1 curves were recomputed and match the file: 12-week L1 10/10/10/10/11/11/12/13/13/14/14/14, L2 15/15/15/16/17/18/19/20/21/22/22/22, L3 20/20/21/21/22/23/23/24/25/25/25/25 (cap weeks 10/10/9); yearly L2 Q1, Q2, Q4 and holiday values in §7.6.

**Retired ideas grep (md body before 'Verification log', and the JSON outside `retired_v0` and the logs).**
* Size-based 3/5/7 %: only in the 'retired' rows and the v0 question text. Clean.
* 0.5 helper credit: only as the retired v0 key and the Pelland research comparison. Clean.
* Band / chain / weight-releaser substitutes: only in OBSERVED cell quotes with a v1 'out of scope' note, or in v1 'no bands' rules. Clean after the inline marks on the plyo ladder.
* Plyo zones as an exercise property: the observed lever columns keep the sheet's 'ZONE 1/2/3' words with the v1 rename beside them; no generator default uses Z1/Z2/Z3 any more. Clean after the fixes above.
* Core after the power block as default: only in observed in-season / transition rows ('Part B'); the HYBRID-8 'core inside tri-sets' now carries the v1 order. Clean.
* Sex-based rules: none (only study populations in the science table and the 'no sex-based rules' line). Clean.
* 'Justice League' as a program name: only as the sheet-tab name in parentheses, the change log and the v0 logs. Clean after the JSON fix.
* Hack squat ranked last: absent; md §10.1 and JSON `exercise_progression_rules_v1` say machines are not ranked. Clean.
* 6-week = 5 weeks + deload: only in the retired rows and the OBSERVED v0 rule 3 (with its v1 line). Clean. `_meta.audience` in the JSON still described a '6/8/12-week' generator and was updated.

**For the integrator (other files, not edited here).** 12_volume_algorithm_v1 §3.12 has the same L3 split (2 acclimation weeks, drive to week 9 = 7 weeks) and §3.7 step 4 reads the ceiling as '10 %/week ... hard ceiling'; both should follow this file (L3 2 / 6 / 4; total < 10 %, with release staggering PROPOSED).

## v1.1 verification log (round 2, 2026-10-08)

Check of this v1.1 update against every round-2 answer that touches time structure (`coach_answers_round2.md`, read in full before editing) and the 2026-10-08 sports request. Fixes were made in place in both files; both are generated from one content module (`p06v11/c11.py`, `c11b.py`) so the md tables and the JSON hold the same text and numbers. The v1 files are backed up in the session scratchpad (`p06v11/v1_06_periodization.*`). No Google Sheet was opened or modified.

| Answer(s) | What the coach said (short) | Where in this file | Result |
|---|---|---|---|
| R2-PER-03, R2-PER-04 | every plan a stairway; smaller steps first, a little bigger after halfway; 12-week last 4 weeks brutal | §1.1, §4.2, §7.0-7.2, §8.0-8.1, JSON stairway/grids/skeletons | APPLIED: HARDEST 9-12 at every level; 8-week ADAPT, x1.10 and <= 5 % retired; curves recomputed |
| R2-PER-05 | 2 -> 11 = felt level / overall load, not sets | §5.2, §7.0.1, §7.4 | APPLIED: stair level, RIR ladder, dial rule; advanced climb by load/intensifiers/priority |
| R2-VOL-03, R2-GEN-04, R2-GEN-01 | no check-in = no change; no lifestyle inputs; optional check-in | §11, §13, §4.4 | APPLIED: intake rate, target-seeking and readiness life weight retired |
| R2-VOL-01, R2-VOL-02 | step table approved; 10 = max but successful | §11, §7.0.1 | APPLIED minus the life column (RESOLUTION FLAGGED); reading against the stairway (+2 points, max 7 %) PROPOSED, as 12 v1.1 |
| R2-VOL-07 | never a deload/maintenance week inside a block; cancel -> maintenance -> new block; week 1 of next cycle = deload | §6, §7.0.2, §11 | APPLIED: D6 retired (cancel offer), recovery week between blocks (counting PROPOSED) |
| R2-PER-06 | pre-season = season-change block ~60 % + taper; maintenance length chosen, extendable, end prompt | §6 D4/D8, §7.3, §8.2.1, JSON MAINT_*, ATHLETE_PRE_* | APPLIED |
| R2-VOL-06 | caps approved, customizable; floor 10; next cycle x1.05 / cap +1 | §4.2, §7.3, §7.4 | APPLIED (floor in training blocks only, as 12 v1.1; 14.3 #4) |
| R2-PER-01, R2-PER-02 | gen-pop year approved; hemisphere, own holidays, fully tunable | §7.6 | APPLIED: Q1 sets at the starting level, Q3 ~70 %, tuning table; mid-block holidays -> 14.3 #1 |
| R2-PER-07, R2-LIB-06 | test before and at the end only; submax from zero; 21.6-mile run removed | §6.1, JSON testing | APPLIED |
| R2-ATH-03 | Receive-Create stages and weeks approved | §3, §5.2, §8.2.2, §9.1, skeletons | APPLIED (v1 1-2 / 3-5 / 6+ replaced everywhere) |
| R2-ATH-04, R2-ATH-05, R2-GEN-06, R2-ATH-08 | Olympic up to 4/week, clean squat-like / snatch hinge-like; in-season light; 3-5 reps full lifts; RPE unless tested; 60+ none by default; youth ~14 | §5.4, §8.2, §9.1, JSON olympic_v1_1 | APPLIED (frequency defaults PROPOSED) |
| R2-ATH-07 | in-season game-heavy reductions | §6 D11, §8.2.1, ATHLETE_IN_2WK | APPLIED |
| R2-ATH-01, R2-ATH-02, R2-ATH-06 | plyo shares, jump lists, aerobic counts approved | §8.2.5, §9.1, §3 | APPLIED |
| R2-SES-01..06, R2-LIB-01 | two axial days; light core first; 12 + 2 core; full-body 2-4 per muscle; cardio adjustable; one-detail variations | §8.0, §10.1, §3.1 | APPLIED in the shared rules |
| R2-GEN-05, R2-GEN-07 | season start date + practice/game days; sample plans | §8.2.0, §8.2.7 | APPLIED (allocation PROPOSED) |
| COACH-R2 REQ | every popular US sport incl. swimming; gen-pop pickleball and HYROX | §8.2.5, §8.2.6 | APPLIED at the periodization level; per-sport numbers in 04_profiles v1.1 |

**Curves recomputed (python, team venv; the λ peak-anchoring method of 12_volume_algorithm v1.1 §3.7.1, published 18:46 the same day; target T(w) = T(w-1) x (1 + λ step), whole sets while T - current >= 1).** 12-week: L1 10/10/10/10/10/11/11/12/12/12/13/14 (λ 0.76); L2 15/15/15/16/16/17/17/18/19/20/21/22 (λ 0.87); L3 20/20/20/20/21/21/22/22/23/23/24/25 (λ 0.50). 8-week: L1 10/10/10/10/11/12/12/13; L2 15/15/15/16/17/18/18/19; L3 20/20/20/21/22/23/24/25 (λ 0.78). Every row matches 12's own table. A first draft of this file used its own step sizes (L3 2/3 %, a deficit stairway, one release per week, a floored maintenance); it was realigned to 12 v1.1 before release so both files hold one set of numbers. Total-rise check: L2 <= +7.4 %/week, L3 <= +5.7 %; L1 +10.0 % in week 6 of 12 and week 5 of 8 without staggering.

**Retired-ideas grep (md body and JSON outside `retired_*` and the logs).** '4 adapting + 4 driving' / x1.10 'start hard': only in history rows and the superseded table. Triggered deload inside a block: only in history rows, the superseded table and the v1 column of section 6. Readiness score with a life weight / intake stress-sleep rate: only in history and retired notes. RC stage weeks 1-2 / 3-5 / 6+: only in history rows. 'Squat once a week' as the spine rule: only in history rows (v1.1 rule: heavy squat and heavy deadlift on two different days). '21.6 mile run' as a test: removed (only the R2-LIB-06 removal note and observed v0 text). L3 2/3 % steps, a separate deficit stairway, one-release-per-week and a floored maintenance (this file's first draft): only in the realignment note above.

**For the integrator (other files, not edited here).** 12_volume_algorithm v1.1 owns the stairway set math (06 now uses its method and reproduces its tables; if 12 changes, rerun `p06v11/curves.py` and rebuild); engine/CONTRACTS.md shape.mjs (fixed_8 ADAPT and start_multiplier retired; HARDEST 9-12; recovery week counted outside the block, pending 14.3 #2; D6 triggered deload -> cancel offer; maintenance length chosen + end prompt; RC stage weeks; Olympic max 4 days with the pattern split; D12 lifestyle inputs removed); 04_profiles v1.1 (per-sport numbers for the sports added by season type); 13_product_options v1.1 (maintenance prompt, end-of-block choice, cancel button, event date, holiday marking, stair level on the week view).

## v1.1 verification log (adversarial check, 2026-10-08)

Second, independent check of the v1.1 round-2 update. `coach_answers_round2.md` was read in full first (all R2-VOL, R2-SES, R2-ATH, R2-LIB, R2-PER, R2-GEN answers and the LIB-10 / LIB-12 leftovers), then every answer that touches this file was traced through the tables, examples, pseudo-code and the JSON, not only through the changelog. The stairway curves were recomputed independently in python (team venv) with the method of 12_volume_algorithm v1.1 §3.7.1 / §3.8 (12-week L1 10 -> 14 λ 0.76, L2 15 -> 22 λ 0.87, L3 20 -> 25 λ 0.50; 8-week L3 λ 0.78; 60+ at 3 %; repeated blocks; the year's Q2 16 -> 23 and Q4 11-week 17 -> 24): every row in §7.1, §7.2, §7.4, §7.6, §8.5 and the JSON skeleton `ref_sets` matches. Fixes were made in place in both files (md and JSON patched from one set of shared strings); the pre-check files are backed up in the session scratchpad (`adv06v11/06_before_adv.*`). No Google Sheet was opened or modified; no coach statement was invented (new rules are tagged INFERRED or PROPOSED, or carry the R2 ID they come from).

**Round-2 answers checked and where they live.** OK = already correct everywhere; FIXED = a table, example, science mapping or JSON value still contradicted the answer, or the JSON twin was missing it.

| Answer(s) | Rule (short) | Where | Result |
|---|---|---|---|
| R2-PER-03, R2-PER-04 | stairway for every plan; small steps first, a little bigger after halfway; 12-week last 4 weeks brutal | §1.1, §4, §5.2, §7.0-7.2, §8, JSON stairway / grids / skeletons | OK in the rules and grids. FIXED leftovers: SCI_RBE still said the repeated-bout effect 'supports the 8-week plan starting hard'; SCI_DAMAGE still kept 'the acclimation rate low (<= 3 %)'; 14.1 #5 still read '8 weeks = 4 adapt + 4 drive, starting hard'. FIXED (consistency with 12 v1.1 §3.8, which owns the set math): the bank rule said 'at most one set per muscle per week' (§4.2, §7.0.1, JSON `stairway.bank_rule`, `volume_governor` rounding) while the λ-anchored 11-week year Q4 block places 2 sets in week 50 (22 -> 24, computed); now 'usually one, two only when a λ-anchored final week needs it' |
| R2-PER-05 | 2 -> 11 = felt level, not sets; advanced climb by load, intensifiers, priority | §5.2, §7.0.1, §7.4 | OK. FIXED: §7.7 / JSON `science_grounding` still called 'advanced climb by load' an open question (approved) |
| R2-VOL-01, R2-VOL-02 | step table approved (minus life, see R2-GEN-04); 10 = 'the max I could do, but successful'; optional 'failed' | §4.2, §7.0.1, §11, §13 | OK in §11. FIXED: pseudo-code (md + JSON) and JSON `volume_governor.rate.checkin` lacked the -1 set after a 10 and the 'failed' handling |
| R2-VOL-03, R2-GEN-01, R2-GEN-04 | no check-in = no change; optional check-in; no sleep / stress / life / job inputs anywhere | §4, §11, §13, intake | OK in the rules (no lifestyle input left in any generator rule; the remaining 'sleep/stress' hits are history, retired rows or the 'not asked' row). FIXED: SCI_RESPONSIVE still mapped to 'the readiness-based rate ... the logs steer it'; SCI_RP to 'his person-level 3/5/7 %'; §12 'the weekly rate depends on the person's fatigue and life' and the Israetel line had no v1.1 sentence; §7.7 'the logs steer the rate' |
| R2-VOL-04, R2-VOL-06 | small muscles 10/12/15 (8 'barely maintenance'); floor 10; caps approved, customizable; 20-30 typical; optional pro level | §4.2, §7.3, §8.2.1 | OK. FIXED: SCI_1220 still called the caps PROPOSED; 14.1 #2 still called 'others <= 3 % while a priority runs' PROPOSED (approved); JSON `volume_governor` had no priority row; §8.2.1 off-season x0.7 / x0.5 factors did not say the floor of 10 then applies (12 v1.1 §3.4). Rear delts 4/6/8 vs the floor: the resolution row only said 'owned by 12'; it now states 12's reconciliation (floor read on SHOULDERS/TRAPS) and keeps it FLAGGED for round 3 |
| R2-VOL-05 | KB swings never glute volume; compounds 0.25 glutes; thruster 1.0 / 0.5 / 0.25 | header, §4.2 | OK in md. FIXED: JSON `_meta.definitions.set_counting` and `volume_governor` unit did not carry it. No KB-swing glute credit anywhere (the only 'swing' hits are OBSERVED menus) |
| R2-VOL-07 | no deload or maintenance week inside a block; cancel -> maintenance -> new block | §6 D1-D6, §7.0.2, §11, §13 | OK (no triggered or early deload left in any generator rule; the hits are history, retired rows and OBSERVED programs). FIXED: 14.1 #8 still said 'placement PROPOSED'; the OBS_4T_STRENGTH12 reading still pointed to an 'open question on deload placement' (md v1.1 reading and a JSON `v1_1_note` added) |
| R2-VOL-08 | not understood: default kept and marked | §4.2, resolutions | OK in md. FIXED: JSON `volume_governor` placement lacked the marked default |
| R2-SES-01, R2-SES-02 | heavy squat and heavy deadlift on two different days; counted axial list | §8.0, §10.1, §8.1 STRENGTH | OK. FIXED (marking): the §2.4 v1 note and JSON `quality_ladders.squat_loading.v1` still read 'squat once a week' with no inline pointer to the v1.1 rule |
| R2-SES-03, R2-SES-04 | core opens light 2 x 2; core supersets / monster sets anywhere; field athletes 12 + 2 core | §3.1, §8.0, §8.2.2 | OK |
| R2-SES-05 | full-body days 2-4 exercises per muscle, never 1, a longer day | §8.0, §8.1, §3.1 L15 | OK on 'never 1' (no 1-exercise-per-muscle rule anywhere). FIXED: the shared rules still capped every session at 5-7 exercises and the GENERAL L1 rows at 45-60 min although 12 v1.1 §3.10 gives full-body days 7-10 exercises and 55-80 min; the bootcamp row did not give each muscle group 2+ stations (05 v1.1); the md shared-rules paragraph had no JSON twin (added as `family_overlays.shared_rules_v1_1`) |
| R2-SES-06 | cardio adjustable up or down; aesthetics 4 incl. a 2nd Orange + walks | §3, §8.1, §8.2.5, §9.1 | OK |
| R2-ATH-01, R2-ATH-02, R2-ATH-06 | plyo shares; jump lists; aerobic counts | §8.2.5, §9.1 | OK (every share and count checked against the answer) |
| R2-ATH-03 | Receive-Create stages and weeks | §5.2, §7.1, §7.2, §8.2.2, §9.1, JSON skeletons | OK (12-week RC1 1-3 / RC2 4-7 / RC3 8-12 and 8-week 1-2 / 3-5 / 6-8 in every table and skeleton row) |
| R2-ATH-04, R2-ATH-05, R2-GEN-06 | Olympic up to 4 days (clean = squat pattern, snatch = hinge pattern); full lifts 3-5 reps; RPE unless tested; % only for competitive lifters | §5.4, §8.2, §9.1, JSON olympic_v1_1 | OK (no once-a-week cap anywhere; in-season 1-2 days is a PROPOSED default inside his maximum). FIXED: off-season weeks 9-12 and 8-week weeks 6-8 ended the Olympic ramp with 'heavy single or test if ticked' with no level or from-zero limit (now: by RPE and bar speed, L2+ after a completed block, never max-effort from zero, % only with a tested max); §5.4 '60+: 60+:' typo; JSON `annual_planning` still mapped in-season to 'no Oly' and pre-season to 5-8 weeks (v1.1 note added; md §8.2.4 cells annotated) |
| R2-ATH-07 | in-season game-heavy reductions | §6 D11, §8.2.1, ATHLETE_IN_2WK | OK |
| R2-ATH-08 | 60+: no Olympic lifts, plyos or depth jumps by default; option with the warning; youth floor lifts ~14 after a hang block | §5.4, §6.1, §8.1, §8.2.6, §9.1 | FIXED + RESOLUTION FLAGGED: §9.1 rule 8 (and JSON) kept 'landing drills and low ankle hops are fine' by default; his text says no plyos by default and ankle hops are plyometric by his own R2-ATH-02 list. Now: landing drills (the 'receive' stage) by default, low ankle hops and the rest opt-in with the warning; depth jumps (round 1 'never') a coach-guided option at most. New row in 'Resolutions flagged'; pseudo-code line added |
| R2-LIB-01, R2-LIB-02, R2-LIB-04, R2-LIB-05, R2-LIB-06, R2-LIB-07 | one-detail variations; zone = tag, level from load / skill / stability; KB face pulls = shoulder work; both bench push-ups; 21.6-mile run removed; new library exercises | §10.1, §6.1, §8.1, §8.2.5 | OK |
| R2-LIB-03 | rotation bias: both every week; used to pick swaps when something hurts; not by sport | §10.1 | FIXED: missing everywhere; added to §10.1, the shared rules and JSON `exercise_progression_rules_v1_1` |
| R2-PER-01, R2-PER-02 | gen-pop 'stay in shape' year approved; hemisphere, own holidays, fully tunable | §7.6 | OK (year curve recomputed: 15 x 12 / 8 / 16 -> 23 / 12 / 15 x 13 / 17 -> 24 / 13, 13) |
| R2-PER-06 | pre-season 4-6 weeks ~60 % + 1-2-week taper; maintenance length chosen, extendable, end prompt | §6 D4/D8, §7.3, §8.2.0-8.2.1, JSON MAINT_*, ATHLETE_PRE_* | OK. FIXED: §8.2.0 claimed to be 'consistent with' engine D-15, but D-15 (>= 6 weeks OFF_LATE, else PRE) starts the pre-season one week later than a 6-week pre-season (integrator note) |
| R2-PER-07 | test before (or week 1) and at the end, never mid-block; submax from zero (5RM / 3RM, 80-90 %) | §6 D7, §6.1, §5.4, §8.1 | OK (no mid-block test and no 1RM-from-zero in any generator rule; observed mid-block 'TEST' labels stay as evidence). FIXED: the Olympic heavy-single cells above |
| R2-GEN-02 | phone-first, macro views, screenshots; videos optional | §6.1 reminders, stair level on each week | OK (no mandatory-video rule anywhere; product details live in 13_product_options) |
| R2-GEN-05, R2-GEN-07 | season start date + practice/game days; the seven sample plans | §8.2.0, §8.2.7 | OK |
| COACH-R2 REQ | every popular US sport incl. swimming; gen-pop pickleball and HYROX as an option | §8.2.5, §8.2.6, §7.6, §8.1 GENERAL | OK at the periodization level (swimming season type C with a dryland taper; pickleball and HYROX in type I and the 'stay athletic and active' overlay). FIXED (coverage, INFERRED, no 04 profile yet): figure skating and competitive dance added to type C, racquetball / squash, badminton and table tennis to type E, bowling and disc golf to type I |
| not periodization | R2-LIB-08 (NO ACCESS), R2-GEN-03 (health screen, liability release), R2-GEN-08 (Spanish) | - | no time-structure content; nothing to change here |

**Leftover grep (md body before 'Verification log', JSON outside `retired_*`, `v1`, the v0 lists and the logs).**
* Acclimation step caps, 8-week 'start hard' / x1.10 / 4 + 4, target-seeking: only in history rows, the superseded table and v1-labelled cells, each with its v1.1 replacement. Clean after the SCI_RBE, SCI_DAMAGE and 14.1 #5 fixes.
* Early or triggered deloads inside a block: only history, superseded rows, the `v1` column of section 6 and OBSERVED programs. Clean after 14.1 #8 and the STRENGTH-12 reading.
* Sleep / stress / life / physical-job inputs: none in any generator rule, intake or check-in; only retired rows, the life-column resolution and the 'not asked' row. Clean after SCI_RESPONSIVE, SCI_RP and the §12 bullet.
* Effort 10 = fail: none (10 = 'the max I could do, but successful' everywhere; 'failed' is a separate optional answer).
* KB swing glute credit: none (JSON now states the R2-VOL-05 rule).
* One exercise per muscle on full-body days: none.
* Olympic once-a-week cap: none (up to 4 days; in-season 1-2 days is a default).
* Mid-block tests: none in the generator (observed 'TEST' labels only). 1RM tests for untrained: none after the Olympic heavy-single fix.
* Mandatory videos: none.

**Flags raised by this check (for the coach, round 3).** (1) 60+ low ankle hops: opt-in or default? (resolution above). (2) Rear delts 4/6/8 vs the floor of 10 (still flagged, as in 12 v1.1). (3) The new sports added as INFERRED (figure skating, competitive dance, racquet sports, bowling, disc golf) need his OK and sports-team profiles.

**For the integrator (other files, not edited here).** engine/CONTRACTS.md D-15 should put PRE at 6 weeks or fewer to the first game; 05_session_architecture v1.1 still says 60+ 'landing drills and low ankle hops are fine' (12 v1.1 and 03 already say 'when chosen'); the recreational profiles referenced by the sports team (`sports/genpop-active.json`: rec pickleball, HYROX for fitness) did not exist at the time of this check; the per-sport numbers for the sports added here have no profile yet.
