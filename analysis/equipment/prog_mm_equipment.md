# MASTER MODEL program tabs: equipment usage, constraint, velocity intent and exercise order

Source: `raw/MASTER_MODEL.xlsx`, read with openpyxl in read-only fashion and cross-checked against `dumps/MASTER_MODEL/*.txt`. No Google Sheet was touched. Tabs covered: 'EXAMPLE UPPERLOWER SPLIT' (00), 'EXAMPLE FAT BURNBODY TONING PRO' (01), 'BASEBALL' (02, all 3 blocks), '(NOT DONE) 4 TRACKS PROGRAMMING' (04), 'EXAMPLE ATHLETIC FULL BODY SPLI' (05), 'EXAMPLE PUSHPULLLEGS SPLIT' (06), 'EXAMPLE BOXING 8 WEEK BUILD UP' (07), 'EXAMPLE CROSSFIT SPLIT' (11) and '(NOT DONE) EXAMPLE CONJUGATE' (12). 'Copy of BASEBALL' (03) was skipped because it is identical to 02.

**Coverage:** 489 sessions and 2436 exercise line items, with 746 distinct exercise strings. Every line item is listed with its cell in Appendix A and in `prog_mm_equipment.json` (`sessions[].items[]`).
Machine-readable companion: `prog_mm_equipment.json`. Reproducible with `_extract_sessions.py`, `_classify.py`, `_build_prog_mm_equipment.py` and `_write_md.py` in this folder.

**Evidence legend.** **OBSERVED** means read from a cell, and the tab code and cell are given (for example `02:CM33`). **INFERRED** means an analyst rule. All implement, constraint, velocity and tier labels are INFERRED from the coach's verbatim text. **SCIENCE** means general training-science rationale that is not in the sheet. Coach text is quoted verbatim, typos included ('Sqats', 'DEAFLITS', 'sesaw', 'Glidder', 'Ropte', 'ACCESORY').

### Scales used (INFERRED)

| Constraint level | Meaning |
|---|---|
| 5 | seated/lying, pad-supported, machine-guided path (leg press, leg ext/curl, machine row, machine dips/flies) |
| 4 | guided OR supported: cable stations & cable isolation, Smith, lat pulldown, chest-supported/bench-supported free weight (seal row, preacher, floor skull crusher, tate press), 45-deg hyperextension, floor-supported core |
| 3 | free weight bilateral with stable stance (barbell/hex/DB/KB squat, deadlift, bench, OHP, rows, curls, raises), pull-ups/push-ups/dips, planks |
| 2 | low-constraint free weight: unilateral/split/staggered/offset/single-arm/half-kneeling, carries, swiss ball/slider, Olympic lifts, KB swings, push press/jerk, hanging & rotational core |
| 1 | bodyweight ballistic/reactive: jumps, hops, bounds, depth drops, sprints & A-drills, medball throws/slams, plyo push-ups (incl. light DB/hex-loaded jumps) |

| Velocity intent | Meaning |
|---|---|
| 5 | ballistic / max intent (throws, jumps, sprints, Oly, swings, push press, contrast) |
| 4 | fast concentric with load or speed drill (FAST/same speed/banded DE, fast runners, powerful turns, A-skip/run) |
| 3 | heavy / max effort (HEAVY, 1RIR main lifts, heavy max reps); A-march technique drill |
| 2 | controlled resistance (RIR-based hypertrophy/strength-endurance) |
| 1 | slow / isometric / eccentric (planks, holds, carries, slow tempo, iso holds) |

| Tier | Definition (the coach's claimed order is T1 > T2 > T3 > T4 > T5) |
|---|---|
| T1_POWER | unloaded/light ballistic: medball, plyo, sprint, A-drills, depth drops, plyo push-ups |
| T2_POWER_STRENGTH | loaded ballistic & speed-strength: Olympic lifts & derivatives, KB swings/cleans, push press/jerk, loaded jumps, contrast complexes, dynamic-effort (FAST/banded/chained/same-speed) lifts |
| T3_STRENGTH | barbell/hex (or HEAVY-labelled) compound main lifts |
| T4_RESISTANCE_PATTERN | other compound patterns: DB/KB/cable/machine/bodyweight compounds, all unilateral lower-body work, leg press/Smith |
| T5_ISOLATION | single-joint work (curls, extensions, raises, flies, leg ext/curl, calf raises, slider/swiss-ball hamstring) |
| CORE | control patterns / core (planks, anti-rotation, rotation, hanging core) |
| CONDITIONING | cardio, sprint intervals, buy-outs, circuits |
| WARMUP | warm-up cardio / mobility |
| SKILL | CrossFit skill slot (T2B, DUBS, H.S.) |
| PLACEHOLDER | non-exercise cells ('ACCESSORIES', 'DELOAD', 'TEST', 'none') |

**How execution order is known.** In BASEBALL it is OBSERVED, because the coach labels every block `Part A` ... `Part E` and inserts `OPTIONAL PIECE` (OLY) rows. In every other tab, row order is INFERRED to be execution order. The CrossFit monthly grid is a planning grid, so it is left out of every order test.

## 1. Headline answers

1. **The claimed order holds where the coach actually coached it (BASEBALL, OBSERVED Part labels).** Part A = power: 170/177 Part A lines are T1, and 77 of them are medball. Part B = core. `OPTIONAL PIECE` = Olympic lifts. Part C = bilateral strength lift superset with an upper-body push/pull. Part D = unilateral work, isolation and calf/ankle plyos. Part E = 'Buy out' sprint on bike/row/ski or a run. Mean relative position across all 96 sessions: T1 0.18, CORE 0.26, T3 0.45, T2 0.50, T4 0.62, T5 0.82, conditioning 1.00. A power item comes first in 98% of athlete sessions.
2. **It is not a strict 5-step ladder.** Only 52% of athlete sessions are strictly monotonic. That rises to 80% once Part D ankle/hurdle hops are treated as calf accessories and heavy-lift+jump supersets as one contrast unit. Power-strength (T2) has no fixed slot. It shows up in three places: as the Part C lift itself ('Hex bar squat jumps', 'KB Squat cleans', 'Fast KB swings', 'FAST BANDED DEADLFTS'); as an `OPTIONAL PIECE` between core and strength; and as a contrast inside Part C ('Barbell deadlift' + 'Broad jumps', `02:I51`/`02:I52`).
3. **Machines are close to absent for athletes and common for gen pop.** Machines are 0.5% of athlete line items, only 5 items: 02:BS52 '45 degree hyper-extension machine - Kb swings', 02:CY34 '45 degree hyper-extension machine', 05:C39 'Superset: leg ext. leg curls (MID WEIGHT)', 05:F21 'Plate core & leg extensions / nordic curls', 05:J35 'Plate core & leg extensions'. They are 18% of gen-pop items and 11% of strength-track items. Mean constraint level is 3.32 for gen pop, 3.14 for strength, 2.65 for boxing and 2.2 for athletes. Constraint level 1 (ballistic) is 30% of athlete items and 2% of gen-pop items. This matches the coach's statement that machines suit volume, injured and older clients while athletes need free, fast work.
4. **Velocity is the clearest population divider.** 44% of athlete items carry fast or ballistic intent (velocity 4-5), against 30% for boxing, 33% for hybrid, 16% for strength and 2% for gen pop. Medball is 13% of athlete items and 0% of gen-pop items. No medball weight (lb/kg) is written anywhere in the program tabs (0 cells). The only load cue for a ball is 'this but hugging a light medball' (`05:K13`, a core rocker). The coach's '8-10 lb' guidance lives in his speech, not in the sheets.
5. **Gen-pop templates order exercises compound-first, but the 'bodybuilding' track does not.** UL is strictly monotonic (Spearman position-vs-tier rho 0.918). In the 12-week AESTHETICS columns, 19 of the 59 sessions that contain both compound and isolation work open with the isolation exercise ('cable Side Raises' / 'DB side raises' / 'Arnold press' before 'Incline bench', `04:O35`). Only 32% of all 72 sessions in those columns are monotonic. PPL push and pull days alternate compound and isolation ('Incline DB Bench press' > 'Side raises' > 'Barbell Bench press', `06:C16:C18`), so only 33% of PPL sessions are monotonic.
6. **The hybrid and CrossFit sheets list strength before Olympic power.** In 24/24 HYBRID sessions that fill both rows (MONDAY, TUESDAY and THURSDAY, weeks 1-8), the 'STRENGTH' row (squats, bench, deadlift) sits above 'OLY/ POWER' (cleans, depth-drop/box jumps, snatches) (`04:B74`/`B75`, `04:B81`/`B82`, `04:B86`/`B87`). On TUESDAY and FRIDAY an 'A/C' sprint or easy-cardio row comes first (`04:B80`, `04:B92`). The CrossFit class model uses one shared slot 'STRENGTH/POWER' after 'WARMUP/SKILL' and before 'WOD' (`11:R3:T3`). Whether row order is execution order in these two NOT-DONE/planning sheets is an open question. It directly contradicts the athlete template.
7. **Horizontal-before-vertical is applied across the week, not within one session.** In BASEBALL Part C the coach's slot labels read 'horiz pull' on MONDAY, 'horiz push' on TUESDAY, 'vert pull' on THURSDAY and 'vert push' on FRIDAY. Each label appears 20 times, and 89/92 classified Part C upper lines match their day. Inside a single session the rule holds in UL upper day ('Dumbbell Rows' > 'Bench Press (DB or Barbell)' > 'Pull ups or Lat pull down' > 'Overhead Press (DB or Barbell)', `00:C28:C31`) and in PPL pull day. It is broken in FAT BURN (8/8 upper sessions with both pull types put the pulldown before the row), in AESTHETICS ('UNILATERAL LAT PULL DOWN' before 'MACHINE SUPPORTED ROW'; 12-week 'Lat pull downs' before 'Rows') and in BOXING ('Lat pull downs/pullups' before 'DB seal rows', `07:D21`/`D23`).
8. **The coach writes his substitution logic in the cell itself.** There are 42 distinct alternate strings, and 31 of them are equipment or exercise swaps (all listed in section 6). In gen-pop UL/PPL the first option is usually the free weight or the harder version ('Sqats or Leg Press', 'Deadlifts (DB or Barbell)', 'Pull ups or Lat pull down', 'DB Rows or Row machine'). In the bodybuilding 12-week track the machine is written first ('Machine Dips or dips', 'machine or db flies', 'machine rows or db rows', 'machine or db Reverse flies'). The global rule is OBSERVED in `00:A7`/`06:A7`/`05:A6`: '...getting away from fixed grips (barbells, bars) and going split grips (dumbbells, kbs, indivitual grips) help...'. The athletic version adds 'going unilateral'.
9. **Implements rotate inside a fixed slot from week to week. That is the coach's 'same pattern, small variable change'.** 162 of 234 week-to-week slot changes also change the implement. Example: BASEBALL Block 1 MONDAY Part C slot 1 runs 'DB Squat Jumps' > 'Hex bar squat jumps' > 'fast high zercher squats' > 'KB Squat cleans' > 'Front squats - light weights - same speed for all reps' > 'barbell High zercher squat' > 'Oscilating drop squats' > 'Paced Cardio - easy'. That is one 'bkd' slot carried by 6 implement classes (barbell, bodyweight, cardio_any, dumbbell, hex_bar, kettlebell; week 8 swaps the lift for 'Paced Cardio - easy') and 3 velocity-intent levels. HYBRID THURSDAY deadlifts by week 1-8 (`04:E86:L86`): KB DL > KB DL > HEX BAR OR DB DL > HEX BAR OR DB DL > BARBELL DL > KB DL > HEX BAR OR DB DL > BARBELL DL. HYBRID TUESDAY bench (`04:E81:L81`): 3x6 - DB bench press/ core > 3x6 db incline bench press/ core > 3x8 - barbell bench press/ core > 3x8 - barbell incline bench press/ core > 3x10 DB bench press/ core > 3x10 DB incline press/ core > 4x6 bb bench/ core > 4x8/ bb incline bench/ core. Both repeat a low-skill > high-skill implement wave twice in 8 weeks.
10. **Load prescriptions are tied to implement and intent.** Olympic lifts get percentages only: 'Hang cleans @ 75%' > '@ 80%' > '@ 85%' > '@ 90%' with reps 8 > 6 > 6 > 4 (`02` OPTIONAL PIECE rows). Barbell lifts get HEAVY/RIR/RPE/% plus accommodating resistance ('FAST BANDED DL', 'HEAVY CHAINED DEADLIFT', 'FAST RPE6 or about 60-70%'). Speed work gets 'light weights - same speed for all reps' (`02:BU33`, `02:AO51`) and 'LOAD & jump hard' (`05:C14`). Plyos get 'EASY' (`04:D17`, `12:D21`). DB/KB/cable work gets RIR, 'max'/'MAX REPS', 'myo set' and loading position ('contralateral', 'ipsilateral', 'suitcase', 'front rack', 'goblet', 'zercher').
11. **In gen pop, levels change dose more than equipment.** UL NOVICE/NEWBY/INTERMEDIATE use identical exercise lists; only SETS/REPS differ. PPL differs in one cell: NOVICE gets 'Cable Lat pulldown' (`06:C28`, constraint 4), while NEWBY/INTERMEDIATE get 'Pull ups or Cable Lat pull down' (`06:G28`, `06:K28`). The beginner gets the constrained version. In the off-season athletic tab the levels do change the implement mix: STARTING is 42% T2 (loaded jumps, hex contrast), MID is 46% medball, and ADVANCED is 23% core.
12. **Boxing is a two-phase equipment shift.** Weeks 1-2 are a gym template: mean constraint 3.23, machines 14%, fast/ballistic 7%. Weeks 3-8 become an athletic template: mean constraint 2, fast/ballistic 56%, with weighted depth drops, march jumps, 'Clean Pull/ hang Power Clean', contrast complexes and medball lists.

## 2. Implement mix and constraint by program

Shares are of line items, with placeholders such as 'ACCESSORIES' and 'DELOAD' removed. Codes: BB = barbell/hex/EZ/landmine, DB, KB, MB = medball, MACH = machine incl. Smith, CBL = cable, BW = bodyweight, BW-bal = bodyweight ballistic/sprint, CARDIO = cardio equipment, LOAD? = external load not named. "written %" is the share of items whose main implement is written in the cell. The rest come from INFERRED defaults, for example 'DEADLIFTS' is assumed to be barbell.

| Program :: variant | sess | items | top implements (% of items) | written % | mean constraint | c1 / c5 % | fast/ballistic % | T1/T2/T3/T4/T5 % |
|---|---|---|---|---|---|---|---|---|
| UPPER/LOWER :: NOVICE | 2 | 20 | DB 40, BW-bal 15, CARDIO 10, BW 10, MACH 10, ANY 10 | 65% | 2.78 | 17% / 11% | 10% | 15/0/5/35/35 |
| UPPER/LOWER :: NEWBY | 2 | 20 | DB 40, BW-bal 15, CARDIO 10, BW 10, MACH 10, ANY 10 | 65% | 2.78 | 17% / 11% | 10% | 15/0/5/35/35 |
| UPPER/LOWER :: INTERMEDIATE | 2 | 20 | DB 40, BW-bal 15, CARDIO 10, BW 10, MACH 10, ANY 10 | 65% | 2.78 | 17% / 11% | 10% | 15/0/5/35/35 |
| PUSH/PULL/LEGS :: NOVICE | 3 | 25 | DB 40, CARDIO 12, BB 12, BW-bal 12, BW 8, MACH 8 | 68% | 2.86 | 14% / 10% | 8% | 12/0/8/28/36 |
| PUSH/PULL/LEGS :: NEWBY | 3 | 25 | DB 40, CARDIO 12, BB 12, BW 12, BW-bal 12, MACH 8 | 68% | 2.81 | 14% / 10% | 8% | 12/0/8/28/36 |
| PUSH/PULL/LEGS :: INTERMEDIATE | 3 | 25 | DB 40, CARDIO 12, BB 12, BW 12, BW-bal 12, MACH 8 | 68% | 2.81 | 14% / 10% | 8% | 12/0/8/28/36 |
| FAT BURN / BODY TONING :: MUSCLE BUILDING | 24 | 88 | DB 42, MACH 23, BB 15, CBL 11, CARDIO 9 | 49% | 3.25 | 0% / 20% | 0% | 0/0/15/51/25 |
| FAT BURN / BODY TONING :: CIRCUITS RECCOMENDED | 8 | 32 | BW 69, DB 19, BW-bal 12 | 44% | 2.79 | 0% / 0% | 12% | 0/0/0/31/12 |
| 4 TRACKS - AESTHETICS (bodybuilding style) :: 8-week columns E:L | 46 | 128 | DB 44, BB 27, CARDIO 12, CBL 11, MACH 6 | 38% | 3.02 | 0% / 7% | 0% | 0/0/27/55/6 |
| 4 TRACKS - AESTHETICS (bodybuilding style) :: 12-week columns O:Z | 72 | 375 | DB 27, MACH 25, CBL 23, BB 20, ? 4 | 45% | 3.63 | 0% / 25% | 0% | 0/0/15/41/44 |
| 4 TRACKS - STRENGTH (conjugate style) :: 8-week columns E:L | 32 | 105 | DB 45, BB 35, BW 13, BW-bal 5, LOAD? 2 | 34% | 2.76 | 7% / 0% | 20% | 7/13/24/50/7 |
| 4 TRACKS - STRENGTH (conjugate style) :: 12-week columns O:Z | 48 | 192 | BB 38, DB 25, MACH 24, CBL 12 | 24% | 3.54 | 0% / 24% | 12% | 0/12/23/27/38 |
| CONJUGATE (NOT DONE) :: 8 WEEK CYCLE | 32 | 105 | DB 45, BB 35, BW 13, BW-bal 5, LOAD? 2 | 35% | 2.77 | 7% / 0% | 20% | 7/13/24/50/7 |
| ATHLETIC FULL BODY :: STARTING OFF SEASON WORKOUTS | 3 | 24 | DB 25, BW-bal 17, LOAD? 12, BB 12, BW 8, MB 8 | 42% | 1.96 | 39% / 4% | 62% | 17/42/4/12/8 |
| ATHLETIC FULL BODY :: MID OFF SEASON WORKOUTS | 4 | 48 | MB 46, DB 21, BW 10, BW-bal 8, BB 6, LOAD? 4 | 29% | 1.75 | 56% / 0% | 62% | 54/8/4/17/6 |
| ATHLETIC FULL BODY :: ADVANCED OFF SEASON WORKOUTS | 4 | 26 | DB 31, BW 19, BW-bal 15, MB 12, BB 12, LOAD? 8 | 38% | 2.42 | 27% / 4% | 35% | 27/8/8/19/15 |
| BASEBALL :: BLOCK 1 | 32 | 254 | DB 30, BB 14, BW 12, BW-bal 12, MB 10, CARDIO 7 | 56% | 2.28 | 27% / 0% | 41% | 24/9/8/18/19 |
| BASEBALL :: BLOCK 2 | 32 | 300 | DB 28, BB 15, BW 13, BW-bal 13, MB 12, CBL 6 | 54% | 2.20 | 29% / 0% | 46% | 25/13/6/18/19 |
| BASEBALL :: BLOCK 3 | 32 | 297 | DB 30, BW-bal 20, BW 12, MB 11, BB 11, CBL 5 | 48% | 2.21 | 30% / 0% | 43% | 27/6/8/17/20 |
| 4 TRACKS - HYBRID (strength-athletic-crossfitish) :: weeks E:L | 40 | 120 | BB 41, DB 28, BW-bal 15, CARDIO 7, LOAD? 3, KB 2 | 33% | 2.23 | 15% / 0% | 33% | 12/15/28/32/0 |
| BOXING 8 WEEK BUILD UP :: Weeks 1-2 | 4 | 28 | DB 43, BB 14, MACH 14, BW 11, CARDIO 7, CBL 7 | 50% | 3.23 | 4% / 15% | 7% | 4/0/14/43/21 |
| BOXING 8 WEEK BUILD UP :: Weeks 3-8 | 4 | 25 | DB 28, BB 20, MB 12, BW-bal 12, LOAD? 8, MACH 8 | 44% | 2 | 39% / 9% | 56% | 28/20/4/24/16 |
| CROSSFIT SPLIT :: COMPETE CROSSFIT SPLIT (monthly grid) | 51 | 145 | ? 43, BB 30, CARDIO 20, BW 6 | 0% | 2.55 | 0% / 0% | 32% | 0/14/17/19/0 |
| CROSSFIT SPLIT :: CLASS PROGRAMMING SPLIT (P1) | 6 | 9 | BB 56, CARDIO 33, BW 11 | 0% | 2.60 | 0% / 0% | 22% | 0/22/33/0/0 |

### 2.1 By population

| Population | programs | sess | items | top implements | mean constraint | c1 / c2 / c3 / c4 / c5 % | fast/ballistic % | T1/T2/T3/T4/T5/CORE/COND % |
|---|---|---|---|---|---|---|---|---|
| GEN POP (novice/newby/intermediate, aesthetics, fat-burn) | 4 TRACKS - AESTHETICS (bodybuilding style); FAT BURN / BODY TONING; PUSH/PULL/LEGS; UPPER/LOWER | 165 | 758 | DB 33, BB 18, MACH 18, CBL 15, CARDIO 5, BW 5, BW-bal 3 | 3.32 | 2% / 17% / 45% / 17% / 18% | 2% | 2/0/15/42/33/2/4 |
| STRENGTH / POWERLIFTING (conjugate) | 4 TRACKS - STRENGTH (conjugate style); CONJUGATE (NOT DONE) | 112 | 402 | BB 37, DB 35, MACH 11, BW 7, CBL 6, BW-bal 2, LOAD? 1 | 3.14 | 4% / 13% / 61% / 11% / 11% | 16% | 4/13/23/39/21/0/0 |
| ATHLETES (off-season athletic, baseball) | ATHLETIC FULL BODY; BASEBALL | 107 | 949 | DB 29, BW-bal 14, BB 13, MB 13, BW 13, CBL 5, CARDIO 4 | 2.20 | 30% / 28% / 33% / 9% / 0.2% | 44% | 26/10/7/17/18/14/7 |
| HYBRID ATHLETE (strength-athletic-crossfitish) | 4 TRACKS - HYBRID (strength-athletic-crossfitish) | 40 | 120 | BB 41, DB 28, BW-bal 15, CARDIO 7, LOAD? 3, KB 2, BW 2 | 2.23 | 15% / 46% / 38% / 0% / 0% | 33% | 12/15/28/32/0/0/13 |
| BOXING / FIGHTER | BOXING 8 WEEK BUILD UP | 8 | 53 | DB 36, BB 17, MACH 11, MB 8, CARDIO 6, BW 6, BW-bal 6 | 2.65 | 20% / 31% / 24% / 12% / 12% | 30% | 15/9/9/34/19/6/8 |
| CROSSFIT | CROSSFIT SPLIT | 57 | 154 | ? 41, BB 32, CARDIO 21, BW 6 | 2.55 | 0% / 45% / 55% / 0% / 0% | 31% | 0/14/18/18/0/0/37 |

### 2.2 Which implement carries each tier (population totals, item counts)

| Population | T1 power | T2 power-strength | T3 strength | T4 resistance pattern | T5 isolation |
|---|---|---|---|---|---|
| GEN POP (novice/newby/intermediate, aesthetics, fat-burn) | BW-bal 18 | - | BB 113 | DB 171, MACH 80, CBL 47, BW 22 | DB 82, CBL 65, MACH 55, BB 23, ? 16, ANY 6 |
| STRENGTH / POWERLIFTING (conjugate) | BW-bal 10, LOAD? 4 | BB 42, MACH 6, DB 4 | BB 94 | DB 100, BW 28, MACH 16, CBL 12 | DB 38, MACH 24, CBL 12, BB 12 |
| ATHLETES (off-season athletic, baseball) | BW-bal 117, MB 112, DB 15, LOAD? 4, BAND 2 | BB 43, DB 24, KB 21, LOAD? 3, BAND 2, BW 1 | BB 63, CBL 3, DB 1, BW 1 | DB 120, BW 28, CBL 6, BB 4, KB 4, MACH 1 | DB 110, CBL 27, BB 14, SLD/SB 11, MACH 3, BW 3 |
| HYBRID ATHLETE (strength-athletic-crossfitish) | BW-bal 12, LOAD? 2 | BB 16, LOAD? 2 | BB 33 | DB 34, KB 3, BW 2 | - |
| BOXING / FIGHTER | MB 4, BW-bal 2, LOAD? 1, BAND 1 | BB 4, DB 1 | BB 5 | DB 15, CBL 2, LOAD? 1 | MACH 6, DB 3, SLD/SB 1 |
| CROSSFIT | - | BB 22 | BB 27 | ? 28 | - |

INFERRED reading: T1 is bodyweight plus medball everywhere. T2 is barbell (Olympic lifts, DE), KB (swings, KB cleans) and hex/DB (loaded jumps). T3 is barbell. T4 is DB-led, with machines and cables only in gen pop. T5 is DB-led in athlete programs and machine/cable-led in gen-pop programs.

## 3. Testing the claimed order: power > power-strength > strength > resistance > isolation

- Only T1-T5 items enter the order tests; CORE, CONDITIONING, WARMUP, SKILL, PLACEHOLDER are reported by position only.
- 'monotonic' = no adjacent drop in tier rank; 'concordance' = share of all item pairs (i<j) with rank_i <= rank_j.
- 'excl_partD_ballistics' drops BASEBALL Part D ballistic accessories (ankle hops, hurdle hops, DB snatch in the calf/shoulder slot).
- 'adjusted' also re-tiers a jump paired straight after a heavy bilateral lift (e.g. 'Barbell deadlift' + 'Broad jumps') as one T2 contrast pair.
- Row order is treated as execution order. That is OBSERVED for BASEBALL (Part A-E) and INFERRED elsewhere.

| Program :: variant | sess with 2+ ranked items | monotonic raw | excl. Part D ballistics | adjusted (contrast pairs) | pairwise concordance | Spearman pos-vs-tier | power item first | whole power block before resistance | mean rel. position T1 / T2 / T3 / T4 / T5 / CORE / COND |
|---|---|---|---|---|---|---|---|---|---|
| UPPER/LOWER :: NOVICE | 2 | 100% | 100% | 100% | 1.000 | 0.918 | 100% | 100% | 0.20 / - / 0.40 / 0.44 / 0.85 / - / - |
| UPPER/LOWER :: NEWBY | 2 | 100% | 100% | 100% | 1.000 | 0.918 | 100% | 100% | 0.20 / - / 0.40 / 0.44 / 0.85 / - / - |
| UPPER/LOWER :: INTERMEDIATE | 2 | 100% | 100% | 100% | 1.000 | 0.918 | 100% | 100% | 0.20 / - / 0.40 / 0.44 / 0.85 / - / - |
| PUSH/PULL/LEGS :: NOVICE | 3 | 33% | 33% | 33% | 0.878 | 0.598 | 100% | 100% | 0.20 / - / 0.53 / 0.52 / 0.78 / - / - |
| PUSH/PULL/LEGS :: NEWBY | 3 | 33% | 33% | 33% | 0.878 | 0.598 | 100% | 100% | 0.20 / - / 0.53 / 0.52 / 0.78 / - / - |
| PUSH/PULL/LEGS :: INTERMEDIATE | 3 | 33% | 33% | 33% | 0.878 | 0.598 | 100% | 100% | 0.20 / - / 0.53 / 0.52 / 0.78 / - / - |
| FAT BURN / BODY TONING :: MUSCLE BUILDING | 16 | 50% | 50% | 50% | 0.938 | 0.762 | - | - | - / - / 0.13 / 0.41 / 0.90 / - / - |
| FAT BURN / BODY TONING :: CIRCUITS RECCOMENDED | 6 | 100% | 100% | 100% | 1.000 | - | - | - | - / - / - / 0.53 / 0.33 / 0.52 / 0.50 |
| 4 TRACKS - AESTHETICS (bodybuilding style) :: 8-week columns E:L | 28 | 79% | 79% | 79% | 0.940 | 0.669 | - | - | - / - / 0.15 / 0.49 / 0.73 / - / - |
| 4 TRACKS - AESTHETICS (bodybuilding style) :: 12-week columns O:Z | 72 | 32% | 32% | 32% | 0.895 | 0.573 | - | - | - / - / 0.21 / 0.44 / 0.66 / - / - |
| 4 TRACKS - STRENGTH (conjugate style) :: 8-week columns E:L | 28 | 100% | 100% | 100% | 1.000 | 0.924 | 100% | 100% | 0.00 / 0.17 / 0.16 / 0.75 / 1.00 / - / - |
| 4 TRACKS - STRENGTH (conjugate style) :: 12-week columns O:Z | 48 | 100% | 100% | 100% | 1.000 | 0.958 | 100% | 100% | - / 0.00 / 0.15 / 0.49 / 0.89 / - / - |
| CONJUGATE (NOT DONE) :: 8 WEEK CYCLE | 28 | 100% | 100% | 100% | 1.000 | 0.924 | 100% | 100% | 0.00 / 0.17 / 0.16 / 0.75 / 1.00 / - / - |
| ATHLETIC FULL BODY :: STARTING OFF SEASON WORKOUTS | 3 | 0% | 0% | 0% | 0.691 | 0.087 | 67% | 0% | 0.51 / 0.43 / 0.67 / 0.31 / 0.92 / 0.39 / 1.00 |
| ATHLETIC FULL BODY :: MID OFF SEASON WORKOUTS | 4 | 50% | 50% | 50% | 0.973 | 0.806 | 100% | 50% | 0.29 / 0.78 / 0.61 / 0.80 / 0.94 / 0.60 / - |
| ATHLETIC FULL BODY :: ADVANCED OFF SEASON WORKOUTS | 4 | 75% | 75% | 75% | 0.875 | 0.749 | 100% | 75% | 0.12 / 0.69 / 0.66 / 0.52 / 0.76 / 0.64 / - |
| BASEBALL :: BLOCK 1 | 28 | 46% | 79% | 79% | 0.921 | 0.773 | 100% | 93% | 0.19 / 0.48 / 0.48 / 0.62 / 0.82 / 0.25 / 1.00 |
| BASEBALL :: BLOCK 2 | 32 | 56% | 78% | 84% | 0.940 | 0.826 | 97% | 84% | 0.17 / 0.45 / 0.43 / 0.62 / 0.83 / 0.27 / 1.00 |
| BASEBALL :: BLOCK 3 | 32 | 53% | 84% | 88% | 0.933 | 0.797 | 100% | 97% | 0.18 / 0.57 / 0.43 / 0.62 / 0.81 / 0.26 / 1.00 |
| 4 TRACKS - HYBRID (strength-athletic-crossfitish) :: weeks E:L | 40 | 20% | 20% | 20% | 0.600 | 0.438 | 25% | 25% | 0.46 / 0.31 / 0.22 / 0.58 / - / - / 0.00 |
| BOXING 8 WEEK BUILD UP :: Weeks 1-2 | 4 | 100% | 100% | 100% | 1.000 | 0.936 | 100% | 100% | 0.00 / - / 0.30 / 0.58 / 0.92 / 0.11 / 0.00 |
| BOXING 8 WEEK BUILD UP :: Weeks 3-8 | 4 | 25% | 25% | 25% | 0.872 | 0.642 | 75% | 50% | 0.19 / 0.57 / 0.71 / 0.71 / 0.83 / - / 0.00 |
| CROSSFIT SPLIT :: COMPETE CROSSFIT SPLIT (monthly grid) | 0 | - | - | - | - | - | - | - | - / - / - / - / - / - / - |
| CROSSFIT SPLIT :: CLASS PROGRAMMING SPLIT (P1) | 1 | 0% | 0% | 0% | 0.000 | - | 50% | 0% | - / 1.00 / 0.33 / - / - / - / 1.00 |

| Population | monotonic raw | adjusted | concordance | Spearman | power first |
|---|---|---|---|---|---|
| GEN POP (novice/newby/intermediate, aesthetics, fat-burn) | 50% | 50% | 0.917 | 0.634 | 100% |
| STRENGTH / POWERLIFTING (conjugate) | 100% | 100% | 1.000 | 0.940 | 100% |
| ATHLETES (off-season athletic, baseball) | 52% | 80% | 0.924 | 0.777 | 98% |
| HYBRID ATHLETE (strength-athletic-crossfitish) | 20% | 20% | 0.600 | 0.438 | 25% |
| BOXING / FIGHTER | 62% | 62% | 0.936 | 0.768 | 80% |
| CROSSFIT | 0% | 0% | 0.000 | - | 50% |

### 3.1 BASEBALL Part structure (OBSERVED labels; tier and implement counts INFERRED)

| Part | lines | tiers | implements |
|---|---|---|---|
| Part A | 177 | T1 170, CORE 6, T4 1 | BW-bal 86, MB 77, DB 6, KB 6, BW 1, BAND 1 |
| Part B | 124 | CORE 114, T1 10 | BW 75, MB 16, PLATE 16, CBL 14, KB 1, DB 1, LOAD? 1 |
| OPTIONAL PIECE | 24 | T2 24 | BB 24 |
| Part C | 192 | T4 67, T3 62, T2 45, T1 8, T5 6, COND 4 | BB 76, DB 55, KB 19, BW 14, CBL 14, BW-bal 6, CARDIO 4 |
| Part D | 275 | T5 156, T4 80, T1 25, T2 10, CORE 3, T3 1 | DB 185, CBL 21, BW 18, BB 15, BW-bal 14, SLD/SB 11, KB 5 |
| Part E | 62 | COND 59, ? 3 | CARDIO 38, BW-bal 20, ? 4 |

Coach's slot labels in the column to the left of each day (OBSERVED, e.g. `02:P28`, `02:P30`, `02:P33`): Part A = 'Upper Ballistics/plyo' (Mon/Thu) or 'LOWER ballistics/plyo' (Tue/Fri). Part B = 'LATERAL CORE' / 'Transverse core' / 'Sagital core'. Part C = 'bkd'/'bhd' (bilateral knee/hip dominant) followed by 'horiz pull' / 'horiz push' / 'vert pull' / 'vert push'. Part D = 'uhd'/'ukd' followed by 'bicep' / 'tricep' / 'calfs' / 'shoulders'. Part E = 'Buy out'. Day tags under the days (`02:P40`, `T40`, `AB40`): MONDAY 'Speed', TUESDAY 'strength', FRIDAY 'speed', THURSDAY untagged.

`OPTIONAL PIECE` / 'OLY' rows (all OBSERVED, pink D5A6BD fill). They sit after Part B core and before Part C strength:

- `02:BG51 'Hang cleans @ 75%' 4x8`
- `02:BK51 'Hang snatch @ 75%' 4x8`
- `02:BO51 'Hang cleans @ 75%' 4x8`
- `02:BS51 'Hang Snatch @ 75%' 4x8`
- `02:BY51 'Hang cleans @ 80%' 4x6`
- `02:CC51 'Hang snatch @ 80%' 4x6`
- `02:CG51 'Hang cleans @ 80%' 4x6`
- `02:CK51 'Hang Snatch @ 80%' 4x6`
- `02:CM33 'Hang cleans @ 75%' 4x8`
- `02:CQ33 'Hang snatch @ 75%' 4x8`
- `02:CQ51 'Hang cleans @ 85%' 4x6`
- `02:CU33 'Hang cleans @ 75%' 4x8`
- `02:CU51 'Hang snatch @ 85%' 4x6`
- `02:CY33 'Hang Snatch @ 75%' 4x8`
- `02:CY51 'Hang cleans @ 85%' 4x6`
- `02:DC51 'Hang Snatch @ 85%' 4x6`
- `02:DE33 'Hang cleans @ 80%' 4x6`
- `02:DH50 'Hang cleans @ 90%' 4x4`
- `02:DI33 'Hang snatch @ 80%' 4x6`
- `02:DL50 'Hang snatch @ 90%' 4x4`
- `02:DM33 'Hang cleans @ 80%' 4x6`
- `02:DP50 'Hang cleans @ 90%' 4x4`
- `02:DQ33 'Hang Snatch @ 80%' 4x6`
- `02:DT50 'Hang Snatch @ 90%' 4x4`

### 3.2 Every type of order break (adjacent drop in tier), most frequent first

| program | from | to | n | example (cells) |
|---|---|---|---|---|
| 4 TRACKS - AESTHETICS (bodybuilding style) | T5 isolation | T4 upper_compound | 32 | G43 UPRIGHT ROWS -> G44 DB ROWS |
| 4 TRACKS - AESTHETICS (bodybuilding style) | T5 isolation | T3 upper_compound | 19 | O35 cable Side Raises -> O36 Incline bench |
| BASEBALL | T5 isolation | T1 plyo_jump_hop | 19 | D37 Bicep Curls -> D38 Side to side hurdle hops |
| 4 TRACKS - AESTHETICS (bodybuilding style) | T4 bilateral_lower | T3 bilateral_lower | 13 | O42 LEG PRESS -> O43 DEADLIFTS |
| 4 TRACKS - HYBRID (strength-athletic-crossfitish) | T3 bilateral_lower | T2 olympic_lift | 13 | E74 FRONT SQUATS -> E75 2x 2 clean pulls, 2 power cleans |
| CROSSFIT SPLIT | T3 strength_slot | T2 olympic_lift | 9 | B121 STRENGTH: KNEE DOM -> B122 POWER: SNATCH |
| 4 TRACKS - HYBRID (strength-athletic-crossfitish) | T4 unilateral_lower | T3 upper_compound | 8 | E94 uni RDL/ core/ OH press -> D95 OH press |
| 4 TRACKS - AESTHETICS (bodybuilding style) | T4 upper_compound | T3 upper_compound | 7 | H43 DB ROWS -> H44 OVERHEAD PRESS |
| BASEBALL | T5 isolation | T4 unilateral_lower | 5 | AA34 Cable lat pull over -> AA36 camporini dl |
| FAT BURN / BODY TONING | T4 bilateral_lower | T3 bilateral_lower | 4 | D7 LEG PRESS -> D8 DEALIFTS |
| 4 TRACKS - AESTHETICS (bodybuilding style) | T5 isolation | T4 bilateral_lower | 4 | W60 leg curls one leg at a time -> W61 2 sets LEG PRESS MYO - 15-5-5-5-5-5 |
| BASEBALL | T5 isolation | T2 olympic_lift | 4 | BG37 Ropte Tricep Extensions -> BG38 Single Arm DB snatch from floor |
| PUSH/PULL/LEGS | T5 isolation | T3 upper_compound | 3 | C17 Side raises -> C18 Barbell Bench press |
| PUSH/PULL/LEGS | T5 isolation | T4 upper_compound | 3 | C27 DB Reverse Flies or Machine -> C28 Cable Lat pulldown |
| FAT BURN / BODY TONING | T5 isolation | T4 upper_compound | 3 | G27 SIDE RAISES -> G28 MACHINE SUPPORTED ROW |
| ATHLETIC FULL BODY | T4 unilateral_lower | T2 olympic_lift | 3 | C35 HEAVY: Heavy walking lunges -> C36 SUPERSET: Low Hang Power Cleans (mid weight) |
| BASEBALL | T5 isolation | T2 push_press_jerk | 3 | M37 overhead db tricep ext -> M38 sesaw push press |
| 4 TRACKS - HYBRID (strength-athletic-crossfitish) | T4 bilateral_lower | T2 olympic_lift | 3 | E86 KB DL -> E87 2x 2 snatch pulls, 2 power snatches |
| 4 TRACKS - HYBRID (strength-athletic-crossfitish) | T3 upper_compound | T1 plyo_jump_hop | 3 | G81 3x8 - barbell bench press/ core -> G82 depth drop to jump |
| BASEBALL | T2 kb_swing | T1 medball_throw | 2 | BO33 Banded KB swings -> BO34 medball press |
| BASEBALL | T5 isolation | T4 upper_compound | 2 | DQ38 cable overhead tricep extensions -> DQ39 Pushups |
| BASEBALL | T3 bilateral_lower | T1 plyo_jump_hop | 2 | I51 Barbell deadlift -> I52 Broad jumps |
| BASEBALL | T3 bilateral_lower | T2 dynamic_effort | 2 | CC52 heavy deadlifts -> CC53 fast banded assisted bench press |
| BASEBALL | T2 push_press_jerk | T1 jump_squat | 2 | DC53 Single arm DB push press -> DC55 split stance jump squats |
| 4 TRACKS - HYBRID (strength-athletic-crossfitish) | T4 upper_compound | T1 plyo_landing | 2 | E81 3x6 - DB bench press/ core -> E82 Depth drops |
| 4 TRACKS - HYBRID (strength-athletic-crossfitish) | T4 upper_compound | T1 plyo_jump_hop | 2 | I81 3x10 DB bench press/ core -> I82 box jumps |
| FAT BURN / BODY TONING | T4 upper_compound | T3 upper_compound | 1 | M14 DB ROWS -> M15 OVERHEAD PRESS |
| ATHLETIC FULL BODY | T2 loaded_jump | T1 sprint_drill | 1 | C14 Really high jump squats LOAD & jump hard -> C15 High Knee Runs FAST |
| ATHLETIC FULL BODY | T4 upper_compound | T2 contrast_complex | 1 | C16 HEAVY Single arm rotational half kneeling cable row or b -> C17 SUPERSET: HEAVY Hex bar Squats direclty into 10 Repeat J |
| ATHLETIC FULL BODY | T2 push_press_jerk | T1 plyo_jump_hop | 1 | C19 Standing Overhead DB sesaw push presses -> C20 Lateral mid size box step up jumps directly into nordic  |
| ATHLETIC FULL BODY | T2 olympic_lift | T1 upper_plyo | 1 | C28 Staggered stance DB snatch -> C29 Plyo Push ups - one side raised |
| ATHLETIC FULL BODY | T4 unilateral_lower | T2 speed_strength_upper | 1 | F46 Unilateral Deadlift DB loaded -> F47 Max speed banded lat pull downs half kneeling ipsilatera |
| ATHLETIC FULL BODY | T5 isolation | T4 unilateral_lower | 1 | J40 Heel raises & fast/rythmic/1/4 SQUATS -> J41 Lateral Step ups IPSILATERAL loading |
| BASEBALL | T4 upper_compound | T1 plyo_jump_hop | 1 | S34 seal rows 10 reps all rounds -> S36 highest ankle hops |
| BASEBALL | T4 upper_compound | T3 upper_compound | 1 | AW37 offset pushups -> AW38 bent over rows |
| BASEBALL | T3 bilateral_lower | T1 upper_plyo | 1 | BY33 barbell Deadlifts -> BY34 plyo pushups |
| BASEBALL | T4 bilateral_lower | T2 push_press_jerk | 1 | CY34 45 degree hyper-extension machine -> CY35 Single arm DB push press |
| BASEBALL | T4 upper_compound | T1 sprint_drill | 1 | DE35 Seal rows -> DE37 Banded tantrums (sprint) |
| BASEBALL | T3 bilateral_lower | T2 olympic_lift | 1 | E51 Heavy front squats -> E52 KB squat cleans |
| BASEBALL | T2 dynamic_effort | T1 jump_squat | 1 | AO51 Front squats - light weights - same speed for all reps -> AO52 Jump squats |
| BASEBALL | T4 upper_compound | T1 medball_throw | 1 | AW46 push ups -> AW47 MB fast chest pass |
| BASEBALL | T4 unilateral_lower | T1 plyo_jump_hop | 1 | DP54 staggered stance db deadlift -> DP55 DB ankle hops |
| BASEBALL | T4 upper_compound | T1 jump_squat | 1 | CA70 inclined db bench press -> CA72 alternating split stance jumps FFE (box) |
| 4 TRACKS - HYBRID (strength-athletic-crossfitish) | T3 upper_compound | T2 loaded_jump | 1 | H81 3x8 - barbell incline bench press/ core -> H82 weighted depth drops to jump |
| BOXING 8 WEEK BUILD UP | T4 unilateral_lower | T3 bilateral_lower | 1 | L11 Lateral box step up IPSILATERAL LOAD -> L12 DEADLIFTS (1-2RIR) + 3 min Jump Rope |
| BOXING 8 WEEK BUILD UP | T4 upper_compound | T2 olympic_lift | 1 | L20 Single Leg swiss ball knee tuck in + DB rows -> L21 DB snatches |
| BOXING 8 WEEK BUILD UP | T5 isolation | T1 medball_throw | 1 | L33 Side Raises + Front Raises -> L34 8 Box Med Ball rocker into 4 hops + Swiss ball knee tuck |

INFERRED interpretation of the breaks:
- **BASEBALL T5 > T1 (Part D):** 'Bicep Curls' > 'Side to side hurdle hops', and ankle hops in the 'calfs' slot. Low-intensity plyos are used as **calf/foot accessories** at the end of the session. They are not power work. A generator should tag them as accessory plyo and allow them late.
- **BASEBALL T5 > T2 in Part D 'shoulders' slot:** 'Single Arm DB snatch from floor', 'db push press', 'DB HIGH PULL', 'KB high pull'. Light ballistic DB/KB work is used as a shoulder accessory.
- **BASEBALL T3 > T1/T2 in Part C:** 'Barbell deadlift' + 'Broad jumps' (contrast) and 'barbell Deadlifts' + 'plyo pushups'. The upper-body slot of the strength superset is sometimes filled with a ballistic variant ('plyo pushups', 'medball press', 'Single arm DB push press', 'fast banded assisted bench press').
- **HYBRID T3 > T2 (13x) and CrossFit grid STRENGTH > POWER:** strength is listed before Olympic lifts. If this is execution order, it contradicts the athlete rule. See open questions.
- **AESTHETICS T5 > T3/T4:** isolation-first (side raises, upright rows, leg curls before leg press MYO) is a deliberate bodybuilding choice ('bodybuilding style', `04:C30`). The order also **rotates by week**: wk1 'DB BENCH PRESS' > 'UNILATERAL LAT PULL DOWN', wk2 reversed (`04:E41:F42`).
- **FAT BURN T4 > T3:** 'LEG PRESS' leads in wk1/wk3 and 'DEAFLITS'/'DEADLIFTS' in wk2/wk4 (`01:D7`, `G7`, `J7`, `M7`). The first-exercise slot rotates between a machine and a barbell by week.

### 3.3 Constraint test: does the session move from low to high constraint (free and fast to machine)?

| Program :: variant | constraint first half | second half | Spearman pos-vs-constraint | strictly non-decreasing % |
|---|---|---|---|---|
| UPPER/LOWER :: NOVICE | 2.40 | 3.20 | 0.782 | 50% |
| UPPER/LOWER :: NEWBY | 2.40 | 3.20 | 0.782 | 50% |
| UPPER/LOWER :: INTERMEDIATE | 2.40 | 3.20 | 0.782 | 50% |
| PUSH/PULL/LEGS :: NOVICE | 2.71 | 3.13 | 0.326 | 33% |
| PUSH/PULL/LEGS :: NEWBY | 2.60 | 3.13 | 0.782 | 67% |
| PUSH/PULL/LEGS :: INTERMEDIATE | 2.60 | 3.13 | 0.782 | 67% |
| FAT BURN / BODY TONING :: MUSCLE BUILDING | 3.31 | 3.44 | 0.044 | 0% |
| FAT BURN / BODY TONING :: CIRCUITS RECCOMENDED | 2.33 | 3 | - | 100% |
| 4 TRACKS - AESTHETICS (bodybuilding style) :: 8-week columns E:L | 3.25 | 2.79 | -0.479 | 0% |
| 4 TRACKS - AESTHETICS (bodybuilding style) :: 12-week columns O:Z | 3.78 | 3.46 | -0.139 | 6% |
| 4 TRACKS - STRENGTH (conjugate style) :: 8-week columns E:L | 2.75 | 2.75 | -0.151 | 36% |
| 4 TRACKS - STRENGTH (conjugate style) :: 12-week columns O:Z | 3.58 | 3.50 | 0.070 | 0% |
| CONJUGATE (NOT DONE) :: 8 WEEK CYCLE | 2.79 | 2.75 | -0.207 | 36% |
| ATHLETIC FULL BODY :: STARTING OFF SEASON WORKOUTS | 1.50 | 2.14 | 0.412 | 33% |
| ATHLETIC FULL BODY :: MID OFF SEASON WORKOUTS | 1 | 2.09 | 0.766 | 50% |
| ATHLETIC FULL BODY :: ADVANCED OFF SEASON WORKOUTS | 1.50 | 2.67 | 0.634 | 25% |
| BASEBALL :: BLOCK 1 | 1.72 | 2.57 | 0.597 | 0% |
| BASEBALL :: BLOCK 2 | 1.56 | 2.60 | 0.664 | 3% |
| BASEBALL :: BLOCK 3 | 1.56 | 2.54 | 0.603 | 0% |
| 4 TRACKS - HYBRID (strength-athletic-crossfitish) :: weeks E:L | 2.60 | 2 | -0.244 | 20% |
| BOXING 8 WEEK BUILD UP :: Weeks 1-2 | 2.88 | 3.79 | 0.495 | 0% |
| BOXING 8 WEEK BUILD UP :: Weeks 3-8 | 1.60 | 2.38 | 0.464 | 25% |
| CROSSFIT SPLIT :: COMPETE CROSSFIT SPLIT (monthly grid) | - | - | - | - |
| CROSSFIT SPLIT :: CLASS PROGRAMMING SPLIT (P1) | 3 | 2 | - | 0% |

Result (INFERRED): constraint rises through the session for athletes (1.58 > 2.54), UL/PPL, fat burn and boxing. It is flat for the conjugate strength tracks, where the barbell is always first and DB unilateral work comes later, and for CrossFit. It falls in the AESTHETICS track (3.78 > 3.46 in the 12-week columns) because cable/machine isolation opens the session. A strict rise in constraint is rare everywhere, because free-weight isolation (constraint 3) usually follows cable or machine work (constraint 4-5) at the end.

## 4. Horizontal before vertical

Counted only for T2-T5 upper lines; medball/plyo push variants (T1) are excluded. A session counts when it contains both patterns.

| Program :: variant | pull: H before V | V before H | only H | only V | push: H before V | V before H | only H | only V |
|---|---|---|---|---|---|---|---|---|
| UPPER/LOWER :: NOVICE | 1 | 0 | 0 | 0 | 1 | 0 | 0 | 0 |
| UPPER/LOWER :: NEWBY | 1 | 0 | 0 | 0 | 1 | 0 | 0 | 0 |
| UPPER/LOWER :: INTERMEDIATE | 1 | 0 | 0 | 0 | 1 | 0 | 0 | 0 |
| PUSH/PULL/LEGS :: NOVICE | 1 | 0 | 0 | 0 | 0 | 0 | 1 | 0 |
| PUSH/PULL/LEGS :: NEWBY | 1 | 0 | 0 | 0 | 0 | 0 | 1 | 0 |
| PUSH/PULL/LEGS :: INTERMEDIATE | 1 | 0 | 0 | 0 | 0 | 0 | 1 | 0 |
| FAT BURN / BODY TONING :: MUSCLE BUILDING | 0 | 8 | 0 | 0 | 2 | 0 | 6 | 0 |
| FAT BURN / BODY TONING :: CIRCUITS RECCOMENDED | 0 | 0 | 0 | 0 | 0 | 0 | 2 | 2 |
| 4 TRACKS - AESTHETICS (bodybuilding style) :: 8-week columns E:L | 0 | 14 | 0 | 0 | 6 | 0 | 8 | 0 |
| 4 TRACKS - AESTHETICS (bodybuilding style) :: 12-week columns O:Z | 0 | 24 | 0 | 0 | 0 | 5 | 19 | 0 |
| 4 TRACKS - STRENGTH (conjugate style) :: 8-week columns E:L | 0 | 0 | 14 | 14 | 0 | 4 | 10 | 0 |
| 4 TRACKS - STRENGTH (conjugate style) :: 12-week columns O:Z | 0 | 0 | 12 | 12 | 0 | 0 | 24 | 0 |
| CONJUGATE (NOT DONE) :: 8 WEEK CYCLE | 0 | 0 | 14 | 14 | 0 | 6 | 8 | 0 |
| ATHLETIC FULL BODY :: STARTING OFF SEASON WORKOUTS | 0 | 0 | 1 | 1 | 0 | 0 | 0 | 1 |
| ATHLETIC FULL BODY :: MID OFF SEASON WORKOUTS | 0 | 0 | 1 | 2 | 0 | 0 | 1 | 1 |
| ATHLETIC FULL BODY :: ADVANCED OFF SEASON WORKOUTS | 0 | 0 | 1 | 0 | 0 | 0 | 0 | 1 |
| BASEBALL :: BLOCK 1 | 0 | 0 | 8 | 7 | 0 | 2 | 7 | 4 |
| BASEBALL :: BLOCK 2 | 0 | 0 | 7 | 10 | 0 | 1 | 10 | 6 |
| BASEBALL :: BLOCK 3 | 0 | 0 | 9 | 8 | 1 | 1 | 8 | 6 |
| 4 TRACKS - HYBRID (strength-athletic-crossfitish) :: weeks E:L | 0 | 0 | 0 | 0 | 0 | 0 | 8 | 8 |
| BOXING 8 WEEK BUILD UP :: Weeks 1-2 | 0 | 2 | 0 | 0 | 2 | 0 | 0 | 0 |
| BOXING 8 WEEK BUILD UP :: Weeks 3-8 | 0 | 0 | 1 | 0 | 0 | 0 | 0 | 0 |
| CROSSFIT SPLIT :: COMPETE CROSSFIT SPLIT (monthly grid) | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| CROSSFIT SPLIT :: CLASS PROGRAMMING SPLIT (P1) | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 1 |

**BASEBALL weekly H/V layout** (Part C upper slot; label = coach text OBSERVED; pattern = INFERRED from the exercise):

| Day | coach slot label (count) | classified pattern of the exercise (count) |
|---|---|---|
| MONDAY | 'horiz pull' 20 | H_PULL 21, V_PULL 2 |
| TUESDAY | 'horiz push' 20 | H_PUSH 23 |
| THURSDAY | 'vert pull' 20 | V_PULL 23 |
| FRIDAY | 'vert push' 20 | H_PUSH 1, V_PUSH 22 |

Exceptions: 'half kneeling SA cable lats pull down' was placed in the MONDAY 'horiz pull' slot (`02:BY53`, `02:DH52`), and 'inclined db  bench press' in the FRIDAY 'vert push' slot (`02:CA70`). The lower body mirrors the upper: MONDAY/THURSDAY carry 'bkd' and TUESDAY/FRIDAY carry 'bhd'. Bilateral lower work comes before unilateral in 68 athlete sessions; unilateral comes first in 3.

## 5. Week-to-week implement rotation inside one slot (the coach's "change small variables")

234 slots change exercise across weeks, and 162 of them also change implement. BASEBALL main slots (Part A#1 = first power item, Part C#1 = strength lift, Part C#2 = upper superset partner, Part D#1 = unilateral lift):

| Block / day / slot | implements used | sequence by week (exercise [primary implement]) |
|---|---|---|
| BLOCK 1 MONDAY Part A#1 | kettlebell, medball | Med ball half kneeling rotationss in & [medball] > sit up to chest pass [medball] > overhead toss [medball] > Rotational chest pass [medball] > back against wall med ball rotational  [medball] > Rotational chest pass [medball] > step forward into Overhead toss [medball] > Kettlebell arm bars [kettlebell] |
| BLOCK 1 MONDAY Part C#1 | barbell, bodyweight, cardio_any, dumbbell, hex_bar, kettlebell | DB Squat Jumps [dumbbell] > Hex bar squat jumps [hex_bar] > fast high zercher squats [barbell] > KB Squat cleans [kettlebell] > Front squats - light weights - same sp [barbell] > barbell High zercher squat [barbell] > Oscilating drop squats [bodyweight] > Paced Cardio - easy [cardio_any] |
| BLOCK 1 MONDAY Part C#2 | barbell, cable, dumbbell | DB Rows [dumbbell] > seal rows 10 reps all rounds [dumbbell] > seal rows 10 reps all rounds [dumbbell] > Cable half kneeling rotational row [cable] > bent over barbell rows same weight of  [barbell] > Heavy DB row [dumbbell] > Seal rows [dumbbell] |
| BLOCK 1 MONDAY Part D#1 | band, bodyweight, dumbbell, slider | Rear foot on wall DB RDL [dumbbell] > highest ankle hops [bodyweight] > Glidder hamstring runners [slider] > Glidder hamstring runners [slider] > suitcase double dumbell staggered db R [dumbbell] > Staggered stance DB dl [dumbbell] > Banded tantrums (sprint) [band] |
| BLOCK 1 TUESDAY Part A#1 | bodyweight, dumbbell, kettlebell | Depth drop [bodyweight] > Depth drop - single leg [bodyweight] > Sit to jump on to box [bodyweight] > DB snap downs [dumbbell] > Single leg march jumps [bodyweight] > Hurdle hops [bodyweight] > Fast run/ walk back or 3 min walk/rest [bodyweight] > Kettlebell arm bars [kettlebell] |
| BLOCK 1 TUESDAY Part C#1 | barbell, cardio_any, hex_bar | Hex bar deadlift [hex_bar] > Barbell deadlift [barbell] > Barbell deadlift [barbell] > Staggered Barbell deadlift [barbell] > barbell Deadlifts [barbell] > Deadlifts [barbell] > deadlifts [barbell] > Paced Cardio - easy [cardio_any] |
| BLOCK 1 TUESDAY Part C#2 | bodyweight, dumbbell | DB Bottoms up bench press [dumbbell] > top down db bench press [dumbbell] > incline db bench press [dumbbell] > Top down incline db bench press [dumbbell] > plyo pushups [bodyweight] > db Bench press (small incline) [dumbbell] > DB bench press [dumbbell] |
| BLOCK 1 TUESDAY Part D#1 | dumbbell | RFE Bulgarian lunge [dumbbell] > DB reverse lunges [dumbbell] > ffe lunges - contralateral loading [dumbbell] > RFE lunges - contralateral loading [dumbbell] > doubdle db suitcase reverse lunges [dumbbell] > High zercher DB RFE Lunge front foot o [dumbbell] > DB alternating Deficit Reverse lunges  [dumbbell] |
| BLOCK 1 THURSDAY Part A#1 | kettlebell, medball | med ball rotational chest pass [medball] > step forward chest pass [medball] > situp to overhead toss [medball] > situp to chest pass [medball] > medball floor catch & release push [medball] > Medball Chest pass [medball] > Rotational med ball slams [medball] > Kettlebell arm bars [kettlebell] |
| BLOCK 1 THURSDAY Part C#1 | barbell, cardio_any, dumbbell | Back sqaut [barbell] > Goblet squat slow [dumbbell] > front squat [barbell] > front squat [barbell] > Back squats [barbell] > Zercher squats [barbell] > back squat [barbell] > Paced Cardio - easy [cardio_any] |
| BLOCK 1 THURSDAY Part C#2 | cable, pullup_bar | Pull Ups [pullup_bar] > Cable lat pull over [cable] > pull ups [pullup_bar] > pull ups [pullup_bar] > Cable lat pull over [cable] > Close grip cable lat pull down [cable] > pull ups [pullup_bar] |
| BLOCK 1 THURSDAY Part D#1 | dumbbell, swiss_ball | camporini dl [dumbbell] > camporini dl [dumbbell] > Swiss ball leg curls [swiss_ball] > Swiss ball kicks (30 seconds) [swiss_ball] > Alternating curls [dumbbell] > Staggered stance DB dl - Medial pressu [dumbbell] > heavy rear foot on wall db deadlift [dumbbell] |
| BLOCK 1 FRIDAY Part A#1 | bodyweight, kettlebell | Hurdle hops single leg [bodyweight] > single leg hops forward & back [bodyweight] > single leg lateral hops side to side [bodyweight] > forward bounds [bodyweight] > 10 meter acceleration from pushup posi [bodyweight] > High knee tuck in jumps [bodyweight] > Single leg seated jump on to box singl [bodyweight] > Kettlebell arm bars [kettlebell] |
| BLOCK 1 FRIDAY Part C#1 | bodyweight, cardio_any, dumbbell, kettlebell, machine | DB deadlifts [dumbbell] > KB swings [kettlebell] > broad jumps [bodyweight] > Banded KB swings [kettlebell] > KB swing [kettlebell] > 45 degree hyper-extension machine [machine] > kb swings heavy [kettlebell] > Paced Cardio - easy [cardio_any] |
| BLOCK 1 FRIDAY Part C#2 | barbell, dumbbell, landmine, medball | LAndmine half kneeling press [landmine] > barbell press [barbell] > barbell press [barbell] > medball press [medball] > one dumbbell half kneeling single arm  [dumbbell] > Single arm DB push press [dumbbell] > DB sesaw presses [dumbbell] |
| BLOCK 1 FRIDAY Part D#1 | dumbbell, kettlebell | Front foot elevated ipsilateral lunge [dumbbell] > DB forward lunge [dumbbell] > db contralateral step up [dumbbell] > step ups - dbs on both hands [dumbbell] > Front & Rear foot elevated lunges [dumbbell] > Suitcase DB RFE lunge jumps [dumbbell] > kb front rack lateral lunge kb lunges [kettlebell] |
| BLOCK 2 MONDAY Part A#1 | medball | overhead toss [medball] > Rotational chest pass [medball] > lateral lunge to Medball scoop [medball] > Push ups/chest pass [medball] > Situp to chest pass [medball] > step to chest pass [medball] > Situp to chest pass [medball] > step to chest pass [medball] |
| BLOCK 2 MONDAY Part C#1 | barbell, kettlebell | Heavy front squats [barbell] > KB Squat cleans [kettlebell] > Front squats - light weights - same sp [barbell] > barbell High zercher squat [barbell] > front squats/high jumps/hex bar squat  [barbell] > back squats/banded jumps/DB squat jump [barbell] > front squats/high jumps/hex bar squat  [barbell] > front squats [barbell] |
| BLOCK 2 MONDAY Part C#2 | bodyweight, cable, dumbbell, kettlebell | KB squat cleans [kettlebell] > Cable half kneeling rotational row [cable] > Jump squats [bodyweight] > Heavy DB row [dumbbell] > half kneeling SA cable lats pull down [cable] > seal DB row [dumbbell] > half kneeling SA cable lats pull down [cable] > seal DB row [dumbbell] |
| BLOCK 2 MONDAY Part D#1 | bodyweight, dumbbell, slider | Glidder hamstring runners [slider] > Glidder hamstring runners [slider] > suitcase double dumbell staggered db R [dumbbell] > Staggered stance DB dl [dumbbell] > SL glute bridge [bodyweight] > camporini deadlift [dumbbell] > SL glute bridge [bodyweight] > camporini deadlift [dumbbell] |
| BLOCK 2 TUESDAY Part A#1 | bodyweight, dumbbell | Sit to jump on to box with DBs [dumbbell] > DB snap downs [dumbbell] > Single leg march jumps [bodyweight] > Hurdle hops [bodyweight] > A March/ A skips/ A runners [bodyweight] > single leg hops [bodyweight] > A March/ A skips/ A runners [bodyweight] > single leg hops [bodyweight] |
| BLOCK 2 TUESDAY Part C#1 | barbell | Barbell deadlift [barbell] > Staggered Barbell deadlift [barbell] > barbell Deadlifts [barbell] > Deadlifts [barbell] > heavy deadlifts [barbell] > Deadlifts [barbell] > heavy deadlifts [barbell] > Deadlifts [barbell] |
| BLOCK 2 TUESDAY Part C#2 | barbell, bodyweight, dumbbell | Broad jumps [bodyweight] > Top down incline db bench press [dumbbell] > DB flat bench press [dumbbell] > Alternating DB Bench press (small incl [dumbbell] > fast banded assisted bench press [barbell] > Alternating DB Bench press (botton up) [dumbbell] > fast banded assisted bench press [barbell] > Alternating DB Bench press (botton up) [dumbbell] |
| BLOCK 2 TUESDAY Part D#1 | dumbbell | ffe lunges - contralateral loading [dumbbell] > RFE lunges - doubke db suitcase loadin [dumbbell] > db high zercher step ups [dumbbell] > High zercher DB RFE Lunge front foot o [dumbbell] > DB alternating Deficit Reverse lunges  [dumbbell] > heavy DB step ups [dumbbell] > DB alternating Deficit Reverse lunges  [dumbbell] > DB step ups [dumbbell] |
| BLOCK 2 THURSDAY Part A#1 | bodyweight, medball | situp to overhead toss [medball] > situp to chest pass [medball] > push ups [bodyweight] > Lateral hinge to MB Chest pass [medball] > half kneeling Rotational med ball slam [medball] > lay down MB presses [medball] > half kneeling Rotational med ball slam [medball] > lay down MB presses [medball] |
| BLOCK 2 THURSDAY Part C#1 | barbell, dumbbell, hex_bar, kettlebell | front squat [barbell] > front squat [barbell] > heavy hex bar squats [hex_bar] > Hex bar jump squats [hex_bar] > kb clean squat [kettlebell] > banded front squats [barbell] > zercher squat [barbell] > goblet squats [dumbbell] |
| BLOCK 2 THURSDAY Part C#2 | cable, pullup_bar | pull ups [pullup_bar] > pull ups [pullup_bar] > Cable lat pull over [cable] > Pull ups or Close grip cable lat pull  [pullup_bar] > pull ups or banded assisted pull ups [pullup_bar] > weighted Pull ups or max reps Close gr [pullup_bar] > pull ups or banded assisted pull ups [pullup_bar] > Close grip cable lat pull down [cable] |
| BLOCK 2 THURSDAY Part D#1 | band, bodyweight, dumbbell, slider, swiss_ball | Banded rolling hamstring curls [band] > Swiss ball kicks (30 seconds) [swiss_ball] > SL glute bridges (heel on bench) [bodyweight] > Staggered stance DB dl - Medial pressu [dumbbell] > heavy rear foot on wall db deadlift [dumbbell] > hamstring runners [slider] > staggered stance db deadlift [dumbbell] > SL hip thurts march [bodyweight] |
| BLOCK 2 FRIDAY Part A#1 | bodyweight | single leg lateral hops side to side [bodyweight] > forward bounds [bodyweight] > A Marches / A skips / A runners [bodyweight] > Ankle hops [bodyweight] > Single leg hop to SL box jump [bodyweight] > Quick feet toe tap on step [bodyweight] > 2 Single leg hops to 1 SL box jump [bodyweight] > SL hops to plate [bodyweight] |
| BLOCK 2 FRIDAY Part C#1 | barbell, dumbbell, kettlebell, machine | DB High jumps Staggered stance switch [dumbbell] > Fast KB swings [kettlebell] > fast barbell deadlifts [barbell] > 45 degree hyper-extension machine - Kb [machine] > kb swings heavy [kettlebell] > banded kb swings [kettlebell] > kb swings heavy [kettlebell] > kb swings [kettlebell] |
| BLOCK 2 FRIDAY Part C#2 | barbell, dumbbell, landmine, medball | barbell overhead strict press [barbell] > medball press [medball] > one dumbbell half kneeling single arm  [dumbbell] > Single arm DB push press [dumbbell] > half kneeling landmine press [landmine] > Single arm DB push press [dumbbell] > sigle arm DB push split jerk [dumbbell] > Single arm DB press [dumbbell] |
| BLOCK 2 FRIDAY Part D#1 | bodyweight, dumbbell, kettlebell | db ipsilateral step up [dumbbell] > step ups - dbs on both hands [dumbbell] > side lunges (db contralateral load) [dumbbell] > Suitcase DB RFE iso holds / RFE lunge  [dumbbell] > kb front rack lateral lunge kb lunges [kettlebell] > split stance jump squats [bodyweight] > kb front rack lateral lunge kb lunges [kettlebell] > slow eccentric deficit Lunges (no weig [bodyweight] |
| BLOCK 3 MONDAY Part A#1 | medball | Med ball half kneeling rotationss in & [medball] > overhead toss [medball] > skater jumps with MB rotations [medball] > MB scoops to the wall [medball] > sit up to chest pass [medball] > Rotational chest pass [medball] > sit up to chest pass [medball] > Rotational chest pass [medball] |
| BLOCK 3 MONDAY Part C#1 | barbell, dumbbell, hex_bar | DB Squat Jumps [dumbbell] > Heavy front squats [barbell] > fron squats [barbell] > Heavy front squats [barbell] > Hex bar squat jumps [hex_bar] > barbell High zercher squat [barbell] > Hex bar squat jumps [hex_bar] > back squats [barbell] |
| BLOCK 3 MONDAY Part C#2 | barbell, dumbbell | bent over Barbell Row [barbell] > seal rows [dumbbell] > bent over Barbell Row [barbell] > heavy DB rows [dumbbell] > seal rows 10 reps all rounds [dumbbell] > Heavy DB row [dumbbell] > seal rows 10 reps all rounds [dumbbell] > barbell row [barbell] |
| BLOCK 3 MONDAY Part D#1 | dumbbell, slider | Rear foot on wall DB RDL [dumbbell] > Glidder hamstring runners [slider] > Rear foot on wall DB RDL [dumbbell] > Staggered stance double rack deadlifts [dumbbell] > fast hamstring curls sliders [slider] > Staggered stance DB dl [dumbbell] > HAMSTRING SLIDERS RUNNERS [slider] > Staggered stance DB dl [dumbbell] |
| BLOCK 3 TUESDAY Part A#1 | bodyweight, dumbbell | Depth drop [bodyweight] > Sit to jump on to box with DBs [dumbbell] > Depth drop [bodyweight] > SL hurdle hops [bodyweight] > Depth drop - single leg [bodyweight] > Hurdle hops [bodyweight] > Depth drop - single leg [bodyweight] > Hurdle hops [bodyweight] |
| BLOCK 3 TUESDAY Part C#1 | barbell, hex_bar | Hex bar deadlift [hex_bar] > Barbell deadlift [barbell] > Hex bar deadlift [hex_bar] > banded Barbell deadlift [barbell] > Barbell deadlift [barbell] > Deadlifts [barbell] > Barbell deadlift [barbell] > Deadlifts [barbell] |
| BLOCK 3 TUESDAY Part C#2 | bodyweight, dumbbell | DB Bottoms up bench press [dumbbell] > Broad jumps [bodyweight] > DB Bottoms up bench press [dumbbell] > incline db bench press [dumbbell] > top down db bench press [dumbbell] > db Bench press (small incline) [dumbbell] > top down db bench press [dumbbell] > db Bench press (small incline) [dumbbell] |
| BLOCK 3 TUESDAY Part D#1 | dumbbell | RFE Bulgarian lunge [dumbbell] > ffe lunges - contralateral loading [dumbbell] > RFE Bulgarian lunge [dumbbell] > db lateral lunge [dumbbell] > DB reverse lunges [dumbbell] > High zercher DB RFE Lunge front foot o [dumbbell] > DB reverse lunges [dumbbell] > High zercher DB RFE Lunge front foot o [dumbbell] |
| BLOCK 3 THURSDAY Part A#1 | medball | med ball rotational chest pass [medball] > situp to chest pass [medball] > med ball rotational chest pass [medball] > step to chest pass [medball] > step forward chest pass [medball] > Medball Chest pass [medball] > step forward chest pass [medball] > OH MB SLAMS [medball] |
| BLOCK 3 THURSDAY Part C#1 | barbell, bodyweight, kettlebell | Back sqaut [barbell] > front squat [barbell] > Back sqaut [barbell] > kb squat cleans [kettlebell] > front squat slow [barbell] > SQUAT JUMPS [bodyweight] > SLOW FRONT SQUATS [barbell] > KB HANG SQUAT CLEANS [kettlebell] |
| BLOCK 3 THURSDAY Part C#2 | cable, pullup_bar | Pull Ups [pullup_bar] > pull ups [pullup_bar] > LAT PULL OVERS [cable] > Chin-ups [pullup_bar] > Cable lat pull over [cable] > Close grip cable lat pull down [cable] > Cable lat pull over [cable] > Close grip cable lat pull down [cable] |
| BLOCK 3 THURSDAY Part D#1 | band, bodyweight, dumbbell | camporini dl [dumbbell] > Banded rolling hamstring curls [band] > camporini dl [dumbbell] > SL Glute bridge Marchs [bodyweight] > camporini dl [dumbbell] > Staggered stance DB dl - Medial pressu [dumbbell] > camporini dl [dumbbell] > Staggered stance DB dl - Medial pressu [dumbbell] |
| BLOCK 3 FRIDAY Part A#1 | bodyweight | Hurdle hops single leg [bodyweight] > single leg lateral hops side to side [bodyweight] > side to side hops single leg [bodyweight] > A Marches, A skips, A runners [bodyweight] > single leg hops forward & back [bodyweight] > High knee tuck in jumps [bodyweight] > single leg hops forward & back [bodyweight] > ankle hops [bodyweight] |
| BLOCK 3 FRIDAY Part C#1 | barbell, dumbbell, kettlebell | DB deadlifts [dumbbell] > Band ressisted deadlifts [barbell] > KB swings [kettlebell] > Banded deadlifts [barbell] > KB swings [kettlebell] > BANDED KB SWINGS [kettlebell] > FAST BANDED DEADLFTS [barbell] > BANDED KB SWINGS [kettlebell] |
| BLOCK 3 FRIDAY Part C#2 | dumbbell, landmine | LAndmine half kneeling press [landmine] > half kneeling landmine press [landmine] > arnold presses [dumbbell] > Seesaw shoulder presses [dumbbell] > inclined db bench press [dumbbell] > Single arm DB push press [dumbbell] > DB HEAVY PUSH PRESS [dumbbell] > HEAVY DB PUSH PRESS [dumbbell] |
| BLOCK 3 FRIDAY Part D#1 | bodyweight, dumbbell, kettlebell, medball | FFE ipsilateral lunge [dumbbell] > ipsilateral kb front rack step up [kettlebell] > FFE ipsilateral reverse lunge [dumbbell] > MB rotational Alternating FFE Reverse  [medball] > alternating split stance jumps FFE (bo [bodyweight] > Suitcase DB RFE lunge jumps [dumbbell] > SPLIT STANCE SQUAT JUMPS [bodyweight] > STEP UPS TO KNEE DRIVE [dumbbell] |

Other programs (same row, different weeks):

| Program / variant / day / row | sequence by week |
|---|---|
| FAT BURN / BODY TONING / MUSCLE BUILDIN / MONDAY / row#7 | WK 1: LEG PRESS [machine] > WK 2: DEAFLITS [barbell] > WK 3: LEG PRESS [machine] > WK 4: DEADLIFTS [barbell] |
| FAT BURN / BODY TONING / MUSCLE BUILDIN / MONDAY / row#8 | WK 1: DEALIFTS [barbell] > WK 2: SQUATS SMITH MACHINE [smith_machine] > WK 3: DEADLIFTS [barbell] > WK 4: SQUATS SMITH MACHINE [smith_machine] |
| FAT BURN / BODY TONING / MUSCLE BUILDIN / MONDAY / row#9 | WK 1: WALKING LUNGES [dumbbell] > WK 2: STATIONARY LUNGES [dumbbell] > WK 3: FRONT FOOT ELEVATED LUNGES [dumbbell] > WK 4: REAR FOOT ELEVATED LUNGES [dumbbell] |
| FAT BURN / BODY TONING / MUSCLE BUILDIN / MONDAY / row#11 | WK 1: LEG EXTENSIONS [machine] > WK 2: LEG CURLS [machine] > WK 3: LEG EXTENSIONS [machine] > WK 4: LEG CURLS [machine] |
| FAT BURN / BODY TONING / MUSCLE BUILDIN / TUESDAY / row#12 | WK 1: BARBELL BENCH PRESS [barbell] > WK 2: SINGLE ARM LAT PULL DOWN [cable] > WK 3: BARBELL BENCH PRESS [barbell] > WK 4: LAT PULL DOWN/PULL UP [cable] |
| FAT BURN / BODY TONING / MUSCLE BUILDIN / TUESDAY / row#13 | WK 1: SINGLE ARM LAT PULL DOWN [cable] > WK 2: DB BENCH PRESS [dumbbell] > WK 3: LAT PULL DOWN/PULL UP [cable] > WK 4: INCLINE DB BENCH PRESS [dumbbell] |
| FAT BURN / BODY TONING / MUSCLE BUILDIN / TUESDAY / row#14 | WK 1: DB OVERHEAD PRESS [dumbbell] > WK 2: MACHINE SUPPORTED ROW [machine] > WK 3: UPRIGHT ROWS [dumbbell] > WK 4: DB ROWS [dumbbell] |
| FAT BURN / BODY TONING / MUSCLE BUILDIN / TUESDAY / row#15 | WK 1: MACHINE SUPPORTED ROW [machine] > WK 2: UPRIGHT ROWS [dumbbell] > WK 3: DB ROWS [dumbbell] > WK 4: OVERHEAD PRESS [barbell] |
| FAT BURN / BODY TONING / MUSCLE BUILDIN / TUESDAY / row#16 | WK 1: DB CURLS [dumbbell] > WK 2: ROPE TRICEP EXTENSIONS [cable] > WK 3: DB HAMMER CURLS [dumbbell] > WK 4: TRICEP KICKBACKS [dumbbell] |
| FAT BURN / BODY TONING / MUSCLE BUILDIN / THURSDAY / row#20 | WK 1: DEAFLITS [barbell] > WK 2: LEG PRESS [machine] > WK 3: DEADLIFTS [barbell] > WK 4: LEG PRESS [machine] |
| FAT BURN / BODY TONING / MUSCLE BUILDIN / THURSDAY / row#21 | WK 1: SQUATS SMITH MACHINE [smith_machine] > WK 2: DEALIFTS [barbell] > WK 3: SQUATS SMITH MACHINE [smith_machine] > WK 4: DEADLIFTS [barbell] |
| FAT BURN / BODY TONING / MUSCLE BUILDIN / THURSDAY / row#22 | WK 1: STATIONARY LUNGES [dumbbell] > WK 2: WALKING LUNGES [dumbbell] > WK 3: REAR FOOT ELEVATED LUNGES [dumbbell] > WK 4: FRONT FOOT ELEVATED LUNGES [dumbbell] |
| FAT BURN / BODY TONING / MUSCLE BUILDIN / THURSDAY / row#24 | WK 1: LEG CURLS [machine] > WK 2: LEG EXTENSIONS [machine] > WK 3: LEG CURLS [machine] > WK 4: LEG EXTENSIONS [machine] |
| FAT BURN / BODY TONING / MUSCLE BUILDIN / FRIDAY / row#25 | WK 1: SINGLE ARM LAT PULL DOWN [cable] > WK 2: BARBELL BENCH PRESS [barbell] > WK 3: LAT PULL DOWN/PULL UP [cable] > WK 4: INCLINE BARBELL BENCH PRESS [barbell] |
| FAT BURN / BODY TONING / MUSCLE BUILDIN / FRIDAY / row#26 | WK 1: DB BENCH PRESS [dumbbell] > WK 2: SINGLE ARM LAT PULL DOWN [cable] > WK 3: INCLINE DB BENCH PRESS [dumbbell] > WK 4: SINGLE ARM LAT PULL DOWN [cable] |
| FAT BURN / BODY TONING / MUSCLE BUILDIN / FRIDAY / row#27 | WK 1: MACHINE SUPPORTED ROW [machine] > WK 2: SIDE RAISES [dumbbell] > WK 3: DB ROWS [dumbbell] > WK 4: SIDE RAISES [dumbbell] |
| FAT BURN / BODY TONING / MUSCLE BUILDIN / FRIDAY / row#28 | WK 1: SIDE RAISES [dumbbell] > WK 2: MACHINE SUPPORTED ROW [machine] > WK 3: SIDE RAISES [dumbbell] > WK 4: DB ROWS [dumbbell] |
| FAT BURN / BODY TONING / MUSCLE BUILDIN / FRIDAY / row#29 | WK 1: ROPE TRICEP EXTENSIONS [cable] > WK 2: DB CURLS [dumbbell] > WK 3: TRICEP KICKBACKS [dumbbell] > WK 4: DB HAMMER CURLS [dumbbell] |
| FAT BURN / BODY TONING / CIRCUITS RECCO / THURSDAY / row#52 | WK 2: Mountain climbers [bodyweight] > WK 4: Mointain climbers [bodyweight] |
| 4 TRACKS - AESTHETICS (bodyb / 8-week columns / MONDAY / row#35 | WK1: FRONT SQUATS [barbell] > WK2: DEAFLITS [barbell] > WK3: FRONT SQUATS [barbell] > WK4: DEFICIT DEADLIFTS [barbell] > WK5: BACK SQUATS [barbell] > WK6: DEADLIFTS [barbell] > WK7: DEADLIFTS [barbell] > WK8: DELOAD WEEK [None] |
| 4 TRACKS - AESTHETICS (bodyb / 8-week columns / MONDAY / row#37 | WK1: DEALIFTS [barbell] > WK2: BACK SQUATS [barbell] > WK3: DEADLIFTS [barbell] > WK4: BACK SQUATS [barbell] > WK5: DEADLIFTS [barbell] > WK6: FRONT SQUATS [barbell] > WK7: BACK SQUATS [barbell] |
| 4 TRACKS - AESTHETICS (bodyb / 8-week columns / MONDAY / row#38 | WK1: FFE CONTRA LUNGES [dumbbell] > WK2: FFE IPSI LUNGES [dumbbell] > WK3: RFE CONTRA LUNGES [dumbbell] > WK4: RFE IPSI LUNGES [dumbbell] > WK5: RFE LUNGES [dumbbell] > WK6: RFE & FFE LUNGES [dumbbell] > WK7: RFE & FFE LUNGES [dumbbell] |
| 4 TRACKS - AESTHETICS (bodyb / 8-week columns / TUESDAY / row#41 | WK1: DB BENCH PRESS [dumbbell] > WK2: UNILATERAL LAT PULL DOWN [cable] > WK3: DB BENCH PRESS [dumbbell] > WK4: LAT PULL DOWN/PULL UP [cable] > WK5: BARBELL BENCH PRESS [barbell] > WK6: LAT PULL DOWN/PULL UP [cable] > WK7: BARBELL BENCH PRESS [barbell] |
| 4 TRACKS - AESTHETICS (bodyb / 8-week columns / TUESDAY / row#42 | WK1: UNILATERAL LAT PULL DOWN [cable] > WK2: DB BENCH PRESS [dumbbell] > WK3: UNILATERAL LAT PULL DOWN [cable] > WK4: INCLINE DB BENCH PRESS [dumbbell] > WK5: UNILATERAL LAT PULL DOWN [cable] > WK6: INCLINE DB BENCH PRESS [dumbbell] > WK7: UNILATERAL LAT PULL DOWN [cable] |
| 4 TRACKS - AESTHETICS (bodyb / 8-week columns / TUESDAY / row#43 | WK1: DB OVERHEAD PRESS [dumbbell] > WK2: MACHINE SUPPORTED ROW [machine] > WK3: UPRIGHT ROWS [dumbbell] > WK4: DB ROWS [dumbbell] > WK5: DB OVERHEAD PRESS [dumbbell] > WK6: MACHINE SUPPORTED ROW [machine] > WK7: UPRIGHT ROWS [dumbbell] |
| 4 TRACKS - AESTHETICS (bodyb / 8-week columns / TUESDAY / row#44 | WK1: MACHINE SUPPORTED ROW [machine] > WK2: UPRIGHT ROWS [dumbbell] > WK3: DB ROWS [dumbbell] > WK4: OVERHEAD PRESS [barbell] > WK5: MACHINE SUPPORTED ROW [machine] > WK6: UPRIGHT ROWS [dumbbell] > WK7: DB ROWS [dumbbell] |
| 4 TRACKS - AESTHETICS (bodyb / 8-week columns / THURSDAY / row#49 | WK1: FRONT SQUATS [barbell] > WK2: DEAFLITS [barbell] > WK3: FRONT SQUATS [barbell] > WK4: DEFICIT DEADLIFTS [barbell] > WK5: BACK SQUATS [barbell] > WK6: DEADLIFTS [barbell] > WK7: DEADLIFTS [barbell] |
| 4 TRACKS - AESTHETICS (bodyb / 8-week columns / THURSDAY / row#50 | WK1: DEALIFTS [barbell] > WK2: BACK SQUATS [barbell] > WK3: DEADLIFTS [barbell] > WK4: BACK SQUATS [barbell] > WK5: DEADLIFTS [barbell] > WK6: FRONT SQUATS [barbell] > WK7: BACK SQUATS [barbell] |
| 4 TRACKS - AESTHETICS (bodyb / 8-week columns / THURSDAY / row#51 | WK1: FFE CONTRA LUNGES [dumbbell] > WK2: FFE IPSI LUNGES [dumbbell] > WK3: RFE CONTRA LUNGES [dumbbell] > WK4: RFE IPSI LUNGES [dumbbell] > WK5: RFE LUNGES [dumbbell] > WK6: RFE & FFE LUNGES [dumbbell] > WK7: RFE & FFE LUNGES [dumbbell] |
| 4 TRACKS - AESTHETICS (bodyb / 8-week columns / FRIDAY / row#55 | WK1: DB BENCH PRESS [dumbbell] > WK2: UNILATERAL LAT PULL DOWN [cable] > WK3: DB BENCH PRESS [dumbbell] > WK4: LAT PULL DOWN/PULL UP [cable] > WK5: BARBELL BENCH PRESS [barbell] > WK6: LAT PULL DOWN/PULL UP [cable] > WK7: BARBELL BENCH PRESS [barbell] > WK8: DELOAD WEEK [None] |
| 4 TRACKS - AESTHETICS (bodyb / 8-week columns / FRIDAY / row#56 | WK1: UNILATERAL LAT PULL DOWN [cable] > WK2: DB BENCH PRESS [dumbbell] > WK3: UNILATERAL [cable] > WK4: INCLINE DB BENCH PRESS [dumbbell] > WK5: LAT PULL DOWN/PULL UP [cable] > WK6: INCLINE DB BENCH PRESS [dumbbell] > WK7: LAT PULL DOWN/PULL UP [cable] |
| 4 TRACKS - AESTHETICS (bodyb / 8-week columns / FRIDAY / row#57 | WK1: DB OVERHEAD PRESS [dumbbell] > WK2: MACHINE SUPPORTED ROW [machine] > WK3: UPRIGHT ROWS [dumbbell] > WK4: DB ROWS [dumbbell] > WK5: DB OVERHEAD PRESS [dumbbell] > WK6: MACHINE SUPPORTED ROW [machine] > WK7: UPRIGHT ROWS [dumbbell] |
| 4 TRACKS - AESTHETICS (bodyb / 8-week columns / FRIDAY / row#59 | WK1: MACHINE SUPPORTED ROW [machine] > WK2: UPRIGHT ROWS [dumbbell] > WK3: DB ROWS [dumbbell] > WK4: OVERHEAD PRESS [barbell] > WK5: MACHINE SUPPORTED ROW [machine] > WK6: UPRIGHT ROWS [dumbbell] > WK7: DB ROWS [dumbbell] |
| 4 TRACKS - AESTHETICS (bodyb / 12-week column / MONDAY / row#35 | WK1: cable Side Raises [cable] > WK2: DB side raises [dumbbell] > WK3: cable Side Raises [cable] > WK4: DB side raises [dumbbell] > WK5: cable Side Raises [cable] > WK6: DB side raises [dumbbell] > WK7: cable Side Raises [cable] > WK8: Arnold press [dumbbell] > WK9: Cable or DB side raises [cable] > WK10: Arnold press [dumbbell] > WK11: Cable or DB side raises [cable] > WK12: Arnold press [dumbbell] |
| 4 TRACKS - AESTHETICS (bodyb / 12-week column / MONDAY / row#36 | WK1: Incline bench [barbell] > WK2: bench press [barbell] > WK3: Incline bench [barbell] > WK4: bench press [barbell] > WK5: Incline bench [barbell] > WK6: bench press [barbell] > WK7: Incline bench [barbell] > WK8: incline bench press [barbell] > WK9: bench press [barbell] > WK10: incline bench press [barbell] > WK11: bench press [barbell] > WK12: incline bench press [barbell] |
| 4 TRACKS - AESTHETICS (bodyb / 12-week column / MONDAY / row#37 | WK1: low to high FLIES [cable] > WK2: machine or db flies [machine] > WK3: low to high FLIES [cable] > WK4: machine or db flies [machine] > WK5: low to high FLIES [cable] > WK6: machine or db flies [machine] > WK7: low to high FLIES [cable] > WK8: machine or db flies [machine] > WK9: high to low cable flies [cable] > WK10: machine or db flies [machine] > WK11: high to low cable flies [cable] > WK12: machine or db flies [machine] |
| 4 TRACKS - AESTHETICS (bodyb / 12-week column / MONDAY / row#39 | WK1: TATE PRESS [dumbbell] > WK2: cable tricep extension [cable] > WK3: TATE PRESS [dumbbell] > WK4: cable tricep extension [cable] > WK5: TATE PRESS [dumbbell] > WK6: cable tricep extension [cable] > WK7: TATE PRESS [dumbbell] > WK8: overhead cable rope tricep ext [cable] > WK9: overhead cable rope tricep ext [cable] > WK10: overhead cable rope tricep ext [cable] > WK11: overhead cable rope tricep ext [cable] > WK12: overhead cable rope tricep ext [cable] |
| 4 TRACKS - AESTHETICS (bodyb / 12-week column / MONDAY / row#40 | WK1: TRICEP EXT. [cable] > WK2: cable regular top down tricep exte [cable] > WK3: TRICEP EXT. [cable] > WK4: cable regular top down tricep exte [cable] > WK5: TRICEP EXT. [cable] > WK6: cable regular top down tricep exte [cable] > WK7: TRICEP EXT. [cable] |
| 4 TRACKS - AESTHETICS (bodyb / 12-week column / TUESDAY / row#41 | WK1: front SQUATS [barbell] > WK2: front SQUATS [barbell] > WK3: front SQUATS [barbell] > WK4: front SQUATS [barbell] > WK5: front SQUATS [barbell] > WK6: front SQUATS [barbell] > WK7: front SQUATS [barbell] > WK8: front SQUATS [barbell] > WK9: front squats + Superset with 15 sq [barbell] > WK10: front squats + Superset with 15 sq [barbell] > WK11: front squats + Superset with 15 sq [barbell] > WK12: front squats + Superset with 15 sq [barbell] |
| 4 TRACKS - AESTHETICS (bodyb / 12-week column / TUESDAY / row#42 | WK1: LEG PRESS [machine] > WK2: LEG PRESS [machine] > WK3: LEG PRESS [machine] > WK4: LEG PRESS [machine] > WK5: LEG PRESS [machine] > WK6: LEG PRESS [machine] > WK7: LEG PRESS [machine] > WK8: LEG PRESS [machine] > WK9: leg press or just add 2 more round [machine] > WK10: leg press or just add 2 more round [machine] > WK11: leg press or just add 2 more round [machine] > WK12: leg press or just add 2 more round [machine] |
| 4 TRACKS - AESTHETICS (bodyb / 12-week column / TUESDAY / row#44 | WK1: LUNGES [dumbbell] > WK2: LUNGES [dumbbell] > WK3: LUNGES [dumbbell] > WK4: LUNGES [dumbbell] > WK5: LUNGES [dumbbell] > WK6: LUNGES [dumbbell] > WK7: LUNGES [dumbbell] > WK8: LUNGES [dumbbell] > WK9: RFE Lunges (bulgarian) [dumbbell] > WK10: RFE Lunges (bulgarian) [dumbbell] > WK11: RFE Lunges (bulgarian) [dumbbell] > WK12: RFE Lunges (bulgarian) [dumbbell] |
| 4 TRACKS - AESTHETICS (bodyb / 12-week column / TUESDAY / row#45 | WK1: STAGRD. DL [dumbbell] > WK2: STAGRD. DL [dumbbell] > WK3: STAGRD. DL [dumbbell] > WK4: STAGRD. DL [dumbbell] > WK5: STAGRD. DL [dumbbell] > WK6: STAGRD. DL [dumbbell] > WK7: STAGRD. DL [dumbbell] > WK8: STAGRD. DL [dumbbell] > WK9: Staggered stance unilateral deadli [dumbbell] > WK10: Staggered stance unilateral deadli [dumbbell] > WK11: Staggered stance unilateral deadli [dumbbell] > WK12: Staggered stance unilateral deadli [dumbbell] |
| 4 TRACKS - AESTHETICS (bodyb / 12-week column / WEDNESDAY / row#46 | WK1: Lat pull downs [cable] > WK2: Neutral grip lat pull down [cable] > WK3: Lat pull downs [cable] > WK4: Neutral grip lat pull down [cable] > WK5: Lat pull downs [cable] > WK6: Neutral grip lat pull down [cable] > WK7: Lat pull downs [cable] > WK8: Neutral grip lat pull down [cable] > WK9: Neutral grip lat pull down [cable] > WK10: Neutral grip lat pull down [cable] > WK11: Neutral grip lat pull down [cable] > WK12: Neutral grip lat pull down [cable] |
| 4 TRACKS - AESTHETICS (bodyb / 12-week column / WEDNESDAY / row#47 | WK1: Rows [dumbbell] > WK2: machine rows or db rows [machine] > WK3: Rows [dumbbell] > WK4: machine rows or db rows [machine] > WK5: Rows [dumbbell] > WK6: machine rows or db rows [machine] > WK7: Rows [dumbbell] > WK8: machine rows or db rows [machine] > WK9: machine rows or db rows [machine] > WK10: machine rows or db rows [machine] > WK11: machine rows or db rows [machine] > WK12: machine rows or db rows [machine] |
| 4 TRACKS - AESTHETICS (bodyb / 12-week column / WEDNESDAY / row#48 | WK1: Pull under [None] > WK2: pull under [None] > WK3: Pull under [None] > WK4: pull under [None] > WK5: Pull under [None] > WK6: pull under [None] > WK7: Pull under [None] > WK8: pull under [None] > WK9: machine or db Reverse flies [machine] > WK10: machine or db Reverse flies [machine] > WK11: machine or db Reverse flies [machine] > WK12: machine or db Reverse flies [machine] |
| 4 TRACKS - AESTHETICS (bodyb / 12-week column / WEDNESDAY / row#49 | WK1: face pulls [cable] > WK2: upright db row [dumbbell] > WK3: face pulls [cable] > WK4: upright db row [dumbbell] > WK5: face pulls [cable] > WK6: upright db row [dumbbell] > WK7: face pulls [cable] > WK8: upright db row [dumbbell] > WK9: bent over db row [dumbbell] > WK10: bent over db row [dumbbell] > WK11: bent over db row [dumbbell] > WK12: bent over db row [dumbbell] |
| 4 TRACKS - AESTHETICS (bodyb / 12-week column / WEDNESDAY / row#50 | WK1: barbell curls [barbell] > WK2: hammer curls [dumbbell] > WK3: barbell curls [barbell] > WK4: hammer curls [dumbbell] > WK5: barbell curls [barbell] > WK6: hammer curls [dumbbell] > WK7: barbell curls [barbell] > WK8: hammer curls [dumbbell] > WK9: Ez bar curls or barbell [ez_bar] > WK10: Ez bar curls or barbell [ez_bar] > WK11: Ez bar curls or barbell [ez_bar] > WK12: Ez bar curls or barbell [ez_bar] |
| 4 TRACKS - AESTHETICS (bodyb / 12-week column / THURSDAY / row#51 | WK1: cable side raises [cable] > WK2: DB side raises [dumbbell] > WK3: cable side raises [cable] > WK4: DB side raises [dumbbell] > WK5: cable side raises [cable] > WK6: DB side raises [dumbbell] > WK7: cable side raises [cable] > WK8: DB side raises [dumbbell] > WK9: Cable or DB side raises [cable] > WK10: Arnold press [dumbbell] > WK11: Cable or DB side raises [cable] > WK12: Arnold press [dumbbell] |
| 4 TRACKS - AESTHETICS (bodyb / 12-week column / THURSDAY / row#52 | WK1: incline bench press [barbell] > WK2: bench press [barbell] > WK3: incline bench press [barbell] > WK4: bench press [barbell] > WK5: incline bench press [barbell] > WK6: bench press [barbell] > WK7: incline bench press [barbell] > WK8: bench press [barbell] > WK9: bench press + superset with max pu [barbell] > WK10: incline bench press + superset wit [barbell] > WK11: bench press + superset with max pu [barbell] > WK12: incline bench press + superset wit [barbell] |
| 4 TRACKS - AESTHETICS (bodyb / 12-week column / THURSDAY / row#53 | WK1: high to low FLIES [cable] > WK2: machine or db flies [machine] > WK3: high to low FLIES [cable] > WK4: machine or db flies [machine] > WK5: high to low FLIES [cable] > WK6: machine or db flies [machine] > WK7: high to low FLIES [cable] > WK8: machine or db flies [machine] > WK9: high to low cable flies [cable] > WK10: machine or db flies [machine] > WK11: high to low cable flies [cable] > WK12: machine or db flies [machine] |
| 4 TRACKS - AESTHETICS (bodyb / 12-week column / THURSDAY / row#54 | WK1: JM PRESS [barbell] > WK2: Machine Dips or dips [machine] > WK3: JM PRESS [barbell] > WK4: Machine Dips or dips [machine] > WK5: JM PRESS [barbell] > WK6: Machine Dips or dips [machine] > WK7: JM PRESS [barbell] > WK8: Machine Dips or dips [machine] > WK9: machine dips or dips [machine] > WK10: Machine Dips or dips [machine] > WK11: machine dips or dips [machine] > WK12: Machine Dips or dips [machine] |
| 4 TRACKS - AESTHETICS (bodyb / 12-week column / THURSDAY / row#55 | WK1: TATE PRESS [dumbbell] > WK2: cable tricep extension [cable] > WK3: TATE PRESS [dumbbell] > WK4: cable tricep extension [cable] > WK5: TATE PRESS [dumbbell] > WK6: cable tricep extension [cable] > WK7: TATE PRESS [dumbbell] > WK8: cable tricep extension [cable] > WK9: overhead cable rope tricep ext [cable] > WK10: overhead cable rope tricep ext [cable] > WK11: overhead cable rope tricep ext [cable] > WK12: overhead cable rope tricep ext [cable] |
| 4 TRACKS - AESTHETICS (bodyb / 12-week column / THURSDAY / row#56 | WK1: TRICEP EXT. [cable] > WK2: cable regular top down tricep exte [cable] > WK3: TRICEP EXT. [cable] > WK4: cable regular top down tricep exte [cable] > WK5: TRICEP EXT. [cable] > WK6: cable regular top down tricep exte [cable] > WK7: TRICEP EXT. [cable] > WK8: cable regular top down tricep exte [cable] |
| 4 TRACKS - AESTHETICS (bodyb / 12-week column / FRIDAY / row#57 | WK1: front SQUATS [barbell] > WK2: front SQUATS [barbell] > WK3: front SQUATS [barbell] > WK4: front SQUATS [barbell] > WK5: front SQUATS [barbell] > WK6: front SQUATS [barbell] > WK7: front SQUATS [barbell] > WK8: front SQUATS [barbell] > WK9: RFE Lunges (bulgarian) [dumbbell] > WK10: RFE Lunges (bulgarian) [dumbbell] > WK11: RFE Lunges (bulgarian) [dumbbell] > WK12: RFE Lunges (bulgarian) [dumbbell] |
| 4 TRACKS - AESTHETICS (bodyb / 12-week column / FRIDAY / row#58 | WK1: LEG PRESS [machine] > WK2: LEG PRESS [machine] > WK3: LEG PRESS [machine] > WK4: LEG PRESS [machine] > WK5: LEG PRESS [machine] > WK6: LEG PRESS [machine] > WK7: LEG PRESS [machine] > WK8: LEG PRESS [machine] > WK9: Staggered stance unilateral deadli [dumbbell] > WK10: Staggered stance unilateral deadli [dumbbell] > WK11: Staggered stance unilateral deadli [dumbbell] > WK12: Staggered stance unilateral deadli [dumbbell] |
| 4 TRACKS - AESTHETICS (bodyb / 12-week column / FRIDAY / row#59 | WK1: DEADLIFTS [barbell] > WK2: Staggered DL [dumbbell] > WK3: Staggered DL [dumbbell] > WK4: Staggered DL [dumbbell] > WK5: Staggered DL [dumbbell] > WK6: Staggered DL [dumbbell] > WK7: Staggered DL [dumbbell] > WK8: Staggered DL [dumbbell] > WK9: Leg extension one leg at a time [machine] > WK10: Leg extension one leg at a time [machine] > WK11: Leg extension one leg at a time [machine] > WK12: Leg extension one leg at a time [machine] |
| 4 TRACKS - AESTHETICS (bodyb / 12-week column / FRIDAY / row#60 | WK1: LUNGES [dumbbell] > WK2: LUNGES [dumbbell] > WK3: LUNGES [dumbbell] > WK4: LUNGES [dumbbell] > WK5: LUNGES [dumbbell] > WK6: LUNGES [dumbbell] > WK7: LUNGES [dumbbell] > WK8: LUNGES [dumbbell] > WK9: leg curls one leg at a time [machine] > WK10: leg curls one leg at a time [machine] > WK11: leg curls one leg at a time [machine] > WK12: leg curls one leg at a time [machine] |
| 4 TRACKS - AESTHETICS (bodyb / 12-week column / FRIDAY / row#61 | WK1: STAGRD. DL [dumbbell] > WK2: LEg Extensions [machine] > WK3: LEg Extensions [machine] > WK4: LEg Extensions [machine] > WK5: LEg Extensions [machine] > WK6: LEg Extensions [machine] > WK7: LEg Extensions [machine] > WK8: LEg Extensions [machine] > WK9: 2 sets LEG PRESS MYO - 15-5-5-5-5- [machine] > WK10: 2 sets LEG PRESS MYO - 15-5-5-5-5- [machine] > WK11: 2 sets LEG PRESS MYO - 15-5-5-5-5- [machine] > WK12: 3 sets LEG PRESS MYO - 15-5-5-5-5- [machine] |
| 4 TRACKS - AESTHETICS (bodyb / 12-week column / SATURDAY / row#62 | WK1: Lat pull downs [cable] > WK2: Neutral grip lat pull down [cable] > WK3: Lat pull downs [cable] > WK4: Neutral grip lat pull down [cable] > WK5: Lat pull downs [cable] > WK6: Neutral grip lat pull down [cable] > WK7: Lat pull downs [cable] > WK8: Neutral grip lat pull down [cable] > WK9: Neutral grip lat pull down [cable] > WK10: Neutral grip lat pull down [cable] > WK11: Neutral grip lat pull down [cable] > WK12: Neutral grip lat pull down [cable] |
| 4 TRACKS - AESTHETICS (bodyb / 12-week column / SATURDAY / row#63 | WK1: Rows [dumbbell] > WK2: machine rows or db rows [machine] > WK3: Rows [dumbbell] > WK4: machine rows or db rows [machine] > WK5: Rows [dumbbell] > WK6: machine rows or db rows [machine] > WK7: Rows [dumbbell] > WK8: machine rows or db rows [machine] > WK9: machine rows or db rows (5 sets -  [machine] > WK10: machine rows or db rows (5 sets -  [machine] > WK11: machine rows or db rows (5 sets -  [machine] > WK12: machine rows or db rows (5 sets -  [machine] |
| 4 TRACKS - AESTHETICS (bodyb / 12-week column / SATURDAY / row#64 | WK1: Pull under [None] > WK2: pull under [None] > WK3: Pull under [None] > WK4: pull under [None] > WK5: Pull under [None] > WK6: pull under [None] > WK7: Pull under [None] > WK8: pull under [None] > WK9: machine or db Reverse flies [machine] > WK10: machine or db Reverse flies [machine] > WK11: machine or db Reverse flies [machine] > WK12: machine or db Reverse flies [machine] |
| 4 TRACKS - AESTHETICS (bodyb / 12-week column / SATURDAY / row#65 | WK1: face pulls [cable] > WK2: upright db row [dumbbell] > WK3: face pulls [cable] > WK4: upright db row [dumbbell] > WK5: face pulls [cable] > WK6: upright db row [dumbbell] > WK7: face pulls [cable] > WK8: upright db row [dumbbell] > WK9: bent over db row [dumbbell] > WK10: bent over db row [dumbbell] > WK11: bent over db row [dumbbell] > WK12: bent over db row [dumbbell] |
| 4 TRACKS - AESTHETICS (bodyb / 12-week column / SATURDAY / row#66 | WK1: barbell curls [barbell] > WK2: hammer curls [dumbbell] > WK3: barbell curls [barbell] > WK4: hammer curls [dumbbell] > WK5: barbell curls [barbell] > WK6: hammer curls [dumbbell] > WK7: barbell curls [barbell] > WK8: hammer curls [dumbbell] > WK9: Ez bar curls or barbell [ez_bar] > WK10: Ez bar curls or barbell [ez_bar] > WK11: Ez bar curls or barbell [ez_bar] > WK12: Ez bar curls or barbell [ez_bar] |
| 4 TRACKS - STRENGTH (conjuga / 8-week columns / MONDAY / row#9 | WK1: HEAVY FRONT SQUAT (D)BOX SQUAT [barbell] > WK2: HEAVY DEFICIT DEADLIFT [barbell] > WK3: HEAVY (D)BOX HIGH BAR SQUAT [barbell] > WK4: HEAVY CHAINED DEADLIFT [barbell] > WK5: HEAVY FRONT SQUAT [barbell] > WK6: HEAVY DEADLIFT [barbell] > WK7: HEAVY HIGH BAR SQUAT [barbell] > WK8: TEST [None] |
| 4 TRACKS - STRENGTH (conjuga / 8-week columns / MONDAY / row#10 | WK1: SNATCH GRIP DL [barbell] > WK2: F. SQUAT (T&G)BOX [barbell] > WK3: DEF. DL or SNATCH GRIP [barbell] > WK4: (T&G)BOX HIGH BAR SQUAT [barbell] > WK5: DEF. DL or SNATCH GRIP [barbell] > WK6: HIGH BAR SQUAT [barbell] > WK7: DEADLIFT [barbell] |
| 4 TRACKS - STRENGTH (conjuga / 8-week columns / MONDAY / row#11 | WK1: PULL UPS [pullup_bar] > WK2: DB ROWS 8/8 [dumbbell] > WK3: PULL UPS [pullup_bar] > WK4: DB ROWS 8/8 [dumbbell] > WK5: PULL UPS [pullup_bar] > WK6: DB ROWS 8/8 [dumbbell] > WK7: PULL UPS [pullup_bar] |
| 4 TRACKS - STRENGTH (conjuga / 8-week columns / MONDAY / row#12 | WK1: RFE LUNGES [dumbbell] > WK2: STAGGERED STANCE DL [dumbbell] > WK3: FFE LUNGES [dumbbell] > WK4: STAGGERED STANCE DL [dumbbell] > WK5: REVERSE LUNGES [dumbbell] > WK6: STAGGERED STANCE DL [dumbbell] > WK7: FFE & RFE SPLIT SQTS. [dumbbell] |
| 4 TRACKS - STRENGTH (conjuga / 8-week columns / WEDNESDAY / row#13 | WK1: HEAVY BENCH PRESS [barbell] > WK2: HIGH INCLINE PRESS [barbell] > WK3: HEAVY BENCH PRESS [barbell] > WK4: HIGH INCLINE PRESS [barbell] > WK5: HEAVY BENCH PRESS [barbell] > WK6: HEAVY OH PRESS [barbell] > WK7: HEAVY BENCH PRESS [barbell] > WK8: TEST [None] |
| 4 TRACKS - STRENGTH (conjuga / 8-week columns / WEDNESDAY / row#14 | WK1: BENT OVER ROW [barbell] > WK2: CLOSE GRIP PULL UPS [pullup_bar] > WK3: SEAL ROWS [dumbbell] > WK4: BENT OVER ROWS [barbell] > WK5: PRONATED PULL UPS [pullup_bar] > WK6: SEAL ROWS [dumbbell] > WK7: PRONATED PULL UPS [pullup_bar] |
| 4 TRACKS - STRENGTH (conjuga / 8-week columns / THURSDAY / row#17 | WK1: WEIGHTED DEPTH DROP [load_unspecified] > WK2: DEPTH DROP & JUMP [bodyweight] > WK3: HIGH SQUAT JUMPS [bodyweight] > WK4: REPEAT HIGH JUMPS [bodyweight] > WK5: WEIGHTED DEPTH DROP [load_unspecified] > WK6: DEPTH DROP & JUMP [bodyweight] > WK7: REPEAT HIGH JUMPS [bodyweight] > WK8: DELOAD [None] |
| 4 TRACKS - STRENGTH (conjuga / 8-week columns / THURSDAY / row#18 | WK1: FAST FRONT SQUATS (D) BOX [barbell] > WK2: FAST BANDED DL [barbell] > WK3: FAST HIGH BAR (D)BOX [barbell] > WK4: FAST BANDED DL [barbell] > WK5: FAST FRONT SQUAT [barbell] > WK6: FAST DEADLIFT [barbell] > WK7: FAST HIGH BAR SQUAT [barbell] |
| 4 TRACKS - STRENGTH (conjuga / 8-week columns / THURSDAY / row#19 | WK1: PULL UPS [pullup_bar] > WK2: DB ROWS 8/8 [dumbbell] > WK3: PULL UPS [pullup_bar] > WK4: DB ROWS 8/8 [dumbbell] > WK5: PULL UPS [pullup_bar] > WK6: DB ROWS 8/8 [dumbbell] > WK7: PULL UPS [pullup_bar] |
| 4 TRACKS - STRENGTH (conjuga / 8-week columns / THURSDAY / row#20 | WK1: RFE LUNGES [dumbbell] > WK2: STAGGERED STANCE DL [dumbbell] > WK3: FFE LUNGES [dumbbell] > WK4: STAGGERED STANCE DL [dumbbell] > WK5: REVERSE LUNGES [dumbbell] > WK6: STAGGERED STANCE DL [dumbbell] > WK7: FFE & RFE SPLIT SQTS. [dumbbell] |
| 4 TRACKS - STRENGTH (conjuga / 8-week columns / SATURDAY / row#21 | WK1: FAST BANDED BENCH PRESS [barbell] > WK2: FAST DB OH PRESS [dumbbell] > WK3: FAST BANDED BENCH PRESS [barbell] > WK4: PUSH PRESS [barbell] > WK5: FAST BANDED BENCH PRESS [barbell] > WK6: FAST DB OH PRESS [dumbbell] > WK7: FAST BENCH PRESS [barbell] > WK8: DELOAD [None] |
| 4 TRACKS - STRENGTH (conjuga / 8-week columns / SATURDAY / row#22 | WK1: BENT OVER ROW [barbell] > WK2: CLOSE GRIP PULL UPS [pullup_bar] > WK3: SEAL ROWS [dumbbell] > WK4: BENT OVER ROWS [barbell] > WK5: PRONATED PULL UPS [pullup_bar] > WK6: SEAL ROWS [dumbbell] > WK7: PRONATED PULL UPS [pullup_bar] |
| 4 TRACKS - STRENGTH (conjuga / 12-week column / MONDAY / row#9 | WK1: HIGH BAR SQUAT [barbell] > WK2: RDL (stiff leg deadlift) [barbell] > WK3: HIGH BAR SQUAT [barbell] > WK4: RDL [barbell] > WK5: Front squat [barbell] > WK6: DEADLIFT [barbell] > WK7: HIGH BAR SQUAT [barbell] > WK8: RDL [barbell] > WK9: HIGH BAR SQUAT [barbell] > WK10: RDL [barbell] > WK11: HIGH BAR SQUAT [barbell] > WK12: DEADLIFT [barbell] |
| 4 TRACKS - STRENGTH (conjuga / 12-week column / MONDAY / row#10 | WK1: RDL [barbell] > WK2: HIGH BAR SQUAT [barbell] > WK3: RDL [barbell] > WK4: HIGH BAR [barbell] > WK5: DEADLIFT [barbell] > WK6: Front squat [barbell] > WK7: RDL [barbell] > WK8: Front squat [barbell] > WK9: RDL [barbell] > WK10: Front squat [barbell] > WK11: DEADLIFT [barbell] > WK12: Front squat [barbell] |
| 4 TRACKS - STRENGTH (conjuga / 12-week column / MONDAY / row#11 | WK1: STAGGERED STANCE DL [dumbbell] > WK2: FFE LUNGES [dumbbell] > WK3: STAGGERED STANCE DL [dumbbell] > WK4: REVERSE LUNGES [dumbbell] > WK5: STAGGERED STANCE DL [dumbbell] > WK6: FFE & RFE SPLIT SQTS. [dumbbell] > WK7: STAGGERED STANCE DL [dumbbell] > WK8: FFE LUNGES [dumbbell] > WK9: STAGGERED STANCE DL [dumbbell] > WK10: REVERSE LUNGES [dumbbell] > WK11: STAGGERED STANCE DL [dumbbell] > WK12: FFE & RFE SPLIT SQTS. [dumbbell] |
| 4 TRACKS - STRENGTH (conjuga / 12-week column / MONDAY / row#12 | WK1: LEG EXT [machine] > WK2: LEG CURLS [machine] > WK3: LEG EXT [machine] > WK4: LEG CURLS [machine] > WK5: LEG EXT [machine] > WK6: LEG CURLS [machine] > WK7: LEG EXT [machine] > WK8: LEG CURLS [machine] > WK9: LEG EXT [machine] > WK10: LEG CURLS [machine] > WK11: LEG EXT [machine] > WK12: LEG CURLS [machine] |
| 4 TRACKS - STRENGTH (conjuga / 12-week column / WEDNESDAY / row#13 | WK1: BENCH PRESS [barbell] > WK2: INCLINE BENCH [barbell] > WK3: BENCH PRESS [barbell] > WK4: INCLINE BENCH [barbell] > WK5: BENCH PRESS [barbell] > WK6: INCLINE BENCH [barbell] > WK7: BENCH PRESS [barbell] > WK8: INCLINE BENCH [barbell] > WK9: BENCH PRESS [barbell] > WK10: INCLINE BENCH [barbell] > WK11: BENCH PRESS [barbell] > WK12: INCLINE BENCH [barbell] |
| 4 TRACKS - STRENGTH (conjuga / 12-week column / WEDNESDAY / row#14 | WK1: LAT PULL DOWN [cable] > WK2: MACHINE ROW [machine] > WK3: LAT PULL DOWN [cable] > WK4: MACHINE ROW [machine] > WK5: LAT PULL DOWN [cable] > WK6: MACHINE ROW [machine] > WK7: LAT PULL DOWN [cable] > WK8: MACHINE ROW [machine] > WK9: LAT PULL DOWN [cable] > WK10: MACHINE ROW [machine] > WK11: LAT PULL DOWN [cable] > WK12: MACHINE ROW [machine] |
| 4 TRACKS - STRENGTH (conjuga / 12-week column / WEDNESDAY / row#16 | WK1: SIDE RAISES [dumbbell] > WK2: CURLS [dumbbell] > WK3: SIDE RAISES [dumbbell] > WK4: CURLS [dumbbell] > WK5: SIDE RAISES [dumbbell] > WK6: CURLS [dumbbell] > WK7: SIDE RAISES [dumbbell] > WK8: CURLS [dumbbell] > WK9: SIDE RAISES [dumbbell] > WK10: CURLS [dumbbell] > WK11: SIDE RAISES [dumbbell] > WK12: CURLS [dumbbell] |
| 4 TRACKS - STRENGTH (conjuga / 12-week column / THURSDAY / row#17 | WK1: LEG PRESS [machine] > WK2: DEADLIFT [barbell] > WK3: LEG PRESS [machine] > WK4: DEADLIFT [barbell] > WK5: LEG PRESS [machine] > WK6: DEADLIFT [barbell] > WK7: LEG PRESS [machine] > WK8: DEADLIFT [barbell] > WK9: LEG PRESS [machine] > WK10: DEADLIFT [barbell] > WK11: LEG PRESS [machine] > WK12: DEADLIFT [barbell] |
| 4 TRACKS - STRENGTH (conjuga / 12-week column / THURSDAY / row#18 | WK1: Good morning [barbell] > WK2: LEG PRESS [machine] > WK3: RDL/Good morning [barbell] > WK4: LEG PRESS [machine] > WK5: RDL/Good morning [barbell] > WK6: LOW BAR [barbell] > WK7: RDL/Good morning [barbell] > WK8: LEG PRESS [machine] > WK9: RDL [barbell] > WK10: LEG PRESS [machine] > WK11: RDL [barbell] > WK12: LOW BAR [barbell] |
| 4 TRACKS - STRENGTH (conjuga / 12-week column / THURSDAY / row#19 | WK1: STAGGERED STANCE DL [dumbbell] > WK2: FFE LUNGES [dumbbell] > WK3: STAGGERED STANCE DL [dumbbell] > WK4: REVERSE LUNGES [dumbbell] > WK5: STAGGERED STANCE DL [dumbbell] > WK6: FFE & RFE SPLIT SQTS. [dumbbell] > WK7: STAGGERED STANCE DL [dumbbell] > WK8: FFE LUNGES [dumbbell] > WK9: STAGGERED STANCE DL [dumbbell] > WK10: REVERSE LUNGES [dumbbell] > WK11: STAGGERED STANCE DL [dumbbell] > WK12: FFE & RFE SPLIT SQTS. [dumbbell] |
| 4 TRACKS - STRENGTH (conjuga / 12-week column / THURSDAY / row#20 | WK1: LEG EXT [machine] > WK2: LEG CURLS [machine] > WK3: LEG EXT [machine] > WK4: LEG CURLS [machine] > WK5: LEG EXT [machine] > WK6: LEG CURLS [machine] > WK7: LEG EXT [machine] > WK8: LEG CURLS [machine] > WK9: LEG EXT [machine] > WK10: LEG CURLS [machine] > WK11: LEG EXT [machine] > WK12: LEG CURLS [machine] |
| 4 TRACKS - STRENGTH (conjuga / 12-week column / SATURDAY / row#21 | WK1: INCLINE BENCH [barbell] > WK2: BENCH PRESS [barbell] > WK3: INCLINE BENCH BB [barbell] > WK4: BENCH PRESS [barbell] > WK5: INCLINE BENCH [barbell] > WK6: BENCH PRESS [barbell] > WK7: INCLINE BENCH [barbell] > WK8: BENCH PRESS [barbell] > WK9: INCLINE BENCH [barbell] > WK10: BENCH PRESS [barbell] > WK11: INCLINE BENCH [barbell] > WK12: BENCH PRESS [barbell] |
| 4 TRACKS - STRENGTH (conjuga / 12-week column / SATURDAY / row#22 | WK1: LAT PULL DOWN [cable] > WK2: MACHINE ROW [machine] > WK3: LAT PULL DOWN [cable] > WK4: MACHINE ROW [machine] > WK5: LAT PULL DOWN [cable] > WK6: MACHINE ROW [machine] > WK7: LAT PULL DOWN [cable] > WK8: MACHINE ROW [machine] > WK9: LAT PULL DOWN [cable] > WK10: MACHINE ROW [machine] > WK11: LAT PULL DOWN [cable] > WK12: MACHINE ROW [machine] |
| CONJUGATE (NOT DONE) / 8 WEEK CYCLE / MONDAY / row#13 | WK1: HEAVY FRONT SQUAT (D)BOX SQUAT [barbell] > WK2: HEAVY DEFICIT DEADLIFT [barbell] > WK3: HEAVY (D)BOX HIGH BAR SQUAT [barbell] > WK4: HEAVY CHAINED DEADLIFT [barbell] > WK5: HEAVY FRONT SQUAT [barbell] > WK6: HEAVY DEADLIFT [barbell] > WK7: HEAVY HIGH BAR SQUAT [barbell] > WK8: TEST [None] |
| CONJUGATE (NOT DONE) / 8 WEEK CYCLE / MONDAY / row#14 | WK1: SNATCH GRIP DL [barbell] > WK2: F. SQUAT (T&G)BOX [barbell] > WK3: SNATCH GRIP DL [barbell] > WK4: (T&G)BOX HIGH BAR SQUAT [barbell] > WK5: SNATCH GRIP DL [barbell] > WK6: HIGH BAR SQUAT [barbell] > WK7: DEADLIFT [barbell] |
| CONJUGATE (NOT DONE) / 8 WEEK CYCLE / MONDAY / row#15 | WK1: PULL UPS [pullup_bar] > WK2: DB ROWS 8/8 [dumbbell] > WK3: PULL UPS [pullup_bar] > WK4: DB ROWS 8/8 [dumbbell] > WK5: PULL UPS [pullup_bar] > WK6: DB ROWS 8/8 [dumbbell] > WK7: PULL UPS [pullup_bar] |
| CONJUGATE (NOT DONE) / 8 WEEK CYCLE / MONDAY / row#16 | WK1: RFE LUNGES [dumbbell] > WK2: STAGGERED STANCE DL [dumbbell] > WK3: FFE LUNGES [dumbbell] > WK4: STAGGERED STANCE DL [dumbbell] > WK5: REVERSE LUNGES [dumbbell] > WK6: STAGGERED STANCE DL [dumbbell] > WK7: FFE & RFE SPLIT SQTS. [dumbbell] |
| CONJUGATE (NOT DONE) / 8 WEEK CYCLE / WEDNESDAY / row#17 | WK1: HEAVY BENCH PRESS [barbell] > WK2: HEAVY OH PRESS [barbell] > WK3: HEAVY BENCH PRESS [barbell] > WK4: HEAVY OH PRESS [barbell] > WK5: HEAVY BENCH PRESS [barbell] > WK6: HEAVY OH PRESS [barbell] > WK7: HEAVY BENCH PRESS [barbell] > WK8: TEST [None] |
| CONJUGATE (NOT DONE) / 8 WEEK CYCLE / WEDNESDAY / row#18 | WK1: BENT OVER ROW [barbell] > WK2: CLOSE GRIP PULL UPS [pullup_bar] > WK3: SEAL ROWS [dumbbell] > WK4: BENT OVER ROWS [barbell] > WK5: PRONATED PULL UPS [pullup_bar] > WK6: SEAL ROWS [dumbbell] > WK7: PRONATED PULL UPS [pullup_bar] |
| CONJUGATE (NOT DONE) / 8 WEEK CYCLE / THURSDAY / row#21 | WK1: WEIGHTED DEPTH DROP [load_unspecified] > WK2: DEPTH DROP & JUMP [bodyweight] > WK3: HIGH SQUAT JUMPS [bodyweight] > WK4: REPEAT HIGH JUMPS [bodyweight] > WK5: WEIGHTED DEPTH DROP [load_unspecified] > WK6: DEPTH DROP & JUMP [bodyweight] > WK7: REPEAT HIGH JUMPS [bodyweight] > WK8: DELOAD [None] |
| CONJUGATE (NOT DONE) / 8 WEEK CYCLE / THURSDAY / row#22 | WK1: FAST FRONT SQUATS (D) BOX [barbell] > WK2: FAST BANDED DL [barbell] > WK3: FAST HIGH BAR (D)BOX [barbell] > WK4: FAST CHAINED DL [barbell] > WK5: FAST FRONT SQUAT [barbell] > WK6: FAST DEADLIFT [barbell] > WK7: FAST HIGH BAR SQUAT [barbell] |
| CONJUGATE (NOT DONE) / 8 WEEK CYCLE / THURSDAY / row#23 | WK1: PULL UPS [pullup_bar] > WK2: DB ROWS 8/8 [dumbbell] > WK3: PULL UPS [pullup_bar] > WK4: DB ROWS 8/8 [dumbbell] > WK5: PULL UPS [pullup_bar] > WK6: DB ROWS 8/8 [dumbbell] > WK7: PULL UPS [pullup_bar] |
| CONJUGATE (NOT DONE) / 8 WEEK CYCLE / THURSDAY / row#24 | WK1: RFE LUNGES [dumbbell] > WK2: STAGGERED STANCE DL [dumbbell] > WK3: FFE LUNGES [dumbbell] > WK4: STAGGERED STANCE DL [dumbbell] > WK5: REVERSE LUNGES [dumbbell] > WK6: STAGGERED STANCE DL [dumbbell] > WK7: FFE & RFE SPLIT SQTS. [dumbbell] |
| CONJUGATE (NOT DONE) / 8 WEEK CYCLE / SATURDAY / row#25 | WK1: FAST BANDED BENCH PRESS [barbell] > WK2: FAST DB OH PRESS [dumbbell] > WK3: FAST BANDED BENCH PRESS [barbell] > WK4: FAST BB OH PRESS [barbell] > WK5: FAST BANDED BENCH PRESS [barbell] > WK6: FAST DB OH PRESS [dumbbell] > WK7: FAST BENCH PRESS [barbell] > WK8: DELOAD [None] |
| CONJUGATE (NOT DONE) / 8 WEEK CYCLE / SATURDAY / row#26 | WK1: BENT OVER ROW [barbell] > WK2: CLOSE GRIP PULL UPS [pullup_bar] > WK3: SEAL ROWS [dumbbell] > WK4: BENT OVER ROWS [barbell] > WK5: PRONATED PULL UPS [pullup_bar] > WK6: SEAL ROWS [dumbbell] > WK7: PRONATED PULL UPS [pullup_bar] |
| 4 TRACKS - HYBRID (strength- / weeks E:L / MONDAY / row#74 | WK1: FRONT SQUATS [barbell] > WK2: BACK SQUATS [barbell] > WK3: FRONT SQUATS [barbell] > WK4: BACK SQUATS [barbell] > WK5: FRONT SQUATS [barbell] > WK6: BACK SQUATS [barbell] > WK7: FRONT SQUATS [barbell] > WK8: BACK SQUATS [barbell] |
| 4 TRACKS - HYBRID (strength- / weeks E:L / MONDAY / row#75 | WK1: 2x 2 clean pulls, 2 power cleans [barbell] > WK2: 2x 5 heavy touch and go cleans [barbell] > WK3: 2x 3 clean pulls heavy [barbell] > WK4: 3x 3 heavy power cleans [barbell] > WK5: 4x 2 heavy squat cleans [barbell] > WK6: 2x 3 heavy clean pulls [barbell] > WK7: 2x3 heavy squat cleans [barbell] > WK8: 2x 1 heavy squat clean [barbell] |
| 4 TRACKS - HYBRID (strength- / weeks E:L / TUESDAY / row#80 | WK1: 10x15 Sec sprint/30 sec walk [bodyweight] > WK2: 12x 15 sec sprint/ 30 sec walk [bodyweight] > WK3: 15 x 15 sec sprint/ 30 sec walk [bodyweight] > WK4: 10x 20 sec sprint/ 40 sec walk [bodyweight] > WK5: 12x20 sec sprint/ 40 sec walk [bodyweight] > WK6: 15x 20 sec sprint/40 sec walk [bodyweight] > WK7: 5x 30 sec fast/ 2 min walk [None] > WK8: 10x 30 sec fastest/ 2 min walk [None] |
| 4 TRACKS - HYBRID (strength- / weeks E:L / TUESDAY / row#81 | WK1: 3x6 - DB bench press/ core [dumbbell] > WK2: 3x6 db incline bench press/ core [dumbbell] > WK3: 3x8 - barbell bench press/ core [barbell] > WK4: 3x8 - barbell incline bench press/ [barbell] > WK5: 3x10 DB bench press/ core [dumbbell] > WK6: 3x10 DB incline press/ core [dumbbell] > WK7: 4x6 bb bench/ core [barbell] > WK8: 4x8/ bb incline bench/ core [barbell] |
| 4 TRACKS - HYBRID (strength- / weeks E:L / TUESDAY / row#82 | WK1: Depth drops [bodyweight] > WK2: Weighted depth drops [load_unspecified] > WK3: depth drop to jump [bodyweight] > WK4: weighted depth drops to jump [load_unspecified] > WK5: box jumps [bodyweight] > WK6: box jumps [bodyweight] > WK7: repeat hurdle hops [bodyweight] > WK8: repeat hurdle hops [bodyweight] |
| 4 TRACKS - HYBRID (strength- / weeks E:L / THURSDAY / row#86 | WK1: KB DL [kettlebell] > WK2: KB DL [kettlebell] > WK3: HEX BAR OR DB DL [hex_bar] > WK4: HEX BAR OR DB DL [hex_bar] > WK5: BARBELL DL [barbell] > WK6: KB DL [kettlebell] > WK7: HEX BAR OR DB DL [hex_bar] > WK8: BARBELL DL [barbell] |
| 4 TRACKS - HYBRID (strength- / weeks E:L / THURSDAY / row#87 | WK1: 2x 2 snatch pulls, 2 power snatche [barbell] > WK2: 2x 5 heavy touch and go power snat [barbell] > WK3: 2x 3 snatch pulls heavy [barbell] > WK4: 3x 3 heavy power snatches [barbell] > WK5: 4x 2 heavy squat snatches [barbell] > WK6: 2x 3 heavy snatch pulls [barbell] > WK7: 2x3 heavy power snatches [barbell] > WK8: 2x 1 heavy power snatches [barbell] |
| 4 TRACKS - HYBRID (strength- / weeks E:L / THURSDAY / row#88 | WK1: FE contra/ DB rows/core [dumbbell] > WK2: FFE ipsi/ DB rows/ core [dumbbell] > WK3: FF & RFE ipsi/ DB rows/ core [dumbbell] > WK4: RFE contra/ DB rows/ core [dumbbell] > WK5: RFE ipsi/ DB rows/ core [dumbbell] > WK6: FF & RFE dcontra/ DB rows/ core [dumbbell] > WK7: RFE contra/ DB rows/ core [dumbbell] > WK8: RFE ipsi/ DB rows/ core [dumbbell] |
| 4 TRACKS - HYBRID (strength- / weeks E:L / FRIDAY / row#93 | WK1: Depth drops [bodyweight] > WK2: Weighted depth drops [load_unspecified] > WK3: depth drop to jump [bodyweight] > WK4: weighted depth drops to jump [load_unspecified] > WK5: box jump [bodyweight] > WK6: box jump [bodyweight] > WK7: repeat hurdle hops [bodyweight] > WK8: repeat hurdle hops [bodyweight] |
| 4 TRACKS - HYBRID (strength- / weeks E:L / SATURDAY / row#98 | WK1: BACK SQUATS [barbell] > WK2: FRONT SQUATS [barbell] > WK3: BACK SQUATS [barbell] > WK4: FRONT SQUATS [barbell] > WK5: BACK SQUATS [barbell] > WK6: FRONT SQUATS [barbell] > WK7: BACK SQUATS [barbell] > WK8: FRONT SQUATS [barbell] |
| 4 TRACKS - HYBRID (strength- / weeks E:L / SATURDAY / row#100 | WK1: FF & RFE Lunge goblet / T2B/ hand  [pullup_bar] > WK2: FF & RFE Lunge double dbs/ jumping [dumbbell] > WK3: FF & RFE Lunge/ T2B/ db bench pres [dumbbell] > WK4: FF & RFE Lunge double dbs/ pull up [dumbbell] > WK5: FF & RFE Lunge goblet / T2B/ pushu [pullup_bar] > WK6: FF & RFE Lunge double dbs/ jumping [dumbbell] > WK7: FF & RFE Lunge/ T2B/ db bench pres [dumbbell] > WK8: FF & RFE Lunge double dbs/ pull up [dumbbell] |

## 6. Equipment alternates written by the coach (complete list, verbatim)

| Text (verbatim) | kind (INFERRED) | options: primary implement (constraint) | n | cells | programs |
|---|---|---|---|---|---|
| Any Cardio Equipment | free choice | Any Cardio Equipment: cardio_any (cNone) | 15 | 00:C13, 00:C27, 00:G13, 00:G27, 00:K13, 00:K27 ... | PUSH/PULL/LEGS; UPPER/LOWER |
| Sqats or Leg Press | implement swap (same movement) | Sqats: barbell (c3); Leg Press: machine (c5) | 6 | 00:C17, 00:G17, 00:K17, 06:C40, 06:G40, 06:K40 | PUSH/PULL/LEGS; UPPER/LOWER |
| Deadlifts (DB or Barbell) | implement swap (same movement) | DB Deadlifts: dumbbell (c3); Barbell Deadlifts: barbell (c3) | 6 | 00:C18, 00:G18, 00:K18, 06:C41, 06:G41, 06:K41 | PUSH/PULL/LEGS; UPPER/LOWER |
| Reverse Lunges (Bodyweight or DBs) | implement swap (same movement) | Bodyweight Reverse Lunges: bodyweight (c2); DBs Reverse Lunges: dumbbell (c2) | 6 | 00:C19, 00:G19, 00:K19, 06:C42, 06:G42, 06:K42 | PUSH/PULL/LEGS; UPPER/LOWER |
| Bench Press (DB or Barbell) | implement swap (same movement) | DB Bench Press: dumbbell (c3); Barbell Bench Press: barbell (c3) | 3 | 00:C29, 00:G29, 00:K29 | UPPER/LOWER |
| Pull ups or Lat pull down | implement swap (same movement) | Pull ups: pullup_bar (c3); Lat pull down: cable (c4) | 3 | 00:C30, 00:G30, 00:K30 | UPPER/LOWER |
| Overhead Press (DB or Barbell) | implement swap (same movement) | DB Overhead Press: dumbbell (c3); Barbell Overhead Press: barbell (c3) | 3 | 00:C31, 00:G31, 00:K31 | UPPER/LOWER |
| Curls (any kind) | free choice | Curls (any kind): any_implement (c3) | 3 | 00:C32, 00:G32, 00:K32 | UPPER/LOWER |
| Tricep (any kind) | free choice | Tricep (any kind): any_implement (c3) | 3 | 00:C33, 00:G33, 00:K33 | UPPER/LOWER |
| DB Rows or Row machine | implement swap (same movement) | DB Rows: dumbbell (c3); Row machine Rows: machine (c5) | 3 | 06:C26, 06:G26, 06:K26 | PUSH/PULL/LEGS |
| DB Reverse Flies or Machine | implement swap (same movement) | DB Reverse Flies: dumbbell (c3); Machine Reverse Flies: machine (c5) | 3 | 06:C27, 06:G27, 06:K27 | PUSH/PULL/LEGS |
| Pull ups or Cable Lat pull down | implement swap (same movement) | Pull ups: pullup_bar (c3); Cable Lat pull down: cable (c4) | 2 | 06:G28, 06:K28 | PUSH/PULL/LEGS |
| LAT PULL DOWN/PULL UP | slash alternate (same movement family) | LAT PULL DOWN: cable (c4); PULL UP: pullup_bar (c3) | 9 | 01:J13, 01:J25, 01:M12, 04:H41, 04:H55, 04:I56 ... | 4 TRACKS - AESTHETICS (bodybuilding style); FAT BURN / BODY TONING |
| Machine Dips or dips | implement swap (same movement) | Machine Dips: machine (c5); dips: dip_station (c3) | 20 | 04:O38, 04:P38, 04:P54, 04:Q38, 04:R38, 04:R54 ... | 4 TRACKS - AESTHETICS (bodybuilding style) |
| machine or db flies | implement swap (same movement) | machine flies: machine (c5); db flies: dumbbell (c3) | 12 | 04:P37, 04:P53, 04:R37, 04:R53, 04:T37, 04:T53 ... | 4 TRACKS - AESTHETICS (bodybuilding style) |
| machine rows or db rows | implement swap (same movement) | machine rows: machine (c5); db rows: dumbbell (c3) | 12 | 04:P47, 04:P63, 04:R47, 04:R63, 04:T47, 04:T63 ... | 4 TRACKS - AESTHETICS (bodybuilding style) |
| Cable or DB side raises | implement swap (same movement) | Cable side raises: cable (c4); DB side raises: dumbbell (c3) | 4 | 04:W35, 04:W51, 04:Y35, 04:Y51 | 4 TRACKS - AESTHETICS (bodybuilding style) |
| leg press or just add 2 more rounds to front squats | implement swap (same movement) | leg press: machine (c5); add 2 more rounds to front squats: barbell (c3) | 4 | 04:W42, 04:X42, 04:Y42, 04:Z42 | 4 TRACKS - AESTHETICS (bodybuilding style) |
| machine or db Reverse flies | implement swap (same movement) | machine Reverse flies: machine (c5); db Reverse flies: dumbbell (c3) | 8 | 04:W48, 04:W64, 04:X48, 04:X64, 04:Y48, 04:Y64 ... | 4 TRACKS - AESTHETICS (bodybuilding style) |
| Ez bar curls or barbell | implement swap (same movement) | Ez bar curls: ez_bar (c3); barbell curls: barbell (c3) | 8 | 04:W50, 04:W66, 04:X50, 04:X66, 04:Y50, 04:Y66 ... | 4 TRACKS - AESTHETICS (bodybuilding style) |
| machine rows or db rows (5 sets - 15/12/12/12/10) | implement swap (same movement) | machine rows: machine (c5); db rows (5 sets - 15/12/12/12/10): dumbbell (c3) | 4 | 04:W63, 04:X63, 04:Y63, 04:Z63 | 4 TRACKS - AESTHETICS (bodybuilding style) |
| DEF. DL or SNATCH GRIP | exercise swap (different movement/implement) | DEF. DL: barbell (c3); SNATCH GRIP: barbell (cNone) | 2 | 04:G10, 04:I10 | 4 TRACKS - STRENGTH (conjugate style) |
| RDL/Good morning | slash alternate (same movement family) | RDL: barbell (c3); Good morning: barbell (c3) | 3 | 04:Q18, 04:S18, 04:U18 | 4 TRACKS - STRENGTH (conjugate style) |
| HEAVY Single arm rotational half kneeling cable row or band row or Bird Dog Row | implement swap (same movement) | HEAVY Single arm rotational half kneeling cable row: cable (c2); band row: band (c3); Bird Dog Row: dumbbell (c2) | 1 | 05:C16 | ATHLETIC FULL BODY |
| Pull ups or Lat pull downs | implement swap (same movement) | Pull ups: pullup_bar (c3); Lat pull downs: cable (c4) | 1 | 05:F19 | ATHLETIC FULL BODY |
| Plate core & leg extensions / nordic curls | slash alternate (same movement family) | Plate core & leg extensions: machine (c5); nordic curls: bodyweight (c3) | 1 | 05:F21 | ATHLETIC FULL BODY |
| toes to bar or knees to chest | variant swap (same implement) | toes to bar: pullup_bar (c2); knees to chest: pullup_bar (c2) | 3 | 02:AP67, 02:J31, 02:J67 | BASEBALL |
| 3x 10 cal row sprint or ski | implement swap (same movement) | 3x 10 cal row sprint: rower (c4); ski: ski_erg (c3) | 3 | 02:AA39, 02:BW75, 02:DG74 | BASEBALL |
| 1x 20 cal row sprint or ski | implement swap (same movement) | 1x 20 cal row sprint: rower (c4); ski: ski_erg (c3) | 1 | 02:AS39 | BASEBALL |
| Fast run/ walk back or 3 min walk/rest - This is NOT a sprint, this is a fast run | recovery-mode alternative (not equipment) | Fast run/ walk back or 3 min walk/rest - This is NOT a sprint, this is a fast run: bodyweight (c1) | 3 | 02:CC48, 02:DI29, 02:DL47 | BASEBALL |
| Pull ups or Close grip cable lat pull down | implement swap (same movement) | Pull ups: pullup_bar (c3); Close grip cable lat pull down: cable (c4) | 1 | 02:BO53 | BASEBALL |
| 45 degree hyper-extension machine - Kb swings | ambiguous: alternate OR superset written with " - " | 45 degree hyper-extension machine - Kb swings: machine (c2) | 1 | 02:BS52 | BASEBALL |
| pull ups or banded assisted pull ups | implement swap (same movement) | pull ups: pullup_bar (c3); banded assisted pull ups: band (c3) | 2 | 02:CG53, 02:DP52 | BASEBALL |
| weighted Pull ups or max reps Close grip cable lat pull down | implement swap (same movement) | weighted Pull ups: pullup_bar (c3); max reps Close grip cable lat pull down: cable (c4) | 1 | 02:CY53 | BASEBALL |
| HEX BAR OR DB DL | implement swap (same movement) | HEX BAR DL: hex_bar (c3); DB DL: dumbbell (c3) | 3 | 04:G86, 04:H86, 04:K86 | 4 TRACKS - HYBRID (strength-athletic-crossfitish) |
| 20 sec fast/ 40 sec slow (cardio of choice) | free choice | 20 sec fast/ 40 sec slow (cardio of choice): cardio_any (cNone) | 1 | 07:D7 | BOXING 8 WEEK BUILD UP |
| Situps / Toes to bar | paired movements (reps split by "/") | Situps / Toes to bar: pullup_bar (c2) | 1 | 07:D8 | BOXING 8 WEEK BUILD UP |
| Lat pull downs/pullups | slash alternate (same movement family) | Lat pull downs: cable (c4); pullups: pullup_bar (c3) | 2 | 07:D21, 07:D47 | BOXING 8 WEEK BUILD UP |
| Situps/crunches | paired movements (reps split by "/") | Situps/crunches: bodyweight (c4) | 1 | 07:D31 | BOXING 8 WEEK BUILD UP |
| Easy cardio of choice (steady pace) | free choice | Easy cardio of choice (steady pace): cardio_any (cNone) | 1 | 07:D44 | BOXING 8 WEEK BUILD UP |
| Clean Pull/ hang Power Clean | ambiguous: alternate OR complex (two Olympic derivatives) | Clean Pull: barbell (c2); hang Power Clean: barbell (c2) | 1 | 07:L10 | BOXING 8 WEEK BUILD UP |
| Cardio of any choice | free choice | Cardio of any choice: cardio_any (cNone) | 1 | 07:L19 | BOXING 8 WEEK BUILD UP |

First-listed option across the equipment alternates: pullup_bar 7, machine 7, dumbbell 5, cable 4, barbell 3, rower 2, bodyweight 1, ez_bar 1, hex_bar 1.

**Coach notes that govern substitution (verbatim, OBSERVED):**

- `EXAMPLE UPPERLOWER SPLIT!A6`: '***The lower the reps, the higher the weight... Always go for 1-3 RIR (REPS IN RESERVE) aka RPE 7+'
- `EXAMPLE UPPERLOWER SPLIT!A7`: '****When there are joint pains, usually getting away from fixed grips (barbells, bars) and going split grips (dumbbells, kbs, indivitual grips) help take care of some stuff'
- `EXAMPLE PUSHPULLLEGS SPLIT!A7`: '****When there are joint pains, usually getting away from fixed grips (barbells, bars) and going split grips (dumbbells, kbs, indivitual grips) help take care of some stuff'
- `EXAMPLE ATHLETIC FULL BODY SPLI!A6`: '****When there are joint pains, usually going unilateral or/and also getting away from fixed grips (barbells, bars) and going split grips (dumbbells, kbs, indivitual grips) help take care of some stuff'

Substitution logic visible in the cells (INFERRED):
1. **Same pattern, different implement:** (DB or Barbell), machine or db, Cable or DB, Ez bar or barbell, HEX BAR OR DB. The pattern is fixed and the implement is free.
2. **Regression ladders inside one cell:** 'Pull ups or Lat pull down' (bodyweight > cable, constraint 3 > 4), 'pull ups or banded assisted pull ups', 'weighted Pull ups or max reps Close grip cable lat pull down', 'Reverse Lunges (Bodyweight or DBs)', 'toes to bar or knees to chest'.
3. **Machine as the safe/volume option:** 'Sqats or Leg Press', 'DB Rows or Row machine', 'DB Reverse Flies or Machine', 'Machine Dips or dips', and 'leg press or just add 2 more rounds to front squats' (the machine can be replaced by more sets of the free-weight lift).
4. **Free choice where the stimulus, not the tool, matters:** 'Curls (any kind)', 'Tricep (any kind)', 'Any Cardio Equipment', 'cardio of choice', 'row sprint or ski'.
5. **Joint pain:** move away from fixed grips (barbell, bar) to split grips (DB, KB, individual handles), and for athletes 'going unilateral'.

## 7. Load and speed prescriptions tied to implements (complete catalogue)

| cue (pattern matched in name/reps/load cells) | implement | n | tiers | examples (cell, text) |
|---|---|---|---|---|
| EASY | CARDIO | 13 | COND 13 | 02:DW34 'Paced Cardio - easy' reps='10 min'; 02:EA34 'Paced Cardio - easy' reps='10 min'; 02:EE34 'Paced Cardio - easy' reps='10 min' |
| EASY | BW-bal | 10 | T1 10 | 04:F17 'DEPTH DROP & JUMP' reps='6' load='EASY'; 04:G17 'HIGH SQUAT JUMPS' reps='6' load='EASY'; 04:H17 'REPEAT HIGH JUMPS' reps='6' load='EASY' |
| EASY | LOAD? | 4 | T1 4 | 04:E17 'WEIGHTED DEPTH DROP' reps='6' load='EASY'; 04:I17 'WEIGHTED DEPTH DROP' reps='6' load='EASY'; 12:E21 'WEIGHTED DEPTH DROP' reps='6' load='EASY' |
| HEAVY | BB | 52 | T3 35, T2 17 | 04:E9 'HEAVY FRONT SQUAT (D)BOX SQUAT' reps='SEE -> 5 (row 5)' load='1RIR'; 04:E13 'HEAVY BENCH PRESS' reps='SEE -> 5 (row 5)' load='1RIR'; 04:F9 'HEAVY DEFICIT DEADLIFT' reps='SEE -> 4 (row 5)' load='1RIR' |
| HEAVY | DB | 26 | T4 11, T5 8, T2 3, T1 3, T3 1 | 05:C18 'SUPERSET: HEAVY Ipsilateral DB front foot elevated lunge directly into no weight l; 05:C34 'HEAVY: Camporini DL' reps='8*8'; 05:C35 'HEAVY: Heavy walking lunges' reps='8*8' |
| HEAVY | CBL | 6 | T3 3, T5 2, T4 1 | 05:C16 'HEAVY Single arm rotational half kneeling cable row or band row or Bird Dog Row' r; 02:CC34 'Cable lat pull over' reps='heavy Max reps'; 02:CU35 'Close grip cable lat pull down' reps='heavy Max reps' |
| HEAVY | KB | 3 | T2 3 | 02:DQ34 'kb swings heavy' reps='12/12/10/10'; 02:CK52 'kb swings heavy' reps='12'; 02:DT51 'kb swings heavy' reps='12' |
| HEAVY | PLATE | 2 | CORE 2 | 02:I48 'heavy plate russian twists' reps='Accumulate 3 minutes of'; 02:W66 'heavy plate russian twists' reps='20/20' |
| HEAVY | BW | 1 | T4 1 | 02:BO53 'Pull ups or Close grip cable lat pull down' reps='heavy Max reps' |
| LOAD & jump hard | LOAD? | 1 | T2 1 | 05:C14 'Really high jump squats LOAD & jump hard' reps='8' |
| RIR | BB | 110 | T3 86, T2 24 | 04:E35 'FRONT SQUATS' reps='12' load='1-2 RIR'; 04:E37 'DEALIFTS' reps='12' load='1-2 RIR'; 04:E49 'FRONT SQUATS' reps='12' load='1-2 RIR' |
| RIR | DB | 74 | T4 62, T5 8, T2 4 | 04:E38 'FFE CONTRA LUNGES' reps='12' load='1-2 RIR'; 04:E39 'SL RDL' reps='12' load='1-2 RIR'; 04:E41 'DB BENCH PRESS' reps='12' load='1-2 RIR' |
| RIR | BW | 20 | T4 20 | 04:E19 'PULL UPS' reps='6' load='2RIR'; 04:F14 'CLOSE GRIP PULL UPS' reps='6' load='2RIR'; 04:F22 'CLOSE GRIP PULL UPS' reps='6' load='2RIR' |
| RIR | CBL | 14 | T4 14 | 04:E42 'UNILATERAL LAT PULL DOWN' reps='12' load='1-2 RIR'; 04:E56 'UNILATERAL LAT PULL DOWN' reps='12' load='1-2 RIR'; 04:F41 'UNILATERAL LAT PULL DOWN' reps='10' load='1-2 RIR' |
| RIR | MACH | 8 | T4 8 | 04:E44 'MACHINE SUPPORTED ROW' reps='12' load='1-2 RIR'; 04:E59 'MACHINE SUPPORTED ROW' reps='12' load='1-2 RIR'; 04:F43 'MACHINE SUPPORTED ROW' reps='10' load='1-2 RIR' |
| RPE | BB | 18 | T2 18 | 04:O21 'INCLINE BENCH' reps='FAST RPE6 or about 60-70%'; 04:P17 'DEADLIFT' reps='FAST RPE6 or about 60-70%'; 04:P21 'BENCH PRESS' reps='FAST RPE6 or about 60-70%' |
| RPE | MACH | 6 | T2 6 | 04:O17 'LEG PRESS' reps='FAST RPE6 or about 60-70%'; 04:Q17 'LEG PRESS' reps='FAST RPE6 or about 60-70%'; 04:S17 'LEG PRESS' reps='FAST RPE6 or about 60-70%' |
| RPE (week header row 4) | BB | 24 | T3 24 | 04:O9 'HIGH BAR SQUAT' reps='M.E.'; 04:O13 'BENCH PRESS' reps='M.E.'; 04:P9 'RDL (stiff leg deadlift)' reps='M.E.' |
| banded (accommodating/assisted/resisted) | BB | 19 | T2 15, T3 4 | 04:E21 'FAST BANDED BENCH PRESS' reps='SEE -> 3 (row 6)' load='1RIR'; 04:F18 'FAST BANDED DL' reps='SEE -> 3 (row 6)' load='1RIR'; 04:G21 'FAST BANDED BENCH PRESS' reps='SEE -> 2 (row 6)' load='1RIR' |
| banded (accommodating/assisted/resisted) | BAND | 8 | T1 3, T5 3, T2 2 | 05:C27 'Banded fast LAT PULL DOWNS Single Arm' reps='30---30'; 05:F47 'Max speed banded lat pull downs half kneeling ipsilateral' reps='20 sec. '; 02:DE37 'Banded tantrums (sprint)' reps='20 sec. ' |
| banded (accommodating/assisted/resisted) | KB | 4 | T2 4 | 02:BO33 'Banded KB swings' reps='12/10/8/8'; 02:DC52 'banded kb swings' reps='10'; 02:CS69 'BANDED KB SWINGS' reps='10' |
| banded (accommodating/assisted/resisted) | BW | 2 | T4 2 | 02:CG53 'pull ups or banded assisted pull ups' reps='8/12'; 02:DP52 'pull ups or banded assisted pull ups' reps='8/12' |
| banded (accommodating/assisted/resisted) | CBL | 1 | T4 1 | 05:C16 'HEAVY Single arm rotational half kneeling cable row or band row or Bird Dog Row' r |
| chains | BB | 3 | T3 2, T2 1 | 04:H9 'HEAVY CHAINED DEADLIFT' reps='SEE -> 2 (row 5)' load='1RIR'; 12:H13 'HEAVY CHAINED DEADLIFT' reps='SEE -> 2 (row 9)' load='1RIR'; 12:H22 'FAST CHAINED DL' reps='SEE -> 1 (row 10)' load='1RIR' |
| deficit / box / T&G | BB | 18 | T3 14, T2 4 | 04:H35 'DEFICIT DEADLIFTS' reps='12' load='1-2 RIR'; 04:H49 'DEFICIT DEADLIFTS' reps='12' load='1-2 RIR'; 04:E9 'HEAVY FRONT SQUAT (D)BOX SQUAT' reps='SEE -> 5 (row 5)' load='1RIR' |
| deficit / box / T&G | DB | 3 | T4 3 | 02:DI37 'DB alternating Deficit Reverse lunges from plate' reps='12/12'; 02:CC55 'DB alternating Deficit Reverse lunges from plate' reps='12/12'; 02:DL54 'DB alternating Deficit Reverse lunges from plate' reps='12/12' |
| deficit / box / T&G | BW | 1 | T4 1 | 02:EL52 'slow eccentric deficit Lunges (no weigths)' reps='8/8' |
| deficit / box / T&G | LOAD? | 1 | T4 1 | 07:L36 'Weighted Bulgarian Lunge Heel held up + SL Def. Weighted Calf Raises' reps='6/6 -  |
| full ROM / 1/4 / range | MACH | 2 | T5 2 | 07:L14 'Leg ext. Leg Curls (FULL RANGE OF MOTION)' reps='6 & 6'; 07:L37 'Leg ext. Leg Curls (FULL RANGE OF MOTION)' reps='20/20' |
| full ROM / 1/4 / range | BW | 1 | T5 1 | 05:J40 'Heel raises & fast/rythmic/1/4 SQUATS' reps='8' |
| full ROM / 1/4 / range | DB | 1 | T5 1 | 02:BB74 'Side Raises FULL ROM' reps='10' |
| light | BB | 2 | T2 2 | 02:BU33 'Front squats - light weights - same speed for all reps' reps='12/12/12/12'; 02:AO51 'Front squats - light weights - same speed for all reps' reps='4/4/4/4' |
| loading position (ipsi/contra/suitcase/front rack/goblet/zercher/double) | DB | 58 | T4 52, T2 4, T5 2 | 04:E38 'FFE CONTRA LUNGES' reps='12' load='1-2 RIR'; 04:E51 'FFE CONTRA LUNGES' reps='12' load='1-2 RIR'; 04:F38 'FFE IPSI LUNGES' reps='10' load='1-2 RIR' |
| loading position (ipsi/contra/suitcase/front rack/goblet/zercher/double) | BW | 7 | T4 7 | 02:AW37 'offset pushups' reps='8/8'; 02:BO37 'offset pushups' reps='8/8'; 02:Q55 'offset pushups' reps='10/10' |
| loading position (ipsi/contra/suitcase/front rack/goblet/zercher/double) | BB | 6 | T3 5, T2 1 | 02:AK33 'fast high zercher squats' reps='12/10/8/8'; 02:CM34 'barbell High zercher squat' reps='12/10/10/8'; 02:CU34 'Zercher squats' reps='12/10/10/8' |
| loading position (ipsi/contra/suitcase/front rack/goblet/zercher/double) | KB | 4 | T4 4 | 02:DQ37 'kb front rack lateral lunge kb lunges' reps='8/8'; 02:CK55 'kb front rack lateral lunge kb lunges' reps='10/10'; 02:DT54 'kb front rack lateral lunge kb lunges' reps='12/12' |
| loading position (ipsi/contra/suitcase/front rack/goblet/zercher/double) | BAND | 1 | T2 1 | 05:F47 'Max speed banded lat pull downs half kneeling ipsilateral' reps='20 sec. ' |
| max reps / myo / AMRAP | DB | 114 | T5 55, T4 55, T2 4 | 00:C23 'Calf Raises' reps='MAX REPS'; 00:G23 'Calf Raises' reps='MAX REPS'; 00:K23 'Calf Raises' reps='MAX REPS' |
| max reps / myo / AMRAP | BW | 17 | T4 10, CORE 4, T5 2, T3 1 | 06:K19 'Dips' reps='MAX'; 04:E11 'PULL UPS' reps='8' load='MAX'; 04:G11 'PULL UPS' reps='8' load='MAX' |
| max reps / myo / AMRAP | CBL | 13 | T5 10, T3 3 | 02:G37 'Cable tricep ext' reps='max'; 02:CC34 'Cable lat pull over' reps='heavy Max reps'; 02:CU35 'Close grip cable lat pull down' reps='heavy Max reps' |
| max reps / myo / AMRAP | BB | 8 | T3 6, T5 2 | 04:W52 'bench press + superset with max pushup set (only 1 set of max pushups per set of b; 04:X52 'incline bench press + superset with a set of max bench dips, one set only per set ; 04:Y52 'bench press + superset with max pushup set (only 1 set of max pushups per set of b |
| max reps / myo / AMRAP | MACH | 4 | T4 4 | 04:W61 '2 sets LEG PRESS MYO - 15-5-5-5-5-5' reps='15/12/10/8-20'; 04:X61 '2 sets LEG PRESS MYO - 15-5-5-5-5-5' reps='12/12/10/10-20'; 04:Y61 '2 sets LEG PRESS MYO - 15-5-5-5-5-5' reps='12/12/12/12-20' |
| max reps / myo / AMRAP | ANY | 3 | T5 3 | 00:C32 'Curls (any kind)' reps='MAX REPS'; 00:G32 'Curls (any kind)' reps='MAX REPS'; 00:K32 'Curls (any kind)' reps='MAX REPS' |
| max reps / myo / AMRAP | BAND | 2 | T2 1, T5 1 | 05:F47 'Max speed banded lat pull downs half kneeling ipsilateral' reps='20 sec. '; 02:AS73 'overhead band tricep ext' reps='max reps' |
| max reps / myo / AMRAP | MB | 2 | CORE 1, T1 1 | 05:F62 'Med ball Star Supine Cross Connects UNBROKEN' reps='20/20'; 07:L34 '8 Box Med Ball rocker into 4 hops + Swiss ball knee tuck ins' reps='25 unbroken' |
| mid weight | BB | 1 | T2 1 | 05:C36 'SUPERSET: Low Hang Power Cleans (mid weight)' reps='8' |
| mid weight | MACH | 1 | T5 1 | 05:C39 'Superset: leg ext. leg curls (MID WEIGHT)' reps='16//16' |
| no weight | BW | 13 | T4 13 | 00:C19 'Reverse Lunges (Bodyweight or DBs)' reps='12/12'; 00:G19 'Reverse Lunges (Bodyweight or DBs)' reps='10/10'; 00:K19 'Reverse Lunges (Bodyweight or DBs)' reps='8/8' |
| no weight | BB | 4 | T3 4 | 04:W41 'front squats + Superset with 15 squats with no weight every set' reps='15/12/10/8-; 04:X41 'front squats + Superset with 15 squats with no weight every set' reps='12/12/10/10; 04:Y41 'front squats + Superset with 15 squats with no weight every set' reps='12/12/12/12 |
| no weight | DB | 1 | T2 1 | 05:C18 'SUPERSET: HEAVY Ipsilateral DB front foot elevated lunge directly into no weight l |
| percent_1RM | BB | 42 | T2 42 | 04:O21 'INCLINE BENCH' reps='FAST RPE6 or about 60-70%'; 04:P17 'DEADLIFT' reps='FAST RPE6 or about 60-70%'; 04:P21 'BENCH PRESS' reps='FAST RPE6 or about 60-70%' |
| percent_1RM | MACH | 6 | T2 6 | 04:O17 'LEG PRESS' reps='FAST RPE6 or about 60-70%'; 04:Q17 'LEG PRESS' reps='FAST RPE6 or about 60-70%'; 04:S17 'LEG PRESS' reps='FAST RPE6 or about 60-70%' |
| percent_1RM (week header row 3) | BB | 12 | T3 12 | 04:O9 'HIGH BAR SQUAT' reps='M.E.'; 04:O13 'BENCH PRESS' reps='M.E.'; 04:P9 'RDL (stiff leg deadlift)' reps='M.E.' |
| same speed / fast / max speed | BB | 48 | T2 48 | 04:E18 'FAST FRONT SQUATS (D) BOX' reps='SEE -> 3 (row 6)' load='1RIR'; 04:E21 'FAST BANDED BENCH PRESS' reps='SEE -> 3 (row 6)' load='1RIR'; 04:F18 'FAST BANDED DL' reps='SEE -> 3 (row 6)' load='1RIR' |
| same speed / fast / max speed | BW-bal | 22 | COND 18, T1 4 | 05:C15 'High Knee Runs FAST' reps=':30 sec.'; 02:DI29 'Fast run/ walk back or 3 min walk/rest - This is NOT a sprint, this is a fast run; 02:E57 '1x 30 Sec Fast Run' |
| same speed / fast / max speed | CBL | 8 | CORE 8 | 02:W30 'Cable rotational oblique twist' reps='12/12 powerful turns'; 02:AE30 'Cable rotational oblique twist' reps='12/12 powerful turns'; 02:AW30 'Cable rotational oblique twist' reps='12/12 powerful turns' |
| same speed / fast / max speed | MACH | 6 | T2 6 | 04:O17 'LEG PRESS' reps='FAST RPE6 or about 60-70%'; 04:Q17 'LEG PRESS' reps='FAST RPE6 or about 60-70%'; 04:S17 'LEG PRESS' reps='FAST RPE6 or about 60-70%' |
| same speed / fast / max speed | SLD/SB | 6 | T5 6 | 02:AK36 'Glidder hamstring runners' reps='20 on each side - FAST '; 02:BC36 'Glidder hamstring runners' reps='20 on each side - FAST '; 02:E54 'Glidder hamstring runners' reps='20 on each side - FAST ' |
| same speed / fast / max speed | BW | 5 | CORE 3, T4 1, T5 1 | 05:F45 'Bench glute Bridge & fast alternating DB sesaw floor press' reps='6 & 6'; 05:J40 'Heel raises & fast/rythmic/1/4 SQUATS' reps='8'; 02:AO30 'floor windshield whipers' reps='12/12 powerful turns' |
| same speed / fast / max speed | DB | 4 | T2 4 | 04:F21 'FAST DB OH PRESS' reps='SEE -> 3 (row 6)' load='1RIR'; 04:J21 'FAST DB OH PRESS' reps='SEE -> 2 (row 6)' load='1RIR'; 12:F25 'FAST DB OH PRESS' reps='SEE -> 3 (row 10)' load='1RIR' |
| same speed / fast / max speed | BAND | 2 | T2 2 | 05:C27 'Banded fast LAT PULL DOWNS Single Arm' reps='30---30'; 05:F47 'Max speed banded lat pull downs half kneeling ipsilateral' reps='20 sec. ' |
| same speed / fast / max speed | ? | 2 | COND 2 | 04:K80 '5x 30 sec fast/ 2 min walk'; 04:L80 '10x 30 sec fastest/ 2 min walk' |
| same speed / fast / max speed | KB | 1 | T2 1 | 02:AI51 'Fast KB swings' reps='12/12/12/12' |
| same speed / fast / max speed | MB | 1 | T1 1 | 02:AW47 'MB fast chest pass' reps='10' |
| same speed / fast / max speed | CARDIO | 1 | COND 1 | 07:D7 '20 sec fast/ 40 sec slow (cardio of choice)' reps='20/40' |
| same weight coupling | BB | 1 | T3 1 | 02:BU34 'bent over barbell rows same weight of front squats' reps='Superset - same reps' |
| slow / eccentric / iso | CARDIO | 25 | COND 25 | 01:D17 '30-40 mi slow/steady CARDIO'; 01:D30 '30-40 mi slow/steady CARDIO'; 01:G17 '30-40 mi slow/steady CARDIO' |
| slow / eccentric / iso | LOAD? | 3 | T1 3 | 05:F12 'weighted Depth Drops - Drop & Stick - Hold for 3 seconds on each one' reps='8'; 05:F41 'Weighted Depth Drops - Drop & Stick - Hold for 3 seconds on each one' reps='8'; 05:J12 'Weighted Depth Drops - Drop & Stick - Hold for 3 seconds on each one' reps='8' |
| slow / eccentric / iso | DB | 2 | T4 1, T2 1 | 02:AA33 'Goblet squat slow' reps='12/10/8/8'; 02:BS55 'Suitcase DB RFE iso holds / RFE lunge jumps' reps='8secs / 10 reps each ' |
| slow / eccentric / iso | BW | 2 | T4 1, CORE 1 | 02:EL52 'slow eccentric deficit Lunges (no weigths)' reps='8/8'; 02:AJ66 'Side planks hips lifts (slow)' reps='10/10' |
| slow / eccentric / iso | BB | 2 | T3 2 | 02:BW69 'front squat slow' reps='10'; 02:DG68 'SLOW FRONT SQUATS' reps='10' |
| slow / eccentric / iso | CBL | 1 | CORE 1 | 02:AI48 'Cable rotational oblique twist' reps='12/12 slow turns' |
| weighted / with weight | LOAD? | 18 | T1 11, T2 4, CORE 2, T4 1 | 04:E17 'WEIGHTED DEPTH DROP' reps='6' load='EASY'; 04:I17 'WEIGHTED DEPTH DROP' reps='6' load='EASY'; 12:E21 'WEIGHTED DEPTH DROP' reps='6' load='EASY' |
| weighted / with weight | DB | 15 | T5 14, T1 1 | 02:J38 'weighted calf raises' reps='10/10'; 02:AA38 'weighted calf raises' reps='10/10'; 02:AS38 'weighted calf raises' reps='10/10' |
| weighted / with weight | MB | 2 | CORE 2 | 02:BK30 'Weighted leg raises medball' reps='50 Reps'; 02:AE48 'Weighted leg raises medball' reps='75 Reps' |
| weighted / with weight | BW | 1 | T3 1 | 02:CY53 'weighted Pull ups or max reps Close grip cable lat pull down' reps='6 to 10' |

Medball load: **none written** in any program tab. The boxing medball list (`07:F50` 'MED BALL VARIATIONS', 19 throws x 10 reps, `07:F51:G69`) and the athletic '*MEDBALLS' / 'ALL LIST' links point to the ballistics tab. That tab sets intent, not weight:
- `(NOT DONE) ALL ABOUT BALLISTICS!A22`: 'BALLISTIC PURPOSE - BE EXPLOSIVELY & FAST'
- `(NOT DONE) ALL ABOUT BALLISTICS!D22`: 'PLYOMETRIC PURPOSE - BE REACTIVE & BOUNCY'
- `(NOT DONE) ALL ABOUT BALLISTICS!A23`: '*I USE THESE FOR MUSCULAR FORCE PRODUCTION'
- `(NOT DONE) ALL ABOUT BALLISTICS!D23`: '*I USE THESE FOR REACTIVE CONNECTIVE TISSUE ADAPTATIONS'

Speed bands written by the coach (`02:A19:F22`, OBSERVED):
- `A19`: 'RESISTANCE PATTERNS'
- `B19`: 'COMPOUND'
- `C19`: 'SMALLER ISOLATIONS'
- `E19`: 'ATHLETIC PATTERNS'
- `A20`: 'VOL 1'
- `B20`: '12-15 Reps'
- `C20`: '10-12 Reps'
- `E20`: 'SPEED ENDURANCE'
- `F20`: '>40 Secs'
- `A21`: 'VOL 2'
- `B21`: '8-12 Reps'
- `C21`: '15 REPS'
- `E21`: 'SPEED POWER'
- `F21`: '10-39 Secs'
- `A22`: 'VOL 3'
- `B22`: '6-8 Reps'
- `C22`: 'MAX REPS'
- `E22`: 'SPEED STRENGTH & POWER'
- `F22`: '0-12 Secs'

## 8. The coach's training variables as they appear in the sheets

| Variable (coach's words) | Where it is written (OBSERVED) | How the sheets vary it (INFERRED) |
|---|---|---|
| Speed / velocity ('the lighter I go, the faster') | 'FAST ...' DE lifts (`12:E22:K22`, `12:E25:K25`); 'light weights - same speed for all reps' (`02:BU33`); 'FAST RPE6 or about 60-70%' (`04:N17`, `N21`); 'Max speed banded lat pull downs' (`05:F47`); 'powerful turns' (`02:V30`); 'This is NOT a sprint, this is a fast run' (`02:DI29`) | Speed is set by intent words plus lighter load (60-70%, light, band-assisted). Heavy ('HEAVY', '1RIR') and fast ('FAST', 'EASY') days alternate on the conjugate tracks (Mon/Wed ME, Thu/Sat DE). |
| Load | 'HEAVY', '@ 75%'-'@ 90%', '1RIR'/'2RIR'/'1-2 RIR', 'RPE' row `04:N4`, 'mid weight', 'LOAD & jump hard', 'same weight of front squats' (`02:BU34`) | % only for barbell Olympic and main lifts. RIR for everything resistance. Plyos are prescribed by intent ('EASY', 'hard'), never by load. |
| Range of motion | 'FULL RANGE OF MOTION' (`07:L14`, `L37`); 'Side Raises FULL ROM' (`02:BB74`); 'fast/rythmic/1/4 SQUATS' (`05:J40`); 'Deficit', '(D)BOX', '(T&G)BOX' (`12:E13`, `04:F10`) | Full ROM on isolation/machine work. Partial (1/4, box) on fast or strength work. ROM is changed with deficits and boxes, not with a different implement. |
| Volume (sets x reps over time) | conjugate set/rep rows `12:E9:L10`, `04:E4:L6`, `04:O5:Z6`; boxing sets per week `07:E6:J49`; HYBRID `04:E71:L72` | Sets step up week to week on the same exercises. Boxing weeks 3-8 take the lead line of each day 3 > 3 > 3 > 3 > 4 > 6 ('Single Leg swiss ball knee tuck in + DB rows' `07:E20:J20`, 'Hang Power Clean & Press' `07:E35:J35`, '4 Deadlifts - 5 broad jumps - 5 KB swings - 5/5 High Knee runs' `07:E46:J46`) while most accessory lines drop to 2 in week 7 (`07:I12:I14`). HYBRID SETS row runs 2-2-2-3-3-3-4-4 (`04:E71:L71`). This is the coach's 'more sets next week of the same thing'. |
| Variety without 'confusing' | rotations table in section 5 | The pattern slot stays fixed for the block; the implement, stance (FFE/RFE, ipsi/contra) or speed changes each week. |

## 9. Equipment rules for the generator (INFERRED from the evidence above)

1. **Order a session by tier:** warm-up > T1 power (medball/plyo/sprint) > core > OPTIONAL Olympic T2 > Part C (bilateral strength lift, T3 or T2 speed variant, supersetted with one upper H/V pattern) > Part D (unilateral T4 + 2 isolation/accessory) > conditioning buy-out. This is the BASEBALL Part A-E template. Gen-pop sessions drop T1/T2 and start at T3/T4.
2. **Put horizontal before vertical across the week:** Mon horizontal pull, Tue horizontal push, Thu vertical pull, Fri vertical push. Within a 2-day upper split, use row > press > pulldown > overhead press (UL upper day).
3. **Choose implements by population:** athletes 0-1% machines and around 30% constraint-1 work; gen pop allows machines/cables freely (about 33% constraint 4-5); strength tracks are barbell main lift + DB accessories.
4. **Substitute when equipment is missing,** using the coach's own pairs: barbell <> DB (bench, OHP, deadlift); squat <> leg press; pull-up <> lat pulldown <> band-assisted pull-up; DB row <> machine row; DB fly <> machine/cable fly; cable <> DB side raise; hex <> DB deadlift; row erg <> ski erg; any cardio. With no equipment: bodyweight lunges ('(Bodyweight or DBs)'), plyos, medball or bodyweight core. Keep the pattern and change the implement.
5. **Joint pain or older client:** move to split grips (DB/KB), unilateral work and higher-constraint machines (coach's statement) and remove T2 Olympic lifts. Keep T1 only as low-level landing work ('Depth drop', 'Stick the landing').
6. **Speed intent:** medball and plyo lines carry no load number. Default a medball to light (coach speech: 8-10 lb, not in sheet). For a barbell speed day use 60-70% or 'light weights - same speed for all reps'; Olympic lifts progress 75 > 80 > 85 > 90% while reps fall 8 > 6 > 6 > 4.
7. **Progress across weeks** by rotating implement or stance inside a fixed slot, by adding sets, or by raising %. Keep the pattern.

## 10. Open questions for the coach

1. HYBRID (`04:B74:B101`) and the CrossFit grid list 'STRENGTH' above 'OLY/ POWER'. Is that the order to perform them, or just a checklist? In BASEBALL the Olympic 'OPTIONAL PIECE' always comes before Part C strength.
2. In the CrossFit class model ('WARMUP/SKILL' | 'STRENGTH/POWER' | 'WOD'), which comes first inside 'STRENGTH/POWER' on a day that has both, for example TUES 'PRESS' + 'SNATCH'?
3. Medball weights are never written. Is the rule 8-10 lb for upper-body passes/throws and something heavier for slams and scoops? What about youth athletes and women?
4. Ankle hops, hurdle hops and DB snatch / push press / high pull appear at the end of BASEBALL Part D in the 'calfs'/'shoulders' slots. Do you intend them as low-intensity accessories, or should they move earlier when the athlete is fresh?
5. The AESTHETICS 12-week track opens with 'cable Side Raises' / 'DB side raises' / 'Arnold press' before 'Incline bench', and puts lat pulldowns before rows. Is isolation-first (pre-exhaust / priority) the deliberate rule for bodybuilding clients, given that UL/PPL go row-first and compound-first?
6. FAT BURN rotates 'LEG PRESS' and 'DEADLIFTS' as the first exercise every week, and puts 'SINGLE ARM LAT PULL DOWN' before 'MACHINE SUPPORTED ROW'. Is week-to-week order rotation a variable you use on purpose?
7. When an alternate is written ('Sqats or Leg Press', 'Deadlifts (DB or Barbell)'), is the first option the default for everyone, or should the generator choose by client: injured or older > machine/DB, experienced > barbell?
8. Plain names with no implement ('DEADLIFTS', 'BENCH PRESS', 'OVERHEAD PRESS', 'LUNGES', 'SL RDL', 'CURLS', 'Calf Raises', 'Rows', 'Pull under'): which implement is the default? What is 'Pull under' (`04:O48`)?
9. Do 'Situps / Toes to bar' (15/10) and 'Situps/crunches' (20/20) mean both exercises, and do 'Lat pull downs/pullups' and 'RDL/Good morning' mean either one?
10. Is '45 degree hyper-extension machine - Kb swings' (`02:BS52`) a superset or a choice? Is 'Clean Pull/ hang Power Clean' (`07:L10`) a complex or a choice?
11. 'Oscilating drop squats' (`02:DE34`, Block 1 week 7) and 'Paced Cardio - easy' (`02:DW34`, Block 1 week 8) both sit in the Part C strength slot. Which implement does the first use, and is week 8 an unloading week?
12. For athletes with no gym (hotel or field), which T2/T3 replacements do you accept: DB/KB swings and jumps instead of barbell Olympic lifts, and unilateral DB work instead of barbell squats?

## Appendix A. Every session and every exercise

Format: `pos. exercise (verbatim, URL removed) [cell | implement | constraint c1-5 | velocity v1-5 | tier]`. `+` marks a line paired or supersetted with the line above. Parts are BASEBALL labels. Sessions with identical exercise lists (UL/PPL levels, repeated weeks) are shown once, with their siblings listed. Sets and reps for every item are in the JSON.

### UPPER/LOWER

**NOVICE | all weeks (no week columns) | LOWER BODY WORKOUT (ADAY)** (identical in: NEWBY all weeks (no week columns); INTERMEDIATE all weeks (no week columns)) `00:A13:C23` tiers `W-1-1-1-3-4-4-4-5-5-5`

1. Any Cardio Equipment [C13 | CARDIO | c- | v- | WU]; 2. A March [C14 | BW-bal | c1 | v3 | T1]; 3. A Skip [C15 | BW-bal | c1 | v4 | T1]; 4. A Run [C16 | BW-bal | c1 | v4 | T1]; 5. Sqats or Leg Press [C17 | BB | c3 | v2 | T3]; 6. Deadlifts (DB or Barbell) [C18 | DB | c3 | v2 | T4]; 7. Reverse Lunges (Bodyweight or DBs) [C19 | BW | c2 | v2 | T4]; 8. Single Leg Deadlift [C20 | DB | c2 | v2 | T4]; 9. Leg Extensions [C21 | MACH | c5 | v2 | T5]; 10. Leg Curls [C22 | MACH | c5 | v2 | T5]; 11. Calf Raises [C23 | DB | c3 | v2 | T5]

**NOVICE | all weeks (no week columns) | UPPER BODY WORKOUT (BDAY)** (identical in: NEWBY all weeks (no week columns); INTERMEDIATE all weeks (no week columns)) `00:A27:C35` tiers `W-4-4-4-4-5-5-5-5`

1. Any Cardio Equipment [C27 | CARDIO | c- | v- | WU]; 2. Dumbbell Rows [C28 | DB | c3 | v2 | T4]; 3. Bench Press (DB or Barbell) [C29 | DB | c3 | v2 | T4]; 4. Pull ups or Lat pull down [C30 | BW | c3 | v2 | T4]; 5. Overhead Press (DB or Barbell) [C31 | DB | c3 | v2 | T4]; 6. Curls (any kind) [C32 | ANY | c3 | v2 | T5]; 7. Tricep (any kind) [C33 | ANY | c3 | v2 | T5]; 8. DB Side Raises [C34 | DB | c3 | v2 | T5]; 9. DB Upright Rows [C35 | DB | c3 | v2 | T5]

### PUSH/PULL/LEGS

**NOVICE | all weeks (no week columns) | PUSH DAY WORKOUT (ADAY)** (identical in: NEWBY all weeks (no week columns); INTERMEDIATE all weeks (no week columns)) `06:A14:C20` tiers `W-W-4-5-3-4-5`

1. Any Cardio Equipment [C14 | CARDIO | c- | v- | WU]; 2. KB Book openers [C15 | KB | c4 | v1 | WU]; 3. Incline DB Bench press [C16 | DB | c3 | v2 | T4]; 4. Side raises [C17 | DB | c3 | v2 | T5]; 5. Barbell Bench press [C18 | BB | c3 | v2 | T3]; 6. Dips [C19 | BW | c3 | v2 | T4]; 7. Overhead DB Tricep Ext. [C20 | DB | c3 | v2 | T5]

**NOVICE | all weeks (no week columns) | PULL DAY WORKOUT (BDAY)** `06:A25:C31` tiers `W-4-5-4-5-5-5`

1. Any Cardio Equipment [C25 | CARDIO | c- | v- | WU]; 2. DB Rows or Row machine [C26 | DB | c3 | v2 | T4]; 3. DB Reverse Flies or Machine [C27 | DB | c3 | v2 | T5]; 4. Cable Lat pulldown [C28 | CBL | c4 | v2 | T4]; 5. DB upright rows [C29 | DB | c3 | v2 | T5]; 6. Barbell Curls [C30 | BB | c3 | v2 | T5]; 7. DB Hammer Curls [C31 | DB | c3 | v2 | T5]

**NOVICE | all weeks (no week columns) | LEG DAY WORKOUT (CDAY)** (identical in: NEWBY all weeks (no week columns); INTERMEDIATE all weeks (no week columns)) `06:A36:C46` tiers `W-1-1-1-3-4-4-4-5-5-5`

1. Any Cardio Equipment [C36 | CARDIO | c- | v- | WU]; 2. A March [C37 | BW-bal | c1 | v3 | T1]; 3. A Skip [C38 | BW-bal | c1 | v4 | T1]; 4. A Run [C39 | BW-bal | c1 | v4 | T1]; 5. Sqats or Leg Press [C40 | BB | c3 | v2 | T3]; 6. Deadlifts (DB or Barbell) [C41 | DB | c3 | v2 | T4]; 7. Reverse Lunges (Bodyweight or DBs) [C42 | BW | c2 | v2 | T4]; 8. Single Leg Deadlift [C43 | DB | c2 | v2 | T4]; 9. Leg Extensions [C44 | MACH | c5 | v2 | T5]; 10. Leg Curls [C45 | MACH | c5 | v2 | T5]; 11. Calf Raises [C46 | DB | c3 | v2 | T5]

**NEWBY | all weeks (no week columns) | PULL DAY WORKOUT (BDAY)** (identical in: INTERMEDIATE all weeks (no week columns)) `06:E25:G31` tiers `W-4-5-4-5-5-5`

1. Any Cardio Equipment [G25 | CARDIO | c- | v- | WU]; 2. DB Rows or Row machine [G26 | DB | c3 | v2 | T4]; 3. DB Reverse Flies or Machine [G27 | DB | c3 | v2 | T5]; 4. Pull ups or Cable Lat pull down [G28 | BW | c3 | v2 | T4]; 5. DB upright rows [G29 | DB | c3 | v2 | T5]; 6. Barbell Curls [G30 | BB | c3 | v2 | T5]; 7. DB Hammer Curls [G31 | DB | c3 | v2 | T5]

### FAT BURN / BODY TONING

**MUSCLE BUILDING | WK 1 | MONDAY** `01:B7:D11` tiers `4-3-4-4-5`

1. LEG PRESS [D7 | MACH | c5 | v2 | T4]; 2. DEALIFTS [D8 | BB | c3 | v2 | T3]; 3. WALKING LUNGES [D9 | DB | c2 | v2 | T4]; 4. SL RDL [D10 | DB | c2 | v2 | T4]; 5. LEG EXTENSIONS [D11 | MACH | c5 | v2 | T5]

**MUSCLE BUILDING | WK 1 | TUESDAY** `01:B12:D16` tiers `3-4-4-4-5`

1. BARBELL BENCH PRESS [D12 | BB | c3 | v2 | T3]; 2. SINGLE ARM LAT PULL DOWN [D13 | CBL | c2 | v2 | T4]; 3. DB OVERHEAD PRESS [D14 | DB | c3 | v2 | T4]; 4. MACHINE SUPPORTED ROW [D15 | MACH | c5 | v2 | T4]; 5. DB CURLS [D16 | DB | c3 | v2 | T5]

**MUSCLE BUILDING | WK 1 | WEDNESDAY** (identical in: MUSCLE BUILDING WK 2; MUSCLE BUILDING WK 3; MUSCLE BUILDING WK 4) `01:B17:D17` tiers `K`

1. 30-40 mi slow/steady CARDIO [D17 | CARDIO | c- | v- | COND]

**MUSCLE BUILDING | WK 1 | THURSDAY** `01:B20:D24` tiers `3-4-4-4-5`

1. DEAFLITS [D20 | BB | c3 | v2 | T3]; 2. SQUATS SMITH MACHINE [D21 | MACH | c4 | v2 | T4]; 3. STATIONARY LUNGES [D22 | DB | c2 | v2 | T4]; 4. SL RDL [D23 | DB | c2 | v2 | T4]; 5. LEG CURLS [D24 | MACH | c5 | v2 | T5]

**MUSCLE BUILDING | WK 1 | FRIDAY** `01:B25:D29` tiers `4-4-4-5-5`

1. SINGLE ARM LAT PULL DOWN [D25 | CBL | c2 | v2 | T4]; 2. DB BENCH PRESS [D26 | DB | c3 | v2 | T4]; 3. MACHINE SUPPORTED ROW [D27 | MACH | c5 | v2 | T4]; 4. SIDE RAISES [D28 | DB | c3 | v2 | T5]; 5. ROPE TRICEP EXTENSIONS [D29 | CBL | c4 | v2 | T5]

**MUSCLE BUILDING | WK 1 | SATURDAY** (identical in: MUSCLE BUILDING WK 2; MUSCLE BUILDING WK 3; MUSCLE BUILDING WK 4) `01:B30:D30` tiers `K`

1. 30-40 mi slow/steady CARDIO [D30 | CARDIO | c- | v- | COND]

**MUSCLE BUILDING | WK 2 | MONDAY** `01:E7:G11` tiers `3-4-4-4-5`

1. DEAFLITS [G7 | BB | c3 | v2 | T3]; 2. SQUATS SMITH MACHINE [G8 | MACH | c4 | v2 | T4]; 3. STATIONARY LUNGES [G9 | DB | c2 | v2 | T4]; 4. SL RDL [G10 | DB | c2 | v2 | T4]; 5. LEG CURLS [G11 | MACH | c5 | v2 | T5]

**MUSCLE BUILDING | WK 2 | TUESDAY** `01:E12:G16` tiers `4-4-4-5-5`

1. SINGLE ARM LAT PULL DOWN [G12 | CBL | c2 | v2 | T4]; 2. DB BENCH PRESS [G13 | DB | c3 | v2 | T4]; 3. MACHINE SUPPORTED ROW [G14 | MACH | c5 | v2 | T4]; 4. UPRIGHT ROWS [G15 | DB | c3 | v2 | T5]; 5. ROPE TRICEP EXTENSIONS [G16 | CBL | c4 | v2 | T5]

**MUSCLE BUILDING | WK 2 | THURSDAY** `01:E20:G24` tiers `4-3-4-4-5`

1. LEG PRESS [G20 | MACH | c5 | v2 | T4]; 2. DEALIFTS [G21 | BB | c3 | v2 | T3]; 3. WALKING LUNGES [G22 | DB | c2 | v2 | T4]; 4. SL RDL [G23 | DB | c2 | v2 | T4]; 5. LEG EXTENSIONS [G24 | MACH | c5 | v2 | T5]

**MUSCLE BUILDING | WK 2 | FRIDAY** `01:E25:G29` tiers `3-4-5-4-5`

1. BARBELL BENCH PRESS [G25 | BB | c3 | v2 | T3]; 2. SINGLE ARM LAT PULL DOWN [G26 | CBL | c2 | v2 | T4]; 3. SIDE RAISES [G27 | DB | c3 | v2 | T5]; 4. MACHINE SUPPORTED ROW [G28 | MACH | c5 | v2 | T4]; 5. DB CURLS [G29 | DB | c3 | v2 | T5]

**MUSCLE BUILDING | WK 3 | MONDAY** `01:H7:J11` tiers `4-3-4-4-5`

1. LEG PRESS [J7 | MACH | c5 | v2 | T4]; 2. DEADLIFTS [J8 | BB | c3 | v2 | T3]; 3. FRONT FOOT ELEVATED LUNGES [J9 | DB | c2 | v2 | T4]; 4. SL RDL [J10 | DB | c2 | v2 | T4]; 5. LEG EXTENSIONS [J11 | MACH | c5 | v2 | T5]

**MUSCLE BUILDING | WK 3 | TUESDAY** `01:H12:J16` tiers `3-4-5-4-5`

1. BARBELL BENCH PRESS [J12 | BB | c3 | v2 | T3]; 2. LAT PULL DOWN/PULL UP [J13 | CBL | c4 | v2 | T4]; 3. UPRIGHT ROWS [J14 | DB | c3 | v2 | T5]; 4. DB ROWS [J15 | DB | c3 | v2 | T4]; 5. DB HAMMER CURLS [J16 | DB | c3 | v2 | T5]

**MUSCLE BUILDING | WK 3 | THURSDAY** `01:H20:J24` tiers `3-4-4-4-5`

1. DEADLIFTS [J20 | BB | c3 | v2 | T3]; 2. SQUATS SMITH MACHINE [J21 | MACH | c4 | v2 | T4]; 3. REAR FOOT ELEVATED LUNGES [J22 | DB | c2 | v2 | T4]; 4. SL RDL [J23 | DB | c2 | v2 | T4]; 5. LEG CURLS [J24 | MACH | c5 | v2 | T5]

**MUSCLE BUILDING | WK 3 | FRIDAY** `01:H25:J29` tiers `4-4-4-5-5`

1. LAT PULL DOWN/PULL UP [J25 | CBL | c4 | v2 | T4]; 2. INCLINE DB BENCH PRESS [J26 | DB | c3 | v2 | T4]; 3. DB ROWS [J27 | DB | c3 | v2 | T4]; 4. SIDE RAISES [J28 | DB | c3 | v2 | T5]; 5. TRICEP KICKBACKS [J29 | DB | c3 | v2 | T5]

**MUSCLE BUILDING | WK 4 | MONDAY** `01:K7:M11` tiers `3-4-4-4-5`

1. DEADLIFTS [M7 | BB | c3 | v2 | T3]; 2. SQUATS SMITH MACHINE [M8 | MACH | c4 | v2 | T4]; 3. REAR FOOT ELEVATED LUNGES [M9 | DB | c2 | v2 | T4]; 4. SL RDL [M10 | DB | c2 | v2 | T4]; 5. LEG CURLS [M11 | MACH | c5 | v2 | T5]

**MUSCLE BUILDING | WK 4 | TUESDAY** `01:K12:M16` tiers `4-4-4-3-5`

1. LAT PULL DOWN/PULL UP [M12 | CBL | c4 | v2 | T4]; 2. INCLINE DB BENCH PRESS [M13 | DB | c3 | v2 | T4]; 3. DB ROWS [M14 | DB | c3 | v2 | T4]; 4. OVERHEAD PRESS [M15 | BB | c3 | v2 | T3]; 5. TRICEP KICKBACKS [M16 | DB | c3 | v2 | T5]

**MUSCLE BUILDING | WK 4 | THURSDAY** `01:K20:M24` tiers `4-3-4-4-5`

1. LEG PRESS [M20 | MACH | c5 | v2 | T4]; 2. DEADLIFTS [M21 | BB | c3 | v2 | T3]; 3. FRONT FOOT ELEVATED LUNGES [M22 | DB | c2 | v2 | T4]; 4. SL RDL [M23 | DB | c2 | v2 | T4]; 5. LEG EXTENSIONS [M24 | MACH | c5 | v2 | T5]

**MUSCLE BUILDING | WK 4 | FRIDAY** `01:K25:M29` tiers `3-4-5-4-5`

1. INCLINE BARBELL BENCH PRESS [M25 | BB | c3 | v2 | T3]; 2. SINGLE ARM LAT PULL DOWN [M26 | CBL | c2 | v2 | T4]; 3. SIDE RAISES [M27 | DB | c3 | v2 | T5]; 4. DB ROWS [M28 | DB | c3 | v2 | T4]; 5. DB HAMMER CURLS [M29 | DB | c3 | v2 | T5]

**CIRCUITS RECCOMENDED | WK 1 | MONDAY** (identical in: CIRCUITS RECCOMENDED WK 3) `01:B39:D42` tiers `K-4-C-4`

1. Jumping Jacks [D39 | BW-bal | c1 | v4 | COND]; +2. Bodyweight reverse lunges [D40 | BW | c2 | v2 | T4]; +3. Situps [D41 | BW | c4 | v2 | CORE]; +4. Dumbbell overhead press [D42 | DB | c3 | v2 | T4]

**CIRCUITS RECCOMENDED | WK 1 | FRIDAY** (identical in: CIRCUITS RECCOMENDED WK 3) `01:B57:D60` tiers `C-5-C-K`

1. Plank shoulder taps [D57 | BW | c2 | v2 | CORE]; +2. Dumbbell curl to press [D58 | DB | c3 | v2 | T5]; +3. Bicycle crunches [D59 | BW | c4 | v2 | CORE]; +4. Burpees [D60 | BW-bal | c1 | v4 | COND]

**CIRCUITS RECCOMENDED | WK 2 | TUESDAY** (identical in: CIRCUITS RECCOMENDED WK 4) `01:E44:G47` tiers `4-5-C-C`

1. Pushups [G44 | BW | c3 | v2 | T4]; +2. Dumbbell hammer curls [G45 | DB | c3 | v2 | T5]; +3. Side plank [G46 | BW | c3 | v1 | CORE]; +4. Other side plank [G47 | BW | c3 | v1 | CORE]

**CIRCUITS RECCOMENDED | WK 2 | THURSDAY** `01:E52:G55` tiers `C-4-C-4`

1. Mountain climbers [G52 | BW | c2 | v2 | CORE]; +2. Bodyweight forward lunges [G53 | BW | c2 | v2 | T4]; +3. Plank Hip turns [G54 | BW | c2 | v2 | CORE]; +4. Bodyweight squats [G55 | BW | c3 | v2 | T4]

**CIRCUITS RECCOMENDED | WK 4 | THURSDAY** `01:K52:M55` tiers `C-4-C-4`

1. Mointain climbers [M52 | BW | c2 | v2 | CORE]; +2. Bodyweight forward lunges [M53 | BW | c2 | v2 | T4]; +3. Plank Hip turns [M54 | BW | c2 | v2 | CORE]; +4. Bodyweight squats [M55 | BW | c3 | v2 | T4]

### 4 TRACKS - AESTHETICS (bodybuilding style)

**8-week columns E:L | WK1 | MONDAY** `04:E35:E40` tiers `3-3-4-4-?`

1. FRONT SQUATS [E35 | BB | c3 | v2 | T3]; 2. DEALIFTS [E37 | BB | c3 | v2 | T3]; 3. FFE CONTRA LUNGES [E38 | DB | c2 | v2 | T4]; 4. SL RDL [E39 | DB | c2 | v2 | T4]; 5. ACCESSORIES [E40 | ? | c- | v- | ?]

**8-week columns E:L | WK1 | TUESDAY** `04:E41:E45` tiers `4-4-4-4-?`

1. DB BENCH PRESS [E41 | DB | c3 | v2 | T4]; 2. UNILATERAL LAT PULL DOWN [E42 | CBL | c4 | v2 | T4]; 3. DB OVERHEAD PRESS [E43 | DB | c3 | v2 | T4]; 4. MACHINE SUPPORTED ROW [E44 | MACH | c5 | v2 | T4]; 5. ACCESSORIES [E45 | ? | c- | v- | ?]

**8-week columns E:L | WK1 | WEDNESDAY** (identical in: 8-week columns E:L WK2; 8-week columns E:L WK3; 8-week columns E:L WK4; 8-week columns E:L WK5; 8-week columns E:L WK6; 8-week columns E:L WK7; 8-week columns E:L WK8) `04:E46:E46` tiers `K`

1. 30-40 mi slow/steady CARDIO [E46 | CARDIO | c- | v- | COND]

**8-week columns E:L | WK1 | THURSDAY** `04:E49:E54` tiers `3-3-4-4-?`

1. FRONT SQUATS [E49 | BB | c3 | v2 | T3]; 2. DEALIFTS [E50 | BB | c3 | v2 | T3]; 3. FFE CONTRA LUNGES [E51 | DB | c2 | v2 | T4]; 4. SL RDL [E53 | DB | c2 | v2 | T4]; 5. ACCESSORIES [E54 | ? | c- | v- | ?]

**8-week columns E:L | WK1 | FRIDAY** `04:E55:E59` tiers `4-4-4-4`

1. DB BENCH PRESS [E55 | DB | c3 | v2 | T4]; 2. UNILATERAL LAT PULL DOWN [E56 | CBL | c4 | v2 | T4]; 3. DB OVERHEAD PRESS [E57 | DB | c3 | v2 | T4]; 4. MACHINE SUPPORTED ROW [E59 | MACH | c5 | v2 | T4]

**8-week columns E:L | WK1 | SATURDAY** (identical in: 8-week columns E:L WK2; 8-week columns E:L WK3; 8-week columns E:L WK4; 8-week columns E:L WK5; 8-week columns E:L WK6; 8-week columns E:L WK7; 8-week columns E:L WK8) `04:E60:E60` tiers `K`

1. 30-40 mi slow/steady CARDIO [E60 | CARDIO | c- | v- | COND]

**8-week columns E:L | WK2 | MONDAY** `04:F35:F40` tiers `3-3-4-4-?`

1. DEAFLITS [F35 | BB | c3 | v2 | T3]; 2. BACK SQUATS [F37 | BB | c3 | v2 | T3]; 3. FFE IPSI LUNGES [F38 | DB | c2 | v2 | T4]; 4. SL RDL [F39 | DB | c2 | v2 | T4]; 5. ACCESSORIES [F40 | ? | c- | v- | ?]

**8-week columns E:L | WK2 | TUESDAY** `04:F41:F45` tiers `4-4-4-5-?`

1. UNILATERAL LAT PULL DOWN [F41 | CBL | c4 | v2 | T4]; 2. DB BENCH PRESS [F42 | DB | c3 | v2 | T4]; 3. MACHINE SUPPORTED ROW [F43 | MACH | c5 | v2 | T4]; 4. UPRIGHT ROWS [F44 | DB | c3 | v2 | T5]; 5. ACCESSORIES [F45 | ? | c- | v- | ?]

**8-week columns E:L | WK2 | THURSDAY** `04:F49:F54` tiers `3-3-4-4-?`

1. DEAFLITS [F49 | BB | c3 | v2 | T3]; 2. BACK SQUATS [F50 | BB | c3 | v2 | T3]; 3. FFE IPSI LUNGES [F51 | DB | c2 | v2 | T4]; 4. SL RDL [F53 | DB | c2 | v2 | T4]; 5. ACCESSORIES [F54 | ? | c- | v- | ?]

**8-week columns E:L | WK2 | FRIDAY** `04:F55:F59` tiers `4-4-4-5`

1. UNILATERAL LAT PULL DOWN [F55 | CBL | c4 | v2 | T4]; 2. DB BENCH PRESS [F56 | DB | c3 | v2 | T4]; 3. MACHINE SUPPORTED ROW [F57 | MACH | c5 | v2 | T4]; 4. UPRIGHT ROWS [F59 | DB | c3 | v2 | T5]

**8-week columns E:L | WK3 | MONDAY** `04:G35:G40` tiers `3-3-4-4-?`

1. FRONT SQUATS [G35 | BB | c3 | v2 | T3]; 2. DEADLIFTS [G37 | BB | c3 | v2 | T3]; 3. RFE CONTRA LUNGES [G38 | DB | c2 | v2 | T4]; 4. SL RDL [G39 | DB | c2 | v2 | T4]; 5. ACCESSORIES [G40 | ? | c- | v- | ?]

**8-week columns E:L | WK3 | TUESDAY** `04:G41:G45` tiers `4-4-5-4-?`

1. DB BENCH PRESS [G41 | DB | c3 | v2 | T4]; 2. UNILATERAL LAT PULL DOWN [G42 | CBL | c4 | v2 | T4]; 3. UPRIGHT ROWS [G43 | DB | c3 | v2 | T5]; 4. DB ROWS [G44 | DB | c3 | v2 | T4]; 5. ACCESSORIES [G45 | ? | c- | v- | ?]

**8-week columns E:L | WK3 | THURSDAY** `04:G49:G54` tiers `3-3-4-4-?`

1. FRONT SQUATS [G49 | BB | c3 | v2 | T3]; 2. DEADLIFTS [G50 | BB | c3 | v2 | T3]; 3. RFE CONTRA LUNGES [G51 | DB | c2 | v2 | T4]; 4. SL RDL [G53 | DB | c2 | v2 | T4]; 5. ACCESSORIES [G54 | ? | c- | v- | ?]

**8-week columns E:L | WK3 | FRIDAY** `04:G55:G59` tiers `4-4-5-4`

1. DB BENCH PRESS [G55 | DB | c3 | v2 | T4]; 2. UNILATERAL [G56 | CBL | c4 | v2 | T4]; 3. UPRIGHT ROWS [G57 | DB | c3 | v2 | T5]; 4. DB ROWS [G59 | DB | c3 | v2 | T4]

**8-week columns E:L | WK4 | MONDAY** `04:H35:H40` tiers `3-3-4-4-?`

1. DEFICIT DEADLIFTS [H35 | BB | c3 | v2 | T3]; 2. BACK SQUATS [H37 | BB | c3 | v2 | T3]; 3. RFE IPSI LUNGES [H38 | DB | c2 | v2 | T4]; 4. SL RDL [H39 | DB | c2 | v2 | T4]; 5. ACCESSORIES [H40 | ? | c- | v- | ?]

**8-week columns E:L | WK4 | TUESDAY** `04:H41:H45` tiers `4-4-4-3-?`

1. LAT PULL DOWN/PULL UP [H41 | CBL | c4 | v2 | T4]; 2. INCLINE DB BENCH PRESS [H42 | DB | c3 | v2 | T4]; 3. DB ROWS [H43 | DB | c3 | v2 | T4]; 4. OVERHEAD PRESS [H44 | BB | c3 | v2 | T3]; 5. ACCESSORIES [H45 | ? | c- | v- | ?]

**8-week columns E:L | WK4 | THURSDAY** `04:H49:H54` tiers `3-3-4-4-?`

1. DEFICIT DEADLIFTS [H49 | BB | c3 | v2 | T3]; 2. BACK SQUATS [H50 | BB | c3 | v2 | T3]; 3. RFE IPSI LUNGES [H51 | DB | c2 | v2 | T4]; 4. SL RDL [H53 | DB | c2 | v2 | T4]; 5. ACCESSORIES [H54 | ? | c- | v- | ?]

**8-week columns E:L | WK4 | FRIDAY** `04:H55:H59` tiers `4-4-4-3`

1. LAT PULL DOWN/PULL UP [H55 | CBL | c4 | v2 | T4]; 2. INCLINE DB BENCH PRESS [H56 | DB | c3 | v2 | T4]; 3. DB ROWS [H57 | DB | c3 | v2 | T4]; 4. OVERHEAD PRESS [H59 | BB | c3 | v2 | T3]

**8-week columns E:L | WK5 | MONDAY** `04:I35:I40` tiers `3-3-4-4-?`

1. BACK SQUATS [I35 | BB | c3 | v2 | T3]; 2. DEADLIFTS [I37 | BB | c3 | v2 | T3]; 3. RFE LUNGES [I38 | DB | c2 | v2 | T4]; 4. SL RDL [I39 | DB | c2 | v2 | T4]; 5. ACCESSORIES [I40 | ? | c- | v- | ?]

**8-week columns E:L | WK5 | TUESDAY** `04:I41:I45` tiers `3-4-4-4-?`

1. BARBELL BENCH PRESS [I41 | BB | c3 | v2 | T3]; 2. UNILATERAL LAT PULL DOWN [I42 | CBL | c4 | v2 | T4]; 3. DB OVERHEAD PRESS [I43 | DB | c3 | v2 | T4]; 4. MACHINE SUPPORTED ROW [I44 | MACH | c5 | v2 | T4]; 5. ACCESSORIES [I45 | ? | c- | v- | ?]

**8-week columns E:L | WK5 | THURSDAY** `04:I49:I54` tiers `3-3-4-4-?`

1. BACK SQUATS [I49 | BB | c3 | v2 | T3]; 2. DEADLIFTS [I50 | BB | c3 | v2 | T3]; 3. RFE LUNGES [I51 | DB | c2 | v2 | T4]; 4. SL RDL [I53 | DB | c2 | v2 | T4]; 5. ACCESSORIES [I54 | ? | c- | v- | ?]

**8-week columns E:L | WK5 | FRIDAY** `04:I55:I59` tiers `3-4-4-4`

1. BARBELL BENCH PRESS [I55 | BB | c3 | v2 | T3]; 2. LAT PULL DOWN/PULL UP [I56 | CBL | c4 | v2 | T4]; 3. DB OVERHEAD PRESS [I57 | DB | c3 | v2 | T4]; 4. MACHINE SUPPORTED ROW [I59 | MACH | c5 | v2 | T4]

**8-week columns E:L | WK6 | MONDAY** `04:J35:J40` tiers `3-3-4-4-?`

1. DEADLIFTS [J35 | BB | c3 | v2 | T3]; 2. FRONT SQUATS [J37 | BB | c3 | v2 | T3]; 3. RFE & FFE LUNGES [J38 | DB | c2 | v2 | T4]; 4. SL RDL [J39 | DB | c2 | v2 | T4]; 5. ACCESSORIES [J40 | ? | c- | v- | ?]

**8-week columns E:L | WK6 | TUESDAY** `04:J41:J45` tiers `4-4-4-5-?`

1. LAT PULL DOWN/PULL UP [J41 | CBL | c4 | v2 | T4]; 2. INCLINE DB BENCH PRESS [J42 | DB | c3 | v2 | T4]; 3. MACHINE SUPPORTED ROW [J43 | MACH | c5 | v2 | T4]; 4. UPRIGHT ROWS [J44 | DB | c3 | v2 | T5]; 5. ACCESSORIES [J45 | ? | c- | v- | ?]

**8-week columns E:L | WK6 | THURSDAY** `04:J49:J54` tiers `3-3-4-4-?`

1. DEADLIFTS [J49 | BB | c3 | v2 | T3]; 2. FRONT SQUATS [J50 | BB | c3 | v2 | T3]; 3. RFE & FFE LUNGES [J51 | DB | c2 | v2 | T4]; 4. SL RDL [J53 | DB | c2 | v2 | T4]; 5. ACCESSORIES [J54 | ? | c- | v- | ?]

**8-week columns E:L | WK6 | FRIDAY** `04:J55:J59` tiers `4-4-4-5`

1. LAT PULL DOWN/PULL UP [J55 | CBL | c4 | v2 | T4]; 2. INCLINE DB BENCH PRESS [J56 | DB | c3 | v2 | T4]; 3. MACHINE SUPPORTED ROW [J57 | MACH | c5 | v2 | T4]; 4. UPRIGHT ROWS [J59 | DB | c3 | v2 | T5]

**8-week columns E:L | WK7 | MONDAY** `04:K35:K40` tiers `3-3-4-4-?`

1. DEADLIFTS [K35 | BB | c3 | v2 | T3]; 2. BACK SQUATS [K37 | BB | c3 | v2 | T3]; 3. RFE & FFE LUNGES [K38 | DB | c2 | v2 | T4]; 4. SL RDL [K39 | DB | c2 | v2 | T4]; 5. ACCESSORIES [K40 | ? | c- | v- | ?]

**8-week columns E:L | WK7 | TUESDAY** `04:K41:K45` tiers `3-4-5-4-?`

1. BARBELL BENCH PRESS [K41 | BB | c3 | v2 | T3]; 2. UNILATERAL LAT PULL DOWN [K42 | CBL | c4 | v2 | T4]; 3. UPRIGHT ROWS [K43 | DB | c3 | v2 | T5]; 4. DB ROWS [K44 | DB | c3 | v2 | T4]; 5. ACCESSORIES [K45 | ? | c- | v- | ?]

**8-week columns E:L | WK7 | THURSDAY** `04:K49:K54` tiers `3-3-4-4-?`

1. DEADLIFTS [K49 | BB | c3 | v2 | T3]; 2. BACK SQUATS [K50 | BB | c3 | v2 | T3]; 3. RFE & FFE LUNGES [K51 | DB | c2 | v2 | T4]; 4. SL RDL [K53 | DB | c2 | v2 | T4]; 5. ACCESSORIES [K54 | ? | c- | v- | ?]

**8-week columns E:L | WK7 | FRIDAY** `04:K55:K59` tiers `3-4-5-4`

1. BARBELL BENCH PRESS [K55 | BB | c3 | v2 | T3]; 2. LAT PULL DOWN/PULL UP [K56 | CBL | c4 | v2 | T4]; 3. UPRIGHT ROWS [K57 | DB | c3 | v2 | T5]; 4. DB ROWS [K59 | DB | c3 | v2 | T4]

**8-week columns E:L | WK8 | MONDAY** `04:L35:L40` tiers `?`

1. DELOAD WEEK [L35 | ? | c- | v- | ?]

**8-week columns E:L | WK8 | FRIDAY** `04:L55:L59` tiers `?`

1. DELOAD WEEK [L55 | ? | c- | v- | ?]

**12-week columns O:Z | WK1 | MONDAY** (identical in: 12-week columns O:Z WK3; 12-week columns O:Z WK5; 12-week columns O:Z WK7) `04:O35:O40` tiers `5-3-5-4-5-5`

1. cable Side Raises [O35 | CBL | c4 | v2 | T5]; 2. Incline bench [O36 | BB | c3 | v2 | T3]; 3. low to high FLIES [O37 | CBL | c4 | v2 | T5]; 4. Machine Dips or dips [O38 | MACH | c5 | v2 | T4]; 5. TATE PRESS [O39 | DB | c4 | v2 | T5]; 6. TRICEP EXT. [O40 | CBL | c4 | v2 | T5]

**12-week columns O:Z | WK1 | TUESDAY** (identical in: 12-week columns O:Z WK2; 12-week columns O:Z WK3; 12-week columns O:Z WK4; 12-week columns O:Z WK5; 12-week columns O:Z WK6; 12-week columns O:Z WK7; 12-week columns O:Z WK8) `04:O41:O45` tiers `3-4-3-4-4`

1. front SQUATS [O41 | BB | c3 | v2 | T3]; 2. LEG PRESS [O42 | MACH | c5 | v2 | T4]; 3. DEADLIFTS [O43 | BB | c3 | v2 | T3]; 4. LUNGES [O44 | DB | c2 | v2 | T4]; 5. STAGRD. DL [O45 | DB | c2 | v2 | T4]

**12-week columns O:Z | WK1 | WEDNESDAY** (identical in: 12-week columns O:Z WK3; 12-week columns O:Z WK5; 12-week columns O:Z WK7) `04:O46:O50` tiers `4-4-5-5-5`

1. Lat pull downs [O46 | CBL | c4 | v2 | T4]; 2. Rows [O47 | DB | c3 | v2 | T4]; 3. Pull under [O48 | ? | c3 | v2 | T5]; 4. face pulls [O49 | CBL | c4 | v2 | T5]; 5. barbell curls [O50 | BB | c3 | v2 | T5]

**12-week columns O:Z | WK1 | THURSDAY** (identical in: 12-week columns O:Z WK3; 12-week columns O:Z WK5; 12-week columns O:Z WK7) `04:O51:O56` tiers `5-3-5-5-5-5`

1. cable side raises [O51 | CBL | c4 | v2 | T5]; 2. incline bench press [O52 | BB | c3 | v2 | T3]; 3. high to low FLIES [O53 | CBL | c4 | v2 | T5]; 4. JM PRESS [O54 | BB | c3 | v2 | T5]; 5. TATE PRESS [O55 | DB | c4 | v2 | T5]; 6. TRICEP EXT. [O56 | CBL | c4 | v2 | T5]

**12-week columns O:Z | WK1 | FRIDAY** `04:O57:O61` tiers `3-4-3-4-4`

1. front SQUATS [O57 | BB | c3 | v2 | T3]; 2. LEG PRESS [O58 | MACH | c5 | v2 | T4]; 3. DEADLIFTS [O59 | BB | c3 | v2 | T3]; 4. LUNGES [O60 | DB | c2 | v2 | T4]; 5. STAGRD. DL [O61 | DB | c2 | v2 | T4]

**12-week columns O:Z | WK1 | SATURDAY** (identical in: 12-week columns O:Z WK3; 12-week columns O:Z WK5; 12-week columns O:Z WK7) `04:O62:O66` tiers `4-4-5-5-5`

1. Lat pull downs [O62 | CBL | c4 | v2 | T4]; 2. Rows [O63 | DB | c3 | v2 | T4]; 3. Pull under [O64 | ? | c3 | v2 | T5]; 4. face pulls [O65 | CBL | c4 | v2 | T5]; 5. barbell curls [O66 | BB | c3 | v2 | T5]

**12-week columns O:Z | WK2 | MONDAY** (identical in: 12-week columns O:Z WK4; 12-week columns O:Z WK6) `04:P35:P40` tiers `5-3-5-4-5-5`

1. DB side raises [P35 | DB | c3 | v2 | T5]; 2. bench press [P36 | BB | c3 | v2 | T3]; 3. machine or db flies [P37 | MACH | c5 | v2 | T5]; 4. Machine Dips or dips [P38 | MACH | c5 | v2 | T4]; 5. cable tricep extension [P39 | CBL | c4 | v2 | T5]; 6. cable regular top down tricep extension [P40 | CBL | c4 | v2 | T5]

**12-week columns O:Z | WK2 | WEDNESDAY** (identical in: 12-week columns O:Z WK4; 12-week columns O:Z WK6; 12-week columns O:Z WK8) `04:P46:P50` tiers `4-4-5-5-5`

1. Neutral grip lat pull down [P46 | CBL | c4 | v2 | T4]; 2. machine rows or db rows [P47 | MACH | c5 | v2 | T4]; 3. pull under [P48 | ? | c3 | v2 | T5]; 4. upright db row [P49 | DB | c3 | v2 | T5]; 5. hammer curls [P50 | DB | c3 | v2 | T5]

**12-week columns O:Z | WK2 | THURSDAY** (identical in: 12-week columns O:Z WK4; 12-week columns O:Z WK6; 12-week columns O:Z WK8) `04:P51:P56` tiers `5-3-5-4-5-5`

1. DB side raises [P51 | DB | c3 | v2 | T5]; 2. bench press [P52 | BB | c3 | v2 | T3]; 3. machine or db flies [P53 | MACH | c5 | v2 | T5]; 4. Machine Dips or dips [P54 | MACH | c5 | v2 | T4]; 5. cable tricep extension [P55 | CBL | c4 | v2 | T5]; 6. cable regular top down tricep extension [P56 | CBL | c4 | v2 | T5]

**12-week columns O:Z | WK2 | FRIDAY** (identical in: 12-week columns O:Z WK3; 12-week columns O:Z WK4; 12-week columns O:Z WK5; 12-week columns O:Z WK6; 12-week columns O:Z WK7; 12-week columns O:Z WK8) `04:P57:P61` tiers `3-4-4-4-5`

1. front SQUATS [P57 | BB | c3 | v2 | T3]; 2. LEG PRESS [P58 | MACH | c5 | v2 | T4]; 3. Staggered DL [P59 | DB | c2 | v2 | T4]; 4. LUNGES [P60 | DB | c2 | v2 | T4]; 5. LEg Extensions [P61 | MACH | c5 | v2 | T5]

**12-week columns O:Z | WK2 | SATURDAY** (identical in: 12-week columns O:Z WK4; 12-week columns O:Z WK6; 12-week columns O:Z WK8) `04:P62:P66` tiers `4-4-5-5-5`

1. Neutral grip lat pull down [P62 | CBL | c4 | v2 | T4]; 2. machine rows or db rows [P63 | MACH | c5 | v2 | T4]; 3. pull under [P64 | ? | c3 | v2 | T5]; 4. upright db row [P65 | DB | c3 | v2 | T5]; 5. hammer curls [P66 | DB | c3 | v2 | T5]

**12-week columns O:Z | WK8 | MONDAY** (identical in: 12-week columns O:Z WK10; 12-week columns O:Z WK12) `04:V35:V40` tiers `4-3-5-4-5`

1. Arnold press [V35 | DB | c3 | v2 | T4]; 2. incline bench press [V36 | BB | c3 | v2 | T3]; 3. machine or db flies [V37 | MACH | c5 | v2 | T5]; 4. Machine Dips or dips [V38 | MACH | c5 | v2 | T4]; 5. overhead cable rope tricep ext [V39 | CBL | c4 | v2 | T5]

**12-week columns O:Z | WK9 | MONDAY** (identical in: 12-week columns O:Z WK11) `04:W35:W40` tiers `5-3-5-4-5`

1. Cable or DB side raises [W35 | CBL | c4 | v2 | T5]; 2. bench press [W36 | BB | c3 | v2 | T3]; 3. high to low cable flies [W37 | CBL | c4 | v2 | T5]; 4. machine dips or dips [W38 | MACH | c5 | v2 | T4]; 5. overhead cable rope tricep ext [W39 | CBL | c4 | v2 | T5]

**12-week columns O:Z | WK9 | TUESDAY** (identical in: 12-week columns O:Z WK10; 12-week columns O:Z WK11; 12-week columns O:Z WK12) `04:W41:W45` tiers `3-4-3-4-4`

1. front squats + Superset with 15 squats with no weight every set [W41 | BB | c3 | v2 | T3]; 2. leg press or just add 2 more rounds to front squats [W42 | MACH | c5 | v2 | T4]; 3. deadlifts [W43 | BB | c3 | v2 | T3]; 4. RFE Lunges (bulgarian) [W44 | DB | c2 | v2 | T4]; 5. Staggered stance unilateral deadlifts [W45 | DB | c2 | v2 | T4]

**12-week columns O:Z | WK9 | WEDNESDAY** (identical in: 12-week columns O:Z WK10; 12-week columns O:Z WK11; 12-week columns O:Z WK12) `04:W46:W50` tiers `4-4-5-4-5`

1. Neutral grip lat pull down [W46 | CBL | c4 | v2 | T4]; 2. machine rows or db rows [W47 | MACH | c5 | v2 | T4]; 3. machine or db Reverse flies [W48 | MACH | c5 | v2 | T5]; 4. bent over db row [W49 | DB | c3 | v2 | T4]; 5. Ez bar curls or barbell [W50 | BB | c3 | v2 | T5]

**12-week columns O:Z | WK9 | THURSDAY** (identical in: 12-week columns O:Z WK11) `04:W51:W56` tiers `5-3-5-4-5`

1. Cable or DB side raises [W51 | CBL | c4 | v2 | T5]; 2. bench press + superset with max pushup set (only 1 set of max pushups  [W52 | BB | c3 | v2 | T3]; 3. high to low cable flies [W53 | CBL | c4 | v2 | T5]; 4. machine dips or dips [W54 | MACH | c5 | v2 | T4]; 5. overhead cable rope tricep ext [W55 | CBL | c4 | v2 | T5]

**12-week columns O:Z | WK9 | FRIDAY** (identical in: 12-week columns O:Z WK10; 12-week columns O:Z WK11) `04:W57:W61` tiers `4-4-5-5-4`

1. RFE Lunges (bulgarian) [W57 | DB | c2 | v2 | T4]; 2. Staggered stance unilateral deadlifts [W58 | DB | c2 | v2 | T4]; 3. Leg extension one leg at a time [W59 | MACH | c5 | v2 | T5]; 4. leg curls one leg at a time [W60 | MACH | c5 | v2 | T5]; 5. 2 sets LEG PRESS MYO - 15-5-5-5-5-5 [W61 | MACH | c5 | v2 | T4]

**12-week columns O:Z | WK9 | SATURDAY** (identical in: 12-week columns O:Z WK10; 12-week columns O:Z WK11; 12-week columns O:Z WK12) `04:W62:W66` tiers `4-4-5-4-5`

1. Neutral grip lat pull down [W62 | CBL | c4 | v2 | T4]; 2. machine rows or db rows (5 sets - 15/12/12/12/10) [W63 | MACH | c5 | v2 | T4]; 3. machine or db Reverse flies [W64 | MACH | c5 | v2 | T5]; 4. bent over db row [W65 | DB | c3 | v2 | T4]; 5. Ez bar curls or barbell [W66 | BB | c3 | v2 | T5]

**12-week columns O:Z | WK10 | THURSDAY** (identical in: 12-week columns O:Z WK12) `04:X51:X56` tiers `4-3-5-4-5`

1. Arnold press [X51 | DB | c3 | v2 | T4]; 2. incline bench press + superset with a set of max bench dips, one set o [X52 | BB | c3 | v2 | T3]; 3. machine or db flies [X53 | MACH | c5 | v2 | T5]; 4. Machine Dips or dips [X54 | MACH | c5 | v2 | T4]; 5. overhead cable rope tricep ext [X55 | CBL | c4 | v2 | T5]

**12-week columns O:Z | WK12 | FRIDAY** `04:Z57:Z61` tiers `4-4-5-5-4`

1. RFE Lunges (bulgarian) [Z57 | DB | c2 | v2 | T4]; 2. Staggered stance unilateral deadlifts [Z58 | DB | c2 | v2 | T4]; 3. Leg extension one leg at a time [Z59 | MACH | c5 | v2 | T5]; 4. leg curls one leg at a time [Z60 | MACH | c5 | v2 | T5]; 5. 3 sets LEG PRESS MYO - 15-5-5-5-5-5 [Z61 | MACH | c5 | v2 | T4]

### 4 TRACKS - STRENGTH (conjugate style)

**8-week columns E:L | WK1 | MONDAY** `04:B9:M12 col E` tiers `3-3-4-4`

1. HEAVY FRONT SQUAT (D)BOX SQUAT [E9 | BB | c3 | v3 | T3]; 2. SNATCH GRIP DL [E10 | BB | c3 | v2 | T3]; 3. PULL UPS [E11 | BW | c3 | v2 | T4]; 4. RFE LUNGES [E12 | DB | c2 | v2 | T4]

**8-week columns E:L | WK1 | WEDNESDAY** `04:B13:M16 col E` tiers `3-3-4-5`

1. HEAVY BENCH PRESS [E13 | BB | c3 | v3 | T3]; 2. BENT OVER ROW [E14 | BB | c3 | v2 | T3]; 3. ALT INCLINE DB BENCH [E15 | DB | c3 | v2 | T4]; 4. BICEP CURLS [E16 | DB | c3 | v2 | T5]

**8-week columns E:L | WK1 | THURSDAY** `04:B17:M20 col E` tiers `1-2-4-4`

1. WEIGHTED DEPTH DROP [E17 | LOAD? | c1 | v5 | T1]; 2. FAST FRONT SQUATS (D) BOX [E18 | BB | c3 | v4 | T2]; 3. PULL UPS [E19 | BW | c3 | v2 | T4]; 4. RFE LUNGES [E20 | DB | c2 | v2 | T4]

**8-week columns E:L | WK1 | SATURDAY** `04:B21:M24 col E` tiers `2-3-4`

1. FAST BANDED BENCH PRESS [E21 | BB | c3 | v4 | T2]; 2. BENT OVER ROW [E22 | BB | c3 | v2 | T3]; 3. ALT INCLINE DB BENCH [E23 | DB | c3 | v2 | T4]

**8-week columns E:L | WK2 | MONDAY** `04:B9:M12 col F` tiers `3-3-4-4`

1. HEAVY DEFICIT DEADLIFT [F9 | BB | c3 | v3 | T3]; 2. F. SQUAT (T&G)BOX [F10 | BB | c3 | v2 | T3]; 3. DB ROWS 8/8 [F11 | DB | c3 | v2 | T4]; 4. STAGGERED STANCE DL [F12 | DB | c2 | v2 | T4]

**8-week columns E:L | WK2 | WEDNESDAY** `04:B13:M16 col F` tiers `3-4-4-5`

1. HIGH INCLINE PRESS [F13 | BB | c3 | v3 | T3]; 2. CLOSE GRIP PULL UPS [F14 | BW | c3 | v2 | T4]; 3. ALT INCLINE DB BENCH [F15 | DB | c3 | v2 | T4]; 4. BICEP CURLS [F16 | DB | c3 | v2 | T5]

**8-week columns E:L | WK2 | THURSDAY** `04:B17:M20 col F` tiers `1-2-4-4`

1. DEPTH DROP & JUMP [F17 | BW-bal | c1 | v5 | T1]; 2. FAST BANDED DL [F18 | BB | c3 | v4 | T2]; 3. DB ROWS 8/8 [F19 | DB | c3 | v2 | T4]; 4. STAGGERED STANCE DL [F20 | DB | c2 | v2 | T4]

**8-week columns E:L | WK2 | SATURDAY** `04:B21:M24 col F` tiers `2-4-4`

1. FAST DB OH PRESS [F21 | DB | c3 | v4 | T2]; 2. CLOSE GRIP PULL UPS [F22 | BW | c3 | v2 | T4]; 3. ALT INCLINE DB BENCH [F23 | DB | c3 | v2 | T4]

**8-week columns E:L | WK3 | MONDAY** `04:B9:M12 col G` tiers `3-3-4-4`

1. HEAVY (D)BOX HIGH BAR SQUAT [G9 | BB | c3 | v3 | T3]; 2. DEF. DL or SNATCH GRIP [G10 | BB | c3 | v2 | T3]; 3. PULL UPS [G11 | BW | c3 | v2 | T4]; 4. FFE LUNGES [G12 | DB | c2 | v2 | T4]

**8-week columns E:L | WK3 | WEDNESDAY** `04:B13:M16 col G` tiers `3-4-4-5`

1. HEAVY BENCH PRESS [G13 | BB | c3 | v3 | T3]; 2. SEAL ROWS [G14 | DB | c4 | v2 | T4]; 3. ALT INCLINE DB BENCH [G15 | DB | c3 | v2 | T4]; 4. BICEP CURLS [G16 | DB | c3 | v2 | T5]

**8-week columns E:L | WK3 | THURSDAY** `04:B17:M20 col G` tiers `1-2-4-4`

1. HIGH SQUAT JUMPS [G17 | BW-bal | c1 | v5 | T1]; 2. FAST HIGH BAR (D)BOX [G18 | BB | c3 | v4 | T2]; 3. PULL UPS [G19 | BW | c3 | v2 | T4]; 4. FFE LUNGES [G20 | DB | c2 | v2 | T4]

**8-week columns E:L | WK3 | SATURDAY** `04:B21:M24 col G` tiers `2-4-4`

1. FAST BANDED BENCH PRESS [G21 | BB | c3 | v4 | T2]; 2. SEAL ROWS [G22 | DB | c4 | v2 | T4]; 3. ALT INCLINE DB BENCH [G23 | DB | c3 | v2 | T4]

**8-week columns E:L | WK4 | MONDAY** `04:B9:M12 col H` tiers `3-3-4-4`

1. HEAVY CHAINED DEADLIFT [H9 | BB | c3 | v3 | T3]; 2. (T&G)BOX HIGH BAR SQUAT [H10 | BB | c3 | v2 | T3]; 3. DB ROWS 8/8 [H11 | DB | c3 | v2 | T4]; 4. STAGGERED STANCE DL [H12 | DB | c2 | v2 | T4]

**8-week columns E:L | WK4 | WEDNESDAY** `04:B13:M16 col H` tiers `3-3-4-5`

1. HIGH INCLINE PRESS [H13 | BB | c3 | v3 | T3]; 2. BENT OVER ROWS [H14 | BB | c3 | v2 | T3]; 3. ALT INCLINE DB BENCH [H15 | DB | c3 | v2 | T4]; 4. BICEP CURLS [H16 | DB | c3 | v2 | T5]

**8-week columns E:L | WK4 | THURSDAY** `04:B17:M20 col H` tiers `1-2-4-4`

1. REPEAT HIGH JUMPS [H17 | BW-bal | c1 | v5 | T1]; 2. FAST BANDED DL [H18 | BB | c3 | v4 | T2]; 3. DB ROWS 8/8 [H19 | DB | c3 | v2 | T4]; 4. STAGGERED STANCE DL [H20 | DB | c2 | v2 | T4]

**8-week columns E:L | WK4 | SATURDAY** `04:B21:M24 col H` tiers `2-3-4`

1. PUSH PRESS [H21 | BB | c2 | v5 | T2]; 2. BENT OVER ROWS [H22 | BB | c3 | v2 | T3]; 3. ALT INCLINE DB BENCH [H23 | DB | c3 | v2 | T4]

**8-week columns E:L | WK5 | MONDAY** `04:B9:M12 col I` tiers `3-3-4-4`

1. HEAVY FRONT SQUAT [I9 | BB | c3 | v3 | T3]; 2. DEF. DL or SNATCH GRIP [I10 | BB | c3 | v2 | T3]; 3. PULL UPS [I11 | BW | c3 | v2 | T4]; 4. REVERSE LUNGES [I12 | DB | c2 | v2 | T4]

**8-week columns E:L | WK5 | WEDNESDAY** (identical in: 8-week columns E:L WK7) `04:B13:M16 col I` tiers `3-4-4-5`

1. HEAVY BENCH PRESS [I13 | BB | c3 | v3 | T3]; 2. PRONATED PULL UPS [I14 | BW | c3 | v2 | T4]; 3. ALT INCLINE DB BENCH [I15 | DB | c3 | v2 | T4]; 4. BICEP CURLS [I16 | DB | c3 | v2 | T5]

**8-week columns E:L | WK5 | THURSDAY** `04:B17:M20 col I` tiers `1-2-4-4`

1. WEIGHTED DEPTH DROP [I17 | LOAD? | c1 | v5 | T1]; 2. FAST FRONT SQUAT [I18 | BB | c3 | v4 | T2]; 3. PULL UPS [I19 | BW | c3 | v2 | T4]; 4. REVERSE LUNGES [I20 | DB | c2 | v2 | T4]

**8-week columns E:L | WK5 | SATURDAY** `04:B21:M24 col I` tiers `2-4-4`

1. FAST BANDED BENCH PRESS [I21 | BB | c3 | v4 | T2]; 2. PRONATED PULL UPS [I22 | BW | c3 | v2 | T4]; 3. ALT INCLINE DB BENCH [I23 | DB | c3 | v2 | T4]

**8-week columns E:L | WK6 | MONDAY** `04:B9:M12 col J` tiers `3-3-4-4`

1. HEAVY DEADLIFT [J9 | BB | c3 | v3 | T3]; 2. HIGH BAR SQUAT [J10 | BB | c3 | v2 | T3]; 3. DB ROWS 8/8 [J11 | DB | c3 | v2 | T4]; 4. STAGGERED STANCE DL [J12 | DB | c2 | v2 | T4]

**8-week columns E:L | WK6 | WEDNESDAY** `04:B13:M16 col J` tiers `3-4-4-5`

1. HEAVY OH PRESS [J13 | BB | c3 | v3 | T3]; 2. SEAL ROWS [J14 | DB | c4 | v2 | T4]; 3. ALT INCLINE DB BENCH [J15 | DB | c3 | v2 | T4]; 4. BICEP CURLS [J16 | DB | c3 | v2 | T5]

**8-week columns E:L | WK6 | THURSDAY** `04:B17:M20 col J` tiers `1-2-4-4`

1. DEPTH DROP & JUMP [J17 | BW-bal | c1 | v5 | T1]; 2. FAST DEADLIFT [J18 | BB | c3 | v4 | T2]; 3. DB ROWS 8/8 [J19 | DB | c3 | v2 | T4]; 4. STAGGERED STANCE DL [J20 | DB | c2 | v2 | T4]

**8-week columns E:L | WK6 | SATURDAY** `04:B21:M24 col J` tiers `2-4-4`

1. FAST DB OH PRESS [J21 | DB | c3 | v4 | T2]; 2. SEAL ROWS [J22 | DB | c4 | v2 | T4]; 3. ALT INCLINE DB BENCH [J23 | DB | c3 | v2 | T4]

**8-week columns E:L | WK7 | MONDAY** `04:B9:M12 col K` tiers `3-3-4-4`

1. HEAVY HIGH BAR SQUAT [K9 | BB | c3 | v3 | T3]; 2. DEADLIFT [K10 | BB | c3 | v2 | T3]; 3. PULL UPS [K11 | BW | c3 | v2 | T4]; 4. FFE & RFE SPLIT SQTS. [K12 | DB | c2 | v2 | T4]

**8-week columns E:L | WK7 | THURSDAY** `04:B17:M20 col K` tiers `1-2-4-4`

1. REPEAT HIGH JUMPS [K17 | BW-bal | c1 | v5 | T1]; 2. FAST HIGH BAR SQUAT [K18 | BB | c3 | v4 | T2]; 3. PULL UPS [K19 | BW | c3 | v2 | T4]; 4. FFE & RFE SPLIT SQTS. [K20 | DB | c2 | v2 | T4]

**8-week columns E:L | WK7 | SATURDAY** `04:B21:M24 col K` tiers `2-4-4`

1. FAST BENCH PRESS [K21 | BB | c3 | v4 | T2]; 2. PRONATED PULL UPS [K22 | BW | c3 | v2 | T4]; 3. ALT INCLINE DB BENCH [K23 | DB | c3 | v2 | T4]

**8-week columns E:L | WK8 | MONDAY** `04:B9:M12 col L` tiers `?`

1. TEST [L9 | ? | c- | v- | ?]

**8-week columns E:L | WK8 | WEDNESDAY** `04:B13:M16 col L` tiers `?`

1. TEST [L13 | ? | c- | v- | ?]

**8-week columns E:L | WK8 | THURSDAY** `04:B17:M20 col L` tiers `?`

1. DELOAD [L17 | ? | c- | v- | ?]

**8-week columns E:L | WK8 | SATURDAY** `04:B21:M24 col L` tiers `?`

1. DELOAD [L21 | ? | c- | v- | ?]

**12-week columns O:Z | WK1 | MONDAY** (identical in: 12-week columns O:Z WK3; 12-week columns O:Z WK7; 12-week columns O:Z WK9) `04:N9:N12 + col O` tiers `3-3-4-5`

1. HIGH BAR SQUAT [O9 | BB | c3 | v3 | T3]; 2. RDL [O10 | BB | c3 | v2 | T3]; 3. STAGGERED STANCE DL [O11 | DB | c2 | v2 | T4]; 4. LEG EXT [O12 | MACH | c5 | v2 | T5]

**12-week columns O:Z | WK1 | WEDNESDAY** (identical in: 12-week columns O:Z WK3; 12-week columns O:Z WK5; 12-week columns O:Z WK7; 12-week columns O:Z WK9; 12-week columns O:Z WK11) `04:N13:N16 + col O` tiers `3-4-5-5`

1. BENCH PRESS [O13 | BB | c3 | v3 | T3]; 2. LAT PULL DOWN [O14 | CBL | c4 | v2 | T4]; 3. TATE PRESS [O15 | DB | c4 | v2 | T5]; 4. SIDE RAISES [O16 | DB | c3 | v2 | T5]

**12-week columns O:Z | WK1 | THURSDAY** `04:N17:N20 + col O` tiers `2-3-4-5`

1. LEG PRESS [O17 | MACH | c5 | v4 | T2]; 2. Good morning [O18 | BB | c3 | v2 | T3]; 3. STAGGERED STANCE DL [O19 | DB | c2 | v2 | T4]; 4. LEG EXT [O20 | MACH | c5 | v2 | T5]

**12-week columns O:Z | WK1 | SATURDAY** (identical in: 12-week columns O:Z WK5; 12-week columns O:Z WK7; 12-week columns O:Z WK9; 12-week columns O:Z WK11) `04:N21:N24 + col O` tiers `2-4-5-5`

1. INCLINE BENCH [O21 | BB | c3 | v4 | T2]; 2. LAT PULL DOWN [O22 | CBL | c4 | v2 | T4]; 3. CABLE FLIES [O23 | CBL | c4 | v2 | T5]; 4. JM PRESS [O24 | BB | c3 | v2 | T5]

**12-week columns O:Z | WK2 | MONDAY** `04:N9:N12 + col P` tiers `3-3-4-5`

1. RDL (stiff leg deadlift) [P9 | BB | c3 | v3 | T3]; 2. HIGH BAR SQUAT [P10 | BB | c3 | v2 | T3]; 3. FFE LUNGES [P11 | DB | c2 | v2 | T4]; 4. LEG CURLS [P12 | MACH | c5 | v2 | T5]

**12-week columns O:Z | WK2 | WEDNESDAY** (identical in: 12-week columns O:Z WK4; 12-week columns O:Z WK6; 12-week columns O:Z WK8; 12-week columns O:Z WK10; 12-week columns O:Z WK12) `04:N13:N16 + col P` tiers `3-4-5-5`

1. INCLINE BENCH [P13 | BB | c3 | v3 | T3]; 2. MACHINE ROW [P14 | MACH | c5 | v2 | T4]; 3. TATE PRESS [P15 | DB | c4 | v2 | T5]; 4. CURLS [P16 | DB | c3 | v2 | T5]

**12-week columns O:Z | WK2 | THURSDAY** (identical in: 12-week columns O:Z WK8) `04:N17:N20 + col P` tiers `2-4-4-5`

1. DEADLIFT [P17 | BB | c3 | v4 | T2]; 2. LEG PRESS [P18 | MACH | c5 | v2 | T4]; 3. FFE LUNGES [P19 | DB | c2 | v2 | T4]; 4. LEG CURLS [P20 | MACH | c5 | v2 | T5]

**12-week columns O:Z | WK2 | SATURDAY** (identical in: 12-week columns O:Z WK4; 12-week columns O:Z WK6; 12-week columns O:Z WK8; 12-week columns O:Z WK10; 12-week columns O:Z WK12) `04:N21:N24 + col P` tiers `2-4-5-5`

1. BENCH PRESS [P21 | BB | c3 | v4 | T2]; 2. MACHINE ROW [P22 | MACH | c5 | v2 | T4]; 3. CABLE FLIES [P23 | CBL | c4 | v2 | T5]; 4. JM PRESS [P24 | BB | c3 | v2 | T5]

**12-week columns O:Z | WK3 | THURSDAY** (identical in: 12-week columns O:Z WK5; 12-week columns O:Z WK7) `04:N17:N20 + col Q` tiers `2-3-4-5`

1. LEG PRESS [Q17 | MACH | c5 | v4 | T2]; 2. RDL/Good morning [Q18 | BB | c3 | v2 | T3]; 3. STAGGERED STANCE DL [Q19 | DB | c2 | v2 | T4]; 4. LEG EXT [Q20 | MACH | c5 | v2 | T5]

**12-week columns O:Z | WK3 | SATURDAY** `04:N21:N24 + col Q` tiers `2-4-5-5`

1. INCLINE BENCH BB [Q21 | BB | c3 | v4 | T2]; 2. LAT PULL DOWN [Q22 | CBL | c4 | v2 | T4]; 3. CABLE FLIES [Q23 | CBL | c4 | v2 | T5]; 4. JM PRESS [Q24 | BB | c3 | v2 | T5]

**12-week columns O:Z | WK4 | MONDAY** `04:N9:N12 + col R` tiers `3-3-4-5`

1. RDL [R9 | BB | c3 | v3 | T3]; 2. HIGH BAR [R10 | BB | c3 | v2 | T3]; 3. REVERSE LUNGES [R11 | DB | c2 | v2 | T4]; 4. LEG CURLS [R12 | MACH | c5 | v2 | T5]

**12-week columns O:Z | WK4 | THURSDAY** (identical in: 12-week columns O:Z WK10) `04:N17:N20 + col R` tiers `2-4-4-5`

1. DEADLIFT [R17 | BB | c3 | v4 | T2]; 2. LEG PRESS [R18 | MACH | c5 | v2 | T4]; 3. REVERSE LUNGES [R19 | DB | c2 | v2 | T4]; 4. LEG CURLS [R20 | MACH | c5 | v2 | T5]

**12-week columns O:Z | WK5 | MONDAY** `04:N9:N12 + col S` tiers `3-3-4-5`

1. Front squat [S9 | BB | c3 | v3 | T3]; 2. DEADLIFT [S10 | BB | c3 | v2 | T3]; 3. STAGGERED STANCE DL [S11 | DB | c2 | v2 | T4]; 4. LEG EXT [S12 | MACH | c5 | v2 | T5]

**12-week columns O:Z | WK6 | MONDAY** (identical in: 12-week columns O:Z WK12) `04:N9:N12 + col T` tiers `3-3-4-5`

1. DEADLIFT [T9 | BB | c3 | v3 | T3]; 2. Front squat [T10 | BB | c3 | v2 | T3]; 3. FFE & RFE SPLIT SQTS. [T11 | DB | c2 | v2 | T4]; 4. LEG CURLS [T12 | MACH | c5 | v2 | T5]

**12-week columns O:Z | WK6 | THURSDAY** (identical in: 12-week columns O:Z WK12) `04:N17:N20 + col T` tiers `2-3-4-5`

1. DEADLIFT [T17 | BB | c3 | v4 | T2]; 2. LOW BAR [T18 | BB | c3 | v2 | T3]; 3. FFE & RFE SPLIT SQTS. [T19 | DB | c2 | v2 | T4]; 4. LEG CURLS [T20 | MACH | c5 | v2 | T5]

**12-week columns O:Z | WK8 | MONDAY** `04:N9:N12 + col V` tiers `3-3-4-5`

1. RDL [V9 | BB | c3 | v3 | T3]; 2. Front squat [V10 | BB | c3 | v2 | T3]; 3. FFE LUNGES [V11 | DB | c2 | v2 | T4]; 4. LEG CURLS [V12 | MACH | c5 | v2 | T5]

**12-week columns O:Z | WK9 | THURSDAY** (identical in: 12-week columns O:Z WK11) `04:N17:N20 + col W` tiers `2-3-4-5`

1. LEG PRESS [W17 | MACH | c5 | v4 | T2]; 2. RDL [W18 | BB | c3 | v2 | T3]; 3. STAGGERED STANCE DL [W19 | DB | c2 | v2 | T4]; 4. LEG EXT [W20 | MACH | c5 | v2 | T5]

**12-week columns O:Z | WK10 | MONDAY** `04:N9:N12 + col X` tiers `3-3-4-5`

1. RDL [X9 | BB | c3 | v3 | T3]; 2. Front squat [X10 | BB | c3 | v2 | T3]; 3. REVERSE LUNGES [X11 | DB | c2 | v2 | T4]; 4. LEG CURLS [X12 | MACH | c5 | v2 | T5]

**12-week columns O:Z | WK11 | MONDAY** `04:N9:N12 + col Y` tiers `3-3-4-5`

1. HIGH BAR SQUAT [Y9 | BB | c3 | v3 | T3]; 2. DEADLIFT [Y10 | BB | c3 | v2 | T3]; 3. STAGGERED STANCE DL [Y11 | DB | c2 | v2 | T4]; 4. LEG EXT [Y12 | MACH | c5 | v2 | T5]

### CONJUGATE (NOT DONE)

**8 WEEK CYCLE | WK1 | MONDAY** `12:B13:M16 col E` tiers `3-3-4-4`

1. HEAVY FRONT SQUAT (D)BOX SQUAT [E13 | BB | c3 | v3 | T3]; 2. SNATCH GRIP DL [E14 | BB | c3 | v2 | T3]; 3. PULL UPS [E15 | BW | c3 | v2 | T4]; 4. RFE LUNGES [E16 | DB | c2 | v2 | T4]

**8 WEEK CYCLE | WK1 | WEDNESDAY** `12:B17:M20 col E` tiers `3-3-4-5`

1. HEAVY BENCH PRESS [E17 | BB | c3 | v3 | T3]; 2. BENT OVER ROW [E18 | BB | c3 | v2 | T3]; 3. ALT INCLINE DB BENCH [E19 | DB | c3 | v2 | T4]; 4. BICEP CURLS [E20 | DB | c3 | v2 | T5]

**8 WEEK CYCLE | WK1 | THURSDAY** `12:B21:M24 col E` tiers `1-2-4-4`

1. WEIGHTED DEPTH DROP [E21 | LOAD? | c1 | v5 | T1]; 2. FAST FRONT SQUATS (D) BOX [E22 | BB | c3 | v4 | T2]; 3. PULL UPS [E23 | BW | c3 | v2 | T4]; 4. RFE LUNGES [E24 | DB | c2 | v2 | T4]

**8 WEEK CYCLE | WK1 | SATURDAY** `12:B25:M28 col E` tiers `2-3-4`

1. FAST BANDED BENCH PRESS [E25 | BB | c3 | v4 | T2]; 2. BENT OVER ROW [E26 | BB | c3 | v2 | T3]; 3. ALT INCLINE DB BENCH [E27 | DB | c3 | v2 | T4]

**8 WEEK CYCLE | WK2 | MONDAY** `12:B13:M16 col F` tiers `3-3-4-4`

1. HEAVY DEFICIT DEADLIFT [F13 | BB | c3 | v3 | T3]; 2. F. SQUAT (T&G)BOX [F14 | BB | c3 | v2 | T3]; 3. DB ROWS 8/8 [F15 | DB | c3 | v2 | T4]; 4. STAGGERED STANCE DL [F16 | DB | c2 | v2 | T4]

**8 WEEK CYCLE | WK2 | WEDNESDAY** `12:B17:M20 col F` tiers `3-4-4-5`

1. HEAVY OH PRESS [F17 | BB | c3 | v3 | T3]; 2. CLOSE GRIP PULL UPS [F18 | BW | c3 | v2 | T4]; 3. ALT INCLINE DB BENCH [F19 | DB | c3 | v2 | T4]; 4. BICEP CURLS [F20 | DB | c3 | v2 | T5]

**8 WEEK CYCLE | WK2 | THURSDAY** `12:B21:M24 col F` tiers `1-2-4-4`

1. DEPTH DROP & JUMP [F21 | BW-bal | c1 | v5 | T1]; 2. FAST BANDED DL [F22 | BB | c3 | v4 | T2]; 3. DB ROWS 8/8 [F23 | DB | c3 | v2 | T4]; 4. STAGGERED STANCE DL [F24 | DB | c2 | v2 | T4]

**8 WEEK CYCLE | WK2 | SATURDAY** `12:B25:M28 col F` tiers `2-4-4`

1. FAST DB OH PRESS [F25 | DB | c3 | v4 | T2]; 2. CLOSE GRIP PULL UPS [F26 | BW | c3 | v2 | T4]; 3. ALT INCLINE DB BENCH [F27 | DB | c3 | v2 | T4]

**8 WEEK CYCLE | WK3 | MONDAY** `12:B13:M16 col G` tiers `3-3-4-4`

1. HEAVY (D)BOX HIGH BAR SQUAT [G13 | BB | c3 | v3 | T3]; 2. SNATCH GRIP DL [G14 | BB | c3 | v2 | T3]; 3. PULL UPS [G15 | BW | c3 | v2 | T4]; 4. FFE LUNGES [G16 | DB | c2 | v2 | T4]

**8 WEEK CYCLE | WK3 | WEDNESDAY** `12:B17:M20 col G` tiers `3-4-4-5`

1. HEAVY BENCH PRESS [G17 | BB | c3 | v3 | T3]; 2. SEAL ROWS [G18 | DB | c4 | v2 | T4]; 3. ALT INCLINE DB BENCH [G19 | DB | c3 | v2 | T4]; 4. BICEP CURLS [G20 | DB | c3 | v2 | T5]

**8 WEEK CYCLE | WK3 | THURSDAY** `12:B21:M24 col G` tiers `1-2-4-4`

1. HIGH SQUAT JUMPS [G21 | BW-bal | c1 | v5 | T1]; 2. FAST HIGH BAR (D)BOX [G22 | BB | c3 | v4 | T2]; 3. PULL UPS [G23 | BW | c3 | v2 | T4]; 4. FFE LUNGES [G24 | DB | c2 | v2 | T4]

**8 WEEK CYCLE | WK3 | SATURDAY** `12:B25:M28 col G` tiers `2-4-4`

1. FAST BANDED BENCH PRESS [G25 | BB | c3 | v4 | T2]; 2. SEAL ROWS [G26 | DB | c4 | v2 | T4]; 3. ALT INCLINE DB BENCH [G27 | DB | c3 | v2 | T4]

**8 WEEK CYCLE | WK4 | MONDAY** `12:B13:M16 col H` tiers `3-3-4-4`

1. HEAVY CHAINED DEADLIFT [H13 | BB | c3 | v3 | T3]; 2. (T&G)BOX HIGH BAR SQUAT [H14 | BB | c3 | v2 | T3]; 3. DB ROWS 8/8 [H15 | DB | c3 | v2 | T4]; 4. STAGGERED STANCE DL [H16 | DB | c2 | v2 | T4]

**8 WEEK CYCLE | WK4 | WEDNESDAY** `12:B17:M20 col H` tiers `3-3-4-5`

1. HEAVY OH PRESS [H17 | BB | c3 | v3 | T3]; 2. BENT OVER ROWS [H18 | BB | c3 | v2 | T3]; 3. ALT INCLINE DB BENCH [H19 | DB | c3 | v2 | T4]; 4. BICEP CURLS [H20 | DB | c3 | v2 | T5]

**8 WEEK CYCLE | WK4 | THURSDAY** `12:B21:M24 col H` tiers `1-2-4-4`

1. REPEAT HIGH JUMPS [H21 | BW-bal | c1 | v5 | T1]; 2. FAST CHAINED DL [H22 | BB | c3 | v4 | T2]; 3. DB ROWS 8/8 [H23 | DB | c3 | v2 | T4]; 4. STAGGERED STANCE DL [H24 | DB | c2 | v2 | T4]

**8 WEEK CYCLE | WK4 | SATURDAY** `12:B25:M28 col H` tiers `2-3-4`

1. FAST BB OH PRESS [H25 | BB | c3 | v4 | T2]; 2. BENT OVER ROWS [H26 | BB | c3 | v2 | T3]; 3. ALT INCLINE DB BENCH [H27 | DB | c3 | v2 | T4]

**8 WEEK CYCLE | WK5 | MONDAY** `12:B13:M16 col I` tiers `3-3-4-4`

1. HEAVY FRONT SQUAT [I13 | BB | c3 | v3 | T3]; 2. SNATCH GRIP DL [I14 | BB | c3 | v2 | T3]; 3. PULL UPS [I15 | BW | c3 | v2 | T4]; 4. REVERSE LUNGES [I16 | DB | c2 | v2 | T4]

**8 WEEK CYCLE | WK5 | WEDNESDAY** (identical in: 8 WEEK CYCLE WK7) `12:B17:M20 col I` tiers `3-4-4-5`

1. HEAVY BENCH PRESS [I17 | BB | c3 | v3 | T3]; 2. PRONATED PULL UPS [I18 | BW | c3 | v2 | T4]; 3. ALT INCLINE DB BENCH [I19 | DB | c3 | v2 | T4]; 4. BICEP CURLS [I20 | DB | c3 | v2 | T5]

**8 WEEK CYCLE | WK5 | THURSDAY** `12:B21:M24 col I` tiers `1-2-4-4`

1. WEIGHTED DEPTH DROP [I21 | LOAD? | c1 | v5 | T1]; 2. FAST FRONT SQUAT [I22 | BB | c3 | v4 | T2]; 3. PULL UPS [I23 | BW | c3 | v2 | T4]; 4. REVERSE LUNGES [I24 | DB | c2 | v2 | T4]

**8 WEEK CYCLE | WK5 | SATURDAY** `12:B25:M28 col I` tiers `2-4-4`

1. FAST BANDED BENCH PRESS [I25 | BB | c3 | v4 | T2]; 2. PRONATED PULL UPS [I26 | BW | c3 | v2 | T4]; 3. ALT INCLINE DB BENCH [I27 | DB | c3 | v2 | T4]

**8 WEEK CYCLE | WK6 | MONDAY** `12:B13:M16 col J` tiers `3-3-4-4`

1. HEAVY DEADLIFT [J13 | BB | c3 | v3 | T3]; 2. HIGH BAR SQUAT [J14 | BB | c3 | v2 | T3]; 3. DB ROWS 8/8 [J15 | DB | c3 | v2 | T4]; 4. STAGGERED STANCE DL [J16 | DB | c2 | v2 | T4]

**8 WEEK CYCLE | WK6 | WEDNESDAY** `12:B17:M20 col J` tiers `3-4-4-5`

1. HEAVY OH PRESS [J17 | BB | c3 | v3 | T3]; 2. SEAL ROWS [J18 | DB | c4 | v2 | T4]; 3. ALT INCLINE DB BENCH [J19 | DB | c3 | v2 | T4]; 4. BICEP CURLS [J20 | DB | c3 | v2 | T5]

**8 WEEK CYCLE | WK6 | THURSDAY** `12:B21:M24 col J` tiers `1-2-4-4`

1. DEPTH DROP & JUMP [J21 | BW-bal | c1 | v5 | T1]; 2. FAST DEADLIFT [J22 | BB | c3 | v4 | T2]; 3. DB ROWS 8/8 [J23 | DB | c3 | v2 | T4]; 4. STAGGERED STANCE DL [J24 | DB | c2 | v2 | T4]

**8 WEEK CYCLE | WK6 | SATURDAY** `12:B25:M28 col J` tiers `2-4-4`

1. FAST DB OH PRESS [J25 | DB | c3 | v4 | T2]; 2. SEAL ROWS [J26 | DB | c4 | v2 | T4]; 3. ALT INCLINE DB BENCH [J27 | DB | c3 | v2 | T4]

**8 WEEK CYCLE | WK7 | MONDAY** `12:B13:M16 col K` tiers `3-3-4-4`

1. HEAVY HIGH BAR SQUAT [K13 | BB | c3 | v3 | T3]; 2. DEADLIFT [K14 | BB | c3 | v2 | T3]; 3. PULL UPS [K15 | BW | c3 | v2 | T4]; 4. FFE & RFE SPLIT SQTS. [K16 | DB | c2 | v2 | T4]

**8 WEEK CYCLE | WK7 | THURSDAY** `12:B21:M24 col K` tiers `1-2-4-4`

1. REPEAT HIGH JUMPS [K21 | BW-bal | c1 | v5 | T1]; 2. FAST HIGH BAR SQUAT [K22 | BB | c3 | v4 | T2]; 3. PULL UPS [K23 | BW | c3 | v2 | T4]; 4. FFE & RFE SPLIT SQTS. [K24 | DB | c2 | v2 | T4]

**8 WEEK CYCLE | WK7 | SATURDAY** `12:B25:M28 col K` tiers `2-4-4`

1. FAST BENCH PRESS [K25 | BB | c3 | v4 | T2]; 2. PRONATED PULL UPS [K26 | BW | c3 | v2 | T4]; 3. ALT INCLINE DB BENCH [K27 | DB | c3 | v2 | T4]

**8 WEEK CYCLE | WK8 | MONDAY** `12:B13:M16 col L` tiers `?`

1. TEST [L13 | ? | c- | v- | ?]

**8 WEEK CYCLE | WK8 | WEDNESDAY** `12:B17:M20 col L` tiers `?`

1. TEST [L17 | ? | c- | v- | ?]

**8 WEEK CYCLE | WK8 | THURSDAY** `12:B21:M24 col L` tiers `?`

1. DELOAD [L21 | ? | c- | v- | ?]

**8 WEEK CYCLE | WK8 | SATURDAY** `12:B25:M28 col L` tiers `?`

1. DELOAD [L25 | ? | c- | v- | ?]

### ATHLETIC FULL BODY

**STARTING OFF SEASON WORKOUTS | off-season (no week columns) | WORKOUT 1** `05:A12:C21` tiers `2-2-2-1-4-2-2-2-1-C`

1. Depth Jump with weight [C12 | LOAD? | c1 | v5 | T2]; 2. Depth jump with weight into high box jump [C13 | LOAD? | c1 | v5 | T2]; 3. Really high jump squats LOAD & jump hard [C14 | LOAD? | c1 | v5 | T2]; 4. High Knee Runs FAST [C15 | BW-bal | c1 | v5 | T1]; 5. HEAVY Single arm rotational half kneeling cable row or band row or Bir [C16 | CBL | c2 | v3 | T4]; 6. SUPERSET: HEAVY Hex bar Squats direclty into 10 Repeat Jump Squat HIGH [C17 | BB | c1 | v5 | T2]; 7. SUPERSET: HEAVY Ipsilateral DB front foot elevated lunge directly into [C18 | DB | c1 | v5 | T2]; 8. Standing Overhead DB sesaw push presses [C19 | DB | c2 | v5 | T2]; 9. Lateral mid size box step up jumps directly into nordic curls [C20 | BW-bal | c1 | v5 | T1]; 10. Side Plank presses (advanced does star side plank presses) [C21 | BW | c3 | v2 | CORE]

**STARTING OFF SEASON WORKOUTS | off-season (no week columns) | WORKOUT 2** `05:A24:C30` tiers `1-C-2-2-2-1-K`

1. *MEDBALLS [C24 | MB | c1 | v5 | T1]; 2. Star Supine Cross Connects [C25 | BW | c3 | v2 | CORE]; 3. KB Swings + 12/12 Single leg Glute bridges [C26 | KB | c2 | v5 | T2]; 4. Banded fast LAT PULL DOWNS Single Arm [C27 | BAND | c2 | v4 | T2]; 5. Staggered stance DB snatch [C28 | DB | c2 | v5 | T2]; 6. Plyo Push ups - one side raised [C29 | BW-bal | c1 | v5 | T1]; 7. 20 on/ 10 off - TABATA TIMER - Flutter kicks & Hip Turns [C30 | BW-bal | c1 | v4 | COND]

**STARTING OFF SEASON WORKOUTS | off-season (no week columns) | WORKOUT 3** `05:A33:C39` tiers `C-4-4-2-3-5-5`

1. Med ball rolls [C33 | MB | c3 | v2 | CORE]; 2. HEAVY: Camporini DL [C34 | DB | c2 | v3 | T4]; 3. HEAVY: Heavy walking lunges [C35 | DB | c2 | v3 | T4]; 4. SUPERSET: Low Hang Power Cleans (mid weight) [C36 | BB | c2 | v5 | T2]; 5. Heavy Snatch grip DL [C37 | BB | c3 | v3 | T3]; 6. SUPERSET: Dead bugs + Front Raises + Side Raises [C38 | DB | c3 | v2 | T5]; 7. Superset: leg ext. leg curls (MID WEIGHT) [C39 | MACH | c5 | v2 | T5]

**MID OFF SEASON WORKOUTS | off-season (no week columns) | WORKOUT 1** `05:D12:F21` tiers `1-1-1-1-C-3-3-4-5-5`

1. weighted Depth Drops - Drop & Stick - Hold for 3 seconds on each one [F12 | LOAD? | c1 | v5 | T1]; 2. High Jumps [F13 | BW-bal | c1 | v5 | T1]; 3. Bilateral Symetrical Squirrel Jumps [F14 | BW-bal | c1 | v5 | T1]; 4. Single leg Squirrel Jumps [F15 | BW-bal | c1 | v5 | T1]; 5. Hollow rocks [F16 | BW | c4 | v2 | CORE]; 6. Heavy DB bench presses [F17 | DB | c3 | v3 | T3]; 7. Heavy Deadlifts [F18 | BB | c3 | v3 | T3]; 8. Pull ups or Lat pull downs [F19 | BW | c3 | v2 | T4]; 9. Heavy curls & Heavy tricep kickbakcs 12 on each side [F20 | DB | c3 | v3 | T5]; 10. Plate core & leg extensions / nordic curls [F21 | MACH | c3 | v2 | T5]

**MID OFF SEASON WORKOUTS | off-season (no week columns) | WORKOUT 2** `05:D24:F38` tiers `1-1-1-1-1-1-1-1-1-1-C-2-4-2`

1. Rotational Chest pass R [F25 | MB | c1 | v5 | T1]; 2. Rotational Chest pass L [F26 | MB | c1 | v5 | T1]; 3. Rotational Scoop R [F27 | MB | c1 | v5 | T1]; 4. Rotational Scoop L [F28 | MB | c1 | v5 | T1]; 5. Rotational Floor side to side slams [F29 | MB | c1 | v5 | T1]; 6. Half kneeling Right Facing LEFT LEG UP rotational scoop [F30 | MB | c1 | v5 | T1]; 7. Half kneeling Right Facing RIGHT LEG FORWARD rotational scoop [F31 | MB | c1 | v5 | T1]; 8. Half kneeling LEFT Facing LEFT LEG UP rotational scoop [F32 | MB | c1 | v5 | T1]; 9. Half kneeling LEFT Facing RIGHT LEG FORWARD rotational scoop [F33 | MB | c1 | v5 | T1]; 10. Alternating Back to wall Rotational Scoops [F34 | MB | c1 | v5 | T1]; 11. Star Supine Cross Connects UNBROKEN [F35 | BW | c3 | v2 | CORE]; 12. Heavy Power Cleans [F36 | BB | c2 | v5 | T2]; 13. Lateral Step ups IPSILATERAL loading [F37 | DB | c2 | v2 | T4]; 14. Db Staggered Hang Snatch [F38 | DB | c2 | v5 | T2]

**MID OFF SEASON WORKOUTS | off-season (no week columns) | WORKOUT 3** `05:D41:F48` tiers `1-C-1-2-4-4-2-4`

1. Weighted Depth Drops - Drop & Stick - Hold for 3 seconds on each one [F41 | LOAD? | c1 | v5 | T1]; 2. Med Ball Rockers [F42 | MB | c3 | v2 | CORE]; 3. Single Leg to march jumps [F43 | BW-bal | c1 | v5 | T1]; 4. HEX bar loaded Jumps [F44 | BB | c1 | v5 | T2]; 5. Bench glute Bridge & fast alternating DB sesaw floor press [F45 | BW | c3 | v2 | T4]; 6. Unilateral Deadlift DB loaded [F46 | DB | c2 | v2 | T4]; 7. Max speed banded lat pull downs half kneeling ipsilateral [F47 | BAND | c2 | v4 | T2]; 8. SUPERSET: DB Single leg Glute bridges + alternating seated bicep curl  [F48 | DB | c2 | v2 | T4]

**MID OFF SEASON WORKOUTS | off-season (no week columns) | WORKOUT 4** `05:D51:F67` tiers `1-1-1-1-1-1-1-1-1-1-C-4-4-4-5-C`

1. Rotational Chest pass R [F52 | MB | c1 | v5 | T1]; 2. Rotational Chest pass L [F53 | MB | c1 | v5 | T1]; 3. Rotational Scoop R [F54 | MB | c1 | v5 | T1]; 4. Rotational Scoop L [F55 | MB | c1 | v5 | T1]; 5. Rotational Floor side to side slams [F56 | MB | c1 | v5 | T1]; 6. Half kneeling Right Facing LEFT LEG UP rotational scoop [F57 | MB | c1 | v5 | T1]; 7. Half kneeling Right Facing RIGHT LEG FORWARD rotational scoop [F58 | MB | c1 | v5 | T1]; 8. Half kneeling LEFT Facing LEFT LEG UP rotational scoop [F59 | MB | c1 | v5 | T1]; 9. Half kneeling LEFT Facing RIGHT LEG FORWARD rotational scoop [F60 | MB | c1 | v5 | T1]; 10. Alternating Back to wall Rotational Scoops [F61 | MB | c1 | v5 | T1]; 11. Med ball Star Supine Cross Connects UNBROKEN [F62 | MB | c3 | v2 | CORE]; 12. Heavy DB rows [F63 | DB | c3 | v3 | T4]; 13. RFE & FFE contralateral lunge double DB front rack loaded [F64 | DB | c2 | v2 | T4]; 14. DB overhead sesaw alternating press (no leg drive) [F65 | DB | c2 | v2 | T4]; 15. DB side raises + Copenhagen plank :50 sec each side [F66 | DB | c3 | v2 | T5]; 16. 50 situps + 50 crunches + 50 reverse crunches [F67 | BW | c4 | v2 | CORE]

**ADVANCED OFF SEASON WORKOUTS | off-season (no week columns) | WORKOUT 1** `05:H12:J17` tiers `1-C-1-3-4-C`

1. Weighted Depth Drops - Drop & Stick - Hold for 3 seconds on each one [J12 | LOAD? | c1 | v5 | T1]; 2. Med Ball Rockers [J13 | MB | c3 | v2 | CORE]; 3. Single Leg to march jumps [J14 | BW-bal | c1 | v5 | T1]; 4. DEADLIFTS (1RIR) [J15 | BB | c3 | v3 | T3]; 5. Unilateral Deadlift DB loaded [J16 | DB | c2 | v2 | T4]; 6. SUPERSET: Star v-ups + side plank knee to elbow [J17 | BW | c4 | v2 | CORE]

**ADVANCED OFF SEASON WORKOUTS | off-season (no week columns) | WORKOUT 2** `05:H20:J25` tiers `1-4-4-4-5-C`

1. *MEDBALLS [J20 | MB | c1 | v5 | T1]; 2. Heavy DB rows [J21 | DB | c3 | v3 | T4]; 3. RFE & FFE contralateral lunge double DB front rack loaded [J22 | DB | c2 | v2 | T4]; 4. DB overhead sesaw alternating press (no leg drive) [J23 | DB | c2 | v2 | T4]; 5. DB side raises + Copenhagen plank :50 sec each side [J24 | DB | c3 | v2 | T5]; 6. 50 situps + 50 crunches + 50 reverse crunches [J25 | BW | c4 | v2 | CORE]

**ADVANCED OFF SEASON WORKOUTS | off-season (no week columns) | WORKOUT 3** `05:H28:J35` tiers `1-1-1-C-2-3-5-5`

1. Squirrel jumps both feet [J28 | BW-bal | c1 | v5 | T1]; 2. Bilateral Symetrical jump on to plate [J29 | BW-bal | c1 | v5 | T1]; 3. SL Jump on to plate forward/back [J30 | BW-bal | c1 | v5 | T1]; 4. Hollow rocks [J31 | BW | c4 | v2 | CORE]; 5. Power Cleans [J32 | BB | c2 | v5 | T2]; 6. HEAVY GLUTE BRIDGES [J33 | BB | c3 | v3 | T3]; 7. Heavy curls & Heavy tricep kickbakcs 12 on each side [J34 | DB | c3 | v3 | T5]; 8. Plate core & leg extensions [J35 | MACH | c5 | v2 | T5]

**ADVANCED OFF SEASON WORKOUTS | off-season (no week columns) | WORKOUT 4** `05:H38:J43` tiers `1-C-5-4-2-C`

1. *MEDBALL [J38 | MB | c1 | v5 | T1]; 2. Star Supine Cross Connects UNBROKEN [J39 | BW | c3 | v2 | CORE]; 3. Heel raises & fast/rythmic/1/4 SQUATS [J40 | BW | c3 | v2 | T5]; 4. Lateral Step ups IPSILATERAL loading [J41 | DB | c2 | v2 | T4]; 5. Db Staggered Hang Snatch [J42 | DB | c2 | v5 | T2]; 6. Feet againts the wall weighted low plank [J43 | LOAD? | c3 | v1 | CORE]

### BASEBALL

**BLOCK 1 | Week 1 | MONDAY** `02:B27:D40` tiers `1-1-C-2-4-4-5-1`

*Part A*: 1. Med ball half kneeling rotationss in & step out [D28 | MB | c1 | v5 | T1]; +2. Stick the landing pushups [D29 | BW-bal | c1 | v5 | T1]; *Part B*: 3. Side planks [D30 | BW | c3 | v1 | CORE]; *Part C*: 4. DB Squat Jumps [D33 | DB | c1 | v5 | T2]; +5. DB Rows [D34 | DB | c3 | v2 | T4]; *Part D*: 6. Rear foot on wall DB RDL [D36 | DB | c2 | v2 | T4]; +7. Bicep Curls [D37 | DB | c3 | v2 | T5]; +8. Side to side hurdle hops [D38 | BW-bal | c1 | v5 | T1]

**BLOCK 1 | Week 1 | TUESDAY** `02:E27:G40` tiers `1-1-C-3-4-4-5-5`

*Part A*: 1. Depth drop [G28 | BW-bal | c1 | v5 | T1]; +2. depth drop to jump [G29 | BW-bal | c1 | v5 | T1]; *Part B*: 3. Hip turns [G30 | BW | c2 | v2 | CORE]; *Part C*: 4. Hex bar deadlift [G33 | BB | c3 | v2 | T3]; +5. DB Bottoms up bench press [G34 | DB | c2 | v2 | T4]; *Part D*: 6. RFE Bulgarian lunge [G36 | DB | c2 | v2 | T4]; +7. Cable tricep ext [G37 | CBL | c4 | v2 | T5]; +8. side raises [G38 | DB | c3 | v2 | T5]

**BLOCK 1 | Week 1 | THURSDAY** `02:H27:J40` tiers `1-1-C-C-3-4-4-5-5`

*Part A*: 1. med ball rotational chest pass [J28 | MB | c1 | v5 | T1]; +2. med ball overhead toss [J29 | MB | c1 | v5 | T1]; *Part B*: 3. butterfly situps [J30 | BW | c4 | v2 | CORE]; +4. toes to bar or knees to chest [J31 | BW | c2 | v2 | CORE]; *Part C*: 5. Back sqaut [J33 | BB | c3 | v2 | T3]; +6. Pull Ups [J34 | BW | c3 | v2 | T4]; *Part D*: 7. camporini dl [J36 | DB | c2 | v2 | T4]; +8. EZ bar Pronated curls [J37 | BB | c3 | v2 | T5]; +9. weighted calf raises [J38 | DB | c3 | v2 | T5]

**BLOCK 1 | Week 1 | FRIDAY** `02:K27:M40` tiers `1-1-C-1-4-4-4-5-2`

*Part A*: 1. Hurdle hops single leg [M28 | BW-bal | c1 | v5 | T1]; +2. 30m acceleration sprint [M29 | BW-bal | c1 | v5 | T1]; *Part B*: 3. Cable load rotation chop [M30 | CBL | c2 | v2 | CORE]; +4. MEd ball scoop [M31 | MB | c1 | v5 | T1]; *Part C*: 5. DB deadlifts [M33 | DB | c3 | v2 | T4]; +6. LAndmine half kneeling press [M34 | BB | c2 | v2 | T4]; *Part D*: 7. Front foot elevated ipsilateral lunge [M36 | DB | c2 | v2 | T4]; +8. overhead db tricep ext [M37 | DB | c3 | v2 | T5]; +9. sesaw push press [M38 | DB | c2 | v5 | T2]

**BLOCK 1 | WK 2 | MONDAY** `02:Q27:S40` tiers `1-1-C-2-4-1-5-1-K` day tag 'Speed'

*Part A*: 1. sit up to chest pass [S28 | MB | c1 | v5 | T1]; +2. jumping pushups [S29 | BW-bal | c1 | v5 | T1]; *Part B*: 3. Obilque sit plank [S30 | BW | c3 | v1 | CORE]; *Part C*: 4. Hex bar squat jumps [S33 | BB | c1 | v5 | T2]; +5. seal rows 10 reps all rounds [S34 | DB | c4 | v2 | T4]; *Part D*: 6. highest ankle hops [S36 | BW-bal | c1 | v5 | T1]; +7. Bicep hammer Curls [S37 | DB | c3 | v2 | T5]; +8. highest ankle hops [S38 | BW-bal | c1 | v5 | T1]; *Part E*: 9. 2x 15 cal bike sprint [S39 | CARDIO | c5 | v5 | COND]

**BLOCK 1 | WK 2 | TUESDAY** `02:U27:W40` tiers `1-1-C-3-4-4-5-5` day tag 'strength'

*Part A*: 1. Depth drop - single leg [W28 | BW-bal | c1 | v5 | T1]; +2. lateral hop to plate single leg [W29 | BW-bal | c1 | v5 | T1]; *Part B*: 3. Cable rotational oblique twist [W30 | CBL | c3 | v4 | CORE]; *Part C*: 4. Barbell deadlift [W33 | BB | c3 | v2 | T3]; +5. top down db bench press [W34 | DB | c3 | v2 | T4]; *Part D*: 6. DB reverse lunges [W36 | DB | c2 | v2 | T4]; +7. tricep kickbacks [W37 | DB | c3 | v2 | T5]; +8. side raises [W38 | DB | c3 | v2 | T5]

**BLOCK 1 | WK 2 | THURSDAY** `02:Y27:AA40` tiers `1-C-4-5-4-5-5-K`

*Part A*: 1. step forward chest pass [AA28 | MB | c1 | v5 | T1]; *Part B*: 2. 50 Toes to bar [AA30 | BW | c2 | v2 | CORE]; *Part C*: 3. Goblet squat slow [AA33 | DB | c3 | v1 | T4]; +4. Cable lat pull over [AA34 | CBL | c4 | v2 | T5]; *Part D*: 5. camporini dl [AA36 | DB | c2 | v2 | T4]; +6. EZ bar Pronated curls [AA37 | BB | c3 | v2 | T5]; +7. weighted calf raises [AA38 | DB | c3 | v2 | T5]; *Part E*: 8. 3x 10 cal row sprint or ski [AA39 | CARDIO | c4 | v5 | COND]

**BLOCK 1 | WK 2 | FRIDAY** `02:AC27:AE40` tiers `1-C-C-2-3-4-5-2` day tag 'speed'

*Part A*: 1. single leg hops forward & back [AE28 | BW-bal | c1 | v5 | T1]; *Part B*: 2. Cable rotational oblique twist [AE30 | CBL | c3 | v4 | CORE]; +3. plate russian twists [AE31 | PLATE | c2 | v2 | CORE]; *Part C*: 4. KB swings [AE33 | KB | c2 | v5 | T2]; +5. barbell press [AE34 | BB | c3 | v2 | T3]; *Part D*: 6. DB forward lunge [AE36 | DB | c2 | v2 | T4]; +7. tate press [AE37 | DB | c4 | v2 | T5]; +8. db push press [AE38 | DB | c2 | v5 | T2]

**BLOCK 1 | wk 3 | MONDAY** `02:AI27:AK40` tiers `1-1-C-2-4-5-5-1-K` day tag 'Speed'

*Part A*: 1. overhead toss [AK28 | MB | c1 | v5 | T1]; +2. side lying db drop & catch - like this but with a DB that drops and yo [AK29 | DB | c1 | v5 | T1]; *Part B*: 3. COpenhagen plank [AK30 | BW | c3 | v1 | CORE]; *Part C*: 4. fast high zercher squats [AK33 | BB | c3 | v4 | T2]; +5. seal rows 10 reps all rounds [AK34 | DB | c4 | v2 | T4]; *Part D*: 6. Glidder hamstring runners [AK36 | SLD/SB | c2 | v4 | T5]; +7. incline curls [AK37 | DB | c4 | v2 | T5]; +8. DB ankle hops [AK38 | DB | c1 | v5 | T1]; *Part E*: 9. 1x 20 cal bike sprint [AK39 | CARDIO | c5 | v5 | COND]

**BLOCK 1 | wk 3 | TUESDAY** `02:AM27:AO40` tiers `1-1-C-3-4-4-5-5` day tag 'strength'

*Part A*: 1. Sit to jump on to box [AO28 | BW-bal | c1 | v5 | T1]; +2. single leg hop on and off of plate [AO29 | BW-bal | c1 | v5 | T1]; *Part B*: 3. floor windshield whipers [AO30 | BW | c2 | v4 | CORE]; *Part C*: 4. Barbell deadlift [AO33 | BB | c3 | v2 | T3]; +5. incline db bench press [AO34 | DB | c3 | v2 | T4]; *Part D*: 6. ffe lunges - contralateral loading [AO36 | DB | c2 | v2 | T4]; +7. floor db skull crushers [AO37 | DB | c4 | v2 | T5]; +8. unilateral curl to press (one at a time) [AO38 | DB | c3 | v2 | T5]

**BLOCK 1 | wk 3 | THURSDAY** `02:AQ27:AS40` tiers `1-C-3-4-5-5-5-K`

*Part A*: 1. situp to overhead toss [AS28 | MB | c1 | v5 | T1]; *Part B*: 2. 50 Toes to bar [AS30 | BW | c2 | v2 | CORE]; *Part C*: 3. front squat [AS33 | BB | c3 | v2 | T3]; +4. pull ups [AS34 | BW | c3 | v2 | T4]; *Part D*: 5. Swiss ball leg curls [AS36 | SLD/SB | c2 | v2 | T5]; +6. Alternating bicep curls [AS37 | DB | c3 | v2 | T5]; +7. weighted calf raises [AS38 | DB | c3 | v2 | T5]; *Part E*: 8. 1x 20 cal row sprint or ski [AS39 | CARDIO | c4 | v5 | COND]

**BLOCK 1 | wk 3 | FRIDAY** `02:AU27:AW40` tiers `1-C-C-1-3-4-4-3` day tag 'speed'

*Part A*: 1. single leg lateral hops side to side [AW28 | BW-bal | c1 | v5 | T1]; *Part B*: 2. Cable rotational oblique twist [AW30 | CBL | c3 | v4 | CORE]; +3. plate russian twists [AW31 | PLATE | c2 | v2 | CORE]; *Part C*: 4. broad jumps [AW33 | BW-bal | c1 | v5 | T1]; +5. barbell press [AW34 | BB | c3 | v2 | T3]; *Part D*: 6. db contralateral step up [AW36 | DB | c2 | v2 | T4]; +7. offset pushups [AW37 | BW | c2 | v2 | T4]; +8. bent over rows [AW38 | BB | c3 | v2 | T3]

**BLOCK 1 | wk 4 | MONDAY** `02:BA27:BC40` tiers `1-1-C-2-4-5-5-1-K` day tag 'Speed'

*Part A*: 1. Rotational chest pass [BC28 | MB | c1 | v5 | T1]; +2. rotational scoops [BC29 | MB | c1 | v5 | T1]; *Part B*: 3. Oblique sit plank [BC30 | BW | c3 | v1 | CORE]; *Part C*: 4. KB Squat cleans [BC33 | KB | c2 | v5 | T2]; +5. Cable half kneeling rotational row [BC34 | CBL | c2 | v2 | T4]; *Part D*: 6. Glidder hamstring runners [BC36 | SLD/SB | c2 | v4 | T5]; +7. DB "no money" curls [BC37 | DB | c3 | v2 | T5]; +8. DB ankle hops [BC38 | DB | c1 | v5 | T1]; *Part E*: 9. 2x 15 cal bike sprint [BC39 | CARDIO | c5 | v5 | COND]

**BLOCK 1 | wk 4 | TUESDAY** `02:BE27:BG40` tiers `1-1-C-3-4-4-5-2` day tag 'strength'

*Part A*: 1. DB snap downs [BG28 | DB | c1 | v5 | T1]; +2. Single leg box jump [BG29 | BW-bal | c1 | v5 | T1]; *Part B*: 3. Hanging lateral knees to chest [BG30 | BW | c2 | v2 | CORE]; *Part C*: 4. Staggered Barbell deadlift [BG33 | BB | c2 | v2 | T3]; +5. Top down incline db bench press [BG34 | DB | c3 | v2 | T4]; *Part D*: 6. RFE lunges - contralateral loading [BG36 | DB | c2 | v2 | T4]; +7. Ropte Tricep Extensions [BG37 | CBL | c4 | v2 | T5]; +8. Single Arm DB snatch from floor [BG38 | DB | c2 | v5 | T2]

**BLOCK 1 | wk 4 | THURSDAY** `02:BI27:BK40` tiers `1-C-3-4-5-5-5-K`

*Part A*: 1. situp to chest pass [BK28 | MB | c1 | v5 | T1]; *Part B*: 2. Weighted leg raises medball [BK30 | MB | c3 | v2 | CORE]; *Part C*: 3. front squat [BK33 | BB | c3 | v2 | T3]; +4. pull ups [BK34 | BW | c3 | v2 | T4]; *Part D*: 5. Swiss ball kicks (30 seconds) [BK36 | SLD/SB | c2 | v2 | T5]; +6. Alternating curl to press [BK37 | DB | c3 | v2 | T5]; +7. weighted calf raises [BK38 | DB | c3 | v2 | T5]; *Part E*: 8. 3x10 cal bike sprint [BK39 | CARDIO | c5 | v5 | COND]

**BLOCK 1 | wk 4 | FRIDAY** `02:BM27:BO40` tiers `1-1-C-C-2-1-4-4-5` day tag 'speed'

*Part A*: 1. forward bounds [BO28 | BW-bal | c1 | v5 | T1]; +2. High staggered stance box jump [BO29 | BW-bal | c1 | v5 | T1]; *Part B*: 3. Cable rotational oblique twist [BO30 | CBL | c3 | v4 | CORE]; +4. plate russian twists [BO31 | PLATE | c2 | v2 | CORE]; *Part C*: 5. Banded KB swings [BO33 | KB | c2 | v5 | T2]; +6. medball press [BO34 | MB | c1 | v5 | T1]; *Part D*: 7. step ups - dbs on both hands [BO36 | DB | c2 | v2 | T4]; +8. offset pushups [BO37 | BW | c2 | v2 | T4]; +9. rear delt db row [BO38 | DB | c3 | v2 | T5]

**BLOCK 1 | wk 5 | MONDAY** `02:BS27:BU40` tiers `1-1-C-2-3-4-5-1` day tag 'Speed'

*Part A*: 1. back against wall med ball rotational toss [BU28 | MB | c1 | v5 | T1]; +2. medball situp to overhead toss [BU29 | MB | c1 | v5 | T1]; *Part B*: 3. Side plank star [BU30 | BW | c3 | v1 | CORE]; *Part C*: 4. Front squats - light weights - same speed for all reps [BU33 | BB | c3 | v4 | T2]; +5. bent over barbell rows same weight of front squats [BU34 | BB | c3 | v2 | T3]; *Part D*: 6. suitcase double dumbell staggered db RDL [BU36 | DB | c2 | v2 | T4]; +7. EZ bar curls [BU37 | BB | c3 | v2 | T5]; +8. High ankle hops [BU38 | BW-bal | c1 | v5 | T1]

**BLOCK 1 | wk 5 | TUESDAY** `02:BW27:BY40` tiers `1-1-C-3-1-4-C-5-K` day tag 'strength'

*Part A*: 1. Single leg march jumps [BY28 | BW-bal | c1 | v5 | T1]; +2. Single leg drop Stick the landing from low box [BY29 | BW-bal | c1 | v5 | T1]; *Part B*: 3. Plate russian twists [BY30 | PLATE | c2 | v2 | CORE]; *Part C*: 4. barbell Deadlifts [BY33 | BB | c3 | v2 | T3]; +5. plyo pushups [BY34 | BW-bal | c1 | v5 | T1]; *Part D*: 6. doubdle db suitcase reverse lunges [BY36 | DB | c2 | v2 | T4]; +7. 6/6 plank up downs [BY37 | BW | c2 | v2 | CORE]; +8. Side raises [BY38 | DB | c3 | v2 | T5]; *Part E*: 9. 3x 10 cal bike sprint (2 min rest) [BY39 | CARDIO | c5 | v5 | COND]

**BLOCK 1 | wk 5 | THURSDAY** `02:CA27:CC40` tiers `1-C-3-5-5-5`

*Part A*: 1. medball floor catch & release push [CC28 | MB | c1 | v5 | T1]; *Part B*: 2. low plank feet on wall [CC30 | BW | c3 | v1 | CORE]; *Part C*: 3. Back squats [CC33 | BB | c3 | v2 | T3]; +4. Cable lat pull over [CC34 | CBL | c4 | v2 | T5]; *Part D*: 5. Alternating curls [CC37 | DB | c3 | v2 | T5]; +6. Heavy calf raises double db [CC38 | DB | c3 | v3 | T5]

**BLOCK 1 | wk 5 | FRIDAY** `02:CE27:CG40` tiers `1-C-2-4-4-5-5-K` day tag 'speed'

*Part A*: 1. 10 meter acceleration from pushup position [CG28 | BW-bal | c1 | v5 | T1]; *Part B*: 2. floor windshield wipers [CG30 | BW | c2 | v2 | CORE]; *Part C*: 3. KB swing [CG33 | KB | c2 | v5 | T2]; +4. one dumbbell half kneeling single arm db press [CG34 | DB | c2 | v2 | T4]; *Part D*: 5. Front & Rear foot elevated lunges [CG36 | DB | c2 | v2 | T4]; +6. cable overhead tricep ext [CG37 | CBL | c4 | v2 | T5]; +7. db front raises [CG38 | DB | c3 | v2 | T5]; *Part E*: 8. 2x 15 sec run [CG39 | ? | c1 | v5 | COND]

**BLOCK 1 | wk 6 | MONDAY** `02:CK28:CM40` tiers `1-1-C-2-3-4-4-5-5-K`

*Part A*: 1. Rotational chest pass [CM29 | MB | c1 | v5 | T1]; +2. Overhead toss [CM30 | MB | c1 | v5 | T1]; *Part B*: 3. Side plank [CM31 | BW | c3 | v1 | CORE]; *OPTIONAL PIECE*: 4. Hang cleans @ 75% [CM33 | BB | c2 | v5 | T2]; *Part C*: 5. barbell High zercher squat [CM34 | BB | c3 | v2 | T3]; +6. Heavy DB row [CM35 | DB | c3 | v3 | T4]; *Part D*: 7. Staggered stance DB dl [CM37 | DB | c2 | v2 | T4]; +8. EZ bar curls [CM38 | BB | c3 | v2 | T5]; +9. DB calf raises [CM39 | DB | c3 | v2 | T5]; *Part E*: 10. 1 X 12 Cal bike sprint [CM40 | CARDIO | c5 | v5 | COND]

**BLOCK 1 | wk 6 | TUESDAY** `02:CO28:CQ40` tiers `1-1-C-2-3-4-4-5-5-K`

*Part A*: 1. Hurdle hops [CQ29 | BW-bal | c1 | v5 | T1]; +2. Single leg hop on/off plate forward and back [CQ30 | BW-bal | c1 | v5 | T1]; *Part B*: 3. plank Hip turns [CQ31 | BW | c2 | v2 | CORE]; *OPTIONAL PIECE*: 4. Hang snatch @ 75% [CQ33 | BB | c2 | v5 | T2]; *Part C*: 5. Deadlifts [CQ34 | BB | c3 | v2 | T3]; +6. db Bench press (small incline) [CQ35 | DB | c3 | v2 | T4]; *Part D*: 7. High zercher DB RFE Lunge front foot on ramp [CQ37 | DB | c2 | v2 | T4]; +8. Floor tricep DB skull crushers [CQ38 | DB | c4 | v2 | T5]; +9. Side raises [CQ39 | DB | c3 | v2 | T5]; *Part E*: 10. 1 X 12 Cal skierg sprint [CQ40 | CARDIO | c3 | v5 | COND]

**BLOCK 1 | wk 6 | THURSDAY** `02:CS28:CU40` tiers `1-1-C-2-3-3-4-5-5-K`

*Part A*: 1. Medball Chest pass [CU29 | MB | c1 | v5 | T1]; +2. Rotational medball scoop [CU30 | MB | c1 | v5 | T1]; *Part B*: 3. med ball rockers [CU31 | MB | c3 | v2 | CORE]; *OPTIONAL PIECE*: 4. Hang cleans @ 75% [CU33 | BB | c2 | v5 | T2]; *Part C*: 5. Zercher squats [CU34 | BB | c3 | v2 | T3]; +6. Close grip cable lat pull down [CU35 | CBL | c4 | v3 | T3]; *Part D*: 7. Staggered stance DB dl - Medial pressure - contralateral loading [CU37 | DB | c2 | v2 | T4]; +8. Alternating bicep ahmmer curls [CU38 | DB | c3 | v2 | T5]; +9. DB calf raises [CU39 | DB | c3 | v2 | T5]; *Part E*: 10. 1 X 12 Cal row sprint [CU40 | CARDIO | c4 | v5 | COND]

**BLOCK 1 | wk 6 | FRIDAY** `02:CW28:CY40` tiers `1-1-C-2-4-2-2-5-5`

*Part A*: 1. High knee tuck in jumps [CY29 | BW-bal | c1 | v5 | T1]; +2. ankle hops [CY30 | BW-bal | c1 | v5 | T1]; *Part B*: 3. Swissball plate rotations [CY31 | PLATE | c2 | v2 | CORE]; *OPTIONAL PIECE*: 4. Hang Snatch @ 75% [CY33 | BB | c2 | v5 | T2]; *Part C*: 5. 45 degree hyper-extension machine [CY34 | MACH | c4 | v2 | T4]; +6. Single arm DB push press [CY35 | DB | c2 | v5 | T2]; *Part D*: 7. Suitcase DB RFE lunge jumps [CY37 | DB | c1 | v5 | T2]; +8. Cable tricep extensions [CY38 | CBL | c4 | v2 | T5]; +9. bent over db Reverse flies [CY39 | DB | c3 | v2 | T5]

**BLOCK 1 | wk 7 | MONDAY** `02:DC28:DE40` tiers `1-1-C-2-2-4-1-5-1-K`

*Part A*: 1. step forward into Overhead toss [DE29 | MB | c1 | v5 | T1]; +2. Situp to chest pass [DE30 | MB | c1 | v5 | T1]; *Part B*: 3. Low oblique plank [DE31 | BW | c3 | v1 | CORE]; *OPTIONAL PIECE*: 4. Hang cleans @ 80% [DE33 | BB | c2 | v5 | T2]; *Part C*: 5. Oscilating drop squats [DE34 | BW | c3 | v4 | T2]; +6. Seal rows [DE35 | DB | c4 | v2 | T4]; *Part D*: 7. Banded tantrums (sprint) [DE37 | BAND | c1 | v5 | T1]; +8. heavy curls [DE38 | DB | c3 | v3 | T5]; +9. db weighted ankle hops [DE39 | DB | c1 | v5 | T1]; *Part E*: 10. bike sprint [DE40 | CARDIO | c5 | v5 | COND]

**BLOCK 1 | wk 7 | TUESDAY** `02:DG28:DI40` tiers `1-C-2-3-4-4-5-5-K`

*Part A*: 1. Fast run/ walk back or 3 min walk/rest - This is NOT a sprint, this is [DI29 | BW-bal | c1 | v5 | T1]; *Part B*: 2. DEad bugs [DI31 | BW | c4 | v2 | CORE]; *OPTIONAL PIECE*: 3. Hang snatch @ 80% [DI33 | BB | c2 | v5 | T2]; *Part C*: 4. deadlifts [DI34 | BB | c3 | v2 | T3]; +5. DB bench press [DI35 | DB | c3 | v2 | T4]; *Part D*: 6. DB alternating Deficit Reverse lunges from plate [DI37 | DB | c2 | v2 | T4]; +7. tate press [DI38 | DB | c4 | v2 | T5]; +8. Cable side raises [DI39 | CBL | c4 | v2 | T5]; *Part E*: 9. ski sprints [DI40 | CARDIO | c3 | v5 | COND]

**BLOCK 1 | wk 7 | THURSDAY** `02:DK28:DM40` tiers `1-1-C-2-3-4-4-5-5`

*Part A*: 1. Rotational med ball slams [DM29 | MB | c1 | v5 | T1]; +2. Back against the wall seated rotational medball tosses [DM30 | MB | c1 | v5 | T1]; *Part B*: 3. Loaded low plank - plate on hips [DM31 | PLATE | c3 | v1 | CORE]; *OPTIONAL PIECE*: 4. Hang cleans @ 80% [DM33 | BB | c2 | v5 | T2]; *Part C*: 5. back squat [DM34 | BB | c3 | v2 | T3]; +6. pull ups [DM35 | BW | c3 | v2 | T4]; *Part D*: 7. heavy rear foot on wall db deadlift [DM37 | DB | c2 | v3 | T4]; +8. barbell wide grip curls [DM38 | BB | c3 | v2 | T5]; +9. DB calf raises [DM39 | DB | c3 | v2 | T5]

**BLOCK 1 | wk 7 | FRIDAY** `02:DO28:DQ40` tiers `1-1-C-2-2-4-4-5-4-K`

*Part A*: 1. Single leg seated jump on to box single leg [DQ29 | BW-bal | c1 | v5 | T1]; +2. MEd ball hug ankle hops [DQ30 | MB | c1 | v5 | T1]; *Part B*: 3. plate russian twists [DQ31 | PLATE | c2 | v2 | CORE]; *OPTIONAL PIECE*: 4. Hang Snatch @ 80% [DQ33 | BB | c2 | v5 | T2]; *Part C*: 5. kb swings heavy [DQ34 | KB | c2 | v5 | T2]; +6. DB sesaw presses [DQ35 | DB | c2 | v2 | T4]; *Part D*: 7. kb front rack lateral lunge kb lunges [DQ37 | KB | c2 | v2 | T4]; +8. cable overhead tricep extensions [DQ38 | CBL | c4 | v2 | T5]; +9. Pushups [DQ39 | BW | c3 | v2 | T4]; *Part E*: 10. row spring [DQ40 | CARDIO | c4 | v5 | COND]

**BLOCK 1 | wk 8 | MONDAY** `02:DU28:DW40` tiers `C-C-K`

*Part A*: 1. Kettlebell arm bars [DW29 | KB | c4 | v1 | CORE]; *Part B*: 2. Half kneeling shoulder roll [DW31 | BW | c3 | v1 | CORE]; *Part C*: 3. Paced Cardio - easy [DW34 | CARDIO | c- | v- | COND]

**BLOCK 1 | wk 8 | TUESDAY** `02:DY28:EA40` tiers `C-C-K`

*Part A*: 1. Kettlebell arm bars [EA29 | KB | c4 | v1 | CORE]; *Part B*: 2. floor windchield wipers [EA31 | BW | c2 | v2 | CORE]; *Part C*: 3. Paced Cardio - easy [EA34 | CARDIO | c- | v- | COND]

**BLOCK 1 | wk 8 | THURSDAY** `02:EC28:EE40` tiers `C-C-K`

*Part A*: 1. Kettlebell arm bars [EE29 | KB | c4 | v1 | CORE]; *Part B*: 2. Half kneeling shoulder roll [EE31 | BW | c3 | v1 | CORE]; *Part C*: 3. Paced Cardio - easy [EE34 | CARDIO | c- | v- | COND]

**BLOCK 1 | wk 8 | FRIDAY** `02:EG28:EI40` tiers `C-C-K`

*Part A*: 1. Kettlebell arm bars [EI29 | KB | c4 | v1 | CORE]; *Part B*: 2. floor windchield wipers [EI31 | BW | c2 | v2 | CORE]; *Part C*: 3. Paced Cardio - easy [EI34 | CARDIO | c- | v- | COND]

**BLOCK 2 | WK 1 | MONDAY** `02:C45:E58` tiers `1-C-C-C-3-2-4-5-5-1-K` day tag 'Speed'

*Part A*: 1. overhead toss [E46 | MB | c1 | v5 | T1]; +2. Single side KB carry [E47 | KB | c2 | v1 | CORE]; *Part B*: 3. COpenhagen plank [E48 | BW | c3 | v1 | CORE]; +4. Star plank [E49 | BW | c3 | v1 | CORE]; *Part C*: 5. Heavy front squats [E51 | BB | c3 | v3 | T3]; +6. KB squat cleans [E52 | KB | c2 | v5 | T2]; +7. seal rows [E53 | DB | c4 | v2 | T4]; *Part D*: 8. Glidder hamstring runners [E54 | SLD/SB | c2 | v4 | T5]; +9. incline curls [E55 | DB | c4 | v2 | T5]; +10. DB heavy ankle hops [E56 | DB | c1 | v5 | T1]; *Part E*: 11. 1x 30 Sec Fast Run [E57 | BW-bal | c1 | v5 | COND]

**BLOCK 2 | WK 1 | TUESDAY** `02:G45:I58` tiers `1-1-C-C-3-1-4-4-5-5-K` day tag 'strength'

*Part A*: 1. Sit to jump on to box with DBs [I46 | DB | c1 | v5 | T1]; +2. single leg hop on and off to box [I47 | BW-bal | c1 | v5 | T1]; *Part B*: 3. heavy plate russian twists [I48 | PLATE | c2 | v2 | CORE]; +4. Bicycle crunches [I49 | BW | c4 | v2 | CORE]; *Part C*: 5. Barbell deadlift [I51 | BB | c3 | v2 | T3]; +6. Broad jumps [I52 | BW-bal | c1 | v5 | T1]; +7. incline db bench press [I53 | DB | c3 | v2 | T4]; *Part D*: 8. ffe lunges - contralateral loading [I54 | DB | c2 | v2 | T4]; +9. floor db skull crushers [I55 | DB | c4 | v2 | T5]; +10. Side Raises [I56 | DB | c3 | v2 | T5]; *Part E*: 11. 1x 30 Sec Fast Run [I57 | BW-bal | c1 | v5 | COND]

**BLOCK 2 | WK 1 | THURSDAY** `02:K45:M58` tiers `1-1-C-3-4-5-5-5-K`

*Part A*: 1. situp to overhead toss [M46 | MB | c1 | v5 | T1]; +2. Sit up to chest pass [M47 | MB | c1 | v5 | T1]; *Part B*: 3. 50 Toes to bar [M48 | BW | c2 | v2 | CORE]; *Part C*: 4. front squat [M51 | BB | c3 | v2 | T3]; +5. pull ups [M52 | BW | c3 | v2 | T4]; *Part D*: 6. Banded rolling hamstring curls [M54 | BAND | c2 | v2 | T5]; +7. Alternating bicep curls [M55 | DB | c3 | v2 | T5]; +8. weighted calf raises [M56 | DB | c3 | v2 | T5]; *Part E*: 9. 1x 30 Sec Fast Run [M57 | BW-bal | c1 | v5 | COND]

**BLOCK 2 | WK 1 | FRIDAY** `02:O45:Q58` tiers `1-C-C-2-3-4-4-4-K` day tag 'speed'

*Part A*: 1. single leg lateral hops side to side [Q46 | BW-bal | c1 | v5 | T1]; *Part B*: 2. Cable rotational oblique twist [Q48 | CBL | c3 | v4 | CORE]; +3. plate russian twists [Q49 | PLATE | c2 | v2 | CORE]; *Part C*: 4. DB High jumps Staggered stance switch [Q51 | DB | c1 | v5 | T2]; +5. barbell overhead strict press [Q52 | BB | c3 | v2 | T3]; *Part D*: 6. db ipsilateral step up [Q54 | DB | c2 | v2 | T4]; +7. offset pushups [Q55 | BW | c2 | v2 | T4]; +8. bent over sesaw rows [Q56 | DB | c2 | v2 | T4]; *Part E*: 9. 1x 30 Sec Fast Run [Q57 | BW-bal | c1 | v5 | COND]

**BLOCK 2 | wk 2 | MONDAY** `02:U45:W58` tiers `1-1-C-C-2-4-5-5-1-K` day tag 'Speed'

*Part A*: 1. Rotational chest pass [W46 | MB | c1 | v5 | T1]; +2. rotational scoops [W47 | MB | c1 | v5 | T1]; *Part B*: 3. Oblique sit plank [W48 | BW | c3 | v1 | CORE]; 4. KB Single arm farmer walk carry [W49 | KB | c2 | v1 | CORE]; *Part C*: 5. KB Squat cleans [W51 | KB | c2 | v5 | T2]; +6. Cable half kneeling rotational row [W52 | CBL | c2 | v2 | T4]; *Part D*: 7. Glidder hamstring runners [W54 | SLD/SB | c2 | v4 | T5]; +8. DB "no money" curls [W55 | DB | c3 | v2 | T5]; +9. DB ankle hops [W56 | DB | c1 | v5 | T1]; *Part E*: 10. 15 cal bike sprint [W57 | CARDIO | c5 | v5 | COND]

**BLOCK 2 | wk 2 | TUESDAY** `02:Y45:AA58` tiers `1-1-C-3-4-4-5-2` day tag 'strength'

*Part A*: 1. DB snap downs [AA46 | DB | c1 | v5 | T1]; +2. Single leg box jump [AA47 | BW-bal | c1 | v5 | T1]; *Part B*: 3. Hanging lateral knees to chest [AA48 | BW | c2 | v2 | CORE]; *Part C*: 4. Staggered Barbell deadlift [AA51 | BB | c2 | v2 | T3]; +5. Top down incline db bench press [AA52 | DB | c3 | v2 | T4]; *Part D*: 6. RFE lunges - doubke db suitcase loading [AA54 | DB | c2 | v2 | T4]; +7. Ropte Tricep Extensions [AA55 | CBL | c4 | v2 | T5]; +8. Single Arm DB snatch from floor [AA56 | DB | c2 | v5 | T2]

**BLOCK 2 | wk 2 | THURSDAY** `02:AC45:AE58` tiers `1-C-3-4-5-5-5-K`

*Part A*: 1. situp to chest pass [AE46 | MB | c1 | v5 | T1]; *Part B*: 2. Weighted leg raises medball [AE48 | MB | c3 | v2 | CORE]; *Part C*: 3. front squat [AE51 | BB | c3 | v2 | T3]; +4. pull ups [AE52 | BW | c3 | v2 | T4]; *Part D*: 5. Swiss ball kicks (30 seconds) [AE54 | SLD/SB | c2 | v2 | T5]; +6. Alternating curl to press [AE55 | DB | c3 | v2 | T5]; +7. weighted calf raises [AE56 | DB | c3 | v2 | T5]; *Part E*: 8. 10 cal bike sprint [AE57 | CARDIO | c5 | v5 | COND]

**BLOCK 2 | wk 2 | FRIDAY** `02:AG45:AI58` tiers `1-1-C-C-2-1-4-4-5` day tag 'speed'

*Part A*: 1. forward bounds [AI46 | BW-bal | c1 | v5 | T1]; +2. staggered stance box jump [AI47 | BW-bal | c1 | v5 | T1]; *Part B*: 3. Cable rotational oblique twist [AI48 | CBL | c3 | v1 | CORE]; +4. plate russian twists [AI49 | PLATE | c2 | v2 | CORE]; *Part C*: 5. Fast KB swings [AI51 | KB | c2 | v5 | T2]; +6. medball press [AI52 | MB | c1 | v5 | T1]; *Part D*: 7. step ups - dbs on both hands [AI54 | DB | c2 | v2 | T4]; +8. offset pushups [AI55 | BW | c2 | v2 | T4]; +9. rear delt db row [AI56 | DB | c3 | v2 | T5]

**BLOCK 2 | wk 4 | MONDAY** `02:AM45:AO58` tiers `1-1-C-2-1-3-4-5-1-K` day tag 'Speed'

*Part A*: 1. lateral lunge to Medball scoop [AO46 | MB | c1 | v5 | T1]; 2. step to overhead toss [AO47 | MB | c1 | v5 | T1]; *Part B*: 3. Side plank star [AO48 | BW | c3 | v1 | CORE]; *Part C*: 4. Front squats - light weights - same speed for all reps [AO51 | BB | c3 | v4 | T2]; +5. Jump squats [AO52 | BW-bal | c1 | v5 | T1]; +6. bend over barbell rows [AO53 | BB | c3 | v2 | T3]; *Part D*: 7. suitcase double dumbell staggered db RDL [AO54 | DB | c2 | v2 | T4]; +8. EZ bar curls [AO55 | BB | c3 | v2 | T5]; +9. High ankle hops [AO56 | BW-bal | c1 | v5 | T1]; *Part E*: 10. bike sprint [AO57 | CARDIO | c5 | v5 | COND]

**BLOCK 2 | wk 4 | TUESDAY** `02:AQ45:AS58` tiers `1-1-C-3-4-4-C-5-K` day tag 'strength'

*Part A*: 1. Single leg march jumps [AS46 | BW-bal | c1 | v5 | T1]; +2. DB Single leg drop Stick the landing from low box [AS47 | DB | c1 | v5 | T1]; *Part B*: 3. cross body mountain climbers [AS48 | BW | c2 | v2 | CORE]; *Part C*: 4. barbell Deadlifts [AS51 | BB | c3 | v2 | T3]; +5. DB flat bench press [AS52 | DB | c3 | v2 | T4]; *Part D*: 6. db high zercher step ups [AS54 | DB | c2 | v2 | T4]; +7. plank up downs [AS55 | BW | c2 | v2 | CORE]; +8. Side raises [AS56 | DB | c3 | v2 | T5]; *Part E*: 9. bike sprints [AS57 | CARDIO | c5 | v5 | COND]

**BLOCK 2 | wk 4 | THURSDAY** `02:AU45:AW58` tiers `4-1-C-3-5-4-5-5-K`

*Part A*: 1. push ups [AW46 | BW | c3 | v2 | T4]; +2. MB fast chest pass [AW47 | MB | c1 | v5 | T1]; *Part B*: 3. Single arm/leg turkish situps [AW48 | BW | c2 | v2 | CORE]; *Part C*: 4. heavy hex bar squats [AW51 | BB | c3 | v3 | T3]; +5. Cable lat pull over [AW52 | CBL | c4 | v2 | T5]; *Part D*: 6. SL glute bridges (heel on bench) [AW54 | BW | c2 | v2 | T4]; +7. SA db preacher curls [AW55 | DB | c4 | v2 | T5]; +8. Heavy calf raises double db [AW56 | DB | c3 | v3 | T5]; *Part E*: 9. skierg sprint [AW57 | CARDIO | c3 | v5 | COND]

**BLOCK 2 | wk 4 | FRIDAY** `02:AY45:BA58` tiers `1-1-C-2-4-4-5-5` day tag 'speed'

*Part A*: 1. A Marches / A skips / A runners [BA46 | BW-bal | c1 | v4 | T1]; 2. accelerations baseball starts [BA47 | BW-bal | c1 | v5 | T1]; *Part B*: 3. star supine cross connect [BA48 | BW | c3 | v2 | CORE]; *Part C*: 4. fast barbell deadlifts [BA51 | BB | c3 | v4 | T2]; +5. one dumbbell half kneeling single arm db press [BA52 | DB | c2 | v2 | T4]; *Part D*: 6. side lunges (db contralateral load) [BA54 | DB | c2 | v2 | T4]; +7. db overhead tricep ext [BA55 | DB | c3 | v2 | T5]; +8. db side raises [BA56 | DB | c3 | v2 | T5]

**BLOCK 2 | wk 5 | MONDAY** `02:BE46:BG58` tiers `1-1-C-2-3-4-4-5-5-K`

*Part A*: 1. Push ups/chest pass [BG47 | MB | c1 | v5 | T1]; +2. Rotational OH toss [BG48 | MB | c1 | v5 | T1]; *Part B*: 3. Lateral crunches [BG49 | BW | c4 | v2 | CORE]; *OPTIONAL PIECE*: 4. Hang cleans @ 75% [BG51 | BB | c2 | v5 | T2]; *Part C*: 5. barbell High zercher squat [BG52 | BB | c3 | v2 | T3]; +6. Heavy DB row [BG53 | DB | c3 | v3 | T4]; *Part D*: 7. Staggered stance DB dl [BG55 | DB | c2 | v2 | T4]; +8. Inclined bench curls [BG56 | DB | c4 | v2 | T5]; +9. DB calf raises [BG57 | DB | c3 | v2 | T5]; *Part E*: 10. 1 X 12 Cal bike sprint [BG58 | CARDIO | c5 | v5 | COND]

**BLOCK 2 | wk 5 | TUESDAY** `02:BI46:BK58` tiers `1-1-C-2-3-4-4-5-C-K`

*Part A*: 1. Hurdle hops [BK47 | BW-bal | c1 | v5 | T1]; +2. Box jump [BK48 | BW-bal | c1 | v5 | T1]; *Part B*: 3. plank Hip turns [BK49 | BW | c2 | v2 | CORE]; *OPTIONAL PIECE*: 4. Hang snatch @ 75% [BK51 | BB | c2 | v5 | T2]; *Part C*: 5. Deadlifts [BK52 | BB | c3 | v2 | T3]; +6. Alternating DB Bench press (small incline) [BK53 | DB | c3 | v2 | T4]; *Part D*: 7. High zercher DB RFE Lunge front foot on ramp [BK55 | DB | c2 | v2 | T4]; +8. Floor tricep DB skull crushers [BK56 | DB | c4 | v2 | T5]; +9. Shoulders taps [BK57 | BW | c2 | v2 | CORE]; *Part E*: 10. 1 X 12 Cal skierg sprint [BK58 | CARDIO | c3 | v5 | COND]

**BLOCK 2 | wk 5 | THURSDAY** `02:BM46:BO58` tiers `1-1-C-2-2-4-4-5-5-K`

*Part A*: 1. Lateral hinge to MB Chest pass [BO47 | MB | c1 | v5 | T1]; +2. In-out of hip Rotational medball scoop [BO48 | MB | c1 | v5 | T1]; *Part B*: 3. med ball rockers [BO49 | MB | c3 | v2 | CORE]; *OPTIONAL PIECE*: 4. Hang cleans @ 75% [BO51 | BB | c2 | v5 | T2]; *Part C*: 5. Hex bar jump squats [BO52 | BB | c1 | v5 | T2]; +6. Pull ups or Close grip cable lat pull down [BO53 | BW | c3 | v3 | T4]; *Part D*: 7. Staggered stance DB dl - Medial pressure - contralateral loading [BO55 | DB | c2 | v2 | T4]; +8. Barbell wide bicep curls [BO56 | BB | c3 | v2 | T5]; +9. DB calf raises [BO57 | DB | c3 | v2 | T5]; *Part E*: 10. 1 X 12 Cal row sprint [BO58 | CARDIO | c4 | v5 | COND]

**BLOCK 2 | wk 5 | FRIDAY** `02:BQ46:BS58` tiers `1-1-C-2-2-2-2-5-5`

*Part A*: 1. Ankle hops [BS47 | BW-bal | c1 | v5 | T1]; +2. High tuck knees jumps [BS48 | BW-bal | c1 | v5 | T1]; *Part B*: 3. Swissball plate rotations [BS49 | PLATE | c2 | v2 | CORE]; *OPTIONAL PIECE*: 4. Hang Snatch @ 75% [BS51 | BB | c2 | v5 | T2]; *Part C*: 5. 45 degree hyper-extension machine - Kb swings [BS52 | MACH | c2 | v5 | T2]; +6. Single arm DB push press [BS53 | DB | c2 | v5 | T2]; *Part D*: 7. Suitcase DB RFE iso holds / RFE lunge jumps [BS55 | DB | c1 | v5 | T2]; +8. Cable tricep extensions [BS56 | CBL | c4 | v2 | T5]; +9. bent over db Reverse flies [BS57 | DB | c3 | v2 | T5]

**BLOCK 2 | wk 6 | MONDAY** `02:BW46:BY58` tiers `1-1-C-2-2-4-4-5-5-K`

*Part A*: 1. Situp to chest pass [BY47 | MB | c1 | v5 | T1]; +2. MB scoop toss to the wall [BY48 | MB | c1 | v5 | T1]; *Part B*: 3. Low oblique plank [BY49 | BW | c3 | v1 | CORE]; *OPTIONAL PIECE*: 4. Hang cleans @ 80% [BY51 | BB | c2 | v5 | T2]; *Part C*: 5. front squats/high jumps/hex bar squat jumps/ banded assisted hops [BY52 | BB | c1 | v5 | T2]; +6. half kneeling SA cable lats pull down [BY53 | CBL | c2 | v2 | T4]; *Part D*: 7. SL glute bridge [BY55 | BW | c2 | v2 | T4]; +8. heavy curls [BY56 | DB | c3 | v3 | T5]; +9. db wighted calf raises [BY57 | DB | c3 | v2 | T5]; *Part E*: 10. bike sprint [BY58 | CARDIO | c5 | v5 | COND]

**BLOCK 2 | wk 6 | TUESDAY** `02:CA46:CC58` tiers `1-1-C-2-3-2-4-4-5-K`

*Part A*: 1. A March/ A skips/ A runners [CC47 | BW-bal | c1 | v3 | T1]; 2. Fast run/ walk back or 3 min walk/rest - This is NOT a sprint, this is [CC48 | BW-bal | c1 | v5 | T1]; *Part B*: 3. DEad bugs [CC49 | BW | c4 | v2 | CORE]; *OPTIONAL PIECE*: 4. Hang snatch @ 80% [CC51 | BB | c2 | v5 | T2]; *Part C*: 5. heavy deadlifts [CC52 | BB | c3 | v3 | T3]; +6. fast banded assisted bench press [CC53 | BB | c3 | v4 | T2]; *Part D*: 7. DB alternating Deficit Reverse lunges from plate [CC55 | DB | c2 | v2 | T4]; +8. diamond push ups [CC56 | BW | c3 | v2 | T4]; +9. Cable side raises [CC57 | CBL | c4 | v2 | T5]; *Part E*: 10. ski sprints [CC58 | CARDIO | c3 | v5 | COND]

**BLOCK 2 | wk 6 | THURSDAY** `02:CE46:CG58` tiers `1-1-C-2-2-4-4-5-1`

*Part A*: 1. half kneeling Rotational med ball slams [CG47 | MB | c1 | v5 | T1]; +2. step back to MB roational chest pass [CG48 | MB | c1 | v5 | T1]; *Part B*: 3. Loaded low plank - plate on hips [CG49 | PLATE | c3 | v1 | CORE]; *OPTIONAL PIECE*: 4. Hang cleans @ 80% [CG51 | BB | c2 | v5 | T2]; *Part C*: 5. kb clean squat [CG52 | KB | c2 | v5 | T2]; +6. pull ups or banded assisted pull ups [CG53 | BW | c3 | v2 | T4]; *Part D*: 7. heavy rear foot on wall db deadlift [CG55 | DB | c2 | v3 | T4]; +8. barbell pronted grip bicep curls [CG56 | BB | c3 | v2 | T5]; +9. DB ankle hops [CG57 | DB | c1 | v5 | T1]

**BLOCK 2 | wk 6 | FRIDAY** `02:CI46:CK58` tiers `1-1-C-2-2-4-4-5-5-K`

*Part A*: 1. Single leg hop to SL box jump [CK47 | BW-bal | c1 | v5 | T1]; +2. MEd ball hug ankle hops [CK48 | MB | c1 | v5 | T1]; *Part B*: 3. cable oblique twists [CK49 | CBL | c3 | v2 | CORE]; *OPTIONAL PIECE*: 4. Hang Snatch @ 80% [CK51 | BB | c2 | v5 | T2]; *Part C*: 5. kb swings heavy [CK52 | KB | c2 | v5 | T2]; +6. half kneeling landmine press [CK53 | BB | c2 | v2 | T4]; *Part D*: 7. kb front rack lateral lunge kb lunges [CK55 | KB | c2 | v2 | T4]; +8. cable overhead tricep extensions [CK56 | CBL | c4 | v2 | T5]; +9. side raises [CK57 | DB | c3 | v2 | T5]; *Part E*: 10. runner sprint [CK58 | BW-bal | c1 | v5 | COND]

**BLOCK 2 | WEEK 7 | MONDAY** `02:CO46:CQ58` tiers `1-1-C-2-2-4-4-5-5-K`

*Part A*: 1. step to chest pass [CQ47 | MB | c1 | v5 | T1]; +2. MB OH toss to rotational scoop [CQ48 | MB | c1 | v5 | T1]; *Part B*: 3. Hanging Oblique Knee Raise to chest [CQ49 | BW | c2 | v2 | CORE]; *OPTIONAL PIECE*: 4. Hang cleans @ 85% [CQ51 | BB | c2 | v5 | T2]; *Part C*: 5. back squats/banded jumps/DB squat jumps/ high ankle hops [CQ52 | BB | c1 | v5 | T2]; +6. seal DB row [CQ53 | DB | c3 | v2 | T4]; *Part D*: 7. camporini deadlift [CQ55 | DB | c2 | v2 | T4]; +8. Inclined bench curls [CQ56 | DB | c4 | v2 | T5]; +9. DB calf raises [CQ57 | DB | c3 | v2 | T5]; *Part E*: 10. 1 X 12 Cal bike sprint [CQ58 | CARDIO | c5 | v5 | COND]

**BLOCK 2 | WEEK 7 | TUESDAY** `02:CS46:CU58` tiers `1-1-1-2-3-4-4-5-5-K`

*Part A*: 1. single leg hops [CU47 | BW-bal | c1 | v5 | T1]; +2. staggered stace Box jump [CU48 | BW-bal | c1 | v5 | T1]; *Part B*: 3. Facing The Wall MB Rotational Scoop [CU49 | MB | c1 | v5 | T1]; *OPTIONAL PIECE*: 4. Hang snatch @ 85% [CU51 | BB | c2 | v5 | T2]; *Part C*: 5. Deadlifts [CU52 | BB | c3 | v2 | T3]; +6. Alternating DB Bench press (botton up) [CU53 | DB | c2 | v2 | T4]; *Part D*: 7. heavy DB step ups [CU55 | DB | c2 | v3 | T4]; +8. OH rope tricep extension [CU56 | CBL | c4 | v2 | T5]; 9. side raises [CU57 | DB | c3 | v2 | T5]; *Part E*: 10. 1 X 12 Cal skierg sprint [CU58 | CARDIO | c3 | v5 | COND]

**BLOCK 2 | WEEK 7 | THURSDAY** `02:CW46:CY58` tiers `1-1-C-2-3-3-5-1-5-K`

*Part A*: 1. lay down MB presses [CY47 | MB | c1 | v5 | T1]; +2. In-out of hip Rotational medball scoop [CY48 | MB | c1 | v5 | T1]; *Part B*: 3. hallow rocks [CY49 | BW | c4 | v2 | CORE]; *OPTIONAL PIECE*: 4. Hang cleans @ 85% [CY51 | BB | c2 | v5 | T2]; *Part C*: 5. banded front squats [CY52 | BB | c3 | v2 | T3]; +6. weighted Pull ups or max reps Close grip cable lat pull down [CY53 | BW | c3 | v3 | T3]; *Part D*: 7. hamstring runners [CY55 | SLD/SB | c2 | v4 | T5]; +8. weighted ankle hops [CY56 | LOAD? | c1 | v5 | T1]; 9. alternating hammer curls [CY57 | DB | c3 | v2 | T5]; *Part E*: 10. 1 X 12 Cal row sprint [CY58 | CARDIO | c4 | v5 | COND]

**BLOCK 2 | WEEK 7 | FRIDAY** `02:DA46:DC58` tiers `1-1-C-2-2-2-1-5-5`

*Part A*: 1. Quick feet toe tap on step [DC47 | BW-bal | c1 | v5 | T1]; 2. hurdle hops to box jump [DC48 | BW-bal | c1 | v5 | T1]; *Part B*: 3. bycicle crunches [DC49 | BW | c4 | v2 | CORE]; *OPTIONAL PIECE*: 4. Hang Snatch @ 85% [DC51 | BB | c2 | v5 | T2]; *Part C*: 5. banded kb swings [DC52 | KB | c2 | v5 | T2]; +6. Single arm DB push press [DC53 | DB | c2 | v5 | T2]; *Part D*: 7. split stance jump squats [DC55 | BW-bal | c1 | v5 | T1]; +8. side raises [DC56 | DB | c3 | v2 | T5]; 9. DB tricep extensions [DC57 | DB | c3 | v2 | T5]

**BLOCK 2 | WEEK 8 | MONDAY** `02:DF45:DH58` tiers `1-1-C-2-2-4-4-5-5-K`

*Part A*: 1. Situp to chest pass [DH46 | MB | c1 | v5 | T1]; +2. MB scoop toss to the wall [DH47 | MB | c1 | v5 | T1]; *Part B*: 3. copenhagen plank [DH48 | BW | c3 | v1 | CORE]; *OPTIONAL PIECE*: 4. Hang cleans @ 90% [DH50 | BB | c2 | v5 | T2]; *Part C*: 5. front squats/high jumps/hex bar squat jumps/ banded assisted hops [DH51 | BB | c1 | v5 | T2]; +6. half kneeling SA cable lats pull down [DH52 | CBL | c2 | v2 | T4]; *Part D*: 7. SL glute bridge [DH54 | BW | c2 | v2 | T4]; +8. heavy curls [DH55 | DB | c3 | v3 | T5]; +9. db wighted calf raises [DH56 | DB | c3 | v2 | T5]; *Part E*: 10. bike sprint [DH57 | CARDIO | c5 | v5 | COND]

**BLOCK 2 | WEEK 8 | TUESDAY** `02:DJ45:DL58` tiers `1-1-C-2-3-2-4-5-5-K`

*Part A*: 1. A March/ A skips/ A runners [DL46 | BW-bal | c1 | v3 | T1]; 2. Fast run/ walk back or 3 min walk/rest - This is NOT a sprint, this is [DL47 | BW-bal | c1 | v5 | T1]; *Part B*: 3. fast mountain climbers cross connect [DL48 | BW | c2 | v4 | CORE]; *OPTIONAL PIECE*: 4. Hang snatch @ 90% [DL50 | BB | c2 | v5 | T2]; *Part C*: 5. heavy deadlifts [DL51 | BB | c3 | v3 | T3]; +6. fast banded assisted bench press [DL52 | BB | c3 | v4 | T2]; *Part D*: 7. DB alternating Deficit Reverse lunges from plate [DL54 | DB | c2 | v2 | T4]; +8. Cable side raises [DL55 | CBL | c4 | v2 | T5]; 9. rope tricep extension [DL56 | CBL | c4 | v2 | T5]; *Part E*: 10. ski sprints [DL57 | CARDIO | c3 | v5 | COND]

**BLOCK 2 | WEEK 8 | THURSDAY** `02:DN45:DP58` tiers `1-1-C-2-3-4-4-1-5`

*Part A*: 1. half kneeling Rotational med ball slams [DP46 | MB | c1 | v5 | T1]; +2. step back to MB roational chest pass [DP47 | MB | c1 | v5 | T1]; *Part B*: 3. bear crawl [DP48 | BW | c2 | v2 | CORE]; *OPTIONAL PIECE*: 4. Hang cleans @ 90% [DP50 | BB | c2 | v5 | T2]; *Part C*: 5. zercher squat [DP51 | BB | c3 | v2 | T3]; +6. pull ups or banded assisted pull ups [DP52 | BW | c3 | v2 | T4]; *Part D*: 7. staggered stance db deadlift [DP54 | DB | c2 | v2 | T4]; +8. DB ankle hops [DP55 | DB | c1 | v5 | T1]; 9. db alternating hammer curls [DP56 | DB | c3 | v2 | T5]

**BLOCK 2 | WEEK 8 | FRIDAY** `02:DR45:DT58` tiers `1-1-C-1-2-2-2-4-5-5-K`

*Part A*: 1. 2 Single leg hops to 1 SL box jump [DT46 | BW-bal | c1 | v5 | T1]; +2. skater jumps over hurdle [DT47 | BW-bal | c1 | v5 | T1]; *Part B*: 3. cable oblique twists [DT48 | CBL | c3 | v2 | CORE]; +4. Rotational Medicine Ball Scoop Toss [DT49 | MB | c1 | v5 | T1]; *OPTIONAL PIECE*: 5. Hang Snatch @ 90% [DT50 | BB | c2 | v5 | T2]; *Part C*: 6. kb swings heavy [DT51 | KB | c2 | v5 | T2]; +7. sigle arm DB push split jerk [DT52 | DB | c2 | v5 | T2]; *Part D*: 8. kb front rack lateral lunge kb lunges [DT54 | KB | c2 | v2 | T4]; +9. cable overhead tricep extensions [DT55 | CBL | c4 | v2 | T5]; 10. side raises [DT56 | DB | c3 | v2 | T5]; *Part E*: 11. runner sprint [DT57 | BW-bal | c1 | v5 | COND]

**BLOCK 2 | DELOAD WEEK | MONDAY** `02:DX43:DZ58` tiers `1-1-C-3-4-4-5-5-?`

*Part A*: 1. step to chest pass [DZ44 | MB | c1 | v5 | T1]; +2. MB OH toss to rotational scoop [DZ45 | MB | c1 | v5 | T1]; *Part B*: 3. OBLIQUE SIT [DZ46 | BW | c3 | v1 | CORE]; *Part C*: 4. front squats [DZ49 | BB | c3 | v2 | T3]; +5. seal DB row [DZ50 | DB | c3 | v2 | T4]; *Part D*: 6. camporini deadlift [DZ52 | DB | c2 | v2 | T4]; +7. bicep curls [DZ53 | DB | c3 | v2 | T5]; +8. DB calf raises [DZ54 | DB | c3 | v2 | T5]; *Part E*: 9. none [DZ55 | ? | c- | v- | ?]

**BLOCK 2 | DELOAD WEEK | TUESDAY** `02:EB43:ED58` tiers `1-1-1-3-4-4-5-5-?`

*Part A*: 1. single leg hops [ED44 | BW-bal | c1 | v5 | T1]; +2. staggered stace Box jump [ED45 | BW-bal | c1 | v5 | T1]; *Part B*: 3. Facing The Wall MB Rotational Scoop [ED46 | MB | c1 | v5 | T1]; *Part C*: 4. Deadlifts [ED49 | BB | c3 | v2 | T3]; +5. Alternating DB Bench press (botton up) [ED50 | DB | c2 | v2 | T4]; *Part D*: 6. DB step ups [ED52 | DB | c2 | v2 | T4]; +7. OH rope tricep extension [ED53 | CBL | c4 | v2 | T5]; +8. side raises [ED54 | DB | c3 | v2 | T5]; *Part E*: 9. none [ED55 | ? | c- | v- | ?]

**BLOCK 2 | DELOAD WEEK | THURSDAY** `02:EF43:EH58` tiers `1-1-C-4-4-4-5-1-?`

*Part A*: 1. lay down MB presses [EH44 | MB | c1 | v5 | T1]; +2. In-out of hip Rotational medball scoop [EH45 | MB | c1 | v5 | T1]; *Part B*: 3. hallow rocks [EH46 | BW | c4 | v2 | CORE]; *Part C*: 4. goblet squats [EH49 | DB | c3 | v2 | T4]; +5. Close grip cable lat pull down [EH50 | CBL | c4 | v2 | T4]; *Part D*: 6. SL hip thurts march [EH52 | BW | c2 | v2 | T4]; +7. hammer curls [EH53 | DB | c3 | v2 | T5]; +8. ankle hops [EH54 | BW-bal | c1 | v5 | T1]; *Part E*: 9. none [EH55 | ? | c- | v- | ?]

**BLOCK 2 | DELOAD WEEK | FRIDAY** `02:EJ43:EL58` tiers `1-1-C-2-4-4-5-5`

*Part A*: 1. SL hops to plate [EL44 | BW-bal | c1 | v5 | T1]; 2. hurdle hops to box jump [EL45 | BW-bal | c1 | v5 | T1]; *Part B*: 3. windshield wipers [EL46 | BW | c2 | v2 | CORE]; *Part C*: 4. kb swings [EL49 | KB | c2 | v5 | T2]; +5. Single arm DB press [EL50 | DB | c2 | v2 | T4]; *Part D*: 6. slow eccentric deficit Lunges (no weigths) [EL52 | BW | c2 | v1 | T4]; +7. side raises [EL53 | DB | c3 | v2 | T5]; +8. DB tricep extensions [EL54 | DB | c3 | v2 | T5]

**BLOCK 3 | Week 1 | MONDAY** `02:B63:D76` tiers `1-1-C-2-3-4-5-1`

*Part A*: 1. Med ball half kneeling rotationss in & step out [D64 | MB | c1 | v5 | T1]; +2. Stick the landing pushups [D65 | BW-bal | c1 | v5 | T1]; *Part B*: 3. Side planks [D66 | BW | c3 | v1 | CORE]; *Part C*: 4. DB Squat Jumps [D69 | DB | c1 | v5 | T2]; +5. bent over Barbell Row [D70 | BB | c3 | v2 | T3]; *Part D*: 6. Rear foot on wall DB RDL [D72 | DB | c2 | v2 | T4]; +7. Bicep Curls [D73 | DB | c3 | v2 | T5]; +8. Side to side hurdle hops [D74 | BW-bal | c1 | v5 | T1]

**BLOCK 3 | Week 1 | TUESDAY** `02:E63:G76` tiers `1-1-C-3-4-4-5-5-K`

*Part A*: 1. Depth drop [G64 | BW-bal | c1 | v5 | T1]; +2. depth drop to jump [G65 | BW-bal | c1 | v5 | T1]; *Part B*: 3. Hip turns [G66 | BW | c2 | v2 | CORE]; *Part C*: 4. Hex bar deadlift [G69 | BB | c3 | v2 | T3]; +5. DB Bottoms up bench press [G70 | DB | c2 | v2 | T4]; *Part D*: 6. RFE Bulgarian lunge [G72 | DB | c2 | v2 | T4]; +7. Cable tricep ext [G73 | CBL | c4 | v2 | T5]; +8. side raises [G74 | DB | c3 | v2 | T5]; *Part E*: 9. 1x 30 Sec Fast Run [G75 | BW-bal | c1 | v5 | COND]

**BLOCK 3 | Week 1 | THURSDAY** `02:H63:J76` tiers `1-1-C-C-3-4-4-5-5-K`

*Part A*: 1. med ball rotational chest pass [J64 | MB | c1 | v5 | T1]; +2. med ball overhead toss [J65 | MB | c1 | v5 | T1]; *Part B*: 3. butterfly situps [J66 | BW | c4 | v2 | CORE]; +4. toes to bar or knees to chest [J67 | BW | c2 | v2 | CORE]; *Part C*: 5. Back sqaut [J69 | BB | c3 | v2 | T3]; +6. Pull Ups [J70 | BW | c3 | v2 | T4]; *Part D*: 7. camporini dl [J72 | DB | c2 | v2 | T4]; +8. EZ bar Pronated curls [J73 | BB | c3 | v2 | T5]; +9. weighted calf raises [J74 | DB | c3 | v2 | T5]; *Part E*: 10. 1x 30 Sec Fast Run [J75 | BW-bal | c1 | v5 | COND]

**BLOCK 3 | Week 1 | FRIDAY** `02:K63:M76` tiers `1-1-C-1-4-4-4-5-2-K`

*Part A*: 1. Hurdle hops single leg [M64 | BW-bal | c1 | v5 | T1]; +2. 30m acceleration sprint [M65 | BW-bal | c1 | v5 | T1]; *Part B*: 3. Cable load rotation chop [M66 | CBL | c2 | v2 | CORE]; +4. MEd ball scoop [M67 | MB | c1 | v5 | T1]; *Part C*: 5. DB deadlifts [M69 | DB | c3 | v2 | T4]; +6. LAndmine half kneeling press [M70 | BB | c2 | v2 | T4]; *Part D*: 7. FFE ipsilateral lunge [M72 | DB | c2 | v2 | T4]; +8. overhead db tricep ext [M73 | DB | c3 | v2 | T5]; +9. sesaw push press [M74 | DB | c2 | v5 | T2]; *Part E*: 10. 1x 30 Sec Fast Run [M75 | BW-bal | c1 | v5 | COND]

**BLOCK 3 | week 2 | MONDAY** `02:Q63:S76` tiers `1-C-C-C-3-4-5-5-1-K` day tag 'Speed'

*Part A*: 1. overhead toss [S64 | MB | c1 | v5 | T1]; +2. Single side KB carry [S65 | KB | c2 | v1 | CORE]; *Part B*: 3. Copenhagen raises [S66 | BW | c3 | v2 | CORE]; +4. Star plank [S67 | BW | c3 | v1 | CORE]; *Part C*: 5. Heavy front squats [S69 | BB | c3 | v3 | T3]; +6. seal rows [S70 | DB | c4 | v2 | T4]; *Part D*: 7. Glidder hamstring runners [S72 | SLD/SB | c2 | v4 | T5]; +8. incline bicep curls [S73 | DB | c4 | v2 | T5]; +9. DB heavy ankle hops [S74 | DB | c1 | v5 | T1]; *Part E*: 10. 1x 30 Sec Fast Run [S75 | BW-bal | c1 | v5 | COND]

**BLOCK 3 | week 2 | TUESDAY** `02:U63:W76` tiers `1-1-C-C-3-1-4-4-5-5-K` day tag 'strength'

*Part A*: 1. Sit to jump on to box with DBs [W64 | DB | c1 | v5 | T1]; +2. single leg hop on and off to box [W65 | BW-bal | c1 | v5 | T1]; *Part B*: 3. heavy plate russian twists [W66 | PLATE | c2 | v2 | CORE]; +4. Bicycle crunches [W67 | BW | c4 | v2 | CORE]; *Part C*: 5. Barbell deadlift [W69 | BB | c3 | v2 | T3]; +6. Broad jumps [W70 | BW-bal | c1 | v5 | T1]; +7. incline db bench press [W71 | DB | c3 | v2 | T4]; *Part D*: 8. ffe lunges - contralateral loading [W72 | DB | c2 | v2 | T4]; +9. floor db skull crushers [W73 | DB | c4 | v2 | T5]; +10. Side Raises [W74 | DB | c3 | v2 | T5]; *Part E*: 11. 1x 30 Sec Fast Run [W75 | BW-bal | c1 | v5 | COND]

**BLOCK 3 | week 2 | THURSDAY** `02:Y63:AA76` tiers `1-1-C-3-4-5-5-5-K`

*Part A*: 1. situp to chest pass [AA64 | MB | c1 | v5 | T1]; +2. OH Rotational slams [AA65 | MB | c1 | v5 | T1]; *Part B*: 3. 15 Toes to bar [AA66 | BW | c2 | v2 | CORE]; *Part C*: 4. front squat [AA69 | BB | c3 | v2 | T3]; +5. pull ups [AA70 | BW | c3 | v2 | T4]; *Part D*: 6. Banded rolling hamstring curls [AA72 | BAND | c2 | v2 | T5]; +7. Alternating bicep curls [AA73 | DB | c3 | v2 | T5]; +8. weighted calf raises [AA74 | DB | c3 | v2 | T5]; *Part E*: 9. 1x 30 Sec Fast Run [AA75 | BW-bal | c1 | v5 | COND]

**BLOCK 3 | week 2 | FRIDAY** `02:AC63:AE76` tiers `1-C-C-3-4-4-4-4-K` day tag 'speed'

*Part A*: 1. single leg lateral hops side to side [AE64 | BW-bal | c1 | v5 | T1]; *Part B*: 2. Cable rotational oblique twist [AE66 | CBL | c3 | v4 | CORE]; +3. plate russian twists [AE67 | PLATE | c2 | v2 | CORE]; *Part C*: 4. Band ressisted deadlifts [AE69 | BB | c3 | v2 | T3]; +5. half kneeling landmine press [AE70 | BB | c2 | v2 | T4]; *Part D*: 6. ipsilateral kb front rack step up [AE72 | KB | c2 | v2 | T4]; +7. offset pushups [AE73 | BW | c2 | v2 | T4]; +8. bent over sesaw rows [AE74 | DB | c2 | v2 | T4]; *Part E*: 9. 1x 30 Sec Fast Run [AE75 | BW-bal | c1 | v5 | COND]

**BLOCK 3 | Week 3 | MONDAY** `02:AH63:AJ76` tiers `1-1-C-3-3-4-5-1-K`

*Part A*: 1. skater jumps with MB rotations [AJ64 | MB | c1 | v5 | T1]; +2. Stick the landing pushups [AJ65 | BW-bal | c1 | v5 | T1]; *Part B*: 3. Side planks hips lifts (slow) [AJ66 | BW | c3 | v1 | CORE]; *Part C*: 4. fron squats [AJ69 | BB | c3 | v2 | T3]; +5. bent over Barbell Row [AJ70 | BB | c3 | v2 | T3]; *Part D*: 6. Rear foot on wall DB RDL [AJ72 | DB | c2 | v2 | T4]; +7. Bicep Curls [AJ73 | DB | c3 | v2 | T5]; +8. Side to side hurdle hops [AJ74 | BW-bal | c1 | v5 | T1]; *Part E*: 9. 1x 30 Sec Fast Run [AJ75 | BW-bal | c1 | v5 | COND]

**BLOCK 3 | Week 3 | TUESDAY** `02:AK63:AM76` tiers `1-1-1-C-3-4-4-5-5-K`

*Part A*: 1. Depth drop [AM64 | BW-bal | c1 | v5 | T1]; +2. depth drop to jump [AM65 | BW-bal | c1 | v5 | T1]; +3. hurdles hops [AM66 | BW-bal | c1 | v5 | T1]; *Part B*: 4. cross body mountain climbers [AM67 | BW | c2 | v2 | CORE]; *Part C*: 5. Hex bar deadlift [AM69 | BB | c3 | v2 | T3]; +6. DB Bottoms up bench press [AM70 | DB | c2 | v2 | T4]; *Part D*: 7. RFE Bulgarian lunge [AM72 | DB | c2 | v2 | T4]; +8. Cable tricep ext [AM73 | CBL | c4 | v2 | T5]; +9. side raises [AM74 | DB | c3 | v2 | T5]; *Part E*: 10. 1x 30 Sec Fast Run [AM75 | BW-bal | c1 | v5 | COND]

**BLOCK 3 | Week 3 | THURSDAY** `02:AN63:AP76` tiers `1-1-C-C-3-5-4-5-5-K`

*Part A*: 1. med ball rotational chest pass [AP64 | MB | c1 | v5 | T1]; +2. half kneeling med ball side slam [AP65 | MB | c1 | v5 | T1]; *Part B*: 3. low plank feet against wall [AP66 | BW | c3 | v1 | CORE]; +4. toes to bar or knees to chest [AP67 | BW | c2 | v2 | CORE]; *Part C*: 5. Back sqaut [AP69 | BB | c3 | v2 | T3]; +6. LAT PULL OVERS [AP70 | CBL | c4 | v2 | T5]; *Part D*: 7. camporini dl [AP72 | DB | c2 | v2 | T4]; +8. cable bicep curls [AP73 | CBL | c4 | v2 | T5]; +9. weighted calf raises [AP74 | DB | c3 | v2 | T5]; *Part E*: 10. 1x 30 Sec Fast Run [AP75 | BW-bal | c1 | v5 | COND]

**BLOCK 3 | Week 3 | FRIDAY** `02:AQ63:AS76` tiers `1-1-C-1-2-4-4-5-5`

*Part A*: 1. side to side hops single leg [AS64 | BW-bal | c1 | v5 | T1]; +2. 30m acceleration sprint [AS65 | BW-bal | c1 | v5 | T1]; *Part B*: 3. Cable load rotation chop [AS66 | CBL | c2 | v2 | CORE]; +4. MEd ball scoop [AS67 | MB | c1 | v5 | T1]; *Part C*: 5. KB swings [AS69 | KB | c2 | v5 | T2]; +6. arnold presses [AS70 | DB | c3 | v2 | T4]; *Part D*: 7. FFE ipsilateral reverse lunge [AS72 | DB | c2 | v2 | T4]; +8. overhead band tricep ext [AS73 | BAND | c3 | v2 | T5]; +9. front/side db rises [AS74 | DB | c3 | v2 | T5]

**BLOCK 3 | week 4 | MONDAY** `02:AV63:AX76` tiers `1-1-C-C-3-4-4-5-1-K` day tag 'Speed'

*Part A*: 1. MB scoops to the wall [AX64 | MB | c1 | v5 | T1]; +2. plyo push ups [AX65 | BW-bal | c1 | v5 | T1]; *Part B*: 3. oblique sit [AX66 | BW | c3 | v1 | CORE]; +4. Star plank [AX67 | BW | c3 | v1 | CORE]; *Part C*: 5. Heavy front squats [AX69 | BB | c3 | v3 | T3]; +6. heavy DB rows [AX70 | DB | c3 | v3 | T4]; *Part D*: 7. Staggered stance double rack deadlifts [AX72 | DB | c2 | v2 | T4]; +8. Z bar bicep curls [AX73 | BB | c3 | v2 | T5]; +9. DB heavy ankle hops [AX74 | DB | c1 | v5 | T1]; *Part E*: 10. 1x 30 Sec Fast Run [AX75 | BW-bal | c1 | v5 | COND]

**BLOCK 3 | week 4 | TUESDAY** `02:AZ63:BB76` tiers `1-1-C-C-3-4-4-5-5-K` day tag 'strength'

*Part A*: 1. SL hurdle hops [BB64 | BW-bal | c1 | v5 | T1]; +2. SL box jump [BB65 | BW-bal | c1 | v5 | T1]; *Part B*: 3. winshield wiper [BB66 | BW | c2 | v2 | CORE]; +4. PLANK DB PULL THROUGH [BB67 | DB | c2 | v2 | CORE]; *Part C*: 5. banded Barbell deadlift [BB69 | BB | c3 | v2 | T3]; +6. incline db bench press [BB70 | DB | c3 | v2 | T4]; *Part D*: 7. db lateral lunge [BB72 | DB | c2 | v2 | T4]; +8. db tricep kick backs [BB73 | DB | c3 | v2 | T5]; +9. Side Raises FULL ROM [BB74 | DB | c3 | v2 | T5]; *Part E*: 10. 1x 30 Sec Fast Run [BB75 | BW-bal | c1 | v5 | COND]

**BLOCK 3 | week 4 | THURSDAY** `02:BD63:BF76` tiers `1-1-C-C-2-4-4-5-5-K`

*Part A*: 1. step to chest pass [BF64 | MB | c1 | v5 | T1]; +2. OH Rotational slams [BF65 | MB | c1 | v5 | T1]; *Part B*: 3. feet against wall plank [BF66 | BW | c3 | v1 | CORE]; +4. weighted sit ups [BF67 | LOAD? | c4 | v2 | CORE]; *Part C*: 5. kb squat cleans [BF69 | KB | c2 | v5 | T2]; +6. Chin-ups [BF70 | BW | c3 | v2 | T4]; *Part D*: 7. SL Glute bridge Marchs [BF72 | BW | c2 | v2 | T4]; +8. Alternating bicep curls [BF73 | DB | c3 | v2 | T5]; +9. weighted calf raises [BF74 | DB | c3 | v2 | T5]; *Part E*: 10. 1x 30 Sec Fast Run [BF75 | BW-bal | c1 | v5 | COND]

**BLOCK 3 | week 4 | FRIDAY** `02:BH63:BJ76` tiers `1-1-C-3-4-4-5-2-K` day tag 'speed'

*Part A*: 1. A Marches, A skips, A runners [BJ64 | BW-bal | c1 | v4 | T1]; 2. Acceleration sprints [BJ65 | BW-bal | c1 | v5 | T1]; *Part B*: 3. Hanging knees side to side raises [BJ66 | BW | c2 | v2 | CORE]; *Part C*: 4. Banded deadlifts [BJ69 | BB | c3 | v2 | T3]; +5. Seesaw shoulder presses [BJ70 | DB | c2 | v2 | T4]; *Part D*: 6. MB rotational Alternating FFE Reverse lunge [BJ72 | MB | c2 | v2 | T4]; +7. Tríceps dips [BJ73 | BW | c3 | v2 | T5]; +8. KB high pull [BJ74 | KB | c2 | v5 | T2]; *Part E*: 9. 1x 30 Sec Fast Run [BJ75 | BW-bal | c1 | v5 | COND]

**BLOCK 3 | WEEK 5 | MONDAY** `02:BM63:BO76` tiers `1-1-C-2-4-5-5-1-K` day tag 'Speed'

*Part A*: 1. sit up to chest pass [BO64 | MB | c1 | v5 | T1]; +2. band assisted jumping pushups [BO65 | BAND | c1 | v5 | T1]; *Part B*: 3. copenhagen plank [BO66 | BW | c3 | v1 | CORE]; *Part C*: 4. Hex bar squat jumps [BO69 | BB | c1 | v5 | T2]; +5. seal rows 10 reps all rounds [BO70 | DB | c4 | v2 | T4]; *Part D*: 6. fast hamstring curls sliders [BO72 | SLD/SB | c2 | v4 | T5]; +7. heavy Bicep hammer Curls [BO73 | DB | c3 | v3 | T5]; +8. highest ankle hops [BO74 | BW-bal | c1 | v5 | T1]; *Part E*: 9. 2x 15 cal bike sprint [BO75 | CARDIO | c5 | v5 | COND]

**BLOCK 3 | WEEK 5 | TUESDAY** `02:BQ63:BS76` tiers `1-1-C-1-3-4-4-5-5` day tag 'strength'

*Part A*: 1. Depth drop - single leg [BS64 | BW-bal | c1 | v5 | T1]; +2. lateral hop to plate single leg [BS65 | BW-bal | c1 | v5 | T1]; *Part B*: 3. Cable rotational oblique twist [BS66 | CBL | c3 | v4 | CORE]; +4. lateral hinge to MB scoop [BS67 | MB | c1 | v5 | T1]; *Part C*: 5. Barbell deadlift [BS69 | BB | c3 | v2 | T3]; +6. top down db bench press [BS70 | DB | c3 | v2 | T4]; *Part D*: 7. DB reverse lunges [BS72 | DB | c2 | v2 | T4]; +8. tricep kickbacks [BS73 | DB | c3 | v2 | T5]; +9. side raises [BS74 | DB | c3 | v2 | T5]

**BLOCK 3 | WEEK 5 | THURSDAY** `02:BU63:BW76` tiers `1-1-C-3-5-4-5-5-K`

*Part A*: 1. step forward chest pass [BW64 | MB | c1 | v5 | T1]; +2. MB slams [BW65 | MB | c1 | v5 | T1]; *Part B*: 3. 15 toes to bar [BW66 | BW | c2 | v2 | CORE]; *Part C*: 4. front squat slow [BW69 | BB | c3 | v1 | T3]; +5. Cable lat pull over [BW70 | CBL | c4 | v2 | T5]; *Part D*: 6. camporini dl [BW72 | DB | c2 | v2 | T4]; +7. EZ bar Pronated curls [BW73 | BB | c3 | v2 | T5]; +8. weighted calf raises [BW74 | DB | c3 | v2 | T5]; *Part E*: 9. 3x 10 cal row sprint or ski [BW75 | CARDIO | c4 | v5 | COND]

**BLOCK 3 | WEEK 5 | FRIDAY** `02:BY63:CA76` tiers `1-1-C-1-2-4-1-5-4` day tag 'speed'

*Part A*: 1. single leg hops forward & back [CA64 | BW-bal | c1 | v5 | T1]; +2. SL broad jumps [CA65 | BW-bal | c1 | v5 | T1]; *Part B*: 3. plate russian twists [CA66 | PLATE | c2 | v2 | CORE]; +4. kneeling rotational OH MB slam [CA67 | MB | c1 | v5 | T1]; *Part C*: 5. KB swings [CA69 | KB | c2 | v5 | T2]; +6. inclined db bench press [CA70 | DB | c3 | v2 | T4]; *Part D*: 7. alternating split stance jumps FFE (box) [CA72 | BW-bal | c1 | v5 | T1]; +8. tate press [CA73 | DB | c4 | v2 | T5]; +9. sesaw shoulder presses [CA74 | DB | c2 | v2 | T4]

**BLOCK 3 | WEEK 6 | MONDAY** `02:CE63:CG76` tiers `1-1-C-3-4-4-5-5-K`

*Part A*: 1. Rotational chest pass [CG64 | MB | c1 | v5 | T1]; +2. Overhead toss [CG65 | MB | c1 | v5 | T1]; *Part B*: 3. Side plank [CG66 | BW | c3 | v1 | CORE]; *Part C*: 4. barbell High zercher squat [CG69 | BB | c3 | v2 | T3]; +5. Heavy DB row [CG70 | DB | c3 | v3 | T4]; *Part D*: 6. Staggered stance DB dl [CG72 | DB | c2 | v2 | T4]; +7. EZ bar curls [CG73 | BB | c3 | v2 | T5]; +8. DB calf raises [CG74 | DB | c3 | v2 | T5]; *Part E*: 9. 1 X 12 Cal bike sprint [CG75 | CARDIO | c5 | v5 | COND]

**BLOCK 3 | WEEK 6 | TUESDAY** `02:CI63:CK76` tiers `1-1-C-3-4-4-5-5-K`

*Part A*: 1. Hurdle hops [CK64 | BW-bal | c1 | v5 | T1]; +2. Single leg hop on/off plate forward and back [CK65 | BW-bal | c1 | v5 | T1]; *Part B*: 3. plank Hip turns [CK66 | BW | c2 | v2 | CORE]; *Part C*: 4. Deadlifts [CK69 | BB | c3 | v2 | T3]; +5. db Bench press (small incline) [CK70 | DB | c3 | v2 | T4]; *Part D*: 6. High zercher DB RFE Lunge front foot on ramp [CK72 | DB | c2 | v2 | T4]; +7. Floor tricep DB skull crushers [CK73 | DB | c4 | v2 | T5]; +8. Side raises [CK74 | DB | c3 | v2 | T5]; *Part E*: 9. 1 X 12 Cal skierg sprint [CK75 | CARDIO | c3 | v5 | COND]

**BLOCK 3 | WEEK 6 | THURSDAY** `02:CM63:CO76` tiers `1-1-C-1-3-4-5-5-K`

*Part A*: 1. Medball Chest pass [CO64 | MB | c1 | v5 | T1]; +2. Rotational medball scoop [CO65 | MB | c1 | v5 | T1]; *Part B*: 3. med ball rockers [CO66 | MB | c3 | v2 | CORE]; *Part C*: 4. SQUAT JUMPS [CO69 | BW-bal | c1 | v5 | T1]; +5. Close grip cable lat pull down [CO70 | CBL | c4 | v3 | T3]; *Part D*: 6. Staggered stance DB dl - Medial pressure - contralateral loading [CO72 | DB | c2 | v2 | T4]; +7. Alternating bicep ahmmer curls [CO73 | DB | c3 | v2 | T5]; +8. DB calf raises [CO74 | DB | c3 | v2 | T5]; *Part E*: 9. 1 X 12 Cal row sprint [CO75 | CARDIO | c4 | v5 | COND]

**BLOCK 3 | WEEK 6 | FRIDAY** `02:CQ63:CS76` tiers `1-1-C-2-2-2-5-5`

*Part A*: 1. High knee tuck in jumps [CS64 | BW-bal | c1 | v5 | T1]; +2. ankle hops [CS65 | BW-bal | c1 | v5 | T1]; *Part B*: 3. Swissball plate rotations [CS66 | PLATE | c2 | v2 | CORE]; *Part C*: 4. BANDED KB SWINGS [CS69 | KB | c2 | v5 | T2]; +5. Single arm DB push press [CS70 | DB | c2 | v5 | T2]; *Part D*: 6. Suitcase DB RFE lunge jumps [CS72 | DB | c1 | v5 | T2]; +7. Cable tricep extensions [CS73 | CBL | c4 | v2 | T5]; +8. bent over db Reverse flies [CS74 | DB | c3 | v2 | T5]

**BLOCK 3 | WEEK 7 (04/17 TO 04/21) | MONDAY** `02:CW62:CY76` tiers `1-1-C-2-4-5-1-5-K` day tag 'Speed'

*Part A*: 1. sit up to chest pass [CY63 | MB | c1 | v5 | T1]; +2. jumping pushups [CY64 | BW-bal | c1 | v5 | T1]; *Part B*: 3. Obilque sit plank [CY65 | BW | c3 | v1 | CORE]; *Part C*: 4. Hex bar squat jumps [CY67 | BB | c1 | v5 | T2]; +5. seal rows 10 reps all rounds [CY69 | DB | c4 | v2 | T4]; *Part D*: 6. HAMSTRING SLIDERS RUNNERS [CY70 | SLD/SB | c2 | v4 | T5]; +7. highest ankle hops [CY71 | BW-bal | c1 | v5 | T1]; +8. Bicep hammer Curls [CY72 | DB | c3 | v2 | T5]; *Part E*: 9. 2x 15 cal bike sprint [CY74 | CARDIO | c5 | v5 | COND]

**BLOCK 3 | WEEK 7 (04/17 TO 04/21) | TUESDAY** `02:DA62:DC76` tiers `1-1-C-1-3-4-4-5-5` day tag 'strength'

*Part A*: 1. Depth drop - single leg [DC63 | BW-bal | c1 | v5 | T1]; +2. lateral hop to plate single leg [DC64 | BW-bal | c1 | v5 | T1]; *Part B*: 3. Cable rotational oblique twist [DC65 | CBL | c3 | v4 | CORE]; +4. MB ROTATIONAL CHEST PASS [DC66 | MB | c1 | v5 | T1]; *Part C*: 5. Barbell deadlift [DC68 | BB | c3 | v2 | T3]; +6. top down db bench press [DC69 | DB | c3 | v2 | T4]; *Part D*: 7. DB reverse lunges [DC71 | DB | c2 | v2 | T4]; +8. tricep kickbacks [DC72 | DB | c3 | v2 | T5]; +9. side raises [DC73 | DB | c3 | v2 | T5]

**BLOCK 3 | WEEK 7 (04/17 TO 04/21) | THURSDAY** `02:DE62:DG76` tiers `1-C-3-5-4-5-5-K`

*Part A*: 1. step forward chest pass [DG63 | MB | c1 | v5 | T1]; *Part B*: 2. TOES TO BAR [DG65 | BW | c2 | v2 | CORE]; *Part C*: 3. SLOW FRONT SQUATS [DG68 | BB | c3 | v1 | T3]; +4. Cable lat pull over [DG69 | CBL | c4 | v2 | T5]; *Part D*: 5. camporini dl [DG71 | DB | c2 | v2 | T4]; +6. EZ bar Pronated curls [DG72 | BB | c3 | v2 | T5]; +7. weighted calf raises [DG73 | DB | c3 | v2 | T5]; *Part E*: 8. 3x 10 cal row sprint or ski [DG74 | CARDIO | c4 | v5 | COND]

**BLOCK 3 | WEEK 7 (04/17 TO 04/21) | FRIDAY** `02:DI62:DK76` tiers `1-1-C-C-2-2-1-5-2` day tag 'speed'

*Part A*: 1. single leg hops forward & back [DK63 | BW-bal | c1 | v5 | T1]; +2. BOX JUMPS [DK64 | BW-bal | c1 | v5 | T1]; *Part B*: 3. WINDSHIELD WIPERS [DK65 | BW | c2 | v4 | CORE]; +4. CROSSING MOUNTAIN CLIMBERS [DK66 | BW | c2 | v2 | CORE]; *Part C*: 5. FAST BANDED DEADLFTS [DK68 | BB | c3 | v4 | T2]; +6. DB HEAVY PUSH PRESS [DK69 | DB | c2 | v5 | T2]; *Part D*: 7. SPLIT STANCE SQUAT JUMPS [DK71 | BW-bal | c1 | v5 | T1]; +8. tate press [DK72 | DB | c4 | v2 | T5]; +9. DB HIGH PULL [DK73 | DB | c2 | v5 | T2]

**BLOCK 3 | WEEK 8 | MONDAY** `02:DO62:DQ76` tiers `1-1-C-C-3-3-4-5-5-K`

*Part A*: 1. Rotational chest pass [DQ63 | MB | c1 | v5 | T1]; +2. Overhead toss [DQ64 | MB | c1 | v5 | T1]; *Part B*: 3. copenhagen plank [DQ65 | BW | c3 | v1 | CORE]; +4. hips raises [DQ66 | BW | c4 | v2 | CORE]; *Part C*: 5. back squats [DQ68 | BB | c3 | v2 | T3]; +6. barbell row [DQ69 | BB | c3 | v2 | T3]; *Part D*: 7. Staggered stance DB dl [DQ71 | DB | c2 | v2 | T4]; +8. EZ bar curls [DQ72 | BB | c3 | v2 | T5]; +9. DB calf raises [DQ73 | DB | c3 | v2 | T5]; *Part E*: 10. 1 X 12 Cal bike sprint [DQ74 | CARDIO | c5 | v5 | COND]

**BLOCK 3 | WEEK 8 | TUESDAY** `02:DS62:DU76` tiers `1-1-C-1-3-4-4-5-5-K`

*Part A*: 1. Hurdle hops [DU63 | BW-bal | c1 | v5 | T1]; +2. box jumps [DU64 | BW-bal | c1 | v5 | T1]; *Part B*: 3. plank Hip turns [DU65 | BW | c2 | v2 | CORE]; +4. half kneeling MB side slams [DU66 | MB | c1 | v5 | T1]; *Part C*: 5. Deadlifts [DU68 | BB | c3 | v2 | T3]; +6. db Bench press (small incline) [DU69 | DB | c3 | v2 | T4]; *Part D*: 7. High zercher DB RFE Lunge front foot on ramp [DU71 | DB | c2 | v2 | T4]; +8. tricep dips [DU72 | BW | c3 | v2 | T5]; +9. cable Side raises [DU73 | CBL | c4 | v2 | T5]; *Part E*: 10. 1 X 12 Cal skierg sprint [DU74 | CARDIO | c3 | v5 | COND]

**BLOCK 3 | WEEK 8 | THURSDAY** `02:DW62:DY76` tiers `1-1-C-2-3-4-5-1-K`

*Part A*: 1. OH MB SLAMS [DY63 | MB | c1 | v5 | T1]; +2. Rotational medball scoop [DY64 | MB | c1 | v5 | T1]; *Part B*: 3. med ball rockers [DY65 | MB | c3 | v2 | CORE]; *Part C*: 4. KB HANG SQUAT CLEANS [DY68 | KB | c2 | v5 | T2]; +5. Close grip cable lat pull down [DY69 | CBL | c4 | v3 | T3]; *Part D*: 6. Staggered stance DB dl - Medial pressure - contralateral loading [DY71 | DB | c2 | v2 | T4]; +7. DB BICEPS CURLS [DY72 | DB | c3 | v2 | T5]; +8. ANKLE HOPS [DY73 | BW-bal | c1 | v5 | T1]; *Part E*: 9. 1 X 12 Cal row sprint [DY74 | CARDIO | c4 | v5 | COND]

**BLOCK 3 | WEEK 8 | FRIDAY** `02:EA62:EC76` tiers `1-1-C-C-2-2-4-5-5`

*Part A*: 1. ankle hops [EC63 | BW-bal | c1 | v5 | T1]; +2. JUMPS OVER THE HURDLES [EC64 | BW-bal | c1 | v5 | T1]; *Part B*: 3. WINDSHIELD WIPERS [EC65 | BW | c2 | v2 | CORE]; +4. MOUNTAIN CLIMBERS CROSSING [EC66 | BW | c2 | v2 | CORE]; *Part C*: 5. BANDED KB SWINGS [EC68 | KB | c2 | v5 | T2]; +6. HEAVY DB PUSH PRESS [EC69 | DB | c2 | v5 | T2]; *Part D*: 7. STEP UPS TO KNEE DRIVE [EC71 | DB | c2 | v2 | T4]; +8. Cable tricep extensions [EC72 | CBL | c4 | v2 | T5]; +9. bent over db Reverse flies [EC73 | DB | c3 | v2 | T5]

### 4 TRACKS - HYBRID (strength-athletic-crossfitish)

**weeks E:L | WK1 | MONDAY** `04:B74:E79` tiers `3-2-4-?-?`

1. FRONT SQUATS [E74 | BB | c3 | v2 | T3]; 2. 2x 2 clean pulls, 2 power cleans [E75 | BB | c2 | v5 | T2]; 3. UNI RDL/ CORE/ UNI GB [E76 | DB | c2 | v2 | T4]; 4. UPPER ACCESORY [E77 | ? | c- | v- | ?]; 5. UPPER ACCESORY [D78 | ? | c- | v- | ?]

**weeks E:L | WK1 | TUESDAY** `04:B80:E83` tiers `K-4-1-?`

1. 10x15 Sec sprint/30 sec walk [E80 | BW-bal | c1 | v5 | COND]; 2. 3x6 - DB bench press/ core [E81 | DB | c3 | v2 | T4]; 3. Depth drops [E82 | BW-bal | c1 | v5 | T1]; 4. LOWER ACCESORY [D83 | ? | c- | v- | ?]

**weeks E:L | WK1 | THURSDAY** `04:B86:E90` tiers `4-2-4-?`

1. KB DL [E86 | KB | c3 | v2 | T4]; 2. 2x 2 snatch pulls, 2 power snatches [E87 | BB | c2 | v5 | T2]; 3. FE contra/ DB rows/core [E88 | DB | c2 | v2 | T4]; 4. UPPER ACCESORY [D90 | ? | c- | v- | ?]

**weeks E:L | WK1 | FRIDAY** `04:B92:E96` tiers `K-1-4-3-?`

1. 15-40 min constant cardo easy [E92 | CARDIO | c- | v- | COND]; 2. Depth drops [E93 | BW-bal | c1 | v5 | T1]; 3. uni RDL/ core/ OH press [E94 | DB | c2 | v2 | T4]; 4. OH press [D95 | BB | c3 | v2 | T3]; 5. LOWER ACCESORY [E96 | ? | c- | v- | ?]

**weeks E:L | WK1 | SATURDAY** `04:B98:E101` tiers `3-4`

1. BACK SQUATS [E98 | BB | c3 | v2 | T3]; 2. FF & RFE Lunge goblet / T2B/ hand switch pushups [E100 | BW | c2 | v2 | T4]

**weeks E:L | WK2 | MONDAY** `04:B74:F79` tiers `3-2-4-?-?`

1. BACK SQUATS [F74 | BB | c3 | v2 | T3]; 2. 2x 5 heavy touch and go cleans [F75 | BB | c2 | v5 | T2]; 3. UNI RDL/ CORE/ UNI GB [F76 | DB | c2 | v2 | T4]; 4. UPPER ACCESORY [F77 | ? | c- | v- | ?]; 5. UPPER ACCESORY [D78 | ? | c- | v- | ?]

**weeks E:L | WK2 | TUESDAY** `04:B80:F83` tiers `K-4-1-?`

1. 12x 15 sec sprint/ 30 sec walk [F80 | BW-bal | c1 | v5 | COND]; 2. 3x6 db incline bench press/ core [F81 | DB | c3 | v2 | T4]; 3. Weighted depth drops [F82 | LOAD? | c1 | v5 | T1]; 4. LOWER ACCESORY [D83 | ? | c- | v- | ?]

**weeks E:L | WK2 | THURSDAY** `04:B86:F90` tiers `4-2-4-?`

1. KB DL [F86 | KB | c3 | v2 | T4]; 2. 2x 5 heavy touch and go power snatches [F87 | BB | c2 | v5 | T2]; 3. FFE ipsi/ DB rows/ core [F88 | DB | c2 | v2 | T4]; 4. UPPER ACCESORY [D90 | ? | c- | v- | ?]

**weeks E:L | WK2 | FRIDAY** `04:B92:F96` tiers `K-1-4-3-?`

1. 15-40 min constant cardo easy [F92 | CARDIO | c- | v- | COND]; 2. Weighted depth drops [F93 | LOAD? | c1 | v5 | T1]; 3. uni RDL/ core/ OH press [F94 | DB | c2 | v2 | T4]; 4. OH press [D95 | BB | c3 | v2 | T3]; 5. LOWER ACCESORY [F96 | ? | c- | v- | ?]

**weeks E:L | WK2 | SATURDAY** (identical in: weeks E:L WK6) `04:B98:F101` tiers `3-4`

1. FRONT SQUATS [F98 | BB | c3 | v2 | T3]; 2. FF & RFE Lunge double dbs/ jumping pull ups/ db push press [F100 | DB | c2 | v2 | T4]

**weeks E:L | WK3 | MONDAY** `04:B74:G79` tiers `3-2-4-?-?`

1. FRONT SQUATS [G74 | BB | c3 | v2 | T3]; 2. 2x 3 clean pulls heavy [G75 | BB | c2 | v5 | T2]; 3. UNI RDL/ CORE/ UNI GB [G76 | DB | c2 | v2 | T4]; 4. UPPER ACCESORY [G77 | ? | c- | v- | ?]; 5. UPPER ACCESORY [D78 | ? | c- | v- | ?]

**weeks E:L | WK3 | TUESDAY** `04:B80:G83` tiers `K-3-1-?`

1. 15 x 15 sec sprint/ 30 sec walk [G80 | BW-bal | c1 | v5 | COND]; 2. 3x8 - barbell bench press/ core [G81 | BB | c3 | v2 | T3]; 3. depth drop to jump [G82 | BW-bal | c1 | v5 | T1]; 4. LOWER ACCESORY [D83 | ? | c- | v- | ?]

**weeks E:L | WK3 | THURSDAY** `04:B86:G90` tiers `3-2-4-?`

1. HEX BAR OR DB DL [G86 | BB | c3 | v2 | T3]; 2. 2x 3 snatch pulls heavy [G87 | BB | c2 | v5 | T2]; 3. FF & RFE ipsi/ DB rows/ core [G88 | DB | c2 | v2 | T4]; 4. UPPER ACCESORY [D90 | ? | c- | v- | ?]

**weeks E:L | WK3 | FRIDAY** `04:B92:G96` tiers `K-1-4-3-?`

1. 15-40 min constant cardo easy [G92 | CARDIO | c- | v- | COND]; 2. depth drop to jump [G93 | BW-bal | c1 | v5 | T1]; 3. uni RDL/ core/ OH press [G94 | DB | c2 | v2 | T4]; 4. OH press [D95 | BB | c3 | v2 | T3]; 5. LOWER ACCESORY [G96 | ? | c- | v- | ?]

**weeks E:L | WK3 | SATURDAY** (identical in: weeks E:L WK7) `04:B98:G101` tiers `3-4`

1. BACK SQUATS [G98 | BB | c3 | v2 | T3]; 2. FF & RFE Lunge/ T2B/ db bench press [G100 | DB | c2 | v2 | T4]

**weeks E:L | WK4 | MONDAY** `04:B74:H79` tiers `3-2-4-?-?`

1. BACK SQUATS [H74 | BB | c3 | v2 | T3]; 2. 3x 3 heavy power cleans [H75 | BB | c2 | v5 | T2]; 3. UNI RDL/ CORE/ UNI GB [H76 | DB | c2 | v2 | T4]; 4. UPPER ACCESORY [H77 | ? | c- | v- | ?]; 5. UPPER ACCESORY [D78 | ? | c- | v- | ?]

**weeks E:L | WK4 | TUESDAY** `04:B80:H83` tiers `K-3-2-?`

1. 10x 20 sec sprint/ 40 sec walk [H80 | BW-bal | c1 | v5 | COND]; 2. 3x8 - barbell incline bench press/ core [H81 | BB | c3 | v2 | T3]; 3. weighted depth drops to jump [H82 | LOAD? | c1 | v5 | T2]; 4. LOWER ACCESORY [D83 | ? | c- | v- | ?]

**weeks E:L | WK4 | THURSDAY** `04:B86:H90` tiers `3-2-4-?`

1. HEX BAR OR DB DL [H86 | BB | c3 | v2 | T3]; 2. 3x 3 heavy power snatches [H87 | BB | c2 | v5 | T2]; 3. RFE contra/ DB rows/ core [H88 | DB | c2 | v2 | T4]; 4. UPPER ACCESORY [D90 | ? | c- | v- | ?]

**weeks E:L | WK4 | FRIDAY** `04:B92:H96` tiers `K-2-4-3-?`

1. 15-40 min constant cardo easy [H92 | CARDIO | c- | v- | COND]; 2. weighted depth drops to jump [H93 | LOAD? | c1 | v5 | T2]; 3. uni RDL/ core/ OH press [H94 | DB | c2 | v2 | T4]; 4. OH press [D95 | BB | c3 | v2 | T3]; 5. LOWER ACCESORY [H96 | ? | c- | v- | ?]

**weeks E:L | WK4 | SATURDAY** (identical in: weeks E:L WK8) `04:B98:H101` tiers `3-4`

1. FRONT SQUATS [H98 | BB | c3 | v2 | T3]; 2. FF & RFE Lunge double dbs/ pull ups/ db strict press [H100 | DB | c2 | v2 | T4]

**weeks E:L | WK5 | MONDAY** `04:B74:I79` tiers `3-2-4-?-?`

1. FRONT SQUATS [I74 | BB | c3 | v2 | T3]; 2. 4x 2 heavy squat cleans [I75 | BB | c2 | v5 | T2]; 3. UNI RDL/ CORE/ UNI GB [I76 | DB | c2 | v2 | T4]; 4. UPPER ACCESORY [I77 | ? | c- | v- | ?]; 5. UPPER ACCESORY [D78 | ? | c- | v- | ?]

**weeks E:L | WK5 | TUESDAY** `04:B80:I83` tiers `K-4-1-?`

1. 12x20 sec sprint/ 40 sec walk [I80 | BW-bal | c1 | v5 | COND]; 2. 3x10 DB bench press/ core [I81 | DB | c3 | v2 | T4]; 3. box jumps [I82 | BW-bal | c1 | v5 | T1]; 4. LOWER ACCESORY [D83 | ? | c- | v- | ?]

**weeks E:L | WK5 | THURSDAY** `04:B86:I90` tiers `3-2-4-?`

1. BARBELL DL [I86 | BB | c3 | v2 | T3]; 2. 4x 2 heavy squat snatches [I87 | BB | c2 | v5 | T2]; 3. RFE ipsi/ DB rows/ core [I88 | DB | c2 | v2 | T4]; 4. UPPER ACCESORY [D90 | ? | c- | v- | ?]

**weeks E:L | WK5 | FRIDAY** (identical in: weeks E:L WK6) `04:B92:I96` tiers `K-1-4-3-?`

1. 15-40 min constant cardo easy [I92 | CARDIO | c- | v- | COND]; 2. box jump [I93 | BW-bal | c1 | v5 | T1]; 3. uni RDL/ core/ OH press [I94 | DB | c2 | v2 | T4]; 4. OH press [D95 | BB | c3 | v2 | T3]; 5. LOWER ACCESORY [I96 | ? | c- | v- | ?]

**weeks E:L | WK5 | SATURDAY** `04:B98:I101` tiers `3-4`

1. BACK SQUATS [I98 | BB | c3 | v2 | T3]; 2. FF & RFE Lunge goblet / T2B/ pushups [I100 | BW | c2 | v2 | T4]

**weeks E:L | WK6 | MONDAY** `04:B74:J79` tiers `3-2-4-?-?`

1. BACK SQUATS [J74 | BB | c3 | v2 | T3]; 2. 2x 3 heavy clean pulls [J75 | BB | c2 | v5 | T2]; 3. UNI RDL/ CORE/ UNI GB [J76 | DB | c2 | v2 | T4]; 4. UPPER ACCESORY [J77 | ? | c- | v- | ?]; 5. UPPER ACCESORY [D78 | ? | c- | v- | ?]

**weeks E:L | WK6 | TUESDAY** `04:B80:J83` tiers `K-4-1-?`

1. 15x 20 sec sprint/40 sec walk [J80 | BW-bal | c1 | v5 | COND]; 2. 3x10 DB incline press/ core [J81 | DB | c3 | v2 | T4]; 3. box jumps [J82 | BW-bal | c1 | v5 | T1]; 4. LOWER ACCESORY [D83 | ? | c- | v- | ?]

**weeks E:L | WK6 | THURSDAY** `04:B86:J90` tiers `4-2-4-?`

1. KB DL [J86 | KB | c3 | v2 | T4]; 2. 2x 3 heavy snatch pulls [J87 | BB | c2 | v5 | T2]; 3. FF & RFE dcontra/ DB rows/ core [J88 | DB | c2 | v2 | T4]; 4. UPPER ACCESORY [D90 | ? | c- | v- | ?]

**weeks E:L | WK7 | MONDAY** `04:B74:K79` tiers `3-2-4-?-?`

1. FRONT SQUATS [K74 | BB | c3 | v2 | T3]; 2. 2x3 heavy squat cleans [K75 | BB | c2 | v5 | T2]; 3. UNI RDL/ CORE/ UNI GB [K76 | DB | c2 | v2 | T4]; 4. UPPER ACCESORY [K77 | ? | c- | v- | ?]; 5. UPPER ACCESORY [D78 | ? | c- | v- | ?]

**weeks E:L | WK7 | TUESDAY** `04:B80:K83` tiers `K-3-1-?`

1. 5x 30 sec fast/ 2 min walk [K80 | ? | c1 | v5 | COND]; 2. 4x6 bb bench/ core [K81 | BB | c3 | v2 | T3]; 3. repeat hurdle hops [K82 | BW-bal | c1 | v5 | T1]; 4. LOWER ACCESORY [D83 | ? | c- | v- | ?]

**weeks E:L | WK7 | THURSDAY** `04:B86:K90` tiers `3-2-4-?`

1. HEX BAR OR DB DL [K86 | BB | c3 | v2 | T3]; 2. 2x3 heavy power snatches [K87 | BB | c2 | v5 | T2]; 3. RFE contra/ DB rows/ core [K88 | DB | c2 | v2 | T4]; 4. UPPER ACCESORY [D90 | ? | c- | v- | ?]

**weeks E:L | WK7 | FRIDAY** (identical in: weeks E:L WK8) `04:B92:K96` tiers `K-1-4-3-?`

1. 15-40 min constant cardo easy [K92 | CARDIO | c- | v- | COND]; 2. repeat hurdle hops [K93 | BW-bal | c1 | v5 | T1]; 3. uni RDL/ core/ OH press [K94 | DB | c2 | v2 | T4]; 4. OH press [D95 | BB | c3 | v2 | T3]; 5. LOWER ACCESORY [K96 | ? | c- | v- | ?]

**weeks E:L | WK8 | MONDAY** `04:B74:L79` tiers `3-2-4-?-?`

1. BACK SQUATS [L74 | BB | c3 | v2 | T3]; 2. 2x 1 heavy squat clean [L75 | BB | c2 | v5 | T2]; 3. UNI RDL/ CORE/ UNI GB [L76 | DB | c2 | v2 | T4]; 4. UPPER ACCESORY [L77 | ? | c- | v- | ?]; 5. UPPER ACCESORY [D78 | ? | c- | v- | ?]

**weeks E:L | WK8 | TUESDAY** `04:B80:L83` tiers `K-3-1-?`

1. 10x 30 sec fastest/ 2 min walk [L80 | ? | c1 | v5 | COND]; 2. 4x8/ bb incline bench/ core [L81 | BB | c3 | v2 | T3]; 3. repeat hurdle hops [L82 | BW-bal | c1 | v5 | T1]; 4. LOWER ACCESORY [D83 | ? | c- | v- | ?]

**weeks E:L | WK8 | THURSDAY** `04:B86:L90` tiers `3-2-4-?`

1. BARBELL DL [L86 | BB | c3 | v2 | T3]; 2. 2x 1 heavy power snatches [L87 | BB | c2 | v5 | T2]; 3. RFE ipsi/ DB rows/ core [L88 | DB | c2 | v2 | T4]; 4. UPPER ACCESORY [D90 | ? | c- | v- | ?]

### BOXING 8 WEEK BUILD UP

**Weeks 1-2 | Week 1-2 | MONDAY OFF SEASON WORK** `07:A7:D14` tiers `K-C-3-3-4-4-5-5`

1. 20 sec fast/ 40 sec slow (cardio of choice) [D7 | CARDIO | c- | v4 | COND]; 2. Situps / Toes to bar [D8 | BW | c2 | v2 | CORE]; 3. Front Squats [D9 | BB | c3 | v2 | T3]; 4. Deadlifts [D10 | BB | c3 | v2 | T3]; 5. Reverse Lunges [D11 | DB | c2 | v2 | T4]; 6. Single LEG Rdl [D12 | DB | c2 | v2 | T4]; 7. Leg curls [D13 | MACH | c5 | v2 | T5]; 8. Leg Extentions [D14 | MACH | c5 | v2 | T5]

**Weeks 1-2 | Week 1-2 | TUESDAY OFF SEASON WORK** `07:A19:D25` tiers `1-4-4-4-4-5-5`

1. *MEDBALLS [D19 | MB | c1 | v5 | T1]; 2. Db Bench PRess [D20 | DB | c3 | v2 | T4]; 3. Lat pull downs/pullups [D21 | CBL | c4 | v2 | T4]; 4. Db OVerhead press [D22 | DB | c3 | v2 | T4]; 5. DB seal rows [D23 | DB | c4 | v2 | T4]; 6. Db Curls [D24 | DB | c3 | v2 | T5]; 7. Db floor skull crushers [D25 | DB | c4 | v2 | T5]

**Weeks 1-2 | Week 1-2 | THURSDAY OFF SEASON WORK** `07:A31:D37` tiers `C-3-3-4-4-5-5`

1. Situps/crunches [D31 | BW | c4 | v2 | CORE]; 2. Front Squats [D32 | BB | c3 | v2 | T3]; 3. Deadlifts [D33 | BB | c3 | v2 | T3]; 4. Reverse Lunges [D34 | DB | c2 | v2 | T4]; 5. Single LEG Rdl [D35 | DB | c2 | v2 | T4]; 6. LEg curls [D36 | MACH | c5 | v2 | T5]; 7. Leg Extentions [D37 | MACH | c5 | v2 | T5]

**Weeks 1-2 | Week 1-2 | FRIDAY OFF SEASON WORK** `07:A44:D49` tiers `K-C-4-4-4-4`

1. Easy cardio of choice (steady pace) [D44 | CARDIO | c- | v- | COND]; 2. Russian twists/ 30/30 Side planks [D45 | BW | c2 | v1 | CORE]; 3. Db Bench PRess [D46 | DB | c3 | v2 | T4]; 4. Lat pull downs/pullups [D47 | CBL | c4 | v2 | T4]; 5. Db OVerhead press [D48 | DB | c3 | v2 | T4]; 6. DB seal rows [D49 | DB | c4 | v2 | T4]

**Weeks 3-8 | Week 3-8 | MONDAY OFF SEASON WORK** `07:E7:L14` tiers `1-1-1-2-4-3-4-5`

1. *MEDBALLS [L7 | MB | c1 | v5 | T1]; 2. Weighted Depth Drops [L8 | LOAD? | c1 | v5 | T1]; 3. Single Leg to high march jump [L9 | BW-bal | c1 | v5 | T1]; 4. Clean Pull/ hang Power Clean [L10 | BB | c2 | v5 | T2]; 5. Lateral box step up IPSILATERAL LOAD [L11 | DB | c2 | v2 | T4]; 6. DEADLIFTS (1-2RIR) + 3 min Jump Rope [L12 | BB | c3 | v3 | T3]; 7. Copenhagen Plank & Unilateral DL [L13 | DB | c2 | v2 | T4]; 8. Leg ext. Leg Curls (FULL RANGE OF MOTION) [L14 | MACH | c5 | v2 | T5]

**Weeks 3-8 | Week 3-8 | TUESDAY OFF SEASON WORK** `07:E19:L25` tiers `K-4-2-2-4`

1. Cardio of any choice [L19 | CARDIO | c- | v- | COND]; 2. Single Leg swiss ball knee tuck in + DB rows [L20 | DB | c3 | v2 | T4]; 3. DB snatches [L21 | DB | c2 | v5 | T2]; 4. 3 Heavy SQUATs + 5 Tuck jumps + 5 DB squat jumps + 5 Squirrel jumps [L22 | BB | c1 | v5 | T2]; 5. Jefferson Lunge [L23 | DB | c2 | v2 | T4]

**Weeks 3-8 | Week 3-8 | THURSDAY OFF SEASON WORK** `07:E31:L37` tiers `1-1-5-1-2-4-5`

1. *MEDBALLS [L31 | MB | c1 | v5 | T1]; 2. Squirrel jumps single leg (REVERSE BANDED) [L32 | BAND | c1 | v5 | T1]; 3. Side Raises + Front Raises [L33 | DB | c3 | v2 | T5]; 4. 8 Box Med Ball rocker into 4 hops + Swiss ball knee tuck ins [L34 | MB | c1 | v5 | T1]; 5. Hang Power Clean & Press [L35 | BB | c2 | v5 | T2]; 6. Weighted Bulgarian Lunge Heel held up + SL Def. Weighted Calf Raises [L36 | LOAD? | c2 | v2 | T4]; 7. Leg ext. Leg Curls (FULL RANGE OF MOTION) [L37 | MACH | c5 | v2 | T5]

**Weeks 3-8 | Week 3-8 | FRIDAY OFF SEASON WORK** `07:E44:L49` tiers `K-1-2-4-5`

1. Sprint 20/ Recover 40 [L44 | BW-bal | c1 | v5 | COND]; 2. Drop into Box Jumps + 20/20 Star Toe touches [L45 | BW-bal | c1 | v5 | T1]; 3. 4 Deadlifts - 5 broad jumps - 5 KB swings - 5/5 High Knee runs [L46 | BB | c1 | v5 | T2]; 4. Db contralateral LOW step up [L47 | DB | c2 | v2 | T4]; 5. Slider Runners + Slider Hamstring Runners [L48 | SLD/SB | c2 | v4 | T5]

### CROSSFIT SPLIT

**COMPETE CROSSFIT SPLIT (monthly grid) | JUNE | MON** (identical in: COMPETE CROSSFIT SPLIT (monthly grid) JULY; COMPETE CROSSFIT SPLIT (monthly grid) OCTOBER) `11:B29:B35` tiers `K-3-4`

1. AEROBIC C.: YES [B29 | CARDIO | c- | v- | COND]; 2. STRENGTH: KNEE DOM [B31 | BB | c3 | v3 | T3]; 3. RESISTANCE: LB [B33 | ? | c- | v2 | T4]

**COMPETE CROSSFIT SPLIT (monthly grid) | AUGUST | MON** `11:B49:B55` tiers `K-2`

1. AEROBIC C.: YES [B49 | CARDIO | c- | v- | COND]; 2. POWER: SNATCH [B52 | BB | c2 | v5 | T2]

**COMPETE CROSSFIT SPLIT (monthly grid) | SEPTEMBER | MON** `11:B59:B65` tiers `K-2-K`

1. AEROBIC C.: YES [B59 | CARDIO | c- | v- | COND]; 2. POWER: SNATCH [B62 | BB | c2 | v5 | T2]; 3. WODs: YES [B64 | ? | c- | v4 | COND]

**COMPETE CROSSFIT SPLIT (monthly grid) | NOVEMBER | MON** `11:B79:B85` tiers `K-3-4-K`

1. AEROBIC C.: YES [B79 | CARDIO | c- | v- | COND]; 2. STRENGTH: KNEE DOM [B81 | BB | c3 | v3 | T3]; 3. RESISTANCE: LB [B83 | ? | c- | v2 | T4]; 4. WODs: YES [B84 | ? | c- | v4 | COND]

**COMPETE CROSSFIT SPLIT (monthly grid) | DECEMBER | MON** `11:B89:B95` tiers `K-S-2-K`

1. AEROBIC C.: YES [B89 | CARDIO | c- | v- | COND]; 2. SKILL: H.S./ DUBS [B90 | ? | c2 | v2 | SKILL]; 3. POWER: SNATCH [B92 | BB | c2 | v5 | T2]; 4. WODs: YES [B94 | ? | c- | v4 | COND]

**COMPETE CROSSFIT SPLIT (monthly grid) | JANUARY | MON** `11:B99:B105` tiers `K-S-K`

1. AEROBIC C.: YES [B99 | CARDIO | c- | v- | COND]; 2. SKILL: H.S./ DUBS [B100 | ? | c2 | v2 | SKILL]; 3. WODs: YES [B104 | ? | c- | v4 | COND]

**COMPETE CROSSFIT SPLIT (monthly grid) | FEB | MON** `11:B109:B115` tiers `4`

1. RESISTANCE: LB [B113 | ? | c- | v2 | T4]

**COMPETE CROSSFIT SPLIT (monthly grid) | MARCH | MON** (identical in: COMPETE CROSSFIT SPLIT (monthly grid) APRIL) `11:B119:B125` tiers `K-3-2-4`

1. AEROBIC C.: YES [B119 | CARDIO | c- | v- | COND]; 2. STRENGTH: KNEE DOM [B121 | BB | c3 | v3 | T3]; 3. POWER: SNATCH [B122 | BB | c2 | v5 | T2]; 4. RESISTANCE: LB [B123 | ? | c- | v2 | T4]

**COMPETE CROSSFIT SPLIT (monthly grid) | MAY | MON** `11:B139:B145` tiers `K-K`

1. AEROBIC C.: YES [B139 | CARDIO | c- | v- | COND]; 2. WODs: YES [B144 | ? | c- | v4 | COND]

**COMPETE CROSSFIT SPLIT (monthly grid) | JUNE | TUESD** `11:C29:C35` tiers `S-3-4`

1. SKILL: T2B/ DUBS [C30 | BW | c2 | v2 | SKILL]; 2. STRENGTH: PULL [C31 | BB | c3 | v3 | T3]; 3. RESISTANCE: UB [C33 | ? | c- | v2 | T4]

**COMPETE CROSSFIT SPLIT (monthly grid) | JULY | TUESD** (identical in: COMPETE CROSSFIT SPLIT (monthly grid) NOVEMBER) `11:C39:C45` tiers `S-3-4-K`

1. SKILL: T2B/ DUBS [C40 | BW | c2 | v2 | SKILL]; 2. STRENGTH: PULL [C41 | BB | c3 | v3 | T3]; 3. RESISTANCE: UB [C43 | ? | c- | v2 | T4]; 4. WODs: YES [C44 | ? | c- | v4 | COND]

**COMPETE CROSSFIT SPLIT (monthly grid) | AUGUST | TUESD** `11:C49:C55` tiers `2-K`

1. POWER: CLEAN [C52 | BB | c2 | v5 | T2]; 2. WODs: YES [C54 | ? | c- | v4 | COND]

**COMPETE CROSSFIT SPLIT (monthly grid) | SEPTEMBER | TUESD** `11:C59:C65` tiers `K-2-K`

1. AEROBIC C.: YES [C59 | CARDIO | c- | v- | COND]; 2. POWER: CLEAN [C62 | BB | c2 | v5 | T2]; 3. WODs: YES [C64 | ? | c- | v4 | COND]

**COMPETE CROSSFIT SPLIT (monthly grid) | OCTOBER | TUESD** `11:C69:C75` tiers `3-4-K`

1. STRENGTH: PULL [C71 | BB | c3 | v3 | T3]; 2. RESISTANCE: UB [C73 | ? | c- | v2 | T4]; 3. WODs: YES [C74 | ? | c- | v4 | COND]

**COMPETE CROSSFIT SPLIT (monthly grid) | DECEMBER | TUESD** `11:C89:C95` tiers `K-S-2-K`

1. AEROBIC C.: YES [C89 | CARDIO | c- | v- | COND]; 2. SKILL: T2B/ DUBS [C90 | BW | c2 | v2 | SKILL]; 3. POWER: CLEAN [C92 | BB | c2 | v5 | T2]; 4. WODs: YES [C94 | ? | c- | v4 | COND]

**COMPETE CROSSFIT SPLIT (monthly grid) | JANUARY | TUESD** `11:C99:C105` tiers `S-K`

1. SKILL: T2B/ DUBS [C100 | BW | c2 | v2 | SKILL]; 2. WODs: YES [C104 | ? | c- | v4 | COND]

**COMPETE CROSSFIT SPLIT (monthly grid) | FEB | TUESD** `11:C109:C115` tiers `4`

1. RESISTANCE: UB [C113 | ? | c- | v2 | T4]

**COMPETE CROSSFIT SPLIT (monthly grid) | MARCH | TUESD** `11:C119:C125` tiers `S-3-2-4`

1. SKILL: T2B/ DUBS [C120 | BW | c2 | v2 | SKILL]; 2. STRENGTH: PULL [C121 | BB | c3 | v3 | T3]; 3. POWER: CLEAN [C122 | BB | c2 | v5 | T2]; 4. RESISTANCE: UB [C123 | ? | c- | v2 | T4]

**COMPETE CROSSFIT SPLIT (monthly grid) | APRIL | TUESD** `11:C129:C135` tiers `S-3-2-4-K`

1. SKILL: T2B/ DUBS [C130 | BW | c2 | v2 | SKILL]; 2. STRENGTH: PULL [C131 | BB | c3 | v3 | T3]; 3. POWER: CLEAN [C132 | BB | c2 | v5 | T2]; 4. RESISTANCE: UB [C133 | ? | c- | v2 | T4]; 5. WODs: YES [C134 | ? | c- | v4 | COND]

**COMPETE CROSSFIT SPLIT (monthly grid) | JUNE | THURS** (identical in: COMPETE CROSSFIT SPLIT (monthly grid) JULY; COMPETE CROSSFIT SPLIT (monthly grid) OCTOBER; COMPETE CROSSFIT SPLIT (monthly grid) NOVEMBER) `11:E29:E35` tiers `K-3-4`

1. AEROBIC C.: YES [E29 | CARDIO | c- | v- | COND]; 2. STRENGTH: HIP DOM [E31 | BB | c3 | v3 | T3]; 3. RESISTANCE: LB [E33 | ? | c- | v2 | T4]

**COMPETE CROSSFIT SPLIT (monthly grid) | AUGUST | THURS** `11:E49:E55` tiers `K-2`

1. AEROBIC C.: YES [E49 | CARDIO | c- | v- | COND]; 2. POWER: SNATCH [E52 | BB | c2 | v5 | T2]

**COMPETE CROSSFIT SPLIT (monthly grid) | SEPTEMBER | THURS** `11:E59:E65` tiers `K-2-K`

1. AEROBIC C.: YES [E59 | CARDIO | c- | v- | COND]; 2. POWER: SNATCH [E62 | BB | c2 | v5 | T2]; 3. WODs: YES [E64 | ? | c- | v4 | COND]

**COMPETE CROSSFIT SPLIT (monthly grid) | DECEMBER | THURS** `11:E89:E95` tiers `K-S-2-K`

1. AEROBIC C.: YES [E89 | CARDIO | c- | v- | COND]; 2. SKILL: T2B/ DUBS [E90 | BW | c2 | v2 | SKILL]; 3. POWER: SNATCH [E92 | BB | c2 | v5 | T2]; 4. WODs: YES [E94 | ? | c- | v4 | COND]

**COMPETE CROSSFIT SPLIT (monthly grid) | JANUARY | THURS** `11:E99:E105` tiers `K-S-K`

1. AEROBIC C.: TYES [E99 | CARDIO | c- | v- | COND]; 2. SKILL: T2B/ DUBS [E100 | BW | c2 | v2 | SKILL]; 3. WODs: YES [E104 | ? | c- | v4 | COND]

**COMPETE CROSSFIT SPLIT (monthly grid) | FEB | THURS** `11:E109:E115` tiers `4`

1. RESISTANCE: LB [E113 | ? | c- | v2 | T4]

**COMPETE CROSSFIT SPLIT (monthly grid) | MARCH | THURS** (identical in: COMPETE CROSSFIT SPLIT (monthly grid) APRIL) `11:E119:E125` tiers `K-3-2-4`

1. AEROBIC C.: YES [E119 | CARDIO | c- | v- | COND]; 2. STRENGTH: HIP DOM [E121 | BB | c3 | v3 | T3]; 3. POWER: SNATCH [E122 | BB | c2 | v5 | T2]; 4. RESISTANCE: LB [E123 | ? | c- | v2 | T4]

**COMPETE CROSSFIT SPLIT (monthly grid) | MAY | THURS** `11:E139:E145` tiers `K-K`

1. AEROBIC C.: YES [E139 | CARDIO | c- | v- | COND]; 2. WODs: YES [E144 | ? | c- | v4 | COND]

**COMPETE CROSSFIT SPLIT (monthly grid) | JUNE | FRID** `11:F29:F35` tiers `S-3-4`

1. SKILL: H.S./ DUBS [F30 | ? | c2 | v2 | SKILL]; 2. STRENGTH: PUSH [F31 | BB | c3 | v3 | T3]; 3. RESISTANCE: UB [F33 | ? | c- | v2 | T4]

**COMPETE CROSSFIT SPLIT (monthly grid) | JULY | FRID** (identical in: COMPETE CROSSFIT SPLIT (monthly grid) NOVEMBER) `11:F39:F45` tiers `S-3-4-K`

1. SKILL: H.S./ DUBS [F40 | ? | c2 | v2 | SKILL]; 2. STRENGTH: PUSH [F41 | BB | c3 | v3 | T3]; 3. RESISTANCE: UB [F43 | ? | c- | v2 | T4]; 4. WODs: YES [F44 | ? | c- | v4 | COND]

**COMPETE CROSSFIT SPLIT (monthly grid) | AUGUST | FRID** (identical in: COMPETE CROSSFIT SPLIT (monthly grid) SEPTEMBER) `11:F49:F55` tiers `2-K`

1. POWER: CLEAN [F52 | BB | c2 | v5 | T2]; 2. WODs: YES [F54 | ? | c- | v4 | COND]

**COMPETE CROSSFIT SPLIT (monthly grid) | OCTOBER | FRID** `11:F69:F75` tiers `3-4-K`

1. STRENGTH: PUSH [F71 | BB | c3 | v3 | T3]; 2. RESISTANCE: UB [F73 | ? | c- | v2 | T4]; 3. WODs: YES [F74 | ? | c- | v4 | COND]

**COMPETE CROSSFIT SPLIT (monthly grid) | DECEMBER | FRID** `11:F89:F95` tiers `S-2-K`

1. SKILL: H.S./ DUBS [F90 | ? | c2 | v2 | SKILL]; 2. POWER: CLEAN [F92 | BB | c2 | v5 | T2]; 3. WODs: YES [F94 | ? | c- | v4 | COND]

**COMPETE CROSSFIT SPLIT (monthly grid) | JANUARY | FRID** `11:F99:F105` tiers `S-K`

1. SKILL: H.S./ DUBS [F100 | ? | c2 | v2 | SKILL]; 2. WODs: YES [F104 | ? | c- | v4 | COND]

**COMPETE CROSSFIT SPLIT (monthly grid) | FEB | FRID** `11:F109:F115` tiers `4`

1. RESISTANCE: UB [F113 | ? | c- | v2 | T4]

**COMPETE CROSSFIT SPLIT (monthly grid) | MARCH | FRID** `11:F119:F125` tiers `S-3-2-4`

1. SKILL: H.S./ DUBS [F120 | ? | c2 | v2 | SKILL]; 2. STRENGTH: PUSH [F121 | BB | c3 | v3 | T3]; 3. POWER: CLEAN [F122 | BB | c2 | v5 | T2]; 4. RESISTANCE: UB [F123 | ? | c- | v2 | T4]

**COMPETE CROSSFIT SPLIT (monthly grid) | APRIL | FRID** `11:F129:F135` tiers `S-3-2-4-K`

1. SKILL: H.S./ DUBS [F130 | ? | c2 | v2 | SKILL]; 2. STRENGTH: PUSH [F131 | BB | c3 | v3 | T3]; 3. POWER: CLEAN [F132 | BB | c2 | v5 | T2]; 4. RESISTANCE: UB [F133 | ? | c- | v2 | T4]; 5. WODs: YES [F134 | ? | c- | v4 | COND]

**COMPETE CROSSFIT SPLIT (monthly grid) | AUGUST | SAT** (identical in: COMPETE CROSSFIT SPLIT (monthly grid) SEPTEMBER; COMPETE CROSSFIT SPLIT (monthly grid) NOVEMBER; COMPETE CROSSFIT SPLIT (monthly grid) DECEMBER) `11:G49:G55` tiers `K`

1. AEROBIC C.: YES [G49 | CARDIO | c- | v- | COND]

**COMPETE CROSSFIT SPLIT (monthly grid) | MAY | SAT** `11:G139:G145` tiers `K-K`

1. AEROBIC C.: YES [G139 | CARDIO | c- | v- | COND]; 2. WODs: YES [G144 | ? | c- | v4 | COND]

**CLASS PROGRAMMING SPLIT (P1) | template | MON** `11:Q12:Q16` tiers `S-3-K`

1. SKILLS: DUBS [Q15 | CARDIO | c2 | v2 | SKILL]; 2. STRNGTH: SQUAT [Q13 | BB | c3 | v3 | T3]; 3. AEROBIC CAPACITY: LVL 4 [Q16 | CARDIO | c- | v- | COND]

**CLASS PROGRAMMING SPLIT (P1) | template | TUES** `11:R12:R16` tiers `3-2`

1. STRNGTH: PRESS [R13 | BB | c3 | v3 | T3]; 2. PWR: SNATCH [R14 | BB | c2 | v5 | T2]

**CLASS PROGRAMMING SPLIT (P1) | template | WED** `11:S12:S16` tiers ``



**CLASS PROGRAMMING SPLIT (P1) | template | THURS** `11:T12:T16` tiers `S-3-K`

1. SKILLS: GYMNASTICS [T15 | BW | c2 | v2 | SKILL]; 2. STRNGTH: DEADLIFT [T13 | BB | c3 | v3 | T3]; 3. AEROBIC CAPACITY: LVL 3 [T16 | CARDIO | c- | v- | COND]

**CLASS PROGRAMMING SPLIT (P1) | template | FRID** `11:U12:U16` tiers `2`

1. PWR: CLEAN [U14 | BB | c2 | v5 | T2]

**CLASS PROGRAMMING SPLIT (P1) | template | SAT** `11:V12:V16` tiers ``



