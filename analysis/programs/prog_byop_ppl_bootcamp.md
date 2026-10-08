# BYOP program decode: PUSHPULLLEGS, BOOTCAMP - OPTION 1, BOOTCAMP - OPTION 2

**Source:** workbook "BUILD YOUR OWN PROGRAM - BLAZE CAMP MODEL" (BYOP), tabs `'PUSHPULLLEGS - 3 or 6 DAYS A WK'`, `'BOOTCAMP - OPTION 1'` and `'BOOTCAMP - OPTION 2'`. Everything was read from `raw/BYOP.xlsx` with openpyxl: values, fills, merges, data validations, conditional formats, row heights and column widths. I cross-checked against `dumps/BYOP/02, 05, 06` and against the slot-wiring table in `analysis/library/L4_slot_wiring.md`. Dropdown contents come from `'MASTER EXERCISE LIBRARY'` (`dumps/BYOP/09_MASTER_EXERCISE_LIBRARY.columns.txt`).
**Cross-references** to the coach's filled examples are flagged as such. They come from BYOP `'AESTHETICS - FULL BODY - 4 DAYS'` and from MASTER_MODEL `'EXAMPLE PUSHPULLLEGS SPLIT'` and `'EXAMPLE FAT BURNBODY TONING PRO'`.
**Read-only:** no Google Sheet was opened for writing.
**Companion data:** `prog_byop_ppl_bootcamp.volume.json`, in the same folder.

Legend: **OBSERVED** = in the sheet. **INFERRED** = my interpretation. Coach labels are in 'single quotes', verbatim (typos kept: 'ABdution', 'DOMNANT', 'Back ' with a trailing space). My own canonical names use correct spelling.

---

## 0. Headline findings

1. **All three tabs are empty templates.** Only `WEEK 1` exists (Bootcamp 2 has no week label at all). Every EXERCISE, SETS, REPS and EFFORT cell holds the placeholder `'CHOOSE 👇'`. The one exception is BOOTCAMP 1 `E30` = `'Leg extensions'`. So the "program" is a **slot skeleton**: the order of movement categories per day, plus a dropdown wired to one library column per slot. Volume therefore has to be read as slot counts (OBSERVED) times an assumed number of sets.
2. **The coach programs by slot, not by exercise.** Each row = PURPOSE (the muscle the slot is credited to) + CATEGORY/DETAIL (the pattern) + a dropdown into exactly one library pattern column. The same skeleton is repeated within the week (PPL Mon-Wed = Thu-Sat; Bootcamp 1 Mon = Thu and Tue = Fri; Bootcamp 2 1A-3A = 1B-3B). The client therefore gets two picks per pattern per week from the same category list. *INFERRED:* this is the coach's exercise-variation mechanism.
3. **PPL = bodybuilding split, 7 slots per day.** Push: 4 pressing patterns + 'Flies' + 2 triceps. Pull: 2 'Horizontal Pull' + 1 'Vertical Pull' + 'ABdution' + 'Reverse Flies' + 2 'Bicep'. Legs: 'Bilateral KD' -> 'Bilateral HD' -> 'Unilateral KD' -> 'Leg Extensions' -> 'Leg Curls' -> 'Unilateral HD' -> 'Focus 1'. It has **no calves, no core, no cardio and no athletic slot**. Side-delt work sits on the **pull** day.
4. **Bootcamp 1 is the AESTHETICS 4-day template with the slots re-paired.** It uses the same 14 resistance slots. AESTHETICS groups knee-dominant work with pulls (Day 1) and hip-dominant work with pushes (Day 2). Bootcamp 1 swaps 'Unilateral KD' with 'Unilateral HD' and 'Vertical Pull' with 'Vertical Push'. As a result, **every day has 1 bilateral lower + 1 unilateral lower of the opposite dominance, and 1 push + 1 pull of the opposite plane** (A: 'Bilateral KD' + 'Unilateral HD' + 'Horizontal Pull' + 'Vertical Push'; B: 'Bilateral HD' + 'Unilateral KD' + 'Vertical Pull' + 'Horizontal Push'), ordered lower / upper / lower / upper.
5. **Bootcamp 2 cuts sessions to 5 slots and puts 'Cardio' in every session.** One A-cycle ('1A','2A','3A') contains all 8 primary patterns exactly once. 'Calves', 'Leg Extensions', 'Leg Curls' and the Focus slots are dropped, and the tab has **no SETS/REPS/EFFORT columns at all**. Arms are placed next to the *antagonist* pattern: 'Bicep' sits between the two presses on 2A, and 'Tricep' follows the vertical pull on 3A. PPL does the opposite and pairs arms with the synergist pattern.
6. **Volume per session (OBSERVED slots, ASSUMED sets).** PPL: 7 exercises, 21 sets at 3 sets per slot (17-18 with the coach's own 3-compound/2-isolation habit). Bootcamp 1: 7 exercises / 21 sets on main days, 5 slots / 12 sets on Wed/Sat. Bootcamp 2: 5 slots / 12 sets + 1 cardio bout.
7. **Weekly sets at 3 per slot.** PPL 6-day 126 (3-day 63). Bootcamp 1 is 84 on 4 days and 108 with Wed/Sat. Bootcamp 2 is 72 on 6 sessions.
   Per muscle, PPL 6-day gives chest 27, triceps 24, lats/biceps/glutes 21, quads/hams 18, but side delts only 9 and calves/abs 0. The 3-day version halves every number, which puts every big muscle at 9-13.5, below the coach's 15-20 band. *INFERRED:* the 6-day version is meant to run at about 2 sets per slot, and the 3-day at about 3-4.
8. **Both bootcamps are lower-body/glute heavy at the muscle level, even though slots are 50/50 upper/lower.** At 3 sets per slot: glutes 21, quads and hams 18 (Bootcamp 1) or 12 (Bootcamp 2), versus chest 9 and rear delts 3. Reaching 15 chest sets would take 5 sets per slot. The 4 Focus slots per week in Bootcamp 1 are the only top-up lever.
9. **Dosing vocabulary is identical everywhere (OBSERVED).**
   - SETS: 1-8, plus 'SUPERSET W/ 👇' as the only pairing tool.
   - REPS: '4 to 6 Reps', '6 to 8 Reps', '8 to 12 Reps', '10 to 15 Reps', '15 Reps', '20 Reps', 'MYO SET'.
   - Bootcamp 1 adds EFFORT 1-10 ('8 - That was perfect'), HOW IT FELT? ('Felt the RIGHT muscles', 'Felt the WRONG muscle', 'Felt a PAIN', "Couldn't do it"), a free-text 'WEIGHT USED or SCORE' cell that turns red when empty and green when filled, and a 'DONE?' checkbox per day.
   - No rest, tempo, %1RM or RIR appears in any of the three tabs.
10. **Progression is absent from all three tabs.** The coach's level and week rules have to come from his worked examples:
    - MASTER_MODEL PPL example: working sets per Push/Pull/Legs cycle go **47 -> 58 -> 66** (NOVICE -> NEWBY -> INTERMEDIATE, +23 % then +14 %). Compounds go 3x15 -> 3-4x10 -> 4x8. Isolation for arms and legs stays at **20 reps at every level**.
    - MASTER_MODEL fat-burn example (same skeleton as Bootcamp 1): weekly sets go **60 -> 60 -> 64 -> 70** (+0 %, +6.7 %, +9.4 %). Isolation reps rise 15 -> 20 -> 40.

---

## 0.1 Counting conventions (apply to every table below)

- **Slot** = one program row that has a data-validated EXERCISE cell (OBSERVED). Rows labelled 'OFF' are rest days.
- **Canonical bucket** comes from the library column the EXERCISE dropdown points at, refined by the DETAIL/CATEGORY label:
  - `AD` 'HORIZONTAL PUSH' -> RP_HPUSH. The 'Incline' and 'Dips' slots are variants of it. The 'Flies' slot -> ISO_CHEST, because the label asks for a fly even though the dropdown is the whole horizontal-push list.
  - `AA` -> RP_VPUSH, `X` -> RP_HPULL, `U` -> RP_VPULL, `AI` -> RP_BKD, `AN` -> RP_BHD, `AL` -> RP_UKD, `AQ` -> RP_UHD.
  - `AM` -> ISO_QUAD, `AR` -> ISO_HAM, `AS` -> ISO_BICEP, `AT` -> ISO_TRICEP, `AU` -> ISO_CALF.
  - `AH` 'SIDE RAISES' -> ISO_SIDE_REAR_DELT. The 'ABdution' slot counts as side delt; the 'Reverse Flies' slot counts as rear delt.
  - `O` -> CORE_OTHER. The 'Core' dropdown spans both the CORE THORAX and CORE PELVIS blocks, so CT vs CP is the client's choice and CT_CORE_THORAX / CP_CORE_PELVIS stay at 0.
  - `B` -> COND_AEROBIC. On the `B7:B335` rows the client can also pick '200m'-'1000m' or '10 cals'-'50 cals', which would be COND_SPRINT_BUYOUT.
  - `AZ` -> FOCUS.
- **Muscle credit (INFERRED analyst convention):** 1.0 per working set to each prime mover and 0.5 to clear synergists. Prime movers = the muscles named in the coach's PURPOSE label and in the library's row-6 PURPOSE cell (e.g. 'GLUTES/HAMSTRINGS', 'QUADS/GLUTES', 'CHEST/FRONT DELTS').

| Bucket | 1.0 | 0.5 | Why |
|---|---|---|---|
| RP_BKD ('Quads' / 'Bilateral KD') | quads | glutes | Library AI6 'QUADS' |
| RP_BHD ('Hamstring' / 'Bilateral HD') | hamstrings, glutes | - | Library AN6 'GLUTES/HAMSTRINGS' |
| RP_UKD ('Quads/Glutes' / 'Unilateral KD') | quads, glutes | - | Coach label + AL6 'QUADS/GLUTES' |
| RP_UHD ('Hamstring/Glutes' / 'Unilateral HD') | hamstrings, glutes | - | AQ6 'GLUTES/HAMSTRINGS' |
| RP_HPUSH (incl. 'Incline', 'Dips') | chest | front delts, triceps | AD6 'CHEST/FRONT DELTS' |
| RP_VPUSH ('Chest/Shoulders' / 'Vertical Push') | front delts | side delts, triceps, chest | AA6 'SHOULDERS/TRAPS'. The PURPOSE label also names Chest, and the list includes 'Incline Seated DB Press' |
| RP_HPULL | lats/upper back | biceps, rear delts | X6 'BACK' |
| RP_VPULL | lats/upper back | biceps | U6 'BACK' |
| ISO_QUAD / ISO_HAM / ISO_CHEST / ISO_BICEP / ISO_TRICEP / ISO_CALF | quads / hamstrings / chest / biceps / triceps / calves | - | single-joint |
| ISO_SIDE_REAR_DELT 'ABdution' | side delts | - | |
| ISO_SIDE_REAR_DELT 'Reverse Flies' | rear delts | lats/upper back | |
| CORE_OTHER | abs/obliques | - | |
| FOCUS, COND_AEROBIC | not credited | | Focus muscle is the client's pick |

- **Set scenarios.**
  - (a) **As written** = 0. Every SETS cell is 'CHOOSE 👇', or there is no SETS column.
  - (b) **Assumed uniform 3** = 3 working sets on every resistance, core and focus slot. A cardio slot counts as one bout and 0 sets.
  - (c) **Assumed coach-default** = RP_* 3 sets, ISO_CALF 3 sets, every other ISO, core and focus slot 2 sets. This is derived from the only filled BYOP cells, in 'AESTHETICS - FULL BODY - 4 DAYS': compounds and 'Machine Calf Raises' at 3 sets, 'Ez Bar Curls' and 'Leg Extensions' at 2 sets. The one-off 'DB Push press' at 5 sets is ignored.
- **Credits/wk (sets = 1 per slot)** = how many weighted slot-credits a muscle collects per week. Weekly sets = credits x sets per slot. The tables also show the sets per slot needed to hit the coach's **15-20 sets/muscle/week** band. The SETS dropdown tops out at 8.

---

## 1. 'PUSHPULLLEGS - 3 or 6 DAYS A WK'

### 1.1 Identity (OBSERVED unless marked)
- **Tab:** 'PUSHPULLLEGS - 3 or 6 DAYS A WK' (visible). **Title A1** (merged A1:G1, bg C9DAF8): **'PUSH/PULL/LEGS - 6 DAYS A WK'**. The title says 6 days; the tab name offers 3 or 6.
- **Columns:** A 'WEEK', B 'DAY', C 'PURPOSE', **D 'DETAIL'** (the only tab that says DETAIL instead of CATEGORY), E 'EXERCISE', F 'SETS', G 'REPS'. There is no EFFORT, HOW IT FELT?, WEIGHT or DONE? column.
- **Calendar:** one week ('WEEK 1', bg CFE2F3).
  - 'MONDAY' (bg EFEFEF), 'TUESDAY' (CCCCCC), 'WEDNESDAY' (FCE5CD), 'Thursday' (EFEFEF), 'Friday' (CCCCCC), 'Saturday' (FCE5CD), 'SUNDAY' = 'OFF' (F4CCCC, merged across C-G).
  - The colour marks the position in the 3-day rotation (light grey / mid grey / peach). Bootcamp 1 uses the same palette, so the colour does **not** mean "push" or "legs".
- **Days/week:** 6 as laid out (2 x Push/Pull/Legs). *INFERRED 3-day version:* run the Mon-Wed rows once per week, so every pattern is trained once a week.
- **Population/goal (INFERRED):** hypertrophy / physique ("aesthetics") client in a commercial gym. The evidence:
  - muscle-region DETAIL labels ('Incline', 'Flies', 'Dips', 'Overhead', 'Reverse Flies');
  - 2 biceps + 2 triceps slots;
  - no athletic, core or conditioning slot;
  - the MASTER_MODEL 'EXAMPLE PUSHPULLLEGS SPLIT' is the same kind of plan, written for 'NOVICE' / 'NEWBY' / 'INTERMEDIATE'.
- **Level(s):** the tab has no level selector. Level is expressed by which dropdown block the client picks:
  - `AD`, `AI`, `AN` have 'FOUNDATIONAL' / 'MODERATE' / 'ADVANCED' blocks;
  - `X`, `U`, `AA` have 'FOUNDATIONAL' / 'ADVANCED' / 'UNILATERAL';
  - `AQ` has 'FOUNDATIONAL' only;
  - `AL`, `AM`, `AR`, `AS`, `AT`, `AH` are unlevelled.
- **Equipment assumptions (INFERRED from the menus):**
  - Gym required: 'Leg Extensions' has exactly one option, 'Leg Extensions' (machine). 'Leg Curls' offers only 'Seated leg curls' and 'Lying Leg Curls' (machines).
  - The 'Flies' and 'Push' (tricep) slots work best with cables or machines.
  - Dips need a station.
- **Other formatting:** a conditional format turns cells green (57BB8A) when their text contains "TRUE". It covers B3:B9, B24:B30, C9:E12, C15:E17, C19:E20, C24:E33, C36:E38, C40:E41, F3:G16 and F24:G37. No cell contains TRUE and there is no checkbox column, so *INFERRED:* it is a leftover from a template that had a DONE checkbox. E8:E9 and E29:E30 lost their grey fill (cosmetic).

### 1.2 Session-by-session table (all 42 slots)

| Day | # | Section (verbatim) | PURPOSE / CATEGORY (verbatim) | Canonical bucket | Exercise (as written) | Sets | Reps | Effort | Notes (dropdown source; OBSERVED unless marked) |
|---|---|---|---|---|---|---|---|---|---|
| MONDAY | 1 | 'WEEK 1' / 'MONDAY' [Push - inferred] | 'Chest' / 'Horizontal Push' | RP_HPUSH | 'CHOOSE 👇' | 'CHOOSE 👇' (`AV7:AV42` 1-8 / 'SUPERSET W/ 👇') | 'CHOOSE 👇' (`AW` menu) | no column | `AD7:AD162` 'HORIZONTAL PUSH' - 25 selectable items (24 unique) |
| MONDAY | 2 | 'WEEK 1' / 'MONDAY' [Push - inferred] | 'Chest/Shoulders' / 'Vertical Push' | RP_VPUSH | 'CHOOSE 👇' | 'CHOOSE 👇' (`AV7:AV42` 1-8 / 'SUPERSET W/ 👇') | 'CHOOSE 👇' (`AW` menu) | no column | `AA7:AA122` 'VERTICAL PUSH' - 20 selectable items (19 unique) |
| MONDAY | 3 | 'WEEK 1' / 'MONDAY' [Push - inferred] | 'Chest' / 'Incline' | RP_HPUSH | 'CHOOSE 👇' | 'CHOOSE 👇' (`AV7:AV42` 1-8 / 'SUPERSET W/ 👇') | 'CHOOSE 👇' (`AW` menu) | no column | `AD7:AD162` 'HORIZONTAL PUSH' - 25 selectable items (24 unique); incline-press variant; label narrows (by convention only) to 'Incline Push-ups' (AD12/AD46), 'Incline DB Bench Press' (AD91), 'Alternating Incline DB Bench Press' (AD126) |
| MONDAY | 4 | 'WEEK 1' / 'MONDAY' [Push - inferred] | 'Chest' / 'Flies' | ISO_CHEST | 'CHOOSE 👇' | 'CHOOSE 👇' (`AV7:AV42` 1-8 / 'SUPERSET W/ 👇') | 'CHOOSE 👇' (`AW` menu) | no column | `AD7:AD162` 'HORIZONTAL PUSH' - 25 selectable items (24 unique); flies (wired to HORIZONTAL PUSH list; fly items sit in its MODERATE block); label narrows (by convention only) to 'Bench DB Flies ' (AD48), 'Cable flies' (AD49), 'Machine flies' (AD50) - the whole press list is still selectable |
| MONDAY | 5 | 'WEEK 1' / 'MONDAY' [Push - inferred] | 'Chest' / 'Dips' | RP_HPUSH | 'CHOOSE 👇' | 'CHOOSE 👇' (`AV7:AV42` 1-8 / 'SUPERSET W/ 👇') | 'CHOOSE 👇' (`AW` menu) | no column | `AD7:AD162` 'HORIZONTAL PUSH' - 25 selectable items (24 unique); dip variant; label narrows (by convention only) to 'Dips ' (AD96), 'Weighted Dips ' (AD97) |
| MONDAY | 6 | 'WEEK 1' / 'MONDAY' [Push - inferred] | 'Tricep' / 'Push' | ISO_TRICEP | 'CHOOSE 👇' | 'CHOOSE 👇' (`AV7:AV42` 1-8 / 'SUPERSET W/ 👇') | 'CHOOSE 👇' (`AW` menu) | no column | `AT7:AT42` 'TRICEP' - 9 selectable items; pushdown / extension; label narrows (by convention only) to pushdown/extension items: 'Straight bar pronated tricep extensions ', 'Straight Bar Supinated Tricep Extensions ', 'Cable tricep push downs' (+ possibly 'DB Kickbacks (Uni/Bi)') |
| MONDAY | 7 | 'WEEK 1' / 'MONDAY' [Push - inferred] | 'Tricep' / 'Overhead' | ISO_TRICEP | 'CHOOSE 👇' | 'CHOOSE 👇' (`AV7:AV42` 1-8 / 'SUPERSET W/ 👇') | 'CHOOSE 👇' (`AW` menu) | no column | `AT7:AT42` 'TRICEP' - 9 selectable items; overhead extension; label narrows (by convention only) to 'Overhead DB Tricep Extension', 'Overhead cable tricep extension' |
| TUESDAY | 1 | 'WEEK 1' / 'TUESDAY' [Pull - inferred] | 'Back' / 'Horizontal Pull' | RP_HPULL | 'CHOOSE 👇' | 'CHOOSE 👇' (`AV7:AV42` 1-8 / 'SUPERSET W/ 👇') | 'CHOOSE 👇' (`AW` menu) | no column | `X7:X162` 'HORIZONTAL PULL' - 16 selectable items |
| TUESDAY | 2 | 'WEEK 1' / 'TUESDAY' [Pull - inferred] | 'Back' / 'Horizontal Pull' | RP_HPULL | 'CHOOSE 👇' | 'CHOOSE 👇' (`AV7:AV42` 1-8 / 'SUPERSET W/ 👇') | 'CHOOSE 👇' (`AW` menu) | no column | `X7:X162` 'HORIZONTAL PULL' - 16 selectable items |
| TUESDAY | 3 | 'WEEK 1' / 'TUESDAY' [Pull - inferred] | 'Back ' / 'Vertical Pull' | RP_VPULL | 'CHOOSE 👇' | 'CHOOSE 👇' (`AV7:AV42` 1-8 / 'SUPERSET W/ 👇') | 'CHOOSE 👇' (`AW` menu) | no column | `U7:U122` 'VERTICAL PULL' - 20 selectable items |
| TUESDAY | 4 | 'WEEK 1' / 'TUESDAY' [Pull - inferred] | 'Shoulders/Traps' / 'ABdution' | ISO_SIDE_REAR_DELT/side | 'CHOOSE 👇' | 'CHOOSE 👇' (`AV7:AV42` 1-8 / 'SUPERSET W/ 👇') | 'CHOOSE 👇' (`AW` menu) | no column | `AH7:AH42` 'SIDE RAISES' - 12 selectable items; side-delt (abduction / lateral raise); 6 of 12 items are side raises; 3 are front raises; 3 are reverse flies - the label asks for a side raise |
| TUESDAY | 5 | 'WEEK 1' / 'TUESDAY' [Pull - inferred] | 'Shoulders/Traps' / 'Reverse Flies' | ISO_SIDE_REAR_DELT/rear | 'CHOOSE 👇' | 'CHOOSE 👇' (`AV7:AV42` 1-8 / 'SUPERSET W/ 👇') | 'CHOOSE 👇' (`AW` menu) | no column | `AH7:AH42` 'SIDE RAISES' - 12 selectable items; rear-delt (reverse fly); label narrows (by convention only) to 'Bent over DB Reverse flies', 'Seated DB Reverse Flies', 'Machine reverse fliez' |
| TUESDAY | 6 | 'WEEK 1' / 'TUESDAY' [Pull - inferred] | 'Bicep' / 'Bicep' | ISO_BICEP | 'CHOOSE 👇' | 'CHOOSE 👇' (`AV7:AV42` 1-8 / 'SUPERSET W/ 👇') | 'CHOOSE 👇' (`AW` menu) | no column | `AS7:AS42` 'BICEP' - 14 selectable items |
| TUESDAY | 7 | 'WEEK 1' / 'TUESDAY' [Pull - inferred] | 'Bicep' / 'Bicep' | ISO_BICEP | 'CHOOSE 👇' | 'CHOOSE 👇' (`AV7:AV42` 1-8 / 'SUPERSET W/ 👇') | 'CHOOSE 👇' (`AW` menu) | no column | `AS7:AS42` 'BICEP' - 14 selectable items |
| WEDNESDAY | 1 | 'WEEK 1' / 'WEDNESDAY' [Legs - inferred] | 'Quads' / 'Bilateral KD' | RP_BKD | 'CHOOSE 👇' | 'CHOOSE 👇' (`AV7:AV42` 1-8 / 'SUPERSET W/ 👇') | 'CHOOSE 👇' (`AW` menu) | no column | `AI7:AI122` 'BILATERAL KNEE DOMINANT' - 35 selectable items (33 unique) |
| WEDNESDAY | 2 | 'WEEK 1' / 'WEDNESDAY' [Legs - inferred] | 'Hamstring' / 'Bilateral HD' | RP_BHD | 'CHOOSE 👇' | 'CHOOSE 👇' (`AV7:AV42` 1-8 / 'SUPERSET W/ 👇') | 'CHOOSE 👇' (`AW` menu) | no column | `AN7:AN122` 'BILATERAL HIP DOMNANT' - 33 selectable items (32 unique) |
| WEDNESDAY | 3 | 'WEEK 1' / 'WEDNESDAY' [Legs - inferred] | 'Quads/Glutes' / 'Unilateral KD' | RP_UKD | 'CHOOSE 👇' | 'CHOOSE 👇' (`AV7:AV42` 1-8 / 'SUPERSET W/ 👇') | 'CHOOSE 👇' (`AW` menu) | no column | `AL7:AL42` 'UNILATERAL KNEE DOMINANT' - 13 selectable items |
| WEDNESDAY | 4 | 'WEEK 1' / 'WEDNESDAY' [Legs - inferred] | 'Quads' / 'Leg Extensions' | ISO_QUAD | 'CHOOSE 👇' | 'CHOOSE 👇' (`AV7:AV42` 1-8 / 'SUPERSET W/ 👇') | 'CHOOSE 👇' (`AW` menu) | no column | `AM7:AM9` 'LEG EXTENSIONS' - 1 selectable items; single-item list |
| WEDNESDAY | 5 | 'WEEK 1' / 'WEDNESDAY' [Legs - inferred] | 'Hamstrings' / 'Leg Curls' | ISO_HAM | 'CHOOSE 👇' | 'CHOOSE 👇' (`AV7:AV42` 1-8 / 'SUPERSET W/ 👇') | 'CHOOSE 👇' (`AW` menu) | no column | `AR7:AR10` 'LEG CURLS' - 2 selectable items |
| WEDNESDAY | 6 | 'WEEK 1' / 'WEDNESDAY' [Legs - inferred] | 'Hamstring/Glutes' / 'Unilateral HD' | RP_UHD | 'CHOOSE 👇' | 'CHOOSE 👇' (`AV7:AV42` 1-8 / 'SUPERSET W/ 👇') | 'CHOOSE 👇' (`AW` menu) | no column | `AQ7:AQ42` 'UNILATERAL HIP DOMINANT' - 8 selectable items |
| WEDNESDAY | 7 | 'WEEK 1' / 'WEDNESDAY' [Legs - inferred] | 'Focus 1' / (blank) | FOCUS | 'CHOOSE 👇' | 'CHOOSE 👇' (`AV7:AV42` 1-8 / 'SUPERSET W/ 👇') | 'CHOOSE 👇' (`AW` menu) | no column | `AZ7:AZ335` 'FULL FOCUS LIST' - 51 selectable items (49 unique); menu grouped by muscle (QUADS, SHOULDERS/TRAPS, BACK, TRICEP, GLUTES, HAMSTRINGS, CHEST, CORE, BICEP, CALVES) |
| Thursday | 1 | 'WEEK 1' / 'Thursday' [Push - inferred] | 'Chest' / 'Horizontal Push' | RP_HPUSH | 'CHOOSE 👇' | 'CHOOSE 👇' (`AV7:AV42` 1-8 / 'SUPERSET W/ 👇') | 'CHOOSE 👇' (`AW` menu) | no column | `AD7:AD162` 'HORIZONTAL PUSH' - 25 selectable items (24 unique) |
| Thursday | 2 | 'WEEK 1' / 'Thursday' [Push - inferred] | 'Chest/Shoulders' / 'Vertical Push' | RP_VPUSH | 'CHOOSE 👇' | 'CHOOSE 👇' (`AV7:AV42` 1-8 / 'SUPERSET W/ 👇') | 'CHOOSE 👇' (`AW` menu) | no column | `AA7:AA122` 'VERTICAL PUSH' - 20 selectable items (19 unique) |
| Thursday | 3 | 'WEEK 1' / 'Thursday' [Push - inferred] | 'Chest' / 'Incline' | RP_HPUSH | 'CHOOSE 👇' | 'CHOOSE 👇' (`AV7:AV42` 1-8 / 'SUPERSET W/ 👇') | 'CHOOSE 👇' (`AW` menu) | no column | `AD7:AD162` 'HORIZONTAL PUSH' - 25 selectable items (24 unique); incline-press variant; label narrows (by convention only) to 'Incline Push-ups' (AD12/AD46), 'Incline DB Bench Press' (AD91), 'Alternating Incline DB Bench Press' (AD126) |
| Thursday | 4 | 'WEEK 1' / 'Thursday' [Push - inferred] | 'Chest' / 'Flies' | ISO_CHEST | 'CHOOSE 👇' | 'CHOOSE 👇' (`AV7:AV42` 1-8 / 'SUPERSET W/ 👇') | 'CHOOSE 👇' (`AW` menu) | no column | `AD7:AD162` 'HORIZONTAL PUSH' - 25 selectable items (24 unique); flies (wired to HORIZONTAL PUSH list; fly items sit in its MODERATE block); label narrows (by convention only) to 'Bench DB Flies ' (AD48), 'Cable flies' (AD49), 'Machine flies' (AD50) - the whole press list is still selectable |
| Thursday | 5 | 'WEEK 1' / 'Thursday' [Push - inferred] | 'Chest' / 'Dips' | RP_HPUSH | 'CHOOSE 👇' | 'CHOOSE 👇' (`AV7:AV42` 1-8 / 'SUPERSET W/ 👇') | 'CHOOSE 👇' (`AW` menu) | no column | `AD7:AD162` 'HORIZONTAL PUSH' - 25 selectable items (24 unique); dip variant; label narrows (by convention only) to 'Dips ' (AD96), 'Weighted Dips ' (AD97) |
| Thursday | 6 | 'WEEK 1' / 'Thursday' [Push - inferred] | 'Tricep' / 'Push' | ISO_TRICEP | 'CHOOSE 👇' | 'CHOOSE 👇' (`AV7:AV42` 1-8 / 'SUPERSET W/ 👇') | 'CHOOSE 👇' (`AW` menu) | no column | `AT7:AT42` 'TRICEP' - 9 selectable items; pushdown / extension; label narrows (by convention only) to pushdown/extension items: 'Straight bar pronated tricep extensions ', 'Straight Bar Supinated Tricep Extensions ', 'Cable tricep push downs' (+ possibly 'DB Kickbacks (Uni/Bi)') |
| Thursday | 7 | 'WEEK 1' / 'Thursday' [Push - inferred] | 'Tricep' / 'Overhead' | ISO_TRICEP | 'CHOOSE 👇' | 'CHOOSE 👇' (`AV7:AV42` 1-8 / 'SUPERSET W/ 👇') | 'CHOOSE 👇' (`AW` menu) | no column | `AT7:AT42` 'TRICEP' - 9 selectable items; overhead extension; label narrows (by convention only) to 'Overhead DB Tricep Extension', 'Overhead cable tricep extension' |
| Friday | 1 | 'WEEK 1' / 'Friday' [Pull - inferred] | 'Back' / 'Horizontal Pull' | RP_HPULL | 'CHOOSE 👇' | 'CHOOSE 👇' (`AV7:AV42` 1-8 / 'SUPERSET W/ 👇') | 'CHOOSE 👇' (`AW` menu) | no column | `X7:X162` 'HORIZONTAL PULL' - 16 selectable items |
| Friday | 2 | 'WEEK 1' / 'Friday' [Pull - inferred] | 'Back' / 'Horizontal Pull' | RP_HPULL | 'CHOOSE 👇' | 'CHOOSE 👇' (`AV7:AV42` 1-8 / 'SUPERSET W/ 👇') | 'CHOOSE 👇' (`AW` menu) | no column | `X7:X162` 'HORIZONTAL PULL' - 16 selectable items |
| Friday | 3 | 'WEEK 1' / 'Friday' [Pull - inferred] | 'Back ' / 'Vertical Pull' | RP_VPULL | 'CHOOSE 👇' | 'CHOOSE 👇' (`AV7:AV42` 1-8 / 'SUPERSET W/ 👇') | 'CHOOSE 👇' (`AW` menu) | no column | `U7:U122` 'VERTICAL PULL' - 20 selectable items |
| Friday | 4 | 'WEEK 1' / 'Friday' [Pull - inferred] | 'Shoulders/Traps' / 'ABdution' | ISO_SIDE_REAR_DELT/side | 'CHOOSE 👇' | 'CHOOSE 👇' (`AV7:AV42` 1-8 / 'SUPERSET W/ 👇') | 'CHOOSE 👇' (`AW` menu) | no column | `AH7:AH42` 'SIDE RAISES' - 12 selectable items; side-delt (abduction / lateral raise); 6 of 12 items are side raises; 3 are front raises; 3 are reverse flies - the label asks for a side raise |
| Friday | 5 | 'WEEK 1' / 'Friday' [Pull - inferred] | 'Shoulders/Traps' / 'Reverse Flies' | ISO_SIDE_REAR_DELT/rear | 'CHOOSE 👇' | 'CHOOSE 👇' (`AV7:AV42` 1-8 / 'SUPERSET W/ 👇') | 'CHOOSE 👇' (`AW` menu) | no column | `AH7:AH42` 'SIDE RAISES' - 12 selectable items; rear-delt (reverse fly); label narrows (by convention only) to 'Bent over DB Reverse flies', 'Seated DB Reverse Flies', 'Machine reverse fliez' |
| Friday | 6 | 'WEEK 1' / 'Friday' [Pull - inferred] | 'Bicep' / 'Bicep' | ISO_BICEP | 'CHOOSE 👇' | 'CHOOSE 👇' (`AV7:AV42` 1-8 / 'SUPERSET W/ 👇') | 'CHOOSE 👇' (`AW` menu) | no column | `AS7:AS42` 'BICEP' - 14 selectable items |
| Friday | 7 | 'WEEK 1' / 'Friday' [Pull - inferred] | 'Bicep' / 'Bicep' | ISO_BICEP | 'CHOOSE 👇' | 'CHOOSE 👇' (`AV7:AV42` 1-8 / 'SUPERSET W/ 👇') | 'CHOOSE 👇' (`AW` menu) | no column | `AS7:AS42` 'BICEP' - 14 selectable items |
| Saturday | 1 | 'WEEK 1' / 'Saturday' [Legs - inferred] | 'Quads' / 'Bilateral KD' | RP_BKD | 'CHOOSE 👇' | 'CHOOSE 👇' (`AV7:AV42` 1-8 / 'SUPERSET W/ 👇') | 'CHOOSE 👇' (`AW` menu) | no column | `AI7:AI122` 'BILATERAL KNEE DOMINANT' - 35 selectable items (33 unique) |
| Saturday | 2 | 'WEEK 1' / 'Saturday' [Legs - inferred] | 'Hamstring' / 'Bilateral HD' | RP_BHD | 'CHOOSE 👇' | 'CHOOSE 👇' (`AV7:AV42` 1-8 / 'SUPERSET W/ 👇') | 'CHOOSE 👇' (`AW` menu) | no column | `AN7:AN122` 'BILATERAL HIP DOMNANT' - 33 selectable items (32 unique) |
| Saturday | 3 | 'WEEK 1' / 'Saturday' [Legs - inferred] | 'Quads/Glutes' / 'Unilateral KD' | RP_UKD | 'CHOOSE 👇' | 'CHOOSE 👇' (`AV7:AV42` 1-8 / 'SUPERSET W/ 👇') | 'CHOOSE 👇' (`AW` menu) | no column | `AL7:AL42` 'UNILATERAL KNEE DOMINANT' - 13 selectable items |
| Saturday | 4 | 'WEEK 1' / 'Saturday' [Legs - inferred] | 'Quads' / 'Leg Extensions' | ISO_QUAD | 'CHOOSE 👇' | 'CHOOSE 👇' (`AV7:AV42` 1-8 / 'SUPERSET W/ 👇') | 'CHOOSE 👇' (`AW` menu) | no column | `AM7:AM9` 'LEG EXTENSIONS' - 1 selectable items; single-item list |
| Saturday | 5 | 'WEEK 1' / 'Saturday' [Legs - inferred] | 'Hamstrings' / 'Leg Curls' | ISO_HAM | 'CHOOSE 👇' | 'CHOOSE 👇' (`AV7:AV42` 1-8 / 'SUPERSET W/ 👇') | 'CHOOSE 👇' (`AW` menu) | no column | `AR7:AR10` 'LEG CURLS' - 2 selectable items |
| Saturday | 6 | 'WEEK 1' / 'Saturday' [Legs - inferred] | 'Hamstring/Glutes' / 'Unilateral HD' | RP_UHD | 'CHOOSE 👇' | 'CHOOSE 👇' (`AV7:AV42` 1-8 / 'SUPERSET W/ 👇') | 'CHOOSE 👇' (`AW` menu) | no column | `AQ7:AQ42` 'UNILATERAL HIP DOMINANT' - 8 selectable items |
| Saturday | 7 | 'WEEK 1' / 'Saturday' [Legs - inferred] | 'Focus 1' / (blank) | FOCUS | 'CHOOSE 👇' | 'CHOOSE 👇' (`AV7:AV42` 1-8 / 'SUPERSET W/ 👇') | 'CHOOSE 👇' (`AW` menu) | no column | `AZ7:AZ335` 'FULL FOCUS LIST' - 51 selectable items (49 unique); menu grouped by muscle (QUADS, SHOULDERS/TRAPS, BACK, TRICEP, GLUTES, HAMSTRINGS, CHEST, CORE, BICEP, CALVES) |

### 1.3 Rules visible in the layout
1. **Fixed session size: 7 slots per day**, every day (OBSERVED).
2. **Push day order:** 'Horizontal Push' -> 'Vertical Push' -> 'Incline' -> 'Flies' -> 'Dips' -> tricep 'Push' -> tricep 'Overhead'.
   - Four multi-joint pressing slots come first. The plane mix is 3 horizontal-ish ('Horizontal Push', 'Incline', 'Dips', all wired to 'HORIZONTAL PUSH') to 1 vertical.
   - The single-joint chest slot ('Flies') is 4th and is **followed by** 'Dips'. That is the only place in the three tabs where a compound follows an isolation for the same muscle. *INFERRED:* dips act as a bodyweight finisher, or the fly works as a pre-exhaust.
   - Triceps come last, split by arm position: 'Push' (arm at side) and 'Overhead' (shoulder flexed, which biases the long head). *INFERRED* biomechanical intent.
3. **Pull day order:** 'Horizontal Pull' x2 -> 'Vertical Pull' -> 'ABdution' -> 'Reverse Flies' -> 'Bicep' x2. Rows outnumber vertical pulls 2:1.
   - Shoulder isolation (PURPOSE 'Shoulders/Traps') sits on the **pull** day. The coach's MASTER_MODEL PPL example instead puts 'Side raises' on the push day and 'DB Reverse Flies' / 'DB upright rows' on the pull day.
4. **Legs day order:** 'Bilateral KD' -> 'Bilateral HD' -> 'Unilateral KD' -> 'Leg Extensions' -> 'Leg Curls' -> 'Unilateral HD' -> 'Focus 1'.
   - Bilateral patterns come before unilateral ones, and knee-dominant before hip-dominant within each tier.
   - The isolation pair sits between the two unilateral patterns. *INFERRED:* this makes a "quad block" (UKD + leg ext) followed by a "hamstring block" (leg curl + UHD).
   - The legs day is the only day with a Focus slot.
5. **Arms go with synergists:** triceps on the push day, biceps on the pull day.
6. **Pairing/supersets:** none prescribed. Any SETS cell can be set to 'SUPERSET W/ 👇' (AV16) to pair a row with the row below.
7. **Athletic work:** none. **Isolation:** always after that muscle's compounds, except 'Unilateral HD' coming after 'Leg Curls'.
8. **Absent buckets:** no calf, core, cardio, carry or functional slot. *INFERRED:* the client is expected to put calves or core into 'Focus 1' (the AZ list has 'CALVES 👇' and 'CORE 👇' blocks), or to add the coach's suggested steady cardio. The MASTER_MODEL PPL instructions say: "Do steady cardio whenever you want ... WEDNESDAYS & SATURDAYS max 40 min of steady".
9. **Week structure:** Thu-Sat are verbatim copies of Mon-Wed (same labels, same dropdown ranges). This gives twice-weekly frequency with a free choice of a different exercise the second time.

### 1.4 Quantitative volume

Sessions (6-day version):

| Session | Exercises (slots) | Resistance/core/focus slots | Cardio slots | Sets as written | Sets @3 (assumed) | Sets coach-default (assumed) |
|---|---|---|---|---|---|---|
| MONDAY | 7 | 7 | 0 | 0 (all 'CHOOSE 👇' or no column) | 21 | 18 |
| TUESDAY | 7 | 7 | 0 | 0 (all 'CHOOSE 👇' or no column) | 21 | 17 |
| WEDNESDAY | 7 | 7 | 0 | 0 (all 'CHOOSE 👇' or no column) | 21 | 18 |
| Thursday | 7 | 7 | 0 | 0 (all 'CHOOSE 👇' or no column) | 21 | 18 |
| Friday | 7 | 7 | 0 | 0 (all 'CHOOSE 👇' or no column) | 21 | 17 |
| Saturday | 7 | 7 | 0 | 0 (all 'CHOOSE 👇' or no column) | 21 | 18 |

Weekly slots and sets by canonical bucket:

| Bucket | 6_day_as_titled slots/wk (OBSERVED) | 3_day_variant_MonTueWed slots/wk (OBSERVED) | 6_day_as_titled sets/wk @3 (assumed) | 3_day_variant_MonTueWed sets/wk @3 (assumed) | 6_day_as_titled sets/wk coach-default (assumed) | 3_day_variant_MonTueWed sets/wk coach-default (assumed) |
|---|---|---|---|---|---|---|
| RP_BKD | 2 | 1 | 6 | 3 | 6 | 3 |
| RP_BHD | 2 | 1 | 6 | 3 | 6 | 3 |
| RP_UKD | 2 | 1 | 6 | 3 | 6 | 3 |
| RP_UHD | 2 | 1 | 6 | 3 | 6 | 3 |
| RP_HPUSH | 6 | 3 | 18 | 9 | 18 | 9 |
| RP_VPUSH | 2 | 1 | 6 | 3 | 6 | 3 |
| RP_HPULL | 4 | 2 | 12 | 6 | 12 | 6 |
| RP_VPULL | 2 | 1 | 6 | 3 | 6 | 3 |
| ISO_QUAD | 2 | 1 | 6 | 3 | 4 | 2 |
| ISO_HAM | 2 | 1 | 6 | 3 | 4 | 2 |
| ISO_CHEST | 2 | 1 | 6 | 3 | 4 | 2 |
| ISO_SIDE_REAR_DELT | 4 | 2 | 12 | 6 | 8 | 4 |
| ISO_BICEP | 4 | 2 | 12 | 6 | 8 | 4 |
| ISO_TRICEP | 4 | 2 | 12 | 6 | 8 | 4 |
| FOCUS | 2 | 1 | 6 | 3 | 4 | 2 |
| **TOTAL** | 42 | 21 | 126 | 63 | 106 | 53 |

Buckets with **0** slots in every variant: AP_PLYO, AP_JUMP_LIMITED_KNEE, AP_THROW, AP_COD, AP_SPRINT, AP_TRIPLE_EXT, ISO_CALF, CT_CORE_THORAX, CP_CORE_PELVIS, CORE_OTHER, COND_AEROBIC, COND_SPRINT_BUYOUT, FUNCTIONAL.

Weekly sets by muscle:

| Muscle | 6_day_as_titled credits/wk (sets=1 per slot) | 3_day_variant_MonTueWed credits/wk (sets=1 per slot) | 6_day_as_titled @3 sets (assumed) | 3_day_variant_MonTueWed @3 sets (assumed) | 6_day_as_titled coach-default (assumed) | 3_day_variant_MonTueWed coach-default (assumed) | 6_day_as_titled: sets/slot to reach 15 / 20 | 3_day_variant_MonTueWed: sets/slot to reach 15 / 20 |
|---|---|---|---|---|---|---|---|---|
| quads | 6 | 3 | 18 | 9 | 16 | 8 | 2.5 / 3.3 | 5.0 / 6.7 |
| glutes | 7 | 3.5 | 21 | 10.5 | 21 | 10.5 | 2.1 / 2.9 | 4.3 / 5.7 |
| hamstrings | 6 | 3 | 18 | 9 | 16 | 8 | 2.5 / 3.3 | 5.0 / 6.7 |
| chest | 9 | 4.5 | 27 | 13.5 | 25 | 12.5 | 1.7 / 2.2 | 3.3 / 4.4 |
| lats/upper back | 7 | 3.5 | 21 | 10.5 | 20 | 10 | 2.1 / 2.9 | 4.3 / 5.7 |
| front delts | 5 | 2.5 | 15 | 7.5 | 15 | 7.5 | 3.0 / 4.0 | 6.0 / 8.0 |
| side delts | 3 | 1.5 | 9 | 4.5 | 7 | 3.5 | 5.0 / 6.7 | 10.0 / 13.3 (exceeds 8-set dropdown max) |
| rear delts | 4 | 2 | 12 | 6 | 10 | 5 | 3.8 / 5.0 | 7.5 / 10.0 |
| biceps | 7 | 3.5 | 21 | 10.5 | 17 | 8.5 | 2.1 / 2.9 | 4.3 / 5.7 |
| triceps | 8 | 4 | 24 | 12 | 20 | 10 | 1.9 / 2.5 | 3.8 / 5.0 |
| calves | 0 | 0 | 0 | 0 | 0 | 0 | no slot | no slot |
| abs/obliques | 0 | 0 | 0 | 0 | 0 | 0 | no slot | no slot |

Reading the numbers:
- **Exercises per session:** 7 (OBSERVED). **Per week:** 42 (6-day) or 21 (3-day).
- **Sets per session:** 21 at 3 per slot, 17-18 coach-default.
  - The coach's own filled sessions run 19 sets (AESTHETICS Day 1: 7 exercises) and 15-24 sets (MASTER_MODEL PPL, NOVICE push 15 to INTERMEDIATE legs 24).
  - *INFERRED:* the template's ceiling is about 7 exercises and about 20 working sets per session.
- **Balance (OBSERVED slot counts per Push/Pull/Legs cycle):**
  - upper 14 : lower 6 (+1 Focus);
  - multi-joint (RP) 11 : isolation 9;
  - pressing RP 4 : pulling RP 3, but the pull day also carries both delt raises;
  - horizontal : vertical = 3:1 on push and 2:1 on pull.
- **Against the 15-20 sets/muscle/week rule:**
  - The 6-day version at 3 sets per slot **overshoots** chest (27), triceps (24) and biceps / lats / glutes (21), and **undershoots** side delts (9). Calves and abs get 0.
  - The 3-day version at 3 sets per slot leaves every big muscle at 9-13.5 (below the band). Side delts would need 10-13 sets per slot, which is over the dropdown's 8-set maximum.
  - *INFERRED:* run the 6-day version at about 2 sets per slot (chest 18, quads 12, side delts 6) or with the 3-compound/2-isolation habit. Run the 3-day version at 3-4 sets per slot and use Focus for delts and calves.

### 1.5 Reps, intensity, rest, tempo
- **As written:** every REPS cell is 'CHOOSE 👇'. The menu (`AW7:AW42`) offers '4 to 6 Reps', '6 to 8 Reps', '8 to 12 Reps', '10 to 15 Reps', '15 Reps', '20 Reps', 'MYO SET'. Nothing above 20 and no time or per-side notation.
- **Intensity:** no column. **Rest:** none. **Tempo:** none (OBSERVED).
- **Coach's own PPL dosing (cross-reference, MASTER_MODEL 'EXAMPLE PUSHPULLLEGS SPLIT', OBSERVED there):**
  - Compounds: NOVICE 3x15 (legs 2x8), NEWBY 3-4x10, INTERMEDIATE 4x8. Lat pulldown/pull-ups are 5x12 at INTERMEDIATE; dips are 3x8 -> 3x10 -> 4x'MAX'.
  - Small-muscle isolation (curls, overhead tricep extension, leg extensions, leg curls): **20 reps at every level**, 2-3 sets. Calves: 'MAX REPS'.
  - Delt isolation is *not* kept high-rep: side raises 3x15 -> 4x8 -> 4x8.
  - Instructions: "*Always leave 1 rep in the tank, never work up to failure but get as close as you can" and "***The lower the reps, the higher the weight... Always go for 1-3 RIR (REPS IN RESERVE) aka RPE 7+". Joint pain -> move from fixed grips to split grips (dumbbells, kettlebells).
  - Warm-up: 5 min cardio + 'KB Book openers' (push/pull days), and 'A March' / 'A Skip' / 'A Run' drills on legs day.
- Big vs small muscles: in the coach's examples, big-muscle compounds sit at 8-15 reps and drift down with level, while arm and leg isolation stays fixed at 20. This matches his statement that smaller muscles take more reps.

### 1.6 Progression
- **Week-to-week:** none written. There is a single 'WEEK 1', and the template has no columns for later weeks.
- **Level-to-level:** none in the tab. From the MASTER_MODEL PPL example (cross-reference): working sets per cycle **47 (NOVICE) -> 58 (NEWBY, +23.4 %) -> 66 (INTERMEDIATE, +13.8 %)**, +40 % overall.
  - Push 15 -> 17 -> 19, pull 18 -> 20 -> 23, legs 14 -> 21 -> 24.
  - Legs-day A-drills: 6 -> 9 -> 8 sets.
  - Reps on compounds fall 15 -> 10 -> 8 as sets rise. Exercise count and order stay the same.
- **Mapping to this template (INFERRED):** a generator should keep the 7-slot skeleton and the order fixed, and progress through (1) dropdown level blocks, (2) sets per slot (2 -> 3 -> 4), and (3) rep bracket ('15 Reps' -> '8 to 12 Reps' -> '6 to 8 Reps') on RP slots only. ISO slots stay at '20 Reps'.

### 1.7 What this reveals about the coach's thinking (INFERRED)
- Even a classic bodybuilding split is **built on his pattern library**. Every chest slot, including 'Incline', 'Dips' and 'Flies', draws from 'HORIZONTAL PUSH', and the DETAIL label narrows the choice. He thinks pattern-first, muscle-region second.
- **Big muscles get several patterns; small muscles get dedicated isolation slots.** Chest gets 4 press variants + 1 fly. Back gets 3 pulls in 2 planes. Legs get 4 compound patterns in a bilateral/unilateral x knee/hip grid. Biceps, triceps and delts get 2 isolation slots each.
- He biases the **horizontal plane** on both push and pull (rows 2:1). A shoulder-health or posture bias is plausible.
- A Focus slot appears only on legs day. *INFERRED:* it covers what the split leaves out (calves, glutes, core), or adds volume to a lagging muscle.
- 7 slots x ~3 sets is his practical ceiling for a hypertrophy session.

---

## 2. 'BOOTCAMP - OPTION 1'

### 2.1 Identity (OBSERVED unless marked)
- **Tab:** 'BOOTCAMP - OPTION 1'. **Title A1** (merged A1:K1, row height 91.5): **'BOOTCAMP - FULL BODY - 4 DAYS A WEEK'**.
- **Columns:** A 'WEEK', B 'DAY', C 'PURPOSE', D 'CATEGORY', E 'EXERCISE', F 'SETS', G 'REPS', **H 'WEIGHT USED or SCORE'** (free text, no dropdown), **I 'EFFORT'**, **J 'HOW IT FELT?'**, **K 'DONE?'** (one checkbox per day, merged K3:K9 etc., all FALSE).
- **Conditional formats:**
  - H blank -> red EA9999, H filled -> green B6D7A8, on every resistance, core and focus row. This is a logging-compliance light. Cardio rows H19 and H40 are excluded.
  - Text containing TRUE turns green 57BB8A, on K and the training blocks. A separate rule colours FALSE in K.
- **Calendar:** 'WEEK 1'.
  - 'MONDAY' and 'THURSDAY' (EFEFEF) = A day.
  - 'TUESDAY' and 'FRIDAY' (CCCCCC) = B day.
  - 'WEDNESDAY' and 'SATURDAY' (FCE5CD) = 5-slot accessory/conditioning blocks. Rows 17-23 and 38-44; the first and last row of each block are empty.
  - 'SUNDAY' = 'OFF'.
  - Empty merged week cells A52:A58 and A59:A65 sit below the week. *INFERRED:* more day blocks were planned or deleted.
- **Days/week:** 4 by the title. *INFERRED:* Wed/Sat are optional, because they carry exactly the 5-slot block that AESTHETICS labels 'Optional' ('Calves', 'Cardio', 'Core', 'Focus 1', 'Focus 2'). They do have their own DONE checkbox.
- **Population/goal (INFERRED):** general-population "bootcamp" client, aiming for fat loss plus muscle/tone. The evidence:
  - the name;
  - full-body days with no athletic slots;
  - conditioning on off-days;
  - 'SCORE' in the H header;
  - the MASTER_MODEL 'EXAMPLE FAT BURNBODY TONING PRO' has the identical weekly skeleton: 4 lifting days (Mon/Tue/Thu/Fri) and '30-40 mi slow/steady CARDIO' on Wednesday and Saturday.
- **Level(s):** chosen through the dropdown blocks, as in the PPL tab.
- **Equipment (INFERRED):** commercial gym. The 'Leg Extensions' and 'Leg Curls' slots are machine-only, and 'Calves' includes 'Machine Calf Raises'.

### 2.2 Session-by-session table (all 38 slots)

| Day | # | Section (verbatim) | PURPOSE / CATEGORY (verbatim) | Canonical bucket | Exercise (as written) | Sets | Reps | Effort | Notes (dropdown source; OBSERVED unless marked) |
|---|---|---|---|---|---|---|---|---|---|
| MONDAY | 1 | 'WEEK 1' / 'MONDAY' [A day] | 'Quads' / 'Bilateral KD' | RP_BKD | 'CHOOSE 👇' | 'CHOOSE 👇' (`AV7:AV42` 1-8 / 'SUPERSET W/ 👇') | 'CHOOSE 👇' (`AW` menu) | 'CHOOSE 👇' (`AX` 1-10) | `AI7:AI122` 'BILATERAL KNEE DOMINANT' - 35 selectable items (33 unique) |
| MONDAY | 2 | 'WEEK 1' / 'MONDAY' [A day] | 'Back' / 'Horizontal Pull' | RP_HPULL | 'CHOOSE 👇' | 'CHOOSE 👇' (`AV7:AV42` 1-8 / 'SUPERSET W/ 👇') | 'CHOOSE 👇' (`AW` menu) | 'CHOOSE 👇' (`AX` 1-10) | `X7:X162` 'HORIZONTAL PULL' - 16 selectable items |
| MONDAY | 3 | 'WEEK 1' / 'MONDAY' [A day] | 'Hamstring/Glutes' / 'Unilateral HD' | RP_UHD | 'CHOOSE 👇' | 'CHOOSE 👇' (`AV7:AV42` 1-8 / 'SUPERSET W/ 👇') | 'CHOOSE 👇' (`AW` menu) | 'CHOOSE 👇' (`AX` 1-10) | `AQ7:AQ42` 'UNILATERAL HIP DOMINANT' - 8 selectable items |
| MONDAY | 4 | 'WEEK 1' / 'MONDAY' [A day] | 'Chest/Shoulders' / 'Vertical Push' | RP_VPUSH | 'CHOOSE 👇' | 'CHOOSE 👇' (`AV7:AV42` 1-8 / 'SUPERSET W/ 👇') | 'CHOOSE 👇' (`AW` menu) | 'CHOOSE 👇' (`AX` 1-10) | `AA7:AA122` 'VERTICAL PUSH' - 20 selectable items (19 unique) |
| MONDAY | 5 | 'WEEK 1' / 'MONDAY' [A day] | 'Bicep' / 'Bicep' | ISO_BICEP | 'CHOOSE 👇' | 'CHOOSE 👇' (`AV7:AV42` 1-8 / 'SUPERSET W/ 👇') | 'CHOOSE 👇' (`AW` menu) | 'CHOOSE 👇' (`AX` 1-10) | `AS7:AS42` 'BICEP' - 14 selectable items |
| MONDAY | 6 | 'WEEK 1' / 'MONDAY' [A day] | 'Calves' / 'Calves' | ISO_CALF | 'CHOOSE 👇' | 'CHOOSE 👇' (`AV7:AV42` 1-8 / 'SUPERSET W/ 👇') | 'CHOOSE 👇' (`AW` menu) | 'CHOOSE 👇' (`AX` 1-10) | `AU7:AU13` 'CALVES' - 5 selectable items |
| MONDAY | 7 | 'WEEK 1' / 'MONDAY' [A day] | 'Quads' / 'Leg Extensions' | ISO_QUAD | 'CHOOSE 👇' | 'CHOOSE 👇' (`AV7:AV42` 1-8 / 'SUPERSET W/ 👇') | 'CHOOSE 👇' (`AW` menu) | 'CHOOSE 👇' (`AX` 1-10) | `AM7:AM9` 'LEG EXTENSIONS' - 1 selectable items; single-item list |
| TUESDAY | 1 | 'WEEK 1' / 'TUESDAY' [B day] | 'Hamstring' / 'Bilateral HD' | RP_BHD | 'CHOOSE 👇' | 'CHOOSE 👇' (`AV7:AV42` 1-8 / 'SUPERSET W/ 👇') | 'CHOOSE 👇' (`AW` menu) | 'CHOOSE 👇' (`AX` 1-10) | `AN7:AN122` 'BILATERAL HIP DOMNANT' - 33 selectable items (32 unique) |
| TUESDAY | 2 | 'WEEK 1' / 'TUESDAY' [B day] | 'Back ' / 'Vertical Pull' | RP_VPULL | 'CHOOSE 👇' | 'CHOOSE 👇' (`AV7:AV42` 1-8 / 'SUPERSET W/ 👇') | 'CHOOSE 👇' (`AW` menu) | 'CHOOSE 👇' (`AX` 1-10) | `U7:U122` 'VERTICAL PULL' - 20 selectable items |
| TUESDAY | 3 | 'WEEK 1' / 'TUESDAY' [B day] | 'Quads/Glutes' / 'Unilateral KD' | RP_UKD | 'CHOOSE 👇' | 'CHOOSE 👇' (`AV7:AV42` 1-8 / 'SUPERSET W/ 👇') | 'CHOOSE 👇' (`AW` menu) | 'CHOOSE 👇' (`AX` 1-10) | `AL7:AL42` 'UNILATERAL KNEE DOMINANT' - 13 selectable items |
| TUESDAY | 4 | 'WEEK 1' / 'TUESDAY' [B day] | 'Chest' / 'Horizontal Push' | RP_HPUSH | 'CHOOSE 👇' | 'CHOOSE 👇' (`AV7:AV42` 1-8 / 'SUPERSET W/ 👇') | 'CHOOSE 👇' (`AW` menu) | 'CHOOSE 👇' (`AX` 1-10) | `AD7:AD162` 'HORIZONTAL PUSH' - 25 selectable items (24 unique) |
| TUESDAY | 5 | 'WEEK 1' / 'TUESDAY' [B day] | 'Hamstrings' / 'Leg Curls' | ISO_HAM | 'CHOOSE 👇' | 'CHOOSE 👇' (`AV7:AV42` 1-8 / 'SUPERSET W/ 👇') | 'CHOOSE 👇' (`AW` menu) | 'CHOOSE 👇' (`AX` 1-10) | `AR7:AR10` 'LEG CURLS' - 2 selectable items |
| TUESDAY | 6 | 'WEEK 1' / 'TUESDAY' [B day] | 'Tricep' / (blank) | ISO_TRICEP | 'CHOOSE 👇' | 'CHOOSE 👇' (`AV7:AV42` 1-8 / 'SUPERSET W/ 👇') | 'CHOOSE 👇' (`AW` menu) | 'CHOOSE 👇' (`AX` 1-10) | `AT7:AT42` 'TRICEP' - 9 selectable items |
| TUESDAY | 7 | 'WEEK 1' / 'TUESDAY' [B day] | 'Shoulders/Traps' / 'ABdution' | ISO_SIDE_REAR_DELT/side | 'CHOOSE 👇' | 'CHOOSE 👇' (`AV7:AV42` 1-8 / 'SUPERSET W/ 👇') | 'CHOOSE 👇' (`AW` menu) | 'CHOOSE 👇' (`AX` 1-10) | `AH7:AH42` 'SIDE RAISES' - 12 selectable items; side-delt (abduction / lateral raise); 6 of 12 items are side raises; 3 are front raises; 3 are reverse flies - the label asks for a side raise |
| WEDNESDAY | 1 | 'WEEK 1' / 'WEDNESDAY' [accessory/conditioning (inferred optional)] | 'Calves' / (blank) | ISO_CALF | 'CHOOSE 👇' | 'CHOOSE 👇' (`AV7:AV42` 1-8 / 'SUPERSET W/ 👇') | 'CHOOSE 👇' (`AW` menu) | 'CHOOSE 👇' (`AX` 1-10) | `AU7:AU13` 'CALVES' - 5 selectable items |
| WEDNESDAY | 2 | 'WEEK 1' / 'WEDNESDAY' [accessory/conditioning (inferred optional)] | 'Cardio' / (blank) | COND_AEROBIC | 'CHOOSE 👇' | 'CHOOSE 👇' (`AV7:AV42` 1-8 / 'SUPERSET W/ 👇') | no dropdown (cardio row) | 'CHOOSE 👇' (`AX` 1-10) | `B7:B122` 'CARDIO' - 29 selectable items (20 unique); TRUNCATED range: excludes 'DISTANCE' 200m-1000m and 'CALORIES' 10-50 cals blocks |
| WEDNESDAY | 3 | 'WEEK 1' / 'WEDNESDAY' [accessory/conditioning (inferred optional)] | 'Core' / (blank) | CORE_OTHER | 'CHOOSE 👇' | 'CHOOSE 👇' (`AV7:AV42` 1-8 / 'SUPERSET W/ 👇') | 'CHOOSE 👇' (`AW` menu) | 'CHOOSE 👇' (`AX` 1-10) | `O7:O283` 'CORE THORAX' (+ 'CORE PELVIS' block) - 17 selectable items; menu = CORE THORAX (sagittal/frontal/transverse) + CORE PELVIS blocks |
| WEDNESDAY | 4 | 'WEEK 1' / 'WEDNESDAY' [accessory/conditioning (inferred optional)] | 'Focus 1' / (blank) | FOCUS | 'CHOOSE 👇' | 'CHOOSE 👇' (`AV7:AV42` 1-8 / 'SUPERSET W/ 👇') | 'CHOOSE 👇' (`AW` menu) | 'CHOOSE 👇' (`AX` 1-10) | `AZ7:AZ335` 'FULL FOCUS LIST' - 51 selectable items (49 unique); menu grouped by muscle (QUADS, SHOULDERS/TRAPS, BACK, TRICEP, GLUTES, HAMSTRINGS, CHEST, CORE, BICEP, CALVES) |
| WEDNESDAY | 5 | 'WEEK 1' / 'WEDNESDAY' [accessory/conditioning (inferred optional)] | 'Focus 2' / (blank) | FOCUS | 'CHOOSE 👇' | 'CHOOSE 👇' (`AV7:AV42` 1-8 / 'SUPERSET W/ 👇') | 'CHOOSE 👇' (`AW` menu) | 'CHOOSE 👇' (`AX` 1-10) | `AZ7:AZ335` 'FULL FOCUS LIST' - 51 selectable items (49 unique); menu grouped by muscle (QUADS, SHOULDERS/TRAPS, BACK, TRICEP, GLUTES, HAMSTRINGS, CHEST, CORE, BICEP, CALVES) |
| THURSDAY | 1 | 'WEEK 1' / 'THURSDAY' [A day] | 'Quads' / 'Bilateral KD' | RP_BKD | 'CHOOSE 👇' | 'CHOOSE 👇' (`AV7:AV42` 1-8 / 'SUPERSET W/ 👇') | 'CHOOSE 👇' (`AW` menu) | 'CHOOSE 👇' (`AX` 1-10) | `AI7:AI122` 'BILATERAL KNEE DOMINANT' - 35 selectable items (33 unique) |
| THURSDAY | 2 | 'WEEK 1' / 'THURSDAY' [A day] | 'Back' / 'Horizontal Pull' | RP_HPULL | 'CHOOSE 👇' | 'CHOOSE 👇' (`AV7:AV42` 1-8 / 'SUPERSET W/ 👇') | 'CHOOSE 👇' (`AW` menu) | 'CHOOSE 👇' (`AX` 1-10) | `X7:X162` 'HORIZONTAL PULL' - 16 selectable items |
| THURSDAY | 3 | 'WEEK 1' / 'THURSDAY' [A day] | 'Hamstring/Glutes' / 'Unilateral HD' | RP_UHD | 'CHOOSE 👇' | 'CHOOSE 👇' (`AV7:AV42` 1-8 / 'SUPERSET W/ 👇') | 'CHOOSE 👇' (`AW` menu) | 'CHOOSE 👇' (`AX` 1-10) | `AQ7:AQ42` 'UNILATERAL HIP DOMINANT' - 8 selectable items |
| THURSDAY | 4 | 'WEEK 1' / 'THURSDAY' [A day] | 'Chest/Shoulders' / 'Vertical Push' | RP_VPUSH | 'CHOOSE 👇' | 'CHOOSE 👇' (`AV7:AV42` 1-8 / 'SUPERSET W/ 👇') | 'CHOOSE 👇' (`AW` menu) | 'CHOOSE 👇' (`AX` 1-10) | `AA7:AA122` 'VERTICAL PUSH' - 20 selectable items (19 unique) |
| THURSDAY | 5 | 'WEEK 1' / 'THURSDAY' [A day] | 'Bicep' / 'Bicep' | ISO_BICEP | 'CHOOSE 👇' | 'CHOOSE 👇' (`AV7:AV42` 1-8 / 'SUPERSET W/ 👇') | 'CHOOSE 👇' (`AW` menu) | 'CHOOSE 👇' (`AX` 1-10) | `AS7:AS42` 'BICEP' - 14 selectable items |
| THURSDAY | 6 | 'WEEK 1' / 'THURSDAY' [A day] | 'Calves' / 'Calves' | ISO_CALF | 'CHOOSE 👇' | 'CHOOSE 👇' (`AV7:AV42` 1-8 / 'SUPERSET W/ 👇') | 'CHOOSE 👇' (`AW` menu) | 'CHOOSE 👇' (`AX` 1-10) | `AU7:AU13` 'CALVES' - 5 selectable items |
| THURSDAY | 7 | 'WEEK 1' / 'THURSDAY' [A day] | 'Quads' / 'Leg Extensions' | ISO_QUAD | 'Leg extensions' | 'CHOOSE 👇' (`AV7:AV42` 1-8 / 'SUPERSET W/ 👇') | 'CHOOSE 👇' (`AW` menu) | 'CHOOSE 👇' (`AX` 1-10) | `AM7:AM9` 'LEG EXTENSIONS' - 1 selectable items; single-item list; E30 pre-filled 'Leg extensions' (lower-case e) is NOT the list item 'Leg Extensions' -> Sheets flags it invalid |
| FRIDAY | 1 | 'WEEK 1' / 'FRIDAY' [B day] | 'Hamstring' / 'Bilateral HD' | RP_BHD | 'CHOOSE 👇' | 'CHOOSE 👇' (`AV7:AV42` 1-8 / 'SUPERSET W/ 👇') | 'CHOOSE 👇' (`AW` menu) | 'CHOOSE 👇' (`AX` 1-10) | `AN7:AN122` 'BILATERAL HIP DOMNANT' - 33 selectable items (32 unique) |
| FRIDAY | 2 | 'WEEK 1' / 'FRIDAY' [B day] | 'Back ' / 'Vertical Pull' | RP_VPULL | 'CHOOSE 👇' | 'CHOOSE 👇' (`AV7:AV42` 1-8 / 'SUPERSET W/ 👇') | 'CHOOSE 👇' (`AW` menu) | 'CHOOSE 👇' (`AX` 1-10) | `U7:U122` 'VERTICAL PULL' - 20 selectable items |
| FRIDAY | 3 | 'WEEK 1' / 'FRIDAY' [B day] | 'Quads/Glutes' / 'Unilateral KD' | RP_UKD | 'CHOOSE 👇' | 'CHOOSE 👇' (`AV7:AV42` 1-8 / 'SUPERSET W/ 👇') | 'CHOOSE 👇' (`AW` menu) | 'CHOOSE 👇' (`AX` 1-10) | `AL7:AL42` 'UNILATERAL KNEE DOMINANT' - 13 selectable items |
| FRIDAY | 4 | 'WEEK 1' / 'FRIDAY' [B day] | 'Chest' / 'Horizontal Push' | RP_HPUSH | 'CHOOSE 👇' | 'CHOOSE 👇' (`AV7:AV42` 1-8 / 'SUPERSET W/ 👇') | 'CHOOSE 👇' (`AW` menu) | 'CHOOSE 👇' (`AX` 1-10) | `AD7:AD162` 'HORIZONTAL PUSH' - 25 selectable items (24 unique) |
| FRIDAY | 5 | 'WEEK 1' / 'FRIDAY' [B day] | 'Hamstrings' / 'Leg Curls' | ISO_HAM | 'CHOOSE 👇' | 'CHOOSE 👇' (`AV7:AV42` 1-8 / 'SUPERSET W/ 👇') | 'CHOOSE 👇' (`AW` menu) | 'CHOOSE 👇' (`AX` 1-10) | `AR7:AR10` 'LEG CURLS' - 2 selectable items |
| FRIDAY | 6 | 'WEEK 1' / 'FRIDAY' [B day] | 'Tricep' / (blank) | ISO_TRICEP | 'CHOOSE 👇' | 'CHOOSE 👇' (`AV7:AV42` 1-8 / 'SUPERSET W/ 👇') | 'CHOOSE 👇' (`AW` menu) | 'CHOOSE 👇' (`AX` 1-10) | `AT7:AT42` 'TRICEP' - 9 selectable items |
| FRIDAY | 7 | 'WEEK 1' / 'FRIDAY' [B day] | 'Shoulders/Traps' / 'ABdution' | ISO_SIDE_REAR_DELT/side | 'CHOOSE 👇' | 'CHOOSE 👇' (`AV7:AV42` 1-8 / 'SUPERSET W/ 👇') | 'CHOOSE 👇' (`AW` menu) | 'CHOOSE 👇' (`AX` 1-10) | `AH7:AH42` 'SIDE RAISES' - 12 selectable items; side-delt (abduction / lateral raise); 6 of 12 items are side raises; 3 are front raises; 3 are reverse flies - the label asks for a side raise |
| SATURDAY | 1 | 'WEEK 1' / 'SATURDAY' [accessory/conditioning (inferred optional)] | 'Calves' / (blank) | ISO_CALF | 'CHOOSE 👇' | 'CHOOSE 👇' (`AV7:AV42` 1-8 / 'SUPERSET W/ 👇') | 'CHOOSE 👇' (`AW` menu) | 'CHOOSE 👇' (`AX` 1-10) | `AU7:AU13` 'CALVES' - 5 selectable items |
| SATURDAY | 2 | 'WEEK 1' / 'SATURDAY' [accessory/conditioning (inferred optional)] | 'Cardio' / (blank) | COND_AEROBIC | 'CHOOSE 👇' | 'CHOOSE 👇' (`AV7:AV42` 1-8 / 'SUPERSET W/ 👇') | no dropdown (cardio row) | 'CHOOSE 👇' (`AX` 1-10) | `B7:B122` 'CARDIO' - 29 selectable items (20 unique); TRUNCATED range: excludes 'DISTANCE' 200m-1000m and 'CALORIES' 10-50 cals blocks |
| SATURDAY | 3 | 'WEEK 1' / 'SATURDAY' [accessory/conditioning (inferred optional)] | 'Core' / (blank) | CORE_OTHER | 'CHOOSE 👇' | 'CHOOSE 👇' (`AV7:AV42` 1-8 / 'SUPERSET W/ 👇') | 'CHOOSE 👇' (`AW` menu) | 'CHOOSE 👇' (`AX` 1-10) | `O7:O283` 'CORE THORAX' (+ 'CORE PELVIS' block) - 17 selectable items; menu = CORE THORAX (sagittal/frontal/transverse) + CORE PELVIS blocks |
| SATURDAY | 4 | 'WEEK 1' / 'SATURDAY' [accessory/conditioning (inferred optional)] | 'Focus 1' / (blank) | FOCUS | 'CHOOSE 👇' | 'CHOOSE 👇' (`AV7:AV42` 1-8 / 'SUPERSET W/ 👇') | 'CHOOSE 👇' (`AW` menu) | 'CHOOSE 👇' (`AX` 1-10) | `AZ7:AZ335` 'FULL FOCUS LIST' - 51 selectable items (49 unique); menu grouped by muscle (QUADS, SHOULDERS/TRAPS, BACK, TRICEP, GLUTES, HAMSTRINGS, CHEST, CORE, BICEP, CALVES) |
| SATURDAY | 5 | 'WEEK 1' / 'SATURDAY' [accessory/conditioning (inferred optional)] | 'Focus 2' / (blank) | FOCUS | 'CHOOSE 👇' | 'CHOOSE 👇' (`AV7:AV42` 1-8 / 'SUPERSET W/ 👇') | 'CHOOSE 👇' (`AW` menu) | 'CHOOSE 👇' (`AX` 1-10) | `AZ7:AZ335` 'FULL FOCUS LIST' - 51 selectable items (49 unique); menu grouped by muscle (QUADS, SHOULDERS/TRAPS, BACK, TRICEP, GLUTES, HAMSTRINGS, CHEST, CORE, BICEP, CALVES) |

### 2.3 Rules visible in the layout
1. **Two full-body templates repeated: A = Mon/Thu, B = Tue/Fri** (OBSERVED: labels and dropdowns are identical between each pair).
   - **A:** 'Bilateral KD' -> 'Horizontal Pull' -> 'Unilateral HD' -> 'Vertical Push' -> 'Bicep' -> 'Calves' -> 'Leg Extensions'.
   - **B:** 'Bilateral HD' -> 'Vertical Pull' -> 'Unilateral KD' -> 'Horizontal Push' -> 'Leg Curls' -> (Tricep) -> 'ABdution'.
2. **Opposite-pairing rule (OBSERVED structure):**
   - Lower body: each day has one bilateral pattern and one unilateral pattern of the **opposite** dominance (A: BKD + UHD; B: BHD + UKD).
   - Upper body: each day has one pull and one push in **opposite planes** (A: horizontal pull + vertical push; B: vertical pull + horizontal push).
   - Over A+B, all 8 primary patterns appear exactly once.
3. **Order:** lower -> upper -> lower -> upper for slots 1-4 (all multi-joint), then isolation in slots 5-7. Every day starts with a bilateral lower-body lift.
4. **Isolation follows the day's bilateral lift and the matching upper pattern:**
   - 'Leg Extensions' on the bilateral knee-dominant day, 'Leg Curls' on the bilateral hip-dominant day.
   - 'Bicep' on the day with the horizontal pull, 'Tricep' on the day with the horizontal push.
   - 'ABdution' on the B day.
5. **Calves are the most frequent muscle:** slot 6 on A days plus slot 1 on both accessory days = up to 4 calf slots per week.
6. **Accessory days:** 'Calves' -> 'Cardio' -> 'Core' -> 'Focus 1' -> 'Focus 2', with no CATEGORY labels. Cardio has SETS and EFFORT dropdowns but no REPS or HOW IT FELT? dropdown, so the dose is inside the item text (e.g. '2 min Fast - 1 min walk').
7. **Pairing:** none prescribed. 'SUPERSET W/ 👇' is available. *INFERRED:* the lower/upper alternation makes slots 1+2 and 3+4 natural non-competing supersets or stations.
8. **Comparison with AESTHETICS - FULL BODY - 4 DAYS (OBSERVED):** both use the same 14 resistance slots.
   - AESTHETICS Day 1 = 'Calves', 'Bilateral KD', 'Horizontal Pull', 'Unilateral KD', 'Vertical Pull', 'Bicep', 'Leg Extensions' (**all knee-dominant + all pulls**).
   - AESTHETICS Day 2 = 'Bilateral HD', 'Horizontal Push', 'Unilateral HD', 'Vertical Push', 'Leg Curls', 'Tricep', 'ABdution' (**all hip-dominant + all pushes**).
   - Bootcamp 1 swaps 'Unilateral KD' with 'Unilateral HD' and 'Vertical Pull' with 'Vertical Push' between the days, and moves 'Calves' from slot 1 to slot 6.

### 2.4 Quantitative volume

Sessions:

| Session | Exercises (slots) | Resistance/core/focus slots | Cardio slots | Sets as written | Sets @3 (assumed) | Sets coach-default (assumed) |
|---|---|---|---|---|---|---|
| MONDAY | 7 | 7 | 0 | 0 (all 'CHOOSE 👇' or no column) | 21 | 19 |
| TUESDAY | 7 | 7 | 0 | 0 (all 'CHOOSE 👇' or no column) | 21 | 18 |
| WEDNESDAY | 5 | 4 | 1 | 0 (all 'CHOOSE 👇' or no column) | 12 | 9 |
| THURSDAY | 7 | 7 | 0 | 0 (all 'CHOOSE 👇' or no column) | 21 | 19 |
| FRIDAY | 7 | 7 | 0 | 0 (all 'CHOOSE 👇' or no column) | 21 | 18 |
| SATURDAY | 5 | 4 | 1 | 0 (all 'CHOOSE 👇' or no column) | 12 | 9 |

Weekly slots and sets by canonical bucket:

| Bucket | 4_main_days_only slots/wk (OBSERVED) | 6_days_incl_Wed_Sat_accessory slots/wk (OBSERVED) | 4_main_days_only sets/wk @3 (assumed) | 6_days_incl_Wed_Sat_accessory sets/wk @3 (assumed) | 4_main_days_only sets/wk coach-default (assumed) | 6_days_incl_Wed_Sat_accessory sets/wk coach-default (assumed) |
|---|---|---|---|---|---|---|
| RP_BKD | 2 | 2 | 6 | 6 | 6 | 6 |
| RP_BHD | 2 | 2 | 6 | 6 | 6 | 6 |
| RP_UKD | 2 | 2 | 6 | 6 | 6 | 6 |
| RP_UHD | 2 | 2 | 6 | 6 | 6 | 6 |
| RP_HPUSH | 2 | 2 | 6 | 6 | 6 | 6 |
| RP_VPUSH | 2 | 2 | 6 | 6 | 6 | 6 |
| RP_HPULL | 2 | 2 | 6 | 6 | 6 | 6 |
| RP_VPULL | 2 | 2 | 6 | 6 | 6 | 6 |
| ISO_QUAD | 2 | 2 | 6 | 6 | 4 | 4 |
| ISO_HAM | 2 | 2 | 6 | 6 | 4 | 4 |
| ISO_SIDE_REAR_DELT | 2 | 2 | 6 | 6 | 4 | 4 |
| ISO_BICEP | 2 | 2 | 6 | 6 | 4 | 4 |
| ISO_TRICEP | 2 | 2 | 6 | 6 | 4 | 4 |
| ISO_CALF | 2 | 4 | 6 | 12 | 6 | 12 |
| CORE_OTHER | 0 | 2 | 0 | 6 | 0 | 4 |
| COND_AEROBIC | 0 | 2 | 0 | 0 | 0 | 0 |
| FOCUS | 0 | 4 | 0 | 12 | 0 | 8 |
| **TOTAL** | 28 | 38 | 84 | 108 | 74 | 92 |

Buckets with **0** slots in every variant: AP_PLYO, AP_JUMP_LIMITED_KNEE, AP_THROW, AP_COD, AP_SPRINT, AP_TRIPLE_EXT, ISO_CHEST, CT_CORE_THORAX, CP_CORE_PELVIS, COND_SPRINT_BUYOUT, FUNCTIONAL.

Weekly sets by muscle:

| Muscle | 4_main_days_only credits/wk (sets=1 per slot) | 6_days_incl_Wed_Sat_accessory credits/wk (sets=1 per slot) | 4_main_days_only @3 sets (assumed) | 6_days_incl_Wed_Sat_accessory @3 sets (assumed) | 4_main_days_only coach-default (assumed) | 6_days_incl_Wed_Sat_accessory coach-default (assumed) | 4_main_days_only: sets/slot to reach 15 / 20 | 6_days_incl_Wed_Sat_accessory: sets/slot to reach 15 / 20 |
|---|---|---|---|---|---|---|---|---|
| quads | 6 | 6 | 18 | 18 | 16 | 16 | 2.5 / 3.3 | 2.5 / 3.3 |
| glutes | 7 | 7 | 21 | 21 | 21 | 21 | 2.1 / 2.9 | 2.1 / 2.9 |
| hamstrings | 6 | 6 | 18 | 18 | 16 | 16 | 2.5 / 3.3 | 2.5 / 3.3 |
| chest | 3 | 3 | 9 | 9 | 9 | 9 | 5.0 / 6.7 | 5.0 / 6.7 |
| lats/upper back | 4 | 4 | 12 | 12 | 12 | 12 | 3.8 / 5.0 | 3.8 / 5.0 |
| front delts | 3 | 3 | 9 | 9 | 9 | 9 | 5.0 / 6.7 | 5.0 / 6.7 |
| side delts | 3 | 3 | 9 | 9 | 7 | 7 | 5.0 / 6.7 | 5.0 / 6.7 |
| rear delts | 1 | 1 | 3 | 3 | 3 | 3 | 15.0 / 20.0 (exceeds 8-set dropdown max) | 15.0 / 20.0 (exceeds 8-set dropdown max) |
| biceps | 4 | 4 | 12 | 12 | 10 | 10 | 3.8 / 5.0 | 3.8 / 5.0 |
| triceps | 4 | 4 | 12 | 12 | 10 | 10 | 3.8 / 5.0 | 3.8 / 5.0 |
| calves | 2 | 4 | 6 | 12 | 6 | 12 | 7.5 / 10.0 | 3.8 / 5.0 |
| abs/obliques | 0 | 2 | 0 | 6 | 0 | 4 | no slot | 7.5 / 10.0 |

Reading the numbers:
- **Exercises per session:** 7 on main days, 5 on accessory days. **Sets per session:** 21 at 3 per slot (18-19 coach-default) on main days; 12 (9) plus one cardio bout on accessory days.
- **Weekly sets:** 84 on 4 days, 108 on 6 days (at 3 per slot); 74 / 92 coach-default.
- **Balance (OBSERVED slots, 4 main days):**
  - upper RP 8 : lower RP 8;
  - upper isolation 6 (bicep, tricep, ABdution) : lower isolation 6 (calves, leg ext, leg curl);
  - every primary pattern 2x per week.
- **Muscle level:** lower body dominates because every lower pattern credits two muscles. At 3 sets per slot, glutes 21, quads 18, hams 18, versus chest 9, front and side delts 9, rear delts 3.
  - Reaching 15 chest sets would take 5 sets per slot; rear delts would need 15+.
  - *INFERRED:* the 4 Focus slots per week (Wed/Sat, about 12 flex sets at 3 per slot) are where an upper-body or glute goal is topped up.
- **Calves:** 6 sets (4-day) to 12 sets (6-day) at 3 per slot. *INFERRED:* high frequency for a small, fast-recovering muscle.

### 2.5 Reps, intensity, rest, tempo
- **As written:** every REPS, EFFORT and HOW IT FELT? cell is 'CHOOSE 👇'. The menus are the same as in section 1.5, plus:
  - **EFFORT (`AX`):** '1 - Way Too Easy' ... '7 - That was tough', '8 - That was perfect', '9 - That was terrible', "10 - I'm done". *INFERRED:* the target is 8, about RPE 8 / 1-2 RIR, which matches the "1-3 RIR aka RPE 7+" instruction in the MASTER_MODEL PPL example.
  - **HOW IT FELT? (`AY`):** 'Felt the RIGHT muscles', 'Felt the WRONG muscle', 'Felt a PAIN', "Couldn't do it". *INFERRED:* a target-tissue and pain screen that drives exercise swaps and set cuts ("fewer sets with injury or pain").
  - **WEIGHT USED or SCORE:** free text. 'SCORE' covers cardio and tests such as '1 Mile Run for time'.
- **Rest / tempo / %1RM:** none.
- **Cross-reference (MASTER_MODEL fat-burn example, same skeleton):** compounds 3-4 x 8-15, unilateral 2-3 x 8/8-12/12 per side, leg ext/curl 3-4 x 15-20 then 2-3 x 40, arms 2-3 x 30-40.

### 2.6 Progression
- **Written:** none (single 'WEEK 1').
- **Closest worked example** (MASTER_MODEL 'EXAMPLE FAT BURNBODY TONING PRO', OBSERVED there): weekly working sets **60 -> 60 -> 64 -> 70**, i.e. +0 %, +6.7 %, +9.4 % (+16.7 % over 4 weeks).
  - 5 exercises per session throughout.
  - Week 2 rotates exercise variations (lunge type, deadlift/leg press order) without adding sets.
  - Weeks 3-4 add sets to compounds (3 -> 4) while compound reps trend down: lower-body lifts go from 12-15 in weeks 1-2 to 10-12 in weeks 3-4, and upper-body presses/pulls from 10-12 to 8 by week 4. Isolation reps rise (leg ext/curl 15 -> 20 -> 40 -> 40; arms 30 -> 30 -> 30 -> 40).
  - Its circuit block progresses rounds and time: 3 x 30 s -> 4 x 35 s -> 4 x 40 s -> 5 x 50 s.
- *INFERRED for this template:* the EFFORT and HOW IT FELT? columns are the autoregulation inputs for the coach's 3/5/7 % weekly increments. If effort reads 8 and the client felt the right muscles, add a set or load. If 9-10 or 'Felt a PAIN', hold or cut.

### 2.7 What this reveals (INFERRED)
- **Bootcamp = irregular attendance.** He re-paired the AESTHETICS slots so that **any single session is a complete full-body dose** (knee + hip, push + pull, bilateral + unilateral). A client who only makes Monday still trains every movement family. In AESTHETICS, missing Day 2 would skip all pushing and hip work.
- Alternating lower and upper slots fits a group/circuit format: high density with little local fatigue.
- The coach collects the most feedback here (weight/score, effort, feeling, done). Bootcamp clients are the ones he autoregulates from logs.
- Lower-body/glute volume is structurally higher than upper-body volume. This matches typical bootcamp-client goals, but the coach should confirm it.

---

## 3. 'BOOTCAMP - OPTION 2'

### 3.1 Identity (OBSERVED unless marked)
- **Tab:** 'BOOTCAMP - OPTION 2'. **Title A1** (merged A1:E1, row height 91.5) reads **'BOOTCAMP OPTION 1'**. *INFERRED:* a copy-paste leftover.
- **Columns:** A 'WEEK' (merged 5-row blocks, all empty), B 'DAY', C 'PURPOSE', D 'CATEGORY', E 'EXERCISE'. **No SETS, REPS, EFFORT, FEELING, WEIGHT or DONE?** A merged F33:F37 on the Sunday row is the only trace of a sixth column. *INFERRED:* a SETS column existed and was deleted.
- **Sessions:** '1A' (EFEFEF), '2A' (F3F3F3), '3A' (D9D9D9), '1B', '2B', '3B' (same greys), then 'SUNDAY' 'OFF' (F4CCCC).
- **Days/week:** 6 as laid out (6 sessions plus a Sunday-off row). *INFERRED alternative:* 3 per week, alternating an A week and a B week. 1B-3B repeat 1A-3A slot-for-slot, so the B sessions only add a second exercise choice.
- **Population/goal (INFERRED):** the bootcamp client again, but with shorter, more frequent sessions and cardio every time. It leans further toward fat loss and conditioning, with group- and equipment-friendly selection.
- **Equipment (INFERRED):** the machine-only slots ('Leg Extensions', 'Leg Curls') and the calf slot are gone. Every remaining slot's menu has at least one bodyweight, band, DB, KB or TRX option:
  - 'Bodyweight Squats'; 'TRX Rows' / 'Inverted Rows';
  - 'SL Glute Bridges (foot on the ground)'; 'Glute Bridges' / 'KB swing';
  - 'Kneeling Push Ups' / 'Push Ups '; 'DB Curls' / 'TRX Bicep Curls';
  - 'DB Push press' / 'Pike Push Ups'; 'Assisted  Pull-Up w bands' / 'Seated Pull ups with Rings or TRX';
  - the lunges; 'DB Kickbacks (Uni/Bi)'; 'Lateral Raises w/ DB '; 'Plank'.

### 3.2 Session-by-session table (all 30 slots)

| Day | # | Section (verbatim) | PURPOSE / CATEGORY (verbatim) | Canonical bucket | Exercise (as written) | Sets | Reps | Effort | Notes (dropdown source; OBSERVED unless marked) |
|---|---|---|---|---|---|---|---|---|---|
| 1A | 1 | '1A' (no week label) | 'Quads' / 'Bilateral KD' | RP_BKD | 'CHOOSE 👇' | no column | no column | no column | `AI7:AI122` 'BILATERAL KNEE DOMINANT' - 35 selectable items (33 unique) |
| 1A | 2 | '1A' (no week label) | 'Back' / 'Horizontal Pull' | RP_HPULL | 'CHOOSE 👇' | no column | no column | no column | `X7:X162` 'HORIZONTAL PULL' - 16 selectable items |
| 1A | 3 | '1A' (no week label) | 'Hamstring/Glutes' / 'Unilateral HD' | RP_UHD | 'CHOOSE 👇' | no column | no column | no column | `AQ7:AQ42` 'UNILATERAL HIP DOMINANT' - 8 selectable items |
| 1A | 4 | '1A' (no week label) | 'Core' / (blank) | CORE_OTHER | 'CHOOSE 👇' | no column | no column | no column | `O7:O283` 'CORE THORAX' (+ 'CORE PELVIS' block) - 17 selectable items; menu = CORE THORAX (sagittal/frontal/transverse) + CORE PELVIS blocks |
| 1A | 5 | '1A' (no week label) | 'Cardio' / (blank) | COND_AEROBIC | 'CHOOSE 👇' | no column | no column | no column | `B7:B335` 'CARDIO' - 43 selectable items (34 unique); full range incl. 'DISTANCE' 200m-1000m and 'CALORIES' 10-50 cals (buy-out style options) |
| 2A | 1 | '2A' (no week label) | 'Hamstring' / 'Bilateral HD' | RP_BHD | 'CHOOSE 👇' | no column | no column | no column | `AN7:AN122` 'BILATERAL HIP DOMNANT' - 33 selectable items (32 unique) |
| 2A | 2 | '2A' (no week label) | 'Chest' / 'Horizontal Push' | RP_HPUSH | 'CHOOSE 👇' | no column | no column | no column | `AD7:AD162` 'HORIZONTAL PUSH' - 25 selectable items (24 unique) |
| 2A | 3 | '2A' (no week label) | 'Bicep' / 'Bicep' | ISO_BICEP | 'CHOOSE 👇' | no column | no column | no column | `AS7:AS42` 'BICEP' - 14 selectable items |
| 2A | 4 | '2A' (no week label) | 'Chest/Shoulders' / 'Vertical Push' | RP_VPUSH | 'CHOOSE 👇' | no column | no column | no column | `AA7:AA122` 'VERTICAL PUSH' - 20 selectable items (19 unique) |
| 2A | 5 | '2A' (no week label) | 'Cardio' / (blank) | COND_AEROBIC | 'CHOOSE 👇' | no column | no column | no column | `B7:B335` 'CARDIO' - 43 selectable items (34 unique); full range incl. 'DISTANCE' 200m-1000m and 'CALORIES' 10-50 cals (buy-out style options) |
| 3A | 1 | '3A' (no week label) | 'Back ' / 'Vertical Pull' | RP_VPULL | 'CHOOSE 👇' | no column | no column | no column | `U7:U122` 'VERTICAL PULL' - 20 selectable items |
| 3A | 2 | '3A' (no week label) | 'Quads/Glutes' / 'Unilateral KD' | RP_UKD | 'CHOOSE 👇' | no column | no column | no column | `AL7:AL42` 'UNILATERAL KNEE DOMINANT' - 13 selectable items |
| 3A | 3 | '3A' (no week label) | 'Cardio' / (blank) | COND_AEROBIC | 'CHOOSE 👇' | no column | no column | no column | `B7:B122` 'CARDIO' - 29 selectable items (20 unique); TRUNCATED range: excludes 'DISTANCE' 200m-1000m and 'CALORIES' 10-50 cals blocks |
| 3A | 4 | '3A' (no week label) | 'Tricep' / 'Tricep' | ISO_TRICEP | 'CHOOSE 👇' | no column | no column | no column | `AT7:AT42` 'TRICEP' - 9 selectable items |
| 3A | 5 | '3A' (no week label) | 'Shoulders/Traps' / 'ABdution' | ISO_SIDE_REAR_DELT/side | 'CHOOSE 👇' | no column | no column | no column | `AH7:AH42` 'SIDE RAISES' - 12 selectable items; side-delt (abduction / lateral raise); 6 of 12 items are side raises; 3 are front raises; 3 are reverse flies - the label asks for a side raise |
| 1B | 1 | '1B' (no week label) | 'Quads' / 'Bilateral KD' | RP_BKD | 'CHOOSE 👇' | no column | no column | no column | `AI7:AI122` 'BILATERAL KNEE DOMINANT' - 35 selectable items (33 unique) |
| 1B | 2 | '1B' (no week label) | 'Back' / 'Horizontal Pull' | RP_HPULL | 'CHOOSE 👇' | no column | no column | no column | `X7:X162` 'HORIZONTAL PULL' - 16 selectable items |
| 1B | 3 | '1B' (no week label) | 'Hamstring/Glutes' / 'Unilateral HD' | RP_UHD | 'CHOOSE 👇' | no column | no column | no column | `AQ7:AQ42` 'UNILATERAL HIP DOMINANT' - 8 selectable items |
| 1B | 4 | '1B' (no week label) | 'Core' / (blank) | CORE_OTHER | 'CHOOSE 👇' | no column | no column | no column | `O7:O283` 'CORE THORAX' (+ 'CORE PELVIS' block) - 17 selectable items; menu = CORE THORAX (sagittal/frontal/transverse) + CORE PELVIS blocks |
| 1B | 5 | '1B' (no week label) | 'Cardio' / (blank) | COND_AEROBIC | 'CHOOSE 👇' | no column | no column | no column | `B7:B335` 'CARDIO' - 43 selectable items (34 unique); full range incl. 'DISTANCE' 200m-1000m and 'CALORIES' 10-50 cals (buy-out style options) |
| 2B | 1 | '2B' (no week label) | 'Hamstring' / 'Bilateral HD' | RP_BHD | 'CHOOSE 👇' | no column | no column | no column | `AN7:AN122` 'BILATERAL HIP DOMNANT' - 33 selectable items (32 unique) |
| 2B | 2 | '2B' (no week label) | 'Chest' / 'Horizontal Push' | RP_HPUSH | 'CHOOSE 👇' | no column | no column | no column | `AD7:AD162` 'HORIZONTAL PUSH' - 25 selectable items (24 unique) |
| 2B | 3 | '2B' (no week label) | 'Bicep' / 'Bicep' | ISO_BICEP | 'CHOOSE 👇' | no column | no column | no column | `AS7:AS42` 'BICEP' - 14 selectable items |
| 2B | 4 | '2B' (no week label) | 'Chest/Shoulders' / 'Vertical Push' | RP_VPUSH | 'CHOOSE 👇' | no column | no column | no column | `AA7:AA122` 'VERTICAL PUSH' - 20 selectable items (19 unique) |
| 2B | 5 | '2B' (no week label) | 'Cardio' / (blank) | COND_AEROBIC | 'CHOOSE 👇' | no column | no column | no column | `B7:B335` 'CARDIO' - 43 selectable items (34 unique); full range incl. 'DISTANCE' 200m-1000m and 'CALORIES' 10-50 cals (buy-out style options) |
| 3B | 1 | '3B' (no week label) | 'Back ' / 'Vertical Pull' | RP_VPULL | 'CHOOSE 👇' | no column | no column | no column | `U7:U122` 'VERTICAL PULL' - 20 selectable items |
| 3B | 2 | '3B' (no week label) | 'Quads/Glutes' / 'Unilateral KD' | RP_UKD | 'CHOOSE 👇' | no column | no column | no column | `AL7:AL42` 'UNILATERAL KNEE DOMINANT' - 13 selectable items |
| 3B | 3 | '3B' (no week label) | 'Cardio' / (blank) | COND_AEROBIC | 'CHOOSE 👇' | no column | no column | no column | `B7:B122` 'CARDIO' - 29 selectable items (20 unique); TRUNCATED range: excludes 'DISTANCE' 200m-1000m and 'CALORIES' 10-50 cals blocks |
| 3B | 4 | '3B' (no week label) | 'Tricep' / 'Tricep' | ISO_TRICEP | 'CHOOSE 👇' | no column | no column | no column | `AT7:AT42` 'TRICEP' - 9 selectable items |
| 3B | 5 | '3B' (no week label) | 'Shoulders/Traps' / 'ABdution' | ISO_SIDE_REAR_DELT/side | 'CHOOSE 👇' | no column | no column | no column | `AH7:AH42` 'SIDE RAISES' - 12 selectable items; side-delt (abduction / lateral raise); 6 of 12 items are side raises; 3 are front raises; 3 are reverse flies - the label asks for a side raise |

### 3.3 Rules visible in the layout
1. **5 slots per session, 3 session types:**
   - **1A** = 'Bilateral KD' -> 'Horizontal Pull' -> 'Unilateral HD' -> 'Core' -> 'Cardio'. These are Bootcamp 1's A-day slots 1-3, followed by core and cardio.
   - **2A** = 'Bilateral HD' -> 'Horizontal Push' -> 'Bicep' -> 'Vertical Push' -> 'Cardio'.
   - **3A** = 'Vertical Pull' -> 'Unilateral KD' -> **'Cardio'** -> 'Tricep' -> 'ABdution'.
2. **Coverage:** each A-cycle contains all 8 primary patterns exactly once, plus biceps, triceps, lateral raise, 1 core and 3 cardio. Relative to Bootcamp 1's A+B days, it drops 'Calves', 'Leg Extensions' and 'Leg Curls', both Focus slots and the accessory days. It adds 'Core' to a lifting day and 'Cardio' to every session.
3. **Pairings:**
   - 1A keeps Bootcamp 1's opposite-dominance lower pair (BKD + UHD) and adds a pull.
   - 2A carries **both presses**, with 'Bicep' between them. 3A carries the vertical pull and then 'Tricep'. Arms are placed next to the **antagonist** pattern; PPL places them with the synergist.
   - *INFERRED:* curls between two presses let the pressing muscles recover, which suits circuit flow.
4. **Order:** every session opens with its biggest multi-joint pattern ('Bilateral KD', 'Bilateral HD', 'Vertical Pull'). Cardio closes 1A and 2A but sits **in the middle** of 3A, splitting the resistance work.
5. **Cardio dropdowns differ by session:** 1A, 2A, 1B and 2B use `B7:B335`, which includes '200m'-'1000m' and '10 cals'-'50 cals'. 3A and 3B use the truncated `B7:B122` (intervals and tests only).
6. **Core:** 1A and 1B only, wired to `O7:O283` (thorax or pelvis is the client's choice).

### 3.4 Quantitative volume

Sessions:

| Session | Exercises (slots) | Resistance/core/focus slots | Cardio slots | Sets as written | Sets @3 (assumed) | Sets coach-default (assumed) |
|---|---|---|---|---|---|---|
| 1A | 5 | 4 | 1 | 0 (all 'CHOOSE 👇' or no column) | 12 | 11 |
| 2A | 5 | 4 | 1 | 0 (all 'CHOOSE 👇' or no column) | 12 | 11 |
| 3A | 5 | 4 | 1 | 0 (all 'CHOOSE 👇' or no column) | 12 | 10 |
| 1B | 5 | 4 | 1 | 0 (all 'CHOOSE 👇' or no column) | 12 | 11 |
| 2B | 5 | 4 | 1 | 0 (all 'CHOOSE 👇' or no column) | 12 | 11 |
| 3B | 5 | 4 | 1 | 0 (all 'CHOOSE 👇' or no column) | 12 | 10 |

Weekly slots and sets by canonical bucket:

| Bucket | 6_sessions_1A-3B slots/wk (OBSERVED) | 3_sessions_A_only slots/wk (OBSERVED) | 6_sessions_1A-3B sets/wk @3 (assumed) | 3_sessions_A_only sets/wk @3 (assumed) | 6_sessions_1A-3B sets/wk coach-default (assumed) | 3_sessions_A_only sets/wk coach-default (assumed) |
|---|---|---|---|---|---|---|
| RP_BKD | 2 | 1 | 6 | 3 | 6 | 3 |
| RP_BHD | 2 | 1 | 6 | 3 | 6 | 3 |
| RP_UKD | 2 | 1 | 6 | 3 | 6 | 3 |
| RP_UHD | 2 | 1 | 6 | 3 | 6 | 3 |
| RP_HPUSH | 2 | 1 | 6 | 3 | 6 | 3 |
| RP_VPUSH | 2 | 1 | 6 | 3 | 6 | 3 |
| RP_HPULL | 2 | 1 | 6 | 3 | 6 | 3 |
| RP_VPULL | 2 | 1 | 6 | 3 | 6 | 3 |
| ISO_SIDE_REAR_DELT | 2 | 1 | 6 | 3 | 4 | 2 |
| ISO_BICEP | 2 | 1 | 6 | 3 | 4 | 2 |
| ISO_TRICEP | 2 | 1 | 6 | 3 | 4 | 2 |
| CORE_OTHER | 2 | 1 | 6 | 3 | 4 | 2 |
| COND_AEROBIC | 6 | 3 | 0 | 0 | 0 | 0 |
| **TOTAL** | 30 | 15 | 72 | 36 | 64 | 32 |

Buckets with **0** slots in every variant: AP_PLYO, AP_JUMP_LIMITED_KNEE, AP_THROW, AP_COD, AP_SPRINT, AP_TRIPLE_EXT, ISO_QUAD, ISO_HAM, ISO_CHEST, ISO_CALF, CT_CORE_THORAX, CP_CORE_PELVIS, COND_SPRINT_BUYOUT, FOCUS, FUNCTIONAL.

Weekly sets by muscle:

| Muscle | 6_sessions_1A-3B credits/wk (sets=1 per slot) | 3_sessions_A_only credits/wk (sets=1 per slot) | 6_sessions_1A-3B @3 sets (assumed) | 3_sessions_A_only @3 sets (assumed) | 6_sessions_1A-3B coach-default (assumed) | 3_sessions_A_only coach-default (assumed) | 6_sessions_1A-3B: sets/slot to reach 15 / 20 | 3_sessions_A_only: sets/slot to reach 15 / 20 |
|---|---|---|---|---|---|---|---|---|
| quads | 4 | 2 | 12 | 6 | 12 | 6 | 3.8 / 5.0 | 7.5 / 10.0 |
| glutes | 7 | 3.5 | 21 | 10.5 | 21 | 10.5 | 2.1 / 2.9 | 4.3 / 5.7 |
| hamstrings | 4 | 2 | 12 | 6 | 12 | 6 | 3.8 / 5.0 | 7.5 / 10.0 |
| chest | 3 | 1.5 | 9 | 4.5 | 9 | 4.5 | 5.0 / 6.7 | 10.0 / 13.3 (exceeds 8-set dropdown max) |
| lats/upper back | 4 | 2 | 12 | 6 | 12 | 6 | 3.8 / 5.0 | 7.5 / 10.0 |
| front delts | 3 | 1.5 | 9 | 4.5 | 9 | 4.5 | 5.0 / 6.7 | 10.0 / 13.3 (exceeds 8-set dropdown max) |
| side delts | 3 | 1.5 | 9 | 4.5 | 7 | 3.5 | 5.0 / 6.7 | 10.0 / 13.3 (exceeds 8-set dropdown max) |
| rear delts | 1 | 0.5 | 3 | 1.5 | 3 | 1.5 | 15.0 / 20.0 (exceeds 8-set dropdown max) | 30.0 / 40.0 (exceeds 8-set dropdown max) |
| biceps | 4 | 2 | 12 | 6 | 10 | 5 | 3.8 / 5.0 | 7.5 / 10.0 |
| triceps | 4 | 2 | 12 | 6 | 10 | 5 | 3.8 / 5.0 | 7.5 / 10.0 |
| calves | 0 | 0 | 0 | 0 | 0 | 0 | no slot | no slot |
| abs/obliques | 2 | 1 | 6 | 3 | 4 | 2 | 7.5 / 10.0 | 15.0 / 20.0 (exceeds 8-set dropdown max) |

Reading the numbers:
- **Exercises per session:** 5 (4 set-bearing + 1 cardio). **Sets per session:** 12 at 3 per slot (10-11 coach-default), plus 1 cardio bout.
- **Weekly:** 72 sets (6 sessions) or 36 (3 sessions) at 3 per slot, plus 6 or 3 cardio bouts. Every primary pattern is trained 2x per week, the same as Bootcamp 1.
- **Muscle level (6 sessions at 3 per slot):** glutes 21; quads, hams, lats, biceps and triceps 12; chest and front/side delts 9; abs 6; rear delts 3; calves 0. That is about 85 % of Bootcamp 1's 4-day resistance volume (72 vs 84 sets) spread over 6 shorter sessions with 3x the cardio.

### 3.5 Reps, intensity, rest, tempo
- No dosing columns of any kind (OBSERVED). Reps, effort, rest and tempo are entirely unspecified. *INFERRED:* either the coach doses these on the floor (group class), or the tab is unfinished. Use the Bootcamp 1 / fat-burn conventions until the coach says otherwise.

### 3.6 Progression
- None. There are no week labels, and the A/B duplication only allows different exercise choices for the same slot.

### 3.7 What this reveals (INFERRED)
- The same pattern grid can be redistributed into short, frequent sessions without losing coverage. The coach's invariant is **"every primary pattern 2x/week"**, while session length and the amount of isolation flex with the format.
- Isolation for legs and calves is the first thing cut when sessions shrink. Biceps, triceps and lateral raises survive (1 each per cycle).
- Cardio frequency, not resistance volume, is what separates the two bootcamp options.

---

## 4. Side-by-side comparison

| Metric (per week) | PPL 6-day | PPL 3-day (inferred) | Bootcamp 1, 4 days | Bootcamp 1 + Wed/Sat | Bootcamp 2, 6 sessions | Bootcamp 2, 3 sessions (inferred) |
|---|---|---|---|---|---|---|
| Sessions | 6 | 3 | 4 | 6 | 6 | 3 |
| Slots per session | 7 | 7 | 7 | 7 / 5 | 5 | 5 |
| Total slots | 42 | 21 | 28 | 38 | 30 | 15 |
| RP (multi-joint) slots | 22 | 11 | 16 | 16 | 16 | 8 |
| ISO slots | 18 | 9 | 12 | 14 | 6 | 3 |
| Core / Cardio / Focus slots | 0 / 0 / 2 | 0 / 0 / 1 | 0 / 0 / 0 | 2 / 2 / 4 | 2 / 6 / 0 | 1 / 3 / 0 |
| Frequency of each of the 8 primary patterns | HPush 6 (incl. 'Incline', 'Dips'), HPull 4, others 2 | half | 2 each | 2 each | 2 each | 1 each |
| Upper RP : lower RP | 14 : 8 | 7 : 4 | 8 : 8 | 8 : 8 | 8 : 8 | 4 : 4 |
| Weekly sets at 3 per slot | 126 | 63 | 84 | 108 | 72 | 36 |
| Weekly sets coach-default | 106 | 53 | 74 | 92 | 64 | 32 |
| Tracking columns | SETS, REPS | same | SETS, REPS, WEIGHT/SCORE, EFFORT, HOW IT FELT?, DONE? | same | none | none |

**Ordering rules shared by all three (OBSERVED):**
1. Multi-joint before single-joint. The only exceptions are PPL 'Dips' after 'Flies', and 'Unilateral HD' after 'Leg Curls'.
2. Bilateral lower-body patterns come before unilateral ones on the same day.
3. A day's first slot is its heaviest multi-joint pattern.
4. Optional or flex items ('Focus', 'Core', 'Cardio') go at the end. The exception is Bootcamp 2's 3A mid-session cardio.
5. No athletic-pattern bucket (AP_*) appears anywhere in these three tabs. They are the coach's non-athlete templates. The athlete-type volume dial (plyos for basketball, fewer for boxers) lives in 'ATHLETIC - FULL BODY - 4 DAYS A' and 'JUSTICE LEAGUE', not here.

---

## 5. Progression toolkit for the generator

**Observed anchors (cross-reference):**

| Source | Axis | Numbers |
|---|---|---|
| MASTER_MODEL 'EXAMPLE PUSHPULLLEGS SPLIT' | level | working sets per cycle 47 -> 58 -> 66 (+23.4 %, +13.8 %); compounds 3x15 -> 3-4x10 -> 4x8; arm and leg isolation stays 3x20; calves 'MAX REPS' |
| MASTER_MODEL 'EXAMPLE FAT BURNBODY TONING PRO' | week (4 wk) | weekly sets 60 -> 60 -> 64 -> 70 (+0, +6.7, +9.4 %); compound reps trend down (upper-body presses/pulls 10-12 -> 8); isolation reps 15 -> 40; circuits 3x30 s -> 5x50 s |
| BYOP 'AESTHETICS - FULL BODY - 4 DAYS' (filled cells) | default dose | compounds 3 sets ('15 Reps' or '8 to 12 Reps'); curls and leg ext 2 x '20 Reps'; calves 3 x '15 Reps'; one strength slot 'DB Push press' 5 x '6 to 8 Reps' |

**The coach's stated rule applied to these templates (INFERRED illustration, not in the sheets):** weekly sets per muscle compounding at 3 / 5 / 7 % per week.

| Start (sets/wk) | Rate | Wk 1 | Wk 2 | Wk 3 | Wk 4 | Wk 6 | Wk 8 | Wk 12 |
|---|---|---|---|---|---|---|---|---|
| 15 | 3 % | 15.0 | 15.5 | 15.9 | 16.4 | 17.4 | 18.4 | 20.8 |
| 15 | 5 % | 15.0 | 15.8 | 16.5 | 17.4 | 19.1 | 21.1 | 25.7 |
| 15 | 7 % | 15.0 | 16.1 | 17.2 | 18.4 | 21.0 | 24.1 | 31.6 |
| 18 | 3 % | 18.0 | 18.5 | 19.1 | 19.7 | 20.9 | 22.1 | 24.9 |
| 18 | 5 % | 18.0 | 18.9 | 19.8 | 20.8 | 23.0 | 25.3 | 30.8 |
| 18 | 7 % | 18.0 | 19.3 | 20.6 | 22.1 | 25.2 | 28.9 | 37.9 |
| 20 | 3 % | 20.0 | 20.6 | 21.2 | 21.9 | 23.2 | 24.6 | 27.7 |
| 20 | 5 % | 20.0 | 21.0 | 22.1 | 23.2 | 25.5 | 28.1 | 34.2 |
| 20 | 7 % | 20.0 | 21.4 | 22.9 | 24.5 | 28.1 | 32.1 | 42.1 |

Implications for these slot skeletons (INFERRED):
- Sets are integers and are added per slot, not per muscle. A muscle at about 18 sets/wk gains roughly 0.5 set/wk at 3 %, 0.9 at 5 % and 1.3 at 7 %. That means +1 set on one of its slots every second week (3 %) or every week (5-7 %).
- In PPL 6-day, one extra set on a chest slot adds 1.0 chest set per occurrence (2 per week, because the slot runs twice).
- 12-week blocks at 5-7 % overshoot 30 sets/muscle/week. A 12-week generator needs a reset or deload (e.g. every 4 weeks, as the fat-burn example's 4-week block suggests) or must alternate accumulation and maintenance weeks.
- The fat-burn example shows the coach also progresses by changing reps without adding sets (week 2) and by raising isolation reps toward 40 ('MYO SET'-like) late in the block.

---

## 6. Data-quality flags (OBSERVED)

- BOOTCAMP 2 `A1` = 'BOOTCAMP OPTION 1' (wrong title). Its `A3:A32` WEEK cells are empty. Merged `F33:F37` has no header.
- BOOTCAMP 1 `E30` = 'Leg extensions' (lower-case e). The only list item is 'Leg Extensions' (`AM9`), so Sheets flags the value as invalid. It is the only pre-filled exercise in the three tabs.
- Cardio ranges are truncated:
  - BOOTCAMP 1 `E19` and `E40`, and BOOTCAMP 2 `E15` and `E30`, use `B7:B122`, which cuts off 'DISTANCE' '200m'-'1000m' and 'CALORIES' '10 cals'-'50 cals'.
  - BOOTCAMP 2 `E7`, `E12`, `E22` and `E27` use the full `B7:B335`.
  - The 'DISTANCE TEST' block is duplicated in the library (B24-B33 and B89-B98), so 18 entries show where 9 are unique.
- Label inconsistencies:
  - PPL day names are mixed case ('MONDAY' vs 'Thursday').
  - 'Back ' has a trailing space on every 'Vertical Pull' row.
  - The 'Tricep' slot has a blank CATEGORY in BOOTCAMP 1 (`D15`, `D36`) but 'Tricep' in BOOTCAMP 2.
  - PPL calls column D 'DETAIL'.
  - BOOTCAMP 1 `D45` (merged D45:D51) is empty where every other Sunday cell says 'OFF'.
- Dropdown leniency:
  - Every range starts at the 'CHOOSE 👇' row and spans the block separators, so 'FOUNDATIONAL', 'MODERATE', 'ADVANCED', 'UNILATERAL', 'CORE PELVIS', the 'QUADS 👇' style focus headers and 'SUPERSET W/ 👇' (in SETS) can all be picked as values.
  - 'Flies', 'Incline' and 'Dips' are only conventions on the shared `AD7:AD162` list. A client can put 'Barbell bench Press' in the 'Flies' slot.
  - "Compound" slots can hold isolation: 'Bilateral KD' (`AI`) lists 'Leg Extension Machine' three times plus thrusters, and 'Bilateral HD' (`AN`) lists 'Leg Curl Machine', 'Machine Leg Curls', 'Nordic Curl' and hamstring curls.
- Leftover conditional formats (green on "TRUE") in PPL and BOOTCAMP 2, where no TRUE value or checkbox exists.
- Exhaustive slot-to-range wiring for these tabs matches `analysis/library/L4_slot_wiring.md`. No miswired slot exists in these three tabs; the `AR7:AR42` miswire is only in the hidden NO ACCESS tabs.

---

## 7. Open questions for the coach

1. **PPL 3-day:** which three days, and is it one Push/Pull/Legs pass per week (each muscle 1x)? If so, should sets per slot roughly double (3-4) compared with the 6-day version (about 2)?
2. **PPL:** there are no calf, core or cardio slots. Is 'Focus 1' on legs day meant for calves/abs, or should the generator add a calf/core slot?
3. **PPL:** are side raises and reverse flies deliberately on the **pull** day? Your MASTER_MODEL example puts side raises on push day. Is 'Dips' after 'Flies' deliberate (finisher or pre-exhaust)?
4. **Bootcamp 1:** are WEDNESDAY and SATURDAY optional (the title says 4 days)? How many sets go on the Focus slots?
5. **Bootcamp 1:** do you want slots 1+2 and 3+4 run as supersets or stations (lower/upper alternation)? Should the generator write 'SUPERSET W/ 👇' there?
6. **Bootcamp 2:** is it 6 sessions per week (1A-3B, Sunday off), or 3 per week alternating A and B weeks? Should 1B-3B use different exercises from 1A-3A?
7. **Bootcamp 2:** why is 'Cardio' in the middle of 3A/3B, and why does that cardio dropdown exclude the 200m-1000m and calorie options?
8. **Bootcamp 2:** it has no sets/reps/effort columns. What is the default dose: straight sets like Bootcamp 1, or timed circuits like your fat-burn example (3-5 rounds x 30-50 s)?
9. **Default sets per slot** for each template and level. Is "3 sets on compounds, 2 on isolation" (as in AESTHETICS) the rule?
10. **The 3/5/7 % ramp:** does the size of the increment follow muscle size (e.g. small muscles 7 %, big muscles 3 %), or the reverse? Is it applied to weekly sets or to load? After how many weeks do you deload or reset?
11. **EFFORT:** is '8 - That was perfect' the target for everyone? Do novices aim lower? What does a '9 - That was terrible' or a 'Felt a PAIN' entry trigger (cut sets, swap within the same library column, or drop a level)?
12. **'Core' slot:** should the generator alternate CORE THORAX and CORE PELVIS (e.g. 1A thorax, 1B pelvis), or let the client pick freely?
13. **Bootcamp volume:** lower body and glutes get about 2x the effective volume of chest and rear delts. Is that the intended emphasis for bootcamp clients?
14. Should the hidden template columns (Bootcamp 1 rows 52-65, Bootcamp 2 F column) be extended into Weeks 2-6/8/12, with the progression written in?

---

## Appendix A. Every dropdown menu behind these slots (exhaustive, verbatim, in sheet order)

Block headers (selectable separators in the dropdown) are shown in backticks. Items keep their stray spaces. Note the `O7:O283` 'Core' menu: rows 8-91 are the 'CORE THORAX' blocks (FOUNDATIONAL r9: 'Plank'...'Knees to chest'; MODERATE r45: 'Side Plank '; ADVANCED r90: 'Woodchoppers', 'Cable Machine Oblique Rotations', 'Russian Twists'). Rows 124-209 are the 'CORE PELVIS' blocks (FOUNDATIONAL r126: 'Leg Raises', 'Reverse Crunches', 'V-ups', 'Hanging Rotational Knee/Leg Raises'; MODERATE r162: 'Side Planks ', 'Coppenhaggen Plank'; ADVANCED r207: 'Hanging rotational knees to chest').

#### `AA7:AA122` 'VERTICAL PUSH'
- block `FOUNDATIONAL` (row 8): 'Incline Seated DB Press', 'Incline Seated Barbell Press', 'DB Push press', 'Barbell push press', 'DB Push Jerk', 'Barbell Push Jerk'
- block `ADVANCED` (row 44): 'DB Z Press on floor', 'Barbell Z press on Floor ', 'Kneeling DB Press', 'Kneeling Barbell Press', 'Standing DB Press', 'Standing DB Press', 'Handstand Push ups', 'Pike Push Ups', 'DB Thrusters', 'Barbell Thrusters'
- block `UNILATERAL` (row 89): 'Sesaw Db Press', 'Alternating Db press', 'Kneeling Landmine Press', 'Single arm DB thrusters'

#### `AD7:AD162` 'HORIZONTAL PUSH'
- block `FOUNDATIONAL` (row 8): 'Cable Standing Chest Press', 'DB Press on floor', 'Kneeling Push Ups', 'Incline Push-ups', 'Bench Push ups', 'Machine bench press'
- block `MODERATE` (row 44): 'Incline Push-ups', 'Push Ups ', 'Bench DB Flies ', 'Cable flies', 'Machine flies'
- block `ADVANCED` (row 89): 'Incline DB Bench Press', 'Push ups (Feet on Wall)', 'Diamond Push ups', 'DB Bench Press', 'Barbell bench Press', 'Dips ', 'Weighted Dips ', 'Declined Pushups', 'Elevated Push ups (for full ROM)'
- block `UNILATERAL` (row 124): 'Alternating Incline DB Bench Press', 'Alternating Flat Bench Press', 'Alternating Db Floor Press', 'Alternating Cable Press', 'Push ups (1 hand Higher)'

#### `AH7:AH42` 'SIDE RAISES'
- (no block header): 'Seated Lateral Raises w/ DB ', 'Bent over DB Reverse flies', 'Lateral Raises w/ DB ', 'Front Raises w/ DB', 'Front Raises w/ Barbell', 'Inclined Cable Machine Side Raises', 'Seated DB Reverse Flies', 'DB Hammer Side/Front Raises', 'DB Side Raises Supinated Grip ', 'DB Front Raises Supinated Grip', 'Cable machine Leaning Side raises ', 'Machine reverse fliez'

#### `AI7:AI122` 'BILATERAL KNEE DOMINANT'
- block `FOUNDATIONAL` (row 8): 'Box. Zercher squat Touch and Go', 'Box. Goblet squat Touch and Go', 'Goblet KB/DB Squats', 'Bodyweight Squats', 'Box Squats', 'Squats with Foam Roller or Yoga Ball on the wall', 'Low DB Squats', 'Landmine Squats', 'Hex Bar Squats', 'Flipped Hex Bar Squats ', 'Sumo Squats w/ DB or KB ', 'Leg Extension Machine'
- block `MODERATE` (row 44): 'Front Squats', 'High Zercher DB Squats ', 'High Zercher Barbell Squats', 'High Bar Back Squat', 'Low Bar Back Squat', 'Double front rack kb squat', 'Hack Squat Machine ', 'Leg Extension Machine', 'Landmine Hack Squat '
- block `ADVANCED` (row 89): 'Box. Any Squat Touch and Go fast', 'Box. Any Squat Touch and Go (Banded)', 'Box. Any Squat Touch and Go (Reverse Banded)', 'Box. Any Squat Deload', 'Box. Squat Deload (banded)', 'Box. Any Squat Deload (reverse banded)', 'Hack Squats', 'Leg press', 'Pendulum Squat', 'Sissy Squats', 'Leg Extension Machine', 'DB thrusters', 'Barbell Thrusters', 'Single arm DB thruster'

#### `AL7:AL42` 'UNILATERAL KNEE DOMINANT'
- (no block header): 'Stationary Lunges', 'Reverse Lunges ', 'Forward  Lunges', 'Side Lunges', 'Pistol Squats ', 'Single Leg Get Ups', 'Front Foot Elevated Lunges (FFE)', 'Rear Foot Elevated Lunges (RFE)', 'Rear Foot Against Wall Lunges', 'Front Foot & Rear Foot Elevated Lunges (RFE & FFE)', 'Step ups (Forward & Side)', 'Elevated Reverse Lunge', 'Curtsy Lunges '

#### `AM7:AM9` 'LEG EXTENSIONS'
- (no block header): 'Leg Extensions'

#### `AN7:AN122` 'BILATERAL HIP DOMNANT'
- block `FOUNDATIONAL` (row 8): 'Glute Bridges', 'Elevated Feet on Bench Glute Bridges', 'Reverse Hyper Extension', 'Cable Pull Through', 'Single KB Deadlift', 'Double KB Deadlift', 'Leg Curl Machine', 'Sandbag Hip Thrusts', 'Harmstring MedBall Curls', 'Supine Glidder hamstring curls', 'swiss ball hamstring curls', 'KB swing'
- block `MODERATE` (row 44): 'DB Deadlifts', 'Hex Bar Deadlifts', 'GHD', 'Shoulder Wide Grip Deadlift', 'Medicine or Stability Ball Harmstring Curls', 'Hip Thrust Machine', 'Machine Good Mornings', 'DB Hip Thrusts', 'Machine Leg Curls (Seated and Laying Down)', 'Hyper extensions '
- block `ADVANCED` (row 89): 'Nordic Curl', 'Barbell Deadlifts', 'GHD', 'Sumo Deadlifts', 'Wide Grip Barbell Deadlift', 'Snatch Grip Barbell Deadlift', 'Barbell Goodmornings', 'Barbell Hip Thrusts', 'Stiff Leg Deadlift', 'Machine Leg Curls', 'DB Harmstring Curls'

#### `AQ7:AQ42` 'UNILATERAL HIP DOMINANT'
- block `FOUNDATIONAL` (row 8): 'SL Glute Bridges (foot on the ground)', 'SL Glute Bridges (foot on bench)', 'SL Hip thrusts', 'Staggered Stance DL w/ DB ', 'Alternating DB Deadlifts', 'Staggered Stance DL w/ Barbell', 'Alternating  Barbell Deadlifts', 'Camporini Deadlifts'

#### `AR7:AR10` 'LEG CURLS'
- (no block header): 'Seated leg curls', 'Lying Leg Curls'

#### `AS7:AS42` 'BICEP'
- (no block header): 'Ez Bar Curls', 'Reverse Ez Bar Curls', 'DB Curls', 'Cable Machine Curls (Zone1, Zone 2, Zone 3', 'Hammer Db Curls', 'Seated Db Bicep Curls', 'Incline Seated Db Curls (Variation, Pinky Facing up)', 'Seated DB Curls ', 'Spider Curls', 'Zottman Curls', 'TRX Bicep Curls', 'Crossbody DB Hammer Curls', 'Barbell Curls', 'DB Concentration Curls'

#### `AT7:AT42` 'TRICEP'
- (no block header): 'Straight bar pronated tricep extensions ', 'DB Kickbacks (Uni/Bi)', 'Overhead DB Tricep Extension', 'Floor DB Skullcrushers', 'Ez Bar Skullcrushers', 'Straight Bar Supinated Tricep Extensions ', 'Tate Press', 'Overhead cable tricep extension', 'Cable tricep push downs'

#### `AU7:AU13` 'CALVES'
- (no block header): 'Standing Calf raises (use deficit)', 'Standing DB calf Raises (Use Deficit)', 'Calf Raises w/ DB ', 'Calf Raises w/ Barbell', 'Machine Calf Raises'

#### `AV7:AV42` 'SETS'
- (no block header): '1.0', '2.0', '3.0', '4.0', '5.0', '6.0', '7.0', '8.0', 'SUPERSET W/ 👇' (row 16; pairing flag, selectable)

#### `AW7:AW42` 'REPS'
- (no block header): '4 to 6 Reps', '6 to 8 Reps', '8 to 12 Reps', '10 to 15 Reps', '15 Reps', '20 Reps', 'MYO SET'

#### `AX7:AX42` 'EFFORT'
- (no block header): '1 - Way Too Easy', '2 - Way Too Easy', '3 - Too Easy', '4 - Easy', '5 - Easyish', '6 - Broke a Sweat', '7 - That was tough', '8 - That was perfect', '9 - That was terrible', '10 - I'm done'

#### `AY7:AY42` 'FEELING' (shown as 'HOW IT FELT?')
- (no block header): 'Felt the RIGHT muscles', 'Felt the WRONG muscle', 'Felt a PAIN', 'Couldn't do it'

#### `AZ7:AZ335` 'FULL FOCUS LIST'
- block `QUADS 👇` (row 8): 'Goblet squats heels elevated', 'Leg press', 'Zercher squats', 'Back squats', 'Walking Lunges', 'Stationary Lunges', 'Bulgarian Split squats', 'Leg extensions'
- block `SHOULDERS/TRAPS 👇` (row 44): 'Bd overhead Press', 'barbell overhead press', 'High incline db press', 'Incline db press', 'Incline barbell press', 'DB side raises', 'Cable side raises', 'DB upright rows', 'Barbell upright rows'
- block `BACK 👇` (row 89): 'Pull ups', 'assisted pull ups', 'lat pull down', 'Db rows', 'Cable rows', 'machine rows'
- block `TRICEP 👇` (row 124): 'DB overhead tricep ext', 'cable tricep extensions', 'cable overhead tricep ext', 'dips', 'assisted dips'
- block `GLUTES 👇` (row 164): 'Single leg Glute bridge', 'Barbell hip thrust'
- block `HAMSTRINGS 👇` (row 204): 'DB deadlifts', 'Barbell deadlifts', 'Hyperextensions', 'Hip thrusts/ Glute bridges', 'Staggered stance DL', 'Foot on wall db DL', 'Leg curls', 'Lying leg curls'
- block `CHEST 👇` (row 244): 'Incline db press', 'bench press', 'db bench press', 'DB flies', 'Cable flies', 'Incline barbell press'
- block `CORE 👇` (row 284): 'Weighted situps', 'weighted decline situps', 'Weighted russian twists'
- block `BICEP 👇` (row 311): 'Incline bench bicep curls', 'supine bicep curls', 'cable bicep curls'
- block `CALVES 👇` (row 331): 'DB Standing calf raises'

#### `B7:B122` 'CARDIO'
- block `SPEED INTERVALS` (row 8): '2 min Fast - 1 min walk', '3 min Fast - 2 min walk', '4 min Fast - 3 min walk', '5 min fast - 2 min walk', '6 min fast - 1 min walk'
- block `DISTANCE INTERVALS` (row 14): '1 mile run - 1 min walk', '2 mile run - 2 min walk', '3 mile run - 3 min walk'
- block `DISTANCE TEST` (row 24): '1 Mile run', '3 mile run', '5 mile run', '8 mile run', '11 mile run', '14 mile run', '17 mile run', '20 mile run', '21.6 mile run'
- block `SPEED TEST` (row 44): 'Half a mile (800m)', '1 Mile Run for time', '3 Miles run for time'
- block `DISTANCE TEST` (row 89): '1 Mile run', '3 mile run', '5 mile run', '8 mile run', '11 mile run', '14 mile run', '17 mile run', '20 mile run', '21.6 mile run'

#### `B7:B335` 'CARDIO'
- block `SPEED INTERVALS` (row 8): '2 min Fast - 1 min walk', '3 min Fast - 2 min walk', '4 min Fast - 3 min walk', '5 min fast - 2 min walk', '6 min fast - 1 min walk'
- block `DISTANCE INTERVALS` (row 14): '1 mile run - 1 min walk', '2 mile run - 2 min walk', '3 mile run - 3 min walk'
- block `DISTANCE TEST` (row 24): '1 Mile run', '3 mile run', '5 mile run', '8 mile run', '11 mile run', '14 mile run', '17 mile run', '20 mile run', '21.6 mile run'
- block `SPEED TEST` (row 44): 'Half a mile (800m)', '1 Mile Run for time', '3 Miles run for time'
- block `DISTANCE TEST` (row 89): '1 Mile run', '3 mile run', '5 mile run', '8 mile run', '11 mile run', '14 mile run', '17 mile run', '20 mile run', '21.6 mile run'
- block `DISTANCE` (row 123): '200m', '400m', '600m', '800m', '1000m'
- block `CALORIES` (row 132): '10 cals', '15 cals', '20 cals', '25 cals', '30 cals', '35 cals', '40 cals', '45 cals', '50 cals'

#### `O7:O283` 'CORE THORAX' (+ 'CORE PELVIS' block)
- `CORE THORAX` (row 8) > block `FOUNDATIONAL` (row 9): 'Plank', 'Crunches', 'Sit ups', 'Weighted Situps', 'Toes to bar', 'Knees to chest'
- `CORE THORAX` (row 8) > block `MODERATE` (row 45): 'Side Plank '
- `CORE THORAX` (row 8) > block `ADVANCED` (row 90): 'Woodchoppers', 'Cable Machine Oblique Rotations', 'Russian Twists'
- `CORE PELVIS` (row 124) > block `FOUNDATIONAL` (row 126): 'Leg Raises', 'Reverse Crunches', 'V-ups', 'Hanging Rotational Knee/Leg Raises'
- `CORE PELVIS` (row 124) > block `MODERATE` (row 162): 'Side Planks ', 'Coppenhaggen Plank'
- `CORE PELVIS` (row 124) > block `ADVANCED` (row 207): 'Hanging rotational knees to chest'

#### `U7:U122` 'VERTICAL PULL'
- block `FOUNDATIONAL` (row 8): 'Lat Pulldown Wide Grip', 'Lat Pulldown Supinated Grip ', 'Lat Pulldown Pronated Grip', 'Lat Pulldown Wide Mag Grips', 'Lat Pulldowns w/ Cable Rope', 'Lat Pulldowns Close Grip', 'Assisted  Pull-Up w bands', 'Assisted  Pull-Up Machine Close Grip', 'Assisted Pull-Up Machine Pronated Grip  ', 'Assisted  Pull-Up Machine Supinated Grip', 'Seated Pull ups with Rings or TRX', 'KB Face Pulls '
- block `ADVANCED` (row 44): 'Stricted Pull-Up feet behind you', 'Stricted Pull-ups feet in front ', 'Strict Pull ups Knees in chest', 'Strict Pull ups L Sit', 'Chin Ups', 'Wide Grip Pull Ups', 'Weighted Pull ups '
- block `UNILATERAL` (row 89): 'Unilateral Lat Pulldowns '

#### `X7:X162` 'HORIZONTAL PULL'
- block `FOUNDATIONAL` (row 8): 'Machine Row Close Grip', 'Machine Row Supinated Grip', 'Machine Row Pronated Grips', 'TRX Rows', 'Inverted Rows'
- block `ADVANCED` (row 44): 'Bent Over Barbell Rows', 'Bent Over Barbell Rows Supinated Grip', 'Bent Over Rows Close Grip ', 'Bent Over Rows Pronated Grip', 'Seal Barbell Rows Supinated Grip', 'Seal Barbell Rows Pronated Grip ', 'Seal DB Rows Supinated Grip', 'Seal DB Rows Pronated Grip', 'Renegade Rows'
- block `UNILATERAL` (row 89): 'DB/ Kb Rows', 'Cable Machine UL Rows'

