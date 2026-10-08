# BYOP aesthetics programs: deep decode

**Scope.** Three program tabs from the BYOP workbook ("BUILD YOUR OWN PROGRAM - BLAZE CAMP MODEL"):

| Code | Tab (verbatim) | Visibility | Title cell (verbatim) | Fill status |
|---|---|---|---|---|
| A | `AESTHETICS - FULL BODY - 4 DAYS` | visible | C1 'AESTHETICS - FULL BODY - 4 DAYS A WEEK' | Partly filled demo. Day 1 is complete. Day 2 has 4 of 7 exercises and 3 of 7 dosed. Everything else reads 'CHOOSE 👇'. |
| B | `3 DAY BUILDER` | visible | C1 'AESTHETICS - FULL BODY - 3 DAYS A WEEK' | Empty template: every EXERCISE/SETS/REPS cell reads 'CHOOSE 👇'. |
| C | `NO ACCESS - AESTHETICS - FB - 4` | **hidden** (`state="hidden"` in workbook.xml) | none (A1:K1 is merged but empty) | Empty logbook: cells read 'CHOSE 👇' (typo) or 'CHOOSE 👇'. |

**Sources read.** I read `dumps/BYOP/00_*.txt`, `01_*.txt` and `07_*.txt` (cells, merges and data validations) and cross-checked them against `raw/BYOP.xlsx` with openpyxl and the raw XML. That covered conditional formats, dxf colours, the theme, sheet state and column widths. I resolved every slot to the library column its dropdown points at (`09_MASTER_EXERCISE_LIBRARY`) and pulled every option of every wired range, with level blocks and colours (see the Appendix). I also used the existing analyses `analysis/library/L4_slot_wiring.md` and `L4_dosing_vocab.json`, re-verified them, and they agree. For progression I cross-referenced MASTER_MODEL `(NOT DONE) 4 TRACKS PROGRAMMING` rows 30-66 (the 'AESTHETICS' track), because the three BYOP tabs contain no progression at all. Nothing in Google Sheets was touched.

**Legend.** **OBSERVED** means read directly from a cell, colour, merge, validation or conditional format. **INFERRED** means my interpretation, and it is flagged every time. The coach's labels are quoted verbatim with their typos ('ABdution', 'DOMNANT', 'CHOSE', 'SAGITAL'); my own canonical names use correct spelling.

---

## 0. The shared building blocks (OBSERVED)

### 0.1 Slot -> library category -> canonical bucket

Every EXERCISE cell is a list dropdown into exactly one `'MASTER EXERCISE LIBRARY'` column. SETS -> `AV7:AV42`, REPS -> `AW7:AW42`, EFFORT -> `AX7:AX42`, HOW IT FELT? -> `AY7:AY42`. All three tabs use the same 17 slot types:

| PURPOSE label (verbatim) | CATEGORY label (verbatim) | Dropdown range | Library row-1 category (verbatim) | Library row-6 PURPOSE (verbatim) | Level blocks inside the dropdown (items) | Canonical bucket |
|---|---|---|---|---|---|---|
| 'Calves' | 'Calves' (blank on optional days) | `AU7:AU13` | 'CALVES' | 'CALVES' | none (5) | ISO_CALF |
| 'Quads' | 'Bilateral KD' | `AI7:AI122` | 'BILATERAL KNEE DOMINANT' | 'QUADS' | FOUNDATIONAL 12 / MODERATE 9 / ADVANCED 14 | RP_BKD |
| 'Back' | 'Horizontal Pull' | `X7:X162` | 'HORIZONTAL PULL' | 'BACK' | FOUNDATIONAL 5 / ADVANCED 9 / UNILATERAL 2 | RP_HPULL |
| 'Quads/Glutes' | 'Unilateral KD' | `AL7:AL42` | 'UNILATERAL KNEE DOMINANT' | 'QUADS/GLUTES' | none (13) | RP_UKD |
| 'Back ' (trailing space) | 'Vertical Pull' | `U7:U122` | 'VERTICAL PULL' | 'BACK' | FOUNDATIONAL 12 / ADVANCED 7 / UNILATERAL 1 | RP_VPULL |
| 'Bicep' | 'Bicep' | `AS7:AS42` | 'BICEP' | 'BICEP' | none (14) | ISO_BICEP |
| 'Quads' | 'Leg Extensions' | `AM7:AM9` | 'LEG EXTENSIONS' | 'QUADS' | none (1: 'Leg Extensions') | ISO_QUAD |
| 'Hamstring' | 'Bilateral HD' | `AN7:AN122` | 'BILATERAL HIP DOMNANT' | 'GLUTES/HAMSTRINGS' | FOUNDATIONAL 12 / MODERATE 10 / ADVANCED 11 | RP_BHD |
| 'Chest' | 'Horizontal Push' | `AD7:AD162` | 'HORIZONTAL PUSH' | 'CHEST/FRONT DELTS' | FOUNDATIONAL 6 / MODERATE 5 / ADVANCED 9 / UNILATERAL 5 | RP_HPUSH |
| 'Hamstring/Glutes' | 'Unilateral HD' | `AQ7:AQ42` (tab C: **`AR7:AR42`, miswired**) | 'UNILATERAL HIP DOMINANT' | 'GLUTES/HAMSTRINGS' | FOUNDATIONAL 8 | RP_UHD |
| 'Chest/Shoulders' | 'Vertical Push' | `AA7:AA122` | 'VERTICAL PUSH' | 'SHOULDERS/TRAPS' | FOUNDATIONAL 6 / ADVANCED 10 / UNILATERAL 4 | RP_VPUSH |
| 'Hamstrings' | 'Leg Curls' | `AR7:AR10` | 'LEG CURLS' | 'HAMSTRINGS' | none (2) | ISO_HAM |
| 'Tricep' | (blank) | `AT7:AT42` | 'TRICEP' | 'TRICEP' | none (9) | ISO_TRICEP |
| 'Shoulders/Traps' | 'ABdution' | `AH7:AH42` | 'SIDE RAISES' | 'SHOULDERS' | none (12) | ISO_SIDE_REAR_DELT |
| 'Cardio' | (blank) | `B7:B122` | 'CARDIO' | 'CARDIO' | SPEED INTERVALS 5 / DISTANCE INTERVALS 3 / DISTANCE TEST 9 / SPEED TEST 3 / DISTANCE TEST (duplicate) 9 | COND_AEROBIC |
| 'Core' | (blank) | `O7:O283` | 'CORE THORAX' (the range also covers the CORE PELVIS block at O124-O209) | 'CORE' | CT: FOUNDATIONAL 6 / MODERATE 1 / ADVANCED 3; CP: FOUNDATIONAL 4 / MODERATE 2 / ADVANCED 1 | CT_CORE_THORAX or CP_CORE_PELVIS (depends on the pick) |
| 'Focus 1', 'Focus 2' | (blank) | `AZ7:AZ335` | 'FULL FOCUS LIST' | 'MUSCLE FOCUS OPTIONS' | 10 muscle headers ('QUADS 👇' ... 'CALVES 👇'), 51 items | FOCUS |

None of the three tabs has a slot for any athletic bucket (AP_PLYO, AP_JUMP_LIMITED_KNEE, AP_THROW, AP_COD, AP_SPRINT, AP_TRIPLE_EXT), ISO_CHEST, CORE_OTHER, COND_SPRINT_BUYOUT or FUNCTIONAL. That absence is itself OBSERVED. It is the main structural difference from `ATHLETIC - FULL BODY - 4 DAYS A`, which keeps the same resistance skeleton and prepends Plyo / Throwing / COD / 'Tripple Extension' slots to every main day.

### 0.2 A slot's bucket depends on the pick (OBSERVED from the menus; the consequence is INFERRED)

A slot fixes the *library column*, not the joint action. Several menus contain exercises that belong to another canonical bucket:

| Slot | Options that belong to another bucket (verbatim, cell) | Effective bucket if picked |
|---|---|---|
| 'Bilateral KD' (AI) | 'Leg Extension Machine' (AI20, AI55, AI101 - in all three level blocks) | ISO_QUAD |
| | 'DB thrusters' AI102, 'Barbell Thrusters' AI103, 'Single arm DB thruster' AI104 | RP_BKD + RP_VPUSH combo |
| 'Bilateral HD' (AN) | 'Leg Curl Machine' AN15, 'Harmstring MedBall Curls' AN17, 'Supine Glidder hamstring curls' AN18, 'swiss ball hamstring curls' AN19, 'Medicine or Stability Ball Harmstring Curls' AN50, 'Machine Leg Curls (Seated and Laying Down)' AN54, 'Nordic Curl' AN91, 'Machine Leg Curls' AN100, 'DB Harmstring Curls' AN101 (9 of 33 options) | ISO_HAM (knee flexion, not a hinge) |
| | 'KB swing' AN20 | ballistic hinge (closer to AP than RP) |
| 'Horizontal Push' (AD) | 'Bench DB Flies ' AD48, 'Cable flies' AD49, 'Machine flies' AD50 | ISO_CHEST |
| 'Vertical Push' (AA) | 'DB Push press' AA11, 'Barbell push press' AA12, 'DB Push Jerk' AA13, 'Barbell Push Jerk' AA14 | ballistic vertical push (leg-driven, triple-extension-like) |
| | 'DB Thrusters' AA54, 'Barbell Thrusters' AA55, 'Single arm DB thrusters' AA94 | RP_VPUSH + RP_BKD combo |
| | 'Incline Seated DB Press' AA9, 'Incline Seated Barbell Press' AA10 | incline press (chest-biased "mid-range push") |
| 'Vertical Pull' (U) | 'KB Face Pulls ' U20 | rear delt / upper back (horizontal-ish) |
| 'ABdution' (AH) | front raises AH12, AH13, AH18; reverse flies AH10, AH15, AH20 'Machine reverse fliez' | front delts or rear delts instead of side delts |

**Generator implication (INFERRED).** The program gives the slot. The canonical bucket and the muscle credit have to come from the *exercise record*. Example: a client who picks 'Leg Extension Machine' in the 'Bilateral KD' slot and 'Leg Extensions' in the 'Leg Extensions' slot does zero squat-pattern work that day.

### 0.3 Dosing vocabulary available to these tabs (OBSERVED, `AV`-`AY`)

- **SETS**: 1, 2, 3, 4, 5, 6, 7, 8, 'SUPERSET W/ 👇'.
- **REPS**: '4 to 6 Reps', '6 to 8 Reps', '8 to 12 Reps', '10 to 15 Reps', '15 Reps', '20 Reps', 'MYO SET'. The REPS menu goes no higher than 20. 'MYO SET' (15 + 5x5 = 40 reps, per MASTER_MODEL 'ALL ABOUT SQUATS') is the only option above 20, even though the coach speaks of "5 to 30".
- **EFFORT** (tab C only): '1 - Way Too Easy' ... '8 - That was perfect', '9 - That was terrible', "10 - I'm done".
- **HOW IT FELT?** (tab C only): 'Felt the RIGHT muscles', 'Felt the WRONG muscle', 'Felt a PAIN', "Couldn't do it".
- No rest, tempo, RIR/RPE target, %1RM, load or week columns exist in any of the three tabs.

### 0.4 Counting convention used for every volume number below

- A **working set** counts 1.0 toward each prime mover and 0.5 toward each clear synergist. "Prime movers" are taken from the coach's own PURPOSE labels (program tab label plus library row-6 label) wherever those name muscles.
- Mapping (INFERRED, stated so it can be changed):

| Bucket | 1.0 | 0.5 |
|---|---|---|
| RP_BKD | quads | glutes |
| RP_UKD ('Quads/Glutes') | quads, glutes | - |
| RP_BHD (library 'GLUTES/HAMSTRINGS') | hamstrings, glutes | - |
| RP_UHD ('Hamstring/Glutes') | hamstrings, glutes | - |
| ISO_QUAD | quads | - |
| ISO_HAM | hamstrings | - |
| RP_HPULL ('Back') | lats/upper back | biceps, rear delts |
| RP_VPULL ('Back') | lats/upper back | biceps |
| RP_HPUSH (library 'CHEST/FRONT DELTS') | chest, front delts | triceps |
| RP_VPUSH ('Chest/Shoulders'; library 'SHOULDERS/TRAPS') | front delts | chest, side delts, triceps |
| ISO_SIDE_REAR_DELT ('ABdution') | side delts (assumes a lateral-raise pick) | - |
| ISO_BICEP / ISO_TRICEP / ISO_CALF | biceps / triceps / calves | - |
| Core (CT or CP) | abs/obliques | - |
| FOCUS | the muscle the client picks (reported as its own line) | - |
| COND_AEROBIC | no muscle sets (counted as bouts) | - |

- **Scenarios.** "As written" counts only numeric SETS cells. "Assumed - coach convention" keeps every filled value; then unset compounds and calves get 3 sets, unset isolation gets 2 sets (the convention visible in Day 1 of tab A), and Day 3/Day 4 copy Day 1/Day 2 (the slot templates are identical). "Assumed - flat 3" sets every main slot to 3. Optional days are reported separately, and their resistance slots are assumed at 3 sets each.

---

## A. `AESTHETICS - FULL BODY - 4 DAYS`

### A.1 Identity

| Field | Value |
|---|---|
| Tab / title | 'AESTHETICS - FULL BODY - 4 DAYS' / C1 'AESTHETICS - FULL BODY - 4 DAYS A WEEK' (bold). OBSERVED. |
| Columns | A 'DAY', B 'PURPOSE', C 'CATEGORY', D 'EXERCISE', E 'SETS', F 'REPS'. There are no effort, weight, feel or done columns. OBSERVED. |
| Goal / population | Aesthetics, i.e. physique hypertrophy ("bodybuilding style" is the coach's own gloss on 'AESTHETICS' in MASTER_MODEL 4 TRACKS A30/C30). The template targets general-population gym clients, not athletes, because there are no athletic slots. The goal is OBSERVED from the title; the population is INFERRED. |
| Level(s) | No tab-level level. Level is chosen *per slot* by picking from the FOUNDATIONAL / MODERATE / ADVANCED / UNILATERAL blocks inside each dropdown. The demo fill mixes levels on the same day: 'Leg press' = ADVANCED (AI98), 'Bent Over Barbell Rows' = ADVANCED (X46), 'Lat Pulldown Pronated Grip' = FOUNDATIONAL (U11), 'DB Deadlifts' = MODERATE (AN46), 'Push Ups ' = MODERATE (AD47), 'Staggered Stance DL w/ DB ' = FOUNDATIONAL (AQ12), 'DB Push press' = FOUNDATIONAL (AA11). OBSERVED. |
| Days/week | 4 main days ('Day 1'-'Day 4') plus 2 'Optional' blocks (rows 17-22 after Day 2, rows 38-43 after Day 4), so 4 to 6 sessions. Tab C maps the same rows onto MONDAY, TUESDAY, WEDNESDAY (optional), THURSDAY, FRIDAY, SATURDAY (optional), SUNDAY 'OFF'. OBSERVED. |
| Day types (colour-coded) | Day 1 = Day 3 (A day, bg EFEFEF light grey). Day 2 = Day 4 (B day, bg CCCCCC mid grey). Optional = bg FCE5CD (peach). The slot lists of Day 1/Day 3 and of Day 2/Day 4 are identical. OBSERVED. |
| Equipment | Commercial gym. The 'Leg Extensions' slot offers only 'Leg Extensions' (machine) and 'Leg Curls' offers only 'Seated leg curls' / 'Lying Leg Curls', so those slots cannot be filled without machines. The demo picks are a calf machine, leg press, barbell, lat-pulldown machine, EZ bar, leg-extension machine and dumbbells. Most other slots also offer bodyweight options (Bodyweight Squats, push-ups, Inverted/TRX rows, band-assisted pull-ups, glute bridges, lunges). OBSERVED from the menus; the "gym" conclusion is INFERRED. |
| Leftovers | Merged-but-empty `A52:A58`, `A59:A65`. A conditional format turns cells green (57BB8A) when they contain "TRUE" on A3:D9 / B24:D30 / E3:G16 / E24:G37, but no TRUE cell exists. Column widths are set for empty G-J (G 21.88, H 16.25, I 23.25, J 19.13); tab C's tracking columns use the same H/I widths. These are OBSERVED. INFERRED: tabs A and C were cut from a common tracking template that had a DONE? checkbox. |

### A.2 Session-by-session table (every row of the tab)

| Day | # | Day colour | PURPOSE / CATEGORY (verbatim) | Dropdown -> library category | Canonical bucket | Exercise as filled [library level, cell] | Sets | Reps | Effort / intensity | Notes |
|---|---|---|---|---|---|---|---|---|---|---|
| Day 1 | 1 | EFEFEF | 'Calves' / 'Calves' | `D3` -> `AU7:AU13` 'CALVES' | ISO_CALF | 'Machine Calf Raises' [(no level label), AU13] | 3 | '15 Reps' | not prescribed (no column) |  |
| Day 1 | 2 | EFEFEF | 'Quads' / 'Bilateral KD' | `D4` -> `AI7:AI122` 'BILATERAL KNEE DOMINANT' | RP_BKD | 'Leg press' [ADVANCED, AI98] | 3 | '15 Reps' | not prescribed (no column) |  |
| Day 1 | 3 | EFEFEF | 'Back' / 'Horizontal Pull' | `D5` -> `X7:X162` 'HORIZONTAL PULL' | RP_HPULL | 'Bent Over Barbell Rows' [ADVANCED, X46] | 3 | '8 to 12 Reps' | not prescribed (no column) |  |
| Day 1 | 4 | EFEFEF | 'Quads/Glutes' / 'Unilateral KD' | `D6` -> `AL7:AL42` 'UNILATERAL KNEE DOMINANT' | RP_UKD | 'Reverse Lunges ' [(no level label), AL10] | 3 | '8 to 12 Reps' | not prescribed (no column) |  |
| Day 1 | 5 | EFEFEF | 'Back ' / 'Vertical Pull' | `D7` -> `U7:U122` 'VERTICAL PULL' | RP_VPULL | 'Lat Pulldown Pronated Grip' [FOUNDATIONAL, U11] | 3 | '15 Reps' | not prescribed (no column) |  |
| Day 1 | 6 | EFEFEF | 'Bicep' / 'Bicep' | `D8` -> `AS7:AS42` 'BICEP' | ISO_BICEP | 'Ez Bar Curls' [(no level label), AS9] | 2 | '20 Reps' | not prescribed (no column) |  |
| Day 1 | 7 | EFEFEF | 'Quads' / 'Leg Extensions' | `D9` -> `AM7:AM9` 'LEG EXTENSIONS' | ISO_QUAD | 'Leg Extensions' [(no level label), AM9] | 2 | '20 Reps' | not prescribed (no column) |  |
| Day 2 | 1 | CCCCCC | 'Hamstring' / 'Bilateral HD' | `D10` -> `AN7:AN122` 'BILATERAL HIP DOMNANT' | RP_BHD | 'DB Deadlifts' [MODERATE, AN46] | 3 | '15 Reps' | not prescribed (no column) |  |
| Day 2 | 2 | CCCCCC | 'Chest' / 'Horizontal Push' | `D11` -> `AD7:AD162` 'HORIZONTAL PUSH' | RP_HPUSH | 'Push Ups ' [MODERATE, AD47] | 3 | '15 Reps' | not prescribed (no column) |  |
| Day 2 | 3 | CCCCCC | 'Hamstring/Glutes' / 'Unilateral HD' | `D12` -> `AQ7:AQ42` 'UNILATERAL HIP DOMINANT' | RP_UHD | 'Staggered Stance DL w/ DB ' [FOUNDATIONAL, AQ12] | 'CHOOSE 👇' | 'CHOOSE 👇' | not prescribed (no column) | sets unset; reps unset |
| Day 2 | 4 | CCCCCC | 'Chest/Shoulders' / 'Vertical Push' | `D13` -> `AA7:AA122` 'VERTICAL PUSH' | RP_VPUSH | 'DB Push press' [FOUNDATIONAL, AA11] | 5 | '6 to 8 Reps' | not prescribed (no column) |  |
| Day 2 | 5 | CCCCCC | 'Hamstrings' / 'Leg Curls' | `D14` -> `AR7:AR10` 'LEG CURLS' | ISO_HAM | 'CHOOSE 👇' | 'CHOOSE 👇' | 'CHOOSE 👇' | not prescribed (no column) | sets unset; reps unset |
| Day 2 | 6 | CCCCCC | 'Tricep' / (blank) | `D15` -> `AT7:AT42` 'TRICEP' | ISO_TRICEP | 'CHOOSE 👇' | 'CHOOSE 👇' | 'CHOOSE 👇' | not prescribed (no column) | sets unset; reps unset; CATEGORY cell blank (verbatim) |
| Day 2 | 7 | CCCCCC | 'Shoulders/Traps' / 'ABdution' | `D16` -> `AH7:AH42` 'SIDE RAISES' | ISO_SIDE_REAR_DELT | 'CHOOSE 👇' | 'CHOOSE 👇' | 'CHOOSE 👇' | not prescribed (no column) | sets unset; reps unset |
| Optional (after Day 2) | 1 | FCE5CD | 'Calves' / (blank) | `D18` -> `AU7:AU13` 'CALVES' | ISO_CALF | 'CHOOSE 👇' | 'CHOOSE 👇' | 'CHOOSE 👇' | not prescribed (no column) | sets unset; reps unset |
| Optional (after Day 2) | 2 | FCE5CD | 'Cardio' / (blank) | `D19` -> `B7:B122` 'CARDIO' | COND_AEROBIC | 'CHOOSE 👇' | 'CHOOSE 👇' | - | not prescribed (no column) | sets unset; no REPS dropdown on this row (cardio options carry their own dose); range stops at B122: DISTANCE (200-1000m) and CALORIES (10-50 cals) options unreachable |
| Optional (after Day 2) | 3 | FCE5CD | 'Core' / (blank) | `D20` -> `O7:O283` 'CORE THORAX (+ CORE PELVIS block)' | CT_CORE_THORAX or CP_CORE_PELVIS | 'CHOOSE 👇' | 'CHOOSE 👇' | 'CHOOSE 👇' | not prescribed (no column) | sets unset; reps unset; one dropdown spans CORE THORAX (O8-O94) and CORE PELVIS (O124-O209) blocks |
| Optional (after Day 2) | 4 | FCE5CD | 'Focus 1' / (blank) | `D21` -> `AZ7:AZ335` 'FULL FOCUS LIST' | FOCUS | 'CHOOSE 👇' | 'CHOOSE 👇' | 'CHOOSE 👇' | not prescribed (no column) | sets unset; reps unset; muscle-organised specialisation menu (10 muscle headers); credited muscle = whatever the client picks |
| Optional (after Day 2) | 5 | FCE5CD | 'Focus 2' / (blank) | `D22` -> `AZ7:AZ335` 'FULL FOCUS LIST' | FOCUS | 'CHOOSE 👇' | 'CHOOSE 👇' | 'CHOOSE 👇' | not prescribed (no column) | sets unset; reps unset; muscle-organised specialisation menu (10 muscle headers); credited muscle = whatever the client picks |
| Day 3 | 1 | EFEFEF | 'Calves' / 'Calves' | `D24` -> `AU7:AU13` 'CALVES' | ISO_CALF | 'CHOOSE 👇' | 'CHOOSE 👇' | 'CHOOSE 👇' | not prescribed (no column) | sets unset; reps unset |
| Day 3 | 2 | EFEFEF | 'Quads' / 'Bilateral KD' | `D25` -> `AI7:AI122` 'BILATERAL KNEE DOMINANT' | RP_BKD | 'CHOOSE 👇' | 'CHOOSE 👇' | 'CHOOSE 👇' | not prescribed (no column) | sets unset; reps unset |
| Day 3 | 3 | EFEFEF | 'Back' / 'Horizontal Pull' | `D26` -> `X7:X162` 'HORIZONTAL PULL' | RP_HPULL | 'CHOOSE 👇' | 'CHOOSE 👇' | 'CHOOSE 👇' | not prescribed (no column) | sets unset; reps unset |
| Day 3 | 4 | EFEFEF | 'Quads/Glutes' / 'Unilateral KD' | `D27` -> `AL7:AL42` 'UNILATERAL KNEE DOMINANT' | RP_UKD | 'CHOOSE 👇' | 'CHOOSE 👇' | 'CHOOSE 👇' | not prescribed (no column) | sets unset; reps unset |
| Day 3 | 5 | EFEFEF | 'Back ' / 'Vertical Pull' | `D28` -> `U7:U122` 'VERTICAL PULL' | RP_VPULL | 'CHOOSE 👇' | 'CHOOSE 👇' | 'CHOOSE 👇' | not prescribed (no column) | sets unset; reps unset |
| Day 3 | 6 | EFEFEF | 'Bicep' / 'Bicep' | `D29` -> `AS7:AS42` 'BICEP' | ISO_BICEP | 'CHOOSE 👇' | 'CHOOSE 👇' | 'CHOOSE 👇' | not prescribed (no column) | sets unset; reps unset |
| Day 3 | 7 | EFEFEF | 'Quads' / 'Leg Extensions' | `D30` -> `AM7:AM9` 'LEG EXTENSIONS' | ISO_QUAD | 'CHOOSE 👇' | 'CHOOSE 👇' | 'CHOOSE 👇' | not prescribed (no column) | sets unset; reps unset |
| Day 4 | 1 | CCCCCC | 'Hamstring' / 'Bilateral HD' | `D31` -> `AN7:AN122` 'BILATERAL HIP DOMNANT' | RP_BHD | 'CHOOSE 👇' | 'CHOOSE 👇' | 'CHOOSE 👇' | not prescribed (no column) | sets unset; reps unset |
| Day 4 | 2 | CCCCCC | 'Chest' / 'Horizontal Push' | `D32` -> `AD7:AD162` 'HORIZONTAL PUSH' | RP_HPUSH | 'CHOOSE 👇' | 'CHOOSE 👇' | 'CHOOSE 👇' | not prescribed (no column) | sets unset; reps unset |
| Day 4 | 3 | CCCCCC | 'Hamstring/Glutes' / 'Unilateral HD' | `D33` -> `AQ7:AQ42` 'UNILATERAL HIP DOMINANT' | RP_UHD | 'CHOOSE 👇' | 'CHOOSE 👇' | 'CHOOSE 👇' | not prescribed (no column) | sets unset; reps unset |
| Day 4 | 4 | CCCCCC | 'Chest/Shoulders' / 'Vertical Push' | `D34` -> `AA7:AA122` 'VERTICAL PUSH' | RP_VPUSH | 'CHOOSE 👇' | 'CHOOSE 👇' | 'CHOOSE 👇' | not prescribed (no column) | sets unset; reps unset |
| Day 4 | 5 | CCCCCC | 'Hamstrings' / 'Leg Curls' | `D35` -> `AR7:AR10` 'LEG CURLS' | ISO_HAM | 'CHOOSE 👇' | 'CHOOSE 👇' | 'CHOOSE 👇' | not prescribed (no column) | sets unset; reps unset |
| Day 4 | 6 | CCCCCC | 'Tricep' / (blank) | `D36` -> `AT7:AT42` 'TRICEP' | ISO_TRICEP | 'CHOOSE 👇' | 'CHOOSE 👇' | 'CHOOSE 👇' | not prescribed (no column) | sets unset; reps unset; CATEGORY cell blank (verbatim) |
| Day 4 | 7 | CCCCCC | 'Shoulders/Traps' / 'ABdution' | `D37` -> `AH7:AH42` 'SIDE RAISES' | ISO_SIDE_REAR_DELT | 'CHOOSE 👇' | 'CHOOSE 👇' | 'CHOOSE 👇' | not prescribed (no column) | sets unset; reps unset |
| Optional (after Day 4) | 1 | FCE5CD | 'Calves' / (blank) | `D39` -> `AU7:AU13` 'CALVES' | ISO_CALF | 'CHOOSE 👇' | 'CHOOSE 👇' | 'CHOOSE 👇' | not prescribed (no column) | sets unset; reps unset |
| Optional (after Day 4) | 2 | FCE5CD | 'Cardio' / (blank) | `D40` -> `B7:B122` 'CARDIO' | COND_AEROBIC | 'CHOOSE 👇' | 'CHOOSE 👇' | - | not prescribed (no column) | sets unset; no REPS dropdown on this row (cardio options carry their own dose); range stops at B122: DISTANCE (200-1000m) and CALORIES (10-50 cals) options unreachable |
| Optional (after Day 4) | 3 | FCE5CD | 'Core' / (blank) | `D41` -> `O7:O283` 'CORE THORAX (+ CORE PELVIS block)' | CT_CORE_THORAX or CP_CORE_PELVIS | 'CHOOSE 👇' | 'CHOOSE 👇' | 'CHOOSE 👇' | not prescribed (no column) | sets unset; reps unset; one dropdown spans CORE THORAX (O8-O94) and CORE PELVIS (O124-O209) blocks |
| Optional (after Day 4) | 4 | FCE5CD | 'Focus 1' / (blank) | `D42` -> `AZ7:AZ335` 'FULL FOCUS LIST' | FOCUS | 'CHOOSE 👇' | 'CHOOSE 👇' | 'CHOOSE 👇' | not prescribed (no column) | sets unset; reps unset; muscle-organised specialisation menu (10 muscle headers); credited muscle = whatever the client picks |
| Optional (after Day 4) | 5 | FCE5CD | 'Focus 2' / (blank) | `D43` -> `AZ7:AZ335` 'FULL FOCUS LIST' | FOCUS | 'CHOOSE 👇' | 'CHOOSE 👇' | 'CHOOSE 👇' | not prescribed (no column) | sets unset; reps unset; muscle-organised specialisation menu (10 muscle headers); credited muscle = whatever the client picks |

### A.3 Rules visible in the layout

OBSERVED unless marked.

1. **A/B alternating full body.** A day = Calves, 'Bilateral KD', 'Horizontal Pull', 'Unilateral KD', 'Vertical Pull', 'Bicep', 'Leg Extensions'. B day = 'Bilateral HD', 'Horizontal Push', 'Unilateral HD', 'Vertical Push', 'Leg Curls', 'Tricep', 'ABdution'. Every main slot therefore runs at **2x/week frequency**.
2. **Knee-dominant goes with PULL, hip-dominant goes with PUSH.** Each day's upper body is single-direction (A = both pulls, B = both pushes). Functionally the 4-day "full body" is a **Knee+Pull / Hip+Push split**.
   - INFERRED why: hinges and rows/pull-downs share grip, lats, erectors and the posterior chain, so splitting hinge from pull spreads that fatigue. Squats and presses likewise split the anterior chain.
3. **In-day order: lower -> upper -> lower -> upper -> isolation.** Bilateral lower comes 1st, then horizontal upper, then unilateral lower, then vertical upper, then isolations. Bilateral comes before unilateral and horizontal before vertical, on both day types.
   - INFERRED: the alternation is built for alternating sets or supersets (A1/A2 = bilateral lower + horizontal upper, B1/B2 = unilateral lower + vertical upper). The SETS menu has 'SUPERSET W/ 👇' (AV16) for this, but it is not used in these tabs.
4. **Bilateral and unilateral lower work on the same day share the same dominance** (KD+KD on A, HD+HD on B). There is no opposite-dominance pairing (e.g. bilateral KD with unilateral HD) in this template. Tab B's Day 3 is the only place where both dominances share a day.
5. **Isolation goes at the end**, with one exception (rule 7). Each day has 3 single-joint slots: (a) the knee-action isolation for that day's lower pattern (A: 'Leg Extensions' after squat/lunge; B: 'Leg Curls' after hinges), (b) the arm muscle that assists that day's upper pattern (A: 'Bicep' after pulls; B: 'Tricep' after pushes), and (c) on B only, 'ABdution' (side raises) after the presses. The compound:isolation ratio is 4:3 on both days.
6. **Biomechanical gap-filling (INFERRED).** Each isolation trains a joint action the day's compounds under-train: knee flexion (hinges do not flex the knee), knee extension at short muscle length, shoulder abduction (frontal plane, which H/V presses do not cover), and elbow flexion and extension. The CATEGORY label is the joint action, 'ABdution', not a muscle. This is the "biomechanics" layer the coach describes.
7. **Calves open the A day** (D3/D24, order 1). They are the only isolation placed first, and they also open each optional day.
   - INFERRED: either ankle/calf prep before squats and lunges, or prioritising a stubborn small muscle while fresh (open question).
8. **No athletic work and no core on main days.** Core, cardio, extra calves and specialisation live only in the 'Optional' blocks.
9. **Optional day = a fixed 5-slot menu:** 'Calves', 'Cardio', 'Core', 'Focus 1', 'Focus 2' (4 resistance + 1 conditioning). 'Focus 1/2' draw from the muscle-organised 'FULL FOCUS LIST', which is the coach's "more sets for the muscle you want to grow" lever (INFERRED).
10. **Demo dose convention (Day 1 + Day 2).** Compounds get 3 sets, single-joint arm/quad work gets 2 sets, calves get 3 sets, and one explicitly heavier/explosive compound ('DB Push press') gets 5 sets of '6 to 8 Reps'.

### A.4 Quantitative volume

Exercises (slots) and working sets per session:

| Session | exercises (slots) | sets: as written (main days) | sets: assumed: coach convention (main) | sets: assumed: flat 3 (main) | sets: convention + optional days | sets: flat 3 + optional days |
|---|---|---|---|---|---|---|
| Day 1 | 7 | 19 | 19 | 21 | 19 | 21 |
| Day 2 | 7 | 11 | 20 | 21 | 20 | 21 |
| Optional (after Day 2) | 5 | n/a (optional not counted) | n/a (optional not counted) | n/a (optional not counted) | 12 | 12 |
| Day 3 | 7 | 0 | 19 | 21 | 19 | 21 |
| Day 4 | 7 | 0 | 20 | 21 | 20 | 21 |
| Optional (after Day 4) | 5 | n/a (optional not counted) | n/a (optional not counted) | n/a (optional not counted) | 12 | 12 |

**Weekly sets by canonical bucket:**

| Bucket | as written (main days) | assumed: coach convention (main) | assumed: flat 3 (main) | convention + optional days | flat 3 + optional days |
|---|---|---|---|---|---|
| AP_PLYO | 0 | 0 | 0 | 0 | 0 |
| AP_JUMP_LIMITED_KNEE | 0 | 0 | 0 | 0 | 0 |
| AP_THROW | 0 | 0 | 0 | 0 | 0 |
| AP_COD | 0 | 0 | 0 | 0 | 0 |
| AP_SPRINT | 0 | 0 | 0 | 0 | 0 |
| AP_TRIPLE_EXT | 0 | 0 | 0 | 0 | 0 |
| RP_BKD | 3 | 6 | 6 | 6 | 6 |
| RP_BHD | 3 | 6 | 6 | 6 | 6 |
| RP_UKD | 3 | 6 | 6 | 6 | 6 |
| RP_UHD | 0 | 6 | 6 | 6 | 6 |
| RP_HPUSH | 3 | 6 | 6 | 6 | 6 |
| RP_VPUSH | 5 | 10 | 6 | 10 | 6 |
| RP_HPULL | 3 | 6 | 6 | 6 | 6 |
| RP_VPULL | 3 | 6 | 6 | 6 | 6 |
| ISO_QUAD | 2 | 4 | 6 | 4 | 6 |
| ISO_HAM | 0 | 4 | 6 | 4 | 6 |
| ISO_CHEST | 0 | 0 | 0 | 0 | 0 |
| ISO_SIDE_REAR_DELT | 0 | 4 | 6 | 4 | 6 |
| ISO_BICEP | 2 | 4 | 6 | 4 | 6 |
| ISO_TRICEP | 0 | 4 | 6 | 4 | 6 |
| ISO_CALF | 3 | 6 | 6 | 12 | 12 |
| CT_CORE_THORAX or CP_CORE_PELVIS | 0 | 0 | 0 | 6 | 6 |
| CORE_OTHER | 0 | 0 | 0 | 0 | 0 |
| COND_AEROBIC | 0 | 0 | 0 | 2 bout(s) | 2 bout(s) |
| COND_SPRINT_BUYOUT | 0 | 0 | 0 | 0 | 0 |
| FOCUS | 0 | 0 | 0 | 12 | 12 |
| FUNCTIONAL | 0 | 0 | 0 | 0 | 0 |
| **TOTAL working sets** | 30 | 78 | 84 | 102 | 108 |

**Weekly sets by muscle** (convention in section 0.4):

| Muscle | as written (main days) | assumed: coach convention (main) | assumed: flat 3 (main) | convention + optional days | flat 3 + optional days |
|---|---|---|---|---|---|
| quads | 8 | 16 | 18 | 16 | 18 |
| glutes | 7.5 | 21 | 21 | 21 | 21 |
| hamstrings | 3 | 16 | 18 | 16 | 18 |
| chest | 5.5 | 11 | 9 | 11 | 9 |
| lats/upper back | 6 | 12 | 12 | 12 | 12 |
| front delts | 8 | 16 | 12 | 16 | 12 |
| side delts | 2.5 | 9 | 9 | 9 | 9 |
| rear delts | 1.5 | 3 | 3 | 3 | 3 |
| biceps | 5 | 10 | 12 | 10 | 12 |
| triceps | 4 | 12 | 12 | 12 | 12 |
| calves | 3 | 6 | 6 | 12 | 12 |
| abs/obliques | 0 | 0 | 0 | 6 | 6 |
| FOCUS (client-picked muscle) | 0 | 0 | 0 | 12 | 12 |

Reading the numbers:

- **Sessions.** 7 exercises and **19-21 working sets** per main session; 5 slots and about **12 sets + 1 cardio bout** per optional day. The single complete day (Day 1) is 7 exercises / 19 sets / about 275 reps (rep-range midpoints). OBSERVED.
- **Week.** About 78-84 main-day sets per week, or 102-108 with both optional days. INFERRED from the assumptions.
- **Against the coach's "15-20 sets per muscle per week":**
  - Lower body sits at or above the band: quads 16-18, hamstrings 16-18, glutes 21.
  - Upper body is below the band before Focus: chest 9-11, back 12, front delts 12-16, side delts 9, rear delts 3, biceps 10-12, triceps 12. Calves are 6, or 12 with optional days.
  - INFERRED: the default template is lower-body/glute-biased, and the two Focus slots on each optional day (up to +12 sets/week) are what lift one or two chosen muscles into the 15-20+ band. Example: all Focus on chest takes it from 9 to 21.
- **Rear delts get only 3 indirect sets/week.** No slot in this template targets them, unless the client spends the 'ABdution' slot on a reverse fly.

### A.5 Rep ranges, intensity, rest, tempo

Observed prescriptions (Day 1 and Day 2 only):

| Bucket | Exercise (verbatim) | Sets x reps (verbatim) | Muscle size class |
|---|---|---|---|
| ISO_CALF | 'Machine Calf Raises' | 3 x '15 Reps' | small |
| RP_BKD | 'Leg press' | 3 x '15 Reps' | big |
| RP_HPULL | 'Bent Over Barbell Rows' | 3 x '8 to 12 Reps' | big |
| RP_UKD | 'Reverse Lunges ' | 3 x '8 to 12 Reps' | big |
| RP_VPULL | 'Lat Pulldown Pronated Grip' | 3 x '15 Reps' | big |
| ISO_BICEP | 'Ez Bar Curls' | 2 x '20 Reps' | small |
| ISO_QUAD | 'Leg Extensions' | 2 x '20 Reps' | big muscle, single-joint |
| RP_BHD | 'DB Deadlifts' | 3 x '15 Reps' | big |
| RP_HPUSH | 'Push Ups ' | 3 x '15 Reps' | big |
| RP_VPUSH | 'DB Push press' | 5 x '6 to 8 Reps' | big (ballistic) |
| RP_UHD | 'Staggered Stance DL w/ DB ' | 'CHOOSE 👇' x 'CHOOSE 👇' | big |

- **Compounds (RP_\*).** Range 6-15 reps; set-weighted mean ~**12.0 reps/set** (275 rep-midpoints / 23 sets).
- **Single-joint plus calves.** Range 15-20 reps; mean ~**17.9 reps/set** (125 / 7). OBSERVED arithmetic on the cells.
- INFERRED reading of the rep rule:
  - The 20-rep slots are the *single-joint* exercises (biceps and leg extensions, the latter a big muscle). Rep count therefore follows "isolation vs compound" at least as much as "small vs big muscle".
  - Among compounds, the lower 8-12 range goes to free-weight, technique-limited lifts (barbell row, lunge). The 15-rep range goes to stable or self-limiting ones (leg press, pulldown, push-ups, DB deadlift).
  - The one 6-8 slot is the explosive lift (push press) and carries the most sets (5). That matches the coach's use of '6 to 8 Reps' for power/athletic drills in JUSTICE LEAGUE.
- **Intensity.** None prescribed: no RIR/RPE/% column. The MASTER_MODEL aesthetics track writes '1-2 RIR' on every row (see section D).
- **Rest and tempo.** None anywhere in the tab.

### A.6 Progression

- **Week-to-week.** None in the tab: it is a single-week template with no week column, no % and no deload. OBSERVED.
- **Level-to-level.** There is no separate beginner/advanced version. Progression levers available inside the tab are:
  - moving a slot's pick from FOUNDATIONAL -> MODERATE -> ADVANCED within the same dropdown;
  - SETS 1-8;
  - the REPS menu, including 'MYO SET';
  - 'SUPERSET W/ 👇';
  - adding the optional days and Focus slots.
- **3-day -> 4-day.** Moving from tab B to tab A is a frequency/volume step of +87% main-day slots (see section D.1). OBSERVED counts; reading it as a progression is INFERRED.

---

## B. `3 DAY BUILDER`

### B.1 Identity

| Field | Value |
|---|---|
| Tab / title | '3 DAY BUILDER' / C1 'AESTHETICS - FULL BODY - 3 DAYS A WEEK'. OBSERVED. |
| Columns | A 'DAY', B 'PURPOSE', C 'CATEGORY', D 'EXERCISE', E 'SETS', F 'REPS' (same as tab A). OBSERVED. |
| Goal / population | Aesthetics, for clients with 3 training days. OBSERVED title; population INFERRED. |
| Level(s) | Per-slot dropdown levels, as in tab A. Nothing is filled. |
| Days/week | 3 main days ('DAY 1', 'DAY 2', 'DAY 3'), each followed by an 'Optional' block (rows 8-12, 18-22, 28-32), so 6 day-blocks. INFERRED week: Mon DAY 1 / Tue optional / Wed DAY 2 / Thu optional / Fri DAY 3 / Sat optional / Sun off. This fills a 7-day week and matches the train/optional rhythm that tab C spells out for the 4-day. |
| Day types (colour) | DAY 1 bg EFEFEF (= tab A's A-day colour), DAY 2 bg CCCCCC (= B-day colour), **DAY 3 bg FFF2CC (light yellow - a new, third day type)**, Optional FCE5CD. OBSERVED. |
| Equipment | Same menus as tab A. Leg Curls is still machine-only. ISO_QUAD is absent, so leg extensions are not required. |
| Leftovers | The "contains TRUE" -> green 57BB8A conditional format sits on A3:F7, B23:D23, B25:D25, B27:D27, E13:F17, E23:F27 and never fires. OBSERVED. |

### B.2 Session-by-session table

| Day | # | Day colour | PURPOSE / CATEGORY (verbatim) | Dropdown -> library category | Canonical bucket | Exercise as filled [library level, cell] | Sets | Reps | Effort / intensity | Notes |
|---|---|---|---|---|---|---|---|---|---|---|
| DAY 1 | 1 | EFEFEF | 'Calves' / 'Calves' | `D3` -> `AU7:AU13` 'CALVES' | ISO_CALF | 'CHOOSE 👇' | 'CHOOSE 👇' | 'CHOOSE 👇' | not prescribed (no column) | sets unset; reps unset |
| DAY 1 | 2 | EFEFEF | 'Quads' / 'Bilateral KD' | `D4` -> `AI7:AI122` 'BILATERAL KNEE DOMINANT' | RP_BKD | 'CHOOSE 👇' | 'CHOOSE 👇' | 'CHOOSE 👇' | not prescribed (no column) | sets unset; reps unset |
| DAY 1 | 3 | EFEFEF | 'Back' / 'Horizontal Pull' | `D5` -> `X7:X162` 'HORIZONTAL PULL' | RP_HPULL | 'CHOOSE 👇' | 'CHOOSE 👇' | 'CHOOSE 👇' | not prescribed (no column) | sets unset; reps unset |
| DAY 1 | 4 | EFEFEF | 'Quads/Glutes' / 'Unilateral KD' | `D6` -> `AL7:AL42` 'UNILATERAL KNEE DOMINANT' | RP_UKD | 'CHOOSE 👇' | 'CHOOSE 👇' | 'CHOOSE 👇' | not prescribed (no column) | sets unset; reps unset |
| DAY 1 | 5 | EFEFEF | 'Back ' / 'Vertical Pull' | `D7` -> `U7:U122` 'VERTICAL PULL' | RP_VPULL | 'CHOOSE 👇' | 'CHOOSE 👇' | 'CHOOSE 👇' | not prescribed (no column) | sets unset; reps unset |
| Optional (after DAY 1) | 1 | FCE5CD | 'Calves' / (blank) | `D8` -> `AU7:AU13` 'CALVES' | ISO_CALF | 'CHOOSE 👇' | 'CHOOSE 👇' | 'CHOOSE 👇' | not prescribed (no column) | sets unset; reps unset |
| Optional (after DAY 1) | 2 | FCE5CD | 'Cardio' / (blank) | `D9` -> `B7:B122` 'CARDIO' | COND_AEROBIC | 'CHOOSE 👇' | 'CHOOSE 👇' | - | not prescribed (no column) | sets unset; no REPS dropdown on this row (cardio options carry their own dose); range stops at B122: DISTANCE (200-1000m) and CALORIES (10-50 cals) options unreachable |
| Optional (after DAY 1) | 3 | FCE5CD | 'Core' / (blank) | `D10` -> `O7:O283` 'CORE THORAX (+ CORE PELVIS block)' | CT_CORE_THORAX or CP_CORE_PELVIS | 'CHOOSE 👇' | 'CHOOSE 👇' | 'CHOOSE 👇' | not prescribed (no column) | sets unset; reps unset; one dropdown spans CORE THORAX (O8-O94) and CORE PELVIS (O124-O209) blocks |
| Optional (after DAY 1) | 4 | FCE5CD | 'Focus 1' / (blank) | `D11` -> `AZ7:AZ335` 'FULL FOCUS LIST' | FOCUS | 'CHOOSE 👇' | 'CHOOSE 👇' | 'CHOOSE 👇' | not prescribed (no column) | sets unset; reps unset; muscle-organised specialisation menu (10 muscle headers); credited muscle = whatever the client picks |
| Optional (after DAY 1) | 5 | FCE5CD | 'Focus 2' / (blank) | `D12` -> `AZ7:AZ335` 'FULL FOCUS LIST' | FOCUS | 'CHOOSE 👇' | 'CHOOSE 👇' | 'CHOOSE 👇' | not prescribed (no column) | sets unset; reps unset; muscle-organised specialisation menu (10 muscle headers); credited muscle = whatever the client picks |
| DAY 2 | 1 | CCCCCC | 'Hamstring' / 'Bilateral HD' | `D13` -> `AN7:AN122` 'BILATERAL HIP DOMNANT' | RP_BHD | 'CHOOSE 👇' | 'CHOOSE 👇' | 'CHOOSE 👇' | not prescribed (no column) | sets unset; reps unset |
| DAY 2 | 2 | CCCCCC | 'Chest' / 'Horizontal Push' | `D14` -> `AD7:AD162` 'HORIZONTAL PUSH' | RP_HPUSH | 'CHOOSE 👇' | 'CHOOSE 👇' | 'CHOOSE 👇' | not prescribed (no column) | sets unset; reps unset |
| DAY 2 | 3 | CCCCCC | 'Hamstring/Glutes' / 'Unilateral HD' | `D15` -> `AQ7:AQ42` 'UNILATERAL HIP DOMINANT' | RP_UHD | 'CHOOSE 👇' | 'CHOOSE 👇' | 'CHOOSE 👇' | not prescribed (no column) | sets unset; reps unset |
| DAY 2 | 4 | CCCCCC | 'Chest/Shoulders' / 'Vertical Push' | `D16` -> `AA7:AA122` 'VERTICAL PUSH' | RP_VPUSH | 'CHOOSE 👇' | 'CHOOSE 👇' | 'CHOOSE 👇' | not prescribed (no column) | sets unset; reps unset |
| DAY 2 | 5 | CCCCCC | 'Hamstrings' / 'Leg Curls' | `D17` -> `AR7:AR10` 'LEG CURLS' | ISO_HAM | 'CHOOSE 👇' | 'CHOOSE 👇' | 'CHOOSE 👇' | not prescribed (no column) | sets unset; reps unset |
| Optional (after DAY 2) | 1 | FCE5CD | 'Calves' / (blank) | `D18` -> `AU7:AU13` 'CALVES' | ISO_CALF | 'CHOOSE 👇' | 'CHOOSE 👇' | 'CHOOSE 👇' | not prescribed (no column) | sets unset; reps unset |
| Optional (after DAY 2) | 2 | FCE5CD | 'Cardio' / (blank) | `D19` -> `B7:B122` 'CARDIO' | COND_AEROBIC | 'CHOOSE 👇' | 'CHOOSE 👇' | - | not prescribed (no column) | sets unset; no REPS dropdown on this row (cardio options carry their own dose); range stops at B122: DISTANCE (200-1000m) and CALORIES (10-50 cals) options unreachable |
| Optional (after DAY 2) | 3 | FCE5CD | 'Core' / (blank) | `D20` -> `O7:O283` 'CORE THORAX (+ CORE PELVIS block)' | CT_CORE_THORAX or CP_CORE_PELVIS | 'CHOOSE 👇' | 'CHOOSE 👇' | 'CHOOSE 👇' | not prescribed (no column) | sets unset; reps unset; one dropdown spans CORE THORAX (O8-O94) and CORE PELVIS (O124-O209) blocks |
| Optional (after DAY 2) | 4 | FCE5CD | 'Focus 1' / (blank) | `D21` -> `AZ7:AZ335` 'FULL FOCUS LIST' | FOCUS | 'CHOOSE 👇' | 'CHOOSE 👇' | 'CHOOSE 👇' | not prescribed (no column) | sets unset; reps unset; muscle-organised specialisation menu (10 muscle headers); credited muscle = whatever the client picks |
| Optional (after DAY 2) | 5 | FCE5CD | 'Focus 2' / (blank) | `D22` -> `AZ7:AZ335` 'FULL FOCUS LIST' | FOCUS | 'CHOOSE 👇' | 'CHOOSE 👇' | 'CHOOSE 👇' | not prescribed (no column) | sets unset; reps unset; muscle-organised specialisation menu (10 muscle headers); credited muscle = whatever the client picks |
| DAY 3 | 1 | FFF2CC | 'Quads' / 'Bilateral KD' | `D23` -> `AI7:AI122` 'BILATERAL KNEE DOMINANT' | RP_BKD | 'CHOOSE 👇' | 'CHOOSE 👇' | 'CHOOSE 👇' | not prescribed (no column) | sets unset; reps unset |
| DAY 3 | 2 | FFF2CC | 'Hamstring' / 'Bilateral HD' | `D24` -> `AN7:AN122` 'BILATERAL HIP DOMNANT' | RP_BHD | 'CHOOSE 👇' | 'CHOOSE 👇' | 'CHOOSE 👇' | not prescribed (no column) | sets unset; reps unset |
| DAY 3 | 3 | FFF2CC | 'Back' / 'Horizontal Pull' | `D25` -> `X7:X162` 'HORIZONTAL PULL' | RP_HPULL | 'CHOOSE 👇' | 'CHOOSE 👇' | 'CHOOSE 👇' | not prescribed (no column) | sets unset; reps unset |
| DAY 3 | 4 | FFF2CC | 'Chest' / 'Horizontal Push' | `D26` -> `AD7:AD162` 'HORIZONTAL PUSH' | RP_HPUSH | 'CHOOSE 👇' | 'CHOOSE 👇' | 'CHOOSE 👇' | not prescribed (no column) | sets unset; reps unset |
| DAY 3 | 5 | FFF2CC | 'Quads/Glutes' / 'Unilateral KD' | `D27` -> `AL7:AL42` 'UNILATERAL KNEE DOMINANT' | RP_UKD | 'CHOOSE 👇' | 'CHOOSE 👇' | 'CHOOSE 👇' | not prescribed (no column) | sets unset; reps unset |
| Optional (after DAY 3) | 1 | FCE5CD | 'Calves' / (blank) | `D28` -> `AU7:AU13` 'CALVES' | ISO_CALF | 'CHOOSE 👇' | 'CHOOSE 👇' | 'CHOOSE 👇' | not prescribed (no column) | sets unset; reps unset |
| Optional (after DAY 3) | 2 | FCE5CD | 'Cardio' / (blank) | `D29` -> `B7:B122` 'CARDIO' | COND_AEROBIC | 'CHOOSE 👇' | 'CHOOSE 👇' | - | not prescribed (no column) | sets unset; no REPS dropdown on this row (cardio options carry their own dose); range stops at B122: DISTANCE (200-1000m) and CALORIES (10-50 cals) options unreachable |
| Optional (after DAY 3) | 3 | FCE5CD | 'Core' / (blank) | `D30` -> `O7:O283` 'CORE THORAX (+ CORE PELVIS block)' | CT_CORE_THORAX or CP_CORE_PELVIS | 'CHOOSE 👇' | 'CHOOSE 👇' | 'CHOOSE 👇' | not prescribed (no column) | sets unset; reps unset; one dropdown spans CORE THORAX (O8-O94) and CORE PELVIS (O124-O209) blocks |
| Optional (after DAY 3) | 4 | FCE5CD | 'Focus 1' / (blank) | `D31` -> `AZ7:AZ335` 'FULL FOCUS LIST' | FOCUS | 'CHOOSE 👇' | 'CHOOSE 👇' | 'CHOOSE 👇' | not prescribed (no column) | sets unset; reps unset; muscle-organised specialisation menu (10 muscle headers); credited muscle = whatever the client picks |
| Optional (after DAY 3) | 5 | FCE5CD | 'Focus 2' / (blank) | `D32` -> `AZ7:AZ335` 'FULL FOCUS LIST' | FOCUS | 'CHOOSE 👇' | 'CHOOSE 👇' | 'CHOOSE 👇' | not prescribed (no column) | sets unset; reps unset; muscle-organised specialisation menu (10 muscle headers); credited muscle = whatever the client picks |

### B.3 Rules visible

1. **DAY 1 = tab A's A day without 'Bicep' and 'Leg Extensions'**: Calves, 'Bilateral KD', 'Horizontal Pull', 'Unilateral KD', 'Vertical Pull'. Order and pairing are kept (knee + pull, lower/upper alternation). OBSERVED.
2. **DAY 2 = tab A's B day without 'Tricep' and 'ABdution'**: 'Bilateral HD', 'Horizontal Push', 'Unilateral HD', 'Vertical Push', 'Leg Curls'. OBSERVED.
3. **DAY 3 is a new "C" day**: 'Bilateral KD', 'Bilateral HD', 'Horizontal Pull', 'Horizontal Push', 'Unilateral KD'. It is the only day in these three tabs with both lower dominances. Its order is lower-lower-upper-upper-lower, not the strict alternation of A/B. OBSERVED.
4. **Weekly frequency:**
   - 2x: BKD, BHD, HPULL, HPUSH, UKD.
   - 1x: VPULL, VPUSH, UHD, Leg Curls, Calves (+3 optional Calves slots).
   - 0x on main days: biceps, triceps, side delts, leg extensions. OBSERVED.
5. **What gets cut when a day is removed (INFERRED priority order):**
   - Arm, delt and quad isolation goes first.
   - Vertical push/pull and unilateral hip-dominant drop to once a week.
   - Bilateral lower patterns, horizontal push/pull and the lunge pattern stay at twice a week.
   - **'Leg Curls' is the only isolation that survives.** This fits rule A.3.6: knee flexion is the one joint action the remaining compounds do not cover, while knee extension, elbow flexion/extension and shoulder abduction still get indirect work from squats, lunges, rows and presses.
6. **Unilateral KD (2x) gets twice the frequency of Unilateral HD (1x).** INFERRED: the lunge pattern ('Quads/Glutes') is valued above the single-leg hinge for an aesthetics client.
7. **The optional block repeats after every day** (3 blocks vs 2 in the 4-day). The 3-day client gets *more* optional/Focus opportunity: up to 6 Focus slots/week vs 4. OBSERVED counts; INFERRED meaning: fewer main days are compensated by more self-selected specialisation.

### B.4 Quantitative volume

| Session | exercises (slots) | sets: as written (main days) | sets: assumed: coach convention (main) | sets: assumed: flat 3 (main) | sets: convention + optional days | sets: flat 3 + optional days |
|---|---|---|---|---|---|---|
| DAY 1 | 5 | 0 | 15 | 15 | 15 | 15 |
| Optional (after DAY 1) | 5 | n/a (optional not counted) | n/a (optional not counted) | n/a (optional not counted) | 12 | 12 |
| DAY 2 | 5 | 0 | 14 | 15 | 14 | 15 |
| Optional (after DAY 2) | 5 | n/a (optional not counted) | n/a (optional not counted) | n/a (optional not counted) | 12 | 12 |
| DAY 3 | 5 | 0 | 15 | 15 | 15 | 15 |
| Optional (after DAY 3) | 5 | n/a (optional not counted) | n/a (optional not counted) | n/a (optional not counted) | 12 | 12 |

**Weekly sets by canonical bucket:**

| Bucket | as written (main days) | assumed: coach convention (main) | assumed: flat 3 (main) | convention + optional days | flat 3 + optional days |
|---|---|---|---|---|---|
| AP_PLYO | 0 | 0 | 0 | 0 | 0 |
| AP_JUMP_LIMITED_KNEE | 0 | 0 | 0 | 0 | 0 |
| AP_THROW | 0 | 0 | 0 | 0 | 0 |
| AP_COD | 0 | 0 | 0 | 0 | 0 |
| AP_SPRINT | 0 | 0 | 0 | 0 | 0 |
| AP_TRIPLE_EXT | 0 | 0 | 0 | 0 | 0 |
| RP_BKD | 0 | 6 | 6 | 6 | 6 |
| RP_BHD | 0 | 6 | 6 | 6 | 6 |
| RP_UKD | 0 | 6 | 6 | 6 | 6 |
| RP_UHD | 0 | 3 | 3 | 3 | 3 |
| RP_HPUSH | 0 | 6 | 6 | 6 | 6 |
| RP_VPUSH | 0 | 3 | 3 | 3 | 3 |
| RP_HPULL | 0 | 6 | 6 | 6 | 6 |
| RP_VPULL | 0 | 3 | 3 | 3 | 3 |
| ISO_QUAD | 0 | 0 | 0 | 0 | 0 |
| ISO_HAM | 0 | 2 | 3 | 2 | 3 |
| ISO_CHEST | 0 | 0 | 0 | 0 | 0 |
| ISO_SIDE_REAR_DELT | 0 | 0 | 0 | 0 | 0 |
| ISO_BICEP | 0 | 0 | 0 | 0 | 0 |
| ISO_TRICEP | 0 | 0 | 0 | 0 | 0 |
| ISO_CALF | 0 | 3 | 3 | 12 | 12 |
| CT_CORE_THORAX or CP_CORE_PELVIS | 0 | 0 | 0 | 9 | 9 |
| CORE_OTHER | 0 | 0 | 0 | 0 | 0 |
| COND_AEROBIC | 0 | 0 | 0 | 3 bout(s) | 3 bout(s) |
| COND_SPRINT_BUYOUT | 0 | 0 | 0 | 0 | 0 |
| FOCUS | 0 | 0 | 0 | 18 | 18 |
| FUNCTIONAL | 0 | 0 | 0 | 0 | 0 |
| **TOTAL working sets** | 0 | 44 | 45 | 80 | 81 |

**Weekly sets by muscle:**

| Muscle | as written (main days) | assumed: coach convention (main) | assumed: flat 3 (main) | convention + optional days | flat 3 + optional days |
|---|---|---|---|---|---|
| quads | 0 | 12 | 12 | 12 | 12 |
| glutes | 0 | 18 | 18 | 18 | 18 |
| hamstrings | 0 | 11 | 12 | 11 | 12 |
| chest | 0 | 7.5 | 7.5 | 7.5 | 7.5 |
| lats/upper back | 0 | 9 | 9 | 9 | 9 |
| front delts | 0 | 9 | 9 | 9 | 9 |
| side delts | 0 | 1.5 | 1.5 | 1.5 | 1.5 |
| rear delts | 0 | 3 | 3 | 3 | 3 |
| biceps | 0 | 4.5 | 4.5 | 4.5 | 4.5 |
| triceps | 0 | 4.5 | 4.5 | 4.5 | 4.5 |
| calves | 0 | 3 | 3 | 12 | 12 |
| abs/obliques | 0 | 0 | 0 | 9 | 9 |
| FOCUS (client-picked muscle) | 0 | 0 | 0 | 18 | 18 |

Reading the numbers:

- **5 exercises / 15 sets per main session** under either assumption (14 if Leg Curls follow the 2-set isolation convention). That is 44-45 main-day sets per week, or 80-81 with three optional days. As written, the count is 0 (nothing is filled).
- **Muscles (flat 3, main days):**
  - Glutes 18 and quads 12 are the best served.
  - Hamstrings 12, back 9, front delts 9, chest 7.5.
  - Biceps and triceps 4.5 (indirect only), side delts 1.5, calves 3.
  - Every upper-body muscle sits well under the 15-20 band unless Focus slots go to it.

### B.5 Rep ranges / intensity / rest / tempo

Nothing is prescribed: every SETS/REPS cell is 'CHOOSE 👇', and there are no effort, rest or tempo columns. The same SETS/REPS menus as tab A apply. OBSERVED.

### B.6 Progression

None in the tab (single-week template). The 3 -> 4 day comparison is in section D.1.

---

## C. `NO ACCESS - AESTHETICS - FB - 4` (hidden)

### C.1 Identity

| Field | Value |
|---|---|
| Tab / title | 'NO ACCESS - AESTHETICS - FB - 4'. Sheet state **hidden**. `A1:K1` is merged but empty, so there is **no title**. OBSERVED. |
| Columns | A 'WEEK', B 'DAY', C 'PURPOSE', D 'CATEGORY', E 'EXERCISE', F 'SETS', G 'REPS', H 'WEIGHT USED or SCORE', I 'EFFORT', J 'HOW IT FELT?', K 'DONE?'. OBSERVED. |
| What it is | The **client logbook version of tab A**. It has the identical slot template, laid out on a real weekly calendar with tracking columns. 'NO ACCESS' meaning is unknown. INFERRED options: a self-guided version for buyers with no coach access, or a locked or retired template. It cannot mean "no gym", because every machine/barbell menu is still wired. |
| Weeks | Only 'WEEK 1' (A3, A10, A17, A24, A31, A38, A45; bg CFE2F3 light blue). `A52:A58` and `A59:A65` are merged but empty (room for more day blocks). There is no week 2+ and no progression. OBSERVED. |
| Days/week | MONDAY (EFEFEF) = A day; TUESDAY (CCCCCC) = B day; WEDNESDAY (FCE5CD) = optional menu; THURSDAY (EFEFEF) = A day; FRIDAY (CCCCCC) = B day; SATURDAY (FCE5CD) = optional menu; SUNDAY (F4CCCC light red) = 'OFF' in C45 and E45:K45 (merged to row 51). **This confirms tab A's rhythm: train-train-optional-train-train-optional-off.** OBSERVED. |
| Tracking mechanics | **DONE?**: one checkbox per day (K3, K10, K17, K24, K31, K38, all `False`, merged per day). Conditional formats make FALSE red (theme accent2 = EA4335) and TRUE green (57BB8A). **WEIGHT USED or SCORE** has no dropdown; a conditional format makes it red EA9999 while blank and green B6D7A8 once filled, a nudge to log load. **EFFORT** `AX7:AX42` and **HOW IT FELT?** `AY7:AY42` are dropdowns. Cardio rows have SETS + EFFORT only (no REPS, no HOW IT FELT?). OBSERVED. |
| Equipment / level | Same as tab A. |
| Defects | (1) **E12/E33 ('Hamstring/Glutes' / 'Unilateral HD') point at `AR7:AR42` = 'LEG CURLS'**, so the single-leg hinge slot can only hold 'Seated leg curls' / 'Lying Leg Curls'. Tuesday/Friday then contain two leg-curl slots and zero RP_UHD. (2) Most placeholders read 'CHOSE 👇', which is not a list value, so every such cell shows an invalid-data flag. 'CHOOSE 👇' survives in E4-E10 and E30. (3) The Cardio range `B7:B122` is truncated, so 'DISTANCE' 200m-1000m and 'CALORIES' 10-50 cals cannot be picked. (4) The Tricep CATEGORY cells (D15/D36) are blank. OBSERVED. |

### C.2 Session-by-session table

| Day | # | Day colour | PURPOSE / CATEGORY (verbatim) | Dropdown -> library category | Canonical bucket | Exercise as filled [library level, cell] | Sets | Reps | Effort / intensity | Notes |
|---|---|---|---|---|---|---|---|---|---|---|
| MONDAY | 1 | EFEFEF | 'Calves' / 'Calves' | `E3` -> `AU7:AU13` 'CALVES' | ISO_CALF | 'CHOSE 👇' | 'CHOSE 👇' | 'CHOSE 👇' | EFFORT 'CHOSE 👇' (dropdown AX7:AX42); HOW IT FELT? 'CHOSE 👇' (AY7:AY42); WEIGHT USED blank | sets unset; reps unset; placeholder typo 'CHOSE 👇' is not a list value -> invalid-value flag |
| MONDAY | 2 | EFEFEF | 'Quads' / 'Bilateral KD' | `E4` -> `AI7:AI122` 'BILATERAL KNEE DOMINANT' | RP_BKD | 'CHOOSE 👇' | 'CHOSE 👇' | 'CHOSE 👇' | EFFORT 'CHOSE 👇' (dropdown AX7:AX42); HOW IT FELT? 'CHOSE 👇' (AY7:AY42); WEIGHT USED blank | sets unset; reps unset; placeholder typo 'CHOSE 👇' is not a list value -> invalid-value flag |
| MONDAY | 3 | EFEFEF | 'Back' / 'Horizontal Pull' | `E5` -> `X7:X162` 'HORIZONTAL PULL' | RP_HPULL | 'CHOOSE 👇' | 'CHOSE 👇' | 'CHOSE 👇' | EFFORT 'CHOSE 👇' (dropdown AX7:AX42); HOW IT FELT? 'CHOSE 👇' (AY7:AY42); WEIGHT USED blank | sets unset; reps unset; placeholder typo 'CHOSE 👇' is not a list value -> invalid-value flag |
| MONDAY | 4 | EFEFEF | 'Quads/Glutes' / 'Unilateral KD' | `E6` -> `AL7:AL42` 'UNILATERAL KNEE DOMINANT' | RP_UKD | 'CHOOSE 👇' | 'CHOSE 👇' | 'CHOSE 👇' | EFFORT 'CHOSE 👇' (dropdown AX7:AX42); HOW IT FELT? 'CHOSE 👇' (AY7:AY42); WEIGHT USED blank | sets unset; reps unset; placeholder typo 'CHOSE 👇' is not a list value -> invalid-value flag |
| MONDAY | 5 | EFEFEF | 'Back ' / 'Vertical Pull' | `E7` -> `U7:U122` 'VERTICAL PULL' | RP_VPULL | 'CHOOSE 👇' | 'CHOSE 👇' | 'CHOSE 👇' | EFFORT 'CHOSE 👇' (dropdown AX7:AX42); HOW IT FELT? 'CHOSE 👇' (AY7:AY42); WEIGHT USED blank | sets unset; reps unset; placeholder typo 'CHOSE 👇' is not a list value -> invalid-value flag |
| MONDAY | 6 | EFEFEF | 'Bicep' / 'Bicep' | `E8` -> `AS7:AS42` 'BICEP' | ISO_BICEP | 'CHOOSE 👇' | 'CHOSE 👇' | 'CHOSE 👇' | EFFORT 'CHOSE 👇' (dropdown AX7:AX42); HOW IT FELT? 'CHOSE 👇' (AY7:AY42); WEIGHT USED blank | sets unset; reps unset; placeholder typo 'CHOSE 👇' is not a list value -> invalid-value flag |
| MONDAY | 7 | EFEFEF | 'Quads' / 'Leg Extensions' | `E9` -> `AM7:AM9` 'LEG EXTENSIONS' | ISO_QUAD | 'CHOOSE 👇' | 'CHOSE 👇' | 'CHOSE 👇' | EFFORT 'CHOSE 👇' (dropdown AX7:AX42); HOW IT FELT? 'CHOSE 👇' (AY7:AY42); WEIGHT USED blank | sets unset; reps unset; placeholder typo 'CHOSE 👇' is not a list value -> invalid-value flag |
| TUESDAY | 1 | CCCCCC | 'Hamstring' / 'Bilateral HD' | `E10` -> `AN7:AN122` 'BILATERAL HIP DOMNANT' | RP_BHD | 'CHOOSE 👇' | 'CHOSE 👇' | 'CHOSE 👇' | EFFORT 'CHOSE 👇' (dropdown AX7:AX42); HOW IT FELT? 'CHOSE 👇' (AY7:AY42); WEIGHT USED blank | sets unset; reps unset; placeholder typo 'CHOSE 👇' is not a list value -> invalid-value flag |
| TUESDAY | 2 | CCCCCC | 'Chest' / 'Horizontal Push' | `E11` -> `AD7:AD162` 'HORIZONTAL PUSH' | RP_HPUSH | 'CHOSE 👇' | 'CHOSE 👇' | 'CHOSE 👇' | EFFORT 'CHOSE 👇' (dropdown AX7:AX42); HOW IT FELT? 'CHOSE 👇' (AY7:AY42); WEIGHT USED blank | sets unset; reps unset; placeholder typo 'CHOSE 👇' is not a list value -> invalid-value flag |
| TUESDAY | 3 | CCCCCC | 'Hamstring/Glutes' / 'Unilateral HD' | `E12` -> `AR7:AR42` 'LEG CURLS' | ISO_HAM | 'CHOSE 👇' | 'CHOSE 👇' | 'CHOSE 👇' | EFFORT 'CHOSE 👇' (dropdown AX7:AX42); HOW IT FELT? 'CHOSE 👇' (AY7:AY42); WEIGHT USED blank | sets unset; reps unset; **MISWIRED**: slot says 'Unilateral HD' but dropdown = LEG CURLS list (AR7:AR42); the visible AESTHETICS tab uses AQ7:AQ42; placeholder typo 'CHOSE 👇' is not a list value -> invalid-value flag |
| TUESDAY | 4 | CCCCCC | 'Chest/Shoulders' / 'Vertical Push' | `E13` -> `AA7:AA122` 'VERTICAL PUSH' | RP_VPUSH | 'CHOSE 👇' | 'CHOSE 👇' | 'CHOSE 👇' | EFFORT 'CHOSE 👇' (dropdown AX7:AX42); HOW IT FELT? 'CHOSE 👇' (AY7:AY42); WEIGHT USED blank | sets unset; reps unset; placeholder typo 'CHOSE 👇' is not a list value -> invalid-value flag |
| TUESDAY | 5 | CCCCCC | 'Hamstrings' / 'Leg Curls' | `E14` -> `AR7:AR10` 'LEG CURLS' | ISO_HAM | 'CHOSE 👇' | 'CHOSE 👇' | 'CHOSE 👇' | EFFORT 'CHOSE 👇' (dropdown AX7:AX42); HOW IT FELT? 'CHOSE 👇' (AY7:AY42); WEIGHT USED blank | sets unset; reps unset; placeholder typo 'CHOSE 👇' is not a list value -> invalid-value flag |
| TUESDAY | 6 | CCCCCC | 'Tricep' / (blank) | `E15` -> `AT7:AT42` 'TRICEP' | ISO_TRICEP | 'CHOSE 👇' | 'CHOSE 👇' | 'CHOSE 👇' | EFFORT 'CHOSE 👇' (dropdown AX7:AX42); HOW IT FELT? 'CHOSE 👇' (AY7:AY42); WEIGHT USED blank | sets unset; reps unset; CATEGORY cell blank (verbatim); placeholder typo 'CHOSE 👇' is not a list value -> invalid-value flag |
| TUESDAY | 7 | CCCCCC | 'Shoulders/Traps' / 'ABdution' | `E16` -> `AH7:AH42` 'SIDE RAISES' | ISO_SIDE_REAR_DELT | 'CHOSE 👇' | 'CHOSE 👇' | 'CHOSE 👇' | EFFORT 'CHOSE 👇' (dropdown AX7:AX42); HOW IT FELT? 'CHOSE 👇' (AY7:AY42); WEIGHT USED blank | sets unset; reps unset; placeholder typo 'CHOSE 👇' is not a list value -> invalid-value flag |
| WEDNESDAY | 1 | FCE5CD | 'Calves' / (blank) | `E18` -> `AU7:AU13` 'CALVES' | ISO_CALF | 'CHOSE 👇' | 'CHOSE 👇' | 'CHOSE 👇' | EFFORT 'CHOSE 👇' (dropdown AX7:AX42); HOW IT FELT? 'CHOSE 👇' (AY7:AY42); WEIGHT USED blank | sets unset; reps unset; placeholder typo 'CHOSE 👇' is not a list value -> invalid-value flag |
| WEDNESDAY | 2 | FCE5CD | 'Cardio' / (blank) | `E19` -> `B7:B122` 'CARDIO' | COND_AEROBIC | 'CHOSE 👇' | 'CHOSE 👇' | - | EFFORT 'CHOSE 👇' (dropdown AX7:AX42); HOW IT FELT?  (no dropdown); WEIGHT USED blank | sets unset; no REPS dropdown on this row (cardio options carry their own dose); range stops at B122: DISTANCE (200-1000m) and CALORIES (10-50 cals) options unreachable; placeholder typo 'CHOSE 👇' is not a list value -> invalid-value flag |
| WEDNESDAY | 3 | FCE5CD | 'Core' / (blank) | `E20` -> `O7:O283` 'CORE THORAX (+ CORE PELVIS block)' | CT_CORE_THORAX or CP_CORE_PELVIS | 'CHOSE 👇' | 'CHOSE 👇' | 'CHOSE 👇' | EFFORT 'CHOSE 👇' (dropdown AX7:AX42); HOW IT FELT? 'CHOSE 👇' (AY7:AY42); WEIGHT USED blank | sets unset; reps unset; one dropdown spans CORE THORAX (O8-O94) and CORE PELVIS (O124-O209) blocks; placeholder typo 'CHOSE 👇' is not a list value -> invalid-value flag |
| WEDNESDAY | 4 | FCE5CD | 'Focus 1' / (blank) | `E21` -> `AZ7:AZ335` 'FULL FOCUS LIST' | FOCUS | 'CHOSE 👇' | 'CHOSE 👇' | 'CHOSE 👇' | EFFORT 'CHOSE 👇' (dropdown AX7:AX42); HOW IT FELT? 'CHOSE 👇' (AY7:AY42); WEIGHT USED blank | sets unset; reps unset; muscle-organised specialisation menu (10 muscle headers); credited muscle = whatever the client picks; placeholder typo 'CHOSE 👇' is not a list value -> invalid-value flag |
| WEDNESDAY | 5 | FCE5CD | 'Focus 2' / (blank) | `E22` -> `AZ7:AZ335` 'FULL FOCUS LIST' | FOCUS | 'CHOSE 👇' | 'CHOSE 👇' | 'CHOSE 👇' | EFFORT 'CHOSE 👇' (dropdown AX7:AX42); HOW IT FELT? 'CHOSE 👇' (AY7:AY42); WEIGHT USED blank | sets unset; reps unset; muscle-organised specialisation menu (10 muscle headers); credited muscle = whatever the client picks; placeholder typo 'CHOSE 👇' is not a list value -> invalid-value flag |
| THURSDAY | 1 | EFEFEF | 'Calves' / 'Calves' | `E24` -> `AU7:AU13` 'CALVES' | ISO_CALF | 'CHOSE 👇' | 'CHOSE 👇' | 'CHOSE 👇' | EFFORT 'CHOSE 👇' (dropdown AX7:AX42); HOW IT FELT? 'CHOSE 👇' (AY7:AY42); WEIGHT USED blank | sets unset; reps unset; placeholder typo 'CHOSE 👇' is not a list value -> invalid-value flag |
| THURSDAY | 2 | EFEFEF | 'Quads' / 'Bilateral KD' | `E25` -> `AI7:AI122` 'BILATERAL KNEE DOMINANT' | RP_BKD | 'CHOSE 👇' | 'CHOSE 👇' | 'CHOSE 👇' | EFFORT 'CHOSE 👇' (dropdown AX7:AX42); HOW IT FELT? 'CHOSE 👇' (AY7:AY42); WEIGHT USED blank | sets unset; reps unset; placeholder typo 'CHOSE 👇' is not a list value -> invalid-value flag |
| THURSDAY | 3 | EFEFEF | 'Back' / 'Horizontal Pull' | `E26` -> `X7:X162` 'HORIZONTAL PULL' | RP_HPULL | 'CHOSE 👇' | 'CHOSE 👇' | 'CHOSE 👇' | EFFORT 'CHOSE 👇' (dropdown AX7:AX42); HOW IT FELT? 'CHOSE 👇' (AY7:AY42); WEIGHT USED blank | sets unset; reps unset; placeholder typo 'CHOSE 👇' is not a list value -> invalid-value flag |
| THURSDAY | 4 | EFEFEF | 'Quads/Glutes' / 'Unilateral KD' | `E27` -> `AL7:AL42` 'UNILATERAL KNEE DOMINANT' | RP_UKD | 'CHOSE 👇' | 'CHOSE 👇' | 'CHOSE 👇' | EFFORT 'CHOSE 👇' (dropdown AX7:AX42); HOW IT FELT? 'CHOSE 👇' (AY7:AY42); WEIGHT USED blank | sets unset; reps unset; placeholder typo 'CHOSE 👇' is not a list value -> invalid-value flag |
| THURSDAY | 5 | EFEFEF | 'Back ' / 'Vertical Pull' | `E28` -> `U7:U122` 'VERTICAL PULL' | RP_VPULL | 'CHOSE 👇' | 'CHOSE 👇' | 'CHOSE 👇' | EFFORT 'CHOSE 👇' (dropdown AX7:AX42); HOW IT FELT? 'CHOSE 👇' (AY7:AY42); WEIGHT USED blank | sets unset; reps unset; placeholder typo 'CHOSE 👇' is not a list value -> invalid-value flag |
| THURSDAY | 6 | EFEFEF | 'Bicep' / 'Bicep' | `E29` -> `AS7:AS42` 'BICEP' | ISO_BICEP | 'CHOSE 👇' | 'CHOSE 👇' | 'CHOSE 👇' | EFFORT 'CHOSE 👇' (dropdown AX7:AX42); HOW IT FELT? 'CHOSE 👇' (AY7:AY42); WEIGHT USED blank | sets unset; reps unset; placeholder typo 'CHOSE 👇' is not a list value -> invalid-value flag |
| THURSDAY | 7 | EFEFEF | 'Quads' / 'Leg Extensions' | `E30` -> `AM7:AM9` 'LEG EXTENSIONS' | ISO_QUAD | 'CHOOSE 👇' | 'CHOSE 👇' | 'CHOSE 👇' | EFFORT 'CHOSE 👇' (dropdown AX7:AX42); HOW IT FELT? 'CHOSE 👇' (AY7:AY42); WEIGHT USED blank | sets unset; reps unset; placeholder typo 'CHOSE 👇' is not a list value -> invalid-value flag |
| FRIDAY | 1 | CCCCCC | 'Hamstring' / 'Bilateral HD' | `E31` -> `AN7:AN122` 'BILATERAL HIP DOMNANT' | RP_BHD | 'CHOSE 👇' | 'CHOSE 👇' | 'CHOSE 👇' | EFFORT 'CHOSE 👇' (dropdown AX7:AX42); HOW IT FELT? 'CHOSE 👇' (AY7:AY42); WEIGHT USED blank | sets unset; reps unset; placeholder typo 'CHOSE 👇' is not a list value -> invalid-value flag |
| FRIDAY | 2 | CCCCCC | 'Chest' / 'Horizontal Push' | `E32` -> `AD7:AD162` 'HORIZONTAL PUSH' | RP_HPUSH | 'CHOSE 👇' | 'CHOSE 👇' | 'CHOSE 👇' | EFFORT 'CHOSE 👇' (dropdown AX7:AX42); HOW IT FELT? 'CHOSE 👇' (AY7:AY42); WEIGHT USED blank | sets unset; reps unset; placeholder typo 'CHOSE 👇' is not a list value -> invalid-value flag |
| FRIDAY | 3 | CCCCCC | 'Hamstring/Glutes' / 'Unilateral HD' | `E33` -> `AR7:AR42` 'LEG CURLS' | ISO_HAM | 'CHOSE 👇' | 'CHOSE 👇' | 'CHOSE 👇' | EFFORT 'CHOSE 👇' (dropdown AX7:AX42); HOW IT FELT? 'CHOSE 👇' (AY7:AY42); WEIGHT USED blank | sets unset; reps unset; **MISWIRED**: slot says 'Unilateral HD' but dropdown = LEG CURLS list (AR7:AR42); the visible AESTHETICS tab uses AQ7:AQ42; placeholder typo 'CHOSE 👇' is not a list value -> invalid-value flag |
| FRIDAY | 4 | CCCCCC | 'Chest/Shoulders' / 'Vertical Push' | `E34` -> `AA7:AA122` 'VERTICAL PUSH' | RP_VPUSH | 'CHOSE 👇' | 'CHOSE 👇' | 'CHOSE 👇' | EFFORT 'CHOSE 👇' (dropdown AX7:AX42); HOW IT FELT? 'CHOSE 👇' (AY7:AY42); WEIGHT USED blank | sets unset; reps unset; placeholder typo 'CHOSE 👇' is not a list value -> invalid-value flag |
| FRIDAY | 5 | CCCCCC | 'Hamstrings' / 'Leg Curls' | `E35` -> `AR7:AR10` 'LEG CURLS' | ISO_HAM | 'CHOSE 👇' | 'CHOSE 👇' | 'CHOSE 👇' | EFFORT 'CHOSE 👇' (dropdown AX7:AX42); HOW IT FELT? 'CHOSE 👇' (AY7:AY42); WEIGHT USED blank | sets unset; reps unset; placeholder typo 'CHOSE 👇' is not a list value -> invalid-value flag |
| FRIDAY | 6 | CCCCCC | 'Tricep' / (blank) | `E36` -> `AT7:AT42` 'TRICEP' | ISO_TRICEP | 'CHOSE 👇' | 'CHOSE 👇' | 'CHOSE 👇' | EFFORT 'CHOSE 👇' (dropdown AX7:AX42); HOW IT FELT? 'CHOSE 👇' (AY7:AY42); WEIGHT USED blank | sets unset; reps unset; CATEGORY cell blank (verbatim); placeholder typo 'CHOSE 👇' is not a list value -> invalid-value flag |
| FRIDAY | 7 | CCCCCC | 'Shoulders/Traps' / 'ABdution' | `E37` -> `AH7:AH42` 'SIDE RAISES' | ISO_SIDE_REAR_DELT | 'CHOSE 👇' | 'CHOSE 👇' | 'CHOSE 👇' | EFFORT 'CHOSE 👇' (dropdown AX7:AX42); HOW IT FELT? 'CHOSE 👇' (AY7:AY42); WEIGHT USED blank | sets unset; reps unset; placeholder typo 'CHOSE 👇' is not a list value -> invalid-value flag |
| SATURDAY | 1 | FCE5CD | 'Calves' / (blank) | `E39` -> `AU7:AU13` 'CALVES' | ISO_CALF | 'CHOSE 👇' | 'CHOSE 👇' | 'CHOSE 👇' | EFFORT 'CHOSE 👇' (dropdown AX7:AX42); HOW IT FELT? 'CHOSE 👇' (AY7:AY42); WEIGHT USED blank | sets unset; reps unset; placeholder typo 'CHOSE 👇' is not a list value -> invalid-value flag |
| SATURDAY | 2 | FCE5CD | 'Cardio' / (blank) | `E40` -> `B7:B122` 'CARDIO' | COND_AEROBIC | 'CHOSE 👇' | 'CHOSE 👇' | - | EFFORT 'CHOSE 👇' (dropdown AX7:AX42); HOW IT FELT?  (no dropdown); WEIGHT USED blank | sets unset; no REPS dropdown on this row (cardio options carry their own dose); range stops at B122: DISTANCE (200-1000m) and CALORIES (10-50 cals) options unreachable; placeholder typo 'CHOSE 👇' is not a list value -> invalid-value flag |
| SATURDAY | 3 | FCE5CD | 'Core' / (blank) | `E41` -> `O7:O283` 'CORE THORAX (+ CORE PELVIS block)' | CT_CORE_THORAX or CP_CORE_PELVIS | 'CHOSE 👇' | 'CHOSE 👇' | 'CHOSE 👇' | EFFORT 'CHOSE 👇' (dropdown AX7:AX42); HOW IT FELT? 'CHOSE 👇' (AY7:AY42); WEIGHT USED blank | sets unset; reps unset; one dropdown spans CORE THORAX (O8-O94) and CORE PELVIS (O124-O209) blocks; placeholder typo 'CHOSE 👇' is not a list value -> invalid-value flag |
| SATURDAY | 4 | FCE5CD | 'Focus 1' / (blank) | `E42` -> `AZ7:AZ335` 'FULL FOCUS LIST' | FOCUS | 'CHOSE 👇' | 'CHOSE 👇' | 'CHOSE 👇' | EFFORT 'CHOSE 👇' (dropdown AX7:AX42); HOW IT FELT? 'CHOSE 👇' (AY7:AY42); WEIGHT USED blank | sets unset; reps unset; muscle-organised specialisation menu (10 muscle headers); credited muscle = whatever the client picks; placeholder typo 'CHOSE 👇' is not a list value -> invalid-value flag |
| SATURDAY | 5 | FCE5CD | 'Focus 2' / (blank) | `E43` -> `AZ7:AZ335` 'FULL FOCUS LIST' | FOCUS | 'CHOSE 👇' | 'CHOSE 👇' | 'CHOSE 👇' | EFFORT 'CHOSE 👇' (dropdown AX7:AX42); HOW IT FELT? 'CHOSE 👇' (AY7:AY42); WEIGHT USED blank | sets unset; reps unset; muscle-organised specialisation menu (10 muscle headers); credited muscle = whatever the client picks; placeholder typo 'CHOSE 👇' is not a list value -> invalid-value flag |
| SUNDAY | - | 'OFF' (F4CCCC light red) | 'OFF' | - | REST | 'OFF' | 'OFF' | 'OFF' | 'OFF' | C45 and E45:K45 read 'OFF' (each merged down to row 51; D45 blank); no dropdowns. |

### C.3 Rules visible

All of tab A's rules (A.3) apply unchanged, because the slot template is identical row for row. In addition:

1. **Weekday placement.** Optional days sit **between** the A/B pairs (Wednesday, Saturday), not at the end, and Sunday is 'OFF'. OBSERVED.
   - INFERRED: the optional day is a low-fatigue recovery/specialisation day (calves, cardio, core, focus) between two hard full-body pairs.
2. **Autoregulation inputs exist but are client-reported, not prescribed.** EFFORT has a verbal 1-10 scale whose positive anchor is '8 - That was perfect' (9 = 'That was terrible', 10 = "I'm done"). HOW IT FELT? screens for target muscle and pain.
   - INFERRED: these are the inputs for the coach's "fewer sets with pain / adjust week to week" logic. A '9'/'10' or 'Felt a PAIN' should trigger a regression; '1'-'6' should trigger a progression.
3. **'WEIGHT USED or SCORE'.** "SCORE" suggests the same logbook format is shared with conditioning or test rows (e.g. cardio times). INFERRED.

### C.4 Quantitative volume

As written, every number is 0: no exercise, set or rep is filled. The volume the template implies is computed both **as wired** (the UHD slot can only be a leg curl) and **as designed** (UHD restored to `AQ`, as in tab A):

| Session | exercises (slots) | sets: as written | sets: convention, AS WIRED | sets: convention, as designed (AQ) | sets: flat 3, AS WIRED | sets: flat 3, as designed (AQ) | sets: flat 3 + optional, as designed |
|---|---|---|---|---|---|---|---|
| MONDAY | 7 | 0 | 19 | 19 | 21 | 21 | 21 |
| TUESDAY | 7 | 0 | 17 | 18 | 21 | 21 | 21 |
| WEDNESDAY | 5 | n/a (optional not counted) | n/a (optional not counted) | n/a (optional not counted) | n/a (optional not counted) | n/a (optional not counted) | 12 |
| THURSDAY | 7 | 0 | 19 | 19 | 21 | 21 | 21 |
| FRIDAY | 7 | 0 | 17 | 18 | 21 | 21 | 21 |
| SATURDAY | 5 | n/a (optional not counted) | n/a (optional not counted) | n/a (optional not counted) | n/a (optional not counted) | n/a (optional not counted) | 12 |

**Weekly sets by canonical bucket:**

| Bucket | as written | convention, AS WIRED | convention, as designed (AQ) | flat 3, AS WIRED | flat 3, as designed (AQ) | flat 3 + optional, as designed |
|---|---|---|---|---|---|---|
| AP_PLYO | 0 | 0 | 0 | 0 | 0 | 0 |
| AP_JUMP_LIMITED_KNEE | 0 | 0 | 0 | 0 | 0 | 0 |
| AP_THROW | 0 | 0 | 0 | 0 | 0 | 0 |
| AP_COD | 0 | 0 | 0 | 0 | 0 | 0 |
| AP_SPRINT | 0 | 0 | 0 | 0 | 0 | 0 |
| AP_TRIPLE_EXT | 0 | 0 | 0 | 0 | 0 | 0 |
| RP_BKD | 0 | 6 | 6 | 6 | 6 | 6 |
| RP_BHD | 0 | 6 | 6 | 6 | 6 | 6 |
| RP_UKD | 0 | 6 | 6 | 6 | 6 | 6 |
| RP_UHD | 0 | 0 | 6 | 0 | 6 | 6 |
| RP_HPUSH | 0 | 6 | 6 | 6 | 6 | 6 |
| RP_VPUSH | 0 | 6 | 6 | 6 | 6 | 6 |
| RP_HPULL | 0 | 6 | 6 | 6 | 6 | 6 |
| RP_VPULL | 0 | 6 | 6 | 6 | 6 | 6 |
| ISO_QUAD | 0 | 4 | 4 | 6 | 6 | 6 |
| ISO_HAM | 0 | 8 | 4 | 12 | 6 | 6 |
| ISO_CHEST | 0 | 0 | 0 | 0 | 0 | 0 |
| ISO_SIDE_REAR_DELT | 0 | 4 | 4 | 6 | 6 | 6 |
| ISO_BICEP | 0 | 4 | 4 | 6 | 6 | 6 |
| ISO_TRICEP | 0 | 4 | 4 | 6 | 6 | 6 |
| ISO_CALF | 0 | 6 | 6 | 6 | 6 | 12 |
| CT_CORE_THORAX or CP_CORE_PELVIS | 0 | 0 | 0 | 0 | 0 | 6 |
| CORE_OTHER | 0 | 0 | 0 | 0 | 0 | 0 |
| COND_AEROBIC | 0 | 0 | 0 | 0 | 0 | 2 bout(s) |
| COND_SPRINT_BUYOUT | 0 | 0 | 0 | 0 | 0 | 0 |
| FOCUS | 0 | 0 | 0 | 0 | 0 | 12 |
| FUNCTIONAL | 0 | 0 | 0 | 0 | 0 | 0 |
| **TOTAL working sets** | 0 | 72 | 74 | 84 | 84 | 108 |

**Weekly sets by muscle:**

| Muscle | as written | convention, AS WIRED | convention, as designed (AQ) | flat 3, AS WIRED | flat 3, as designed (AQ) | flat 3 + optional, as designed |
|---|---|---|---|---|---|---|
| quads | 0 | 16 | 16 | 18 | 18 | 18 |
| glutes | 0 | 15 | 21 | 15 | 21 | 21 |
| hamstrings | 0 | 14 | 16 | 18 | 18 | 18 |
| chest | 0 | 9 | 9 | 9 | 9 | 9 |
| lats/upper back | 0 | 12 | 12 | 12 | 12 | 12 |
| front delts | 0 | 12 | 12 | 12 | 12 | 12 |
| side delts | 0 | 7 | 7 | 9 | 9 | 9 |
| rear delts | 0 | 3 | 3 | 3 | 3 | 3 |
| biceps | 0 | 10 | 10 | 12 | 12 | 12 |
| triceps | 0 | 10 | 10 | 12 | 12 | 12 |
| calves | 0 | 6 | 6 | 6 | 6 | 12 |
| abs/obliques | 0 | 0 | 0 | 0 | 0 | 6 |
| FOCUS (client-picked muscle) | 0 | 0 | 0 | 0 | 0 | 12 |

The wiring bug changes muscle distribution, not total sets. **Glutes drop from 21 to 15 sets/week** and ISO_HAM doubles (6 -> 12 at flat 3), while hamstrings stay at 18. Under the coach convention (isolation = 2 sets) the B day also loses 1 set (18 -> 17). Note that this tab's "convention" column has no filled values to copy, so the vertical push is 3 sets, not tab A's demo 5 sets.

### C.5 Rep ranges / intensity / rest / tempo

Nothing is prescribed. EFFORT and HOW IT FELT? are post-set *reports*, not targets. There are no rest, tempo or RIR columns. OBSERVED.

### C.6 Progression

Only WEEK 1 exists. There are no progression rules, but the tracking columns (weight, effort, feel, done) are exactly the data a week-over-week rule would consume. The empty merged blocks A52:A58 and A59:A65 suggest more blocks were planned. OBSERVED + INFERRED.

---

## D. Cross-program numbers and the coach's aesthetics progression

### D.1 3-day vs 4-day (OBSERVED slot counts; sets under the stated assumptions)

| Metric | 3 DAY BUILDER | AESTHETICS 4 DAYS | Change |
|---|---|---|---|
| Main days / optional blocks / off | 3 / 3 / (1 implied) | 4 / 2 / 1 | +1 main, -1 optional |
| Slots per main session | 5 | 7 | +40% |
| Main slots per week | 15 | 28 | +87% |
| Optional slots per week (incl. cardio) | 15 | 10 | -33% |
| Main working sets/week, flat 3 | 45 | 84 | +87% |
| Main working sets/week, coach convention | 44 | 78 | +77% |
| Focus slots/week | 6 | 4 | -33% |

Per-muscle weekly sets, flat 3, main days only:

| Muscle | 3-day | 4-day | Change |
|---|---|---|---|
| quads | 12 | 18 | +50% |
| glutes | 18 | 21 | +17% |
| hamstrings | 12 | 18 | +50% |
| chest | 7.5 | 9 | +20% |
| lats/upper back | 9 | 12 | +33% |
| front delts | 9 | 12 | +33% |
| side delts | 1.5 | 9 | +500% |
| rear delts | 3 | 3 | 0% |
| biceps | 4.5 | 12 | +167% |
| triceps | 4.5 | 12 | +167% |
| calves | 3 | 6 | +100% |

INFERRED: the 4th day mostly buys **small-muscle / isolation volume** (arms, side delts, calves, quads and hamstrings via leg extensions and curls). The compound skeleton is already present at 3 days.

### D.2 What progression looks like in the coach's aesthetics track (OBSERVED in MASTER_MODEL, not in BYOP)

Because none of the three BYOP tabs carries progression, the closest coach-authored evidence is MASTER_MODEL `(NOT DONE) 4 TRACKS PROGRAMMING`, block A30 'AESTHETICS' / C30 'bodybuilding style'. It contains two layouts. In layout (i), Wednesday and Saturday are '30-40 mi slow/steady CARDIO' (A46/A60, bg D9D2E9), the same weekday positions as BYOP's optional days that carry the 'Cardio' slot. That makes the weekly rhythm (Mon lower / Tue upper / Wed cardio / Thu lower / Fri upper / Sat cardio) the same as the BYOP 4-day.

**(i) 8-week upper/lower layout (columns E-L, 'WK1'-'WK8').** Nearly every exercise row (D35-D62) carries '1-2 RIR'. WK8 = 'DELOAD WEEK' (L35, L55). Lower days rotate 'FRONT SQUATS' / 'DEADLIFTS' / 'BACK SQUATS' / 'DEFICIT DEADLIFTS', then 'FFE'/'RFE' 'CONTRA'/'IPSI' lunges, 'SL RDL' and 'ACCESSORIES'. Upper days use DB/barbell bench, unilateral lat pulldown or pull-up, DB overhead press, machine-supported row, upright rows, DB rows and 'ACCESSORIES'.

| | WK1 | WK2 | WK3 | WK4 | WK5 | WK6 | WK7 | WK8 |
|---|---|---|---|---|---|---|---|---|
| 'SETS' (row 32) | 2 | 3 | 3 | 3 | 4 | 4 | 5 | deload |
| 'REPS ' (row 33) | 12 | 10 | 8 | 12 | 10 | 8 | 8 | - |
| sets change | - | +50% | 0 | 0 | +33% | 0 | +25% | - |
| reps x sets per exercise | 24 | 30 | 24 | 36 | 40 | 32 | 40 | - |

**(ii) 12-week push/pull/legs layout (columns O-Z, 'WK1'-'WK12'; M38/M54 'PUSH', M43 'LEGS', M49/M64 'PULL'; Mon push, Tue legs, Wed pull, Thu push, Fri legs, Sat pull; A/B weeks alternate exercise variants).** From WK9-WK12 it writes in supersets ('front squats + Superset with 15 squats with no weight every set', 'bench press + superset with max pushup set ...') and '2 sets LEG PRESS MYO - 15-5-5-5-5-5' (3 sets in WK12). WK12's SETS cell Z31 is highlighted FCE5CD.

| | WK1 | WK2 | WK3 | WK4 | WK5 | WK6 | WK7 | WK8 | WK9 | WK10 | WK11 | WK12 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 'SETS' (row 31) | 3 | 3 | 3 | 4 | 4 | 4 | 3 | 4 | 4 | 4 | 4 | 5 |
| 'REPS' (row 32) | '12/10/8 -20' | '12/10/8- 20' | '12/10/8-20' | '12/12/10-20' | '12/12/10-20' | '12/12/12-20' | '8/8/8-12' | '15/12/10/8-20' | '15/12/10/8-20' | '12/12/10/10-20' | '12/12/12/12-20' | '15/15/12/12/12' |
| week tag (row 33) | 'A WEEK' | 'B WEEK' | 'A WEEK' | 'B WEEK' | 'A WEEK' | 'BWEEK' | 'A WEEK LOWER' | - | - | - | - | - |
| reps per exercise (main sets) | 30 | 30 | 30 | 34 | 34 | 36 | 24 | 45 | 45 | 44 | 48 | 66 |
| change vs previous week | - | 0% | 0% | +13.3% | 0% | +5.9% | -33.3% | +87.5% | 0% | -2.2% | +9.1% | +37.5% |

INFERRED reading:

- **Sets rise by whole sets per exercise.** That is +25% to +50% steps every 2-3 weeks (2 -> 3 -> 4 -> 5, or 3 -> 4 -> 5), with a lighter week before the next block: WK7 drops to 3 sets of '8/8/8' (heavier) in (ii), and WK8 deloads in (i).
- **Within a set-block, reps creep up instead**, e.g. 12/12/10 -> 12/12/12, which is +5.9%. These within-block rep/load steps are the only place the coach's stated "3%, 5%, 7%" increments can live; whole-set jumps are never that small.
- **The '-20' suffix** most likely means a 20-rep target for the isolation/accessory work (or a 20-rep back-off). It matches BYOP's '20 Reps' on isolation. This is unconfirmed.
- **Wave in (i):** reps descend 12 -> 10 -> 8 across 3 weeks and then restart at 12 with more sets. That is a classic step-loading wave.

---

## E. What this reveals about the coach's thinking (all INFERRED)

1. **The pattern is the unit of programming and the muscle is the unit of accounting.** Each slot is a movement pattern (knee/hip dominant x bilateral/unilateral; push/pull x horizontal/vertical) with a muscle label attached ('Quads', 'Quads/Glutes', 'Hamstring/Glutes', 'Chest/Shoulders'). A generator should place patterns and then audit volume per muscle.
2. **Big muscles get several patterns; small muscles get one isolation slot plus spill-over.**
   - Quads get BKD + UKD + leg extension on every A day.
   - Hamstrings and glutes get BHD + UHD + leg curl on every B day.
   - Biceps, triceps and side delts each get a single slot and otherwise rely on rows and presses.
3. **Fatigue-aware pairing.** Knee + pull and hip + push keep grip/lat/erector-heavy work (hinges, rows) on different days. Lower and upper alternate inside the session, so each lift's rest is filled by the opposite half of the body.
4. **Biomechanics decides which isolation exists.** Leg curls (knee flexion), leg extensions (knee extension), 'ABdution' (frontal-plane shoulder) and arm flexion/extension cover what the compound patterns miss. When days are cut, the isolation whose joint action no compound covers (leg curls) is the one that stays.
5. **Frequency floor of 2x/week for the main compound patterns.** Both templates keep bilateral lower, horizontal push/pull and the lunge pattern at 2x/week. Only vertical push/pull, the single-leg hinge and isolation fall to 1x/week or 0 in the 3-day.
6. **Session size cap: about 7 exercises / about 20 working sets** for physique days, and 5 exercises / 15 sets in the 3-day. Optional days are about 5 slots / 12 sets + cardio.
7. **Default dose:**
   - compounds 3 sets of 8-15;
   - isolation 2 sets of 20 (fewer, higher-rep sets for single-joint work);
   - calves 3 x 15;
   - one "heavy/explosive" compound per day may get 5 sets of 6-8 (the demo's 'DB Push press').
   This matches the coach's "small muscles more reps, big muscles a mix".
8. **Specialisation is modular and self-selected.** The base week is pattern-balanced and lower-body/glute-biased. The client then spends 'Focus 1'/'Focus 2' on whatever they want to grow, from a menu organised by muscle, not by pattern. That is the "more sets for the muscle you want to grow" lever: +12 sets/week (4-day) or +18 (3-day) at 3 sets per slot.
9. **Level is a property of the pattern, not of the person.** Each dropdown carries its own FOUNDATIONAL/MODERATE/ADVANCED blocks, and the demo mixes levels within one day. A client can be ADVANCED at leg press and FOUNDATIONAL at pull-downs.
10. **Feedback loop over fixed prescription.** The logbook version swaps prescribed intensity for client-reported EFFORT (bull's-eye '8 - That was perfect') and HOW IT FELT? (right muscle / wrong muscle / pain / couldn't). That is the raw material for "adjust each week: add volume if easy, cut if pain".
11. **Aesthetics vs athletic is additive, not a different skeleton.** Compare with `ATHLETIC - FULL BODY - 4 DAYS A` (per `L4_slot_wiring.md`):
    - **Same:** the resistance block. Mon/Thu = BKD, H-Pull, UKD, V-Pull, Leg Ext; Tue/Fri = BHD, H-Push, UHD, V-Push, Leg Curls, ABdution.
    - **Same:** the Wed/Sat optional menu, except 'Aerobic Capacity' replaces 'Cardio'.
    - **Athletic adds** a 4-5-slot athletic prefix (Plyo x1-2, Throwing, COD, 'Tripple Extension').
    - **Aesthetics adds** a Calves opener on A days plus 'Bicep' (A) and 'Tricep' (B).

    INFERRED rule: the goal changes the *prefix* (athletic qualities first) and the *arm/calf isolation*, not the resistance pattern logic. Aesthetics spends the athletic prefix's time on small-muscle isolation.

## F. Generator-ready rules extracted

Each rule carries its own status in brackets: [O] observed, [I] inferred.

```
TEMPLATE aesthetics_4day  [O]
  week: Mon=A, Tue=B, Wed=OPT, Thu=A, Fri=B, Sat=OPT, Sun=OFF
  A: [ISO_CALF, RP_BKD, RP_HPULL, RP_UKD, RP_VPULL, ISO_BICEP, ISO_QUAD]
  B: [RP_BHD, RP_HPUSH, RP_UHD, RP_VPUSH, ISO_HAM, ISO_TRICEP, ISO_SIDE_REAR_DELT]
  OPT: [ISO_CALF, COND_AEROBIC, CORE(CT|CP), FOCUS, FOCUS]
TEMPLATE aesthetics_3day  [O]
  week: D1, OPT, D2, OPT, D3, OPT, (OFF)   [weekday mapping I]
  D1: [ISO_CALF, RP_BKD, RP_HPULL, RP_UKD, RP_VPULL]
  D2: [RP_BHD, RP_HPUSH, RP_UHD, RP_VPUSH, ISO_HAM]
  D3: [RP_BKD, RP_BHD, RP_HPULL, RP_HPUSH, RP_UKD]
  OPT: as above
ORDER  [O]  bilateral lower -> horizontal upper -> unilateral lower -> vertical upper -> isolation; calves first on A days
PAIR   [O]  knee-dominant with pull, hip-dominant with push (4-day)
DOSE   [O demo / I as rule]  compound 3 sets; single-joint 2 sets; calves 3; one explosive compound 5 x 6-8
REPS   [O demo / I as rule]  compounds 8-15 (mean about 12); single-joint 20; calves 15
SCALE_DOWN 4->3 days  [O what changed / I as rule]  drop ISO_BICEP, ISO_TRICEP, ISO_SIDE_REAR_DELT, ISO_QUAD; keep ISO_HAM, ISO_CALF; add C day (both bilateral lowers + both horizontal uppers + UKD)
SPECIALISE  [I]  FOCUS slots on OPT days add 3 sets each to the chosen muscle until it reaches its weekly target
CLASSIFY  [I]  bucket/muscle credit comes from the picked exercise, not the slot (see section 0.2)
```

## G. Open questions for the coach

1. What does **'NO ACCESS'** mean: self-guided buyers without coach access, no gym access, or a locked or retired template? Why are both NO ACCESS tabs hidden and untitled?
2. Is the lower/upper alternating order meant as **supersets** (A1/A2) or straight sets? When should 'SUPERSET W/ 👇' be used?
3. Do Day 3/Day 4 repeat **the same exercises** as Day 1/Day 2, or a different variation from the same slot (e.g. leg press Monday, hack squat Thursday)?
4. Why do **calves come first** on A days: ankle prep, priority for a stubborn muscle, or something else?
5. Is 'DB Push press' **5 x '6 to 8 Reps'** a rule ("one heavy or explosive lift per day gets 5 sets") or just that client? Should the A day have an equivalent?
6. Default sets for the unset isolation slots ('Leg Curls', 'Tricep', 'ABdution'): 2, like 'Bicep' and 'Leg Extensions'?
7. Should **'ABdution'** be strictly side raises? Its menu also holds front raises and reverse flies. Rear delts get only about 3 indirect sets/week. Should they have their own slot, like PPL's 'Reverse Flies'?
8. Optional blocks: are they **separate days** in the 3-day builder too, or add-ons after the session? How many optional days should a client do, and what is the default dose for Calves/Core/Focus and for one Cardio pick?
9. Focus rules: can both Focus slots hit the same muscle? Is there a weekly cap? Do you keep adding Focus sets until the target muscle reaches 15-20 sets/week?
10. How is a client's **level per slot** chosen? Why is 'Leg press' in the ADVANCED block of 'BILATERAL KNEE DOMINANT' and 'Push Ups ' in MODERATE? Does "advanced" mean intensity, skill, or loading capacity?
11. **Progression** for these templates over 6/8/12 weeks:
    - Is it the 4 TRACKS pattern (+1 set per exercise every 2-3 weeks, reps waved 12/10/8, deload at WK7-8)?
    - Or 3/5/7% steps? If percentages, applied to what: load, reps or weekly sets?
    - Which muscles get 3% vs 5% vs 7%?
12. Intensity target: should BYOP aesthetics adopt **'1-2 RIR'** as in 4 TRACKS? What are the rest periods and tempo?
13. In the 3-day, why does **'Leg Curls' survive** while leg extensions, arms and delts are cut? Why do vertical push/pull and the single-leg hinge drop to 1x/week while the lunge stays at 2x?
14. Should the generator credit glutes from 'Hamstring' (bilateral hinge) slots, given the library labels that column 'GLUTES/HAMSTRINGS'?
15. What does the **'-20'** in the 4 TRACKS rep strings ('12/10/8 -20') mean?
16. What is the "SCORE" in 'WEIGHT USED or SCORE' used for?
17. Should the Cardio dropdown reach the 'DISTANCE' and 'CALORIES' options below B122?
18. Should the miswired 'Unilateral HD' cells (E12/E33 -> `AR7:AR42`) in the hidden NO ACCESS tab point at `AQ7:AQ42`?

---

## Appendix: every option reachable from each slot (OBSERVED)

Format: separator label [separator cell] (count; cell background): cell 'option'. Separators ('FOUNDATIONAL', 'MODERATE', 'ADVANCED', 'UNILATERAL', 'CORE THORAX', 'CORE PELVIS', cardio sub-headers, 'QUADS 👇' and so on) and the repeated 'CHOOSE 👇' rows are themselves selectable in the dropdowns.

**`AU7:AU13` - slot Calves -> ISO_CALF.** Header rows 1-6 (verbatim, bg): r1 'CALVES' EFEFEF; r2 'FILL HERE' 000000; r3 'RP - CALVES' EAD1DC; r4 'RESISTANCE' EAD1DC; r6 'CALVES' EAD1DC. **5 selectable exercises** (+ separators).
- (no level label) (5; cell bg EAD1DC): AU9 'Standing Calf raises (use deficit)'; AU10 'Standing DB calf Raises (Use Deficit)'; AU11 'Calf Raises w/ DB '; AU12 'Calf Raises w/ Barbell'; AU13 'Machine Calf Raises'

**`AI7:AI122` - slot Quads / 'Bilateral KD' -> RP_BKD.** Header rows 1-6 (verbatim, bg): r1 'BILATERAL KNEE DOMINANT' CCCCCC; r2 'FILL HERE' 000000; r3 'RP - BS - KNEE DOMINANT' FFD966; r4 'RESISTANCE' FFD966; r5 'BILATERAL' FFD966; r6 'QUADS' FFD966. **35 selectable exercises** (+ separators).
- FOUNDATIONAL [separator AI8] (12; cell bg FFD966): AI9 'Box. Zercher squat Touch and Go'; AI10 'Box. Goblet squat Touch and Go'; AI11 'Goblet KB/DB Squats'; AI12 'Bodyweight Squats'; AI13 'Box Squats'; AI14 'Squats with Foam Roller or Yoga Ball on the wall'; AI15 'Low DB Squats'; AI16 'Landmine Squats'; AI17 'Hex Bar Squats'; AI18 'Flipped Hex Bar Squats '; AI19 'Sumo Squats w/ DB or KB '; AI20 'Leg Extension Machine'
- MODERATE [separator AI44] (9; cell bg FFD966): AI46 'Front Squats'; AI47 'High Zercher DB Squats '; AI48 'High Zercher Barbell Squats'; AI49 'High Bar Back Squat'; AI50 'Low Bar Back Squat'; AI51 'Double front rack kb squat'; AI52 'Hack Squat Machine '; AI55 'Leg Extension Machine'; AI56 'Landmine Hack Squat '
- ADVANCED [separator AI89] (14; cell bg FFD966): AI91 'Box. Any Squat Touch and Go fast'; AI92 'Box. Any Squat Touch and Go (Banded)'; AI93 'Box. Any Squat Touch and Go (Reverse Banded)'; AI94 'Box. Any Squat Deload'; AI95 'Box. Squat Deload (banded)'; AI96 'Box. Any Squat Deload (reverse banded)'; AI97 'Hack Squats'; AI98 'Leg press'; AI99 'Pendulum Squat'; AI100 'Sissy Squats'; AI101 'Leg Extension Machine'; AI102 'DB thrusters'; AI103 'Barbell Thrusters'; AI104 'Single arm DB thruster'

**`X7:X162` - slot Back / 'Horizontal Pull' -> RP_HPULL.** Header rows 1-6 (verbatim, bg): r1 'HORIZONTAL PULL' 999999; r2 'FILL HERE' 000000; r3 'EASY' 93C47D; r4 'RESISTANCE' 93C47D; r5 'BILATERAL SYMMETRICAL' 93C47D; r6 'BACK' F9CB9C. **16 selectable exercises** (+ separators).
- FOUNDATIONAL [separator X8] (5; cell bg 93C47D): X9 'Machine Row Close Grip'; X10 'Machine Row Supinated Grip'; X11 'Machine Row Pronated Grips'; X12 'TRX Rows'; X13 'Inverted Rows'
- ADVANCED [separator X44] (9; cell bg 93C47D): X46 'Bent Over Barbell Rows'; X47 'Bent Over Barbell Rows Supinated Grip'; X48 'Bent Over Rows Close Grip '; X49 'Bent Over Rows Pronated Grip'; X50 'Seal Barbell Rows Supinated Grip'; X51 'Seal Barbell Rows Pronated Grip '; X52 'Seal DB Rows Supinated Grip'; X53 'Seal DB Rows Pronated Grip'; X54 'Renegade Rows'
- UNILATERAL [separator X89] (2; cell bg 76A5AF): X91 'DB/ Kb Rows'; X92 'Cable Machine UL Rows'

**`AL7:AL42` - slot Quads/Glutes / 'Unilateral KD' -> RP_UKD.** Header rows 1-6 (verbatim, bg): r1 'UNILATERAL KNEE DOMINANT' EFEFEF; r2 'FILL HERE' 000000; r3 'RP - UL - KNEE DOMINANT' FFE599; r4 'RESISTANCE' FFE599; r5 'UNILATERAL' FFE599; r6 'QUADS/GLUTES' E06666. **13 selectable exercises** (+ separators).
- (no level label) (13; cell bg FFE599): AL9 'Stationary Lunges'; AL10 'Reverse Lunges '; AL11 'Forward  Lunges'; AL12 'Side Lunges'; AL13 'Pistol Squats '; AL14 'Single Leg Get Ups'; AL15 'Front Foot Elevated Lunges (FFE)'; AL16 'Rear Foot Elevated Lunges (RFE)'; AL17 'Rear Foot Against Wall Lunges'; AL18 'Front Foot & Rear Foot Elevated Lunges (RFE & FFE)'; AL19 'Step ups (Forward & Side)'; AL20 'Elevated Reverse Lunge'; AL21 'Curtsy Lunges '

**`U7:U122` - slot Back / 'Vertical Pull' -> RP_VPULL.** Header rows 1-6 (verbatim, bg): r1 'VERTICAL PULL' CCCCCC; r2 'FILL HERE' 000000; r3 'FOUNDATIONAL' 93C47D; r4 'RESISTANCE' 93C47D; r5 'BILATERAL SYMMETRICAL' 93C47D; r6 'BACK' F9CB9C. **20 selectable exercises** (+ separators).
- FOUNDATIONAL [separator U8] (12; cell bg 93C47D): U9 'Lat Pulldown Wide Grip'; U10 'Lat Pulldown Supinated Grip '; U11 'Lat Pulldown Pronated Grip'; U12 'Lat Pulldown Wide Mag Grips'; U13 'Lat Pulldowns w/ Cable Rope'; U14 'Lat Pulldowns Close Grip'; U15 'Assisted  Pull-Up w bands'; U16 'Assisted  Pull-Up Machine Close Grip'; U17 'Assisted Pull-Up Machine Pronated Grip  '; U18 'Assisted  Pull-Up Machine Supinated Grip'; U19 'Seated Pull ups with Rings or TRX'; U20 'KB Face Pulls '
- ADVANCED [separator U44] (7; cell bg 93C47D): U46 'Stricted Pull-Up feet behind you'; U47 'Stricted Pull-ups feet in front '; U48 'Strict Pull ups Knees in chest'; U49 'Strict Pull ups L Sit'; U50 'Chin Ups'; U51 'Wide Grip Pull Ups'; U52 'Weighted Pull ups '
- UNILATERAL [separator U89] (1; cell bg 76A5AF): U91 'Unilateral Lat Pulldowns '

**`AS7:AS42` - slot Bicep / 'Bicep' -> ISO_BICEP.** Header rows 1-6 (verbatim, bg): r1 'BICEP' EFEFEF; r2 'FILL HERE' 000000; r3 'RP - BICEP' E6B8AF; r4 'RESISTANCE' E6B8AF; r6 'BICEP' E6B8AF. **14 selectable exercises** (+ separators).
- (no level label) (14; cell bg E6B8AF): AS9 'Ez Bar Curls'; AS10 'Reverse Ez Bar Curls'; AS11 'DB Curls'; AS12 'Cable Machine Curls (Zone1, Zone 2, Zone 3'; AS13 'Hammer Db Curls'; AS14 'Seated Db Bicep Curls'; AS15 'Incline Seated Db Curls (Variation, Pinky Facing up)'; AS16 'Seated DB Curls '; AS17 'Spider Curls'; AS18 'Zottman Curls'; AS19 'TRX Bicep Curls'; AS20 'Crossbody DB Hammer Curls'; AS21 'Barbell Curls'; AS22 'DB Concentration Curls'

**`AM7:AM9` - slot Quads / 'Leg Extensions' -> ISO_QUAD.** Header rows 1-6 (verbatim, bg): r1 'LEG EXTENSIONS' 999999; r2 'FILL HERE' 000000; r3 'RP-BS-KNEE DOMINANT -ADVANCED' FFD966; r4 'RESISTANCE' FFD966; r5 'BILATERAL' FFD966; r6 'QUADS' E06666. **1 selectable exercises** (+ separators).
- (no level label) (1; cell bg FFD966): AM9 'Leg Extensions'

**`AN7:AN122` - slot Hamstring / 'Bilateral HD' -> RP_BHD.** Header rows 1-6 (verbatim, bg): r1 'BILATERAL HIP DOMNANT' D9D9D9; r2 'FILL HERE' 000000; r3 'RP - BS - HIP DOMINANT' 93C47D; r4 'RESISTANCE' 93C47D; r5 'BILATERAL' 93C47D; r6 'GLUTES/HAMSTRINGS' 6D9EEB. **33 selectable exercises** (+ separators).
- FOUNDATIONAL [separator AN8] (12; cell bg 93C47D): AN9 'Glute Bridges'; AN10 'Elevated Feet on Bench Glute Bridges'; AN11 'Reverse Hyper Extension'; AN12 'Cable Pull Through'; AN13 'Single KB Deadlift'; AN14 'Double KB Deadlift'; AN15 'Leg Curl Machine'; AN16 'Sandbag Hip Thrusts'; AN17 'Harmstring MedBall Curls'; AN18 'Supine Glidder hamstring curls'; AN19 'swiss ball hamstring curls'; AN20 'KB swing'
- MODERATE [separator AN44] (10; cell bg 93C47D): AN46 'DB Deadlifts'; AN47 'Hex Bar Deadlifts'; AN48 'GHD'; AN49 'Shoulder Wide Grip Deadlift'; AN50 'Medicine or Stability Ball Harmstring Curls'; AN51 'Hip Thrust Machine'; AN52 'Machine Good Mornings'; AN53 'DB Hip Thrusts'; AN54 'Machine Leg Curls (Seated and Laying Down)'; AN55 'Hyper extensions '
- ADVANCED [separator AN89] (11; cell bg 93C47D): AN91 'Nordic Curl'; AN92 'Barbell Deadlifts'; AN93 'GHD'; AN94 'Sumo Deadlifts'; AN95 'Wide Grip Barbell Deadlift'; AN96 'Snatch Grip Barbell Deadlift'; AN97 'Barbell Goodmornings'; AN98 'Barbell Hip Thrusts'; AN99 'Stiff Leg Deadlift'; AN100 'Machine Leg Curls'; AN101 'DB Harmstring Curls'

**`AD7:AD162` - slot Chest / 'Horizontal Push' -> RP_HPUSH.** Header rows 1-6 (verbatim, bg): r1 'HORIZONTAL PUSH' D9D9D9; r2 'FILL HERE' 000000; r3 'RP - BS - FOUNDATIONAL- HORIZONTAL PUSH' 6FA8DC; r4 'RESISTANCE' 6FA8DC; r5 'BILATERAL SYMMETRICAL' 6FA8DC; r6 'CHEST/FRONT DELTS' 93C47D. **25 selectable exercises** (+ separators).
- FOUNDATIONAL [separator AD8] (6; cell bg 6FA8DC): AD9 'Cable Standing Chest Press'; AD10 'DB Press on floor'; AD11 'Kneeling Push Ups'; AD12 'Incline Push-ups'; AD13 'Bench Push ups'; AD14 'Machine bench press'
- MODERATE [separator AD44] (5; cell bg 6FA8DC): AD46 'Incline Push-ups'; AD47 'Push Ups '; AD48 'Bench DB Flies '; AD49 'Cable flies'; AD50 'Machine flies'
- ADVANCED [separator AD89] (9; cell bg 6FA8DC): AD91 'Incline DB Bench Press'; AD92 'Push ups (Feet on Wall)'; AD93 'Diamond Push ups'; AD94 'DB Bench Press'; AD95 'Barbell bench Press'; AD96 'Dips '; AD97 'Weighted Dips '; AD98 'Declined Pushups'; AD99 'Elevated Push ups (for full ROM)'
- UNILATERAL [separator AD124] (5; cell bg 9FC5E8): AD126 'Alternating Incline DB Bench Press'; AD127 'Alternating Flat Bench Press'; AD128 'Alternating Db Floor Press'; AD129 'Alternating Cable Press'; AD130 'Push ups (1 hand Higher)'

**`AQ7:AQ42` - slot Hamstring/Glutes / 'Unilateral HD' -> RP_UHD.** Header rows 1-6 (verbatim, bg): r1 'UNILATERAL HIP DOMINANT' EFEFEF; r2 'FILL HERE ' 000000; r3 'RP - UL - HIP DOMINANT' B6D7A8; r4 'RESISTANCE' B6D7A8; r5 'UNILATERAL' B6D7A8; r6 'GLUTES/HAMSTRINGS' 6D9EEB. **8 selectable exercises** (+ separators).
- FOUNDATIONAL [separator AQ8] (8; cell bg B6D7A8): AQ9 'SL Glute Bridges (foot on the ground)'; AQ10 'SL Glute Bridges (foot on bench)'; AQ11 'SL Hip thrusts'; AQ12 'Staggered Stance DL w/ DB '; AQ13 'Alternating DB Deadlifts'; AQ14 'Staggered Stance DL w/ Barbell'; AQ15 'Alternating  Barbell Deadlifts'; AQ16 'Camporini Deadlifts'

**`AA7:AA122` - slot Chest/Shoulders / 'Vertical Push' -> RP_VPUSH.** Header rows 1-6 (verbatim, bg): r1 'VERTICAL PUSH' EFEFEF; r2 'FILL HERE' 000000; r3 'FOUNDATIONAL - RP - BS - VERTICAL PUSH' 6FA8DC; r4 'RESISTANCE' 6FA8DC; r5 'BILATERAL SYMMETRICAL' 6FA8DC; r6 'SHOULDERS/TRAPS' CC0000. **20 selectable exercises** (+ separators).
- FOUNDATIONAL [separator AA8] (6; cell bg 6FA8DC): AA9 'Incline Seated DB Press'; AA10 'Incline Seated Barbell Press'; AA11 'DB Push press'; AA12 'Barbell push press'; AA13 'DB Push Jerk'; AA14 'Barbell Push Jerk'
- ADVANCED [separator AA44] (10; cell bg 6FA8DC): AA46 'DB Z Press on floor'; AA47 'Barbell Z press on Floor '; AA48 'Kneeling DB Press'; AA49 'Kneeling Barbell Press'; AA50 'Standing DB Press'; AA51 'Standing DB Press'; AA52 'Handstand Push ups'; AA53 'Pike Push Ups'; AA54 'DB Thrusters'; AA55 'Barbell Thrusters'
- UNILATERAL [separator AA89] (4; cell bg 6FA8DC): AA91 'Sesaw Db Press'; AA92 'Alternating Db press'; AA93 'Kneeling Landmine Press'; AA94 'Single arm DB thrusters'

**`AR7:AR10` - slot Hamstrings / 'Leg Curls' (and the miswired NO ACCESS 'Unilateral HD' cells via AR7:AR42) -> ISO_HAM.** Header rows 1-6 (verbatim, bg): r1 'LEG CURLS' B7B7B7; r2 'FILL HERE' 000000; r4 'RESISTANCE' 93C47D; r5 'UNILATERAL' 93C47D; r6 'HAMSTRINGS' 6D9EEB. **2 selectable exercises** (+ separators).
- (no level label) (2; cell bg 93C47D): AR9 'Seated leg curls'; AR10 'Lying Leg Curls'

**`AT7:AT42` - slot Tricep / (blank) -> ISO_TRICEP.** Header rows 1-6 (verbatim, bg): r1 'TRICEP' CCCCCC; r2 'FILL HERE' 000000; r3 'RP - TRICEP' FCE5CD; r4 'RESISTANCE' FCE5CD; r6 'TRICEP' FCE5CD. **9 selectable exercises** (+ separators).
- (no level label) (9; cell bg FCE5CD): AT9 'Straight bar pronated tricep extensions '; AT10 'DB Kickbacks (Uni/Bi)'; AT11 'Overhead DB Tricep Extension'; AT12 'Floor DB Skullcrushers'; AT13 'Ez Bar Skullcrushers'; AT14 'Straight Bar Supinated Tricep Extensions '; AT15 'Tate Press'; AT16 'Overhead cable tricep extension'; AT17 'Cable tricep push downs'

**`AH7:AH42` - slot Shoulders/Traps / 'ABdution' -> ISO_SIDE_REAR_DELT.** Header rows 1-6 (verbatim, bg): r1 'SIDE RAISES' B7B7B7; r2 'FILL HERE' 000000; r3 'RP -SHOULDERS' EAD1DC; r4 'RESISTANCE' EAD1DC; r5 'BILATERAL' EAD1DC; r6 'SHOULDERS' EAD1DC. **12 selectable exercises** (+ separators).
- (no level label) (12; cell bg EAD1DC): AH9 'Seated Lateral Raises w/ DB '; AH10 'Bent over DB Reverse flies'; AH11 'Lateral Raises w/ DB '; AH12 'Front Raises w/ DB'; AH13 'Front Raises w/ Barbell'; AH14 'Inclined Cable Machine Side Raises'; AH15 'Seated DB Reverse Flies'; AH16 'DB Hammer Side/Front Raises'; AH17 'DB Side Raises Supinated Grip '; AH18 'DB Front Raises Supinated Grip'; AH19 'Cable machine Leaning Side raises '; AH20 'Machine reverse fliez'

**`B7:B122` - slot Cardio (optional days) -> COND_AEROBIC.** Header rows 1-6 (verbatim, bg): r1 'CARDIO' EFEFEF; r2 'FILL HERE' 000000; r4 'CARDIO' 93C47D; r6 'CARDIO' 93C47D. **29 selectable exercises** (+ separators).
- SPEED INTERVALS [separator B8] (5; cell bg 93C47D): B9 '2 min Fast - 1 min walk'; B10 '3 min Fast - 2 min walk'; B11 '4 min Fast - 3 min walk'; B12 '5 min fast - 2 min walk'; B13 '6 min fast - 1 min walk'
- DISTANCE INTERVALS [separator B14] (3; cell bg 93C47D): B15 '1 mile run - 1 min walk'; B16 '2 mile run - 2 min walk'; B17 '3 mile run - 3 min walk'
- DISTANCE TEST [separator B24] (9; cell bg 93C47D): B25 '1 Mile run'; B26 '3 mile run'; B27 '5 mile run'; B28 '8 mile run'; B29 '11 mile run'; B30 '14 mile run'; B31 '17 mile run'; B32 '20 mile run'; B33 '21.6 mile run'
- SPEED TEST [separator B44] (3; cell bg 93C47D): B45 'Half a mile (800m)'; B46 '1 Mile Run for time'; B47 '3 Miles run for time'
- DISTANCE TEST [separator B89] (9; cell bg 93C47D): B90 '1 Mile run'; B91 '3 mile run'; B92 '5 mile run'; B93 '8 mile run'; B94 '11 mile run'; B95 '14 mile run'; B96 '17 mile run'; B97 '20 mile run'; B98 '21.6 mile run'

**`O7:O283` - slot Core (optional days) -> CT_CORE_THORAX or CP_CORE_PELVIS.** Header rows 1-6 (verbatim, bg): r1 'CORE THORAX' D9D9D9; r2 'FILL HERE' 000000; r3 'EASY' 6FA8DC; r4 'CONTROL' 6FA8DC; r5 'CORE THORAX SAGITAL' 6FA8DC; r6 'CORE' 93C47D. **17 selectable exercises** (+ separators).
- CORE THORAX / FOUNDATIONAL [separator O9] (6; cell bg 6FA8DC): O10 'Plank'; O11 'Crunches'; O12 'Sit ups'; O13 'Weighted Situps'; O15 'Toes to bar'; O16 'Knees to chest'
- CORE THORAX / MODERATE [separator O45] (1; cell bg 6FA8DC): O47 'Side Plank '
- CORE THORAX / ADVANCED [separator O90] (3; cell bg 6FA8DC): O92 'Woodchoppers'; O93 'Cable Machine Oblique Rotations'; O94 'Russian Twists'
- CORE PELVIS / FOUNDATIONAL [separator O126] (4; cell bg 6FA8DC): O127 'Leg Raises'; O128 'Reverse Crunches'; O129 'V-ups'; O130 'Hanging Rotational Knee/Leg Raises'
- CORE PELVIS / MODERATE [separator O162] (2; cell bg 6FA8DC): O164 'Side Planks '; O165 'Coppenhaggen Plank'
- CORE PELVIS / ADVANCED [separator O207] (1; cell bg 6FA8DC): O209 'Hanging rotational knees to chest'

**`AZ7:AZ335` - slot Focus 1 / Focus 2 (optional days) -> FOCUS.** Header rows 1-6 (verbatim, bg): r1 'FULL FOCUS LIST' EFEFEF; r2 'FILL HERE' 000000; r6 'MUSCLE FOCUS OPTIONS' EAD1DC. **51 selectable exercises** (+ separators).
- QUADS 👇 [separator AZ8] (8; cell bg none): AZ9 'Goblet squats heels elevated'; AZ10 'Leg press'; AZ11 'Zercher squats'; AZ12 'Back squats'; AZ13 'Walking Lunges'; AZ14 'Stationary Lunges'; AZ15 'Bulgarian Split squats'; AZ16 'Leg extensions'
- SHOULDERS/TRAPS 👇 [separator AZ44] (9; cell bg none): AZ45 'Bd overhead Press'; AZ46 'barbell overhead press'; AZ47 'High incline db press'; AZ48 'Incline db press'; AZ49 'Incline barbell press'; AZ50 'DB side raises'; AZ51 'Cable side raises'; AZ52 'DB upright rows'; AZ53 'Barbell upright rows'
- BACK 👇 [separator AZ89] (6; cell bg none): AZ90 'Pull ups'; AZ91 'assisted pull ups'; AZ92 'lat pull down'; AZ93 'Db rows'; AZ94 'Cable rows'; AZ95 'machine rows'
- TRICEP 👇 [separator AZ124] (5; cell bg none): AZ125 'DB overhead tricep ext'; AZ126 'cable tricep extensions'; AZ127 'cable overhead tricep ext'; AZ128 'dips'; AZ129 'assisted dips'
- GLUTES 👇 [separator AZ164] (2; cell bg none): AZ165 'Single leg Glute bridge'; AZ166 'Barbell hip thrust'
- HAMSTRINGS 👇 [separator AZ204] (8; cell bg none): AZ205 'DB deadlifts'; AZ206 'Barbell deadlifts'; AZ207 'Hyperextensions'; AZ208 'Hip thrusts/ Glute bridges'; AZ209 'Staggered stance DL'; AZ210 'Foot on wall db DL'; AZ211 'Leg curls'; AZ212 'Lying leg curls'
- CHEST 👇 [separator AZ244] (6; cell bg none): AZ245 'Incline db press'; AZ246 'bench press'; AZ247 'db bench press'; AZ248 'DB flies'; AZ249 'Cable flies'; AZ250 'Incline barbell press'
- CORE 👇 [separator AZ284] (3; cell bg none): AZ285 'Weighted situps'; AZ286 'weighted decline situps'; AZ287 'Weighted russian twists'
- BICEP 👇 [separator AZ311] (3; cell bg none): AZ312 'Incline bench bicep curls'; AZ313 'supine bicep curls'; AZ314 'cable bicep curls'
- CALVES 👇 [separator AZ331] (1; cell bg none): AZ332 'DB Standing calf raises'

