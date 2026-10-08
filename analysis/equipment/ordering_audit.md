# Exercise ORDER audit: every session in BYOP (00-08) and MASTER MODEL (00, 01, 02, 04, 05, 06, 07, 11, 12)

Team: EQUIPMENT USAGE & TRAINING VARIABLES. Question: in what order does the coach put exercises inside a session and vectors across a week, and do his stated rules hold in his own sheets?

**Evidence legend.** **OBSERVED** = read from a cell, label or count (cell refs given). **INFERRED** = my interpretation. **SCIENCE** = training-science rationale, not from the sheets. Coach labels are quoted verbatim, typos included ('Tripple Extension', 'ABdution', 'Sagital core', 'DEAFLITS', 'RECCOMENDED').

**Files.** `ordering_audit.json` (machine-readable: every session, every item with tags, every exception) and the scripts that produce it: `ordering_extract.py` (reads `raw/*.xlsx`, read-only), `ordering_classify.py` (tagging), `ordering_tag.py`, `ordering_rules.py`, `ordering_audit.py`, `ordering_report.py`. Re-run with `.venv/bin/python analysis/equipment/ordering_audit.py && .venv/bin/python analysis/equipment/ordering_report.py`. No Google Sheet was touched.

## 0. Method

* **Unit = one session as written**: one day x one week-column x one level-column. 466 sessions in total (+8 FAT BURN circuit sessions under B36 'CIRCUITS RECCOMENDED', listed in section 4.4 and kept out of the R1-R10 denominators because stations rotate). Week columns that repeat the same order are counted once per column because each column is a separate prescription. The number of *distinct* orderings is shown next to each tab so repetition does not inflate anything.
* **BYOP templates**: every slot counts even when the EXERCISE cell still reads 'CHOOSE 👇'. The coach's CATEGORY/PURPOSE label *is* the design (OBSERVED). The few filled demo cells ('Leg press', 'Power Clean', 'Front Squats', ...) are quoted where relevant.
* **Tagging**: when the coach labelled the slot I use his label (BYOP CATEGORY; BASEBALL row labels 'bkd', 'horiz pull', 'Upper Ballistics/plyo', 'LATERAL CORE', ...; HYBRID B/D labels). Otherwise I tag from the exercise name (INFERRED, keyword rules plus about 100 hand overrides in `ordering_classify.py`). Classes: PLYO_L, PLYO_U (med-ball throws and plyo push-ups), SPRINT, COD, DRILL, OLY, LOADED_JUMP, BKD/BHD/UKD/UHD (bilateral/unilateral knee/hip dominant), HPULL/VPULL/HPUSH/VPUSH, ISO_* (quad, ham, calf, chest, delt, bicep, tricep), CORE, COND, WARMUP/MOBILITY. 'Incline' and 'Dips' count as horizontal push because BYOP PPL wires both slots to the 'HORIZONTAL PUSH' list (E5:E7 -> `'MASTER EXERCISE LIBRARY'!$AD$7:$AD$162`, OBSERVED).
* **ROLE vs movement.** For the pairing and alternation rules (R8, R9) I use the coach's slot pattern (ROLE). Example: 'DB Squat Jumps' typed in a 'bkd' row counts as the knee-dominant lift of that superset. Every other rule uses the movement actually written.
* **BASEBALL labels.** Week 1 of BLOCK 1 and Weeks 1 and 3 of BLOCK 3 have no label column; it holds the previous day's exercises. For those I take each row's modal label from the sibling weeks that share the same header row (INFERRED, flagged `slot_borrowed` in the JSON).

### 0.1 Session inventory

| Tab | Sessions audited | Distinct orderings | Layout |
|---|---:|---:|---|
| BYOP 00 AESTHETICS 4D ('AESTHETICS - FULL BODY - 4 DAYS') | 6 | 3 | Day 1-4 + 2 'Optional' blocks (A3:A44) |
| BYOP 01 3 DAY BUILDER ('3 DAY BUILDER') | 6 | 4 | DAY 1-3 + 3 'Optional' blocks (A3:A32) |
| BYOP 02 PPL ('PUSHPULLLEGS - 3 or 6 DAYS A WK') | 6 | 3 | MONDAY-Saturday, SUNDAY 'OFF' (B3:B51) |
| BYOP 03 ATHLETIC 4D ('ATHLETIC - FULL BODY - 4 DAYS A') | 6 | 3 | MON, TUE, WED (optional), [blank B30], FRI, SAT (optional) |
| BYOP 04 JUSTICE LEAGUE ('JUSTICE LEAGUE') | 6 | 3 | copy of 03 with demo picks + logbook columns H-K |
| BYOP 05 BOOTCAMP 1 ('BOOTCAMP - OPTION 1') | 6 | 3 | MON-SAT, WED/SAT optional (B3:B44) |
| BYOP 06 BOOTCAMP 2 ('BOOTCAMP - OPTION 2') | 6 | 3 | 1A/2A/3A/1B/2B/3B (A1 reads 'BOOTCAMP OPTION 1') |
| BYOP 07 NO-ACCESS AESTHETICS ('NO ACCESS - AESTHETICS - FB - 4') | 6 | 3 | hidden twin of 00 laid out MON-SAT |
| BYOP 08 NO-ACCESS ATHLETIC ('NO ACCESS - ATHLETIC - FB - 4 t') | 6 | 3 | hidden twin of 03 |
| MM 00 UPPER/LOWER ('EXAMPLE UPPERLOWER SPLIT') | 6 | 2 | LOWER (ADAY) + UPPER (BDAY) x 3 levels |
| MM 01 FAT BURN ('EXAMPLE FAT BURNBODY TONING PRO') | 24 | 7 | MON/TUE/THU/FRI lifting + WED/SAT cardio x WK1-4 |
| MM 02 BASEBALL ('BASEBALL') | 96 | 74 | BLOCK 1-3 x 8 weeks x MON/TUE/THU/FRI |
| MM 04 4 TRACKS ('(NOT DONE) 4 TRACKS PROGRAMMING') | 230 | 39 | STRENGTH (7+12 wk), AESTHETICS (7+12 wk), HYBRID (8 wk) |
| MM 05 ATHLETIC FB ('EXAMPLE ATHLETIC FULL BODY SPLI') | 11 | 11 | 11 'WORKOUT' blocks in 3 levels |
| MM 06 PPL ('EXAMPLE PUSHPULLLEGS SPLIT') | 9 | 3 | PUSH/PULL/LEG x 3 levels |
| MM 07 BOXING ('EXAMPLE BOXING 8 WEEK BUILD UP') | 8 | 8 | MON/TUE/THU/FRI x (Wk1-2 col D, Wk3-8 col L) |
| MM 12 CONJUGATE ('(NOT DONE) EXAMPLE CONJUGATE') | 28 | 12 | MON/WED/THU/SAT x WK1-7 (WK8 'TEST'/'DELOAD' has no exercises) |
| MM 11 CROSSFIT ('EXAMPLE CROSSFIT SPLIT') | 0 (category grid only) | - | monthly MON-SUN grids of AEROBIC C./SKILL/STRENGTH/POWER/RESISTANCE/WODs/TEST-PEAK; used for R11 and N15 |

## 1. Scorecard

| Rule | Applicable sessions | Compliant | % | Where it holds | Where it breaks |
|---|---:|---:|---:|---|---|
| **R1** horizontal pull before vertical pull in the same session | 67 | 19 | 28% | every BYOP template, MM UPPER/LOWER, MM PPL (19 of 19) | FAT BURN 0/8, 4 TRACKS 0/38, BOXING 0/2: lat pulldown written before the row |
| **R2** horizontal push before vertical push in the same session | 49 | 29 | 59% | all of BYOP, UPPER/LOWER, FAT BURN, BOXING | CONJUGATE and 4-TRACKS STRENGTH overhead-press weeks; 4-TRACKS AESTHETICS 'Arnold press' weeks |
| **R3** athletic/power work (plyo, med ball, sprint, COD, jumps) before strength | 155 | 128 | 83% | BYOP athletic templates 12/12; CONJUGATE 7/7; BASEBALL 77/92 | contrast complexes (heavy -> jump); jumps or plyo push-ups typed in BASEBALL strength slots; HYBRID Tuesday puts 'JUMPS' after 'BENCH PRESS' |
| **R4** power-strength / Olympic / triple-extension before heavy strength | 78 | 49 | 63% | BYOP 'Tripple Extension' slot 12/12; BASEBALL 32/40 (the 'OLY' rows always sit above 'bkd'/'bhd') | HYBRID (B74 'STRENGTH' row above B75 'OLY/ POWER') 16/16; snatch or high pull as a BASEBALL 'shoulders' accessory |
| **R5** bilateral before unilateral of the same region | 231 | 225 | 97% | almost universal | 4-TRACKS AESTHETICS Fri WK9-12 (myo leg press last); MM 05 Camporini; BOXING step-up before deadlift |
| **R6** compound before isolation | 301 | 227 | 75% | UPPER/LOWER, athletic BYOP, CONJUGATE | BYOP aesthetics 'Calves' in slot 1; 4-TRACKS AESTHETICS side raises first on push days; MM PPL side/rear raises between compounds |
| **R7** big muscles before small muscles | 244 | 178 | 73% | same pattern as R6 | same as R6, plus the BYOP Bicep slot before Leg Extensions |
| **R8** alternate lower / upper (full-body sessions) | 193 | 165 | 85% | BASEBALL 91/92; BYOP 4-day full-body 100% | CONJUGATE / 4-TRACKS STRENGTH lower days (two lower lifts back to back); BOOTCAMP 2 'LUU' |
| **R9** knee-dominant paired with pull, hip-dominant paired with push | 193 | 160 | 83% | BASEBALL 92/92; BYOP 00, 03, 04, 07, 08 100% | BOOTCAMP 1 Tue/Fri, 3 DAY BUILDER Day 3, HYBRID, CONJUGATE lower days |
| **R10-core** core at the end of the session or on a separate day | 165 | 22 | 13% | aesthetic/BYOP: core sits on the 'Optional' days | athletic: core is Part B right after the power block (BASEBALL 112 items) or a superset partner (HYBRID '/ core') |
| **R10-conditioning** conditioning at the end of the session or on a separate day | 121 | 107 | 88% | BASEBALL 'Buy out' always last (65/65); cardio days | BOXING (cardio first, 4/4), HYBRID Fri 'DISTANCE' first, BOOTCAMP 2 3A/3B |
| **R11** weekly vector rotation | 29 program/level blocks | - | - | see section 3 | - |

**Overall verdict (INFERRED from the counts):** the rules the coach stated hold almost perfectly in the BYOP workbook (the MAIN, generator-facing templates) and in the BASEBALL athlete program. They break in a few specific, repeatable ways in the older MASTER MODEL examples. The breaks are themselves rules: a weekly A/B swap of the lead lift, pre-exhaust side raises in bodybuilding push days, contrast complexes, core as Part B in athletic days, and the conjugate 'work -> accessory' order.

## 2. Rule by rule

### R1. Horizontal pull before vertical pull

*Operational test:* session holds at least one HPULL and one VPULL; compliant if the first HPULL is above the first VPULL. 'Strict' (every HPULL above every VPULL): 19.

**Result: 19 / 67 applicable sessions compliant (28%); 48 exception sessions.**

| Tab | Applicable | Compliant | % |
|---|---:|---:|---:|
| BYOP 00 AESTHETICS 4D | 2 | 2 | 100% |
| BYOP 01 3 DAY BUILDER | 1 | 1 | 100% |
| BYOP 02 PPL | 2 | 2 | 100% |
| BYOP 03 ATHLETIC 4D | 2 | 2 | 100% |
| BYOP 04 JUSTICE LEAGUE | 2 | 2 | 100% |
| BYOP 07 NO-ACCESS AESTHETICS | 2 | 2 | 100% |
| BYOP 08 NO-ACCESS ATHLETIC | 2 | 2 | 100% |
| MM 00 UPPER/LOWER | 3 | 3 | 100% |
| MM 01 FAT BURN | 8 | 0 | 0% |
| MM 04 4 TRACKS | 38 | 0 | 0% |
| MM 06 PPL | 3 | 3 | 100% |
| MM 07 BOXING | 2 | 0 | 0% |

* **OBSERVED, BYOP holds 100%.** Every full-body template puts the 'Horizontal Pull' row directly under the bilateral lower row and the 'Vertical Pull' row under the unilateral lower row: 00 rows 5 -> 7, 01 rows 5 -> 7, 03/04/08 rows 9 -> 11, 07 rows 5 -> 7. BYOP 02 PPL pull day is 'Horizontal Pull' D10, 'Horizontal Pull' D11, 'Vertical Pull' D12. MM UPPER/LOWER upper day runs C28 'Dumbbell Rows' -> C30 'Pull ups or Lat pull down'. MM PPL pull day runs C26 'DB Rows or Row machine' -> C28 'Cable Lat pulldown'.
* **OBSERVED, consistent violators.** (a) FAT BURN upper days (and 4-TRACKS AESTHETICS left, which copies them): the order is push/pull alternating with the planes crossed, H-push -> V-pull -> V-push -> H-pull (D12 'BARBELL BENCH PRESS', D13 'SINGLE ARM LAT PULL DOWN', D14 'DB OVERHEAD PRESS', D15 'MACHINE SUPPORTED ROW'). Weeks 2 and 4 open with the pulldown. (b) 4-TRACKS AESTHETICS right, both pull days, all 12 weeks: O46 'Lat pull downs' -> O47 'Rows'. (c) BOXING Wk1-2 Tue/Fri: D21 'Lat pull downs/pullups' -> D23 'DB seal rows'.
* **INFERRED:** R1 is the rule for the generator's own templates (BYOP). The violators are older, hand-written upper days built on a different principle: alternate push and pull and cross the planes (N9/N18). Ask the coach which one he wants (Q1).

<details><summary>Every exception (tab, day, cells)</summary>

- **MM 01 FAT BURN B4 MUSCLE BUILDING, 'TUESDAY'** (4): [WK 1] V D13 'SINGLE ARM LAT PULL DOWN' before H D15 'MACHINE SUPPORTED ROW'; [WK 2] V G12 'SINGLE ARM LAT PULL DOWN' before H G14 'MACHINE SUPPORTED ROW'; [WK 3] V J13 'LAT PULL DOWN/PULL UP' before H J15 'DB ROWS'; [WK 4] V M12 'LAT PULL DOWN/PULL UP' before H M14 'DB ROWS'
- **MM 01 FAT BURN B4 MUSCLE BUILDING, 'FRIDAY'** (4): [WK 1] V D25 'SINGLE ARM LAT PULL DOWN' before H D27 'MACHINE SUPPORTED ROW'; [WK 2] V G26 'SINGLE ARM LAT PULL DOWN' before H G28 'MACHINE SUPPORTED ROW'; [WK 3] V J25 'LAT PULL DOWN/PULL UP' before H J27 'DB ROWS'; [WK 4] V M26 'SINGLE ARM LAT PULL DOWN' before H M28 'DB ROWS'
- **MM 04 4 TRACKS A30 AESTHETICS left, 'TUESDAY'** (7): [WK1] V E42 'UNILATERAL LAT PULL DOWN' before H E44 'MACHINE SUPPORTED ROW'; [WK2] V F41 'UNILATERAL LAT PULL DOWN' before H F43 'MACHINE SUPPORTED ROW'; [WK3] V G42 'UNILATERAL LAT PULL DOWN' before H G44 'DB ROWS'; [WK4] V H41 'LAT PULL DOWN/PULL UP' before H H43 'DB ROWS'; [WK5] V I42 'UNILATERAL LAT PULL DOWN' before H I44 'MACHINE SUPPORTED ROW'; [WK6] V J41 'LAT PULL DOWN/PULL UP' before H J43 'MACHINE SUPPORTED ROW'; [WK7] V K42 'UNILATERAL LAT PULL DOWN' before H K44 'DB ROWS'
- **MM 04 4 TRACKS A30 AESTHETICS left, 'FRIDAY'** (7): [WK1] V E56 'UNILATERAL LAT PULL DOWN' before H E59 'MACHINE SUPPORTED ROW'; [WK2] V F55 'UNILATERAL LAT PULL DOWN' before H F57 'MACHINE SUPPORTED ROW'; [WK3] V G56 'UNILATERAL' before H G59 'DB ROWS'; [WK4] V H55 'LAT PULL DOWN/PULL UP' before H H57 'DB ROWS'; [WK5] V I56 'LAT PULL DOWN/PULL UP' before H I59 'MACHINE SUPPORTED ROW'; [WK6] V J55 'LAT PULL DOWN/PULL UP' before H J57 'MACHINE SUPPORTED ROW'; [WK7] V K56 'LAT PULL DOWN/PULL UP' before H K59 'DB ROWS'
- **MM 04 4 TRACKS A30 AESTHETICS right, 'WEDNESDAY ' (M49 'PULL')** (12): [WK1 (A WEEK)] V O46 'Lat pull downs' before H O47 'Rows'; [WK2 (B WEEK)] V P46 'Neutral grip lat pull down' before H P47 'machine rows or db rows'; [WK3 (A WEEK)] V Q46 'Lat pull downs' before H Q47 'Rows'; [WK4 (B WEEK)] V R46 'Neutral grip lat pull down' before H R47 'machine rows or db rows'; [WK5 (A WEEK)] V S46 'Lat pull downs' before H S47 'Rows'; [WK6 (BWEEK)] V T46 'Neutral grip lat pull down' before H T47 'machine rows or db rows'; [WK7 (A WEEK LOWER)] V U46 'Lat pull downs' before H U47 'Rows'; [WK8] V V46 'Neutral grip lat pull down' before H V47 'machine rows or db rows'; [WK9] V W46 'Neutral grip lat pull down' before H W47 'machine rows or db rows'; [WK10] V X46 'Neutral grip lat pull down' before H X47 'machine rows or db rows'; [WK11] V Y46 'Neutral grip lat pull down' before H Y47 'machine rows or db rows'; [WK12] V Z46 'Neutral grip lat pull down' before H Z47 'machine rows or db rows'
- **MM 04 4 TRACKS A30 AESTHETICS right, 'SATURDAY' (M64 'PULL')** (12): [WK1 (A WEEK)] V O62 'Lat pull downs' before H O63 'Rows'; [WK2 (B WEEK)] V P62 'Neutral grip lat pull down' before H P63 'machine rows or db rows'; [WK3 (A WEEK)] V Q62 'Lat pull downs' before H Q63 'Rows'; [WK4 (B WEEK)] V R62 'Neutral grip lat pull down' before H R63 'machine rows or db rows'; [WK5 (A WEEK)] V S62 'Lat pull downs' before H S63 'Rows'; [WK6 (BWEEK)] V T62 'Neutral grip lat pull down' before H T63 'machine rows or db rows'; [WK7 (A WEEK LOWER)] V U62 'Lat pull downs' before H U63 'Rows'; [WK8] V V62 'Neutral grip lat pull down' before H V63 'machine rows or db rows'; [WK9] V W62 'Neutral grip lat pull down' before H W63 'machine rows or db rows (5 sets - 15/12/12/12/10)'; [WK10] V X62 'Neutral grip lat pull down' before H X63 'machine rows or db rows (5 sets - 15/12/12/12/10)'; [WK11] V Y62 'Neutral grip lat pull down' before H Y63 'machine rows or db rows (5 sets - 15/12/12/12/10)'; [WK12] V Z62 'Neutral grip lat pull down' before H Z63 'machine rows or db rows (5 sets - 15/12/12/12/10)'
- **MM 07 BOXING, 'TUESDAY OFF SEASON WORK'** (1): [Week 1-2 (col D)] V D21 'Lat pull downs/pullups' before H D23 'DB seal rows'
- **MM 07 BOXING, 'FRIDAY OFF SEASON WORK'** (1): [Week 1-2 (col D)] V D47 'Lat pull downs/pullups' before H D49 'DB seal rows'

</details>

### R2. Horizontal push before vertical push

*Operational test:* session holds at least one HPUSH (incl. incline and dips) and one VPUSH; compliant if the first HPUSH is above the first VPUSH. Strict: 27.

**Result: 29 / 49 applicable sessions compliant (59%); 22 exception sessions.**

| Tab | Applicable | Compliant | % |
|---|---:|---:|---:|
| BYOP 00 AESTHETICS 4D | 2 | 2 | 100% |
| BYOP 01 3 DAY BUILDER | 1 | 1 | 100% |
| BYOP 02 PPL | 2 | 2 | 100% |
| BYOP 03 ATHLETIC 4D | 2 | 2 | 100% |
| BYOP 04 JUSTICE LEAGUE | 2 | 2 | 100% |
| BYOP 06 BOOTCAMP 2 | 2 | 2 | 100% |
| BYOP 07 NO-ACCESS AESTHETICS | 2 | 2 | 100% |
| BYOP 08 NO-ACCESS ATHLETIC | 2 | 2 | 100% |
| MM 00 UPPER/LOWER | 3 | 3 | 100% |
| MM 01 FAT BURN | 2 | 2 | 100% |
| MM 02 BASEBALL | 2 | 1 | 50% |
| MM 04 4 TRACKS | 19 | 6 | 32% |
| MM 07 BOXING | 2 | 2 | 100% |
| MM 12 CONJUGATE | 6 | 0 | 0% |

* **OBSERVED, BYOP 100%.** 00/01/03/04/07/08 put 'Horizontal Push' (row 11/14/18/45) above 'Vertical Push' (row 13/16/20/47). BYOP 02 PPL push day reads 'Horizontal Push' -> 'Vertical Push' -> 'Incline' -> 'Flies' -> 'Dips' -> 'Push' -> 'Overhead'. The lead is horizontal, but more horizontal work (incline, dips) follows the overhead press. That is the only 'strict' failure in BYOP. MM UPPER/LOWER: C29 'Bench Press' -> C31 'Overhead Press'. BASEBALL never puts both in one Part C (horizontal Tue, vertical Fri), so it is applicable only through accessories.
* **OBSERVED, systematic exception: the max-effort rotation.** CONJUGATE Wed/Sat and 4-TRACKS STRENGTH left alternate the main lift weekly: CONJUGATE Wed/Sat 'HEAVY BENCH PRESS' / 'FAST BANDED BENCH PRESS' (WK1, 3, 5, 7) vs 'HEAVY OH PRESS' / 'FAST DB OH PRESS' / 'FAST BB OH PRESS' (WK2, 4, 6); 4-TRACKS STRENGTH left J13 'HEAVY OH PRESS' (WK6) and F21 'FAST DB OH PRESS', H21 'PUSH PRESS', J21 'FAST DB OH PRESS'. In the OH weeks, 'the work' is vertical and 'the nuance' ('ALT INCLINE DB BENCH') is horizontal, so the label hierarchy (N11) outranks R2. 4-TRACKS AESTHETICS right puts 'Arnold press' first in WK8, 10 and 12 (V35, X35, Z35, X51, Z51), in the slot where side raises sit in other weeks. HYBRID Saturday fails only through the label-only 'FB' row C101 'VEr pull/ hor push' sitting under a push-press tri-set.

<details><summary>Every exception (tab, day, cells)</summary>

- **BYOP 02 PPL, MONDAY** (1): lead OK, but later H after V: H=['E3 [Horizontal Push]', 'E5 [Incline]', 'E7 [Dips]'] V=['E4 [Vertical Push]']
- **BYOP 02 PPL, Thursday** (1): lead OK, but later H after V: H=['E24 [Horizontal Push]', 'E26 [Incline]', 'E28 [Dips]'] V=['E25 [Vertical Push]']
- **MM 02 BASEBALL A24 BLOCK 1, 'FRIDAY'** (1): [DA25 'wk 7'] V DQ35 [vert push] 'DB sesaw presses' before H DQ39 [shoulders] 'Pushups'
- **MM 04 4 TRACKS A3 STRENGTH left, 'SATURDAY'** (3): [WK2] V F21 [the work] 'FAST DB OH PRESS' before H F23 [the nuance] 'ALT INCLINE DB BENCH'; [WK4] V H21 [the work] 'PUSH PRESS' before H H23 [the nuance] 'ALT INCLINE DB BENCH'; [WK6] V J21 [the work] 'FAST DB OH PRESS' before H J23 [the nuance] 'ALT INCLINE DB BENCH'
- **MM 04 4 TRACKS A3 STRENGTH left, 'WEDNESDAY'** (1): [WK6] V J13 [the work] 'HEAVY OH PRESS' before H J15 [the nuance] 'ALT INCLINE DB BENCH'
- **MM 04 4 TRACKS A30 AESTHETICS right, 'MONDAY' (M38 'PUSH')** (3): [WK8] V V35 'Arnold press' before H V36 'incline bench press'; [WK10] V X35 'Arnold press' before H X36 'incline bench press'; [WK12] V Z35 'Arnold press' before H Z36 'incline bench press'
- **MM 04 4 TRACKS A30 AESTHETICS right, 'THURSDAY' (M54 'PUSH')** (2): [WK10] V X51 'Arnold press' before H X52 'incline bench press + superset with a set of max bench dips, one set o'; [WK12] V Z51 'Arnold press' before H Z52 'incline bench press + superset with a set of max bench dips, one set o'
- **MM 04 4 TRACKS A69 HYBRID, 'SATURDAY'** (4): [WK2] V F100 [STEP UPS] 'FF & RFE Lunge double dbs/ jumping pull ups/ db push press' before H F101; [WK4] V H100 [STEP UPS] 'FF & RFE Lunge double dbs/ pull ups/ db strict press' before H H101; [WK6] V J100 [STEP UPS] 'FF & RFE Lunge double dbs/ jumping pull ups/ db push press' before H J101; [WK8] V L100 [STEP UPS] 'FF & RFE Lunge double dbs/ pull ups/ db strict press' before H L101
- **MM 12 CONJUGATE, 'WEDNESDAY'** (3): [WK2] V F17 [the work] 'HEAVY OH PRESS' before H F19 [the nuance] 'ALT INCLINE DB BENCH'; [WK4] V H17 [the work] 'HEAVY OH PRESS' before H H19 [the nuance] 'ALT INCLINE DB BENCH'; [WK6] V J17 [the work] 'HEAVY OH PRESS' before H J19 [the nuance] 'ALT INCLINE DB BENCH'
- **MM 12 CONJUGATE, 'SATURDAY'** (3): [WK2] V F25 [the work] 'FAST DB OH PRESS' before H F27 [the nuance] 'ALT INCLINE DB BENCH'; [WK4] V H25 [the work] 'FAST BB OH PRESS' before H H27 [the nuance] 'ALT INCLINE DB BENCH'; [WK6] V J25 [the work] 'FAST DB OH PRESS' before H J27 [the nuance] 'ALT INCLINE DB BENCH'

</details>

### R3. Athletic / power work before strength

*Operational test:* session holds at least one athletic item (PLYO_L, PLYO_U, SPRINT, COD, DRILL) and one compound strength item; compliant if every athletic item is above the first strength item. Sessions whose only violation is a contrast complex: 9 (counted as exceptions here and itemised in N12).

**Result: 128 / 155 applicable sessions compliant (83%); 27 exception sessions.**

| Tab | Applicable | Compliant | % |
|---|---:|---:|---:|
| BYOP 03 ATHLETIC 4D | 4 | 4 | 100% |
| BYOP 04 JUSTICE LEAGUE | 4 | 4 | 100% |
| BYOP 08 NO-ACCESS ATHLETIC | 4 | 4 | 100% |
| MM 00 UPPER/LOWER | 3 | 3 | 100% |
| MM 02 BASEBALL | 92 | 77 | 84% |
| MM 04 4 TRACKS | 23 | 15 | 65% |
| MM 05 ATHLETIC FB | 10 | 8 | 80% |
| MM 06 PPL | 3 | 3 | 100% |
| MM 07 BOXING | 5 | 3 | 60% |
| MM 12 CONJUGATE | 7 | 7 | 100% |

* **OBSERVED, BYOP athletic templates (03, 04, 08): 12/12.** Fixed skeleton 'Plyo' -> 'Plyo' -> 'Throwing' -> 'COD' -> 'Tripple Extension' -> strength, wired to library cols G -> G -> K -> L -> C. Demo picks in JUSTICE LEAGUE: E3 'Medium Depth Drop', E4 'Ankle Hops ', E5 'Situps to overhead throw', E6 'DIG/OUT', E7 'Power Clean', E8 'Front Squats'.
* **OBSERVED, BASEBALL 77/92 compliant.** Part A ('Upper Ballistics/plyo' or 'LOWER ballistics/plyo') is always first. Exceptions fall into 3 families. (1) **contrast**: a jump right after the heavy lift ('Barbell deadlift' I51 -> 'Broad jumps' I52) or one prescription 'front squats/high jumps/hex bar squat jumps/ banded assisted hops'. (2) **plyo used as the strength-slot exercise**: 'plyo pushups' in 'horiz push', 'medball press' in 'vert push', 'split stance jump squats' in 'ukd', 'Banded tantrums (sprint)' in 'uhd'. (3) BLOCK 1 wk 2 Monday S36: 'highest ankle hops' typed in the 'bicep' row because the labels are shifted one row (data slip).
* **OBSERVED, HYBRID Tuesday (8 weeks):** B81 'STRENGTH'/'PUSH' bench press is above B82 'OLY/ POWER'/'JUMPS'. Upper strength comes before lower plyo, so the jumps are not fatigued by the bench (INFERRED).
* **INFERRED:** the coach's real rule is 'fast before heavy *for the same region*', with one deliberate exception, contrast pairing (N12).

<details><summary>Every exception (tab, day, cells)</summary>

- **MM 02 BASEBALL A24 BLOCK 1, 'MONDAY'** (2): [O22 'WK 2'] first strength S34 [horiz pull] 'seal rows 10 reps all rounds'; late: S36 [bicep] 'highest ankle hops'  <athletic exercise in the 'bicep' accessory slot>; S38 'highest ankle hops'  <athletic after strength (different region: lower athletic after upper strength)>; [DA25 'wk 7'] first strength DE34 [bkd] 'Oscilating drop squats'; late: DE37 [uhd] 'Banded tantrums (sprint)'  <athletic exercise placed in the coach's 'uhd' strength slot>
- **MM 02 BASEBALL A24 BLOCK 1, 'FRIDAY'** (1): [AY22 'wk 4'] first strength BO33 [bhd] 'Banded KB swings'; late: BO34 [vert push] 'medball press  <athletic exercise placed in the coach's 'vert push' strength slot>
- **MM 02 BASEBALL A24 BLOCK 1, 'TUESDAY'** (1): [BQ22 'wk 5'] first strength BY33 [bhd] 'barbell Deadlifts'; late: BY34 [horiz push] 'plyo pushups'  <athletic exercise placed in the coach's 'horiz push' strength slot>
- **MM 02 BASEBALL A41 BLOCK 2, 'TUESDAY'** (1): [A42 'WK 1'] first strength I51 [bhd] 'Barbell deadlift'; late: I52 [horiz push] 'Broad jumps'  <contrast pairing (jump immediately after heavy lower lift)>
- **MM 02 BASEBALL A41 BLOCK 2, 'FRIDAY'** (3): [S42 'wk 2'] first strength AI51 [bhd] 'Fast KB swings'; late: AI52 [vert push] 'medball press  <athletic exercise placed in the coach's 'vert push' strength slot>; [BC43 'wk 5'] first strength BS52 [bhd] '45 degree hyper-extension machine - Kb swings'; late: BS55 [ukd] 'Suitcase DB RFE iso holds / RFE lunge jumps'  <contrast complex (heavy lift + jump/sprint in ONE prescription)>; [CL43 'WEEK 7'] first strength DC52 [bhd] 'banded kb swings; late: DC55 [ukd] 'split stance jump squats'  <athletic exercise placed in the coach's 'ukd' strength slot>
- **MM 02 BASEBALL A41 BLOCK 2, 'MONDAY'** (4): [AK42 'wk 4'] first strength AO51 [bkd] 'Front squats - light weights - same speed for all reps'; late: AO52 [bkd] 'Jump squats'  <contrast pairing (jump immediately after heavy lower lift)>; [DD42 'WEEK 8'] first strength DH51 [bkd] 'front squats/high jumps/hex bar squat jumps/ banded assisted hops'; late: DH51 [bkd] 'front squats/high jumps/hex bar squat jumps/ banded assisted hops'  <contrast complex (heavy lift + jump/sprint in ONE prescription)>; [BU43 'wk 6'] first strength BY52 [bkd] 'front squats/high jumps/hex bar squat jumps/ banded assisted hops'; late: BY52 [bkd] 'front squats/high jumps/hex bar squat jumps/ banded assisted hops'  <contrast complex (heavy lift + jump/sprint in ONE prescription)>; [CL43 'WEEK 7'] first strength CQ52 [bkd] 'back squats/banded  jumps/DB squat jumps/ high ankle hops'; late: CQ52 [bkd] 'back squats/banded  jumps/DB squat jumps/ high ankle hops'  <contrast complex (heavy lift + jump/sprint in ONE prescription)>
- **MM 02 BASEBALL A59 BLOCK 3, 'FRIDAY'** (2): [CU61 'WEEK 7 (04/17 TO 04/21)'] first strength DK68 [bhd] 'FAST BANDED DEADLFTS'; late: DK71 [ukd] 'SPLIT STANCE SQUAT JUMPS'  <athletic exercise placed in the coach's 'ukd' strength slot>; [BK61 'WEEK 5'] first strength CA69 [bhd] 'KB swings'; late: CA72 [ukd] 'alternating split stance jumps FFE (box)  <athletic exercise placed in the coach's 'ukd' strength slot>
- **MM 02 BASEBALL A59 BLOCK 3, 'TUESDAY'** (1): [O61 'week 2'] first strength W69 [bhd] 'Barbell deadlift'; late: W70 [horiz push] 'Broad jumps  <contrast pairing (jump immediately after heavy lower lift)>
- **MM 04 4 TRACKS A69 HYBRID, 'TUESDAY'** (8): [WK1] first strength E81 [BENCH PRESS] '3x6 - DB bench press/ core'; late: E82 [JUMPS] 'Depth drops'  <athletic after strength (different region: lower athletic after upper strength)>; [WK2] first strength F81 [BENCH PRESS] '3x6 db incline bench press/ core'; late: F82 [JUMPS] 'Weighted depth drops'  <athletic after strength (different region: lower athletic after upper strength)>; [WK3] first strength G81 [BENCH PRESS] '3x8 - barbell bench press/ core'; late: G82 [JUMPS] 'depth drop to jump'  <athletic after strength (different region: lower athletic after upper strength)>; [WK4] first strength H81 [BENCH PRESS] '3x8 - barbell incline bench press/ core'; late: H82 [JUMPS] 'weighted depth drops to jump'  <athletic after strength (different region: lower athletic after upper strength)>; [WK5] first strength I81 [BENCH PRESS] '3x10 DB bench press/ core'; late: I82 [JUMPS] 'box jumps'  <athletic after strength (different region: lower athletic after upper strength)>; [WK6] first strength J81 [BENCH PRESS] '3x10 DB incline press/ core'; late: J82 [JUMPS] 'box jumps'  <athletic after strength (different region: lower athletic after upper strength)>; [WK7] first strength K81 [BENCH PRESS] '4x6 bb bench/ core'; late: K82 [JUMPS] 'repeat hurdle hops'  <athletic after strength (different region: lower athletic after upper strength)>; [WK8] first strength L81 [BENCH PRESS] '4x8/ bb incline bench/ core'; late: L82 [JUMPS] 'repeat hurdle hops'  <athletic after strength (different region: lower athletic after upper strength)>
- **MM 05 ATHLETIC FB A9 'STARTING OFF SEASON WORKOUTS', WORKOUT 1** (1): first strength C16 'HEAVY Single arm rotational half kneeling cable row or band row or Bir'; late: C18 'SUPERSET: HEAVY Ipsilateral DB front foot elevated lunge directly into'  <contrast complex (heavy lift + jump/sprint in ONE prescription)>; C20 'Lateral mid size box step up jumps directly into nordic curls'  <athletic after strength (same region)>
- **MM 05 ATHLETIC FB A9 'STARTING OFF SEASON WORKOUTS', WORKOUT 2** (1): first strength C26 'KB Swings + 12/12 Single leg Glute bridges'; late: C29 'Plyo Push ups - one side raised'  <athletic after strength (same region)>
- **MM 07 BOXING, 'TUESDAY OFF SEASON WORK'** (1): [Week 3-8 (col L)] first strength L20 'Single Leg swiss ball knee tuck in + DB rows'; late: L22 '3 Heavy SQUATs + 5 Tuck jumps + 5 DB squat jumps + 5 Squirrel jumps'  <contrast complex (heavy lift + jump/sprint in ONE prescription)>
- **MM 07 BOXING, 'FRIDAY OFF SEASON WORK'** (1): [Week 3-8 (col L)] first strength L46 '4 Deadlifts - 5 broad jumps - 5 KB swings - 5/5 High Knee runs'; late: L46 '4 Deadlifts - 5 broad jumps - 5 KB swings - 5/5 High Knee runs'  <contrast complex (heavy lift + jump/sprint in ONE prescription)>

</details>

### R4. Power-strength / Olympic / triple extension before heavy strength

*Operational test:* session holds an OLY or LOADED_JUMP item and a (non-ballistic) compound strength item; compliant if every power item is above the first strength item.

**Result: 49 / 78 applicable sessions compliant (63%); 29 exception sessions.**

| Tab | Applicable | Compliant | % |
|---|---:|---:|---:|
| BYOP 03 ATHLETIC 4D | 4 | 4 | 100% |
| BYOP 04 JUSTICE LEAGUE | 4 | 4 | 100% |
| BYOP 08 NO-ACCESS ATHLETIC | 4 | 4 | 100% |
| MM 02 BASEBALL | 40 | 32 | 80% |
| MM 04 4 TRACKS | 16 | 0 | 0% |
| MM 05 ATHLETIC FB | 7 | 3 | 43% |
| MM 07 BOXING | 3 | 2 | 67% |

* **OBSERVED, holds where the coach built a power slot.** BYOP 03/04/08: 'Tripple Extension' (row 7/16/34/43) is always above 'Bilateral KD/HD'. BASEBALL BLOCK 1 wk 6-8 and BLOCK 2 wk 5-8 add an 'OLY' row ('Hang cleans @ 75%' ... '@ 90%' on Mon/Thu, 'Hang snatch' on Tue/Fri) *above* 'bkd'/'bhd' (CI33 'OPTIONAL PIECE'). This shows the intended order directly.
* **OBSERVED, systematic exception: HYBRID.** Every Monday and Thursday lists B74 'STRENGTH' (SQUATS/DEADLIFTS) above B75/B87 'OLY/ POWER' (CLEANS/SNATCHES), 16/16 sessions. Saturday's 'OLY/ POWER' row (B99) is empty.
* **OBSERVED, accessory-slot ballistics:** BASEBALL uses 'Single Arm DB snatch from floor', 'KB high pull' and 'DB HIGH PULL' as the last 'shoulders' accessory on hinge days. MM 05 STARTING puts 'Staggered stance DB snatch' C28 after KB swings, and 'SUPERSET: Low Hang Power Cleans (mid weight)' C36 after 'HEAVY: Camporini DL'.
* **INFERRED:** when the Olympic lift is the session's speed-strength priority it goes first. When it is used light, as a shoulder or upper-back accessory or a 'mid weight' superset, it can sit late. HYBRID is the open question (Q3).

<details><summary>Every exception (tab, day, cells)</summary>

- **MM 02 BASEBALL A24 BLOCK 1, 'TUESDAY'** (1): [AY22 'wk 4'] first strength BG33 [bhd] 'Staggered Barbell deadlift'; late: BG38 [shoulders] 'Single Arm DB snatch from floor'  <ballistic lift used in the 'shoulders' accessory slot>
- **MM 02 BASEBALL A24 BLOCK 1, 'FRIDAY'** (1): [CI25 'wk 6'] first strength CY34 [bhd] '45 degree hyper-extension machine'; late: CY37 [ukd] 'Suitcase DB RFE lunge jumps'  <power lift after strength>
- **MM 02 BASEBALL A41 BLOCK 2, 'MONDAY'** (1): [A42 'WK 1'] first strength E51 [bkd] 'Heavy front squats'; late: E52 [horiz pull] 'KB squat cleans'  <ballistic lift in the 'horiz pull' superset slot (paired with the hinge/squat)>
- **MM 02 BASEBALL A41 BLOCK 2, 'TUESDAY'** (1): [S42 'wk 2'] first strength AA51 [bhd] 'Staggered Barbell deadlift'; late: AA56 [shoulders] 'Single Arm DB snatch from floor'  <ballistic lift used in the 'shoulders' accessory slot>
- **MM 02 BASEBALL A41 BLOCK 2, 'FRIDAY'** (1): [DD42 'WEEK 8'] first strength DT51 [bhd] 'kb swings heavy'; late: DT52 [vert push] 'sigle arm DB push split jerk  <ballistic lift in the 'vert push' superset slot (paired with the hinge/squat)>
- **MM 02 BASEBALL A59 BLOCK 3, 'FRIDAY'** (3): [CU61 'WEEK 7 (04/17 TO 04/21)'] first strength DK68 [bhd] 'FAST BANDED DEADLFTS'; late: DK73 [shoulders] 'DB HIGH PULL'  <ballistic lift used in the 'shoulders' accessory slot>; [AT61 'week 4'] first strength BJ69 [bhd] 'Banded deadlifts'; late: BJ74 [shoulders] 'KB high pull'  <ballistic lift used in the 'shoulders' accessory slot>; [CC61 'WEEK 6'] first strength CS69 [bhd] 'BANDED KB SWINGS'; late: CS72 [ukd] 'Suitcase DB RFE lunge jumps'  <power lift after strength>
- **MM 04 4 TRACKS A69 HYBRID, 'MONDAY'** (8): [WK1] first strength E74 [SQUATS] 'FRONT SQUATS'; late: E75 [CLEANS] '2x 2 clean pulls, 2 power cleans'  <template order: B-col 'STRENGTH' row precedes 'OLY/ POWER' row (HYBRID track)>; [WK2] first strength F74 [SQUATS] 'BACK SQUATS'; late: F75 [CLEANS] '2x 5 heavy touch and go cleans'  <template order: B-col 'STRENGTH' row precedes 'OLY/ POWER' row (HYBRID track)>; [WK3] first strength G74 [SQUATS] 'FRONT SQUATS'; late: G75 [CLEANS] '2x 3 clean pulls heavy'  <template order: B-col 'STRENGTH' row precedes 'OLY/ POWER' row (HYBRID track)>; [WK4] first strength H74 [SQUATS] 'BACK SQUATS'; late: H75 [CLEANS] '3x 3 heavy power cleans'  <template order: B-col 'STRENGTH' row precedes 'OLY/ POWER' row (HYBRID track)>; [WK5] first strength I74 [SQUATS] 'FRONT SQUATS'; late: I75 [CLEANS] '4x 2 heavy squat cleans'  <template order: B-col 'STRENGTH' row precedes 'OLY/ POWER' row (HYBRID track)>; [WK6] first strength J74 [SQUATS] 'BACK SQUATS'; late: J75 [CLEANS] '2x 3 heavy clean pulls'  <template order: B-col 'STRENGTH' row precedes 'OLY/ POWER' row (HYBRID track)>; [WK7] first strength K74 [SQUATS] 'FRONT SQUATS'; late: K75 [CLEANS] '2x3 heavy squat cleans'  <template order: B-col 'STRENGTH' row precedes 'OLY/ POWER' row (HYBRID track)>; [WK8] first strength L74 [SQUATS] 'BACK SQUATS'; late: L75 [CLEANS] '2x 1 heavy squat clean'  <template order: B-col 'STRENGTH' row precedes 'OLY/ POWER' row (HYBRID track)>
- **MM 04 4 TRACKS A69 HYBRID, 'THURSDAY'** (8): [WK1] first strength E86 [DEADLIFTS] 'KB DL'; late: E87 [SNATCHES] '2x 2 snatch pulls, 2 power snatches'  <template order: B-col 'STRENGTH' row precedes 'OLY/ POWER' row (HYBRID track)>; [WK2] first strength F86 [DEADLIFTS] 'KB DL'; late: F87 [SNATCHES] '2x 5 heavy touch and go power snatches'  <template order: B-col 'STRENGTH' row precedes 'OLY/ POWER' row (HYBRID track)>; [WK3] first strength G86 [DEADLIFTS] 'HEX BAR OR DB DL'; late: G87 [SNATCHES] '2x 3 snatch pulls heavy'  <template order: B-col 'STRENGTH' row precedes 'OLY/ POWER' row (HYBRID track)>; [WK4] first strength H86 [DEADLIFTS] 'HEX BAR OR DB DL'; late: H87 [SNATCHES] '3x 3 heavy power snatches'  <template order: B-col 'STRENGTH' row precedes 'OLY/ POWER' row (HYBRID track)>; [WK5] first strength I86 [DEADLIFTS] 'BARBELL DL'; late: I87 [SNATCHES] '4x 2 heavy squat snatches'  <template order: B-col 'STRENGTH' row precedes 'OLY/ POWER' row (HYBRID track)>; [WK6] first strength J86 [DEADLIFTS] 'KB DL'; late: J87 [SNATCHES] '2x 3 heavy snatch pulls'  <template order: B-col 'STRENGTH' row precedes 'OLY/ POWER' row (HYBRID track)>; [WK7] first strength K86 [DEADLIFTS] 'HEX BAR OR DB DL'; late: K87 [SNATCHES] '2x3 heavy power snatches'  <template order: B-col 'STRENGTH' row precedes 'OLY/ POWER' row (HYBRID track)>; [WK8] first strength L86 [DEADLIFTS] 'BARBELL DL'; late: L87 [SNATCHES] '2x 1 heavy power snatches'  <template order: B-col 'STRENGTH' row precedes 'OLY/ POWER' row (HYBRID track)>
- **MM 05 ATHLETIC FB A9 'STARTING OFF SEASON WORKOUTS', WORKOUT 1** (1): first strength C16 'HEAVY Single arm rotational half kneeling cable row or band row or Bir'; late: C17 'SUPERSET: HEAVY Hex bar Squats direclty into 10 Repeat Jump Squat HIGH'  <contrast complex (heavy lift + loaded jump in ONE prescription)>
- **MM 05 ATHLETIC FB A9 'STARTING OFF SEASON WORKOUTS', WORKOUT 2** (1): first strength C26 'KB Swings + 12/12 Single leg Glute bridges'; late: C28 'Staggered stance DB snatch'  <power lift after strength>
- **MM 05 ATHLETIC FB A9 'STARTING OFF SEASON WORKOUTS', WORKOUT 3** (1): first strength C34 'HEAVY: Camporini DL'; late: C36 'SUPERSET: Low Hang Power Cleans (mid weight)'  <power lift after strength>
- **MM 05 ATHLETIC FB H9 ' ADVANCED OFF SEASON WORKOUTS', WORKOUT 4** (1): first strength J41 'Lateral Step ups IPSILATERAL loading'; late: J42 'Db Staggered Hang Snatch'  <power lift after strength>
- **MM 07 BOXING, 'TUESDAY OFF SEASON WORK'** (1): [Week 3-8 (col L)] first strength L20 'Single Leg swiss ball knee tuck in + DB rows'; late: L21 'DB snatches'  <power lift after strength>; L22 '3 Heavy SQUATs + 5 Tuck jumps + 5 DB squat jumps + 5 Squirrel jumps'  <contrast complex (heavy lift + loaded jump in ONE prescription)>

</details>

### R5. Bilateral before unilateral (same region)

*Operational test:* session holds a bilateral lower lift (BKD/BHD) and a unilateral one (UKD/UHD); compliant if the first bilateral is above (or in the same prescription as) the first unilateral. Pattern level: KD 102/106, HD 84/85. Upper body (name-flagged single-arm vs not, within pulls and within pushes): 31/46.

**Result: 225 / 231 applicable sessions compliant (97%); 6 exception sessions.**

| Tab | Applicable | Compliant | % |
|---|---:|---:|---:|
| BYOP 00 AESTHETICS 4D | 4 | 4 | 100% |
| BYOP 01 3 DAY BUILDER | 3 | 3 | 100% |
| BYOP 02 PPL | 2 | 2 | 100% |
| BYOP 03 ATHLETIC 4D | 4 | 4 | 100% |
| BYOP 04 JUSTICE LEAGUE | 4 | 4 | 100% |
| BYOP 05 BOOTCAMP 1 | 4 | 4 | 100% |
| BYOP 06 BOOTCAMP 2 | 2 | 2 | 100% |
| BYOP 07 NO-ACCESS AESTHETICS | 4 | 4 | 100% |
| BYOP 08 NO-ACCESS ATHLETIC | 4 | 4 | 100% |
| MM 00 UPPER/LOWER | 3 | 3 | 100% |
| MM 01 FAT BURN | 8 | 8 | 100% |
| MM 02 BASEBALL | 62 | 62 | 100% |
| MM 04 4 TRACKS | 100 | 96 | 96% |
| MM 05 ATHLETIC FB | 5 | 4 | 80% |
| MM 06 PPL | 3 | 3 | 100% |
| MM 07 BOXING | 5 | 4 | 80% |
| MM 12 CONJUGATE | 14 | 14 | 100% |

* **OBSERVED, near-universal (97%).** Every BYOP template has 'Bilateral KD/HD' above 'Unilateral KD/HD'. BASEBALL Part C ('bkd'/'bhd') is always above Part D ('uhd'/'ukd'). The coach's own note supports this: 'When there are joint pains, usually going unilateral ... help take care of some stuff' (MM 05 A6), so unilateral is the safer, later choice.
* **OBSERVED exceptions:** 4-TRACKS AESTHETICS right Friday WK9-12 starts with 'RFE Lunges (bulgarian)' W57 and ends with '2 sets LEG PRESS MYO - 15-5-5-5-5-5' W61. A machine myo-rep finisher is deliberately last (N13). MM 05 STARTING W3: 'HEAVY: Camporini DL' C34 above 'Heavy Snatch grip DL' C37. BOXING Wk3-8 Monday: 'Lateral box step up IPSILATERAL LOAD' L11 above 'DEADLIFTS (1-2RIR) + 3 min Jump Rope' L12. Different patterns (KD vs HD), so pattern-level R5 still holds.
* Upper-body exceptions are mostly FAT BURN / 4-TRACKS AESTHETICS: 'SINGLE ARM LAT PULL DOWN' is above 'MACHINE SUPPORTED ROW', which is the same issue as R1.

<details><summary>Upper-body R5 exceptions</summary>

- BYOP 04 JUSTICE LEAGUE MONDAY (pull): single-arm E9 [Horizontal Pull] 'Cable Machine UL Rows' before E11 [Vertical Pull] 'Stricted Pull-ups feet in front'
- MM 01 FAT BURN B4 MUSCLE BUILDING A14 'TUESDAY' [WK 1] (pull): single-arm D13 'SINGLE ARM LAT PULL DOWN' before D15 'MACHINE SUPPORTED ROW'
- MM 01 FAT BURN B4 MUSCLE BUILDING A27 'FRIDAY' [WK 1] (pull): single-arm D25 'SINGLE ARM LAT PULL DOWN' before D27 'MACHINE SUPPORTED ROW'
- MM 01 FAT BURN B4 MUSCLE BUILDING A14 'TUESDAY' [WK 2] (pull): single-arm G12 'SINGLE ARM LAT PULL DOWN' before G14 'MACHINE SUPPORTED ROW'
- MM 01 FAT BURN B4 MUSCLE BUILDING A27 'FRIDAY' [WK 2] (pull): single-arm G26 'SINGLE ARM LAT PULL DOWN' before G28 'MACHINE SUPPORTED ROW'
- MM 01 FAT BURN B4 MUSCLE BUILDING A27 'FRIDAY' [WK 4] (pull): single-arm M26 'SINGLE ARM LAT PULL DOWN' before M28 'DB ROWS'
- MM 02 BASEBALL A24 BLOCK 1 DO27 'FRIDAY' [DA25 'wk 7'] (push): single-arm DQ35 [vert push] 'DB sesaw presses' before DQ39 [shoulders] 'Pushups'
- MM 04 4 TRACKS A30 AESTHETICS left A41 'TUESDAY' [WK1] (pull): single-arm E42 'UNILATERAL LAT PULL DOWN' before E44 'MACHINE SUPPORTED ROW'
- MM 04 4 TRACKS A30 AESTHETICS left A55 'FRIDAY' [WK1] (pull): single-arm E56 'UNILATERAL LAT PULL DOWN' before E59 'MACHINE SUPPORTED ROW'
- MM 04 4 TRACKS A30 AESTHETICS left A41 'TUESDAY' [WK2] (pull): single-arm F41 'UNILATERAL LAT PULL DOWN' before F43 'MACHINE SUPPORTED ROW'
- MM 04 4 TRACKS A30 AESTHETICS left A55 'FRIDAY' [WK2] (pull): single-arm F55 'UNILATERAL LAT PULL DOWN' before F57 'MACHINE SUPPORTED ROW'
- MM 04 4 TRACKS A30 AESTHETICS left A41 'TUESDAY' [WK3] (pull): single-arm G42 'UNILATERAL LAT PULL DOWN' before G44 'DB ROWS'
- MM 04 4 TRACKS A30 AESTHETICS left A55 'FRIDAY' [WK3] (pull): single-arm G56 'UNILATERAL' before G59 'DB ROWS'
- MM 04 4 TRACKS A30 AESTHETICS left A41 'TUESDAY' [WK5] (pull): single-arm I42 'UNILATERAL LAT PULL DOWN' before I44 'MACHINE SUPPORTED ROW'
- MM 04 4 TRACKS A30 AESTHETICS left A41 'TUESDAY' [WK7] (pull): single-arm K42 'UNILATERAL LAT PULL DOWN' before K44 'DB ROWS'

</details>

<details><summary>Every exception (tab, day, cells)</summary>

- **MM 04 4 TRACKS A30 AESTHETICS right, 'FRIDAY' (legs)** (4): [WK9] unilateral W57 'RFE Lunges (bulgarian)' before bilateral W61 '2 sets LEG PRESS MYO - 15-5-5-5-5-5'; [WK10] unilateral X57 'RFE Lunges (bulgarian)' before bilateral X61 '2 sets LEG PRESS MYO - 15-5-5-5-5-5'; [WK11] unilateral Y57 'RFE Lunges (bulgarian)' before bilateral Y61 '2 sets LEG PRESS MYO - 15-5-5-5-5-5'; [WK12] unilateral Z57 'RFE Lunges (bulgarian)' before bilateral Z61 '3 sets LEG PRESS MYO - 15-5-5-5-5-5'
- **MM 05 ATHLETIC FB A9 'STARTING OFF SEASON WORKOUTS', WORKOUT 3** (1): unilateral C34 'HEAVY: Camporini DL' before bilateral C37 'Heavy Snatch grip DL'
- **MM 07 BOXING, 'MONDAY OFF SEASON WORK'** (1): [Week 3-8 (col L)] unilateral L11 'Lateral box step up IPSILATERAL LOAD' before bilateral L12 'DEADLIFTS (1-2RIR) + 3 min Jump Rope'

</details>

### R6. Compound before isolation

*Operational test:* session holds a compound (strength or OLY) and an isolation item; exception if any isolation item sits above any compound.

**Result: 227 / 301 applicable sessions compliant (75%); 74 exception sessions.**

| Tab | Applicable | Compliant | % |
|---|---:|---:|---:|
| BYOP 00 AESTHETICS 4D | 4 | 2 | 50% |
| BYOP 01 3 DAY BUILDER | 2 | 1 | 50% |
| BYOP 02 PPL | 6 | 2 | 33% |
| BYOP 03 ATHLETIC 4D | 4 | 4 | 100% |
| BYOP 04 JUSTICE LEAGUE | 4 | 4 | 100% |
| BYOP 05 BOOTCAMP 1 | 4 | 4 | 100% |
| BYOP 06 BOOTCAMP 2 | 4 | 2 | 50% |
| BYOP 07 NO-ACCESS AESTHETICS | 4 | 2 | 50% |
| BYOP 08 NO-ACCESS ATHLETIC | 4 | 4 | 100% |
| MM 00 UPPER/LOWER | 6 | 6 | 100% |
| MM 01 FAT BURN | 16 | 13 | 81% |
| MM 02 BASEBALL | 92 | 80 | 87% |
| MM 04 4 TRACKS | 122 | 82 | 67% |
| MM 05 ATHLETIC FB | 7 | 6 | 86% |
| MM 06 PPL | 9 | 3 | 33% |
| MM 07 BOXING | 6 | 5 | 83% |
| MM 12 CONJUGATE | 7 | 7 | 100% |

* **OBSERVED, by design in BYOP aesthetics:** 'Calves' is slot 1 of Day 1 and Day 3 (00 D3 'Machine Calf Raises', 01 D3, 07 E3/E24), above 'Bilateral KD'. This happens in every KD/pull day of the aesthetic templates and nowhere in the athletic ones, which push 'Calves' to the optional day. BYOP 02 PPL: 'Flies' (row 6) above 'Dips' (row 7); leg day 'Leg Extensions' and 'Leg Curls' (rows 20-21) above 'Unilateral HD' (row 22). BOOTCAMP 2 puts 'Bicep' (E10) between 'Horizontal Push' and 'Vertical Push'.
* **OBSERVED, pre-exhaust pattern in bodybuilding pushes:** 4-TRACKS AESTHETICS right opens every push day with side raises (O35 'cable Side Raises', P35 'DB side raises', ...: 19 of the 24 push days; the other 5 open with 'Arnold press', see R2). MM PPL push day: C17 'Side raises' between C16 'Incline DB Bench press' and C18 'Barbell Bench press'. Pull day: C27 'DB Reverse Flies or Machine' between the row and the pulldown.
* **OBSERVED, BASEBALL Part D:** the last 'shoulders' accessory is often a compound ('sesaw push press', 'bent over rows', 'Pushups', 'Single Arm DB snatch from floor') placed after the tricep isolation. That is the slot order (tricep -> shoulders), not a compound-first violation in intent (INFERRED).

<details><summary>Every exception (tab, day, cells)</summary>

- **BYOP 00 AESTHETICS 4D, Day 1** (1): D3 [Calves] 'Machine Calf Raises' precedes D4 [Bilateral KD] 'Leg press'; D5 [Horizontal Pull] 'Bent Over Barbell Rows'; D6 [Unilateral KD] 'Reverse Lunges'; D7 [Vertical Pull] 'Lat Pulldown Pronated Grip'
- **BYOP 00 AESTHETICS 4D, Day 3** (1): D24 [Calves] precedes D25 [Bilateral KD]; D26 [Horizontal Pull]; D27 [Unilateral KD]; D28 [Vertical Pull]
- **BYOP 01 3 DAY BUILDER, DAY 1** (1): D3 [Calves] precedes D4 [Bilateral KD]; D5 [Horizontal Pull]; D6 [Unilateral KD]; D7 [Vertical Pull]
- **BYOP 02 PPL, MONDAY** (1): E6 [Flies] precedes E7 [Dips]
- **BYOP 02 PPL, WEDNESDAY** (1): E20 [Leg Extensions] precedes E22 [Unilateral HD]; E21 [Leg Curls] precedes E22 [Unilateral HD]
- **BYOP 02 PPL, Thursday** (1): E27 [Flies] precedes E28 [Dips]
- **BYOP 02 PPL, Saturday** (1): E41 [Leg Extensions] precedes E43 [Unilateral HD]; E42 [Leg Curls] precedes E43 [Unilateral HD]
- **BYOP 06 BOOTCAMP 2, 2A** (1): E10 [Bicep] precedes E11 [Vertical Push]
- **BYOP 06 BOOTCAMP 2, 2B** (1): E25 [Bicep] precedes E26 [Vertical Push]
- **BYOP 07 NO-ACCESS AESTHETICS, MONDAY** (1): E3 [Calves] precedes E4 [Bilateral KD]; E5 [Horizontal Pull]; E6 [Unilateral KD]; E7 [Vertical Pull]
- **BYOP 07 NO-ACCESS AESTHETICS, THURSDAY** (1): E24 [Calves] precedes E25 [Bilateral KD]; E26 [Horizontal Pull]; E27 [Unilateral KD]; E28 [Vertical Pull]
- **MM 01 FAT BURN B4 MUSCLE BUILDING, 'FRIDAY'** (2): [WK 2] G27 'SIDE RAISES' precedes G28 'MACHINE SUPPORTED ROW'; [WK 4] M27 'SIDE RAISES' precedes M28 'DB ROWS'
- **MM 01 FAT BURN B4 MUSCLE BUILDING, 'TUESDAY'** (1): [WK 3] J14 'UPRIGHT ROWS' precedes J15 'DB ROWS'
- **MM 02 BASEBALL A24 BLOCK 1, 'FRIDAY'** (4): [A25 'Week 1'] M37 [tricep] 'overhead db tricep ext' precedes M38 [shoulders] 'sesaw push press'; [O22 'WK 2'] AE37 [tricep] 'tate press' precedes AE38 [shoulders] 'db push press'; [AG22 'wk 3'] AW37 [tricep] 'offset pushups' precedes AW38 [shoulders] 'bent over rows'; [DA25 'wk 7'] DQ38 [tricep] 'cable overhead tricep extensions' precedes DQ39 [shoulders] 'Pushups'
- **MM 02 BASEBALL A24 BLOCK 1, 'TUESDAY'** (1): [AY22 'wk 4'] BG37 [tricep] 'Ropte Tricep Extensions' precedes BG38 [shoulders] 'Single Arm DB snatch from floor'
- **MM 02 BASEBALL A41 BLOCK 2, 'FRIDAY'** (1): [A42 'WK 1'] Q55 [tricep] 'offset pushups' precedes Q56 [shoulders] 'bent over sesaw rows'
- **MM 02 BASEBALL A41 BLOCK 2, 'TUESDAY'** (1): [S42 'wk 2'] AA55 [tricep] 'Ropte Tricep Extensions' precedes AA56 [shoulders] 'Single Arm DB snatch from floor'
- **MM 02 BASEBALL A59 BLOCK 3, 'FRIDAY'** (5): [CU61 'WEEK 7 (04/17 TO 04/21)'] DK72 [tricep] 'tate press' precedes DK73 [shoulders] 'DB HIGH PULL'; [A61 'Week 1'] M73 [tricep] 'overhead db tricep ext' precedes M74 [shoulders] 'sesaw push press; [O61 'week 2'] AE73 [tricep] 'offset pushups precedes AE74 [shoulders] 'bent over sesaw rows; [AT61 'week 4'] BJ73 [tricep] 'Tríceps dips' precedes BJ74 [shoulders] 'KB high pull'; [BK61 'WEEK 5'] CA73 [tricep] 'tate press' precedes CA74 [shoulders] 'sesaw shoulder presses'
- **MM 04 4 TRACKS A30 AESTHETICS left, 'TUESDAY'** (2): [WK3] G43 'UPRIGHT ROWS' precedes G44 'DB ROWS'; [WK7] K43 'UPRIGHT ROWS' precedes K44 'DB ROWS'
- **MM 04 4 TRACKS A30 AESTHETICS left, 'FRIDAY'** (2): [WK3] G57 'UPRIGHT ROWS' precedes G59 'DB ROWS'; [WK7] K57 'UPRIGHT ROWS' precedes K59 'DB ROWS'
- **MM 04 4 TRACKS A30 AESTHETICS right, 'MONDAY' (M38 'PUSH')** (12): [WK1 (A WEEK)] O35 'cable Side Raises' precedes O36 'Incline bench'; O38 'Machine Dips or dips'; O37 'low to high FLIES' precedes O38 'Machine Dips or dips'; [WK2 (B WEEK)] P35 'DB side raises' precedes P36 'bench press'; P38 'Machine Dips or dips'; P37 'machine or db flies' precedes P38 'Machine Dips or dips'; [WK3 (A WEEK)] Q35 'cable Side Raises' precedes Q36 'Incline bench'; Q38 'Machine Dips or dips'; Q37 'low to high FLIES' precedes Q38 'Machine Dips or dips'; [WK4 (B WEEK)] R35 'DB side raises' precedes R36 'bench press'; R38 'Machine Dips or dips'; R37 'machine or db flies' precedes R38 'Machine Dips or dips'; [WK5 (A WEEK)] S35 'cable Side Raises' precedes S36 'Incline bench'; S38 'Machine Dips or dips'; S37 'low to high FLIES' precedes S38 'Machine Dips or dips'; [WK6 (BWEEK)] T35 'DB side raises' precedes T36 'bench press'; T38 'Machine Dips or dips'; T37 'machine or db flies' precedes T38 'Machine Dips or dips'; [WK7 (A WEEK LOWER)] U35 'cable Side Raises' precedes U36 'Incline bench'; U38 'Machine Dips or dips'; U37 'low to high FLIES' precedes U38 'Machine Dips or dips'; [WK8] V37 'machine or db flies' precedes V38 'Machine Dips or dips'; [WK9] W35 'Cable or DB side raises' precedes W36 'bench press'; W38 'machine dips or dips'; W37 'high to low cable flies' precedes W38 'machine dips or dips'; [WK10] X37 'machine or db flies' precedes X38 'Machine Dips or dips'; [WK11] Y35 'Cable or DB side raises' precedes Y36 'bench press'; Y38 'machine dips or dips'; Y37 'high to low cable flies' precedes Y38 'machine dips or dips'; [WK12] Z37 'machine or db flies' precedes Z38 'Machine Dips or dips'
- **MM 04 4 TRACKS A30 AESTHETICS right, 'THURSDAY' (M54 'PUSH')** (12): [WK1 (A WEEK)] O51 'cable side raises' precedes O52 'incline bench press'; [WK2 (B WEEK)] P51 'DB side raises' precedes P52 'bench press'; P54 'Machine Dips or dips'; P53 'machine or db flies' precedes P54 'Machine Dips or dips'; [WK3 (A WEEK)] Q51 'cable side raises' precedes Q52 'incline bench press'; [WK4 (B WEEK)] R51 'DB side raises' precedes R52 'bench press'; R54 'Machine Dips or dips'; R53 'machine or db flies' precedes R54 'Machine Dips or dips'; [WK5 (A WEEK)] S51 'cable side raises' precedes S52 'incline bench press'; [WK6 (BWEEK)] T51 'DB side raises' precedes T52 'bench press'; T54 'Machine Dips or dips'; T53 'machine or db flies' precedes T54 'Machine Dips or dips'; [WK7 (A WEEK LOWER)] U51 'cable side raises' precedes U52 'incline bench press'; [WK8] V51 'DB side raises' precedes V52 'bench press'; V54 'Machine Dips or dips'; V53 'machine or db flies' precedes V54 'Machine Dips or dips'; [WK9] W51 'Cable or DB side raises' precedes W52 'bench press + superset with max pushup set (only 1 set of max pushups '; W54 'machine dips or dips'; W53 'high to low cable flies' precedes W54 'machine dips or dips'; [WK10] X53 'machine or db flies' precedes X54 'Machine Dips or dips'; [WK11] Y51 'Cable or DB side raises' precedes Y52 'bench press + superset with max pushup set (only 1 set of max pushups '; Y54 'machine dips or dips'; Y53 'high to low cable flies' precedes Y54 'machine dips or dips'; [WK12] Z53 'machine or db flies' precedes Z54 'Machine Dips or dips'
- **MM 04 4 TRACKS A30 AESTHETICS right, 'WEDNESDAY ' (M49 'PULL')** (4): [WK9] W48 'machine or db Reverse flies' precedes W49 'bent over db row'; [WK10] X48 'machine or db Reverse flies' precedes X49 'bent over db row'; [WK11] Y48 'machine or db Reverse flies' precedes Y49 'bent over db row'; [WK12] Z48 'machine or db Reverse flies' precedes Z49 'bent over db row'
- **MM 04 4 TRACKS A30 AESTHETICS right, 'FRIDAY' (legs)** (4): [WK9] W59 'Leg extension one leg at a time' precedes W61 '2 sets LEG PRESS MYO - 15-5-5-5-5-5'; W60 'leg curls one leg at a time' precedes W61 '2 sets LEG PRESS MYO - 15-5-5-5-5-5'; [WK10] X59 'Leg extension one leg at a time' precedes X61 '2 sets LEG PRESS MYO - 15-5-5-5-5-5'; X60 'leg curls one leg at a time' precedes X61 '2 sets LEG PRESS MYO - 15-5-5-5-5-5'; [WK11] Y59 'Leg extension one leg at a time' precedes Y61 '2 sets LEG PRESS MYO - 15-5-5-5-5-5'; Y60 'leg curls one leg at a time' precedes Y61 '2 sets LEG PRESS MYO - 15-5-5-5-5-5'; [WK12] Z59 'Leg extension one leg at a time' precedes Z61 '3 sets LEG PRESS MYO - 15-5-5-5-5-5'; Z60 'leg curls one leg at a time' precedes Z61 '3 sets LEG PRESS MYO - 15-5-5-5-5-5'
- **MM 04 4 TRACKS A30 AESTHETICS right, 'SATURDAY' (M64 'PULL')** (4): [WK9] W64 'machine or db Reverse flies' precedes W65 'bent over db row'; [WK10] X64 'machine or db Reverse flies' precedes X65 'bent over db row'; [WK11] Y64 'machine or db Reverse flies' precedes Y65 'bent over db row'; [WK12] Z64 'machine or db Reverse flies' precedes Z65 'bent over db row'
- **MM 05 ATHLETIC FB H9 ' ADVANCED OFF SEASON WORKOUTS', WORKOUT 4** (1): J40 'Heel raises & fast/rythmic/1/4 SQUATS' precedes J41 'Lateral Step ups IPSILATERAL loading'; J42 'Db Staggered Hang Snatch'
- **MM 06 PPL A10 'NOVICE', 'PUSH DAY WORKOUT' (ADAY)** (1): C17 'Side raises' precedes C18 'Barbell Bench press'; C19 'Dips'
- **MM 06 PPL A10 'NOVICE', 'PULL DAY WORKOUT' (BDAY)** (1): C27 'DB Reverse Flies or Machine' precedes C28 'Cable Lat pulldown'
- **MM 06 PPL E10 'NEWBY', 'PUSH DAY WORKOUT' (ADAY)** (1): G17 'Side raises' precedes G18 'Barbell Bench press'; G19 'Dips'
- **MM 06 PPL E10 'NEWBY', 'PULL DAY WORKOUT' (BDAY)** (1): G27 'DB Reverse Flies or Machine' precedes G28 'Pull ups or Cable Lat pull down'
- **MM 06 PPL I10 'INTERMEDIATE', 'PUSH DAY WORKOUT' (ADAY)** (1): K17 'Side raises' precedes K18 'Barbell Bench press'; K19 'Dips'
- **MM 06 PPL I10 'INTERMEDIATE', 'PULL DAY WORKOUT' (BDAY)** (1): K27 'DB Reverse Flies or Machine' precedes K28 'Pull ups or Cable Lat pull down'
- **MM 07 BOXING, 'THURSDAY OFF SEASON WORK'** (1): [Week 3-8 (col L)] L33 'Side Raises + Front Raises' precedes L35 'Hang Power Clean & Press'; L36 'Weighted Bulgarian Lunge Heel held up + SL Def. Weighted Calf Raises'

</details>

### R7. Big muscles before small muscles

*Operational test:* BIG = squat/hinge/lunge/row/pull/press/OLY + quad, ham and chest isolation; SMALL = side/rear delt, bicep, tricep, calf isolation. Exception if a SMALL item sits above any BIG item.

**Result: 178 / 244 applicable sessions compliant (73%); 66 exception sessions.**

| Tab | Applicable | Compliant | % |
|---|---:|---:|---:|
| BYOP 00 AESTHETICS 4D | 4 | 2 | 50% |
| BYOP 01 3 DAY BUILDER | 1 | 0 | 0% |
| BYOP 02 PPL | 4 | 4 | 100% |
| BYOP 03 ATHLETIC 4D | 2 | 2 | 100% |
| BYOP 04 JUSTICE LEAGUE | 2 | 2 | 100% |
| BYOP 05 BOOTCAMP 1 | 4 | 2 | 50% |
| BYOP 06 BOOTCAMP 2 | 4 | 2 | 50% |
| BYOP 07 NO-ACCESS AESTHETICS | 4 | 2 | 50% |
| BYOP 08 NO-ACCESS ATHLETIC | 2 | 2 | 100% |
| MM 00 UPPER/LOWER | 6 | 6 | 100% |
| MM 01 FAT BURN | 8 | 5 | 62% |
| MM 02 BASEBALL | 92 | 80 | 87% |
| MM 04 4 TRACKS | 87 | 56 | 64% |
| MM 05 ATHLETIC FB | 6 | 2 | 33% |
| MM 06 PPL | 9 | 3 | 33% |
| MM 07 BOXING | 2 | 1 | 50% |
| MM 12 CONJUGATE | 7 | 7 | 100% |

* Same drivers as R6, plus BYOP 00/07 Day 1: 'Bicep' (row 8) is above 'Leg Extensions' (row 9). The arm isolation comes before the lower isolation finisher, so the end of the session alternates upper/lower even in isolations (INFERRED, see R8). BOOTCAMP 1 MON/THU: 'Bicep' and 'Calves' (rows 7-8) above 'Leg Extensions' (row 9).
* **INFERRED:** the coach does not follow a strict big-to-small rule. He follows *compound block -> isolation block*, and inside the isolation block he alternates regions. Two deliberate deviations are calves first and side raises first on bodybuilding days.

<details><summary>Every exception (tab, day, cells)</summary>

- **BYOP 00 AESTHETICS 4D, Day 1** (1): D3 [Calves] 'Machine Calf Raises' precedes D4 [Bilateral KD] 'Leg press'; D5 [Horizontal Pull] 'Bent Over Barbell Rows'; D6 [Unilateral KD] 'Reverse Lunges'; D7 [Vertical Pull] 'Lat Pulldown Pronated Grip'; D9 [Leg Extensions] 'Leg Extensions'; D8 [Bicep] 'Ez Bar Curls' precedes D9 [Leg Extensions] 'Leg Extensions'
- **BYOP 00 AESTHETICS 4D, Day 3** (1): D24 [Calves] precedes D25 [Bilateral KD]; D26 [Horizontal Pull]; D27 [Unilateral KD]; D28 [Vertical Pull]; D30 [Leg Extensions]; D29 [Bicep] precedes D30 [Leg Extensions]
- **BYOP 01 3 DAY BUILDER, DAY 1** (1): D3 [Calves] precedes D4 [Bilateral KD]; D5 [Horizontal Pull]; D6 [Unilateral KD]; D7 [Vertical Pull]
- **BYOP 05 BOOTCAMP 1, MONDAY** (1): E7 [Bicep] precedes E9 [Leg Extensions]; E8 [Calves] precedes E9 [Leg Extensions]
- **BYOP 05 BOOTCAMP 1, THURSDAY** (1): E28 [Bicep] precedes E30 [Leg Extensions] 'Leg extensions'; E29 [Calves] precedes E30 [Leg Extensions] 'Leg extensions'
- **BYOP 06 BOOTCAMP 2, 2A** (1): E10 [Bicep] precedes E11 [Vertical Push]
- **BYOP 06 BOOTCAMP 2, 2B** (1): E25 [Bicep] precedes E26 [Vertical Push]
- **BYOP 07 NO-ACCESS AESTHETICS, MONDAY** (1): E3 [Calves] precedes E4 [Bilateral KD]; E5 [Horizontal Pull]; E6 [Unilateral KD]; E7 [Vertical Pull]; E9 [Leg Extensions]; E8 [Bicep] precedes E9 [Leg Extensions]
- **BYOP 07 NO-ACCESS AESTHETICS, THURSDAY** (1): E24 [Calves] precedes E25 [Bilateral KD]; E26 [Horizontal Pull]; E27 [Unilateral KD]; E28 [Vertical Pull]; E30 [Leg Extensions]; E29 [Bicep] precedes E30 [Leg Extensions]
- **MM 01 FAT BURN B4 MUSCLE BUILDING, 'FRIDAY'** (2): [WK 2] G27 'SIDE RAISES' precedes G28 'MACHINE SUPPORTED ROW'; [WK 4] M27 'SIDE RAISES' precedes M28 'DB ROWS'
- **MM 01 FAT BURN B4 MUSCLE BUILDING, 'TUESDAY'** (1): [WK 3] J14 'UPRIGHT ROWS' precedes J15 'DB ROWS'
- **MM 02 BASEBALL A24 BLOCK 1, 'FRIDAY'** (4): [A25 'Week 1'] M37 [tricep] 'overhead db tricep ext' precedes M38 [shoulders] 'sesaw push press'; [O22 'WK 2'] AE37 [tricep] 'tate press' precedes AE38 [shoulders] 'db push press'; [AG22 'wk 3'] AW37 [tricep] 'offset pushups' precedes AW38 [shoulders] 'bent over rows'; [DA25 'wk 7'] DQ38 [tricep] 'cable overhead tricep extensions' precedes DQ39 [shoulders] 'Pushups'
- **MM 02 BASEBALL A24 BLOCK 1, 'TUESDAY'** (1): [AY22 'wk 4'] BG37 [tricep] 'Ropte Tricep Extensions' precedes BG38 [shoulders] 'Single Arm DB snatch from floor'
- **MM 02 BASEBALL A41 BLOCK 2, 'FRIDAY'** (1): [A42 'WK 1'] Q55 [tricep] 'offset pushups' precedes Q56 [shoulders] 'bent over sesaw rows'
- **MM 02 BASEBALL A41 BLOCK 2, 'TUESDAY'** (1): [S42 'wk 2'] AA55 [tricep] 'Ropte Tricep Extensions' precedes AA56 [shoulders] 'Single Arm DB snatch from floor'
- **MM 02 BASEBALL A59 BLOCK 3, 'FRIDAY'** (5): [CU61 'WEEK 7 (04/17 TO 04/21)'] DK72 [tricep] 'tate press' precedes DK73 [shoulders] 'DB HIGH PULL'; [A61 'Week 1'] M73 [tricep] 'overhead db tricep ext' precedes M74 [shoulders] 'sesaw push press; [O61 'week 2'] AE73 [tricep] 'offset pushups precedes AE74 [shoulders] 'bent over sesaw rows; [AT61 'week 4'] BJ73 [tricep] 'Tríceps dips' precedes BJ74 [shoulders] 'KB high pull'; [BK61 'WEEK 5'] CA73 [tricep] 'tate press' precedes CA74 [shoulders] 'sesaw shoulder presses'
- **MM 04 4 TRACKS A30 AESTHETICS left, 'TUESDAY'** (2): [WK3] G43 'UPRIGHT ROWS' precedes G44 'DB ROWS'; [WK7] K43 'UPRIGHT ROWS' precedes K44 'DB ROWS'
- **MM 04 4 TRACKS A30 AESTHETICS left, 'FRIDAY'** (2): [WK3] G57 'UPRIGHT ROWS' precedes G59 'DB ROWS'; [WK7] K57 'UPRIGHT ROWS' precedes K59 'DB ROWS'
- **MM 04 4 TRACKS A30 AESTHETICS right, 'MONDAY' (M38 'PUSH')** (9): [WK1 (A WEEK)] O35 'cable Side Raises' precedes O36 'Incline bench'; O37 'low to high FLIES'; O38 'Machine Dips or dips'; [WK2 (B WEEK)] P35 'DB side raises' precedes P36 'bench press'; P37 'machine or db flies'; P38 'Machine Dips or dips'; [WK3 (A WEEK)] Q35 'cable Side Raises' precedes Q36 'Incline bench'; Q37 'low to high FLIES'; Q38 'Machine Dips or dips'; [WK4 (B WEEK)] R35 'DB side raises' precedes R36 'bench press'; R37 'machine or db flies'; R38 'Machine Dips or dips'; [WK5 (A WEEK)] S35 'cable Side Raises' precedes S36 'Incline bench'; S37 'low to high FLIES'; S38 'Machine Dips or dips'; [WK6 (BWEEK)] T35 'DB side raises' precedes T36 'bench press'; T37 'machine or db flies'; T38 'Machine Dips or dips'; [WK7 (A WEEK LOWER)] U35 'cable Side Raises' precedes U36 'Incline bench'; U37 'low to high FLIES'; U38 'Machine Dips or dips'; [WK9] W35 'Cable or DB side raises' precedes W36 'bench press'; W37 'high to low cable flies'; W38 'machine dips or dips'; [WK11] Y35 'Cable or DB side raises' precedes Y36 'bench press'; Y37 'high to low cable flies'; Y38 'machine dips or dips'
- **MM 04 4 TRACKS A30 AESTHETICS right, 'THURSDAY' (M54 'PUSH')** (10): [WK1 (A WEEK)] O51 'cable side raises' precedes O52 'incline bench press'; O53 'high to low FLIES'; [WK2 (B WEEK)] P51 'DB side raises' precedes P52 'bench press'; P53 'machine or db flies'; P54 'Machine Dips or dips'; [WK3 (A WEEK)] Q51 'cable side raises' precedes Q52 'incline bench press'; Q53 'high to low FLIES'; [WK4 (B WEEK)] R51 'DB side raises' precedes R52 'bench press'; R53 'machine or db flies'; R54 'Machine Dips or dips'; [WK5 (A WEEK)] S51 'cable side raises' precedes S52 'incline bench press'; S53 'high to low FLIES'; [WK6 (BWEEK)] T51 'DB side raises' precedes T52 'bench press'; T53 'machine or db flies'; T54 'Machine Dips or dips'; [WK7 (A WEEK LOWER)] U51 'cable side raises' precedes U52 'incline bench press'; U53 'high to low FLIES'; [WK8] V51 'DB side raises' precedes V52 'bench press'; V53 'machine or db flies'; V54 'Machine Dips or dips'; [WK9] W51 'Cable or DB side raises' precedes W52 'bench press + superset with max pushup set (only 1 set of max pushups '; W53 'high to low cable flies'; W54 'machine dips or dips'; [WK11] Y51 'Cable or DB side raises' precedes Y52 'bench press + superset with max pushup set (only 1 set of max pushups '; Y53 'high to low cable flies'; Y54 'machine dips or dips'
- **MM 04 4 TRACKS A30 AESTHETICS right, 'WEDNESDAY ' (M49 'PULL')** (4): [WK9] W48 'machine or db Reverse flies' precedes W49 'bent over db row'; [WK10] X48 'machine or db Reverse flies' precedes X49 'bent over db row'; [WK11] Y48 'machine or db Reverse flies' precedes Y49 'bent over db row'; [WK12] Z48 'machine or db Reverse flies' precedes Z49 'bent over db row'
- **MM 04 4 TRACKS A30 AESTHETICS right, 'SATURDAY' (M64 'PULL')** (4): [WK9] W64 'machine or db Reverse flies' precedes W65 'bent over db row'; [WK10] X64 'machine or db Reverse flies' precedes X65 'bent over db row'; [WK11] Y64 'machine or db Reverse flies' precedes Y65 'bent over db row'; [WK12] Z64 'machine or db Reverse flies' precedes Z65 'bent over db row'
- **MM 05 ATHLETIC FB A9 'STARTING OFF SEASON WORKOUTS', WORKOUT 3** (1): C38 'SUPERSET: Dead bugs + Front Raises + Side Raises' precedes C39 'Superset: leg ext. leg curls (MID WEIGHT)'
- **MM 05 ATHLETIC FB D9 ' MID OFF SEASON WORKOUTS', WORKOUT 1** (1): F20 'Heavy curls & Heavy tricep kickbakcs 12 on each side' precedes F21 'Plate core & leg extensions / nordic curls'
- **MM 05 ATHLETIC FB H9 ' ADVANCED OFF SEASON WORKOUTS', WORKOUT 3** (1): J34 'Heavy curls & Heavy tricep kickbakcs 12 on each side' precedes J35 'Plate core & leg extensions'
- **MM 05 ATHLETIC FB H9 ' ADVANCED OFF SEASON WORKOUTS', WORKOUT 4** (1): J40 'Heel raises & fast/rythmic/1/4 SQUATS' precedes J41 'Lateral Step ups IPSILATERAL loading'; J42 'Db Staggered Hang Snatch'
- **MM 06 PPL A10 'NOVICE', 'PUSH DAY WORKOUT' (ADAY)** (1): C17 'Side raises' precedes C18 'Barbell Bench press'; C19 'Dips'
- **MM 06 PPL A10 'NOVICE', 'PULL DAY WORKOUT' (BDAY)** (1): C27 'DB Reverse Flies or Machine' precedes C28 'Cable Lat pulldown'
- **MM 06 PPL E10 'NEWBY', 'PUSH DAY WORKOUT' (ADAY)** (1): G17 'Side raises' precedes G18 'Barbell Bench press'; G19 'Dips'
- **MM 06 PPL E10 'NEWBY', 'PULL DAY WORKOUT' (BDAY)** (1): G27 'DB Reverse Flies or Machine' precedes G28 'Pull ups or Cable Lat pull down'
- **MM 06 PPL I10 'INTERMEDIATE', 'PUSH DAY WORKOUT' (ADAY)** (1): K17 'Side raises' precedes K18 'Barbell Bench press'; K19 'Dips'
- **MM 06 PPL I10 'INTERMEDIATE', 'PULL DAY WORKOUT' (BDAY)** (1): K27 'DB Reverse Flies or Machine' precedes K28 'Pull ups or Cable Lat pull down'
- **MM 07 BOXING, 'THURSDAY OFF SEASON WORK'** (1): [Week 3-8 (col L)] L33 'Side Raises + Front Raises' precedes L35 'Hang Power Clean & Press'; L36 'Weighted Bulgarian Lunge Heel held up + SL Def. Weighted Calf Raises'; L37 'Leg ext. Leg Curls (FULL RANGE OF MOTION)'

</details>

### R8. Alternate lower / upper (full-body sessions)

*Operational test:* session holds both lower and upper compound ROLES; compliant if no two consecutive compound items share a region (supersets in one cell count as alternating). Adjacent compound pairs alternating: 380/409. Including isolations: 100/193 sessions fully alternate.

**Result: 165 / 193 applicable sessions compliant (85%); 28 exception sessions.**

| Tab | Applicable | Compliant | % |
|---|---:|---:|---:|
| BYOP 00 AESTHETICS 4D | 4 | 4 | 100% |
| BYOP 01 3 DAY BUILDER | 3 | 2 | 67% |
| BYOP 03 ATHLETIC 4D | 4 | 4 | 100% |
| BYOP 04 JUSTICE LEAGUE | 4 | 4 | 100% |
| BYOP 05 BOOTCAMP 1 | 4 | 4 | 100% |
| BYOP 06 BOOTCAMP 2 | 6 | 4 | 67% |
| BYOP 07 NO-ACCESS AESTHETICS | 4 | 4 | 100% |
| BYOP 08 NO-ACCESS ATHLETIC | 4 | 4 | 100% |
| MM 02 BASEBALL | 92 | 91 | 99% |
| MM 04 4 TRACKS | 46 | 31 | 67% |
| MM 05 ATHLETIC FB | 6 | 5 | 83% |
| MM 07 BOXING | 2 | 1 | 50% |
| MM 12 CONJUGATE | 14 | 7 | 50% |

* **OBSERVED, BYOP full-body templates alternate perfectly:** L-U-L-U ('Bilateral KD', 'Horizontal Pull', 'Unilateral KD', 'Vertical Pull'). BASEBALL alternates by construction: Part C is a 'Superset - same reps' of a bilateral lower lift and an upper compound; Part D is unilateral lower + arm + calf/shoulder.
* **OBSERVED exceptions:** CONJUGATE and 4-TRACKS STRENGTH lower days run 'the work' (squat or deadlift) -> 'the accessory' (the other lower pattern) -> 'the nuance' (pull) -> 'the survival' (lunge or staggered DL), i.e. LLUL. HYBRID Monday is SQUATS -> CLEANS -> UNI RDLs -> DB ROWS. BOOTCAMP 2 '2A' is BHD -> HPush -> Bicep -> VPush. 3 DAY BUILDER Day 3 is 'Bilateral KD' -> 'Bilateral HD' -> 'Horizontal Pull' -> 'Horizontal Push' -> 'Unilateral KD'.

<details><summary>Every exception (tab, day, cells)</summary>

- **BYOP 01 3 DAY BUILDER, DAY 3** (1): LLUUL: D23 [Bilateral KD] -> D24 [Bilateral HD] (both lower); D25 [Horizontal Pull] -> D26 [Horizontal Push] (both upper)
- **BYOP 06 BOOTCAMP 2, 2A** (1): LUU: E9 [Horizontal Push] -> E11 [Vertical Push] (both upper)
- **BYOP 06 BOOTCAMP 2, 2B** (1): LUU: E24 [Horizontal Push] -> E26 [Vertical Push] (both upper)
- **MM 02 BASEBALL A41 BLOCK 2, 'MONDAY'** (1): [AK42 'wk 4'] LLUL: AO51 [bkd] 'Front squats - light weights - same speed for all reps' -> AO52 [bkd] 'Jump squats' (both lower)
- **MM 04 4 TRACKS A3 STRENGTH left, 'MONDAY'** (7): [WK1] LLUL: E9 [the work] 'HEAVY FRONT SQUAT (D)BOX SQUAT' -> E10 [the accessory] 'SNATCH GRIP DL' (both lower); [WK2] LLUL: F9 [the work] 'HEAVY DEFICIT DEADLIFT' -> F10 [the accessory] 'F. SQUAT (T&G)BOX' (both lower); [WK3] LLUL: G9 [the work] 'HEAVY (D)BOX HIGH BAR SQUAT' -> G10 [the accessory] 'DEF. DL or SNATCH GRIP' (both lower); [WK4] LLUL: H9 [the work] 'HEAVY CHAINED DEADLIFT' -> H10 [the accessory] '(T&G)BOX HIGH BAR SQUAT' (both lower); [WK5] LLUL: I9 [the work] 'HEAVY FRONT SQUAT' -> I10 [the accessory] 'DEF. DL or SNATCH GRIP' (both lower); [WK6] LLUL: J9 [the work] 'HEAVY DEADLIFT' -> J10 [the accessory] 'HIGH BAR SQUAT' (both lower); [WK7] LLUL: K9 [the work] 'HEAVY HIGH BAR SQUAT' -> K10 [the accessory] 'DEADLIFT' (both lower)
- **MM 04 4 TRACKS A69 HYBRID, 'MONDAY'** (8): [WK1] LLU: E74 [SQUATS] 'FRONT SQUATS' -> E76 [UNI RDLs] 'UNI RDL/ CORE/ UNI GB' (both lower); [WK2] LLU: F74 [SQUATS] 'BACK SQUATS' -> F76 [UNI RDLs] 'UNI RDL/ CORE/ UNI GB' (both lower); [WK3] LLU: G74 [SQUATS] 'FRONT SQUATS' -> G76 [UNI RDLs] 'UNI RDL/ CORE/ UNI GB' (both lower); [WK4] LLU: H74 [SQUATS] 'BACK SQUATS' -> H76 [UNI RDLs] 'UNI RDL/ CORE/ UNI GB' (both lower); [WK5] LLU: I74 [SQUATS] 'FRONT SQUATS' -> I76 [UNI RDLs] 'UNI RDL/ CORE/ UNI GB' (both lower); [WK6] LLU: J74 [SQUATS] 'BACK SQUATS' -> J76 [UNI RDLs] 'UNI RDL/ CORE/ UNI GB' (both lower); [WK7] LLU: K74 [SQUATS] 'FRONT SQUATS' -> K76 [UNI RDLs] 'UNI RDL/ CORE/ UNI GB' (both lower); [WK8] LLU: L74 [SQUATS] 'BACK SQUATS' -> L76 [UNI RDLs] 'UNI RDL/ CORE/ UNI GB' (both lower)
- **MM 05 ATHLETIC FB A9 'STARTING OFF SEASON WORKOUTS', WORKOUT 1** (1): ULLU: C17 'SUPERSET: HEAVY Hex bar Squats direclty into 10 Repeat Jump Squat HIGH' -> C18 'SUPERSET: HEAVY Ipsilateral DB front foot elevated lunge directly into' (both lower)
- **MM 07 BOXING, 'TUESDAY OFF SEASON WORK'** (1): [Week 3-8 (col L)] ULL: L22 '3 Heavy SQUATs + 5 Tuck jumps + 5 DB squat jumps + 5 Squirrel jumps' -> L23 'Jefferson Lunge' (both lower)
- **MM 12 CONJUGATE, 'MONDAY'** (7): [WK1] LLUL: E13 [the work] 'HEAVY FRONT SQUAT (D)BOX SQUAT' -> E14 [the accessory] 'SNATCH GRIP DL' (both lower); [WK2] LLUL: F13 [the work] 'HEAVY DEFICIT DEADLIFT' -> F14 [the accessory] 'F. SQUAT (T&G)BOX' (both lower); [WK3] LLUL: G13 [the work] 'HEAVY (D)BOX HIGH BAR SQUAT' -> G14 [the accessory] 'SNATCH GRIP DL' (both lower); [WK4] LLUL: H13 [the work] 'HEAVY CHAINED DEADLIFT' -> H14 [the accessory] '(T&G)BOX HIGH BAR SQUAT' (both lower); [WK5] LLUL: I13 [the work] 'HEAVY FRONT SQUAT' -> I14 [the accessory] 'SNATCH GRIP DL' (both lower); [WK6] LLUL: J13 [the work] 'HEAVY DEADLIFT' -> J14 [the accessory] 'HIGH BAR SQUAT' (both lower); [WK7] LLUL: K13 [the work] 'HEAVY HIGH BAR SQUAT' -> K14 [the accessory] 'DEADLIFT' (both lower)

</details>

### R9. Knee-dominant paired with pull, hip-dominant paired with push

*Operational test:* adjacent lower/upper compound ROLES are paired (lower item + the upper item next to it); compliant if every pair is KD+PULL or HD+PUSH. Pairs found: {'KD+PULL': 104, 'HD+PUSH': 82, 'HD+PULL': 27, 'KD+PUSH': 9}. Day-level mix (lower families + upper families present): {'KD+PULL': 24, 'HD+PUSH': 21, 'KDHD+PULLPUSH': 5, 'KDHD+PULL': 76, 'KDHD+PUSH': 46, 'HD+PULL': 7, 'KD+PULLPUSH': 11, 'HD+PULLPUSH': 2, 'KD+PUSH': 1}.

**Result: 160 / 193 applicable sessions compliant (83%); 33 exception sessions.**

| Tab | Applicable | Compliant | % |
|---|---:|---:|---:|
| BYOP 00 AESTHETICS 4D | 4 | 4 | 100% |
| BYOP 01 3 DAY BUILDER | 3 | 2 | 67% |
| BYOP 03 ATHLETIC 4D | 4 | 4 | 100% |
| BYOP 04 JUSTICE LEAGUE | 4 | 4 | 100% |
| BYOP 05 BOOTCAMP 1 | 4 | 2 | 50% |
| BYOP 06 BOOTCAMP 2 | 6 | 6 | 100% |
| BYOP 07 NO-ACCESS AESTHETICS | 4 | 4 | 100% |
| BYOP 08 NO-ACCESS ATHLETIC | 4 | 4 | 100% |
| MM 02 BASEBALL | 92 | 92 | 100% |
| MM 04 4 TRACKS | 46 | 27 | 59% |
| MM 05 ATHLETIC FB | 6 | 3 | 50% |
| MM 07 BOXING | 2 | 1 | 50% |
| MM 12 CONJUGATE | 14 | 7 | 50% |

* **OBSERVED, strong rule.** KD+PULL and HD+PUSH make up 186 of 222 pairs. BYOP 00/03/04/07/08: Day 1/3 = KD + both pulls; Day 2/4 = HD + both pushes. BASEBALL 92/92: Mon 'bkd'+'horiz pull', Tue 'bhd'+'horiz push', Thu 'bkd'+'vert pull', Fri 'bhd'+'vert push'. CROSSFIT grid: 'KNEE DOM' Mon / 'PULL' Tue / 'HIP DOM' Thu / 'PUSH' Fri (row 31).
* **OBSERVED, the inverse template exists:** BOOTCAMP OPTION 1 Tue/Fri = 'Bilateral HD'+'Vertical Pull', 'Unilateral KD'+'Horizontal Push'. Mon/Thu = 'Bilateral KD'+'Horizontal Pull', 'Unilateral HD'+'Vertical Push'. Each bootcamp day therefore holds one pull and one push and both lower patterns, i.e. a full-body balance per day. 3 DAY BUILDER Day 3 does the same (HD+PULL, KD+PUSH) because it is the 'everything' day.
* CONJUGATE / 4-TRACKS STRENGTH lower days add one pull ('PULL UPS' or 'DB ROWS 8/8') as 'the nuance' after the hinge accessory, so it reads HD+PULL. HYBRID Monday reads 'UNI RDLs' + 'DB ROWS'.

<details><summary>Every exception (tab, day, cells)</summary>

- **BYOP 01 3 DAY BUILDER, DAY 3** (1): HD+PULL: D24 [Bilateral HD] with D25 [Horizontal Pull]; KD+PUSH: D27 [Unilateral KD] with D26 [Horizontal Push]
- **BYOP 05 BOOTCAMP 1, TUESDAY** (1): HD+PULL: E10 [Bilateral HD] with E11 [Vertical Pull]; KD+PUSH: E12 [Unilateral KD] with E13 [Horizontal Push]
- **BYOP 05 BOOTCAMP 1, FRIDAY** (1): HD+PULL: E31 [Bilateral HD] with E32 [Vertical Pull]; KD+PUSH: E33 [Unilateral KD] with E34 [Horizontal Push]
- **MM 04 4 TRACKS A3 STRENGTH left, 'MONDAY'** (4): [WK1] HD+PULL: E10 [the accessory] 'SNATCH GRIP DL' with E11 [the nuance] 'PULL UPS'; [WK3] HD+PULL: G10 [the accessory] 'DEF. DL or SNATCH GRIP' with G11 [the nuance] 'PULL UPS'; [WK5] HD+PULL: I10 [the accessory] 'DEF. DL or SNATCH GRIP' with I11 [the nuance] 'PULL UPS'; [WK7] HD+PULL: K10 [the accessory] 'DEADLIFT' with K11 [the nuance] 'PULL UPS'
- **MM 04 4 TRACKS A3 STRENGTH left, 'THURSDAY'** (3): [WK2] HD+PULL: F18 [the accessory] 'FAST BANDED DL' with F19 [the nuance] 'DB ROWS 8/8'; [WK4] HD+PULL: H18 [the accessory] 'FAST BANDED DL' with H19 [the nuance] 'DB ROWS 8/8'; [WK6] HD+PULL: J18 [the accessory] 'FAST DEADLIFT' with J19 [the nuance] 'DB ROWS 8/8'
- **MM 04 4 TRACKS A69 HYBRID, 'MONDAY'** (8): [WK1] HD+PULL: E76 [UNI RDLs] 'UNI RDL/ CORE/ UNI GB' with E77 [DB ROWS] 'UPPER ACCESORY'; [WK2] HD+PULL: F76 [UNI RDLs] 'UNI RDL/ CORE/ UNI GB' with F77 [DB ROWS] 'UPPER ACCESORY'; [WK3] HD+PULL: G76 [UNI RDLs] 'UNI RDL/ CORE/ UNI GB' with G77 [DB ROWS] 'UPPER ACCESORY'; [WK4] HD+PULL: H76 [UNI RDLs] 'UNI RDL/ CORE/ UNI GB' with H77 [DB ROWS] 'UPPER ACCESORY'; [WK5] HD+PULL: I76 [UNI RDLs] 'UNI RDL/ CORE/ UNI GB' with I77 [DB ROWS] 'UPPER ACCESORY'; [WK6] HD+PULL: J76 [UNI RDLs] 'UNI RDL/ CORE/ UNI GB' with J77 [DB ROWS] 'UPPER ACCESORY'; [WK7] HD+PULL: K76 [UNI RDLs] 'UNI RDL/ CORE/ UNI GB' with K77 [DB ROWS] 'UPPER ACCESORY'; [WK8] HD+PULL: L76 [UNI RDLs] 'UNI RDL/ CORE/ UNI GB' with L77 [DB ROWS] 'UPPER ACCESORY'
- **MM 04 4 TRACKS A69 HYBRID, 'SATURDAY'** (4): [WK1] KD+PUSH: E100 [STEP UPS] 'FF & RFE Lunge goblet / T2B/ hand switch pushups' with E100 [STEP UPS] 'FF & RFE Lunge goblet / T2B/ hand switch pushups'; [WK3] KD+PUSH: G100 [STEP UPS] 'FF & RFE Lunge/ T2B/ db bench press' with G100 [STEP UPS] 'FF & RFE Lunge/ T2B/ db bench press'; [WK5] KD+PUSH: I100 [STEP UPS] 'FF & RFE Lunge goblet / T2B/ pushups' with I100 [STEP UPS] 'FF & RFE Lunge goblet / T2B/ pushups'; [WK7] KD+PUSH: K100 [STEP UPS] 'FF & RFE Lunge/ T2B/ db bench press' with K100 [STEP UPS] 'FF & RFE Lunge/ T2B/ db bench press'
- **MM 05 ATHLETIC FB A9 'STARTING OFF SEASON WORKOUTS', WORKOUT 1** (1): KD+PUSH: C18 'SUPERSET: HEAVY Ipsilateral DB front foot elevated lunge directly into' with C19 'Standing Overhead DB sesaw push presses'
- **MM 05 ATHLETIC FB A9 'STARTING OFF SEASON WORKOUTS', WORKOUT 2** (1): HD+PULL: C26 'KB Swings + 12/12 Single leg Glute bridges' with C27 'Banded fast LAT PULL DOWNS Single Arm'
- **MM 05 ATHLETIC FB D9 ' MID OFF SEASON WORKOUTS', WORKOUT 3** (1): HD+PULL: F46 'Unilateral Deadlift DB loaded' with F47 'Max speed banded lat pull downs half kneeling ipsilateral'
- **MM 07 BOXING, 'THURSDAY OFF SEASON WORK'** (1): [Week 3-8 (col L)] KD+PUSH: L36 'Weighted Bulgarian Lunge Heel held up + SL Def. Weighted Calf Raises' with L35 'Hang Power Clean & Press'
- **MM 12 CONJUGATE, 'MONDAY'** (4): [WK1] HD+PULL: E14 [the accessory] 'SNATCH GRIP DL' with E15 [the nuance] 'PULL UPS'; [WK3] HD+PULL: G14 [the accessory] 'SNATCH GRIP DL' with G15 [the nuance] 'PULL UPS'; [WK5] HD+PULL: I14 [the accessory] 'SNATCH GRIP DL' with I15 [the nuance] 'PULL UPS'; [WK7] HD+PULL: K14 [the accessory] 'DEADLIFT' with K15 [the nuance] 'PULL UPS'
- **MM 12 CONJUGATE, 'THURSDAY'** (3): [WK2] HD+PULL: F22 [the accessory] 'FAST BANDED DL' with F23 [the nuance] 'DB ROWS 8/8'; [WK4] HD+PULL: H22 [the accessory] 'FAST CHAINED DL' with H23 [the nuance] 'DB ROWS 8/8'; [WK6] HD+PULL: J22 [the accessory] 'FAST DEADLIFT' with J23 [the nuance] 'DB ROWS 8/8'

</details>

### R10-core. Core at the end of the session or on a separate day

*Operational test:* compliant if every CORE item sits below all other work or the session is a separate/optional day. Position counts: {'separate day (no other work)': 19, 'at end': 3, 'after athletic/power block, before strength': 120, 'embedded in strength superset': 46, 'first in session': 4}.

**Result: 22 / 165 applicable sessions compliant (13%); 143 exception sessions.**

| Tab | Applicable | Compliant | % |
|---|---:|---:|---:|
| BYOP 00 AESTHETICS 4D | 2 | 2 | 100% |
| BYOP 01 3 DAY BUILDER | 3 | 3 | 100% |
| BYOP 03 ATHLETIC 4D | 2 | 2 | 100% |
| BYOP 04 JUSTICE LEAGUE | 2 | 2 | 100% |
| BYOP 05 BOOTCAMP 1 | 2 | 2 | 100% |
| BYOP 06 BOOTCAMP 2 | 2 | 2 | 100% |
| BYOP 07 NO-ACCESS AESTHETICS | 2 | 2 | 100% |
| BYOP 08 NO-ACCESS ATHLETIC | 2 | 2 | 100% |
| MM 02 BASEBALL | 94 | 4 | 4% |
| MM 04 4 TRACKS | 36 | 0 | 0% |
| MM 05 ATHLETIC FB | 11 | 1 | 9% |
| MM 07 BOXING | 7 | 0 | 0% |

* **OBSERVED, aesthetic BYOP:** 'Core' lives only in the 'Optional' blocks (00 B20/B41; 01 B10/B20/B30; 05/07 WEDNESDAY/SATURDAY; 03/04/08 WEDNESDAY/SATURDAY), with 'Calves', 'Cardio' or 'Aerobic Capacity', 'Focus 1' and 'Focus 2'. That is a separate day, which complies.
* **OBSERVED, athletic programs do the opposite: core comes EARLY.** BASEBALL Part B ('LATERAL CORE' Mon, 'Transverse core' Tue/Fri, 'Sagital core' Thu) sits between Part A ballistics and Part C strength in 112 core items. MM 05 puts 'Hollow rocks', 'Med Ball Rockers' and 'Star Supine Cross Connects' between plyos and lifts. BOXING Wk1-2 puts 'Situps / Toes to bar' second. HYBRID embeds core inside strength prescriptions ('3x6 - DB bench press/ core', 'UNI RDL/ CORE/ UNI GB', 'FE contra/ DB rows/core'), i.e. core is the superset filler.
* **INFERRED:** treat 'core at the end' as an aesthetics rule only. For athletes the coach programs core as trunk-stiffness prep before loading (SCIENCE: anti-rotation/anti-extension work as an activation primer, low-fatigue) and keeps fatiguing trunk work out of the end-of-session slot, which is taken by the 'Buy out'.

<details><summary>Every exception (tab, day, cells)</summary>

- **MM 02 BASEBALL A24 BLOCK 1, 'MONDAY'** (7): [A25 'Week 1'] D30 [LATERAL CORE] 'Side planks'  <after athletic/power block, before strength>; [O22 'WK 2'] S30 [LATERAL CORE] 'Obilque sit plank'  <after athletic/power block, before strength>; [AG22 'wk 3'] AK30 [LATERAL CORE] 'COpenhagen plank'  <after athletic/power block, before strength>; [AY22 'wk 4'] BC30 [LATERAL CORE] 'Oblique sit plank  <after athletic/power block, before strength>; [BQ22 'wk 5'] BU30 [LATERAL CORE] 'Side plank star'  <after athletic/power block, before strength>; [CI25 'wk 6'] CM31 [LATERAL CORE] 'Side plank'  <after athletic/power block, before strength>; [DA25 'wk 7'] DE31 [LATERAL CORE] 'Low oblique plank  <after athletic/power block, before strength>
- **MM 02 BASEBALL A24 BLOCK 1, 'TUESDAY'** (7): [A25 'Week 1'] G30 [Transverse core] 'Hip turns'  <after athletic/power block, before strength>; [O22 'WK 2'] W30 [Transverse core] 'Cable rotational oblique twist'  <after athletic/power block, before strength>; [AG22 'wk 3'] AO30 [Transverse core] 'floor windshield whipers'  <after athletic/power block, before strength>; [AY22 'wk 4'] BG30 [Transverse core] 'Hanging lateral knees to chest  <after athletic/power block, before strength>; [BQ22 'wk 5'] BY30 [Transverse core] 'Plate russian twists'  <after athletic/power block, before strength>; [CI25 'wk 6'] CQ31 [Transverse core] 'plank Hip turns'  <after athletic/power block, before strength>; [DA25 'wk 7'] DI31 [Transverse core] 'DEad bugs  <after athletic/power block, before strength>
- **MM 02 BASEBALL A24 BLOCK 1, 'THURSDAY'** (7): [A25 'Week 1'] J30 [Sagital core] 'butterfly situps'  <after athletic/power block, before strength>; J31 'toes to bar or knees to chest'  <after athletic/power block, before strength>; [O22 'WK 2'] AA30 [Sagital core] '50 Toes to bar'  <after athletic/power block, before strength>; [AG22 'wk 3'] AS30 [Sagital core] '50 Toes to bar'  <after athletic/power block, before strength>; [AY22 'wk 4'] BK30 [Sagital core] 'Weighted leg raises medball  <after athletic/power block, before strength>; [BQ22 'wk 5'] CC30 [Sagital core] 'low plank feet on wall'  <after athletic/power block, before strength>; [CI25 'wk 6'] CU31 [Sagital core] 'med ball rockers  <after athletic/power block, before strength>; [DA25 'wk 7'] DM31 [Sagital core] 'Loaded low plank - plate on hips'  <after athletic/power block, before strength>
- **MM 02 BASEBALL A24 BLOCK 1, 'FRIDAY'** (7): [A25 'Week 1'] M30 [Transverse core] 'Cable load rotation chop'  <after athletic/power block, before strength>; [O22 'WK 2'] AE30 [Transverse core] 'Cable rotational oblique twist'  <after athletic/power block, before strength>; AE31 'plate russian twists'  <after athletic/power block, before strength>; [AG22 'wk 3'] AW30 [Transverse core] 'Cable rotational oblique twist'  <after athletic/power block, before strength>; AW31 'plate russian twists'  <after athletic/power block, before strength>; [AY22 'wk 4'] BO30 [Transverse core] 'Cable rotational oblique twist'  <after athletic/power block, before strength>; BO31 'plate russian twists'  <after athletic/power block, before strength>; [BQ22 'wk 5'] CG30 [Transverse core] 'floor windshield wipers'  <after athletic/power block, before strength>; [CI25 'wk 6'] CY31 [Transverse core] 'Swissball plate rotations'  <after athletic/power block, before strength>; [DA25 'wk 7'] DQ31 [Transverse core] 'plate russian twists'  <after athletic/power block, before strength>
- **MM 02 BASEBALL A41 BLOCK 2, 'MONDAY'** (8): [DU42 'DELOAD WEEK'] DZ46 [LATERAL CORE] 'OBLIQUE SIT'  <after athletic/power block, before strength>; [A42 'WK 1'] E47 'Single side KB carry'  <after athletic/power block, before strength>; E48 [LATERAL CORE] 'COpenhagen plank'  <after athletic/power block, before strength>; E49 'Star plank'  <after athletic/power block, before strength>; [S42 'wk 2'] W48 [LATERAL CORE] 'Oblique sit plank  <after athletic/power block, before strength>; W49 'KB Single arm farmer walk carry'  <after athletic/power block, before strength>; [AK42 'wk 4'] AO48 [LATERAL CORE] 'Side plank star'  <after athletic/power block, before strength>; [DD42 'WEEK 8'] DH48 [LATERAL CORE] 'copenhagen plank  <after athletic/power block, before strength>; [BC43 'wk 5'] BG49 [LATERAL CORE] 'Lateral crunches'  <after athletic/power block, before strength>; [BU43 'wk 6'] BY49 [LATERAL CORE] 'Low oblique plank  <after athletic/power block, before strength>; [CL43 'WEEK 7'] CQ49 [LATERAL CORE] 'Hanging Oblique Knee Raise to chest  <after athletic/power block, before strength>
- **MM 02 BASEBALL A41 BLOCK 2, 'THURSDAY'** (8): [DU42 'DELOAD WEEK'] EH46 [Sagital core] 'hallow rocks  <after athletic/power block, before strength>; [A42 'WK 1'] M48 [Sagital core] '50 Toes to bar'  <after athletic/power block, before strength>; [S42 'wk 2'] AE48 [Sagital core] 'Weighted leg raises medball  <after athletic/power block, before strength>; [AK42 'wk 4'] AW48 [Sagital core] 'Single arm/leg turkish situps  <after athletic/power block, before strength>; [DD42 'WEEK 8'] DP48 [Sagital core] 'bear crawl  <after athletic/power block, before strength>; [BC43 'wk 5'] BO49 [Sagital core] 'med ball rockers  <after athletic/power block, before strength>; [BU43 'wk 6'] CG49 [Sagital core] 'Loaded low plank - plate on hips'  <after athletic/power block, before strength>; [CL43 'WEEK 7'] CY49 [Sagital core] 'hallow rocks  <after athletic/power block, before strength>
- **MM 02 BASEBALL A41 BLOCK 2, 'FRIDAY'** (8): [DU42 'DELOAD WEEK'] EL46 [Transverse core] 'windshield wipers  <after athletic/power block, before strength>; [A42 'WK 1'] Q48 [Transverse core] 'Cable rotational oblique twist'  <after athletic/power block, before strength>; Q49 'plate russian twists'  <after athletic/power block, before strength>; [S42 'wk 2'] AI48 [Transverse core] 'Cable rotational oblique twist'  <after athletic/power block, before strength>; AI49 'plate russian twists'  <after athletic/power block, before strength>; [AK42 'wk 4'] BA48 [Transverse core] 'star supine cross connect  <after athletic/power block, before strength>; [DD42 'WEEK 8'] DT48 [Transverse core] 'cable oblique twists  <after athletic/power block, before strength>; [BC43 'wk 5'] BS49 [Transverse core] 'Swissball plate rotations'  <after athletic/power block, before strength>; [BU43 'wk 6'] CK49 [Transverse core] 'cable oblique twists  <after athletic/power block, before strength>; [CL43 'WEEK 7'] DC49 [Transverse core] 'bycicle crunches  <after athletic/power block, before strength>
- **MM 02 BASEBALL A41 BLOCK 2, 'TUESDAY'** (6): [A42 'WK 1'] I48 [Transverse core] 'heavy plate russian twists'  <after athletic/power block, before strength>; I49 'Bicycle crunches'  <after athletic/power block, before strength>; [S42 'wk 2'] AA48 [Transverse core] 'Hanging lateral knees to chest  <after athletic/power block, before strength>; [AK42 'wk 4'] AS48 [Transverse core] 'cross body mountain climbers  <after athletic/power block, before strength>; [DD42 'WEEK 8'] DL48 [Transverse core] 'fast mountain climbers cross connect  <after athletic/power block, before strength>; [BC43 'wk 5'] BK49 [Transverse core] 'plank Hip turns'  <after athletic/power block, before strength>; [BU43 'wk 6'] CC49 [Transverse core] 'DEad bugs  <after athletic/power block, before strength>
- **MM 02 BASEBALL A59 BLOCK 3, 'MONDAY'** (8): [CU61 'WEEK 7 (04/17 TO 04/21)'] CY65 [LATERAL CORE] 'Obilque sit plank'  <after athletic/power block, before strength>; [DM60 'WEEK 8'] DQ65 [LATERAL CORE] 'copenhagen plank  <after athletic/power block, before strength>; DQ66 'hips raises'  <after athletic/power block, before strength>; [A61 'Week 1'] D66 [LATERAL CORE] 'Side planks'  <after athletic/power block, before strength>; [O61 'week 2'] S65 'Single side KB carry'  <after athletic/power block, before strength>; S66 [LATERAL CORE] 'Copenhagen raises  <after athletic/power block, before strength>; S67 'Star plank  <after athletic/power block, before strength>; [AG61 'Week 3'] AJ66 [LATERAL CORE] 'Side planks hips lifts (slow)  <after athletic/power block, before strength>; [AT61 'week 4'] AX66 [LATERAL CORE] 'oblique sit'  <after athletic/power block, before strength>; AX67 'Star plank  <after athletic/power block, before strength>; [BK61 'WEEK 5'] BO66 [LATERAL CORE] 'copenhagen plank  <after athletic/power block, before strength>; [CC61 'WEEK 6'] CG66 [LATERAL CORE] 'Side plank'  <after athletic/power block, before strength>
- **MM 02 BASEBALL A59 BLOCK 3, 'TUESDAY'** (8): [CU61 'WEEK 7 (04/17 TO 04/21)'] DC65 [Transverse core] 'Cable rotational oblique twist'  <after athletic/power block, before strength>; [DM60 'WEEK 8'] DU65 [Transverse core] 'plank Hip turns'  <after athletic/power block, before strength>; [A61 'Week 1'] G66 [Transverse core] 'Hip turns  <after athletic/power block, before strength>; [O61 'week 2'] W66 [Transverse core] 'heavy plate russian twists  <after athletic/power block, before strength>; W67 'Bicycle crunches  <after athletic/power block, before strength>; [AG61 'Week 3'] AM67 'cross body mountain climbers  <after athletic/power block, before strength>; [AT61 'week 4'] BB66 [Transverse core] 'winshield wiper  <after athletic/power block, before strength>; BB67 'PLANK DB PULL THROUGH  <after athletic/power block, before strength>; [BK61 'WEEK 5'] BS66 [Transverse core] 'Cable rotational oblique twist'  <after athletic/power block, before strength>; [CC61 'WEEK 6'] CK66 [Transverse core] 'plank Hip turns'  <after athletic/power block, before strength>
- **MM 02 BASEBALL A59 BLOCK 3, 'THURSDAY'** (8): [CU61 'WEEK 7 (04/17 TO 04/21)'] DG65 [Sagital core] 'TOES TO BAR'  <after athletic/power block, before strength>; [DM60 'WEEK 8'] DY65 [Sagital core] 'med ball rockers  <after athletic/power block, before strength>; [A61 'Week 1'] J66 [Sagital core] 'butterfly situps  <after athletic/power block, before strength>; J67 'toes to bar or knees to chest  <after athletic/power block, before strength>; [O61 'week 2'] AA66 [Sagital core] '15 Toes to bar'  <after athletic/power block, before strength>; [AG61 'Week 3'] AP66 [Sagital core] 'low plank feet against wall'  <after athletic/power block, before strength>; AP67 [cross body mountain climbers 'toes to bar or knees to chest  <after athletic/power block, before strength>; [AT61 'week 4'] BF66 [Sagital core] 'feet against wall plank  <after athletic/power block, before strength>; BF67 'weighted sit ups  <after athletic/power block, before strength>; [BK61 'WEEK 5'] BW66 [Sagital core] '15 toes to bar'  <after athletic/power block, before strength>; [CC61 'WEEK 6'] CO66 [Sagital core] 'med ball rockers  <after athletic/power block, before strength>
- **MM 02 BASEBALL A59 BLOCK 3, 'FRIDAY'** (8): [CU61 'WEEK 7 (04/17 TO 04/21)'] DK65 [Transverse core] 'WINDSHIELD WIPERS'  <after athletic/power block, before strength>; DK66 'CROSSING MOUNTAIN CLIMBERS'  <after athletic/power block, before strength>; [DM60 'WEEK 8'] EC65 [Transverse core] 'WINDSHIELD WIPERS'  <after athletic/power block, before strength>; EC66 'MOUNTAIN CLIMBERS CROSSING  <after athletic/power block, before strength>; [A61 'Week 1'] M66 [Transverse core] 'Cable load rotation chop'  <after athletic/power block, before strength>; [O61 'week 2'] AE66 [Transverse core] 'Cable rotational oblique twist'  <after athletic/power block, before strength>; AE67 'plate russian twists'  <after athletic/power block, before strength>; [AG61 'Week 3'] AS66 [Transverse core] 'Cable load rotation chop'  <after athletic/power block, before strength>; [AT61 'week 4'] BJ66 [Transverse core] 'Hanging knees side to side raises'  <after athletic/power block, before strength>; [BK61 'WEEK 5'] CA66 [Transverse core] 'plate russian twists'  <after athletic/power block, before strength>; [CC61 'WEEK 6'] CS66 [Transverse core] 'Swissball plate rotations'  <after athletic/power block, before strength>
- **MM 04 4 TRACKS A69 HYBRID, 'MONDAY'** (8): [WK1] E76 [UNI RDLs] 'UNI RDL/ CORE/ UNI GB'  <embedded in a strength superset prescription>; [WK2] F76 [UNI RDLs] 'UNI RDL/ CORE/ UNI GB'  <embedded in a strength superset prescription>; [WK3] G76 [UNI RDLs] 'UNI RDL/ CORE/ UNI GB'  <embedded in a strength superset prescription>; [WK4] H76 [UNI RDLs] 'UNI RDL/ CORE/ UNI GB'  <embedded in a strength superset prescription>; [WK5] I76 [UNI RDLs] 'UNI RDL/ CORE/ UNI GB'  <embedded in a strength superset prescription>; [WK6] J76 [UNI RDLs] 'UNI RDL/ CORE/ UNI GB'  <embedded in a strength superset prescription>; [WK7] K76 [UNI RDLs] 'UNI RDL/ CORE/ UNI GB'  <embedded in a strength superset prescription>; [WK8] L76 [UNI RDLs] 'UNI RDL/ CORE/ UNI GB'  <embedded in a strength superset prescription>
- **MM 04 4 TRACKS A69 HYBRID, 'TUESDAY'** (8): [WK1] E81 [BENCH PRESS] '3x6 - DB bench press/ core'  <embedded in a strength superset prescription>; [WK2] F81 [BENCH PRESS] '3x6 db incline bench press/ core'  <embedded in a strength superset prescription>; [WK3] G81 [BENCH PRESS] '3x8 - barbell bench press/ core'  <embedded in a strength superset prescription>; [WK4] H81 [BENCH PRESS] '3x8 - barbell incline bench press/ core'  <embedded in a strength superset prescription>; [WK5] I81 [BENCH PRESS] '3x10 DB bench press/ core'  <embedded in a strength superset prescription>; [WK6] J81 [BENCH PRESS] '3x10 DB incline press/ core'  <embedded in a strength superset prescription>; [WK7] K81 [BENCH PRESS] '4x6 bb bench/ core'  <embedded in a strength superset prescription>; [WK8] L81 [BENCH PRESS] '4x8/ bb incline bench/ core'  <embedded in a strength superset prescription>
- **MM 04 4 TRACKS A69 HYBRID, 'THURSDAY'** (8): [WK1] E88 [LUNGES/ ROWS] 'FE contra/ DB rows/core'  <embedded in a strength superset prescription>; [WK2] F88 [LUNGES/ ROWS] 'FFE ipsi/ DB rows/ core'  <embedded in a strength superset prescription>; [WK3] G88 [LUNGES/ ROWS] 'FF & RFE ipsi/ DB rows/ core'  <embedded in a strength superset prescription>; [WK4] H88 [LUNGES/ ROWS] 'RFE contra/ DB rows/ core'  <embedded in a strength superset prescription>; [WK5] I88 [LUNGES/ ROWS] 'RFE ipsi/ DB rows/ core'  <embedded in a strength superset prescription>; [WK6] J88 [LUNGES/ ROWS] 'FF & RFE dcontra/ DB rows/ core'  <embedded in a strength superset prescription>; [WK7] K88 [LUNGES/ ROWS] 'RFE contra/ DB rows/ core'  <embedded in a strength superset prescription>; [WK8] L88 [LUNGES/ ROWS] 'RFE ipsi/ DB rows/ core'  <embedded in a strength superset prescription>
- **MM 04 4 TRACKS A69 HYBRID, 'FRIDAY'** (8): [WK1] E94 [UNI RDLS] 'uni RDL/ core/ OH press'  <embedded in a strength superset prescription>; [WK2] F94 [UNI RDLS] 'uni RDL/ core/ OH press'  <embedded in a strength superset prescription>; [WK3] G94 [UNI RDLS] 'uni RDL/ core/ OH press'  <embedded in a strength superset prescription>; [WK4] H94 [UNI RDLS] 'uni RDL/ core/ OH press'  <embedded in a strength superset prescription>; [WK5] I94 [UNI RDLS] 'uni RDL/ core/ OH press'  <embedded in a strength superset prescription>; [WK6] J94 [UNI RDLS] 'uni RDL/ core/ OH press'  <embedded in a strength superset prescription>; [WK7] K94 [UNI RDLS] 'uni RDL/ core/ OH press'  <embedded in a strength superset prescription>; [WK8] L94 [UNI RDLS] 'uni RDL/ core/ OH press'  <embedded in a strength superset prescription>
- **MM 04 4 TRACKS A69 HYBRID, 'SATURDAY'** (4): [WK1] E100 [STEP UPS] 'FF & RFE Lunge goblet / T2B/ hand switch pushups'  <embedded in a strength superset prescription>; [WK3] G100 [STEP UPS] 'FF & RFE Lunge/ T2B/ db bench press'  <embedded in a strength superset prescription>; [WK5] I100 [STEP UPS] 'FF & RFE Lunge goblet / T2B/ pushups'  <embedded in a strength superset prescription>; [WK7] K100 [STEP UPS] 'FF & RFE Lunge/ T2B/ db bench press'  <embedded in a strength superset prescription>
- **MM 05 ATHLETIC FB A9 'STARTING OFF SEASON WORKOUTS', WORKOUT 2** (1): C25 'Star Supine Cross Connects'  <after athletic/power block, before strength>
- **MM 05 ATHLETIC FB A9 'STARTING OFF SEASON WORKOUTS', WORKOUT 3** (1): C33 'Med ball rolls'  <first in session>; C38 'SUPERSET: Dead bugs + Front Raises + Side Raises'  <embedded in a strength superset prescription>
- **MM 05 ATHLETIC FB D9 ' MID OFF SEASON WORKOUTS', WORKOUT 1** (1): F16 'Hollow rocks'  <after athletic/power block, before strength>; F21 'Plate core & leg extensions / nordic curls'  <embedded in a strength superset prescription>
- **MM 05 ATHLETIC FB D9 ' MID OFF SEASON WORKOUTS', WORKOUT 2** (1): F35 'Star Supine Cross Connects UNBROKEN'  <after athletic/power block, before strength>
- **MM 05 ATHLETIC FB D9 ' MID OFF SEASON WORKOUTS', WORKOUT 3** (1): F42 'Med Ball Rockers'  <after athletic/power block, before strength>
- **MM 05 ATHLETIC FB D9 ' MID OFF SEASON WORKOUTS', WORKOUT 4** (1): F62 'Med ball Star Supine Cross Connects UNBROKEN'  <after athletic/power block, before strength>; F66 'DB side raises + Copenhagen plank :50 sec each side'  <embedded in a strength superset prescription>
- **MM 05 ATHLETIC FB H9 ' ADVANCED OFF SEASON WORKOUTS', WORKOUT 1** (1): J13 'Med Ball Rockers'  <after athletic/power block, before strength>
- **MM 05 ATHLETIC FB H9 ' ADVANCED OFF SEASON WORKOUTS', WORKOUT 2** (1): J24 'DB side raises + Copenhagen plank :50 sec each side'  <embedded in a strength superset prescription>
- **MM 05 ATHLETIC FB H9 ' ADVANCED OFF SEASON WORKOUTS', WORKOUT 3** (1): J31 'Hollow rocks'  <after athletic/power block, before strength>; J35 'Plate core & leg extensions'  <embedded in a strength superset prescription>
- **MM 05 ATHLETIC FB H9 ' ADVANCED OFF SEASON WORKOUTS', WORKOUT 4** (1): J39 'Star Supine Cross Connects UNBROKEN'  <after athletic/power block, before strength>
- **MM 07 BOXING, 'MONDAY OFF SEASON WORK'** (2): [Week 1-2 (col D)] D8 'Situps / Toes to bar'  <first in session>; [Week 3-8 (col L)] L13 'Copenhagen Plank & Unilateral DL'  <embedded in a strength superset prescription>
- **MM 07 BOXING, 'TUESDAY OFF SEASON WORK'** (1): [Week 3-8 (col L)] L20 'Single Leg swiss ball knee tuck in + DB rows'  <embedded in a strength superset prescription>
- **MM 07 BOXING, 'THURSDAY OFF SEASON WORK'** (2): [Week 1-2 (col D)] D31 'Situps/crunches'  <first in session>; [Week 3-8 (col L)] L34 '8 Box Med Ball rocker into 4 hops + Swiss ball knee tuck ins'  <embedded in a strength superset prescription>
- **MM 07 BOXING, 'FRIDAY OFF SEASON WORK'** (2): [Week 1-2 (col D)] D45 'Russian twists/ 30/30 Side planks'  <first in session>; [Week 3-8 (col L)] L45 'Drop into Box Jumps + 20/20 Star Toe touches'  <embedded in a strength superset prescription>; L48 'Slider Runners + Slider Hamstring Runners'  <embedded in a strength superset prescription>

</details>

### R10-conditioning. Conditioning at the end of the session or on a separate day

*Operational test:* same test for COND. Position counts: {'separate day (no other work)': 41, 'at end': 66, 'between strength exercises': 2, 'first in session': 11, 'embedded in strength superset': 1}. The 5-minute 'Any Cardio Equipment' warm-up is tagged WARMUP and excluded.

**Result: 107 / 121 applicable sessions compliant (88%); 14 exception sessions.**

| Tab | Applicable | Compliant | % |
|---|---:|---:|---:|
| BYOP 00 AESTHETICS 4D | 2 | 2 | 100% |
| BYOP 01 3 DAY BUILDER | 3 | 3 | 100% |
| BYOP 03 ATHLETIC 4D | 2 | 2 | 100% |
| BYOP 04 JUSTICE LEAGUE | 2 | 2 | 100% |
| BYOP 05 BOOTCAMP 1 | 2 | 2 | 100% |
| BYOP 06 BOOTCAMP 2 | 6 | 4 | 67% |
| BYOP 07 NO-ACCESS AESTHETICS | 2 | 2 | 100% |
| BYOP 08 NO-ACCESS ATHLETIC | 2 | 2 | 100% |
| MM 01 FAT BURN | 8 | 8 | 100% |
| MM 02 BASEBALL | 65 | 65 | 100% |
| MM 04 4 TRACKS | 22 | 14 | 64% |
| MM 05 ATHLETIC FB | 1 | 1 | 100% |
| MM 07 BOXING | 4 | 0 | 0% |

* **OBSERVED, holds:** BASEBALL Part E 'Buy out' ('1x 30 Sec Fast Run', '1 X 12 Cal bike sprint', ...) is always last, with A-row labels 'Speed' and 'strength'. FAT BURN cardio is its own day (D17 / D30 '30-40 mi slow/steady CARDIO' on WEDNESDAY/SATURDAY). BYOP 'Cardio' / 'Aerobic Capacity' sits in the optional blocks.
* **OBSERVED exceptions:** BOXING opens with conditioning (D7 '20 sec fast/ 40 sec slow (cardio of choice)', D44 'Easy cardio of choice (steady pace)', L19 'Cardio of any choice' 20-40 min). This is most likely the warm-up/aerobic piece of a fighter (INFERRED). HYBRID Friday opens with B92 'A/C' D92 'DISTANCE' '15-40 min constant cardo easy'. BOOTCAMP 2 '3A'/'3B' puts 'Cardio' (row 15/30) between 'Unilateral KD' and 'Tricep'.

<details><summary>Every exception (tab, day, cells)</summary>

- **BYOP 06 BOOTCAMP 2, 3A** (1): E15 [Cardio]  <between strength exercises>
- **BYOP 06 BOOTCAMP 2, 3B** (1): E30 [Cardio]  <between strength exercises>
- **MM 04 4 TRACKS A69 HYBRID, 'FRIDAY'** (8): [WK1] E92 [DISTANCE] '15-40 min constant cardo easy'  <first in session>; [WK2] F92 [DISTANCE] '15-40 min constant cardo easy'  <first in session>; [WK3] G92 [DISTANCE] '15-40 min constant cardo easy'  <first in session>; [WK4] H92 [DISTANCE] '15-40 min constant cardo easy'  <first in session>; [WK5] I92 [DISTANCE] '15-40 min constant cardo easy'  <first in session>; [WK6] J92 [DISTANCE] '15-40 min constant cardo easy'  <first in session>; [WK7] K92 [DISTANCE] '15-40 min constant cardo easy'  <first in session>; [WK8] L92 [DISTANCE] '15-40 min constant cardo easy'  <first in session>
- **MM 07 BOXING, 'MONDAY OFF SEASON WORK'** (2): [Week 1-2 (col D)] D7 '20 sec fast/ 40 sec slow (cardio of choice)'  <first in session>; [Week 3-8 (col L)] L12 'DEADLIFTS (1-2RIR) + 3 min Jump Rope'  <embedded in a strength superset prescription>
- **MM 07 BOXING, 'TUESDAY OFF SEASON WORK'** (1): [Week 3-8 (col L)] L19 'Cardio of any choice'  <first in session>
- **MM 07 BOXING, 'FRIDAY OFF SEASON WORK'** (1): [Week 1-2 (col D)] D44 'Easy cardio of choice (steady pace)'  <first in session>

</details>

## 3. R11: across the week, which vectors land on which day

Modal weekly layout per program (ROLE vectors: HPULL/VPULL/HPUSH/VPUSH, BKD/BHD/UKD/UHD; 'other' = anything present in any week). OBSERVED; cell refs in the JSON `rules[R11].programs[].all_weeks`.

**BYOP 00 AESTHETICS 4D** - weeks in sheet: 1, distinct weekly layouts: 1 (modal layout in 1).

| Day | Strength vectors (in order of appearance in the session) | Other |
|---|---|---|
| Day 1 | BKD, HPULL, UKD, VPULL | - |
| Day 2 | BHD, HPUSH, UHD, VPUSH | - |
| Optional | - | COND, CORE |
| Day 3 | BKD, HPULL, UKD, VPULL | - |
| Day 4 | BHD, HPUSH, UHD, VPUSH | - |
| Optional | - | COND, CORE |

**BYOP 01 3 DAY BUILDER** - weeks in sheet: 1, distinct weekly layouts: 1 (modal layout in 1).

| Day | Strength vectors (in order of appearance in the session) | Other |
|---|---|---|
| DAY 1 | BKD, HPULL, UKD, VPULL | - |
| Optional | - | COND, CORE |
| DAY 2 | BHD, HPUSH, UHD, VPUSH | - |
| Optional | - | COND, CORE |
| DAY 3 | BKD, BHD, HPULL, HPUSH, UKD | - |
| Optional | - | COND, CORE |

**BYOP 02 PPL** - weeks in sheet: 1, distinct weekly layouts: 1 (modal layout in 1).

| Day | Strength vectors (in order of appearance in the session) | Other |
|---|---|---|
| MONDAY | HPUSH, VPUSH | - |
| TUESDAY | HPULL, VPULL | - |
| WEDNESDAY | BKD, BHD, UKD, UHD | - |
| Thursday | HPUSH, VPUSH | - |
| Friday | HPULL, VPULL | - |
| Saturday | BKD, BHD, UKD, UHD | - |

**BYOP 03 ATHLETIC 4D** - weeks in sheet: 1, distinct weekly layouts: 1 (modal layout in 1).

| Day | Strength vectors (in order of appearance in the session) | Other |
|---|---|---|
| MONDAY | BKD, HPULL, UKD, VPULL | OLY/LOADED_JUMP, PLYO_L, PLYO_U/MB, SPRINT/COD/DRILL |
| TUESDAY | BHD, HPUSH, UHD, VPUSH | OLY/LOADED_JUMP, PLYO_L, PLYO_U/MB, SPRINT/COD/DRILL |
| WEDNESDAY | - | COND, CORE |
| (blank day label; 4th main day, between WEDNESDAY and FRIDAY) | BKD, HPULL, UKD, VPULL | OLY/LOADED_JUMP, PLYO_L, PLYO_U/MB, SPRINT/COD/DRILL |
| FRIDAY | BHD, HPUSH, UHD, VPUSH | OLY/LOADED_JUMP, PLYO_L, PLYO_U/MB, SPRINT/COD/DRILL |
| SATURDAY | - | COND, CORE |

**BYOP 04 JUSTICE LEAGUE** - weeks in sheet: 1, distinct weekly layouts: 1 (modal layout in 1).

| Day | Strength vectors (in order of appearance in the session) | Other |
|---|---|---|
| MONDAY | BKD, HPULL, UKD, VPULL | OLY/LOADED_JUMP, PLYO_L, PLYO_U/MB, SPRINT/COD/DRILL |
| TUESDAY | BHD, HPUSH, UHD, VPUSH | OLY/LOADED_JUMP, PLYO_L, PLYO_U/MB, SPRINT/COD/DRILL |
| WEDNESDAY | - | COND, CORE |
| (blank day label; 4th main day, between WEDNESDAY and FRIDAY) | BKD, HPULL, UKD, VPULL | OLY/LOADED_JUMP, PLYO_L, PLYO_U/MB, SPRINT/COD/DRILL |
| FRIDAY | BHD, HPUSH, UHD, VPUSH | OLY/LOADED_JUMP, PLYO_L, PLYO_U/MB, SPRINT/COD/DRILL |
| SATURDAY | - | COND, CORE |

**BYOP 05 BOOTCAMP 1** - weeks in sheet: 1, distinct weekly layouts: 1 (modal layout in 1).

| Day | Strength vectors (in order of appearance in the session) | Other |
|---|---|---|
| MONDAY | BKD, HPULL, UHD, VPUSH | - |
| TUESDAY | BHD, VPULL, UKD, HPUSH | - |
| WEDNESDAY | - | COND, CORE |
| THURSDAY | BKD, HPULL, UHD, VPUSH | - |
| FRIDAY | BHD, VPULL, UKD, HPUSH | - |
| SATURDAY | - | COND, CORE |

**BYOP 06 BOOTCAMP 2** - weeks in sheet: 1, distinct weekly layouts: 1 (modal layout in 1).

| Day | Strength vectors (in order of appearance in the session) | Other |
|---|---|---|
| 1A | BKD, HPULL, UHD | COND, CORE |
| 2A | BHD, HPUSH, VPUSH | COND |
| 3A | VPULL, UKD | COND |
| 1B | BKD, HPULL, UHD | COND, CORE |
| 2B | BHD, HPUSH, VPUSH | COND |
| 3B | VPULL, UKD | COND |

**BYOP 07 NO-ACCESS AESTHETICS** - weeks in sheet: 1, distinct weekly layouts: 1 (modal layout in 1).

| Day | Strength vectors (in order of appearance in the session) | Other |
|---|---|---|
| MONDAY | BKD, HPULL, UKD, VPULL | - |
| TUESDAY | BHD, HPUSH, UHD, VPUSH | - |
| WEDNESDAY | - | COND, CORE |
| THURSDAY | BKD, HPULL, UKD, VPULL | - |
| FRIDAY | BHD, HPUSH, UHD, VPUSH | - |
| SATURDAY | - | COND, CORE |

**BYOP 08 NO-ACCESS ATHLETIC** - weeks in sheet: 1, distinct weekly layouts: 1 (modal layout in 1).

| Day | Strength vectors (in order of appearance in the session) | Other |
|---|---|---|
| MONDAY | BKD, HPULL, UKD, VPULL | OLY/LOADED_JUMP, PLYO_L, PLYO_U/MB, SPRINT/COD/DRILL |
| TUESDAY | BHD, HPUSH, UHD, VPUSH | OLY/LOADED_JUMP, PLYO_L, PLYO_U/MB, SPRINT/COD/DRILL |
| WEDNESDAY | - | COND, CORE |
| THURSDAY | BKD, HPULL, UKD, VPULL | OLY/LOADED_JUMP, PLYO_L, PLYO_U/MB, SPRINT/COD/DRILL |
| FRIDAY | BHD, HPUSH, UHD, VPUSH | OLY/LOADED_JUMP, PLYO_L, PLYO_U/MB, SPRINT/COD/DRILL |
| SATURDAY | - | COND, CORE |

**MM 00 UPPER/LOWER B10 'NOVICE'** - weeks in sheet: 1, distinct weekly layouts: 1 (modal layout in 1).

| Day | Strength vectors (in order of appearance in the session) | Other |
|---|---|---|
| A11 'LOWER BODY WORKOUT' (ADAY) | BKD, BHD, UKD, UHD | SPRINT/COD/DRILL |
| A25 'UPPER BODY WORKOUT' (BDAY) | HPULL, HPUSH, VPULL, VPUSH | - |

**MM 01 FAT BURN B4 MUSCLE BUILDING** - weeks in sheet: 4, distinct weekly layouts: 4 (modal layout in 1).

| Day | Strength vectors (in order of appearance in the session) | Other |
|---|---|---|
| A8 'MONDAY' | BKD, BHD, UKD, UHD | - |
| A14 'TUESDAY' | HPUSH, VPULL, VPUSH, HPULL | - |
| A18 'WEDNESDAY' | - | COND |
| A22 'THURSDAY' | BHD, BKD, UKD, UHD | - |
| A27 'FRIDAY' | VPULL, HPUSH, HPULL | - |
| A31 'SATURDAY' | - | COND |

**MM 02 BASEBALL A24 BLOCK 1** - weeks in sheet: 8, distinct weekly layouts: 8 (modal layout in 1).

| Day | Strength vectors (in order of appearance in the session) | Other |
|---|---|---|
| B26 'MONDAY' | BKD, HPULL, UHD | CORE, OLY/LOADED_JUMP, PLYO_U/MB |
| E26 'TUESDAY' | BHD, HPUSH, UKD | CORE, PLYO_L |
| H26 'THURSDAY' | BKD, VPULL, UHD | CORE, PLYO_U/MB |
| K26 'FRIDAY' | BHD, VPUSH, UKD | CORE, PLYO_L, PLYO_U/MB, SPRINT/COD/DRILL |

**MM 02 BASEBALL A41 BLOCK 2** - weeks in sheet: 8, distinct weekly layouts: 8 (modal layout in 1).

| Day | Strength vectors (in order of appearance in the session) | Other |
|---|---|---|
| DX42 'MONDAY' | BKD, HPULL, UHD | COND, CORE, PLYO_U/MB |
| EB42 'TUESDAY' | BHD, HPUSH, UKD | COND, PLYO_L, PLYO_U/MB |
| EF42 'THURSDAY' | BKD, VPULL, UHD | COND, CORE, PLYO_U/MB |
| EJ42 'FRIDAY' | BHD, VPUSH, UKD | CORE, PLYO_L |

**MM 02 BASEBALL A59 BLOCK 3** - weeks in sheet: 8, distinct weekly layouts: 8 (modal layout in 1).

| Day | Strength vectors (in order of appearance in the session) | Other |
|---|---|---|
| CV61 'MONDAY' | BKD, HPULL, UHD | COND, CORE, OLY/LOADED_JUMP, PLYO_U/MB |
| CZ61 'TUESDAY' | BHD, HPUSH, UKD | CORE, PLYO_L, PLYO_U/MB |
| DD61 'THURSDAY' | BKD, VPULL, UHD | COND, CORE, PLYO_U/MB |
| DH61 'FRIDAY' | BHD, VPUSH, UKD | CORE, OLY/LOADED_JUMP, PLYO_L |

**MM 04 4 TRACKS A3 STRENGTH left** - weeks in sheet: 7, distinct weekly layouts: 5 (modal layout in 2).

| Day | Strength vectors (in order of appearance in the session) | Other |
|---|---|---|
| A9 'MONDAY' | BKD, BHD, VPULL, UKD | - |
| A13 'WEDNESDAY' | HPUSH, HPULL | - |
| A17 'THURSDAY' | BKD, VPULL, UKD | PLYO_L |
| A21 'SATURDAY' | HPUSH, HPULL | - |

**MM 04 4 TRACKS A3 STRENGTH right** - weeks in sheet: 12, distinct weekly layouts: 2 (modal layout in 6).

| Day | Strength vectors (in order of appearance in the session) | Other |
|---|---|---|
| A9 'MONDAY' | BKD, BHD, UHD | - |
| A13 'WEDNESDAY' | HPUSH, VPULL | - |
| A17 'THURSDAY' | BKD, BHD, UHD | - |
| A21 'SATURDAY' | HPUSH, VPULL | - |

**MM 04 4 TRACKS A30 AESTHETICS left** - weeks in sheet: 7, distinct weekly layouts: 5 (modal layout in 2).

| Day | Strength vectors (in order of appearance in the session) | Other |
|---|---|---|
| A35 'MONDAY' | BKD, BHD, UKD, UHD | - |
| A41 'TUESDAY' | HPUSH, VPULL, VPUSH, HPULL | - |
| A46 'WEDNESDAY ' | - | COND |
| A49 'THURSDAY' | BKD, BHD, UKD, UHD | - |
| A55 'FRIDAY' | HPUSH, VPULL, VPUSH, HPULL | - |
| A60 'SATURDAY' | - | COND |

**MM 04 4 TRACKS A30 AESTHETICS right** - weeks in sheet: 12, distinct weekly layouts: 5 (modal layout in 6).

| Day | Strength vectors (in order of appearance in the session) | Other |
|---|---|---|
| N35 'MONDAY' (M38 'PUSH') | HPUSH | - |
| N41 'TUESDAY' (M43 'LEGS') | BKD, BHD, UKD, UHD | - |
| N46 'WEDNESDAY ' (M49 'PULL') | VPULL, HPULL | - |
| N51 'THURSDAY' (M54 'PUSH') | HPUSH | - |
| N57 'FRIDAY' (legs) | BKD, UHD, UKD | - |
| N62 'SATURDAY' (M64 'PULL') | VPULL, HPULL | - |

**MM 04 4 TRACKS A69 HYBRID** - weeks in sheet: 8, distinct weekly layouts: 2 (modal layout in 4).

| Day | Strength vectors (in order of appearance in the session) | Other |
|---|---|---|
| A74 'MONDAY' | BKD, UHD, HPULL | CORE, OLY/LOADED_JUMP |
| A80 'TUESDAY' | HPUSH | CORE, PLYO_L, SPRINT/COD/DRILL |
| A86 'THURSDAY' | BHD, HPULL, UKD | CORE, OLY/LOADED_JUMP |
| A92 'FRIDAY' | VPUSH, UHD | COND, CORE, PLYO_L |
| A98 'SATURDAY' | BKD, HPUSH, UKD, VPULL | CORE |

**MM 05 ATHLETIC FB A9 'STARTING OFF SEASON WORKOUTS'** - weeks in sheet: 1, distinct weekly layouts: 1 (modal layout in 1).

| Day | Strength vectors (in order of appearance in the session) | Other |
|---|---|---|
| WORKOUT 1 | HPULL, BKD, UKD, VPUSH | CORE, OLY/LOADED_JUMP, PLYO_L, SPRINT/COD/DRILL |
| WORKOUT 2 | BHD, UHD, VPULL | COND, CORE, OLY/LOADED_JUMP, PLYO_U/MB |
| WORKOUT 3 | UHD, UKD, BHD | CORE, OLY/LOADED_JUMP |

**MM 05 ATHLETIC FB D9 ' MID OFF SEASON WORKOUTS'** - weeks in sheet: 1, distinct weekly layouts: 1 (modal layout in 1).

| Day | Strength vectors (in order of appearance in the session) | Other |
|---|---|---|
| WORKOUT 1 | HPUSH, BHD, VPULL | CORE, PLYO_L |
| WORKOUT 2 | UKD | CORE, OLY/LOADED_JUMP, PLYO_U/MB |
| WORKOUT 3 | HPUSH, BHD, UHD, VPULL | CORE, OLY/LOADED_JUMP, PLYO_L |
| WORKOUT 4 | HPULL, UKD, VPUSH | CORE, PLYO_U/MB |

**MM 05 ATHLETIC FB H9 ' ADVANCED OFF SEASON WORKOUTS'** - weeks in sheet: 1, distinct weekly layouts: 1 (modal layout in 1).

| Day | Strength vectors (in order of appearance in the session) | Other |
|---|---|---|
| WORKOUT 1 | BHD, UHD | CORE, PLYO_L |
| WORKOUT 2 | HPULL, UKD, VPUSH | CORE, PLYO_U/MB |
| WORKOUT 3 | BHD | CORE, OLY/LOADED_JUMP, PLYO_L |
| WORKOUT 4 | UKD | CORE, OLY/LOADED_JUMP, PLYO_L, PLYO_U/MB |

**MM 06 PPL A10 'NOVICE'** - weeks in sheet: 1, distinct weekly layouts: 1 (modal layout in 1).

| Day | Strength vectors (in order of appearance in the session) | Other |
|---|---|---|
| A12 'PUSH DAY WORKOUT' (ADAY) | HPUSH | - |
| A23 'PULL DAY WORKOUT' (BDAY) | HPULL, VPULL | - |
| A34 'LEG DAY WORKOUT' (CDAY) | BKD, BHD, UKD, UHD | SPRINT/COD/DRILL |

**MM 07 BOXING** - weeks in sheet: 2, distinct weekly layouts: 2 (modal layout in 1).

| Day | Strength vectors (in order of appearance in the session) | Other |
|---|---|---|
| E4 'MONDAY OFF SEASON WORK' | BKD, BHD, UKD, UHD | COND, CORE, OLY/LOADED_JUMP, PLYO_L, PLYO_U/MB |
| E16 'TUESDAY OFF SEASON WORK' | HPUSH, VPULL, VPUSH, HPULL | COND, CORE, OLY/LOADED_JUMP, PLYO_L, PLYO_U/MB |
| E28 'THURSDAY OFF SEASON WORK' | BKD, BHD, UKD, UHD | CORE, OLY/LOADED_JUMP, PLYO_L, PLYO_U/MB |
| E41 'FRIDAY OFF SEASON WORK' | HPUSH, VPULL, VPUSH, HPULL | COND, CORE, PLYO_L, SPRINT/COD/DRILL |

**MM 12 CONJUGATE** - weeks in sheet: 7, distinct weekly layouts: 4 (modal layout in 2).

| Day | Strength vectors (in order of appearance in the session) | Other |
|---|---|---|
| A13 'MONDAY' | BKD, BHD, VPULL, UKD | - |
| A17 'WEDNESDAY' | HPUSH, HPULL | - |
| A21 'THURSDAY' | BKD, VPULL, UKD | PLYO_L |
| A25 'SATURDAY' | HPUSH, HPULL | - |

**CROSSFIT (MM 11, category level only, OBSERVED):** monthly grids (A27 'JUNE' ... A137 'MAY') use STRENGTH = B31 'KNEE DOM' (MON), C31 'PULL' (TUESD), E31 'HIP DOM' (THURS), F31 'PUSH' (FRID); RESISTANCE = 'LB' Mon/Thu, 'UB' Tue/Fri; POWER = 'SNATCH' Mon/Thu, 'CLEAN' Tue/Fri (from AUGUST); D29 and H29 WED/SUN 'OFF'. The class split (Q12:V16) is MON 'SQUAT' + 'DUBS'; TUES 'PRESS' + 'SNATCH'; THURS 'DEADLIFT' + 'GYMNASTICS'; FRID 'CLEAN'.

**Weekly rotation rules (INFERRED from the tables above):**

1. **Two-day mirror (aesthetics, BYOP 4-day):** a 'knee + pull' day (Day 1/3: BKD, HPULL, UKD, VPULL) and a 'hip + push' day (Day 2/4: BHD, HPUSH, UHD, VPUSH). Each vector is trained twice a week, and horizontal and vertical of the same direction share a day.
2. **Four-day vector split (athletic, BASEBALL):** horizontal early in the week, vertical late (Mon HPULL, Tue HPUSH, Thu VPULL, Fri VPUSH). The squat travels with the pull and the hinge with the push. Ballistics follow the lower pattern: UPPER ballistics on squat/pull days, LOWER ballistics on hinge/push days (N7). Each vector gets one exposure a week.
3. **Crossed bootcamp:** every day holds one pull and one push from opposite planes (Mon/Thu HPULL+VPUSH, Tue/Fri VPULL+HPUSH) and one bilateral + one unilateral lower of opposite patterns.
4. **Strength / conjugate:** Mon max-effort lower, Wed max-effort upper, Thu dynamic lower ('FAST ...', jumps first), Sat dynamic upper. The lead lift alternates squat/hinge and bench/OHP week to week (N8).
5. **PPL (BYOP 02, MM 06, 4-TRACKS AESTHETICS right):** push / pull / legs twice a week (BYOP 02: Mon/Thu push, Tue/Fri pull, Wed/Sat legs, SUNDAY 'OFF'). Both vectors of a direction share the day.

## 4. Other ordering regularities found (not in the R1-R11 list)

**N1. Arm isolation follows the day's upper pattern (OBSERVED).** Pull-only sessions: bicep isolation in 79 of 136, tricep in 2. Push-only sessions: tricep in 73 of 99, bicep in 3. The deliberate inverse is BOOTCAMP OPTION 2: '2A' push day carries 'Bicep' (E10) and '3A' pull day carries 'Tricep' (E16). This is antagonist filler in a circuit-style bootcamp (INFERRED).

**N2. The lower isolation finisher matches the day's lower pattern (OBSERVED).** HD-only day: quad_iso=False ham_iso=True: 11; HD-only day: quad_iso=True ham_iso=False: 1; HD-only day: quad_iso=True ham_iso=True: 1; KD-only day: quad_iso=False ham_iso=True: 1; KD-only day: quad_iso=True ham_iso=False: 10; KD-only day: quad_iso=True ham_iso=True: 1. BYOP: 'Leg Extensions' closes the KD day (row 9/30/12/39), 'Leg Curls' sits on the HD day (row 14/35/21/48).

**N3. Same-pattern vs cross-pattern unilateral is a template choice (OBSERVED).** Across sessions with exactly one bilateral and one unilateral lower: BKD+UKD 29, BHD+UHD 20 (same pattern; BYOP aesthetics/athletic, CONJUGATE) vs BKD+UHD 56, BHD+UKD 57 (cross pattern; BASEBALL 44+46, BOOTCAMP 1 and 2). INFERRED: aesthetic templates double the day's pattern for volume on that muscle. Athletic and bootcamp templates cover both patterns every day.

**N4. Core placement depends on goal (OBSERVED, core items by position, per tab):** BYOP 00 AESTHETICS 4D: separate day 2; BYOP 01 3 DAY BUILDER: separate day 3; BYOP 03 ATHLETIC 4D: separate day 2; BYOP 04 JUSTICE LEAGUE: separate day 2; BYOP 05 BOOTCAMP 1: separate day 2; BYOP 06 BOOTCAMP 2: after all strength (end) 2; BYOP 07 NO-ACCESS AESTHETICS: separate day 2; BYOP 08 NO-ACCESS ATHLETIC: separate day 2; MM 02 BASEBALL: before strength (after power block) 112, separate day 4, after all strength (end) 1; MM 04 4 TRACKS: inside a strength superset/prescription 36; MM 05 ATHLETIC FB: after all strength (end) 6, before strength (after power block) 9, inside a strength superset/prescription 5; MM 07 BOXING: before strength (after power block) 3, inside a strength superset/prescription 5.

**N5. Inside the power block, plyo/throws/COD/sprint come before Olympic work (OBSERVED):** 48/51 sessions. BYOP rows 'Plyo','Plyo','Throwing','COD' are above 'Tripple Extension'. BASEBALL Part A is above the 'OLY' row. Exceptions: MM/02/DC27 (some athletic after first OLY); MM/02/DA45 (some athletic after first OLY); MM/05/C24 (some athletic after first OLY).

**N6. Plyo progression inside a session (OBSERVED, small n):** landing/stick drills before reactive jumps in 11/13 sessions (e.g. 'Depth drop' -> 'depth drop to jump'; MM 05 'weighted Depth Drops - Drop & Stick - Hold for 3 seconds' -> 'High Jumps'). Bilateral before single-leg plyo in only 12/21: BASEBALL often starts LOWER ballistics with a single-leg hop. So *eccentric before reactive* is a rule, *bilateral before single-leg* is not.

**N7. BASEBALL 5-part skeleton (OBSERVED, every non-deload session):** Part A ballistics -> Part B core -> Part C 'Superset - same reps' (bilateral lower + upper compound) -> Part D (unilateral lower of the *other* pattern + arm isolation + calves or shoulders) -> Part E 'Buy out' ('Speed' or 'strength'). Day x ballistics x pattern counts: FRIDAY | LOWER | - | - = 1; FRIDAY | LOWER | BHD | VPUSH = 23; MONDAY | UPPER | - | - = 1; MONDAY | UPPER | BKD | HPULL = 23; THURSDAY | UPPER | - | - = 1; THURSDAY | UPPER | BKD | VPULL = 23; TUESDAY | LOWER | - | - = 1; TUESDAY | LOWER | BHD | HPUSH = 23.

**N8. Weekly A/B swap of the lead lift with a fixed skeleton (OBSERVED).**

| Program / day | Weeks | Lead changes | Lead sequence |
|---|---:|---:|---|
| MM 01 FAT BURN B4 MUSCLE BUILDING A8 'MONDAY' | 4 | 3 | KD, HD, KD, HD |
| MM 01 FAT BURN B4 MUSCLE BUILDING A14 'TUESDAY' | 4 | 3 | HPUSH, VPULL, HPUSH, VPULL |
| MM 01 FAT BURN B4 MUSCLE BUILDING A22 'THURSDAY' | 4 | 3 | HD, KD, HD, KD |
| MM 01 FAT BURN B4 MUSCLE BUILDING A27 'FRIDAY' | 4 | 3 | VPULL, HPUSH, VPULL, HPUSH |
| MM 04 4 TRACKS A3 STRENGTH left A9 'MONDAY' | 7 | 6 | KD, HD, KD, HD, KD, HD, KD |
| MM 04 4 TRACKS A3 STRENGTH left A13 'WEDNESDAY' | 7 | 2 | HPUSH, HPUSH, HPUSH, HPUSH, HPUSH, VPUSH, HPUSH |
| MM 04 4 TRACKS A3 STRENGTH left A17 'THURSDAY' | 7 | 6 | KD, HD, KD, HD, KD, HD, KD |
| MM 04 4 TRACKS A3 STRENGTH left A21 'SATURDAY' | 7 | 6 | HPUSH, VPUSH, HPUSH, VPUSH, HPUSH, VPUSH, HPUSH |
| MM 04 4 TRACKS A3 STRENGTH right A9 'MONDAY' | 12 | 11 | KD, HD, KD, HD, KD, HD, KD, HD, KD, HD, KD, HD |
| MM 04 4 TRACKS A3 STRENGTH right A17 'THURSDAY' | 12 | 11 | KD, HD, KD, HD, KD, HD, KD, HD, KD, HD, KD, HD |
| MM 04 4 TRACKS A30 AESTHETICS left A35 'MONDAY' | 7 | 5 | KD, HD, KD, HD, KD, HD, HD |
| MM 04 4 TRACKS A30 AESTHETICS left A41 'TUESDAY' | 7 | 6 | HPUSH, VPULL, HPUSH, VPULL, HPUSH, VPULL, HPUSH |
| MM 04 4 TRACKS A30 AESTHETICS left A49 'THURSDAY' | 7 | 5 | KD, HD, KD, HD, KD, HD, HD |
| MM 04 4 TRACKS A30 AESTHETICS left A55 'FRIDAY' | 7 | 6 | HPUSH, VPULL, HPUSH, VPULL, HPUSH, VPULL, HPUSH |
| MM 04 4 TRACKS A30 AESTHETICS right N35 'MONDAY' (M38 'PUSH') | 12 | 5 | HPUSH, HPUSH, HPUSH, HPUSH, HPUSH, HPUSH, HPUSH, VPUSH, HPUSH, VPUSH, HPUSH, VPUSH |
| MM 04 4 TRACKS A30 AESTHETICS right N51 'THURSDAY' (M54 'PUSH') | 12 | 3 | HPUSH, HPUSH, HPUSH, HPUSH, HPUSH, HPUSH, HPUSH, HPUSH, HPUSH, VPUSH, HPUSH, VPUSH |
| MM 12 CONJUGATE A13 'MONDAY' | 7 | 6 | KD, HD, KD, HD, KD, HD, KD |
| MM 12 CONJUGATE A17 'WEDNESDAY' | 7 | 6 | HPUSH, VPUSH, HPUSH, VPUSH, HPUSH, VPUSH, HPUSH |
| MM 12 CONJUGATE A21 'THURSDAY' | 7 | 6 | KD, HD, KD, HD, KD, HD, KD |
| MM 12 CONJUGATE A25 'SATURDAY' | 7 | 6 | HPUSH, VPUSH, HPUSH, VPUSH, HPUSH, VPUSH, HPUSH |

This is how the coach's 'don't confuse the muscle, change small variables' plays out. The template stays the same and the lead lift alternates squat-pattern/hinge-pattern (or bench/overhead, push-first/pull-first) every week (FAT BURN WK1-4, CONJUGATE WK1-7, 4-TRACKS 'A WEEK'/'B WEEK' O33:U33).

**N9. The same day-type is repeated twice a week (OBSERVED).** Pairs of same-vector days within a week, identical vs re-ordered: AESTHETICS - FULL BODY - 4 DAYS: 2 identical, 0 re-ordered; PUSHPULLLEGS - 3 or 6 DAYS A WK: 3 identical, 0 re-ordered; ATHLETIC - FULL BODY - 4 DAYS A: 2 identical, 0 re-ordered; JUSTICE LEAGUE: 2 identical, 0 re-ordered; BOOTCAMP - OPTION 1: 2 identical, 0 re-ordered; BOOTCAMP - OPTION 2: 3 identical, 0 re-ordered; NO ACCESS - AESTHETICS - FB - 4: 2 identical, 0 re-ordered; NO ACCESS - ATHLETIC - FB - 4 t: 2 identical, 0 re-ordered; EXAMPLE FAT BURNBODY TONING PRO / B4 'MUSCLE BUILDING': 0 identical, 6 re-ordered; (NOT DONE) 4 TRACKS PROGRAMMING / A3 'STRENGTH' left (E-L, 'conjugate style training'): 0 identical, 5 re-ordered; (NOT DONE) 4 TRACKS PROGRAMMING / A3 'STRENGTH' right (O-Z, 12 wk): 12 identical, 12 re-ordered; (NOT DONE) 4 TRACKS PROGRAMMING / A30 'AESTHETICS' left (E-L, 'bodybuilding style'): 14 identical, 0 re-ordered; (NOT DONE) 4 TRACKS PROGRAMMING / A30 'AESTHETICS' right (O-Z, 12 wk PPL): 20 identical, 4 re-ordered; EXAMPLE BOXING 8 WEEK BUILD UP: 1 identical, 1 re-ordered; (NOT DONE) EXAMPLE CONJUGATE: 0 identical, 7 re-ordered. BYOP repeats the day exactly. FAT BURN mirrors it: Monday leads with the squat pattern (D7 'LEG PRESS'), Thursday with the hinge (D20 'DEAFLITS'), and the isolation flips too (D11 'LEG EXTENSIONS' vs D24 'LEG CURLS').

**N10. Preparation first (OBSERVED):** EXAMPLE UPPERLOWER SPLIT | warm-up/mobility first: 6; EXAMPLE UPPERLOWER SPLIT | A-drills before lifting: 3; BASEBALL | A-drills before lifting: 4; EXAMPLE PUSHPULLLEGS SPLIT | warm-up/mobility first: 9; EXAMPLE PUSHPULLLEGS SPLIT | A-drills before lifting: 3. MM PPL push day: C14 'Any Cardio Equipment' -> C15 'KB Book openers ' -> pressing. Leg days: 'A March' -> 'A Skip' -> 'A Run' -> 'Sqats or Leg Press'.

**N11. Explicit 4-tier hierarchy (OBSERVED, coach labels):** M13='the work' LOAD D13='1RIR' Sets B13=5 Reps C13='SEE'; M14='the accessory' LOAD D14='2RIR' Sets B14=4 Reps C14=6; M15='the nuance' LOAD D15='MAX' Sets B15=4 Reps C15=8; M16='the survival' LOAD D16='ALL' Sets B16=2 Reps C16='8/8'. The same labels appear in 4 TRACKS M9:M24. Load goes '1RIR' -> '2RIR' -> 'MAX' -> 'ALL', i.e. heaviest first and the lowest-skill, highest-rep work last ('the survival').

**N12. Contrast pairing heavy -> fast (OBSERVED, 11 instances):** MM 02 BASEBALL A42 'WK 1' G44 'TUESDAY': I52 [horiz push] 'Broad jumps' after I51 [bhd] 'Barbell deadlift'; MM 02 BASEBALL AK42 'wk 4' AM44 'MONDAY': AO52 [bkd] 'Jump squats' after AO51 [bkd] 'Front squats - light weights - same speed for all reps'; MM 02 BASEBALL DD42 'WEEK 8' DF44 'MONDAY': DH51 [bkd] 'front squats/high jumps/hex bar squat jumps/ banded assisted hops'; MM 02 BASEBALL BC43 'wk 5' BQ45 'FRIDAY': BS55 [ukd] 'Suitcase DB RFE iso holds / RFE lunge jumps'; MM 02 BASEBALL BU43 'wk 6' BW45 'MONDAY': BY52 [bkd] 'front squats/high jumps/hex bar squat jumps/ banded assisted hops'; MM 02 BASEBALL CL43 'WEEK 7' CO45 'MONDAY': CQ52 [bkd] 'back squats/banded  jumps/DB squat jumps/ high ankle hops'; MM 02 BASEBALL O61 'week 2' U62 'TUESDAY': W70 [horiz push] 'Broad jumps after W69 [bhd] 'Barbell deadlift'; MM 05 ATHLETIC FB  WORKOUT 1: C17 'SUPERSET: HEAVY Hex bar Squats direclty into 10 Repeat Jump Squat HIGH'; MM 05 ATHLETIC FB  WORKOUT 1: C18 'SUPERSET: HEAVY Ipsilateral DB front foot elevated lunge directly into'; MM 07 BOXING Week 3-8 (col L) E16 'TUESDAY OFF SEASON WORK': L22 '3 Heavy SQUATs + 5 Tuck jumps + 5 DB squat jumps + 5 Squirrel jumps'; MM 07 BOXING Week 3-8 (col L) E41 'FRIDAY OFF SEASON WORK': L46 '4 Deadlifts - 5 broad jumps - 5 KB swings - 5/5 High Knee runs'. This matches the coach's 'the heavier I go the slower; the lighter, the faster'. The heavy set potentiates the fast unloaded set of the same pattern (SCIENCE: post-activation performance enhancement). It is the only systematic, intended break of 'athletic first'.

**N13. Intensity techniques go on the last exercise (OBSERVED):** MM 04 4 TRACKS W61 '2 sets LEG PRESS MYO - 15-5-5-5-5-5' (5 of 5); MM 04 4 TRACKS X61 '2 sets LEG PRESS MYO - 15-5-5-5-5-5' (5 of 5); MM 04 4 TRACKS Y61 '2 sets LEG PRESS MYO - 15-5-5-5-5-5' (5 of 5); MM 04 4 TRACKS Z61 '3 sets LEG PRESS MYO - 15-5-5-5-5-5' (5 of 5); BYOP 03 ATHLETIC 4D G12 'MYO SET' (reps cell of the last slot of MONDAY (row 12 'Leg Extensions')); BYOP 04 JUSTICE LEAGUE G12 'MYO SET' (reps cell of the last slot of MONDAY (row 12 'Leg Extensions')); MM 02 BASEBALL AZ55 'myo set' (reps cell (Part D accessory rows)); MM 02 BASEBALL DK56 'myo sets' (reps cell (Part D accessory rows)); MM 02 BASEBALL DO56 'myo set' (reps cell (Part D accessory rows)); MM 02 BASEBALL DS56 'myo set' (reps cell (Part D accessory rows)); MM 02 BASEBALL CT57 'myo set' (reps cell (Part D accessory rows)); MM 02 BASEBALL CX57 'myo sets' (reps cell (Part D accessory rows)); MM 02 BASEBALL DB57 'myo sets' (reps cell (Part D accessory rows)).

**N14. Non-competing supersets (OBSERVED):** (NOT DONE) 4 TRACKS PROGRAMMING | exercise text contains 'SUPERSET': 8; EXAMPLE ATHLETIC FULL BODY SPLI | exercise text contains 'SUPERSET': 7; BASEBALL | reps cell 'Superset - same reps': 19; BASEBALL | reps cell 'Superset - max reps': 5. Strength and athletic supersets do not compete: lower + upper compound (BASEBALL Part C 'Superset - same reps'), unilateral lower + arm (Part D), core + delt (MM 05 C38 'SUPERSET: Dead bugs + Front Raises + Side Raises'). Same-muscle supersets appear only as (a) contrast complexes for speed (N12) and (b) aesthetic finishers in 4-TRACKS AESTHETICS WK9-12: W52 'bench press + superset with max pushup set (only 1 set of max pushups per set of bench)', X52 'incline bench press + superset with a set of max bench dips...', W41 'front squats + Superset with 15 squats with no weight every set' (OBSERVED). INFERRED: in hypertrophy blocks he uses a same-muscle bodyweight back-off set as a late-block intensifier.

**N15. CROSSFIT class order (OBSERVED):** R3 'WARMUP/SKILL' -> S3 'STRENGTH/POWER' -> T3 'WOD'. Skill comes first, the metabolic piece last, consistent with R10-conditioning.

**N16. Squat pattern before hinge pattern when both are bilateral (OBSERVED):** 54/84. Every hinge-first session belongs to a weekly-alternating program (FAT BURN WK2/WK4 Mon and WK1/WK3 Thu, CONJUGATE and 4-TRACKS STRENGTH deadlift weeks). Static templates (UPPER/LOWER, PPL, BYOP 02 Wed/Sat, BOXING Wk1-2) always squat first.

**N17. Leg extension before leg curl (OBSERVED):** 12/14. Exceptions: BOXING Wk1-2 Mon/Thu ('Leg curls' D13 above 'Leg Extentions' D14).

**N18. The bilateral lower lift is paired with the HORIZONTAL vector, the unilateral with the VERTICAL (OBSERVED, BYOP):** BYOP | bilateral | horizontal: 29; BYOP | bilateral | vertical: 2; BYOP | unilateral | horizontal: 2; BYOP | unilateral | vertical: 24; MASTER_MODEL | bilateral | horizontal: 70; MASTER_MODEL | bilateral | vertical: 68; MASTER_MODEL | unilateral | horizontal: 16; MASTER_MODEL | unilateral | vertical: 12. In BYOP the heavy bilateral lower lift is supersetted or alternated with the row/bench, and the lunge with the pulldown/overhead press (29 vs 2 and 24 vs 2). MASTER MODEL is mixed because BASEBALL moves the vertical vectors to Thu/Fri with the bilateral lift.

### 4.4 FAT BURN circuits (excluded from R1-R10)

- WK 1 A40 'MONDAY': D39 'Jumping Jacks' -> D40 'Bodyweight reverse lunges' -> D41 'Situps' -> D42 'Dumbbell overhead press'
- WK 3 A40 'MONDAY': J39 'Jumping Jacks' -> J40 'Bodyweight reverse lunges' -> J41 'Situps' -> J42 'Dumbbell overhead press'
- WK 2 A46 'TUESDAY': G44 'Pushups' -> G45 'Dumbbell hammer curls' -> G46 'Side plank' -> G47 'Other side plank'
- WK 4 A46 'TUESDAY': M44 'Pushups' -> M45 'Dumbbell hammer curls' -> M46 'Side plank' -> M47 'Other side plank'
- WK 2 A54 'THURSDAY': G52 'Mountain climbers' -> G53 'Bodyweight forward lunges' -> G54 'Plank Hip turns' -> G55 'Bodyweight squats'
- WK 4 A54 'THURSDAY': M52 'Mointain climbers' -> M53 'Bodyweight forward lunges' -> M54 'Plank Hip turns' -> M55 'Bodyweight squats'
- WK 1 A59 'FRIDAY': D57 'Plank shoulder taps' -> D58 'Dumbbell curl to press' -> D59 'Bicycle crunches' -> D60 'Burpees'
- WK 3 A59 'FRIDAY': J57 'Plank shoulder taps' -> J58 'Dumbbell curl to press' -> J59 'Bicycle crunches' -> J60 'Burpees'

Each circuit is 4 stations of 30-50 s mixing full-body / lower / core / upper ('Jumping Jacks' -> 'Bodyweight reverse lunges' -> 'Situps' -> 'Dumbbell overhead press'). The order alternates regions and puts the cardio station first (OBSERVED).

## 5. What the generator should do (INFERRED from sections 1-4)

Default session order, in slot terms the generator can fill from the library:

1. Prep: 5 min any cardio, then mobility ('KB Book openers' before pressing) or A-drills before lower days (N10).
2. Athletic block (athletic goals only): plyo (landing -> reactive) -> throws (light med ball, 8-10 lb per the coach) -> COD/sprint -> triple extension / Olympic (R3, R4, N5, N6). Pick the ballistic region by the day: upper ballistics on squat+pull days, lower on hinge+push days (N7).
3. Core: athletic goals put core here (Part B), anti-lateral / transverse / sagittal by day (N4, R10). Aesthetic goals move core to the optional day.
4. Strength block, lower and upper alternating (R8): bilateral lower + horizontal upper of the paired direction (squat+pull, hinge+push; R9, N18), then unilateral lower + vertical upper. Aesthetic = same-pattern unilateral; athletic/bootcamp = cross-pattern (N3). Use a contrast jump straight after the heavy lift only for speed/power goals (N12).
5. Isolation block: arm matching the upper direction (N1), the lower finisher matching the lower pattern (N2), leg extension before curl (N17). Aesthetic option: calves first (BYOP slot 1) and side raises first on push days (pre-exhaust, 4-TRACKS AESTHETICS).
6. Intensity technique (MYO) on the last exercise only (N13); conditioning 'Buy out' last (R10).
7. Week: keep the skeleton fixed for the block. Alternate the lead lift A/B week to week (N8) and mirror the second exposure of the day-type (N9). Rotate vectors per template (section 3).

## 6. Open questions for the coach

- Q1 (R1). BYOP always rows before the overhead pull, but FAT BURN, 4-TRACKS AESTHETICS and BOXING Wk1-2 put the pulldown first (48 sessions). Which should the generator follow? Is the crossed 'bench -> pulldown -> OHP -> row' order of FAT BURN a separate, intended upper-day template?
- Q2 (R2). On overhead-press weeks of CONJUGATE / 4-TRACKS STRENGTH, 'the work' is the OHP and the incline DB bench comes after. Is 'max-effort lift first regardless of vector' the rule there?
- Q3 (R4). HYBRID lists 'STRENGTH' (squat/deadlift) above 'OLY/ POWER' (cleans/snatches) every Mon/Thu. Should the cleans/snatches go first, as in BYOP 'Tripple Extension' and the BASEBALL 'OLY' rows? Or are they deliberately after the main lift?
- Q4 (R10). Core is Part B (before lifting) in BASEBALL and a superset filler in HYBRID, but sits on optional days in BYOP aesthetics. Confirm: athletes = core early, aesthetics = core separate/last?
- Q5 (R6/R7). Why 'Calves' as slot 1 in BYOP aesthetics Day 1/3, and side raises first on 4-TRACKS AESTHETICS push days: warm-up, pre-exhaust, or priority? Should the generator keep them first for every aesthetic client?
- Q6 (N3). Aesthetic days pair bilateral and unilateral of the SAME pattern (squat + lunge); BASEBALL and BOOTCAMP pair the opposite pattern (squat + single-leg RDL). Is that a goal-based rule we should hard-code?
- Q7 (R9). BOOTCAMP OPTION 1 Tue/Fri pairs hinge + vertical pull and lunge + horizontal push, the reverse of every other template. Intentional, or should it read hinge + push?
- Q8 (N8). Is the weekly A/B swap (squat-led week / hinge-led week; bench week / OHP week) the default for every program, or only FAT BURN / CONJUGATE / 4-TRACKS?
- Q9 (R3). BASEBALL sometimes puts the plyo in the strength slot ('plyo pushups' as 'horiz push', 'medball press' as 'vert push', 'split stance jump squats' as 'ukd'). Are those swaps for in-season or low-equipment weeks? When should the generator do that?
- Q10 (R10-conditioning). BOXING starts every day with cardio ('20 sec fast/ 40 sec slow', 'Easy cardio of choice (steady pace)', 'Cardio of any choice'). Warm-up or a real aerobic block? HYBRID Friday starts with '15-40 min constant cardo easy'. Same question.
- Q11 (data). BASEBALL BLOCK 1 wk 2 Monday labels are shifted one row (S35 'uhd' row empty, 'highest ankle hops' typed in the 'bicep' row S36 and again S38). Was 'uhd' meant to be filled? 4-TRACKS G56 reads only 'UNILATERAL' and is assumed to be 'UNILATERAL LAT PULL DOWN'.
- Q12 (N13). MYO sets only ever appear on the last 1-2 exercises (leg extension, leg press, arm/shoulder accessories). Is that a rule (never MYO on compounds or free weights)?

## Appendix A. Data quirks that affect ordering (OBSERVED)

- BYOP 03 'ATHLETIC - FULL BODY - 4 DAYS A' B30 (4th main day) is blank; position and layout show it is THURSDAY. The twin tab 08 fills it as B30 'THURSDAY'.
- BYOP 06 'BOOTCAMP - OPTION 2' A1 reads 'BOOTCAMP OPTION 1'. Its days are '1A','2A','3A','1B','2B','3B', and the 'Cardio' rows E7/E12/E22/E27 are wired to `B7:B335` (E15/E30 to `B7:B122`).
- MM 04 4-TRACKS STRENGTH left (E9:K24) duplicates MM 12 CONJUGATE (E13:K27) with small differences (e.g. 4-TRACKS F13 'HIGH INCLINE PRESS' vs CONJUGATE F17 'HEAVY OH PRESS'). Both are counted. 'HIGH INCLINE PRESS' is tagged horizontal and is borderline vertical.
- MM 04 HYBRID B99 'OLY/ POWER' (Saturday) has no content; excluded. C86 labels DEADLIFTS as 'KD' (probably a typo for HD); D-col 'DEADLIFTS' is used.
- BASEBALL slot labels drift by one row in some weeks (BLOCK 1 wk 2 Mon S35-S38; BLOCK 2 Part C sometimes 3 rows: E51 'Heavy front squats', E52 'KB squat cleans' [label 'horiz pull'], E53 'seal rows'). Pattern ROLES are taken from the label only when the written exercise is in the same body region.

## Appendix B. Every session's order

All 474 sessions, with every item's cell, coach slot label, text, tags and role, are in `ordering_audit.json` -> `sessions`. The exception lists above are generated from that file.