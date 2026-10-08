# L4 - Program-slot dropdown wiring (BYOP workbook)

Source: data validations in every BYOP program tab (`dumps/BYOP/00`-`08`, cross-checked against the raw XML in `raw/BYOP.xlsx`; there are no extra `x14` validations the dump could have missed). 1,367 validated cells in 9 program tabs, all of them `list` validations pointing at `'MASTER EXERCISE LIBRARY'`. The three library tabs (`MASTER EXERCISE LIBRARY` and its two copies) contain no validations themselves. Read-only analysis: nothing in the Google Sheets was changed.

Legend: **OBSERVED** = read directly from the sheet. *Inferred* = analyst interpretation.

## 1. How the wiring works (OBSERVED unless marked)

1. **One program row = one slot.** Each row of a program tab has a `PURPOSE` label (muscle or quality: `Quads`, `Back`, `Plyo`, `Focus 1` ...) and usually a `CATEGORY` label (movement pattern: `Bilateral KD`, `Horizontal Pull`, `ABdution` ...). PPL calls the second column `DETAIL` (`Incline`, `Flies`, `Dips`, `Push`, `Overhead`, `Reverse Flies`). The `EXERCISE` cell of the row carries a dropdown into exactly one library column; `SETS` -> `AV`, `REPS` -> `AW`, `EFFORT` -> `AX`, `HOW IT FELT?` -> `AY`.
2. **Every range starts at library row 7**, the green `CHOOSE 👇` cell. So the placeholder text the coach pre-fills in program cells is itself a legal list value (no red warning triangle). *Inferred: deliberate design.*
3. **Only the left-most "stacked" column of each category is ever referenced** (`B, C, G, K, L, O, U, X, AA, AD, AH, AI, AL, AM, AN, AQ, AR, AS, AT, AU, AV, AW, AX, AY, AZ`). In those columns the levels are stacked vertically in fixed row blocks (row 8 / 44 / 89 / 124, plus 162 / 207 for CORE PELVIS inside `O`), and the level words (`FOUNDATIONAL`, `MODERATE`, `ADVANCED`, `EASY`, `UNILATERAL`, `CORE THORAX`, `CORE PELVIS`) plus a repeated `CHOOSE 👇` at the start of each block **appear inside the dropdown as separators**. The flat per-level columns to their right (D-F, H-J, M-N, P-Q, S-T, V-W, Y-Z, AB-AC, AE-AG, AJ-AK, AO-AP) are human-readable views and are **never wired**. *Inferred: the stacked column is the coach's "database"; the flat columns are the "menu".*
4. Google Sheets list dropdowns skip blank cells, so the long empty gaps inside each range (e.g. `AZ7:AZ335`) cost nothing; they are room to grow.
5. **Never wired anywhere**: `R` (CORE PELVIS stacked copy - pelvis is reached through `O` instead), `BA` CARRY, `BB` DRAGS, `BC`/`BD`/`BE` FUNCTIONAL BIOMECHANICS SYSTEM, and every flat per-level column. No program tab has a slot for carries, drags, or anterior/posterior oblique / lateral subsystem work yet.

## 2. Canonical map: library column -> category -> ranges -> program slot labels

"max selectable items" = non-header entries a client can actually pick in the widest range used.
| Library col | Row-1 category (merged span) | Row 3 'ZONE' | Row 5 'PATTERN' sub-type | Row 6 'PURPOSE' | Range(s) wired (-> tabs) | Block headers / separators inside range | max selectable items | Program slot labels that point here (purpose / category) |
|---|---|---|---|---|---|---|---|---|
| B | CARDIO |  |  | CARDIO | `B7:B122` (8 tabs; 34 items; **cuts off 16 cells below r122**)<br>`B7:B335` (1 tab; 50 items) | r7 'CHOOSE 👇' | 50 | 'Aerobic Capacity / (no category label)'; 'Cardio / (no category label)' |
| C | TRIPPLE EXTENSION (C1:F1) | EASY | TRIPPLE EXTENSION | SPEED/POWER | `C7:C242` (3 tabs; 33 items) | r7 'CHOOSE 👇', r8 'FOUNDATIONAL', r44 'MODERATE', r45 'CHOOSE 👇', r89 'ADVANCED', r90 'CHOOSE 👇', r124 'EASY', r125 'CHOOSE 👇' | 33 | 'Tripple Extension / Tripple Extension' |
| G | PLYOS (G1:J1) | EASY | PLYO | SPEED/POWER | `G7:G162` (3 tabs; 41 items) | r7 'CHOOSE 👇', r8 'FOUNDATIONAL', r44 'MODERATE', r45 'CHOOSE 👇', r89 'MODERATE', r90 'CHOOSE 👇', r124 'ADVANCED', r125 'CHOOSE 👇' | 41 | 'Plyo / PLYO'; 'Plyo / Plyo' |
| K | THROWING | AP - THROWING | THROWING | SPEED/POWER | `K7:K87` (3 tabs; 20 items) | r7 'CHOOSE 👇' | 20 | 'Throwing / Throwing' |
| L | CHANGE OF DIRECTION (L1:N1) | EASY   | EASY TURN | CHANGE OF DIRECTION | `L7:L242` (3 tabs; 9 items) | r7 'CHOOSE 👇', r8 'FOUNDATIONAL', r44 'MODERATE', r45 'CHOOSE 👇', r89 'ADVANCED', r90 'CHOOSE 👇' | 9 | 'COD / COD' |
| O | CORE THORAX (O1:Q1) | EASY | CORE THORAX SAGITAL | CORE | `O7:O283` (8 tabs; 17 items) | r7 'CHOOSE 👇', r8 'CORE THORAX', r9 'FOUNDATIONAL', r45 'MODERATE', r46 'CHOOSE 👇', r90 'ADVANCED', r91 'CHOOSE 👇', r124 'CORE PELVIS', r125 'CHOOSE 👇', r126 'FOUNDATIONAL', r162 'MODERATE', r163 'CHOOSE 👇', r207 'ADVANCED', r208 'CHOOSE 👇' | 17 | 'Core / (no category label)' |
| U | VERTICAL PULL (U1:W1) | FOUNDATIONAL | BILATERAL SYMMETRICAL | BACK | `U7:U122` (9 tabs; 20 items) | r7 'CHOOSE 👇', r8 'FOUNDATIONAL', r44 'ADVANCED', r45 'CHOOSE 👇', r89 'UNILATERAL', r90 'CHOOSE 👇' | 20 | 'Back / Vertical Pull' |
| X | HORIZONTAL PULL (X1:Z1) | EASY | BILATERAL SYMMETRICAL | BACK | `X7:X162` (9 tabs; 16 items) | r7 'CHOOSE 👇', r8 'FOUNDATIONAL', r44 'ADVANCED', r45 'CHOOSE 👇', r89 'UNILATERAL', r90 'CHOOSE 👇' | 16 | 'Back / Horizontal Pull' |
| AA | VERTICAL PUSH (AA1:AC1) | FOUNDATIONAL - RP - BS - VERTICAL PUSH | BILATERAL SYMMETRICAL | SHOULDERS/TRAPS | `AA7:AA122` (9 tabs; 20 items) | r7 'CHOOSE 👇', r8 'FOUNDATIONAL', r44 'ADVANCED', r45 'CHOOSE 👇', r89 'UNILATERAL', r90 'CHOOSE 👇' | 20 | 'Chest/Shoulders / Vertical Push' |
| AD | HORIZONTAL PUSH (AD1:AG1) | RP - BS - FOUNDATIONAL- HORIZONTAL PUSH | BILATERAL SYMMETRICAL | CHEST/FRONT DELTS | `AD7:AD162` (9 tabs; 25 items) | r7 'CHOOSE 👇', r8 'FOUNDATIONAL', r44 'MODERATE', r45 'CHOOSE 👇', r89 'ADVANCED', r90 'CHOOSE 👇', r124 'UNILATERAL', r125 'CHOOSE 👇' | 25 | 'Chest / Dips'; 'Chest / Flies'; 'Chest / Horizontal Push'; 'Chest / Incline' |
| AH | SIDE RAISES | RP -SHOULDERS | BILATERAL | SHOULDERS | `AH7:AH42` (8 tabs; 12 items) | r7 'CHOOSE 👇' | 12 | 'Shoulders/Traps / ABdution'; 'Shoulders/Traps / Reverse Flies' |
| AI | BILATERAL KNEE DOMINANT (AI1:AK1) | RP - BS - KNEE DOMINANT | BILATERAL | QUADS | `AI7:AI122` (9 tabs; 35 items) | r7 'CHOOSE 👇', r8 'FOUNDATIONAL', r44 'MODERATE', r45 'CHOOSE 👇', r89 'ADVANCED', r90 'CHOOSE 👇' | 35 | 'Quads / Bilateral KD' |
| AL | UNILATERAL KNEE DOMINANT | RP - UL - KNEE DOMINANT | UNILATERAL | QUADS/GLUTES | `AL7:AL42` (9 tabs; 13 items) | r7 'CHOOSE 👇' | 13 | 'Quads/Glutes / Unilateral KD' |
| AM | LEG EXTENSIONS | RP-BS-KNEE DOMINANT -ADVANCED | BILATERAL | QUADS | `AM7:AM9` (7 tabs; 1 items) | r7 'CHOOSE 👇' | 1 | 'Quads / Leg Extensions' |
| AN | BILATERAL HIP DOMNANT (AN1:AP1) | RP - BS - HIP DOMINANT | BILATERAL | GLUTES/HAMSTRINGS | `AN7:AN122` (9 tabs; 33 items) | r7 'CHOOSE 👇', r8 'FOUNDATIONAL', r44 'MODERATE', r45 'CHOOSE 👇', r89 'ADVANCED', r90 'CHOOSE 👇' | 33 | 'Hamstring / Bilateral HD' |
| AQ | UNILATERAL HIP DOMINANT | RP - UL - HIP DOMINANT | UNILATERAL | GLUTES/HAMSTRINGS | `AQ7:AQ42` (7 tabs; 8 items) | r7 'CHOOSE 👇', r8 'FOUNDATIONAL' | 8 | 'Hamstring/Glutes / Unilateral HD' |
| AR | LEG CURLS |  | UNILATERAL | HAMSTRINGS | `AR7:AR10` (8 tabs; 2 items)<br>`AR7:AR42` (2 tabs; 2 items) | r7 'CHOOSE 👇' | 2 | 'Hamstring/Glutes / Unilateral HD'; 'Hamstrings / Leg Curls' |
| AS | BICEP | RP - BICEP |  | BICEP | `AS7:AS42` (5 tabs; 14 items) | r7 'CHOOSE 👇' | 14 | 'Bicep / Bicep' |
| AT | TRICEP | RP - TRICEP |  | TRICEP | `AT7:AT42` (5 tabs; 9 items) | r7 'CHOOSE 👇' | 9 | 'Tricep / (no category label)'; 'Tricep / Overhead'; 'Tricep / Push'; 'Tricep / Tricep' |
| AU | CALVES | RP - CALVES |  | CALVES | `AU7:AU13` (7 tabs; 5 items) | r7 'CHOOSE 👇' | 5 | 'Calves / (no category label)'; 'Calves / Calves' |
| AV | SETS |  |  | SETS | `AV7:AV42` (8 tabs; 8 items) | r7 'CHOOSE 👇', r16 'SUPERSET W/ 👇' | 8 | 'SETS' |
| AW | REPS |  |  | REPS | `AW7:AW42` (8 tabs; 7 items) | r7 'CHOOSE 👇' | 7 | 'REPS' |
| AX | EFFORT |  |  | EFFORT | `AX7:AX42` (4 tabs; 10 items) | r7 'CHOOSE 👇' | 10 | 'EFFORT' |
| AY | FEELING |  |  | FEELING | `AY7:AY42` (4 tabs; 4 items) | r7 'CHOOSE 👇' | 4 | 'HOW IT FELT?' |
| AZ | FULL FOCUS LIST |  |  | MUSCLE FOCUS OPTIONS | `AZ7:AZ335` (8 tabs; 51 items) | r7 'CHOOSE 👇', r8 'QUADS 👇', r44 'SHOULDERS/TRAPS 👇', r89 'BACK 👇', r124 'TRICEP 👇', r164 'GLUTES 👇', r204 'HAMSTRINGS 👇', r244 'CHEST 👇', r284 'CORE 👇', r311 'BICEP 👇', r331 'CALVES 👇' | 51 | 'Focus 1 / (no category label)'; 'Focus 2 / (no category label)' |
## 3. Slot-label vocabulary -> library category (normalised)

The program tabs use their own short labels. This is the full set observed and where each one lands (all OBSERVED except the "canonical name" column).

| Program PURPOSE label(s) (verbatim) | Program CATEGORY / DETAIL label (verbatim) | Library column -> row-1 category | Canonical slot name (ours) | Family (library row 4) |
|---|---|---|---|---|
| `Quads` | `Bilateral KD` | AI -> 'BILATERAL KNEE DOMINANT' | bilateral_knee_dominant | RESISTANCE |
| `Quads/Glutes` | `Unilateral KD` | AL -> 'UNILATERAL KNEE DOMINANT' | unilateral_knee_dominant | RESISTANCE |
| `Quads` | `Leg Extensions` | AM -> 'LEG EXTENSIONS' | knee_extension_isolation | RESISTANCE |
| `Hamstring` | `Bilateral HD` | AN -> 'BILATERAL HIP DOMNANT' | bilateral_hip_dominant | RESISTANCE |
| `Hamstring/Glutes` | `Unilateral HD` | AQ -> 'UNILATERAL HIP DOMINANT' (**AR in the two NO ACCESS tabs - miswired**) | unilateral_hip_dominant | RESISTANCE |
| `Hamstrings` | `Leg Curls` | AR -> 'LEG CURLS' | knee_flexion_isolation | RESISTANCE |
| `Back` / `Back ` (trailing space) | `Horizontal Pull` | X -> 'HORIZONTAL PULL' | horizontal_pull | RESISTANCE |
| `Back ` | `Vertical Pull` | U -> 'VERTICAL PULL' | vertical_pull | RESISTANCE |
| `Chest` | `Horizontal Push` / PPL `Incline`, `Flies`, `Dips` | AD -> 'HORIZONTAL PUSH' | horizontal_push | RESISTANCE |
| `Chest/Shoulders` | `Vertical Push` | AA -> 'VERTICAL PUSH' | vertical_push | RESISTANCE |
| `Shoulders/Traps` | `ABdution` / PPL `Reverse Flies` | AH -> 'SIDE RAISES' | shoulder_abduction_raises | RESISTANCE |
| `Bicep` | `Bicep` | AS -> 'BICEP' | biceps | RESISTANCE |
| `Tricep` | (blank) / `Tricep` / PPL `Push`, `Overhead` | AT -> 'TRICEP' | triceps | RESISTANCE |
| `Calves` | `Calves` or (blank) | AU -> 'CALVES' | calves | RESISTANCE |
| `Plyo` | `Plyo` / `PLYO` | G -> 'PLYOS' (all 4 blocks) | plyometrics | ATHLETIC |
| `Throwing` | `Throwing` | K -> 'THROWING' | throws | ATHLETIC |
| `COD` | `COD` | L -> 'CHANGE OF DIRECTION' | change_of_direction | ATHLETIC |
| `Tripple Extension` | `Tripple Extension` | C -> 'TRIPPLE EXTENSION' (+ 'JUMPING ANKLE' items stacked at C124) | triple_extension | ATHLETIC |
| `Core` | (blank) | O -> 'CORE THORAX' (range also covers CORE PELVIS block O124-O209) | core (thorax + pelvis) | CONTROL |
| `Cardio` / `Aerobic Capacity` | (blank) | B -> 'CARDIO' | cardio | CARDIO |
| `Focus 1`, `Focus 2` | (blank) | AZ -> 'FULL FOCUS LIST' / 'MUSCLE FOCUS OPTIONS' | muscle_focus (specialisation) | (none in row 4) |
| column `SETS` | - | AV -> 'SETS' | sets | - |
| column `REPS` | - | AW -> 'REPS' | reps | - |
| column `EFFORT` | - | AX -> 'EFFORT' | effort_1_10 | - |
| column `HOW IT FELT?` | - | AY -> 'FEELING' | feeling | - |

*Inferred reading of the label pairs*: PURPOSE = the muscle/quality the slot is credited to (what weekly volume would be counted against), CATEGORY = the movement pattern bucket the exercise is drawn from. The same muscle appears under several patterns (`Quads` = Bilateral KD and Leg Extensions; `Hamstring` = Bilateral HD vs `Hamstrings` = Leg Curls vs `Hamstring/Glutes` = Unilateral HD), which is exactly the "big muscle gets a mix of patterns, small muscle gets one isolation slot" logic.

## 4. Flags: miswired, truncated, inconsistent

### 4.1 Miswired (slot label and library category disagree) - OBSERVED
| Tab | Cells | Slot | Wired to | Should be | Effect |
|---|---|---|---|---|---|
| NO ACCESS - AESTHETICS - FB - 4 (hidden) | E12, E33 | `Hamstring/Glutes` / `Unilateral HD` (Tuesday, Friday) | `AR7:AR42` = 'LEG CURLS' (2 items: 'Seated leg curls', 'Lying Leg Curls') | `AQ7:AQ42` 'UNILATERAL HIP DOMINANT' (8 items) as in the visible AESTHETICS tab (D12/D33) | Client can only pick a leg curl for the single-leg hinge slot, so that day gets two leg-curl slots (E14 is also `AR7:AR10`) and no unilateral hip-dominant work. |
| NO ACCESS - ATHLETIC - FB - 4 t (hidden) | E19, E46 | `Hamstring/Glutes` / `Unilateral HD` (Tuesday, Friday) | `AR7:AR42` | `AQ7:AQ42` as in ATHLETIC / JUSTICE LEAGUE (E19/E46) | Same problem. |

The odd range length (`AR7:AR42` instead of the `AR7:AR10` used by the real Leg Curl slots) suggests the coach copied a validation from a `...7:...42` column (AQ / AL / AS / AT all use 7:42) and the column letter slipped from AQ to AR. *Inferred.*

### 4.2 Truncated ranges (options exist below the end of the range) - OBSERVED
| Range | Used by | Cut-off items (never selectable there) |
|---|---|---|
| `B7:B122` (CARDIO) | Cardio / Aerobic Capacity slots in AESTHETICS (D19, D40), 3 DAY BUILDER (D9, D19, D29), ATHLETIC (E25, E52), JUSTICE LEAGUE (E25, E52), BOOTCAMP OPTION 1 (E19, E40), BOOTCAMP OPTION 2 (E15, E30 only), both NO ACCESS tabs (E19/E40 and E25/E52) | 16 cells: block header `DISTANCE` (B123) + '200m', '400m', '600m', '800m', '1000m'; block header `CALORIES` (B132) + '10 cals' ... '50 cals' (9 options). Every interval/repeat-distance and calorie (bike/rower/ski) option is unreachable except in BOOTCAMP OPTION 2 rows 7/12/22/27, which use `B7:B335`. |

No other range is short: every other range ends at or beyond the last filled cell of its column (`AM7:AM9`, `AR7:AR10`, `AU7:AU13` end exactly on the last item - no room to add exercises without editing 7 tabs).

### 4.3 Inconsistent range for the same slot type - OBSERVED
- **Cardio**: `B7:B122` (8 tabs, 15 cells) vs `B7:B335` (BOOTCAMP OPTION 2 E7, E12, E22, E27). Inside BOOTCAMP OPTION 2 itself the `3A`/`3B` cardio rows (E15, E30) use the short range while the other cardio rows use the long one.
- **Leg Curls**: `AR7:AR10` (8 tabs) vs `AR7:AR42` (the two miswired NO ACCESS cells).

### 4.4 Missing dropdowns (slot exists, no validation) - OBSERVED
- **REPS on every Cardio / Aerobic Capacity row** (AESTHETICS F19/F40, 3 DAY BUILDER F9/F19/F29, ATHLETIC G25/G52, JUSTICE LEAGUE G25/G52, BOOTCAMP OPTION 1 G19/G40, NO ACCESS tabs G19/G40, G25/G52) - consistent with cardio options already carrying their own dose ('2 min Fast - 1 min walk', '3 mile run' ...). SETS is still offered on those rows.
- **HOW IT FELT? on Cardio rows** in the 4 tracking tabs (J19/J40 or J25/J52); EFFORT is offered.
- **BOOTCAMP - OPTION 2** has no SETS, REPS, EFFORT or FEELING columns at all - exercise selection only.
- **AESTHETICS, 3 DAY BUILDER, PUSHPULLLEGS, ATHLETIC** have SETS + REPS only (no EFFORT / HOW IT FELT? / WEIGHT / DONE?). JUSTICE LEAGUE, BOOTCAMP OPTION 1 and both NO ACCESS tabs have the full tracking set.

### 4.5 Values that break validation - OBSERVED
- 422 cells in the two hidden NO ACCESS tabs are pre-filled `CHOSE 👇` (typo) instead of `CHOOSE 👇` -> every one is "invalid" for its list (244 in ATHLETIC, 178 in AESTHETICS).
- `Leg extensions` (lower-case e) typed into `Leg Extensions` slots: BOOTCAMP OPTION 1 E30, NO ACCESS ATHLETIC E12 and E39. The list item is `Leg Extensions` (AM9). (`Leg extensions` with that spelling only exists in AZ16, the focus list.)
- `L92` (and its flat copy `N10`) in the COD list is a **date** (2005-05-10), not text. *Inferred:* the coach typed the pro-agility drill **'5-10-5'** (or '5/10/5') and Google Sheets auto-converted it to a date; it shows in the COD dropdown as a date.

### 4.6 Dropdown hygiene issues inside wired ranges - OBSERVED
- Duplicate options in one dropdown: `AA50`/`AA51` both 'Standing DB Press' (*inferred*: second was meant to be 'Standing Barbell Press'); `AD12`/`AD46` 'Incline Push-ups' (FOUNDATIONAL and MODERATE); `AI20`/`AI55`/`AI101` 'Leg Extension Machine' in all three Bilateral KD blocks; `AN48`/`AN93` 'GHD'; `G9`/`G10` 'Low Depth Drop'; `G15`/`G55` 'Ankle Hops '; six triple-extension pulls repeated between FOUNDATIONAL and MODERATE in `C`; the whole 'DISTANCE TEST' block duplicated at B24-B33 and B89-B98; `AZ48`/`AZ245` 'Incline db press' and `AZ49`/`AZ250` 'Incline barbell press'.
- Leading/trailing spaces on ~50 options (e.g. 'Reverse Lunges ', 'Push Ups ', ' Squirrel jumps') - harmless in the sheet but the generator must `strip()` before matching.
- The level separators (`FOUNDATIONAL`, `MODERATE`, `ADVANCED`, `EASY`, `UNILATERAL`, `CORE THORAX`, `CORE PELVIS`, `CHOOSE 👇`, the AZ muscle headers `QUADS 👇` etc., and `SUPERSET W/ 👇` in SETS) are all *selectable* values. Nothing stops a client from choosing 'MODERATE' as an exercise.
- Two blocks in `G` are both labelled 'MODERATE' (G44 plate hops, G89 hurdle hops); the `C` range's 4th block is labelled 'EASY' but holds the separate JUMPING ANKLE category (F column) - so the Triple Extension slot also serves ankle-hop drills.
- `AF18` 'Deficit Push-ups' exists only in the flat HORIZONTAL PUSH ADVANCED column, not in the stacked `AD` column, so it can never be picked in a program.

### 4.7 Program-tab label issues that affect parsing - OBSERVED
- The `Tricep` slot has an empty CATEGORY cell in AESTHETICS (`C15`, `C36`), BOOTCAMP - OPTION 1 (`D15`, `D36`) and NO ACCESS - AESTHETICS (`D15`, `D36`); `Calves`/`Cardio`/`Core`/`Focus` rows on optional days also have no CATEGORY.
- The Thursday block in ATHLETIC and JUSTICE LEAGUE (rows 30-39) has an empty merged DAY cell `B30:B39`.
- BOOTCAMP - OPTION 2's title cell `A1` reads 'BOOTCAMP OPTION 1' (copy/paste leftover); its days are `1A, 2A, 3A, 1B, 2B, 3B` (A/B rotation) instead of weekdays.
- NO ACCESS - ATHLETIC's title says '4 to 6 DAYS A WEEK'; ATHLETIC/JUSTICE LEAGUE say '4 DAYS A WEEK'.
- Purpose labels carry stray spaces (`Back ` vs `Back`) and inconsistent case (`Plyo` vs `PLYO`).

## 5. Slots per day (OBSERVED counts of EXERCISE dropdowns)

| Tab | Main training days | Accessory / optional days |
|---|---|---|
| AESTHETICS - FULL BODY - 4 DAYS | Day 1-4: 7 slots each (A day: Calves, Bilateral KD, Horizontal Pull, Unilateral KD, Vertical Pull, Bicep, Leg Ext; B day: Bilateral HD, Horizontal Push, Unilateral HD, Vertical Push, Leg Curls, Tricep, ABdution) | 'Optional' block after day 2 and day 4: Calves, Cardio, Core, Focus 1, Focus 2 (5) |
| 3 DAY BUILDER | DAY 1-3: 5 slots each | 'Optional' block after each day: Calves, Cardio, Core, Focus 1, Focus 2 |
| PUSHPULLLEGS - 3 or 6 DAYS A WK | 7 slots per day (Push x2, Pull x2, Legs x2; legs day includes `Focus 1`) ; Sunday OFF | - |
| ATHLETIC - FULL BODY - 4 DAYS A / JUSTICE LEAGUE | Mon/Thu: 10 (Plyo x2, Throwing, COD, Tripple Extension + 5 resistance); Tue/Fri: 10 (Plyo, Throwing, COD, Tripple Extension + 6 resistance) | Wed/Sat: 5 (Calves, Aerobic Capacity, Core, Focus 1, Focus 2); Sunday OFF |
| BOOTCAMP - OPTION 1 | Mon-Tue-Thu-Fri: 7 each | Wed/Sat: Calves, Cardio, Core, Focus 1, Focus 2 |
| BOOTCAMP - OPTION 2 | 1A/2A/3A/1B/2B/3B: 5 each, every day includes a Cardio slot | - |
| NO ACCESS - AESTHETICS / NO ACCESS - ATHLETIC (hidden) | same structure as AESTHETICS (7) / ATHLETIC (10) | Wed/Sat 5 |

*Inferred*: exercise-count ceiling the coach uses is 5-7 resistance slots per session for physique templates and 10 slots (4-5 athletic + 5-6 resistance) for athletic templates, with 'Focus' (specialisation) volume parked on the optional / mid-week days.

## 6. Per-tab, per-row wiring (exhaustive)

Columns: EXERCISE cell -> library range (flags inline); SETS/REPS/EFFORT/HOW IT FELT? ranges ('-' = no dropdown); current exercise value as found.

#### AESTHETICS - FULL BODY - 4 DAYS

| Row | Day | Purpose | Category | EXERCISE cell -> range | SETS | REPS | EFFORT | HOW IT FELT? | Current exercise value |
|---|---|---|---|---|---|---|---|---|---|
| 3 | Day 1 | Calves | Calves | D3 -> `AU7:AU13` | `AV7:AV42` | `AW7:AW42` | - | - | Machine Calf Raises |
| 4 | Day 1 | Quads | Bilateral KD | D4 -> `AI7:AI122` | `AV7:AV42` | `AW7:AW42` | - | - | Leg press |
| 5 | Day 1 | Back | Horizontal Pull | D5 -> `X7:X162` | `AV7:AV42` | `AW7:AW42` | - | - | Bent Over Barbell Rows |
| 6 | Day 1 | Quads/Glutes | Unilateral KD | D6 -> `AL7:AL42` | `AV7:AV42` | `AW7:AW42` | - | - | Reverse Lunges  |
| 7 | Day 1 | Back | Vertical Pull | D7 -> `U7:U122` | `AV7:AV42` | `AW7:AW42` | - | - | Lat Pulldown Pronated Grip |
| 8 | Day 1 | Bicep | Bicep | D8 -> `AS7:AS42` | `AV7:AV42` | `AW7:AW42` | - | - | Ez Bar Curls |
| 9 | Day 1 | Quads | Leg Extensions | D9 -> `AM7:AM9` | `AV7:AV42` | `AW7:AW42` | - | - | Leg Extensions |
| 10 | Day 2 | Hamstring | Bilateral HD | D10 -> `AN7:AN122` | `AV7:AV42` | `AW7:AW42` | - | - | DB Deadlifts |
| 11 | Day 2 | Chest | Horizontal Push | D11 -> `AD7:AD162` | `AV7:AV42` | `AW7:AW42` | - | - | Push Ups  |
| 12 | Day 2 | Hamstring/Glutes | Unilateral HD | D12 -> `AQ7:AQ42` | `AV7:AV42` | `AW7:AW42` | - | - | Staggered Stance DL w/ DB  |
| 13 | Day 2 | Chest/Shoulders | Vertical Push | D13 -> `AA7:AA122` | `AV7:AV42` | `AW7:AW42` | - | - | DB Push press |
| 14 | Day 2 | Hamstrings | Leg Curls | D14 -> `AR7:AR10` | `AV7:AV42` | `AW7:AW42` | - | - | CHOOSE 👇 |
| 15 | Day 2 | Tricep |  | D15 -> `AT7:AT42` | `AV7:AV42` | `AW7:AW42` | - | - | CHOOSE 👇 |
| 16 | Day 2 | Shoulders/Traps | ABdution | D16 -> `AH7:AH42` | `AV7:AV42` | `AW7:AW42` | - | - | CHOOSE 👇 |
| 18 | Optional | Calves |  | D18 -> `AU7:AU13` | `AV7:AV42` | `AW7:AW42` | - | - | CHOOSE 👇 |
| 19 | Optional | Cardio |  | D19 -> `B7:B122` **TRUNCATED** | `AV7:AV42` | - | - | - | CHOOSE 👇 |
| 20 | Optional | Core |  | D20 -> `O7:O283` | `AV7:AV42` | `AW7:AW42` | - | - | CHOOSE 👇 |
| 21 | Optional | Focus 1 |  | D21 -> `AZ7:AZ335` | `AV7:AV42` | `AW7:AW42` | - | - | CHOOSE 👇 |
| 22 | Optional | Focus 2 |  | D22 -> `AZ7:AZ335` | `AV7:AV42` | `AW7:AW42` | - | - | CHOOSE 👇 |
| 24 | Day 3 | Calves | Calves | D24 -> `AU7:AU13` | `AV7:AV42` | `AW7:AW42` | - | - | CHOOSE 👇 |
| 25 | Day 3 | Quads | Bilateral KD | D25 -> `AI7:AI122` | `AV7:AV42` | `AW7:AW42` | - | - | CHOOSE 👇 |
| 26 | Day 3 | Back | Horizontal Pull | D26 -> `X7:X162` | `AV7:AV42` | `AW7:AW42` | - | - | CHOOSE 👇 |
| 27 | Day 3 | Quads/Glutes | Unilateral KD | D27 -> `AL7:AL42` | `AV7:AV42` | `AW7:AW42` | - | - | CHOOSE 👇 |
| 28 | Day 3 | Back | Vertical Pull | D28 -> `U7:U122` | `AV7:AV42` | `AW7:AW42` | - | - | CHOOSE 👇 |
| 29 | Day 3 | Bicep | Bicep | D29 -> `AS7:AS42` | `AV7:AV42` | `AW7:AW42` | - | - | CHOOSE 👇 |
| 30 | Day 3 | Quads | Leg Extensions | D30 -> `AM7:AM9` | `AV7:AV42` | `AW7:AW42` | - | - | CHOOSE 👇 |
| 31 | Day 4 | Hamstring | Bilateral HD | D31 -> `AN7:AN122` | `AV7:AV42` | `AW7:AW42` | - | - | CHOOSE 👇 |
| 32 | Day 4 | Chest | Horizontal Push | D32 -> `AD7:AD162` | `AV7:AV42` | `AW7:AW42` | - | - | CHOOSE 👇 |
| 33 | Day 4 | Hamstring/Glutes | Unilateral HD | D33 -> `AQ7:AQ42` | `AV7:AV42` | `AW7:AW42` | - | - | CHOOSE 👇 |
| 34 | Day 4 | Chest/Shoulders | Vertical Push | D34 -> `AA7:AA122` | `AV7:AV42` | `AW7:AW42` | - | - | CHOOSE 👇 |
| 35 | Day 4 | Hamstrings | Leg Curls | D35 -> `AR7:AR10` | `AV7:AV42` | `AW7:AW42` | - | - | CHOOSE 👇 |
| 36 | Day 4 | Tricep |  | D36 -> `AT7:AT42` | `AV7:AV42` | `AW7:AW42` | - | - | CHOOSE 👇 |
| 37 | Day 4 | Shoulders/Traps | ABdution | D37 -> `AH7:AH42` | `AV7:AV42` | `AW7:AW42` | - | - | CHOOSE 👇 |
| 39 | Optional | Calves |  | D39 -> `AU7:AU13` | `AV7:AV42` | `AW7:AW42` | - | - | CHOOSE 👇 |
| 40 | Optional | Cardio |  | D40 -> `B7:B122` **TRUNCATED** | `AV7:AV42` | - | - | - | CHOOSE 👇 |
| 41 | Optional | Core |  | D41 -> `O7:O283` | `AV7:AV42` | `AW7:AW42` | - | - | CHOOSE 👇 |
| 42 | Optional | Focus 1 |  | D42 -> `AZ7:AZ335` | `AV7:AV42` | `AW7:AW42` | - | - | CHOOSE 👇 |
| 43 | Optional | Focus 2 |  | D43 -> `AZ7:AZ335` | `AV7:AV42` | `AW7:AW42` | - | - | CHOOSE 👇 |

#### 3 DAY BUILDER

| Row | Day | Purpose | Category | EXERCISE cell -> range | SETS | REPS | EFFORT | HOW IT FELT? | Current exercise value |
|---|---|---|---|---|---|---|---|---|---|
| 3 | DAY 1 | Calves | Calves | D3 -> `AU7:AU13` | `AV7:AV42` | `AW7:AW42` | - | - | CHOOSE 👇 |
| 4 | DAY 1 | Quads | Bilateral KD | D4 -> `AI7:AI122` | `AV7:AV42` | `AW7:AW42` | - | - | CHOOSE 👇 |
| 5 | DAY 1 | Back | Horizontal Pull | D5 -> `X7:X162` | `AV7:AV42` | `AW7:AW42` | - | - | CHOOSE 👇 |
| 6 | DAY 1 | Quads/Glutes | Unilateral KD | D6 -> `AL7:AL42` | `AV7:AV42` | `AW7:AW42` | - | - | CHOOSE 👇 |
| 7 | DAY 1 | Back | Vertical Pull | D7 -> `U7:U122` | `AV7:AV42` | `AW7:AW42` | - | - | CHOOSE 👇 |
| 8 | Optional | Calves |  | D8 -> `AU7:AU13` | `AV7:AV42` | `AW7:AW42` | - | - | CHOOSE 👇 |
| 9 | Optional | Cardio |  | D9 -> `B7:B122` **TRUNCATED** | `AV7:AV42` | - | - | - | CHOOSE 👇 |
| 10 | Optional | Core |  | D10 -> `O7:O283` | `AV7:AV42` | `AW7:AW42` | - | - | CHOOSE 👇 |
| 11 | Optional | Focus 1 |  | D11 -> `AZ7:AZ335` | `AV7:AV42` | `AW7:AW42` | - | - | CHOOSE 👇 |
| 12 | Optional | Focus 2 |  | D12 -> `AZ7:AZ335` | `AV7:AV42` | `AW7:AW42` | - | - | CHOOSE 👇 |
| 13 | DAY 2 | Hamstring | Bilateral HD | D13 -> `AN7:AN122` | `AV7:AV42` | `AW7:AW42` | - | - | CHOOSE 👇 |
| 14 | DAY 2 | Chest | Horizontal Push | D14 -> `AD7:AD162` | `AV7:AV42` | `AW7:AW42` | - | - | CHOOSE 👇 |
| 15 | DAY 2 | Hamstring/Glutes | Unilateral HD | D15 -> `AQ7:AQ42` | `AV7:AV42` | `AW7:AW42` | - | - | CHOOSE 👇 |
| 16 | DAY 2 | Chest/Shoulders | Vertical Push | D16 -> `AA7:AA122` | `AV7:AV42` | `AW7:AW42` | - | - | CHOOSE 👇 |
| 17 | DAY 2 | Hamstrings | Leg Curls | D17 -> `AR7:AR10` | `AV7:AV42` | `AW7:AW42` | - | - | CHOOSE 👇 |
| 18 | Optional | Calves |  | D18 -> `AU7:AU13` | `AV7:AV42` | `AW7:AW42` | - | - | CHOOSE 👇 |
| 19 | Optional | Cardio |  | D19 -> `B7:B122` **TRUNCATED** | `AV7:AV42` | - | - | - | CHOOSE 👇 |
| 20 | Optional | Core |  | D20 -> `O7:O283` | `AV7:AV42` | `AW7:AW42` | - | - | CHOOSE 👇 |
| 21 | Optional | Focus 1 |  | D21 -> `AZ7:AZ335` | `AV7:AV42` | `AW7:AW42` | - | - | CHOOSE 👇 |
| 22 | Optional | Focus 2 |  | D22 -> `AZ7:AZ335` | `AV7:AV42` | `AW7:AW42` | - | - | CHOOSE 👇 |
| 23 | DAY 3 | Quads | Bilateral KD | D23 -> `AI7:AI122` | `AV7:AV42` | `AW7:AW42` | - | - | CHOOSE 👇 |
| 24 | DAY 3 | Hamstring | Bilateral HD | D24 -> `AN7:AN122` | `AV7:AV42` | `AW7:AW42` | - | - | CHOOSE 👇 |
| 25 | DAY 3 | Back | Horizontal Pull | D25 -> `X7:X162` | `AV7:AV42` | `AW7:AW42` | - | - | CHOOSE 👇 |
| 26 | DAY 3 | Chest | Horizontal Push | D26 -> `AD7:AD162` | `AV7:AV42` | `AW7:AW42` | - | - | CHOOSE 👇 |
| 27 | DAY 3 | Quads/Glutes | Unilateral KD | D27 -> `AL7:AL42` | `AV7:AV42` | `AW7:AW42` | - | - | CHOOSE 👇 |
| 28 | Optional | Calves |  | D28 -> `AU7:AU13` | `AV7:AV42` | `AW7:AW42` | - | - | CHOOSE 👇 |
| 29 | Optional | Cardio |  | D29 -> `B7:B122` **TRUNCATED** | `AV7:AV42` | - | - | - | CHOOSE 👇 |
| 30 | Optional | Core |  | D30 -> `O7:O283` | `AV7:AV42` | `AW7:AW42` | - | - | CHOOSE 👇 |
| 31 | Optional | Focus 1 |  | D31 -> `AZ7:AZ335` | `AV7:AV42` | `AW7:AW42` | - | - | CHOOSE 👇 |
| 32 | Optional | Focus 2 |  | D32 -> `AZ7:AZ335` | `AV7:AV42` | `AW7:AW42` | - | - | CHOOSE 👇 |

#### PUSHPULLLEGS - 3 or 6 DAYS A WK

| Row | Day | Purpose | Category | EXERCISE cell -> range | SETS | REPS | EFFORT | HOW IT FELT? | Current exercise value |
|---|---|---|---|---|---|---|---|---|---|
| 3 | MONDAY | Chest | Horizontal Push | E3 -> `AD7:AD162` | `AV7:AV42` | `AW7:AW42` | - | - | CHOOSE 👇 |
| 4 | MONDAY | Chest/Shoulders | Vertical Push | E4 -> `AA7:AA122` | `AV7:AV42` | `AW7:AW42` | - | - | CHOOSE 👇 |
| 5 | MONDAY | Chest | Incline | E5 -> `AD7:AD162` | `AV7:AV42` | `AW7:AW42` | - | - | CHOOSE 👇 |
| 6 | MONDAY | Chest | Flies | E6 -> `AD7:AD162` | `AV7:AV42` | `AW7:AW42` | - | - | CHOOSE 👇 |
| 7 | MONDAY | Chest | Dips | E7 -> `AD7:AD162` | `AV7:AV42` | `AW7:AW42` | - | - | CHOOSE 👇 |
| 8 | MONDAY | Tricep | Push | E8 -> `AT7:AT42` | `AV7:AV42` | `AW7:AW42` | - | - | CHOOSE 👇 |
| 9 | MONDAY | Tricep | Overhead | E9 -> `AT7:AT42` | `AV7:AV42` | `AW7:AW42` | - | - | CHOOSE 👇 |
| 10 | TUESDAY | Back | Horizontal Pull | E10 -> `X7:X162` | `AV7:AV42` | `AW7:AW42` | - | - | CHOOSE 👇 |
| 11 | TUESDAY | Back | Horizontal Pull | E11 -> `X7:X162` | `AV7:AV42` | `AW7:AW42` | - | - | CHOOSE 👇 |
| 12 | TUESDAY | Back | Vertical Pull | E12 -> `U7:U122` | `AV7:AV42` | `AW7:AW42` | - | - | CHOOSE 👇 |
| 13 | TUESDAY | Shoulders/Traps | ABdution | E13 -> `AH7:AH42` | `AV7:AV42` | `AW7:AW42` | - | - | CHOOSE 👇 |
| 14 | TUESDAY | Shoulders/Traps | Reverse Flies | E14 -> `AH7:AH42` | `AV7:AV42` | `AW7:AW42` | - | - | CHOOSE 👇 |
| 15 | TUESDAY | Bicep | Bicep | E15 -> `AS7:AS42` | `AV7:AV42` | `AW7:AW42` | - | - | CHOOSE 👇 |
| 16 | TUESDAY | Bicep | Bicep | E16 -> `AS7:AS42` | `AV7:AV42` | `AW7:AW42` | - | - | CHOOSE 👇 |
| 17 | WEDNESDAY | Quads | Bilateral KD | E17 -> `AI7:AI122` | `AV7:AV42` | `AW7:AW42` | - | - | CHOOSE 👇 |
| 18 | WEDNESDAY | Hamstring | Bilateral HD | E18 -> `AN7:AN122` | `AV7:AV42` | `AW7:AW42` | - | - | CHOOSE 👇 |
| 19 | WEDNESDAY | Quads/Glutes | Unilateral KD | E19 -> `AL7:AL42` | `AV7:AV42` | `AW7:AW42` | - | - | CHOOSE 👇 |
| 20 | WEDNESDAY | Quads | Leg Extensions | E20 -> `AM7:AM9` | `AV7:AV42` | `AW7:AW42` | - | - | CHOOSE 👇 |
| 21 | WEDNESDAY | Hamstrings | Leg Curls | E21 -> `AR7:AR10` | `AV7:AV42` | `AW7:AW42` | - | - | CHOOSE 👇 |
| 22 | WEDNESDAY | Hamstring/Glutes | Unilateral HD | E22 -> `AQ7:AQ42` | `AV7:AV42` | `AW7:AW42` | - | - | CHOOSE 👇 |
| 23 | WEDNESDAY | Focus 1 |  | E23 -> `AZ7:AZ335` | `AV7:AV42` | `AW7:AW42` | - | - | CHOOSE 👇 |
| 24 | Thursday | Chest | Horizontal Push | E24 -> `AD7:AD162` | `AV7:AV42` | `AW7:AW42` | - | - | CHOOSE 👇 |
| 25 | Thursday | Chest/Shoulders | Vertical Push | E25 -> `AA7:AA122` | `AV7:AV42` | `AW7:AW42` | - | - | CHOOSE 👇 |
| 26 | Thursday | Chest | Incline | E26 -> `AD7:AD162` | `AV7:AV42` | `AW7:AW42` | - | - | CHOOSE 👇 |
| 27 | Thursday | Chest | Flies | E27 -> `AD7:AD162` | `AV7:AV42` | `AW7:AW42` | - | - | CHOOSE 👇 |
| 28 | Thursday | Chest | Dips | E28 -> `AD7:AD162` | `AV7:AV42` | `AW7:AW42` | - | - | CHOOSE 👇 |
| 29 | Thursday | Tricep | Push | E29 -> `AT7:AT42` | `AV7:AV42` | `AW7:AW42` | - | - | CHOOSE 👇 |
| 30 | Thursday | Tricep | Overhead | E30 -> `AT7:AT42` | `AV7:AV42` | `AW7:AW42` | - | - | CHOOSE 👇 |
| 31 | Friday | Back | Horizontal Pull | E31 -> `X7:X162` | `AV7:AV42` | `AW7:AW42` | - | - | CHOOSE 👇 |
| 32 | Friday | Back | Horizontal Pull | E32 -> `X7:X162` | `AV7:AV42` | `AW7:AW42` | - | - | CHOOSE 👇 |
| 33 | Friday | Back | Vertical Pull | E33 -> `U7:U122` | `AV7:AV42` | `AW7:AW42` | - | - | CHOOSE 👇 |
| 34 | Friday | Shoulders/Traps | ABdution | E34 -> `AH7:AH42` | `AV7:AV42` | `AW7:AW42` | - | - | CHOOSE 👇 |
| 35 | Friday | Shoulders/Traps | Reverse Flies | E35 -> `AH7:AH42` | `AV7:AV42` | `AW7:AW42` | - | - | CHOOSE 👇 |
| 36 | Friday | Bicep | Bicep | E36 -> `AS7:AS42` | `AV7:AV42` | `AW7:AW42` | - | - | CHOOSE 👇 |
| 37 | Friday | Bicep | Bicep | E37 -> `AS7:AS42` | `AV7:AV42` | `AW7:AW42` | - | - | CHOOSE 👇 |
| 38 | Saturday | Quads | Bilateral KD | E38 -> `AI7:AI122` | `AV7:AV42` | `AW7:AW42` | - | - | CHOOSE 👇 |
| 39 | Saturday | Hamstring | Bilateral HD | E39 -> `AN7:AN122` | `AV7:AV42` | `AW7:AW42` | - | - | CHOOSE 👇 |
| 40 | Saturday | Quads/Glutes | Unilateral KD | E40 -> `AL7:AL42` | `AV7:AV42` | `AW7:AW42` | - | - | CHOOSE 👇 |
| 41 | Saturday | Quads | Leg Extensions | E41 -> `AM7:AM9` | `AV7:AV42` | `AW7:AW42` | - | - | CHOOSE 👇 |
| 42 | Saturday | Hamstrings | Leg Curls | E42 -> `AR7:AR10` | `AV7:AV42` | `AW7:AW42` | - | - | CHOOSE 👇 |
| 43 | Saturday | Hamstring/Glutes | Unilateral HD | E43 -> `AQ7:AQ42` | `AV7:AV42` | `AW7:AW42` | - | - | CHOOSE 👇 |
| 44 | Saturday | Focus 1 |  | E44 -> `AZ7:AZ335` | `AV7:AV42` | `AW7:AW42` | - | - | CHOOSE 👇 |

#### ATHLETIC - FULL BODY - 4 DAYS A

| Row | Day | Purpose | Category | EXERCISE cell -> range | SETS | REPS | EFFORT | HOW IT FELT? | Current exercise value |
|---|---|---|---|---|---|---|---|---|---|
| 3 | MONDAY | Plyo | Plyo | E3 -> `G7:G162` | `AV7:AV42` | `AW7:AW42` | - | - | CHOOSE 👇 |
| 4 | MONDAY | Plyo | Plyo | E4 -> `G7:G162` | `AV7:AV42` | `AW7:AW42` | - | - | CHOOSE 👇 |
| 5 | MONDAY | Throwing | Throwing | E5 -> `K7:K87` | `AV7:AV42` | `AW7:AW42` | - | - | CHOOSE 👇 |
| 6 | MONDAY | COD | COD | E6 -> `L7:L242` | `AV7:AV42` | `AW7:AW42` | - | - | CHOOSE 👇 |
| 7 | MONDAY | Tripple Extension | Tripple Extension | E7 -> `C7:C242` | `AV7:AV42` | `AW7:AW42` | - | - | CHOOSE 👇 |
| 8 | MONDAY | Quads | Bilateral KD | E8 -> `AI7:AI122` | `AV7:AV42` | `AW7:AW42` | - | - | CHOOSE 👇 |
| 9 | MONDAY | Back | Horizontal Pull | E9 -> `X7:X162` | `AV7:AV42` | `AW7:AW42` | - | - | CHOOSE 👇 |
| 10 | MONDAY | Quads/Glutes | Unilateral KD | E10 -> `AL7:AL42` | `AV7:AV42` | `AW7:AW42` | - | - | CHOOSE 👇 |
| 11 | MONDAY | Back | Vertical Pull | E11 -> `U7:U122` | `AV7:AV42` | `AW7:AW42` | - | - | CHOOSE 👇 |
| 12 | MONDAY | Quads | Leg Extensions | E12 -> `AM7:AM9` | `AV7:AV42` | `AW7:AW42` | - | - | CHOOSE 👇 |
| 13 | TUESDAY | Plyo | PLYO | E13 -> `G7:G162` | `AV7:AV42` | `AW7:AW42` | - | - | CHOOSE 👇 |
| 14 | TUESDAY | Throwing | Throwing | E14 -> `K7:K87` | `AV7:AV42` | `AW7:AW42` | - | - | CHOOSE 👇 |
| 15 | TUESDAY | COD | COD | E15 -> `L7:L242` | `AV7:AV42` | `AW7:AW42` | - | - | CHOOSE 👇 |
| 16 | TUESDAY | Tripple Extension | Tripple Extension | E16 -> `C7:C242` | `AV7:AV42` | `AW7:AW42` | - | - | CHOOSE 👇 |
| 17 | TUESDAY | Hamstring | Bilateral HD | E17 -> `AN7:AN122` | `AV7:AV42` | `AW7:AW42` | - | - | CHOOSE 👇 |
| 18 | TUESDAY | Chest | Horizontal Push | E18 -> `AD7:AD162` | `AV7:AV42` | `AW7:AW42` | - | - | CHOOSE 👇 |
| 19 | TUESDAY | Hamstring/Glutes | Unilateral HD | E19 -> `AQ7:AQ42` | `AV7:AV42` | `AW7:AW42` | - | - | CHOOSE 👇 |
| 20 | TUESDAY | Chest/Shoulders | Vertical Push | E20 -> `AA7:AA122` | `AV7:AV42` | `AW7:AW42` | - | - | CHOOSE 👇 |
| 21 | TUESDAY | Hamstrings | Leg Curls | E21 -> `AR7:AR10` | `AV7:AV42` | `AW7:AW42` | - | - | CHOOSE 👇 |
| 22 | TUESDAY | Shoulders/Traps | ABdution | E22 -> `AH7:AH42` | `AV7:AV42` | `AW7:AW42` | - | - | CHOOSE 👇 |
| 24 | WEDNESDAY | Calves |  | E24 -> `AU7:AU13` | `AV7:AV42` | `AW7:AW42` | - | - | CHOOSE 👇 |
| 25 | WEDNESDAY | Aerobic Capacity |  | E25 -> `B7:B122` **TRUNCATED** | `AV7:AV42` | - | - | - | CHOOSE 👇 |
| 26 | WEDNESDAY | Core |  | E26 -> `O7:O283` | `AV7:AV42` | `AW7:AW42` | - | - | CHOOSE 👇 |
| 27 | WEDNESDAY | Focus 1 |  | E27 -> `AZ7:AZ335` | `AV7:AV42` | `AW7:AW42` | - | - | CHOOSE 👇 |
| 28 | WEDNESDAY | Focus 2 |  | E28 -> `AZ7:AZ335` | `AV7:AV42` | `AW7:AW42` | - | - | CHOOSE 👇 |
| 30 | (blank merged cell - THURSDAY by position) | Plyo | Plyo | E30 -> `G7:G162` | `AV7:AV42` | `AW7:AW42` | - | - | CHOOSE 👇 |
| 31 | (blank merged cell - THURSDAY by position) | Plyo | Plyo | E31 -> `G7:G162` | `AV7:AV42` | `AW7:AW42` | - | - | CHOOSE 👇 |
| 32 | (blank merged cell - THURSDAY by position) | Throwing | Throwing | E32 -> `K7:K87` | `AV7:AV42` | `AW7:AW42` | - | - | CHOOSE 👇 |
| 33 | (blank merged cell - THURSDAY by position) | COD | COD | E33 -> `L7:L242` | `AV7:AV42` | `AW7:AW42` | - | - | CHOOSE 👇 |
| 34 | (blank merged cell - THURSDAY by position) | Tripple Extension | Tripple Extension | E34 -> `C7:C242` | `AV7:AV42` | `AW7:AW42` | - | - | CHOOSE 👇 |
| 35 | (blank merged cell - THURSDAY by position) | Quads | Bilateral KD | E35 -> `AI7:AI122` | `AV7:AV42` | `AW7:AW42` | - | - | CHOOSE 👇 |
| 36 | (blank merged cell - THURSDAY by position) | Back | Horizontal Pull | E36 -> `X7:X162` | `AV7:AV42` | `AW7:AW42` | - | - | CHOOSE 👇 |
| 37 | (blank merged cell - THURSDAY by position) | Quads/Glutes | Unilateral KD | E37 -> `AL7:AL42` | `AV7:AV42` | `AW7:AW42` | - | - | CHOOSE 👇 |
| 38 | (blank merged cell - THURSDAY by position) | Back | Vertical Pull | E38 -> `U7:U122` | `AV7:AV42` | `AW7:AW42` | - | - | CHOOSE 👇 |
| 39 | (blank merged cell - THURSDAY by position) | Quads | Leg Extensions | E39 -> `AM7:AM9` | `AV7:AV42` | `AW7:AW42` | - | - | CHOOSE 👇 |
| 40 | FRIDAY | Plyo | PLYO | E40 -> `G7:G162` | `AV7:AV42` | `AW7:AW42` | - | - | CHOOSE 👇 |
| 41 | FRIDAY | Throwing | Throwing | E41 -> `K7:K87` | `AV7:AV42` | `AW7:AW42` | - | - | CHOOSE 👇 |
| 42 | FRIDAY | COD | COD | E42 -> `L7:L242` | `AV7:AV42` | `AW7:AW42` | - | - | CHOOSE 👇 |
| 43 | FRIDAY | Tripple Extension | Tripple Extension | E43 -> `C7:C242` | `AV7:AV42` | `AW7:AW42` | - | - | CHOOSE 👇 |
| 44 | FRIDAY | Hamstring | Bilateral HD | E44 -> `AN7:AN122` | `AV7:AV42` | `AW7:AW42` | - | - | CHOOSE 👇 |
| 45 | FRIDAY | Chest | Horizontal Push | E45 -> `AD7:AD162` | `AV7:AV42` | `AW7:AW42` | - | - | CHOOSE 👇 |
| 46 | FRIDAY | Hamstring/Glutes | Unilateral HD | E46 -> `AQ7:AQ42` | `AV7:AV42` | `AW7:AW42` | - | - | CHOOSE 👇 |
| 47 | FRIDAY | Chest/Shoulders | Vertical Push | E47 -> `AA7:AA122` | `AV7:AV42` | `AW7:AW42` | - | - | CHOOSE 👇 |
| 48 | FRIDAY | Hamstrings | Leg Curls | E48 -> `AR7:AR10` | `AV7:AV42` | `AW7:AW42` | - | - | CHOOSE 👇 |
| 49 | FRIDAY | Shoulders/Traps | ABdution | E49 -> `AH7:AH42` | `AV7:AV42` | `AW7:AW42` | - | - | CHOOSE 👇 |
| 51 | SATURDAY | Calves |  | E51 -> `AU7:AU13` | `AV7:AV42` | `AW7:AW42` | - | - | CHOOSE 👇 |
| 52 | SATURDAY | Aerobic Capacity |  | E52 -> `B7:B122` **TRUNCATED** | `AV7:AV42` | - | - | - | CHOOSE 👇 |
| 53 | SATURDAY | Core |  | E53 -> `O7:O283` | `AV7:AV42` | `AW7:AW42` | - | - | CHOOSE 👇 |
| 54 | SATURDAY | Focus 1 |  | E54 -> `AZ7:AZ335` | `AV7:AV42` | `AW7:AW42` | - | - | CHOOSE 👇 |
| 55 | SATURDAY | Focus 2 |  | E55 -> `AZ7:AZ335` | `AV7:AV42` | `AW7:AW42` | - | - | CHOOSE 👇 |

#### JUSTICE LEAGUE

| Row | Day | Purpose | Category | EXERCISE cell -> range | SETS | REPS | EFFORT | HOW IT FELT? | Current exercise value |
|---|---|---|---|---|---|---|---|---|---|
| 3 | MONDAY | Plyo | Plyo | E3 -> `G7:G162` | `AV7:AV42` | `AW7:AW42` | `AX7:AX42` | `AY7:AY42` | Medium Depth Drop |
| 4 | MONDAY | Plyo | Plyo | E4 -> `G7:G162` | `AV7:AV42` | `AW7:AW42` | `AX7:AX42` | `AY7:AY42` | Ankle Hops  |
| 5 | MONDAY | Throwing | Throwing | E5 -> `K7:K87` | `AV7:AV42` | `AW7:AW42` | `AX7:AX42` | `AY7:AY42` | Situps to overhead throw |
| 6 | MONDAY | COD | COD | E6 -> `L7:L242` | `AV7:AV42` | `AW7:AW42` | `AX7:AX42` | `AY7:AY42` | DIG/OUT |
| 7 | MONDAY | Tripple Extension | Tripple Extension | E7 -> `C7:C242` | `AV7:AV42` | `AW7:AW42` | `AX7:AX42` | `AY7:AY42` | Power Clean |
| 8 | MONDAY | Quads | Bilateral KD | E8 -> `AI7:AI122` | `AV7:AV42` | `AW7:AW42` | `AX7:AX42` | `AY7:AY42` | Front Squats |
| 9 | MONDAY | Back | Horizontal Pull | E9 -> `X7:X162` | `AV7:AV42` | `AW7:AW42` | `AX7:AX42` | `AY7:AY42` | Cable Machine UL Rows |
| 10 | MONDAY | Quads/Glutes | Unilateral KD | E10 -> `AL7:AL42` | `AV7:AV42` | `AW7:AW42` | `AX7:AX42` | `AY7:AY42` | Front Foot Elevated Lunges (FFE) |
| 11 | MONDAY | Back | Vertical Pull | E11 -> `U7:U122` | `AV7:AV42` | `AW7:AW42` | `AX7:AX42` | `AY7:AY42` | Stricted Pull-ups feet in front  |
| 12 | MONDAY | Quads | Leg Extensions | E12 -> `AM7:AM9` | `AV7:AV42` | `AW7:AW42` | `AX7:AX42` | `AY7:AY42` | Leg Extensions |
| 13 | TUESDAY | Plyo | PLYO | E13 -> `G7:G162` | `AV7:AV42` | `AW7:AW42` | `AX7:AX42` | `AY7:AY42` | SL Depth Drops |
| 14 | TUESDAY | Throwing | Throwing | E14 -> `K7:K87` | `AV7:AV42` | `AW7:AW42` | `AX7:AX42` | `AY7:AY42` | CHOOSE 👇 |
| 15 | TUESDAY | COD | COD | E15 -> `L7:L242` | `AV7:AV42` | `AW7:AW42` | `AX7:AX42` | `AY7:AY42` | CHOOSE 👇 |
| 16 | TUESDAY | Tripple Extension | Tripple Extension | E16 -> `C7:C242` | `AV7:AV42` | `AW7:AW42` | `AX7:AX42` | `AY7:AY42` | CHOOSE 👇 |
| 17 | TUESDAY | Hamstring | Bilateral HD | E17 -> `AN7:AN122` | `AV7:AV42` | `AW7:AW42` | `AX7:AX42` | `AY7:AY42` | CHOOSE 👇 |
| 18 | TUESDAY | Chest | Horizontal Push | E18 -> `AD7:AD162` | `AV7:AV42` | `AW7:AW42` | `AX7:AX42` | `AY7:AY42` | CHOOSE 👇 |
| 19 | TUESDAY | Hamstring/Glutes | Unilateral HD | E19 -> `AQ7:AQ42` | `AV7:AV42` | `AW7:AW42` | `AX7:AX42` | `AY7:AY42` | CHOOSE 👇 |
| 20 | TUESDAY | Chest/Shoulders | Vertical Push | E20 -> `AA7:AA122` | `AV7:AV42` | `AW7:AW42` | `AX7:AX42` | `AY7:AY42` | CHOOSE 👇 |
| 21 | TUESDAY | Hamstrings | Leg Curls | E21 -> `AR7:AR10` | `AV7:AV42` | `AW7:AW42` | `AX7:AX42` | `AY7:AY42` | CHOOSE 👇 |
| 22 | TUESDAY | Shoulders/Traps | ABdution | E22 -> `AH7:AH42` | `AV7:AV42` | `AW7:AW42` | `AX7:AX42` | `AY7:AY42` | CHOOSE 👇 |
| 24 | WEDNESDAY | Calves |  | E24 -> `AU7:AU13` | `AV7:AV42` | `AW7:AW42` | `AX7:AX42` | `AY7:AY42` | CHOOSE 👇 |
| 25 | WEDNESDAY | Aerobic Capacity |  | E25 -> `B7:B122` **TRUNCATED** | `AV7:AV42` | - | `AX7:AX42` | - | CHOOSE 👇 |
| 26 | WEDNESDAY | Core |  | E26 -> `O7:O283` | `AV7:AV42` | `AW7:AW42` | `AX7:AX42` | `AY7:AY42` | CHOOSE 👇 |
| 27 | WEDNESDAY | Focus 1 |  | E27 -> `AZ7:AZ335` | `AV7:AV42` | `AW7:AW42` | `AX7:AX42` | `AY7:AY42` | CHOOSE 👇 |
| 28 | WEDNESDAY | Focus 2 |  | E28 -> `AZ7:AZ335` | `AV7:AV42` | `AW7:AW42` | `AX7:AX42` | `AY7:AY42` | CHOOSE 👇 |
| 30 | (blank merged cell - THURSDAY by position) | Plyo | Plyo | E30 -> `G7:G162` | `AV7:AV42` | `AW7:AW42` | `AX7:AX42` | `AY7:AY42` | CHOOSE 👇 |
| 31 | (blank merged cell - THURSDAY by position) | Plyo | Plyo | E31 -> `G7:G162` | `AV7:AV42` | `AW7:AW42` | `AX7:AX42` | `AY7:AY42` | CHOOSE 👇 |
| 32 | (blank merged cell - THURSDAY by position) | Throwing | Throwing | E32 -> `K7:K87` | `AV7:AV42` | `AW7:AW42` | `AX7:AX42` | `AY7:AY42` | CHOOSE 👇 |
| 33 | (blank merged cell - THURSDAY by position) | COD | COD | E33 -> `L7:L242` | `AV7:AV42` | `AW7:AW42` | `AX7:AX42` | `AY7:AY42` | CHOOSE 👇 |
| 34 | (blank merged cell - THURSDAY by position) | Tripple Extension | Tripple Extension | E34 -> `C7:C242` | `AV7:AV42` | `AW7:AW42` | `AX7:AX42` | `AY7:AY42` | CHOOSE 👇 |
| 35 | (blank merged cell - THURSDAY by position) | Quads | Bilateral KD | E35 -> `AI7:AI122` | `AV7:AV42` | `AW7:AW42` | `AX7:AX42` | `AY7:AY42` | Low Bar Back Squat |
| 36 | (blank merged cell - THURSDAY by position) | Back | Horizontal Pull | E36 -> `X7:X162` | `AV7:AV42` | `AW7:AW42` | `AX7:AX42` | `AY7:AY42` | CHOOSE 👇 |
| 37 | (blank merged cell - THURSDAY by position) | Quads/Glutes | Unilateral KD | E37 -> `AL7:AL42` | `AV7:AV42` | `AW7:AW42` | `AX7:AX42` | `AY7:AY42` | CHOOSE 👇 |
| 38 | (blank merged cell - THURSDAY by position) | Back | Vertical Pull | E38 -> `U7:U122` | `AV7:AV42` | `AW7:AW42` | `AX7:AX42` | `AY7:AY42` | CHOOSE 👇 |
| 39 | (blank merged cell - THURSDAY by position) | Quads | Leg Extensions | E39 -> `AM7:AM9` | `AV7:AV42` | `AW7:AW42` | `AX7:AX42` | `AY7:AY42` | CHOOSE 👇 |
| 40 | FRIDAY | Plyo | PLYO | E40 -> `G7:G162` | `AV7:AV42` | `AW7:AW42` | `AX7:AX42` | `AY7:AY42` | CHOOSE 👇 |
| 41 | FRIDAY | Throwing | Throwing | E41 -> `K7:K87` | `AV7:AV42` | `AW7:AW42` | `AX7:AX42` | `AY7:AY42` | CHOOSE 👇 |
| 42 | FRIDAY | COD | COD | E42 -> `L7:L242` | `AV7:AV42` | `AW7:AW42` | `AX7:AX42` | `AY7:AY42` | CHOOSE 👇 |
| 43 | FRIDAY | Tripple Extension | Tripple Extension | E43 -> `C7:C242` | `AV7:AV42` | `AW7:AW42` | `AX7:AX42` | `AY7:AY42` | CHOOSE 👇 |
| 44 | FRIDAY | Hamstring | Bilateral HD | E44 -> `AN7:AN122` | `AV7:AV42` | `AW7:AW42` | `AX7:AX42` | `AY7:AY42` | CHOOSE 👇 |
| 45 | FRIDAY | Chest | Horizontal Push | E45 -> `AD7:AD162` | `AV7:AV42` | `AW7:AW42` | `AX7:AX42` | `AY7:AY42` | CHOOSE 👇 |
| 46 | FRIDAY | Hamstring/Glutes | Unilateral HD | E46 -> `AQ7:AQ42` | `AV7:AV42` | `AW7:AW42` | `AX7:AX42` | `AY7:AY42` | CHOOSE 👇 |
| 47 | FRIDAY | Chest/Shoulders | Vertical Push | E47 -> `AA7:AA122` | `AV7:AV42` | `AW7:AW42` | `AX7:AX42` | `AY7:AY42` | CHOOSE 👇 |
| 48 | FRIDAY | Hamstrings | Leg Curls | E48 -> `AR7:AR10` | `AV7:AV42` | `AW7:AW42` | `AX7:AX42` | `AY7:AY42` | CHOOSE 👇 |
| 49 | FRIDAY | Shoulders/Traps | ABdution | E49 -> `AH7:AH42` | `AV7:AV42` | `AW7:AW42` | `AX7:AX42` | `AY7:AY42` | CHOOSE 👇 |
| 51 | SATURDAY | Calves |  | E51 -> `AU7:AU13` | `AV7:AV42` | `AW7:AW42` | `AX7:AX42` | `AY7:AY42` | CHOOSE 👇 |
| 52 | SATURDAY | Aerobic Capacity |  | E52 -> `B7:B122` **TRUNCATED** | `AV7:AV42` | - | `AX7:AX42` | - | CHOOSE 👇 |
| 53 | SATURDAY | Core |  | E53 -> `O7:O283` | `AV7:AV42` | `AW7:AW42` | `AX7:AX42` | `AY7:AY42` | CHOOSE 👇 |
| 54 | SATURDAY | Focus 1 |  | E54 -> `AZ7:AZ335` | `AV7:AV42` | `AW7:AW42` | `AX7:AX42` | `AY7:AY42` | CHOOSE 👇 |
| 55 | SATURDAY | Focus 2 |  | E55 -> `AZ7:AZ335` | `AV7:AV42` | `AW7:AW42` | `AX7:AX42` | `AY7:AY42` | CHOOSE 👇 |

#### BOOTCAMP - OPTION 1

| Row | Day | Purpose | Category | EXERCISE cell -> range | SETS | REPS | EFFORT | HOW IT FELT? | Current exercise value |
|---|---|---|---|---|---|---|---|---|---|
| 3 | MONDAY | Quads | Bilateral KD | E3 -> `AI7:AI122` | `AV7:AV42` | `AW7:AW42` | `AX7:AX42` | `AY7:AY42` | CHOOSE 👇 |
| 4 | MONDAY | Back | Horizontal Pull | E4 -> `X7:X162` | `AV7:AV42` | `AW7:AW42` | `AX7:AX42` | `AY7:AY42` | CHOOSE 👇 |
| 5 | MONDAY | Hamstring/Glutes | Unilateral HD | E5 -> `AQ7:AQ42` | `AV7:AV42` | `AW7:AW42` | `AX7:AX42` | `AY7:AY42` | CHOOSE 👇 |
| 6 | MONDAY | Chest/Shoulders | Vertical Push | E6 -> `AA7:AA122` | `AV7:AV42` | `AW7:AW42` | `AX7:AX42` | `AY7:AY42` | CHOOSE 👇 |
| 7 | MONDAY | Bicep | Bicep | E7 -> `AS7:AS42` | `AV7:AV42` | `AW7:AW42` | `AX7:AX42` | `AY7:AY42` | CHOOSE 👇 |
| 8 | MONDAY | Calves | Calves | E8 -> `AU7:AU13` | `AV7:AV42` | `AW7:AW42` | `AX7:AX42` | `AY7:AY42` | CHOOSE 👇 |
| 9 | MONDAY | Quads | Leg Extensions | E9 -> `AM7:AM9` | `AV7:AV42` | `AW7:AW42` | `AX7:AX42` | `AY7:AY42` | CHOOSE 👇 |
| 10 | TUESDAY | Hamstring | Bilateral HD | E10 -> `AN7:AN122` | `AV7:AV42` | `AW7:AW42` | `AX7:AX42` | `AY7:AY42` | CHOOSE 👇 |
| 11 | TUESDAY | Back | Vertical Pull | E11 -> `U7:U122` | `AV7:AV42` | `AW7:AW42` | `AX7:AX42` | `AY7:AY42` | CHOOSE 👇 |
| 12 | TUESDAY | Quads/Glutes | Unilateral KD | E12 -> `AL7:AL42` | `AV7:AV42` | `AW7:AW42` | `AX7:AX42` | `AY7:AY42` | CHOOSE 👇 |
| 13 | TUESDAY | Chest | Horizontal Push | E13 -> `AD7:AD162` | `AV7:AV42` | `AW7:AW42` | `AX7:AX42` | `AY7:AY42` | CHOOSE 👇 |
| 14 | TUESDAY | Hamstrings | Leg Curls | E14 -> `AR7:AR10` | `AV7:AV42` | `AW7:AW42` | `AX7:AX42` | `AY7:AY42` | CHOOSE 👇 |
| 15 | TUESDAY | Tricep |  | E15 -> `AT7:AT42` | `AV7:AV42` | `AW7:AW42` | `AX7:AX42` | `AY7:AY42` | CHOOSE 👇 |
| 16 | TUESDAY | Shoulders/Traps | ABdution | E16 -> `AH7:AH42` | `AV7:AV42` | `AW7:AW42` | `AX7:AX42` | `AY7:AY42` | CHOOSE 👇 |
| 18 | WEDNESDAY | Calves |  | E18 -> `AU7:AU13` | `AV7:AV42` | `AW7:AW42` | `AX7:AX42` | `AY7:AY42` | CHOOSE 👇 |
| 19 | WEDNESDAY | Cardio |  | E19 -> `B7:B122` **TRUNCATED** | `AV7:AV42` | - | `AX7:AX42` | - | CHOOSE 👇 |
| 20 | WEDNESDAY | Core |  | E20 -> `O7:O283` | `AV7:AV42` | `AW7:AW42` | `AX7:AX42` | `AY7:AY42` | CHOOSE 👇 |
| 21 | WEDNESDAY | Focus 1 |  | E21 -> `AZ7:AZ335` | `AV7:AV42` | `AW7:AW42` | `AX7:AX42` | `AY7:AY42` | CHOOSE 👇 |
| 22 | WEDNESDAY | Focus 2 |  | E22 -> `AZ7:AZ335` | `AV7:AV42` | `AW7:AW42` | `AX7:AX42` | `AY7:AY42` | CHOOSE 👇 |
| 24 | THURSDAY | Quads | Bilateral KD | E24 -> `AI7:AI122` | `AV7:AV42` | `AW7:AW42` | `AX7:AX42` | `AY7:AY42` | CHOOSE 👇 |
| 25 | THURSDAY | Back | Horizontal Pull | E25 -> `X7:X162` | `AV7:AV42` | `AW7:AW42` | `AX7:AX42` | `AY7:AY42` | CHOOSE 👇 |
| 26 | THURSDAY | Hamstring/Glutes | Unilateral HD | E26 -> `AQ7:AQ42` | `AV7:AV42` | `AW7:AW42` | `AX7:AX42` | `AY7:AY42` | CHOOSE 👇 |
| 27 | THURSDAY | Chest/Shoulders | Vertical Push | E27 -> `AA7:AA122` | `AV7:AV42` | `AW7:AW42` | `AX7:AX42` | `AY7:AY42` | CHOOSE 👇 |
| 28 | THURSDAY | Bicep | Bicep | E28 -> `AS7:AS42` | `AV7:AV42` | `AW7:AW42` | `AX7:AX42` | `AY7:AY42` | CHOOSE 👇 |
| 29 | THURSDAY | Calves | Calves | E29 -> `AU7:AU13` | `AV7:AV42` | `AW7:AW42` | `AX7:AX42` | `AY7:AY42` | CHOOSE 👇 |
| 30 | THURSDAY | Quads | Leg Extensions | E30 -> `AM7:AM9` | `AV7:AV42` | `AW7:AW42` | `AX7:AX42` | `AY7:AY42` | Leg extensions |
| 31 | FRIDAY | Hamstring | Bilateral HD | E31 -> `AN7:AN122` | `AV7:AV42` | `AW7:AW42` | `AX7:AX42` | `AY7:AY42` | CHOOSE 👇 |
| 32 | FRIDAY | Back | Vertical Pull | E32 -> `U7:U122` | `AV7:AV42` | `AW7:AW42` | `AX7:AX42` | `AY7:AY42` | CHOOSE 👇 |
| 33 | FRIDAY | Quads/Glutes | Unilateral KD | E33 -> `AL7:AL42` | `AV7:AV42` | `AW7:AW42` | `AX7:AX42` | `AY7:AY42` | CHOOSE 👇 |
| 34 | FRIDAY | Chest | Horizontal Push | E34 -> `AD7:AD162` | `AV7:AV42` | `AW7:AW42` | `AX7:AX42` | `AY7:AY42` | CHOOSE 👇 |
| 35 | FRIDAY | Hamstrings | Leg Curls | E35 -> `AR7:AR10` | `AV7:AV42` | `AW7:AW42` | `AX7:AX42` | `AY7:AY42` | CHOOSE 👇 |
| 36 | FRIDAY | Tricep |  | E36 -> `AT7:AT42` | `AV7:AV42` | `AW7:AW42` | `AX7:AX42` | `AY7:AY42` | CHOOSE 👇 |
| 37 | FRIDAY | Shoulders/Traps | ABdution | E37 -> `AH7:AH42` | `AV7:AV42` | `AW7:AW42` | `AX7:AX42` | `AY7:AY42` | CHOOSE 👇 |
| 39 | SATURDAY | Calves |  | E39 -> `AU7:AU13` | `AV7:AV42` | `AW7:AW42` | `AX7:AX42` | `AY7:AY42` | CHOOSE 👇 |
| 40 | SATURDAY | Cardio |  | E40 -> `B7:B122` **TRUNCATED** | `AV7:AV42` | - | `AX7:AX42` | - | CHOOSE 👇 |
| 41 | SATURDAY | Core |  | E41 -> `O7:O283` | `AV7:AV42` | `AW7:AW42` | `AX7:AX42` | `AY7:AY42` | CHOOSE 👇 |
| 42 | SATURDAY | Focus 1 |  | E42 -> `AZ7:AZ335` | `AV7:AV42` | `AW7:AW42` | `AX7:AX42` | `AY7:AY42` | CHOOSE 👇 |
| 43 | SATURDAY | Focus 2 |  | E43 -> `AZ7:AZ335` | `AV7:AV42` | `AW7:AW42` | `AX7:AX42` | `AY7:AY42` | CHOOSE 👇 |

#### BOOTCAMP - OPTION 2

| Row | Day | Purpose | Category | EXERCISE cell -> range | SETS | REPS | EFFORT | HOW IT FELT? | Current exercise value |
|---|---|---|---|---|---|---|---|---|---|
| 3 | 1A | Quads | Bilateral KD | E3 -> `AI7:AI122` | - | - | - | - | CHOOSE 👇 |
| 4 | 1A | Back | Horizontal Pull | E4 -> `X7:X162` | - | - | - | - | CHOOSE 👇 |
| 5 | 1A | Hamstring/Glutes | Unilateral HD | E5 -> `AQ7:AQ42` | - | - | - | - | CHOOSE 👇 |
| 6 | 1A | Core |  | E6 -> `O7:O283` | - | - | - | - | CHOOSE 👇 |
| 7 | 1A | Cardio |  | E7 -> `B7:B335` | - | - | - | - | CHOOSE 👇 |
| 8 | 2A | Hamstring | Bilateral HD | E8 -> `AN7:AN122` | - | - | - | - | CHOOSE 👇 |
| 9 | 2A | Chest | Horizontal Push | E9 -> `AD7:AD162` | - | - | - | - | CHOOSE 👇 |
| 10 | 2A | Bicep | Bicep | E10 -> `AS7:AS42` | - | - | - | - | CHOOSE 👇 |
| 11 | 2A | Chest/Shoulders | Vertical Push | E11 -> `AA7:AA122` | - | - | - | - | CHOOSE 👇 |
| 12 | 2A | Cardio |  | E12 -> `B7:B335` | - | - | - | - | CHOOSE 👇 |
| 13 | 3A | Back | Vertical Pull | E13 -> `U7:U122` | - | - | - | - | CHOOSE 👇 |
| 14 | 3A | Quads/Glutes | Unilateral KD | E14 -> `AL7:AL42` | - | - | - | - | CHOOSE 👇 |
| 15 | 3A | Cardio |  | E15 -> `B7:B122` **TRUNCATED** | - | - | - | - | CHOOSE 👇 |
| 16 | 3A | Tricep | Tricep | E16 -> `AT7:AT42` | - | - | - | - | CHOOSE 👇 |
| 17 | 3A | Shoulders/Traps | ABdution | E17 -> `AH7:AH42` | - | - | - | - | CHOOSE 👇 |
| 18 | 1B | Quads | Bilateral KD | E18 -> `AI7:AI122` | - | - | - | - | CHOOSE 👇 |
| 19 | 1B | Back | Horizontal Pull | E19 -> `X7:X162` | - | - | - | - | CHOOSE 👇 |
| 20 | 1B | Hamstring/Glutes | Unilateral HD | E20 -> `AQ7:AQ42` | - | - | - | - | CHOOSE 👇 |
| 21 | 1B | Core |  | E21 -> `O7:O283` | - | - | - | - | CHOOSE 👇 |
| 22 | 1B | Cardio |  | E22 -> `B7:B335` | - | - | - | - | CHOOSE 👇 |
| 23 | 2B | Hamstring | Bilateral HD | E23 -> `AN7:AN122` | - | - | - | - | CHOOSE 👇 |
| 24 | 2B | Chest | Horizontal Push | E24 -> `AD7:AD162` | - | - | - | - | CHOOSE 👇 |
| 25 | 2B | Bicep | Bicep | E25 -> `AS7:AS42` | - | - | - | - | CHOOSE 👇 |
| 26 | 2B | Chest/Shoulders | Vertical Push | E26 -> `AA7:AA122` | - | - | - | - | CHOOSE 👇 |
| 27 | 2B | Cardio |  | E27 -> `B7:B335` | - | - | - | - | CHOOSE 👇 |
| 28 | 3B | Back | Vertical Pull | E28 -> `U7:U122` | - | - | - | - | CHOOSE 👇 |
| 29 | 3B | Quads/Glutes | Unilateral KD | E29 -> `AL7:AL42` | - | - | - | - | CHOOSE 👇 |
| 30 | 3B | Cardio |  | E30 -> `B7:B122` **TRUNCATED** | - | - | - | - | CHOOSE 👇 |
| 31 | 3B | Tricep | Tricep | E31 -> `AT7:AT42` | - | - | - | - | CHOOSE 👇 |
| 32 | 3B | Shoulders/Traps | ABdution | E32 -> `AH7:AH42` | - | - | - | - | CHOOSE 👇 |

#### NO ACCESS - AESTHETICS - FB - 4 (HIDDEN tab)

| Row | Day | Purpose | Category | EXERCISE cell -> range | SETS | REPS | EFFORT | HOW IT FELT? | Current exercise value |
|---|---|---|---|---|---|---|---|---|---|
| 3 | MONDAY | Calves | Calves | E3 -> `AU7:AU13` | `AV7:AV42` | `AW7:AW42` | `AX7:AX42` | `AY7:AY42` | CHOSE 👇 |
| 4 | MONDAY | Quads | Bilateral KD | E4 -> `AI7:AI122` | `AV7:AV42` | `AW7:AW42` | `AX7:AX42` | `AY7:AY42` | CHOOSE 👇 |
| 5 | MONDAY | Back | Horizontal Pull | E5 -> `X7:X162` | `AV7:AV42` | `AW7:AW42` | `AX7:AX42` | `AY7:AY42` | CHOOSE 👇 |
| 6 | MONDAY | Quads/Glutes | Unilateral KD | E6 -> `AL7:AL42` | `AV7:AV42` | `AW7:AW42` | `AX7:AX42` | `AY7:AY42` | CHOOSE 👇 |
| 7 | MONDAY | Back | Vertical Pull | E7 -> `U7:U122` | `AV7:AV42` | `AW7:AW42` | `AX7:AX42` | `AY7:AY42` | CHOOSE 👇 |
| 8 | MONDAY | Bicep | Bicep | E8 -> `AS7:AS42` | `AV7:AV42` | `AW7:AW42` | `AX7:AX42` | `AY7:AY42` | CHOOSE 👇 |
| 9 | MONDAY | Quads | Leg Extensions | E9 -> `AM7:AM9` | `AV7:AV42` | `AW7:AW42` | `AX7:AX42` | `AY7:AY42` | CHOOSE 👇 |
| 10 | TUESDAY | Hamstring | Bilateral HD | E10 -> `AN7:AN122` | `AV7:AV42` | `AW7:AW42` | `AX7:AX42` | `AY7:AY42` | CHOOSE 👇 |
| 11 | TUESDAY | Chest | Horizontal Push | E11 -> `AD7:AD162` | `AV7:AV42` | `AW7:AW42` | `AX7:AX42` | `AY7:AY42` | CHOSE 👇 |
| 12 | TUESDAY | Hamstring/Glutes | Unilateral HD | E12 -> `AR7:AR42` **MISWIRED** | `AV7:AV42` | `AW7:AW42` | `AX7:AX42` | `AY7:AY42` | CHOSE 👇 |
| 13 | TUESDAY | Chest/Shoulders | Vertical Push | E13 -> `AA7:AA122` | `AV7:AV42` | `AW7:AW42` | `AX7:AX42` | `AY7:AY42` | CHOSE 👇 |
| 14 | TUESDAY | Hamstrings | Leg Curls | E14 -> `AR7:AR10` | `AV7:AV42` | `AW7:AW42` | `AX7:AX42` | `AY7:AY42` | CHOSE 👇 |
| 15 | TUESDAY | Tricep |  | E15 -> `AT7:AT42` | `AV7:AV42` | `AW7:AW42` | `AX7:AX42` | `AY7:AY42` | CHOSE 👇 |
| 16 | TUESDAY | Shoulders/Traps | ABdution | E16 -> `AH7:AH42` | `AV7:AV42` | `AW7:AW42` | `AX7:AX42` | `AY7:AY42` | CHOSE 👇 |
| 18 | WEDNESDAY | Calves |  | E18 -> `AU7:AU13` | `AV7:AV42` | `AW7:AW42` | `AX7:AX42` | `AY7:AY42` | CHOSE 👇 |
| 19 | WEDNESDAY | Cardio |  | E19 -> `B7:B122` **TRUNCATED** | `AV7:AV42` | - | `AX7:AX42` | - | CHOSE 👇 |
| 20 | WEDNESDAY | Core |  | E20 -> `O7:O283` | `AV7:AV42` | `AW7:AW42` | `AX7:AX42` | `AY7:AY42` | CHOSE 👇 |
| 21 | WEDNESDAY | Focus 1 |  | E21 -> `AZ7:AZ335` | `AV7:AV42` | `AW7:AW42` | `AX7:AX42` | `AY7:AY42` | CHOSE 👇 |
| 22 | WEDNESDAY | Focus 2 |  | E22 -> `AZ7:AZ335` | `AV7:AV42` | `AW7:AW42` | `AX7:AX42` | `AY7:AY42` | CHOSE 👇 |
| 24 | THURSDAY | Calves | Calves | E24 -> `AU7:AU13` | `AV7:AV42` | `AW7:AW42` | `AX7:AX42` | `AY7:AY42` | CHOSE 👇 |
| 25 | THURSDAY | Quads | Bilateral KD | E25 -> `AI7:AI122` | `AV7:AV42` | `AW7:AW42` | `AX7:AX42` | `AY7:AY42` | CHOSE 👇 |
| 26 | THURSDAY | Back | Horizontal Pull | E26 -> `X7:X162` | `AV7:AV42` | `AW7:AW42` | `AX7:AX42` | `AY7:AY42` | CHOSE 👇 |
| 27 | THURSDAY | Quads/Glutes | Unilateral KD | E27 -> `AL7:AL42` | `AV7:AV42` | `AW7:AW42` | `AX7:AX42` | `AY7:AY42` | CHOSE 👇 |
| 28 | THURSDAY | Back | Vertical Pull | E28 -> `U7:U122` | `AV7:AV42` | `AW7:AW42` | `AX7:AX42` | `AY7:AY42` | CHOSE 👇 |
| 29 | THURSDAY | Bicep | Bicep | E29 -> `AS7:AS42` | `AV7:AV42` | `AW7:AW42` | `AX7:AX42` | `AY7:AY42` | CHOSE 👇 |
| 30 | THURSDAY | Quads | Leg Extensions | E30 -> `AM7:AM9` | `AV7:AV42` | `AW7:AW42` | `AX7:AX42` | `AY7:AY42` | CHOOSE 👇 |
| 31 | FRIDAY | Hamstring | Bilateral HD | E31 -> `AN7:AN122` | `AV7:AV42` | `AW7:AW42` | `AX7:AX42` | `AY7:AY42` | CHOSE 👇 |
| 32 | FRIDAY | Chest | Horizontal Push | E32 -> `AD7:AD162` | `AV7:AV42` | `AW7:AW42` | `AX7:AX42` | `AY7:AY42` | CHOSE 👇 |
| 33 | FRIDAY | Hamstring/Glutes | Unilateral HD | E33 -> `AR7:AR42` **MISWIRED** | `AV7:AV42` | `AW7:AW42` | `AX7:AX42` | `AY7:AY42` | CHOSE 👇 |
| 34 | FRIDAY | Chest/Shoulders | Vertical Push | E34 -> `AA7:AA122` | `AV7:AV42` | `AW7:AW42` | `AX7:AX42` | `AY7:AY42` | CHOSE 👇 |
| 35 | FRIDAY | Hamstrings | Leg Curls | E35 -> `AR7:AR10` | `AV7:AV42` | `AW7:AW42` | `AX7:AX42` | `AY7:AY42` | CHOSE 👇 |
| 36 | FRIDAY | Tricep |  | E36 -> `AT7:AT42` | `AV7:AV42` | `AW7:AW42` | `AX7:AX42` | `AY7:AY42` | CHOSE 👇 |
| 37 | FRIDAY | Shoulders/Traps | ABdution | E37 -> `AH7:AH42` | `AV7:AV42` | `AW7:AW42` | `AX7:AX42` | `AY7:AY42` | CHOSE 👇 |
| 39 | SATURDAY | Calves |  | E39 -> `AU7:AU13` | `AV7:AV42` | `AW7:AW42` | `AX7:AX42` | `AY7:AY42` | CHOSE 👇 |
| 40 | SATURDAY | Cardio |  | E40 -> `B7:B122` **TRUNCATED** | `AV7:AV42` | - | `AX7:AX42` | - | CHOSE 👇 |
| 41 | SATURDAY | Core |  | E41 -> `O7:O283` | `AV7:AV42` | `AW7:AW42` | `AX7:AX42` | `AY7:AY42` | CHOSE 👇 |
| 42 | SATURDAY | Focus 1 |  | E42 -> `AZ7:AZ335` | `AV7:AV42` | `AW7:AW42` | `AX7:AX42` | `AY7:AY42` | CHOSE 👇 |
| 43 | SATURDAY | Focus 2 |  | E43 -> `AZ7:AZ335` | `AV7:AV42` | `AW7:AW42` | `AX7:AX42` | `AY7:AY42` | CHOSE 👇 |

#### NO ACCESS - ATHLETIC - FB - 4 t (HIDDEN tab)

| Row | Day | Purpose | Category | EXERCISE cell -> range | SETS | REPS | EFFORT | HOW IT FELT? | Current exercise value |
|---|---|---|---|---|---|---|---|---|---|
| 3 | MONDAY | Plyo | Plyo | E3 -> `G7:G162` | `AV7:AV42` | `AW7:AW42` | `AX7:AX42` | `AY7:AY42` | CHOSE 👇 |
| 4 | MONDAY | Plyo | Plyo | E4 -> `G7:G162` | `AV7:AV42` | `AW7:AW42` | `AX7:AX42` | `AY7:AY42` | CHOSE 👇 |
| 5 | MONDAY | Throwing | Throwing | E5 -> `K7:K87` | `AV7:AV42` | `AW7:AW42` | `AX7:AX42` | `AY7:AY42` | CHOSE 👇 |
| 6 | MONDAY | COD | COD | E6 -> `L7:L242` | `AV7:AV42` | `AW7:AW42` | `AX7:AX42` | `AY7:AY42` | CHOSE 👇 |
| 7 | MONDAY | Tripple Extension | Tripple Extension | E7 -> `C7:C242` | `AV7:AV42` | `AW7:AW42` | `AX7:AX42` | `AY7:AY42` | CHOSE 👇 |
| 8 | MONDAY | Quads | Bilateral KD | E8 -> `AI7:AI122` | `AV7:AV42` | `AW7:AW42` | `AX7:AX42` | `AY7:AY42` | CHOSE 👇 |
| 9 | MONDAY | Back | Horizontal Pull | E9 -> `X7:X162` | `AV7:AV42` | `AW7:AW42` | `AX7:AX42` | `AY7:AY42` | CHOSE 👇 |
| 10 | MONDAY | Quads/Glutes | Unilateral KD | E10 -> `AL7:AL42` | `AV7:AV42` | `AW7:AW42` | `AX7:AX42` | `AY7:AY42` | CHOSE 👇 |
| 11 | MONDAY | Back | Vertical Pull | E11 -> `U7:U122` | `AV7:AV42` | `AW7:AW42` | `AX7:AX42` | `AY7:AY42` | CHOSE 👇 |
| 12 | MONDAY | Quads | Leg Extensions | E12 -> `AM7:AM9` | `AV7:AV42` | `AW7:AW42` | `AX7:AX42` | `AY7:AY42` | Leg extensions |
| 13 | TUESDAY | Plyo | PLYO | E13 -> `G7:G162` | `AV7:AV42` | `AW7:AW42` | `AX7:AX42` | `AY7:AY42` | CHOSE 👇 |
| 14 | TUESDAY | Throwing | Throwing | E14 -> `K7:K87` | `AV7:AV42` | `AW7:AW42` | `AX7:AX42` | `AY7:AY42` | CHOSE 👇 |
| 15 | TUESDAY | COD | COD | E15 -> `L7:L242` | `AV7:AV42` | `AW7:AW42` | `AX7:AX42` | `AY7:AY42` | CHOSE 👇 |
| 16 | TUESDAY | Tripple Extension | Tripple Extension | E16 -> `C7:C242` | `AV7:AV42` | `AW7:AW42` | `AX7:AX42` | `AY7:AY42` | CHOSE 👇 |
| 17 | TUESDAY | Hamstring | Bilateral HD | E17 -> `AN7:AN122` | `AV7:AV42` | `AW7:AW42` | `AX7:AX42` | `AY7:AY42` | CHOSE 👇 |
| 18 | TUESDAY | Chest | Horizontal Push | E18 -> `AD7:AD162` | `AV7:AV42` | `AW7:AW42` | `AX7:AX42` | `AY7:AY42` | CHOSE 👇 |
| 19 | TUESDAY | Hamstring/Glutes | Unilateral HD | E19 -> `AR7:AR42` **MISWIRED** | `AV7:AV42` | `AW7:AW42` | `AX7:AX42` | `AY7:AY42` | CHOSE 👇 |
| 20 | TUESDAY | Chest/Shoulders | Vertical Push | E20 -> `AA7:AA122` | `AV7:AV42` | `AW7:AW42` | `AX7:AX42` | `AY7:AY42` | CHOSE 👇 |
| 21 | TUESDAY | Hamstrings | Leg Curls | E21 -> `AR7:AR10` | `AV7:AV42` | `AW7:AW42` | `AX7:AX42` | `AY7:AY42` | CHOSE 👇 |
| 22 | TUESDAY | Shoulders/Traps | ABdution | E22 -> `AH7:AH42` | `AV7:AV42` | `AW7:AW42` | `AX7:AX42` | `AY7:AY42` | CHOSE 👇 |
| 24 | WEDNESDAY | Calves |  | E24 -> `AU7:AU13` | `AV7:AV42` | `AW7:AW42` | `AX7:AX42` | `AY7:AY42` | CHOSE 👇 |
| 25 | WEDNESDAY | Aerobic Capacity |  | E25 -> `B7:B122` **TRUNCATED** | `AV7:AV42` | - | `AX7:AX42` | - | CHOSE 👇 |
| 26 | WEDNESDAY | Core |  | E26 -> `O7:O283` | `AV7:AV42` | `AW7:AW42` | `AX7:AX42` | `AY7:AY42` | CHOSE 👇 |
| 27 | WEDNESDAY | Focus 1 |  | E27 -> `AZ7:AZ335` | `AV7:AV42` | `AW7:AW42` | `AX7:AX42` | `AY7:AY42` | CHOSE 👇 |
| 28 | WEDNESDAY | Focus 2 |  | E28 -> `AZ7:AZ335` | `AV7:AV42` | `AW7:AW42` | `AX7:AX42` | `AY7:AY42` | CHOSE 👇 |
| 30 | THURSDAY | Plyo | Plyo | E30 -> `G7:G162` | `AV7:AV42` | `AW7:AW42` | `AX7:AX42` | `AY7:AY42` | CHOSE 👇 |
| 31 | THURSDAY | Plyo | Plyo | E31 -> `G7:G162` | `AV7:AV42` | `AW7:AW42` | `AX7:AX42` | `AY7:AY42` | CHOSE 👇 |
| 32 | THURSDAY | Throwing | Throwing | E32 -> `K7:K87` | `AV7:AV42` | `AW7:AW42` | `AX7:AX42` | `AY7:AY42` | CHOSE 👇 |
| 33 | THURSDAY | COD | COD | E33 -> `L7:L242` | `AV7:AV42` | `AW7:AW42` | `AX7:AX42` | `AY7:AY42` | CHOSE 👇 |
| 34 | THURSDAY | Tripple Extension | Tripple Extension | E34 -> `C7:C242` | `AV7:AV42` | `AW7:AW42` | `AX7:AX42` | `AY7:AY42` | CHOSE 👇 |
| 35 | THURSDAY | Quads | Bilateral KD | E35 -> `AI7:AI122` | `AV7:AV42` | `AW7:AW42` | `AX7:AX42` | `AY7:AY42` | CHOSE 👇 |
| 36 | THURSDAY | Back | Horizontal Pull | E36 -> `X7:X162` | `AV7:AV42` | `AW7:AW42` | `AX7:AX42` | `AY7:AY42` | CHOSE 👇 |
| 37 | THURSDAY | Quads/Glutes | Unilateral KD | E37 -> `AL7:AL42` | `AV7:AV42` | `AW7:AW42` | `AX7:AX42` | `AY7:AY42` | CHOSE 👇 |
| 38 | THURSDAY | Back | Vertical Pull | E38 -> `U7:U122` | `AV7:AV42` | `AW7:AW42` | `AX7:AX42` | `AY7:AY42` | CHOSE 👇 |
| 39 | THURSDAY | Quads | Leg Extensions | E39 -> `AM7:AM9` | `AV7:AV42` | `AW7:AW42` | `AX7:AX42` | `AY7:AY42` | Leg extensions |
| 40 | FRIDAY | Plyo | PLYO | E40 -> `G7:G162` | `AV7:AV42` | `AW7:AW42` | `AX7:AX42` | `AY7:AY42` | CHOSE 👇 |
| 41 | FRIDAY | Throwing | Throwing | E41 -> `K7:K87` | `AV7:AV42` | `AW7:AW42` | `AX7:AX42` | `AY7:AY42` | CHOSE 👇 |
| 42 | FRIDAY | COD | COD | E42 -> `L7:L242` | `AV7:AV42` | `AW7:AW42` | `AX7:AX42` | `AY7:AY42` | CHOSE 👇 |
| 43 | FRIDAY | Tripple Extension | Tripple Extension | E43 -> `C7:C242` | `AV7:AV42` | `AW7:AW42` | `AX7:AX42` | `AY7:AY42` | CHOSE 👇 |
| 44 | FRIDAY | Hamstring | Bilateral HD | E44 -> `AN7:AN122` | `AV7:AV42` | `AW7:AW42` | `AX7:AX42` | `AY7:AY42` | CHOSE 👇 |
| 45 | FRIDAY | Chest | Horizontal Push | E45 -> `AD7:AD162` | `AV7:AV42` | `AW7:AW42` | `AX7:AX42` | `AY7:AY42` | CHOSE 👇 |
| 46 | FRIDAY | Hamstring/Glutes | Unilateral HD | E46 -> `AR7:AR42` **MISWIRED** | `AV7:AV42` | `AW7:AW42` | `AX7:AX42` | `AY7:AY42` | CHOSE 👇 |
| 47 | FRIDAY | Chest/Shoulders | Vertical Push | E47 -> `AA7:AA122` | `AV7:AV42` | `AW7:AW42` | `AX7:AX42` | `AY7:AY42` | CHOSE 👇 |
| 48 | FRIDAY | Hamstrings | Leg Curls | E48 -> `AR7:AR10` | `AV7:AV42` | `AW7:AW42` | `AX7:AX42` | `AY7:AY42` | CHOSE 👇 |
| 49 | FRIDAY | Shoulders/Traps | ABdution | E49 -> `AH7:AH42` | `AV7:AV42` | `AW7:AW42` | `AX7:AX42` | `AY7:AY42` | CHOSE 👇 |
| 51 | SATURDAY | Calves |  | E51 -> `AU7:AU13` | `AV7:AV42` | `AW7:AW42` | `AX7:AX42` | `AY7:AY42` | CHOSE 👇 |
| 52 | SATURDAY | Aerobic Capacity |  | E52 -> `B7:B122` **TRUNCATED** | `AV7:AV42` | - | `AX7:AX42` | - | CHOSE 👇 |
| 53 | SATURDAY | Core |  | E53 -> `O7:O283` | `AV7:AV42` | `AW7:AW42` | `AX7:AX42` | `AY7:AY42` | CHOSE 👇 |
| 54 | SATURDAY | Focus 1 |  | E54 -> `AZ7:AZ335` | `AV7:AV42` | `AW7:AW42` | `AX7:AX42` | `AY7:AY42` | CHOSE 👇 |
| 55 | SATURDAY | Focus 2 |  | E55 -> `AZ7:AZ335` | `AV7:AV42` | `AW7:AW42` | `AX7:AX42` | `AY7:AY42` | CHOSE 👇 |