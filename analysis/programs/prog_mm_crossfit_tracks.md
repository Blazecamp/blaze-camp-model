# MASTER_MODEL: the CrossFit split, the 3 (4) training tracks, and the conjugate cycle (deep decode)

Source: workbook **BLAZE CAMP MASTER MODEL** (`raw/MASTER_MODEL.xlsx`, dumps in `dumps/MASTER_MODEL/`). Tabs decoded:

* `11_EXAMPLE_CROSSFIT_SPLIT` = sheet **'EXAMPLE CROSSFIT SPLIT'** (A1:W1014, 681 cells)
* `04_NOT_DONE_4_TRACKS_PROGRAMMING` = sheet **'(NOT DONE) 4 TRACKS PROGRAMMING'** (A1:AP1008, 1351 cells; no cells beyond column Z)
* `12_NOT_DONE_EXAMPLE_CONJUGATE` = sheet **'(NOT DONE) EXAMPLE CONJUGATE'** (A1:Z998, 208 cells)

Cross-referenced (read-only) for decoding: 'AEROBIC CAPACITY CHEAT SHEET' (the A/B/C aerobic letters), '(NOT DONE) RESISTANCE PATTERNS ', 'CONTROL PATTERNSCORE', and the BYOP 'MASTER EXERCISE LIBRARY' (column families and row-6 PURPOSE labels). Nothing in Google Sheets was touched. All values were read from the dumps and re-checked with openpyxl (number formats, fills).

Marking: **OBSERVED** = in the sheet (quoted verbatim, typos kept, e.g. 'STRNGTH', 'CLERANCE', 'DEAFLITS', 'ACCESORY', 'strenght'). *INFERRED* = my interpretation. My own names use correct spelling.

Machine-readable companion: `prog_mm_crossfit_tracks.volume.json` (8 program entries; every number in the tables below is computed from it).

---

## 0. Conventions used throughout

### 0.1 Date-looking cells are text the coach typed (OBSERVED)
openpyxl shows these cells with number format **`m/d`**, so Sheets displays them as month/day text:

| Cell(s) | Stored value | Displays as | Meaning |
|---|---|---|---|
| CROSSFIT `S4`..`S10`, `S11` | 2022-01-01, 02-01, 02-02, 03-02, 03-03, 04-03, 04-04, then the number 5 | '1/1', '2/1', '2/2', '3/2', '3/3', '4/3', '4/4', '5' | *INFERRED*: weekly **strength level / power level** codes for the 8-week class cycle (column header S3 'STRENGTH/POWER'). See section 1.9. |
| 4 TRACKS `C12`, `C16`; CONJUGATE `C16`, `C20` | 2022-08-08 | '8/8' | 8 reps per side (survival rows: 'RFE LUNGES' / 'STAGGERED STANCE DL', 'BICEP CURLS'). Same convention as the other MASTER_MODEL tabs. |

### 0.2 Counting convention and muscle credit
* 1 working set = **1.0** to each prime mover + **0.5** to each clear synergist. Prime movers come from the BYOP MASTER EXERCISE LIBRARY row-6 PURPOSE labels (OBSERVED). Synergists are *INFERRED*.
* **Athletic sets (AP_*) are reported separately as "athletic exposure"** and never added to hypertrophy volume. Plyo credit is quads 1.0, glutes 0.5, calves 0.5. Olympic-lift credit is glutes 1.0, quads 0.5, hamstrings 0.5, calves 0.5, upper back 0.5.
* **Conditioning is counted as sessions or bouts, not sets.** This covers aerobic work, sprints and WODs.

| Credit key | Used for (verbatim names in these tabs) | Credit |
|---|---|---|
| RP_BKD (library PURPOSE 'QUADS') | squats of every kind, 'LEG PRESS', 'LOW BAR', box squats | quads 1.0, glutes 0.5 |
| RP_BHD ('GLUTES/HAMSTRINGS') | deadlifts (deficit, chained, banded, snatch-grip, KB, hex), 'RDL', 'Good morning' | hamstrings 1.0, glutes 1.0 |
| RP_UKD ('QUADS/GLUTES') | FFE/RFE/reverse lunges, split squats, step-ups | quads 1.0, glutes 1.0 |
| RP_UHD ('GLUTES/HAMSTRINGS') | 'STAGGERED STANCE DL', 'SL RDL', 'UNI RDL' | hamstrings 1.0, glutes 1.0 |
| glute bridge (RP_UHD bucket) | 'UNI GB' | glutes 1.0, hamstrings 0.5 |
| RP_HPUSH ('CHEST/FRONT DELTS') | bench, incline bench, 'ALT INCLINE DB BENCH', push-ups | chest 1.0, front delts 1.0, triceps 0.5 |
| dips (RP_HPUSH bucket) | 'Machine Dips or dips' (the BYOP focus list files dips under TRICEP) | chest 1.0, triceps 1.0, front delts 0.5 |
| RP_VPUSH ('SHOULDERS/TRAPS') | OH press, push press, 'HIGH INCLINE PRESS', 'Arnold press' | front delts 1.0, side delts 0.5, triceps 0.5 |
| RP_HPULL ('BACK') | rows of every kind (bent-over, seal, machine, DB, 'MACHINE SUPPORTED ROW') | lats/upper back 1.0, rear delts 0.5, biceps 0.5 |
| RP_VPULL ('BACK') | pull-ups, lat pull-downs | lats/upper back 1.0, biceps 0.5 |
| 'Pull under' (RP_VPULL) | RESISTANCE PATTERNS lists 'Lat pull unders' in the vertical-pull column (E67); it is a straight-arm move | lats/upper back 1.0 |
| ISO_SIDE_REAR_DELT | side raises and upright rows | side delts 1.0 |
| ISO_SIDE_REAR_DELT | face pulls and reverse flies | rear delts 1.0, upper back 0.5 |
| ISO_QUAD / ISO_HAM / ISO_CHEST / ISO_BICEP / ISO_TRICEP | leg ext / leg curls / flies / curls / 'TATE PRESS', 'JM PRESS', tricep ext, bench dips | 1.0 to that muscle (bench dips: triceps 1.0, chest 0.5, front delts 0.5) |
| CORE_OTHER / CP_CORE_PELVIS | 'core' (unspecified) / 'T2B' (CONTROL PATTERNSCORE puts 'Toes to bar' under SAGITAL / CORE PELVIS / DYNAMIC; the BYOP library files it under CORE THORAX, O15) | abs/obliques 1.0 |

Library evidence for the less obvious mappings (OBSERVED in the BYOP library unless stated otherwise):
* 'Hex Bar Deadlifts', 'Single KB Deadlift' and 'Double KB Deadlift' sit under 'BILATERAL HIP DOMNANT'. That is why HYBRID's Thursday 'KD' label on 'KB DL' / 'HEX BAR OR DB DL' is treated as a slip and mapped to RP_BHD.
* 'Machine Good Mornings' is in BHD intermediate (AO).
* 'Leg press' is in 'RP-BS-KNEE DOMINANT -ADVANCED' (AK16).
* 'Staggered Stance DL w/ DB' is under 'UNILATERAL HIP DOMINANT' (AQ12).
* 'Tate Press' is under TRICEP (AT15).
* 'Seal ... Rows' are horizontal pulls (Y13-Y16).
* Depth drops, box jumps and hurdle hops are 'PLYOS' (G).
* Clean pulls and snatch pulls are 'TRIPPLE EXTENSION' (C/D).
* *INFERRED*: 'HIGH INCLINE PRESS' maps to RP_VPUSH, because the focus list files 'High incline db press' under SHOULDERS/TRAPS. Ordinary incline presses stay RP_HPUSH.

### 0.3 "As written" vs "assumed"
These three tabs have **no dropdowns** (DATA VALIDATIONS empty in all three). Where a dose is missing, the number is shown twice: **as written** (missing = 0) and **assumed** (the assumption is stated next to the table). Example: STRENGTH-12 'the accessory', which has no sets, is assumed to be 3 sets.

---

## 1. 'EXAMPLE CROSSFIT SPLIT'

### 1.1 Identity and layout (OBSERVED)
| Region | Content |
|---|---|
| A1 (cyan 00FFFF, bold) | 'COMPETE CROSSFIT SPLIT' |
| I1 (red E06666) | 'EVENT DATE JAN 12-15th' |
| A2 (pink D5A6BD) | 'EXAMPLE PLAN BUILDING FOR WODAPALOOZA' |
| A3:A7, L8 (cyan) | 'Basic Instruction:'; '*INSTEAD OF WORKING TO FAILURE, PUSH YOUR LIMITS OVER THE COURSE OF TIME'; '**CROSFFIT has its hybrid style of performance, so to be competitive, you MUST be able to be as good as possible in EACH modality. Train accordingly'; '***WODS will be prescribed by your box or program, yes they might interfere with recovery/performance, but thats part of CROSSFIT '; '*****If you have any questions just ask me - IG @BLAZECAMP or TWITTER @BLAZECAMP_'; '*THIS MAY ALL CHANGE AT SOME POINT FOR DETAIL' |
| A10:M17 | **Macro grid**: 7 qualities x 12 months, cells = level 1-4 |
| A19:E24 | **'FULL TIME'** level -> dose table |
| Q19:U25 (Q19 cyan) | **'HALF TIME'** level -> dose table (headers pink D5A6BD) |
| P1, R2:T3 | **'CLASS PROGRAMMING SPLIT'** (cyan) / 'EXAMPLE CROSSFIT STYLE PROGRAMMING MODEL' / class parts 'WARMUP/SKILL', 'STRENGTH/POWER', 'WOD' |
| Q4:S11 | 'WK 1'..'WK 8' with the level codes '1/1'..'5' in column S |
| P12:V16 | Weekly class template (days 'MON','TUES','WED','THURS','FRID','SAT'; rows 'STRNGTH','PWR','SKILLS','AEROBIC CAPACITY', all EA9999) |
| A27:I145 | **12 monthly weekly grids** (JUNE -> MAY), days 'MON','TUESD','WED','THURS','FRID','SAT','SUN' (D5A6BD), same 7 quality rows, level repeated in column I with the macro colour; J101 'EXAMPLE EVENT MONTH' |

**Population / goal** (OBSERVED): a competitive CrossFit athlete preparing for an event ('Wodapalooza', Jan 12-15). The class split serves box members.
**Equipment**: barbell gym plus gymnastics rig (snatch, clean, squat, deadlift, press, T2B, handstands, double-unders). *INFERRED*.
**Days per week**: 4 core days (MON, TUESD, THURS, FRID). SAT is used for extra AEROBIC/WOD in level-3/4 months. **WED and SUN are 'OFF' in every month.**

### 1.2 Colour key (OBSERVED colours; meaning *INFERRED*)
| Fill | Where | Meaning |
|---|---|---|
| F6B26B orange | AEROBIC C. and WODs levels (macro + column I) | energy-system / conditioning family |
| E06666 red | STRENGTH, POWER, TEST/PEAK levels; I1 event date | high-intensity neural family (max strength, power, testing). The same red marks 'ADVANCED' in the aerobic cheat sheet (G8) |
| 93C47D green | RESISTANCE levels | hypertrophy / foundational family. The same green marks 'BEGGINER WORKOUTS' (A8) in the cheat sheet and FOUNDATIONAL in the library |
| D5A6BD pink | A2, monthly day headers, HALF TIME headers | layout |
| 00FFFF cyan | titles and instructions | layout |

### 1.3 Macro grid, verbatim (A10:M17)
Rows are qualities in this order: 'AEROBIC C.', 'SKILL', 'STRENGTH', 'POWER', 'RESISTANCE', 'WODs', 'TEST/PEAK'. Columns are B10 'FEB' .. M10 'JAN'. Blank = quality not trained that month.

| Quality | FEB | MARCH | APRIL | MAY | JUNE | JULY | AUG | SEPT | OCT | NOV | DEC | JAN |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 'AEROBIC C.' (orange) | - | 1 | 2 | 3 | 1 | 2 | 3 | 4 | 2 | 3 | 4 | - |
| 'SKILL' | - | - | - | - | - | - | - | - | - | - | - | - |
| 'STRENGTH' (red) | - | - | 1 | - | 3 | 4 | - | - | 2 | 2 | - | - |
| 'POWER' (red) | - | - | 2 | - | - | - | 3 | 4 | - | - | 3 | - |
| 'RESISTANCE' (green) | 1 | 2 | - | - | 1 | 2 | - | - | 1 | 2 | - | - |
| 'WODs' (orange) | - | - | 2 | 3 | - | 2 | 3 | 4 | 2 | 3 | 4 | - |
| 'TEST/PEAK' (red) | - | - | - | 4 | - | - | - | 4 | - | - | - | 4 |

Number of qualities active per month: FEB 1, MAR 2, APR 4, MAY 3, JUN 3, JUL 4, AUG 3, SEP 4, OCT 4, NOV 4, DEC 3, JAN 1.
My own load index, the sum of the level numbers per month (*INFERRED construct*): FEB 1, MAR 3, APR 7, **MAY 10**; JUN 5, JUL 10, AUG 9, **SEP 16**; OCT 7, NOV 10, DEC 11, **JAN 4** (event taper).

### 1.4 Level -> dose tables, verbatim + decoded (A19:E24 and Q19:U25)
| Quality | Level | **FULL TIME** (verbatim) | sets x reps = total reps | **HALF TIME** (verbatim) | sets x reps = total reps |
|---|---|---|---|---|---|
| 'RESISTANCE' | 1 | 'LVL 1 = 2 SETS x 10' | 2x10 = 20 | 'LVL 1 = 2 SETS x 10' | 20 |
| | 2 | 'LVL 2 = 3 SETS x 10 ' | 3x10 = 30 (+50%) | 'LVL 2 = 3 SETS x 10 ' | 30 |
| 'STRENGTH' | 1 | 'LVL 1 = 3 SETS x 7' | 21 | 'LVL 1 = 3 SETS x 7' | 21 |
| | 2 | 'LVL 2 = 4 SETS x 6' | 24 (+14%) | 'LVL 2 = 3 SETS x 6' | 18 (-14%) |
| | 3 | 'LVL 3 = 5 SETS x 5' | 25 (+4%) | 'LVL 3 = 3 SETS x 5' | 15 (-17%) |
| | 4 | 'LVL 4 = 6 SETS x 4' | 24 (-4%) | 'LVL 4 = 3 SETS x 4' | 12 (-20%) |
| | 5 | - | - | 'LVL 5 = Work up to 1RM' | test |
| 'POWER ' | 1 | 'LVL 1 = 3 SETS x 3' | 9 | 'LVL 1 = 3 SETS x 4' | 12 |
| | 2 | 'LVL 2 = 4 SETS x 3' | 12 (+33%) | 'LVL 2 = 3 SETS x 3' | 9 (-25%) |
| | 3 | 'LVL 3 = 5 SETS x 3' | 15 (+25%) | 'LVL 3 = 3 SETS x 2' | 6 (-33%) |
| | 4 | 'LVL 4 = 6 SETS x 3' | 18 (+20%) | 'LVL 4 = 3 SETS x 1' | 3 (-50%) |
| 'AEROBIC CAP.' | 1 | 'LVL 1 = C' | C only | same | |
| | 2 | 'LVL 2 = C, B' | C + B | same | |
| | 3 | 'LVL 3 = C,B, A' | C + B + A | same | |
| | 4 | 'LVL 4 = LACTATE CLERANCE' | lactate-clearance intervals | same | |
| 'WODS' | 1-4 | 'LVL 1 = 1 a week', 'LVL 2 = 2 wods a week', 'LVL 3 = 3 wods a week', 'LVL 4 = wods a week' (number missing; the monthly grids show 4) | 1/2/3/4 WODs per week | same | |

**What the two tables encode (OBSERVED arithmetic, *INFERRED* intent):**
* **FULL TIME = add sets as the level rises.** Strength goes from 3 to 6 sets while reps drop 7 to 4, so total reps per lift stay **21-25**. Volume is held while intensity creeps up, and the extra sets pay for the lower reps. Power keeps 3 reps and adds sets, so total reps double from 9 to 18. Each level step adds about +26% sets per month (3->4->5->6), which is about **+5.5% per week** across a 4.3-week month. That sits right inside the coach's stated 3-7% weekly ramp.
* **HALF TIME = fixed 3 sets; cut reps as the level rises.** Strength reps go 7->6->5->4 and then a 1RM test. Power reps go 4->3->2->1. This is pure intensification at constant sets, with total reps falling 14-50% per step. It suits someone with limited time and recovery.
* **Which athlete is FULL vs HALF time** (*INFERRED*, strong): FULL TIME sits under the **competitor** macro. HALF TIME sits directly under the **'CLASS PROGRAMMING SPLIT'** and is the only table with 'LVL 5 = Work up to 1RM'. The class's 8-week code ends in '5', and only HALF TIME has a level 5. So FULL TIME = full-time competitor dosing and HALF TIME = class-member / part-time dosing. Alternative reading: HALF TIME = a quality trained alongside a competing quality. This is listed as an open question.
* **RESISTANCE never exceeds level 2** (2x10 or 3x10) in either table. In this CrossFit model hypertrophy is a low-dose base quality.

### 1.5 Aerobic letters A/B/C (decoded from 'AEROBIC CAPACITY CHEAT SHEET', OBSERVED)
* **'A'** (blue A4C2F4) = 'Short Duration' / 'High Intensity'. Formats are seconds of work at '15/45', '20/40', '30/30', '40/20', '45/15 Work:Rest', with 3-8 min rest periods.
* **'B'** (green B6D7A8) = 'Moderate Duration' / 'Moderate Intensity'. Formats are 1-3 minute efforts at 1:1 to 1:3 work:rest.
* **'C'** (orange F9CB9C) = 'Long Duration' / 'Low intensity'. Formats are '4+ Minutes' with active rest.
* 'LACTATE CLEARANCE' (G23) is its own interval table, e.g. '1 min MODERATE/20 Sec FASTEST/ 2 Min EASY', '2 Min FASTEST/ 4 Min MODERATE'.
* Rule A5 of that sheet: '***Never do the same color workout in the same week. You should do one of each color (Blue, Green, Orange) every week with a total of 3 Aerobic capacity workouts per week'.

So the aerobic level ladder is **an intensity-zone ladder**. Level 1 trains only long/low (C). Each level adds a faster zone (C,B then C,B,A). Level 4 adds lactate-clearance work. The monthly grids match: 2 aerobic days at levels 1-2, 3 days (MON/THURS/SAT) at level 3 (= one C, one B, one A), and 4 days (MON/TUESD/THURS/SAT) at level 4.

### 1.6 Monthly weekly grids, every month, every day (OBSERVED cells + decoded FULL TIME dose)
Strength labels per day are always MON 'KNEE DOM', TUESD 'PULL', THURS 'HIP DOM', FRID 'PUSH'. Resistance is 'LB' MON/THURS and 'UB' TUESD/FRID. Power is MON 'SNATCH', TUESD 'CLEAN', THURS 'SNATCH', FRID 'CLEAN'. Skill is 'T2B/ DUBS' / 'H.S./ DUBS'. Aerobic and WOD cells say 'YES' (JANUARY THURS says 'TYES'). WED and SUN say 'OFF' in every row except JANUARY TEST/PEAK WED (D105 blank).

| Month | Day | Components (verbatim cell + decoded dose) | Lifting sets (as written) |
|---|---|---|---|
| FEB | MON | RESISTANCE 'LB' 2x10 (LVL 1) | 2 |
| FEB | TUESD | RESISTANCE 'UB' 2x10 (LVL 1) | 2 |
| FEB | WED | OFF | 0 |
| FEB | THURS | RESISTANCE 'LB' 2x10 (LVL 1) | 2 |
| FEB | FRID | RESISTANCE 'UB' 2x10 (LVL 1) | 2 |
| FEB | SAT | (nothing scheduled) | 0 |
| FEB | SUN | OFF | 0 |
| MARCH | MON | AEROBIC C. 'YES' LVL 1 = C; STRENGTH 'KNEE DOM' (NO LEVEL in macro -> 0 as written); POWER 'SNATCH' (NO LEVEL in macro -> 0 as written); RESISTANCE 'LB' 3x10 (LVL 2) | 3 |
| MARCH | TUESD | SKILL 'T2B/ DUBS'; STRENGTH 'PULL' (NO LEVEL in macro -> 0 as written); POWER 'CLEAN' (NO LEVEL in macro -> 0 as written); RESISTANCE 'UB' 3x10 (LVL 2) | 3 |
| MARCH | WED | OFF | 0 |
| MARCH | THURS | AEROBIC C. 'YES' LVL 1 = C; STRENGTH 'HIP DOM' (NO LEVEL in macro -> 0 as written); POWER 'SNATCH' (NO LEVEL in macro -> 0 as written); RESISTANCE 'LB' 3x10 (LVL 2) | 3 |
| MARCH | FRID | SKILL 'H.S./ DUBS'; STRENGTH 'PUSH' (NO LEVEL in macro -> 0 as written); POWER 'CLEAN' (NO LEVEL in macro -> 0 as written); RESISTANCE 'UB' 3x10 (LVL 2) | 3 |
| MARCH | SAT | (nothing scheduled) | 0 |
| MARCH | SUN | OFF | 0 |
| APRIL | MON | AEROBIC C. 'YES' LVL 2 = C, B; STRENGTH 'KNEE DOM' 3x7 (LVL 1); POWER 'SNATCH' 4x3 (LVL 2); RESISTANCE 'LB' (NO LEVEL in macro -> 0 as written) | 7 |
| APRIL | TUESD | SKILL 'T2B/ DUBS'; STRENGTH 'PULL' 3x7 (LVL 1); POWER 'CLEAN' 4x3 (LVL 2); RESISTANCE 'UB' (NO LEVEL in macro -> 0 as written); WOD | 7 |
| APRIL | WED | OFF | 0 |
| APRIL | THURS | AEROBIC C. 'YES' LVL 2 = C, B; STRENGTH 'HIP DOM' 3x7 (LVL 1); POWER 'SNATCH' 4x3 (LVL 2); RESISTANCE 'LB' (NO LEVEL in macro -> 0 as written) | 7 |
| APRIL | FRID | SKILL 'H.S./ DUBS'; STRENGTH 'PUSH' 3x7 (LVL 1); POWER 'CLEAN' 4x3 (LVL 2); RESISTANCE 'UB' (NO LEVEL in macro -> 0 as written); WOD | 7 |
| APRIL | SAT | (nothing scheduled) | 0 |
| APRIL | SUN | OFF | 0 |
| MAY | MON | AEROBIC C. 'YES' LVL 3 = C,B, A; WOD | 0 |
| MAY | TUESD | (nothing scheduled) | 0 |
| MAY | WED | OFF | 0 |
| MAY | THURS | AEROBIC C. 'YES' LVL 3 = C,B, A; WOD | 0 |
| MAY | FRID | (nothing scheduled) | 0 |
| MAY | SAT | AEROBIC C. 'YES' LVL 3 = C,B, A; WOD | 0 |
| MAY | SUN | OFF | 0 |
| JUNE | MON | AEROBIC C. 'YES' LVL 1 = C; STRENGTH 'KNEE DOM' 5x5 (LVL 3); RESISTANCE 'LB' 2x10 (LVL 1) | 7 |
| JUNE | TUESD | SKILL 'T2B/ DUBS'; STRENGTH 'PULL' 5x5 (LVL 3); RESISTANCE 'UB' 2x10 (LVL 1) | 7 |
| JUNE | WED | OFF | 0 |
| JUNE | THURS | AEROBIC C. 'YES' LVL 1 = C; STRENGTH 'HIP DOM' 5x5 (LVL 3); RESISTANCE 'LB' 2x10 (LVL 1) | 7 |
| JUNE | FRID | SKILL 'H.S./ DUBS'; STRENGTH 'PUSH' 5x5 (LVL 3); RESISTANCE 'UB' 2x10 (LVL 1) | 7 |
| JUNE | SAT | (nothing scheduled) | 0 |
| JUNE | SUN | OFF | 0 |
| JULY | MON | AEROBIC C. 'YES' LVL 2 = C, B; STRENGTH 'KNEE DOM' 6x4 (LVL 4); RESISTANCE 'LB' 3x10 (LVL 2) | 9 |
| JULY | TUESD | SKILL 'T2B/ DUBS'; STRENGTH 'PULL' 6x4 (LVL 4); RESISTANCE 'UB' 3x10 (LVL 2); WOD | 9 |
| JULY | WED | OFF | 0 |
| JULY | THURS | AEROBIC C. 'YES' LVL 2 = C, B; STRENGTH 'HIP DOM' 6x4 (LVL 4); RESISTANCE 'LB' 3x10 (LVL 2) | 9 |
| JULY | FRID | SKILL 'H.S./ DUBS'; STRENGTH 'PUSH' 6x4 (LVL 4); RESISTANCE 'UB' 3x10 (LVL 2); WOD | 9 |
| JULY | SAT | (nothing scheduled) | 0 |
| JULY | SUN | OFF | 0 |
| AUG | MON | AEROBIC C. 'YES' LVL 3 = C,B, A; POWER 'SNATCH' 5x3 (LVL 3) | 5 |
| AUG | TUESD | POWER 'CLEAN' 5x3 (LVL 3); WOD | 5 |
| AUG | WED | OFF | 0 |
| AUG | THURS | AEROBIC C. 'YES' LVL 3 = C,B, A; POWER 'SNATCH' 5x3 (LVL 3) | 5 |
| AUG | FRID | POWER 'CLEAN' 5x3 (LVL 3); WOD | 5 |
| AUG | SAT | AEROBIC C. 'YES' LVL 3 = C,B, A | 0 |
| AUG | SUN | OFF | 0 |
| SEPT | MON | AEROBIC C. 'YES' LVL 4 = LACTATE CLERANCE; POWER 'SNATCH' 6x3 (LVL 4); WOD | 6 |
| SEPT | TUESD | AEROBIC C. 'YES' LVL 4 = LACTATE CLERANCE; POWER 'CLEAN' 6x3 (LVL 4); WOD | 6 |
| SEPT | WED | OFF | 0 |
| SEPT | THURS | AEROBIC C. 'YES' LVL 4 = LACTATE CLERANCE; POWER 'SNATCH' 6x3 (LVL 4); WOD | 6 |
| SEPT | FRID | POWER 'CLEAN' 6x3 (LVL 4); WOD | 6 |
| SEPT | SAT | AEROBIC C. 'YES' LVL 4 = LACTATE CLERANCE | 0 |
| SEPT | SUN | OFF | 0 |
| OCT | MON | AEROBIC C. 'YES' LVL 2 = C, B; STRENGTH 'KNEE DOM' 4x6 (LVL 2); RESISTANCE 'LB' 2x10 (LVL 1) | 6 |
| OCT | TUESD | STRENGTH 'PULL' 4x6 (LVL 2); RESISTANCE 'UB' 2x10 (LVL 1); WOD | 6 |
| OCT | WED | OFF | 0 |
| OCT | THURS | AEROBIC C. 'YES' LVL 2 = C, B; STRENGTH 'HIP DOM' 4x6 (LVL 2); RESISTANCE 'LB' 2x10 (LVL 1) | 6 |
| OCT | FRID | STRENGTH 'PUSH' 4x6 (LVL 2); RESISTANCE 'UB' 2x10 (LVL 1); WOD | 6 |
| OCT | SAT | (nothing scheduled) | 0 |
| OCT | SUN | OFF | 0 |
| NOV | MON | AEROBIC C. 'YES' LVL 3 = C,B, A; STRENGTH 'KNEE DOM' 4x6 (LVL 2); RESISTANCE 'LB' 3x10 (LVL 2); WOD | 7 |
| NOV | TUESD | SKILL 'T2B/ DUBS'; STRENGTH 'PULL' 4x6 (LVL 2); RESISTANCE 'UB' 3x10 (LVL 2); WOD | 7 |
| NOV | WED | OFF | 0 |
| NOV | THURS | AEROBIC C. 'YES' LVL 3 = C,B, A; STRENGTH 'HIP DOM' 4x6 (LVL 2); RESISTANCE 'LB' 3x10 (LVL 2) | 7 |
| NOV | FRID | SKILL 'H.S./ DUBS'; STRENGTH 'PUSH' 4x6 (LVL 2); RESISTANCE 'UB' 3x10 (LVL 2); WOD | 7 |
| NOV | SAT | AEROBIC C. 'YES' LVL 3 = C,B, A | 0 |
| NOV | SUN | OFF | 0 |
| DEC | MON | AEROBIC C. 'YES' LVL 4 = LACTATE CLERANCE; SKILL 'H.S./ DUBS'; POWER 'SNATCH' 5x3 (LVL 3); WOD | 5 |
| DEC | TUESD | AEROBIC C. 'YES' LVL 4 = LACTATE CLERANCE; SKILL 'T2B/ DUBS'; POWER 'CLEAN' 5x3 (LVL 3); WOD | 5 |
| DEC | WED | OFF | 0 |
| DEC | THURS | AEROBIC C. 'YES' LVL 4 = LACTATE CLERANCE; SKILL 'T2B/ DUBS'; POWER 'SNATCH' 5x3 (LVL 3); WOD | 5 |
| DEC | FRID | SKILL 'H.S./ DUBS'; POWER 'CLEAN' 5x3 (LVL 3); WOD | 5 |
| DEC | SAT | AEROBIC C. 'YES' LVL 4 = LACTATE CLERANCE | 0 |
| DEC | SUN | OFF | 0 |
| JAN | MON | AEROBIC C. 'YES' (no level in macro); SKILL 'H.S./ DUBS'; WOD | 0 |
| JAN | TUESD | SKILL 'T2B/ DUBS'; WOD | 0 |
| JAN | WED | OFF | 0 |
| JAN | THURS | AEROBIC C. 'TYES' (no level in macro); SKILL 'T2B/ DUBS'; WOD | 0 |
| JAN | FRID | SKILL 'H.S./ DUBS'; WOD | 0 |
| JAN | SAT | (nothing scheduled) | 0 |
| JAN | SUN | OFF | 0 |

**Grid vs macro consistency check (OBSERVED):**
* The levels in column I match the macro for every month and every quality, except JANUARY TEST/PEAK, where column I is blank (macro M17 = 4).
* **MARCH** grid lists STRENGTH (KD/PULL/HD/PUSH) and POWER (SNATCH/CLEAN) with no level, and the macro has none. *INFERRED*: a copy of the April/June grid not cleaned up, or the coach intends technique-level exposure. As written these count 0 (open question).
* **APRIL** grid lists RESISTANCE LB/UB with no level (macro D15 blank). Same treatment.
* **AUG** is 'WODs' level 3 (= '3 wods a week') but the grid has only TUESD/FRID 'YES' (2).
* **JANUARY** TEST/PEAK leaves **WED** without 'OFF'. *INFERRED*: Jan 12, 2022 was a Wednesday, so the event (Jan 12-15) starts on the normally-off day.

### 1.7 Canonical mapping of the CrossFit slot labels
| Day | Order (row order, *INFERRED* session order) | Part / quality (verbatim) | Slot label (verbatim) | Canonical bucket | Exercise | Sets x reps (FULL TIME by level) | Intensity | Notes |
|---|---|---|---|---|---|---|---|---|
| MON | 1 | 'AEROBIC C.' | 'YES' | COND_AEROBIC | C / B / A / lactate clearance by level | session | by level | lower-body days carry aerobic work |
| MON | 2 | 'SKILL' | 'H.S./ DUBS' (DEC, JAN only) | skill: handstand + AP_JUMP_LIMITED_KNEE (double-unders) | - | practice | - | |
| MON | 3 | 'STRENGTH' | 'KNEE DOM' | RP_BKD | not named (squat) | L1 3x7, L2 4x6, L3 5x5, L4 6x4 | none written | |
| MON | 4 | 'POWER' | 'SNATCH' | AP_TRIPLE_EXT | snatch | L1 3x3 .. L4 6x3 | | |
| MON | 5 | 'RESISTANCE' | 'LB' | unspecified lower (generator: RP_UKD/RP_UHD/ISO, *INFERRED*) | not named | L1 2x10, L2 3x10 | | same-region accessory |
| MON | 6 | 'WODs' | 'YES' | WOD (mixed modal) | box-prescribed | 1-4 per week | | A6 note |
| TUESD | 2 | 'SKILL' | 'T2B/ DUBS' | CP_CORE_PELVIS + AP_JUMP_LIMITED_KNEE | toes-to-bar, double-unders | practice | | hanging skill on PULL day |
| TUESD | 3 | 'STRENGTH' | 'PULL' | RP_HPULL / RP_VPULL (plane not named; counted 0.5/0.5) | not named | as above | | |
| TUESD | 4 | 'POWER' | 'CLEAN' | AP_TRIPLE_EXT | clean | as above | | |
| TUESD | 5 | 'RESISTANCE' | 'UB' | unspecified upper | | L1 2x10, L2 3x10 | | |
| THURS | 3 | 'STRENGTH' | 'HIP DOM' | RP_BHD | not named (deadlift) | as above | | |
| THURS | 4 | 'POWER' | 'SNATCH' | AP_TRIPLE_EXT | | | | |
| THURS | 5 | 'RESISTANCE' | 'LB' | unspecified lower | | | | |
| FRID | 2 | 'SKILL' | 'H.S./ DUBS' | handstand + AP_JUMP_LIMITED_KNEE | | | | inverted-press skill on PUSH day |
| FRID | 3 | 'STRENGTH' | 'PUSH' | RP_HPUSH / RP_VPUSH (counted 0.5/0.5) | | | | |
| FRID | 4 | 'POWER' | 'CLEAN' | AP_TRIPLE_EXT | | | | |
| FRID | 5 | 'RESISTANCE' | 'UB' | unspecified upper | | | | |
| SAT | - | 'AEROBIC C.' / 'WODs' | 'YES' (AUG, SEPT, NOV, DEC, MAY) | COND_AEROBIC / WOD | | | | 3rd/4th aerobic session at levels 3-4 |
| WED, SUN | - | all rows | 'OFF' | - | | | | |

### 1.8 Quantitative volume, competitor (FULL TIME), every month
Assumptions: macro levels drive the doses, and blank-level grid entries count 0. "Components" are the programmed quality cells per day. Resistance: **as written** = 1 unspecified exercise per LB/UB cell. **Assumed (ILLUSTRATIVE, not in sheet)** = 3 exercises per LB/UB session:
* LB MON: RP_UKD + RP_UHD + ISO_QUAD.
* LB THURS: RP_UKD + RP_UHD + ISO_HAM.
* UB TUESD: RP_HPULL + RP_HPUSH + ISO_SIDE_REAR_DELT.
* UB FRID: RP_VPULL + RP_VPUSH + 0.5 ISO_BICEP / 0.5 ISO_TRICEP.

| Month | Macro levels (OBSERVED) | Strength sets/wk (FT) | Power sets/wk (FT) | Resistance sets/wk: 1 ex per LB/UB slot (as written) / 3 ex (assumed) | Aerobic sessions/wk (grid) | WOD sessions/wk (grid) | Skill sessions/wk | Components per day MON/TUESD/WED/THURS/FRID/SAT/SUN (leveled only) | Sets per day as written | Sets per day (3-ex resistance assumed) | Weekly lifting sets as written / assumed |
|---|---|---|---|---|---|---|---|---|---|---|---|
| FEB | RES 1 | 0 | 0 | 8 / 24 | 0 | 0 | 0 | 1/1/0/1/1/0/0 | 2/2/0/2/2/0/0 | 6/6/0/6/6/0/0 | 8 / 24 |
| MARCH | AER 1, RES 2 | 0 | 0 | 12 / 36 | 2 | 0 | 2 | 2/2/0/2/2/0/0 | 3/3/0/3/3/0/0 | 9/9/0/9/9/0/0 | 12 / 36 |
| APRIL | AER 2, STR 1, POW 2, WOD 2 | 12 | 16 | 0 / 0 | 2 | 2 | 2 | 3/4/0/3/4/0/0 | 7/7/0/7/7/0/0 | 7/7/0/7/7/0/0 | 28 / 28 |
| MAY | AER 3, WOD 3, TEST 4 | 0 | 0 | 0 / 0 | 3 | 3 | 0 | 2/0/0/2/0/2/0 | 0/0/0/0/0/0/0 | 0/0/0/0/0/0/0 | 0 / 0 |
| JUNE | AER 1, STR 3, RES 1 | 20 | 0 | 8 / 24 | 2 | 0 | 2 | 3/3/0/3/3/0/0 | 7/7/0/7/7/0/0 | 11/11/0/11/11/0/0 | 28 / 44 |
| JULY | AER 2, STR 4, RES 2, WOD 2 | 24 | 0 | 12 / 36 | 2 | 2 | 2 | 3/4/0/3/4/0/0 | 9/9/0/9/9/0/0 | 15/15/0/15/15/0/0 | 36 / 60 |
| AUG | AER 3, POW 3, WOD 3 | 0 | 20 | 0 / 0 | 3 | 2 | 0 | 2/2/0/2/2/1/0 | 5/5/0/5/5/0/0 | 5/5/0/5/5/0/0 | 20 / 20 |
| SEPT | AER 4, POW 4, WOD 4, TEST 4 | 0 | 24 | 0 / 0 | 4 | 4 | 0 | 3/3/0/3/2/1/0 | 6/6/0/6/6/0/0 | 6/6/0/6/6/0/0 | 24 / 24 |
| OCT | AER 2, STR 2, RES 1, WOD 2 | 16 | 0 | 8 / 24 | 2 | 2 | 0 | 3/3/0/3/3/0/0 | 6/6/0/6/6/0/0 | 10/10/0/10/10/0/0 | 24 / 40 |
| NOV | AER 3, STR 2, RES 2, WOD 3 | 16 | 0 | 12 / 36 | 3 | 3 | 2 | 4/4/0/3/4/1/0 | 7/7/0/7/7/0/0 | 13/13/0/13/13/0/0 | 28 / 52 |
| DEC | AER 4, POW 3, WOD 4 | 0 | 20 | 0 / 0 | 4 | 4 | 4 | 4/4/0/4/3/1/0 | 5/5/0/5/5/0/0 | 5/5/0/5/5/0/0 | 20 / 20 |
| JAN | TEST 4 | 0 | 0 | 0 / 0 | 2 | 4 | 4 | 3/2/0/3/2/0/0 | 0/0/0/0/0/0/0 | 0/0/0/0/0/0/0 | 0 / 0 |

Weekly sets by bucket and by muscle:

| Month | Weekly sets by bucket (as written; RES_*_UNSPEC = 1 unspecified exercise per LB/UB slot) | Hypertrophy sets by muscle (strength slots only) | Hypertrophy sets by muscle (strength + ILLUSTRATIVE 3-exercise LB/UB) | Athletic exposure by muscle (Olympic lifts) |
|---|---|---|---|---|
| FEB | RES_LB_UNSPEC 4, RES_UB_UNSPEC 4 | 0 | quads 6, glutes 8, hamstrings 6, chest 2, lats_upper_back 4, front_delts 4, side_delts 3, rear_delts 1, biceps 3, triceps 3 | 0 |
| MARCH | RES_LB_UNSPEC 6, RES_UB_UNSPEC 6 | 0 | quads 9, glutes 12, hamstrings 9, chest 3, lats_upper_back 6, front_delts 6, side_delts 4.5, rear_delts 1.5, biceps 4.5, triceps 4.5 | 0 |
| APRIL | AP_TRIPLE_EXT 16, RP_BKD 3, RP_BHD 3, RP_HPUSH 1.5, RP_VPUSH 1.5, RP_HPULL 1.5, RP_VPULL 1.5 | quads 3, glutes 4.5, hamstrings 3, chest 1.5, lats_upper_back 3, front_delts 3, side_delts 0.75, rear_delts 0.75, biceps 1.5, triceps 1.5 | quads 3, glutes 4.5, hamstrings 3, chest 1.5, lats_upper_back 3, front_delts 3, side_delts 0.75, rear_delts 0.75, biceps 1.5, triceps 1.5 | quads 8, glutes 16, hamstrings 8, lats_upper_back 8, calves 8 |
| MAY | 0 | 0 | 0 | 0 |
| JUNE | RP_BKD 5, RP_BHD 5, RP_HPUSH 2.5, RP_VPUSH 2.5, RP_HPULL 2.5, RP_VPULL 2.5, RES_LB_UNSPEC 4, RES_UB_UNSPEC 4 | quads 5, glutes 7.5, hamstrings 5, chest 2.5, lats_upper_back 5, front_delts 5, side_delts 1.25, rear_delts 1.25, biceps 2.5, triceps 2.5 | quads 11, glutes 15.5, hamstrings 11, chest 4.5, lats_upper_back 9, front_delts 9, side_delts 4.25, rear_delts 2.25, biceps 5.5, triceps 5.5 | 0 |
| JULY | RP_BKD 6, RP_BHD 6, RP_HPUSH 3, RP_VPUSH 3, RP_HPULL 3, RP_VPULL 3, RES_LB_UNSPEC 6, RES_UB_UNSPEC 6 | quads 6, glutes 9, hamstrings 6, chest 3, lats_upper_back 6, front_delts 6, side_delts 1.5, rear_delts 1.5, biceps 3, triceps 3 | quads 15, glutes 21, hamstrings 15, chest 6, lats_upper_back 12, front_delts 12, side_delts 6, rear_delts 3, biceps 7.5, triceps 7.5 | 0 |
| AUG | AP_TRIPLE_EXT 20 | 0 | 0 | quads 10, glutes 20, hamstrings 10, lats_upper_back 10, calves 10 |
| SEPT | AP_TRIPLE_EXT 24 | 0 | 0 | quads 12, glutes 24, hamstrings 12, lats_upper_back 12, calves 12 |
| OCT | RP_BKD 4, RP_BHD 4, RP_HPUSH 2, RP_VPUSH 2, RP_HPULL 2, RP_VPULL 2, RES_LB_UNSPEC 4, RES_UB_UNSPEC 4 | quads 4, glutes 6, hamstrings 4, chest 2, lats_upper_back 4, front_delts 4, side_delts 1, rear_delts 1, biceps 2, triceps 2 | quads 10, glutes 14, hamstrings 10, chest 4, lats_upper_back 8, front_delts 8, side_delts 4, rear_delts 2, biceps 5, triceps 5 | 0 |
| NOV | RP_BKD 4, RP_BHD 4, RP_HPUSH 2, RP_VPUSH 2, RP_HPULL 2, RP_VPULL 2, RES_LB_UNSPEC 6, RES_UB_UNSPEC 6 | quads 4, glutes 6, hamstrings 4, chest 2, lats_upper_back 4, front_delts 4, side_delts 1, rear_delts 1, biceps 2, triceps 2 | quads 13, glutes 18, hamstrings 13, chest 5, lats_upper_back 10, front_delts 10, side_delts 5.5, rear_delts 2.5, biceps 6.5, triceps 6.5 | 0 |
| DEC | AP_TRIPLE_EXT 20 | 0 | 0 | quads 10, glutes 20, hamstrings 10, lats_upper_back 10, calves 10 |
| JAN | 0 | 0 | 0 | 0 |

The same macro dosed with the HALF TIME table (to show the difference the table makes):

| Month | Strength sets/wk if HALF TIME table used | Power sets/wk if HALF TIME | Strength FT -> HT | Power FT -> HT |
|---|---|---|---|---|
| FEB | 0 | 0 | 0 -> 0 | 0 -> 0 |
| MARCH | 0 | 0 | 0 -> 0 | 0 -> 0 |
| APRIL | 12 | 12 | 12 -> 12 | 16 -> 12 |
| MAY | 0 | 0 | 0 -> 0 | 0 -> 0 |
| JUNE | 12 | 0 | 20 -> 12 | 0 -> 0 |
| JULY | 12 | 0 | 24 -> 12 | 0 -> 0 |
| AUG | 0 | 12 | 0 -> 0 | 20 -> 12 |
| SEPT | 0 | 12 | 0 -> 0 | 24 -> 12 |
| OCT | 12 | 0 | 16 -> 12 | 0 -> 0 |
| NOV | 12 | 0 | 16 -> 12 | 0 -> 0 |
| DEC | 0 | 12 | 0 -> 0 | 20 -> 12 |
| JAN | 0 | 0 | 0 -> 0 | 0 -> 0 |

Reading the numbers:
* The competitor never does more than **36 lifting sets/week** as written (JULY: 24 strength + 12 resistance). That is **6 sets per main pattern per week**.
* Per-muscle hypertrophy volume from the strength slots alone is 4-9 sets/week. Even with the illustrative 3-exercise resistance sessions it peaks around 15-21 for quads/glutes/hamstrings in JULY and stays at or below 12 for every upper-body muscle.
* Hypertrophy in this model is a **minimum-effective-dose base**. The training stress is carried by WODs (up to 4/week), aerobic work (up to 4/week) and Olympic lifting (up to 24 sets/week).
* Power months have **zero** strength or resistance sets.

### 1.9 Program B: the class programming split (P1:V16, Q4:S11, HALF TIME)
**Identity** (OBSERVED + *INFERRED*): group-class box programming. The class structure is R3 'WARMUP/SKILL' -> S3 'STRENGTH/POWER' -> T3 'WOD'. It runs 6 class days (MON..SAT). The 8-week strength/power cycle ends in a 1RM.

| Day (verbatim) | 'STRNGTH' | 'PWR' | 'SKILLS' | 'AEROBIC CAPACITY' | Canonical | WOD |
|---|---|---|---|---|---|---|
| 'MON' | 'SQUAT' | - | 'DUBS' | 'LVL 4' | RP_BKD + AP_JUMP_LIMITED_KNEE skill + COND_AEROBIC (lactate clearance) | yes (*INFERRED*: every class has a WOD) |
| 'TUES' | 'PRESS' | 'SNATCH' | - | - | RP_VPUSH + AP_TRIPLE_EXT | yes |
| 'WED' | - | - | - | - | WOD only | yes |
| 'THURS' | 'DEADLIFT' | - | 'GYMNASTICS' | 'LVL 3' | RP_BHD + gymnastics skill + COND_AEROBIC (C,B,A) | yes |
| 'FRID' | - | 'CLEAN' | - | - | AP_TRIPLE_EXT | yes |
| 'SAT' | - | - | - | - | WOD only | yes |

Decoding the 'STRENGTH/POWER' codes (*INFERRED*). The first number steps up on even weeks and the second on odd weeks, so they are **two level tracks offset by one week**: strength leads, power follows. WK 8 '5' = strength 'LVL 5 = Work up to 1RM', and there is no power level 5. Doses come from the HALF TIME table:

| Week | Code (S column, 'STRENGTH/POWER') | Strength (HALF TIME) | Power (HALF TIME) | Strength sets/wk (squat+press+deadlift) | Power sets/wk (snatch+clean) | Strength reps/wk | Power reps/wk | Weekly sets by bucket | Hypertrophy sets by muscle |
|---|---|---|---|---|---|---|---|---|---|
| WK 1 | '1/1' (cell S4 = date 2022-01-01) | LVL 1 = 3 SETS x 7 | LVL 1 = 3 SETS x 4 | 9 | 6 | 63 | 24 | AP_TRIPLE_EXT 6, RP_BKD 3, RP_BHD 3, RP_VPUSH 3 | quads 3, glutes 4.5, hamstrings 3, front_delts 3, side_delts 1.5, triceps 1.5 |
| WK 2 | '2/1' (cell S5 = date 2022-02-01) | LVL 2 = 3 SETS x 6 | LVL 1 = 3 SETS x 4 | 9 | 6 | 54 | 24 | AP_TRIPLE_EXT 6, RP_BKD 3, RP_BHD 3, RP_VPUSH 3 | quads 3, glutes 4.5, hamstrings 3, front_delts 3, side_delts 1.5, triceps 1.5 |
| WK 3 | '2/2' (cell S6 = date 2022-02-02) | LVL 2 = 3 SETS x 6 | LVL 2 = 3 SETS x 3 | 9 | 6 | 54 | 18 | AP_TRIPLE_EXT 6, RP_BKD 3, RP_BHD 3, RP_VPUSH 3 | quads 3, glutes 4.5, hamstrings 3, front_delts 3, side_delts 1.5, triceps 1.5 |
| WK 4 | '3/2' (cell S7 = date 2022-03-02) | LVL 3 = 3 SETS x 5 | LVL 2 = 3 SETS x 3 | 9 | 6 | 45 | 18 | AP_TRIPLE_EXT 6, RP_BKD 3, RP_BHD 3, RP_VPUSH 3 | quads 3, glutes 4.5, hamstrings 3, front_delts 3, side_delts 1.5, triceps 1.5 |
| WK 5 | '3/3' (cell S8 = date 2022-03-03) | LVL 3 = 3 SETS x 5 | LVL 3 = 3 SETS x 2 | 9 | 6 | 45 | 12 | AP_TRIPLE_EXT 6, RP_BKD 3, RP_BHD 3, RP_VPUSH 3 | quads 3, glutes 4.5, hamstrings 3, front_delts 3, side_delts 1.5, triceps 1.5 |
| WK 6 | '4/3' (cell S9 = date 2022-04-03) | LVL 4 = 3 SETS x 4 | LVL 3 = 3 SETS x 2 | 9 | 6 | 36 | 12 | AP_TRIPLE_EXT 6, RP_BKD 3, RP_BHD 3, RP_VPUSH 3 | quads 3, glutes 4.5, hamstrings 3, front_delts 3, side_delts 1.5, triceps 1.5 |
| WK 7 | '4/4' (cell S10 = date 2022-04-04) | LVL 4 = 3 SETS x 4 | LVL 4 = 3 SETS x 1 | 9 | 6 | 36 | 6 | AP_TRIPLE_EXT 6, RP_BKD 3, RP_BHD 3, RP_VPUSH 3 | quads 3, glutes 4.5, hamstrings 3, front_delts 3, side_delts 1.5, triceps 1.5 |
| WK 8 | '5' (cell S11 = 5.0) | LVL 5 = Work up to 1RM | none (no POWER LVL 5) | 3 | 0 | 3 | 0 | RP_BKD 1, RP_BHD 1, RP_VPUSH 1 | quads 1, glutes 1.5, hamstrings 1, front_delts 1, side_delts 0.5, triceps 0.5 |

Rules visible:
* Each big lift once a week: squat MON, press TUES, deadlift THURS.
* Olympic lifts on the non-squat/deadlift days: snatch TUES, clean FRID.
* Squat and deadlift are 3 days apart.
* Skill is paired with the strength day: DUBS with squat, GYMNASTICS with deadlift.
* Aerobic capacity happens on the lower-body days at levels 4 and 3.
* Progression is pure intensity (reps down, sets fixed at 3). Strength reps per week fall 63->54->54->45->45->36->36 (-14%, -17%, -20% at each step). Week 8 tests.

### 1.10 Rep ranges, intensity, rest, tempo (CrossFit tab)
* Strength 4-7 reps (FULL TIME 7/6/5/4; HALF TIME 7/6/5/4 + 1RM).
* Power 3 reps FULL TIME; 4->1 HALF TIME.
* Resistance 10 reps.
* Aerobic by zone letter. WODs box-prescribed.
* **No %, RPE, RIR, rest or tempo written.** The only intensity rule is A4 '*INSTEAD OF WORKING TO FAILURE, PUSH YOUR LIMITS OVER THE COURSE OF TIME' (progressive overload across weeks, not failure within a session).

### 1.11 Periodization logic of the annual plan (OBSERVED pattern, *INFERRED* intent)
1. **Event-to-event year.** The macro starts in FEB, right after the JAN event, and ends at the next JAN event.
2. **Three blocks of ~4 months, each ending in 'TEST/PEAK' level 4:** FEB-MAY (test MAY), JUNE-SEPT (test SEPT), OCT-JAN (event JAN). That is a ~16-17-week cycle, which is the coach's natural "long" plan. A 12-week plan is the last 3 months of a block, and an 8-week plan is 2 of them.
3. **Inside each block the lifting qualities are sequenced, not mixed: RESISTANCE (hypertrophy) -> STRENGTH -> POWER -> TEST.**
   * Block 2 is the clearest: JUNE res 1 + str 3 -> JULY res 2 + str 4 -> AUG power 3 -> SEPT power 4 + test.
   * Block 3: OCT res 1 + str 2 -> NOV res 2 + str 2 -> DEC power 3 -> JAN event.
   * Block 1 is the post-event rebuild: FEB res 1 -> MAR res 2 -> APR str 1 + power 2 (the only month with strength and power together) -> MAY test with no lifting.
   This is accumulation -> transmutation -> realization (block-periodization shape) built from first principles, not from a named template.
4. **Resistance always rides with strength** (same months, same days, same body region: LB on knee/hip days, UB on push/pull days). It always drops out when power starts. RESISTANCE goes 1 -> 2 across the two strength months of a block.
5. **Conditioning ramps inside every block and resets at the next.** AEROBIC goes 1->2->3 (block 1), 1->2->3->4 (block 2), 2->3->4 (block 3). WODs go 2->3 (block 1), 0->2->3->4 (block 2), 2->3->4 (block 3).
   * Each block starts conditioning **higher** than the previous one (block 3 starts aerobic at level 2). Fitness is retained and the base rises over the year.
   * WODs only appear once strength is established (from APRIL/JULY/OCT).
6. **Strength level resets per block but not to zero:** block 1 L1, block 2 L3->L4, block 3 L2->L2. Power: block 1 L2, block 2 L3->L4, block 3 L3.
   *INFERRED*: block 3 (pre-event) keeps strength moderate (L2) to leave room for conditioning L3-4 and WODs L3-4. That is an interference-management choice.
7. **Peak/test months strip the lifting.** MAY and JAN have no strength, power or resistance. SEPT keeps power L4 plus test.
8. **Skill** ('T2B/ DUBS', 'H.S./ DUBS') is present in strength months and the event approach (DEC/JAN at 4 days/week). It is absent in power-only months AUG/SEPT and in OCT/FEB/MAY.
9. **Dose change happens at month boundaries** (4-5 weeks at a constant level). Inside the month the week repeats.

### 1.12 What the CrossFit tab reveals (*INFERRED*)
* The coach thinks in **qualities with levels**, not in exercises. A plan is a matrix of quality x time, and every cell is a level. A separate table converts each level into sets x reps, or sessions per week, or energy-system zones. This is the core data model for the generator: `plan[quality][month] = level`, `dose = table[population][quality][level]`.
* There are **two dose tables for two populations** (full-time competitor vs part-time/class). The competitor gets **volume** progression (add sets). The part-timer gets **intensity** progression (cut reps).
* **Hypertrophy is a base quality** (green, levels 1-2 only, early in each block). Strength and power are expressive qualities (red), sequenced after hypertrophy.
* Conditioning is ramped **by adding intensity zones** (C -> B -> A -> lactate clearance) and sessions, never by making one session longer.

---

## 2. '(NOT DONE) 4 TRACKS PROGRAMMING'

### 2.0 Identity and layout (OBSERVED)
* A1 (cyan, bold) '8 WEEKS OF 3 TRACKS PROGRAMMING EXAMPLE - ONGOING TRAINING'.
* A2 (yellow FFFF00) '*This is what I sell online to my athletes and coach them through it dependent on their goals'.
* The tab name says **4** tracks; the title says **3**. The visible tracks (red FF0000 bold headers) are:
  * A3 **'STRENGTH'** / C3 **'conjugate style training'**
  * A30 **'AESTHETICS'** / C30 **'bodybuilding style'**
  * A69 **'HYBRID'** / C69 **'strenght - athletic - crossfitish training'**
* STRENGTH and AESTHETICS each have **two programs side by side**: a left **8-week** block (B:L, 'WK1'..'WK8') and a right **12-week** block (M:Z, 'WK1'..'WK12'). HYBRID has only the 8-week block.
* Column M holds the slot labels for the STRENGTH block ('the work' CC4125, 'the accessory' CC0000, 'the nuance' E69138, 'the survival' F1C232). The fills run dark red -> red -> orange -> gold. *INFERRED*: a priority / intensity gradient, hottest first.
* Other fills:
  * STRENGTH left block: weeks 1-5 (E9:I23) are filled FCE5CD peach; weeks 6-8 are not. *INFERRED*: a "weeks delivered/finalised" marker, not a training variable. In tab 12 only WK1 is filled.
  * STRENGTH right block: WK6 column T8:T24 is filled FFF2CC (light yellow), the last week of wave 1. T18 'LOW BAR' is bright green 00FF00.
  * AESTHETICS: Wednesday/Saturday rows are lavender D9D2E9 (the cardio days of the left block). That fill spills into the right block rows 46/62.
  * AESTHETICS: Z31/Z32 (WK12 sets 5 / reps '15/15/12/12/12') are FCE5CD, highlighting the peak week. X51 'Arnold press' is F4CCCC.
  * Hyperlinks (blue font): P39/R39/T39/P55/R55/T55/V55 -> [video link removed] ('cable tricep extension'); V39:Z39, W55:Z55 -> [video link removed] ('overhead cable rope tricep ext'). Exercise demo videos.

### 2.1 STRENGTH track, 8-week conjugate (left block B3:L24)
**Identity**:
* Goal: maximal strength via conjugate (max-effort + dynamic-effort) with plyometrics and hypertrophy support.
* Level: intermediate-advanced (*INFERRED* from box squats, chains, bands, deficit/snatch-grip pulls).
* 4 days: MONDAY lower M.E., WEDNESDAY upper M.E., THURSDAY plyo + lower D.E., SATURDAY upper D.E.
* Equipment: barbell, box, bands, chains, DBs, pull-up bar.

**Header ladders (OBSERVED)**:
* E4:L4 green B6D7A8 = 5,5,4,4,3,3,2,1. The B8 'Sets' header is the same green, so this is a **sets ladder**.
* E5:L5 pink EAD1DC = 5,4,3,2,1,3,2,1. The C8 'Reps' header is pink, so this is the **M.E. reps ladder**, used by C9/C13 'SEE' (pink).
* E6:L6 blue CFE2F3 = 3,3,2,1,3,2,1,1. This is the **D.E. reps ladder**, used by C18/C21 'SEE' (blue).
* Column D 'LOAD' holds '1RIR', '2RIR', 'MAX', 'ALL', 'EASY'.
* Green-filled set cells: B9 (5), B13 (5), B17 (3), B21 (3), i.e. the first row of every day.

| Day | Order | Slot label (col M, verbatim) | Canonical bucket(s) | Exercise by week (verbatim) [bucket] | Sets (col B) | Reps (col C) | Load (col D) | Notes |
|---|---|---|---|---|---|---|---|---|
| MONDAY | 1 | 'the work' | RP_BHD, RP_BKD | wk1 'HEAVY FRONT SQUAT (D)BOX SQUAT ' [RP_BKD]; wk2 'HEAVY DEFICIT DEADLIFT' [RP_BHD]; wk3 'HEAVY (D)BOX HIGH BAR SQUAT' [RP_BKD]; wk4 'HEAVY CHAINED DEADLIFT' [RP_BHD]; wk5 'HEAVY FRONT SQUAT ' [RP_BKD]; wk6 'HEAVY DEADLIFT' [RP_BHD]; wk7 'HEAVY HIGH BAR SQUAT' [RP_BKD]; wk8 'TEST' [TEST] | 5 (B cell green B6D7A8) | 'SEE' pink row: 5,4,3,2,1,3,2,1 | '1RIR' |  |
| MONDAY | 2 | 'the accessory' | RP_BHD, RP_BKD | wk1 'SNATCH GRIP DL' [RP_BHD]; wk2 'F. SQUAT (T&G)BOX' [RP_BKD]; wk3 'DEF. DL or SNATCH GRIP' [RP_BHD]; wk4 '(T&G)BOX HIGH BAR SQUAT' [RP_BKD]; wk5 'DEF. DL or SNATCH GRIP' [RP_BHD]; wk6 'HIGH BAR SQUAT' [RP_BKD]; wk7 'DEADLIFT' [RP_BHD] | 3 | 6 | '2RIR' |  |
| MONDAY | 3 | 'the nuance' | RP_HPULL, RP_VPULL | wk1 'PULL UPS' [RP_VPULL]; wk2 'DB ROWS 8/8' [RP_HPULL]; wk3 'PULL UPS' [RP_VPULL]; wk4 'DB ROWS 8/8' [RP_HPULL]; wk5 'PULL UPS' [RP_VPULL]; wk6 'DB ROWS 8/8' [RP_HPULL]; wk7 'PULL UPS' [RP_VPULL] | 4 | 8 | 'MAX' |  |
| MONDAY | 4 | 'the survival' | RP_UHD, RP_UKD | wk1 'RFE LUNGES' [RP_UKD]; wk2 'STAGGERED STANCE DL' [RP_UHD]; wk3 'FFE LUNGES' [RP_UKD]; wk4 'STAGGERED STANCE DL' [RP_UHD]; wk5 'REVERSE LUNGES' [RP_UKD]; wk6 'STAGGERED STANCE DL' [RP_UHD]; wk7 'FFE & RFE SPLIT SQTS.' [RP_UKD] | 2 | 8/8 | 'ALL' |  |
| WEDNESDAY | 1 | 'the work' | RP_HPUSH, RP_VPUSH | wk1 'HEAVY BENCH PRESS' [RP_HPUSH]; wk2 'HIGH INCLINE PRESS' [RP_VPUSH]; wk3 'HEAVY BENCH PRESS' [RP_HPUSH]; wk4 'HIGH INCLINE PRESS' [RP_VPUSH]; wk5 'HEAVY BENCH PRESS' [RP_HPUSH]; wk6 'HEAVY OH PRESS' [RP_VPUSH]; wk7 'HEAVY BENCH PRESS' [RP_HPUSH]; wk8 'TEST' [TEST] | 5 (B cell green B6D7A8) | 'SEE' pink row: 5,4,3,2,1,3,2,1 | '1RIR' |  |
| WEDNESDAY | 2 | 'the accessory' | RP_HPULL, RP_VPULL | wk1 'BENT OVER ROW' [RP_HPULL]; wk2 'CLOSE GRIP PULL UPS' [RP_VPULL]; wk3 'SEAL ROWS' [RP_HPULL]; wk4 'BENT OVER ROWS' [RP_HPULL]; wk5 'PRONATED PULL UPS' [RP_VPULL]; wk6 'SEAL ROWS' [RP_HPULL]; wk7 'PRONATED PULL UPS' [RP_VPULL] | 3 | 6 | '2RIR' |  |
| WEDNESDAY | 3 | 'the nuance' | RP_HPUSH | wk1 'ALT INCLINE DB BENCH' [RP_HPUSH]; wk2 'ALT INCLINE DB BENCH' [RP_HPUSH]; wk3 'ALT INCLINE DB BENCH' [RP_HPUSH]; wk4 'ALT INCLINE DB BENCH' [RP_HPUSH]; wk5 'ALT INCLINE DB BENCH' [RP_HPUSH]; wk6 'ALT INCLINE DB BENCH' [RP_HPUSH]; wk7 'ALT INCLINE DB BENCH' [RP_HPUSH] | 4 | 10 | 'MAX' |  |
| WEDNESDAY | 4 | 'the survival' | ISO_BICEP | wk1 'BICEP CURLS' [ISO_BICEP]; wk2 'BICEP CURLS' [ISO_BICEP]; wk3 'BICEP CURLS' [ISO_BICEP]; wk4 'BICEP CURLS' [ISO_BICEP]; wk5 'BICEP CURLS' [ISO_BICEP]; wk6 'BICEP CURLS' [ISO_BICEP]; wk7 'BICEP CURLS' [ISO_BICEP] | 3 | 8/8 | 'ALL' |  |
| THURSDAY | 1 | 'the work' | AP_PLYO | wk1 'WEIGHTED DEPTH DROP' [AP_PLYO]; wk2 'DEPTH DROP & JUMP' [AP_PLYO]; wk3 'HIGH SQUAT JUMPS' [AP_PLYO]; wk4 'REPEAT HIGH JUMPS' [AP_PLYO]; wk5 'WEIGHTED DEPTH DROP' [AP_PLYO]; wk6 'DEPTH DROP & JUMP' [AP_PLYO]; wk7 'REPEAT HIGH JUMPS' [AP_PLYO]; wk8 'DELOAD' [DELOAD] | 3 (B cell green B6D7A8) | 6 | 'EASY' |  |
| THURSDAY | 2 | 'the accessory' | RP_BHD, RP_BKD | wk1 'FAST FRONT SQUATS (D) BOX' [RP_BKD]; wk2 'FAST BANDED DL ' [RP_BHD]; wk3 'FAST HIGH BAR (D)BOX' [RP_BKD]; wk4 'FAST BANDED DL' [RP_BHD]; wk5 'FAST FRONT SQUAT' [RP_BKD]; wk6 'FAST DEADLIFT' [RP_BHD]; wk7 'FAST HIGH BAR SQUAT' [RP_BKD] | 5 | 'SEE' blue row: 3,3,2,1,3,2,1,1 | '1RIR' |  |
| THURSDAY | 3 | 'the nuance' | RP_HPULL, RP_VPULL | wk1 'PULL UPS' [RP_VPULL]; wk2 'DB ROWS 8/8' [RP_HPULL]; wk3 'PULL UPS' [RP_VPULL]; wk4 'DB ROWS 8/8' [RP_HPULL]; wk5 'PULL UPS' [RP_VPULL]; wk6 'DB ROWS 8/8' [RP_HPULL]; wk7 'PULL UPS' [RP_VPULL] | 4 | 6 | '2RIR' |  |
| THURSDAY | 4 | 'the survival' | RP_UHD, RP_UKD | wk1 'RFE LUNGES' [RP_UKD]; wk2 'STAGGERED STANCE DL' [RP_UHD]; wk3 'FFE LUNGES' [RP_UKD]; wk4 'STAGGERED STANCE DL' [RP_UHD]; wk5 'REVERSE LUNGES' [RP_UKD]; wk6 'STAGGERED STANCE DL' [RP_UHD]; wk7 'FFE & RFE SPLIT SQTS.' [RP_UKD] | 4 | 10 | 'MAX' |  |
| SATURDAY | 1 | 'the work' | RP_HPUSH, RP_VPUSH | wk1 'FAST BANDED BENCH PRESS' [RP_HPUSH]; wk2 'FAST DB OH PRESS' [RP_VPUSH]; wk3 'FAST BANDED BENCH PRESS' [RP_HPUSH]; wk4 'PUSH PRESS' [RP_VPUSH]; wk5 'FAST BANDED BENCH PRESS' [RP_HPUSH]; wk6 'FAST DB OH PRESS' [RP_VPUSH]; wk7 'FAST BENCH PRESS' [RP_HPUSH]; wk8 'DELOAD' [DELOAD] | 3 (B cell green B6D7A8) | 'SEE' blue row: 3,3,2,1,3,2,1,1 | '1RIR' |  |
| SATURDAY | 2 | 'the accessory' | RP_HPULL, RP_VPULL | wk1 'BENT OVER ROW' [RP_HPULL]; wk2 'CLOSE GRIP PULL UPS' [RP_VPULL]; wk3 'SEAL ROWS' [RP_HPULL]; wk4 'BENT OVER ROWS' [RP_HPULL]; wk5 'PRONATED PULL UPS' [RP_VPULL]; wk6 'SEAL ROWS' [RP_HPULL]; wk7 'PRONATED PULL UPS' [RP_VPULL] | 4 | 6 | '2RIR' |  |
| SATURDAY | 3 | 'the nuance' | RP_HPUSH | wk1 'ALT INCLINE DB BENCH' [RP_HPUSH]; wk2 'ALT INCLINE DB BENCH' [RP_HPUSH]; wk3 'ALT INCLINE DB BENCH' [RP_HPUSH]; wk4 'ALT INCLINE DB BENCH' [RP_HPUSH]; wk5 'ALT INCLINE DB BENCH' [RP_HPUSH]; wk6 'ALT INCLINE DB BENCH' [RP_HPUSH]; wk7 'ALT INCLINE DB BENCH' [RP_HPUSH] | 4 | 10 | 'MAX' |  |
| SATURDAY | 4 | 'the survival' | (empty) | - | - | - | - | M-label present, no exercise in left block |

**Rules visible (OBSERVED unless marked):**
1. **Day structure is four slots: 'the work' -> 'the accessory' -> 'the nuance' -> 'the survival'.** The M labels repeat every 4 rows; Saturday has only 3 exercises.
2. **The main lift alternates squat-variant week / hinge-variant week.** Mon M.E.: wk1 squat, wk2 deadlift, ... wk7 squat. Thursday D.E. follows the same pattern that week. So each week is a "KD week" or an "HD week" for the lower body.
3. **Opposite-dominance accessory.** Monday's accessory is always the **other** bilateral pattern: squat M.E. -> 'SNATCH GRIP DL' / 'DEF. DL or SNATCH GRIP' / 'DEADLIFT'; deadlift M.E. -> box/high-bar squat. It is dosed 3x6 @ '2RIR'.
4. **The unilateral 'survival' matches the week's main pattern.** KD week -> 'RFE LUNGES' / 'FFE LUNGES' / 'REVERSE LUNGES' / 'FFE & RFE SPLIT SQTS.'; HD week -> 'STAGGERED STANCE DL'. Mon and Thu share the same unilateral exercise.
5. **Pulling every day.**
   * Lower days: 'the nuance' = 'PULL UPS' / 'DB ROWS 8/8', alternating weekly.
   * Upper days: 'the accessory' = rows / pull-ups, rotating 'BENT OVER ROW', 'CLOSE GRIP PULL UPS', 'SEAL ROWS', 'PRONATED PULL UPS'.
   * Upper days: push main -> pull accessory -> push nuance ('ALT INCLINE DB BENCH' 4x10 'MAX') -> arm isolation ('BICEP CURLS' 3x'8/8' 'ALL').
6. **The plyo goes first on the dynamic lower day and is labelled 'the work'.** It is 3x6 'EASY': 'WEIGHTED DEPTH DROP' -> 'DEPTH DROP & JUMP' -> 'HIGH SQUAT JUMPS' -> 'REPEAT HIGH JUMPS'. The fast squat/deadlift then sits in 'the accessory' slot. *INFERRED*: on the speed day the speed/power expression is "the work"; the bar is secondary.
7. **Effort rises as exercise complexity falls:** '1RIR' (M.E./D.E.) -> '2RIR' (accessory) -> 'MAX' (nuance) -> 'ALL' (survival).
   *INFERRED*: 'MAX' = heaviest load for the prescribed reps at about 0-1 RIR; 'ALL' = all-out to (technical) failure.
   This matches tab 12's A5 '*Always leave 1 rep in the tank, never work up to failure but get as close as you can' for the main lifts, and Israetel-style "isolations can go to failure".
8. **Week 8 = 'TEST' (L9, L13) on the M.E. days and 'DELOAD' (L17, L21) on the D.E. days.** No accessories are written in week 8.
9. **Variation menu = conjugate:** '(D)BOX' (deload box), '(T&G)BOX' (touch-and-go box), 'DEFICIT', 'CHAINED', 'BANDED', 'SNATCH GRIP', 'FRONT' / 'HIGH BAR', 'HIGH INCLINE' / 'OH PRESS' / 'PUSH PRESS'. These are the RESISTANCE PATTERNS "loading variables" ('CHAINS', 'BANDS', 'Deficit', 'Box *ANY Squat...').

**Quantitative volume, as written** (B-column set numbers held constant; ME/DE reps from the ladders):

| Week | Exercises per session MON/WED/THU/SAT | Sets per session | Weekly sets | Weekly sets by bucket | Hypertrophy sets by muscle | Athletic exposure |
|---|---|---|---|---|---|---|
| WK1 | 4/4/4/3 | 14/15/16/11 | 56 | AP_PLYO 3, RP_BKD 10, RP_BHD 3, RP_UKD 6, RP_HPUSH 16, RP_HPULL 7, RP_VPULL 8, ISO_BICEP 3 | quads 16, glutes 14, hamstrings 3, chest 16, lats_upper_back 15, front_delts 16, rear_delts 3.5, biceps 10.5, triceps 8 | quads 3, glutes 1.5, calves 1.5 |
| WK2 | 4/4/4/3 | 14/15/16/11 | 56 | AP_PLYO 3, RP_BKD 3, RP_BHD 10, RP_UHD 6, RP_HPUSH 8, RP_VPUSH 8, RP_HPULL 8, RP_VPULL 7, ISO_BICEP 3 | quads 3, glutes 17.5, hamstrings 16, chest 8, lats_upper_back 15, front_delts 16, side_delts 4, rear_delts 4, biceps 10.5, triceps 8 | quads 3, glutes 1.5, calves 1.5 |
| WK3 | 4/4/4/3 | 14/15/16/11 | 56 | AP_PLYO 3, RP_BKD 10, RP_BHD 3, RP_UKD 6, RP_HPUSH 16, RP_HPULL 7, RP_VPULL 8, ISO_BICEP 3 | quads 16, glutes 14, hamstrings 3, chest 16, lats_upper_back 15, front_delts 16, rear_delts 3.5, biceps 10.5, triceps 8 | quads 3, glutes 1.5, calves 1.5 |
| WK4 | 4/4/4/3 | 14/15/16/11 | 56 | AP_PLYO 3, RP_BKD 3, RP_BHD 10, RP_UHD 6, RP_HPUSH 8, RP_VPUSH 8, RP_HPULL 15, ISO_BICEP 3 | quads 3, glutes 17.5, hamstrings 16, chest 8, lats_upper_back 15, front_delts 16, side_delts 4, rear_delts 7.5, biceps 10.5, triceps 8 | quads 3, glutes 1.5, calves 1.5 |
| WK5 | 4/4/4/3 | 14/15/16/11 | 56 | AP_PLYO 3, RP_BKD 10, RP_BHD 3, RP_UKD 6, RP_HPUSH 16, RP_VPULL 15, ISO_BICEP 3 | quads 16, glutes 14, hamstrings 3, chest 16, lats_upper_back 15, front_delts 16, biceps 10.5, triceps 8 | quads 3, glutes 1.5, calves 1.5 |
| WK6 | 4/4/4/3 | 14/15/16/11 | 56 | AP_PLYO 3, RP_BKD 3, RP_BHD 10, RP_UHD 6, RP_HPUSH 8, RP_VPUSH 8, RP_HPULL 15, ISO_BICEP 3 | quads 3, glutes 17.5, hamstrings 16, chest 8, lats_upper_back 15, front_delts 16, side_delts 4, rear_delts 7.5, biceps 10.5, triceps 8 | quads 3, glutes 1.5, calves 1.5 |
| WK7 | 4/4/4/3 | 14/15/16/11 | 56 | AP_PLYO 3, RP_BKD 10, RP_BHD 3, RP_UKD 6, RP_HPUSH 16, RP_VPULL 15, ISO_BICEP 3 | quads 16, glutes 14, hamstrings 3, chest 16, lats_upper_back 15, front_delts 16, biceps 10.5, triceps 8 | quads 3, glutes 1.5, calves 1.5 |
| WK8 | 1/1/1/1 | 5/5/0/0 | 10 | RP_BKD 5, RP_HPUSH 5 | quads 5, glutes 2.5, chest 5, front_delts 5, triceps 2.5 | 0 |

**Variant: the green sets ladder applied to the two M.E. rows only** (B9/B13 = 5 = ladder WK1, the most literal reading of the green fill):

| Week | Exercises per session | Sets per session | Weekly sets | Weekly sets by bucket | Hypertrophy sets by muscle | Athletic exposure |
|---|---|---|---|---|---|---|
| WK1 | 4/4/4/3 | 14/15/16/11 | 56 | AP_PLYO 3, RP_BKD 10, RP_BHD 3, RP_UKD 6, RP_HPUSH 16, RP_HPULL 7, RP_VPULL 8, ISO_BICEP 3 | quads 16, glutes 14, hamstrings 3, chest 16, lats_upper_back 15, front_delts 16, rear_delts 3.5, biceps 10.5, triceps 8 | quads 3, glutes 1.5, calves 1.5 |
| WK2 | 4/4/4/3 | 14/15/16/11 | 56 | AP_PLYO 3, RP_BKD 3, RP_BHD 10, RP_UHD 6, RP_HPUSH 8, RP_VPUSH 8, RP_HPULL 8, RP_VPULL 7, ISO_BICEP 3 | quads 3, glutes 17.5, hamstrings 16, chest 8, lats_upper_back 15, front_delts 16, side_delts 4, rear_delts 4, biceps 10.5, triceps 8 | quads 3, glutes 1.5, calves 1.5 |
| WK3 | 4/4/4/3 | 13/14/16/11 | 54 | AP_PLYO 3, RP_BKD 9, RP_BHD 3, RP_UKD 6, RP_HPUSH 15, RP_HPULL 7, RP_VPULL 8, ISO_BICEP 3 | quads 15, glutes 13.5, hamstrings 3, chest 15, lats_upper_back 15, front_delts 15, rear_delts 3.5, biceps 10.5, triceps 7.5 | quads 3, glutes 1.5, calves 1.5 |
| WK4 | 4/4/4/3 | 13/14/16/11 | 54 | AP_PLYO 3, RP_BKD 3, RP_BHD 9, RP_UHD 6, RP_HPUSH 8, RP_VPUSH 7, RP_HPULL 15, ISO_BICEP 3 | quads 3, glutes 16.5, hamstrings 15, chest 8, lats_upper_back 15, front_delts 15, side_delts 3.5, rear_delts 7.5, biceps 10.5, triceps 7.5 | quads 3, glutes 1.5, calves 1.5 |
| WK5 | 4/4/4/3 | 12/13/16/11 | 52 | AP_PLYO 3, RP_BKD 8, RP_BHD 3, RP_UKD 6, RP_HPUSH 14, RP_VPULL 15, ISO_BICEP 3 | quads 14, glutes 13, hamstrings 3, chest 14, lats_upper_back 15, front_delts 14, biceps 10.5, triceps 7 | quads 3, glutes 1.5, calves 1.5 |
| WK6 | 4/4/4/3 | 12/13/16/11 | 52 | AP_PLYO 3, RP_BKD 3, RP_BHD 8, RP_UHD 6, RP_HPUSH 8, RP_VPUSH 6, RP_HPULL 15, ISO_BICEP 3 | quads 3, glutes 15.5, hamstrings 14, chest 8, lats_upper_back 15, front_delts 14, side_delts 3, rear_delts 7.5, biceps 10.5, triceps 7 | quads 3, glutes 1.5, calves 1.5 |
| WK7 | 4/4/4/3 | 11/12/16/11 | 50 | AP_PLYO 3, RP_BKD 7, RP_BHD 3, RP_UKD 6, RP_HPUSH 13, RP_VPULL 15, ISO_BICEP 3 | quads 13, glutes 12.5, hamstrings 3, chest 13, lats_upper_back 15, front_delts 13, biceps 10.5, triceps 6.5 | quads 3, glutes 1.5, calves 1.5 |
| WK8 | 1/1/1/1 | 1/1/0/0 | 2 | RP_BKD 1, RP_HPUSH 1 | quads 1, glutes 0.5, chest 1, front_delts 1, triceps 0.5 | 0 |

**Variant: the green ladder applied to all four green-filled rows** (B9, B13, B17, B21):

| Week | Exercises per session | Sets per session | Weekly sets | Weekly sets by bucket | Hypertrophy sets by muscle | Athletic exposure |
|---|---|---|---|---|---|---|
| WK1 | 4/4/4/3 | 14/15/18/13 | 60 | AP_PLYO 5, RP_BKD 10, RP_BHD 3, RP_UKD 6, RP_HPUSH 18, RP_HPULL 7, RP_VPULL 8, ISO_BICEP 3 | quads 16, glutes 14, hamstrings 3, chest 18, lats_upper_back 15, front_delts 18, rear_delts 3.5, biceps 10.5, triceps 9 | quads 5, glutes 2.5, calves 2.5 |
| WK2 | 4/4/4/3 | 14/15/18/13 | 60 | AP_PLYO 5, RP_BKD 3, RP_BHD 10, RP_UHD 6, RP_HPUSH 8, RP_VPUSH 10, RP_HPULL 8, RP_VPULL 7, ISO_BICEP 3 | quads 3, glutes 17.5, hamstrings 16, chest 8, lats_upper_back 15, front_delts 18, side_delts 5, rear_delts 4, biceps 10.5, triceps 9 | quads 5, glutes 2.5, calves 2.5 |
| WK3 | 4/4/4/3 | 13/14/17/12 | 56 | AP_PLYO 4, RP_BKD 9, RP_BHD 3, RP_UKD 6, RP_HPUSH 16, RP_HPULL 7, RP_VPULL 8, ISO_BICEP 3 | quads 15, glutes 13.5, hamstrings 3, chest 16, lats_upper_back 15, front_delts 16, rear_delts 3.5, biceps 10.5, triceps 8 | quads 4, glutes 2, calves 2 |
| WK4 | 4/4/4/3 | 13/14/17/12 | 56 | AP_PLYO 4, RP_BKD 3, RP_BHD 9, RP_UHD 6, RP_HPUSH 8, RP_VPUSH 8, RP_HPULL 15, ISO_BICEP 3 | quads 3, glutes 16.5, hamstrings 15, chest 8, lats_upper_back 15, front_delts 16, side_delts 4, rear_delts 7.5, biceps 10.5, triceps 8 | quads 4, glutes 2, calves 2 |
| WK5 | 4/4/4/3 | 12/13/16/11 | 52 | AP_PLYO 3, RP_BKD 8, RP_BHD 3, RP_UKD 6, RP_HPUSH 14, RP_VPULL 15, ISO_BICEP 3 | quads 14, glutes 13, hamstrings 3, chest 14, lats_upper_back 15, front_delts 14, biceps 10.5, triceps 7 | quads 3, glutes 1.5, calves 1.5 |
| WK6 | 4/4/4/3 | 12/13/16/11 | 52 | AP_PLYO 3, RP_BKD 3, RP_BHD 8, RP_UHD 6, RP_HPUSH 8, RP_VPUSH 6, RP_HPULL 15, ISO_BICEP 3 | quads 3, glutes 15.5, hamstrings 14, chest 8, lats_upper_back 15, front_delts 14, side_delts 3, rear_delts 7.5, biceps 10.5, triceps 7 | quads 3, glutes 1.5, calves 1.5 |
| WK7 | 4/4/4/3 | 11/12/15/10 | 48 | AP_PLYO 2, RP_BKD 7, RP_BHD 3, RP_UKD 6, RP_HPUSH 12, RP_VPULL 15, ISO_BICEP 3 | quads 13, glutes 12.5, hamstrings 3, chest 12, lats_upper_back 15, front_delts 12, biceps 10.5, triceps 6 | quads 2, glutes 1, calves 1 |
| WK8 | 1/1/1/1 | 1/1/0/0 | 2 | RP_BKD 1, RP_HPUSH 1 | quads 1, glutes 0.5, chest 1, front_delts 1, triceps 0.5 | 0 |

**Reps, intensity, progression:**
* M.E. reps per session: as written (5 sets) 25, 20, 15, 10, 5, 15, 10, 5, then a test. With the green ladder: **25, 20, 12, 8, 3, 9, 4, 1 (TEST)**.
* D.E. (5 sets) 15, 15, 10, 5, 15, 10, 5, then deload.
* Accessory 6 reps, nuance 6-10, survival '8/8' per side or 10, plyo 6.
* Two descending rep waves (5->1 then 3->1) inside 7 weeks, then test.
* Weekly set count is flat (56) as written, or **falls** 56 -> 50 with the ladder: volume is traded for intensity.
* Tempo and rest: none written.

### 2.2 STRENGTH track, 12-week (right block M3:Z24)
**Header rows (OBSERVED, N3:Z6):**

| | WK1 | WK2 | WK3 | WK4 | WK5 | WK6 | WK7 | WK8 | WK9 | WK10 | WK11 | WK12 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| '%' | 80 | 80 | 85 | 85 | 90 | 90 | 'MID DELOAD' | - | - | - | - | - |
| 'RPE' | 7 | 7 | 7 | 8 | 8 | 9 | 7 | 8 | 9 | 9 | 9 | 10 |
| 'SETS' | 4 | 4 | 5 | 5 | 6 | 6 | 3 | 5 | 6 | 6 | 7 | 7 |
| 'REPS' | 5 | 5 | 4 | 4 | 3 | 3 | 4 | 4 | 3 | 3 | 2 | 2 |

| Day | Order | Slot label (col M) | Col N prescription (verbatim) | Canonical bucket(s) | Exercise by week (verbatim) [bucket] | Sets | Reps | Intensity |
|---|---|---|---|---|---|---|---|---|
| MONDAY | 1 | 'the work' | 'M.E.' | RP_BHD, RP_BKD | wk1 'HIGH BAR SQUAT' [RP_BKD]; wk2 'RDL (stiff leg deadlift)' [RP_BHD]; wk3 'HIGH BAR SQUAT' [RP_BKD]; wk4 'RDL' [RP_BHD]; wk5 'Front squat' [RP_BKD]; wk6 'DEADLIFT' [RP_BHD]; wk7 'HIGH BAR SQUAT' [RP_BKD]; wk8 'RDL' [RP_BHD]; wk9 'HIGH BAR SQUAT' [RP_BKD]; wk10 'RDL' [RP_BHD]; wk11 'HIGH BAR SQUAT' [RP_BKD]; wk12 'DEADLIFT' [RP_BHD] | header SETS row | header REPS row | header %/RPE |
| MONDAY | 2 | 'the accessory' | (blank) | RP_BHD, RP_BKD | wk1 'RDL' [RP_BHD]; wk2 'HIGH BAR SQUAT' [RP_BKD]; wk3 'RDL' [RP_BHD]; wk4 'HIGH BAR' [RP_BKD]; wk5 'DEADLIFT' [RP_BHD]; wk6 'Front squat' [RP_BKD]; wk7 'RDL' [RP_BHD]; wk8 'Front squat' [RP_BKD]; wk9 'RDL' [RP_BHD]; wk10 'Front squat' [RP_BKD]; wk11 'DEADLIFT' [RP_BHD]; wk12 'Front squat' [RP_BKD] | unset | unset | - |
| MONDAY | 3 | 'the nuance' | '3x8' | RP_UHD, RP_UKD | wk1 'STAGGERED STANCE DL' [RP_UHD]; wk2 'FFE LUNGES' [RP_UKD]; wk3 'STAGGERED STANCE DL' [RP_UHD]; wk4 'REVERSE LUNGES' [RP_UKD]; wk5 'STAGGERED STANCE DL' [RP_UHD]; wk6 'FFE & RFE SPLIT SQTS.' [RP_UKD]; wk7 'STAGGERED STANCE DL' [RP_UHD]; wk8 'FFE LUNGES' [RP_UKD]; wk9 'STAGGERED STANCE DL' [RP_UHD]; wk10 'REVERSE LUNGES' [RP_UKD]; wk11 'STAGGERED STANCE DL' [RP_UHD]; wk12 'FFE & RFE SPLIT SQTS.' [RP_UKD] | 3 | 8 | - |
| MONDAY | 4 | 'the survival' | '3x8' | ISO_HAM, ISO_QUAD | wk1 'LEG EXT' [ISO_QUAD]; wk2 'LEG CURLS' [ISO_HAM]; wk3 'LEG EXT' [ISO_QUAD]; wk4 'LEG CURLS' [ISO_HAM]; wk5 'LEG EXT' [ISO_QUAD]; wk6 'LEG CURLS' [ISO_HAM]; wk7 'LEG EXT' [ISO_QUAD]; wk8 'LEG CURLS' [ISO_HAM]; wk9 'LEG EXT' [ISO_QUAD]; wk10 'LEG CURLS' [ISO_HAM]; wk11 'LEG EXT' [ISO_QUAD]; wk12 'LEG CURLS' [ISO_HAM] | 3 | 8 | - |
| WEDNESDAY | 1 | 'the work' | 'M.E.' | RP_HPUSH | wk1 'BENCH PRESS' [RP_HPUSH]; wk2 'INCLINE BENCH' [RP_HPUSH]; wk3 'BENCH PRESS' [RP_HPUSH]; wk4 'INCLINE BENCH' [RP_HPUSH]; wk5 'BENCH PRESS' [RP_HPUSH]; wk6 'INCLINE BENCH' [RP_HPUSH]; wk7 'BENCH PRESS' [RP_HPUSH]; wk8 'INCLINE BENCH' [RP_HPUSH]; wk9 'BENCH PRESS' [RP_HPUSH]; wk10 'INCLINE BENCH' [RP_HPUSH]; wk11 'BENCH PRESS' [RP_HPUSH]; wk12 'INCLINE BENCH' [RP_HPUSH] | header SETS row | header REPS row | header %/RPE |
| WEDNESDAY | 2 | 'the accessory' | (blank) | RP_HPULL, RP_VPULL | wk1 'LAT PULL DOWN' [RP_VPULL]; wk2 'MACHINE ROW' [RP_HPULL]; wk3 'LAT PULL DOWN' [RP_VPULL]; wk4 'MACHINE ROW' [RP_HPULL]; wk5 'LAT PULL DOWN' [RP_VPULL]; wk6 'MACHINE ROW' [RP_HPULL]; wk7 'LAT PULL DOWN' [RP_VPULL]; wk8 'MACHINE ROW' [RP_HPULL]; wk9 'LAT PULL DOWN' [RP_VPULL]; wk10 'MACHINE ROW' [RP_HPULL]; wk11 'LAT PULL DOWN' [RP_VPULL]; wk12 'MACHINE ROW' [RP_HPULL] | unset | unset | - |
| WEDNESDAY | 3 | 'the nuance' | '3x20' | ISO_TRICEP | wk1 'TATE PRESS' [ISO_TRICEP]; wk2 'TATE PRESS' [ISO_TRICEP]; wk3 'TATE PRESS' [ISO_TRICEP]; wk4 'TATE PRESS' [ISO_TRICEP]; wk5 'TATE PRESS' [ISO_TRICEP]; wk6 'TATE PRESS' [ISO_TRICEP]; wk7 'TATE PRESS' [ISO_TRICEP]; wk8 'TATE PRESS' [ISO_TRICEP]; wk9 'TATE PRESS' [ISO_TRICEP]; wk10 'TATE PRESS' [ISO_TRICEP]; wk11 'TATE PRESS' [ISO_TRICEP]; wk12 'TATE PRESS' [ISO_TRICEP] | 3 | 20 | - |
| WEDNESDAY | 4 | 'the survival' | '3x8' | ISO_BICEP, ISO_SIDE_REAR_DELT | wk1 'SIDE RAISES' [ISO_SIDE_REAR_DELT]; wk2 'CURLS' [ISO_BICEP]; wk3 'SIDE RAISES' [ISO_SIDE_REAR_DELT]; wk4 'CURLS' [ISO_BICEP]; wk5 'SIDE RAISES' [ISO_SIDE_REAR_DELT]; wk6 'CURLS' [ISO_BICEP]; wk7 'SIDE RAISES' [ISO_SIDE_REAR_DELT]; wk8 'CURLS' [ISO_BICEP]; wk9 'SIDE RAISES' [ISO_SIDE_REAR_DELT]; wk10 'CURLS' [ISO_BICEP]; wk11 'SIDE RAISES' [ISO_SIDE_REAR_DELT]; wk12 'CURLS' [ISO_BICEP] | 3 | 8 | - |
| THURSDAY | 1 | 'the work' | 'FAST RPE6 or about 60-70%' | RP_BHD, RP_BKD | wk1 'LEG PRESS' [RP_BKD]; wk2 'DEADLIFT' [RP_BHD]; wk3 'LEG PRESS' [RP_BKD]; wk4 'DEADLIFT' [RP_BHD]; wk5 'LEG PRESS' [RP_BKD]; wk6 'DEADLIFT' [RP_BHD]; wk7 'LEG PRESS' [RP_BKD]; wk8 'DEADLIFT' [RP_BHD]; wk9 'LEG PRESS' [RP_BKD]; wk10 'DEADLIFT' [RP_BHD]; wk11 'LEG PRESS' [RP_BKD]; wk12 'DEADLIFT' [RP_BHD] | header SETS row | header REPS row | FAST RPE6 or about 60-70% |
| THURSDAY | 2 | 'the accessory' | (blank) | RP_BHD, RP_BKD | wk1 'Good morning' [RP_BHD]; wk2 'LEG PRESS' [RP_BKD]; wk3 'RDL/Good morning' [RP_BHD]; wk4 'LEG PRESS' [RP_BKD]; wk5 'RDL/Good morning' [RP_BHD]; wk6 'LOW BAR' [RP_BKD]; wk7 'RDL/Good morning' [RP_BHD]; wk8 'LEG PRESS' [RP_BKD]; wk9 'RDL' [RP_BHD]; wk10 'LEG PRESS' [RP_BKD]; wk11 'RDL' [RP_BHD]; wk12 'LOW BAR' [RP_BKD] | unset | unset | - |
| THURSDAY | 3 | 'the nuance' | '3x8' | RP_UHD, RP_UKD | wk1 'STAGGERED STANCE DL' [RP_UHD]; wk2 'FFE LUNGES' [RP_UKD]; wk3 'STAGGERED STANCE DL' [RP_UHD]; wk4 'REVERSE LUNGES' [RP_UKD]; wk5 'STAGGERED STANCE DL' [RP_UHD]; wk6 'FFE & RFE SPLIT SQTS.' [RP_UKD]; wk7 'STAGGERED STANCE DL' [RP_UHD]; wk8 'FFE LUNGES' [RP_UKD]; wk9 'STAGGERED STANCE DL' [RP_UHD]; wk10 'REVERSE LUNGES' [RP_UKD]; wk11 'STAGGERED STANCE DL' [RP_UHD]; wk12 'FFE & RFE SPLIT SQTS.' [RP_UKD] | 3 | 8 | - |
| THURSDAY | 4 | 'the survival' | '3x8' | ISO_HAM, ISO_QUAD | wk1 'LEG EXT' [ISO_QUAD]; wk2 'LEG CURLS' [ISO_HAM]; wk3 'LEG EXT' [ISO_QUAD]; wk4 'LEG CURLS' [ISO_HAM]; wk5 'LEG EXT' [ISO_QUAD]; wk6 'LEG CURLS' [ISO_HAM]; wk7 'LEG EXT' [ISO_QUAD]; wk8 'LEG CURLS' [ISO_HAM]; wk9 'LEG EXT' [ISO_QUAD]; wk10 'LEG CURLS' [ISO_HAM]; wk11 'LEG EXT' [ISO_QUAD]; wk12 'LEG CURLS' [ISO_HAM] | 3 | 8 | - |
| SATURDAY | 1 | 'the work' | 'FAST RPE6 or about 60-70%' | RP_HPUSH | wk1 'INCLINE BENCH' [RP_HPUSH]; wk2 'BENCH PRESS' [RP_HPUSH]; wk3 'INCLINE BENCH BB' [RP_HPUSH]; wk4 'BENCH PRESS' [RP_HPUSH]; wk5 'INCLINE BENCH' [RP_HPUSH]; wk6 'BENCH PRESS' [RP_HPUSH]; wk7 'INCLINE BENCH' [RP_HPUSH]; wk8 'BENCH PRESS' [RP_HPUSH]; wk9 'INCLINE BENCH' [RP_HPUSH]; wk10 'BENCH PRESS' [RP_HPUSH]; wk11 'INCLINE BENCH' [RP_HPUSH]; wk12 'BENCH PRESS' [RP_HPUSH] | header SETS row | header REPS row | FAST RPE6 or about 60-70% |
| SATURDAY | 2 | 'the accessory' | (blank) | RP_HPULL, RP_VPULL | wk1 'LAT PULL DOWN' [RP_VPULL]; wk2 'MACHINE ROW' [RP_HPULL]; wk3 'LAT PULL DOWN' [RP_VPULL]; wk4 'MACHINE ROW' [RP_HPULL]; wk5 'LAT PULL DOWN' [RP_VPULL]; wk6 'MACHINE ROW' [RP_HPULL]; wk7 'LAT PULL DOWN' [RP_VPULL]; wk8 'MACHINE ROW' [RP_HPULL]; wk9 'LAT PULL DOWN' [RP_VPULL]; wk10 'MACHINE ROW' [RP_HPULL]; wk11 'LAT PULL DOWN' [RP_VPULL]; wk12 'MACHINE ROW' [RP_HPULL] | unset | unset | - |
| SATURDAY | 3 | 'the nuance' | '3x8' | ISO_CHEST | wk1 'CABLE FLIES' [ISO_CHEST]; wk2 'CABLE FLIES' [ISO_CHEST]; wk3 'CABLE FLIES' [ISO_CHEST]; wk4 'CABLE FLIES' [ISO_CHEST]; wk5 'CABLE FLIES' [ISO_CHEST]; wk6 'CABLE FLIES' [ISO_CHEST]; wk7 'CABLE FLIES' [ISO_CHEST]; wk8 'CABLE FLIES' [ISO_CHEST]; wk9 'CABLE FLIES' [ISO_CHEST]; wk10 'CABLE FLIES' [ISO_CHEST]; wk11 'CABLE FLIES' [ISO_CHEST]; wk12 'CABLE FLIES' [ISO_CHEST] | 3 | 8 | - |
| SATURDAY | 4 | 'the survival' | '3x8' | ISO_TRICEP | wk1 'JM PRESS' [ISO_TRICEP]; wk2 'JM PRESS' [ISO_TRICEP]; wk3 'JM PRESS' [ISO_TRICEP]; wk4 'JM PRESS' [ISO_TRICEP]; wk5 'JM PRESS' [ISO_TRICEP]; wk6 'JM PRESS' [ISO_TRICEP]; wk7 'JM PRESS' [ISO_TRICEP]; wk8 'JM PRESS' [ISO_TRICEP]; wk9 'JM PRESS' [ISO_TRICEP]; wk10 'JM PRESS' [ISO_TRICEP]; wk11 'JM PRESS' [ISO_TRICEP]; wk12 'JM PRESS' [ISO_TRICEP] | 3 | 8 | - |

**Rules visible:**
1. Same four-slot day as the 8-week version. Column N gives the dose: 'M.E.' / 'FAST RPE6 or about 60-70%' for the work, '3x8' (or '3x20' for 'TATE PRESS') for nuance and survival. **'the accessory' has no dose.**
2. **A/B weeks** (odd/even). A: Mon 'HIGH BAR SQUAT', Wed 'BENCH PRESS', Thu 'LEG PRESS' (fast), Sat 'INCLINE BENCH' (fast). B: Mon 'RDL', Wed 'INCLINE BENCH', Thu 'DEADLIFT' (fast), Sat 'BENCH PRESS' (fast). Weeks 5/6 swap in 'Front squat' / 'DEADLIFT'. Week 12 ends on 'DEADLIFT' + 'LOW BAR'.
3. **Lower-day chain:**
   * work (bilateral, one dominance) -> accessory (bilateral, **opposite** dominance).
   * -> nuance (unilateral, **opposite** to the work: squat -> 'STAGGERED STANCE DL'; hinge -> lunges/split squats).
   * -> survival (isolation of the **same** muscle as the work: squat -> 'LEG EXT'; hinge -> 'LEG CURLS').
   * Every lower session therefore covers KD + HD bilaterally, one unilateral pattern, and one isolation.
   * Contrast with the 8-week version, where the unilateral slot matched the main lift's dominance.
4. Upper days: press work -> pull accessory (vertical 'LAT PULL DOWN' in A weeks, horizontal 'MACHINE ROW' in B weeks) -> triceps or chest isolation -> delt/biceps/triceps isolation.
5. **No vertical press anywhere** in the 12-week block. Pulling exists only in the dose-less accessory slot. This is a powerlifting (squat/bench/deadlift) bias.
6. **Mid-cycle deload in week 7** ('MID DELOAD', 3x4 @ RPE 7). Wave 2 re-accumulates and finishes at RPE 10.

**Quantitative volume.** 'the work' takes the header SETS/REPS on all four days. Accessory as written = 0; assumed = 3 sets.

| Week | % (row 3) | RPE (row 4) | SETS (row 5) | REPS (row 6) | 'the work' reps per session | Sets/session as written (accessory unset) | Weekly as written | Sets/session (accessory = 3 assumed) | Weekly assumed | Weekly sets by bucket (assumed) | Hypertrophy sets by muscle (assumed) |
|---|---|---|---|---|---|---|---|---|---|---|---|
| WK1 | 80 | 7 | 4 | 5 | 80 | 10/10/10/10 | 40 | 13/13/13/13 | 52 | RP_BKD 8, RP_BHD 6, RP_UHD 6, RP_HPUSH 8, RP_VPULL 6, ISO_QUAD 6, ISO_CHEST 3, ISO_SIDE_REAR_DELT 3, ISO_TRICEP 6 | quads 14, glutes 16, hamstrings 12, chest 11, lats_upper_back 6, front_delts 8, side_delts 3, biceps 3, triceps 10 |
| WK2 | 80 | 7 | 4 | 5 | 80 | 10/10/10/10 | 40 | 13/13/13/13 | 52 | RP_BKD 6, RP_BHD 8, RP_UKD 6, RP_HPUSH 8, RP_HPULL 6, ISO_HAM 6, ISO_CHEST 3, ISO_BICEP 3, ISO_TRICEP 6 | quads 12, glutes 17, hamstrings 14, chest 11, lats_upper_back 6, front_delts 8, rear_delts 3, biceps 6, triceps 10 |
| WK3 | 85 | 7 | 5 | 4 | 80 | 11/11/11/11 | 44 | 14/14/14/14 | 56 | RP_BKD 10, RP_BHD 6, RP_UHD 6, RP_HPUSH 10, RP_VPULL 6, ISO_QUAD 6, ISO_CHEST 3, ISO_SIDE_REAR_DELT 3, ISO_TRICEP 6 | quads 16, glutes 17, hamstrings 12, chest 13, lats_upper_back 6, front_delts 10, side_delts 3, biceps 3, triceps 11 |
| WK4 | 85 | 8 | 5 | 4 | 80 | 11/11/11/11 | 44 | 14/14/14/14 | 56 | RP_BKD 6, RP_BHD 10, RP_UKD 6, RP_HPUSH 10, RP_HPULL 6, ISO_HAM 6, ISO_CHEST 3, ISO_BICEP 3, ISO_TRICEP 6 | quads 12, glutes 19, hamstrings 16, chest 13, lats_upper_back 6, front_delts 10, rear_delts 3, biceps 6, triceps 11 |
| WK5 | 90 | 8 | 6 | 3 | 72 | 12/12/12/12 | 48 | 15/15/15/15 | 60 | RP_BKD 12, RP_BHD 6, RP_UHD 6, RP_HPUSH 12, RP_VPULL 6, ISO_QUAD 6, ISO_CHEST 3, ISO_SIDE_REAR_DELT 3, ISO_TRICEP 6 | quads 18, glutes 18, hamstrings 12, chest 15, lats_upper_back 6, front_delts 12, side_delts 3, biceps 3, triceps 12 |
| WK6 | 90 | 9 | 6 | 3 | 72 | 12/12/12/12 | 48 | 15/15/15/15 | 60 | RP_BKD 6, RP_BHD 12, RP_UKD 6, RP_HPUSH 12, RP_HPULL 6, ISO_HAM 6, ISO_CHEST 3, ISO_BICEP 3, ISO_TRICEP 6 | quads 12, glutes 21, hamstrings 18, chest 15, lats_upper_back 6, front_delts 12, rear_delts 3, biceps 6, triceps 12 |
| WK7 | MID DELOAD | 7 | 3 | 4 | 48 | 9/9/9/9 | 36 | 12/12/12/12 | 48 | RP_BKD 6, RP_BHD 6, RP_UHD 6, RP_HPUSH 6, RP_VPULL 6, ISO_QUAD 6, ISO_CHEST 3, ISO_SIDE_REAR_DELT 3, ISO_TRICEP 6 | quads 12, glutes 15, hamstrings 12, chest 9, lats_upper_back 6, front_delts 6, side_delts 3, biceps 3, triceps 9 |
| WK8 | - | 8 | 5 | 4 | 80 | 11/11/11/11 | 44 | 14/14/14/14 | 56 | RP_BKD 6, RP_BHD 10, RP_UKD 6, RP_HPUSH 10, RP_HPULL 6, ISO_HAM 6, ISO_CHEST 3, ISO_BICEP 3, ISO_TRICEP 6 | quads 12, glutes 19, hamstrings 16, chest 13, lats_upper_back 6, front_delts 10, rear_delts 3, biceps 6, triceps 11 |
| WK9 | - | 9 | 6 | 3 | 72 | 12/12/12/12 | 48 | 15/15/15/15 | 60 | RP_BKD 12, RP_BHD 6, RP_UHD 6, RP_HPUSH 12, RP_VPULL 6, ISO_QUAD 6, ISO_CHEST 3, ISO_SIDE_REAR_DELT 3, ISO_TRICEP 6 | quads 18, glutes 18, hamstrings 12, chest 15, lats_upper_back 6, front_delts 12, side_delts 3, biceps 3, triceps 12 |
| WK10 | - | 9 | 6 | 3 | 72 | 12/12/12/12 | 48 | 15/15/15/15 | 60 | RP_BKD 6, RP_BHD 12, RP_UKD 6, RP_HPUSH 12, RP_HPULL 6, ISO_HAM 6, ISO_CHEST 3, ISO_BICEP 3, ISO_TRICEP 6 | quads 12, glutes 21, hamstrings 18, chest 15, lats_upper_back 6, front_delts 12, rear_delts 3, biceps 6, triceps 12 |
| WK11 | - | 9 | 7 | 2 | 56 | 13/13/13/13 | 52 | 16/16/16/16 | 64 | RP_BKD 14, RP_BHD 6, RP_UHD 6, RP_HPUSH 14, RP_VPULL 6, ISO_QUAD 6, ISO_CHEST 3, ISO_SIDE_REAR_DELT 3, ISO_TRICEP 6 | quads 20, glutes 19, hamstrings 12, chest 17, lats_upper_back 6, front_delts 14, side_delts 3, biceps 3, triceps 13 |
| WK12 | - | 10 | 7 | 2 | 56 | 13/13/13/13 | 52 | 16/16/16/16 | 64 | RP_BKD 6, RP_BHD 14, RP_UKD 6, RP_HPUSH 14, RP_HPULL 6, ISO_HAM 6, ISO_CHEST 3, ISO_BICEP 3, ISO_TRICEP 6 | quads 12, glutes 23, hamstrings 20, chest 17, lats_upper_back 6, front_delts 14, rear_delts 3, biceps 6, triceps 13 |

A/B pair means (one A + one B week = the real weekly exposure):

| A/B pair | Mean weekly sets by bucket (accessory 3 assumed) | Mean hypertrophy sets by muscle |
|---|---|---|
| WK1+WK2 mean | ISO_BICEP 1.5, ISO_CHEST 3, ISO_HAM 3, ISO_QUAD 3, ISO_SIDE_REAR_DELT 1.5, ISO_TRICEP 6, RP_BHD 7, RP_BKD 7, RP_HPULL 3, RP_HPUSH 8, RP_UHD 3, RP_UKD 3, RP_VPULL 3 | biceps 4.5, chest 11, front_delts 8, glutes 16.5, hamstrings 13, lats_upper_back 6, quads 13, rear_delts 1.5, side_delts 1.5, triceps 10 |
| WK3+WK4 mean | ISO_BICEP 1.5, ISO_CHEST 3, ISO_HAM 3, ISO_QUAD 3, ISO_SIDE_REAR_DELT 1.5, ISO_TRICEP 6, RP_BHD 8, RP_BKD 8, RP_HPULL 3, RP_HPUSH 10, RP_UHD 3, RP_UKD 3, RP_VPULL 3 | biceps 4.5, chest 13, front_delts 10, glutes 18, hamstrings 14, lats_upper_back 6, quads 14, rear_delts 1.5, side_delts 1.5, triceps 11 |
| WK5+WK6 mean | ISO_BICEP 1.5, ISO_CHEST 3, ISO_HAM 3, ISO_QUAD 3, ISO_SIDE_REAR_DELT 1.5, ISO_TRICEP 6, RP_BHD 9, RP_BKD 9, RP_HPULL 3, RP_HPUSH 12, RP_UHD 3, RP_UKD 3, RP_VPULL 3 | biceps 4.5, chest 15, front_delts 12, glutes 19.5, hamstrings 15, lats_upper_back 6, quads 15, rear_delts 1.5, side_delts 1.5, triceps 12 |
| WK8+WK9 mean | ISO_BICEP 1.5, ISO_CHEST 3, ISO_HAM 3, ISO_QUAD 3, ISO_SIDE_REAR_DELT 1.5, ISO_TRICEP 6, RP_BHD 8, RP_BKD 9, RP_HPULL 3, RP_HPUSH 11, RP_UHD 3, RP_UKD 3, RP_VPULL 3 | biceps 4.5, chest 14, front_delts 11, glutes 18.5, hamstrings 14, lats_upper_back 6, quads 15, rear_delts 1.5, side_delts 1.5, triceps 11.5 |
| WK10+WK11 mean | ISO_BICEP 1.5, ISO_CHEST 3, ISO_HAM 3, ISO_QUAD 3, ISO_SIDE_REAR_DELT 1.5, ISO_TRICEP 6, RP_BHD 9, RP_BKD 10, RP_HPULL 3, RP_HPUSH 13, RP_UHD 3, RP_UKD 3, RP_VPULL 3 | biceps 4.5, chest 16, front_delts 13, glutes 20, hamstrings 15, lats_upper_back 6, quads 16, rear_delts 1.5, side_delts 1.5, triceps 12.5 |

**Progression (numbers):**
* Work reps per session are 20,20,20,20,18,18 in wave 1. Volume is held while intensity rises 80 -> 85 -> 90% and RPE 7 -> 9: **+5% load every 2 weeks**.
* Deload: 12 reps (-33%).
* Wave 2: 20,18,18,14,14 at RPE 8 -> 10.
* Work sets per week: 16,16,20,20,24,24 | 12 | 20,24,24,28,28. Compounded from wk1 to wk12 that is **+5.2%/week** (4 -> 7 sets).
* Session totals with the assumed accessory (52 -> 56 -> 60 -> 48 -> 56 -> 60 -> 64) step **+7.7%, +7.1%, +16.7% (post-deload), +7.1%, +6.7%**. Those steps match the coach's "3/5/7 %" increment language almost exactly at the 7% end.

### 2.3 AESTHETICS track, 8-week (left block B32:L60)
**Identity**:
* Goal: physique / hypertrophy ('bodybuilding style'). Level: general to intermediate (*INFERRED*).
* 4 lifting days, upper/lower x2: MONDAY lower, TUESDAY upper, THURSDAY lower (= Monday), FRIDAY upper (about = Tuesday).
* 2 cardio days: WEDNESDAY and SATURDAY '30-40 mi slow/steady CARDIO' (lavender). *INFERRED*: 'mi' = minutes, an aerobic 'C' session.
* Header: C32 'SETS' E32:K32 = 2,3,3,3,4,4,5; C33 'REPS ' E33:K33 = 12,10,8,12,10,8,8.
* L35/L55 'DELOAD WEEK'. Column D on every lifting row: '1-2 RIR'.
* Stray B38 = 4 and B57 = 4 (only two B values in the block).

| Day | Order | Row | Canonical bucket(s) | Exercise by week (verbatim) [bucket] | Sets | Reps | Load (col D) | Notes |
|---|---|---|---|---|---|---|---|---|
| MONDAY | 1 | row35/49 | RP_BHD, RP_BKD | wk1 'FRONT SQUATS' [RP_BKD]; wk2 'DEAFLITS' [RP_BHD]; wk3 'FRONT SQUATS' [RP_BKD]; wk4 'DEFICIT DEADLIFTS' [RP_BHD]; wk5 'BACK SQUATS' [RP_BKD]; wk6 'DEADLIFTS' [RP_BHD]; wk7 'DEADLIFTS' [RP_BHD] | row 32: 2,3,3,3,4,4,5 | row 33: 12,10,8,12,10,8,8 | '1-2 RIR' |  |
| MONDAY | 2 | row37/50 | RP_BHD, RP_BKD | wk1 'DEALIFTS' [RP_BHD]; wk2 'BACK SQUATS' [RP_BKD]; wk3 'DEADLIFTS' [RP_BHD]; wk4 'BACK SQUATS' [RP_BKD]; wk5 'DEADLIFTS' [RP_BHD]; wk6 'FRONT SQUATS' [RP_BKD]; wk7 'BACK SQUATS' [RP_BKD] | row 32: 2,3,3,3,4,4,5 | row 33: 12,10,8,12,10,8,8 | '1-2 RIR' |  |
| MONDAY | 3 | row38/51 | RP_UKD | wk1 'FFE CONTRA LUNGES' [RP_UKD]; wk2 'FFE IPSI LUNGES' [RP_UKD]; wk3 'RFE CONTRA LUNGES' [RP_UKD]; wk4 'RFE IPSI LUNGES' [RP_UKD]; wk5 'RFE LUNGES' [RP_UKD]; wk6 'RFE & FFE LUNGES' [RP_UKD]; wk7 'RFE & FFE LUNGES' [RP_UKD] | row 32: 2,3,3,3,4,4,5 (B38=4) | row 33: 12,10,8,12,10,8,8 | '1-2 RIR' |  |
| MONDAY | 4 | row39/53 | RP_UHD | wk1 'SL RDL' [RP_UHD]; wk2 'SL RDL' [RP_UHD]; wk3 'SL RDL' [RP_UHD]; wk4 'SL RDL' [RP_UHD]; wk5 'SL RDL' [RP_UHD]; wk6 'SL RDL' [RP_UHD]; wk7 'SL RDL' [RP_UHD] | row 32: 2,3,3,3,4,4,5 | row 33: 12,10,8,12,10,8,8 | '1-2 RIR' |  |
| MONDAY | 5 | row40/54 | FOCUS | wk1 'ACCESSORIES' [FOCUS]; wk2 'ACCESSORIES' [FOCUS]; wk3 'ACCESSORIES' [FOCUS]; wk4 'ACCESSORIES' [FOCUS]; wk5 'ACCESSORIES' [FOCUS]; wk6 'ACCESSORIES' [FOCUS]; wk7 'ACCESSORIES' [FOCUS] | row 32: 2,3,3,3,4,4,5 | row 33: 12,10,8,12,10,8,8 | '1-2 RIR' |  |
| TUESDAY | 1 | row41 | RP_HPUSH, RP_VPULL | wk1 'DB BENCH PRESS' [RP_HPUSH]; wk2 'UNILATERAL LAT PULL DOWN' [RP_VPULL]; wk3 'DB BENCH PRESS' [RP_HPUSH]; wk4 'LAT PULL DOWN/PULL UP' [RP_VPULL]; wk5 'BARBELL BENCH PRESS' [RP_HPUSH]; wk6 'LAT PULL DOWN/PULL UP' [RP_VPULL]; wk7 'BARBELL BENCH PRESS' [RP_HPUSH] | row 32: 2,3,3,3,4,4,5 | row 33: 12,10,8,12,10,8,8 | '1-2 RIR' |  |
| TUESDAY | 2 | row42 | RP_HPUSH, RP_VPULL | wk1 'UNILATERAL LAT PULL DOWN' [RP_VPULL]; wk2 'DB BENCH PRESS' [RP_HPUSH]; wk3 'UNILATERAL LAT PULL DOWN' [RP_VPULL]; wk4 'INCLINE DB BENCH PRESS' [RP_HPUSH]; wk5 'UNILATERAL LAT PULL DOWN' [RP_VPULL]; wk6 'INCLINE DB BENCH PRESS' [RP_HPUSH]; wk7 'UNILATERAL LAT PULL DOWN' [RP_VPULL] | row 32: 2,3,3,3,4,4,5 | row 33: 12,10,8,12,10,8,8 | '1-2 RIR' |  |
| TUESDAY | 3 | row43 | ISO_SIDE_REAR_DELT, RP_HPULL, RP_VPUSH | wk1 'DB OVERHEAD PRESS' [RP_VPUSH]; wk2 'MACHINE SUPPORTED ROW' [RP_HPULL]; wk3 'UPRIGHT ROWS' [ISO_SIDE_REAR_DELT]; wk4 'DB ROWS' [RP_HPULL]; wk5 'DB OVERHEAD PRESS' [RP_VPUSH]; wk6 'MACHINE SUPPORTED ROW' [RP_HPULL]; wk7 'UPRIGHT ROWS' [ISO_SIDE_REAR_DELT] | row 32: 2,3,3,3,4,4,5 | row 33: 12,10,8,12,10,8,8 | '1-2 RIR' |  |
| TUESDAY | 4 | row44 | ISO_SIDE_REAR_DELT, RP_HPULL, RP_VPUSH | wk1 'MACHINE SUPPORTED ROW' [RP_HPULL]; wk2 'UPRIGHT ROWS' [ISO_SIDE_REAR_DELT]; wk3 'DB ROWS' [RP_HPULL]; wk4 'OVERHEAD PRESS' [RP_VPUSH]; wk5 'MACHINE SUPPORTED ROW' [RP_HPULL]; wk6 'UPRIGHT ROWS' [ISO_SIDE_REAR_DELT]; wk7 'DB ROWS' [RP_HPULL] | row 32: 2,3,3,3,4,4,5 | row 33: 12,10,8,12,10,8,8 | '1-2 RIR' |  |
| TUESDAY | 5 | row45 | FOCUS | wk1 'ACCESSORIES' [FOCUS]; wk2 'ACCESSORIES' [FOCUS]; wk3 'ACCESSORIES' [FOCUS]; wk4 'ACCESSORIES' [FOCUS]; wk5 'ACCESSORIES' [FOCUS]; wk6 'ACCESSORIES' [FOCUS]; wk7 'ACCESSORIES' [FOCUS] | row 32: 2,3,3,3,4,4,5 | row 33: 12,10,8,12,10,8,8 | '1-2 RIR' |  |
| WEDNESDAY | 1 | (lavender D9D2E9 row) | COND_AEROBIC | wk1-wk8 '30-40 mi slow/steady CARDIO' | 1 session | 30-40 min ('mi' = minutes, INFERRED) | slow/steady | 'C' long-duration aerobic |
| THURSDAY | 1 | row35/49 | RP_BHD, RP_BKD | wk1 'FRONT SQUATS' [RP_BKD]; wk2 'DEAFLITS' [RP_BHD]; wk3 'FRONT SQUATS' [RP_BKD]; wk4 'DEFICIT DEADLIFTS' [RP_BHD]; wk5 'BACK SQUATS' [RP_BKD]; wk6 'DEADLIFTS' [RP_BHD]; wk7 'DEADLIFTS' [RP_BHD] | row 32: 2,3,3,3,4,4,5 | row 33: 12,10,8,12,10,8,8 | '1-2 RIR' |  |
| THURSDAY | 2 | row37/50 | RP_BHD, RP_BKD | wk1 'DEALIFTS' [RP_BHD]; wk2 'BACK SQUATS' [RP_BKD]; wk3 'DEADLIFTS' [RP_BHD]; wk4 'BACK SQUATS' [RP_BKD]; wk5 'DEADLIFTS' [RP_BHD]; wk6 'FRONT SQUATS' [RP_BKD]; wk7 'BACK SQUATS' [RP_BKD] | row 32: 2,3,3,3,4,4,5 | row 33: 12,10,8,12,10,8,8 | '1-2 RIR' |  |
| THURSDAY | 3 | row38/51 | RP_UKD | wk1 'FFE CONTRA LUNGES' [RP_UKD]; wk2 'FFE IPSI LUNGES' [RP_UKD]; wk3 'RFE CONTRA LUNGES' [RP_UKD]; wk4 'RFE IPSI LUNGES' [RP_UKD]; wk5 'RFE LUNGES' [RP_UKD]; wk6 'RFE & FFE LUNGES' [RP_UKD]; wk7 'RFE & FFE LUNGES' [RP_UKD] | row 32: 2,3,3,3,4,4,5 | row 33: 12,10,8,12,10,8,8 | '1-2 RIR' |  |
| THURSDAY | 4 | row39/53 | RP_UHD | wk1 'SL RDL' [RP_UHD]; wk2 'SL RDL' [RP_UHD]; wk3 'SL RDL' [RP_UHD]; wk4 'SL RDL' [RP_UHD]; wk5 'SL RDL' [RP_UHD]; wk6 'SL RDL' [RP_UHD]; wk7 'SL RDL' [RP_UHD] | row 32: 2,3,3,3,4,4,5 | row 33: 12,10,8,12,10,8,8 | '1-2 RIR' |  |
| THURSDAY | 5 | row40/54 | FOCUS | wk1 'ACCESSORIES' [FOCUS]; wk2 'ACCESSORIES' [FOCUS]; wk3 'ACCESSORIES' [FOCUS]; wk4 'ACCESSORIES' [FOCUS]; wk5 'ACCESSORIES' [FOCUS]; wk6 'ACCESSORIES' [FOCUS]; wk7 'ACCESSORIES' [FOCUS] | row 32: 2,3,3,3,4,4,5 | row 33: 12,10,8,12,10,8,8 | '1-2 RIR' |  |
| FRIDAY | 1 | row55 | RP_HPUSH, RP_VPULL | wk1 'DB BENCH PRESS' [RP_HPUSH]; wk2 'UNILATERAL LAT PULL DOWN' [RP_VPULL]; wk3 'DB BENCH PRESS' [RP_HPUSH]; wk4 'LAT PULL DOWN/PULL UP' [RP_VPULL]; wk5 'BARBELL BENCH PRESS' [RP_HPUSH]; wk6 'LAT PULL DOWN/PULL UP' [RP_VPULL]; wk7 'BARBELL BENCH PRESS' [RP_HPUSH] | row 32: 2,3,3,3,4,4,5 | row 33: 12,10,8,12,10,8,8 | '1-2 RIR' |  |
| FRIDAY | 2 | row56 | RP_HPUSH, RP_VPULL | wk1 'UNILATERAL LAT PULL DOWN' [RP_VPULL]; wk2 'DB BENCH PRESS' [RP_HPUSH]; wk3 'UNILATERAL' [RP_VPULL]; wk4 'INCLINE DB BENCH PRESS' [RP_HPUSH]; wk5 'LAT PULL DOWN/PULL UP' [RP_VPULL]; wk6 'INCLINE DB BENCH PRESS' [RP_HPUSH]; wk7 'LAT PULL DOWN/PULL UP' [RP_VPULL] | row 32: 2,3,3,3,4,4,5 | row 33: 12,10,8,12,10,8,8 | '1-2 RIR' |  |
| FRIDAY | 3 | row57 | ISO_SIDE_REAR_DELT, RP_HPULL, RP_VPUSH | wk1 'DB OVERHEAD PRESS' [RP_VPUSH]; wk2 'MACHINE SUPPORTED ROW' [RP_HPULL]; wk3 'UPRIGHT ROWS' [ISO_SIDE_REAR_DELT]; wk4 'DB ROWS' [RP_HPULL]; wk5 'DB OVERHEAD PRESS' [RP_VPUSH]; wk6 'MACHINE SUPPORTED ROW' [RP_HPULL]; wk7 'UPRIGHT ROWS' [ISO_SIDE_REAR_DELT] | row 32: 2,3,3,3,4,4,5 (B57=4) | row 33: 12,10,8,12,10,8,8 | '1-2 RIR' |  |
| FRIDAY | 4 | row59 | ISO_SIDE_REAR_DELT, RP_HPULL, RP_VPUSH | wk1 'MACHINE SUPPORTED ROW' [RP_HPULL]; wk2 'UPRIGHT ROWS' [ISO_SIDE_REAR_DELT]; wk3 'DB ROWS' [RP_HPULL]; wk4 'OVERHEAD PRESS' [RP_VPUSH]; wk5 'MACHINE SUPPORTED ROW' [RP_HPULL]; wk6 'UPRIGHT ROWS' [ISO_SIDE_REAR_DELT]; wk7 'DB ROWS' [RP_HPULL] | row 32: 2,3,3,3,4,4,5 | row 33: 12,10,8,12,10,8,8 | '1-2 RIR' |  |
| SATURDAY | 1 | (lavender D9D2E9 row) | COND_AEROBIC | wk1-wk8 '30-40 mi slow/steady CARDIO' | 1 session | 30-40 min ('mi' = minutes, INFERRED) | slow/steady | 'C' long-duration aerobic |

**Rules visible:**
1. **Every lower day has all four lower patterns:** bilateral KD + bilateral HD (the order swaps weekly), then UKD lunge, then UHD 'SL RDL', then 'ACCESSORIES'.
2. **Upper day = two antagonist pairs.**
   * Pair 1 is horizontal push + vertical pull ('DB BENCH PRESS' <-> 'UNILATERAL LAT PULL DOWN'); its order flips every week.
   * Pair 2 is vertical push (or 'UPRIGHT ROWS') + horizontal pull ('MACHINE SUPPORTED ROW' / 'DB ROWS').
   * Pair 2 runs a 4-week rotation (wk5 = wk1).
3. **Lunge loading ladder:** 'FFE CONTRA' -> 'FFE IPSI' -> 'RFE CONTRA' -> 'RFE IPSI' -> 'RFE' -> 'RFE & FFE'. That is the library's FFE -> RFE ROM step crossed with "into the hip" (contralateral) -> "out of the hip" (ipsilateral).
4. Friday has no 'ACCESSORIES' row (Tuesday has one). Friday wk3 says 'UNILATERAL' (truncated) and wk5/wk7 say 'LAT PULL DOWN/PULL UP' where Tuesday says 'UNILATERAL LAT PULL DOWN'.
5. Load is '1-2 RIR' on everything.

**Quantitative volume** (sets per exercise from row 32; 'ACCESSORIES' counted as 1 FOCUS slot):

| Week | SETS (row 32) | REPS (row 33) | Exercises/session MON/TUE/THU/FRI | Sets/session | Weekly sets | Weekly sets if B38=4 / B57=4 overrides apply | Weekly reps | Weekly sets by bucket (ACCESSORIES -> FOCUS) | Hypertrophy sets by muscle (FOCUS unassigned) |
|---|---|---|---|---|---|---|---|---|---|
| WK1 | 2 | 12 | 5/5/5/4 | 10/10/10/8 | 38 | 42 | 456 | RP_BKD 4, RP_BHD 4, RP_UKD 4, RP_UHD 4, RP_HPUSH 4, RP_VPUSH 4, RP_HPULL 4, RP_VPULL 4, FOCUS 6 | quads 8, glutes 14, hamstrings 8, chest 4, lats_upper_back 8, front_delts 8, side_delts 2, rear_delts 2, biceps 4, triceps 4 |
| WK2 | 3 | 10 | 5/5/5/4 | 15/15/15/12 | 57 | 59 | 570 | RP_BKD 6, RP_BHD 6, RP_UKD 6, RP_UHD 6, RP_HPUSH 6, RP_HPULL 6, RP_VPULL 6, ISO_SIDE_REAR_DELT 6, FOCUS 9 | quads 12, glutes 21, hamstrings 12, chest 6, lats_upper_back 12, front_delts 6, side_delts 6, rear_delts 3, biceps 6, triceps 3 |
| WK3 | 3 | 8 | 5/5/5/4 | 15/15/15/12 | 57 | 59 | 456 | RP_BKD 6, RP_BHD 6, RP_UKD 6, RP_UHD 6, RP_HPUSH 6, RP_HPULL 6, RP_VPULL 6, ISO_SIDE_REAR_DELT 6, FOCUS 9 | quads 12, glutes 21, hamstrings 12, chest 6, lats_upper_back 12, front_delts 6, side_delts 6, rear_delts 3, biceps 6, triceps 3 |
| WK4 | 3 | 12 | 5/5/5/4 | 15/15/15/12 | 57 | 59 | 684 | RP_BKD 6, RP_BHD 6, RP_UKD 6, RP_UHD 6, RP_HPUSH 6, RP_VPUSH 6, RP_HPULL 6, RP_VPULL 6, FOCUS 9 | quads 12, glutes 21, hamstrings 12, chest 6, lats_upper_back 12, front_delts 12, side_delts 3, rear_delts 3, biceps 6, triceps 6 |
| WK5 | 4 | 10 | 5/5/5/4 | 20/20/20/16 | 76 | 76 | 760 | RP_BKD 8, RP_BHD 8, RP_UKD 8, RP_UHD 8, RP_HPUSH 8, RP_VPUSH 8, RP_HPULL 8, RP_VPULL 8, FOCUS 12 | quads 16, glutes 28, hamstrings 16, chest 8, lats_upper_back 16, front_delts 16, side_delts 4, rear_delts 4, biceps 8, triceps 8 |
| WK6 | 4 | 8 | 5/5/5/4 | 20/20/20/16 | 76 | 76 | 608 | RP_BKD 8, RP_BHD 8, RP_UKD 8, RP_UHD 8, RP_HPUSH 8, RP_HPULL 8, RP_VPULL 8, ISO_SIDE_REAR_DELT 8, FOCUS 12 | quads 16, glutes 28, hamstrings 16, chest 8, lats_upper_back 16, front_delts 8, side_delts 8, rear_delts 4, biceps 8, triceps 4 |
| WK7 | 5 | 8 | 5/5/5/4 | 25/25/25/20 | 95 | 93 | 760 | RP_BKD 10, RP_BHD 10, RP_UKD 10, RP_UHD 10, RP_HPUSH 10, RP_HPULL 10, RP_VPULL 10, ISO_SIDE_REAR_DELT 10, FOCUS 15 | quads 20, glutes 35, hamstrings 20, chest 10, lats_upper_back 20, front_delts 10, side_delts 10, rear_delts 5, biceps 10, triceps 5 |
| WK8 | - | - | - | 'DELOAD WEEK' (L35, L55); cardio continues (L46, L60) | unspecified | - | - | - | - |

**Progression:**
* Weekly sets 38 -> 57 -> 57 -> 57 -> 76 -> 76 -> 95: **+50%, 0, 0, +33%, 0, +25%**. That is +1 set per exercise at weeks 2, 5 and 7, compounding **+16.5%/week**, far above the stated 3-7%, because the start is only 2 sets.
* Reps wave 12-10-8 twice, then 8. Weekly reps 456 / 570 / 456 / 684 / 760 / 608 / 760.
* Week 8 deload.

### 2.4 AESTHETICS track, 12-week (right block M31:Z66)
**Identity**:
* PUSH / LEGS / PULL x2, 6 days. MON push, TUE legs, WED pull, THU push, FRI legs, SAT pull. The day names are in column N; column M has 'PUSH' (M38, M54), 'LEGS' (M43), 'PULL' (M49, M64).
* Header:
  * N31 'SETS' = 3,3,3,4,4,4,3,4,4,4,4,5.
  * N32 'REPS' = '12/10/8 -20', '12/10/8- 20', '12/10/8-20', '12/12/10-20', '12/12/10-20', '12/12/12-20', '8/8/8-12', '15/12/10/8-20', '15/12/10/8-20', '12/12/10/10-20', '12/12/12/12-20', '15/15/12/12/12'.
  * Row 33 = 'A WEEK', 'B WEEK', 'A WEEK', 'B WEEK', 'A WEEK', 'BWEEK', 'A WEEK LOWER'.

| Day | Order | Row (col M label) | Canonical bucket(s) | Exercise by week (verbatim) [bucket] | Sets | Reps | Notes |
|---|---|---|---|---|---|---|---|
| MONDAY (PUSH) | 1 | r35 | ISO_SIDE_REAR_DELT, RP_VPUSH | wk1 'cable Side Raises' [ISO_SIDE_REAR_DELT]; wk2 'DB side raises' [ISO_SIDE_REAR_DELT]; wk3 'cable Side Raises' [ISO_SIDE_REAR_DELT]; wk4 'DB side raises' [ISO_SIDE_REAR_DELT]; wk5 'cable Side Raises' [ISO_SIDE_REAR_DELT]; wk6 'DB side raises' [ISO_SIDE_REAR_DELT]; wk7 'cable Side Raises' [ISO_SIDE_REAR_DELT]; wk8 'Arnold press' [RP_VPUSH]; wk9 'Cable or DB side raises' [ISO_SIDE_REAR_DELT]; wk10 'Arnold press' [RP_VPUSH]; wk11 'Cable or DB side raises' [ISO_SIDE_REAR_DELT]; wk12 'Arnold press' [RP_VPUSH] | row 31 (3,3,3,4,4,4,3,4,4,4,4,5) | row 32 |  |
| MONDAY (PUSH) | 2 | r36 | RP_HPUSH | wk1 'Incline bench' [RP_HPUSH]; wk2 'bench press' [RP_HPUSH]; wk3 'Incline bench' [RP_HPUSH]; wk4 'bench press' [RP_HPUSH]; wk5 'Incline bench' [RP_HPUSH]; wk6 'bench press' [RP_HPUSH]; wk7 'Incline bench' [RP_HPUSH]; wk8 'incline bench press' [RP_HPUSH]; wk9 'bench press' [RP_HPUSH]; wk10 'incline bench press' [RP_HPUSH]; wk11 'bench press' [RP_HPUSH]; wk12 'incline bench press' [RP_HPUSH] | row 31 (3,3,3,4,4,4,3,4,4,4,4,5) | row 32 |  |
| MONDAY (PUSH) | 3 | r37 | ISO_CHEST | wk1 'low to high FLIES' [ISO_CHEST]; wk2 'machine or db flies' [ISO_CHEST]; wk3 'low to high FLIES' [ISO_CHEST]; wk4 'machine or db flies' [ISO_CHEST]; wk5 'low to high FLIES' [ISO_CHEST]; wk6 'machine or db flies' [ISO_CHEST]; wk7 'low to high FLIES' [ISO_CHEST]; wk8 'machine or db flies' [ISO_CHEST]; wk9 'high to low cable flies' [ISO_CHEST]; wk10 'machine or db flies' [ISO_CHEST]; wk11 'high to low cable flies' [ISO_CHEST]; wk12 'machine or db flies' [ISO_CHEST] | row 31 (3,3,3,4,4,4,3,4,4,4,4,5) | row 32 |  |
| MONDAY (PUSH) | 4 | r38 'PUSH' | RP_HPUSH | wk1 'Machine Dips or dips' [RP_HPUSH]; wk2 'Machine Dips or dips' [RP_HPUSH]; wk3 'Machine Dips or dips' [RP_HPUSH]; wk4 'Machine Dips or dips' [RP_HPUSH]; wk5 'Machine Dips or dips' [RP_HPUSH]; wk6 'Machine Dips or dips' [RP_HPUSH]; wk7 'Machine Dips or dips' [RP_HPUSH]; wk8 'Machine Dips or dips' [RP_HPUSH]; wk9 'Machine Dips or dips' [RP_HPUSH]; wk10 'Machine Dips or dips' [RP_HPUSH]; wk11 'Machine Dips or dips' [RP_HPUSH]; wk12 'Machine Dips or dips' [RP_HPUSH] | row 31 (3,3,3,4,4,4,3,4,4,4,4,5) | row 32 |  |
| MONDAY (PUSH) | 5 | r39 | ISO_TRICEP | wk1 'TATE PRESS' [ISO_TRICEP]; wk2 'cable tricep extension' [ISO_TRICEP]; wk3 'TATE PRESS' [ISO_TRICEP]; wk4 'cable tricep extension' [ISO_TRICEP]; wk5 'TATE PRESS' [ISO_TRICEP]; wk6 'cable tricep extension' [ISO_TRICEP]; wk7 'TATE PRESS' [ISO_TRICEP]; wk8 'overhead cable rope tricep ext' [ISO_TRICEP]; wk9 'overhead cable rope tricep ext' [ISO_TRICEP]; wk10 'overhead cable rope tricep ext' [ISO_TRICEP]; wk11 'overhead cable rope tricep ext' [ISO_TRICEP]; wk12 'overhead cable rope tricep ext' [ISO_TRICEP] | row 31 (3,3,3,4,4,4,3,4,4,4,4,5) | row 32 |  |
| MONDAY (PUSH) | 6 | r40 | ISO_TRICEP | wk1 'TRICEP EXT.' [ISO_TRICEP]; wk2 'cable regular top down tricep extension' [ISO_TRICEP]; wk3 'TRICEP EXT.' [ISO_TRICEP]; wk4 'cable regular top down tricep extension' [ISO_TRICEP]; wk5 'TRICEP EXT.' [ISO_TRICEP]; wk6 'cable regular top down tricep extension' [ISO_TRICEP]; wk7 'TRICEP EXT.' [ISO_TRICEP] | row 31 (3,3,3,4,4,4,3,4,4,4,4,5) | row 32 |  |
| TUESDAY (LEGS) | 1 | r41 | RP_BKD | wk1 'front SQUATS' [RP_BKD]; wk2 'front SQUATS' [RP_BKD]; wk3 'front SQUATS' [RP_BKD]; wk4 'front SQUATS' [RP_BKD]; wk5 'front SQUATS' [RP_BKD]; wk6 'front SQUATS' [RP_BKD]; wk7 'front SQUATS' [RP_BKD]; wk8 'front SQUATS' [RP_BKD]; wk9 'front squats + Superset with 15 squats with no weight every set' [RP_BKD]; wk10 'front squats + Superset with 15 squats with no weight every set' [RP_BKD]; wk11 'front squats + Superset with 15 squats with no weight every set' [RP_BKD]; wk12 'front squats + Superset with 15 squats with no weight every set' [RP_BKD] | row 31 (3,3,3,4,4,4,3,4,4,4,4,5) | row 32 |  |
| TUESDAY (LEGS) | 2 | r42 | RP_BKD | wk1 'LEG PRESS' [RP_BKD]; wk2 'LEG PRESS' [RP_BKD]; wk3 'LEG PRESS' [RP_BKD]; wk4 'LEG PRESS' [RP_BKD]; wk5 'LEG PRESS' [RP_BKD]; wk6 'LEG PRESS' [RP_BKD]; wk7 'LEG PRESS' [RP_BKD]; wk8 'LEG PRESS' [RP_BKD]; wk9 'leg press or just add 2 more rounds to front squats' [RP_BKD]; wk10 'leg press or just add 2 more rounds to front squats' [RP_BKD]; wk11 'leg press or just add 2 more rounds to front squats' [RP_BKD]; wk12 'leg press or just add 2 more rounds to front squats' [RP_BKD] | row 31 (3,3,3,4,4,4,3,4,4,4,4,5) | row 32 |  |
| TUESDAY (LEGS) | 3 | r43 'LEGS' | RP_BHD | wk1 'DEADLIFTS' [RP_BHD]; wk2 'DEADLIFTS' [RP_BHD]; wk3 'DEADLIFTS' [RP_BHD]; wk4 'DEADLIFTS' [RP_BHD]; wk5 'DEADLIFTS' [RP_BHD]; wk6 'DEADLIFTS' [RP_BHD]; wk7 'DEADLIFTS' [RP_BHD]; wk8 'DEADLIFTS' [RP_BHD]; wk9 'DEADLIFTS' [RP_BHD]; wk10 'DEADLIFTS' [RP_BHD]; wk11 'DEADLIFTS' [RP_BHD]; wk12 'DEADLIFTS' [RP_BHD] | row 31 (3,3,3,4,4,4,3,4,4,4,4,5) | row 32 |  |
| TUESDAY (LEGS) | 4 | r44 | RP_UKD | wk1 'LUNGES' [RP_UKD]; wk2 'LUNGES' [RP_UKD]; wk3 'LUNGES' [RP_UKD]; wk4 'LUNGES' [RP_UKD]; wk5 'LUNGES' [RP_UKD]; wk6 'LUNGES' [RP_UKD]; wk7 'LUNGES' [RP_UKD]; wk8 'LUNGES' [RP_UKD]; wk9 'RFE Lunges (bulgarian)' [RP_UKD]; wk10 'RFE Lunges (bulgarian)' [RP_UKD]; wk11 'RFE Lunges (bulgarian)' [RP_UKD]; wk12 'RFE Lunges (bulgarian)' [RP_UKD] | row 31 (3,3,3,4,4,4,3,4,4,4,4,5) | row 32 |  |
| TUESDAY (LEGS) | 5 | r45 | RP_UHD | wk1 'STAGRD. DL' [RP_UHD]; wk2 'STAGRD. DL' [RP_UHD]; wk3 'STAGRD. DL' [RP_UHD]; wk4 'STAGRD. DL' [RP_UHD]; wk5 'STAGRD. DL' [RP_UHD]; wk6 'STAGRD. DL' [RP_UHD]; wk7 'STAGRD. DL' [RP_UHD]; wk8 'STAGRD. DL' [RP_UHD]; wk9 'Staggered stance unilateral deadlifts' [RP_UHD]; wk10 'Staggered stance unilateral deadlifts' [RP_UHD]; wk11 'Staggered stance unilateral deadlifts' [RP_UHD]; wk12 'Staggered stance unilateral deadlifts' [RP_UHD] | row 31 (3,3,3,4,4,4,3,4,4,4,4,5) | row 32 |  |
| WEDNESDAY (PULL) | 1 | r46 | RP_VPULL | wk1 'Lat pull downs' [RP_VPULL]; wk2 'Neutral grip lat pull down' [RP_VPULL]; wk3 'Lat pull downs' [RP_VPULL]; wk4 'Neutral grip lat pull down' [RP_VPULL]; wk5 'Lat pull downs' [RP_VPULL]; wk6 'Neutral grip lat pull down' [RP_VPULL]; wk7 'Lat pull downs' [RP_VPULL]; wk8 'Neutral grip lat pull down' [RP_VPULL]; wk9 'Neutral grip lat pull down' [RP_VPULL]; wk10 'Neutral grip lat pull down' [RP_VPULL]; wk11 'Neutral grip lat pull down' [RP_VPULL]; wk12 'Neutral grip lat pull down' [RP_VPULL] | row 31 (3,3,3,4,4,4,3,4,4,4,4,5) | row 32 |  |
| WEDNESDAY (PULL) | 2 | r47 | RP_HPULL | wk1 'Rows' [RP_HPULL]; wk2 'machine rows or db rows' [RP_HPULL]; wk3 'Rows' [RP_HPULL]; wk4 'machine rows or db rows' [RP_HPULL]; wk5 'Rows' [RP_HPULL]; wk6 'machine rows or db rows' [RP_HPULL]; wk7 'Rows' [RP_HPULL]; wk8 'machine rows or db rows' [RP_HPULL]; wk9 'machine rows or db rows' [RP_HPULL]; wk10 'machine rows or db rows' [RP_HPULL]; wk11 'machine rows or db rows' [RP_HPULL]; wk12 'machine rows or db rows' [RP_HPULL] | row 31 (3,3,3,4,4,4,3,4,4,4,4,5) | row 32 |  |
| WEDNESDAY (PULL) | 3 | r48 | ISO_SIDE_REAR_DELT, RP_VPULL | wk1 'Pull under' [RP_VPULL]; wk2 'pull under' [RP_VPULL]; wk3 'Pull under' [RP_VPULL]; wk4 'pull under' [RP_VPULL]; wk5 'Pull under' [RP_VPULL]; wk6 'pull under' [RP_VPULL]; wk7 'Pull under' [RP_VPULL]; wk8 'pull under' [RP_VPULL]; wk9 'machine or db Reverse flies' [ISO_SIDE_REAR_DELT]; wk10 'machine or db Reverse flies' [ISO_SIDE_REAR_DELT]; wk11 'machine or db Reverse flies' [ISO_SIDE_REAR_DELT]; wk12 'machine or db Reverse flies' [ISO_SIDE_REAR_DELT] | row 31 (3,3,3,4,4,4,3,4,4,4,4,5) | row 32 |  |
| WEDNESDAY (PULL) | 4 | r49 'PULL' | ISO_SIDE_REAR_DELT, RP_HPULL | wk1 'face pulls' [ISO_SIDE_REAR_DELT]; wk2 'upright db row' [ISO_SIDE_REAR_DELT]; wk3 'face pulls' [ISO_SIDE_REAR_DELT]; wk4 'upright db row' [ISO_SIDE_REAR_DELT]; wk5 'face pulls' [ISO_SIDE_REAR_DELT]; wk6 'upright db row' [ISO_SIDE_REAR_DELT]; wk7 'face pulls' [ISO_SIDE_REAR_DELT]; wk8 'upright db row' [ISO_SIDE_REAR_DELT]; wk9 'bent over db row' [RP_HPULL]; wk10 'bent over db row' [RP_HPULL]; wk11 'bent over db row' [RP_HPULL]; wk12 'bent over db row' [RP_HPULL] | row 31 (3,3,3,4,4,4,3,4,4,4,4,5) | row 32 |  |
| WEDNESDAY (PULL) | 5 | r50 | ISO_BICEP | wk1 'barbell curls' [ISO_BICEP]; wk2 'hammer curls' [ISO_BICEP]; wk3 'barbell curls' [ISO_BICEP]; wk4 'hammer curls' [ISO_BICEP]; wk5 'barbell curls' [ISO_BICEP]; wk6 'hammer curls' [ISO_BICEP]; wk7 'barbell curls' [ISO_BICEP]; wk8 'hammer curls' [ISO_BICEP]; wk9 'Ez bar curls or barbell' [ISO_BICEP]; wk10 'Ez bar curls or barbell' [ISO_BICEP]; wk11 'Ez bar curls or barbell' [ISO_BICEP]; wk12 'Ez bar curls or barbell' [ISO_BICEP] | row 31 (3,3,3,4,4,4,3,4,4,4,4,5) | row 32 |  |
| THURSDAY (PUSH) | 1 | r51 | ISO_SIDE_REAR_DELT, RP_VPUSH | wk1 'cable side raises ' [ISO_SIDE_REAR_DELT]; wk2 'DB side raises' [ISO_SIDE_REAR_DELT]; wk3 'cable side raises ' [ISO_SIDE_REAR_DELT]; wk4 'DB side raises' [ISO_SIDE_REAR_DELT]; wk5 'cable side raises ' [ISO_SIDE_REAR_DELT]; wk6 'DB side raises' [ISO_SIDE_REAR_DELT]; wk7 'cable side raises ' [ISO_SIDE_REAR_DELT]; wk8 'DB side raises' [ISO_SIDE_REAR_DELT]; wk9 'Cable or DB side raises' [ISO_SIDE_REAR_DELT]; wk10 'Arnold press' [RP_VPUSH]; wk11 'Cable or DB side raises' [ISO_SIDE_REAR_DELT]; wk12 'Arnold press' [RP_VPUSH] | row 31 (3,3,3,4,4,4,3,4,4,4,4,5) | row 32 |  |
| THURSDAY (PUSH) | 2 | r52 | RP_HPUSH | wk1 'incline bench press' [RP_HPUSH]; wk2 'bench press' [RP_HPUSH]; wk3 'incline bench press' [RP_HPUSH]; wk4 'bench press' [RP_HPUSH]; wk5 'incline bench press' [RP_HPUSH]; wk6 'bench press' [RP_HPUSH]; wk7 'incline bench press' [RP_HPUSH]; wk8 'bench press' [RP_HPUSH]; wk9 'bench press + superset with max pushup set (only 1 set of max pushups per set of bench)' [RP_HPUSH]; wk10 'incline bench press + superset with a set of max bench dips, one set only per set of incline bench' [RP_HPUSH]; wk11 'bench press + superset with max pushup set (only 1 set of max pushups per set of bench)' [RP_HPUSH]; wk12 'incline bench press + superset with a set of max bench dips, one set only per set of incline bench' [RP_HPUSH] | row 31 (3,3,3,4,4,4,3,4,4,4,4,5) | row 32 |  |
| THURSDAY (PUSH) | 3 | r53 | ISO_CHEST | wk1 'high to low FLIES' [ISO_CHEST]; wk2 'machine or db flies' [ISO_CHEST]; wk3 'high to low FLIES' [ISO_CHEST]; wk4 'machine or db flies' [ISO_CHEST]; wk5 'high to low FLIES' [ISO_CHEST]; wk6 'machine or db flies' [ISO_CHEST]; wk7 'high to low FLIES' [ISO_CHEST]; wk8 'machine or db flies' [ISO_CHEST]; wk9 'high to low cable flies' [ISO_CHEST]; wk10 'machine or db flies' [ISO_CHEST]; wk11 'high to low cable flies' [ISO_CHEST]; wk12 'machine or db flies' [ISO_CHEST] | row 31 (3,3,3,4,4,4,3,4,4,4,4,5) | row 32 |  |
| THURSDAY (PUSH) | 4 | r54 'PUSH' | ISO_TRICEP, RP_HPUSH | wk1 'JM PRESS' [ISO_TRICEP]; wk2 'Machine Dips or dips' [RP_HPUSH]; wk3 'JM PRESS' [ISO_TRICEP]; wk4 'Machine Dips or dips' [RP_HPUSH]; wk5 'JM PRESS' [ISO_TRICEP]; wk6 'Machine Dips or dips' [RP_HPUSH]; wk7 'JM PRESS' [ISO_TRICEP]; wk8 'Machine Dips or dips' [RP_HPUSH]; wk9 'machine dips or dips' [RP_HPUSH]; wk10 'Machine Dips or dips' [RP_HPUSH]; wk11 'machine dips or dips' [RP_HPUSH]; wk12 'Machine Dips or dips' [RP_HPUSH] | row 31 (3,3,3,4,4,4,3,4,4,4,4,5) | row 32 |  |
| THURSDAY (PUSH) | 5 | r55 | ISO_TRICEP | wk1 'TATE PRESS' [ISO_TRICEP]; wk2 'cable tricep extension' [ISO_TRICEP]; wk3 'TATE PRESS' [ISO_TRICEP]; wk4 'cable tricep extension' [ISO_TRICEP]; wk5 'TATE PRESS' [ISO_TRICEP]; wk6 'cable tricep extension' [ISO_TRICEP]; wk7 'TATE PRESS' [ISO_TRICEP]; wk8 'cable tricep extension' [ISO_TRICEP]; wk9 'overhead cable rope tricep ext' [ISO_TRICEP]; wk10 'overhead cable rope tricep ext' [ISO_TRICEP]; wk11 'overhead cable rope tricep ext' [ISO_TRICEP]; wk12 'overhead cable rope tricep ext' [ISO_TRICEP] | row 31 (3,3,3,4,4,4,3,4,4,4,4,5) | row 32 |  |
| THURSDAY (PUSH) | 6 | r56 | ISO_TRICEP | wk1 'TRICEP EXT.' [ISO_TRICEP]; wk2 'cable regular top down tricep extension' [ISO_TRICEP]; wk3 'TRICEP EXT.' [ISO_TRICEP]; wk4 'cable regular top down tricep extension' [ISO_TRICEP]; wk5 'TRICEP EXT.' [ISO_TRICEP]; wk6 'cable regular top down tricep extension' [ISO_TRICEP]; wk7 'TRICEP EXT.' [ISO_TRICEP]; wk8 'cable regular top down tricep extension' [ISO_TRICEP] | row 31 (3,3,3,4,4,4,3,4,4,4,4,5) | row 32 |  |
| FRIDAY (LEGS) | 1 | r57 | RP_BKD, RP_UKD | wk1 'front SQUATS' [RP_BKD]; wk2 'front SQUATS' [RP_BKD]; wk3 'front SQUATS' [RP_BKD]; wk4 'front SQUATS' [RP_BKD]; wk5 'front SQUATS' [RP_BKD]; wk6 'front SQUATS' [RP_BKD]; wk7 'front SQUATS' [RP_BKD]; wk8 'front SQUATS' [RP_BKD]; wk9 'RFE Lunges (bulgarian)' [RP_UKD]; wk10 'RFE Lunges (bulgarian)' [RP_UKD]; wk11 'RFE Lunges (bulgarian)' [RP_UKD]; wk12 'RFE Lunges (bulgarian)' [RP_UKD] | row 31 (3,3,3,4,4,4,3,4,4,4,4,5) | row 32 |  |
| FRIDAY (LEGS) | 2 | r58 | RP_BKD, RP_UHD | wk1 'LEG PRESS' [RP_BKD]; wk2 'LEG PRESS' [RP_BKD]; wk3 'LEG PRESS' [RP_BKD]; wk4 'LEG PRESS' [RP_BKD]; wk5 'LEG PRESS' [RP_BKD]; wk6 'LEG PRESS' [RP_BKD]; wk7 'LEG PRESS' [RP_BKD]; wk8 'LEG PRESS' [RP_BKD]; wk9 'Staggered stance unilateral deadlifts' [RP_UHD]; wk10 'Staggered stance unilateral deadlifts' [RP_UHD]; wk11 'Staggered stance unilateral deadlifts' [RP_UHD]; wk12 'Staggered stance unilateral deadlifts' [RP_UHD] | row 31 (3,3,3,4,4,4,3,4,4,4,4,5) | row 32 |  |
| FRIDAY (LEGS) | 3 | r59 | ISO_QUAD, RP_BHD, RP_UHD | wk1 'DEADLIFTS' [RP_BHD]; wk2 'Staggered DL' [RP_UHD]; wk3 'Staggered DL' [RP_UHD]; wk4 'Staggered DL' [RP_UHD]; wk5 'Staggered DL' [RP_UHD]; wk6 'Staggered DL' [RP_UHD]; wk7 'Staggered DL' [RP_UHD]; wk8 'Staggered DL' [RP_UHD]; wk9 'Leg extension one leg at a time' [ISO_QUAD]; wk10 'Leg extension one leg at a time' [ISO_QUAD]; wk11 'Leg extension one leg at a time' [ISO_QUAD]; wk12 'Leg extension one leg at a time' [ISO_QUAD] | row 31 (3,3,3,4,4,4,3,4,4,4,4,5) | row 32 |  |
| FRIDAY (LEGS) | 4 | r60 | ISO_HAM, RP_UKD | wk1 'LUNGES' [RP_UKD]; wk2 'LUNGES' [RP_UKD]; wk3 'LUNGES' [RP_UKD]; wk4 'LUNGES' [RP_UKD]; wk5 'LUNGES' [RP_UKD]; wk6 'LUNGES' [RP_UKD]; wk7 'LUNGES' [RP_UKD]; wk8 'LUNGES' [RP_UKD]; wk9 'leg curls one leg at a time' [ISO_HAM]; wk10 'leg curls one leg at a time' [ISO_HAM]; wk11 'leg curls one leg at a time' [ISO_HAM]; wk12 'leg curls one leg at a time' [ISO_HAM] | row 31 (3,3,3,4,4,4,3,4,4,4,4,5) | row 32 |  |
| FRIDAY (LEGS) | 5 | r61 | ISO_QUAD, RP_BKD, RP_UHD | wk1 'STAGRD. DL' [RP_UHD]; wk2 'LEg Extensions' [ISO_QUAD]; wk3 'LEg Extensions' [ISO_QUAD]; wk4 'LEg Extensions' [ISO_QUAD]; wk5 'LEg Extensions' [ISO_QUAD]; wk6 'LEg Extensions' [ISO_QUAD]; wk7 'LEg Extensions' [ISO_QUAD]; wk8 'LEg Extensions' [ISO_QUAD]; wk9 '2 sets LEG PRESS MYO - 15-5-5-5-5-5' [RP_BKD]; wk10 '2 sets LEG PRESS MYO - 15-5-5-5-5-5' [RP_BKD]; wk11 '2 sets LEG PRESS MYO - 15-5-5-5-5-5' [RP_BKD]; wk12 '3 sets LEG PRESS MYO - 15-5-5-5-5-5' [RP_BKD] | row 31 (3,3,3,4,4,4,3,4,4,4,4,5) ; wk9-11 2, wk12 3 (MYO) | row 32 |  |
| SATURDAY (PULL) | 1 | r62 | RP_VPULL | wk1 'Lat pull downs' [RP_VPULL]; wk2 'Neutral grip lat pull down' [RP_VPULL]; wk3 'Lat pull downs' [RP_VPULL]; wk4 'Neutral grip lat pull down' [RP_VPULL]; wk5 'Lat pull downs' [RP_VPULL]; wk6 'Neutral grip lat pull down' [RP_VPULL]; wk7 'Lat pull downs' [RP_VPULL]; wk8 'Neutral grip lat pull down' [RP_VPULL]; wk9 'Neutral grip lat pull down' [RP_VPULL]; wk10 'Neutral grip lat pull down' [RP_VPULL]; wk11 'Neutral grip lat pull down' [RP_VPULL]; wk12 'Neutral grip lat pull down' [RP_VPULL] | row 31 (3,3,3,4,4,4,3,4,4,4,4,5) | row 32 |  |
| SATURDAY (PULL) | 2 | r63 | RP_HPULL | wk1 'Rows' [RP_HPULL]; wk2 'machine rows or db rows' [RP_HPULL]; wk3 'Rows' [RP_HPULL]; wk4 'machine rows or db rows' [RP_HPULL]; wk5 'Rows' [RP_HPULL]; wk6 'machine rows or db rows' [RP_HPULL]; wk7 'Rows' [RP_HPULL]; wk8 'machine rows or db rows' [RP_HPULL]; wk9 'machine rows or db rows (5 sets - 15/12/12/12/10)' [RP_HPULL]; wk10 'machine rows or db rows (5 sets - 15/12/12/12/10)' [RP_HPULL]; wk11 'machine rows or db rows (5 sets - 15/12/12/12/10)' [RP_HPULL]; wk12 'machine rows or db rows (5 sets - 15/12/12/12/10)' [RP_HPULL] | row 31 (3,3,3,4,4,4,3,4,4,4,4,5) ; wk9-12 '5 sets' | row 32 |  |
| SATURDAY (PULL) | 3 | r64 'PULL' | ISO_SIDE_REAR_DELT, RP_VPULL | wk1 'Pull under' [RP_VPULL]; wk2 'pull under' [RP_VPULL]; wk3 'Pull under' [RP_VPULL]; wk4 'pull under' [RP_VPULL]; wk5 'Pull under' [RP_VPULL]; wk6 'pull under' [RP_VPULL]; wk7 'Pull under' [RP_VPULL]; wk8 'pull under' [RP_VPULL]; wk9 'machine or db Reverse flies' [ISO_SIDE_REAR_DELT]; wk10 'machine or db Reverse flies' [ISO_SIDE_REAR_DELT]; wk11 'machine or db Reverse flies' [ISO_SIDE_REAR_DELT]; wk12 'machine or db Reverse flies' [ISO_SIDE_REAR_DELT] | row 31 (3,3,3,4,4,4,3,4,4,4,4,5) | row 32 |  |
| SATURDAY (PULL) | 4 | r65 | ISO_SIDE_REAR_DELT, RP_HPULL | wk1 'face pulls' [ISO_SIDE_REAR_DELT]; wk2 'upright db row' [ISO_SIDE_REAR_DELT]; wk3 'face pulls' [ISO_SIDE_REAR_DELT]; wk4 'upright db row' [ISO_SIDE_REAR_DELT]; wk5 'face pulls' [ISO_SIDE_REAR_DELT]; wk6 'upright db row' [ISO_SIDE_REAR_DELT]; wk7 'face pulls' [ISO_SIDE_REAR_DELT]; wk8 'upright db row' [ISO_SIDE_REAR_DELT]; wk9 'bent over db row' [RP_HPULL]; wk10 'bent over db row' [RP_HPULL]; wk11 'bent over db row' [RP_HPULL]; wk12 'bent over db row' [RP_HPULL] | row 31 (3,3,3,4,4,4,3,4,4,4,4,5) | row 32 |  |
| SATURDAY (PULL) | 5 | r66 | ISO_BICEP | wk1 'barbell curls' [ISO_BICEP]; wk2 'hammer curls' [ISO_BICEP]; wk3 'barbell curls' [ISO_BICEP]; wk4 'hammer curls' [ISO_BICEP]; wk5 'barbell curls' [ISO_BICEP]; wk6 'hammer curls' [ISO_BICEP]; wk7 'barbell curls' [ISO_BICEP]; wk8 'hammer curls' [ISO_BICEP]; wk9 'Ez bar curls or barbell' [ISO_BICEP]; wk10 'Ez bar curls or barbell' [ISO_BICEP]; wk11 'Ez bar curls or barbell' [ISO_BICEP]; wk12 'Ez bar curls or barbell' [ISO_BICEP] | row 31 (3,3,3,4,4,4,3,4,4,4,4,5) | row 32 |  |

**Rules visible:**
1. **The push day opens with the small muscle.** Side raises (or 'Arnold press') come first, then the chest press, chest fly, dips, and two triceps isolations. *INFERRED*: priority / pre-fatigue for the delts, a deliberate aesthetics choice.
2. Legs: 'front SQUATS' -> 'LEG PRESS' -> 'DEADLIFTS' -> 'LUNGES' -> 'STAGRD. DL'. The order is bilateral KD, bilateral KD, bilateral HD, unilateral KD, unilateral HD. Friday weeks 2-8 replace the hinge pair with 'Staggered DL' + 'LEg Extensions'.
3. Pull: vertical pull -> horizontal pull -> 'Pull under' (straight-arm lat) -> 'face pulls'/'upright db row' -> curls.
4. **A/B alternation changes the variant, not the pattern:** cable vs DB side raise; incline vs flat bench; low-to-high vs machine flies; 'TATE PRESS' vs cable extension; 'JM PRESS' vs dips; barbell vs hammer curls; face pulls vs upright rows.
5. **Week 7 'A WEEK LOWER'** = 3 sets of '8/8/8-12', a deload, matching STRENGTH-12's week 7 'MID DELOAD'.
6. **Phase 2 (weeks 9-12) brings in intensification techniques:**
   * 'front squats + Superset with 15 squats with no weight every set'.
   * 'bench press + superset with max pushup set (only 1 set of max pushups per set of bench)'.
   * 'incline bench press + superset with a set of max bench dips, one set only per set of incline bench'.
   * '2 sets LEG PRESS MYO - 15-5-5-5-5-5' (week 12: '3 sets').
   * 'machine rows or db rows (5 sets - 15/12/12/12/10)'.
   * One-leg leg extensions/curls; Friday becomes all unilateral/isolation.
   * Push days drop from 6 to 5 exercises: the second triceps extension disappears from week 8 (Monday) / week 9 (Thursday).

**Quantitative volume.** Header sets x exercises. Exceptions: myo rows = 2/3 sets, row 63 = 5 sets. Superset partners are shown separately.

| Week | Row 33 label | SETS (row 31) | REPS (row 32, verbatim) | Exercises/session MON..SAT | Sets/session (no superset partners) | Weekly sets | Weekly sets incl. superset partners | Weekly sets by bucket (incl. supersets) | Hypertrophy sets by muscle (incl. supersets) |
|---|---|---|---|---|---|---|---|---|---|
| WK1 | A WEEK | 3 | 12/10/8 -20 | 6/5/5/6/5/5 | 18/15/15/18/15/15 | 96 | 96 | RP_BKD 12, RP_BHD 6, RP_UKD 6, RP_UHD 6, RP_HPUSH 9, RP_HPULL 6, RP_VPULL 12, ISO_CHEST 6, ISO_SIDE_REAR_DELT 12, ISO_BICEP 6, ISO_TRICEP 15 | quads 18, glutes 24, hamstrings 12, chest 15, lats_upper_back 21, front_delts 7.5, side_delts 6, rear_delts 9, biceps 12, triceps 21 |
| WK2 | B WEEK | 3 | 12/10/8- 20 | 6/5/5/6/5/5 | 18/15/15/18/15/15 | 96 | 96 | RP_BKD 12, RP_BHD 3, RP_UKD 6, RP_UHD 6, RP_HPUSH 12, RP_HPULL 6, RP_VPULL 12, ISO_QUAD 3, ISO_CHEST 6, ISO_SIDE_REAR_DELT 12, ISO_BICEP 6, ISO_TRICEP 12 | quads 21, glutes 21, hamstrings 9, chest 18, lats_upper_back 18, front_delts 9, side_delts 12, rear_delts 3, biceps 12, triceps 21 |
| WK3 | A WEEK | 3 | 12/10/8-20 | 6/5/5/6/5/5 | 18/15/15/18/15/15 | 96 | 96 | RP_BKD 12, RP_BHD 3, RP_UKD 6, RP_UHD 6, RP_HPUSH 9, RP_HPULL 6, RP_VPULL 12, ISO_QUAD 3, ISO_CHEST 6, ISO_SIDE_REAR_DELT 12, ISO_BICEP 6, ISO_TRICEP 15 | quads 21, glutes 21, hamstrings 9, chest 15, lats_upper_back 21, front_delts 7.5, side_delts 6, rear_delts 9, biceps 12, triceps 21 |
| WK4 | B WEEK | 4 | 12/12/10-20 | 6/5/5/6/5/5 | 24/20/20/24/20/20 | 128 | 128 | RP_BKD 16, RP_BHD 4, RP_UKD 8, RP_UHD 8, RP_HPUSH 16, RP_HPULL 8, RP_VPULL 16, ISO_QUAD 4, ISO_CHEST 8, ISO_SIDE_REAR_DELT 16, ISO_BICEP 8, ISO_TRICEP 16 | quads 28, glutes 28, hamstrings 12, chest 24, lats_upper_back 24, front_delts 12, side_delts 16, rear_delts 4, biceps 16, triceps 28 |
| WK5 | A WEEK | 4 | 12/12/10-20 | 6/5/5/6/5/5 | 24/20/20/24/20/20 | 128 | 128 | RP_BKD 16, RP_BHD 4, RP_UKD 8, RP_UHD 8, RP_HPUSH 12, RP_HPULL 8, RP_VPULL 16, ISO_QUAD 4, ISO_CHEST 8, ISO_SIDE_REAR_DELT 16, ISO_BICEP 8, ISO_TRICEP 20 | quads 28, glutes 28, hamstrings 12, chest 20, lats_upper_back 28, front_delts 10, side_delts 8, rear_delts 12, biceps 16, triceps 28 |
| WK6 | BWEEK | 4 | 12/12/12-20 | 6/5/5/6/5/5 | 24/20/20/24/20/20 | 128 | 128 | RP_BKD 16, RP_BHD 4, RP_UKD 8, RP_UHD 8, RP_HPUSH 16, RP_HPULL 8, RP_VPULL 16, ISO_QUAD 4, ISO_CHEST 8, ISO_SIDE_REAR_DELT 16, ISO_BICEP 8, ISO_TRICEP 16 | quads 28, glutes 28, hamstrings 12, chest 24, lats_upper_back 24, front_delts 12, side_delts 16, rear_delts 4, biceps 16, triceps 28 |
| WK7 | A WEEK LOWER | 3 | 8/8/8-12 | 6/5/5/6/5/5 | 18/15/15/18/15/15 | 96 | 96 | RP_BKD 12, RP_BHD 3, RP_UKD 6, RP_UHD 6, RP_HPUSH 9, RP_HPULL 6, RP_VPULL 12, ISO_QUAD 3, ISO_CHEST 6, ISO_SIDE_REAR_DELT 12, ISO_BICEP 6, ISO_TRICEP 15 | quads 21, glutes 21, hamstrings 9, chest 15, lats_upper_back 21, front_delts 7.5, side_delts 6, rear_delts 9, biceps 12, triceps 21 |
| WK8 | - | 4 | 15/12/10/8-20 | 5/5/5/6/5/5 | 20/20/20/24/20/20 | 124 | 124 | RP_BKD 16, RP_BHD 4, RP_UKD 8, RP_UHD 8, RP_HPUSH 16, RP_VPUSH 4, RP_HPULL 8, RP_VPULL 16, ISO_QUAD 4, ISO_CHEST 8, ISO_SIDE_REAR_DELT 12, ISO_BICEP 8, ISO_TRICEP 12 | quads 28, glutes 28, hamstrings 12, chest 24, lats_upper_back 24, front_delts 16, side_delts 14, rear_delts 4, biceps 16, triceps 26 |
| WK9 | - | 4 | 15/12/10/8-20 | 5/5/5/5/5/5 | 20/20/20/20/18/21 | 119 | 127 | RP_BKD 14, RP_BHD 4, RP_UKD 8, RP_UHD 8, RP_HPUSH 20, RP_HPULL 17, RP_VPULL 8, ISO_QUAD 4, ISO_HAM 4, ISO_CHEST 8, ISO_SIDE_REAR_DELT 16, ISO_BICEP 8, ISO_TRICEP 8 | quads 26, glutes 27, hamstrings 16, chest 28, lats_upper_back 29, front_delts 16, side_delts 8, rear_delts 16.5, biceps 20.5, triceps 22 |
| WK10 | - | 4 | 12/12/10/10-20 | 5/5/5/5/5/5 | 20/20/20/20/18/21 | 119 | 127 | RP_BKD 14, RP_BHD 4, RP_UKD 8, RP_UHD 8, RP_HPUSH 16, RP_VPUSH 8, RP_HPULL 17, RP_VPULL 8, ISO_QUAD 4, ISO_HAM 4, ISO_CHEST 8, ISO_SIDE_REAR_DELT 8, ISO_BICEP 8, ISO_TRICEP 12 | quads 26, glutes 27, hamstrings 16, chest 26, lats_upper_back 29, front_delts 22, side_delts 4, rear_delts 16.5, biceps 20.5, triceps 28 |
| WK11 | - | 4 | 12/12/12/12-20 | 5/5/5/5/5/5 | 20/20/20/20/18/21 | 119 | 127 | RP_BKD 14, RP_BHD 4, RP_UKD 8, RP_UHD 8, RP_HPUSH 20, RP_HPULL 17, RP_VPULL 8, ISO_QUAD 4, ISO_HAM 4, ISO_CHEST 8, ISO_SIDE_REAR_DELT 16, ISO_BICEP 8, ISO_TRICEP 8 | quads 26, glutes 27, hamstrings 16, chest 28, lats_upper_back 29, front_delts 16, side_delts 8, rear_delts 16.5, biceps 20.5, triceps 22 |
| WK12 | - | 5 | 15/15/12/12/12 | 5/5/5/5/5/5 | 25/25/25/25/23/25 | 148 | 158 | RP_BKD 18, RP_BHD 5, RP_UKD 10, RP_UHD 10, RP_HPUSH 20, RP_VPUSH 10, RP_HPULL 20, RP_VPULL 10, ISO_QUAD 5, ISO_HAM 5, ISO_CHEST 10, ISO_SIDE_REAR_DELT 10, ISO_BICEP 10, ISO_TRICEP 15 | quads 33, glutes 34, hamstrings 20, chest 32.5, lats_upper_back 35, front_delts 27.5, side_delts 5, rear_delts 20, biceps 25, triceps 35 |

A/B pair means:

| A/B pair | Mean hypertrophy sets by muscle (incl. supersets) |
|---|---|
| WK1+WK2 mean | biceps 12, chest 16.5, front_delts 8.25, glutes 22.5, hamstrings 10.5, lats_upper_back 19.5, quads 19.5, rear_delts 6, side_delts 9, triceps 21 |
| WK3+WK4 mean | biceps 14, chest 19.5, front_delts 9.75, glutes 24.5, hamstrings 10.5, lats_upper_back 22.5, quads 24.5, rear_delts 6.5, side_delts 11, triceps 24.5 |
| WK5+WK6 mean | biceps 16, chest 22, front_delts 11, glutes 28, hamstrings 12, lats_upper_back 26, quads 28, rear_delts 8, side_delts 12, triceps 28 |
| WK8+WK9 mean | biceps 18.25, chest 26, front_delts 16, glutes 27.5, hamstrings 14, lats_upper_back 26.5, quads 27, rear_delts 10.25, side_delts 11, triceps 24 |
| WK10+WK11 mean | biceps 20.5, chest 27, front_delts 19, glutes 27, hamstrings 16, lats_upper_back 29, quads 26, rear_delts 16.5, side_delts 6, triceps 25 |

**Rep scheme decoding** (*INFERRED*, open question):
* The slash numbers are per-set rep targets, a descending pyramid (12/10/8 = 3 sets as the header SETS = 3).
* In weeks 1-3 and 7-9 the count of slash numbers equals SETS. So '-20' (or '-12' in week 7) is either an **extra back-off/burn-out set** (to 20 reps), or the **rep target for isolation (small-muscle) exercises** ("12/10/8 for compounds - 20 for isolations").
* Weeks 4-6 have SETS 4 but only 3 slash numbers. That fits "3 working sets + the 20-rep set = 4".
* Both readings fit the coach's "small muscles take more reps". Volume above counts the header SETS only.

**Progression:**
* Sets per exercise 3 -> 4 (wk4, +33%) -> 3 (wk7 deload, -25%) -> 4 (wk8) -> 5 (wk12, +25%). Compounded from wk1 to wk12 that is **+4.75%/week**, inside the coach's 3-7% band.
* Weekly sets 96 -> 128 -> 96 -> 124 -> 119 (127 with superset partners) -> 148 (158).
* Reps move from a descending pyramid (12/10/8) toward flat or higher reps (12/12/12, 15/15/12/12/12). Phase 2 adds density (supersets, myo).

### 2.5 HYBRID track, 8-week (rows 69-101)
**Identity**:
* 'strenght - athletic - crossfitish training': strength + Olympic lifting + jumps + sprints + aerobic + a weekend circuit.
* 5 days: MONDAY, TUESDAY, THURSDAY, FRIDAY, SATURDAY. WED/SUN off (*INFERRED* from absence).
* Header rows:
  * D70 'AMRAP' 12,15,16,17,18,19,20,20.
  * D71 'SETS' 2,2,2,3,3,3,4,4.
  * D72 'REPS' 6,8,10,6,8,10,6,8.
  * Unlabelled row 78 = 2,2,2,3,3,3,4,4 (next to D78 'UPPER ACCESORY'); unlabelled row 79 = 2,2,3,2,2,3,2,2.
* Column B = quality ('STRENGTH', 'OLY/ POWER', 'UNI HD', 'HOR PULL', 'A/C', 'UNI KD/ HOR ROW', 'OH PUSH', 'UNI KD', 'FB ').
* Column C = pattern ('KD', 'PUSH', 'KD' [sic, deadlifts], 'KD REPS', 'VEr pull/ hor push'). Column C also has day-name anchors ('MONDAY' C76, 'TUESDAY' C83, 'THURSDAY' C88, 'FRIDAY' C94, 'SATURDAY' C100).
* Column D = exercise family.

| Day | Order | Slot label (cols B/C/D, verbatim) | Canonical bucket | Exercise by week (verbatim) | Sets (wk1) | Reps (wk1; assumed where unset) | Intensity | Notes |
|---|---|---|---|---|---|---|---|---|
| MONDAY | 1 | 'STRENGTH 'KD' 'SQUATS'' | RP_BKD | wk1 'FRONT SQUATS'; wk2 'BACK SQUATS'; wk3 'FRONT SQUATS'; wk4 'BACK SQUATS'; wk5 'FRONT SQUATS'; wk6 'BACK SQUATS'; wk7 'FRONT SQUATS'; wk8 'BACK SQUATS' | as written: header SETS 2,2,2,3,3,3,4,4; assumed: 2 | 6 | header SETS/REPS |  |
| MONDAY | 2 | 'OLY/ POWER 'CLEANS'' | AP_TRIPLE_EXT | wk1 '2x 2 clean pulls, 2 power cleans'; wk2 '2x 5 heavy touch and go cleans'; wk3 '2x 3 clean pulls heavy'; wk4 '3x 3 heavy power cleans'; wk5 '4x 2 heavy squat cleans'; wk6 '2x 3 heavy clean pulls'; wk7 '2x3 heavy squat cleans'; wk8 '2x 1 heavy squat clean' | as written: 2; assumed: 2 | 2+2 | heavy |  |
| MONDAY | 3 | 'UNI HD tri-set 'UNI RDL/ CORE/ UNI GB'' | RP_UHD | all weeks 'UNI RDL' | as written: unset; assumed: 2 | 6 | - |  |
| MONDAY | 4 | 'UNI HD tri-set' | CORE_OTHER | all weeks 'CORE' | as written: unset; assumed: 2 | - | - |  |
| MONDAY | 5 | 'UNI HD tri-set' | RP_UHD | all weeks 'UNI GB' | as written: unset; assumed: 2 | 6 | - |  |
| MONDAY | 6 | 'HOR PULL + row78 sets' | RP_HPULL | all weeks 'DB ROWS / 'UPPER ACCESORY'' | as written: 2; assumed: 2 | 6 | - |  |
| TUESDAY | 1 | 'A/C 'SPEED'' | COND_SPRINT_BUYOUT | wk1 '10x15 Sec sprint/30 sec walk'; wk2 '12x 15 sec sprint/ 30 sec walk'; wk3 '15 x 15 sec sprint/ 30 sec walk'; wk4 '10x 20 sec sprint/ 40 sec walk'; wk5 '12x20 sec sprint/ 40 sec walk'; wk6 '15x 20 sec sprint/40 sec walk'; wk7 '5x 30 sec fast/ 2 min walk'; wk8 '10x 30 sec fastest/ 2 min walk' | as written: unset; assumed: 0 | - | 10 x 15s work / 30s walk | bouts=10; work=150s |
| TUESDAY | 2 | 'STRENGTH 'PUSH' 'BENCH PRESS'' | RP_HPUSH | wk1 '3x6 - DB bench press/ core'; wk2 '3x6 db incline bench press/ core'; wk3 '3x8 - barbell bench press/ core'; wk4 '3x8 - barbell incline bench press/ core'; wk5 '3x10 DB bench press/ core'; wk6 '3x10 DB incline press/ core'; wk7 '4x6 bb bench/ core'; wk8 '4x8/ bb incline bench/ core' | as written: 3; assumed: 3 | 6 | - |  |
| TUESDAY | 3 | 'STRENGTH PUSH '/ core'' | CORE_OTHER | all weeks 'core (paired with bench)' | as written: 3; assumed: 3 | - | - |  |
| TUESDAY | 4 | 'OLY/ POWER 'JUMPS'' | AP_PLYO | wk1 'Depth drops'; wk2 'Weighted depth drops'; wk3 'depth drop to jump'; wk4 'weighted depth drops to jump'; wk5 'box jumps'; wk6 'box jumps'; wk7 'repeat hurdle hops'; wk8 'repeat hurdle hops' | as written: unset; assumed: 3 | 6 | EASY (assumed from STRENGTH track plyo) |  |
| TUESDAY | 5 | 'LOWER ACCESORY' | FOCUS | all weeks ''LOWER ACCESORY' (label only)' | as written: unset; assumed: 2 | - | - |  |
| THURSDAY | 1 | 'STRENGTH 'KD'(sic) 'DEADLIFTS'' | RP_BHD | wk1 'KB DL'; wk2 'KB DL'; wk3 'HEX BAR OR DB DL'; wk4 'HEX BAR OR DB DL'; wk5 'BARBELL DL '; wk6 'KB DL'; wk7 'HEX BAR OR DB DL'; wk8 'BARBELL DL ' | as written: header SETS 2,2,2,3,3,3,4,4; assumed: 2 | 6 | header SETS/REPS |  |
| THURSDAY | 2 | 'OLY/ POWER 'SNATCHES'' | AP_TRIPLE_EXT | wk1 '2x 2 snatch pulls, 2 power snatches'; wk2 '2x 5 heavy touch and go power snatches'; wk3 '2x 3 snatch pulls heavy'; wk4 '3x 3 heavy power snatches'; wk5 '4x 2 heavy squat snatches'; wk6 '2x 3 heavy snatch pulls'; wk7 '2x3 heavy power snatches'; wk8 '2x 1 heavy power snatches' | as written: 2; assumed: 2 | 2+2 | heavy |  |
| THURSDAY | 3 | 'UNI KD/ HOR ROW tri-set 'LUNGES/ ROWS'' | RP_UKD | wk1 'FE contra'; wk2 'FFE ipsi'; wk3 'FF & RFE ipsi'; wk4 'RFE contra'; wk5 'RFE ipsi'; wk6 'FF & RFE dcontra'; wk7 'RFE contra'; wk8 'RFE ipsi' | as written: unset; assumed: 2 | 6 | - |  |
| THURSDAY | 4 | 'UNI KD/ HOR ROW tri-set' | RP_HPULL | all weeks 'DB rows' | as written: unset; assumed: 2 | 6 | - |  |
| THURSDAY | 5 | 'UNI KD/ HOR ROW tri-set' | CORE_OTHER | all weeks 'core' | as written: unset; assumed: 2 | - | - |  |
| THURSDAY | 6 | 'UPPER ACCESORY' | FOCUS | all weeks ''UPPER ACCESORY' (label only, D90)' | as written: unset; assumed: 2 | - | - |  |
| FRIDAY | 1 | 'A/C 'DISTANCE'' | COND_AEROBIC | all weeks '15-40 min constant cardo easy' | as written: unset; assumed: 0 | - | easy |  |
| FRIDAY | 2 | 'OLY/ POWER 'JUMPS'' | AP_PLYO | wk1 'Depth drops'; wk2 'Weighted depth drops'; wk3 'depth drop to jump'; wk4 'weighted depth drops to jump'; wk5 'box jumps'; wk6 'box jumps'; wk7 'repeat hurdle hops'; wk8 'repeat hurdle hops' | as written: unset; assumed: 3 | 6 | EASY (assumed) |  |
| FRIDAY | 3 | 'UNI HD tri-set 'uni RDL/ core/ OH press'' | RP_UHD | all weeks 'uni RDL' | as written: unset; assumed: 2 | 6 | - |  |
| FRIDAY | 4 | 'UNI HD tri-set' | CORE_OTHER | all weeks 'core' | as written: unset; assumed: 2 | - | - |  |
| FRIDAY | 5 | 'UNI HD tri-set (+ 'OH PUSH' row 95)' | RP_VPUSH | all weeks 'OH press' | as written: unset; assumed: 2 | 6 | - |  |
| FRIDAY | 6 | 'LOWER ACCESORY (row 96)' | FOCUS | all weeks ''LOWER ACCESORY'' | as written: unset; assumed: 2 | - | - |  |
| SATURDAY | 1 | 'STRENGTH 'KD REPS' 'SQUATS'' | RP_BKD | wk1 'BACK SQUATS'; wk2 'FRONT SQUATS'; wk3 'BACK SQUATS'; wk4 'FRONT SQUATS'; wk5 'BACK SQUATS'; wk6 'FRONT SQUATS'; wk7 'BACK SQUATS'; wk8 'FRONT SQUATS' | as written: header SETS 2,2,2,3,3,3,4,4; assumed: 2 | 6 | header SETS/REPS |  |
| SATURDAY | 2 | 'UNI KD 'STEP UPS' / FB 'VEr pull/ hor push' circuit' | RP_UKD | wk1 'FF & RFE Lunge goblet'; wk2 'FF & RFE Lunge double dbs'; wk3 'FF & RFE Lunge'; wk4 'FF & RFE Lunge double dbs'; wk5 'FF & RFE Lunge goblet'; wk6 'FF & RFE Lunge double dbs'; wk7 'FF & RFE Lunge'; wk8 'FF & RFE Lunge double dbs' | as written: unset; assumed: 2 | - | AMRAP 12 (min, inferred) |  |
| SATURDAY | 3 | 'UNI KD 'STEP UPS' / FB 'VEr pull/ hor push' circuit' | CP_CORE_PELVIS, RP_VPULL | wk1 'T2B'; wk2 'jumping pull ups'; wk3 'T2B'; wk4 'pull ups'; wk5 'T2B'; wk6 'jumping pull ups'; wk7 'T2B'; wk8 'pull ups' | as written: unset; assumed: 2 | - | AMRAP 12 (min, inferred) |  |
| SATURDAY | 4 | 'UNI KD 'STEP UPS' / FB 'VEr pull/ hor push' circuit' | RP_HPUSH, RP_VPUSH | wk1 'hand switch pushups'; wk2 'db push press'; wk3 'db bench press'; wk4 'db strict press'; wk5 'hand switch pushups'; wk6 'db push press'; wk7 'db bench press'; wk8 'db strict press' | as written: unset; assumed: 2 | - | AMRAP 12 (min, inferred) |  |

**Rules visible:**
1. **Session order is quality-first** (row order, *INFERRED* = session order):
   * STRENGTH bilateral -> OLY/POWER -> unilateral tri-set (opposite dominance) + upper pull/push + core -> accessory.
   * Strength is listed **before** the Olympic lift on Mon/Thu (open question: deliberate?).
2. **Opposite dominance:** squat day (Mon) -> 'UNI HD' (uni RDL + glute bridge); deadlift day (Thu) -> 'UNI KD' lunges.
3. **Core is integrated, never standalone:** it sits in tri-sets ('UNI RDL/ CORE/ UNI GB', 'FE contra/ DB rows/core', 'uni RDL/ core/ OH press') and is paired with the bench ('3x6 - DB bench press/ core'). The Saturday circuit uses 'T2B'.
4. **Olympic lifts alternate clean (Mon) / snatch (Thu)** and rotate pull -> power -> squat variants: '2x 2 clean pulls, 2 power cleans', '2x 5 heavy touch and go cleans', '2x 3 clean pulls heavy', '3x 3 heavy power cleans', '4x 2 heavy squat cleans', '2x 3 heavy clean pulls', '2x3 heavy squat cleans', '2x 1 heavy squat clean'. Volume is 4-8 sets x 1-5 reps per week, always 'heavy'.
5. **Jumps twice a week on the non-squat days** (Tue after bench, Fri after easy cardio). Amplitude/complexity ladder: 'Depth drops' -> 'Weighted depth drops' -> 'depth drop to jump' -> 'weighted depth drops to jump' -> 'box jumps' -> 'repeat hurdle hops'. That is landing -> loaded landing -> reactive -> concentric -> repeated SSC.
6. **Conditioning has one high (A) and one low (C) session**, matching the cheat sheet's "never the same colour twice a week":
   * Tue 'SPEED' sprints: 10/12/15 reps of 15s then 20s at 1:2, then 30s at 1:4 'fastest'.
   * Fri 'DISTANCE' '15-40 min constant cardo easy'.
7. **Bench** alternates flat/incline and DB/barbell weekly: 3x6 -> 3x6 -> 3x8 -> 3x8 -> 3x10 -> 3x10 -> 4x6 -> 4x8.
8. Saturday 'KD REPS' squats + a full-body circuit: FF & RFE lunge + (T2B | jumping pull-ups | pull-ups) + (push-ups | DB push press | DB bench | DB strict press), on a 4-week rotation. *INFERRED*: this is where the 'AMRAP' row applies (12 -> 20 minutes).

**Quantitative volume.** As written = header SETS on the strength rows + explicit Oly/bench + row-78 sets on Monday's accessory. Assumed:
* tri-set parts = header SETS;
* jumps = 3 x 6 (borrowed from STRENGTH's plyo dose);
* unlabelled accessory rows = row-78 sets (counted as FOCUS);
* Saturday circuit rounds = header SETS.

| Week | AMRAP (row 70) | SETS (row 71) | REPS (row 72) | Strength reps/exercise | Tue sprint (COND_SPRINT_BUYOUT) | Components/session MON/TUE/THU/FRI/SAT | Sets/session as written | Weekly as written | Sets/session assumed | Weekly assumed | Weekly sets by bucket (assumed) | Hypertrophy sets by muscle (assumed) | Athletic exposure (assumed) |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| WK1 | 12 | 2 | 6 | 12 | 10x15s / 30s = 150s work | 6/5/6/6/4 | 6/6/4/0/2 | 18 | 12/11/12/11/8 | 54 | AP_PLYO 6, AP_TRIPLE_EXT 4, RP_BKD 4, RP_BHD 2, RP_UKD 4, RP_UHD 6, RP_HPUSH 5, RP_VPUSH 2, RP_HPULL 4, CP_CORE_PELVIS 2, CORE_OTHER 9, FOCUS 6 | quads 8, glutes 14, hamstrings 7, chest 5, lats_upper_back 4, front_delts 7, side_delts 1, rear_delts 2, biceps 2, triceps 3.5, abs_obliques 11 | quads 8, glutes 7, hamstrings 2, lats_upper_back 2, calves 5 |
| WK2 | 15 | 2 | 8 | 16 | 12x15s / 30s = 180s work | 6/5/6/6/4 | 6/6/4/0/2 | 18 | 12/11/12/11/8 | 54 | AP_PLYO 6, AP_TRIPLE_EXT 4, RP_BKD 4, RP_BHD 2, RP_UKD 4, RP_UHD 6, RP_HPUSH 3, RP_VPUSH 4, RP_HPULL 4, RP_VPULL 2, CORE_OTHER 9, FOCUS 6 | quads 8, glutes 14, hamstrings 7, chest 3, lats_upper_back 6, front_delts 7, side_delts 2, rear_delts 2, biceps 3, triceps 3.5, abs_obliques 9 | quads 8, glutes 7, hamstrings 2, lats_upper_back 2, calves 5 |
| WK3 | 16 | 2 | 10 | 20 | 15x15s / 30s = 225s work | 6/5/6/6/4 | 6/6/4/0/2 | 18 | 12/11/12/11/8 | 54 | AP_PLYO 6, AP_TRIPLE_EXT 4, RP_BKD 4, RP_BHD 2, RP_UKD 4, RP_UHD 6, RP_HPUSH 5, RP_VPUSH 2, RP_HPULL 4, CP_CORE_PELVIS 2, CORE_OTHER 9, FOCUS 6 | quads 8, glutes 14, hamstrings 7, chest 5, lats_upper_back 4, front_delts 7, side_delts 1, rear_delts 2, biceps 2, triceps 3.5, abs_obliques 11 | quads 8, glutes 7, hamstrings 2, lats_upper_back 2, calves 5 |
| WK4 | 17 | 3 | 6 | 18 | 10x20s / 40s = 200s work | 6/5/6/6/4 | 9/6/6/0/3 | 24 | 18/12/18/15/12 | 75 | AP_PLYO 6, AP_TRIPLE_EXT 6, RP_BKD 6, RP_BHD 3, RP_UKD 6, RP_UHD 9, RP_HPUSH 3, RP_VPUSH 6, RP_HPULL 6, RP_VPULL 3, CORE_OTHER 12, FOCUS 9 | quads 12, glutes 21, hamstrings 10.5, chest 3, lats_upper_back 9, front_delts 9, side_delts 3, rear_delts 3, biceps 4.5, triceps 4.5, abs_obliques 12 | quads 9, glutes 9, hamstrings 3, lats_upper_back 3, calves 6 |
| WK5 | 18 | 3 | 8 | 24 | 12x20s / 40s = 240s work | 6/5/6/6/4 | 10/6/7/0/3 | 26 | 19/12/19/15/12 | 77 | AP_PLYO 6, AP_TRIPLE_EXT 8, RP_BKD 6, RP_BHD 3, RP_UKD 6, RP_UHD 9, RP_HPUSH 6, RP_VPUSH 3, RP_HPULL 6, CP_CORE_PELVIS 3, CORE_OTHER 12, FOCUS 9 | quads 12, glutes 21, hamstrings 10.5, chest 6, lats_upper_back 6, front_delts 9, side_delts 1.5, rear_delts 3, biceps 3, triceps 4.5, abs_obliques 15 | quads 10, glutes 11, hamstrings 4, lats_upper_back 4, calves 7 |
| WK6 | 19 | 3 | 10 | 30 | 15x20s / 40s = 300s work | 6/5/6/6/4 | 8/6/5/0/3 | 22 | 17/12/17/15/12 | 73 | AP_PLYO 6, AP_TRIPLE_EXT 4, RP_BKD 6, RP_BHD 3, RP_UKD 6, RP_UHD 9, RP_HPUSH 3, RP_VPUSH 6, RP_HPULL 6, RP_VPULL 3, CORE_OTHER 12, FOCUS 9 | quads 12, glutes 21, hamstrings 10.5, chest 3, lats_upper_back 9, front_delts 9, side_delts 3, rear_delts 3, biceps 4.5, triceps 4.5, abs_obliques 12 | quads 8, glutes 7, hamstrings 2, lats_upper_back 2, calves 5 |
| WK7 | 20 | 4 | 6 | 24 | 5x30s / 120s = 150s work | 6/5/6/6/4 | 10/8/6/0/4 | 28 | 22/15/22/19/16 | 94 | AP_PLYO 6, AP_TRIPLE_EXT 4, RP_BKD 8, RP_BHD 4, RP_UKD 8, RP_UHD 12, RP_HPUSH 8, RP_VPUSH 4, RP_HPULL 8, CP_CORE_PELVIS 4, CORE_OTHER 16, FOCUS 12 | quads 16, glutes 28, hamstrings 14, chest 8, lats_upper_back 8, front_delts 12, side_delts 2, rear_delts 4, biceps 4, triceps 6, abs_obliques 20 | quads 8, glutes 7, hamstrings 2, lats_upper_back 2, calves 5 |
| WK8 | 20 | 4 | 8 | 32 | 10x30s / 120s = 300s work | 6/5/6/6/4 | 10/8/6/0/4 | 28 | 22/15/22/19/16 | 94 | AP_PLYO 6, AP_TRIPLE_EXT 4, RP_BKD 8, RP_BHD 4, RP_UKD 8, RP_UHD 12, RP_HPUSH 4, RP_VPUSH 8, RP_HPULL 8, RP_VPULL 4, CORE_OTHER 16, FOCUS 12 | quads 16, glutes 28, hamstrings 14, chest 4, lats_upper_back 12, front_delts 12, side_delts 4, rear_delts 4, biceps 6, triceps 6, abs_obliques 16 | quads 8, glutes 7, hamstrings 2, lats_upper_back 2, calves 5 |

**Progression:**
* **3-week micro-waves:** reps 6 -> 8 -> 10 at constant sets, then +1 set and reset to 6. Strength reps per exercise 12,16,20 | 18,24,30 | 24,32 compound at **+15%/week**; sets compound at +10.4%/week.
* AMRAP 12 -> 15 -> 16 -> ... -> 20 (+1 per week after week 2).
* Sprint work 150, 180, 225 | 200, 240, 300 | 150, 300 s: density rises inside each block, then interval length rises with the rest ratio going 1:2 -> 1:4.
* Assumed weekly sets 54, 54, 54, 75, 77, 73, 94, 94.

---

## 3. '(NOT DONE) EXAMPLE CONJUGATE' (tab 12): the earlier draft of STRENGTH-8

**Identity (OBSERVED)**:
* A1 'UNDER CONSTRUCTION' (yellow), A2 'CONJUGATE SPLIT', F2 '8 WEEK CYCLE' (red font), J3 'TEST' (cyan, above WK6; unexplained).
* A4 'Basic Instruction:', A5 '*Always leave 1 rep in the tank, never work up to failure but get as close as you can ', A6 IG note.
* Same 4 days and 4-slot labels as STRENGTH-8 (M13:M28). Only the pink (E9:L9) and blue (E10:L10) reps ladders exist; **no sets ladder**.

| Day | Order | Slot label (col M, verbatim) | Canonical bucket(s) | Exercise by week (verbatim) [bucket] | Sets (col B) | Reps (col C) | Load (col D) | Notes |
|---|---|---|---|---|---|---|---|---|
| MONDAY | 1 | 'the work' | RP_BHD, RP_BKD | wk1 'HEAVY FRONT SQUAT (D)BOX SQUAT ' [RP_BKD]; wk2 'HEAVY DEFICIT DEADLIFT' [RP_BHD]; wk3 'HEAVY (D)BOX HIGH BAR SQUAT' [RP_BKD]; wk4 'HEAVY CHAINED DEADLIFT' [RP_BHD]; wk5 'HEAVY FRONT SQUAT ' [RP_BKD]; wk6 'HEAVY DEADLIFT' [RP_BHD]; wk7 'HEAVY HIGH BAR SQUAT' [RP_BKD]; wk8 'TEST' [TEST] | 5 (B cell green B6D7A8) | 'SEE' pink row: 5,4,3,2,1,3,2,1 | '1RIR' |  |
| MONDAY | 2 | 'the accessory' | RP_BHD, RP_BKD | wk1 'SNATCH GRIP DL' [RP_BHD]; wk2 'F. SQUAT (T&G)BOX' [RP_BKD]; wk3 'SNATCH GRIP DL' [RP_BHD]; wk4 '(T&G)BOX HIGH BAR SQUAT' [RP_BKD]; wk5 'SNATCH GRIP DL' [RP_BHD]; wk6 'HIGH BAR SQUAT' [RP_BKD]; wk7 'DEADLIFT' [RP_BHD] | 4 | 6 | '2RIR' |  |
| MONDAY | 3 | 'the nuance' | RP_HPULL, RP_VPULL | wk1 'PULL UPS' [RP_VPULL]; wk2 'DB ROWS 8/8' [RP_HPULL]; wk3 'PULL UPS' [RP_VPULL]; wk4 'DB ROWS 8/8' [RP_HPULL]; wk5 'PULL UPS' [RP_VPULL]; wk6 'DB ROWS 8/8' [RP_HPULL]; wk7 'PULL UPS' [RP_VPULL] | 4 | 8 | 'MAX' |  |
| MONDAY | 4 | 'the survival' | RP_UHD, RP_UKD | wk1 'RFE LUNGES' [RP_UKD]; wk2 'STAGGERED STANCE DL' [RP_UHD]; wk3 'FFE LUNGES' [RP_UKD]; wk4 'STAGGERED STANCE DL' [RP_UHD]; wk5 'REVERSE LUNGES' [RP_UKD]; wk6 'STAGGERED STANCE DL' [RP_UHD]; wk7 'FFE & RFE SPLIT SQTS.' [RP_UKD] | 2 | 8/8 | 'ALL' |  |
| WEDNESDAY | 1 | 'the work' | RP_HPUSH, RP_VPUSH | wk1 'HEAVY BENCH PRESS' [RP_HPUSH]; wk2 'HEAVY OH PRESS' [RP_VPUSH]; wk3 'HEAVY BENCH PRESS' [RP_HPUSH]; wk4 'HEAVY OH PRESS' [RP_VPUSH]; wk5 'HEAVY BENCH PRESS' [RP_HPUSH]; wk6 'HEAVY OH PRESS' [RP_VPUSH]; wk7 'HEAVY BENCH PRESS' [RP_HPUSH]; wk8 'TEST' [TEST] | 5 (B cell green B6D7A8) | 'SEE' pink row: 5,4,3,2,1,3,2,1 | '1RIR' |  |
| WEDNESDAY | 2 | 'the accessory' | RP_HPULL, RP_VPULL | wk1 'BENT OVER ROW' [RP_HPULL]; wk2 'CLOSE GRIP PULL UPS' [RP_VPULL]; wk3 'SEAL ROWS' [RP_HPULL]; wk4 'BENT OVER ROWS' [RP_HPULL]; wk5 'PRONATED PULL UPS' [RP_VPULL]; wk6 'SEAL ROWS' [RP_HPULL]; wk7 'PRONATED PULL UPS' [RP_VPULL] | 4 | 6 | '2RIR' |  |
| WEDNESDAY | 3 | 'the nuance' | RP_HPUSH | wk1 'ALT INCLINE DB BENCH' [RP_HPUSH]; wk2 'ALT INCLINE DB BENCH' [RP_HPUSH]; wk3 'ALT INCLINE DB BENCH' [RP_HPUSH]; wk4 'ALT INCLINE DB BENCH' [RP_HPUSH]; wk5 'ALT INCLINE DB BENCH' [RP_HPUSH]; wk6 'ALT INCLINE DB BENCH' [RP_HPUSH]; wk7 'ALT INCLINE DB BENCH' [RP_HPUSH] | 4 | 10 | 'MAX' |  |
| WEDNESDAY | 4 | 'the survival' | ISO_BICEP | wk1 'BICEP CURLS' [ISO_BICEP]; wk2 'BICEP CURLS' [ISO_BICEP]; wk3 'BICEP CURLS' [ISO_BICEP]; wk4 'BICEP CURLS' [ISO_BICEP]; wk5 'BICEP CURLS' [ISO_BICEP]; wk6 'BICEP CURLS' [ISO_BICEP]; wk7 'BICEP CURLS' [ISO_BICEP] | 3 | 8/8 | 'ALL' |  |
| THURSDAY | 1 | 'the work' | AP_PLYO | wk1 'WEIGHTED DEPTH DROP' [AP_PLYO]; wk2 'DEPTH DROP & JUMP' [AP_PLYO]; wk3 'HIGH SQUAT JUMPS' [AP_PLYO]; wk4 'REPEAT HIGH JUMPS' [AP_PLYO]; wk5 'WEIGHTED DEPTH DROP' [AP_PLYO]; wk6 'DEPTH DROP & JUMP' [AP_PLYO]; wk7 'REPEAT HIGH JUMPS' [AP_PLYO]; wk8 'DELOAD' [DELOAD] | 3 | 6 | 'EASY' |  |
| THURSDAY | 2 | 'the accessory' | RP_BHD, RP_BKD | wk1 'FAST FRONT SQUATS (D) BOX' [RP_BKD]; wk2 'FAST BANDED DL ' [RP_BHD]; wk3 'FAST HIGH BAR (D)BOX' [RP_BKD]; wk4 'FAST CHAINED DL' [RP_BHD]; wk5 'FAST FRONT SQUAT' [RP_BKD]; wk6 'FAST DEADLIFT' [RP_BHD]; wk7 'FAST HIGH BAR SQUAT' [RP_BKD] | 5 | 'SEE' blue row: 3,3,2,1,3,2,1,1 | '1RIR' |  |
| THURSDAY | 3 | 'the nuance' | RP_HPULL, RP_VPULL | wk1 'PULL UPS' [RP_VPULL]; wk2 'DB ROWS 8/8' [RP_HPULL]; wk3 'PULL UPS' [RP_VPULL]; wk4 'DB ROWS 8/8' [RP_HPULL]; wk5 'PULL UPS' [RP_VPULL]; wk6 'DB ROWS 8/8' [RP_HPULL]; wk7 'PULL UPS' [RP_VPULL] | 4 | 6 | '2RIR' |  |
| THURSDAY | 4 | 'the survival' | RP_UHD, RP_UKD | wk1 'RFE LUNGES' [RP_UKD]; wk2 'STAGGERED STANCE DL' [RP_UHD]; wk3 'FFE LUNGES' [RP_UKD]; wk4 'STAGGERED STANCE DL' [RP_UHD]; wk5 'REVERSE LUNGES' [RP_UKD]; wk6 'STAGGERED STANCE DL' [RP_UHD]; wk7 'FFE & RFE SPLIT SQTS.' [RP_UKD] | 4 | 10 | 'MAX' |  |
| SATURDAY | 1 | 'the work' | RP_HPUSH, RP_VPUSH | wk1 'FAST BANDED BENCH PRESS' [RP_HPUSH]; wk2 'FAST DB OH PRESS' [RP_VPUSH]; wk3 'FAST BANDED BENCH PRESS' [RP_HPUSH]; wk4 'FAST BB OH PRESS' [RP_VPUSH]; wk5 'FAST BANDED BENCH PRESS' [RP_HPUSH]; wk6 'FAST DB OH PRESS' [RP_VPUSH]; wk7 'FAST BENCH PRESS' [RP_HPUSH]; wk8 'DELOAD' [DELOAD] | 5 | 'SEE' blue row: 3,3,2,1,3,2,1,1 | '1RIR' |  |
| SATURDAY | 2 | 'the accessory' | RP_HPULL, RP_VPULL | wk1 'BENT OVER ROW' [RP_HPULL]; wk2 'CLOSE GRIP PULL UPS' [RP_VPULL]; wk3 'SEAL ROWS' [RP_HPULL]; wk4 'BENT OVER ROWS' [RP_HPULL]; wk5 'PRONATED PULL UPS' [RP_VPULL]; wk6 'SEAL ROWS' [RP_HPULL]; wk7 'PRONATED PULL UPS' [RP_VPULL] | 4 | 6 | '2RIR' |  |
| SATURDAY | 3 | 'the nuance' | RP_HPUSH | wk1 'ALT INCLINE DB BENCH' [RP_HPUSH]; wk2 'ALT INCLINE DB BENCH' [RP_HPUSH]; wk3 'ALT INCLINE DB BENCH' [RP_HPUSH]; wk4 'ALT INCLINE DB BENCH' [RP_HPUSH]; wk5 'ALT INCLINE DB BENCH' [RP_HPUSH]; wk6 'ALT INCLINE DB BENCH' [RP_HPUSH]; wk7 'ALT INCLINE DB BENCH' [RP_HPUSH] | 4 | 10 | 'MAX' |  |
| SATURDAY | 4 | 'the survival' | (empty) | - | - | - | - | M-label present, no exercise in left block |

**Differences vs the 4-TRACKS STRENGTH-8 block (OBSERVED):**

| Item | CONJUGATE (tab 12) | 4 TRACKS STRENGTH-8 (tab 04) |
|---|---|---|
| Sets ladder | none | E4:L4 green 5,5,4,4,3,3,2,1 + green B9/B13/B17/B21 |
| Mon accessory sets | B14 = 4 | B10 = 3 |
| Mon accessory wk3/wk5 | 'SNATCH GRIP DL' | 'DEF. DL or SNATCH GRIP' |
| Wed M.E. rotation | 'HEAVY BENCH PRESS' / 'HEAVY OH PRESS' alternating | 'HEAVY BENCH PRESS' / 'HIGH INCLINE PRESS' (wk2, wk4) / 'HEAVY OH PRESS' (wk6) |
| Wed accessory sets | B18 = 4 | B14 = 3 |
| Thu D.E. wk4 | 'FAST CHAINED DL' | 'FAST BANDED DL' |
| Sat D.E. sets | B25 = 5 | B21 = 3 (green) |
| Sat D.E. wk4 | 'FAST BB OH PRESS' | 'PUSH PRESS' |
| FCE5CD shading | WK1 column only | WK1-WK5 |
| Weekly working sets (wk1-7) | **60** | **56** (-6.7%) |

| Week | Exercises per session MON/WED/THU/SAT | Sets per session | Weekly sets | Weekly sets by bucket | Hypertrophy sets by muscle | Athletic exposure |
|---|---|---|---|---|---|---|
| WK1 | 4/4/4/3 | 15/16/16/13 | 60 | AP_PLYO 3, RP_BKD 10, RP_BHD 4, RP_UKD 6, RP_HPUSH 18, RP_HPULL 8, RP_VPULL 8, ISO_BICEP 3 | quads 16, glutes 15, hamstrings 4, chest 18, lats_upper_back 16, front_delts 18, rear_delts 4, biceps 11, triceps 9 | quads 3, glutes 1.5, calves 1.5 |
| WK2 | 4/4/4/3 | 15/16/16/13 | 60 | AP_PLYO 3, RP_BKD 4, RP_BHD 10, RP_UHD 6, RP_HPUSH 8, RP_VPUSH 10, RP_HPULL 8, RP_VPULL 8, ISO_BICEP 3 | quads 4, glutes 18, hamstrings 16, chest 8, lats_upper_back 16, front_delts 18, side_delts 5, rear_delts 4, biceps 11, triceps 9 | quads 3, glutes 1.5, calves 1.5 |
| WK3 | 4/4/4/3 | 15/16/16/13 | 60 | AP_PLYO 3, RP_BKD 10, RP_BHD 4, RP_UKD 6, RP_HPUSH 18, RP_HPULL 8, RP_VPULL 8, ISO_BICEP 3 | quads 16, glutes 15, hamstrings 4, chest 18, lats_upper_back 16, front_delts 18, rear_delts 4, biceps 11, triceps 9 | quads 3, glutes 1.5, calves 1.5 |
| WK4 | 4/4/4/3 | 15/16/16/13 | 60 | AP_PLYO 3, RP_BKD 4, RP_BHD 10, RP_UHD 6, RP_HPUSH 8, RP_VPUSH 10, RP_HPULL 16, ISO_BICEP 3 | quads 4, glutes 18, hamstrings 16, chest 8, lats_upper_back 16, front_delts 18, side_delts 5, rear_delts 8, biceps 11, triceps 9 | quads 3, glutes 1.5, calves 1.5 |
| WK5 | 4/4/4/3 | 15/16/16/13 | 60 | AP_PLYO 3, RP_BKD 10, RP_BHD 4, RP_UKD 6, RP_HPUSH 18, RP_VPULL 16, ISO_BICEP 3 | quads 16, glutes 15, hamstrings 4, chest 18, lats_upper_back 16, front_delts 18, biceps 11, triceps 9 | quads 3, glutes 1.5, calves 1.5 |
| WK6 | 4/4/4/3 | 15/16/16/13 | 60 | AP_PLYO 3, RP_BKD 4, RP_BHD 10, RP_UHD 6, RP_HPUSH 8, RP_VPUSH 10, RP_HPULL 16, ISO_BICEP 3 | quads 4, glutes 18, hamstrings 16, chest 8, lats_upper_back 16, front_delts 18, side_delts 5, rear_delts 8, biceps 11, triceps 9 | quads 3, glutes 1.5, calves 1.5 |
| WK7 | 4/4/4/3 | 15/16/16/13 | 60 | AP_PLYO 3, RP_BKD 10, RP_BHD 4, RP_UKD 6, RP_HPUSH 18, RP_VPULL 16, ISO_BICEP 3 | quads 16, glutes 15, hamstrings 4, chest 18, lats_upper_back 16, front_delts 18, biceps 11, triceps 9 | quads 3, glutes 1.5, calves 1.5 |
| WK8 | 1/1/1/1 | 5/5/0/0 | 10 | RP_BKD 5, RP_HPUSH 5 | quads 5, glutes 2.5, chest 5, front_delts 5, triceps 2.5 | 0 |

*INFERRED*: tab 12 is the template, and tab 04 is the product version that was refined in use. The refinements are fewer accessory sets, a sets ladder that cuts M.E. volume as intensity rises, a 'HIGH INCLINE' mid-range press added to the upper M.E. rotation, and the D.E. bench cut to 3 sets.

---

## 4. Cross-tab synthesis: how the coach builds 8- and 12-week plans

### 4.1 Plan lengths and where the deload or test goes (OBSERVED)
| Program | Length | Deload / test placement |
|---|---|---|
| CrossFit macro | 12 months = 3 blocks of ~4 months (~17 weeks) | TEST/PEAK in the last month of each block; event month strips the lifting |
| CrossFit class | 8 weeks | strength/power level stairs 1->4, **WK8 = 1RM test** |
| STRENGTH-8 / CONJUGATE | 8 weeks | 7 loading weeks, **WK8 = 'TEST' (M.E.) + 'DELOAD' (D.E.)** |
| AESTHETICS-8 | 8 weeks | 7 loading weeks, **WK8 'DELOAD WEEK'** |
| HYBRID-8 | 8 weeks | no deload written; 3+3+2-week waves |
| STRENGTH-12 | 12 weeks | 6-week wave, **WK7 'MID DELOAD'**, 5-week wave peaking at RPE 10 |
| AESTHETICS-12 | 12 weeks | 6 weeks, **WK7 'A WEEK LOWER'** (deload), 5 weeks with a new phase from WK9, peak sets at WK12 |

**Generator rule (*INFERRED*):**
* 8-week plan = 7 progressive weeks + deload/test in week 8.
* 12-week plan = 6 progressive weeks + deload in week 7 + 5 progressive weeks (phase change, intensification techniques, final week is the peak).
* 6-week plan (not shown in these tabs) = probably the first 6 weeks of the 12-week structure, ending at the wave peak (the WK6 column is the highlighted FFF2CC one).

### 4.2 Waves inside the block (OBSERVED)
* **2-week steps:** STRENGTH-12 % 80,80 | 85,85 | 90,90; sets 4,4 | 5,5 | 6,6. CrossFit class level codes step every week but alternate tracks.
* **3-week rep waves:** AESTHETICS-8 12/10/8; HYBRID 6/8/10; CONJUGATE 5/4/3 then 2/1 and 3/2/1.
* **Monthly steps:** CrossFit macro levels.
* **A/B weeks:** STRENGTH-12, AESTHETICS-12, STRENGTH-8 (KD week / HD week). These alternate **exercise variants or dominance**, not volume.

### 4.3 How volume progresses (computed)
| Program | Volume lever | Start -> end | Weekly compounded rate |
|---|---|---|---|
| CrossFit FULL TIME strength | +1 set per level per month | 3 -> 6 sets/slot | about +26%/month = about +5.5%/week |
| CrossFit HALF TIME / class | reps down, sets fixed | 21 -> 12 reps/lift | intensification only |
| STRENGTH-12 'the work' | sets 4 -> 7, reps 5 -> 2 | 16 -> 28 work sets/week | **+5.2%/week**; session totals +6.7-7.7% per step |
| AESTHETICS-12 | sets per exercise 3 -> 5 | 96 -> 148 weekly sets | **+4.75%/week** |
| AESTHETICS-8 | sets per exercise 2 -> 5 | 38 -> 95 | +16.5%/week (front-loaded from a low start) |
| HYBRID-8 | sets 2 -> 4, reps wave | 12 -> 32 reps/lift | +10.4%/week sets, +15%/week reps |
| CONJUGATE / STRENGTH-8 | sets flat or falling, reps falling | 56-60 flat (50 with ladder) | volume traded for intensity |

The two 12-week products sit almost exactly on the coach's verbal "3/5/7% per week" rule. The 8-week ones step in whole sets (+1 set per exercise every 2-3 weeks). The "%" rule is the long-run average of whole-set steps.

### 4.4 Weekly sets per muscle vs the coach's 15-20 target (mean of loading weeks, hypertrophy credit only)
| Program (mean weeks) | quads | glutes | hams | chest | lats/upper back | front delts | side delts | rear delts | biceps | triceps | calves | abs |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| CONJUGATE v04 (wk1-7, as written) | 10.4 | 15.5 | 8.6 | 12.6 | 15.0 | 16.0 | 1.7 | 3.7 | 10.5 | 8.0 | 0 | 0 |
| CONJUGATE v12 (wk1-7) | 10.9 | 16.3 | 9.1 | 13.7 | 16.0 | 18.0 | 2.1 | 4.0 | 11.0 | 9.0 | 0 | 0 |
| STRENGTH-12 (wk1-12, accessory 3 assumed) | 14.2 | 18.6 | 14.5 | 13.7 | 6.0 | 10.7 | 1.5 | 1.5 | 4.5 | 11.3 | 0 | 0 |
| AESTHETICS-8 (wk1-7) | 13.7 | 24.0 | 13.7 | 6.9 | 13.7 | 9.4 | 5.6 | 3.4 | 6.9 | 4.7 | 0 | 0 |
| AESTHETICS-12 (wk1-12, incl. supersets) | 25.3 | 26.2 | 12.9 | 22.5 | 25.2 | 13.6 | 9.1 | 10.3 | 16.5 | 25.1 | 0 | 0 |
| HYBRID-8 (wk1-8, assumed) | 11.5 | 20.1 | 10.1 | 4.6 | 7.2 | 9.0 | 2.2 | 2.9 | 3.6 | 4.5 | 0 | 13.2 |
| CrossFit JULY (peak strength month, 3-ex resistance assumed) | 15.0 | 21.0 | 15.0 | 6.0 | 12.0 | 12.0 | 6.0 | 3.0 | 7.5 | 7.5 | 0 | 0 |
| CrossFit class (wk1-7) | 3.0 | 4.5 | 3.0 | 0 | 0 | 3.0 | 1.5 | 0 | 0 | 1.5 | 0 | 0 |

*INFERRED* readings:
* Only the bodybuilding 12-week track lives at or above 15-20 sets for most muscles (20-35). The strength and hybrid tracks keep big lower-body muscles near 10-20 and let small muscles drop well below 10. This matches the coach's "more sets for the muscle you want to grow" and "athletes need different things".
* No program in these three tabs trains calves.
* Side and rear delts are consistently the lowest muscles outside AESTHETICS-12.

### 4.5 Slot grammar common to all three tabs (OBSERVED, *INFERRED* generalisation)
1. **Big compound first, then the opposite pattern, then unilateral, then isolation.** STRENGTH: 'the work' -> 'the accessory' -> 'the nuance' -> 'the survival'. HYBRID: STRENGTH -> OLY -> UNI tri-set -> ACCESORY. AESTHETICS-8: bilateral KD+HD -> UKD -> UHD -> ACCESSORIES.
2. **Bilateral and unilateral of opposite dominance pair up** (squat with SL/staggered hinge; hinge with lunge). STRENGTH-12 and HYBRID do this. STRENGTH-8 pairs the unilateral with the **same** dominance instead (version difference).
3. **Every upper session pairs a push with a pull.** The plane alternates weekly (vertical pull with horizontal push and vice-versa) in AESTHETICS-8 and STRENGTH-12.
4. **Isolation goes last and gets the highest effort** ('MAX', 'ALL', 'MYO', supersets to max reps). Compounds keep 1-2 RIR / RPE 7-9.
5. **Athletic work goes first in the session** (plyo 'the work' before D.E. squat), **or on its own day / non-squat day** (HYBRID jumps Tue/Fri). Olympic lifts get their own row and alternate clean/snatch.
6. **Conditioning is one high-intensity and one low-intensity type per week minimum**, scaled by level (CrossFit) or by 3-week waves (HYBRID).
7. **Core is integrated** (tri-sets, bench pairing, T2B skill) rather than given its own block, except in the CrossFit SKILL row.

### 4.6a Rep ranges: big vs small muscles (OBSERVED values)
| Slot type | CrossFit | CONJUGATE / STRENGTH-8 | STRENGTH-12 | AESTHETICS-8 | AESTHETICS-12 | HYBRID |
|---|---|---|---|---|---|---|
| Main bilateral compound (RP_BKD/BHD/HPUSH/VPUSH) | 7->4 (FT), 7->4 + 1RM (HT) | M.E. 5,4,3,2,1,3,2,1; D.E. 3,3,2,1,3,2,1,1 | 5->2 @ 80-90% / RPE 7-10 | 12/10/8 waves @ 1-2 RIR | pyramids 12/10/8 -> 15/12/10/8 -> 15/15/12/12/12 | 6/8/10 waves; bench 6->10 |
| Secondary compound (opposite pattern / pull) | - | 6 @ '2RIR' | unset | same as main | same as main | rows: row-78 sets, reps unset |
| Unilateral (RP_UKD/UHD) | ('LB' 10) | '8/8' per side @ 'ALL' or 10 @ 'MAX' | 3x8 | 12/10/8 | same header | header reps (6-10) in tri-sets |
| Small-muscle isolation | ('UB' 10) | 'BICEP CURLS' 3x'8/8' @ 'ALL' | 3x8 (LEG EXT/CURLS, SIDE RAISES, CURLS, CABLE FLIES, JM PRESS); **'TATE PRESS' 3x20** | inside 'ACCESSORIES' | header reps; '-20' / '-12' tails; MYO '15-5-5-5-5-5'; supersets to 'max' | inside accessories |
| Olympic / power | 3 (FT) / 4->1 (HT) | - | - | - | - | 1-5 'heavy' |
| Plyo | - | 6 'EASY' | - | - | - | unset |

* The coach's "smaller muscles take more reps" appears here as the 3x20 'TATE PRESS', the '-20' tails, and myo/max-rep supersets. In the strength tracks small muscles otherwise get 8 reps but the **highest effort** ('ALL', 'MAX'). The compensation for not going heavy is effort, not only reps.
* Big muscles get the mix: low reps on the main lift, 6-10 on the secondary lift, 8-15 on unilateral and pump work. This is the 5-30 rep spread the coach describes.
* **No rest periods and no tempo are written anywhere in these three tabs.** The only intensity anchors are %, RPE, RIR, 'MAX', 'ALL', 'EASY' and 'FAST'.

### 4.6 Level -> dose map for the generator (CrossFit tab, OBSERVED; extend by analogy)
```
STRENGTH  FULL_TIME: L1 3x7, L2 4x6, L3 5x5, L4 6x4            (total reps 21-25, sets +1/level)
          HALF_TIME: L1 3x7, L2 3x6, L3 3x5, L4 3x4, L5 1RM      (sets fixed, reps -1/level)
POWER     FULL_TIME: L1 3x3, L2 4x3, L3 5x3, L4 6x3
          HALF_TIME: L1 3x4, L2 3x3, L3 3x2, L4 3x1
RESISTANCE (both):   L1 2x10, L2 3x10
AEROBIC   (both):    L1 C, L2 C+B, L3 C+B+A, L4 lactate clearance  (sessions 2,2,3,4 in the grids)
WODS      (both):    L1..L4 = 1..4 per week
```

---

## 5. What these tabs reveal about the coach's thinking (*INFERRED*, flagged)
1. **Quality x level x time is the master abstraction.** Exercises are filled in last. A program is: pick qualities for the goal, sequence them across months, give each a level, and look up the dose. This lets one engine produce CrossFit, strength, bodybuilding and hybrid plans.
2. **Hypertrophy -> strength -> power -> test is the default sequence** within any block that has a peak. Conditioning ramps alongside and peaks with the test.
3. **Two progression philosophies chosen by population:** volume progression (add sets) for full-time / advanced / aesthetics clients, and intensification (cut reps, test) for part-time / class clients and in the conjugate strength cycles.
4. **Effort is distributed by exercise complexity:** heavy compounds stay 1-2 RIR / RPE 7-9 ("leave 1 rep in the tank"); isolations go to 'MAX'/'ALL'. This is Israetel-like fatigue management written in the coach's own words.
5. **Balance is enforced structurally:** every lower session gets KD + HD, every upper session gets push + pull, and bilateral pairs with unilateral of the opposite dominance. Variety comes from rotating variants (A/B weeks, contra/ipsi loading, FFE/RFE) while patterns stay fixed. That is the Pat Davidson "same pattern, different position/variable" idea.
6. **Deloads are scheduled, not reactive:** week 8 of 8, week 7 of 12. Tests are built in.
7. **The products are templates the coach then adjusts per client** ('This is what I sell online ... and coach them through it dependent on their goals'). Many cells are deliberately loose ('ACCESSORIES', 'UPPER ACCESORY', blank accessory doses, box-prescribed WODs), and the generator needs rules to fill them.

## 6. Open questions for the coach
See the `open_questions` list returned with this analysis. They are repeated here:

1. FULL TIME vs HALF TIME (CROSSFIT A19 / Q19): is FULL TIME the full-time competitor's dosing and HALF TIME the class / part-time member's dosing? I read it that way because only HALF TIME has 'LVL 5 = Work up to 1RM' and the class cycle ends in '5'. Or does HALF TIME mean a quality trained alongside another one?
2. Class cycle S4:S11 shows '1/1','2/1','2/2','3/2','3/3','4/3','4/4','5' (Sheets stored them as dates). Is that 'strength level / power level' for weeks 1-8, with strength leading by one week?
3. 'LVL 4 = wods a week' has no number. Is it 4? Also AUG is WODs level 3 ('3 wods a week') but the AUGUST grid has only TUESD/FRID marked. Which is right?
4. MARCH lists STRENGTH (KNEE DOM/PULL/HIP DOM/PUSH) and POWER (SNATCH/CLEAN) days, and APRIL lists RESISTANCE (LB/UB), but the macro gives them no level. Should they be trained, and at what level, or are they leftovers?
5. CrossFit RESISTANCE 'LB'/'UB': how many exercises per session, and which patterns (unilateral + isolation like 'the nuance'/'the survival')? The same question applies to 'ACCESSORIES' (AESTHETICS-8) and 'UPPER ACCESORY'/'LOWER ACCESORY' (HYBRID).
6. CrossFit strength 'PULL' and 'PUSH' days: vertical, horizontal, or alternating? The class split says 'PRESS'. Does that mean strict overhead press?
7. Load words in the conjugate cycle: is 'MAX' = the heaviest load for the prescribed reps at about 0-1 RIR, 'ALL' = all-out / to failure, and 'EASY' (plyos) = sub-maximal height and effort?
8. Green SETS ladder E4:L4 (5,5,4,4,3,3,2,1) in 4 TRACKS: does it apply only to the M.E. rows (B9/B13 = 5), or also to the plyo (B17 = 3) and D.E. bench (B21 = 3) rows that share the green fill?
9. STRENGTH-12 'the accessory' has no sets/reps. What dose (e.g. 3x6-8 @ 2RIR as in the 8-week version)? Do the Thursday/Saturday 'FAST RPE6 or about 60-70%' rows use the header SETS/REPS?
10. Unilateral pairing rule: STRENGTH-8 pairs lunges with squat weeks (same dominance), but STRENGTH-12 and HYBRID pair them with the opposite dominance (squat -> staggered DL / uni RDL). Which is your rule, or does it depend on the goal?
11. AESTHETICS-12 reps such as '12/10/8 -20' or '8/8/8-12': is the '-20' an extra burn-out/back-off set, or the rep target for isolation (small-muscle) exercises? Weeks 4-6 say SETS 4 but list only three numbers before the dash.
12. HYBRID: what does the 'AMRAP' row (12,15,16,...,20) apply to? I read it as minutes for the Saturday lunge/T2B/push-pull circuit. What are the unlabeled rows 78 (2,2,2,3,3,3,4,4) and 79 (2,2,3,2,2,3,2,2)?
13. HYBRID lists STRENGTH before OLY/POWER on Monday/Thursday. Is the heavy lift really done before the Olympic lift? And is C86 'KD' on the deadlift row a typo for HD?
14. The tab is named '4 TRACKS' but A1 says '8 WEEKS OF 3 TRACKS'. What is the 4th track (CrossFit / athletic)? Is the right-hand 12-week block the newer version of each track?
15. Definitions: is 'the nuance' = unilateral / variation / weak-point work and 'the survival' = isolation / joint-health / pump work that must be done no matter what?
16. None of these three tabs programs calves, and side/rear delts get under 5 sets/week outside AESTHETICS-12. Is that intentional (covered by FOCUS / accessories) or a gap the generator should fill?
17. Is the 12-week shape (6 loading weeks + week-7 deload + 5 weeks with a phase change) the template for every 12-week plan? Should a 6-week plan be the first 6 weeks, ending at the highlighted WK6 peak?
18. Fills: what do FCE5CD peach on weeks 1-5 of the STRENGTH 8-week block, FFF2CC on WK6 and 00FF00 on 'LOW BAR' in the 12-week block, and the cyan 'TEST' at J3 above WK6 in the conjugate tab mean? Are they progress markers or a planned week-6 test?
19. '30-40 mi slow/steady CARDIO': does 'mi' mean minutes? Is that the 'C' aerobic type from the cheat sheet?
