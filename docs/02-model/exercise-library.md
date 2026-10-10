# The exercise library

This page describes the exercise library behind the model: where it comes from, what is in it, how many exercises each category holds, how levels and swaps work, how one exercise can be varied between blocks (the "variation grammar"), and what was renamed, removed and added, with the reason for each. The coach's own MASTER EXERCISE LIBRARY is the single source of truth. Every slot in a plan gets a default exercise plus a short list of swaps from the same category. The tool may change one detail of a library exercise between blocks, and it never invents an exercise. The catalog today holds 939 records, of which 732 are active exercises, drills, cardio items and tests.

**How to read the tags.** `CAT-07`, `LIB-09` and similar = his round-1 answers (`coach_answers_full.md`). `R2-...` = round 2. `R3-...` = round 3, the newest; a later round wins. "chat" = things he said in conversation. **OBSERVED** = read from his sheets. **INFERRED** = our reading. **PROPOSED** = our design or addition, not confirmed by him. "Approved as proposed" = he marked our wording RIGHT without adding words.

**Short forms.** DB = dumbbell. KB = kettlebell. RDL = Romanian deadlift. SL = single leg. GHD = glute-ham developer, a bench that holds the feet and hips. HYROX = a fitness race of 1 km runs, each followed by a workout station.

Related pages: [categories.md](categories.md), [levels-and-zones.md](levels-and-zones.md), [equipment.md](equipment.md), [volume.md](volume.md), [sessions.md](sessions.md), [athletes.md](athletes.md). To add an exercise yourself: [../adding-exercises.md](../adding-exercises.md) (Spanish: [../adding-exercises.es.md](../adding-exercises.es.md)). His answers on library details: [../03-coach-answers/library-details.md](../03-coach-answers/library-details.md). Every field of a record: [../05-reference/data-dictionary.md](../05-reference/data-dictionary.md).

Decision records: [library as source of truth and one-detail variations](../04-decisions/adr-015-library-source-of-truth-one-detail-variations.md), [leg flexion as its own segment](../04-decisions/adr-014-leg-flexion-own-segment.md), [no bands, no variable resistance](../04-decisions/adr-034-no-bands-no-variable-resistance.md), [videos optional](../04-decisions/adr-008-videos-optional.md).

---

## 1. The three rules

| # | Rule | Why (his words) | Source |
|---|---|---|---|
| 1 | **His MASTER EXERCISE LIBRARY is the single source of truth.** It is a tab of his "BUILD YOUR OWN PROGRAM" workbook (short name: BYOP). Only its items, plus items one of his answers added, can be the default pick. | "that's the single source of truth as far as I was able to take it so far." | CAT-07 |
| 2 | **A default exercise in every slot, plus a dropdown of swaps within the same category.** | "Yeah, pick the default and be able to do the drop-downs. That's going to be important." | GEN-04 |
| 3 | **One-detail variations, never invented exercises.** Between blocks the tool may change one detail of a library exercise. It never makes up a new one. | approved as proposed | R2-LIB-01 |

A **slot** is one line of a session, for example "quads, bilateral knee dominant". A **block** is 4 to 6 weeks in which the exercises stay the same (PER-02).

He also wants the library to be open: people must be able to add and create exercises, with the repo explaining how, and AI agents should be able to read it (chat). That is what [../adding-exercises.md](../adding-exercises.md) is for.

---

## 2. Where the library comes from

| Source | What it is | Role in the catalog |
|---|---|---|
| BYOP workbook, tab 'MASTER EXERCISE LIBRARY' | his live library: one column per category, with level blocks, read by the dropdowns of his program templates | the source of truth; these items can be default picks |
| MASTER MODEL workbook, reference tabs ('Sheet23', '(NOT DONE) RESISTANCE PATTERNS', 'ALL ABOUT SQUATS', '(NOT DONE) ALL ABOUT LUNGES', '(NOT DONE) ALL ABOUT BALLISTICS', '(NOT DONE) ALL ABOUT OLYMPIC LI', 'CONTROL PATTERNSCORE', 'AGILITYCOD PATTERNS') | older drafts and study tabs | swaps only; also used to read levels and the variation vocabulary |
| MASTER MODEL workbook, program tabs (baseball, boxing, 4 tracks, upper / lower, push / pull / legs, CrossFit and others) | exercises he wrote into real programs but never added to the library | swaps only until he adds them to his library (R2-LIB-07, approved as proposed) |
| His answers | exercises he approved or described in the questionnaires | added as library items |
| The team | exercises the new sports need and the library lacks | PROPOSED, swaps only |

The two workbooks are in `raw/` (Excel exports) and, tab by tab as text, in `dumps/`. Nothing in his Google Sheets was changed. All corrections live in the catalog.

How it was merged: 4,009 rows from the sheets were read, names were normalised, and near-duplicates were merged by hand (he approved merging near-duplicates, LIB-17). Every source cell still points to its catalog record through `synthesis/02_exercise_catalog_crosswalk.json`.

---

## 3. What is in it

### 3.1 All 939 records by type

| Record type | Count | What it is | Used by the plan? |
|---|---|---|---|
| exercise | 633 | a movement | yes (one of them, the V-squat, is a reference record that can never be picked: section 7.2) |
| conditioning_prescription | 72 | a cardio item with its dose in the name ('3 min Fast - 2 min walk', '15 cals') | yes |
| drill | 14 | running and agility drills (A-drills, route trees) | yes |
| test | 13 | distance, speed and agility tests | yes |
| **Active total** | **732** | | |
| complex | 63 | a program cell that chains exercises (superset, contrast, circuit) | reference |
| generic_choice | 30 | a program cell that offers alternatives ('Pull ups or Lat pull down') | reference; see [equipment.md](equipment.md) |
| modifier | 51 | a variable he stacks on a base exercise (grip, stance, range, load position ...) | the vocabulary for variations (section 6) |
| taxonomy_placeholder | 12 | a heading with no exercises yet (carries, drags, sling systems) | no |
| progression_note / variant_rule | 4 | a rule written inside an exercise list | no |
| out_of_scope | 36 | band, chain or weight-releaser items | **never** (section 7.2) |
| retired | 11 | removed by the coach, or merged into a twin | **never**; kept so old references still resolve |

### 3.2 The 732 active records by where they come from

| Status | Count | Meaning | Can be the default pick? |
|---|---|---|---|
| `live_library_selectable` | 350 | in his BYOP library and read by a program dropdown | yes |
| `live_library_not_selectable` | 9 | in his BYOP library, but no dropdown reads it (the anterior oblique items) | no slot yet |
| `reference_only` | 215 | only in a MASTER MODEL reference tab | swap only (a few were promoted by his answers) |
| `program_only` | 121 | only named in his program tabs (SL RDL, JM press, seal rows ...) | swap only (a few were promoted by his answers) |
| `added_v1`, `added_v1_1` | 6 | added by one of his answers | yes |
| `proposed_v1`, `proposed_v1_1` | 31 | PROPOSED by the team (9 carries and drags, 22 sport additions) | **never**, until he approves |

**368 records can be a default pick** (`generator.default_candidate`). The rest are swaps.

### 3.3 Counts by family

| Family | Active records | In his BYOP library | Reference only | Program only | Added by his answers | PROPOSED | Can be default |
|---|---|---|---|---|---|---|---|
| Athletic (AP) | 239 | 90 | 97 | 49 | 0 | 3 | 100 |
| Resistance (RP) | 299 | 209 | 39 | 39 | 6 | 6 | 217 |
| Control / core | 83 | 18 | 42 | 21 | 0 | 2 | 18 |
| Cardio | 84 | 33 | 37 | 9 | 0 | 5 | 33 |
| Functional | 27 | 9 | 0 | 3 | 0 | 15 | 0 |
| **All** | **732** | **359** | **215** | **121** | **6** | **31** | **368** |

### 3.4 Counts by category

Levels are the exercise's level (see [levels-and-zones.md](levels-and-zones.md)). "Any" = the list has no level tiers. "Unrated" = no level found anywhere.

**Resistance, big muscles (listed by pattern)**

| Category (catalog code) | Records | Foundational | Intermediate | Advanced | Any | Unrated | Can be default |
|---|---|---|---|---|---|---|---|
| Bilateral knee dominant (`BKD`) | 41 | 15 | 6 | 15 | 2 | 3 | 32 |
| Unilateral knee dominant (`UKD`) | 21 | 0 | 2 | 0 | 15 | 4 | 15 |
| Leg extensions (`KEXT`) | 2 | 0 | 0 | 0 | 2 | 0 | 1 |
| Bilateral hip dominant (`BHD`) | 27 | 8 | 8 | 6 | 3 | 2 | 23 |
| Unilateral hip dominant (`UHD`) | 12 | 8 | 1 | 0 | 2 | 1 | 10 |
| Leg flexion (`KFLEX`) | 9 | 2 | 0 | 2 | 3 | 2 | 7 |
| Horizontal pull (`HPULL`) | 31 | 8 | 5 | 8 | 5 | 5 | 18 |
| Vertical pull (`VPULL`) | 25 | 11 | 0 | 7 | 4 | 3 | 21 |
| Horizontal push (`HPUSH`) | 30 | 6 | 5 | 10 | 7 | 2 | 27 |
| Mid-range push (`MRPUSH`) | 5 | 0 | 4 | 0 | 1 | 0 | 1 |
| Vertical push (`VPUSH`) | 27 | 7 | 2 | 8 | 4 | 6 | 19 |

**Resistance, small muscles (listed by muscle)**

| Category (catalog code) | Records | Foundational | Intermediate | Advanced | Any | Unrated | Can be default |
|---|---|---|---|---|---|---|---|
| Shoulders: side raises, rear delts, front raises (`SHLD`) | 23 | 1 | 1 | 0 | 20 | 1 | 15 |
| Biceps (`BIC`) | 21 | 0 | 0 | 0 | 17 | 4 | 15 |
| Triceps (`TRI`) | 15 | 0 | 0 | 0 | 12 | 3 | 9 |
| Calves (`CALF`) | 8 | 0 | 0 | 0 | 6 | 2 | 4 |
| Neck (`NECK`), PROPOSED | 2 | 1 | 1 | 0 | 0 | 0 | 0 |

**Core**

| Category (catalog code) | Records | Foundational | Intermediate | Advanced | Any | Unrated | Can be default |
|---|---|---|---|---|---|---|---|
| Core thorax (`CT`) | 30 | 10 | 10 | 3 | 2 | 5 | 10 |
| Core pelvis (`CP`) | 26 | 11 | 6 | 4 | 0 | 5 | 7 |
| Core both (`CB`) | 25 | 7 | 5 | 4 | 0 | 9 | 1 |
| Core, not specified (`CORE`) | 2 | 0 | 0 | 0 | 0 | 2 | 0 |

**Athletic**

| Category (catalog code) | Records | Foundational | Intermediate | Advanced | Any | Unrated | Can be default |
|---|---|---|---|---|---|---|---|
| Plyos and jumps (`PLYO`) | 83 | 12 | 28 | 23 | 3 | 17 | 39 |
| Jumping ankle / limited knee (`ANKLE`) | 13 | 10 | 0 | 0 | 0 | 3 | 10 |
| Triple extension / Olympic (`TX`) | 40 | 15 | 12 | 10 | 0 | 3 | 19 |
| Throwing (`THROW`) | 41 | 0 | 0 | 0 | 41 | 0 | 16 |
| Change of direction (`COD`) | 17 | 8 | 3 | 2 | 4 | 0 | 9 |
| Speed / sprint (`SPRINT`) | 10 | 0 | 0 | 1 | 6 | 3 | 7 |
| Dynamic medball warm-up (`WARMUP`) | 35 | 0 | 0 | 0 | 35 | 0 | 0 |

**Cardio and functional**

| Category (catalog code) | Records | Foundational | Intermediate | Advanced | Any | Unrated | Can be default |
|---|---|---|---|---|---|---|---|
| Cardio (`CARDIO`): 70 prescriptions, 11 tests, 3 exercises | 84 | 10 | 4 | 16 | 36 | 18 | 33 |
| Anterior oblique system (`AOS`) | 9 | 5 | 2 | 2 | 0 | 0 | 0 |
| Carries (`CARRY`), PROPOSED | 5 | 3 | 1 | 1 | 0 | 0 | 0 |
| Drags (`DRAG`), PROPOSED | 5 | 4 | 1 | 0 | 0 | 0 | 0 |
| Arm care and mobility (`ARMCARE`); 5 of the 8 PROPOSED | 8 | 5 | 0 | 0 | 0 | 3 | 0 |

### 3.5 Other cuts

| Cut | Counts (732 active records) |
|---|---|
| Laterality | bilateral 414 · unilateral 143 · alternating 73 · not applicable 101 · either 1 |
| Plane | sagittal 543 · transverse 82 · frontal 45 · multi 41 · not applicable 21 |
| Constraint level (1 = free and reactive, 5 = seated machine; see [equipment.md](equipment.md)) | level 1: 286 · level 2: 221 · level 3: 153 · level 4: 42 · level 5: 30 |
| Least equipment needed | bodyweight and household things 278 · a minimal kit (doorway bar, rope, low hurdles) 29 · home weights 237 · a gym 188 |

### 3.6 Tags the records carry

| Tag | On how many active records | Meaning | Source |
|---|---|---|---|
| ballistic / plyometric / receive | 68 / 70 / 12 | the kind of jump or throw | R2-ATH-02 |
| Receive-Create stage | 96 jumps | the stage the name implies (1 Land, 2 Land & Go, 3 Repeat) | R2-ATH-03 |
| Olympic family | 39 (18 snatch, 16 clean, 4 jerk, 1 loaded jump) | clean days or snatch days | R2-ATH-04 |
| off by default for 60+ | 141 | jumps, Olympic lifts and jumping conditioning; can be switched on with his warning. The flag was set after round 2 and still covers all 12 landing ("receive") records. Round 3 put landing drills (step down and stick, no bounce) on by default. Which of those 12 records that covers has not been set in the catalog yet. | R2-ATH-08; R3-ATH-02 for the on / off list |
| spine day | 25 counted heavy spine lifts, 25 "second-day option if not sore", 108 not counted | for the rule that the heavy squat and the heavy deadlift go on two different days | R2-SES-01, R2-SES-02 |
| Davidson zone | 196 | rotation-bias tag used to pick swaps | R2-LIB-02, R2-LIB-03 |
| variation axes | 553 | which single detail may change between blocks | R2-LIB-01 |

No active record uses a band. No medball item is over 20 lb. No athletic record counts toward muscle volume.

All counts on this page were recounted from `synthesis/02_exercise_catalog.json` (version 1.1 of the catalog).

---

## 4. How levels work in the library

The short version (the full page is [levels-and-zones.md](levels-and-zones.md)):

- His library has blocks labelled 'FOUNDATIONAL', 'MODERATE' and 'ADVANCED' inside the big-muscle and athletic columns. Small-muscle lists, throws, the unilateral knee-dominant list and leg extensions / leg curls have no levels. The unilateral hip-dominant list has one block, labelled 'FOUNDATIONAL' (OBSERVED).
- Level = skill + stability + where the load sits. A seat, machine or cable makes it easier (CAT-04, R2-LIB-02).
- Levels add options and never remove them: "The levels are still very theoretical, so we don't need to rely heavily on them." (CAT-05)
- The exercise level is separate from the client's Level 1 / 2 / 3 (CAT-06).
- Each record keeps where his sheet filed it (`level.byop_placements`) and the lowest tier it is offered to by default (`level.generator_min_level`).

---

## 5. How swaps work

### 5.1 The default pick

**Rule.** Every slot shows one default exercise. The default is always a library exercise that fits the person.

What "fits" means. Each consideration comes from one of his answers. He did not rank them, so the order of the rows is ours:

| Consideration | Rule | Source |
|---|---|---|
| The category | the exercise comes from the slot's own category | GEN-04 |
| The kit | only exercises the person's equipment allows | EQ-01; [equipment.md](equipment.md) |
| The library first | his BYOP items and the items he added come before everything else | CAT-07 |
| The person | older and injured people lean to machines or dumbbells, experienced people to the barbell | EQ-10, EQ-03 |
| The person's preference | "The client might have that preference, so that can be completely up to them as well." | EQ-10 |
| No implement named | bodyweight, then dumbbell, then barbell as the client's level rises | EQ-09 |
| Level | a soft default; safety beats the level label | CAT-05, EQ-04 |
| Staying the same | inside a block the exercise does not change | PER-02 |

How the engine weighs these against each other (the order and the scoring weights) is PROPOSED, and the engine is being rebuilt.

### 5.2 The dropdown

**Rule.** Under the default, the plan lists swaps from the same category. A swap keeps the slot's job: same pattern, same muscle credit.

| Kind of record | Default? | In the swap list? |
|---|---|---|
| His BYOP library items, and items his answers added | yes | yes |
| Reference-tab and program-only exercises | no | yes |
| PROPOSED records | no | yes (swap only until he approves them) |
| Out-of-scope (band, chain) and retired records | no | no |

The current engine lists 2 to 4 swaps per slot (`model/rules.json > selection.swaps`; an engine setting, PROPOSED).

### 5.3 When exercises change, and when they do not

| Moment | Rule | Why (his words) | Source |
|---|---|---|---|
| Inside a block (4 to 6 weeks) | exercises stay the same; only sets, reps, load and effort move | "Don't try to 'confuse' the muscle." | chat; PER-02 |
| Second time a slot comes up in the same week | a different exercise of the same category | "I can do one day of squatting and the other day of leg pressing." | PER-04 |
| Between blocks | change one or two small variables, never all at once; a one-detail variation is allowed | approved as proposed | PER-02, R2-LIB-01 |
| Something hurts | swap inside the category (the rotation bias helps pick), then cut the sets, then drop the exercise | "and maybe even drop the exercise altogether if it's too much." | VOL-03, R2-LIB-03 |
| Any time, by the person or coach | add or remove exercises or whole blocks | "they can delete certain exercises, because an athlete or a coach should be able to modify accordingly." | R3-SES-02 |

Since round 3 there are no check-ins and nothing is tracked. The plan comes out whole, and the person or coach makes these changes on their own (R3-VOL-02, R3-VOL-04). The plan prints a short guide for it.

What happens when the person lacks the equipment for a category is in [equipment.md](equipment.md), section 6.

---

## 6. The variation grammar

**Grammar** here means the way he builds an exercise name: a base movement plus stacked variables.

### 6.1 How he writes exercises (OBSERVED)

- His library headers are built from four parts: level, family, symmetry and pattern. Example from his sheet: 'FOUNDATIONAL - RP - BS - VERTICAL PUSH' (RP = resistance pattern, BS = bilateral symmetrical). The order of the parts changes from column to column: 'RP - BS - FOUNDATIONAL- HORIZONTAL PUSH', 'RP-BS-KNEE DOMINANT-INTERMIDIATE'.
- His reference tab lists the variables as their own blocks: 'FEET POSITIONING VARIATIONS', 'HAND PLACEMENT', 'STANCES', 'ROM VARIABLE', 'END RANGE BEHAVIOR VARIABLE', and load position.
- He writes exercises as base + variables. Example: 'Lateral Step ups IPSILATERAL loading' = step-up (base) + lateral (orientation) + same-side load.
- He writes progressions as variable changes. Example from a program: 'FFE CONTRA LUNGES' in week 1, then 'RFE IPSI LUNGES' in week 4 (front foot elevated to rear foot elevated; opposite-hand load to same-side load).

### 6.2 The rule: one detail, never invented

We first asked whether the tool should build variations from this grammar. He answered: "I don't really understand the question." (CAT-12) We asked again in plain words with an example, and he marked it RIGHT (R2-LIB-01). The wording below is our proposal, which became his rule:

> Your library exercises are always the main pick. Between blocks the tool may change one detail (which hand holds the weight, grip, stance, implement, range) and show it as 'Reverse lunge - dumbbell in opposite hand'. It never invents a new exercise.

| Part of the rule | Value |
|---|---|
| When | between blocks only (every 4 to 6 weeks, PER-02) |
| How many details at once | one |
| The five details | which hand holds the weight · grip · stance · implement · range |
| How it is shown | `<library name> - <detail>`. His approved example is 'Reverse lunge - dumbbell in opposite hand'. Two more in our wording: "Lat Pulldown - neutral grip", "Step-Up - lower box". |
| Never | a new exercise; a band, chain or weight releaser (EQ-01, EQ-12). Two details on the same exercise at once is also out. That last part is our reading of "one detail" (INFERRED). PER-02 (approved as proposed) lets one or two small variables change between blocks, never all at once. |

Which details apply to which exercise is INFERRED from the exercise's set-ups, pattern and laterality. 553 active records carry at least one:

| Detail | Records that allow it | Typical use |
|---|---|---|
| range | 408, plus 96 jumps where range = box, hurdle or drop height | depth, deficit, box height |
| stance | 283 | lower-body, standing and athletic exercises |
| grip | 207 | pulls, presses, curls, barbell hinges |
| implement | 94 | exercises with two or more set-ups (dumbbell or kettlebell, bar or dumbbell) |
| which hand holds the weight | 69 | one-leg and one-arm dumbbell or kettlebell work (contralateral or ipsilateral, see [categories.md](categories.md)) |

### 6.3 His variable vocabulary

The catalog keeps 51 "modifier" records read from his tabs. They are the words a variation may use. The difficulty column is his own colour or header where one exists (OBSERVED).

| Variable | Values in his sheets | His difficulty order |
|---|---|---|
| End-range behaviour | dead stop · touch & go · RDL style (never touches) | foundational · intermediate · advanced |
| Range of motion | elevated · floor · deficit · RDL style | foundational · intermediate · advanced · advanced |
| Feet position on presses | feet on bench or wall · feet on floor or raisers · feet in the air | foundational · intermediate · advanced |
| Hand placement | supinated · neutral · pronated · wide · narrow | none |
| Load position (squats) | plate reach · goblet · double KB or DB · high zercher · zercher · front rack · back rack · overhead | none written here; the squat ladder in [levels-and-zones.md](levels-and-zones.md) ranks them |
| Load position (lunges) | suitcase, high zercher or on the shoulder, each double, contralateral or ipsilateral; front-racked, zercher or back-racked barbell | any |
| Which hand holds the load | contralateral ('GET INTO THE HIP') · ipsilateral ('GET OUT OF THE HIP') | intermediate; front-racked versions advanced |
| Lunge orientation | front / back · lateral | any |
| Lunge stance | floor · front foot elevated (FFE) · rear foot elevated (RFE) | any |
| Half-kneeling stance | same-side leg up · opposite-side leg up | none |

One fixed rule from his sheet: 'Split stance ALWAYS contralateral' on single-arm rows (OBSERVED).

Bands, chains and weight releasers are also written in his sheets as 'LOADING VARIABLES'. They are dormant. See section 7.2.

### 6.4 Notation he uses

| He writes | It means | Source |
|---|---|---|
| '10/10' | 10 reps on each side = one set | UNI-01, PRG-07 |
| '12/10/8 -20' | 12 at a medium weight, 10 heavier, 8 heaviest, then a light set of 20 | PRG-07 |
| 'WEIGHT USED or SCORE' | SCORE = times, rounds or distances for conditioning | PRG-08 |

---

## 7. What was renamed, removed and added, and why

His sheets were not edited. Each change below was made in the catalog, and each traces to an answer.

### 7.1 Renamed or clarified

| In his sheet | In the catalog | Why | Source |
|---|---|---|---|
| 'Snatch', 'Clean', 'Clean & Jerk' | Squat Snatch, Squat Clean, Squat Clean & Jerk | "full squat version yes add squat word to them" | LIB-07 |
| 'Pull under' | Lat pull-over (cable) | "The pull under is really called a pull over." | LIB-09 |
| 'Kong Row' | Double-KB row from the floor | he described it; for shoulder or back pain, "it's not really advanced. It doesn't really create a lot of stimulus" | LIB-09 |
| 'Single Leg Get Ups' | Box pistol (stand up from a box on one leg) | "almost like an assisted pistol or a box pistol" | LIB-09 |
| 'Low DB Squats' | DB squat with the dumbbells hanging at the sides | "Not a goblet, not racked at the top" | LIB-09 |
| 'Alternating DB Deadlifts' and 'Alternating  Barbell Deadlifts' (we asked about them together as "Alternating DB/Barbell Deadlifts") | Alternating staggered-stance single-leg deadlift | he described the set-up: a half step back, switch legs each rep | LIB-09 |
| second 'Standing DB Press' | Standing barbell overhead press | the second entry was meant to be the barbell | LIB-11 |
| 'LEFT TEST' | L-test (3-cone) | confirmed | LIB-01 |
| '5/10/05' (the sheet turned it into a date) | 5-10-5 pro-agility shuttle | confirmed | LIB-01 |
| 'Push up Stick the Landing' | hands start on a box and land on the floor | "the hands land on the floor they start on the box" | LIB-02 |
| 'JUSTICE LEAGUE' (tab name) | Athletic Performance - Non-Competitive (the new name is ours: PROPOSED) | "no one's going to know what Justice League means" | FIX-03, ATH-13 |
| 'NO ACCESS' (two hidden tabs) | a self-serve version without coach access, using the full gym library | approved as proposed; it does not mean "no equipment" | R2-LIB-08 |
| 'TRIPPLE EXTENSION', 'SAGITAL', 'INTERMIDIATE', 'Coppenhaggen' ... | correct spelling in what the tool shows | "Correct them in the generator and leave your sheets as they are" was approved | FIX-04 |

### 7.2 Removed, retired or switched off

| Item | What happened | Why | Source |
|---|---|---|---|
| 36 band, chain and weight-releaser items | `out_of_scope`: never generated, never offered as a swap | "I don't do bands. I don't program anything with bands." and "No variable resistance should be available in this for now. We will work with that later on." | EQ-01, EQ-12 |
| 'Camporini Deadlift' | retired | "you can ignore that one." | LIB-09 |
| 'strap rotating in/out' squats (2 records) | retired | "you can take that one away, doesn't matter." | LIB-09 |
| '21.6 mile run' | retired from plans and tests | he called it "a marathon, dont know when/where we need that"; removal approved in round 2. The longest run stays the half-marathon plan. | LIB-18, R2-LIB-06 |
| 7 near-duplicates (weighted drop-and-jump twins, a deficit reverse lunge, a conventional deadlift twin, a bent-over row twin, and the catalog's "Lat Pull-Under" record for his 'Pull under') | merged into their twins | merging near-duplicates approved | LIB-17, LIB-09 |
| V-squat | not in his library and never prescribed. The catalog keeps one reference record for it (read from his 'ALL ABOUT SQUATS' tab) with `generator.eligible: false`, so it can never be picked or offered as a swap. | his sheet: "Always tight on lower back & knees, so I don't presercibe the use of these, ever." (OBSERVED); "no V-squat" approved as a hard rule | GEN-08 |

The 36 + 11 records stay in the JSON with `record_type` `out_of_scope` or `retired`, so every old reference still resolves. 32 of the 36 band items point to a non-band replacement. The other four (the three 'LOADING VARIABLES' entries and one reverse-banded squat) have none.

### 7.3 Moved to another category

| Item | From | To | Why | Source |
|---|---|---|---|---|
| Leg curls, Nordics, slider and ball curls | hip dominant | **LEG FLEXION** | "No, they shouldn't go in the hip-dominant movements. They should go in more of a flexion of the leg, kind of like bicep curls" | CAT-09 |
| 'KB Face Pulls' | vertical pull | shoulders (rear-delt option, swap only) | "i would categorize this as a shoulder work" | LIB-10, R2-LIB-04 |
| Kettlebell swings | hip-dominant resistance | ballistic power reps with no muscle credit | "kettlebell swings are not glutes." | R2-VOL-05 |
| Max-velocity sprint | plyo list | the speed session | the speed-session order was approved | LIB-21 |
| Rear-delt work | its own muscle line | inside the shoulders group | "I wouldn't categorize the rear delt as an individual muscle" | R3-VOL-01 |

### 7.4 Split in two

| Item | Became | Why | Source |
|---|---|---|---|
| 'Bench Push ups' | Bench Push-Up - Hands on Bench (foundational) and Bench Push-Up - Feet on Bench (advanced) | both readings approved | LIB-12, R2-LIB-05 |
| 'Low Depth Drop' (listed twice) | Low Depth Drop, and Low Depth Drop - Single-Leg or Weighted | the second entry was meant to be a different variant | LIB-03 |
| 'GHD' (listed in two level blocks) | one record with no level | "no levels on this" | LIB-08 |

### 7.5 Added

**Approved by the coach.**

| Record | Level | Why it was added | Source |
|---|---|---|---|
| Seated Machine Shoulder Press | foundational | vertical push had no machine option; for older and injured clients | EQ-05, R2-LIB-07 |
| Belt Squat | foundational | "Belt squats are for people that you don't need to load them axially" | EQ-11, R2-LIB-07 |
| Hang Clean, Single-Arm DB Snatch, KB Squat Clean, Hex-Bar Jump Squat | foundational triple extension | "everyone gets Olympic lifts"; beginners use these without bumper plates | ATH-10, R2-LIB-07 |
| Kettlebell Curl | (home) | the kettlebell-only client had no curl | R2-LIB-07 |
| Table Row (inverted row under a sturdy table) | (home) | the bodyweight-only client had no horizontal pull | R2-LIB-07 |
| Floor Prone Y / T Raises | (home) | the bodyweight-only client had no shoulder isolation | R2-LIB-07 |
| MACH drills, A-march, A-skip, A-run, acceleration starts | | the speed session; A-drills are warm-up and never count as volume | LIB-21, ORD-08 |
| Squat holding an object between the knees, Cossack lateral lunge, split-stance contralateral single-arm KB swing | | frontal and transverse moves for court and combat athletes | LIB-20 |

**PROPOSED by the team (swap only, never the default, until he approves).**

| Records | Why | Status |
|---|---|---|
| 9 starter carries and drags (farmer carry, front-rack KB carry, overhead KB carry, sandbag bear-hug carry, farmer hold, sled push, sled drags forward / backward / lateral) | he approved building out the empty CARRY and DRAGS headings (LIB-19); the items themselves are ours | PROPOSED |
| 22 additions for the sports he asked for (chat, 2026-10-08): side-lying DB and cable external rotation, scapular push-up, dead hang, DB wrist extension, streamline hold, streamline squat jump, sled rope pull, wall ball (20 lb or less), sandbag walking lunge, SkiErg and rower distance pieces, compromised run, burpee broad jump, ruck walk, split-step reaction drill, single-leg balance reach, tibialis raise, seated / bent-knee calf raise, neck isometric holds, plate neck flexion / extension, wall sit | swimming dryland, HYROX stations, pickleball and court sports, neck work for collision and grappling sports, skiing, hiking, older adults. None uses a band. | PROPOSED |

### 7.6 Level or credit decisions on single items

| Item | Decision | Source |
|---|---|---|
| Push press / push jerk | "push press is easier, push jerk is more technical but its more intermediate/advance" | LIB-13 |
| Throws | "No levels in throws, just do them right" | LIB-06 |
| Leg extensions labelled 'ADVANCED', leg curls labelled 'UNILATERAL' | typos; both at every level | LIB-15 |
| Advanced 'Hurdle Hops' | taller hurdles and continuous quick contacts | LIB-04 |
| Two MODERATE plyo columns (plate hops, hurdles) | an intermediate athlete takes one from each | LIB-05 |
| 'Weighted squat to calf raise' | "can be done with any tool" | LIB-07 |
| Dips | "more tricep than chest but still .5 and .5 done in push day" | LIB-16 |
| Thrusters | 1 set quads, half a set shoulders, a quarter set glutes | LIB-14, R2-VOL-05 |
| Upright rows | side delts (our reading in LIB-16; he corrected only the dips part) | LIB-16 |
| Medball 'ALL LIST' | one pass = 1 x 10 of each of about 19 throws | LIB-22 |

The dips and thruster splits are his answers for those two exercises. They are not the general helper credit, which is 0.25 of a set (VOL-09). How sets are credited to muscles is explained in [volume.md](volume.md).

---

## 8. Names, Spanish, cues and videos

| Topic | Rule | Source |
|---|---|---|
| Names | his names, with spelling corrected only in what the tool shows | FIX-04 |
| Program and day names | generic and understandable | FIX-03 |
| Spanish | neutral Latin American Spanish, with the English gym word in brackets: 'Empuje de cadera (Hip Thrust)'. He or a coach he trusts approves every line. | R2-GEN-08 |
| Cues | a short cue per exercise in his voice, plus his instruction block at the top (approved as proposed). The 70 records that have a cue today build it from one of his answers and carry that answer's id (one cue is marked INFERRED). No cue is invented for him. | GEN-07; "no invented cue" is a project rule, not a coach statement |
| Videos | optional. "They can just look up the videos on their own on YouTube. No need to have the videos on there." | R2-GEN-02 |

Notes:
- 136 active records carry a video link read from his sheets (`video_urls`). Those videos are not his (chat). His own video library is not built yet.
- Spanish names are not stored in the source catalog. They are kept in `tools/compile/es/exercises.mjs` and compiled into `model/i18n/es.json`. They still need his line-by-line approval.

---

## 9. Where it lives

| What | File | Key or section |
|---|---|---|
| The catalog (source, edit here) | `synthesis/02_exercise_catalog.json` | an array of 939 records |
| The catalog explained, with the full list by category | `synthesis/02_exercise_catalog.md` | §2 (rules per record), §3 (counts), §4 (every exercise), §5 (merges), §7 (out of scope and retired), §8 (program-only and reference-only), §9 (modifiers) |
| Sheet cell to catalog id | `synthesis/02_exercise_catalog_crosswalk.json` | every source cell |
| Home and no-equipment subsets | `synthesis/02_no_equipment_subset.md` | by home profile |
| Record type and source status | catalog record | `record_type`, `status` |
| Default pick or swap | catalog record | `generator.eligible`, `generator.default_candidate`, `generator.pools` |
| Level | catalog record | `level.primary`, `level.generator_min_level`, `level.byop_placements` |
| Variation details | catalog record | `variation_v1_1.axes` |
| Changes made to a record | catalog record | `v1_changes`, `v1_1_changes`, and the replaced values in fields ending `_v0` or `_v1` |
| Slot rule (default + dropdown) | `generator_spec_v1.json` | `template_refs.exercise_catalog.slot_rule` |
| Renames, removals, additions, variations | `generator_spec_v1.json` | `rule_tables.library_decisions` (`renames`, `removed`, `setups`, `levels`, `credit`, `build_out`, `additions_approved`, `variations`, `notation`, `pending`) |
| His labels and our names side by side | `BLAZE_CAMP_BRAIN.md` | §4 (library), Appendix A |
| Plan editing (add / remove) | `generator_spec_v1.json` | `plan_editing` |
| His original library | `raw/BYOP.xlsx`; `dumps/BYOP/09_MASTER_EXERCISE_LIBRARY.txt` | tab 'MASTER EXERCISE LIBRARY' |
| Compiled copy the engine reads | `model/catalog.json` | `exercises[]`; the live count is `model/manifest.json > counts.exercises` (generated, never edit by hand; the engine is being rebuilt) |

---

## 10. Not confirmed yet

| Item | Where it stands |
|---|---|
| The 31 PROPOSED records (9 carries and drags, 22 sport additions) | swaps only until he approves each one; their levels and doses are INFERRED |
| About 120 program-only exercises | swaps only until he adds them to his library (R2-LIB-07) |
| Posterior oblique system and lateral subsystem | empty headings in his sheet; nothing proposed yet |
| Where kettlebell swings sit | the triple-extension / ballistic pool (INFERRED from R2-VOL-05) |
| Front raises in the side-raise list | left as he filed them; never asked |
| 'Push up Box Jump' set-up | floor to box (INFERRED); he only described 'Push up Stick the Landing' |
| 14-, 17- and 20-mile distance tests | in the cardio list but longer than the half-marathon plan he kept as the longest run; not offered by default (INFERRED) |
| Which details each exercise allows (`variation_v1_1.axes`) | INFERRED; the rule itself is approved |
| Wall balls and HYROX stations | approved as finishers that never count as muscle sets (R3-ATH-03); the dose unit per station is PROPOSED |
| Spanish names | format approved (R2-GEN-08); the lines still need his approval |
| What other models have that this library lacks | a research job for outside reviewers (`CODEX_BRIEF.md`, job 2) |
