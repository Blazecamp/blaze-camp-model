# 10 · Equipment model for the program generator (Blaze Camp) - v1

> **Status (2026-10-11, model v1.3).** This file was last issued at v1 (round 1) and was not re-issued for rounds 2 to 4, CT-01 or CX-01..04. The current rules are in `BLAZE_CAMP_BRAIN.md` v1.3 (what changed: §0c for round 3, §0d for round 4, CT-01 and CX-01..04) and in `generator_spec_v1.json` 1.3.0. Where this file differs from them, they win. The equipment rules that still stand as written: no bands, chains or weight releasers anywhere (EQ-01, EQ-12), no sex-based rule (ATH-09), machines not ranked (EQ-11), medballs of 20 lb at most (EQ-06). Read as history in this file: a weekly step of 3, 5 or 7 % "by the person's state" and "10 % a week" as a limit (one planned stairway; the planned final sets are reached with no hard limit on a step, COACH-R3 R3-VOL-04; COACH-CX CX-01; COACH-R4 R4-PRG-02); 60+ rules where they differ from COACH-R3 R3-ATH-02 (jumps, ankle hops, Olympic lifts and depth jumps off by default and switchable; snatch variants out); any use of session length to pick or cut exercises (COACH-CT CT-01). Not yet in this file: sled pushes and wall balls as primary picks in HYROX only, and optionally the CrossFit-style class (COACH-R4 R4-LIB-01); carries and sleds by distance or time (R4-LIB-02); incline pressing before overhead pressing (R4-LIB-03); the "keeps / loses" line on an equipment swap (R4-LIB-04).

**What this file is.** The equipment layer of the generator. A person enters basic information, including the equipment they have, and the generator builds a plan in this coach's style: a 4-6-week maintenance/transition block, an 8-week or a 12-week program, an open week-by-week plan or a yearly plan (COACH-ANSWER PER-01). This file says which implements the coach uses, for whom, in which order inside a session, at what load and speed, and what to put in each template slot when a piece of equipment is missing.

**Files.** `synthesis/10_equipment_model.json` is the machine-readable model (top-level keys `implements`, `out_of_scope_implements`, `constraint_scale`, `level_model`, `access_profiles`, `substitution_by_category`, `client_rules`, `picks_by_client_family`, `intent_sequence`, `load_velocity`, `machine_preferences`, `exercise_index`, `open_questions`, among others; the v1 change log is `_meta.v1`). This `.md` explains it. Both are rebuilt by `synthesis/_build_10/` (`build_10_equipment_model.py` → `build_10_assemble.py` → `build_10_write_md.py`; zone tagger in `zones.py`).

**Inputs.** `coach_answers_full.md` and `coach_answers.md` (read first; the coach's answers override every sheet inference and every earlier team decision), everything in `analysis/equipment/` (library decodes, BYOP and MASTER MODEL program decodes, reference-tab variables, ordering audit), and `synthesis/10b_equipment_variables_science.md`. Bucket IDs follow `synthesis/05_session_architecture.md`.

| Label | Meaning |
|---|---|
| **COACH-ANSWER** | The coach's answers to the questionnaire (`coach_answers_full.md`, 138 of 140 answered, and `coach_answers.md`, 2026-10-08), cited by question ID (e.g. COACH-ANSWER EQ-11). Authoritative: they override anything inferred from the sheets. A RIGHT verdict with no text makes our assumption his rule. |
| **OBSERVED** | Read from a workbook cell, cited as tab!cell. 'MM' = MASTER MODEL workbook. Bare cells such as `AI98` are BYOP 'MASTER EXERCISE LIBRARY'. Labels are quoted verbatim, typos included. |
| **COACH-CHAT** | The coach's spoken words relayed in the task brief (paraphrased closely). |
| **SCIENCE** | A published finding; [S#] points to the source list in `10b_equipment_variables_science.md` section 12. Rule ids EQ/GRD/FV/ROM/VOL/VARI/ORD/AR/TEMPO also come from 10b. |
| **INFERRED** | Our derivation. Every implement, constraint, zone, axial-load and velocity tag on an exercise is INFERRED from its name, because the library has no equipment column. |
| **PROPOSED** | Written as "PROPOSED - PENDING COACH APPROVAL": a science-grounded proposal where the coach asked us to research or propose, or where his answers leave a gap. |

## v1 - coach answers applied

Date 2026-10-08. Source: coach_answers_full.md (138 of 140 questions answered) + coach_answers.md; the coach answers are AUTHORITATIVE and override every sheet inference and every v0 decision. Every change below is built into the tables of this file and into the JSON (not a patch at the end); the question IDs point to `coach_answers_full.md`.

1. **EQ-01, EQ-02.** Bands removed everywhere: no 'band' / 'band_anchor' kit tokens, BANDS_ONLY profile deleted, HOME_DB_BENCH_BANDS -> HOME_DB_BENCH, bands dropped from every add-on and buy list. Ideal home kit = adjustable DBs + bench + pull-up bar + 8-10 lb medball.
2. **EQ-12.** Variable resistance out of scope: 'chains' token and weight releasers gone; banded / reverse-banded box squats AI92, AI93, AI95, AI96 removed; 'FAST BANDED' / 'CHAINED' lifts run with straight weight at 'FAST RPE6 or about 60-70%'; the v0 accommodating-resistance block is replaced by load_velocity.variable_resistance (out of scope) and out_of_scope_implements (history).
3. **EQ-01, LIB-09.** 14 library cells leave every list and count (exercise_index keeps them with the reason): U15 band-assisted pull-up; AI92/AI93/AI95/AI96; the 8 'Knee banded for adduction' FBS items (replaced by their 'Hold object Adducted between knees' twins); AQ16 Camporini (LIB-09 'ignore'). 6 'cable or band' names are shown with the cable route only.
4. **EQ-01, EQ-07, EQ-08.** 30 v0 band / reverse-band substitutes removed and replaced with a non-band option or dropped (_meta.v1.removed_v0_subs): band pulldowns -> foot-assisted pull-up, cable lat pull-over, DB pullover; band chops -> fast cable rotations; band leg extension / Spanish squat -> DB leg extension on a box, reverse Nordic, heels-elevated goblet; band Nordic -> eccentric-only Nordic; band calf raise -> seated DB calf raise; band rows/raises/curls/pushdowns -> cable or DB/KB versions.
5. **EQ-01.** Access profiles = the coach's 8 intake options (full gym, basic gym, home gym, home DB + bench, KB only, bodyweight only, hotel gym, field/track/outdoor kit). FULL_FACILITY and FIELD_TRACK_NO_KIT stay as derived (add-on) profiles; BOOTCAMP_OUTDOOR -> FIELD_TRACK_KIT; TRACK_FIELD -> FIELD_TRACK_NO_KIT (ids in _meta.v1.profile_id_changes).
6. **EQ-11.** Machine ranking retired: the Pendulum > Leg press > Hack order and the hack-squat demotion are gone from lists, picks and rules. Constraint differences instead: leg press 5; hack squat and pendulum back-supported 4; Smith 4 and least constrained. Belt squat added as a coach-named option (ADD-EQ11) for axial sparing. GHD / reverse hyper only if available and the client feels the target muscles.
7. **EQ-10, GEN-04.** The client may choose between alternatives (preference); each slot keeps a default plus a dropdown of its category (CR-31).
8. **EQ-13.** The 1-5 constraint scale is coach-approved; EQ-11 adds the order inside level 4 (GRD-4).
9. **EQ-03, EQ-04.** Older / injured / high-volume clients: compounds and isolation lean machine/cable; never overhead squat, snatch, low-bar squat or depth jumps (CR-33; enforced in the older_or_pain picks). FOUNDATIONAL clients may use machines filed MODERATE/ADVANCED (confirmed).
10. **EQ-05.** 'Seated Machine Shoulder Press' added to VERTICAL PUSH (ADD-EQ05, constraint 5); a seated Smith press is its substitute.
11. **EQ-06, ATH-05.** Medball weights: passes/rotations 8-10 lb, overhead 6-10, sit-up 6-8, slams 10-20; heavier only for medball cleans / wall balls; never over 20 lb; lighter for youth and older clients; no throwing in the main workout for aesthetics (warm-up only) - the hypertrophy picks for the Throwing slot now say "not used".
12. **EQ-07.** No medball -> plyo push-ups, fast cable rotations, the no-ball 'fake medball slam'; band chops removed ('worthless').
13. **EQ-08.** No leg extension / leg curl machine -> swap: DB leg extension on a box, sissy squat (reverse Nordic PROPOSED); nordics, slider or swiss-ball curls. The 'add 2 rounds to front squats' rule is now the fallback.
14. **EQ-09.** Default implement when a name has none: bodyweight -> DB -> barbell as the level rises, within the kit (CR-30).
15. **EQ-14, ATH-07, FIX-02.** Aerobic work on any erg or running; tracked by distance, calories or time with one unit per block (CR-35); DISTANCE and CALORIES blocks open to every template.
16. **EQ-15, GEN-02.** Loaded jumps 10-20% of body weight, too heavy when jump height or speed drops; body weight is now an intake field.
17. **EQ-16, LIB-04.** Depth drops low 6-12 in / medium 12-18 in / high above hip; hurdles 6 in moderate, 12 in+ advanced (load_velocity.plyo_heights).
18. **ATH-10.** Everyone in athletic training gets Olympic-lift work. Four options from his programs are added as FOUNDATIONAL triple-extension options (ADD-ATH10-1..4: hang cleans without bumpers, single-arm DB snatch, KB squat cleans, hex-bar squat jumps).
19. **ATH-09.** No sex-based rules (CR-19 female medball modifier retired); youth may do some Olympic lifts from the floor (CR-18); older clients get few plyos unless they ask (CR-10).
20. **CAT-10, CAT-11, CAT-05.** Zones are Davidson rotation biases (rotation_bias tag added); zones do not apply to plyos (plyo zone tags removed); the Sheet23 plyo 'ZONE 1/2/3' key is an unnamed method progression; levels stay soft (LV-7, LV-8).
21. **LIB-13.** Push press back to FOUNDATIONAL ("easier"); push jerk INTERMEDIATE ("intermediate/advance"). v0 had both at ADVANCED.
22. **LIB-02, LIB-03, LIB-07, LIB-08, LIB-09, LIB-11, LIB-15, LIB-16, LIB-18.** Library details: 'Squat Snatch' / 'Squat Clean' / 'Squat Clean & Jerk' display names; GHD has no level; Kong row added as a KB pain option; 'Single Leg Get Ups' = box pistol; 'Low DB Squats' = DBs at the sides (zone 1); alternating deadlifts = alternating staggered-stance single-leg deadlifts; 'pull under' = lat pull-over; push-up stick the landing = hands from a box to the floor; AA51 = barbell press; leg-extension/curl level labels are typos; dips 0.5/0.5; '21.6 mile run' flagged (a marathon is 26.2 mi).
23. **PER-04, EQ-11.** axial_load tag on every lower-body exercise; one axially loaded squat day per week - the second squat day uses leg press / belt squat (CR-29); deadlifts also load the spine, so heavy hinging is kept to one day (PROPOSED, open question).
24. **ATH-11, ORD-01, ORD-02, ORD-03, ORD-04, ORD-05, ORD-06, ORD-08, ORD-09, ORD-10, UNI-11, VOL-15, VOL-17.** Session order: warm-up always; core FIRST by default (movable); power before strength; row before pulldown always but the main lift first whatever its direction; hip-dominant + push and knee-dominant + pull on every day type incl. bootcamps; supersets as a fatigue tool; MYO last on machines/isolation; calves 3 sets each leg day and rear delts their own sets. Retired exceptions: pulldown before row, strength above Olympic work, core placement by family.
25. **VOL-03, UNI-08.** Pain rule: machines or split grips plus a 30-50% cut, drop the exercise if still too much; keep the sets when a bilateral lift turns unilateral if possible (CR-12).
26. **VOL-07.** High-volume rule: added sets go to the exercises already in the session, first exercise first (CR-14).
27. **CAT-13.** Contralateral (into the hip, COD athletes) vs ipsilateral (out of the hip, sprint acceleration) loading rule; health accessory for bodybuilders/powerlifters in the first 2-4 weeks (CR-32).
28. **UNI-02, UNI-03.** Laterality-shift rule now defers to the adjustable bilateral:unilateral ratio (90/10 to 10/90, moved by pain) in 03_volume_dosing (CR-25).
29. **GEN-02, PRG-05.** Intake: sex removed; training experience in years with the coach's novice / intermediate definitions; body weight added; optional equipment preference.
30. **ATH-01, ATH-02, ATH-04, ATH-06, ATH-08, ATH-12, PER-08, PER-09, UNI-10, VOL-09, VOL-10, VOL-11, PRG-03.** Athlete and goal rules: plyo vs ballistic by ground-contact time; boxers reduce (not cut) pressing; COD routes for every athlete; pitchers less overhead; contrast for intermediate+ off-season; in-season focus; helpers credit 0.25 (chin-up note); athletic sets never count toward muscles; 40-rep sets only as a CrossFit/AMRAP option; bootcamp timed circuits.
31. **all.** Open questions rebuilt: 21 of the 24 v0 questions are answered (open_questions.answered_v0); 7 remain open; 12 new questions come from the answers (the 12th was added by the v1 verification, CR-11).

**Still pending:**

- PROPOSED - PENDING COACH APPROVAL: French contrast 4th member without a reverse band (pogo / repeat squat jumps or a 3-member complex).
- PROPOSED - PENDING COACH APPROVAL: non-library replacements for band options (reverse Nordic, foot-assisted pull-up, seated DB calf raise, eccentric-only Nordic, ball-squeeze dead bug, seated Smith shoulder press).
- PROPOSED - PENDING COACH APPROVAL: advanced (L3) definition (CR-17); the second squat day for home clients without machines (CR-29); equipment-preference intake question (CR-31); free-weight main lifts for fit 60+ clients (CR-11, open question 12 - added by the v1 verification); heavy-medball hang clean as the field-kit Olympic option (athlete picks, ATH-10 / EQ-06).
- Coach decision needed: add belt squat, seated machine shoulder press and the ATH-10 beginner Olympic options to the MASTER EXERCISE LIBRARY (with a level).
- Unanswered: LIB-10 (KB Face Pulls U20), LIB-12 (Bench Push ups AD13/AF11), PRG-01 (NO ACCESS, skipped), CAT-12 (not understood; rephrased), seal-row level, dips / hanging-core level.
- Parked by the coach: all variable resistance (bands, chains, weight releasers) for a later version (EQ-01, EQ-12).
- Team alignment: generator_spec_v0.json, 09_generator_inputs.md and 02_exercise_catalog still use the v0 profile ids and include the band cells; use _meta.v1.profile_id_changes and exercise_index[cell].excluded.

**Profile ids, v0 → v1** (`_meta.v1.profile_id_changes`):

| v0 id | v1 |
|---|---|
| HOME_DB_BENCH_BANDS | HOME_DB_BENCH (bands removed, COACH-ANSWER EQ-01/EQ-02) |
| BANDS_ONLY | REMOVED (COACH-ANSWER EQ-01: "I don't program anything with bands"); a client who owns only bands is a BODYWEIGHT client |
| BOOTCAMP_OUTDOOR | FIELD_TRACK_KIT (bands removed; renamed to the coach-approved option "field/track/outdoor kit", EQ-01) |
| TRACK_FIELD | FIELD_TRACK_NO_KIT (derived: the field/track option with no kit carried) |
| FULL_FACILITY | FULL_FACILITY (kept as a derived profile = FULL_GYM + every performance add-on; chains removed, EQ-12) |

**Library cells removed from every list and count** (`exercise_index[cell].excluded`; the level test of section 1.4 still covers them because it tests the library as written):

| Cell | Exercise (verbatim) | Why | Basis | Use instead |
|---|---|---|---|---|
| U15 | Assisted  Pull-Up w bands | band-assisted pull-up | COACH-ANSWER EQ-01, EQ-02 | 'Assisted Pull-Up Machine' U16:U18; pull-up negatives / flexed-arm hang; foot-assisted pull-ups (substitutes) |
| AQ16 | Camporini Deadlifts | Camporini Deadlifts - coach: ignore | COACH-ANSWER LIB-09 | 'Staggered Stance DL w/ DB' AQ12, 'Alternating DB Deadlifts' AQ13 |
| AI92 | Box. Any Squat Touch and Go (Banded) | banded / reverse-banded box squat (variable resistance) | COACH-ANSWER EQ-12 | 'Box. Any Squat Touch and Go fast' AI91 or 'Box. Any Squat Deload' AI94, straight weight 'FAST RPE6 or about 60-70%' |
| AI93 | Box. Any Squat Touch and Go (Reverse Banded) | banded / reverse-banded box squat (variable resistance) | COACH-ANSWER EQ-12 | 'Box. Any Squat Touch and Go fast' AI91 or 'Box. Any Squat Deload' AI94, straight weight 'FAST RPE6 or about 60-70%' |
| AI95 | Box. Squat Deload (banded) | banded / reverse-banded box squat (variable resistance) | COACH-ANSWER EQ-12 | 'Box. Any Squat Touch and Go fast' AI91 or 'Box. Any Squat Deload' AI94, straight weight 'FAST RPE6 or about 60-70%' |
| AI96 | Box. Any Squat Deload (reverse banded) | banded / reverse-banded box squat (variable resistance) | COACH-ANSWER EQ-12 | 'Box. Any Squat Touch and Go fast' AI91 or 'Box. Any Squat Deload' AI94, straight weight 'FAST RPE6 or about 60-70%' |
| BC11 | Knee banded for adduction, half kneeling crunch down into active knee | band round the knees for adduction | COACH-ANSWER EQ-01 | the 'Hold object Adducted between knees' twin (BC10) |
| BC12 | Knee banded for adduction, split standing down crunch into active knee | band round the knees for adduction | COACH-ANSWER EQ-01 | the 'Hold object Adducted between knees' twin (BC9) |
| BC15 | Knee banded for adduction, half kneeling crunch midline into active knee | band round the knees for adduction | COACH-ANSWER EQ-01 | the 'Hold object Adducted between knees' twin (BC14) |
| BC16 | Knee banded for adduction, split standing midline crunch into active knee | band round the knees for adduction | COACH-ANSWER EQ-01 | the 'Hold object Adducted between knees' twin (BC13) |
| BC19 | Knee banded for adduction, half kneeling crunch up into active knee | band round the knees for adduction | COACH-ANSWER EQ-01 | the 'Hold object Adducted between knees' twin (BC18) |
| BC20 | Knee banded for adduction, split standing up crunch into active knee | band round the knees for adduction | COACH-ANSWER EQ-01 | the 'Hold object Adducted between knees' twin (BC17) |
| BC48 | Knee banded for adduction, half kneeling Pallof hold | band round the knees for adduction | COACH-ANSWER EQ-01 | the 'Hold object Adducted between knees' twin (BC47) |
| BC49 | Knee banded for adduction, split standing pallof hold | band round the knees for adduction | COACH-ANSWER EQ-01 | the 'Hold object Adducted between knees' twin (BC47) |

**Options added from the coach's answers** (not in his library; counted as as-written options of their slot):

| Id | Exercise | Slot | Level | Constraint | Available in | Source |
|---|---|---|---|---|---|---|
| ADD-EQ05 | Seated Machine Shoulder Press | RP_VPUSH | F | 5 | FAC, FULL, BASIC | COACH-ANSWER EQ-05 - RIGHT to our question 'VERTICAL PUSH has no machine or cable option. Add a seated machine shoulder press?' (our assumption, now his rule: yes, for older and injured clients) |
| ADD-EQ11 | Belt Squat | RP_BKD | F | 4 | FAC | COACH-ANSWER EQ-11: 'Belt squats are for people that you don't need to load them axially ... If you have an athlete that already has been loaded on their back that week ... switch over to the belt squat' |
| ADD-ATH10-1 | Hang cleans (high/mid hang, lowered under control - no bumpers) | AP_TRIPLE_EXT | F | 2 | FAC, FULL, BASIC, H-BB | COACH-ANSWER ATH-10 ('everyone gets Olympic lifts'; beginners: DB/KB snatches, hex bar jumps, hang pulls, hang cleans without bumpers); OBSERVED MM BASEBALL 'OPTIONAL PIECE' rows 'Hang cleans @ 75%' -> '@ 90%' (e.g. CM33) |
| ADD-ATH10-2 | Single Arm DB snatch from floor | AP_TRIPLE_EXT | F | 1 | FAC, FULL, BASIC, H-BB, H-DB, KB, HOTEL | COACH-ANSWER ATH-10 ('everyone gets Olympic lifts'; beginners: DB/KB snatches, hex bar jumps, hang pulls, hang cleans without bumpers); OBSERVED MM BASEBALL!BG38 |
| ADD-ATH10-3 | KB Squat cleans | AP_TRIPLE_EXT | F | 2 | FAC, FULL, BASIC, H-BB, H-DB, KB, HOTEL | COACH-ANSWER ATH-10 ('everyone gets Olympic lifts'; beginners: DB/KB snatches, hex bar jumps, hang pulls, hang cleans without bumpers); OBSERVED MM BASEBALL!BC33 |
| ADD-ATH10-4 | Hex bar squat jumps | AP_TRIPLE_EXT | F | 2 | FAC, FULL | COACH-ANSWER ATH-10 ('everyone gets Olympic lifts'; beginners: DB/KB snatches, hex bar jumps, hang pulls, hang cleans without bumpers); OBSERVED MM BASEBALL!S33 |

**v0 band / reverse-band substitutes removed** (`_meta.v1.removed_v0_subs`):

| v0 substitute | Slot | Basis (COACH-ANSWER) | Replaced by |
|---|---|---|---|
| pull ups or banded assisted pull ups | RP_VPULL | EQ-01 | foot-assisted pull-up / negatives |
| Banded fast LAT PULL DOWNS Single Arm | RP_VPULL | EQ-01 | cable lat pull-over; pull-up bar (buy list) |
| Max speed banded lat pull downs half kneeling ipsilateral | RP_VPULL | EQ-01 | cable lat pull-over; pull-up bar (buy list) |
| Half-kneeling band lat pulldown (controlled, high anchor) | RP_VPULL | EQ-01 | DB/KB pullover (partial) + pattern_gap |
| HEAVY Single arm rotational half kneeling cable row or band row or Bird Dog Row (band version) | RP_HPULL | EQ-01 | the cable route of the same cell; Bird Dog DB/KB row; Kong row (LIB-09) |
| Half-kneeling band overhead press (band under the knee) | RP_VPUSH | EQ-01 | DB/KB half-kneeling press; pike push-up |
| Seated machine/Smith shoulder press (not in the library) | RP_VPUSH | EQ-05 | now the coach-approved addition 'Seated Machine Shoulder Press' (ADD-EQ05) + a Smith substitute |
| Split-stance band chest press (anchor behind) | RP_HPUSH | EQ-01 | push-up / DB / KB press options already in the list |
| Band fly | RP_HPUSH | EQ-01 | DB flies where there are DBs; dropped otherwise |
| Face pulls (band) | ISO_SIDE_REAR_DELT | EQ-01 | 'Face pulls (cable)' |
| Band lateral raise / band front raise (stand on the band) | ISO_SIDE_REAR_DELT | EQ-01 | KB upright row, household-load raise |
| Band pull-apart | ISO_SIDE_REAR_DELT | EQ-01 | prone floor Y/T raises |
| Band curl (stand on the band) | ISO_BICEP | EQ-01 | KB curl; backpack curl |
| overhead band tricep ext | ISO_TRICEP | EQ-01 | KB overhead extension; diamond push-ups; bench dips |
| Band pushdown (high anchor) | ISO_TRICEP | EQ-01 | same as above |
| Seated band calf raise | ISO_CALF | EQ-01 | seated DB calf raise |
| banded leg extensions on bench | ISO_QUAD | EQ-08 | DB leg extensions on box; reverse Nordic |
| Band Spanish squat (band behind the knees) | ISO_QUAD | EQ-08 | heels-elevated goblet squat; reverse Nordic |
| Banded rolling hamstring curls | ISO_LEG_FLEXION | EQ-01/EQ-08 | slider / swiss-ball curls |
| Band-assisted Nordic curl (band from a high anchor to the chest) | ISO_LEG_FLEXION | EQ-01 | eccentric-only / hands-assisted Nordic |
| Fast band chest press / band punch | AP_THROW | EQ-07 | plyo push-ups |
| Fast band rotational chop | AP_THROW | EQ-07 ('Band chops are, to me, worthless') | fast cable rotations; fake medball slam |
| BILATERAL REVERSE BANDED JUMPS | AP_TRIPLE_EXT | EQ-12 | bodyweight jumps (tuck / broad) |
| Band front squat (band under the feet) | RP_BKD | EQ-01 | box pistol / pistol / slow deficit lunges |
| reverse banded squat jumps | RP_BKD | EQ-12 | dropped (bodyweight squat jumps sit in the plyo slot) |
| Band pull-through (low anchor) | RP_BHD | EQ-01 | KB swing; cable pull-through AN12 where there is a cable |
| Band good morning / band deadlift | RP_BHD | EQ-01 | backpack / water-jug deadlift |
| Band staggered-stance RDL | RP_UHD | EQ-01 | bodyweight single-leg RDL |
| cable or band anti-rotational pallof hold | CORE_ANY | EQ-01 | 'Cable anti-rotational pallof hold' (cable only) |
| Band-resisted walk (partner or post) / lateral band walk | FUNCTIONAL_DRAG | EQ-01 | sled or plate-on-towel push; otherwise skip |

**v1 checks (recomputed by the build):** shown option names that mention a band, chain or releaser in any slot list: 0. Curated substitutes that need an excluded token: 0. Profiles with an excluded token in the kit or the add-ons: 0. Cross-check against the decode teams' tiers: every disagreement is a band or chain route, except the six known v0 BASIC_GYM cells (TRX U19, X12, AS19; hex bar C11, C48; hip-high box G133).

**Earlier coach answers (v0, still built in):**

1. **Level = skill + stability + load position (CAT-04), zones as rotation biases (CAT-10).** Every loaded non-plyo exercise carries Dr. Pat Davidson's position zone: zone 1 low/front (foundational, external-rotation bias), zone 2 horizontal or racked on the body (intermediate, internal-rotation bias), zone 3 overhead or behind the body (advanced, external-rotation bias); for the hips and knees the bias follows depth (deep squat external, half squat internal). Machines and cables make any zone easier. Tested against the coach's own library levels in section 1.4. Operative-level overrides where his answers are explicit: 4 up (back squats to ADVANCED, push jerk to INTERMEDIATE), 14 down to FOUNDATIONAL (front-loaded zercher, low-skill guided machines), 2 GHD cells to 'any' (LIB-08).
2. **Levels add options and are soft (CAT-05/06).** A client sees every exercise at or below their level. Level is an eligibility ceiling and a ranking input, not the main driver. Client level and exercise level are separate axes.
3. **Knee flexion is its own segment (CAT-09).** `ISO_LEG_FLEXION` replaces `ISO_HAM` and absorbs 9 curl/Nordic items that the library files under 'BILATERAL HIP DOMNANT'. The coach had already written the segment: MM 'Sheet25'!H11 'LEG FLEXION' → H13 'ham curls'.
4. **Biomechanics is not a bucket (CAT-03); big vs small muscles is (CAT-02).** The 'FUNCTIONAL BIOMECHANICS SYSTEM' column is treated as a core/anti-rotation bucket. Small-muscle slots are DB-first.
5. **From the coach's chat statements.** Sport sets plyo emphasis (basketball most, MMA many, boxing/karate few; ATH-02 confirms the full ranking). The bilateral vs unilateral VOLUME relationship is very important: an equipment swap that changes a slot's laterality is flagged (`laterality_shift`) so the 03 ratio engine can keep it (UNI-02/UNI-08).

## 0. Short answers

| Question | Answer | Evidence |
|---|---|---|
| How should equipment be described? | Each exercise gets an implement, a **constraint level 1-5** (reference points: 5 = seated machine with back pad, 1 = open space/ballistic; coach-approved), a **position zone 1-3** with its rotation bias, a velocity intent, a laterality and (lower body) an **axial-load** tag. The constraint level is the main equipment axis. | COACH-ANSWER EQ-13, CAT-04, CAT-10, PER-04; 438 exercises tagged (`exercise_index`) |
| What makes an exercise foundational vs advanced? | Position (zone 1 → 2 → 3) minus the help of a machine, cable or support, plus skill and stability. Position alone reproduces 98 of 176 library levels exactly and 157 within one level. Levels are theoretical and never a hard gate (CAT-05). | COACH-ANSWER CAT-04, CAT-05; section 1.4 |
| Who gets machines? | Older, injured and high-volume clients for compounds AND isolation (EQ-03), with the MODERATE/ADVANCED-filed leg machines open to FOUNDATIONAL clients (EQ-04); beginners on upper-body pulls (ON_RAMP); leg machines as VOLUME_TOOLs for anyone. Athletes get machines only as the last 1-2 slots (0.5% of athlete items). Machines are NOT ranked against each other (EQ-11). | COACH-ANSWER EQ-03, EQ-04, EQ-11; OBSERVED MM athletes 5/949 machine items; gen pop 18% |
| Who gets free weights, medballs, Olympic lifts? | Athletes: constraint 1-2 on athletic slots and main lifts, 10-20% medball items, and Olympic-lift work for everyone in athletic training (beginners: hang pulls, hang cleans without bumpers, DB/KB snatches and cleans, hex-bar jumps; intermediate+: full lifts). Strength clients: barbell main lifts. Hypertrophy clients: 1-2 free-weight lead lifts, then machines/cables/DBs, and no medball throwing except in the warm-up. | COACH-ANSWER ATH-10, ATH-05; OBSERVED BYOP athletic constraint 2.17 vs aesthetics 2.82 |
| Which equipment profiles should intake offer? | The coach's 8 options (EQ-01, minus bands): full commercial gym, basic gym, home gym (rack + barbell + DBs), home DBs + bench, kettlebells only, bodyweight only, hotel gym, field/track/outdoor kit. Two derived profiles (full gym + every performance add-on; field/track with nothing carried) come from the add-on answers. No bands anywhere. | COACH-ANSWER EQ-01, EQ-02; section 3 |
| What breaks without equipment? | Bodyweight only: vertical pull and biceps have no option (pattern gap), throws, leg extension and the FBS chops are substitute-only, lateral raise has only a household-load stand-in, horizontal pull needs a sturdy table. Without bands, home vertical pull needs a pull-up bar and the FBS chops need a cable. The coach's ideal home kit (adjustable DBs + bench + pull-up bar + 8-10 lb medball, EQ-02) plus a box covers every main slot as written except leg extension (DB leg extension on a box) and the cable chops. | gap matrix section 3.3; COACH-ANSWER EQ-02 |
| Session order? | Warm-up → **core (first by default, movable)** → plyo → throws → COD → triple extension/Olympic → bilateral lower + HORIZONTAL upper (hip-dominant with push, knee-dominant with pull) → unilateral lower + VERTICAL upper → isolation (calves 3 sets each leg day, rear delts own sets) → conditioning. The main lift goes first whatever its direction. Implements get heavier and more constrained, and the movement slower, as the session goes on. | COACH-ANSWER ATH-11, ORD-01..06, ORD-08, UNI-11, VOL-17; OBSERVED BYOP athletic skeleton |
| Load for speed work? | Medball 8-10 lb for passes and rotations (overhead 6-10, sit-up 6-8, slams 10-20, never over 20 lb). Loaded jumps 10-20% of body weight, too heavy when height or speed drops. Olympic lifts '@ 75%' → '@ 90%'. Dynamic effort 'FAST RPE6 or about 60-70%' with straight weight - no bands or chains. Heavy strength at 1 RIR. | COACH-ANSWER EQ-06, EQ-12, EQ-15, PER-09; section 5 |
| Machine preferences? | No ranking (EQ-11: 'I don't want to rank them because they have different brands, angles'). Constraint differs: leg press 5; hack squat and pendulum back-supported 4; Smith 4 and least constrained. Belt squat when the spine should not be loaded. GHD/reverse hyper only if available and felt in the right muscles. Client preference can decide (EQ-10). V-squat never (GEN-08). | COACH-ANSWER EQ-10, EQ-11, GEN-08; section 6 |

## 1. Equipment taxonomy

### 1.1 Implement groups

| Group | What it is (and how the coach uses it) |
|---|---|
| MACHINE_GUIDED | Fixed path plus seat/pads: the most reference points ("you sit down, feet on the ground, move your hands or feet", COACH-CHAT). The machine does the stabilising work (COACH-ANSWER CAT-04). Constraint 4-5. |
| CABLE | Free line of pull, constant tension; the cable takes part of the stabilising work (COACH-ANSWER CAT-04). Constraint 3 (standing) to 4 (seated/supported). |
| FREE_BAR | Barbell family: one rigid bar, fixed grip, highest load ceiling, most skill ("Barbells are more skilled", COACH-CHAT). The only implement that loads zone 3 BEHIND the body (back squat, good morning). Constraint 2. |
| FREE_HANDHELD | Dumbbells, kettlebells, plates, sandbag: split grip, unilateral/offset loading; one implement is enough for contra/ipsilateral work. Reach zones 1-3 but not behind the body. Constraint 2-3. |
| BALLISTIC_IMPLEMENT | Medicine ball, slam ball: released at speed. Constraint 1 (standing) to 3 (sit-up throws). |
| BODYWEIGHT_APPARATUS | Pull-up/dip bars, TRX/rings, stability ball, sliders: let bodyweight carry a pattern. |
| REFERENCE_PROPS | Boxes, benches, steps, walls, and plates/hurdles/cones used as targets: they set depth, ROM, height or a target, not load. |
| FIELD_SPACE | Open space (10-20 m, 40-60 m+), track, turf. |
| CARDIO_MACHINES | Bike, rower, ski erg, treadmill. |

**Out of scope in v1:** bands, chains and weight releasers (the v0 group ELASTIC_ACCOMMODATING). OUT OF SCOPE in v1 - never prescribed, never offered as a substitute, not asked at intake. COACH-ANSWER EQ-01: "The only exception is I don't do bands. I don't program anything with bands. That is something that will eventually come up about variable resistance, but I don't really want to talk about variable resistance in any of this right now because it's so complicated." EQ-12: "We don't want any variable resistance right now. No variable resistance should be available in this for now. We will work with that later on." The v0 records are kept in `out_of_scope_implements.v0_records` for the later variable-resistance work.

### 1.2 Implements: constraint, skill, stability, zones, role

Library statistics are over the primary entries of MASTER EXERCISE LIBRARY (resistance columns S-BE: 283 entries; athletic/core columns B-T: 152 dropdown rows). Skill and stability tags are INFERRED per exercise in the decode files.

| Implement | Group | Constraint | Skill | Stability demand | Load-position zones reachable | Velocity role / main role | Key coach evidence |
|---|---|---|---|---|---|---|---|
| `machine_selectorized` | MACHINE_GUIDED | 4-5 | low (0% of 46 machine entries rated high skill) | low (external) | machine sets the position (pulldown zone 3, row/chest press zone 2); stabilisation is provided, so the zone costs less | controlled; can carry FAST intent (see machine_plate_loaded) | COACH-CHAT: machines "have a lot of reference points / constraints ... You can push a lot, and it's safer"; "For people who want to go up in volume, people with injuries, or older people, more machines are usually better" |
| `machine_plate_loaded` | MACHINE_GUIDED | 4 (hack) - 5 (leg press, seated on a back pad) | low | low | n/a (load through the feet, trunk supported) | controlled by default; the coach also writes 'LEG PRESS' with 'FAST RPE6 or about 60-70%' (MM (NOT DONE) 4 TRACKS PROGRAMMING!O17) | OBSERVED ALL ABOUT SQUATS!G35:I35 LEG PRESS 'LOVE IT': 'Pro: You can focus on mechanical fatigue, local fatigue of the quads/legs and not have so much systemic fatigue failure' |
| `machine_specialty` | MACHINE_GUIDED | 4 | low | low |  | VOLUME_TOOL | OBSERVED ALL ABOUT SQUATS!G41:I41 PENDULUM 'LOVE IT': 'This machines is my FAVORITE leg/squat/kne domminant machine I have ever tried. As of now, that is my opinion on these' |
| `belt_squat` | MACHINE_GUIDED | 4 | low | low | 1 (load hangs from a hip belt, below the trunk) | VOLUME_TOOL | COACH-ANSWER EQ-11: 'Belt squats are for people that you don't need to load them axially, so it won't be a load on their back ... If you have an athlete that already has been loaded on their back that week or a couple of weeks and they're sore, then you might want to switch over to the belt squat' |
| `smith` | MACHINE_GUIDED | 4 | low | low |  |  | COACH-ANSWER EQ-11: 'If a Smith machine feels good, that's great ... Less constraint would be a Smith machine' (than hack squat and leg press) |
| `hip_back_apparatus` | MACHINE_GUIDED | 4 | low-moderate |  |  |  | OBSERVED MM BASEBALL!CY34 '45 degree hyper-extension machine' is one of only 5 machine items in 949 athlete items |
| `cable` | CABLE | 3 (standing) - 4 (seated pulldown, leaning raise) | low (0% high) | low-moderate | all three (the pulley height sets the zone): the coach writes it into the name, 'Cable Machine Curls (Zone1, Zone 2, Zone 3' (AS12) and Sheet23 'Cable Machine Tricep Extensionw/ Rope (Zone 1 and Zone 3)' (AP6) | controlled; also 'powerful turns' ('Cable rotational oblique twist' MM BASEBALL!W30) | COACH-ANSWER CAT-04: cables make an exercise easier because the cable does part of the stabilising |
| `barbell` | FREE_BAR | 2 | high (45% of barbell-family resistance entries rated high skill) | high (51%) | 1 (deadlift, hang pulls, zercher), 2 (front rack, bench, rows), 3 (overhead) and 3-behind (back squat, good morning, barbell calf raise) - the only implement that loads behind the body | slow when heavy ('HEAVY BARBELL' / 'ECCENTRIC SLOW MORE MUSCLE RECRUITMENTS', ALL ABOUT SQUATS!A44:A45); fast only in Olympic lifts and light 'same speed' / dynamic-effort sets (no bands or chains, EQ-12) | COACH-CHAT "Barbells are more skilled" |
| `hex_bar` | FREE_BAR | 2 | low-moderate | moderate | 1 only (load at the sides) - which is why it is the easiest bar | jumpable: 'Hex bar squat jumps' (MM BASEBALL!S33), 'Hex bar squat to calf raise' C11 | OBSERVED squat loading ladder: 'Hex Bar Squat' = 'EASIEST' (ALL ABOUT SQUATS!A10:A11) |
| `ez_bar` | FREE_BAR | 2 | low |  |  |  | OBSERVED 'Ez bar curls or barbell' x8 (MM 4 TRACKS) |
| `ssb` | FREE_BAR | 2 |  |  | on the back with handles in front; the coach ranks it with the front squat |  | OBSERVED 'Front Squat/ SSB Bar' = 'HARD' (ALL ABOUT SQUATS!E10:E11) |
| `landmine` | FREE_BAR | 3 (arc path) | low-moderate |  | 1-2 (held in front, arc path) |  | OBSERVED 'Landmine Squat' green (RP!A16) |
| `dumbbell` | FREE_HANDHELD | 2-3 | low-moderate (4% high) | moderate (22% high) | 1 (suitcase, goblet, deadlift), 2 (front rack on the shoulder, bench, rows), 3 (overhead); not behind the body | controlled by default; light DBs for loaded jumps ('DB repeat squat jumps' G139, 'DB Squat Jumps' MM BASEBALL!D33) | OBSERVED 19 DB/Barbell twin pairs in the library ('DB Push press'/'Barbell push press' AA11/AA12 ...) |
| `kettlebell` | FREE_HANDHELD | 1 (swing) - 2 | moderate |  | 1 (deadlift, swing start, goblet), 2 (front rack: 'Double front rack kb squat' AI51), 3 (press) | ballistic hinge: 'SPEED SPECIALS' 'Russian kb swing' / 'American kb swing' (RP!A77:A79); 'Fast KB swings' (MM BASEBALL!AI51) | OBSERVED 'db or kb' written as interchangeable (RP!C24, G66; 'Goblet KB/DB Squats' AI11) |
| `weight_plate_sandbag` | FREE_HANDHELD | 2-3 |  |  | 1 (hugged, reach forward) |  | OBSERVED 'Plate reach forward squat' (RP!A10, green) |
| `medball` | BALLISTIC_IMPLEMENT | 1 standing/stepping; 2 half-kneeling or back-to-wall; 3 sit-up throws | low | low | 1 (hug, scoop start), 2 (chest pass), 3 (overhead throw, slam start) | the fastest loaded implement: speed-strength | COACH-CHAT: "Med ball upper body passes/rotations should be light - 8-10 lb" so force is produced with speed |
| `slam_ball` | BALLISTIC_IMPLEMENT | 1 |  |  |  |  | OBSERVED 'Side to side shuffle floor slam (height matters)' (ALL ABOUT BALLISTICS!C80) |
| `pullup_bar_dip_bars` | BODYWEIGHT_APPARATUS | 1 (hanging) - 2 | high for strict/weighted pull-ups |  | 3 (hanging, arms overhead); dips = hands low with the shoulders behind the body (tagged zone 3-behind, ambiguous) |  | OBSERVED vertical-pull ladder 'Lat pull downs' (RP!E61:E67) -> 'Assisted pull up machine' (E68:E70) -> 'Strict pull ups' (E71:E74) -> 'Weighted Pull ups' (E75) |
| `trx_rings` | BODYWEIGHT_APPARATUS | 2-3 |  |  |  |  | OBSERVED 'Incline reverse pushup (rings/trx/barbell/smith machine)' (RP!G64) |
| `stability_ball_slider_foam_roller` | BODYWEIGHT_APPARATUS | 2-4 |  |  |  |  | OBSERVED 'Foam roller or swiss ball wall assisted goblet' (RP!A12, green) |
| `bodyweight` | BODYWEIGHT_APPARATUS | 1 (ballistic, hanging, single-leg) - 3 (floor-supported) |  |  | upper body by hand position: push-ups zone 2, pike/handstand and pull-ups zone 3; lower body unloaded (no zone) |  | OBSERVED 278 of 701 reference-tab exercise cells are bodyweight; 217 (31%) need no equipment at all |
| `box_bench_step` | REFERENCE_PROPS | +1 level when used as a depth/position reference |  |  |  |  | OBSERVED box as a FOUNDATIONAL constraint: 'Box. Zercher squat Touch and Go' AI9, 'Box. Goblet squat Touch and Go' AI10, 'Box Squats' AI13 |
| `hurdles_cones_targets` | REFERENCE_PROPS | 1 |  |  |  |  | OBSERVED 'Bigger plates start at lateral bilateral plate hops' (MASTER EXERCISE LIBRARY!G53 = H16): a bigger implement resets the pattern to a simpler one |
| `open_space` | FIELD_SPACE | 1 |  |  |  |  | OBSERVED COD route names 'FADE', 'SLANT', 'POST/CORNER', 'FLAT', 'DIG/OUT', 'COMEBACK/CURL' (L9:L91) need 10-20 m |
| `cardio_machines` | CARDIO_MACHINES |  |  |  |  |  | OBSERVED 'Any Cardio Equipment' (MM EXAMPLE UPPERLOWER SPLIT!C13, x15 cells) |
| `jump_rope` | CARDIO_MACHINES |  |  |  |  |  | OBSERVED 'DEADLIFTS (1-2RIR) + 3 min Jump Rope' (MM BOXING!L12) |

Generator rules per implement:

- `machine_selectorized`: ON_RAMP for upper-body pulls of beginners; default constraint-4/5 option for older/injured/high-volume clients, for compounds AND isolation (COACH-ANSWER EQ-03: "I'd rather they collect that volume in a safe place with more constraints"; CR-10, CR-12, CR-14, CR-33). Seated machine shoulder press (ADD-EQ05, COACH-ANSWER EQ-05) gives the vertical push a constraint-5 option for older and injured clients. Isolation machines go last in the session; MYO sets only here (CR-23).
- `machine_plate_loaded`: No ranking (COACH-ANSWER EQ-11: 'I don't want to rank them because they have different brands, angles'). Leg press (seated, back pad, constraint 5) and hack squat (back and shoulder pads, fixed path) are the MOST constrained squat machines, more than the Smith machine (EQ-11). Choose by constraint fit, spine loading (CR-29) and what the client feels (EQ-10/EQ-11). Missing machine: swap first (EQ-08), else 'leg press or just add 2 more rounds to front squats' (MM 4 TRACKS!W42:Z42).
- `machine_specialty`: One of the knee-dominant machine options when available (FULL_GYM, FULL_FACILITY); not ranked above the others (EQ-11). Pendulum: back and shoulder pads, arc path (constraint 4).
- `belt_squat`: Second knee-dominant exposure of the week when the first one loaded the spine (CR-29); swap in when the client is sore from back-loaded work (EQ-11). Ask about it at intake (gym add-on); FULL_FACILITY has one.
- `smith`: Constraint 4 but the LEAST constrained squat machine (trunk unsupported, EQ-11); use it when it feels good to the client. Also a bar for inverted rows and a seated constraint-4 shoulder press for older/injured clients when there is no press machine.
- `hip_back_apparatus`: Offer GHD / reverse hyper / back extension only when available; keep them only if the client feels the target muscles (EQ-11). GHD has no level (LIB-08): AN48 and AN93 are one option, level 'any'.
- `cable`: No band stands in for a cable (COACH-ANSWER EQ-01 'I don't program anything with bands'; EQ-07 'Band chops are, to me, worthless'): without a cable use the DB/KB, bodyweight or other non-band substitutes of the slot. Zone is a free variable on a cable: change pulley height between blocks (one small variable).
- `barbell`: Main bilateral lifts for strength, hybrid and athletic goals; remove first under a pain flag (CR-12). Bumper-only lifts (Power Snatch C91, Power Clean & Jerk C93, 'Squat Snatch' C94, 'Squat Clean & Jerk' C96 - LIB-07 names) require barbell_bumpers_platform; without bumpers use hang pulls and hang cleans lowered under control (ATH-10). Never for older, injured or high-volume clients: overhead squat, snatch, low-bar back squat (COACH-ANSWER EQ-03). A heavy barbell squat loads the spine: one axial squat day per week, the other squat day on a leg press or belt squat (COACH-ANSWER PER-04, CR-29); deadlifts load it too (PER-04).
- `hex_bar`: Default loaded-jump and beginner squat/deadlift bar where available; specialty item (absent in BASIC_GYM). Hex-bar jumps are one of the beginner Olympic-lift options (COACH-ANSWER ATH-10); load 10-20% of body weight for jumps (EQ-15).
- `dumbbell`: The single biggest unlock for home clients (see intake add-on ranking). Barbell -> DB load conversion: each DB ~0.40 x barbell load for the first exposure (10b EQ-6). Default implement for a name with none (lunges, deadlifts, rows, calf raises): bodyweight -> DB -> barbell as the client's level rises, limited by the kit (COACH-ANSWER EQ-09, CR-30). DB snatches and cleans are beginner Olympic-lift options (COACH-ANSWER ATH-10).
- `kettlebell`: Home power-strength fallback for the Tripple Extension slot (KB swing / KB squat clean). KB snatches and cleans are beginner Olympic-lift options (COACH-ANSWER ATH-10). Two bells from the floor = the 'Kong row' (LIB-09): a low-stimulus row for shoulder or back pain.
- `weight_plate_sandbag`: A plate laid flat is also a plyo TARGET (plate hops G46:G52), not a load.
- `medball`: Weight by throw type and person: load_velocity.medball_rule (never over 20 lb, EQ-06). No throwing in the main workout for aesthetics / bodybuilding clients - warm-up drills only (ATH-05, CR-34). No medball -> the Throwing slot has 0 as-written options; use the coach's substitutes (plyo push-ups, fast cable rotations, the no-ball 'fake medball slam'; never band chops, EQ-07) and add the ball to the buy list.
- `pullup_bar_dip_bars`: The only route to a true vertical pull at home (no band pulldowns, EQ-01); also unlocks hanging core (O15, O16, O130, O209). Part of the coach's ideal home kit with DBs, a bench and an 8-10 lb medball (COACH-ANSWER EQ-02). Regressions without bands: negatives / flexed-arm hang, foot-assisted pull-ups (feet on a box), assisted pull-up machine in a gym.
- `trx_rings`: Cheapest single item that fills horizontal pull, vertical pull and biceps for travel/home clients.
- `stability_ball_slider_foam_roller`: Instability is a rehab/health-fitness tool, not a strength tool (CSEP [S10]); the coach uses the ball/roller as a SUPPORT (wall-assisted goblet, constraint 4) and as the home leg-flexion implement (swiss ball / slider curls).
- `bodyweight`: Default implement for plyos, COD, sprints, core and unilateral knee-dominant work.
- `box_bench_step`: Height is a progression lever changed between blocks, not within (10b VARI-2). Depth-drop heights: low 6-12 in, medium 12-18 in, high above the hip (EQ-16). 'Single Leg Get Ups' AL14 is a box pistol: sit on a box and stand on one leg (LIB-09).
- `hurdles_cones_targets`: Hurdles are the only plyo implement lost in a commercial gym (6 items); cones/lines are the stand-in. Hurdle height: ~6 in moderate, 12 in+ advanced (EQ-16).
- `cardio_machines`: Treat every cardio item as modality-free: run, bike, rower, ski erg or treadmill (EQ-14); bike (constraint 5) for older/injured. Track by distance, calories or time - choose one unit per block and keep it so week-to-week changes are visible (EQ-14).

Mean constraint by implement class in the library (canonical 1-5 scale; the class names are the decode's, so "cable/band" means the library item can be done with either - v1 uses the cable):

| Implement class | Mean constraint |
|---|---|
| cardio_machine(bike/row/ski/treadmill) (athletic/core library) | 5 |
| machine | 4.43 |
| cable | 3.17 |
| other free weight | 3 |
| cable (athletic/core library) | 3 |
| cable/band | 2.53 |
| DB/KB | 2.32 |
| bodyweight (loaded) | 2.2 |
| barbell-family | 2.2 |
| bodyweight | 2.11 |
| suspension | 2 |
| hex_bar (athletic/core library) | 2 |
| barbell (athletic/core library) | 2 |
| pullup_bar (athletic/core library) | 2 |
| dumbbell (athletic/core library) | 1.5 |
| medball (athletic/core library) | 1.45 |
| bodyweight (athletic/core library) | 1.2 |
| box/bench/step (athletic/core library) | 1.07 |
| track/field (athletic/core library) | 1 |
| hurdles/plates/cones (athletic/core library) | 1 |

**Reading.** The coach's chat ranks implements from most to least reference points: machines → cables → DB/KB/medball → barbell ("barbells are more skilled"). The library confirms it. Machines average 4.43 with 0% high-skill entries. Cables average 3.17 with 0% high skill. DB/KB average 2.32 with 4% high skill. The barbell family averages 2.20, and 45% of its entries are high skill and 51% high stability demand. The barbell is also the only implement that can load zone 3 **behind** the body (back squat, good morning, barbell calf raise). That is one reason it sits at the advanced end of every ladder.

### 1.3 The constraint continuum (1-5)

External constraint = how many reference points and how much external guidance the set-up gives (COACH-CHAT: "Machines have a lot of reference points / constraints: you sit down, feet on the ground, move your hands or feet"). It is Pat Davidson's 'ground' (high ground = many contacts/supports; low ground = few). SCIENCE: constraints/references [S26], high vs low ground [S27][S31]. It is ONE of the three inputs of the coach's level rule (CAT-04: skill + stability + load position); see level_model.

**COACH-ANSWER EQ-13: the 1-5 scale (5 = seated machine with back pad, 4 = plate-loaded / Smith / chest-supported, 3 = cable or DB on a bench, 2 = standing free weights, 1 = bodyweight, ballistic, reactive) - RIGHT. EQ-11 adds an order inside level 4: back-supported machines (hack squat, pendulum) give more constraint than the Smith machine, whose bar leaves the trunk free.**

| Level | Definition | Davidson 'ground' | Examples from the coach's library | Who it suits |
|---|---|---|---|---|
| 5 | Seated or lying, pad-supported, fixed path | highest ground | 'Leg press' AI98; 'Leg Extensions' AM9; 'Seated leg curls' AR9; 'Lying Leg Curls' AR10; 'Machine Calf Raises' AU13; 'Machine Row Close Grip' X9; 'Machine bench press' AD14; '10 cals'..'50 cals' on a bike B133:B141 | frail/older, pain, high-volume finishers, MYO/near-failure sets |
| 4 | Plate-loaded or fixed-path machine; seated or leaning cable; chest-supported free weight; wall/ball-supported squat | high ground | 'Pendulum Squat' AI99; 'Hack Squats' AI97; 'Lat Pulldown Wide Grip' U9; 'Assisted Pull-Up Machine Pronated Grip' U17; 'Seal DB Rows Supinated Grip' X52; 'Squats with Foam Roller or Yoga Ball on the wall' AI14; 'GHD' AN48; 'Hyper extensions ' AN55 | beginners learning a pull (ON_RAMP), volume clients (VOLUME_TOOL), older/injured |
| 3 | Standing cable; free weight supported by a bench or the floor; box/wall used as a depth reference; floor core | medium-high ground | 'Cable Standing Chest Press' AD9; 'DB Bench Press' AD94; 'DB Press on floor' AD10; 'Box Squats' AI13; 'Box. Goblet squat Touch and Go' AI10; 'Glute Bridges' AN9; 'Incline Push-ups' AD12; 'Plank' O10 | beginners, hypertrophy accessories, pain regressions |
| 2 | Free weight or bodyweight, standing or closed-chain, no external support | medium ground | 'Front Squats' AI46; 'Barbell Deadlifts' AN92; 'Standing DB Press' AA50; 'Push Ups' AD47; 'Bodyweight Squats' AI12; 'Goblet KB/DB Squats' AI11; all UNILATERAL KNEE DOMINANT lunges AL9:AL21 (mean 1.92); hang pulls C12:C15 and Olympic lifts C91:C96 | strength main lifts, athletes, intermediate+ gen pop |
| 1 | Open space: hanging, inverted, single-leg free, ballistic/reactive, unstable | low ground | strict/weighted pull-ups U46:U52; 'Handstand Push ups' AA52; 'Pistol Squats' AL13; 'Sissy Squats' AI100; 'DB Push press' AA11; 'KB swing' AN20; thrusters AA54/AA55, AI102:AI104; all plyos G9:G141 | athletes (athletic slots and main lifts), advanced bodyweight skill |

- GRD-1 constraint_level is the primary equipment axis; every slot gets a target band from client_rules; options outside the band are penalised, not banned (10b EQ-1).
- GRD-2 remove ONE reference per block, never more: support (seated -> kneeling -> standing), base (bilateral -> split -> single-leg), implement (machine -> cable -> DB -> barbell), path (fixed -> free), tempo (controlled -> fast), load position (zone 1 -> 2 -> 3) (10b GRD-2; OBSERVED RP!E8:E15 colour ladder; COACH-ANSWER CAT-04).
- GRD-3 direction by goal: hypertrophy holds or raises constraint on the sets that carry volume; athletic lowers it on main and athletic slots until everything except finishers is C1-2; pain raises it (+1 to +2) on the affected region.
- GRD-4 (EQ-11) inside constraint 4, a back-supported machine (hack squat, pendulum) is more constrained than the Smith machine; leg press (seated, back pad) is 5. This orders machines by constraint, never by preference (no machine ranking).
- Machine roles: ON_RAMP for upper-body pulls (library FOUNDATIONAL), VOLUME_TOOL for leg machines (library MODERATE/ADVANCED, operative FOUNDATIONAL per CAT-04), ISOLATION (AM9, AR9/AR10, AU13). OBSERVED Sheet23: upper machines only in T9:T11 (header T1 'FOUNDATIONAL - RP - BS - VERTICAL PULL') and AA2:AA4 (header AA1 'RP - BS - HORIZONTAL PULL', no level written), 'Hack Squat Machine' AD8, 'Leg Press' AD9/AE9, 'Pendulum Squat' AE10 only in INTERMIDIATE/ADVANCED columns.

Distribution: C1 100 / C2 33 / C3 10 / C4 0 / C5 9 of 152 dropdown rows; the only C5 rows are calorie cardio (lib_athletic_core_notes section 3); resistance: mean 2.66 over 283 entries; 19% at C>=4; 10% at C1 (lib_resistance_notes section 2). FOUNDATIONAL mean 2.98 (34% machine or cable, 6% high skill) -> ADVANCED 2.21 (10% machine or cable, 34% high skill, 39% barbell); upper body removes constraint with level (VERTICAL PULL 3.5 -> 1.0), lower body files machines higher (BILATERAL KNEE DOMINANT ADVANCED holds Hack/Leg press/Pendulum).

Other scales used in the decode files map onto this one as follows. **BYOP program rubric (prog_byop_equipment: 1 + path + support + reference):** Spearman 0.88 with the canonical scale over 413 shared cells (318 identical, 91 one step apart); differences of two steps only on the banded/reverse-banded box squats AI92, AI93, AI95, AI96 (BYOP 4, canonical 2). **MASTER MODEL program scale (prog_mm_equipment):** measured on 410 name-matched items: MM 1 -> canonical 1.27; MM 2 -> 1.95; MM 3 -> 2.19; MM 4 -> 3.19; MM 5 -> 5.0 (re-derived 2026-10-08 by exact name match on 431 items: 1.27 / 1.97 / 2.18 / 3.19 / 5.0). MM population means run about 0.25-0.5 above canonical (athletes +0.26, gen pop +0.50).

### 1.4 Level model: Davidson zones (COACH-ANSWER CAT-04/05/06/10)

> Mostly skill and stability demand, AND load POSITIONING. Load in front of you / front-loaded = foundational (goblet squat, front-loaded zercher) - people need to learn to be upright. Load closer to and on your body = intermediate (barbell front squat). Load behind your body = advanced (barbell back squat). Based on Dr. Pat Davidson's 'A Coach's Guide to Optimizing Movement' ZONES: Zone 1 = closer to the body at the bottom (arms low) - easiest; Zone 2 = horizontal (high-pressure, but safer to push and pull) - intermediate; Zone 3 = overhead/vertical - most advanced (more positioning, stability and skill needed). Machines or cables change this: easier, because the machine/cable does the stabilizing work.
>
> Zones come from Dr. Pat Davidson's 'A Coach's Guide to Optimizing Movement' and are ROTATION BIASES: vertical positions (hands down / standing, hands overhead, deep squat) = external-rotation bias; horizontal positions (hands in front, knee at hip height / half squat) = zone 2 = internal-rotation bias, more compressive. 'It doesn't apply to the plyos. The plyos are different.'
>
> Levels add options, they don't remove them. 'The levels are still very theoretical, so we don't need to rely heavily on them.' Client level and exercise level are separate axes.

| Zone | Position | Level | Rotation bias (CAT-10) | Load positions | Where the coach's own ladders already say this (OBSERVED) |
|---|---|---|---|---|---|
| 1 | Zone 1 - low / front / close to the body | FOUNDATIONAL | external (vertical: arms down / standing) - CAT-10 | suitcase / farmer (arms low); goblet; zercher and high zercher; hex bar (load at the sides); landmine (front); medball hug; plate reach (counterbalance); DB/KB/barbell deadlift (bar low, in front); arm work with the upper arm at the side (curls, pushdowns) | ALL ABOUT SQUATS!A10:D11: 'Hex Bar Squat' EASIEST, 'Goblet Squat' EASIER, 'High Zercher Squat' EASY, 'Zercher Squat' MODERATE; ALL ABOUT LUNGES!C21 'LOADING' -> C22:C24 'Contralateral Suitcase', 'Ipsilateral Suitcase', 'Duble suitcase' and C28:C30 '... High zercher' (C25:C27 'on shoulder' are zone 2); RESISTANCE PATTERNS!C27 'LOW/MID LOADING VARIATION': 'Plate reach ', 'Goblet loading', 'Double kb or Db' |
| 2 | Zone 2 - horizontal / racked on the front of the body | INTERMEDIATE | internal (horizontal: hands in front, half squat; compressive) - CAT-10 | front rack (barbell front squat, double KB front rack, DB on the shoulder); horizontal push and pull (bench, push-ups, rows, flies, chest press); arms at shoulder height (skull crushers, spider curls, end of a lateral raise) | ALL ABOUT SQUATS!E10:E11 'Front Squat/ SSB Bar' HARD; RESISTANCE PATTERNS!C23:C26 'Front racked db or kb contralateral/Ipsilateral loading' = HARDER (vs plain 'Contralateral loading ' / 'Ipsilateral loading ' = MODERATE, C19:C22; reading those as suitcase loads is INFERRED); ALL ABOUT LUNGES!C25:C27 'on shoulder' loadings, C32 'Front racked barbell' |
| 3 | Zone 3 - overhead / vertical, or BEHIND the body | ADVANCED | external (vertical: arms overhead / deep squat) - CAT-10 | overhead press, push press, jerk, snatch, thruster, overhead squat, overhead triceps; hanging / pulling from overhead (pull-ups, pulldowns, hanging core); behind the body: back squat (high/low bar), good morning, barbell calf raise; dips (shoulders extended behind the trunk, ambiguous) | ALL ABOUT SQUATS!F10:H11 'High Bar Squat' HARDER, 'Low Bar Squat' HARDEST, 'Overhead Squat' VERY HARD; ALL ABOUT LUNGES!C33 'Back racked barbell'; RESISTANCE PATTERNS!C31:C36 'HIGH LOADING VARIATION': high zercher -> zercher -> front squat racked -> back squat racked -> 'Barbell overhead ' |

**Two readings of the rotation bias (COACH-ANSWER CAT-10; v1 verification).** The column above reads the bias from where the arms hold the load (hands down = external, hands in front = internal, overhead = external). For the hips and knees the coach ties the bias to depth, not to where the load sits: standing and deep squat = external-rotation bias; knee at hip height / half squat = internal-rotation bias, compressive. A lower-body exercise therefore carries both: the load-position zone sets its level (CAT-04) and its depth sets the hip bias (a full-depth front squat is zone 2 by load but external at the hip). `exercise_index[cell].rotation_bias` states both for the 55 lower-body entries; `level_model.rotation_bias_scope` holds the rule. Zones do not apply to plyos.

**Machines and cables shift every zone down.** COACH-ANSWER: machines and cables make any zone easier ('the machine/cable does the stabilizing work'). OBSERVED proof: every machine-guided or assisted vertical pull (zone 3) is FOUNDATIONAL (U9-U18), while the free versions are ADVANCED (U46-U52).

**Where "ZONE" is written in the sheets (OBSERVED):**

- 'Cable Machine Curls (Zone1, Zone 2, Zone 3' (MASTER EXERCISE LIBRARY!AS12; Sheet23!AO5)
- 'Unilateral/Bilateral DB Tricep Extension (Zone 3)' (Sheet23!AP5)
- 'Cable Machine Tricep Extensionw/ Rope (Zone 1 and Zone 3)' (Sheet23!AP6)
- Sheet23!A1 'ZONE' header with rows A2:A9 'ZONE 1' (green B6D7A8), A10:A16 'ZONE 2' (yellow FFF2CC), A17:A28 'ZONE 3' (red F4CCCC)
- MASTER EXERCISE LIBRARY!A3 'ZONE' labels the row-3 level band ('EASY' / 'MODERATE' / 'ADVANCED')
- NOT a Davidson zone (COACH-ANSWER CAT-10/CAT-11): Sheet23!C34:D36 plyo key 'ZONE 1' 'Receive pause/creat' -> 'ZONE 2' 'Receive/create' -> 'ZONE 3 ' 'Repeat receive create' is a plyo METHOD progression the coach has not named yet; zones do not apply to plyos, so v1 tags no plyo with a zone

COACH-ANSWER CAT-04/CAT-10: a zone is a position (and its rotation bias); the level follows from it: low/front = foundational, on the body / horizontal = intermediate, behind the body / overhead = advanced, and machines or cables make any zone easier. The coach adds (CAT-05) that 'the levels are still very theoretical, so we don't need to rely heavily on them': zone and level are ranking inputs, never hard gates (LV-2).

**Testing the rule against the library.** coach_rule_level = position level (zone 1 -> F, zone 2 -> I, zone 3 or behind the body -> A; unloaded -> by skill: low F, moderate I, high A) minus guidance (machine-guided or assisted -2; cable-guided, suspension or supported -1); floor F. The coach's own anchor 'barbell front squat = intermediate' is a high-skill lift he still calls intermediate, so skill is not added on top of the zone. (INFERRED tags (zone, guidance) from exercise names; the rule itself is COACH-ANSWER CAT-04)

| Library level (resistance columns) | zone 1 | zone 2 guided/supported | zone 2 unguided | zone 3 guided/supported | zone 3 unguided | machine (no zone) | unloaded (no zone) | n |
|---|---|---|---|---|---|---|---|---|
| FOUNDATIONAL | 23 | 16 | 1 | 13 | 4 | 3 | 10 | 70 |
| MODERATE / INTERMEDIATE | 8 | 7 | 4 | 1 | 2 | 5 | 1 | 28 |
| ADVANCED | 6 | 5 | 13 | 6 | 20 | 6 | 9 | 65 |

Reading: an unguided zone-3 lift is almost never foundational. The only 4 are the push press and jerks AA11:AA14 (the coach's RP traffic light does not list them, but it colours every standing overhead press red, RP!E13:E15; LIB-13 now sets push press FOUNDATIONAL and push jerk INTERMEDIATE). Of the 34 FOUNDATIONAL zone-2/3 entries, 29 are guided or supported (lat pulldowns, assisted pull-ups, machine rows, seated presses, push-up regressions, cable presses); the rest are the push press/jerks and the misfiled 'KB Face Pulls ' (U20). Zone 1 is the largest group at FOUNDATIONAL (23 of 70), and unguided zone 3 is the largest at ADVANCED (20 of 65).

| Slot (bucket) | Levelled entries | Coach rule = library level | % |
|---|---|---|---|
| RP_UHD | 8 | 8 | 100% |
| FBS_CHOP_ANTIROT | 12 | 12 | 100% |
| RP_VPULL | 19 | 17 | 89% |
| RP_BKD | 32 | 17 | 53% |
| AP_TRIPLE_EXT | 22 | 11 | 50% |
| RP_HPUSH | 21 | 10 | 48% |
| RP_VPUSH | 15 | 7 | 47% |
| RP_BHD | 24 | 9 | 38% |
| RP_HPULL | 14 | 5 | 36% |
| ISO_LEG_FLEXION | 9 | 2 | 22% |

Totals: 98 of 176 exact (56%), 157 within one level (89%). Disagreements by cause:

| Cause | Entries |
|---|---|
| agrees | 98 |
| library_harder: explained by skill/stability (barbell, high skill) | 32 |
| library_harder: other variables (ROM, body angle, support, implement size) | 20 |
| library_harder: machine filed as a volume tool | 12 |
| library_easier: guided/supported or unloaded item | 8 |
| library_easier: zone-3 unguided lift filed low (conflicts with CAT-04) | 6 |

- Position alone reproduces the coach's FBS chop ladder 12/12 ('chop down' FOUNDATIONAL BC9:BC12 -> 'midline' INTERMEDIATE BC13:BC16 -> 'up' ADVANCED BC17:BC20), the vertical pulls 17/19 and the unilateral hinges 8/8.
- Where the library is HARDER than the rule, the reason is almost always one of the other two inputs of CAT-04: barbell skill/stability (barbell deadlift family, bent-over barbell rows, bench press: 32 entries) or the machine filed as a volume tool (12 entries).
- The only hard conflicts (zone-3 unguided lifts filed FOUNDATIONAL/MODERATE) are the 4 push press/jerk entries AA11:AA14 and the 2 back squats AI49:AI50. v1: the coach settled the push press/jerk case himself (LIB-13: push press is easier -> stays FOUNDATIONAL; push jerk intermediate/advanced -> INTERMEDIATE); the back squats stay ADVANCED (his CAT-04 anchor).
- The test covers the whole library as written, including the 13 band / variable-resistance cells and Camporini (AQ16) that v1 removes from every list.

**Operative-level overrides (where the coach's answer is explicit; the generator uses `lvl`, the library level is kept as `lvl_library`):**

| Cell | Exercise | Library | Operative | Basis |
|---|---|---|---|---|
| AA13 | DB Push Jerk | F | I | COACH-ANSWER LIB-13: 'push jerk is more technical but its more intermediate/advance' (eligible from intermediate; levels add options, CAT-05) |
| AA14 | Barbell Push Jerk | F | I | COACH-ANSWER LIB-13: push jerk = intermediate/advanced |
| AD50 | Machine flies | I | F | COACH-ANSWER CAT-04: 'Machines or cables change this: easier, because the machine/cable does the stabilizing work' (library files it higher as a volume tool; CAT-05 levels add options) |
| AI47 | High Zercher DB Squats | I | F | COACH-ANSWER CAT-04 anchor: 'front-loaded zercher' = foundational |
| AI48 | High Zercher Barbell Squats | I | F | COACH-ANSWER CAT-04 anchor: 'front-loaded zercher' = foundational |
| AI49 | High Bar Back Squat | I | A | COACH-ANSWER CAT-04 anchor: 'barbell back squat' (load behind the body) = advanced |
| AI50 | Low Bar Back Squat | I | A | COACH-ANSWER CAT-04 anchor: load behind the body = advanced |
| AI52 | Hack Squat Machine | I | F | COACH-ANSWER CAT-04: 'Machines or cables change this: easier, because the machine/cable does the stabilizing work' (library files it higher as a volume tool; CAT-05 levels add options) |
| AI55 | Leg Extension Machine | I | F | COACH-ANSWER CAT-04: 'Machines or cables change this: easier, because the machine/cable does the stabilizing work' (library files it higher as a volume tool; CAT-05 levels add options) |
| AI97 | Hack Squats | A | F | COACH-ANSWER CAT-04: 'Machines or cables change this: easier, because the machine/cable does the stabilizing work' (library files it higher as a volume tool; CAT-05 levels add options) |
| AI98 | Leg press | A | F | COACH-ANSWER CAT-04: 'Machines or cables change this: easier, because the machine/cable does the stabilizing work' (library files it higher as a volume tool; CAT-05 levels add options) |
| AI99 | Pendulum Squat | A | F | COACH-ANSWER CAT-04: 'Machines or cables change this: easier, because the machine/cable does the stabilizing work' (library files it higher as a volume tool; CAT-05 levels add options) |
| AI101 | Leg Extension Machine | A | F | COACH-ANSWER CAT-04: 'Machines or cables change this: easier, because the machine/cable does the stabilizing work' (library files it higher as a volume tool; CAT-05 levels add options) |
| AN48 | GHD | I | any | COACH-ANSWER LIB-08: 'no levels on this' (GHD) |
| AN51 | Hip Thrust Machine | I | F | COACH-ANSWER CAT-04: 'Machines or cables change this: easier, because the machine/cable does the stabilizing work' (library files it higher as a volume tool; CAT-05 levels add options) |
| AN52 | Machine Good Mornings | I | F | COACH-ANSWER CAT-04: 'Machines or cables change this: easier, because the machine/cable does the stabilizing work' (library files it higher as a volume tool; CAT-05 levels add options) |
| AN54 | Machine Leg Curls (Seated and Laying Down) | I | F | COACH-ANSWER CAT-04: 'Machines or cables change this: easier, because the machine/cable does the stabilizing work' (library files it higher as a volume tool; CAT-05 levels add options) |
| AN55 | Hyper extensions | I | F | COACH-ANSWER CAT-04: 'Machines or cables change this: easier, because the machine/cable does the stabilizing work' (library files it higher as a volume tool; CAT-05 levels add options) |
| AN93 | GHD | A | any | COACH-ANSWER LIB-08: 'no levels on this' (GHD) |
| AN100 | Machine Leg Curls | A | F | COACH-ANSWER CAT-04: 'Machines or cables change this: easier, because the machine/cable does the stabilizing work' (library files it higher as a volume tool; CAT-05 levels add options) |

**Other sheet disagreements and coach clarifications:**

- Seal rows X50:X53 are ADVANCED although chest-supported (more reference points = easier; RP!G62 'Chest suported row' sits at the easy end of the row ladder). Kept ADVANCED (needs a seal bench); open question.
- Barbell hinges AN92:AN99 (zone 1, low and in front) are ADVANCED: explained by barbell skill/stability, so no override (CAT-04 counts skill and stability too).
- Hamstring curls on a ball or slider AN17:AN19 are FOUNDATIONAL although unloaded moderate-skill; kept (now in LEG FLEXION).
- 'Toes to bar' O15, 'Knees to chest' O16 and 'Hanging Rotational Knee/Leg Raises' O130 are FOUNDATIONAL core although hanging (zone 3). The coach (CAT-08) calls toes-to-bar a 'more complicated case'; core levels follow the thorax/pelvis/plane rule, not the zone rule. Kept; open question.
- Clean / Power Clean C92/C95 (front-rack catch, zone 2) are ADVANCED: explained by the catch skill; snatch and jerks (zone 3) are ADVANCED as the rule predicts; all hang pulls (zone 1) are FOUNDATIONAL/MODERATE as predicted. v1: ATH-10 adds FOUNDATIONAL Olympic options from his programs (hang cleans without bumpers, DB/KB snatches and cleans, hex-bar jumps) as ADD-ATH10-1..4.
- COACH-ANSWER LIB-15: the leg extension filed '...KNEE DOMINANT - ADVANCED' (AI101) and the 'UNILATERAL' label on the leg curls (AR5) are typos; leg extensions and leg curls are available at every level.
- COACH-ANSWER LIB-08: GHD (AN48 MODERATE / AN93 ADVANCED) has no levels -> operative 'any'.

**Generator policy:**

- LV-1 (CAT-05) Levels ADD options: a client at level L may use every exercise whose operative level <= L. Never remove a foundational option from an advanced client.
- LV-2 (CAT-05) Levels are soft: the operative level is a ranking input and an eligibility ceiling, not the main driver; constraint band, goal and pain rules decide among eligible options.
- LV-3 (CAT-06) Client level (training age, skill) and exercise level are separate axes: an advanced athlete still gets foundational exercises when the slot purpose or a pain flag asks for them.
- LV-4 (CAT-04, LIB-13, LIB-08, EQ-04) Operative level = library level, except the explicit overrides listed (back squats up to ADVANCED; push jerk up to INTERMEDIATE while push press keeps FOUNDATIONAL; front-loaded high zercher down to FOUNDATIONAL; low-skill guided machines down to FOUNDATIONAL so older/injured FOUNDATIONAL clients can use them - EQ-04 RIGHT; GHD no level).
- LV-5 (CAT-04, PER-06, CAT-05) When a slot moves up (end of a block, the exercise felt '8 - That was perfect' or easier and no pain - PER-06), the next option may be one step along the zone ladder - zone 1 (goblet, zercher, hex, suitcase) -> zone 2 (front rack, horizontal) -> zone 3 (back-loaded, overhead) - or one guidance step less (machine -> cable -> free; GRD-2). Optional, never required: the levels are 'still very theoretical' (CAT-05, LV-8).
- LV-6 (INFERRED from CAT-04) The zone also explains the session order the coach states: horizontal (zone 2, "safer to push and pull" heavy) before vertical (zone 3, more positioning and skill).
- LV-7 (CAT-10) Zones do not apply to plyos; plyos progress by method (receive & pause -> receive then create -> repeated receive/create, CAT-10/11), bilateral -> unilateral (unilateral is harder) and height (EQ-16).
- LV-8 (CAT-05/CAT-10) Levels are theoretical: never block a client from an exercise only because of its zone or level when constraint, goal, pain and preference rules say it fits.

### 1.5 Segment changes from the coach's answers

**Leg flexion (CAT-09).** CAT-09: knee flexion (leg curls, nordics, slider curls) is NOT hip dominant; it belongs in a flexion-of-the-leg segment, 'kind of like bicep curls'. OBSERVED MM 'Sheet25'!H11 'LEG FLEXION' with H13 'ham curls', next to B11 'BILATERAL HIP DOMINANT' ('rdl' B12, 'hip thrust' B13), E11 'UNILATERAL KNE DOMINANT' and J11 'BILATERAL KNEE DOMINANT'.

- Bucket: `ISO_LEG_FLEXION (alias of 05_session_architecture ISO_HAM)`. Moved cells: AN15 'Leg Curl Machine', AN17 'Harmstring MedBall Curls', AN18 'Supine Glidder hamstring curls', AN19 'swiss ball hamstring curls', AN50 'Medicine or Stability Ball Harmstring Curls', AN54 'Machine Leg Curls (Seated and Laying Down)', AN91 'Nordic Curl', AN100 'Machine Leg Curls', AN101 'DB Harmstring Curls'.
- Effect: The BYOP 'Leg Curls' slot is wired to AR7:AR10 only (2 machines, 0 home options). With the segment the generator can also offer the 9 AN knee-flexion items: at BODYWEIGHT it has 2 as-written options ('Supine Glidder hamstring curls' AN18, 'Nordic Curl' AN91) instead of 0; at HOME_DB_BENCH 3; at HOTEL_GYM 5. COACH-ANSWER EQ-08 confirms the no-machine swaps: nordics, slider or swiss-ball curls (no bands).
- Sheet disagreement: The library files these 9 items under 'BILATERAL HIP DOMNANT' (AN) and the AR header row 5 reads 'UNILATERAL'; RP_BHD keeps 23 distinct hinge/bridge/thrust options.

**Biomechanics (CAT-03).** CAT-03: biomechanics is the definition of the whole thing; it has no bucket of its own. The 'FUNCTIONAL BIOMECHANICS SYSTEM' column (BC, 17 cable-or-band chops and anti-rotation holds) is treated as a core / anti-rotation accessory bucket (FBS_CHOP_ANTIROT), not as a 'biomechanics' category. v1: 9 remain (cable route; their names are shown without 'or band'); the 8 'Knee banded for adduction' items are out (EQ-01) and their 'Hold object Adducted between knees' twins replace them.

**Core (CAT-08, ATH-11).** CAT-08: trunk on core (thorax moves), pelvis on core (pelvis moves), then both at the same time; each in different planes. Toes to bar and Copenhagen planks are more complicated cases. Equipment matters only for the hanging items (pull-up bar: O15, O16, O130, O209) and the rotations (O92 'Woodchoppers' cable, medball, DB or KB; O93 cable only - the band route is out, EQ-01); 10 of 17 core items need nothing. COACH-ANSWER ATH-11: core goes FIRST in the session by default (warm-up), movable by the client; about 2 core exercises (VOL-17).

**Big vs small muscles (CAT-02, VOL-17).** CAT-02: big = quads, glutes, hamstrings, lats/upper back, chest; small = biceps, triceps, side/rear delts, calves, forearms, abs. Small-muscle slots are DB-first (55% DB/KB, 0% high skill) with cable/machine second; big-muscle compounds use every implement, and big-muscle isolation (leg extension, leg curl) is machine-first. COACH-ANSWER VOL-17: calves get 3 sets every leg day (single-leg on a ramp/plate/deficit or bilateral) and rear delts get their own sets.

## 2. Who gets what: client attributes → constraint, implements, zones

### 2.1 What the coach's programs actually use (OBSERVED, by population)

MASTER MODEL line items, tagged by `prog_mm_equipment` (INFERRED tags on OBSERVED cells). Constraint is converted to the canonical scale with the measured crosswalk. Shares of machine/medball come from the decode tables.

| Population | Items with a constraint tag | Mean constraint (canonical) | Mean constraint (MM scale) | Constraint 4-5 (MM scale) | Fast / ballistic | Medball |
|---|---|---|---|---|---|---|
| gen_pop | 719 | 2.81 | 3.31 | 36% | 2% | 0.0% |
| strength_powerlifting | 402 | 2.56 | 3.14 | 22% | 16% | 0.0% |
| athlete | 945 | 2.0 | 2.26 | 11% | 45% | 13.0% |
| athlete_hybrid | 112 | 1.89 | 2.14 | 0% | 36% | 0.0% |
| boxing | 50 | 2.37 | 2.62 | 24% | 30% | 8.0% |
| crossfit | 69 | 2.04 | 2.39 | 0% | 32% | 0.0% |

Top implements (prog_mm_equipment section 2.1): gen pop DB 33%, barbell 18%, machine 18%, cable 15%. Strength/powerlifting barbell 37%, DB 35%, machine 11%. Athletes DB 29%, bodyweight-ballistic 14.5%, barbell 13%, medball 13%, machine 0.5% (5 of 949 line items; 945 of them carry a constraint tag). Hybrid barbell 41%, DB 28%, machine 0%. Boxing weeks 1-2 are a gym template (14% machines); weeks 3-8 are athletic (56% fast/ballistic).

| BYOP template family | Machine + cable | Free weights | Bodyweight / field / props | Mean constraint (BYOP rubric) | Main slots with a no-equipment option | ... with a home kit |
|---|---|---|---|---|---|---|
| aesthetics | 31% | 46% | 22% | 2.82 | 42/85 | 76/85 |
| athletic | 18% | 40% | 42% | 2.17 | 52/80 | 72/80 |
| bootcamp | 23% | 43% | 31% | 2.56 | 32/58 | 54/58 |
| no_access_hidden | 30% | 38% | 31% | 2.65 | 34/68 | 56/68 |

"If you read the workouts you can understand them by their equipment usage" (COACH-CHAT) is confirmed. Athletic programs are near machine-free and medball-rich, gym/physique programs are about a quarter machine, and CrossFit is barbell-dominant: barbell is the only loaded implement it names (32% of its line items; the rest is cardio, WOD, pull-up bar/wall or unspecified; 96% of implement-word cells in the lib_resistance_notes keyword scan). The no-access row is machine + cable 30% (machine alone 26%). These are OBSERVED program shares; the BYOP "home kit" column was measured on the v0 home tier, which included bands.

### 2.2 Client rules

Each rule is `{id, if, then, evidence, basis}` in `client_rules`. The constraint bands are targets: options outside the band are penalised, not banned (GRD-1). CR-19 is kept only as a retired entry (ATH-09: no sex-based rules); CR-29..CR-36 are new in v1.

| ID | If | Then | Basis |
|---|---|---|---|
| CR-01 | goal=athletic_sport | **athletic_slots**: constraint: [1, 2], implements: ['bodyweight', 'boxes/plates/hurdles', 'medball (8-10 lb passes/rotations, EQ-06)', 'field'], velocity: max intent<br>**main_lifts**: constraint: [1, 2], implements: ['barbell', 'hex_bar', 'dumbbell', 'kettlebell']<br>**olympic**: every client in athletic training gets Olympic-lift work (COACH-ANSWER ATH-10): beginners and early intermediates = hang pulls, hang cleans lowered under control, DB/KB snatches and cleans, hex-bar jumps (no bumpers needed); intermediate+ and pros = the full lifts<br>**plyo_vs_ballistic**: set by the sport's ground-contact time (COACH-ANSWER ATH-01): longer on the ground (fighters, karate) -> more ballistics; shorter (sprinters) -> more plyos; basketball a mix; baseball ballistics + rotational + sprinting, few plyos. Programs start more ballistic and become more plyometric (CAT-10). Dose belongs to 04_athlete_profiles.<br>**machines**: last 1-2 slots only (isolation finisher); <= 5% of line items<br>**targets**: machine_items_pct: <=5 (observed 0.5), medball_items_pct: 10-20 (observed 13 MM athletes; EXAMPLE ATHLETIC 28 of line items / 19 of implement-word cells), fast_or_ballistic_items_pct: 40-50 (observed 45), mean_constraint_canonical: ~2.0 (observed 2.00), share_hard_sets_constraint_ge3: <=15% | OBSERVED + COACH-ANSWER ATH-01/ATH-10; SCIENCE specificity [S1][S10] |
| CR-02 | goal=hypertrophy_aesthetics | **main_lifts**: constraint: [2, 4], note: 1-2 free-weight lead lifts per session<br>**accessories**: constraint: [3, 5]<br>**medball**: none in the main workout; medball drills only in the warm-up (COACH-ANSWER ATH-05)<br>**targets**: machine_plus_cable_items_pct: 30-35 (observed gen pop ~33; BYOP aesthetics pools 31), dumbbell_items_pct: 30-45 (observed 33), fast_items_pct: <=5 (observed 2), medball_items_pct: 0 (observed 0; ATH-05), mean_constraint_canonical: ~2.8 (observed 2.81), share_hard_sets_constraint_ge3: 45-65%<br>**failure**: RIR 0-1 / MYO only on constraint >=4 or isolation, last exercise (VOL-15 RIGHT) | OBSERVED + COACH-ANSWER ATH-05; SCIENCE: machines = free weights for hypertrophy [S1][S3], better SFR [S14] |
| CR-03 | goal=strength | **main_lifts**: constraint: [2, 2], implements: ['barbell'], note: 'the work' (1RIR) first, then 'the accessory' (2RIR), 'the nuance' (MAX), 'the survival' (ALL) (MM CONJUGATE!M13:M16; ORD-07 RIGHT); the main lift goes first whatever its direction (ORD-02)<br>**accessories**: constraint: [2, 5], implements: ['dumbbell', 'machine', 'cable']<br>**dynamic_effort**: FAST days with straight weight: 'FAST RPE6 or about 60-70%' (MM 4 TRACKS!N17). The sheets also write banded/chained versions ('FAST BANDED BENCH PRESS' E21, 'FAST CHAINED DL' CONJUGATE!H22); v1 drops the band/chain and keeps the lift (COACH-ANSWER EQ-12)<br>**targets**: barbell_items_pct: 35-40 (observed 37), dumbbell_items_pct: ~35 (observed 35), machine_items_pct: 10-15 (observed 11), fast_items_pct: 10-20 (observed 16): FAST dynamic-effort days, straight weight | OBSERVED + COACH-ANSWER EQ-12; SCIENCE specificity [S1] |
| CR-04 | goal=power_speed; or=athlete wants to go faster | **rule**: lightest implement that still needs maximal effort; heaviest implement that does NOT slow the movement<br>**implements**: bodyweight / medball 8-10 lb for passes/rotations (coach; see load_velocity.medball_rule) / light DB/hex loaded jumps at 10-20% of body weight (EQ-15) / KB swings / Olympic-lift derivatives (ATH-10)<br>**quality_gate**: if the rep slows, jump height drops or the throw slows: drop load one step (EQ-15: too heavy when jump height or speed clearly drops); stop the set at visible slowing (~20% velocity loss) | COACH-CHAT + OBSERVED + COACH-ANSWER EQ-15; SCIENCE [S35][S38][S39][S43] |
| CR-05 | goal=fat_loss_bootcamp_general | **constraint**: 2 / 3<br>**implements**: dumbbell / bodyweight / kettlebell / machines allowed on muscle-building days<br>**circuits**: bodyweight + light DB stations alternating full-body / lower / core / upper (FAT BURN circuits); bootcamps = timed circuits, 5-7 stations, 3-5 rounds x 30-50 s, 35-45 min (COACH-ANSWER PRG-03)<br>**pairing**: hip-dominant with push, knee-dominant with pull - also in full-body and bootcamp days (COACH-ANSWER ORD-06/UNI-11)<br>**cardio**: running intervals or any cardio equipment (EQ-14); 3 aerobic sessions a week for general and fat-loss clients (ATH-07)<br>**targets**: mean_constraint_BYOP_rubric: ~2.56 (observed bootcamp family), circuit_items: ~70% bodyweight, ~20% DB (observed FAT BURN circuits) | OBSERVED + COACH-ANSWER PRG-03, ORD-06, ATH-07 |
| CR-06 | goal=hybrid_crossfit | **implements**: barbell (dominant) / dumbbell / kettlebell / pull-up bar / wall-ball / medball (the one place a heavier ball is used: up to 20 lb, EQ-06) / cardio ergs<br>**machines**: none (observed 0%)<br>**olympic**: hang/power variants with % (see load_velocity.olympic); power before strength in the session (ORD-03)<br>**high_reps**: 40-rep sets only as a CrossFit / AMRAP-style option, not a default (COACH-ANSWER VOL-11) | OBSERVED (both sheets NOT DONE / planning grids) + COACH-ANSWER EQ-06, ORD-03, VOL-11 |
| CR-07 | sport=boxing / karate / combat striking | **plyo_emphasis**: LOW: more ballistics, fewer plyos (long ground contact, ATH-01); boxing ~ karate near the bottom of the plyo ranking (ATH-02)<br>**medball**: HIGH (ATH-05: boxing, MMA, baseball, tennis, golf)<br>**pressing_when_punching_volume_is_high**: reduce pressing and arm volume step by step but do not cut it out (COACH-ANSWER ATH-04: 'don't completely cut it ... bring the volume down, down, down')<br>**phase_1_weeks_1_2**: gym template: canonical constraint ~2.6-2.8, machines ~14%, fast ~7%<br>**phase_2_weeks_3_8**: athletic template: canonical constraint ~1.95 (MM scale 1.96), machines ~8%, fast/ballistic ~56%, medball lists, weighted depth drops, 'Clean Pull/ hang Power Clean', contrast complexes<br>**equipment_priority**: medball (throws/rotations) / DB/KB / barbell for 1-2 heavy lifts / jump rope | COACH-CHAT + OBSERVED + COACH-ANSWER |
| CR-08 | sport=rotational_or_throwing (baseball, softball, tennis, golf, hockey) | **medball**: HIGH for baseball, tennis and golf (ATH-05): rotational and half-kneeling throws every week (BASEBALL Part A 77 medball lines)<br>**plyos**: baseball: ballistics + rotational work + sprinting, few plyos (ATH-01)<br>**weekly_vectors**: Mon 'horiz pull', Tue 'horiz push', Thu 'vert pull', Fri 'vert push' (MM BASEBALL Part C labels, 20 each)<br>**olympic**: hang cleans/snatches between core and strength, 75% -> 90% (PER-09 RIGHT)<br>**pitchers**: less overhead pressing, more arm care, rotational throws kept light (ATH-08 RIGHT)<br>**loading**: load laterality per CR-32 (tennis = change-of-direction athlete: contralateral); core first (ATH-11) | OBSERVED + COACH-ANSWER |
| CR-09 | sport=basketball / volleyball / jumping court sports | **plyo_emphasis**: HIGHEST (coach: basketball = most plyos; ATH-02 ranking basketball ~ volleyball first) with a mix of plyos and ballistics (ATH-01)<br>**medball**: MODERATE (ATH-05)<br>**equipment_priority**: plyo box or step (low 6-12 in / medium 12-18 in / high above hip, EQ-16) / hurdles (6 in moderate, 12 in+ advanced, EQ-16) or cones / weight plate or low target for plate hops / 20 m+ of space / medball<br>**plyo_volume**: most plyo slots per week of any sport; progress method, height, unilateral (harder) and contact speed, not load (FV-7, CAT-10) | COACH-CHAT + COACH-ANSWER (dose belongs to 03/04; equipment priority INFERRED) |
| CR-09b | sport=MMA / grappling | **plyo_emphasis**: HIGH but below basketball (coach); fighters get more ballistics because they spend longer on the ground (ATH-01)<br>**medball**: HIGH (ATH-05)<br>**equipment_priority**: plyo box/step / medball / DB/KB | COACH-CHAT + COACH-ANSWER |
| CR-09c | sport=field sport with cutting (football, soccer, rugby) | **cod**: route-shaped COD 'FADE', 'SLANT', 'POST/CORNER', 'FLAT', 'Shuffles' -> 'DIG/OUT', 'LEFT TEST' -> 'COMEBACK/CURL', '5-10-5' (L9:L92; turn severity 'EASY TURN' -> 'MOD. TURN' -> 'HARD TURN'); routes are for every athlete, tiered by turn angle (ATH-06 RIGHT)<br>**loading**: contralateral loading on unilateral lifts to pull into the hip (CAT-13, CR-32)<br>**medball**: MODERATE for football (ATH-05)<br>**space_required**: open_space_short (10-20 m) for COD; open_space_long (40-60 m) for top speed/bounding<br>**props**: cones; hurdles for hurdle hops | OBSERVED + COACH-ANSWER (sport mapping INFERRED) |
| CR-10 | age=>=65 or frail/functionally limited | **main_lifts**: constraint: [4, 5]<br>**accessories**: constraint: [4, 5]<br>**share_hard_sets_constraint_ge3**: 70-90%<br>**prefer**: leg press / pendulum / hack squat / belt squat / selectorized chest press/row/pulldown / seated machine shoulder press (EQ-05) / assisted pull-up machine / leg extension / seated leg curl / bike<br>**level_rule**: leg machines are eligible even for a FOUNDATIONAL client (operative level F per CAT-04; COACH-ANSWER EQ-04: safety beats the level label - RIGHT)<br>**load_position**: zone 1 loads (goblet, hex, suitcase); avoid zone 3 free-weight positions (back squat, standing overhead press)<br>**never**: overhead squat, snatch, low-bar back squat, depth jumps (COACH-ANSWER EQ-03; CR-33)<br>**plyos**: few, unless the client asks for them (COACH-ANSWER ATH-09: 'the older population doesn't really need a lot of plyos unless they ask for it')<br>**power**: fast-concentric machine work at 40-60% 1RM (30-60% frail) before any jumps or throws (SCIENCE)<br>**avoid**: depth jumps / hurdle hops / bounding / maximal barbell lifts<br>**athletic_slots**: if present: 'BodyWeight Squat to calf raise', light medball chest pass / squat to chest pass (lighter ball, EQ-06), 'Shuffles', walk-run intervals<br>**no_sex_rules**: age, foundation, goal and injuries drive the rules, never sex (COACH-ANSWER ATH-09) | COACH-CHAT + COACH-ANSWER + SCIENCE (NSCA older-adult position stand [S12]; light-load power [S41]) |
| CR-11 | age=>=60 and high-functioning | **default**: COACH-ANSWER EQ-03 - RIGHT: older clients lean machine/cable for compounds AND isolation ('If they're old ... I'd rather they collect that volume in a safe place with more constraints'); the EQ-04 machines are open to them<br>**block_1**: constraint: [3, 5]<br>**block_2_plus**: main_lifts_constraint: [3, 5], accessories_constraint: [3, 5]<br>**free_weight_option**: PROPOSED - PENDING COACH APPROVAL: from block 2, a high-functioning client with a training foundation (ATH-09: 'age, foundation, goal, and injuries') and no pain may take 1-2 free-weight main lifts at constraint 2-3 if they prefer them (EQ-10); SCIENCE [S12]: high-functioning older adults gain more from free weights. Never the default (open question 12)<br>**share_hard_sets_constraint_ge3**: most hard sets by default (EQ-03); 40-60% only under the PROPOSED free-weight option<br>**never**: the EQ-03 list still applies (overhead squat, snatch, low-bar squat, depth jumps)<br>**plyos**: few, unless the client asks for them (ATH-09) | COACH-ANSWER EQ-03 (default), ATH-09; free-weight option PROPOSED - PENDING COACH APPROVAL (SCIENCE [S12]; EQ-10 preference). v1 verification: the v1 draft put main lifts at [2, 3] by default in block 2+, against EQ-03 |
| CR-12 | pain_flag=any region (intake, or FEELING = 'Felt a PAIN') | **sequence**: 1. move that muscle/pattern to machines or split grips: 'getting away from fixed grips (barbells, bars) and going split grips (dumbbells, kbs, indivitual grips)' (OBSERVED) / machines (COACH-ANSWER VOL-03) / 2. cut that muscle or pattern 30-50% and keep it moving (COACH-ANSWER VOL-03 - RIGHT) / 3. athletes: 'going unilateral' (OBSERVED); when a bilateral lift becomes unilateral, keep the sets if possible but adjust (UNI-08 PARTLY) / 4. raise constraint +1 to +2 on that region's slots (machines/cables do the stabilising, CAT-04) / 5. move the load toward zone 1 (front/low) and restrict to the pain-free range / 6. if it is still too much, drop the exercise altogether (COACH-ANSWER VOL-03: 'maybe even drop the exercise altogether')<br>**never**: the EQ-03 list (overhead squat, snatch, low-bar squat, depth jumps) for injured clients (CR-33)<br>**avoid_in_region**: ballistic/Olympic work<br>**keep**: half-kneeling and seated throws (no lower-limb impact) if the region allows | OBSERVED + COACH-ANSWER VOL-03/UNI-08/EQ-03; SCIENCE [S9][S103] |
| CR-13 | pain_flag=lower limb / impact-sensitive | **avoid**: 'Depth Jumps' G131 (never for injured clients, EQ-03) / 'High Depth Drop (above hip)' G133 / hurdle hops G91:G96, G134 / 'Bounding' G140 / running intervals<br>**prefer**: 'Low Box Jumps (half shin)' G13 (lands on the box) / 'BodyWeight Squat to calf raise' C9 / half-kneeling scoops K21:K24 / bike or any erg for cardio (constraint 5, EQ-14) | INFERRED from OBSERVED library + COACH-ANSWER |
| CR-14 | goal_modifier=wants more volume / high-volume block | **where_volume_goes**: added sets go to the exercises already in the session, in session order: the first exercise first, then the next (2/2/2 -> 3/2/2 -> 3/3/2 -> 3/3/3 -> 4/3/3); small muscles trained last get extra volume as a bonus exercise (COACH-ANSWER VOL-07; the set maths belong to 03_volume_dosing)<br>**equipment**: those exercises lean machine/cable (constraint >=4) for compounds AND isolation: 'I'd rather they collect that volume in a safe place with more constraints' (COACH-ANSWER EQ-03)<br>**how**: keep load the same; add sets (VOL-04: % of weekly sets)<br>**intensity_technique**: MYO on the last machine/isolation exercise only (VOL-15 RIGHT)<br>**never**: the EQ-03 list (CR-33) | COACH-CHAT + OBSERVED + COACH-ANSWER; SCIENCE SFR [S14][S24] |
| CR-15 | training_level=beginner (L1) | **who**: under ~6-12 months of consistent training, or back after more than 6-12 months off (the body is treated as a beginner; skills come back fast); ex-pros only briefly (COACH-ANSWER PRG-05)<br>**eligible_levels**: F<br>**load_position**: zone 1 first (goblet, zercher, hex, suitcase, landmine)<br>**upper_pulls**: ON_RAMP: lat pulldown U9-U14 / assisted pull-up machine U16-U18 / machine row X9-X11 (FOUNDATIONAL); at home: pull-up negatives, flexed-arm hang or foot-assisted pull-ups on a doorway bar; with no bar: DB pullover + extra row sets and a buy-list flag (no bands, EQ-01)<br>**lower_body**: box/goblet/hex/landmine (AI9, AI10, AI11, AI13, AI16, AI17) and, per CAT-04/EQ-04, the leg machines (operative F)<br>**triple_extension**: athletic programs: Olympic-lift work from day one (COACH-ANSWER ATH-10) - hang pulls C12:C15, hang cleans lowered under control, DB/KB snatches and cleans, hex-bar jumps (ADD-ATH10-1..4), plus 'BodyWeight Squat to calf raise' C9, 'Lunge to high knee reach' C10 and the ankle track C126:C136<br>**plyos**: FOUNDATIONAL block G9:G15 ('Low Depth Drop', 'Medium Depth Drop', 'Push up Stick the Landing' (hands start on a box, land on the floor, LIB-02), 'Low Box Jumps (half shin)', 'Mid Box Jump (up to knee)', 'Ankle Hops '); start more ballistic and with receive-and-pause landings (CAT-10)<br>**vertical_push**: seated presses first (RP!E8:E9 green; 'Incline Seated DB Press' AA9; seated machine press ADD-EQ05); push press AA11/AA12 is FOUNDATIONAL ('push press is easier', LIB-13), push jerk AA13/AA14 INTERMEDIATE<br>**default_implement**: bodyweight or DB when a name gives no implement (EQ-09, CR-30) | COACH-ANSWER + OBSERVED; SCIENCE: training status does not moderate machine vs free weight [S1]; switching machine->free at a block boundary costs nothing [S5] |
| CR-16 | training_level=intermediate (L2) | **who**: more than about a year of consistent training (COACH-ANSWER PRG-05)<br>**eligible_levels**: F / I<br>**load_position**: zone 2 added (front rack, horizontal barbell/DB work)<br>**progression**: remove one reference per block (GRD-2): machine -> cable -> DB -> barbell; seated -> kneeling -> standing; bilateral -> split -> single-leg; zone 1 -> zone 2<br>**athletic**: MODERATE plyo block (plate/hurdle hops; one from each MODERATE column, LIB-05), the MODERATE hang-pull block C49:C54 (repeats the high/mid-hang pulls C49:C52 and adds the low-hang pulls C53:C54), push jerk (LIB-13); full Olympic lifts from 'intermediate plus' (ATH-10)<br>**default_implement**: DB/KB (EQ-09, CR-30) | COACH-ANSWER + OBSERVED + INFERRED |
| CR-17 | training_level=advanced (L3) | **who**: PROPOSED - PENDING COACH APPROVAL: several years of consistent training with the skills of the advanced lists (the coach defined novice and intermediate only, PRG-05)<br>**eligible_levels**: F / I / A<br>**load_position**: zone 3 added (back-loaded barbell, overhead, hanging)<br>**upper**: free: weighted/strict pull-ups U46:U52, barbell rows (X ADVANCED 6/9 barbell), standing presses<br>**lower**: free main lift + leg machines as VOLUME_TOOL (no machine ranking, EQ-11)<br>**eligible_methods**: contrast/French contrast stations (intermediate+ athletes, off-season, heavy member 78-85%, ATH-12) / DB plyos G136:G139 / full Olympic lifts C91:C96 ('Squat Snatch', 'Squat Clean', 'Squat Clean & Jerk' per LIB-07) / supersets as a fatigue tool when the client no longer fatigues (ORD-05)<br>**not_eligible**: bands, chains, weight releasers - out of scope for every level (EQ-01/EQ-12)<br>**default_implement**: barbell (EQ-09, CR-30) | COACH-ANSWER + OBSERVED |
| CR-18 | age=<15 (youth) | **medball_lb**: lighter than adults (COACH-ANSWER EQ-06 - RIGHT); 4-6 lb as the starting number (SCIENCE, 10b FV-6)<br>**lists**: mostly the FOUNDATIONAL lists (ATH-09: about right)<br>**olympic**: some Olympic lifts from the floor are allowed when the program calls for them (COACH-ANSWER ATH-09: 'It could be some Olympic lift from the ground according to their program'); technique loads, no maximal lifts (INFERRED)<br>**plyos**: FOUNDATIONAL/MODERATE bodyweight<br>**load_position**: zone 1-2 mostly | COACH-ANSWER + SCIENCE (10b FV-6) + INFERRED |
| CR-19 | status=RETIRED in v1 | **was**: sex_or_size = female athlete or bodyweight < 60 kg -> medball base minus 2 lb (SCIENCE [S48])<br>**why**: COACH-ANSWER ATH-09: 'I don't go by sex on these things, but mainly by age, foundation, goal, and injuries.' Medball weight now follows throw type, age (youth/older lighter, EQ-06) and the quality gate (drop 2 lb when the throw slows). | COACH-ANSWER |
| CR-20 | equipment_profile=BODYWEIGHT \| KB_ONLY \| HOME_DB_BENCH \| HOTEL_GYM \| FIELD_TRACK_KIT \| FIELD_TRACK_NO_KIT | **keep**: the parent template skeleton; filter options per slot (never drop the slot)<br>**intensifiers**: closer to failure (safe exercises), unilateral variant, 3-4 s eccentric, pause at long length, 1.5 reps, lengthened partials (10b TEMPO-3)<br>**power**: KB swing / DB snatch / DB jumps; without any load the Tripple Extension slot shifts to bodyweight reactive work (flag 'zone_shift' = a change of velocity zone, not of Davidson zone)<br>**no_bands**: bands are never the home resistance (COACH-ANSWER EQ-01/EQ-02): the generator uses DBs/KBs, bodyweight progressions and household loads<br>**flags**: report 'pattern_gap' with the coach's ideal home kit as the buy list: adjustable DBs + bench + pull-up bar + an 8-10 lb medball (COACH-ANSWER EQ-02) | INFERRED from OBSERVED coverage + COACH-ANSWER; SCIENCE [S19] |
| CR-21 | season=in-season athlete | **implements**: unchanged from the off-season block; no new implements or skills<br>**volume**: frozen or reduced; minimal bilateral work, more unilateral (COACH-ANSWER UNI-10)<br>**focus**: speed athletes: sprints; others: strength maintenance or jumps (COACH-ANSWER PER-08)<br>**aerobic**: 2 sessions a week (ATH-07) | OBSERVED (via 10b) + COACH-ANSWER + INFERRED |
| CR-22 | always=True | **machines**: NO RANKING (COACH-ANSWER EQ-11): 'if the hack squat that you have in your gym works and you feel it is good, then that's great. If a Smith machine feels good, that's great ... I don't want to rank them because they have different brands, angles'<br>**constraint_differences**: leg press (seated, back pad) and hack squat (back + shoulder pads) are more constrained than the Smith machine (EQ-11); pendulum like the hack; belt squat takes the load off the spine (EQ-11)<br>**choose_by**: constraint band of the client (CR-02, CR-10, CR-14) / spine loading this week (CR-29: belt squat or leg press when the spine was already loaded or the client is sore) / what the client feels in the target muscles (EQ-11) / the client's preference (EQ-10, CR-31)<br>**hip_machines**: GHD / reverse hyper / back extension: only if available and the client feels the right muscles (EQ-11)<br>**never**: V-squat (OBSERVED ALL ABOUT SQUATS!G39:I39; hard rule list GEN-08 - RIGHT) | COACH-ANSWER |
| CR-23 | always=True | **failure_gate**: RIR 0-1, MYO SETs and drop sets only at constraint >=4 or on isolation, last exercise; barbell compounds RIR 1-3; Olympic/athletic work never near failure; never to failure on heavy compounds (GEN-08 hard rule) | OBSERVED + COACH-ANSWER + SCIENCE [S20][S21] (10b EQ-3) |
| CR-24 | always=True | **within_block**: same exercise and implement in every slot for the block (4-6 weeks); progress sets/reps/load only (COACH-ANSWER PER-02 - RIGHT)<br>**between_blocks**: change ONE or two small variables per slot (implement, grip, stance, load position zone, ROM, end range, tempo), never all at once; <= 1/3 of slots fully replaced (PER-02)<br>**second_exposure_in_week**: the second time a slot comes up in a week it gets a different exercise of the same category (COACH-ANSWER PER-04 - RIGHT), e.g. squat Monday, leg press or belt squat Thursday (CR-29)<br>**ab_weeks**: A/B lead-lift weeks only for clients who want variety (PER-03)<br>**exception**: athletic speed-strength/strength-speed accessory slots may rotate the implement weekly inside the same velocity zone (BASEBALL 'bkd': 'DB Squat Jumps' > 'Hex bar squat jumps' > 'fast high zercher squats' > 'KB Squat cleans' ...) | COACH-CHAT + OBSERVED + COACH-ANSWER; SCIENCE [S81]-[S85] |
| CR-25 | always=True; when=an equipment substitution changes the laterality of a slot | **rule**: count the substitute's sets on its true side of the bilateral/unilateral ledger and flag 'laterality_shift'. Keep the sets if possible but adjust (UNI-08). The bilateral:unilateral ratio itself is adjustable from 90/10 to 10/90 by athlete type and is moved by pain (COACH-ANSWER UNI-02/UNI-03); the ratio engine in 03_volume_dosing decides whether to rebalance<br>**library_flag**: every option carries 'laterality'; substitutes that shift a bilateral slot to unilateral carry 'laterality_shift' | COACH-CHAT + COACH-ANSWER (the ratio itself belongs to 03_volume_dosing) |
| CR-26 | always=True | **eligibility**: client level L may use every option with operative level <= L (levels add options, CAT-05); levels are a soft ceiling, not the main driver (CAT-05: "still very theoretical")<br>**exceptions**: machines (constraint >=4, low skill) are eligible at every client level (CAT-04; EQ-04 RIGHT) | COACH-ANSWER |
| CR-27 | slot=Leg Curls / hamstring isolation | **segment**: ISO_LEG_FLEXION (knee flexion) - not part of the hip-dominant volume (CAT-09)<br>**options**: machine curls (seated preferred: lengthened [S69]) -> DB / swiss ball / slider / medball curls -> Nordic (advanced; eccentric-only or hands-assisted as the regression)<br>**no_machine**: swap to nordics, slider or swiss-ball curls - no bands (COACH-ANSWER EQ-08)<br>**volume**: count as hamstring (knee-flexion) sets, separate from hinge sets | COACH-ANSWER + OBSERVED |
| CR-28 | slot_muscle_size=small muscle (biceps, triceps, side/rear delts, calves, forearms, abs) | **implements**: dumbbell first / cable / machine<br>**skill**: low only<br>**reps**: higher (coach: small muscles = more reps, cannot go heavy; VOL-11)<br>**calves**: 3 sets every leg day, single-leg on a ramp/plate/deficit or bilateral (COACH-ANSWER VOL-17)<br>**rear_delts**: their own sets, not only indirect pulling volume (VOL-17) | COACH-ANSWER + OBSERVED |
| CR-29 | always=True; when=filling the knee- and hip-dominant main slots of a week | **rule**: one axially loaded squat day per week; the other knee-dominant day uses a leg press, belt squat or another non-axial option (COACH-ANSWER PER-04). Deadlifts load the spine too (PER-04), so the generator also keeps heavy barbell hinging to one day a week and fills a second hinge slot with hip thrust, back extension or reverse hyper - PROPOSED - PENDING COACH APPROVAL (open question)<br>**tag**: exercise_index[cell].axial_load = high \| moderate \| supported \| none (INFERRED from the name; lower body only)<br>**sore_or_already_loaded**: swap the squat to the belt squat when the client was loaded on the back that week or is sore (COACH-ANSWER EQ-11)<br>**no_machines**: home clients: the second exposure uses a unilateral or front-loaded light option (split squat, goblet), PROPOSED - PENDING COACH APPROVAL | COACH-ANSWER |
| CR-30 | always=True; when=the exercise name gives no implement (lunges, deadlifts, rows, calf raises, squats) | **ladder**: bodyweight -> DB -> barbell as the client level rises, limited by the kit (COACH-ANSWER EQ-09 - RIGHT)<br>**by_level**: beginner (L1): bodyweight or DB (zone 1: goblet, suitcase), intermediate (L2): DB / KB (front rack allowed), advanced (L3): barbell<br>**override**: client preference (CR-31) and the older/injured/high-volume rule (machines first, CR-33) win over the ladder | COACH-ANSWER |
| CR-31 | always=True; when=a slot has alternatives ('Squats or Leg Press', 'DB or Barbell') or a dropdown | **default**: the generator picks a default by client rules (older/injured -> machine or DB; experienced -> barbell)<br>**preference**: the client may prefer one alternative and that can be completely up to them (COACH-ANSWER EQ-10 PARTLY)<br>**dropdown**: every slot keeps a dropdown of the other options of the same category (COACH-ANSWER GEN-04 - RIGHT)<br>**intake**: optional preference question: machines / free weights / dumbbells / no preference (INFERRED from EQ-10) | COACH-ANSWER |
| CR-32 | always=True; when=a unilateral lift is loaded with one implement (contralateral / ipsilateral) | **contralateral**: load in the hand opposite the front leg: it pulls you INTO the hip - for change-of-direction athletes (football routes, soccer, basketball, tennis) (COACH-ANSWER CAT-13)<br>**ipsilateral**: load on the same side as the front leg: it helps you OUT of the hip - e.g. ipsilateral step-ups for the sprint acceleration phase (CAT-13)<br>**bodybuilders_powerlifters**: contra/ipsilateral work is a health accessory, mostly in the first 2-4 weeks, then bilateral symmetrical work dominates; kept later only if something bothers them (CAT-13)<br>**equipment**: one DB, KB or medball is enough (ALL ABOUT LUNGES!C22:C33 LOADING list) | COACH-ANSWER + OBSERVED |
| CR-33 | client=older OR injured OR in a high-volume block | **equipment**: compounds and isolation both lean machine/cable (constraint >=4): 'If they're old, they're injured, or they have a lot of high volume, I'd rather they collect that volume in a safe place with more constraints' (COACH-ANSWER EQ-03 - RIGHT)<br>**never**: overhead squat / snatch (barbell or DB) / low-bar back squat / depth jumps<br>**eligible**: FOUNDATIONAL clients may use machines the library files MODERATE/ADVANCED (EQ-04) | COACH-ANSWER |
| CR-34 | always=True; when=a session has a Throwing / medball slot | **by_goal**: aesthetics / bodybuilding: no throwing in the main workout; medball only in the warm-up (ATH-05), baseball, boxing, MMA, tennis, golf: high throwing volume (ATH-05), basketball, football: moderate (ATH-05)<br>**weights**: see load_velocity.medball_rule (8-10 lb passes/rotations; never over 20 lb, EQ-06)<br>**no_medball**: plyo push-ups (pressing), fast cable rotations, the no-ball 'fake medball slam'; never band chops (EQ-07) | COACH-ANSWER |
| CR-35 | always=True; when=an aerobic (Blue / Green / Orange) block is scheduled | **modality**: any available erg or running: bike, rower, ski erg, treadmill or outdoors - non-runners are fine (COACH-ANSWER EQ-14)<br>**tracking**: distance, calories or time; keep one unit for the block so changes show week to week; do not throw away distance (EQ-14)<br>**sessions_per_week**: 3 general / fat loss, 2 athletes in season, 4 aesthetics / bodybuilders + long walks after workouts (COACH-ANSWER ATH-07; dose belongs to 03/06) | COACH-ANSWER |
| CR-36 | always=True | **rule**: no bands and no variable resistance (bands, chains, weight releasers, reverse bands) anywhere: not in profiles, substitutes, prescriptions, intake or buy lists<br>**library_cells_removed**: U15, AI92, AI93, AI95, AI96, BC11, BC12, BC15, BC16, BC19, BC20, BC48, BC49 (and AQ16 Camporini, LIB-09)<br>**names_cleaned**: 'cable or band(ed)' names keep only the cable route (display_name)<br>**later**: variable resistance is parked for a later version (EQ-01, EQ-12); the v0 notes are kept in out_of_scope_implements | COACH-ANSWER |

### 2.3 What the rules pick: top options per client family (INFERRED ranking)

`picks_by_client_family[slot][profile][family]` applies the rules to the ordered lists of section 3. Each family has a constraint band (main slots / isolation), level eligibility, penalties (machine for athletes, skill and ballistic for older/beginner, the EQ-03 never-list for older/injured/high-volume) and bonuses (barbell for strength/athlete, zone-1 free weights for beginners, lengthened isolation variants). v1: no bonus or penalty comes from the coach's sheet opinions on machines (EQ-11), and the hypertrophy family gets no throwing slot (ATH-05). v1 verification: the athlete family's Tripple Extension picks are set by rule, not by the constraint score, because the score put 'BodyWeight Squat to calf raise' and 'Lunge to high knee reach' first in every profile, against COACH-ANSWER ATH-10 ('everyone gets Olympic lifts') and CR-01: full gym / basic gym / home barbell = 'Power Clean' C92, hang cleans lowered under control (ADD-ATH10-1), 'Squat Clean' C95; full facility = 'Power Clean', 'Power Snatch' C91, hang cleans; home DB / hotel = DB snatch (ADD-ATH10-2), KB/DB squat cleans (ADD-ATH10-3), staggered-stance DB snatch; KB only = KB squat cleans, single-arm snatch with a KB, fast KB swings; no load (bodyweight, field kits) = bodyweight triple extension plus a pattern_gap note and a DB/KB on the buy list (`client_families.athlete.olympic_rule`). Families: **athlete** = trained athlete / power-speed (main [1, 2], isolation [2, 4], levels F/I/A); **hypertrophy** = hypertrophy / aesthetics / high volume (intermediate) (main [2, 5], isolation [3, 5], levels F/I); **strength** = trained strength client (main [2, 3], isolation [3, 5], levels F/I/A); **beginner** = beginner, healthy (foundational) (main [2, 4], isolation [3, 5], levels F); **older_or_pain** = older (65+), frail or injured / pain flag (foundational); the EQ-03 never-list also applies to high-volume blocks (CR-33) (main [4, 5], isolation [4, 5], levels F); **fat_loss** = fat loss / bootcamp (foundational-intermediate) (main [2, 3], isolation [2, 4], levels F/I).

**FULL_GYM**

| Slot | athlete | hypertrophy | strength | beginner | older_or_pain | fat_loss |
|---|---|---|---|---|---|---|
| AP_PLYO | Low Depth Drop / Medium Depth Drop | Low Depth Drop / Medium Depth Drop | Low Depth Drop / Medium Depth Drop | Low Depth Drop / Medium Depth Drop | DROP or replace per CR-10/CR-13 (nothing in ... | Low Depth Drop / Medium Depth Drop |
| AP_THROW | Chest pass / Overhead throw | not used: no medball throwing in the main ... | Half kneeling Right Facing LEFT LEG UP ... / Alternating Back to wall Rotational Scoops | Half kneeling Right Facing LEFT LEG UP ... / Alternating Back to wall Rotational Scoops | Half kneeling Right Facing LEFT LEG UP ... / Chest pass | Half kneeling Right Facing LEFT LEG UP ... / Alternating Back to wall Rotational Scoops |
| AP_TRIPLE_EXT | Power Clean (lower under control without bumpers) / Hang cleans (high/mid hang, lowered ... (ATH-10) | Hex bar squat to calf raise / High hang clean pull | Hex bar squat to calf raise / High hang clean pull | Hex bar squat to calf raise / High hang clean pull | BodyWeight Squat to calf raise | Hex bar squat to calf raise / High hang clean pull |
| RP_BKD | Low Bar Back Squat / High Bar Back Squat | Landmine Squats / Box. Zercher squat Touch and Go | Low Bar Back Squat / High Bar Back Squat | Landmine Squats / Box. Zercher squat Touch and Go | Leg press / Squats with Foam Roller or Yoga Ball on the wall | Box Squats / Landmine Squats |
| RP_BHD | Barbell Deadlifts / Wide Grip Barbell Deadlift | Cable Pull Through / Sandbag Hip Thrusts | Barbell Deadlifts / Wide Grip Barbell Deadlift | Cable Pull Through / Sandbag Hip Thrusts | Reverse Hyper Extension / Hip Thrust Machine | Cable Pull Through / Glute Bridges |
| RP_UKD | Reverse Lunges / Stationary Lunges | Reverse Lunges / Stationary Lunges | Reverse Lunges / Stationary Lunges | Reverse Lunges / Stationary Lunges | Reverse Lunges / Stationary Lunges | Reverse Lunges / Stationary Lunges |
| RP_UHD | Staggered Stance DL w/ DB / Alternating DB Deadlifts | SL Glute Bridges (foot on the ground) / SL Hip thrusts | SL Glute Bridges (foot on the ground) / SL Hip thrusts | SL Glute Bridges (foot on the ground) / SL Hip thrusts | SL Glute Bridges (foot on the ground) / SL Hip thrusts | SL Glute Bridges (foot on the ground) / SL Hip thrusts |
| RP_HPULL | Bent Over Barbell Rows / Renegade Rows | Machine Row Close Grip / Inverted Rows | Bent Over Barbell Rows / Cable Machine UL Rows | Inverted Rows / TRX Rows | Machine Row Close Grip / Inverted Rows | Inverted Rows / TRX Rows |
| RP_VPULL | Stricted Pull-ups feet in front / Strict Pull ups L Sit | Lat Pulldown Pronated Grip / Lat Pulldowns w/ Cable Rope | Seated Pull ups with Rings or TRX / Weighted Pull ups | Seated Pull ups with Rings or TRX / Lat Pulldown Pronated Grip | Lat Pulldown Pronated Grip / Lat Pulldowns w/ Cable Rope | Seated Pull ups with Rings or TRX / Lat Pulldown Pronated Grip |
| RP_HPUSH | Push ups (Feet on Wall) / Diamond Push ups | Machine bench press / Machine flies | Barbell bench Press / DB Bench Press | Cable Standing Chest Press / Incline Push-ups | Machine bench press / Machine flies | Cable Standing Chest Press / Incline Push-ups |
| RP_VPUSH | Standing DB Press / Kneeling DB Press | Seated Machine Shoulder Press / Incline Seated DB Press | DB Z Press on floor / Barbell Z press on Floor | Incline Seated DB Press / Kneeling Landmine Press | Seated Machine Shoulder Press / Incline Seated DB Press | Incline Seated DB Press / Kneeling Landmine Press |
| ISO_QUAD | Leg Extensions / DB leg extensions on box (sub) | Leg Extensions / DB leg extensions on box (sub) | Leg Extensions / DB leg extensions on box (sub) | Leg Extensions / DB leg extensions on box (sub) | Leg Extensions / DB leg extensions on box (sub) | Leg Extensions / DB leg extensions on box (sub) |
| ISO_LEG_FLEXION | Supine Glidder hamstring curls / Harmstring MedBall Curls | Seated leg curls / Leg Curl Machine | Seated leg curls / Leg Curl Machine | Seated leg curls / Leg Curl Machine | Seated leg curls / Leg Curl Machine | Supine Glidder hamstring curls / Harmstring MedBall Curls |
| ISO_SIDE_REAR_DELT | Inclined Cable Machine Side Raises / Cable machine Leaning Side raises | Machine reverse fliez / Inclined Cable Machine Side Raises | Machine reverse fliez / Inclined Cable Machine Side Raises | Machine reverse fliez / Inclined Cable Machine Side Raises | Machine reverse fliez / Inclined Cable Machine Side Raises | Inclined Cable Machine Side Raises / Cable machine Leaning Side raises |
| ISO_BICEP | Incline Seated Db Curls (Variation, Pinky ... / Spider Curls | Incline Seated Db Curls (Variation, Pinky ... / Spider Curls | Incline Seated Db Curls (Variation, Pinky ... / Spider Curls | Incline Seated Db Curls (Variation, Pinky ... / Spider Curls | Spider Curls / Incline Seated Db Curls (Variation, Pinky ... | Incline Seated Db Curls (Variation, Pinky ... / Spider Curls |
| ISO_TRICEP | Overhead cable tricep extension / Overhead DB Tricep Extension | Overhead cable tricep extension / Straight bar pronated tricep extensions | Overhead cable tricep extension / Straight bar pronated tricep extensions | Overhead cable tricep extension / Straight bar pronated tricep extensions | Overhead cable tricep extension / Straight bar pronated tricep extensions | Overhead cable tricep extension / Overhead DB Tricep Extension |
| ISO_CALF | Standing Calf raises (use deficit) / Standing DB calf Raises (Use Deficit) | Machine Calf Raises / Standing Calf raises (use deficit) | Machine Calf Raises / Standing Calf raises (use deficit) | Machine Calf Raises / Standing Calf raises (use deficit) | Machine Calf Raises / Standing Calf raises (use deficit) | Standing Calf raises (use deficit) / Standing DB calf Raises (Use Deficit) |
| CORE_ANY | Toes to bar / Knees to chest | Plank / Crunches | Plank / Crunches | Plank / Crunches | Plank / Crunches | Plank / Crunches |
| COND_AEROBIC | 2 min Fast - 1 min walk / 3 min Fast - 2 min walk | 10 cals / 15 cals | 2 min Fast - 1 min walk / 3 min Fast - 2 min walk | 2 min Fast - 1 min walk / 3 min Fast - 2 min walk | 10 cals / 15 cals | 2 min Fast - 1 min walk / 3 min Fast - 2 min walk |

**HOME_DB_BENCH**

| Slot | athlete | hypertrophy | strength | beginner | older_or_pain | fat_loss |
|---|---|---|---|---|---|---|
| AP_PLYO | Low Depth Drop / Medium Depth Drop | Low Depth Drop / Medium Depth Drop | Low Depth Drop / Medium Depth Drop | Low Depth Drop / Medium Depth Drop | DROP or replace per CR-10/CR-13 (nothing in ... | Low Depth Drop / Medium Depth Drop |
| AP_THROW | Plyo pushups (push throws) (sub) / FAKE MEDBALL SLAM & RETURN ANY WAY POSSIBLE (sub) | not used: no medball throwing in the main ... | Plyo pushups (push throws) (sub) / FAKE MEDBALL SLAM & RETURN ANY WAY POSSIBLE (sub) | Plyo pushups (push throws) (sub) / FAKE MEDBALL SLAM & RETURN ANY WAY POSSIBLE (sub) | DROP or replace per CR-10/CR-13 (nothing in ... | Plyo pushups (push throws) (sub) / FAKE MEDBALL SLAM & RETURN ANY WAY POSSIBLE (sub) |
| AP_TRIPLE_EXT | Single Arm DB snatch from floor / KB Squat cleans (ATH-10) | KB Squat cleans / Weighted squat to calf raise | KB Squat cleans / Weighted squat to calf raise | KB Squat cleans / BodyWeight Squat to calf raise | BodyWeight Squat to calf raise | KB Squat cleans / Weighted squat to calf raise |
| RP_BKD | DB thrusters / Single arm DB thruster | Box. Zercher squat Touch and Go / Box. Goblet squat Touch and Go | Box. Zercher squat Touch and Go / Box. Any Squat Deload | Box. Zercher squat Touch and Go / Box. Goblet squat Touch and Go | Box Squats / Box. Zercher squat Touch and Go | Box Squats / Box. Zercher squat Touch and Go |
| RP_BHD | Stiff Leg Deadlift / DB Deadlifts | DB Hip Thrusts / DB Deadlifts | Stiff Leg Deadlift / DB Hip Thrusts | Glute Bridges / Elevated Feet on Bench Glute Bridges | Glute Bridges / Elevated Feet on Bench Glute Bridges | Glute Bridges / Elevated Feet on Bench Glute Bridges |
| RP_UKD | Reverse Lunges / Stationary Lunges | Reverse Lunges / Stationary Lunges | Reverse Lunges / Stationary Lunges | Reverse Lunges / Stationary Lunges | Reverse Lunges / Stationary Lunges | Reverse Lunges / Stationary Lunges |
| RP_UHD | Staggered Stance DL w/ DB / Alternating DB Deadlifts | SL Glute Bridges (foot on the ground) / SL Hip thrusts | SL Glute Bridges (foot on the ground) / SL Hip thrusts | SL Glute Bridges (foot on the ground) / SL Hip thrusts | SL Glute Bridges (foot on the ground) / SL Hip thrusts | SL Glute Bridges (foot on the ground) / SL Hip thrusts |
| RP_HPULL | Bent Over Rows Close Grip / Renegade Rows | DB/ Kb Rows / Bent over db or kb row (sub) | Bent Over Rows Close Grip / DB/ Kb Rows | DB/ Kb Rows / Bent over db or kb row (sub) | DB/ Kb Rows / Bent over db or kb row (sub) | DB/ Kb Rows / Bent over db or kb row (sub) |
| RP_VPULL | DB pullover on a bench (sub) | DB pullover on a bench (sub) | DB pullover on a bench (sub) | DB pullover on a bench (sub) | DB pullover on a bench (sub) | DB pullover on a bench (sub) |
| RP_HPUSH | Push ups (Feet on Wall) / Diamond Push ups | Incline Push-ups / DB Press on floor | DB Bench Press / Incline DB Bench Press | Incline Push-ups / DB Press on floor | Incline Push-ups / DB Press on floor | Incline Push-ups / DB Press on floor |
| RP_VPUSH | Standing DB Press / Kneeling DB Press | Incline Seated DB Press / Sesaw Db Press | DB Z Press on floor / Standing DB Press | Incline Seated DB Press / Sesaw Db Press | Incline Seated DB Press / Sesaw Db Press | Incline Seated DB Press / Sesaw Db Press |
| ISO_QUAD | DB leg extensions on box (sub) / Sissy Squats (sub) | DB leg extensions on box (sub) / Sissy Squats (sub) | DB leg extensions on box (sub) / Sissy Squats (sub) | DB leg extensions on box (sub) / Sissy Squats (sub) | DB leg extensions on box (sub) / Sissy Squats (sub) | DB leg extensions on box (sub) / Sissy Squats (sub) |
| ISO_LEG_FLEXION | Supine Glidder hamstring curls / Nordic Curl | Supine Glidder hamstring curls / Glidder hamstring runners (sub) | Supine Glidder hamstring curls / Nordic Curl | Supine Glidder hamstring curls / Glidder hamstring runners (sub) | Supine Glidder hamstring curls / Glidder hamstring runners (sub) | Supine Glidder hamstring curls / Glidder hamstring runners (sub) |
| ISO_SIDE_REAR_DELT | Seated Lateral Raises w/ DB / Seated DB Reverse Flies | Seated Lateral Raises w/ DB / Seated DB Reverse Flies | Seated Lateral Raises w/ DB / Seated DB Reverse Flies | Seated Lateral Raises w/ DB / Seated DB Reverse Flies | Seated Lateral Raises w/ DB / Seated DB Reverse Flies | Seated Lateral Raises w/ DB / Seated DB Reverse Flies |
| ISO_BICEP | Incline Seated Db Curls (Variation, Pinky ... / Spider Curls | Incline Seated Db Curls (Variation, Pinky ... / Spider Curls | Incline Seated Db Curls (Variation, Pinky ... / Spider Curls | Incline Seated Db Curls (Variation, Pinky ... / Spider Curls | Spider Curls / Incline Seated Db Curls (Variation, Pinky ... | Incline Seated Db Curls (Variation, Pinky ... / Spider Curls |
| ISO_TRICEP | Overhead DB Tricep Extension / DB Kickbacks (Uni/Bi) | Tate Press / Floor DB Skullcrushers | Tate Press / Floor DB Skullcrushers | Tate Press / Floor DB Skullcrushers | Tate Press / Floor DB Skullcrushers | Overhead DB Tricep Extension / DB Kickbacks (Uni/Bi) |
| ISO_CALF | Standing Calf raises (use deficit) / Standing DB calf Raises (Use Deficit) | Standing Calf raises (use deficit) / Standing DB calf Raises (Use Deficit) | Standing Calf raises (use deficit) / Standing DB calf Raises (Use Deficit) | Standing Calf raises (use deficit) / Standing DB calf Raises (Use Deficit) | Standing Calf raises (use deficit) / Standing DB calf Raises (Use Deficit) | Standing Calf raises (use deficit) / Standing DB calf Raises (Use Deficit) |
| CORE_ANY | V-ups / Side Plank | Plank / Crunches | Plank / Crunches | Plank / Crunches | Plank / Crunches | Plank / Crunches |
| COND_AEROBIC | 2 min Fast - 1 min walk / 3 min Fast - 2 min walk | 2 min Fast - 1 min walk / 3 min Fast - 2 min walk | 2 min Fast - 1 min walk / 3 min Fast - 2 min walk | 2 min Fast - 1 min walk / 3 min Fast - 2 min walk | 2 min Fast - 1 min walk / 3 min Fast - 2 min walk | 2 min Fast - 1 min walk / 3 min Fast - 2 min walk |

**BODYWEIGHT**

| Slot | athlete | hypertrophy | strength | beginner | older_or_pain | fat_loss |
|---|---|---|---|---|---|---|
| AP_PLYO | Low Depth Drop / Medium Depth Drop | Low Depth Drop / Medium Depth Drop | Low Depth Drop / Medium Depth Drop | Low Depth Drop / Medium Depth Drop | DROP or replace per CR-10/CR-13 (nothing in ... | Low Depth Drop / Medium Depth Drop |
| AP_THROW | Plyo pushups (push throws) (sub) / FAKE MEDBALL SLAM & RETURN ANY WAY POSSIBLE (sub) | not used: no medball throwing in the main ... | Plyo pushups (push throws) (sub) / FAKE MEDBALL SLAM & RETURN ANY WAY POSSIBLE (sub) | Plyo pushups (push throws) (sub) / FAKE MEDBALL SLAM & RETURN ANY WAY POSSIBLE (sub) | DROP or replace per CR-10/CR-13 (nothing in ... | Plyo pushups (push throws) (sub) / FAKE MEDBALL SLAM & RETURN ANY WAY POSSIBLE (sub) |
| AP_TRIPLE_EXT | BodyWeight Squat to calf raise / Lunge to high knee reach (no Olympic option without a load: pattern_gap + DB/KB on the buy list, ATH-10) | BodyWeight Squat to calf raise / Lunge to high knee reach | BodyWeight Squat to calf raise / Lunge to high knee reach | BodyWeight Squat to calf raise / Lunge to high knee reach | BodyWeight Squat to calf raise | BodyWeight Squat to calf raise / Lunge to high knee reach |
| RP_BKD | Sissy Squats / Bodyweight Squats | Box Squats / Bodyweight Squats | Box Squats / Bodyweight Squats | Box Squats / Bodyweight Squats | Box Squats / Bodyweight Squats | Box Squats / Bodyweight Squats |
| RP_BHD | Glute Bridges / Elevated Feet on Bench Glute Bridges | Glute Bridges / Elevated Feet on Bench Glute Bridges | Glute Bridges / Elevated Feet on Bench Glute Bridges | Glute Bridges / Elevated Feet on Bench Glute Bridges | Glute Bridges / Elevated Feet on Bench Glute Bridges | Glute Bridges / Elevated Feet on Bench Glute Bridges |
| RP_UKD | Reverse Lunges / Stationary Lunges | Reverse Lunges / Stationary Lunges | Reverse Lunges / Stationary Lunges | Reverse Lunges / Stationary Lunges | Reverse Lunges / Stationary Lunges | Reverse Lunges / Stationary Lunges |
| RP_UHD | SL Glute Bridges (foot on the ground) / SL Hip thrusts | SL Glute Bridges (foot on the ground) / SL Hip thrusts | SL Glute Bridges (foot on the ground) / SL Hip thrusts | SL Glute Bridges (foot on the ground) / SL Hip thrusts | SL Glute Bridges (foot on the ground) / SL Hip thrusts | SL Glute Bridges (foot on the ground) / SL Hip thrusts |
| RP_HPULL | Inverted row under a sturdy table (sub) / Towel row on a door frame (door closed, towel ... (sub) | Inverted row under a sturdy table (sub) / Towel row on a door frame (door closed, towel ... (sub) | Inverted row under a sturdy table (sub) / Towel row on a door frame (door closed, towel ... (sub) | Inverted row under a sturdy table (sub) / Towel row on a door frame (door closed, towel ... (sub) | Inverted row under a sturdy table (sub) / Towel row on a door frame (door closed, towel ... (sub) | Inverted row under a sturdy table (sub) / Towel row on a door frame (door closed, towel ... (sub) |
| RP_VPULL | GAP: no option with this kit (buy list) | GAP: no option with this kit (buy list) | GAP: no option with this kit (buy list) | GAP: no option with this kit (buy list) | GAP: no option with this kit (buy list) | GAP: no option with this kit (buy list) |
| RP_HPUSH | Push ups (Feet on Wall) / Diamond Push ups | Incline Push-ups / Kneeling Push Ups | Push ups (Feet on Wall) / Diamond Push ups | Incline Push-ups / Kneeling Push Ups | Incline Push-ups / Kneeling Push Ups | Incline Push-ups / Kneeling Push Ups |
| RP_VPUSH | Pike Push Ups / Handstand Push ups | Pike push-up, feet on a bench (progression of ... (sub) | Pike Push Ups / Handstand Push ups | Pike push-up, feet on a bench (progression of ... (sub) | Pike push-up, feet on a bench (progression of ... (sub) | Pike push-up, feet on a bench (progression of ... (sub) |
| ISO_QUAD | Sissy Squats (sub) / Reverse Nordic (kneeling lean-back) (sub) | Sissy Squats (sub) / Reverse Nordic (kneeling lean-back) (sub) | Sissy Squats (sub) / Reverse Nordic (kneeling lean-back) (sub) | Sissy Squats (sub) / Reverse Nordic (kneeling lean-back) (sub) | Sissy Squats (sub) / Reverse Nordic (kneeling lean-back) (sub) | Sissy Squats (sub) / Reverse Nordic (kneeling lean-back) (sub) |
| ISO_LEG_FLEXION | Supine Glidder hamstring curls / Nordic Curl | Supine Glidder hamstring curls / Glidder hamstring runners (sub) | Supine Glidder hamstring curls / Nordic Curl | Supine Glidder hamstring curls / Glidder hamstring runners (sub) | Supine Glidder hamstring curls / Glidder hamstring runners (sub) | Supine Glidder hamstring curls / Glidder hamstring runners (sub) |
| ISO_SIDE_REAR_DELT | Prone floor Y / T raises (sub) / Backpack or water-jug lateral raise (sub) | Prone floor Y / T raises (sub) / Backpack or water-jug lateral raise (sub) | Prone floor Y / T raises (sub) / Backpack or water-jug lateral raise (sub) | Prone floor Y / T raises (sub) / Backpack or water-jug lateral raise (sub) | Prone floor Y / T raises (sub) / Backpack or water-jug lateral raise (sub) | Prone floor Y / T raises (sub) / Backpack or water-jug lateral raise (sub) |
| ISO_BICEP | GAP: no option with this kit (buy list) | GAP: no option with this kit (buy list) | GAP: no option with this kit (buy list) | GAP: no option with this kit (buy list) | GAP: no option with this kit (buy list) | GAP: no option with this kit (buy list) |
| ISO_TRICEP | Diamond Push ups (sub) / Bench dips (hands on a chair/bench) (sub) | Diamond Push ups (sub) / Bench dips (hands on a chair/bench) (sub) | Diamond Push ups (sub) / Bench dips (hands on a chair/bench) (sub) | Diamond Push ups (sub) / Bench dips (hands on a chair/bench) (sub) | Diamond Push ups (sub) / Bench dips (hands on a chair/bench) (sub) | Diamond Push ups (sub) / Bench dips (hands on a chair/bench) (sub) |
| ISO_CALF | Standing Calf raises (use deficit) / Single-leg deficit calf raise on a ... (sub) | Standing Calf raises (use deficit) / Single-leg deficit calf raise on a ... (sub) | Standing Calf raises (use deficit) / Single-leg deficit calf raise on a ... (sub) | Standing Calf raises (use deficit) / Single-leg deficit calf raise on a ... (sub) | Standing Calf raises (use deficit) / Single-leg deficit calf raise on a ... (sub) | Standing Calf raises (use deficit) / Single-leg deficit calf raise on a ... (sub) |
| CORE_ANY | V-ups / Side Plank | Plank / Crunches | Plank / Crunches | Plank / Crunches | Plank / Crunches | Plank / Crunches |
| COND_AEROBIC | 2 min Fast - 1 min walk / 3 min Fast - 2 min walk | 2 min Fast - 1 min walk / 3 min Fast - 2 min walk | 2 min Fast - 1 min walk / 3 min Fast - 2 min walk | 2 min Fast - 1 min walk / 3 min Fast - 2 min walk | 2 min Fast - 1 min walk / 3 min Fast - 2 min walk | 2 min Fast - 1 min walk / 3 min Fast - 2 min walk |

## 3. Equipment access profiles and substitutions

### 3.1 The profiles the intake form should offer

| Intake option | Profile | Kit | Typical client | Ask about (add-ons) | Main slots with NO as-written option |
|---|---|---|---|---|---|
| 1 | `FULL_GYM` (FULL) | Full commercial gym (everything a big-box gym has, incl. specialty machines) | gen-pop, physique, strength, athletes training alone | barbell_bumpers_platform, hurdles, open_space_long, rings, belt_squat, farmer_handles | - |
| 2 | `BASIC_GYM` (BASIC) | Basic commercial gym, no specialty machines/bars | most gym members; apartment/corporate gyms with a cable stack | trx, hex_bar, landmine, plyo_box_high, open_space_long, barbell_bumpers_platform, belt_squat | - |
| 3 | `HOME_BARBELL` (H-BB) | Home/garage gym: barbell + rack + plates + bench + dumbbells (pull-up bar on the rack) | strength/hybrid trainees with a garage set-up | kettlebell, medball, barbell_bumpers_platform, hex_bar, landmine, ez_bar, dip_bars, cable, stability_ball, jump_rope | AP_THROW, ISO_QUAD, FBS_CHOP_ANTIROT |
| 4 | `HOME_DB_BENCH` (H-DB) | Home: dumbbells + adjustable bench (the coach's ideal home kit adds a pull-up bar and an 8-10 lb medball, EQ-02) | home general-fitness / hypertrophy clients | pullup_bar, medball, kettlebell, stability_ball, trx, jump_rope | AP_THROW, RP_VPULL, ISO_QUAD, FBS_CHOP_ANTIROT |
| 5 | `KB_ONLY` (KB) | Kettlebells only (1-2 bells) + household | minimal home kit, travel, fat-loss | pullup_bar, medball, jump_rope | AP_THROW, RP_VPULL, ISO_QUAD, ISO_SIDE_REAR_DELT, ISO_BICEP, ISO_TRICEP, FBS_CHOP_ANTIROT |
| 6 | `BODYWEIGHT` (BW) | Bodyweight only / no access (floor, wall, stairs, chair, towel, outdoor space) | 'no access' clients; travel; outdoor | pullup_bar, medball, jump_rope | AP_THROW, RP_HPULL, RP_VPULL, ISO_QUAD, ISO_SIDE_REAR_DELT, ISO_BICEP, ISO_TRICEP, FBS_CHOP_ANTIROT |
| 7 | `HOTEL_GYM` (HOTEL) | Hotel gym: light-moderate dumbbells, adjustable bench, stability ball, treadmill/bike | travelling clients (short blocks) | cable, cable_attachments, machine_selectorized, smith, trx, open_space_long, jump_rope | AP_THROW, RP_VPULL, ISO_QUAD, FBS_CHOP_ANTIROT |
| 8 | `FIELD_TRACK_KIT` (FIELD) | Field / track / outdoor kit: medballs, slam balls, cones, mini hurdles, boxes, field or track (EQ-01 wording) | group bootcamps, field-sport team sessions, outdoor athletes | kettlebell, dumbbell, trx, sandbag, plyo_box_high, pullup_bar | RP_HPULL, RP_VPULL, ISO_QUAD, ISO_SIDE_REAR_DELT, ISO_BICEP, ISO_TRICEP, FBS_CHOP_ANTIROT |
| derived: FULL_GYM with the add-ons barbell_bumpers_platform, hurdles, open_space_long, rings, belt_squat, farmer_handles answered yes | `FULL_FACILITY` (FAC) | Full gym + every performance add-on (platform/bumpers, turf/runway, hurdles, belt squat, sled) | athletes, teams, hybrid/CrossFit clients training at a facility | - | - |
| derived: FIELD_TRACK_KIT with every kit add-on answered no (no table or door either) | `FIELD_TRACK_NO_KIT` (F-NOKIT) | Field / track with nothing carried (runway, bleacher steps, turf) | sprint/field athletes, outdoor sessions | hurdles, pullup_bar, dip_bars, medball | AP_THROW, RP_HPULL, RP_VPULL, ISO_QUAD, ISO_SIDE_REAR_DELT, ISO_BICEP, ISO_TRICEP, FBS_CHOP_ANTIROT |

Kit tokens are defined in `kit_tokens` (no band, band-anchor or chains token in v1: COACH-ANSWER EQ-01/EQ-12); the full kit list per profile is `access_profiles[p].kit`. Every profile includes household items: floor, wall, step, chair/bench, towel/slider, a couch to anchor feet, and cones made of shoes or bottles. FIELD_TRACK_NO_KIT has no table or door. The profiles map onto the decode teams' tiers (`maps_to_team_profiles`). Cross-check of availability against those tiers: FULL_FACILITY / full_gym agree 267; BASIC_GYM / commercial_basic agree 264; HOME_DB_BENCH / home_db_bench_bands agree 263; BODYWEIGHT / bodyweight_only agree 280; FULL_FACILITY / full_gym theirs_only 13; BASIC_GYM / commercial_basic theirs_only 16; HOME_DB_BENCH / home_db_bench_bands theirs_only 17; BODYWEIGHT / P1_no_gym_bodyweight agree 152; HOME_DB_BENCH / P2_home_db_band agree 151; FULL_FACILITY / P5_performance_facility agree 152; BASIC_GYM / P4_commercial_gym agree 149; BASIC_GYM / P4_commercial_gym theirs_only 3; HOME_DB_BENCH / P2_home_db_band theirs_only 1. v1: every 'theirs_only' cell reaches the exercise only through a band or chain route (removed, EQ-01/EQ-12), except the v0 BASIC_GYM differences: TRX as an add-on ('Seated Pull ups with Rings or TRX' U19, 'TRX Rows' X12, 'TRX Bicep Curls' AS19) and no hex bar or hip-high box (C11, C48, G133).

### 3.2 Intake form

1. **Pick the base profile:** 1 `FULL_GYM`, 2 `BASIC_GYM`, 3 `HOME_BARBELL`, 4 `HOME_DB_BENCH`, 5 `KB_ONLY`, 6 `BODYWEIGHT`, 7 `HOTEL_GYM`, 8 `FIELD_TRACK_KIT`. The coach's eight options (COACH-ANSWER EQ-01 RIGHT, minus bands): full commercial gym, basic gym, home gym (rack + barbell + DBs), home DBs + bench, kettlebells only, bodyweight only, hotel gym, field/track/outdoor kit. FULL_FACILITY and FIELD_TRACK_NO_KIT are reached through add-on answers.
2. **Answer add-on questions.** For home clients, ranked by how many slot qualities they unlock (`intake.step_2_add_ons_ranked_for_home_clients`):

| Add-on | Asked against | New as-written options | Empty slots it fills | Slots improved (incl. substitutes) |
|---|---|---|---|---|
| dumbbell | BODYWEIGHT | 66 | RP_HPULL, ISO_SIDE_REAR_DELT, ISO_BICEP, ISO_TRICEP | RP_HPULL, ISO_SIDE_REAR_DELT, ISO_BICEP, ISO_TRICEP |
| barbell + plate_low_target + rack + weight_plate | BODYWEIGHT | 51 | RP_HPULL, ISO_SIDE_REAR_DELT, ISO_BICEP | RP_HPULL, ISO_SIDE_REAR_DELT, ISO_BICEP, ISO_TRICEP |
| trx | BODYWEIGHT | 4 | RP_HPULL, RP_VPULL, ISO_BICEP | RP_HPULL, RP_VPULL, ISO_BICEP |
| kettlebell | BODYWEIGHT | 18 | RP_HPULL | AP_THROW, RP_HPULL, RP_VPULL, ISO_SIDE_REAR_DELT, ISO_BICEP, ISO_TRICEP |
| pullup_bar | BODYWEIGHT | 11 | RP_VPULL | RP_VPULL, ISO_BICEP |
| medball | BODYWEIGHT | 24 | AP_THROW | AP_THROW |
| hurdles | BODYWEIGHT | 6 | - | - |
| stability_ball | BODYWEIGHT | 3 | - | - |
| dip_bars | BODYWEIGHT | 2 | - | - |
| plyo_box_high | BODYWEIGHT | 1 | - | - |
| jump_rope | BODYWEIGHT | 0 | - | - |
| weight_bench | BODYWEIGHT | 0 | - | - |

3. **Space:** open_space_short (10-20 m)? -> COD; open_space_long (40-60 m / track / safe road)? -> sprints, bounding, outdoor running.
4. **Gym clients:** which specific machines (leg press, pendulum, hack squat, belt squat, leg extension, leg curl (seated / lying), lat pulldown, assisted pull-up, row machine, chest press, shoulder press machine, cable stack, Smith, GHD / 45-degree hyper / reverse hyper). Why: constraint and spine loading differ by machine (EQ-11, PER-04) and the client may prefer one (EQ-10); machines are NOT ranked (EQ-11).
5. **Non-equipment fields that change equipment use:** age; training experience in years (novice under ~6-12 months; intermediate over ~1 year consistent; more than 6-12 months off = beginner body, skills return fast; ex-pros at L1 only briefly - COACH-ANSWER GEN-02, PRG-05); body weight (loaded jumps at 10-20% of body weight, EQ-15; GEN-02); pain or injury areas (and which joints); sport + position + season if competitive; general sport only if recreational (GEN-02); goal (hypertrophy, strength, power/speed, athletic, fat loss, hybrid); equipment preference: machines / free weights / dumbbells / no preference (EQ-10, INFERRED question); max dumbbell pair weight (sets the ceiling for home loading); medball weights owned; box/step heights available.
6. **Removed:** sex (COACH-ANSWER GEN-02: "I need you to take away just sex"; ATH-09: no sex-based rules); bands (EQ-01).

**Rule:** Never infer equipment from a template name (the NO ACCESS tabs are not equipment-filtered); filter options per slot from the intake answers only.

### 3.3 Coverage matrix: as-written options per slot and profile

Number = distinct options doable **as written** (library items plus the coach-approved additions; the 14 excluded cells never count). Suffix: (L) a library level has no option; (t) thin, fewer than 3; S = no as-written option but a same-pattern/partial substitute exists; X = gap (only rule or pattern-gap fallbacks). Leg flexion uses the re-segmented bucket.

| Slot | FAC | FULL | BASIC | H-BB | H-DB | KB | BW | HOTEL | FIELD | F-NOKIT |
|---|---|---|---|---|---|---|---|---|---|---|
| AP_PLYO | 38 | 30 | 29 | 30 | 30 | 26 | 26 | 28 | 33 | 26 |
| AP_THROW | 20 | 20 | 20 | S | S | S | S | S | 20 | S |
| AP_COD | 9 | 9 | 9 | 9 | 9 | 9 | 9 | 9 | 9 | 9 |
| AP_TRIPLE_EXT | 31 | 27 | 25 | 25 | 16 (L) | 16 (L) | 13 (L) | 16 (L) | 13 (L) | 13 (L) |
| CORE_ANY | 17 | 17 | 17 | 16 | 12 | 12 | 10 | 12 | 12 | 10 |
| COND_AEROBIC | 34 | 34 | 34 | 25 | 25 | 25 | 25 | 34 | 25 | 25 |
| RP_BKD | 30 | 29 | 24 | 18 | 13 (L) | 9 | 3 (L) | 14 (L) | 3 (L) | 3 (L) |
| RP_BHD | 23 | 23 | 17 | 12 | 5 | 5 (L) | 2 (L) | 5 | 2 (L) | 2 (L) |
| RP_UKD | 13 | 13 | 13 | 13 | 13 | 13 | 13 | 13 | 13 | 13 |
| RP_UHD | 7 | 7 | 7 | 7 | 5 | 3 | 3 | 5 | 3 | 3 |
| RP_HPULL | 16 | 16 | 15 | 7 | 4 (L) | 2 (L) | S | 4 (L) | S | X |
| RP_VPULL | 18 | 18 | 17 | 7 (L) | S | S | X | S | X | X |
| RP_HPUSH | 25 | 25 | 25 | 18 | 17 | 10 | 10 | 17 | 10 | 10 |
| RP_VPUSH | 20 | 20 | 19 | 18 | 12 | 2 (L) | 2 (L) | 12 | 2 (L) | 2 (L) |
| ISO_QUAD | 1 | 1 | 1 | S | S | S | S | S | S | S |
| ISO_LEG_FLEXION | 11 | 11 | 11 | 3 (L) | 3 (L) | 2 (L) | 2 (L) | 5 | 4 | 2 (L) |
| ISO_SIDE_REAR_DELT | 12 | 12 | 12 | 9 | 8 | S | S | 8 | S | S |
| ISO_BICEP | 14 | 14 | 13 | 10 | 9 | S | X | 9 | X | X |
| ISO_TRICEP | 9 | 9 | 9 | 4 | 4 | S | S | 4 | S | S |
| ISO_CALF | 5 | 5 | 5 | 4 | 3 | 1 (t) | 1 (t) | 3 | 1 (t) | 1 (t) |
| FBS_CHOP_ANTIROT | 9 | 9 | 9 | S | S | S | S | S | S | S |
| FUNCTIONAL_CARRY | S | S | S | S | S | S | S | S | S | X |
| FUNCTIONAL_DRAG | S | S | S | S | X | X | X | X | X | X |
| FOCUS_QUADS | 8 | 8 | 8 | 6 | 4 | 4 | 3 | 4 | 3 | 3 |
| FOCUS_HAMSTRINGS | 8 | 8 | 8 | 5 | 4 | 2 (t) | 1 (t) | 4 | 1 (t) | 1 (t) |
| FOCUS_GLUTES | 2 | 2 | 2 | 2 | 1 (t) | 1 (t) | 1 (t) | 1 (t) | 1 (t) | 1 (t) |
| FOCUS_BACK | 6 | 6 | 6 | 2 (t) | 1 (t) | S | S | 1 (t) | S | X |
| FOCUS_CHEST | 4 | 4 | 4 | 3 | 2 (t) | S | S | 2 (t) | S | S |
| FOCUS_SHOULDERS_TRAPS | 9 | 9 | 9 | 8 | 5 | S | S | 5 | S | S |
| FOCUS_BICEP | 3 | 3 | 3 | 2 (t) | 2 (t) | S | X | 2 (t) | X | X |
| FOCUS_TRICEP | 5 | 5 | 5 | 1 (t) | 1 (t) | S | S | 1 (t) | S | S |
| FOCUS_CALVES | 1 | 1 | 1 | 1 | 1 | S | S | 1 | S | S |
| FOCUS_CORE | 3 | 3 | 3 | 2 (t) | 2 (t) | S | S | 2 (t) | 2 (t) | S |

**Main reading.**

- **A basic commercial gym keeps 91% of the menu** (a full gym 97%). It lacks only specialty items and add-ons (20 options): 'Seated Pull ups with Rings or TRX' U19, 'TRX Rows' X12, 'Kneeling Landmine Press' AA93, 'Landmine Squats' AI16, 'Hex Bar Squats' AI17, 'Flipped Hex Bar Squats' AI18, 'Landmine Hack Squat' AI56, 'Pendulum Squat' AI99, 'Reverse Hyper Extension' AN11, 'Sandbag Hip Thrusts' AN16, 'Hex Bar Deadlifts' AN47, 'GHD' AN48, 'Hip Thrust Machine' AN51, 'Machine Good Mornings' AN52, 'GHD' AN93, 'TRX Bicep Curls' AS19, 'Hex bar squat to calf raise' C11, 'Hex bar squat to calf raise' C48, 'High Depth Drop (above hip)' G133, 'Hex bar squat jumps' ADD-ATH10-4. The derived performance profile adds 13 more over a full gym: 'Power Snatch' C91, 'Power Clean & Jerk' C93, 'Squat Snatch' C94, 'Squat Clean & Jerk' C96, 'Bilateral Forward Hurdle Hops' G91, 'SL Forward Hurdle Hops' G92, 'Bilateral Lateral Hurdle Hops' G93, 'SL Lateral Hurdle Hops' G94, 'Right Angle Bilateral Forward/ Lateral/forward/lateral hurdle hops' G96, 'Max velocity running (top speed)' G128, 'Hurdle Hops' G134, 'Bounding' G140, 'Belt Squat' ADD-EQ11.
- **Home with DBs + bench keeps about half the menu (51%) - and without bands it now has no vertical pull as written** (DB pullover = partial; a doorway pull-up bar is the fix, EQ-02), no throws (no medball), no leg extension (DB leg extension on a box), no FBS chops (they need a cable) and these missing library levels: AP_TRIPLE_EXT A; RP_BKD I; RP_HPULL F; RP_VPULL F/A; ISO_LEG_FLEXION I; FBS_CHOP_ANTIROT F/I/A.
- **Bodyweight only (33%)** has no vertical pull or biceps option (pattern gap) and no throws. Horizontal pull needs a sturdy table. Lateral/front raises have only a household-load stand-in.
- **The coach's ideal home kit** (adjustable DBs + bench + pull-up bar + 8-10 lb medball, EQ-02) plus a box fills every main slot as written except leg extension (same-pattern DB substitute) and the cable chops.
- **Two slots never survive without equipment as written:** 'Leg Extensions' (AM, 1 machine option) and the BYOP 'Leg Curls' wiring (AR, 2 machines). The leg-flexion segment gives a home client slider, ball, Nordic and DB curls; EQ-08 confirms the swaps (no bands).
- **UNILATERAL KNEE DOMINANT is 13/13 everywhere,** because every lunge is written implement-free and loaded through the LOADING list (ALL ABOUT LUNGES!C22:C33; contra/ipsilateral choice per CR-32).

### 3.4 Ordered substitution lists, every slot × every profile

Order = `_meta.ordering_of_lists`. Within each profile: as-written options first (library + coach additions), in default progression order: operative level F → I → A, filing-problem items last within a level, easiest first by the coach's rule, then most constrained first (no machine is promoted or demoted for preference, EQ-11). Then curated substitutes (`substitute=true`) with a flag: same_pattern, partial, zone_shift, rule or pattern_gap (zone_shift = the substitute trains a different VELOCITY zone, e.g. broad jumps for a loaded clean; it is not a Davidson position zone and not a plyo method stage - `_meta.substitute_flag_definitions`); a substitute that repeats an option already in the list is dropped; no substitute needs a band. A misfiled library item that is not this movement pattern ('KB Face Pulls ' U20 under VERTICAL PULL) comes last of all, marked `misfiled_not_this_pattern`. Names show the generator's `display_name` where v1 sets one ('Squat Snatch' etc., or a 'cable or band' name with the cable route only). The table shows the first 6 entries; the JSON has the full list, each entry with cell, level, constraint, zone, laterality, axial load and flags. `client_rules` re-rank these lists per client (section 2.3).

**AP_PLYO** - coach labels 'Plyo'; library 'MASTER EXERCISE LIBRARY'!G7:G162 (PLYOS)

| Profile | Status | As written | Ordered options (first 6; * = operative level differs from library level) |
|---|---|---|---|
| FAC | full | 38 | Low Depth Drop G9 F; Medium Depth Drop G11 F; Push up Stick the Landing G12 F; Low Box Jumps (half shin) G13 F; Mid Box Jump (up to knee) G14 F; Ankle Hops G15 F (+32 more) |
| FULL | full | 30 | Low Depth Drop G9 F; Medium Depth Drop G11 F; Push up Stick the Landing G12 F; Low Box Jumps (half shin) G13 F; Mid Box Jump (up to knee) G14 F; Ankle Hops G15 F (+24 more) |
| BASIC | full | 29 | Low Depth Drop G9 F; Medium Depth Drop G11 F; Push up Stick the Landing G12 F; Low Box Jumps (half shin) G13 F; Mid Box Jump (up to knee) G14 F; Ankle Hops G15 F (+23 more) |
| H-BB | full | 30 | Low Depth Drop G9 F; Medium Depth Drop G11 F; Push up Stick the Landing G12 F; Low Box Jumps (half shin) G13 F; Mid Box Jump (up to knee) G14 F; Ankle Hops G15 F (+24 more) |
| H-DB | full | 30 | Low Depth Drop G9 F; Medium Depth Drop G11 F; Push up Stick the Landing G12 F; Low Box Jumps (half shin) G13 F; Mid Box Jump (up to knee) G14 F; Ankle Hops G15 F (+24 more) |
| KB | full | 26 | Low Depth Drop G9 F; Medium Depth Drop G11 F; Push up Stick the Landing G12 F; Low Box Jumps (half shin) G13 F; Mid Box Jump (up to knee) G14 F; Ankle Hops G15 F (+20 more) |
| BW | full | 26 | Low Depth Drop G9 F; Medium Depth Drop G11 F; Push up Stick the Landing G12 F; Low Box Jumps (half shin) G13 F; Mid Box Jump (up to knee) G14 F; Ankle Hops G15 F (+20 more) |
| HOTEL | full | 28 | Low Depth Drop G9 F; Medium Depth Drop G11 F; Push up Stick the Landing G12 F; Low Box Jumps (half shin) G13 F; Mid Box Jump (up to knee) G14 F; Ankle Hops G15 F (+22 more) |
| FIELD | full | 33 | Low Depth Drop G9 F; Medium Depth Drop G11 F; Push up Stick the Landing G12 F; Low Box Jumps (half shin) G13 F; Mid Box Jump (up to knee) G14 F; Ankle Hops G15 F (+27 more) |
| F-NOKIT | full | 26 | Low Depth Drop G9 F; Medium Depth Drop G11 F; Push up Stick the Landing G12 F; Low Box Jumps (half shin) G13 F; Mid Box Jump (up to knee) G14 F; Ankle Hops G15 F (+20 more) |

**AP_THROW** - coach labels 'Throwing'; library K7:K87 (THROWING)

| Profile | Status | As written | Ordered options (first 6; * = operative level differs from library level) |
|---|---|---|---|
| FAC | full | 20 | Chest pass K9 any; Overhead throw K10 any; Rotational Chest pass R K11 any; Rotational Chest pass L K12 any; Rotational Scoop R K13 any; Rotational Scoop L K14 any (+14 more) |
| FULL | full | 20 | Chest pass K9 any; Overhead throw K10 any; Rotational Chest pass R K11 any; Rotational Chest pass L K12 any; Rotational Scoop R K13 any; Rotational Scoop L K14 any (+14 more) |
| BASIC | full | 20 | Chest pass K9 any; Overhead throw K10 any; Rotational Chest pass R K11 any; Rotational Chest pass L K12 any; Rotational Scoop R K13 any; Rotational Scoop L K14 any (+14 more) |
| H-BB | substitute_only | 0 | [zone_shift] Plyo pushups (push throws) (OBSERVED-lib); [zone_shift] FAKE MEDBALL SLAM & RETURN ANY WAY POSSIBLE (OBSERVED); [pattern_gap] Staggered stance DB snatch (OBSERVED); [zone_shift] cross connect rolls/rocking (OBSERVED); [pattern_gap] Buy an 8-10 lb medball (the coach's weight for passes and rotations; part of his ideal home kit) (COACH-ANSWER) |
| H-DB | substitute_only | 0 | [zone_shift] Plyo pushups (push throws) (OBSERVED-lib); [zone_shift] FAKE MEDBALL SLAM & RETURN ANY WAY POSSIBLE (OBSERVED); [pattern_gap] Staggered stance DB snatch (OBSERVED); [zone_shift] cross connect rolls/rocking (OBSERVED); [pattern_gap] Buy an 8-10 lb medball (the coach's weight for passes and rotations; part of his ideal home kit) (COACH-ANSWER) |
| KB | substitute_only | 0 | [zone_shift] Plyo pushups (push throws) (OBSERVED-lib); [zone_shift] FAKE MEDBALL SLAM & RETURN ANY WAY POSSIBLE (OBSERVED); [same_pattern] Kb rotation swings no hip thrust (OBSERVED); [pattern_gap] Fast KB swings (OBSERVED); [zone_shift] cross connect rolls/rocking (OBSERVED); [pattern_gap] Buy an 8-10 lb medball (the coach's weight for passes and rotations; part of his ideal home kit) (COACH-ANSWER) |
| BW | substitute_only | 0 | [zone_shift] Plyo pushups (push throws) (OBSERVED-lib); [zone_shift] FAKE MEDBALL SLAM & RETURN ANY WAY POSSIBLE (OBSERVED); [zone_shift] cross connect rolls/rocking (OBSERVED); [pattern_gap] Buy an 8-10 lb medball (the coach's weight for passes and rotations; part of his ideal home kit) (COACH-ANSWER) |
| HOTEL | substitute_only | 0 | [zone_shift] Plyo pushups (push throws) (OBSERVED-lib); [zone_shift] FAKE MEDBALL SLAM & RETURN ANY WAY POSSIBLE (OBSERVED); [pattern_gap] Staggered stance DB snatch (OBSERVED); [zone_shift] cross connect rolls/rocking (OBSERVED); [pattern_gap] Buy an 8-10 lb medball (the coach's weight for passes and rotations; part of his ideal home kit) (COACH-ANSWER) |
| FIELD | full | 20 | Chest pass K9 any; Overhead throw K10 any; Rotational Chest pass R K11 any; Rotational Chest pass L K12 any; Rotational Scoop R K13 any; Rotational Scoop L K14 any (+14 more) |
| F-NOKIT | substitute_only | 0 | [zone_shift] Plyo pushups (push throws) (OBSERVED-lib); [zone_shift] FAKE MEDBALL SLAM & RETURN ANY WAY POSSIBLE (OBSERVED); [zone_shift] cross connect rolls/rocking (OBSERVED); [pattern_gap] Buy an 8-10 lb medball (the coach's weight for passes and rotations; part of his ideal home kit) (COACH-ANSWER) |

**AP_COD** - coach labels 'COD'; library L7:L242 (CHANGE OF DIRECTION)

| Profile | Status | As written | Ordered options (first 6; * = operative level differs from library level) |
|---|---|---|---|
| FAC | full | 9 | FADE L9 F; SLANT L10 F; POST/CORNER L11 F; FLAT L12 F; Shuffles L13 F; DIG/OUT L46 I (+3 more) |
| FULL | full | 9 | FADE L9 F; SLANT L10 F; POST/CORNER L11 F; FLAT L12 F; Shuffles L13 F; DIG/OUT L46 I (+3 more) |
| BASIC | full | 9 | FADE L9 F; SLANT L10 F; POST/CORNER L11 F; FLAT L12 F; Shuffles L13 F; DIG/OUT L46 I (+3 more) |
| H-BB | full | 9 | FADE L9 F; SLANT L10 F; POST/CORNER L11 F; FLAT L12 F; Shuffles L13 F; DIG/OUT L46 I (+3 more) |
| H-DB | full | 9 | FADE L9 F; SLANT L10 F; POST/CORNER L11 F; FLAT L12 F; Shuffles L13 F; DIG/OUT L46 I (+3 more) |
| KB | full | 9 | FADE L9 F; SLANT L10 F; POST/CORNER L11 F; FLAT L12 F; Shuffles L13 F; DIG/OUT L46 I (+3 more) |
| BW | full | 9 | FADE L9 F; SLANT L10 F; POST/CORNER L11 F; FLAT L12 F; Shuffles L13 F; DIG/OUT L46 I (+3 more) |
| HOTEL | full | 9 | FADE L9 F; SLANT L10 F; POST/CORNER L11 F; FLAT L12 F; Shuffles L13 F; DIG/OUT L46 I (+3 more) |
| FIELD | full | 9 | FADE L9 F; SLANT L10 F; POST/CORNER L11 F; FLAT L12 F; Shuffles L13 F; DIG/OUT L46 I (+3 more) |
| F-NOKIT | full | 9 | FADE L9 F; SLANT L10 F; POST/CORNER L11 F; FLAT L12 F; Shuffles L13 F; DIG/OUT L46 I (+3 more) |

**AP_TRIPLE_EXT** - coach labels 'Tripple Extension'; library C7:C242 (TRIPPLE EXTENSION incl. JUMPING ANKLE C126:C136)

| Profile | Status | As written | Ordered options (first 6; * = operative level differs from library level) |
|---|---|---|---|
| FAC | full | 31 | BodyWeight Squat to calf raise C9 F; Lunge to high knee reach C10 F; Hex bar squat to calf raise C11 F; High hang clean pull C12 F; Mid hang clean pull C13 F; High hang snatch pull C14 F (+25 more) |
| FULL | full | 27 | BodyWeight Squat to calf raise C9 F; Lunge to high knee reach C10 F; Hex bar squat to calf raise C11 F; High hang clean pull C12 F; Mid hang clean pull C13 F; High hang snatch pull C14 F (+21 more) |
| BASIC | full | 25 | BodyWeight Squat to calf raise C9 F; Lunge to high knee reach C10 F; High hang clean pull C12 F; Mid hang clean pull C13 F; High hang snatch pull C14 F; Mid hang snatch pull C15 F (+19 more) |
| H-BB | full | 25 | BodyWeight Squat to calf raise C9 F; Lunge to high knee reach C10 F; High hang clean pull C12 F; Mid hang clean pull C13 F; High hang snatch pull C14 F; Mid hang snatch pull C15 F (+19 more) |
| H-DB | level_gap | 16 | BodyWeight Squat to calf raise C9 F; Lunge to high knee reach C10 F; Bilateral symmetrical ankle hop C126 F; Lateral bilateral ankle hops C127 F; Forward/reverse bilateral hops C128 F; Reverse bilateral ankle hops C129 F (+14 more) |
| KB | level_gap | 16 | BodyWeight Squat to calf raise C9 F; Lunge to high knee reach C10 F; Bilateral symmetrical ankle hop C126 F; Lateral bilateral ankle hops C127 F; Forward/reverse bilateral hops C128 F; Reverse bilateral ankle hops C129 F (+13 more) |
| BW | level_gap | 13 | BodyWeight Squat to calf raise C9 F; Lunge to high knee reach C10 F; Bilateral symmetrical ankle hop C126 F; Lateral bilateral ankle hops C127 F; Forward/reverse bilateral hops C128 F; Reverse bilateral ankle hops C129 F (+9 more) |
| HOTEL | level_gap | 16 | BodyWeight Squat to calf raise C9 F; Lunge to high knee reach C10 F; Bilateral symmetrical ankle hop C126 F; Lateral bilateral ankle hops C127 F; Forward/reverse bilateral hops C128 F; Reverse bilateral ankle hops C129 F (+14 more) |
| FIELD | level_gap | 13 | BodyWeight Squat to calf raise C9 F; Lunge to high knee reach C10 F; Bilateral symmetrical ankle hop C126 F; Lateral bilateral ankle hops C127 F; Forward/reverse bilateral hops C128 F; Reverse bilateral ankle hops C129 F (+10 more) |
| F-NOKIT | level_gap | 13 | BodyWeight Squat to calf raise C9 F; Lunge to high knee reach C10 F; Bilateral symmetrical ankle hop C126 F; Lateral bilateral ankle hops C127 F; Forward/reverse bilateral hops C128 F; Reverse bilateral ankle hops C129 F (+9 more) |

**CORE_ANY** - coach labels 'Core', 'LATERAL CORE', 'Transverse core', 'Sagital core'; library O7:O283 (CORE THORAX + CORE PELVIS stacked)

| Profile | Status | As written | Ordered options (first 6; * = operative level differs from library level) |
|---|---|---|---|
| FAC | full | 17 | Plank O10 F; Crunches O11 F; Sit ups O12 F; Weighted Situps O13 F; Toes to bar O15 F; Knees to chest O16 F (+11 more) |
| FULL | full | 17 | Plank O10 F; Crunches O11 F; Sit ups O12 F; Weighted Situps O13 F; Toes to bar O15 F; Knees to chest O16 F (+11 more) |
| BASIC | full | 17 | Plank O10 F; Crunches O11 F; Sit ups O12 F; Weighted Situps O13 F; Toes to bar O15 F; Knees to chest O16 F (+11 more) |
| H-BB | full | 16 | Plank O10 F; Crunches O11 F; Sit ups O12 F; Weighted Situps O13 F; Toes to bar O15 F; Knees to chest O16 F (+10 more) |
| H-DB | full | 12 | Plank O10 F; Crunches O11 F; Sit ups O12 F; Weighted Situps O13 F; Leg Raises O127 F; Reverse Crunches O128 F (+6 more) |
| KB | full | 12 | Plank O10 F; Crunches O11 F; Sit ups O12 F; Weighted Situps O13 F; Leg Raises O127 F; Reverse Crunches O128 F (+6 more) |
| BW | full | 10 | Plank O10 F; Crunches O11 F; Sit ups O12 F; Leg Raises O127 F; Reverse Crunches O128 F; V-ups O129 F (+4 more) |
| HOTEL | full | 12 | Plank O10 F; Crunches O11 F; Sit ups O12 F; Weighted Situps O13 F; Leg Raises O127 F; Reverse Crunches O128 F (+6 more) |
| FIELD | full | 12 | Plank O10 F; Crunches O11 F; Sit ups O12 F; Weighted Situps O13 F; Leg Raises O127 F; Reverse Crunches O128 F (+6 more) |
| F-NOKIT | full | 10 | Plank O10 F; Crunches O11 F; Sit ups O12 F; Leg Raises O127 F; Reverse Crunches O128 F; V-ups O129 F (+4 more) |

**COND_AEROBIC** - coach labels 'Cardio', 'Aerobic Capacity', 'Buy out'; library B7:B122 (8 tabs, running only) / B7:B335 (BOOTCAMP - OPTION 2: + DISTANCE + CALORIES)

| Profile | Status | As written | Ordered options (first 6; * = operative level differs from library level) |
|---|---|---|---|
| FAC | full | 34 | 2 min Fast - 1 min walk B9 any; 3 min Fast - 2 min walk B10 any; 4 min Fast - 3 min walk B11 any; 5 min fast - 2 min walk B12 any; 6 min fast - 1 min walk B13 any; 1 mile run - 1 min walk B15 any (+28 more) |
| FULL | full | 34 | 2 min Fast - 1 min walk B9 any; 3 min Fast - 2 min walk B10 any; 4 min Fast - 3 min walk B11 any; 5 min fast - 2 min walk B12 any; 6 min fast - 1 min walk B13 any; 1 mile run - 1 min walk B15 any (+28 more) |
| BASIC | full | 34 | 2 min Fast - 1 min walk B9 any; 3 min Fast - 2 min walk B10 any; 4 min Fast - 3 min walk B11 any; 5 min fast - 2 min walk B12 any; 6 min fast - 1 min walk B13 any; 1 mile run - 1 min walk B15 any (+28 more) |
| H-BB | full | 25 | 2 min Fast - 1 min walk B9 any; 3 min Fast - 2 min walk B10 any; 4 min Fast - 3 min walk B11 any; 5 min fast - 2 min walk B12 any; 6 min fast - 1 min walk B13 any; 1 mile run - 1 min walk B15 any (+19 more) |
| H-DB | full | 25 | 2 min Fast - 1 min walk B9 any; 3 min Fast - 2 min walk B10 any; 4 min Fast - 3 min walk B11 any; 5 min fast - 2 min walk B12 any; 6 min fast - 1 min walk B13 any; 1 mile run - 1 min walk B15 any (+19 more) |
| KB | full | 25 | 2 min Fast - 1 min walk B9 any; 3 min Fast - 2 min walk B10 any; 4 min Fast - 3 min walk B11 any; 5 min fast - 2 min walk B12 any; 6 min fast - 1 min walk B13 any; 1 mile run - 1 min walk B15 any (+19 more) |
| BW | full | 25 | 2 min Fast - 1 min walk B9 any; 3 min Fast - 2 min walk B10 any; 4 min Fast - 3 min walk B11 any; 5 min fast - 2 min walk B12 any; 6 min fast - 1 min walk B13 any; 1 mile run - 1 min walk B15 any (+19 more) |
| HOTEL | full | 34 | 2 min Fast - 1 min walk B9 any; 3 min Fast - 2 min walk B10 any; 4 min Fast - 3 min walk B11 any; 5 min fast - 2 min walk B12 any; 6 min fast - 1 min walk B13 any; 1 mile run - 1 min walk B15 any (+28 more) |
| FIELD | full | 25 | 2 min Fast - 1 min walk B9 any; 3 min Fast - 2 min walk B10 any; 4 min Fast - 3 min walk B11 any; 5 min fast - 2 min walk B12 any; 6 min fast - 1 min walk B13 any; 1 mile run - 1 min walk B15 any (+19 more) |
| F-NOKIT | full | 25 | 2 min Fast - 1 min walk B9 any; 3 min Fast - 2 min walk B10 any; 4 min Fast - 3 min walk B11 any; 5 min fast - 2 min walk B12 any; 6 min fast - 1 min walk B13 any; 1 mile run - 1 min walk B15 any (+19 more) |

**RP_BKD** - coach labels 'Bilateral KD', 'bkd'; library AI7:AI122 (BILATERAL KNEE DOMINANT)

| Profile | Status | As written | Ordered options (first 6; * = operative level differs from library level) |
|---|---|---|---|
| FAC | full | 30 | Leg press AI98 F*; Squats with Foam Roller or Yoga Ball on the wall AI14 F; Hack Squat Machine AI52 F*; Hack Squats AI97 F*; Pendulum Squat AI99 F*; Belt Squat ADD-EQ11 F (coach addition) (+24 more) |
| FULL | full | 29 | Leg press AI98 F*; Squats with Foam Roller or Yoga Ball on the wall AI14 F; Hack Squat Machine AI52 F*; Hack Squats AI97 F*; Pendulum Squat AI99 F*; Box Squats AI13 F (+23 more) |
| BASIC | full | 24 | Leg press AI98 F*; Squats with Foam Roller or Yoga Ball on the wall AI14 F; Hack Squat Machine AI52 F*; Hack Squats AI97 F*; Box Squats AI13 F; Box. Zercher squat Touch and Go AI9 F (+18 more) |
| H-BB | full | 18 | Box Squats AI13 F; Box. Zercher squat Touch and Go AI9 F; Box. Goblet squat Touch and Go AI10 F; Bodyweight Squats AI12 F; Low DB Squats AI15 F; Goblet KB/DB Squats AI11 F (+12 more) |
| H-DB | level_gap | 13 | Box Squats AI13 F; Box. Zercher squat Touch and Go AI9 F; Box. Goblet squat Touch and Go AI10 F; Bodyweight Squats AI12 F; Low DB Squats AI15 F; Goblet KB/DB Squats AI11 F (+11 more) |
| KB | full | 9 | Box Squats AI13 F; Box. Goblet squat Touch and Go AI10 F; Bodyweight Squats AI12 F; Goblet KB/DB Squats AI11 F; Sumo Squats w/ DB or KB AI19 F; Double front rack kb squat AI51 I (+3 more) |
| BW | level_gap | 3 | Box Squats AI13 F; Bodyweight Squats AI12 F; Sissy Squats AI100 A; [partial] Single Leg Get Ups (box pistol) (OBSERVED-lib); [partial] Pistol Squats (load moves to one leg) (OBSERVED-lib); [partial] slow eccentric deficit Lunges (no weigths) (OBSERVED) |
| HOTEL | level_gap | 14 | Squats with Foam Roller or Yoga Ball on the wall AI14 F; Box Squats AI13 F; Box. Zercher squat Touch and Go AI9 F; Box. Goblet squat Touch and Go AI10 F; Bodyweight Squats AI12 F; Low DB Squats AI15 F (+12 more) |
| FIELD | level_gap | 3 | Box Squats AI13 F; Bodyweight Squats AI12 F; Sissy Squats AI100 A; [same_pattern] Medball hug goblet squat (OBSERVED); [partial] Single Leg Get Ups (box pistol) (OBSERVED-lib); [partial] Pistol Squats (load moves to one leg) (OBSERVED-lib) (+1 more) |
| F-NOKIT | level_gap | 3 | Box Squats AI13 F; Bodyweight Squats AI12 F; Sissy Squats AI100 A; [partial] Single Leg Get Ups (box pistol) (OBSERVED-lib); [partial] Pistol Squats (load moves to one leg) (OBSERVED-lib); [partial] slow eccentric deficit Lunges (no weigths) (OBSERVED) |

**RP_BHD** - coach labels 'Bilateral HD', 'bhd'; library AN7:AN122 (BILATERAL HIP DOMNANT)

| Profile | Status | As written | Ordered options (first 6; * = operative level differs from library level) |
|---|---|---|---|
| FAC | full | 23 | Reverse Hyper Extension AN11 F; Hip Thrust Machine AN51 F*; Machine Good Mornings AN52 F*; Hyper extensions AN55 F*; Cable Pull Through AN12 F; Glute Bridges AN9 F (+17 more) |
| FULL | full | 23 | Reverse Hyper Extension AN11 F; Hip Thrust Machine AN51 F*; Machine Good Mornings AN52 F*; Hyper extensions AN55 F*; Cable Pull Through AN12 F; Glute Bridges AN9 F (+17 more) |
| BASIC | full | 17 | Hyper extensions AN55 F*; Cable Pull Through AN12 F; Glute Bridges AN9 F; Elevated Feet on Bench Glute Bridges AN10 F; Single KB Deadlift AN13 F; Double KB Deadlift AN14 F (+11 more) |
| H-BB | full | 12 | Glute Bridges AN9 F; Elevated Feet on Bench Glute Bridges AN10 F; DB Hip Thrusts AN53 I; DB Deadlifts AN46 I; Shoulder Wide Grip Deadlift AN49 I; Barbell Hip Thrusts AN98 A (+6 more) |
| H-DB | full | 5 | Glute Bridges AN9 F; Elevated Feet on Bench Glute Bridges AN10 F; DB Hip Thrusts AN53 I; DB Deadlifts AN46 I; Stiff Leg Deadlift AN99 A |
| KB | level_gap | 5 | Glute Bridges AN9 F; Elevated Feet on Bench Glute Bridges AN10 F; Single KB Deadlift AN13 F; Double KB Deadlift AN14 F; KB swing AN20 F; [partial] Backpack or water-jug deadlift / hip thrust (INFERRED) (+2 more) |
| BW | level_gap | 2 | Glute Bridges AN9 F; Elevated Feet on Bench Glute Bridges AN10 F; [partial] Backpack or water-jug deadlift / hip thrust (INFERRED); [partial] SL glute bridges (heel on bench) (OBSERVED); [partial] Bodyweight single-leg RDL with reach (INFERRED) |
| HOTEL | full | 5 | Glute Bridges AN9 F; Elevated Feet on Bench Glute Bridges AN10 F; DB Hip Thrusts AN53 I; DB Deadlifts AN46 I; Stiff Leg Deadlift AN99 A |
| FIELD | level_gap | 2 | Glute Bridges AN9 F; Elevated Feet on Bench Glute Bridges AN10 F; [partial] Backpack or water-jug deadlift / hip thrust (INFERRED); [partial] SL glute bridges (heel on bench) (OBSERVED); [partial] Bodyweight single-leg RDL with reach (INFERRED) |
| F-NOKIT | level_gap | 2 | Glute Bridges AN9 F; Elevated Feet on Bench Glute Bridges AN10 F; [partial] SL glute bridges (heel on bench) (OBSERVED); [partial] Bodyweight single-leg RDL with reach (INFERRED) |

**RP_UKD** - coach labels 'Unilateral KD', 'ukd'; library AL7:AL42 (UNILATERAL KNEE DOMINANT)

| Profile | Status | As written | Ordered options (first 6; * = operative level differs from library level) |
|---|---|---|---|
| FAC | full | 13 | Reverse Lunges AL10 any; Stationary Lunges AL9 any; Step ups (Forward & Side) AL19 any; Single Leg Get Ups AL14 any; Front Foot Elevated Lunges (FFE) AL15 any; Forward  Lunges AL11 any (+7 more) |
| FULL | full | 13 | Reverse Lunges AL10 any; Stationary Lunges AL9 any; Step ups (Forward & Side) AL19 any; Single Leg Get Ups AL14 any; Front Foot Elevated Lunges (FFE) AL15 any; Forward  Lunges AL11 any (+7 more) |
| BASIC | full | 13 | Reverse Lunges AL10 any; Stationary Lunges AL9 any; Step ups (Forward & Side) AL19 any; Single Leg Get Ups AL14 any; Front Foot Elevated Lunges (FFE) AL15 any; Forward  Lunges AL11 any (+7 more) |
| H-BB | full | 13 | Reverse Lunges AL10 any; Stationary Lunges AL9 any; Step ups (Forward & Side) AL19 any; Single Leg Get Ups AL14 any; Front Foot Elevated Lunges (FFE) AL15 any; Forward  Lunges AL11 any (+7 more) |
| H-DB | full | 13 | Reverse Lunges AL10 any; Stationary Lunges AL9 any; Step ups (Forward & Side) AL19 any; Single Leg Get Ups AL14 any; Front Foot Elevated Lunges (FFE) AL15 any; Forward  Lunges AL11 any (+7 more) |
| KB | full | 13 | Reverse Lunges AL10 any; Stationary Lunges AL9 any; Step ups (Forward & Side) AL19 any; Single Leg Get Ups AL14 any; Front Foot Elevated Lunges (FFE) AL15 any; Forward  Lunges AL11 any (+7 more) |
| BW | full | 13 | Reverse Lunges AL10 any; Stationary Lunges AL9 any; Step ups (Forward & Side) AL19 any; Single Leg Get Ups AL14 any; Front Foot Elevated Lunges (FFE) AL15 any; Forward  Lunges AL11 any (+7 more) |
| HOTEL | full | 13 | Reverse Lunges AL10 any; Stationary Lunges AL9 any; Step ups (Forward & Side) AL19 any; Single Leg Get Ups AL14 any; Front Foot Elevated Lunges (FFE) AL15 any; Forward  Lunges AL11 any (+7 more) |
| FIELD | full | 13 | Reverse Lunges AL10 any; Stationary Lunges AL9 any; Step ups (Forward & Side) AL19 any; Single Leg Get Ups AL14 any; Front Foot Elevated Lunges (FFE) AL15 any; Forward  Lunges AL11 any (+7 more) |
| F-NOKIT | full | 13 | Reverse Lunges AL10 any; Stationary Lunges AL9 any; Step ups (Forward & Side) AL19 any; Single Leg Get Ups AL14 any; Front Foot Elevated Lunges (FFE) AL15 any; Forward  Lunges AL11 any (+7 more) |

**RP_UHD** - coach labels 'Unilateral HD', 'uhd'; library AQ7:AQ42 (UNILATERAL HIP DOMINANT)

| Profile | Status | As written | Ordered options (first 6; * = operative level differs from library level) |
|---|---|---|---|
| FAC | full | 7 | SL Glute Bridges (foot on the ground) AQ9 F; SL Glute Bridges (foot on bench) AQ10 F; SL Hip thrusts AQ11 F; Staggered Stance DL w/ DB AQ12 F; Alternating DB Deadlifts AQ13 F; Staggered Stance DL w/ Barbell AQ14 F (+1 more) |
| FULL | full | 7 | SL Glute Bridges (foot on the ground) AQ9 F; SL Glute Bridges (foot on bench) AQ10 F; SL Hip thrusts AQ11 F; Staggered Stance DL w/ DB AQ12 F; Alternating DB Deadlifts AQ13 F; Staggered Stance DL w/ Barbell AQ14 F (+1 more) |
| BASIC | full | 7 | SL Glute Bridges (foot on the ground) AQ9 F; SL Glute Bridges (foot on bench) AQ10 F; SL Hip thrusts AQ11 F; Staggered Stance DL w/ DB AQ12 F; Alternating DB Deadlifts AQ13 F; Staggered Stance DL w/ Barbell AQ14 F (+1 more) |
| H-BB | full | 7 | SL Glute Bridges (foot on the ground) AQ9 F; SL Glute Bridges (foot on bench) AQ10 F; SL Hip thrusts AQ11 F; Staggered Stance DL w/ DB AQ12 F; Alternating DB Deadlifts AQ13 F; Staggered Stance DL w/ Barbell AQ14 F (+1 more) |
| H-DB | full | 5 | SL Glute Bridges (foot on the ground) AQ9 F; SL Glute Bridges (foot on bench) AQ10 F; SL Hip thrusts AQ11 F; Staggered Stance DL w/ DB AQ12 F; Alternating DB Deadlifts AQ13 F |
| KB | full | 3 | SL Glute Bridges (foot on the ground) AQ9 F; SL Glute Bridges (foot on bench) AQ10 F; SL Hip thrusts AQ11 F |
| BW | full | 3 | SL Glute Bridges (foot on the ground) AQ9 F; SL Glute Bridges (foot on bench) AQ10 F; SL Hip thrusts AQ11 F |
| HOTEL | full | 5 | SL Glute Bridges (foot on the ground) AQ9 F; SL Glute Bridges (foot on bench) AQ10 F; SL Hip thrusts AQ11 F; Staggered Stance DL w/ DB AQ12 F; Alternating DB Deadlifts AQ13 F |
| FIELD | full | 3 | SL Glute Bridges (foot on the ground) AQ9 F; SL Glute Bridges (foot on bench) AQ10 F; SL Hip thrusts AQ11 F |
| F-NOKIT | full | 3 | SL Glute Bridges (foot on the ground) AQ9 F; SL Glute Bridges (foot on bench) AQ10 F; SL Hip thrusts AQ11 F |

**RP_HPULL** - coach labels 'Horizontal Pull', 'horiz pull'; library X7:X162 (HORIZONTAL PULL)

| Profile | Status | As written | Ordered options (first 6; * = operative level differs from library level) |
|---|---|---|---|
| FAC | full | 16 | Machine Row Close Grip X9 F; Machine Row Supinated Grip X10 F; Machine Row Pronated Grips X11 F; Inverted Rows X13 F; TRX Rows X12 F; Cable Machine UL Rows X92 any (+10 more) |
| FULL | full | 16 | Machine Row Close Grip X9 F; Machine Row Supinated Grip X10 F; Machine Row Pronated Grips X11 F; Inverted Rows X13 F; TRX Rows X12 F; Cable Machine UL Rows X92 any (+10 more) |
| BASIC | full | 15 | Machine Row Close Grip X9 F; Machine Row Supinated Grip X10 F; Machine Row Pronated Grips X11 F; Inverted Rows X13 F; Cable Machine UL Rows X92 any; DB/ Kb Rows X91 any (+9 more) |
| H-BB | full | 7 | Inverted Rows X13 F; DB/ Kb Rows X91 any; Bent Over Barbell Rows X46 A; Bent Over Barbell Rows Supinated Grip X47 A; Bent Over Rows Close Grip X48 A; Bent Over Rows Pronated Grip X49 A (+1 more) |
| H-DB | level_gap | 4 | DB/ Kb Rows X91 any; Bent Over Rows Close Grip X48 A; Bent Over Rows Pronated Grip X49 A; Renegade Rows X54 A; [same_pattern] Bent over db or kb row (OBSERVED); [same_pattern] Single arm Db Row (OBSERVED) (+4 more) |
| KB | level_gap | 2 | DB/ Kb Rows X91 any; Renegade Rows X54 A; [same_pattern] Bent over db or kb row (OBSERVED); [same_pattern] ... or Bird Dog Row (DB/KB, hand and knee on a bench) (OBSERVED); [same_pattern] Kong row (double-KB row from the floor) (OBSERVED); [partial] Inverted row under a sturdy table (INFERRED) (+1 more) |
| BW | substitute_only | 0 | [partial] Inverted row under a sturdy table (INFERRED); [partial] Towel row on a door frame (door closed, towel round the handles) (INFERRED) |
| HOTEL | level_gap | 4 | DB/ Kb Rows X91 any; Bent Over Rows Close Grip X48 A; Bent Over Rows Pronated Grip X49 A; Renegade Rows X54 A; [same_pattern] Bent over db or kb row (OBSERVED); [same_pattern] Single arm Db Row (OBSERVED) (+4 more) |
| FIELD | substitute_only | 0 | [partial] Inverted row under a sturdy table (INFERRED); [partial] Towel row on a door frame (door closed, towel round the handles) (INFERRED) |
| F-NOKIT | gap | 0 |  |

**RP_VPULL** - coach labels 'Vertical Pull', 'vert pull'; library U7:U122 (VERTICAL PULL)

| Profile | Status | As written | Ordered options (first 6; * = operative level differs from library level) |
|---|---|---|---|
| FAC | full | 18 | Lat Pulldown Pronated Grip U11 F; Lat Pulldown Wide Grip U9 F; Lat Pulldown Supinated Grip U10 F; Lat Pulldown Wide Mag Grips U12 F; Lat Pulldowns w/ Cable Rope U13 F; Lat Pulldowns Close Grip U14 F (+13 more) |
| FULL | full | 18 | Lat Pulldown Pronated Grip U11 F; Lat Pulldown Wide Grip U9 F; Lat Pulldown Supinated Grip U10 F; Lat Pulldown Wide Mag Grips U12 F; Lat Pulldowns w/ Cable Rope U13 F; Lat Pulldowns Close Grip U14 F (+13 more) |
| BASIC | full | 17 | Lat Pulldown Pronated Grip U11 F; Lat Pulldown Wide Grip U9 F; Lat Pulldown Supinated Grip U10 F; Lat Pulldown Wide Mag Grips U12 F; Lat Pulldowns w/ Cable Rope U13 F; Lat Pulldowns Close Grip U14 F (+12 more) |
| H-BB | level_gap | 7 | Stricted Pull-ups feet in front U47 A; Strict Pull ups L Sit U49 A; Weighted Pull ups U52 A; Stricted Pull-Up feet behind you U46 A; Strict Pull ups Knees in chest U48 A; Chin Ups U50 A (+6 more) |
| H-DB | substitute_only | 0 | [partial] DB pullover on a bench (INFERRED); [pattern_gap] Inverted row under a sturdy table (a horizontal pull) (INFERRED); [pattern_gap] Add 1-2 sets to the session's horizontal pull (INFERRED) |
| KB | substitute_only | 0 | [partial] KB pullover on the floor (INFERRED); [pattern_gap] Inverted row under a sturdy table (a horizontal pull) (INFERRED); [pattern_gap] Add 1-2 sets to the session's horizontal pull (INFERRED); KB Face Pulls U20 F [misfiled: not this pattern, listed last] |
| BW | gap | 0 | [pattern_gap] Inverted row under a sturdy table (a horizontal pull) (INFERRED); [pattern_gap] Add 1-2 sets to the session's horizontal pull (INFERRED) |
| HOTEL | substitute_only | 0 | [partial] DB pullover on a bench (INFERRED); [pattern_gap] Inverted row under a sturdy table (a horizontal pull) (INFERRED); [pattern_gap] Add 1-2 sets to the session's horizontal pull (INFERRED) |
| FIELD | gap | 0 | [pattern_gap] Inverted row under a sturdy table (a horizontal pull) (INFERRED); [pattern_gap] Add 1-2 sets to the session's horizontal pull (INFERRED) |
| F-NOKIT | gap | 0 | [pattern_gap] Add 1-2 sets to the session's horizontal pull (INFERRED) |

**RP_HPUSH** - coach labels 'Horizontal Push', 'Incline', 'Flies', 'Dips', 'horiz push'; library AD7:AD162 (HORIZONTAL PUSH)

| Profile | Status | As written | Ordered options (first 6; * = operative level differs from library level) |
|---|---|---|---|
| FAC | full | 25 | Machine bench press AD14 F; Machine flies AD50 F*; Cable Standing Chest Press AD9 F; Incline Push-ups AD12 F; DB Press on floor AD10 F; Kneeling Push Ups AD11 F (+19 more) |
| FULL | full | 25 | Machine bench press AD14 F; Machine flies AD50 F*; Cable Standing Chest Press AD9 F; Incline Push-ups AD12 F; DB Press on floor AD10 F; Kneeling Push Ups AD11 F (+19 more) |
| BASIC | full | 25 | Machine bench press AD14 F; Machine flies AD50 F*; Cable Standing Chest Press AD9 F; Incline Push-ups AD12 F; DB Press on floor AD10 F; Kneeling Push Ups AD11 F (+19 more) |
| H-BB | full | 18 | Incline Push-ups AD12 F; DB Press on floor AD10 F; Kneeling Push Ups AD11 F; Bench Push ups AD13 F; Alternating Db Floor Press AD128 any; Bench DB Flies AD48 I (+12 more) |
| H-DB | full | 17 | Incline Push-ups AD12 F; DB Press on floor AD10 F; Kneeling Push Ups AD11 F; Bench Push ups AD13 F; Alternating Db Floor Press AD128 any; Bench DB Flies AD48 I (+11 more) |
| KB | full | 10 | Incline Push-ups AD12 F; Kneeling Push Ups AD11 F; Bench Push ups AD13 F; Push Ups AD47 I; Push ups (1 hand Higher) AD130 any; Push ups (Feet on Wall) AD92 A (+4 more) |
| BW | full | 10 | Incline Push-ups AD12 F; Kneeling Push Ups AD11 F; Bench Push ups AD13 F; Push Ups AD47 I; Push ups (1 hand Higher) AD130 any; Push ups (Feet on Wall) AD92 A (+4 more) |
| HOTEL | full | 17 | Incline Push-ups AD12 F; DB Press on floor AD10 F; Kneeling Push Ups AD11 F; Bench Push ups AD13 F; Alternating Db Floor Press AD128 any; Bench DB Flies AD48 I (+11 more) |
| FIELD | full | 10 | Incline Push-ups AD12 F; Kneeling Push Ups AD11 F; Bench Push ups AD13 F; Push Ups AD47 I; Push ups (1 hand Higher) AD130 any; Push ups (Feet on Wall) AD92 A (+4 more) |
| F-NOKIT | full | 10 | Incline Push-ups AD12 F; Kneeling Push Ups AD11 F; Bench Push ups AD13 F; Push Ups AD47 I; Push ups (1 hand Higher) AD130 any; Push ups (Feet on Wall) AD92 A (+4 more) |

**RP_VPUSH** - coach labels 'Vertical Push', 'vert push'; library AA7:AA122 (VERTICAL PUSH)

| Profile | Status | As written | Ordered options (first 6; * = operative level differs from library level) |
|---|---|---|---|
| FAC | full | 20 | Seated Machine Shoulder Press ADD-EQ05 F (coach addition); Incline Seated DB Press AA9 F; Incline Seated Barbell Press AA10 F; DB Push press AA11 F; Barbell push press AA12 F; Kneeling Landmine Press AA93 any (+14 more) |
| FULL | full | 20 | Seated Machine Shoulder Press ADD-EQ05 F (coach addition); Incline Seated DB Press AA9 F; Incline Seated Barbell Press AA10 F; DB Push press AA11 F; Barbell push press AA12 F; Kneeling Landmine Press AA93 any (+14 more) |
| BASIC | full | 19 | Seated Machine Shoulder Press ADD-EQ05 F (coach addition); Incline Seated DB Press AA9 F; Incline Seated Barbell Press AA10 F; DB Push press AA11 F; Barbell push press AA12 F; Sesaw Db Press AA91 any (+13 more) |
| H-BB | full | 18 | Incline Seated DB Press AA9 F; Incline Seated Barbell Press AA10 F; DB Push press AA11 F; Barbell push press AA12 F; Sesaw Db Press AA91 any; Alternating Db press AA92 any (+12 more) |
| H-DB | full | 12 | Incline Seated DB Press AA9 F; DB Push press AA11 F; Sesaw Db Press AA91 any; Alternating Db press AA92 any; DB Push Jerk AA13 I*; Single arm DB thrusters AA94 any (+6 more) |
| KB | level_gap | 2 | Pike Push Ups AA53 A; Handstand Push ups AA52 A; [same_pattern] Half-kneeling single-arm KB press (INFERRED); [same_pattern] Pike push-up, feet on a bench (progression of AA53) (INFERRED) |
| BW | level_gap | 2 | Pike Push Ups AA53 A; Handstand Push ups AA52 A; [same_pattern] Pike push-up, feet on a bench (progression of AA53) (INFERRED) |
| HOTEL | full | 12 | Incline Seated DB Press AA9 F; DB Push press AA11 F; Sesaw Db Press AA91 any; Alternating Db press AA92 any; DB Push Jerk AA13 I*; Single arm DB thrusters AA94 any (+6 more) |
| FIELD | level_gap | 2 | Pike Push Ups AA53 A; Handstand Push ups AA52 A; [zone_shift] medball press (OBSERVED); [same_pattern] Pike push-up, feet on a bench (progression of AA53) (INFERRED) |
| F-NOKIT | level_gap | 2 | Pike Push Ups AA53 A; Handstand Push ups AA52 A; [same_pattern] Pike push-up, feet on a bench (progression of AA53) (INFERRED) |

**ISO_QUAD** - coach labels 'Leg Extensions'; library AM7:AM9 (LEG EXTENSIONS, 1 option)

| Profile | Status | As written | Ordered options (first 6; * = operative level differs from library level) |
|---|---|---|---|
| FAC | full | 1 | Leg Extensions AM9 any; [same_pattern] DB leg extensions on box (OBSERVED); [same_pattern] Sissy Squats (OBSERVED-lib); [same_pattern] Reverse Nordic (kneeling lean-back) (INFERRED); [partial] Goblet squats heels elevated (quad bias) (OBSERVED-lib); [rule] leg press or just add 2 more rounds to front squats -> add +2 sets to the preceding knee-dominant lift (OBSERVED) |
| FULL | full | 1 | Leg Extensions AM9 any; [same_pattern] DB leg extensions on box (OBSERVED); [same_pattern] Sissy Squats (OBSERVED-lib); [same_pattern] Reverse Nordic (kneeling lean-back) (INFERRED); [partial] Goblet squats heels elevated (quad bias) (OBSERVED-lib); [rule] leg press or just add 2 more rounds to front squats -> add +2 sets to the preceding knee-dominant lift (OBSERVED) |
| BASIC | full | 1 | Leg Extensions AM9 any; [same_pattern] DB leg extensions on box (OBSERVED); [same_pattern] Sissy Squats (OBSERVED-lib); [same_pattern] Reverse Nordic (kneeling lean-back) (INFERRED); [partial] Goblet squats heels elevated (quad bias) (OBSERVED-lib); [rule] leg press or just add 2 more rounds to front squats -> add +2 sets to the preceding knee-dominant lift (OBSERVED) |
| H-BB | substitute_only | 0 | [same_pattern] DB leg extensions on box (OBSERVED); [same_pattern] Sissy Squats (OBSERVED-lib); [same_pattern] Reverse Nordic (kneeling lean-back) (INFERRED); [partial] Goblet squats heels elevated (quad bias) (OBSERVED-lib); [rule] leg press or just add 2 more rounds to front squats -> add +2 sets to the preceding knee-dominant lift (OBSERVED) |
| H-DB | substitute_only | 0 | [same_pattern] DB leg extensions on box (OBSERVED); [same_pattern] Sissy Squats (OBSERVED-lib); [same_pattern] Reverse Nordic (kneeling lean-back) (INFERRED); [partial] Goblet squats heels elevated (quad bias) (OBSERVED-lib); [rule] leg press or just add 2 more rounds to front squats -> add +2 sets to the preceding knee-dominant lift (OBSERVED) |
| KB | substitute_only | 0 | [same_pattern] Sissy Squats (OBSERVED-lib); [same_pattern] Reverse Nordic (kneeling lean-back) (INFERRED); [partial] Goblet squats heels elevated (quad bias) (OBSERVED-lib); [rule] leg press or just add 2 more rounds to front squats -> add +2 sets to the preceding knee-dominant lift (OBSERVED) |
| BW | substitute_only | 0 | [same_pattern] Sissy Squats (OBSERVED-lib); [same_pattern] Reverse Nordic (kneeling lean-back) (INFERRED); [rule] leg press or just add 2 more rounds to front squats -> add +2 sets to the preceding knee-dominant lift (OBSERVED) |
| HOTEL | substitute_only | 0 | [same_pattern] DB leg extensions on box (OBSERVED); [same_pattern] Sissy Squats (OBSERVED-lib); [same_pattern] Reverse Nordic (kneeling lean-back) (INFERRED); [partial] Goblet squats heels elevated (quad bias) (OBSERVED-lib); [rule] leg press or just add 2 more rounds to front squats -> add +2 sets to the preceding knee-dominant lift (OBSERVED) |
| FIELD | substitute_only | 0 | [same_pattern] Sissy Squats (OBSERVED-lib); [same_pattern] Reverse Nordic (kneeling lean-back) (INFERRED); [rule] leg press or just add 2 more rounds to front squats -> add +2 sets to the preceding knee-dominant lift (OBSERVED) |
| F-NOKIT | substitute_only | 0 | [same_pattern] Sissy Squats (OBSERVED-lib); [same_pattern] Reverse Nordic (kneeling lean-back) (INFERRED); [rule] leg press or just add 2 more rounds to front squats -> add +2 sets to the preceding knee-dominant lift (OBSERVED) |

**ISO_LEG_FLEXION** - coach labels 'Leg Curls' (BYOP slot), 'LEG FLEXION' (MM Sheet25!H11), 'ham curls' (Sheet25!H13); library AR7:AR10 (LEG CURLS, the only range the BYOP slot reaches: 2 machines) + 9 knee-flexion items the library files under BILATERAL HIP DOMNANT (AN15, AN17, AN18, AN19, AN50, AN54, AN91, AN100, AN101)

| Profile | Status | As written | Ordered options (first 6; * = operative level differs from library level) |
|---|---|---|---|
| FAC | full | 11 | Leg Curl Machine AN15 F; Machine Leg Curls (Seated and Laying Down) AN54 F*; Machine Leg Curls AN100 F*; Supine Glidder hamstring curls AN18 F; Harmstring MedBall Curls AN17 F; swiss ball hamstring curls AN19 F (+5 more) |
| FULL | full | 11 | Leg Curl Machine AN15 F; Machine Leg Curls (Seated and Laying Down) AN54 F*; Machine Leg Curls AN100 F*; Supine Glidder hamstring curls AN18 F; Harmstring MedBall Curls AN17 F; swiss ball hamstring curls AN19 F (+5 more) |
| BASIC | full | 11 | Leg Curl Machine AN15 F; Machine Leg Curls (Seated and Laying Down) AN54 F*; Machine Leg Curls AN100 F*; Supine Glidder hamstring curls AN18 F; Harmstring MedBall Curls AN17 F; swiss ball hamstring curls AN19 F (+5 more) |
| H-BB | level_gap | 3 | Supine Glidder hamstring curls AN18 F; Nordic Curl AN91 A; DB Harmstring Curls AN101 A; [same_pattern] Glidder hamstring runners (OBSERVED); [same_pattern] Single-leg slider curl (towel) (INFERRED); [same_pattern] Nordic curl, eccentric-only / hands-assisted (push off the floor at the bottom) (INFERRED) (+1 more) |
| H-DB | level_gap | 3 | Supine Glidder hamstring curls AN18 F; Nordic Curl AN91 A; DB Harmstring Curls AN101 A; [same_pattern] Glidder hamstring runners (OBSERVED); [same_pattern] Single-leg slider curl (towel) (INFERRED); [same_pattern] Nordic curl, eccentric-only / hands-assisted (push off the floor at the bottom) (INFERRED) (+1 more) |
| KB | level_gap | 2 | Supine Glidder hamstring curls AN18 F; Nordic Curl AN91 A; [same_pattern] Glidder hamstring runners (OBSERVED); [same_pattern] Single-leg slider curl (towel) (INFERRED); [same_pattern] Nordic curl, eccentric-only / hands-assisted (push off the floor at the bottom) (INFERRED); [rule] Add +2 sets to the session's hinge (hamstrings still get hip-extension volume) (INFERRED) |
| BW | level_gap | 2 | Supine Glidder hamstring curls AN18 F; Nordic Curl AN91 A; [same_pattern] Glidder hamstring runners (OBSERVED); [same_pattern] Single-leg slider curl (towel) (INFERRED); [same_pattern] Nordic curl, eccentric-only / hands-assisted (push off the floor at the bottom) (INFERRED); [rule] Add +2 sets to the session's hinge (hamstrings still get hip-extension volume) (INFERRED) |
| HOTEL | full | 5 | Supine Glidder hamstring curls AN18 F; swiss ball hamstring curls AN19 F; Medicine or Stability Ball Harmstring Curls AN50 I; Nordic Curl AN91 A; DB Harmstring Curls AN101 A |
| FIELD | full | 4 | Supine Glidder hamstring curls AN18 F; Harmstring MedBall Curls AN17 F; Medicine or Stability Ball Harmstring Curls AN50 I; Nordic Curl AN91 A |
| F-NOKIT | level_gap | 2 | Supine Glidder hamstring curls AN18 F; Nordic Curl AN91 A; [same_pattern] Glidder hamstring runners (OBSERVED); [same_pattern] Single-leg slider curl (towel) (INFERRED); [same_pattern] Nordic curl, eccentric-only / hands-assisted (push off the floor at the bottom) (INFERRED); [rule] Add +2 sets to the session's hinge (hamstrings still get hip-extension volume) (INFERRED) |

**ISO_SIDE_REAR_DELT** - coach labels 'ABdution', 'Side raises', 'shoulders'; library AH7:AH42 (SIDE RAISES)

| Profile | Status | As written | Ordered options (first 6; * = operative level differs from library level) |
|---|---|---|---|
| FAC | full | 12 | Machine reverse fliez AH20 any; Inclined Cable Machine Side Raises AH14 any; Cable machine Leaning Side raises AH19 any; Seated Lateral Raises w/ DB AH9 any; Seated DB Reverse Flies AH15 any; Bent over DB Reverse flies AH10 any (+6 more) |
| FULL | full | 12 | Machine reverse fliez AH20 any; Inclined Cable Machine Side Raises AH14 any; Cable machine Leaning Side raises AH19 any; Seated Lateral Raises w/ DB AH9 any; Seated DB Reverse Flies AH15 any; Bent over DB Reverse flies AH10 any (+6 more) |
| BASIC | full | 12 | Machine reverse fliez AH20 any; Inclined Cable Machine Side Raises AH14 any; Cable machine Leaning Side raises AH19 any; Seated Lateral Raises w/ DB AH9 any; Seated DB Reverse Flies AH15 any; Bent over DB Reverse flies AH10 any (+6 more) |
| H-BB | full | 9 | Seated Lateral Raises w/ DB AH9 any; Seated DB Reverse Flies AH15 any; Bent over DB Reverse flies AH10 any; Lateral Raises w/ DB AH11 any; Front Raises w/ DB AH12 any; Front Raises w/ Barbell AH13 any (+3 more) |
| H-DB | full | 8 | Seated Lateral Raises w/ DB AH9 any; Seated DB Reverse Flies AH15 any; Bent over DB Reverse flies AH10 any; Lateral Raises w/ DB AH11 any; Front Raises w/ DB AH12 any; DB Hammer Side/Front Raises AH16 any (+2 more) |
| KB | substitute_only | 0 | [same_pattern] KB upright row (OBSERVED); [partial] Prone floor Y / T raises (INFERRED); [partial] Backpack or water-jug lateral raise (INFERRED) |
| BW | substitute_only | 0 | [partial] Prone floor Y / T raises (INFERRED); [partial] Backpack or water-jug lateral raise (INFERRED) |
| HOTEL | full | 8 | Seated Lateral Raises w/ DB AH9 any; Seated DB Reverse Flies AH15 any; Bent over DB Reverse flies AH10 any; Lateral Raises w/ DB AH11 any; Front Raises w/ DB AH12 any; DB Hammer Side/Front Raises AH16 any (+2 more) |
| FIELD | substitute_only | 0 | [partial] Prone floor Y / T raises (INFERRED); [partial] Backpack or water-jug lateral raise (INFERRED) |
| F-NOKIT | substitute_only | 0 | [partial] Prone floor Y / T raises (INFERRED) |

**ISO_BICEP** - coach labels 'Bicep', 'bicep'; library AS7:AS42 (BICEP)

| Profile | Status | As written | Ordered options (first 6; * = operative level differs from library level) |
|---|---|---|---|
| FAC | full | 14 | Spider Curls AS17 any; Cable Machine Curls (Zone1, Zone 2, Zone 3 AS12 any; Seated Db Bicep Curls AS14 any; Incline Seated Db Curls (Variation, Pinky Facing up) AS15 any; Seated DB Curls AS16 any; DB Concentration Curls AS22 any (+8 more) |
| FULL | full | 14 | Spider Curls AS17 any; Cable Machine Curls (Zone1, Zone 2, Zone 3 AS12 any; Seated Db Bicep Curls AS14 any; Incline Seated Db Curls (Variation, Pinky Facing up) AS15 any; Seated DB Curls AS16 any; DB Concentration Curls AS22 any (+8 more) |
| BASIC | full | 13 | Spider Curls AS17 any; Cable Machine Curls (Zone1, Zone 2, Zone 3 AS12 any; Seated Db Bicep Curls AS14 any; Incline Seated Db Curls (Variation, Pinky Facing up) AS15 any; Seated DB Curls AS16 any; DB Concentration Curls AS22 any (+7 more) |
| H-BB | full | 10 | Spider Curls AS17 any; Seated Db Bicep Curls AS14 any; Incline Seated Db Curls (Variation, Pinky Facing up) AS15 any; Seated DB Curls AS16 any; DB Concentration Curls AS22 any; Barbell Curls AS21 any (+4 more) |
| H-DB | full | 9 | Spider Curls AS17 any; Seated Db Bicep Curls AS14 any; Incline Seated Db Curls (Variation, Pinky Facing up) AS15 any; Seated DB Curls AS16 any; DB Concentration Curls AS22 any; DB Curls AS11 any (+3 more) |
| KB | substitute_only | 0 | [same_pattern] Curls (any kind) (OBSERVED); [same_pattern] KB curl (hammer / bottoms-up) (INFERRED); [pattern_gap] Backpack curl / towel-and-door isometric curl (INFERRED) |
| BW | gap | 0 | [pattern_gap] Backpack curl / towel-and-door isometric curl (INFERRED) |
| HOTEL | full | 9 | Spider Curls AS17 any; Seated Db Bicep Curls AS14 any; Incline Seated Db Curls (Variation, Pinky Facing up) AS15 any; Seated DB Curls AS16 any; DB Concentration Curls AS22 any; DB Curls AS11 any (+3 more) |
| FIELD | gap | 0 | [pattern_gap] Backpack curl / towel-and-door isometric curl (INFERRED) |
| F-NOKIT | gap | 0 |  |

**ISO_TRICEP** - coach labels 'Tricep', 'tricep'; library AT7:AT42 (TRICEP)

| Profile | Status | As written | Ordered options (first 6; * = operative level differs from library level) |
|---|---|---|---|
| FAC | full | 9 | Straight bar pronated tricep extensions AT9 any; Straight Bar Supinated Tricep Extensions AT14 any; Cable tricep push downs AT17 any; DB Kickbacks (Uni/Bi) AT10 any; Tate Press AT15 any; Floor DB Skullcrushers AT12 any (+3 more) |
| FULL | full | 9 | Straight bar pronated tricep extensions AT9 any; Straight Bar Supinated Tricep Extensions AT14 any; Cable tricep push downs AT17 any; DB Kickbacks (Uni/Bi) AT10 any; Tate Press AT15 any; Floor DB Skullcrushers AT12 any (+3 more) |
| BASIC | full | 9 | Straight bar pronated tricep extensions AT9 any; Straight Bar Supinated Tricep Extensions AT14 any; Cable tricep push downs AT17 any; DB Kickbacks (Uni/Bi) AT10 any; Tate Press AT15 any; Floor DB Skullcrushers AT12 any (+3 more) |
| H-BB | full | 4 | DB Kickbacks (Uni/Bi) AT10 any; Tate Press AT15 any; Floor DB Skullcrushers AT12 any; Overhead DB Tricep Extension AT11 any |
| H-DB | full | 4 | DB Kickbacks (Uni/Bi) AT10 any; Tate Press AT15 any; Floor DB Skullcrushers AT12 any; Overhead DB Tricep Extension AT11 any |
| KB | substitute_only | 0 | [same_pattern] Tricep (any kind) (OBSERVED); [same_pattern] KB overhead tricep extension (INFERRED); [partial] Diamond Push ups (OBSERVED-lib); [partial] Bench dips (hands on a chair/bench) (INFERRED); [partial] Bodyweight skull crusher on a table edge (INFERRED) |
| BW | substitute_only | 0 | [partial] Diamond Push ups (OBSERVED-lib); [partial] Bench dips (hands on a chair/bench) (INFERRED); [partial] Bodyweight skull crusher on a table edge (INFERRED) |
| HOTEL | full | 4 | DB Kickbacks (Uni/Bi) AT10 any; Tate Press AT15 any; Floor DB Skullcrushers AT12 any; Overhead DB Tricep Extension AT11 any |
| FIELD | substitute_only | 0 | [partial] Diamond Push ups (OBSERVED-lib); [partial] Bench dips (hands on a chair/bench) (INFERRED); [partial] Bodyweight skull crusher on a table edge (INFERRED) |
| F-NOKIT | substitute_only | 0 | [partial] Diamond Push ups (OBSERVED-lib); [partial] Bench dips (hands on a chair/bench) (INFERRED) |

**ISO_CALF** - coach labels 'Calves', 'calfs'; library AU7:AU13 (CALVES)

| Profile | Status | As written | Ordered options (first 6; * = operative level differs from library level) |
|---|---|---|---|
| FAC | full | 5 | Machine Calf Raises AU13 any; Calf Raises w/ DB AU11 any; Standing Calf raises (use deficit) AU9 any; Standing DB calf Raises (Use Deficit) AU10 any; Calf Raises w/ Barbell AU12 any |
| FULL | full | 5 | Machine Calf Raises AU13 any; Calf Raises w/ DB AU11 any; Standing Calf raises (use deficit) AU9 any; Standing DB calf Raises (Use Deficit) AU10 any; Calf Raises w/ Barbell AU12 any |
| BASIC | full | 5 | Machine Calf Raises AU13 any; Calf Raises w/ DB AU11 any; Standing Calf raises (use deficit) AU9 any; Standing DB calf Raises (Use Deficit) AU10 any; Calf Raises w/ Barbell AU12 any |
| H-BB | full | 4 | Calf Raises w/ DB AU11 any; Standing Calf raises (use deficit) AU9 any; Standing DB calf Raises (Use Deficit) AU10 any; Calf Raises w/ Barbell AU12 any |
| H-DB | full | 3 | Calf Raises w/ DB AU11 any; Standing Calf raises (use deficit) AU9 any; Standing DB calf Raises (Use Deficit) AU10 any |
| KB | thin | 1 | Standing Calf raises (use deficit) AU9 any; [same_pattern] weighted calf raises (OBSERVED); [same_pattern] Single-leg deficit calf raise on a plate/ramp/step (bodyweight or DB) (COACH-ANSWER); [zone_shift] Ankle Hops (as a calf accessory) (OBSERVED) |
| BW | thin | 1 | Standing Calf raises (use deficit) AU9 any; [same_pattern] Single-leg deficit calf raise on a plate/ramp/step (bodyweight or DB) (COACH-ANSWER); [zone_shift] Ankle Hops (as a calf accessory) (OBSERVED) |
| HOTEL | full | 3 | Calf Raises w/ DB AU11 any; Standing Calf raises (use deficit) AU9 any; Standing DB calf Raises (Use Deficit) AU10 any |
| FIELD | thin | 1 | Standing Calf raises (use deficit) AU9 any; [same_pattern] Single-leg deficit calf raise on a plate/ramp/step (bodyweight or DB) (COACH-ANSWER); [zone_shift] Ankle Hops (as a calf accessory) (OBSERVED) |
| F-NOKIT | thin | 1 | Standing Calf raises (use deficit) AU9 any; [same_pattern] Single-leg deficit calf raise on a plate/ramp/step (bodyweight or DB) (COACH-ANSWER); [zone_shift] Ankle Hops (as a calf accessory) (OBSERVED) |

**FBS_CHOP_ANTIROT** - coach labels (not wired to any program dropdown); library BC (FUNCTIONAL BIOMECHANICS SYSTEM)

| Profile | Status | As written | Ordered options (first 6; * = operative level differs from library level) |
|---|---|---|---|
| FAC | full | 9 | Hold object Adducted between knees rotational crunch chop down BC9 F; Hold object Adducted between knees kneeling cable crunch down BC10 F; Hold object Adducted between knees floor supine cable anti-rotational pallof hold BC46 F; Hold object Adducted between knees, kneeling cable anti-rotational pallof hold BC47 F; Supine offset plank with contralateral cable adduction BC91 F; Hold object Adducted between knees rotational crunch chop midline BC13 I (+3 more) |
| FULL | full | 9 | Hold object Adducted between knees rotational crunch chop down BC9 F; Hold object Adducted between knees kneeling cable crunch down BC10 F; Hold object Adducted between knees floor supine cable anti-rotational pallof hold BC46 F; Hold object Adducted between knees, kneeling cable anti-rotational pallof hold BC47 F; Supine offset plank with contralateral cable adduction BC91 F; Hold object Adducted between knees rotational crunch chop midline BC13 I (+3 more) |
| BASIC | full | 9 | Hold object Adducted between knees rotational crunch chop down BC9 F; Hold object Adducted between knees kneeling cable crunch down BC10 F; Hold object Adducted between knees floor supine cable anti-rotational pallof hold BC46 F; Hold object Adducted between knees, kneeling cable anti-rotational pallof hold BC47 F; Supine offset plank with contralateral cable adduction BC91 F; Hold object Adducted between knees rotational crunch chop midline BC13 I (+3 more) |
| H-BB | substitute_only | 0 | [partial] Dead bug or crunch with a ball/pillow squeezed between the knees (INFERRED); [partial] dead bugs (OBSERVED); [partial] bird dogs (OBSERVED); [partial] offset planks (OBSERVED) |
| H-DB | substitute_only | 0 | [partial] Dead bug or crunch with a ball/pillow squeezed between the knees (INFERRED); [partial] dead bugs (OBSERVED); [partial] bird dogs (OBSERVED); [partial] offset planks (OBSERVED) |
| KB | substitute_only | 0 | [partial] Dead bug or crunch with a ball/pillow squeezed between the knees (INFERRED); [partial] dead bugs (OBSERVED); [partial] bird dogs (OBSERVED); [partial] offset planks (OBSERVED) |
| BW | substitute_only | 0 | [partial] Dead bug or crunch with a ball/pillow squeezed between the knees (INFERRED); [partial] dead bugs (OBSERVED); [partial] bird dogs (OBSERVED); [partial] offset planks (OBSERVED) |
| HOTEL | substitute_only | 0 | [partial] Dead bug or crunch with a ball/pillow squeezed between the knees (INFERRED); [partial] dead bugs (OBSERVED); [partial] bird dogs (OBSERVED); [partial] offset planks (OBSERVED) |
| FIELD | substitute_only | 0 | [partial] Dead bug or crunch with a ball/pillow squeezed between the knees (INFERRED); [partial] dead bugs (OBSERVED); [partial] bird dogs (OBSERVED); [partial] offset planks (OBSERVED); [partial] Medball chop (Med ball from hands) (OBSERVED) |
| F-NOKIT | substitute_only | 0 | [partial] dead bugs (OBSERVED); [partial] bird dogs (OBSERVED); [partial] offset planks (OBSERVED) |

**FUNCTIONAL_CARRY** - coach labels (stub, no exercises); library BA 'CARRY' (labels only)

| Profile | Status | As written | Ordered options (first 6; * = operative level differs from library level) |
|---|---|---|---|
| FAC | substitute_only | 0 | [same_pattern] Farmer carry (2 DB/KB) / suitcase carry (1 DB/KB) / front-rack carry (INFERRED); [same_pattern] Farmer-handle carry (COACH-ANSWER); [same_pattern] Trap-bar carry (COACH-ANSWER); [same_pattern] Sandbag bear-hug carry (COACH-ANSWER); [partial] Medball hug carry (INFERRED); [partial] Loaded backpack / water-jug carry (INFERRED) |
| FULL | substitute_only | 0 | [same_pattern] Farmer carry (2 DB/KB) / suitcase carry (1 DB/KB) / front-rack carry (INFERRED); [same_pattern] Trap-bar carry (COACH-ANSWER); [same_pattern] Sandbag bear-hug carry (COACH-ANSWER); [partial] Medball hug carry (INFERRED); [partial] Loaded backpack / water-jug carry (INFERRED) |
| BASIC | substitute_only | 0 | [same_pattern] Farmer carry (2 DB/KB) / suitcase carry (1 DB/KB) / front-rack carry (INFERRED); [partial] Medball hug carry (INFERRED); [partial] Loaded backpack / water-jug carry (INFERRED) |
| H-BB | substitute_only | 0 | [same_pattern] Farmer carry (2 DB/KB) / suitcase carry (1 DB/KB) / front-rack carry (INFERRED); [partial] Loaded backpack / water-jug carry (INFERRED) |
| H-DB | substitute_only | 0 | [same_pattern] Farmer carry (2 DB/KB) / suitcase carry (1 DB/KB) / front-rack carry (INFERRED); [partial] Loaded backpack / water-jug carry (INFERRED) |
| KB | substitute_only | 0 | [same_pattern] Farmer carry (2 DB/KB) / suitcase carry (1 DB/KB) / front-rack carry (INFERRED); [partial] Loaded backpack / water-jug carry (INFERRED) |
| BW | substitute_only | 0 | [partial] Loaded backpack / water-jug carry (INFERRED) |
| HOTEL | substitute_only | 0 | [same_pattern] Farmer carry (2 DB/KB) / suitcase carry (1 DB/KB) / front-rack carry (INFERRED); [partial] Loaded backpack / water-jug carry (INFERRED) |
| FIELD | substitute_only | 0 | [partial] Medball hug carry (INFERRED); [partial] Loaded backpack / water-jug carry (INFERRED) |
| F-NOKIT | gap | 0 |  |

**FUNCTIONAL_DRAG** - coach labels (stub, no exercises); library BB 'DRAGS' (labels only)

| Profile | Status | As written | Ordered options (first 6; * = operative level differs from library level) |
|---|---|---|---|
| FAC | substitute_only | 0 | [same_pattern] Sled push/drag forwards-backwards (SAGITAL) and lateral (FRONTAL) (INFERRED); [partial] Plate on a towel push (INFERRED) |
| FULL | substitute_only | 0 | [same_pattern] Sled push/drag forwards-backwards (SAGITAL) and lateral (FRONTAL) (INFERRED); [partial] Plate on a towel push (INFERRED) |
| BASIC | substitute_only | 0 | [partial] Plate on a towel push (INFERRED) |
| H-BB | substitute_only | 0 | [partial] Plate on a towel push (INFERRED) |
| H-DB | gap | 0 |  |
| KB | gap | 0 |  |
| BW | gap | 0 |  |
| HOTEL | gap | 0 |  |
| FIELD | gap | 0 |  |
| F-NOKIT | gap | 0 |  |

**FOCUS_QUADS** - coach labels 'Focus 1', 'Focus 2'; library AZ7:AZ335 (FULL FOCUS LIST, group 'QUADS 👇')

| Profile | Status | As written | Ordered options (first 6; * = operative level differs from library level) |
|---|---|---|---|
| FAC | full | 8 | Leg extensions AZ16 any; Leg press AZ10 any; Stationary Lunges AZ14 any; Zercher squats AZ11 any; Goblet squats heels elevated AZ9 any; Walking Lunges AZ13 any (+2 more) |
| FULL | full | 8 | Leg extensions AZ16 any; Leg press AZ10 any; Stationary Lunges AZ14 any; Zercher squats AZ11 any; Goblet squats heels elevated AZ9 any; Walking Lunges AZ13 any (+2 more) |
| BASIC | full | 8 | Leg extensions AZ16 any; Leg press AZ10 any; Stationary Lunges AZ14 any; Zercher squats AZ11 any; Goblet squats heels elevated AZ9 any; Walking Lunges AZ13 any (+2 more) |
| H-BB | full | 6 | Stationary Lunges AZ14 any; Zercher squats AZ11 any; Goblet squats heels elevated AZ9 any; Walking Lunges AZ13 any; Bulgarian Split squats AZ15 any; Back squats AZ12 any |
| H-DB | full | 4 | Stationary Lunges AZ14 any; Goblet squats heels elevated AZ9 any; Walking Lunges AZ13 any; Bulgarian Split squats AZ15 any |
| KB | full | 4 | Stationary Lunges AZ14 any; Goblet squats heels elevated AZ9 any; Walking Lunges AZ13 any; Bulgarian Split squats AZ15 any |
| BW | full | 3 | Stationary Lunges AZ14 any; Walking Lunges AZ13 any; Bulgarian Split squats AZ15 any |
| HOTEL | full | 4 | Stationary Lunges AZ14 any; Goblet squats heels elevated AZ9 any; Walking Lunges AZ13 any; Bulgarian Split squats AZ15 any |
| FIELD | full | 3 | Stationary Lunges AZ14 any; Walking Lunges AZ13 any; Bulgarian Split squats AZ15 any |
| F-NOKIT | full | 3 | Stationary Lunges AZ14 any; Walking Lunges AZ13 any; Bulgarian Split squats AZ15 any |

**FOCUS_HAMSTRINGS** - coach labels 'Focus 1', 'Focus 2'; library AZ7:AZ335 (FULL FOCUS LIST, group 'HAMSTRINGS 👇')

| Profile | Status | As written | Ordered options (first 6; * = operative level differs from library level) |
|---|---|---|---|
| FAC | full | 8 | Leg curls AZ211 any; Lying leg curls AZ212 any; Hyperextensions AZ207 any; Hip thrusts/ Glute bridges AZ208 any; Staggered stance DL AZ209 any; DB deadlifts AZ205 any (+2 more) |
| FULL | full | 8 | Leg curls AZ211 any; Lying leg curls AZ212 any; Hyperextensions AZ207 any; Hip thrusts/ Glute bridges AZ208 any; Staggered stance DL AZ209 any; DB deadlifts AZ205 any (+2 more) |
| BASIC | full | 8 | Leg curls AZ211 any; Lying leg curls AZ212 any; Hyperextensions AZ207 any; Hip thrusts/ Glute bridges AZ208 any; Staggered stance DL AZ209 any; DB deadlifts AZ205 any (+2 more) |
| H-BB | full | 5 | Hip thrusts/ Glute bridges AZ208 any; Staggered stance DL AZ209 any; DB deadlifts AZ205 any; Barbell deadlifts AZ206 any; Foot on wall db DL AZ210 any |
| H-DB | full | 4 | Hip thrusts/ Glute bridges AZ208 any; Staggered stance DL AZ209 any; DB deadlifts AZ205 any; Foot on wall db DL AZ210 any |
| KB | thin | 2 | Hip thrusts/ Glute bridges AZ208 any; Staggered stance DL AZ209 any; [same_pattern] Glidder hamstring runners (OBSERVED); [same_pattern] Single-leg slider curl (towel) (INFERRED); [same_pattern] Nordic curl, eccentric-only / hands-assisted (push off the floor at the bottom) (INFERRED); [rule] Add +2 sets to the session's hinge (hamstrings still get hip-extension volume) (INFERRED) (+4 more) |
| BW | thin | 1 | Hip thrusts/ Glute bridges AZ208 any; [same_pattern] Glidder hamstring runners (OBSERVED); [same_pattern] Single-leg slider curl (towel) (INFERRED); [same_pattern] Nordic curl, eccentric-only / hands-assisted (push off the floor at the bottom) (INFERRED); [rule] Add +2 sets to the session's hinge (hamstrings still get hip-extension volume) (INFERRED); [partial] Backpack or water-jug deadlift / hip thrust (INFERRED) (+2 more) |
| HOTEL | full | 4 | Hip thrusts/ Glute bridges AZ208 any; Staggered stance DL AZ209 any; DB deadlifts AZ205 any; Foot on wall db DL AZ210 any |
| FIELD | thin | 1 | Hip thrusts/ Glute bridges AZ208 any; [same_pattern] Glidder hamstring runners (OBSERVED); [same_pattern] Single-leg slider curl (towel) (INFERRED); [same_pattern] Nordic curl, eccentric-only / hands-assisted (push off the floor at the bottom) (INFERRED); [rule] Add +2 sets to the session's hinge (hamstrings still get hip-extension volume) (INFERRED); [partial] Backpack or water-jug deadlift / hip thrust (INFERRED) (+2 more) |
| F-NOKIT | thin | 1 | Hip thrusts/ Glute bridges AZ208 any; [same_pattern] Glidder hamstring runners (OBSERVED); [same_pattern] Single-leg slider curl (towel) (INFERRED); [same_pattern] Nordic curl, eccentric-only / hands-assisted (push off the floor at the bottom) (INFERRED); [rule] Add +2 sets to the session's hinge (hamstrings still get hip-extension volume) (INFERRED); [partial] SL glute bridges (heel on bench) (OBSERVED) (+1 more) |

**FOCUS_GLUTES** - coach labels 'Focus 1', 'Focus 2'; library AZ7:AZ335 (FULL FOCUS LIST, group 'GLUTES 👇')

| Profile | Status | As written | Ordered options (first 6; * = operative level differs from library level) |
|---|---|---|---|
| FAC | full | 2 | Single leg Glute bridge AZ165 any; Barbell hip thrust AZ166 any; [same_pattern] KB swing (OBSERVED-lib); [partial] heavy rear foot on wall db deadlift (OBSERVED); [partial] Backpack or water-jug deadlift / hip thrust (INFERRED); [partial] SL glute bridges (heel on bench) (OBSERVED) (+5 more) |
| FULL | full | 2 | Single leg Glute bridge AZ165 any; Barbell hip thrust AZ166 any; [same_pattern] KB swing (OBSERVED-lib); [partial] heavy rear foot on wall db deadlift (OBSERVED); [partial] Backpack or water-jug deadlift / hip thrust (INFERRED); [partial] SL glute bridges (heel on bench) (OBSERVED) (+5 more) |
| BASIC | full | 2 | Single leg Glute bridge AZ165 any; Barbell hip thrust AZ166 any; [same_pattern] KB swing (OBSERVED-lib); [partial] heavy rear foot on wall db deadlift (OBSERVED); [partial] Backpack or water-jug deadlift / hip thrust (INFERRED); [partial] SL glute bridges (heel on bench) (OBSERVED) (+5 more) |
| H-BB | full | 2 | Single leg Glute bridge AZ165 any; Barbell hip thrust AZ166 any; [partial] heavy rear foot on wall db deadlift (OBSERVED); [partial] Backpack or water-jug deadlift / hip thrust (INFERRED); [partial] SL glute bridges (heel on bench) (OBSERVED); [partial] Bodyweight single-leg RDL with reach (INFERRED) (+3 more) |
| H-DB | thin | 1 | Single leg Glute bridge AZ165 any; [partial] heavy rear foot on wall db deadlift (OBSERVED); [partial] Backpack or water-jug deadlift / hip thrust (INFERRED); [partial] SL glute bridges (heel on bench) (OBSERVED); [partial] Bodyweight single-leg RDL with reach (INFERRED); [same_pattern] staggered stance db deadlift (OBSERVED) (+2 more) |
| KB | thin | 1 | Single leg Glute bridge AZ165 any; [same_pattern] KB swing (OBSERVED-lib); [partial] Backpack or water-jug deadlift / hip thrust (INFERRED); [partial] SL glute bridges (heel on bench) (OBSERVED); [partial] Bodyweight single-leg RDL with reach (INFERRED); [same_pattern] Staggered-stance KB deadlift (contralateral) (INFERRED) (+1 more) |
| BW | thin | 1 | Single leg Glute bridge AZ165 any; [partial] Backpack or water-jug deadlift / hip thrust (INFERRED); [partial] SL glute bridges (heel on bench) (OBSERVED); [partial] Bodyweight single-leg RDL with reach (INFERRED); [same_pattern] SL hip thurts march (OBSERVED) |
| HOTEL | thin | 1 | Single leg Glute bridge AZ165 any; [partial] heavy rear foot on wall db deadlift (OBSERVED); [partial] Backpack or water-jug deadlift / hip thrust (INFERRED); [partial] SL glute bridges (heel on bench) (OBSERVED); [partial] Bodyweight single-leg RDL with reach (INFERRED); [same_pattern] staggered stance db deadlift (OBSERVED) (+2 more) |
| FIELD | thin | 1 | Single leg Glute bridge AZ165 any; [partial] Backpack or water-jug deadlift / hip thrust (INFERRED); [partial] SL glute bridges (heel on bench) (OBSERVED); [partial] Bodyweight single-leg RDL with reach (INFERRED); [same_pattern] SL hip thurts march (OBSERVED) |
| F-NOKIT | thin | 1 | Single leg Glute bridge AZ165 any; [partial] SL glute bridges (heel on bench) (OBSERVED); [partial] Bodyweight single-leg RDL with reach (INFERRED); [same_pattern] SL hip thurts march (OBSERVED) |

**FOCUS_BACK** - coach labels 'Focus 1', 'Focus 2'; library AZ7:AZ335 (FULL FOCUS LIST, group 'BACK 👇')

| Profile | Status | As written | Ordered options (first 6; * = operative level differs from library level) |
|---|---|---|---|
| FAC | full | 6 | machine rows AZ95 any; lat pull down AZ92 any; assisted pull ups AZ91 any; Cable rows AZ94 any; Db rows AZ93 any; Pull ups AZ90 any |
| FULL | full | 6 | machine rows AZ95 any; lat pull down AZ92 any; assisted pull ups AZ91 any; Cable rows AZ94 any; Db rows AZ93 any; Pull ups AZ90 any |
| BASIC | full | 6 | machine rows AZ95 any; lat pull down AZ92 any; assisted pull ups AZ91 any; Cable rows AZ94 any; Db rows AZ93 any; Pull ups AZ90 any |
| H-BB | thin | 2 | Db rows AZ93 any; Pull ups AZ90 any; [same_pattern] Bent over db or kb row (OBSERVED); [same_pattern] Single arm Db Row (OBSERVED); [same_pattern] Chest-supported DB row on an incline bench (seal-row stand-in) (INFERRED); [same_pattern] ... or Bird Dog Row (DB/KB, hand and knee on a bench) (OBSERVED) (+8 more) |
| H-DB | thin | 1 | Db rows AZ93 any; [same_pattern] Bent over db or kb row (OBSERVED); [same_pattern] Single arm Db Row (OBSERVED); [same_pattern] Chest-supported DB row on an incline bench (seal-row stand-in) (INFERRED); [same_pattern] ... or Bird Dog Row (DB/KB, hand and knee on a bench) (OBSERVED); [partial] Inverted row under a sturdy table (INFERRED) (+4 more) |
| KB | substitute_only | 0 | [same_pattern] Bent over db or kb row (OBSERVED); [same_pattern] ... or Bird Dog Row (DB/KB, hand and knee on a bench) (OBSERVED); [same_pattern] Kong row (double-KB row from the floor) (OBSERVED); [partial] Inverted row under a sturdy table (INFERRED); [partial] Towel row on a door frame (door closed, towel round the handles) (INFERRED); [partial] KB pullover on the floor (INFERRED) (+2 more) |
| BW | substitute_only | 0 | [partial] Inverted row under a sturdy table (INFERRED); [partial] Towel row on a door frame (door closed, towel round the handles) (INFERRED); [pattern_gap] Inverted row under a sturdy table (a horizontal pull) (INFERRED); [pattern_gap] Add 1-2 sets to the session's horizontal pull (INFERRED) |
| HOTEL | thin | 1 | Db rows AZ93 any; [same_pattern] Bent over db or kb row (OBSERVED); [same_pattern] Single arm Db Row (OBSERVED); [same_pattern] Chest-supported DB row on an incline bench (seal-row stand-in) (INFERRED); [same_pattern] ... or Bird Dog Row (DB/KB, hand and knee on a bench) (OBSERVED); [partial] Inverted row under a sturdy table (INFERRED) (+4 more) |
| FIELD | substitute_only | 0 | [partial] Inverted row under a sturdy table (INFERRED); [partial] Towel row on a door frame (door closed, towel round the handles) (INFERRED); [pattern_gap] Inverted row under a sturdy table (a horizontal pull) (INFERRED); [pattern_gap] Add 1-2 sets to the session's horizontal pull (INFERRED) |
| F-NOKIT | gap | 0 | [pattern_gap] Add 1-2 sets to the session's horizontal pull (INFERRED) |

**FOCUS_CHEST** - coach labels 'Focus 1', 'Focus 2'; library AZ7:AZ335 (FULL FOCUS LIST, group 'CHEST 👇')

| Profile | Status | As written | Ordered options (first 6; * = operative level differs from library level) |
|---|---|---|---|
| FAC | full | 4 | Cable flies AZ249 any; bench press AZ246 any; db bench press AZ247 any; DB flies AZ248 any |
| FULL | full | 4 | Cable flies AZ249 any; bench press AZ246 any; db bench press AZ247 any; DB flies AZ248 any |
| BASIC | full | 4 | Cable flies AZ249 any; bench press AZ246 any; db bench press AZ247 any; DB flies AZ248 any |
| H-BB | full | 3 | bench press AZ246 any; db bench press AZ247 any; DB flies AZ248 any |
| H-DB | thin | 2 | db bench press AZ247 any; DB flies AZ248 any; [same_pattern] offset pushups (OBSERVED) |
| KB | substitute_only | 0 | [same_pattern] KB floor press (INFERRED); [same_pattern] offset pushups (OBSERVED) |
| BW | substitute_only | 0 | [same_pattern] offset pushups (OBSERVED) |
| HOTEL | thin | 2 | db bench press AZ247 any; DB flies AZ248 any; [same_pattern] offset pushups (OBSERVED) |
| FIELD | substitute_only | 0 | [same_pattern] offset pushups (OBSERVED); [zone_shift] medball floor catch & release push (OBSERVED); [zone_shift] Push ups/chest pass (OBSERVED) |
| F-NOKIT | substitute_only | 0 | [same_pattern] offset pushups (OBSERVED) |

**FOCUS_SHOULDERS_TRAPS** - coach labels 'Focus 1', 'Focus 2'; library AZ7:AZ335 (FULL FOCUS LIST, group 'SHOULDERS/TRAPS 👇')

| Profile | Status | As written | Ordered options (first 6; * = operative level differs from library level) |
|---|---|---|---|
| FAC | full | 9 | Cable side raises AZ51 any; Incline db press AZ48 any; Incline barbell press AZ49 any; DB side raises AZ50 any; DB upright rows AZ52 any; Barbell upright rows AZ53 any (+3 more) |
| FULL | full | 9 | Cable side raises AZ51 any; Incline db press AZ48 any; Incline barbell press AZ49 any; DB side raises AZ50 any; DB upright rows AZ52 any; Barbell upright rows AZ53 any (+3 more) |
| BASIC | full | 9 | Cable side raises AZ51 any; Incline db press AZ48 any; Incline barbell press AZ49 any; DB side raises AZ50 any; DB upright rows AZ52 any; Barbell upright rows AZ53 any (+3 more) |
| H-BB | full | 8 | Incline db press AZ48 any; Incline barbell press AZ49 any; DB side raises AZ50 any; DB upright rows AZ52 any; Barbell upright rows AZ53 any; High incline db press AZ47 any (+2 more) |
| H-DB | full | 5 | Incline db press AZ48 any; DB side raises AZ50 any; DB upright rows AZ52 any; High incline db press AZ47 any; Bd overhead Press AZ45 any |
| KB | substitute_only | 0 | [same_pattern] Half-kneeling single-arm KB press (INFERRED); [same_pattern] Pike push-up, feet on a bench (progression of AA53) (INFERRED); [same_pattern] KB upright row (OBSERVED); [partial] Prone floor Y / T raises (INFERRED); [partial] Backpack or water-jug lateral raise (INFERRED) |
| BW | substitute_only | 0 | [same_pattern] Pike push-up, feet on a bench (progression of AA53) (INFERRED); [partial] Prone floor Y / T raises (INFERRED); [partial] Backpack or water-jug lateral raise (INFERRED) |
| HOTEL | full | 5 | Incline db press AZ48 any; DB side raises AZ50 any; DB upright rows AZ52 any; High incline db press AZ47 any; Bd overhead Press AZ45 any |
| FIELD | substitute_only | 0 | [zone_shift] medball press (OBSERVED); [same_pattern] Pike push-up, feet on a bench (progression of AA53) (INFERRED); [partial] Prone floor Y / T raises (INFERRED); [partial] Backpack or water-jug lateral raise (INFERRED) |
| F-NOKIT | substitute_only | 0 | [same_pattern] Pike push-up, feet on a bench (progression of AA53) (INFERRED); [partial] Prone floor Y / T raises (INFERRED) |

**FOCUS_BICEP** - coach labels 'Focus 1', 'Focus 2'; library AZ7:AZ335 (FULL FOCUS LIST, group 'BICEP 👇')

| Profile | Status | As written | Ordered options (first 6; * = operative level differs from library level) |
|---|---|---|---|
| FAC | full | 3 | cable bicep curls AZ314 any; Incline bench bicep curls AZ312 any; supine bicep curls AZ313 any |
| FULL | full | 3 | cable bicep curls AZ314 any; Incline bench bicep curls AZ312 any; supine bicep curls AZ313 any |
| BASIC | full | 3 | cable bicep curls AZ314 any; Incline bench bicep curls AZ312 any; supine bicep curls AZ313 any |
| H-BB | thin | 2 | Incline bench bicep curls AZ312 any; supine bicep curls AZ313 any; [same_pattern] Curls (any kind) (OBSERVED); [partial] Chin Ups (OBSERVED-lib); [pattern_gap] Backpack curl / towel-and-door isometric curl (INFERRED) |
| H-DB | thin | 2 | Incline bench bicep curls AZ312 any; supine bicep curls AZ313 any; [same_pattern] Curls (any kind) (OBSERVED); [pattern_gap] Backpack curl / towel-and-door isometric curl (INFERRED) |
| KB | substitute_only | 0 | [same_pattern] Curls (any kind) (OBSERVED); [same_pattern] KB curl (hammer / bottoms-up) (INFERRED); [pattern_gap] Backpack curl / towel-and-door isometric curl (INFERRED) |
| BW | gap | 0 | [pattern_gap] Backpack curl / towel-and-door isometric curl (INFERRED) |
| HOTEL | thin | 2 | Incline bench bicep curls AZ312 any; supine bicep curls AZ313 any; [same_pattern] Curls (any kind) (OBSERVED); [pattern_gap] Backpack curl / towel-and-door isometric curl (INFERRED) |
| FIELD | gap | 0 | [pattern_gap] Backpack curl / towel-and-door isometric curl (INFERRED) |
| F-NOKIT | gap | 0 |  |

**FOCUS_TRICEP** - coach labels 'Focus 1', 'Focus 2'; library AZ7:AZ335 (FULL FOCUS LIST, group 'TRICEP 👇')

| Profile | Status | As written | Ordered options (first 6; * = operative level differs from library level) |
|---|---|---|---|
| FAC | full | 5 | assisted dips AZ129 any; cable tricep extensions AZ126 any; cable overhead tricep ext AZ127 any; DB overhead tricep ext AZ125 any; dips AZ128 any |
| FULL | full | 5 | assisted dips AZ129 any; cable tricep extensions AZ126 any; cable overhead tricep ext AZ127 any; DB overhead tricep ext AZ125 any; dips AZ128 any |
| BASIC | full | 5 | assisted dips AZ129 any; cable tricep extensions AZ126 any; cable overhead tricep ext AZ127 any; DB overhead tricep ext AZ125 any; dips AZ128 any |
| H-BB | thin | 1 | DB overhead tricep ext AZ125 any; [same_pattern] Tricep (any kind) (OBSERVED); [partial] Diamond Push ups (OBSERVED-lib); [partial] Bench dips (hands on a chair/bench) (INFERRED); [partial] Bodyweight skull crusher on a table edge (INFERRED) |
| H-DB | thin | 1 | DB overhead tricep ext AZ125 any; [same_pattern] Tricep (any kind) (OBSERVED); [partial] Diamond Push ups (OBSERVED-lib); [partial] Bench dips (hands on a chair/bench) (INFERRED); [partial] Bodyweight skull crusher on a table edge (INFERRED) |
| KB | substitute_only | 0 | [same_pattern] Tricep (any kind) (OBSERVED); [same_pattern] KB overhead tricep extension (INFERRED); [partial] Diamond Push ups (OBSERVED-lib); [partial] Bench dips (hands on a chair/bench) (INFERRED); [partial] Bodyweight skull crusher on a table edge (INFERRED) |
| BW | substitute_only | 0 | [partial] Diamond Push ups (OBSERVED-lib); [partial] Bench dips (hands on a chair/bench) (INFERRED); [partial] Bodyweight skull crusher on a table edge (INFERRED) |
| HOTEL | thin | 1 | DB overhead tricep ext AZ125 any; [same_pattern] Tricep (any kind) (OBSERVED); [partial] Diamond Push ups (OBSERVED-lib); [partial] Bench dips (hands on a chair/bench) (INFERRED); [partial] Bodyweight skull crusher on a table edge (INFERRED) |
| FIELD | substitute_only | 0 | [partial] Diamond Push ups (OBSERVED-lib); [partial] Bench dips (hands on a chair/bench) (INFERRED); [partial] Bodyweight skull crusher on a table edge (INFERRED) |
| F-NOKIT | substitute_only | 0 | [partial] Diamond Push ups (OBSERVED-lib); [partial] Bench dips (hands on a chair/bench) (INFERRED) |

**FOCUS_CALVES** - coach labels 'Focus 1', 'Focus 2'; library AZ7:AZ335 (FULL FOCUS LIST, group 'CALVES 👇')

| Profile | Status | As written | Ordered options (first 6; * = operative level differs from library level) |
|---|---|---|---|
| FAC | full | 1 | DB Standing calf raises AZ332 any; [same_pattern] weighted calf raises (OBSERVED); [same_pattern] Single-leg deficit calf raise on a plate/ramp/step (bodyweight or DB) (COACH-ANSWER); [same_pattern] Seated DB calf raise (DB on the knees) (INFERRED); [zone_shift] Ankle Hops (as a calf accessory) (OBSERVED) |
| FULL | full | 1 | DB Standing calf raises AZ332 any; [same_pattern] weighted calf raises (OBSERVED); [same_pattern] Single-leg deficit calf raise on a plate/ramp/step (bodyweight or DB) (COACH-ANSWER); [same_pattern] Seated DB calf raise (DB on the knees) (INFERRED); [zone_shift] Ankle Hops (as a calf accessory) (OBSERVED) |
| BASIC | full | 1 | DB Standing calf raises AZ332 any; [same_pattern] weighted calf raises (OBSERVED); [same_pattern] Single-leg deficit calf raise on a plate/ramp/step (bodyweight or DB) (COACH-ANSWER); [same_pattern] Seated DB calf raise (DB on the knees) (INFERRED); [zone_shift] Ankle Hops (as a calf accessory) (OBSERVED) |
| H-BB | full | 1 | DB Standing calf raises AZ332 any; [same_pattern] weighted calf raises (OBSERVED); [same_pattern] Single-leg deficit calf raise on a plate/ramp/step (bodyweight or DB) (COACH-ANSWER); [same_pattern] Seated DB calf raise (DB on the knees) (INFERRED); [zone_shift] Ankle Hops (as a calf accessory) (OBSERVED) |
| H-DB | full | 1 | DB Standing calf raises AZ332 any; [same_pattern] weighted calf raises (OBSERVED); [same_pattern] Single-leg deficit calf raise on a plate/ramp/step (bodyweight or DB) (COACH-ANSWER); [same_pattern] Seated DB calf raise (DB on the knees) (INFERRED); [zone_shift] Ankle Hops (as a calf accessory) (OBSERVED) |
| KB | substitute_only | 0 | [same_pattern] weighted calf raises (OBSERVED); [same_pattern] Single-leg deficit calf raise on a plate/ramp/step (bodyweight or DB) (COACH-ANSWER); [zone_shift] Ankle Hops (as a calf accessory) (OBSERVED) |
| BW | substitute_only | 0 | [same_pattern] Single-leg deficit calf raise on a plate/ramp/step (bodyweight or DB) (COACH-ANSWER); [zone_shift] Ankle Hops (as a calf accessory) (OBSERVED) |
| HOTEL | full | 1 | DB Standing calf raises AZ332 any; [same_pattern] weighted calf raises (OBSERVED); [same_pattern] Single-leg deficit calf raise on a plate/ramp/step (bodyweight or DB) (COACH-ANSWER); [same_pattern] Seated DB calf raise (DB on the knees) (INFERRED); [zone_shift] Ankle Hops (as a calf accessory) (OBSERVED) |
| FIELD | substitute_only | 0 | [same_pattern] Single-leg deficit calf raise on a plate/ramp/step (bodyweight or DB) (COACH-ANSWER); [zone_shift] Ankle Hops (as a calf accessory) (OBSERVED) |
| F-NOKIT | substitute_only | 0 | [same_pattern] Single-leg deficit calf raise on a plate/ramp/step (bodyweight or DB) (COACH-ANSWER); [zone_shift] Ankle Hops (as a calf accessory) (OBSERVED) |

**FOCUS_CORE** - coach labels 'Focus 1', 'Focus 2'; library AZ7:AZ335 (FULL FOCUS LIST, group 'CORE 👇')

| Profile | Status | As written | Ordered options (first 6; * = operative level differs from library level) |
|---|---|---|---|
| FAC | full | 3 | weighted decline situps AZ286 any; Weighted situps AZ285 any; Weighted russian twists AZ287 any |
| FULL | full | 3 | weighted decline situps AZ286 any; Weighted situps AZ285 any; Weighted russian twists AZ287 any |
| BASIC | full | 3 | weighted decline situps AZ286 any; Weighted situps AZ285 any; Weighted russian twists AZ287 any |
| H-BB | thin | 2 | Weighted situps AZ285 any; Weighted russian twists AZ287 any; [same_pattern] windshield wipers (OBSERVED); [same_pattern] Hip turns (OBSERVED); [same_pattern] floor windshield whipers (OBSERVED); [same_pattern] heavy plate russian twists (OBSERVED) |
| H-DB | thin | 2 | Weighted situps AZ285 any; Weighted russian twists AZ287 any; [same_pattern] windshield wipers (OBSERVED); [same_pattern] Hip turns (OBSERVED); [same_pattern] floor windshield whipers (OBSERVED); [same_pattern] heavy plate russian twists (OBSERVED) |
| KB | substitute_only | 0 | [same_pattern] windshield wipers (OBSERVED); [same_pattern] Hip turns (OBSERVED); [same_pattern] floor windshield whipers (OBSERVED); [same_pattern] heavy plate russian twists (OBSERVED) |
| BW | substitute_only | 0 | [same_pattern] windshield wipers (OBSERVED); [same_pattern] Hip turns (OBSERVED); [same_pattern] floor windshield whipers (OBSERVED) |
| HOTEL | thin | 2 | Weighted situps AZ285 any; Weighted russian twists AZ287 any; [same_pattern] windshield wipers (OBSERVED); [same_pattern] Hip turns (OBSERVED); [same_pattern] floor windshield whipers (OBSERVED); [same_pattern] heavy plate russian twists (OBSERVED) |
| FIELD | thin | 2 | Weighted situps AZ285 any; Weighted russian twists AZ287 any; [same_pattern] windshield wipers (OBSERVED); [same_pattern] Hip turns (OBSERVED); [same_pattern] floor windshield whipers (OBSERVED); [same_pattern] heavy plate russian twists (OBSERVED) (+1 more) |
| F-NOKIT | substitute_only | 0 | [same_pattern] windshield wipers (OBSERVED); [same_pattern] Hip turns (OBSERVED); [same_pattern] floor windshield whipers (OBSERVED) |

### 3.5 Substitutions the coach wrote himself (OBSERVED)

The coach writes swaps into the cells as 'X or Y'. These are the first choice whenever a slot's implement is missing (10b EQ-7 step 1), with two v1 limits: the first-written option is not automatically the default (pick by client, and the client's preference can decide, EQ-10), and band routes are never used (EQ-01). Full list in `coach_alternates`. The most frequent:

| Text (verbatim) | Kind | Cells (MM) | n |
|---|---|---|---|
| Machine Dips or dips | implement swap (same movement) | MM 04:O38, MM 04:P38, MM 04:P54 | 20 |
| Any Cardio Equipment | free choice | MM 00:C13, MM 00:C27, MM 00:G13 | 15 |
| machine or db flies | implement swap (same movement) | MM 04:P37, MM 04:P53, MM 04:R37 | 12 |
| machine rows or db rows | implement swap (same movement) | MM 04:P47, MM 04:P63, MM 04:R47 | 12 |
| LAT PULL DOWN/PULL UP | slash alternate (same movement family) | MM 01:J13, MM 01:J25, MM 01:M12 | 9 |
| machine or db Reverse flies | implement swap (same movement) | MM 04:W48, MM 04:W64, MM 04:X48 | 8 |
| Ez bar curls or barbell | implement swap (same movement) | MM 04:W50, MM 04:W66, MM 04:X50 | 8 |
| Sqats or Leg Press | implement swap (same movement) | MM 00:C17, MM 00:G17, MM 00:K17 | 6 |
| Deadlifts (DB or Barbell) | implement swap (same movement) | MM 00:C18, MM 00:G18, MM 00:K18 | 6 |
| Reverse Lunges (Bodyweight or DBs) | implement swap (same movement) | MM 00:C19, MM 00:G19, MM 00:K19 | 6 |
| Cable or DB side raises | implement swap (same movement) | MM 04:W35, MM 04:W51, MM 04:Y35 | 4 |
| leg press or just add 2 more rounds to front squats | implement swap (same movement) | MM 04:W42, MM 04:X42, MM 04:Y42 | 4 |
| machine rows or db rows (5 sets - 15/12/12/12/10) | implement swap (same movement) | MM 04:W63, MM 04:X63, MM 04:Y63 | 4 |
| Bench Press (DB or Barbell) | implement swap (same movement) | MM 00:C29, MM 00:G29, MM 00:K29 | 3 |
| Pull ups or Lat pull down | implement swap (same movement) | MM 00:C30, MM 00:G30, MM 00:K30 | 3 |
| Overhead Press (DB or Barbell) | implement swap (same movement) | MM 00:C31, MM 00:G31, MM 00:K31 | 3 |
| Curls (any kind) | free choice | MM 00:C32, MM 00:G32, MM 00:K32 | 3 |
| Tricep (any kind) | free choice | MM 00:C33, MM 00:G33, MM 00:K33 | 3 |
| DB Rows or Row machine | implement swap (same movement) | MM 06:C26, MM 06:G26, MM 06:K26 | 3 |
| DB Reverse Flies or Machine | implement swap (same movement) | MM 06:C27, MM 06:G27, MM 06:K27 | 3 |
| RDL/Good morning | slash alternate (same movement family) | MM 04:Q18, MM 04:S18, MM 04:U18 | 3 |
| toes to bar or knees to chest | variant swap (same implement) | MM 02:AP67, MM 02:J31, MM 02:J67 | 3 |
| 3x 10 cal row sprint or ski | implement swap (same movement) | MM 02:AA39, MM 02:BW75, MM 02:DG74 | 3 |
| Fast run/ walk back or 3 min walk/rest - This is NOT a sprint, this is a fast run | recovery-mode alternative (not equipment) | MM 02:CC48, MM 02:DI29, MM 02:DL47 | 3 |

Also OBSERVED in the reference tabs: 'Double kb or Db' (RP!C30), '(rings/trx/barbell/smith machine)' (RP!G64), 'Foam roller or swiss ball wall assisted goblet' (RP!A12), 'HEAVY Single arm rotational half kneeling cable row or band row or Bird Dog Row' (MM 05!C16: a cable → band → bodyweight ladder in one cell; v1 keeps the cable and Bird Dog routes), 'pull ups or banded assisted pull ups' (MM BASEBALL!CG53; v1 keeps the pull-ups), and 'leg press or just add 2 more rounds to front squats' (MM 4 TRACKS!W42:Z42: a missing machine becomes extra sets of the free-weight lift - now the fallback after the EQ-08 swap).

## 4. Session equipment / intent sequencing

The coach's sentence: "Some workouts go: equipment for power first (athletics), then the power-strength training, then strength training, then the resistance movements / resistance patterns" (COACH-CHAT; ORD-03 RIGHT). It is written literally into the BYOP athletic skeleton: `NO ACCESS - ATHLETIC - FB - 4 t`!C3:D12 'Plyo', 'Plyo', 'Throwing', 'COD', 'Tripple Extension', 'Bilateral KD', 'Horizontal Pull', 'Unilateral KD', 'Vertical Pull', 'Leg Extensions'. The only fully filled athletic day (JUSTICE LEAGUE!E3:E12 - "Justice League" was only a marketing name for a non-competitive athletic program, ATH-13; in this file the tab name is a cell citation only, and the generator calls the program 'All-around athletic / weekend warrior (non-competitive adults and youth)', profile `weekend_warrior` as in 01/04, per FIX-03; elsewhere in the tab only E13 'SL Depth Drops' and E35 'Low Bar Back Squat' are chosen) runs 'Medium Depth Drop' → 'Ankle Hops ' → 'Situps to overhead throw' → 'DIG/OUT' → 'Power Clean' → 'Front Squats' → 'Cable Machine UL Rows' → 'Front Foot Elevated Lunges (FFE)' → 'Stricted Pull-ups feet in front ' → 'Leg Extensions'. Its constraint by position is 1,1,3,1,1,2,3,1,1,5 on the BYOP program rubric (1,1,3,1,2,2,3,2,1,5 on the canonical scale of `exercise_index`) and its reps are 6-8 → 8-12 → MYO. **v1:** core now opens the session after the warm-up (ATH-11); field athletes off-season may reach 10-12 exercises (about 2 core + 2-4 plyo/ballistic + 2-3 Olympic/power + 3-4 resistance, VOL-08/VOL-17), resistance-only sessions about 5-7.

| # | Tier | Buckets | Implements | Constraint | Velocity zone | Load / reps observed | Evidence |
|---|---|---|---|---|---|---|---|
| 0 | PREP (always) | WARMUP_GENERAL, WARMUP_PREP | any cardio equipment, KB, medball (warm-up drills; the only medball use for aesthetics, ATH-05), bodyweight | n/a | warm-up |  | COACH-ANSWER ORD-08 - RIGHT: always a warm-up (5 min any cardio + A March/Skip/Run or mobility); A-drills do not count as volume / OBSERVED 'Any Cardio Equipment' 1 x '5 Minutes' opens every UL/PPL session (MM EXAMPLE UPPERLOWER SPLIT!C13) |
| 0b | CORE (default: first, right after the warm-up; the client may move it after the plyos or after strength) | CORE_ANY | bodyweight, medball, cable, plate | 2-3 | core as part of the warm-up; about 2 core exercises |  | COACH-ANSWER ATH-11 (NOT RIGHT to 'core after the power block'): 'we need all the core work to be done first ... start with the core work that'll give you a good warm-up ... if they want to be able to move the core work to after the plyos or after the strength, that's fine too' / COACH-ANSWER VOL-17: 'Usually, about 2 core exercises, then we get into the plyo work' |
| 1 | REACTIVE / ELASTIC (speed/power, lower) | AP_PLYO | bodyweight, box/step (low 6-12 in, medium 12-18 in, high above hip), plate target, hurdles (6 in moderate, 12 in+ advanced) | 1 | reactive / starting speed | bodyweight (EASY) | OBSERVED BYOP athletic rows 1-2 'Plyo'; BASEBALL Part A 'Upper Ballistics/plyo' / 'LOWER ballistics/plyo' (170/177 T1) / OBSERVED landing/stick before reactive in 11/13 sessions; COACH-ANSWER CAT-10: receive and pause first, then receive and create, then repeated receive/create |
| 2 | BALLISTIC UPPER / TRUNK | AP_THROW | medball (8-10 lb passes/rotations; never over 20 lb), slam ball (10-20 lb), wall/partner | 1-3 | speed-strength | 8-10 lb passes/rotations (COACH-CHAT); overhead 6-10, sit-up 6-8, slams 10-20 lb (COACH-ANSWER EQ-06) | OBSERVED BYOP 'Throwing' after 'Plyo' / COACH-ANSWER ATH-05: not used in the main workout for aesthetics |
| 3 | CHANGE OF DIRECTION / SPRINT | AP_COD | field, cones | 1 | starting strength / speed | 2 x '6 to 8 Reps' 'DIG/OUT' (JUSTICE LEAGUE E6:G6) | OBSERVED BYOP 'COD' after 'Throwing' (the only place COD is programmed) / COACH-ANSWER ATH-06: route names for every athlete, tiered by turn angle |
| 4 | POWER-STRENGTH (triple extension / Olympic / loaded ballistic) | AP_TRIPLE_EXT, loaded jumps, KB swings, dynamic effort | barbell (+bumpers for the full lifts), hex bar, kettlebell, dumbbell | 1-2 | strength-speed | 'Hang cleans @ 75%' 4x8 -> '@ 80%' 4x6 -> '@ 85%' 4x6 -> '@ 90%' 4x4 (MM BASEBALL OPTIONAL PIECE rows; PER-09 RIGHT); 'FAST RPE6 or about 60-70%' (MM 4 TRACKS!N17); loaded jumps 10-20% BW (EQ-15) | OBSERVED BYOP 'Tripple Extension' is the last athletic slot (12/12) / OBSERVED BASEBALL 'OPTIONAL PIECE' 'OLY' rows sit after Part B core and before Part C (24/24) |
| 5 | STRENGTH (bilateral main lift + first upper compound = the HORIZONTAL vector, zone 2) | RP_BKD, RP_BHD, RP_HPULL, RP_HPUSH | barbell, hex bar, dumbbell, leg press / belt squat on the non-axial day (CR-29) | 2 (athletes/strength) - 3-5 (hypertrophy/older) | absolute / accelerative strength | '1RIR' / 'HEAVY ...' (MM 4 TRACKS!E9); 'STRENGTH FOCUSED WORKOUTS (1 RIR) RPE 8+' (ALL ABOUT SQUATS!D13) | OBSERVED BYOP resistance slots 1-2 always pair the bilateral lower lift with the HORIZONTAL vector (29 vs 2) / OBSERVED BASEBALL Part C 'bkd'/'bhd' + 'horiz pull'/'horiz push'/'vert pull'/'vert push' |
| 6 | RESISTANCE PATTERNS (unilateral lower + VERTICAL upper, zone 3) | RP_UKD, RP_UHD, RP_VPULL, RP_VPUSH | dumbbell, cable, bodyweight, kettlebell | 1-4 | accelerative strength / hypertrophy | 2 x '8 to 12 Reps' ('Cable Machine UL Rows', 'Front Foot Elevated Lunges (FFE)', 'Stricted Pull-ups feet in front ', JUSTICE LEAGUE E9:E11) | OBSERVED BYOP unilateral lower sits with the vertical vector (24 vs 2) / OBSERVED BASEBALL Part D 'uhd'/'ukd' + 'bicep'/'tricep'/'calfs'/'shoulders' |
| 7 | ISOLATION | ISO_QUAD, ISO_LEG_FLEXION, ISO_SIDE_REAR_DELT, ISO_BICEP, ISO_TRICEP, ISO_CALF, FOCUS_* | selectorized machine, cable, dumbbell | 3-5 | controlled, near failure allowed | 'Leg Extensions' 2 x 'MYO SET' (JUSTICE LEAGUE E12); 'Ez Bar Curls' and 'Leg Extensions' 2 x '20 Reps' (AESTHETICS) | OBSERVED last slots in every template; MYO only on the last exercise (audit N13; VOL-15 RIGHT) / OBSERVED quad isolation on knee days (10 vs 1), leg-flexion isolation on hip days (11 vs 1), leg extension before leg curl 12/14 |
| 8 | CORE (only if the client moved it to the end) / optional day | CORE_ANY | bodyweight, cable | 2-3 |  |  | COACH-ANSWER ATH-11: core is first by default; 'Some athletes like to do it at the end, so that's why I want them to be able to move it around' / COACH-ANSWER ORD-10 PARTLY: optional days (Calves, Cardio, Core, Focus) can be add-ons or separate days - ideally separate |
| 9 | CONDITIONING | COND_AEROBIC, COND_SPRINT_BUYOUT | bike/row/ski, run, jump rope | 1-5 by modality |  |  | OBSERVED BASEBALL Part E 'Buy out' last 65/65; conditioning last or on its own day 107/121 / COACH-ANSWER EQ-14: any erg; track by distance, calories or time; ORD-09: fighters start with a real aerobic block |

**Sub-rules:**

| Rule | Status | Evidence |
|---|---|---|
| Fast before slow / free before constrained: velocity intent falls and constraint rises through the session | OBSERVED + COACH-ANSWER | OBSERVED JUSTICE LEAGUE constraint by position 1,1,3,1,1,2,3,1,1,5 (BYOP rubric; canonical 1,1,3,1,2,2,3,2,1,5); reps 6-8 -> 8-12 -> MYO / OBSERVED BYOP athletic tabs mean constraint position 1 = 1.0 -> positions 9-10 = 3.5-3.9 (BYOP rubric) / OBSERVED MM athletes first half 1.58 -> second half 2.54; UL/PPL 2.4 -> 3.2 (MM scale) / OBSERVED Spearman(constraint, rep midpoint) = 0.72 over 21 filled BYOP slots / COACH-ANSWER ORD-03 - RIGHT (power before strength) |
| Horizontal pull before vertical pull; horizontal push before vertical push - except that the main lift ('the work') always goes first, whatever its direction | COACH-ANSWER ORD-01/ORD-02 (house rule; no direct study, 10b ORD-5) | COACH-ANSWER ORD-01 - RIGHT: follow BYOP (row before pulldown, always); ORD-02 - RIGHT: the main lift comes first regardless of direction / OBSERVED BYOP 13/13 (pull) and 15/15 (push); MM UL/PPL 6/6 sessions for the pull rule (19/19 = BYOP 13 + UL 3 + PPL 3, audit R1) / OBSERVED but NOT to be copied: FAT BURN 0/8, 4 TRACKS AESTHETICS 0/38, BOXING wk1-2 0/2 put the pulldown first (ORD-01) / COACH-ANSWER CAT-04 gives the reason the generator can explain: zone 2 (horizontal) before zone 3 (overhead) |
| Core first (as the warm-up), movable by the client | COACH-ANSWER | COACH-ANSWER ATH-11 |
| Bilateral before unilateral (same region) | OBSERVED | OBSERVED 225/231 sessions |
| Compound before isolation; big before small | OBSERVED + COACH-ANSWER ORD-04 | OBSERVED 227/301 and 178/244; breaks are deliberate (calves first, pre-exhaust side raises) and only for a priority muscle (ORD-04) |
| Hip-dominant (lower posterior) pairs with the push (upper anterior); knee-dominant pairs with the pull - on split, full-body and bootcamp days | OBSERVED + COACH-ANSWER | OBSERVED 186 of 222 lower/upper pairs (BASEBALL 92/92; BYOP 00/03/04/07/08 100%) / COACH-ANSWER UNI-11 ('If I'm doing the back of my lower body, then the opposite would be the front of my upper body ... keep as far away as I can from bleeding over'), ORD-06 ('hip-dominant with pushing and knee-dominant with pulling ... for full bodies and for boot camps') |
| Inside the power block: plyo -> throws -> COD/sprint -> Olympic; landing before reactive | OBSERVED + COACH-ANSWER | OBSERVED 48/51; landing first 11/13 / COACH-ANSWER CAT-10 (receive before create) |
| Intensity techniques ('MYO SET', drop sets) only on the last exercise, on machines or isolation | OBSERVED + COACH-ANSWER | OBSERVED audit N13 / COACH-ANSWER VOL-15 - RIGHT |
| Priority override: 'the work' -> 'the accessory' -> 'the nuance' -> 'the survival' (loads '1RIR' -> '2RIR' -> 'MAX' -> 'ALL') | OBSERVED + COACH-ANSWER | OBSERVED MM CONJUGATE!M13:M16, 4 TRACKS M9:M24 / COACH-ANSWER ORD-07 - RIGHT |
| Supersets are a fatigue / density tool: short sessions, advanced clients who need more stimulus, off-season VO2 / mitochondrial work, and beginners who do not fatigue with straight sets | COACH-ANSWER | COACH-ANSWER ORD-05 PARTLY: 'The supersetting is more like a fatiguing principle ... a tool to use to fatigue the heart more and compress the time' |

**Exceptions the generator must allow:**

| Exception | Allowed for | Evidence |
|---|---|---|
| Contrast / French contrast (heavy -> jump) | intermediate+ athletes, off-season, heavy member about 78-85%, no rest inside the complex (COACH-ANSWER ATH-12 - RIGHT) | OBSERVED 'FRENCH CONTRAST': '78% of 1RM whatever squat immediately into tuck jumps, immediately into Goblet squats, immediately into reverse banded squat jumps' (ALL ABOUT SQUATS!I18) / v1: the 4th member is written with a reverse band, which is out (EQ-12): PROPOSED - PENDING COACH APPROVAL - use bodyweight pogo / repeat squat jumps (fast contacts) as the 4th member, or run the first three members only / OBSERVED 11 heavy->jump instances, e.g. 'Barbell deadlift' (MM BASEBALL!I51) then 'Broad jumps' (I52); 'SUPERSET: HEAVY Hex bar Squats direclty into 10 Repeat Jump Squat HIGH JUMPs' (MM 05!C17) |
| Calves first on aesthetics A-days | aesthetics, only when calves are a priority (COACH-ANSWER ORD-04 - RIGHT) | OBSERVED BYOP AESTHETICS D3 'Machine Calf Raises' above D4 'Leg press'; 3 DAY BUILDER DAY 1 |
| Isolation first (pre-exhaust / priority) | bodybuilding clients, only for a priority muscle (ORD-04) | OBSERVED 4 TRACKS AESTHETICS 19/59 sessions open with 'cable Side Raises' / 'DB side raises' / 'Arnold press' before 'Incline bench' (04:O35) |
| Core moved to after the plyos or to the end | any client who prefers it (core is first by default, ATH-11) | COACH-ANSWER ATH-11 / OBSERVED BASEBALL Part B (core after the power block); HYBRID core inside strength supersets |
| Conditioning first | fighters (a real aerobic block, ORD-09 RIGHT), the sprint stimulus of the day, or an easy C-colour warm-up | OBSERVED BOXING 4/4 day types; HYBRID Tue/Fri / COACH-ANSWER ORD-09 |
| Low-intensity plyos and light ballistics as late accessories | athletes (calf/shoulder accessory) | OBSERVED BASEBALL Part D 'Bicep Curls' > 'Side to side hurdle hops' (02:D37:D38); 'Single Arm DB snatch from floor' in the 'shoulders' slot (02:BG38) |
| Circuit placement | bootcamp (timed circuits, PRG-03) | OBSERVED BOOTCAMP - OPTION 2 'Cardio' third (E15/E30) and 'Bicep' before 'Vertical Push' (2A/2B) |
| Isolation before the second unilateral lift on leg days | PPL leg days | OBSERVED BYOP PPL 'Leg Extensions'/'Leg Curls' (rows 20-21) before 'Unilateral HD' (row 22) |

**Exceptions retired in v1:**

| Former exception | Why it is no longer allowed |
|---|---|
| Pulldown before row | COACH-ANSWER ORD-01 - RIGHT: BYOP order (row before pulldown) always; the FAT BURN / 4 TRACKS / BOXING order is not followed |
| Strength listed above Olympic work (HYBRID, CrossFit) | COACH-ANSWER ORD-03 - RIGHT: power before strength; the HYBRID listing is not an execution order |
| Core early only for athletes / core at the end for aesthetics | COACH-ANSWER ATH-11 - NOT RIGHT: core first for everyone by default, movable |

**Why horizontal before vertical (INFERRED from CAT-04; the rule itself is COACH-ANSWER ORD-01).** The coach calls zone 2 (horizontal) "high-pressure, but safer to push and pull" and zone 3 (overhead) the position needing "more positioning, stability and skill". Putting the heavier, safer vector first is the ACSM higher-intensity-first rule [S80]. No study tests the order directly, so show it to the client as a house rule (10b ORD-5). The main lift ('the work') still goes first whatever its direction (ORD-02).

## 5. Load-velocity prescriptions by intent (observed vs science)

**Principle.** COACH-CHAT: "The heavier I go the slower I am; the lighter, the faster. Range of motion (full ROM, mid ROM) is mechanical work. Speed is a variable, ROM is a variable, load is a variable, volume (sets x reps over time) is a variable."; OBSERVED 'HEAVY BARBELL' / 'ECCENTRIC SLOW MORE MUSCLE RECRUITMENTS' vs 'LIGHT BARBELL ' / 'ECCENTRICFAST LESS MUSCLE RECRUITMENT' (ALL ABOUT SQUATS!A44:A48); OBSERVED 'BALLISTIC PURPOSE - BE EXPLOSIVELY & FAST' / '*I USE THESE FOR MUSCULAR FORCE PRODUCTION' and 'PLYOMETRIC PURPOSE - BE REACTIVE & BOUNCY' / '*I USE THESE FOR REACTIVE CONNECTIVE TISSUE ADAPTATIONS' (ALL ABOUT BALLISTICS!A22:D23). SCIENCE: bar velocity vs %1RM R^2 ~0.98 [S35]; intent matters as much as actual speed [S37][S38]; velocity loss within a set changes the adaptation [S39]. **Generator rule:** Pick the heaviest implement that does not slow the movement for the slot purpose; speed is a SLOT variable (HEAVY vs FAST on the same lift), not a separate exercise. Speed work uses straight weight only - no bands or chains (COACH-ANSWER EQ-12).

| Velocity zone (not a Davidson zone) | m/s | %1RM | Implements | Library items | OBSERVED in the coach's sheets | SCIENCE dose |
|---|---|---|---|---|---|---|
| reactive / starting speed | >1.3 | < 25 / body mass | bodyweight, boxes/plates/hurdles as targets | plyos G9:G141; ankle track C126:C136; COD L9:L92; ' Max velocity running (top speed)' G128 | 'EASY' load on 'DEPTH DROP & JUMP' / 'HIGH SQUAT JUMPS' / 'REPEAT HIGH JUMPS' x 6 (MM 4 TRACKS!F17:H17); 2 x '6 to 8 Reps' (BYOP JUSTICE LEAGUE); 'Hurdle hops' 2 x 20 (MM BASEBALL!CO29:CQ29) | 5-10 contacts x 2-4 sets, 1-2 min rest; depth-drop height 20-30 cm progressing to the RSI-optimal ~30-40 cm [S58][S59] (coach heights: low 6-12 in, medium 12-18 in, high above hip, EQ-16); fast SSC contacts <250 ms [S57] |
| speed-strength (light external load) | 1.0-1.3 | body mass - 30 | medball, slam ball, light DB/hex loaded jumps (10-20% BW, EQ-15) | throws K9:K28; 'DB repeat squat jumps' G139; 'Hex bar squat to calf raise' C11; 'Weighted squat to calf raise' C46 (any tool, LIB-07); 'Hex bar squat jumps' ADD-ATH10-4 | 'MB fast chest pass ' 10 (MM BASEBALL!AW47); 'Really high jump squats LOAD & jump hard' 8 (MM 05!C14); 'WEIGHTED DEPTH DROP' 6, load 'EASY' (MM 4 TRACKS!E17); 'DB Squat Jumps' 12/10/8/8 (MM BASEBALL!D33); 'Hex bar squat jumps' 12/10/8/8 (MM BASEBALL!S33) | 3-6 reps x 3-5 sets, 1.5-3 min rest; jump squat peak power body mass to ~30% 1RM [S43]; hex ~20% squat 1RM [S45]; DB jumps total 10-20% body weight (COACH-ANSWER EQ-15) |
| strength-speed | 0.75-1.0 | 40-65 (Olympic lifts 70-90) | barbell (Olympic, dynamic effort with straight weight), kettlebell swings, DB/KB snatches and cleans | hang pulls C12:C54; Olympic lifts C91:C96; beginner Olympic options ADD-ATH10-1..3 (ATH-10); 'Box. Any Squat Touch and Go fast' AI91; 'KB swing' AN20; push press/jerk AA11:AA14 | 'Hang cleans @ 75%' 4x8 -> '@ 80%' 4x6 -> '@ 85%' 4x6 -> '@ 90%' 4x4 (MM BASEBALL OPTIONAL PIECE rows, e.g. CM33, BY51, CQ51, DH50); 'FAST RPE6 or about 60-70%' (MM 4 TRACKS!N17/N21; also on 'LEG PRESS' O17); 'Front squats - light weights - same speed for all reps' 12/12/12/12 (MM BASEBALL!BU33) and 4/4/4/4 (AO51); 'Fast KB swings' 12/12/12/12 (MM BASEBALL!AI51) | power clean >=70% (HPC peak ~65-80%) [S43][S46]; jump shrug ~30-45% HPC [S46]; dynamic effort with straight weight at the coach's 'FAST RPE6 or about 60-70%', 6-10 x 2-3, 45-90 s [S101]; stop at ~20% velocity loss [S39] |
| accelerative / absolute strength | < 0.75 | >= 75-85 | barbell, hex bar, weighted bodyweight | 18 absolute-strength entries (e.g. AI46 Front Squats, AI49/AI50 back squats, AN92 Barbell Deadlifts, AD95 Barbell bench Press, U52 Weighted Pull ups) | '1RIR' on 'the work' (MM CONJUGATE!D13); 'STRENGTH FOCUSED WORKOUTS (1 RIR) RPE 8+' and '*REST 3-6 MIN BETWEEN SETS' (ALL ABOUT SQUATS!D13, E28); '78% of 1RM' heavy member of French contrast (ALL ABOUT SQUATS!I18) | >= 80-85% 1RM, 1-6 reps x 3-6 sets, 3-5 min rest [S80] (coach rest: strength 3-6 min, VOL-14 RIGHT) |
| hypertrophy (controlled) | intent max, actual moderate | ~60-80 (RIR-based) | DB, cable, machine, barbell |  | 'HYPERTROPHY FOCUSED WORKOUTS (1 RIR) *RPE8+', '*REST 1-2 MIN BETWEEN SETS' (ALL ABOUT SQUATS!A13, B28); 'Always go for 1-3 RIR (REPS IN RESERVE) aka RPE 7+' (MM EXAMPLE UPPERLOWER SPLIT!A6); VOL zones (MM BASEBALL!A19:C22): compounds 'VOL 1' '12-15 Reps' / 'VOL 2' '8-12 Reps' / 'VOL 3' '6-8 Reps'; isolations '10-12 Reps' / '15 REPS' / 'MAX REPS'; BYOP REPS list 'AW8:AW14': '4 to 6 Reps' ... '20 Reps', 'MYO SET' | 5-30 reps at <= 4 RIR counts as a hard set [S72][S22]; 2-3 s eccentric, max-intent concentric [S99]; rest 1-2 min (up to 3, VOL-14) |
| local-fatigue machine work |  |  | leg press, pendulum, belt squat, selectorized isolation |  | LEG PRESS 'local fatigue of the quads/legs and not have so much systemic fatigue failure' (ALL ABOUT SQUATS!I35); '**MYO SET - ADVANCED' '15/5/5/5/5/5' (ALL ABOUT SQUATS!C27, B27; definition A30); '2 sets LEG PRESS MYO - 15-5-5-5-5-5' (MM 4 TRACKS!W61) | INFERRED: keep near-failure work on constraint >= 4 (most weight-training injuries involve free weights [S11]; going to failure is not needed for growth [S20][S21] - no study tests failure safety by implement); COACH-ANSWER EQ-03: high-volume clients collect volume on constrained machines |

**Medball rule.** OBSERVED: No ball weight is written in either workbook (0 lb/kg cells). Cues: 'this but hugging a light medball' (MM 05!K13); dose 1 x 10 per throw, 1 x 20 for the two sit-up throws (ALL ABOUT BALLISTICS!A53:B71). COACH-CHAT: 8-10 lb for upper-body passes and rotations; "As long as you generate force with a lot of speed you train the body to move at that speed." COACH-ANSWER EQ-06 - RIGHT to: slams 10-20 lb (slam ball), overhead throws 6-10 lb, sit-up throws 6-8 lb, lighter for youth and older clients. His words: 'the only point of having a heavier med ball is for something specific, like a heavy med ball hang clean or something like wall balls. Are they doing CrossFit, or are they doing high rows [probably HYROX - INFERRED]? ... I don't think there's any need for anything more than 20 lbs.' ATH-05: no medball throwing for aesthetics / bodybuilding except in the warm-up.

| Throw type | Ball (lb) |
|---|---|
| chest pass / push throws / rotational passes (scoop toss, shotput, punch throw) | 8-10 (coach: passes and rotations); start at 8 |
| overhead / backward throws | 6-10 (COACH-ANSWER EQ-06) |
| sit-up throws (situps to overhead / chest) | 6-8 (COACH-ANSWER EQ-06) |
| slams (non-bounce slam ball) | 10-20 (COACH-ANSWER EQ-06) |
| specific heavy uses only: medball hang cleans, wall balls (CrossFit / HYROX-style) | up to 20 (COACH-ANSWER EQ-06) |
| cap | never over 20 lb (COACH-ANSWER EQ-06) |

Modifiers: youth (< 15) or older adult: lighter for every throw type (COACH-ANSWER EQ-06); 4-6 lb is the starting number (SCIENCE, 10b FV-6); aesthetics / bodybuilding goal: no throws in the main workout; medball drills only in the warm-up (COACH-ANSWER ATH-05); sex: no sex-based modifier (COACH-ANSWER ATH-09; the v0 female -2 lb rule CR-19 is retired). Quality gate: if the throw visibly slows, the head drifts or the spine side-bends: drop 2 lb; if clearly too easy with clean technique: +2 lb, staying inside the ranges above. SCIENCE (10b FV-6) puts rotational and chest passes fastest at about 4-8 lb [S49][S54]; the coach's 8-10 lb stands (his COACH-CHAT number, not contradicted in EQ-06), so the generator starts at the 8 lb end. Contradiction F3 closed by the coach's answer. No medball: COACH-ANSWER EQ-07 - RIGHT with 'just no bands': plyo push-ups (pressing), fast cable rotations, or the 'fake medball slam' with no ball; never band chops ('Band chops are, to me, worthless'). Status: COACH-ANSWER EQ-06, EQ-07, ATH-05, ATH-09 + COACH-CHAT.

**Loaded jumps.** OBSERVED: 'DB Depth drop dbs Jump' G136 = 'BILATERAL DROP WEIGHTED, DELOAD WEIGHT & JUMP' (ALL ABOUT BALLISTICS!C40): load on the drop, released before the jump; DB plyos exist only in the ADVANCED plyo block (G136:G139); 'DB heavy ankle hops' (MM BASEBALL!E56); 'Really high jump squats LOAD & jump hard' (MM 05!C14). Rule: load 10-20% of body weight in total for loaded jumps; too heavy when jump height or speed clearly drops (COACH-ANSWER EQ-15 - RIGHT). Needs the client body weight at intake (COACH-ANSWER GEN-02 adds weight). DB-release drops ~20% (10-30%) body mass [S63]. Status: COACH-ANSWER EQ-15 + OBSERVED + SCIENCE.

**Plyo heights and method (COACH-ANSWER EQ-16, LIB-04, CAT-10, CAT-11).** Depth drops: low ~6-12 in; medium ~12-18 in; high above the hip (as written, G133). Hurdles: moderate ~6 in; advanced 12 in+ (taller hurdles + continuous quick contacts, LIB-04). Method: receive and pause (stick the landing) -> receive then create (stick, then jump/hop) -> repeatedly receive and create (repeat hops); bilateral is easier than unilateral (COACH-ANSWER CAT-10/CAT-11; the coach has not named this progression - it is NOT a Davidson zone).

**Olympic lifts (COACH-ANSWER ATH-10, ATH-09, LIB-07, EQ-03, PER-09 + OBSERVED).** Who: everyone in athletic training (COACH-ANSWER ATH-10): beginners and early intermediates = hang pulls, hang cleans without bumpers, DB/KB snatches and cleans, hex-bar jumps; intermediate+ and pros = the full lifts. Youth may do some lifts from the floor (ATH-09). Never a snatch for older, injured or high-volume clients (EQ-03). Names: LIB-07: the full lifts are squat lifts - shown as 'Squat Snatch' C94, 'Squat Clean' C95, 'Squat Clean & Jerk' C96. Start-position ladder: high hang -> mid hang (knee) -> low hang (below knee) -> floor (OL!A7:A10); library C12:C15 (FOUNDATIONAL high/mid pulls) -> C53:C54 (MODERATE low-hang pulls) -> C91:C96 (ADVANCED full lifts). Catch ladder: pull (no catch, zone 1) -> power clean (front-rack catch, zone 2) -> snatch / jerk (overhead, zone 3) -> squat lift. Percent progression (OBSERVED BASEBALL): @ 75% 4x8 → @ 80% 4x6 → @ 85% 4x6 → @ 90% 4x4. Equipment: Power Snatch C91, Power Clean & Jerk C93, 'Squat Snatch' C94, 'Squat Clean & Jerk' C96 need bumpers + a drop area; Power Clean C92, 'Squat Clean' C95 and hang cleans can be lowered under control. No-barbell ladder: Hex bar squat jumps → KB Squat cleans / Fast KB swings → Staggered stance DB snatch / Single Arm DB snatch from floor → DB Squat Jumps → Squat Jumps w/ Medicine Ball → broad jumps / Tuck Jumps (zone_shift: a change of velocity zone; with no load at all there is no Olympic option, so flag pattern_gap and put a DB or KB on the buy list, ATH-10).

**Variable resistance: out of scope.** OUT OF SCOPE in v1 (COACH-ANSWER EQ-01, EQ-12): no bands, chains, weight releasers or reverse bands are prescribed. EQ-12 NOT RIGHT: 'We don't want any variable resistance right now. No variable resistance should be available in this for now. We will work with that later on.' What the generator does instead:

- banded / reverse-banded box squats AI92, AI93, AI95, AI96 -> 'Box. Any Squat Touch and Go fast' AI91 or 'Box. Any Squat Deload' AI94 with straight weight at 'FAST RPE6 or about 60-70%'
- 'FAST BANDED BENCH PRESS' / 'FAST CHAINED DL' / 'HEAVY CHAINED DEADLIFT' in the sheets -> the same lift with straight weight (FAST = 60-70%, HEAVY = 1 RIR)
- reverse-banded (assisted) jumps -> bodyweight jumps; French contrast 4th member -> PROPOSED pogo / repeat squat jumps (pending coach approval)
- weight releasers -> not used; the DB-release depth drop G136 stays (it is the coach's own drop-and-release, not a releaser)

The v0 band/chain prescriptions (bands ~50%, chains ~70%, eligibility rules, 10b AR-1..AR-6) are parked for the later variable-resistance work; see out_of_scope_implements and 10b section 8.

**Tempo.** 'Goblet squat slow' (MM BASEBALL!AA33), 'slow eccentric deficit Lunges (no weigths)' (EL52), 'SLOW FRONT SQUATS' (DG68). By zone: athletic / power: natural or fast eccentric, max-intent concentric; strength: controlled ~1-2 s eccentric, max intent; hypertrophy: 2-3 s eccentric, max intent. Rule: never slow eccentrics on throws, jumps, Olympic lifts or dynamic effort; slow eccentrics are for control blocks, pain, and light home equipment (10b TEMPO-1..4).

**ROM.** OBSERVED: 'ROM VARIABLE' 'Elevated' (green) -> 'Floor' (yellow) -> 'Deficit' (red) (RP!A81:A84); 'END RANGE BEHAVIOR VARIABLE' 'Dead stop' -> 'Touch & go' (RP!A86:A88); 'Leg ext. Leg Curls (FULL RANGE OF MOTION)' (MM BOXING!L14); 'Heel raises & fast/rythmic/1/4 SQUATS' (MM 05!J40). COACH-CHAT: "Range of motion (full ROM, mid ROM) is mechanical work ... ROM is a variable." Rule: full (longest pain-free) ROM by default; lengthened-bias isolation variants; partial/mid ROM is legitimate for athletes on fast work; ROM changes between blocks (10b ROM-1..6).

**Aerobic modality.** Blue / Green / Orange aerobic work runs on any erg or running (bike, rower, ski erg, treadmill, outdoors); non-runners are fine; track by distance, calories or time and keep one unit per block (COACH-ANSWER EQ-14 - RIGHT). Sessions per week: 3 general / fat loss, 2 athletes in season, 4 aesthetics / bodybuilders + long walks after workouts (COACH-ANSWER ATH-07; dose belongs to 03/06). Library: the DISTANCE (200-1000 m) and CALORIES blocks (B123:B141) are opened to every template (FIX-02 RIGHT: 'just make sure they're logical'); '21.6 mile run' B33 is flagged (coach: a marathon; a marathon is 26.2 mi).

**Speed bands written by the coach:** OBSERVED MM BASEBALL!E20:F22: 'SPEED ENDURANCE' '>40 Secs'; 'SPEED POWER' '10-39 Secs'; 'SPEED STRENGTH & POWER' '0-12 Secs'. **Older adults:** fast concentric at 40-60% 1RM on machines (30-60% frail) before jumps/throws (SCIENCE [S12][S41]); few plyos unless the client asks (ATH-09); never overhead squat, snatch, low-bar squat or depth jumps (EQ-03).

**Failure gate (CR-23).** RIR 0-1, MYO sets and drop sets only at constraint ≥ 4 or on isolation, and only on the last exercise (VOL-15 RIGHT). Barbell compounds stay at RIR 1-3; never to failure on heavy compounds (GEN-08). Athletic and Olympic work is never taken near failure. OBSERVED: 'MYO SET' only on the last slot (BYOP 03/04 G12); '2 sets LEG PRESS MYO - 15-5-5-5-5-5' (MM 4 TRACKS!W61).

## 6. Machines: no ranking, constraint differences (COACH-ANSWER EQ-11)

> NOT RIGHT (to 'hack squat ranked last'): 'my opinion on machines is that if the hack squat that you have in your gym works and you feel it is good, then that's great. If a Smith machine feels good, that's great. Some people have certain machines that are different, so they don't always feel the same. What I'm trying to do is I don't want to rank them because they have different brands, angles, and things like that ... Probably more constraint would be a hack squat and a leg press. Less constraint would be a Smith machine ... Belt squats are for people that you don't need to load them axially ... The GHD reverse hyper is also if they're available and if they feel good doing them ... I want them to feel the right muscles.'

**Ranking:** NONE. The generator never ranks machines against each other (EQ-11). Other answers that shape machine use: EQ-10: PARTLY: pick by client, 'but also the preference of the client ... that can be completely up to them'; EQ-03: RIGHT: older / injured / high-volume clients lean machine and cable for compounds and isolation; never overhead squat, snatch, low-bar squat, depth jumps; EQ-04: RIGHT: FOUNDATIONAL older or injured clients can use the machines the library files MODERATE/ADVANCED; EQ-05: RIGHT: add a seated machine shoulder press (ADD-EQ05); GEN-08: RIGHT: hard rules include "no V-squat".

| Machine | Set-up | Constraint | Spine | Note |
|---|---|---|---|---|
| LEG PRESS | seated, back pad, feet on a platform | 5 | no axial load | more constrained than the Smith machine (EQ-11) |
| HACK SQUAT | back pad + shoulder pads, fixed path | 4 | supported (load through the shoulder pads) | more constrained than the Smith machine (EQ-11); the top of level 4 |
| PENDULUM | back pad + shoulder pads, arc path | 4 | supported (load through the shoulder pads) | like the hack squat |
| BELT SQUAT | load hangs from a hip belt; hands on rails | 4 | no axial load | for clients who should not be loaded on the back that week or are sore from it (EQ-11); not in the library (ADD-EQ11) |
| SMITH MACHINE | bar on the back on a fixed path; trunk unsupported | 4 | axial (bar on the back) | the least constrained squat machine (EQ-11) |
| GHD / REVERSE HYPER / 45-degree back extension | hips on a pad | 4 | no axial load | only if available and the client feels the target muscles (EQ-11); GHD has no level (LIB-08) |

**The coach's sheet opinions (OBSERVED, informational only - they rank nothing in v1):**

| Machine | Verdict (cell) | Detail (verbatim) | Library | Generator |
|---|---|---|---|---|
| PENDULUM | 'LOVE IT' (H41) ALL ABOUT SQUATS!G41 | 'This machines is my FAVORITE leg/squat/kne domminant machine I have ever tried. As of now, that is my opinion on these' (I41) | 'Pendulum Squat' AI99 (library ADVANCED; operative FOUNDATIONAL) | informational only (EQ-11): not ranked first |
| LEG PRESS | 'LOVE IT' (H35) ALL ABOUT SQUATS!G35 | 'Pro: You can focus on mechanical fatigue, local fatigue of the quads/legs and not have so much systemic fatigue failure' (I35) | 'Leg press' AI98 (library ADVANCED; operative FOUNDATIONAL); FULL FOCUS 'Leg press' AZ10 | the most constrained squat machine (5); MYO sets; fast leg press 60-70% for dynamic effort (MM 4 TRACKS!O17); free-weight swap pair 'Sqats or Leg Press'; the non-axial second squat day (PER-04) |
| HACK SQUAT | "I PERSONALLY DON'T LIKE IT" (H37) ALL ABOUT SQUATS!G37 | "Most hack squat machines don't have the right strength profile for me so getting used to a good upright squat might be difficult, I haven't had much success with these myself or with clients, but I know there are amazing people out there having great results with them. " (I37) | 'Hack Squat Machine' AI52 (MODERATE), 'Hack Squats' AI97 (ADVANCED); both operative FOUNDATIONAL | v0 demoted it; v1 does NOT (EQ-11: 'if the hack squat that you have in your gym works and you feel it is good, then that's great') |
| V-SQUAT | "DON'T LIKE IT" (H39) ALL ABOUT SQUATS!G39 | "Always tight on lower back & knees, so I don't presercibe the use of these, ever." (I39) | absent from the library (correct) | never prescribe (GEN-08 hard rule) |

**Roles:** **ON_RAMP** upper-body assisted/guided pulls and supported presses (library FOUNDATIONAL): U9-U18 (minus the band-assisted U15), X9-X11, AD14, ADD-EQ05; **VOLUME_TOOL** leg/hip machines (library MODERATE/ADVANCED, operative FOUNDATIONAL): AI52, AI97-AI99, AN51, AN52, AN55, ADD-EQ11 belt squat; **ISOLATION** AM9, AR9/AR10 (+ AN15, AN54, AN100 in LEG FLEXION), AU13, AH20; leg-extension copies AI20/AI55/AI101.

**Other machines (neutral):** Leg extension machine (RP!A39; AM9; AI20/AI55/AI101); Leg Curl Machine / Seated leg curls / Lying Leg Curls (AN15, AN54, AN100, AR9, AR10 - now LEG FLEXION); Hip Thrust Machine (AN51); Machine Good Mornings (AN52); GHD (AN48, AN93; RP!A67); Reverse hyper extensions (AN11; RP!A63); 45 degree hip ext. (RP!A68); Assisted pull up machine (RP!E68:E70; U16:U18); Machine row / Pendulum row / Machine single arm row (RP!G61, G70, G74); Machine reverse flies (RP!K18; AH20); Machine bench press / Machine flies (AD14, AD50); Machine Calf Raises (AU13); Smith machine (X13 option; RP!G64); Seated machine shoulder press (ADD-EQ05, EQ-05); Belt squat (ADD-EQ11, EQ-11). Rule: no machine is ranked (EQ-11): order by constraint fit to the client (client_rules), spine loading (CR-29), what the client feels, client preference (EQ-10) and coach usage; seated leg curl above lying leg curl only for the lengthened position ([S69]), not as a preference.

**Machine-first vs free-first:** OBSERVED: gen-pop UL/PPL write the free weight first ('Sqats or Leg Press', 'Deadlifts (DB or Barbell)', 'DB Rows or Row machine'); the bodybuilding 12-week track writes the machine first ('Machine Dips or dips' x20, 'machine rows or db rows' x16, 'machine or db flies' x12, 'machine or db Reverse flies' x8). COACH-ANSWER EQ-10: the first-written option is not the default - pick by client, and the client's preference can decide.

**Missing machine:** COACH-ANSWER EQ-08: swap first (quads: DB leg extensions on a box, sissy squats, reverse Nordic; hamstrings: nordics, slider or swiss-ball curls) - no bands; fallback OBSERVED 'leg press or just add 2 more rounds to front squats' (MM 4 TRACKS!W42:Z42): a missing machine becomes +2 sets of the free-weight lift of the same pattern. Context: 'This model is based on free weight squats, leg presses and machines will be covered at the end' (ALL ABOUT SQUATS!A4).

**How the generator uses machines:**

- Never V-squat (GEN-08).
- No machine ranking (EQ-11); the sheet verdicts above are informational only.
- Constraint differences decide when constraint matters: leg press 5 > hack / pendulum 4 (back-supported) > Smith 4 (trunk free) (EQ-11, EQ-13).
- Belt squat or leg press for the second squat exposure of the week, or whenever the spine was already loaded or the client is sore (PER-04, EQ-11, CR-29).
- GHD / reverse hyper / back extension only if available and the client feels the target muscles (EQ-11).
- Machines carry near-failure work (MYO, RIR 0-1); never justify a machine to the client as "better for growth" (machines = free weights for hypertrophy [S1]).
- Older / injured / high-volume clients: compounds and isolation lean machine/cable (EQ-03); FOUNDATIONAL clients may use the MODERATE/ADVANCED-filed machines (EQ-04).
- Tag each machine ON_RAMP / VOLUME_TOOL / ISOLATION; ON_RAMP machines are swapped out as the client earns the free version (one reference per block).
- Leg machines are eligible for FOUNDATIONAL clients (CAT-04 operative level), but the athlete constraint band keeps them out of athlete main slots.

## 7. Open questions for the coach

**Answered since v0** (21 of the 24 v0 questions; details in `open_questions.answered_v0`):

| v0 question | Answered by | Result in v1 |
|---|---|---|
| Zones = where the load/hands sit, judged at the end position? | CAT-04, CAT-10 | zones are positions with a rotation bias (vertical = external, horizontal = internal/compressive); level follows from them; zones do not apply to plyos. The end-position detail for chops is not confirmed but reproduces his FBS ladder 12/12 - kept, low priority |
| Push press and jerks AA11:AA14 FOUNDATIONAL vs CAT-04 overhead = advanced | LIB-13 | push press stays FOUNDATIONAL (easier); push jerk INTERMEDIATE (intermediate/advanced) |
| High zercher AI47:AI48 MODERATE vs front-loaded zercher = foundational | CAT-04 (his own anchor) | FOUNDATIONAL |
| Low-skill leg/hip machines FOUNDATIONAL for older/injured/beginners? | EQ-04 RIGHT | kept |
| Medball weight per throw, lighter for women/youth/older? | EQ-06 RIGHT, ATH-09 | 8-10 lb passes/rotations, overhead 6-10, sit-up 6-8, slams 10-20, heavier only for hang cleans / wall balls, never over 20 lb; lighter for youth/older; no sex-based rule |
| No medball: what goes in the Throwing slot? Meaning of FAKE MEDBALL SLAM | EQ-07 RIGHT | plyo push-ups, fast cable rotations, the no-ball fake slam; never band chops |
| Olympic lifts without bumpers? | ATH-10 RIGHT | everyone in athletic training gets Olympic work; beginners: DB/KB snatches and cleans, hex-bar jumps, hang pulls, hang cleans lowered under control |
| Seated machine shoulder press for VERTICAL PUSH? | EQ-05 RIGHT | added as 'Seated Machine Shoulder Press' ADD-EQ05 |
| Leg Extensions slot with no machine? | EQ-08 | swap (DB leg extension on a box, sissy squat; reverse Nordic proposed) - no bands |
| Whole leg-flexion segment for the Leg Curls slot? | CAT-09, EQ-08 | yes: nordics, slider or swiss-ball curls when there is no machine |
| Minimum home kit with bands? | EQ-02 | no bands; ideal home kit = adjustable DBs + bench + pull-up bar + 8-10 lb medball ('people have different things') |
| Rebalance the bilateral:unilateral ratio when a swap changes laterality? | UNI-02, UNI-08 | keep the sets if possible but adjust; the ratio (90/10 to 10/90) is adjustable and pain moves it - handled by 03 |
| Default implement when the name has none? | EQ-09 RIGHT | bodyweight -> DB -> barbell as level rises, limited by the kit (CR-30) |
| Chains 'slow you down' vs science; bands ~50% / chains ~70% of what? | EQ-12 NOT RIGHT | no variable resistance at all for now |
| Horizontal before vertical for every client? | ORD-01, ORD-02 | yes (BYOP order), except the main lift ('the work') always goes first |
| HYBRID/CrossFit 'STRENGTH' above 'OLY/POWER'? | ORD-03 RIGHT | power before strength |
| Which sports get more plyos? | ATH-01, ATH-02 RIGHT | ranking confirmed; plyo vs ballistic set by ground-contact time |
| Implement sizes as numbers (boxes, hurdles)? | EQ-16 RIGHT, LIB-04 | drops low 6-12 in / medium 12-18 in / high above hip; hurdles 6 in moderate, 12 in+ advanced |
| Bike/rower/ski equal to running? Open DISTANCE/CALORIES? | EQ-14 RIGHT, FIX-02 RIGHT | any erg; track by distance, calories or time |
| Data: Camporini, Kong rows, strap rotating, AA50/AA51 twin | LIB-09, LIB-11 | Camporini ignored (excluded); Kong row = double-KB row from the floor (pain option); strap rotating removed; AA51 = barbell press |
| Machine ranking (hack squat last?) | EQ-11 NOT RIGHT | no ranking; describe constraint differences; belt squat for axial sparing; GHD/reverse hyper if available and felt |

**Still open:**

1. Seal rows (X50:X53) are filed ADVANCED although chest-supported. Should supported rows be easier (FOUNDATIONAL/INTERMEDIATE) like the machine row? (not asked in the questionnaire)
2. 'KB Face Pulls ' (U20) under VERTICAL PULL: move to rear delts / side raises? (LIB-10 - no answer)
3. 'Bench Push ups': hands on the bench in FOUNDATIONAL (AD13) and feet on the bench in ADVANCED (AF11)? (LIB-12 - no answer)
4. What does 'NO ACCESS' mean on the two hidden templates? (PRG-01 - skipped)
5. Dips (AD96/AD97) and hanging core (O15, O16, O130): which zone/level? (low priority; CAT-08 calls toes-to-bar 'more complicated')
6. Advanced client (L3): what training history makes someone advanced? PRG-05 defines novice and intermediate only (CR-17 has a PROPOSED definition).
7. Rephrased CAT-12 (the coach did not understand it): should the generator only pick named exercises from your library, or may it also make a variation by changing one small thing (e.g. goblet -> front-rack, floor -> deficit)?

**New questions raised by the answers:**

1. No bands means no vertical pull at home without a bar. With DBs + bench and no pull-up bar, is a DB pullover plus 1-2 extra row sets (and a 'buy a doorway bar' note) acceptable? (EQ-01, EQ-02)
2. Eight FUNCTIONAL BIOMECHANICS items use a band round the knees ('Knee banded for adduction ...', BC11-BC49). v1 swaps each one for its 'Hold object Adducted between knees' twin (ball, pad or pillow squeeze). Right? (EQ-01)
3. Your sheets write some speed work with bands or chains ('FAST BANDED BENCH PRESS', banded box squats AI92-AI96, 'FAST CHAINED DL'). v1 keeps the lift with straight weight at 'FAST RPE6 or about 60-70%'. Right? And the 4th member of your French contrast (reverse-banded squat jumps): pogo / repeat squat jumps, or only the first three members? (EQ-12, ATH-12)
4. Spine loading (PER-04): does the hinge follow the same once-a-week rule (deadlift once; the second hinge day uses hip thrust, back extension or reverse hyper)? Do front squats, zercher and heavy goblet squats count as spine-loading for this rule? With no machines at home, is a split squat or a light goblet squat the second squat day? (PER-04)
5. Push press 'is easier' (LIB-13): FOUNDATIONAL for every client, or only inside athletic programs (non-athletes would wait until INTERMEDIATE)? (LIB-13 vs CAT-04)
6. Belt squat and the seated machine shoulder press are not in your library, nor are the beginner Olympic options from ATH-10 (hang cleans, DB/KB snatches and cleans, hex-bar jumps) as FOUNDATIONAL rows. Add them to the MASTER EXERCISE LIBRARY? Which column and level? (EQ-05, EQ-11, ATH-10)
7. Youth may do some Olympic lifts from the floor (ATH-09): from what age or training level? (ATH-09)
8. Heavier medballs are for medball cleans and wall balls in 'CrossFit or ... high rows'. We read 'high rows' as HYROX. Right? (EQ-06)
9. '21.6 mile run' (B33): you call it a marathon, but a marathon is 26.2 mi (21.6 mi is about 35 km). Change it to 26.2 mi, keep 21.6, or drop it? (LIB-18)
10. On the 1-5 scale the hack squat and the Smith machine are both 4, yet you say the hack squat (and leg press) are more constrained than the Smith. Move hack and pendulum to 5, or keep 4 with the Smith at the bottom of level 4 (what v1 does)? (EQ-11, EQ-13)
11. To replace band options, v1 uses a few standard exercises that are not in your sheets: reverse Nordic, foot-assisted pull-up, seated DB calf raise, eccentric-only Nordic, ball-squeeze dead bug, seated Smith shoulder press. OK to offer them, or only exercises from your library? (EQ-01, EQ-08; ties to CAT-12)
12. Older but fit clients (60+, years of training, no pain): machines and cables by default for the main lifts too (EQ-03), or may they keep 1-2 free-weight main lifts if they prefer (ATH-09 'foundation', EQ-10)? v1 keeps machines as the default and lists the free-weight route as PROPOSED (CR-11).

## Appendix A. JSON field guide (`10_equipment_model.json`)

| Key | Content |
|---|---|
| `_meta` | sources, evidence labels, how to use, list ordering, cross-check (with the v1 difference list), changes from the coach answers, **v1** (applied changes with question IDs, pending, profile id changes, excluded cells, removed v0 substitutes, additions, verification, verification_pass_2 = the v1 verification fixes J1-J13), verification_log (v0 fact-check 2026-10-08), substitute_flag_definitions (zone_shift = velocity zone), tab_names_note (JUSTICE LEAGUE = citation only) |
| `implement_groups`, `implements`, `out_of_scope_implements` | taxonomy: group, kit tokens, constraint, skill, stability, zones reachable, velocity role, roles, library stats/examples, coach evidence, generator rules; bands/chains/releasers parked with the coach quotes and the v0 records |
| `constraint_scale` | definition, coach approval (EQ-13), levels 1-5 with library examples, implement means, distribution, crosswalks, GRD rules (GRD-4 = EQ-11 order inside level 4) |
| `level_model` | coach answer text (CAT-04/05/06/10/11), zones 1-3 with rotation bias, guidance modifier, where 'ZONE' is written, estimator, test vs library (by bucket, by cause), conflicts, operative-level overrides, other disagreements, policy LV-1..8 |
| `segment_changes` | leg flexion (CAT-09), biomechanics (CAT-03), core (CAT-08, ATH-11), muscle size (CAT-02, VOL-17) |
| `kit_tokens`, `access_profiles`, `intake` | intake vocabulary (no band/chain tokens); 10 profiles (8 intake options + 2 derived) with intake_option, derived_from, kit, add-on ranking, slot status counts, empty slots, level gaps; intake steps (training experience, body weight, preference; sex removed) |
| `slot_meta` | per bucket: coach labels, library range, tier |
| `substitution_by_category[bucket][profile]` | ordered list; as-written entries {name, display_name?, cell, lvl, lvl_library?, c, skill, vel, fv, zone, laterality, src ('library' or 'coach_addition'), axial_load?, machine_role?, coach_pref? (informational), coach_description?, flag?, laterality_shift?, misfiled_not_this_pattern?, not_in_library?, source?}; substitutes {name, src, basis, substitute, flag, c, laterality, note?, laterality_shift?} |
| `gap_matrix[bucket][profile]` | status (full / thin / level_gap / substitute_only / gap), as_written, by_level, missing_levels, best_substitute_flag |
| `client_rules` | [{id, if, then, evidence, basis}] CR-01..CR-36 (CR-19 retired) |
| `client_families`, `picks_by_client_family` | six client families and the top-3 picks per slot × profile × family (athlete Tripple Extension picks set by `client_families.athlete.olympic_rule`, ATH-10) |
| `population_benchmarks` | MM population stats (canonical constraint, fast %, medball %) and BYOP family mixes |
| `intent_sequence`, `sequence_subrules`, `sequence_exceptions`, `sequence_exceptions_retired_v1` | tiers 0-9 (0b = core first) with buckets, implements, constraint, zone, load/reps observed, evidence; sub-rules; allowed and retired exceptions |
| `load_velocity` | principle, zones (observed vs science), medball rule, loaded jumps, plyo heights, Olympic, variable_resistance (out of scope), tempo, ROM, aerobic modality, speed bands, older adults |
| `machine_preferences` | coach answers, ranking (none), constraint differences, sheet opinions (informational), roles, rules |
| `coach_alternates` | every 'X or Y' string from the MASTER MODEL programs with cells; v1_use where a band route is excluded |
| `exercise_index[cell]` | per library item (and ADD-* additions): bucket, levels (operative, library, coach rule), zone, rotation bias, guidance, constraint, skill, stability, velocity, F-V zone, implement, laterality, axial load, machine role, equipment needs (with semantics), profiles where available, usage, suitability, preference, flag, display_name, coach_description, excluded |
| `open_questions` | answered_v0 (with the answer IDs), still_open, new_from_answers |

## Appendix B. Reproduce

```
.venv/bin/python synthesis/_build_10/build_10_equipment_model.py   # computed layer -> _computed.json
.venv/bin/python synthesis/_build_10/build_10_assemble.py          # -> synthesis/10_equipment_model.json
.venv/bin/python synthesis/_build_10/build_10_write_md.py          # -> synthesis/10_equipment_model.md
.venv/bin/python synthesis/_build_10/patch_10_v1_verify.py         # v1 verification fixes to the JSON (idempotent)
```

The v1 changes live in the same three scripts (search for "v1" and "COACH-ANSWER"); before editing them the v0 scripts reproduced the published v0 files byte for byte. The v1 verification pass (log at the end of this file) patched the JSON with `patch_10_v1_verify.py` and edited this `.md` by hand; the three build scripts do not contain those fixes yet, so a rebuild must be followed by the patch script and the md edits listed in the v1 verification log must be carried into `build_10_write_md.py`.

## Verification log

**v1 (2026-10-08).** Rebuilt from the edited scripts. Checks run by the build and recorded in `_meta.v1.verification`: 0 shown option names mention a band, chain or releaser; 0 curated substitutes need an excluded token; 0 profiles carry an excluded token. Cross-check against the decode tiers: FULL_FACILITY vs full_gym vs theirs_only: 13 differences, all through a band/chain route; BASIC_GYM vs commercial_basic vs theirs_only: 16 differences, all but U19, X12, AS19 through a band/chain route; HOME_DB_BENCH vs home_db_bench_bands vs theirs_only: 17 differences, all through a band/chain route; BASIC_GYM vs P4_commercial_gym vs theirs_only: 3 differences, all but C11, C48, G133 through a band/chain route; HOME_DB_BENCH vs P2_home_db_band vs theirs_only: 1 differences, all through a band/chain route. The level test (98 of 176 exact) is unchanged because it tests the library as written; additions are not part of it. Every COACH-ANSWER quote was checked against coach_answers_full.md.

**v0 (2026-10-08).** Adversarial fact-check of 10_equipment_model.md/.json and the four build scripts against raw/BYOP.xlsx and raw/MASTER_MODEL.xlsx (read with openpyxl), dumps/ and analysis/equipment/. Fixes were made in the build scripts and the outputs rebuilt, so a re-run reproduces them. Before the fixes the scripts reproduced the published files byte for byte.

**Checked:**

- Every library exercise name: all 432 exercise_index entries and every library entry of the 33 x 11 substitution lists match their MASTER EXERCISE LIBRARY cell (only L92 '5-10-5' is stored as a date, already flagged).
- All 84 OBSERVED / OBSERVED-lib curated substitutes: the name is in the cited cell (BYOP or MM).
- All 42 coach_alternates strings: n and cells re-found by scanning the MM program tabs (Copy of BASEBALL skipped). 42/42 match; J67/AP67 'toes to bar or knees to chest' carry a YouTube link after the text.
- About 150 other cited cells, colours included (ALL ABOUT SQUATS, RESISTANCE PATTERNS, BALLISTICS, LUNGES, OLYMPIC, Sheet23, Sheet25, BASEBALL, 4 TRACKS, CONJUGATE, BOXING, UL, PPL, FAT BURN, CROSSFIT, ATHLETIC FULL BODY; BYOP JUSTICE LEAGUE, ATHLETIC, AESTHETICS, PPL, BOOTCAMP 2, NO ACCESS).
- COACH-ANSWER quotes against coach_answers.md; COACH-CHAT quotes against the brief.
- Every [S#] used here exists in 10b section 12 and its topic fits the claim.
- Substitution lists: every curated substitute is flagged same_pattern only when it is the same movement; cross-pattern fallbacks carry partial / zone_shift / pattern_gap / rule. Implement and kit tags spot-checked on 45 ambiguous items.

**Recomputed with python:**

- Athletic/core dropdown constraint C1 100 / C2 33 / C3 10 / C4 0 / C5 9 of 152: matches.
- Resistance library mean constraint 2.66 over 283, 19% at C>=4, 10% at C1; small muscles 29/53 = 55% DB/KB, 0 high skill: matches.
- MM population table, all six populations (e.g. gen pop 719 tagged items, canonical 2.81, MM 3.31, C4-5 36%, fast 2%; athletes 945, 2.00, 2.26, 11%, 45%, medball 13%): matches.
- MM to canonical crosswalk by exact name match on 431 items: 1.27 / 1.97 / 2.18 / 3.19 / 5.0 vs published 1.27 / 1.95 / 2.19 / 3.19 / 5.0.
- Level test 98/176 exact, 157 within one level; per-bucket and per-cause counts; zone x level table (70 / 28 / 65): matches.
- Spearman BYOP rubric vs canonical = 0.877 (published 0.88) - but over 413 cells, not 426.
- 19 DB/barbell twin pairs; UNILATERAL KNEE DOMINANT AL9:AL21 mean 1.92; 6 overrides up / 14 down: match.
- Boxing weeks 1-2: canonical 2.76, machines 14%, fast 7% (matches); weeks 3-8: canonical 1.95 (published 1.6-1.8, corrected).
- Coverage matrix: as-written counts equal the distinct library names in each list in all 363 slot x profile cells.
- Ordering figures 13/13, 15/15, 225/231, 227/301, 178/244, 186/222, 107/121, 65/65, 48/51, 11/13, 12/14, 29 vs 2, 24 vs 2: match ordering_audit.md.

**Corrected (old -> new):**

1. JUSTICE LEAGUE 'constraint by position 1,1,3,1,1,2,3,1,1,5' had no scale: it is the BYOP program rubric; the canonical tags give 1,1,3,1,2,2,3,2,1,5 ('Power Clean' C92 and the FFE lunge AL15 are canonical 2). 'The only filled athletic day' -> 'only fully filled' (E13 'SL Depth Drops' and E35 'Low Bar Back Squat' are also chosen).
2. BYOP family table, no_access_hidden: the 26% in the Machine + cable column is the machine-only share; machine + cable is 30%, free weights 38%, bodyweight/field/props 31%, mean constraint 2.65 (prog_byop_equipment _group_comparison).
3. 'CrossFit is 96% barbell' mixed units: 96% is the keyword-scan share of implement-word cells (lib_resistance_notes); on line items barbell is 49/154 = 32% and the only loaded implement named. Fixed in section 2.1, implements.barbell and CR-06.
4. CR-01 medball target '19 EXAMPLE ATHLETIC' -> 28% of line items (27/98) / 19% of implement-word cells.
5. CR-07 boxing weeks 3-8 'constraint ~1.6-1.8' -> canonical ~1.95 (MM scale 1.96); machines ~8% added.
6. Sub-rule evidence 'MM UL/PPL 19/19 sessions' -> 6/6 (UL 3 + PPL 3); the 19/19 of audit R1 is BYOP 13 + UL/PPL 6.
7. '**MYO SET - ADVANCED' cited to ALL ABOUT SQUATS!B27, A30 -> C27 (label), B27 ('15/5/5/5/5/5'), A30 (definition).
8. Zone-2 ladder 'vs suitcase MODERATE C19:C22': the cells read 'Contralateral loading ' / 'Ipsilateral loading '; 'suitcase' is our reading and is now marked INFERRED.
9. Zone-1 ladder 'ALL ABOUT LUNGES!C22:C30' included the zone-2 'on shoulder' loads C25:C27 -> C22:C24 + C28:C30.
10. 'push press and jerks AA11:AA14, which the coach's own RP traffic light colours red': RP does not list push press or jerk; it colours every standing overhead press red (RP!E13:E15). Reworded.
11. Home DB + bench + bands gaps 'the FOUNDATIONAL leg-flexion ... levels' -> INTERMEDIATE leg flexion (AN18 is FOUNDATIONAL and available), INTERMEDIATE knee-dominant, FOUNDATIONAL horizontal pull, ADVANCED triple extension (gap_matrix).
12. Basic-gym reading: the 4 Olympic lifts, 6 hurdle plyos and 'Max velocity running' / 'Bounding' are already missing in FULL_GYM; BASIC_GYM also loses 'High Depth Drop (above hip)' (hip-high box) and 'Hex bar squat to calf raise'.
13. Scale crosswalk 'over 426 shared cells' -> 413 (427 BYOP-classified cells, 413 of them in exercise_index); 'MM means run about 0.3-0.5 above canonical' -> 0.25-0.5 (athletes +0.26).
14. COACH-CHAT quotes were longer than the brief they cite ('put your feet on the ground, and move your hands or your feet', "but it's also safer", 'people who have injuries, or people who are older', 'need to be light, 10 lbs., 8 lbs.') -> replaced with the brief's wording. CAT-04 quote: restored '(more positioning, stability and skill needed)'. The bilateral/unilateral 'must keep' rule is now labelled as our application of the coach's statement.
15. 'KB Face Pulls ' U20 (misfiled under VERTICAL PULL; a rear-delt / horizontal pull) was option 1 of the KB_ONLY RP_VPULL list -> moved after the substitutes and flagged misfiled_not_this_pattern (it was already excluded from counts and picks).
16. Duplicate options removed: 'KB swing' twice in RP_BHD KB_ONLY (library AN20 + substitute); 'Bodyweight single-leg RDL with reach' twice in all 11 FOCUS_GLUTES lists.
17. Leg-flexion substitutes 'Glidder hamstring runners', 'Swiss ball leg curls', 'Banded rolling hamstring curls': the coach writes them in the 'uhd' slot (MM BASEBALL!AH36, AP36, J54). Note added; CAT-09 still files knee flexion separately.
18. Calf substitute evidence 'ankle/hurdle hops in the calfs slot' -> ankle hops only (BASEBALL 'calfs' slots hold calf raises and DB / heavy / high ankle hops, no hurdle hops).
19. 'near-failure work is safest at constraint >= 4 [S11][S20][S21]' was given as SCIENCE; none of the three tests failure safety by implement -> marked INFERRED with what each source does show.
20. Level-test bucket label 'FBS_CHOPS' -> 'FBS_CHOP_ANTIROT' (the real bucket id).
21. Smaller precision fixes: banded RP box squats are A26:A27 + A29:A30 (the unbanded A25/A28 are red too); Sheet23 AA1 header has no level; '50 situps + 50 crunches + 50 reverse crunches' located (MM EXAMPLE ATHLETIC FULL BODY SPLI!J25/F67); CR-16 hang pulls C49:C54 include the high/mid-hang pulls; population table header now 'Items with a constraint tag' (athletes 945 of 949 line items); pick names in section 2.3 no longer cut mid-word; zones.py no longer tags the COD route 'COMEBACK/CURL' (L91) as an arm curl in zone 1.

**Checked and left as is:**

- HYBRID 'STRENGTH' above 'OLY/ POWER': ordering_audit counts 16/16 (Mon/Thu); prog_mm_equipment counts 24/24 (Mon/Tue/Thu). Both are OBSERVED subsets.
- FOUNDATIONAL mean 2.98 / ADVANCED 2.21 and 'X ADVANCED 6/9 barbell' come from lib_resistance_notes (six levelled categories); the model's own kit tags let X48/X49 'Bent Over Rows ...' be done with dumbbells.
- Constraint, zone, skill and implement tags stay INFERRED from exercise names (the library has no equipment column).
- Science spot-check: [S35] R^2 ~0.98, [S43] jump-squat optimum 0-30% 1RM, [S69] seated > prone leg curl, [S80] ACSM order, [S94] variable resistance at >= 80% 1RM, [S97] chains about +10% bar velocity - consistent with those papers. [S63] is listed in 10b as Front Physiol 2026;16 (volume/year look inconsistent); not re-checked here.

## v1 verification log

**Date 2026-10-08. Scope:** adversarial check of the v1 update of this file, `10_equipment_model.json` and the band / variable-resistance passages of `10b_equipment_variables_science.md`. Method: `coach_answers_full.md` (and `coach_answers.md`) re-read in full; every answer that touches equipment checked against the tables, rules, picks and lists here and in the JSON, not just the v1 change list; the md, JSON (every string value, with its key path) and 10b grepped for the retired ideas. JSON fixes are applied by `_build_10/patch_10_v1_verify.py` (idempotent, logged in `_meta.v1.verification_pass_2`); md and 10b fixes were made by hand.

**Coach answers relevant to equipment and how v1 reflects them** (OK = built into the tables / JSON; FIXED = wrong or incomplete in v1, fixed in this pass):

| Answer(s) | What it says | Where in v1 | Result |
|---|---|---|---|
| EQ-01, EQ-02, EQ-07, EQ-08 | no bands anywhere; ideal home kit DBs + bench + pull-up bar + 8-10 lb medball; no band chops; no band leg extension | kit tokens, profiles, intake, 30 removed substitutes, 14 excluded cells, CR-20/27/34/36, picks | OK in shown lists; FIXED: 13 live library entries still listed a band as an equipment route in `needs` (AZ91, AZ129, BC9-BC18 twins, BC46, BC47, BC91, O92, O93) and 9 FBS items still had implement 'cable/band' (J1) |
| EQ-12 | no variable resistance (bands, chains, weight releasers) | 5 'Variable resistance: out of scope'; CR-03 dynamic effort with straight weight; out_of_scope_implements | OK; FIXED the bodyweight-implement evidence line that still listed 'REVERSE BANDED' without a marker (J10) |
| EQ-03, EQ-04 | older / injured / high-volume: machines for compounds and isolation; never overhead squat, snatch, low-bar squat, depth jumps; FOUNDATIONAL clients may use MODERATE/ADVANCED machines | CR-10, CR-12, CR-14, CR-33, older_or_pain picks (no never-list item in any pick), LV-4 | OK; FIXED CR-11: v1 moved high-functioning 60+ clients' main lifts to free weights (constraint 2-3) by default in block 2+, against EQ-03 - default now machine/cable-leaning, free weights a PROPOSED option, new open question 12 (J3) |
| EQ-05 | add a seated machine shoulder press | ADD-EQ05, constraint 5 | OK |
| EQ-06, ATH-05 | medball weights; never over 20 lb; no throwing for aesthetics except the warm-up | load_velocity.medball_rule, CR-34, hypertrophy picks 'not used' | OK in this file; 10b FV-6 and its flags still carried the v0 numbers and the female -2 lb modifier inline - marked SUPERSEDED/RETIRED there |
| EQ-09, EQ-10, GEN-04 | default implement BW -> DB -> barbell by level; client preference can choose; default + dropdown per slot | CR-30, CR-31 | OK |
| EQ-11 | no machine ranking; hack squat / leg press more constrained than Smith; belt squat for axial sparing; GHD / reverse hyper if available and felt | section 6, GRD-4, CR-22, lists ordered by constraint (leg press 5, hack/pendulum 4 before Smith); no preference bonus in picks | OK (hack squat is not last anywhere); 10b EQ-8 and 1.2 still said 'keep his ranking' - marked RETIRED there |
| EQ-13 | 1-5 constraint scale | 1.3 | OK |
| EQ-14, ATH-07, FIX-02 | any erg; distance, calories or time; 3 / 2 / 4 aerobic sessions + walks | CR-35, load_velocity.aerobic_modality | OK |
| EQ-15, EQ-16, GEN-02 | loaded jumps 10-20 % BW; box / hurdle heights; body weight at intake | 5, CR-04, intake | OK |
| CAT-04, CAT-05, CAT-06, PER-06 | level = skill + stability + load position; machines/cables easier; levels add options and are 'still very theoretical'; move up at block end if it felt '8' with no pain | 1.4, LV-1..8, overrides | FIXED LV-5: it moved every client one zone per block; now only when PER-06 says the slot moves up, and optional (J4). FIXED the stale '6 entries up to ADVANCED' in `_meta.changes_from_coach_answers` (v1: 4 up, 14 down, 2 'any') (J5) |
| CAT-10, CAT-11 | zones are rotation biases; vertical (hands down, overhead, deep squat) external, horizontal (hands in front, knee at hip height) internal; zones do not apply to plyos; plyo method receive & pause -> receive then create -> repeated, unnamed | rotation_bias tag, LV-7, plyo zone tags removed | Plyo tags OK (all 39 AP_PLYO items zone-free). FIXED: the rotation bias of 55 lower-body entries was mapped from the load position only (a full-depth front squat read 'half squat / internal'); both readings now stated, with the depth rule for hips and knees (J6, 1.4 note). FIXED: ankle hops C126:C136 now cite CAT-10 (J9). FIXED: the substitute flag 'zone_shift' (a velocity-zone change) was undefined now that 'zone' means a Davidson zone (J7; 3.4 header, CR-20, 5 table header) |
| CAT-13, UNI-02, UNI-03, UNI-08, UNI-10 | contralateral into the hip (COD athletes), ipsilateral out of the hip (sprint acceleration), health accessory for bodybuilders / powerlifters in the first 2-4 weeks; ratio 90/10 to 10/90; keep sets if possible when going unilateral; in-season minimal bilateral | CR-25, CR-32, CR-21, CR-12 | OK; 10b 9.1 still listed contralateral -> ipsilateral as a difficulty ladder - marked v1 there |
| ATH-10, CR-01 | everyone in athletic training gets Olympic lifts (beginners hang / no-bumper and DB/KB; intermediate+ full lifts) | CR-01, CR-15, CR-16, ADD-ATH10-1..4 | FIXED: the athlete family's Tripple Extension picks had no Olympic work in any of the 10 profiles (the constraint score put 'BodyWeight Squat to calf raise' and 'Lunge to high knee reach' first); now set by rule - Power Clean / hang cleans / Squat Clean or Power Snatch with a bar, DB/KB snatches and cleans at home, a pattern_gap note with no load, a PROPOSED heavy-medball hang clean in the field kit (J2; 2.3) |
| ATH-09, GEN-02 | no sex-based rules; youth may do some Olympic lifts from the floor; older few plyos | CR-18, CR-19 retired, intake without sex | OK here; 10b section 0 row 5, 3.7, FV-6, F3 and Q2 still used 'female' - marked |
| ATH-11, VOL-17, ORD-01..06, ORD-10, UNI-11, PER-04 | core first (movable); calves 3 sets each leg day; rear delts own sets; row before pulldown but main lift first; power before strength; hip-dominant + push, knee-dominant + pull everywhere incl. bootcamps; supersets as a fatigue tool; one axial squat day | section 4 tiers 0b / 8, sub-rules, retired exceptions, CR-28, CR-29 | OK here; 10b ORD-1 ('core finisher'), ORD-7 (core by family) and ORD-4 (supersets only when short) were unmarked - marked |
| ATH-13, FIX-03 | 'Justice League' was a marketing name; names must be general | section 4 note, `_meta.tab_names_note` | FIXED: the tab is now explicitly a cell citation only and the generator name is the 01/04 one, 'All-around athletic / weekend warrior (non-competitive adults and youth)' (J8) |
| PER-01, PER-02 | 4-6 weeks = maintenance / transition at ~50-70 % volume; 8 = 4 + 4; 12 = 2-4 / 4-6 / hardest last; blocks 4-6 weeks | file header, CR-24 | OK here; 10b VARI-1 still carried the '6-week plan = 1 block, 12 = 2 × 6 or 3 × 4' arithmetic - marked SUPERSEDED |
| VOL-04, VOL-05, VOL-07, VOL-09, UNI-05 | 3/5/7 % of weekly sets by the person's state (not muscle size), 10 %/week too much; added sets to the first exercise first; helpers 0.25 | CR-14 (VOL-07); no size-based % and no 0.5 helper credit anywhere in this file or the JSON | OK here; 10b 5.2, VOL-1, VOL-3, VOL-4, F8 and 9.4 still carried 0.5 synergists, 3/5/7 % size tiers and 'compounds 3-5 %' - marked RETIRED / SUPERSEDED |
| LIB-02, LIB-06, LIB-07, LIB-08, LIB-09, LIB-13, LIB-14, LIB-15, LIB-16, LIB-18, LIB-19 | library details (push-up stick the landing, throws and GHD without levels, 'Squat' names, Camporini and strap rotating out, Kong row, push press F / push jerk I, dips 0.5/0.5, marathon flag, carries) | exercise_index descriptions, display names, overrides, lists | OK; 10b F12 still said push press INTERMEDIATE+ for non-athletes - marked CLOSED by LIB-13 |
| VOL-11, PRG-03, PRG-05 | 40-rep sets only as a CrossFit / AMRAP option; bootcamp circuits; novice / intermediate definitions | CR-06, CR-05, CR-15, CR-16 | OK |

**Retired ideas, grep results after the fixes** (md, every JSON string with its key path, 10b):

| Retired idea | 10_equipment_model.md / .json | 10b |
|---|---|---|
| 3/5/7 % mapped to muscle size | none | marked RETIRED (5.2 item 3, VOL-3, F8, 9.4) |
| 0.5 helper credit | none (dips 0.5/0.5 is the coach's own LIB-16 case) | marked RETIRED (5.2 item 2, VOL-1) |
| band / chain / weight-releaser substitutes | none shown or live; remaining mentions are exclusion records, out-of-scope notes and the v0 history tables | section 8 under the OUT OF SCOPE banner; AR-1..6 SUSPENDED; one generator-directed line in 8.2 reworded |
| plyo zones as a fixed exercise property | none (39 plyos and 11 ankle hops carry no zone) | none |
| core after the power block as the default | only as the retired exception / OBSERVED BASEBALL citation | ORD-1 and ORD-7 marked |
| sex-based rules | only the retired CR-19 record and the 'sex removed' intake note | marked (section 0 row 5, 3.7, FV-6, F3, Q2); study populations left as they are |
| Justice League as a program name | tab citations only, now stated (section 4, `_meta.tab_names_note`) | tab citations only |
| hack squat ranked last | none; it appears only in the EQ-11 quote and the 'v0 demoted it' history row | EQ-8 and 1.2 marked RETIRED |
| 6-week = 5 weeks + deload | none | VARI-1 v0 arithmetic marked SUPERSEDED |

**Fixes made in this pass:**

1. JSON J1-J13 (`_meta.v1.verification_pass_2`; J13 adds the two new PROPOSED items to `_meta.v1.pending`): band routes out of 13 live `needs` entries and 9 implement tags (availability unchanged in all 10 profiles, asserted by the script); athlete Tripple Extension picks per ATH-10; CR-11 default per EQ-03 with a PROPOSED free-weight option; LV-5 tied to PER-06 and optional; override count corrected; rotation bias for hips/knees per CAT-10 (`level_model.rotation_bias_scope`); `_meta.substitute_flag_definitions`; `_meta.tab_names_note`; ankle-hop zone basis; 'REVERSE BANDED' evidence marked; open question 12; open-question count 11 -> 12.
2. This md: CR-11 row; LV-5; the rotation-bias note in 1.4 and the zone summary in the 'Earlier coach answers' list; the 2.3 athlete Tripple Extension cells (FULL_GYM, HOME_DB_BENCH, BODYWEIGHT) and the rule sentence above the tables; zone_shift defined (3.4 header, CR-20, Olympic paragraph); load-velocity table header 'Velocity zone (not a Davidson zone)'; Justice League naming note (section 4); open question 12; v1 change item 31 count; Appendix A/B (new JSON keys, patch script, rebuild warning).
3. 10b: inline v1 markers at section 0 row 5, 1.2, EQ-2 (older high-functioning row), EQ-8, 3.7 item 1, FV-6 (banner + retired modifier), 5.2 items 2-3, VOL-1, VOL-3, VOL-4, VARI-1, ORD-1, ORD-4, ORD-7, 8.2 item 1, 9.1 load laterality, 9.4 athlete / older / fat-loss rows, F3, F8, F12, section 11 questions 2-5, 7, 9, 10; the header note now says the markers exist.

**Checked and left as is:**

- Constraint 4 for the hack squat and pendulum vs 5 for the leg press: matches the approved EQ-13 scale (5 = seated machine with back pad) and EQ-11's order (both more constrained than the Smith); still open question 10.
- Kong row is listed only in the KB_ONLY lists; it is a pain option wherever two kettlebells exist, but nothing contradicts LIB-09.
- 'Single Arm DB snatch from floor' (ADD-ATH10-2) is available in KB_ONLY because its needs are DB or KB (the coach writes 'db or kb' as interchangeable); the KB-only pick carries that note.
- The athlete family's other picks (e.g. push-ups first for horizontal push in a full gym) come from the v0 constraint score and contradict no coach answer; not changed here.
- The decode teams' tier names ('home_db_bench_bands', 'P2_home_db_band') stay as they are: they are other files' ids, cross-checked with bands removed.
- Quotes: every quote attributed to a COACH-ANSWER in this file was matched against `coach_answers_full.md` / `coach_answers.md` by script; the only non-verbatim strings are sheet cell names and the paraphrased question 'core after the power block'.

**Reproducibility:** the three build scripts do not contain these fixes. After a rebuild, run `patch_10_v1_verify.py` for the JSON and carry the md edits above into `build_10_write_md.py`.
