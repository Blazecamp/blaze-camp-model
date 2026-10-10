# The source sheets: what each tab contains and how it was used

The model started from two Google Sheets that coach Lalo Vera had built before this project: "BUILD YOUR OWN PROGRAM - BLAZE CAMP MODEL" (12 tabs) and "BLAZE CAMP MASTER MODEL" (22 tabs). The first holds his exercise library and the program templates that pick from it. The second holds worked programs and his "cheat sheet" tabs on squats, plyos, core, cardio and more. Both were exported once, as copies, and every tab was written out as text so it could be read cell by cell. This page lists every tab, says what is in it and how the model used it, and points to the files. The sheets are evidence of how he has written programs. They are not the final word: where a sheet and one of his answers disagree, the answer wins.

> **How to read this page.** **OBSERVED** means read from a cell, a colour or a dropdown. **INFERRED** means the team reasoned it. Labels in 'single quotes' are his own, copied exactly, typos included. Ids such as `CAT-07` point to his answers: no prefix is round 1, `R2-` is round 2, `R3-` is round 3.

## The rule

| # | Rule | Decided by |
|---|---|---|
| 1 | The MASTER EXERCISE LIBRARY tab in the BYOP workbook is the single source of truth for exercises. | CAT-07 |
| 2 | Every other tab is evidence: how he has ordered, dosed and progressed real programs. | Team method ([method.md](method.md)) |
| 3 | When a sheet and one of his answers disagree, the answer wins. | Team method, [ADR-047](../04-decisions/adr-047-authority-order-and-evidence-labels.md) |
| 4 | His sheets are never edited. Spelling is corrected in the model, not in the sheets. | FIX-04 |
| 5 | His labels are quoted exactly as he typed them. The model's own names use correct spelling. | FIX-04 |

## Why

**Why the library comes first.** He said so at the start: the library in the "BUILD YOUR OWN PROGRAM" sheet is the main thing to understand (conversation). When asked whether it is the single source of truth, he answered: "that's the single source of truth as far as I was able to take it so far." (CAT-07)

**Why the other tabs are only evidence.** The sheets contain things he did not intend. Three examples from round 1:

- Calves and rear delts had almost no direct sets in his templates. "It wasn't intentional." (VOL-17)
- One bootcamp tab paired the lifts the other way round. "Yeah, that was not intentional." (ORD-06)
- One tab's reps rose with level on one day and fell on the other. "That was probably a fill error or just a different program that I wrote" (PRG-06)

**Why the programs still matter.** He told the team to read them: "If you read the workouts you can understand them by their equipment usage." (conversation). The programs show the order of a session, how lifts are paired, and how sets and reps change from week to week.

## Where the files are

| Path | What it is |
|---|---|
| [raw/BYOP.xlsx](../../raw/BYOP.xlsx) | Excel export of "BUILD YOUR OWN PROGRAM - BLAZE CAMP MODEL" |
| [raw/MASTER_MODEL.xlsx](../../raw/MASTER_MODEL.xlsx) | Excel export of "BLAZE CAMP MASTER MODEL" |
| [dumps/BYOP/](../../dumps/BYOP/) | The 12 BYOP tabs as text: 2 files per tab, plus `INDEX.txt` |
| [dumps/MASTER_MODEL/](../../dumps/MASTER_MODEL/) | The 22 MASTER MODEL tabs as text: 2 files per tab, plus `INDEX.txt` |
| [dump.py](../../dump.py) | The script that writes the dumps from the two Excel files |
| [analysis/](../../analysis/) | The first-pass decode of every tab: notes (`.md`) and data (`.json`) |

### How to read a dump file

A **dump** is one tab written as plain text. Each tab has two files.

| File | Order | Best for |
|---|---|---|
| `NN_<tab name>.txt` | Row by row | Program tabs |
| `NN_<tab name>.columns.txt` | Column by column, top to bottom | The library, where each column is one list |

`NN` is the tab's position in the workbook, starting at 00. The top of each `.txt` file lists the tab's size, its merged cells, its dropdown sources and its links. After that comes one line per non-empty cell:

```
AI1 | 'BILATERAL KNEE DOMINANT' | bg=CCCCCC bold fg=theme1
AI3 | 'RP - BS - KNEE DOMINANT' | bg=FFD966 bold fg=theme1
AI8 | 'FOUNDATIONAL' | bg=FFD966 fg=theme1
AI11 | 'Goblet KB/DB Squats' | bg=FFD966 fg=theme1
```

The parts are: cell address, value, then formatting (`bg` is the fill colour, `fg` the text colour). A dropdown line looks like this:

```
D6 D27 -> type=list formula1="'MASTER EXERCISE LIBRARY'!$AL$7:$AL$42"
```

It means: the cells D6 and D27 of this program tab offer the list in library column AL, rows 7 to 42. A **dropdown** (Google Sheets calls it data validation) is a cell that only accepts a value from a list.

### Five things to know before reading the sheets

| Thing | What it means |
|---|---|
| Tab names are cut at 31 characters | Excel's limit. 'ATHLETIC - FULL BODY - 4 DAYS A' is "…4 DAYS A WEEK". The file names in `dumps/` are cut the same way |
| Some tabs are hidden | Hidden in the Google Sheet. The export and the dumps include them |
| Some dates are really reps | Google Sheets turned typed text such as `10/10` (10 reps each side) into a date. The model stores reps and drill names as text |
| Colours carry meaning | He colour-codes levels and categories. In the RESISTANCE PATTERNS tab, for example, green, yellow and red cells read as foundational, intermediate and advanced. This reading is INFERRED from the pattern: it matches the library's level for 48 of the 52 exercises that appear in both with a level |
| 'CHOOSE 👇' is a placeholder | It is the first option of every dropdown. A cell that still says it was never filled in |

## Workbook 1: "BUILD YOUR OWN PROGRAM - BLAZE CAMP MODEL" (BYOP)

BYOP is his program builder. Nine tabs are program templates. Three are the library and two copies of it. In a template, each row is a **slot**: a purpose (the muscle), a category (the movement pattern) and a dropdown that points at one column of the library.

| # | Tab (as exported) | In the Google Sheet | Cells | Dropdown rules | What it contains | How it was used |
|---|---|---|---|---|---|---|
| 00 | 'AESTHETICS - FULL BODY - 4 DAYS' | visible | 189 | 19 | A 4-day full-body template with optional days. Day 1 is filled in as a demo, Day 2 partly | The model's full-body aesthetics template. The filled day gave the first evidence of his default sets and reps |
| 01 | '3 DAY BUILDER' | visible | 145 | 15 | The 3-day version. Empty template | The 3-day aesthetics template |
| 02 | 'PUSHPULLLEGS - 3 or 6 DAYS A WK' | visible | 235 | 16 | Push, pull and legs days, 7 slots each. Empty template | The push/pull/legs template |
| 03 | 'ATHLETIC - FULL BODY - 4 DAYS A' | visible | 263 | 21 | The aesthetics skeleton with an athletic block in front: 'Plyo', 'Throwing', 'COD', 'Tripple Extension' | The athletic template. It shows the athletic work placed before the lifting |
| 04 | 'JUSTICE LEAGUE' | visible | 378 | 23 | The athletic template plus logbook columns ('WEIGHT USED or SCORE', 'EFFORT', 'HOW IT FELT?', 'DONE?') and his own picks for Monday | His picks show 2 sets per slot on athletic days. The name is retired (see below) |
| 05 | 'BOOTCAMP - OPTION 1' | visible | 290 | 21 | The 4-day skeleton re-paired, with the logbook columns | The bootcamp template. Its Tuesday and Friday pairing was a mistake (ORD-06) |
| 06 | 'BOOTCAMP - OPTION 2' | visible | 98 | 14 | Six short sessions (1A to 3B), 5 slots each, cardio in every session. No sets or reps columns | The bootcamp circuit format (PRG-03) |
| 07 | 'NO ACCESS - AESTHETICS - FB - 4' | **hidden** | 289 | 21 | A logbook copy of tab 00 | Showed the self-serve idea. One dropdown points at the wrong list |
| 08 | 'NO ACCESS - ATHLETIC - FB - 4 t' | **hidden** | 376 | 23 | A logbook copy of tab 03 | Same. The same dropdown is wrong here too |
| 09 | 'MASTER EXERCISE LIBRARY' | visible | 1,047 | 0 | The exercise library: one column per category, plus the dosing menus | The single source of truth for exercises (CAT-07). See the next section |
| 10 | 'Copy of MASTER EXERCISE LIBRARY' | visible | 644 | 0 | The library with one column per category and the side-by-side level columns removed | Compared cell by cell with tab 09. Adds nothing new |
| 11 | 'Copy of Copy of MASTER EXERCISE' | visible | 580 | 0 | A compact copy with the blank rows removed. It stops at row 44, so 7 advanced plyos are missing | Two edits appear only here: an added 'Barbell Incline Bench Press' and the label 'SPEED ENDURANCE TEST'. The catalog lists this tab as one source of the incline press |

"Cells" counts the non-empty cells. "Dropdown rules" counts the list rules in the tab; one rule can cover many cells.

Decode notes: [analysis/programs/prog_byop_aesthetics.md](../../analysis/programs/prog_byop_aesthetics.md), [prog_byop_ppl_bootcamp.md](../../analysis/programs/prog_byop_ppl_bootcamp.md), [prog_byop_athletic.md](../../analysis/programs/prog_byop_athletic.md).

### The MASTER EXERCISE LIBRARY, column by column

The library is 57 columns wide (A to BE) and 335 rows long. Each category has one main column. The program dropdowns read that column. Some categories also have side-by-side columns that repeat one level of the main list. Those repeats are for reading only: no dropdown uses them.

**The header rows.**

| Row | His label in column A | What the row holds | Examples |
|---|---|---|---|
| 1 | (none) | The category | 'BILATERAL KNEE DOMINANT', 'CORE THORAX' |
| 2 | (none) | 'FILL HERE' in near-white text. It marks the main column of a category, where new exercises are added (INFERRED) | |
| 3 | 'ZONE' | The level, or a short code for it | 'EASY', 'MODERATE', 'ADVANCED', 'RP - BS - KNEE DOMINANT' |
| 4 | 'PATTERN' | The family | 'CARDIO', 'ATHLETIC', 'CONTROL', 'RESISTANCE', 'FUNCTIONAL' |
| 5 | (none) | The sub-pattern: a plane for core, one side or two for lifts | 'CORE THORAX SAGITAL', 'BILATERAL', 'UNILATERAL' |
| 6 | 'PURPOSE' | The body region the category serves | 'QUADS', 'BACK', 'CHEST/FRONT DELTS' |
| 7 | (none) | 'CHOOSE 👇', the first option of every dropdown | |

Below row 7, a column that has levels stacks them in blocks. In the knee-dominant column, for example, FOUNDATIONAL starts at row 8, MODERATE at row 44 and ADVANCED at row 89.

**The columns.** Counts are from the decode notes: exercise cells in the main list for columns A to N and AI to AU, and unique names for O to AH.

| Columns | His category (row 1) | Family (row 4) | Entries | Decode notes |
|---|---|---|---|---|
| B | 'CARDIO' | CARDIO | 43 | [L1_notes.md](../../analysis/library/L1_notes.md) |
| C to F | 'TRIPPLE EXTENSION' | ATHLETIC | 33 | L1 |
| G to J | 'PLYOS' | ATHLETIC | 41 | L1 |
| K | 'THROWING' | ATHLETIC | 20 | L1 |
| L to N | 'CHANGE OF DIRECTION' | ATHLETIC | 9 | L1 |
| O to Q | 'CORE THORAX' | CONTROL | 10 | [L2_notes.md](../../analysis/library/L2_notes.md) |
| R to T | 'CORE PELVIS' | CONTROL | 7 | L2 |
| U to W | 'VERTICAL PULL' | RESISTANCE | 20 | L2 |
| X to Z | 'HORIZONTAL PULL' | RESISTANCE | 16 | L2 |
| AA to AC | 'VERTICAL PUSH' | RESISTANCE | 19 | L2 |
| AD to AG | 'HORIZONTAL PUSH' | RESISTANCE | 24 | L2 |
| AH | 'SIDE RAISES' | RESISTANCE | 12 | L2 |
| AI to AK | 'BILATERAL KNEE DOMINANT' | RESISTANCE | 35 | [L3_notes.md](../../analysis/library/L3_notes.md) |
| AL | 'UNILATERAL KNEE DOMINANT' | RESISTANCE | 13 | L3 |
| AM | 'LEG EXTENSIONS' | RESISTANCE | 1 | L3 |
| AN to AP | 'BILATERAL HIP DOMNANT' | RESISTANCE | 33 | L3 |
| AQ | 'UNILATERAL HIP DOMINANT' | RESISTANCE | 8 | L3 |
| AR | 'LEG CURLS' | RESISTANCE | 2 | L3 |
| AS | 'BICEP' | RESISTANCE | 14 | L3 |
| AT | 'TRICEP' | RESISTANCE | 9 | L3 |
| AU | 'CALVES' | RESISTANCE | 5 | L3 |
| AV to AY | 'SETS', 'REPS', 'EFFORT', 'FEELING' | (none) | The menus for the program columns | [L4_notes.md](../../analysis/library/L4_notes.md) |
| AZ | 'FULL FOCUS LIST' | (none) | 51 exercises under 10 muscle headers | L4 |
| BA, BB | 'CARRY', 'DRAGS' | (none) | Headers only, no exercises | L4 |
| BC to BE | 'FUNCTIONAL BIOMECHANICS SYSTEM' | FUNCTIONAL | Only the first of three systems has exercises | L4 |

**The dosing menus (AV to AY).** These are the options that the sets, reps, effort and feeling dropdowns offer in the program tabs.

| His menu | Options |
|---|---|
| 'SETS' | 1 to 8, and 'SUPERSET W/ 👇' |
| 'REPS' | '4 to 6 Reps', '6 to 8 Reps', '8 to 12 Reps', '10 to 15 Reps', '15 Reps', '20 Reps', 'MYO SET' |
| 'EFFORT' | A 1 to 10 scale, from '1 - Way Too Easy' through '8 - That was perfect' to "10 - I'm done" |
| 'FEELING' (shown as 'HOW IT FELT?') | 'Felt the RIGHT muscles', 'Felt the WRONG muscle', 'Felt a PAIN', "Couldn't do it" |

The 'EFFORT' and 'FEELING' menus feed the logbook columns of his program tabs. The tool does not take them as input: it asks nothing after the plan is built and keeps no log (R3-VOL-02, R3-VOL-04). See the table "What he later said about his own sheets".

**The focus list (AZ).** Its ten headers are 'QUADS', 'SHOULDERS/TRAPS', 'BACK', 'TRICEP', 'GLUTES', 'HAMSTRINGS', 'CHEST', 'CORE', 'BICEP' and 'CALVES', each followed by ' 👇' in the sheet. It feeds the 'Focus 1' and 'Focus 2' slots on the optional days of his templates. The team read those slots as his way of giving extra work to a chosen muscle (INFERRED). In round 3 he made the choice part of the intake: "There could be a main focus muscle 1 and a main focus muscle 2" (R3-SES-01). See [volume.md](../02-model/volume.md).

How the library became the model's catalog is explained on [exercise-library.md](../02-model/exercise-library.md).

## Workbook 2: "BLAZE CAMP MASTER MODEL" (MM)

This workbook has no dropdowns. Everything in it was typed by hand. It holds two kinds of tab: worked programs, and reference tabs that he uses as cheat sheets. Tabs he marked '(NOT DONE)' are unfinished, and several say 'UNDER CONSTRUCTION'.

### Program tabs

| # | Tab (as exported) | In the Google Sheet | Cells | What it contains | How it was used |
|---|---|---|---|---|---|
| 00 | 'EXAMPLE UPPERLOWER SPLIT' | **hidden** | 226 | A lower day and an upper day at three levels: 'NOVICE', 'NEWBY', 'INTERMEDIATE' | How dose changes by level. The levels became L1, L2, L3 (PRG-05). One day's rep pattern was probably a fill error (PRG-06) |
| 01 | 'EXAMPLE FAT BURNBODY TONING PRO' | visible | 366 | Four lifting days and two cardio days across 4 weeks, with circuits | Week-to-week set changes (60, 60, 64, 70 sets). The circuits are finishers (PRG-11) |
| 02 | 'BASEBALL' | visible | 3,630 | His most detailed program: season calendars, a legend, and 3 blocks of 8 weekly grids, 4 days a week | See the next table |
| 03 | 'Copy of BASEBALL' | visible | 3,630 | Identical to tab 02 except for the tab name | Not used |
| 04 | '(NOT DONE) 4 TRACKS PROGRAMMING' | visible | 1,351 | Three ongoing-training tracks: 'STRENGTH', 'AESTHETICS', 'HYBRID', in 8-week and 12-week grids | The clearest evidence in the sheets of how he had built 8 and 12-week plans. He later corrected the plan shapes (PER-01, R2-PER-03). The source of 'the work / the accessory / the nuance / the survival' (ORD-07) |
| 05 | 'EXAMPLE ATHLETIC FULL BODY SPLI' | visible | 361 | An athletic full-body split in three phases: starting, mid and advanced off-season | Jump and throw volume against lifting volume. His banner note 'Always go for 1-3 RIR' |
| 06 | 'EXAMPLE PUSHPULLLEGS SPLIT' | **hidden** | 283 | Push, pull and legs at three levels | Sets per cycle rise with level (47, 58, 66) |
| 07 | 'EXAMPLE BOXING 8 WEEK BUILD UP' | **hidden** | 432 | Four days a week, weeks 1-2 and weeks 3-8 | Pressing and arm work drop when punching volume is high. He confirmed it, but "don't completely cut it" (ATH-04) |
| 11 | 'EXAMPLE CROSSFIT SPLIT' | visible | 681 | A year plan for a CrossFit competitor: qualities by month at levels 1 to 4, and a class programming split | The class model and the yearly view. 'FULL TIME' is the competitor, 'HALF TIME' the class member (PRG-10) |
| 12 | '(NOT DONE) EXAMPLE CONJUGATE' | visible | 208 | An earlier draft of the 8-week strength track | Read with tab 04 |

**What the BASEBALL tab gave the model.**

| In the tab | What the model took from it | Later answer |
|---|---|---|
| Each day runs Part A athletic, Part B core, an optional Olympic piece, Part C main lift with an upper lift, Part D single-leg work with two isolations, Part E a short sprint 'Buy out' | The field-athlete day layout | Core moved to the very start: "we need all the core work to be done first" (ATH-11) |
| Knee-dominant lifts sit with pulls, hip-dominant lifts with pushes | The pairing rule | Confirmed (UNI-11, ORD-06) |
| A legend with 'VOL 1', 'VOL 2', 'VOL 3' rep ranges for compound lifts and small isolations | Rep ranges by muscle size | Confirmed and refined (VOL-11) |
| An Olympic ramp from 4 x 8 at 75 % to 4 x 4 at 90 % | The Olympic-lift progression | Kept for dumbbell, kettlebell and pull variants; full lifts use 3 to 5 reps (R2-ATH-05) |
| Three calendars for the season | Off-season, pre-season and in-season phases | "The calendar was just whatever I wrote on there." The same plan serves high school, college and pro (PRG-09) |

Decode notes: [prog_mm_gym.md](../../analysis/programs/prog_mm_gym.md), [prog_mm_athletic_boxing.md](../../analysis/programs/prog_mm_athletic_boxing.md), [prog_mm_baseball.md](../../analysis/programs/prog_mm_baseball.md), [prog_mm_crossfit_tracks.md](../../analysis/programs/prog_mm_crossfit_tracks.md).

### Reference tabs

| # | Tab (as exported) | In the Google Sheet | Cells | What it contains | How it was used |
|---|---|---|---|---|---|
| 08 | 'AEROBIC CAPACITY CHEAT SHEET' | visible | 239 | His colour system for cardio: Blue (short, hard), Green (moderate), Orange (long, easy). Work and rest times by level. A running warm-up | The cardio menu and its rule 'Never do the same color workout in the same week'. He later set how many sessions each kind of client gets, with a second easy Orange for aesthetics clients (ATH-07, R2-SES-06, R2-ATH-06) |
| 09 | 'Sheet25' | visible | 12 | A scratch note: four lower-body slot names, one of them 'LEG FLEXION' | Consistent with his answer that leg curls are their own segment (CAT-09) |
| 10 | 'ALL ABOUT SQUATS' | **hidden** | 162 | His most complete theory tab: the squat ladder 'from most front loaded to most back loaded', effort rules, set and rep menus, the 'MYO SET' definition, notes on bands and chains, machine notes | Levels from load position (CAT-04). Effort in reps in reserve (VOL-13). The band and chain notes are kept as an archive only: he uses no variable resistance (EQ-01, EQ-12) |
| 13 | '(NOT DONE) RESISTANCE PATTERNS ' | visible | 329 | A draft library organized by biomechanics: body region, pattern, one or two sides, plane. Lists of variables such as stance, range of motion and load position. 59 links | The idea that an exercise is a base pattern plus variables (INFERRED). The team built its proposal on it: change one detail between blocks. He approved that proposal (R2-LIB-01) |
| 14 | '(NOT DONE) ALL ABOUT BALLISTICS' | **hidden** | 201 | Ballistic purpose ('BE EXPLOSIVELY & FAST') against plyometric purpose ('BE REACTIVE & BOUNCY'). A four-phase force progression. A 'MEDBALL CHEAT SHEET' with 19 throws, 9 'SPECIALTIES' and 7 'CORE EXTRAS' | Plyometric against ballistic work (ATH-01, R2-ATH-02) and the Receive-Create stages (CAT-10, R2-ATH-03) |
| 15 | '(NOT DONE) ALL ABOUT OLYMPIC LI' | **hidden** | 29 | A teaching order, easy to hard, for cleans, jerks and snatches | The Olympic-lift progression (ATH-10) |
| 16 | 'AGILITYCOD PATTERNS' | **hidden** | 10 | Two definitions: agility is 'Reactive in nature', change of direction is 'Proactive in nature' | The definition of the COD category |
| 17 | 'CONTROL PATTERNSCORE' | **hidden** | 72 | A core grid: thorax, pelvis or both, by plane, dynamic or static | The core categories. He settled the rule in CAT-08 |
| 18 | 'Sheet23' | visible | 394 | An older, flat version of the library: one column per level and category | Helped with levels. It is an older draft, not the source of truth (CAT-07) |
| 19 | 'Sheet24' | visible | 45 | A half-marathon plan titled 'HALF MARATHON PROGRAM by CHRIS HINSHAW' | Used as it is, for the half marathon only (PRG-12). The plan is credited to someone else, not to Blaze Camp |
| 20 | '(NOT DONE) ALL ABOUT LUNGES' | visible | 33 | A three-variable way to describe a lunge: stance, load position, movement orientation | Part of the variation rules |
| 21 | '(NOT DONE) ATHLETIC PATTERNS EX' | visible | 5 | Only the four athletic category names | Confirms the athletic categories. No exercises |

Decode notes: [sheet23_notes.md](../../analysis/reference/sheet23_notes.md), [resistance_patterns_notes.md](../../analysis/reference/resistance_patterns_notes.md), [specialty_notes.md](../../analysis/reference/specialty_notes.md), and for equipment and order [analysis/equipment/](../../analysis/equipment/).

## What he later said about his own sheets

These are the places where his answers changed how a tab is read. The answer wins in every case.

| In the sheet | His answer | Id |
|---|---|---|
| 'ZONE' is used with several meanings | Zones are rotation biases from Dr. Pat Davidson's book. They do not apply to plyos. The plyo steps are a way of teaching, not a zone | CAT-10 |
| 'LEG CURLS', which the team had first read as hip-dominant work | Leg curls, Nordics and slider curls are a leg-flexion segment of their own, not hip dominant | CAT-09 |
| 'JUSTICE LEAGUE' as a program name | "This was just a marketing name". It is a program for non-competitive, all-around athletic people. Names must be plain: "no one's going to know what Justice League means." | ATH-13, FIX-03 |
| 'NO ACCESS' on two hidden tabs | A self-serve version without coach access, using the full gym library | R2-LIB-08 |
| Logbook columns ('WEIGHT USED or SCORE', 'EFFORT', 'HOW IT FELT?', 'DONE?') | The tool keeps no log and asks nothing after the plan is built. People track on their own: "They should be tracking it themselves, however they want to track it" | GEN-03, R3-VOL-02, R3-VOL-04 |
| Band, chain and weight-releaser notes | No bands and no variable resistance for now | EQ-01, EQ-12 |
| Machine likes and dislikes in the squat tab | Machines are not ranked. One hard rule stays: no V-squat | EQ-11, GEN-08 |
| A '21.6 mile run' in the cardio list | Removed from plans and tests | LIB-18, R2-LIB-06 |
| 'KB Face Pulls' under vertical pull | Shoulder work: a rear-delt option and a swap, never the main vertical pull | LIB-10, R2-LIB-04 |
| 'Camporini Deadlift' | "you can ignore that one." | LIB-09 |
| Deload weeks written inside program blocks | No deload inside a block | R2-VOL-07 |
| Typos such as 'SAGITAL', 'TRIPPLE', 'INTERMIDIATE' | Correct them in the generator and leave the sheets as they are | FIX-04 |

All his answers about the library and the program tabs are in [library-details.md](../03-coach-answers/library-details.md).

## Things that are in the sheets but are not Blaze Camp's

| What | Where | Note |
|---|---|---|
| Exercise video links | Mostly in MM 'BASEBALL', '(NOT DONE) RESISTANCE PATTERNS ' and '(NOT DONE) 4 TRACKS PROGRAMMING' | The videos linked in his sheets are not his (conversation). [DISCLAIMER.md](../../DISCLAIMER.md) §8 says third-party links are for reference only. Videos are optional in the product: [ADR-008](../04-decisions/adr-008-videos-optional.md) |
| The half-marathon plan | MM 'Sheet24' | Credited in the tab to Chris Hinshaw |

Whether the exports in `raw/` and `dumps/` stay in the public repository is his decision. He has said the repo may include copies of his original sheets "so people can download it and play with it." (conversation). The open checks are on [roadmap.md](roadmap.md).

## Where it lives in the data

| What you want | File | Key |
|---|---|---|
| The sheet cell an exercise came from | [synthesis/02_exercise_catalog.json](../../synthesis/02_exercise_catalog.json) | each record's `aliases[]`: `raw` (his text), `workbook`, `tab`, `cell` |
| Which facts of a record were read and which were reasoned | [synthesis/02_exercise_catalog.json](../../synthesis/02_exercise_catalog.json) | `observed_fields`, `inferred_fields` |
| Whether an exercise is in his live library, only in a program, or only in a reference tab | [synthesis/02_exercise_catalog.json](../../synthesis/02_exercise_catalog.json) | `status` |
| His label for a category and the model's name for it | [BLAZE_CAMP_BRAIN.md](../../BLAZE_CAMP_BRAIN.md) | Appendix A |
| Which program slot reads which library column | [analysis/library/L4_slot_wiring.md](../../analysis/library/L4_slot_wiring.md) | whole file |
| His order rules tested against his own sessions | [analysis/equipment/ordering_audit.json](../../analysis/equipment/ordering_audit.json) | `rules[]` |
| What the compiler removed, renamed or added, and under which answer | [model/CHANGELOG.md](../../model/CHANGELOG.md) | "Coach corrections applied in the compile" |
| That the sheets were not modified | [generator_spec_v1.json](../../generator_spec_v1.json) | `_meta.google_sheets_modified` |

## Related

[timeline.md](timeline.md) · [method.md](method.md) · [exercise-library.md](../02-model/exercise-library.md) · [categories.md](../02-model/categories.md) · [ADR-015](../04-decisions/adr-015-library-source-of-truth-one-detail-variations.md)
