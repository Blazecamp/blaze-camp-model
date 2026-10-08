# L2 - MASTER EXERCISE LIBRARY, columns O to AH (core + upper body)

Source: BYOP workbook ("BUILD YOUR OWN PROGRAM - BLAZE CAMP MODEL"), tab `MASTER EXERCISE LIBRARY`, columns O..AH, rows 1-335.
Companion data: `L2_core_upper.json`, with 173 records (one per exercise cell, see section 9).

Labels: **OBSERVED** means it is read directly from a cell, a colour or a dropdown rule. **INFERRED** means it is my interpretation. Coach labels are quoted verbatim, typos included.

---

## 0. What these 20 columns contain

| Group (row 1, merged) | Columns | Family (row 4) | Role |
|---|---|---|---|
| `CORE THORAX` (O1:Q1) | O, P, Q | `CONTROL` | O is the dropdown master stack. P and Q are level views. |
| `CORE PELVIS` (R1:T1) | R, S, T | `CONTROL` | R is the original stack, but no dropdown reads it. Its content is **copied into O124-O209**. S and T are level views. |
| `VERTICAL PULL` (U1:W1) | U, V, W | `RESISTANCE` | U is the master stack. V and W are views. |
| `HORIZONTAL PULL` (X1:Z1) | X, Y, Z | `RESISTANCE` | X is the master stack. Y and Z are views. |
| `VERTICAL PUSH` (AA1:AC1) | AA, AB, AC | `RESISTANCE` | AA is the master stack. AB and AC are views. |
| `HORIZONTAL PUSH` (AD1:AG1) | AD, AE, AF, AG | `RESISTANCE` | AD is the master stack. AE, AF and AG are views. |
| `SIDE RAISES` | AH | `RESISTANCE` | A single list with no levels. |

Counts (OBSERVED): 172 exercise cells in O..AH, plus 1 item that exists only in the compact copy tab. The live library holds **107 unique exercises**. Per category, deduplicated within the category: CORE THORAX 10, CORE PELVIS 7, VERTICAL PULL 20, HORIZONTAL PULL 16, VERTICAL PUSH 19, HORIZONTAL PUSH 24 (+1 copy-only), SIDE RAISES 12. Side Plank appears under both core regions.

---

## 1. Header rows 1-7

Column A labels the rows: A3 `'ZONE'`, A4 `'PATTERN'`, A6 `'PURPOSE'`. A1, A2 and A5 are unlabelled. The copy tabs label A1 `'Segment'`. All header text in rows 1-6 is **bold italic**.

| Row | Meaning (decoded) | Examples in O..AH |
|---|---|---|
| 1 | **Category / segment.** Merged across the group's level columns. The grey shades (D9D9D9, B7B7B7, CCCCCC, 999999, EFEFEF) only alternate to separate groups (INFERRED: no meaning). | `CORE THORAX`, `VERTICAL PULL`, `SIDE RAISES` |
| 2 | **`'FILL HERE'`**. Present only on the master/dropdown column of each group, as near-white bold text (fg F3F3F3) on a **black** bar. It marks the column where the coach adds new exercises. R2 still has the white font but the text was deleted, consistent with CORE PELVIS being folded into O. | O2, U2, X2, AA2, AD2, AH2 |
| 3 | **ZONE**, the level, or a full zone code for push/shoulders | `EASY`, `MODERATE`, `HARD`, `FOUNDATIONAL`, `ADVANCED`, `ANY`, `FOUNDATIONAL - RP - BS - VERTICAL PUSH`, `RP -SHOULDERS` |
| 4 | **PATTERN family** | `CONTROL` (core), `RESISTANCE` (all upper) |
| 5 | **Sub-pattern**: the *plane* for core, the *laterality* for resistance | `CORE THORAX SAGITAL` / `FRONTAL` / `TRANSVERSE`, `BILATERAL SYMMETRICAL`, `UNILATERAL`, `BILATERAL` |
| 6 | **PURPOSE**: the body region served | `CORE`, `BACK`, `SHOULDERS/TRAPS`, `CHEST/FRONT DELTS`, `SHOULDERS` |
| 7 | `'CHOOSE 👇'` in green 93C47D. This is the **first option of every dropdown**, because the dropdown ranges start at row 7. | all columns |

### Full header table (OBSERVED; bg colour after the value)

| Col | r3 ZONE | r4 | r5 | r6 PURPOSE | items |
|---|---|---|---|---|---|
| O | `EASY` 6FA8DC | CONTROL | `CORE THORAX SAGITAL` | `CORE` 93C47D | stacked: thorax F/M/A + pelvis F/M/A |
| P | `MODERATE` CFE2F3 | CONTROL | `CORE THORAX FRONTAL` | CORE | 1 |
| Q | `HARD` CFE2F3 | CONTROL | `CORE THORAX TRANSVERSE` | CORE | 3 |
| R | `EASY` 6FA8DC | CONTROL | `CORE PELVIS SAGITAL` | CORE | stacked F/M/A (7) |
| S | `MODERATE` CFE2F3 | CONTROL | `CORE PELVIS FRONTAL` | CORE | 2 |
| T | `ADVANCED` CFE2F3 | CONTROL | `CORE PELVIS TRANSVERSE` | CORE | 1 |
| U | `FOUNDATIONAL` 93C47D | RESISTANCE | `BILATERAL SYMMETRICAL` | `BACK` F9CB9C | stacked F/A/UL (20) |
| V | `ADVANCED` D9EAD3 | RESISTANCE | `BILATERAL SYMMETRICAL` | BACK | 7 |
| W | `ANY` 76A5AF | RESISTANCE | `UNILATERAL` | BACK | 1 |
| X | `EASY` 93C47D | RESISTANCE | `BILATERAL SYMMETRICAL` | BACK | stacked F/A/UL (16) |
| Y | `ADVANCED` D9EAD3 | RESISTANCE | `BILATERAL SYMMETRICAL` | BACK | 9 |
| Z | `ANY` 76A5AF | RESISTANCE | `UNILATERAL` | BACK | 2 |
| AA | `FOUNDATIONAL - RP - BS - VERTICAL PUSH` 6FA8DC | RESISTANCE | `BILATERAL SYMMETRICAL` | `SHOULDERS/TRAPS` CC0000 | stacked F/A/UL (20) |
| AB | `ADVANCED - RP - BS - VERTICAL PUSH` CFE2F3 | RESISTANCE | `BILATERAL SYMMETRICAL` | SHOULDERS/TRAPS | 8 |
| AC | `RP - UL - VERTICAL PUSH` 6FA8DC | RESISTANCE | `UNILATERAL` | SHOULDERS/TRAPS | 3 |
| AD | `RP - BS - FOUNDATIONAL- HORIZONTAL PUSH` 6FA8DC | RESISTANCE | `BILATERAL SYMMETRICAL` | `CHEST/FRONT DELTS` 93C47D | stacked F/M/A/UL (25) |
| AE | `RP - BS - INTERMEDIATE - HORIZONTAL PUSH` CFE2F3 | RESISTANCE | `BILATERAL SYMMETRICAL` | CHEST/FRONT DELTS | 3 |
| AF | `RP - BS - ADVANCED HORIZONTAL PUSH` CFE2F3 | RESISTANCE | `BILATERAL SYMMETRICAL` | CHEST/FRONT DELTS | 10 |
| AG | `RP - UL - HORIZONTAL PUSH` 9FC5E8 | RESISTANCE | `UNILATERAL` | CHEST/FRONT DELTS | 5 |
| AH | `RP -SHOULDERS` EAD1DC | RESISTANCE | `BILATERAL` | `SHOULDERS` EAD1DC | 12 |

Rows 3-5 of a master column (O, R, U, X, AA, AD) describe **only its first block**. Later blocks in the same column take their meaning from the matching level-view column. Every record in the JSON carries both the literal column headers (`column_header_rows`) and the effective zone (`zone`).

---

## 2. Zone codes

OBSERVED in BYOP row 3 (AA..AH) and in the MASTER_MODEL tab `Sheet23`, where row 1 lists every zone code as a flat key:

`FOUNDATIONAL - RP - BS - VERTICAL PUSH` = **LEVEL** - **FAMILY** - **LATERALITY** - **MOVEMENT PATTERN**

| Abbrev. | Meaning | Where |
|---|---|---|
| `RP` | Resistance Pattern | all upper-body zones |
| `AP` | Athletic Pattern | other columns (`AP - THROWING`, `FOUNDATIONAL - AP - TRIPPLE EXT`) |
| `CT` / `CP` | Core Thorax / Core Pelvis | Sheet23 `FOUNDATIONAL - CT - SAGITAL` etc. |
| `BS` | Bilateral Symmetrical | |
| `UL` | Unilateral | |

Zone list for O..AH (BYOP zone column → Sheet23 verbatim code):

- O `FOUNDATIONAL - CT - SAGITAL`, P `INTERMEDIATE - CT - FRONTAL`, Q `ADVANCED - CT - TRANSVERSE`
- R `FOUNDATIONAL - CP - SAGITAL`, S `INTERMEDIATE - CP - FRONTAL`, T `ADVANCED - CP - TRANSVERSE`. This zone is **empty** in Sheet23; BYOP has `Hanging rotational knees to chest`.
- U `FOUNDATIONAL - RP - BS - VERTICAL PULL`, V `ADVANCED - RP - BS - VERTICAL PULL`, W `RP - UL - VERTICAL PULL`
- X `RP - BS - HORIZONTAL PULL` (no level word), Y `RP-BS-ADVANCED HORIZONTAL PULL`, Z `RP - UL - HORIZONTAL PULL`
- AA `FOUNDATIONAL - RP - BS - VERTICAL PUSH`, AB `ADVANCED - RP - BS - VERTICAL PUSH`, AC `RP - UL - VERTICAL PUSH`
- AD `RP - BS - FOUNDATIONAL- HORIZONTAL PUSH`, AE `RP - BS - INTERMEDIATE - HORIZONTAL PUSH`, AF `RP - BS - ADVANCED HORIZONTAL PUSH`, AG `RP - UL - HORIZONTAL PUSH`
- AH `RP -SHOULDERS`

The word order is inconsistent: the level comes first in some codes, in the middle in others, and is missing in the rest. The spacing and hyphens also vary. Proposed canonical form, written into each record's `zone.canonical_zone`: `LEVEL|FAMILY|LATERALITY or REGION|PATTERN[|PLANE]`, for example `ADVANCED|RESISTANCE|BILATERAL|VERTICAL_PUSH` or `INTERMEDIATE|CONTROL|CORE_THORAX|FRONTAL`.

---

## 3. Physical layout: master stacks, level views, bands

**Master stack (OBSERVED).** One long column per group (O, U, X, AA, AD, AH, plus R) holds every level in vertical blocks. Each block is a level header cell followed by a `'CHOOSE 👇'` cell and then the items. The block headers sit at fixed row "bands":

| Band | Block header rows | Used by |
|---|---|---|
| 1 | r8 (r9 for O, where r8 is the section label `CORE THORAX`) | FOUNDATIONAL / EASY |
| 2 | r44 + r45 `CHOOSE 👇` (O: r45 + r46) | ADVANCED (pulls, vertical push) or MODERATE (core, horizontal push) |
| 3 | r89 + r90 (O: r90 + r91) | UNILATERAL (pulls, vertical push) or ADVANCED (core, horizontal push) |
| 4 | r124 + r125 | AD `UNILATERAL`. O124 `CORE PELVIS` + O126 `FOUNDATIONAL` |
| 5 | r162 + r163 | O `MODERATE` (pelvis) |
| 6 | r207 + r208 | O `ADVANCED` (pelvis) |

**Level-view columns (OBSERVED).** P, Q, S, T, V, W, Y, Z, AB, AC, AE, AF and AG each re-list one block, starting at row 9 (r8 is empty), so a person can see each level side by side. They carry **black separator rows** (fill 000000) at r43, 88, 123, 163, 203, 243, 283, 310 and 330. Those are the same band boundaries where the dropdown ranges stop (see section 4).

**Item colours (OBSERVED).** Items take their column's zone colour. In the master stacks, all bilateral items keep the master colour whatever their level. The **unilateral blocks are recoloured to the UL-lane colour**: U91 76A5AF, X91-92 76A5AF, AD126-130 9FC5E8. AA91-94 stays 6FA8DC, which is also AC3's colour.

---

## 4. Dropdown wiring: which program slots point here

The text dump shows "DATA VALIDATIONS" as empty because openpyxl drops cross-sheet validations. I recovered them from the raw sheet XML (OBSERVED). **Only the master columns are dropdown sources.** R and all 13 level-view columns are referenced by **no** dropdown.

| Library range | Program slot (PURPOSE / CATEGORY in the program tab) | Slots per week per template |
|---|---|---|
| `'MASTER EXERCISE LIBRARY'!$O$7:$O$283` | `Core` (no category). Covers the thorax block AND the pelvis copy, which is why the pelvis stack was duplicated into O124-209. | 2 in AESTHETICS, ATHLETIC, JUSTICE LEAGUE, BOOTCAMP 1 and 2, both NO ACCESS tabs; 3 in 3 DAY BUILDER; **0 in PUSH/PULL/LEGS** |
| `$U$7:$U$122` | `Back ` (trailing space) / `Vertical Pull` | 2 per 4-day template; 2 in PPL; 1 in 3 DAY BUILDER |
| `$X$7:$X$162` | `Back` (no space) / `Horizontal Pull` | 2 per 4-day template; **4 in PPL**; 2 in 3 DAY BUILDER |
| `$AA$7:$AA$122` | `Chest/Shoulders` / `Vertical Push` | 2 per 4-day template; 2 in PPL; 1 in 3 DAY BUILDER |
| `$AD$7:$AD$162` | `Chest` / `Horizontal Push`; in PPL also `Chest` / `Incline`, `Chest` / `Flies`, `Chest` / `Dips` | 2 per 4-day template; **8 in PPL** (2 each); 2 in 3 DAY BUILDER |
| `$AH$7:$AH$42` | `Shoulders/Traps` / `ABdution` (typo for Abduction); in PPL also `Shoulders/Traps` / `Reverse Flies` | 2 per 4-day template; 4 in PPL; **0 in 3 DAY BUILDER** |

Consequences (OBSERVED, then INFERRED):

- The dropdown offers *everything in the stack*, including the block-label rows (`FOUNDATIONAL`, `ADVANCED`, `UNILATERAL  `) and repeated `CHOOSE 👇` cells, which act as visual separators. **No level, equipment or region filtering exists.** The coach filters by eye. The JSON's `level`, `equipment`, `no_equipment_ok` and `category` fields are what a generator needs to do this automatically.
- The two "NO ACCESS" tabs (both **hidden** sheets, OBSERVED in workbook.xml) use the same dropdowns. The library has no "no-equipment" pool. Their header cells read `CHOSE 👇` (typo).
- The PURPOSE text in the program tabs differs from library row 6: `Chest/Shoulders` vs `SHOULDERS/TRAPS` (AA6), `Shoulders/Traps` vs `SHOULDERS` (AH6), `Chest` vs `CHEST/FRONT DELTS`.
- `'Back '` with a trailing space is *always* the Vertical Pull slot and `'Back'` is always Horizontal Pull, across all 9 tabs. This is probably an accidental copy-paste artefact, but it is consistent.
- In the 4-day templates, Core sits in the `'Optional'` block (AESTHETICS, 3 DAY BUILDER) or on the conditioning day together with Calves, Cardio/Aerobic Capacity, Focus 1 and Focus 2 (ATHLETIC, JUSTICE LEAGUE, BOOTCAMP). Core is treated as accessory/conditioning, not a main lift (INFERRED).
- Upper-body slots per 4-day week: each of the 5 patterns (H-pull, V-pull, H-push, V-push, abduction) appears **twice**, so 10 upper slots per week. At the 2-3 sets seen in the filled tabs, that is about 4-6 direct sets per pattern per week. The coach's "15-20 sets per muscle" target must therefore come from *summing patterns per muscle* (for back: 2 H-pull + 2 V-pull = 4 slots, so 8-12 sets) plus the Focus 1/Focus 2 slots (`AZ7:AZ335` 'MUSCLE FOCUS OPTIONS'). INFERRED.

---

## 5. Level mechanics per category

| Category | Levels as written | Decoded logic (INFERRED from item content and colours) |
|---|---|---|
| CORE THORAX | row 3: `EASY` / `MODERATE` / `HARD`; blocks `FOUNDATIONAL` / `MODERATE` / `ADVANCED`; Sheet23 `FOUNDATIONAL / INTERMEDIATE / ADVANCED` | **Level is the plane** (OBSERVED: each level column has exactly one plane in row 5): sagittal (anti-extension, flexion), then frontal (anti-lateral flexion), then transverse (rotation). This matches the "plane progression" thinking of Pat Davidson. |
| CORE PELVIS | `EASY` / `MODERATE` / `ADVANCED` | Same plane ladder. "Pelvis" means the pelvis/legs move on a fixed ribcage (leg raises, reverse crunch); "thorax" means the ribcage moves on a fixed pelvis (crunch, sit-up). The MASTER_MODEL tab `CONTROL PATTERNSCORE` refines this grid to TRANSVERSE / SAGITAL / FRONTAL × DYNAMIC / STATIC × CORE THORAX / CORE PELVIS / BOTH. |
| VERTICAL PULL | `FOUNDATIONAL` → `ADVANCED`; `UNILATERAL` lane = `ANY` | Machine or assisted (pulldowns, assisted pull-up machine, bands, seated rings) → free bodyweight pull-up variants → weighted. Two levels only. |
| HORIZONTAL PULL | `EASY` / `FOUNDATIONAL` → `ADVANCED`; UL = `ANY` | Machine or suspension (supported) → free-standing hinge barbell rows and seal rows → renegade. |
| VERTICAL PUSH | `FOUNDATIONAL` → `ADVANCED`; UL lane | Seated with back support → floor (Z press) → kneeling → standing → inverted (HSPU). DB before barbell at each position. Exception: push press and push jerk sit in FOUNDATIONAL (see open questions). |
| HORIZONTAL PUSH | `FOUNDATIONAL` → `MODERATE`/`INTERMEDIATE` → `ADVANCED`; UL lane | Cable, floor press and regressed push-ups → full push-up + flies → free-weight bench, dips, decline and deficit push-ups. This is the only upper pattern with 3 levels. |
| SIDE RAISES | none (`RP -SHOULDERS`) | One pool. Level is not a variable for isolation work. The JSON sets level = `any` (INFERRED). |

**Cross-check (OBSERVED in MASTER_MODEL `(NOT DONE) RESISTANCE PATTERNS`).** The same presses carry a **traffic-light fill**: green B6D7A8, yellow FFE599, red E06666.

- Vertical push: `Seated DB press` and `Seated Barbell press` green; `DB Z press on floor`, `Barbell Z press on floor` and `Kneeling DB press` yellow; `Kneeling barbell press`, `Standing DB press` and `Standing Barbell press` red.
- Horizontal push: `DB floor press`, `Cable standing chest press` and `Kneeling pushups` green; `Bench pushups` and `Pushups` yellow; `Diamond pushups`, `DB bench press` and `Barbell bench press` red.
- Unilateral horizontal push: alternating DB floor press and alternating cable press green; one-hand-higher push-ups yellow; alternating DB bench red.

So the coach's latent model has **3 tiers for every pattern**. BYOP's FOUNDATIONAL/ADVANCED split for vertical push compresses green into FOUNDATIONAL and yellow+red into ADVANCED.

**Experience-level vocabulary elsewhere (OBSERVED).** MASTER_MODEL `EXAMPLE PUSHPULLLEGS SPLIT` has columns `NOVICE` / `NEWBY` / `INTERMEDIATE` with the *same exercises* and different doses:

- Incline DB Bench: 3×15 → 4×10 → 4×8
- Barbell Bench: 3×15 → 3×10 → 4×8
- Dips: 3×8 → 3×10 → 4×MAX
- Side raises: 3×15 → 4×8 → 4×8

As the client becomes more experienced, sets go up, reps go down and load goes up. That tab also states 1-3 RIR ("RPE 7+") and the joint-pain rule (see section 8).

---

## 6. Ordering logic inside blocks (INFERRED from sequences)

The coach enumerates a **pattern × implement × grip × body-position** variation grid, mostly ordered from simple/supported to complex/loaded:

- VERTICAL PULL FOUNDATIONAL (U9-20): lat pulldown in 6 grips (wide, supinated, pronated, wide MAG, rope, close) → band-assisted pull-up → assisted machine in 3 grips → seated ring/TRX pull-up → KB face pulls.
- VERTICAL PULL ADVANCED (U46-52): strict pull-up by *body position* (feet behind, feet in front, knees in chest, L-sit) → by *grip* (chin-up, wide) → *weighted* last.
- HORIZONTAL PULL: machine row ×3 grips → TRX → inverted. Then bent-over barbell (pronated, supinated) → bent-over close/pronated → seal barbell (supinated, pronated) → seal DB (supinated, pronated) → renegade. Then UL: DB/KB → cable.
- VERTICAL PUSH: always a **DB then Barbell pair**: incline seated, push press, push jerk, Z press, kneeling, standing. Then bodyweight inversions (HSPU, pike), then thrusters DB → BB. UL: seesaw → alternating → landmine → single-arm thruster.
- HORIZONTAL PUSH ADVANCED: incline DB → feet-on-wall push-up → diamond → DB bench → BB bench → dips → weighted dips → decline → deficit.
- SIDE RAISES: no difficulty order. Lateral, reverse and front raises are interleaved. The last two (`Cable machine Leaning Side raises `, `Machine reverse fliez`) were appended later and are absent from Sheet23.
- CORE THORAX FOUNDATIONAL: plank → crunch → sit-up → weighted sit-up → **[O14 left blank]** → toes to bar → knees to chest. The blank row suggests a deleted item.

The RESISTANCE PATTERNS tab names these modifiers explicitly: `HAND PLACEMENT` (supinated, neutral, pronated, wide grip, narrow grip), `FEET POSITION` (feet on bench, wall, raisers, floor, in air), `STANCES` (`Split stance ALWAYS contralateral`, half-kneeling same-side or opposite-side leg up), `HALF KNEELING VARIATIONS`, and a third push bucket **`MID RANGE PUSH`** (incline benches, landmine, viking press). BYOP folds that bucket into vertical push (incline seated presses, kneeling landmine press) and horizontal push (incline DB bench).

---

## 7. Duplicates, typos, conflicts (OBSERVED)

**Duplicates**

- Every level-view item duplicates a master-stack item. The exceptions are `Deficit Push-ups` (AF18), which is the renamed AD99 `Elevated Push ups (for full ROM)`, and the ordering of `Bench Push ups` (see conflicts).
- The whole CORE PELVIS stack appears twice: R8-R91 and O124-O209.
- `Side Plank ` (O47/P9, thorax) = `Side Planks ` (O164/R46/S9, pelvis).
- `Standing DB Press` is written twice: AA50/AA51 and AB13/AB14. The second is almost certainly `Standing Barbell Press`, because every neighbour is a DB/Barbell pair and RESISTANCE PATTERNS E14/E15 lists both.
- `Incline Push-ups` appears in FOUNDATIONAL (AD12) and MODERATE (AD46/AE9).
- Near-duplicates: `Bent Over Barbell Rows` vs `Bent Over Rows Pronated Grip`; `Hanging Rotational Knee/Leg Raises` (FOUNDATIONAL sagittal) vs `Hanging rotational knees to chest` (ADVANCED transverse).

**The level views are not complete mirrors of the master stack.** These items are missing from the views:

- AB: `DB Thrusters`, `Barbell Thrusters`
- AC: `Single arm DB thrusters`
- AE: `Cable flies`, `Machine flies`
- AD foundational, not in any view: `Machine bench press` (the newest item; it is not in the `Copy of MASTER EXERCISE LIBRARY` tab either)
- AF has `Bench Push ups`, which the master lists as FOUNDATIONAL

The views match MASTER_MODEL `Sheet23` almost exactly. They look like an export of an older zone list, while the master stacks kept growing.

**Typos (keep verbatim in the data, corrected in `name_clean`)**

- In-scope labels: `SAGITAL`, `Stricted`, `Sesaw`, `Coppenhaggen`, `Declined Pushups`, `fliez`, `Assisted  Pull-Up` (double space), `Machine Row Pronated Grips`, `Lat Pulldowns` vs `Lat Pulldown`, `DB/ Kb Rows`, `UL` used inside a name (`Cable Machine UL Rows`), the program slot `ABdution`, and many trailing spaces.
- In the copy tabs: `Horizontal Push` in title case (L1).
- Elsewhere on the sheet: `TRIPPLE`, `INTERMIDIATE`, `DOMNANT`.

**Placement conflicts**

- `Toes to bar` and `Knees to chest` are filed under CORE THORAX, but CONTROL PATTERNSCORE files them under CORE PELVIS.
- `V-ups` is under CORE PELVIS, but CONTROL PATTERNSCORE lists it under BOTH.
- `Hanging Rotational Knee/Leg Raises` is rotational yet sits in the SAGITAL zone.
- `KB Face Pulls` is a rear-delt / horizontal pattern listed under VERTICAL PULL. RESISTANCE PATTERNS puts face pulls under SHOULDERS.
- `Renegade Rows` is alternating but sits in a BILATERAL SYMMETRICAL block.
- `DB/Barbell Push press` and `Push Jerk` are listed as FOUNDATIONAL.
- `Pike Push Ups`, normally a regression, is listed as ADVANCED.
- `Bench Push ups` is FOUNDATIONAL (AD13), ADVANCED (AF11, Sheet23), and yellow in RESISTANCE PATTERNS.
- `Front Raises` (shoulder flexion) live in the `ABdution` slot pool.
- `Dips` are under chest here but under `TRICEP 👇` in the AZ focus list.

**Copy-only item.** `Barbell Incline Bench Press` exists only in `Copy of Copy of MASTER EXERCISE` L35, appended after its UNILATERAL block in the bilateral colour. It is included in the JSON with `record_role = copy_tab_only_not_in_live_library`.

**Version history (INFERRED).** There are three generations:

1. MASTER_MODEL `Sheet23` and the BYOP level views.
2. `Copy of MASTER EXERCISE LIBRARY`: a full stack without `Machine bench press`, still with `FILL HERE` in CORE PELVIS.
3. The live library: `Machine bench press` added, pelvis folded into O, side-by-side views added.

`Copy of Copy of MASTER EXERCISE` is a compact (no bands) export. Its row-1 headers for TRIPPLE EXTENSION, PLYOS, THROWING, CORE THORAX, CORE PELVIS, HORIZONTAL PULL and every lower-body group except CALVES are in **red font (FF0000)**. VERTICAL PULL, VERTICAL PUSH, Horizontal Push, SIDE RAISES, BICEP, TRICEP, CALVES, CARDIO and CHANGE OF DIRECTION are not red. The meaning is unknown; possibly "reviewed" or "used by the athletic template".

---

## 8. Dosing evidence for these exercises (OBSERVED, used for `typical_rep_range_guess`)

- **The BYOP REPS dropdown (AW8:AW14)** is the coach's rep vocabulary: `4 to 6 Reps`, `6 to 8 Reps`, `8 to 12 Reps`, `10 to 15 Reps`, `15 Reps`, `20 Reps`, `MYO SET`.
  - SETS (AV8:AV16): 1-8 and `SUPERSET W/ 👇`.
  - EFFORT (AX): a 1-10 scale where `8 - That was perfect` and `9 - That was terrible`.
  - FEELING (AY): `Felt the RIGHT muscles`, `Felt the WRONG muscle`, `Felt a PAIN`, `Couldn't do it`.
  - Together these are the autoregulation and swap triggers.
- **Filled BYOP slots in scope:**
  - `Bent Over Barbell Rows` 3 × 8-12
  - `Lat Pulldown Pronated Grip` 3 × 15
  - `Push Ups ` 3 × 15
  - `DB Push press` **5 × 6-8**, all in AESTHETICS
  - `Stricted Pull-ups feet in front ` 2 × 8-12 and `Cable Machine UL Rows` 2 × 8-12 'SINGLE ARM', in JUSTICE LEAGUE
- **Small vs big muscle (MASTER_MODEL FAT BURN):** `SIDE RAISES` 3×15 → 4×15 → 3×20 → 4×20 across weeks, while presses and rows sit at 8-12. This confirms the coach's rule that small muscles get more reps.
- **Core is dosed by time or accumulated totals, not by the REPS dropdown** (BASEBALL slot labels `Sagital core`, `LATERAL CORE`, `Transverse core`):
  - Lateral: 2 × "Accumulate 2 minutes on each side"
  - Transverse: "12/12 powerful turns", "20/20", accumulate 3-4 minutes
  - Sagittal: "Accumulate 50" or "75 reps", 4 × 15 toes-to-bar, accumulate 4-5 min plank
  - The generator needs a time/accumulate dose type for CONTROL exercises.
- **Parser warning.** Google Sheets turned per-side doses such as `8/8`, `10/10`, `12/12` and `8/12` into **dates** (for example `2022-08-08` = "8/8"). Decode a datetime as month/day.
- **Pain rule.** MASTER_MODEL PPL tab, A7: when there is joint pain, move away from fixed grips (barbells, bars) toward split grips (dumbbells, KBs, individual grips). The library's DB↔Barbell pairs and grip variants are the substitution map for this. The `slot_tags` field marks `fixed grip` / `split grip` where it applies.

---

## 9. JSON record design (`L2_core_upper.json`)

There is one record per exercise cell (173). Beyond the requested schema, each record adds:

| Field | Meaning |
|---|---|
| `record_role` | `dropdown_master_stack` / `dropdown_master_stack (CORE PELVIS block copied into column O)` / `category_column_not_referenced_by_any_dropdown` (R) / `level_view_column_not_referenced_by_any_dropdown` / `copy_tab_only_not_in_live_library` |
| `in_program_dropdown`, `dropdown_range`, `program_slot_labels`, `program_tabs_slot_count` | Live wiring to the program templates |
| `zone` | The effective level column for master-stack items: row-3/5/6 labels, colour, Sheet23 code and `canonical_zone` |
| `level` | `{raw, raw_source_cell, normalized, zone_row3_label, zone_row3_cell}`. `normalized` is one of foundational, intermediate, advanced or any (EASY → foundational, MODERATE → intermediate, HARD → advanced, UNILATERAL/ANY → any) |
| `level_block_colour` | Row-3 colour of the effective zone column |
| `cell_bg` | The item cell's own fill |
| `block_header_cell` | The cell holding the block label |
| `canonical_id`, `dedupe_key` (`category:canonical_id`), `is_primary_in_category`, `duplicate_of_cell`, `all_cells_same_exercise`, `levels_all`, `categories_all` | Use `is_primary_in_category == true` for a deduplicated pool (109 records) |
| `coach_rep_bucket_guess` | Mapped onto the AW dropdown vocabulary |
| `slot_tags` | Which program sub-slot an item fits (`Incline`, `Flies`, `Dips`, `ABdution`, `Reverse Flies`, `Front Raises`), plus modifiers such as grip and stance |
| `equipment_note`, `observed_prescriptions_byop`, `probable_intended_name` | AA51 and AB14 only for the last one |

`plane` for resistance exercises is INFERRED. RESISTANCE PATTERNS files every pull/push variant under `BILATERAL SAGITAL` / `UNILATERAL SAGITAL`, so sagittal is the default. The exceptions are the anatomical cases: lateral raises are frontal, reverse flies and face pulls are transverse, and hammer side/front raises and renegade rows are multi-plane.

There are no hyperlinks or video links in the BYOP library. The VIDEO columns for upper body in MASTER_MODEL RESISTANCE PATTERNS (F, H, J, L) are empty. The links in column B/D there belong to lower-body rows and must **not** be attached to the pull exercises that share the row.
