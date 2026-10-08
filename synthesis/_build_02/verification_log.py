# -*- coding: utf-8 -*-
"""Verification log appended to the 02 deliverables (adversarial fact-check of 2026-10-08, read-only toward the sheets)."""

CATALOG_LOG = """## Verification log

Adversarial fact-check run on 2026-10-08 against `dumps/BYOP`, `dumps/MASTER_MODEL` and `analysis/`. Nothing in Google Sheets was touched. The fixes were made in the build scripts (`_build_02/*.py`, marked `[verification 2026-10-08]`), and every output was regenerated from them. Before any change, the unmodified pipeline was re-run and reproduced all four files byte for byte, so every difference between the old and new outputs comes from the fixes below.

### Numbers recomputed independently (python on the dumps, not on the decoders)

| check | result |
|---|---|
| Exercise cells in BYOP 'MASTER EXERCISE LIBRARY', excluding header rows 1-7, block words, 'CHOOSE' cells and the 7 cardio section titles | B-N 210, O-AH 172, AI-AU 161, AZ-BE 82 (51 focus items + 17 BC exercises + 14 headings). This equals the crosswalk rows from L1-L4 for that tab, and no library cell is missing. |
| Dropdown reach, rebuilt from the DATA VALIDATIONS of the 9 BYOP program tabs (25 column ranges) | 359 selectable and 29 library-but-not-selectable records. This matches `status` for all 901 records. |
| Level label of every BYOP placement, recomputed from the nearest block word above the cell (master stack) or from row 3 (level views) | 376 master-stack and 160 level-view placements, 0 wrong. The 12 cells under a 'UNILATERAL' block are correctly 'any'. |
| Alias `raw` text compared with the cited cell (3,901 aliases) | Before: 72 texts that differ from the cell, 1 citation of an empty cell (BASEBALL G75) and 3 date-coerced '5-10-5' cells. After: 6 differences, all of them explained: the three '5-10-5' cells (the sheet stores a date) and three BASEBALL cells where the URL sat in the middle of the text. |
| Crosswalk `raw` compared with the cited cell (4,009 rows + 185 non-exercise cells) | Before: 2 wrong cells (BASEBALL G75, which is empty, and J75, which holds 'Buy out') plus the 3 date-coerced '5-10-5' cells. After: only the 3 date-coerced cells. |
| NO ACCESS templates | 38 + 50 = 88 exercise dropdowns. They differ from AESTHETICS / ATHLETIC only at E12/E33 and E19/E46 (`AR7:AR42` instead of `AQ7:AQ42`), and 'Leg extensions' (E12) is the only pre-typed exercise. Both claims confirmed. |
| Coach opinions | ALL ABOUT SQUATS G35:I35 'LOVE IT', G37:I37 "I PERSONALLY DON'T LIKE IT", G39:I39 "DON'T LIKE IT", G41:I41 'LOVE IT' and B41:D41 'I HAVE NO IDEA' match the dump verbatim. 4 TRACKS W61:Y61 '2 sets LEG PRESS MYO - 15-5-5-5-5-5' (Z61 has '3 sets'). |
| Program usage | Front Squat 55 program aliases, Leg Press 34, DB Lateral Raise 43. 'SL RDL' is written literally in 22 cells, and the record holds 32 direct program cells (all spellings) plus 17 inside complexes. 'JM PRESS', 'Neutral grip lat pull down' and 'Pull under' have 16 cells each (4 TRACKS). |
| ALL ABOUT SQUATS dose tables (A13:F28) | Hypertrophy is 3-5 sets x 8-15 reps (1 RIR, RPE 8+, rest 1-2 min). Strength is 4-8 sets x 2-5 reps (1 RIR, RPE 8+, rest 3-6 min). Both match the notes. |
| FULL FOCUS LIST headers | AZ8, AZ44, AZ89, AZ124, AZ164, AZ204, AZ244, AZ284, AZ311, AZ331: 10 groups, as stated. |

### What was wrong and what changed

1. **The coach-label column used invented or corrected labels.** The section 2 table, headed 'coach label', showed 'TRIPLE EXTENSION' (the sheet says 'TRIPPLE EXTENSION'), 'BILATERAL HIP DOMINANT' (BYOP AN1 says 'BILATERAL HIP DOMNANT'), 'JUMPING ANKLE (limited knee)', 'DYNAMIC MEDBALL WARM-UP' (the sheet says 'DYNAMIC MEDBALL WARMUP DRILLS') and "CORE (THORAX + PELVIS 'BOTH')". It also showed two buckets the coach never named: 'SPEED / SPRINT (SSC ladder)' and 'ARM CARE / MOBILITY'. The table now has a separate 'coach label VERBATIM (cell)' column, SPRINT and ARMCARE are marked INFERRED buckets, and every JSON record gains `taxonomy.pattern_label_verbatim`.
2. **Wrong pattern code on 4 placeholders.** The empty BD 'POSTERIOR OBLIQUE SYSTEM' and BE 'LATERAL SUBSYSTEM' headings had the code AOS (anterior oblique). They are now POS and LSS (01 taxonomy nodes FN.POS and FN.LSS).
3. **Inferred levels labelled OBSERVED.** 43 tiered records had a level basis that said OBSERVED although no level word or colour supports it:
   - 22 RESISTANCE PATTERNS exercises said 'traffic-light colour', but the cell has no colour and the decoder guessed the level.
   - 17 anterior-oblique items took their level from BC fill colours, but column BC has no level word.
   - 4 Sheet23 G31:G35 items sit in a loose list below the grid, where the column header applies by position only.

   The specialty decoder had also copied BYOP levels onto reference tabs (e.g. ALL ABOUT SQUATS G35 leg press 'advanced', G37 hack squat 'intermediate'), and those copies were counted as independent evidence. Every reference placement now carries `evidence` (OBSERVED label / OBSERVED colour / COPIED / INFERRED). `level.basis` names the cell and the evidence. `cross_source_disagreement` compares BYOP levels with OBSERVED reference levels only. 'LEVEL DIFFERS BY SOURCE' drops from 10 to 5: Tuck Jumps, Goblet Squat, Inverted Row, Barbell Push Jerk and Barbell Push Press came only from inferred or copied levels. No primary level value changed.
4. **Program-observed rep ranges were wrong for 103 records.** The old code took the min and max of every number in the reps cells, mixing reps with seconds, minutes, calories, %1RM, set counts and per-side notation. Examples:
   - Deadlift '1-60' came from 'SEE -> 1' and '60-70%'.
   - JM Press '3-20' read the 3 in '3x8' as reps.
   - Copenhagen Raise '1-1' came from 'Accumulate 1 minutes on each side'.
   - Star Side Plank '1-30'.
   - '10/10' became '10-10'.

   The new values count true reps only ('10/10' = 10 per side, '3x8' = 8). Timed work is reported in seconds and max-rep sets are noted. Cardio doses are quoted as written ('15 cal', '10 min', '20/40'). The REPS-dropdown buckets were recomputed from the reps part only. 108 values changed in total, counting cardio.
5. **BASEBALL BLOCK 3 Week 1 Part E pointed at the wrong cells.** '1x 30 Sec Fast Run' was cited at G75 (an empty cell) and J75 (which holds 'Buy out'). The text is in E75 and I75. The cells are corrected, with `cell_corrected_from`, in the catalog and the crosswalk. Doses that were really the label 'Buy out' or the exercise text itself were removed from sets_raw / reps_raw.
6. **Weekly doses stamped on cardio rows.** The 4 TRACKS AESTHETICS weekly SETS/REPS (rows 32/33, e.g. 2 x 12) had also been copied onto the '30-40 mi slow/steady CARDIO' rows (E46:L46, E60:L60), which carry no sets or reps in the sheet. These 14 aliases no longer have doses.
7. **Alias raws that were not cell text:**
   - 44 CrossFit aliases read 'POWER: CLEAN' or 'SKILL: H.S./ DUBS', but the cell says 'CLEAN' or 'H.S./ DUBS'. `raw` is now the cell text, and the row label moves to `context_label` (complex names and ids are unchanged).
   - 15 ALL ABOUT BALLISTICS aliases carried text the decoder had joined from two cells. `raw` is now C11/C12/C13 verbatim, with the joined text kept as `composed_name`.
   - The Sheet23 M3 alias read 'datetime.datetime(2005, 5, 10, ...)'. It now reads '5-10-5', with the stored date noted in `raw_value_stored`.
8. **Leg-press note had a wrong dose and a misread layout.** It said "UPPER/LOWER & PPL 'Sqats or Leg Press' 2x12 -> 3x10 -> 4x8". PPL C40 is 2x8, not 2x12, and the three columns are the NOVICE / NEWBY / INTERMEDIATE level columns, not a week-to-week progression. The note is corrected, and repeated decoder notes were removed (36 records).
9. **'I HAVE NO IDEA' cells misnamed.** The WEIGHT RELEASERS opinion said the cells were "purpose, volume and who-needs-this". The headers are VOLUME (B34), DETAIL (C34) and WHO NEEDS THIS? (D34).
10. **Ambiguous cell references in the sprint flag.** The Max-Velocity Sprint flag cited 'I4/G128' without tabs. It now reads Sheet23 I4 / BYOP G128 and J11.
11. **Tier definitions contradicted the data.** T2 listed 'plyo box', yet low boxes are coded T0 (household step). T2 now reads 'high plyo box above knee height'.
12. **Evidence labels in sections 8 and 10 overstated.** The section 8 'effect' column is decoder biomechanics, now marked INFERRED. Section 10 had called the whole level field 'OBSERVED block labels / colours' and the flags 'OBSERVED facts'. Both rows are corrected, and the aliases and typical_rep_range rows now explain the new fields.

### Checked and left as is

- Status, dropdown wiring, BYOP level blocks, the 13 multi-level records and the duplicate-in-dropdown list (5.2) are all correct.
- 4 TRACKS / CONJUGATE doses taken from the colour-key rows 4-6 and the per-row B/C columns are consistent with the sheet.
- 'Superset - same reps' as reps_raw (19 BASEBALL aliases) is the coach's own dose text and stays as written.
- The 5.1 merges are labelled INFERRED. They are plausible but still need the coach's confirmation (open questions 1-3).
- SCIENCE notes were checked: accommodating resistance (bands lighten at the bottom, chains add load as they lift off the floor), reverse bands (assistance at the bottom), deficit / elevated ROM, the dead-stop vs touch-and-go stretch-shortening cycle, eccentric overload from weight releasers, and contralateral loading raising the adduction / internal-rotation demand on the stance hip. No errors found.
"""

NOEQ_LOG = """## Verification log

Adversarial fact-check run on 2026-10-08. The fixes are in `_build_02/noeq.py` and the catalog it reads, as listed in the `02_exercise_catalog.md` verification log.

- **Confirmed from the dumps:** the two NO ACCESS tabs hold 38 + 50 = 88 exercise dropdowns. They differ from AESTHETICS / ATHLETIC only at E12/E33 and E19/E46 (`AR7:AR42` instead of `AQ7:AQ42`), and 'Leg extensions' (E12) is the only pre-typed exercise. The non-machine leg-curl and leg-extension items the coach lists elsewhere are confirmed at RESISTANCE PATTERNS A40/A41, BYOP AN18/AN91 and BALLISTICS C46.
- **Rule 3 was wrong.** It called the Bilateral KD ADVANCED block barbell/machine-only. The block (AI91-AI104) contains 'Sissy Squats' (T0) and four T2 items: the DB box squats AI91/AI94, 'DB thrusters' and 'Single arm DB thruster'. The rule now lists them.
- **Rule 4 overstated the coach.** It turned his remark into a rule. EXAMPLE PUSHPULLLEGS SPLIT A7 says getting away from fixed grips 'usually' helps with joint pain. The rule now quotes the cell and labels the generator use as INFERRED.
- **Tier table contradicted the data.** T2 listed 'plyo box', yet low boxes and steps are coded T0. T2 now reads 'high plyo box (above knee height)'.
- **Inherited catalog fixes:** the corrected rep ranges and level evidence carry through to this file. Tier counts per slot did not change.
"""
