# 02 - Canonical exercise catalog (Blaze Camp) - v1.1

> **Status (2026-10-11, model v1.3).** This description was last issued at v1.1 (round 2). The library data itself, `02_exercise_catalog.json`, was updated in engine 0.5 work package V2; this text was not. The current rules are in `BLAZE_CAMP_BRAIN.md` v1.3 (what changed: §0c for round 3, §0d for round 4, CT-01 and CX-01..04) and in `generator_spec_v1.json` 1.3.0. Where this file differs from them, they win. Read as history in this file: "`video_urls` keeps the OBSERVED links" and the video-link counts (the third-party links were removed from the library source and each exercise gets a YouTube search link built from its name, COACH-R4 R4-LIB-05; `02_exercise_catalog_crosswalk.json` still lists the links as they stood in his sheets, an open release item); the check-in wording in `muscle_size_class_basis` ("no check-in = no change; a check-in step comes from effort, completion and pain": there is no check-in at all, COACH-R3 R3-VOL-02, R3-VOL-04). Not yet in this file: proposed exercises as optional add-ons that are never a template pick, with wall balls and sled pushes as primary in HYROX and optionally the CrossFit-style class (COACH-R4 R4-LIB-01); carries and sleds dosed by distance or time, with no muscle-set credit (R4-LIB-02); the mid-range pull category and its two records (R4-LIB-03); incline pressing before overhead pressing for bodybuilders and the general population (R4-LIB-03); swap lines that say what a swap keeps and loses (R4-LIB-04).

**Version:** v1.1, 2026-10-08. v1.1 applies the coach's round-2 answers (`coach_answers_round2.md`) and his same-day request to cover every popular US sport, swimming, and the gen-pop 'stay athletic and active' options (pickleball, HYROX). Authority order: round-2 answers > round-1 answers (`coach_answers_full.md`, 138 of 140 answered) > everything else. Everything below is the v1.1 state; whenever a round-2 answer replaced a v1 value, the v1 value stays in the record as a `*_v1` field (`name_v1`, `level.primary_v1`, `volume_credit.per_set_v1`, `taxonomy.pattern_code_v1` ...), and every changed record lists its round-2 changes in `v1_1_changes`. The v1 changelog below is kept (annotated where round 2 changed it). In v1, whenever an answer replaced a v0 value, the v0 value stays in the record (`name_v0`, `level.primary_v0`, `taxonomy.pattern_code_v0`, `record_type_v0` ...), and the v0 verification log is kept at the end.

**Files:** `synthesis/02_exercise_catalog.json` (array of 939 records in v1.1: 913 from v1 + 26 new; records carry `v1_changes` (round 1) and `v1_1_changes` (round 2 and the sport expansion)), `synthesis/02_exercise_catalog_crosswalk.json` (every source cell -> catalog id; unchanged in v1, every id still resolves because renamed records keep their id and merged / retired records stay in the JSON as `record_type: retired`), `synthesis/02_no_equipment_subset.md` (home and no-equipment profiles, no bands; v1.1 adds the coach-approved home items and fixes the NO ACCESS wiring, R2-LIB-08).

**Evidence legend.** OBSERVED = printed in a sheet cell, header, fill or dropdown (tab + cell given). COACH-ANSWER <ID> = the coach's round-1 questionnaire answer (e.g. COACH-ANSWER VOL-09). COACH-R2 <ID> = his round-2 answer (`coach_answers_round2.md`, e.g. COACH-R2 R2-VOL-05; the two round-1 leftovers he answered in round 2 are cited as COACH-R2 LIB-10 / LIB-12). INFERRED = our reading (each record lists its inferred fields in `inferred_fields`). SCIENCE = general training science, not the coach's words. PROPOSED = our suggestion, PENDING COACH APPROVAL; PROPOSED-ADDITION = a v1.1 exercise the expanded sport list needs and the library lacks (status `proposed_v1_1`, swap only until approved). Coach labels are quoted verbatim, typos included ('TRIPPLE', 'SAGITAL', 'DOMNANT', 'ABdution', 'Harmstring'...); our names use correct spelling (COACH-ANSWER FIX-04: correct them in the generator, leave the sheets as they are). Nothing in Google Sheets was modified.

## v1.1 - round-2 answers applied

What changed, in short: the '21.6 mile run' is gone; the KB face pull is shoulder work; bench push-ups exist in both versions; six coach-approved library items and levels are in, plus three home exercises; KB swings are ballistic and never count as glute sets; thrusters count 1.0 quads / 0.5 shoulders / 0.25 glutes; every jump and throw says whether it is ballistic, plyometric or a landing ('receive') drill and every jump carries its Receive-Create stage; every Olympic lift says whether it belongs to a clean day (squat-leaning) or a snatch day (hinge-leaning), how many reps, and how to pick the weight; Olympic lifts, plyos and depth jumps are off by default for clients aged 60+ (opt-in with a warning); the coach's counted spine-loading lifts are tagged; zones are tags only; every eligible exercise lists the one detail that may change between blocks; 22 PROPOSED-ADDITION exercises cover swimming dryland, HYROX, pickleball and other court sports, neck and grip work, skiing, hiking and older adults. Nothing in Google Sheets was modified.

### Changes by question ID (v1.1)

| question | change applied in v1.1 | records |
|---|---|---|
| R2-LIB-01 | One-detail variation grammar approved: the library exercise is always the main pick; between blocks the tool may change ONE detail - which hand holds the weight, grip, stance, implement or range - and shows it as 'Reverse Lunge - dumbbell in the opposite hand'. It never invents an exercise. `variation_v1_1.axes` lists the details each eligible exercise allows (axes INFERRED from set-ups, pattern and laterality); the coach's modifiers (section 9) are the detail vocabulary; one detail per block change (also PER-02). | 553 |
| R2-LIB-02 / R2-LIB-03 | Zones are tags only: zones 1 and 3 = vertical, external-rotation positions (arms low / arms overhead or deep squat), zone 2 = horizontal, internal-rotation; the level comes from load position, skill and stability, made easier by a seat, machine or cable (a deep goblet squat stays FOUNDATIONAL; a seated DB shoulder press or a lat pulldown is FOUNDATIONAL though overhead). Keep both rotation biases in every week and use the bias to pick swaps when something hurts; not by sport. `davidson_zone.basis` rewritten and `davidson_zone.use_v1_1` added; no level changed (the approved examples already hold). | 196 |
| R2-LIB-04 / LIB-10 | KB Face Pull: shoulder work (side / rear delts / traps), a rear-delt option and a swap only - never the main vertical pull; programmed on pull or shoulder days, adjustable (`day_placement_v1_1`). Moved from VERTICAL PULL to the SIDE RAISES pool; credit SHOULDERS/TRAPS 1.0 (was + BACK 0.25 + BICEP 0.25). | 1 |
| R2-LIB-05 / LIB-12 | Bench push-ups, both versions: 'Bench Push-Up - Hands on Bench (incline)' = FOUNDATIONAL (keeps the id, BYOP AD13) and the new 'Bench Push-Up - Feet on Bench (decline)' = ADVANCED (takes AF11 and Sheet23 Z4). | 2 |
| R2-LIB-06 | The '21.6 mile run' is removed from plans and tests: record retired (`retired_v1_1`); the longest run stays the half-marathon plan, used as-is. | 1 |
| R2-LIB-07 | Approved additions and levels: Belt Squat and Seated Machine Shoulder Press = FOUNDATIONAL; Hang Clean, Single-Arm DB Snatch, KB Squat Clean and Hex-Bar Jump Squat = FOUNDATIONAL triple-extension library items (now default candidates, `library_v1_1`); three new home records: Kettlebell Curl, Table Row (inverted row under a sturdy table), Floor Prone Y / T Raises (status `added_v1_1`). The ~120 program-only exercises stay dropdown swaps until the coach adds them (approved). | 9 |
| R2-LIB-08 | 'NO ACCESS' = the self-serve version without coach access, using the full gym library; its 'Unilateral HD' slot reads the single-leg hinge list (AQ), not the leg curls (AR). Applied in `02_no_equipment_subset.md` section 6; the JSON keeps the OBSERVED wiring cells. | - |
| R2-VOL-05 | KB swings (Russian, American, split-stance single-arm) are ballistic / athletic and never count as glute (or any muscle) sets: credit 0 (was GLUTES 1.0 + HAMSTRINGS 0.25), class athletic, power reps; pools TX (ballistic slot, INFERRED) + their hip-dominant pool as a swap that fills 0 sets (`generator.pool_roles_v1_1`, `volume_credit.by_pool`; `generator.default_candidate_by_pool` makes the Russian and split-stance swings default picks only in TX, never in the hip-dominant slot - adversarial check). The trunk-driven rotational swing stays a core drill, tagged ballistic. Thrusters = 1.0 quads + 0.5 shoulders + 0.25 glutes. Glutes 0.25 on squats, lunges, deadlifts and RDLs confirmed; 7 squats that gave no glute credit (heels-elevated goblet, hack, landmine hack, pendulum, object-between-the-knees, wall-assisted, barbell zercher) now give 0.25 (INFERRED application; the sissy squat has no hip extension). | 14 |
| R2-ATH-02 | `contact_class_v1_1` on every jump and throw (plus the swings and the conditioning items that contain a jump): 68 ballistic, 70 plyometric, 12 receive (stick-the-landing / depth-drop landings). Named items follow the coach's list; the rest follow his rule (INFERRED). Four v1 qualities changed: DB Repeated Squat Jumps, DB Staggered-Stance Switch Jump and RFE Lunge Jumps (suitcase DB) are loaded jumps = ballistic; Plyometric Push-Ups = plyometric (repeated, INFERRED). Unloaded continuous split / lunge jumps stay plyometric (repeated jumps). | 140 |
| R2-ATH-03 | Plyo progression named 'Receive-Create stages': 1 Land, 2 Land & Go, 3 Repeat. 12-week block weeks 1-3 / 4-7 / 8-12; 8-week 1-2 / 3-5 / 6-8; restart at stage 1 each off-season; stay put in maintenance blocks; intermediate and advanced athletes may start at stage 2. `athletic_quality.receive_create_stage` on every jump (the default stage is only what the name implies; the program picks the stage per block); the 'name PENDING' wording is gone. | 96 |
| R2-ATH-04 / R2-ATH-05 / R2-GEN-06 | `olympic_v1_1` on every Olympic-type lift: clean family = squat-leaning clean days (16), snatch family = hinge-leaning snatch days (18), jerks = either day (4, INFERRED), hex-bar jump = loaded jump (1); up to 4 x per week. Reps: full squat cleans / snatches 3-5 per set (same weekly reps, e.g. 6 x 5 @ 75 %), DB / KB and pull variants keep the 4 x 8 @ 75 % -> 4 x 4 @ 90 % ramp, power / hang versions 3-5 (INFERRED); the coach's eye on speed. Weight by RPE / reps in reserve and bar speed (power output); % of 1RM only for competitive Olympic lifters (their own programming). 'Hang Clean (% of 1RM; catch not stated)' renamed 'Hang Clean (catch not stated)'. | 39 |
| R2-ATH-08 | `older_default_excluded` on 141 records: every PLYO / ANKLE item, the three hop grids, every Olympic lift or derivative (incl. push jerks), the hex-bar jump, the jumping conditioning items (burpees, jumping jacks, burpee broad jump - with a no-jump swap) and, since the adversarial check, the PROPOSED split-step drill (classed plyometric; the no-hop split-step is its 60+ default). For 60+ they are off by default and available as an option, with warning key WARN_60PLUS_POWER_WORK: 'Make sure that you have a fitness professional to help you understand what this means.' (the coach's words; Spanish draft pending approval, R2-GEN-08). The ATH-09 'few plyos unless they ask' rules now read 'off by default, opt-in with the warning'; the EQ-03 'never' rules on snatches and depth jumps now name injured / high-volume clients, with older adults on the R2-ATH-08 opt-in (the barbell overhead squat and low-bar squat keep 'never' for all three groups). Youth: Olympic lifts from the floor from about 14, after one block of hang work (6 floor lifts). | 140 |
| R2-SES-01 / R2-SES-02 | `axial_spinal_load.spine_day_v1_1` on 158 records: 25 counted heavy spine lifts (17 named by the coach: barbell back / front / zercher / overhead / Smith squats, barbell or trap-bar deadlifts and RDLs, good mornings; the rest barbell / trap-bar variants, INFERRED), 25 second-day options if not sore (goblet, hack, pendulum named; other front-loaded DB / KB / landmine / machine squats and hinges INFERRED), 40 Olympic / triple-extension lifts not counted, 68 other lifts not counted (leg press, belt squat, hip thrusts, back extensions, reverse hyper, single-leg work named; a few INFERRED; the adversarial check moved 4 calf raises here from the second-day list - calves run every leg day, VOL-17). The approved rule (heavy squat and heavy deadlift on two different days; non-axial hinge, leg press or belt squat on the other days) replaces the v1 'PENDING' encoding. | 156 |
| R2-PER-07 | `test_rules_v1_1` on the 13 test records: test before the block (or in week 1) and at the end, never mid-block; untrained people never test all-out from zero (an 80-90 % effort instead of a max mile; 5RM / 3RM, never a 1RM). | 13 |
| R2-GEN-02 | Videos are optional (people can look them up on YouTube; the coach's own videos come later): the v1 'video links still to do' item is closed as optional; `video_urls` keeps the OBSERVED links. | - |
| R2-GEN-08 | Spanish names: neutral Latin American Spanish with the English gym term in brackets ('Empuje de cadera (Hip Thrust)'), every line approved by the coach or a coach he trusts. The format is recorded here; the names are not written yet (translation + approval pending). | - |
| R2-ATH-01 | The plyo : ballistic shares by sport are approved; they live in `04_profiles.json` and use the `contact_class_v1_1` tag added here. | - |
| Sport expansion (coach request 2026-10-08) | 22 PROPOSED-ADDITION records (section 2.8: swimming dryland, HYROX stations, pickleball / court sports, neck and grip work for collision and grappling sports, skiing, hiking and older-adult needs; never band-based) and `sport_use_v1_1` tags on 38 existing records that the new sports use (lateral shuffles, rotational and overhead medball throws, sled push, farmer carry, ergs, Y / T raises, face pulls ...). `profile_category_v1_1` maps each new record to the 04_profiles category vocabulary (ISO_NECK, ISO_GRIP, ISO_REAR ...). | 60 |

### New fields (v1.1)

| field | content | question IDs | records |
|---|---|---|---|
| contact_class_v1_1 | ballistic / plyometric / receive + basis | R2-ATH-02, R2-VOL-05 | 150 |
| athletic_quality.receive_create_stage (+ plyo_method_rule_v1_1) | default stage 1-3 as named, stages available, evidence; the approved stage timing | R2-ATH-03 | 96 |
| olympic_v1_1 | family (clean / snatch / jerk / loaded jump), day pattern, weekly frequency, reps, load guidance | R2-ATH-04, R2-ATH-05, R2-GEN-06 | 39 |
| older_default_excluded | 60+ default exclusion, opt-in, warning key (+ default_swap for jumping conditioning items and the split-step) | R2-ATH-08 | 141 |
| axial_spinal_load.spine_day_v1_1 | counted heavy spine lift / second-day option if not sore / not counted | R2-SES-01, R2-SES-02 | 158 |
| davidson_zone.use_v1_1 | zone = tag; use the bias to pick swaps when something hurts | R2-LIB-02, R2-LIB-03 | 196 |
| variation_v1_1 | the one-detail changes allowed between blocks (axes) | R2-LIB-01 | 553 |
| test_rules_v1_1 | when to test and the untrained submax rule | R2-PER-07 | 13 |
| day_placement_v1_1 | pull or shoulder day, adjustable (KB face pull) | LIB-10 | 1 |
| library_v1_1 | added to the master library / level set by the coach | R2-LIB-07 | 6 |
| retired_v1_1 | why a record left the active catalog in v1.1 | R2-LIB-06 | 1 |
| new_in_v1_1 | coach-approved addition / split / PROPOSED-ADDITION, with why it is needed | R2-LIB-05, R2-LIB-07, sport expansion | 26 |
| sport_use_v1_1 | sports that use the item (plain names; the profile merge maps them to 04_profiles ids) | sport expansion (INFERRED) | 64 |
| profile_category_v1_1 | 04_profiles category of a new record (ISO_NECK, ISO_GRIP, ISO_REAR, CORE ...) | sport expansion | 20 |
| generator.pool_roles_v1_1 / volume_credit.by_pool / generator.default_candidate_by_pool | swings: TX = ballistic slot; hip-dominant pool = swap that fills 0 sets; per-pool default flag (default only in TX; added by the adversarial check) | R2-VOL-05 | 3 |
| v1_1_changes | per-record round-2 changelog (question ID, change, evidence; adversarial-check entries carry `pass`) | all | 733 records, 2182 entries (762 from the adversarial check: 29 targeted fixes + 733 `muscle_size_class_basis` rewrites) |
| *_v1 fields (name_v1, level.primary_v1, per_set_v1, pattern_code_v1, record_type_v1 ...) | the v1 value a round-2 answer replaced | various | 230 |

### Resolved by round 2 (pending in v1)

- **LIB-14 vs VOL-09 (thrusters)**: R2-VOL-05 - 1.0 quads + 0.5 shoulders + 0.25 glutes.
- **CAT-04 (back squats ADVANCED)**: R2-LIB-02 approved the principle (level from load position, skill and stability), which is the reading that moved them; no change.
- **EQ-03 extension (High Depth Drop)**: for older adults R2-ATH-08 replaces 'never' with 'off by default, opt-in with a warning'; for injured / high-volume clients the INFERRED 'never' stays.
- **PER-04 encoding (axial)**: R2-SES-01 / R2-SES-02 - two different heavy days; the counted list and the 'fine on the second day if not sore' list are approved.
- **LIB-10, LIB-12**: R2-LIB-04 / LIB-10 and R2-LIB-05 / LIB-12.
- **PRG-01 / FIX-01 (NO ACCESS)**: R2-LIB-08.
- **LIB-18 (21.6 mi)**: R2-LIB-06 - removed.
- **CAT-11 (name of the plyo progression)**: R2-ATH-03 - 'Receive-Create stages'.
- **GEN-06 (videos)**: R2-GEN-02 - optional.
- **Program-only exercises**: R2-LIB-07 - they stay dropdown swaps until the coach adds them.

### Still pending (catalog-related, v1.1)

- **PROPOSED-ADDITION (new)**: the 22 items in section 2.8 need the coach's approval (levels, doses and sport fit are INFERRED); until then they are swaps only, never default picks.
- **LIB-19**: the 9 PROPOSED carries / drags (v1) still need approval; HYROX now uses the sled push and farmer carry, so they are flagged with `sport_use_v1_1`. POSTERIOR OBLIQUE and LATERAL SUBSYSTEM headings are still empty.
- **R2-VOL-05 application**: the KB swing's TX (ballistic) pool and the glute 0.25 added to 7 squats are our reading of his rule (INFERRED).
- **R2-ATH-02 edge cases**: loaded repeated jumps are read as ballistic (load) and unloaded continuous split / lunge jumps as plyometric (repeated) - INFERRED tie-breaks.
- **CAT-02**: traps, front delts, adductors and neck still have no big / small class (neck now has two PROPOSED exercises that count no sets).
- **SLOT FIT** (never asked): front raises sit in the 'ABdution' side-raise pool.
- **LIB-02 follow-up**: the Push-Up Box Jump set-up.
- **GEN-01 / R2-GEN-08**: Spanish names to write and have approved.
- **v1 questions not asked in round 2** (10.2 #2, #4, #5, #6, #7, #8, #9): strap rotations, full lifts from INTERMEDIATE, constraint 4-5 machines for every FOUNDATIONAL client, biceps 0.25 on pulls, carries as core sets, toes-to-bar / knees-to-chest homes, push-up box jump.
- **Adversarial check (v1.1)**: the 60+ no-hop split-step default (10.3 #3) and the 14 / 17 / 20-mile distance tests (10.3 #5).
- New questions raised in v1.1 are in section 10.3.

## v1 - coach answers applied (round 1; kept as history, annotated where round 2 changed it)

What changed, in short: bands, chains and weight releasers are gone from every active record (36 band or variable-resistance items are now `out_of_scope`, 18 records lost a band set-up, and every band substitute now points to a non-band option); 10 records are retired (the Camporini deadlift and the two strap squats the coach removed, plus 7 near-duplicates merged into their twin); 12 records are new (2 machines the coach approved, 1 plyo variant he described, 9 PROPOSED carries and drags); knee-flexion work has its own LEG FLEXION pool; every active record now says how much one set counts toward each muscle (helpers 0.25, athletic work 0), how constrained it is (1-5), which generator pool it feeds and whether it can be the default pick.

### Changes by question ID

| question | change applied in v1 | records |
|---|---|---|
| CAT-02 | Big / small muscle classes confirmed (big = quads, glutes, hamstrings, lats/upper back, chest; small = biceps, triceps, side and rear delts, calves, forearms, abs). Every record's `muscle_size_class_basis` cites it. Traps, front delts, adductors and neck are still unplaced. The size class is descriptive (rep ranges, VOL-11) and never sets the weekly 3 / 5 / 7% increase, which the person's state chooses (COACH-ANSWER VOL-05, UNI-05; stated in every `muscle_size_class_basis`). **[v1.1: 'the person's state' no longer includes life / sleep / stress (COACH-R2 R2-GEN-04): the plan follows its planned stairway (R2-PER-03 / R2-PER-04), does not change without a check-in (R2-VOL-03), and a check-in step comes from effort, completion and pain only (R2-VOL-01); all 733 `muscle_size_class_basis` texts rewritten by the adversarial check]** | 707 |
| CAT-04 / CAT-10 | Pat Davidson zones are rotation biases: zone 1 = vertical, load low and close (external rotation), zone 2 = horizontal, hands in front / knee at hip height (internal rotation, compressive), zone 3 = vertical overhead or deep squat (external rotation). `davidson_zone` added where the 10_equipment_model tags a zone; zones do not apply to plyos. The cable-curl 'Zone 1/2/3' flag is closed (arm position). Front-loaded zercher stays FOUNDATIONAL (Box Zercher level conflict closed). Load behind the body / overhead = ADVANCED: High-Bar, Low-Bar and 'Back Squat (bar position not stated)' moved to ADVANCED ('A barbell back squat is more advanced'; BYOP filed them MODERATE / untiered, kept in `level.byop_placements`) and the Overhead Box Squat to ADVANCED (adversarial check). Machines and cables are easier, so constraint 4-5 machines may be offered from FOUNDATIONAL (`level.generator_min_level`, with EQ-04). | 185 zones; 15 machines; 4 levels |
| CAT-05 / CAT-06 / PRG-05 | Levels add options and never remove them, and client level is separate from exercise level: `level.generator_min_level` = the lowest exercise-skill tier (movement competence, not the client's volume level L1-L3) the generator may offer it to; higher tiers can always pick it. Levels are still theoretical, so they are defaults, not rules. Client volume levels per PRG-05: L1 = novice / newby (the same thing: under about 6-12 months of training, or back after 6-12+ months off), L2 = intermediate (over a year of consistent training), L3 = advanced (second adversarial check: `generator_min_level_axis` had read 'L1-L3 = NOVICE / NEWBY / INTERMEDIATE', the retired v0 ladder). | 707 |
| CAT-07 | BYOP MASTER EXERCISE LIBRARY = single source of truth: only BYOP-selectable items (plus items a coach answer added) can be the default pick in a slot; reference and program items are dropdown swaps (`generator.default_candidate`). | 360 defaults |
| CAT-08 | Thorax / pelvis rule confirmed (trunk moves on a still pelvis = thorax; pelvis/legs move on a still trunk = pelvis; both = BOTH). Applied (INFERRED) to the conflicts: Toes to Bar and Knees to Chest (hanging) -> CORE PELVIS, V-Up -> BOTH. Copenhagen plank noted as a case the coach calls complicated. | 3 |
| CAT-09 | New LEG FLEXION pool (code KFLEX, verbatim 'LEG FLEXION' Sheet25 H11): machine leg curl, Nordic, prone DB curl, slider curl and ball curl moved out of BILATERAL HIP DOMINANT. They count 1.0 toward hamstrings and never toward the hinge pattern. | 5 |
| CAT-10 / CAT-11 | Plyo method is a way to perform a jump, not a zone: receive and pause -> receive then create -> repeated receive/create; unilateral is harder than bilateral; long ground contact = ballistic, short = plyometric; programs start ballistic and become plyometric. `athletic_quality` (+ `plyo_method`, names PROPOSED) on every athletic record. `plyo_method` is only the method the name implies (`plyo_method_role: default_as_named`); the program picks the method per phase for any jump (`plyo_methods_available`, `plyo_method_rule`) - it is not a fixed exercise property. Second adversarial check: v0 notes still spoke of plyo zones (Single-Leg Depth Drop 'semantically Zone 1 (Receive pause/creat)', High Depth Drop 'Zone-1-type', and 'NOT the plyo zone' on the cable curl and rope push-down) and are now marked superseded by CAT-10 / CAT-11. | 201 |
| CAT-13 | Contralateral / ipsilateral modifiers rewritten in the coach's words: contralateral pulls you into the hip (change-of-direction athletes: football, soccer, basketball, tennis); ipsilateral helps you out of the hip (sprint acceleration, e.g. ipsilateral step-ups); for bodybuilders / powerlifters both are health accessories, mostly in weeks 1-4. The `modifier_role_v1` of these modifiers now says this (goal-driven choice; between-block change only as a secondary use); 'Split stance ALWAYS contralateral' is a fixed rule. | 13 |
| UNI-01 / UNI-07 | A unilateral or alternating set counts once (10/10 = 10 per side = 1 set); unilateral knee-dominant sets count for quads (glutes only as a 0.25 helper). `volume_credit.set_counting` on every unilateral/alternating record. | 109 |
| UNI-12 / LIB-20 | Frontal / transverse lower-body moves are for court and combat athletes (little for aesthetics): `population_rules` tag them; 'Hold between knees squats', Cossack lateral lunge and the split-stance contralateral KB swing join the library; the lateral step-up is frontal-plane work (plane question closed). | 4 |
| VOL-09 | Helpers get 0.25 of a set (not 0.5). `volume_credit.per_set` = main mover 1.0 + each helper 0.25 on every resistance record. Biceps 0.25 on pulls is the same helper rule applied by us (SCIENCE), except on the straight-arm Lat Pull-over, which now counts BACK 1.0 only (no elbow flexion; matches `12_volume_algorithm_v1.md`; second adversarial check). | 289 resistance + 95 core |
| VOL-10 | Athletic patterns (plyos, throws, Olympic lifts, sprints, change of direction) never count toward muscle volume: `volume_credit.counts_toward_muscle_volume = false`, tracked as contacts / throws / power reps / meters. The 4 push presses / push jerks sit in both the VERTICAL PUSH and TRIPLE EXTENSION pools; `volume_credit.by_pool` now says they count only in the VERTICAL PUSH slot and are power reps in the triple-extension slot (second adversarial check: the JSON had counted them everywhere). | 323 + 4 |
| VOL-17 | Rear delts get their own sets: `delt_head` (side / rear / front) on every shoulder-isolation record so the generator can track rear-delt sets apart from side raises. | 22 |
| PER-02 | Modifiers are only for the 1-2 small variable changes between 4-6 week blocks (grip, stance, implement, ROM, rep range), never all at once. CAT-12 ('I don't understand the question') needs no other answer. | 51 |
| PER-04 / EQ-11 | `axial_spinal_load` on lower-body and triple-extension records: squat with the bar once a week (deadlifts load the spine too); the second knee-dominant day takes a no-axial option (leg press, new Belt Squat). The Smith machine squat is axial 'high' (bar on the back; was 'moderate', corrected by the adversarial check). Encoding added by the second check (INFERRED - PENDING COACH APPROVAL): 'high' = the week's one axial squat; the other knee-dominant day takes 'none' or 'low'; 'moderate' (goblet / DB / KB / hack / pendulum / landmine) only when the client is not sore and not already axially loaded that week. **v1.1: approved as R2-SES-01 / R2-SES-02 (counted list and second-day list tagged in `spine_day_v1_1`).** | 156 |
| GEN-04 | Every record has a `generator` block: eligible, pool(s) for the default pick and the same-category dropdown swaps, default_candidate, and why. | 913 |
| GEN-07 | Set-ups the coach described are stored as `coach_cues` (with their question ID). | 70 |
| GEN-08 | No V-squat ever: V-Squat (machine) is `generator.eligible = false`. | 1 |
| ATH-04 | Boxers / striking athletes in high punching-volume weeks: pressing and arm-isolation sets go down but are never cut out completely (`population_rules` on every horizontal / mid-range / vertical push, biceps and triceps record; added by the second adversarial check). | 96 |
| ATH-05 | No medball throwing in the main workout for aesthetics / bodybuilding clients: warm-up only (`population_rules` on every throw). | 41 |
| ATH-08 | Pitchers: less overhead pressing (every VERTICAL PUSH record), more arm care (ARMCARE), rotational throws kept light (25 rotational throws) (`population_rules`; added by the second adversarial check). | 55 |
| ATH-09 | Older adults: few plyos unless they ask (tag on every plyo / ankle record); no sex-based rules; youth may do Olympic lifts from the floor when the program calls for them. **v1.1: COACH-R2 R2-ATH-08 - 60+ = no Olympic lifts, plyos or depth jumps by default, opt-in with a warning; youth from the floor from about 14 after a hang block.** | 101 |
| ATH-10 | Everyone in athletic training gets Olympic lifts. Beginner options (DB/KB snatch, KB clean, DB/KB high pull, hex-bar jump squat, hang cleans, including the high-hang and mid-hang power clean, the easy end of the coach's EASY->HARD order) -> FOUNDATIONAL; power clean / power snatch / power clean & jerk -> INTERMEDIATE (BYOP files them ADVANCED); low-hang power clean stays INTERMEDIATE; squat versions stay ADVANCED. The Hex-Bar Jump Squat (one of the coach's named beginner options) was only in the PLYO pool, so a beginner's Olympic slot could not reach it: it is now in the TRIPLE EXTENSION pool too (second adversarial check). | 13 |
| EQ-01 / EQ-02 / EQ-07 / EQ-08 | No bands anywhere. Band-dependent exercises are `out_of_scope` with a non-band replacement (band row -> DB/KB row or inverted row; band-assisted pull-up -> assisted machine, jumping pull-up or ring/TRX pull-up; banded leg extension -> DB leg extension or sissy squat; banded hamstring curl -> slider / ball curl or Nordic; knee-banded anti-rotation chops -> the coach's object-between-the-knees version). Band set-ups were removed from records that also have a cable / DB option, 'bands_only' substitutes were deleted, and band chops are gone from the no-medball substitutes (now plyo push-ups, fast cable rotations or the fake medball slam). T1 is redefined without bands (the `min_access_tier_label` of 38 active records still read 'T1 minimal kit (bands, ...)' and was fixed by the adversarial check, as were 8 `related` links to band / chain variants, now tagged `v1_status: out of scope`, the leg-extension video entry that embedded the banded-leg-extension video, the band cue on the plyo push-up alias and two drag headings that suggested band drags). The second adversarial check also marked the 'REVERSE BANDED' cue on the Single-Leg Squirrel Jumps alias / dose out of scope, flagged the v0 'band face pull?' reading on the KB Face Pull, and made the 7 rotational throws' no-ball substitute lead with the coach's own Fake Medball Slam & Return (EQ-07: substitute, don't skip). | 40 + 9 |
| EQ-03 | Older / injured / high-volume clients: never overhead squat, snatch, low-bar squat or depth jumps (`population_rules: never`), and constrained machines are preferred (constraint 4-5). The second adversarial check added the High Depth Drop (above hip height) as an INFERRED extension - PENDING COACH APPROVAL (its landing is at least a depth jump's). **v1.1: for older adults the snatches and depth jumps are now 'off by default, opt-in with a warning' (COACH-R2 R2-ATH-08); 'never' stays for injured / high-volume clients and for the overhead squat and low-bar squat.** | 30 never + 1 INFERRED |
| EQ-04 | FOUNDATIONAL older or injured clients may use the machines filed MODERATE / ADVANCED (leg press, pendulum, hip thrust machine); applied to every constraint 4-5 resistance machine via `level.generator_min_level` (INFERRED extension, see open questions). | 15 |
| EQ-05 | New record: Seated Machine Shoulder Press (VERTICAL PUSH had no machine option). | 1 |
| EQ-06 | Medballs never over 20 lb; slams 10-20 lb, overhead throws 6-10 lb, sit-up throws 6-8 lb, passes and rotations 8-10 lb, lighter for youth and older clients (`implement_load` on every medball record). | 92 |
| EQ-11 | Machines are not ranked (brands and angles differ): the hack-squat 'fallback only' rule is dropped; hack squat and leg press are more constrained than the Smith machine; belt squat = no axial load (new record); GHD / reverse hyper only if available and the client feels the right muscles. | 4 |
| EQ-12 | No variable resistance for now: banded / reverse-banded / chained lifts and plyos plus the BANDS, CHAINS, WEIGHT RELEASERS and reverse-band modifiers are `out_of_scope` (the 'I HAVE NO IDEA' weight-releaser flag is closed). | 21 |
| EQ-13 | Constraint scale 1-5 approved (5 seated machine with back pad, 4 plate-loaded / Smith / chest-supported, 3 cable or DB on a bench, 2 standing free weight, 1 bodyweight / ballistic / reactive): `constraint_level` on every active record. | 707 |
| EQ-14 | The Blue / Green / Orange aerobic work runs on any available tool (bike, rower, ski erg, treadmill) for non-runners; calories or time are often easier, but distance is kept and tracked. Not applied in v1 (the 12 aerobic records were run-only); the second adversarial check added treadmill / erg set-ups to them and `modality_v1` to them and to the 16 Lactate Clearance records. | 28 |
| EQ-15 / EQ-16 | Depth-drop heights (low 6-12 in, medium 12-18 in, high above hip), hurdle heights (6 in MODERATE, 12 in+ ADVANCED) and loaded jumps at about 10-20% of body weight stored as cues. The High Depth Drop's bodyweight substitute ('drop from a high wall/stage') now regresses to a medium depth drop from a bench (no household drop above knee height; second adversarial check). | 7 |
| LIB-01 | 'LEFT TEST' = L-Test / L-Drill (3-cone) (renamed, ambiguity closed); '5/10/05' = the 5-10-5 pro-agility shuttle. | 2 |
| LIB-02 | Push-Up Stick the Landing: hands start on a box and land on the floor (renamed, cue added, ambiguity closed). Push-Up Box Jump is still INFERRED (floor -> box). | 2 |
| LIB-03 | The second 'Low Depth Drop' (G10) is the single-leg or weighted variant: new record 'Low Depth Drop - Single-Leg or Weighted' takes the G10 / Sheet23 F3 cells. | 2 |
| LIB-04 | Advanced Hurdle Hops = taller hurdles + continuous quick contacts (renamed; possible-duplicate link replaced by a progression). | 2 |
| LIB-05 | Two MODERATE plyo tracks (plate hops G44 block, hurdles/plyos G89 block): an intermediate athlete gets one from each (`plyo_moderate_track`). | 19 |
| LIB-06 | No levels on throws, 'just do them right': every throw is level 'any' (old levels kept in `level.primary_v0`). | 40 |
| LIB-07 | Full Snatch / Clean / Clean & Jerk renamed Squat Snatch / Squat Clean / Squat Clean & Jerk; Weighted Squat to Calf Raise takes any implement. | 4 |
| LIB-08 | No levels on the GHD (level 'any'). | 1 |
| LIB-09 | Camporini deadlift and strap rotating in / out retired; Pull under = Lat Pull-over (cable) (the pull-under record merged into it); set-ups stored for Kong Row (double-KB row from the floor, low stimulus, for shoulder/back pain, FOUNDATIONAL), Low DB Squat (DBs hanging at the sides), Single-Leg Get-Up (box pistol) and the alternating staggered-stance single-leg deadlifts (DB and barbell). Second adversarial check: the Kong Row still carried the v0 Kroc-row dose '10-20 each arm' (now 8-15 reps, both KBs together), and the v0 'meaning unknown / ask coach' notes on these records are now marked superseded. | 10 |
| LIB-10 | KB Face Pulls: unanswered - stays PENDING (kept in VERTICAL PULL as a swap only, rear-delt credit INFERRED). **v1.1: answered (COACH-R2 R2-LIB-04 / LIB-10) - shoulder work in the SIDE RAISES pool, swap only.** | 1 |
| LIB-11 | The second 'Standing DB Press' (AA51 / AB14) is the standing barbell press: cells moved to Standing Barbell Overhead Press (now ADVANCED). | 2 |
| LIB-12 | Bench Push-ups: unanswered - stays PENDING (v0 reading kept). **v1.1: answered (COACH-R2 R2-LIB-05 / LIB-12) - two records, hands on bench FOUNDATIONAL, feet on bench ADVANCED.** | 1 |
| LIB-13 | Push press is the easier lift (FOUNDATIONAL, including the DB / single-arm / seesaw versions); push jerk is INTERMEDIATE to ADVANCED. | 7 |
| LIB-14 | Thrusters are conditioning-leaning and count 1.0 quads + 0.5 shoulders (v1.1: + 0.25 glutes, R2-VOL-05) wherever they are picked (LIB-14 RIGHT with no text = his rule; an exercise-specific answer kept over the VOL-09 helper default 0.25, the same way dips keep 0.5 / 0.5; matches `12_volume_algorithm_v1.md`). v1 had applied 0.25; corrected by the adversarial check; confirmation question 10.2 #10. **v1.1: COACH-R2 R2-VOL-05 - 1.0 quads + 0.5 shoulders + 0.25 glutes.** | 3 |
| LIB-15 | Leg extension and leg curls are available at every level (the 'ADVANCED' / 'UNILATERAL' labels were typos; lying / seated leg curls are bilateral). | 5 |
| LIB-16 | Dips count 0.5 chest + 0.5 triceps and belong on push days; upright rows stay side-delt work. | 4 |
| LIB-17 | Near-duplicates merged: v0 merges confirmed (seated DB curls, side planks, ball hamstring curls, DB calf raises) and 7 more merged (pull-under -> lat pull-over, the two conventional deadlifts, the two pronated barbell rows, the two deficit reverse lunges, BALLISTICS 'drop and jump' -> Depth Jump, and the two weighted drop-release-jump pairs). | 16 |
| LIB-18 | '21.6 mile run' = 'a marathon' per the coach, but a marathon is 26.2 mi: flagged, not a default test. **v1.1: removed from plans and tests (COACH-R2 R2-LIB-06); record retired.** | 1 |
| LIB-19 | Carries and drags are for athletes and general fitness, the sling systems for advanced athletes and rehab (`audience_v1`). 9 PROPOSED starter carries / drags fill the empty CARRY / DRAGS headings (farmer handles, trap bar, KB, sandbag, sled). | 31 |
| LIB-21 | Speed-session order is fixed: squirrel jumps -> MACH drills / acceleration starts -> max-velocity sprint (`speed_session`). MACH drills, A-march / A-skip / A-runs, acceleration and falling starts join the library; the max-velocity sprint moves from PLYO to SPRINT. | 9 |
| LIB-22 | Medball 'ALL LIST' = one pass, 1 x 10 each throw (~200 throws). | 1 |
| PRG-07 | Dose notation: '12/10/8 -20' = pyramid (12 mid weight, 10 heavier, 8 heaviest) then a light set of 20; '10/10' = 10 per side (`typical_rep_range.dose_notation_v1` / `per_side_notation_v1`). Second adversarial check: on the 49 two-sided records the note now adds the coach's own correction (10/10 on bilateral curls was his mistake: it means one arm / side at a time, one set; a two-sided 10/10 written on purpose = a set of 10 then another set of 10); the note was removed from the 20 s / 40 s cardio intervals ('20/40' = work / rest seconds) and the Hex-Bar Jump Squat ('12/10/8/8' = reps per set), and added to 2 records with X/X doses. | 139 |
| ORD-08 | A-drills (A-march / A-skip / A-run, MACH drills) are warm-up drills and never count as volume. v1 had them only as speed-session step 2 with `volume_counting: reps_or_distance`; the second adversarial check added the WARMUP pool, `warmup_role_v1` and `volume_counting: warmup_not_counted` (the speed-session step is kept, LIB-21). | 4 |
| ATH-13 / FIX-03 | 'JUSTICE LEAGUE' was only a marketing name: prose and the JSON `program` field now say 'ATHLETIC - GENERAL (non-competitive adults and youth)' (`program_v0` keeps the old value, 23 alias / dose entries); the tab name stays verbatim only inside OBSERVED cell references (`tab`, `observed_in_programs`). | 23 |
| VOL-11 | 40-rep sets are an AMRAP / CrossFit-style option only; no catalog dose uses a 40-rep resistance set (the 40-contact squirrel-jump doses are contacts, not a rep scheme). | - |

### New fields (v1)

| field | content | question IDs | records |
|---|---|---|---|
| generator | eligible / pools / default_candidate / why | GEN-04, CAT-07, GEN-08, LIB-10, LIB-18 | 913 |
| volume_credit | per-set credit by coach muscle group; counts_toward_muscle_volume; set_counting for unilateral | VOL-09, VOL-10, LIB-14, LIB-16, UNI-01, UNI-07, CAT-09 | 707 |
| constraint_level | 1-5 (5 = seated machine) | EQ-13 (scale), EQ-03 | 707 |
| davidson_zone | zone 1-3 + rotation bias (theoretical) | CAT-04, CAT-10 | 280 |
| axial_spinal_load | none / low / moderate / high + the PER-04 rule | PER-04, EQ-11 | 156 |
| population_rules | never / preferred / warm-up only / few plyos / beginner Olympic option / pitchers / boxers ... | EQ-03, EQ-04, ATH-04, ATH-05, ATH-08, ATH-09, ATH-10, UNI-12, EQ-11, LIB-09 | 323 (231 before the second adversarial check) |
| modality_v1 | any-erg modality for the aerobic Blue / Green / Orange and Lactate Clearance work | EQ-14 | 28 |
| warmup_role_v1 | A-drills = warm-up drills, never counted (also speed-session step 2) | ORD-08, LIB-21 | 4 |
| volume_credit.by_pool | slot-dependent credit (VERTICAL PUSH counts; TRIPLE EXTENSION = power reps) | VOL-10, LIB-13 | 4 |
| typical_rep_range.set_notation_v1 / interval_notation_v1 | '12/10/8/8' = reps per set; '20/40' = work / rest seconds (not per side) | PRG-07 | 2 |
| athletic_quality | landing / plyometric / ballistic / olympic / speed / COD + plyo_method (as-named default only; `plyo_method_role`, `plyo_methods_available`, `plyo_method_rule`) | CAT-10, CAT-11, ATH-01, ATH-10, LIB-21 | 201 |
| implement_load | medball max 20 lb + typical load by throw type | EQ-06 | 92 |
| coach_cues | coach set-ups and cues with their question ID | GEN-07 + LIB answers | 70 |
| speed_session | order 1-3 in the speed session | LIB-21 | 9 |
| plyo_moderate_track | MODERATE plyo track 1 or 2 | LIB-05 | 19 |
| delt_head | side / rear / front | VOL-17, LIB-16 | 22 |
| level.generator_min_level (+ generator_min_level_axis) | lowest exercise-skill tier that may get it - the movement-competence axis, not the client's volume level L1-L3 (CAT-06, PRG-05) | CAT-05, CAT-04, CAT-06, EQ-04 | 707 |
| out_of_scope_v1 / retired_v1 / record_type_v0 | why a record left the active catalog, its question ID and the non-band replacement or merge target | EQ-01/02/07/08/12, LIB-09, LIB-17 | 46 |
| v1_changes | per-record changelog (question ID, change, evidence; adversarial fixes carry `pass`) | all | 383 records, 608 entries |
| flags_resolved_v1 | v0 flags closed by an answer (flag, question ID, how) | various | 53 |
| *_v0 fields (name_v0, level.primary_v0, pattern_code_v0, plane_v0 ...) | the v0 value an answer replaced | various | 134 |

### Still pending in v1 (status after round 2 in brackets)

- **LIB-14 vs VOL-09 (confirm)**: thrusters now count 0.5 shoulders as LIB-14 approved; confirm that over the 0.25 helper default. [answered: R2-VOL-05]
- **CAT-04 (confirm)**: high-bar / low-bar back squats moved from BYOP MODERATE to ADVANCED by your 'barbell back squat is more advanced'; confirm. [principle approved: R2-LIB-02]
- **EQ-03 extension (confirm)**: the High Depth Drop (above hip height) is now 'never' for older / injured / high-volume clients (INFERRED from 'never depth jumps'). [older: R2-ATH-08 opt-in; injured / high-volume: still INFERRED]
- **PER-04 encoding (confirm)**: 'moderate' axial squats (goblet, DB / KB, hack, pendulum, landmine) allowed on the second knee-dominant day only when the client is not sore or already axially loaded (INFERRED). [answered: R2-SES-02]
- **LIB-10** KB Face Pulls under VERTICAL PULL - unanswered. Kept where the sheet files it, swap-only, rear-delt credit INFERRED. [answered: R2-LIB-04 / LIB-10]
- **LIB-12** Bench Push-ups, hands or feet on the bench - unanswered. v0 reading kept (FOUNDATIONAL in AD13, ADVANCED in AF11). [answered: R2-LIB-05 / LIB-12 - both]
- **PRG-01 / FIX-01** (SKIP): what 'NO ACCESS' means, and whether its Unilateral HD slots should read AQ (single-leg hinge) instead of AR (leg curls). See `02_no_equipment_subset.md` section 6. [answered: R2-LIB-08 - self-serve version; AQ]
- **LIB-02 follow-up**: the Push-Up Box Jump set-up (only the stick-the-landing drill was described).
- **LIB-18 follow-up**: 21.6 mi vs a 26.2 mi marathon. [answered: R2-LIB-06 - removed]
- **LIB-19**: the 9 PROPOSED carries / drags need approval; the POSTERIOR OBLIQUE and LATERAL SUBSYSTEM headings are still empty; which slot carries, drags and slings feed (core block, warm-up or conditioning) is not stated.
- **CAT-11**: the coach has not named the receive -> create progression; `plyo_method` labels are PROPOSED. [answered: R2-ATH-03 - Receive-Create stages]
- **CAT-02**: traps, front delts, adductors and neck have no big/small class yet.
- **SLOT FIT** (never asked): front raises sit in the 'ABdution' side-raise slot pool.
- **GEN-06**: video links - 136 of 707 active records have one; the rest need links ('thats a lot of work but needs to get done'). [R2-GEN-02: videos optional]
- **GEN-01**: Spanish names (full Spanish toggle) are not in the catalog yet. [R2-GEN-08: format approved; names still to write]
- **Program-only exercises** (v0 question 5): only the items a coach answer named were added to the library; the rest stay swap-only until the coach adds them to BYOP (CAT-07). [R2-LIB-07: approved as is]

## 1. What was merged

Every exercise-like record from the decode outputs was loaded, normalised (case, spaces, plurals, the coach's typos, URL removal, dose prefixes such as `2x 3` and intensity cues such as `HEAVY`/`FAST`/`@ 75%` stripped into an alias `cues` field) and grouped. Near-duplicates were merged by hand (section 5; the coach confirmed the merge policy, COACH-ANSWER LIB-17). Program line items that matched no library name became **program-only** records, **complex** records (supersets, contrasts, circuits, sequences) or **generic choice** records (`X or Y`). v1 adds 7 more merges, splits one (LIB-03) and adds 12 new records (section 3). v1.1 splits one more (bench push-ups, R2-LIB-05), retires one (21.6-mile run, R2-LIB-06) and adds 25 new records (3 coach-approved home items, R2-LIB-07; 22 PROPOSED-ADDITION sport items, section 2.8).

| Source | Rows mapped (crosswalk, unchanged) |
|---|---|
| MASTER_MODEL program | 2510 |
| analysis/reference/specialty.json | 328 |
| analysis/reference/sheet23.json | 313 |
| analysis/library/L1_cardio_athletic.json | 216 |
| analysis/reference/resistance_patterns.json | 200 |
| analysis/library/L2_core_upper.json | 173 |
| analysis/library/L3_lower_isolation.json | 161 |
| analysis/library/L4_focus_functional.json | 82 |
| BYOP program fill | 26 |

Equipment requirements for BYOP library cells come from the equipment decode (`analysis/equipment/lib_athletic_core.json`, `lib_resistance.json`); everything else is inferred from the decoder equipment lists and the exercise name. The BYOP dropdown wiring (which program slot can draw which item) comes from `analysis/library/L4_slot_wiring.md` section 6 (OBSERVED data validations). The v1 constraint levels and zones come from `synthesis/10_equipment_model.json` (`exercise_index`, INFERRED) where a BYOP cell is indexed, and from the EQ-13 scale rules otherwise.

**Result (v1.1): 939 records**, of which 732 are active exercise-like records (v1: 913 / 707; 4009 source rows in, 185 program cells that are not exercises).

| record_type | count | meaning |
|---|---|---|
| exercise | 633 | a movement (or a generic one, `generic: true`, when the source does not name the implement/grip) |
| conditioning_prescription | 72 | self-dosing cardio item (dose is in the name, e.g. '3 min Fast - 2 min walk', '15 cals') |
| test | 13 | distance / speed / agility tests |
| drill | 14 | running and agility drills (A-drills, formations, route trees) |
| complex | 63 | program cell that chains exercises (superset / contrast complex / circuit / sequence); `components` lists ids |
| generic_choice | 30 | program cell offering alternatives ('Pull ups or Lat pull down') |
| modifier | 51 | coach variable stacked on a base exercise (grip, feet, stance, ROM, end range, load position, contra/ipsilateral); used for between-block changes (PER-02) |
| taxonomy_placeholder | 12 | heading with no exercises of its own (CARRY, DRAGS, functional slings); CARRY / DRAGS now have PROPOSED children |
| progression_note / variant_rule | 4 | a rule written inside an exercise list |
| out_of_scope (v1) | 36 | band, chain or weight-releaser item (EQ-01/02/07/08/12); kept for traceability, never generated |
| retired (v1, v1.1) | 11 | removed by the coach (LIB-09; v1.1: the 21.6-mile run, R2-LIB-06) or merged into its twin (LIB-17, LIB-09); kept so crosswalk ids resolve |

| status (active records) | count | meaning |
|---|---|---|
| live_library_selectable | 350 | BYOP library, selectable in a program dropdown |
| live_library_not_selectable | 9 | BYOP library, no dropdown reads it |
| reference_only | 215 | MASTER_MODEL reference tab only |
| program_only | 121 | named only in program tabs |
| added_v1 | 2 | NEW in v1: added by a coach answer (EQ-05, EQ-11) |
| proposed_v1 | 9 | NEW in v1: PROPOSED starter item, pending coach approval (LIB-19) |
| added_v1_1 | 4 | NEW in v1.1: added by a coach answer (R2-LIB-07 home items; R2-LIB-05 feet-on-bench push-up) |
| proposed_v1_1 | 22 | NEW in v1.1: PROPOSED-ADDITION for the expanded sport list, pending coach approval (section 2.8) |

Added to the generator library by a coach answer while keeping their source status (10): Max-Velocity Sprint (Top Speed) (LIB-21); A-March (running drill) (LIB-21); A-Runs (high-knee running drill) (LIB-21); A-Skip (running drill) (LIB-21); Acceleration Starts (LIB-21); Falling-Start Accelerations (LIB-21); Mach Sprint Drills (A-March / A-Skip / A-Run) (LIB-21); Squat Holding an Object Between the Knees (adduction squeeze) (LIB-20); Cossack Lateral Lunge (LIB-20); Split-Stance Contralateral Single-Arm KB Swing (LIB-20). v1.1 (COACH-R2 R2-LIB-07, FOUNDATIONAL triple extension, now default candidates): Hang Clean (catch not stated); Single-Arm DB Snatch; KB Squat Clean; Hex-Bar Jump Squat.

## 2. Taxonomy and the rules each record carries

The coach's grammar (OBSERVED in BYOP rows 3-6 and Sheet23 headers): **LEVEL - FAMILY - SYMMETRY - PATTERN**, e.g. `FOUNDATIONAL - RP - BS - VERTICAL PUSH`. Families: ATHLETIC (AP), RESISTANCE (RP), CONTROL (CT/CP core), CARDIO, FUNCTIONAL. Row 6 'PURPOSE' is a *quality* for athletic work and a *muscle* for resistance work. Every exercise is tagged on all lenses at once - family, pattern, laterality, plane, muscle size, muscles, equipment, level (COACH-ANSWER CAT-01: 'this is the whole taxonomy of each exercise'). Biomechanics describes every exercise and is not a bucket of its own (COACH-ANSWER CAT-03).

| pattern_code | family | canonical label (v1.1) | coach label VERBATIM (cell) | BYOP column | BYOP program slot | volume credit per set (v1.1) | active records | default candidates |
|---|---|---|---|---|---|---|---|---|
| BKD | RESISTANCE | BILATERAL KNEE DOMINANT | 'BILATERAL KNEE DOMINANT' (BYOP AI1) | AI | Quads / Bilateral KD | QUADS 1.0 + GLUTES 0.25 on every squat with hip extension (R2-VOL-05) + other helpers 0.25; thrusters QUADS 1.0 + SHOULDERS 0.5 + GLUTES 0.25 (R2-VOL-05) | 41 | 32 |
| UKD | RESISTANCE | UNILATERAL KNEE DOMINANT | 'UNILATERAL KNEE DOMINANT' (BYOP AL1) | AL | Quads/Glutes / Unilateral KD | QUADS 1.0 + GLUTES 0.25 (UNI-01; R2-VOL-05); 10/10 = 1 set | 21 | 15 |
| KEXT | RESISTANCE | LEG EXTENSIONS | 'LEG EXTENSIONS' (BYOP AM1) | AM | Quads / Leg Extensions | QUADS 1.0 | 2 | 1 |
| BHD | RESISTANCE | BILATERAL HIP DOMINANT | 'BILATERAL HIP DOMNANT' (BYOP AN1); 'BILATERAL HIP DOMINANT' (Sheet25 B11) | AN | Hamstring / Bilateral HD | HAMSTRINGS 1.0 + GLUTES 0.25 (R2-VOL-05) + helpers 0.25; GLUTES 1.0 for thrusts / bridges / pull-throughs; KB swings 0 (ballistic, R2-VOL-05) | 27 | 23 |
| UHD | RESISTANCE | UNILATERAL HIP DOMINANT | 'UNILATERAL HIP DOMINANT' (BYOP AQ1) | AQ | Hamstring/Glutes / Unilateral HD | HAMSTRINGS 1.0 + GLUTES 0.25 (GLUTES 1.0 for single-leg bridges / thrusts) + helpers 0.25; the split-stance KB swing 0 (ballistic, R2-VOL-05) | 12 | 10 |
| KFLEX | RESISTANCE | LEG FLEXION | 'LEG CURLS' (BYOP AR1); 'LEG FLEXION' (Sheet25 H11) | AR | Hamstrings / Leg Curls | HAMSTRINGS 1.0, not the hinge (CAT-09) | 9 | 7 |
| HPULL | RESISTANCE | HORIZONTAL PULL | 'HORIZONTAL PULL' (BYOP X1) | X | Back / Horizontal Pull | BACK 1.0 + SHOULDERS/TRAPS 0.25 + BICEP 0.25 | 31 | 18 |
| VPULL | RESISTANCE | VERTICAL PULL | 'VERTICAL PULL' (BYOP U1) | U | Back / Vertical Pull | BACK 1.0 + BICEP 0.25 (straight-arm lat pull-over: BACK 1.0 only) | 25 | 21 |
| HPUSH | RESISTANCE | HORIZONTAL PUSH | 'HORIZONTAL PUSH' (BYOP AD1) | AD | Chest / Horizontal Push | CHEST 1.0 + SHOULDERS 0.25 + TRICEP 0.25; dips 0.5/0.5 (LIB-16) | 30 | 27 |
| MRPUSH | RESISTANCE | MID RANGE PUSH | 'MID RANGE PUSH' (RESISTANCE PATTERNS G6; no BYOP column) | AD | Chest / Incline | first coach group 1.0 + helpers 0.25 | 5 | 1 |
| VPUSH | RESISTANCE | VERTICAL PUSH | 'VERTICAL PUSH' (BYOP AA1) | AA | Chest/Shoulders / Vertical Push | SHOULDERS/TRAPS 1.0 + TRICEP 0.25 (push press / push jerk: only in this slot; power reps in the triple-extension slot, VOL-10) | 27 | 19 |
| SHLD | RESISTANCE | SIDE RAISES | 'SIDE RAISES' (BYOP AH1); slot 'ABdution' | AH | Shoulders/Traps / ABdution | SHOULDERS/TRAPS 1.0 (delt_head side / rear / front; rear delts tracked separately, VOL-17); the KB face pull is shoulder work here (R2-LIB-04 / LIB-10) | 23 | 15 |
| BIC | RESISTANCE | BICEP | 'BICEP' (BYOP AS1) | AS | Bicep / Bicep | BICEP 1.0 | 21 | 15 |
| TRI | RESISTANCE | TRICEP | 'TRICEP' (BYOP AT1) | AT | Tricep | TRICEP 1.0 | 15 | 9 |
| CALF | RESISTANCE | CALVES | 'CALVES' (BYOP AU1) | AU | Calves | CALVES 1.0 (3 sets every leg day, VOL-17) | 8 | 4 |
| NECK | RESISTANCE | NECK (PROPOSED v1.1) | none - INFERRED bucket (04_profiles category ISO_NECK; 'No neck exercises' library gap) | - | (no BYOP slot) | not counted (the neck is not one of the 10 FOCUS LIST groups; CAT-02 leaves it unplaced) | 2 | 0 |
| CT | CONTROL | CORE THORAX | 'CORE THORAX' (BYOP O1) | O | Core | CORE 1.0 (control sets) | 30 | 10 |
| CP | CONTROL | CORE PELVIS | 'CORE PELVIS' (BYOP R1) | O | Core | CORE 1.0 (control sets) | 26 | 7 |
| CB | CONTROL | CORE (THORAX + PELVIS 'BOTH') | 'BOTH' (CONTROL PATTERNSCORE A29/H28/O28) | O | Core | CORE 1.0 (control sets) | 25 | 1 |
| CORE | CONTROL | CORE | 'CORE' (BYOP row 6 PURPOSE) | O | Core | CORE 1.0 (control sets) | 2 | 0 |
| PLYO | ATHLETIC | PLYOS | 'PLYOS' (BYOP G1) | G | Plyo | not counted (VOL-10): contacts | 83 | 39 |
| ANKLE | ATHLETIC | JUMPING ANKLE / LIMITED KNEE | 'JUMPING ANKLE' (BYOP F5); 'JUMPING LIMITED KNEE' (Sheet23 E1/G1) | C | Tripple Extension | not counted (VOL-10): contacts | 13 | 10 |
| TX | ATHLETIC | TRIPLE EXTENSION | 'TRIPPLE EXTENSION' (BYOP C1/C5) | C | Tripple Extension | not counted (VOL-10): power reps; KB swings join as ballistic power reps (R2-VOL-05) | 40 | 19 |
| THROW | ATHLETIC | THROWING | 'THROWING' (BYOP K1) | K | Throwing | not counted (VOL-10): throws | 41 | 16 |
| COD | ATHLETIC | CHANGE OF DIRECTION | 'CHANGE OF DIRECTION' (BYOP L1) | L | COD | not counted (VOL-10): reps / distance | 17 | 9 |
| SPRINT | ATHLETIC | SPEED / SPRINT (speed session) | Sheet23 footers '*FASTEST SSC*' B43, '*FAST BALLISTIC/WARMUP/SSC* (prior to sprint)' B47, '*SPRINT*' B51; speed-session order confirmed (LIB-21) | - | (no BYOP slot; speed session) | not counted (VOL-10): reps / meters; the 4 A-drill / MACH records are warm-up drills and are not counted at all (ORD-08) | 10 | 7 |
| WARMUP | ATHLETIC | DYNAMIC MEDBALL WARM-UP | 'DYNAMIC MEDBALL WARMUP DRILLS' ((NOT DONE) ALL ABOUT BALLISTICS A4) | - | (warm-up) | not counted (warm-up) | 35 | 0 |
| CARDIO | CARDIO | CARDIO | 'CARDIO' (BYOP B1) | B | Cardio / Aerobic Capacity | not counted: conditioning bouts | 84 | 33 |
| AOS | FUNCTIONAL | FUNCTIONAL BIOMECHANICS SYSTEM > ANTERIOR OBLIQUE SYSTEM | 'ANTERIOR OBLIQUE SYSTEM' (BYOP BC6) | BC | (no BYOP slot) | CORE 1.0 (control sets) | 9 | 0 |
| POS | FUNCTIONAL | FUNCTIONAL BIOMECHANICS SYSTEM > POSTERIOR OBLIQUE SYSTEM | 'POSTERIOR OBLIQUE SYSTEM' (BYOP BD6) | BD | (no BYOP slot) | CORE 1.0 (control sets) | 0 | 0 |
| LSS | FUNCTIONAL | FUNCTIONAL BIOMECHANICS SYSTEM > LATERAL SUBSYSTEM | 'LATERAL SUBSYSTEM' (BYOP BE6) | BE | (no BYOP slot) | CORE 1.0 (control sets) | 0 | 0 |
| DRAG | FUNCTIONAL | DRAGS | 'DRAGS' (BYOP BB1) / 'DRAG' (BB6) | BB | (no BYOP slot) | not counted: distance (PROPOSED) | 5 | 0 |
| CARRY | FUNCTIONAL | CARRY | 'CARRY' (BYOP BA1) | BA | (no BYOP slot) | CORE 1.0 (control sets, PROPOSED) | 5 | 0 |
| ARMCARE | FUNCTIONAL | ARM CARE / MOBILITY | none - INFERRED bucket (program-only arm-care drills; v1.1 PROPOSED shoulder external rotation, scapular push-up, dead hang and wrist extension, 04_profiles ISO_REAR / ISO_GRIP) | - | (no BYOP slot) | not counted | 8 | 0 |

v1 pattern changes: KFLEX is now **LEG FLEXION** and holds every knee-flexion exercise (COACH-ANSWER CAT-09); SPRINT is the coach-approved **speed session** bucket (COACH-ANSWER LIB-21; it was an INFERRED bucket in v0); CARRY and DRAG hold PROPOSED starter items (LIB-19); ARMCARE is still an INFERRED bucket. POS and LSS headings are still empty. BYOP filings are kept as OBSERVED `placements`; `taxonomy.pattern_code_v0` keeps the v0 code when an answer moved a record. v1.1: the KB face pull moves from VPULL to SHLD (R2-LIB-04, `taxonomy.pattern_code_v1` keeps VPULL); a PROPOSED NECK bucket holds the two neck exercises (taxonomy node RP.SM.NECK, PROPOSED); the new records join their patterns (section 2.8).

### 2.1 Volume credit (how one set counts toward weekly sets per muscle)

- **Main mover 1.0, each helper 0.25** (COACH-ANSWER VOL-09: 'I would suggest a 0.25 to the helpers, not a 0.5'). Groups are the coach's 10 FULL FOCUS LIST groups (QUADS, GLUTES, HAMSTRINGS, BACK, CHEST, SHOULDERS/TRAPS, BICEP, TRICEP, CALVES, CORE; OBSERVED AZ8..AZ331).
- **Exceptions from the coach:** dips 0.5 chest + 0.5 triceps (LIB-16); thrusters 1.0 quads + 0.5 shoulders + 0.25 glutes (COACH-R2 R2-VOL-05: 'A thruster should be 1 set for squats. Half a set for shoulders. A quarter set for glutes.'); KB swings count 0 sets - they are ballistic, never glute work (COACH-R2 R2-VOL-05: 'kettlebell swings are not glutes'); squats, lunges, deadlifts and RDLs give glutes a quarter set (R2-VOL-05, 'that's good math'); leg extension and leg curl count fully toward quads and hamstrings (VOL-09); leg flexion never counts toward the hinge pattern (CAT-09); unilateral knee-dominant work counts for quads, glutes only as a helper (UNI-01).
- **Unilateral and alternating sets count once**: 10/10 = 10 reps per side = 1 set (UNI-01, UNI-07, PRG-07).
- **Athletic patterns never count** toward muscle volume (VOL-10): plyos, throws, Olympic lifts, sprints and COD are tracked as contacts, throws, power reps and meters. Warm-up drills and conditioning do not count either; A-drills / MACH drills are warm-up drills and are not counted even inside the speed session (ORD-08). Push presses and push jerks count toward shoulders only when they fill the VERTICAL PUSH slot; in the triple-extension slot they are power reps (`volume_credit.by_pool`).
- **Core** work counts as CORE control sets (VOL-17: about 2 core exercises a session; core goes first by default, ATH-11). v1.1 (COACH-R2 R2-SES-03): the core opener stays light - 2 exercises x 2 sets short of failure, as a warm-up - and coaches or users may add core supersets or monster sets anywhere in the session.
- INFERRED applications (flagged so the coach can check): biceps 0.25 on rows and pulldowns (the helper rule applied to pulls, SCIENCE), but not on the straight-arm lat pull-over (no elbow flexion: BACK 1.0 only); diamond push-ups split 0.5 / 0.5 like dips; the glute-vs-hamstring main mover on hinges is read from the name (thrusts, bridges, pull-throughs = glutes; swings count nothing since R2-VOL-05; deadlifts, RDLs, good mornings, hyperextensions = hamstrings, the BYOP slot purpose 'Hamstring').

### 2.2 Levels

- **What sets a level** (COACH-ANSWER CAT-04): mostly skill and stability demand, plus load position - front-loaded / low = foundational (goblet, front-loaded zercher), on the body / horizontal = intermediate (front squat), behind the body / overhead = advanced (back squat). Machines and cables are easier because they do the stabilising. Levels are 'still very theoretical' (CAT-05), so they are defaults.
- **Levels add options** (CAT-05) and the client's volume level is a separate axis (CAT-06): `level.generator_min_level` is the lowest exercise-skill tier (FOUNDATIONAL / INTERMEDIATE / ADVANCED movement competence) that may get a record; higher tiers can always pick it. It is NOT the client's volume level (COACH-ANSWER PRG-05: L1 = novice / newby - he uses both words for the same thing - under about 6-12 months of consistent training or back after 6-12+ months off; L2 = intermediate, more than a year of consistent training; L3 = advanced; the sheet's 'NOVICE below NEWBY' ladder is retired): a L1-volume client who moves well can still get a MODERATE or ADVANCED lift (skills come back fast after a layoff, PRG-05) (CAT-06: in Upper/Lower a NOVICE does barbell deadlifts and leg press). Each record states this in `level.generator_min_level_axis`.
- **v1.1 (COACH-R2 R2-LIB-02):** the zone is a tag on the exercise; the level comes from load position, skill and stability, made easier by a seat, machine or cable - a deep goblet squat stays FOUNDATIONAL and a seated DB shoulder press or a lat pulldown is FOUNDATIONAL even though overhead. No zone sets a level. **R2-LIB-07** set the belt squat, seated machine shoulder press and the four triple-extension additions to FOUNDATIONAL; **R2-LIB-05 / LIB-12** split the bench push-up (hands on bench FOUNDATIONAL, feet on bench ADVANCED).
- **Load position applied** (CAT-04): barbell back squats (high-bar, low-bar, bar not stated) and the overhead box squat are ADVANCED; the front squat is INTERMEDIATE; goblet and front-loaded zercher are FOUNDATIONAL.
- **Changed by answers:** throws and GHD have no levels (LIB-06, LIB-08); leg extension and leg curls at every level (LIB-15); push press foundational, push jerk intermediate-advanced (LIB-13); Kong row foundational (LIB-09); beginner Olympic options (incl. high- / mid-hang power clean) foundational and power clean / snatch / clean & jerk intermediate (ATH-10); barbell back squats and the overhead box squat advanced (CAT-04); constraint 4-5 machines offered from foundational (CAT-04 + EQ-04, INFERRED extension). OBSERVED BYOP levels stay in `level.byop_placements`, and every replaced value is kept as `level.primary_v0`.

### 2.3 Equipment

- **No bands, no variable resistance** (EQ-01, EQ-02, EQ-07, EQ-08, EQ-12): see section 7. Access tiers: **T0** bodyweight + household; **T1** minimal kit without bands (doorway pull-up bar, jump rope, suspension trainer, low hurdles, foam roller); **T2** home weights (DB, KB, medball up to 20 lb, stability ball, sandbag, plate, adjustable bench, dip station, high plyo box); **T3** gym (barbell + rack, EZ / hex bar, landmine, cables, machines, Smith, GHD / hyper / reverse hyper, seal bench, sled, farmer handles, cardio machines). INFERRED definitions.
- **Constraint 1-5** (EQ-13 approved): 5 seated machine with back pad, 4 plate-loaded / Smith / chest-supported, 3 cable or DB on a bench, 2 standing free weights, 1 bodyweight / ballistic / reactive. Older, injured and high-volume clients collect volume in constrained positions (EQ-03).
- **Machines are not ranked** (EQ-11): brands, angles and feel differ. Hack squat and leg press are more constrained than the Smith machine; the belt squat removes axial load; GHD and reverse hyper are used if available and the client feels the right muscles. The client's preference can choose between alternatives (EQ-10); with no implement named, the default goes bodyweight -> DB -> barbell as the level rises, limited by the client's kit (EQ-09).
- **Medballs** never over 20 lb (EQ-06); `implement_load` gives the typical load by throw type. The coach names wall balls as one of the few uses of a heavier ball ('Are they doing CrossFit, or are they doing high rows?', EQ-06): the PROPOSED Wall Ball record keeps the 20 lb ceiling (HYROX race balls are 4 / 6 / 9 kg).
- **v1.1 equipment**: the new home items need only a kettlebell (KB curl), a sturdy table (table row) or the floor (Y / T raises); every PROPOSED-ADDITION uses cables, DBs, a sled, a medball, a pull-up bar, a wall or nothing - no bands anywhere (EQ-01).
- **Aerobic work on any tool** (EQ-14): the Blue / Green / Orange aerobic intervals and the lactate-clearance work run on a bike, rower, ski erg or treadmill for non-runners (`modality_v1`; the 12 aerobic records now list treadmill / erg set-ups beside open space). Timed work / rest carries over directly; distance is kept and tracked (erg meters or a time-matched effort for the distance items).

### 2.4 Athletic work

- **Receive-Create stages** (CAT-10, CAT-11; named and timed by COACH-R2 R2-ATH-03): learn to receive force before creating it - stage 1 **Land** (receive and pause, stick the landing) -> stage 2 **Land & Go** (receive then create once) -> stage 3 **Repeat** (repeated receive / create: hops, bounds). 12-week block: weeks 1-3 / 4-7 / 8-12; 8-week block: 1-2 / 3-5 / 6-8; restart at stage 1 each off-season; stay put in maintenance blocks; intermediate and advanced athletes may start at stage 2. Unilateral is harder than bilateral. It is not a 'plyo zone'. `athletic_quality.receive_create_stage` gives the stage the name implies (`plyo_method` keeps the v1 code). **v1.1: named 'Receive-Create stages' (COACH-R2 R2-ATH-03).** The stage is how a jump is done, not a property of the exercise: `plyo_method` / `receive_create_stage.default_stage` only record what the name implies (`role: default_as_named`), and the program chooses the stage per block for any jump that allows it (`stages_available`).
- **Ballistic vs plyometric, per item** (COACH-R2 R2-ATH-02): ballistic = longer contact or one big effort (squat, box, broad, loaded or hex-bar jumps, medball throws); plyometric = short, bouncy contacts (pogo / ankle hops, hurdle hops, depth jumps, bounds, squirrel jumps, repeated jumps); stick-the-landing drills = the receive stage. Every jump and throw carries `contact_class_v1_1`. Tie-breaks (INFERRED): loaded repeated jumps = ballistic (load lengthens the contact); unloaded continuous split / lunge jumps = plyometric (repeated).
- **Plyo vs ballistic ratio** comes from the sport's ground-contact time (ATH-01; the shares by sport approved in R2-ATH-01, in `04_profiles.json`): more time on the ground (karate, fighters) -> more ballistics; less (sprinters) -> more plyos; basketball a mix; baseball ballistics + rotation + sprinting with few plyos.
- **Intermediate plyos**: one exercise from each MODERATE track (plate hops, hurdles) (LIB-05). **Speed session**: squirrel jumps -> MACH drills / acceleration starts -> max-velocity sprint, fixed order (LIB-21).
- **Olympic lifts, v1.1** (COACH-R2 R2-ATH-04 / R2-ATH-05 / R2-GEN-06): up to 4 x per week - clean days (cleans = more squat-pattern) and snatch days (snatches = more hinge-pattern); `olympic_v1_1.family` / `day_pattern` on every Olympic-type lift (jerks 'either day', INFERRED). Full squat cleans and snatches 3-5 reps per set (same weekly reps, e.g. 6 x 5 @ 75 %), DB / KB and pull variants keep the 4 x 8 @ 75 % -> 4 x 4 @ 90 % ramp, power / hang versions 3-5 (INFERRED); the coach's eye on speed. The weight is picked by RPE / reps in reserve and bar speed (power output); % of a tested 1RM only for competitive Olympic lifters, whose programming is its own track.
- **Older adults (60+), v1.1** (COACH-R2 R2-ATH-08): no Olympic lifts, plyos or depth jumps by default; they are an extra option with the warning 'Make sure that you have a fitness professional to help you understand what this means.' (`older_default_excluded`, warning key WARN_60PLUS_POWER_WORK). Jumping conditioning items (burpees, jumping jacks, burpee broad jump) get a no-jump swap, and the PROPOSED split-step drill defaults to its no-hop version (adversarial check; 10.3 #3). Youth: Olympic lifts from the floor from about 14, after one block of hang work.
- **Olympic lifts for everyone in athletic training** (ATH-10; the Hex-Bar Jump Squat is in the triple-extension pool as well as PLYO so a beginner's Olympic slot can reach it); youth may lift from the floor (ATH-09; from about 14 after a hang block, R2-ATH-08); older adults: see the R2-ATH-08 bullet above (ATH-09 'few plyos unless they ask' is superseded); aesthetics / bodybuilding clients throw medballs only in the warm-up (ATH-05).
- **Sport rules on exercises**: pitchers get less overhead pressing, more arm care and light rotational throws (ATH-08); boxers / strikers in high punching-volume weeks reduce, but never cut, pressing and arm-isolation sets (ATH-04). Both are `population_rules`.
- **A-drills** (A-march / A-skip / A-run, MACH drills) are the warm-up drills of ORD-08 and step 2 of the speed session (LIB-21); they never count as volume.

### 2.5 Load position and spinal load

- `davidson_zone` (CAT-04, CAT-10; approved as written by COACH-R2 R2-LIB-02; Pat Davidson, *A Coach's Guide to Optimizing Movement*): zone 1 = vertical, load low and close, external-rotation bias; zone 2 = horizontal (hands in front, knee at hip height), internal-rotation bias, compressive; zone 3 = vertical overhead or deep squat, external-rotation bias. Zones do not apply to plyos. The zone is a tag, never the level (R2-LIB-02). Use (R2-LIB-03): keep both rotation biases in every week, and when something hurts pick a swap with the other bias (`davidson_zone.use_v1_1`); not set by sport.
- `axial_spinal_load` (PER-04, EQ-11; rule approved in COACH-R2 R2-SES-01 / R2-SES-02): heavy squat and heavy deadlift on **two different days** (e.g. squat Monday, deadlift Friday); the other days use a non-axial hinge (hip thrust, back extension, reverse hyper) and leg press or belt squat. Counted lifts: barbell back, front, zercher, overhead and Smith squats; barbell or trap-bar deadlifts and RDLs; good mornings. Not counted: leg press, belt squat, hip thrust, back extension, reverse hyper, single-leg DB work, Olympic lifts, loaded jumps. Goblet squat, hack squat and pendulum are fine on the second day if not sore. Powerlifters may add a light technique squat or deadlift. `spine_day_v1_1.class` says which group each lift is in (barbell / trap-bar variants and other front-loaded squats INFERRED); the high / moderate / low / none value is kept (INFERRED from implement and load position).

### 2.6 One-detail variations between blocks (COACH-R2 R2-LIB-01)

The library exercise is always the main pick. Between blocks (4-6 weeks, PER-02) the tool may change **one** detail and show it after the library name: `<library name> - <detail>`, e.g. 'Reverse Lunge - dumbbell in the opposite hand', 'Lat Pulldown - neutral grip', 'Step-Up - lower box'. Allowed details (the coach's list): which hand holds the weight, grip, stance, implement, range. It never invents a new exercise, never changes two details at once, and never adds a band, chain or weight releaser (EQ-01, EQ-12). `variation_v1_1.axes` lists which of the five details apply to each eligible exercise (553 records; INFERRED from its set-ups, pattern and laterality: 'implement' when it has two or more set-ups, 'grip' on pulls / presses / curls / barbell hinges, 'stance' on lower-body, standing and athletic items, 'which hand holds the weight' on single-leg / single-arm DB-KB work, 'range' on resistance and core items and box / hurdle / drop height on jumps). The coach's modifiers (section 9: grip, feet, stance, ROM, end range, load position, contra / ipsilateral) are the vocabulary for the detail.

### 2.7 Testing (COACH-R2 R2-PER-07)

The 13 test records carry `test_rules_v1_1`: test before the block (or in week 1) and in its last week - never in the middle. Nobody goes from no training to an all-out test: an untrained person does the mile (or any timed test) at an 80-90 % effort, and strength tests use a 5RM or 3RM, never a 1RM, until a block has been completed. The 21.6-mile run is no longer a test (R2-LIB-06). The 14-, 17- and 20-mile distance tests are longer than the half-marathon plan the coach kept as the longest run (R2-LIB-06): flagged, question 10.3 #5 (adversarial check).

### 2.8 Sport coverage: PROPOSED-ADDITION exercises (v1.1)

The coach asked (2026-10-08) that every popular US sport be covered for athletes, swimming included, and that general-population clients see the 'stay athletic and active' options - pickleball and HYROX by name. The sport profiles live in `04_profiles.json`; this section adds the exercises those sports clearly need and the library lacked. Each is status `proposed_v1_1` (swap only, never a default pick until approved), level and dose INFERRED, never band-based, with `sport_use_v1_1` (plain sport names; the profile merge maps them to profile ids), `profile_category_v1_1` (04_profiles category) and `new_in_v1_1.why_needed`. The three coach-approved home items (R2-LIB-07) and the feet-on-bench push-up (R2-LIB-05) are in the same tables below as N2.

| record | pattern | level | T | credit per set | sports (sport_use_v1_1) | why it is needed |
|---|---|---|---|---|---|---|
| Cable External Rotation (elbow at the side or 90/90) | ARMCARE | foundational | T3 | - | baseball, softball, volleyball, tennis, pickleball, padel, football (QB), water polo, swimming | the gym version of shoulder external-rotation work (the 90/90 arm position is the one-detail progression, R2-LIB-01); cable, never a band (EQ-01) |
| DB Wrist Extension (slow lowering, forearm on the knee or a bench) | ARMCARE | foundational | T2 | - | pickleball, tennis, padel, golf, climbing, baseball | racquet-elbow care (04_profiles injury_library ELBOW_LATERAL_RACKET: 'wrist-extensor isometric/eccentric 2-3x/week', SCIENCE); no band version (EQ-01) |
| Dead Hang (pull-up bar) | ARMCARE | foundational | T1 | - | climbing, swimming, BJJ / judo, wrestling, obstacle course racing, gymnastics, CrossFit | grip and overhead shoulder tolerance; 04_profiles lists grip (ISO_GRIP) with no library column |
| Scapular Push-Up (push-up plus) | ARMCARE | foundational | T0 | - | swimming, water polo, triathlon, diving, volleyball, baseball, climbing, gymnastics, CrossFit, boxing | shoulder-blade control for swimmers, overhead and pressing athletes (SCIENCE) |
| Side-Lying DB External Rotation | ARMCARE | foundational | T2 | - | baseball, softball, volleyball, tennis, pickleball, padel, football (QB), water polo, swimming | shoulder external-rotation work for swimmers and overhead athletes (SCIENCE: posterior-cuff weakness is a shoulder-injury risk factor in throwers; 04_profiles injury_library SHOULDER_THROWER); no band version (EQ-01) |
| Wall Sit (isometric squat hold) | BKD | foundational | T0 | QUADS 1 + GLUTES 0.25 | skiing / snowboarding, ice hockey, cycling, active aging, general population | ski-season preparation and a joint-friendly quad option for older adults |
| Seated / Bent-Knee Calf Raise (soleus; machine or DBs on the knees) | CALF | any | T2 | CALVES 1 | pickleball, tennis, padel, running, basketball, soccer, triathlon, active aging | bent-knee soleus work (04_profiles injury_library ACHILLES_CALF names 'bent-knee soleus 2-3x/week'); the library had straight-knee calf raises only |
| Tibialis Raise (back against a wall) | CALF | any | T0 | - | pickleball, tennis, padel, basketball, soccer, running, hiking / rucking, skiing, active aging | shin / lower-leg resilience for court and running sports (SCIENCE) |
| Burpee Broad Jump | CARDIO | intermediate | T0 | - | HYROX, CrossFit, bootcamp, obstacle course racing, football | HYROX station (burpee broad jumps); the library had burpees and broad jumps but not the combined station |
| Compromised Run (1 km run straight after a station) | CARDIO | intermediate | T0 | - | HYROX, obstacle course racing, triathlon (brick) | HYROX is 8 x 1 km runs, each after a station (SCIENCE / event format); the library had runs but no run-after-a-station format |
| Rower Distance Piece (500-2,000 m) | CARDIO | any | T3 | - | HYROX, CrossFit, bootcamp, obstacle course racing, rowing, triathlon | HYROX station (row 1,000 m) and rowing; the library only had rower calorie sprints |
| Ruck Walk (weighted backpack walk) | CARDIO | any | T0 | - | hiking / rucking, obstacle course racing, general population, active aging | hiking / rucking preparation for gen pop ("stay athletic and active"); an easy Orange-colour session option |
| SkiErg Distance Piece (500-1,000 m) | CARDIO | any | T3 | - | HYROX, CrossFit, bootcamp, obstacle course racing, swimming, rowing, skiing | HYROX station (SkiErg 1,000 m); the library only had SkiErg calorie sprints |
| Streamline Hold (hollow body, arms locked overhead) | CB | intermediate | T0 | CORE 1 | swimming, water polo, triathlon, diving, gymnastics | the swimmer's streamline position as a core hold (SCIENCE: body position / streamline is a core demand of swimming) |
| Split-Step Reaction Drill (split-step, then shuffle / crossover / drop-step on a cue) | COD | foundational | T0 | - | pickleball, tennis, padel, volleyball, basketball, soccer (goalkeeper), baseball / softball (infield) | the court athlete's ready position and first step; also fills the empty reactive-agility heading (AP.AGI: 'Agility: Reactive in nature', AGILITYCOD D1); 60+: the hop is off by default and the no-hop split-step is the default (R2-ATH-08; INFERRED swap, 10.3 #3) |
| Single-Leg Balance Reach (front / side / back) | CP | foundational | T0 | CORE 1 | pickleball, tennis, padel, golf, skiing, soccer, basketball, running, active aging | single-leg balance for court sports and older adults (04_profiles injury_library FALLS_BONE_DENSITY: balance every session, SCIENCE) |
| Sled Rope Pull (hand-over-hand, HYROX-style) | DRAG | foundational | T3 | - | HYROX, CrossFit, football (linemen), strongman, wrestling, obstacle course racing | HYROX station 'sled pull' (SCIENCE / event standard); the library had sled push and drags but no rope pull |
| Neck Isometric Holds (4-way: front, back, both sides; hand or partner resistance) | NECK | foundational | T0 | - | football, wrestling, rugby, ice hockey, lacrosse, BJJ / judo, MMA, kickboxing / Muay Thai, boxing | 04_profiles library_gaps 'No neck exercises' and injury_library NECK ('isometric 4-way, then plate or manual eccentric; no bands') |
| Plate Neck Flexion / Extension (lying on a bench, plate on a towel) | NECK | intermediate | T2 | - | football, wrestling, rugby, ice hockey, lacrosse, BJJ / judo, MMA, kickboxing / Muay Thai, boxing | the loaded step after isometrics (04_profiles injury_library NECK); no bands (EQ-01) |
| Streamline Squat Jump (arms locked overhead) | PLYO | intermediate | T0 | - | swimming, diving, water polo | start and wall push-off power in the streamline position (squat jump without the arm swing) |
| Wall Ball (medball squat-to-target throw) | THROW | any | T2 | - | HYROX, CrossFit, bootcamp, obstacle course racing | HYROX / CrossFit station; COACH-ANSWER EQ-06 names wall balls ('Are they doing CrossFit, or are they doing high rows?') as one of the few uses of a heavier medball, never over 20 lb |
| Sandbag Walking Lunge (bag on the shoulders) | UKD | intermediate | T2 | QUADS 1 + GLUTES 0.25 | HYROX, CrossFit, bootcamp, obstacle course racing, football, strongman | HYROX station (sandbag lunges); the library had sandbag carries and thrusts but no loaded walking lunge |

Existing records the new sports use got `sport_use_v1_1` tags instead of duplicates (38 records), e.g. Lateral Shuffles (pickleball, tennis, padel, court sports), the rotational medball throws (pickleball, tennis, golf, baseball), Medball Overhead Throw (swimming, water polo, volleyball), Sled Push and Farmer Carry (HYROX), SkiErg / Rower Calorie Sprints (HYROX, CrossFit), Flutter Kicks and Lat Pull-over (swimming), incline Y / T raises and face pulls (swimming, throwers, racquet sports).

## 3. Counts (active records)

### 3.1 By family and source status (732 active exercise-like records)

| family | total | selectable in BYOP | BYOP not selectable | reference only | program only | new (coach: v1 + v1.1) | new (PROPOSED: v1 + v1.1) | default candidates |
|---|---|---|---|---|---|---|---|---|
| ATHLETIC | 239 | 90 | 0 | 97 | 49 | 0 | 3 | 100 |
| RESISTANCE | 299 | 209 | 0 | 39 | 39 | 6 | 6 | 217 |
| CONTROL | 83 | 18 | 0 | 42 | 21 | 0 | 2 | 18 |
| FUNCTIONAL | 27 | 0 | 9 | 0 | 3 | 0 | 15 | 0 |
| CARDIO | 84 | 33 | 0 | 37 | 9 | 0 | 5 | 33 |

### 3.2 By pattern and level (primary level; `any` = no tiers; `unrated` = no level anywhere; last column = lowest exercise-skill tier the generator may offer, not the client's volume level, CAT-06)

| pattern | label | records | foundational | intermediate | advanced | any | unrated | generator min level |
|---|---|---|---|---|---|---|---|---|
| BKD | BILATERAL KNEE DOMINANT | 41 | 15 | 6 | 15 | 2 | 3 | F 23 / I 5 / A 13 |
| UKD | UNILATERAL KNEE DOMINANT | 21 | 0 | 2 | 0 | 15 | 4 | F 19 / I 2 / A 0 |
| KEXT | LEG EXTENSIONS | 2 | 0 | 0 | 0 | 2 | 0 | F 2 / I 0 / A 0 |
| BHD | BILATERAL HIP DOMINANT | 27 | 8 | 8 | 6 | 3 | 2 | F 16 / I 5 / A 6 |
| UHD | UNILATERAL HIP DOMINANT | 12 | 8 | 1 | 0 | 2 | 1 | F 11 / I 1 / A 0 |
| KFLEX | LEG FLEXION | 9 | 2 | 0 | 2 | 3 | 2 | F 7 / I 0 / A 2 |
| HPULL | HORIZONTAL PULL | 31 | 8 | 5 | 8 | 5 | 5 | F 25 / I 2 / A 4 |
| VPULL | VERTICAL PULL | 25 | 11 | 0 | 7 | 4 | 3 | F 18 / I 0 / A 7 |
| HPUSH | HORIZONTAL PUSH | 30 | 6 | 5 | 10 | 7 | 2 | F 16 / I 4 / A 10 |
| MRPUSH | MID RANGE PUSH | 5 | 0 | 4 | 0 | 1 | 0 | F 2 / I 3 / A 0 |
| VPUSH | VERTICAL PUSH | 27 | 7 | 2 | 8 | 4 | 6 | F 17 / I 2 / A 8 |
| SHLD | SIDE RAISES | 23 | 1 | 1 | 0 | 20 | 1 | F 22 / I 1 / A 0 |
| BIC | BICEP | 21 | 0 | 0 | 0 | 17 | 4 | F 21 / I 0 / A 0 |
| TRI | TRICEP | 15 | 0 | 0 | 0 | 12 | 3 | F 15 / I 0 / A 0 |
| CALF | CALVES | 8 | 0 | 0 | 0 | 6 | 2 | F 8 / I 0 / A 0 |
| NECK | NECK (PROPOSED v1.1) | 2 | 1 | 1 | 0 | 0 | 0 | F 1 / I 1 / A 0 |
| CT | CORE THORAX | 30 | 10 | 10 | 3 | 2 | 5 | F 17 / I 10 / A 3 |
| CP | CORE PELVIS | 26 | 11 | 6 | 4 | 0 | 5 | F 16 / I 6 / A 4 |
| CB | CORE (THORAX + PELVIS 'BOTH') | 25 | 7 | 5 | 4 | 0 | 9 | F 16 / I 5 / A 4 |
| CORE | CORE | 2 | 0 | 0 | 0 | 0 | 2 | F 2 / I 0 / A 0 |
| PLYO | PLYOS | 83 | 12 | 28 | 23 | 3 | 17 | F 32 / I 28 / A 23 |
| ANKLE | JUMPING ANKLE / LIMITED KNEE | 13 | 10 | 0 | 0 | 0 | 3 | F 13 / I 0 / A 0 |
| TX | TRIPLE EXTENSION | 40 | 15 | 12 | 10 | 0 | 3 | F 18 / I 12 / A 10 |
| THROW | THROWING | 41 | 0 | 0 | 0 | 41 | 0 | F 41 / I 0 / A 0 |
| COD | CHANGE OF DIRECTION | 17 | 8 | 3 | 2 | 4 | 0 | F 12 / I 3 / A 2 |
| SPRINT | SPEED / SPRINT (speed session) | 10 | 0 | 0 | 1 | 6 | 3 | F 9 / I 0 / A 1 |
| WARMUP | DYNAMIC MEDBALL WARM-UP | 35 | 0 | 0 | 0 | 35 | 0 | F 35 / I 0 / A 0 |
| CARDIO | CARDIO | 84 | 10 | 4 | 16 | 36 | 18 | F 64 / I 4 / A 16 |
| AOS | FUNCTIONAL BIOMECHANICS SYSTEM > ANTERIOR OBLIQUE SYSTEM | 9 | 5 | 2 | 2 | 0 | 0 | F 5 / I 2 / A 2 |
| DRAG | DRAGS | 5 | 4 | 1 | 0 | 0 | 0 | F 4 / I 1 / A 0 |
| CARRY | CARRY | 5 | 3 | 1 | 1 | 0 | 0 | F 3 / I 1 / A 1 |
| ARMCARE | ARM CARE / MOBILITY | 8 | 5 | 0 | 0 | 0 | 3 | F 8 / I 0 / A 0 |

Level evidence for the tiered records: 34 set or confirmed by a coach answer, 236 OBSERVED (BYOP block word, Sheet23/aerobic header word, RESISTANCE PATTERNS cell colour), 106 INFERRED (decoder guesses or PROPOSED items); 331 records are 'any' or unrated (after the adversarial check: CAT-04 moved 3 back squats and the overhead box squat, ATH-10 the high- / mid-hang power clean). `level.basis` says which for every record. v1.1: 8 levels are now set by a round-2 answer (bench push-ups x2, R2-LIB-05; belt squat, seated machine shoulder press and the four triple-extension additions, R2-LIB-07) - the table row's FOUNDATIONAL is INFERRED (R2-LIB-07 named no level for the three home items; corrected by the adversarial check), the 21.6-mile run left the active set, and the 22 PROPOSED-ADDITION records carry INFERRED levels (16 tiered, 6 'any'); 'any' or unrated records now number 336.

Records listed at more than one BYOP level block (OBSERVED): 14 - Ankle Hops (bilateral, in place) (foundational/intermediate); Hex Bar Squat to Calf Raise (foundational/intermediate); High-Hang Clean Pull (foundational/intermediate); High-Hang Snatch Pull (foundational/intermediate); Lunge to High-Knee Reach (foundational/intermediate); Mid-Hang Clean Pull (foundational/intermediate); Mid-Hang Snatch Pull (foundational/intermediate); Hack Squat (machine) (intermediate/advanced); Leg Extension (machine) (foundational/intermediate/advanced); Ball Hamstring Curl (medball or stability ball) (foundational/intermediate); Barbell Deadlift (conventional) (intermediate/advanced); GHD - Glute-Ham Developer (hip extension / glute-ham raise) (intermediate/advanced); Machine Leg Curl (seated or lying) (foundational/intermediate/advanced); Incline Push-Up (hands elevated) (foundational/intermediate).

### 3.3 By equipment access tier and constraint

| family | records | T0 | T1 | T2 | T3 | constraint 1 / 2 / 3 / 4 / 5 |
|---|---|---|---|---|---|---|
| ATHLETIC | 239 | 101 | 9 | 96 | 33 | 194 / 43 / 2 / 0 / 0 |
| RESISTANCE | 299 | 55 | 14 | 109 | 121 | 22 / 147 / 74 / 40 / 16 |
| CONTROL | 83 | 50 | 5 | 23 | 5 | 0 / 19 / 62 / 2 / 0 |
| FUNCTIONAL | 27 | 2 | 1 | 9 | 15 | 0 / 12 / 15 / 0 / 0 |
| CARDIO | 84 | 70 | 0 | 0 | 14 | 70 / 0 / 0 / 0 / 14 |
| ALL | 732 | 278 | 29 | 237 | 188 | 286 / 221 / 153 / 42 / 30 |

Implements named in at least one set-up (count of active records; recomputed for v1.1 - the new records add a rope (sled rope pull) and use household objects, walls and cables; no band or chain anywhere): none 130, dumbbell 129, medball 94, barbell 90, open_space_long 59, cable 48, box 39, machine 39, kettlebell 37, cardio_treadmill 37, cardio_machine 36, bench 33, step 32, wall 25, weight_bench 23, pullup_bar 21, open_space_short 14, plate 14, plate_low_target 12, hex_bar 11, household_object 10, squat_rack 9, hurdles 7, landmine 6, seal_bench 6, stability_ball 5, ez_bar 5, sled 5, sandbag 4, suspension_trainer 4, cones 3, slider 3, dip_station 3, any_cardio_mode 3, jump_rope 2, smith 2, dip_belt 2, farmer_handles 2, box_high 1, ssb 1, foam_roller 1, hyper_bench 1, ghd 1, anchor 1, reverse_hyper 1, rope 1. No active record uses a band or chains.

### 3.4 Laterality and plane

| laterality | records |
|---|---|
| bilateral | 414 |
| unilateral | 143 |
| n/a | 101 |
| alternating | 73 |
| either (single-leg, or bilateral holding DBs) | 1 |

| plane | records |
|---|---|
| sagittal | 543 |
| transverse | 82 |
| frontal | 45 |
| multi | 41 |
| n/a | 21 |

## 4. Full exercise list by pattern (active records)


Status: **S** = selectable in a BYOP dropdown, **L** = BYOP library but no dropdown reads it, **R** = MASTER_MODEL reference tab only, **P** = named only in program tabs, **N** = new in v1, added by a coach answer, **X** = new in v1, PROPOSED, **N2** = new in v1.1, added by a round-2 answer, **X2** = new in v1.1, PROPOSED-ADDITION (section 2.8). Level = primary level; 'from' = lowest exercise-skill tier the generator may offer it to (F / I / A; not the client's volume level L1-L3, CAT-06). T = access tier, C = constraint 1-5. Credit = how much one set counts per muscle group ('-' = not counted, VOL-10). Uses = program cells naming it (direct + inside complexes). Notes: ADDED / NEW / PENDING / renamed / coach preference / speed step / delt head.

Column **v1.1** (round-2 tags): the R2 change on that record; for jumps and throws the R2-ATH-02 class (ballistic / plyometric / receive) and the Receive-Create stage the name implies (R2-ATH-03); for Olympic lifts the day they belong to (clean day = squat-leaning, snatch day = hinge-leaning, R2-ATH-04); 'heavy spine day' / '2nd day if not sore' (R2-SES-02); '60+ off by default' (R2-ATH-08, opt-in with a warning). The 21.6-mile run is retired (R2-LIB-06) and no longer listed.

### BKD - BILATERAL KNEE DOMINANT (41)

| name | id | st | level | from | T | C | laterality | credit per set | uses | v1 notes | v1.1 |
|---|---|---|---|---|---|---|---|---|---|---|---|
| Back Squat (bar position not stated) | back-squat-bar-position-not-stated | S | advanced | A | T3 | 2 | bilateral | QUADS 1 + GLUTES 0.25 | 23 | CAT-04: back squat = advanced | heavy spine day |
| Barbell Thruster | barbell-thruster | S | advanced | A | T3 | 1 | bilateral | QUADS 1 + SHOULDERS/TRAPS 0.5 + GLUTES 0.25 | 0 | conditioning-leaning; LIB-14 0.5 | R2-VOL-05: 1.0 / 0.5 / 0.25 |
| Belt Squat (machine) | belt-squat-machine | N | foundational | F | T3 | 4 | bilateral | QUADS 1 + GLUTES 0.25 | 0 | NEW EQ-11 | R2-LIB-07: FOUNDATIONAL |
| Bodyweight Squat (air squat) | bodyweight-squat-air-squat | S | foundational | F | T0 | 2 | bilateral | QUADS 1 + GLUTES 0.25 | 6 |  |  |
| Box Goblet Squat (touch-and-go) | box-goblet-squat-touch-and-go | S | foundational | F | T2 | 3 | bilateral | QUADS 1 + GLUTES 0.25 | 0 |  | 2nd day if not sore |
| Box Squat (bodyweight) | box-squat-bodyweight | S | foundational | F | T0 | 3 | bilateral | QUADS 1 + GLUTES 0.25 | 0 |  |  |
| Box Squat - any variation, dead-stop ('Deload' = sit and unload on the box) | box-squat-any-variation-dead-stop-deload-sit-and-unload-on-the-box | S | advanced | A | T2 | 2 | bilateral | QUADS 1 + GLUTES 0.25 | 8 |  | heavy spine day |
| Box Squat, any loading - touch-and-go (fast) | box-squat-any-loading-touch-and-go-fast | S | advanced | A | T2 | 2 | bilateral | QUADS 1 + GLUTES 0.25 | 4 |  | heavy spine day |
| Box Zercher Squat (touch-and-go) | box-zercher-squat-touch-and-go | S | foundational | F | T2 | 3 | bilateral | QUADS 1 + GLUTES 0.25 | 0 |  | heavy spine day |
| DB Thruster (front squat into overhead press) | db-thruster-front-squat-into-overhead-press | S | advanced | A | T2 | 1 | bilateral | QUADS 1 + SHOULDERS/TRAPS 0.5 + GLUTES 0.25 | 0 | conditioning-leaning; LIB-14 0.5 | R2-VOL-05: 1.0 / 0.5 / 0.25; 2nd day if not sore |
| Double-KB Front-Rack Squat | double-kb-front-rack-squat | S | intermediate | I | T2 | 2 | bilateral | QUADS 1 + GLUTES 0.25 | 0 |  | 2nd day if not sore |
| Flipped Hex Bar Squat (low handles, longer range) | flipped-hex-bar-squat-low-handles-longer-range | S | foundational | F | T3 | 2 | bilateral | QUADS 1 + GLUTES 0.25 | 0 |  | heavy spine day |
| Front Squat (barbell) | front-squat-barbell | S | intermediate | I | T3 | 2 | bilateral | QUADS 1 + GLUTES 0.25 | 66 |  | heavy spine day |
| Goblet Squat (Heels Elevated) | goblet-squat-heels-elevated | S | any | F | T2 | 2 | bilateral | QUADS 1 + GLUTES 0.25 | 0 |  | R2-VOL-05: glutes 0.25 added; 2nd day if not sore |
| Goblet Squat (KB/DB) | goblet-squat-kb-db | S | foundational | F | T2 | 2 | bilateral | QUADS 1 + GLUTES 0.25 | 2 |  | 2nd day if not sore |
| Hack Squat (machine) | hack-squat-machine | S | intermediate | F | T3 | 4 | bilateral | QUADS 1 + GLUTES 0.25 | 0 | pref 'I PERSONALLY DON'T LIKE IT' | R2-VOL-05: glutes 0.25 added; 2nd day if not sore |
| Hex (Trap) Bar Squat | hex-trap-bar-squat | S | foundational | F | T3 | 2 | bilateral | QUADS 1 + GLUTES 0.25 | 2 |  | heavy spine day |
| High Zercher Barbell Squat | high-zercher-barbell-squat | S | intermediate | I | T3 | 2 | bilateral | QUADS 1 + GLUTES 0.25 | 4 |  | heavy spine day |
| High-Bar Back Squat | high-bar-back-squat | S | advanced | A | T3 | 2 | bilateral | QUADS 1 + GLUTES 0.25 | 13 | CAT-04: back squat = advanced (BYOP MODERATE) | heavy spine day |
| High-Zercher DB Squat (DB hugged high at chest) | high-zercher-db-squat-db-hugged-high-at-chest | S | intermediate | I | T2 | 2 | bilateral | QUADS 1 + GLUTES 0.25 | 0 |  | 2nd day if not sore |
| Landmine Hack Squat | landmine-hack-squat | S | intermediate | I | T3 | 3 | bilateral | QUADS 1 + GLUTES 0.25 | 0 |  | R2-VOL-05: glutes 0.25 added; 2nd day if not sore |
| Landmine Squat | landmine-squat | S | foundational | F | T3 | 3 | bilateral | QUADS 1 + GLUTES 0.25 | 0 |  | 2nd day if not sore |
| Leg Press (machine) | leg-press-machine | S | advanced | F | T3 | 5 | bilateral | QUADS 1 + GLUTES 0.25 | 45 | pref 'LOVE IT' |  |
| Low DB Squat (two DBs hanging at the sides) | low-hold-db-squat-single-db-hanging-between-the-legs | S | foundational | F | T2 | 2 | bilateral | QUADS 1 + GLUTES 0.25 | 0 | renamed | 2nd day if not sore |
| Low-Bar Back Squat | low-bar-back-squat | S | advanced | A | T3 | 2 | bilateral | QUADS 1 + GLUTES 0.25 | 3 | CAT-04: back squat = advanced (BYOP MODERATE); never for older / injured (EQ-03) | heavy spine day |
| Pendulum Squat (machine) | pendulum-squat-machine | S | advanced | F | T3 | 4 | bilateral | QUADS 1 + GLUTES 0.25 | 0 | pref 'LOVE IT' | R2-VOL-05: glutes 0.25 added; 2nd day if not sore |
| Single-Arm DB Thruster | single-arm-db-thruster | S | advanced | A | T2 | 1 | bilateral | QUADS 1 + SHOULDERS/TRAPS 0.5 + GLUTES 0.25 | 0 | conditioning-leaning; LIB-14 0.5 | R2-VOL-05: 1.0 / 0.5 / 0.25; 2nd day if not sore |
| Sissy Squat | sissy-squat | S | advanced | A | T0 | 1 | bilateral | QUADS 1 | 0 |  |  |
| Squat Holding an Object Between the Knees (adduction squeeze) | squat-holding-an-object-between-the-knees-adduction-squeeze | R | foundational | F | T0 | 2 | bilateral | QUADS 1 + GLUTES 0.25 | 0 | ADDED LIB-20 | R2-VOL-05: glutes 0.25 added |
| Sumo Squat (DB or KB) | sumo-squat-db-or-kb | S | foundational | F | T2 | 2 | bilateral | QUADS 1 + GLUTES 0.25 | 0 |  | 2nd day if not sore |
| Wall-Assisted Squat (foam roller or stability ball behind the back) | wall-assisted-squat-foam-roller-or-stability-ball-behind-the-back | S | foundational | F | T1 | 4 | bilateral | QUADS 1 + GLUTES 0.25 | 0 |  | R2-VOL-05: glutes 0.25 added |
| Zercher Squat (barbell) | zercher-squat-barbell | S | any | F | T3 | 2 | bilateral | QUADS 1 + GLUTES 0.25 | 2 |  | R2-VOL-05: glutes 0.25 added; heavy spine day |
| Barbell Overhead Squat | barbell-overhead-squat | R | advanced | A | T3 | 2 | bilateral | QUADS 1 + GLUTES 0.25 | 0 | never for older / injured (EQ-03) | heavy spine day |
| Oscillating Drop Squat | oscillating-drop-squat | P | unrated | F | T0 | 2 | bilateral | QUADS 1 + GLUTES 0.25 | 1 |  |  |
| Pin Squat (squat from / to safety pins) | pin-squat-squat-from-to-safety-pins | R | advanced | A | T3 | 2 | bilateral | QUADS 1 + GLUTES 0.25 | 0 |  | heavy spine day |
| Plate-Reach Forward Squat (counterbalance squat) | plate-reach-forward-squat-counterbalance-squat | R | foundational | F | T2 | 2 | bilateral | QUADS 1 + GLUTES 0.25 | 0 |  | 2nd day if not sore |
| Safety Squat Bar (SSB) Squat | safety-squat-bar-ssb-squat | R | advanced | A | T3 | 2 | bilateral | QUADS 1 + GLUTES 0.25 | 0 |  | heavy spine day |
| Smith Machine Squat | smith-machine-squat | P | unrated | F | T3 | 4 | bilateral | QUADS 1 + GLUTES 0.25 | 4 | axial high (bar on the back, PER-04) | heavy spine day |
| Squat - any loading ('Whatever Squat') | squat-any-loading-whatever-squat | R | advanced | A | T3 | 2 | bilateral | QUADS 1 + GLUTES 0.25 | 8 |  | heavy spine day |
| V-Squat (machine) | v-squat-machine | R | unrated | F | T3 | 4 | bilateral | QUADS 1 + GLUTES 0.25 | 0 | never; pref 'DON'T LIKE IT' |  |
| Wall Sit (isometric squat hold) | wall-sit-isometric-squat-hold | X2 | foundational | F | T0 | 3 | bilateral | QUADS 1 + GLUTES 0.25 | 0 |  | PROPOSED-ADDITION |

### UKD - UNILATERAL KNEE DOMINANT (21)

| name | id | st | level | from | T | C | laterality | credit per set | uses | v1 notes | v1.1 |
|---|---|---|---|---|---|---|---|---|---|---|---|
| Cossack Lateral Lunge | cossack-lateral-lunge | R | intermediate | I | T0 | 2 | unilateral | QUADS 1 + GLUTES 0.25 | 0 | ADDED LIB-20 |  |
| Curtsy Lunge | curtsy-lunge | S | any | F | T0 | 2 | unilateral | QUADS 1 + GLUTES 0.25 | 0 |  |  |
| Deficit Reverse Lunge (standing on plate/step) | deficit-reverse-lunge-standing-on-plate-step | S | any | F | T0 | 2 | unilateral | QUADS 1 + GLUTES 0.25 | 4 |  |  |
| Forward Lunge | forward-lunge | S | any | F | T0 | 2 | unilateral | QUADS 1 + GLUTES 0.25 | 3 |  |  |
| Front- and Rear-Foot-Elevated Split Squat (FFE & RFE) | front-and-rear-foot-elevated-split-squat-ffe-and-rfe | S | any | F | T0 | 2 | unilateral | QUADS 1 + GLUTES 0.25 | 25 |  |  |
| Front-Foot-Elevated Split Squat / Lunge (FFE) | front-foot-elevated-split-squat-lunge-ffe | S | any | F | T0 | 2 | unilateral | QUADS 1 + GLUTES 0.25 | 24 |  |  |
| Pistol Squat (single-leg squat to floor) | pistol-squat-single-leg-squat-to-floor | S | any | F | T0 | 1 | unilateral | QUADS 1 + GLUTES 0.25 | 0 |  |  |
| Rear-Foot-Against-Wall Split Squat | rear-foot-against-wall-split-squat | S | any | F | T0 | 2 | unilateral | QUADS 1 + GLUTES 0.25 | 0 |  |  |
| Rear-Foot-Elevated Lunge (RFE / Bulgarian split squat) | rear-foot-elevated-lunge-rfe-bulgarian-split-squat | S | any | F | T0 | 2 | unilateral | QUADS 1 + GLUTES 0.25 | 34 |  |  |
| Reverse Lunge | reverse-lunge | S | any | F | T0 | 2 | unilateral | QUADS 1 + GLUTES 0.25 | 23 |  |  |
| Side (Lateral) Lunge | side-lateral-lunge | S | any | F | T0 | 2 | unilateral | QUADS 1 + GLUTES 0.25 | 5 |  |  |
| Single-Leg Get-Up (box pistol) | single-leg-get-up-single-leg-sit-to-stand-from-bench-box | S | any | F | T0 | 2 | unilateral | QUADS 1 + GLUTES 0.25 | 0 | renamed |  |
| Stationary Lunge (Split Squat) | stationary-lunge-split-squat | S | any | F | T0 | 2 | unilateral | QUADS 1 + GLUTES 0.25 | 2 |  |  |
| Step-Up (forward and lateral) | step-up-forward-and-lateral | S | any | F | T0 | 2 | unilateral | QUADS 1 + GLUTES 0.25 | 12 |  |  |
| Walking Lunge | walking-lunge | S | any | F | T0 | 2 | alternating | QUADS 1 + GLUTES 0.25 | 3 |  |  |
| Jefferson Lunge | jefferson-lunge | P | unrated | F | T3 | 2 | unilateral | QUADS 1 + GLUTES 0.25 | 1 |  |  |
| Lunge (variation not stated) | lunge-variation-not-stated | R | any | F | T0 | 2 | unilateral | QUADS 1 + GLUTES 0.25 | 16 |  | 2nd day if not sore |
| Medball Rotational Alternating FFE Reverse Lunge | medball-rotational-alternating-ffe-reverse-lunge | P | unrated | F | T2 | 2 | alternating | QUADS 1 + GLUTES 0.25 | 1 |  |  |
| RFE Split-Squat Isometric Hold (suitcase DB) | rfe-split-squat-isometric-hold-suitcase-db | P | unrated | F | T2 | 2 | unilateral | QUADS 1 + GLUTES 0.25 | 1 |  |  |
| Sandbag Walking Lunge (bag on the shoulders) | sandbag-walking-lunge-bag-on-shoulders | X2 | intermediate | I | T2 | 2 | alternating | QUADS 1 + GLUTES 0.25 | 0 |  | PROPOSED-ADDITION |
| Step-up to Knee Drive | step-up-to-knee-drive | P | unrated | F | T0 | 2 | unilateral | QUADS 1 + GLUTES 0.25 | 1 |  |  |

### KEXT - LEG EXTENSIONS (2)

| name | id | st | level | from | T | C | laterality | credit per set | uses | v1 notes | v1.1 |
|---|---|---|---|---|---|---|---|---|---|---|---|
| Leg Extension (machine) | leg-extension-machine | S | any | F | T3 | 5 | bilateral | QUADS 1 | 45 |  |  |
| DB Leg Extension (seated on box) | db-leg-extension-seated-on-box | R | any | F | T2 | 3 | bilateral | QUADS 1 | 0 |  |  |

### BHD - BILATERAL HIP DOMINANT (27)

| name | id | st | level | from | T | C | laterality | credit per set | uses | v1 notes | v1.1 |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 45-Degree Hyperextension (back/hip extension) | 45-degree-hyperextension-back-hip-extension | S | intermediate | F | T3 | 4 | bilateral | HAMSTRINGS 1 + GLUTES 0.25 + BACK 0.25 | 2 |  |  |
| Barbell Deadlift (conventional) | barbell-deadlift-conventional | S | intermediate | I | T3 | 2 | bilateral | HAMSTRINGS 1 + GLUTES 0.25 | 17 |  | heavy spine day |
| Barbell Good Morning | barbell-good-morning | S | advanced | A | T3 | 2 | bilateral | HAMSTRINGS 1 + GLUTES 0.25 + BACK 0.25 | 4 |  | heavy spine day |
| Barbell Hip Thrust | barbell-hip-thrust | S | advanced | A | T3 | 3 | bilateral | GLUTES 1 | 0 |  |  |
| Cable Pull-Through | cable-pull-through | S | foundational | F | T3 | 3 | bilateral | GLUTES 1 + HAMSTRINGS 0.25 | 0 |  |  |
| Double-Kettlebell Deadlift | double-kettlebell-deadlift | S | foundational | F | T2 | 2 | bilateral | HAMSTRINGS 1 + GLUTES 0.25 | 0 |  | 2nd day if not sore |
| Dumbbell Deadlift | dumbbell-deadlift | S | intermediate | I | T2 | 2 | bilateral | HAMSTRINGS 1 + GLUTES 0.25 | 12 |  | 2nd day if not sore |
| Dumbbell Hip Thrust | dumbbell-hip-thrust | S | intermediate | I | T2 | 3 | bilateral | GLUTES 1 | 0 |  |  |
| Feet-Elevated Glute Bridge (feet on bench) | feet-elevated-glute-bridge-feet-on-bench | S | foundational | F | T0 | 3 | bilateral | GLUTES 1 + HAMSTRINGS 0.25 | 1 |  |  |
| GHD - Glute-Ham Developer (hip extension / glute-ham raise) | ghd-glute-ham-developer-hip-extension-glute-ham-raise | S | any | F | T3 | 4 | bilateral | HAMSTRINGS 1 + GLUTES 0.25 | 0 |  |  |
| Glute Bridge | glute-bridge | S | foundational | F | T0 | 3 | bilateral | GLUTES 1 | 1 |  |  |
| Good Morning (machine) | good-morning-machine | S | intermediate | F | T3 | 4 | bilateral | HAMSTRINGS 1 + GLUTES 0.25 | 0 |  | 2nd day if not sore |
| Hex (Trap) Bar Deadlift | hex-trap-bar-deadlift | S | intermediate | I | T3 | 2 | bilateral | HAMSTRINGS 1 + GLUTES 0.25 + QUADS 0.25 | 6 |  | heavy spine day |
| Hip Thrust (machine) | hip-thrust-machine | S | intermediate | F | T3 | 4 | bilateral | GLUTES 1 | 0 |  |  |
| Hip Thrust or Glute Bridge (either) | hip-thrust-or-glute-bridge-either | S | any | F | T0 | 3 | bilateral | GLUTES 1 | 0 |  |  |
| Kettlebell Swing (Russian) | kettlebell-swing-russian | S | foundational | F | T2 | 1 | bilateral | - | 12 |  | R2-VOL-05: ballistic, 0 sets; ballistic; 2nd day if not sore |
| Reverse Hyperextension | reverse-hyperextension | S | foundational | F | T3 | 4 | bilateral | GLUTES 1 + HAMSTRINGS 0.25 | 0 |  |  |
| Sandbag Hip Thrust | sandbag-hip-thrust | S | foundational | F | T2 | 3 | bilateral | GLUTES 1 | 0 |  |  |
| Single-Kettlebell Deadlift | single-kettlebell-deadlift | S | foundational | F | T2 | 2 | bilateral | HAMSTRINGS 1 + GLUTES 0.25 | 3 |  | 2nd day if not sore |
| Snatch-Grip Barbell Deadlift | snatch-grip-barbell-deadlift | S | advanced | A | T3 | 2 | bilateral | HAMSTRINGS 1 + GLUTES 0.25 | 7 |  | heavy spine day |
| Stiff-Leg Deadlift / RDL | stiff-leg-deadlift-rdl | S | advanced | A | T2 | 2 | bilateral | HAMSTRINGS 1 + GLUTES 0.25 | 13 |  | heavy spine day |
| Sumo Deadlift | sumo-deadlift | S | advanced | A | T3 | 2 | bilateral | HAMSTRINGS 1 + GLUTES 0.25 + QUADS 0.25 | 0 |  | heavy spine day |
| Wide-Grip Barbell Deadlift | wide-grip-barbell-deadlift | S | advanced | A | T3 | 2 | bilateral | HAMSTRINGS 1 + GLUTES 0.25 | 0 |  | heavy spine day |
| American KB Swing (overhead) | american-kb-swing-overhead | R | intermediate | I | T2 | 2 | bilateral | - | 0 |  | R2-VOL-05: ballistic, 0 sets; ballistic; 2nd day if not sore |
| Deadlift (implement not stated) | deadlift-implement-not-stated | P | unrated | F | T3 | 2 | bilateral | HAMSTRINGS 1 + GLUTES 0.25 | 65 |  | heavy spine day |
| Deficit Barbell Deadlift | deficit-barbell-deadlift | P | unrated | F | T3 | 2 | bilateral | HAMSTRINGS 1 + GLUTES 0.25 | 6 |  | heavy spine day |
| Hip Thrust (implement not stated) | hip-thrust-implement-not-stated | R | any | F | T0 | 4 | bilateral | GLUTES 1 | 0 |  |  |

### UHD - UNILATERAL HIP DOMINANT (12)

| name | id | st | level | from | T | C | laterality | credit per set | uses | v1 notes | v1.1 |
|---|---|---|---|---|---|---|---|---|---|---|---|
| Alternating Staggered-Stance Single-Leg Deadlift (barbell) | alternating-barbell-deadlift-alternate-lead-leg-meaning-inferred | S | foundational | F | T3 | 2 | alternating | HAMSTRINGS 1 + GLUTES 0.25 | 0 | renamed | 2nd day if not sore |
| Alternating Staggered-Stance Single-Leg Deadlift (DB) | alternating-db-deadlift-alternate-lead-leg-staggered-side-each-rep-meaning-infer | S | foundational | F | T2 | 2 | alternating | HAMSTRINGS 1 + GLUTES 0.25 | 0 | renamed |  |
| Rear-Foot-on-Wall DB Deadlift (RDL) | rear-foot-on-wall-db-deadlift-rdl | S | any | F | T2 | 2 | unilateral | HAMSTRINGS 1 + GLUTES 0.25 | 5 |  |  |
| Single-Leg Glute Bridge (foot elevated on bench) | single-leg-glute-bridge-foot-elevated-on-bench | S | foundational | F | T0 | 3 | unilateral | GLUTES 1 + HAMSTRINGS 0.25 | 1 |  |  |
| Single-Leg Glute Bridge (foot on floor) | single-leg-glute-bridge-foot-on-floor | S | foundational | F | T0 | 3 | unilateral | GLUTES 1 | 12 |  |  |
| Single-Leg Hip Thrust (shoulders on bench) | single-leg-hip-thrust-shoulders-on-bench | S | foundational | F | T0 | 3 | unilateral | GLUTES 1 | 0 |  |  |
| Split-Stance Contralateral Single-Arm KB Swing | split-stance-contralateral-single-arm-kb-swing | R | intermediate | I | T2 | 2 | unilateral | - | 0 | ADDED LIB-20 | R2-VOL-05: ballistic, 0 sets; ballistic |
| Staggered-Stance (Kickstand) Barbell Deadlift | staggered-stance-kickstand-barbell-deadlift | S | foundational | F | T3 | 2 | unilateral | HAMSTRINGS 1 + GLUTES 0.25 | 2 |  | 2nd day if not sore |
| Staggered-Stance (Kickstand) DB Deadlift | staggered-stance-kickstand-db-deadlift | S | foundational | F | T2 | 2 | unilateral | HAMSTRINGS 1 + GLUTES 0.25 | 13 |  |  |
| Staggered-Stance Deadlift (implement not stated) | staggered-stance-deadlift-implement-not-stated | S | any | F | T2 | 2 | unilateral | HAMSTRINGS 1 + GLUTES 0.25 | 48 |  | 2nd day if not sore |
| Single-Leg RDL / Single-Leg Deadlift | single-leg-rdl-single-leg-deadlift | P | unrated | F | T2 | 2 | unilateral | HAMSTRINGS 1 + GLUTES 0.25 | 49 |  |  |
| Staggered-Stance Hex Bar Deadlift | staggered-stance-hex-bar-deadlift | R | foundational | F | T3 | 2 | unilateral | HAMSTRINGS 1 + GLUTES 0.25 | 0 |  | 2nd day if not sore |

### KFLEX - LEG FLEXION (9)

| name | id | st | level | from | T | C | laterality | credit per set | uses | v1 notes | v1.1 |
|---|---|---|---|---|---|---|---|---|---|---|---|
| Ball Hamstring Curl (medball or stability ball) | ball-hamstring-curl-medball-or-stability-ball | S | foundational | F | T2 | 2 | bilateral | HAMSTRINGS 1 | 1 |  |  |
| Lying Leg Curl (machine) | lying-leg-curl-machine | S | any | F | T3 | 5 | bilateral | HAMSTRINGS 1 | 0 |  |  |
| Machine Leg Curl (seated or lying) | machine-leg-curl-seated-or-lying | S | any | F | T3 | 5 | bilateral | HAMSTRINGS 1 | 31 |  |  |
| Nordic Hamstring Curl | nordic-hamstring-curl | S | advanced | A | T0 | 3 | bilateral | HAMSTRINGS 1 | 2 |  |  |
| Prone Dumbbell Hamstring Curl (DB between feet) | prone-dumbbell-hamstring-curl-db-between-feet | S | advanced | A | T2 | 3 | bilateral | HAMSTRINGS 1 | 0 |  |  |
| Seated Leg Curl (machine) | seated-leg-curl-machine | S | any | F | T3 | 5 | bilateral | HAMSTRINGS 1 | 0 |  |  |
| Supine Slider Hamstring Curl | supine-slider-hamstring-curl | S | foundational | F | T0 | 3 | bilateral | HAMSTRINGS 1 | 1 |  |  |
| Slider Hamstring Runners (alternating) | slider-hamstring-runners-alternating | P | unrated | F | T0 | 2 | alternating | HAMSTRINGS 1 | 8 |  |  |
| Swiss Ball Kicks (30 s) | swiss-ball-kicks-30-s | P | unrated | F | T2 | 2 | bilateral | HAMSTRINGS 1 | 2 |  |  |

### HPULL - HORIZONTAL PULL (31)

| name | id | st | level | from | T | C | laterality | credit per set | uses | v1 notes | v1.1 |
|---|---|---|---|---|---|---|---|---|---|---|---|
| Bent-Over Barbell Row | bent-over-barbell-row | S | advanced | A | T2 | 2 | bilateral | BACK 1 + SHOULDERS/TRAPS 0.25 + BICEP 0.25 | 15 |  |  |
| Bent-Over Barbell Row (Supinated / Yates grip) | bent-over-barbell-row-supinated-yates-grip | S | advanced | A | T3 | 2 | bilateral | BACK 1 + SHOULDERS/TRAPS 0.25 + BICEP 0.25 | 0 |  |  |
| Bent-Over Row (Close Grip; implement not stated) | bent-over-row-close-grip-implement-not-stated | S | advanced | A | T2 | 2 | bilateral | BACK 1 + SHOULDERS/TRAPS 0.25 + BICEP 0.25 | 0 |  |  |
| Inverted Row | inverted-row | S | foundational | F | T1 | 3 | bilateral | BACK 1 + SHOULDERS/TRAPS 0.25 + BICEP 0.25 | 0 |  |  |
| Machine Row (Close / Neutral Grip) | machine-row-close-neutral-grip | S | foundational | F | T3 | 5 | bilateral | BACK 1 + SHOULDERS/TRAPS 0.25 + BICEP 0.25 | 0 |  |  |
| Machine Row (grip not stated) | machine-row-grip-not-stated | S | any | F | T3 | 5 | bilateral | BACK 1 + SHOULDERS/TRAPS 0.25 + BICEP 0.25 | 31 |  |  |
| Machine Row (Pronated Grip) | machine-row-pronated-grip | S | foundational | F | T3 | 5 | bilateral | BACK 1 + SHOULDERS/TRAPS 0.25 + BICEP 0.25 | 0 |  |  |
| Machine Row (Supinated Grip) | machine-row-supinated-grip | S | foundational | F | T3 | 5 | bilateral | BACK 1 + SHOULDERS/TRAPS 0.25 + BICEP 0.25 | 0 |  |  |
| Renegade Row | renegade-row | S | advanced | A | T2 | 1 | alternating | BACK 1 + SHOULDERS/TRAPS 0.25 + BICEP 0.25 | 0 |  |  |
| Seal Row - Barbell (Pronated Grip) | seal-row-barbell-pronated-grip | S | advanced | F | T3 | 4 | bilateral | BACK 1 + SHOULDERS/TRAPS 0.25 + BICEP 0.25 | 0 |  |  |
| Seal Row - Barbell (Supinated Grip) | seal-row-barbell-supinated-grip | S | advanced | F | T3 | 4 | bilateral | BACK 1 + SHOULDERS/TRAPS 0.25 + BICEP 0.25 | 0 |  |  |
| Seal Row - DB (Pronated Grip) | seal-row-db-pronated-grip | S | advanced | F | T3 | 4 | bilateral | BACK 1 + SHOULDERS/TRAPS 0.25 + BICEP 0.25 | 0 |  |  |
| Seal Row - DB (Supinated Grip) | seal-row-db-supinated-grip | S | advanced | F | T3 | 4 | bilateral | BACK 1 + SHOULDERS/TRAPS 0.25 + BICEP 0.25 | 0 |  |  |
| Seated Cable Row (bilateral) | seated-cable-row-bilateral | S | any | F | T3 | 4 | bilateral | BACK 1 + SHOULDERS/TRAPS 0.25 + BICEP 0.25 | 0 |  |  |
| Single-Arm Cable Row | single-arm-cable-row | S | any | F | T3 | 3 | unilateral | BACK 1 + SHOULDERS/TRAPS 0.25 + BICEP 0.25 | 1 |  |  |
| Single-Arm DB/KB Row | single-arm-db-kb-row | S | any | F | T2 | 3 | unilateral | BACK 1 + SHOULDERS/TRAPS 0.25 + BICEP 0.25 | 60 |  |  |
| Table Row (inverted row under a sturdy table) | table-row-inverted-row-under-a-sturdy-table | N2 | foundational | F | T0 | 3 | bilateral | BACK 1 + SHOULDERS/TRAPS 0.25 + BICEP 0.25 | 0 |  | NEW R2-LIB-07 |
| TRX Row (suspension row) | trx-row-suspension-row | S | foundational | F | T1 | 2 | bilateral | BACK 1 + SHOULDERS/TRAPS 0.25 + BICEP 0.25 | 0 |  |  |
| Bent-Over DB or KB Row (two-arm) | bent-over-db-or-kb-row-two-arm | R | intermediate | I | T2 | 2 | bilateral | BACK 1 + SHOULDERS/TRAPS 0.25 + BICEP 0.25 | 8 |  |  |
| Bent-Over Hex Bar Row | bent-over-hex-bar-row | R | intermediate | I | T3 | 2 | bilateral | BACK 1 + SHOULDERS/TRAPS 0.25 + BICEP 0.25 | 0 |  |  |
| Bent-Over Seesaw DB Row (alternating) | bent-over-seesaw-db-row-alternating | P | unrated | F | T2 | 2 | alternating | BACK 1 + BICEP 0.25 | 2 |  |  |
| Bird Dog Row (DB) | bird-dog-row-db | P | unrated | F | T2 | 2 | unilateral | BACK 1 + BICEP 0.25 | 1 |  |  |
| Chest-Supported Row | chest-supported-row | R | foundational | F | T2 | 2 | bilateral | BACK 1 + SHOULDERS/TRAPS 0.25 + BICEP 0.25 | 12 |  |  |
| Half-Kneeling Single-Arm Cable Row | half-kneeling-single-arm-cable-row | R | intermediate | F | T3 | 4 | unilateral | BACK 1 + SHOULDERS/TRAPS 0.25 + BICEP 0.25 | 3 |  |  |
| Kong Row (double-KB row from the floor) | kong-row-unclear-possibly-kroc-row | R | foundational | F | T2 | 2 | bilateral | BACK 1 + SHOULDERS/TRAPS 0.25 + BICEP 0.25 | 0 | renamed; low stimulus |  |
| Pendulum Row (machine) - or Pendlay Row (verify) | pendulum-row-machine-or-pendlay-row-verify | R | intermediate | F | T3 | 4 | bilateral | BACK 1 + SHOULDERS/TRAPS 0.25 + BICEP 0.25 | 0 |  |  |
| Row - any horizontal pull | row-any-horizontal-pull | P | unrated | F | T3 | 3 | bilateral | BACK 1 + BICEP 0.25 | 8 |  |  |
| Seal Cable Row (prone, chest-supported) - or Seated Cable Row (typo ambiguous) | seal-cable-row-prone-chest-supported-or-seated-cable-row-typo-ambiguous | R | intermediate | F | T3 | 4 | bilateral | BACK 1 + SHOULDERS/TRAPS 0.25 + BICEP 0.25 | 0 |  |  |
| Seal DB Row (grip not stated) | seal-db-row-grip-not-stated | P | unrated | F | T3 | 4 | bilateral | BACK 1 + BICEP 0.25 | 4 |  |  |
| Seal Row (implement/grip not stated) | seal-row-implement-grip-not-stated | P | unrated | F | T3 | 4 | bilateral | BACK 1 + BICEP 0.25 | 15 |  |  |
| Single-Arm Machine Row | single-arm-machine-row | R | any | F | T3 | 5 | unilateral | BACK 1 + SHOULDERS/TRAPS 0.25 + BICEP 0.25 | 0 |  |  |

### VPULL - VERTICAL PULL (25)

| name | id | st | level | from | T | C | laterality | credit per set | uses | v1 notes | v1.1 |
|---|---|---|---|---|---|---|---|---|---|---|---|
| Assisted Pull-up (machine) | assisted-pull-up-band-or-machine | S | any | F | T3 | 4 | bilateral | BACK 1 + BICEP 0.25 | 0 | renamed |  |
| Assisted Pull-Up Machine (Close Grip) | assisted-pull-up-machine-close-grip | S | foundational | F | T3 | 4 | bilateral | BACK 1 + BICEP 0.25 | 0 |  |  |
| Assisted Pull-Up Machine (Pronated Grip) | assisted-pull-up-machine-pronated-grip | S | foundational | F | T3 | 4 | bilateral | BACK 1 + BICEP 0.25 | 0 |  |  |
| Assisted Pull-Up Machine (Supinated / Chin-Up Grip) | assisted-pull-up-machine-supinated-chin-up-grip | S | foundational | F | T3 | 4 | bilateral | BACK 1 + BICEP 0.25 | 0 |  |  |
| Chin-Up (supinated) | chin-up-supinated | S | advanced | A | T1 | 1 | bilateral | BACK 1 + BICEP 0.25 | 1 |  |  |
| L-Sit Pull-Up | l-sit-pull-up | S | advanced | A | T1 | 1 | bilateral | BACK 1 + BICEP 0.25 | 0 |  |  |
| Lat Pulldown (Close Grip) | lat-pulldown-close-grip | S | foundational | F | T3 | 4 | bilateral | BACK 1 + BICEP 0.25 | 6 |  |  |
| Lat Pulldown (grip not stated) | lat-pulldown-grip-not-stated | S | any | F | T3 | 4 | bilateral | BACK 1 + BICEP 0.25 | 38 |  |  |
| Lat Pulldown (Pronated / Overhand Grip) | lat-pulldown-pronated-overhand-grip | S | foundational | F | T3 | 4 | bilateral | BACK 1 + BICEP 0.25 | 1 |  |  |
| Lat Pulldown (Rope Attachment) | lat-pulldown-rope-attachment | S | foundational | F | T3 | 4 | bilateral | BACK 1 + BICEP 0.25 | 0 |  |  |
| Lat Pulldown (Supinated / Underhand Grip) | lat-pulldown-supinated-underhand-grip | S | foundational | F | T3 | 4 | bilateral | BACK 1 + BICEP 0.25 | 0 |  |  |
| Lat Pulldown (Wide Grip) | lat-pulldown-wide-grip | S | foundational | F | T3 | 4 | bilateral | BACK 1 + BICEP 0.25 | 0 |  |  |
| Lat Pulldown (Wide MAG Grip) | lat-pulldown-wide-mag-grip | S | foundational | F | T3 | 4 | bilateral | BACK 1 + BICEP 0.25 | 0 |  |  |
| Pull-up (grip not stated) | pull-up-grip-not-stated | S | any | F | T1 | 1 | bilateral | BACK 1 + BICEP 0.25 | 54 |  |  |
| Seated Ring/TRX Pull-Up (feet-supported) | seated-ring-trx-pull-up-feet-supported | S | foundational | F | T1 | 2 | bilateral | BACK 1 + BICEP 0.25 | 0 |  |  |
| Single-Arm Lat Pulldown | single-arm-lat-pulldown | S | any | F | T3 | 4 | unilateral | BACK 1 + BICEP 0.25 | 14 |  |  |
| Strict Pull-Up (Feet Behind) | strict-pull-up-feet-behind | S | advanced | A | T1 | 1 | bilateral | BACK 1 + BICEP 0.25 | 0 |  |  |
| Strict Pull-Up (Feet in Front / hollow) | strict-pull-up-feet-in-front-hollow | S | advanced | A | T1 | 1 | bilateral | BACK 1 + BICEP 0.25 | 1 |  |  |
| Strict Pull-Up (Knees to Chest / tuck) | strict-pull-up-knees-to-chest-tuck | S | advanced | A | T1 | 1 | bilateral | BACK 1 + BICEP 0.25 | 0 |  |  |
| Weighted Pull-Up | weighted-pull-up | S | advanced | A | T2 | 1 | bilateral | BACK 1 + BICEP 0.25 | 1 |  |  |
| Wide-Grip Pull-Up | wide-grip-pull-up | S | advanced | A | T1 | 1 | bilateral | BACK 1 + BICEP 0.25 | 0 |  |  |
| Close-Grip Pull-up | close-grip-pull-up | P | unrated | F | T1 | 2 | bilateral | BACK 1 + BICEP 0.25 | 4 |  |  |
| Jumping Pull-up | jumping-pull-up | P | unrated | F | T1 | 2 | bilateral | BACK 1 + BICEP 0.25 | 2 |  |  |
| Lat Pull-over (cable) | cable-lat-pullover | R | foundational | F | T3 | 3 | bilateral | BACK 1 | 22 | renamed; no biceps credit (straight arm) |  |
| Neutral-Grip Lat Pulldown | neutral-grip-lat-pulldown | P | unrated | F | T3 | 4 | bilateral | BACK 1 + BICEP 0.25 | 16 |  |  |

### HPUSH - HORIZONTAL PUSH (30)

| name | id | st | level | from | T | C | laterality | credit per set | uses | v1 notes | v1.1 |
|---|---|---|---|---|---|---|---|---|---|---|---|
| Alternating DB Floor Press | alternating-db-floor-press | S | any | F | T2 | 3 | alternating | CHEST 1 + SHOULDERS/TRAPS 0.25 + TRICEP 0.25 | 1 |  |  |
| Alternating Flat DB Bench Press | alternating-flat-db-bench-press | S | any | F | T2 | 3 | alternating | CHEST 1 + SHOULDERS/TRAPS 0.25 + TRICEP 0.25 | 2 |  |  |
| Alternating Incline DB Bench Press (one up / one down) | alternating-incline-db-bench-press-one-up-one-down | S | any | F | T2 | 3 | alternating | CHEST 1 + SHOULDERS/TRAPS 0.25 + TRICEP 0.25 | 29 |  |  |
| Alternating Standing Cable Press (one forward / one back) | alternating-standing-cable-press-one-forward-one-back | S | any | F | T3 | 3 | alternating | CHEST 1 + SHOULDERS/TRAPS 0.25 + TRICEP 0.25 | 0 |  |  |
| Assisted Dips (machine) | assisted-dips-band-or-machine | S | any | F | T3 | 4 | bilateral | CHEST 0.5 + TRICEP 0.5 + SHOULDERS/TRAPS 0.25 | 0 | renamed |  |
| Barbell Bench Press | barbell-bench-press | S | advanced | A | T3 | 3 | bilateral | CHEST 1 + SHOULDERS/TRAPS 0.25 + TRICEP 0.25 | 48 |  |  |
| Bench Push-Up - Feet on Bench (decline) | bench-push-up-feet-on-bench | N2 | advanced | A | T0 | 2 | bilateral | CHEST 1 + SHOULDERS/TRAPS 0.25 + TRICEP 0.25 | 0 | split from the bench push-up | R2-LIB-05: advanced; NEW R2-LIB-05 |
| Bench Push-Up - Hands on Bench (incline) | bench-push-up-hands-or-feet-on-bench-not-stated | S | foundational | F | T0 | 3 | bilateral | CHEST 1 + SHOULDERS/TRAPS 0.25 + TRICEP 0.25 | 0 | renamed (v1: PENDING LIB-12) | R2-LIB-05: foundational |
| Cable Fly | cable-fly | S | intermediate | I | T3 | 3 | bilateral | CHEST 1 | 24 |  |  |
| DB Floor Press | db-floor-press | S | foundational | F | T2 | 3 | bilateral | CHEST 1 + SHOULDERS/TRAPS 0.25 + TRICEP 0.25 | 0 |  |  |
| Decline Push-Up (feet elevated) | decline-push-up-feet-elevated | S | advanced | A | T0 | 2 | bilateral | CHEST 1 + SHOULDERS/TRAPS 0.25 + TRICEP 0.25 | 0 |  |  |
| Deficit Push-up (hands elevated for full ROM) | deficit-push-up-hands-elevated-for-full-rom | S | advanced | A | T0 | 2 | bilateral | CHEST 1 + SHOULDERS/TRAPS 0.25 + TRICEP 0.25 | 0 |  |  |
| Diamond (Close-Hand) Push-Up | diamond-close-hand-push-up | S | advanced | A | T0 | 2 | bilateral | TRICEP 0.5 + CHEST 0.5 + SHOULDERS/TRAPS 0.25 | 1 |  |  |
| Flat DB Bench Press | flat-db-bench-press | S | advanced | A | T2 | 3 | bilateral | CHEST 1 + SHOULDERS/TRAPS 0.25 + TRICEP 0.25 | 26 |  |  |
| Flat DB Fly | flat-db-fly | S | intermediate | I | T2 | 3 | bilateral | CHEST 1 | 12 |  |  |
| Incline Barbell Bench Press | incline-barbell-bench-press | S | any | F | T3 | 3 | bilateral | CHEST 1 + SHOULDERS/TRAPS 0.25 + TRICEP 0.25 | 28 |  |  |
| Incline DB Bench Press | incline-db-bench-press | S | advanced | A | T2 | 3 | bilateral | CHEST 1 + SHOULDERS/TRAPS 0.25 + TRICEP 0.25 | 21 |  |  |
| Incline Push-Up (hands elevated) | incline-push-up-hands-elevated | S | foundational | F | T0 | 3 | bilateral | CHEST 1 + SHOULDERS/TRAPS 0.25 + TRICEP 0.25 | 0 |  |  |
| Kneeling Push-Up | kneeling-push-up | S | foundational | F | T0 | 3 | bilateral | CHEST 1 + SHOULDERS/TRAPS 0.25 + TRICEP 0.25 | 0 |  |  |
| Machine Bench Press | machine-bench-press | S | foundational | F | T3 | 5 | bilateral | CHEST 1 + SHOULDERS/TRAPS 0.25 + TRICEP 0.25 | 0 |  |  |
| Machine Fly (Pec Deck) | machine-fly-pec-deck | S | intermediate | F | T3 | 5 | bilateral | CHEST 1 | 12 |  |  |
| Offset Push-Up (one hand elevated) | offset-push-up-one-hand-elevated | S | any | F | T0 | 2 | unilateral | CHEST 1 + SHOULDERS/TRAPS 0.25 + TRICEP 0.25 | 5 |  |  |
| Parallel-Bar Dip | parallel-bar-dip | S | advanced | A | T2 | 1 | bilateral | CHEST 0.5 + TRICEP 0.5 + SHOULDERS/TRAPS 0.25 | 25 |  |  |
| Push-Up | push-up | S | intermediate | I | T0 | 2 | bilateral | CHEST 1 + SHOULDERS/TRAPS 0.25 + TRICEP 0.25 | 9 |  |  |
| Push-Up (Feet on Wall / feet elevated) | push-up-feet-on-wall-feet-elevated | S | advanced | A | T0 | 2 | bilateral | CHEST 1 + SHOULDERS/TRAPS 0.25 + TRICEP 0.25 | 0 |  |  |
| Standing Cable Chest Press | standing-cable-chest-press | S | foundational | F | T3 | 3 | bilateral | CHEST 1 + SHOULDERS/TRAPS 0.25 + TRICEP 0.25 | 0 |  |  |
| Weighted Dip | weighted-dip | S | advanced | A | T2 | 1 | bilateral | CHEST 0.5 + TRICEP 0.5 + SHOULDERS/TRAPS 0.25 | 0 |  |  |
| Hand-Switch Push-up | hand-switch-push-up | P | unrated | F | T0 | 2 | bilateral | CHEST 1 + SHOULDERS/TRAPS 0.25 + TRICEP 0.25 | 1 |  |  |
| Kneeling Push-Up - One Hand Higher (offset) | kneeling-push-up-one-hand-higher-offset | R | intermediate | I | T0 | 2 | unilateral | CHEST 1 + TRICEP 0.25 | 0 |  |  |
| Machine Dip | machine-dip | P | unrated | F | T3 | 5 | bilateral | CHEST 0.5 + TRICEP 0.5 + SHOULDERS/TRAPS 0.25 | 20 |  |  |

### MRPUSH - MID RANGE PUSH (5)

| name | id | st | level | from | T | C | laterality | credit per set | uses | v1 notes | v1.1 |
|---|---|---|---|---|---|---|---|---|---|---|---|
| High-Incline DB Press | high-incline-db-press | S | any | F | T2 | 3 | bilateral | SHOULDERS/TRAPS 1 + CHEST 0.25 + TRICEP 0.25 | 2 |  |  |
| Incline Cable Press (on bench) | incline-cable-press-on-bench | R | intermediate | F | T3 | 4 | bilateral | CHEST 1 + SHOULDERS/TRAPS 0.25 + TRICEP 0.25 | 0 |  |  |
| Incline DB Bench Press - Feet on Wall | incline-db-bench-press-feet-on-wall | R | intermediate | I | T2 | 3 | bilateral | CHEST 1 + SHOULDERS/TRAPS 0.25 + TRICEP 0.25 | 0 |  |  |
| Standing Landmine Press | standing-landmine-press | R | intermediate | I | T3 | 2 | bilateral | SHOULDERS/TRAPS 1 + CHEST 0.25 + TRICEP 0.25 | 0 |  |  |
| Standing Viking Press | standing-viking-press | R | intermediate | I | T3 | 2 | bilateral | SHOULDERS/TRAPS 1 + CHEST 0.25 + TRICEP 0.25 | 0 |  |  |

### VPUSH - VERTICAL PUSH (27)

| name | id | st | level | from | T | C | laterality | credit per set | uses | v1 notes | v1.1 |
|---|---|---|---|---|---|---|---|---|---|---|---|
| Alternating DB Overhead Press | alternating-db-overhead-press | S | any | F | T2 | 2 | alternating | SHOULDERS/TRAPS 1 + TRICEP 0.25 | 0 |  |  |
| Barbell Push Jerk | barbell-push-jerk | S | intermediate | I | T3 | 1 | bilateral | SHOULDERS/TRAPS 1 + TRICEP 0.25 + GLUTES 0.25 (this slot only; '-' in the TX slot) | 0 | counted by slot (VOL-10) | jerk (either day); 60+ off by default |
| Barbell Push Press | barbell-push-press | S | foundational | F | T3 | 1 | bilateral | SHOULDERS/TRAPS 1 + TRICEP 0.25 + GLUTES 0.25 (this slot only; '-' in the TX slot) | 1 | counted by slot (VOL-10) |  |
| Barbell Z-Press (seated on floor) | barbell-z-press-seated-on-floor | S | advanced | A | T3 | 2 | bilateral | SHOULDERS/TRAPS 1 + TRICEP 0.25 | 0 |  |  |
| DB Overhead Press (seated/standing not stated) | db-overhead-press-seated-standing-not-stated | S | any | F | T2 | 2 | bilateral | SHOULDERS/TRAPS 1 + TRICEP 0.25 | 9 |  |  |
| DB Push Jerk | db-push-jerk | S | intermediate | I | T2 | 1 | bilateral | SHOULDERS/TRAPS 1 + TRICEP 0.25 + GLUTES 0.25 (this slot only; '-' in the TX slot) | 0 | counted by slot (VOL-10) | jerk (either day); 60+ off by default |
| DB Push Press | db-push-press | S | foundational | F | T2 | 1 | bilateral | SHOULDERS/TRAPS 1 + TRICEP 0.25 + GLUTES 0.25 (this slot only; '-' in the TX slot) | 6 | counted by slot (VOL-10) |  |
| DB Z-Press (seated on floor) | db-z-press-seated-on-floor | S | advanced | A | T2 | 2 | bilateral | SHOULDERS/TRAPS 1 + TRICEP 0.25 | 0 |  |  |
| Half-Kneeling Single-Arm Landmine Press | half-kneeling-single-arm-landmine-press | S | any | F | T3 | 3 | unilateral | SHOULDERS/TRAPS 1 + CHEST 0.25 + TRICEP 0.25 | 4 |  |  |
| Handstand Push-Up (wall-supported) | handstand-push-up-wall-supported | S | advanced | A | T0 | 1 | bilateral | SHOULDERS/TRAPS 1 + TRICEP 0.25 | 0 |  |  |
| High-Incline Seated Barbell Press | high-incline-seated-barbell-press | S | foundational | F | T3 | 3 | bilateral | SHOULDERS/TRAPS 1 + TRICEP 0.25 | 0 |  |  |
| High-Incline Seated DB Press | high-incline-seated-db-press | S | foundational | F | T2 | 3 | bilateral | SHOULDERS/TRAPS 1 + TRICEP 0.25 | 0 |  |  |
| Pike Push-Up | pike-push-up | S | advanced | A | T0 | 2 | bilateral | SHOULDERS/TRAPS 1 + TRICEP 0.25 | 0 |  |  |
| Seated Machine Shoulder Press | seated-machine-shoulder-press | N | foundational | F | T3 | 5 | bilateral | SHOULDERS/TRAPS 1 + TRICEP 0.25 | 0 | NEW EQ-05 | R2-LIB-07: FOUNDATIONAL |
| Seesaw DB Press (alternating, one up / one down) | seesaw-db-press-alternating-one-up-one-down | S | any | F | T2 | 2 | alternating | SHOULDERS/TRAPS 1 + TRICEP 0.25 | 5 |  |  |
| Standing Barbell Overhead Press (strict) | standing-barbell-overhead-press-strict | S | advanced | A | T3 | 2 | bilateral | SHOULDERS/TRAPS 1 + TRICEP 0.25 | 21 |  |  |
| Standing DB Overhead Press | standing-db-overhead-press | S | advanced | A | T2 | 2 | bilateral | SHOULDERS/TRAPS 1 + TRICEP 0.25 | 9 |  |  |
| Tall-Kneeling Barbell Overhead Press | tall-kneeling-barbell-overhead-press | S | advanced | A | T3 | 2 | bilateral | SHOULDERS/TRAPS 1 + TRICEP 0.25 | 0 |  |  |
| Tall-Kneeling DB Overhead Press | tall-kneeling-db-overhead-press | S | advanced | A | T2 | 2 | bilateral | SHOULDERS/TRAPS 1 + TRICEP 0.25 | 0 |  |  |
| Arnold Press (DB) | arnold-press-db | P | unrated | F | T2 | 2 | bilateral | SHOULDERS/TRAPS 1 + TRICEP 0.25 | 6 |  |  |
| Half-Kneeling Single-Arm DB Press | half-kneeling-single-arm-db-press | P | unrated | F | T2 | 2 | unilateral | SHOULDERS/TRAPS 1 + TRICEP 0.25 | 2 |  |  |
| Handstand Skill Work (H.S.) | handstand-skill-work-h-s | P | unrated | F | T0 | 2 | bilateral | SHOULDERS/TRAPS 1 + TRICEP 0.25 | 9 |  |  |
| Medball Press (vertical push slot) | medball-press-vertical-push-slot | P | unrated | F | T2 | 2 | bilateral | SHOULDERS/TRAPS 1 + TRICEP 0.25 | 2 |  |  |
| Overhead Press (implement not stated) | overhead-press-implement-not-stated | P | unrated | F | T2 | 2 | bilateral | SHOULDERS/TRAPS 1 + TRICEP 0.25 | 11 |  |  |
| Seesaw DB Push Press | seesaw-db-push-press | P | foundational | F | T2 | 2 | alternating | SHOULDERS/TRAPS 1 + TRICEP 0.25 | 3 |  |  |
| Single-Arm DB Overhead Press | single-arm-db-overhead-press | P | unrated | F | T2 | 2 | unilateral | SHOULDERS/TRAPS 1 + TRICEP 0.25 | 1 |  |  |
| Single-Arm DB Push Press | single-arm-db-push-press | P | foundational | F | T2 | 2 | unilateral | SHOULDERS/TRAPS 1 + TRICEP 0.25 | 4 |  |  |

### SHLD - SIDE RAISES (23)

| name | id | st | level | from | T | C | laterality | credit per set | uses | v1 notes | v1.1 |
|---|---|---|---|---|---|---|---|---|---|---|---|
| Barbell Front Raise | barbell-front-raise | S | any | F | T3 | 2 | bilateral | SHOULDERS/TRAPS 1 | 0 | front delt |  |
| Barbell Upright Row | barbell-upright-row | S | any | F | T3 | 2 | bilateral | SHOULDERS/TRAPS 1 | 0 | side delt |  |
| Bent-Over DB Reverse Fly | bent-over-db-reverse-fly | S | any | F | T2 | 2 | bilateral | SHOULDERS/TRAPS 1 | 15 | rear delt |  |
| Cable Side Raise (leaning) | cable-side-raise-leaning | S | any | F | T3 | 4 | unilateral | SHOULDERS/TRAPS 1 | 16 | side delt |  |
| DB Front Raise | db-front-raise | S | any | F | T2 | 2 | bilateral | SHOULDERS/TRAPS 1 | 4 | front delt |  |
| DB Front Raise (Supinated grip) | db-front-raise-supinated-grip | S | any | F | T2 | 2 | bilateral | SHOULDERS/TRAPS 1 | 0 | front delt |  |
| DB Hammer-Grip Side/Front Raise (neutral grip) | db-hammer-grip-side-front-raise-neutral-grip | S | any | F | T2 | 2 | bilateral | SHOULDERS/TRAPS 1 | 0 | front delt |  |
| DB Lateral (Side) Raise | db-lateral-side-raise | S | any | F | T2 | 2 | bilateral | SHOULDERS/TRAPS 1 | 52 | side delt |  |
| DB Lateral Raise (Supinated / palms-up grip) | db-lateral-raise-supinated-palms-up-grip | S | any | F | T2 | 2 | bilateral | SHOULDERS/TRAPS 1 | 0 | side delt |  |
| DB Upright Row | db-upright-row | S | any | F | T2 | 2 | bilateral | SHOULDERS/TRAPS 1 | 24 | side delt |  |
| Floor Prone Y / T Raises (bodyweight or light DBs) | floor-prone-y-t-raises | N2 | any | F | T0 | 3 | bilateral | SHOULDERS/TRAPS 1 | 0 | rear delt | NEW R2-LIB-07 |
| Incline / Side-Lying Cable Lateral Raise | incline-side-lying-cable-lateral-raise | S | any | F | T3 | 4 | unilateral | SHOULDERS/TRAPS 1 | 0 | side delt |  |
| Machine Reverse Fly (rear-delt pec deck) | machine-reverse-fly-rear-delt-pec-deck | S | any | F | T3 | 5 | bilateral | SHOULDERS/TRAPS 1 | 11 | rear delt |  |
| Seated (Chest-to-Thighs) DB Reverse Fly | seated-chest-to-thighs-db-reverse-fly | S | any | F | T2 | 3 | bilateral | SHOULDERS/TRAPS 1 | 0 | rear delt |  |
| Seated DB Lateral Raise | seated-db-lateral-raise | S | any | F | T2 | 3 | bilateral | SHOULDERS/TRAPS 1 | 0 | side delt |  |
| Face Pull | face-pull | R | any | F | T3 | 3 | bilateral | SHOULDERS/TRAPS 1 | 8 | rear delt |  |
| Incline-Bench Prone DB T-Raise | incline-bench-prone-db-t-raise | R | any | F | T2 | 3 | bilateral | SHOULDERS/TRAPS 1 | 0 | rear delt |  |
| Incline-Bench Prone DB Y-Raise | incline-bench-prone-db-y-raise | R | any | F | T2 | 3 | bilateral | SHOULDERS/TRAPS 1 | 0 | rear delt |  |
| KB Face Pull (as written; face pulls are normally done on a cable) | kb-face-pull-as-written-face-pulls-are-normally-cable-band | S | foundational | F | T2 | 2 | bilateral | SHOULDERS/TRAPS 1 | 0 | renamed; rear delt (v1: PENDING LIB-10, filed VPULL) | R2-LIB-04: shoulder work, swap only |
| KB Upright Row | kb-upright-row | R | any | F | T2 | 2 | bilateral | SHOULDERS/TRAPS 1 | 0 | side delt |  |
| Lateral Raise - 'Spill the Can' (thumbs down, internally rotated) | lateral-raise-spill-the-can-thumbs-down-internally-rotated | R | intermediate | I | T2 | 2 | bilateral | SHOULDERS/TRAPS 1 | 0 | side delt |  |
| Rear-Delt DB Row | rear-delt-db-row | P | unrated | F | T2 | 2 | bilateral | SHOULDERS/TRAPS 1 | 2 | rear delt |  |
| Upward Face Pull (low-to-high / overhead finish) | upward-face-pull-low-to-high-overhead-finish | R | any | F | T3 | 3 | bilateral | SHOULDERS/TRAPS 1 | 0 | rear delt |  |

### BIC - BICEP (21)

| name | id | st | level | from | T | C | laterality | credit per set | uses | v1 notes | v1.1 |
|---|---|---|---|---|---|---|---|---|---|---|---|
| Barbell Curl | barbell-curl | S | any | F | T3 | 2 | bilateral | BICEP 1 | 21 |  |  |
| Cable Curl (Zone 1 / Zone 2 / Zone 3 set-ups) | cable-curl-zone-1-zone-2-zone-3-set-ups | S | any | F | T3 | 3 | bilateral | BICEP 1 | 1 |  |  |
| Cross-Body Dumbbell Hammer Curl | cross-body-dumbbell-hammer-curl | S | any | F | T2 | 2 | alternating | BICEP 1 | 0 |  |  |
| Dumbbell Concentration Curl | dumbbell-concentration-curl | S | any | F | T2 | 3 | unilateral | BICEP 1 | 0 |  |  |
| Dumbbell Curl | dumbbell-curl | S | any | F | T2 | 2 | bilateral | BICEP 1 | 9 |  |  |
| Dumbbell Hammer Curl | dumbbell-hammer-curl | S | any | F | T2 | 2 | bilateral | BICEP 1 | 23 |  |  |
| EZ-Bar Curl | ez-bar-curl | S | any | F | T3 | 2 | bilateral | BICEP 1 | 15 |  |  |
| Incline Dumbbell Curl ('pinky facing up' supinated variation) | incline-dumbbell-curl-pinky-facing-up-supinated-variation | S | any | F | T2 | 3 | bilateral | BICEP 1 | 5 |  |  |
| Kettlebell Curl (one or two KBs) | kb-curl | N2 | any | F | T2 | 2 | bilateral | BICEP 1 | 0 |  | NEW R2-LIB-07 |
| Reverse-Grip (Pronated) EZ-Bar Curl | reverse-grip-pronated-ez-bar-curl | S | any | F | T3 | 2 | bilateral | BICEP 1 | 5 |  |  |
| Seated Dumbbell Curl | seated-dumbbell-curl | S | any | F | T2 | 3 | bilateral | BICEP 1 | 1 |  |  |
| Spider Curl (chest on incline bench) | spider-curl-chest-on-incline-bench | S | any | F | T2 | 4 | bilateral | BICEP 1 | 0 |  |  |
| Supine (Lying) Biceps Curl | supine-lying-biceps-curl | S | any | F | T2 | 3 | bilateral | BICEP 1 | 0 |  |  |
| Suspension-Trainer (TRX) Biceps Curl | suspension-trainer-trx-biceps-curl | S | any | F | T1 | 2 | bilateral | BICEP 1 | 0 |  |  |
| Zottman Curl (supinated up, pronated down) | zottman-curl-supinated-up-pronated-down | S | any | F | T2 | 2 | bilateral | BICEP 1 | 0 |  |  |
| Barbell Reverse Curl (pronated) | barbell-reverse-curl-pronated | R | any | F | T3 | 2 | bilateral | BICEP 1 | 1 |  |  |
| Biceps Curl - any kind | biceps-curl-any-kind | P | unrated | F | T2 | 2 | bilateral | BICEP 1 | 32 |  |  |
| DB 'No Money' Curl | db-no-money-curl | P | unrated | F | T2 | 2 | bilateral | BICEP 1 | 2 |  |  |
| DB Curl to Press | db-curl-to-press | P | unrated | F | T2 | 2 | bilateral | BICEP 1 | 5 |  |  |
| DB Pronated (Reverse) Curl | db-pronated-reverse-curl | R | any | F | T2 | 2 | bilateral | BICEP 1 | 0 |  |  |
| Single-Arm DB Preacher Curl | single-arm-db-preacher-curl | P | unrated | F | T2 | 3 | unilateral | BICEP 1 | 1 |  |  |

### TRI - TRICEP (15)

| name | id | st | level | from | T | C | laterality | credit per set | uses | v1 notes | v1.1 |
|---|---|---|---|---|---|---|---|---|---|---|---|
| Cable Triceps Push-down | cable-triceps-push-down | S | any | F | T3 | 3 | bilateral | TRICEP 1 | 21 |  |  |
| Cable Triceps Pushdown - straight bar, pronated grip | cable-triceps-pushdown-straight-bar-pronated-grip | S | any | F | T3 | 3 | bilateral | TRICEP 1 | 0 |  |  |
| Cable Triceps Pushdown - straight bar, supinated (reverse) grip | cable-triceps-pushdown-straight-bar-supinated-reverse-grip | S | any | F | T3 | 3 | bilateral | TRICEP 1 | 0 |  |  |
| Dumbbell Triceps Kickback (one or both arms) | dumbbell-triceps-kickback-one-or-both-arms | S | any | F | T2 | 2 | unilateral | TRICEP 1 | 8 |  |  |
| EZ-Bar Skullcrusher | ez-bar-skullcrusher | S | any | F | T3 | 3 | bilateral | TRICEP 1 | 0 |  |  |
| Floor Dumbbell Skullcrusher | floor-dumbbell-skullcrusher | S | any | F | T2 | 3 | bilateral | TRICEP 1 | 8 |  |  |
| Overhead Cable Triceps Extension | overhead-cable-triceps-extension | S | any | F | T3 | 3 | bilateral | TRICEP 1 | 15 |  |  |
| Overhead Dumbbell Triceps Extension | overhead-dumbbell-triceps-extension | S | any | F | T2 | 2 | bilateral | TRICEP 1 | 8 |  |  |
| Tate Press | tate-press | S | any | F | T2 | 3 | bilateral | TRICEP 1 | 24 |  |  |
| Bench Dip | bench-dip | P | unrated | F | T0 | 3 | bilateral | TRICEP 1 | 2 |  |  |
| Cable Triceps Pushdown - V-Grip | cable-triceps-pushdown-v-grip | R | any | F | T3 | 3 | bilateral | TRICEP 1 | 0 |  |  |
| Face-Up Triceps Push-Away (supine; technique unconfirmed) | face-up-triceps-push-away-supine-technique-unconfirmed | R | any | F | T3 | 3 | bilateral | TRICEP 1 | 0 |  |  |
| JM Press | jm-press | P | unrated | F | T3 | 3 | bilateral | TRICEP 1 | 16 |  |  |
| Rope Triceps Push-down (neutral grip) | rope-triceps-push-down-neutral-grip | R | any | F | T3 | 3 | bilateral | TRICEP 1 | 5 |  |  |
| Triceps - any kind | triceps-any-kind | P | unrated | F | T3 | 3 | bilateral | TRICEP 1 | 11 |  |  |

### CALF - CALVES (8)

| name | id | st | level | from | T | C | laterality | credit per set | uses | v1 notes | v1.1 |
|---|---|---|---|---|---|---|---|---|---|---|---|
| Barbell Calf Raise | barbell-calf-raise | S | any | F | T3 | 2 | bilateral | CALVES 1 | 0 |  |  |
| Machine Calf Raise | machine-calf-raise | S | any | F | T3 | 5 | bilateral | CALVES 1 | 1 |  | spine: not counted (calf work, adversarial check) |
| Standing Calf Raise (bodyweight, from a deficit/step) | standing-calf-raise-bodyweight-from-a-deficit-step | S | any | F | T0 | 2 | bilateral | CALVES 1 | 1 |  | spine: not counted (calf work, adversarial check) |
| Standing DB Calf Raise (deficit optional) | standing-db-calf-raise-deficit-optional | S | any | F | T2 | 2 | bilateral | CALVES 1 | 26 |  | spine: not counted (calf work, adversarial check) |
| Calf Raise - any | calf-raise-any | P | unrated | F | T0 | 2 | bilateral | CALVES 1 | 6 |  |  |
| Seated / Bent-Knee Calf Raise (soleus; machine or DBs on the knees) | seated-bent-knee-calf-raise-soleus | X2 | any | F | T2 | 3 | bilateral | CALVES 1 | 0 |  | PROPOSED-ADDITION |
| Single-Leg Deficit Calf Raise (weighted) | single-leg-deficit-calf-raise-weighted | P | unrated | F | T2 | 2 | unilateral | CALVES 1 | 1 |  | spine: not counted (calf work, adversarial check) |
| Tibialis Raise (back against a wall) | tibialis-raise-back-against-a-wall | X2 | any | F | T0 | 2 | bilateral | - | 0 |  | PROPOSED-ADDITION |

### NECK - NECK (PROPOSED v1.1) (2)

| name | id | st | level | from | T | C | laterality | credit per set | uses | v1 notes | v1.1 |
|---|---|---|---|---|---|---|---|---|---|---|---|
| Neck Isometric Holds (4-way: front, back, both sides; hand or partner resistance) | neck-isometric-holds-4-way | X2 | foundational | F | T0 | 2 | n/a | - | 0 |  | PROPOSED-ADDITION |
| Plate Neck Flexion / Extension (lying on a bench, plate on a towel) | plate-neck-flexion-extension-lying-on-a-bench | X2 | intermediate | I | T2 | 3 | bilateral | - | 0 |  | PROPOSED-ADDITION |

### CT - CORE THORAX (30)

| name | id | st | level | from | T | C | laterality | credit per set | uses | v1 notes | v1.1 |
|---|---|---|---|---|---|---|---|---|---|---|---|
| Cable Oblique Rotation (cable rotational twist) | cable-oblique-rotation-cable-rotational-twist | S | advanced | A | T3 | 3 | unilateral | CORE 1 | 11 |  |  |
| Cable Woodchopper (cable chop) | cable-woodchopper-cable-chop | S | advanced | A | T2 | 3 | unilateral | CORE 1 | 3 |  |  |
| Crunch | crunch | S | foundational | F | T0 | 3 | bilateral | CORE 1 | 3 |  |  |
| Plank (forearm / low plank) | plank-forearm-low-plank | S | foundational | F | T0 | 3 | bilateral | CORE 1 | 6 |  |  |
| Russian Twist | russian-twist | S | advanced | A | T0 | 2 | alternating | CORE 1 | 1 |  |  |
| Side Plank (elbow) | side-plank-elbow | S | intermediate | I | T0 | 2 | unilateral | CORE 1 | 11 |  |  |
| Sit-Up | sit-up | S | foundational | F | T0 | 3 | bilateral | CORE 1 | 6 |  |  |
| Weighted Decline Sit-Up | weighted-decline-sit-up | S | any | F | T2 | 4 | bilateral | CORE 1 | 0 |  |  |
| Weighted Russian Twist | weighted-russian-twist | S | any | F | T2 | 2 | alternating | CORE 1 | 11 |  |  |
| Weighted Sit-Up | weighted-sit-up | S | foundational | F | T2 | 3 | bilateral | CORE 1 | 1 |  |  |
| Bench Pallof Plank (plank on a bench with cable anti-rotation) | bench-pallof-plank-plank-on-a-bench-with-cable-band-anti-rotation | R | intermediate | I | T3 | 4 | unilateral | CORE 1 | 0 | renamed |  |
| Bicycle Crunch | bicycle-crunch | P | unrated | F | T0 | 3 | bilateral | CORE 1 | 5 |  |  |
| Butterfly Sit-up | butterfly-sit-up | P | unrated | F | T0 | 3 | bilateral | CORE 1 | 2 |  |  |
| Crunch Hold (isometric) | crunch-hold-isometric | R | foundational | F | T0 | 3 | bilateral | CORE 1 | 0 |  |  |
| KB Book Opener | kb-book-opener | P | unrated | F | T2 | 3 | bilateral | CORE 1 | 3 |  |  |
| Kettlebell Rotational Swings (no hip thrust - trunk-driven) | kettlebell-rotational-swings-no-hip-thrust-trunk-driven | R | intermediate | I | T2 | 2 | bilateral | CORE 1 | 0 |  | R2-VOL-05: ballistic, 0 sets; ballistic |
| Landmine Rotations - standing or kneeling | landmine-rotations-standing-or-kneeling | R | intermediate | I | T3 | 2 | bilateral | CORE 1 | 0 |  |  |
| Lateral Crunch | lateral-crunch | P | unrated | F | T0 | 3 | bilateral | CORE 1 | 1 |  |  |
| Medball Ab Rollouts (hands on medball) | medball-ab-rollouts-hands-on-medball | R | intermediate | I | T2 | 3 | bilateral | CORE 1 | 1 |  |  |
| Medball Plank Rockers | medball-plank-rockers | R | intermediate | I | T2 | 3 | bilateral | CORE 1 | 7 |  |  |
| Medball Rotational Throw - initiated from the hands (thorax-led) | medball-rotational-throw-initiated-from-the-hands-thorax-led | R | intermediate | I | T2 | 3 | unilateral | CORE 1 | 0 |  | ballistic |
| Offset Planks (asymmetric support or load) | offset-planks-asymmetric-support-or-load | R | intermediate | I | T0 | 3 | unilateral | CORE 1 | 0 |  |  |
| Pallof Hold (isometric) | pallof-hold-isometric | R | foundational | F | T3 | 3 | unilateral | CORE 1 | 0 |  |  |
| Pallof Press | pallof-press | R | foundational | F | T3 | 3 | unilateral | CORE 1 | 0 |  |  |
| Plank DB Pull-Through | plank-db-pull-through | P | unrated | F | T2 | 3 | bilateral | CORE 1 | 1 |  |  |
| Plank Shoulder Taps | plank-shoulder-taps | R | foundational | F | T0 | 3 | alternating | CORE 1 | 3 |  |  |
| Plank to Side Plank (rotating) | plank-to-side-plank-rotating | R | intermediate | I | T0 | 3 | alternating | CORE 1 | 0 |  |  |
| Single-Side (Suitcase) Carry | single-side-suitcase-carry | R | foundational | F | T2 | 2 | unilateral | CORE 1 | 3 |  |  |
| Swiss Ball Plate Torso Rotations | swiss-ball-plate-torso-rotations | R | intermediate | I | T2 | 3 | bilateral | CORE 1 | 3 |  |  |
| Up-Down Planks (forearm <-> hand plank) | up-down-planks-forearm-hand-plank | R | foundational | F | T0 | 3 | alternating | CORE 1 | 2 |  |  |

### CP - CORE PELVIS (26)

| name | id | st | level | from | T | C | laterality | credit per set | uses | v1 notes | v1.1 |
|---|---|---|---|---|---|---|---|---|---|---|---|
| Copenhagen Plank | copenhagen-plank | S | intermediate | I | T0 | 2 | unilateral | CORE 1 | 8 |  |  |
| Hanging Rotational Knee/Leg Raise | hanging-rotational-knee-leg-raise | S | foundational | F | T1 | 2 | alternating | CORE 1 | 0 |  |  |
| Hanging Rotational Knees-to-Chest (hanging oblique knee raise) | hanging-rotational-knees-to-chest-hanging-oblique-knee-raise | S | advanced | A | T1 | 2 | alternating | CORE 1 | 4 |  |  |
| Knees to Chest (hanging) | knees-to-chest-hanging | S | foundational | F | T1 | 2 | bilateral | CORE 1 | 3 |  |  |
| Leg Raise (lying / supine) | leg-raise-lying-supine | S | foundational | F | T0 | 3 | bilateral | CORE 1 | 2 |  |  |
| Reverse Crunch | reverse-crunch | S | foundational | F | T0 | 3 | bilateral | CORE 1 | 2 |  |  |
| Toes to Bar (hanging) | toes-to-bar-hanging | S | foundational | F | T1 | 2 | bilateral | CORE 1 | 23 |  |  |
| Copenhagen Raise (dynamic) | copenhagen-raise-dynamic | P | unrated | F | T0 | 3 | bilateral | CORE 1 | 1 |  |  |
| Flutter Kicks | flutter-kicks | R | foundational | F | T0 | 3 | alternating | CORE 1 | 1 |  |  |
| Glute Bridge March | glute-bridge-march | R | foundational | F | T0 | 3 | alternating | CORE 1 | 2 |  |  |
| Hip Raises ('hips raises') | hip-raises-hips-raises | P | unrated | F | T0 | 3 | bilateral | CORE 1 | 1 |  |  |
| Hip Turns (pelvis rotations) | hip-turns-pelvis-rotations | R | foundational | F | T0 | 3 | alternating | CORE 1 | 9 |  |  |
| March (anti-rotation marching) | march-anti-rotation-marching | R | foundational | F | T0 | 3 | alternating | CORE 1 | 0 |  |  |
| Medball Hanging Cross Toes to Bar (diagonal, ball between feet) | medball-hanging-cross-toes-to-bar-diagonal-ball-between-feet | R | advanced | A | T2 | 2 | bilateral | CORE 1 | 0 |  |  |
| Medball Hanging Knees to Chest (ball between knees/feet) | medball-hanging-knees-to-chest-ball-between-knees-feet | R | intermediate | I | T2 | 2 | bilateral | CORE 1 | 0 |  |  |
| Medball Hanging Toes to Bar (ball between feet) | medball-hanging-toes-to-bar-ball-between-feet | R | advanced | A | T2 | 2 | bilateral | CORE 1 | 0 |  |  |
| Medball Rotational Throw - initiated from the feet (pelvis-led) | medball-rotational-throw-initiated-from-the-feet-pelvis-led | R | intermediate | I | T2 | 3 | unilateral | CORE 1 | 0 |  | ballistic |
| Medball V-Up Switches (pass the ball hands <-> feet) | medball-v-up-switches-pass-the-ball-hands-feet | R | intermediate | I | T2 | 3 | bilateral | CORE 1 | 0 |  |  |
| Medball V-Ups | medball-v-ups | R | intermediate | I | T2 | 3 | bilateral | CORE 1 | 0 |  |  |
| Mountain Climber | mountain-climber | P | unrated | F | T0 | 3 | bilateral | CORE 1 | 2 |  |  |
| Plank with Alternating Feet Raises | plank-with-alternating-feet-raises | R | foundational | F | T0 | 3 | alternating | CORE 1 | 0 |  |  |
| Single-Leg Balance Reach (front / side / back) | single-leg-balance-reach-front-side-back | X2 | foundational | F | T0 | 2 | unilateral | CORE 1 | 0 |  | PROPOSED-ADDITION |
| Single-Leg Toes to Bar | single-leg-toes-to-bar | R | advanced | A | T1 | 3 | alternating | CORE 1 | 0 |  |  |
| Slider Runners (mountain-climber style) | slider-runners-mountain-climber-style | P | unrated | F | T0 | 3 | alternating | CORE 1 | 1 |  |  |
| Swiss Ball Knee Tuck | swiss-ball-knee-tuck | P | unrated | F | T2 | 3 | bilateral | CORE 1 | 2 |  |  |
| Windshield Wipers | windshield-wipers | R | intermediate | I | T0 | 3 | alternating | CORE 1 | 8 |  |  |

### CB - CORE (THORAX + PELVIS 'BOTH') (25)

| name | id | st | level | from | T | C | laterality | credit per set | uses | v1 notes | v1.1 |
|---|---|---|---|---|---|---|---|---|---|---|---|
| V-Up | v-up | S | foundational | F | T0 | 2 | bilateral | CORE 1 | 0 |  |  |
| Bear Crawl | bear-crawl | R | foundational | F | T0 | 3 | alternating | CORE 1 | 1 |  |  |
| Bird Dogs | bird-dogs | R | foundational | F | T0 | 3 | alternating | CORE 1 | 0 |  |  |
| Break Dancers (bear/crab-position thread-through rotations) | break-dancers-bear-crab-position-thread-through-rotations | R | intermediate | I | T0 | 3 | alternating | CORE 1 | 0 |  |  |
| Cross Connect (rolls / rocking / hold) | cross-connect-rolls-rocking-hold | R | foundational | F | T0 | 3 | alternating | CORE 1 | 0 |  |  |
| Cross-Body Mountain Climber | cross-body-mountain-climber | P | unrated | F | T0 | 3 | bilateral | CORE 1 | 5 |  |  |
| Dead Bugs | dead-bugs | R | foundational | F | T0 | 3 | alternating | CORE 1 | 3 |  |  |
| Elbow Oblique Sit (side-lying oblique hold on the elbow) | elbow-oblique-sit-side-lying-oblique-hold-on-the-elbow | R | intermediate | I | T0 | 3 | unilateral | CORE 1 | 6 |  |  |
| High (Straight-Arm) Side Plank | high-straight-arm-side-plank | R | intermediate | I | T0 | 3 | unilateral | CORE 1 | 0 |  |  |
| High Plank (straight-arm plank) | high-plank-straight-arm-plank | R | foundational | F | T0 | 3 | bilateral | CORE 1 | 0 |  |  |
| Hollow Rocks | hollow-rocks | P | unrated | F | T0 | 3 | bilateral | CORE 1 | 4 |  |  |
| Kettlebell Windmills - kneeling or standing | kettlebell-windmills-kneeling-or-standing | R | advanced | A | T2 | 2 | unilateral | CORE 1 | 0 |  |  |
| L-Sit Hold | l-sit-hold | R | advanced | A | T0 | 3 | bilateral | CORE 1 | 0 |  |  |
| Plank Supermans (held) | plank-supermans-held | R | intermediate | I | T0 | 3 | alternating | CORE 1 | 0 |  |  |
| Side Plank Hip Lifts (slow) | side-plank-hip-lifts-slow | P | unrated | F | T0 | 3 | bilateral | CORE 1 | 1 |  |  |
| Side Plank Knee-to-Elbow | side-plank-knee-to-elbow | P | unrated | F | T0 | 3 | bilateral | CORE 1 | 1 |  |  |
| Side Plank Press (advanced: star side plank press) | side-plank-press-advanced-star-side-plank-press | P | unrated | F | T2 | 3 | bilateral | CORE 1 | 1 |  |  |
| Single-Arm / Single-Leg Turkish Sit-up | single-arm-single-leg-turkish-sit-up | P | unrated | F | T0 | 2 | unilateral | CORE 1 | 1 |  |  |
| Star Side Plank | star-side-plank | P | unrated | F | T0 | 3 | bilateral | CORE 1 | 5 |  |  |
| Star Supine Cross Connect | star-supine-cross-connect | P | unrated | F | T0 | 3 | bilateral | CORE 1 | 5 |  |  |
| Star Toe Touches | star-toe-touches | P | unrated | F | T0 | 3 | bilateral | CORE 1 | 1 |  |  |
| Star V-Ups (cross-body / diagonal V-ups) | star-v-ups-cross-body-diagonal-v-ups | R | advanced | A | T0 | 3 | alternating | CORE 1 | 1 |  |  |
| Streamline Hold (hollow body, arms locked overhead) | streamline-hold-hollow-body-arms-overhead | X2 | intermediate | I | T0 | 3 | bilateral | CORE 1 | 0 |  | PROPOSED-ADDITION |
| Supermans | supermans | R | foundational | F | T0 | 3 | bilateral | CORE 1 | 0 |  |  |
| Turkish Get-Ups | turkish-get-ups | R | advanced | A | T2 | 2 | unilateral | CORE 1 | 0 |  |  |

### CORE - CORE (2)

| name | id | st | level | from | T | C | laterality | credit per set | uses | v1 notes | v1.1 |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 'Plate core' (plate-loaded core drill, not specified) | plate-core-plate-loaded-core-drill-not-specified | P | unrated | F | T2 | 3 | bilateral | CORE 1 | 2 |  |  |
| Core - coach's choice (unspecified) | core-coach-s-choice-unspecified | P | unrated | F | T0 | 3 | bilateral | CORE 1 | 32 |  |  |

### PLYO - PLYOS (83)

| name | id | st | level | from | T | C | laterality | credit per set | uses | v1 notes | v1.1 |
|---|---|---|---|---|---|---|---|---|---|---|---|
| Alternating Single-Leg Plate Hops (Hop Off Bilateral) | alternating-single-leg-plate-hops-hop-off-bilateral | S | intermediate | I | T0 | 1 | alternating | - | 0 |  | plyometric; stage 3; 60+ off by default |
| Ankle Hops (bilateral, in place) | ankle-hops-bilateral-in-place | S | foundational | F | T0 | 1 | bilateral | - | 17 |  | plyometric; stage 3; 60+ off by default |
| Bilateral Forward Hurdle Hops | bilateral-forward-hurdle-hops | S | intermediate | I | T1 | 1 | bilateral | - | 0 |  | plyometric; stage 3; 60+ off by default |
| Bilateral Forward Plate Hops | bilateral-forward-plate-hops | S | intermediate | I | T0 | 1 | bilateral | - | 1 |  | plyometric; stage 3; 60+ off by default |
| Bilateral Lateral Hurdle Hops | bilateral-lateral-hurdle-hops | S | intermediate | I | T1 | 1 | bilateral | - | 3 |  | plyometric; stage 3; 60+ off by default |
| Bilateral Lateral Plate Hops (Forward On / Sideways Off-and-On / Forward Down, Repeat) | bilateral-lateral-plate-hops-forward-on-sideways-off-and-on-forward-down-repeat | S | intermediate | I | T0 | 1 | bilateral | - | 0 |  | plyometric; stage 3; 60+ off by default |
| Bilateral Right-Angle Hurdle Hops (Forward-Lateral-Forward-Lateral) | bilateral-right-angle-hurdle-hops-forward-lateral-forward-lateral | S | intermediate | I | T1 | 1 | bilateral | - | 0 |  | plyometric; stage 3; 60+ off by default |
| Bounding | bounding | S | advanced | A | T0 | 1 | alternating | - | 2 |  | plyometric; stage 3; 60+ off by default |
| Bulgarian (Rear-Foot-Elevated) Split Jumps | bulgarian-rear-foot-elevated-split-jumps | S | advanced | A | T0 | 1 | unilateral | - | 0 |  | plyometric; stage 3; 60+ off by default |
| DB Ankle Hops | db-ankle-hops | S | advanced | A | T2 | 1 | bilateral | - | 10 |  | plyometric; stage 3; 60+ off by default |
| DB Depth Drop, Release DBs, Jump | db-depth-drop-release-dbs-jump | S | advanced | A | T2 | 1 | bilateral | - | 3 |  | plyometric; stage 2; 60+ off by default |
| DB Repeated Squat Jumps | db-repeated-squat-jumps | S | advanced | A | T2 | 1 | bilateral | - | 4 |  | ballistic; stage 3; 60+ off by default |
| Depth Drop to Box Jump | depth-drop-to-box-jump | S | advanced | A | T0 | 1 | bilateral | - | 1 |  | plyometric; stage 2; 60+ off by default |
| Depth Jump | depth-jump | S | advanced | A | T0 | 1 | bilateral | - | 9 |  | plyometric; stage 2; 60+ off by default |
| Hex-Bar Jump Squat | hex-bar-jump-squat | P | foundational | F | T3 | 1 | bilateral | - | 7 | also TX pool: beginner Olympic option (ATH-10) | R2-LIB-07: library item; ballistic; stage 1; loaded jump; 60+ off by default |
| High Depth Drop (Above-Hip Height) | high-depth-drop-above-hip-height | S | advanced | A | T2 | 1 | bilateral | - | 0 | never for injured / high-volume (INFERRED from EQ-03, pending) | receive; stage 1; 60+ off by default |
| Hurdle Hops (tall hurdles, continuous quick-contact reps) | hurdle-hops | S | advanced | A | T1 | 1 | bilateral | - | 10 | renamed | plyometric; stage 3; 60+ off by default |
| Low Box Jump (Half-Shin Height) | low-box-jump-half-shin-height | S | foundational | F | T0 | 1 | bilateral | - | 0 |  | ballistic; stage 1; 60+ off by default |
| Low Depth Drop | low-depth-drop | S | foundational | F | T0 | 1 | bilateral | - | 0 |  | receive; stage 1; 60+ off by default |
| Low Depth Drop - Single-Leg or Weighted (second FOUNDATIONAL listing) | low-depth-drop-single-leg-or-weighted | S | foundational | F | T0 | 1 | either (single-leg, or bilateral holding DBs) | - | 0 |  | receive; stage 1; 60+ off by default |
| Medium Depth Drop | medium-depth-drop | S | foundational | F | T0 | 1 | bilateral | - | 1 |  | receive; stage 1; 60+ off by default |
| Mid Box Jump (Knee Height) | mid-box-jump-knee-height | S | foundational | F | T0 | 1 | bilateral | - | 0 |  | ballistic; stage 1; 60+ off by default |
| Plyometric Push-Ups | plyometric-push-ups | S | advanced | A | T0 | 1 | bilateral | - | 6 |  | plyometric; stage 3; 60+ off by default |
| Push-Up Box Jump | push-up-box-jump | S | intermediate | I | T0 | 1 | bilateral | - | 0 |  | ballistic; stage 1; 60+ off by default |
| Push-Up Stick the Landing (hands start on a box, land on the floor) | push-up-stick-the-landing | S | foundational | F | T0 | 1 | bilateral | - | 3 | renamed | receive; stage 1; 60+ off by default |
| Single-Leg Backward Zig-Zag Jumps | single-leg-backward-zig-zag-jumps | S | intermediate | I | T0 | 1 | unilateral | - | 0 |  | plyometric; stage 3; 60+ off by default |
| Single-Leg DB Depth Drop, Release DBs, Jump | single-leg-db-depth-drop-release-dbs-jump | S | advanced | A | T2 | 1 | unilateral | - | 0 |  | plyometric; stage 2; 60+ off by default |
| Single-Leg Depth Drop | single-leg-depth-drop | S | intermediate | I | T0 | 1 | unilateral | - | 4 |  | receive; stage 1; 60+ off by default |
| Single-Leg Depth Jump | single-leg-depth-jump | S | advanced | A | T0 | 1 | unilateral | - | 0 |  | plyometric; stage 2; 60+ off by default |
| Single-Leg Forward Hurdle Hops | single-leg-forward-hurdle-hops | S | intermediate | I | T1 | 1 | unilateral | - | 3 |  | plyometric; stage 3; 60+ off by default |
| Single-Leg Forward Zig-Zag Jumps | single-leg-forward-zig-zag-jumps | S | intermediate | I | T0 | 1 | unilateral | - | 0 |  | plyometric; stage 3; 60+ off by default |
| Single-Leg Lateral Hurdle Hops | single-leg-lateral-hurdle-hops | S | intermediate | I | T1 | 1 | unilateral | - | 0 |  | plyometric; stage 3; 60+ off by default |
| Single-Leg Lateral Plate Hops - Inner Leg (Alternating) | single-leg-lateral-plate-hops-inner-leg-alternating | S | intermediate | I | T0 | 1 | unilateral | - | 0 |  | plyometric; stage 3; 60+ off by default |
| Single-Leg Lateral Plate Hops - Inner/Outer Leg | single-leg-lateral-plate-hops-inner-outer-leg | S | intermediate | I | T0 | 1 | unilateral | - | 3 |  | plyometric; stage 3; 60+ off by default |
| Single-Leg Lateral Plate Hops - Outer Leg (Alternating) | single-leg-lateral-plate-hops-outer-leg-alternating | S | intermediate | I | T0 | 1 | unilateral | - | 0 |  | plyometric; stage 3; 60+ off by default |
| Single-Leg Plate Hops | single-leg-plate-hops | S | intermediate | I | T0 | 1 | unilateral | - | 5 |  | plyometric; stage 3; 60+ off by default |
| Single-Leg Squirrel Jumps | single-leg-squirrel-jumps | S | advanced | A | T0 | 1 | unilateral | - | 2 | speed step 1 | plyometric; stage 3; 60+ off by default |
| Squirrel Jumps | squirrel-jumps | S | advanced | A | T0 | 1 | bilateral | - | 3 | speed step 1 | plyometric; stage 3; 60+ off by default |
| Tuck Jumps | tuck-jumps | S | advanced | A | T0 | 1 | bilateral | - | 4 |  | plyometric; stage 3; 60+ off by default |
| Alternating Split-Stance Jumps (front foot on box) | alternating-split-stance-jumps-front-foot-on-box | P | unrated | F | T0 | 1 | alternating | - | 1 |  | plyometric; stage 3; 60+ off by default |
| Bilateral Backward Hops | bilateral-backward-hops | R | any | F | T0 | 1 | bilateral | - | 0 |  | plyometric; stage 3; 60+ off by default |
| Bilateral Forward Hops | bilateral-forward-hops | R | any | F | T0 | 1 | bilateral | - | 0 |  | plyometric; stage 3; 60+ off by default |
| Bilateral Hop On To (small-amplitude hop onto a plate/low box) | bilateral-hop-on-to-small-amplitude-hop-onto-a-plate-low-box | R | foundational | F | T0 | 1 | bilateral | - | 0 |  | ballistic; stage 1; 60+ off by default |
| Bilateral Jump On To (box jump, land softly on top) | bilateral-jump-on-to-box-jump-land-softly-on-top | R | foundational | F | T0 | 1 | bilateral | - | 7 |  | ballistic; stage 1; 60+ off by default |
| Bilateral Repeat Hops (continuous pogo hops) | bilateral-repeat-hops-continuous-pogo-hops | R | foundational | F | T0 | 1 | bilateral | - | 0 |  | plyometric; stage 3; 60+ off by default |
| Bilateral Repeat Jumps (continuous full-amplitude jumps) | bilateral-repeat-jumps-continuous-full-amplitude-jumps | R | intermediate | I | T0 | 1 | bilateral | - | 5 |  | plyometric; stage 3; 60+ off by default |
| Bilateral Weighted Drop, Release the Weight & Hop | bilateral-weighted-drop-release-the-weight-and-hop | R | advanced | A | T2 | 1 | bilateral | - | 0 |  | plyometric; stage 2; 60+ off by default |
| Broad Jump | broad-jump | R | intermediate | I | T0 | 1 | bilateral | - | 4 |  | ballistic; stage 1; 60+ off by default |
| DB Snap Down | db-snap-down | P | unrated | F | T2 | 1 | bilateral | - | 2 |  | receive; stage 1; 60+ off by default |
| DB Staggered-Stance Switch Jump | db-staggered-stance-switch-jump | P | unrated | F | T2 | 1 | alternating | - | 1 |  | ballistic; stage 3; 60+ off by default |
| Depth Drop (height not stated) | depth-drop-height-not-stated | R | intermediate | I | T0 | 1 | bilateral | - | 5 |  | receive; stage 1; 60+ off by default |
| Double Bounce - Bilateral (two quick pulses on landing, then go) | double-bounce-bilateral-two-quick-pulses-on-landing-then-go | R | intermediate | I | T0 | 1 | bilateral | - | 0 |  | plyometric; stage 3; 60+ off by default |
| Double Bounce - Unilateral | double-bounce-unilateral | R | advanced | A | T0 | 1 | unilateral | - | 0 |  | plyometric; stage 3; 60+ off by default |
| Drop & Double Bounce - Bilateral (step off box, land, two pulses) | drop-and-double-bounce-bilateral-step-off-box-land-two-pulses | R | advanced | A | T0 | 1 | bilateral | - | 0 |  | plyometric; stage 2; 60+ off by default |
| Drop & Double Bounce - Unilateral | drop-and-double-bounce-unilateral | R | advanced | A | T0 | 1 | unilateral | - | 0 |  | plyometric; stage 2; 60+ off by default |
| Drop (Bilateral) & Hop - depth drop into a quick small hop | drop-bilateral-and-hop-depth-drop-into-a-quick-small-hop | R | advanced | A | T0 | 1 | bilateral | - | 0 |  | plyometric; stage 2; 60+ off by default |
| Fake Medball Slam & Return (any way possible) - upper-body/trunk amortization drill | fake-medball-slam-and-return-any-way-possible-upper-body-trunk-amortization-dril | R | intermediate | I | T0 | 1 | bilateral | - | 0 |  | plyometric; stage 2; 60+ off by default |
| Fast Rhythmic Quarter Squats | fast-rhythmic-quarter-squats | P | unrated | F | T0 | 1 | bilateral | - | 1 |  | plyometric; stage 3; 60+ off by default |
| Front-Foot-Elevated Lunge Jumps (bodyweight) | front-foot-elevated-lunge-jumps-bodyweight | P | unrated | F | T0 | 1 | unilateral | - | 1 |  | plyometric; stage 3; 60+ off by default |
| Hurdle Hops into Box Jump | hurdle-hops-into-box-jump | P | unrated | F | T1 | 1 | bilateral | - | 2 |  | plyometric; stage 2; 60+ off by default |
| Lateral Box Step-up Jump | lateral-box-step-up-jump | P | unrated | F | T0 | 1 | unilateral | - | 1 |  | ballistic; stage 1; 60+ off by default |
| Medball Squat Jumps | medball-squat-jumps | R | intermediate | I | T2 | 1 | bilateral | - | 0 |  | ballistic; stage 1; 60+ off by default |
| RFE Lunge Jumps (suitcase DB) | rfe-lunge-jumps-suitcase-db | P | unrated | F | T2 | 1 | unilateral | - | 3 |  | ballistic; stage 3; 60+ off by default |
| Seated Box Jump (sit-to-jump onto box) | seated-box-jump-sit-to-jump-onto-box | P | unrated | F | T0 | 1 | bilateral | - | 4 |  | ballistic; stage 1; 60+ off by default |
| Single-Leg Box Jump | single-leg-box-jump | R | intermediate | I | T0 | 1 | unilateral | - | 3 |  | ballistic; stage 1; 60+ off by default |
| Single-Leg Broad Jump | single-leg-broad-jump | P | unrated | F | T0 | 1 | unilateral | - | 1 |  | ballistic; stage 1; 60+ off by default |
| Single-Leg Hops into Single-Leg Box Jump | single-leg-hops-into-single-leg-box-jump | P | unrated | F | T0 | 1 | unilateral | - | 2 |  | plyometric; stage 2; 60+ off by default |
| Single-Leg In-Place Hops | single-leg-in-place-hops | R | any | F | T0 | 1 | unilateral | - | 0 |  | plyometric; stage 3; 60+ off by default |
| Single-Leg to March Jumps | single-leg-to-march-jumps | P | unrated | F | T0 | 1 | unilateral | - | 5 |  | plyometric; stage 3; 60+ off by default |
| Skater Jumps (lateral bounds) | skater-jumps-lateral-bounds | P | unrated | F | T0 | 1 | alternating | - | 2 |  | plyometric; stage 3; 60+ off by default |
| Split-Stance Squat Jumps (lunge jumps) | split-stance-squat-jumps-lunge-jumps | P | unrated | F | T0 | 1 | alternating | - | 2 |  | plyometric; stage 3; 60+ off by default |
| Squat Jump (high, bodyweight or lightly loaded) | squat-jump-high-bodyweight-or-lightly-loaded | P | unrated | F | T0 | 1 | bilateral | - | 8 |  | ballistic; stage 1; 60+ off by default |
| Staggered-Stance Box Jump | staggered-stance-box-jump | P | unrated | F | T0 | 1 | bilateral | - | 4 |  | ballistic; stage 1; 60+ off by default |
| Stick the Landing - Bilateral (jump/drop and freeze the landing) | stick-the-landing-bilateral-jump-drop-and-freeze-the-landing | R | foundational | F | T0 | 1 | bilateral | - | 0 |  | receive; stage 1; 60+ off by default |
| Stick the Landing - Unilateral (single-leg landing, freeze) | stick-the-landing-unilateral-single-leg-landing-freeze | R | intermediate | I | T0 | 1 | unilateral | - | 1 |  | receive; stage 1; 60+ off by default |
| Streamline Squat Jump (arms locked overhead) | streamline-squat-jump-arms-overhead | X2 | intermediate | I | T0 | 1 | bilateral | - | 0 |  | PROPOSED-ADDITION; ballistic; stage 1; 60+ off by default |
| Unilateral Hop On To (single-leg hop onto a plate/low box) | unilateral-hop-on-to-single-leg-hop-onto-a-plate-low-box | R | intermediate | I | T0 | 1 | unilateral | - | 2 |  | ballistic; stage 1; 60+ off by default |
| Unilateral Repeat Hops (single-leg continuous pogo hops) | unilateral-repeat-hops-single-leg-continuous-pogo-hops | R | intermediate | I | T0 | 1 | unilateral | - | 0 |  | plyometric; stage 3; 60+ off by default |
| Unilateral Repeat Jumps (continuous single-leg jumps / bounds) | unilateral-repeat-jumps-continuous-single-leg-jumps-bounds | R | advanced | A | T0 | 1 | unilateral | - | 0 |  | plyometric; stage 3; 60+ off by default |
| Unilateral Weighted Drop, Release the Weight & Hop | unilateral-weighted-drop-release-the-weight-and-hop | R | advanced | A | T2 | 1 | unilateral | - | 0 |  | plyometric; stage 2; 60+ off by default |
| Weighted Depth Jump into High Box Jump | weighted-depth-jump-into-high-box-jump | P | unrated | F | T2 | 1 | bilateral | - | 1 |  | plyometric; stage 2; 60+ off by default |
| Weighted Stick the Landing - Bilateral (DBs/vest, freeze the landing) | weighted-stick-the-landing-bilateral-dbs-vest-freeze-the-landing | R | intermediate | I | T2 | 1 | bilateral | - | 10 |  | receive; stage 1; 60+ off by default |
| Weighted Stick the Landing - Unilateral | weighted-stick-the-landing-unilateral | R | advanced | A | T2 | 1 | unilateral | - | 1 |  | receive; stage 1; 60+ off by default |

### ANKLE - JUMPING ANKLE / LIMITED KNEE (13)

| name | id | st | level | from | T | C | laterality | credit per set | uses | v1 notes | v1.1 |
|---|---|---|---|---|---|---|---|---|---|---|---|
| Bilateral Backward Ankle Hops | bilateral-backward-ankle-hops | S | foundational | F | T0 | 1 | bilateral | - | 0 |  | plyometric; stage 3; 60+ off by default |
| Bilateral Forward/Backward Ankle Hops | bilateral-forward-backward-ankle-hops | S | foundational | F | T0 | 1 | bilateral | - | 0 |  | plyometric; stage 3; 60+ off by default |
| Bilateral Lateral Ankle Hops | bilateral-lateral-ankle-hops | S | foundational | F | T0 | 1 | bilateral | - | 0 |  | plyometric; stage 3; 60+ off by default |
| Bilateral Right-Angle Ankle Hops (Forward-Right-Forward-Left-Forward) | bilateral-right-angle-ankle-hops-forward-right-forward-left-forward | S | foundational | F | T0 | 1 | bilateral | - | 0 |  | plyometric; stage 3; 60+ off by default |
| Bilateral Zig-Zag Ankle Hops | bilateral-zig-zag-ankle-hops | S | foundational | F | T0 | 1 | bilateral | - | 0 |  | plyometric; stage 3; 60+ off by default |
| Single-Leg Ankle Hops | single-leg-ankle-hops | S | foundational | F | T0 | 1 | unilateral | - | 2 |  | plyometric; stage 3; 60+ off by default |
| Single-Leg Backward Ankle Hops | single-leg-backward-ankle-hops | S | foundational | F | T0 | 1 | unilateral | - | 0 |  | plyometric; stage 3; 60+ off by default |
| Single-Leg Forward/Backward Ankle Hops | single-leg-forward-backward-ankle-hops | S | foundational | F | T0 | 1 | unilateral | - | 3 |  | plyometric; stage 3; 60+ off by default |
| Single-Leg Lateral Ankle Hops | single-leg-lateral-ankle-hops | S | foundational | F | T0 | 1 | unilateral | - | 4 |  | plyometric; stage 3; 60+ off by default |
| Single-Leg Right-Angle Ankle Hops | single-leg-right-angle-ankle-hops | S | foundational | F | T0 | 1 | unilateral | - | 0 |  | plyometric; stage 3; 60+ off by default |
| Double-Unders (jump rope) | double-unders-jump-rope | P | unrated | F | T1 | 1 | bilateral | - | 19 |  | plyometric; stage 3; 60+ off by default |
| Jump Rope | jump-rope | P | unrated | F | T1 | 1 | bilateral | - | 1 |  | plyometric; stage 3; 60+ off by default |
| Quick-Feet Toe Taps on Step | quick-feet-toe-taps-on-step | P | unrated | F | T0 | 1 | bilateral | - | 1 |  | plyometric; stage 3; 60+ off by default |

### TX - TRIPLE EXTENSION (40)

| name | id | st | level | from | T | C | laterality | credit per set | uses | v1 notes | v1.1 |
|---|---|---|---|---|---|---|---|---|---|---|---|
| Bodyweight Squat to Calf Raise | bodyweight-squat-to-calf-raise | S | foundational | F | T0 | 1 | bilateral | - | 0 |  |  |
| Hang Clean (catch not stated) | hang-clean-of-1rm-catch-not-stated | P | foundational | F | T3 | 2 | bilateral | - | 12 | renamed | R2-LIB-07: library item; clean day; 60+ off by default; renamed (R2-GEN-06) |
| Hex Bar Squat to Calf Raise | hex-bar-squat-to-calf-raise | S | foundational | F | T3 | 2 | bilateral | - | 0 |  |  |
| High-Hang Clean Pull | high-hang-clean-pull | S | foundational | F | T3 | 2 | bilateral | - | 0 |  | clean day; 60+ off by default |
| High-Hang Snatch Pull | high-hang-snatch-pull | S | foundational | F | T3 | 2 | bilateral | - | 0 |  | snatch day; 60+ off by default |
| KB Squat Clean | kb-squat-clean | P | foundational | F | T2 | 2 | bilateral | - | 6 |  | R2-LIB-07: library item; clean day; 60+ off by default |
| Low-Hang Clean Pull | low-hang-clean-pull | S | intermediate | I | T3 | 2 | bilateral | - | 0 |  | clean day; 60+ off by default |
| Low-Hang Snatch Pull | low-hang-snatch-pull | S | intermediate | I | T3 | 2 | bilateral | - | 0 |  | snatch day; 60+ off by default |
| Lunge to High-Knee Reach | lunge-to-high-knee-reach | S | foundational | F | T0 | 1 | unilateral | - | 0 |  |  |
| Mid-Hang Clean Pull | mid-hang-clean-pull | S | foundational | F | T3 | 2 | bilateral | - | 0 |  | clean day; 60+ off by default |
| Mid-Hang Snatch Pull | mid-hang-snatch-pull | S | foundational | F | T3 | 2 | bilateral | - | 0 |  | snatch day; 60+ off by default |
| Power Clean | power-clean | S | intermediate | I | T3 | 2 | bilateral | - | 16 |  | clean day; 60+ off by default |
| Power Clean & Jerk | power-clean-and-jerk | S | intermediate | I | T3 | 2 | bilateral | - | 0 |  | clean day; 60+ off by default |
| Power Snatch | power-snatch | S | intermediate | I | T3 | 2 | bilateral | - | 16 |  | snatch day; 60+ off by default |
| Single-Arm DB Snatch | single-arm-db-snatch | P | foundational | F | T2 | 2 | unilateral | - | 3 |  | R2-LIB-07: library item; snatch day; 60+ off by default |
| Squat Clean | clean-squat-clean | S | advanced | A | T3 | 2 | bilateral | - | 4 | renamed | clean day; 60+ off by default |
| Squat Clean & Jerk | clean-and-jerk-full | S | advanced | A | T3 | 2 | bilateral | - | 0 | renamed | clean day; 60+ off by default |
| Squat Snatch | snatch-squat-snatch | S | advanced | A | T3 | 2 | bilateral | - | 1 | renamed | snatch day; 60+ off by default |
| Weighted Squat to Calf Raise (any implement) | weighted-squat-to-calf-raise | S | intermediate | I | T2 | 2 | bilateral | - | 0 | renamed |  |
| Clean Pull (start position not stated) | clean-pull-start-position-not-stated | P | unrated | F | T3 | 2 | bilateral | - | 4 |  | clean day; 60+ off by default |
| DB/KB High Pull | db-kb-high-pull | P | foundational | F | T2 | 2 | bilateral | - | 2 |  | snatch day; 60+ off by default |
| Hang Power Clean (hang height not stated) | hang-power-clean-hang-height-not-stated | P | foundational | F | T3 | 2 | bilateral | - | 2 |  | clean day; 60+ off by default |
| Hang Power Clean - from the High Hang (hip crease) | hang-power-clean-from-the-high-hang-hip-crease | R | foundational | F | T3 | 2 | bilateral | - | 0 | ATH-10 beginner option | clean day; 60+ off by default |
| Hang Power Clean - from the Low Hang (below the knee) | hang-power-clean-from-the-low-hang-below-the-knee | R | intermediate | I | T3 | 2 | bilateral | - | 1 |  | clean day; 60+ off by default |
| Hang Power Clean - from the Mid Hang (knee) | hang-power-clean-from-the-mid-hang-knee | R | foundational | F | T3 | 2 | bilateral | - | 0 | ATH-10 beginner option | clean day; 60+ off by default |
| Hang Power Snatch - from the High Hang | hang-power-snatch-from-the-high-hang | R | intermediate | I | T3 | 2 | bilateral | - | 0 |  | snatch day; 60+ off by default |
| Hang Power Snatch - from the Low Hang (below the knee) | hang-power-snatch-from-the-low-hang-below-the-knee | R | intermediate | I | T3 | 2 | bilateral | - | 0 |  | snatch day; 60+ off by default |
| Hang Power Snatch - from the Mid Hang (knee) | hang-power-snatch-from-the-mid-hang-knee | R | intermediate | I | T3 | 2 | bilateral | - | 0 |  | snatch day; 60+ off by default |
| Hang Snatch (catch not stated) | hang-snatch-of-1rm-catch-not-stated | P | unrated | F | T3 | 2 | bilateral | - | 12 | renamed | snatch day; 60+ off by default; renamed (R2-GEN-06, adversarial check) |
| Hang Squat Clean (full-depth catch from the hang) | hang-squat-clean-full-depth-catch-from-the-hang | R | advanced | A | T3 | 2 | bilateral | - | 0 |  | clean day; 60+ off by default |
| High-Hang Squat Snatch | high-hang-squat-snatch | R | advanced | A | T3 | 2 | bilateral | - | 0 |  | snatch day; 60+ off by default |
| Low-Hang Squat Clean (below the knee, full-depth catch) | low-hang-squat-clean-below-the-knee-full-depth-catch | R | advanced | A | T3 | 2 | bilateral | - | 0 |  | clean day; 60+ off by default |
| Low-Hang Squat Snatch | low-hang-squat-snatch | R | advanced | A | T3 | 2 | bilateral | - | 0 |  | snatch day; 60+ off by default |
| Overhead Box Squat (snatch-grip overhead squat to a box) | overhead-box-squat-snatch-grip-overhead-squat-to-a-box | R | advanced | A | T3 | 2 | bilateral | - | 0 | CAT-04: overhead = advanced | snatch day; 60+ off by default |
| Single-Arm DB Push / Split Jerk | single-arm-db-push-split-jerk | P | intermediate | I | T2 | 2 | unilateral | - | 1 |  | jerk (either day); 60+ off by default |
| Snatch Pull (start position not stated) | snatch-pull-start-position-not-stated | P | unrated | F | T3 | 2 | bilateral | - | 3 |  | snatch day; 60+ off by default |
| Split Jerk | split-jerk | R | advanced | A | T3 | 2 | bilateral | - | 0 |  | jerk (either day); 60+ off by default |
| Staggered-Stance DB Hang Snatch | staggered-stance-db-hang-snatch | P | foundational | F | T2 | 2 | unilateral | - | 3 |  | snatch day; 60+ off by default |
| Standing Drop Overhead Squat (drop snatch / snatch-balance type: drop from standing into an overhead squat) | standing-drop-overhead-squat-drop-snatch-snatch-balance-type-drop-from-standing- | R | advanced | A | T3 | 2 | bilateral | - | 0 |  | snatch day; 60+ off by default |
| Standing Drop Power Snatch (tall / no-dip power snatch - pull under from standing) | standing-drop-power-snatch-tall-no-dip-power-snatch-pull-under-from-standing | R | intermediate | I | T3 | 2 | bilateral | - | 0 |  | snatch day; 60+ off by default |

### THROW - THROWING (41)

| name | id | st | level | from | T | C | laterality | credit per set | uses | v1 notes | v1.1 |
|---|---|---|---|---|---|---|---|---|---|---|---|
| Medball Alternating Back-to-Wall Rotational Scoops | medball-alternating-back-to-wall-rotational-scoops | S | any | F | T2 | 2 | alternating | - | 2 |  | ballistic |
| Medball Chest Pass | medball-chest-pass | S | any | F | T2 | 1 | bilateral | - | 4 |  | ballistic |
| Medball Half-Kneeling Rotational Scoop - Left-Facing, Left Leg Up | medball-half-kneeling-rotational-scoop-left-facing-left-leg-up | S | any | F | T2 | 2 | bilateral | - | 2 |  | ballistic |
| Medball Half-Kneeling Rotational Scoop - Left-Facing, Right Leg Forward | medball-half-kneeling-rotational-scoop-left-facing-right-leg-forward | S | any | F | T2 | 2 | bilateral | - | 2 |  | ballistic |
| Medball Half-Kneeling Rotational Scoop - Right-Facing, Left Leg Up | medball-half-kneeling-rotational-scoop-right-facing-left-leg-up | S | any | F | T2 | 2 | bilateral | - | 2 |  | ballistic |
| Medball Half-Kneeling Rotational Scoop - Right-Facing, Right Leg Forward | medball-half-kneeling-rotational-scoop-right-facing-right-leg-forward | S | any | F | T2 | 2 | bilateral | - | 2 |  | ballistic |
| Medball Overhead Throw | medball-overhead-throw | S | any | F | T2 | 1 | bilateral | - | 8 |  | ballistic |
| Medball Rotational Downward Slam | medball-rotational-downward-slam | S | any | F | T2 | 1 | bilateral | - | 3 |  | ballistic |
| Medball Rotational Side-to-Side Floor Slams | medball-rotational-side-to-side-floor-slams | S | any | F | T2 | 1 | alternating | - | 2 |  | ballistic |
| Medball Sit-Up to Chest Pass | medball-sit-up-to-chest-pass | S | any | F | T2 | 3 | bilateral | - | 10 |  | ballistic |
| Medball Sit-Up to Overhead Throw | medball-sit-up-to-overhead-throw | S | any | F | T2 | 3 | bilateral | - | 4 |  | ballistic |
| Medball Squat to Chest Pass | medball-squat-to-chest-pass | S | any | F | T2 | 1 | bilateral | - | 0 |  | ballistic |
| Rotational Medball Chest Pass (R & L) | rotational-medball-chest-pass-r-and-l | S | any | F | T2 | 1 | bilateral | - | 13 |  | ballistic |
| Rotational Medball Scoop Toss (R & L) | rotational-medball-scoop-toss-r-and-l | S | any | F | T2 | 1 | bilateral | - | 18 |  | ballistic |
| Step-Forward Medball Chest Pass (R & L leg) | step-forward-medball-chest-pass-r-and-l-leg | S | any | F | T2 | 1 | bilateral | - | 6 |  | ballistic |
| Step-Forward Medball Overhead Throw (R & L leg) | step-forward-medball-overhead-throw-r-and-l-leg | S | any | F | T2 | 1 | bilateral | - | 2 |  | ballistic |
| Back Lunge with Contralateral Load into March, Contralateral Scoop | back-lunge-with-contralateral-load-into-march-contralateral-scoop | R | any | F | T2 | 1 | unilateral | - | 0 |  | ballistic |
| Bent-Over Medball Floor Slam | bent-over-medball-floor-slam | R | any | F | T2 | 1 | bilateral | - | 0 |  | ballistic |
| Front/Back Staggered-Stance Medball Cross Throw Down | front-back-staggered-stance-medball-cross-throw-down | R | any | F | T2 | 1 | unilateral | - | 0 |  | ballistic |
| Front/Back Staggered-Stance Medball Cross Throw Down & Back | front-back-staggered-stance-medball-cross-throw-down-and-back | R | any | F | T2 | 1 | unilateral | - | 0 |  | ballistic |
| Half-Kneeling Medball Rotation In & Step Out | half-kneeling-medball-rotation-in-and-step-out | P | any | F | T2 | 1 | bilateral | - | 2 |  | ballistic |
| Half-Kneeling Rotational Medball Slam | half-kneeling-rotational-medball-slam | P | any | F | T2 | 1 | bilateral | - | 2 |  | ballistic |
| Half-Kneeling Rotational Overhead Medball Side Slam | half-kneeling-rotational-overhead-medball-side-slam | P | any | F | T2 | 1 | bilateral | - | 3 |  | ballistic |
| In/Out-of-Hip Rotational Medball Scoop | in-out-of-hip-rotational-medball-scoop | P | any | F | T2 | 1 | bilateral | - | 3 |  | ballistic |
| Lateral Hinge to Medball Chest Pass | lateral-hinge-to-medball-chest-pass | P | any | F | T2 | 1 | bilateral | - | 1 |  | ballistic |
| Lateral Hinge to Medball Scoop | lateral-hinge-to-medball-scoop | P | any | F | T2 | 1 | bilateral | - | 1 |  | ballistic |
| Lateral Lunge to Medball Scoop | lateral-lunge-to-medball-scoop | P | any | F | T2 | 1 | bilateral | - | 1 |  | ballistic |
| Lateral V Throw Down | lateral-v-throw-down | R | any | F | T2 | 1 | alternating | - | 0 |  | ballistic |
| Lateral-Stance Floor Chop Throw | lateral-stance-floor-chop-throw | R | any | F | T2 | 1 | unilateral | - | 0 |  | ballistic |
| Medball Cheat-Sheet Throw List (*MEDBALLS) | medball-cheat-sheet-throw-list-medballs | P | any | F | T2 | 1 | bilateral | - | 6 |  | ballistic |
| Medball Floor Catch & Release Push | medball-floor-catch-and-release-push | P | any | F | T2 | 1 | bilateral | - | 1 |  | ballistic |
| Medball Overhead Toss to Rotational Scoop | medball-overhead-toss-to-rotational-scoop | P | any | F | T2 | 1 | bilateral | - | 2 |  | ballistic |
| Overhead Medball Slam | overhead-medball-slam | P | any | F | T2 | 1 | bilateral | - | 2 |  | ballistic |
| Reverse Lunge with Inside Floor Slam | reverse-lunge-with-inside-floor-slam | R | any | F | T2 | 1 | unilateral | - | 0 |  | ballistic |
| Rotational Overhead Medball Toss | rotational-overhead-medball-toss | P | any | F | T2 | 1 | bilateral | - | 1 |  | ballistic |
| Rotational Split-Stance Floor Slam | rotational-split-stance-floor-slam | R | any | F | T2 | 1 | unilateral | - | 0 |  | ballistic |
| Seated Back-to-Wall Rotational Medball Toss | seated-back-to-wall-rotational-medball-toss | P | any | F | T2 | 1 | bilateral | - | 2 |  | ballistic |
| Side-to-Side Shuffle Floor Slam (height matters) | side-to-side-shuffle-floor-slam-height-matters | R | any | F | T2 | 1 | alternating | - | 0 |  | ballistic |
| Step-Back to Rotational Medball Chest Pass | step-back-to-rotational-medball-chest-pass | P | any | F | T2 | 1 | bilateral | - | 2 |  | ballistic |
| Supine (Lay-Down) Medball Press Throw | supine-lay-down-medball-press-throw | P | any | F | T2 | 1 | bilateral | - | 2 |  | ballistic |
| Wall Ball (medball squat-to-target throw) | wall-ball-medball-squat-to-target | X2 | any | F | T2 | 1 | bilateral | - | 0 |  | PROPOSED-ADDITION; ballistic |

### COD - CHANGE OF DIRECTION (17)

| name | id | st | level | from | T | C | laterality | credit per set | uses | v1 notes | v1.1 |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 5-10-5 Pro-Agility Shuttle | 5-10-5-pro-agility-shuttle | S | advanced | A | T0 | 1 | n/a | - | 0 |  |  |
| Comeback / Curl Route | comeback-curl-route | S | advanced | A | T0 | 1 | n/a | - | 0 |  |  |
| Dig / Out Route | dig-out-route | S | intermediate | I | T0 | 1 | n/a | - | 1 |  |  |
| Fade Route | fade-route | S | foundational | F | T0 | 1 | n/a | - | 0 |  |  |
| Flat Route | flat-route | S | foundational | F | T0 | 1 | n/a | - | 0 |  |  |
| L-Test / L-Drill (3-Cone) | l-test-l-drill-3-cone-inferred-from-left-test | S | intermediate | I | T0 | 1 | n/a | - | 0 | renamed |  |
| Lateral Shuffles | lateral-shuffles | S | foundational | F | T0 | 1 | n/a | - | 0 |  |  |
| Post / Corner Route | post-corner-route | S | foundational | F | T0 | 1 | n/a | - | 0 |  |  |
| Slant Route | slant-route | S | foundational | F | T0 | 1 | n/a | - | 0 |  |  |
| Eight-Square Plyometric Formation (8-box hop grid) | eight-square-plyometric-formation-8-box-hop-grid | R | intermediate | I | T0 | 1 | n/a | - | 0 |  | plyometric; 60+ off by default |
| Four-Square Formation (4-box hop grid) | four-square-formation-4-box-hop-grid | R | foundational | F | T0 | 1 | n/a | - | 0 |  | plyometric; 60+ off by default |
| Hops in Place (foot-speed / reactive hops) | hops-in-place-foot-speed-reactive-hops | R | foundational | F | T0 | 1 | bilateral | - | 0 |  | plyometric; 60+ off by default |
| Krumrie Formation (agility drill pattern) | krumrie-formation-agility-drill-pattern | R | any | F | T0 | 1 | n/a | - | 0 |  |  |
| Munoz Formation (agility drill pattern) | munoz-formation-agility-drill-pattern | R | any | F | T0 | 1 | n/a | - | 0 |  |  |
| Route Tree (receiver route tree) | route-tree-receiver-route-tree | R | any | F | T0 | 1 | n/a | - | 0 |  |  |
| Running Routes (pre-planned route running) | running-routes-pre-planned-route-running | R | any | F | T0 | 1 | n/a | - | 0 |  |  |
| Split-Step Reaction Drill (split-step, then shuffle / crossover / drop-step on a cue) | split-step-reaction-drill | X2 | foundational | F | T0 | 1 | n/a | - | 0 |  | PROPOSED-ADDITION; plyometric; 60+ off by default (no-hop split-step is the 60+ default) |

### SPRINT - SPEED / SPRINT (speed session) (10)

| name | id | st | level | from | T | C | laterality | credit per set | uses | v1 notes | v1.1 |
|---|---|---|---|---|---|---|---|---|---|---|---|
| A-March (running drill) | a-march-running-drill | R | any | F | T0 | 1 | alternating | - | 10 | ADDED LIB-21; speed step 2; warm-up drill, never counted (ORD-08) |  |
| A-Runs (high-knee running drill) | a-runs-high-knee-running-drill | R | any | F | T0 | 1 | alternating | - | 10 | ADDED LIB-21; speed step 2; warm-up drill, never counted (ORD-08) |  |
| A-Skip (running drill) | a-skip-running-drill | R | any | F | T0 | 1 | alternating | - | 10 | ADDED LIB-21; speed step 2; warm-up drill, never counted (ORD-08) |  |
| Acceleration Starts | acceleration-starts | R | any | F | T0 | 1 | alternating | - | 6 | ADDED LIB-21; speed step 2 |  |
| Falling-Start Accelerations | falling-start-accelerations | R | any | F | T0 | 1 | alternating | - | 0 | ADDED LIB-21; speed step 2 |  |
| Mach Sprint Drills (A-March / A-Skip / A-Run) | mach-sprint-drills-a-march-a-skip-a-run | R | any | F | T0 | 1 | alternating | - | 0 | ADDED LIB-21; speed step 2; warm-up drill, never counted (ORD-08) |  |
| Max-Velocity Sprint (Top Speed) | max-velocity-sprint-top-speed | S | advanced | A | T0 | 1 | alternating | - | 0 | ADDED LIB-21; speed step 3 |  |
| Fast Run / Walk Back ('NOT a sprint') | fast-run-walk-back-not-a-sprint | P | unrated | F | T0 | 1 | alternating | - | 3 |  |  |
| High-Knee Runs | high-knee-runs | P | unrated | F | T0 | 1 | alternating | - | 2 |  |  |
| Short Fast Run / Sprint Buy-out (10-30 s) | short-fast-run-sprint-buy-out-10-30-s | P | unrated | F | T0 | 1 | alternating | - | 21 |  |  |

### WARMUP - DYNAMIC MEDBALL WARM-UP (35)

| name | id | st | level | from | T | C | laterality | credit per set | uses | v1 notes | v1.1 |
|---|---|---|---|---|---|---|---|---|---|---|---|
| Medball FFE Split Squat/Lunge with Medball Held Forward | medball-ffe-split-squat-lunge-with-medball-held-forward | R | any | F | T2 | 1 | unilateral | - | 0 |  |  |
| Medball FFE Split Squat/Lunge with Medball Hug | medball-ffe-split-squat-lunge-with-medball-hug | R | any | F | T2 | 1 | unilateral | - | 0 |  |  |
| Medball FFE Split Squat/Lunge with Medball Up | medball-ffe-split-squat-lunge-with-medball-up | R | any | F | T2 | 1 | unilateral | - | 0 |  |  |
| Medball FFE Split Squat/Lunge with Reach Down Over the Front Leg | medball-ffe-split-squat-lunge-with-reach-down-over-the-front-leg | R | any | F | T2 | 1 | unilateral | - | 0 |  |  |
| Medball Forward Lunge with Cross-Body Turn | medball-forward-lunge-with-cross-body-turn | R | any | F | T2 | 1 | alternating | - | 0 |  |  |
| Medball Forward Lunge with Down-and-Back Cross-Body Reach | medball-forward-lunge-with-down-and-back-cross-body-reach | R | any | F | T2 | 1 | alternating | - | 0 |  |  |
| Medball Forward Lunge with Forward Reach | medball-forward-lunge-with-forward-reach | R | any | F | T2 | 1 | alternating | - | 0 |  |  |
| Medball Forward Lunge with Medball Held Forward | medball-forward-lunge-with-medball-held-forward | R | any | F | T2 | 1 | unilateral | - | 0 |  |  |
| Medball Forward Lunge with Medball Hug | medball-forward-lunge-with-medball-hug | R | any | F | T2 | 1 | unilateral | - | 0 |  |  |
| Medball Forward Lunge with Medball Up | medball-forward-lunge-with-medball-up | R | any | F | T2 | 1 | unilateral | - | 0 |  |  |
| Medball Forward Lunge with Overhead Reach | medball-forward-lunge-with-overhead-reach | R | any | F | T2 | 1 | alternating | - | 0 |  |  |
| Medball Forward Lunge with Reach Down Over the Front Leg | medball-forward-lunge-with-reach-down-over-the-front-leg | R | any | F | T2 | 1 | unilateral | - | 0 |  |  |
| Medball Front-Hold Squat (ball held out in front) | medball-front-hold-squat-ball-held-out-in-front | R | any | F | T2 | 1 | bilateral | - | 0 |  |  |
| Medball Ground-to-Overhead | medball-ground-to-overhead | R | any | F | T2 | 1 | bilateral | - | 0 |  |  |
| Medball Hug Goblet Squat | medball-hug-goblet-squat | R | any | F | T2 | 1 | bilateral | - | 0 |  |  |
| Medball Lateral Cossack Lunge with Forward Reach | medball-lateral-cossack-lunge-with-forward-reach | R | any | F | T2 | 1 | alternating | - | 0 |  |  |
| Medball Lateral Cossack Lunge with Overhead Reach | medball-lateral-cossack-lunge-with-overhead-reach | R | any | F | T2 | 1 | alternating | - | 0 |  |  |
| Medball Reverse Lunge with Cross-Body Turn | medball-reverse-lunge-with-cross-body-turn | R | any | F | T2 | 1 | alternating | - | 0 |  |  |
| Medball Reverse Lunge with Down-and-Back Cross-Body Reach | medball-reverse-lunge-with-down-and-back-cross-body-reach | R | any | F | T2 | 1 | alternating | - | 0 |  |  |
| Medball Reverse Lunge with Forward Reach | medball-reverse-lunge-with-forward-reach | R | any | F | T2 | 1 | alternating | - | 0 |  |  |
| Medball Reverse Lunge with Medball Held Forward | medball-reverse-lunge-with-medball-held-forward | R | any | F | T2 | 1 | unilateral | - | 0 |  |  |
| Medball Reverse Lunge with Medball Hug | medball-reverse-lunge-with-medball-hug | R | any | F | T2 | 1 | unilateral | - | 0 |  |  |
| Medball Reverse Lunge with Medball Up | medball-reverse-lunge-with-medball-up | R | any | F | T2 | 1 | unilateral | - | 0 |  |  |
| Medball Reverse Lunge with Overhead Reach | medball-reverse-lunge-with-overhead-reach | R | any | F | T2 | 1 | alternating | - | 0 |  |  |
| Medball Reverse Lunge with Reach Down Over the Front Leg | medball-reverse-lunge-with-reach-down-over-the-front-leg | R | any | F | T2 | 1 | unilateral | - | 0 |  |  |
| Medball RFE Split Squat (Bulgarian) with Medball Held Forward | medball-rfe-split-squat-bulgarian-with-medball-held-forward | R | any | F | T2 | 1 | unilateral | - | 0 |  |  |
| Medball RFE Split Squat (Bulgarian) with Medball Hug | medball-rfe-split-squat-bulgarian-with-medball-hug | R | any | F | T2 | 1 | unilateral | - | 0 |  |  |
| Medball RFE Split Squat (Bulgarian) with Medball Up | medball-rfe-split-squat-bulgarian-with-medball-up | R | any | F | T2 | 1 | unilateral | - | 0 |  |  |
| Medball RFE Split Squat (Bulgarian) with Reach Down Over the Front Leg | medball-rfe-split-squat-bulgarian-with-reach-down-over-the-front-leg | R | any | F | T2 | 1 | unilateral | - | 0 |  |  |
| Medball Stationary Lunge (Split Squat) with Medball Held Forward | medball-stationary-lunge-split-squat-with-medball-held-forward | R | any | F | T2 | 1 | unilateral | - | 0 |  |  |
| Medball Stationary Lunge (Split Squat) with Medball Hug | medball-stationary-lunge-split-squat-with-medball-hug | R | any | F | T2 | 1 | unilateral | - | 0 |  |  |
| Medball Stationary Lunge (Split Squat) with Medball Up | medball-stationary-lunge-split-squat-with-medball-up | R | any | F | T2 | 1 | unilateral | - | 0 |  |  |
| Medball Stationary Lunge (Split Squat) with Reach Down Over the Front Leg | medball-stationary-lunge-split-squat-with-reach-down-over-the-front-leg | R | any | F | T2 | 1 | unilateral | - | 0 |  |  |
| Medball Toe Touch to Overhead Reach | medball-toe-touch-to-overhead-reach | R | any | F | T2 | 1 | bilateral | - | 0 |  |  |
| Medball Toe Touches | medball-toe-touches | R | any | F | T2 | 1 | bilateral | - | 0 |  |  |

### CARDIO - CARDIO (84)

Any tool (COACH-ANSWER EQ-14, applied by the second adversarial check): the 12 'Aerobic A (blue) / B (green) / C (orange)' records and the 16 'Lactate Clearance' records carry `modality_v1` (run, bike, rower, ski erg or any available tool; timed work / rest carries over directly; distance is kept and tracked), and the 12 aerobic records now list treadmill and erg set-ups beside open space (tier T0 unchanged).

| name | id | st | level | from | T | C | laterality | credit per set | uses | v1 notes | v1.1 |
|---|---|---|---|---|---|---|---|---|---|---|---|
| Calorie Effort: 10 cal (bike / rower / ski) | calorie-effort-10-cal-bike-rower-ski | S | any | F | T3 | 5 | n/a | - | 0 |  |  |
| Calorie Effort: 15 cal (bike / rower / ski) | calorie-effort-15-cal-bike-rower-ski | S | any | F | T3 | 5 | n/a | - | 0 |  |  |
| Calorie Effort: 20 cal (bike / rower / ski) | calorie-effort-20-cal-bike-rower-ski | S | any | F | T3 | 5 | n/a | - | 0 |  |  |
| Calorie Effort: 25 cal (bike / rower / ski) | calorie-effort-25-cal-bike-rower-ski | S | any | F | T3 | 5 | n/a | - | 0 |  |  |
| Calorie Effort: 30 cal (bike / rower / ski) | calorie-effort-30-cal-bike-rower-ski | S | any | F | T3 | 5 | n/a | - | 0 |  |  |
| Calorie Effort: 35 cal (bike / rower / ski) | calorie-effort-35-cal-bike-rower-ski | S | any | F | T3 | 5 | n/a | - | 0 |  |  |
| Calorie Effort: 40 cal (bike / rower / ski) | calorie-effort-40-cal-bike-rower-ski | S | any | F | T3 | 5 | n/a | - | 0 |  |  |
| Calorie Effort: 45 cal (bike / rower / ski) | calorie-effort-45-cal-bike-rower-ski | S | any | F | T3 | 5 | n/a | - | 0 |  |  |
| Calorie Effort: 50 cal (bike / rower / ski) | calorie-effort-50-cal-bike-rower-ski | S | any | F | T3 | 5 | n/a | - | 0 |  |  |
| Distance Intervals: 1 mile Run / 1 min Walk | distance-intervals-1-mile-run-1-min-walk | S | any | F | T0 | 1 | n/a | - | 0 |  |  |
| Distance Intervals: 2 mile Run / 2 min Walk | distance-intervals-2-mile-run-2-min-walk | S | any | F | T0 | 1 | n/a | - | 0 |  |  |
| Distance Intervals: 3 mile Run / 3 min Walk | distance-intervals-3-mile-run-3-min-walk | S | any | F | T0 | 1 | n/a | - | 0 |  |  |
| Distance Repeat: 1000 m | distance-repeat-1000-m | S | any | F | T0 | 1 | n/a | - | 0 |  |  |
| Distance Repeat: 200 m | distance-repeat-200-m | S | any | F | T0 | 1 | n/a | - | 0 |  |  |
| Distance Repeat: 400 m | distance-repeat-400-m | S | any | F | T0 | 1 | n/a | - | 0 |  |  |
| Distance Repeat: 600 m | distance-repeat-600-m | S | any | F | T0 | 1 | n/a | - | 0 |  |  |
| Distance Repeat: 800 m | distance-repeat-800-m | S | any | F | T0 | 1 | n/a | - | 0 |  |  |
| Distance Test: 1 mile Run | distance-test-1-mile-run | S | any | F | T0 | 1 | n/a | - | 0 |  |  |
| Distance Test: 11 mile Run | distance-test-11-mile-run | S | any | F | T0 | 1 | n/a | - | 0 |  |  |
| Distance Test: 14 mile Run | distance-test-14-mile-run | S | any | F | T0 | 1 | n/a | - | 0 |  |  |
| Distance Test: 17 mile Run | distance-test-17-mile-run | S | any | F | T0 | 1 | n/a | - | 0 |  |  |
| Distance Test: 20 mile Run | distance-test-20-mile-run | S | any | F | T0 | 1 | n/a | - | 0 |  |  |
| Distance Test: 3 mile Run | distance-test-3-mile-run | S | any | F | T0 | 1 | n/a | - | 0 |  |  |
| Distance Test: 5 mile Run | distance-test-5-mile-run | S | any | F | T0 | 1 | n/a | - | 0 |  |  |
| Distance Test: 8 mile Run | distance-test-8-mile-run | S | any | F | T0 | 1 | n/a | - | 0 |  |  |
| Run Intervals: 2 min Fast / 1 min Walk | run-intervals-2-min-fast-1-min-walk | S | any | F | T0 | 1 | n/a | - | 0 |  |  |
| Run Intervals: 3 min Fast / 2 min Walk | run-intervals-3-min-fast-2-min-walk | S | any | F | T0 | 1 | n/a | - | 0 |  |  |
| Run Intervals: 4 min Fast / 3 min Walk | run-intervals-4-min-fast-3-min-walk | S | any | F | T0 | 1 | n/a | - | 0 |  |  |
| Run Intervals: 5 min Fast / 2 min Walk | run-intervals-5-min-fast-2-min-walk | S | any | F | T0 | 1 | n/a | - | 0 |  |  |
| Run Intervals: 6 min Fast / 1 min Walk | run-intervals-6-min-fast-1-min-walk | S | any | F | T0 | 1 | n/a | - | 0 |  |  |
| Speed-Endurance Test: 1 Mile for Time | speed-endurance-test-1-mile-for-time | S | any | F | T0 | 1 | n/a | - | 0 |  |  |
| Speed-Endurance Test: 3 Miles for Time | speed-endurance-test-3-miles-for-time | S | any | F | T0 | 1 | n/a | - | 0 |  |  |
| Speed-Endurance Test: 800 m (Half Mile) for Time | speed-endurance-test-800-m-half-mile-for-time | S | any | F | T0 | 1 | n/a | - | 0 |  |  |
| 20 s Fast / 40 s Slow Intervals (any cardio) | 20-s-fast-40-s-slow-intervals-any-cardio | P | unrated | F | T0 | 1 | n/a | - | 2 |  |  |
| Aerobic A (blue): 10X10m Sprints | aerobic-a-blue-10x10m-sprints | R | foundational | F | T0 | 1 | n/a | - | 0 |  |  |
| Aerobic A (blue): 15 Sec Run/ 45 Sec Walk | aerobic-a-blue-15-sec-run-45-sec-walk | R | foundational | F | T0 | 1 | n/a | - | 0 |  |  |
| Aerobic A (blue): 20 Sec Run/ 40 Sec Walk | aerobic-a-blue-20-sec-run-40-sec-walk | R | foundational | F | T0 | 1 | n/a | - | 0 |  |  |
| Aerobic A (blue): 30 Sec Run/ 30 Sec Walk | aerobic-a-blue-30-sec-run-30-sec-walk | R | intermediate | I | T0 | 1 | n/a | - | 0 |  |  |
| Aerobic A (blue): 40 Sec Run/ 20 Sec Walk | aerobic-a-blue-40-sec-run-20-sec-walk | R | intermediate | I | T0 | 1 | n/a | - | 0 |  |  |
| Aerobic B (green): 1 Minute run/ 3 Min Walk | aerobic-b-green-1-minute-run-3-min-walk | R | foundational | F | T0 | 1 | n/a | - | 0 |  |  |
| Aerobic B (green): 2 Minute run/ 4 Min Walk | aerobic-b-green-2-minute-run-4-min-walk | R | foundational | F | T0 | 1 | n/a | - | 0 |  |  |
| Aerobic B (green): 3 Minute Run/ 3 Min Walk | aerobic-b-green-3-minute-run-3-min-walk | R | foundational | F | T0 | 1 | n/a | - | 0 |  |  |
| Aerobic C (orange): 11 Minute Run/ 2 Min Walk | aerobic-c-orange-11-minute-run-2-min-walk | R | foundational | F | T0 | 1 | n/a | - | 0 |  |  |
| Aerobic C (orange): 2 Mile Run | aerobic-c-orange-2-mile-run | R | foundational | F | T0 | 1 | n/a | - | 0 |  |  |
| Aerobic C (orange): 5 Minute Run/ :30 Sec Walk | aerobic-c-orange-5-minute-run-30-sec-walk | R | foundational | F | T0 | 1 | n/a | - | 0 |  |  |
| Aerobic C (orange): 8 Minute Run/ 1 Minute Walk | aerobic-c-orange-8-minute-run-1-minute-walk | R | foundational | F | T0 | 1 | n/a | - | 0 |  |  |
| Any Cardio Equipment - 5 min warm-up | any-cardio-equipment-5-min-warm-up | P | unrated | F | T0 | 1 | n/a | - | 15 |  |  |
| Bike Calorie Sprint (assault/air bike) | bike-calorie-sprint-assault-air-bike | P | unrated | F | T3 | 5 | n/a | - | 19 |  |  |
| Burpee Broad Jump | burpee-broad-jump | X2 | intermediate | I | T0 | 1 | n/a | - | 0 |  | PROPOSED-ADDITION; ballistic; 60+ off by default |
| Burpees | burpees | P | unrated | F | T0 | 1 | n/a | - | 2 |  | ballistic; 60+ off by default |
| Compromised Run (1 km run straight after a station) | compromised-run-run-after-a-station | X2 | intermediate | I | T0 | 1 | n/a | - | 0 |  | PROPOSED-ADDITION |
| Continuous Distance Run (half-marathon plan) | continuous-distance-run-half-marathon-plan | R | unrated | F | T0 | 1 | n/a | - | 0 |  |  |
| Distance/Pace Workout - not specified ('Workouts involving distances and paces') | distance-pace-workout-not-specified-workouts-involving-distances-and-paces | R | unrated | F | T0 | 1 | n/a | - | 0 |  |  |
| Fast Run Repeats (200 m fast; 150 m fast / 250 m walk) | fast-run-repeats-200-m-fast-150-m-fast-250-m-walk | R | unrated | F | T0 | 1 | n/a | - | 0 |  |  |
| Flat Sprints (40-80 m, full recovery) | flat-sprints-40-80-m-full-recovery | R | unrated | F | T0 | 1 | n/a | - | 0 |  |  |
| Hill Sprints (8-20 s, full recovery) | hill-sprints-8-20-s-full-recovery | R | unrated | F | T0 | 1 | n/a | - | 0 |  |  |
| Jumping Jacks | jumping-jacks | P | unrated | F | T0 | 1 | n/a | - | 2 |  | plyometric; 60+ off by default |
| Lactate Clearance: 1 min FASTEST/ 20 Sec MODERATE/ 2 Min EASY | lactate-clearance-1-min-fastest-20-sec-moderate-2-min-easy | R | advanced | A | T0 | 1 | n/a | - | 0 |  |  |
| Lactate Clearance: 1 min MODERATE/20 Sec FASTEST/ 2 Min EASY | lactate-clearance-1-min-moderate-20-sec-fastest-2-min-easy | R | advanced | A | T0 | 1 | n/a | - | 0 |  |  |
| Lactate Clearance: 2 Min FAST/ 2 Min EASY | lactate-clearance-2-min-fast-2-min-easy | R | advanced | A | T0 | 1 | n/a | - | 0 |  |  |
| Lactate Clearance: 2 Min FASTEST/ 3 Min MODERATE | lactate-clearance-2-min-fastest-3-min-moderate | R | advanced | A | T0 | 1 | n/a | - | 0 |  |  |
| Lactate Clearance: 2 min FASTEST/ 30 Sec MODERATE/ 1 Min EASY | lactate-clearance-2-min-fastest-30-sec-moderate-1-min-easy | R | advanced | A | T0 | 1 | n/a | - | 0 |  |  |
| Lactate Clearance: 2 Min FASTEST/ 4 Min MODERATE | lactate-clearance-2-min-fastest-4-min-moderate | R | advanced | A | T0 | 1 | n/a | - | 0 |  |  |
| Lactate Clearance: 2 min MODERATE/ 30 Sec FASTEST/ 1 Min EASY | lactate-clearance-2-min-moderate-30-sec-fastest-1-min-easy | R | advanced | A | T0 | 1 | n/a | - | 0 |  |  |
| Lactate Clearance: 3 Min FAST/ 1 Min EASY | lactate-clearance-3-min-fast-1-min-easy | R | advanced | A | T0 | 1 | n/a | - | 0 |  |  |
| Lactate Clearance: 3 Min FASTEST/ 3 Min MODERATE | lactate-clearance-3-min-fastest-3-min-moderate | R | advanced | A | T0 | 1 | n/a | - | 0 |  |  |
| Lactate Clearance: 4 Min FAST/ 2 Min EASY | lactate-clearance-4-min-fast-2-min-easy | R | advanced | A | T0 | 1 | n/a | - | 0 |  |  |
| Lactate Clearance: 5 Min FAST/ 1 Min EASY | lactate-clearance-5-min-fast-1-min-easy | R | advanced | A | T0 | 1 | n/a | - | 0 |  |  |
| Lactate Clearance: 5 Min FASTEST | lactate-clearance-5-min-fastest | R | advanced | A | T0 | 1 | n/a | - | 0 |  |  |
| Lactate Clearance: :30 sec FASTEST/ 20 Sec MODERATE/ 1 Min EASY | lactate-clearance-30-sec-fastest-20-sec-moderate-1-min-easy | R | advanced | A | T0 | 1 | n/a | - | 0 |  |  |
| Lactate Clearance: :30 sec FASTEST/ 30 Sec MODERATE/ 1 Min EASY | lactate-clearance-30-sec-fastest-30-sec-moderate-1-min-easy | R | advanced | A | T0 | 1 | n/a | - | 0 |  |  |
| Lactate Clearance: :30 sec MODERATE/ 1 Min FASTEST/ 1 Min EASY | lactate-clearance-30-sec-moderate-1-min-fastest-1-min-easy | R | advanced | A | T0 | 1 | n/a | - | 0 |  |  |
| Lactate Clearance: :30 sec MODERATE/20 Sec FASTEST/ 1 Min EASY | lactate-clearance-30-sec-moderate-20-sec-fastest-1-min-easy | R | advanced | A | T0 | 1 | n/a | - | 0 |  |  |
| Progression Run (easy -> moderate -> hard) | progression-run-easy-moderate-hard | R | unrated | F | T0 | 1 | n/a | - | 0 |  |  |
| Race Day: Half Marathon (13.1 mi) | race-day-half-marathon-13-1-mi | R | unrated | F | T0 | 1 | n/a | - | 0 |  |  |
| Rower Calorie Sprint | rower-calorie-sprint | P | unrated | F | T3 | 5 | n/a | - | 10 |  |  |
| Rower Distance Piece (500-2,000 m) | rower-distance-piece-500-2000-m | X2 | any | F | T3 | 5 | n/a | - | 0 |  | PROPOSED-ADDITION |
| Ruck Walk (weighted backpack walk) | ruck-walk-weighted-backpack | X2 | any | F | T0 | 1 | n/a | - | 0 |  | PROPOSED-ADDITION |
| Short Sprint Intervals (15-30 s work : 30 s-2 min walk) | short-sprint-intervals-15-30-s-work-30-s-2-min-walk | P | unrated | F | T0 | 1 | n/a | - | 8 |  |  |
| SkiErg Calorie Sprint | skierg-calorie-sprint | P | unrated | F | T3 | 5 | n/a | - | 13 |  |  |
| SkiErg Distance Piece (500-1,000 m) | skierg-distance-piece-500-1000-m | X2 | any | F | T3 | 5 | n/a | - | 0 |  | PROPOSED-ADDITION |
| Split-Day Run (a.m. + p.m.) | split-day-run-a-m-p-m | R | unrated | F | T0 | 1 | n/a | - | 0 |  |  |
| Steady-State Easy Cardio (15-40 min, any modality) | steady-state-easy-cardio-15-40-min-any-modality | P | unrated | F | T0 | 1 | n/a | - | 38 |  |  |
| Taper Run (comfortable pace) | taper-run-comfortable-pace | R | unrated | F | T0 | 1 | n/a | - | 0 |  |  |

### AOS - FUNCTIONAL BIOMECHANICS SYSTEM > ANTERIOR OBLIQUE SYSTEM (9)

| name | id | st | level | from | T | C | laterality | credit per set | uses | v1 notes | v1.1 |
|---|---|---|---|---|---|---|---|---|---|---|---|
| Rotational Crunch Chop Down (high-to-low) - Supine, Object Squeezed Between Knees | rotational-crunch-chop-down-high-to-low-supine-object-squeezed-between-knees | L | foundational | F | T3 | 3 | unilateral | CORE 1 | 0 |  |  |
| Rotational Crunch Chop Midline (horizontal) - Supine, Object Squeezed Between Knees | rotational-crunch-chop-midline-horizontal-supine-object-squeezed-between-knees | L | intermediate | I | T3 | 3 | unilateral | CORE 1 | 0 |  |  |
| Rotational Crunch Chop Up / Lift (low-to-high) - Supine, Object Squeezed Between Knees | rotational-crunch-chop-up-lift-low-to-high-supine-object-squeezed-between-knees | L | advanced | A | T3 | 3 | unilateral | CORE 1 | 0 |  |  |
| Supine Floor Pallof Hold (cable) - Object Squeezed Between Knees | supine-floor-pallof-hold-cable-band-object-squeezed-between-knees | L | foundational | F | T3 | 3 | unilateral | CORE 1 | 0 | renamed |  |
| Supine Offset Plank with Contralateral Cable Adduction | supine-offset-plank-with-contralateral-banded-cable-adduction | L | foundational | F | T3 | 3 | unilateral | CORE 1 | 0 | renamed |  |
| Tall-Kneeling Cable Crunch Chop Down (high-to-low) - Object Squeezed Between Knees | tall-kneeling-cable-band-crunch-chop-down-high-to-low-object-squeezed-between-kn | L | foundational | F | T3 | 3 | unilateral | CORE 1 | 0 | renamed |  |
| Tall-Kneeling Cable Crunch Chop Midline (horizontal) - Object Squeezed Between Knees | tall-kneeling-cable-band-crunch-chop-midline-horizontal-object-squeezed-between- | L | intermediate | I | T3 | 3 | unilateral | CORE 1 | 0 | renamed |  |
| Tall-Kneeling Cable Crunch Chop Up / Lift (low-to-high) - Object Squeezed Between Knees | tall-kneeling-cable-band-crunch-chop-up-lift-low-to-high-object-squeezed-between | L | advanced | A | T3 | 3 | unilateral | CORE 1 | 0 | renamed |  |
| Tall-Kneeling Pallof Hold (cable) - Object Squeezed Between Knees | tall-kneeling-pallof-hold-cable-band-object-squeezed-between-knees | L | foundational | F | T3 | 3 | unilateral | CORE 1 | 0 | renamed |  |

### DRAG - DRAGS (5)

| name | id | st | level | from | T | C | laterality | credit per set | uses | v1 notes | v1.1 |
|---|---|---|---|---|---|---|---|---|---|---|---|
| Sled Drag - Backward | sled-drag-backward | X | foundational | F | T3 | 2 | alternating | - | 0 | NEW LIB-19 |  |
| Sled Drag - Forward (harness or straps) | sled-drag-forward | X | foundational | F | T3 | 2 | alternating | - | 0 | NEW LIB-19 |  |
| Sled Drag - Lateral | sled-drag-lateral | X | intermediate | I | T3 | 2 | alternating | - | 0 | NEW LIB-19 |  |
| Sled Push | sled-push | X | foundational | F | T3 | 2 | alternating | - | 0 | NEW LIB-19 |  |
| Sled Rope Pull (hand-over-hand, HYROX-style) | sled-rope-pull-hand-over-hand | X2 | foundational | F | T3 | 2 | alternating | - | 0 |  | PROPOSED-ADDITION |

### CARRY - CARRY (5)

| name | id | st | level | from | T | C | laterality | credit per set | uses | v1 notes | v1.1 |
|---|---|---|---|---|---|---|---|---|---|---|---|
| Farmer Carry (bilateral) | farmer-carry | X | foundational | F | T2 | 2 | bilateral | CORE 1 | 0 | NEW LIB-19 |  |
| Farmer Hold (stationary carry) | farmer-hold-stationary | X | foundational | F | T2 | 2 | bilateral | CORE 1 | 0 | NEW LIB-19 |  |
| Front-Rack KB Carry (one or two KBs) | front-rack-kb-carry | X | intermediate | I | T2 | 2 | bilateral | CORE 1 | 0 | NEW LIB-19 |  |
| Overhead KB Carry (single arm) | overhead-kb-carry | X | advanced | A | T2 | 2 | unilateral | CORE 1 | 0 | NEW LIB-19 |  |
| Sandbag Bear-Hug Carry | sandbag-bear-hug-carry | X | foundational | F | T2 | 2 | bilateral | CORE 1 | 0 | NEW LIB-19 |  |

### ARMCARE - ARM CARE / MOBILITY (8)

| name | id | st | level | from | T | C | laterality | credit per set | uses | v1 notes | v1.1 |
|---|---|---|---|---|---|---|---|---|---|---|---|
| Cable External Rotation (elbow at the side or 90/90) | cable-external-rotation-elbow-at-side-or-90-90 | X2 | foundational | F | T3 | 3 | unilateral | - | 0 |  | PROPOSED-ADDITION |
| DB Wrist Extension (slow lowering, forearm on the knee or a bench) | db-wrist-extension-slow-lowering | X2 | foundational | F | T2 | 3 | unilateral | - | 0 |  | PROPOSED-ADDITION |
| Dead Hang (pull-up bar) | dead-hang-pull-up-bar | X2 | foundational | F | T1 | 2 | bilateral | - | 0 |  | PROPOSED-ADDITION |
| Half-Kneeling Shoulder Roll (arm care) | half-kneeling-shoulder-roll-arm-care | P | unrated | F | T0 | 3 | unilateral | - | 2 |  |  |
| Kettlebell Arm Bar (arm care) | kettlebell-arm-bar-arm-care | P | unrated | F | T2 | 3 | unilateral | - | 4 |  |  |
| Scapular Push-Up (push-up plus) | scapular-push-up-push-up-plus | X2 | foundational | F | T0 | 2 | bilateral | - | 0 |  | PROPOSED-ADDITION |
| Side-Lying DB Drop & Catch (reactive shoulder) | side-lying-db-drop-and-catch-reactive-shoulder | P | unrated | F | T2 | 3 | unilateral | - | 1 |  |  |
| Side-Lying DB External Rotation | side-lying-db-external-rotation | X2 | foundational | F | T2 | 3 | unilateral | - | 0 |  | PROPOSED-ADDITION |

## 5. Duplicates merged

### 5.1 Hand-reviewed near-duplicate merges (v0; the merge policy is confirmed by COACH-ANSWER LIB-17)

| canonical record | merged raw names | why | evidence |
|---|---|---|---|
| Ankle Hops (bilateral, in place) | 'Bilateral symmetrical ankle hop' | same movement (bilateral in-place ankle hops) listed in PLYOS (G15/G55) and in the JUMPING ANKLE track (C126/F9); L1 notes call them near-duplicates | INFERRED (policy confirmed, LIB-17) |
| Single-Leg Squirrel Jumps | '✅ Single leg squirrel jumps my' | Sheet23 B45 has a stray dictation word 'my' | INFERRED (policy confirmed, LIB-17) |
| 5-10-5 Pro-Agility Shuttle | 'datetime.datetime(2005, 5, 10, 0, 0)' | Sheet23 M3 is the same date-corrupted '5-10-5' cell as BYOP L92/N10 | COACH-ANSWER LIB-01 |
| Squat Clean | 'SQUAT CLEAN' | BYOP 'Clean ' (after 'Power Clean') read as the full squat clean of the Olympic tab A13 (decoder: 'same lift'); confirmed by COACH-ANSWER LIB-07 | COACH-ANSWER LIB-07 |
| Squat Snatch | 'SQUAT SNATCH' | BYOP 'Snatch ' read as the squat snatch of the Olympic tab A30; confirmed by COACH-ANSWER LIB-07 | COACH-ANSWER LIB-07 |
| Power Clean | 'POWER CLEAN FROM THE FLOOR' | Olympic tab A10 = BYOP C92 (decoder 'same lift') | INFERRED (policy confirmed, LIB-17) |
| Power Snatch | 'POWER SNATCH FROM THE FLOOR' | Olympic tab A24 = BYOP C91 | INFERRED (policy confirmed, LIB-17) |
| Standing Barbell Overhead Press (strict) | 'OH PRESS'; 'barbell overhead press' | strict standing barbell overhead press: RP E15, Olympic jerk ladder A15, focus list AZ46 | INFERRED (policy confirmed, LIB-17) |
| Barbell Push Press | 'OH PUSH PRESS' | Olympic jerk ladder A16 = BYOP AA12 | INFERRED (policy confirmed, LIB-17) |
| Barbell Push Jerk | 'OH PUSH JERK' | Olympic jerk ladder A17 = BYOP AA14 | INFERRED (policy confirmed, LIB-17) |
| Goblet Squat (KB/DB) | 'goblet squat'; 'Goblet Squat' | RP A11/A17, ALL ABOUT SQUATS B11, Sheet25 J14, French contrast 'Goblet squats' | INFERRED (policy confirmed, LIB-17) |
| High Zercher Barbell Squat | 'High Zercher Squat' | ALL ABOUT SQUATS C11 ladder is barbell-centric; DB version kept separate (INFERRED) | INFERRED (policy confirmed, LIB-17) |
| Zercher Squat (barbell) | 'Barbell zercher squat' | focus list AZ11, ALL ABOUT SQUATS D11, RP A21 | INFERRED (policy confirmed, LIB-17) |
| Front Squat (barbell) | 'Front Squat/ SSB Bar' | ALL ABOUT SQUATS E11 names front squat and SSB on one rung | INFERRED (policy confirmed, LIB-17) |
| High-Bar Back Squat | 'High Bar Squat' | ALL ABOUT SQUATS F11 | INFERRED (policy confirmed, LIB-17) |
| Low-Bar Back Squat | 'Low Bar Squat' | ALL ABOUT SQUATS G11 | INFERRED (policy confirmed, LIB-17) |
| Bodyweight Squat (air squat) | 'Air squat'; 'Max air squats' | RP A8 'Air squat'; ALL ABOUT SQUATS C23 'Max air squats' is an AMRAP dose of the same movement | INFERRED (policy confirmed, LIB-17) |
| Box Squat (bodyweight) | 'Air box squats' | RP A9 | INFERRED (policy confirmed, LIB-17) |
| Wall-Assisted Squat (foam roller or stability ball behind the back) | 'Foam roller or swiss ball wall assisted goblet' | RP A12 (decoder cross-ref) | INFERRED (policy confirmed, LIB-17) |
| Box Squat, any loading - touch-and-go (fast) | 'Box. Any Squat Touch and Go'; 'Box *ANY Squat touch & go' | BYOP renamed Sheet23 AE2 by adding 'fast' | INFERRED (policy confirmed, LIB-17) |
| Box Squat - dead-stop 'deload' (bottom banded) | 'Box *ANY Squat Deload banded' | RP A29 | INFERRED (policy confirmed, LIB-17) |
| Hack Squat (machine) | 'Hack Squat Machine '; 'HACK SQUAT' | same machine listed at MODERATE (AI52) and ADVANCED (AI97); ALL ABOUT SQUATS G37 | INFERRED (policy confirmed, LIB-17) |
| Pendulum Squat (machine) | 'PENDULUM' | ALL ABOUT SQUATS G41 | INFERRED (policy confirmed, LIB-17) |
| Leg Extension (machine) | 'Leg Extension Machine' | AM9 column + the machine listed in all three AI blocks + RP A39 | INFERRED (policy confirmed, LIB-17) |
| 45-Degree Hyperextension (back/hip extension) | 'Hyperextensions'; '45 degree hip ext. ' | 45-degree back/hip extension bench: AN55, AZ207, RP A68 | INFERRED (policy confirmed, LIB-17) |
| Barbell Deadlift (conventional) | 'Shoulder width grip Barbell Deadlift' | RP A71 | COACH-ANSWER LIB-17 |
| Kettlebell Swing (Russian) | 'Russian kb swing' | RP A78; default swing = Russian (INFERRED) | INFERRED (policy confirmed, LIB-17) |
| Staggered-Stance (Kickstand) DB Deadlift | 'Staggered stance double dumbbell deadlift' | RP C63 | INFERRED (policy confirmed, LIB-17) |
| Staggered-Stance (Kickstand) Barbell Deadlift | 'Staggered stance barbell deadlift' | RP C64 | INFERRED (policy confirmed, LIB-17) |
| Machine Leg Curl (seated or lying) | 'Leg Curl Machine'; 'Machine Leg Curls (Seated and Laying Down)'; 'Leg curls'; 'ham curls' | machine leg curl without a stated seat/lying position: AN15, AN54, AN100, AZ211, Sheet25 H13 | INFERRED (policy confirmed, LIB-17) |
| Ball Hamstring Curl (medball or stability ball) | 'swiss ball hamstring curls'; 'Harmstring medball curls' | three near-duplicate ball hamstring curls (AN17/AN19/AN50) per L3 notes | COACH-ANSWER LIB-17 |
| Standing DB Calf Raise (deficit optional) | 'Calf Raises w/ DB '; 'DB Standing calf raises' | AU10/AU11/AZ332 near-duplicates; deficit treated as a ROM variable | COACH-ANSWER LIB-17 |
| Stiff-Leg Deadlift / RDL | 'rdl' | Sheet25 B12; the coach writes 'RDL (stiff leg deadlift)' in 4 TRACKS P9 | INFERRED (policy confirmed, LIB-17) |
| Rear-Foot-Elevated Lunge (RFE / Bulgarian split squat) | 'Bulgarian Split squats'; 'bulgarians' | coach writes 'RFE Lunges (bulgarian)' (4 TRACKS W44) | INFERRED (policy confirmed, LIB-17) |
| Step-Up (forward and lateral) | 'forward step up'; 'lateral step up' | AL19 covers both directions; RP C17/C18 | INFERRED (policy confirmed, LIB-17) |
| Front- and Rear-Foot-Elevated Split Squat (FFE & RFE) | 'Front and Rear foot elevated lunge' | RP C15 | INFERRED (policy confirmed, LIB-17) |
| Single-Leg Glute Bridge (foot on floor) | 'Single leg Glute bridge' | AZ165 | INFERRED (policy confirmed, LIB-17) |
| High-Incline Seated DB Press | 'Seated DB press' | RP E8 (decoder cross-ref) | INFERRED (policy confirmed, LIB-17) |
| High-Incline Seated Barbell Press | 'Seated Barbell press' | RP E9 | INFERRED (policy confirmed, LIB-17) |
| Incline DB Bench Press | 'Incline DB bench'; 'Incline db press' | RP G9 (MID RANGE PUSH), focus list AZ48/AZ245 | INFERRED (policy confirmed, LIB-17) |
| Incline Barbell Bench Press | 'Incline barbell press'; 'Incline barbell bench' | copy-tab L35, focus list AZ49/AZ250, RP G10 | INFERRED (policy confirmed, LIB-17) |
| DB Floor Press | 'DB floor press' | RP I8 | INFERRED (policy confirmed, LIB-17) |
| Alternating DB Floor Press | 'One up/one down Alternating DB floor press' | RP I30 | INFERRED (policy confirmed, LIB-17) |
| Alternating Standing Cable Press (one forward / one back) | 'One forward/one back Alternating cable press' | RP I31 | INFERRED (policy confirmed, LIB-17) |
| Offset Push-Up (one hand elevated) | 'Pushups one hand higher' | RP I33 | INFERRED (policy confirmed, LIB-17) |
| Alternating Flat DB Bench Press | 'One up/one down Alternating DB bench press' | RP I34 | INFERRED (policy confirmed, LIB-17) |
| Barbell Bench Press | 'bench press' | focus list AZ246 lists 'bench press' next to 'db bench press', so it is the barbell lift | INFERRED (policy confirmed, LIB-17) |
| Flat DB Fly | 'DB flies' | AZ248 | INFERRED (policy confirmed, LIB-17) |
| Deficit Push-up (hands elevated for full ROM) | 'Deficit Push-ups' | AF18 is the renamed AD99 (decoders) | INFERRED (policy confirmed, LIB-17) |
| DB Lateral Raise (Supinated / palms-up grip) | 'Side raises palms forward' | RP K8 | INFERRED (policy confirmed, LIB-17) |
| DB Lateral (Side) Raise | 'Side raises Palms down'; 'DB side raises' | RP K9; focus list AZ50 | INFERRED (policy confirmed, LIB-17) |
| DB Hammer-Grip Side/Front Raise (neutral grip) | 'Front Raises hammer' | RP K11 | INFERRED (policy confirmed, LIB-17) |
| DB Front Raise | 'Front raises palms down' | RP K12 | INFERRED (policy confirmed, LIB-17) |
| Bent-Over DB Reverse Fly | 'Bent over Reverse flies' | RP K16 | INFERRED (policy confirmed, LIB-17) |
| Seated (Chest-to-Thighs) DB Reverse Fly | 'Seated reverse flies' | RP K17 | INFERRED (policy confirmed, LIB-17) |
| Cable Side Raise (leaning) | 'Cable side raises' | focus list AZ51; Sheet23 'Cable machine side raises' was renamed AH19 (sheet23 notes) | INFERRED (policy confirmed, LIB-17) |
| Dumbbell Hammer Curl | 'DB Hammer curls' | RP K24 | INFERRED (policy confirmed, LIB-17) |
| Dumbbell Curl | 'DB Supinated curls' | RP K25 | INFERRED (policy confirmed, LIB-17) |
| EZ-Bar Curl | 'EZ Bar supinated curls' | RP K27 | INFERRED (policy confirmed, LIB-17) |
| Reverse-Grip (Pronated) EZ-Bar Curl | 'EZ bar pronated curls' | RP K28 (pronated = reverse curl) | INFERRED (policy confirmed, LIB-17) |
| Barbell Curl | 'Barbell supinated curls' | RP K29 | INFERRED (policy confirmed, LIB-17) |
| Dumbbell Triceps Kickback (one or both arms) | 'bench tricep kickbacks (uni)'; 'bent over Tricep kickbacks (bi)' | AT10 covers uni and bi; RP K32/K33 | INFERRED (policy confirmed, LIB-17) |
| Floor Dumbbell Skullcrusher | 'Floor DB tricep extensions' | RP K38 | INFERRED (policy confirmed, LIB-17) |
| EZ-Bar Skullcrusher | 'EZ bar Skull crusher' | RP K40 | INFERRED (policy confirmed, LIB-17) |
| Overhead Dumbbell Triceps Extension | 'Db overhead tricep ext (bi or uni)'; 'DB overhead tricep ext'; 'Unilateral/Bilateral DB Tricep Extension (Zone 3)' | RP K42, AZ125, Sheet23 AP5 (replaced) | INFERRED (policy confirmed, LIB-17) |
| Overhead Cable Triceps Extension | 'cable overhead tricep ext' | AZ127; RP K43 | INFERRED (policy confirmed, LIB-17) |
| Cable Triceps Push-down | 'cable tricep extensions' | AZ126 = the bilateral cable push-down | INFERRED (policy confirmed, LIB-17) |
| Rope Triceps Push-down (neutral grip) | 'Cable Machine Tricep Extensionw/ Rope (Zone 1 and Zone 3)' | Sheet23 AP6 rope item, replaced in BYOP by push-downs + overhead cable; kept as rope variant | INFERRED (policy confirmed, LIB-17) |
| Incline Dumbbell Curl ('pinky facing up' supinated variation) | 'Incline bench bicep curls' | AZ312 | INFERRED (policy confirmed, LIB-17) |
| Seated Dumbbell Curl | 'Seated DB Curls ' | AS14/AS16 near-duplicates | COACH-ANSWER LIB-17 |
| Cable Curl (Zone 1 / Zone 2 / Zone 3 set-ups) | 'cable bicep curls' | AZ314 | INFERRED (policy confirmed, LIB-17) |
| Lat Pulldown (Rope Attachment) | 'Lat pull downs with cable rope' | RP E65 | INFERRED (policy confirmed, LIB-17) |
| Strict Pull-Up (Feet in Front / hollow) | 'Strict pull ups feet in front of you' | RP E72 | INFERRED (policy confirmed, LIB-17) |
| Strict Pull-Up (Knees to Chest / tuck) | 'Strict pull ups knees up' | RP E73 | INFERRED (policy confirmed, LIB-17) |
| TRX Row (suspension row) | 'Incline reverse pushup (rings/trx/barbell/smith machine)' | RP G64 'reverse pushup' = inverted/suspension row with inclined body | INFERRED (policy confirmed, LIB-17) |
| Inverted Row | 'Paralell reverse pushup (rings/trx/barbell/smith machine)' | RP G65 body parallel to the floor | INFERRED (policy confirmed, LIB-17) |
| Bent-Over Barbell Row (Supinated / Yates grip) | 'bent over supinated barbell row' | RP G68 | INFERRED (policy confirmed, LIB-17) |
| Bent-Over Barbell Row | 'bent over pronated barbell row' | RP G69 | COACH-ANSWER LIB-17 |
| Single-Arm Cable Row | 'Cable single arm row' | RP G75 | INFERRED (policy confirmed, LIB-17) |
| Single-Arm DB/KB Row | 'Single arm Db Row'; 'Bent over Single arm DB or KB row'; 'Db rows' | X91 sits in the UNILATERAL block; RP G76/G78; focus list AZ93 | INFERRED (policy confirmed, LIB-17) |
| Plank (forearm / low plank) | 'Low plank' | CONTROL PATTERNS L29 low (forearm) plank | INFERRED (policy confirmed, LIB-17) |
| Side Plank (elbow) | 'Elbow Side plank' | CONTROL PATTERNS S28 | COACH-ANSWER LIB-17 |
| Cable Oblique Rotation (cable rotational twist) | 'cable oblique turns' | CONTROL PATTERNS B9 | INFERRED (policy confirmed, LIB-17) |
| Cable Woodchopper (cable chop) | 'Cable chops' | CONTROL PATTERNS B13 (decoder 'same exercise') | INFERRED (policy confirmed, LIB-17) |
| Leg Raise (lying / supine) | 'Supine Leg raises' | CONTROL PATTERNS I20 | INFERRED (policy confirmed, LIB-17) |
| Cross Connect (rolls / rocking / hold) | 'cross connect' | CONTROL PATTERNS B32 (dynamic) / E32 (static) - same drill in two modes (INFERRED) | INFERRED (policy confirmed, LIB-17) |
| Rotational Medball Chest Pass (R & L) | 'Rotational Chest pass L' | mirror pair (R/L) of one throw; coach always lists both sides | INFERRED (policy confirmed, LIB-17) |
| Rotational Medball Scoop Toss (R & L) | 'Rotational Scoop L' | mirror pair (R/L) | INFERRED (policy confirmed, LIB-17) |
| Step-Forward Medball Chest Pass (R & L leg) | 'LEFT LEG step forward Chest pass' | mirror pair (R/L leg) | INFERRED (policy confirmed, LIB-17) |
| Step-Forward Medball Overhead Throw (R & L leg) | 'LEFT LEG step forward overhead throw' | mirror pair (R/L leg) | INFERRED (policy confirmed, LIB-17) |
| Squat - any loading ('Whatever Squat') | '78% of 1RM whatever squat' | coach's wildcard squat: Sheet25 J13 'squats' and ALL ABOUT SQUATS French contrast I18 '78% of 1RM whatever squat' (menus write 'Whatever Squat') | INFERRED (policy confirmed, LIB-17) |

Also merged in v0 (INFERRED): Sheet24 '1-mile at max effort' with BYOP SPEED TEST '1 Mile run for time'; the Sheet23 copy of the progression note 'Bigger plates start at lateral bilateral plate hops' with BYOP G53/H16; the 42 Sheet24 half-marathon sessions grouped into 9 session-type records. The v0 merge of RP 'LOADING VARIABLES' BANDS / CHAINS / WEIGHT RELEASERS with the ALL ABOUT SQUATS rows still stands, but all three are out of scope in v1 (EQ-12).

### 5.2 v1 merges (retired record -> surviving record)

| merged record | old id (kept as retired) | merged into | surviving id | question | why |
|---|---|---|---|---|---|
| Bilateral Weighted Drop, Release the Weight & Jump | bilateral-weighted-drop-release-the-weight-and-jump | DB Depth Drop, Release DBs, Jump | db-depth-drop-release-dbs-jump | LIB-17 | BALLISTICS 'bilateral weighted drop, release the weight & jump' is the BYOP 'DB Depth drop release DBs jump' |
| Drop (Bilateral) and Jump - depth jump | drop-bilateral-and-jump-depth-jump | Depth Jump | depth-jump | LIB-17 | BALLISTICS 'Drop (bilateral) and jump' is the BYOP 'Depth Jumps' (G131) |
| Unilateral Weighted Drop, Release the Weight & Jump | unilateral-weighted-drop-release-the-weight-and-jump | Single-Leg DB Depth Drop, Release DBs, Jump | single-leg-db-depth-drop-release-dbs-jump | LIB-17 | BALLISTICS 'unilateral weighted drop, release the weight & jump' is the BYOP single-leg DB depth drop / release / jump |
| Deficit Reverse Lunge (front foot on plate) | deficit-reverse-lunge-front-foot-on-plate | Deficit Reverse Lunge (standing on plate/step) | deficit-reverse-lunge-standing-on-plate-step | LIB-17 | BASEBALL 'deficit reverse lunge (front foot on plate)' is the BYOP deficit reverse lunge (stand on the plate/step, step back) |
| Conventional Barbell Deadlift (shoulder-width grip) | conventional-barbell-deadlift-shoulder-width-grip | Barbell Deadlift (conventional) | barbell-deadlift-conventional | LIB-17 | same lift at MODERATE (AN49 'Shoulder Wide Grip Deadlift') and ADVANCED (AN92 'Barbell Deadlifts'); coach: merge near-duplicates |
| Bent-Over Barbell Row (Pronated Grip) | bent-over-barbell-row-pronated-grip | Bent-Over Barbell Row | bent-over-barbell-row | LIB-17 | 'Bent Over Rows Pronated Grip' (X49) duplicates 'Bent Over Barbell Rows'; pronated is the default barbell-row grip (the supinated/Yates row stays separate) |
| Lat Pull-Under (technique unconfirmed) | lat-pull-under-technique-unconfirmed | Lat Pull-over (cable) | cable-lat-pullover | LIB-09 | coach: 'The pull under is really called a pull over. If you're doing it on a cable machine with your lats, you're doing a lat pull over.' |

### 5.3 Same exercise listed in several BYOP dropdown cells (OBSERVED repeats inside the live library)

| record | master-stack cells (block label) |
|---|---|
| Ankle Hops (bilateral, in place) | G15 (FOUNDATIONAL), G55 (MODERATE), C126 (EASY) |
| Hex Bar Squat to Calf Raise | C11 (FOUNDATIONAL), C48 (MODERATE) |
| High-Hang Clean Pull | C12 (FOUNDATIONAL), C49 (MODERATE) |
| High-Hang Snatch Pull | C14 (FOUNDATIONAL), C51 (MODERATE) |
| Lunge to High-Knee Reach | C10 (FOUNDATIONAL), C47 (MODERATE) |
| Mid-Hang Clean Pull | C13 (FOUNDATIONAL), C50 (MODERATE) |
| Mid-Hang Snatch Pull | C15 (FOUNDATIONAL), C52 (MODERATE) |
| Rotational Medball Chest Pass (R & L) | K11 (AP - THROWING), K12 (AP - THROWING) |
| Rotational Medball Scoop Toss (R & L) | K13 (AP - THROWING), K14 (AP - THROWING) |
| Step-Forward Medball Chest Pass (R & L leg) | K17 (AP - THROWING), K18 (AP - THROWING) |
| Step-Forward Medball Overhead Throw (R & L leg) | K19 (AP - THROWING), K20 (AP - THROWING) |
| Barbell Thruster | AA55 (ADVANCED), AI103 (ADVANCED) |
| DB Thruster (front squat into overhead press) | AA54 (ADVANCED), AI102 (ADVANCED) |
| Hack Squat (machine) | AI52 (MODERATE), AI97 (ADVANCED) |
| Single-Arm DB Thruster | AA94 (UNILATERAL), AI104 (ADVANCED) |
| Leg Extension (machine) | AM9 (RP-BS-KNEE DOMINANT -ADVANCED), AI20 (FOUNDATIONAL), AI55 (MODERATE), AI101 (ADVANCED) |
| Ball Hamstring Curl (medball or stability ball) | AN17 (FOUNDATIONAL), AN19 (FOUNDATIONAL), AN50 (MODERATE) |
| Barbell Deadlift (conventional) | AN92 (ADVANCED), AN49 (MODERATE) |
| GHD - Glute-Ham Developer (hip extension / glute-ham raise) | AN48 (MODERATE), AN93 (ADVANCED) |
| Machine Leg Curl (seated or lying) | AN15 (FOUNDATIONAL), AN54 (MODERATE), AN100 (ADVANCED) |
| Bent-Over Barbell Row | X46 (ADVANCED), X49 (ADVANCED) |
| Incline Push-Up (hands elevated) | AD12 (FOUNDATIONAL), AD46 (MODERATE) |
| Seated Dumbbell Curl | AS14 (-), AS16 (-) |
| Standing DB Calf Raise (deficit optional) | AU10 (-), AU11 (-) |
| Side Plank (elbow) | O47 (MODERATE), O164 (MODERATE) |
| Distance Test: 1 mile Run | B25 (-), B90 (-) |
| Distance Test: 11 mile Run | B29 (-), B94 (-) |
| Distance Test: 14 mile Run | B30 (-), B95 (-) |
| Distance Test: 17 mile Run | B31 (-), B96 (-) |
| Distance Test: 20 mile Run | B32 (-), B97 (-) |
| Distance Test: 21.6 mile Run (retired in v1.1, R2-LIB-06) | B33 (-), B98 (-) |
| Distance Test: 3 mile Run | B26 (-), B91 (-) |
| Distance Test: 5 mile Run | B27 (-), B92 (-) |
| Distance Test: 8 mile Run | B28 (-), B93 (-) |

v1: the second 'Low Depth Drop' (G10) is now its own single-leg / weighted record (LIB-03) and the second 'Standing DB Press' (AA51) belongs to the standing barbell press (LIB-11), so neither appears here any more.

### 5.3b v1.1 split (one record -> two)

| v1 record | v1.1 records | question | why |
|---|---|---|---|
| Bench Push-Up (hands or feet on bench - not stated) | Bench Push-Up - Hands on Bench (incline) (same id, FOUNDATIONAL, AD13 + RESISTANCE PATTERNS I11) and Bench Push-Up - Feet on Bench (decline) (`bench-push-up-feet-on-bench`, ADVANCED, AF11 + Sheet23 Z4) | R2-LIB-05 / LIB-12 | 'Both: hands on the bench = foundational (easier); feet on the bench = advanced (harder)' - approved. The crosswalk file was not rewritten: AF11 / Z4 still point to the old id; read the split here. |

### 5.4 Automatic merges by normalised name

333 active records combine more than one library/reference cell (the BYOP master stack + its side-by-side level-view copy + the Sheet23 / RESISTANCE PATTERNS / specialty twin). Every alias keeps `workbook`, `tab`, `cell`, `role` and the verbatim text; `merged_because` is set when the merge was manual (v1 merges cite the question ID).

Program cells were folded in the same way: e.g. `Front Squat (barbell)` carries 55 program aliases, `Leg Press (machine)` 34, `DB Lateral (Side) Raise` 43 (see each record's `aliases` with `role: program` and `cues` such as `heavy`, `fast`, `@ 75%`, `MYO SET 15-5-5-5-5-5`).

## 6. Conflicts and flags

### 6.1 Coach preference vs. what the library offers

| record | coach label (OBSERVED) | coach detail (abridged) | source | generator rule (v1) | status | BYOP levels |
|---|---|---|---|---|---|---|
| Hack Squat (machine) | I PERSONALLY DON'T LIKE IT | Most hack squat machines don't have the right strength profile for me so getting used to a good upright squat might be difficult, I haven't had much s | MASTER_MODEL 'ALL ABOUT SQUATS' G37:I37 | v1 (COACH-ANSWER EQ-11): machines are NOT ranked - if the hack squat in the client's gym works and feels good, use it; it is more constrained than a Smith machine. The quote above stays as his personal opinion, not a generator penalty. | S | advanced, intermediate |
| Leg Press (machine) | LOVE IT | Pro: You can focus on mechanical fatigue, local fatigue of the quads/legs and not have so much systemic fatigue failure | MASTER_MODEL 'ALL ABOUT SQUATS' G35:I35 | v1 (COACH-ANSWER EQ-11): his 'LOVE IT' stays as an opinion but machines are not ranked; offer when available and the client feels it. Allowed for FOUNDATIONAL older/injured clients despite the ADVANCED label (EQ-04). | S | advanced |
| Pendulum Squat (machine) | LOVE IT | This machines is my FAVORITE leg/squat/kne domminant machine I have ever tried. As of now, that is my opinion on these | MASTER_MODEL 'ALL ABOUT SQUATS' G41:I41 | v1 (COACH-ANSWER EQ-11): his 'LOVE IT' stays as an opinion but machines are not ranked; offer when available and the client feels it. Allowed for FOUNDATIONAL older/injured clients despite the ADVANCED label (EQ-04). | S | advanced |
| V-Squat (machine) | DON'T LIKE IT | Always tight on lower back & knees, so I don't presercibe the use of these, ever. | MASTER_MODEL 'ALL ABOUT SQUATS' G39:I39 | hard exclusion - never prescribe (COACH-ANSWER GEN-08 confirmed the 'no V-squat' rule) | R |  |
| Loading variable: WEIGHT RELEASERS | I HAVE NO IDEA | I HAVE NO IDEA (written in all three cells: B41 under 'VOLUME', C41 under 'DETAIL', D41 under 'WHO NEEDS THIS?') | MASTER_MODEL 'ALL ABOUT SQUATS' B41:D41 | out of scope with all variable resistance (COACH-ANSWER EQ-12: 'No variable resistance should be available in this for now') | out of scope |  |

v1 reading: the sheet opinions stay as OBSERVED quotes, but the generator does not rank machines (COACH-ANSWER EQ-11: 'I don't want to rank them because they have different brands, angles, and things like that'). The hack squat is no longer a fallback-only lift; leg press and pendulum are reachable for FOUNDATIONAL older / injured clients (EQ-04). The V-squat stays a hard exclusion (GEN-08). Weight releasers ('I HAVE NO IDEA') are out of scope with all variable resistance (EQ-12).

### 6.2 Flags closed by coach answers

| record | answer | v0 flag (abridged) | how it was resolved |
|---|---|---|---|
| Box Zercher Squat (touch-and-go) | CAT-04 | LEVEL CONFLICT: FOUNDATIONAL in BYOP (AI9) but Zercher is 'MODERATE' on the ALL ABOUT SQUATS ladder and yellow in RP. | front-loaded zercher = foundational ('a goblet squat or a more front-loaded zercher would be foundational') |
| Knees to Chest (hanging) | CAT-08 | PLACEMENT CONFLICT: BYOP CORE THORAX (O16) vs CONTROL PATTERNSCORE CORE PELVIS - SAGITAL (I19) and CORE PELVIS - TRANSVE | filed by the thorax/pelvis/both rule (INFERRED application) |
| Knees to Chest (hanging) | CAT-08 | FILED UNDER SEVERAL PATTERNS: CP, CT | filed by the thorax/pelvis/both rule (INFERRED application) |
| Toes to Bar (hanging) | CAT-08 | PLACEMENT CONFLICT: BYOP files it CORE THORAX (O15, FOUNDATIONAL/sagittal) but CONTROL PATTERNSCORE files 'Toes to bar'  | filed by the thorax/pelvis/both rule (INFERRED application) |
| Toes to Bar (hanging) | CAT-08 | FILED UNDER SEVERAL PATTERNS: CP, CT | filed by the thorax/pelvis/both rule (INFERRED application) |
| V-Up | CAT-08 | PLACEMENT CONFLICT: BYOP CORE PELVIS (O129/R11) vs CONTROL PATTERNSCORE 'BOTH' (I28). | filed by the thorax/pelvis/both rule (INFERRED application) |
| V-Up | CAT-08 | FILED UNDER SEVERAL PATTERNS: CB, CP | filed by the thorax/pelvis/both rule (INFERRED application) |
| Machine Leg Curl (seated or lying) | CAT-09 | MERGED: AN15 'Leg Curl Machine', AN54 '(Seated and Laying Down)', AN100, AZ211 'Leg curls', Sheet25 'ham curls' - seat/l | moved to LEG FLEXION (counts toward hamstrings, not the hinge pattern) |
| Machine Leg Curl (seated or lying) | CAT-09 | FILED UNDER SEVERAL PATTERNS: BHD, KFLEX | moved to LEG FLEXION (counts toward hamstrings, not the hinge pattern) |
| Nordic Hamstring Curl | CAT-09 | FILING: knee-flexion (eccentric) work filed under BILATERAL HIP DOMINANT ADVANCED (AN91). | moved to LEG FLEXION (counts toward hamstrings, not the hinge pattern) |
| Prone Dumbbell Hamstring Curl (DB between feet) | CAT-09 | FILING: knee-flexion isolation filed under BILATERAL HIP DOMINANT ADVANCED (AN101). | moved to LEG FLEXION (counts toward hamstrings, not the hinge pattern) |
| Supine Slider Hamstring Curl | CAT-09 | FILING: knee-flexion work filed under BILATERAL HIP DOMINANT (AN18). | moved to LEG FLEXION (counts toward hamstrings, not the hinge pattern) |
| Cable Curl (Zone 1 / Zone 2 / Zone 3 set-ups) | CAT-10 | AMBIGUOUS: 'Zone 1/2/3' probably cable height / arm angle (INFERRED); missing ')' in the name. | zones are Pat Davidson's arm positions: zone 1 arms down by the sides, zone 2 arms in front at shoulder height, zone 3 arms overhead |
| Leg Press (machine) | EQ-04 | LEVEL CONFLICT: only ADVANCED in BYOP (AI98/AK16) though Sheet23 also had it INTERMEDIATE (AD9, removed from the MODERAT | older/injured foundational clients can use it; machines are easier (CAT-04) |
| Leg Press (machine) | EQ-04 | LEVEL DIFFERS BY SOURCE: BYOP ['advanced'] vs OBSERVED reference levels ['intermediate', 'advanced'] (Sheet23 AD9 interm | older/injured foundational clients can use it; machines are easier (CAT-04) |
| Hack Squat (machine) | EQ-11 | COACH DISLIKE vs LISTING: coach 'I PERSONALLY DON'T LIKE IT' (ALL ABOUT SQUATS G37) yet it sits in BYOP MODERATE (AI52 ' | no ranking of machines; client feel decides |
| Loading variable: WEIGHT RELEASERS | EQ-12 | COACH STATUS: 'I HAVE NO IDEA' x3 (ALL ABOUT SQUATS B41:D41). | out of scope: no variable resistance for now |
| L-Test / L-Drill (3-Cone) | LIB-01 | AMBIGUOUS: probably the L-test / 3-cone L drill (INFERRED). | 'LEFT TEST' = L-test (3-cone) confirmed |
| Push-Up Stick the Landing (hands start on a box, land on the floor) | LIB-02 | AMBIGUOUS: upper-body plyo push-up landing vs prone pop-up not stated. | hands start on a box and land on the floor |
| Low Depth Drop | LIB-03 | DUPLICATE IN DROPDOWN: 'Low Depth Drop' listed twice in a row (G9/G10; also Sheet23 F2/F3). | the second listing (G10) is the single-leg or weighted variant (new record 'low-depth-drop-single-leg-or-weighted') |
| Hurdle Hops (tall hurdles, continuous quick-contact reps) | LIB-04 | POSSIBLE DUPLICATE of 'Bilateral Forward Hurdle Hops ' (G91, MODERATE); what makes the ADVANCED one harder is not stated | not a duplicate: taller hurdles + continuous quick contacts |
| Alternating Single-Leg Plate Hops (Hop Off Bilateral) | LIB-05 | FILED UNDER SEVERAL PATTERNS: ANKLE, PLYO | plate hops = MODERATE plyo track 1 (they also appear in the jumping-ankle list); an intermediate athlete takes one exercise from each MODERATE track |
| Ankle Hops (bilateral, in place) | LIB-05 | FILED UNDER SEVERAL PATTERNS: ANKLE, PLYO | plate hops = MODERATE plyo track 1 (they also appear in the jumping-ankle list); an intermediate athlete takes one exercise from each MODERATE track |
| Bilateral Forward Plate Hops | LIB-05 | FILED UNDER SEVERAL PATTERNS: ANKLE, PLYO | plate hops = MODERATE plyo track 1 (they also appear in the jumping-ankle list); an intermediate athlete takes one exercise from each MODERATE track |
| Bilateral Lateral Plate Hops (Forward On / Sideways Off-and-On / Forward Down, Repeat) | LIB-05 | FILED UNDER SEVERAL PATTERNS: ANKLE, PLYO | plate hops = MODERATE plyo track 1 (they also appear in the jumping-ankle list); an intermediate athlete takes one exercise from each MODERATE track |
| Single-Leg Backward Zig-Zag Jumps | LIB-05 | FILED UNDER SEVERAL PATTERNS: ANKLE, PLYO | plate hops = MODERATE plyo track 1 (they also appear in the jumping-ankle list); an intermediate athlete takes one exercise from each MODERATE track |
| Single-Leg Depth Drop | LIB-05 | FILED UNDER SEVERAL PATTERNS: ANKLE, PLYO | plate hops = MODERATE plyo track 1 (they also appear in the jumping-ankle list); an intermediate athlete takes one exercise from each MODERATE track |
| Single-Leg Forward Zig-Zag Jumps | LIB-05 | FILED UNDER SEVERAL PATTERNS: ANKLE, PLYO | plate hops = MODERATE plyo track 1 (they also appear in the jumping-ankle list); an intermediate athlete takes one exercise from each MODERATE track |
| Single-Leg Lateral Plate Hops - Inner Leg (Alternating) | LIB-05 | FILED UNDER SEVERAL PATTERNS: ANKLE, PLYO | plate hops = MODERATE plyo track 1 (they also appear in the jumping-ankle list); an intermediate athlete takes one exercise from each MODERATE track |
| Single-Leg Lateral Plate Hops - Inner/Outer Leg | LIB-05 | FILED UNDER SEVERAL PATTERNS: ANKLE, PLYO | plate hops = MODERATE plyo track 1 (they also appear in the jumping-ankle list); an intermediate athlete takes one exercise from each MODERATE track |
| Single-Leg Lateral Plate Hops - Outer Leg (Alternating) | LIB-05 | FILED UNDER SEVERAL PATTERNS: ANKLE, PLYO | plate hops = MODERATE plyo track 1 (they also appear in the jumping-ankle list); an intermediate athlete takes one exercise from each MODERATE track |
| Single-Leg Plate Hops | LIB-05 | FILED UNDER SEVERAL PATTERNS: ANKLE, PLYO | plate hops = MODERATE plyo track 1 (they also appear in the jumping-ankle list); an intermediate athlete takes one exercise from each MODERATE track |
| Squat Clean | LIB-07 | ASSUMPTION: BYOP 'Clean ' (no 'Power') read as the full squat clean of the Olympic tab - confirm. | full squat version confirmed |
| Squat Snatch | LIB-07 | ASSUMPTION: BYOP 'Snatch ' read as the squat snatch - confirm. | full squat version confirmed |
| GHD - Glute-Ham Developer (hip extension / glute-ham raise) | LIB-08 | AMBIGUOUS: listed at MODERATE (AN48) and ADVANCED (AN93) with no variant named (back extension vs glute-ham raise). | no levels; one GHD record |
| Kong Row (double-KB row from the floor) | LIB-09 | UNCLEAR NAME: probably Kroc rows (INFERRED). | Kong row = double-KB row from the floor |
| Standing DB Overhead Press | LIB-11 | DUPLICATE IN DROPDOWN: written twice (AA50/AA51, AB13/AB14); the second is probably 'Standing Barbell Press' (RP E15 lis | second listing reassigned to the standing barbell press |
| Barbell Push Jerk | LIB-13 | LEVEL QUESTION: listed FOUNDATIONAL (AA14). | push jerk = intermediate/advanced |
| Barbell Push Jerk | LIB-13 | FILED UNDER SEVERAL PATTERNS: TX, VPUSH | resistance pool VERTICAL PUSH; also allowed in the power (triple extension) slot, where it counts as power reps (VOL-10) |
| Barbell Push Press | LIB-13 | LEVEL QUESTION: listed FOUNDATIONAL (AA12). | push press confirmed as the easier, foundational option |
| Barbell Push Press | LIB-13 | FILED UNDER SEVERAL PATTERNS: TX, VPUSH | resistance pool VERTICAL PUSH; also allowed in the power (triple extension) slot, where it counts as power reps (VOL-10) |
| DB Push Jerk | LIB-13 | LEVEL QUESTION: listed FOUNDATIONAL (AA13). | push jerk = intermediate/advanced |
| DB Push Press | LIB-13 | LEVEL QUESTION: power/skill lift listed FOUNDATIONAL (AA11). | push press confirmed as the easier, foundational option |
| Barbell Thruster | LIB-14 | CROSS-LISTING: in VERTICAL PUSH ADVANCED (AA55) and BILATERAL KNEE DOMINANT ADVANCED (AI103). | conditioning-leaning; counts 1.0 quads + 0.5 shoulders wherever it is picked (LIB-14; v1 had 0.25, corrected); v1.1: + 0.25 glutes (COACH-R2 R2-VOL-05) |
| Barbell Thruster | LIB-14 | FILED UNDER SEVERAL PATTERNS: BKD, VPUSH | conditioning-leaning; counts 1.0 quads + 0.5 shoulders wherever it is picked (LIB-14; v1 had 0.25, corrected); v1.1: + 0.25 glutes (COACH-R2 R2-VOL-05) |
| DB Thruster (front squat into overhead press) | LIB-14 | CROSS-LISTING: in VERTICAL PUSH ADVANCED (AA54) and BILATERAL KNEE DOMINANT ADVANCED (AI102). | conditioning-leaning; counts 1.0 quads + 0.5 shoulders wherever it is picked (LIB-14; v1 had 0.25, corrected); v1.1: + 0.25 glutes (COACH-R2 R2-VOL-05) |
| DB Thruster (front squat into overhead press) | LIB-14 | FILED UNDER SEVERAL PATTERNS: BKD, VPUSH | conditioning-leaning; counts 1.0 quads + 0.5 shoulders wherever it is picked (LIB-14; v1 had 0.25, corrected); v1.1: + 0.25 glutes (COACH-R2 R2-VOL-05) |
| Single-Arm DB Thruster | LIB-14 | CROSS-LISTING: VERTICAL PUSH UNILATERAL (AA94) and BILATERAL KNEE DOMINANT ADVANCED (AI104 'Single arm DB thruster'). | conditioning-leaning; counts 1.0 quads + 0.5 shoulders wherever it is picked (LIB-14; v1 had 0.25, corrected); v1.1: + 0.25 glutes (COACH-R2 R2-VOL-05) |
| Single-Arm DB Thruster | LIB-14 | FILED UNDER SEVERAL PATTERNS: BKD, VPUSH | conditioning-leaning; counts 1.0 quads + 0.5 shoulders wherever it is picked (LIB-14; v1 had 0.25, corrected); v1.1: + 0.25 glutes (COACH-R2 R2-VOL-05) |
| Leg Extension (machine) | LIB-15 | LABEL CONFLICT: AM3 zone reads 'RP-BS-KNEE DOMINANT -ADVANCED' but the machine appears in all three AI blocks (AI20/AI55 | label was a typo; available at every level |
| Leg Extension (machine) | LIB-15 | FILED UNDER SEVERAL PATTERNS: BKD, KEXT | pool LEG EXTENSIONS only; counts 1.0 quads (VOL-09) |
| Lying Leg Curl (machine) | LIB-15 | LABEL QUESTION: AR5 says 'UNILATERAL' and AR3 has no zone code. | label was a typo; available at every level |
| Seated Leg Curl (machine) | LIB-15 | LABEL QUESTION: AR5 says 'UNILATERAL' and AR3 has no zone code. | label was a typo; available at every level |
| Parallel-Bar Dip | LIB-16 | CROSS-LISTING: HORIZONTAL PUSH (chest) in the main library (AD96) but under 'TRICEP 👇' in the focus list (AZ128). | 0.5 chest + 0.5 triceps |
| Ball Hamstring Curl (medball or stability ball) | LIB-17 | MERGED NEAR-DUPLICATES: AN17 'Harmstring medball curls' (FOUNDATIONAL), AN19 'swiss ball hamstring curls' (FOUNDATIONAL) | near-duplicates merged (coach confirmed) |
| Bent-Over Barbell Row | LIB-17 | NEAR-DUPLICATE of 'Bent Over Rows Pronated Grip' (X49). | near-duplicate merged into this record |
| Side Plank (elbow) | LIB-17 | CROSS-LISTING: in CORE THORAX MODERATE (O47/P9) and CORE PELVIS MODERATE (O164/R46/S9). | near-duplicates merged (coach confirmed) |
| Side Plank (elbow) | LIB-17 | FILED UNDER SEVERAL PATTERNS: CB, CP, CT | 'Side Plank' (thorax) and 'Side Planks' (pelvis) are one record; every core pattern feeds the same Core slot |
| Standing DB Calf Raise (deficit optional) | LIB-17 | MERGED NEAR-DUPLICATES: AU10 (deficit), AU11 'Calf Raises w/ DB ', AZ332. | near-duplicates merged (coach confirmed) |
| Distance Test: 21.6 mile Run | LIB-18 | ODD VALUE: matches no standard race distance; DISTANCE TEST block duplicated (B24-B33 and B89-B98). | partly: the coach calls it a marathon; the 21.6 vs 26.2 mi mismatch is still OPEN (6.3, 10.2 #1) |
| Step-Up (forward and lateral) | LIB-20 | PLANE QUESTION: RP files 'lateral step up' under UNILATERAL SAGITAL (C18). | the lateral step-up is frontal-plane work (UNI-12 lists lateral step-ups with the frontal moves); record plane = multi (forward sagittal + lateral frontal) |
| Acceleration Starts | LIB-21 | FILED UNDER SEVERAL PATTERNS: PLYO, SPRINT | speed-session step 2 - MACH drills / acceleration starts |
| Mach Sprint Drills (A-March / A-Skip / A-Run) | LIB-21 | FILED UNDER SEVERAL PATTERNS: PLYO, SPRINT | speed-session step 2 - MACH drills / acceleration starts |
| Max-Velocity Sprint (Top Speed) | LIB-21 | SSC TIER: Sheet23 '*SPRINT*' (B51/B52); filed in ADVANCED JUMPING (Sheet23 I4 'ADVANCED - AP -JUMPING'; BYOP G128 ADVANC | speed-session step 3 - max-velocity sprint |
| Squirrel Jumps | LIB-21 | SSC TIER: Sheet23 footer '*FASTEST SSC*' (B43/B44). | speed-session step 1 - fastest SSC (squirrel jumps) |

### 6.2b Flags closed by round-2 answers (v1.1)

| record | answer | v1 flag (abridged) | how it was resolved |
|---|---|---|---|
| KB Face Pull (as written; face pulls are normally done on a cable) | R2-LIB-04 / LIB-10 | PENDING LIB-10 - PLACEMENT CONFLICT: rear-delt / horizontal pattern filed under VERTICAL PULL (U20); RP files 'Face pull | moved to shoulder work (SIDE RAISES pool, rear delt); swap only |
| Bench Push-Up - Hands on Bench (incline) | R2-LIB-05 / LIB-12 | PENDING LIB-12 - LEVEL CONFLICT: FOUNDATIONAL in AD13 but ADVANCED in AF11 and Sheet23 Z4; RP I11 yellow (intermediate). | split into two records: hands on bench (FOUNDATIONAL, AD13) and feet on bench (ADVANCED, AF11 / Sheet23 Z4) |
| Bench Push-Up - Hands on Bench (incline) | R2-LIB-05 / LIB-12 | PENDING LIB-12 - LEVEL DIFFERS BY SOURCE: BYOP ['foundational', 'advanced'] vs OBSERVED reference levels ['intermediate' | split into two records: hands on bench (FOUNDATIONAL, AD13) and feet on bench (ADVANCED, AF11 / Sheet23 Z4) |
| Distance Test: 21.6 mile Run | R2-LIB-06 | DISTANCE MISMATCH: the coach says the '21.6 mile run' is a marathon ('thats a marathon, dont know when/where we need tha | record retired: the 21.6 mi run is removed from plans and tests |

### 6.3 Flags still open (active records)

**VERBATIM TYPOS KEPT IN ALIASES** (31)

- Hang Power Clean - from the Low Hang (below the knee) - VERBATIM TYPOS KEPT IN ALIASES: 'POWER CLEAN FROM THE LOW HANG (BELLOW KNEE)'
- Hang Power Snatch - from the Low Hang (below the knee) - VERBATIM TYPOS KEPT IN ALIASES: 'POWER SNATCH FROM THE LOW HANG (BELLOW THE KNEE)'
- Medball Lateral Cossack Lunge with Forward Reach - VERBATIM TYPOS KEPT IN ALIASES: 'Medball Reach forward Lateral Cosak lunge'
- Medball Lateral Cossack Lunge with Overhead Reach - VERBATIM TYPOS KEPT IN ALIASES: 'Medball Reach UP Lateral Cosak lunge'
- Medball Reverse Lunge with Down-and-Back Cross-Body Reach - VERBATIM TYPOS KEPT IN ALIASES: 'Medball revere lunge down & back cross reach'
- Medball Stationary Lunge (Split Squat) with Medball Held Forward - VERBATIM TYPOS KEPT IN ALIASES: 'Medball down over front leg stationay lunge + *Same lunge variations but medball forward'
- Medball Stationary Lunge (Split Squat) with Medball Hug - VERBATIM TYPOS KEPT IN ALIASES: 'Medball down over front leg stationay lunge + *Same lunge variations but medball hug'
- Medball Stationary Lunge (Split Squat) with Medball Up - VERBATIM TYPOS KEPT IN ALIASES: 'Medball down over front leg stationay lunge + *Same lunge variation but medball up'
- Medball Stationary Lunge (Split Squat) with Reach Down Over the Front Leg - VERBATIM TYPOS KEPT IN ALIASES: 'Medball down over front leg stationay lunge'
- Flipped Hex Bar Squat (low handles, longer range) - VERBATIM TYPOS KEPT IN ALIASES: 'Fliped hex bar squats'
- Cossack Lateral Lunge - VERBATIM TYPOS KEPT IN ALIASES: 'Cosak lateral lunges'
- Ball Hamstring Curl (medball or stability ball) - VERBATIM TYPOS KEPT IN ALIASES: 'Harmstring MedBall Curls'; 'Medicine or Stability Ball Harmstring Curls'
- Prone Dumbbell Hamstring Curl (DB between feet) - VERBATIM TYPOS KEPT IN ALIASES: 'DB Harmstring Curls'
- Sumo Deadlift - VERBATIM TYPOS KEPT IN ALIASES: 'Summo Deadlift'
- Supine Slider Hamstring Curl - VERBATIM TYPOS KEPT IN ALIASES: 'Supine Glidder hamstring curls'
- Chest-Supported Row - VERBATIM TYPOS KEPT IN ALIASES: 'Chest suported row'
- Inverted Row - VERBATIM TYPOS KEPT IN ALIASES: 'Paralell reverse pushup (rings/trx/barbell/smith machine)'
- Strict Pull-Up (Feet Behind) - VERBATIM TYPOS KEPT IN ALIASES: 'Stricted Pull-Up feet behind you'
- Strict Pull-Up (Feet in Front / hollow) - VERBATIM TYPOS KEPT IN ALIASES: 'Stricted Pull-ups feet in front'
- Decline Push-Up (feet elevated) - VERBATIM TYPOS KEPT IN ALIASES: 'Declined Pushups'
- DB Overhead Press (seated/standing not stated) - VERBATIM TYPOS KEPT IN ALIASES: 'Bd overhead Press'
- Seesaw DB Press (alternating, one up / one down) - VERBATIM TYPOS KEPT IN ALIASES: 'Sesaw Db Press'
- Machine Reverse Fly (rear-delt pec deck) - VERBATIM TYPOS KEPT IN ALIASES: 'Machine reverse fliez'
- Cable Triceps Pushdown - V-Grip - VERBATIM TYPOS KEPT IN ALIASES: 'V grip tricep extentions'
- EZ-Bar Skullcrusher - VERBATIM TYPOS KEPT IN ALIASES: 'EZ bar Skull crusher'
- Landmine Rotations - standing or kneeling - VERBATIM TYPOS KEPT IN ALIASES: 'Landline standing/kneeling rotations'
- Copenhagen Plank - VERBATIM TYPOS KEPT IN ALIASES: 'Coppenhaggen Plank'
- Turkish Get-Ups - VERBATIM TYPOS KEPT IN ALIASES: 'turkish gettups'
- Lunge load position: Double Suitcase (DB/KB in each hand) - VERBATIM TYPOS KEPT IN ALIASES: 'Duble suitcase'
- Carry > Unilateral [heading - no exercises yet] - VERBATIM TYPOS KEPT IN ALIASES: 'UNILARTERAL'
- Drags > Sagittal [heading - no exercises yet] - VERBATIM TYPOS KEPT IN ALIASES: 'SAGITAL'

**FILED UNDER SEVERAL PATTERNS** (13)

- Broad Jump - FILED UNDER SEVERAL PATTERNS: ANKLE, PLYO
- Depth Drop (height not stated) - FILED UNDER SEVERAL PATTERNS: ANKLE, PLYO
- Medball Squat Jumps - FILED UNDER SEVERAL PATTERNS: ANKLE, PLYO
- Single-Leg Box Jump - FILED UNDER SEVERAL PATTERNS: ANKLE, PLYO
- Tuck Jumps - FILED UNDER SEVERAL PATTERNS: ANKLE, PLYO
- Barbell Overhead Squat - FILED UNDER SEVERAL PATTERNS: BKD, TX
- Incline Barbell Bench Press - FILED UNDER SEVERAL PATTERNS: HPUSH, MRPUSH
- Incline DB Bench Press - FILED UNDER SEVERAL PATTERNS: HPUSH, MRPUSH
- Half-Kneeling Single-Arm Landmine Press - FILED UNDER SEVERAL PATTERNS: MRPUSH, VPUSH
- Standing DB Calf Raise (deficit optional) - FILED UNDER SEVERAL PATTERNS: CALF, CT
- Plank (forearm / low plank) - FILED UNDER SEVERAL PATTERNS: CB, CT
- Sit-Up - FILED UNDER SEVERAL PATTERNS: CB, CT
- [Progression note] Bigger plates -> restart at Bilateral Lateral Plate Hops - FILED UNDER SEVERAL PATTERNS: ANKLE, PLYO

**PLACEMENT CONFLICT** (3)

- Renegade Row - PLACEMENT CONFLICT: alternating movement sitting in a 'BILATERAL SYMMETRICAL' block (X54).
- Half-Kneeling Single-Arm Landmine Press - PLACEMENT CONFLICT: BYOP UNILATERAL vertical push (AA93) vs RP MID RANGE PUSH (bilateral).
- Hanging Rotational Knee/Leg Raise - PLACEMENT CONFLICT: rotational movement filed in the SAGITAL (foundational) pelvis block (O130/R12); compare 'Hanging rotational knees to chest' (ADVANCED/TRANSVERSE).

**LEVEL DIFFERS BY SOURCE** (3)

- Barbell Z-Press (seated on floor) - LEVEL DIFFERS BY SOURCE: BYOP ['advanced'] vs OBSERVED reference levels ['intermediate', 'advanced'] ((NOT DONE) RESISTANCE PATTERNS E11 intermediate)
- DB Z-Press (seated on floor) - LEVEL DIFFERS BY SOURCE: BYOP ['advanced'] vs OBSERVED reference levels ['intermediate', 'advanced'] ((NOT DONE) RESISTANCE PATTERNS E10 intermediate)
- Tall-Kneeling DB Overhead Press - LEVEL DIFFERS BY SOURCE: BYOP ['advanced'] vs OBSERVED reference levels ['intermediate', 'advanced'] ((NOT DONE) RESISTANCE PATTERNS E12 intermediate)

**LEVEL QUESTION** (2)

- Staggered-Stance (Kickstand) Barbell Deadlift - LEVEL QUESTION: barbell version labelled FOUNDATIONAL (AQ14) because the whole UL hip list is FOUNDATIONAL (AQ8).
- Pike Push-Up - LEVEL QUESTION: usually a handstand push-up regression but listed ADVANCED (AA53/AB16).

**UNCLEAR NAME** (2)

- Pendulum Row (machine) - or Pendlay Row (verify) - UNCLEAR NAME: pendulum row machine or Pendlay row?
- Seal Cable Row (prone, chest-supported) - or Seated Cable Row (typo ambiguous) - UNCLEAR NAME: seal row or seated cable row?

**VERSION** (2)

- Incline Barbell Bench Press - VERSION: only in 'Copy of Copy of MASTER EXERCISE' L35 among library tabs; selectable today only via Focus slots (AZ49/AZ250 'Incline barbell press').
- Machine Bench Press - VERSION: newest item (AD14); absent from both library copies and from every level view.

**SLOT FIT** (2)

- Barbell Front Raise - SLOT FIT: shoulder flexion, but offered in the 'ABdution' (side raise) slot pool.
- DB Front Raise - SLOT FIT: shoulder flexion, but offered in the 'ABdution' (side raise) slot pool.

**AMBIGUOUS (still open after LIB-02)** (1)

- Push-Up Box Jump - AMBIGUOUS (still open after LIB-02): hands onto a box (plyo push-up) vs pop-up to a box not stated.

**DATA CORRUPTION** (1)

- 5-10-5 Pro-Agility Shuttle - DATA CORRUPTION: stored as the date 2005-05-10 ('5/10/05') in BYOP L92/N10 and MASTER_MODEL Sheet23 M3 - retype as text (the sheets stay untouched; the generator uses the text).

**COACH EXCLUSION** (1)

- V-Squat (machine) - COACH EXCLUSION: 'I don't presercibe the use of these, ever.' (ALL ABOUT SQUATS I39).

**MERGED** (1)

- 45-Degree Hyperextension (back/hip extension) - MERGED: AN55 'Hyper extensions ' + AZ207 'Hyperextensions' + RP A68 '45 degree hip ext. '; distinct from GHD (AN48/AN93).

**WIRING** (1)

- Deficit Push-up (hands elevated for full ROM) - WIRING: renamed 'Deficit Push-ups' only in the flat level view AF18, which no dropdown reads; the selectable name is AD99.

**DUPLICATE IN DROPDOWN** (1)

- Incline Push-Up (hands elevated) - DUPLICATE IN DROPDOWN: listed in FOUNDATIONAL (AD12) and MODERATE (AD46).

**OTHER** (1)

- Face-Up Triceps Push-Away (supine; technique unconfirmed) - UNCLEAR TECHNIQUE.

**CAT-08 NOTE** (1)

- Copenhagen Plank - CAT-08 NOTE: the coach calls the Copenhagen plank 'a little bit more complicated' for the thorax/pelvis rule; kept in CORE PELVIS.

**FORMAT** (1)

- Distance Repeat: 400 m - FORMAT: the only bold item in the CARDIO column (B125); meaning unknown.

**LONGER THAN THE HALF MARATHON (v1.1 adversarial check)** (3)

- Distance Test: 14 mile Run - COACH-R2 R2-LIB-06 approved 'the longest run stays the half-marathon plan'; keep or remove? (10.3 #5)
- Distance Test: 17 mile Run - same flag (10.3 #5)
- Distance Test: 20 mile Run - same flag (10.3 #5)

The VERBATIM TYPOS flags are informational: the sheets keep the coach's spelling, the generator uses the corrected names (COACH-ANSWER FIX-04).

## 7. Out of scope and retired (v1, v1.1)

### 7.1 Bands, chains, weight releasers (out of scope; never generated)

Coach: 'I don't do bands. I don't program anything with bands' (EQ-01); 'In my model, bands are not something that you're going to make changes to your body with' (EQ-02); 'Band chops are, to me, worthless' (EQ-07); 'I don't want any bands in the program' (EQ-08); 'No variable resistance should be available in this for now. We will work with that later on' (EQ-12). Each out-of-scope record keeps its aliases and program usage (OBSERVED) and names a non-band replacement.

| record | id | v0 type | pattern | answer | program uses | non-band replacement |
|---|---|---|---|---|---|---|
| Band-Assisted Pull-Up | band-assisted-pull-up | exercise | VPULL | EQ-01 | 0 | Assisted Pull-Up Machine (Pronated Grip); Jumping Pull-up; Seated Ring/TRX Pull-Up (feet-supported) |
| Banded Overhead Triceps Extension | banded-overhead-triceps-extension | exercise | TRI | EQ-01 | 1 | Overhead Dumbbell Triceps Extension; Overhead Cable Triceps Extension |
| Banded Single-Arm Lat Pulldown (fast) | banded-single-arm-lat-pulldown-fast | exercise | VPULL | EQ-01 | 2 | Single-Arm Lat Pulldown |
| Banded Tantrums (resisted sprint in place) | banded-tantrums-resisted-sprint-in-place | exercise | SPRINT | EQ-01 | 1 | Acceleration Starts; Falling-Start Accelerations |
| Half-Kneeling Crunch Chop Down (high-to-low) into Active Knee - Knee-Banded Adduction | half-kneeling-crunch-chop-down-high-to-low-into-active-knee-knee-banded-adductio | exercise | AOS | EQ-01 | 0 | Tall-Kneeling Cable Crunch Chop Down (high-to-low) - Object Squeezed Between Knees |
| Half-Kneeling Crunch Chop Midline (horizontal) into Active Knee - Knee-Banded Adduction | half-kneeling-crunch-chop-midline-horizontal-into-active-knee-knee-banded-adduct | exercise | AOS | EQ-01 | 0 | Tall-Kneeling Cable Crunch Chop Midline (horizontal) - Object Squeezed Between Knees |
| Half-Kneeling Crunch Chop Up / Lift (low-to-high) into Active Knee - Knee-Banded Adduction | half-kneeling-crunch-chop-up-lift-low-to-high-into-active-knee-knee-banded-adduc | exercise | AOS | EQ-01 | 0 | Tall-Kneeling Cable Crunch Chop Up / Lift (low-to-high) - Object Squeezed Between Knees |
| Half-Kneeling Pallof Hold - Knee-Banded Adduction | half-kneeling-pallof-hold-knee-banded-adduction | exercise | AOS | EQ-01 | 0 | Tall-Kneeling Pallof Hold (cable) - Object Squeezed Between Knees |
| Single-Arm Band Row | single-arm-band-row | exercise | HPULL | EQ-01 | 0 | Single-Arm DB/KB Row; Inverted Row; TRX Row (suspension row) |
| Split-Stance Pallof Hold - Knee-Banded Adduction | split-stance-pallof-hold-knee-banded-adduction | exercise | AOS | EQ-01 | 0 | Tall-Kneeling Pallof Hold (cable) - Object Squeezed Between Knees |
| Split-Stance Standing Crunch Chop Down (high-to-low) into Active Knee - Knee-Banded Adduction | split-stance-standing-crunch-chop-down-high-to-low-into-active-knee-knee-banded- | exercise | AOS | EQ-01 | 0 | Tall-Kneeling Cable Crunch Chop Down (high-to-low) - Object Squeezed Between Knees |
| Split-Stance Standing Crunch Chop Midline (horizontal) into Active Knee - Knee-Banded Adduction | split-stance-standing-crunch-chop-midline-horizontal-into-active-knee-knee-bande | exercise | AOS | EQ-01 | 0 | Tall-Kneeling Cable Crunch Chop Midline (horizontal) - Object Squeezed Between Knees |
| Split-Stance Standing Crunch Chop Up / Lift (low-to-high) into Active Knee - Knee-Banded Adduction | split-stance-standing-crunch-chop-up-lift-low-to-high-into-active-knee-knee-band | exercise | AOS | EQ-01 | 0 | Tall-Kneeling Cable Crunch Chop Up / Lift (low-to-high) - Object Squeezed Between Knees |
| Squat with One Hip Banded Out (left or right) | squat-with-one-hip-banded-out-left-or-right | exercise | BKD | EQ-01 | 0 | Squat Holding an Object Between the Knees (adduction squeeze); Cossack Lateral Lunge |
| Squat with Tube Bands Around the Hips (lateral band pull) | squat-with-tube-bands-around-the-hips-lateral-band-pull | exercise | BKD | EQ-01 | 0 | Squat Holding an Object Between the Knees (adduction squeeze); Side (Lateral) Lunge |
| Banded Leg Extension (seated on bench) | banded-leg-extension-seated-on-bench | exercise | KEXT | EQ-08 | 0 | DB Leg Extension (seated on box); Sissy Squat |
| Banded Rolling Hamstring Curl | banded-rolling-hamstring-curl | exercise | KFLEX | EQ-08 | 2 | Supine Slider Hamstring Curl; Ball Hamstring Curl (medball or stability ball); Nordic Hamstring Curl |
| Band-Assisted (Reverse-Banded) Bench Press | band-assisted-reverse-banded-bench-press | exercise | HPUSH | EQ-12 | 2 | Barbell Bench Press |
| Banded Barbell Deadlift (accommodating resistance) | banded-barbell-deadlift-accommodating-resistance | exercise | BHD | EQ-12 | 7 | Barbell Deadlift (conventional) |
| Banded Bench Press (accommodating resistance, speed) | banded-bench-press-accommodating-resistance-speed | exercise | HPUSH | EQ-12 | 6 | Barbell Bench Press |
| Banded Box Squat - any variation, touch-and-go | banded-box-squat-any-variation-touch-and-go | exercise | BKD | EQ-12 | 0 | Box Squat, any loading - touch-and-go (fast) |
| Banded Front Squat (accommodating resistance) | banded-front-squat-accommodating-resistance | exercise | BKD | EQ-12 | 1 | Front Squat (barbell) |
| Banded KB Swing | banded-kb-swing | exercise | BHD | EQ-12 | 4 | Kettlebell Swing (Russian) |
| Bilateral Reverse-Banded Hops (band-assisted pogo hops) | bilateral-reverse-banded-hops-band-assisted-pogo-hops | exercise | PLYO | EQ-12 | 0 | Bilateral Repeat Hops (continuous pogo hops) |
| Bilateral Reverse-Banded Jumps (band-assisted repeat jumps) | bilateral-reverse-banded-jumps-band-assisted-repeat-jumps | exercise | PLYO | EQ-12 | 0 | Bilateral Repeat Jumps (continuous full-amplitude jumps) |
| Box Squat - dead-stop 'deload' (bottom banded) | box-squat-dead-stop-deload-bottom-banded | exercise | BKD | EQ-12 | 0 | Box Squat - any variation, dead-stop ('Deload' = sit and unload on the box) |
| Chained Barbell Deadlift (accommodating resistance) | chained-barbell-deadlift-accommodating-resistance | exercise | BHD | EQ-12 | 3 | Barbell Deadlift (conventional) |
| Loading variable: BANDS | mod-loading-variable-bands | modifier | MODIFIER | EQ-12 | 0 | (modifier - no replacement needed) |
| Loading variable: CHAINS | mod-loading-variable-chains | modifier | MODIFIER | EQ-12 | 0 | (modifier - no replacement needed) |
| Loading variable: WEIGHT RELEASERS | mod-loading-variable-weight-releasers | modifier | MODIFIER | EQ-12 | 0 | (modifier - no replacement needed) |
| Reverse-Banded (Band-Assisted) Squat Jumps (French contrast element 4 - assisted/overspeed plyo) | reverse-banded-band-assisted-squat-jumps-french-contrast-element-4-assisted-over | exercise | PLYO | EQ-12 | 0 | Squat Jump (high, bodyweight or lightly loaded); Bilateral Repeat Hops (continuous pogo hops) |
| Reverse-Banded Box Squat - any variation, touch-and-go | reverse-banded-box-squat-any-variation-touch-and-go | exercise | BKD | EQ-12 | 0 | Box Squat, any loading - touch-and-go (fast) |
| Reverse-Banded Box Squat - dead-stop | reverse-banded-box-squat-dead-stop | exercise | BKD | EQ-12 | 0 | Box Squat - any variation, dead-stop ('Deload' = sit and unload on the box) |
| Reverse-Banded Squat (bands anchored overhead - assistance at the bottom, fades toward lockout) | mod-reverse-banded-squat-bands-anchored-overhead-assistance-at-the-bottom-fades-towa | modifier | MODIFIER | EQ-12 | 0 | (modifier - no replacement needed) |
| Unilateral Reverse-Banded Hops | unilateral-reverse-banded-hops | exercise | PLYO | EQ-12 | 0 | Unilateral Repeat Hops (single-leg continuous pogo hops) |
| Unilateral Reverse-Banded Jumps | unilateral-reverse-banded-jumps | exercise | PLYO | EQ-12 | 0 | Unilateral Repeat Jumps (continuous single-leg jumps / bounds) |

Band set-up removed, record kept (18): Assisted Pull-up (machine) (now T3); Assisted Dips (machine) (now T3); Face Pull (now T3); Upward Face Pull (low-to-high / overhead finish) (now T3); Bench Pallof Plank (plank on a bench with cable anti-rotation) (now T3); Cable Oblique Rotation (cable rotational twist) (now T3); Cable Woodchopper (cable chop) (now T2); Pallof Hold (isometric) (now T3); Pallof Press (now T3); Rotational Crunch Chop Down (high-to-low) - Supine, Object Squeezed Between Knees (now T3); Rotational Crunch Chop Midline (horizontal) - Supine, Object Squeezed Between Knees (now T3); Rotational Crunch Chop Up / Lift (low-to-high) - Supine, Object Squeezed Between Knees (now T3); Supine Floor Pallof Hold (cable) - Object Squeezed Between Knees (now T3); Supine Offset Plank with Contralateral Cable Adduction (now T3); Tall-Kneeling Cable Crunch Chop Down (high-to-low) - Object Squeezed Between Knees (now T3); Tall-Kneeling Cable Crunch Chop Midline (horizontal) - Object Squeezed Between Knees (now T3); Tall-Kneeling Cable Crunch Chop Up / Lift (low-to-high) - Object Squeezed Between Knees (now T3); Tall-Kneeling Pallof Hold (cable) - Object Squeezed Between Knees (now T3).

### 7.2 Retired by the coach

| record | id | answer | why | use instead (INFERRED, same slot) |
|---|---|---|---|---|
| Squat with Rotational Strap - Rotating In (internal-rotation bias) | squat-with-rotational-strap-rotating-in-internal-rotation-bias | LIB-09 | coach: 'The strap rotating in and out, you can take that one away, doesn't matter.' (overrides the strap rotations named in the LIB-20 assumption) | Squat Holding an Object Between the Knees (adduction squeeze); Cossack Lateral Lunge |
| Squat with Rotational Strap - Rotating Out (external-rotation bias) | squat-with-rotational-strap-rotating-out-external-rotation-bias | LIB-09 | coach: 'The strap rotating in and out, you can take that one away, doesn't matter.' (overrides the strap rotations named in the LIB-20 assumption) | Squat Holding an Object Between the Knees (adduction squeeze); Cossack Lateral Lunge |
| Camporini Deadlift (unilateral-bias deadlift variant; exact set-up not defined in the sheets) | camporini-deadlift-unilateral-bias-deadlift-variant-exact-set-up-not-defined-in- | LIB-09 | coach: 'For the Camporini deadlift, you can ignore that one.' Program cells that named it (ATHLETIC 'HEAVY: Camporini DL', BASEBALL 'camporini dl') translate to another Unilateral HD exercise | Staggered-Stance (Kickstand) DB Deadlift; Single-Leg RDL / Single-Leg Deadlift; Alternating Staggered-Stance Single-Leg Deadlift (DB) |
| Distance Test: 21.6 mile Run | distance-test-21-6-mile-run | R2-LIB-06 (v1.1) | the coach approved removing it from plans and tests (it was flagged in v1: he called it a marathon, which is 26.2 mi) | Race Day: Half Marathon (13.1 mi); Continuous Distance Run (half-marathon plan) - the half-marathon plan is the longest run, used as-is |

### 7.3 Program cells whose components are out of scope or retired

| type | program text | component and v1 status | non-band replacement |
|---|---|---|---|
| generic_choice | HEAVY Single arm rotational half kneeling cable row or band row or Bird Dog Row | Single-Arm Band Row -> out of scope (EQ-01) | Single-Arm DB/KB Row; Inverted Row; TRX Row (suspension row) |
| generic_choice | Pull ups or banded assisted pull ups | Band-Assisted Pull-Up -> out of scope (EQ-01) | Assisted Pull-Up Machine (Pronated Grip); Jumping Pull-up; Seated Ring/TRX Pull-Up (feet-supported) |
| complex | Back squats/banded jumps/DB squat jumps/ high ankle hops | Reverse-Banded (Band-Assisted) Squat Jumps (French contrast element 4 - assisted/overspeed plyo) -> out of scope (EQ-12) | Squat Jump (high, bodyweight or lightly loaded); Bilateral Repeat Hops (continuous pogo hops) |
| complex | Front squats/high jumps/hex bar squat jumps/ banded assisted hops | Bilateral Reverse-Banded Hops (band-assisted pogo hops) -> out of scope (EQ-12) | Bilateral Repeat Hops (continuous pogo hops) |

## 8. Exercises the BYOP library does not have

These are dropdown swaps, not default picks, unless a coach answer added them (COACH-ANSWER CAT-07: the BYOP MASTER EXERCISE LIBRARY is the single source of truth; COACH-R2 R2-LIB-07 confirms that the ~120 program-only exercises stay swaps until he adds them, and added four of them). The v1.1 PROPOSED-ADDITION records are listed in section 2.8.

### 8.1 Named only in MASTER_MODEL program tabs (program_only, 121 active records)

| pattern | record | tier | uses | programs | v1 notes |
|---|---|---|---|---|---|
| ANKLE | Double-Unders (jump rope) | T1 | 19 | CROSSFIT SPLIT |  |
| ANKLE | Jump Rope | T1 | 1 |  |  |
| ANKLE | Quick-Feet Toe Taps on Step | T0 | 1 | BASEBALL |  |
| ARMCARE | Half-Kneeling Shoulder Roll (arm care) | T0 | 2 | BASEBALL |  |
| ARMCARE | Kettlebell Arm Bar (arm care) | T2 | 4 | BASEBALL |  |
| ARMCARE | Side-Lying DB Drop & Catch (reactive shoulder) | T2 | 1 | BASEBALL |  |
| BHD | Deadlift (implement not stated) | T3 | 65 | 4 TRACKS - AESTHETICS (bodybuilding style); 4 TRACKS - STRENGTH (conjugate style); ATHLETIC FULL BODY; BASEBALL; BOXING  |  |
| BHD | Deficit Barbell Deadlift | T3 | 6 | 4 TRACKS - AESTHETICS (bodybuilding style); 4 TRACKS - STRENGTH (conjugate style); CONJUGATE (NOT DONE) |  |
| BIC | Biceps Curl - any kind | T2 | 32 | 4 TRACKS - STRENGTH (conjugate style); BASEBALL; CONJUGATE (NOT DONE); UPPER/LOWER |  |
| BIC | DB 'No Money' Curl | T2 | 2 | BASEBALL |  |
| BIC | DB Curl to Press | T2 | 5 | BASEBALL; FAT BURN / BODY TONING |  |
| BIC | Single-Arm DB Preacher Curl | T2 | 1 | BASEBALL |  |
| BKD | Oscillating Drop Squat | T0 | 1 | BASEBALL |  |
| BKD | Smith Machine Squat | T3 | 4 | FAT BURN / BODY TONING |  |
| CALF | Calf Raise - any | T0 | 6 | PUSH/PULL/LEGS; UPPER/LOWER |  |
| CALF | Single-Leg Deficit Calf Raise (weighted) | T2 | 1 |  |  |
| CARDIO | 20 s Fast / 40 s Slow Intervals (any cardio) | T0 | 2 | BOXING 8 WEEK BUILD UP |  |
| CARDIO | Any Cardio Equipment - 5 min warm-up | T0 | 15 | PUSH/PULL/LEGS; UPPER/LOWER |  |
| CARDIO | Bike Calorie Sprint (assault/air bike) | T3 | 19 | BASEBALL |  |
| CARDIO | Burpees | T0 | 2 | FAT BURN / BODY TONING |  |
| CARDIO | Jumping Jacks | T0 | 2 | FAT BURN / BODY TONING |  |
| CARDIO | Rower Calorie Sprint | T3 | 10 | BASEBALL |  |
| CARDIO | Short Sprint Intervals (15-30 s work : 30 s-2 min walk) | T0 | 8 | 4 TRACKS - HYBRID (strength-athletic-crossfitish) |  |
| CARDIO | SkiErg Calorie Sprint | T3 | 13 | BASEBALL |  |
| CARDIO | Steady-State Easy Cardio (15-40 min, any modality) | T0 | 38 | 4 TRACKS - AESTHETICS (bodybuilding style); 4 TRACKS - HYBRID (strength-athletic-crossfitish); BASEBALL; BOXING 8 WEEK B |  |
| CB | Cross-Body Mountain Climber | T0 | 5 | BASEBALL |  |
| CB | Hollow Rocks | T0 | 4 | ATHLETIC FULL BODY; BASEBALL |  |
| CB | Side Plank Hip Lifts (slow) | T0 | 1 | BASEBALL |  |
| CB | Side Plank Knee-to-Elbow | T0 | 1 |  |  |
| CB | Side Plank Press (advanced: star side plank press) | T2 | 1 | ATHLETIC FULL BODY |  |
| CB | Single-Arm / Single-Leg Turkish Sit-up | T0 | 1 | BASEBALL |  |
| CB | Star Side Plank | T0 | 5 | BASEBALL |  |
| CB | Star Supine Cross Connect | T0 | 5 | ATHLETIC FULL BODY; BASEBALL |  |
| CB | Star Toe Touches | T0 | 1 |  |  |
| CORE | 'Plate core' (plate-loaded core drill, not specified) | T2 | 2 |  |  |
| CORE | Core - coach's choice (unspecified) | T0 | 32 |  |  |
| CP | Copenhagen Raise (dynamic) | T0 | 1 | BASEBALL |  |
| CP | Hip Raises ('hips raises') | T0 | 1 | BASEBALL |  |
| CP | Mountain Climber | T0 | 2 | FAT BURN / BODY TONING |  |
| CP | Slider Runners (mountain-climber style) | T0 | 1 |  |  |
| CP | Swiss Ball Knee Tuck | T2 | 2 |  |  |
| CT | Bicycle Crunch | T0 | 5 | BASEBALL; FAT BURN / BODY TONING |  |
| CT | Butterfly Sit-up | T0 | 2 | BASEBALL |  |
| CT | KB Book Opener | T2 | 3 | PUSH/PULL/LEGS |  |
| CT | Lateral Crunch | T0 | 1 | BASEBALL |  |
| CT | Plank DB Pull-Through | T2 | 1 | BASEBALL |  |
| HPULL | Bent-Over Seesaw DB Row (alternating) | T2 | 2 | BASEBALL |  |
| HPULL | Bird Dog Row (DB) | T2 | 1 |  |  |
| HPULL | Row - any horizontal pull | T3 | 8 | 4 TRACKS - AESTHETICS (bodybuilding style) |  |
| HPULL | Seal DB Row (grip not stated) | T3 | 4 | BASEBALL; BOXING 8 WEEK BUILD UP |  |
| HPULL | Seal Row (implement/grip not stated) | T3 | 15 | 4 TRACKS - STRENGTH (conjugate style); BASEBALL; CONJUGATE (NOT DONE) |  |
| HPUSH | Hand-Switch Push-up | T0 | 1 |  |  |
| HPUSH | Machine Dip | T3 | 20 |  |  |
| KFLEX | Slider Hamstring Runners (alternating) | T0 | 8 | BASEBALL |  |
| KFLEX | Swiss Ball Kicks (30 s) | T2 | 2 | BASEBALL |  |
| PLYO | Alternating Split-Stance Jumps (front foot on box) | T0 | 1 | BASEBALL |  |
| PLYO | DB Snap Down | T2 | 2 | BASEBALL |  |
| PLYO | DB Staggered-Stance Switch Jump | T2 | 1 | BASEBALL |  |
| PLYO | Fast Rhythmic Quarter Squats | T0 | 1 |  |  |
| PLYO | Front-Foot-Elevated Lunge Jumps (bodyweight) | T0 | 1 |  |  |
| PLYO | Hex-Bar Jump Squat | T3 | 7 | ATHLETIC FULL BODY; BASEBALL | ADDED R2-LIB-07 (FOUNDATIONAL triple extension, default candidate) |
| PLYO | Hurdle Hops into Box Jump | T1 | 2 | BASEBALL |  |
| PLYO | Lateral Box Step-up Jump | T0 | 1 |  |  |
| PLYO | RFE Lunge Jumps (suitcase DB) | T2 | 3 | BASEBALL |  |
| PLYO | Seated Box Jump (sit-to-jump onto box) | T0 | 4 | BASEBALL |  |
| PLYO | Single-Leg Broad Jump | T0 | 1 | BASEBALL |  |
| PLYO | Single-Leg Hops into Single-Leg Box Jump | T0 | 2 | BASEBALL |  |
| PLYO | Single-Leg to March Jumps | T0 | 5 | ATHLETIC FULL BODY; BASEBALL; BOXING 8 WEEK BUILD UP |  |
| PLYO | Skater Jumps (lateral bounds) | T0 | 2 | BASEBALL |  |
| PLYO | Split-Stance Squat Jumps (lunge jumps) | T0 | 2 | BASEBALL |  |
| PLYO | Squat Jump (high, bodyweight or lightly loaded) | T0 | 8 | 4 TRACKS - STRENGTH (conjugate style); ATHLETIC FULL BODY; BASEBALL; CONJUGATE (NOT DONE) |  |
| PLYO | Staggered-Stance Box Jump | T0 | 4 | BASEBALL |  |
| PLYO | Weighted Depth Jump into High Box Jump | T2 | 1 | ATHLETIC FULL BODY |  |
| SHLD | Rear-Delt DB Row | T2 | 2 | BASEBALL | rear delt |
| SPRINT | Fast Run / Walk Back ('NOT a sprint') | T0 | 3 | BASEBALL |  |
| SPRINT | High-Knee Runs | T0 | 2 | ATHLETIC FULL BODY |  |
| SPRINT | Short Fast Run / Sprint Buy-out (10-30 s) | T0 | 21 | BASEBALL |  |
| THROW | Half-Kneeling Medball Rotation In & Step Out | T2 | 2 | BASEBALL |  |
| THROW | Half-Kneeling Rotational Medball Slam | T2 | 2 | BASEBALL |  |
| THROW | Half-Kneeling Rotational Overhead Medball Side Slam | T2 | 3 | BASEBALL |  |
| THROW | In/Out-of-Hip Rotational Medball Scoop | T2 | 3 | BASEBALL |  |
| THROW | Lateral Hinge to Medball Chest Pass | T2 | 1 | BASEBALL |  |
| THROW | Lateral Hinge to Medball Scoop | T2 | 1 | BASEBALL |  |
| THROW | Lateral Lunge to Medball Scoop | T2 | 1 | BASEBALL |  |
| THROW | Medball Cheat-Sheet Throw List (*MEDBALLS) | T2 | 6 | ATHLETIC FULL BODY; BOXING 8 WEEK BUILD UP |  |
| THROW | Medball Floor Catch & Release Push | T2 | 1 | BASEBALL |  |
| THROW | Medball Overhead Toss to Rotational Scoop | T2 | 2 | BASEBALL |  |
| THROW | Overhead Medball Slam | T2 | 2 | BASEBALL |  |
| THROW | Rotational Overhead Medball Toss | T2 | 1 | BASEBALL |  |
| THROW | Seated Back-to-Wall Rotational Medball Toss | T2 | 2 | BASEBALL |  |
| THROW | Step-Back to Rotational Medball Chest Pass | T2 | 2 | BASEBALL |  |
| THROW | Supine (Lay-Down) Medball Press Throw | T2 | 2 | BASEBALL |  |
| TRI | Bench Dip | T0 | 2 |  |  |
| TRI | JM Press | T3 | 16 | 4 TRACKS - AESTHETICS (bodybuilding style); 4 TRACKS - STRENGTH (conjugate style) |  |
| TRI | Triceps - any kind | T3 | 11 | 4 TRACKS - AESTHETICS (bodybuilding style); UPPER/LOWER |  |
| TX | Clean Pull (start position not stated) | T3 | 4 | 4 TRACKS - HYBRID (strength-athletic-crossfitish) |  |
| TX | DB/KB High Pull | T2 | 2 | BASEBALL |  |
| TX | Hang Clean (catch not stated) | T3 | 12 | BASEBALL | renamed (R2-GEN-06); ADDED to the library R2-LIB-07 (FOUNDATIONAL, default candidate) |
| TX | Hang Power Clean (hang height not stated) | T3 | 2 |  |  |
| TX | Hang Snatch (catch not stated) | T3 | 12 | BASEBALL | renamed (R2-GEN-06: no '% of 1RM' in the name; adversarial check) |
| TX | KB Squat Clean | T2 | 6 | BASEBALL | ADDED R2-LIB-07 (FOUNDATIONAL, default candidate) |
| TX | Single-Arm DB Push / Split Jerk | T2 | 1 | BASEBALL |  |
| TX | Single-Arm DB Snatch | T2 | 3 | BASEBALL; BOXING 8 WEEK BUILD UP | ADDED R2-LIB-07 (FOUNDATIONAL, default candidate) |
| TX | Snatch Pull (start position not stated) | T3 | 3 | 4 TRACKS - HYBRID (strength-athletic-crossfitish) |  |
| TX | Staggered-Stance DB Hang Snatch | T2 | 3 | ATHLETIC FULL BODY |  |
| UHD | Single-Leg RDL / Single-Leg Deadlift | T2 | 49 | 4 TRACKS - AESTHETICS (bodybuilding style); ATHLETIC FULL BODY; BOXING 8 WEEK BUILD UP; FAT BURN / BODY TONING; PUSH/PUL |  |
| UKD | Jefferson Lunge | T3 | 1 | BOXING 8 WEEK BUILD UP |  |
| UKD | Medball Rotational Alternating FFE Reverse Lunge | T2 | 1 | BASEBALL |  |
| UKD | RFE Split-Squat Isometric Hold (suitcase DB) | T2 | 1 |  |  |
| UKD | Step-up to Knee Drive | T0 | 1 | BASEBALL |  |
| VPULL | Close-Grip Pull-up | T1 | 4 | 4 TRACKS - STRENGTH (conjugate style); CONJUGATE (NOT DONE) |  |
| VPULL | Jumping Pull-up | T1 | 2 |  |  |
| VPULL | Neutral-Grip Lat Pulldown | T3 | 16 | 4 TRACKS - AESTHETICS (bodybuilding style) |  |
| VPUSH | Arnold Press (DB) | T2 | 6 | 4 TRACKS - AESTHETICS (bodybuilding style); BASEBALL |  |
| VPUSH | Half-Kneeling Single-Arm DB Press | T2 | 2 | BASEBALL |  |
| VPUSH | Handstand Skill Work (H.S.) | T0 | 9 |  |  |
| VPUSH | Medball Press (vertical push slot) | T2 | 2 | BASEBALL |  |
| VPUSH | Overhead Press (implement not stated) | T2 | 11 | 4 TRACKS - AESTHETICS (bodybuilding style); FAT BURN / BODY TONING |  |
| VPUSH | Seesaw DB Push Press | T2 | 3 | ATHLETIC FULL BODY; BASEBALL |  |
| VPUSH | Single-Arm DB Overhead Press | T2 | 1 | BASEBALL |  |
| VPUSH | Single-Arm DB Push Press | T2 | 4 | BASEBALL |  |

### 8.2 In MASTER_MODEL reference tabs but not in the BYOP library (reference_only, 215 active records)

| pattern | record | level | tier | reference tab(s) | program uses | v1 notes |
|---|---|---|---|---|---|---|
| BHD | American KB Swing (overhead) | intermediate | T2 | (NOT DONE) RESISTANCE PATTERNS | 0 | R2-VOL-05: ballistic, 0 sets; TX pool |
| BHD | Hip Thrust (implement not stated) | any | T0 | Sheet25 | 0 |  |
| BIC | Barbell Reverse Curl (pronated) | any | T3 | (NOT DONE) RESISTANCE PATTERNS | 1 |  |
| BIC | DB Pronated (Reverse) Curl | any | T2 | (NOT DONE) RESISTANCE PATTERNS | 0 |  |
| BKD | Barbell Overhead Squat | advanced | T3 | (NOT DONE) ALL ABOUT OLYMPIC LI; (NOT DONE) RESISTANCE PATTERNS; ALL ABOUT SQUATS | 0 |  |
| BKD | Pin Squat (squat from / to safety pins) | advanced | T3 | (NOT DONE) RESISTANCE PATTERNS | 0 |  |
| BKD | Plate-Reach Forward Squat (counterbalance squat) | foundational | T2 | (NOT DONE) RESISTANCE PATTERNS | 0 |  |
| BKD | Safety Squat Bar (SSB) Squat | advanced | T3 | (NOT DONE) RESISTANCE PATTERNS | 0 |  |
| BKD | Squat - any loading ('Whatever Squat') | advanced | T3 | ALL ABOUT SQUATS; Sheet25 | 1 |  |
| BKD | Squat Holding an Object Between the Knees (adduction squeeze) | foundational | T0 | (NOT DONE) RESISTANCE PATTERNS | 0 | ADDED LIB-20 |
| BKD | V-Squat (machine) | unrated | T3 | ALL ABOUT SQUATS | 0 | never; pref 'DON'T LIKE IT' |
| CARDIO | Aerobic A (blue): 10X10m Sprints | foundational | T0 | AEROBIC CAPACITY CHEAT SHEET | 0 |  |
| CARDIO | Aerobic A (blue): 15 Sec Run/ 45 Sec Walk | foundational | T0 | AEROBIC CAPACITY CHEAT SHEET | 0 |  |
| CARDIO | Aerobic A (blue): 20 Sec Run/ 40 Sec Walk | foundational | T0 | AEROBIC CAPACITY CHEAT SHEET | 0 |  |
| CARDIO | Aerobic A (blue): 30 Sec Run/ 30 Sec Walk | intermediate | T0 | AEROBIC CAPACITY CHEAT SHEET | 0 |  |
| CARDIO | Aerobic A (blue): 40 Sec Run/ 20 Sec Walk | intermediate | T0 | AEROBIC CAPACITY CHEAT SHEET | 0 |  |
| CARDIO | Aerobic B (green): 1 Minute run/ 3 Min Walk | foundational | T0 | AEROBIC CAPACITY CHEAT SHEET | 0 |  |
| CARDIO | Aerobic B (green): 2 Minute run/ 4 Min Walk | foundational | T0 | AEROBIC CAPACITY CHEAT SHEET | 0 |  |
| CARDIO | Aerobic B (green): 3 Minute Run/ 3 Min Walk | foundational | T0 | AEROBIC CAPACITY CHEAT SHEET | 0 |  |
| CARDIO | Aerobic C (orange): 11 Minute Run/ 2 Min Walk | foundational | T0 | AEROBIC CAPACITY CHEAT SHEET | 0 |  |
| CARDIO | Aerobic C (orange): 2 Mile Run | foundational | T0 | AEROBIC CAPACITY CHEAT SHEET | 0 |  |
| CARDIO | Aerobic C (orange): 5 Minute Run/ :30 Sec Walk | foundational | T0 | AEROBIC CAPACITY CHEAT SHEET | 0 |  |
| CARDIO | Aerobic C (orange): 8 Minute Run/ 1 Minute Walk | foundational | T0 | AEROBIC CAPACITY CHEAT SHEET | 0 |  |
| CARDIO | Continuous Distance Run (half-marathon plan) | unrated | T0 | Sheet24 | 0 |  |
| CARDIO | Distance/Pace Workout - not specified ('Workouts involving distances and paces') | unrated | T0 | Sheet24 | 0 |  |
| CARDIO | Fast Run Repeats (200 m fast; 150 m fast / 250 m walk) | unrated | T0 | Sheet24 | 0 |  |
| CARDIO | Flat Sprints (40-80 m, full recovery) | unrated | T0 | Sheet24 | 0 |  |
| CARDIO | Hill Sprints (8-20 s, full recovery) | unrated | T0 | Sheet24 | 0 |  |
| CARDIO | Lactate Clearance: 1 min FASTEST/ 20 Sec MODERATE/ 2 Min EASY | advanced | T0 | AEROBIC CAPACITY CHEAT SHEET | 0 |  |
| CARDIO | Lactate Clearance: 1 min MODERATE/20 Sec FASTEST/ 2 Min EASY | advanced | T0 | AEROBIC CAPACITY CHEAT SHEET | 0 |  |
| CARDIO | Lactate Clearance: 2 Min FAST/ 2 Min EASY | advanced | T0 | AEROBIC CAPACITY CHEAT SHEET | 0 |  |
| CARDIO | Lactate Clearance: 2 Min FASTEST/ 3 Min MODERATE | advanced | T0 | AEROBIC CAPACITY CHEAT SHEET | 0 |  |
| CARDIO | Lactate Clearance: 2 Min FASTEST/ 4 Min MODERATE | advanced | T0 | AEROBIC CAPACITY CHEAT SHEET | 0 |  |
| CARDIO | Lactate Clearance: 2 min FASTEST/ 30 Sec MODERATE/ 1 Min EASY | advanced | T0 | AEROBIC CAPACITY CHEAT SHEET | 0 |  |
| CARDIO | Lactate Clearance: 2 min MODERATE/ 30 Sec FASTEST/ 1 Min EASY | advanced | T0 | AEROBIC CAPACITY CHEAT SHEET | 0 |  |
| CARDIO | Lactate Clearance: 3 Min FAST/ 1 Min EASY | advanced | T0 | AEROBIC CAPACITY CHEAT SHEET | 0 |  |
| CARDIO | Lactate Clearance: 3 Min FASTEST/ 3 Min MODERATE | advanced | T0 | AEROBIC CAPACITY CHEAT SHEET | 0 |  |
| CARDIO | Lactate Clearance: 4 Min FAST/ 2 Min EASY | advanced | T0 | AEROBIC CAPACITY CHEAT SHEET | 0 |  |
| CARDIO | Lactate Clearance: 5 Min FAST/ 1 Min EASY | advanced | T0 | AEROBIC CAPACITY CHEAT SHEET | 0 |  |
| CARDIO | Lactate Clearance: 5 Min FASTEST | advanced | T0 | AEROBIC CAPACITY CHEAT SHEET | 0 |  |
| CARDIO | Lactate Clearance: :30 sec FASTEST/ 20 Sec MODERATE/ 1 Min EASY | advanced | T0 | AEROBIC CAPACITY CHEAT SHEET | 0 |  |
| CARDIO | Lactate Clearance: :30 sec FASTEST/ 30 Sec MODERATE/ 1 Min EASY | advanced | T0 | AEROBIC CAPACITY CHEAT SHEET | 0 |  |
| CARDIO | Lactate Clearance: :30 sec MODERATE/ 1 Min FASTEST/ 1 Min EASY | advanced | T0 | AEROBIC CAPACITY CHEAT SHEET | 0 |  |
| CARDIO | Lactate Clearance: :30 sec MODERATE/20 Sec FASTEST/ 1 Min EASY | advanced | T0 | AEROBIC CAPACITY CHEAT SHEET | 0 |  |
| CARDIO | Progression Run (easy -> moderate -> hard) | unrated | T0 | Sheet24 | 0 |  |
| CARDIO | Race Day: Half Marathon (13.1 mi) | unrated | T0 | Sheet24 | 0 |  |
| CARDIO | Split-Day Run (a.m. + p.m.) | unrated | T0 | Sheet24 | 0 |  |
| CARDIO | Taper Run (comfortable pace) | unrated | T0 | Sheet24 | 0 |  |
| CB | Bear Crawl | foundational | T0 | CONTROL PATTERNSCORE | 1 |  |
| CB | Bird Dogs | foundational | T0 | CONTROL PATTERNSCORE | 0 |  |
| CB | Break Dancers (bear/crab-position thread-through rotations) | intermediate | T0 | CONTROL PATTERNSCORE | 0 |  |
| CB | Cross Connect (rolls / rocking / hold) | foundational | T0 | CONTROL PATTERNSCORE | 0 |  |
| CB | Dead Bugs | foundational | T0 | CONTROL PATTERNSCORE | 2 |  |
| CB | Elbow Oblique Sit (side-lying oblique hold on the elbow) | intermediate | T0 | CONTROL PATTERNSCORE | 6 |  |
| CB | High (Straight-Arm) Side Plank | intermediate | T0 | CONTROL PATTERNSCORE | 0 |  |
| CB | High Plank (straight-arm plank) | foundational | T0 | CONTROL PATTERNSCORE | 0 |  |
| CB | Kettlebell Windmills - kneeling or standing | advanced | T2 | CONTROL PATTERNSCORE | 0 |  |
| CB | L-Sit Hold | advanced | T0 | CONTROL PATTERNSCORE | 0 |  |
| CB | Plank Supermans (held) | intermediate | T0 | CONTROL PATTERNSCORE | 0 |  |
| CB | Star V-Ups (cross-body / diagonal V-ups) | advanced | T0 | CONTROL PATTERNSCORE | 0 |  |
| CB | Supermans | foundational | T0 | CONTROL PATTERNSCORE | 0 |  |
| CB | Turkish Get-Ups | advanced | T2 | CONTROL PATTERNSCORE | 0 |  |
| COD | Eight-Square Plyometric Formation (8-box hop grid) | intermediate | T0 | AGILITYCOD PATTERNS | 0 |  |
| COD | Four-Square Formation (4-box hop grid) | foundational | T0 | AGILITYCOD PATTERNS | 0 |  |
| COD | Hops in Place (foot-speed / reactive hops) | foundational | T0 | AGILITYCOD PATTERNS | 0 |  |
| COD | Krumrie Formation (agility drill pattern) | any | T0 | AGILITYCOD PATTERNS | 0 |  |
| COD | Munoz Formation (agility drill pattern) | any | T0 | AGILITYCOD PATTERNS | 0 |  |
| COD | Route Tree (receiver route tree) | any | T0 | AGILITYCOD PATTERNS | 0 |  |
| COD | Running Routes (pre-planned route running) | any | T0 | AGILITYCOD PATTERNS | 0 |  |
| CP | Flutter Kicks | foundational | T0 | CONTROL PATTERNSCORE | 0 |  |
| CP | Glute Bridge March | foundational | T0 | CONTROL PATTERNSCORE | 2 |  |
| CP | Hip Turns (pelvis rotations) | foundational | T0 | CONTROL PATTERNSCORE | 8 |  |
| CP | March (anti-rotation marching) | foundational | T0 | CONTROL PATTERNSCORE | 0 |  |
| CP | Medball Hanging Cross Toes to Bar (diagonal, ball between feet) | advanced | T2 | (NOT DONE) ALL ABOUT BALLISTICS | 0 |  |
| CP | Medball Hanging Knees to Chest (ball between knees/feet) | intermediate | T2 | (NOT DONE) ALL ABOUT BALLISTICS | 0 |  |
| CP | Medball Hanging Toes to Bar (ball between feet) | advanced | T2 | (NOT DONE) ALL ABOUT BALLISTICS | 0 |  |
| CP | Medball Rotational Throw - initiated from the feet (pelvis-led) | intermediate | T2 | CONTROL PATTERNSCORE | 0 |  |
| CP | Medball V-Up Switches (pass the ball hands <-> feet) | intermediate | T2 | (NOT DONE) ALL ABOUT BALLISTICS | 0 |  |
| CP | Medball V-Ups | intermediate | T2 | (NOT DONE) ALL ABOUT BALLISTICS | 0 |  |
| CP | Plank with Alternating Feet Raises | foundational | T0 | CONTROL PATTERNSCORE | 0 |  |
| CP | Single-Leg Toes to Bar | advanced | T1 | CONTROL PATTERNSCORE | 0 |  |
| CP | Windshield Wipers | intermediate | T0 | CONTROL PATTERNSCORE | 8 |  |
| CT | Bench Pallof Plank (plank on a bench with cable anti-rotation) | intermediate | T3 | CONTROL PATTERNSCORE | 0 | renamed |
| CT | Crunch Hold (isometric) | foundational | T0 | CONTROL PATTERNSCORE | 0 |  |
| CT | Kettlebell Rotational Swings (no hip thrust - trunk-driven) | intermediate | T2 | CONTROL PATTERNSCORE | 0 | R2-VOL-05: tagged ballistic, stays a core drill |
| CT | Landmine Rotations - standing or kneeling | intermediate | T3 | CONTROL PATTERNSCORE | 0 |  |
| CT | Medball Ab Rollouts (hands on medball) | intermediate | T2 | (NOT DONE) ALL ABOUT BALLISTICS | 1 |  |
| CT | Medball Plank Rockers | intermediate | T2 | (NOT DONE) ALL ABOUT BALLISTICS | 6 |  |
| CT | Medball Rotational Throw - initiated from the hands (thorax-led) | intermediate | T2 | CONTROL PATTERNSCORE | 0 |  |
| CT | Offset Planks (asymmetric support or load) | intermediate | T0 | CONTROL PATTERNSCORE | 0 |  |
| CT | Pallof Hold (isometric) | foundational | T3 | CONTROL PATTERNSCORE | 0 |  |
| CT | Pallof Press | foundational | T3 | CONTROL PATTERNSCORE | 0 |  |
| CT | Plank Shoulder Taps | foundational | T0 | CONTROL PATTERNSCORE | 3 |  |
| CT | Plank to Side Plank (rotating) | intermediate | T0 | CONTROL PATTERNSCORE | 0 |  |
| CT | Single-Side (Suitcase) Carry | foundational | T2 | CONTROL PATTERNSCORE | 3 |  |
| CT | Swiss Ball Plate Torso Rotations | intermediate | T2 | CONTROL PATTERNSCORE | 3 |  |
| CT | Up-Down Planks (forearm <-> hand plank) | foundational | T0 | CONTROL PATTERNSCORE | 2 |  |
| HPULL | Bent-Over DB or KB Row (two-arm) | intermediate | T2 | (NOT DONE) RESISTANCE PATTERNS | 8 |  |
| HPULL | Bent-Over Hex Bar Row | intermediate | T3 | (NOT DONE) RESISTANCE PATTERNS | 0 |  |
| HPULL | Chest-Supported Row | foundational | T2 | (NOT DONE) RESISTANCE PATTERNS | 12 |  |
| HPULL | Half-Kneeling Single-Arm Cable Row | intermediate | T3 | (NOT DONE) RESISTANCE PATTERNS | 2 |  |
| HPULL | Kong Row (double-KB row from the floor) | foundational | T2 | (NOT DONE) RESISTANCE PATTERNS | 0 | renamed; low stimulus |
| HPULL | Pendulum Row (machine) - or Pendlay Row (verify) | intermediate | T3 | (NOT DONE) RESISTANCE PATTERNS | 0 |  |
| HPULL | Seal Cable Row (prone, chest-supported) - or Seated Cable Row (typo ambiguous) | intermediate | T3 | (NOT DONE) RESISTANCE PATTERNS | 0 |  |
| HPULL | Single-Arm Machine Row | any | T3 | (NOT DONE) RESISTANCE PATTERNS | 0 |  |
| HPUSH | Kneeling Push-Up - One Hand Higher (offset) | intermediate | T0 | (NOT DONE) RESISTANCE PATTERNS | 0 |  |
| KEXT | DB Leg Extension (seated on box) | any | T2 | (NOT DONE) RESISTANCE PATTERNS | 0 |  |
| MRPUSH | Incline Cable Press (on bench) | intermediate | T3 | (NOT DONE) RESISTANCE PATTERNS | 0 |  |
| MRPUSH | Incline DB Bench Press - Feet on Wall | intermediate | T2 | (NOT DONE) RESISTANCE PATTERNS | 0 |  |
| MRPUSH | Standing Landmine Press | intermediate | T3 | (NOT DONE) RESISTANCE PATTERNS | 0 |  |
| MRPUSH | Standing Viking Press | intermediate | T3 | (NOT DONE) RESISTANCE PATTERNS | 0 |  |
| PLYO | Bilateral Backward Hops | any | T0 | AEROBIC CAPACITY CHEAT SHEET | 0 |  |
| PLYO | Bilateral Forward Hops | any | T0 | AEROBIC CAPACITY CHEAT SHEET | 0 |  |
| PLYO | Bilateral Hop On To (small-amplitude hop onto a plate/low box) | foundational | T0 | (NOT DONE) ALL ABOUT BALLISTICS | 0 |  |
| PLYO | Bilateral Jump On To (box jump, land softly on top) | foundational | T0 | (NOT DONE) ALL ABOUT BALLISTICS | 7 |  |
| PLYO | Bilateral Repeat Hops (continuous pogo hops) | foundational | T0 | (NOT DONE) ALL ABOUT BALLISTICS | 0 |  |
| PLYO | Bilateral Repeat Jumps (continuous full-amplitude jumps) | intermediate | T0 | (NOT DONE) ALL ABOUT BALLISTICS | 4 |  |
| PLYO | Bilateral Weighted Drop, Release the Weight & Hop | advanced | T2 | (NOT DONE) ALL ABOUT BALLISTICS | 0 |  |
| PLYO | Broad Jump | intermediate | T0 | Sheet23 | 3 |  |
| PLYO | Depth Drop (height not stated) | intermediate | T0 | Sheet23 | 5 |  |
| PLYO | Double Bounce - Bilateral (two quick pulses on landing, then go) | intermediate | T0 | (NOT DONE) ALL ABOUT BALLISTICS | 0 |  |
| PLYO | Double Bounce - Unilateral | advanced | T0 | (NOT DONE) ALL ABOUT BALLISTICS | 0 |  |
| PLYO | Drop & Double Bounce - Bilateral (step off box, land, two pulses) | advanced | T0 | (NOT DONE) ALL ABOUT BALLISTICS | 0 |  |
| PLYO | Drop & Double Bounce - Unilateral | advanced | T0 | (NOT DONE) ALL ABOUT BALLISTICS | 0 |  |
| PLYO | Drop (Bilateral) & Hop - depth drop into a quick small hop | advanced | T0 | (NOT DONE) ALL ABOUT BALLISTICS | 0 |  |
| PLYO | Fake Medball Slam & Return (any way possible) - upper-body/trunk amortization drill | intermediate | T0 | (NOT DONE) ALL ABOUT BALLISTICS | 0 |  |
| PLYO | Medball Squat Jumps | intermediate | T2 | Sheet23 | 0 |  |
| PLYO | Single-Leg Box Jump | intermediate | T0 | Sheet23 | 3 |  |
| PLYO | Single-Leg In-Place Hops | any | T0 | AEROBIC CAPACITY CHEAT SHEET | 0 |  |
| PLYO | Stick the Landing - Bilateral (jump/drop and freeze the landing) | foundational | T0 | (NOT DONE) ALL ABOUT BALLISTICS | 0 |  |
| PLYO | Stick the Landing - Unilateral (single-leg landing, freeze) | intermediate | T0 | (NOT DONE) ALL ABOUT BALLISTICS | 1 |  |
| PLYO | Unilateral Hop On To (single-leg hop onto a plate/low box) | intermediate | T0 | (NOT DONE) ALL ABOUT BALLISTICS | 2 |  |
| PLYO | Unilateral Repeat Hops (single-leg continuous pogo hops) | intermediate | T0 | (NOT DONE) ALL ABOUT BALLISTICS | 0 |  |
| PLYO | Unilateral Repeat Jumps (continuous single-leg jumps / bounds) | advanced | T0 | (NOT DONE) ALL ABOUT BALLISTICS | 0 |  |
| PLYO | Unilateral Weighted Drop, Release the Weight & Hop | advanced | T2 | (NOT DONE) ALL ABOUT BALLISTICS | 0 |  |
| PLYO | Weighted Stick the Landing - Bilateral (DBs/vest, freeze the landing) | intermediate | T2 | (NOT DONE) ALL ABOUT BALLISTICS | 10 |  |
| PLYO | Weighted Stick the Landing - Unilateral | advanced | T2 | (NOT DONE) ALL ABOUT BALLISTICS | 1 |  |
| SHLD | Face Pull | any | T3 | (NOT DONE) RESISTANCE PATTERNS | 8 | rear delt |
| SHLD | Incline-Bench Prone DB T-Raise | any | T2 | (NOT DONE) RESISTANCE PATTERNS | 0 | rear delt |
| SHLD | Incline-Bench Prone DB Y-Raise | any | T2 | (NOT DONE) RESISTANCE PATTERNS | 0 | rear delt |
| SHLD | KB Upright Row | any | T2 | (NOT DONE) RESISTANCE PATTERNS | 0 | side delt |
| SHLD | Lateral Raise - 'Spill the Can' (thumbs down, internally rotated) | intermediate | T2 | (NOT DONE) RESISTANCE PATTERNS | 0 | side delt |
| SHLD | Upward Face Pull (low-to-high / overhead finish) | any | T3 | (NOT DONE) RESISTANCE PATTERNS | 0 | rear delt |
| SPRINT | A-March (running drill) | any | T0 | AEROBIC CAPACITY CHEAT SHEET | 6 | ADDED LIB-21; speed step 2 |
| SPRINT | A-Runs (high-knee running drill) | any | T0 | AEROBIC CAPACITY CHEAT SHEET | 6 | ADDED LIB-21; speed step 2 |
| SPRINT | A-Skip (running drill) | any | T0 | AEROBIC CAPACITY CHEAT SHEET | 6 | ADDED LIB-21; speed step 2 |
| SPRINT | Acceleration Starts | any | T0 | Sheet23 | 6 | ADDED LIB-21; speed step 2 |
| SPRINT | Falling-Start Accelerations | any | T0 | AEROBIC CAPACITY CHEAT SHEET | 0 | ADDED LIB-21; speed step 2 |
| SPRINT | Mach Sprint Drills (A-March / A-Skip / A-Run) | any | T0 | Sheet23 | 0 | ADDED LIB-21; speed step 2 |
| THROW | Back Lunge with Contralateral Load into March, Contralateral Scoop | any | T2 | (NOT DONE) ALL ABOUT BALLISTICS | 0 |  |
| THROW | Bent-Over Medball Floor Slam | any | T2 | (NOT DONE) ALL ABOUT BALLISTICS | 0 |  |
| THROW | Front/Back Staggered-Stance Medball Cross Throw Down | any | T2 | (NOT DONE) ALL ABOUT BALLISTICS | 0 |  |
| THROW | Front/Back Staggered-Stance Medball Cross Throw Down & Back | any | T2 | (NOT DONE) ALL ABOUT BALLISTICS | 0 |  |
| THROW | Lateral V Throw Down | any | T2 | (NOT DONE) ALL ABOUT BALLISTICS | 0 |  |
| THROW | Lateral-Stance Floor Chop Throw | any | T2 | (NOT DONE) ALL ABOUT BALLISTICS | 0 |  |
| THROW | Reverse Lunge with Inside Floor Slam | any | T2 | (NOT DONE) ALL ABOUT BALLISTICS | 0 |  |
| THROW | Rotational Split-Stance Floor Slam | any | T2 | (NOT DONE) ALL ABOUT BALLISTICS | 0 |  |
| THROW | Side-to-Side Shuffle Floor Slam (height matters) | any | T2 | (NOT DONE) ALL ABOUT BALLISTICS | 0 |  |
| TRI | Cable Triceps Pushdown - V-Grip | any | T3 | (NOT DONE) RESISTANCE PATTERNS | 0 |  |
| TRI | Face-Up Triceps Push-Away (supine; technique unconfirmed) | any | T3 | (NOT DONE) RESISTANCE PATTERNS | 0 |  |
| TRI | Rope Triceps Push-down (neutral grip) | any | T3 | (NOT DONE) RESISTANCE PATTERNS; Sheet23 | 5 |  |
| TX | Hang Power Clean - from the High Hang (hip crease) | foundational | T3 | (NOT DONE) ALL ABOUT OLYMPIC LI | 0 |  |
| TX | Hang Power Clean - from the Low Hang (below the knee) | intermediate | T3 | (NOT DONE) ALL ABOUT OLYMPIC LI | 1 |  |
| TX | Hang Power Clean - from the Mid Hang (knee) | foundational | T3 | (NOT DONE) ALL ABOUT OLYMPIC LI | 0 |  |
| TX | Hang Power Snatch - from the High Hang | intermediate | T3 | (NOT DONE) ALL ABOUT OLYMPIC LI | 0 |  |
| TX | Hang Power Snatch - from the Low Hang (below the knee) | intermediate | T3 | (NOT DONE) ALL ABOUT OLYMPIC LI | 0 |  |
| TX | Hang Power Snatch - from the Mid Hang (knee) | intermediate | T3 | (NOT DONE) ALL ABOUT OLYMPIC LI | 0 |  |
| TX | Hang Squat Clean (full-depth catch from the hang) | advanced | T3 | (NOT DONE) ALL ABOUT OLYMPIC LI | 0 |  |
| TX | High-Hang Squat Snatch | advanced | T3 | (NOT DONE) ALL ABOUT OLYMPIC LI | 0 |  |
| TX | Low-Hang Squat Clean (below the knee, full-depth catch) | advanced | T3 | (NOT DONE) ALL ABOUT OLYMPIC LI | 0 |  |
| TX | Low-Hang Squat Snatch | advanced | T3 | (NOT DONE) ALL ABOUT OLYMPIC LI | 0 |  |
| TX | Overhead Box Squat (snatch-grip overhead squat to a box) | advanced | T3 | (NOT DONE) ALL ABOUT OLYMPIC LI | 0 |  |
| TX | Split Jerk | advanced | T3 | (NOT DONE) ALL ABOUT OLYMPIC LI | 0 |  |
| TX | Standing Drop Overhead Squat (drop snatch / snatch-balance type: drop from standing into an overhead squat) | advanced | T3 | (NOT DONE) ALL ABOUT OLYMPIC LI | 0 |  |
| TX | Standing Drop Power Snatch (tall / no-dip power snatch - pull under from standing) | intermediate | T3 | (NOT DONE) ALL ABOUT OLYMPIC LI | 0 |  |
| UHD | Split-Stance Contralateral Single-Arm KB Swing | intermediate | T2 | (NOT DONE) RESISTANCE PATTERNS | 0 | ADDED LIB-20; R2-VOL-05: ballistic, 0 sets; TX pool |
| UHD | Staggered-Stance Hex Bar Deadlift | foundational | T3 | (NOT DONE) RESISTANCE PATTERNS | 0 |  |
| UKD | Cossack Lateral Lunge | intermediate | T0 | (NOT DONE) RESISTANCE PATTERNS | 0 | ADDED LIB-20 |
| UKD | Lunge (variation not stated) | any | T0 | Sheet25 | 16 |  |
| VPULL | Lat Pull-over (cable) | foundational | T3 | (NOT DONE) RESISTANCE PATTERNS | 22 | renamed |
| WARMUP | Medball FFE Split Squat/Lunge with Medball Held Forward | any | T2 | (NOT DONE) ALL ABOUT BALLISTICS | 0 |  |
| WARMUP | Medball FFE Split Squat/Lunge with Medball Hug | any | T2 | (NOT DONE) ALL ABOUT BALLISTICS | 0 |  |
| WARMUP | Medball FFE Split Squat/Lunge with Medball Up | any | T2 | (NOT DONE) ALL ABOUT BALLISTICS | 0 |  |
| WARMUP | Medball FFE Split Squat/Lunge with Reach Down Over the Front Leg | any | T2 | (NOT DONE) ALL ABOUT BALLISTICS | 0 |  |
| WARMUP | Medball Forward Lunge with Cross-Body Turn | any | T2 | (NOT DONE) ALL ABOUT BALLISTICS | 0 |  |
| WARMUP | Medball Forward Lunge with Down-and-Back Cross-Body Reach | any | T2 | (NOT DONE) ALL ABOUT BALLISTICS | 0 |  |
| WARMUP | Medball Forward Lunge with Forward Reach | any | T2 | (NOT DONE) ALL ABOUT BALLISTICS | 0 |  |
| WARMUP | Medball Forward Lunge with Medball Held Forward | any | T2 | (NOT DONE) ALL ABOUT BALLISTICS | 0 |  |
| WARMUP | Medball Forward Lunge with Medball Hug | any | T2 | (NOT DONE) ALL ABOUT BALLISTICS | 0 |  |
| WARMUP | Medball Forward Lunge with Medball Up | any | T2 | (NOT DONE) ALL ABOUT BALLISTICS | 0 |  |
| WARMUP | Medball Forward Lunge with Overhead Reach | any | T2 | (NOT DONE) ALL ABOUT BALLISTICS | 0 |  |
| WARMUP | Medball Forward Lunge with Reach Down Over the Front Leg | any | T2 | (NOT DONE) ALL ABOUT BALLISTICS | 0 |  |
| WARMUP | Medball Front-Hold Squat (ball held out in front) | any | T2 | (NOT DONE) ALL ABOUT BALLISTICS | 0 |  |
| WARMUP | Medball Ground-to-Overhead | any | T2 | (NOT DONE) ALL ABOUT BALLISTICS | 0 |  |
| WARMUP | Medball Hug Goblet Squat | any | T2 | (NOT DONE) ALL ABOUT BALLISTICS | 0 |  |
| WARMUP | Medball Lateral Cossack Lunge with Forward Reach | any | T2 | (NOT DONE) ALL ABOUT BALLISTICS | 0 |  |
| WARMUP | Medball Lateral Cossack Lunge with Overhead Reach | any | T2 | (NOT DONE) ALL ABOUT BALLISTICS | 0 |  |
| WARMUP | Medball RFE Split Squat (Bulgarian) with Medball Held Forward | any | T2 | (NOT DONE) ALL ABOUT BALLISTICS | 0 |  |
| WARMUP | Medball RFE Split Squat (Bulgarian) with Medball Hug | any | T2 | (NOT DONE) ALL ABOUT BALLISTICS | 0 |  |
| WARMUP | Medball RFE Split Squat (Bulgarian) with Medball Up | any | T2 | (NOT DONE) ALL ABOUT BALLISTICS | 0 |  |
| WARMUP | Medball RFE Split Squat (Bulgarian) with Reach Down Over the Front Leg | any | T2 | (NOT DONE) ALL ABOUT BALLISTICS | 0 |  |
| WARMUP | Medball Reverse Lunge with Cross-Body Turn | any | T2 | (NOT DONE) ALL ABOUT BALLISTICS | 0 |  |
| WARMUP | Medball Reverse Lunge with Down-and-Back Cross-Body Reach | any | T2 | (NOT DONE) ALL ABOUT BALLISTICS | 0 |  |
| WARMUP | Medball Reverse Lunge with Forward Reach | any | T2 | (NOT DONE) ALL ABOUT BALLISTICS | 0 |  |
| WARMUP | Medball Reverse Lunge with Medball Held Forward | any | T2 | (NOT DONE) ALL ABOUT BALLISTICS | 0 |  |
| WARMUP | Medball Reverse Lunge with Medball Hug | any | T2 | (NOT DONE) ALL ABOUT BALLISTICS | 0 |  |
| WARMUP | Medball Reverse Lunge with Medball Up | any | T2 | (NOT DONE) ALL ABOUT BALLISTICS | 0 |  |
| WARMUP | Medball Reverse Lunge with Overhead Reach | any | T2 | (NOT DONE) ALL ABOUT BALLISTICS | 0 |  |
| WARMUP | Medball Reverse Lunge with Reach Down Over the Front Leg | any | T2 | (NOT DONE) ALL ABOUT BALLISTICS | 0 |  |
| WARMUP | Medball Stationary Lunge (Split Squat) with Medball Held Forward | any | T2 | (NOT DONE) ALL ABOUT BALLISTICS | 0 |  |
| WARMUP | Medball Stationary Lunge (Split Squat) with Medball Hug | any | T2 | (NOT DONE) ALL ABOUT BALLISTICS | 0 |  |
| WARMUP | Medball Stationary Lunge (Split Squat) with Medball Up | any | T2 | (NOT DONE) ALL ABOUT BALLISTICS | 0 |  |
| WARMUP | Medball Stationary Lunge (Split Squat) with Reach Down Over the Front Leg | any | T2 | (NOT DONE) ALL ABOUT BALLISTICS | 0 |  |
| WARMUP | Medball Toe Touch to Overhead Reach | any | T2 | (NOT DONE) ALL ABOUT BALLISTICS | 0 |  |
| WARMUP | Medball Toe Touches | any | T2 | (NOT DONE) ALL ABOUT BALLISTICS | 0 |  |

### 8.3 Generic choices and complexes found in programs

| type | kind | program text | components (v1 names) | cells | tier |
|---|---|---|---|---|---|
| generic_choice | choice | Bench Press (DB or Barbell) | Flat DB Bench Press + Barbell Bench Press | 3 | T2 |
| generic_choice | choice | Cable or DB side raises | Cable Side Raise (leaning) + DB Lateral (Side) Raise | 4 | T2 |
| generic_choice | choice | DB Reverse Flies or Machine | Bent-Over DB Reverse Fly + Machine Reverse Fly (rear-delt pec deck) | 3 | T2 |
| generic_choice | choice | DB Rows or Row machine | Single-Arm DB/KB Row + Machine Row (grip not stated) | 3 | T2 |
| generic_choice | choice | Deadlifts (DB or Barbell) | Dumbbell Deadlift + Barbell Deadlift (conventional) | 6 | T2 |
| generic_choice | choice | DEF. DL or SNATCH GRIP | Deficit Barbell Deadlift + Snatch-Grip Barbell Deadlift | 2 | T3 |
| generic_choice | choice | Ez bar curls or barbell | EZ-Bar Curl + Barbell Curl | 8 | T3 |
| generic_choice | choice | HEAVY Single arm rotational half kneeling cable row or band row or Bird Dog Row | Half-Kneeling Single-Arm Cable Row + Single-Arm Band Row [out of scope (EQ-01)] + Bird Dog Row (DB) | 1 | T1 |
| generic_choice | choice | HEX BAR OR DB DL | Hex (Trap) Bar Deadlift + Dumbbell Deadlift | 3 | T2 |
| generic_choice | choice | LAT PULL DOWN/PULL UP | Lat Pulldown (grip not stated) + Pull-up (grip not stated) | 11 | T1 |
| generic_choice | choice | Leg press or just add 2 more rounds to front squats | Leg Press (machine) + Front Squat (barbell) | 4 | T3 |
| generic_choice | choice | Machine Dips or dips | Machine Dip + Parallel-Bar Dip | 20 | T2 |
| generic_choice | choice | Machine or db flies | Machine Fly (Pec Deck) + Flat DB Fly | 12 | T2 |
| generic_choice | choice | Machine or db Reverse flies | Bent-Over DB Reverse Fly + Machine Reverse Fly (rear-delt pec deck) | 8 | T2 |
| generic_choice | choice | Machine rows or db rows | Machine Row (grip not stated) + Single-Arm DB/KB Row | 16 | T2 |
| generic_choice | choice | Overhead Press (DB or Barbell) | Standing DB Overhead Press + Standing Barbell Overhead Press (strict) | 3 | T2 |
| generic_choice | choice | Pull ups or banded assisted pull ups | Pull-up (grip not stated) + Band-Assisted Pull-Up [out of scope (EQ-01)] | 2 | T1 |
| generic_choice | choice | Pull ups or Cable Lat pull down | Pull-up (grip not stated) + Lat Pulldown (grip not stated) | 2 | T1 |
| generic_choice | choice | Pull ups or Close grip cable lat pull down | Pull-up (grip not stated) + Lat Pulldown (Close Grip) | 1 | T1 |
| generic_choice | choice | Pull ups or Lat pull down | Pull-up (grip not stated) + Lat Pulldown (grip not stated) | 4 | T1 |
| generic_choice | choice | RDL/Good morning | Stiff-Leg Deadlift / RDL + Barbell Good Morning | 3 | T2 |
| generic_choice | choice | Squats or Leg Press | Squat - any loading ('Whatever Squat') + Leg Press (machine) | 6 | T3 |
| generic_choice | choice | Weighted Pull ups or max reps Close grip cable lat pull down | Weighted Pull-Up + Lat Pulldown (Close Grip) | 1 | T2 |
| generic_choice | choice | Situps / Toes to bar | Sit-Up + Toes to Bar (hanging) | 1 | T0 |
| generic_choice | choice | Situps/crunches | Sit-Up + Crunch | 1 | T0 |
| generic_choice | choice | Toes to bar or knees to chest | Toes to Bar (hanging) + Knees to Chest (hanging) | 3 | T1 |
| generic_choice | choice | 3x 10 cal row sprint or ski | Rower Calorie Sprint + SkiErg Calorie Sprint | 4 | T3 |
| generic_choice | choice | SKILL: H.S./ DUBS | Handstand Skill Work (H.S.) + Double-Unders (jump rope) | 9 | T0 |
| generic_choice | choice | SKILL: T2B/ DUBS | Toes to Bar (hanging) + Double-Unders (jump rope) | 9 | T1 |
| generic_choice | choice | Suitcase DB RFE iso holds / RFE lunge jumps | RFE Split-Squat Isometric Hold (suitcase DB) + RFE Lunge Jumps (suitcase DB) | 1 | T2 |
| complex | complex | 2x 2 clean pulls, 2 power cleans | Clean Pull (start position not stated) + Power Clean | 1 | T3 |
| complex | complex | 2x 2 snatch pulls, 2 power snatches | Snatch Pull (start position not stated) + Power Snatch | 1 | T3 |
| complex | sequence | A March/ A skips/ A runners | A-March (running drill) + A-Skip (running drill) + A-Runs (high-knee running drill) | 2 | T0 |
| complex | sequence | A Marches / A skips / A runners | A-March (running drill) + A-Skip (running drill) + A-Runs (high-knee running drill) | 1 | T0 |
| complex | sequence | A Marches, A skips, A runners | A-March (running drill) + A-Skip (running drill) + A-Runs (high-knee running drill) | 1 | T0 |
| complex | complex | Clean Pull/ hang Power Clean | Clean Pull (start position not stated) + Hang Power Clean (hang height not stated) | 1 | T3 |
| complex | superset | 45 degree hyper-extension machine - Kb swings | 45-Degree Hyperextension (back/hip extension) + Kettlebell Swing (Russian) | 1 | T3 |
| complex | superset | Bench glute Bridge & fast alternating DB seesaw floor press | Feet-Elevated Glute Bridge (feet on bench) + Alternating DB Floor Press | 1 | T2 |
| complex | superset | Bench press + superset with max pushup set (only 1 set of max pushups per set of bench) | Barbell Bench Press + Push-Up | 2 | T3 |
| complex | circuit | FF & RFE Lunge double dbs/ jumping pull ups/ db push press | Front- and Rear-Foot-Elevated Split Squat (FFE & RFE) + Jumping Pull-up + DB Push Press | 2 | T2 |
| complex | circuit | FF & RFE Lunge double dbs/ pull ups/ db strict press | Front- and Rear-Foot-Elevated Split Squat (FFE & RFE) + Pull-up (grip not stated) + Standing DB Overhead Press | 2 | T2 |
| complex | superset | Front squats + Superset with 15 squats with no weight every set | Front Squat (barbell) + Bodyweight Squat (air squat) | 4 | T3 |
| complex | superset | Front/side db rises | DB Front Raise + DB Lateral (Side) Raise | 1 | T2 |
| complex | superset | Heavy curls & Heavy tricep kickbacks 12 on each side | Biceps Curl - any kind + Dumbbell Triceps Kickback (one or both arms) | 2 | T2 |
| complex | superset | Incline bench press + superset with a set of max bench dips, one set only per set of incli | Incline Barbell Bench Press + Bench Dip | 2 | T3 |
| complex | superset | KB Swings + 12/12 Single leg Glute bridges | Kettlebell Swing (Russian) + Single-Leg Glute Bridge (foot on floor) | 1 | T2 |
| complex | superset | Leg ext. Leg Curls (FULL RANGE OF MOTION) | Leg Extension (machine) + Machine Leg Curl (seated or lying) | 2 | T3 |
| complex | superset | Side Raises + Front Raises | DB Lateral (Side) Raise + DB Front Raise | 1 | T2 |
| complex | superset | SUPERSET: DB Single leg Glute bridges + alternating seated bicep curl runners + db floor s | Single-Leg Glute Bridge (foot on floor) + Seated Dumbbell Curl + Floor Dumbbell Skullcrusher | 1 | T2 |
| complex | superset | Superset: leg ext. leg curls (MID WEIGHT) | Leg Extension (machine) + Machine Leg Curl (seated or lying) | 1 | T3 |
| complex | superset | Weighted Bulgarian Lunge Heel held up + SL Def. Weighted Calf Raises | Rear-Foot-Elevated Lunge (RFE / Bulgarian split squat) + Single-Leg Deficit Calf Raise (weighted) | 1 | T2 |
| complex | circuit | 20 on/ 10 off - TABATA TIMER - Flutter kicks & Hip Turns | Flutter Kicks + Hip Turns (pelvis rotations) | 1 | T0 |
| complex | circuit | 50 situps + 50 crunches + 50 reverse crunches | Sit-Up + Crunch + Reverse Crunch | 2 | T0 |
| complex | superset | Russian twists/ 30/30 Side planks | Russian Twist + Side Plank (elbow) | 1 | T0 |
| complex | superset | SUPERSET: Star v-ups + side plank knee to elbow | Star V-Ups (cross-body / diagonal V-ups) + Side Plank Knee-to-Elbow | 1 | T0 |
| complex | complex | 3 Heavy SQUATs + 5 Tuck jumps + 5 DB squat jumps + 5 Squirrel jumps | Squat - any loading ('Whatever Squat') + Tuck Jumps + DB Repeated Squat Jumps + Squirrel Jumps | 1 | T3 |
| complex | superset | 3x10 DB incline press/ core | Incline DB Bench Press + Core - coach's choice (unspecified) | 1 | T2 |
| complex | superset | 3x6 - DB bench press/ core | Flat DB Bench Press + Core - coach's choice (unspecified) | 2 | T2 |
| complex | superset | 3x6 db incline bench press/ core | Incline DB Bench Press + Core - coach's choice (unspecified) | 1 | T2 |
| complex | superset | 3x8 - barbell bench press/ core | Barbell Bench Press + Core - coach's choice (unspecified) | 1 | T3 |
| complex | superset | 3x8 - barbell incline bench press/ core | Incline Barbell Bench Press + Core - coach's choice (unspecified) | 1 | T3 |
| complex | complex | 4 Deadlifts - 5 broad jumps - 5 KB swings - 5/5 High Knee runs | Deadlift (implement not stated) + Broad Jump + Kettlebell Swing (Russian) + High-Knee Runs | 1 | T3 |
| complex | superset | 4x6 bb bench/ core | Barbell Bench Press + Core - coach's choice (unspecified) | 1 | T3 |
| complex | superset | 4x8/ bb incline bench/ core | Incline Barbell Bench Press + Core - coach's choice (unspecified) | 1 | T3 |
| complex | complex | 8 Box Med Ball rocker into 4 hops + Swiss ball knee tuck ins | Medball Plank Rockers + Ankle Hops (bilateral, in place) + Swiss Ball Knee Tuck | 1 | T2 |
| complex | complex | Back squats/banded jumps/DB squat jumps/ high ankle hops | Back Squat (bar position not stated) + Reverse-Banded (Band-Assisted) Squat Jumps (French contrast element 4 - assisted/overspeed plyo) [out of scope (EQ-12)] + DB Repeated Squat J | 1 | T3 |
| complex | superset | Copenhagen Plank & Unilateral DL | Copenhagen Plank + Single-Leg RDL / Single-Leg Deadlift | 1 | T2 |
| complex | superset | DB side raises + Copenhagen plank :50 sec each side | DB Lateral (Side) Raise + Copenhagen Plank | 2 | T2 |
| complex | superset | DEADLIFTS (1-2RIR) + 3 min Jump Rope | Deadlift (implement not stated) + Jump Rope | 1 | T3 |
| complex | superset | Drop into Box Jumps + 20/20 Star Toe touches | Depth Drop to Box Jump + Star Toe Touches | 1 | T0 |
| complex | circuit | FE contra/ DB rows/core | Front-Foot-Elevated Split Squat / Lunge (FFE) + Single-Arm DB/KB Row + Core - coach's choice (unspecified) | 1 | T2 |
| complex | circuit | FF & RFE contra/ DB rows/ core | Front- and Rear-Foot-Elevated Split Squat (FFE & RFE) + Single-Arm DB/KB Row + Core - coach's choice (unspecified) | 1 | T2 |
| complex | circuit | FF & RFE ipsi/ DB rows/ core | Front- and Rear-Foot-Elevated Split Squat (FFE & RFE) + Single-Arm DB/KB Row + Core - coach's choice (unspecified) | 1 | T2 |
| complex | circuit | FF & RFE Lunge goblet / T2B/ hand switch pushups | Front- and Rear-Foot-Elevated Split Squat (FFE & RFE) + Toes to Bar (hanging) + Hand-Switch Push-up | 1 | T1 |
| complex | circuit | FF & RFE Lunge goblet / T2B/ pushups | Front- and Rear-Foot-Elevated Split Squat (FFE & RFE) + Toes to Bar (hanging) + Push-Up | 1 | T1 |
| complex | circuit | FF & RFE Lunge/ T2B/ db bench press | Front- and Rear-Foot-Elevated Split Squat (FFE & RFE) + Toes to Bar (hanging) + Flat DB Bench Press | 2 | T2 |
| complex | circuit | FFE ipsi/ DB rows/ core | Front-Foot-Elevated Split Squat / Lunge (FFE) + Single-Arm DB/KB Row + Core - coach's choice (unspecified) | 1 | T2 |
| complex | complex | Front squats/high jumps/hex bar squat jumps/ banded assisted hops | Front Squat (barbell) + Squat Jump (high, bodyweight or lightly loaded) + Hex-Bar Jump Squat + Bilateral Reverse-Banded Hops (band-assisted pogo hops) [out of scope (EQ-12)] | 2 | T3 |
| complex | complex | Hang Power Clean & Press | Hang Power Clean (hang height not stated) + Standing Barbell Overhead Press (strict) | 1 | T3 |
| complex | superset | Heel raises & fast/rhythmic/1/4 SQUATS | Standing Calf Raise (bodyweight, from a deficit/step) + Fast Rhythmic Quarter Squats | 1 | T0 |
| complex | superset | Lateral mid size box step up jumps directly into nordic curls | Lateral Box Step-up Jump + Nordic Hamstring Curl | 1 | T0 |
| complex | superset | Plate core & leg extensions | 'Plate core' (plate-loaded core drill, not specified) + Leg Extension (machine) | 1 | T3 |
| complex | superset | Plate core & leg extensions / nordic curls | 'Plate core' (plate-loaded core drill, not specified) + Leg Extension (machine) + Nordic Hamstring Curl | 1 | T3 |
| complex | superset | Push ups/chest pass | Push-Up + Medball Chest Pass | 1 | T2 |
| complex | circuit | RFE contra/ DB rows/ core | Rear-Foot-Elevated Lunge (RFE / Bulgarian split squat) + Single-Arm DB/KB Row + Core - coach's choice (unspecified) | 2 | T2 |
| complex | circuit | RFE ipsi/ DB rows/ core | Rear-Foot-Elevated Lunge (RFE / Bulgarian split squat) + Single-Arm DB/KB Row + Core - coach's choice (unspecified) | 2 | T2 |
| complex | superset | Single Leg swiss ball knee tuck in + DB rows | Swiss Ball Knee Tuck + Single-Arm DB/KB Row | 1 | T2 |
| complex | superset | Slider Runners + Slider Hamstring Runners | Slider Runners (mountain-climber style) + Slider Hamstring Runners (alternating) | 1 | T0 |
| complex | superset | SUPERSET: Dead bugs + Front Raises + Side Raises | Dead Bugs + DB Front Raise + DB Lateral (Side) Raise | 1 | T2 |
| complex | superset | SUPERSET: HEAVY Hex bar Squats directly into 10 Repeat Jump Squat HIGH JUMPs | Hex (Trap) Bar Squat + Bilateral Repeat Jumps (continuous full-amplitude jumps) | 1 | T3 |
| complex | superset | SUPERSET: HEAVY Ipsilateral DB front foot elevated lunge directly into no weight lunge fro | Front-Foot-Elevated Split Squat / Lunge (FFE) + Front-Foot-Elevated Lunge Jumps (bodyweight) | 1 | T0 |
| complex | circuit | Uni RDL/ core/ OH press | Single-Leg RDL / Single-Leg Deadlift + Core - coach's choice (unspecified) + Overhead Press (implement not stated) | 8 | T2 |
| complex | circuit | UNI RDL/ CORE/ UNI GB | Single-Leg RDL / Single-Leg Deadlift + Core - coach's choice (unspecified) + Single-Leg Glute Bridge (foot on floor) | 8 | T2 |

### 8.4 Program cells that are not exercises (185, kept in the crosswalk with `maps_to: null`)

| reason | cells |
|---|---|
| CrossFit monthly-grid quality flag 'AEROBIC C.: YES' | 28 |
| CrossFit monthly-grid quality flag 'WODs: YES' | 26 |
| block label 'UPPER ACCESORY' (4 TRACKS HYBRID) | 24 |
| block label 'ACCESSORIES' (4 TRACKS AESTHETICS) - accessory slot with no exercise named | 21 |
| block label 'LOWER ACCESORY' (4 TRACKS HYBRID) | 16 |
| CrossFit monthly-grid quality flag 'RESISTANCE: LB' (lower-body hypertrophy day) | 14 |
| CrossFit monthly-grid quality flag 'RESISTANCE: UB' | 14 |
| CrossFit slot label 'STRENGTH: KNEE DOM' (pattern placeholder) | 6 |
| CrossFit slot label 'STRENGTH: PULL' (pattern placeholder) | 6 |
| CrossFit slot label 'STRENGTH: HIP DOM' (pattern placeholder) | 6 |
| CrossFit slot label 'STRENGTH: PUSH' (pattern placeholder) | 6 |
| week label 'TEST' (4 TRACKS / CONJUGATE) | 4 |
| week label 'DELOAD' (4 TRACKS / CONJUGATE; OBSERVED label only - the generator never puts a deload inside a block, COACH-R2 R2-VOL-07) | 4 |
| 'none' = no buy-out that week (BASEBALL Part E) | 3 |
| week label 'DELOAD WEEK' (OBSERVED label only; R2-VOL-07) | 2 |
| CrossFit class-split quality level label | 2 |
| block label 'UNILATERAL' (4 TRACKS AESTHETICS G56) | 1 |
| CrossFit monthly-grid quality flag ('AEROBIC C.: TYES' typo of YES) | 1 |
| CrossFit class-split skill label 'SKILLS: GYMNASTICS' (no movement named) | 1 |

## 9. Modifiers, notes and headings

The coach's RESISTANCE PATTERNS tab builds exercises as base pattern + stacked variables (feet, hand placement, stance, ROM, end range, load position, contra/ipsilateral load). The generator picks **named exercises**; grip, stance, ROM, end-range and load-position modifiers are for the 1-2 small changes between 4-6 week blocks, never all at once (COACH-ANSWER PER-02). Variable-resistance modifiers are out of scope (EQ-12). Contralateral / ipsilateral load is different: it is chosen by the athlete and the phase (CAT-13: contralateral for change-of-direction athletes, ipsilateral for sprint acceleration, both as health accessories for bodybuilders / powerlifters mostly in weeks 1-4), and their `modifier_role_v1` says so; 'Split stance ALWAYS contralateral' is a fixed rule.

**v1.1 (COACH-R2 R2-LIB-01, approved):** these modifiers are the vocabulary of the one-detail change allowed between blocks - which hand holds the weight (contra / ipsilateral load), grip (hand placement), stance, implement (load position) and range (ROM, end range) - shown as '<library name> - <detail>' and never more than one at a time (section 2.6, `variation_v1_1`).

| modifier (active) | difficulty (OBSERVED colour/header where given) | effect / rule (COACH-ANSWER where quoted, else INFERRED biomechanics) |
|---|---|---|
| End-range behaviour: *RDL | advanced | Never touches: reverses at end range under tension (eccentric-first, continuous) -> hardest. |
| End-range behaviour: Dead stop | foundational | Each rep starts from a full stop on the floor (concentric-only start, no stretch reflex) -> easiest. |
| End-range behaviour: Touch & go | intermediate | Tap and rebound without resetting -> uses the stretch-shortening cycle, more continuous tension. |
| Feet position: Feet in air (hollow bent legs) | advanced | No base: trunk must hold a hollow position while pressing -> core demand high. (INFERRED rationale; colour = OBSERVED difficulty). |
| Feet position: Feet in air (hollow legs str8) | advanced | Longest lever hollow -> hardest. (INFERRED rationale; colour = OBSERVED difficulty). |
| Feet position: Feet on bench | foundational | No leg drive, lumbar arch blocked -> trunk position 'given'; easiest to keep spine neutral. (INFERRED rationale; colour = OBSERVED difficulty). |
| Feet position: Feet on floor | intermediate | Standard: full leg drive + arch to manage. (INFERRED rationale; colour = OBSERVED difficulty). |
| Feet position: Feet on raisers or plates | intermediate | Leg drive available, floor brought closer (shorter athletes); athlete now manages arch/leg drive. (INFERRED rationale; colour = OBSERVED difficulty). |
| Feet position: Feet on wall | foundational | Same as feet on bench (used in G8 'Incline DB bench press feet on wall'). (INFERRED rationale; colour = OBSERVED difficulty). |
| Hand placement: Narrow grip | unrated | Changes joint angles/muscle bias (e.g. supinated = more biceps/clavicular pec & shoulder-friendly press; narrow = more triceps; wide = more pec/shorter ROM on press, longer ROM on deadlift). No level  |
| Hand placement: Neutral | unrated | Changes joint angles/muscle bias (e.g. supinated = more biceps/clavicular pec & shoulder-friendly press; narrow = more triceps; wide = more pec/shorter ROM on press, longer ROM on deadlift). No level  |
| Hand placement: Pronated | unrated | Changes joint angles/muscle bias (e.g. supinated = more biceps/clavicular pec & shoulder-friendly press; narrow = more triceps; wide = more pec/shorter ROM on press, longer ROM on deadlift). No level  |
| Hand placement: Supinated | unrated | Changes joint angles/muscle bias (e.g. supinated = more biceps/clavicular pec & shoulder-friendly press; narrow = more triceps; wide = more pec/shorter ROM on press, longer ROM on deadlift). No level  |
| Hand placement: Wide grip | unrated | Changes joint angles/muscle bias (e.g. supinated = more biceps/clavicular pec & shoulder-friendly press; narrow = more triceps; wide = more pec/shorter ROM on press, longer ROM on deadlift). No level  |
| Load laterality x position: Front racked db or kb contralateral loading | advanced | COACH-ANSWER CAT-13: contralateral load pulls you INTO the hip (the eccentric coils you into the hip, then you create force away from it). Used mainly for change-of-direction athletes (football route  |
| Load laterality x position: Front racked db or kb Ipsilateral loading | advanced | COACH-ANSWER CAT-13: ipsilateral load helps you OUT of the hip. Used for sprint acceleration (e.g. ipsilateral step-ups for a strong take-off) and as a health accessory for bodybuilders/powerlifters ( |
| Load laterality: Contralateral loading | intermediate | COACH-ANSWER CAT-13: contralateral load pulls you INTO the hip (the eccentric coils you into the hip, then you create force away from it). Used mainly for change-of-direction athletes (football route  |
| Load laterality: Ipsilateral loading | intermediate | COACH-ANSWER CAT-13: ipsilateral load helps you OUT of the hip. Used for sprint acceleration (e.g. ipsilateral step-ups for a strong take-off) and as a health accessory for bodybuilders/powerlifters ( |
| Load position: Barbell back squat racked | unrated | Barbell load positions borrowed from the squat ladder (ALL ABOUT SQUATS: hex -> goblet -> high zercher -> zercher -> front/SSB -> high bar -> low bar -> overhead). Order here (high zercher -> zercher  |
| Load position: Barbell Front squat racked | unrated | Barbell load positions borrowed from the squat ladder (ALL ABOUT SQUATS: hex -> goblet -> high zercher -> zercher -> front/SSB -> high bar -> low bar -> overhead). Order here (high zercher -> zercher  |
| Load position: Barbell high zercher racked | unrated | Barbell load positions borrowed from the squat ladder (ALL ABOUT SQUATS: hex -> goblet -> high zercher -> zercher -> front/SSB -> high bar -> low bar -> overhead). Order here (high zercher -> zercher  |
| Load position: Barbell overhead | unrated | Barbell load positions borrowed from the squat ladder (ALL ABOUT SQUATS: hex -> goblet -> high zercher -> zercher -> front/SSB -> high bar -> low bar -> overhead). Order here (high zercher -> zercher  |
| Load position: Barbell zercher racked | unrated | Barbell load positions borrowed from the squat ladder (ALL ABOUT SQUATS: hex -> goblet -> high zercher -> zercher -> front/SSB -> high bar -> low bar -> overhead). Order here (high zercher -> zercher  |
| Load position: Double kb or Db | unrated | Symmetrical bilateral load; the most load available without a barbell. Whether suitcase or racked is unspecified (ALL ABOUT LUNGES lists 'Duble suitcase' separately). |
| Load position: Goblet loading | unrated | Single implement held at the chest (front-loaded, symmetrical). |
| Load position: Plate reach | unrated | Plate held forward at arm's length; counterbalances, keeps trunk upright, easiest loaded option. |
| Loading variable: *RDL | advanced | Appears as the red (hardest) last item in all three variable lists; most likely 'the RDL version of this variable' (top-down, eccentric-first loading) - INFERRED. |
| Lunge load position: Back-Racked Barbell | any | Variables are meant to be COMBINED: orientation x load position x stance (e.g. front/back + contralateral suitcase + RFE = contralateral-loaded Bulgarian split squat). Combinations are NOT enumerated  |
| Lunge load position: Contralateral High Zercher (single implement hugged high, offset to the side opposite the front leg) | any | COACH-ANSWER CAT-13: contralateral load pulls you INTO the hip (the eccentric coils you into the hip, then you create force away from it). Used mainly for change-of-direction athletes (football route  |
| Lunge load position: Contralateral On-Shoulder (single implement racked on the shoulder opposite the front leg) | any | COACH-ANSWER CAT-13: contralateral load pulls you INTO the hip (the eccentric coils you into the hip, then you create force away from it). Used mainly for change-of-direction athletes (football route  |
| Lunge load position: Contralateral Suitcase (one DB/KB at the side opposite the front leg) | any | COACH-ANSWER CAT-13: contralateral load pulls you INTO the hip (the eccentric coils you into the hip, then you create force away from it). Used mainly for change-of-direction athletes (football route  |
| Lunge load position: Double Suitcase (DB/KB in each hand) | any | Coach typo 'Duble' = double. Variables are meant to be COMBINED: orientation x load position x stance (e.g. front/back + contralateral suitcase + RFE = contralateral-loaded Bulgarian split squat). Com |
| Lunge load position: Double-Handed High Zercher (implement hugged high, centred) | any | Variables are meant to be COMBINED: orientation x load position x stance (e.g. front/back + contralateral suitcase + RFE = contralateral-loaded Bulgarian split squat). Combinations are NOT enumerated  |
| Lunge load position: Double-Handed On Shoulders (DB/KB on both shoulders) | any | Variables are meant to be COMBINED: orientation x load position x stance (e.g. front/back + contralateral suitcase + RFE = contralateral-loaded Bulgarian split squat). Combinations are NOT enumerated  |
| Lunge load position: Front-Racked Barbell | any | Variables are meant to be COMBINED: orientation x load position x stance (e.g. front/back + contralateral suitcase + RFE = contralateral-loaded Bulgarian split squat). Combinations are NOT enumerated  |
| Lunge load position: Ipsilateral High Zercher (single implement hugged high, same side as the front leg) | any | COACH-ANSWER CAT-13: ipsilateral load helps you OUT of the hip. Used for sprint acceleration (e.g. ipsilateral step-ups for a strong take-off) and as a health accessory for bodybuilders/powerlifters ( |
| Lunge load position: Ipsilateral On-Shoulder (single implement on the same-side shoulder) | any | COACH-ANSWER CAT-13: ipsilateral load helps you OUT of the hip. Used for sprint acceleration (e.g. ipsilateral step-ups for a strong take-off) and as a health accessory for bodybuilders/powerlifters ( |
| Lunge load position: Ipsilateral Suitcase (one DB/KB on the same side as the front leg) | any | COACH-ANSWER CAT-13: ipsilateral load helps you OUT of the hip. Used for sprint acceleration (e.g. ipsilateral step-ups for a strong take-off) and as a health accessory for bodybuilders/powerlifters ( |
| Lunge load position: Zercher Barbell | any | Variables are meant to be COMBINED: orientation x load position x stance (e.g. front/back + contralateral suitcase + RFE = contralateral-loaded Bulgarian split squat). Combinations are NOT enumerated  |
| Lunge orientation: Front/Back (forward or reverse lunges) | any | Column A has a blank-space header (A21 = ' '); its content (Front/back, Lateral) is a movement ORIENTATION list (INFERRED). Variables are meant to be COMBINED: orientation x load position x stance (e. |
| Lunge orientation: Lateral (side / Cossack lunges) | any | Column A has a blank-space header (A21 = ' '); its content (Front/back, Lateral) is a movement ORIENTATION list (INFERRED). Variables are meant to be COMBINED: orientation x load position x stance (e. |
| Lunge stance/propulsion surface: FFE (front foot elevated) | any | Variables are meant to be COMBINED: orientation x load position x stance (e.g. front/back + contralateral suitcase + RFE = contralateral-loaded Bulgarian split squat). Combinations are NOT enumerated  |
| Lunge stance/propulsion surface: Floor (both feet on the floor) | any | Variables are meant to be COMBINED: orientation x load position x stance (e.g. front/back + contralateral suitcase + RFE = contralateral-loaded Bulgarian split squat). Combinations are NOT enumerated  |
| Lunge stance/propulsion surface: RFE (rear foot elevated - Bulgarian split squat) | any | Variables are meant to be COMBINED: orientation x load position x stance (e.g. front/back + contralateral suitcase + RFE = contralateral-loaded Bulgarian split squat). Combinations are NOT enumerated  |
| ROM variable: *RDL | advanced | Top-down: ROM defined by hamstring end range instead of the floor (bar never touches). |
| ROM variable: Deficit | advanced | Standing on a plate/platform -> longer ROM -> hardest. |
| ROM variable: Elevated | foundational | Start position raised (blocks/rack/plates) -> shorter ROM -> easiest. |
| ROM variable: Floor | intermediate | Standard ROM from the floor. |
| Stance: Half kneeling opposite side leg up | unrated | COACH-ANSWER CAT-13: contralateral load pulls you INTO the hip (the eccentric coils you into the hip, then you create force away from it). Used mainly for change-of-direction athletes (football route  |
| Stance: Half kneeling same side leg up | unrated | COACH-ANSWER CAT-13: ipsilateral load helps you OUT of the hip. Used for sprint acceleration (e.g. ipsilateral step-ups for a strong take-off) and as a health accessory for bodybuilders/powerlifters ( |
| Stance: Split stance ALWAYS contralateral | unrated | COACH-ANSWER CAT-13: contralateral load pulls you INTO the hip (the eccentric coils you into the hip, then you create force away from it). Used mainly for change-of-direction athletes (football route  |

| type | record | cells | audience (LIB-19) |
|---|---|---|---|
| progression_note | [Progression note] Bigger plates -> restart at Bilateral Lateral Plate Hops | MASTER EXERCISE LIBRARY!G53; MASTER EXERCISE LIBRARY!H16; Sheet23!G9 |  |
| variant_rule | RULE: repeat the 5 'down over front leg' lunge variations (C6:C10) with the medball forward (arms extended) | (NOT DONE) ALL ABOUT BALLISTICS!C12 |  |
| variant_rule | RULE: repeat the 5 'down over front leg' lunge variations (C6:C10) with the medball hug (at chest) | (NOT DONE) ALL ABOUT BALLISTICS!C11 |  |
| variant_rule | RULE: repeat the 5 'down over front leg' lunge variations (C6:C10) with the medball up (overhead) | (NOT DONE) ALL ABOUT BALLISTICS!C13 |  |
| taxonomy_placeholder | Functional Biomechanics System > Anterior Oblique System > Crunches [heading - no exercises yet] | MASTER EXERCISE LIBRARY!BC125 | advanced athletes and rehab |
| taxonomy_placeholder | Functional Biomechanics System > Anterior Oblique System > Integrated With Push & Legs [heading - no exercises yet] | MASTER EXERCISE LIBRARY!BC44; MASTER EXERCISE LIBRARY!BC89; MASTER EXERCISE LIBRARY!BC124 | advanced athletes and rehab |
| taxonomy_placeholder | Functional Biomechanics System > Posterior Oblique System > Bridges [heading - no exercises yet] | MASTER EXERCISE LIBRARY!BD8 | advanced athletes and rehab |
| taxonomy_placeholder | Functional Biomechanics System > Posterior Oblique System > Integrations With Pull & Legs [heading - no exercises yet] | MASTER EXERCISE LIBRARY!BD9 | advanced athletes and rehab |
| taxonomy_placeholder | Functional Biomechanics System > Lateral Subsystem > Integrations Legs & Delts [heading - no exercises yet] | MASTER EXERCISE LIBRARY!BE9 | advanced athletes and rehab |
| taxonomy_placeholder | Functional Biomechanics System > Lateral Subsystem > Side Lying [heading - no exercises yet] | MASTER EXERCISE LIBRARY!BE8 | advanced athletes and rehab |
| taxonomy_placeholder | Carry > Bilateral [heading - no exercises yet] | MASTER EXERCISE LIBRARY!BA13 | athletes and general fitness |
| taxonomy_placeholder | Carry > Propulsive [heading - no exercises yet] | MASTER EXERCISE LIBRARY!BA8 | athletes and general fitness |
| taxonomy_placeholder | Carry > Stationary [heading - no exercises yet] | MASTER EXERCISE LIBRARY!BA10 | athletes and general fitness |
| taxonomy_placeholder | Carry > Unilateral [heading - no exercises yet] | MASTER EXERCISE LIBRARY!BA14 | athletes and general fitness |
| taxonomy_placeholder | Drags > Frontal [heading - no exercises yet] | MASTER EXERCISE LIBRARY!BB10 | athletes and general fitness |
| taxonomy_placeholder | Drags > Sagittal [heading - no exercises yet] | MASTER EXERCISE LIBRARY!BB8 | athletes and general fitness |

PROPOSED starter items for the empty CARRY / DRAGS headings (PENDING COACH APPROVAL; scope and implements from COACH-ANSWER LIB-19):

| proposed record | fills heading | level (INFERRED) | set-ups | dose (INFERRED) | credit |
|---|---|---|---|---|---|
| Farmer Carry (bilateral) | Carry > Propulsive / Bilateral (BYOP BA8/BA13) | foundational | dumbbell / kettlebell / farmer_handles / hex_bar | 2-4 x 20-40 m or 20-40 s | CORE 1 |
| Front-Rack KB Carry (one or two KBs) | Carry > Propulsive / Bilateral | intermediate | kettlebell | 2-4 x 20-40 m or 20-40 s | CORE 1 |
| Overhead KB Carry (single arm) | Carry > Propulsive / Unilateral | advanced | kettlebell / dumbbell | 2-4 x 20-40 m or 20-40 s | CORE 1 |
| Sandbag Bear-Hug Carry | Carry > Propulsive / Bilateral | foundational | sandbag | 2-4 x 20-40 m or 20-40 s | CORE 1 |
| Farmer Hold (stationary carry) | Carry > Stationary (BYOP BA10) | foundational | dumbbell / kettlebell / farmer_handles / hex_bar | 2-4 x 20-40 s | CORE 1 |
| Sled Push | Drags > Sagittal (BYOP BB8) | foundational | sled | 4-8 x 10-30 m | - |
| Sled Drag - Forward (harness or straps) | Drags > Sagittal | foundational | sled | 4-8 x 10-30 m | - |
| Sled Drag - Backward | Drags > Sagittal | foundational | sled | 4-8 x 10-30 m | - |
| Sled Drag - Lateral | Drags > Frontal (BYOP BB10) | intermediate | sled | 4-8 x 10-30 m | - |

v1.1: HYROX uses the sled push, a hand-over-hand sled rope pull (new PROPOSED-ADDITION record, DRAG pool), a 200 m farmer carry and sandbag lunges, so the LIB-19 starters now carry `sport_use_v1_1` and the drag list gains the sled rope pull (section 2.8). Still PROPOSED.

## 10. Open questions (catalog-specific)

### 10.1 v0 questions and how the coach answered them

| v0 question | answer (v1) |
|---|---|
| 1. Are 'Clean ' and 'Snatch ' the full squat versions? | Yes - renamed Squat Clean / Squat Snatch / Squat Clean & Jerk (LIB-07). |
| 2. Keep the near-duplicate merges? | Yes, merge them (LIB-17); 7 more merged in v1. |
| 3. Which name wins for 'Shoulder Wide Grip Deadlift' vs 'Barbell Deadlifts', the two bent-over rows, 'Hurdle Hops' vs 'Bilateral Forward Hurdle Hops'? | Deadlifts and rows merged (LIB-17); the hurdle hops are two levels of one drill - taller hurdles and continuous contacts at ADVANCED (LIB-04). |
| 4. Leg press / pendulum only ADVANCED, hack squat disliked but offered? | No machine ranking (EQ-11); older/injured FOUNDATIONAL clients may use leg press, pendulum and hip thrust machine (EQ-04); machines are easier (CAT-04). |
| 5. Which program-only exercises join the BYOP library? | Partly: the items named in LIB-20 / LIB-21 / EQ-05 / EQ-11 were added; the rest stay swap-only (CAT-07). v1.1: R2-LIB-07 added hang clean, single-arm DB snatch, KB squat clean, hex-bar jump and three home items, and approved that the rest stay swaps until he adds them. |
| 6. Generic program names ('DEADLIFTS', 'Rows'...): which implement by default? | By client: bodyweight -> DB -> barbell as level rises, limited by the kit (EQ-09), and the client may prefer an alternative (EQ-10). |
| 7. 'Base exercise + stacked variables' as the variety engine? | Named exercises are picked; 1-2 small variables change between blocks (PER-02). The coach did not understand CAT-12, so nothing more is needed. |
| 8. Equipment of ambiguous items ('Weighted squat to calf raise', 'Bench Push ups', 'KB Face Pulls', 'Low DB Squats', 'Camporini')? | Any tool (LIB-07); Low DB squats = DBs at the sides; Camporini removed (LIB-09). Bench push-ups (LIB-12) and KB face pulls (LIB-10) were answered in round 2: both bench push-up versions (R2-LIB-05) and KB face pulls = shoulder work (R2-LIB-04, LIB-10). |
| 9. Count filed-elsewhere items toward the slot or the muscle trained? | Toward the muscle trained: leg flexion -> hamstrings, not the hinge (CAT-09); leg extension and curl fully to quads / hamstrings (VOL-09); thrusters 1.0 quads + 0.5 shoulders (LIB-14 as approved; v1 had 0.25 - corrected; v1.1: + 0.25 glutes, R2-VOL-05). Front raises in the 'ABdution' pool were not asked. |
| 10. Unclear names (Camporini, Pull under, Kong rows, strap rotating, ...)? | Camporini and strap rotations removed; pull under = cable lat pull-over; Kong row = double-KB row from the floor (LIB-09). 'Sealed cable row', 'Pendulum row', 'Face up tricep push away', 'Plate core', 'Med ball rockers', 'Swiss ball kicks', 'hips raises', 'no money curls', 'Oscilating drop squats', 'Banded tantrums' (now out of scope) were not asked. |
| 11. Calorie items: machine-specific? every cardio slot? | Any erg, tracked by calories, time or distance (EQ-14); extend the dropdowns logically (FIX-02). |
| 12. Half-marathon plan: keep separate? | Used as-is for half-marathon goals only (PRG-12). |
| 13. Where do slings, carries and drags go? | Carries and drags for athletes and general fitness, slings for advanced athletes and rehab (LIB-19); the slot they feed is still open. |

### 10.2 v1 questions (status after round 2 in brackets)

1. LIB-18: you call the '21.6 mile run' a marathon, but a marathon is 26.2 mi. Should the test be 26.2 mi, stay 21.6 mi, or be dropped? [R2-LIB-06: dropped]
2. LIB-20 vs LIB-09: the LIB-20 list ('Hold between knees squats', cossacks, strap rotations) was marked RIGHT, but LIB-09 says to take the strap rotating in / out away. We removed the strap rotations - correct? [not asked in round 2; still open]
3. CAT-11: you have not named the plyo progression yet. Do 'Land (receive and pause) -> Land and go (receive then create) -> Repeat (repeated receive / create)' work as names? [R2-ATH-03: yes - 'Receive-Create stages']
4. ATH-10: the full power clean / power snatch / power clean & jerk sit in the BYOP ADVANCED block, but you said intermediate+ athletes do the full lifts. We now offer them from INTERMEDIATE (squat versions stay ADVANCED) - correct? [not asked; still open]
5. CAT-04 + EQ-04: machines are easier, and older / injured beginners may use the leg press, pendulum and hip thrust machine. Should every client (not only older / injured) be able to get constraint 4-5 machines at FOUNDATIONAL? [not asked; R2-LIB-02 'made easier by a seat, machine or cable' supports it]
6. VOL-09 on pulls: rows and pulldowns now give biceps 0.25 per set, like presses give triceps 0.25. Do you count biceps on pulls? [not asked; still open]
7. LIB-19: are the 9 proposed carries and drags (farmer carry, front-rack KB carry, overhead KB carry, sandbag bear-hug carry, farmer hold, sled push, forward / backward / lateral sled drag) the right starters, and should carries count as core sets? [not asked; still open]
8. CAT-08: by your thorax / pelvis rule, toes to bar and hanging knees to chest move to CORE PELVIS and V-ups to BOTH (BYOP files toes to bar and knees to chest under CORE THORAX). Keep that? [not asked; still open]
9. LIB-02 follow-up: on 'Push up Box Jump', do the hands jump from the floor up onto the box? [not asked; still open]
10. LIB-14 vs VOL-09: you approved thrusters as 1.0 quads + 0.5 shoulders, and later said helpers get 0.25. We kept 0.5 for thrusters (like dips 0.5 / 0.5, the shoulders do a full press). Correct? [R2-VOL-05: yes, plus 0.25 glutes]
11. CAT-04: you said a barbell back squat is more advanced, but BYOP files the high-bar and low-bar back squat under MODERATE. We now file them ADVANCED (front squat stays INTERMEDIATE). Correct? [R2-LIB-02 approved the load-position principle behind it]
12. EQ-03: you said older / injured / high-volume clients never get depth jumps. We also keep them off the High Depth Drop (above hip height), whose landing is at least as hard. Correct? [R2-ATH-08: for older adults depth work is an opt-in with a warning; injured / high-volume still INFERRED 'never']
13. PER-04: you squat with the bar on the back once a week and leg press or belt squat the other day. On that second day, are goblet / DB / KB squats, the hack squat and the pendulum fine, or should it be only no-spine-load options (leg press, belt squat, split squats)? [R2-SES-02: goblet, hack and pendulum are fine on the second day if not sore]

### 10.3 New questions raised in v1.1

1. **Wall balls (HYROX / CrossFit)**: you named wall balls as a use for a heavier medball (EQ-06). Should a wall ball count like a thruster (1.0 quads + 0.5 shoulders + 0.25 glutes) or, as a throw, count no sets (VOL-10)? We count no sets and treat it as conditioning.
2. **KB swing slot**: swings are ballistic, not glute work (R2-VOL-05). We put them in the triple-extension / power slot and keep them as a swap (0 sets) in the hip-dominant slot. Is the power slot the right home, or do they belong in conditioning / warm-up?
3. **Pickleball / court sports for 50+ and 60+**: the split-step is a small hop and a core sport skill. Because you said no plyos by default for 60+ (R2-ATH-08), a 60+ player gets the no-hop split-step by default (step into the ready position on the cue without leaving the ground); the small hop is the opt-in with your warning. Right, or should 60+ pickleball players get the small hop by default?
4. **Neck and grip work**: collision and grappling sports (football, wrestling, rugby, hockey, BJJ, MMA) usually train the neck, and climbers / grapplers train grip. We added two neck exercises and grip / arm-care items as PROPOSED, counting no sets. Do you want neck work in your programs, and should it count toward a muscle group?
5. **Distance tests longer than a half marathon** (adversarial check): when you removed the 21.6-mile run you approved 'the longest run stays the half-marathon plan' (R2-LIB-06). Your library still has 14-, 17- and 20-mile distance tests. Keep them for runners who ask, or remove them like the 21.6? They are flagged and never offered to an untrained client (R2-PER-07).

## 11. Record fields (JSON)

| field | meaning | evidence |
|---|---|---|
| id | stable slug of the v0 canonical name (prefix `mod-` modifier, `ph-` heading/rule, `cx-` complex). Renamed records keep their id so the crosswalk and other docs still resolve; v1.1 new records get a slug of their v1.1 name | ours |
| name / record_type / generic / status | canonical name (typos fixed), type, whether the source names no implement/grip, where it lives. v1 adds record types `out_of_scope` and `retired` (with `record_type_v0`) and statuses `added_v1` / `proposed_v1`; v1.1 adds statuses `added_v1_1` / `proposed_v1_1` and `record_type_v1` on the record it retired | INFERRED from sources; v1 values from coach answers |
| aliases[] | every raw spelling (the cell text) with workbook, tab, cell, role, level label, category, merge reason (v1 merges cite the question ID), program dose and cues, video links; `program` is our program name ('JUSTICE LEAGUE' -> 'ATHLETIC - GENERAL (non-competitive adults and youth)', old value in `program_v0`, ATH-13) while `tab` stays verbatim | OBSERVED |
| taxonomy | family, region, pattern_code (v1; `pattern_code_v0` when an answer moved it), category, coach label (verbatim), sub-pattern, ZONE codes (verbatim), row-6 PURPOSE, path, 01 taxonomy node | labels OBSERVED; codes ours |
| placements[] | each library/reference cell with its own pattern, category and level (the BYOP filing, even when v1 moved the record) | OBSERVED |
| laterality / plane / sides | bilateral, unilateral, alternating, either; sagittal, frontal, transverse, multi; R & L pairs | OBSERVED where given, else INFERRED; v1 changes cite the answer |
| level | primary level + basis (COACH-ANSWER when an answer set it), levels in BYOP, all sources, OBSERVED reference levels, BYOP and reference placements, `primary_v0`, `generator_min_level` (+ basis, + `generator_min_level_axis`: exercise-skill tier, not the client's volume level L1-L3, CAT-06). `code_01_taxonomy` is the 01-taxonomy code and was not changed by the adversarial check | mixed; see basis |
| primary_muscles / secondary_muscles / coach_muscle_groups / muscle_size_class (+ basis) / exercise_class | canonical muscle tokens, the 10 FOCUS LIST groups, big/small/mixed (CAT-02), compound/isolation/athletic/control/conditioning | INFERRED; size classes COACH-ANSWER CAT-02 |
| volume_counting / volume_credit | what the generator counts (hypertrophy_sets, control_sets, contacts, throws, power_reps, conditioning_bouts, reps_or_distance, warmup_not_counted, not_counted) and the v1 per-set credit by muscle group; `volume_credit.by_pool` when the credit depends on the slot (push press / push jerk); `per_set_v0` / `volume_counting_v0` keep replaced values | COACH-ANSWER VOL-09 / VOL-10 / LIB-14 / LIB-16 / UNI-01 / CAT-09 / ORD-08; INFERRED applications noted |
| modality_v1 / warmup_role_v1 | any-erg modality for aerobic and lactate-clearance work; A-drills as warm-up drills (never counted) | COACH-ANSWER EQ-14 / ORD-08 |
| equipment | implements, setups_any_of (no bands in active records), min_access_tier (0-3, v1 tiers), household substitutions, machine_type, substitutes_by_equipment (no `bands_only` key in v1) | INFERRED; no-band rule COACH-ANSWER EQ-01 |
| constraint_level / davidson_zone / axial_spinal_load | constraint 1-5; Davidson zone + rotation bias; spinal load | INFERRED values; scales and rules COACH-ANSWER EQ-13 / CAT-04 / CAT-10 / PER-04 |
| generator | eligible, pools (category for default pick and dropdown swaps), default_candidate, why, replace_with (retired / out of scope) | COACH-ANSWER GEN-04 / CAT-07 / GEN-08 |
| population_rules | population, rule, evidence (EQ-03, EQ-04, ATH-04, ATH-05, ATH-08, ATH-09, ATH-10, UNI-12, EQ-11, LIB-09; one INFERRED extension of EQ-03 marked as such) | COACH-ANSWER (application INFERRED) |
| athletic_quality / speed_session / plyo_moderate_track | quality, plyo_method (PROPOSED names; the as-named default only, `plyo_method_role`), `plyo_methods_available`, `plyo_method_rule`, unilateral_harder; speed-session step; MODERATE plyo track | COACH-ANSWER CAT-10 / CAT-11 / ATH-01 / LIB-21 / LIB-05; per-record tags INFERRED from names |
| implement_load | medball max 20 lb and typical load by throw type | COACH-ANSWER EQ-06 |
| coach_cues / pending_coach / library_v1 / new_in_v1 / audience_v1 / delt_head / conditioning_leaning / hypertrophy_priority | set-ups and cues; unanswered question; added to the library; new record; who it is for; delt head; thruster flag; low-stimulus flag | COACH-ANSWER with ID (INFERRED where marked) |
| load_ceiling / skill_demand / impact_level | low-moderate-high | INFERRED |
| typical_rep_range | value, dose unit, BYOP REPS dropdown buckets, observed program doses (cells); v1 adds `dose_notation_v1` (12/10/8 -20 pyramid), `per_side_notation_v1` (10/10 = per side; on two-sided records it adds the coach's bilateral-curl correction), `set_notation_v1` ('12/10/8/8' = reps per set) and `interval_notation_v1` ('20/40' = work / rest seconds); `value_v0` keeps a replaced range | doses OBSERVED; range INFERRED; notation COACH-ANSWER PRG-07 |
| program_slots / candidate_slot_inferred / selectable_note | BYOP slot labels + range + every template cell that can pick it; the slot an unwired item would fit | OBSERVED wiring / INFERRED fit |
| coach_preference / coach_statements | verbatim opinions ('LOVE IT', "DON'T LIKE IT"), purposes, pattern descriptions, doses; v1 generator rule | OBSERVED; rule COACH-ANSWER EQ-11 / GEN-08 |
| video_urls | demo links found in RESISTANCE PATTERNS, L3 cross-refs and program cells | OBSERVED |
| observed_in_programs(_count) / observed_as_component(_count) / used_in_complexes | program usage | OBSERVED |
| related[] | variant_of / has_variant / generic_of / progression / regression / related (merged ids repointed in v1) | INFERRED |
| flags / flags_resolved_v1 | open conflicts; v0 flags closed by an answer (with question ID and how) | cells OBSERVED; readings INFERRED; resolutions COACH-ANSWER |
| v1_changes | per-record changelog: question ID, change, evidence | COACH-ANSWER / INFERRED / PROPOSED |
| v1_1_changes | per-record round-2 changelog (R2 question ID, LIB-10 / LIB-12, PROPOSED-ADDITION, sport expansion) | COACH-R2 / INFERRED / PROPOSED |
| contact_class_v1_1 | ballistic / plyometric / receive (+ basis) on every jump and throw | COACH-R2 R2-ATH-02 (named) / INFERRED (rule) |
| athletic_quality.receive_create_stage / plyo_method_rule_v1_1 | default stage 1 Land / 2 Land & Go / 3 Repeat (as named), stages available; the approved stage timing | COACH-R2 R2-ATH-03 |
| olympic_v1_1 | family (clean / snatch / jerk / loaded jump), day pattern, frequency, reps, load guidance | COACH-R2 R2-ATH-04 / R2-ATH-05 / R2-GEN-06 (jerk family INFERRED) |
| older_default_excluded | 60+ default exclusion, opt-in, warning key, default_swap | COACH-R2 R2-ATH-08 |
| axial_spinal_load.spine_day_v1_1 | counted heavy spine lift / second-day option if not sore / not counted | COACH-R2 R2-SES-01 / R2-SES-02 (variants INFERRED) |
| davidson_zone.use_v1_1 | zone = tag; swap selector when something hurts | COACH-R2 R2-LIB-02 / R2-LIB-03 |
| variation_v1_1 | the one-detail changes allowed between blocks | COACH-R2 R2-LIB-01 (axes INFERRED) |
| test_rules_v1_1 / day_placement_v1_1 / library_v1_1 / retired_v1_1 / new_in_v1_1 | testing rule; KB face-pull day; library addition; v1.1 retirement; v1.1 new record | COACH-R2 R2-PER-07 / LIB-10 / R2-LIB-07 / R2-LIB-06 / R2-LIB-05, R2-LIB-07, PROPOSED |
| sport_use_v1_1 / profile_category_v1_1 | sports that use the item; 04_profiles category of a new record | INFERRED (sport needs analysis) |
| *_v1 fields | the v1 value a round-2 answer replaced (name_v1, level.primary_v1, per_set_v1, pattern_code_v1, record_type_v1, generator_v1, value_v1 ...) | - |
| sources / observed_fields / inferred_fields / notes | provenance | - |

## Verification log (v1)

v1 was produced by a python script that always starts from the untouched v0 JSON (so it can be re-run) and logs every change per record (`v1_changes`, 350 entries) - nothing in Google Sheets was touched, and the crosswalk file was not changed. Checks run on the v1 output:

| check | result |
|---|---|
| active records with a band or chains set-up | 0 |
| active records whose name mentions a band / chain / releaser | 0 |
| 'bands_only' substitute keys left | 0 |
| crosswalk rows whose catalog id no longer resolves | 0 |
| related links pointing to a missing id | 0 |
| complex / choice components still pointing to a merged (retired) record | 0 |
| active records without volume_credit / constraint_level / generator | 0 |
| athletic records that count toward muscle volume (must be 0, VOL-10) | 0 |
| resistance records with a credit other than 1.0 / 0.25 (expected: the 4 dips, LIB-16, and the INFERRED diamond push-up; after the adversarial check also the 3 thrusters, LIB-14) | 5 at build time; 8 after the adversarial check (+ Barbell Thruster; DB Thruster; Single-Arm DB Thruster) |
| medball records with implement_load max over 20 lb | 0 |
| duplicate names among active records | 0 |

Spot checks against the answers: Parallel-Bar Dip credit = CHEST 0.5 + TRICEP 0.5 + SHOULDERS/TRAPS 0.25 (LIB-16 + VOL-09); Barbell Thruster = QUADS 1 + SHOULDERS/TRAPS 0.25 (LIB-14) [superseded: 0.5 after the adversarial check below]; Nordic Hamstring Curl pool = KFLEX, HAMSTRINGS 1 (CAT-09); Max-Velocity Sprint pool = SPRINT, speed step 3, not counted (LIB-21, VOL-10); Leg Press generator_min_level = foundational, axial none (EQ-04, PER-04); Power Snatch never for older / injured / high-volume (EQ-03); every throw level = any (LIB-06).

## Verification log (v0, 2026-10-08) - kept as history

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

## v1 verification log

Adversarial check of the v1 catalog against `coach_answers_full.md` (all 140 entries re-read) and `coach_answers.md`, run 2026-10-08. Nothing in Google Sheets was touched; the crosswalk and every record id are unchanged. JSON fixes were applied in place by a re-runnable, idempotent python script (`fix_catalog_v1_adv.py`, kept in the checker's scratchpad; a second run changes nothing). Note for anyone who re-runs the v1 build script from the v0 JSON: these fixes must be re-applied. Every fixed record carries a `v1_changes` entry with `"pass": "adversarial check 2026-10-08"`.

### Coach answers that bear on the catalog, and what the check found

| answer(s) | what the catalog must show | result |
|---|---|---|
| CAT-01, CAT-03, CAT-07 | all lenses on every record; biomechanics is not a bucket; BYOP = source of truth (defaults only from BYOP or a coach answer) | OK |
| CAT-02, VOL-05, UNI-05 | big / small classes confirmed; the size class never sets the weekly 3 / 5 / 7% increase | OK, no size-based progression anywhere; made explicit in all 707 `muscle_size_class_basis` (FIXED: wording) |
| CAT-04, CAT-05, CAT-06 | front-loaded = foundational, on the body = intermediate, behind / overhead = advanced; machines easier; levels theoretical; client volume level is a separate axis | FIXED: High-Bar, Low-Bar and generic Back Squat were MODERATE / 'any' -> ADVANCED; Overhead Box Squat (decoder guess) -> ADVANCED; `generator_min_level` was described as a 'client level' (conflicts with CAT-06) -> now the exercise-skill tier, with `generator_min_level_axis` on 707 records |
| CAT-04, CAT-10 (zones) | vertical = external-rotation bias, horizontal = zone 2 internal-rotation / compressive; not for plyos; theoretical | OK (95 plyo / ankle records carry zone null; zone basis says 'do not over-rely') |
| CAT-08, CAT-09 | thorax / pelvis / both rule; LEG FLEXION pool, not the hinge | OK |
| CAT-10, CAT-11 | plyo method = how a jump is done (receive & pause -> receive then create -> repeated), not a zone or a fixed property; start ballistic, become plyometric | FIXED: each jump had one fixed `plyo_method`; now marked `plyo_method_role: default_as_named` + `plyo_methods_available` + `plyo_method_rule` (95 records) |
| CAT-13 | contralateral = into the hip (COD athletes), ipsilateral = out of the hip (sprint acceleration), health accessories for BB / PL in weeks 1-4 | FIXED: the 13 contra / ipsi modifiers had `modifier_role_v1` = 'between-block variety' only; rewritten as a goal-driven choice ('Split stance ALWAYS contralateral' = fixed rule); section 9 intro rewritten |
| UNI-01, UNI-07, PRG-07 | 10/10 = per side = 1 set; unilateral KD counts for quads | OK (109 records with `set_counting`) |
| UNI-12, LIB-20 | frontal / transverse work for court and combat athletes | OK |
| VOL-09, LIB-16 | helpers 0.25; dips 0.5 / 0.5 on push days | OK (0 records with a 0.5 helper outside dips / diamond push-up / thrusters) |
| LIB-14 | thrusters: RIGHT to 'count 1.0 quads and 0.5 shoulders' | FIXED: v1 had applied 0.25 (VOL-09); a specific RIGHT answer is his rule and matches `12_volume_algorithm_v1.md` -> 0.5 on all 3 thrusters; confirmation question 10.2 #10 |
| VOL-10 | athletic patterns never count toward muscles | OK (0) |
| VOL-11 | 40-rep sets only as an AMRAP / CrossFit option | OK (no catalog dose uses one) |
| VOL-15, VOL-17 | myo sets on machines / isolation; calves 3 sets each leg day; rear delts own sets (`delt_head`); about 2 core exercises | OK |
| PER-02 | 1-2 small variable changes between 4-6 week blocks | OK |
| PER-04, EQ-11 | one axial squat a week; leg press / belt squat for the other day; deadlifts load the spine | FIXED: Smith Machine Squat was axial 'moderate' though the bar sits on the back (the record's own basis says that is axial) -> 'high' |
| ATH-01, ATH-05, ATH-09 | plyo:ballistic by ground contact; no medball throwing for aesthetics (warm-up only); older = few plyos; no sex-based rules; youth may lift from the floor | OK (0 sex-based rules) |
| ATH-10 | everyone in athletic training gets Olympic lifts; beginners: DB/KB snatches, hex-bar jumps, hang pulls / hang cleans | FIXED: generic 'Hang Power Clean' was FOUNDATIONAL but the high-hang and mid-hang power cleans were INTERMEDIATE (decoder guess) -> FOUNDATIONAL + beginner population rule; low hang stays INTERMEDIATE |
| ATH-11 | core first by default, movable | OK (core credit basis says 'core first by default'; no 'core after the power block' text left) |
| ATH-13, FIX-03 | 'Justice League' is only a marketing name | FIXED: the JSON `program` field still read 'JUSTICE LEAGUE' on 23 alias / dose entries -> 'ATHLETIC - GENERAL (non-competitive adults and youth)' (`program_v0` kept); `tab` stays verbatim as an OBSERVED reference |
| EQ-01, EQ-02, EQ-07, EQ-08, EQ-12 | no bands, no variable resistance anywhere | FIXED: 38 active records still had `min_access_tier_label` 'T1 minimal kit (bands, doorway bar, rope)'; 8 `related` links pointed at band / chain variants with no status (now `v1_status: out of scope`); the leg-extension video entry embedded the banded-leg-extension video (moved to `url_v0`); the plyo push-up alias carried a 'band-assisted' cue (now marked out of scope); two drag headings suggested band drags. The 4 program complexes that name band items already tag them out of scope with non-band replacements |
| EQ-03, EQ-04, EQ-05, EQ-06, EQ-09, EQ-10, EQ-13, EQ-15, EQ-16 | never overhead squat / snatch / low-bar / depth jumps for older-injured-high-volume; machines from FOUNDATIONAL; seated machine press; medball max 20 lb; implement default; client preference; constraint 1-5; loaded-jump and box heights | OK |
| EQ-11 | machines not ranked; hack squat not last | OK (hack squat's v0 'fallback only' rule survives only as `generator_rule_inferred_v0`; the live rule says no ranking) |
| GEN-04, GEN-06, GEN-07, GEN-08 | default + same-category dropdown; videos; cues; no V-squat; coaches can add rules | OK (V-squat `eligible: false`) |
| LIB-01 to LIB-13, LIB-15 to LIB-17, LIB-19, LIB-21, LIB-22 | renames, retirements, merges, set-ups, levels | OK (Squat Snatch / Squat Clean / Squat Clean & Jerk; Camporini and strap rotations retired; pull under = lat pull-over; Kong row, low DB squat, single-leg get-up, alternating staggered-stance deadlifts, push-up stick the landing set-ups; push press FOUNDATIONAL, push jerk INTERMEDIATE; throws and GHD no levels) |
| LIB-18 | '21.6 mile run' = 'a marathon' (a marathon is 26.2 mi) | FIXED: `flags_resolved_v1` / `v1_changes` and section 6.2 called the flag resolved while the mismatch flag stays open -> 'partly resolved' |
| LIB-10, LIB-12, PRG-01, FIX-01 | unanswered / skipped | still PENDING, correctly marked |

### Retired ideas - grep results after the fixes (JSON + both markdown files)

| retired idea | result |
|---|---|
| size-based 3 / 5 / 7% mapping (big = 3%, small = 7%) | 0 hits |
| 0.5 helper credit | 0 (0.5 only on the 4 dips + diamond push-up, LIB-16 / INFERRED, and the 3 thrusters, LIB-14) |
| band / chain / weight-releaser substitutes in generator-facing fields of active records | 0 set-ups, 0 substitutes, 0 tier labels; remaining mentions are OBSERVED provenance (aliases, program notes), changelogs, `*_v0` fields, the out-of-scope tags themselves and program complexes whose band component is tagged out of scope |
| plyo zones as a fixed exercise property | 0: no Davidson zone on any plyo; `plyo_method` is the as-named default only |
| core after the power block as the default | 0 |
| sex-based rules | 0 |
| 'Justice League' as a program name | 0 in `program` fields and prose; kept only as the verbatim tab name in OBSERVED cell references |
| hack squat ranked last / fallback only | 0 in live rules (v0 rule kept in a `_v0` field; section 6.1 says it is no longer fallback-only) |
| 6-week = 5 weeks + deload | 0 (the only 'deload' hits are OBSERVED week labels and the coach's 'deload' = sit on the box) |

### Recounted after the fixes

Section 3.2 BKD row (F 13 / I 6 / A 15 / any 3 / unrated 3; generator min F 22 / I 5 / A 13), TX row (F 15 / I 12 / A 10; min F 18 / I 12 / A 10) and the level-evidence line (34 coach / 236 OBSERVED / 106 INFERRED; 331 any or unrated) were recomputed with python from the fixed JSON; section 4 and section 8 rows for the 9 changed records, sections 2, 6.2, 9, 10 and 11 were edited to match. Active records 707, duplicate active names 0, V-squat eligible false, crosswalk ids unchanged.

### Not changed here (other files to sync)

- `01_taxonomy.md` still credits thrusters 0.25 (with the LIB-14 conflict flagged) and its level codes (`code_01_taxonomy`, e.g. L2 on the back squats) were not changed.
- `10_equipment_model.json` zone / constraint inferences were not re-derived.

## v1 verification log - second adversarial pass (2026-10-08)

Second adversarial check of the v1 catalog (JSON + this file + `02_no_equipment_subset.md`) against `coach_answers_full.md` (all 140 entries re-read; 138 answered) and `coach_answers.md`. The first pass (above) was not trusted: every claim was re-checked with python on the JSON. Nothing in Google Sheets was touched; the crosswalk and every record id are unchanged (3,824 crosswalk references, 0 missing; 0 `related` links to a missing id; 0 duplicate active names; 707 active exercise-like records). JSON fixes were applied by a re-runnable, idempotent python script (`fix_catalog_v1_adv2.py`, kept in the checker's scratchpad; a second run leaves the file byte-identical). Each fixed record carries a `v1_changes` entry with `"pass": "adversarial check 2 2026-10-08"` (223 entries on 174 records); the one wording fix applied to all 707 records (level axis) is logged here only. Replaced values are kept as `*_v0` fields.

### Coach answers that bear on the catalog, and what this pass found

| answer(s) | what the catalog must show | result |
|---|---|---|
| CAT-01, CAT-03, CAT-07 | every lens on every record; biomechanics is not a bucket; defaults only from BYOP or a coach answer | OK |
| CAT-02, VOL-05, UNI-05 | big / small classes; size never sets the 3 / 5 / 7% increase (the person's state does) | OK (0 size-based progression; stated in all 707 `muscle_size_class_basis`) |
| CAT-04, CAT-05, CAT-06, PRG-05 | load position sets the level; machines easier; levels theoretical; client volume level separate | FIXED: all 707 `generator_min_level_axis` strings (and section 2.2) still described the client levels as 'L1-L3 = NOVICE / NEWBY / INTERMEDIATE', the v0 ladder PRG-05 retired (novice = newby = L1; L2 = intermediate over a year; L3 = advanced) |
| CAT-04, CAT-10 (zones) | Davidson rotation biases; not for plyos; theoretical | FIXED: 5 v0 notes on 4 records still described plyo jumps by zone ('semantically Zone 1 (Receive pause/creat)' on the Single-Leg Depth Drop, 'Zone-1-type' on the High Depth Drop) or called the arm zones 'NOT the plyo zone' (cable curl, rope push-down); the cable-curl note also kept the v0 'peak tension' reading of the zones. All now marked superseded. 0 plyo / ankle records carry a zone |
| CAT-08, CAT-09 | thorax / pelvis rule; LEG FLEXION pool | OK; the v0 'CATEGORY CONFLICT' note on Knees to Chest marked resolved |
| CAT-10, CAT-11 | plyo method = how a jump is done, chosen by phase; unilateral harder; start ballistic | OK (`plyo_method_role: default_as_named` on 95 jumps; the 16 ballistic box / broad jumps are 'create then land' only) |
| CAT-13 | contra = into the hip (COD athletes), ipsi = out of the hip (sprint acceleration), BB / PL accessory weeks 1-4 | OK (13 modifiers) |
| UNI-01, UNI-07, PRG-07 | 10/10 = 10 per side = 1 set; pyramid notation | FIXED: (a) the per-side note sat on the '20 s Fast / 40 s Slow' cardio record ('20/40' is work / rest seconds) and on the Hex-Bar Jump Squat ('12/10/8/8' is reps per set) - removed and replaced by `interval_notation_v1` / `set_notation_v1`; (b) the 49 two-sided records said '10/10 = 10 per side' with no word on the coach's own correction (10/10 on bilateral curls was his mistake; a two-sided 10/10 on purpose = a set of 10 then another set of 10) - added; (c) 2 records with X/X doses lacked the note - added |
| UNI-04, UNI-12, LIB-20 | unilateral heavy low reps optional; frontal / transverse work for court and combat athletes | OK (no 'never heavy' rule anywhere) |
| VOL-09, LIB-14, LIB-16 | helpers 0.25; dips 0.5 / 0.5; thrusters 1.0 / 0.5 | FIXED: the straight-arm Lat Pull-over (the coach's 'pull under') gave biceps 0.25 - no elbow flexion, so BACK 1.0 only (SCIENCE; matches `12_volume_algorithm_v1.md`). 0.5 appears only on the 4 dips + diamond push-up (chest / triceps) and the 3 thrusters (shoulders) |
| VOL-10 | athletic patterns never count toward muscles | FIXED: the 4 push presses / push jerks are in both the VERTICAL PUSH and TRIPLE EXTENSION pools but `counts_toward_muscle_volume` was a flat true, so a jerk in the power slot would have counted toward shoulders; `volume_credit.by_pool` now makes the credit slot-dependent. 0 ATHLETIC records count |
| VOL-11, VOL-15, VOL-17 | 40-rep sets AMRAP only; myo sets on machines / isolation, last; calves 3 sets per leg day; rear delts own sets; ~2 core | OK (no 40-rep resistance dose; myo eligibility is derivable from `exercise_class` + `constraint_level`; `delt_head` on 22 records) |
| PER-02, PER-04, EQ-11 | 1-2 small changes between blocks; one axial squat a week; belt squat / leg press the other day | OK; PROPOSED encoding added to every `axial_spinal_load.rule` ('high' = the week's axial squat; other day 'none' / 'low'; 'moderate' only if not sore or already loaded) - question 10.2 #13 |
| ATH-01, ATH-06 | plyo : ballistic by ground-contact time; COD routes for every athlete by turn angle | OK |
| ATH-04 | boxers: reduce, never cut, pressing / arm volume in high punching weeks | FIXED (missing): `population_rules` on 96 push / biceps / triceps records |
| ATH-05, ATH-09 | no medball throwing for aesthetics (warm-up only); older = few plyos; no sex-based rules; youth may lift from the floor | OK (41 / 95 / 6 records; 0 sex terms in the JSON or either file) |
| ATH-08 | pitchers: less overhead pressing, more arm care, light rotational throws | FIXED (missing): `population_rules` on 27 VERTICAL PUSH, 3 ARMCARE and 25 rotational throws |
| ATH-10 | everyone in athletic training gets Olympic lifts; beginners: DB / KB snatches, hex-bar jumps, hang pulls / cleans | FIXED: the Hex-Bar Jump Squat (named by the coach) was only in the PLYO pool, so a beginner's Olympic slot could not pick it - TX pool added (gym TX pool 44 -> 45) |
| ATH-11 | core first by default, movable | OK (0 'core after the power block' text) |
| ATH-13, FIX-03 | 'Justice League' only a marketing name | OK (0 in `program` fields or prose; tab name only in OBSERVED cell references) |
| ORD-08 | warm-up always; A-drills don't count as volume | FIXED: A-March / A-Skip / A-Runs / MACH drills were speed-session items counted as `reps_or_distance`; now also in the WARMUP pool, `volume_counting: warmup_not_counted`, `warmup_role_v1` (speed-session step kept, LIB-21) |
| EQ-01, EQ-02, EQ-07, EQ-08, EQ-12 | no bands, no variable resistance anywhere; no band chops | FIXED: the 'REVERSE BANDED' cue on the Single-Leg Squirrel Jumps alias and dose had no out-of-scope tag (the first pass only fixed the plyo push-up cue); the KB Face Pull notes still floated a 'band face pull'. The 7 rotational throws' no-ball substitute now leads with the coach's own Fake Medball Slam (plyo push-ups first for the rotational chest pass) instead of a core drill. 0 band / chain set-ups, 0 band substitutes, 0 band tier labels in active records |
| EQ-03, EQ-04, EQ-05, EQ-06, EQ-09, EQ-10, EQ-13 | never OHS / snatch / low-bar / depth jumps for older-injured-high-volume; machines from FOUNDATIONAL; seated machine press; medball max 20 lb; implement default; preference; constraint 1-5 | OK; 'never' also added to the High Depth Drop (above hip) as an INFERRED extension, PENDING (10.2 #12) |
| EQ-11 | machines not ranked; hack squat not last; belt squat no axial; GHD / reverse hyper if available and felt | OK (hack-squat 'fallback' survives only in `generator_rule_inferred_v0`) |
| EQ-14 | aerobic work on any erg for non-runners; keep distance | FIXED (not applied in v1): the 12 Aerobic A / B / C records were run-only - treadmill / erg set-ups and `modality_v1` added; `modality_v1` also on the 16 Lactate Clearance records |
| EQ-15, EQ-16 | loaded jumps 10-20% BW; box / hurdle heights | FIXED: the High Depth Drop's bodyweight substitute said 'drop from a high wall/stage', against the height ladder and the home safety note - now a medium depth drop from a bench |
| GEN-01, GEN-04, GEN-06, GEN-07, GEN-08 | Spanish later; default + dropdown; videos; cues; no V-squat; coach rules | OK (V-squat `eligible: false`; Spanish names and most videos still pending) |
| LIB-01 to LIB-09, LIB-11, LIB-13, LIB-15 to LIB-17, LIB-19, LIB-21, LIB-22 | renames, retirements, merges, set-ups, levels | OK for names / levels / retirements; FIXED: the Kong Row still carried the v0 Kroc-row dose '10-20 each arm (if Kroc-style)' (now 8-15 reps, both KBs together) and 11 v0 'ask coach / meaning unknown' notes on records these answers settled (L-test, low depth drop, push-up stick the landing, GHD, low DB squat, single-leg get-up, both alternating staggered-stance deadlifts, Kong row) are now marked superseded or confirmed |
| LIB-18 | 21.6 mi 'marathon' (26.2 mi) | OK (flag open); v0 'ask coach' notes marked answered in part |
| LIB-10, LIB-12, PRG-01, FIX-01 | unanswered / skipped | still PENDING, correctly marked |

### Retired ideas - grep results after this pass (JSON + both markdown files)

| retired idea | result |
|---|---|
| size-based 3 / 5 / 7% (big = 3%, small = 7%) | 0 (the only hits are the 707 statements that size does NOT set the increase, and this log) |
| 0.5 helper credit | 0 as a helper default; 0.5 only on dips + diamond push-up (LIB-16 / INFERRED) and thrusters (LIB-14) |
| band / chain / weight-releaser set-ups or substitutes in active records | 0; remaining mentions are OBSERVED aliases, out-of-scope tags, negations ('no bands') and `*_v0` fields |
| plyo zones as a fixed exercise property | 0 (5 v0 notes on 4 records marked superseded; remaining 'ZONE row band' mentions describe the Sheet23 layout, OBSERVED) |
| core after the power block as the default | 0 |
| sex-based rules | 0 |
| 'Justice League' as a program name | 0 (only OBSERVED tab / cell references and the rename notes) |
| hack squat ranked last / fallback only | 0 in live rules (`generator_rule_inferred_v0` only) |
| 6-week = 5 weeks + deload | 0 ('deload' hits are OBSERVED week labels and the box-squat 'deload' = sit on the box) |
| client levels 'NOVICE below NEWBY' (L1-L3 = NOVICE / NEWBY / INTERMEDIATE) | 0 (was 707 + section 2.2) |

### Recounted after the fixes

Section 3.3 implement counts (cardio_treadmill 25 -> 37, cardio_machine 22 -> 34), the 'New fields' counts (population_rules 231 -> 323 records; v1_changes 383 records / 608 entries) and the changes-by-question table were recomputed with python from the fixed JSON. Pattern, level, tier and constraint tables (3.1, 3.2, 3.3 first table) are unchanged: no record changed pattern, level, tier or constraint. In `02_no_equipment_subset.md` only the gym count of the triple-extension pool changes (44 -> 45; the hex bar is gym-only).

### Not changed here (other files to sync)

- `12_volume_algorithm_v1.md` proposes glutes 0.5 on hinges (PROPOSED); the catalog keeps the coach's helper value 0.25 (COACH-ANSWER VOL-09) - reconcile there.
- `01_taxonomy.md` still credits thrusters 0.25 and keeps its own level codes (from the first pass); it may also still describe A-drills as speed work only.
- `10_equipment_model.json` zone tags mix the CAT-04 load-position reading with the CAT-10 joint-angle reading (e.g. a goblet squat is zone 1 by its load, but any deep squat reaches the zone-3 position); not re-derived, and the coach says not to rely on zones yet.
- Minor naming, left as is: 'Cable Woodchopper (cable chop)' also has DB / KB / medball set-ups, so it appears in home profiles under a cable name.

## v1.1 verification log (2026-10-08)

Built by re-runnable python scripts that always start from the untouched v1 JSON (`apply_v1_1.py` + `apply_v1_1_b.py`, kept in the builder's scratchpad) and log every change per record (`v1_1_changes`). The markdown tables of sections 3, 4 and 6.3 and the subset tables were regenerated with a renderer that was first run on the v1 JSON and reproduced the v1 tables byte for byte (sections 3, 4, 6.3 and the subset sections 2 and 4); the only v1 difference it found is a stale count in the subset (section 6 of `02_no_equipment_subset.md`: the Plyo dropdown counted the Max-Velocity Sprint, which LIB-21 had moved to the SPRINT pool - 39 -> 38). Nothing in Google Sheets was touched; the crosswalk file was not changed.

| check | result |
|---|---|
| records / active exercise-like records | 939 / 732 (v1: 913 / 707) |
| crosswalk references that no longer resolve | 0 of 3824 |
| related links pointing to a missing id | 0 |
| duplicate names among active records | 0 |
| active records with a band or chains set-up / in the name | 0 / 0 |
| athletic records that count toward muscle volume (VOL-10) | 0 |
| KB swings that still credit glutes (R2-VOL-05) | 0 of 4 swing records |
| thrusters = QUADS 1.0 + SHOULDERS/TRAPS 0.5 + GLUTES 0.25 (R2-VOL-05) | OK |
| counted BKD records without a glute credit (only the sissy squat may have none) | Sissy Squat |
| records with a 0.5 credit (expected: dips, diamond push-up, thrusters) | Assisted Dips (machine); Barbell Thruster; DB Thruster (front squat into overhead press); Diamond (Close-Hand) Push-Up; Machine Dip; Parallel-Bar Dip; Single-Arm DB Thruster; Weighted Dip |
| medball records with a max load over 20 lb (EQ-06) | 0 |
| PLYO / ANKLE / THROW records with an R2-ATH-02 contact class | 137 of 137 |
| PLYO / ANKLE records with a Receive-Create stage (R2-ATH-03) | 96 of 96 |
| TX records without an Olympic family (expected: the extension drills) | Bodyweight Squat to Calf Raise; Hex Bar Squat to Calf Raise; Lunge to High-Knee Reach; Weighted Squat to Calf Raise (any implement) |
| PLYO / ANKLE / Olympic records not off-by-default for 60+ (R2-ATH-08) | 0 |
| older adults still 'never' on Olympic / plyo items (should be opt-in, R2-ATH-08) | 0 |
| ATH-09 'few plyos unless they ask' rules left in live fields | 0 |
| PROPOSED-ADDITION records / of them default candidates | 22 / 0 |
| 21.6-mile run: record type / generator eligible | retired / False |
| KB face pull: pools / default candidate / credit | ['SHLD'] / False / {'SHOULDERS/TRAPS': 1.0} |
| flags still saying PENDING LIB-10 / LIB-12; pending_coach still PENDING | 0; 0 |
| plyo method 'not named / PENDING' wording left in athletic_quality | 0 |
| axial rules still saying PENDING COACH APPROVAL | 0 |
| zone bases still reading levels from zones | 0 |

Spot checks: Bench Push-Up - Feet on Bench = ADVANCED, AF11 + Sheet23 Z4 (R2-LIB-05); Belt Squat = FOUNDATIONAL (R2-LIB-07); Kettlebell Swing (Russian) pools TX + BHD, 0 sets (R2-VOL-05); Power Snatch = snatch day, 60+ off by default, injured / high-volume 'never' (R2-ATH-04, R2-ATH-08, EQ-03); Squat Clean reps '3-5 per set' (R2-ATH-05); Barbell Good Morning = counted heavy spine lift, Goblet Squat = second-day option if not sore (R2-SES-02); Depth Jump = plyometric, stage 2 Land & Go (R2-ATH-02 / R2-ATH-03); Wall Ball medball max 20 lb (EQ-06).

Not changed here (other files): `04_profiles.json` sport ids (`sport_use_v1_1` uses plain names), `05_templates.json` (NO ACCESS wiring, R2-LIB-08), `12_volume_algorithm_v1` / `03_volume_rules.json` (their credit map should drop the KB swing glute credit and use thrusters 1.0 / 0.5 / 0.25 and hinge glutes 0.25, R2-VOL-05), `10_equipment_model.json` (zones and constraint levels of the new records are INFERRED here), `generator_spec_v1.json` (left to the master / spec step).

## v1.1 verification log - adversarial check (2026-10-08)

Adversarial check of the v1.1 round-2 update. `coach_answers_round2.md` was re-read in full first (authority: round 2 > round 1 > everything else). Every check ran with python on `02_exercise_catalog.json` and on this file; fixes were made in place (JSON + tables + examples), each JSON fix logged in the record's `v1_1_changes` with `pass: 'v1.1 adversarial check (2026-10-08)'` (762 entries on 733 records: 29 targeted fixes + 733 `muscle_size_class_basis` rewrites). Nothing in Google Sheets was touched; the crosswalk file was not changed (3824 references, 0 unresolved; related links 0 unresolved; duplicate active names 0).

**Verdict: the round-2 library answers (R2-LIB-01 to R2-LIB-08, LIB-10, LIB-12), R2-VOL-05, R2-SES-01 / R2-SES-02, R2-ATH-02 to R2-ATH-05, R2-ATH-08, R2-PER-07 and R2-GEN-02 / R2-GEN-06 / R2-GEN-08 were applied - but not everywhere.** The first pass had left one live lifestyle input on 733 records, a swing that could still be the default hip-dominant pick, a '% of 1RM' name, a plyometric drill that was on by default for 60+, and several stale answer states. All fixed below.

### Round-2 answers that bear on the catalog, and what this check found

| answer | where it lives | finding | fix |
|---|---|---|---|
| R2-VOL-01, R2-VOL-03, R2-GEN-04, R2-PER-03 / R2-PER-04 (stairway, no check-in = no change, no lifestyle inputs) | `muscle_size_class_basis` (733 records), v1 changelog CAT-02 | every record still said the weekly step 'is chosen by the person's state (fatigue, life, response)' - a lifestyle input the coach rejected | FIXED: rewritten on 733 records (planned stairway; no check-in = no change; a check-in step from effort, completion and pain only). **Resolution flagged:** the R2-VOL-01 table is approved but used without its 'life' columns, because R2-GEN-04 rejects sleep / stress / life questions. CAT-02 row annotated |
| R2-VOL-02 (effort 10 = max but successful) | not a catalog field | no effort wording in records | OK (taxonomy F.DOSE fixed) |
| R2-VOL-04 / R2-VOL-06 (floor 10, most 20-30, caps customizable, 'pro' level) | not a catalog field | no weekly-set targets in records | OK; rear-delt 4 / 6 / 8 vs floor 10 flagged in `01_taxonomy.md` pending |
| R2-VOL-05 (glutes 0.25 on squats / lunges / deadlifts / RDLs; thrusters 1.0 / 0.5 / 0.25; KB swings never glutes) | `volume_credit`, `generator`, 6.2, 10.1 | credits right (BKD 40 x 0.25 + sissy squat none; UKD 21 x 0.25; BHD 15 hinges 0.25 + 10 thrust / bridge / pull-through / reverse-hyper 1.0; UHD 8 + 3; 3 thrusters 1.0 / 0.5 / 0.25; 3 swings 0). But the 3 thrusters' `pending_coach` still read 'CONFIRM'; the 6 thruster rows in 6.2 and 10.1 #9 lacked the glute share; and the Russian and split-stance swings were record-level default candidates, so the hip-dominant slot could default to a swing that fills 0 sets (the subset showed them with `*`) | FIXED: `pending_coach` RESOLVED by R2-VOL-05; `flags_resolved_v1.how_v1_1`; 6.2 and 10.1 annotated; new `generator.default_candidate_by_pool` (default only in TX); subset stars and KB counts fixed |
| R2-VOL-07 (no deload inside a block) | 8.4, notes | only OBSERVED week labels ('DELOAD', 'DELOAD WEEK') and the box-squat 'deload' (= dead stop) | 8.4 rows annotated 'OBSERVED label only' |
| R2-VOL-08 (not understood) | - | not a catalog item | default kept elsewhere |
| R2-SES-01 / R2-SES-02 (two heavy spine days; counted list) | `spine_day_v1_1` (158) | 4 calf raises (machine, bodyweight deficit, DB, weighted single-leg) were tagged 'second-day option if not sore' - the second-day list is for front-loaded squats, and calves run every leg day (VOL-17); the Belt Squat note still said 'squat once a week' | FIXED: calf raises -> 'not counted (INFERRED)' (now 25 counted / 25 second-day / 40 Olympic / 68 other); belt-squat note annotated; R2-SES row counts updated |
| R2-SES-03 (light core opener; supersets anywhere) | 2.1 | not stated | added to 2.1 |
| R2-SES-04 / R2-SES-05 (12 + 2 core; full-body 2-4 exercises per muscle) | session files; subset section 6 | the subset's NO ACCESS tables could read as the v1.1 session shape (single slots for biceps, calves ...) | subset section 6 now says it is OBSERVED wiring and that full-body days get 2-4 exercises per muscle |
| R2-ATH-02 (ballistic / plyometric / receive) | `contact_class_v1_1` (150) | named lists verified by name pattern: depth jumps, pogo / ankle hops, hurdle hops, bounds, squirrel jumps, repeated jumps = plyometric; box / broad / squat jumps = ballistic except the documented tie-breaks (depth-drop-to-box-jump and hurdle-hops-into-box-jump = plyometric, unloaded split squat jumps = plyometric, DB repeated squat jumps = ballistic); 41 throws ballistic; 12 landings receive | OK |
| R2-ATH-03 (Receive-Create stages) | `receive_create_stage` (96) | Plyometric Push-Ups: class plyometric (repeated) but default stage 1 with the v1 'one big effort, stuck landing' note | FIXED: default stage 3 Repeat, stages 1-3 (section 4 row too) |
| R2-ATH-04 / R2-ATH-05 / R2-GEN-06 (up to 4 x a week; clean / snatch days; reps; RPE not %) | `olympic_v1_1` (39) | no once-a-week cap anywhere (the in-season light piece has no weekly cap); but 'Hang Snatch (% of 1RM; catch not stated)' kept the % in its name (its Hang Clean twin was renamed), and the DB Push Jerk carried the 'barbell catch 3-5 reps' text although R2-ATH-05 keeps the ramp for DB / KB | FIXED: renamed 'Hang Snatch (catch not stated)' (`name_v1` kept; sections 4 and 8.1); DB Push Jerk reps = the DB / KB ramp |
| R2-ATH-08 (60+ no Olympic lifts / plyos / depth jumps by default; youth floor ~14) | `older_default_excluded` | every PLYO / ANKLE / Olympic record was off by default, but the PROPOSED Split-Step Reaction Drill (classed plyometric) was not | FIXED: off by default for 60+, no-hop split-step as the default swap (INFERRED), opt-in with the warning; 141 records; question 10.3 #3 reworded. Youth floor rule on the 6 floor lifts: OK |
| R2-LIB-01 / R2-LIB-02 / R2-LIB-03 | `variation_v1_1` (553), `davidson_zone` | OK (0 levels read from zones) | - |
| R2-LIB-04 / LIB-10, R2-LIB-05 / LIB-12 | KB face pull, bench push-ups | records right; notes still said 'LIB-10 still PENDING', 'verify with coach' and 'Ask coach' | FIXED: notes annotated with the answers |
| R2-LIB-06 (21.6-mile run removed; 'the longest run stays the half-marathon plan') | retired record, tests | retired correctly; its note still said 'the mismatch stays open'; the 14-, 17- and 20-mile distance tests are longer than the half marathon the coach kept as the longest run | FIXED: note closed. FLAGGED: 3 distance tests (6.3 group, question 10.3 #5) - kept as OBSERVED until the coach decides |
| R2-LIB-07 (library additions and levels) | 9 records | the Table Row's FOUNDATIONAL was cited as set by R2-LIB-07, but the coach named no level for the three home items; section 3.2 said '10 levels set by a round-2 answer'; 6 R2-LIB-07 records kept the stale "'any'/unrated" `generator_min_level_basis` | FIXED: Table Row level basis INFERRED; 3.2 now says 8; basis aligned on 6 records |
| R2-LIB-08 (NO ACCESS) | subset section 6 | 4 of 4 'Unilateral HD' rows on AQ | OK |
| R2-PER-07 (test before / at the end; no 1RM or max mile from zero) | `test_rules_v1_1` (13) | OK; no record name or live field offers a 1RM to the untrained | - |
| R2-GEN-02 (videos optional) | 2.x, notes | 0 live 'needs a video' text | OK |
| R2-GEN-08 (Spanish format) | changelog | format recorded, names pending | OK |
| R2-ATH-01, R2-ATH-06, R2-ATH-07, R2-PER-01 / R2-PER-02 / R2-PER-05 / R2-PER-06, R2-GEN-01 / R2-GEN-03 / R2-GEN-05 / R2-GEN-07, R2-SES-06 | profiles, periodization, session, product files | no catalog field | - |
| Coach request 2026-10-08 (every popular US sport, swimming; pickleball and HYROX for gen pop) | 2.8, `sport_use_v1_1` | 22 PROPOSED-ADDITION records + tags on 38 existing records; tags name 46 sports incl. swimming (18 records), pickleball (19), HYROX (16), CrossFit, bootcamp, football, basketball, baseball, softball, soccer, ice hockey, volleyball, tennis, golf, lacrosse, rugby, wrestling, boxing, MMA, rowing, cycling, skiing, triathlon, active aging. Sports in `synthesis/sports/*.json` with no tag (field hockey, ultimate, cheer, track event groups, cross country, judo, karate, taekwondo) use existing library items (INFERRED: no new exercise needed); `sport_use_v1_1` uses plain names and the profile merge maps them to profile ids | OK (no change) |

### Retired ideas - grep after the fixes (live text; history = v0 / v1 changelogs and logs, `*_v0` / `*_v1` / `*_before_check` fields, OBSERVED aliases and cells)

| retired idea | JSON live | this file live | subset live |
|---|---|---|---|
| acclimation step caps / start-hard 8-week / target-seeking | 0 | 0 | 0 |
| deload or maintenance week inside a block | 0 (only OBSERVED labels and the box-squat 'deload' = dead stop) | 0 (8.4 labels annotated) | 0 |
| life / sleep / stress inputs | 0 (was 733; the new text says 'no sleep / stress / life inputs') | 0 | 0 |
| effort 10 = fail | 0 | 0 | 0 |
| KB swing glute credit | 0 | 0 | 0 |
| 1 exercise per muscle on full-body days | 0 | 0 | 0 (section 6 note) |
| Olympic once-a-week cap | 0 (only the PER-04 `rule_v1` axial history, and the belt-squat note now annotated) | 0 | 0 |
| mid-block tests | 0 (only 'never mid-block') | 0 | 0 |
| 1RM test for the untrained | 0 ('% of 1RM' left the last name; `load_guidance` and `test_rules` say RPE / 5RM / 3RM) | 0 | 0 |
| mandatory videos | 0 | 0 | 0 |

### Recounted after the fixes

`older_default_excluded` 140 -> 141; spine-day classes 25 counted / 29 -> 25 second-day / 40 Olympic / 64 -> 68 not counted; `v1_1_changes` 615 records / 1420 entries -> 733 / 2182; section 2 table of the subset: Bilateral HD KB 8 [6] -> 8 [5], Unilateral HD KB 5 [5] -> 5 [4]. Pattern, level, tier and constraint tables (3.1 - 3.4) are unchanged: no record changed pattern, primary level, tier, constraint or record-level default flag (the swings keep `default_candidate: true` for the TX slot; the per-pool flag is new).

### Not changed here (other files to sync)

- `03_volume_rules.json` / `12_volume_algorithm_v1` / `05_templates.json` / `generator_spec_v1.json`: read `generator.default_candidate_by_pool` before `default_candidate`; drop any lifestyle input from the step rule (R2-GEN-04); the rear-delt 4 / 6 / 8 vs floor-10 reconciliation (R2-VOL-04 / R2-VOL-06).
- `04_profiles.json` / `synthesis/sports/*.json`: the 60+ no-hop split-step default for pickleball / tennis / padel profiles; the 14 / 17 / 20-mile tests (10.3 #5) for running profiles.
