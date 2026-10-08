# MASTER_MODEL program decode: 'EXAMPLE ATHLETIC FULL BODY SPLI' + 'EXAMPLE BOXING 8 WEEK BUILD UP'

Sources: `dumps/MASTER_MODEL/05_EXAMPLE_ATHLETIC_FULL_BODY_SPLI.txt` and `07_EXAMPLE_BOXING_8_WEEK_BUILD_UP.txt` (row- and column-major), checked against `raw/MASTER_MODEL.xlsx` for number formats, fonts and sheet visibility. Cross-references: '(NOT DONE) ALL ABOUT BALLISTICS' (target of every `*MEDBALLS` hyperlink), 'AEROBIC CAPACITY CHEAT SHEET', 'CONTROL PATTERNSCORE', 'ALL ABOUT SQUATS', BYOP 'MASTER EXERCISE LIBRARY', BYOP 'ATHLETIC - FULL BODY - 4 DAYS A', 'BASEBALL'. Nothing in the Google Sheets was modified.

Machine-readable companion: `prog_mm_athletic_boxing.volume.json` (same numbers, every line item with its components, buckets, muscle credits and contact counts).

**Legend.** **OBSERVED** = read directly from a cell, colour or format. *INFERRED* = analyst interpretation. Coach labels are quoted verbatim, typos included ('Symetrical', 'sesaw', 'kickbakcs', 'direclty', 'Extentions', 'againts', 'rythmic'); canonical names use correct spelling.

**Counting conventions** (used everywhere below)
* 1 working set = 1.0 to each prime mover, 0.5 to each clear synergist. Bucket defaults match the sibling `prog_byop_athletic.volume.json`: RP_BKD quads 1 / glutes 0.5; RP_UKD quads 1 / glutes 1; RP_BHD and RP_UHD glutes 1 / hamstrings 1 (glute bridges: hamstrings 0.5); RP_HPUSH chest 1 / front delts 1 / triceps 0.5; RP_VPUSH front delts 1 / chest, side delts, triceps 0.5; RP_HPULL lats-upper back 1 / rear delts, biceps 0.5; RP_VPULL lats-upper back 1 / biceps 0.5; ISO_x = 1.0 to its muscle (front raises credited to front delts); all core buckets = abs/obliques 1.0.
* Athletic (AP_*) sets are reported as **athletic exposure**, not as hypertrophy volume.
* Every movement inside a superset/complex counts its own sets. A 4-movement complex done 3 times = 3 sets in each of its buckets.
* Unilateral `12/12`, `8 & 8`, `8*8` = 1 set per round (not doubled).
* A medball `ALL LIST` / `SEE LIST` line = 1 set of each of the 19 throws in the list.
* **Working sets** = every non-throw, non-conditioning movement set (RP + ISO + core + AP except AP_THROW). Throws are counted separately (sets and reps). Conditioning is counted in rounds/minutes.
* **Ground contacts**: 1 jump/hop/landing rep = 1 contact; per-leg reps are summed. Tiers: **high** = depth jumps/drops, box/high/tuck/broad/squat/lunge/step-up/march/hex-bar/DB jumps; **low** = squirrel jumps, plate jumps, small hops, high-knee reps inside a complex; **time-based** = drills prescribed by time, ESTIMATED (High Knee Runs 3.5 contacts/s, jump rope 2 contacts/s) and kept out of the totals; **upper** = plyo push-up hand contacts.

---

## 0. Key numbers

| | ATH STARTING | ATH MID | ATH ADVANCED | BOX wk 1-2 | BOX wk 3-8 |
|---|---|---|---|---|---|
| days/week | 3 | 4 | 4 | 4 | 4 |
| line items per session | 10 / 7 / 7 | 10 / 14 / 8 / 16 | 6 / 6 / 8 / 6 | 8 / 7 / 7 / 6 | 8 / 5 / 7 / 5 |
| movements per session excl. throws | 13 / 8 / 10 | 13 / 4 / 11 / 9 | 7 / 8 / 10 / 5 | 9 / 6 / 8 / 7 | 10 / 9 / 12 / 10 |
| working sets per session (assumed) | 35 / 24 / 30 | 21 / 10 / 25 / 16 | 14 / 19 / 17 / 9 | 24 / 18 / 20 / 18 | wk3: 30 / 24 / 36 / 23; wk8: 30 / 30 / 39 / 37 |
| working sets per week | 89 (81 as written) | 72 (71 as written) | 59 | 80 | 113 / 113 / 117 / 117 / 104 / 136 |
| resistance sets (RP+ISO) per week | 44 | 44 | 24 | 66 | 57 (wk3-6), 50 (wk7), 68 (wk8) |
| athletic sets (AP excl. throws) per week | 25 | 14 | 9 | 0 | 38-48 |
| core sets per week | 20 | 14 | 26 | 14 | 16-20 |
| medball throws per week | 210 | 400 | 420 | 190 | 380 |
| lower-body contacts per week (high + low) | 146 + 0 | 71 + 120 | 32 + 100 | 0 | 113-129 + 142-177 |

---

## 1. Identity

### 1A. 'EXAMPLE ATHLETIC FULL BODY SPLI' (visible tab)

| field | value |
|---|---|
| tab name | 'EXAMPLE ATHLETIC FULL BODY SPLI' (31-character truncation of "...SPLIT"); A1:M981; 361 non-empty cells; **visible** |
| title | A1 'ATHLETIC FULL BODY SPLIT' (bg 00FFFF cyan, bold italic) |
| instruction banner (cyan 00FFFF, A2-A7, verbatim) | 'Basic Instruction:' / '*Always leave 1 rep in the tank, never work up to failure but get as close as you can ' / "**Do steady cardio whenever you want, just don't over do it... I reccomend doing it WEDNESDAYS & SATURDAYS max 40 min of steady" / '***The lower the reps, the higher the weight... Always go for 1-3 RIR (REPS IN RESERVE) aka RPE 7+' / '****When there are joint pains, usually going unilateral or/and also getting away from fixed grips (barbells, bars) and going split grips (dumbbells, kbs, indivitual grips) help take care of some stuff' / '*****If you have any questions just ask me - IG @BLAZECAMP or TWITTER @BLAZECAMP_' |
| levels (side by side) | A9 'STARTING OFF SEASON WORKOUTS' (bg 93C47D green) in A-C; D9 ' MID OFF SEASON WORKOUTS' (bg FFD966 yellow) in D-G; H9 ' ADVANCED OFF SEASON WORKOUTS' (bg E06666 red) in H-K. These are the same green/yellow/red the coach uses for 'BEGGINER' / ' INTERMEDIATE' / ' ADVANCED' in the AEROBIC CAPACITY CHEAT SHEET (OBSERVED). |
| sessions | each 'WORKOUT' header (bg D5A6BD) starts a session; column headers 'SETS' / 'REPS' / 'EXERCISE' (/ 'VIDEO EXAMPLE') on bg 9FC5E8. Starting = 3 workouts (A10, A22, A31); Mid = 4 (D10, D22, D39, D49); Advanced = 4 (H10, H18, H26, H36). |
| days/week | 3 / 4 / 4 (*INFERRED: one 'WORKOUT' = one training day*). Cardio note implies lifting on Mon/Tue/Thu/Fri with optional steady cardio Wed and Sat (max 40 min); this matches the BYOP 'ATHLETIC - FULL BODY - 4 DAYS A WEEK' layout (Mon/Tue/Thu/Fri lifting, Wed/Sat 'Aerobic Capacity', Sun 'OFF'). |
| population / goal | off-season athletes (any field/court sport; not sport-specific). Starting-column notes (A41-A45, grey CCCCCC, verbatim): 'First 8 weeks (8wk1) adaptation focus:' / 'Bring athletes back to feeling/moving great' / 'Start ramping up volume of work at highest biomechanical demand' / 'Introduce more specific unilateral demands' / 'Drive more strength/power/speed' |
| block length | 'First 8 weeks (8wk1)' (OBSERVED for Starting). *INFERRED: Mid = 8wk2 and Advanced = 8wk3, i.e. a ~24-week off-season, with one fixed weekly template per block.* No week-by-week changes are written. |
| equipment | barbell (deadlift, snatch-grip DL, power cleans), hex bar, DBs, KB, cable and bands, boxes, plates, medballs + wall, bench, pull-up bar / lat pull-down, leg-extension and leg-curl machines, nordic anchor, load for depth jumps; three YouTube demos (G41-G43 / K12-K14). |
| authoring clue | rep cells that Google Sheets auto-converted to dates carry year 2021 (E18, E19, E44, B28, B29). *INFERRED: typed in 2021.* |

### 1B. 'EXAMPLE BOXING 8 WEEK BUILD UP' (hidden tab)

| field | value |
|---|---|
| tab name | 'EXAMPLE BOXING 8 WEEK BUILD UP'; A1:L69; 432 non-empty cells; **sheet_state = hidden** |
| title | A1 'BLAZE CAMP FIGHTER -  8 WEEK BUILD UP ' (bg 00FF00 bright green) |
| day blocks | 'MONDAY OFF SEASON WORK' (E4), 'TUESDAY OFF SEASON WORK' (E16), 'THURSDAY OFF SEASON WORK' (E28), 'FRIDAY OFF SEASON WORK' (E41), all bold = **4 days/week, Mon/Tue/Thu/Fri** (OBSERVED). Wed/Sat/Sun empty (*INFERRED: boxing practice or rest*). |
| layout (key structural finding) | each day block has headers 'Week 1' (A), 'Week 2' (B), 'SETS' (bg FFFF00 yellow), then 'REPS' (C) and an un-headed exercise column D, then 'Week 3'-'Week 8' (E-J, 'SETS'), 'REPS' (K) and 'EXERCISE' (L). **Weeks 1-2 and weeks 3-8 are two different programs sharing the same rows**: every row with Week 1-2 sets has a D exercise, every row with Week 3-8 sets has an L exercise, and rows 24, 25 and 49 have only a weeks 1-2 exercise (OBSERVED). |
| week colour ramp | SETS headers and values: wk1-2 FFFF00 (yellow), wk3-4 EA9999 (light red), wk5-7 E06666 (red), wk8 CC0000 (dark red). *INFERRED: an intensity heat map; red E06666 is also the coach's 'ADVANCED' colour.* |
| population / goal | a fighter (boxer per tab name) in the off-season: 2 weeks of bodybuilding-style base, then 6 weeks of athletic conversion with sprint conditioning (*INFERRED from content*). |
| medball list | 'MED BALL VARIATIONS' (F50, bg 6D9EEB) F51:G69 = 19 throws x 10 reps. |
| equipment | barbell (front squat, deadlift, clean pull / hang power clean, heavy squat), DBs, KB, seal-row bench, lat pull-down / pull-up bar, leg-curl and leg-extension machines, swiss ball, sliders, bands, box, step/plate (deficit calf raise), medball, jump rope, sprint space or machine, any cardio machine. |
| authoring clue | date-coerced reps (K9, K11, K23, K47) carry year 2022. *INFERRED: written about a year after the athletic tab.* |

---

## 2. Session-by-session tables

Neither tab has PURPOSE or CATEGORY columns (unlike the BYOP templates), so the "slot label" column shows the in-cell tag the coach did write (`SUPERSET:`, `HEAVY:`, `**MEDBALLS**`, `UNBROKEN`, ...). The canonical bucket is assigned from the BYOP MASTER EXERCISE LIBRARY where the exercise exists there, and otherwise from the coach's CONTROL PATTERNSCORE / ALL ABOUT BALLISTICS tabs (stated in the notes column). Rep cells shown as `[cell stored as date ...]` were typed as `6-8`, `8/8`, etc. and auto-converted by Google Sheets; the number format (`m-d` vs `m/d`) shows which separator was typed.

### 2A. ATHLETIC - STARTING

| day | order | cells | section / part label (verbatim) | in-cell tag (no PURPOSE/CATEGORY column exists) | canonical bucket(s) | exercise (verbatim) | sets | reps (verbatim) | intensity / effort | notes |
|---|---|---|---|---|---|---|---|---|---|---|
| S1 | 1 | A12:C12 | 'WORKOUT' #1 (A10) | - | AP_PLYO | Depth Jump with weight | 2 | 8 | not written (athletic: max intent / quality) | - |
| S1 | 2 | A13:C13 | 'WORKOUT' #1 (A10) | - | AP_PLYO | Depth jump with weight into high box jump | 2 | 8 | not written (athletic: max intent / quality) | - |
| S1 | 3 | A14:C14 | 'WORKOUT' #1 (A10) | - | AP_PLYO | Really high jump squats LOAD & jump hard | 2 | 8 | loaded, max intent | loaded jump squats: loaded ballistic jump; alt AP_TRIPLE_EXT |
| S1 | 4 | A15:C15 | 'WORKOUT' #1 (A10) | - | AP_SPRINT | High Knee Runs FAST | 2 | ':30 sec.' | 'FAST'/fast intent | High Knee Runs FAST: sprint-mechanics drill; contacts estimated at 3.5/s |
| S1 | 5 | A16:C16 | 'WORKOUT' #1 (A10) | HEAVY | RP_HPULL | HEAVY Single arm rotational half kneeling cable row or band row or Bird Dog Row | 3 | '12/ 12' | 'HEAVY' (in cell); sheet rule A5: 1-3 RIR / RPE 7+ (resistance) | - |
| S1 | 6 | A17:C17 | 'WORKOUT' #1 (A10) | SUPERSET / contrast (heavy -> jump) | RP_BKD + AP_PLYO | SUPERSET: HEAVY Hex bar Squats direclty into 10 Repeat Jump Squat HIGH JUMPs | 3 | '3+10' | 'HEAVY' (in cell); sheet rule A5: 1-3 RIR / RPE 7+ (resistance) | Repeat Jump Squat HIGH JUMPs: repeat (rebound) jumps |
| S1 | 7 | A18:C18 | 'WORKOUT' #1 (A10) | SUPERSET / unilateral contrast (heavy -> unloaded jump) | RP_UKD + AP_PLYO | SUPERSET: HEAVY Ipsilateral DB front foot elevated lunge directly into no weight lunge front foot jumps 8 reps each leg | 2 | '10/ 10 + 8/ 8' | 'HEAVY' (in cell); sheet rule A5: 1-3 RIR / RPE 7+ (resistance) | - |
| S1 | 8 | A19:C19 | 'WORKOUT' #1 (A10) | - | RP_VPUSH | Standing Overhead DB sesaw push presses | 3 | '12/ 12' | sheet rule A5: 1-3 RIR / RPE 7+ (resistance) | - |
| S1 | 9 | A20:C20 | 'WORKOUT' #1 (A10) | pairing (plyo -> eccentric hamstring) | AP_PLYO + ISO_HAM | Lateral mid size box step up jumps directly into nordic curls | 3 | '12 + 8' | sheet rule A5: 1-3 RIR / RPE 7+ (resistance) | nordic curls: library lists 'Nordic Curl' under 'BILATERAL HIP DOMNANT' (AP9/AN91); bucketed ISO_HAM because coach pairs it with leg extensions elsewhere |
| S1 | 10 | A21:C21 | 'WORKOUT' #1 (A10) | - | CORE_OTHER | Side Plank presses (advanced does star side plank presses) | 5 | ':30 sec./ :30 sec.' | not written (core: reps/time) | Side Plank presses: frontal; CONTROL PATTERNS 'Elbow Side plank' = BOTH |
| S2 | 1 | A24:C24 | 'WORKOUT' #2 (A22) | - | AP_THROW | *MEDBALLS  | 1 | 'ALL LIST' | not written (athletic: max intent / quality) | ASSUMPTION: 'ALL LIST' = the 19-throw MEDBALL CHEAT SHEET (rows 53-71), 1 set each (17x10 + 2x20 = 210 throws); expands to 19 throws / 210 reps (see medball table) |
| S2 | 2 | A25:C25 | 'WORKOUT' #2 (A22) | - | CORE_OTHER | Star Supine Cross Connects | 1 | 20 | not written (core: reps/time) | Star Supine Cross Connects: CONTROL PATTERNS 'cross connect' = BOTH |
| S2 | 3 | A26:C26 | 'WORKOUT' #2 (A22) | pair: bilateral HD + unilateral HD | RP_BHD + RP_UHD | KB Swings + 12/12 Single leg Glute bridges | 3 | 12 | sheet rule A5: 1-3 RIR / RPE 7+ (resistance) | KB Swings: library AN20 'KB swing' = BILATERAL HIP DOMNANT; ballistic intent |
| S2 | 4 | A27:C27 | 'WORKOUT' #2 (A22) | - | RP_VPULL | Banded fast LAT PULL DOWNS Single Arm | 3 | '30---30' | 'FAST'/fast intent; sheet rule A5: 1-3 RIR / RPE 7+ (resistance) | Banded fast single arm lat pull downs: speed intent |
| S2 | 5 | A28:C28 | 'WORKOUT' #2 (A22) | - | AP_TRIPLE_EXT | Staggered stance DB snatch | 3 | '8/8' [cell stored as date 2021-08-08, fmt m/d] | not written (athletic: max intent / quality) | - |
| S2 | 6 | A29:C29 | 'WORKOUT' #2 (A22) | - | AP_PLYO | Plyo Push ups - one side raised | 3 | '8/8' [cell stored as date 2021-08-08, fmt m/d] | not written (athletic: max intent / quality) | - |
| S2 | 7 | A30:C30 | 'WORKOUT' #2 (A22) | - | CP_CORE_PELVIS | 20 on/ 10 off - TABATA TIMER - Flutter kicks & Hip Turns | 'TABATA' (assumed 4) | 'TIME BASED' | not written (core: reps/time) | ASSUMPTION: standard Tabata = 8 x (20 s on / 10 s off) = 4 min; alternating -> 4 work bouts of each exercise; counted as 4 sets per exercise; Flutter kicks: CONTROL PATTERNS: CORE PELVIS; Hip Turns: CONTROL PATTERNS: CORE PELVIS |
| S3 | 1 | A33:C33 | 'WORKOUT' #3 (A31) | - | CORE_OTHER | Med ball rolls | 3 | 30 | not written (core: reps/time) | Med ball rolls: ambiguous: medball ab roll-out or cross-connect rolls; both anti-extension/BOTH |
| S3 | 2 | A34:C34 | 'WORKOUT' #3 (A31) | HEAVY: | RP_UHD | HEAVY: Camporini DL | 3 | '8*8' | 'HEAVY' (in cell); sheet rule A5: 1-3 RIR / RPE 7+ (resistance) | Camporini DL: library AQ16 'Camporini Deadlifts' = UNILATERAL HIP DOMINANT; '8*8' read as 8 each side |
| S3 | 3 | A35:C35 | 'WORKOUT' #3 (A31) | HEAVY: | RP_UKD | HEAVY: Heavy walking lunges | 3 | '8*8' | 'HEAVY' (in cell); sheet rule A5: 1-3 RIR / RPE 7+ (resistance) | - |
| S3 | 4 | A36:C36 | 'WORKOUT' #3 (A31) | SUPERSET: (partner not named; INFERRED = next row Heavy Snatch grip DL); (mid weight) | AP_TRIPLE_EXT | SUPERSET: Low Hang Power Cleans (mid weight)  | 3 | 8 | '(MID WEIGHT)' | - |
| S3 | 5 | A37:C37 | 'WORKOUT' #3 (A31) | Heavy | RP_BHD | Heavy Snatch grip DL | 3 | 6 | 'HEAVY' (in cell); sheet rule A5: 1-3 RIR / RPE 7+ (resistance) | Heavy Snatch grip DL: library AP14 'Snatch Grip Barbell Deadlift' = BILATERAL HIP DOMNANT |
| S3 | 6 | A38:C38 | 'WORKOUT' #3 (A31) | SUPERSET (tri-set core + delts) | CORE_OTHER + ISO_SIDE_REAR_DELT | SUPERSET: Dead bugs + Front Raises + Side Raises | 3 | '8/8 - 8 - 8' | sheet rule A5: 1-3 RIR / RPE 7+ (resistance) | Dead bugs: CONTROL PATTERNS 'dead bugs' = BOTH; Front Raises: library AH12 'Front Raises w/ DB' sits in SIDE RAISES column; credited to front delts |
| S3 | 7 | A39:C39 | 'WORKOUT' #3 (A31) | Superset (agonist/antagonist iso); (MID WEIGHT) | ISO_QUAD + ISO_HAM | Superset: leg ext. leg curls (MID WEIGHT) | 3 | '16//16' | '(MID WEIGHT)'; sheet rule A5: 1-3 RIR / RPE 7+ (resistance) | - |

### 2B. ATHLETIC - MID

| day | order | cells | section / part label (verbatim) | in-cell tag (no PURPOSE/CATEGORY column exists) | canonical bucket(s) | exercise (verbatim) | sets | reps (verbatim) | intensity / effort | notes |
|---|---|---|---|---|---|---|---|---|---|---|
| M1 | 1 | D12:F12 | 'WORKOUT' #1 (D10) | - | AP_PLYO | weighted Depth Drops - Drop & Stick - Hold for 3 seconds on each one | 1 | 8 | 3 s stick/hold | weighted Depth Drops (stick 3 s): landing / 'TAKING IN FORCES' |
| M1 | 2 | D13:F13 | 'WORKOUT' #1 (D10) | - | AP_PLYO | High Jumps | 1 | 8 | not written (athletic: max intent / quality) | - |
| M1 | 3 | D14:F14 | 'WORKOUT' #1 (D10) | - | AP_PLYO | Bilateral Symetrical Squirrel Jumps | 1 | 40 | not written (athletic: max intent / quality) | Bilateral Squirrel Jumps: Sheet23: squirrel jumps = 'FASTEST SSC'; low amplitude |
| M1 | 4 | D15:F15 | 'WORKOUT' #1 (D10) | - | AP_PLYO | Single leg Squirrel Jumps | 1 | '40 & 40' | not written (athletic: max intent / quality) | - |
| M1 | 5 | D16:F16 | 'WORKOUT' #1 (D10) | unbroken | CORE_OTHER | Hollow rocks | 1 | '50 unbroken' | not written (core: reps/time) | - |
| M1 | 6 | D17:F17 | 'WORKOUT' #1 (D10) | Heavy | RP_HPUSH | Heavy DB bench presses | 2 | '8 & 8 ' | 'HEAVY' (in cell); sheet rule A5: 1-3 RIR / RPE 7+ (resistance) | Heavy DB bench presses: '8 & 8' read as 8 per arm/side (coach's '&' convention); could be 2 sets of 8 |
| M1 | 7 | D18:F18 | 'WORKOUT' #1 (D10) | Heavy | RP_BHD | Heavy Deadlifts | 2 | '6-8' [cell stored as date 2021-06-08, fmt m-d] | 'HEAVY' (in cell); sheet rule A5: 1-3 RIR / RPE 7+ (resistance) | - |
| M1 | 8 | D19:F19 | 'WORKOUT' #1 (D10) | - | RP_VPULL | Pull ups or Lat pull downs | 2 | '8-12' [cell stored as date 2021-08-12, fmt m-d] | sheet rule A5: 1-3 RIR / RPE 7+ (resistance) | - |
| M1 | 9 | D20:F20 | 'WORKOUT' #1 (D10) | pair (bi + tri) | ISO_BICEP + ISO_TRICEP | Heavy curls & Heavy tricep kickbakcs 12 on each side | 2 | '12 & 12' | 'HEAVY' (in cell); sheet rule A5: 1-3 RIR / RPE 7+ (resistance) | - |
| M1 | 10 | D21:F21 | 'WORKOUT' #1 (D10) | pair (core + quad/ham iso) | CT_CORE_THORAX + ISO_QUAD + ISO_HAM | Plate core & leg extensions / nordic curls | 2 | '15 & 8' | sheet rule A5: 1-3 RIR / RPE 7+ (resistance) | Plate core: exact drill not specified; INFERRED plate-loaded situp/crunch; nordic curls: '/' read as 'and' (superset member); could be 'or' |
| M2 | 1 | D24 | 'WORKOUT' #2 (D22) | sub-header | - | **MEDBALLS** | - | - | - | header cell; the throws below are its contents |
| M2 | 2 | D25:F25 | 'WORKOUT' #2 (D22) | - | AP_THROW | Rotational Chest pass R | 2 | 10 | not written (athletic: max intent / quality) | - |
| M2 | 3 | D26:F26 | 'WORKOUT' #2 (D22) | - | AP_THROW | Rotational Chest pass L | 2 | 10 | not written (athletic: max intent / quality) | - |
| M2 | 4 | D27:F27 | 'WORKOUT' #2 (D22) | - | AP_THROW | Rotational Scoop R | 2 | 10 | not written (athletic: max intent / quality) | - |
| M2 | 5 | D28:F28 | 'WORKOUT' #2 (D22) | - | AP_THROW | Rotational Scoop L | 2 | 10 | not written (athletic: max intent / quality) | - |
| M2 | 6 | D29:F29 | 'WORKOUT' #2 (D22) | - | AP_THROW | Rotational Floor side to side slams | 2 | 10 | not written (athletic: max intent / quality) | - |
| M2 | 7 | D30:F30 | 'WORKOUT' #2 (D22) | - | AP_THROW | Half kneeling Right Facing LEFT LEG UP rotational scoop | 2 | 10 | not written (athletic: max intent / quality) | - |
| M2 | 8 | D31:F31 | 'WORKOUT' #2 (D22) | - | AP_THROW | Half kneeling Right Facing RIGHT LEG FORWARD rotational scoop | 2 | 10 | not written (athletic: max intent / quality) | - |
| M2 | 9 | D32:F32 | 'WORKOUT' #2 (D22) | - | AP_THROW | Half kneeling LEFT Facing LEFT LEG UP rotational scoop | 2 | 10 | not written (athletic: max intent / quality) | - |
| M2 | 10 | D33:F33 | 'WORKOUT' #2 (D22) | - | AP_THROW | Half kneeling LEFT Facing RIGHT LEG FORWARD rotational scoop | 2 | 10 | not written (athletic: max intent / quality) | - |
| M2 | 11 | D34:F34 | 'WORKOUT' #2 (D22) | - | AP_THROW | Alternating Back to wall Rotational Scoops | 2 | 10 | not written (athletic: max intent / quality) | - |
| M2 | 12 | D35:F35 | 'WORKOUT' #2 (D22) | UNBROKEN | CORE_OTHER | Star Supine Cross Connects UNBROKEN | 2 | '20/20' | 'UNBROKEN' | - |
| M2 | 13 | D36:F36 | 'WORKOUT' #2 (D22) | Heavy | AP_TRIPLE_EXT | Heavy Power Cleans | 2 | 8 | 'HEAVY' (in cell) | - |
| M2 | 14 | D37:F37 | 'WORKOUT' #2 (D22) | - | RP_UKD | Lateral Step ups IPSILATERAL loading | 4 | '10 & 10' | sheet rule A5: 1-3 RIR / RPE 7+ (resistance) | - |
| M2 | 15 | D38:F38 | 'WORKOUT' #2 (D22) | - | AP_TRIPLE_EXT | Db Staggered Hang Snatch  | 2 | '6 & 6' | not written (athletic: max intent / quality) | - |
| M3 | 1 | D41:G41 | 'WORKOUT' #3 (D39) | - | AP_PLYO | Weighted Depth Drops - Drop & Stick - Hold for 3 seconds on each one | 1 | 8 | 3 s stick/hold | video: https://youtu.be/uoDrpDu4HVY |
| M3 | 2 | D42:G42 | 'WORKOUT' #3 (D39) | - | CORE_OTHER | Med Ball Rockers | 2 | 12 | not written (core: reps/time) | video: this but hugging a light medball: https://youtu.be/648HpqRr4D8; Med Ball Rockers: BASEBALL tab labels 'med ball rockers' as 'Transverse core' (accumulate 4 min); video note 'this but hugging a light medball' |
| M3 | 3 | D43:G43 | 'WORKOUT' #3 (D39) | - | AP_PLYO | Single Leg to march jumps | 2 | '8 & 8' | not written (athletic: max intent / quality) | video: https://youtu.be/O8jpEmEQbm0 |
| M3 | 4 | D44:F44 | 'WORKOUT' #3 (D39) | - | AP_PLYO | HEX bar loaded Jumps | 3 | '4-6' [cell stored as date 2021-04-06, fmt m-d] | not written (athletic: max intent / quality) | HEX bar loaded Jumps: loaded ballistic jump; alt AP_TRIPLE_EXT |
| M3 | 5 | D45:F45 | 'WORKOUT' #3 (D39) | pair: HIP-DOMINANT + HORIZONTAL PUSH | RP_BHD + RP_HPUSH | Bench glute Bridge & fast alternating DB sesaw floor press | 2 | '6 & 6' | 'FAST'/fast intent; sheet rule A5: 1-3 RIR / RPE 7+ (resistance) | Bench glute Bridge: library AN10 'Elevated Feet on Bench Glute Bridges' = BHD |
| M3 | 6 | D46:F46 | 'WORKOUT' #3 (D39) | - | RP_UHD | Unilateral Deadlift DB loaded | 2 | '6 & 6' | sheet rule A5: 1-3 RIR / RPE 7+ (resistance) | - |
| M3 | 7 | D47:F47 | 'WORKOUT' #3 (D39) | - | RP_VPULL | Max speed banded lat pull downs half kneeling ipsilateral | 2 | '20 sec. ' | 'Max speed'; sheet rule A5: 1-3 RIR / RPE 7+ (resistance) | Max speed banded lat pull downs: speed/velocity intent |
| M3 | 8 | D48:F48 | 'WORKOUT' #3 (D39) | SUPERSET (tri-set) | RP_UHD + ISO_BICEP + ISO_TRICEP | SUPERSET: DB Single leg Glute bridges + alternating seated bicep curl runners + db floor skull crushers | 3 | '12 on each leg & 12 & 12 ' | sheet rule A5: 1-3 RIR / RPE 7+ (resistance) | - |
| M4 | 1 | D51 | 'WORKOUT' #4 (D49) | sub-header | - | **MEDBALLS** | - | - | - | header cell; the throws below are its contents |
| M4 | 2 | D52:F52 | 'WORKOUT' #4 (D49) | - | AP_THROW | Rotational Chest pass R | 2 | 10 | not written (athletic: max intent / quality) | - |
| M4 | 3 | D53:F53 | 'WORKOUT' #4 (D49) | - | AP_THROW | Rotational Chest pass L | 2 | 10 | not written (athletic: max intent / quality) | - |
| M4 | 4 | D54:F54 | 'WORKOUT' #4 (D49) | - | AP_THROW | Rotational Scoop R | 2 | 10 | not written (athletic: max intent / quality) | - |
| M4 | 5 | D55:F55 | 'WORKOUT' #4 (D49) | - | AP_THROW | Rotational Scoop L | 2 | 10 | not written (athletic: max intent / quality) | - |
| M4 | 6 | D56:F56 | 'WORKOUT' #4 (D49) | - | AP_THROW | Rotational Floor side to side slams | 2 | 10 | not written (athletic: max intent / quality) | - |
| M4 | 7 | D57:F57 | 'WORKOUT' #4 (D49) | - | AP_THROW | Half kneeling Right Facing LEFT LEG UP rotational scoop | 2 | 10 | not written (athletic: max intent / quality) | - |
| M4 | 8 | D58:F58 | 'WORKOUT' #4 (D49) | - | AP_THROW | Half kneeling Right Facing RIGHT LEG FORWARD rotational scoop | 2 | 10 | not written (athletic: max intent / quality) | - |
| M4 | 9 | D59:F59 | 'WORKOUT' #4 (D49) | - | AP_THROW | Half kneeling LEFT Facing LEFT LEG UP rotational scoop | 2 | 10 | not written (athletic: max intent / quality) | - |
| M4 | 10 | D60:F60 | 'WORKOUT' #4 (D49) | - | AP_THROW | Half kneeling LEFT Facing RIGHT LEG FORWARD rotational scoop | 2 | 10 | not written (athletic: max intent / quality) | - |
| M4 | 11 | D61:F61 | 'WORKOUT' #4 (D49) | - | AP_THROW | Alternating Back to wall Rotational Scoops | 2 | 10 | not written (athletic: max intent / quality) | - |
| M4 | 12 | D62:F62 | 'WORKOUT' #4 (D49) | UNBROKEN | CORE_OTHER | Med ball Star Supine Cross Connects UNBROKEN | 2 | '20/20' | 'UNBROKEN' | - |
| M4 | 13 | D63:F63 | 'WORKOUT' #4 (D49) | Heavy | RP_HPULL | Heavy DB rows | 2 | '8 & 8' | 'HEAVY' (in cell); sheet rule A5: 1-3 RIR / RPE 7+ (resistance) | - |
| M4 | 14 | D64:F64 | 'WORKOUT' #4 (D49) | - | RP_UKD | RFE & FFE contralateral lunge double DB front rack loaded | '2 to 4' (assumed 3) | '8 & 8' | sheet rule A5: 1-3 RIR / RPE 7+ (resistance) | ASSUMPTION: '2 to 4' sets: as-written lower bound 2, assumed midpoint 3, upper 4 |
| M4 | 15 | D65:F65 | 'WORKOUT' #4 (D49) | - | RP_VPUSH | DB overhead sesaw alternating press (no leg drive) | 2 | '8 & 8' | strict ('no leg drive'); sheet rule A5: 1-3 RIR / RPE 7+ (resistance) | - |
| M4 | 16 | D66:F66 | 'WORKOUT' #4 (D49) | pair (delts + adductor/pelvis core) | ISO_SIDE_REAR_DELT + CP_CORE_PELVIS | DB side raises + Copenhagen plank :50 sec each side | 2 | 8 | sheet rule A5: 1-3 RIR / RPE 7+ (resistance) | Copenhagen plank: library S10 'Coppenhaggen Plank' = CORE PELVIS FRONTAL |
| M4 | 17 | D67:F67 | 'WORKOUT' #4 (D49) | core finisher (150 reps) | CT_CORE_THORAX + CP_CORE_PELVIS | 50 situps + 50 crunches + 50 reverse crunches | 1 | (blank) | not written (core: reps/time) | reverse crunches: library R10 'Reverse Crunches' = CORE PELVIS |

### 2C. ATHLETIC - ADVANCED

| day | order | cells | section / part label (verbatim) | in-cell tag (no PURPOSE/CATEGORY column exists) | canonical bucket(s) | exercise (verbatim) | sets | reps (verbatim) | intensity / effort | notes |
|---|---|---|---|---|---|---|---|---|---|---|
| A1 | 1 | H12:K12 | 'WORKOUT' #1 (H10) | - | AP_PLYO | Weighted Depth Drops - Drop & Stick - Hold for 3 seconds on each one | 1 | 8 | 3 s stick/hold | video: https://youtu.be/uoDrpDu4HVY |
| A1 | 2 | H13:K13 | 'WORKOUT' #1 (H10) | - | CORE_OTHER | Med Ball Rockers | 1 | 12 | not written (core: reps/time) | video: this but hugging a light medball: https://youtu.be/648HpqRr4D8; Med Ball Rockers: 'Transverse core' per BASEBALL tab |
| A1 | 3 | H14:K14 | 'WORKOUT' #1 (H10) | - | AP_PLYO | Single Leg to march jumps | 1 | '12 & 12' | not written (athletic: max intent / quality) | video: https://youtu.be/O8jpEmEQbm0 |
| A1 | 4 | H15:J15 | 'WORKOUT' #1 (H10) | (1RIR) singles | RP_BHD | DEADLIFTS (1RIR) | 3 | 1 | 1 RIR (in cell); sheet rule A5: 1-3 RIR / RPE 7+ (resistance) | - |
| A1 | 5 | H16:J16 | 'WORKOUT' #1 (H10) | - | RP_UHD | Unilateral Deadlift DB loaded | 2 | '6 & 6' | sheet rule A5: 1-3 RIR / RPE 7+ (resistance) | - |
| A1 | 6 | H17:J17 | 'WORKOUT' #1 (H10) | SUPERSET (core) | CORE_OTHER | SUPERSET: Star v-ups + side plank knee to elbow  | 3 | '20 + 20 ' | not written (core: reps/time) | Star v-ups: CONTROL PATTERNS 'Star V-Ups' = BOTH; side plank knee to elbow: frontal |
| A2 | 1 | H20:J20 | 'WORKOUT' #2 (H18) | - | AP_THROW | *MEDBALLS | 1 | 'ALL LIST' | not written (athletic: max intent / quality) | ASSUMPTION: 'ALL LIST' = 19 throws x 1 set (210 throws); expands to 19 throws / 210 reps (see medball table) |
| A2 | 2 | H21:J21 | 'WORKOUT' #2 (H18) | Heavy; cells bg=theme0 like the MID column (copied from D63) | RP_HPULL | Heavy DB rows | 2 | '8 & 8' | 'HEAVY' (in cell); sheet rule A5: 1-3 RIR / RPE 7+ (resistance) | - |
| A2 | 3 | H22:J22 | 'WORKOUT' #2 (H18) | - | RP_UKD | RFE & FFE contralateral lunge double DB front rack loaded | 2 | '8 & 8' | sheet rule A5: 1-3 RIR / RPE 7+ (resistance) | - |
| A2 | 4 | H23:J23 | 'WORKOUT' #2 (H18) | - | RP_VPUSH | DB overhead sesaw alternating press (no leg drive) | 2 | '8 & 8' | strict ('no leg drive'); sheet rule A5: 1-3 RIR / RPE 7+ (resistance) | - |
| A2 | 5 | H24:J24 | 'WORKOUT' #2 (H18) | - | ISO_SIDE_REAR_DELT + CP_CORE_PELVIS | DB side raises + Copenhagen plank :50 sec each side | 2 | 8 | sheet rule A5: 1-3 RIR / RPE 7+ (resistance) | - |
| A2 | 6 | H25:J25 | 'WORKOUT' #2 (H18) | core finisher (3 rounds = 450 reps) | CT_CORE_THORAX + CP_CORE_PELVIS | 50 situps + 50 crunches + 50 reverse crunches | 3 | (blank) | not written (core: reps/time) | - |
| A3 | 1 | H28:J28 | 'WORKOUT' #3 (H26) | - | AP_PLYO | Squirrel jumps both feet | 1 | 40 | not written (athletic: max intent / quality) | - |
| A3 | 2 | H29:J29 | 'WORKOUT' #3 (H26) | - | AP_JUMP_LIMITED_KNEE | Bilateral Symetrical jump on to plate | 1 | 20 | not written (athletic: max intent / quality) | Bilateral jump on to plate: plate jumps = library 'INTERMEDIATE - AP - JUMPING LIMITED KNEE' track |
| A3 | 3 | H30:J30 | 'WORKOUT' #3 (H26) | - | AP_JUMP_LIMITED_KNEE | SL Jump on to plate forward/back | 1 | '20/20' | not written (athletic: max intent / quality) | - |
| A3 | 4 | H31:J31 | 'WORKOUT' #3 (H26) | unbroken | CORE_OTHER | Hollow rocks | 1 | '50 unbroken' | not written (core: reps/time) | - |
| A3 | 5 | H32:J32 | 'WORKOUT' #3 (H26) | - | AP_TRIPLE_EXT | Power Cleans | 3 | 3 | not written (athletic: max intent / quality) | - |
| A3 | 6 | H33:J33 | 'WORKOUT' #3 (H26) | HEAVY | RP_BHD | HEAVY GLUTE BRIDGES | 2 | 6 | 'HEAVY' (in cell); sheet rule A5: 1-3 RIR / RPE 7+ (resistance) | - |
| A3 | 7 | H34:J34 | 'WORKOUT' #3 (H26) | - | ISO_BICEP + ISO_TRICEP | Heavy curls & Heavy tricep kickbakcs 12 on each side | 2 | '12 & 12' | 'HEAVY' (in cell); sheet rule A5: 1-3 RIR / RPE 7+ (resistance) | - |
| A3 | 8 | H35:J35 | 'WORKOUT' #3 (H26) | - | CT_CORE_THORAX + ISO_QUAD | Plate core & leg extensions | 2 | 20 | sheet rule A5: 1-3 RIR / RPE 7+ (resistance) | - |
| A4 | 1 | H38:J38 | 'WORKOUT' #4 (H36) | - | AP_THROW | *MEDBALL | 1 | 'ALL LIST' | not written (athletic: max intent / quality) | ASSUMPTION: 'ALL LIST' = 19 throws x 1 set (210 throws); expands to 19 throws / 210 reps (see medball table) |
| A4 | 2 | H39:J39 | 'WORKOUT' #4 (H36) | UNBROKEN | CORE_OTHER | Star Supine Cross Connects UNBROKEN | 2 | '20/20' | 'UNBROKEN' | - |
| A4 | 3 | H40:J40 | 'WORKOUT' #4 (H36) | - | ISO_CALF | Heel raises & fast/rythmic/1/4 SQUATS | 2 | 8 | 'FAST'/fast intent; rhythmic; sheet rule A5: 1-3 RIR / RPE 7+ (resistance) | Heel raises & fast/rhythmic 1/4 squats: resembles library C9 'BodyWeight Squat to calf raise' (TRIPPLE EXTENSION foundational); alt AP_TRIPLE_EXT |
| A4 | 4 | H41:J41 | 'WORKOUT' #4 (H36) | - | RP_UKD | Lateral Step ups IPSILATERAL loading | 1 | '6 & 6' | sheet rule A5: 1-3 RIR / RPE 7+ (resistance) | - |
| A4 | 5 | H42:J42 | 'WORKOUT' #4 (H36) | - | AP_TRIPLE_EXT | Db Staggered Hang Snatch  | 1 | '6 & 6' | not written (athletic: max intent / quality) | - |
| A4 | 6 | H43:J43 | 'WORKOUT' #4 (H36) | - | CT_CORE_THORAX | Feet againts the wall weighted low plank  | 3 | '1 minute' | not written (core: reps/time) | weighted low plank feet against wall: library O10 'Plank' = CORE THORAX; CONTROL PATTERNS 'Low plank' = BOTH (static) |

### 2D. BOXING - MONDAY ('MONDAY OFF SEASON WORK')

Columns wk1..wk8 are the SETS cells for that week ('.' = row not used that week). W1-2 rows read columns A/B/C/D; W3-8 rows read E-J/K/L.

| phase | order | cells | wk1 | wk2 | wk3 | wk4 | wk5 | wk6 | wk7 | wk8 | reps (verbatim) | exercise (verbatim) | canonical bucket(s) | intensity / effort | notes |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| W1-2 | 1 | A7:D7 | 1 | 1 | . | . | . | . | . | . | '20/40' | 20 sec fast/ 40 sec slow (cardio of choice) | COND_AEROBIC | 'FAST'/fast intent | ASSUMPTION: 1 set = 1 interval block; ~10 rounds assumed (cheat sheet beginner '10 x 20 Sec Run/ 40 Sec Walk'); 20 s fast / 40 s slow intervals: AEROBIC CAPACITY CHEAT SHEET band A (blue) '20/40 Work:Rest'; round count not written |
| W1-2 | 2 | A8:D8 | 3 | 3 | . | . | . | . | . | . | '15/10' | Situps / Toes to bar | CT_CORE_THORAX | not written (core: reps/time) | Toes to bar: library O15 = CORE THORAX; CONTROL PATTERNS tab says CORE PELVIS (conflict) |
| W1-2 | 3 | A9:D9 | 3 | 3 | . | . | . | . | . | . | 10 | Front Squats | RP_BKD | not written | - |
| W1-2 | 4 | A10:D10 | 3 | 3 | . | . | . | . | . | . | 10 | Deadlifts | RP_BHD | not written | - |
| W1-2 | 5 | A11:D11 | 3 | 3 | . | . | . | . | . | . | 10 | Reverse Lunges | RP_UKD | not written | - |
| W1-2 | 6 | A12:D12 | 3 | 3 | . | . | . | . | . | . | 10 | Single LEG Rdl | RP_UHD | not written | - |
| W1-2 | 7 | A13:D13 | 3 | 3 | . | . | . | . | . | . | 10 | Leg curls | ISO_HAM | not written | - |
| W1-2 | 8 | A14:D14 | 3 | 3 | . | . | . | . | . | . | 10 | Leg Extentions | ISO_QUAD | not written | - |
| W3-8 | 1 | E7:L7 | . | . | 1 | 1 | 1 | 1 | 1 | 1 | 'SEE LIST' | *MEDBALLS | AP_THROW | not written (athletic: max intent / quality) | ASSUMPTION: 19 throws x 10 = 190 throws; expands to 19 throws x 10 = 190 reps |
| W3-8 | 2 | E8:L8 | . | . | 3 | 3 | 3 | 3 | 3 | 2 | 8 | Weighted Depth Drops | AP_PLYO | not written (athletic: max intent / quality) | - |
| W3-8 | 3 | E9:L9 | . | . | 3 | 3 | 3 | 3 | 3 | 2 | '6/6' [cell stored as date 2022-06-06, fmt m/d] | Single Leg to high march jump | AP_PLYO | not written (athletic: max intent / quality) | - |
| W3-8 | 4 | E10:L10 | . | . | 3 | 3 | 3 | 3 | 3 | 3 | 8 | Clean Pull/ hang Power Clean | AP_TRIPLE_EXT | not written (athletic: max intent / quality) | - |
| W3-8 | 5 | E11:L11 | . | . | 3 | 3 | 3 | 3 | 3 | 3 | '6/6' [cell stored as date 2022-06-06, fmt m/d] | Lateral box step up IPSILATERAL LOAD | RP_UKD | not written | - |
| W3-8 | 6 | E12:L12 | . | . | 3 | 3 | 3 | 3 | 2 | 4 | 6 | DEADLIFTS (1-2RIR) + 3 min Jump Rope | RP_BHD + AP_JUMP_LIMITED_KNEE | 1-2 RIR (in cell) | strength + conditioning pairing; 3 min Jump Rope: between-set jump rope: ankle-stiffness + boxing-specific conditioning; contacts est. 2/s |
| W3-8 | 7 | E13:L13 | . | . | 3 | 3 | 3 | 3 | 2 | 3 | '50/50 ' | Copenhagen Plank & Unilateral DL | CP_CORE_PELVIS + RP_UHD | not written | Copenhagen Plank: '50/50' read as 50 s each side (athletic tab: ':50 sec each side'); Unilateral DL: reps not written; 6/6 assumed from athletic tab 'Unilateral Deadlift DB loaded 6 & 6' |
| W3-8 | 8 | E14:L14 | . | . | 3 | 3 | 3 | 3 | 2 | 3 | '6 & 6' | Leg ext. Leg Curls (FULL RANGE OF MOTION) | ISO_QUAD + ISO_HAM | 'FULL RANGE OF MOTION' | FULL RANGE OF MOTION |

### 2E. BOXING - TUESDAY

| phase | order | cells | wk1 | wk2 | wk3 | wk4 | wk5 | wk6 | wk7 | wk8 | reps (verbatim) | exercise (verbatim) | canonical bucket(s) | intensity / effort | notes |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| W1-2 | 1 | A19:D19 | 1 | 1 | . | . | . | . | . | . | 'SEE LIST' | *MEDBALLS | AP_THROW | not written (athletic: max intent / quality) | ASSUMPTION: 1 set of the 19-throw list x 10 = 190 throws; expands to 19 throws x 10 = 190 reps |
| W1-2 | 2 | A20:D20 | 3 | 3 | . | . | . | . | . | . | 10 | Db Bench PRess | RP_HPUSH | not written | - |
| W1-2 | 3 | A21:D21 | 3 | 3 | . | . | . | . | . | . | 10 | Lat pull downs/pullups | RP_VPULL | not written | - |
| W1-2 | 4 | A22:D22 | 3 | 3 | . | . | . | . | . | . | 10 | Db OVerhead press | RP_VPUSH | not written | - |
| W1-2 | 5 | A23:D23 | 3 | 3 | . | . | . | . | . | . | 10 | DB seal rows | RP_HPULL | not written | - |
| W1-2 | 6 | A24:D24 | 3 | 3 | . | . | . | . | . | . | 10 | Db Curls | ISO_BICEP | not written | - |
| W1-2 | 7 | A25:D25 | 3 | 3 | . | . | . | . | . | . | 15 | Db floor skull crushers | ISO_TRICEP | not written | - |
| W3-8 | 1 | E19:L19 | . | . | 1 | 1 | 1 | 1 | 1 | 1 | '20-40 min' | Cardio of any choice | COND_AEROBIC | pace per work:rest | Cardio of any choice: 20-40 min; band C long duration |
| W3-8 | 2 | E20:L20 | . | . | 3 | 3 | 3 | 3 | 4 | 6 | '10/10/ 20 rows' | Single Leg swiss ball knee tuck in + DB rows | CT_CORE_THORAX + RP_HPULL | not written | pair core + horizontal pull; Single Leg swiss ball knee tuck in: library analogue 'Knees to chest' O16 = CORE THORAX; CONTROL PATTERNS 'knees to chest' = CORE PELVIS (conflict) |
| W3-8 | 3 | E21:L21 | . | . | 3 | 3 | 3 | 3 | 2 | 3 | '10/ 10' | DB snatches  | AP_TRIPLE_EXT | not written (athletic: max intent / quality) | - |
| W3-8 | 4 | E22:L22 | . | . | 3 | 3 | 3 | 3 | 2 | 3 | '3-5-5-5' | 3 Heavy SQUATs + 5 Tuck jumps + 5 DB squat jumps + 5 Squirrel jumps | RP_BKD + AP_PLYO | 'HEAVY' (in cell) | COMPLEX - French-contrast structure (heavy -> plyo -> loaded jump -> fastest SSC); knee-dominant; DB squat jumps: loaded ballistic |
| W3-8 | 5 | E23:L23 | . | . | 3 | 3 | 3 | 3 | 2 | 3 | '8/8' [cell stored as date 2022-08-08, fmt m/d] | Jefferson Lunge | RP_UKD | not written | - |

### 2F. BOXING - THURSDAY

| phase | order | cells | wk1 | wk2 | wk3 | wk4 | wk5 | wk6 | wk7 | wk8 | reps (verbatim) | exercise (verbatim) | canonical bucket(s) | intensity / effort | notes |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| W1-2 | 1 | A31:D31 | 1 | 1 | . | . | . | . | . | . | '20/20' | Situps/crunches | CT_CORE_THORAX | not written (core: reps/time) | - |
| W1-2 | 2 | A32:D32 | 3 | 3 | . | . | . | . | . | . | 10 | Front Squats | RP_BKD | not written | - |
| W1-2 | 3 | A33:D33 | 3 | 3 | . | . | . | . | . | . | 10 | Deadlifts | RP_BHD | not written | - |
| W1-2 | 4 | A34:D34 | 3 | 3 | . | . | . | . | . | . | 10 | Reverse Lunges | RP_UKD | not written | - |
| W1-2 | 5 | A35:D35 | 3 | 3 | . | . | . | . | . | . | 10 | Single LEG Rdl | RP_UHD | not written | - |
| W1-2 | 6 | A36:D36 | 3 | 3 | . | . | . | . | . | . | 10 | LEg curls | ISO_HAM | not written | - |
| W1-2 | 7 | A37:D37 | 3 | 3 | . | . | . | . | . | . | 10 | Leg Extentions | ISO_QUAD | not written | - |
| W3-8 | 1 | E31:L31 | . | . | 1 | 1 | 1 | 1 | 1 | 1 | 'SEE LIST' | *MEDBALLS | AP_THROW | not written (athletic: max intent / quality) | ASSUMPTION: 19 x 10 = 190 throws; expands to 19 throws x 10 = 190 reps |
| W3-8 | 2 | E32:L32 | . | . | 3 | 3 | 3 | 3 | 2 | 2 | '20/20' | Squirrel jumps single leg (REVERSE BANDED) | AP_PLYO | band-assisted (reverse banded) | SL Squirrel jumps (REVERSE BANDED): reverse banded = assisted; ALL ABOUT SQUATS: reverse band 'ACCELERATES MAX PROPULSION' |
| W3-8 | 3 | E33:L33 | . | . | 3 | 3 | 3 | 3 | 3 | 2 | '20/20' | Side Raises + Front Raises | ISO_SIDE_REAR_DELT | not written | - |
| W3-8 | 4 | E34:L34 | . | . | 3 | 3 | 3 | 3 | 3 | 3 | '25 unbroken' | 8 Box Med Ball rocker into 4 hops + Swiss ball knee tuck ins | CORE_OTHER + AP_PLYO + CT_CORE_THORAX | not written | Box Med Ball rocker (x8): rockers = core per BASEBALL tab; 4 hops: read as 8 rockers then 4 hops; if 4 hops after every rocker = 32 contacts; Swiss ball knee tuck ins: '25 unbroken' |
| W3-8 | 5 | E35:L35 | . | . | 3 | 3 | 3 | 3 | 4 | 6 | 12 | Hang Power Clean & Press | AP_TRIPLE_EXT + RP_VPUSH | not written | Olympic + press compound; Press (of clean & press): split out so the only weeks 3-8 pressing is visible |
| W3-8 | 6 | E36:L36 | . | . | 3 | 3 | 3 | 3 | 2 | 3 | '6/6 - 3' | Weighted Bulgarian Lunge Heel held up + SL Def. Weighted Calf Raises | RP_UKD + ISO_CALF | not written | SL Deficit Weighted Calf Raises: '- 3' meaning unclear (3 reps? 3 s?) |
| W3-8 | 7 | E37:L37 | . | . | 3 | 3 | 3 | 3 | 2 | 3 | '20/20' | Leg ext. Leg Curls (FULL RANGE OF MOTION) | ISO_QUAD + ISO_HAM | 'FULL RANGE OF MOTION' | FULL RANGE OF MOTION |

### 2G. BOXING - FRIDAY

| phase | order | cells | wk1 | wk2 | wk3 | wk4 | wk5 | wk6 | wk7 | wk8 | reps (verbatim) | exercise (verbatim) | canonical bucket(s) | intensity / effort | notes |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| W1-2 | 1 | A44:D44 | 1 | 1 | . | . | . | . | . | . | '20 min' | Easy cardio of choice (steady pace) | COND_AEROBIC | 'Easy' pace; steady pace | Easy steady cardio: cheat sheet band C (orange) long duration / low intensity |
| W1-2 | 2 | A45:D45 | 3 | 3 | . | . | . | . | . | . | '15/30/30' | Russian twists/ 30/30 Side planks | CT_CORE_THORAX + CORE_OTHER | not written (core: reps/time) | Russian twists: library Q11 = CORE THORAX TRANSVERSE |
| W1-2 | 3 | A46:D46 | 3 | 3 | . | . | . | . | . | . | 10 | Db Bench PRess | RP_HPUSH | not written | - |
| W1-2 | 4 | A47:D47 | 3 | 3 | . | . | . | . | . | . | 10 | Lat pull downs/pullups | RP_VPULL | not written | - |
| W1-2 | 5 | A48:D48 | 3 | 3 | . | . | . | . | . | . | 10 | Db OVerhead press | RP_VPUSH | not written | - |
| W1-2 | 6 | A49:D49 | 3 | 3 | . | . | . | . | . | . | 10 | DB seal rows | RP_HPULL | not written | - |
| W3-8 | 1 | E44:L44 | . | . | 5 | 5 | 6 | 6 | 7 | 8 | '20/40' | Sprint 20/ Recover 40 | COND_SPRINT_BUYOUT | pace per work:rest | Sprint 20 s / recover 40 s: sets = rounds; cheat sheet band A '20/40 Work:Rest'; placed FIRST in the session (not a buy-out) |
| W3-8 | 2 | E45:L45 | . | . | 1 | 1 | 3 | 3 | 2 | 2 | '8 Reps- 20/20' | Drop into Box Jumps + 20/20 Star Toe touches | AP_PLYO + CORE_OTHER | not written | - |
| W3-8 | 3 | E46:L46 | . | . | 3 | 3 | 3 | 3 | 4 | 6 | '4-5-5-5/5' | 4 Deadlifts - 5 broad jumps - 5 KB swings - 5/5 High Knee runs | RP_BHD + AP_PLYO + AP_SPRINT | not written | COMPLEX - French-contrast structure, hip-dominant (heavy hinge -> jump -> ballistic hinge -> speed); KB swings: ballistic hinge; library = BHD |
| W3-8 | 4 | E47:L47 | . | . | 3 | 3 | 3 | 3 | 3 | 3 | '6/6' [cell stored as date 2022-06-06, fmt m/d] | Db contralateral LOW step up | RP_UKD | not written | - |
| W3-8 | 5 | E48:L48 | . | . | 3 | 3 | 3 | 3 | 2 | 3 | '30 sec. 30 sec.' | Slider Runners + Slider Hamstring Runners | CP_CORE_PELVIS + ISO_HAM | not written | Slider Runners: mountain-climber pattern; pelvis moves on fixed thorax (INFERRED); Slider Hamstring Runners: alternating slider leg curls; library 'swiss ball hamstring curls' sits under BHD |

### 2H. The medball lists behind `*MEDBALLS`

Every `*MEDBALLS` cell (athletic C24, J20, J38; boxing L7, D19, L31) is a hyperlink to '(NOT DONE) ALL ABOUT BALLISTICS'!A1, whose 'MEDBALL CHEAT SHEET' (A51) lists these 19 throws at 1 set each. The boxing tab repeats the same 19 names in its own 'MED BALL VARIATIONS' list at 10 reps each. The Mid level writes out only the 10 rotational throws, at 2 x 10 each. The ballistics tab also lists 9 'SPECIALTIES' and 7 'CORE EXTRAS', which are not counted here (see open questions).

| # | throw (verbatim) | ballistics cheat-sheet reps | boxing list reps | coach DESCRIPTION (ballistics tab col D, verbatim) | in MID rotational subset? |
|---|---|---|---|---|---|
| 1 | Chest pass | 10 | 10 | 'BILATERAL SYMETRICAL PUSH' | no |
| 2 | Overhead throw | 10 | 10 | 'BILATERAL SYMETRICAL PULL DOWN' | no |
| 3 | Rotational Chest pass R | 10 | 10 | 'CORE THORAX ' | yes |
| 4 | Rotational Chest pass L | 10 | 10 | 'CORE THORAX ' | yes |
| 5 | Rotational Scoop R | 10 | 10 | 'CORE THORAX ' | yes |
| 6 | Rotational Scoop L | 10 | 10 | 'CORE THORAX ' | yes |
| 7 | Squat to Chest Pass | 10 | 10 | 'BILATERAL SYMETRICAL KNEE DOMINANT & PUSH' | no |
| 8 | Rotational Floor side to side slams | 10 | 10 | 'TRANSVERSE PULL DOWN' | yes |
| 9 | RIGHT LEG step forward Chest Pass | 10 | 10 | 'PROPULSIVE STEP WITH BILATERAL SYMETRICAL PUSH' | no |
| 10 | LEFT LEG step forward Chest pass | 10 | 10 | 'PROPULSIVE STEP WITH BILATERAL SYMETRICAL PUSH' | no |
| 11 | RIGHT LEG step forward overhead throw | 10 | 10 | 'PROPULSIVE STEP WITH BILATERAL SYMETRICAL PULL DOWN' | no |
| 12 | LEFT LEG step forward overhead throw | 10 | 10 | 'PROPULSIVE STEP WITH BILATERAL SYMETRICAL PULL DOWN' | no |
| 13 | Half kneeling Right Facing LEFT LEG UP rotational scoop | 10 | 10 | 'INTO THE LEFT LEG/HIP' | yes |
| 14 | Half kneeling Right Facing RIGHT LEG FORWARD rotational scoop | 10 | 10 | 'OUT OF THE RIGHT LEG/HIP' | yes |
| 15 | Half kneeling LEFT Facing LEFT LEG UP rotational scoop | 10 | 10 | 'OUT OF THE LEFT LEG/HIP' | yes |
| 16 | Half kneeling LEFT Facing RIGHT LEG FORWARD rotational scoop | 10 | 10 | 'INTO THE RIGHT LEG/HIP' | yes |
| 17 | Alternating Back to wall Rotational Scoops | 10 | 10 | 'TRANSVERSE CORE THORAX' | yes |
| 18 | Situps to chest pass | 20 | 10 | 'BILATERAL CORE THORAX' | no |
| 19 | Situps to overhead throw | 20 | 10 | 'BILATERAL CORE THORAX' | no |

---

## 3. Rules visible in the two tabs

### 3.1 Session architecture (OBSERVED order, *INFERRED rule*)
The dominant order is **reactive/ballistic first, heavy strength in the middle, isolation and core last**. It holds for all 11 athletic-tab sessions except S3, which opens with 'Med ball rolls' core and has no jumps, and for boxing wk3 Mon and Fri. Exceptions:
* Boxing wk1-2 sessions open with conditioning or a core line and then go straight into 3x10 strength.
* Boxing wk3-8 Tuesday puts 'Single Leg swiss ball knee tuck in + DB rows' before 'DB snatches'.
* Boxing wk3-8 Thursday puts 'Side Raises + Front Raises' third, before the power and strength work.

The blocks:
1. **Primer block**: landings / jumps / medball list and/or one core-control drill, usually at **1 set** in Mid and Advanced. Examples: Mid M1 'weighted Depth Drops - Drop & Stick' 1x8, 'High Jumps' 1x8, two squirrel-jump lines at 1 set, 'Hollow rocks' 1 x '50 unbroken'. Advanced A1 depth drops 1x8, 'Med Ball Rockers' 1x12, 'Single Leg to march jumps' 1 x '12 & 12'. Boxing wk3-8 opens Mon/Thu with `*MEDBALLS` and Tue/Fri with conditioning (cardio, sprints).
2. **Power**: Olympic derivatives or loaded jumps (low-hang/heavy power cleans, DB staggered snatch, clean pull / hang power clean, hex-bar loaded jumps, DB snatches) or a contrast complex.
3. **Main strength**: heavy bilateral hinge/squat (hex bar squats, snatch-grip DL, heavy deadlifts, 'DEADLIFTS (1RIR)', front squats/deadlifts in boxing wk1-2) and unilateral knee/hip work (lunges, step-ups, Camporini/unilateral DL).
4. **Upper body**: horizontal and vertical push/pull, often DB and often unilateral/alternating ('sesaw').
5. **Finisher**: paired isolation (curls + kickbacks, leg ext + leg curls, side + front raises, side raises + Copenhagen plank) and a core block ('50 situps + 50 crunches + 50 reverse crunches', Tabata flutter kicks/hip turns, weighted low plank).

### 3.2 Day-type alternation (Mid and Advanced, OBSERVED)
Workouts 1 and 3 are **jump days** (landing + jumps + core primer); workouts 2 and 4 are **medball days** (the throw list first, then strength):

| level | W1 | W2 | W3 | W4 |
|---|---|---|---|---|
| MID | jumps: depth drops, high jumps, squirrel x2 | medballs (10 rotational x 2x10) | jumps: depth drops, SL march jumps, hex-bar jumps | medballs (10 rotational x 2x10) |
| ADVANCED | jumps: depth drops, SL march jumps | medballs ALL LIST | jumps: squirrel, plate jumps x2 | medballs ALL LIST |

Strength pattern follows the day type (*INFERRED rule from OBSERVED rows*):
* **Jump days are hip-dominant days.** M1 'Heavy Deadlifts'; M3 'Bench glute Bridge ...' + 'Unilateral Deadlift DB loaded' + 'DB Single leg Glute bridges'; A1 'DEADLIFTS (1RIR)' + 'Unilateral Deadlift DB loaded'; A3 'Power Cleans' + 'HEAVY GLUTE BRIDGES'.
* **Medball days are knee-dominant, unilateral days.** M2 'Lateral Step ups IPSILATERAL loading' 4 x 10 & 10; M4 / A2 'RFE & FFE contralateral lunge double DB front rack loaded'; A4 'Lateral Step ups IPSILATERAL loading'.
* **Upper body crosses over.** Hip days carry HORIZONTAL PUSH + VERTICAL PULL (M1 'Heavy DB bench presses' + 'Pull ups or Lat pull downs'; M3 floor press + 'Max speed banded lat pull downs'). Knee days carry HORIZONTAL PULL + VERTICAL PUSH (M4 / A2 'Heavy DB rows' + 'DB overhead sesaw alternating press (no leg drive)').
* The BYOP 'ATHLETIC - FULL BODY - 4 DAYS A WEEK' template wires it differently: Mon/Thu = knee + both pulls, Tue/Fri = hip + both pushes. The one cell M3 'Bench glute Bridge & fast alternating DB sesaw floor press' literally pairs hip-dominant with horizontal push, as BYOP Tuesday does.
* Starting does not follow the jump/medball alternation. S1 = jumps + contrasts, S2 = medballs + upper plyo, S3 = strength + Olympic + isolation.

### 3.3 Pairing / superset / contrast logic (all OBSERVED pairings)
* **Same-pattern contrast, heavy into unloaded jump (Starting):** A17 'SUPERSET: HEAVY Hex bar Squats direclty into 10 Repeat Jump Squat HIGH JUMPs' ('3+10': BKD into bilateral jumps). A18 'SUPERSET: HEAVY Ipsilateral DB front foot elevated lunge directly into no weight lunge front foot jumps 8 reps each leg' (UKD into unilateral jumps). Bilateral heavy work goes to bilateral jumps and unilateral to unilateral, so the jump copies the lift's stance.
* **French-contrast-style 4-step complexes (boxing wk3-8):** Tue L22 '3 Heavy SQUATs + 5 Tuck jumps + 5 DB squat jumps + 5 Squirrel jumps' (knee-dominant) and Fri L46 '4 Deadlifts - 5 broad jumps - 5 KB swings - 5/5 High Knee runs' (hip-dominant). Both follow heavy, then unloaded max jump, then loaded ballistic, then fastest/lightest. This mirrors 'ALL ABOUT SQUATS' G16 'FRENCH CONTRAST': '78% of 1RM whatever squat immediately into tuck jumps, immediately into Goblet squats, immediately into reverse banded squat jumps' ('3/3/3/3/3').
* **Plyo into eccentric hamstring:** A20 'Lateral mid size box step up jumps directly into nordic curls'.
* **Bilateral + unilateral of the same pattern:** A26 'KB Swings + 12/12 Single leg Glute bridges' (BHD + UHD).
* **Hip-dominant + horizontal push:** M3 'Bench glute Bridge & fast alternating DB sesaw floor press'.
* **Strength + conditioning:** boxing L12 'DEADLIFTS (1-2RIR) + 3 min Jump Rope'.
* **Core + pull:** boxing L20 'Single Leg swiss ball knee tuck in + DB rows'.
* **Unilateral leg + calf:** L36 'Weighted Bulgarian Lunge Heel held up + SL Def. Weighted Calf Raises'.
* **Isolation pairs (always agonist/antagonist or same region):** 'Heavy curls & Heavy tricep kickbakcs', 'Superset: leg ext. leg curls (MID WEIGHT)', 'Leg ext. Leg Curls (FULL RANGE OF MOTION)', 'Side Raises + Front Raises', 'SUPERSET: Dead bugs + Front Raises + Side Raises', 'DB side raises + Copenhagen plank :50 sec each side', 'SUPERSET: DB Single leg Glute bridges + alternating seated bicep curl runners + db floor skull crushers', 'Slider Runners + Slider Hamstring Runners'.

### 3.4 Where athletic work goes
* Always at the **start** of the session. Starting S1 rows 1-4 are three jump lines + 'High Knee Runs FAST'; every Mid/Advanced session opens with jumps or the medball list; boxing Mon/Thu open with medballs, Tue with cardio, Fri with 'Sprint 20/ Recover 40'.
* The **exception is contrast**: jumps placed directly after the heavy lift that primes them (Starting A17/A18; boxing complexes, which sit mid-session).
* Landings ('Drop & Stick - Hold for 3 seconds') come before jumps, jumps before Olympic lifts, Olympic lifts before heavy strength.

### 3.5 Where isolation goes
* Always **last**, always **paired**, never more than 2-3 sets per line. No ISO_CHEST (flies) and no dedicated rear-delt work anywhere in either tab (OBSERVED). Calves get one line each (Advanced H40, boxing L36). Biceps/triceps appear only in Mid/Advanced and boxing wk1-2.

### 3.6 Core placement
Core appears in **every** session of both tabs. It shows up 2-3 ways per session: a control drill in the primer (hollow rocks, rockers, cross connects), paired with a lift (Copenhagen with side raises or unilateral DL, knee tuck-ins with rows), and a finisher (situps/crunches/reverse crunches, Tabata, low plank). Thorax, pelvis and "both" (cross connects, dead bugs, star V-ups) drills all appear, plus frontal-plane work (side planks, Copenhagen), which matches the CONTROL PATTERNSCORE axes 'TRANSVERSE' / 'SAGITAL' / 'FRONTAL'.

### 3.7 Conditioning / optional days
* Athletic tab: no conditioning inside sessions except 'High Knee Runs FAST' (Starting) and the Tabata core; steady cardio optional 'WEDNESDAYS & SATURDAYS max 40 min'.
* Boxing wk1-2: Monday '20 sec fast/ 40 sec slow (cardio of choice)' (AEROBIC CAPACITY CHEAT SHEET band A '20/40 Work:Rest') and Friday '20 min' 'Easy cardio of choice (steady pace)' (band C). One high-intensity and one low-intensity piece per week.
* Boxing wk3-8: Tuesday '20-40 min' 'Cardio of any choice' (band C) and Friday 'Sprint 20/ Recover 40' rounds 5, 5, 6, 6, 7, 8 (band A), plus '3 min Jump Rope' between deadlift sets (Mon). The sprint block is placed **first** on Friday, not as a buy-out.

### 3.8 Loading / joint rules (OBSERVED instruction A6, applied throughout)
"When there are joint pains ... going unilateral ... and going split grips (dumbbells, kbs, indivitual grips)". In practice:
* Pressing is DB-only, often alternating: 'Heavy DB bench presses', 'DB overhead sesaw alternating press', 'fast alternating DB sesaw floor press', 'Standing Overhead DB sesaw push presses'.
* Rows are DB or single-arm.
* Load placement is named Pat-Davidson style: 'IPSILATERAL loading', 'contralateral lunge', 'Db contralateral LOW step up', 'half kneeling ipsilateral'.

### 3.9 Pattern coverage gaps (OBSERVED)
* AP_COD = 0 in both tabs, even though every BYOP athletic session has a COD slot.
* Boxing wk3-8 contain **no horizontal push and no vertical pull**. Upper-body resistance is only 'DB rows', the press of 'Hang Power Clean & Press', and side/front raises.
* No ISO_CHEST, no carries, no neck work.

---

## 4. Quantitative volume

### 4.1 Per-session statistics
"working sets (as written / assumed)" differs only where the coach wrote a non-number: athletic A30 'TABATA' (assumed 4 work bouts each of flutter kicks and hip turns) and D64 '2 to 4' (assumed 3). Throws are excluded from working sets and reported as throw sets / throws.

**STARTING** (3 sessions/week)

| session | line items | movements excl. throws | movements incl. each throw | working sets excl. throws (as written / assumed) | resistance sets (RP+ISO) | athletic sets (AP excl. throws) | core sets | throw sets / throws | high-intensity LB contacts | low-amplitude LB contacts | time-based est. contacts | upper-body plyo contacts | conditioning |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| S1 | 10 | 13 | 13 | 35 | 14 | 16 | 5 | 0 / 0 | 146 | 0 | 210 | 0 | - |
| S2 | 7 | 8 | 27 | 16 / 24 | 9 | 6 | 9 | 19 / 210 | 0 | 0 | 0 | 48 | - |
| S3 | 7 | 10 | 10 | 30 | 21 | 3 | 6 | 0 / 0 | 0 | 0 | 0 | 0 | - |
| **WEEK** | 24 | 31 | 50 | 81 / 89 | 44 | 25 | 20 | 19 / 210 | 146 | 0 | 210 | 48 | - |

**MID** (4 sessions/week)

| session | line items | movements excl. throws | movements incl. each throw | working sets excl. throws (as written / assumed) | resistance sets (RP+ISO) | athletic sets (AP excl. throws) | core sets | throw sets / throws | high-intensity LB contacts | low-amplitude LB contacts | time-based est. contacts | upper-body plyo contacts | conditioning |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| M1 | 10 | 13 | 13 | 21 | 14 | 4 | 3 | 0 / 0 | 16 | 120 | 0 | 0 | - |
| M2 | 14 | 4 | 14 | 10 | 4 | 4 | 2 | 20 / 200 | 0 | 0 | 0 | 0 | - |
| M3 | 8 | 11 | 11 | 25 | 17 | 6 | 2 | 0 / 0 | 55 | 0 | 0 | 0 | - |
| M4 | 16 | 9 | 19 | 15 / 16 | 9 | 0 | 7 | 20 / 200 | 0 | 0 | 0 | 0 | - |
| **WEEK** | 48 | 37 | 57 | 71 / 72 | 44 | 14 | 14 | 40 / 400 | 71 | 120 | 0 | 0 | - |

**ADVANCED** (4 sessions/week)

| session | line items | movements excl. throws | movements incl. each throw | working sets excl. throws (as written / assumed) | resistance sets (RP+ISO) | athletic sets (AP excl. throws) | core sets | throw sets / throws | high-intensity LB contacts | low-amplitude LB contacts | time-based est. contacts | upper-body plyo contacts | conditioning |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| A1 | 6 | 7 | 7 | 14 | 5 | 2 | 7 | 0 / 0 | 32 | 0 | 0 | 0 | - |
| A2 | 6 | 8 | 27 | 19 | 8 | 0 | 11 | 19 / 210 | 0 | 0 | 0 | 0 | - |
| A3 | 8 | 10 | 10 | 17 | 8 | 6 | 3 | 0 / 0 | 0 | 100 | 0 | 0 | - |
| A4 | 6 | 5 | 24 | 9 | 3 | 1 | 5 | 19 / 210 | 0 | 0 | 0 | 0 | - |
| **WEEK** | 26 | 30 | 68 | 59 | 24 | 9 | 26 | 38 / 420 | 32 | 100 | 0 | 0 | - |

**BOXING**

| week / session | line items | movements excl. throws | movements incl. each throw | working sets excl. throws (as written / assumed) | resistance sets (RP+ISO) | athletic sets (AP excl. throws) | core sets | throw sets / throws | high-intensity LB contacts | low-amplitude LB contacts | time-based est. contacts | upper-body plyo contacts | conditioning |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| W1 MON | 8 | 9 | 9 | 24 | 18 | 0 | 6 | 0 / 0 | 0 | 0 | 0 | 0 | 20 s fast / 40 s slow intervals x1 |
| W1 TUE | 7 | 6 | 25 | 18 | 18 | 0 | 0 | 19 / 190 | 0 | 0 | 0 | 0 | - |
| W1 THU | 7 | 8 | 8 | 20 | 18 | 0 | 2 | 0 / 0 | 0 | 0 | 0 | 0 | - |
| W1 FRI | 6 | 7 | 7 | 18 | 12 | 0 | 6 | 0 / 0 | 0 | 0 | 0 | 0 | Easy steady cardio x1 |
| **W1 total** | 28 | 30 | 49 | 80 | 66 | 0 | 14 | 19 / 190 | 0 | 0 | 0 | 0 | 20 s fast / 40 s slow intervals x1; Easy steady cardio x1 |
| W2 MON | 8 | 9 | 9 | 24 | 18 | 0 | 6 | 0 / 0 | 0 | 0 | 0 | 0 | 20 s fast / 40 s slow intervals x1 |
| W2 TUE | 7 | 6 | 25 | 18 | 18 | 0 | 0 | 19 / 190 | 0 | 0 | 0 | 0 | - |
| W2 THU | 7 | 8 | 8 | 20 | 18 | 0 | 2 | 0 / 0 | 0 | 0 | 0 | 0 | - |
| W2 FRI | 6 | 7 | 7 | 18 | 12 | 0 | 6 | 0 / 0 | 0 | 0 | 0 | 0 | Easy steady cardio x1 |
| **W2 total** | 28 | 30 | 49 | 80 | 66 | 0 | 14 | 19 / 190 | 0 | 0 | 0 | 0 | 20 s fast / 40 s slow intervals x1; Easy steady cardio x1 |
| W3 MON | 8 | 10 | 29 | 30 | 15 | 12 | 3 | 19 / 190 | 60 | 0 | 1080 | 0 | - |
| W3 TUE | 5 | 9 | 9 | 24 | 9 | 12 | 3 | 0 / 0 | 30 | 15 | 0 | 0 | Cardio of any choice x1 |
| W3 THU | 7 | 12 | 31 | 36 | 21 | 9 | 6 | 19 / 190 | 0 | 132 | 0 | 0 | - |
| W3 FRI | 5 | 10 | 10 | 23 | 12 | 7 | 4 | 0 / 0 | 23 | 30 | 0 | 0 | Sprint 20 s / recover 40 s x5 |
| **W3 total** | 25 | 41 | 79 | 113 | 57 | 40 | 16 | 38 / 380 | 113 | 177 | 1080 | 0 | Cardio of any choice x1; Sprint 20 s / recover 40 s x5 |
| W4 MON | 8 | 10 | 29 | 30 | 15 | 12 | 3 | 19 / 190 | 60 | 0 | 1080 | 0 | - |
| W4 TUE | 5 | 9 | 9 | 24 | 9 | 12 | 3 | 0 / 0 | 30 | 15 | 0 | 0 | Cardio of any choice x1 |
| W4 THU | 7 | 12 | 31 | 36 | 21 | 9 | 6 | 19 / 190 | 0 | 132 | 0 | 0 | - |
| W4 FRI | 5 | 10 | 10 | 23 | 12 | 7 | 4 | 0 / 0 | 23 | 30 | 0 | 0 | Sprint 20 s / recover 40 s x5 |
| **W4 total** | 25 | 41 | 79 | 113 | 57 | 40 | 16 | 38 / 380 | 113 | 177 | 1080 | 0 | Cardio of any choice x1; Sprint 20 s / recover 40 s x5 |
| W5 MON | 8 | 10 | 29 | 30 | 15 | 12 | 3 | 19 / 190 | 60 | 0 | 1080 | 0 | - |
| W5 TUE | 5 | 9 | 9 | 24 | 9 | 12 | 3 | 0 / 0 | 30 | 15 | 0 | 0 | Cardio of any choice x1 |
| W5 THU | 7 | 12 | 31 | 36 | 21 | 9 | 6 | 19 / 190 | 0 | 132 | 0 | 0 | - |
| W5 FRI | 5 | 10 | 10 | 27 | 12 | 9 | 6 | 0 / 0 | 39 | 30 | 0 | 0 | Sprint 20 s / recover 40 s x6 |
| **W5 total** | 25 | 41 | 79 | 117 | 57 | 42 | 18 | 38 / 380 | 129 | 177 | 1080 | 0 | Cardio of any choice x1; Sprint 20 s / recover 40 s x6 |
| W6 MON | 8 | 10 | 29 | 30 | 15 | 12 | 3 | 19 / 190 | 60 | 0 | 1080 | 0 | - |
| W6 TUE | 5 | 9 | 9 | 24 | 9 | 12 | 3 | 0 / 0 | 30 | 15 | 0 | 0 | Cardio of any choice x1 |
| W6 THU | 7 | 12 | 31 | 36 | 21 | 9 | 6 | 19 / 190 | 0 | 132 | 0 | 0 | - |
| W6 FRI | 5 | 10 | 10 | 27 | 12 | 9 | 6 | 0 / 0 | 39 | 30 | 0 | 0 | Sprint 20 s / recover 40 s x6 |
| **W6 total** | 25 | 41 | 79 | 117 | 57 | 42 | 18 | 38 / 380 | 129 | 177 | 1080 | 0 | Cardio of any choice x1; Sprint 20 s / recover 40 s x6 |
| W7 MON | 8 | 10 | 29 | 24 | 11 | 11 | 2 | 19 / 190 | 60 | 0 | 720 | 0 | - |
| W7 TUE | 5 | 9 | 9 | 20 | 8 | 8 | 4 | 0 / 0 | 20 | 10 | 0 | 0 | Cardio of any choice x1 |
| W7 THU | 7 | 12 | 31 | 33 | 18 | 9 | 6 | 19 / 190 | 0 | 92 | 0 | 0 | - |
| W7 FRI | 5 | 10 | 10 | 27 | 13 | 10 | 4 | 0 / 0 | 36 | 40 | 0 | 0 | Sprint 20 s / recover 40 s x7 |
| **W7 total** | 25 | 41 | 79 | 104 | 50 | 38 | 16 | 38 / 380 | 116 | 142 | 720 | 0 | Cardio of any choice x1; Sprint 20 s / recover 40 s x7 |
| W8 MON | 8 | 10 | 29 | 30 | 16 | 11 | 3 | 19 / 190 | 40 | 0 | 1440 | 0 | - |
| W8 TUE | 5 | 9 | 9 | 30 | 12 | 12 | 6 | 0 / 0 | 30 | 15 | 0 | 0 | Cardio of any choice x1 |
| W8 THU | 7 | 12 | 31 | 39 | 22 | 11 | 6 | 19 / 190 | 0 | 92 | 0 | 0 | - |
| W8 FRI | 5 | 10 | 10 | 37 | 18 | 14 | 5 | 0 / 0 | 46 | 60 | 0 | 0 | Sprint 20 s / recover 40 s x8 |
| **W8 total** | 25 | 41 | 79 | 136 | 68 | 48 | 20 | 38 / 380 | 116 | 167 | 1440 | 0 | Cardio of any choice x1; Sprint 20 s / recover 40 s x8 |

### 4.2 Weekly sets per canonical bucket
'aw' = as written; the other athletic columns are 'assumed'. Boxing has no non-numeric set cells, so as written = assumed.

| bucket | ATH START aw | ATH START | ATH MID aw | ATH MID | ATH ADV | BOX W1 | BOX W2 | BOX W3 | BOX W4 | BOX W5 | BOX W6 | BOX W7 | BOX W8 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| AP_PLYO | 17 | 17 | 10 | 10 | 3 | 0 | 0 | 25 | 25 | 27 | 27 | 23 | 26 |
| AP_JUMP_LIMITED_KNEE | 0 | 0 | 0 | 0 | 2 | 0 | 0 | 3 | 3 | 3 | 3 | 2 | 4 |
| AP_THROW | 19 | 19 | 40 | 40 | 38 | 19 | 19 | 38 | 38 | 38 | 38 | 38 | 38 |
| AP_COD | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| AP_SPRINT | 2 | 2 | 0 | 0 | 0 | 0 | 0 | 3 | 3 | 3 | 3 | 4 | 6 |
| AP_TRIPLE_EXT | 6 | 6 | 4 | 4 | 4 | 0 | 0 | 9 | 9 | 9 | 9 | 9 | 12 |
| RP_BKD | 3 | 3 | 0 | 0 | 0 | 6 | 6 | 3 | 3 | 3 | 3 | 2 | 3 |
| RP_BHD | 6 | 6 | 4 | 4 | 5 | 6 | 6 | 9 | 9 | 9 | 9 | 10 | 16 |
| RP_UKD | 5 | 5 | 6 | 7 | 3 | 6 | 6 | 12 | 12 | 12 | 12 | 10 | 12 |
| RP_UHD | 6 | 6 | 5 | 5 | 2 | 6 | 6 | 3 | 3 | 3 | 3 | 2 | 3 |
| RP_HPUSH | 0 | 0 | 4 | 4 | 0 | 6 | 6 | 0 | 0 | 0 | 0 | 0 | 0 |
| RP_VPUSH | 3 | 3 | 2 | 2 | 2 | 6 | 6 | 3 | 3 | 3 | 3 | 4 | 6 |
| RP_HPULL | 3 | 3 | 2 | 2 | 2 | 6 | 6 | 3 | 3 | 3 | 3 | 4 | 6 |
| RP_VPULL | 3 | 3 | 4 | 4 | 0 | 6 | 6 | 0 | 0 | 0 | 0 | 0 | 0 |
| ISO_QUAD | 3 | 3 | 2 | 2 | 2 | 6 | 6 | 6 | 6 | 6 | 6 | 4 | 6 |
| ISO_HAM | 6 | 6 | 2 | 2 | 0 | 6 | 6 | 9 | 9 | 9 | 9 | 6 | 9 |
| ISO_CHEST | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| ISO_SIDE_REAR_DELT | 6 | 6 | 2 | 2 | 2 | 0 | 0 | 6 | 6 | 6 | 6 | 6 | 4 |
| ISO_BICEP | 0 | 0 | 5 | 5 | 2 | 3 | 3 | 0 | 0 | 0 | 0 | 0 | 0 |
| ISO_TRICEP | 0 | 0 | 5 | 5 | 2 | 3 | 3 | 0 | 0 | 0 | 0 | 0 | 0 |
| ISO_CALF | 0 | 0 | 0 | 0 | 2 | 0 | 0 | 3 | 3 | 3 | 3 | 2 | 3 |
| CT_CORE_THORAX | 0 | 0 | 4 | 4 | 11 | 11 | 11 | 6 | 6 | 6 | 6 | 7 | 9 |
| CP_CORE_PELVIS | 0 | 8 | 3 | 3 | 5 | 0 | 0 | 6 | 6 | 6 | 6 | 4 | 6 |
| CORE_OTHER | 12 | 12 | 7 | 7 | 10 | 3 | 3 | 4 | 4 | 6 | 6 | 5 | 5 |
| COND_AEROBIC | 0 | 0 | 0 | 0 | 0 | 2 | 2 | 1 | 1 | 1 | 1 | 1 | 1 |
| COND_SPRINT_BUYOUT | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 5 | 5 | 6 | 6 | 7 | 8 |
| FOCUS | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| FUNCTIONAL | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| **working sets excl. throws & cond** | 81 | 89 | 71 | 72 | 59 | 80 | 80 | 113 | 113 | 117 | 117 | 104 | 136 |
| resistance (RP+ISO) | 44 | 44 | 43 | 44 | 24 | 66 | 66 | 57 | 57 | 57 | 57 | 50 | 68 |
| athletic (AP excl. throws) | 25 | 25 | 14 | 14 | 9 | 0 | 0 | 40 | 40 | 42 | 42 | 38 | 48 |
| core | 12 | 20 | 14 | 14 | 26 | 14 | 14 | 16 | 16 | 18 | 18 | 16 | 20 |
| throw sets | 19 | 19 | 40 | 40 | 38 | 19 | 19 | 38 | 38 | 38 | 38 | 38 | 38 |
| throws (reps) | 210 | 210 | 400 | 400 | 420 | 190 | 190 | 380 | 380 | 380 | 380 | 380 | 380 |

### 4.3 Weekly sets per muscle

**Resistance / hypertrophy sets** (RP + ISO + core; AP excluded):

| muscle | ATH START | ATH MID | ATH ADV | BOX W1 | BOX W2 | BOX W3 | BOX W4 | BOX W5 | BOX W6 | BOX W7 | BOX W8 |
|---|---|---|---|---|---|---|---|---|---|---|---|
| quads | 11 | 9 | 6 | 18 | 18 | 21 | 21 | 21 | 21 | 16 | 21 |
| glutes | 18.5 | 16 | 10 | 21 | 21 | 25.5 | 25.5 | 25.5 | 25.5 | 23 | 32.5 |
| hamstrings | 16.5 | 8.5 | 6 | 18 | 18 | 21 | 21 | 21 | 21 | 18 | 28 |
| chest | 1.5 | 5 | 1 | 9 | 9 | 1.5 | 1.5 | 1.5 | 1.5 | 2 | 3 |
| lats_upper_back | 6 | 6 | 2 | 12 | 12 | 3 | 3 | 3 | 3 | 4 | 6 |
| front_delts | 6 | 6 | 2 | 12 | 12 | 6 | 6 | 6 | 6 | 7 | 8 |
| side_delts | 4.5 | 3 | 3 | 3 | 3 | 4.5 | 4.5 | 4.5 | 4.5 | 5 | 5 |
| rear_delts | 1.5 | 1 | 1 | 3 | 3 | 1.5 | 1.5 | 1.5 | 1.5 | 2 | 3 |
| biceps | 3 | 8 | 3 | 9 | 9 | 1.5 | 1.5 | 1.5 | 1.5 | 2 | 3 |
| triceps | 1.5 | 8 | 3 | 9 | 9 | 1.5 | 1.5 | 1.5 | 1.5 | 2 | 3 |
| calves | 0 | 0 | 2 | 0 | 0 | 3 | 3 | 3 | 3 | 2 | 3 |
| abs_obliques | 20 | 14 | 26 | 14 | 14 | 16 | 16 | 18 | 18 | 16 | 20 |

**Athletic exposure sets** (AP_* only, same weighting idea: AP_PLYO quads 1 / glutes 0.5 / calves 0.5; AP_JUMP_LIMITED_KNEE calves 1 / quads 0.5; AP_THROW abs 1; AP_SPRINT hamstrings 1 / glutes 0.5 / calves 0.5; AP_TRIPLE_EXT glutes 1 / quads, hamstrings, calves, upper back 0.5; plyo push-ups chest 1 / triceps, front delts 0.5):

| muscle | ATH START | ATH MID | ATH ADV | BOX W1 | BOX W2 | BOX W3 | BOX W4 | BOX W5 | BOX W6 | BOX W7 | BOX W8 |
|---|---|---|---|---|---|---|---|---|---|---|---|
| quads | 17 | 12 | 6 | 0 | 0 | 31 | 31 | 33 | 33 | 28.5 | 34 |
| glutes | 14 | 9 | 5.5 | 0 | 0 | 23 | 23 | 24 | 24 | 22.5 | 28 |
| hamstrings | 5 | 2 | 2 | 0 | 0 | 7.5 | 7.5 | 7.5 | 7.5 | 8.5 | 12 |
| chest | 3 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| lats_upper_back | 3 | 2 | 2 | 0 | 0 | 4.5 | 4.5 | 4.5 | 4.5 | 4.5 | 6 |
| front_delts | 1.5 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| side_delts | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| rear_delts | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| biceps | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| triceps | 1.5 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| calves | 11 | 7 | 5.5 | 0 | 0 | 21.5 | 21.5 | 22.5 | 22.5 | 20 | 26 |
| abs_obliques | 19 | 40 | 38 | 19 | 19 | 38 | 38 | 38 | 38 | 38 | 38 |

Reading against the coach's "~15-20 sets per muscle per week":
* Only **boxing wk1-2 legs** sit in that band (quads 18, glutes 21, hamstrings 18).
* Boxing wk3-8 legs are at or above it (quads 16-21, glutes 23-32.5, hamstrings 18-28) once lunges, step-ups, hinge complexes and leg ext/curls are added up.
* Upper-body prime movers (chest, lats/upper back, front delts, biceps, triceps) get 9-12 sets in boxing wk1-2 (side and rear delts 3) and 1-8 everywhere else.
* The athletic tab reaches 15 sets/week only for glutes (Starting 18.5, Mid 16), hamstrings (Starting 16.5) and abs (14-26).
* *INFERRED: in athletic/fighter programs the coach does not chase hypertrophy set targets for the upper body; volume is concentrated on the posterior chain, legs and trunk, and athletic work is added on top.*

### 4.4 Plyo / ballistic volume vs resistance volume (the boxer question)

**Contact inventory** (every contact-bearing movement; boxing sets listed wk1-2 or wk3..wk8):

| program | session | exercise component | bucket | tier | sets | contacts/set | contacts/week |
|---|---|---|---|---|---|---|---|
| ATH STARTING | S1 | Depth Jump with weight | AP_PLYO | high | 2 | 8 | 16 |
| ATH STARTING | S1 | Depth jump with weight into high box jump | AP_PLYO | high | 2 | 8 | 16 |
| ATH STARTING | S1 | loaded jump squats | AP_PLYO | high | 2 | 8 | 16 |
| ATH STARTING | S1 | High Knee Runs FAST | AP_SPRINT | time | 2 | 105 | 210 |
| ATH STARTING | S1 | Repeat Jump Squat HIGH JUMPs | AP_PLYO | high | 3 | 10 | 30 |
| ATH STARTING | S1 | no weight lunge front foot jumps | AP_PLYO | high | 2 | 16 | 32 |
| ATH STARTING | S1 | Lateral mid size box step up jumps | AP_PLYO | high | 3 | 12 | 36 |
| ATH STARTING | S2 | Plyo Push ups - one side raised | AP_PLYO | upper | 3 | 16 | 48 |
| ATH MID | M1 | weighted Depth Drops (stick 3 s) | AP_PLYO | high | 1 | 8 | 8 |
| ATH MID | M1 | High Jumps | AP_PLYO | high | 1 | 8 | 8 |
| ATH MID | M1 | Bilateral Squirrel Jumps | AP_PLYO | low | 1 | 40 | 40 |
| ATH MID | M1 | Single leg Squirrel Jumps | AP_PLYO | low | 1 | 80 | 80 |
| ATH MID | M3 | Weighted Depth Drops (stick 3 s) | AP_PLYO | high | 1 | 8 | 8 |
| ATH MID | M3 | Single Leg to march jumps | AP_PLYO | high | 2 | 16 | 32 |
| ATH MID | M3 | HEX bar loaded Jumps | AP_PLYO | high | 3 | 5 | 15 |
| ATH ADVANCED | A1 | Weighted Depth Drops (stick 3 s) | AP_PLYO | high | 1 | 8 | 8 |
| ATH ADVANCED | A1 | Single Leg to march jumps | AP_PLYO | high | 1 | 24 | 24 |
| ATH ADVANCED | A3 | Squirrel jumps both feet | AP_PLYO | low | 1 | 40 | 40 |
| ATH ADVANCED | A3 | Bilateral jump on to plate | AP_JUMP_LIMITED_KNEE | low | 1 | 20 | 20 |
| ATH ADVANCED | A3 | SL Jump on to plate forward/back | AP_JUMP_LIMITED_KNEE | low | 1 | 40 | 40 |
| BOX W3-8 | MON | Weighted Depth Drops | AP_PLYO | high | 3,3,3,3,3,2 | 8 | 24,24,24,24,24,16 |
| BOX W3-8 | MON | Single Leg to high march jump | AP_PLYO | high | 3,3,3,3,3,2 | 12 | 36,36,36,36,36,24 |
| BOX W3-8 | MON | 3 min Jump Rope | AP_JUMP_LIMITED_KNEE | time | 3,3,3,3,2,4 | 360 | 1080,1080,1080,1080,720,1440 |
| BOX W3-8 | TUE | Tuck jumps | AP_PLYO | high | 3,3,3,3,2,3 | 5 | 15,15,15,15,10,15 |
| BOX W3-8 | TUE | DB squat jumps | AP_PLYO | high | 3,3,3,3,2,3 | 5 | 15,15,15,15,10,15 |
| BOX W3-8 | TUE | Squirrel jumps | AP_PLYO | low | 3,3,3,3,2,3 | 5 | 15,15,15,15,10,15 |
| BOX W3-8 | THU | SL Squirrel jumps (REVERSE BANDED) | AP_PLYO | low | 3,3,3,3,2,2 | 40 | 120,120,120,120,80,80 |
| BOX W3-8 | THU | 4 hops | AP_PLYO | low | 3,3,3,3,3,3 | 4 | 12,12,12,12,12,12 |
| BOX W3-8 | FRI | Drop into Box Jumps | AP_PLYO | high | 1,1,3,3,2,2 | 8 | 8,8,24,24,16,16 |
| BOX W3-8 | FRI | broad jumps | AP_PLYO | high | 3,3,3,3,4,6 | 5 | 15,15,15,15,20,30 |
| BOX W3-8 | FRI | High Knee runs | AP_SPRINT | low | 3,3,3,3,4,6 | 10 | 30,30,30,30,40,60 |

**Weekly comparison:**

| program / week | high-intensity LB contacts | low-amplitude LB contacts | total counted LB contacts | per session | high-intensity per session | time-based est. (high knees / jump rope) | upper-body plyo contacts | medball throws | athletic sets (AP excl. throws) | resistance sets (RP+ISO) | athletic share of working sets | LB contacts per resistance set |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| ATH STARTING (3 d/wk) | 146 | 0 | 146 | 48.7 | 48.7 | 210 | 48 | 210 | 25 | 44 | 28.1% | 3.32 |
| ATH MID (4 d/wk) | 71 | 120 | 191 | 47.8 | 17.8 | 0 | 0 | 400 | 14 | 44 | 19.4% | 4.34 |
| ATH ADVANCED (4 d/wk) | 32 | 100 | 132 | 33.0 | 8.0 | 0 | 0 | 420 | 9 | 24 | 15.3% | 5.5 |
| BOX W1 (4 d/wk) | 0 | 0 | 0 | 0.0 | 0.0 | 0 | 0 | 190 | 0 | 66 | 0.0% | 0.0 |
| BOX W2 (4 d/wk) | 0 | 0 | 0 | 0.0 | 0.0 | 0 | 0 | 190 | 0 | 66 | 0.0% | 0.0 |
| BOX W3 (4 d/wk) | 113 | 177 | 290 | 72.5 | 28.2 | 1080 | 0 | 380 | 40 | 57 | 35.4% | 5.09 |
| BOX W4 (4 d/wk) | 113 | 177 | 290 | 72.5 | 28.2 | 1080 | 0 | 380 | 40 | 57 | 35.4% | 5.09 |
| BOX W5 (4 d/wk) | 129 | 177 | 306 | 76.5 | 32.2 | 1080 | 0 | 380 | 42 | 57 | 35.9% | 5.37 |
| BOX W6 (4 d/wk) | 129 | 177 | 306 | 76.5 | 32.2 | 1080 | 0 | 380 | 42 | 57 | 35.9% | 5.37 |
| BOX W7 (4 d/wk) | 116 | 142 | 258 | 64.5 | 29.0 | 720 | 0 | 380 | 38 | 50 | 36.5% | 5.16 |
| BOX W8 (4 d/wk) | 116 | 167 | 283 | 70.8 | 29.0 | 1440 | 0 | 380 | 48 | 68 | 35.3% | 4.16 |

**What the numbers say (OBSERVED), and how to read them (*INFERRED*):**
1. **Weeks 1-2 of the boxer have zero plyometrics.** The only ballistic work is one medball list (190 throws). The athletic tab's Starting block opens with 146 high-intensity contacts in week 1. *Boxers earn plyos after a 2-week hypertrophy/GPP base.*
2. **In weeks 3-8 the boxer's counted contacts are not lower than the athletic example's.** They run 258-306/week (72.5-76.5 per session) against 146 / 191 / 132 for athletic Starting / Mid / Advanced, and the share of athletic sets is 35-37% against 28 / 19 / 15%. **So "boxers need fewer plyos" is NOT visible as fewer contacts when compared with this generic athletic example.** There is no basketball or MMA example in these tabs to compare against directly.
3. **Type and packaging are where the boxer differs:**
   * More than half of the boxer's contacts are low-amplitude reactive ones: 142-177/week from 'Squirrel jumps single leg (REVERSE BANDED)' 20/20, squirrel jumps inside the squat complex, hops and high knees. On top of that come an estimated 720-1440 jump-rope contacts.
   * The high-intensity jumps are small doses: 5 reps inside complexes, depth drops 8 (landing only), 'Single Leg to high march jump' 6/6, box jumps 8 at 1-3 sets.
   * High-intensity contacts per session are 28-32 for the boxer vs 48.7 for athletic Starting. Max-height bilateral jumping is lower. *INFERRED: the boxer's "plyo" is footwork-style stiffness/bounce (ankle-dominant, single-leg, fast SSC), not jump height.*
4. **Volume steering within the boxing block:**
   * Single-leg reactive plyos and depth drops are cut to 2 sets in week 8 (and SL squirrel jumps already in week 7).
   * The complexes carrying broad jumps ramp to 6 sets, so high-intensity contacts stay flat (113 -> 129 -> 116) while resistance and conditioning rise.
5. **Medball volume is large in both tabs:** 190-420 throws/week. The boxer doubles from 190 (wk1-2) to 380 (wk3-8). Rotation is the dominant throw type: 10 of the 19 throws are rotational or into/out-of-hip, and Mid uses only the rotational ten.

---

## 5. Rep ranges, intensity, rest, tempo

### 5.1 Reps by bucket (per set, per side where unilateral; time-based in seconds)

| bucket | STARTING | MID | ADVANCED | BOX_W1_2 | BOX_W3_8 |
|---|---|---|---|---|---|
| AP_PLYO | 8, 10, 12 | 4-6, 8, 40 | 8, 12, 40 | - | 4, 5, 6, 8, 20 |
| AP_JUMP_LIMITED_KNEE | - | - | 20 | - | 180 s |
| AP_THROW | 10, 20 | 10 | 10, 20 | 10 | 10 |
| AP_SPRINT | 30 s | - | - | - | 5 |
| AP_TRIPLE_EXT | 8 | 6, 8 | 3, 6 | - | 8, 10, 12 |
| RP_BKD | 3 | - | - | 10 | 3 |
| RP_BHD | 6, 12 | 6, 6-8 | 1, 6 | 10 | 4, 5, 6 |
| RP_UKD | 8, 10 | 8, 10 | 6, 8 | 10 | 6, 8 |
| RP_UHD | 8, 12 | 6, 12 | 6 | 10 | 6 |
| RP_HPUSH | - | 6, 8 | - | 10 | - |
| RP_VPUSH | 12 | 8 | 8 | 10 | 12 |
| RP_HPULL | 12 | 8 | 8 | 10 | 20 |
| RP_VPULL | 30 | 8-12; 20 s | - | 10 | - |
| ISO_QUAD | 16 | 8 | 20 | 10 | 6, 20 |
| ISO_HAM | 8, 16 | 8 | - | 10 | 6, 20; 30 s |
| ISO_SIDE_REAR_DELT | 8 | 8 | 8 | - | 20 |
| ISO_BICEP | - | 12 | 12 | 10 | - |
| ISO_TRICEP | - | 12 | 12 | 15 | - |
| ISO_CALF | - | - | 8 | - | 3 |
| CT_CORE_THORAX | - | 15, 50 | 20, 50; 60 s | 10, 15, 20 | 10, 25 |
| CP_CORE_PELVIS | 20 s | 50; 50 s | 50; 50 s | - | 30 s, 50 s |
| CORE_OTHER | 8, 20, 30; 30 s | 12, 20, 50 | 12, 20, 50 | 30 s | 8, 20 |
| COND_AEROBIC | - | - | - | 20 s, 1200 s | 1800 s |
| COND_SPRINT_BUYOUT | - | - | - | - | 20 s |

### 5.2 Big vs small muscles (OBSERVED)
* **Big-muscle compounds (RP_*)** run from 1 rep ('DEADLIFTS (1RIR)' 3x1) to 12/side (rows, push presses, SL glute bridges). Two exceptions are speed-intent pulling ('Banded fast LAT PULL DOWNS Single Arm' '30---30'; 'Max speed banded lat pull downs' '20 sec.') and the 20-rep DB row in the boxing pair. The typical heavy work is 6-8 (athletic) and 10 (boxing wk1-2). Complex lifts are 3-4 reps ('3 Heavy SQUATs', '4 Deadlifts'); heavy unilateral work is 6-8/side.
* **Big-muscle isolation** (leg ext / leg curls) runs 6-20. Boxing wk3-8 does both ends in the same week: Monday 'Leg ext. Leg Curls (FULL RANGE OF MOTION)' '6 & 6' and Thursday the same line at '20/20'. That is a heavy/light undulation of the same exercise.
* **Small-muscle isolation** runs 8-20: curls 10-12, triceps 12-15, side/front raises 8-20, calf raises 3-8 (calves get little direct work; *INFERRED: jumps and jump rope cover them*). This matches the coach's statement that smaller muscles take more reps.
* **Olympic / triple extension** runs 3-12: power cleans 3x3 (Advanced) up to 8 ('Heavy Power Cleans' 2x8, 'Clean Pull/ hang Power Clean' 8) and 12 ('Hang Power Clean & Press', likely conditioning-flavoured).
* **Plyos:** landings and max jumps 4-12 per set ('HEX bar loaded Jumps' 4-6, depth jumps/drops 8, repeat jump squats 10, lateral box step-up jumps 12); reactive squirrel jumps 20-40 per leg per set as standalone lines (1 set in the athletic tab, 2-3 in boxing), or 5 inside the boxing squat complex.
* **Medball throws:** 10 per throw (20 for the sit-up throws in the ballistics sheet).
* **Core:** 8-50 reps or 20-60 s.
* The coach's "5 to 30 reps" envelope holds for everything except 1-3-rep strength singles and doubles and the 40-50-rep core/reactive lines.

### 5.3 Effort / intensity
* Athletic tab rules (OBSERVED): A3 '*Always leave 1 rep in the tank, never work up to failure but get as close as you can '; A5 '***The lower the reps, the higher the weight... Always go for 1-3 RIR (REPS IN RESERVE) aka RPE 7+'. The coach equates 1-3 RIR with "RPE 7+".
* Only two lines carry an explicit RIR: 'DEADLIFTS (1RIR)' (athletic Advanced) and 'DEADLIFTS (1-2RIR) + 3 min Jump Rope' (boxing wk3-8).
* Load words: 'HEAVY' / 'Heavy' on 14 athletic lines (6 Starting, 5 Mid, 3 Advanced) and on the boxing squat complex; '(mid weight)' / '(MID WEIGHT)' on low-hang power cleans and on leg ext/curls; 'no weight lunge front foot jumps'; 'LOAD & jump hard'; 'Weighted' depth drops, Bulgarian lunge and calf raises.
* Speed words: 'FAST', 'fast', 'Max speed', 'fast/rythmic', 'Sprint'.
* No %1RM anywhere in these two tabs. The coach uses % in the '(NOT DONE) 4 TRACKS PROGRAMMING' and 'BASEBALL' tabs and in 'ALL ABOUT SQUATS' ('78% of 1RM').

### 5.4 Rest and tempo
* **Rest: not written anywhere in either tab.** Cross-reference 'ALL ABOUT SQUATS': '*REST 1-2 MIN BETWEEN SETS' (hypertrophy), '*REST 3-6 MIN BETWEEN SETS' (strength), '*REST AS PRESCRIBED' (athletic). Interval rest is built into the work:rest notation ('20 on/ 10 off - TABATA TIMER', '20 sec fast/ 40 sec slow', 'Sprint 20/ Recover 40').
* **Tempo / execution cues:** 'Drop & Stick - Hold for 3 seconds on each one' (landing isometric), 'UNBROKEN' / 'unbroken' (no rest inside the set), 'FULL RANGE OF MOTION', '(no leg drive)', 'Heel held up', 'REVERSE BANDED', 'fast/rythmic'. No eccentric tempo counts.

---

## 6. Progression

### 6.1 Athletic: level to level (OBSERVED numbers, weekly, assumed sets)

| metric | STARTING | MID | ADVANCED | Start->Mid | Mid->Adv |
|---|---|---|---|---|---|
| sessions | 3 | 4 | 4 | +1 | 0 |
| working sets (excl. throws) | 89 | 72 | 59 | -19.1% | -18.1% |
| avg working sets / session | 29.7 | 18.0 | 14.8 | -39% | -18% |
| resistance sets (RP+ISO) | 44 | 44 | 24 | 0% | -45.5% |
| athletic sets (AP excl. throws) | 25 | 14 | 9 | -44% | -36% |
| core sets | 20 | 14 | 26 | -30% | +86% |
| medball throws | 210 | 400 | 420 | +90% | +5% |
| high-intensity LB contacts | 146 | 71 | 32 | -51% | -55% |
| low-amplitude LB contacts | 0 | 120 | 100 | new | -17% |
| heaviest prescription | 'HEAVY Hex bar Squats' 3 reps; 'Heavy Snatch grip DL' 3x6 | 'Heavy Deadlifts' 2 x 6-8; 'Heavy Power Cleans' 2x8 | 'DEADLIFTS (1RIR)' 3x1; 'Power Cleans' 3x3 | | |
| typical sets per line | 2-3 (plyos 2) | 1-2 (plyos 1) | 1-3 (plyos 1) | | |

*INFERRED rule:* across the off-season the coach **lowers volume and raises intensity and specificity**:
* fewer sets, lower reps, heavier main lifts;
* jumping moves from bilateral max-intent jumps to single-leg and reactive work (single-leg squirrel jumps, single-leg plate jumps, single-leg march jumps);
* throw volume and core volume go up.

This matches the Starting note sequence 'Bring athletes back to feeling/moving great' -> 'Start ramping up volume of work at highest biomechanical demand' -> 'Introduce more specific unilateral demands' -> 'Drive more strength/power/speed'.

The Advanced level is partly assembled from copies of Mid rows:
* A1 = D41-D43 (same three videos) at 1 set.
* A2 = D63-D67 (cells keep Mid's white bg); the core finisher goes from 1 to 3 sets.
* A4 rows H41-H42 = D37-D38 cut to 1 x '6 & 6'.

### 6.2 Boxing: week to week

| metric | W1 | W2 | W3 | W4 | W5 | W6 | W7 | W8 |
|---|---|---|---|---|---|---|---|---|
| week colour (SETS header bg) | FFFF00 | FFFF00 | EA9999 | EA9999 | E06666 | E06666 | E06666 | CC0000 |
| line-item sets (sum of SETS cells) | 76 | 76 | 69 | 69 | 72 | 72 | 65 | 79 |
| working sets excl. throws & cond | 80 | 80 | 113 | 113 | 117 | 117 | 104 | 136 |
| week-over-week change | - | +0.0% | +41.2% | +0.0% | +3.5% | +0.0% | -11.1% | +30.8% |
| resistance sets (RP+ISO) | 66 | 66 | 57 | 57 | 57 | 57 | 50 | 68 |
| athletic sets (AP excl. throws) | 0 | 0 | 40 | 40 | 42 | 42 | 38 | 48 |
| core sets | 14 | 14 | 16 | 16 | 18 | 18 | 16 | 20 |
| medball throws | 190 | 190 | 380 | 380 | 380 | 380 | 380 | 380 |
| high-intensity LB contacts | 0 | 0 | 113 | 113 | 129 | 129 | 116 | 116 |
| low-amplitude LB contacts | 0 | 0 | 177 | 177 | 177 | 177 | 142 | 167 |
| jump-rope contacts (est. 2/s) | 0 | 0 | 1080 | 1080 | 1080 | 1080 | 720 | 1440 |
| sprint rounds (20 s on / 40 s off) | 0 | 0 | 5 | 5 | 6 | 6 | 7 | 8 |
| sprint work time (s) | 0 | 0 | 100 | 100 | 120 | 120 | 140 | 160 |

Set patterns used in weeks 3-8 (every W3-8 row, verbatim):

| W3-W8 sets pattern | rows using it (verbatim) |
|---|---|
| 3,3,3,3,2,3 | MON 'Copenhagen Plank & Unilateral DL'; MON 'Leg ext. Leg Curls (FULL RANGE OF MOTION)'; TUE 'DB snatches '; TUE '3 Heavy SQUATs + 5 Tuck jumps + 5 DB squat jumps + 5 Squirrel jumps'; TUE 'Jefferson Lunge'; THU 'Weighted Bulgarian Lunge Heel held up + SL Def. Weighted Calf Raises'; THU 'Leg ext. Leg Curls (FULL RANGE OF MOTION)'; FRI 'Slider Runners + Slider Hamstring Runners' |
| 3,3,3,3,3,3 | MON 'Clean Pull/ hang Power Clean'; MON 'Lateral box step up IPSILATERAL LOAD'; THU '8 Box Med Ball rocker into 4 hops + Swiss ball knee tuck ins'; FRI 'Db contralateral LOW step up' |
| 1,1,1,1,1,1 | MON '*MEDBALLS'; TUE 'Cardio of any choice'; THU '*MEDBALLS' |
| 3,3,3,3,3,2 | MON 'Weighted Depth Drops'; MON 'Single Leg to high march jump'; THU 'Side Raises + Front Raises' |
| 3,3,3,3,4,6 | TUE 'Single Leg swiss ball knee tuck in + DB rows'; THU 'Hang Power Clean & Press'; FRI '4 Deadlifts - 5 broad jumps - 5 KB swings - 5/5 High Knee runs' |
| 3,3,3,3,2,4 | MON 'DEADLIFTS (1-2RIR) + 3 min Jump Rope' |
| 3,3,3,3,2,2 | THU 'Squirrel jumps single leg (REVERSE BANDED)' |
| 5,5,6,6,7,8 | FRI 'Sprint 20/ Recover 40' |
| 1,1,3,3,2,2 | FRI 'Drop into Box Jumps + 20/20 Star Toe touches' |

*INFERRED reading:*
* **Wk1-2 is a GPP / hypertrophy base.** Every lift is 3x10, upper/lower split, each pattern twice a week, with no plyos and no Olympic lifts.
* **Wk3 is a phase change, not a % increase.** The exercise list is replaced. Component working sets rise 41% (113 vs 80) even though line-item sets fall from 76 to 69: one complex line now holds 4 movements.
* **Wk3-6 hold steady in 2-week steps**, with only small adds (Friday box jumps 1 -> 3, sprints 5 -> 6). W4 -> W5 is +3.5%, the one change that matches the coach's "3-5%" weekly idea.
* **Wk7 is a mini-deload for accessories and reactive plyos** (eleven rows 3 -> 2) while the three ramping rows go up (3 -> 4) and sprints go up (6 -> 7). Net -11%.
* **Wk8 is the peak** (dark red CC0000):
  * the ramping rows double to 6 sets;
  * deadlift + jump rope goes to 4;
  * accessories return to 3;
  * reactive single-leg work drops to 2;
  * sprints reach 8 rounds;
  * net +31% working sets vs wk7, +20% vs wk3.
* **Conditioning progresses most smoothly:** sprint rounds 5, 5, 6, 6, 7, 8 (+60% total, about +9.9%/week compounded).

### 6.3 Against the coach's stated "3%, 5%, 7% weekly increments"
* Observed boxing week-over-week changes in working sets: 0%, +41%, 0%, +3.5%, 0%, -11%, +31%.
* Resistance-only (RP+ISO): 66, 66, 57, 57, 57, 57, 50, 68.
* So this example progresses in **steps and waves** (hold-hold-step, a dip, then a peak), not as a smooth weekly % creep. The athletic tab has no week-to-week changes at all.
* *INFERRED:* the smooth 3/5/7% rule probably applies to hypertrophy-focus programs or to a single muscle being specialised. Athletic and fighter blocks use 2-week steps plus a deload/peak wave. See the open questions.

---

## 7. What this reveals about the coach's thinking (*all INFERRED*)

1. **Base, then convert.** The boxer gets 2 weeks of plain 3x10 bodybuilding work on an upper/lower split before any jumping. The athletic Starting phase is about "feeling/moving great" before power. Hypertrophy and tissue capacity come first; athletic patterns are layered on afterwards.
2. **Progression = less volume, more intent.** Across Starting -> Mid -> Advanced, working sets fall about 19% per step and main-lift reps fall (6-8 -> 1), while throw volume, core volume, single-leg demand and speed cues rise. A generator should not simply add sets as athletes advance.
3. **Contrast is the bridge between resistance and athletic patterns.** A heavy lift is followed immediately by a jump in the same stance/pattern: bilateral squat -> squat jumps, FFE lunge -> lunge jumps, deadlift -> broad jump -> KB swing -> high knees. For the fighter, these complexes are the main lever (3 -> 6 sets).
4. **Plyos are dosed by type.**
   * Landings ('Drop & Stick ... 3 seconds'): 1-3 x 8, always first.
   * Max-intent jumps: 1-3 x 5-12.
   * Fastest-SSC reactive jumps (squirrel jumps; Sheet23 calls them 'FASTEST SSC'): 1-3 sets of 20-80 contacts.
   * Loaded jumps: 3 x 4-6.
   * The sport changes the mix (boxer = single-leg, reactive, rope; general athlete = bilateral height and landings) more than it changes the contact count.
5. **Joint-friendly loading by default.** DBs, alternating ('sesaw') presses, single-arm rows, unilateral lower body and named ipsilateral/contralateral load placement follow instruction A6 and the Pat Davidson vocabulary.
6. **Rotation and the hips are trained explicitly.** The medball list is organised biomechanically: sagittal push/pull-down, then rotational R/L pairs, then a 2x2 half-kneeling matrix described 'INTO THE LEFT LEG/HIP' / 'OUT OF THE RIGHT LEG/HIP'. Core work spans thorax, pelvis and "both", across sagittal, frontal and transverse planes.
7. **Sport-specific removal is as important as addition.** The boxer loses all bench pressing, pull-ups and arm isolation after week 2 (punching and bag work presumably supply upper-body volume and the coach protects the shoulders). Jump rope and 20/40 sprints are added.
8. **Isolation is a finisher, always paired**, with small muscles at 12-20 reps and leg ext/curl used both heavy (6) and light (20) in the same week.
9. **Colour = intensity tier.** Green / yellow / red marks beginner / intermediate / advanced. In the boxer, yellow -> light red -> red -> dark red marks the weekly build to a peak. A generator UI can reuse this traffic-light language.

---

## 8. Data-quality notes (OBSERVED)
* **Date-coerced reps:**
  * E18 2021-06-08 (`m-d`) = '6-8'; E19 = '8-12'; E44 = '4-6'.
  * B28 and B29 2021-08-08 (`m/d`) = '8/8'.
  * Boxing K9, K11, K47 2022-06-06 = '6/6'; K23 2022-08-08 = '8/8'.
* **A43 text cell** has number format `mm/dd` (harmless).
* **Hidden tab:** the boxing tab is hidden, so a user browsing the workbook will not see it.
* **Copied rows:** the Mid column (D-F rows 12-67) and the copied Advanced rows H21-H25 carry an explicit white background (`theme0`), a copy-paste trace.
* **Ambiguous cells:**
  * A36 'SUPERSET:' has no named partner.
  * D21 'Plate core & leg extensions / nordic curls' with reps '15 & 8' (two numbers, three exercises).
  * Boxing L13 '50/50 ' gives no reps for the unilateral DL.
  * L36 '6/6 - 3'.
  * L34 '8 Box Med Ball rocker into 4 hops' (4 or 32 hops).
* **Core classification conflicts between the coach's own tabs:**
  * Library O15/O16 list 'Toes to bar' and 'Knees to chest' under CORE THORAX; CONTROL PATTERNSCORE lists them under CORE PELVIS (this decode follows the library).
  * 'Plank' is CORE THORAX in the library and 'BOTH' in CONTROL PATTERNSCORE.
* **'Med Ball Rockers'** is labelled 'Transverse core' in BASEBALL. The labels in that tab look shifted in places, but every candidate label is a core label, so it is bucketed as core, not plyo.
* **Starting 'Side Plank presses (advanced does star side plank presses)'** shows levels share a template with harder variants for advanced athletes, but the Advanced column does not contain that line.

---

## 9. Open questions for the coach
1. **Phases or levels?** Are 'STARTING' / ' MID' / ' ADVANCED OFF SEASON WORKOUTS' three consecutive 8-week blocks of one off-season ('8wk1' -> '8wk2' -> '8wk3'), or three athlete levels? How long are Mid and Advanced, and does anything change week to week inside a block?
2. **Which weekdays?** Which days are WORKOUT 1-4 (Mon/Tue/Thu/Fri with cardio Wed/Sat?), and which 3 days does Starting use?
3. **What is 'ALL LIST' / 'SEE LIST'?** One pass through the 19 core throws (about 190-210 throws), or also the 9 'SPECIALTIES' and 7 'CORE EXTRAS' in the ballistics sheet? Why does Mid use only the 10 rotational throws at 2x10?
4. **Boxers vs other sports on plyos.** You said boxers need fewer plyos than basketball/MMA. In this boxing example weeks 3-8 have about 113-129 high-intensity plus 142-177 low-amplitude contacts per week (plus jump rope), which is more than the athletic example's Mid/Advanced (191 / 132). Is "fewer" about amplitude/height (fewer max jumps, more bouncing), not total contacts? What weekly contact range would you give a basketball player and an MMA fighter in the same phase?
5. **Missing upper body.** Weeks 3-8 of the boxer remove all bench pressing, pull-ups/pull-downs and arm isolation. Is that deliberate (punching volume, shoulder health)? Should the generator remove HPUSH/VPULL for every striking sport after the base phase?
6. **Weeks 7-8 wave.** Week 7 drops eleven rows to 2 sets while the three ramping rows go to 4; week 8 doubles them to 6. Is week 8 a planned overreach before a camp or test? What follows week 8?
7. **Progression rule.** The boxer progresses in 2-week steps (0%, +41%, 0%, +3.5%, 0%, -11%, +31%), not the 3/5/7% weekly increments you described. When should the generator use smooth % increments, and when step/wave blocks?
8. **Rest periods** for contrasts/complexes and for primer plyos: the tabs give none. Use 'ALL ABOUT SQUATS' (1-2 min hypertrophy, 3-6 min strength, 'AS PRESCRIBED' athletic)?
9. **Ambiguous cells:**
   * Does '8 & 8' on 'Heavy DB bench presses' mean per arm or two sets of 8?
   * What are the unilateral DL reps in boxing '50/50 '?
   * What does the '3' in '6/6 - 3' mean (calf raise reps or seconds)?
   * Is 'Plate core & leg extensions / nordic curls' three exercises or leg extensions OR nordics?
   * Is '8 Box Med Ball rocker into 4 hops' 4 or 32 hops?
   * Which drill is 'Plate core'?
   * Is 'Med ball rolls' a roll-out or cross-connect rolls?
   * What is the partner of A36 'SUPERSET: Low Hang Power Cleans'?
10. **Core taxonomy.** Are toes-to-bar and knees-to-chest CORE THORAX (library) or CORE PELVIS (CONTROL PATTERNSCORE)? Are 'Med Ball Rockers' transverse or sagittal core?
11. **No COD.** Why do neither example contain change-of-direction work when every BYOP athletic session has a COD slot? Is COD handled in sport practice?
12. **Sprint mode.** For 'Sprint 20/ Recover 40', run, bike or bag? How many rounds does the week 1-2 '20 sec fast/ 40 sec slow (cardio of choice)' 1-set line contain?
13. **Primer dosing.** How do you choose 1 set (Mid/Advanced primers) vs 2 sets (Starting jumps), and 40-80 reactive contacts vs 8 landings?
14. **Calves.** Calves get almost no direct work in either example (calves 0-3 sets/week). Do jumps, jump rope and squirrel jumps count as the calf volume in your model?
