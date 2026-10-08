# Coverage matrix: the coach's 138 answers in the master and the spec

Audit date 2026-10-08. Source of truth: `coach_answers_full.md` (140 questions; 138 answered, of which PRG-01 and FIX-01 were SKIP; LIB-10 and LIB-12 unanswered, listed at the end). Checked against `BLAZE_CAMP_BRAIN.md` (v1) and `generator_spec_v1.json` (now 1.0.1). Section numbers are the master's (§); spec keys are dotted paths under `rule_tables` unless they start with another top-level key (`inputs_schema`, `plan_types`, `tests`, `adaptation`, `validation_checks`, `vocab`, `template_refs`, `output`, `open_decisions`, `_meta`, `pipeline`, `coach_rule_hooks`); `inputs F..` = `inputs_schema.fields.F..`.

**Status.** OK = the rule is in both files and matches his answer. FIXED = it was MISSING or WRONG in the master and/or the spec and has been corrected in place during this audit (the note says what was wrong). No row is left MISSING or WRONG.

**Result.** 106 OK, 32 FIXED (3 were WRONG; 29 were MISSING or incomplete, mostly a rule the spec lacked, plus gaps in both files (FIX-02; VOL-02's missing L1 priority cap), one wrong cross-reference (PER-01) and one leftover name (ATH-13)). Machine check (team venv): every one of the 138 IDs is cited at least once in the master and in the spec; the spec parses; `round2_questions.json` parses and keeps the required format.

## Matrix

| ID | Coach rule (one line) | Master (section) | Spec (key) | Status |
|---|---|---|---|---|
| CAT-01 | Tag every exercise on every lens at once (family, pattern, laterality, plane, size, muscles, equipment, level); 'this is huge' | §1.2 #1; §2.1 S1; §2.6 | rule_tables.taxonomy.all_lenses; coach_rule_hooks.coach_added_exercises; template_refs.exercise_catalog | OK |
| CAT-02 | Big = quads, glutes, hamstrings, lats/upper back, chest; small = biceps, triceps, side/rear delts, calves, forearms, abs (RIGHT) | §2.1 S3; §5.3 | rule_tables.muscles; vocab.muscles | OK |
| CAT-03 | Biomechanics is the description of every exercise, not its own bucket | §2.1 S4; §2.2 | rule_tables.taxonomy.biomechanics | FIXED (was MISSING in spec) |
| CAT-04 | Level = skill + stability + load position (front/low foundational, on the body intermediate, behind/overhead advanced); machines/cables easier; Davidson zones | §3.1 L1-L2; §3.2 | rule_tables.levels_exercise.rule, .davidson_zones | OK |
| CAT-05 | Levels add options, never remove them; 'still very theoretical' | §3.1 L3 | rule_tables.levels_exercise.rule; rule_tables.taxonomy.levels | OK |
| CAT-06 | Client level (volume) and exercise level (movement difficulty) are separate (RIGHT) | §3.1 L4; §3.3 | rule_tables.taxonomy.levels.client_vs_exercise_level | FIXED (spec only carried the tag; rule text added) |
| CAT-07 | BYOP MASTER EXERCISE LIBRARY = single source of truth (RIGHT) | §2.1 S8; §4.1 C2 | rule_tables.taxonomy.source_of_truth; template_refs.exercise_catalog.default_pick | FIXED (was MISSING in spec) |
| CAT-08 | Core: trunk moves on a still pelvis (thorax) vs pelvis moves on a still trunk; both; any plane | §2.1 S5; §2.7 | rule_tables.taxonomy.core_segments; counting.credit_map.CORE | FIXED (spec only had the credit tag) |
| CAT-09 | Leg curls, Nordics, slider curls = leg-flexion bucket, not hip dominant | §2.1 S6; §2.3; §5.2 | counting.credit_map.LEG_FLEXION; vocab.retired_ids | OK |
| CAT-10 | Zones = rotation biases (vertical ER; horizontal zone 2 IR, compressive); not for plyos; receive before create; start ballistic then plyometric; unilateral plyos harder | §3.2; §9.1 A1-A3; §9.3 | levels_exercise.davidson_zones; athletic.plyo_vs_ballistic.rule; athletic.method_stage | OK |
| CAT-11 | The plyo progression is a way to do plyos, not a zone; no name yet | §2.5 F.PMETHOD; §9.3 | athletic.method_stage.name, .not | OK |
| CAT-12 | Did not understand the 'grammar' question | §2.7; §7.6; §16.1 | open_decisions.not_understood (round 2 R2-LIB-01) | OK (re-asked in plain words) |
| CAT-13 | Contralateral pulls into the hip (COD athletes); ipsilateral helps out (sprint acceleration, ipsilateral step-ups); BB/PL: health accessory mostly weeks 1-4 | §6.1 B6; §6.3 | rule_tables.contra_ipsi; bilateral_unilateral.contra_ipsi | OK |
| UNI-01 | 10/10 = 1 set, counted mostly for quads; 15-20 sets = maintenance to some growth, 20-25 = growth; 5 too little, 40 too much | §5.1 V3, V5; §5.2 | counting.unilateral; counting.credit_map.UKD; weekly_sets.landmarks_coach | FIXED (landmark ranges were missing in spec) |
| UNI-02 | Bilateral:unilateral 90/10 to 10/90 by athlete, adjustable, pain adjusts; BB/PL ~50 -> 80/20-90/10; field/COD 80-90 % unilateral | §6.1 B1-B3; §6.2 | rule_tables.bilateral_unilateral | OK |
| UNI-03 | Upper body follows the same logic | §6.1 B4; §6.2 | bilateral_unilateral.definition; bilateral_unilateral.profiles[0].upper | FIXED (was WRONG: BB/PL upper 80-90 % bilateral from week 1; now ~50/50 in weeks 1-4 -> 80/20-90/10) |
| UNI-04 | Unilateral moderate-high reps by default; heavy low-rep unilateral optional for athlete/coach | §6.1 B10; §7.1 T6 | reps.unilateral.heavy_toggle; inputs_schema.fields.F44.fields.heavy_unilateral | OK |
| UNI-05 | Unilateral progresses like bilateral; 3/5 % by the person; 10 %/week too much | §5.1 V8, V16 | counting.unilateral.progression; rate_engine.principle, .hard_ceiling | FIXED (spec lacked 'progresses the same') |
| UNI-06 | Same-pattern pairing to drive a muscle (high level, aesthetics); cross-pattern for bootcamp (less soreness) | §6.1 B8; §10.1 W6; §10.3 | pairing.same_vs_cross; bilateral_unilateral.pairing | OK |
| UNI-07 | Alternating lifts count as unilateral (RIGHT) | §5.1 V3 | counting.unilateral.rule | OK |
| UNI-08 | Pain swap bilateral -> unilateral keeps the sets ideally, adjust accordingly (PARTLY) | §5.1 V7; §5.7; §6.1 B11 | rule_tables.pain[1] | OK |
| UNI-09 | Account for unilateral time; athletes/BB/PL ~1.5 h (max 2 h); weight loss/everyday 45-60 min (PARTLY) | §5.6; §10.1 W14; §10.5 | session_limits.session_minutes; counting.unilateral_time_cost; time_model; inputs F24.defaults | OK |
| UNI-10 | In season bilateral minimal; unilateral keeps range and health (RIGHT) | §6.1 B5; §6.2; §9.8 | bilateral_unilateral.profiles[3]-[7].in_season; plan_types.season.in | OK |
| UNI-11 | Hip dominant + push, knee dominant + pull, to avoid bleed-over | §10.1 W2; §10.3 | pairing.hip_push_knee_pull; set_placement.hard_rules; validation_checks.V11_pairing | OK |
| UNI-12 | More frontal/transverse unilateral work for court and combat athletes; little for aesthetics (RIGHT) | §6.1 B7; §6.4 | bilateral_unilateral.frontal_transverse_share_of_unilateral | OK |
| VOL-01 | Start beginner 10-12, intermediate 15-20, advanced 20+; match research charts; learn from users' data | §5.1 V5, V20; §5.3; §5.8; §5.9 | weekly_sets.muscles.<muscle>.start; weekly_sets.landmarks_coach; learning | OK |
| VOL-02 | Priority +4-6 sets, cap about 25-30, 1-2 at a time; refine with data (PARTLY) | §5.1 V6; §5.3 | rule_tables.priority; weekly_sets.muscles.<muscle>.priority | FIXED (no L1 priority cap existed, so a beginner priority muscle started at its cap; L1 cap + 4 added, PROPOSED) |
| VOL-03 | Pain: that muscle/pattern -30-50 %, machines or split grips, or drop the exercise | §5.1 V7; §5.7 | rule_tables.pain | OK |
| VOL-04 | 3/5/7 % = of weekly sets per muscle; load not driven by % (RIGHT) | §5.1 V8 | rate_engine.principle | OK |
| VOL-05 | The step is chosen by the person's state, never by muscle size; coach can adjust | §5.1 V8; §5.4 | rate_engine.principle, .checkin_step_table, .planned_rate_before_logs, .hand_set_range | OK |
| VOL-06 | Bank and round; the tool computes the percentages | §5.1 V9; §5.5 | rule_tables.banking; adaptation.user_sees | OK |
| VOL-07 | 3-4 exercises per muscle per day; add to the first exercise first (2/2/2 -> 3/2/2 -> 3/3/2 -> 3/3/3 -> 4/3/3); small muscles at the end get a bonus exercise | §5.1 V10-V11; §5.5 | set_placement.steps[2], [5]; session_limits.exercises_per_muscle_on_its_day | OK |
| VOL-08 | Usually 7 exercises; field athletes off-season more (up to 3 plyo + 3 Olympic + 4 resistance, max ~12) (RIGHT) | §5.6; §10.1 W13; §10.5 | session_limits.resistance_exercises, .field_athlete_off_season | OK |
| VOL-09 | Helpers 0.25, not 0.5 | §0.3; §2.4; §5.1 V2; §5.2 | counting.credit_map (BHD/UHD glutes 0.25) | FIXED (was WRONG: hinge glute credit 0.5, a leftover of 0.5 helpers) |
| VOL-10 | Athletic patterns never count toward muscle sets (RIGHT) | §2.1 S7; §5.1 V4; §9.1 A19 | athletic.counting; counting.credit_map['ATHLETIC (...)']; athletic.never_counts_to_muscles | OK |
| VOL-11 | Small 12-30 reps, big 5-15 mixed; 40-rep sets disliked, only an optional AMRAP/CrossFit style | §7.1 T1; §7.3 | reps.by_size; reps.forty_rep_sets | OK |
| VOL-12 | Preference moves reps on big compounds only; weekly sets similar (RIGHT) | §7.1 T2; §7.3 | reps.preference_styles; inputs F10 | OK |
| VOL-13 | RIR is his scale (1-3; MAX = technical failure on small/bodyweight); RPE as explanation | §7.1 T3; §7.4 | rule_tables.effort; session_limits.effort | OK |
| VOL-14 | Rest: hypertrophy 1-2 (up to 3) min, strength 3-6, athletic as prescribed | §7.1 T4 | rule_tables.rest; session_limits.rest | OK |
| VOL-15 | MYO only on the last exercise, machine or isolation (RIGHT) | §7.1 T5; §7.7 | effort.myo; ordering.hard.VOL-15; counting.myo_set | OK |
| VOL-16 | Defaults 3 compound / 2 isolation; athletic templates 2; ~5-7 exercises | §5.1 V14; §10.5 | session_limits.default_sets | OK |
| VOL-17 | Calves 3 sets each leg day; rear delts own sets; ~2 core exercises; field-athlete session layout (PARTLY) | §5.1 V13; §10.1 W16; §10.2 | weekly_sets.muscles.calves, .rear_delts, .abs_obliques; rule_tables.core_block; validation_checks.V18_minimums | OK |
| VOL-18 | Unbalanced templates were unintended: balance; V-taper bias only when wanted | §5.1 V17 | weekly_sets.balance; inputs F09 (v_taper) | FIXED (spec had only the V-taper option) |
| PER-01 | 4-6 wk maintenance at 50-70 %; 8 wk = 4 adapt + 4 drive, start hard; 12 wk preferred (2-4 acclimation, 4-6 drive, hardest last); next cycle one level up; week-by-week; yearly (NOT RIGHT to v0) | §11.1 P1-P7; §11.2-§11.5 | plan_types.*; inputs F25, F25b, F25c | FIXED (master P6 pointed to §11.8 instead of §11.5; L1 4-week acclimation now tagged PROPOSED) |
| PER-02 | Exercises fixed for a 4-6-week block; 1-2 small variables change next block (RIGHT) | §7.1 T10; §7.6; §11.1 P8 | set_placement.block_rule; plan_types.fixed_12.blocks | OK |
| PER-03 | A/B lead-lift weeks for people who want variety | §7.1 T11; §7.6 | inputs F44.variety_ab; set_placement.block_rule | OK |
| PER-04 | Second exposure = different exercise; spine loaded once a week (squat once, leg press/belt squat the other day; deadlifts load the spine) | §7.1 T12; §10.1 W4-W5; §10.4 | set_placement.second_weekly_exposure; rule_tables.axial_loading; validation_checks.V10_axial | FIXED (second-exposure rule was only implicit in pipeline text) |
| PER-05 | Deload = about half the sets, same exercises, lighter / 3+ RIR, no buy-out or finisher (RIGHT) | §11.1 P9; §11.6 | plan_types.deload | OK |
| PER-06 | Level up at block end on '8' or easier, no pain (RIGHT) | §3.1 L8; §11.1 P10 | levels_exercise.level_up; adaptation.exercise_rules | OK |
| PER-07 | Tests ticked at block start (or none); reminder before the test | §12.1 X1-X2; §12.2 | tests.*; inputs F26b | OK |
| PER-08 | Seasons; in-season sprints for speed athletes, strength maintenance or jumps for others | §9.1 A15; §9.8; §11.1 P12 | plan_types.season; goal_phase_modifiers[7], [8] | OK |
| PER-09 | Strength template 80/80/85/85/90/90 % at RPE 7 -> 10; Olympic 75 -> 90 % with 4x8 -> 4x4 | §7.1 T18; §9.5 | rule_tables.strength_template; athletic.olympic.ramp | FIXED (main-lift % template was missing in spec) |
| PER-10 | Smooth increases for hypertrophy/general; 2-week steps and waves for fight/competition prep (RIGHT) | §5.1 V19; §11.1 P14; §11.2 PREP | plan_types.prep; rate_engine.phase_limits.prep | OK |
| PER-11 | VOL 1/2/3 one per off-season block for every athlete (RIGHT) | §7.1 T8; §9.1 A16 | reps.athlete_phases | OK |
| ATH-01 | Plyo vs ballistic set by the sport's ground-contact time | §9.1 A1; §9.2 | athletic.plyo_vs_ballistic | OK |
| ATH-02 | Plyo ranking basketball = volleyball > sprinters > football skill > soccer > MMA > tennis > baseball > hockey > wrestling/BJJ > boxing = karate > golf (RIGHT) | §9.1 A4; §9.2 | athletic.plyo_volume_ranking | FIXED (ranking existed only as a tag) |
| ATH-03 | More resistance: linemen, wrestlers, rugby, heavyweights, throwers; more speed/power: sprinters, basketball, skill positions, volleyball (RIGHT) | §9.1 A5 | athletic.resistance_vs_speed_groups; goal_phase_modifiers[6] | FIXED (speed/power group missing in spec) |
| ATH-04 | Boxers: reduce pressing/arm volume in high-punch weeks, never cut it | §9.1 A6; §9.9 | athletic.strikers; goal_phase_modifiers[9] | OK |
| ATH-05 | Medball high for rotational sports; none for aesthetics except the warm-up | §9.1 A7; §9.6 | athletic.medball; rule_tables.warmup.aesthetics_medball; validation_checks.V16_aesthetics | OK |
| ATH-06 | COD route names for every athlete, tiered by turn (RIGHT) | §9.1 A8 | athletic.cod | OK |
| ATH-07 | Aerobic 3 general/fat loss, 2 athletes in season, 4 aesthetics/bodybuilders + long walks (PARTLY) | §9.1 A9; §9.7 | conditioning.sessions_per_week; session_limits.aerobic_sessions_per_week | OK |
| ATH-08 | Pitchers: less overhead, more arm care, light rotational throws (RIGHT) | §9.1 A10; §9.9 | athletic.pitchers | OK |
| ATH-09 | Older: few plyos unless asked; no sex-based rules; youth may do some floor Olympic lifts (PARTLY) | §9.1 A11; §9.9; §5.3 | athletic.older; goal_phase_modifiers[10], [11]; athletic.olympic.youth; validation_checks.V4_youth, .V5_older | OK (youth example rule pack now labelled stricter than the default) |
| ATH-10 | Everyone in athletic training gets Olympic lifts; beginners DB/KB/hex/hang; intermediate+ full scope | §9.1 A12; §9.5 | athletic.olympic; validation_checks.V19_olympic | OK |
| ATH-11 | Core first for everyone (warm-up), movable by the user (NOT RIGHT to v0) | §10.1 W1; §10.2 | ordering.tiers, .defaults.ATH-11; rule_tables.core_block; inputs F44.core_position | OK |
| ATH-12 | Contrast: intermediate+ athletes, off-season, 78-85 %, no rest inside (RIGHT) | §9.1 A13; §10.6 | athletic.contrast | OK |
| ATH-13 | 'Justice League' = marketing name for non-competitive athletic adults/youth; use a generic name (PARTLY) | §9.1 A14; §9.9; App. A | vocab.program_names[4]; profile weekend_warrior; library_decisions.renames | FIXED (two master lines still used the tab name as a label; reworded) |
| ORD-01 | Row before pulldown, always (RIGHT) | §7.7; §10.1 W7 | ordering.hard.ORD-01 | OK |
| ORD-02 | 'The work' first regardless of direction (RIGHT) | §7.1 T13; §7.7 | ordering.hard.ORD-02 | OK |
| ORD-03 | Power before strength (RIGHT) | §7.7 | ordering.hard.ORD-03 | OK |
| ORD-04 | Small muscle first only when it is the priority (RIGHT) | §7.7; §5.1 V6 | ordering.defaults.ORD-04; priority.order_in_session | OK |
| ORD-05 | Supersets = fatigue/density tool: short time, advanced needing more, off-season VO2/mitochondrial, beginners who don't fatigue (PARTLY) | §7.1 T15; §10.6 | supersets_contrast_circuits.use_cases; inputs F44.supersets_for_fatigue | OK |
| ORD-06 | Bootcamp 1 Tue/Fri was a mistake: hinge + push, knee + pull in full body and bootcamps | §10.1 W3; §10.3 G2 | pairing.bootcamp_1_tue_fri | OK |
| ORD-07 | The work / the accessory / the nuance / the survival (RIGHT) | §7.1 T14 | effort.strength_roles; strength_template.roles | OK |
| ORD-08 | Always a warm-up (5 min any cardio + A-drills or mobility); A-drills never volume (RIGHT) | §10.1 W8; §10.2 tier 0 | rule_tables.warmup; counting.hard_set | FIXED (warm-up content missing in spec) |
| ORD-09 | Fighter/hybrid opening cardio is a real aerobic block (RIGHT) | §10.1 W11; §9.7 | conditioning.rules; ordering.defaults.ORD-09 | OK |
| ORD-10 | Optional days as add-ons or separate days, ideally separate (PARTLY) | §10.1 W12; §5.1 V12 | inputs F44.optional_days; conditioning.placement | OK |
| ORD-11 | Focus slots may hit the same muscle, 2-3 sets each (RIGHT) | §5.1 V12; §2.4 | priority.delivery | OK |
| EQ-01 | Intake equipment options minus bands; he never programs bands | §8.1 E1-E2; §8.4 | inputs F27; vocab.equipment_profiles; equipment.no_variable_resistance | OK |
| EQ-02 | Ideal home kit DBs + bench + pull-up bar + medball; people differ; never bands | §8.1 E3 | equipment.ideal_home_kit | FIXED (was MISSING in spec) |
| EQ-03 | Older/injured/high-volume -> constrained machines; never OH squat, snatch, low-bar, depth jumps | §8.1 E6; §8.3 | equipment.older_injured_high_volume; validation_checks.V5_older | OK |
| EQ-04 | Foundational older/injured may use MODERATE/ADVANCED machines (RIGHT) | §8.1 E7; §3.1 L5 | equipment.older_injured_high_volume.machines_from_foundational | OK |
| EQ-05 | Add a seated machine shoulder press (RIGHT) | §8.1 E8; §4.4 | inputs F29 (shoulder_press_machine); library_decisions.build_out | OK |
| EQ-06 | Medball weights by use; never over 20 lb (RIGHT) | §8.1 E9; §9.6 | athletic.medball.loads_lb | OK |
| EQ-07 | No medball -> substitute; no band chops (RIGHT) | §8.1 E10 | athletic.medball.loads_lb.no_ball | OK |
| EQ-08 | No leg extension/curl machine -> swap; no bands | §8.1 E11 | equipment.machine_isolation_swaps; equipment.substitution_order | FIXED (swap list missing in spec) |
| EQ-09 | No implement named -> bodyweight -> DB -> barbell as level rises (RIGHT) | §8.1 E12; §4.1 C4 | equipment.default_implement | OK |
| EQ-10 | Pick between alternatives by client and by the client's preference (PARTLY) | §8.1 E13; §4.1 C3 | equipment.alternatives; inputs F29b; template_refs.exercise_catalog.slot_rule | OK |
| EQ-11 | Machines not ranked; hack/leg press more constrained than Smith; belt squat = no axial load; GHD/reverse hyper if available and felt right (NOT RIGHT to v0) | §8.1 E5; §8.2; §10.4 | equipment.machines_not_ranked; equipment.constraint_scale; axial_loading.soreness_switch | OK |
| EQ-12 | No variable resistance for now (NOT RIGHT) | §8.1 E1; §7.1 T20 | equipment.no_variable_resistance; validation_checks.V9_bands | OK |
| EQ-13 | Constraint scale 1-5 approved (RIGHT) | §8.2 | equipment.constraint_scale | OK |
| EQ-14 | Aerobic work on any tool; calories, time or distance (keep distance); doing the block matters | §8.1 E14; §9.7 | conditioning.rules; conditioning.menus | OK |
| EQ-15 | Loaded jumps 10-20 % BW; too heavy when height/speed drops (RIGHT) | §8.1 E15; §7.5 | equipment.loaded_jumps | OK |
| EQ-16 | Box and hurdle heights (RIGHT) | §8.1 E15; §7.5 | equipment.heights | OK |
| GEN-01 | Users: clients, coaches, trainers, S&C coaches, anyone; English default + full Spanish toggle | §13.1 G1-G2 | inputs_schema.i18n; inputs F00, F39 | OK |
| GEN-02 | Drop sex; experience in years; competitive -> sport + position + season, recreational -> general sport; add body weight | §13.1 G3; §13.2 | inputs_schema.removed_fields; inputs F05, F11a, F11, F12, F14, F17 | OK |
| GEN-03 | Output undecided (PDF/screenshot, phone website, no app, maybe open source); unsure about tracking | §13.1 G4; §13.5; §14 | output; adaptation.modes; inputs F43 | OK (PROPOSED; tension in round 2) |
| GEN-04 | Default exercise in each slot + dropdown swaps (RIGHT) | §4.1 C1; §13.1 G5 | template_refs.exercise_catalog.slot_rule; pipeline[4] | OK (explicit tagged key added) |
| GEN-05 | Adjust week to week from EFFORT / HOW IT FELT (RIGHT) | §5.1 V18; §13.5 | adaptation; rate_engine.gates | OK |
| GEN-06 | A video for every exercise; more links needed | §4.1 C8; §14 | output.videos | OK (tag added) |
| GEN-07 | A cue per exercise in his voice + his instruction block (RIGHT) | §4.1 C7 | output.cues; inputs_schema.i18n.scope | FIXED (spec only listed cues in the i18n scope) |
| GEN-08 | Hard rules + coaches can add their own rules | §7.7; §13.1 G9; §13.4 | ordering.hard.GEN-08; coach_rule_hooks | OK |
| LIB-01 | 'LEFT TEST' = L-test; '5/10/05' = 5-10-5 (RIGHT) | §4.2; §12.1 X3 | library_decisions.renames; tests.catalogue.speed_agility | OK |
| LIB-02 | Push up Stick the Landing: hands start on a box and land on the floor (PARTLY) | §4.2; §9.3 | library_decisions.setups | FIXED (was MISSING in spec) |
| LIB-03 | Second 'Low Depth Drop' = single-leg or weighted (RIGHT) | §4.2; §4.4 | library_decisions.setups | FIXED (was MISSING in spec) |
| LIB-04 | Advanced hurdle hops = taller hurdles + continuous quick contacts (RIGHT) | §4.2; §9.3 | library_decisions.setups | FIXED (was MISSING in spec) |
| LIB-05 | Intermediate takes one plyo from each MODERATE column (RIGHT) | §4.2; §9.3 | library_decisions.levels | FIXED (was MISSING in spec) |
| LIB-06 | No levels in throws, 'just do them right' | §3.1 L6; §4.2; §9.6 | levels_exercise.no_levels; library_decisions.levels | OK |
| LIB-07 | Full squat versions: add 'Squat' to Snatch/Clean/Clean & Jerk; calf-raise squat with any tool (PARTLY) | §2.3; §4.2; §9.5 | athletic.olympic.L2_plus; library_decisions.renames, .setups | OK |
| LIB-08 | No levels on the GHD | §3.1 L6; §4.2 | levels_exercise.no_levels; library_decisions.levels | OK |
| LIB-09 | Camporini and strap rotating removed; alternating staggered single-leg DL; box pistol; low DB squats at the sides; Kong row = double-KB floor row; Pull under = lat pull-over | §4.2; §4.3; App. A | counting.credit_map.PULLOVER; counting.kong_row; library_decisions.renames, .removed | OK |
| LIB-11 | Second 'Standing DB Press' = the barbell press (RIGHT) | §4.2; §3.1 ladder | library_decisions.renames | FIXED (was MISSING in spec) |
| LIB-13 | Push press is easier; push jerk intermediate/advanced (PARTLY) | §3.1 L7; §4.2; §9.5 | library_decisions.levels; athletic.olympic.L1_and_early_L2, .L2_plus | FIXED (was WRONG: push press sat only in the L2+ Olympic list; now offered from L1) |
| LIB-14 | Thrusters conditioning-leaning; quads 1.0 + shoulders 0.5 (RIGHT) | §2.4; §5.2 | counting.credit_map.THRUSTER | OK |
| LIB-15 | Leg extension/curl level labels were typos; every level (RIGHT) | §3.1 L6; §4.2 | levels_exercise.no_levels; library_decisions.levels | OK |
| LIB-16 | Upright rows = side delts; dips 0.5 triceps + 0.5 chest on push days (PARTLY) | §2.4; §4.2; §5.2 | counting.credit_map.DIPS, .ISOLATION | OK |
| LIB-17 | Merge near-duplicates (RIGHT) | §4.1 C9; §4.3 | library_decisions.removed | FIXED (was MISSING in spec) |
| LIB-18 | '21.6 mile run' = his 'marathon' (flag: 26.2 mi); unsure when needed | §4.2; §12.1 X4 | tests.excluded; conditioning.endurance_plan.longest_run | OK |
| LIB-19 | Build out carries, drags and sling systems (RIGHT) | §2.1 S10; §4.2; §4.4 | library_decisions.build_out | FIXED (was MISSING in spec) |
| LIB-20 | Add frontal/transverse lower-body moves for court and combat athletes (RIGHT) | §4.2; §6.4 | bilateral_unilateral.frontal_transverse_share_of_unilateral.moves; library_decisions.build_out | OK |
| LIB-21 | Speed session order fixed; add MACH drills (RIGHT) | §2.1 S9; §4.2; §7.7 | athletic.speed_session_order; ordering.hard.LIB-21 | OK |
| LIB-22 | Medball ALL LIST = 1 x 10 per throw (RIGHT) | §4.2; §9.6 | athletic.medball.loads_lb.dose | OK |
| PRG-01 | SKIP: meaning of 'NO ACCESS' | §16.1 | open_decisions.skipped; vocab.program_names[5] | OK (skipped; round 2 R2-LIB-08) |
| PRG-02 | PPL weekdays flexible, adjusted per athlete (PARTLY) | §10.1 W17; §10.7 | inputs F23 | OK |
| PRG-03 | Bootcamp 4/5/6 sessions all fine; 3-5 rounds x 30-50 s, 5-7 stations, 35-45 min (PARTLY) | §10.1 W15; §10.6 | supersets_contrast_circuits.bootcamp_circuits; goal_phase_modifiers[3] | OK |
| PRG-04 | Off-season STARTING/MID/ADVANCED = blocks or levels as needed (PARTLY) | §11.1 P16; §3.3 | plan_types.season.starting_mid_advanced | OK |
| PRG-05 | Novice = newby (< 6-12 months); intermediate > 1 year consistent; 6-12+ months off -> body treated as beginner; ex-pros L1 briefly; L1-L3 explained | §3.3 | vocab.levels; inputs F17.level_rule; derived_values.D3_client_level | OK |
| PRG-06 | One sound algorithm for rep, set and volume rises at every level (PARTLY) | §3.3; §7.1 T9 | reps.one_algorithm | OK |
| PRG-07 | '12/10/8 -20' = pyramid then a light 20; '10/10' = per side | §7.1 T7; App. A | reps.notation; library_decisions.notation | OK |
| PRG-08 | SCORE = times, rounds or distances (RIGHT) | §12.1 X5; App. A | library_decisions.notation | FIXED (was MISSING in spec) |
| PRG-09 | High school = college = pro in structure; loads/speeds differ; pros more care; Thursday = strength (RIGHT) | §9.1 A17; §9.9 | inputs F13 | OK |
| PRG-10 | CrossFit FULL TIME = competitor, HALF TIME = class member (RIGHT) | App. A; §10.8 | vocab.program_names[13], [14]; library_decisions.renames | FIXED (was MISSING in spec) |
| PRG-11 | Fat Burn circuits are finishers after lifting (RIGHT) | §9.7; §10.1 W18 | conditioning.rules | OK |
| PRG-12 | Hinshaw half-marathon plan used as-is, half marathon only (RIGHT) | §9.7 | conditioning.endurance_plan | FIXED (was MISSING in spec) |
| FIX-01 | SKIP: NO ACCESS Tuesday 'Unilateral HD' dropdown | §16.1 | open_decisions.skipped | OK (skipped; round 2 R2-LIB-08) |
| FIX-02 | Extend cardio dropdowns to DISTANCE (200-1000 m) and CALORIES; keep them logical (RIGHT) | §4.2; §9.7 | conditioning.menus | FIXED (was MISSING in master and spec) |
| FIX-03 | Generic, understandable program and day names (RIGHT) | §4.1 C6; §13.1 G12; App. A | vocab.program_names; library_decisions.names | OK |
| FIX-04 | Correct spelling in the generator; his sheets stay as they are (RIGHT) | §4.1 C5; App. A | _meta.conventions.labels; library_decisions.names | OK |

Not answered (not counted in the 138): **LIB-10** ('KB Face Pulls' under VERTICAL PULL; master §4.2, §16.1; spec `library_decisions.pending.LIB-10`, `open_decisions.unanswered`; round 2 R2-LIB-04) and **LIB-12** ('Bench Push ups' hands vs feet; master §4.2, §16.1; spec `library_decisions.pending.LIB-12`; round 2 R2-LIB-05).

## The fixes, one by one

| Item | What was wrong and what changed | Master | Spec / other |
|---|---|---|---|
| VOL-09, UNI-01 (WRONG) | Hinge glute credit was 0.5 (01/12 'co-mover' reading), a leftover of the retired 0.5 helper credit. Now **0.25** by his helper rule; his RFE-lunge answer ('mostly for quads ... I don't necessarily count it for glutes') shows a purpose label naming glutes does not make them a counted co-mover. Hip thrusts, bridges, swings stay 1.0. The 0.5 value is kept only as a switch. | §0.3, §2.4, §5.2, §5.10, §16.4 | counting.credit_map.BHD/.UHD (+ alt_co_mover_rule); _meta.integration_decisions[6]; round 2 R2-VOL-05 proposal rewritten |
| UNI-03 (WRONG) | Bodybuilder/powerlifter upper-body share was 80-90 % bilateral from week 1; his upper-body answer is 'same logic', so it now starts about 50/50 in weeks 1-4 and moves to 80/20-90/10 (upper numbers PROPOSED). | §6.2, §16.4 | bilateral_unilateral.profiles[0].upper |
| LIB-13 (WRONG) | Push press (his 'easier' press) sat only in the L2+ Olympic list; it is now an L1 option, push jerk stays L2+. | §9.5 | athletic.olympic.L1_and_early_L2, .L2_plus |
| VOL-02 (gap) | No L1 priority cap existed, so a beginner's priority muscle (10 + 4 = 14) started at the L1 cap of 14 and could never grow. Added L1 priority cap = L1 cap + 4 (big 18, small 16, calves 20, rear delts 12), PROPOSED. | §5.3 (table + note), §5.10 | priority.cap.L1; weekly_sets.muscles.<muscle>.priority.cap.L1; round 2 R2-VOL-06 proposal updated |
| FIX-02 (MISSING both) | Cardio menus now carry DISTANCE 200-1000 m and CALORIES, ordered by colour then unit; his sheet is not edited. | §4.2, §9.7 | conditioning.menus |
| PER-01 (cross-reference) | P6 pointed to §11.8 (pending) for the quarter themes; now §11.5. The L1 '4-week acclimation' in §3.3 is tagged PROPOSED (he said 2-4 weeks). | §11.1, §3.3 | - |
| ATH-13 (leftover name) | Two master lines still used the 'JUSTICE LEAGUE' / 'JL' tab name as a label; reworded to the generic program with the tab name only as a quote. | §10.4, §10.5 | vocab.program_names[*].tag added |
| Spec MISSING keys | Added `rule_tables.taxonomy` (CAT-01/03/05/06/07/08), `weekly_sets.landmarks_coach` (UNI-01, VOL-01), `weekly_sets.balance` (VOL-18), `counting.unilateral.progression` (UNI-05), `set_placement.second_weekly_exposure` (PER-04), `template_refs.exercise_catalog.slot_rule` (GEN-04, EQ-10), `strength_template` (PER-09), `athletic.plyo_volume_ranking` (ATH-02), `athletic.resistance_vs_speed_groups` (ATH-03), `warmup` (ORD-08), `core_block` (ATH-11, VOL-17), `equipment.ideal_home_kit` (EQ-02), `equipment.machine_isolation_swaps` (EQ-08), `conditioning.endurance_plan` (PRG-12, LIB-18), `conditioning.menus` (FIX-02), `library_decisions` (LIB-01..22, PRG-07/08/10, FIX-03/04), `output.cues` (GEN-07), GEN-06 tag on `output.videos`. | - | see the keys named |
| Consistency (not a single answer) | The V1 safety check and pipeline step 0 cited a field F37 that no longer exists; its case ('diagnosed / in rehab') is F01 `injury_in_treatment`. | §13.6 | validation_checks.V1_safety; pipeline[0] |
| ATH-09 (clarity) | The coach-rule-pack example 'youth under 15: no Olympic lifts from the floor' is now labelled as stricter than the Blaze default (ATH-09 allows some floor lifts). | §13.4 | coach_rule_hooks.examples[0].note |
| Round 2 consistency | R2-ATH-08 read as if older clients could do depth jumps on request (EQ-03 says never): fixed. R2-LIB-02 used 'seated incline DB press' as an overhead example: now 'seated DB shoulder press'. R2-VOL-05 and R2-VOL-06 follow the fixes above. | - | round2_questions.json |

The spec edits are a post-build patch (`_meta.coverage_audit`; version 1.0.0 -> 1.0.1). Re-running the original build script would drop them; the patch is idempotent and was replayed on the pre-audit file to confirm it reproduces the current spec exactly.

## Leftovers of retired ideas (scan of master, spec and round 2)

| Retired idea | What the scan found | Status |
|---|---|---|
| Size-based 3/5/7 % (big 3 / small 7) | Only in retired lists, the v0 column of §0.2 and the 'never by muscle size' rules (§5.1 V8, §5.4; `rate_engine.principle`; `_meta.retired_v0_keys`). | OK |
| 0.5 helper credit | Hinge glute credit 0.5 was the live leftover (master §0.3/§2.4/§5.2, spec BHD/UHD, R2-VOL-05). Remaining 0.5 values are his own exercise answers (dips LIB-16, thrusters LIB-14), the stored Pelland count, or maintenance/season factors. | FIXED |
| Bands / chains / weight releasers | No active exercise, swap, kit token or profile uses them; mentions are 'no bands' rules, DORMANT facets, removed ids and the out-of-scope list. 'Band' elsewhere = RIR band / step band / constraint band / age band. | OK |
| Sex-based rules / sex field | Only the removal notes (F04 removed, 'no sex-based rules', no sex-based learning cells). | OK |
| 'Justice League' as a name | Kept only as the sheet-tab quote mapped to 'Athletic Performance - Non-Competitive' (§0.3, App. A, `vocab.program_names[4]`, `library_decisions.renames`); two label uses reworded (§10.4, §10.5). | FIXED |
| Core after the power block by default | None: core is first by default everywhere (§10.1 W1, §10.2, `ordering.tiers`, `core_block`); the old idea appears only in retired lists. | OK |
| Hack squat ranked last / machine ranking | None: machines not ranked (§8.1 E5, `equipment.machines_not_ranked`); hack/pendulum only ordered by constraint (EQ-11). | OK |

## round2_questions.json format check

Parses as JSON: yes. Shape: an array of 6 sections (required 4-7), each exactly `{id, title, blurb, qs}` with ids `R2-XXX`; 45 questions (max 45), each exactly `{id, core, q, a}` with ids `R2-XXX-NN` under their section, `core` 0 or 1, no duplicates, non-empty `q` and `a`. No format fix was needed; four proposals (`a`) were edited for consistency with the fixes above (R2-VOL-05, R2-VOL-06, R2-ATH-08, R2-LIB-02).
