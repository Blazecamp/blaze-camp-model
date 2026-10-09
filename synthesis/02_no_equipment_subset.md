# 02 - No-equipment and home subset of the catalog (v1.1, no bands)

**Source:** `synthesis/02_exercise_catalog.json` v1.1 (equipment set-ups, generator pools and eligibility per record). Read-only - no Google Sheet was modified. Evidence labels: OBSERVED / COACH-ANSWER <ID> (round 1) / COACH-R2 <ID> (round 2, `coach_answers_round2.md`) / INFERRED / SCIENCE / PROPOSED / PROPOSED-ADDITION (v1.1 sport items, pending approval).

## v1.1 - round-2 answers applied

- **'NO ACCESS' answered (COACH-R2 R2-LIB-08):** it is the self-serve version of the templates, without coach access, using the full gym library. Its 'Unilateral HD' slot reads the single-leg hinge list (AQ7:AQ42), not the leg curls (AR) - section 0 and the section 6 tables now use AQ for E12 / E33 (aesthetics) and E19 / E46 (athletic). The rest of the wiring is the OBSERVED one.
- **Coach-approved home items (COACH-R2 R2-LIB-07):** the v1 PROPOSED fixes are now library records - Table Row (inverted row under a sturdy table, bodyweight horizontal pull), Floor Prone Y / T Raises (bodyweight shoulder isolation) and Kettlebell Curl (the KB-only client's curl). Gaps closed: BW: Horizontal pull; BW: Shoulder isolation (side / rear / front); BAR: Shoulder isolation (side / rear / front); KB: Biceps; FIELD: Horizontal pull; FIELD: Shoulder isolation (side / rear / front).
- **KB face pull = shoulder work (COACH-R2 R2-LIB-04 / LIB-10):** it now sits in the shoulder-isolation pool in the catalog too (v1 listed it there only here, as an assumption).
- **Bench push-ups (COACH-R2 R2-LIB-05):** two records - hands on the bench (FOUNDATIONAL) and feet on the bench (ADVANCED); both are bodyweight + a bench or chair.
- **21.6-mile run removed (COACH-R2 R2-LIB-06):** gone from the cardio lists and tests.
- **KB swings (COACH-R2 R2-VOL-05):** ballistic, 0 sets: they now also feed the triple-extension (power) pool, so a KB-only client gets them there; in the hip-dominant pool they stay a swap that fills no hinge sets and are never the default pick there (catalog `generator.default_candidate_by_pool`; the v1.1 adversarial check removed their `*` from the two hip-dominant pools and the KB counts in section 2). **R2-LIB-07** also made the KB squat clean, single-arm DB snatch, hang clean and hex-bar jump default Olympic options.
- **Older adults (COACH-R2 R2-ATH-08):** no Olympic lifts, plyos or depth jumps by default for 60+ (opt-in with the warning 'Make sure that you have a fitness professional to help you understand what this means.'); jumping conditioning items get a no-jump version, and the PROPOSED split-step drill defaults to its no-hop version (v1.1 adversarial check; catalog 10.3 #3). Rule 6 in section 8 says so.
- **Athletic tags (COACH-R2 R2-ATH-02 / R2-ATH-03 / R2-ATH-04):** every jump and throw is ballistic / plyometric / receive; every jump has its Receive-Create stage (1 Land, 2 Land & Go, 3 Repeat); Olympic lifts are clean-day or snatch-day lifts (see the catalog, section 2.4).
- **One detail between blocks (COACH-R2 R2-LIB-01):** at home an advanced client progresses by changing one detail of a library exercise (which hand holds the weight, grip, stance, implement, range) - rule 4.
- **New pools (v1.1):** arm care (shoulder external rotation, scapular push-up, dead hang, wrist extension - PROPOSED-ADDITION, plus the 3 v1 program-only arm-care drills) and neck (two PROPOSED-ADDITION neck exercises). The other 15 PROPOSED-ADDITION items join their pools (e.g. wall sit, single-leg balance reach, streamline hold, tibialis raise, ruck walk are bodyweight; sled rope pull and the ergs are gym-only). They are swaps, never default picks, until the coach approves them.
- **Corrected v1 count:** the NO ACCESS Plyo dropdown counted the Max-Velocity Sprint, which LIB-21 moved to the SPRINT pool (39 -> 38 options).

## v1 - coach answers applied (kept as history; round 2 changed the items marked v1.1)

- **No bands anywhere** (COACH-ANSWER EQ-01, EQ-02, EQ-07, EQ-08, EQ-12). The v0 'T1 = bands + door anchor' kit is gone; 36 band or variable-resistance records are out of scope and every band substitute was replaced by a non-band option (list in section 7).
- **Organised by home profile** instead of only by tier: bodyweight only, doorway bar, kettlebells only, dumbbells + bench, the ideal home kit and the field / track kit (EQ-01 intake options, EQ-02 home kit).
- **Generator pools** (v1) replace the raw BYOP dropdowns: knee-flexion work has its own LEG FLEXION pool (CAT-09); the speed session is its own pool (LIB-21); out-of-scope and retired records never appear.
- **Non-band fixes from the coach**: no leg-extension / leg-curl machine -> sissy squats, Nordics, slider or swiss-ball curls (EQ-08); no medball -> plyo push-ups, fast cable rotations or the fake medball slam, never band chops (EQ-07); medballs never over 20 lb (EQ-06).
- **'JUSTICE LEAGUE'** is only a marketing name (ATH-13, FIX-03): it is called 'Athletic - general (non-competitive adults and youth)' here; the tab name stays verbatim in OBSERVED cell references.
- **Adversarial check (2026-10-08):** the catalog JSON still labelled T1 'bands, doorway bar, rope' on 38 active records (fixed to the no-band kit above); band cues / links that could still reach a client (plyo push-up alias cue, the banded-leg-extension video inside the leg-extension entry, band drags in two drag headings, 8 `related` links to band / chain variants) are now marked out of scope. No pool count in this file changed. See the verification log at the end.
- **Second adversarial check (2026-10-08):** the Hex-Bar Jump Squat now also feeds the triple-extension pool (ATH-10; gym count 44 -> 45, no home profile changes); the aerobic Blue / Green / Orange and lactate-clearance work runs on any erg for non-runners (EQ-14); A-drills are warm-up drills, never counted (ORD-08); the High Depth Drop's bodyweight stand-in no longer suggests a drop from a wall or stage (EQ-16) and it is 'never' for older / injured clients (INFERRED from EQ-03, pending); rotational throws without a ball use the coach's fake medball slam first (EQ-07); rule 6 now says medball *throws* (not all medball work) are warm-up only for aesthetics clients (ATH-05) and adds the pitcher (ATH-08) and boxer (ATH-04) rules. See the log at the end.
- **Still pending (v1):** what 'NO ACCESS' means (PRG-01, SKIP) and whether its Unilateral HD slots should read AQ (single-leg hinge) instead of AR (leg curls) (FIX-01, SKIP) - section 6 keeps the OBSERVED wiring. The bodyweight-only fixes marked PROPOSED (table inverted row, prone floor Y / T raises) need the coach's approval. **v1.1: all answered - R2-LIB-08 (self-serve version, AQ) and R2-LIB-07 (table row, floor Y / T raises and a KB curl approved).**

## 0. What "NO ACCESS" means here

**COACH-R2 R2-LIB-08 (v1.1):** 'NO ACCESS' is the self-serve version of the program templates - the person builds the plan without coach access - and it uses the full gym library; its 'Unilateral HD' slots must read the single-leg hinge list (AQ7:AQ42), not the leg curls. Section 6 applies that. The OBSERVED wiring below is kept for traceability.

**OBSERVED:** the two hidden tabs 'NO ACCESS - AESTHETICS - FB - 4' and 'NO ACCESS - ATHLETIC - FB - 4 t' are *not* equipment-filtered. Their 88 exercise dropdowns read the same library ranges as AESTHETICS / ATHLETIC, except that the 'Hamstring/Glutes' / 'Unilateral HD' slots (E12/E33 in the aesthetics copy, E19/E46 in the athletic copy) point at `AR7:AR42` (LEG CURLS) instead of `AQ7:AQ42`, so as wired they are the most machine-dependent templates. The coach skipped the question about the name in round 1 (COACH-ANSWER PRG-01: SKIP / NOT SURE) and the wiring fix (FIX-01: SKIP); round 2 answered both (R2-LIB-08). This file answers the practical question for the generator: with only bodyweight or a small home kit, which exercises fill each pool, and where are the holes.

## 1. Home profiles

| profile | name | kit | source |
|---|---|---|---|
| BW | Bodyweight only | floor, wall, stairs / sturdy chair or bench / couch, open space, towel as a slider, a tape line as a hop target, a pillow or ball to squeeze | EQ-01 option 'bodyweight only' |
| BAR | Bodyweight + doorway pull-up bar (minimal kit, no bands) | BW + doorway pull-up bar, jump rope, suspension trainer (TRX / rings), foam roller | INFERRED minimal kit (EQ-01/EQ-02 remove bands from it) |
| KB | Kettlebells only | BW + one or two kettlebells | EQ-01 option 'kettlebells only' |
| DB | Dumbbells + bench | BW + adjustable dumbbells + adjustable bench | EQ-01 option 'home DBs + bench' (bands removed) |
| HOME | Ideal home kit | BW + adjustable DBs + bench + pull-up bar + 8-10 lb medball (max 20 lb, EQ-06) | EQ-02: 'that'll be ideal for the home kit' - adjustable DBs + bench + pull-up bar + 8-10 lb medball, without the bands |
| FIELD | Field / track kit | BW + medballs (max 20 lb), cones, hurdles, plyo boxes, open space | EQ-01 option 'field/track/outdoor kit (medballs, cones, hurdles, boxes)' |

A record fits a profile when at least one of its `equipment.setups_any_of` uses only that profile's kit. Household stand-ins are listed per record in `equipment.household_substitutions` (e.g. 'box: stairs / sturdy step or bench (low heights only)'). SCIENCE / safety note: landings and depth drops off household furniture only at low heights on a stable surface (low box about 6-12 in, COACH-ANSWER EQ-16); anything above knee height needs a real plyo box. Tiers in the JSON (v1): T0 bodyweight + household, T1 doorway bar / jump rope / suspension trainer / low hurdles (no bands), T2 DB / KB / medball / bench, T3 gym.

## 2. Summary: eligible options per generator pool and profile

Each cell = eligible records (default candidates in brackets: BYOP-selectable or added by a coach answer, COACH-ANSWER CAT-07 / GEN-04). GAP = nothing in that profile.

| pool | all eligible (gym) | BW | BAR | KB | DB | HOME | FIELD |
|---|---|---|---|---|---|---|---|
| Plyo (PLYOS) | 83 | 61 [27] | 61 [27] | 61 [27] | 73 [31] | 74 [31] | 70 [34] |
| Jumping ankle / limited knee | 29 | 26 [22] | 28 [22] | 26 [22] | 26 [22] | 27 [22] | 29 [22] |
| Triple extension / Olympic | 48 | 2 [2] | 2 [2] | 9 [7] | 9 [6] | 9 [6] | 3 [3] |
| Throwing | 41 | GAP | GAP | GAP | GAP | 41 [16] | 41 [16] |
| Change of direction | 17 | 17 [9] | 17 [9] | 17 [9] | 17 [9] | 17 [9] | 17 [9] |
| Speed session (LIB-21) | 10 | 10 [7] | 10 [7] | 10 [7] | 10 [7] | 10 [7] | 10 [7] |
| Cardio / aerobic capacity | 85 | 70 [24] | 70 [24] | 70 [24] | 70 [24] | 71 [24] | 71 [24] |
| Core (thorax, pelvis, both, slings) | 92 | 50 [9] | 55 [13] | 57 [11] | 57 [13] | 71 [17] | 59 [12] |
| Vertical pull | 25 | GAP | 10 [8] | GAP | GAP | 10 [8] | GAP |
| Horizontal pull | 31 | 1 [1] | 3 [3] | 5 [3] | 9 [5] | 9 [5] | 1 [1] |
| Vertical push | 27 | 3 [2] | 3 [2] | 3 [2] | 18 [11] | 19 [11] | 4 [2] |
| Horizontal push (+ incline / mid-range) | 35 | 12 [10] | 12 [10] | 12 [10] | 21 [18] | 21 [18] | 12 [10] |
| Shoulder isolation (side / rear / front) | 23 | 1 [1] | 1 [1] | 3 [1] | 14 [10] | 14 [10] | 1 [1] |
| Bilateral knee dominant | 40 | 6 [4] | 7 [5] | 13 [11] | 17 [15] | 17 [15] | 6 [4] |
| Unilateral knee dominant | 21 | 17 [15] | 17 [15] | 17 [15] | 18 [15] | 19 [15] | 18 [15] |
| Leg extensions | 2 | GAP | GAP | GAP | 1 [0] | 1 [0] | GAP |
| Bilateral hip dominant | 27 | 4 [3] | 4 [3] | 8 [5] | 7 [6] | 7 [6] | 4 [3] |
| Unilateral hip dominant | 12 | 3 [3] | 3 [3] | 5 [4] | 8 [7] | 8 [7] | 3 [3] |
| Leg flexion (CAT-09) | 9 | 3 [2] | 3 [2] | 3 [2] | 4 [3] | 5 [4] | 4 [3] |
| Biceps | 21 | GAP | 1 [1] | 1 [1] | 14 [9] | 14 [9] | GAP |
| Triceps | 15 | 1 [0] | 1 [0] | 1 [0] | 5 [4] | 5 [4] | 1 [0] |
| Calves | 8 | 3 [1] | 3 [1] | 3 [1] | 6 [2] | 6 [2] | 3 [1] |
| Arm care: shoulder, elbow and grip care (v1.1) | 8 | 2 [0] | 3 [0] | 3 [0] | 5 [0] | 6 [0] | 2 [0] |
| Neck (PROPOSED v1.1) | 2 | 1 [0] | 1 [0] | 1 [0] | 1 [0] | 1 [0] | 1 [0] |
| Carries and drags (PROPOSED, LIB-19) | 10 | GAP | GAP | 4 [0] | 3 [0] | 3 [0] | GAP |

- **BW gaps:** Throwing, Vertical pull, Leg extensions, Biceps, Carries and drags (PROPOSED, LIB-19).
- **BAR gaps:** Throwing, Leg extensions, Carries and drags (PROPOSED, LIB-19).
- **KB gaps:** Throwing, Vertical pull, Leg extensions.
- **DB gaps:** Throwing, Vertical pull.
- **HOME gaps:** none.
- **FIELD gaps:** Vertical pull, Leg extensions, Biceps, Carries and drags (PROPOSED, LIB-19).

## 3. Gaps and non-band fixes

- **Triple extension / Olympic** - no gap in any profile. Bodyweight: squat to calf raise, lunge to high-knee reach and the jump options. Everyone in athletic training still gets an Olympic-type lift (ATH-10): KB squat clean (KB) and single-arm DB snatch (DB) are now default library options (COACH-R2 R2-LIB-07), plus the DB-KB high pull; hex-bar jumps and hang pulls in a gym. v1.1: KB swings (ballistic, R2-VOL-05) also fill this pool for a KB-only client. For 60+ clients the Olympic lifts are off by default (R2-ATH-08).
- **Throwing** - empty in: BW, BAR, KB, DB. v1.1: the PROPOSED Wall Ball (HYROX / CrossFit) also needs a ball (max 20 lb, EQ-06) and a wall. No medball (EQ-07): plyo push-ups or push-up stick-the-landing for the pressing throws, the coach's 'Fake Medball Slam & Return (any way possible)' for slams, fast cable rotations only where a cable exists. No band chops. A medball (8-10 lb, never over 20 lb) is part of the ideal home kit and the field kit.
- **Cardio / aerobic capacity** - no gap in any profile. v1.1: the 21.6-mile run is gone (R2-LIB-06); the PROPOSED HYROX pieces (SkiErg / rower distance pieces) need a gym erg, while the compromised run, burpee broad jump and ruck walk need only open space (the burpee broad jump is off by default for 60+, R2-ATH-08). Running intervals, distance repeats and tests need only open space; calorie efforts need an erg (any erg: bike, rower, ski, EQ-14). Non-runners can do the Blue / Green / Orange aerobic intervals and the lactate-clearance work on whatever tool they have (bike, rower, ski erg, treadmill): the times carry over directly and distance is still tracked (COACH-ANSWER EQ-14, `modality_v1`).
- **Vertical pull** - empty in: BW, KB, DB, FIELD. No true vertical pull without a bar: the doorway pull-up bar is the minimum (BAR profile). Without it, keep the back trained through the horizontal-pull options and say the vertical pull is missing. Band-assisted pull-ups are out (EQ-01); use jumping / eccentric pull-ups or seated ring / TRX pull-ups instead.
- **Horizontal pull** - v1.1: no gap any more. Bodyweight: the Table Row (inverted row under a sturdy table - test that it cannot tip) is a library record (COACH-R2 R2-LIB-07). Otherwise the KB / DB rows. No band rows (EQ-01).
- **Vertical push** - no gap in any profile. Bodyweight: pike push-up and wall handstand push-up (both ADVANCED in BYOP). DB / KB presses cover the rest; Seated Machine Shoulder Press is gym-only (EQ-05).
- **Shoulder isolation (side / rear / front)** - v1.1: no gap any more. Bodyweight: Floor Prone Y / T Raises are a library record (COACH-R2 R2-LIB-07; rear delts get their own sets). The KB Face Pull is shoulder work in this pool (R2-LIB-04 / LIB-10, swap only). With a KB or DBs every raise, reverse fly and upright row is available. No band pull-aparts or band raises (EQ-01).
- **Leg extensions** - empty in: BW, BAR, KB, FIELD. No machine (EQ-08): Sissy Squat (bodyweight, filed under bilateral knee dominant) or DB Leg Extension (seated on a box) at DB / HOME. No banded leg extensions.
- **Leg flexion (CAT-09)** - no gap in any profile. No machine (EQ-08): Nordic curl (feet under a couch), slider / towel hamstring curls, slider hamstring runners; swiss-ball curls with a stability ball. No banded hamstring curls.
- **Biceps** - empty in: BW, FIELD. Bodyweight only: no loaded curl - chin-ups need a bar (BAR), TRX curls need a suspension trainer (BAR). DB curls cover the rest; v1.1: the Kettlebell Curl is a library record (COACH-R2 R2-LIB-07), so the KB-only client has a curl.
- **Arm care: shoulder, elbow and grip care (v1.1)** - PROPOSED-ADDITION items for swimmers, throwers, racquet and grappling sports: scapular push-up (bodyweight), dead hang (pull-up bar), side-lying DB external rotation and DB wrist extension (DBs), cable external rotation (gym); never a band (EQ-01). Not counted as muscle sets.
- **Neck (PROPOSED v1.1)** - neck isometric holds need nothing (hand or partner resistance); the plate neck flexion / extension needs a plate and a bench. For collision and grappling sports (football, wrestling, rugby, hockey, BJJ, MMA); not counted as muscle sets; pending coach approval.
- **Triceps** - no gap in any profile. Bodyweight only: Bench Dip (chair) and Diamond Push-Up (filed in horizontal push, credit 0.5 triceps). No banded triceps extensions (EQ-01); DB overhead extension at DB / HOME.

Structural limits (unchanged from v0, now without band workarounds): throws need a ball; calorie sprints need an erg; true vertical pulling needs a bar; barbell Olympic lifts need a barbell - mark them unavailable for the profile instead of swapping in a different quality, except the coach's own substitutes above.

## 4. Pool by pool (every eligible record)

KB Face Pull is in the shoulder-isolation pool (COACH-R2 R2-LIB-04 / LIB-10: shoulder work, a swap only). PROPOSED-ADDITION records (v1.1) are listed in their pools like any other eligible record; they are never marked `*` (not default candidates until approved).

Read each pool as layers: what bodyweight already gives, then what each kit adds on top of bodyweight. `*` = default candidate. Level in brackets; 'any' = no tiers.

### Plyo (PLYOS)

Where it is used: Plyo slot (BYOP G); 'ATHLETIC', 'ATHLETIC - GENERAL (tab JUSTICE LEAGUE)', 'NO ACCESS - ATHLETIC'. Eligible records in a full gym: 83.

- **BW - bodyweight only** (61): *Ankle Hops (bilateral, in place) [foundational]; *Low Box Jump (Half-Shin Height) [foundational]; *Low Depth Drop [foundational]; *Low Depth Drop - Single-Leg or Weighted (second FOUNDATIONAL listing) [foundational]; *Medium Depth Drop [foundational]; *Mid Box Jump (Knee Height) [foundational]; *Push-Up Stick the Landing (hands start on a box, land on the floor) [foundational]; *Alternating Single-Leg Plate Hops (Hop Off Bilateral) [intermediate]; *Bilateral Forward Plate Hops [intermediate]; *Bilateral Lateral Plate Hops (Forward On / Sideways Off-and-On / Forward Down, Repeat) [intermediate]; *Push-Up Box Jump [intermediate]; *Single-Leg Backward Zig-Zag Jumps [intermediate]; *Single-Leg Depth Drop [intermediate]; *Single-Leg Forward Zig-Zag Jumps [intermediate]; *Single-Leg Lateral Plate Hops - Inner Leg (Alternating) [intermediate]; *Single-Leg Lateral Plate Hops - Inner/Outer Leg [intermediate]; *Single-Leg Lateral Plate Hops - Outer Leg (Alternating) [intermediate]; *Single-Leg Plate Hops [intermediate]; *Bounding [advanced]; *Bulgarian (Rear-Foot-Elevated) Split Jumps [advanced]; *Depth Drop to Box Jump [advanced]; *Depth Jump [advanced]; *Plyometric Push-Ups [advanced]; *Single-Leg Depth Jump [advanced]; *Single-Leg Squirrel Jumps [advanced]; *Squirrel Jumps [advanced]; *Tuck Jumps [advanced]; Bilateral Hop On To (small-amplitude hop onto a plate/low box) [foundational]; Bilateral Jump On To (box jump, land softly on top) [foundational]; Bilateral Repeat Hops (continuous pogo hops) [foundational]; Stick the Landing - Bilateral (jump/drop and freeze the landing) [foundational]; Bilateral Backward Hops [any]; Bilateral Forward Hops [any]; Single-Leg In-Place Hops [any]; Bilateral Repeat Jumps (continuous full-amplitude jumps) [intermediate]; Broad Jump [intermediate]; Depth Drop (height not stated) [intermediate]; Double Bounce - Bilateral (two quick pulses on landing, then go) [intermediate]; Fake Medball Slam & Return (any way possible) - upper-body/trunk amortization drill [intermediate]; Single-Leg Box Jump [intermediate]; Stick the Landing - Unilateral (single-leg landing, freeze) [intermediate]; Streamline Squat Jump (arms locked overhead) [intermediate]; Unilateral Hop On To (single-leg hop onto a plate/low box) [intermediate]; Unilateral Repeat Hops (single-leg continuous pogo hops) [intermediate]; Double Bounce - Unilateral [advanced]; Drop & Double Bounce - Bilateral (step off box, land, two pulses) [advanced]; Drop & Double Bounce - Unilateral [advanced]; Drop (Bilateral) & Hop - depth drop into a quick small hop [advanced]; Unilateral Repeat Jumps (continuous single-leg jumps / bounds) [advanced]; Alternating Split-Stance Jumps (front foot on box) [unrated]; Fast Rhythmic Quarter Squats [unrated]; Front-Foot-Elevated Lunge Jumps (bodyweight) [unrated]; Lateral Box Step-up Jump [unrated]; Seated Box Jump (sit-to-jump onto box) [unrated]; Single-Leg Broad Jump [unrated]; Single-Leg Hops into Single-Leg Box Jump [unrated]; Single-Leg to March Jumps [unrated]; Skater Jumps (lateral bounds) [unrated]; Split-Stance Squat Jumps (lunge jumps) [unrated]; Squat Jump (high, bodyweight or lightly loaded) [unrated]; Staggered-Stance Box Jump [unrated]
- **BAR adds** (0): nothing new
- **KB adds** (0): nothing new
- **DB adds** (12): *DB Ankle Hops [advanced]; *DB Depth Drop, Release DBs, Jump [advanced]; *DB Repeated Squat Jumps [advanced]; *Single-Leg DB Depth Drop, Release DBs, Jump [advanced]; Weighted Stick the Landing - Bilateral (DBs/vest, freeze the landing) [intermediate]; Bilateral Weighted Drop, Release the Weight & Hop [advanced]; Unilateral Weighted Drop, Release the Weight & Hop [advanced]; Weighted Stick the Landing - Unilateral [advanced]; DB Snap Down [unrated]; DB Staggered-Stance Switch Jump [unrated]; RFE Lunge Jumps (suitcase DB) [unrated]; Weighted Depth Jump into High Box Jump [unrated]
- **FIELD adds** (9): *Bilateral Forward Hurdle Hops [intermediate]; *Bilateral Lateral Hurdle Hops [intermediate]; *Bilateral Right-Angle Hurdle Hops (Forward-Lateral-Forward-Lateral) [intermediate]; *Single-Leg Forward Hurdle Hops [intermediate]; *Single-Leg Lateral Hurdle Hops [intermediate]; *High Depth Drop (Above-Hip Height) [advanced]; *Hurdle Hops (tall hurdles, continuous quick-contact reps) [advanced]; Medball Squat Jumps [intermediate]; Hurdle Hops into Box Jump [unrated]
- **HOME adds on top of DB + BAR** (1): Medball Squat Jumps [intermediate]

### Jumping ankle / limited knee

Where it is used: Tripple Extension slot (BYOP C/F). Eligible records in a full gym: 29.

- **BW - bodyweight only** (26): *Ankle Hops (bilateral, in place) [foundational]; *Bilateral Backward Ankle Hops [foundational]; *Bilateral Forward/Backward Ankle Hops [foundational]; *Bilateral Lateral Ankle Hops [foundational]; *Bilateral Right-Angle Ankle Hops (Forward-Right-Forward-Left-Forward) [foundational]; *Bilateral Zig-Zag Ankle Hops [foundational]; *Single-Leg Ankle Hops [foundational]; *Single-Leg Backward Ankle Hops [foundational]; *Single-Leg Forward/Backward Ankle Hops [foundational]; *Single-Leg Lateral Ankle Hops [foundational]; *Single-Leg Right-Angle Ankle Hops [foundational]; *Alternating Single-Leg Plate Hops (Hop Off Bilateral) [intermediate]; *Bilateral Forward Plate Hops [intermediate]; *Bilateral Lateral Plate Hops (Forward On / Sideways Off-and-On / Forward Down, Repeat) [intermediate]; *Single-Leg Backward Zig-Zag Jumps [intermediate]; *Single-Leg Depth Drop [intermediate]; *Single-Leg Forward Zig-Zag Jumps [intermediate]; *Single-Leg Lateral Plate Hops - Inner Leg (Alternating) [intermediate]; *Single-Leg Lateral Plate Hops - Inner/Outer Leg [intermediate]; *Single-Leg Lateral Plate Hops - Outer Leg (Alternating) [intermediate]; *Single-Leg Plate Hops [intermediate]; *Tuck Jumps [advanced]; Broad Jump [intermediate]; Depth Drop (height not stated) [intermediate]; Single-Leg Box Jump [intermediate]; Quick-Feet Toe Taps on Step [unrated]
- **BAR adds** (2): Double-Unders (jump rope) [unrated]; Jump Rope [unrated]
- **KB adds** (0): nothing new
- **DB adds** (0): nothing new
- **FIELD adds** (3): Medball Squat Jumps [intermediate]; Double-Unders (jump rope) [unrated]; Jump Rope [unrated]
- **HOME adds on top of DB + BAR** (1): Medball Squat Jumps [intermediate]

### Triple extension / Olympic

Where it is used: Tripple Extension slot (BYOP C). Eligible records in a full gym: 48 (the Hex-Bar Jump Squat joined this pool in the second adversarial check, ATH-10; it needs a hex bar, so no home profile changes).

- **BW - bodyweight only** (2): *Bodyweight Squat to Calf Raise [foundational]; *Lunge to High-Knee Reach [foundational]
- **BAR adds** (0): nothing new
- **KB adds** (7): *KB Squat Clean [foundational]; *Kettlebell Swing (Russian) [foundational]; *Single-Arm DB Snatch [foundational]; *Split-Stance Contralateral Single-Arm KB Swing [intermediate]; *Weighted Squat to Calf Raise (any implement) [intermediate]; DB/KB High Pull [foundational]; American KB Swing (overhead) [intermediate]
- **DB adds** (7): *DB Push Press [foundational]; *Single-Arm DB Snatch [foundational]; *DB Push Jerk [intermediate]; *Weighted Squat to Calf Raise (any implement) [intermediate]; DB/KB High Pull [foundational]; Staggered-Stance DB Hang Snatch [foundational]; Single-Arm DB Push / Split Jerk [intermediate]
- **FIELD adds** (1): *Weighted Squat to Calf Raise (any implement) [intermediate]
- **HOME adds on top of DB + BAR** (0): nothing new
- **Fix:** Bodyweight: squat to calf raise, lunge to high-knee reach and the jump options. Everyone in athletic training still gets an Olympic-type lift (ATH-10): KB squat clean (KB) and single-arm DB snatch (DB) are default options since R2-LIB-07, plus the DB-KB high pull; KB swings (ballistic, R2-VOL-05) also sit here; hex-bar jumps and hang pulls in a gym. 60+: off by default (R2-ATH-08).

### Throwing

Where it is used: Throwing slot (BYOP K). Eligible records in a full gym: 41.

- **BW - bodyweight only** (0): none
- **BAR adds** (0): nothing new
- **KB adds** (0): nothing new
- **DB adds** (0): nothing new
- **FIELD adds** (41): *Medball Alternating Back-to-Wall Rotational Scoops [any]; *Medball Chest Pass [any]; *Medball Half-Kneeling Rotational Scoop - Left-Facing, Left Leg Up [any]; *Medball Half-Kneeling Rotational Scoop - Left-Facing, Right Leg Forward [any]; *Medball Half-Kneeling Rotational Scoop - Right-Facing, Left Leg Up [any]; *Medball Half-Kneeling Rotational Scoop - Right-Facing, Right Leg Forward [any]; *Medball Overhead Throw [any]; *Medball Rotational Downward Slam [any]; *Medball Rotational Side-to-Side Floor Slams [any]; *Medball Sit-Up to Chest Pass [any]; *Medball Sit-Up to Overhead Throw [any]; *Medball Squat to Chest Pass [any]; *Rotational Medball Chest Pass (R & L) [any]; *Rotational Medball Scoop Toss (R & L) [any]; *Step-Forward Medball Chest Pass (R & L leg) [any]; *Step-Forward Medball Overhead Throw (R & L leg) [any]; Back Lunge with Contralateral Load into March, Contralateral Scoop [any]; Bent-Over Medball Floor Slam [any]; Front/Back Staggered-Stance Medball Cross Throw Down [any]; Front/Back Staggered-Stance Medball Cross Throw Down & Back [any]; Half-Kneeling Medball Rotation In & Step Out [any]; Half-Kneeling Rotational Medball Slam [any]; Half-Kneeling Rotational Overhead Medball Side Slam [any]; In/Out-of-Hip Rotational Medball Scoop [any]; Lateral Hinge to Medball Chest Pass [any]; Lateral Hinge to Medball Scoop [any]; Lateral Lunge to Medball Scoop [any]; Lateral V Throw Down [any]; Lateral-Stance Floor Chop Throw [any]; Medball Cheat-Sheet Throw List (*MEDBALLS) [any]; Medball Floor Catch & Release Push [any]; Medball Overhead Toss to Rotational Scoop [any]; Overhead Medball Slam [any]; Reverse Lunge with Inside Floor Slam [any]; Rotational Overhead Medball Toss [any]; Rotational Split-Stance Floor Slam [any]; Seated Back-to-Wall Rotational Medball Toss [any]; Side-to-Side Shuffle Floor Slam (height matters) [any]; Step-Back to Rotational Medball Chest Pass [any]; Supine (Lay-Down) Medball Press Throw [any]; Wall Ball (medball squat-to-target throw) [any]
- **HOME adds on top of DB + BAR** (41): *Medball Alternating Back-to-Wall Rotational Scoops [any]; *Medball Chest Pass [any]; *Medball Half-Kneeling Rotational Scoop - Left-Facing, Left Leg Up [any]; *Medball Half-Kneeling Rotational Scoop - Left-Facing, Right Leg Forward [any]; *Medball Half-Kneeling Rotational Scoop - Right-Facing, Left Leg Up [any]; *Medball Half-Kneeling Rotational Scoop - Right-Facing, Right Leg Forward [any]; *Medball Overhead Throw [any]; *Medball Rotational Downward Slam [any]; *Medball Rotational Side-to-Side Floor Slams [any]; *Medball Sit-Up to Chest Pass [any]; *Medball Sit-Up to Overhead Throw [any]; *Medball Squat to Chest Pass [any]; *Rotational Medball Chest Pass (R & L) [any]; *Rotational Medball Scoop Toss (R & L) [any]; *Step-Forward Medball Chest Pass (R & L leg) [any]; *Step-Forward Medball Overhead Throw (R & L leg) [any]; Back Lunge with Contralateral Load into March, Contralateral Scoop [any]; Bent-Over Medball Floor Slam [any]; Front/Back Staggered-Stance Medball Cross Throw Down [any]; Front/Back Staggered-Stance Medball Cross Throw Down & Back [any]; Half-Kneeling Medball Rotation In & Step Out [any]; Half-Kneeling Rotational Medball Slam [any]; Half-Kneeling Rotational Overhead Medball Side Slam [any]; In/Out-of-Hip Rotational Medball Scoop [any]; Lateral Hinge to Medball Chest Pass [any]; Lateral Hinge to Medball Scoop [any]; Lateral Lunge to Medball Scoop [any]; Lateral V Throw Down [any]; Lateral-Stance Floor Chop Throw [any]; Medball Cheat-Sheet Throw List (*MEDBALLS) [any]; Medball Floor Catch & Release Push [any]; Medball Overhead Toss to Rotational Scoop [any]; Overhead Medball Slam [any]; Reverse Lunge with Inside Floor Slam [any]; Rotational Overhead Medball Toss [any]; Rotational Split-Stance Floor Slam [any]; Seated Back-to-Wall Rotational Medball Toss [any]; Side-to-Side Shuffle Floor Slam (height matters) [any]; Step-Back to Rotational Medball Chest Pass [any]; Supine (Lay-Down) Medball Press Throw [any]; Wall Ball (medball squat-to-target throw) [any]
- **Fix:** No medball (EQ-07): plyo push-ups or push-up stick-the-landing for the pressing throws, the coach's 'Fake Medball Slam & Return (any way possible)' for slams, fast cable rotations only where a cable exists. No band chops. A medball (8-10 lb, never over 20 lb) is part of the ideal home kit and the field kit.
- **Medball load (COACH-ANSWER EQ-06):** passes and rotational throws 8-10 lb, overhead throws 6-10 lb, sit-up throws 6-8 lb, slams 10-20 lb (slam ball); never over 20 lb; lighter for youth and older clients. Aesthetics / bodybuilding clients throw only in the warm-up (ATH-05).

### Change of direction

Where it is used: COD slot (BYOP L). Eligible records in a full gym: 17.

- **BW - bodyweight only** (17): *Fade Route [foundational]; *Flat Route [foundational]; *Lateral Shuffles [foundational]; *Post / Corner Route [foundational]; *Slant Route [foundational]; *Dig / Out Route [intermediate]; *L-Test / L-Drill (3-Cone) [intermediate]; *5-10-5 Pro-Agility Shuttle [advanced]; *Comeback / Curl Route [advanced]; Four-Square Formation (4-box hop grid) [foundational]; Hops in Place (foot-speed / reactive hops) [foundational]; Split-Step Reaction Drill (split-step, then shuffle / crossover / drop-step on a cue) [foundational]; Krumrie Formation (agility drill pattern) [any]; Munoz Formation (agility drill pattern) [any]; Route Tree (receiver route tree) [any]; Running Routes (pre-planned route running) [any]; Eight-Square Plyometric Formation (8-box hop grid) [intermediate]
- **BAR adds** (0): nothing new
- **KB adds** (0): nothing new
- **DB adds** (0): nothing new
- **FIELD adds** (0): nothing new
- **HOME adds on top of DB + BAR** (0): nothing new

### Speed session (LIB-21)

Where it is used: speed session: squirrel jumps -> MACH drills / acceleration -> max velocity. Eligible records in a full gym: 10. The A-march / A-skip / A-run and MACH drills are also the warm-up drills and never count as volume (COACH-ANSWER ORD-08).

- **BW - bodyweight only** (10): *A-March (running drill) [any]; *A-Runs (high-knee running drill) [any]; *A-Skip (running drill) [any]; *Acceleration Starts [any]; *Falling-Start Accelerations [any]; *Mach Sprint Drills (A-March / A-Skip / A-Run) [any]; *Max-Velocity Sprint (Top Speed) [advanced]; Fast Run / Walk Back ('NOT a sprint') [unrated]; High-Knee Runs [unrated]; Short Fast Run / Sprint Buy-out (10-30 s) [unrated]
- **BAR adds** (0): nothing new
- **KB adds** (0): nothing new
- **DB adds** (0): nothing new
- **FIELD adds** (0): nothing new
- **HOME adds on top of DB + BAR** (0): nothing new

### Cardio / aerobic capacity

Where it is used: Cardio slot (BYOP B). Eligible records in a full gym: 85.

- **BW - bodyweight only** (70): *Distance Intervals: 1 mile Run / 1 min Walk [any]; *Distance Intervals: 2 mile Run / 2 min Walk [any]; *Distance Intervals: 3 mile Run / 3 min Walk [any]; *Distance Repeat: 1000 m [any]; *Distance Repeat: 200 m [any]; *Distance Repeat: 400 m [any]; *Distance Repeat: 600 m [any]; *Distance Repeat: 800 m [any]; *Distance Test: 1 mile Run [any]; *Distance Test: 11 mile Run [any]; *Distance Test: 14 mile Run [any]; *Distance Test: 17 mile Run [any]; *Distance Test: 20 mile Run [any]; *Distance Test: 3 mile Run [any]; *Distance Test: 5 mile Run [any]; *Distance Test: 8 mile Run [any]; *Run Intervals: 2 min Fast / 1 min Walk [any]; *Run Intervals: 3 min Fast / 2 min Walk [any]; *Run Intervals: 4 min Fast / 3 min Walk [any]; *Run Intervals: 5 min Fast / 2 min Walk [any]; *Run Intervals: 6 min Fast / 1 min Walk [any]; *Speed-Endurance Test: 1 Mile for Time [any]; *Speed-Endurance Test: 3 Miles for Time [any]; *Speed-Endurance Test: 800 m (Half Mile) for Time [any]; Aerobic A (blue): 10X10m Sprints [foundational]; Aerobic A (blue): 15 Sec Run/ 45 Sec Walk [foundational]; Aerobic A (blue): 20 Sec Run/ 40 Sec Walk [foundational]; Aerobic B (green): 1 Minute run/ 3 Min Walk [foundational]; Aerobic B (green): 2 Minute run/ 4 Min Walk [foundational]; Aerobic B (green): 3 Minute Run/ 3 Min Walk [foundational]; Aerobic C (orange): 11 Minute Run/ 2 Min Walk [foundational]; Aerobic C (orange): 2 Mile Run [foundational]; Aerobic C (orange): 5 Minute Run/ :30 Sec Walk [foundational]; Aerobic C (orange): 8 Minute Run/ 1 Minute Walk [foundational]; Ruck Walk (weighted backpack walk) [any]; Aerobic A (blue): 30 Sec Run/ 30 Sec Walk [intermediate]; Aerobic A (blue): 40 Sec Run/ 20 Sec Walk [intermediate]; Burpee Broad Jump [intermediate]; Compromised Run (1 km run straight after a station) [intermediate]; Lactate Clearance: 1 min FASTEST/ 20 Sec MODERATE/ 2 Min EASY [advanced]; Lactate Clearance: 1 min MODERATE/20 Sec FASTEST/ 2 Min EASY [advanced]; Lactate Clearance: 2 Min FAST/ 2 Min EASY [advanced]; Lactate Clearance: 2 Min FASTEST/ 3 Min MODERATE [advanced]; Lactate Clearance: 2 Min FASTEST/ 4 Min MODERATE [advanced]; Lactate Clearance: 2 min FASTEST/ 30 Sec MODERATE/ 1 Min EASY [advanced]; Lactate Clearance: 2 min MODERATE/ 30 Sec FASTEST/ 1 Min EASY [advanced]; Lactate Clearance: 3 Min FAST/ 1 Min EASY [advanced]; Lactate Clearance: 3 Min FASTEST/ 3 Min MODERATE [advanced]; Lactate Clearance: 4 Min FAST/ 2 Min EASY [advanced]; Lactate Clearance: 5 Min FAST/ 1 Min EASY [advanced]; Lactate Clearance: 5 Min FASTEST [advanced]; Lactate Clearance: :30 sec FASTEST/ 20 Sec MODERATE/ 1 Min EASY [advanced]; Lactate Clearance: :30 sec FASTEST/ 30 Sec MODERATE/ 1 Min EASY [advanced]; Lactate Clearance: :30 sec MODERATE/ 1 Min FASTEST/ 1 Min EASY [advanced]; Lactate Clearance: :30 sec MODERATE/20 Sec FASTEST/ 1 Min EASY [advanced]; 20 s Fast / 40 s Slow Intervals (any cardio) [unrated]; Any Cardio Equipment - 5 min warm-up [unrated]; Burpees [unrated]; Continuous Distance Run (half-marathon plan) [unrated]; Distance/Pace Workout - not specified ('Workouts involving distances and paces') [unrated]; Fast Run Repeats (200 m fast; 150 m fast / 250 m walk) [unrated]; Flat Sprints (40-80 m, full recovery) [unrated]; Hill Sprints (8-20 s, full recovery) [unrated]; Jumping Jacks [unrated]; Progression Run (easy -> moderate -> hard) [unrated]; Race Day: Half Marathon (13.1 mi) [unrated]; Short Sprint Intervals (15-30 s work : 30 s-2 min walk) [unrated]; Split-Day Run (a.m. + p.m.) [unrated]; Steady-State Easy Cardio (15-40 min, any modality) [unrated]; Taper Run (comfortable pace) [unrated]
- **BAR adds** (0): nothing new
- **KB adds** (0): nothing new
- **DB adds** (0): nothing new
- **FIELD adds** (1): Wall Ball (medball squat-to-target throw) [any]
- **HOME adds on top of DB + BAR** (1): Wall Ball (medball squat-to-target throw) [any]
- **Fix:** Running intervals, distance repeats and tests need only open space; calorie efforts need an erg (any erg: bike, rower, ski, EQ-14). Non-runners can run the Blue / Green / Orange and lactate-clearance work on any tool they have (EQ-14).

### Core (thorax, pelvis, both, slings)

Where it is used: Core slot (BYOP O); core first by default (ATH-11). Eligible records in a full gym: 92.

- **BW - bodyweight only** (50): *Crunch [foundational]; *Leg Raise (lying / supine) [foundational]; *Plank (forearm / low plank) [foundational]; *Reverse Crunch [foundational]; *Sit-Up [foundational]; *V-Up [foundational]; *Copenhagen Plank [intermediate]; *Side Plank (elbow) [intermediate]; *Russian Twist [advanced]; Bear Crawl [foundational]; Bird Dogs [foundational]; Cross Connect (rolls / rocking / hold) [foundational]; Crunch Hold (isometric) [foundational]; Dead Bugs [foundational]; Flutter Kicks [foundational]; Glute Bridge March [foundational]; High Plank (straight-arm plank) [foundational]; Hip Turns (pelvis rotations) [foundational]; March (anti-rotation marching) [foundational]; Plank Shoulder Taps [foundational]; Plank with Alternating Feet Raises [foundational]; Single-Leg Balance Reach (front / side / back) [foundational]; Supermans [foundational]; Up-Down Planks (forearm <-> hand plank) [foundational]; Break Dancers (bear/crab-position thread-through rotations) [intermediate]; Elbow Oblique Sit (side-lying oblique hold on the elbow) [intermediate]; High (Straight-Arm) Side Plank [intermediate]; Offset Planks (asymmetric support or load) [intermediate]; Plank Supermans (held) [intermediate]; Plank to Side Plank (rotating) [intermediate]; Streamline Hold (hollow body, arms locked overhead) [intermediate]; Windshield Wipers [intermediate]; L-Sit Hold [advanced]; Star V-Ups (cross-body / diagonal V-ups) [advanced]; Bicycle Crunch [unrated]; Butterfly Sit-up [unrated]; Copenhagen Raise (dynamic) [unrated]; Core - coach's choice (unspecified) [unrated]; Cross-Body Mountain Climber [unrated]; Hip Raises ('hips raises') [unrated]; Hollow Rocks [unrated]; Lateral Crunch [unrated]; Mountain Climber [unrated]; Side Plank Hip Lifts (slow) [unrated]; Side Plank Knee-to-Elbow [unrated]; Single-Arm / Single-Leg Turkish Sit-up [unrated]; Slider Runners (mountain-climber style) [unrated]; Star Side Plank [unrated]; Star Supine Cross Connect [unrated]; Star Toe Touches [unrated]
- **BAR adds** (5): *Hanging Rotational Knee/Leg Raise [foundational]; *Knees to Chest (hanging) [foundational]; *Toes to Bar (hanging) [foundational]; *Hanging Rotational Knees-to-Chest (hanging oblique knee raise) [advanced]; Single-Leg Toes to Bar [advanced]
- **KB adds** (7): *Weighted Sit-Up [foundational]; *Cable Woodchopper (cable chop) [advanced]; Single-Side (Suitcase) Carry [foundational]; Kettlebell Rotational Swings (no hip thrust - trunk-driven) [intermediate]; Kettlebell Windmills - kneeling or standing [advanced]; Turkish Get-Ups [advanced]; KB Book Opener [unrated]
- **DB adds** (7): *Weighted Sit-Up [foundational]; *Weighted Decline Sit-Up [any]; *Weighted Russian Twist [any]; *Cable Woodchopper (cable chop) [advanced]; Single-Side (Suitcase) Carry [foundational]; Plank DB Pull-Through [unrated]; Side Plank Press (advanced: star side plank press) [unrated]
- **FIELD adds** (9): *Weighted Sit-Up [foundational]; *Weighted Russian Twist [any]; *Cable Woodchopper (cable chop) [advanced]; Medball Ab Rollouts (hands on medball) [intermediate]; Medball Plank Rockers [intermediate]; Medball Rotational Throw - initiated from the feet (pelvis-led) [intermediate]; Medball Rotational Throw - initiated from the hands (thorax-led) [intermediate]; Medball V-Up Switches (pass the ball hands <-> feet) [intermediate]; Medball V-Ups [intermediate]
- **HOME adds on top of DB + BAR** (9): Medball Ab Rollouts (hands on medball) [intermediate]; Medball Hanging Knees to Chest (ball between knees/feet) [intermediate]; Medball Plank Rockers [intermediate]; Medball Rotational Throw - initiated from the feet (pelvis-led) [intermediate]; Medball Rotational Throw - initiated from the hands (thorax-led) [intermediate]; Medball V-Up Switches (pass the ball hands <-> feet) [intermediate]; Medball V-Ups [intermediate]; Medball Hanging Cross Toes to Bar (diagonal, ball between feet) [advanced]; Medball Hanging Toes to Bar (ball between feet) [advanced]

### Vertical pull

Where it is used: Back / Vertical Pull (BYOP U). Eligible records in a full gym: 25.

- **BW - bodyweight only** (0): none
- **BAR adds** (10): *Seated Ring/TRX Pull-Up (feet-supported) [foundational]; *Pull-up (grip not stated) [any]; *Chin-Up (supinated) [advanced]; *L-Sit Pull-Up [advanced]; *Strict Pull-Up (Feet Behind) [advanced]; *Strict Pull-Up (Feet in Front / hollow) [advanced]; *Strict Pull-Up (Knees to Chest / tuck) [advanced]; *Wide-Grip Pull-Up [advanced]; Close-Grip Pull-up [unrated]; Jumping Pull-up [unrated]
- **KB adds** (0): nothing new
- **DB adds** (0): nothing new
- **FIELD adds** (0): nothing new
- **HOME adds on top of DB + BAR** (1): *Weighted Pull-Up [advanced]
- **Fix:** No true vertical pull without a bar: the doorway pull-up bar is the minimum (BAR profile). Without it, keep the back trained through the horizontal-pull options and say the vertical pull is missing. Band-assisted pull-ups are out (EQ-01); use jumping / eccentric pull-ups or seated ring / TRX pull-ups instead.

### Horizontal pull

Where it is used: Back / Horizontal Pull (BYOP X). Eligible records in a full gym: 31.

- **BW - bodyweight only** (1): *Table Row (inverted row under a sturdy table) [foundational]
- **BAR adds** (2): *Inverted Row [foundational]; *TRX Row (suspension row) [foundational]
- **KB adds** (4): *Single-Arm DB/KB Row [any]; *Renegade Row [advanced]; Kong Row (double-KB row from the floor) [foundational]; Bent-Over DB or KB Row (two-arm) [intermediate]
- **DB adds** (8): *Single-Arm DB/KB Row [any]; *Bent-Over Barbell Row [advanced]; *Bent-Over Row (Close Grip; implement not stated) [advanced]; *Renegade Row [advanced]; Chest-Supported Row [foundational]; Bent-Over DB or KB Row (two-arm) [intermediate]; Bent-Over Seesaw DB Row (alternating) [unrated]; Bird Dog Row (DB) [unrated]
- **FIELD adds** (0): nothing new
- **HOME adds on top of DB + BAR** (0): nothing new
- **Fix:** v1.1 - Table Row (COACH-R2 R2-LIB-07) for bodyweight only; otherwise the KB / DB rows. No band rows (EQ-01).

### Vertical push

Where it is used: Chest/Shoulders / Vertical Push (BYOP AA). Eligible records in a full gym: 27.

- **BW - bodyweight only** (3): *Handstand Push-Up (wall-supported) [advanced]; *Pike Push-Up [advanced]; Handstand Skill Work (H.S.) [unrated]
- **BAR adds** (0): nothing new
- **KB adds** (0): nothing new
- **DB adds** (15): *DB Push Press [foundational]; *High-Incline Seated DB Press [foundational]; *Alternating DB Overhead Press [any]; *DB Overhead Press (seated/standing not stated) [any]; *Seesaw DB Press (alternating, one up / one down) [any]; *DB Push Jerk [intermediate]; *DB Z-Press (seated on floor) [advanced]; *Standing DB Overhead Press [advanced]; *Tall-Kneeling DB Overhead Press [advanced]; Seesaw DB Push Press [foundational]; Single-Arm DB Push Press [foundational]; Arnold Press (DB) [unrated]; Half-Kneeling Single-Arm DB Press [unrated]; Overhead Press (implement not stated) [unrated]; Single-Arm DB Overhead Press [unrated]
- **FIELD adds** (1): Medball Press (vertical push slot) [unrated]
- **HOME adds on top of DB + BAR** (1): Medball Press (vertical push slot) [unrated]
- **Fix:** Bodyweight: pike push-up and wall handstand push-up (both ADVANCED in BYOP). DB / KB presses cover the rest; Seated Machine Shoulder Press is gym-only (EQ-05).

### Horizontal push (+ incline / mid-range)

Where it is used: Chest / Horizontal Push, Incline, Flies, Dips (BYOP AD). Eligible records in a full gym: 35.

- **BW - bodyweight only** (12): *Bench Push-Up - Hands on Bench (incline) [foundational]; *Incline Push-Up (hands elevated) [foundational]; *Kneeling Push-Up [foundational]; *Offset Push-Up (one hand elevated) [any]; *Push-Up [intermediate]; *Bench Push-Up - Feet on Bench (decline) [advanced]; *Decline Push-Up (feet elevated) [advanced]; *Deficit Push-up (hands elevated for full ROM) [advanced]; *Diamond (Close-Hand) Push-Up [advanced]; *Push-Up (Feet on Wall / feet elevated) [advanced]; Kneeling Push-Up - One Hand Higher (offset) [intermediate]; Hand-Switch Push-up [unrated]
- **BAR adds** (0): nothing new
- **KB adds** (0): nothing new
- **DB adds** (9): *DB Floor Press [foundational]; *Alternating DB Floor Press [any]; *Alternating Flat DB Bench Press [any]; *Alternating Incline DB Bench Press (one up / one down) [any]; *High-Incline DB Press [any]; *Flat DB Fly [intermediate]; *Flat DB Bench Press [advanced]; *Incline DB Bench Press [advanced]; Incline DB Bench Press - Feet on Wall [intermediate]
- **FIELD adds** (0): nothing new
- **HOME adds on top of DB + BAR** (0): nothing new

### Shoulder isolation (side / rear / front)

Where it is used: Shoulders/Traps / 'ABdution', PPL 'Reverse Flies' (BYOP AH). Eligible records in a full gym: 23.

- **BW - bodyweight only** (1): *Floor Prone Y / T Raises (bodyweight or light DBs) [any]
- **BAR adds** (0): nothing new
- **KB adds** (2): KB Face Pull (as written; face pulls are normally done on a cable) [foundational]; KB Upright Row [any]
- **DB adds** (13): *Bent-Over DB Reverse Fly [any]; *DB Front Raise [any]; *DB Front Raise (Supinated grip) [any]; *DB Hammer-Grip Side/Front Raise (neutral grip) [any]; *DB Lateral (Side) Raise [any]; *DB Lateral Raise (Supinated / palms-up grip) [any]; *DB Upright Row [any]; *Seated (Chest-to-Thighs) DB Reverse Fly [any]; *Seated DB Lateral Raise [any]; Incline-Bench Prone DB T-Raise [any]; Incline-Bench Prone DB Y-Raise [any]; Lateral Raise - 'Spill the Can' (thumbs down, internally rotated) [intermediate]; Rear-Delt DB Row [unrated]
- **FIELD adds** (0): nothing new
- **HOME adds on top of DB + BAR** (0): nothing new
- **Fix:** v1.1 - Floor Prone Y / T Raises (COACH-R2 R2-LIB-07) for bodyweight only; with a KB or DBs every raise, reverse fly and upright row is available. No band pull-aparts or band raises (EQ-01).

### Bilateral knee dominant

Where it is used: Quads / Bilateral KD (BYOP AI). Eligible records in a full gym: 40.

- **BW - bodyweight only** (6): *Bodyweight Squat (air squat) [foundational]; *Box Squat (bodyweight) [foundational]; *Squat Holding an Object Between the Knees (adduction squeeze) [foundational]; *Sissy Squat [advanced]; Wall Sit (isometric squat hold) [foundational]; Oscillating Drop Squat [unrated]
- **BAR adds** (1): *Wall-Assisted Squat (foam roller or stability ball behind the back) [foundational]
- **KB adds** (7): *Box Goblet Squat (touch-and-go) [foundational]; *Goblet Squat (KB/DB) [foundational]; *Sumo Squat (DB or KB) [foundational]; *Goblet Squat (Heels Elevated) [any]; *Double-KB Front-Rack Squat [intermediate]; *Box Squat - any variation, dead-stop ('Deload' = sit and unload on the box) [advanced]; *Box Squat, any loading - touch-and-go (fast) [advanced]
- **DB adds** (11): *Box Goblet Squat (touch-and-go) [foundational]; *Box Zercher Squat (touch-and-go) [foundational]; *Goblet Squat (KB/DB) [foundational]; *Low DB Squat (two DBs hanging at the sides) [foundational]; *Sumo Squat (DB or KB) [foundational]; *Goblet Squat (Heels Elevated) [any]; *High-Zercher DB Squat (DB hugged high at chest) [intermediate]; *Box Squat - any variation, dead-stop ('Deload' = sit and unload on the box) [advanced]; *Box Squat, any loading - touch-and-go (fast) [advanced]; *DB Thruster (front squat into overhead press) [advanced]; *Single-Arm DB Thruster [advanced]
- **FIELD adds** (0): nothing new
- **HOME adds on top of DB + BAR** (0): nothing new

### Unilateral knee dominant

Where it is used: Quads/Glutes / Unilateral KD (BYOP AL). Eligible records in a full gym: 21.

- **BW - bodyweight only** (17): *Curtsy Lunge [any]; *Deficit Reverse Lunge (standing on plate/step) [any]; *Forward Lunge [any]; *Front- and Rear-Foot-Elevated Split Squat (FFE & RFE) [any]; *Front-Foot-Elevated Split Squat / Lunge (FFE) [any]; *Pistol Squat (single-leg squat to floor) [any]; *Rear-Foot-Against-Wall Split Squat [any]; *Rear-Foot-Elevated Lunge (RFE / Bulgarian split squat) [any]; *Reverse Lunge [any]; *Side (Lateral) Lunge [any]; *Single-Leg Get-Up (box pistol) [any]; *Stationary Lunge (Split Squat) [any]; *Step-Up (forward and lateral) [any]; *Walking Lunge [any]; *Cossack Lateral Lunge [intermediate]; Lunge (variation not stated) [any]; Step-up to Knee Drive [unrated]
- **BAR adds** (0): nothing new
- **KB adds** (0): nothing new
- **DB adds** (1): RFE Split-Squat Isometric Hold (suitcase DB) [unrated]
- **FIELD adds** (1): Medball Rotational Alternating FFE Reverse Lunge [unrated]
- **HOME adds on top of DB + BAR** (1): Medball Rotational Alternating FFE Reverse Lunge [unrated]

### Leg extensions

Where it is used: Quads / Leg Extensions (BYOP AM). Eligible records in a full gym: 2.

- **BW - bodyweight only** (0): none
- **BAR adds** (0): nothing new
- **KB adds** (0): nothing new
- **DB adds** (1): DB Leg Extension (seated on box) [any]
- **FIELD adds** (0): nothing new
- **HOME adds on top of DB + BAR** (0): nothing new
- **Fix:** No machine (EQ-08): Sissy Squat (bodyweight, filed under bilateral knee dominant) or DB Leg Extension (seated on a box) at DB / HOME. No banded leg extensions.

### Bilateral hip dominant

Where it is used: Hamstring / Bilateral HD (BYOP AN). Eligible records in a full gym: 27.

- **BW - bodyweight only** (4): *Feet-Elevated Glute Bridge (feet on bench) [foundational]; *Glute Bridge [foundational]; *Hip Thrust or Glute Bridge (either) [any]; Hip Thrust (implement not stated) [any]
- **BAR adds** (0): nothing new
- **KB adds** (4): *Double-Kettlebell Deadlift [foundational]; *Single-Kettlebell Deadlift [foundational]; Kettlebell Swing (Russian) [foundational] (swap only here: 0 hinge sets, R2-VOL-05); American KB Swing (overhead) [intermediate] (swap only, 0 sets)
- **DB adds** (3): *Dumbbell Deadlift [intermediate]; *Dumbbell Hip Thrust [intermediate]; *Stiff-Leg Deadlift / RDL [advanced]
- **FIELD adds** (0): nothing new
- **HOME adds on top of DB + BAR** (0): nothing new

### Unilateral hip dominant

Where it is used: Hamstring/Glutes / Unilateral HD (BYOP AQ). Eligible records in a full gym: 12.

- **BW - bodyweight only** (3): *Single-Leg Glute Bridge (foot elevated on bench) [foundational]; *Single-Leg Glute Bridge (foot on floor) [foundational]; *Single-Leg Hip Thrust (shoulders on bench) [foundational]
- **BAR adds** (0): nothing new
- **KB adds** (2): *Staggered-Stance Deadlift (implement not stated) [any]; Split-Stance Contralateral Single-Arm KB Swing [intermediate] (swap only here: 0 hinge sets, R2-VOL-05)
- **DB adds** (5): *Alternating Staggered-Stance Single-Leg Deadlift (DB) [foundational]; *Staggered-Stance (Kickstand) DB Deadlift [foundational]; *Rear-Foot-on-Wall DB Deadlift (RDL) [any]; *Staggered-Stance Deadlift (implement not stated) [any]; Single-Leg RDL / Single-Leg Deadlift [unrated]
- **FIELD adds** (0): nothing new
- **HOME adds on top of DB + BAR** (0): nothing new

### Leg flexion (CAT-09)

Where it is used: Hamstrings / Leg Curls (BYOP AR) + the knee-flexion items moved out of AN. Eligible records in a full gym: 9.

- **BW - bodyweight only** (3): *Supine Slider Hamstring Curl [foundational]; *Nordic Hamstring Curl [advanced]; Slider Hamstring Runners (alternating) [unrated]
- **BAR adds** (0): nothing new
- **KB adds** (0): nothing new
- **DB adds** (1): *Prone Dumbbell Hamstring Curl (DB between feet) [advanced]
- **FIELD adds** (1): *Ball Hamstring Curl (medball or stability ball) [foundational]
- **HOME adds on top of DB + BAR** (1): *Ball Hamstring Curl (medball or stability ball) [foundational]
- **Fix:** No machine (EQ-08): Nordic curl (feet under a couch), slider / towel hamstring curls, slider hamstring runners; swiss-ball curls with a stability ball. No banded hamstring curls.

### Biceps

Where it is used: Bicep (BYOP AS). Eligible records in a full gym: 21.

- **BW - bodyweight only** (0): none
- **BAR adds** (1): *Suspension-Trainer (TRX) Biceps Curl [any]
- **KB adds** (1): *Kettlebell Curl (one or two KBs) [any]
- **DB adds** (14): *Cross-Body Dumbbell Hammer Curl [any]; *Dumbbell Concentration Curl [any]; *Dumbbell Curl [any]; *Dumbbell Hammer Curl [any]; *Incline Dumbbell Curl ('pinky facing up' supinated variation) [any]; *Seated Dumbbell Curl [any]; *Spider Curl (chest on incline bench) [any]; *Supine (Lying) Biceps Curl [any]; *Zottman Curl (supinated up, pronated down) [any]; DB Pronated (Reverse) Curl [any]; Biceps Curl - any kind [unrated]; DB 'No Money' Curl [unrated]; DB Curl to Press [unrated]; Single-Arm DB Preacher Curl [unrated]
- **FIELD adds** (0): nothing new
- **HOME adds on top of DB + BAR** (0): nothing new
- **Fix:** Bodyweight only: no loaded curl - chin-ups need a bar (BAR), TRX curls need a suspension trainer (BAR). DB curls cover the rest; the Kettlebell Curl (COACH-R2 R2-LIB-07) covers the KB-only client.

### Triceps

Where it is used: Tricep (BYOP AT). Eligible records in a full gym: 15.

- **BW - bodyweight only** (1): Bench Dip [unrated]
- **BAR adds** (0): nothing new
- **KB adds** (0): nothing new
- **DB adds** (4): *Dumbbell Triceps Kickback (one or both arms) [any]; *Floor Dumbbell Skullcrusher [any]; *Overhead Dumbbell Triceps Extension [any]; *Tate Press [any]
- **FIELD adds** (0): nothing new
- **HOME adds on top of DB + BAR** (0): nothing new
- **Fix:** Bodyweight only: Bench Dip (chair) and Diamond Push-Up (filed in horizontal push, credit 0.5 triceps). No banded triceps extensions (EQ-01); DB overhead extension at DB / HOME.

### Calves

Where it is used: Calves (BYOP AU); 3 sets every leg day (VOL-17). Eligible records in a full gym: 8.

- **BW - bodyweight only** (3): *Standing Calf Raise (bodyweight, from a deficit/step) [any]; Tibialis Raise (back against a wall) [any]; Calf Raise - any [unrated]
- **BAR adds** (0): nothing new
- **KB adds** (0): nothing new
- **DB adds** (3): *Standing DB Calf Raise (deficit optional) [any]; Seated / Bent-Knee Calf Raise (soleus; machine or DBs on the knees) [any]; Single-Leg Deficit Calf Raise (weighted) [unrated]
- **FIELD adds** (0): nothing new
- **HOME adds on top of DB + BAR** (0): nothing new

### Arm care: shoulder, elbow and grip care (v1.1)

Where it is used: no BYOP slot; warm-up or accessory work for swimmers, throwers, racquet, climbing and grappling sports (PROPOSED-ADDITION, plus the 3 v1 program-only arm-care drills). Eligible records in a full gym: 8.

- **BW - bodyweight only** (2): Scapular Push-Up (push-up plus) [foundational]; Half-Kneeling Shoulder Roll (arm care) [unrated]
- **BAR adds** (1): Dead Hang (pull-up bar) [foundational]
- **KB adds** (1): Kettlebell Arm Bar (arm care) [unrated]
- **DB adds** (3): DB Wrist Extension (slow lowering, forearm on the knee or a bench) [foundational]; Side-Lying DB External Rotation [foundational]; Side-Lying DB Drop & Catch (reactive shoulder) [unrated]
- **FIELD adds** (0): nothing new
- **HOME adds on top of DB + BAR** (0): nothing new
- **Fix:** none needed - not counted as muscle sets; never a band (EQ-01).

### Neck (PROPOSED v1.1)

Where it is used: no BYOP slot; PROPOSED for collision and grappling sports (04_profiles category ISO_NECK). Eligible records in a full gym: 2.

- **BW - bodyweight only** (1): Neck Isometric Holds (4-way: front, back, both sides; hand or partner resistance) [foundational]
- **BAR adds** (0): nothing new
- **KB adds** (0): nothing new
- **DB adds** (0): nothing new
- **FIELD adds** (0): nothing new
- **HOME adds on top of DB + BAR** (0): nothing new

### Carries and drags (PROPOSED, LIB-19)

Where it is used: no BYOP slot yet. Eligible records in a full gym: 10.

- **BW - bodyweight only** (0): none
- **BAR adds** (0): nothing new
- **KB adds** (4): Farmer Carry (bilateral) [foundational]; Farmer Hold (stationary carry) [foundational]; Front-Rack KB Carry (one or two KBs) [intermediate]; Overhead KB Carry (single arm) [advanced]
- **DB adds** (3): Farmer Carry (bilateral) [foundational]; Farmer Hold (stationary carry) [foundational]; Overhead KB Carry (single arm) [advanced]
- **FIELD adds** (0): nothing new
- **HOME adds on top of DB + BAR** (0): nothing new

## 5. Bodyweight substitutes the equipment decode proposed for gym-only items

For records that need gym or home weights, `equipment.substitutes_by_equipment.bodyweight_only` gives the bodyweight stand-in (INFERRED by the equipment decode, rewritten in v1 wherever it relied on a band). Most common stand-ins per pool:

**Plyo (PLYOS)**

- hop over cones / a rolled towel / a floor line (lower intensity); or library 'Tuck Jumps' (G129) in place <- for: Bilateral Forward Hurdle Hops, Bilateral Lateral Hurdle Hops, Bilateral Right-Angle Hurdle Hops (Forward-Lateral-Forward-Lateral), Hurdle Hops (tall hurdles, continuous quick-contact reps), Single-Leg Forward Hurdle Hops ...
- library 'Ankle Hops ' (G15) <- for: DB Ankle Hops
- library 'Depth Jumps' (G131) <- for: DB Depth Drop, Release DBs, Jump
- library 'Tuck Jumps' (G129) / bodyweight repeat squat jumps <- for: DB Repeated Squat Jumps
- no household drop above knee height (safety; COACH-ANSWER EQ-16 heights): regress to library 'Medium Depth Drop' (G11) from a sturdy bench or step <- for: High Depth Drop (Above-Hip Height) (v0 'drop from a high wall/stage' removed in the second adversarial check; the High Depth Drop is also 'never' for older / injured clients, INFERRED from EQ-03)
- library 'SL Depth Jumps' (G130) <- for: Single-Leg DB Depth Drop, Release DBs, Jump

**Triple extension / Olympic**

- no loaded option: move to library 'Tuck Jumps' (G129) / 'Depth Jumps' (G131) - unloaded triple extension <- for: Squat Clean & Jerk, Squat Clean, Power Clean, Power Clean & Jerk, Power Snatch ...
- library 'BodyWeight Squat to calf raise' (C9) <- for: Hex Bar Squat to Calf Raise, Weighted Squat to Calf Raise (any implement)
- library 'Tuck Jumps' (G129) or squat jumps: unloaded triple extension (moves the slot toward the speed end of the F-V curve) <- for: High-Hang Clean Pull, High-Hang Snatch Pull, Low-Hang Clean Pull, Low-Hang Snatch Pull, Mid-Hang Clean Pull ...
- No loaded ballistic overhead push without an implement: 'Pike Push Ups' (AA53) with fast concentric intent, plus jump squats from the PLYOS list; with a med ball, the THROWING list (overhead throw) is the speed substitute <- for: Barbell Push Jerk, Barbell Push Press, DB Push Jerk, DB Push Press

**Throwing**

- 'Fake Medball Slam & Return (any way possible)' done as a rotational slam / scoop (COACH-ANSWER EQ-07: substitute, don't skip; no band chops); lower-intensity option: 'cross connect rolls/rocking' / 'break dancers' (CONTROL PATTERNSCORE!B32:B33) (INFERRED); for the Rotational Medball Chest Pass, plyo push-ups first <- for: Medball Alternating Back-to-Wall Rotational Scoops, Medball Half-Kneeling Rotational Scoop - Left-Facing, Left Leg Up, Medball Half-Kneeling Rotational Scoop - Left-Facing, Right Leg Forward, Medball Half-Kneeling Rotational Scoop - Right-Facing, Left Leg Up, Medball Half-Kneeling Rotational Scoop - Right-Facing, Right Leg Forward ...
- library 'Plyo pushups' (G141) / 'Push up Stick the Landing' (G12): same horizontal-push power, body is the load <- for: Medball Chest Pass, Step-Forward Medball Chest Pass (R & L leg)
- no ball: 'FAKE MEDBALL SLAM & RETURN ANY WAY POSSIBLE' (ALL ABOUT BALLISTICS!C46, INFERRED reading = slam mime) or library 'Tuck Jumps' for total-body extension <- for: Medball Overhead Throw, Step-Forward Medball Overhead Throw (R & L leg)
- 'FAKE MEDBALL SLAM & RETURN ANY WAY POSSIBLE' (ALL ABOUT BALLISTICS!C46, INFERRED) <- for: Medball Rotational Downward Slam, Medball Rotational Side-to-Side Floor Slams
- library 'Sit ups' (O12) fast + library 'Plyo pushups' (G141) (INFERRED) <- for: Medball Sit-Up to Chest Pass
- library 'Sit ups' (O12) fast, arms overhead (INFERRED) <- for: Medball Sit-Up to Overhead Throw
- squat jump + library 'Plyo pushups' (G141) as a pair (INFERRED) <- for: Medball Squat to Chest Pass

**Cardio / aerobic capacity**

- time-matched shuttle sprints or hill sprints (same work time, walk-back rest) <- for: Calorie Effort: 10 cal (bike / rower / ski), Calorie Effort: 15 cal (bike / rower / ski), Calorie Effort: 20 cal (bike / rower / ski), Calorie Effort: 25 cal (bike / rower / ski), Calorie Effort: 30 cal (bike / rower / ski) ...

**Core (thorax, pelvis, both, slings)**

- library 'Russian Twists' (O94) <- for: Cable Oblique Rotation (cable rotational twist)
- library 'Russian Twists' (O94) or 'cross connect' (CONTROL PATTERNSCORE!E32) <- for: Cable Woodchopper (cable chop)
- library 'Reverse Crunches' (R10) or seated knee tucks on a bench <- for: Knees to Chest (hanging)
- library 'Leg Raises' (R9) / 'V-ups' (R11) on the floor <- for: Toes to Bar (hanging)
- 'Sit ups' (O12) / 'Crunches' (O11) <- for: Weighted Decline Sit-Up
- 'Russian Twists' (O94), unloaded <- for: Weighted Russian Twist
- library 'Sit ups' (O12) slower / arms overhead <- for: Weighted Sit-Up
- 'windshield wipers' (CONTROL PATTERNSCORE!B20) or rotational reverse crunch <- for: Hanging Rotational Knee/Leg Raise

**Vertical pull**

- NO TRUE VERTICAL PULL without a bar or anchor. Closest: 'Inverted Rows' (X13) under a sturdy table (a horizontal pull) + prone floor 'lat pulldown' with a towel (isometric). Recommend a doorway pull-up bar (COACH-ANSWER EQ-01: no bands). <- for: Assisted Pull-up (machine), Assisted Pull-Up Machine (Close Grip), Assisted Pull-Up Machine (Pronated Grip), Assisted Pull-Up Machine (Supinated / Chin-Up Grip), Chin-Up (supinated) ...

**Horizontal pull**

- Feet-elevated / 'Paralell reverse pushup' (RESISTANCE PATTERNS G65) under a table <- for: Bent-Over Barbell Row, Bent-Over Barbell Row (Supinated / Yates grip), Bent-Over Row (Close Grip; implement not stated), Renegade Row, Seal Row - Barbell (Pronated Grip) ...
- Inverted row under a sturdy table or bar ('Inverted Rows' X13 = coach's 'Incline reverse pushup (rings/trx/barbell/smith machine)', RESISTANCE PATTERNS G64) <- for: Inverted Row, Machine Row (Close / Neutral Grip), Machine Row (grip not stated), Machine Row (Pronated Grip), Machine Row (Supinated Grip) ...

**Vertical push**

- 'Pike Push Ups' (AA53) <- for: Alternating DB Overhead Press, DB Overhead Press (seated/standing not stated), Half-Kneeling Single-Arm Landmine Press, High-Incline Seated Barbell Press, High-Incline Seated DB Press ...
- No loaded ballistic overhead push without an implement: 'Pike Push Ups' (AA53) with fast concentric intent, plus jump squats from the PLYOS list; with a med ball, the THROWING list (overhead throw) is the speed substitute <- for: Barbell Push Jerk, Barbell Push Press, DB Push Jerk, DB Push Press
- 'Handstand Push ups' (AA52) <- for: Barbell Z-Press (seated on floor), DB Z-Press (seated on floor), Standing Barbell Overhead Press (strict), Standing DB Overhead Press, Tall-Kneeling Barbell Overhead Press ...

**Horizontal push (+ incline / mid-range)**

- 'Kneeling Push Ups' (AD11) / 'Incline Push-ups' (AD12) / 'Push Ups ' (AD47) <- for: Alternating DB Floor Press, Alternating Flat DB Bench Press, Alternating Incline DB Bench Press (one up / one down), Alternating Standing Cable Press (one forward / one back), DB Floor Press ...
- Bench or chair dips (more anterior-shoulder stress) or 'Diamond Push ups' (AD93) <- for: Assisted Dips (machine), Parallel-Bar Dip, Weighted Dip
- 'Declined Pushups' (AD98) / 'Deficit Push-ups' (AF18) / 'Push ups (Feet on Wall)' (AD92) <- for: Barbell Bench Press, Flat DB Bench Press, Incline DB Bench Press
- No true fly without a load or sliders: wide push-up (F) / towel or slider push-up fly (A) <- for: Cable Fly, Flat DB Fly, Machine Fly (Pec Deck)
- 'Pike Push Ups' (AA53) <- for: High-Incline DB Press

**Shoulder isolation (side / rear / front)**

- Prone floor Y/T raises (bodyweight form of RESISTANCE PATTERNS K21/K22 'Bench incline DB ys' / 'Ts') <- for: KB Face Pull (as written; face pulls are normally done on a cable)
- NO loaded front raise: plank reach / pike hold isometric <- for: Barbell Front Raise, DB Front Raise, DB Front Raise (Supinated grip)
- NO loaded option <- for: Barbell Upright Row, DB Upright Row
- Prone floor Y/T raises (bodyweight form of RESISTANCE PATTERNS K21/K22) <- for: Bent-Over DB Reverse Fly, Machine Reverse Fly (rear-delt pec deck), Seated (Chest-to-Thighs) DB Reverse Fly
- NO loaded lateral raise without an implement: side-lying raise with a household weight (water jug) or wall-lean isometric abduction <- for: Cable Side Raise (leaning), DB Hammer-Grip Side/Front Raise (neutral grip), DB Lateral (Side) Raise, DB Lateral Raise (Supinated / palms-up grip), Incline / Side-Lying Cable Lateral Raise ...

**Bilateral knee dominant**

- 'Pistol Squats ' (AL13) / 'Front Foot & Rear Foot Elevated Lunges (RFE & FFE)' (AL18): bilateral bodyweight is too light for an advanced lifter, so the load moves to one leg <- for: Back Squat (bar position not stated), Front Squat (barbell), High-Bar Back Squat, Low-Bar Back Squat, Zercher Squat (barbell)
- No loaded ballistic overhead push without an implement: 'Pike Push Ups' (AA53) with fast concentric intent, plus jump squats from the PLYOS list; with a med ball, the THROWING list (overhead throw) is the speed substitute <- for: Barbell Thruster, DB Thruster (front squat into overhead press), Single-Arm DB Thruster
- 'Bodyweight Squats' (AI12) / 'Box Squats' (AI13) <- for: Box Goblet Squat (touch-and-go), Box Zercher Squat (touch-and-go), Double-KB Front-Rack Squat, Flipped Hex Bar Squat (low handles, longer range), Goblet Squat (Heels Elevated) ...
- Unloaded speed: jump squats / box jumps from the PLYOS list (speed without load) <- for: Box Squat - any variation, dead-stop ('Deload' = sit and unload on the box), Box Squat, any loading - touch-and-go (fast)
- 'Bodyweight Squats' (AI12) / 'Squats with Foam Roller or Yoga Ball on the wall' (AI14) <- for: Hack Squat (machine)
- 'Sissy Squats' (AI100) / 'Pistol Squats ' (AL13) <- for: Leg Press (machine), Pendulum Squat (machine)

**Leg extensions**

- Assisted 'Sissy Squats' (AI100), holding a door frame <- for: Leg Extension (machine)

**Bilateral hip dominant**

- Prone floor back extension, or a reverse hyper off a bench/table <- for: 45-Degree Hyperextension (back/hip extension), GHD - Glute-Ham Developer (hip extension / glute-ham raise), Good Morning (machine), Reverse Hyperextension
- 'Nordic Curl' (AN91) + 'SL Hip thrusts' (AQ11); bodyweight single-leg RDL (INFERRED). Hinge loading collapses without an implement <- for: Barbell Deadlift (conventional), Snatch-Grip Barbell Deadlift, Stiff-Leg Deadlift / RDL, Sumo Deadlift, Wide-Grip Barbell Deadlift
- 'SL Hip thrusts' (AQ11) / 'Nordic Curl' (AN91) <- for: Barbell Good Morning
- 'SL Hip thrusts' (AQ11) <- for: Barbell Hip Thrust
- 'Glute Bridges' (AN9) / 'SL Glute Bridges (foot on the ground)' (AQ9) <- for: Cable Pull-Through, Double-Kettlebell Deadlift, Dumbbell Deadlift, Hex (Trap) Bar Deadlift, Single-Kettlebell Deadlift
- 'Glute Bridges' (AN9) / 'Elevated Feet on Bench Glute Bridges' (AN10) <- for: Dumbbell Hip Thrust, Hip Thrust (machine), Sandbag Hip Thrust
- Broad jumps / hinge-to-jump from the PLYOS list (same speed intent, no load) <- for: Kettlebell Swing (Russian)

**Unilateral hip dominant**

- 'SL Glute Bridges (foot on bench)' (AQ10) <- for: Alternating Staggered-Stance Single-Leg Deadlift (barbell), Alternating Staggered-Stance Single-Leg Deadlift (DB), Rear-Foot-on-Wall DB Deadlift (RDL), Staggered-Stance (Kickstand) Barbell Deadlift, Staggered-Stance (Kickstand) DB Deadlift ...

**Leg flexion (CAT-09)**

- 'Supine Glidder hamstring curls' (AN18), towel on a smooth floor <- for: Ball Hamstring Curl (medball or stability ball), Machine Leg Curl (seated or lying), Lying Leg Curl (machine), Seated Leg Curl (machine)
- 'Nordic Curl' (AN91), feet under a couch or a partner <- for: Prone Dumbbell Hamstring Curl (DB between feet)

**Biceps**

- NO loaded curl without an implement: towel isometric curl, or 'Chin Ups' (U50) if a bar exists <- for: Barbell Curl, Cable Curl (Zone 1 / Zone 2 / Zone 3 set-ups), Cross-Body Dumbbell Hammer Curl, Dumbbell Concentration Curl, Dumbbell Curl ...

**Triceps**

- 'Diamond Push ups' (AD93) / bench dips <- for: Cable Triceps Push-down, Cable Triceps Pushdown - straight bar, pronated grip, Cable Triceps Pushdown - straight bar, supinated (reverse) grip
- 'Diamond Push ups' (AD93) <- for: Dumbbell Triceps Kickback (one or both arms)
- Bodyweight skull crusher on a bench edge / 'Diamond Push ups' (AD93) <- for: EZ-Bar Skullcrusher, Floor Dumbbell Skullcrusher, Tate Press
- Bodyweight triceps extension with hands on a bench/table edge <- for: Overhead Cable Triceps Extension, Overhead Dumbbell Triceps Extension

**Calves**

- Single-leg calf raise off a step with a deficit (bodyweight form of 'Standing Calf raises (use deficit)' AU9) <- for: Barbell Calf Raise, Machine Calf Raise, Standing DB Calf Raise (deficit optional)

## 6. The two NO ACCESS templates, day by day (self-serve version, R2-LIB-08; OBSERVED wiring with the AQ fix, v1.1 pools)

Each row is a template cell (OBSERVED, `analysis/library/L4_slot_wiring.md`), except the four 'Unilateral HD' rows that COACH-R2 R2-LIB-08 re-points to the single-leg hinge list (AQ7:AQ42). Options = records in that dropdown that are eligible in v1.1 and belong to the slot's v1.1 pool (the leg curls inside the BILATERAL HD dropdown now belong to LEG FLEXION, CAT-09; thrusters inside VERTICAL PUSH count as knee-dominant, LIB-14). Counts per profile: BW / BAR / HOME.

These tables are the OBSERVED slot wiring (which library list each template cell reads), not the v1.1 session shape. On full-body days every muscle trained that day gets 2-4 exercises, never one (COACH-R2 R2-SES-05), so where the sheet has a single slot for a muscle (biceps, triceps, calves, side raises, leg extensions) the generator adds exercises from the same pool; the session rules live in `05_session_architecture.md` (v1.1 adversarial check).

### NO ACCESS - AESTHETICS - FB - 4

| day | purpose | category | cell | range | options (v1.1) | BW | BAR | HOME | first bodyweight picks | note |
|---|---|---|---|---|---|---|---|---|---|---|
| MONDAY | Calves | Calves | E3 | AU7:AU13 | 4 | 1 | 1 | 2 | Standing Calf Raise (bodyweight, from a deficit/step) |  |
| MONDAY | Quads | Bilateral KD | E4 | AI7:AI122 | 27 | 3 | 4 | 13 | Bodyweight Squat (air squat); Box Squat (bodyweight); Sissy Squat |  |
| MONDAY | Back | Horizontal Pull | E5 | X7:X162 | 15 | 0 | 2 | 4 |  |  |
| MONDAY | Quads/Glutes | Unilateral KD | E6 | AL7:AL42 | 13 | 13 | 13 | 13 | Curtsy Lunge; Deficit Reverse Lunge (standing on plate/step); Forward Lunge |  |
| MONDAY | Back | Vertical Pull | E7 | U7:U122 | 18 | 0 | 7 | 7 |  |  |
| MONDAY | Bicep | Bicep | E8 | AS7:AS42 | 13 | 0 | 1 | 8 |  |  |
| MONDAY | Quads | Leg Extensions | E9 | AM7:AM9 | 1 | 0 | 0 | 0 |  |  |
| TUESDAY | Hamstring | Bilateral HD | E10 | AN7:AN122 | 22 | 2 | 2 | 5 | Feet-Elevated Glute Bridge (feet on bench); Glute Bridge |  |
| TUESDAY | Chest | Horizontal Push | E11 | AD7:AD162 | 24 | 9 | 9 | 16 | Bench Push-Up - Hands on Bench (incline); Incline Push-Up (hands elevated); Kneeling Push-Up |  |
| TUESDAY | Hamstring/Glutes | Unilateral HD | E12 | AQ7:AQ42 | 7 | 3 | 3 | 5 | Single-Leg Glute Bridge (foot elevated on bench); Single-Leg Glute Bridge (foot on floor); Single-Leg Hip Thrust (shoulders on bench) | R2-LIB-08: reads the single-leg hinge list (AQ); the sheet still says AR7:AR42 (OBSERVED) |
| TUESDAY | Chest/Shoulders | Vertical Push | E13 | AA7:AA122 | 16 | 2 | 2 | 10 | Handstand Push-Up (wall-supported); Pike Push-Up |  |
| TUESDAY | Hamstrings | Leg Curls | E14 | AR7:AR10 | 2 | 0 | 0 | 0 |  |  |
| TUESDAY | Tricep | - | E15 | AT7:AT42 | 9 | 0 | 0 | 4 |  |  |
| TUESDAY | Shoulders/Traps | ABdution | E16 | AH7:AH42 | 12 | 0 | 0 | 8 |  |  |
| WEDNESDAY | Calves | - | E18 | AU7:AU13 | 4 | 1 | 1 | 2 | Standing Calf Raise (bodyweight, from a deficit/step) |  |
| WEDNESDAY | Cardio | - | E19 | B7:B122 | 19 | 19 | 19 | 19 | Distance Intervals: 1 mile Run / 1 min Walk; Distance Intervals: 2 mile Run / 2 min Walk; Distance Intervals: 3 mile Run / 3 min Walk | truncated cardio range (FIX-02: extend logically) |
| WEDNESDAY | Core | - | E20 | O7:O283 | 16 | 9 | 13 | 15 | Crunch; Leg Raise (lying / supine); Plank (forearm / low plank) |  |
| WEDNESDAY | Focus 1 | - | E21 | AZ7:AZ335 | 49 | 5 | 6 | 25 | Single-Leg Glute Bridge (foot on floor); Hip Thrust or Glute Bridge (either); Rear-Foot-Elevated Lunge (RFE / Bulgarian split squat) |  |
| WEDNESDAY | Focus 2 | - | E22 | AZ7:AZ335 | 49 | 5 | 6 | 25 | Single-Leg Glute Bridge (foot on floor); Hip Thrust or Glute Bridge (either); Rear-Foot-Elevated Lunge (RFE / Bulgarian split squat) |  |
| THURSDAY | Calves | Calves | E24 | AU7:AU13 | 4 | 1 | 1 | 2 | Standing Calf Raise (bodyweight, from a deficit/step) |  |
| THURSDAY | Quads | Bilateral KD | E25 | AI7:AI122 | 27 | 3 | 4 | 13 | Bodyweight Squat (air squat); Box Squat (bodyweight); Sissy Squat |  |
| THURSDAY | Back | Horizontal Pull | E26 | X7:X162 | 15 | 0 | 2 | 4 |  |  |
| THURSDAY | Quads/Glutes | Unilateral KD | E27 | AL7:AL42 | 13 | 13 | 13 | 13 | Curtsy Lunge; Deficit Reverse Lunge (standing on plate/step); Forward Lunge |  |
| THURSDAY | Back | Vertical Pull | E28 | U7:U122 | 18 | 0 | 7 | 7 |  |  |
| THURSDAY | Bicep | Bicep | E29 | AS7:AS42 | 13 | 0 | 1 | 8 |  |  |
| THURSDAY | Quads | Leg Extensions | E30 | AM7:AM9 | 1 | 0 | 0 | 0 |  |  |
| FRIDAY | Hamstring | Bilateral HD | E31 | AN7:AN122 | 22 | 2 | 2 | 5 | Feet-Elevated Glute Bridge (feet on bench); Glute Bridge |  |
| FRIDAY | Chest | Horizontal Push | E32 | AD7:AD162 | 24 | 9 | 9 | 16 | Bench Push-Up - Hands on Bench (incline); Incline Push-Up (hands elevated); Kneeling Push-Up |  |
| FRIDAY | Hamstring/Glutes | Unilateral HD | E33 | AQ7:AQ42 | 7 | 3 | 3 | 5 | Single-Leg Glute Bridge (foot elevated on bench); Single-Leg Glute Bridge (foot on floor); Single-Leg Hip Thrust (shoulders on bench) | R2-LIB-08: reads the single-leg hinge list (AQ); the sheet still says AR7:AR42 (OBSERVED) |
| FRIDAY | Chest/Shoulders | Vertical Push | E34 | AA7:AA122 | 16 | 2 | 2 | 10 | Handstand Push-Up (wall-supported); Pike Push-Up |  |
| FRIDAY | Hamstrings | Leg Curls | E35 | AR7:AR10 | 2 | 0 | 0 | 0 |  |  |
| FRIDAY | Tricep | - | E36 | AT7:AT42 | 9 | 0 | 0 | 4 |  |  |
| FRIDAY | Shoulders/Traps | ABdution | E37 | AH7:AH42 | 12 | 0 | 0 | 8 |  |  |
| SATURDAY | Calves | - | E39 | AU7:AU13 | 4 | 1 | 1 | 2 | Standing Calf Raise (bodyweight, from a deficit/step) |  |
| SATURDAY | Cardio | - | E40 | B7:B122 | 19 | 19 | 19 | 19 | Distance Intervals: 1 mile Run / 1 min Walk; Distance Intervals: 2 mile Run / 2 min Walk; Distance Intervals: 3 mile Run / 3 min Walk | truncated cardio range (FIX-02: extend logically) |
| SATURDAY | Core | - | E41 | O7:O283 | 16 | 9 | 13 | 15 | Crunch; Leg Raise (lying / supine); Plank (forearm / low plank) |  |
| SATURDAY | Focus 1 | - | E42 | AZ7:AZ335 | 49 | 5 | 6 | 25 | Single-Leg Glute Bridge (foot on floor); Hip Thrust or Glute Bridge (either); Rear-Foot-Elevated Lunge (RFE / Bulgarian split squat) |  |
| SATURDAY | Focus 2 | - | E43 | AZ7:AZ335 | 49 | 5 | 6 | 25 | Single-Leg Glute Bridge (foot on floor); Hip Thrust or Glute Bridge (either); Rear-Foot-Elevated Lunge (RFE / Bulgarian split squat) |  |

### NO ACCESS - ATHLETIC - FB - 4 t

| day | purpose | category | cell | range | options (v1.1) | BW | BAR | HOME | first bodyweight picks | note |
|---|---|---|---|---|---|---|---|---|---|---|
| MONDAY | Plyo | Plyo | E3 | G7:G162 | 38 | 27 | 27 | 31 | Ankle Hops (bilateral, in place); Low Box Jump (Half-Shin Height); Low Depth Drop |  |
| MONDAY | Plyo | Plyo | E4 | G7:G162 | 38 | 27 | 27 | 31 | Ankle Hops (bilateral, in place); Low Box Jump (Half-Shin Height); Low Depth Drop |  |
| MONDAY | Throwing | Throwing | E5 | K7:K87 | 16 | 0 | 0 | 16 |  |  |
| MONDAY | COD | COD | E6 | L7:L242 | 9 | 9 | 9 | 9 | Fade Route; Flat Route; Lateral Shuffles |  |
| MONDAY | Tripple Extension | Tripple Extension | E7 | C7:C242 | 27 | 13 | 13 | 14 | Ankle Hops (bilateral, in place); Bilateral Backward Ankle Hops; Bilateral Forward/Backward Ankle Hops |  |
| MONDAY | Quads | Bilateral KD | E8 | AI7:AI122 | 27 | 3 | 4 | 13 | Bodyweight Squat (air squat); Box Squat (bodyweight); Sissy Squat |  |
| MONDAY | Back | Horizontal Pull | E9 | X7:X162 | 15 | 0 | 2 | 4 |  |  |
| MONDAY | Quads/Glutes | Unilateral KD | E10 | AL7:AL42 | 13 | 13 | 13 | 13 | Curtsy Lunge; Deficit Reverse Lunge (standing on plate/step); Forward Lunge |  |
| MONDAY | Back | Vertical Pull | E11 | U7:U122 | 18 | 0 | 7 | 7 |  |  |
| MONDAY | Quads | Leg Extensions | E12 | AM7:AM9 | 1 | 0 | 0 | 0 |  |  |
| TUESDAY | Plyo | PLYO | E13 | G7:G162 | 38 | 27 | 27 | 31 | Ankle Hops (bilateral, in place); Low Box Jump (Half-Shin Height); Low Depth Drop |  |
| TUESDAY | Throwing | Throwing | E14 | K7:K87 | 16 | 0 | 0 | 16 |  |  |
| TUESDAY | COD | COD | E15 | L7:L242 | 9 | 9 | 9 | 9 | Fade Route; Flat Route; Lateral Shuffles |  |
| TUESDAY | Tripple Extension | Tripple Extension | E16 | C7:C242 | 27 | 13 | 13 | 14 | Ankle Hops (bilateral, in place); Bilateral Backward Ankle Hops; Bilateral Forward/Backward Ankle Hops |  |
| TUESDAY | Hamstring | Bilateral HD | E17 | AN7:AN122 | 22 | 2 | 2 | 5 | Feet-Elevated Glute Bridge (feet on bench); Glute Bridge |  |
| TUESDAY | Chest | Horizontal Push | E18 | AD7:AD162 | 24 | 9 | 9 | 16 | Bench Push-Up - Hands on Bench (incline); Incline Push-Up (hands elevated); Kneeling Push-Up |  |
| TUESDAY | Hamstring/Glutes | Unilateral HD | E19 | AQ7:AQ42 | 7 | 3 | 3 | 5 | Single-Leg Glute Bridge (foot elevated on bench); Single-Leg Glute Bridge (foot on floor); Single-Leg Hip Thrust (shoulders on bench) | R2-LIB-08: reads the single-leg hinge list (AQ); the sheet still says AR7:AR42 (OBSERVED) |
| TUESDAY | Chest/Shoulders | Vertical Push | E20 | AA7:AA122 | 16 | 2 | 2 | 10 | Handstand Push-Up (wall-supported); Pike Push-Up |  |
| TUESDAY | Hamstrings | Leg Curls | E21 | AR7:AR10 | 2 | 0 | 0 | 0 |  |  |
| TUESDAY | Shoulders/Traps | ABdution | E22 | AH7:AH42 | 12 | 0 | 0 | 8 |  |  |
| WEDNESDAY | Calves | - | E24 | AU7:AU13 | 4 | 1 | 1 | 2 | Standing Calf Raise (bodyweight, from a deficit/step) |  |
| WEDNESDAY | Aerobic Capacity | - | E25 | B7:B122 | 19 | 19 | 19 | 19 | Distance Intervals: 1 mile Run / 1 min Walk; Distance Intervals: 2 mile Run / 2 min Walk; Distance Intervals: 3 mile Run / 3 min Walk | truncated cardio range (FIX-02: extend logically) |
| WEDNESDAY | Core | - | E26 | O7:O283 | 16 | 9 | 13 | 15 | Crunch; Leg Raise (lying / supine); Plank (forearm / low plank) |  |
| WEDNESDAY | Focus 1 | - | E27 | AZ7:AZ335 | 49 | 5 | 6 | 25 | Single-Leg Glute Bridge (foot on floor); Hip Thrust or Glute Bridge (either); Rear-Foot-Elevated Lunge (RFE / Bulgarian split squat) |  |
| WEDNESDAY | Focus 2 | - | E28 | AZ7:AZ335 | 49 | 5 | 6 | 25 | Single-Leg Glute Bridge (foot on floor); Hip Thrust or Glute Bridge (either); Rear-Foot-Elevated Lunge (RFE / Bulgarian split squat) |  |
| THURSDAY | Plyo | Plyo | E30 | G7:G162 | 38 | 27 | 27 | 31 | Ankle Hops (bilateral, in place); Low Box Jump (Half-Shin Height); Low Depth Drop |  |
| THURSDAY | Plyo | Plyo | E31 | G7:G162 | 38 | 27 | 27 | 31 | Ankle Hops (bilateral, in place); Low Box Jump (Half-Shin Height); Low Depth Drop |  |
| THURSDAY | Throwing | Throwing | E32 | K7:K87 | 16 | 0 | 0 | 16 |  |  |
| THURSDAY | COD | COD | E33 | L7:L242 | 9 | 9 | 9 | 9 | Fade Route; Flat Route; Lateral Shuffles |  |
| THURSDAY | Tripple Extension | Tripple Extension | E34 | C7:C242 | 27 | 13 | 13 | 14 | Ankle Hops (bilateral, in place); Bilateral Backward Ankle Hops; Bilateral Forward/Backward Ankle Hops |  |
| THURSDAY | Quads | Bilateral KD | E35 | AI7:AI122 | 27 | 3 | 4 | 13 | Bodyweight Squat (air squat); Box Squat (bodyweight); Sissy Squat |  |
| THURSDAY | Back | Horizontal Pull | E36 | X7:X162 | 15 | 0 | 2 | 4 |  |  |
| THURSDAY | Quads/Glutes | Unilateral KD | E37 | AL7:AL42 | 13 | 13 | 13 | 13 | Curtsy Lunge; Deficit Reverse Lunge (standing on plate/step); Forward Lunge |  |
| THURSDAY | Back | Vertical Pull | E38 | U7:U122 | 18 | 0 | 7 | 7 |  |  |
| THURSDAY | Quads | Leg Extensions | E39 | AM7:AM9 | 1 | 0 | 0 | 0 |  |  |
| FRIDAY | Plyo | PLYO | E40 | G7:G162 | 38 | 27 | 27 | 31 | Ankle Hops (bilateral, in place); Low Box Jump (Half-Shin Height); Low Depth Drop |  |
| FRIDAY | Throwing | Throwing | E41 | K7:K87 | 16 | 0 | 0 | 16 |  |  |
| FRIDAY | COD | COD | E42 | L7:L242 | 9 | 9 | 9 | 9 | Fade Route; Flat Route; Lateral Shuffles |  |
| FRIDAY | Tripple Extension | Tripple Extension | E43 | C7:C242 | 27 | 13 | 13 | 14 | Ankle Hops (bilateral, in place); Bilateral Backward Ankle Hops; Bilateral Forward/Backward Ankle Hops |  |
| FRIDAY | Hamstring | Bilateral HD | E44 | AN7:AN122 | 22 | 2 | 2 | 5 | Feet-Elevated Glute Bridge (feet on bench); Glute Bridge |  |
| FRIDAY | Chest | Horizontal Push | E45 | AD7:AD162 | 24 | 9 | 9 | 16 | Bench Push-Up - Hands on Bench (incline); Incline Push-Up (hands elevated); Kneeling Push-Up |  |
| FRIDAY | Hamstring/Glutes | Unilateral HD | E46 | AQ7:AQ42 | 7 | 3 | 3 | 5 | Single-Leg Glute Bridge (foot elevated on bench); Single-Leg Glute Bridge (foot on floor); Single-Leg Hip Thrust (shoulders on bench) | R2-LIB-08: reads the single-leg hinge list (AQ); the sheet still says AR7:AR42 (OBSERVED) |
| FRIDAY | Chest/Shoulders | Vertical Push | E47 | AA7:AA122 | 16 | 2 | 2 | 10 | Handstand Push-Up (wall-supported); Pike Push-Up |  |
| FRIDAY | Hamstrings | Leg Curls | E48 | AR7:AR10 | 2 | 0 | 0 | 0 |  |  |
| FRIDAY | Shoulders/Traps | ABdution | E49 | AH7:AH42 | 12 | 0 | 0 | 8 |  |  |
| SATURDAY | Calves | - | E51 | AU7:AU13 | 4 | 1 | 1 | 2 | Standing Calf Raise (bodyweight, from a deficit/step) |  |
| SATURDAY | Aerobic Capacity | - | E52 | B7:B122 | 19 | 19 | 19 | 19 | Distance Intervals: 1 mile Run / 1 min Walk; Distance Intervals: 2 mile Run / 2 min Walk; Distance Intervals: 3 mile Run / 3 min Walk | truncated cardio range (FIX-02: extend logically) |
| SATURDAY | Core | - | E53 | O7:O283 | 16 | 9 | 13 | 15 | Crunch; Leg Raise (lying / supine); Plank (forearm / low plank) |  |
| SATURDAY | Focus 1 | - | E54 | AZ7:AZ335 | 49 | 5 | 6 | 25 | Single-Leg Glute Bridge (foot on floor); Hip Thrust or Glute Bridge (either); Rear-Foot-Elevated Lunge (RFE / Bulgarian split squat) |  |
| SATURDAY | Focus 2 | - | E55 | AZ7:AZ335 | 49 | 5 | 6 | 25 | Single-Leg Glute Bridge (foot on floor); Hip Thrust or Glute Bridge (either); Rear-Foot-Elevated Lunge (RFE / Bulgarian split squat) |  |

Applied (COACH-R2 R2-LIB-08): the B-day 'Unilateral HD' slot now offers the single-leg hinge list - bodyweight single-leg glute bridges and hip thrusts, plus the DB / barbell staggered-stance and alternating single-leg deadlifts - instead of a second hamstring-curl slot. As wired in the sheet (OBSERVED) it still reads AR7:AR42; the sheets are not edited.

## 7. Band items removed and what replaces them (COACH-ANSWER EQ-01, EQ-02, EQ-07, EQ-08, EQ-12)

| removed (out of scope) | answer | replacement (lowest profile that can do it) |
|---|---|---|
| Band-Assisted (Reverse-Banded) Bench Press | EQ-12 | Barbell Bench Press (gym) |
| Band-Assisted Pull-Up | EQ-01 | Assisted Pull-Up Machine (Pronated Grip) (gym); Jumping Pull-up (BAR); Seated Ring/TRX Pull-Up (feet-supported) (BAR) |
| Banded Barbell Deadlift (accommodating resistance) | EQ-12 | Barbell Deadlift (conventional) (gym) |
| Banded Bench Press (accommodating resistance, speed) | EQ-12 | Barbell Bench Press (gym) |
| Banded Box Squat - any variation, touch-and-go | EQ-12 | Box Squat, any loading - touch-and-go (fast) (KB) |
| Banded Front Squat (accommodating resistance) | EQ-12 | Front Squat (barbell) (gym) |
| Banded KB Swing | EQ-12 | Kettlebell Swing (Russian) (KB) |
| Banded Leg Extension (seated on bench) | EQ-08 | DB Leg Extension (seated on box) (DB); Sissy Squat (BW) |
| Banded Overhead Triceps Extension | EQ-01 | Overhead Dumbbell Triceps Extension (DB); Overhead Cable Triceps Extension (gym) |
| Banded Rolling Hamstring Curl | EQ-08 | Supine Slider Hamstring Curl (BW); Ball Hamstring Curl (medball or stability ball) (HOME); Nordic Hamstring Curl (BW) |
| Banded Single-Arm Lat Pulldown (fast) | EQ-01 | Single-Arm Lat Pulldown (gym) |
| Banded Tantrums (resisted sprint in place) | EQ-01 | Acceleration Starts (BW); Falling-Start Accelerations (BW) |
| Bilateral Reverse-Banded Hops (band-assisted pogo hops) | EQ-12 | Bilateral Repeat Hops (continuous pogo hops) (BW) |
| Bilateral Reverse-Banded Jumps (band-assisted repeat jumps) | EQ-12 | Bilateral Repeat Jumps (continuous full-amplitude jumps) (BW) |
| Box Squat - dead-stop 'deload' (bottom banded) | EQ-12 | Box Squat - any variation, dead-stop ('Deload' = sit and unload on the box) (KB) |
| Chained Barbell Deadlift (accommodating resistance) | EQ-12 | Barbell Deadlift (conventional) (gym) |
| Half-Kneeling Crunch Chop Down (high-to-low) into Active Knee - Knee-Banded Adduction | EQ-01 | Tall-Kneeling Cable Crunch Chop Down (high-to-low) - Object Squeezed Between Knees (gym) |
| Half-Kneeling Crunch Chop Midline (horizontal) into Active Knee - Knee-Banded Adduction | EQ-01 | Tall-Kneeling Cable Crunch Chop Midline (horizontal) - Object Squeezed Between Knees (gym) |
| Half-Kneeling Crunch Chop Up / Lift (low-to-high) into Active Knee - Knee-Banded Adduction | EQ-01 | Tall-Kneeling Cable Crunch Chop Up / Lift (low-to-high) - Object Squeezed Between Knees (gym) |
| Half-Kneeling Pallof Hold - Knee-Banded Adduction | EQ-01 | Tall-Kneeling Pallof Hold (cable) - Object Squeezed Between Knees (gym) |
| Loading variable: BANDS | EQ-12 | (variable-resistance modifier - nothing to replace) |
| Loading variable: CHAINS | EQ-12 | (variable-resistance modifier - nothing to replace) |
| Loading variable: WEIGHT RELEASERS | EQ-12 | (variable-resistance modifier - nothing to replace) |
| Reverse-Banded (Band-Assisted) Squat Jumps (French contrast element 4 - assisted/overspeed plyo) | EQ-12 | Squat Jump (high, bodyweight or lightly loaded) (BW); Bilateral Repeat Hops (continuous pogo hops) (BW) |
| Reverse-Banded Box Squat - any variation, touch-and-go | EQ-12 | Box Squat, any loading - touch-and-go (fast) (KB) |
| Reverse-Banded Box Squat - dead-stop | EQ-12 | Box Squat - any variation, dead-stop ('Deload' = sit and unload on the box) (KB) |
| Reverse-Banded Squat (bands anchored overhead - assistance at the bottom, fades toward lockout) | EQ-12 | (variable-resistance modifier - nothing to replace) |
| Single-Arm Band Row | EQ-01 | Single-Arm DB/KB Row (KB); Inverted Row (BAR); TRX Row (suspension row) (BAR) |
| Split-Stance Pallof Hold - Knee-Banded Adduction | EQ-01 | Tall-Kneeling Pallof Hold (cable) - Object Squeezed Between Knees (gym) |
| Split-Stance Standing Crunch Chop Down (high-to-low) into Active Knee - Knee-Banded Adduction | EQ-01 | Tall-Kneeling Cable Crunch Chop Down (high-to-low) - Object Squeezed Between Knees (gym) |
| Split-Stance Standing Crunch Chop Midline (horizontal) into Active Knee - Knee-Banded Adduction | EQ-01 | Tall-Kneeling Cable Crunch Chop Midline (horizontal) - Object Squeezed Between Knees (gym) |
| Split-Stance Standing Crunch Chop Up / Lift (low-to-high) into Active Knee - Knee-Banded Adduction | EQ-01 | Tall-Kneeling Cable Crunch Chop Up / Lift (low-to-high) - Object Squeezed Between Knees (gym) |
| Squat with One Hip Banded Out (left or right) | EQ-01 | Squat Holding an Object Between the Knees (adduction squeeze) (BW); Cossack Lateral Lunge (BW) |
| Squat with Tube Bands Around the Hips (lateral band pull) | EQ-01 | Squat Holding an Object Between the Knees (adduction squeeze) (BW); Side (Lateral) Lunge (BW) |
| Unilateral Reverse-Banded Hops | EQ-12 | Unilateral Repeat Hops (single-leg continuous pogo hops) (BW) |
| Unilateral Reverse-Banded Jumps | EQ-12 | Unilateral Repeat Jumps (continuous single-leg jumps / bounds) (BW) |

## 8. Rules a generator applies (v1)

1. Ask which profile the client has (EQ-01 intake options; bands are not an option). Filter each pool by profile; never fall back to more equipment silently.
2. Pick the default from the default candidates of the pool (BYOP library or added by a coach answer, CAT-07 / GEN-04) and keep the rest of the eligible pool as dropdown swaps; the client's preference may choose between alternatives (EQ-10).
3. When a pool is empty for the profile, use the coach's own non-band substitute (section 3: EQ-07 no medball, EQ-08 no leg-extension / leg-curl machine) before changing the slot's job; otherwise mark the slot unavailable.
4. Keep the level logic (CAT-04 / CAT-05; level from load position, skill and stability - the zone is only a tag, R2-LIB-02): levels add options; at home, progress an advanced client through the coach's variables - single leg, tempo / slow eccentric, deficit, pauses, load position with a DB or KB (between blocks only, PER-02) - instead of the barbell lift. Between blocks change one detail of a library exercise at a time (which hand holds the weight, grip, stance, implement or range), shown as '<library name> - <detail>'; never invent an exercise (COACH-R2 R2-LIB-01). With no implement named, default bodyweight -> DB -> barbell as level rises, limited by the kit (EQ-09).
5. Joint pain (OBSERVED, EXAMPLE PUSHPULLLEGS SPLIT A7: getting away from fixed grips 'usually' helps): prefer the DB / KB version of a pattern; with pain cut that muscle or pattern 30-50%, move it to machines where available, or drop the exercise (COACH-ANSWER VOL-03). Injured and high-volume clients never get overhead squats, snatches, low-bar squats or depth jumps (EQ-03); older adults never get the overhead or low-bar squat, and for them snatches, all Olympic lifts, plyos and depth jumps are off by default and an opt-in with a warning (COACH-R2 R2-ATH-08).
6. Athletic work at home: athletes still get an Olympic-type lift (ATH-10: KB / DB snatch and clean variations; clean days are squat-leaning, snatch days hinge-leaning, up to 4 x a week, R2-ATH-04; weight by RPE and bar speed, R2-GEN-06); plyos follow the Receive-Create stages - 1 Land, 2 Land & Go, 3 Repeat (CAT-10 / CAT-11, named and timed in R2-ATH-03) - a way of performing any jump chosen by the block, not a fixed property of the exercise - and programs start more ballistic and become more plyometric (each jump and throw is tagged ballistic / plyometric / receive, R2-ATH-02); KB swings are ballistic work and never count as glute sets (R2-VOL-05); older adults (60+) get no Olympic lifts, plyos or depth jumps by default - an opt-in with the warning 'Make sure that you have a fitness professional to help you understand what this means.' - and jumping conditioning items become their no-jump version, the split-step drill its no-hop version (R2-ATH-08); aesthetics / bodybuilding clients throw medballs only in the warm-up (ATH-05: no medball throwing in the main workout); medballs never over 20 lb (EQ-06); pitchers get less overhead pressing, more arm care and light rotational throws (ATH-08); boxers in high punching-volume weeks reduce, never cut, pressing and arm work (ATH-04). A-drills are warm-up drills and never count (ORD-08).

## Verification log (v1)

- Rebuilt by a python script from the v1 catalog (no Google Sheet touched). Eligible records with a band or chains set-up: 0. Out-of-scope or retired records listed as options: 0.
- Profiles: BW gaps 7, BAR gaps 4, KB gaps 4, DB gaps 2, HOME gaps 0, FIELD gaps 6 (pools listed in section 2).
- The NO ACCESS wiring (88 dropdowns, AR instead of AQ at E12/E33 and E19/E46) is the OBSERVED v0 finding; v1 only changes which records count as options (v1 pools, no bands).

## Verification log (v0, 2026-10-08) - kept as history

Adversarial fact-check run on 2026-10-08. The fixes are in `_build_02/noeq.py` and the catalog it reads, as listed in the `02_exercise_catalog.md` verification log.

- **Confirmed from the dumps:** the two NO ACCESS tabs hold 38 + 50 = 88 exercise dropdowns. They differ from AESTHETICS / ATHLETIC only at E12/E33 and E19/E46 (`AR7:AR42` instead of `AQ7:AQ42`), and 'Leg extensions' (E12) is the only pre-typed exercise. The non-machine leg-curl and leg-extension items the coach lists elsewhere are confirmed at RESISTANCE PATTERNS A40/A41, BYOP AN18/AN91 and BALLISTICS C46.
- **Rule 3 was wrong.** It called the Bilateral KD ADVANCED block barbell/machine-only. The block (AI91-AI104) contains 'Sissy Squats' (T0) and four T2 items: the DB box squats AI91/AI94, 'DB thrusters' and 'Single arm DB thruster'. The rule now lists them.
- **Rule 4 overstated the coach.** It turned his remark into a rule. EXAMPLE PUSHPULLLEGS SPLIT A7 says getting away from fixed grips 'usually' helps with joint pain. The rule now quotes the cell and labels the generator use as INFERRED.
- **Tier table contradicted the data.** T2 listed 'plyo box', yet low boxes and steps are coded T0. T2 now reads 'high plyo box (above knee height)'.
- **Inherited catalog fixes:** the corrected rep ranges and level evidence carry through to this file. Tier counts per slot did not change.

## v1 verification log

Adversarial check 2026-10-08 (coach answers re-read in full; nothing in Google Sheets touched).

- **Bands:** this file was already band-free, but the catalog JSON it is built from still labelled 38 active records 'T1 minimal kit (bands, doorway bar, rope)', which contradicted the profile table and the T1 definition in section 1. Fixed in the JSON (now 'doorway pull-up bar, jump rope, suspension trainer, low hurdles; no bands'). Band cues and links that could still reach a client (plyo push-up alias cue, banded-leg-extension video inside the leg-extension entry, band drags in the drag headings, 8 `related` links to band / chain variants) are now marked out of scope. Section 7 (removed items and replacements) checked line by line: every replacement is an active, non-band record.
- **EQ-07 / EQ-08 substitutes:** no band chops, no banded leg extensions, no banded hamstring curls anywhere in sections 3-5. OK.
- **Plyo method (CAT-10 / CAT-11):** rule 6 now says the method is how any jump is performed, chosen by phase, and that programs start more ballistic and become more plyometric (it read as a fixed sequence of exercises).
- **Level changes in the catalog** (back squats and the overhead box squat to ADVANCED, CAT-04; high- / mid-hang power clean to FOUNDATIONAL, ATH-10; thrusters 0.5 shoulders, LIB-14) touch only gym (T3) records or volume credits, so no pool count, gap or profile list in this file changed (checked: none of the re-levelled records appears in a BW / BAR / KB / DB / HOME / FIELD list; the DB Thruster is listed under DB but its level is unchanged and credits are not shown here).
- **Other checks:** 'Justice League' appears only as 'ATHLETIC - GENERAL (tab JUSTICE LEAGUE)' (ATH-13 / FIX-03); core first by default (ATH-11); never overhead squats, snatches, low-bar squats or depth jumps for older / injured / high-volume clients (EQ-03); medballs max 20 lb (EQ-06); no sex-based rules; PRG-01 and FIX-01 still open as the coach skipped them.

## v1 verification log - second adversarial pass (2026-10-08)

Second adversarial check (coach answers re-read in full; nothing in Google Sheets touched). Every pool count in sections 2 and 4 was re-derived with python from the fixed catalog JSON.

| answer | finding | fix |
|---|---|---|
| ATH-10 | The Hex-Bar Jump Squat (named by the coach as a beginner Olympic option) was only in the PLYO pool, so the triple-extension slot could not offer it. | Catalog: TX pool added. Here: gym count 44 -> 45 (section 2 table and section 4 heading); the hex bar is gym-only, so no BW / BAR / KB / DB / HOME / FIELD count or gap changes. |
| EQ-14 | The Blue / Green / Orange aerobic records were run-only (open space); the coach said non-runners use any erg. | Catalog: treadmill / erg set-ups + `modality_v1`. Here: sections 3 and 4 say so. Cardio counts unchanged (open space already fits every profile). |
| EQ-16 / EQ-03 | Section 5 told a home user to 'drop from a high wall/stage' as the bodyweight stand-in for the High Depth Drop (above hip), against this file's own safety note (nothing above knee height at home). | Stand-in is now a medium depth drop from a sturdy bench or step; the High Depth Drop is 'never' for older / injured / high-volume clients (INFERRED from 'never depth jumps', pending coach approval). |
| EQ-07 | The no-ball stand-in for rotational throws was a core drill (cross connect / break dancers), not one of the coach's substitutes. | Now leads with the coach's Fake Medball Slam & Return (plyo push-ups first for the rotational chest pass); the core drills stay as the lower-intensity option. |
| ATH-05 | Rule 6 said aesthetics clients do 'medball work' only in the warm-up; the coach said medball *throwing*. | Rule 6 now says throws. |
| ATH-04, ATH-08, ORD-08 | Not mentioned. | Added to rule 6 (boxers reduce, never cut, pressing / arm work in heavy punching weeks; pitchers less overhead pressing, more arm care, light rotational throws; A-drills are warm-up drills and never count). |

Grep of this file for retired ideas: bands only as 'no bands' / removed items (section 7), 0 size-based 3 / 5 / 7%, 0 0.5 helper credits (only the diamond push-up's 0.5 triceps, INFERRED like dips), 0 plyo zones, 0 'core after the power block', 0 sex-based rules, 'Justice League' only as the verbatim tab reference, 0 hack-squat ranking, 0 '6 weeks = 5 + deload'. PRG-01 and FIX-01 remain open (skipped by the coach).

## v1.1 verification log (2026-10-08)

Rebuilt with python from the v1.1 catalog (no Google Sheet touched). The renderer that writes sections 2, 4 and 6 was first run on the v1 catalog and reproduced the v1 file byte for byte, except one stale v1 count it corrected (the NO ACCESS Plyo dropdown counted the Max-Velocity Sprint, moved to the SPRINT pool by LIB-21: 39 -> 38 options, 28 -> 27 bodyweight).

| check | result |
|---|---|
| eligible records with a band or chains set-up | 0 |
| retired or out-of-scope records listed as options (21.6-mile run included) | 0 |
| PROPOSED-ADDITION records marked as default candidates (`*`) | 0 |
| profile gaps v1 -> v1.1 | BW 7 -> 5, BAR 4 -> 3, KB 4 -> 3, DB 2 -> 2, HOME 0 -> 0, FIELD 6 -> 4 (v1.1 counts include the two new PROPOSED pools, arm care and neck) |
| gaps closed by the coach-approved home items (R2-LIB-07) | BW: Horizontal pull; BW: Shoulder isolation (side / rear / front); BAR: Shoulder isolation (side / rear / front); KB: Biceps; FIELD: Horizontal pull; FIELD: Shoulder isolation (side / rear / front) |
| NO ACCESS 'Unilateral HD' rows on AQ (R2-LIB-08) | 4 of 4 (E12 / E33 aesthetics, E19 / E46 athletic) |
| KB Face Pull pool | shoulder isolation (catalog and this file agree; no override needed) |

## v1.1 verification log - adversarial check (2026-10-08)

`coach_answers_round2.md` re-read in full; every pool count re-derived with python from the fixed catalog JSON. Nothing in Google Sheets touched.

| answer | finding | fix |
|---|---|---|
| R2-VOL-05 | The Russian KB swing (Bilateral HD) and the split-stance contralateral KB swing (Unilateral HD) were marked `*` (default candidate) in the hip-dominant pools, so a KB-only client's hinge slot could default to a swing that fills 0 sets - against the stated 'swap only' role. | `*` removed in those two pools (they stay `*` in the triple-extension pool); section 2: Bilateral HD KB 8 [6] -> 8 [5], Unilateral HD KB 5 [5] -> 5 [4]; catalog `generator.default_candidate_by_pool` added. |
| R2-ATH-08 | The PROPOSED split-step drill is classed plyometric but was on by default for 60+. | Catalog: off by default for 60+ with a no-hop split-step default (INFERRED, catalog 10.3 #3); v1.1 bullet and rule 6 say so. No pool count changes (it is not a default candidate). |
| R2-SES-05 | Section 6 reproduces the OBSERVED NO ACCESS wiring, where biceps, triceps, calves, side raises and leg extensions have one slot each on a full-body day; read as a session shape that contradicts 'never one exercise per muscle, 2 to 4'. | Section 6 intro now says the tables are wiring only and that full-body days get 2-4 exercises per trained muscle (session file owns it). |
| R2-LIB-07 | The Table Row's FOUNDATIONAL level is INFERRED (the coach named no level for the home items). | Catalog basis corrected; the level shown here is unchanged. |
| R2-LIB-08, R2-LIB-04 / LIB-10, R2-LIB-05 / LIB-12, R2-LIB-06, R2-LIB-01, R2-ATH-02 / R2-ATH-03 / R2-ATH-04, R2-GEN-06 | 4 / 4 Unilateral HD rows on AQ; KB face pull in shoulder isolation; both bench push-ups; 21.6-mile run absent; one-detail rule (rule 4); athletic tags (rule 6). | OK |

Retired ideas (live text): acclimation / start-hard / target-seeking 0; deload inside a block 0 (the only 'deload' hits are the box-squat dead stop and the removed banded items); life / sleep / stress inputs 0; effort 10 = fail 0; KB swing glute credit 0; one exercise per muscle on full-body days 0 (section 6 note); Olympic once-a-week cap 0; mid-block tests 0; 1RM for the untrained 0; mandatory videos 0. Gaps per profile unchanged (BW 5, BAR 3, KB 3, DB 2, HOME 0, FIELD 4).
