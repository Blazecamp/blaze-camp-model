# L3: MASTER EXERCISE LIBRARY, columns AI–AU (lower body + arm/calf isolation)

Source: BYOP workbook ("BUILD YOUR OWN PROGRAM - BLAZE CAMP MODEL"), tab `'MASTER EXERCISE LIBRARY'`, columns AI..AU, rows 1..104.
Companion data: `L3_lower_isolation.json` (161 records, one per non-structural cell, including the per-level mirror columns).
Built by reading the raw xlsx directly (`raw/BYOP.xlsx`, `raw/MASTER_MODEL.xlsx`). Nothing in Google Sheets was modified.

Labels: **OBSERVED** means read from a cell, colour, merge, or data-validation rule. **INFERRED** means my interpretation. Coach labels are quoted verbatim, typos included (e.g. 'DOMNANT', 'INTERMIDIATE', 'Harmstring').

---

## 1. Scope and counts (OBSERVED)

| Col | Row 1 CATEGORY (verbatim) | Records | Level blocks in column | Dropdown source used by program tabs? |
|---|---|---|---|---|
| AI | 'BILATERAL KNEE DOMINANT' (merged AI1:AK1) | 35 | FOUNDATIONAL r8 (12) / MODERATE r44 (9) / ADVANCED r89 (14) | yes: `$AI$7:$AI$122` (all three levels in one list) |
| AJ | (merged under AI1) | 9 | the MODERATE list again, rows 9–19 | **no** |
| AK | (merged under AI1) | 11 | the ADVANCED list again (without the 3 thrusters), rows 9–19 | **no** |
| AL | 'UNILATERAL KNEE DOMINANT' | 13 | none (no level label) | yes: `$AL$7:$AL$42` |
| AM | 'LEG EXTENSIONS' | 1 | none | yes: `$AM$7:$AM$9` |
| AN | 'BILATERAL HIP DOMNANT' (merged AN1:AP1) | 33 | FOUNDATIONAL r8 (12) / MODERATE r44 (10) / ADVANCED r89 (11) | yes: `$AN$7:$AN$122` |
| AO | (merged under AN1) | 10 | the MODERATE list again, rows 9–18 | **no** |
| AP | (merged under AN1) | 11 | the ADVANCED list again, rows 9–19 | **no** |
| AQ | 'UNILATERAL HIP DOMINANT' | 8 | FOUNDATIONAL r8 only | yes: `$AQ$7:$AQ$42` (but see the bug in §7) |
| AR | 'LEG CURLS' | 2 | none | yes: `$AR$7:$AR$10` |
| AS | 'BICEP' | 14 | none | yes: `$AS$7:$AS$42` |
| AT | 'TRICEP' | 9 | none | yes: `$AT$7:$AT$42` |
| AU | 'CALVES' | 5 | none | yes: `$AU$7:$AU$13` |

- There are 161 records. 41 of them are mirror copies in AJ/AK/AO/AP, which leaves 120 records in the main columns and **117 unique names**. Within the main columns, 'Leg Extension Machine' appears 3 times and 'GHD' twice.
- Ignoring spelling, there are about 108 distinct movements. Near-duplicates:
  - 'Leg Extension Machine' ×3 plus 'Leg Extensions'
  - 'Hack Squat Machine ' plus 'Hack Squats'
  - 'Leg Curl Machine', 'Machine Leg Curls (Seated and Laying Down)', 'Machine Leg Curls', 'Seated leg curls', 'Lying Leg Curls'
  - 'Seated Db Bicep Curls' plus 'Seated DB Curls '
  - 'Standing DB calf Raises (Use Deficit)' plus 'Calf Raises w/ DB '
  - 'Harmstring MedBall Curls' plus 'swiss ball hamstring curls' plus 'Medicine or Stability Ball Harmstring Curls'
  - 'Shoulder Wide Grip Deadlift' plus 'Barbell Deadlifts'
  - 'Straight bar pronated tricep extensions ' plus 'Cable tricep push downs'
- 'SIDE RAISES' (AH) is just outside this range. AV–AY ('SETS', 'REPS', 'EFFORT', 'FEELING') sit just after it and set the prescription vocabulary (§6).

## 2. Header rows 1–7 (OBSERVED, with interpretation)

Column A labels three of the header rows: A3 'ZONE', A4 'PATTERN', A6 'PURPOSE'.

| Row | Content in AI–AU | Formatting | Meaning |
|---|---|---|---|
| 1 | Category name (bucket) | bold; grey fills alternate CCCCCC / EFEFEF / 999999 / D9D9D9 / B7B7B7; merged AI1:AK1 and AN1:AP1 | The bucket the program template asks for. The grey alternation only separates groups visually (INFERRED). |
| 2 | 'FILL HERE' (only on the main columns AI, AL, AM, AN, AQ ('FILL HERE ' with trailing space), AR, AS, AT, AU) | fill **000000 black**, font F3F3F3 (near-invisible) | A builder/input marker for BYOP users, hidden by design (INFERRED). The AJ/AK/AO/AP mirrors don't have it. |
| 3 | **ZONE code**, e.g. 'RP - BS - KNEE DOMINANT' | the column's own colour | Grammar: `[pattern family] - [symmetry] - [movement] - [level]`. See §3. |
| 4 | 'RESISTANCE' in every column | column colour | PATTERN family. Every AI–AU record is `family = RESISTANCE`. |
| 5 | 'BILATERAL' / 'UNILATERAL'; **empty** in AS, AT, AU | column colour | Laterality. AR5 says 'UNILATERAL' for machine leg curls, which looks like a copy artifact (§9). |
| 6 | 'QUADS', 'QUADS/GLUTES', 'GLUTES/HAMSTRINGS', 'HAMSTRINGS', 'BICEP', 'TRICEP', 'CALVES' | muscle colour (see §5) | PURPOSE, the target muscle. Program tabs reuse it as the PURPOSE column ('Quads', 'Quads/Glutes', 'Hamstring', 'Hamstring/Glutes', 'Hamstrings', 'Bicep', 'Tricep', 'Calves'). |
| 7 | 'CHOOSE 👇' | 93C47D green, bold | Placeholder and default dropdown value. Every program dropdown range starts at row 7. |
| 8+ | Level label ('FOUNDATIONAL' / 'MODERATE' / 'ADVANCED') or exercises | exercise cells use the column colour, not bold | Data |

Header rows 1–6 are italic across the whole sheet, so italics carry no meaning (OBSERVED, checked A–BE).

## 3. ZONE codes (row 3)

| Cell | Verbatim | Fill | Decoded |
|---|---|---|---|
| AI3 | 'RP - BS - KNEE DOMINANT' | FFD966 | Resistance Pattern, Bilateral Symmetrical, Knee Dominant (main column holding all levels) |
| AJ3 | 'RP-BS-KNEE DOMINANT-INTERMIDIATE' | FFF2CC | same, intermediate level |
| AK3 | 'RP-BS-KNEE DOMINANT -ADVANCED' | FFF2CC | same, advanced level |
| AL3 | 'RP - UL - KNEE DOMINANT' | FFE599 | Resistance Pattern, Unilateral, Knee Dominant |
| AM3 | 'RP-BS-KNEE DOMINANT -ADVANCED' | FFD966 | Reads as advanced, but this is almost certainly a copy of AK3. The fill matches AI, not AK's FFF2CC, and leg extensions appear at all three AI levels. JSON normalises it to `any` (INFERRED). |
| AN3 | 'RP - BS - HIP DOMINANT' | 93C47D | Resistance Pattern, Bilateral Symmetrical, Hip Dominant |
| AO3 | 'RP-BS-HIP DOMINANT-INTERMIDIATE' | D9EAD3 | intermediate |
| AP3 | 'RP-BS-HIP DOMINANT-ADVANCED' | D9EAD3 | advanced |
| AQ3 | 'RP - UL - HIP DOMINANT' | B6D7A8 | Resistance Pattern, Unilateral, Hip Dominant |
| AR3 | *(empty)* | 93C47D | no code. AR3:AR5 look copied from the hip-dominant header. |
| AS3 / AT3 / AU3 | 'RP - BICEP' / 'RP - TRICEP' / 'RP - CALVES' | E6B8AF / FCE5CD / EAD1DC | single-muscle resistance buckets |

**Code vocabulary across both workbooks** (OBSERVED in K3 'AP - THROWING' and the MASTER_MODEL 'Sheet23' row-1 headers, e.g. 'FOUNDATIONAL - CT - SAGITAL', 'FOUNDATIONAL - CP - SAGITAL', 'FOUNDATIONAL - RP - BS - VERTICAL PULL'):
- AP = Athletic Pattern
- CT = Core Thorax
- CP = Core Pelvis
- RP = Resistance Pattern
- BS = Bilateral Symmetrical
- UL = Unilateral
- COD = change of direction

The level token appears either first ('FOUNDATIONAL - …') or last ('…-ADVANCED'). Row 3 is only partly migrated to codes: the athletic, control and pull columns still hold plain levels in row 3 ('EASY', 'MODERATE', 'HARD', 'FOUNDATIONAL', 'ANY'). Sheet23 is the older fully-coded version.

**"Zone" has two other meanings in the workbooks (keep them separate):**
- 'Cable Machine Curls (Zone1, Zone 2, Zone 3' (AS12), and in legacy Sheet23 'Unilateral/Bilateral DB Tricep Extension (Zone 3)' and 'Cable Machine Tricep Extensionw/ Rope (Zone 1 and Zone 3)'. These most likely mean resistance-profile zones: the cable angle puts peak tension at the lengthened (1), mid (2) or shortened (3) part of the range (INFERRED).
- Sheet23 C34–D36 is the plyo meaning: 'ZONE 1' 'Receive pause/creat', 'ZONE 2' 'Receive/create', 'ZONE 3' 'Repeat receive create'. Sheet23 column A also tags rows 'ZONE 1' (green B6D7A8, r2–9), 'ZONE 2' (yellow FFF2CC, r10–16) and 'ZONE 3' (pink F4CCCC, r17–28), but those bands don't line up with exercise difficulty. Open question.

## 4. Level mechanics

**Stacked-block design (OBSERVED).** The two bilateral compound columns, AI and AN, each hold three level blocks in one column:
- 'FOUNDATIONAL' label at r8; exercises from r9.
- 'MODERATE' label at r44, 'CHOOSE 👇' at r45; exercises from r46.
- 'ADVANCED' label at r89, 'CHOOSE 👇' at r90; exercises from r91.

The same 8/44/89 grid is used across the whole sheet (C, G, L, O, R, U, X, AA, AD, AI, AN, AQ). It also lines up with sheet-wide black (000000) separator rows at 43, 88, 123, 163, 203, 243, 283, 310 and 330, and with the AZ 'MUSCLE FOCUS OPTIONS' groups (QUADS r8, SHOULDERS/TRAPS r44, BACK r89, TRICEP r124, GLUTES r164, HAMSTRINGS r204, CHEST r244, CORE r284, BICEP r311, CALVES r331). Inside AI and AN, the column colour paints over the black separators.

**Per-level mirror columns (OBSERVED).**
- AJ mirrors AI46–56 and AO mirrors AN46–55, each shifted up 37 rows.
- AK mirrors AI91–101 and AP mirrors AN91–101, each shifted up 82 rows.
- The gaps carry over too: AI53:AI54 is blank, so AJ16:AJ17 is blank.
- AK is missing the three thrusters added later at AI102–104.
- No program dropdown references AJ, AK, AO or AP.

INFERRED: these mirrors are left over from the legacy layout, where each level had its own column (MASTER_MODEL 'Sheet23' AC/AD/AE and AF/AG/AH). The coach later merged the levels into the single stacked AI and AN columns so one dropdown offers every level. The generator should use AI and AN as the source of truth and treat AJ/AK/AO/AP as duplicates (each record carries `mirror_of`).

**Level vocabulary.** The stacked label 'MODERATE' and the zone code 'INTERMIDIATE' name the same tier. Normalised: `foundational` / `intermediate` / `advanced` / `any`.

**What gets levelled (OBSERVED), and why (INFERRED).**
- Only the **bilateral compound** lists (knee- and hip-dominant) have three levels. These are where load and technique risk sit: barbell, box, bands, powerlifting variants.
- **Unilateral hip dominant** has one block, 'FOUNDATIONAL'. **Unilateral knee dominant** has no label at all.
- **Isolation lists** (LEG EXTENSIONS, LEG CURLS, BICEP, TRICEP, CALVES) have no levels.
- The MASTER_MODEL '(NOT DONE) RESISTANCE PATTERNS ' tab explains the unilateral case. Lunge stances are listed as 'FEET POSITIONING VARIATIONS', and difficulty lives on a **separate loading axis**:
  - 'GET INTO THE HIP VARIATIONS - MODERATE' = 'Contralateral loading '
  - 'GET OUT OF THE HIP - MODERATE' = 'Ipsilateral loading '
  - '…- HARDER' = front-racked DB/KB contralateral or ipsilateral
  - 'LOW/MID LOADING VARIATION' = plate reach, goblet, double KB/DB
  - 'HIGH LOADING VARIATION' = barbell high zercher / zercher / front / back racked, overhead
  - '(NOT DONE) ALL ABOUT LUNGES' summarises it: "Stance loads the FRONT TO BACK / Load position loads UP/DOWN & SIDE2SIDE / Movement orientations/guidance loads AROUND".
- **Generator rule (INFERRED):** unilateral exercise = stance (from AL/AQ) × load position. The level comes from the load position, not from the stance.

**Cross-check of levels (OBSERVED).** The RESISTANCE PATTERNS tab colour-codes the same exercises green 93C47D/B6D7A8 (easy), yellow FFE599 (moderate) and red E06666 (hard). The library levels agree:
- Air/box/goblet/hex/landmine/low-DB squats are green and FOUNDATIONAL.
- Double-KB front rack, high zercher, front squat, high-bar and low-bar squats are yellow and MODERATE.
- 'Box *ANY Squat…' variants are red and ADVANCED.
- Glute bridges, reverse hyper, pull-through and KB deadlifts are green and FOUNDATIONAL.
- GHD, 45° hip extension, hex/DB/shoulder-width deadlifts are yellow and MODERATE.
- Wide/snatch-grip deadlift, barbell good morning and sumo are red and ADVANCED.
- **One mismatch:** 'Barbell zercher squat' is yellow, and 'Zercher Squat' is 'MODERATE' on the squat posture scale, but 'Box. Zercher squat Touch and Go' sits in FOUNDATIONAL (AI9). The box limiting depth may explain it (INFERRED).

The same tab grades hinge modifiers:
- 'ROM VARIABLE': 'Elevated' green → 'Floor' yellow → 'Deficit' red / '*RDL' red
- 'END RANGE BEHAVIOR VARIABLE': 'Dead stop' green → 'Touch & go' yellow → '*RDL' red
- 'LOADING VARIABLES': 'WEIGHT RELEASERS', 'CHAINS', 'BANDS', '*RDL'

**Squat loading-position scale (OBSERVED, MASTER_MODEL 'ALL ABOUT SQUATS' A9:H11).** Header text: 'THIS EASY TO HARD MODEL IS TO DETERMINE HOW HARD OR EASY IS TO DO THE SQUAT WITH MAXIMAL UPRIGHT POSTURE & HIPS GOIN DOWN'.

| Rating | Squat |
|---|---|
| 'EASIEST' | Hex Bar Squat |
| 'EASIER' | Goblet Squat |
| 'EASY' | High Zercher Squat |
| 'MODERATE' | Zercher Squat |
| 'HARD' | Front Squat/ SSB Bar |
| 'HARDER' | High Bar Squat |
| 'HARDEST' | Low Bar Squat |
| 'VERY HARD ' | Overhead Squat (not in the library) |

Squat records carry `squat_posture_scale`.

**What "Deload" means here (INFERRED, strongly supported).** In 'Box. Any Squat Deload' (+ banded / reverse banded), 'Deload' is a **dead-stop box squat**: sit and unload onto the box, then drive up. It is not a deload week. Evidence: MASTER_MODEL '(NOT DONE) EXAMPLE CONJUGATE' writes '(D)BOX' vs '(T&G)BOX', and RESISTANCE PATTERNS lists 'Dead stop' / 'Touch & go'. 'Touch and Go' means touching the box and reversing immediately. 'fast' marks speed work.

## 5. Colours (OBSERVED fills; meaning INFERRED unless the sheet states it)

| Colour | Where | Meaning |
|---|---|---|
| CCCCCC / EFEFEF / 999999 / D9D9D9 / B7B7B7 | row 1 | alternating greys that separate categories visually |
| 000000 | row 2 and separator rows 43, 88, 123, 163, 203, 243, 283, 310, 330 | 'FILL HERE' bar and band separators |
| 93C47D (bold) | every 'CHOOSE 👇' row (r7, plus r45 and r90 in AI/AN) | dropdown placeholder |
| **Saturated vs light tint of the same hue** | rows 3–5 and data: AI FFD966 vs AJ/AK FFF2CC; AN 93C47D vs AO/AP D9EAD3 | **Sheet-wide rule:** the main/entry column of a family gets the saturated colour and its higher-level siblings get the light tint. Same pattern in C3 8E7CC3 vs D3/E3 D9D2E9, G3 CC0000 vs H3–J3 F4CCCC, L3 FFD966 vs M3/N3 FFF2CC, O3 6FA8DC vs P3/Q3 CFE2F3, U3 93C47D vs V3 D9EAD3. |
| FFD966 gold | AI, AM | bilateral knee dominant (AM shares AI's colour, which supports reading AM as AI's isolation companion) |
| FFE599 light gold | AL | unilateral knee dominant (same hue family as knee dominant) |
| 93C47D green | AN, AR | bilateral hip dominant; leg curls reuse it |
| B6D7A8 light green | AQ | unilateral hip dominant (same hue family as hip dominant) |
| E6B8AF / FCE5CD / EAD1DC | AS / AT / AU | bicep / tricep / calves (AU shares EAD1DC with AH 'SIDE RAISES' shoulders) |
| **Row 6 muscle colours** | E06666 red = QUADS (AJ–AM; AI6 is the exception at FFD966); 6D9EEB blue = GLUTES/HAMSTRINGS and HAMSTRINGS (AN–AR); E6B8AF bicep; FCE5CD tricep; EAD1DC calves | Muscle-group colour code: **anterior chain (quads) red, posterior chain blue**. |
| Within a column | the same fill covers all three level blocks of AI (FFD966) and AN (93C47D) | Levels are separated by label rows, not by colour. |

Copy of Copy of MASTER EXERCISE (BYOP tab 11) has **red font (FF0000)** on row-1 headers. It marks:
- 'TRIPPLE EXTENSION', 'PLYOS', 'THROWING', 'CORE THORAX', 'CORE PELVIS', 'HORIZONTAL PULL'
- every lower-body category: 'BILATERAL KNEE DOMINANT', 'UNILATERAL KNEE DOMINANT', 'LEG EXTENSIONS', 'BILATERAL HIP DOMNANT', 'UNILATERAL HIP DOMINANT', 'LEG CURLS'

It does not mark bicep, tricep, calves, vertical pull/push, horizontal push or side raises. The meaning is unknown (reviewed? needs work? used by a given template?). Open question.

## 6. Big vs small muscle logic

**Structure (OBSERVED).** Each big-muscle "joint dominance" (knee for quads, hip for glutes/hamstrings) is split three ways:

| | Knee (quads) | Hip (glutes/hamstrings) |
|---|---|---|
| Bilateral compound, levelled | AI | AN |
| Unilateral compound | AL | AQ |
| Single-joint isolation, own column | AM 'LEG EXTENSIONS' | AR 'LEG CURLS' |

Small muscles get one unlevelled isolation list each: AS 'BICEP', AT 'TRICEP', AU 'CALVES'. 'SIDE RAISES' (AH) is the equivalent outside this range.

**Big-muscle isolation shows up at every level (OBSERVED).**
- Leg extension appears in AI at all three levels (AI20, AI55, AI101), in both mirrors (AJ18, AK19), and as AM9.
- Machine leg curls appear in AN at all three levels (AN15, AN54, AN100) and as AR9–10.

INFERRED: the coach treats knee extension and flexion as always-available fillers or finishers, and as joint-friendly substitutes for the compound slot.

**Rep vocabulary (OBSERVED, AW 'REPS' dropdown):** '4 to 6 Reps', '6 to 8 Reps', '8 to 12 Reps', '10 to 15 Reps', '15 Reps', '20 Reps', 'MYO SET'.
- 'SETS' (AV): 1–8 plus 'SUPERSET W/ 👇'.
- 'EFFORT' (AX): '1 - Way Too Easy' … '8 - That was perfect' … "10 - I'm done".
- 'FEELING' (AY): 'Felt the RIGHT muscles', 'Felt the WRONG muscle', 'Felt a PAIN', "Couldn't do it".
- MYO SET is defined in ALL ABOUT SQUATS A30: 15 reps, then 5 × 5 with 3-second breaths, '40 reps without a stop' ('**MYO SET - ADVANCED').

**Observed prescriptions, by muscle size:**

| Slot | Exercise (template/tab) | Prescription |
|---|---|---|
| Calves | 'Machine Calf Raises' (BYOP AESTHETICS D3) | 3 × '15 Reps' |
| Bilateral KD | 'Leg press' (D4) | 3 × '15 Reps' |
| Unilateral KD | 'Reverse Lunges ' (D6) | 3 × '8 to 12 Reps' |
| Bicep | 'Ez Bar Curls' (D8) | 2 × '20 Reps' |
| Leg extension | 'Leg Extensions' (D9) | 2 × '20 Reps' |
| Bilateral HD | 'DB Deadlifts' (D10) | 3 × '15 Reps' |
| Bilateral KD | 'Front Squats' (BYOP JUSTICE LEAGUE E8) | 2 × '6 to 8 Reps' |
| Unilateral KD | 'Front Foot Elevated Lunges (FFE)' (E10) | 2 × '8 to 12 Reps' |
| Leg extension | 'Leg Extensions' (E12) | 2 × 'MYO SET' (client wrote 'OUCH') |
| Leg extension slot | (ATHLETIC FB G12) | 'MYO SET' |
| Squat / leg press, deadlift | MASTER_MODEL UPPER/LOWER and PPL | 2×12 → 3×10 → 4×8 (sets up, reps down week to week) |
| Lunges, SL deadlift | MASTER_MODEL UPPER/LOWER and PPL | 2×12/12 → 3×10/10 → 4×8/8 |
| Leg ext / leg curl | MASTER_MODEL UPPER/LOWER and PPL | 2×20 → 3×20 |
| Calves, curls | MASTER_MODEL UPPER/LOWER and PPL | 'MAX REPS' |
| Triceps | MASTER_MODEL UPPER/LOWER and PPL | 3×20 |
| Leg ext / curls | MASTER_MODEL FAT BURN | 4×15, 3×20, 2–3×40 |
| Arms | MASTER_MODEL FAT BURN | 2–3×30–40 |
| Bilateral KD / HD | MASTER_MODEL BASEBALL | 4 × '12/10/8/8' |
| Unilateral | MASTER_MODEL BASEBALL | 4 × 8/8–12/12 |
| Arms | MASTER_MODEL BASEBALL | 10/10–15/15 or 'max' |
| Squat (hypertrophy) | ALL ABOUT SQUATS | 3–5 × 8–15 @ 1 RIR (RPE 8+), rest 1–2 min |
| Squat (strength) | ALL ABOUT SQUATS | 4–8 × 2–5, rest 3–6 min |
| Squat (athletic) | ALL ABOUT SQUATS | off-season / French contrast, e.g. '3/3/3/3/3' at 78% into tuck jumps, goblet squats, reverse-banded squat jumps |

So the data matches the coach's statement that smaller muscles take more reps. Big-muscle compounds run 6–15. Isolation work, including **big-muscle isolation** (leg extensions and leg curls are programmed like small muscles), runs 15–20+, MYO SET, or max reps. The JSON gives `typical_rep_range_guess` (INFERRED from this evidence) plus `rep_dropdown_options_hint` using the exact AW labels.

**Weekly volume arithmetic (INFERRED from OBSERVED AESTHETICS values).** The knee-dominant day runs twice a week (Day 1, Day 3). Each run has Bilateral KD 3 + Unilateral KD 3 + Leg Extensions 2 = 8 direct quad sets, so about **16 quad sets per week**, inside the coach's "15–20 sets per muscle per week". Biceps get 2 × 2 = 4 direct sets, with indirect work from pulls. Calves get 3 × 2, plus 'Optional' calves.

`muscle_size_class` uses the brief's rule: quads/glutes/hamstrings are big; biceps/triceps/calves are small; thrusters are `mixed`. `exercise_class` (compound/isolation) is added because the coach doses by both size and class.

## 7. How the program templates consume these columns (OBSERVED in BYOP tabs 00–08)

**Slot labels (PURPOSE : CATEGORY):**

| Slot | Library column |
|---|---|
| 'Quads' : 'Bilateral KD' | AI |
| 'Quads/Glutes' : 'Unilateral KD' | AL |
| 'Quads' : 'Leg Extensions' | AM |
| 'Hamstring' : 'Bilateral HD' | AN |
| 'Hamstring/Glutes' : 'Unilateral HD' | AQ |
| 'Hamstrings' : 'Leg Curls' | AR |
| 'Bicep' : 'Bicep' | AS |
| 'Tricep' : (blank) | AT (PPL uses 'Push' and 'Overhead'; BOOTCAMP OPTION 2 uses 'Tricep') |
| 'Calves' : 'Calves' | AU |

The BASEBALL tab abbreviates the same buckets as 'bkd', 'bhd', 'ukd', 'uhd'.

**Day architecture (OBSERVED; the reason behind it is INFERRED).** Knee and hip dominant are split across days. Knee days pair with pulls and biceps; hip days pair with pushes and triceps. Lower and upper slots alternate, which allows supersets.

- **AESTHETICS (4-day):**
  - KD day: 'Calves' → 'Bilateral KD' → 'Horizontal Pull' → 'Unilateral KD' → 'Vertical Pull' → 'Bicep' → 'Leg Extensions'
  - HD day: 'Bilateral HD' → 'Horizontal Push' → 'Unilateral HD' → 'Vertical Push' → 'Leg Curls' → 'Tricep' → 'ABdution'
  - Optional day: Calves / Cardio / Core / Focus 1 / Focus 2
- **ATHLETIC / JUSTICE LEAGUE / NO ACCESS ATHLETIC:** the same lower/upper skeleton, preceded by athletic slots ('Plyo' ×2, 'Throwing', 'COD', 'Tripple Extension'). Calves move to the off day.
- **3 DAY BUILDER:**
  - Day 1: KD + pulls
  - Day 2: HD + pushes + leg curls
  - Day 3: 'Bilateral KD' + 'Bilateral HD' + 'Horizontal Pull' + 'Horizontal Push' + 'Unilateral KD'
- **PUSHPULLLEGS:** the legs day is 'Bilateral KD' → 'Bilateral HD' → 'Unilateral KD' → 'Leg Extensions' → 'Leg Curls' → 'Unilateral HD'.
- **BOOTCAMP OPTION 1** crosses the patterns: 'Bilateral KD' sits with 'Unilateral HD' (plus Bicep, Calves, Leg Extensions), and 'Bilateral HD' sits with 'Unilateral KD' (plus Leg Curls, Tricep, Abduction).

**Order within a day:** bilateral compound → unilateral compound → big-muscle isolation → small-muscle isolation. Calves are the one exception: they come **first** on aesthetics KD days.

**Bugs and quirks:**
- In both 'NO ACCESS' templates, the 'Unilateral HD' slot (E12/E33 in tab 07, E19/E46 in tab 08) points at `$AR$7:$AR$42` (LEG CURLS) instead of AQ.
- The NO ACCESS and BOOTCAMP templates prefill 'Leg extensions' (lower-case e), which is not an AM option. For clients without equipment, RESISTANCE PATTERNS offers 'banded leg extensions on bench' and 'DB leg extensions on box'.
- Google Sheets turned per-side rep notation like '12-12', '10-10' and '8-8' into dates such as 2022-12-12 in MASTER_MODEL programs. Read them as "12 each side".

## 8. Ordering logic inside columns (OBSERVED order; INFERRED rule)

- **Not strictly easy → hard.** The usual sequence is: the free-weight or primary variants of the pattern, then machines, then the big-muscle isolation entry (leg extension or leg curl). **Later additions are appended after that isolation entry.** Comparison with legacy Sheet23 confirms which entries are new:
  - 'Landmine Hack Squat ' (AI56)
  - the three thrusters (AI102–104)
  - 'KB swing' (AN20)
  - 'Hyper extensions ' (AN55)
  - 'Elevated Reverse Lunge' and 'Curtsy Lunges ' (AL20–21)
  - 'Overhead cable tricep extension' and 'Cable tricep push downs' (AT16–17)
  - the two 'use deficit' calf raises (AU9–10, which were prepended)
  - 'Box. Zercher…' and 'Box. Goblet…' (AI9–10, prepended)
- **AI FOUNDATIONAL:** box touch-and-go (Zercher, Goblet) → goblet → bodyweight → box → wall-assisted → low-DB → landmine → hex → flipped hex → sumo → leg extension.
- **AI MODERATE:** front → high zercher DB → high zercher barbell → high bar → low bar → double-KB front rack → hack machine → *(two blank rows where legacy Sheet23 had 'Leg Press')* → leg extension → landmine hack.
- **AI ADVANCED:** six box variants (T&G fast, banded, reverse banded; Deload, banded, reverse banded) → hack → leg press → pendulum → sissy → leg extension → thrusters.
- **AN FOUNDATIONAL:** bridges → reverse hyper → pull-through → KB deadlifts → leg-curl machine → sandbag hip thrust → hamstring curls (medball, slider, swiss ball) → KB swing.
- **AN MODERATE:** DB DL → hex DL → GHD → shoulder-width barbell DL → ball curls → hip-thrust machine → machine good morning → DB hip thrust → machine leg curls → hyperextensions.
- **AN ADVANCED:** Nordic → barbell DL → GHD → sumo → wide grip → snatch grip → barbell good morning → barbell hip thrust → stiff-leg DL → machine leg curls → DB hamstring curls.
- **AL** lists floor stances (stationary, reverse, forward, side) → single-leg squats (pistol, get-up) → elevated stances (FFE, RFE, against wall, FFE+RFE) → step-ups → newer additions.
- Each record carries `position_in_level_block` and `global_order_index`. The order looks like the coach's mental listing, not a ranking.

## 9. Typos, duplicates and inconsistencies (kept verbatim in `name_raw`)

**Typos:**
- 'BILATERAL HIP DOMNANT' (AN1)
- 'INTERMIDIATE' (AJ3, AO3)
- 'Harmstring' (AN17, AN50, AN101, AO13, AP19)
- 'Glidder' (AN18)
- 'Shoulder Wide Grip' should be 'Shoulder Width' (AN49)
- 'Ez' / 'Db' capitalisation
- missing ')' in 'Cable Machine Curls (Zone1, Zone 2, Zone 3'
- double spaces in 'Forward  Lunges' and 'Alternating  Barbell Deadlifts'
- trailing spaces on 14 names, e.g. 'Reverse Lunges ', 'Hack Squat Machine ', 'Hyper extensions '
- 'FILL HERE ' (AQ2)
- lower-case starts: 'swiss ball hamstring curls', 'Seated leg curls', 'Double front rack kb squat'

**Label inconsistencies:**
- 'Box. Squat Deload (banded)' drops 'Any', unlike its siblings.
- AM3 reads '-ADVANCED' (§3).
- AR3 is empty and AR5 says 'UNILATERAL' for machine leg curls, even though the same machine curl sits under BILATERAL HD.
- AS5, AT5 and AU5 are empty.
- AI6 is gold while AJ6–AM6 are red.

**Duplicates across levels:**
- 'GHD' at both MODERATE (AN48) and ADVANCED (AN93), with no variant named.
- Hack squat at MODERATE ('Hack Squat Machine ') and ADVANCED ('Hack Squats').
- Leg extension at every AI level; machine leg curls at every AN level.

**Near-duplicates inside one list:** 'Seated Db Bicep Curls' vs 'Seated DB Curls ', and 'Standing DB calf Raises (Use Deficit)' vs 'Calf Raises w/ DB '.

**Copies:**
- 'Copy of MASTER EXERCISE LIBRARY' (BYOP tab 10) holds AI..AU's main columns as N..V. Content and rows are **identical**; the mirrors and AV–BB are absent.
- 'Copy of Copy of MASTER EXERCISE' (tab 11) is the same content **compressed**: blank rows removed, row 2 dropped, rows shifted. T4 and U4 contain a stray 'RESISTANCE' in the laterality row, and the row-1 headers have red font.
- Each record's `copies` field gives the exact cell in each copy and in legacy Sheet23.

## 10. Evolution vs the legacy library (MASTER_MODEL 'Sheet23')

Sheet23 is the older library with one column per level (AC/AD/AE knee dominant, AF/AG/AH hip dominant, AM UL KD, AN UL HD, AO bicep, AP tricep, AR calves).

**Added since:**
- 'Box. Zercher squat Touch and Go', 'Box. Goblet squat Touch and Go'
- 'Landmine Hack Squat '
- the three thrusters
- 'KB swing', 'Hyper extensions '
- 'Elevated Reverse Lunge', 'Curtsy Lunges '
- 'Overhead cable tricep extension', 'Cable tricep push downs'
- both 'use deficit' calf raises
- the LEG EXTENSIONS and LEG CURLS columns

**Changed:**
- 'Box. Any Squat Touch and Go' became '…fast'.
- 'Leg Press' was removed from INTERMEDIATE and now only appears at ADVANCED.

**Dropped:** 'Unilateral/Bilateral DB Tricep Extension (Zone 3)' and 'Cable Machine Tricep Extensionw/ Rope (Zone 1 and Zone 3)'.

## 11. Related items elsewhere that are not in AI–AU (candidates for the generator)

All from MASTER_MODEL RESISTANCE PATTERNS unless noted.

| Area | Items |
|---|---|
| Knee dominant, bilateral sagittal | 'Plate reach forward squat', 'SSB bar Squats', 'Pinned Squats ', 'Overhead squats' |
| Knee dominant, bilateral frontal | 'Hip banded tube bands', 'Left or Right hip banded out ', 'Hold between knees Squats' |
| Knee dominant, bilateral transverse | 'Whats that strap rotating in/out' |
| Unilateral frontal | 'Cosak lateral lunges' |
| Leg extension without a machine | 'banded leg extensions on bench', 'DB leg extensions on box' |
| Hip dominant | 'Russian kb swing', 'American kb swing', 'Split stance contralateral KB swings' (UL transverse), 'Staggered stance hex bar dl' |
| Arms | 'DB Supinated curls', 'DB pronated curls', 'Barbell pronated curls', 'Rope Neutral tricep extensions', 'V grip tricep extentions', 'Face up tricep push away', 'bench tricep kickbacks (uni)', 'bent over Tricep kickbacks (bi)' |
| Programs (other tabs) | 'SL RDL' / 'Single Leg Deadlift', 'Walking Lunges', 'Jefferson Lunge', 'Bulgarian', 'SQUATS SMITH MACHINE', 'Heel raises', 'DB ankle hops' (BASEBALL calves slot) |

The AZ 'MUSCLE FOCUS OPTIONS' list also names a few that are missing here: 'Goblet squats heels elevated', 'Walking Lunges', 'Bulgarian Split squats', 'Foot on wall db DL'.

RESISTANCE PATTERNS splits knee and hip dominant into **BILATERAL / UNILATERAL × SAGITAL / FRONTAL / TRANSVERSE**. The library's AI–AU lists are almost entirely sagittal; only 'Side Lunges', 'Curtsy Lunges ' and the side step-up are not. The planned plane taxonomy is therefore mostly unfilled.

## 12. JSON field conventions

**Read directly from the sheet (OBSERVED):** `name_raw`, `cell`, `column_header_rows` (value + fill), `family` (row 4), `category` (row 1 verbatim; merged cells resolved), `zone_code` (row 3, tokenised), `column_purpose_row6`, `level.raw` / `label_cell`, `level_block_colour`, `program_slot.dropdown_source`, `mirror_of`, `copies`, `same_name_elsewhere_in_AI_AU`.

**From the header:** `laterality` comes from row 5 where present (`laterality_source` says which), otherwise it is inferred. `level.normalized` is observed for AI/AN/AJ/AK/AO/AP/AQ and inferred `any` elsewhere.

**INFERRED (listed in each record's `inferred_fields`):** `name_clean`, `sub_pattern`, `plane`, `secondary_muscles`, `equipment`, `no_equipment_ok`, `load_ceiling`, `skill_demand`, `impact_or_plyo_intensity`, `typical_rep_range_guess`, `difficulty_guess`.

**Extra fields:**
- `category_canonical`
- `exercise_class`
- `rep_dropdown_options_hint`
- `difficulty_guess` (my level estimate for unlevelled columns)
- `laterality_options` (where the label allows both, e.g. 'DB Kickbacks (Uni/Bi)')
- `load_laterality` (offset load)
- `ballistic`
- `squat_posture_scale`
- `coach_opinion` (verbatim from ALL ABOUT SQUATS: 'LEG PRESS' 'LOVE IT', 'HACK SQUAT' "I PERSONALLY DON'T LIKE IT", 'PENDULUM' 'LOVE IT' / 'FAVORITE', plus the band definitions)
- `cross_refs` (RESISTANCE PATTERNS cell, label, YouTube link and traffic-light colour)

**Equipment enum mapping:** hex/trap bar and EZ bar map to `barbell`; landmine, sliders, stability ball, sandbag and step/plate map to `other`; GHD and hyperextension benches map to `machine`.

## 13. Implications for the generator (INFERRED rules from the above)

1. A lower-body day takes **one dominance** (knee or hip). Fill it in this order: **Bilateral compound → Unilateral compound → Isolation**. Pair knee days with pulls and biceps, and hip days with pushes, triceps and abduction. Alternate lower and upper slots.
2. Pick bilateral compounds by the client's level from the AI/AN block (foundational / intermediate / advanced). Advanced clients can still draw lower-level items; the dropdown exposes all levels.
3. Unilateral and isolation slots are unlevelled. Progress them through **loading position** (contralateral → ipsilateral → front-racked → barbell racked) and through load/reps, not by swapping the exercise.
4. Dose by size and class:

   | Type | Reps |
   |---|---|
   | Bilateral compounds | 4–15 by goal (strength 2–6, hypertrophy 8–15) |
   | Unilateral | 8–12 per side |
   | Big-muscle isolation and small muscles | 15–20+, MYO SET or max reps |

   Weekly progression in his examples adds sets and lowers reps (2×12 → 3×10 → 4×8).
5. Equipment filter: use `no_equipment_ok` and `equipment`. Fix the NO ACCESS bug (UL HD must draw from AQ). Use the bodyweight leg-extension alternatives.
6. Treat AJ/AK/AO/AP as aliases. Collapse near-duplicates through `same_name_elsewhere_in_AI_AU` plus the near-duplicate list in §1.

## 14. Open questions for the coach

1. AM3 says 'RP-BS-KNEE DOMINANT -ADVANCED'. Are leg extensions really "advanced", or available at every level? (Leg extension is in all three AI blocks.)
2. AR5 says 'UNILATERAL' for 'Seated leg curls' / 'Lying Leg Curls'. Do you want leg curls single-leg, or is that a copy-paste? AR3 has no zone code; what should it be ('RP - LEG CURLS'?)
3. Are AJ/AK/AO/AP (per-level columns) still used, or can the generator rely only on the stacked AI/AN blocks?
4. 'GHD' appears at both MODERATE and ADVANCED. Which GHD movement belongs to each (hip/back extension vs glute-ham raise)?
5. What exactly is the 'Camporini Deadlift', and what do 'Alternating DB Deadlifts' / 'Alternating Barbell Deadlifts' alternate (lead leg? single arm?)
6. Why is the barbell staggered-stance DL 'FOUNDATIONAL'? Should UL HD get MODERATE/ADVANCED blocks like AN, or is level meant to come from loading (contra/ipsi/racked)?
7. Why is 'Leg press' only ADVANCED (it was INTERMEDIATE in Sheet23), when you call it low systemic fatigue and "LOVE IT"?
8. 'Box. Zercher squat Touch and Go' is FOUNDATIONAL, but Zercher is 'MODERATE' on your squat scale and yellow in RESISTANCE PATTERNS. Intentional because of the box?
9. What do Zone 1 / Zone 2 / Zone 3 mean for cable curls and tricep extensions (resistance-profile angles)? And what are the 'ZONE 1/2/3' row bands in Sheet23 column A?
10. What does the red header font in 'Copy of Copy of MASTER EXERCISE' mark (lower body plus athletic/core categories)?
11. Thrusters sit in Bilateral KD ADVANCED. Are they meant as strength exercises or conditioning? Should they count toward quad volume or shoulder volume too?
12. Calves come first on aesthetics KD days. Is that a priority/pre-fatigue rule to apply whenever calves are a focus?
13. Should big-muscle isolation (leg extension, leg curl) count fully toward the 15–20 weekly sets for quads/hamstrings, or as partial volume?
14. Should the frontal/transverse knee- and hip-dominant buckets from RESISTANCE PATTERNS ('Hold between knees Squats', 'Cosak lateral lunges', strap rotations) be added to the library, and are they intended for athletes (e.g. MMA, basketball)?
15. Several near-duplicates exist ('Seated Db Bicep Curls' / 'Seated DB Curls ', 'Standing DB calf Raises (Use Deficit)' / 'Calf Raises w/ DB ', three medball/swiss-ball curl entries). Merge them, or keep them as distinct cues?
