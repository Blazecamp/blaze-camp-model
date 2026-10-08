# L1: MASTER EXERCISE LIBRARY, columns A to N (CARDIO + ATHLETIC patterns)

Source: BYOP workbook ("BUILD YOUR OWN PROGRAM - BLAZE CAMP MODEL"), tab `MASTER EXERCISE LIBRARY`, read from the raw xlsx and the dumps. I did not modify any sheet.
Companion data: `L1_cardio_athletic.json`. It is a JSON array with **216 records**:

* **210 records come from BYOP columns A to N**, one per exercise cell.
  * **146** are in the "stacked" columns B, C, G, K and L. Templates use these as dropdown sources.
  * **64** are in the side-by-side duplicate columns D, E, F, H, I, J, M and N.
* **6 supplementary records** come from the MASTER_MODEL tab `Sheet23`. They are athletic items that do not appear in BYOP A to N. Their `record_scope` starts with "SUPPLEMENTARY".

After collapsing duplicates there are **129 unique item names**. One of them is a coaching note and not an exercise (G53).

Evidence legend used throughout:
* **OBSERVED** means the value is printed in a cell, a header, a fill colour or a data-validation rule.
* **INFERRED** means it is my interpretation.

Every JSON record carries:
* `observed_fields`
* `inferred_fields`
* `name_derived_fields`, for values parsed out of the exercise name itself, such as "SL" meaning unilateral or "Lateral" meaning frontal plane.

---

## 1. What lives in columns A to N

| Col | Row 1 "Segment" | Row 2 | Row 3 ZONE | Row 4 PATTERN | Row 5 (sub-pattern, unlabelled) | Row 6 PURPOSE | Role | Items | Dropdown range used by templates |
|---|---|---|---|---|---|---|---|---|---|
| A | (label column) | n/a | `ZONE` (A3) | `PATTERN` (A4) | (blank A5) | `PURPOSE` (A6) | row-label column | 0 | n/a |
| B | `CARDIO` | `FILL HERE` | (blank) | `CARDIO` | (blank) | `CARDIO` | stacked, sub-blocks | 43 | `B7:B122` (8 template tabs); `B7:B335` (BOOTCAMP - OPTION 2 E7 E12 E22 E27) |
| C | `TRIPPLE EXTENSION` (merged C1:F1) | `FILL HERE` | `EASY` | `ATHLETIC` | `TRIPPLE EXTENSION` | `SPEED/POWER` | **stacked** (4 level blocks) | 33 | `C7:C242` |
| D | (merged) | n/a | `MODERATE` | `ATHLETIC` | `TRIPPLE EXTENSION` | `SPEED/POWER` | side-by-side duplicate of C46:C54 | 9 | none |
| E | (merged) | n/a | `ADVANCED` | `ATHLETIC` | `TRIPPLE EXTENSION` | `SPEED/POWER` | duplicate of C91:C96 | 6 | none |
| F | (merged) | n/a | `EASY` | `ATHLETIC` | `JUMPING ANKLE` | `SPEED/POWER` | duplicate of C126:C136 | 11 | none |
| G | `PLYOS` (merged G1:J1) | `FILL HERE` | `EASY` | `ATHLETIC` | `PLYO` | `SPEED/POWER` | **stacked** (4 level blocks) | 41 | `G7:G162` |
| H | (merged) | n/a | `MODERATE` | `ATHLETIC` | `PLYO` | `SPEED/POWER` | duplicate of G46:G57 | 12 | none |
| I | (merged) | n/a | `MODERATE` | `ATHLETIC` | `PLYO` | `SPEED/POWER` | duplicate of G91:G96 | 6 | none |
| J | (merged) | n/a | `ADVANCED` | `ATHLETIC` | `FULL JUMPING` | `SPEED/POWER` | duplicate of G126:G141 | 16 | none |
| K | `THROWING` | `FILL HERE` | `AP - THROWING` | `ATHLETIC` | `THROWING` | `SPEED/POWER` | single list, no levels | 20 | `K7:K87` |
| L | `CHANGE OF DIRECTION` (merged L1:N1) | `FILL HERE` | `EASY  ` (2 trailing spaces) | `ATHLETIC` | `EASY TURN` | `CHANGE OF DIRECTION` | **stacked** (3 level blocks) | 9 | `L7:L242` |
| M | (merged) | n/a | `MODERATE` | `ATHLETIC` | `MOD. TURN` | `CHANGE OF DIRECTION` | duplicate of L46:L47 | 2 | none |
| N | (merged) | n/a | `ADVANCED` | `ATHLETIC` | `HARD TURN` | `CHANGE OF DIRECTION` | duplicate of L91:L92 | 2 | none |

Templates that use these dropdowns (OBSERVED from data validations):

* **CARDIO B** has slots in 8 tabs:
  * AESTHETICS - FULL BODY - 4 DAYS
  * 3 DAY BUILDER
  * ATHLETIC - FULL BODY - 4 DAYS A
  * JUSTICE LEAGUE
  * BOOTCAMP - OPTION 1
  * BOOTCAMP - OPTION 2
  * NO ACCESS - AESTHETICS - FB - 4
  * NO ACCESS - ATHLETIC - FB - 4 t

  PUSHPULLLEGS has no cardio slot.
* **C, G, K and L** feed only the 3 athletic templates:
  * ATHLETIC - FULL BODY - 4 DAYS A
  * JUSTICE LEAGUE
  * NO ACCESS - ATHLETIC - FB - 4 t

  In those templates the slots and labels are:

  | Slots | Column C label | Dropdown source |
  |---|---|---|
  | E3:E4, E13, E30:E31, E40 | 'Plyo' | `G` |
  | E5, E14, E32, E41 | 'Throwing' | `K` |
  | E6, E15, E33, E42 | 'COD' | `L` |
  | E7, E16, E34, E43 | 'Tripple Extension' | `C` |
  | E25, E52 | 'Aerobic Capacity' | `B` |

**No template references the side-by-side columns D, E, F, H, I, J, M or N.** They are a human-readable overview only. All selection happens through the stacked columns.

---

## 2. Header rows 1 to 7: what each one means

* **Row 1, "Segment".** This is the movement bucket, such as `CARDIO`, `TRIPPLE EXTENSION`, `PLYOS`, `THROWING` or `CHANGE OF DIRECTION`. The label "Segment" is OBSERVED in A1 of both library copies. In the master it is merged across each segment's columns (C1:F1, G1:J1, L1:N1). Row-1 fills are greys only (EFEFEF, CCCCCC, B7B7B7, D9D9D9, 999999), alternating to separate adjacent segments. INFERRED: the greys carry no meaning.
* **Row 2, `FILL HERE`.** Light-grey text (F3F3F3) on a **solid black fill** (FF000000). The dump hid the black, but the raw xlsx shows it. It appears only on the first ("primary") column of each segment: B, C, G, K, L, and also O, U, X, AA, AD, AH, AI and onward. Side-by-side columns carry their pastel fill in row 2 with no text. INFERRED: a template placeholder or instruction strip for the BYOP user, meaning "type your own exercise into this list". It has no data function. See open questions.
* **Row 3, `ZONE`** (label in A3). This is the difficulty tier: `EASY`, `MODERATE` or `ADVANCED`. Elsewhere in the sheet it also reads `FOUNDATIONAL`, `INTERMEDIATE`, `HARD` or `ANY`, or a code such as `AP - THROWING`, `RP - BS - KNEE DOMINANT`, `RP - UL - ...`. OBSERVED: "ZONE" is the coach's word for level. The vocabulary is mixed:

  | Stacked block label (row 8/44/89) | Row-3 zone label | Sheet23 label |
  |---|---|---|
  | `FOUNDATIONAL` | `EASY` | `FOUNDATIONAL` / `FOUNDATINONAL` |
  | `MODERATE` | `MODERATE` | `INTERMEDIATE` |
  | `ADVANCED` | `ADVANCED` | `ADVANCED` |

  Elsewhere `HARD` is used in Q3. Normalised: foundational, intermediate, advanced, or `any` where there are no tiers.
* **Code inside row 3.** `AP` means **Athletic Pattern** and `RP` means **Resistance Pattern**. INFERRED, but strongly supported: row 4 PATTERN reads `ATHLETIC` / `RESISTANCE` in exactly those columns, and Sheet23 headers read "FOUNDATIONAL - AP - TRIPPLE EXT" and "FOUNDATIONAL - RP - BS - VERTICAL PULL". `BS` is "BILATERAL SYMMETRICAL" and `UL` is "UNILATERAL"; both are OBSERVED in row 5 of the resistance columns.
* **Row 4, `PATTERN`.** This is the family. In A to N it is `CARDIO` (B) or `ATHLETIC` (C to N). Elsewhere it is `CONTROL` (core), `RESISTANCE` or `FUNCTIONAL`. It maps one-to-one to the JSON `family`.
* **Row 5 (unlabelled), sub-pattern.**
  * TRIPLE EXTENSION has `TRIPPLE EXTENSION` and `JUMPING ANKLE`.
  * PLYOS has `PLYO` and `FULL JUMPING`.
  * THROWING has `THROWING`.
  * COD has `EASY TURN`, `MOD. TURN` and `HARD TURN`.
  * In the core and resistance columns the same row holds plane or laterality (`CORE THORAX SAGITAL`, `BILATERAL SYMMETRICAL`, `UNILATERAL`). So row 5 is the "how it is performed" qualifier.
* **Row 6, `PURPOSE`.** This is the training goal, and it has its own colour code:
  * `CARDIO` is green 93C47D.
  * `SPEED/POWER` is red-orange CC4125, used for all of C to K.
  * `CHANGE OF DIRECTION` is purple 8E7CC3, used for L to N.
  * Elsewhere: `CORE` is green; `BACK`, `SHOULDERS/TRAPS`, `CHEST/FRONT DELTS`, `QUADS` and so on are muscle targets.

  So in A to N the purpose is a **quality** (speed/power, COD, cardio), while in the resistance columns it is a **muscle**. This is the coach's split between "athletic patterns" and "resistance patterns".
* **Row 7, `CHOOSE 👇`** on green 93C47D in every column. Every template dropdown range starts at row 7, so this is the default or prompt option. Unfilled template cells literally contain `CHOOSE 👇` (876 occurrences across the BYOP templates).

---

## 3. Level-block mechanics (stacked vs side-by-side)

The sheet is built in **horizontal bands separated by solid-black divider rows at 43, 88, 123, 163, 203, 243 and 283** (OBSERVED fills). The dividers are visible in column A and in the side-by-side columns D–F, H–J and M–N. Full-width black rows also sit at 310 and 330.

**Band 1 (rows 3–42) is the overview.** Each level of a segment is shown side by side, one column per level:

| Segment | EASY | MODERATE | ADVANCED |
|---|---|---|---|
| TRIPLE EXTENSION | C (EASY) | D | E, plus F for JUMPING ANKLE (EASY) |
| PLYOS | G | H and I (two MODERATE columns) | J |
| COD | L | M | N |

Items start at row 9. The primary columns (C, G, L) also have a block label in row 8 (`FOUNDATIONAL`).

**Bands 2 to 4 are the stacked copy for the dropdown.** Each further level is re-entered vertically in the primary column, one level per band. Every block starts right after a black divider:

| Primary col | Band 1 label row 8 | Band 2 label row 44, `CHOOSE 👇` row 45 | Band 3 label row 89, `CHOOSE 👇` row 90 | Band 4 label row 124, `CHOOSE 👇` row 125 |
|---|---|---|---|---|
| C | `FOUNDATIONAL`, C9:C15 | `MODERATE`, C46:C54 (= D9:D17) | `ADVANCED`, C91:C96 (= E9:E14) | `EASY`, C126:C136 (= F9:F19) |
| G | `FOUNDATIONAL`, G9:G15 | `MODERATE`, G46:G57 (= H9:H20) | `MODERATE`, G91:G96 (= I9:I14) | `ADVANCED`, G126:G141 (= J9:J24) |
| L | `FOUNDATIONAL`, L9:L13 | `MODERATE`, L46:L47 (= M9:M10) | `ADVANCED`, L91:L92 (= N9:N10) | (none) |

Cardio column B has no levels. It uses the same band anchors for sub-blocks:

| Label row | Sub-block | Items |
|---|---|---|
| B8 | `SPEED INTERVALS` | B9:B13 |
| B14 | `DISTANCE INTERVALS` | B15:B17 |
| B24 | `DISTANCE TEST` | B25:B33 |
| B44 | `SPEED TEST` | B45:B47 |
| B89 | `DISTANCE TEST` | B90:B98, exact duplicate of B25:B33 |
| B123 | `DISTANCE` | B124:B128 |
| B132 | `CALORIES` | B133:B141 |

`DISTANCE` sits on divider row 123, one row early.

**Parity check (OBSERVED, character for character):**

| Side-by-side range | Stacked range | Items |
|---|---|---|
| D9:D17 | C46:C54 | 9 |
| E9:E14 | C91:C96 | 6 |
| F9:F19 | C126:C136 | 11 |
| H9:H20 | G46:G57 | 12 |
| I9:I14 | G91:G96 | 6 |
| J9:J24 | G126:G141 | 16 |
| M9:M10 | L46:L47 | 2 |
| N9:N10 | L91:L92 | 2 |

All pairs are **identical**, including leading and trailing spaces and the date-corrupted cell. The lists do **not** differ. Every JSON record has `mirror_cell`, `is_dropdown_source` and `same_name_other_cells_A_to_N`. A generator should use only `is_dropdown_source == true` rows, or deduplicate on `exercise_key` plus `level.normalized`.

**Dropdown ranges are sized in whole bands (OBSERVED).**

| Range ends at | Bands covered | Ranges |
|---|---|---|
| 42 | band 1 | `AT/AH/AS/AL/AQ/AV/AW/AX/AY 7:42` |
| 87 | bands 1–2 | `K7:K87` |
| 122 | bands 1–3 | `B/U/AA/AI/AN 7:122` |
| 162 | bands 1–4 | `G/X/AD 7:162` |
| 242 | bands 1–6 | `C/L 7:242` |
| 283 | bands 1–7 | `O7:O283` |

The coach reserves bands for growth.

**Consequence:** the cardio blocks `DISTANCE` (B123:B128) and `CALORIES` (B132:B141) fall in band 4, outside `B7:B122`. **Most templates cannot select them.** Only BOOTCAMP - OPTION 2 cardio slots E7, E12, E22 and E27 use `B7:B335`; slots E15 and E30 in that same tab still use B7:B122. This is either a range never widened or a deliberate "bootcamp-only conditioning" rule. See open questions.

**Inside a dropdown** the labels (`FOUNDATIONAL`, `MODERATE`, `SPEED INTERVALS`...) and the repeated `CHOOSE 👇` rows are selectable options. They act as section dividers, so a generator must filter them out. They are not in the JSON.

**The cardio slot has no REPS dropdown (OBSERVED).**

| Template | REPS-dropdown ranges | Cardio row(s) skipped |
|---|---|---|
| Athletic | `G3:G22 G24 G26:G28 ...` | 25 and 52 ('Aerobic Capacity') |
| Aesthetics | `F3:F16 F18 F20:F22 ...` | 19 |

So cardio items are **self-dosing**: the prescription is the item name ("3 min Fast - 2 min walk", "15 cals").

---

## 4. Colour meanings

**OBSERVED patterns** (my interpretation is marked):

* **Segment hue.** Each athletic segment has a hue, used for row 3 to 5 headers and all items:

  | Segment | Saturated / dark | Pastel tint |
  |---|---|---|
  | TRIPLE EXTENSION | purple 8E7CC3 | D9D2E9 |
  | PLYOS | red CC0000 | F4CCCC |
  | THROWING | orange F6B26B (single column) | n/a |
  | COD | yellow FFD966 | FFF2CC |
  | CARDIO | green 93C47D | n/a |

* **Saturated vs pastel = primary/foundational column vs higher-level columns.** In each segment the EASY/FOUNDATIONAL column, which is also the stacked dropdown column, uses the saturated shade. Its stacked MODERATE and ADVANCED blocks keep the saturated shade too. The side-by-side MODERATE and ADVANCED duplicate columns use the pastel tint. The same rule holds across the whole sheet:
  * U3 93C47D FOUNDATIONAL vs V3 D9EAD3 ADVANCED
  * AD3 6FA8DC vs AE3/AF3 CFE2F3
  * AI3 FFD966 vs AJ3/AK3 FFF2CC
  * Unilateral columns usually get a third, mid tone: AG 9FC5E8, AL FFE599, AQ B6D7A8, W/Z 76A5AF. AC3 'RP - UL - VERTICAL PUSH' is the exception and reuses the dark 6FA8DC.

  INFERRED meaning: the strong colour marks "base list / start here", and the pastel marks "progressions of the same thing". **Colour is not a universal level code.** The same hex, 93C47D, is both cardio and "FOUNDATIONAL vertical pull", so a generator must use the text labels, not colours.
* **Row 6 PURPOSE colours** are a separate purpose code: CC4125 for SPEED/POWER, 8E7CC3 for CHANGE OF DIRECTION, 93C47D for CARDIO/CORE.
* **Green 93C47D `CHOOSE 👇`** marks every dropdown prompt row: row 7, and rows 45, 90 and 125 in the stacked columns.
* **Black (FF000000)** is used for structural dividers (rows 43, 88, 123...) and the row-2 `FILL HERE` strip.
* **Single bold item.** `400m` (B125) is the only bold item in column B; everything else is regular weight. Meaning unknown (open question).
* **MASTER_MODEL `Sheet23` zone colours, for comparison.** ZONE 1 is green B6D7A8, ZONE 2 yellow FFF2CC and ZONE 3 red F4CCCC. This is the traffic-light reading the coach uses for "zones" elsewhere, which supports reading ZONE as an intensity or difficulty tier.
* **Copy-of-copy red headers.** In `Copy of Copy of MASTER EXERCISE` some row-1 headers have **red font** (FF0000): TRIPPLE EXTENSION, PLYOS, THROWING, CORE THORAX, CORE PELVIS, HORIZONTAL PULL, BILATERAL KNEE DOMINANT, UNILATERAL KNEE DOMINANT, LEG EXTENSIONS, BILATERAL HIP DOMNANT, UNILATERAL HIP DOMINANT and LEG CURLS. CARDIO and CHANGE OF DIRECTION stay black. Meaning unknown (open question).

---

## 5. Progression tracks: the real structure behind the columns

MASTER_MODEL `Sheet23` is a flattened twin of this library, with one column per block. It names every block explicitly, typos verbatim. That reveals tracks the BYOP layout hides:

| BYOP block | Sheet23 header (verbatim) | Track |
|---|---|---|
| C9:C15 | `FOUNDATIONAL - AP - TRIPPLE EXT ` | triple-extension lifts |
| C46:C54 / D | `INTERMEDIATE - AP - TRIPPLE EXT` | triple-extension lifts |
| C91:C96 / E | `ADVANCED - AP - TRIPPLE EXT` | triple-extension lifts |
| C126:C136 / F | `FOUNDATINONAL - AP - JUMPING LIMITED KNEE` | **ankle / limited-knee jumping** |
| G9:G15 | `FOUNDATINONAL - AP - PLYOS` | plyos (landings, box jumps) |
| G46:G57 / H | `INTERMEDIATE - AP - JUMPING LIMITED KNEE` | **ankle / limited-knee jumping** (plate hops) |
| G91:G96 / I | `INTERMEDIATE - AP - PLYOS` | plyos (hurdles) |
| G126:G141 / J | `ADVANCED - AP -JUMPING` | full jumping, where both jump tracks converge |
| K | `AP - THROWING` | throwing |
| L9:L13 / L46:L47 / L91:L92 | `FOUNDATIONAL / INTERMEDIATE / ADVANCED - AP - COD` | COD |

Key structural insight (INFERRED from the Sheet23 names):

* **"JUMPING ANKLE" (F) and the first PLYO MODERATE block (H) are one track.** It runs from limited-knee, ankle-stiffness jumping (ankle hops) to the same thing on plates.
* **The second PLYO MODERATE block (I) continues the landing/box track** into hurdles.
* **Both tracks feed `FULL JUMPING` (J).**

BYOP splits the ankle track across two segments: F sits under the TRIPLE EXTENSION header, because the ankle is the third joint of triple extension, while H sits under PLYOS. That is why PLYOS has **two `MODERATE` columns**.

---

## 6. Segment-by-segment decoding and ordering logic

### CARDIO (B), 43 cells, 34 unique

Self-dosing prescriptions, ordered by ascending duration or distance inside each sub-block.

* **`SPEED INTERVALS`.** Work grows from 2 to 6 min while walk-rest goes 1, 2, 3, 2, 1 min. Work-to-rest density therefore rises (2:1 to 6:1). "Fast" means a fast run, not a sprint; the coach's BASEBALL tab says "This is NOT a sprint, this is a fast run".
* **`DISTANCE INTERVALS`.** 1, 2 and 3 miles, with rest of 1 min per mile.
* **`DISTANCE TEST`.** 1, 3, 5, 8, 11, 14, 17, 20 and **21.6** miles. The block appears twice (B24 and B89).
* **`SPEED TEST`.** 800 m, 1 mile and 3 miles for time. The copy-of-copy renames it **`SPEED ENDURANCE TEST`**, which matches the BASEBALL band "SPEED ENDURANCE >40 Secs".
* **`DISTANCE`.** 200 to 1000 m, modality unstated.
* **`CALORIES`.** 10 to 50 cal in steps of 5. Machines are inferred from coach usage: "15 cal bike sprint", "10 cal row sprint or ski".

Each item maps to the coach's own **AEROBIC CAPACITY CHEAT SHEET** bands (`aerobic_band_guess`, INFERRED). The cheat sheet, in MASTER_MODEL, defines:

| Band | Colour | Duration / intensity | Rest |
|---|---|---|---|
| A | Blue | Short Duration / High Intensity (seconds, 15/45 to 45/15 work:rest) | 3–8 min |
| B | Green | Moderate Duration / Moderate Intensity (1–3 min) | 1:1–1:3 work:rest |
| C | Orange | Long Duration / Low Intensity (4+ min) | active |

Its rule: *"Never do the same color workout in the same week... one of each color ... total of 3 Aerobic capacity workouts per week"*. The athletic templates place 2 'Aerobic Capacity' slots per week (Wed and Sat).

### TRIPLE EXTENSION (C/D/E + F), 33 stacked cells, 24 unique

The lifts track is clearly ordered **easy to hard**:

1. **Foundational:** bodyweight drill, then lunge drill, then a loaded hex-bar drill, then barbell pulls from the **high hang**, then the **mid hang**.
2. **Moderate:** the foundational list is **repeated**, with bodyweight swapped for "Weighted", **plus low-hang pulls**.
3. **Advanced:** the list is **replaced** by the full lifts. Power variants come first, then full (squat) variants: Power Snatch, Power Clean, Power Clean & Jerk, Snatch, Clean, Clean & Jerk.

This matches MASTER_MODEL `(NOT DONE) ALL ABOUT OLYMPIC LI`, "PROGRESSION MODEL EASY TO HARD": HIGH HANG, then MID HANG (KNEE), then LOW HANG (BELLOW KNEE), then FLOOR; power before squat.

Coach logic visible here:
* **Moderate accumulates** (keeps the easy options and adds harder ones).
* **Advanced replaces.**
* "Foundational" can already include barbell load (hex bar, clean pulls). **Level is about technical complexity and start position, not load.**

The ankle track (C126:C136 = F) runs:
1. Bilateral in place, lateral, forward/back, backward, zig-zag.
2. Then single-leg versions.
3. Then right-angle sequences (bilateral, then single-leg).
4. Then single-leg forward/back.

It goes **bilateral before unilateral, and one direction before multi-direction.**

### PLYOS (G/H/I/J), 41 stacked cells, 39 unique selectable (plus 1 progression note and 1 duplicate)

* **Foundational (G9:G15): landing and concentric-only work.** Low depth drop (listed twice), medium depth drop, push-up stick-the-landing, then box jumps at half-shin and knee height, then ankle hops. Height is written into names.
* **Moderate 1 (G46:G57 = H): plate hops.** The progression runs bilateral forward, bilateral lateral sequence, alternating single-leg, single-leg, single-leg lateral outer leg, inner leg, inner/outer. Then single-leg zig-zag, ankle hops (repeat), single-leg depth drops and single-leg backward zig-zag. **G53 is a rule, not an exercise:** "Bigger plates start at lateral bilateral plate hops", meaning that when height increases the athlete resets complexity.
* **Moderate 2 (G91:G96 = I): hurdles.** Bilateral forward, single-leg forward, bilateral lateral, single-leg lateral, push-up box jump, right-angle hurdle pattern.
* **Advanced (G126:G141 = J, "FULL JUMPING").** Squirrel jumps (Sheet23 calls these "*FASTEST SSC*"), max-velocity sprinting (Sheet23 "*SPRINT*"), tuck jumps, depth jumps (single-leg listed before bilateral), depth drop to box jump, high depth drop, hurdle hops, Bulgarian split jumps, DB-loaded drop-release-jump, DB ankle hops, DB repeat squat jumps, bounding, plyo push-ups. **The order here is a collection, not a strict ladder.**

Coach logic visible in PLYOS:
* **Within a variant, progress by amplitude or height:** low, then medium, then high depth drop; half-shin, then knee-height box.
* **Progress by single leg:** bilateral, then alternating, then single-leg.
* **Progress by direction:** forward, then lateral, then reverse, then zig-zag or right-angle.
* **Progress by load:** ankle hops become DB ankle hops; depth drop becomes DB depth drop with release.
* **Progress from landing to rebounding:** stick, then onto, then repeated.

Upper-body plyo ladder (INFERRED, ambiguous names): 'Push up Stick the Landing' (FOUNDATIONAL), then ' Push up Box Jump ' (MODERATE), then 'Plyo pushups' (ADVANCED).

The coach's own theory, in MASTER_MODEL `(NOT DONE) ALL ABOUT BALLISTICS`:
* **"BALLISTIC PURPOSE - BE EXPLOSIVELY & FAST"** is "for MUSCULAR FORCE PRODUCTION". Its phases are TAKING IN FORCES (stick the landing), DELIVER FORCES FAST (hop/jump onto) and AMORTIZATION OF FORCES (double bounce, drop & jump).
* **"PLYOMETRIC PURPOSE - BE REACTIVE & BOUNCY"** is "for REACTIVE CONNECTIVE TISSUE ADAPTATIONS". Its phase is REBOUNDING (repeat hops/jumps).

Sheet23 adds ZONE 1 "Receive pause/creat", ZONE 2 "Receive/create" and ZONE 3 "Repeat receive create".

Each plyo record carries `ballistic_vs_plyometric_inferred`, `contact_type_inferred` and `ssc_zone_inferred`, all mapped to these coach categories. Note that **SSC zone is not the same as level.** Foundational ankle hops are ZONE 3 (repeated) but low amplitude. The advanced high depth drop is ZONE 1 (landing only) but a large force. Level comes from **force magnitude, single-leg demand and load**. Zone comes from **contact type**.

### THROWING (K), 20 cells, no levels

All items are medball throws. Row 3 reads `AP - THROWING` instead of a level. The order goes:

1. Bilateral sagittal (chest pass, overhead throw).
2. Rotational right/left pairs.
3. Squat-integrated.
4. Rotational floor slams.
5. Right/left-leg step-forward throws.
6. A **2x2 half-kneeling matrix**: facing R or L, with the left leg up or the right leg forward.
7. Back-to-wall alternating scoops.
8. Sit-up throws.
9. Rotational downward slam.

The MASTER_MODEL medball cheat sheet (OBSERVED) gives each throw a pattern description, stored in `coach_pattern_description`. Examples: 'BILATERAL SYMETRICAL PUSH', 'TRANSVERSE PULL DOWN', 'PROPULSIVE STEP WITH BILATERAL SYMETRICAL PUSH', 'INTO THE LEFT LEG/HIP', 'OUT OF THE RIGHT LEG/HIP'. It doses 1x10 per throw and 1x20 for sit-up throws.

The half-kneeling matrix is classic biomechanics thinking (Pat Davidson style): rotation **into or out of a specific hip**, not generic "rotational power". Sides are always paired R/L. The JSON `side`, `stance` and `hip_emphasis` fields preserve this.

### CHANGE OF DIRECTION (L/M/N), 9 stacked cells

Most items are American-football **receiver-route-tree** names (FADE, SLANT, POST/CORNER, FLAT, DIG/OUT, COMEBACK/CURL), plus Shuffles and two combine tests. MASTER_MODEL `AGILITYCOD PATTERNS` lists 'RUNNING ROUTES' and 'ROUTE TREE', and defines:
* "COD: Proactive in nature - Cognitive Competence"
* "Agility: Reactive in nature - Incognitive Competence"

The tiers are **turn severity**, which is written as row 5 (`EASY TURN`, `MOD. TURN`, `HARD TURN`). The angles below are INFERRED from route geometry and recorded in `turn_angle_inferred`:

| Tier | Turn angle | Items |
|---|---|---|
| EASY TURN | 45° or less, or rounded | fade, slant, post/corner, flat, shuffles |
| MOD. TURN | about 90° square cut | dig/out, plus 'LEFT TEST' (most likely the **L-test / 3-cone drill**) |
| HARD TURN | 135° to 180° reversal | comeback/curl, plus a **date cell that is the 5-10-5 pro-agility shuttle** |

The date cell is L92/N10: date 2005-05-10, format m/d/yy, displayed "5/10/05". Google Sheets auto-converted the typed "5-10-5".

---

## 7. Duplicates, typos and data-quality issues (exhaustive for A to N)

**Duplicates**
* All 64 cells in D, E, F, H, I, J, M and N are exact duplicates of stacked cells (see §3).
* B89:B98 `DISTANCE TEST` block = B24:B33, 9 duplicate items.
* G9 and G10 are both 'Low Depth Drop', adjacent in the same block. This also happens in every copy and in Sheet23.
* Cross-level repeats with identical text:
  * 'Lunge to high knee reach' (C10 / C47)
  * 'Hex bar squat to calf raise' (C11 / C48)
  * 'High hang clean pull' (C12 / C49)
  * 'Mid hang clean pull' (C13 / C50)
  * 'High hang snatch pull' (C14 / C51)
  * 'Mid hang snatch pull' (C15 / C52)
  * 'Ankle Hops ' (G15 FOUNDATIONAL / G55 MODERATE)
* Near-duplicates across segments or levels:
  * 'Ankle Hops ' (G15) vs 'Bilateral symmetrical ankle hop' (C126)
  * 'Hurdle Hops' (G134 ADVANCED) vs 'Bilateral Forward Hurdle Hops ' (G91 MODERATE)
  * 'Depth Jumps' (G131) vs 'Depth Drop to Box Jump ' (G132)
  * Sheet23 'Single leg squirrel jumps my' vs BYOP 'Single leg squirrel jumps'

**Non-exercise content inside exercise lists**
* G53/H16 'Bigger plates start at lateral bilateral plate hops' is a progression rule (`record_type: progression_note`).
* Instructions are written into names:
  * G47 'Lateral bilateral plate hops forward on /hop off and back on sideways/ forward down repeat'
  * C134 'Right angle bilateral ankle hops - forward/right/forward/left/forward'
  * G96 'Right Angle Bilateral Forward/ Lateral/forward/lateral hurdle hops'

**Auto-format corruption**
* L92 and N10 are datetime 2005-05-10, which is "5-10-5". The same corruption exists in both copies and in MASTER_MODEL Sheet23!M3.
* The same bug appears elsewhere in the coach's sheets: "10/10" reps became 2022-10-10 across BASEBALL, and "8/8" became 2021-08-08. The generator should store prescriptions as text.

**Spelling (kept verbatim in `name_raw` and headers; corrected in `name_clean` and `category_canonical`)**
* 'TRIPPLE EXTENSION' (C1, C5, D5, E5), 'Tripple Extension' in templates; should be TRIPLE.
* 'LEFT TEST' should probably be 'L TEST'.
* Typos in related Sheet23 headers: 'FOUNDATINONAL', 'creat'.
* Outside A to N in the same sheet: 'SAGITAL', 'INTERMIDIATE', 'DOMNANT'.

**Whitespace and casing**
* Trailing spaces:
  * L3 'EASY  ' (two trailing spaces)
  * 'Snatch '
  * 'Clean '
  * 'Ankle Hops '
  * 'SL forward zig-zag jumps '
  * 'SL Reverse zig-zag jumps '
  * 'Bilateral Forward Hurdle Hops '
  * 'Depth Drop to Box Jump '
  * 'Bilateral Symmetrical  zig-zag jumps ' (also has a double space)
* Leading spaces:
  * ' Single leg plate hops'
  * ' Single outer leg lateral plate hops alternating'
  * ' Single inner/outer leg lateral plate hops'
  * ' Squirrel jumps'
  * ' Max velocity running (top speed)'
  * ' Push up Box Jump ' (both leading and trailing)
* Mixed casing: 'BodyWeight', 'sL', 'sl', 'Hops', '2 min Fast' vs '5 min fast', '1 Mile run' vs '3 mile run', '3 Miles run for time'.

**Odd values**
* '21.6 mile run' (B33/B98). It matches no standard race (half marathon is 13.1 mi / 21.1 km; marathon is 26.2 mi).
* `400m` is the only bold cardio item.

---

## 8. The two library copies (BYOP tabs 10 and 11)

* **`Copy of MASTER EXERCISE LIBRARY`** (A1:AA335) is the master with the side-by-side duplicate columns removed. Column A1 gains the label 'Segment'. The remaining segments shift left: B=CARDIO, C=TRIPPLE EXTENSION, D=PLYOS, E=THROWING, F=COD. Cardio column B was compacted by 6 rows: DISTANCE TEST moves to B18 and SPEED TEST to B38. No item was added or lost.
* **`Copy of Copy of MASTER EXERCISE`** (A1:Y44) is fully compacted. It drops the row-2 FILL HERE strip, the empty gaps, the in-list `CHOOSE 👇` separators and the duplicate DISTANCE TEST block. It sets B2/B4 to 'Cardio' and renames `SPEED TEST` to **`SPEED ENDURANCE TEST`**. **It is truncated at row 44**, which loses 9 items: '45 cals', '50 cals', 'Bulgarian Split Jumps', 'DB Depth drop dbs Jump', 'SL DB depth drop dbs jump', 'DB Ankle hops', 'DB repeat squat jumps', 'Bounding' and 'Plyo pushups'. It also shows the red header fonts noted in §4. **Do not use it as a source of truth.**

No template references either copy.

---

## 9. How templates use A to N, with dosing evidence for the generator

**Day structure in the athletic templates (OBSERVED).** ATHLETIC - FULL BODY - 4 DAYS A, JUSTICE LEAGUE and NO ACCESS - ATHLETIC share the same layout:

| Day | Athletic block, in this order | Then |
|---|---|---|
| Mon / Thu | Plyo, Plyo, Throwing, COD, Tripple Extension | about 5 resistance slots |
| Tue / Fri | Plyo, Throwing, COD, Tripple Extension | resistance slots |
| Wed / Sat | Calves, **Aerobic Capacity**, Core, Focus 1, Focus 2 | none |

The Thursday row label B30 is a single space `' '` in ATHLETIC - 4 DAYS A and JUSTICE LEAGUE. It reads 'THURSDAY' only in NO ACCESS - ATHLETIC.

That gives **18 athletic-pattern exercises a week**: 6 plyo, 4 throw, 4 COD and 4 triple extension, plus 2 aerobic-capacity pieces. Athletic work always comes **before** resistance work in a session.

**Prefilled example (JUSTICE LEAGUE, OBSERVED).**

| Day | Slot | Exercise | Dose |
|---|---|---|---|
| Mon | Plyo | 'Medium Depth Drop' | 2 x '6 to 8 Reps' |
| Mon | Plyo | 'Ankle Hops ' | 2 x '6 to 8 Reps' |
| Mon | Throwing | 'Situps to overhead throw' | 2 x '8 to 12 Reps' |
| Mon | COD | 'DIG/OUT' | 2 x '6 to 8 Reps', note 'LATERAL' |
| Mon | Tripple Extension | 'Power Clean' | 2 x '6 to 8 Reps' |
| Tue | Plyo | 'SL Depth Drops' | not given |

**This mixes levels inside one day:** a foundational plyo, an intermediate plyo and an advanced triple-extension lift. Levels are picked per segment, not per athlete globally.

**The NO ACCESS template still offers barbell Olympic lifts and boxes.** The library has **no equipment tags**, so equipment filtering must be added by the generator. The JSON `equipment` and `no_equipment_ok` fields are INFERRED for that reason.

**Coach dose examples for A to N items**, from MASTER_MODEL example programs. These ground `typical_rep_range_guess`:

| Item | Dose |
|---|---|
| Squirrel jumps | 1 x 40, or 40 & 40 single-leg |
| Plate jumps | 1 x 20, or 20/20 single-leg |
| Hurdle hops | 2 x 20 (single-leg 2 x 10) |
| Depth drops | 2 x 10, or weighted 3 x 8, or 1 x 8 with a 3-second hold |
| Ankle hops / DB ankle hops | 20 |
| DB squat jumps | 4 x 12/10/8/8 |
| Power cleans | 3 x 3 |
| Heavy power cleans | 2 x 8 |
| Hang cleans / snatches | 4 x 8 at 75%, 4 x 6 at 80% |
| Medball throws | 2–3 x 10 to 15/15 |
| Sit-up throws | 20 |
| Calorie sprints | 10–20 cal x 1–3 |

**BASEBALL athletic-pattern volume bands (OBSERVED).**

| Band | Duration |
|---|---|
| 'SPEED ENDURANCE' | '>40 Secs' |
| 'SPEED POWER' | '10-39 Secs' |
| 'SPEED STRENGTH & POWER' | '0-12 Secs' |

These sit next to the resistance bands 'VOL 1' (12–15 reps compound / 10–12 isolation), 'VOL 2' (8–12 / 15) and 'VOL 3' (6–8 / max reps). This is the coach's own dosing axis for athletic patterns: **set duration, not reps**.

**MASTER_MODEL `Sheet23` items not in BYOP** (added as 6 supplementary records): 'Depth Drops ', 'Broad Jumps', 'SL Box Jumps', 'Squat Jumps w/ Medicine Ball ', '✅ MACH DRILLS' and '✅ Acceleration starts'. The last two sit under '*FAST BALLISTIC/WARMUP/SSC* (prior to sprint)'. 'Tuck Jumps ' (G33) already exists in BYOP.

---

## 10. Coach logic, summarised (for the generator)

1. **Buckets first, then levels.** Segment (row 1), then pattern family (row 4: CARDIO / ATHLETIC / CONTROL / RESISTANCE / FUNCTIONAL), then purpose (row 6: a quality for athletic, a muscle for resistance), then a level tier (row 3, ZONE), then a sub-pattern (row 5).
2. **Athletic patterns are dosed as qualities**: speed/power and COD. Resistance patterns are dosed as muscles. This maps directly onto the coach's "athletic patterns vs resistance patterns" language.
3. **Progression levers inside athletic work.** Each is shown with its evidence:
   * Start position: high, then mid, then low hang.
   * Power before full lifts.
   * Bodyweight, then weighted, then DB-loaded.
   * Low, then medium, then high (box or drop height).
   * Bilateral, then alternating, then single-leg.
   * Sagittal, then frontal, then multi-direction (zig-zag, right-angle).
   * Landing, then onto, then repeated rebound.
   * Turn angle: 45°, then 90°, then 180°.
4. **Moderate tends to accumulate the easier list; advanced replaces it.** This is clear in triple extension and partly in plyos (ankle hops repeated).
5. **There are two jumping tracks**, ankle/limited-knee and landing/hurdle, merging into full jumping. A sport profile can weight them differently. INFERRED: basketball (high plyo) can draw from all tracks, including full jumping and max-velocity running. Boxing and karate (low plyo) stay in the ankle-stiffness and landing tracks. MMA sits in between. This is the place to "play with the volume" the coach describes.
6. **Throwing is levelled by biomechanics, not difficulty.** It runs from bilateral, to rotational, to stance-specific, to hip-specific (into/out of a hip), always in R/L pairs.
7. **Cardio is self-dosing** and has its own weekly rule: 3 aerobic sessions a week, one each of blue/green/orange (A/B/C), never the same colour twice in a week. The athletic templates only allot 2.

---

## 11. JSON field notes

Field-by-field details beyond the requested schema:

* **`record_type`.** One of `exercise`, `test`, `conditioning_prescription` (cardio) or `progression_note` (G53/H16, not selectable).
* **`level`.** Contains `raw_block_label` (row 8/44/89/124 label, null in the duplicate columns), `raw_zone_label_row3`, `normalized` and `inferred_progression_rank_within_block`.
* **`column_header_rows` and `effective_header_rows`.** For stacked cells, the column's own rows 1–6 describe only the foundational block. So `effective_header_rows` gives the rows 1–6 of the side-by-side column that describes the block.
* **`level_block_colour`.** Contains the row-3 zone fill, the block-label cell and its fill, and the item fill.
* **`sheet_band`.** The 1-based band between black dividers.
* **`progression_track`.** The Sheet23-derived track name (INFERRED naming). `sheet23_twin` holds the OBSERVED twin cell and its block label.
* **`mirror_cell`, `is_dropdown_source`, `dropdown_slots` and `same_name_other_cells_A_to_N`.** Use these for de-duplication.
* **`observed_in_programs`.** Exact-text occurrences, after normalisation, in non-library tabs of both workbooks.
* **Athletic-only fields:** `ballistic_vs_plyometric_inferred`, `contact_type_inferred` and `ssc_zone_inferred`.
* **Throws:** `coach_pattern_description` (OBSERVED from the MASTER_MODEL medball cheat sheet), plus `side`, `stance` and `hip_emphasis`.
* **COD:** `turn_angle_inferred`.
* **Cardio:** `energy_system_guess`, `aerobic_band_guess`, and parsed `work_s` / `rest_s` / `distance_mi` / `distance_m` / `calories`.
* **`muscle_size_class` uses the schema's definitions:**
  * Most athletic items are `mixed`, because they combine big lower-body muscles with calves and traps.
  * Ankle-dominant hops are `small`, because they are calf-driven.
  * Cardio is `n/a`.

---

## 12. Complete inventory of the stacked (dropdown-source) cells

This lists all 146 stacked cells. The 64 side-by-side cells are exact copies; the twin is listed in the last column.


**CARDIO | label cell B8 = 'SPEED INTERVALS' | sub-block (B5 is blank) | level -> any | track: cardio: SPEED INTERVALS**

| cell | raw text (verbatim) | clean name | lat | plane | impact | equipment | twin / same-name cells |
|---|---|---|---|---|---|---|---|
| B9 | `2 min Fast - 1 min walk` | Run Intervals: 2 min Fast / 1 min Walk | n/a | sagittal | low | bodyweight |  |
| B10 | `3 min Fast - 2 min walk` | Run Intervals: 3 min Fast / 2 min Walk | n/a | sagittal | low | bodyweight |  |
| B11 | `4 min Fast - 3 min walk` | Run Intervals: 4 min Fast / 3 min Walk | n/a | sagittal | low | bodyweight |  |
| B12 | `5 min fast - 2 min walk` | Run Intervals: 5 min Fast / 2 min Walk | n/a | sagittal | low | bodyweight |  |
| B13 | `6 min fast - 1 min walk` | Run Intervals: 6 min Fast / 1 min Walk | n/a | sagittal | low | bodyweight |  |

**CARDIO | label cell B14 = 'DISTANCE INTERVALS' | sub-block (B5 is blank) | level -> any | track: cardio: DISTANCE INTERVALS**

| cell | raw text (verbatim) | clean name | lat | plane | impact | equipment | twin / same-name cells |
|---|---|---|---|---|---|---|---|
| B15 | `1 mile run - 1 min walk` | Distance Intervals: 1 mile Run / 1 min Walk | n/a | sagittal | low | bodyweight |  |
| B16 | `2 mile run - 2 min walk` | Distance Intervals: 2 mile Run / 2 min Walk | n/a | sagittal | low | bodyweight |  |
| B17 | `3 mile run - 3 min walk` | Distance Intervals: 3 mile Run / 3 min Walk | n/a | sagittal | low | bodyweight |  |

**CARDIO | label cell B24 = 'DISTANCE TEST' | sub-block (B5 is blank) | level -> any | track: cardio: DISTANCE TEST**

| cell | raw text (verbatim) | clean name | lat | plane | impact | equipment | twin / same-name cells |
|---|---|---|---|---|---|---|---|
| B25 | `1 Mile run` | Distance Test: 1 mile Run | n/a | sagittal | low | bodyweight | B90 |
| B26 | `3 mile run` | Distance Test: 3 mile Run | n/a | sagittal | low | bodyweight | B91 |
| B27 | `5 mile run` | Distance Test: 5 mile Run | n/a | sagittal | moderate | bodyweight | B92 |
| B28 | `8 mile run` | Distance Test: 8 mile Run | n/a | sagittal | moderate | bodyweight | B93 |
| B29 | `11 mile run` | Distance Test: 11 mile Run | n/a | sagittal | moderate | bodyweight | B94 |
| B30 | `14 mile run` | Distance Test: 14 mile Run | n/a | sagittal | moderate | bodyweight | B95 |
| B31 | `17 mile run` | Distance Test: 17 mile Run | n/a | sagittal | moderate | bodyweight | B96 |
| B32 | `20 mile run` | Distance Test: 20 mile Run | n/a | sagittal | moderate | bodyweight | B97 |
| B33 | `21.6 mile run` | Distance Test: 21.6 mile Run | n/a | sagittal | moderate | bodyweight | B98 |

**CARDIO | label cell B44 = 'SPEED TEST' | sub-block (B5 is blank) | level -> any | track: cardio: SPEED TEST**

| cell | raw text (verbatim) | clean name | lat | plane | impact | equipment | twin / same-name cells |
|---|---|---|---|---|---|---|---|
| B45 | `Half a mile (800m)` | Speed-Endurance Test: 800 m (Half Mile) for Time | n/a | sagittal | moderate | bodyweight |  |
| B46 | `1 Mile Run for time` | Speed-Endurance Test: 1 Mile for Time | n/a | sagittal | moderate | bodyweight |  |
| B47 | `3 Miles run for time` | Speed-Endurance Test: 3 Miles for Time | n/a | sagittal | moderate | bodyweight |  |

**CARDIO | label cell B89 = 'DISTANCE TEST' | sub-block (B5 is blank) | level -> any | track: cardio: DISTANCE TEST**

| cell | raw text (verbatim) | clean name | lat | plane | impact | equipment | twin / same-name cells |
|---|---|---|---|---|---|---|---|
| B90 | `1 Mile run` | Distance Test: 1 mile Run | n/a | sagittal | low | bodyweight | B25 |
| B91 | `3 mile run` | Distance Test: 3 mile Run | n/a | sagittal | low | bodyweight | B26 |
| B92 | `5 mile run` | Distance Test: 5 mile Run | n/a | sagittal | moderate | bodyweight | B27 |
| B93 | `8 mile run` | Distance Test: 8 mile Run | n/a | sagittal | moderate | bodyweight | B28 |
| B94 | `11 mile run` | Distance Test: 11 mile Run | n/a | sagittal | moderate | bodyweight | B29 |
| B95 | `14 mile run` | Distance Test: 14 mile Run | n/a | sagittal | moderate | bodyweight | B30 |
| B96 | `17 mile run` | Distance Test: 17 mile Run | n/a | sagittal | moderate | bodyweight | B31 |
| B97 | `20 mile run` | Distance Test: 20 mile Run | n/a | sagittal | moderate | bodyweight | B32 |
| B98 | `21.6 mile run` | Distance Test: 21.6 mile Run | n/a | sagittal | moderate | bodyweight | B33 |

**CARDIO | label cell B123 = 'DISTANCE' | sub-block (B5 is blank) | level -> any | track: cardio: DISTANCE**

| cell | raw text (verbatim) | clean name | lat | plane | impact | equipment | twin / same-name cells |
|---|---|---|---|---|---|---|---|
| B124 | `200m` | Distance Repeat: 200 m | n/a | sagittal | low | bodyweight, bike/rower/ski |  |
| B125 | `400m` | Distance Repeat: 400 m | n/a | sagittal | low | bodyweight, bike/rower/ski |  |
| B126 | `600m` | Distance Repeat: 600 m | n/a | sagittal | low | bodyweight, bike/rower/ski |  |
| B127 | `800m` | Distance Repeat: 800 m | n/a | sagittal | low | bodyweight, bike/rower/ski |  |
| B128 | `1000m` | Distance Repeat: 1000 m | n/a | sagittal | low | bodyweight, bike/rower/ski |  |

**CARDIO | label cell B132 = 'CALORIES' | sub-block (B5 is blank) | level -> any | track: cardio: CALORIES**

| cell | raw text (verbatim) | clean name | lat | plane | impact | equipment | twin / same-name cells |
|---|---|---|---|---|---|---|---|
| B133 | `10 cals` | Calorie Effort: 10 cal (bike / rower / ski) | n/a | n/a | none | bike/rower/ski |  |
| B134 | `15 cals` | Calorie Effort: 15 cal (bike / rower / ski) | n/a | n/a | none | bike/rower/ski |  |
| B135 | `20 cals` | Calorie Effort: 20 cal (bike / rower / ski) | n/a | n/a | none | bike/rower/ski |  |
| B136 | `25 cals` | Calorie Effort: 25 cal (bike / rower / ski) | n/a | n/a | none | bike/rower/ski |  |
| B137 | `30 cals` | Calorie Effort: 30 cal (bike / rower / ski) | n/a | n/a | none | bike/rower/ski |  |
| B138 | `35 cals` | Calorie Effort: 35 cal (bike / rower / ski) | n/a | n/a | none | bike/rower/ski |  |
| B139 | `40 cals` | Calorie Effort: 40 cal (bike / rower / ski) | n/a | n/a | none | bike/rower/ski |  |
| B140 | `45 cals` | Calorie Effort: 45 cal (bike / rower / ski) | n/a | n/a | none | bike/rower/ski |  |
| B141 | `50 cals` | Calorie Effort: 50 cal (bike / rower / ski) | n/a | n/a | none | bike/rower/ski |  |

**TRIPPLE EXTENSION | label cell C8 = 'FOUNDATIONAL' | row-5 sub-pattern 'TRIPPLE EXTENSION' | level -> foundational | track: triple_extension_lifts** -- no side-by-side duplicate

| cell | raw text (verbatim) | clean name | lat | plane | impact | equipment | twin / same-name cells |
|---|---|---|---|---|---|---|---|
| C9 | `BodyWeight Squat to calf raise` | Bodyweight Squat to Calf Raise | bilateral | sagittal | none | bodyweight |  |
| C10 | `Lunge to high knee reach` | Lunge to High-Knee Reach | unilateral | sagittal | none | bodyweight | C47, D10 |
| C11 | `Hex bar squat to calf raise` | Hex Bar Squat to Calf Raise | bilateral | sagittal | none | barbell | C48, D11 |
| C12 | `High hang clean pull` | High-Hang Clean Pull | bilateral | sagittal | none | barbell | C49, D12 |
| C13 | `Mid hang clean pull` | Mid-Hang Clean Pull | bilateral | sagittal | none | barbell | C50, D13 |
| C14 | `High hang snatch pull` | High-Hang Snatch Pull | bilateral | sagittal | none | barbell | C51, D14 |
| C15 | `Mid hang snatch pull` | Mid-Hang Snatch Pull | bilateral | sagittal | none | barbell | C52, D15 |

**TRIPPLE EXTENSION | label cell C44 = 'MODERATE' | row-5 sub-pattern 'TRIPPLE EXTENSION' | level -> intermediate | track: triple_extension_lifts** -- side-by-side duplicate column starts at **D9**

| cell | raw text (verbatim) | clean name | lat | plane | impact | equipment | twin / same-name cells |
|---|---|---|---|---|---|---|---|
| C46 | `Weighted squat to calf raise` | Weighted Squat to Calf Raise | bilateral | sagittal | none | DB, KB | D9 |
| C47 | `Lunge to high knee reach` | Lunge to High-Knee Reach | unilateral | sagittal | none | bodyweight | D10, C10 |
| C48 | `Hex bar squat to calf raise` | Hex Bar Squat to Calf Raise | bilateral | sagittal | none | barbell | D11, C11 |
| C49 | `High hang clean pull` | High-Hang Clean Pull | bilateral | sagittal | none | barbell | D12, C12 |
| C50 | `Mid hang clean pull` | Mid-Hang Clean Pull | bilateral | sagittal | none | barbell | D13, C13 |
| C51 | `High hang snatch pull` | High-Hang Snatch Pull | bilateral | sagittal | none | barbell | D14, C14 |
| C52 | `Mid hang snatch pull` | Mid-Hang Snatch Pull | bilateral | sagittal | none | barbell | D15, C15 |
| C53 | `Low hang clean pull` | Low-Hang Clean Pull | bilateral | sagittal | none | barbell | D16 |
| C54 | `Low hang snatch pull` | Low-Hang Snatch Pull | bilateral | sagittal | none | barbell | D17 |

**TRIPPLE EXTENSION | label cell C89 = 'ADVANCED' | row-5 sub-pattern 'TRIPPLE EXTENSION' | level -> advanced | track: triple_extension_lifts** -- side-by-side duplicate column starts at **E9**

| cell | raw text (verbatim) | clean name | lat | plane | impact | equipment | twin / same-name cells |
|---|---|---|---|---|---|---|---|
| C91 | `Power Snatch` | Power Snatch | bilateral | sagittal | none | barbell | E9 |
| C92 | `Power Clean` | Power Clean | bilateral | sagittal | none | barbell | E10 |
| C93 | `Power Clean & Jerk` | Power Clean & Jerk | bilateral | sagittal | none | barbell | E11 |
| C94 | `Snatch ` | Snatch (Full / Squat) | bilateral | sagittal | none | barbell | E12 |
| C95 | `Clean ` | Clean (Full / Squat) | bilateral | sagittal | none | barbell | E13 |
| C96 | `Clean & Jerk` | Clean & Jerk (Full) | bilateral | sagittal | none | barbell | E14 |

**TRIPPLE EXTENSION | label cell C124 = 'EASY' | row-5 sub-pattern 'JUMPING ANKLE' | level -> foundational | track: jumping_limited_knee (ankle)** -- side-by-side duplicate column starts at **F9**

| cell | raw text (verbatim) | clean name | lat | plane | impact | equipment | twin / same-name cells |
|---|---|---|---|---|---|---|---|
| C126 | `Bilateral symmetrical ankle hop` | Bilateral Ankle Hops (In Place) | bilateral | sagittal | low | bodyweight | F9 |
| C127 | `Lateral bilateral ankle hops` | Bilateral Lateral Ankle Hops | bilateral | frontal | low | bodyweight | F10 |
| C128 | `Forward/reverse bilateral hops` | Bilateral Forward/Backward Ankle Hops | bilateral | sagittal | low | bodyweight | F11 |
| C129 | `Reverse bilateral ankle hops` | Bilateral Backward Ankle Hops | bilateral | sagittal | low | bodyweight | F12 |
| C130 | `Bilateral Symmetrical  zig-zag jumps ` | Bilateral Zig-Zag Ankle Hops | bilateral | multi | low | bodyweight | F13 |
| C131 | `Single leg ankle hops` | Single-Leg Ankle Hops | unilateral | sagittal | moderate | bodyweight | F14 |
| C132 | `Single leg lateral ankle hops` | Single-Leg Lateral Ankle Hops | unilateral | frontal | moderate | bodyweight | F15 |
| C133 | `Reverse single leg ankle hops` | Single-Leg Backward Ankle Hops | unilateral | sagittal | moderate | bodyweight | F16 |
| C134 | `Right angle bilateral ankle hops - forward/right/forward/left/forward` | Bilateral Right-Angle Ankle Hops (Forward-Right-Forward-Left-Forward) | bilateral | multi | low | bodyweight | F17 |
| C135 | `Right angle single leg ankle Hops` | Single-Leg Right-Angle Ankle Hops | unilateral | multi | moderate | bodyweight | F18 |
| C136 | `Forward/reverse sl ankle hops` | Single-Leg Forward/Backward Ankle Hops | unilateral | sagittal | moderate | bodyweight | F19 |

**PLYOS | label cell G8 = 'FOUNDATIONAL' | row-5 sub-pattern 'PLYO' | level -> foundational | track: plyos (landing / box)** -- no side-by-side duplicate

| cell | raw text (verbatim) | clean name | lat | plane | impact | equipment | twin / same-name cells |
|---|---|---|---|---|---|---|---|
| G9 | `Low Depth Drop` | Low Depth Drop | bilateral | sagittal | low | box | G10 |
| G10 | `Low Depth Drop` | Low Depth Drop | bilateral | sagittal | low | box | G9 |
| G11 | `Medium Depth Drop` | Medium Depth Drop | bilateral | sagittal | moderate | box |  |
| G12 | `Push up Stick the Landing` | Push-Up Stick the Landing | bilateral | sagittal | low | bodyweight |  |
| G13 | `Low Box Jumps (half shin)` | Low Box Jump (Half-Shin Height) | bilateral | sagittal | low | box |  |
| G14 | `Mid Box Jump (up to knee)` | Mid Box Jump (Knee Height) | bilateral | sagittal | low | box |  |
| G15 | `Ankle Hops ` | Ankle Hops | bilateral | sagittal | low | bodyweight | G55, H18 |

**PLYOS | label cell G44 = 'MODERATE' | row-5 sub-pattern 'PLYO' | level -> intermediate | track: jumping_limited_knee (plate hops)** -- side-by-side duplicate column starts at **H9**

| cell | raw text (verbatim) | clean name | lat | plane | impact | equipment | twin / same-name cells |
|---|---|---|---|---|---|---|---|
| G46 | `Forward bilateral plate hops` | Bilateral Forward Plate Hops | bilateral | sagittal | low | other | H9 |
| G47 | `Lateral bilateral plate hops forward on /hop off and back on sideways/ forward down repeat` | Bilateral Lateral Plate Hops (Forward On / Sideways Off-and-On / Forward Down, Repeat) | bilateral | multi | low | other | H10 |
| G48 | `Alternating sL plate hops (hop off bilateral)` | Alternating Single-Leg Plate Hops (Hop Off Bilateral) | alternating | sagittal | moderate | other | H11 |
| G49 | ` Single leg plate hops` | Single-Leg Plate Hops | unilateral | sagittal | moderate | other | H12 |
| G50 | ` Single outer leg lateral plate hops alternating` | Single-Leg Lateral Plate Hops - Outer Leg (Alternating) | unilateral | frontal | moderate | other | H13 |
| G51 | `Single inner leg lateral plate hops alt` | Single-Leg Lateral Plate Hops - Inner Leg (Alternating) | unilateral | frontal | moderate | other | H14 |
| G52 | ` Single inner/outer leg lateral plate hops` | Single-Leg Lateral Plate Hops - Inner/Outer Leg | unilateral | frontal | moderate | other | H15 |
| G53 | `Bigger plates start at lateral bilateral plate hops` | [Progression note] Bigger plates -> restart at Bilateral Lateral Plate Hops | n/a | n/a | none | other | H16 |
| G54 | `SL forward zig-zag jumps ` | Single-Leg Forward Zig-Zag Jumps | unilateral | multi | moderate | bodyweight | H17 |
| G55 | `Ankle Hops ` | Ankle Hops | bilateral | sagittal | low | bodyweight | H18, G15 |
| G56 | `SL Depth Drops` | Single-Leg Depth Drop | unilateral | sagittal | high | box | H19 |
| G57 | `SL Reverse zig-zag jumps ` | Single-Leg Backward Zig-Zag Jumps | unilateral | multi | moderate | bodyweight | H20 |

**PLYOS | label cell G89 = 'MODERATE' | row-5 sub-pattern 'PLYO' | level -> intermediate | track: plyos (hurdles)** -- side-by-side duplicate column starts at **I9**

| cell | raw text (verbatim) | clean name | lat | plane | impact | equipment | twin / same-name cells |
|---|---|---|---|---|---|---|---|
| G91 | `Bilateral Forward Hurdle Hops ` | Bilateral Forward Hurdle Hops | bilateral | sagittal | moderate | other | I9 |
| G92 | `SL Forward Hurdle Hops` | Single-Leg Forward Hurdle Hops | unilateral | sagittal | high | other | I10 |
| G93 | `Bilateral Lateral Hurdle Hops` | Bilateral Lateral Hurdle Hops | bilateral | frontal | moderate | other | I11 |
| G94 | `SL Lateral Hurdle Hops` | Single-Leg Lateral Hurdle Hops | unilateral | frontal | high | other | I12 |
| G95 | ` Push up Box Jump ` | Push-Up Box Jump | bilateral | sagittal | moderate | box | I13 |
| G96 | `Right Angle Bilateral Forward/ Lateral/forward/lateral hurdle hops` | Bilateral Right-Angle Hurdle Hops (Forward-Lateral-Forward-Lateral) | bilateral | multi | moderate | other | I14 |

**PLYOS | label cell G124 = 'ADVANCED' | row-5 sub-pattern 'FULL JUMPING' | level -> advanced | track: full_jumping** -- side-by-side duplicate column starts at **J9**

| cell | raw text (verbatim) | clean name | lat | plane | impact | equipment | twin / same-name cells |
|---|---|---|---|---|---|---|---|
| G126 | ` Squirrel jumps` | Squirrel Jumps | bilateral | sagittal | moderate | bodyweight | J9 |
| G127 | `Single leg squirrel jumps` | Single-Leg Squirrel Jumps | unilateral | sagittal | high | bodyweight | J10 |
| G128 | ` Max velocity running (top speed)` | Max-Velocity Sprint (Top Speed) | alternating | sagittal | high | bodyweight | J11 |
| G129 | `Tuck Jumps` | Tuck Jumps | bilateral | sagittal | high | bodyweight | J12 |
| G130 | `SL Depth Jumps` | Single-Leg Depth Jump | unilateral | sagittal | high | box | J13 |
| G131 | `Depth Jumps` | Depth Jump | bilateral | sagittal | high | box | J14 |
| G132 | `Depth Drop to Box Jump ` | Depth Drop to Box Jump | bilateral | sagittal | high | box | J15 |
| G133 | `High Depth Drop (above hip)` | High Depth Drop (Above-Hip Height) | bilateral | sagittal | high | box | J16 |
| G134 | `Hurdle Hops` | Hurdle Hops | bilateral | sagittal | high | other | J17 |
| G135 | `Bulgarian Split Jumps` | Bulgarian (Rear-Foot-Elevated) Split Jumps | unilateral | sagittal | high | bench | J18 |
| G136 | `DB Depth drop dbs Jump` | DB Depth Drop, Release DBs, Jump | bilateral | sagittal | high | DB, box | J19 |
| G137 | `SL DB depth drop dbs jump` | Single-Leg DB Depth Drop, Release DBs, Jump | unilateral | sagittal | high | DB, box | J20 |
| G138 | `DB Ankle hops` | DB Ankle Hops | bilateral | sagittal | moderate | DB | J21 |
| G139 | `DB repeat squat jumps` | DB Repeated Squat Jumps | bilateral | sagittal | high | DB | J22 |
| G140 | `Bounding` | Bounding | alternating | sagittal | high | bodyweight | J23 |
| G141 | `Plyo pushups` | Plyometric Push-Ups | bilateral | sagittal | moderate | bodyweight | J24 |

**THROWING | label cell - = None | row-5 sub-pattern 'THROWING' | level -> any | track: throwing** -- no side-by-side duplicate

| cell | raw text (verbatim) | clean name | lat | plane | impact | equipment | twin / same-name cells |
|---|---|---|---|---|---|---|---|
| K9 | `Chest pass` | Medball Chest Pass | bilateral | sagittal | none | medball |  |
| K10 | `Overhead throw` | Medball Overhead Throw | bilateral | sagittal | none | medball |  |
| K11 | `Rotational Chest pass R` | Medball Rotational Chest Pass (Right) | bilateral | transverse | none | medball |  |
| K12 | `Rotational Chest pass L` | Medball Rotational Chest Pass (Left) | bilateral | transverse | none | medball |  |
| K13 | `Rotational Scoop R` | Medball Rotational Scoop Toss (Right) | bilateral | transverse | none | medball |  |
| K14 | `Rotational Scoop L` | Medball Rotational Scoop Toss (Left) | bilateral | transverse | none | medball |  |
| K15 | `Squat to Chest Pass` | Medball Squat to Chest Pass | bilateral | sagittal | none | medball |  |
| K16 | `Rotational Floor side to side slams` | Medball Rotational Side-to-Side Floor Slams | alternating | transverse | none | medball |  |
| K17 | `RIGHT LEG step forward Chest Pass` | Medball Right-Leg Step-Forward Chest Pass | bilateral | sagittal | none | medball |  |
| K18 | `LEFT LEG step forward Chest pass` | Medball Left-Leg Step-Forward Chest Pass | bilateral | sagittal | none | medball |  |
| K19 | `RIGHT LEG step forward overhead throw` | Medball Right-Leg Step-Forward Overhead Throw | bilateral | sagittal | none | medball |  |
| K20 | `LEFT LEG step forward overhead throw` | Medball Left-Leg Step-Forward Overhead Throw | bilateral | sagittal | none | medball |  |
| K21 | `Half kneeling Right Facing LEFT LEG UP rotational scoop` | Medball Half-Kneeling Rotational Scoop - Right-Facing, Left Leg Up | bilateral | transverse | none | medball |  |
| K22 | `Half kneeling Right Facing RIGHT LEG FORWARD rotational scoop` | Medball Half-Kneeling Rotational Scoop - Right-Facing, Right Leg Forward | bilateral | transverse | none | medball |  |
| K23 | `Half kneeling LEFT Facing LEFT LEG UP rotational scoop` | Medball Half-Kneeling Rotational Scoop - Left-Facing, Left Leg Up | bilateral | transverse | none | medball |  |
| K24 | `Half kneeling LEFT Facing RIGHT LEG FORWARD rotational scoop` | Medball Half-Kneeling Rotational Scoop - Left-Facing, Right Leg Forward | bilateral | transverse | none | medball |  |
| K25 | `Alternating Back to wall Rotational Scoops` | Medball Alternating Back-to-Wall Rotational Scoops | alternating | transverse | none | medball |  |
| K26 | `Situps to chest pass` | Medball Sit-Up to Chest Pass | bilateral | sagittal | none | medball |  |
| K27 | `Situps to overhead throw` | Medball Sit-Up to Overhead Throw | bilateral | sagittal | none | medball |  |
| K28 | `Rotational Downward Slam Throw` | Medball Rotational Downward Slam | bilateral | transverse | none | medball |  |

**CHANGE OF DIRECTION | label cell L8 = 'FOUNDATIONAL' | row-5 sub-pattern 'EASY TURN' | level -> foundational | track: change_of_direction (turn angle)** -- no side-by-side duplicate

| cell | raw text (verbatim) | clean name | lat | plane | impact | equipment | twin / same-name cells |
|---|---|---|---|---|---|---|---|
| L9 | `FADE` | Fade Route | n/a | sagittal | low | bodyweight |  |
| L10 | `SLANT` | Slant Route | n/a | multi | low | bodyweight |  |
| L11 | `POST/CORNER` | Post / Corner Route | n/a | multi | low | bodyweight |  |
| L12 | `FLAT` | Flat Route | n/a | multi | low | bodyweight |  |
| L13 | `Shuffles` | Lateral Shuffles | n/a | frontal | low | bodyweight |  |

**CHANGE OF DIRECTION | label cell L44 = 'MODERATE' | row-5 sub-pattern 'MOD. TURN' | level -> intermediate | track: change_of_direction (turn angle)** -- side-by-side duplicate column starts at **M9**

| cell | raw text (verbatim) | clean name | lat | plane | impact | equipment | twin / same-name cells |
|---|---|---|---|---|---|---|---|
| L46 | `DIG/OUT` | Dig / Out Route | n/a | multi | moderate | bodyweight | M9 |
| L47 | `LEFT TEST` | L-Test / L-Drill (3-Cone) [inferred from 'LEFT TEST'] | n/a | multi | moderate | other | M10 |

**CHANGE OF DIRECTION | label cell L89 = 'ADVANCED' | row-5 sub-pattern 'HARD TURN' | level -> advanced | track: change_of_direction (turn angle)** -- side-by-side duplicate column starts at **N9**

| cell | raw text (verbatim) | clean name | lat | plane | impact | equipment | twin / same-name cells |
|---|---|---|---|---|---|---|---|
| L91 | `COMEBACK/CURL` | Comeback / Curl Route | n/a | multi | high | bodyweight | N9 |
| L92 | `5/10/05` (date; = '5-10-5') | 5-10-5 Pro-Agility Shuttle [inferred from date cell] | n/a | frontal | high | other | N10 |

---

## 13. Open questions for the coach

1. **`FILL HERE`** is a black strip in row 2 of each segment's primary column. Is it an instruction for BYOP buyers ("add your own exercise here"), or is it meant to feed something?
2. **The `DISTANCE` (200 to 1000 m) and `CALORIES` (10 to 50 cal) cardio blocks** sit outside the `B7:B122` dropdown range. Only BOOTCAMP - OPTION 2's E7, E12, E22 and E27 can pick them. Was that intentional (bootcamp-only conditioning), or should all templates see them?
3. **`LEFT TEST`.** Is this the "L test" (3-cone / L-drill)? Is the date cell **5/10/05** really the **5-10-5 pro-agility shuttle**? It should be re-typed as text, for example `'5-10-5`.
4. **COD route names.** Are the route names (FADE, SLANT, POST/CORNER, FLAT, DIG/OUT, COMEBACK/CURL) prescribed as running routes for every athlete, football or not? Is the tiering really about turn angle (45° / 90° / 180°)?
5. **'Push up Stick the Landing' and ' Push up Box Jump '.** Are these upper-body plyo push-ups (hands land/stick, then hands land on a box)? Or are they a prone pop-up, then stick or jump onto a box?
6. **G9/G10 'Low Depth Drop' is listed twice.** Is one meant to be a different variant, for example single-leg or weighted?
7. **Advanced 'Hurdle Hops' (G134) vs moderate 'Bilateral Forward Hurdle Hops ' (G91).** What makes the advanced one harder: taller hurdles, continuous reps, or minimal ground contact?
8. **PLYOS has two `MODERATE` columns** (H plate hops, I hurdles). Sheet23 calls them 'INTERMEDIATE - AP - JUMPING LIMITED KNEE' and 'INTERMEDIATE - AP - PLYOS'. Should an intermediate athlete get one from each, or choose a track by sport?
9. **'21.6 mile run'.** What distance or event is this (B33/B98)? Why is the whole DISTANCE TEST block listed twice?
10. **Bold `400m`.** Does the bold mean a default or favourite?
11. **Red header fonts** on some segments in `Copy of Copy of MASTER EXERCISE` (TRIPPLE EXTENSION, PLYOS, THROWING, core and lower-body resistance). Do they mean "reviewed", "needs work" or "used in athletic programs"?
12. **Level of the throwing column.** It has no levels (`AP - THROWING`). Does the coach progress throws by implement weight, by stance (bilateral, then split, then half-kneeling), or not at all?
13. **Sport-specific plyo volume** ("basketball more, boxing/karate less, MMA in between"). Is it controlled by:
    * the number of plyo slots per day (the templates have 2 on day A, 1 on day B),
    * which tracks are allowed (ankle vs landing vs full jumping), or
    * the contacts per set?
14. **Weekly aerobic sessions.** The aerobic cheat sheet says 3 aerobic-capacity workouts a week (one per colour), but the athletic templates allot 2 'Aerobic Capacity' slots. Which rule should the generator follow?
15. **'Weighted squat to calf raise'.** Which implement: DB, KB or vest?
16. **Snatch / Clean / Clean & Jerk without "Power".** Do these mean the full squat versions?
17. **Moderate tier accumulation.** The moderate tier repeats the foundational lifts (high/mid-hang pulls, hex-bar, lunge). Is it a rule that a level always keeps the previous level's options, while advanced replaces them?
