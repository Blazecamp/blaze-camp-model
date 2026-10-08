# BYOP athletic program tabs: deep decode

Workbook: **"BUILD YOUR OWN PROGRAM - BLAZE CAMP MODEL"** (BYOP). Tabs decoded:

| Dump file | Real tab name (xlsx, 31-char limit) | Title cell A1 | Visibility |
|---|---|---|---|
| `03_ATHLETIC_FULL_BODY_4_DAYS_A` | 'ATHLETIC - FULL BODY - 4 DAYS A' | 'ATHLETIC - FULL BODY - 4 DAYS A WEEK' | visible |
| `04_JUSTICE_LEAGUE` | 'JUSTICE LEAGUE' | 'ATHLETIC - FULL BODY - 4 DAYS A WEEK' (unchanged from the template) | visible |
| `08_NO_ACCESS_ATHLETIC_FB_4_t` | 'NO ACCESS - ATHLETIC - FB - 4 t' | 'ATHLETIC - FULL BODY - 4 to 6 DAYS A WEEK' | **hidden** |

Sources: the dumps in `dumps/BYOP/`, cross-checked cell by cell against `raw/BYOP.xlsx` with openpyxl (values, fills, merges, data validations, conditional formatting, sheet state). Read-only: no Google Sheet was touched. Library resolution uses `09_MASTER_EXERCISE_LIBRARY.columns.txt`. Companion data: `prog_byop_athletic.volume.json` (same folder).

Conventions:
- **OBSERVED** = read directly from the sheet. *INFERRED* = my interpretation (always flagged).
- Coach labels are quoted verbatim with their typos ('Tripple Extension', 'ABdution', 'Stricted', 'CHOSE 👇', 'DOMNANT', 'INTERMIDIATE'). My canonical names use correct spelling (triple extension, abduction).
- Both tab names that end in 'A' / 't' are cut at Excel's 31-character sheet-name limit during export (*inferred*: 'ATHLETIC - FULL BODY - 4 DAYS A[ WEEK]', 'NO ACCESS - ATHLETIC - FB - 4 t[o 6 DAYS ...]').

---

## 0. How the three tabs relate (lineage), OBSERVED

All three tabs share **one slot skeleton**: same rows, same PURPOSE/CATEGORY labels, same row colours, and (with two exceptions) the same dropdown wiring. Differences found by a full cell/validation diff:

| Feature | ATHLETIC (03) | JUSTICE LEAGUE (04) | NO ACCESS ATHLETIC (08) |
|---|---|---|---|
| Columns | A WEEK, B DAY, C PURPOSE, D CATEGORY, E EXERCISE, F SETS, G REPS | + H 'WEIGHT USED or SCORE', I 'EFFORT', J 'HOW IT FELT?', K 'DONE?' | same as JUSTICE LEAGUE |
| Placeholder text | 'CHOOSE 👇' | 'CHOOSE 👇' | 'CHOSE 👇' (typo; 244 cells, every one invalid against its own dropdown) |
| Thursday DAY cell B30 | a single space `' '` (looks blank) | `' '` | 'THURSDAY' |
| Title | '... 4 DAYS A WEEK' | '... 4 DAYS A WEEK' | '... 4 to 6 DAYS A WEEK' |
| Pre-filled values | only G12 'MYO SET' (Monday leg-extension reps) | G12 'MYO SET' + the coach's picks (Monday x10, Tuesday plyo, Thursday squat) + notes H6/H9/H12 | E12 and E39 'Leg extensions' (lower-case e: not an exact list value; list item is 'Leg Extensions'); no 'MYO SET' |
| 'Unilateral HD' slots E19/E46 | `AQ7:AQ42` UNILATERAL HIP DOMINANT | `AQ7:AQ42` | **`AR7:AR42` LEG CURLS (miswired)** |
| EFFORT / HOW IT FELT? dropdowns | none | `AX7:AX42` / `AY7:AY42` | same |
| DONE? | none | one checkbox per day (K3:K12, K13:K22, K23:K29, K30:K39, K40:K49, K50:K56 merged), all FALSE | same |
| Conditional formats | leftover rule: cell text 'TRUE' -> green 57BB8A on B3:D12, B30:D39, E3:E16, E30:E43, F3:G12, F30:G39 (nothing matches) | DONE? FALSE -> theme accent colour 5 (red in the default Google theme), TRUE -> green 57BB8A; **H 'WEIGHT USED or SCORE' blank -> red EA9999, filled -> green B6D7A8** (H25/H52 aerobic rows excluded) | same as JUSTICE LEAGUE |
| Saturday EXERCISE fills E50:E56 | F3F3F3 | F3F3F3 | FCE5CD |

*INFERRED lineage*: the ATHLETIC template is the 4-day **AESTHETICS** full-body skeleton with an athletic block prepended. Evidence: the resistance EXERCISE cells on the Monday/Thursday blocks (E8:E12, E35:E39) carry the same off-grey fill F3F3F3 that the AESTHETICS tab uses on its Day 1 exercise cells (D4:D9), while the athletic cells above them are EFEFEF; the resistance slot order is identical to AESTHETICS Day 1/Day 2 minus 'Calves', 'Bicep' and 'Tricep'. JUSTICE LEAGUE = ATHLETIC + tracking columns + a real client's choices. NO ACCESS = a separately rebuilt tracking copy (different column widths G 15.0 vs 18.63, J 15.75 vs 19.38; 'CHOSE' typo; THURSDAY label; miswire).

---

## Shared slot skeleton and canonical mapping (applies to all three tabs)

PURPOSE = what the slot is for (muscle or athletic quality); CATEGORY = movement pattern / library list. On the athletic rows PURPOSE and CATEGORY are the same word ('Plyo', 'Throwing', 'COD', 'Tripple Extension'); on resistance rows PURPOSE is the muscle and CATEGORY the pattern (OBSERVED). *INFERRED*: athletic slots are defined by **quality**, resistance slots by **muscle x pattern**.

| Slot (PURPOSE / CATEGORY, verbatim) | Library column (OBSERVED wiring) | Canonical bucket | Default muscle credit used for counting (1.0 prime / 0.5 synergist) |
|---|---|---|---|
| 'Plyo' / 'Plyo' or 'PLYO' | G 'PLYOS' (`G7:G162`) | AP_PLYO (exercise may resolve to AP_JUMP_LIMITED_KNEE for ankle/plate hops, AP_SPRINT for ' Max velocity running (top speed)') | quads 1.0, glutes 0.5, calves 0.5 |
| 'Throwing' / 'Throwing' | K 'THROWING' (`K7:K87`) | AP_THROW | abs/obliques 1.0 (exercise-specific extras, e.g. overhead throw +lats 0.5 +triceps 0.5) |
| 'COD' / 'COD' | L 'CHANGE OF DIRECTION' (`L7:L242`) | AP_COD | quads 1.0, glutes 0.5 |
| 'Tripple Extension' / 'Tripple Extension' | C 'TRIPPLE EXTENSION' (`C7:C242`) | AP_TRIPLE_EXT (Olympic lifts at ADVANCED; the 'EASY' block C124+ is ankle hops = AP_JUMP_LIMITED_KNEE) | glutes 1.0, quads 0.5, hamstrings 0.5, calves 0.5, lats/upper back (traps) 0.5 |
| 'Quads' / 'Bilateral KD' | AI 'BILATERAL KNEE DOMINANT' | RP_BKD | quads 1.0, glutes 0.5 |
| 'Back' / 'Horizontal Pull' | X 'HORIZONTAL PULL' | RP_HPULL | lats/upper back 1.0, rear delts 0.5, biceps 0.5 |
| 'Quads/Glutes' / 'Unilateral KD' | AL 'UNILATERAL KNEE DOMINANT' | RP_UKD | quads 1.0, glutes 1.0 (both named in the coach's PURPOSE) |
| 'Back ' / 'Vertical Pull' | U 'VERTICAL PULL' | RP_VPULL | lats/upper back 1.0, biceps 0.5 |
| 'Quads' / 'Leg Extensions' | AM 'LEG EXTENSIONS' | ISO_QUAD | quads 1.0 |
| 'Hamstring' / 'Bilateral HD' | AN 'BILATERAL HIP DOMNANT' (library PURPOSE 'GLUTES/HAMSTRINGS') | RP_BHD | hamstrings 1.0, glutes 1.0 |
| 'Chest' / 'Horizontal Push' | AD 'HORIZONTAL PUSH' (library PURPOSE 'CHEST/FRONT DELTS') | RP_HPUSH (flies inside the MODERATE block would be ISO_CHEST) | chest 1.0, front delts 1.0, triceps 0.5 |
| 'Hamstring/Glutes' / 'Unilateral HD' | AQ 'UNILATERAL HIP DOMINANT' (AR in NO ACCESS) | RP_UHD | hamstrings 1.0, glutes 1.0 |
| 'Chest/Shoulders' / 'Vertical Push' | AA 'VERTICAL PUSH' (library PURPOSE 'SHOULDERS/TRAPS') | RP_VPUSH | front delts 1.0, chest 0.5 (list mixes incline presses and overhead presses), side delts 0.5, triceps 0.5 |
| 'Hamstrings' / 'Leg Curls' | AR 'LEG CURLS' | ISO_HAM | hamstrings 1.0 |
| 'Shoulders/Traps' / 'ABdution' | AH 'SIDE RAISES' | ISO_SIDE_REAR_DELT | side delts 1.0 (rear delts 1.0 instead if a reverse fly is picked) |
| 'Calves' / (no CATEGORY) | AU 'CALVES' | ISO_CALF | calves 1.0 |
| 'Aerobic Capacity' / (no CATEGORY) | B 'CARDIO' (`B7:B122`, truncated) | COND_AEROBIC | not counted as sets (bouts) |
| 'Core' / (no CATEGORY) | O 'CORE THORAX' + CORE PELVIS block (`O7:O283`) | CT_CORE_THORAX or CP_CORE_PELVIS (client's pick) | abs/obliques 1.0 |
| 'Focus 1', 'Focus 2' / (no CATEGORY) | AZ 'FULL FOCUS LIST' ('MUSCLE FOCUS OPTIONS') | FOCUS | whatever muscle the client picks (tracked as unassigned "focus flex") |

Canonical buckets with **no slot at all** in these tabs (OBSERVED): AP_SPRINT (only reachable as one item inside the Plyo ADVANCED list), ISO_CHEST (only reachable as flies inside the Horizontal Push MODERATE list), ISO_BICEP, ISO_TRICEP, CORE_OTHER, COND_SPRINT_BUYOUT, FUNCTIONAL (CARRY / DRAGS / FUNCTIONAL BIOMECHANICS SYSTEM are not wired anywhere).

Counting convention for every volume number below: 1 working set = 1.0 to each prime mover and 0.5 to each clear synergist per the table above. **Athletic (AP_*) sets are reported separately as "athletic exposure" and are not added to hypertrophy volume** (*INFERRED* rationale: the coach's 15-20 sets/muscle/week language is about resistance sets taken near failure; jumps, throws, cuts and cleans are low-fatigue, high-intent reps). Totals including them are in the JSON (`by_muscle_total` in the raw computation, and `athletic_exposure_sets`).

---

# A. ATHLETIC - FULL BODY - 4 DAYS A (template)

## A1. Identity

- **Tab**: 'ATHLETIC - FULL BODY - 4 DAYS A'; **title** A1 (merged A1:G1, red fill EA9999, bold) 'ATHLETIC - FULL BODY - 4 DAYS A WEEK'.
- **Intended population / goal** (*INFERRED from OBSERVED slots*): athletes who need speed/power qualities on top of full-body strength and muscle. Every training day opens with four or five athletic slots ('Plyo', 'Throwing', 'COD', 'Tripple Extension') and finishes with full-body resistance work. The COD dropdown is built from American-football receiver routes ('FADE', 'SLANT', 'POST/CORNER', 'FLAT', 'DIG/OUT', 'COMEBACK/CURL') plus 'Shuffles', 'LEFT TEST' and a date-mangled '5-10-5', so the template's origin is field/court sport. Nothing in the tab names a sport, so it is a generic athlete template that is tuned by which exercises and levels are picked.
- **Level**: not fixed. Every slot exposes its library list with the level separators inside the dropdown (FOUNDATIONAL / MODERATE / ADVANCED / UNILATERAL / EASY), so the **level is chosen slot by slot**, not once for the athlete.
- **Days per week**: 4 main training days (MONDAY, TUESDAY, THURSDAY, FRIDAY) + 2 optional accessory/conditioning days (WEDNESDAY, SATURDAY) + SUNDAY 'OFF'. The title says 4; the NO ACCESS copy's title ('4 to 6 DAYS') confirms that Wednesday/Saturday are optional extras.
- **Weeks**: only 'WEEK 1' exists (A3, A13, A23, A30, A40, A50, A57; light-blue CFE2F3). Merged cell A64:A70 below Sunday is empty (*INFERRED*: start of an unbuilt week-2 block).
- **Equipment assumed** (from the dropdown contents): barbell + rack (Olympic lifts, squats, deadlifts), cable stack, leg-extension and leg-curl machines (the Leg Extensions slot has a single option 'Leg Extensions'; Leg Curls has 'Seated leg curls' / 'Lying Leg Curls'), dumbbells/kettlebells, med balls (all throws), plates, hurdles and boxes (plyos), open running space (COD, cardio).
- **Format**: build-your-own. Every EXERCISE, SETS and REPS cell is a dropdown pre-filled with 'CHOOSE 👇'; the only pre-set value is G12 'MYO SET'.

Day colour code (OBSERVED fills on B:G of each block): MONDAY and THURSDAY EFEFEF (light grey), TUESDAY and FRIDAY CCCCCC (mid grey), WEDNESDAY and SATURDAY FCE5CD (peach), SUNDAY F4CCCC (pink, 'OFF'). *INFERRED*: grey shade = A day vs B day; peach = optional day; pink = rest.

## A2. Full session-by-session table

"Part" is *INFERRED*: the sheet has no section labels, but on A days the colour of the EXERCISE cell changes exactly at the athletic/resistance boundary (EFEFEF -> F3F3F3). Library levels in [brackets] are where the chosen item sits in the stacked library column.

| Day | # | Part (inferred) | PURPOSE / CATEGORY (verbatim) | Canonical bucket | Library dropdown (OBSERVED wiring) | Exercise (cell) | Sets | Reps | Effort | Notes |
|---|---|---|---|---|---|---|---|---|---|---|
| MONDAY | 1 | Athletic (speed/power) block | 'Plyo' / 'Plyo' | AP_PLYO | `G7:G162` PLYOS: FOUNDATIONAL / MODERATE (plate hops) / MODERATE (hurdle hops) / ADVANCED; 41 options | 'CHOOSE 👇' (E3) | unset 'CHOOSE 👇' | unset 'CHOOSE 👇' | no column |  |
| MONDAY | 2 | Athletic (speed/power) block | 'Plyo' / 'Plyo' | AP_PLYO | `G7:G162` PLYOS: FOUNDATIONAL / MODERATE (plate hops) / MODERATE (hurdle hops) / ADVANCED; 41 options | 'CHOOSE 👇' (E4) | unset 'CHOOSE 👇' | unset 'CHOOSE 👇' | no column |  |
| MONDAY | 3 | Athletic (speed/power) block | 'Throwing' / 'Throwing' | AP_THROW | `K7:K87` THROWING: one list, no levels; 20 options | 'CHOOSE 👇' (E5) | unset 'CHOOSE 👇' | unset 'CHOOSE 👇' | no column |  |
| MONDAY | 4 | Athletic (speed/power) block | 'COD' / 'COD' | AP_COD | `L7:L242` CHANGE OF DIRECTION: FOUNDATIONAL 'EASY TURN' / MODERATE 'MOD. TURN' / ADVANCED 'HARD TURN'; 9 options | 'CHOOSE 👇' (E6) | unset 'CHOOSE 👇' | unset 'CHOOSE 👇' | no column |  |
| MONDAY | 5 | Athletic (speed/power) block | 'Tripple Extension' / 'Tripple Extension' | AP_TRIPLE_EXT | `C7:C242` TRIPPLE EXTENSION: FOUNDATIONAL / MODERATE / ADVANCED (Olympic) / EASY (jumping ankle); 33 options | 'CHOOSE 👇' (E7) | unset 'CHOOSE 👇' | unset 'CHOOSE 👇' | no column |  |
| MONDAY | 6 | Resistance block | 'Quads' / 'Bilateral KD' | RP_BKD | `AI7:AI122` BILATERAL KNEE DOMINANT: FOUNDATIONAL / MODERATE / ADVANCED; 35 | 'CHOOSE 👇' (E8) | unset 'CHOOSE 👇' | unset 'CHOOSE 👇' | no column |  |
| MONDAY | 7 | Resistance block | 'Back' / 'Horizontal Pull' | RP_HPULL | `X7:X162` HORIZONTAL PULL: FOUNDATIONAL / ADVANCED / UNILATERAL; 16 | 'CHOOSE 👇' (E9) | unset 'CHOOSE 👇' | unset 'CHOOSE 👇' | no column |  |
| MONDAY | 8 | Resistance block | 'Quads/Glutes' / 'Unilateral KD' | RP_UKD | `AL7:AL42` UNILATERAL KNEE DOMINANT: one list; 13 | 'CHOOSE 👇' (E10) | unset 'CHOOSE 👇' | unset 'CHOOSE 👇' | no column |  |
| MONDAY | 9 | Resistance block | 'Back ' / 'Vertical Pull' | RP_VPULL | `U7:U122` VERTICAL PULL: FOUNDATIONAL / ADVANCED / UNILATERAL; 20 | 'CHOOSE 👇' (E11) | unset 'CHOOSE 👇' | unset 'CHOOSE 👇' | no column |  |
| MONDAY | 10 | Resistance block | 'Quads' / 'Leg Extensions' | ISO_QUAD | `AM7:AM9` LEG EXTENSIONS: 1 option | 'CHOOSE 👇' (E12) | unset 'CHOOSE 👇' | 'MYO SET' | no column |  |
| TUESDAY | 1 | Athletic (speed/power) block | 'Plyo' / 'PLYO' | AP_PLYO | `G7:G162` PLYOS: FOUNDATIONAL / MODERATE (plate hops) / MODERATE (hurdle hops) / ADVANCED; 41 options | 'CHOOSE 👇' (E13) | unset 'CHOOSE 👇' | unset 'CHOOSE 👇' | no column |  |
| TUESDAY | 2 | Athletic (speed/power) block | 'Throwing' / 'Throwing' | AP_THROW | `K7:K87` THROWING: one list, no levels; 20 options | 'CHOOSE 👇' (E14) | unset 'CHOOSE 👇' | unset 'CHOOSE 👇' | no column |  |
| TUESDAY | 3 | Athletic (speed/power) block | 'COD' / 'COD' | AP_COD | `L7:L242` CHANGE OF DIRECTION: FOUNDATIONAL 'EASY TURN' / MODERATE 'MOD. TURN' / ADVANCED 'HARD TURN'; 9 options | 'CHOOSE 👇' (E15) | unset 'CHOOSE 👇' | unset 'CHOOSE 👇' | no column |  |
| TUESDAY | 4 | Athletic (speed/power) block | 'Tripple Extension' / 'Tripple Extension' | AP_TRIPLE_EXT | `C7:C242` TRIPPLE EXTENSION: FOUNDATIONAL / MODERATE / ADVANCED (Olympic) / EASY (jumping ankle); 33 options | 'CHOOSE 👇' (E16) | unset 'CHOOSE 👇' | unset 'CHOOSE 👇' | no column |  |
| TUESDAY | 5 | Resistance block | 'Hamstring' / 'Bilateral HD' | RP_BHD | `AN7:AN122` BILATERAL HIP DOMNANT: FOUNDATIONAL / MODERATE / ADVANCED; 33 | 'CHOOSE 👇' (E17) | unset 'CHOOSE 👇' | unset 'CHOOSE 👇' | no column |  |
| TUESDAY | 6 | Resistance block | 'Chest' / 'Horizontal Push' | RP_HPUSH | `AD7:AD162` HORIZONTAL PUSH: FOUNDATIONAL / MODERATE / ADVANCED / UNILATERAL; 25 | 'CHOOSE 👇' (E18) | unset 'CHOOSE 👇' | unset 'CHOOSE 👇' | no column |  |
| TUESDAY | 7 | Resistance block | 'Hamstring/Glutes' / 'Unilateral HD' | RP_UHD | `AQ7:AQ42` UNILATERAL HIP DOMINANT: FOUNDATIONAL only; 8 | 'CHOOSE 👇' (E19) | unset 'CHOOSE 👇' | unset 'CHOOSE 👇' | no column |  |
| TUESDAY | 8 | Resistance block | 'Chest/Shoulders' / 'Vertical Push' | RP_VPUSH | `AA7:AA122` VERTICAL PUSH: FOUNDATIONAL / ADVANCED / UNILATERAL; 20 | 'CHOOSE 👇' (E20) | unset 'CHOOSE 👇' | unset 'CHOOSE 👇' | no column |  |
| TUESDAY | 9 | Resistance block | 'Hamstrings' / 'Leg Curls' | ISO_HAM | `AR7:AR10` LEG CURLS: 2 options | 'CHOOSE 👇' (E21) | unset 'CHOOSE 👇' | unset 'CHOOSE 👇' | no column |  |
| TUESDAY | 10 | Resistance block | 'Shoulders/Traps' / 'ABdution' | ISO_SIDE_REAR_DELT | `AH7:AH42` SIDE RAISES: one list; 12 | 'CHOOSE 👇' (E22) | unset 'CHOOSE 👇' | unset 'CHOOSE 👇' | no column |  |
| WEDNESDAY | 1 | Optional accessory / conditioning day | 'Calves' / (no CATEGORY) | ISO_CALF | `AU7:AU13` CALVES: 5 | 'CHOOSE 👇' (E24) | unset 'CHOOSE 👇' | unset 'CHOOSE 👇' | no column |  |
| WEDNESDAY | 2 | Optional accessory / conditioning day | 'Aerobic Capacity' / (no CATEGORY) | COND_AEROBIC | `B7:B122` CARDIO (truncated: DISTANCE + CALORIES blocks unreachable); 29 options | 'CHOOSE 👇' (E25) | unset 'CHOOSE 👇' | no REPS dropdown | no column |  |
| WEDNESDAY | 3 | Optional accessory / conditioning day | 'Core' / (no CATEGORY) | CORE_CT_or_CP | `O7:O283` CORE THORAX + CORE PELVIS; 17 | 'CHOOSE 👇' (E26) | unset 'CHOOSE 👇' | unset 'CHOOSE 👇' | no column |  |
| WEDNESDAY | 4 | Optional accessory / conditioning day | 'Focus 1' / (no CATEGORY) | FOCUS | `AZ7:AZ335` FULL FOCUS LIST: 10 muscle groups; 51 | 'CHOOSE 👇' (E27) | unset 'CHOOSE 👇' | unset 'CHOOSE 👇' | no column |  |
| WEDNESDAY | 5 | Optional accessory / conditioning day | 'Focus 2' / (no CATEGORY) | FOCUS | `AZ7:AZ335` FULL FOCUS LIST: 10 muscle groups; 51 | 'CHOOSE 👇' (E28) | unset 'CHOOSE 👇' | unset 'CHOOSE 👇' | no column |  |
| THURSDAY (cell B30 = ' ') | 1 | Athletic (speed/power) block | 'Plyo' / 'Plyo' | AP_PLYO | `G7:G162` PLYOS: FOUNDATIONAL / MODERATE (plate hops) / MODERATE (hurdle hops) / ADVANCED; 41 options | 'CHOOSE 👇' (E30) | unset 'CHOOSE 👇' | unset 'CHOOSE 👇' | no column |  |
| THURSDAY (cell B30 = ' ') | 2 | Athletic (speed/power) block | 'Plyo' / 'Plyo' | AP_PLYO | `G7:G162` PLYOS: FOUNDATIONAL / MODERATE (plate hops) / MODERATE (hurdle hops) / ADVANCED; 41 options | 'CHOOSE 👇' (E31) | unset 'CHOOSE 👇' | unset 'CHOOSE 👇' | no column |  |
| THURSDAY (cell B30 = ' ') | 3 | Athletic (speed/power) block | 'Throwing' / 'Throwing' | AP_THROW | `K7:K87` THROWING: one list, no levels; 20 options | 'CHOOSE 👇' (E32) | unset 'CHOOSE 👇' | unset 'CHOOSE 👇' | no column |  |
| THURSDAY (cell B30 = ' ') | 4 | Athletic (speed/power) block | 'COD' / 'COD' | AP_COD | `L7:L242` CHANGE OF DIRECTION: FOUNDATIONAL 'EASY TURN' / MODERATE 'MOD. TURN' / ADVANCED 'HARD TURN'; 9 options | 'CHOOSE 👇' (E33) | unset 'CHOOSE 👇' | unset 'CHOOSE 👇' | no column |  |
| THURSDAY (cell B30 = ' ') | 5 | Athletic (speed/power) block | 'Tripple Extension' / 'Tripple Extension' | AP_TRIPLE_EXT | `C7:C242` TRIPPLE EXTENSION: FOUNDATIONAL / MODERATE / ADVANCED (Olympic) / EASY (jumping ankle); 33 options | 'CHOOSE 👇' (E34) | unset 'CHOOSE 👇' | unset 'CHOOSE 👇' | no column |  |
| THURSDAY (cell B30 = ' ') | 6 | Resistance block | 'Quads' / 'Bilateral KD' | RP_BKD | `AI7:AI122` BILATERAL KNEE DOMINANT: FOUNDATIONAL / MODERATE / ADVANCED; 35 | 'CHOOSE 👇' (E35) | unset 'CHOOSE 👇' | unset 'CHOOSE 👇' | no column |  |
| THURSDAY (cell B30 = ' ') | 7 | Resistance block | 'Back' / 'Horizontal Pull' | RP_HPULL | `X7:X162` HORIZONTAL PULL: FOUNDATIONAL / ADVANCED / UNILATERAL; 16 | 'CHOOSE 👇' (E36) | unset 'CHOOSE 👇' | unset 'CHOOSE 👇' | no column |  |
| THURSDAY (cell B30 = ' ') | 8 | Resistance block | 'Quads/Glutes' / 'Unilateral KD' | RP_UKD | `AL7:AL42` UNILATERAL KNEE DOMINANT: one list; 13 | 'CHOOSE 👇' (E37) | unset 'CHOOSE 👇' | unset 'CHOOSE 👇' | no column |  |
| THURSDAY (cell B30 = ' ') | 9 | Resistance block | 'Back ' / 'Vertical Pull' | RP_VPULL | `U7:U122` VERTICAL PULL: FOUNDATIONAL / ADVANCED / UNILATERAL; 20 | 'CHOOSE 👇' (E38) | unset 'CHOOSE 👇' | unset 'CHOOSE 👇' | no column |  |
| THURSDAY (cell B30 = ' ') | 10 | Resistance block | 'Quads' / 'Leg Extensions' | ISO_QUAD | `AM7:AM9` LEG EXTENSIONS: 1 option | 'CHOOSE 👇' (E39) | unset 'CHOOSE 👇' | unset 'CHOOSE 👇' | no column |  |
| FRIDAY | 1 | Athletic (speed/power) block | 'Plyo' / 'PLYO' | AP_PLYO | `G7:G162` PLYOS: FOUNDATIONAL / MODERATE (plate hops) / MODERATE (hurdle hops) / ADVANCED; 41 options | 'CHOOSE 👇' (E40) | unset 'CHOOSE 👇' | unset 'CHOOSE 👇' | no column |  |
| FRIDAY | 2 | Athletic (speed/power) block | 'Throwing' / 'Throwing' | AP_THROW | `K7:K87` THROWING: one list, no levels; 20 options | 'CHOOSE 👇' (E41) | unset 'CHOOSE 👇' | unset 'CHOOSE 👇' | no column |  |
| FRIDAY | 3 | Athletic (speed/power) block | 'COD' / 'COD' | AP_COD | `L7:L242` CHANGE OF DIRECTION: FOUNDATIONAL 'EASY TURN' / MODERATE 'MOD. TURN' / ADVANCED 'HARD TURN'; 9 options | 'CHOOSE 👇' (E42) | unset 'CHOOSE 👇' | unset 'CHOOSE 👇' | no column |  |
| FRIDAY | 4 | Athletic (speed/power) block | 'Tripple Extension' / 'Tripple Extension' | AP_TRIPLE_EXT | `C7:C242` TRIPPLE EXTENSION: FOUNDATIONAL / MODERATE / ADVANCED (Olympic) / EASY (jumping ankle); 33 options | 'CHOOSE 👇' (E43) | unset 'CHOOSE 👇' | unset 'CHOOSE 👇' | no column |  |
| FRIDAY | 5 | Resistance block | 'Hamstring' / 'Bilateral HD' | RP_BHD | `AN7:AN122` BILATERAL HIP DOMNANT: FOUNDATIONAL / MODERATE / ADVANCED; 33 | 'CHOOSE 👇' (E44) | unset 'CHOOSE 👇' | unset 'CHOOSE 👇' | no column |  |
| FRIDAY | 6 | Resistance block | 'Chest' / 'Horizontal Push' | RP_HPUSH | `AD7:AD162` HORIZONTAL PUSH: FOUNDATIONAL / MODERATE / ADVANCED / UNILATERAL; 25 | 'CHOOSE 👇' (E45) | unset 'CHOOSE 👇' | unset 'CHOOSE 👇' | no column |  |
| FRIDAY | 7 | Resistance block | 'Hamstring/Glutes' / 'Unilateral HD' | RP_UHD | `AQ7:AQ42` UNILATERAL HIP DOMINANT: FOUNDATIONAL only; 8 | 'CHOOSE 👇' (E46) | unset 'CHOOSE 👇' | unset 'CHOOSE 👇' | no column |  |
| FRIDAY | 8 | Resistance block | 'Chest/Shoulders' / 'Vertical Push' | RP_VPUSH | `AA7:AA122` VERTICAL PUSH: FOUNDATIONAL / ADVANCED / UNILATERAL; 20 | 'CHOOSE 👇' (E47) | unset 'CHOOSE 👇' | unset 'CHOOSE 👇' | no column |  |
| FRIDAY | 9 | Resistance block | 'Hamstrings' / 'Leg Curls' | ISO_HAM | `AR7:AR10` LEG CURLS: 2 options | 'CHOOSE 👇' (E48) | unset 'CHOOSE 👇' | unset 'CHOOSE 👇' | no column |  |
| FRIDAY | 10 | Resistance block | 'Shoulders/Traps' / 'ABdution' | ISO_SIDE_REAR_DELT | `AH7:AH42` SIDE RAISES: one list; 12 | 'CHOOSE 👇' (E49) | unset 'CHOOSE 👇' | unset 'CHOOSE 👇' | no column |  |
| SATURDAY | 1 | Optional accessory / conditioning day | 'Calves' / (no CATEGORY) | ISO_CALF | `AU7:AU13` CALVES: 5 | 'CHOOSE 👇' (E51) | unset 'CHOOSE 👇' | unset 'CHOOSE 👇' | no column |  |
| SATURDAY | 2 | Optional accessory / conditioning day | 'Aerobic Capacity' / (no CATEGORY) | COND_AEROBIC | `B7:B122` CARDIO (truncated: DISTANCE + CALORIES blocks unreachable); 29 options | 'CHOOSE 👇' (E52) | unset 'CHOOSE 👇' | no REPS dropdown | no column |  |
| SATURDAY | 3 | Optional accessory / conditioning day | 'Core' / (no CATEGORY) | CORE_CT_or_CP | `O7:O283` CORE THORAX + CORE PELVIS; 17 | 'CHOOSE 👇' (E53) | unset 'CHOOSE 👇' | unset 'CHOOSE 👇' | no column |  |
| SATURDAY | 4 | Optional accessory / conditioning day | 'Focus 1' / (no CATEGORY) | FOCUS | `AZ7:AZ335` FULL FOCUS LIST: 10 muscle groups; 51 | 'CHOOSE 👇' (E54) | unset 'CHOOSE 👇' | unset 'CHOOSE 👇' | no column |  |
| SATURDAY | 5 | Optional accessory / conditioning day | 'Focus 2' / (no CATEGORY) | FOCUS | `AZ7:AZ335` FULL FOCUS LIST: 10 muscle groups; 51 | 'CHOOSE 👇' (E55) | unset 'CHOOSE 👇' | unset 'CHOOSE 👇' | no column |  |
| SUNDAY | - | OFF | 'OFF' | REST | - | 'OFF' | 'OFF' | 'OFF' | no column | rows 57-63 merged |

Slots per week: 50 (4 x 10 on training days + 2 x 5 on optional days). Dropdown options a client can pick from on a 10-slot day: 41 + 41 + 20 + 9 + 33 + 35 + 16 + 13 + 20 + 1 = **229** on an A day (B day: 41 + 20 + 9 + 33 + 33 + 25 + 8 + 20 + 2 + 12 = 203).

## A3. Rules visible in the structure

OBSERVED structure, with my reading flagged:

1. **A/B day template repeated twice a week.** A day (MONDAY, THURSDAY) = 5 athletic + 5 resistance: 'Plyo', 'Plyo', 'Throwing', 'COD', 'Tripple Extension', then 'Bilateral KD' -> 'Horizontal Pull' -> 'Unilateral KD' -> 'Vertical Pull' -> 'Leg Extensions'. B day (TUESDAY, FRIDAY) = 4 athletic + 6 resistance: 'PLYO', 'Throwing', 'COD', 'Tripple Extension', then 'Bilateral HD' -> 'Horizontal Push' -> 'Unilateral HD' -> 'Vertical Push' -> 'Leg Curls' -> 'ABdution'. Order: A, B, optional, A, B, optional, OFF.
2. **Session cap = 10 exercises** on training days, 5 on optional days. The A day spends its 10th slot on a second plyo; the B day spends it on shoulder isolation ('ABdution'). *INFERRED*: a fixed exercise budget per session, with the extra slot traded between athletic and accessory work.
3. **Athletic work first, in a fixed order**: Plyo -> Throwing -> COD -> Tripple Extension -> resistance. *INFERRED principle*: the most elastic, highest-velocity and least loaded work first while fresh (jumps), then upper-body/trunk power (med-ball throws), then cutting, then loaded power (hang pulls, Olympic lifts) as the bridge into heavy strength work.
4. **Resistance order**: bilateral before unilateral, compound before isolation, horizontal before vertical, lower/upper alternating (L-U-L-U-L on A, L-U-L-U-L-U on B).
5. **Pairing logic**: knee-dominant work is paired with pulls (A day), hip-dominant work with pushes (B day). Natural A1/A2 pairs (*INFERRED*; the tab never writes 'SUPERSET W/ 👇' although the SETS menu offers it): A day 'Bilateral KD' + 'Horizontal Pull', 'Unilateral KD' + 'Vertical Pull', 'Leg Extensions' alone; B day 'Bilateral HD' + 'Horizontal Push', 'Unilateral HD' + 'Vertical Push', 'Leg Curls' + 'ABdution'. Each day gives one lower dominance both a bilateral and a unilateral exposure, and one upper direction (pull or push) both a horizontal and a vertical exposure.
6. **Perfect weekly balance (OBSERVED counts)**: 4 pull slots vs 4 push slots; 6 knee/quad slots (2 BKD, 2 UKD, 2 Leg Extensions) vs 6 hip/hamstring slots (2 BHD, 2 UHD, 2 Leg Curls); 4 bilateral lower vs 4 unilateral lower; every pattern 2x/week; every athletic quality on all 4 training days (plyo 6 slots/week).
7. **Isolation goes last**, and it targets the big muscle of the day: 'Leg Extensions' closes the knee day, 'Leg Curls' + 'ABdution' close the hip/push day. There is **no arm isolation and no calf isolation on training days** (AESTHETICS has 'Calves', 'Bicep' and 'Tricep' in the same positions). *INFERRED*: in the athletic version the athletic block replaces the calves (ankle hops, depth drops, jumps load the calves) and the arm work (arms only via Focus).
8. **Optional days hold the small, low-skill and specialisation work**: 'Calves', 'Aerobic Capacity', 'Core', 'Focus 1', 'Focus 2'. Placed between training days (*INFERRED*: low CNS cost, recovery-friendly). Cross-reference (OBSERVED in MASTER_MODEL 'EXAMPLE ATHLETIC FULL BODY SPLI' A4): "Do steady cardio whenever you want, just don't over do it... I reccomend doing it WEDNESDAYS & SATURDAYS max 40 min of steady" - exactly where this template puts 'Aerobic Capacity'. MASTER_MODEL 'AEROBIC CAPACITY CHEAT SHEET' A5 asks for 3 aerobic-capacity workouts per week (one per colour); this template only has 2 slots.
9. **Dose fields**: SETS dropdown `AV7:AV42` on every row (1-8 or 'SUPERSET W/ 👇'); REPS dropdown `AW7:AW42` on every row **except 'Aerobic Capacity'** (G25, G52 have no REPS dropdown: the cardio option text carries the dose, e.g. '3 min Fast - 2 min walk'). The 'Aerobic Capacity' dropdown `B7:B122` is truncated: the 'DISTANCE' (200m-1000m) and 'CALORIES' (10-50 cals) blocks below row 122 cannot be picked.
10. **One preset**: G12 'MYO SET' on Monday's leg extensions (Thursday's G39 is 'CHOOSE 👇'). *INFERRED*: the coach's default for quad isolation is a myo set.

## A4. Quantitative volume

Sets are all unset ('CHOOSE 👇'), so "as written" is 0 everywhere. Two assumptions are shown: **2 sets per slot** (the coach's own choice on every filled JUSTICE LEAGUE slot) and **3 sets per slot** (generic default; also the coach's usual compound dose in AESTHETICS: 'Leg press' 3 x '15 Reps', 'Bent Over Barbell Rows' 3 x '8 to 12 Reps').

Exercises and working sets per session:

| Day | Exercises | Athletic slots | Resistance slots | Sets as written | Sets @2/slot | Sets @3/slot | Aerobic bouts |
|---|---|---|---|---|---|---|---|
| MONDAY (A) | 10 | 5 | 5 | 0 | 20 | 30 | 0 |
| TUESDAY (B) | 10 | 4 | 6 | 0 | 20 | 30 | 0 |
| WEDNESDAY (optional) | 5 | 0 | 1 (calves) + core + 2 focus | 0 | 8 | 12 | 1 |
| THURSDAY (A) | 10 | 5 | 5 | 0 | 20 | 30 | 0 |
| FRIDAY (B) | 10 | 4 | 6 | 0 | 20 | 30 | 0 |
| SATURDAY (optional) | 5 | 0 | 1 + core + 2 focus | 0 | 8 | 12 | 1 |
| SUNDAY | OFF | - | - | - | - | - | - |
| **Week (4 main days)** | 40 | 18 | 22 | 0 | **80** (36 athletic + 44 resistance) | **120** (54 + 66) | 0 |
| **Week (all 6 days)** | 50 | 18 | 22 + 10 optional | 0 | **96** (+2 aerobic bouts) | **144** (+2 bouts) | 2 |

Weekly sets per canonical bucket (main 4 days / all 6 days):

| Bucket | Slots/week | @2 sets | @3 sets |
|---|---|---|---|
| AP_PLYO | 6 | 12 | 18 |
| AP_THROW | 4 | 8 | 12 |
| AP_COD | 4 | 8 | 12 |
| AP_TRIPLE_EXT | 4 | 8 | 12 |
| AP_JUMP_LIMITED_KNEE / AP_SPRINT | 0 dedicated (only via picks inside Plyo / Tripple Extension lists) | 0 | 0 |
| RP_BKD, RP_UKD, RP_HPULL, RP_VPULL | 2 each | 4 each | 6 each |
| RP_BHD, RP_UHD, RP_HPUSH, RP_VPUSH | 2 each | 4 each | 6 each |
| ISO_QUAD, ISO_HAM, ISO_SIDE_REAR_DELT | 2 each | 4 each | 6 each |
| ISO_CALF (optional days) | 2 | 0 / 4 | 0 / 6 |
| CT_CORE_THORAX or CP_CORE_PELVIS (optional days) | 2 | 0 / 4 | 0 / 6 |
| FOCUS (optional days) | 4 | 0 / 8 | 0 / 12 |
| COND_AEROBIC (optional days) | 2 | 2 bouts | 2 bouts |
| ISO_CHEST, ISO_BICEP, ISO_TRICEP, CORE_OTHER, COND_SPRINT_BUYOUT, FUNCTIONAL | 0 | 0 | 0 |

Weekly sets per muscle (resistance only = hypertrophy volume; athletic exposure shown separately). "6-day" adds the optional calves/core sets; Focus sets (8 @2, 12 @3) are extra and land on whatever muscle the client picks.

| Muscle | Resistance @2 (4-day) | Resistance @2 (6-day) | Resistance @3 (6-day) | Athletic exposure @2 | Athletic exposure @3 | Coach's 15-20 target met? |
|---|---|---|---|---|---|---|
| quads | 12 | 12 | 18 | 24 | 36 | @3 only |
| glutes | 14 | 14 | 21 | 18 | 27 | @3 (21, just above the range) |
| hamstrings | 12 | 12 | 18 | 4 | 6 | @3 only |
| chest | 6 | 6 | 9 | 0 | 0 | no |
| lats / upper back | 8 | 8 | 12 | 4 | 6 | no |
| front delts | 8 | 8 | 12 | 0 | 0 | no |
| side delts | 6 | 6 | 9 | 0 | 0 | no |
| rear delts | 2 | 2 | 3 | 0 | 0 | no |
| biceps | 4 | 4 | 6 | 0 | 0 | no |
| triceps | 4 | 4 | 6 | 0 | 0 | no |
| calves | 0 | 4 | 6 | 10 | 15 | no (but heavy athletic loading) |
| abs / obliques | 0 | 4 | 6 | 8 (throws) | 12 | no |

Plyometric ground contacts (*INFERRED estimate*, using the REPS midpoints the coach picked in JUSTICE LEAGUE, '6 to 8 Reps'): 6 plyo slots x 2 sets x 6-8 = **72-96 contacts/week** at 2 sets, 108-144 at 3 sets.

Reading (*INFERRED*): at the coach's own 2-set dose the template is a **lower-body-first, upper-body-maintenance** week. Legs sit at 12-14 resistance sets plus 18-24 athletic exposures; the upper body sits at 2-8 sets per muscle. The weekly session budget (~20 sets) is about the same as an AESTHETICS day (Day 1 as filled: 7 exercises, 19 sets) - the athletic version keeps the session size and gives about 45 % of it (36 of 80 sets) to athletic qualities, which pushes per-exercise sets down from 3 to 2.

## A5. Rep ranges, intensity, rest, tempo

- **Only one rep prescription exists**: G12 'MYO SET' on Monday 'Leg Extensions' (ISO_QUAD). MYO SET is defined in MASTER_MODEL 'ALL ABOUT SQUATS' A30: 15 reps, about 3 s rest, then 5 x 5 with about 3 s breaths = **40 reps** ('15/5/5/5/5/5', labelled '**MYO SET - ADVANCED').
- **REPS menu** (`AW8:AW14`): '4 to 6 Reps', '6 to 8 Reps', '8 to 12 Reps', '10 to 15 Reps', '15 Reps', '20 Reps', 'MYO SET'. Floor = 4 reps, ceiling = 20 (40 with MYO). There is no way to write 1-3 reps (Olympic lifts, heavy singles), seconds, meters, contacts or per-side reps.
- **Intensity**: this tab has no EFFORT column. No RIR/RPE/% anywhere in the tab.
- **Rest / tempo**: none.
- Cross-reference (OBSERVED in MASTER_MODEL, not in this tab): 'EXAMPLE ATHLETIC FULL BODY SPLI' A3 '*Always leave 1 rep in the tank, never work up to failure but get as close as you can', A5 '***The lower the reps, the higher the weight... Always go for 1-3 RIR (REPS IN RESERVE) aka RPE 7+'; 'ALL ABOUT SQUATS' B28 '*REST 1-2 MIN BETWEEN SETS' (hypertrophy) and E28 '*REST 3-6 MIN BETWEEN SETS' (strength).

## A6. Progression

- **Week-to-week: none in the tab** (one week only). **Level-to-level: none prescribed**, but every dropdown holds its level ladder, so progression would be done by moving a slot down its list: e.g. Plyo 'FOUNDATIONAL' ('Low Depth Drop', 'Medium Depth Drop', box jumps) -> 'MODERATE' plate hops -> 'MODERATE' hurdle hops -> 'ADVANCED' ('Depth Jumps', 'Hurdle Hops', 'Bounding'); Tripple Extension 'FOUNDATIONAL' squat-to-calf-raise / high-hang pulls -> 'MODERATE' low-hang pulls -> 'ADVANCED' 'Power Clean', 'Snatch ', 'Clean & Jerk'; COD 'EASY TURN' -> 'MOD. TURN' -> 'HARD TURN'.
- Levers present: library level, SETS 1-8, REPS menu, and (in the tracking copies) EFFORT + HOW IT FELT? as feedback.
- *INFERRED projection* of the coach's stated rule ("gradually put more volume on it week by week, 3 %, 5 % or 7 %") on the 2-set baseline of 44 resistance sets/week (4 main days), compounding:

| Weekly increment | Week 6 | Week 8 | Week 12 | +1 set to quads (12) every | +1 set to chest (6) every | +1 set to biceps (4) every |
|---|---|---|---|---|---|---|
| 3 % | 51 | 54 | 61 | 2.7 wk | 5.2 wk | 7.5 wk |
| 5 % | 56 | 62 | 75 | 1.6 wk | 3.2 wk | 4.6 wk |
| 7 % | 62 | 71 | 93 | 1.2 wk | 2.3 wk | 3.3 wk |

  Per muscle (compounding, weeks 6 / 8 / 12): quads 12 -> 13.9 / 14.8 / 16.6 at 3 %, 15.3 / 16.9 / 20.5 at 5 %, 16.8 / 19.3 / 25.3 at 7 %; glutes 14 -> 16.2 / 17.2 / 19.4 (3 %), 17.9 / 19.7 / 23.9 (5 %), 19.6 / 22.5 / 29.5 (7 %). Generator implication (*INFERRED*): with only 2 slots per pattern per week, a percentage step is smaller than one set, so increments must be accumulated per muscle and released as whole sets (or expressed through reps/load). Big muscles reach the next set quickly; small muscles take weeks - which fits the coach's "3 % / 5 % / 7 % depending on the size of the muscle".

## A7. What this reveals about the coach's thinking (all *INFERRED*)

1. **An athlete program is a muscle program with an athletic layer in front, not a different program.** The full-body resistance skeleton (knee+pull / hip+push, bilateral then unilateral, isolation last) is kept intact from AESTHETICS; four or five athletic slots are added in front and the arm/calf isolation is moved out.
2. **Fixed session budget, redistributed.** Ten exercises per training day. Athletic qualities cost slots, and the coach pays for them by removing isolation and (in JUSTICE LEAGUE) by dropping sets per exercise to 2. This is the "play with the volume" lever: the sport profile decides how the ~20-set session is split.
3. **Quality before load, fast before slow.** Jumps -> throws -> cuts -> loaded power -> strength -> isolation.
4. **Two exposures per pattern per week, each exposure small.** Frequency is high (every athletic quality 4x/week, every lift 2x/week) while per-session dose is small - a practice-style approach to athletic skills.
5. **Lower body is the priority for athletes.** 12 lower-body resistance slots vs 10 upper (incl. 'ABdution'), plus nearly all athletic work is leg-driven.
6. **Small work, conditioning and specialisation live on optional days** - an athlete can train 4 or 6 days without breaking the main structure.
7. **Level is a property of the slot, not of the person** (confirmed by the JUSTICE LEAGUE picks below).

---

# B. JUSTICE LEAGUE (partly filled instance)

## B1. Identity

- **Tab** 'JUSTICE LEAGUE'; **title** A1 (merged A1:K1, EA9999) still 'ATHLETIC - FULL BODY - 4 DAYS A WEEK'.
- **Population / goal** (*INFERRED*): a specific client or team called "Justice League" (a group name; sport, age and season not stated) on the athletic template. The coach chose real exercises, sets and reps for all of Monday, the Tuesday plyo and the Thursday squat.
- **Level** (OBSERVED by locating each pick in the library): mixed per slot. FOUNDATIONAL 'Medium Depth Drop' (G11) and 'Ankle Hops ' (G15, also duplicated at G55 in the MODERATE plate-hop block); MODERATE 'DIG/OUT' (L46, 'MOD. TURN'), 'Front Squats' (AI46), 'Low Bar Back Squat' (AI50), 'SL Depth Drops' (G56); ADVANCED 'Power Clean' (C92) and 'Stricted Pull-ups feet in front ' (U47); UNILATERAL 'Cable Machine UL Rows' (X92); no-level lists for 'Situps to overhead throw' (K27) and 'Front Foot Elevated Lunges (FFE)' (AL15). *INFERRED*: an intermediate athlete with a strength/power background (can power clean and do strict pull-ups) who is still kept at foundational landing work.
- **Days per week**: same 4 + 2 optional + OFF structure.
- **Equipment** (from the picks): barbell + rack, cable stack, pull-up bar, leg-extension machine, med ball, box/platform for depth drops, room for COD.
- **Tracking layer**: H 'WEIGHT USED or SCORE' (free text, turns red EA9999 when blank and green B6D7A8 when filled), I 'EFFORT' (`AX` 1-10 menu), J 'HOW IT FELT?' (`AY`: 'Felt the RIGHT muscles', 'Felt the WRONG muscle', 'Felt a PAIN', "Couldn't do it"), K 'DONE?' (one checkbox per day). Nothing has been logged: every EFFORT and HOW IT FELT? cell is 'CHOOSE 👇' and every DONE? is FALSE.

## B2. Full session-by-session table

| Day | # | Part (inferred) | PURPOSE / CATEGORY (verbatim) | Canonical bucket | Library dropdown (OBSERVED wiring) | Exercise (cell) | Sets | Reps | Effort | Notes |
|---|---|---|---|---|---|---|---|---|---|---|
| MONDAY | 1 | Athletic (speed/power) block | 'Plyo' / 'Plyo' | AP_PLYO | `G7:G162` PLYOS: FOUNDATIONAL / MODERATE (plate hops) / MODERATE (hurdle hops) / ADVANCED; 41 options | 'Medium Depth Drop' (E3) [G11 FOUNDATIONAL] | 2 | '6 to 8 Reps' | unset 'CHOOSE 👇' |  |
| MONDAY | 2 | Athletic (speed/power) block | 'Plyo' / 'Plyo' | AP_PLYO slot; pick = AP_JUMP_LIMITED_KNEE | `G7:G162` PLYOS: FOUNDATIONAL / MODERATE (plate hops) / MODERATE (hurdle hops) / ADVANCED; 41 options | 'Ankle Hops ' (E4) [G15 FOUNDATIONAL; G55 MODERATE (plate hops / limited-knee)] | 2 | '6 to 8 Reps' | unset 'CHOOSE 👇' |  |
| MONDAY | 3 | Athletic (speed/power) block | 'Throwing' / 'Throwing' | AP_THROW | `K7:K87` THROWING: one list, no levels; 20 options | 'Situps to overhead throw' (E5) [K27 single list (no levels)] | 2 | '8 to 12 Reps' | unset 'CHOOSE 👇' |  |
| MONDAY | 4 | Athletic (speed/power) block | 'COD' / 'COD' | AP_COD | `L7:L242` CHANGE OF DIRECTION: FOUNDATIONAL 'EASY TURN' / MODERATE 'MOD. TURN' / ADVANCED 'HARD TURN'; 9 options | 'DIG/OUT' (E6) [L46 MODERATE (mod. turn)] | 2 | '6 to 8 Reps' | unset 'CHOOSE 👇' | H6 'LATERAL' |
| MONDAY | 5 | Athletic (speed/power) block | 'Tripple Extension' / 'Tripple Extension' | AP_TRIPLE_EXT | `C7:C242` TRIPPLE EXTENSION: FOUNDATIONAL / MODERATE / ADVANCED (Olympic) / EASY (jumping ankle); 33 options | 'Power Clean' (E7) [C92 ADVANCED (Olympic lifts)] | 2 | '6 to 8 Reps' | unset 'CHOOSE 👇' |  |
| MONDAY | 6 | Resistance block | 'Quads' / 'Bilateral KD' | RP_BKD | `AI7:AI122` BILATERAL KNEE DOMINANT: FOUNDATIONAL / MODERATE / ADVANCED; 35 | 'Front Squats' (E8) [AI46 MODERATE] | 2 | '6 to 8 Reps' | unset 'CHOOSE 👇' |  |
| MONDAY | 7 | Resistance block | 'Back' / 'Horizontal Pull' | RP_HPULL | `X7:X162` HORIZONTAL PULL: FOUNDATIONAL / ADVANCED / UNILATERAL; 16 | 'Cable Machine UL Rows' (E9) [X92 UNILATERAL] | 2 | '8 to 12 Reps' | unset 'CHOOSE 👇' | H9 'SINGLE ARM' |
| MONDAY | 8 | Resistance block | 'Quads/Glutes' / 'Unilateral KD' | RP_UKD | `AL7:AL42` UNILATERAL KNEE DOMINANT: one list; 13 | 'Front Foot Elevated Lunges (FFE)' (E10) [AL15 single list (no levels)] | 2 | '8 to 12 Reps' | unset 'CHOOSE 👇' |  |
| MONDAY | 9 | Resistance block | 'Back ' / 'Vertical Pull' | RP_VPULL | `U7:U122` VERTICAL PULL: FOUNDATIONAL / ADVANCED / UNILATERAL; 20 | 'Stricted Pull-ups feet in front ' (E11) [U47 ADVANCED] | 2 | '8 to 12 Reps' | unset 'CHOOSE 👇' |  |
| MONDAY | 10 | Resistance block | 'Quads' / 'Leg Extensions' | ISO_QUAD | `AM7:AM9` LEG EXTENSIONS: 1 option | 'Leg Extensions' (E12) [AM9 single item] | 2 | 'MYO SET' | unset 'CHOOSE 👇' | H12 'OUCH' |
| TUESDAY | 1 | Athletic (speed/power) block | 'Plyo' / 'PLYO' | AP_PLYO | `G7:G162` PLYOS: FOUNDATIONAL / MODERATE (plate hops) / MODERATE (hurdle hops) / ADVANCED; 41 options | 'SL Depth Drops' (E13) [G56 MODERATE (plate hops / limited-knee)] | 2 | '6 to 8 Reps' | unset 'CHOOSE 👇' |  |
| TUESDAY | 2 | Athletic (speed/power) block | 'Throwing' / 'Throwing' | AP_THROW | `K7:K87` THROWING: one list, no levels; 20 options | 'CHOOSE 👇' (E14) | unset 'CHOOSE 👇' | unset 'CHOOSE 👇' | unset 'CHOOSE 👇' |  |
| TUESDAY | 3 | Athletic (speed/power) block | 'COD' / 'COD' | AP_COD | `L7:L242` CHANGE OF DIRECTION: FOUNDATIONAL 'EASY TURN' / MODERATE 'MOD. TURN' / ADVANCED 'HARD TURN'; 9 options | 'CHOOSE 👇' (E15) | unset 'CHOOSE 👇' | unset 'CHOOSE 👇' | unset 'CHOOSE 👇' |  |
| TUESDAY | 4 | Athletic (speed/power) block | 'Tripple Extension' / 'Tripple Extension' | AP_TRIPLE_EXT | `C7:C242` TRIPPLE EXTENSION: FOUNDATIONAL / MODERATE / ADVANCED (Olympic) / EASY (jumping ankle); 33 options | 'CHOOSE 👇' (E16) | unset 'CHOOSE 👇' | unset 'CHOOSE 👇' | unset 'CHOOSE 👇' |  |
| TUESDAY | 5 | Resistance block | 'Hamstring' / 'Bilateral HD' | RP_BHD | `AN7:AN122` BILATERAL HIP DOMNANT: FOUNDATIONAL / MODERATE / ADVANCED; 33 | 'CHOOSE 👇' (E17) | unset 'CHOOSE 👇' | unset 'CHOOSE 👇' | unset 'CHOOSE 👇' |  |
| TUESDAY | 6 | Resistance block | 'Chest' / 'Horizontal Push' | RP_HPUSH | `AD7:AD162` HORIZONTAL PUSH: FOUNDATIONAL / MODERATE / ADVANCED / UNILATERAL; 25 | 'CHOOSE 👇' (E18) | unset 'CHOOSE 👇' | unset 'CHOOSE 👇' | unset 'CHOOSE 👇' |  |
| TUESDAY | 7 | Resistance block | 'Hamstring/Glutes' / 'Unilateral HD' | RP_UHD | `AQ7:AQ42` UNILATERAL HIP DOMINANT: FOUNDATIONAL only; 8 | 'CHOOSE 👇' (E19) | unset 'CHOOSE 👇' | unset 'CHOOSE 👇' | unset 'CHOOSE 👇' |  |
| TUESDAY | 8 | Resistance block | 'Chest/Shoulders' / 'Vertical Push' | RP_VPUSH | `AA7:AA122` VERTICAL PUSH: FOUNDATIONAL / ADVANCED / UNILATERAL; 20 | 'CHOOSE 👇' (E20) | unset 'CHOOSE 👇' | unset 'CHOOSE 👇' | unset 'CHOOSE 👇' |  |
| TUESDAY | 9 | Resistance block | 'Hamstrings' / 'Leg Curls' | ISO_HAM | `AR7:AR10` LEG CURLS: 2 options | 'CHOOSE 👇' (E21) | unset 'CHOOSE 👇' | unset 'CHOOSE 👇' | unset 'CHOOSE 👇' |  |
| TUESDAY | 10 | Resistance block | 'Shoulders/Traps' / 'ABdution' | ISO_SIDE_REAR_DELT | `AH7:AH42` SIDE RAISES: one list; 12 | 'CHOOSE 👇' (E22) | unset 'CHOOSE 👇' | unset 'CHOOSE 👇' | unset 'CHOOSE 👇' |  |
| WEDNESDAY | 1 | Optional accessory / conditioning day | 'Calves' / (no CATEGORY) | ISO_CALF | `AU7:AU13` CALVES: 5 | 'CHOOSE 👇' (E24) | unset 'CHOOSE 👇' | unset 'CHOOSE 👇' | unset 'CHOOSE 👇' |  |
| WEDNESDAY | 2 | Optional accessory / conditioning day | 'Aerobic Capacity' / (no CATEGORY) | COND_AEROBIC | `B7:B122` CARDIO (truncated: DISTANCE + CALORIES blocks unreachable); 29 options | 'CHOOSE 👇' (E25) | unset 'CHOOSE 👇' | no REPS dropdown | unset 'CHOOSE 👇' |  |
| WEDNESDAY | 3 | Optional accessory / conditioning day | 'Core' / (no CATEGORY) | CORE_CT_or_CP | `O7:O283` CORE THORAX + CORE PELVIS; 17 | 'CHOOSE 👇' (E26) | unset 'CHOOSE 👇' | unset 'CHOOSE 👇' | unset 'CHOOSE 👇' |  |
| WEDNESDAY | 4 | Optional accessory / conditioning day | 'Focus 1' / (no CATEGORY) | FOCUS | `AZ7:AZ335` FULL FOCUS LIST: 10 muscle groups; 51 | 'CHOOSE 👇' (E27) | unset 'CHOOSE 👇' | unset 'CHOOSE 👇' | unset 'CHOOSE 👇' |  |
| WEDNESDAY | 5 | Optional accessory / conditioning day | 'Focus 2' / (no CATEGORY) | FOCUS | `AZ7:AZ335` FULL FOCUS LIST: 10 muscle groups; 51 | 'CHOOSE 👇' (E28) | unset 'CHOOSE 👇' | unset 'CHOOSE 👇' | unset 'CHOOSE 👇' |  |
| THURSDAY (cell B30 = ' ') | 1 | Athletic (speed/power) block | 'Plyo' / 'Plyo' | AP_PLYO | `G7:G162` PLYOS: FOUNDATIONAL / MODERATE (plate hops) / MODERATE (hurdle hops) / ADVANCED; 41 options | 'CHOOSE 👇' (E30) | unset 'CHOOSE 👇' | unset 'CHOOSE 👇' | unset 'CHOOSE 👇' |  |
| THURSDAY (cell B30 = ' ') | 2 | Athletic (speed/power) block | 'Plyo' / 'Plyo' | AP_PLYO | `G7:G162` PLYOS: FOUNDATIONAL / MODERATE (plate hops) / MODERATE (hurdle hops) / ADVANCED; 41 options | 'CHOOSE 👇' (E31) | unset 'CHOOSE 👇' | unset 'CHOOSE 👇' | unset 'CHOOSE 👇' |  |
| THURSDAY (cell B30 = ' ') | 3 | Athletic (speed/power) block | 'Throwing' / 'Throwing' | AP_THROW | `K7:K87` THROWING: one list, no levels; 20 options | 'CHOOSE 👇' (E32) | unset 'CHOOSE 👇' | unset 'CHOOSE 👇' | unset 'CHOOSE 👇' |  |
| THURSDAY (cell B30 = ' ') | 4 | Athletic (speed/power) block | 'COD' / 'COD' | AP_COD | `L7:L242` CHANGE OF DIRECTION: FOUNDATIONAL 'EASY TURN' / MODERATE 'MOD. TURN' / ADVANCED 'HARD TURN'; 9 options | 'CHOOSE 👇' (E33) | unset 'CHOOSE 👇' | unset 'CHOOSE 👇' | unset 'CHOOSE 👇' |  |
| THURSDAY (cell B30 = ' ') | 5 | Athletic (speed/power) block | 'Tripple Extension' / 'Tripple Extension' | AP_TRIPLE_EXT | `C7:C242` TRIPPLE EXTENSION: FOUNDATIONAL / MODERATE / ADVANCED (Olympic) / EASY (jumping ankle); 33 options | 'CHOOSE 👇' (E34) | unset 'CHOOSE 👇' | unset 'CHOOSE 👇' | unset 'CHOOSE 👇' |  |
| THURSDAY (cell B30 = ' ') | 6 | Resistance block | 'Quads' / 'Bilateral KD' | RP_BKD | `AI7:AI122` BILATERAL KNEE DOMINANT: FOUNDATIONAL / MODERATE / ADVANCED; 35 | 'Low Bar Back Squat' (E35) [AI50 MODERATE] | unset 'CHOOSE 👇' | unset 'CHOOSE 👇' | unset 'CHOOSE 👇' |  |
| THURSDAY (cell B30 = ' ') | 7 | Resistance block | 'Back' / 'Horizontal Pull' | RP_HPULL | `X7:X162` HORIZONTAL PULL: FOUNDATIONAL / ADVANCED / UNILATERAL; 16 | 'CHOOSE 👇' (E36) | unset 'CHOOSE 👇' | unset 'CHOOSE 👇' | unset 'CHOOSE 👇' |  |
| THURSDAY (cell B30 = ' ') | 8 | Resistance block | 'Quads/Glutes' / 'Unilateral KD' | RP_UKD | `AL7:AL42` UNILATERAL KNEE DOMINANT: one list; 13 | 'CHOOSE 👇' (E37) | unset 'CHOOSE 👇' | unset 'CHOOSE 👇' | unset 'CHOOSE 👇' |  |
| THURSDAY (cell B30 = ' ') | 9 | Resistance block | 'Back ' / 'Vertical Pull' | RP_VPULL | `U7:U122` VERTICAL PULL: FOUNDATIONAL / ADVANCED / UNILATERAL; 20 | 'CHOOSE 👇' (E38) | unset 'CHOOSE 👇' | unset 'CHOOSE 👇' | unset 'CHOOSE 👇' |  |
| THURSDAY (cell B30 = ' ') | 10 | Resistance block | 'Quads' / 'Leg Extensions' | ISO_QUAD | `AM7:AM9` LEG EXTENSIONS: 1 option | 'CHOOSE 👇' (E39) | unset 'CHOOSE 👇' | unset 'CHOOSE 👇' | unset 'CHOOSE 👇' |  |
| FRIDAY | 1 | Athletic (speed/power) block | 'Plyo' / 'PLYO' | AP_PLYO | `G7:G162` PLYOS: FOUNDATIONAL / MODERATE (plate hops) / MODERATE (hurdle hops) / ADVANCED; 41 options | 'CHOOSE 👇' (E40) | unset 'CHOOSE 👇' | unset 'CHOOSE 👇' | unset 'CHOOSE 👇' |  |
| FRIDAY | 2 | Athletic (speed/power) block | 'Throwing' / 'Throwing' | AP_THROW | `K7:K87` THROWING: one list, no levels; 20 options | 'CHOOSE 👇' (E41) | unset 'CHOOSE 👇' | unset 'CHOOSE 👇' | unset 'CHOOSE 👇' |  |
| FRIDAY | 3 | Athletic (speed/power) block | 'COD' / 'COD' | AP_COD | `L7:L242` CHANGE OF DIRECTION: FOUNDATIONAL 'EASY TURN' / MODERATE 'MOD. TURN' / ADVANCED 'HARD TURN'; 9 options | 'CHOOSE 👇' (E42) | unset 'CHOOSE 👇' | unset 'CHOOSE 👇' | unset 'CHOOSE 👇' |  |
| FRIDAY | 4 | Athletic (speed/power) block | 'Tripple Extension' / 'Tripple Extension' | AP_TRIPLE_EXT | `C7:C242` TRIPPLE EXTENSION: FOUNDATIONAL / MODERATE / ADVANCED (Olympic) / EASY (jumping ankle); 33 options | 'CHOOSE 👇' (E43) | unset 'CHOOSE 👇' | unset 'CHOOSE 👇' | unset 'CHOOSE 👇' |  |
| FRIDAY | 5 | Resistance block | 'Hamstring' / 'Bilateral HD' | RP_BHD | `AN7:AN122` BILATERAL HIP DOMNANT: FOUNDATIONAL / MODERATE / ADVANCED; 33 | 'CHOOSE 👇' (E44) | unset 'CHOOSE 👇' | unset 'CHOOSE 👇' | unset 'CHOOSE 👇' |  |
| FRIDAY | 6 | Resistance block | 'Chest' / 'Horizontal Push' | RP_HPUSH | `AD7:AD162` HORIZONTAL PUSH: FOUNDATIONAL / MODERATE / ADVANCED / UNILATERAL; 25 | 'CHOOSE 👇' (E45) | unset 'CHOOSE 👇' | unset 'CHOOSE 👇' | unset 'CHOOSE 👇' |  |
| FRIDAY | 7 | Resistance block | 'Hamstring/Glutes' / 'Unilateral HD' | RP_UHD | `AQ7:AQ42` UNILATERAL HIP DOMINANT: FOUNDATIONAL only; 8 | 'CHOOSE 👇' (E46) | unset 'CHOOSE 👇' | unset 'CHOOSE 👇' | unset 'CHOOSE 👇' |  |
| FRIDAY | 8 | Resistance block | 'Chest/Shoulders' / 'Vertical Push' | RP_VPUSH | `AA7:AA122` VERTICAL PUSH: FOUNDATIONAL / ADVANCED / UNILATERAL; 20 | 'CHOOSE 👇' (E47) | unset 'CHOOSE 👇' | unset 'CHOOSE 👇' | unset 'CHOOSE 👇' |  |
| FRIDAY | 9 | Resistance block | 'Hamstrings' / 'Leg Curls' | ISO_HAM | `AR7:AR10` LEG CURLS: 2 options | 'CHOOSE 👇' (E48) | unset 'CHOOSE 👇' | unset 'CHOOSE 👇' | unset 'CHOOSE 👇' |  |
| FRIDAY | 10 | Resistance block | 'Shoulders/Traps' / 'ABdution' | ISO_SIDE_REAR_DELT | `AH7:AH42` SIDE RAISES: one list; 12 | 'CHOOSE 👇' (E49) | unset 'CHOOSE 👇' | unset 'CHOOSE 👇' | unset 'CHOOSE 👇' |  |
| SATURDAY | 1 | Optional accessory / conditioning day | 'Calves' / (no CATEGORY) | ISO_CALF | `AU7:AU13` CALVES: 5 | 'CHOOSE 👇' (E51) | unset 'CHOOSE 👇' | unset 'CHOOSE 👇' | unset 'CHOOSE 👇' |  |
| SATURDAY | 2 | Optional accessory / conditioning day | 'Aerobic Capacity' / (no CATEGORY) | COND_AEROBIC | `B7:B122` CARDIO (truncated: DISTANCE + CALORIES blocks unreachable); 29 options | 'CHOOSE 👇' (E52) | unset 'CHOOSE 👇' | no REPS dropdown | unset 'CHOOSE 👇' |  |
| SATURDAY | 3 | Optional accessory / conditioning day | 'Core' / (no CATEGORY) | CORE_CT_or_CP | `O7:O283` CORE THORAX + CORE PELVIS; 17 | 'CHOOSE 👇' (E53) | unset 'CHOOSE 👇' | unset 'CHOOSE 👇' | unset 'CHOOSE 👇' |  |
| SATURDAY | 4 | Optional accessory / conditioning day | 'Focus 1' / (no CATEGORY) | FOCUS | `AZ7:AZ335` FULL FOCUS LIST: 10 muscle groups; 51 | 'CHOOSE 👇' (E54) | unset 'CHOOSE 👇' | unset 'CHOOSE 👇' | unset 'CHOOSE 👇' |  |
| SATURDAY | 5 | Optional accessory / conditioning day | 'Focus 2' / (no CATEGORY) | FOCUS | `AZ7:AZ335` FULL FOCUS LIST: 10 muscle groups; 51 | 'CHOOSE 👇' (E55) | unset 'CHOOSE 👇' | unset 'CHOOSE 👇' | unset 'CHOOSE 👇' |  |
| SUNDAY | - | OFF | 'OFF' | REST | - | 'OFF' | 'OFF' | 'OFF' | 'OFF' | rows 57-63 merged |

## B3. Rules visible + analysis of the filled coaching decisions

The slot rules are identical to the ATHLETIC template (section A3). What the coach's choices add (OBSERVED values, *INFERRED* readings):

1. **Every filled slot gets 2 sets** - all 11 numeric SETS cells are 2.0, on athletic, compound and isolation slots alike. *INFERRED*: on an athletic template the coach's default per-exercise dose is 2 sets (vs 3 for most compounds in AESTHETICS).
2. **Reps follow the slot's role, not the muscle alone**:
   - '6 to 8 Reps' on the high-intent items: both plyos, 'DIG/OUT', 'Power Clean', 'Front Squats', 'SL Depth Drops';
   - '8 to 12 Reps' on secondary, unilateral and upper-body items: 'Situps to overhead throw', 'Cable Machine UL Rows', 'Front Foot Elevated Lunges (FFE)', 'Stricted Pull-ups feet in front ';
   - 'MYO SET' (40 reps) on the isolation finisher 'Leg Extensions' (inherited from the template default G12).
   This matches the coach's stated rule: big-muscle main lifts heavier/lower reps, small/isolation work high reps.
3. **The two A-day plyo slots use two different jump tracks**: 'Medium Depth Drop' (landing/eccentric, FOUNDATIONAL) + 'Ankle Hops ' (ankle stiffness / limited-knee jumping). *INFERRED*: the doubled Plyo slot on A days exists to cover two plyo qualities, not to double one.
4. **Within-week progression of the same quality**: Monday bilateral 'Medium Depth Drop' (G11, FOUNDATIONAL) -> Tuesday 'SL Depth Drops' (G56, MODERATE block). Bilateral landing first, single-leg landing the next day.
5. **The same slot is not repeated with the same exercise**: Monday 'Front Squats' (AI46) vs Thursday 'Low Bar Back Squat' (AI50). On the coach's MASTER_MODEL 'ALL ABOUT SQUATS' loading ladder ("most front loaded to most back loaded") 'Front Squat/ SSB Bar' = 'HARD' and 'Low Bar Squat' = 'HARDEST'. *INFERRED*: the two weekly exposures vary the loading position (front-loaded/quad-biased early in the week, back-loaded/hip-biased heavier later).
6. **Unilateral bias on secondary work**: single-arm cable row (with the cue 'SINGLE ARM'), front-foot-elevated lunge, single-leg depth drops on Tuesday.
7. **Olympic lift chosen at ADVANCED but dosed 2 x 6-8.** The REPS menu cannot go below '4 to 6 Reps'. In the MASTER_MODEL sibling athletic program the coach writes 'Heavy Power Cleans' 2 x 8 at MID level and 'Power Cleans' 3 x 3 at ADVANCED, so 6-8 reps matches his mid-level habit (*INFERRED*), but a 1-3 rep option is missing from the BYOP menu.
8. **COD**: 'DIG/OUT' (a 90-degree route break, 'MOD. TURN') with the note 'LATERAL' - the athlete cuts laterally.
9. **Throw**: 'Situps to overhead throw' - a trunk-flexion-driven sagittal throw (abs/obliques + lats), 8-12 reps.
10. **The notes are in the 'WEIGHT USED or SCORE' column** (no notes column exists): H6 'LATERAL' (COD direction), H9 'SINGLE ARM' (restates the 'UL' in 'Cable Machine UL Rows'), H12 'OUCH' (next to the MYO SET leg extensions). Because nothing else has been logged (EFFORT, HOW IT FELT?, DONE? all untouched), these were most likely written by the coach as cues/warnings while building, not by the athlete (*INFERRED*; open question). The conditional format turns these three cells green as if a weight had been logged.

## B4. Quantitative volume

**As written**:

| Day | Exercises (slots) | Exercises filled | Sets written | Athletic sets | Resistance sets |
|---|---|---|---|---|---|
| MONDAY | 10 | 10 | **20** (10 x 2) | 10 | 10 |
| TUESDAY | 10 | 1 | 2 | 2 | 0 |
| WEDNESDAY | 5 | 0 | 0 | 0 | 0 |
| THURSDAY | 10 | 1 (exercise only, no sets/reps) | 0 | 0 | 0 |
| FRIDAY | 10 | 0 | 0 | 0 | 0 |
| SATURDAY | 5 | 0 | 0 | 0 | 0 |
| **Week as written** | 50 | 12 | **22** | 12 | 10 |

Monday in detail (the one complete session): 10 exercises, 20 working sets, split exactly 50/50 between athletic (10) and resistance (10). Estimated reps from the chosen ranges: plyo 24-32 contacts, throws 16-24, COD 12-16 cuts, power cleans 12-16, front squats 12-16, single-arm rows 16-24, FFE lunges 16-24, pull-ups 16-24, leg extensions 80 (2 MYO sets) = **about 204-256 reps** (64-88 athletic, 140-168 resistance of which 80 are the MYO sets).

Weekly sets per bucket, as written: AP_PLYO 4 ('Medium Depth Drop', 'SL Depth Drops'), AP_JUMP_LIMITED_KNEE 2 ('Ankle Hops '), AP_THROW 2, AP_COD 2, AP_TRIPLE_EXT 2, RP_BKD 2, RP_HPULL 2, RP_UKD 2, RP_VPULL 2, ISO_QUAD 2; everything else 0.

Weekly sets per muscle, as written (resistance): quads 6, glutes 3, lats/upper back 4, rear delts 1, biceps 2; all others 0. Athletic exposure: quads 8, glutes 5, calves 5, lats/upper back 2, abs/obliques 2, hamstrings 1, triceps 1.

**Completed week** (unset slots filled with the coach's own 2 sets; filled values kept): identical to the ATHLETIC template @2 (80 sets over 4 days, 96 over 6 + 2 aerobic bouts) except that AP_PLYO = 10 and AP_JUMP_LIMITED_KNEE = 2 because of the ankle-hop pick. Muscles (resistance): quads 12, glutes 14, hamstrings 12, chest 6, lats/upper back 8, front delts 8, side delts 6, rear delts 2, biceps 4, triceps 4, calves 4 (6-day), abs/obliques 4 (6-day). If the unset slots were filled with 3 sets instead: 109 sets over 4 days (48 athletic + 61 resistance), 133 over 6 days; quads 15, glutes 19.5, hamstrings 18, chest 9, lats 10, front delts 12, side delts 9.

## B5. Rep ranges by bucket, intensity, rest, tempo

| Bucket | Size class | Observed reps |
|---|---|---|
| AP_PLYO | athletic | '6 to 8 Reps' x 2 ('Medium Depth Drop', 'SL Depth Drops') |
| AP_JUMP_LIMITED_KNEE | athletic | '6 to 8 Reps' ('Ankle Hops ') |
| AP_THROW | athletic | '8 to 12 Reps' |
| AP_COD | athletic | '6 to 8 Reps' |
| AP_TRIPLE_EXT | athletic | '6 to 8 Reps' ('Power Clean') |
| RP_BKD | big | '6 to 8 Reps' ('Front Squats') |
| RP_HPULL | big | '8 to 12 Reps' (single arm) |
| RP_UKD | big | '8 to 12 Reps' |
| RP_VPULL | big | '8 to 12 Reps' |
| ISO_QUAD | isolation (of a big muscle) | 'MYO SET' (40 reps) |

Count: '6 to 8 Reps' x 6, '8 to 12 Reps' x 4, 'MYO SET' x 1; nothing at '4 to 6', '10 to 15', '15' or '20'. Effort: EFFORT column exists but every cell is unset; target scale reading (*INFERRED*): '8 - That was perfect' is the bullseye of the 1-10 menu. No rest or tempo.

## B6. Progression

- Week-to-week: none (WEEK 1 only, nothing logged).
- Within the week (OBSERVED picks): bilateral -> single-leg depth drop (FOUNDATIONAL G11 -> MODERATE G56); front-loaded -> back-loaded squat (AI46 -> AI50).
- Level mix across slots (OBSERVED): 2 FOUNDATIONAL, 4 MODERATE, 2 ADVANCED, 1 UNILATERAL, 2 no-level, 1 single-option. *INFERRED*: progression in this system means moving each slot down its own ladder at its own speed.

## B7. What the filled choices reveal (all *INFERRED*)

1. The coach's default athletic dose is **2 sets x moderate reps on everything**, letting the number of slots (10) carry the volume.
2. Reps are set by **role**: primary power/strength item 6-8, secondary/unilateral/upper 8-12, isolation finisher MYO.
3. He **varies exercises between the two weekly exposures** of a slot and progresses landing work bilateral -> single-leg inside the week.
4. He keeps **landing mechanics foundational even for an athlete who can power clean** - plyo level is independent of strength level.
5. He wants cue text next to the exercise ('LATERAL', 'SINGLE ARM', 'OUCH'); the template has nowhere proper to put it.

---

# C. NO ACCESS - ATHLETIC - FB - 4 t (hidden copy)

## C1. Identity

- **Tab** 'NO ACCESS - ATHLETIC - FB - 4 t' (sheet state **hidden**); **title** A1 (merged A1:K1, EA9999) 'ATHLETIC - FULL BODY - 4 to 6 DAYS A WEEK'.
- **Population / goal**: the same athletic template with the full tracking layer (H-K, same formats as JUSTICE LEAGUE). The title makes the 2 optional days explicit (4 to 6 days).
- **What 'NO ACCESS' means is not stated.** It is probably *not* "no equipment": the dropdowns are the same gym lists (barbell, machines, cables) and the tab itself pre-fills a machine exercise ('Leg extensions'). Candidate readings (*INFERRED*): a self-serve copy for clients without coach access, or a locked/hidden master copy. Open question.
- **Level**: not fixed (same ladders). **Days**: MONDAY, TUESDAY, WEDNESDAY (optional), 'THURSDAY' (labelled here), FRIDAY, SATURDAY (optional), SUNDAY 'OFF'. **Weeks**: WEEK 1 only. **Equipment**: as ATHLETIC.
- Data-quality flags (OBSERVED): every placeholder is 'CHOSE 👇' (typo; not a value in any list, so each cell shows a validation warning); E12/E39 'Leg extensions' does not exactly match the list item 'Leg Extensions'; **E19/E46 'Unilateral HD' are wired to `AR7:AR42` (LEG CURLS: 'Seated leg curls', 'Lying Leg Curls')** instead of `AQ7:AQ42`.

## C2. Full session-by-session table

| Day | # | Part (inferred) | PURPOSE / CATEGORY (verbatim) | Canonical bucket | Library dropdown (OBSERVED wiring) | Exercise (cell) | Sets | Reps | Effort | Notes |
|---|---|---|---|---|---|---|---|---|---|---|
| MONDAY | 1 | Athletic (speed/power) block | 'Plyo' / 'Plyo' | AP_PLYO | `G7:G162` PLYOS: FOUNDATIONAL / MODERATE (plate hops) / MODERATE (hurdle hops) / ADVANCED; 41 options | 'CHOSE 👇' (E3) | unset 'CHOSE 👇' | unset 'CHOSE 👇' | unset 'CHOSE 👇' |  |
| MONDAY | 2 | Athletic (speed/power) block | 'Plyo' / 'Plyo' | AP_PLYO | `G7:G162` PLYOS: FOUNDATIONAL / MODERATE (plate hops) / MODERATE (hurdle hops) / ADVANCED; 41 options | 'CHOSE 👇' (E4) | unset 'CHOSE 👇' | unset 'CHOSE 👇' | unset 'CHOSE 👇' |  |
| MONDAY | 3 | Athletic (speed/power) block | 'Throwing' / 'Throwing' | AP_THROW | `K7:K87` THROWING: one list, no levels; 20 options | 'CHOSE 👇' (E5) | unset 'CHOSE 👇' | unset 'CHOSE 👇' | unset 'CHOSE 👇' |  |
| MONDAY | 4 | Athletic (speed/power) block | 'COD' / 'COD' | AP_COD | `L7:L242` CHANGE OF DIRECTION: FOUNDATIONAL 'EASY TURN' / MODERATE 'MOD. TURN' / ADVANCED 'HARD TURN'; 9 options | 'CHOSE 👇' (E6) | unset 'CHOSE 👇' | unset 'CHOSE 👇' | unset 'CHOSE 👇' |  |
| MONDAY | 5 | Athletic (speed/power) block | 'Tripple Extension' / 'Tripple Extension' | AP_TRIPLE_EXT | `C7:C242` TRIPPLE EXTENSION: FOUNDATIONAL / MODERATE / ADVANCED (Olympic) / EASY (jumping ankle); 33 options | 'CHOSE 👇' (E7) | unset 'CHOSE 👇' | unset 'CHOSE 👇' | unset 'CHOSE 👇' |  |
| MONDAY | 6 | Resistance block | 'Quads' / 'Bilateral KD' | RP_BKD | `AI7:AI122` BILATERAL KNEE DOMINANT: FOUNDATIONAL / MODERATE / ADVANCED; 35 | 'CHOSE 👇' (E8) | unset 'CHOSE 👇' | unset 'CHOSE 👇' | unset 'CHOSE 👇' |  |
| MONDAY | 7 | Resistance block | 'Back' / 'Horizontal Pull' | RP_HPULL | `X7:X162` HORIZONTAL PULL: FOUNDATIONAL / ADVANCED / UNILATERAL; 16 | 'CHOSE 👇' (E9) | unset 'CHOSE 👇' | unset 'CHOSE 👇' | unset 'CHOSE 👇' |  |
| MONDAY | 8 | Resistance block | 'Quads/Glutes' / 'Unilateral KD' | RP_UKD | `AL7:AL42` UNILATERAL KNEE DOMINANT: one list; 13 | 'CHOSE 👇' (E10) | unset 'CHOSE 👇' | unset 'CHOSE 👇' | unset 'CHOSE 👇' |  |
| MONDAY | 9 | Resistance block | 'Back ' / 'Vertical Pull' | RP_VPULL | `U7:U122` VERTICAL PULL: FOUNDATIONAL / ADVANCED / UNILATERAL; 20 | 'CHOSE 👇' (E11) | unset 'CHOSE 👇' | unset 'CHOSE 👇' | unset 'CHOSE 👇' |  |
| MONDAY | 10 | Resistance block | 'Quads' / 'Leg Extensions' | ISO_QUAD | `AM7:AM9` LEG EXTENSIONS: 1 option | 'Leg extensions' (E12) [not an exact list value: list item is 'Leg Extensions'] | unset 'CHOSE 👇' | unset 'CHOSE 👇' | unset 'CHOSE 👇' |  |
| TUESDAY | 1 | Athletic (speed/power) block | 'Plyo' / 'PLYO' | AP_PLYO | `G7:G162` PLYOS: FOUNDATIONAL / MODERATE (plate hops) / MODERATE (hurdle hops) / ADVANCED; 41 options | 'CHOSE 👇' (E13) | unset 'CHOSE 👇' | unset 'CHOSE 👇' | unset 'CHOSE 👇' |  |
| TUESDAY | 2 | Athletic (speed/power) block | 'Throwing' / 'Throwing' | AP_THROW | `K7:K87` THROWING: one list, no levels; 20 options | 'CHOSE 👇' (E14) | unset 'CHOSE 👇' | unset 'CHOSE 👇' | unset 'CHOSE 👇' |  |
| TUESDAY | 3 | Athletic (speed/power) block | 'COD' / 'COD' | AP_COD | `L7:L242` CHANGE OF DIRECTION: FOUNDATIONAL 'EASY TURN' / MODERATE 'MOD. TURN' / ADVANCED 'HARD TURN'; 9 options | 'CHOSE 👇' (E15) | unset 'CHOSE 👇' | unset 'CHOSE 👇' | unset 'CHOSE 👇' |  |
| TUESDAY | 4 | Athletic (speed/power) block | 'Tripple Extension' / 'Tripple Extension' | AP_TRIPLE_EXT | `C7:C242` TRIPPLE EXTENSION: FOUNDATIONAL / MODERATE / ADVANCED (Olympic) / EASY (jumping ankle); 33 options | 'CHOSE 👇' (E16) | unset 'CHOSE 👇' | unset 'CHOSE 👇' | unset 'CHOSE 👇' |  |
| TUESDAY | 5 | Resistance block | 'Hamstring' / 'Bilateral HD' | RP_BHD | `AN7:AN122` BILATERAL HIP DOMNANT: FOUNDATIONAL / MODERATE / ADVANCED; 33 | 'CHOSE 👇' (E17) | unset 'CHOSE 👇' | unset 'CHOSE 👇' | unset 'CHOSE 👇' |  |
| TUESDAY | 6 | Resistance block | 'Chest' / 'Horizontal Push' | RP_HPUSH | `AD7:AD162` HORIZONTAL PUSH: FOUNDATIONAL / MODERATE / ADVANCED / UNILATERAL; 25 | 'CHOSE 👇' (E18) | unset 'CHOSE 👇' | unset 'CHOSE 👇' | unset 'CHOSE 👇' |  |
| TUESDAY | 7 | Resistance block | 'Hamstring/Glutes' / 'Unilateral HD' | RP_UHD intended -> ISO_HAM as wired | **`AR7:AR42` LEG CURLS (miswired; the other two tabs use `AQ7:AQ42` UNILATERAL HIP DOMINANT)**; 2 options | 'CHOSE 👇' (E19) | unset 'CHOSE 👇' | unset 'CHOSE 👇' | unset 'CHOSE 👇' |  |
| TUESDAY | 8 | Resistance block | 'Chest/Shoulders' / 'Vertical Push' | RP_VPUSH | `AA7:AA122` VERTICAL PUSH: FOUNDATIONAL / ADVANCED / UNILATERAL; 20 | 'CHOSE 👇' (E20) | unset 'CHOSE 👇' | unset 'CHOSE 👇' | unset 'CHOSE 👇' |  |
| TUESDAY | 9 | Resistance block | 'Hamstrings' / 'Leg Curls' | ISO_HAM | `AR7:AR10` LEG CURLS: 2 options | 'CHOSE 👇' (E21) | unset 'CHOSE 👇' | unset 'CHOSE 👇' | unset 'CHOSE 👇' |  |
| TUESDAY | 10 | Resistance block | 'Shoulders/Traps' / 'ABdution' | ISO_SIDE_REAR_DELT | `AH7:AH42` SIDE RAISES: one list; 12 | 'CHOSE 👇' (E22) | unset 'CHOSE 👇' | unset 'CHOSE 👇' | unset 'CHOSE 👇' |  |
| WEDNESDAY | 1 | Optional accessory / conditioning day | 'Calves' / (no CATEGORY) | ISO_CALF | `AU7:AU13` CALVES: 5 | 'CHOSE 👇' (E24) | unset 'CHOSE 👇' | unset 'CHOSE 👇' | unset 'CHOSE 👇' |  |
| WEDNESDAY | 2 | Optional accessory / conditioning day | 'Aerobic Capacity' / (no CATEGORY) | COND_AEROBIC | `B7:B122` CARDIO (truncated: DISTANCE + CALORIES blocks unreachable); 29 options | 'CHOSE 👇' (E25) | unset 'CHOSE 👇' | no REPS dropdown | unset 'CHOSE 👇' |  |
| WEDNESDAY | 3 | Optional accessory / conditioning day | 'Core' / (no CATEGORY) | CORE_CT_or_CP | `O7:O283` CORE THORAX + CORE PELVIS; 17 | 'CHOSE 👇' (E26) | unset 'CHOSE 👇' | unset 'CHOSE 👇' | unset 'CHOSE 👇' |  |
| WEDNESDAY | 4 | Optional accessory / conditioning day | 'Focus 1' / (no CATEGORY) | FOCUS | `AZ7:AZ335` FULL FOCUS LIST: 10 muscle groups; 51 | 'CHOSE 👇' (E27) | unset 'CHOSE 👇' | unset 'CHOSE 👇' | unset 'CHOSE 👇' |  |
| WEDNESDAY | 5 | Optional accessory / conditioning day | 'Focus 2' / (no CATEGORY) | FOCUS | `AZ7:AZ335` FULL FOCUS LIST: 10 muscle groups; 51 | 'CHOSE 👇' (E28) | unset 'CHOSE 👇' | unset 'CHOSE 👇' | unset 'CHOSE 👇' |  |
| THURSDAY | 1 | Athletic (speed/power) block | 'Plyo' / 'Plyo' | AP_PLYO | `G7:G162` PLYOS: FOUNDATIONAL / MODERATE (plate hops) / MODERATE (hurdle hops) / ADVANCED; 41 options | 'CHOSE 👇' (E30) | unset 'CHOSE 👇' | unset 'CHOSE 👇' | unset 'CHOSE 👇' |  |
| THURSDAY | 2 | Athletic (speed/power) block | 'Plyo' / 'Plyo' | AP_PLYO | `G7:G162` PLYOS: FOUNDATIONAL / MODERATE (plate hops) / MODERATE (hurdle hops) / ADVANCED; 41 options | 'CHOSE 👇' (E31) | unset 'CHOSE 👇' | unset 'CHOSE 👇' | unset 'CHOSE 👇' |  |
| THURSDAY | 3 | Athletic (speed/power) block | 'Throwing' / 'Throwing' | AP_THROW | `K7:K87` THROWING: one list, no levels; 20 options | 'CHOSE 👇' (E32) | unset 'CHOSE 👇' | unset 'CHOSE 👇' | unset 'CHOSE 👇' |  |
| THURSDAY | 4 | Athletic (speed/power) block | 'COD' / 'COD' | AP_COD | `L7:L242` CHANGE OF DIRECTION: FOUNDATIONAL 'EASY TURN' / MODERATE 'MOD. TURN' / ADVANCED 'HARD TURN'; 9 options | 'CHOSE 👇' (E33) | unset 'CHOSE 👇' | unset 'CHOSE 👇' | unset 'CHOSE 👇' |  |
| THURSDAY | 5 | Athletic (speed/power) block | 'Tripple Extension' / 'Tripple Extension' | AP_TRIPLE_EXT | `C7:C242` TRIPPLE EXTENSION: FOUNDATIONAL / MODERATE / ADVANCED (Olympic) / EASY (jumping ankle); 33 options | 'CHOSE 👇' (E34) | unset 'CHOSE 👇' | unset 'CHOSE 👇' | unset 'CHOSE 👇' |  |
| THURSDAY | 6 | Resistance block | 'Quads' / 'Bilateral KD' | RP_BKD | `AI7:AI122` BILATERAL KNEE DOMINANT: FOUNDATIONAL / MODERATE / ADVANCED; 35 | 'CHOSE 👇' (E35) | unset 'CHOSE 👇' | unset 'CHOSE 👇' | unset 'CHOSE 👇' |  |
| THURSDAY | 7 | Resistance block | 'Back' / 'Horizontal Pull' | RP_HPULL | `X7:X162` HORIZONTAL PULL: FOUNDATIONAL / ADVANCED / UNILATERAL; 16 | 'CHOSE 👇' (E36) | unset 'CHOSE 👇' | unset 'CHOSE 👇' | unset 'CHOSE 👇' |  |
| THURSDAY | 8 | Resistance block | 'Quads/Glutes' / 'Unilateral KD' | RP_UKD | `AL7:AL42` UNILATERAL KNEE DOMINANT: one list; 13 | 'CHOSE 👇' (E37) | unset 'CHOSE 👇' | unset 'CHOSE 👇' | unset 'CHOSE 👇' |  |
| THURSDAY | 9 | Resistance block | 'Back ' / 'Vertical Pull' | RP_VPULL | `U7:U122` VERTICAL PULL: FOUNDATIONAL / ADVANCED / UNILATERAL; 20 | 'CHOSE 👇' (E38) | unset 'CHOSE 👇' | unset 'CHOSE 👇' | unset 'CHOSE 👇' |  |
| THURSDAY | 10 | Resistance block | 'Quads' / 'Leg Extensions' | ISO_QUAD | `AM7:AM9` LEG EXTENSIONS: 1 option | 'Leg extensions' (E39) [not an exact list value: list item is 'Leg Extensions'] | unset 'CHOSE 👇' | unset 'CHOSE 👇' | unset 'CHOSE 👇' |  |
| FRIDAY | 1 | Athletic (speed/power) block | 'Plyo' / 'PLYO' | AP_PLYO | `G7:G162` PLYOS: FOUNDATIONAL / MODERATE (plate hops) / MODERATE (hurdle hops) / ADVANCED; 41 options | 'CHOSE 👇' (E40) | unset 'CHOSE 👇' | unset 'CHOSE 👇' | unset 'CHOSE 👇' |  |
| FRIDAY | 2 | Athletic (speed/power) block | 'Throwing' / 'Throwing' | AP_THROW | `K7:K87` THROWING: one list, no levels; 20 options | 'CHOSE 👇' (E41) | unset 'CHOSE 👇' | unset 'CHOSE 👇' | unset 'CHOSE 👇' |  |
| FRIDAY | 3 | Athletic (speed/power) block | 'COD' / 'COD' | AP_COD | `L7:L242` CHANGE OF DIRECTION: FOUNDATIONAL 'EASY TURN' / MODERATE 'MOD. TURN' / ADVANCED 'HARD TURN'; 9 options | 'CHOSE 👇' (E42) | unset 'CHOSE 👇' | unset 'CHOSE 👇' | unset 'CHOSE 👇' |  |
| FRIDAY | 4 | Athletic (speed/power) block | 'Tripple Extension' / 'Tripple Extension' | AP_TRIPLE_EXT | `C7:C242` TRIPPLE EXTENSION: FOUNDATIONAL / MODERATE / ADVANCED (Olympic) / EASY (jumping ankle); 33 options | 'CHOSE 👇' (E43) | unset 'CHOSE 👇' | unset 'CHOSE 👇' | unset 'CHOSE 👇' |  |
| FRIDAY | 5 | Resistance block | 'Hamstring' / 'Bilateral HD' | RP_BHD | `AN7:AN122` BILATERAL HIP DOMNANT: FOUNDATIONAL / MODERATE / ADVANCED; 33 | 'CHOSE 👇' (E44) | unset 'CHOSE 👇' | unset 'CHOSE 👇' | unset 'CHOSE 👇' |  |
| FRIDAY | 6 | Resistance block | 'Chest' / 'Horizontal Push' | RP_HPUSH | `AD7:AD162` HORIZONTAL PUSH: FOUNDATIONAL / MODERATE / ADVANCED / UNILATERAL; 25 | 'CHOSE 👇' (E45) | unset 'CHOSE 👇' | unset 'CHOSE 👇' | unset 'CHOSE 👇' |  |
| FRIDAY | 7 | Resistance block | 'Hamstring/Glutes' / 'Unilateral HD' | RP_UHD intended -> ISO_HAM as wired | **`AR7:AR42` LEG CURLS (miswired; the other two tabs use `AQ7:AQ42` UNILATERAL HIP DOMINANT)**; 2 options | 'CHOSE 👇' (E46) | unset 'CHOSE 👇' | unset 'CHOSE 👇' | unset 'CHOSE 👇' |  |
| FRIDAY | 8 | Resistance block | 'Chest/Shoulders' / 'Vertical Push' | RP_VPUSH | `AA7:AA122` VERTICAL PUSH: FOUNDATIONAL / ADVANCED / UNILATERAL; 20 | 'CHOSE 👇' (E47) | unset 'CHOSE 👇' | unset 'CHOSE 👇' | unset 'CHOSE 👇' |  |
| FRIDAY | 9 | Resistance block | 'Hamstrings' / 'Leg Curls' | ISO_HAM | `AR7:AR10` LEG CURLS: 2 options | 'CHOSE 👇' (E48) | unset 'CHOSE 👇' | unset 'CHOSE 👇' | unset 'CHOSE 👇' |  |
| FRIDAY | 10 | Resistance block | 'Shoulders/Traps' / 'ABdution' | ISO_SIDE_REAR_DELT | `AH7:AH42` SIDE RAISES: one list; 12 | 'CHOSE 👇' (E49) | unset 'CHOSE 👇' | unset 'CHOSE 👇' | unset 'CHOSE 👇' |  |
| SATURDAY | 1 | Optional accessory / conditioning day | 'Calves' / (no CATEGORY) | ISO_CALF | `AU7:AU13` CALVES: 5 | 'CHOSE 👇' (E51) | unset 'CHOSE 👇' | unset 'CHOSE 👇' | unset 'CHOSE 👇' |  |
| SATURDAY | 2 | Optional accessory / conditioning day | 'Aerobic Capacity' / (no CATEGORY) | COND_AEROBIC | `B7:B122` CARDIO (truncated: DISTANCE + CALORIES blocks unreachable); 29 options | 'CHOSE 👇' (E52) | unset 'CHOSE 👇' | no REPS dropdown | unset 'CHOSE 👇' |  |
| SATURDAY | 3 | Optional accessory / conditioning day | 'Core' / (no CATEGORY) | CORE_CT_or_CP | `O7:O283` CORE THORAX + CORE PELVIS; 17 | 'CHOSE 👇' (E53) | unset 'CHOSE 👇' | unset 'CHOSE 👇' | unset 'CHOSE 👇' |  |
| SATURDAY | 4 | Optional accessory / conditioning day | 'Focus 1' / (no CATEGORY) | FOCUS | `AZ7:AZ335` FULL FOCUS LIST: 10 muscle groups; 51 | 'CHOSE 👇' (E54) | unset 'CHOSE 👇' | unset 'CHOSE 👇' | unset 'CHOSE 👇' |  |
| SATURDAY | 5 | Optional accessory / conditioning day | 'Focus 2' / (no CATEGORY) | FOCUS | `AZ7:AZ335` FULL FOCUS LIST: 10 muscle groups; 51 | 'CHOSE 👇' (E55) | unset 'CHOSE 👇' | unset 'CHOSE 👇' | unset 'CHOSE 👇' |  |
| SUNDAY | - | OFF | 'OFF' | REST | - | 'OFF' | 'OFF' | 'OFF' | 'OFF' | rows 57-63 merged |

## C3. Rules visible

Same skeleton and ordering rules as ATHLETIC (A3). Two OBSERVED deviations change what a client can build:
1. **B-day composition as wired**: 'Bilateral HD' -> 'Horizontal Push' -> *leg curl* (in the 'Unilateral HD' slot) -> 'Vertical Push' -> 'Leg Curls' -> 'ABdution' = two knee-flexion isolations and no single-leg hinge. This breaks the "bilateral + unilateral of the day's dominance" rule that every other tab follows (*INFERRED*: a copy/paste slip from AQ to AR; the odd range end 42 matches AQ's range, not AR's 7:10).
2. **Leg-extension default**: the exercise ('Leg extensions') is pre-filled on both A days, but no rep method; the ATHLETIC tab does the opposite (MYO SET pre-set, exercise open).

## C4. Quantitative volume

As written: 0 sets (every SETS cell 'CHOSE 👇'); 2 exercises named ('Leg extensions' x 2). Exercises per session 10 / 10 / 5 / 10 / 10 / 5 / OFF.

| Scenario | Total sets | Athletic | Resistance + iso + core | Bucket differences vs ATHLETIC |
|---|---|---|---|---|
| @2 sets, 4 main days, **as wired** | 80 | 36 | 44 | RP_UHD 0, ISO_HAM 8 |
| @2 sets, 6 days, as wired | 96 (+2 aerobic bouts, 8 focus) | 36 | 52 | RP_UHD 0, ISO_HAM 8 |
| @3 sets, 6 days, as wired | 144 (+2 bouts, 12 focus) | 54 | 78 | RP_UHD 0, ISO_HAM 12 |
| any scenario **if the wiring is fixed** | identical to ATHLETIC | | | RP_UHD 4/6, ISO_HAM 4/6 |

Weekly resistance sets per muscle, as wired @2 (6-day): quads 12, **glutes 10** (vs 14 when fixed), hamstrings 12, chest 6, lats/upper back 8, front delts 8, side delts 6, rear delts 2, biceps 4, triceps 4, calves 4, abs/obliques 4. @3 (6-day): glutes 15 (vs 21), all others as ATHLETIC @3. Hamstring totals do not change (the leg-curl slot still credits hamstrings 1.0) - the miswire only moves volume from hinge to knee flexion and removes glute work.

## C5. Rep ranges, intensity, rest, tempo

No reps chosen anywhere (not even the 'MYO SET' default). REPS menu, EFFORT and HOW IT FELT? menus as in JUSTICE LEAGUE. No rest, tempo or intensity targets.

## C6. Progression

None (WEEK 1 only). Same levers and the same inferred 3/5/7 % projection as section A6.

## C7. What this reveals (*INFERRED*)

The coach maintains more than one copy of the athletic template, with different defaults and different finishing quality. The hidden copy looks like an earlier or parallel build (typo placeholders, a wiring slip) that was superseded by the visible ATHLETIC/JUSTICE LEAGUE pair. For the generator, treat ATHLETIC as the canonical skeleton and use this tab only for its explicit "4 to 6 days" framing.

---

# D. Cross-reference: level-to-level numbers in the filled sibling (MASTER_MODEL)

The BYOP tabs have no level progression, but MASTER_MODEL 'EXAMPLE ATHLETIC FULL BODY SPLI' is a filled athletic full-body program with three levels side by side (OBSERVED; counted here only to inform the assumptions above). Header colours use the same traffic light as the library levels.

| Level header (fill) | Workouts | Exercises per workout | Working sets per workout | Sets per exercise (avg) |
|---|---|---|---|---|
| 'STARTING OFF SEASON WORKOUTS' (93C47D green) | 3 | 10, 6 (+ 'TABATA'), 7 | 27, 14, 21 | about 2.7 |
| ' MID OFF SEASON WORKOUTS' (FFD966 yellow) | 4 | 10, 14, 8, 16 | 15, 30, 17, 31 ('2 to 4' counted as 2) | about 1.9 |
| ' ADVANCED OFF SEASON WORKOUTS' (E06666 red) | 4 | 6, 6, 8, 6 | 11, 12, 13, 10 | about 1.8 |

Its plan notes (A41-A45): 'First 8 weeks (8wk1) adaptation focus:', 'Bring athletes back to feeling/moving great', 'Start ramping up volume of work at highest biomechanical demand', 'Introduce more specific unilateral demands', 'Drive more strength/power/speed'. *INFERRED*: as level rises the coach cuts exercises per session and sets per exercise while raising intensity and specificity (e.g. 'DEADLIFTS (1RIR)' 3 x 1, 'Power Cleans' 3 x 3 at ADVANCED). JUSTICE LEAGUE's 2 sets per slot and 6-8 / 8-12 reps sit at the MID column's dosing. Multi-week percentage ramps (e.g. 'Hang cleans @ 75%' -> '@ 80%' -> '@ 85%' -> '@ 90%', 'DELOAD WEEK') exist only in MASTER_MODEL 'BASEBALL', not in BYOP.

---

# E. Generator-ready summary (OBSERVED rules, *INFERRED* parameters flagged)

1. **Skeleton** (OBSERVED): A = [AP_PLYO, AP_PLYO, AP_THROW, AP_COD, AP_TRIPLE_EXT, RP_BKD, RP_HPULL, RP_UKD, RP_VPULL, ISO_QUAD]; B = [AP_PLYO, AP_THROW, AP_COD, AP_TRIPLE_EXT, RP_BHD, RP_HPUSH, RP_UHD, RP_VPUSH, ISO_HAM, ISO_SIDE_REAR_DELT]; OPT = [ISO_CALF, COND_AEROBIC, CORE (CT or CP), FOCUS, FOCUS]; week = A, B, OPT, A, B, OPT, OFF.
2. **Default dose** (OBSERVED in JUSTICE LEAGUE): 2 sets per slot; reps 6-8 for plyo/COD/Olympic/bilateral squat, 8-12 for throws/rows/lunges/pull-ups, MYO SET for leg extensions.
3. **Session budget** (OBSERVED): 10 exercises / about 20 sets on training days; 5 exercises on optional days.
4. **Variation rule** (OBSERVED once, *INFERRED* as a rule): the second weekly exposure of a slot uses a different exercise from the same list (front squat -> low-bar back squat) or the unilateral/harder version of the same drill (depth drop -> SL depth drop).
5. **Sport tuning knobs** (*INFERRED*, consistent with the coach's words "basketball more plyos, boxers/karate fewer, MMA in between"): number of Plyo slots per week (template: 6 = 2 on A days + 1 on B days), which jump track fills them (landing / ankle-stiffness / full jumping / sprint), COD turn level, throw type (sagittal vs rotational), and how the 10-slot budget is traded between athletic and resistance slots. None of these sport values are written in the sheets.
6. **Volume accounting**: count resistance sets toward the coach's 15-20 sets/muscle/week; keep athletic sets as a separate exposure count (open question for the coach). At 2 sets/slot the template gives legs 12-14 and upper body 2-8 sets/week; reaching 15-20 needs 3 sets/slot on lower-body slots or Focus slots aimed at the lagging muscle.

---

# F. Open questions for the coach

1. Is **2 sets per slot** your default for every athletic template, or was it specific to Justice League (phase, age, in-season)?
2. Who wrote **'LATERAL', 'SINGLE ARM' and 'OUCH'** in the 'WEIGHT USED or SCORE' column: you as cues, or the athlete as a log? Should the generator have a separate cue/notes field?
3. Who or what is **"Justice League"** (team, sport, age group, season phase)?
4. What does **'NO ACCESS'** mean on the hidden tabs (no coach access / self-serve, locked master copy, or no equipment)? Is the leg-curl wiring on its 'Unilateral HD' slots a mistake (should it be the UNILATERAL HIP DOMINANT list)?
5. How should these templates run across **6, 8 or 12 weeks**: repeat Week 1 and move slots down the level ladder, add sets by 3/5/7 %, or both? Merged cell A64:A70 looks like the start of an unbuilt Week 2.
6. Should **athletic sets** (plyos, throws, COD, cleans) count toward the 15-20 sets per muscle per week, or only resistance sets?
7. The REPS menu starts at '4 to 6 Reps'. Do you want '1 to 3' / '3 to 5' for Olympic lifts and heavy work, and units for contacts, seconds, meters and per-side reps for plyos/COD/unilateral work?
8. Are the **two Plyo slots on A days** meant to come from two different jump tracks (landing + ankle hops), as you did on Justice League Monday?
9. Is varying the exercise between the two weekly exposures of a slot (Front Squats Monday, Low Bar Back Squat Thursday) a rule for every slot, or only for the main lifts?
10. For sport profiles, which slots shrink or grow? For example, for boxers/karate do Plyo slots drop from 6 to 2-4 per week and get replaced by throws, and for basketball does a B-day slot become a second plyo?
11. Aerobic work: the template has **2 'Aerobic Capacity' slots** but the AEROBIC CAPACITY CHEAT SHEET asks for 3 per week. Which one wins? (Also, the cardio dropdown cuts off the DISTANCE and CALORIES options.)
12. Is 'MYO SET' meant as the default for **both** leg-extension slots (only Monday G12 is preset)?
13. On Focus days, how many Focus sets per week should a chosen muscle get, and can both Focus slots go to the same muscle?
14. Thursday's DAY cell is a single space in ATHLETIC and Justice League: just a missed label, or was Thursday meant to be different?
15. Why does the athletic template drop direct **bicep/tricep/calf** work from training days: because the athletic block covers calves and arms are low priority, or to save the session budget?
