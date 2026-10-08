# L4 - MASTER EXERCISE LIBRARY columns AV-BE, and the two library copies

Scope: BYOP workbook ("BUILD YOUR OWN PROGRAM - BLAZE CAMP MODEL"), tab `MASTER EXERCISE LIBRARY`, columns **AV through BE** (SETS, REPS, EFFORT, FEELING, FULL FOCUS LIST, CARRY, DRAGS, FUNCTIONAL BIOMECHANICS SYSTEM), plus a cell-by-cell comparison of `Copy of MASTER EXERCISE LIBRARY` and `Copy of Copy of MASTER EXERCISE` against the master.
Everything was read from `raw/BYOP.xlsx` with openpyxl (values, fills, fonts, merges, validations) and cross-checked against the text dumps. Read-only: no Google Sheet was touched.

Companion files (same folder):
- `L4_focus_functional.json` - 82 records: 68 exercises (51 focus-list + 17 functional) + 9 empty taxonomy nodes + 5 "integration" labels.
- `L4_dosing_vocab.json` - full SETS / REPS / EFFORT / FEELING vocabulary with observed usage.
- `L4_slot_wiring.md` - every program slot -> library range, with miswired / truncated flags.

Convention: **OBSERVED** = in the sheet. *Inferred* = my interpretation. Coach labels are quoted verbatim (typos kept); my own names use correct spelling.

---

## 1. What AV-BE looks like (OBSERVED)

The library's 6 header rows (A-column labels: A3 'ZONE', A4 'PATTERN', A6 'PURPOSE'; row 5 is an unlabelled sub-pattern row; row 2 is 'FILL HERE' in near-invisible F3F3F3 font; row 7 is the green 'CHOOSE 👇' placeholder):

| Col | Row 1 (bg EFEFEF) | Row 2 | Row 3 ZONE | Row 4 PATTERN | Row 5 | Row 6 PURPOSE | Row 7 | Content rows |
|---|---|---|---|---|---|---|---|---|
| AV | 'SETS' | 'FILL HERE' | - | - | - | 'SETS' (no fill) | 'CHOOSE 👇' | 8-16 |
| AW | 'REPS' | 'FILL HERE' | - | - | - | 'REPS' | 'CHOOSE 👇' | 8-14 |
| AX | 'EFFORT' | 'FILL HERE' | - | - | - | 'EFFORT' | 'CHOOSE 👇' | 8-17 |
| AY | 'FEELING' | 'FILL HERE' | - | - | - | 'FEELING' | 'CHOOSE 👇' | 8-11 |
| AZ | 'FULL FOCUS LIST' | 'FILL HERE' | - | - | - | 'MUSCLE FOCUS OPTIONS' (bg EAD1DC) | 'CHOOSE 👇' | 8-332 |
| BA | 'CARRY' | - | - | - | - | 'CARRY' (EAD1DC) | 'CHOOSE 👇' | 8-14 |
| BB | 'DRAGS' | - | - | - | - | 'DRAG' (EAD1DC) | 'CHOOSE 👇' | 8-10 |
| BC | 'FUNCTIONAL BIOMECHANICS SYSTEM' (merged BC1:BE1) | 'FILL HERE' | - | 'FUNCTIONAL' (EAD1DC) | - | 'ANTERIOR OBLIQUE SYSTEM' | - | 8-125 |
| BD | (merged) | - | - | 'FUNCTIONAL' | - | 'POSTERIOR OBLIQUE SYSTEM' | - | 8-9 |
| BE | (merged) | - | - | 'FUNCTIONAL' | - | 'LATERAL SUBSYSTEM' | - | 8-9 |

Observations:
- AV-AZ have **no ZONE / PATTERN** labels: they are not an exercise category of the athletic/resistance/control taxonomy; they are the *dosing* and *specialisation* menus. FUNCTIONAL is a **fifth PATTERN family** alongside CARDIO, ATHLETIC, CONTROL, RESISTANCE.
- 'FILL HERE' appears under every row-1 header that has data-validation consumers or was meant to (missing for CARRY, DRAGS, BD, BE). *Inferred*: an invisible "to-do / fill this" marker, or a template artefact; it never surfaces in dropdowns because ranges start at row 7.

## 2. Dosing vocabulary (AV-AY) - summary (full detail in `L4_dosing_vocab.json`)

**SETS (AV8-AV16)**: `1, 2, 3, 4, 5, 6, 7, 8` (stored as numbers 1.0-8.0) and `'SUPERSET W/ 👇'`.
*Inferred*: 'SUPERSET W/ 👇' goes in the SETS cell to pair the exercise with the row below (same convention as MASTER_MODEL BASEBALL's 'Superset - same reps' / 'Superset - max reps' rows that have an empty sets cell).

**REPS (AW8-AW14)**: `'4 to 6 Reps'`, `'6 to 8 Reps'`, `'8 to 12 Reps'`, `'10 to 15 Reps'`, `'15 Reps'`, `'20 Reps'`, `'MYO SET'`.
'MYO SET' is defined in MASTER_MODEL 'ALL ABOUT SQUATS' A30: 15 reps, pause ~3 s, then 5 x 5 with ~3 s breaths = 40 reps ("15/5/5/5/5/5", labelled '**MYO SET - ADVANCED').
Gap vs the coach's stated model ("everyone picks between 5 and 30 reps"): nothing above 20, nothing time- or distance-based, no per-side notation, no RIR/RPE target, no rest.

**EFFORT (AX8-AX17)**, 1-10: `'1 - Way Too Easy'`, `'2 - Way Too Easy'`, `'3 - Too Easy'`, `'4 - Easy'`, `'5 - Easyish'`, `'6 - Broke a Sweat'`, `'7 - That was tough'`, `'8 - That was perfect'`, `'9 - That was terrible'`, `"10 - I'm done"`.
*Inferred*: an RPE scale whose bullseye is **8** (= ~1-2 reps in reserve, matching MASTER_MODEL '(1 RIR) *RPE8+'), so 9-10 are overshoots, not "better". This is the natural autoregulation input for the coach's week-to-week 3 / 5 / 7 % increments.

**FEELING (AY8-AY11)** - shown in program tabs as 'HOW IT FELT?': `'Felt the RIGHT muscles'`, `'Felt the WRONG muscle'`, `'Felt a PAIN'`, `"Couldn't do it"`.
*Inferred*: a target-tissue + pain screen. RIGHT -> keep/progress; WRONG -> swap variation within the same library column; PAIN -> regress or cut sets (coach: "fewer sets with injury or pain"); COULDN'T -> drop a level.

Observed prescriptions using this vocabulary (the only filled examples in BYOP):
- AESTHETICS Day 1/2: calves 3 x '15 Reps', leg press 3 x '15 Reps', bent-over barbell rows 3 x '8 to 12 Reps', reverse lunges 3 x '8 to 12 Reps', lat pulldown 3 x '15 Reps', EZ-bar curls **2 x '20 Reps'**, leg extensions **2 x '20 Reps'**, DB deadlifts 3 x '15 Reps', push-ups 3 x '15 Reps', DB push press **5 x '6 to 8 Reps'**. Day 1 = 7 exercises / 19 sets.
- JUSTICE LEAGUE Monday: **every slot 2 sets**; plyos, COD, power clean, front squat '6 to 8 Reps'; throw, rows, lunges, pull-ups '8 to 12 Reps'; leg extensions 'MYO SET'. 10 exercises / 20 sets.
These two days already show the coach's rules in miniature: small muscles / isolation get fewer sets of higher reps (2 x 20, MYO), big compounds 3 x 8-15, one strength-emphasis lift 5 x 6-8, and athletic sessions spread low per-exercise volume (2 sets) across many qualities.

## 3. FULL FOCUS LIST / 'MUSCLE FOCUS OPTIONS' (AZ) - OBSERVED structure

- **10 muscle groups**, each introduced by a header ending in ' 👇', placed on fixed rows: `AZ8 'QUADS 👇'`, `AZ44 'SHOULDERS/TRAPS 👇'`, `AZ89 'BACK 👇'`, `AZ124 'TRICEP 👇'`, `AZ164 'GLUTES 👇'`, `AZ204 'HAMSTRINGS 👇'`, `AZ244 'CHEST 👇'`, `AZ284 'CORE 👇'`, `AZ311 'BICEP 👇'`, `AZ331 'CALVES 👇'`. The first four reuse the library's level-block grid (8/44/89/124); then 40-row spacing (164/204/244/284), then 311 and 331.
- **51 exercises** (no fills, plain black text, mostly lower-case "gym-floor" names - unlike the Title-Case main library):

| Group | Cells | Exercises (verbatim) |
|---|---|---|
| QUADS (8) | AZ9-AZ16 | 'Goblet squats heels elevated', 'Leg press', 'Zercher squats', 'Back squats', 'Walking Lunges', 'Stationary Lunges', 'Bulgarian Split squats', 'Leg extensions' |
| SHOULDERS/TRAPS (9) | AZ45-AZ53 | 'Bd overhead Press', 'barbell overhead press', 'High incline db press', 'Incline db press', 'Incline barbell press', 'DB side raises', 'Cable side raises', 'DB upright rows', 'Barbell upright rows' |
| BACK (6) | AZ90-AZ95 | 'Pull ups', 'assisted pull ups', 'lat pull down', 'Db rows', 'Cable rows', 'machine rows' |
| TRICEP (5) | AZ125-AZ129 | 'DB overhead tricep ext', 'cable tricep extensions', 'cable overhead tricep ext', 'dips', 'assisted dips' |
| GLUTES (2) | AZ165-AZ166 | 'Single leg Glute bridge', 'Barbell hip thrust' |
| HAMSTRINGS (8) | AZ205-AZ212 | 'DB deadlifts', 'Barbell deadlifts', 'Hyperextensions', 'Hip thrusts/ Glute bridges', 'Staggered stance DL', 'Foot on wall db DL', 'Leg curls', 'Lying leg curls' |
| CHEST (6) | AZ245-AZ250 | 'Incline db press', 'bench press', 'db bench press', 'DB flies', 'Cable flies', 'Incline barbell press' |
| CORE (3) | AZ285-AZ287 | 'Weighted situps', 'weighted decline situps', 'Weighted russian twists' |
| BICEP (3) | AZ312-AZ314 | 'Incline bench bicep curls', 'supine bicep curls', 'cable bicep curls' |
| CALVES (1) | AZ332 | 'DB Standing calf raises' |

How it is used (OBSERVED): it is the only source for the program slots **'Focus 1' and 'Focus 2'** (`AZ7:AZ335`), which sit in the optional / mid-week blocks of AESTHETICS, 3 DAY BUILDER, ATHLETIC, JUSTICE LEAGUE, BOOTCAMP OPTION 1, both NO ACCESS tabs, and on the legs days of PUSHPULLLEGS ('Focus 1' only).

Interpretation (*inferred*):
- This is the coach's **specialisation lever** - "more sets for the muscle they want to grow". The base template gives every client the same pattern-balanced week; the client then spends 1-2 extra slots (on optional days) on the muscle they care about, picked from a menu organised by muscle, not by pattern.
- The ten group names are the de-facto **muscle taxonomy for volume accounting**, and they split cleanly into the coach's two size classes: big = QUADS, BACK, GLUTES, HAMSTRINGS, CHEST; small = SHOULDERS/TRAPS (delts), TRICEP, BICEP, CALVES, CORE. A generator can count weekly sets per these 10 buckets.
- The list is **hypertrophy staples only**: no athletic, plyometric, functional or unilateral-control items, no levels (any client can pick anything), heavy reliance on machines/cables/barbells (only 5 of 51 work with no equipment: walking lunge, stationary lunge, Bulgarian split squat, single-leg glute bridge, hip thrust/glute bridge).
- Cross-listing is deliberate: incline presses appear under both SHOULDERS/TRAPS and CHEST (exact duplicates AZ48=AZ245, AZ49=AZ250); hip thrusts appear under GLUTES and HAMSTRINGS; dips (a HORIZONTAL PUSH item in the main library) sit under TRICEP. MASTER_MODEL 'RESISTANCE PATTERNS' has a 'MID RANGE PUSH' column (incline DB/barbell/cable bench, landmine, viking press) that BYOP lacks - the incline items live in that gap.

Items in AZ that **do not exist anywhere else in the BYOP library** (OBSERVED by fuzzy + manual match): 'Goblet squats heels elevated', 'Walking Lunges', 'barbell overhead press' (no standing barbell press in AA; AA50 and AA51 are both 'Standing DB Press'), 'High incline db press', 'Incline barbell press' (later added to Copy of Copy as 'Barbell Incline Bench Press'), 'DB upright rows', 'Barbell upright rows', 'Cable rows' (bilateral seated row; BYOP only has 'Cable Machine UL Rows'), 'assisted dips', 'Foot on wall db DL' (MASTER_MODEL BASEBALL 'Rear foot on wall DB RDL'), 'weighted decline situps', 'supine bicep curls'. Every other AZ item has a main-library equivalent (listed per record in the JSON).

Coverage gaps (*inferred*): no forearms/grip, no rear-delt group (reverse flies only exist in SIDE RAISES), no adductors/abductors, no neck, GLUTES has only 2 items and CALVES 1; CORE has 3 (all sagittal/transverse flexion-rotation, no anti-extension).

## 4. CARRY (BA) and DRAGS (BB) - OBSERVED

- CARRY: `BA8 'PROPULSIVE'`, `BA10 'STATIONARY'` (both bg C9DAF8 blue), `BA13 'BILATERAL'`, `BA14 'UNILARTERAL'` [sic] (both FFE599 yellow). No exercises. Rows BA9, BA11-12 empty.
- DRAGS: `BB6 'DRAG'`, `BB8 'SAGITAL'` [sic], `BB10 'FRONTAL'` (C9DAF8). No exercises. No 'TRANSVERSE'.
- Neither column is wired to any program slot and neither has a 'FILL HERE' or ZONE/PATTERN label.

*Inferred*: CARRY is a 2-axis grid - **mode** {PROPULSIVE = travelling carry, STATIONARY = carry/hold in place} x **loading** {BILATERAL = both hands (farmer), UNILATERAL = one hand (suitcase)} - the two colour groups are the two axes. 'Propulsive' is Pat Davidson vocabulary (MASTER_MODEL 'ALL ABOUT LUNGES': 'Lunges are a propulsive strategy'; 'ALL ABOUT BALLISTICS': 'PROPULSIVE STEP WITH BILATERAL SYMETRICAL PUSH'). DRAGS is organised by **plane** (sled/band drag forwards-backwards vs laterally). Carries already appear in MASTER_MODEL programs ('Single side KB carry', 'KB Single arm farmer walk carry') and in 'CONTROL PATTERNSCORE' B10 'single side carry' (TRANSVERSE / CORE THORAX / DYNAMIC) - i.e. the coach thinks of carries as trunk control work.

## 5. FUNCTIONAL BIOMECHANICS SYSTEM (BC-BE) - OBSERVED + inferred

Header `BC1:BE1` merged 'FUNCTIONAL BIOMECHANICS SYSTEM'; row 4 'FUNCTIONAL' on all three; row 6 = the three myofascial "slings": `BC6 'ANTERIOR OBLIQUE SYSTEM'`, `BD6 'POSTERIOR OBLIQUE SYSTEM'`, `BE6 'LATERAL SUBSYSTEM'`.

### 5.1 ANTERIOR OBLIQUE SYSTEM (BC) - the only populated system
Layout (OBSERVED): sub-type headers in blue C9DAF8, yellow FFE599 "integration" labels, exercise rows coloured green D9EAD3 / yellow FFF2CC / red F4CCCC.

| Rows | Cell | Text (verbatim) | Fill |
|---|---|---|---|
| block 1 | BC8 | 'CHOPS' | C9DAF8 |
| | BC9-BC12 | 4 x "... chop/crunch **down** ..." | D9EAD3 green |
| | BC13-BC16 | 4 x "... **midline** ..." | FFF2CC yellow |
| | BC17-BC20 | 4 x "... **up** ..." | F4CCCC red |
| block 2 | BC44 | 'INTEGRATED WITH PUSH & LEGS' | FFE599 |
| | BC45 | 'ANTI ROTATIONS' | C9DAF8 |
| | BC46-BC49 | 4 Pallof holds | D9EAD3 green |
| block 3 | BC89 | 'INTEGRATED WITH PUSH & LEGS' | FFE599 |
| | BC90 | 'PLANKS' | C9DAF8 |
| | BC91 | 'Supine offset plank with contralateral banded or cable adduction' | D9EAD3 green |
| block 4 | BC124 | 'INTEGRATED WITH PUSH & LEGS' | FFE599 |
| | BC125 | 'CRUNCHES' | C9DAF8 (no exercises) |

The 12 chops are a perfect **3 x 4 matrix** (OBSERVED in the text):
- direction: 'down' (BC9-12), 'midline' (BC13-16), 'up' (BC17-20);
- position, in the same order inside each direction: (1) 'Hold object Adducted between knees rotational crunch chop ...' (position not stated - *inferred* supine floor because the Pallof list starts 'floor supine'), (2) 'Hold object Adducted between knees kneeling cable or banded crunch ...' (tall kneeling), (3) 'Knee banded for adduction, half kneeling crunch ... into active knee', (4) 'Knee banded for adduction, split standing ... crunch into active knee '.
The 4 Pallof holds follow the same position ladder: 'floor supine' -> 'kneeling' -> 'half kneeling' -> 'split standing'.

*Inferred reading*:
- **Colour = level/zone.** Green/yellow/red is the coach's traffic light used everywhere else: MASTER_MODEL 'Sheet23' ZONE 1/2/3 = B6D7A8 / **FFF2CC** / **F4CCCC** (two exact matches), MASTER_MODEL 'RESISTANCE PATTERNS' easy/moderate/hard = B6D7A8 / FFE599 / E06666. So chop-down = foundational, chop-midline = intermediate, chop-up (lift) = advanced; all anti-rotations and the plank are foundational.
- **Position = within-level progression**: supine -> tall kneeling -> half kneeling -> split stance, i.e. raising the centre of mass and narrowing the base (developmental-position progression in the Pat Davidson / DNS / PRI tradition). Records carry `position_progression_rank` 1-4.
- **Every drill pairs trunk rotation/anti-rotation with adduction** ('Hold object Adducted between knees', 'Knee banded for adduction', 'contralateral ... adduction') and often hip flexion ('into active knee'). That is the textbook anterior oblique sling: external oblique -> contralateral internal oblique -> contralateral adductors, with pec/serratus at the top. The yellow label 'INTEGRATED WITH PUSH & LEGS' names exactly those two ends (push = pec, legs = adductors).
- The yellow label sits on the block-start rows (44/89/124) where other stacked columns put their level word, immediately above the next sub-type. Two readings: (a) a repeated system tag ("everything here integrates push + legs"), or (b) an empty sub-list for "integrated" variants (e.g. half-kneeling cable press with adduction) that was never filled. The BD/BE pattern (sub-type at r8, integration label at r9 with nothing under it) slightly favours (b) - ask the coach.

### 5.2 POSTERIOR OBLIQUE SYSTEM (BD) and LATERAL SUBSYSTEM (BE) - skeletons only
- BD8 'BRIDGES' (C9DAF8), BD9 'INTEGRATIONS WITH PULL & LEGS' (FFE599). *Inferred*: POS = lat -> thoracolumbar fascia -> contralateral glute max; bridges train the glute end, "pull" the lat end.
- BE8 'SIDE LYING' (C9DAF8), BE9 'INTEGRATIONS LEGS & DELTS' (FFE599). *Inferred*: lateral subsystem = glute med/min, TFL, adductors, contralateral QL; side-lying hip abduction / side planks; the coach links it to shoulder abduction (delts) - the same frontal-plane "ABdution" idea the program tabs use for SIDE RAISES.
- Both columns are absent from both library copies.

### 5.3 Status
Nothing in CARRY, DRAGS or the FUNCTIONAL BIOMECHANICS SYSTEM is wired into any program tab. These columns are the coach's newest, unfinished layer: a biomechanics/"sling" taxonomy that sits beside the pattern taxonomy (ATHLETIC / CONTROL / RESISTANCE) and would most naturally feed warm-up, core or accessory slots.

## 6. The two copies vs the master

### 6.1 `Copy of MASTER EXERCISE LIBRARY` (A1:AA335, 644 cells) - OBSERVED
- **Columns kept (24)**: the stacked "database" column of every category, renamed by position: B CARDIO, C TRIPPLE EXTENSION, D<-G PLYOS, E<-K THROWING, F<-L CHANGE OF DIRECTION, G<-O CORE THORAX, H<-R CORE PELVIS, I<-U VERTICAL PULL, J<-X HORIZONTAL PULL, K<-AA VERTICAL PUSH, L<-AD HORIZONTAL PUSH, M<-AH SIDE RAISES, N<-AI BILATERAL KNEE DOMINANT, O<-AL UNILATERAL KNEE DOMINANT, P<-AM LEG EXTENSIONS, Q<-AN BILATERAL HIP DOMNANT, R<-AQ UNILATERAL HIP DOMINANT, S<-AR LEG CURLS, T<-AS BICEP, U<-AT TRICEP, V<-AU CALVES, W<-BA CARRY, X<-BB DRAGS, Y<-BC FUNCTIONAL BIOMECHANICS SYSTEM.
- **Columns dropped (32)**: all flat per-level columns D, E, F, H, I, J, M, N, P, Q, S, T, V, W, Y, Z, AB, AC, AE, AF, AG, AJ, AK, AO, AP; the dosing columns AV SETS, AW REPS, AX EFFORT, AY FEELING; AZ FULL FOCUS LIST; BD POSTERIOR OBLIQUE SYSTEM; BE LATERAL SUBSYSTEM. All 12 row-1 merges disappear with them.
- **New / renamed headers**: `A1 'Segment'` (new - names row 1 as a field); `L1 'Horizontal Push'` (master `AD1 'HORIZONTAL PUSH'`); `H2 'FILL HERE'` (master R2 is empty).
- **Exercises in master but not in Copy 1**: `AD14 'Machine bench press'` (cell L14 is empty in the copy); plus every item that only lived in dropped columns - the 51 AZ focus items, the dosing vocab, BD/BE labels, and `AF18 'Deficit Push-ups'` (flat-column-only).
- **Exercises in Copy 1 but not in master**: none.
- **Restructuring**: identical row positions in every column except **B (CARDIO)**: master's empty B18:B23 gap is gone, so every cardio cell from master B24 down sits 6 rows higher (B24 'DISTANCE TEST' -> B18, B44 'SPEED TEST' -> B38, B89 -> B83, B123 'DISTANCE' -> B117, B132 'CALORIES' -> B126, ... B141 -> B135). In the master, 'SPEED TEST' (B44) and the second 'DISTANCE TEST' (B89) sit on the 44/89 block grid; in the copy they do not.

### 6.2 `Copy of Copy of MASTER EXERCISE` (A1:Y44, 580 cells) - OBSERVED
Derived from Copy 1 (shares 'Horizontal Push' and the missing 'Machine bench press'), then compacted:
- **Header block shortened** from 7 to 6 rows: the 'FILL HERE' row is gone, so row 1 = category, row 2 = ZONE, row 3 = PATTERN, row 4 = sub-pattern, row 5 = PURPOSE, row 6 = 'CHOOSE 👇' (A-column labels A1 'Segment', A2 'ZONE', A3 'PATTERN', A5 'PURPOSE').
- **All blank rows removed** and the repeated per-block 'CHOOSE 👇' rows deleted: each column is now one contiguous list with the level words (FOUNDATIONAL / MODERATE / ADVANCED / EASY / UNILATERAL / CORE THORAX / CORE PELVIS) left inline as separators. CARRY/DRAGS/FUNCTIONAL compacted the same way (W7-W10, X7-X8, Y7-Y30), which erases the spacing that hinted at CARRY's 2 x 2 grid.
- **Sheet cut at row 44 -> data loss**: PLYOS (D) needed 51 rows, so the last 7 ADVANCED plyos are gone: 'Bulgarian Split Jumps', 'DB Depth drop dbs Jump', 'SL DB depth drop dbs jump', 'DB Ankle hops', 'DB repeat squat jumps', 'Bounding', 'Plyo pushups'. CARDIO (B) lost '45 cals' and '50 cals'.
- **Deliberate content edits**: CARDIO's duplicated second 'DISTANCE TEST' block (master B89-B98, 10 cells) removed; `'SPEED TEST'` renamed **`'SPEED ENDURANCE TEST'`** (B27); `B2 'Cardio'` (ZONE) and `B4 'Cardio'` (sub-pattern) filled where the master is blank; `T4`/`U4` (BICEP/TRICEP sub-pattern row) filled with 'RESISTANCE' (master AS5/AT5 blank).
- **New exercise**: `L35 'Barbell Incline Bench Press'` appended at the bottom of Horizontal Push (after the UNILATERAL block, but with the bilateral fill 6FA8DC rather than the unilateral 9FC5E8 - i.e. a late addition, not a unilateral item).
- **Formatting**: row-1 header font turned **red (FF0000)** for 12 categories - TRIPPLE EXTENSION, PLYOS, THROWING, CORE THORAX, CORE PELVIS, HORIZONTAL PULL, BILATERAL KNEE DOMINANT, UNILATERAL KNEE DOMINANT, LEG EXTENSIONS, BILATERAL HIP DOMNANT, UNILATERAL HIP DOMINANT, LEG CURLS - and left black for CARDIO, CHANGE OF DIRECTION, VERTICAL PULL, VERTICAL PUSH, Horizontal Push, SIDE RAISES, BICEP, TRICEP, CALVES, CARRY, DRAGS, FUNCTIONAL BIOMECHANICS SYSTEM. Meaning not stated.
- **Exercises in master but not in Copy 2**: 'Machine bench press'; the 7 plyos and 2 calorie options above; the duplicate DISTANCE TEST block; the original 'SPEED TEST' label; plus everything in dropped columns (as for Copy 1).
- **Exercises in Copy 2 but not in master**: 'Barbell Incline Bench Press'; label 'SPEED ENDURANCE TEST'.

### 6.3 What the coach was trying to do (*inferred*)
1. **Copy 1 = "one column per category" database source.** Strip the human-friendly flat level views (which duplicate the stacked column) and the non-exercise columns (dosing menus, focus list, empty systems), keep row positions so the existing 7/44/89/124 block grid and range addresses would still work, and label row 1 'Segment' as a field name. That is the move you make before pointing dropdowns, a form, an app (AppSheet/Glide/Airtable) or a developer at the library: one row-1 key per category, one list per column.
2. **Copy 2 = "clean flat table" / export shape.** Remove every blank row and repeated placeholder so each column is a contiguous list under a 6-row header (Segment / Zone / Pattern / sub-pattern / Purpose / CHOOSE) - the shape you would paste into a UI or hand to an AI. Content clean-up continued here (de-duplicated distance tests, renamed the speed test, filled empty header cells, added a missing incline barbell press). The red row-1 font looks like a review/progress marker (e.g. "checked" or "still to fix") applied part-way through. The 44-row cut was very likely accidental: row 44 is exactly where the compacted BILATERAL KNEE DOMINANT column (N, 38 items + 6 header rows) ends, so the sheet seems to have been trimmed to that column without noticing that PLYOS needed 51 rows and CARDIO 46.
3. **Neither copy is strictly newer than the master**: the master has 'Machine bench press' and the upper-case 'HORIZONTAL PUSH' that the copies lack, while Copy 2 has edits the master lacks. MASTER_MODEL's 'Sheet23' is yet another database-shaped version (one column per level-category, row-1 headers such as 'FOUNDATIONAL - AP - TRIPPLE EXT ', A-column 'ZONE 1/2/3' colour-coded green/yellow/red). The direction of travel is clear: **from a visual menu to a normalised table** - exactly what the generator needs.

### 6.4 Recommended merge for the generator (*inferred*)
Use the master as the base, then apply Copy 2's deliberate edits ('Barbell Incline Bench Press', 'SPEED ENDURANCE TEST', de-duplicated distance test, header fills), keep master-only 'Machine bench press', restore Copy 2's truncated rows from the master, and add the AZ-only exercises listed in section 3 as new library items mapped to their pattern.

## 7. Other things noticed in passing (OBSERVED)
- The COD list contains a date: `L92` / `N10` = 2005-05-10 - almost certainly the pro-agility drill **'5-10-5'** auto-converted by Google Sheets. Same failure mode in MASTER_MODEL BASEBALL (reps '8/8', '12/12' stored as dates 2022-08-08, 2022-12-12). The generator must store reps/drill names as text.
- Typos to normalise (kept verbatim in quotes): 'TRIPPLE', 'SAGITAL', 'INTERMIDIATE', 'DOMNANT', 'UNILARTERAL', 'Bd overhead Press', 'ABdution' (program tabs), 'Harmstring', 'Coppenhaggen', 'Glidder', 'Sesaw', 'Stricted', 'fliez', 'CHOSE 👇' (hidden tabs); 'Camporini Deadlifts' (AQ16) is unclear - possibly a misspelt name.
- `AH` SIDE RAISES mixes lateral raises, front raises and reverse flies under one 'ABdution' slot; reverse flies (rear delts) have no separate slot except PPL's 'Reverse Flies' detail label.
- `AS12 'Cable Machine Curls (Zone1, Zone 2, Zone 3'` - here 'Zone' seems to mean cable height/arm angle, a different use of "zone" from the library's ZONE row (difficulty).
