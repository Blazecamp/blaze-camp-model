# Equipment usage: MASTER EXERCISE LIBRARY columns A to T (cardio, triple extension, plyos, throwing, COD, core)

Source: BYOP workbook, tab `MASTER EXERCISE LIBRARY`, read from `raw/BYOP.xlsx`. Supporting evidence comes from the MASTER_MODEL workbook. No sheet was modified.

Companion data: `lib_athletic_core.json`. It is a JSON array of **241 records**, one per exercise cell in columns B to T:

* B = CARDIO
* C to F = TRIPPLE EXTENSION
* G to J = PLYOS
* K = THROWING
* L to N = CHANGE OF DIRECTION
* O to Q = CORE THORAX
* R to T = CORE PELVIS

Column A only holds row labels.

**Scope note.** The brief said "A through R". I added **S and T** because the coach merged the `CORE PELVIS` header across R1:T1. Without them, the frontal and transverse pelvis items would be lost.

Of the 241 cells:

* **152** are dropdown-source rows that stay after de-duplication within a level. Use `is_primary == true`.
* **145** distinct exercise names remain after that.
* The rest are copies in the side-by-side level-view columns (D, E, F, H, I, J, M, N, P, Q, R, S, T), duplicate blocks, and one progression note (G53).

This file builds on the structural decoding in `analysis/library/L1_notes.md` (columns A to N) and `L2_notes.md` (columns O to AH), and does not repeat it. What it adds is the **equipment and training-variable layer**.

## Evidence labels

| Label | Meaning |
|---|---|
| **OBSERVED** | Read directly from a cell. Always cited as `tab!cell`. |
| **NAME-DERIVED** | Taken from an explicit word in the observed exercise name, e.g. 'Hex bar', 'DB', 'hurdle', 'plate', 'Cable Machine', 'Hanging', '(half shin)'. |
| **COACH-CHAT** | Taken from the coach's own words in this session's brief. |
| **SCIENCE** | General sports-science consensus, named by reference. |
| **INFERRED** | My own judgement. |

Every record lists its tagged fields in `field_evidence`. It also lists the inferred or science-based ones in `inferred_fields`.

---

## 1. How to use the JSON (generator view)

### Fields

* **`implements`**: the equipment the exercise as written requires. It uses the requested vocabulary:
  * `barbell`, `dumbbell`, `kettlebell`, `medball`
  * `machine_selectorized`, `machine_plate_loaded`, `cable`, `smith`
  * `band`, `chains`, `bodyweight`
  * `box/bench/step`, `TRX/rings`, `landmine`
  * `hex_bar`, `SSB`, `EZ_bar`, `sandbag`, `sled`
  * `GHD/reverse_hyper`, `cardio_machine(bike/row/ski/treadmill)`
  * `track/field`, `hurdles/plates/cones`, `pullup_bar`, `other`
* **`implements_optional`**: alternatives the name allows.
* **`implement_ambiguous`**: `true` when the name does not pin down one implement, e.g. 'Weighted ...', 'Woodchoppers', '... cals', '200m'.
* **`requires_any_of`**: an equipment-filter expression. It is a list of kits, and owning **any one** kit is enough. Kit tokens are defined in section 7.
* **`available_in_profiles`**: which of 5 equipment profiles can perform the item as written:
  * P1 no-gym bodyweight
  * P2 home with DB and bands
  * P3 home athlete
  * P4 commercial gym
  * P5 performance facility

  This is the field to read when a client says "I only have X".
* **`no_equipment_ok`**: true when the item is available in P1.
* **`substitutes_by_equipment`**: has keys `no_barbell`, `no_machine`, `bodyweight_only`, `db_only` and `bands_only`.
  * Each value stays in the **same slot and pattern**.
  * It quotes a library item (with its cell) or an observed coach exercise (with tab!cell) wherever one exists.
  * "same exercise" means the item does not need that equipment.
* **`constraint_level`** (1 to 5): the requested scale.
  * 5 is a seated, supported, fixed-path machine.
  * 1 is bodyweight, ballistic or reactive work in open space.

  `constraint_rationale` explains each value. `constraint_by_option` gives values for multi-modality cardio.
* **`velocity_intent`**, **`force_velocity_zone`**, **`rom_profile`** and **`rom_notes`**, **`load_ceiling`** and **`load_guidance`**: the training-variable layer (section 5).
* **`coach_ballistic_phase`**: maps each plyo to the coach's own taxonomy in MASTER_MODEL `(NOT DONE) ALL ABOUT BALLISTICS`:
  * 'TAKING IN FORCES'
  * 'DELIVER FORCES FAST'
  * 'AMORTIZATION OF FORCES'
  * 'REBOUNDING'
* **`observed_usage_exact`** and **`observed_usage_related`**: every non-library cell, in both workbooks, whose text equals or contains the exercise name. Sheet23 is kept separately in `sheet23_twin`.

---

## 2. What the coach has already told us about equipment (all evidence)

### Machines vs free weights

**Machines** give reference points and constraints. The coach's description: "you sit down, put your feet on the ground... You can push a lot, but it's also safer". He calls machines "usually better" for people adding volume, for injured people and for older people (COACH-CHAT).

The workbook says the same thing about the leg press: 'Pro: You can focus on mechanical fatigue, local fatigue of the quads/legs and not have so much systemic fatigue failure' (OBSERVED `ALL ABOUT SQUATS`!I35).

His machine preferences are specific (OBSERVED):

| Machine | Verdict | Cell |
|---|---|---|
| LEG PRESS | 'LOVE IT' | `ALL ABOUT SQUATS`!G35/H35 |
| PENDULUM | 'LOVE IT' ('my FAVORITE') | G41/H41/I41 |
| HACK SQUAT | "I PERSONALLY DON'T LIKE IT" | G37/H37 |
| V-SQUAT | "DON'T LIKE IT" ('Always tight on lower back & knees') | G39/H39/I39 |

So "machine" is not one equipment class: a generator needs a per-machine preference list.

**Free weights** are "more skilled" (COACH-CHAT). The coach ranks free-weight squat loading from easy to hard (OBSERVED `ALL ABOUT SQUATS`!A10:H11). The ranking is about how easy it is to stay upright:

| Rank | Loading |
|---|---|
| 'EASIEST' | 'Hex Bar Squat' |
| 'EASIER' | 'Goblet Squat' |
| 'EASY' | 'High Zercher Squat' |
| 'MODERATE' | 'Zercher Squat' |
| 'HARD' | 'Front Squat/ SSB Bar' |
| 'HARDER' | 'High Bar Squat' |
| 'HARDEST' | 'Low Bar Squat' |
| 'VERY HARD ' | 'Overhead Squat' |

This is the coach's own implement-difficulty ladder.

### Pain rule

OBSERVED in `EXAMPLE UPPERLOWER SPLIT`!A7: '****When there are joint pains, usually getting away from fixed grips (barbells, bars) and going split grips (dumbbells, kbs, indivitual grips) help take care of some stuff'.

The version in `EXAMPLE ATHLETIC FULL BODY SPLI`!A6 adds 'going unilateral or/and also'. Equipment substitution comes **before** cutting volume.

### Bands and chains

Bands and chains change the speed of a lift (OBSERVED `ALL ABOUT SQUATS`!A35:D40):

* **Bottom banded.** 'Bands are designed for speed/velocity' (C35). Load 'around 50% so you can move fast' (B36).
* **Reverse banded.** 'Helps you have a faster concentric reaction & increase velocity' (C37). Load 'lower ranges and fast speed' (B38).
* **Bottom chains.** 'Chains are designed for magnitude influence, loading' (C39). The note in A40 reads '*INTENSIONALLY SLOW YOU DOWN'. Load 'moderate around 70%' (B40).

Bar weight also changes the eccentric (A44:A48):

* 'HEAVY BARBELL' gives an 'ECCENTRIC SLOW MORE MUSCLE RECRUITMENTS'.
* 'LIGHT BARBELL ' gives an 'ECCENTRICFAST LESS MUSCLE RECRUITMENT'.

### Load and velocity in one prescription

The coach writes contrast complexes that run down the load-velocity curve in a single prescription (OBSERVED):

* '78% of 1RM whatever squat immediately into tuck jumps, immediately into Goblet squats, immediately into reverse banded squat jumps' (`ALL ABOUT SQUATS`!I18, labelled 'FRENCH CONTRAST').
* 'front squats/high jumps/hex bar squat jumps/ banded assisted hops' (`BASEBALL`!DH51, BY52).
* 'back squats/banded  jumps/DB squat jumps/ high ankle hops' (`BASEBALL`!CQ52).
* 'SUPERSET: HEAVY Hex bar Squats direclty into 10 Repeat Jump Squat HIGH JUMPs' (`EXAMPLE ATHLETIC FULL BODY SPLI`!C17).

Speed cues written as prescriptions (OBSERVED):

* 'Front squats - light weights - same speed for all reps' (`BASEBALL`!BU33, AO51)
* 'FAST RPE6 or about 60-70%' (`(NOT DONE) 4 TRACKS PROGRAMMING`!N17)
* 'FAST BANDED BENCH PRESS' (4 TRACKS!E21)
* 'MB fast chest pass ' (`BASEBALL`!AW47)
* 'Fast KB swings' (BASEBALL!AI51)

This matches the brief's "heavier I go the slower... lighter... faster".

### Medballs

* Light: "10 lbs., 8 lbs." for upper-body passes and rotations (COACH-CHAT).
* 'this but hugging a light medball' (`EXAMPLE ATHLETIC FULL BODY SPLI`!K13).
* Dosed 1 x 10 per throw and 1 x 20 for sit-up throws (`ALL ABOUT BALLISTICS`!A53:B71).

### Cardio is modality-free

* 'Any Cardio Equipment' (`EXAMPLE UPPERLOWER SPLIT`!C13).
* '20 sec fast/ 40 sec slow (cardio of choice)' (`EXAMPLE BOXING 8 WEEK BUILD UP`!D7).
* Calorie sprints rotate bike, ski and row in the same weekly slot: '1 X 12 Cal bike sprint' / '1 X 12 Cal skierg sprint' / '1 X 12 Cal row sprint' (`BASEBALL`!CM40/CQ40/CU40). Also '3x 10 cal row sprint or ski' (BASEBALL!AA39).

### The coach writes substitutions himself

He writes "X or Y". Counts are cells in both workbooks; OBSERVED:

| Phrase | Cells |
|---|---|
| 'Machine Dips or dips' | 16 |
| 'machine rows or db rows' | 12 |
| 'machine or db flies' | 12 |
| 'machine or db Reverse flies' | 8 |
| 'Ez bar curls or barbell' | 8 |
| 'Sqats or Leg Press' | 6 |
| 'Deadlifts (DB or Barbell)' | 6 |
| 'Reverse Lunges (Bodyweight or DBs)' | 6 |
| 'Pull ups or Lat pull down' | 3 |
| 'pull ups or banded assisted pull ups' | 2 |
| 'Cable or DB side raises' | 4 |

The cleanest ladder is **'HEAVY Single arm rotational half kneeling cable row or band row or Bird Dog Row'** (`EXAMPLE ATHLETIC FULL BODY SPLI`!C16). It runs cable, then band, then bodyweight within one pattern. This is the template for `substitutes_by_equipment`.

### Implement size is a progression lever

'Bigger plates start at lateral bilateral plate hops' (G53 = H16). When the implement gets bigger, complexity resets to the simpler pattern. The other implement-size levers sit in the names themselves:

* box height: '(half shin)', '(up to knee)', '(above hip)'
* hang height: 'High hang', 'Mid hang', 'Low hang'

The coach's Olympic ladder from high hang to floor is in `(NOT DONE) ALL ABOUT OLYMPIC LI`!A7:A10.

### Range of motion is prescribed explicitly

'Leg ext. Leg Curls (FULL RANGE OF MOTION)' (`EXAMPLE BOXING 8 WEEK BUILD UP`!L14). 'slow eccentric deficit Lunges (no weigths)' is also observed (`BASEBALL`!EL52). ROM is a written variable, as the brief says.

---

## 3. Distribution tables (computed from the JSON)

The "dropdown-source rows" are the 152 `is_primary` rows. Rows that repeat at another level are counted once per level.

### Equipment profiles

| Profile | Kit |
|---|---|
| P1 no-gym | bodyweight + park/field: floor, wall, steps/park bench, open running space, improvised markers (shoes/bottles as cones); nothing bought - kit tokens: `bench`, `cones`, `floor`, `open_space_long`, `open_space_short`, `partner_or_wall`, `step_low`, `wall` |
| P2 home DB+band | P1 + dumbbells + resistance bands - kit tokens: `band`, `bench`, `cones`, `dumbbell`, `floor`, `open_space_long`, `open_space_short`, `partner_or_wall`, `step_low`, `wall` |
| P3 home athlete | P2 + medball/slam ball, kettlebell, cones, a weight plate, pull-up bar - kit tokens: `band`, `bench`, `cones`, `dumbbell`, `floor`, `kettlebell`, `medball`, `open_space_long`, `open_space_short`, `partner_or_wall`, `plate_low_target`, `pullup_bar`, `slam_ball`, `step_low`, `wall` |
| P4 commercial gym | typical commercial gym: DB/KB/barbell/hex bar/cables/machines/boxes/medballs/cardio machines/pull-up bar, short turf; NO hurdles, NO 40-60 m runway, NO bumper-drop platform - kit tokens: `band`, `barbell`, `bench`, `cable`, `cardio_machine_cal`, `cones`, `dumbbell`, `floor`, `hex_bar`, `kettlebell`, `medball`, `open_space_short`, `partner_or_wall`, `plate_low_target`, `plyo_box_high`, `pullup_bar`, `slam_ball`, `step_low`, `treadmill`, `two_boxes`, `wall` |
| P5 facility | everything incl. Olympic platform with bumpers, hurdles, track/field - kit tokens: `band`, `barbell`, `barbell_bumpers_platform`, `bench`, `cable`, `cardio_machine_cal`, `cones`, `dumbbell`, `floor`, `hex_bar`, `hurdles`, `kettlebell`, `medball`, `open_space_long`, `open_space_short`, `partner_or_wall`, `plate_low_target`, `plyo_box_high`, `pullup_bar`, `slam_ball`, `step_low`, `treadmill`, `two_boxes`, `wall` |

### Counts

| Segment (row 1, verbatim) | cells (records) | dropdown-source rows (dedup per level) | unique names |
|---|---|---|---|
| CARDIO | 43 | 34 | 34 |
| TRIPPLE EXTENSION | 59 | 33 | 27 |
| PLYOS | 75 | 39 | 38 |
| THROWING | 20 | 20 | 20 |
| CHANGE OF DIRECTION | 13 | 9 | 9 |
| CORE THORAX | 14 | 10 | 10 |
| CORE PELVIS | 17 | 7 | 7 |
| **total** | **241** | **152** | **145** |

### Implement distribution (required implements, 152 dropdown-source rows deduplicated per level)

| implement | total | CARDIO | TRIPPLE EXTENSION | PLYOS | THROWING | CHANGE OF DIRECTION | CORE THORAX | CORE PELVIS |
|---|---|---|---|---|---|---|---|---|
| bodyweight | 97 | 25 | 14 | 35 |  | 9 | 7 | 7 |
| track/field | 36 | 25 |  | 2 |  | 9 |  |  |
| medball | 20 |  |  |  | 20 |  |  |  |
| barbell | 16 |  | 16 |  |  |  |  |  |
| hurdles/plates/cones | 15 |  |  | 13 |  | 2 |  |  |
| box/bench/step | 14 |  |  | 13 |  |  |  | 1 |
| cardio_machine(bike/row/ski/treadmill) | 9 | 9 |  |  |  |  |  |  |
| dumbbell | 6 |  | 1 | 4 |  |  | 1 |  |
| pullup_bar | 4 |  |  |  |  |  | 2 | 2 |
| hex_bar | 2 |  | 2 |  |  |  |  |  |
| cable | 2 |  |  |  |  |  | 2 |  |

implement_ambiguous = true on 35 of 152 rows: '10 cals'; '1000m'; '15 cals'; '2 min Fast - 1 min walk'; '20 cals'; '200m'; '25 cals'; '3 min Fast - 2 min walk'; '30 cals'; '35 cals'; '4 min Fast - 3 min walk'; '40 cals'; '400m'; '45 cals'; '5 min fast - 2 min walk'; '50 cals'; '6 min fast - 1 min walk'; '600m'; '800m'; 'Alternating sL plate hops (hop off bilateral)'; 'Bulgarian Split Jumps'; 'Forward bilateral plate hops'; 'Half a mile (800m)'; 'Knees to chest'; 'Lateral bilateral plate hops forward on /hop off and back on sideways/ forward down repeat'; 'Push up Box Jump'; 'Push up Stick the Landing'; 'Russian Twists'; 'Single inner leg lateral plate hops alt'; 'Single inner/outer leg lateral plate hops'; 'Single leg plate hops'; 'Single outer leg lateral plate hops alternating'; 'Weighted Situps'; 'Weighted squat to calf raise'; 'Woodchoppers'

Rows that need at least one external implement (anything except bodyweight/track-field): 86 of 152 (57%).

### Constraint level (1 = open space/ballistic ... 5 = seated, supported, fixed path) by segment and level

| Segment | Level | n | C1 | C2 | C3 | C4 | C5 | mean |
|---|---|---|---|---|---|---|---|---|
| CARDIO | any | 34 | 25 |  |  |  | 9 | 2.06 |
| TRIPPLE EXTENSION | foundational | 18 | 13 | 5 |  |  |  | 1.28 |
| TRIPPLE EXTENSION | intermediate | 9 | 1 | 8 |  |  |  | 1.89 |
| TRIPPLE EXTENSION | advanced | 6 |  | 6 |  |  |  | 2.00 |
| PLYOS | foundational | 6 | 6 |  |  |  |  | 1.00 |
| PLYOS | intermediate | 17 | 17 |  |  |  |  | 1.00 |
| PLYOS | advanced | 16 | 16 |  |  |  |  | 1.00 |
| THROWING | any | 20 | 13 | 5 | 2 |  |  | 1.45 |
| CHANGE OF DIRECTION | foundational | 5 | 5 |  |  |  |  | 1.00 |
| CHANGE OF DIRECTION | intermediate | 2 | 2 |  |  |  |  | 1.00 |
| CHANGE OF DIRECTION | advanced | 2 | 2 |  |  |  |  | 1.00 |
| CORE THORAX | foundational | 6 |  | 2 | 4 |  |  | 2.67 |
| CORE THORAX | intermediate | 1 |  | 1 |  |  |  | 2.00 |
| CORE THORAX | advanced | 3 |  | 1 | 2 |  |  | 2.67 |
| CORE PELVIS | foundational | 4 |  | 2 | 2 |  |  | 2.50 |
| CORE PELVIS | intermediate | 2 |  | 2 |  |  |  | 2.00 |
| CORE PELVIS | advanced | 1 |  | 1 |  |  |  | 2.00 |
| **all** | | 152 | 100 | 33 | 10 | 0 | 9 | |

### Availability by equipment profile (how many options remain in each slot block)

| Segment | Level | Sub-pattern (row 5) | n | P1 no-gym | P2 home DB+band | P3 home athlete | P4 commercial gym | P5 facility |
|---|---|---|---|---|---|---|---|---|
| CARDIO | any | CALORIES | 9 | **0** | **0** | **0** | 9 | 9 |
| CARDIO | any | DISTANCE | 5 | 5 | 5 | 5 | 5 | 5 |
| CARDIO | any | DISTANCE INTERVALS | 3 | 3 | 3 | 3 | 3 | 3 |
| CARDIO | any | DISTANCE TEST | 9 | 9 | 9 | 9 | 9 | 9 |
| CARDIO | any | SPEED INTERVALS | 5 | 5 | 5 | 5 | 5 | 5 |
| CARDIO | any | SPEED TEST | 3 | 3 | 3 | 3 | 3 | 3 |
| TRIPPLE EXTENSION | foundational | JUMPING ANKLE | 11 | 11 | 11 | 11 | 11 | 11 |
| TRIPPLE EXTENSION | foundational | TRIPPLE EXTENSION | 7 | 2 | 2 | 2 | 7 | 7 |
| TRIPPLE EXTENSION | intermediate | TRIPPLE EXTENSION | 9 | 1 | 2 | 2 | 9 | 9 |
| TRIPPLE EXTENSION | advanced | TRIPPLE EXTENSION | 6 | **0** | **0** | **0** | 2 | 6 |
| PLYOS | foundational | PLYO | 6 | 6 | 6 | 6 | 6 | 6 |
| PLYOS | intermediate | PLYO | 17 | 12 | 12 | 12 | 12 | 17 |
| PLYOS | advanced | FULL JUMPING | 16 | 9 | 13 | 13 | 13 | 16 |
| THROWING | any | THROWING | 20 | **0** | **0** | 20 | 20 | 20 |
| CHANGE OF DIRECTION | foundational | EASY TURN | 5 | 5 | 5 | 5 | 5 | 5 |
| CHANGE OF DIRECTION | intermediate | MOD. TURN | 2 | 2 | 2 | 2 | 2 | 2 |
| CHANGE OF DIRECTION | advanced | HARD TURN | 2 | 2 | 2 | 2 | 2 | 2 |
| CORE THORAX | foundational | CORE THORAX SAGITAL | 6 | 3 | 4 | 6 | 6 | 6 |
| CORE THORAX | intermediate | CORE THORAX FRONTAL | 1 | 1 | 1 | 1 | 1 | 1 |
| CORE THORAX | advanced | CORE THORAX TRANSVERSE | 3 | 1 | 3 | 3 | 3 | 3 |
| CORE PELVIS | foundational | CORE PELVIS SAGITAL | 4 | 3 | 3 | 4 | 4 | 4 |
| CORE PELVIS | intermediate | CORE PELVIS FRONTAL | 2 | 2 | 2 | 2 | 2 | 2 |
| CORE PELVIS | advanced | CORE PELVIS TRANSVERSE | 1 | **0** | **0** | 1 | 1 | 1 |

### Blocks with ZERO options in a profile

* **P1** (P1_no_gym_bodyweight): CARDIO / any / CALORIES; TRIPPLE EXTENSION / advanced / TRIPPLE EXTENSION; THROWING / any / THROWING; CORE PELVIS / advanced / CORE PELVIS TRANSVERSE
* **P2** (P2_home_db_band): CARDIO / any / CALORIES; TRIPPLE EXTENSION / advanced / TRIPPLE EXTENSION; THROWING / any / THROWING; CORE PELVIS / advanced / CORE PELVIS TRANSVERSE
* **P3** (P3_home_athlete): CARDIO / any / CALORIES; TRIPPLE EXTENSION / advanced / TRIPPLE EXTENSION
* **P4** (P4_commercial_gym): none

### What each level needs (kit requirements of the options, dropdown-source rows)

| Segment | Level | Sub-pattern | option -> requires_any_of |
|---|---|---|---|
| CARDIO | any | CALORIES | '10 cals' -> cardio_machine_cal<br>'15 cals' -> cardio_machine_cal<br>'20 cals' -> cardio_machine_cal<br>'25 cals' -> cardio_machine_cal<br>'30 cals' -> cardio_machine_cal<br>'35 cals' -> cardio_machine_cal<br>'40 cals' -> cardio_machine_cal<br>'45 cals' -> cardio_machine_cal<br>'50 cals' -> cardio_machine_cal |
| CARDIO | any | DISTANCE | '200m' -> open_space_long OR treadmill OR cardio_machine_cal<br>'400m' -> open_space_long OR treadmill OR cardio_machine_cal<br>'600m' -> open_space_long OR treadmill OR cardio_machine_cal<br>'800m' -> open_space_long OR treadmill OR cardio_machine_cal<br>'1000m' -> open_space_long OR treadmill OR cardio_machine_cal |
| CARDIO | any | DISTANCE INTERVALS | '1 mile run - 1 min walk' -> open_space_long OR treadmill<br>'2 mile run - 2 min walk' -> open_space_long OR treadmill<br>'3 mile run - 3 min walk' -> open_space_long OR treadmill |
| CARDIO | any | DISTANCE TEST | '1 Mile run' -> open_space_long OR treadmill<br>'3 mile run' -> open_space_long OR treadmill<br>'5 mile run' -> open_space_long OR treadmill<br>'8 mile run' -> open_space_long OR treadmill<br>'11 mile run' -> open_space_long OR treadmill<br>'14 mile run' -> open_space_long OR treadmill<br>'17 mile run' -> open_space_long OR treadmill<br>'20 mile run' -> open_space_long OR treadmill<br>'21.6 mile run' -> open_space_long OR treadmill |
| CARDIO | any | SPEED INTERVALS | '2 min Fast - 1 min walk' -> open_space_long OR treadmill OR cardio_machine_cal<br>'3 min Fast - 2 min walk' -> open_space_long OR treadmill OR cardio_machine_cal<br>'4 min Fast - 3 min walk' -> open_space_long OR treadmill OR cardio_machine_cal<br>'5 min fast - 2 min walk' -> open_space_long OR treadmill OR cardio_machine_cal<br>'6 min fast - 1 min walk' -> open_space_long OR treadmill OR cardio_machine_cal |
| CARDIO | any | SPEED TEST | 'Half a mile (800m)' -> open_space_long OR treadmill<br>'1 Mile Run for time' -> open_space_long OR treadmill<br>'3 Miles run for time' -> open_space_long OR treadmill |
| TRIPPLE EXTENSION | foundational | JUMPING ANKLE | 'Bilateral symmetrical ankle hop' -> floor<br>'Lateral bilateral ankle hops' -> floor<br>'Forward/reverse bilateral hops' -> floor<br>'Reverse bilateral ankle hops' -> floor<br>'Bilateral Symmetrical  zig-zag jumps' -> floor<br>'Single leg ankle hops' -> floor<br>'Single leg lateral ankle hops' -> floor<br>'Reverse single leg ankle hops' -> floor<br>'Right angle bilateral ankle hops - forward/right/forward/left/forward' -> floor<br>'Right angle single leg ankle Hops' -> floor<br>'Forward/reverse sl ankle hops' -> floor |
| TRIPPLE EXTENSION | foundational | TRIPPLE EXTENSION | 'BodyWeight Squat to calf raise' -> floor<br>'Lunge to high knee reach' -> floor<br>'Hex bar squat to calf raise' -> hex_bar<br>'High hang clean pull' -> barbell<br>'Mid hang clean pull' -> barbell<br>'High hang snatch pull' -> barbell<br>'Mid hang snatch pull' -> barbell |
| TRIPPLE EXTENSION | intermediate | TRIPPLE EXTENSION | 'Weighted squat to calf raise' -> dumbbell OR kettlebell OR barbell<br>'Lunge to high knee reach' -> floor<br>'Hex bar squat to calf raise' -> hex_bar<br>'High hang clean pull' -> barbell<br>'Mid hang clean pull' -> barbell<br>'High hang snatch pull' -> barbell<br>'Mid hang snatch pull' -> barbell<br>'Low hang clean pull' -> barbell<br>'Low hang snatch pull' -> barbell |
| TRIPPLE EXTENSION | advanced | TRIPPLE EXTENSION | 'Power Snatch' -> barbell_bumpers_platform<br>'Power Clean' -> barbell_bumpers_platform OR barbell<br>'Power Clean & Jerk' -> barbell_bumpers_platform<br>'Snatch' -> barbell_bumpers_platform<br>'Clean' -> barbell_bumpers_platform OR barbell<br>'Clean & Jerk' -> barbell_bumpers_platform |
| PLYOS | foundational | PLYO | 'Low Depth Drop' -> step_low<br>'Medium Depth Drop' -> step_low<br>'Push up Stick the Landing' -> floor<br>'Low Box Jumps (half shin)' -> step_low<br>'Mid Box Jump (up to knee)' -> step_low<br>'Ankle Hops' -> floor |
| PLYOS | intermediate | PLYO | 'Forward bilateral plate hops' -> plate_low_target OR step_low<br>'Lateral bilateral plate hops forward on /hop off and back on sideways/ forward down repeat' -> plate_low_target OR step_low<br>'Alternating sL plate hops (hop off bilateral)' -> plate_low_target OR step_low<br>'Single leg plate hops' -> plate_low_target OR step_low<br>'Single outer leg lateral plate hops alternating' -> plate_low_target OR step_low<br>'Single inner leg lateral plate hops alt' -> plate_low_target OR step_low<br>'Single inner/outer leg lateral plate hops' -> plate_low_target OR step_low<br>'SL forward zig-zag jumps' -> floor<br>'Ankle Hops' -> floor<br>'SL Depth Drops' -> step_low<br>'SL Reverse zig-zag jumps' -> floor<br>'Bilateral Forward Hurdle Hops' -> hurdles<br>'SL Forward Hurdle Hops' -> hurdles<br>'Bilateral Lateral Hurdle Hops' -> hurdles<br>'SL Lateral Hurdle Hops' -> hurdles<br>'Push up Box Jump' -> step_low OR plate_low_target<br>'Right Angle Bilateral Forward/ Lateral/forward/lateral hurdle hops' -> hurdles |
| PLYOS | advanced | FULL JUMPING | 'Squirrel jumps' -> floor<br>'Single leg squirrel jumps' -> floor<br>'Max velocity running (top speed)' -> open_space_long<br>'Tuck Jumps' -> floor<br>'SL Depth Jumps' -> step_low<br>'Depth Jumps' -> step_low<br>'Depth Drop to Box Jump' -> two_boxes<br>'High Depth Drop (above hip)' -> plyo_box_high<br>'Hurdle Hops' -> hurdles<br>'Bulgarian Split Jumps' -> bench OR step_low<br>'DB Depth drop dbs Jump' -> dumbbell+step_low<br>'SL DB depth drop dbs jump' -> dumbbell+step_low<br>'DB Ankle hops' -> dumbbell<br>'DB repeat squat jumps' -> dumbbell<br>'Bounding' -> open_space_long<br>'Plyo pushups' -> floor |
| THROWING | any | THROWING | 'Chest pass' -> medball+partner_or_wall<br>'Overhead throw' -> medball+partner_or_wall OR slam_ball<br>'Rotational Chest pass R' -> medball+partner_or_wall<br>'Rotational Chest pass L' -> medball+partner_or_wall<br>'Rotational Scoop R' -> medball+partner_or_wall<br>'Rotational Scoop L' -> medball+partner_or_wall<br>'Squat to Chest Pass' -> medball+partner_or_wall<br>'Rotational Floor side to side slams' -> slam_ball<br>'RIGHT LEG step forward Chest Pass' -> medball+partner_or_wall<br>'LEFT LEG step forward Chest pass' -> medball+partner_or_wall<br>'RIGHT LEG step forward overhead throw' -> medball+partner_or_wall<br>'LEFT LEG step forward overhead throw' -> medball+partner_or_wall<br>'Half kneeling Right Facing LEFT LEG UP rotational scoop' -> medball+partner_or_wall<br>'Half kneeling Right Facing RIGHT LEG FORWARD rotational scoop' -> medball+partner_or_wall<br>'Half kneeling LEFT Facing LEFT LEG UP rotational scoop' -> medball+partner_or_wall<br>'Half kneeling LEFT Facing RIGHT LEG FORWARD rotational scoop' -> medball+partner_or_wall<br>'Alternating Back to wall Rotational Scoops' -> medball+wall<br>'Situps to chest pass' -> medball+partner_or_wall<br>'Situps to overhead throw' -> medball+partner_or_wall<br>'Rotational Downward Slam Throw' -> slam_ball |
| CHANGE OF DIRECTION | foundational | EASY TURN | 'FADE' -> open_space_short<br>'SLANT' -> open_space_short<br>'POST/CORNER' -> open_space_short<br>'FLAT' -> open_space_short<br>'Shuffles' -> open_space_short |
| CHANGE OF DIRECTION | intermediate | MOD. TURN | 'DIG/OUT' -> open_space_short<br>'LEFT TEST' -> open_space_short+cones |
| CHANGE OF DIRECTION | advanced | HARD TURN | 'COMEBACK/CURL' -> open_space_short<br>'2005-05-10 00:00:00 (date cell, displayed '5/10/05'; typed value was '5-10-5')' -> open_space_short+cones |
| CORE THORAX | foundational | CORE THORAX SAGITAL | 'Plank' -> floor<br>'Crunches' -> floor<br>'Sit ups' -> floor<br>'Weighted Situps' -> dumbbell OR medball OR plate_low_target OR kettlebell<br>'Toes to bar' -> pullup_bar<br>'Knees to chest' -> pullup_bar |
| CORE THORAX | intermediate | CORE THORAX FRONTAL | 'Side Plank' -> floor |
| CORE THORAX | advanced | CORE THORAX TRANSVERSE | 'Woodchoppers' -> cable OR band OR medball OR dumbbell OR kettlebell<br>'Cable Machine Oblique Rotations' -> cable OR band<br>'Russian Twists' -> floor |
| CORE PELVIS | foundational | CORE PELVIS SAGITAL | 'Leg Raises' -> floor<br>'Reverse Crunches' -> floor<br>'V-ups' -> floor<br>'Hanging Rotational Knee/Leg Raises' -> pullup_bar |
| CORE PELVIS | intermediate | CORE PELVIS FRONTAL | 'Side Planks' -> floor<br>'Coppenhaggen Plank' -> bench OR step_low |
| CORE PELVIS | advanced | CORE PELVIS TRANSVERSE | 'Hanging rotational knees to chest' -> pullup_bar |

### Velocity intent and force-velocity zone (dropdown-source rows)

| Segment | max_velocity | fast | controlled | slow | n/a | F-V zones |
|---|---|---|---|---|---|---|
| CARDIO | 4 | 18 | 6 | 6 | 0 | n/a 34 |
| TRIPPLE EXTENSION | 11 | 22 | 0 | 0 | 0 | strength_speed 16, reactive 11, starting_strength/speed 3, speed_strength 3 |
| PLYOS | 31 | 8 | 0 | 0 | 0 | reactive 33, starting_strength/speed 3, speed_strength 3 |
| THROWING | 20 | 0 | 0 | 0 | 0 | speed_strength 20 |
| CHANGE OF DIRECTION | 8 | 1 | 0 | 0 | 0 | starting_strength/speed 9 |
| CORE THORAX | 0 | 0 | 8 | 2 | 0 | n/a 10 |
| CORE PELVIS | 0 | 0 | 5 | 2 | 0 | n/a 7 |

### suitable_for counts (dropdown-source rows)

| Segment | n | high_volume | injured/pain | older_adult | beginner | athlete_power | no_gym |
|---|---|---|---|---|---|---|---|
| CARDIO | 34 | 0 | 14 | 19 | 25 | 2 | 25 |
| TRIPPLE EXTENSION | 33 | 15 | 1 | 2 | 23 | 33 | 14 |
| PLYOS | 39 | 8 | 0 | 0 | 7 | 39 | 20 |
| THROWING | 20 | 20 | 4 | 2 | 20 | 20 | 0 |
| CHANGE OF DIRECTION | 9 | 1 | 0 | 1 | 5 | 9 | 9 |
| CORE THORAX | 10 | 8 | 2 | 3 | 9 | 0 | 5 |
| CORE PELVIS | 7 | 4 | 1 | 3 | 3 | 0 | 5 |

### ROM profile (dropdown-source rows)

| Segment | full | mid | variable | lengthened_partial | end_range |
|---|---|---|---|---|---|
| CARDIO |  |  | 34 |  |  |
| TRIPPLE EXTENSION | 14 | 19 |  |  |  |
| PLYOS | 7 | 17 | 15 |  |  |
| THROWING | 16 | 4 |  |  |  |
| CHANGE OF DIRECTION |  |  | 9 |  |  |
| CORE THORAX | 5 | 5 |  |  |  |
| CORE PELVIS | 3 | 4 |  |  |  |

### Specific kit needs (dropdown-source rows whose EVERY option set needs the kit)

* **medball** (17): K9 'Chest pass', K11 'Rotational Chest pass R', K12 'Rotational Chest pass L', K13 'Rotational Scoop R', K14 'Rotational Scoop L', K15 'Squat to Chest Pass', K17 'RIGHT LEG step forward Chest Pass', K18 'LEFT LEG step forward Chest pass', K19 'RIGHT LEG step forward overhead throw', K20 'LEFT LEG step forward overhead throw', K21 'Half kneeling Right Facing LEFT LEG UP rotational scoop', K22 'Half kneeling Right Facing RIGHT LEG FORWARD rotational scoop', K23 'Half kneeling LEFT Facing LEFT LEG UP rotational scoop', K24 'Half kneeling LEFT Facing RIGHT LEG FORWARD rotational scoop', K25 'Alternating Back to wall Rotational Scoops', K26 'Situps to chest pass', K27 'Situps to overhead throw'
* **slam_ball** (2): K16 'Rotational Floor side to side slams', K28 'Rotational Downward Slam Throw'
* **barbell_bumpers_platform** (4): C91 'Power Snatch', C93 'Power Clean & Jerk', C94 'Snatch', C96 'Clean & Jerk'
* **barbell** (10): C12 'High hang clean pull', C13 'Mid hang clean pull', C14 'High hang snatch pull', C15 'Mid hang snatch pull', C49 'High hang clean pull', C50 'Mid hang clean pull', C51 'High hang snatch pull', C52 'Mid hang snatch pull', C53 'Low hang clean pull', C54 'Low hang snatch pull'
* **hex_bar** (2): C11 'Hex bar squat to calf raise', C48 'Hex bar squat to calf raise'
* **dumbbell** (4): G136 'DB Depth drop dbs Jump', G137 'SL DB depth drop dbs jump', G138 'DB Ankle hops', G139 'DB repeat squat jumps'
* **hurdles** (6): G91 'Bilateral Forward Hurdle Hops', G92 'SL Forward Hurdle Hops', G93 'Bilateral Lateral Hurdle Hops', G94 'SL Lateral Hurdle Hops', G96 'Right Angle Bilateral Forward/ Lateral/forward/lateral hurdle hops', G134 'Hurdle Hops'
* **step_low** (9): G9 'Low Depth Drop', G11 'Medium Depth Drop', G13 'Low Box Jumps (half shin)', G14 'Mid Box Jump (up to knee)', G56 'SL Depth Drops', G130 'SL Depth Jumps', G131 'Depth Jumps', G136 'DB Depth drop dbs Jump', G137 'SL DB depth drop dbs jump'
* **plyo_box_high** (1): G133 'High Depth Drop (above hip)'
* **two_boxes** (1): G132 'Depth Drop to Box Jump'
* **pullup_bar** (4): O15 'Toes to bar', O16 'Knees to chest', O130 'Hanging Rotational Knee/Leg Raises', O209 'Hanging rotational knees to chest'
* **cardio_machine_cal** (9): B133 '10 cals', B134 '15 cals', B135 '20 cals', B136 '25 cals', B137 '30 cals', B138 '35 cals', B139 '40 cals', B140 '45 cals', B141 '50 cals'
* **open_space_long** (2): G128 'Max velocity running (top speed)', G140 'Bounding'
* **open_space_short** (9): L9 'FADE', L10 'SLANT', L11 'POST/CORNER', L12 'FLAT', L13 'Shuffles', L46 'DIG/OUT', L47 'LEFT TEST', L91 'COMEBACK/CURL', L92 '2005-05-10 00:00:00 (date cell, displayed '5/10/05'; typed value was '5-10-5')'
* **cones** (2): L47 'LEFT TEST', L92 '2005-05-10 00:00:00 (date cell, displayed '5/10/05'; typed value was '5-10-5')'
* **wall** (1): K25 'Alternating Back to wall Rotational Scoops'


### Pooled per program slot

Each slot's dropdown offers all of its levels at once, so the counts below are distinct names per dropdown. The order is P1 / P2 / P3 / P4 / P5, out of the total in brackets.

| Program slot (template label) | Dropdown | Distinct names | P1 | P2 | P3 | P4 | P5 |
|---|---|---|---|---|---|---|---|
| 'Aerobic Capacity' / 'Cardio' (8 tabs) | B7:B122 | 20 | 20 | 20 | 20 | 20 | 20 |
| 'Tripple Extension' | C7:C242 | 27 | 13 | 14 | 14 | 23 | 27 |
| 'Plyo' | G7:G162 | 38 | 26 | 30 | 30 | 30 | 38 |
| 'Throwing' | K7:K87 | 20 | **0** | **0** | 20 | 20 | 20 |
| 'COD' | L7:L242 | 9 | 9 | 9 | 9 | 9 | 9 |
| 'Core' | O7:O283 | 17 | 10 | 13 | 17 | 17 | 17 |

---

## 4. Findings by segment

### 4.1 TRIPPLE EXTENSION (C, D, E; ankle track C126:C136 = F)

**Does ADVANCED mean barbell Olympic lifts? Yes, entirely (OBSERVED names).** All 6 ADVANCED items (C91:C96 = E9:E14) are barbell Olympic lifts:

* 'Power Snatch'
* 'Power Clean'
* 'Power Clean & Jerk'
* 'Snatch '
* 'Clean '
* 'Clean & Jerk'

Four of them need **bumper plates and a place to drop the bar** (INFERRED): both snatches and both clean & jerks. A typical commercial gym (P4) can therefore offer only 'Power Clean' and 'Clean', lowered under control. Without a barbell (P1 to P3) the ADVANCED block has **0 options**.

**The barbell appears already at FOUNDATIONAL.**

* **FOUNDATIONAL** (C9:C15) has 7 items:
  * 4 barbell pulls: 'High hang clean pull', 'Mid hang clean pull', 'High hang snatch pull', 'Mid hang snatch pull'
  * 1 hex bar: 'Hex bar squat to calf raise'
  * 2 bodyweight: 'BodyWeight Squat to calf raise', 'Lunge to high knee reach'
* **MODERATE** (C46:C54) has 9 items:
  * 6 barbell (the 4 pulls plus 'Low hang clean pull' and 'Low hang snatch pull')
  * 1 hex bar
  * 'Weighted squat to calf raise', with the implement unstated (DB, KB or bar)
  * 'Lunge to high knee reach'

So level here measures **technical complexity and start position (ROM)**, not equipment (L1 notes reached the same conclusion). The implement stays a barbell from FOUNDATIONAL through ADVANCED. What changes:

* the start height: high hang, then mid (knee), then low (below knee), then floor
* whether a catch is added: pull, then power lift, then squat lift

**The equipment-free part of the TE dropdown is the ankle track.** The 'JUMPING ANKLE' block C126:C136 has 11 items, all bodyweight, so it is available in P1. In a no-gym profile, 13 of the 27 TE names remain: 11 ankle hops, the BW squat to calf raise, and the lunge. Every one of them shifts the slot from **strength-speed** (barbell) to **reactive / starting-speed** (bodyweight).

Substitute logic per item (INFERRED, coach-consistent):

* **No barbell:** hex-bar jump shrug, or the library's own 'Hex bar squat to calf raise' (C11). Next come DB/KB derivatives the coach already uses: 'Staggered stance DB snatch' (`EXAMPLE ATHLETIC FULL BODY SPLI`!C28) and 'KB Squat cleans' (`BASEBALL`!BC33).
* **Bodyweight only:** 'Tuck Jumps' (G129) or 'Depth Jumps' (G131), i.e. unloaded triple extension.
* **Bands only:** the coach's 'BILATERAL REVERSE BANDED JUMPS' (`ALL ABOUT BALLISTICS`!D38) or 'banded  jumps' (`BASEBALL`!CQ52).

### 4.2 PLYOS (G to J)

Plyos are the most equipment-diverse segment. Among the 39 dropdown rows:

* 35 involve bodyweight.
* 13 need a box, bench or step.
* 13 need hurdles or plates.
* 4 need dumbbells.
* 2 need a track or field.

All plyos are constraint level 1 by definition (open space, ballistic or reactive).

**Box and height ladder (NAME-DERIVED):**

| Item | Height |
|---|---|
| 'Low Box Jumps (half shin)' | half shin |
| 'Mid Box Jump (up to knee)' | knee |
| 'Low Depth Drop' | low |
| 'Medium Depth Drop' | medium |
| 'High Depth Drop (above hip)' | above hip |
| 'Depth Drop to Box Jump ' | needs two boxes |

**Plate hops (G46:G52):**

* Seven items, all hopping on and off a weight plate laid flat. OBSERVED:
  * 'Bilateral Symetrical jump on to plate' 1 x 20 and 'SL Jump on to plate forward/back' 1 x '20/20' (`EXAMPLE ATHLETIC FULL BODY SPLI`!H29:J30)
  * 'single leg hop on and off of plate' (`BASEBALL`!AO29)
* A low stair step or curb is a valid substitute (INFERRED), so P1 keeps them.
* The plate is a **target**, not a load.

**Hurdles:**

* 6 items: 5 in the second MODERATE block (G91:G96, except ' Push up Box Jump ') plus 'Hurdle Hops' in ADVANCED (G134).
* These are the only plyos lost in a commercial gym (P4: 12 of 17 MODERATE rows remain).
* Coach dose: 'Hurdle hops' 2 x 20 (`BASEBALL`!CO29:CQ29).

**Dumbbell plyos** are all ADVANCED (G136:G139):

* 'DB Depth drop dbs Jump' is the coach's 'BILATERAL DROP WEIGHTED, DELOAD WEIGHT & JUMP' (`ALL ABOUT BALLISTICS`!C40). The load is present only on the drop and released before the jump. This is the cleanest use of equipment to change velocity in the library.
* 'DB Ankle hops' also appears as 'DB heavy ankle hops' (`BASEBALL`!E56). Its medball twin is 'MEd ball hug ankle hops' (`BASEBALL`!DQ30).
* For 'DB repeat squat jumps' the coach cue is 'Really high jump squats LOAD & jump hard' (`EXAMPLE ATHLETIC FULL BODY SPLI`!C14). Jump height must not drop. SCIENCE: loaded jumps at about 0 to 30% of squat 1RM give the highest power output (Cormie, McGuigan & Newton 2011).

**Open space:** 'Max velocity running (top speed)' and 'Bounding' need a 40 to 60 m runway. They are the only P4 (commercial gym) gaps besides hurdles and boxes above hip height.

**Overall:** the plyo slot is the most equipment-tolerant athletic slot. P1 keeps 26 of 38 names and P4 keeps 30.

### 4.3 THROWING (K)

* **20 of 20 throws need a medball.** Two of them ('Rotational Floor side to side slams', 'Rotational Downward Slam Throw') need a **non-bounce slam ball**.
* Seventeen need a **wall or partner** to receive the ball. 'Alternating Back to wall Rotational Scoops' needs the wall itself as the reference behind the athlete.
* The Throwing slot therefore has **0 options in P1 and P2**. It is the clearest case of an athletic slot that is impossible without one specific piece of equipment.

Load: light, 8 to 10 lb for passes and rotations (COACH-CHAT). Velocity is max, F-V zone is speed-strength.

Constraint values vary inside the list:

* **Level 1:** standing and stepping throws.
* **Level 2:** the 4 half-kneeling scoops and the back-to-wall scoops. Kneeling or a wall adds reference points and pins the pelvis, so the throw loads one hip. The coach's cheat sheet labels them 'INTO THE LEFT LEG/HIP' and 'OUT OF THE RIGHT LEG/HIP' (`ALL ABOUT BALLISTICS`!D65:D68).
* **Level 3:** the 2 sit-up throws, done supine on the floor.

The half-kneeling throws are also the only throws tagged `injured/pain`, because they remove lower-limb impact (INFERRED).

Substitutes when there is no ball (INFERRED; observed coach exercises quoted):

| Throw type | Bodyweight | Bands |
|---|---|---|
| Push-type throws | 'Plyo pushups' (G141) | fast band press ('Bands are designed for speed/velocity') |
| Rotational throws | 'cross connect rolls/rocking' (`CONTROL PATTERNSCORE`!B32) | band chop or punch |
| Slams | 'FAKE MEDBALL SLAM & RETURN ANY WAY POSSIBLE' (`ALL ABOUT BALLISTICS`!C46; meaning is an open question) | — |

With a kettlebell, rotational throws can become 'Kb rotation swings no hip thrust' (`CONTROL PATTERNSCORE`!B16).

### 4.4 CHANGE OF DIRECTION (L to N)

All 9 items are bodyweight in open space, constraint 1, and need only 10 to 20 m. They are available in every profile.

* 'LEFT TEST' (L47, the L-test / 3-cone drill) and the date-corrupted '5-10-5' (L92) need **3 cones**. Shoes or bottles work.
* The F-V zone is starting-strength/speed: acceleration and braking at bodyweight.
* The progression lever is **turn severity** ('EASY TURN', 'MOD. TURN', 'HARD TURN' in row 5), not equipment.

### 4.5 CARDIO (B)

* **Every option reachable through `B7:B122` is a run or walk-run prescription.** `B7:B122` is the range used by every cardio slot in all 8 tabs that have one. That is 20 distinct items: 'SPEED INTERVALS', 'DISTANCE INTERVALS', 'DISTANCE TEST' and 'SPEED TEST'. The equipment needed is a place to run, or a treadmill.
* The only machine-dependent block is 'CALORIES' ('10 cals' to '50 cals', B133:B141). It sits next to the modality-free 'DISTANCE' block (B124:B128) at rows 123 to 141. Both are reachable **only** from BOOTCAMP - OPTION 2 slots E7, E12, E22 and E27, which use B7:B335.

So the library under-represents the coach's own practice of rotating bike, ski and row. A generator should treat every cardio item as **modality-free**, just as the coach writes 'Any Cardio Equipment' and '(cardio of choice)'. Then:

* Use a bike (constraint 5) for injured or older clients.
* Convert calories to time for clients with no machine.

### 4.6 CORE THORAX and CORE PELVIS (O to T; dropdown O7:O283)

* 17 distinct items. 10 need nothing.
* **Pull-up bar** (4): 'Toes to bar', 'Knees to chest' (hanging reading, from the coach pairing 'toes to bar or knees to chest' in `BASEBALL`!J31), 'Hanging Rotational Knee/Leg Raises' and 'Hanging rotational knees to chest'.
* **Cable** (2): 'Woodchoppers' (implement ambiguous) and 'Cable Machine Oblique Rotations'. **Bench** (1): 'Coppenhaggen Plank'. **Load** (1): 'Weighted Situps' (DB, plate or medball).
* The only CORE PELVIS TRANSVERSE item is 'Hanging rotational knees to chest' (T9 = O209 = R91). That level therefore has **0 options without a bar** in P1 and P2. Substitute: 'windshield wipers' / 'hip turns' (`CONTROL PATTERNSCORE`!B18:B20).
* Core constraint is mostly 2 or 3: floor-supported, or a hang with one fixed grip. No core item is machine-supported.

---

## 5. Training variables, as encoded in the tags (for the generator)

### Load, velocity and the force-velocity zone

SCIENCE: Hill 1938; Haff & Nimphius 2012; Cormie et al. 2011; Suchomel, Comfort & Stone 2015. It matches the coach's "heavier = slower, lighter = faster".

| F-V zone (tag) | Typical load / implement | Library items | Coach evidence (OBSERVED) |
|---|---|---|---|
| strength_speed | moderately heavy barbell, max intent (~70-90% of lift max) | all 6 Olympic lifts, 10 hang pulls | 'Hang cleans @ 75%' -> '@ 90%' (BASEBALL!CM33..DH50); 'FAST RPE6 or about 60-70%' (4 TRACKS!N17) |
| speed_strength | light external load moved fast (8-10 lb ball, light DBs, hex bar ~30-50%) | 20 throws, 'Weighted squat to calf raise', 'Hex bar squat to calf raise', 'DB repeat squat jumps', 'Bulgarian Split Jumps', 'Push up Box Jump' | 'MB fast chest pass ' (BASEBALL!AW47); bands at '~50% so you can move fast' (SQUATS!B36) |
| starting_strength/speed | bodyweight, single maximal effort or acceleration | box jumps, BW squat-to-calf-raise, lunge drill, all COD, max-velocity running | 'Falling start accelerations' (AEROBIC CAPACITY CHEAT SHEET!F32) |
| reactive | bodyweight (or released load), short ground contact, repeated | ankle/plate/hurdle hops, squirrel jumps, depth jumps/drops, tuck jumps, bounding, plyo push-ups | coach: 'PLYOMETRIC PURPOSE - BE REACTIVE & BOUNCY' ... 'REACTIVE CONNECTIVE TISSUE ADAPTATIONS' (BALLISTICS!D22:D23) |
| n/a | — | core (pattern 'CONTROL'), cardio (energy systems) | — |

**Rule for the generator (COACH-CHAT + SCIENCE).** For any athletic slot, pick the **heaviest implement that does not slow the movement**. If the rep slows or the jump height drops, the load is too heavy for the slot's purpose. 'SPEED/POWER' is the row-6 PURPOSE on every C to K column (OBSERVED).

**Session order.** The order follows the force-velocity curve and the constraint gradient. The athletic template day is OBSERVED in `NO ACCESS - ATHLETIC - FB - 4 t`!C3:D12:

* 'Plyo', 'Plyo', 'Throwing', 'COD': reactive and speed, constraint 1, bodyweight or light ball
* then 'Tripple Extension': strength-speed, constraint 2, barbell
* then 'Bilateral KD', 'Horizontal Pull', 'Unilateral KD', 'Vertical Pull': strength and resistance
* ending with 'Leg Extensions': a selectorized machine, constraint 5

This is the coach's sentence in the brief, "power first for athletics, then... power strength..., then strength..., then the resistance movements", written into the template. INFERRED reading: the session moves from **least constrained and fastest** to **most constrained and slowest**.

### Range of motion

* **mid / partial (limited knee):** hang pulls from high or mid hang; all ankle, plate and squirrel hops ('JUMPING LIMITED KNEE' per Sheet23); the half-kneeling throws, where the pelvis is pinned.
* **full:** low-hang pulls, all Olympic lifts, squat-to-calf-raise drills, box jumps, most throws, sit-ups, V-ups, leg raises.
* **variable:** depth drops and jumps (drop height), hurdles (hurdle height), cardio, COD.

None of these items are lengthened-partial or end-range. Those belong to the resistance library.

### Volume units

Each item carries a `volume_unit`. The coach's weekly-sets progression ("20 sets of chest this week, 22 next") applies to resistance slots. For athletic slots, the unit that adds up week to week is different:

* **ground contacts** for plyos (e.g. 'Hurdle hops' 2 x 20 = 40 contacts; squirrel jumps 1 x 40)
* **throws** for medball work: 1 x 10 per throw in the cheat sheet; the athletic templates have 4 'Throwing' slots a week (L1 notes), prefilled 2 x '8 to 12 Reps' (JUSTICE LEAGUE!F5:G5)
* **runs** for COD ('6 to 8 Reps', JUSTICE LEAGUE!G6)
* **reps x %** for Olympic lifts

INFERRED generator rule: progress athletic slots by **+contacts / +throws within a block** (same exercises). Change the **equipment variable** (box height, plate size, hurdle height, ball weight, DB load, band) only at block boundaries. The coach says "not a lot of new things... in the next block you can change some small variables" (COACH-CHAT). The library's own G53 rule ('Bigger plates start at lateral bilateral plate hops') is exactly this kind of between-block equipment change.

---

## 6. Generator rules derived from this layer (INFERRED unless cited)

1. **Filter.** Keep items whose `requires_any_of` contains at least one kit that is a subset of the client's equipment. Then filter by level and `suitable_for`.
2. **When a slot block is empty**, fall back in this order:
   1. Another level of the same block, if allowed.
   2. `substitutes_by_equipment[key]` for the client's situation: `no_barbell`, `db_only`, `bands_only` or `bodyweight_only`.
   3. A cross-segment move with the same quality:
      * Throwing becomes 'Plyo pushups' or band throws.
      * Advanced TE becomes DB/KB derivatives or unloaded jumps.
      * Calories become time-matched runs.
      * Pelvis transverse becomes windshield wipers.
3. **Pain or injury flag.** Apply the observed pain rule first: move from fixed grips to split grips and unilateral work. Then prefer:
   * constraint 2 or more
   * `impact_intensity` low
   * the half-kneeling or seated throws
   * the BW squat-to-calf-raise
   * low box jumps, which land on the box
   * bike for cardio

   Avoid depth jumps, high depth drops, hurdle hops and bounding.
4. **Older adults.** Use the same constraint preference. Athletic work is limited to: 'BodyWeight Squat to calf raise', light medball chest pass / squat to chest pass, 'Shuffles', walk-run intervals, plank and side plank, crunches, leg raises.
5. **Beginners.** Keep the coach's level label. FOUNDATIONAL TE pulls are barbell lifts: offer them only to a "beginner athlete" with access to coaching. Otherwise use the BW drills and the ankle track.
6. **High-volume clients.** Medball throws (low fatigue), bilateral ankle hops and squirrel jumps (low amplitude), and floor core all tolerate many sets. Barbell Olympic lifts and depth jumps do not: keep reps low.
7. **Templates labelled 'NO ACCESS' are not equipment-free.** They use the identical dropdowns, and the NO ACCESS - ATHLETIC tab prefills a machine ('Leg extensions', E12/E39). Equipment filtering must come from the client's answers, not from the template name.

---

## 7. Kit vocabulary used in `requires_any_of`

| token | meaning |
|---|---|
| `floor` | floor/ground space only (always available) |
| `wall` | solid wall to throw against or lean on |
| `partner_or_wall` | partner to catch, or a wall to rebound |
| `step_low` | stable step/curb/low box up to knee height (stairs, park bench, aerobic step) |
| `bench` | flat bench or sturdy chair/park bench at ~knee height |
| `plyo_box_high` | plyo box at or above hip height |
| `two_boxes` | two boxes (drop box + jump box) |
| `open_space_short` | 10-20 m of clear running/cutting space |
| `open_space_long` | 40-60 m+ runway/track/field |
| `cones` | cones or markers (shoes, bottles work) |
| `hurdles` | mini/adjustable hurdles |
| `plate_low_target` | weight plate laid flat (or any low, stable target) |
| `medball` | medicine ball (light, 8-10 lb per coach for passes/rotations) |
| `slam_ball` | non-bouncing slam ball (or medball on a safe floor) |
| `dumbbell` | dumbbells |
| `kettlebell` | kettlebell(s) |
| `barbell` | straight barbell + plates |
| `barbell_bumpers_platform` | barbell + bumper plates + space/platform where dropping is allowed |
| `hex_bar` | hex/trap bar + plates |
| `cable` | cable column |
| `band` | resistance band (with anchor point) |
| `pullup_bar` | pull-up bar (or rings/park bar to hang from) |
| `cardio_machine_cal` | cardio machine with calorie/meter readout (bike, rower, ski erg) |
| `treadmill` | treadmill |

---

## 8. Data-quality flags that matter for equipment

* **G53 / H16** is a rule, not an exercise ('Bigger plates start at lateral bilateral plate hops'). It is `record_type: progression_note` and is never `is_primary`.
* **L92 / N10** hold datetime 2005-05-10, which was typed as '5-10-5'. The kit needs cones.
* Names that do not state the implement (`implement_ambiguous: true`, 35 of 152 rows):
  * 'Weighted squat to calf raise'
  * 'Weighted Situps'
  * 'Woodchoppers'
  * 'Russian Twists'
  * 'Knees to chest' (hanging vs floor)
  * 'Bulgarian Split Jumps' (rear foot elevated or not)
  * ' Push up Box Jump ' (hands-on-box plyo push-up vs push-up followed by a box jump)
  * 'Push up Stick the Landing'
  * all 'plate hops' (plate vs any low target)
  * all cardio intervals and 'DISTANCE' / 'CALORIES' items, where the modality is unstated
* 'Cable Machine Oblique Rotations' is the only name in A to T that says "machine", and it is a cable. **No selectorized or plate-loaded machine, Smith, sled, landmine or GHD appears anywhere in A to T.** Those classes exist only in the resistance columns (U onward), so they are handled by the parallel resistance-equipment work.

---

## 9. Open questions for the coach (equipment and variables)

1. **Medball weight per throw.**
   * Is 8 to 10 lb right for all 20 throws, or do slams, sit-up throws and rotational scoops go heavier?
   * Does it change for youth, female or older clients?
   * Do the two slam items ('Rotational Floor side to side slams', 'Rotational Downward Slam Throw') need a non-bounce slam ball?
2. **No medball.** The Throwing slot is empty in P1 and P2. What should go there?
   * Skip the slot?
   * 'Plyo pushups' or fast band presses/chops?
   * What does 'FAKE MEDBALL SLAM & RETURN ANY WAY POSSIBLE' (`ALL ABOUT BALLISTICS`!C46) mean? Is it a no-ball slam you would accept as a substitute?
3. **Advanced Olympic lifts without bumper plates or a platform** (most commercial gyms):
   * Allow 'Power Clean' and 'Clean' lowered under control?
   * Or swap to DB/KB snatches and cleans ('Staggered stance DB snatch', 'KB Squat cleans') or hex-bar jumps?
   * Is a hex bar an acceptable stand-in for the barbell across the TE slot?
4. **Default implement for ambiguous names:**
   * 'Weighted squat to calf raise' (DB, KB or bar?)
   * 'Weighted Situps' (DB, plate or ball?)
   * 'Woodchoppers' (cable, band, ball or DB?)
   * 'Russian Twists' (bodyweight or plate?)
   * 'Knees to chest' (hanging or floor?)
5. **Exact meaning of the push-up plyos:**
   * ' Push up Box Jump ': hands landing on boxes, or a push-up followed by a box jump?
   * 'Push up Stick the Landing'
   * Is 'Bulgarian Split Jumps' done with the rear foot elevated?
6. **Implement sizes as numbers:**
   * Box heights for 'Low', 'Medium' and 'High Depth Drop (above hip)' and for the half-shin and knee box jumps.
   * Hurdle heights for MODERATE hurdle hops vs ADVANCED 'Hurdle Hops'.
   * Which plate is used for plate hops (10, 25 or 45 lb bumper)?
   * Does "Bigger plates" (G53) mean thicker/higher or wider?
   * Is a stair step an acceptable plate substitute?
7. **DB loads for the DB plyos** ('DB Depth drop dbs Jump', 'DB Ankle hops', 'DB repeat squat jumps'). Fixed pounds, or a percentage of bodyweight? What is the rule for "too heavy", e.g. jump height drops?
8. **Cardio modality.**
   * Should the 'DISTANCE' and 'CALORIES' blocks (B123:B141) be open to every template? Today only BOOTCAMP - OPTION 2 reaches them.
   * Should every running item be allowed on a bike, rower or ski (the 'Any Cardio Equipment' rule)? Is a treadmill valid for 'SPEED TEST' and 'DISTANCE TEST'?
9. **Older and injured clients in athletic templates.** Do they get athletic slots at all? If yes, should those slots move to machine-based power to match "more machines" for these groups? Options:
   * fast leg press
   * banded or cable power
   * bike sprints
   * seated or half-kneeling throws
10. **Hanging core without a bar.** Would you accept a captain's-chair or vertical knee-raise station (back pad, constraint 4 to 5), or only floor versions ('windshield wipers', 'Reverse Crunches')?
11. **What 'NO ACCESS' means** on the two hidden templates. If it means "no gym", those templates need an equipment-free dropdown pool. Today they offer barbell Olympic lifts, boxes, hurdles and medballs, and prefill 'Leg extensions'.
12. **Intake questions.** Are these 5 equipment profiles right?
    * no gym
    * home with DB and bands
    * home athlete
    * commercial gym
    * performance facility

    Which yes/no questions should a client answer? Candidates:
    * medball?
    * boxes?
    * hurdles?
    * 40 m to sprint?
    * bumper plates / can drop the bar?
    * cables?
    * pull-up bar?
    * bike, rower or ski?
13. **Equipment as the "small variable" between blocks.** Box height, plate size, hurdle height, ball weight, DB load and bands: can the generator change exactly one of these per block while keeping the exercises the same, as G53 implies?

