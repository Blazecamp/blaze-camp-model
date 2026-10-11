# Athlete, sport and activity profiles (v1.3)

How emphasis changes by sport, position, goal and activity - every popular US sport, swimming in depth, and the gen-pop "stay athletic and active" path (pickleball, HYROX and more). Machine-readable twin: `synthesis/04_profiles.json` (v1.2; not re-issued in v1.3 - the compiler adds the confidence label to every sport profile). Authority order (v1.3): coach round-4 answers (COACH-R4, `coach_answers_round4.md`) and CT-01 (`coach_answers_time_2026-10-10.md`) > CX-01..04 (`coach_answers_codex_2026-10-10.md`) > round-3 answers (COACH-R3, `coach_answers_round3.md`) > round-2 answers (COACH-R2) > round-1 answers (COACH-ANSWER) > OBSERVED sheet facts > INFERRED / SCIENCE / PROPOSED. No Google Sheet was opened or modified.

**127 profiles** (93 competitive, 31 recreational, 3 goal) from 04 v1 (27, coach-derived numbers kept) + `sports/team.json` (46) + `sports/aquatic-endurance-track.json` (24) + `sports/combat-strength-fitness.json` (10) + `sports/genpop-active.json` (17); **52 picker sports**, **26 recreational activities**, 4 age overlays, 81 variants, 16 id aliases. The v1.1 sport verification (2026-10-08, log at the end) added 3 recreational profiles (combat classes, climbing gym, first obstacle race), 3 routed sports, 6 routed activities and the trail / ultra choice.

Evidence labels: OBSERVED (read from the coach's sheets) / COACH-ANSWER <ID> (round 1) / COACH-R2 <ID> (round 2) / COACH-R3 <ID> (round 3) / COACH-R4 <ID> (round 4, newest and highest, with COACH-CT CT-01) / COACH-CX <ID> / INFERRED / SCIENCE (cited, section 13) / PROPOSED (pending coach approval) / MERGE (a v1.1 merge decision, listed in section 14).

## v1.3 - round 4, CT-01 and CX-01..04 applied (2026-10-11)

The coach's newest answers outrank everything below: round 4 (`coach_answers_round4.md`, 20 answers, 2026-10-11), his clarification on session time (`coach_answers_time_2026-10-10.md`, **CT-01**) and his clarifications on progression and editing (`coach_answers_codex_2026-10-10.md`, **CX-01..04**). **Authority order: round 4 and CT-01 > CX-01..04 > round 3 > round 2 > round 1 > chat statements > sheets.** **Where this section and a later section of this file disagree, this section wins.** Later sections that v1.3 supersedes carry a "RETIRED in v1.3" or "Changed in v1.3" note under their heading; the text under such a note is history. The master record is `BLAZE_CAMP_BRAIN.md` v1.3 (what changed: §0d). Round 4 changed no sport number in this file: the plyo shares, aerobic counts, season rules and age overlays stand. It changed how a profile's day is laid out and sized, which exercises a profile may pick, and it added a confidence label.

### V1. What v1.3 changes in this file

| # | Change | Sections below it replaces | Source |
|---|---|---|---|
| 1 | **Every sport profile carries a confidence label**: confirmed by coach, based on a similar sport, or proposed. In the data and the docs; not shown on a plan | §1; §6 (adds a column in the data); §8 cards | COACH-R4 R4-SCP-03 |
| 2 | **An athlete's day = the athletic block, then his A / B lifts** (A = pull + knee dominant, B = push + hip dominant), up to 12 exercises + the 2 core exercises; arm isolation leaves the athletic days; a 3-day week adds his C day | §4.6; §9.6 | COACH-R4 R4-SES-05, R4-SES-02 |
| 3 | **Session size by exercise count**: field athletes off-season up to 12; non-competitive "stay athletic" days 5-10 (his sheet has 10 slots; range PROPOSED); older adults 60+ 5-6; general 5-7 | §3.1; §4.6; §9.6 | COACH-R4 R4-SES-02 |
| 4 | **No time-fitting.** Session length is not an input; the minutes in the profile cards and in §9.6 are estimates, never caps; "estimated minutes vs the session-length cap" is no longer an audit | §4.6 ("session length"); §9.6 ("caps", "fat loss minutes", "assembly rule when over", step 10) | COACH-CT CT-01; COACH-R4 R4-SES-01 |
| 5 | **Two gym days** (runners, cyclists, swimmers, dance-class users, in-season athletes): every big group is trained at about 6-8 weekly sets; the plan says so and suggests a third day; the floor of 10 applies from 3 training days | §12.2 GP-2; §4.7 | COACH-R4 R4-SES-03 |
| 6 | **Optional add-ons are never picks.** The exercises this file proposed for the new sports (swimmer external rotation and streamline work, the split-step reaction drill, tibialis and soleus raises, wall balls, sled work, sandbag lunges, burpee broad jumps, carries ...) can be chosen and added by the person; no profile's template picks them. Exception: wall balls and sled pushes may be primary in HYROX (and the CrossFit-style class WOD, PROPOSED). Neck work stays proposed | §3.1; §8 cards (shoulder care, joint care, HYROX stations); §11 | COACH-R4 R4-LIB-01 |
| 7 | **Joint care uses his own live exercises**: swimmer shoulder care every session = KB face pull or floor Y / T raise (external rotation is an offered add-on); racket 50+ calf and Achilles care = one of his calf raises on a leg day that has no calf exercise | §8 (swimming, racket cards) | COACH-R4 R4-LIB-01; COACH-R3 ATH-01, ATH-02 |
| 8 | **Carries and sled work by distance or time** (2-4 trips of 20-40 m or 20-40 s); never muscle sets | §11 (CARRY / DRAGS) | COACH-R4 R4-LIB-02 |
| 9 | **Each template slot keeps its laterality** (two-leg in slot 2, single-leg in slot 4); the profile's bilateral : unilateral share acts on the slots the template leaves open. For field and court athletes with 80-90 % single-leg targets this is an open question | §9.2 | COACH-R4 R4-SES-05; reading INFERRED |
| 10 | **The stairway reaches its final sets** on every trained group; the athletic budget keeps its own stairway | §9.5 | COACH-CX CX-01; COACH-R4 R4-PRG-01 |
| 11 | **Everyone may use the plans**; the terms and release are accepted before a plan is generated (a parent or guardian for a minor) | §9.3 (youth) | COACH-R4 R4-SCP-01, R4-SCP-02 |

### V2. Confidence labels

**Confidence labels (v1.3; COACH-R4 R4-SCP-03).** Every sport profile carries one label, in the data (`profiles.sports[*].confidence`, with its basis) and in the docs: **confirmed by coach** (read from his sheets, or the plan approved by name: swimming R3-ATH-01, HYROX R3-ATH-03) - 23 profiles; **based on a similar sport** (a base profile, a position delta or a reused variant) - 67 profiles; **proposed** (a needs analysis built with his general rules) - 37 profiles. The label is **not shown on a plan**. The source file `04_profiles.json` v1.2 keeps its evidence tags; the compiler derives the label from them.

How a label is derived: a profile whose evidence is OBSERVED in his sheets, or whose plan he approved by name, is "confirmed by coach"; a profile built from a base profile, a position delta or a reused variant is "based on a similar sport"; a profile built from a needs analysis with his general rules is "proposed". Our reading of that rule: his round-2 and round-3 approvals of shares and counts (R2-ATH-01, R3-ATH-04) confirm those numbers, but the profile as a whole keeps the label of how it was built.

### V3. The library rules that touch the profiles

| # | Rule | ID |
|---|---|---|
| C7 | **Primary exercises and optional add-ons.** The exercises that were marked "proposed" (farmer and suitcase carries, sled push and pull, wall balls, sandbag lunges, burpee broad jumps, split-step reaction drills, swimmer shoulder work, tibialis and soleus raises ...) are **allowed as optional add-ons**: they can be chosen and added, and they appear as swaps and in an "Optional add-ons" list on the plan. **No template picks them.** The only exceptions: **wall balls and sled pushes may be primary in the HYROX program** (and in the CrossFit-style class WOD, a PROPOSED reading of "maybe in the CrossFit program", with one switch to turn it off). **Neck work stays proposed** until he decides: never a pick, a swap or an offered add-on. | **COACH-R4 R4-LIB-01 (RIGHT + words)** |
| C8 | **Carries and sled work are written by distance or time, not reps**: 2-4 trips of 20-40 meters (or 20-40 seconds), per side when one-sided. **They are not muscle sets.** They sit with core / conditioning. His own suitcase carry is an optional add-on like the farmer carry, with the same dosing. | **COACH-R4 R4-LIB-02 (RIGHT)** |
| C9 | **Mid-range pull** is its own small category between the horizontal and the vertical pull: high row, 45-degree row, face-pull angle (taxonomy node `RP.PL.M`, pattern `MRPULL`). His templates have no mid-range slot, so a row or a pulldown lists one mid-range pull as a swap when the kit holds one. The two row records added for it are optional add-ons (PROPOSED records); the face pulls keep their place as rear-delt work and carry the tag. | **COACH-R4 R4-LIB-03 (RIGHT)** |
| C10 | **Incline pressing is preferred over overhead pressing** in the vertical / mid-range push slot for bodybuilders and for the general population (goals: build muscle, general fitness, fat loss, and the non-competitive "stay athletic" adult, the last one PROPOSED). **Overhead pressing stays in the program** as a swap: "we should have that variability." Competitive athletes and strength plans keep their own press. | **COACH-R4 R4-LIB-03 (RIGHT + words)**; R4-SES-05 slot 3 |
| C11 | **A swap says what it keeps and what it loses**, in one short line ("DB snatch instead of power clean: keeps the explosive hip drive, loses the barbell catch"). The same line is printed when the plan's pick stands in for an exercise the person's equipment does not hold. The wording table is PROPOSED. | **COACH-R4 R4-LIB-04 (RIGHT)** |
| C12 | **No third-party video links in the public data.** Every exercise carries a "search this exercise on YouTube" link built from its English name, and the plan shows the exact name with a one-tap copy ("Click here to copy it and put into YouTube"). His own videos can be added later (link kind `coach`). 336 link lists and 188 linked cells were emptied from `02_exercise_catalog.json`; nothing else in that file changed. | **COACH-R4 R4-LIB-05 (RIGHT + words)**; R2-GEN-02 |

**In numbers (compiled model 1.3.0).** 733 exercises: 731 from the library source plus the 2 mid-range pull records. 32 records carry the status "optional add-on": the 29 former proposals other than neck work, the 2 mid-range pull records, and his own suitcase carry (filed with the other carries). 2 neck records stay proposed and hidden. The floor prone Y / T raise is not an add-on: he added it to the library in round 2 (R2-LIB-07).

### V4. Laterality

**v1.3: the template's slots keep their laterality (COACH-R4 R4-SES-05).** His template names the laterality of its slots: slot 2 is a two-leg squat or hinge ("bilateral, symmetrical"), slot 4 a single-leg lift, and the A day opens with a two-arm row. On gym A / B / C days, athletic days and push / pull / legs those slots keep it in every exercise block. The slider of §6.2 acts on the slots the template leaves open (the vertical pull, isolation details, jump stations) and through the exercise picked inside a slot; the share is read on those open slots. For field and court athletes, whose targets ask for 80-90 % single-leg work (UNI-02, UNI-03), this is an open question for the coach (master §0d.3 #3).

---


## v1.2 - round 3 applied (2026-10-09)

> **Changed again in v1.3.** This list is the v1.2 change record, kept as written. Its rows about the time check and time vs minimums (R3-SES-02: offers, "fewer groups trained directly", "never flat"), about the 7 % and 10 % limits, and about the next block's "cap + 1" were changed again by COACH-CT CT-01, COACH-CX CX-01..04 and round 4. The v1.3 section above wins.

Coach round 3 (`coach_answers_round3.md`, read in full; newest and highest authority) approved every athlete proposal (R3-ATH-01..05) and the calendar proposal with a note (R3-PER-01: 'maintenance weeks are a recommendation ... when the block ends, it just ends, and then you have to go back into the app and build whatever you want next'), and removed check-ins, tracking and stored data (R3-VOL-02, R3-VOL-04: 'We're only doing outputs, and people can change accordingly'; R3-GEN-01: 'I don't want any data kept'). v1.2 applies these in place: tables, profile cards and the JSON now carry the approved numbers with **COACH-R3 <ID>** evidence. Rear delts join the shoulders group (R3-VOL-01) and groups replace single muscles in the floor audit (R3-SES-01). The v1.1 sections below are kept and annotated where round 3 changed them.

### What changed in v1.2 (by round-3 ID)

| # | Round-3 ID | Change | Where |
|---|---|---|---|
| 1 | R3-ATH-04 | Plyometric shares of the remaining sports approved (75 % runners; 60 % lacrosse, field hockey, flag football, ultimate cutters, rugby sevens, high jump, pole vault, gymnastics, cheer flyers; 50 % beach volleyball, pickleball, padel, rugby backs, goalkeepers, javelin, HYROX; 40 % rugby forwards, cheer bases, throwers, diving, alpine skiing, cycling; 25 % swimming, water polo, rowing, judo, taekwondo, climbing). Every profile checked: 58 profiles carry an approved share; the evidence now cites COACH-R3 ATH-04. One number changed: lacrosse_m_defense class 3 -> 2 (50 % -> 60 %, start 35 % -> 45 %), PLYO / JLK / BALL / THROW re-split at the same 36-set total (12 / 6 / 9 / 9 -> 14 / 8 / 7 / 7) on the profile and its LSM variant. | profiles[].ground_contact / power_mix / power_mix_by_phase; ground_contact_model.approved_v1_2; consistency_checks C23 |
| 2 | R3-ATH-04 | Recreational players use their activity's share (golf 25 %, running 75 %, rec soccer 60 %); 'a bit of everything' stays 50 % - flag F5 approved. | v1_1_resolution_flags F5; recreational profiles |
| 3 | R3-ATH-04 | Off-season cardio 2-4 like the round-2 list approved for the sports he had not named (37 competitive profiles relabelled); 0 extra gym cardio approved for swimmers, runners, rowers and endurance cyclists (their practice is the cardio; water polo and triathlon follow by analogy, INFERRED). | profiles[].aerobic_sessions_wk.evidence; aerobic_rule; consistency_checks C25 |
| 4 | R3-ATH-04 | The in-season game-heavy rule approved for lacrosse, field hockey, rugby, ultimate, flag football and beach volleyball (17 profiles relabelled COACH-R3 ATH-04). Still INFERRED (not asked): cheer_base_spot, cheer_flyer_tumbler, gymnastics_artistic, pickleball_competitive, tennis, wrestling. | profiles[].in_season_gym; in_season_content.game_heavy; consistency_checks C24 |
| 5 | R3-ATH-01 | Swimming dryland defaults approved: 3 dryland gym days + 1 optional (2 for younger or lower-level swimmers), 0 extra gym cardio (the user can add one), jump work mostly ballistic (25 % plyometric at the end of a block), Olympic lifts 2-3 days, shoulder care (external rotation, floor Y / T raises, KB face pulls) every session and never bands, a 2-week dryland taper lined up with the swim coach's taper before the main championship meet (1 week or none before smaller meets). Fixed in the data: shoulder care was 2-3 x / week and missing from the B day and the optional pre-season lift; the taper read 1-2 weeks; the pre-season sample ended in a 1-2-week taper. | swimming_sprint / middle / distance; injury_library.SHOULDER_SWIMMER; consistency_checks C26 |
| 6 | R3-ATH-02 | 60+ defaults approved: landing drills (step down and stick), balance, quick stepping without a hop, light medball throws and fast machine work ON; low ankle hops, other jumps, Olympic lifts and depth jumps OFF and switchable with the warning; overhead squats and low-bar squats out. Depth jumps move from 'never' (EQ-03) to switchable for 60+ (EQ-03 still holds for injured and high-volume clients); snatch variants stay out (EQ-03, not revisited). Flag F9 approved. | active_aging_60plus; every older_60_plus / power_mix_by_phase.older_60_plus text; age_overlays; age_experience_rules; olympic_by_level; injury_library.FALLS_BONE_DENSITY; consistency_checks C27 |
| 7 | R3-ATH-02 | Pickleball, padel and tennis players 50+: knee-friendly strength, calf and Achilles work every leg day, rotator-cuff work, only low-impact jumps (no depth jumps, hurdle hops or bounds) unless switched on - approved on rec_pickleball / rec_padel / rec_tennis / pickleball_competitive and ADDED to competitive tennis (+ padel_competitive); new structured field age_50_plus.plyo_off_by_default + applies_from_age 50. | profiles[].age_50_plus; consistency_checks C28 |
| 8 | R3-ATH-03 | HYROX plan approved: 2 strength days (squat + pull, deadlift + push) + 2 hybrid days, 4 cardio sessions (Blue, Green, Orange + a second Orange), 2 short station circuits a week as finishers not counted as muscle sets, wall balls with the race ball (<= 20 lb), 40-rep / AMRAP only inside these circuits, jumps 50 % plyometric. hyrox_fitness aligned (second circuit made explicit); hyrox_competitive restructured from 3 gym days to the approved 2 + 2 (4 + 1 days). Flag F6 closed for HYROX (OCR follows by analogy, PROPOSED). | hyrox_fitness, hyrox_competitive (hyrox_plan_r3, conditioning, sample_week, medball_policy); consistency_checks C29 |
| 9 | R3-ATH-05 | Stay athletic and active: play days (hardest gym day >= 48 h before the biggest play day; weeks with 3+ play sessions drop the extra agility drills and half the jumps), activity cardio credit (a 45-60+ min session counts as one of the 3 cardio sessions, up to 2) and an optional event date (hardest weeks end 1 week before, then 1 easy week at about half the sets) approved and applied to every recreational profile (30); thresholds normalised to 3+ (v1.1 had 2+ or 4+ on some); play_adjustment added to 15 profiles that lacked it, event_prep to 14. | profiles[].play_adjustment / event_prep / aerobic_sessions_wk; stay_athletic_standard; consistency_checks C30 |
| 10 | R3-PER-01 | The easy week / maintenance after a block is a recommendation, not mandatory; when a block (or a maintenance phase, or an event plan) ends, it ends and the user builds the next plan in the app; holidays are planned between blocks. The end-of-maintenance prompt ('keep maintaining / change plan / start a block') is retired from every profile text. | season_overrides / sample_week post-season texts (117 strings); plan_length_shapes; consistency_checks C31 |
| 11 | R3-VOL-02, R3-VOL-04, R3-GEN-01 | No check-ins, no tracking, no stored data: every check-in sentence in profiles and injury rules (SHOULDER_SWIMMER, KNEE_MEDIAL_KICK), sport_load_context, assembly rules and muscle_volume_targets rewritten; the 'engine should learn from user data' note retired; test reminders become lines printed in the plan. | 125 tests.timing strings; 21 sample_week rules; injury_library; consistency_checks C31 |
| 12 | R3-VOL-01, R3-SES-01 | Rear delts are part of the shoulders group (no own floor; users / coaches can add rear-delt work); hips = glutes + hamstrings. New derived.v1_2_group_audit on every profile and variant (194) counts sets on focus groups; the per-muscle v1_1_audit is kept as history (superseded). Flag F2 closed. | profiles[].derived.v1_2_group_audit; muscle_volume_targets; categories.ISO_REAR; session_rules; consistency_checks C32 |
| 13 | R3-SES-02 | Profile texts tell users and coaches what they can switch off (a day's athletic or core block), that exercises or blocks can be added or removed, and that supersets are recommended to save time (owned by 05 / 12 v1.2; referenced in stay_athletic_standard and the older / racket / swimming notes). | stay_athletic_standard.editing_r3; play_adjustment.edit |

### Round-3 numbers check: every profile against the approvals

**Plyometric share at the end of a block (COACH-R3 ATH-04).** Each block starts 15 points more ballistic (start = end - 15; the v1.1 20 % floor is retired in the v1.2 check, so the 25 % class starts at 10 %). 58 profiles carry a share he named in round 3 (the round-2 sports keep their COACH-R2 ATH-01 shares; consistency check C23).

| Share (start) | His round-3 list | Profiles | Result |
|---|---|---|---|
| 75 % (start 60 %) | runners | `cross_country`, `distance_runner`, `run_fitness`, `track_400`, `track_hurdles`, `track_middle` | OK |
| 60 % (start 45 %) | lacrosse, field hockey, flag football, ultimate cutters, rugby sevens, high jump, pole vault, gymnastics, cheer flyers | `cheer_flyer_tumbler`, `field_hockey_field`, `flag_football`, `gymnastics_artistic`, `lacrosse_m_attack`, `lacrosse_m_defense`, `lacrosse_m_midfield`, `lacrosse_w_attack`, `lacrosse_w_defense`, `lacrosse_w_midfield`, `rec_soccer`, `rugby_sevens`, `track_high_jump`, `track_pole_vault`, `ultimate_cutter` | OK - `lacrosse_m_defense` moved 50 % -> 60 % (class 3 -> 2; budget re-split at the same total) |
| 50 % (start 35 %) | beach volleyball, pickleball, padel, rugby backs, goalkeepers, javelin, HYROX | `field_hockey_gk`, `hyrox_competitive`, `hyrox_fitness`, `lacrosse_m_goalie`, `lacrosse_w_goalie`, `pickleball_competitive`, `rec_league`, `rec_padel`, `rec_pickleball`, `rugby_backs`, `soccer_gk`, `track_javelin`, `volleyball_beach`, `weekend_warrior` | OK - 'goalkeepers' read as the field-sport goalkeepers (flag G1) |
| 40 % (start 25 %) | rugby forwards, cheer bases, throwers, diving, alpine skiing, cycling | `cheer_base_spot`, `cycling_endurance`, `cycling_fitness`, `cycling_sprint`, `diving`, `rugby_forwards`, `ski_alpine`, `ski_snow_prep`, `track_thrower` | OK |
| 25 % (start 10 %) | swimming, water polo, rowing, judo, taekwondo, climbing | `climbing`, `judo`, `lap_swim`, `rec_climbing`, `rec_golf`, `rec_rowing`, `rowing`, `swimming_distance`, `swimming_middle`, `swimming_sprint`, `taekwondo`, `water_polo_center`, `water_polo_field`, `water_polo_goalkeeper` | OK |
| recreational | recreational players use their activity's share (golf 25 %, running 75 %, rec soccer 60 %); 'a bit of everything' stays 50 % | `rec_soccer` 60, `run_fitness` 75, `rec_golf` 25, `lap_swim` / `rec_rowing` / `rec_climbing` 25, `ski_snow_prep` / `cycling_fitness` 40, `rec_pickleball` / `rec_padel` 50, `weekend_warrior` / `rec_league` 50 | OK (flag F5 approved) |

**Aerobic sessions (COACH-R3 ATH-04, ATH-01, ATH-03, ATH-05).** Off-season cardio 2-4 'like your list' for the sports not named in round 2 (37 competitive profiles, counts unchanged, evidence now COACH-R3 ATH-04). 0 extra gym cardio (their practice is the cardio; the user can add one): `cross_country`, `cycling_endurance`, `distance_runner`, `rowing`, `swimming_distance`, `swimming_middle`, `swimming_sprint`, `track_middle`; water polo and triathlon follow by analogy (INFERRED). HYROX: 4 (Blue, Green, Orange + a second Orange). Recreational: 3, of which a 45-60+ minute session of the activity can be up to 2.

**In-season game-heavy rule (COACH-R3 ATH-04).** Now approved for lacrosse, field hockey, rugby, ultimate, flag football and beach volleyball (17 profiles). Still INFERRED (not in the round-3 question): `cheer_base_spot`, `cheer_flyer_tumbler`, `gymnastics_artistic`, `pickleball_competitive`, `tennis`, `wrestling`.

**Swimming dryland (COACH-R3 ATH-01).** Two data fixes: shoulder care was '2-3 x / week' and missing on the B day and the optional pre-season lift; the championship taper read '1-2 weeks'.

| Profile | Dryland days | Extra gym cardio | Plyo end / start | Olympic days | Shoulder care | Taper |
|---|---|---|---|---|---|---|
| `swimming_sprint` | 3 + 1 optional (2 + 1 younger / lower-level) | 0 (user can add 1) | 25 % / 10 % | 3 | every dryland day (A, B, C + pre- / in-season lifts), never bands | 2 weeks with the swim taper before the main championship meet; 1 or none before smaller meets |
| `swimming_middle` | 3 + 1 optional (2 + 1 younger / lower-level) | 0 (user can add 1) | 25 % / 10 % | 3 | every dryland day (A, B, C + pre- / in-season lifts), never bands | 2 weeks with the swim taper before the main championship meet; 1 or none before smaller meets |
| `swimming_distance` | 3 + 1 optional (2 + 1 younger / lower-level) | 0 (user can add 1) | 25 % / 10 % | 2 | every dryland day (A, B, C + pre- / in-season lifts), never bands | 2 weeks with the swim taper before the main championship meet; 1 or none before smaller meets |

**Older adults and racket players (COACH-R3 ATH-02).** From 60, ON by default: landing drills (step down and stick, no bounce), balance, quick stepping without a hop, light medball throws, fast machine work. OFF by default and switchable with the warning ('Make sure that you have a fitness professional to help you understand what this means'): low ankle hops, other jumps, Olympic lifts, depth jumps. Out: overhead squats and low-bar squats (snatch variants stay out too, COACH-ANSWER EQ-03 - flag G2). Pickleball, padel and tennis players 50+ (`rec_pickleball`, `rec_padel`, `rec_tennis`, `pickleball_competitive` and, new in v1.2, competitive `tennis` with its padel variant): knee-friendly strength, calf and Achilles work every leg day, rotator-cuff work, only low-impact jumps (no depth jumps, hurdle hops or bounds) unless switched on.

**HYROX (COACH-R3 ATH-03).** Both profiles follow the approved plan.

| Profile | Days | Cardio | Station circuits | Wall ball | 40-rep / AMRAP | Plyo share |
|---|---|---|---|---|---|---|
| `hyrox_fitness` | 4 + 1 (2 strength + 2 hybrid) | 4 (Blue, Green, Orange, 2nd Orange) | 2 finishers, not muscle sets | <= 20 lb (race ball) | only inside the circuits | 50 % |
| `hyrox_competitive` | 4 + 1 (2 strength + 2 hybrid) | 4 (Blue, Green, Orange, 2nd Orange) | 2 finishers, not muscle sets | <= 20 lb (race ball) | only inside the circuits | 50 % |

**Stay athletic and active (COACH-R3 ATH-05).** All 30 recreational profiles (every one except the CrossFit-class member, whose classes are the training) carry the same approved rules: the user can enter play days; the hardest gym day stays at least 48 h before the biggest play day; weeks with 3+ play sessions drop the extra agility drills and half the jumps; a 45-60+ minute session of the activity counts as one of the 3 cardio sessions (up to 2); optional event date - the hardest weeks end 1 week before, then 1 easy week at about half the sets; after the event the plan ends and the user builds the next one. Sport-specific extras (finger loads for climbers, pressing for combat classes) stay PROPOSED notes. The user or coach can also switch off a day's athletic or core block and add or remove exercises (COACH-R3 SES-02).

### Resolution flags (v1.2)

| Flag | Topic | Resolution | Status |
|---|---|---|---|
| G1 | 'goalkeepers 50 %' (R3-ATH-04) | Read as the field-sport goalkeepers whose v1.1 class was already 50 % (soccer_gk, lacrosse goalies, field_hockey_gk). The ice-hockey goalie stays with hockey 40 % (COACH-R2 ATH-01 'hockey 40 %') and the water-polo goalkeeper with water polo 25 % (COACH-R3 ATH-04). | PROPOSED reading - confirm |
| G2 | 60+ depth jumps and snatches | R3-ATH-02 makes depth jumps switchable for 60+ (with the warning), which overrides 'never depth jumps' (EQ-03) for older clients only; EQ-03 still holds for injured and high-volume clients. R3-ATH-02 names overhead and low-bar squats as staying out and does not mention snatches, so snatch variants stay out for 60+ under EQ-03. | APPLIED - snatch reading to confirm |
| G3 | '2 for younger or lower-level swimmers' (R3-ATH-01) | Read as 2 dryland days + 1 optional for younger (age-group, under about 14) or lower-level (L1) swimmers; the age / level threshold is PROPOSED. | PROPOSED threshold |
| G4 | Racket 50+ rules and the engine | The data now carries age_50_plus.plyo_off_by_default + applies_from_age 50 on the 4 racket profiles and competitive tennis. The current compile (tools/fixture/review-v12.mjs amendSport) turns age_50_plus.plyo text into plyo exclusions for EVERY age on rec_pickleball / rec_padel / rec_tennis / pickleball_competitive; the new tennis block is phrased so it does not trigger that, so young competitive tennis players keep their plyos. Integrator: apply the exclusions only when age >= 50. | FOR THE ENGINE TEAM |
| G5 | HYROX / OCR cardio in pre-season | R3-ATH-03 approves 4 cardio sessions because running is about half the race; the competitive race-specific (pre-season) block keeps 4 instead of the athletes' generic 2 (INFERRED from his reason). OCR keeps 4 by analogy (PROPOSED). | APPLIED (INFERRED for pre-season) |
| G6 | Climbing as cardio | v1.1 said climbing does not count; R3-ATH-05's general rule (a 45-60+ min session of the activity counts, up to 2 of 3) now applies to every recreational activity, climbing included. The user can add a cardio session. | APPLIED |
| G7 | 'hardest gym day' vs 'hardest lower-body gym day' | The approved wording is 'the hardest gym day'; v1.1 said the hardest lower-body day. The data now uses the approved wording (in practice the heavy lower day). | APPLIED |
| G8 | Unnamed sports kept at their v1.1 class | Not named in R3-ATH-04 and kept as PROPOSED: track horizontal jumpers (75 %, with sprinters), triathlon (75 %), ultimate handlers (50 %), ski / snowboard freestyle (50 %), strongman and weightlifting (25 %), OCR (50 %), rec volleyball (50 %), rec kickball / softball / hockey (40 %), hiking, surfing (25 %), dance (50 %), youth (50 %). | PROPOSED |
| G9 | Test reminders | R2-PER-07 approved reminders; R3-GEN-01 says nothing is stored. Reminders become lines printed in the plan (block start, 7 days and 1 day before the test day); no push reminders that would need stored data. | APPLIED - product spec owns the UI |
| G10 | Next block after a completed one (x1.05) | With nothing stored, the generator cannot know a block was completed; the intake asks 'Did you just finish a block?' and how many in a row (0 by default; 12_volume_algorithm v1.2 §3.12) (PROPOSED, see 06 v1.2). | PROPOSED |
| G11 | Plyo start share of the 25 % class (v1.2 adversarial check) | COACH-R2 ATH-01 approved 'each block starts 15 points more ballistic'; v1.1 had added a 20 % floor, so the 25 % class started at 20 % (only 5 points). The floor was not his rule and the engine (tools/fixture/templates-profiles.mjs) already computes end - 0.15: the 25 % class now starts at 10 % in every profile, card and table (06 v1.2 matches). | APPLIED |
| G12 | 60+ step cap (v1.2 adversarial check) | 12_volume_algorithm v1.2 retired the v1.1 PROPOSED '60+ steps <= 3 %' because it stops a trained group reaching its ceiling in the last week (COACH-R3 VOL-04); 18 older_60_plus.steps / age_notes texts still carried it. Now: the same stairway; older adults are protected by the R3-ATH-02 defaults and constrained machines (EQ-03). | APPLIED |
| G13 | Logbook-driven pain rules (v1.2 adversarial check) | PAIN_GENERAL, SHOULDER_SWIMMER, RIB_STRESS and the youth circa-PHV rule still read the BYOP logbook ('Felt a PAIN', 'HOW IT FELT?', 'if twice in a slot'), which needs check-ins and stored history. Rewritten as rules the person or coach applies on the printed plan (COACH-R3 VOL-02, GEN-01, SES-02); the pain protocol itself (VOL-03, UNI-08, GEN-05) is unchanged. | APPLIED |
| G14 | Rear delts in legacy per-muscle floor lists (v1.2 adversarial check) | Sample weeks still said 'rear delts (own sets)' and the sports-file floor checks still listed rear_delts below the floor of 10 with 'their own approved 4/6/8'. Now: rear-delt work sits in the shoulders group in every sample week; rear_delts removed from the legacy lists, which are marked SUPERSEDED by derived.v1_2_group_audit (COACH-R3 VOL-01). | APPLIED |

### What happened to the v1.1 flags and the round-3 candidates

| v1.1 item | v1.2 status |
|---|---|
| F1 Lifestyle inputs removed (R2-GEN-04 vs the approved R2-VOL-01 table) | RETIRED in v1.2: there are no check-ins at all (COACH-R3 VOL-02, VOL-04); no lifestyle inputs anywhere (COACH-R2 GEN-04) |
| F2 Rear-delt own sets (4 / 6 / 8, approved R2-VOL-04) vs the floor of 10 (R2-VOL-06) | CLOSED by COACH-R3 VOL-01: rear delts are part of the shoulders group (front + side + rear); the floor of 10 counts on the group; users / coaches can add rear-delt work (derived.v1_2_group_audit) |
| F3 Floor of 10 sets per muscle vs athlete budgets | PARTLY ANSWERED: COACH-R3 VOL-01 (floor counted on groups, training blocks) and R3-SES-01 / SES-02 (groups trained that day; time-short plans train fewer groups directly, the rest from compound credit); athlete group floors are set by 12 v1.2 |
| F4 R2-VOL-08 not understood | CLOSED: COACH-R3 VOL-03 approved the placement (alternate the first exercise between the two exposures; small-muscle bonus exercise on the optional day or on a day that already trains it, never as its only exercise) |
| F5 Recreational plyo share: activity class vs weekend-warrior 50 % | APPROVED: COACH-R3 ATH-04 (recreational players use their activity's share; 'a bit of everything' 50 %) |
| F6 HYROX / OCR keep 4 aerobic sessions in the race-specific block | APPROVED for HYROX: COACH-R3 ATH-03 (4 cardio sessions); OCR by analogy (PROPOSED) |
| F7 New ath03 group 'endurance' | PROPOSED (unchanged) |
| F8 KB swings | APPLIED (unchanged) |
| F9 60+ default: landing drills yes, low ankle hops opt-in | APPROVED: COACH-R3 ATH-02 (landing drills, balance, quick stepping, light throws, fast machine work on; ankle hops, jumps, Olympic lifts and depth jumps off and switchable with the warning) |
| F10 Swimming contact class | APPROVED: COACH-R3 ATH-01 and ATH-04 (swimming 25 %) |
| F11 Recreational COD sports bilateral : unilateral | APPLIED - PROPOSED (unchanged) |
| R3-01 Recreational players: should their plyometric share follow their sport (golf 25 %, running 75 %, soccer 60 %) ... | ANSWERED: COACH-R3 ATH-04: recreational players use their activity's share (golf 25 %, running 75 %, rec soccer 60 %); a bit of everything 50 % |
| R3-02 Does the floor of 10 sets per muscle apply to athletes in every block, or only to the muscles their off-season... | PARTLY ANSWERED: COACH-R3 VOL-01 (rear delts part of the shoulders group; floor on groups) + R3-SES-01 / SES-02 |
| R3-03 Sports you did not name in round 2 (lacrosse, field hockey, rugby, cheer, ultimate, flag, beach volleyball, sw... | ANSWERED: COACH-R3 ATH-04 (classes and off-season cardio 2-4), ATH-01 (swimming), ATH-03 (HYROX) |
| R3-04 In-season game-heavy rule: extend it to lacrosse, field hockey, rugby, ultimate, flag football, beach volleyba... | ANSWERED: COACH-R3 ATH-04 for lacrosse, field hockey, rugby, ultimate, flag football and beach volleyball; tennis tournaments were not in the final question (still INFERRED) |
| R3-05 HYROX / OCR race blocks keep 4 aerobic sessions (not the athletes' 2)? | ANSWERED: COACH-R3 ATH-03 for HYROX (4 cardio); OCR PROPOSED by analogy |
| R3-06 Swimmers, runners, cyclists, rowers: 0 extra gym cardio because their practice is the aerobic work - right? An... | ANSWERED: COACH-R3 ATH-01 (swimmers 0 extra, 2-week taper with the swim taper), ATH-04 (runners, rowers, endurance cyclists 0 extra), ATH-05 (event date for gen pop) |
| R3-07 60+: by default only landing drills (step-down and stick), balance and light throws; low ankle hops, other ply... | ANSWERED: COACH-R3 ATH-02 (approved as written; depth jumps switchable) |
| R3-08 Olympic weightlifting as a sport: will you write (or approve) its own %-based template? | OPEN: not asked in round 3 |
| R3-09 Spanish names: approve the sport, position and activity names line by line (COACH-R2 GEN-08). | OPEN: not asked in round 3 |
| R3-10 New 'stay athletic and active' choices added for completeness: boxing / kickboxing / martial-arts classes, cli... | OPEN: not asked in round 3 |
| R3-11 Pickleball / padel / tennis players 50+: knee-friendly strength, calf / Achilles work every leg day, cuff work... | ANSWERED: COACH-R3 ATH-02 (approved) |

### v1.1 rules superseded in v1.2

| v1.1 rule | v1.2 rule | ID |
|---|---|---|
| weekly step from a check-in (effort, completion, pain); 'with no check-in the plan follows its planned stairway' | no check-ins and no tracking: the plan is printed once with its built-in stairway; the person or coach adjusts it ahead of time | R3-VOL-02, R3-VOL-04 |
| maintenance end prompt 'keep maintaining / change plan / start a training block' | when a block or a maintenance phase ends, the plan ends and the user builds the next in the app; the easy week / maintenance after a block is a recommendation | R3-PER-01 |
| test reminders at block start, 7 days and 1 day before | test days and 'get ready' lines printed in the plan; nothing stored, no push reminders | R3-GEN-01 (R2-PER-07 timing kept) |
| rear delts 4 / 6 / 8 own sets (flag F2) | rear delts are part of the shoulders group; the floor of 10 counts on the group; users / coaches can add rear-delt work; v1.2 group audit | R3-VOL-01 |
| swimmers: posterior cuff work 2-3 x / week; taper 1-2 weeks | shoulder care in every dryland session; 2-week dryland taper with the swim taper before the main championship meet, 1 week or none before smaller meets | R3-ATH-01 |
| 60+: 'never depth jumps' (EQ-03) | 60+: depth jumps off by default, switchable with the warning (EQ-03 kept for injured / high-volume clients) | R3-ATH-02 |
| play-day thresholds 2+ (leagues, kickball, ski) or 4+ (golf, dance, combat, climbing); climbing not counted as cardio | weeks with 3+ play sessions drop the extra agility drills and half the jumps; a 45-60+ min activity session counts as one of 3 cardio sessions (up to 2) for every activity | R3-ATH-05 |
| competitive HYROX: 3 gym days with one station day | approved HYROX plan: 2 strength + 2 hybrid days, 4 cardio, 2 station-circuit finishers | R3-ATH-03 |
| men's lacrosse defense 50 % (class 3, INFERRED) | lacrosse 60 % for every field position | R3-ATH-04 |
| 'the engine should later learn from user data' | retired: no data is kept | R3-GEN-01 |

## v1.1 - round 2 applied + the sports merge (history)

Coach request (2026-10-08): *"for the athletes, all of the different popular sports in the United States ... Include swimming as well. And for the general population ... pickleball ... things like high rows [HYROX] and pickleball, meaning they want to stay athletic and active."*

- **coach request 2026-10-08** - Sport coverage: every popular US sport in the coach list (45 rows, all present; 49 picker sports of which 5 are routed to the nearest profile), swimming in depth (sprint / middle / distance + 5 stroke variants), diving, water polo, track & field by event group, competitive pickleball / padel / HYROX / OCR, and the gen-pop "stay athletic and active" set (pickleball, padel, tennis, golf, HYROX for fitness, rec leagues, running, hiking, cycling, lap swimming, ski prep, surf / paddle, dance, weekend warrior, rec triathlon / rowing, CrossFit-style classes + active aging 50+ / 60+ and youth overlays). See coverage.
- **merge** - Four sports files merged with 04 v1 into one profile list; duplicates removed (11 same-id records, 10 position twins numerically identical to a 04 profile, 4 recreational duplicates between files, 15 promoted 04 variants); every dropped id resolves through id_aliases.
- **merge** - One schema: category (competitive / recreational / goal), sport / sport_name / sport_name_es, positions + position_values, origin, reuse_status (04 / unchanged / delta / new), base_profile (canonical id), weekly_sets_basis, normalised aerobic_sessions_wk (numbers only + aerobic_source), ground_contact (+ plyo_share_pct / plyo_share_start_pct), in_season_gym.typical_games_wk. See schema_v1_1.
- **COACH-R2 ATH-01** - Every profile: power_mix.plyo_pct_target = class share, block start = share - 15 (floor 20); recreational profiles take their activity class (M-REC-CLASS); weekly PLYO / JLK / BALL / THROW sets of the re-classed recreational profiles re-split at the same total.
- **COACH-R2 ATH-06 / ATH-07 / SES-06** - Aerobic sessions harmonised: approved off-season values per named sport, pre-season 2, in-season 2, powerlifting-family strength sports 2 easy Orange, sport-practice sports 0 extra (0-1), aesthetics 4 + walks, every profile user-adjustable.
- **COACH-R2 ATH-07** - In season: game-heavy flag (named sports + flagged analogs), gym plyos x0.5, no extra COD, sprints only for speed athletes, hard day >= 48 h before a game.
- **COACH-R2 SES-01/02** - Spine rule text updated everywhere ('axial loading once a week' -> heavy squat and heavy deadlift on two different days + the approved axial list); powerlifting light technique exception.
- **COACH-R2 VOL-05 / VOL-04 / VOL-06** - Glute credit of hip-dominant compounds 1.0 -> 0.25 (hip thrusts / bridges 1.0 per exercise; KB swings 0); uniform derived.v1_1_audit on every profile and variant with the floor-10 list.
- **COACH-R2 VOL-07 / PER-03 / PER-04 / PER-06** - Plan-length shapes and season families: stairway, no deload / maintenance week inside a block, pre-season 4-6 weeks at ~60 % + 1-2-week taper; OBSERVED deload weeks kept as evidence only.
- **COACH-R2 ATH-08** - 60+ no Olympic lifts / plyos / depth jumps by default (option with the warning); youth floor Olympic lifts from about 14 after a hang block - in olympic_by_level, age_experience_rules and every olympic_policy.
- **COACH-R2 LIB-06** - distance_runner: the '21.6 mile run' removed.
- **generator_spec_v1.json** - vocab.profiles / sports / activities, inputs_schema F11 / F12 / F11a / F11r and derived_values.D2_profile updated from this file.

### Headline findings (v1.1)

- Coverage: 52 picker sports (44 with own profiles, 8 routed to the nearest profile) + 26 recreational activities (20 with own profiles, 6 routed) + 4 age overlays -> 127 profiles; every popular US sport in the coach request and the whole gen-pop "stay athletic and active" set is present (coverage.all_present = True).
- Swimming is first-class: sprint / middle / distance profiles with stroke variants, 0 extra gym cardio (the pool is the aerobic work), class 5 (25 % plyometric - starts and turns are single big efforts = ballistic; v1.1 sport verification), shoulder care every session, no bands, taper before the championship meet; diving and water polo alongside.
- Pickleball and HYROX exist twice: recreational (rec_pickleball, hyrox_fitness - the gen-pop path the coach asked for) and competitive (pickleball_competitive with a 60+ senior variant, hyrox_competitive).
- Every profile now follows the approved round-2 numbers: class shares (R2-ATH-01), aerobic counts (R2-ATH-06), in-season reductions (R2-ATH-07), pre-season about 60 % (R2-PER-06), Olympic lifts up to 4x / week with 60+ / youth rules (R2-ATH-04 / 08), spine rule (R2-SES-01/02), glute credits (R2-VOL-05).
- The coach-derived 04 numbers are untouched for the sports he covered (weekly sets identical); the only 04 number changes come from newer round-2 rules (aerobic counts, glute credit, weekend-warrior resistance rebased on R2-SES-05).

### Resolution flags (read these first)

| # | Topic | Resolution | Status |
|---|---|---|---|
| F1 | Lifestyle inputs removed (R2-GEN-04 vs the approved R2-VOL-01 table) | The coach approved the R2-VOL-01 check-in step table (which had a 'life was harder' column) but then rejected every lifestyle input (R2-GEN-04: 'I just need the workouts ... no need to talk about sleep or stress or anything else'). Resolution applied in v1.1: no profile, intake field or check-in uses sleep, stress, life or a physical job; the weekly step is decided from effort, completion and pain only (the approved table minus its life column). Sport load (pool yardage, mileage) is not asked either (aquatic-endurance-track.json O5). | APPLIED - flagged for the coach - v1.2: RETIRED in v1.2: there are no check-ins at all (COACH-R3 VOL-02, VOL-04); no lifestyle inputs anywhere (COACH-R2 GEN-04) |
| F2 | Rear-delt own sets (4 / 6 / 8, approved R2-VOL-04) vs the floor of 10 (R2-VOL-06) | Both statements are his: v1.1 keeps the 4 / 6 / 8 own rear-delt sets and counts the 0.25 credit from rows on top; rear delts usually sit below 10 in the audit. PROPOSED reading: rear-delt own sets are 'shoulder health' work and the floor applies to the muscles a plan trains for size - needs the coach's yes. | OPEN - v1.2: CLOSED by COACH-R3 VOL-01: rear delts are part of the shoulders group (front + side + rear); the floor of 10 counts on the group; users / coaches can add rear-delt work (derived.v1_2_group_audit) |
| F3 | Floor of 10 sets per muscle vs athlete budgets | derived.v1_1_audit lists muscles below 10 for every profile. Most athlete budgets (04 v1 coach programs) leave chest, side delts and arms below 10. PROPOSED reading (team O1, aquatic O1, combat Q1, genpop GP-2): the floor applies to muscles the athlete's plan trains for size / strength in the off-season; pre-season (~60 %) and in-season blocks are maintenance-like. The volume engine (12 v1.1) raises the targets; the profiles stay descriptive budgets. | OPEN - v1.2: PARTLY ANSWERED: COACH-R3 VOL-01 (floor counted on groups, training blocks) and R3-SES-01 / SES-02 (groups trained that day; time-short plans train fewer groups directly, the rest from compound credit); athlete group floors are set by 12 v1.2 |
| F4 | R2-VOL-08 not understood | DEFAULT used: alternate the first exercise between the two weekly exposures of a day type; a bonus small-muscle exercise (2 sets) goes on the optional day as a Focus slot (with no optional day, at the end of the shortest training day). Marked DEFAULT - not coach-approved. | DEFAULT - v1.2: CLOSED: COACH-R3 VOL-03 approved the placement (alternate the first exercise between the two exposures; small-muscle bonus exercise on the optional day or on a day that already trains it, never as its only exercise) |
| F5 | Recreational plyo share: activity class vs weekend-warrior 50 % | v1.1 gives every recreational profile its activity's contact class (M-REC-CLASS); 'a bit of everything' stays 50 %. The coach approved 'weekend warriors 50 %' and the contact-time rule; this reading combines them. | PROPOSED - round 3 - v1.2: APPROVED: COACH-R3 ATH-04 (recreational players use their activity's share; 'a bit of everything' 50 %) |
| F6 | HYROX / OCR keep 4 aerobic sessions in the race-specific block | R2-ATH-06 says pre-season 2 for athletes; HYROX is about 60 % running and OCR mostly trail running, so cutting to 2 would remove the main work (combat-strength-fitness.json Q4). Kept at 4 as a documented exception. | OPEN - v1.2: APPROVED for HYROX: COACH-R3 ATH-03 (4 cardio sessions); OCR by analogy (PROPOSED) |
| F7 | New ath03 group 'endurance' | distance / middle-distance runners, cross country, triathlon, endurance cycling, rowing, distance swimming and competitive HYROX / OCR share a PROPOSED 'endurance' group (strength for economy and tissue capacity, not mass); 04 v1 had runners under 'health'. | PROPOSED |
| F8 | KB swings | KB swings stay as a ballistic / triple-extension option (e.g. the Olympic substitute for older or injured clients) and credit no muscle (R2-VOL-05). | APPLIED |
| F9 | 60+ default: landing drills yes, low ankle hops opt-in | The approved R2-ATH-08 proposal kept landing drills and low ankle hops for 60+; the coach's added words say no plyos by default, and 'pogo and ankle hops' are on his own approved plyometric list (R2-ATH-02). v1.1 sport verification: landing drills (RC1 'Land' = step-down and stick, no rebound - the receive stage, not a plyometric) stay as the default floor together with balance, reactive stepping, light throws and fast-concentric machine work; low ankle hops move to the opt-in as its first item (with the warning; useful for bone). This also matches the competitive senior pickleball variant (none by default). Olympic lifts, other plyos and depth jumps stay opt-in only. | APPLIED (stricter reading) - round 3 confirm - v1.2: APPROVED: COACH-R3 ATH-02 (landing drills, balance, quick stepping, light throws, fast machine work on; ankle hops, jumps, Olympic lifts and depth jumps off and switchable with the warning) |
| F10 | Swimming contact class | swimming_sprint / middle / distance and lap_swim moved from class 4 (40 %) to class 5 (25 %): starts and turns are single big efforts with a long contact = ballistic in the coach's definition (COACH-R2 ATH-02); weekly PLYO / JLK / BALL / THROW re-split at the same total; a small ankle block stays for bone (AQ8). | APPLIED - round 3 (R3-03) - v1.2: APPROVED: COACH-R3 ATH-01 and ATH-04 (swimming 25 %) |
| F11 | Recreational COD sports bilateral : unilateral | rec_soccer / rec_basketball / rec_flag_football / rec_ultimate / rec_hockey moved from 50/50 -> 40/60 to 30/70 -> 20/80 (UNI-02: field / COD athletes 80-90 % unilateral; recreational one step more bilateral than competitive), matching rec_tennis / rec_pickleball / rec_padel. | APPLIED - PROPOSED |

## 0. How to read this

- **Unit.** Working sets per week in an off-season build week, mid-block (04 convention). Athletic doses in contacts / throws / cuts / metres. Aerobic work in sessions per week by colour (A Blue short / high, B Green 1-3 min, C Orange long / low, LC lactate clearance).
- **How the generator picks a profile (D2).** Competitive: sport (F11) -> position / event / discipline (F12, optional) -> profile; no position -> the sport's default profile; a variant is a delta on that profile. Recreational ("Stay athletic and active"): activity only (F11r) -> profile; no position, no season (COACH-ANSWER GEN-02). Non-athletic goals: muscle -> `bodybuilding_aesthetics`, strength -> `powerlifting_strength`, fat loss -> `fat_loss`, general -> `general_population`, hybrid -> `hybrid`. Age overlays: 60+ -> `active_aging_60plus` rules, 50-59 -> `active_aging_50plus`, under 18 -> `youth_athlete` (competitive) / `youth_general_athletic` (recreational). Old or duplicate ids resolve through `id_aliases`.
- **Season.** Competitive athletes give the season start date (or in season until / a competition date) + practice and game days; the tool works out off / pre / in season (COACH-R2 GEN-05). Pre-season = a 4-6-week block at about 60 % of off-season sets with more speed and power + a 1-2-week taper (COACH-R2 PER-06). No deload or maintenance week inside a block (COACH-R2 VOL-07). v1.2: there are no check-ins - the whole plan is printed once and the person or coach adjusts it (COACH-R3 VOL-02, VOL-04); when a block ends it ends, the easy week after it is a recommendation, and the user builds the next plan in the app (COACH-R3 PER-01).
- **Budgets are descriptive.** `weekly_sets` is the profile's off-season budget per category; the volume engine (12 v1.2) sets the real numbers per focus group (floor 10 on groups, stairway steps, caps). `weekly_sets_basis` says whether a budget is a 04 v1 coach-program budget or a 05 v1.1 template budget (gen-pop records).
- **Schema.** Every profile carries the same 59 required fields (`schema_v1_1.profile_required`); fields that do not apply are `null` and listed in `fields_filled_at_merge`. Enums: category ['competitive', 'recreational', 'goal']; family ['field_court', 'combat', 'strength', 'physique', 'endurance', 'crossfit', 'youth', 'general', 'aquatic', 'snow']; ath03_group ['resistance', 'speed_power', 'rotational_power', 'combat', 'size_strength', 'health', 'endurance']; ground_contact.class 1-5 or null; aerobic_source ['gym_plan', 'sport_plan', 'gym_plan_or_activity'].

## 1. Coverage - every popular US sport is present

Coverage check result: **ALL PRESENT** (every row below maps to existing profiles; consistency checks C17-C19).

### 1.1 Popular US sports (the coach's list)

| # | Sport | Picker (sport : choice) | Profile(s) | Variants | Status |
|---|---|---|---|---|---|
| 1 | American football (positions) | `american_football` | `football_big_skill`, `football_dl`, `football_k_p`, `football_lineman`, `football_ol`, `football_qb`, `football_rb`, `football_skill` | football_dl_edge | own profile(s) - OK |
| 2 | Flag football | `flag_football` | `flag_football` | flag_football_qb | own profile(s) - OK |
| 3 | Basketball | `basketball` | `basketball`, `basketball_big`, `basketball_guard` | - | own profile(s) - OK |
| 4 | Baseball | `baseball` | `baseball_catcher`, `baseball_infield`, `baseball_outfield`, `baseball_pitcher`, `baseball_position` | - | own profile(s) - OK |
| 5 | Softball | `softball` | `softball`, `softball_pitcher` | softball_catcher | own profile(s) - OK |
| 6 | Soccer | `soccer` | `soccer`, `soccer_defender`, `soccer_forward`, `soccer_gk` | soccer_fullback, soccer_wide_mid | own profile(s) - OK |
| 7 | Ice hockey | `ice_hockey` | `hockey`, `hockey_defense`, `hockey_goalie` | - | own profile(s) - OK |
| 8 | Volleyball - indoor | `volleyball` | `volleyball`, `volleyball_libero`, `volleyball_middle`, `volleyball_setter` | - | own profile(s) - OK |
| 9 | Volleyball - beach | `beach_volleyball` | `volleyball_beach` | volleyball_beach_blocker, volleyball_beach_defender | own profile(s) - OK |
| 10 | Lacrosse | `lacrosse` | `lacrosse_m_attack`, `lacrosse_m_defense`, `lacrosse_m_goalie`, `lacrosse_m_midfield`, `lacrosse_w_attack`, `lacrosse_w_defense`, `lacrosse_w_goalie`, `lacrosse_w_midfield` | lacrosse_fogo, lacrosse_lsm, lacrosse_w_draw | own profile(s) - OK |
| 11 | Field hockey | `field_hockey` | `field_hockey_field`, `field_hockey_gk` | field_hockey_defender, field_hockey_forward, field_hockey_midfielder | own profile(s) - OK |
| 12 | Rugby | `rugby` | `rugby_backs`, `rugby_forwards`, `rugby_sevens` | rugby_back_row, rugby_back_three, rugby_centres, rugby_front_row, rugby_halves, rugby_lock | own profile(s) - OK |
| 13 | Cheer | `cheerleading` | `cheer_base_spot`, `cheer_flyer_tumbler` | - | own profile(s) - OK |
| 14 | Track & field event groups | `track_and_field` | `distance_runner`, `track_400`, `track_high_jump`, `track_hurdles`, `track_javelin`, `track_jumper`, `track_middle`, `track_pole_vault`, `track_sprinter`, `track_thrower` | track_400h, track_steeple, track_thrower_hammer, track_triple_jump | own profile(s) - OK |
| 15 | Cross country | `distance_running:cross_country` | `cross_country` | - | own profile(s) - OK |
| 16 | Road running (+ trail / ultra, v1.1 sport verification) | `distance_running:5k_10k`, `distance_running:half`, `distance_running:marathon`, `distance_running:trail_ultra` | `distance_runner` | - | own profile(s) - OK |
| 17 | Swimming (strokes and distances) | `swimming` | `swimming_distance`, `swimming_middle`, `swimming_sprint` | stroke_back, stroke_breast, stroke_fly, stroke_free, stroke_im | own profile(s) - OK |
| 18 | Diving | `diving` | `diving` | diving_platform | own profile(s) - OK |
| 19 | Water polo | `water_polo` | `water_polo_center`, `water_polo_field`, `water_polo_goalkeeper` | - | own profile(s) - OK |
| 20 | Triathlon | `triathlon` | `triathlon` | - | own profile(s) - OK |
| 21 | Cycling | `cycling` | `cycling_endurance`, `cycling_sprint` | cycling_bmx, cycling_indoor, cycling_mtb | own profile(s) - OK |
| 22 | Rowing | `rowing` | `rowing` | rowing_sculling, rowing_sweep | own profile(s) - OK |
| 23 | Skiing / snowboarding | `ski_snowboard` | `ski_alpine`, `ski_freestyle` | ski_speed, snowboard_race | own profile(s) - OK |
| 24 | Wrestling | `wrestling` | `wrestling` | wrestling_greco, wrestling_heavyweight | own profile(s) - OK |
| 25 | Boxing | `boxing` | `boxing` | boxing_heavyweight | own profile(s) - OK |
| 26 | MMA | `mma` | `mma` | mma_heavyweight | own profile(s) - OK |
| 27 | BJJ | `bjj` | `bjj_grappling` | bjj_nogi | own profile(s) - OK |
| 28 | Judo | `judo` | `judo` | judo_heavyweight | own profile(s) - OK |
| 29 | Karate | `karate` | `karate_taekwondo` | karate_kata | own profile(s) - OK |
| 30 | Taekwondo | `taekwondo` | `taekwondo` | taekwondo_poomsae | own profile(s) - OK |
| 31 | Kickboxing | `kickboxing_muay_thai` | `kickboxing_muay_thai` | muay_thai_clinch | own profile(s) - OK |
| 32 | Powerlifting | `powerlifting` | `powerlifting_strength` | strength_12wk | own profile(s) - OK |
| 33 | Olympic weightlifting | `olympic_weightlifting` | `weightlifting` | weightlifting_advanced | own profile(s) - OK |
| 34 | Strongman | `strongman` | `strongman` | - | own profile(s) - OK |
| 35 | CrossFit | `crossfit` | `crossfit_competitor` | - | own profile(s) - OK |
| 36 | HYROX | `hyrox` | `hyrox_competitive` | hyrox_doubles, hyrox_pro | own profile(s) - OK |
| 37 | OCR | `ocr` | `ocr_spartan` | ocr_long_course | own profile(s) - OK |
| 38 | Bodybuilding / physique | `bodybuilding_physique` | `bodybuilding_aesthetics` | aesthetics_12wk_ppl, aesthetics_3day, physique_bikini, physique_classic, physique_figure, physique_mens_bodybuilding, physique_mens_physique, physique_wellness, physique_womens_physique | own profile(s) - OK |
| 39 | Gymnastics | `gymnastics` | `gymnastics_artistic` | gymnastics_mag | own profile(s) - OK |
| 40 | Climbing | `climbing` | `climbing` | climbing_lead, climbing_speed | own profile(s) - OK |
| 41 | Golf | `golf` | `golf` | - | own profile(s) - OK |
| 42 | Tennis | `tennis` | `tennis` | padel_competitive | own profile(s) - OK |
| 43 | Pickleball | `pickleball` | `pickleball_competitive` | pickleball_senior_60_plus | own profile(s) - OK |
| 44 | Padel | `padel` | `tennis` | padel_competitive | variant of a profile - OK |
| 45 | Ultimate | `ultimate` | `ultimate_cutter`, `ultimate_handler` | - | own profile(s) - OK |

### 1.2 Gen pop: "stay athletic and active"

| # | Activity | Route | Profile(s) | Notes |
|---|---|---|---|---|
| 1 | Recreational pickleball | `F11r:rec_pickleball` | `rec_pickleball` | Pickleball - recreational (open play, league, ladder); competitive counterpart: pickleball_competitive; coach request 2026-10-08 ('include pickleball because that's a very popular sport right now'); many players 50+; 60+ defaults apply (COACH-R2 ATH-08) |
| 2 | Padel | `F11r:rec_padel` | `rec_padel` | Padel - recreational; competitive counterpart: tennis (variant padel_competitive) |
| 3 | Tennis | `F11r:rec_tennis` | `rec_tennis` | Tennis - recreational (social, club or adult league); competitive counterpart: tennis |
| 4 | Golf | `F11r:rec_golf` | `rec_golf` | Golf - recreational; competitive counterpart: golf |
| 5 | HYROX for fitness | `F11r:hyrox_fitness` | `hyrox_fitness` | HYROX for fitness (first race / Open division); competitive counterpart: hyrox_competitive; coach said 'high rows' = HYROX (INFERRED reading of the transcript, backed by his round-1 EQ-06 'CrossFit, or ... high rows?' next to wall balls and VOL-11 'high-raw athletes'); race = 8 x 1 km run + 8 workout stations |
| 6 | Rec leagues | `F11r:rec_league` | `rec_league`, `rec_basketball`, `rec_soccer`, `rec_softball`, `rec_flag_football`, `rec_volleyball`, `rec_hockey`, `rec_ultimate`, `rec_kickball` | Rec league (adult recreational team sport - pick the sport) |
| 7 | Running for fitness | `F11r:run_fitness` | `run_fitness` | Running for fitness (first 5K / 10K, run club); competitive counterpart: distance_runner |
| 8 | Hiking / rucking | `F11r:hike_ruck` | `hike_ruck` | Hiking and rucking |
| 9 | Cycling | `F11r:cycling_fitness` | `cycling_fitness` | Cycling and indoor cycling for fitness; competitive counterpart: cycling_endurance |
| 10 | Lap swimming | `F11r:lap_swim` | `lap_swim` | Lap swimming for fitness (incl. masters-style workouts); competitive counterpart: swimming_middle |
| 11 | Ski prep | `F11r:ski_snow_prep` | `ski_snow_prep` | Ski / snowboard season prep; competitive counterpart: ski_alpine |
| 12 | Surf / paddle | `F11r:surf_paddle` | `surf_paddle` | Surfing and stand-up paddleboarding |
| 13 | Dance / fitness classes | `F11r:dance_fitness` | `dance_fitness` | Dance and group fitness classes (Zumba, dance cardio, step) |
| 14 | Weekend warrior | `F11r:weekend_warrior` | `weekend_warrior` | Athletic Performance - Non-Competitive (weekend warrior; formerly 'Justice League'); his former 'Justice League' program: non-competitive all-round athletic adults and youth (COACH-ANSWER ATH-13) |
| 15 | Active aging 50+ | `age overlay (F02)` | `active_aging_50plus` | Active aging 50-59 (stay athletic) - age (F02) 50-59 |
| 16 | Active aging 60+ | `age overlay (F02)` | `active_aging_60plus` | Active aging 60+ (stay athletic, older-adult rules) - age (F02) >= 60 |
| 17 | Youth | `age overlay (F02)` | `youth_general_athletic` | Youth general athletic development (non-competitive kids and teens) - age (F02) < 18 and not competitive |
| 18 | Boxing / kickboxing / martial-arts classes | `F11r:rec_combat_fitness` | `rec_combat_fitness` | NEW (v1.1 sport verification): class 5 (25 %), rotational throws, ATH-04 pressing rule; style router: grappling -> variant combat_fitness_grappling |
| 19 | Climbing / bouldering gym | `F11r:rec_climbing` | `rec_climbing` | NEW (v1.1 sport verification): class 5 (25 %), antagonist push + shoulder ER, grip balance, landing practice; competitive counterpart: climbing |
| 20 | Obstacle course race (first Spartan / Tough Mudder) | `F11r:rec_ocr` | `rec_ocr` | NEW (v1.1 sport verification): class 3 (50 %), 4 aerobic sessions like HYROX, pulling / grip / carries; competitive counterpart: ocr_spartan |
| 21 | Badminton / squash / racquetball / table tennis | `F11r:rec_racket_other` | `rec_tennis` | ROUTED (v1.1 sport verification) |
| 22 | Disc golf / bowling | `F11r:rec_disc_golf`, `F11r:rec_bowling` | `rec_golf` | ROUTED (v1.1 sport verification) |
| 23 | Trail running / mountain biking / kayak, canoe, wakeboard, water-ski | `F11r:rec_trail_running`, `F11r:rec_mountain_biking`, `F11r:rec_paddle_water` | `run_fitness`, `cycling_fitness`, `surf_paddle` | ROUTED (v1.1 sport verification) |

### 1.3 Also covered

| Sport / activity | Route | Profile(s) | Status |
|---|---|---|---|
| Competitive dance / drill team | `F11:dance_team` | `cheer_flyer_tumbler` | routed (nearest profile, INFERRED) |
| Figure skating | `F11:figure_skating` | `gymnastics_artistic` | routed (nearest profile, INFERRED) |
| Fencing | `F11:fencing` | `tennis` | routed (nearest profile, INFERRED) |
| Badminton / squash / racquetball / table tennis | `F11:racket_other` | `tennis` | routed (nearest profile, INFERRED) |
| Bowling | `F11:bowling` | `golf` | routed (nearest profile, INFERRED) |
| Kickball (rec league) | `F11r:rec_league:kickball` | `rec_kickball` | own profile |
| Triathlon for fitness | `F11r:rec_triathlon` | `rec_triathlon` | own profile |
| Rowing / indoor rowing for fitness | `F11r:rec_rowing` | `rec_rowing` | own profile |
| CrossFit-style classes | `F11r:crossfit_class` | `crossfit_class` | own profile |
| Skateboarding | `F11:skateboarding` | `ski_freestyle` | routed (nearest profile, INFERRED) - v1.1 sport verification |
| Surfing (competitive) | `F11:surfing` | `ski_freestyle` (+ surf_paddle paddling-shoulder rules) | routed (nearest profile, INFERRED) - v1.1 sport verification |
| Speed skating (long / short track) | `F11:speed_skating` | `ski_alpine` | routed (nearest profile, INFERRED) - v1.1 sport verification |
| Trail / ultramarathon | `F11:distance_running:trail_ultra` | `distance_runner` | choice on an existing sport - v1.1 sport verification |

### 1.4 The coach's sample plans (COACH-R2 GEN-07) -> profiles (PROPOSED)

| Plan | Profile | Variant / alternatives | Note |
|---|---|---|---|
| swimming | `swimming_middle` | stroke_free (or the swimmer's main stroke) | approved dryland defaults (COACH-R3 ATH-01): 3 dryland days + 1 optional (2 for younger / lower-level), 0 extra gym cardio, 25 % plyometric (mostly ballistic start / turn power + a small ankle block for bone), Olympic lifts 2-3 days, shoulder care every session, no bands, 2-week dryland taper with the swim coach's taper before the main championship meet (1 week or none before smaller meets) |
| football | `football_skill` | football_big_skill, football_ol, football_dl, football_qb, football_rb, football_k_p | off-season, WR / DB default; position changes the profile |
| soccer | `soccer` | soccer_defender, soccer_forward, soccer_gk | midfielder = the 04 coach-derived soccer budget |
| crossfit_style_bootcamp | `crossfit_class` | hybrid | CrossFit class structure (warm-up / skill -> strength / power -> WOD) from the coach's CrossFit split; muscle volume question open (combat-strength-fitness.json Q10) |
| bootcamp | `fat_loss` | bootcamp_1 / bootcamp_2 | F07 fat_loss or general + F07b bootcamp format |
| full_body_aesthetics | `bodybuilding_aesthetics` | aesthetics_3day | full-body days: 2-4 exercises per muscle (COACH-R2 SES-05); no medball (ATH-05); 4 aerobic incl. a second Orange + walks (COACH-R2 SES-06) |
| push_pull_legs | `bodybuilding_aesthetics` | aesthetics_12wk_ppl | split days 3-4 exercises per muscle |

Not listed in the picker: the user picks the closest type (court, field, endurance, combat, strength and power, water, board and snow) - generator_spec F11 `not_listed` (PROPOSED).

## 2. Sport picker: sport -> position -> profile (EN / ES)

Spanish names are drafts in neutral Latin American Spanish with the English gym term in brackets; the coach (or a coach he trusts) approves every line (COACH-R2 GEN-08). Positions are optional; with no position the default profile is used. Every competitive sport also asks the season start date and practice / game days (COACH-R2 GEN-05).

### Team field and court / Deportes de equipo (campo y cancha)

| Sport (EN / ES) | Choice label | Choice (EN / ES) | Profile | Variant / note |
|---|---|---|---|---|
| **American football** / Fútbol americano (`american_football`) | Position / Posición | (none / default) | `football_big_skill` | no position given -> the mixed-contact middle profile (class 3, 50 %) - INFERRED |
| | | Quarterback (QB) / Mariscal de campo (Quarterback, QB) | `football_qb` | - |
| | | Running back (RB) / Corredor (Running back, RB) | `football_rb` | - |
| | | Fullback (FB) / Corredor de poder (Fullback, FB) | `football_big_skill` | lighter fullbacks -> football_rb |
| | | Wide receiver (WR) / Receptor abierto (Wide receiver, WR) | `football_skill` | - |
| | | Tight end (TE) / Ala cerrada (Tight end, TE) | `football_big_skill` | - |
| | | Offensive line (OL) / Línea ofensiva (OL) | `football_ol` | - |
| | | Lineman (both lines / not sure) / Liniero (ambas líneas / no definido) | `football_lineman` | OL / DL base profile |
| | | Defensive line (DL) / Línea defensiva (DL) | `football_dl` | edge rushers -> variant football_dl_edge |
| | | Linebacker (LB) / Apoyador (Linebacker, LB) | `football_big_skill` | - |
| | | Cornerback (CB) / Esquinero (Cornerback, CB) | `football_skill` | - |
| | | Safety (S) / Profundo (Safety, S) | `football_skill` | box safeties -> football_big_skill |
| | | Kicker / punter / long snapper (K / P / LS) / Pateador / despejador / centro largo (K / P / LS) | `football_k_p` | - |
| **Flag football** / Flag football (fútbol americano sin contacto) (`flag_football`) | Position / Posición | (none / default) | `flag_football` |  |
| | | Quarterback / Mariscal de campo (Quarterback) | `flag_football` | variant `flag_football_qb` |
| | | Any other position (receiver, rusher, center, DB) / Cualquier otra posición (receptor, rusher, centro, defensivo) | `flag_football` | - |
| **Basketball** / Baloncesto (básquetbol) (`basketball`) | Position / Posición | (none / default) | `basketball` |  |
| | | Guard (PG / SG) / Base / escolta (PG / SG) | `basketball_guard` | - |
| | | Wing (SF) / Alero (SF) | `basketball` | - |
| | | Big (PF / C) / Ala-pívot / pívot (PF / C) | `basketball_big` | - |
| **Baseball** / Béisbol (`baseball`) | Position / Posición | (none / default) | `baseball_position` |  |
| | | Pitcher / Lanzador (pitcher) | `baseball_pitcher` | - |
| | | Catcher / Receptor (catcher) | `baseball_catcher` | - |
| | | Infield / Cuadro interior (infield) | `baseball_infield` | - |
| | | Outfield / Jardinero (outfield) | `baseball_outfield` | - |
| **Softball** / Sóftbol (`softball`) | Position / Posición | (none / default) | `softball` |  |
| | | Pitcher / Lanzadora (pitcher) | `softball_pitcher` | - |
| | | Catcher / Receptora (catcher) | `softball` | variant `softball_catcher` |
| | | Infield / Cuadro interior (infield) | `softball` | - |
| | | Outfield / Jardinera (outfield) | `softball` | - |
| **Soccer** / Fútbol (soccer) (`soccer`) | Position / Posición | (none / default) | `soccer` |  |
| | | Goalkeeper / Portero | `soccer_gk` | - |
| | | Defender (center back / full-back) / Defensa (central / lateral) | `soccer_defender` | full-backs / wing-backs -> variant soccer_fullback |
| | | Midfielder / Mediocampista | `soccer` | wide midfielders -> variant soccer_wide_mid |
| | | Forward (striker / winger) / Delantero (centro delantero / extremo) | `soccer_forward` | - |
| **Ice hockey** / Hockey sobre hielo (`ice_hockey`) | Position / Posición | (none / default) | `hockey` |  |
| | | Forward (center / wing) / Delantero (centro / ala) | `hockey` | - |
| | | Defense / Defensa | `hockey_defense` | - |
| | | Goalie / Portero | `hockey_goalie` | - |
| **Volleyball (indoor)** / Voleibol (sala) (`volleyball`) | Position / Posición | (none / default) | `volleyball` |  |
| | | Outside / opposite hitter / Atacante exterior / opuesto | `volleyball` | - |
| | | Middle blocker / Central (bloqueador central) | `volleyball_middle` | - |
| | | Setter / Armador (colocador) | `volleyball_setter` | - |
| | | Libero / defensive specialist / Líbero / especialista defensivo | `volleyball_libero` | - |
| **Beach volleyball** / Voleibol de playa (`beach_volleyball`) | Position / Posición | (none / default) | `volleyball_beach` |  |
| | | Blocker / Bloqueador | `volleyball_beach` | variant `volleyball_beach_blocker` |
| | | Defender / Defensor | `volleyball_beach` | variant `volleyball_beach_defender` |
| **Lacrosse (men's and women's)** / Lacrosse (masculino y femenino) (`lacrosse`) | Position / Posición | (none / default) | `lacrosse_m_midfield` |  |
| | Men's or women's game / Juego masculino o femenino | Men's lacrosse / Lacrosse masculino; Women's lacrosse / Lacrosse femenino | | the two games differ (contact, stick, field), so each has its own profiles; this is about the game played, not a sex-based rule (COACH-ANSWER ATH-09) |
| | | Attack / Ataque | m: `lacrosse_m_attack` / w: `lacrosse_w_attack` | - |
| | | Midfield / Mediocampo | m: `lacrosse_m_midfield` / w: `lacrosse_w_midfield` | men's face-off specialist (FOGO) -> variant lacrosse_fogo; women's draw specialist -> variant lacrosse_w_draw |
| | | Defense / Defensa | m: `lacrosse_m_defense` / w: `lacrosse_w_defense` | men's long-stick midfielder (LSM) -> variant lacrosse_lsm |
| | | Goalie / Portero | m: `lacrosse_m_goalie` / w: `lacrosse_w_goalie` | - |
| **Field hockey** / Hockey sobre césped (`field_hockey`) | Position / Posición | (none / default) | `field_hockey_field` |  |
| | | Forward / Delantero | `field_hockey_field` | variant `field_hockey_forward` |
| | | Midfielder / Mediocampista | `field_hockey_field` | variant `field_hockey_midfielder` |
| | | Defender / Defensa | `field_hockey_field` | variant `field_hockey_defender` |
| | | Goalkeeper / Portero | `field_hockey_gk` | - |
| **Rugby** / Rugby (`rugby`) | Position / Posición | (none / default) | `rugby_backs` | no position given -> backs (mixed contact class) - INFERRED |
| | | Forwards (front row, locks, back row) / Delanteros (primera, segunda y tercera línea) | `rugby_forwards` | - |
| | | Backs (halves, centres, back three) / Tres cuartos (medios, centros, línea de tres) | `rugby_backs` | - |
| | | Sevens (any position) / Rugby 7 (cualquier posición) | `rugby_sevens` | - |
| **Cheerleading / STUNT** / Porrismo / animación (cheerleading, STUNT) (`cheerleading`) | Position / Posición | (none / default) | `cheer_flyer_tumbler` |  |
| | | Base / Base | `cheer_base_spot` | - |
| | | Back spot / Spotter trasero (back spot) | `cheer_base_spot` | - |
| | | Flyer / Volador(a) (flyer) | `cheer_flyer_tumbler` | - |
| | | Tumbler / all-around / Acróbata (tumbler) / completo | `cheer_flyer_tumbler` | - |
| **Ultimate** / Ultimate (frisbee) (`ultimate`) | Position / Posición | (none / default) | `ultimate_cutter` |  |
| | | Handler / Handler (lanzador) | `ultimate_handler` | - |
| | | Cutter / deep / Cortador (cutter) / profundo | `ultimate_cutter` | - |
| **Competitive dance / drill team** / Danza competitiva / equipo de baile (drill team) (`dance_team`) | - / - | (none / default) | `cheer_flyer_tumbler` | ROUTED: no researched profile: nearest = cheer flyer / tumbler (short contacts, leaps, landings, flexibility) - INFERRED |

### Aquatic, endurance and track / Acuáticos, resistencia y atletismo

| Sport (EN / ES) | Choice label | Choice (EN / ES) | Profile | Variant / note |
|---|---|---|---|---|
| **Swimming** / Natación (`swimming`) | Event group / Grupo de pruebas | (none / default) | `swimming_middle` | coach request 2026-10-08 ('Include swimming as well'); first sample plan he will grade (COACH-R2 GEN-07) |
| | Main stroke / Estilo principal | Freestyle / Libre -> `stroke_free`; Backstroke / Espalda (dorso) -> `stroke_back`; Breaststroke / Pecho -> `stroke_breast`; Butterfly / Mariposa -> `stroke_fly`; Individual medley (IM) / Combinado individual (IM) -> `stroke_im` | | the stroke changes shoulder / knee / low-back care (variants[].injuries_add), not the weekly budget |
| | | Sprint (50-100) / Velocidad (50-100) | `swimming_sprint` | - |
| | | Middle distance (200-400 / IM) / Medio fondo (200-400 / combinado) | `swimming_middle` | - |
| | | Distance (800-1500 / open water) / Fondo (800-1500 / aguas abiertas) | `swimming_distance` | - |
| **Diving** / Clavados (`diving`) | Discipline / Disciplina | (none / default) | `diving` |  |
| | | Springboard (1 m / 3 m) / Trampolín (1 m / 3 m) | `diving` | - |
| | | Platform (5-10 m) / Plataforma (5-10 m) | `diving` | variant `diving_platform` |
| **Water polo** / Waterpolo (`water_polo`) | Position / Posición | (none / default) | `water_polo_field` |  |
| | | Field player (driver, wing, point, defender) / Jugador de campo (atacante, ala, punto, defensa) | `water_polo_field` | - |
| | | Center / center defender (2-meter) / Boya / defensor de boya (2 metros) | `water_polo_center` | - |
| | | Goalkeeper / Portero | `water_polo_goalkeeper` | - |
| **Track and field** / Atletismo (pista y campo) (`track_and_field`) | Event group / Grupo de pruebas | (none / default) | `track_sprinter` |  |
| | | Sprints (60-200 m) / Velocidad (60-200 m) | `track_sprinter` | - |
| | | 400 m / 400 m | `track_400` | - |
| | | Hurdles (100 / 110 m) / Vallas (100 / 110 m) | `track_hurdles` | - |
| | | 400 m hurdles / 400 m con vallas | `track_hurdles` | variant `track_400h` |
| | | Long / triple jump / Salto de longitud / triple | `track_jumper` | triple jump -> variant track_triple_jump |
| | | High jump / Salto de altura | `track_high_jump` | - |
| | | Pole vault / Salto con garrocha (pértiga) | `track_pole_vault` | - |
| | | Shot put / discus / hammer / Bala / disco / martillo | `track_thrower` | hammer -> variant track_thrower_hammer |
| | | Javelin / Jabalina | `track_javelin` | - |
| | | 800-1500 m / mile (steeplechase) / 800-1500 m / milla (obstáculos) | `track_middle` | steeplechase -> variant track_steeple |
| | | 5000-10,000 m / 5000-10 000 m | `distance_runner` | - |
| **Cross country and road running** / Campo traviesa (cross country) y carreras de ruta (`distance_running`) | Race type / Tipo de carrera | (none / default) | `distance_runner` |  |
| | | Cross country (high school / college) / Campo traviesa (escolar / universitario) | `cross_country` | - |
| | | Road 5K-10K / Ruta 5K-10K | `distance_runner` | - |
| | | Half marathon / Medio maratón | `distance_runner` | the coach's half-marathon plan (Chris Hinshaw), used as-is |
| | | Marathon / Maratón | `distance_runner` | strength plan + the runner's own run plan; the 21.6-mile run is removed (COACH-R2 LIB-06) |
| | | Trail / ultramarathon / Trail / ultramaratón | `distance_runner` | add KNEE_DESCENT_ECCENTRIC rules for downhills (v1.1 sport verification) |
| **Triathlon** / Triatlón (`triathlon`) | Race distance / Distancia | (none / default) | `triathlon` |  |
| | | Sprint / Olympic / Sprint / olímpico | `triathlon` | - |
| | | 70.3 (half distance) / 70.3 (media distancia) | `triathlon` | - |
| | | Full distance (140.6) / Distancia completa (140.6) | `triathlon` | - |
| **Cycling** / Ciclismo (`cycling`) | Discipline / Disciplina | (none / default) | `cycling_endurance` |  |
| | | Road / Ruta | `cycling_endurance` | - |
| | | Mountain bike (XC / enduro) / Ciclismo de montaña (MTB) | `cycling_endurance` | variant `cycling_mtb` |
| | | Gravel / Gravel | `cycling_endurance` | - |
| | | Indoor racing / Ciclismo indoor (carreras virtuales) | `cycling_endurance` | variant `cycling_indoor` |
| | | Track sprint / keirin / Velocidad en pista / keirin | `cycling_sprint` | - |
| | | BMX racing / BMX (carreras) | `cycling_sprint` | variant `cycling_bmx` |
| **Rowing (crew)** / Remo (`rowing`) | Discipline / Disciplina | (none / default) | `rowing` |  |
| | | Sweep (port / starboard) / Punta (babor / estribor) | `rowing` | variant `rowing_sweep` |
| | | Sculling / Scull (dos remos) | `rowing` | variant `rowing_sculling` |
| **Skiing / snowboarding (competitive)** / Esquí / snowboard (competitivo) (`ski_snowboard`) | Discipline / Disciplina | (none / default) | `ski_alpine` |  |
| | | Alpine racing (slalom / giant slalom) / Esquí alpino (slalom / gigante) | `ski_alpine` | - |
| | | Speed (super-G / downhill) / Velocidad (súper gigante / descenso) | `ski_alpine` | variant `ski_speed` |
| | | Snowboard racing / snowboard cross / Snowboard (carreras / cross) | `ski_alpine` | variant `snowboard_race` |
| | | Freestyle ski or snowboard (moguls, slopestyle, halfpipe, big air) / Estilo libre en esquí o snowboard (baches, slopestyle, halfpipe, big air) | `ski_freestyle` | - |
| **Figure skating** / Patinaje artístico (`figure_skating`) | Discipline / Disciplina | (none / default) | `gymnastics_artistic` | ROUTED: no researched profile: nearest = artistic gymnastics (jumps / landings, rotation, relative strength) - INFERRED |
| | | Singles / Individual | `gymnastics_artistic` | - |
| | | Pairs / ice dance / Parejas / danza sobre hielo | `gymnastics_artistic` | - |
| **Skateboarding (street / park)** / Patineta (skateboarding: street / park) (`skateboarding`) | - / - | (none / default) | `ski_freestyle` | ROUTED: nearest = freestyle ski / snowboard (board sport, jumps and landings, rotation, balance; FALL_UPPER_LIMB wrist rules) - INFERRED (v1.1 sport verification) |
| **Surfing (competitive)** / Surf (competitivo) (`surfing`) | - / - | (none / default) | `ski_freestyle` | ROUTED: nearest = freestyle ski / snowboard + the surf_paddle paddling-shoulder rules (SHOULDER_SWIMMER) - INFERRED (v1.1 sport verification) |
| **Speed skating (long / short track)** / Patinaje de velocidad (pista larga / corta) (`speed_skating`) | - / - | (none / default) | `ski_alpine` | ROUTED: nearest = alpine ski racing (low crouch under load, lateral push, eccentric legs) - INFERRED (v1.1 sport verification) |

### Combat sports / Deportes de combate

| Sport (EN / ES) | Choice label | Choice (EN / ES) | Profile | Variant / note |
|---|---|---|---|---|
| **Wrestling (folkstyle / freestyle / Greco-Roman)** / Lucha (folkstyle / libre / grecorromana) (`wrestling`) | Weight class / Categoría de peso | (none / default) | `wrestling` |  |
| | | Light / Ligero | `wrestling` | - |
| | | Middle / Medio | `wrestling` | - |
| | | Heavy / Pesado | `wrestling` | variant `wrestling_heavyweight` |
| **Boxing** / Boxeo (`boxing`) | Weight class / Categoría de peso | (none / default) | `boxing` |  |
| | | Light / Ligero | `boxing` | - |
| | | Middle / Medio | `boxing` | - |
| | | Heavy / Pesado | `boxing` | variant `boxing_heavyweight` |
| **MMA (mixed martial arts)** / MMA (artes marciales mixtas) (`mma`) | Weight class / Categoría de peso | (none / default) | `mma` |  |
| | | Light / Ligero | `mma` | - |
| | | Middle / Medio | `mma` | - |
| | | Heavy / Pesado | `mma` | variant `mma_heavyweight` |
| **Brazilian jiu-jitsu / grappling** / Jiu-jitsu brasileño (BJJ) / grappling (`bjj`) | Format / Modalidad | (none / default) | `bjj_grappling` |  |
| | | Gi / Con gi (kimono) | `bjj_grappling` | - |
| | | No-gi / submission grappling / Sin gi (no-gi) / grappling | `bjj_grappling` | variant `bjj_nogi` |
| **Judo** / Judo (`judo`) | Weight class / Categoría de peso | (none / default) | `judo` |  |
| | | Light / Ligero | `judo` | - |
| | | Middle / Medio | `judo` | - |
| | | Heavy / Pesado | `judo` | variant `judo_heavyweight` |
| **Karate** / Karate (`karate`) | Format / Modalidad | (none / default) | `karate_taekwondo` |  |
| | | Kumite (sparring) / Kumite (combate) | `karate_taekwondo` | - |
| | | Kata (forms) / Kata (formas) | `karate_taekwondo` | variant `karate_kata` |
| **Taekwondo** / Taekwondo (`taekwondo`) | Format / Modalidad | (none / default) | `taekwondo` |  |
| | | Sparring (kyorugi) / Combate (kyorugi) | `taekwondo` | - |
| | | Poomsae (forms) / Poomsae (formas) | `taekwondo` | variant `taekwondo_poomsae` |
| **Kickboxing / Muay Thai** / Kickboxing / Muay Thai (`kickboxing_muay_thai`) | Format / Modalidad | (none / default) | `kickboxing_muay_thai` |  |
| | | Kickboxing / Kickboxing | `kickboxing_muay_thai` | - |
| | | Muay Thai (clinch-heavy) / Muay Thai (con mucho clinch) | `kickboxing_muay_thai` | variant `muay_thai_clinch` |
| **Fencing** / Esgrima (`fencing`) | - / - | (none / default) | `tennis` | ROUTED: no researched profile: nearest = tennis (fast lunging footwork, mostly unilateral, reactive) - INFERRED |

### Strength and fitness sports / Deportes de fuerza y fitness

| Sport (EN / ES) | Choice label | Choice (EN / ES) | Profile | Variant / note |
|---|---|---|---|---|
| **Powerlifting** / Powerlifting (levantamiento de potencia) (`powerlifting`) | Division / División | (none / default) | `powerlifting_strength` |  |
| | | Raw / classic / Raw / clásico | `powerlifting_strength` | - |
| | | Equipped / Equipado | `powerlifting_strength` | - |
| **Olympic weightlifting** / Halterofilia (levantamiento olímpico) (`olympic_weightlifting`) | - / - | (none / default) | `weightlifting` | its own percentage-based programming (COACH-R2 GEN-06); the profile is a scaffold until the coach writes or approves one |
| **Strongman** / Strongman (hombre más fuerte) (`strongman`) | - / - | (none / default) | `strongman` |  |
| **CrossFit (competitive)** / CrossFit (competitivo) (`crossfit`) | Division / División | (none / default) | `crossfit_competitor` |  |
| | | Individual / Individual | `crossfit_competitor` | - |
| | | Team / Equipos | `crossfit_competitor` | - |
| | | Masters / teens / Máster / adolescentes | `crossfit_competitor` | - |
| **HYROX (competitive)** / HYROX (competitivo) (`hyrox`) | Division / División | (none / default) | `hyrox_competitive` |  |
| | | Open / Open | `hyrox_competitive` | - |
| | | Pro (heavier stations) / Pro (estaciones más pesadas) | `hyrox_competitive` | variant `hyrox_pro` |
| | | Doubles / relay / Dobles / relevos | `hyrox_competitive` | variant `hyrox_doubles` |
| **Obstacle course racing (Spartan and similar)** / Carreras de obstáculos (OCR, Spartan y similares) (`ocr`) | Course / Recorrido | (none / default) | `ocr_spartan` |  |
| | | Short course (5-10 km) / Recorrido corto (5-10 km) | `ocr_spartan` | - |
| | | Long course (21-50 km) / Recorrido largo (21-50 km) | `ocr_spartan` | variant `ocr_long_course` |
| **Bodybuilding / physique** / Fisicoculturismo (Bodybuilding / Physique) (`bodybuilding_physique`) | Division / División | (none / default) | `bodybuilding_aesthetics` |  |
| | | Men's bodybuilding / Fisicoculturismo varonil | `bodybuilding_aesthetics` | variant `physique_mens_bodybuilding` |
| | | Classic physique / Classic physique | `bodybuilding_aesthetics` | variant `physique_classic` |
| | | Men's physique / Men's physique | `bodybuilding_aesthetics` | variant `physique_mens_physique` |
| | | Bikini / Bikini | `bodybuilding_aesthetics` | variant `physique_bikini` |
| | | Wellness / Wellness | `bodybuilding_aesthetics` | variant `physique_wellness` |
| | | Figure / Figure | `bodybuilding_aesthetics` | variant `physique_figure` |
| | | Women's physique / bodybuilding / Women's physique / fisicoculturismo femenil | `bodybuilding_aesthetics` | variant `physique_womens_physique` |
| **Gymnastics (artistic)** / Gimnasia artística (`gymnastics`) | Discipline / Disciplina | (none / default) | `gymnastics_artistic` |  |
| | | Women's artistic / Artística femenil | `gymnastics_artistic` | - |
| | | Men's artistic / Artística varonil | `gymnastics_artistic` | variant `gymnastics_mag` |
| **Climbing / bouldering** / Escalada / búlder (bouldering) (`climbing`) | Discipline / Disciplina | (none / default) | `climbing` |  |
| | | Bouldering / Búlder (bouldering) | `climbing` | - |
| | | Lead / sport climbing / Escalada deportiva (de dificultad) | `climbing` | variant `climbing_lead` |
| | | Speed climbing / Escalada de velocidad | `climbing` | variant `climbing_speed` |

### Racket and club / Raqueta y palo

| Sport (EN / ES) | Choice label | Choice (EN / ES) | Profile | Variant / note |
|---|---|---|---|---|
| **Tennis** / Tenis (`tennis`) | Format / Modalidad | (none / default) | `tennis` |  |
| | | Singles / Individual | `tennis` | - |
| | | Doubles / Dobles | `tennis` | - |
| **Pickleball (tournament)** / Pickleball (torneos) (`pickleball`) | Format / Modalidad | (none / default) | `pickleball_competitive` |  |
| | | Doubles / mixed doubles / Dobles / dobles mixtos | `pickleball_competitive` | - |
| | | Singles / Individual | `pickleball_competitive` | - |
| **Padel (tournament)** / Pádel (torneos) (`padel`) | - / - | (none / default) | `tennis` | variant `padel_competitive`; competitive padel = tennis profile + padel_competitive variant (INFERRED; no researched competitive padel profile - few US tournament players) |
| **Golf** / Golf (`golf`) | - / - | (none / default) | `golf` |  |
| **Badminton / squash / racquetball / table tennis** / Bádminton / squash / ráquetbol / tenis de mesa (`racket_other`) | Sport / Deporte | (none / default) | `tennis` | ROUTED: no researched profile: nearest = tennis - INFERRED |
| | | Badminton / Bádminton | `tennis` | - |
| | | Squash / Squash | `tennis` | - |
| | | Racquetball / Ráquetbol | `tennis` | - |
| | | Table tennis / Tenis de mesa | `tennis` | - |
| **Bowling** / Boliche (bowling) (`bowling`) | - / - | (none / default) | `golf` | ROUTED: no researched profile: nearest = golf (rotational, one-sided, low jump demand) - INFERRED |

## 3. Recreational activities, age overlays and goal defaults

Recreational = activity only, no position, no season (COACH-ANSWER GEN-02). Up to two activities; the first leads, the second adds its demands. Approved in round 3 (COACH-R3 ATH-05): the user can enter play days - the hardest gym day stays at least 48 h before the biggest play day and weeks with 3+ play sessions drop the extra agility drills and half the jumps; a 45-60+ minute session of the activity counts as one of the 3 cardio sessions (up to 2); optional event date for every activity (a first HYROX race, a pickleball tournament, a 10K) - the hardest weeks end 1 week before, then 1 easy week at about half the sets. Recreational players use their activity's plyo share (COACH-R3 ATH-04).

| Activity (EN / ES) | id | Profile | Competitive counterpart | Event date | Note |
|---|---|---|---|---|---|
| Pickleball / Pickleball | `rec_pickleball` | `rec_pickleball` | pickleball_competitive | yes | coach request 2026-10-08 ('include pickleball because that's a very popular sport right now'); many players 50+; 60+ defaults apply (COACH-R2 ATH-08) |
| HYROX / HYROX | `hyrox_fitness` | `hyrox_fitness` | hyrox_competitive | yes | coach said 'high rows' = HYROX (INFERRED reading of the transcript); race = 8 x 1 km run + 8 workout stations |
| Tennis / Tenis | `rec_tennis` | `rec_tennis` | tennis | yes |  |
| Padel / Pádel | `rec_padel` | `rec_padel` | tennis (variant padel_competitive) | yes |  |
| Golf / Golf | `rec_golf` | `rec_golf` | golf | yes |  |
| Rec league (pick the sport) / Liga recreativa (elige el deporte) | `rec_league` | `rec_league` | - | yes | league sport router: Basketball / Baloncesto -> `rec_basketball`; Soccer / Fútbol -> `rec_soccer`; Softball (slow-pitch) / Sóftbol (lanzamiento lento) -> `rec_softball`; Flag football / Flag football -> `rec_flag_football`; Volleyball (indoor / sand / grass) / Voleibol (sala / arena / pasto) -> `rec_volleyball`; Ice hockey / Hockey sobre hielo -> `rec_hockey`; Ultimate / Ultimate (frisbee) -> `rec_ultimate`; Kickball / Kickball -> `rec_kickball`; Other team sport / Otro deporte de equipo -> `rec_league` |
| Running for fitness (first 5K / 10K, run club) / Correr por salud (primer 5K / 10K, club de corredores) | `run_fitness` | `run_fitness` | distance_runner | yes |  |
| Hiking and rucking / Senderismo y caminata con mochila (rucking) | `hike_ruck` | `hike_ruck` | - | yes |  |
| Cycling / indoor cycling / Ciclismo / ciclismo indoor | `cycling_fitness` | `cycling_fitness` | cycling_endurance | yes |  |
| Lap swimming (incl. masters-style workouts) / Natación por salud (incluye entrenamientos tipo máster) | `lap_swim` | `lap_swim` | swimming_middle | yes |  |
| Ski / snowboard season prep / Preparación para esquí o snowboard | `ski_snow_prep` | `ski_snow_prep` | ski_alpine | yes |  |
| Surf and paddleboard / Surf y paddle | `surf_paddle` | `surf_paddle` | - | yes |  |
| Dance and fitness classes / Baile y clases de fitness | `dance_fitness` | `dance_fitness` | - | yes |  |
| Triathlon for fitness (first race / age group) / Triatlón por salud (primera carrera / grupos de edad) | `rec_triathlon` | `rec_triathlon` | triathlon | yes |  [added v1.1] |
| Rowing / indoor rowing / Remo / remo indoor | `rec_rowing` | `rec_rowing` | rowing | yes |  [added v1.1] |
| CrossFit-style classes / Clases estilo CrossFit | `crossfit_class` | `crossfit_class` | crossfit_competitor | no |  [added v1.1] |
| Boxing, kickboxing or martial-arts classes / Clases de boxeo, kickboxing o artes marciales | `rec_combat_fitness` | `rec_combat_fitness` | boxing / kickboxing_muay_thai / bjj_grappling (by style) | yes | added in the v1.1 sport verification (popular gen-pop activity missing from the stay-athletic set); style router: striking -> rec_combat_fitness, grappling -> variant combat_fitness_grappling [added v1.1 sport verification] |
| Climbing / bouldering gym / Escalada / búlder (bouldering) en gimnasio | `rec_climbing` | `rec_climbing` | climbing | yes | added in the v1.1 sport verification [added v1.1 sport verification] |
| Obstacle course race (first Spartan / Tough Mudder) / Carrera de obstáculos (primer Spartan / Tough Mudder) | `rec_ocr` | `rec_ocr` | ocr_spartan | yes | added in the v1.1 sport verification; sits next to HYROX in the 'stay athletic and active' set [added v1.1 sport verification] |
| Badminton, squash, racquetball or table tennis / Bádminton, squash, ráquetbol o tenis de mesa | `rec_racket_other` | `rec_tennis` | - | yes | ROUTED: nearest = recreational tennis (lateral first steps, rotation, racket elbow / shoulder care) - INFERRED [added v1.1 sport verification] |
| Disc golf / Disc golf (golf de disco) | `rec_disc_golf` | `rec_golf` | - | yes | ROUTED: nearest = recreational golf (rotational throw, walking rounds = Orange) - INFERRED [added v1.1 sport verification] |
| Bowling / Boliche (bowling) | `rec_bowling` | `rec_golf` | - | yes | ROUTED: nearest = recreational golf (one-sided rotational pattern, low jump demand) - INFERRED [added v1.1 sport verification] |
| Trail running / Carrera de montaña (trail running) | `rec_trail_running` | `run_fitness` | - | yes | ROUTED: running for fitness + KNEE_DESCENT_ECCENTRIC rules (downhills) and ankle work for uneven ground - INFERRED [added v1.1 sport verification] |
| Mountain biking / Ciclismo de montaña (MTB) | `rec_mountain_biking` | `cycling_fitness` | - | yes | ROUTED: cycling for fitness + FALL_UPPER_LIMB rules (falls) - INFERRED [added v1.1 sport verification] |
| Kayak, canoe, wakeboard or water-ski / Kayak, canoa, wakeboard o esquí acuático | `rec_paddle_water` | `surf_paddle` | - | yes | ROUTED: nearest = surfing / paddleboarding (paddling shoulders, balance, trunk) - INFERRED [added v1.1 sport verification] |
| A bit of everything / Un poco de todo | `weekend_warrior` | `weekend_warrior` | - | yes | his former 'Justice League' program: non-competitive all-round athletic adults and youth (COACH-ANSWER ATH-13) |

| Age overlay | When | Scope | Rule |
|---|---|---|---|
| `active_aging_60plus` | age (F02) >= 60 | every non-competitive plan; as lead profile when the activity is weekend_warrior / none | landing drills, balance, quick stepping (no hop), light medball throws and fast machine work ON; low ankle hops, other jumps, Olympic lifts and depth jumps OFF, switchable with the warning; overhead and low-bar squats out (COACH-R3 ATH-02; COACH-R2 ATH-08) |
| `active_aging_50plus` | age (F02) 50-59 | recreational / active path; lead profile when the activity is weekend_warrior / none | stay-athletic plan with joint-care selection (PROPOSED); pickleball / padel / tennis players 50+ get the approved racket rules (COACH-R3 ATH-02) |
| `youth_general_athletic` | age (F02) < 18 and not competitive | recreational / none | 04 youth rules; floor Olympic lifts from about 14 after one hang block (COACH-R2 ATH-08) |
| `youth_athlete` | age (F02) < 18 and competitive | overlay on the sport profile (multi-sport youth: lead profile) | youth rules (growth spurt caps, foundational lists); floor Olympic lifts from about 14 after a hang block (COACH-R2 ATH-08) |

Goal defaults: muscle -> `bodybuilding_aesthetics`, strength -> `powerlifting_strength`, fat_loss -> `fat_loss`, general -> `general_population`, hybrid -> `hybrid`, athletic -> `weekend_warrior`, active -> `weekend_warrior`.

### 3.1 What a "stay athletic and active" plan contains (genpop-active.json)

> **Changed in v1.3** (COACH-R4 R4-SES-02, R4-SES-03, R4-SES-05, R4-LIB-01). The day is the short athletic block, then his A / B lifts, 5-10 exercises; on 2 gym days every big group is trained at about 6-8 weekly sets and the plan suggests a third day; the proposed joint-care and sport drills are optional add-ons, not picks. Where the text below differs, the v1.3 section at the top of this file wins.

The coach's own non-competitive athletic program (BYOP 'ATHLETIC - FULL BODY - 4 DAYS A', the former 'Justice League' tab, renamed 'Athletic Performance - Non-Competitive') is the template: every main day opens with light core, then a short athletic block (jumps, a throw, a change-of-direction drill, an Olympic lift), then full-body resistance in hip + push / knee + pull pairs, calves and rear delts; optional days carry Focus work and aerobic sessions. Recreational = no position, no season dates, no pre- / in-season blocks (GEN-02); the activity only changes WHICH athletic qualities lead and how much.

| Part | Dose | Evidence |
|---|---|---|
| warm-up | 5 min any cardio + A-drills / mobility; never counted as volume | COACH-ANSWER ORD-08 |
| core (opens the session) | 2 exercises x 2 sets, light, short of failure; movable; core supersets / monster sets may be added anywhere | COACH-ANSWER ATH-11, VOL-17; COACH-R2 SES-03 |
| some power - jumps | 1-2 jump stations x 2 sets; plyometric vs ballistic by the activity's ground-contact class (75 / 60 / 50 / 40 / 25 %), each block 15 points more ballistic at the start; Receive-Create stages 1 Land -> 2 Land & Go -> 3 Repeat | COACH-ANSWER ATH-01, CAT-10; COACH-R2 ATH-01/02/03 |
| some power - throws | 0-1 medball station x 2 sets (more for rotational activities: racket sports, golf); ball <= 20 lb, lighter for youth and older | COACH-ANSWER ATH-05, EQ-06, EQ-07, LIB-22 |
| some agility | 0-1 change-of-direction station x 2 sets, EASY -> MOD. TURN (HARD TURN and reactive agility for L2+); none needed for linear / grounded activities, but one light footwork station a week keeps 'some agility' (PROPOSED) | COACH-ANSWER ATH-06; stay-athletic minimum PROPOSED |
| Olympic / triple extension | 1 station x 2 sets on most main days (up to 4 a week): clean variants on squat days, snatch variants on hinge days; L1 = hang clean, KB squat clean, single-arm DB snatch, hex-bar jump, hang pulls; explained as power output, loaded by RIR / RPE | COACH-ANSWER ATH-10; COACH-R2 ATH-04/05, GEN-06, LIB-07 |
| resistance | 2-4 exercises per muscle group trained that day (never 1); hip-dominant + push, knee-dominant + pull; cross-pattern pairing; heavy squat and heavy deadlift on different days; volume by the engine: general factor x0.8, floor 10 sets a week per trained group (hips, shoulders ... - COACH-R3 VOL-01, SES-01), stairway steps | COACH-ANSWER UNI-06, UNI-11; COACH-R2 SES-01/02/05, VOL-04/06, PER-03/04; COACH-R3 VOL-01, SES-01; 12 v1.2 §3.4 |
| calves and rear delts | calves: one exercise x 3 sets every leg day (COACH-R3 SES-01); rear delts / KB face pulls inside the shoulders group (front + side + rear delts; the floor of 10 counts on the group; users / coaches can add more rear-delt work - COACH-R3 VOL-01) | COACH-ANSWER VOL-17; COACH-R2 LIB-04; COACH-R3 VOL-01, SES-01 |
| aerobic (separate days or add-ons) | 3 sessions a week - one Blue (A), one Green (B), one Orange (C); the user can add or remove sessions; a 45-60+ min session of the activity counts as one of the 3 (up to 2) (COACH-R3 ATH-05) | COACH-ANSWER ATH-07, EQ-14; COACH-R2 SES-06; COACH-R3 ATH-05 |
| play days | the user can enter the days they play: the hardest gym day stays at least 48 h before the biggest play day; weeks with 3+ play sessions drop the extra agility drills and half the jumps; a 45-60+ minute session of the activity counts as one of the 3 cardio sessions (up to 2) (COACH-R3 ATH-05, approved) | COACH-R3 ATH-05 |
| event date | optional (a first HYROX race, a pickleball tournament, a 10K): the hardest weeks end 1 week before, then 1 easy week at about half the sets; after the event the plan ends and the user builds the next one (COACH-R3 ATH-05, PER-01) | COACH-R3 ATH-05, PER-01 |
| editing | the user or coach can switch off a day's athletic block or core block (e.g. a pickleball player with sore calves), add or remove exercises or whole blocks, and the plan recommends supersets to save time (COACH-R3 SES-02) | COACH-R3 SES-02 |
| older (60+) | COACH-R3 ATH-02 (approved): from 60 the defaults ON are landing drills (step down and stick, no bounce), balance, quick stepping without a hop, light medball throws and fast machine work; low ankle hops, other jumps, Olympic lifts and depth jumps are OFF and can be switched on with the warning 'Make sure that you have a fitness professional to help you understand what this means'; overhead squats and low-bar squats stay out (snatch variants stay out too - COACH-ANSWER EQ-03, not revisited); W_OLDER_POWER: 'Make sure that you have a fitness professional to help you understand what this means.' | COACH-R3 ATH-02; COACH-R2 ATH-08 |
| racket players 50+ | COACH-R3 ATH-02 (approved): pickleball, padel and tennis players 50+ get knee-friendly strength, calf and Achilles work every leg day, rotator-cuff work, and only low-impact jumps (no depth jumps, hurdle hops or bounds) unless switched on | COACH-R3 ATH-02 |
| HYROX | COACH-R3 ATH-03 (approved HYROX plan): 2 strength days (squat + pull, deadlift + push) + 2 hybrid days (run intervals, or 1 km run + 1 station repeated); 4 cardio sessions (Blue, Green, Orange + a second Orange) because running is about half the race; 2 short station circuits a week (sled push / pull, burpee broad jumps, wall balls, farmers carry, sandbag lunges, SkiErg / row) as finishers that do not count as muscle sets; wall balls with the race ball (never over 20 lb); 40-rep / AMRAP sets only inside these circuits; jumps 50 % plyometric, like basketball | COACH-R3 ATH-03 |

- **2 days**: 2 main days + the activity: ~4 athletic stations a day (8-10 sets), resistance on the 05 2-day template; aerobic = the activity + 0-1 gym sessions
- **3 days**: the default for most activities: 4-5 athletic stations a day (10-14 sets per day at most, often less), resistance on the 05 3-day template (S1 squat / S2 non-axial hinge / S3 deadlift)
- **4 days**: the coach's own template (weekend warrior): 2 jumps + 1 throw + 1 COD + 1 Olympic a day (about 10 athletic sets a day), 2 optional days
- **evidence**: OBSERVED BYOP athletic slots (OT04) + 05 v1.1 templates; scaling PROPOSED

## 4. Round-3 and round-2 rules as applied to the profiles

### Round-3 rules (v1.2)

| Rule | What he approved | Where it lives |
|---|---|---|
| R3-PER-01 (RIGHT + note) | easy week after a block = an extra week and only a recommendation; holidays between blocks (a mark inside a started block ends it unless removed); the 'stop this block' offer from check-ins is retired with the check-ins; when a block ends the user builds the next one | season_overrides, plan_length_shapes, event_prep.after |
| R3-ATH-01 (RIGHT) | swimming dryland: 3 + 1 optional (2 for younger / lower-level), 0 extra cardio, 25 % plyo, Olympic 2-3 days, shoulder care every session without bands, 2-week dryland taper with the swim taper (1 week or none before smaller meets) | swimming_* |
| R3-ATH-02 (RIGHT) | 60+: landing drills, balance, quick stepping, light medball throws, fast machine work ON; ankle hops, jumps, Olympic lifts, depth jumps OFF (switch on with the warning); OH and low-bar squats out. Racket 50+: knee-friendly strength, calf / Achilles every leg day, rotator cuff, low-impact jumps only unless switched on | active_aging_60plus, older_60_plus, age_50_plus |
| R3-ATH-03 (RIGHT) | HYROX: 2 strength + 2 hybrid days; 4 cardio; 2 short station circuits as finishers (not muscle sets); wall ball <= 20 lb; 40-rep / AMRAP only in the circuits; 50 % plyo | hyrox_fitness, hyrox_competitive |
| R3-ATH-04 (RIGHT) | plyo shares of the remaining sports; off-season cardio 2-4, 0 extra for swimmers, runners, rowers, endurance cyclists; game-heavy rule for lacrosse, field hockey, rugby, ultimate, flag football, beach volleyball; recreational players use their activity's share, 'a bit of everything' 50 % | ground_contact, aerobic_sessions_wk, in_season_gym |
| R3-ATH-05 (RIGHT) | play days (hardest gym day >= 48 h before the biggest play day; 3+ play sessions -> drop the extra agility drills and half the jumps); 45-60+ min activity = one of 3 cardio sessions (up to 2); optional event date (hardest weeks end 1 week before, then 1 easy week at about half the sets) | play_adjustment, event_prep, aerobic_sessions_wk |
| R3-VOL-01 (PARTLY) | rear delts are part of the shoulders group; the floor of 10 counts on the group; users / coaches can add rear-delt work | derived.v1_2_group_audit, muscle_volume_targets.rear_delts |
| R3-VOL-02 / R3-VOL-04 (RIGHT + note) | no check-ins: the plan is output once with its built-in stairway; people and coaches adjust it themselves; few inputs, the whole plan visible ahead | every former check-in text |
| R3-SES-01 / R3-SES-02 (RIGHT + notes) | focus groups (hips, shoulders), calves 1 x 3 per leg day, focus muscles 1 / 2 (+1-3 sets each); ~~time short -> fewer groups trained directly, stairway still climbs~~ (**retired in v1.3**: no time-fitting, COACH-CT CT-01; on 2 days every big group is trained at about 6-8 weekly sets and nothing is dropped automatically, COACH-R4 R4-SES-03, R4-SES-04); supersets recommended; users can switch off athletic / core blocks and add / remove exercises or blocks | derived.v1_2_group_audit, stay_athletic_standard.editing_r3 (engine rules owned by 05 / 12 v1.2) |
| R3-GEN-01 (RIGHT + notes) | nothing stored: no logs, no learning from user data, reminders only printed in the plan; health check and release each time a plan is built (DISCLAIMER.md / DISCLAIMER.es.md) | tests.timing, muscle_volume_targets.learning |

### Round-2 rules (v1.1; rows changed by round 3 are marked v1.2)

| Rule | What it says | Where it lives |
|---|---|---|
| R2-PER-03/04/05 | every plan is a STAIRWAY: gradual weekly steps, smaller in the first weeks, slightly bigger after the halfway point but not too much, the hardest weeks last (12-week: the last 4 weeks 'brutal'); 'start at a 2 and end at an 11' = perceived effort / overall load level ending a little past usual limits, not set counts | plan_length_shapes, season_families, every profile (stairway note in aquatic-endurance-track records; engine shape in 06 / 12 v1.1) |
| R2-VOL-07 / R2-PER-06 | no deload or maintenance week inside a block: a block that cannot be completed is stopped -> maintenance phase (length chosen) -> a whole new block. **v1.2:** the end-of-maintenance prompt is retired - when a block or a maintenance phase ends the plan ends and the user builds the next plan in the app; the easy week after a block is a recommendation (COACH-R3 PER-01). Pre-season = a 4-6-week block at about 60 % of off-season sets with more speed and power + a 1-2-week taper | season_overrides.pre_season of every competitive profile, season_families, in_season_content, assembly_rules |
| R2-VOL-03 / R2-GEN-04 / R2-VOL-01 / R2-VOL-02 | **RETIRED in v1.2:** no check-ins at all (COACH-R3 VOL-02, VOL-04) - the plan is printed once with its planned stairway and people adjust it themselves; no sleep / stress / job inputs (R2-GEN-04 still holds) | no profile uses lifestyle inputs (consistency check C12); v1_1_resolution_flags |
| R2-VOL-04 / R2-VOL-06 | floor 10 weekly sets per muscle ('I don't think anybody needs less than 10'); small muscles grow by the same idea; caps approved but customizable; most people train 20-30 sets per muscle per week; above 30 only for very advanced (optional 'pro' level). **v1.2:** rear delts are part of the shoulders group and the floor counts on groups (COACH-R3 VOL-01, SES-01; derived.v1_2_group_audit) | muscle_volume_targets, derived.v1_1_audit.muscles_below_floor_10 on every profile, open questions |
| R2-VOL-05 | KB swings are ballistic / athletic and never count as glute volume; compounds (squats, lunges, deadlifts, RDLs) credit glutes 0.25; hip thrusts / bridges 1.0; thruster = 1.0 quads / 0.5 shoulders / 0.25 glutes | muscle_credit_rules, muscle_credit_map (BHD / UHD glutes 1.0 -> 0.25), derived.v1_1_audit |
| R2-VOL-08 | **v1.2: approved as COACH-R3 VOL-03** - alternate the first exercise between the two weekly exposures; a small-muscle bonus exercise goes on the optional day or on a day that already trains it, never as its only exercise | v1_1_resolution_flags (volume engine owns it) |
| R2-SES-01 / R2-SES-02 | heavy squat and heavy deadlift on two different days; non-axial hinge / leg press / belt squat on the other days; axial = barbell back / front / zercher / overhead / Smith squats, barbell or trap-bar deadlifts and RDLs, good mornings; powerlifters may add a light technique squat or deadlift | session_rules, injury_library LOW_BACK_LOADING, every injury_prehab copy of it (text replaced), powerlifting_strength.resistance.axial_rule |
| R2-SES-03 / R2-SES-04 | core opens the session light (2 x 2 short of failure); core supersets / monster sets may be added anywhere; field-athlete cap 12 exercises + the 2-exercise core block | core.dose on every profile, session_load_check |
| R2-SES-05 | full-body days use 2-4 exercises PER MUSCLE trained that day (never 1), even if the day gets longer | session_load_check, weekend_warrior / genpop budgets (05 v1.1 template basis) |
| R2-SES-06 | aerobic sessions per week adjustable up or down by the user; aesthetics 4 incl. a second easy Orange + optional walks | aerobic_sessions_wk.user_adjustable on every profile; bodybuilding_aesthetics |
| R2-ATH-01 / R2-ATH-02 | plyo : ballistic share by ground-contact class approved (sprinters 75; volleyball, soccer, football skill 60; basketball, tennis, football big-skill, weekend warriors 50; baseball, softball, hockey, linemen, MMA 40; boxing, karate, kickboxing, wrestling, BJJ, golf 25; **v1.2: the remaining sports approved in COACH-R3 ATH-04**); each block starts 15 points more ballistic; ballistic list (squat / box / broad / loaded / hex-bar jumps, medball throws) vs plyometric list (pogo / ankle hops, hurdle hops, depth jumps, bounds, squirrel jumps, repeated jumps); stick-the-landing = the receive stage | ground_contact + power_mix + power_mix_by_phase on every profile (consistency check C1) |
| R2-ATH-03 | 'Receive-Create stages' (1 Land, 2 Land & Go, 3 Repeat); 12-week plan wk 1-3 / 4-7 / 8-12; 8-week 1-2 / 3-5 / 6-8; restart at stage 1 each off-season; stay put in maintenance; L2-L3 may start at stage 2 | ground_contact_model.plyo_method_stages, power_mix_by_phase |
| R2-ATH-04 / R2-ATH-05 | Olympic lifts up to 4x / week (clean days = more squat-pattern, snatch days = more hinge-pattern); in season a light piece; full squat cleans / snatches 3-5 reps with the coach's eye on speed | olympic_by_level, olympic_policy on every athletic profile |
| R2-ATH-06 | aerobic sessions: off-season baseball, softball, sprinters 2; basketball, volleyball, football, tennis, golf, boxing, BJJ 3; soccer, hockey, kickboxing, karate 3-4; MMA, wrestling 4; pre-season 2; powerlifters 2 easy Orange | aerobic_rule, aerobic_sessions_wk (consistency check C3-C5) |
| R2-ATH-07 | in season, game-heavy sports (basketball, volleyball, soccer, football, hockey; **v1.2: + lacrosse, field hockey, rugby, ultimate, flag football, beach volleyball - COACH-R3 ATH-04**): gym plyos about half, no extra change-of-direction work, sprints only for speed athletes, the one hard gym day at least 48 h before a game | in_season_gym + season_overrides.in_season (consistency check C6) |
| R2-ATH-08 | 60+: no Olympic lifts, plyos or depth jumps by default; allowed as an option with the warning 'Make sure that you have a fitness professional to help you understand what this means.'; youth floor Olympic lifts from about 14 after a hang block. **v1.2: defaults approved in COACH-R3 ATH-02** (landing drills, balance, quick stepping, light throws, fast machine work on; depth jumps switchable) | age_experience_rules, olympic_policy.older_60_plus / youth, active_aging_60plus, pickleball_senior_60_plus |
| R2-PER-01 / R2-PER-02 | the year plan is gen-pop "stay in shape" planning, fully user-tunable (re-order blocks, more / less cardio, e.g. a winter powerlifting-style block); athletes follow their season | season_families.general |
| R2-PER-07 | test before the block (or week 1) and at the end, never mid-block; people starting from zero never test a 1RM or a max mile - 5RM / 3RM or 80-90 % efforts; **v1.2:** the test days are printed in the plan, no stored reminders (COACH-R3 GEN-01) | tests on every profile |
| R2-GEN-05 | competitive athletes give the season start date (or in season until / competition date) + practice and game days; recreational = activity only, no position or season | sports[].season_inputs, activities[], generator_spec F11 / F11r |
| R2-GEN-06 / R2-GEN-08 | weight guidance by RIR / RPE; Olympic lifts explained as power output, % only for competitive Olympic lifters (own programming); neutral Latin American Spanish with English gym terms in brackets | olympic_policy.load_guidance, name_es / sports[].es (drafts, coach approves) |
| R2-LIB-06 | the '21.6 mile run' is removed from plans and tests; the longest run stays the half-marathon plan | distance_runner |

### 4.1 Plyometric : ballistic share by ground-contact class (COACH-R2 ATH-01)

Each block starts 15 points more ballistic (start = end - 15, COACH-R2 ATH-01; the v1.1 20 % floor is retired in the v1.2 check) and ends at the class share. Ballistic = squat / box / broad / loaded or hex-bar jumps and medball throws; plyometric = pogo / ankle hops, hurdle hops, depth jumps, bounds, squirrel jumps, repeated jumps; stick-the-landing = the receive stage (COACH-R2 ATH-02). Receive-Create stages RC1 Land -> RC2 Land & Go -> RC3 Repeat; 12-week plan weeks 1-3 / 4-7 / 8-12, 8-week 1-2 / 3-5 / 6-8 (COACH-R2 ATH-03).

| Class | Contact | Share end / start | Profiles (coach-named in bold) |
|---|---|---|---|
| 1 | very short (about 0.10-0.16 s per contact (sprinting: ~0.14-0.16 s in acceleration, shorter ) | 75 % / 60 % | cross_country, distance_runner, rec_triathlon, run_fitness, track_400, track_hurdles, track_jumper, track_middle, **track_sprinter**, triathlon |
| 2 | short (about 0.15-0.25 s (fast stretch-shortening [S32]: approach / block jumps, first ) | 60 % / 45 % | cheer_flyer_tumbler, field_hockey_field, flag_football, football_rb, **football_skill**, gymnastics_artistic, lacrosse_m_attack, lacrosse_m_defense, lacrosse_m_midfield, lacrosse_w_attack, lacrosse_w_defense, lacrosse_w_midfield, rec_flag_football, rec_soccer, rec_ultimate, rugby_sevens, **soccer**, soccer_defender, soccer_forward, track_high_jump, track_pole_vault, ultimate_cutter, **volleyball**, volleyball_libero, volleyball_middle, volleyball_setter |
| 3 | mixed (short jumps and cuts mixed with planted, longer pushes (over 0.25 s = slow SSC [) | 50 % / 35 % | active_aging_50plus, **basketball**, basketball_big, basketball_guard, dance_fitness, field_hockey_gk, **football_big_skill**, hyrox_competitive, hyrox_fitness, lacrosse_m_goalie, lacrosse_w_goalie, ocr_spartan, pickleball_competitive, rec_basketball, rec_league, rec_ocr, rec_padel, rec_pickleball, rec_tennis, rec_volleyball, rugby_backs, ski_freestyle, soccer_gk, **tennis**, track_javelin, ultimate_handler, volleyball_beach, **weekend_warrior**, youth_athlete, youth_general_athletic |
| 4 | long (planted rotational or pushing actions, well over 0.25 s on the ground (stride-pl) | 40 % / 25 % | baseball_catcher, baseball_infield, baseball_outfield, baseball_pitcher, **baseball_position**, cheer_base_spot, cycling_endurance, cycling_fitness, cycling_sprint, diving, football_dl, football_k_p, **football_lineman**, football_ol, football_qb, **hockey**, hockey_defense, hockey_goalie, **mma**, rec_hockey, rec_kickball, rec_softball, rugby_forwards, ski_alpine, ski_snow_prep, **softball**, softball_pitcher, track_thrower |
| 5 | very long / grounded (feet stay on the ground for most of the action or contact is sustained (striking) | 25 % / 10 % | **bjj_grappling**, **boxing**, climbing, **golf**, hike_ruck, judo, **karate_taekwondo**, **kickboxing_muay_thai**, lap_swim, rec_climbing, rec_combat_fitness, rec_golf, rec_rowing, rowing, strongman, surf_paddle, swimming_distance, swimming_middle, swimming_sprint, taekwondo, water_polo_center, water_polo_field, water_polo_goalkeeper, weightlifting, **wrestling** |
| none | no athletic power block | - | active_aging_60plus, bodybuilding_aesthetics, crossfit_class, crossfit_competitor, fat_loss, general_population, hybrid, powerlifting_strength |

Bold = named in round 2 (COACH-R2 ATH-01). **v1.2:** the remaining sports were approved in round 3 (COACH-R3 ATH-04: 75 % runners; 60 % lacrosse, field hockey, flag football, ultimate cutters, rugby sevens, high jump, pole vault, gymnastics, cheer flyers; 50 % beach volleyball, pickleball, padel, rugby backs, goalkeepers, javelin, HYROX; 40 % rugby forwards, cheer bases, throwers, diving, alpine skiing, cycling; 25 % swimming, water polo, rowing, judo, taekwondo, climbing); `lacrosse_m_defense` moved from class 3 to class 2. Sports on neither list stay INFERRED / PROPOSED (flag G8). Recreational profiles use their activity's class (flag F5, approved in COACH-R3 ATH-04). v1.1 sport verification: swimming (sprint / middle / distance) and lap swimming moved from class 4 to class 5 (flag F10); the three new recreational profiles sit in class 5 (combat classes, climbing) and class 3 (obstacle race).

### 4.2 Aerobic sessions per week (COACH-R2 ATH-06, COACH-ANSWER ATH-07, COACH-R2 SES-06)

| Profile | Off-season (range) | Pre | In | Source | Evidence / exception |
|---|---|---|---|---|---|
| `baseball_position` | 2 (2) | 2 | 2 | gym_plan | COACH-R2 ATH-06: baseball 2 |
| `boxing` | 3 (3) | 2 | 2 | gym_plan | COACH-R2 ATH-06: boxing 3 |
| `crossfit_competitor` | 2 (2-4) | 3 | 2 | gym_plan | OBSERVED aerobic level 3-4 in the months before the Open (CrossFit split) |
| `hybrid` | 2 (2-3) | - | - | gym_plan | OBSERVED A 1 (Tue sprint intervals) + C 1 (Fri '15-40 min' easy, a real aerobic block - ORD-09); adjustable (COACH-R2 SES-06) |
| `powerlifting_strength` | 2 (2) | 2 | 2 | gym_plan | COACH-R2 ATH-06: powerlifting 2 |
| `bodybuilding_aesthetics` | 4 (4-6) | 4 | - | gym_plan | COACH-R2 SES-06: 4 incl. a second easy Orange + optional 20-30 min walks after workouts; adjustable |
| `fat_loss` | 3 (3) | - | - | gym_plan | COACH-ANSWER ATH-07 (3 general / fat loss); adjustable (COACH-R2 SES-06) |
| `basketball` | 3 (3) | 2 | 2 | gym_plan | COACH-R2 ATH-06: basketball 3 |
| `volleyball` | 3 (3) | 2 | 2 | gym_plan | COACH-R2 ATH-06: volleyball 3 |
| `football_skill` | 3 (3) | 2 | 2 | gym_plan | COACH-R2 ATH-06: american_football 3 |
| `football_big_skill` | 3 (3) | 2 | 2 | gym_plan | COACH-R2 ATH-06: american_football 3 |
| `football_lineman` | 3 (3) | 2 | 2 | gym_plan | COACH-R2 ATH-06: american_football 3 |
| `soccer` | 4 (3-4) | 2 | 2 | gym_plan | COACH-R2 ATH-06: soccer 3-4 |
| `softball` | 2 (2) | 2 | 2 | gym_plan | COACH-R2 ATH-06: softball 2 |
| `hockey` | 3 (3-4) | 2 | 2 | gym_plan | COACH-R2 ATH-06: ice_hockey 3-4 |
| `tennis` | 3 (3) | 2 | 2 | gym_plan | COACH-R2 ATH-06: tennis 3 |
| `golf` | 3 (3) | 2 | 2 | gym_plan | COACH-R2 ATH-06: golf 3 |
| `track_sprinter` | 2 (2) | 2 | 2 | gym_plan | COACH-R2 ATH-06: sprinters 2 |
| `distance_runner` | 0 (0-1) | 0 | 0 | sport_plan | COACH-R3 ATH-04 (approved: 0 extra gym cardio for runners - their practice is the cardio; the user can add one) |
| `kickboxing_muay_thai` | 4 (3-4) | 2 | 2 | gym_plan | COACH-R2 ATH-06: kickboxing_muay_thai 3-4 |
| `karate_taekwondo` | 3 (3-4) | 2 | 2 | gym_plan | COACH-R2 ATH-06: karate 3-4 |
| `mma` | 4 (4) | 2 | 2 | gym_plan | COACH-R2 ATH-06: mma 4 |
| `wrestling` | 4 (4) | 2 | 2 | gym_plan | COACH-R2 ATH-06: wrestling 4 |
| `bjj_grappling` | 3 (3) | 2 | 2 | gym_plan | COACH-R2 ATH-06: bjj 3 |
| `general_population` | 3 (3) | - | - | gym_plan | COACH-ANSWER ATH-07 (3 general); adjustable (COACH-R2 SES-06) |
| `youth_athlete` | 2 (2-3) | 2 | 2 | gym_plan | INFERRED (multi-sport youth; practice supplies conditioning); pre 2 / in 2 as athletes |
| `weekend_warrior` | 3 (2-4) | - | - | gym_plan_or_activity | COACH-ANSWER ATH-07 (3 for general clients) + COACH-R2 SES-06 (adjustable); activity counts: COACH-R3 ATH-05 (approved) |
| `football_qb` | 3 (3) | 2 | 2 | gym_plan | COACH-R2 ATH-06: american_football 3 |
| `football_rb` | 3 (3) | 2 | 2 | gym_plan | COACH-R2 ATH-06: american_football 3 |
| `football_ol` | 3 (3) | 2 | 2 | gym_plan | COACH-R2 ATH-06: american_football 3 |
| `football_dl` | 3 (3) | 2 | 2 | gym_plan | COACH-R2 ATH-06: american_football 3 |
| `football_k_p` | 3 (3) | 2 | 2 | gym_plan | COACH-R2 ATH-06: american_football 3 |
| `flag_football` | 3 (3) | 2 | 2 | gym_plan | COACH-R3 ATH-04 (approved: off-season cardio 2-4 like the round-2 list); count 3 was: INFERRED (football 3, COACH-R2 ATH-06) |
| `rec_flag_football` | 3 (2-4) | - | - | gym_plan_or_activity | COACH-ANSWER ATH-07 (3 general) + COACH-R2 SES-06 (user can add / remove); activity counts: COACH-R3 ATH-05 (approved) |
| `basketball_guard` | 3 (3) | 2 | 2 | gym_plan | COACH-R2 ATH-06: basketball 3 |
| `basketball_big` | 3 (3) | 2 | 2 | gym_plan | COACH-R2 ATH-06: basketball 3 |
| `rec_basketball` | 3 (2-4) | - | - | gym_plan_or_activity | COACH-ANSWER ATH-07 (3 general) + COACH-R2 SES-06; activity counts: COACH-R3 ATH-05 (approved) |
| `baseball_pitcher` | 2 (2) | 2 | 2 | gym_plan | COACH-R2 ATH-06: baseball 2 |
| `baseball_catcher` | 2 (2) | 2 | 2 | gym_plan | COACH-R2 ATH-06: baseball 2 |
| `baseball_infield` | 2 (2) | 2 | 2 | gym_plan | COACH-R2 ATH-06: baseball 2 |
| `baseball_outfield` | 2 (2) | 2 | 2 | gym_plan | COACH-R2 ATH-06: baseball 2 |
| `softball_pitcher` | 2 (2) | 2 | 2 | gym_plan | COACH-R2 ATH-06: softball 2 |
| `rec_softball` | 3 (2-4) | - | - | gym_plan_or_activity | COACH-ANSWER ATH-07 (3 general) + COACH-R2 SES-06; activity counts: COACH-R3 ATH-05 (approved) |
| `soccer_gk` | 3 (3-4) | 2 | 2 | gym_plan | COACH-R2 ATH-06: soccer 3-4 |
| `soccer_defender` | 3 (3-4) | 2 | 2 | gym_plan | COACH-R2 ATH-06: soccer 3-4 |
| `soccer_forward` | 3 (3-4) | 2 | 2 | gym_plan | COACH-R2 ATH-06: soccer 3-4 |
| `rec_soccer` | 3 (2-4) | - | - | gym_plan_or_activity | COACH-ANSWER ATH-07 (3 general) + COACH-R2 SES-06; activity counts: COACH-R3 ATH-05 (approved) |
| `hockey_defense` | 4 (3-4) | 2 | 2 | gym_plan | COACH-R2 ATH-06: ice_hockey 3-4 |
| `hockey_goalie` | 3 (3-4) | 2 | 2 | gym_plan | COACH-R2 ATH-06: ice_hockey 3-4 |
| `rec_hockey` | 3 (2-4) | - | - | gym_plan_or_activity | COACH-ANSWER ATH-07 (3 general) + COACH-R2 SES-06; activity counts: COACH-R3 ATH-05 (approved) |
| `volleyball_middle` | 3 (3) | 2 | 2 | gym_plan | COACH-R2 ATH-06: volleyball 3 |
| `volleyball_setter` | 3 (3) | 2 | 2 | gym_plan | COACH-R2 ATH-06: volleyball 3 |
| `volleyball_libero` | 3 (3) | 2 | 2 | gym_plan | COACH-R2 ATH-06: volleyball 3 |
| `volleyball_beach` | 3 (3) | 2 | 2 | gym_plan | COACH-R3 ATH-04 (approved: off-season cardio 2-4 like the round-2 list); count 3 was: COACH-R2 ATH-06 (volleyball 3; sand raises heart-rate load - T21) |
| `rec_volleyball` | 3 (2-4) | - | - | gym_plan_or_activity | COACH-ANSWER ATH-07 (3 general) + COACH-R2 SES-06; activity counts: COACH-R3 ATH-05 (approved) |
| `lacrosse_m_attack` | 3 (3-4) | 2 | 2 | gym_plan | COACH-R3 ATH-04 (approved: off-season cardio 2-4 like the round-2 list); count 3 was: PROPOSED (lacrosse not in R2-ATH-06; set like soccer 3-4) |
| `lacrosse_m_midfield` | 4 (3-4) | 2 | 2 | gym_plan | COACH-R3 ATH-04 (approved: off-season cardio 2-4 like the round-2 list); count 4 was: PROPOSED (midfield = the most running in lacrosse - T2 / T3) |
| `lacrosse_m_defense` | 3 (3-4) | 2 | 2 | gym_plan | COACH-R3 ATH-04 (approved: off-season cardio 2-4 like the round-2 list); count 3 was: PROPOSED (lacrosse 3-4) |
| `lacrosse_m_goalie` | 3 (2-3) | 2 | 2 | gym_plan | COACH-R3 ATH-04 (approved: off-season cardio 2-4 like the round-2 list); count 3 was: PROPOSED |
| `lacrosse_w_attack` | 3 (3-4) | 2 | 2 | gym_plan | COACH-R3 ATH-04 (approved: off-season cardio 2-4 like the round-2 list); count 3 was: PROPOSED (women's game: more total and sprint distance than men's - T3) |
| `lacrosse_w_midfield` | 4 (3-4) | 2 | 2 | gym_plan | COACH-R3 ATH-04 (approved: off-season cardio 2-4 like the round-2 list); count 4 was: PROPOSED (most running of the women's positions - T3) |
| `lacrosse_w_defense` | 4 (3-4) | 2 | 2 | gym_plan | COACH-R3 ATH-04 (approved: off-season cardio 2-4 like the round-2 list); count 4 was: PROPOSED (women's defenders cover the most whole-match distance - search summary of T3-related work) |
| `lacrosse_w_goalie` | 3 (2-3) | 2 | 2 | gym_plan | COACH-R3 ATH-04 (approved: off-season cardio 2-4 like the round-2 list); count 3 was: PROPOSED |
| `field_hockey_field` | 3 (3-4) | 2 | 2 | gym_plan | COACH-R3 ATH-04 (approved: off-season cardio 2-4 like the round-2 list); count 3 was: PROPOSED (like soccer 3-4) |
| `field_hockey_gk` | 3 (2-3) | 2 | 2 | gym_plan | COACH-R3 ATH-04 (approved: off-season cardio 2-4 like the round-2 list); count 3 was: PROPOSED |
| `rugby_forwards` | 3 (3-4) | 2 | 2 | gym_plan | COACH-R3 ATH-04 (approved: off-season cardio 2-4 like the round-2 list); count 3 was: PROPOSED (rugby not in R2-ATH-06; football 3 + continuous play -> 3-4) |
| `rugby_backs` | 3 (3-4) | 2 | 2 | gym_plan | COACH-R3 ATH-04 (approved: off-season cardio 2-4 like the round-2 list); count 3 was: PROPOSED (rugby not in R2-ATH-06) |
| `rugby_sevens` | 4 (3-4) | 2 | 2 | gym_plan | COACH-R3 ATH-04 (approved: off-season cardio 2-4 like the round-2 list); count 4 was: PROPOSED (repeated high-intensity matches, 6 per tournament - T12) |
| `cheer_base_spot` | 2 (2-3) | 2 | 2 | gym_plan | COACH-R3 ATH-04 (approved: off-season cardio 2-4 like the round-2 list); count 2 was: PROPOSED (routine about 2.5 min near-max; cheer not in R2-ATH-06) |
| `cheer_flyer_tumbler` | 2 (2-3) | 2 | 2 | gym_plan | COACH-R3 ATH-04 (approved: off-season cardio 2-4 like the round-2 list); count 2 was: PROPOSED |
| `ultimate_cutter` | 4 (3-4) | 2 | 2 | gym_plan | COACH-R3 ATH-04 (approved: off-season cardio 2-4 like the round-2 list); count 4 was: PROPOSED (game HR mean 82% HRmax - T17; ultimate not in R2-ATH-06) |
| `ultimate_handler` | 3 (3-4) | 2 | 2 | gym_plan | COACH-R3 ATH-04 (approved: off-season cardio 2-4 like the round-2 list); count 3 was: PROPOSED |
| `rec_ultimate` | 3 (2-4) | - | - | gym_plan_or_activity | COACH-ANSWER ATH-07 (3 general) + COACH-R2 SES-06; activity counts: COACH-R3 ATH-05 (approved) |
| `swimming_sprint` | 0 (0-1) | 0 | 0 | sport_plan | COACH-R3 ATH-01 and ATH-04 (approved: 0 extra cardio sessions in the gym by default because the pool is the aerobic work; the user can add one) |
| `swimming_middle` | 0 (0-1) | 0 | 0 | sport_plan | COACH-R3 ATH-01 and ATH-04 (approved: 0 extra cardio sessions in the gym by default because the pool is the aerobic work; the user can add one) |
| `swimming_distance` | 0 (0-1) | 0 | 0 | sport_plan | COACH-R3 ATH-01 and ATH-04 (approved: 0 extra cardio sessions in the gym by default because the pool is the aerobic work; the user can add one) |
| `diving` | 2 (2-3) | 2 | 2 | gym_plan | COACH-R3 ATH-04 (approved: off-season cardio 2-4 like the round-2 list); count 2 was: INFERRED analogy to COACH-R2 ATH-06 (sprinters 2) |
| `water_polo_field` | 0 (0-1) | 0 | 0 | sport_plan | INFERRED by analogy to COACH-R3 ATH-04 (0 extra for swimmers, runners, rowers and endurance cyclists - their practice is the cardio); not named in round 3 |
| `water_polo_center` | 0 (0-1) | 0 | 0 | sport_plan | INFERRED by analogy to COACH-R3 ATH-04 (0 extra for swimmers, runners, rowers and endurance cyclists - their practice is the cardio); not named in round 3 |
| `water_polo_goalkeeper` | 0 (0-1) | 0 | 0 | sport_plan | INFERRED by analogy to COACH-R3 ATH-04 (0 extra for swimmers, runners, rowers and endurance cyclists - their practice is the cardio); not named in round 3 |
| `track_400` | 2 (2-3) | 2 | 2 | gym_plan | COACH-R3 ATH-04 (approved: off-season cardio 2-4 like the round-2 list); count 2 was: COACH-R2 ATH-06 (sprinters 2) + 04 note (B / LC) |
| `track_hurdles` | 2 (2) | 2 | 2 | gym_plan | COACH-R3 ATH-04 (approved: off-season cardio 2-4 like the round-2 list); count 2 was: COACH-R2 ATH-06 |
| `track_jumper` | 2 (2) | 2 | 2 | gym_plan | COACH-R3 ATH-04 (approved: off-season cardio 2-4 like the round-2 list); count 2 was: INFERRED from COACH-R2 ATH-06 sprinters |
| `track_high_jump` | 2 (2) | 2 | 2 | gym_plan | COACH-R3 ATH-04 (approved: off-season cardio 2-4 like the round-2 list); count 2 was: INFERRED |
| `track_pole_vault` | 2 (2) | 2 | 2 | gym_plan | COACH-R3 ATH-04 (approved: off-season cardio 2-4 like the round-2 list); count 2 was: INFERRED |
| `track_thrower` | 2 (2) | 2 | 2 | gym_plan | COACH-R3 ATH-04 (approved: off-season cardio 2-4 like the round-2 list); count 2 was: INFERRED analogy (COACH-R2 ATH-06) |
| `track_javelin` | 2 (2) | 2 | 2 | gym_plan | COACH-R3 ATH-04 (approved: off-season cardio 2-4 like the round-2 list); count 2 was: INFERRED |
| `track_middle` | 0 (0-1) | 0 | 0 | sport_plan | COACH-R3 ATH-04 (approved: 0 extra gym cardio for runners - their practice is the cardio; the user can add one) |
| `cross_country` | 0 (0-1) | 0 | 0 | sport_plan | COACH-R3 ATH-04 (approved: 0 extra gym cardio for runners - their practice is the cardio; the user can add one) |
| `triathlon` | 0 (0-1) | 0 | 0 | sport_plan | INFERRED by analogy to COACH-R3 ATH-04 (0 extra for swimmers, runners, rowers and endurance cyclists - their practice is the cardio); not named in round 3 |
| `cycling_endurance` | 0 (0-1) | 0 | 0 | sport_plan | COACH-R3 ATH-04 (approved: 0 extra gym cardio for endurance cyclists - their practice is the cardio; the user can add one) |
| `cycling_sprint` | 2 (2) | 2 | 2 | gym_plan | COACH-R3 ATH-04 (approved: off-season cardio 2-4 like the round-2 list); count 2 was: INFERRED |
| `rowing` | 0 (0-1) | 0 | 0 | sport_plan | COACH-R3 ATH-04 (approved: 0 extra gym cardio for rowers - their practice is the cardio; the user can add one) |
| `ski_alpine` | 3 (3) | 2 | 2 | gym_plan | COACH-R3 ATH-04 (approved: off-season cardio 2-4 like the round-2 list); count 3 was: INFERRED (skiing not on COACH-R2 ATH-06) |
| `ski_freestyle` | 2 (2-3) | 2 | 2 | gym_plan | COACH-R3 ATH-04 (approved: off-season cardio 2-4 like the round-2 list); count 2 was: INFERRED |
| `rec_triathlon` | 3 (2-5) | - | - | gym_plan_or_activity | COACH-ANSWER ATH-07 (3 general) + COACH-R2 SES-06; activity counts: COACH-R3 ATH-05 (approved) |
| `rec_rowing` | 3 (2-5) | - | - | gym_plan_or_activity | COACH-ANSWER ATH-07 (3 general) + COACH-R2 SES-06; activity counts: COACH-R3 ATH-05 (approved) |
| `judo` | 4 (3-4) | 2 | 2 | gym_plan | COACH-R3 ATH-04 (approved: off-season cardio 2-4 like the round-2 list); count 4 was: PROPOSED (judo not in R2-ATH-06; grappling at 2:1-3:1 effort:pause like wrestling = 4) |
| `taekwondo` | 3 (3-4) | 2 | 2 | gym_plan | COACH-R3 ATH-04 (approved: off-season cardio 2-4 like the round-2 list); count 3 was: PROPOSED (taekwondo not named in R2-ATH-06; = karate 3-4) |
| `weightlifting` | 2 (1-2) | 2 | 2 | gym_plan | COACH-R3 ATH-04 (approved: off-season cardio 2-4 like the round-2 list); count 2 was: PROPOSED (= powerlifters 2 easy Orange, COACH-R2 ATH-06) |
| `strongman` | 2 (2-3) | 2 | 2 | gym_plan | COACH-R3 ATH-04 (approved: off-season cardio 2-4 like the round-2 list); count 2 was: PROPOSED (not in R2-ATH-06; powerlifters 2 approved; strongman adds event medleys) |
| `crossfit_class` | 2 (2-3) | - | - | gym_plan | OBSERVED class split ('AEROBIC CAPACITY' LVL 4 Mon, LVL 3 Thu) + WODs; COACH-ANSWER ATH-07 general rule is 3 - the user can add the 3rd (COACH-R2 SES-06) |
| `hyrox_competitive` | 4 (3-5) | 4 | 3 | gym_plan | COACH-R3 ATH-03 (approved: 4 cardio sessions - Blue, Green, Orange + a second Orange; running is about half the race) |
| `ocr_spartan` | 4 (3-5) | 4 | 3 | gym_plan | race-specific block keeps 4: mostly trail running (combat-strength-fitness.json Q4 - OPEN) |
| `gymnastics_artistic` | 2 (1-2) | 2 | 2 | gym_plan | COACH-R3 ATH-04 (approved: off-season cardio 2-4 like the round-2 list); count 2 was: PROPOSED (gymnastics not in R2-ATH-06; practice supplies conditioning) - 2 like baseball / softball |
| `climbing` | 2 (2-3) | 2 | 2 | gym_plan | COACH-R3 ATH-04 (approved: off-season cardio 2-4 like the round-2 list); count 2 was: PROPOSED (climbing not in R2-ATH-06) |
| `pickleball_competitive` | 3 (3) | 2 | 2 | gym_plan | COACH-R3 ATH-04 (approved: off-season cardio 2-4 like the round-2 list); count 3 was: PROPOSED (= tennis 3, COACH-R2 ATH-06) |
| `rec_pickleball` | 3 (2-4) | - | - | gym_plan_or_activity | COACH-ANSWER ATH-07 (3 for general clients) + COACH-R2 SES-06 (adjustable); activity counts: COACH-R3 ATH-05 (approved) |
| `rec_padel` | 3 (2-4) | - | - | gym_plan_or_activity | COACH-ANSWER ATH-07 (3 for general clients) + COACH-R2 SES-06 (adjustable); activity counts: COACH-R3 ATH-05 (approved) |
| `rec_tennis` | 3 (2-4) | - | - | gym_plan_or_activity | COACH-ANSWER ATH-07 (3 for general clients) + COACH-R2 SES-06 (adjustable); COACH-R2 ATH-06 (tennis 3); activity counts: COACH-R3 ATH-05 (approved) |
| `rec_golf` | 3 (2-4) | - | - | gym_plan_or_activity | COACH-ANSWER ATH-07 (3 for general clients) + COACH-R2 SES-06 (adjustable); COACH-R2 ATH-06 (golf 3); activity counts: COACH-R3 ATH-05 (approved) |
| `hyrox_fitness` | 4 (3-5) | - | - | gym_plan_or_activity | COACH-R3 ATH-03 (approved: 4 cardio sessions for HYROX); adjustable (COACH-R2 SES-06); activity counts: COACH-R3 ATH-05 (approved) |
| `rec_league` | 3 (2-4) | - | - | gym_plan_or_activity | COACH-ANSWER ATH-07 (3 for general clients) + COACH-R2 SES-06 (adjustable); activity counts: COACH-R3 ATH-05 (approved) |
| `rec_kickball` | 3 (2-4) | - | - | gym_plan_or_activity | COACH-ANSWER ATH-07 (3 for general clients) + COACH-R2 SES-06 (adjustable); activity counts: COACH-R3 ATH-05 (approved) |
| `run_fitness` | 3 (2-5) | - | - | gym_plan_or_activity | COACH-ANSWER ATH-07 (3 for general clients) + COACH-R2 SES-06 (adjustable); 04 distance runner (2 runs + 1 easy); activity counts: COACH-R3 ATH-05 (approved) |
| `hike_ruck` | 3 (2-4) | - | - | gym_plan_or_activity | COACH-ANSWER ATH-07 (3 for general clients) + COACH-R2 SES-06 (adjustable); activity counts: COACH-R3 ATH-05 (approved) |
| `cycling_fitness` | 3 (2-5) | - | - | gym_plan_or_activity | COACH-ANSWER ATH-07 (3 for general clients) + COACH-R2 SES-06 (adjustable); activity counts: COACH-R3 ATH-05 (approved) |
| `lap_swim` | 3 (2-4) | - | - | gym_plan_or_activity | COACH-ANSWER ATH-07 (3 for general clients) + COACH-R2 SES-06 (adjustable); activity counts: COACH-R3 ATH-05 (approved) |
| `ski_snow_prep` | 3 (2-4) | - | - | gym_plan_or_activity | COACH-ANSWER ATH-07 (3 for general clients) + COACH-R2 SES-06 (adjustable); activity counts: COACH-R3 ATH-05 (approved) |
| `surf_paddle` | 3 (2-4) | - | - | gym_plan_or_activity | COACH-ANSWER ATH-07 (3 for general clients) + COACH-R2 SES-06 (adjustable); activity counts: COACH-R3 ATH-05 (approved) |
| `dance_fitness` | 3 (2-5) | - | - | gym_plan_or_activity | COACH-ANSWER ATH-07 (3 for general clients) + COACH-R2 SES-06 (adjustable); activity counts: COACH-R3 ATH-05 (approved) |
| `active_aging_50plus` | 3 (2-4) | - | - | gym_plan_or_activity | COACH-ANSWER ATH-07 (3 for general clients) + COACH-R2 SES-06 (adjustable); SCIENCE G29 (150-300 min / week); activity counts: COACH-R3 ATH-05 (approved) |
| `active_aging_60plus` | 3 (2-4) | - | - | gym_plan_or_activity | COACH-ANSWER ATH-07 (3 for general clients) + COACH-R2 SES-06 (adjustable); SCIENCE G29; activity counts: COACH-R3 ATH-05 (approved) |
| `youth_general_athletic` | 3 (2-3) | - | - | gym_plan_or_activity | COACH-ANSWER ATH-07 (3 for general clients) + COACH-R2 SES-06 (adjustable); 04 youth (2); activity counts: COACH-R3 ATH-05 (approved) |
| `rec_combat_fitness` | 3 (2-4) | - | - | gym_plan_or_activity | COACH-ANSWER ATH-07 (3 for general clients) + COACH-R2 SES-06 (adjustable); activity counts: COACH-R3 ATH-05 (approved) |
| `rec_climbing` | 3 (2-4) | - | - | gym_plan_or_activity | COACH-ANSWER ATH-07 (3 for general clients) + COACH-R2 SES-06 (adjustable); activity counts: COACH-R3 ATH-05 (approved) |
| `rec_ocr` | 4 (3-5) | - | - | gym_plan_or_activity | COACH-ANSWER ATH-07 (3 for general clients) + COACH-R2 SES-06 (adjustable); 06 v1.1 HYROX overlay (3-4); activity counts: COACH-R3 ATH-05 (approved) |

Every count is user-adjustable ("I need more cardio" adds sessions, less removes them - COACH-R2 SES-06). Sport-practice sports add 0 gym colour sessions by default because the practice is the aerobic work - approved for swimmers, runners, rowers and endurance cyclists (COACH-R3 ATH-04, ATH-01; the user can add one); water polo, cross country and triathlon follow by analogy (INFERRED). Recreational activities: a 45-60+ minute session counts as one of the 3 sessions, up to 2 (COACH-R3 ATH-05). HYROX: 4 (COACH-R3 ATH-03).

### 4.3 In season (COACH-R2 ATH-07, COACH-ANSWER PER-08)

| Profile | Lift days | Game-heavy | Basis | Plyo x | COD x | Sprint x | Speed athlete | In-season sets % of off-season |
|---|---|---|---|---|---|---|---|---|
| `baseball_position` | 2 | no | not game-heavy: in-season = about 2 lifting days, low volume (COACH-AN | 0.4 | 0.5 | 0.7 | - | 51 |
| `boxing` | 2 | no | not game-heavy: in-season = about 2 lifting days, low volume (COACH-AN | 0.5 | - | 0 | - | 45 |
| `crossfit_competitor` | 4 | no | not game-heavy: in-season = about 2 lifting days, low volume (COACH-AN | - | - | - | - | - |
| `powerlifting_strength` | 3 | no | not game-heavy: in-season = about 2 lifting days, low volume (COACH-AN | 0.4 | - | - | - | 50 |
| `basketball` | 2 | yes | COACH-R2 ATH-07 (named: basketball, volleyball, soccer, football, hock | 0.5 | 0 | 0 | - | 42 |
| `volleyball` | 2 | yes | COACH-R2 ATH-07 (named: basketball, volleyball, soccer, football, hock | 0.5 | 0 | 0 | - | 45 |
| `football_skill` | 2 | yes | COACH-R2 ATH-07 (named: basketball, volleyball, soccer, football, hock | 0.5 | 0 | 1 | yes | 47 |
| `football_big_skill` | 2 | yes | COACH-R2 ATH-07 (named: basketball, volleyball, soccer, football, hock | 0.5 | 0 | 0 | - | 44 |
| `football_lineman` | 2 | yes | COACH-R2 ATH-07 (named: basketball, volleyball, soccer, football, hock | 0.5 | 0 | 0 | - | 46 |
| `soccer` | 2 | yes | COACH-R2 ATH-07 (named: basketball, volleyball, soccer, football, hock | 0.5 | 0 | 0 | - | 41 |
| `softball` | 2 | no | not game-heavy: in-season = about 2 lifting days, low volume (COACH-AN | 0.4 | 0.5 | 0.7 | - | 53 |
| `hockey` | 2 | yes | COACH-R2 ATH-07 (named: basketball, volleyball, soccer, football, hock | 0.5 | 0 | 0 | - | 47 |
| `tennis` | 2 | yes | INFERRED analog of COACH-R2 ATH-07 (sport not named) - round-3 confirm | 0.5 | 0 | 0 | - | 45 |
| `golf` | 2 | no | not game-heavy: in-season = about 2 lifting days, low volume (COACH-AN | 0.5 | - | - | - | 50 |
| `track_sprinter` | 2 | no | not game-heavy: in-season = about 2 lifting days, low volume (COACH-AN | 0.5 | 0.5 | 0.5 | yes | 40 |
| `distance_runner` | 1-2 | no | not game-heavy: in-season = about 2 lifting days, low volume (COACH-AN | 0.5 | 0.5 | 0.5 | - | 40 |
| `kickboxing_muay_thai` | 2 | no | not game-heavy: in-season = about 2 lifting days, low volume (COACH-AN | 0.5 | 0 | 0 | - | 45 |
| `karate_taekwondo` | 2 | no | not game-heavy: in-season = about 2 lifting days, low volume (COACH-AN | 0.5 | 0 | 0 | - | 45 |
| `mma` | 2 | no | not game-heavy: in-season = about 2 lifting days, low volume (COACH-AN | 0.5 | 0 | 0 | - | 45 |
| `wrestling` | 2 | yes | INFERRED analog of COACH-R2 ATH-07 (sport not named) - round-3 confirm | 0.5 | 0 | 0 | - | 45 |
| `bjj_grappling` | 2 | no | not game-heavy: in-season = about 2 lifting days, low volume (COACH-AN | 0.5 | - | - | - | 45 |
| `football_qb` | 2 | yes | COACH-R2 ATH-07 (named: basketball, volleyball, soccer, football, hock | 0.5 | 0 | 0 | - | 43 |
| `football_rb` | 2 | yes | COACH-R2 ATH-07 (named: basketball, volleyball, soccer, football, hock | 0.5 | 0 | 1 | yes | 47 |
| `football_ol` | 2 | yes | COACH-R2 ATH-07 (named: basketball, volleyball, soccer, football, hock | 0.5 | 0 | 0 | - | 46 |
| `football_dl` | 2 | yes | COACH-R2 ATH-07 (named: basketball, volleyball, soccer, football, hock | 0.5 | 0 | 0 | - | 45 |
| `football_k_p` | 2 | yes | COACH-R2 ATH-07 (named: basketball, volleyball, soccer, football, hock | 0.5 | 0 | 0 | - | 46 |
| `flag_football` | 2 | yes | COACH-R3 ATH-04 (approved: the in-season game-heavy rule also for lacr | 0.5 | 0 | 1 | yes | 46 |
| `basketball_guard` | 2 | yes | COACH-R2 ATH-07 (named: basketball, volleyball, soccer, football, hock | 0.5 | 0 | 0 | - | 41 |
| `basketball_big` | 2 | yes | COACH-R2 ATH-07 (named: basketball, volleyball, soccer, football, hock | 0.5 | 0 | 0 | - | 45 |
| `baseball_pitcher` | 2 | no | not game-heavy: in-season = about 2 lifting days, low volume (COACH-AN | 0.4 | 0.5 | 0.7 | - | 50 |
| `baseball_catcher` | 2 | no | not game-heavy: in-season = about 2 lifting days, low volume (COACH-AN | 0.4 | 0.5 | 0.7 | - | 51 |
| `baseball_infield` | 2 | no | not game-heavy: in-season = about 2 lifting days, low volume (COACH-AN | 0.4 | 0.5 | 0.7 | - | 51 |
| `baseball_outfield` | 2 | no | not game-heavy: in-season = about 2 lifting days, low volume (COACH-AN | 0.4 | 0.5 | 0.7 | yes | 51 |
| `softball_pitcher` | 2 | no | not game-heavy: in-season = about 2 lifting days, low volume (COACH-AN | 0.4 | 0.5 | 0.7 | - | 52 |
| `soccer_gk` | 2 | yes | COACH-R2 ATH-07 (named: basketball, volleyball, soccer, football, hock | 0.5 | 0 | 0 | - | 46 |
| `soccer_defender` | 2 | yes | COACH-R2 ATH-07 (named: basketball, volleyball, soccer, football, hock | 0.5 | 0 | 0 | - | 42 |
| `soccer_forward` | 2 | yes | COACH-R2 ATH-07 (named: basketball, volleyball, soccer, football, hock | 0.5 | 0 | 1 | yes | 48 |
| `hockey_defense` | 2 | yes | COACH-R2 ATH-07 (named: basketball, volleyball, soccer, football, hock | 0.5 | 0 | 0 | - | 47 |
| `hockey_goalie` | 2 | yes | COACH-R2 ATH-07 (named: basketball, volleyball, soccer, football, hock | 0.5 | 0 | 0 | - | 47 |
| `volleyball_middle` | 2 | yes | COACH-R2 ATH-07 (named: basketball, volleyball, soccer, football, hock | 0.5 | 0 | 0 | - | 46 |
| `volleyball_setter` | 2 | yes | COACH-R2 ATH-07 (named: basketball, volleyball, soccer, football, hock | 0.5 | 0 | 0 | - | 45 |
| `volleyball_libero` | 2 | yes | COACH-R2 ATH-07 (named: basketball, volleyball, soccer, football, hock | 0.5 | 0 | 0 | - | 42 |
| `volleyball_beach` | 2 | yes | COACH-R3 ATH-04 (approved: the in-season game-heavy rule also for lacr | 0.5 | 0 | 0 | - | 44 |
| `lacrosse_m_attack` | 2 | yes | COACH-R3 ATH-04 (approved: the in-season game-heavy rule also for lacr | 0.5 | 0 | 0 | - | 41 |
| `lacrosse_m_midfield` | 2 | yes | COACH-R3 ATH-04 (approved: the in-season game-heavy rule also for lacr | 0.5 | 0 | 0 | - | 41 |
| `lacrosse_m_defense` | 2 | yes | COACH-R3 ATH-04 (approved: the in-season game-heavy rule also for lacr | 0.5 | 0 | 0 | - | 42 |
| `lacrosse_m_goalie` | 2 | yes | COACH-R3 ATH-04 (approved: the in-season game-heavy rule also for lacr | 0.5 | 0 | 0 | - | 46 |
| `lacrosse_w_attack` | 2 | yes | COACH-R3 ATH-04 (approved: the in-season game-heavy rule also for lacr | 0.5 | 0 | 0 | - | 41 |
| `lacrosse_w_midfield` | 2 | yes | COACH-R3 ATH-04 (approved: the in-season game-heavy rule also for lacr | 0.5 | 0 | 1 | yes | 47 |
| `lacrosse_w_defense` | 2 | yes | COACH-R3 ATH-04 (approved: the in-season game-heavy rule also for lacr | 0.5 | 0 | 0 | - | 41 |
| `lacrosse_w_goalie` | 2 | yes | COACH-R3 ATH-04 (approved: the in-season game-heavy rule also for lacr | 0.5 | 0 | 0 | - | 46 |
| `field_hockey_field` | 2 | yes | COACH-R3 ATH-04 (approved: the in-season game-heavy rule also for lacr | 0.5 | 0 | 0 | - | 42 |
| `field_hockey_gk` | 2 | yes | COACH-R3 ATH-04 (approved: the in-season game-heavy rule also for lacr | 0.5 | 0 | 0 | - | 46 |
| `rugby_forwards` | 2 | yes | COACH-R3 ATH-04 (approved: the in-season game-heavy rule also for lacr | 0.5 | 0 | 0 | - | 45 |
| `rugby_backs` | 2 | yes | COACH-R3 ATH-04 (approved: the in-season game-heavy rule also for lacr | 0.5 | 0 | 1 | yes | 48 |
| `rugby_sevens` | 2 | yes | COACH-R3 ATH-04 (approved: the in-season game-heavy rule also for lacr | 0.5 | 0 | 1 | yes | 48 |
| `cheer_base_spot` | 2 | yes | INFERRED analog of COACH-R2 ATH-07 (sport not named) - round-3 confirm | 0.5 | 0 | 0 | - | 47 |
| `cheer_flyer_tumbler` | 2 | yes | INFERRED analog of COACH-R2 ATH-07 (sport not named) - round-3 confirm | 0.5 | 0 | 0 | - | 48 |
| `ultimate_cutter` | 2 | yes | COACH-R3 ATH-04 (approved: the in-season game-heavy rule also for lacr | 0.5 | 0 | 1 | yes | 48 |
| `ultimate_handler` | 2 | yes | COACH-R3 ATH-04 (approved: the in-season game-heavy rule also for lacr | 0.5 | 0 | 0 | - | 42 |
| `swimming_sprint` | 2 | no | not game-heavy: in-season = about 2 lifting days, low volume (COACH-AN | 0.5 | 0.5 | 0.5 | - | 40 |
| `swimming_middle` | 2 | no | not game-heavy: in-season = about 2 lifting days, low volume (COACH-AN | 0.5 | 0.5 | 0.5 | - | 40 |
| `swimming_distance` | 2 | no | not game-heavy: in-season = about 2 lifting days, low volume (COACH-AN | 0.5 | 0.5 | 0.5 | - | 40 |
| `diving` | 2 | no | not game-heavy: in-season = about 2 lifting days, low volume (COACH-AN | 0.5 | 0.5 | 0.5 | - | 40 |
| `water_polo_field` | 2 | no | not game-heavy: in-season = about 2 lifting days, low volume (COACH-AN | 0.5 | 0.5 | 0.5 | - | 40 |
| `water_polo_center` | 2 | no | not game-heavy: in-season = about 2 lifting days, low volume (COACH-AN | 0.5 | 0.5 | 0.5 | - | 40 |
| `water_polo_goalkeeper` | 2 | no | not game-heavy: in-season = about 2 lifting days, low volume (COACH-AN | 0.5 | 0.5 | 0.5 | - | 40 |
| `track_400` | 2 | no | not game-heavy: in-season = about 2 lifting days, low volume (COACH-AN | 0.5 | 0.5 | 0.5 | yes | 40 |
| `track_hurdles` | 2 | no | not game-heavy: in-season = about 2 lifting days, low volume (COACH-AN | 0.5 | 0.5 | 0.5 | yes | 40 |
| `track_jumper` | 2 | no | not game-heavy: in-season = about 2 lifting days, low volume (COACH-AN | 0.5 | 0.5 | 0.5 | yes | 41 |
| `track_high_jump` | 2 | no | not game-heavy: in-season = about 2 lifting days, low volume (COACH-AN | 0.5 | 0.5 | 0.5 | yes | 40 |
| `track_pole_vault` | 2 | no | not game-heavy: in-season = about 2 lifting days, low volume (COACH-AN | 0.5 | 0.5 | 0.5 | yes | 40 |
| `track_thrower` | 2 | no | not game-heavy: in-season = about 2 lifting days, low volume (COACH-AN | 0.5 | 0.5 | 0.5 | - | 40 |
| `track_javelin` | 2 | no | not game-heavy: in-season = about 2 lifting days, low volume (COACH-AN | 0.5 | 0.5 | 0.5 | - | 40 |
| `track_middle` | 1-2 | no | not game-heavy: in-season = about 2 lifting days, low volume (COACH-AN | 0.5 | 0.5 | 0.5 | yes | 40 |
| `cross_country` | 1-2 | no | not game-heavy: in-season = about 2 lifting days, low volume (COACH-AN | 0.5 | 0.5 | 0.5 | - | 40 |
| `triathlon` | 1-2 | no | not game-heavy: in-season = about 2 lifting days, low volume (COACH-AN | 0.5 | 0.5 | 0.5 | - | 40 |
| `cycling_endurance` | 1-2 | no | not game-heavy: in-season = about 2 lifting days, low volume (COACH-AN | 0.5 | 0.5 | 0.5 | - | 40 |
| `cycling_sprint` | 2 | no | not game-heavy: in-season = about 2 lifting days, low volume (COACH-AN | 0.5 | 0.5 | 0.5 | - | 40 |
| `rowing` | 2 | no | not game-heavy: in-season = about 2 lifting days, low volume (COACH-AN | 0.5 | 0.5 | 0.5 | - | 40 |
| `ski_alpine` | 1-2 | no | not game-heavy: in-season = about 2 lifting days, low volume (COACH-AN | 0.5 | 0.5 | 0.5 | - | 40 |
| `ski_freestyle` | 1-2 | no | not game-heavy: in-season = about 2 lifting days, low volume (COACH-AN | 0.5 | 0.5 | 0.5 | - | 40 |
| `judo` | 2 | no | not game-heavy: in-season = about 2 lifting days, low volume (COACH-AN | 0.5 | 0 | 0 | - | 45 |
| `taekwondo` | 2 | no | not game-heavy: in-season = about 2 lifting days, low volume (COACH-AN | 0.5 | 0 | 0 | - | 45 |
| `weightlifting` | 3 | no | not game-heavy: in-season = about 2 lifting days, low volume (COACH-AN | 0.4 | - | - | - | 50 |
| `strongman` | 3 | no | not game-heavy: in-season = about 2 lifting days, low volume (COACH-AN | 0.4 | - | - | - | 50 |
| `hyrox_competitive` | 2 | no | not game-heavy: in-season = about 2 lifting days, low volume (COACH-AN | 0.5 | - | 0.5 | - | 50 |
| `ocr_spartan` | 2 | no | not game-heavy: in-season = about 2 lifting days, low volume (COACH-AN | 0.5 | 0.5 | 0.5 | - | 50 |
| `gymnastics_artistic` | 2 | yes | INFERRED analog of COACH-R2 ATH-07 (sport not named) - round-3 confirm | 0.5 | - | 0 | - | 45 |
| `climbing` | 2 | no | not game-heavy: in-season = about 2 lifting days, low volume (COACH-AN | 0.5 | - | - | - | 50 |
| `pickleball_competitive` | 2 | yes | INFERRED analog of COACH-R2 ATH-07 (sport not named) - round-3 confirm | 0.5 | 0 | 0 | - | 45 |

### 4.4 Pre-season, stairway, testing

- Pre-season: 4-6 weeks at about 60 % of off-season sets, more speed and power, then a 1-2-week taper before the first game; the length can be modified (COACH-R2 PER-06). `season_overrides.pre_season.total_sets_pct_of_off_season` per profile; strength sports' meet prep sits at 70-75 % (check C7, flagged).
- Every block is a stairway: small steps early, slightly bigger after the halfway point, the hardest weeks last; "start at a 2, end at an 11" is perceived effort / overall load (COACH-R2 PER-03/04/05). No deload or maintenance week inside a block; a block that cannot be finished is cancelled -> maintenance -> a new block (COACH-R2 VOL-07).
- Tests before the block (or week 1) and at the end, never mid-block; untrained people never test a 1RM or a max mile from zero - 5RM / 3RM or 80-90 % efforts (COACH-R2 PER-07). Every profile carries its test menu.

### 4.5 Olympic lifts, older adults, youth

- **rule**: everyone in athletic training gets Olympic lifts (COACH-ANSWER ATH-10)
- **frequency**: up to 4 exposures a week: clean days read as more squat-pattern, snatch days more hinge-pattern (snatches a bit more hingy) - COACH-R2 ATH-04
- **reps**: full squat cleans / snatches 3-5 reps per set at the same weekly reps (e.g. 6 x 5 @75 %); the 4 x 8 -> 4 x 4 ramp stays for DB / KB and pull variants; the coach's eye on speed and power (COACH-R2 ATH-05)
- **L1**: DB / KB snatches, hex-bar jumps, hang pulls, hang cleans (no bumper plates needed) - ATH-10
- **L1_additions**: hang clean, single-arm DB snatch, KB squat clean, hex-bar jump (COACH-R2 LIB-07)
- **L2**: power and hang variants with the barbell, push press (easier than the jerk, LIB-13); full lifts and the push jerk (intermediate / advanced, LIB-13) introduced
- **L3**: full lifts: 'Squat Snatch', 'Squat Clean', 'Squat Clean & Jerk' (LIB-07), push jerk (LIB-13), %-template OLY 75 -> 80 -> 85 -> 90% at 4x8 -> 4x6 -> 4x6 -> 4x4 (PER-09)
- **load_guidance**: RIR / RPE when no tested max; explained as power output; % only for competitive Olympic lifters, which is its own programming (COACH-R2 GEN-06; profile weightlifting)
- **in_season**: light 2 x 3 on 1-2 gym days, dropped in heavy game weeks (COACH-R2 ATH-04)
- **youth**: floor lifts from about 14, after one block of hang work (COACH-R2 ATH-08; COACH-ANSWER ATH-09)
- **older_60_plus**: none by default; can be switched on with 'Make sure that you have a fitness professional to help you understand what this means.' (COACH-R2 ATH-08; COACH-R3 ATH-02); no snatch variants (EQ-03)
- **never**: older / injured / high-volume clients never get the snatch, overhead squat or low-bar squat (COACH-ANSWER EQ-03; COACH-R3 ATH-02); depth jumps: never for injured / high-volume clients, switchable with the warning for 60+ (COACH-R3 ATH-02); INFERRED: when such a client is in athletic training (ATH-10), the Olympic slot uses hang pulls, high pulls, hex-bar jumps or KB swings - no snatch variants, including DB / KB snatches (open question)

### 4.6 Spine, core, full-body days

> **Changed in v1.3** (COACH-CT CT-01; COACH-R4 R4-SES-02, R4-SES-05). Session length is not an input and not a limit (the lengths below are his descriptions). A full-body day is his A or B day; field athletes do the athletic block and then the A / B lifts, up to 12 + the 2 core exercises. "When the chosen time cannot hold the minimums ..." is retired. Where the text below differs, the v1.3 section at the top of this file wins.

- warm-up always (5 min any cardio + A March / Skip / Run or mobility); A-drills are warm-up, not volume (COACH-ANSWER ORD-08)
- CORE FIRST as part of the warm-up, movable after the plyos or the strength block if the user prefers (COACH-ANSWER ATH-11; replaces the v0 'core second / optional days' reading)
- order: core -> plyo / ballistics -> Olympic / power -> strength -> resistance accessories -> isolation (power before strength, ORD-03; the main lift first, ORD-02; horizontal pull before vertical pull, ORD-01)
- field athletes off-season: up to 10-12 exercises (about 2 core + 2-4 plyo/ballistic + 2-3 Olympic/power + 3-4 resistance); resistance-only sessions about 5-7 exercises (COACH-ANSWER VOL-08 / VOL-16 / VOL-17); v1.2: field athletes up to 12 exercises + the 2-exercise core block (COACH-R2 SES-04) with 2-4 exercises for each group trained that day - cross pattern (default): 2 jump / throw stations + 1 Olympic lift; same-pattern athletic template (size-focused and high-level athletes): 3-4 jump stations + 1 Olympic lift (COACH-R3 SES-01)
- session length: athletes, bodybuilders, powerlifters about 1.5 h (max 2 h); general / weight-loss clients 45-60 min (COACH-ANSWER UNI-09); bootcamps 35-45 min, timed circuits 3-5 rounds x 30-50 s, 5-7 stations (PRG-03)
- pairing: hip-dominant (lower posterior) with upper push (anterior), knee-dominant with pull, in full-body and bootcamp days alike (COACH-ANSWER UNI-11 / ORD-06 - the Bootcamp Option 1 Tue/Fri wiring was a mistake)
- spine loading (COACH-R2 SES-01/02, refines COACH-ANSWER PER-04): heavy squat and heavy deadlift once a week each, on two different days; non-axial hinge (hip thrust, back extension, reverse hyper), leg press or belt squat on the other days; axial = barbell back / front / zercher / overhead / Smith squats, barbell or trap-bar deadlifts and RDLs, good mornings
- calves: one exercise x 3 sets every leg day (COACH-R3 SES-01); rear-delt work weekly inside the shoulders group (COACH-R3 VOL-01; VOL-17); about 2 core exercises for athletes (COACH-ANSWER VOL-17)
- **v1.2 editing (COACH-R3 SES-02):** users and coaches can switch off a day's athletic block or core block, add or remove exercises or whole blocks; the plan recommends supersets to save time; when the chosen time cannot hold the minimums the plan says so up front, offers another day or longer sessions, then trains fewer groups directly (big movers first) - owned by 05 / 12 v1.2
- supersets are a fatigue / density tool: short sessions, advanced athletes needing more stimulus, off-season VO2 / mitochondrial work, beginners who do not fatigue (COACH-ANSWER ORD-05); v1.2: the plan recommends supersets to save time (COACH-R3 SES-02)
- optional days (Calves, Cardio, Core, Focus 1, Focus 2) can be add-ons or separate days - ideally separate (COACH-ANSWER ORD-10)
- athletic sets (plyos, ballistics, throws, Olympic lifts, sprints, COD) never count toward muscle weekly sets (COACH-ANSWER VOL-10)
- core opens the session light (2 exercises x 2 sets short of failure); coaches / users may add core supersets or monster sets anywhere (COACH-R2 SES-03)
- full-body days: 2-4 exercises per FOCUS group trained that day (COACH-R2 SES-05; groups COACH-R3 SES-01: hips = glutes + hamstrings, shoulders = all delts); field-athlete cap 12 + 2 core (COACH-R2 SES-04)

### 4.7 Volume floor and muscle credits

> **Changed in v1.3** (COACH-R4 R4-SES-03, R4-LIB-02). The floor of 10 applies from 3 training days; with 2 days every big group is trained at about 6-8 weekly sets. Carries and sled work credit no muscle. Where the text below differs, the v1.3 section at the top of this file wins.

- **floor**: 10 weekly sets per muscle: 'I don't think anybody needs less than 10 sets a week per muscle' (COACH-R2 VOL-06); small muscles grow by the same idea - 8 is barely maintenance (COACH-R2 VOL-04); v1.2: counted on focus groups (hips = glutes + hamstrings, shoulders = front + side + rear delts) inside training blocks (COACH-R3 VOL-01, SES-01)
- **typical**: most people train 20-30 sets per muscle per week (COACH-R2 VOL-06 - the team is asked to check this against the research; see 12 / 03 v1.1)
- **caps**: non-priority beginner 14 / intermediate 22 / advanced 25; priority 18 / 26-28 / 30 (APPROVED R2-VOL-06), customizable; above 30 only for a very advanced optional "pro" level
- **rear delts**: COACH-R3 VOL-01: rear delts are not a muscle of their own - they are part of the shoulders group (front + side + rear delts); the floor of 10 counts on the shoulders group; users and coaches can add more rear-delt work (v1.1's own 4 / 6 / 8 rear-delt sets are retired as a separate target)
- **weekly rate**: the planned stairway (approved COACH-R3 VOL-04): about 3 % a week to the halfway week, about 5 % after, every trained group reaching its ceiling in the last week; no check-ins (COACH-R3 VOL-02) - the plan is printed once and adjusted by the person or coach
- **focus muscles**: Focus muscle 1 and Focus muscle 2 (optional, max 2) at intake: each gets +1 to +3 extra weekly sets over the balanced plan, included in the stairway (COACH-R3 SES-01); no sex field
- **starting sets per muscle wk**: beginner 10-12; intermediate 15-20; advanced 20+; evidence COACH-ANSWER VOL-01
- **glute credits**: COACH-R2 VOL-05: squats, lunges, deadlifts and RDLs credit glutes 0.25; hip thrusts and bridges 1.0; KB swings 0 (ballistic, not resistance); thruster = 1.0 quads / 0.5 shoulders / 0.25 glutes
- **hip-dominant category**: v1.1: BHD / UHD credit hamstrings 1.0 and glutes 0.25 at category level (deadlift / RDL majority); hip thrusts / bridges / glute isolation credit glutes 1.0 per exercise (COACH-R2 VOL-05). v1 INFERRED glutes 1.0 retired.
- **audit**: `derived.v1_1_audit` on every profile and variant recomputes the per-muscle sets with these credits and lists the muscles below 10 (flags F2 / F3; check C16). **v1.2:** `derived.v1_2_group_audit` counts the same budgets on focus groups (hips = glutes + hamstrings, shoulders = front + side + rear delts; each category credits a group once at its highest credit) and lists the groups below 10 (COACH-R3 VOL-01, SES-01; check C32); the per-muscle audit is kept as history.

## 5. Consistency checks (v1.1 merge; C23-C32 added in v1.2; C33-C35 by the v1.2 adversarial check)

| Check | Rule | Evidence | Result | Detail |
|---|---|---|---|---|
| C1 | plyo share = ground-contact class share; block start = share - 15 (COACH-R2 ATH-01; the v1.1 20 % floor on the start is retired in the v1.2 check) | COACH-R2 ATH-01 | **PASS** | all 119 profiles with a class (v1.1 sport verification re-run) |
| C1b | the sports the coach named carry exactly his approved share | COACH-R2 ATH-01 | **PASS** | track_sprinter: 75; volleyball: 60; soccer: 60; football_skill: 60; basketball: 50; tennis: 50; football_big_skill: 50; weekend_warrior: 50; baseball_position: 40; softball: 40; hockey: 40; football_lineman: 40; mma: 40; boxing: 25; karate_taekwondo: 25; kickboxing_muay_thai: 25; wrestling: 25; bjj_grappling: 25; golf: 25 |
| C1c | weekly-set budget split (PLYO + JLK vs BALL + THROW) within 5 points of the class share | MERGE (budget check) | **FLAGS** | 3 item(s): baseball_pitcher, hockey_goalie, volleyball_libero |
| C2 | recreational profiles use their activity's class | MERGE M-REC-CLASS (PROPOSED; flag F5) | **APPLIED** | 7 item(s): rec_flag_football, rec_soccer, rec_ultimate, rec_softball, rec_hockey, rec_triathlon, rec_rowing |
| C3 | aerobic sessions are integers; approved off-season values for the named sports; sport-practice sports 0 extra | COACH-R2 ATH-06; 04 distance_runner rule | **PASS** | all numeric |
| C4 | pre-season 2 aerobic sessions for competitive athletes (documented exceptions: HYROX, OCR, physique prep, CrossFit) | COACH-R2 ATH-06 | **PASS** | 4 item(s): crossfit_competitor, bodybuilding_aesthetics, hyrox_competitive, ocr_spartan |
| C5 | in-season 2 aerobic sessions | COACH-ANSWER ATH-07 | **PASS** | ok |
| C6 | game-heavy in season: plyos about half, no extra COD, sprints only for speed athletes, hard day >= 48 h before a game | COACH-R2 ATH-07 | **PASS** | basketball, volleyball, soccer, American football, ice hockey profiles |
| C7 | pre-season total sets about 60 % of off-season (52-68 accepted) | COACH-R2 PER-06 | **FLAGS** | 3 item(s): powerlifting_strength, weightlifting, strongman |
| C8 | 60+ default (no Olympic / plyo / depth jumps, option with warning) stated on every profile with Olympic lifts | COACH-R2 ATH-08 | **PASS** | ok |
| C9 | no medball in the main workout for aesthetics / physique | COACH-ANSWER ATH-05 | **PASS** | ok |
| C10 | no bands / chains / variable resistance in any prescription | COACH-ANSWER EQ-01 / EQ-12 | **PASS** | 0 item(s):  |
| C11 | no sleep / stress / job inputs | COACH-R2 GEN-04 | **PASS** | 0 item(s):  |
| C12 | no deload / maintenance week inside a block | COACH-R2 VOL-07 | **PASS** | 0 item(s):  |
| C13 | no '21.6 mile run' | COACH-R2 LIB-06 | **PASS** | ok |
| C14 | spine rule = heavy squat and heavy deadlift on two different days (no 'axial once a week' wording) | COACH-R2 SES-01/02 | **PASS** | COACH-R2 SES-01/02: crossfit_competitor, powerlifting_strength, football_big_skill, track_sprinter, mma, wrestling, bjj_grappling, football_ol, football_dl, rugby_forwards, cheer_base_spot, cheer_flyer_tumbler ...; COACH-R2 SES-01: weekend_warrior, rec_flag_football, rec_basketball, rec_softball, rec_soccer, rec_hockey, rec_volleyball, rec_ultimate |
| C15 | KB swings never count as glute volume | COACH-R2 VOL-05 | **PASS** | ok |
| C16 | floor 10 sets per muscle (audit only - the volume engine raises targets) | COACH-R2 VOL-04/06; flags F2 / F3 | **AUDIT** | profiles_with_all_muscles_at_or_above_10: ; profiles_with_5_plus_muscles_below_10: active_aging_50plus, active_aging_60plus, baseball_catcher, baseball_infield, baseball_outfield, baseball_pitcher, baseball_position, basketball, basketball_big, basketball_guard, bjj_grappling, bodybuilding_aesthetics ... |
| C17 | unique profile ids; every alias resolves to an existing profile and no alias is still a profile id; every picker / activity profile exists | MERGE | **PASS** | duplicates: ; bad_aliases: {} |
| C18 | every profile is reachable from the sport picker, the activity picker, a goal default or an age overlay | MERGE | **PASS** | all reachable (v1.1 sport verification re-run, 127 profiles) |
| C19 | coverage: every sport in the coach request and every gen-pop activity maps to existing profiles | coach request 2026-10-08 | **PASS** | 45 popular sports + 3 routed additions (skateboarding, surfing, speed skating) + trail / ultra choice; 23 gen-pop rows (v1.1 sport verification) |
| C20 | every injury code used by a profile resolves in injury_library | MERGE | **PASS** | ok after id_aliases.injury_codes (v1.1 sport verification re-run; new code KNEE_DEGENERATIVE_COURT resolves) |
| C21 | 60+ default: no plyos (incl. low ankle hops) - landing drills (step-down and stick) only; Olympic lifts / plyos / depth jumps opt-in with the warning | COACH-R2 ATH-08 + ATH-02 (ankle hops are on the plyometric list); flag F9 | **PASS** | v1.1 sport verification: active_aging_60plus JLK removed; every older_60_plus / age_notes text moved low ankle hops to the opt-in |
| C22 | recreational COD sports follow UNI-02 (field / COD athletes 80-90 % unilateral; recreational one step more bilateral than competitive) | COACH-ANSWER UNI-02 / UNI-10 | **PASS** | rec_soccer, rec_basketball, rec_flag_football, rec_ultimate, rec_hockey, rec_pickleball, rec_padel, rec_tennis = 30/70 -> 20/80 (v1.1 sport verification) |
| C23 | every sport named in COACH-R3 ATH-04 carries the approved end-of-block plyo share | COACH-R3 ATH-04 | **PASS** | checked: 58; mismatches: -; changed_v1_2: lacrosse_m_defense: 50 -> 60 |
| C24 | game-heavy in-season rule on lacrosse, field hockey, rugby, ultimate, flag football, beach volleyball | COACH-R3 ATH-04 | **PASS** | approved: field_hockey_field, field_hockey_gk, flag_football, lacrosse_m_attack, lacrosse_m_defense, lacrosse_m_goalie, lacrosse_m_midfield, lacrosse_w_attack, lacrosse_w_defense, lacrosse_w_goalie, lacrosse_w_midfield, rugby_backs, rugby_forwards, rugby_sevens, ultimate_cutter, ultimate_handler, volleyball_beach; still_inferred: cheer_base_spot, cheer_flyer_tumbler, gymnastics_artistic, pickleball_competitive, tennis, wrestling |
| C25 | 0 extra gym cardio for swimmers, runners, rowers, endurance cyclists; other competitive sports 2-4 off-season | COACH-R3 ATH-04, ATH-01 | **PASS** | zero: cross_country, cycling_endurance, distance_runner, rowing, swimming_distance, swimming_middle, swimming_sprint, track_middle; relabelled_2_4: cheer_base_spot, cheer_flyer_tumbler, climbing, cycling_sprint, diving, field_hockey_field, field_hockey_gk, flag_football, gymnastics_artistic, judo, lacrosse_m_attack, lacrosse_m_defense, lacrosse_m_goalie, lacrosse_m_midfield, lacrosse_w_attack, lacrosse_w_defense, lacrosse_w_goalie, lacrosse_w_midfield, pickleball_competitive, rugby_backs, rugby_forwards, rugby_sevens, ski_alpine, ski_freestyle, strongman, taekwondo, track_400, track_high_jump, |
| C26 | swimming: 3 + 1 days, 0 extra cardio, 25 % plyo, Olympic 2-3 days, shoulder care on every dryland day, 2-week championship taper | COACH-R3 ATH-01 | **PASS** | swimming_sprint, swimming_middle, swimming_distance |
| C27 | 60+: landing drills, balance, quick stepping, light throws, fast machine work on; ankle hops, jumps, Olympic lifts, depth jumps off (switchable); OH / low-bar squats out | COACH-R3 ATH-02 | **PASS** | active_aging_60plus JLK 0, Olympic 0 by default; every older_60_plus text carries the R3 rule |
| C28 | racket 50+ block (knee, calf / Achilles every leg day, rotator cuff, low-impact jumps unless switched on) on pickleball, padel and tennis profiles | COACH-R3 ATH-02 | **PASS** | rec_pickleball, rec_padel, rec_tennis, pickleball_competitive, tennis |
| C29 | HYROX: 2 strength + 2 hybrid, 4 cardio, 2 station circuits (not muscle sets), wall ball <= 20 lb, 40-rep / AMRAP only in circuits, 50 % plyo | COACH-R3 ATH-03 | **PASS** | hyrox_fitness, hyrox_competitive |
| C30 | every recreational profile: play days (>= 48 h, 3+ sessions -> no extra agility, half the jumps), cardio credit (up to 2 of 3), optional event date | COACH-R3 ATH-05 | **PASS** | profiles: 30; play_adjustment_added: rec_flag_football, rec_basketball, rec_softball, rec_soccer, rec_hockey, rec_volleyball, rec_ultimate, rec_triathlon, rec_rowing, hyrox_fitness, run_fitness, hike_ruck, cycling_fitness, lap_swim, rec_ocr; event_prep_added: rec_flag_football, rec_basketball, rec_softball, rec_soccer, rec_hockey, rec_volleyball, rec_ultimate, rec_triathlon, rec_rowing, rec_league, lap_swim, surf_paddle, dance_fitness, youth_general_athletic |
| C31 | no live check-in, readiness, stored-data or end-of-maintenance-prompt text (history and retired notes excluded) | COACH-R3 VOL-02, VOL-04, GEN-01, PER-01 | **PASS** | check_in_strings_left: 0; end_prompt_strings_left: 0 |
| C32 | floor audit on focus groups (hips, shoulders ...); rear delts not audited as a muscle of their own | COACH-R3 VOL-01, SES-01 | **AUDIT** | profiles_and_variants_audited: 194 |
| C33 | no logbook-driven rule ('Felt a PAIN', 'HOW IT FELT?', 'if twice in a slot') in any current text | COACH-R3 VOL-02, GEN-01 | **PASS** | 0 strings left (was 83) |
| C34 | plyo block start = class share - 15 points in every profile (no 20 % floor) | COACH-R2 ATH-01 | **PASS** | all class shares minus 15 |
| C35 | no 60+ step cap and no 'rear delts (own sets)' in any current text | COACH-R3 VOL-04, VOL-01; 12_volume_algorithm v1.2 §3.4 | **PASS** | 0 strings left |

Harmonisation edits made by the merge (old -> new):

| Profile | Field | Old | New | Rule |
|---|---|---|---|---|
| `distance_runner` | ath03_group | "health" | "endurance" | one ath03 group for endurance and hybrid-endurance racers (PROPOSED) |
| `hyrox_competitive` | ath03_group | "health" | "endurance" | one ath03 group for endurance and hybrid-endurance racers (PROPOSED) |
| `ocr_spartan` | ath03_group | "health" | "endurance" | one ath03 group for endurance and hybrid-endurance racers (PROPOSED) |
| `powerlifting_strength` | resistance.axial_rule | "PER-04 once-a-week wording" | "R2-SES-01/02 two axial days + light technique exception" | COACH-R2 SES-01/02 |
| `distance_runner` | rationale | "21.6-mile run as the marathon" | "removed (COACH-R2 LIB-06)" | COACH-R2 LIB-06 |
| `baseball_position` | aerobic_sessions_wk | {"off_season_or_default": 2, "off_season_range": [2, 2], "pre_season": null, "in_season": 2} | {"off_season_or_default": 2, "off_season_range": [2, 2], "pre_season": 2, "in_season": 2} | COACH-R2 ATH-06 (baseball 2); pre-season 2 (COACH-R2 ATH-06); in season 2 (COACH-ANSWER AT |
| `football_lineman` | aerobic_sessions_wk | {"off_season_or_default": 3, "off_season_range": [3, 3], "pre_season": null, "in_season": 2} | {"off_season_or_default": 3, "off_season_range": [3, 3], "pre_season": 2, "in_season": 2} | COACH-R2 ATH-06 (football 3); pre-season 2; in season 2 (ATH-07) |
| `youth_athlete` | aerobic_sessions_wk | {"off_season_or_default": 2, "off_season_range": [2, 2], "pre_season": null, "in_season": 2} | {"off_season_or_default": 2, "off_season_range": [2, 3], "pre_season": 2, "in_season": 2} | INFERRED (multi-sport youth; practice supplies conditioning); pre 2 / in 2 as athletes |
| `hybrid` | aerobic_sessions_wk | {"off_season_or_default": 2, "off_season_range": [2, 2], "pre_season": null, "in_season": null} | {"off_season_or_default": 2, "off_season_range": [2, 3], "pre_season": null, "in_season": null} | OBSERVED A 1 (Tue sprint intervals) + C 1 (Fri '15-40 min' easy, a real aerobic block - OR |
| `rec_flag_football` | ground_contact.class | 3 | 2 | M-REC-CLASS |
| `rec_soccer` | ground_contact.class | 3 | 2 | M-REC-CLASS |
| `rec_ultimate` | ground_contact.class | 3 | 2 | M-REC-CLASS |
| `rec_softball` | ground_contact.class | 3 | 4 | M-REC-CLASS |
| `rec_hockey` | ground_contact.class | 3 | 4 | M-REC-CLASS |
| `rec_triathlon` | ground_contact.class | 3 | 1 | M-REC-CLASS |
| `rec_rowing` | ground_contact.class | 3 | 5 | M-REC-CLASS |
| `youth_athlete` | power_mix_by_phase | null | "filled from the class share" | COACH-R2 ATH-01/03/07 |
| `rec_flag_football` | power_mix.plyo_pct_target | 50 | 60 | class 2 -> 60 % (COACH-R2 ATH-01) |
| `rec_flag_football` | weekly_sets PLYO/JLK/BALL/THROW | {"PLYO": 10.0, "JLK": 2.0, "BALL": 4.0, "THROW": 8.0} | {"PLYO": 12.0, "JLK": 2.5, "BALL": 3.0, "THROW": 6.5} | class share 60 % (COACH-R2 ATH-01) |
| `rec_flag_football` | power_mix_by_phase.target_class_share_pct | 50 | 60 | class share |
| `rec_flag_football` | power_mix_by_phase.off_season | [35, 50] | [45, 60] | start -15 (floor 20) -> class share (COACH-R2 ATH-01) |
| `rec_softball` | power_mix.plyo_pct_target | 50 | 40 | class 4 -> 40 % (COACH-R2 ATH-01) |
| `rec_softball` | weekly_sets PLYO/JLK/BALL/THROW | {"PLYO": 10.0, "JLK": 2.0, "BALL": 2.0, "THROW": 10.0} | {"PLYO": 8.0, "JLK": 1.5, "BALL": 2.5, "THROW": 12.0} | class share 40 % (COACH-R2 ATH-01) |
| `rec_softball` | power_mix_by_phase.target_class_share_pct | 50 | 40 | class share |
| `rec_softball` | power_mix_by_phase.off_season | [35, 50] | [25, 40] | start -15 (floor 20) -> class share (COACH-R2 ATH-01) |
| `rec_soccer` | power_mix.plyo_pct_target | 50 | 60 | class 2 -> 60 % (COACH-R2 ATH-01) |
| `rec_soccer` | weekly_sets PLYO/JLK/BALL/THROW | {"PLYO": 10.0, "JLK": 2.0, "BALL": 4.0, "THROW": 8.0} | {"PLYO": 12.0, "JLK": 2.5, "BALL": 3.0, "THROW": 6.5} | class share 60 % (COACH-R2 ATH-01) |
| `rec_soccer` | power_mix_by_phase.target_class_share_pct | 50 | 60 | class share |
| `rec_soccer` | power_mix_by_phase.off_season | [35, 50] | [45, 60] | start -15 (floor 20) -> class share (COACH-R2 ATH-01) |
| `rec_hockey` | power_mix.plyo_pct_target | 50 | 40 | class 4 -> 40 % (COACH-R2 ATH-01) |
| `rec_hockey` | weekly_sets PLYO/JLK/BALL/THROW | {"PLYO": 10.0, "JLK": 2.0, "BALL": 4.0, "THROW": 8.0} | {"PLYO": 8.0, "JLK": 1.5, "BALL": 5.0, "THROW": 9.5} | class share 40 % (COACH-R2 ATH-01) |
| `rec_hockey` | power_mix_by_phase.target_class_share_pct | 50 | 40 | class share |
| `rec_hockey` | power_mix_by_phase.off_season | [35, 50] | [25, 40] | start -15 (floor 20) -> class share (COACH-R2 ATH-01) |
| `rec_ultimate` | power_mix.plyo_pct_target | 50 | 60 | class 2 -> 60 % (COACH-R2 ATH-01) |
| `rec_ultimate` | weekly_sets PLYO/JLK/BALL/THROW | {"PLYO": 10.0, "JLK": 2.0, "BALL": 4.0, "THROW": 8.0} | {"PLYO": 12.0, "JLK": 2.5, "BALL": 3.0, "THROW": 6.5} | class share 60 % (COACH-R2 ATH-01) |
| `rec_ultimate` | power_mix_by_phase.target_class_share_pct | 50 | 60 | class share |
| `rec_ultimate` | power_mix_by_phase.off_season | [35, 50] | [45, 60] | start -15 (floor 20) -> class share (COACH-R2 ATH-01) |
| `rec_triathlon` | power_mix.plyo_pct_target | 50 | 75 | class 1 -> 75 % (COACH-R2 ATH-01) |
| `rec_triathlon` | weekly_sets PLYO/JLK/BALL/THROW | {"PLYO": 4.0, "JLK": 5.0, "BALL": 4.0, "THROW": 4.0} | {"PLYO": 6.0, "JLK": 7.0, "BALL": 2.0, "THROW": 2.0} | class share 75 % (COACH-R2 ATH-01) |
| `rec_triathlon` | power_mix_by_phase.target_class_share_pct | 50 | 75 | class share |
| `rec_triathlon` | power_mix_by_phase.off_season | [35, 50] | [60, 75] | start -15 (floor 20) -> class share (COACH-R2 ATH-01) |
| `rec_rowing` | power_mix.plyo_pct_target | 50 | 25 | class 5 -> 25 % (COACH-R2 ATH-01) |
| `rec_rowing` | weekly_sets PLYO/JLK/BALL/THROW | {"PLYO": 4.0, "JLK": 2.0, "BALL": 4.0, "THROW": 4.0} | {"PLYO": 2.5, "JLK": 1.0, "BALL": 5.0, "THROW": 5.5} | class share 25 % (COACH-R2 ATH-01) |
| `rec_rowing` | power_mix_by_phase.target_class_share_pct | 50 | 25 | class share |
| `rec_rowing` | power_mix_by_phase.off_season | [35, 50] | [20, 25] | start -15 (floor 20) -> class share (COACH-R2 ATH-01) |
| `football_k_p` | aerobic_sessions_wk.off_season_range | [2, 3] | [3, 3] | COACH-R2 ATH-06 (approved value for the sport) |
| `weightlifting` | aerobic_sessions_wk.in_season | 1 | 2 | COACH-ANSWER ATH-07 (2 in season); COACH-R2 ATH-06 powerlifters 2 easy Orange for strength |
| `strongman` | aerobic_sessions_wk.in_season | 1 | 2 | COACH-ANSWER ATH-07 (2 in season); COACH-R2 ATH-06 powerlifters 2 easy Orange for strength |

Text replaced for round 2: the 04 spine rule "axial loading once a week ..." -> heavy squat and heavy deadlift on two different days + the approved axial list (COACH-R2 SES-01/02) in 29 profiles; "squat only once a week" -> the same rule in 8 profiles.

## 6. Profile matrix (all profiles)

Columns: category (C competitive / R recreational / G goal); contact class and plyo share; main + optional days; weekly sets total and athletic sets; aerobic off / pre / in; in-season lift days; Olympic (TE) sets; emphasis jump / throw / sprint / COD (0-3); origin / reuse.

| id | Name | Cat | Sport | Family | ath03 | Class / share | Days | Sets (athl.) | Aerobic off/pre/in | In-season lifts | TE | J/T/S/C | Origin / reuse |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| `baseball_position` | Baseball - position players (no position picked; base of infield / outfield) | C | baseball | field_court | rotational_power | 4 / 40 % | 4+0 | 136.6 (35.7) | 2 / 2 / 2 | 2 | 8 | 2/3/2/1 | 04 / 04 |
| `boxing` | Boxing | C | boxing | combat | combat | 5 / 25 % | 4+0 | 176 (79) | 3 / 2 / 2 | 2 | 9 | 2/3/2/0 | 04 / 04 |
| `crossfit_competitor` | CrossFit - competitor (FULL TIME) | C | crossfit | crossfit | size_strength | - | 4+1 | 78 (0) | 2 / 3 / 2 | 4 | 0 | 0/0/0/0 | 04 / 04 |
| `hybrid` | Hybrid athlete (strength - athletic - 'crossfitish') | G | - | crossfit | health | - | 5+0 | 81.6 (10.9) | 2 / - / - | - | 4.9 | 0/0/0/0 | 04 / 04 |
| `powerlifting_strength` | Powerlifting - competitive (meet lifter) | C | powerlifting | strength | size_strength | - | 4+0 | 73.5 (3) | 2 / 2 / 2 | 3 | 0 | 1/0/0/0 | 04 / 04 |
| `bodybuilding_aesthetics` | Bodybuilding / physique - competitive (all NPC divisions) | C | bodybuilding_physique | physique | size_strength | - | 4+2 | 108 (0) | 4 / 4 / - | - | 0 | 0/0/0/0 | 04 / 04 |
| `fat_loss` | Fat loss / body toning | G | - | physique | health | - | 4+2 | 102.2 (0) | 3 / - / - | - | 0 | 0/0/0/0 | 04 / 04 |
| `basketball` | Basketball - wings (SF / combo forwards) | C | basketball | field_court | speed_power | 3 / 50 % | 4+2 | 157 (75) | 3 / 2 / 2 | 2 | 8 | 3/1/2/3 | 04 / 04 |
| `volleyball` | Volleyball - outside / opposite hitters | C | volleyball | field_court | speed_power | 2 / 60 % | 4+2 | 146.5 (61.5) | 3 / 2 / 2 | 2 | 8 | 3/1/1/1 | 04 / 04 |
| `football_skill` | American football - wide receiver / defensive back (WR / CB / S) | C | american_football | field_court | speed_power | 2 / 60 % | 4+2 | 151.5 (68.5) | 3 / 2 / 2 | 2 | 8 | 3/1/3/3 | 04 / 04 |
| `football_big_skill` | American football - tight end / linebacker (TE / LB, FB, box S) | C | american_football | field_court | speed_power | 3 / 50 % | 4+2 | 148.5 (59) | 3 / 2 / 2 | 2 | 10 | 2/1/3/2 | 04 / 04 |
| `football_lineman` | American football - linemen (OL / DL base profile) | C | american_football | field_court | resistance | 4 / 40 % | 4+2 | 146 (36.5) | 3 / 2 / 2 | 2 | 10 | 2/2/2/2 | 04 / 04 |
| `soccer` | Soccer - midfielders (CM / DM / AM / wide) | C | soccer | field_court | speed_power | 2 / 60 % | 4+2 | 136 (61) | 4 / 2 / 2 | 2 | 4 | 3/1/3/3 | 04 / 04 |
| `softball` | Softball - position players | C | softball | field_court | rotational_power | 4 / 40 % | 4+0 | 133.5 (38) | 2 / 2 / 2 | 2 | 4 | 1/2/2/1 | 04 / 04 |
| `hockey` | Ice hockey - forwards (C / W) | C | ice_hockey | field_court | speed_power | 4 / 40 % | 4+2 | 118.5 (37.5) | 3 / 2 / 2 | 2 | 8 | 1/1/2/1 | 04 / 04 |
| `tennis` | Tennis - competitive | C | tennis | field_court | rotational_power | 3 / 50 % | 4+2 | 136.5 (57) | 3 / 2 / 2 | 2 | 4 | 2/2/2/2 | 04 / 04 |
| `golf` | Golf - competitive | C | golf | general | rotational_power | 5 / 25 % | 3+2 | 84.5 (26.5) | 3 / 2 / 2 | 2 | 4 | 1/2/0/0 | 04 / 04 |
| `track_sprinter` | Track - sprints (100-200 m) | C | track_and_field | field_court | speed_power | 1 / 75 % | 4+2 | 128 (54) | 2 / 2 / 2 | 2 | 10 | 3/1/3/0 | 04 / 04 |
| `distance_runner` | Distance running (5K-10K, half marathon, marathon) | C | distance_running | endurance | endurance | 1 / 75 % | 3+0 | 69.5 (19.5) | 0 / 0 / 0 | 1-2 | 2 | 1/0/1/0 | 04 / 04 |
| `kickboxing_muay_thai` | Kickboxing / Muay Thai | C | kickboxing_muay_thai | combat | combat | 5 / 25 % | 4+0 | 129 (51) | 4 / 2 / 2 | 2 | 6 | 1/2/2/1 | 04 / 04 |
| `karate_taekwondo` | Karate (kumite) | C | karate | combat | combat | 5 / 25 % | 4+0 | 125 (48) | 3 / 2 / 2 | 2 | 4 | 1/2/2/1 | 04 / 04 |
| `mma` | MMA (mixed martial arts) | C | mma | combat | combat | 4 / 40 % | 4+0 | 143 (58) | 4 / 2 / 2 | 2 | 9 | 2/2/2/1 | 04 / 04 |
| `wrestling` | Wrestling (folkstyle / freestyle / Greco-Roman) | C | wrestling | combat | resistance | 5 / 25 % | 4+0 | 132 (44) | 4 / 2 / 2 | 2 | 8 | 1/2/1/1 | 04 / 04 |
| `bjj_grappling` | Brazilian jiu-jitsu / submission grappling | C | bjj | combat | combat | 5 / 25 % | 3+0 | 99 (28) | 3 / 2 / 2 | 2 | 4 | 1/1/0/0 | 04 / 04 |
| `general_population` | General population / longevity | G | - | general | health | - | 3+2 | 52 (4) | 3 / - / - | - | 0 | 0/1/1/0 | 04 / 04 |
| `youth_athlete` | Youth athlete (multi-sport, pre/circa/post-PHV) | C | - | youth | health | 3 / 50 % | 3+0 | 78 (39) | 2 / 2 / 2 | - | 4 | 2/2/2/2 | 04 / 04 |
| `weekend_warrior` | Athletic Performance - Non-Competitive (weekend warrior; formerly 'Justice League') | R | general_athletic | field_court | health | 3 / 50 % | 4+2 | 163 (40) | 3 / - / - | - | 8 | 3/2/0/2 | 04 / 04 |
| `football_qb` | American football - quarterback (QB) | C | american_football | field_court | rotational_power | 4 / 40 % | 4+2 | 140.5 (53.5) | 3 / 2 / 2 | 2 | 8 | 1/1/3/2 | team / unchanged |
| `football_rb` | American football - running back (RB) | C | american_football | field_court | speed_power | 2 / 60 % | 4+2 | 153.5 (64.5) | 3 / 2 / 2 | 2 | 8 | 3/1/3/2 | team / delta |
| `football_ol` | American football - offensive line (OL) | C | american_football | field_court | resistance | 4 / 40 % | 4+2 | 145 (33.5) | 3 / 2 / 2 | 2 | 10 | 1/1/2/1 | team / delta |
| `football_dl` | American football - defensive line (DL) | C | american_football | field_court | resistance | 4 / 40 % | 4+2 | 151 (41.5) | 3 / 2 / 2 | 2 | 10 | 1/1/2/1 | team / delta |
| `football_k_p` | American football - kicker / punter (K / P / LS) | C | american_football | field_court | speed_power | 4 / 40 % | 4+2 | 128.5 (39.5) | 3 / 2 / 2 | 2 | 8 | 1/1/2/1 | team / unchanged |
| `flag_football` | Flag football - competitive (HS / club / national team) | C | flag_football | field_court | speed_power | 2 / 60 % | 4+2 | 148.5 (68.5) | 3 / 2 / 2 | 2 | 8 | 3/1/3/3 | team / delta |
| `rec_flag_football` | Flag football - recreational (adult / youth league) | R | flag_football | field_court | health | 2 / 60 % | 4+2 | 129 (45) | 3 / - / - | - | 8 | 2/1/2/1 | team / delta |
| `basketball_guard` | Basketball - guards (PG / SG) | C | basketball | field_court | speed_power | 3 / 50 % | 4+2 | 159 (77) | 3 / 2 / 2 | 2 | 8 | 3/1/3/3 | team / unchanged |
| `basketball_big` | Basketball - bigs (PF / C) | C | basketball | field_court | speed_power | 3 / 50 % | 4+2 | 157 (69) | 3 / 2 / 2 | 2 | 8 | 3/1/1/2 | team / unchanged |
| `rec_basketball` | Basketball - recreational (league / pickup) | R | basketball | field_court | health | 3 / 50 % | 4+2 | 128 (44) | 3 / - / - | - | 8 | 2/1/0/1 | team / delta |
| `baseball_pitcher` | Baseball - pitchers | C | baseball | field_court | rotational_power | 4 / 40 % | 4+0 | 130.6 (27.7) | 2 / 2 / 2 | 2 | 8 | 1/1/1/0 | team / unchanged |
| `baseball_catcher` | Baseball - catchers | C | baseball | field_court | rotational_power | 4 / 40 % | 4+0 | 139.6 (35.7) | 2 / 2 / 2 | 2 | 8 | 1/1/2/1 | team / unchanged |
| `baseball_infield` | Baseball - infielders | C | baseball | field_court | rotational_power | 4 / 40 % | 4+0 | 140.6 (39.7) | 2 / 2 / 2 | 2 | 8 | 1/1/2/1 | team / delta |
| `baseball_outfield` | Baseball - outfielders | C | baseball | field_court | rotational_power | 4 / 40 % | 4+0 | 140.6 (38.7) | 2 / 2 / 2 | 2 | 8 | 1/1/3/1 | team / delta |
| `softball_pitcher` | Softball - pitchers (windmill) | C | softball | field_court | rotational_power | 4 / 40 % | 4+0 | 138.5 (35) | 2 / 2 / 2 | 2 | 4 | 1/1/2/1 | team / unchanged |
| `rec_softball` | Softball - recreational slow-pitch (adult league) | R | softball | field_court | health | 4 / 40 % | 4+2 | 125 (38) | 3 / - / - | - | 8 | 2/1/1/1 | team / delta |
| `soccer_gk` | Soccer - goalkeeper | C | soccer | field_court | speed_power | 3 / 50 % | 4+2 | 132 (53) | 3 / 2 / 2 | 2 | 4 | 2/1/2/2 | team / unchanged |
| `soccer_defender` | Soccer - defenders (CB / FB) | C | soccer | field_court | speed_power | 2 / 60 % | 4+2 | 139 (58) | 3 / 2 / 2 | 2 | 4 | 3/1/3/2 | team / delta |
| `soccer_forward` | Soccer - forwards (ST / W) | C | soccer | field_court | speed_power | 2 / 60 % | 4+2 | 141 (65) | 3 / 2 / 2 | 2 | 4 | 3/1/3/3 | team / delta |
| `rec_soccer` | Soccer - recreational (adult outdoor / indoor league) | R | soccer | field_court | health | 2 / 60 % | 4+2 | 130 (45) | 3 / - / - | - | 8 | 2/1/2/1 | team / delta |
| `hockey_defense` | Ice hockey - defensemen (D) | C | ice_hockey | field_court | speed_power | 4 / 40 % | 4+2 | 122.5 (36.5) | 4 / 2 / 2 | 2 | 8 | 1/1/1/1 | team / delta |
| `hockey_goalie` | Ice hockey - goalies | C | ice_hockey | field_court | speed_power | 4 / 40 % | 4+2 | 108.5 (27.5) | 3 / 2 / 2 | 2 | 8 | 0/1/0/1 | team / unchanged |
| `rec_hockey` | Ice hockey - recreational (adult league) | R | ice_hockey | field_court | health | 4 / 40 % | 4+2 | 120 (36) | 3 / - / - | - | 8 | 2/1/0/1 | team / delta |
| `volleyball_middle` | Volleyball - middle blockers | C | volleyball | field_court | speed_power | 2 / 60 % | 4+2 | 145.5 (60.5) | 3 / 2 / 2 | 2 | 8 | 3/1/1/1 | team / delta |
| `volleyball_setter` | Volleyball - setters | C | volleyball | field_court | speed_power | 2 / 60 % | 4+2 | 143.5 (58.5) | 3 / 2 / 2 | 2 | 8 | 3/1/1/1 | team / unchanged |
| `volleyball_libero` | Volleyball - libero / defensive specialist | C | volleyball | field_court | speed_power | 2 / 60 % | 4+2 | 134.5 (49.5) | 3 / 2 / 2 | 2 | 8 | 1/1/2/2 | team / unchanged |
| `volleyball_beach` | Beach volleyball (pairs) | C | beach_volleyball | field_court | speed_power | 3 / 50 % | 4+2 | 149 (63) | 3 / 2 / 2 | 2 | 8 | 3/1/2/2 | team / new |
| `rec_volleyball` | Volleyball - recreational (indoor / sand / grass league) | R | volleyball | field_court | health | 3 / 50 % | 4+2 | 128 (42) | 3 / - / - | - | 8 | 2/1/0/1 | team / delta |
| `lacrosse_m_attack` | Men's lacrosse - attack | C | lacrosse | field_court | speed_power | 2 / 60 % | 4+2 | 154 (71) | 3 / 2 / 2 | 2 | 8 | 3/1/3/3 | team / new |
| `lacrosse_m_midfield` | Men's lacrosse - midfield (incl. FOGO variant) | C | lacrosse | field_court | speed_power | 2 / 60 % | 4+2 | 153 (70) | 4 / 2 / 2 | 2 | 8 | 3/1/3/3 | team / new |
| `lacrosse_m_defense` | Men's lacrosse - defense (close D / LSM) | C | lacrosse | field_court | speed_power | 2 / 60 % | 4+2 | 154 (68) | 3 / 2 / 2 | 2 | 10 | 3/1/3/2 | team / new |
| `lacrosse_m_goalie` | Men's lacrosse - goalie | C | lacrosse | field_court | speed_power | 3 / 50 % | 4+2 | 125 (46) | 3 / 2 / 2 | 2 | 8 | 2/1/1/1 | team / new |
| `lacrosse_w_attack` | Women's lacrosse - attack | C | lacrosse | field_court | speed_power | 2 / 60 % | 4+2 | 153 (72) | 3 / 2 / 2 | 2 | 8 | 3/1/3/3 | team / new |
| `lacrosse_w_midfield` | Women's lacrosse - midfield (incl. draw specialist) | C | lacrosse | field_court | speed_power | 2 / 60 % | 4+2 | 152 (71) | 4 / 2 / 2 | 2 | 8 | 3/1/3/3 | team / new |
| `lacrosse_w_defense` | Women's lacrosse - defense | C | lacrosse | field_court | speed_power | 2 / 60 % | 4+2 | 146 (66) | 4 / 2 / 2 | 2 | 8 | 3/1/3/3 | team / new |
| `lacrosse_w_goalie` | Women's lacrosse - goalie | C | lacrosse | field_court | speed_power | 3 / 50 % | 4+2 | 125 (46) | 3 / 2 / 2 | 2 | 8 | 2/1/1/1 | team / new |
| `field_hockey_field` | Field hockey - field players (forwards / midfielders / defenders) | C | field_hockey | field_court | speed_power | 2 / 60 % | 4+2 | 141 (60) | 3 / 2 / 2 | 2 | 6 | 3/1/3/2 | team / new |
| `field_hockey_gk` | Field hockey - goalkeeper | C | field_hockey | field_court | speed_power | 3 / 50 % | 4+2 | 119 (40) | 3 / 2 / 2 | 2 | 6 | 1/1/1/1 | team / new |
| `rugby_forwards` | Rugby union - forwards (front row / locks / back row) | C | rugby | field_court | resistance | 4 / 40 % | 4+2 | 151.5 (41) | 3 / 2 / 2 | 2 | 10 | 1/1/3/1 | team / new |
| `rugby_backs` | Rugby union - backs (halves / centres / back three) | C | rugby | field_court | resistance | 3 / 50 % | 4+2 | 152.5 (63) | 3 / 2 / 2 | 2 | 10 | 2/1/3/2 | team / delta |
| `rugby_sevens` | Rugby sevens | C | rugby | field_court | resistance | 2 / 60 % | 4+2 | 156.5 (67) | 4 / 2 / 2 | 2 | 10 | 3/1/3/2 | team / delta |
| `cheer_base_spot` | Cheerleading / STUNT - bases and back spots | C | cheerleading | field_court | resistance | 4 / 40 % | 4+2 | 124 (36) | 2 / 2 / 2 | 2 | 12 | 1/1/0/1 | team / new |
| `cheer_flyer_tumbler` | Cheerleading / STUNT - flyers and tumblers | C | cheerleading | field_court | speed_power | 2 / 60 % | 4+2 | 124 (45) | 2 / 2 / 2 | 2 | 6 | 2/1/1/1 | team / new |
| `ultimate_cutter` | Ultimate - cutters | C | ultimate | field_court | speed_power | 2 / 60 % | 4+2 | 139 (64) | 4 / 2 / 2 | 2 | 6 | 2/1/3/3 | team / delta |
| `ultimate_handler` | Ultimate - handlers | C | ultimate | field_court | speed_power | 3 / 50 % | 4+2 | 141 (63) | 3 / 2 / 2 | 2 | 6 | 2/1/3/3 | team / delta |
| `rec_ultimate` | Ultimate - recreational league | R | ultimate | field_court | health | 2 / 60 % | 4+2 | 129 (45) | 3 / - / - | - | 8 | 2/1/2/1 | team / delta |
| `swimming_sprint` | Swimming - sprint (50-100) | C | swimming | aquatic | speed_power | 5 / 25 % | 3+1 | 97 (23) | 0 / 0 / 0 | 2 | 6 | 1/1/0/0 | aquatic / new |
| `swimming_middle` | Swimming - middle distance (200-400 / IM) | C | swimming | aquatic | speed_power | 5 / 25 % | 3+1 | 94 (21) | 0 / 0 / 0 | 2 | 6 | 1/1/0/0 | aquatic / new |
| `swimming_distance` | Swimming - distance (800-1500 / open water) | C | swimming | aquatic | endurance | 5 / 25 % | 3+1 | 73 (13) | 0 / 0 / 0 | 2 | 3 | 1/1/0/0 | aquatic / new |
| `diving` | Diving (springboard / platform) | C | diving | aquatic | speed_power | 4 / 40 % | 3+1 | 99 (29) | 2 / 2 / 2 | 2 | 5 | 1/1/0/0 | aquatic / new |
| `water_polo_field` | Water polo - field players (drivers, wings, point, defenders) | C | water_polo | aquatic | rotational_power | 5 / 25 % | 3+1 | 96 (22) | 0 / 0 / 0 | 2 | 6 | 1/1/0/0 | aquatic / new |
| `water_polo_center` | Water polo - center (2-meter) and center defender | C | water_polo | aquatic | resistance | 5 / 25 % | 3+1 | 102 (22) | 0 / 0 / 0 | 2 | 6 | 1/1/0/0 | aquatic / delta |
| `water_polo_goalkeeper` | Water polo - goalkeeper | C | water_polo | aquatic | speed_power | 5 / 25 % | 3+1 | 98 (22) | 0 / 0 / 0 | 2 | 6 | 1/1/0/0 | aquatic / delta |
| `track_400` | Track - 400 m | C | track_and_field | field_court | speed_power | 1 / 75 % | 4+2 | 124.5 (50.5) | 2 / 2 / 2 | 2 | 10 | 3/1/3/0 | aquatic / delta |
| `track_hurdles` | Track - hurdles (100 / 110 m H; 400 m H variant) | C | track_and_field | field_court | speed_power | 1 / 75 % | 4+2 | 130 (54) | 2 / 2 / 2 | 2 | 10 | 3/1/3/0 | aquatic / delta |
| `track_jumper` | Track - horizontal jumps (long / triple) | C | track_and_field | field_court | speed_power | 1 / 75 % | 4+2 | 130 (56) | 2 / 2 / 2 | 2 | 10 | 3/1/3/0 | aquatic / unchanged |
| `track_high_jump` | Track - high jump | C | track_and_field | field_court | speed_power | 2 / 60 % | 4+2 | 123 (49) | 2 / 2 / 2 | 2 | 10 | 3/1/3/0 | aquatic / new |
| `track_pole_vault` | Track - pole vault | C | track_and_field | field_court | speed_power | 2 / 60 % | 4+2 | 130 (45) | 2 / 2 / 2 | 2 | 8 | 2/1/3/0 | aquatic / new |
| `track_thrower` | Track - throws (shot put, discus, hammer) | C | track_and_field | field_court | resistance | 4 / 40 % | 4+2 | 129 (44) | 2 / 2 / 2 | 2 | 10 | 1/1/2/0 | aquatic / delta |
| `track_javelin` | Track - javelin | C | track_and_field | field_court | resistance | 3 / 50 % | 4+2 | 123 (42) | 2 / 2 / 2 | 2 | 8 | 2/1/3/0 | aquatic / new |
| `track_middle` | Track - middle distance (800-1500 m / mile) | C | track_and_field | endurance | endurance | 1 / 75 % | 3+0 | 79 (25) | 0 / 0 / 0 | 1-2 | 3 | 1/0/2/0 | aquatic / new |
| `cross_country` | Cross country (HS / college) | C | distance_running | endurance | endurance | 1 / 75 % | 3+0 | 72.5 (20.5) | 0 / 0 / 0 | 1-2 | 2 | 1/0/1/0 | aquatic / delta |
| `triathlon` | Triathlon (sprint / Olympic, 70.3, full) | C | triathlon | endurance | endurance | 1 / 75 % | 2+1 | 60 (13) | 0 / 0 / 0 | 1-2 | 2 | 1/0/0/0 | aquatic / new |
| `cycling_endurance` | Cycling - endurance (road, mountain bike, gravel, indoor racing) | C | cycling | endurance | endurance | 4 / 40 % | 3+1 | 79 (18) | 0 / 0 / 0 | 1-2 | 3 | 1/1/0/0 | aquatic / new |
| `cycling_sprint` | Cycling - sprint (track sprint, keirin, BMX) | C | cycling | strength | resistance | 4 / 40 % | 4+0 | 112 (29) | 2 / 2 / 2 | 2 | 12 | 1/1/0/0 | aquatic / new |
| `rowing` | Rowing (crew: sweep / sculling) | C | rowing | endurance | endurance | 5 / 25 % | 3+1 | 85 (18) | 0 / 0 / 0 | 2 | 6 | 1/1/0/0 | aquatic / new |
| `ski_alpine` | Alpine ski racing and snowboard racing / cross | C | ski_snowboard | snow | resistance | 4 / 40 % | 4+1 | 115 (37) | 3 / 2 / 2 | 1-2 | 8 | 1/1/0/1 | aquatic / new |
| `ski_freestyle` | Freestyle skiing / snowboarding (moguls, slopestyle, halfpipe, big air) | C | ski_snowboard | snow | speed_power | 3 / 50 % | 4+1 | 118 (40) | 2 / 2 / 2 | 1-2 | 8 | 2/1/0/1 | aquatic / new |
| `rec_triathlon` | Triathlon - recreational (first race / age group) | R | triathlon | general | health | 1 / 75 % | 4+2 | 112 (25) | 3 / - / - | - | 8 | 1/1/0/0 | aquatic / delta |
| `rec_rowing` | Rowing - recreational (indoor rowing / masters crew) | R | rowing | general | health | 5 / 25 % | 4+2 | 109 (22) | 3 / - / - | - | 8 | 1/1/0/0 | aquatic / delta |
| `judo` | Judo | C | judo | combat | resistance | 5 / 25 % | 4+0 | 130 (39.5) | 4 / 2 / 2 | 2 | 8 | 1/1/1/1 | combat / new |
| `taekwondo` | Taekwondo (sparring / kyorugi) | C | taekwondo | combat | combat | 5 / 25 % | 4+0 | 126 (48) | 3 / 2 / 2 | 2 | 4 | 1/2/2/1 | combat / delta |
| `weightlifting` | Olympic weightlifting (snatch / clean & jerk) - competitive | C | olympic_weightlifting | strength | resistance | 5 / 25 % | 4+1 | 107 (36) | 2 / 2 / 2 | 3 | 32 | 1/0/0/0 | combat / new |
| `strongman` | Strongman | C | strongman | strength | size_strength | 5 / 25 % | 4+0 | 108 (12) | 2 / 2 / 2 | 3 | 6 | 1/1/0/0 | combat / new |
| `crossfit_class` | CrossFit - class member (HALF TIME) | R | crossfit | crossfit | health | - | 4+2 | 37 (6) | 2 / - / - | - | 6 | 0/0/0/0 | combat / new |
| `hyrox_competitive` | HYROX - competitive (Open / Pro / Doubles) | C | hyrox | crossfit | endurance | 3 / 50 % | 4+1 | 102 (22) | 4 / 4 / 3 | 2 | 6 | 1/1/1/0 | combat / new |
| `ocr_spartan` | Obstacle course racing (Spartan and similar) | C | ocr | crossfit | endurance | 3 / 50 % | 3+1 | 107 (26) | 4 / 4 / 3 | 2 | 6 | 1/1/1/1 | combat / new |
| `gymnastics_artistic` | Artistic gymnastics (women's and men's) | C | gymnastics | field_court | speed_power | 2 / 60 % | 3+0 | 81 (15) | 2 / 2 / 2 | 2 | 3 | 1/1/1/0 | combat / new |
| `climbing` | Rock climbing / bouldering - competitive | C | climbing | field_court | resistance | 5 / 25 % | 3+0 | 82 (9) | 2 / 2 / 2 | 2 | 3 | 1/1/0/0 | combat / new |
| `pickleball_competitive` | Pickleball - competitive / tournament | C | pickleball | field_court | rotational_power | 3 / 50 % | 4+2 | 130 (48.5) | 3 / 2 / 2 | 2 | 4 | 1/1/1/2 | combat / delta |
| `rec_pickleball` | Pickleball - recreational (open play, league, ladder) | R | pickleball | field_court | health | 3 / 50 % | 3+1 | 109 (22) | 3 / - / - | - | 6 | 1/1/0/1 | genpop / new |
| `rec_padel` | Padel - recreational | R | padel | field_court | health | 3 / 50 % | 3+1 | 109 (22) | 3 / - / - | - | 6 | 1/1/0/1 | genpop / new |
| `rec_tennis` | Tennis - recreational (social, club or adult league) | R | tennis | field_court | health | 3 / 50 % | 3+1 | 113 (26) | 3 / - / - | - | 6 | 1/2/0/1 | genpop / new |
| `rec_golf` | Golf - recreational | R | golf | field_court | health | 5 / 25 % | 3+1 | 106 (19) | 3 / - / - | - | 4 | 1/2/0/1 | genpop / new |
| `hyrox_fitness` | HYROX for fitness (first race / Open division) | R | hyrox | crossfit | health | 3 / 50 % | 4+1 | 100 (18) | 4 / - / - | - | 4 | 1/1/0/1 | genpop / new |
| `rec_combat_fitness` | Boxing, kickboxing and martial-arts classes for fitness (incl. BJJ / Muay Thai hobbyists) | R | combat_fitness | combat | health | 5 / 25 % | 3+1 | 112 (24) | 3 / - / - | - | 6 | 1/2/0/1 | v1.1 verification / new |
| `rec_climbing` | Climbing and bouldering gym (recreational) | R | climbing | general | health | 5 / 25 % | 3+1 | 107 (16) | 3 / - / - | - | 4 | 1/1/0/1 | v1.1 verification / new |
| `rec_ocr` | Obstacle course racing for fitness (first Spartan / Tough Mudder) | R | ocr | crossfit | health | 3 / 50 % | 4+1 | 108 (20) | 4 / - / - | - | 4 | 1/1/0/1 | v1.1 verification / new |
| `rec_league` | Rec league (adult recreational team sport - pick the sport) | R | rec_league | field_court | health | 3 / 50 % | 3+1 | 107 (24) | 3 / - / - | - | 6 | 2/1/0/1 | genpop / delta |
| `rec_kickball` | Kickball - adult rec league | R | kickball | field_court | health | 4 / 40 % | 3+1 | 103 (20) | 3 / - / - | - | 6 | 1/1/2/1 | genpop / new |
| `run_fitness` | Running for fitness (first 5K / 10K, run club) | R | distance_running | endurance | health | 1 / 75 % | 2+0 | 61 (10) | 3 / - / - | - | 2 | 1/0/0/0 | genpop / new |
| `hike_ruck` | Hiking and rucking | R | hiking | endurance | health | 5 / 25 % | 3+1 | 101 (14) | 3 / - / - | - | 4 | 1/1/0/1 | genpop / new |
| `cycling_fitness` | Cycling and indoor cycling for fitness | R | cycling | endurance | health | 4 / 40 % | 2+0 | 65 (12) | 3 / - / - | - | 2 | 1/1/0/0 | genpop / new |
| `lap_swim` | Lap swimming for fitness (incl. masters-style workouts) | R | swimming | endurance | health | 5 / 25 % | 2+0 | 65 (12) | 3 / - / - | - | 2 | 1/1/0/0 | genpop / new |
| `ski_snow_prep` | Ski / snowboard season prep | R | ski_snowboard | field_court | health | 4 / 40 % | 3+1 | 103 (20) | 3 / - / - | - | 6 | 1/1/0/1 | genpop / new |
| `surf_paddle` | Surfing and stand-up paddleboarding | R | surfing_paddleboarding | endurance | health | 5 / 25 % | 3+0 | 87.5 (12) | 3 / - / - | - | 4 | 1/1/0/0 | genpop / new |
| `dance_fitness` | Dance and group fitness classes (Zumba, dance cardio, step) | R | dance_fitness | field_court | health | 3 / 50 % | 2+0 | 63 (12) | 3 / - / - | - | 2 | 1/1/0/1 | genpop / new |
| `active_aging_50plus` | Active aging 50-59 (stay athletic) | R | general_athletic | field_court | health | 3 / 50 % | 3+1 | 97 (14) | 3 / - / - | - | 4 | 1/1/0/1 | genpop / new |
| `active_aging_60plus` | Active aging 60+ (stay athletic, older-adult rules) | R | general_athletic | field_court | health | - | 3+1 | 89 (6) | 3 / - / - | - | 0 | 1/1/0/1 | genpop / new |
| `youth_general_athletic` | Youth general athletic development (non-competitive kids and teens) | R | general_athletic | youth | health | 3 / 50 % | 3+0 | 100.5 (28) | 3 / - / - | - | 4 | 1/1/3/1 | genpop / new |

## 7. Weekly set budget per category (off-season build week, mid-block)

Category definitions in `categories` (JSON). Athletic categories (PLYO..TE) never count toward muscle sets (VOL-10). Budgets of 04 v1 records are the coach-derived numbers; new sports are PROPOSED (nearest 04 profile + deltas).

| id | PLYO | JLK | BALL | THROW | COD | SPRINT | TE | BKD | BHD | UKD | UHD | HPUSH | VPUSH | HPULL | VPULL | iQUAD | iHAM | iCHEST | iSIDE | iREAR | iBICEP | iTRICEP | iCALF | iNECK | iGRIP | CORE | FOCUS | total |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| `baseball_position` | 5.2 | 4.9 | 3.9 | 8.7 | 2 | 3 | 8 | 5.5 | 6 | 9 | 5 | 5.1 | 5.1 | 4.6 | 4 |  | 3 |  | 4.6 | 6 | 8.7 | 6.3 | 12 |  |  | 16 |  | 136.6 |
| `boxing` | 8 | 12 | 9 | 38 |  | 3 | 9 | 2.5 | 7 | 14 | 3.5 | 3 | 3 | 3 | 3 | 6 | 9 |  | 6 | 4 | 2 | 2 | 12 |  |  | 17 |  | 176 |
| `crossfit_competitor` |  |  |  |  |  |  |  | 7 | 7 | 5 | 5 | 6 | 6 | 6 | 6 | 3 | 3 |  | 3 | 4 | 1.5 | 1.5 | 6 |  |  | 8 |  | 78 |
| `hybrid` | 6 |  |  |  |  |  | 4.9 | 5.4 | 2.7 | 5.4 | 8.1 | 4.7 | 3.9 | 5.4 | 1.1 |  |  |  |  | 4 |  |  | 9 |  |  | 12.9 | 8.1 | 81.6 |
| `powerlifting_strength` | 3 |  |  |  |  |  |  | 7 | 6 | 3 | 2.5 | 12.6 | 3.4 | 7.4 | 7.6 |  |  |  |  | 4 | 3 |  | 6 |  |  | 8 |  | 73.5 |
| `bodybuilding_aesthetics` |  |  |  |  |  |  |  | 8 | 8 | 4 | 4 | 6 | 10 | 6 | 6 | 4 | 4 |  | 4 | 4 | 4 | 4 | 12 |  |  | 8 | 12 | 108 |
| `fat_loss` |  |  |  |  |  |  |  | 9 | 6.5 | 10.5 | 5 | 9.8 | 3.2 | 6.5 | 7.5 | 3 | 3 |  | 5 | 4 | 6.5 | 2.5 | 6 |  |  | 14.2 |  | 102.2 |
| `basketball` | 17.5 | 5 | 12.5 | 10 | 18 | 4 | 8 | 2 | 2 | 12.5 | 9.5 | 4 | 2 | 6 | 4 |  | 4 |  |  | 4 |  |  | 12 |  |  | 16 | 4 | 157 |
| `volleyball` | 19 | 6.5 | 9 | 8 | 9 | 2 | 8 | 4 | 4 | 8 | 8 | 3 | 3 | 6 | 4 | 4 | 3 |  |  | 6 |  |  | 12 |  |  | 16 | 4 | 146.5 |
| `football_skill` | 14 | 6 | 5.5 | 8 | 18 | 9 | 8 | 2 | 2 | 10 | 10 | 4 | 2 | 4 | 4 |  | 6 |  |  | 4 |  |  | 12 | 4 |  | 16 | 3 | 151.5 |
| `football_big_skill` | 11.5 | 4 | 6.5 | 9 | 12 | 6 | 10 | 3 | 3 | 11.5 | 8 | 6 | 3 | 6 | 4 |  | 4 |  | 3 | 4 |  | 2 | 12 | 4 |  | 16 |  | 148.5 |
| `football_lineman` | 5.5 | 1 |  | 10 | 6 | 4 | 10 | 7 | 7 | 10 | 6.5 | 10 | 4 | 10 | 4 |  | 3 |  | 4 | 4 |  | 4 | 12 | 4 |  | 16 | 4 | 146 |
| `soccer` | 12 | 6 | 9 | 3 | 18 | 9 | 4 | 2 | 2 | 10 | 10 | 2 | 2 | 3 | 2 | 2 | 6 |  |  | 4 |  |  | 12 |  |  | 16 | 2 | 136 |
| `softball` | 7 | 4 |  | 18 | 2 | 3 | 4 | 6 | 6 | 8.5 | 6 | 4 | 3 | 5 | 4 |  | 3 |  | 3 | 6 | 8 | 5 | 12 |  |  | 16 |  | 133.5 |
| `hockey` | 5 | 4 | 5 | 8.5 | 4 | 3 | 8 | 2 | 2 | 10 | 10 | 4 | 2 | 6 | 3 |  | 3 |  | 2 | 4 |  |  | 12 | 3 |  | 16 | 2 | 118.5 |
| `tennis` | 8.5 | 9 |  | 17.5 | 15 | 3 | 4 | 1.5 | 2 | 9.5 | 9.5 | 3 | 2 | 6 | 3 |  | 3 |  |  | 6 |  |  | 12 |  | 4 | 16 | 2 | 136.5 |
| `golf` | 1.5 | 3.5 |  | 17.5 |  |  | 4 | 1.5 | 3 | 9 | 4.5 | 2 | 2 | 6 | 3 |  |  |  |  | 4 |  |  | 9 |  | 2 | 12 |  | 84.5 |
| `track_sprinter` | 14.5 | 9.5 | 3 | 5 |  | 12 | 10 | 4 | 4 | 8 | 8 | 2 | 2 | 3 | 2 |  | 6 |  |  | 4 |  |  | 12 |  |  | 16 | 3 | 128 |
| `distance_runner` | 2.5 | 9 | 4 |  |  | 2 | 2 | 1 | 2.5 | 9.5 | 5 | 2 |  | 3 |  |  | 2 |  |  | 4 |  |  | 9 |  |  | 12 |  | 69.5 |
| `kickboxing_muay_thai` | 4 | 5 | 3 | 24 | 6 | 3 | 6 | 2 | 4 | 11 | 7 | 2 | 3 | 6 | 3 |  | 4 |  |  | 4 |  |  | 12 | 4 |  | 16 |  | 129 |
| `karate_taekwondo` | 3 | 5 | 4 | 20 | 9 | 3 | 4 | 2 | 4 | 11 | 7 | 3 | 2 | 6 | 3 |  | 4 |  |  | 4 |  |  | 12 |  |  | 16 | 3 | 125 |
| `mma` | 10 | 6 | 6.5 | 17.5 | 6 | 3 | 9 | 3.5 | 5 | 9.5 | 6 | 4 | 3 | 7 | 5 |  | 3 |  |  | 4 |  |  | 12 | 4 | 3 | 16 |  | 143 |
| `wrestling` | 4.5 | 2.5 | 3.5 | 17.5 | 6 | 2 | 8 | 4.5 | 6 | 7 | 5.5 | 4 | 3 | 8 | 6 |  |  |  |  | 4 | 2 |  | 12 | 6 | 4 | 16 |  | 132 |
| `bjj_grappling` | 5 | 1 | 8 | 10 |  |  | 4 | 3 | 4.5 | 5.5 | 4 | 3 | 2 | 6 | 6 |  | 2 |  |  | 4 | 2 |  | 9 | 4 | 4 | 12 |  | 99 |
| `general_population` |  | 1 |  | 3 |  |  |  | 3 | 3 | 3 | 3 | 3 | 2 | 3 | 3 |  |  |  | 2 | 4 | 2 | 2 | 9 |  |  | 6 |  | 52 |
| `youth_athlete` | 8.5 | 4 | 6.5 | 6 | 6 | 4 | 4 | 2 | 2 | 2 | 2 | 2 | 2 | 2 | 2 |  |  |  |  | 2 |  |  | 9 |  |  | 12 |  | 78 |
| `weekend_warrior` | 10 | 2 | 4 | 8 | 8 |  | 8 | 5 | 5 | 5 | 5 | 5 | 5 | 10 | 8 | 8 | 8 | 4 | 2 | 2 |  |  | 21 |  |  | 20 | 10 | 163 |
| `football_qb` | 6 | 6 | 5.5 | 10 | 12 | 6 | 8 | 2 | 2 | 10 | 10 | 4 |  | 4 | 4 |  | 6 |  |  | 10 |  |  | 12 | 4 |  | 16 | 3 | 140.5 |
| `football_rb` | 13 | 6 | 5.5 | 8 | 16 | 8 | 8 | 3 | 3 | 10 | 10 | 6 | 2 | 5 | 4 |  | 6 |  |  | 4 |  |  | 12 | 5 |  | 16 | 3 | 153.5 |
| `football_ol` | 5.5 | 1 |  | 10 | 4 | 3 | 10 | 7 | 7 | 10 | 6.5 | 12 | 4 | 10 | 4 |  | 3 |  | 4 | 4 |  | 4 | 12 | 4 |  | 16 | 4 | 145 |
| `football_dl` | 6.5 | 1 | 2 | 10 | 7 | 5 | 10 | 7 | 7 | 10 | 6.5 | 10 | 4 | 10 | 4 |  | 3 |  | 4 | 4 |  | 4 | 12 | 4 |  | 16 | 4 | 151 |
| `football_k_p` | 2 | 6 | 5.5 | 8 | 6 | 4 | 8 | 2 | 2 | 13 | 13 | 4 | 2 | 4 | 4 |  | 6 |  |  | 4 |  |  | 12 | 4 |  | 16 | 3 | 128.5 |
| `flag_football` | 14 | 6 | 5.5 | 8 | 18 | 9 | 8 | 2 | 2 | 10 | 10 | 3 | 2 | 4 | 4 |  | 6 |  |  | 4 |  |  | 12 | 2 |  | 16 | 3 | 148.5 |
| `rec_flag_football` | 12 | 2.5 | 3 | 6.5 | 10 | 3 | 8 | 3.5 | 3.5 | 4.5 | 4.5 | 4 | 4 | 4 | 4 | 4 | 4 |  | 4 | 4 |  |  | 12 |  |  | 16 | 8 | 129 |
| `basketball_guard` | 15.5 | 5 | 12.5 | 10 | 20 | 6 | 8 | 2 | 2 | 12.5 | 9.5 | 4 | 2 | 6 | 4 |  | 4 |  |  | 4 |  |  | 12 |  |  | 16 | 4 | 159 |
| `basketball_big` | 19.5 | 5 | 12.5 | 10 | 12 | 2 | 8 | 4 | 4 | 12.5 | 9.5 | 6 | 2 | 6 | 4 |  | 4 |  |  | 4 |  |  | 12 |  |  | 16 | 4 | 157 |
| `rec_basketball` | 11 | 2 | 5 | 8 | 10 |  | 8 | 3.5 | 3.5 | 4.5 | 4.5 | 4 | 4 | 4 | 4 | 4 | 4 |  | 4 | 4 |  |  | 12 |  |  | 16 | 8 | 128 |
| `baseball_pitcher` | 5.2 | 4.9 | 3.9 | 4.7 |  | 1 | 8 | 5.5 | 6 | 9 | 5 | 5.1 | 2.1 | 4.6 | 3 |  | 3 |  | 4.6 | 9 | 8.7 | 6.3 | 12 |  | 3 | 16 |  | 130.6 |
| `baseball_catcher` | 5.2 | 4.9 | 3.9 | 8.7 | 2 | 3 | 8 | 2.5 | 6 | 9 | 8 | 5.1 | 5.1 | 4.6 | 4 |  | 3 |  | 4.6 | 9 | 8.7 | 6.3 | 12 |  |  | 16 |  | 139.6 |
| `baseball_infield` | 5.2 | 4.9 | 3.9 | 8.7 | 6 | 3 | 8 | 5.5 | 6 | 9 | 5 | 5.1 | 5.1 | 4.6 | 4 |  | 3 |  | 4.6 | 6 | 8.7 | 6.3 | 12 |  |  | 16 |  | 140.6 |
| `baseball_outfield` | 5.2 | 4.9 | 3.9 | 8.7 | 2 | 6 | 8 | 5.5 | 6 | 9 | 5 | 5.1 | 5.1 | 4.6 | 4 |  | 4 |  | 4.6 | 6 | 8.7 | 6.3 | 12 |  |  | 16 |  | 140.6 |
| `softball_pitcher` | 7 | 4 |  | 15 | 2 | 3 | 4 | 6 | 6 | 8.5 | 6 | 4 | 3 | 5 | 4 |  | 3 |  | 3 | 9 | 10 | 5 | 12 |  | 3 | 16 |  | 138.5 |
| `rec_softball` | 8 | 1.5 | 2.5 | 12 | 4 | 2 | 8 | 3.5 | 3.5 | 4.5 | 4.5 | 4 | 4 | 4 | 4 | 4 | 5 |  | 4 | 6 |  |  | 12 |  |  | 16 | 8 | 125 |
| `soccer_gk` | 12 | 6 | 9 | 7 | 12 | 3 | 4 | 2 | 2 | 10 | 10 | 2 | 3 | 3 | 2 | 2 | 6 |  |  | 7 |  |  | 12 |  |  | 16 | 2 | 132 |
| `soccer_defender` | 12 | 6 | 9 | 3 | 16 | 8 | 4 | 3 | 3 | 10 | 10 | 3 | 2 | 4 | 2 | 2 | 6 |  |  | 4 |  |  | 12 | 2 |  | 16 | 2 | 139 |
| `soccer_forward` | 13 | 6 | 10 | 3 | 18 | 11 | 4 | 2 | 2 | 10 | 10 | 2 | 2 | 3 | 2 | 2 | 7 |  |  | 4 |  |  | 12 |  |  | 16 | 2 | 141 |
| `rec_soccer` | 12 | 2.5 | 3 | 6.5 | 10 | 3 | 8 | 3.5 | 3.5 | 4.5 | 4.5 | 4 | 4 | 4 | 4 | 4 | 5 |  | 4 | 4 |  |  | 12 |  |  | 16 | 8 | 130 |
| `hockey_defense` | 5 | 4 | 5 | 8.5 | 4 | 2 | 8 | 3 | 3 | 10 | 10 | 5 | 2 | 7 | 3 |  | 3 |  | 2 | 4 |  |  | 12 | 4 |  | 16 | 2 | 122.5 |
| `hockey_goalie` |  | 4 | 5 | 4.5 | 6 |  | 8 | 2 | 2 | 10 | 10 | 4 | 2 | 6 | 3 |  | 3 |  | 2 | 4 |  |  | 12 | 3 |  | 16 | 2 | 108.5 |
| `rec_hockey` | 8 | 1.5 | 5 | 9.5 | 4 |  | 8 | 3.5 | 3.5 | 4.5 | 4.5 | 4 | 4 | 4 | 4 | 4 | 4 |  | 4 | 4 |  |  | 12 |  |  | 16 | 8 | 120 |
| `volleyball_middle` | 21 | 6.5 | 9 | 8 | 7 | 1 | 8 | 4 | 4 | 8 | 8 | 3 | 3 | 6 | 4 | 4 | 3 |  |  | 6 |  |  | 12 |  |  | 16 | 4 | 145.5 |
| `volleyball_setter` | 15 | 9.5 | 9 | 6 | 9 | 2 | 8 | 4 | 4 | 8 | 8 | 3 | 3 | 6 | 4 | 4 | 3 |  |  | 6 |  |  | 12 |  |  | 16 | 4 | 143.5 |
| `volleyball_libero` | 3 | 6.5 | 9 | 4 | 15 | 4 | 8 | 4 | 4 | 8 | 8 | 3 | 3 | 6 | 4 | 4 | 3 |  |  | 6 |  |  | 12 |  |  | 16 | 4 | 134.5 |
| `volleyball_beach` | 15 | 5 | 10 | 10 | 12 | 3 | 8 | 4 | 4 | 9 | 8 | 3 | 3 | 6 | 4 | 4 | 3 |  |  | 6 |  |  | 12 |  |  | 16 | 4 | 149 |
| `rec_volleyball` | 12 | 2 | 6 | 8 | 6 |  | 8 | 3.5 | 3.5 | 4.5 | 4.5 | 4 | 4 | 4 | 4 | 4 | 4 |  | 4 | 6 |  |  | 12 |  |  | 16 | 8 | 128 |
| `lacrosse_m_attack` | 14 | 7 | 6 | 9 | 20 | 7 | 8 | 2 | 2 | 10 | 10 | 4 | 2 | 5 | 3 | 2 | 6 |  |  | 4 |  |  | 12 | 3 |  | 16 | 2 | 154 |
| `lacrosse_m_midfield` | 14 | 7 | 6 | 8 | 18 | 9 | 8 | 2 | 2 | 10 | 10 | 4 | 2 | 5 | 3 | 2 | 6 |  |  | 4 |  |  | 12 | 3 |  | 16 | 2 | 153 |
| `lacrosse_m_defense` | 14 | 8 | 7 | 7 | 16 | 6 | 10 | 3 | 3 | 10 | 9 | 6 | 2 | 6 | 4 |  | 5 |  |  | 4 |  |  | 12 | 4 |  | 16 | 2 | 154 |
| `lacrosse_m_goalie` | 8 | 6 | 6 | 8 | 8 | 2 | 8 | 3 | 3 | 9 | 8 | 4 | 2 | 5 | 4 |  | 3 |  |  | 4 |  |  | 12 | 2 | 2 | 16 | 2 | 125 |
| `lacrosse_w_attack` | 14 | 7 | 6 | 9 | 20 | 8 | 8 | 2 | 2 | 10 | 10 | 3 | 2 | 5 | 3 | 2 | 6 |  |  | 4 |  |  | 12 | 2 |  | 16 | 2 | 153 |
| `lacrosse_w_midfield` | 14 | 7 | 6 | 8 | 18 | 10 | 8 | 2 | 2 | 10 | 10 | 3 | 2 | 5 | 3 | 2 | 6 |  |  | 4 |  |  | 12 | 2 |  | 16 | 2 | 152 |
| `lacrosse_w_defense` | 13 | 7 | 6 | 7 | 18 | 7 | 8 | 2 | 2 | 10 | 9 | 4 | 2 | 6 | 4 |  | 5 |  |  | 4 |  |  | 12 | 2 |  | 16 | 2 | 146 |
| `lacrosse_w_goalie` | 8 | 6 | 6 | 8 | 8 | 2 | 8 | 3 | 3 | 9 | 8 | 4 | 2 | 5 | 4 |  | 3 |  |  | 4 |  |  | 12 | 2 | 2 | 16 | 2 | 125 |
| `field_hockey_field` | 12 | 6 | 6 | 6 | 16 | 8 | 6 | 2 | 2 | 10 | 12 | 2 | 2 | 4 | 3 | 2 | 6 |  |  | 4 |  |  | 12 | 2 |  | 16 | 2 | 141 |
| `field_hockey_gk` | 8 | 4 | 6 | 6 | 8 | 2 | 6 | 3 | 3 | 11 | 8 | 4 | 2 | 5 | 4 |  | 3 |  |  | 4 |  |  | 12 |  | 2 | 16 | 2 | 119 |
| `rugby_forwards` | 5 | 2 | 2 | 8 | 8 | 6 | 10 | 7 | 7 | 10 | 6.5 | 10 | 6 | 10 | 4 |  | 4 |  | 2 | 4 |  | 2 | 12 | 6 | 2 | 16 | 2 | 151.5 |
| `rugby_backs` | 11.5 | 4 | 6.5 | 9 | 14 | 8 | 10 | 3 | 3 | 11.5 | 8 | 6 | 3 | 6 | 4 |  | 4 |  | 3 | 4 |  | 2 | 12 | 4 |  | 16 |  | 152.5 |
| `rugby_sevens` | 13.5 | 4 | 4.5 | 8 | 16 | 11 | 10 | 3 | 3 | 11.5 | 8 | 6 | 3 | 6 | 4 |  | 4 |  | 3 | 4 |  | 2 | 12 | 4 |  | 16 |  | 156.5 |
| `cheer_base_spot` | 5 | 4 | 5 | 8 | 2 |  | 12 | 6 | 5 | 6 | 5 | 4 | 8 | 6 | 4 |  |  |  | 3 | 4 |  | 3 | 12 | 2 | 2 | 16 | 2 | 124 |
| `cheer_flyer_tumbler` | 12 | 8 | 6 | 7 | 4 | 2 | 6 | 2 | 2 | 8 | 8 | 4 | 4 | 5 | 5 |  | 3 |  |  | 4 |  |  | 12 | 2 | 2 | 16 | 2 | 124 |
| `ultimate_cutter` | 12 | 6 | 6 | 6 | 18 | 10 | 6 | 2 | 2 | 10 | 10 | 2 | 2 | 3 | 2 | 2 | 6 |  |  | 4 |  |  | 12 |  |  | 16 | 2 | 139 |
| `ultimate_handler` | 10 | 6 | 8 | 8 | 18 | 7 | 6 | 2 | 2 | 10 | 10 | 3 | 2 | 4 | 2 | 2 | 6 |  |  | 5 |  |  | 12 |  |  | 16 | 2 | 141 |
| `rec_ultimate` | 12 | 2.5 | 3 | 6.5 | 10 | 3 | 8 | 3.5 | 3.5 | 4.5 | 4.5 | 4 | 4 | 4 | 4 | 4 | 4 |  | 4 | 4 |  |  | 12 |  |  | 16 | 8 | 129 |
| `swimming_sprint` | 1.5 | 3 | 7.5 | 5 |  |  | 6 | 6 | 4 | 5 | 4 | 4 | 2 | 6 | 7 |  | 3 |  |  | 6 |  | 3 | 9 |  |  | 12 | 3 | 97 |
| `swimming_middle` | 1 | 3 | 7 | 4 |  |  | 6 | 5 | 4 | 5 | 4 | 4 | 2 | 7 | 7 |  | 3 |  |  | 6 |  | 2 | 9 |  |  | 12 | 3 | 94 |
| `swimming_distance` | 0.5 | 2 | 4.5 | 3 |  |  | 3 | 3 | 3 | 4 | 3 | 3 | 1 | 6 | 5 |  | 2 |  |  | 6 |  |  | 9 |  |  | 12 | 3 | 73 |
| `diving` | 6 | 4 | 8 | 6 |  |  | 5 | 6 | 4 | 5 | 3 | 3 | 4 | 4 | 5 | 2 | 3 |  |  | 4 |  |  | 9 |  | 2 | 12 | 4 | 99 |
| `water_polo_field` | 2 | 2 | 6 | 6 |  |  | 6 | 5 | 5 | 5 | 3 | 5 | 2 | 7 | 6 |  | 3 |  |  | 6 |  |  | 9 |  | 2 | 12 | 4 | 96 |
| `water_polo_center` | 2 | 2 | 6 | 6 |  |  | 6 | 7 | 7 | 5 | 3 | 6 | 2 | 8 | 6 |  | 3 |  |  | 6 |  |  | 9 |  | 2 | 12 | 4 | 102 |
| `water_polo_goalkeeper` | 2 | 2 | 9 | 3 |  |  | 6 | 5 | 5 | 6 | 3 | 5 | 3 | 7 | 6 |  | 3 |  |  | 6 |  |  | 9 |  | 2 | 12 | 4 | 98 |
| `track_400` | 12.5 | 8 | 3 | 5 |  | 12 | 10 | 4 | 4 | 8 | 8 | 2 | 2 | 3 | 2 |  | 6 |  |  | 4 |  |  | 12 |  |  | 16 | 3 | 124.5 |
| `track_hurdles` | 14.5 | 9.5 | 3 | 5 |  | 12 | 10 | 4 | 4 | 8 | 8 | 2 | 2 | 3 | 2 |  | 6 |  |  | 4 |  |  | 12 |  |  | 16 | 5 | 130 |
| `track_jumper` | 20.5 | 9.5 | 3 | 5 |  | 8 | 10 | 4 | 4 | 8 | 8 | 2 | 2 | 3 | 2 |  | 6 |  |  | 4 |  |  | 12 |  |  | 16 | 3 | 130 |
| `track_high_jump` | 14 | 6 | 7 | 6 |  | 6 | 10 | 4 | 4 | 9 | 7 | 2 | 2 | 3 | 2 |  | 6 |  |  | 4 |  |  | 12 |  |  | 16 | 3 | 123 |
| `track_pole_vault` | 10 | 6 | 5 | 6 |  | 10 | 8 | 4 | 4 | 7 | 6 | 4 | 4 | 5 | 7 |  | 5 |  |  | 4 |  | 2 | 12 |  | 2 | 16 | 3 | 130 |
| `track_thrower` | 6 | 6 | 3 | 15 |  | 4 | 10 | 8 | 8 | 8 | 8 | 5 | 2 | 3 | 2 |  | 6 |  |  | 4 |  |  | 12 |  |  | 16 | 3 | 129 |
| `track_javelin` | 8 | 6 | 4 | 10 |  | 6 | 8 | 6 | 6 | 6 | 6 | 4 | 1 | 5 | 3 |  | 4 |  |  | 6 |  |  | 12 |  | 3 | 16 | 3 | 123 |
| `track_middle` | 4 | 10 | 4 |  |  | 4 | 3 | 2 | 3 | 9 | 5 | 2 |  | 3 | 2 |  | 3 |  |  | 4 |  |  | 9 |  |  | 12 |  | 79 |
| `cross_country` | 2.5 | 10 | 4 |  |  | 2 | 2 | 1 | 2.5 | 9.5 | 5 | 2 |  | 3 |  |  | 2 |  |  | 4 |  |  | 9 |  |  | 12 | 2 | 72.5 |
| `triathlon` | 2 | 6 | 3 |  |  |  | 2 | 2 | 3 | 6 | 4 | 2 |  | 4 | 4 |  | 2 |  |  | 4 |  |  | 6 |  |  | 8 | 2 | 60 |
| `cycling_endurance` | 2 | 4 | 5 | 4 |  |  | 3 | 6 | 4 | 6 | 3 | 3 | 1 | 4 | 3 |  | 2 |  |  | 4 |  |  | 9 | 2 |  | 12 | 2 | 79 |
| `cycling_sprint` | 5 | 2 | 7 | 3 |  |  | 12 | 12 | 8 | 4 | 3 | 4 | 2 | 6 | 4 | 4 | 4 |  |  | 4 |  |  | 12 |  |  | 16 |  | 112 |
| `rowing` | 1 | 2 | 5 | 4 |  |  | 6 | 6 | 6 | 4 | 4 | 4 | 2 | 8 | 4 |  | 2 |  |  | 4 |  |  | 9 |  |  | 12 | 2 | 85 |
| `ski_alpine` | 6 | 4 | 9 | 6 | 4 |  | 8 | 8 | 5 | 8 | 4 | 3 | 2 | 4 | 3 | 4 | 6 |  |  | 4 |  |  | 9 |  |  | 16 | 2 | 115 |
| `ski_freestyle` | 10 | 5 | 9 | 6 | 2 |  | 8 | 6 | 4 | 7 | 4 | 4 | 3 | 4 | 4 | 3 | 6 |  |  | 4 |  |  | 9 |  | 2 | 16 | 2 | 118 |
| `rec_triathlon` | 6 | 7 | 2 | 2 |  |  | 8 | 3.5 | 3.5 | 4.5 | 4.5 | 4 | 4 | 5 | 5 | 4 | 4 |  | 4 | 5 |  |  | 12 |  |  | 16 | 8 | 112 |
| `rec_rowing` | 2.5 | 1 | 5 | 5.5 |  |  | 8 | 3.5 | 4.5 | 4.5 | 4.5 | 4 | 4 | 6 | 4 | 4 | 4 |  | 4 | 4 |  |  | 12 |  |  | 16 | 8 | 109 |
| `judo` | 4 | 2.5 | 4 | 15 | 4 | 2 | 8 | 4.5 | 6 | 6.5 | 5.5 | 3 | 2 | 8 | 7 |  | 3 |  |  | 4 | 2 | 2 | 12 | 4 | 5 | 16 |  | 130 |
| `taekwondo` | 3 | 6 | 5 | 18 | 9 | 3 | 4 | 2 | 4 | 11 | 7 | 3 | 2 | 6 | 3 |  | 5 |  |  | 4 |  |  | 12 |  |  | 16 | 3 | 126 |
| `weightlifting` | 1 |  | 3 |  |  |  | 32 | 12 | 4 | 3 | 2 | 2 | 6 | 4 | 4 |  | 2 |  |  | 4 |  |  | 12 |  |  | 16 |  | 107 |
| `strongman` | 1.5 |  | 2.5 | 2 |  |  | 6 | 8 | 8 | 4 | 3 | 6 | 10 | 8 | 5 |  | 3 |  | 3 | 4 | 4 | 4 | 6 |  | 8 | 12 |  | 108 |
| `crossfit_class` |  |  |  |  |  |  | 6 | 3 | 3 |  |  |  | 3 |  |  |  |  |  |  | 4 |  |  | 6 |  |  | 12 |  | 37 |
| `hyrox_competitive` | 3 | 4 | 3 | 4 |  | 2 | 6 | 6 | 5 | 8 | 4 | 4 | 4 | 8 | 4 | 3 | 3 |  |  | 4 |  |  | 9 |  | 6 | 12 |  | 102 |
| `ocr_spartan` | 4 | 3 | 3 | 4 | 4 | 2 | 6 | 5 | 5 | 8 | 5 | 4 | 3 | 6 | 8 |  | 2 |  |  | 4 | 2 |  | 9 |  | 8 | 12 |  | 107 |
| `gymnastics_artistic` | 3 | 3 | 2 | 2 |  | 2 | 3 | 3 | 3 | 4 | 3 | 4 | 4 | 4 | 6 |  | 2 |  |  | 4 | 2 | 2 | 9 |  | 2 | 12 | 2 | 81 |
| `climbing` | 1.5 |  | 2 | 2.5 |  |  | 3 | 3 | 4 | 4 | 2 | 4 | 4 | 6 | 8 |  | 2 |  |  | 6 |  | 2 | 6 |  | 8 | 12 | 2 | 82 |
| `pickleball_competitive` | 6 | 9 |  | 15 | 13 | 1.5 | 4 | 1.5 | 2 | 9.5 | 9.5 | 3 | 2 | 6 | 3 | 2 | 3 |  |  | 6 |  |  | 12 |  | 4 | 16 | 2 | 130 |
| `rec_pickleball` | 2 | 4 |  | 6 | 4 |  | 6 | 2.5 | 5 | 5 | 4.5 | 5 | 2.5 | 5 | 4.5 | 2 | 4 | 4 | 3 | 5 |  |  | 14 |  | 2 | 14 | 5 | 109 |
| `rec_padel` | 2 | 4 |  | 6 | 4 |  | 6 | 2.5 | 5 | 5 | 4.5 | 5 | 2.5 | 5 | 4.5 | 2 | 4 | 4 | 3 | 5 |  |  | 14 |  | 2 | 14 | 5 | 109 |
| `rec_tennis` | 3 | 5 |  | 8 | 4 |  | 6 | 2.5 | 5 | 5 | 4.5 | 5 | 2.5 | 5 | 4.5 | 2 | 4 | 4 | 3 | 5 |  |  | 14 |  | 2 | 14 | 5 | 113 |
| `rec_golf` | 1 | 2 | 2 | 8 | 2 |  | 4 | 2.5 | 5 | 5 | 4.5 | 5 | 2.5 | 5 | 4.5 | 2 | 4 | 4 | 3 | 5 |  |  | 14 |  | 2 | 14 | 5 | 106 |
| `hyrox_fitness` | 2 | 4 | 4 | 2 | 2 |  | 4 | 2.5 | 2.5 | 5 | 2.5 | 2.5 | 2.5 | 7.5 | 4 | 4 | 4 | 2 | 1 | 1 |  |  | 14 |  | 4 | 18 | 5 | 100 |
| `rec_combat_fitness` | 1.5 | 2.5 | 3 | 9 | 2 |  | 6 | 2.5 | 5 | 5 | 4.5 | 4 | 2.5 | 6 | 4.5 | 2 | 4 | 3 | 3 | 5 |  |  | 14 | 2 | 2 | 14 | 5 | 112 |
| `rec_climbing` | 1 | 1.5 | 3 | 4.5 | 2 |  | 4 | 2.5 | 5 | 5 | 4.5 | 6 | 3.5 | 4 | 3.5 | 2 | 4 | 3 | 3 | 6 |  | 2 | 14 |  | 4 | 14 | 5 | 107 |
| `rec_ocr` | 2 | 4 | 4 | 2 | 4 |  | 4 | 2.5 | 2.5 | 6 | 2.5 | 2.5 | 2.5 | 7.5 | 6 | 4 | 4 | 2 | 1 | 2 |  |  | 14 |  | 6 | 18 | 5 | 108 |
| `rec_league` | 5 | 2 | 3 | 4 | 4 |  | 6 | 2.5 | 5 | 5 | 4.5 | 5 | 2.5 | 5 | 4.5 | 2 | 4 | 4 | 3 | 3 |  |  | 14 |  |  | 14 | 5 | 107 |
| `rec_kickball` | 2 | 2 | 2 | 4 | 2 | 2 | 6 | 2.5 | 5 | 5 | 4.5 | 5 | 2.5 | 5 | 4.5 | 2 | 4 | 4 | 3 | 3 |  |  | 14 |  |  | 14 | 5 | 103 |
| `run_fitness` | 2 | 4 | 2 |  |  |  | 2 | 2.5 | 2.5 | 2.5 | 2.5 | 2.5 | 2.5 | 5 | 4 | 4 | 4 | 2 | 1 | 1 |  |  | 7 |  |  | 8 |  | 61 |
| `hike_ruck` |  | 2 | 4 | 2 | 2 |  | 4 | 2.5 | 5 | 5 | 4.5 | 5 | 2.5 | 5 | 4.5 | 2 | 4 | 4 | 3 | 3 |  |  | 14 |  | 4 | 14 | 5 | 101 |
| `cycling_fitness` | 2 | 2 | 4 | 2 |  |  | 2 | 2.5 | 2.5 | 2.5 | 2.5 | 2.5 | 2.5 | 5 | 4 | 4 | 4 | 2 | 1 | 3 |  |  | 7 |  |  | 8 |  | 65 |
| `lap_swim` | 1 | 1.5 | 3.5 | 4 |  |  | 2 | 2.5 | 2.5 | 2.5 | 2.5 | 2.5 | 2.5 | 5 | 4 | 4 | 4 | 2 | 1 | 3 |  |  | 7 |  |  | 8 |  | 65 |
| `ski_snow_prep` | 2 | 2 | 4 | 2 | 4 |  | 6 | 2.5 | 5 | 5 | 4.5 | 5 | 2.5 | 5 | 4.5 | 2 | 4 | 4 | 3 | 3 |  |  | 14 |  |  | 14 | 5 | 103 |
| `surf_paddle` |  | 2 | 2 | 4 |  |  | 4 | 2.5 | 5 | 5 | 4.5 | 5 | 2.5 | 5 | 4.5 | 2 | 4 | 4 | 3 | 6 |  |  | 10.5 |  |  | 12 |  | 87.5 |
| `dance_fitness` | 2 | 2 | 2 | 2 | 2 |  | 2 | 2.5 | 2.5 | 2.5 | 2.5 | 2.5 | 2.5 | 5 | 4 | 4 | 4 | 2 | 1 | 1 |  |  | 7 |  |  | 8 |  | 63 |
| `active_aging_50plus` | 2 | 2 | 2 | 2 | 2 |  | 4 | 2.5 | 5 | 5 | 4.5 | 5 | 2.5 | 5 | 4.5 | 2 | 4 | 4 | 3 | 3 |  |  | 14 |  |  | 14 | 5 | 97 |
| `active_aging_60plus` | 2 |  |  | 2 | 2 |  |  | 2.5 | 5 | 5 | 4.5 | 5 | 2.5 | 5 | 4.5 | 2 | 4 | 4 | 3 | 3 |  |  | 14 |  |  | 14 | 5 | 89 |
| `youth_general_athletic` | 4 | 4 | 4 | 4 | 4 | 4 | 4 | 2.5 | 5 | 5 | 4.5 | 5 | 2.5 | 5 | 4.5 | 2 | 4 | 4 | 3 | 3 |  |  | 10.5 |  |  | 12 |  | 100.5 |

Per-muscle sets (R2-VOL-05 credits) and the muscles below the floor of 10:

| id | quads | glutes | hamstrings | chest | front_delts | side_delts | rear_delts | lats_upper_back | biceps | triceps | calves | below 10 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| `baseball_position` | 14.5 | 6.4 | 14 | 6.4 | 6.4 | 5.9 | 7.2 | 10.1 | 10.8 | 8.8 | 12 | 6 |
| `boxing` | 22.5 | 6.8 | 19.5 | 3.8 | 3.8 | 6.8 | 4.8 | 7 | 3.5 | 3.5 | 12 | 8 |
| `crossfit_competitor` | 15 | 6 | 15 | 7.5 | 7.5 | 4.5 | 5.5 | 13 | 4.5 | 4.5 | 6 | 8 |
| `hybrid` | 10.8 | 5.4 | 10.8 | 5.7 | 5.1 | 1 | 5.3 | 7.5 | 1.6 | 2.1 | 9 | 9 |
| `powerlifting_strength` | 10 | 4.6 | 8.5 | 13.4 | 6.5 | 0.8 | 5.8 | 16 | 6.8 | 4 | 6 | 8 |
| `bodybuilding_aesthetics` | 16 | 6 | 16 | 8.5 | 11.5 | 6.5 | 5.5 | 13 | 7 | 8 | 12 | 6 |
| `fat_loss` | 22.5 | 7.8 | 14.5 | 10.6 | 5.7 | 5.8 | 5.6 | 15 | 10 | 5.8 | 6 | 6 |
| `basketball` | 14.5 | 6.5 | 15.5 | 4.5 | 3 | 0.5 | 5.5 | 11 | 2.5 | 1.5 | 12 | 7 |
| `volleyball` | 16 | 6 | 15 | 3.8 | 3.8 | 0.8 | 7.5 | 11.5 | 2.5 | 1.5 | 12 | 7 |
| `football_skill` | 12 | 6 | 18 | 4.5 | 3 | 0.5 | 5 | 9 | 2 | 1.5 | 12 | 8 |
| `football_big_skill` | 14.5 | 6.4 | 15 | 6.8 | 4.5 | 3.8 | 5.5 | 11 | 2.5 | 4.2 | 12 | 7 |
| `football_lineman` | 17 | 7.6 | 16.5 | 11 | 6.5 | 5 | 6.5 | 15 | 3.5 | 7.5 | 12 | 6 |
| `soccer` | 14 | 6 | 18 | 2.5 | 2.5 | 0.5 | 4.8 | 6 | 1.2 | 1 | 12 | 8 |
| `softball` | 14.5 | 6.6 | 15 | 4.8 | 4 | 3.8 | 7.2 | 10.5 | 10.2 | 6.8 | 12 | 6 |
| `hockey` | 12 | 6 | 15 | 4.5 | 3 | 2.5 | 5.5 | 10 | 2.2 | 1.5 | 12 | 7 |
| `tennis` | 11 | 5.6 | 14.5 | 3.5 | 2.8 | 0.5 | 7.5 | 10.5 | 2.2 | 1.2 | 12 | 7 |
| `golf` | 10.5 | 4.5 | 7.5 | 2.5 | 2.5 | 0.5 | 5.5 | 10 | 2.2 | 1 | 9 | 9 |
| `track_sprinter` | 12 | 6 | 18 | 2.5 | 2.5 | 0.5 | 4.8 | 6 | 1.2 | 1 | 12 | 8 |
| `distance_runner` | 10.5 | 4.5 | 9.5 | 2 | 0.5 | 0 | 4.8 | 4 | 0.8 | 0.5 | 9 | 10 |
| `kickboxing_muay_thai` | 13 | 6 | 15 | 2.8 | 3.5 | 0.8 | 5.5 | 10 | 2.2 | 1.2 | 12 | 7 |
| `karate_taekwondo` | 13 | 6 | 15 | 3.5 | 2.8 | 0.5 | 5.5 | 10 | 2.2 | 1.2 | 12 | 7 |
| `mma` | 13 | 6 | 14 | 4.8 | 4 | 0.8 | 5.8 | 13 | 3 | 1.8 | 12 | 7 |
| `wrestling` | 11.5 | 5.8 | 11.5 | 4.8 | 4 | 0.8 | 6 | 15 | 5.5 | 1.8 | 12 | 7 |
| `bjj_grappling` | 8.5 | 4.2 | 10.5 | 3.5 | 2.8 | 0.5 | 5.5 | 13 | 5 | 1.2 | 9 | 9 |
| `general_population` | 6 | 3 | 6 | 3.5 | 2.8 | 2.5 | 4.8 | 7 | 3.5 | 3.2 | 9 | 11 |
| `youth_athlete` | 4 | 2 | 4 | 2.5 | 2.5 | 0.5 | 2.5 | 4.5 | 1 | 1 | 9 | 11 |
| `weekend_warrior` | 18 | 5 | 18 | 10.2 | 6.2 | 3.2 | 4.5 | 18.5 | 4.5 | 2.5 | 21 | 6 |
| `football_qb` | 12 | 6 | 18 | 4 | 1 | 0 | 11 | 10.5 | 2 | 1 | 12 | 6 |
| `football_rb` | 13 | 6.5 | 19 | 6.5 | 3.5 | 0.5 | 5.2 | 10 | 2.2 | 2 | 12 | 7 |
| `football_ol` | 17 | 7.6 | 16.5 | 13 | 7 | 5 | 6.5 | 15 | 3.5 | 8 | 12 | 6 |
| `football_dl` | 17 | 7.6 | 16.5 | 11 | 6.5 | 5 | 6.5 | 15 | 3.5 | 7.5 | 12 | 6 |
| `football_k_p` | 15 | 7.5 | 21 | 4.5 | 3 | 0.5 | 5 | 9 | 2 | 1.5 | 12 | 8 |
| `flag_football` | 12 | 6 | 18 | 3.5 | 2.8 | 0.5 | 5 | 9 | 2 | 1.2 | 12 | 8 |
| `rec_flag_football` | 12 | 4 | 12 | 5 | 5 | 5 | 5 | 9 | 2 | 2 | 12 | 8 |
| `basketball_guard` | 14.5 | 6.5 | 15.5 | 4.5 | 3 | 0.5 | 5.5 | 11 | 2.5 | 1.5 | 12 | 7 |
| `basketball_big` | 16.5 | 7.5 | 17.5 | 6.5 | 3.5 | 0.5 | 5.5 | 11 | 2.5 | 2 | 12 | 7 |
| `rec_basketball` | 12 | 4 | 12 | 5 | 5 | 5 | 5 | 9 | 2 | 2 | 12 | 8 |
| `baseball_pitcher` | 14.5 | 6.4 | 14 | 5.6 | 3.4 | 5.1 | 10.2 | 9.8 | 10.6 | 8.1 | 12 | 6 |
| `baseball_catcher` | 11.5 | 6.4 | 17 | 6.4 | 6.4 | 5.9 | 10.2 | 10.8 | 10.8 | 8.8 | 12 | 5 |
| `baseball_infield` | 14.5 | 6.4 | 14 | 6.4 | 6.4 | 5.9 | 7.2 | 10.1 | 10.8 | 8.8 | 12 | 6 |
| `baseball_outfield` | 14.5 | 6.4 | 15 | 6.4 | 6.4 | 5.9 | 7.2 | 10.1 | 10.8 | 8.8 | 12 | 6 |
| `softball_pitcher` | 14.5 | 6.6 | 15 | 4.8 | 4 | 3.8 | 10.2 | 11.2 | 12.2 | 6.8 | 12 | 5 |
| `rec_softball` | 12 | 4 | 13 | 5 | 5 | 5 | 7 | 9.5 | 2 | 2 | 12 | 8 |
| `soccer_gk` | 14 | 6 | 18 | 2.8 | 3.5 | 0.8 | 7.8 | 6.8 | 1.2 | 1.2 | 12 | 8 |
| `soccer_defender` | 15 | 6.5 | 19 | 3.5 | 2.8 | 0.5 | 5 | 7 | 1.5 | 1.2 | 12 | 8 |
| `soccer_forward` | 14 | 6 | 19 | 2.5 | 2.5 | 0.5 | 4.8 | 6 | 1.2 | 1 | 12 | 8 |
| `rec_soccer` | 12 | 4 | 13 | 5 | 5 | 5 | 5 | 9 | 2 | 2 | 12 | 8 |
| `hockey_defense` | 13 | 6.5 | 16 | 5.5 | 3.2 | 2.5 | 5.8 | 11 | 2.5 | 1.8 | 12 | 7 |
| `hockey_goalie` | 12 | 6 | 15 | 4.5 | 3 | 2.5 | 5.5 | 10 | 2.2 | 1.5 | 12 | 7 |
| `rec_hockey` | 12 | 4 | 12 | 5 | 5 | 5 | 5 | 9 | 2 | 2 | 12 | 8 |
| `volleyball_middle` | 16 | 6 | 15 | 3.8 | 3.8 | 0.8 | 7.5 | 11.5 | 2.5 | 1.5 | 12 | 7 |
| `volleyball_setter` | 16 | 6 | 15 | 3.8 | 3.8 | 0.8 | 7.5 | 11.5 | 2.5 | 1.5 | 12 | 7 |
| `volleyball_libero` | 16 | 6 | 15 | 3.8 | 3.8 | 0.8 | 7.5 | 11.5 | 2.5 | 1.5 | 12 | 7 |
| `volleyball_beach` | 17 | 6.2 | 15 | 3.8 | 3.8 | 0.8 | 7.5 | 11.5 | 2.5 | 1.5 | 12 | 7 |
| `rec_volleyball` | 12 | 4 | 12 | 5 | 5 | 5 | 7 | 9.5 | 2 | 2 | 12 | 8 |
| `lacrosse_m_attack` | 14 | 6 | 18 | 4.5 | 3 | 0.5 | 5.2 | 9 | 2 | 1.5 | 12 | 8 |
| `lacrosse_m_midfield` | 14 | 6 | 18 | 4.5 | 3 | 0.5 | 5.2 | 9 | 2 | 1.5 | 12 | 8 |
| `lacrosse_m_defense` | 13 | 6.2 | 17 | 6.5 | 3.5 | 0.5 | 5.5 | 11 | 2.5 | 2 | 12 | 7 |
| `lacrosse_m_goalie` | 12 | 5.8 | 14 | 4.5 | 3 | 0.5 | 5.2 | 10 | 2.2 | 1.5 | 12 | 7 |
| `lacrosse_w_attack` | 14 | 6 | 18 | 3.5 | 2.8 | 0.5 | 5.2 | 9 | 2 | 1.2 | 12 | 8 |
| `lacrosse_w_midfield` | 14 | 6 | 18 | 3.5 | 2.8 | 0.5 | 5.2 | 9 | 2 | 1.2 | 12 | 8 |
| `lacrosse_w_defense` | 12 | 5.8 | 16 | 4.5 | 3 | 0.5 | 5.5 | 11 | 2.5 | 1.5 | 12 | 7 |
| `lacrosse_w_goalie` | 12 | 5.8 | 14 | 4.5 | 3 | 0.5 | 5.2 | 10 | 2.2 | 1.5 | 12 | 7 |
| `field_hockey_field` | 14 | 6.5 | 20 | 2.5 | 2.5 | 0.5 | 5 | 8 | 1.8 | 1 | 12 | 8 |
| `field_hockey_gk` | 14 | 6.2 | 14 | 4.5 | 3 | 0.5 | 5.2 | 10 | 2.2 | 1.5 | 12 | 7 |
| `rugby_forwards` | 17 | 7.6 | 17.5 | 11.5 | 8.5 | 3.5 | 6.5 | 15 | 3.5 | 6 | 12 | 6 |
| `rugby_backs` | 14.5 | 6.4 | 15 | 6.8 | 4.5 | 3.8 | 5.5 | 11 | 2.5 | 4.2 | 12 | 7 |
| `rugby_sevens` | 14.5 | 6.4 | 15 | 6.8 | 4.5 | 3.8 | 5.5 | 11 | 2.5 | 4.2 | 12 | 7 |
| `cheer_base_spot` | 12 | 5.5 | 10 | 6 | 9 | 5 | 5.5 | 11 | 2.5 | 6 | 12 | 7 |
| `cheer_flyer_tumbler` | 10 | 5 | 13 | 5 | 5 | 1 | 5.2 | 11 | 2.5 | 2 | 12 | 7 |
| `ultimate_cutter` | 14 | 6 | 18 | 2.5 | 2.5 | 0.5 | 4.8 | 6 | 1.2 | 1 | 12 | 8 |
| `ultimate_handler` | 14 | 6 | 18 | 3.5 | 2.8 | 0.5 | 6 | 7.2 | 1.5 | 1.2 | 12 | 8 |
| `rec_ultimate` | 12 | 4 | 12 | 5 | 5 | 5 | 5 | 9 | 2 | 2 | 12 | 8 |
| `swimming_sprint` | 11 | 4.8 | 11 | 4.5 | 3 | 0.5 | 7.5 | 14.5 | 3.2 | 4.5 | 9 | 8 |
| `swimming_middle` | 10 | 4.5 | 11 | 4.5 | 3 | 0.5 | 7.8 | 15.5 | 3.5 | 3.5 | 9 | 8 |
| `swimming_distance` | 7 | 3.2 | 8 | 3.2 | 1.8 | 0.2 | 7.5 | 12.5 | 2.8 | 1 | 9 | 10 |
| `diving` | 13 | 4.5 | 10 | 4 | 4.8 | 1 | 5 | 10 | 2.2 | 1.8 | 9 | 8 |
| `water_polo_field` | 10 | 4.5 | 11 | 5.5 | 3.2 | 0.5 | 7.8 | 14.5 | 3.2 | 1.8 | 9 | 8 |
| `water_polo_center` | 12 | 5.5 | 13 | 6.5 | 3.5 | 0.5 | 8 | 15.5 | 3.5 | 2 | 9 | 8 |
| `water_polo_goalkeeper` | 11 | 4.8 | 11 | 5.8 | 4.2 | 0.8 | 7.8 | 14.5 | 3.2 | 2 | 9 | 8 |
| `track_400` | 12 | 6 | 18 | 2.5 | 2.5 | 0.5 | 4.8 | 6 | 1.2 | 1 | 12 | 8 |
| `track_hurdles` | 12 | 6 | 18 | 2.5 | 2.5 | 0.5 | 4.8 | 6 | 1.2 | 1 | 12 | 8 |
| `track_jumper` | 12 | 6 | 18 | 2.5 | 2.5 | 0.5 | 4.8 | 6 | 1.2 | 1 | 12 | 8 |
| `track_high_jump` | 13 | 6 | 17 | 2.5 | 2.5 | 0.5 | 4.8 | 6 | 1.2 | 1 | 12 | 8 |
| `track_pole_vault` | 11 | 5.2 | 15 | 5 | 5 | 1 | 5.2 | 13 | 3 | 4 | 12 | 7 |
| `track_thrower` | 16 | 8 | 22 | 5.5 | 3.2 | 0.5 | 4.8 | 6 | 1.2 | 1.8 | 12 | 8 |
| `track_javelin` | 12 | 6 | 16 | 4.2 | 2 | 0.2 | 7.2 | 9.5 | 2 | 1.2 | 12 | 8 |
| `track_middle` | 11 | 4.8 | 11 | 2 | 0.5 | 0 | 4.8 | 6 | 1.2 | 0.5 | 9 | 9 |
| `cross_country` | 10.5 | 4.5 | 9.5 | 2 | 0.5 | 0 | 4.8 | 4 | 0.8 | 0.5 | 9 | 10 |
| `triathlon` | 8 | 3.8 | 9 | 2 | 0.5 | 0 | 5 | 9 | 2 | 0.5 | 6 | 11 |
| `cycling_endurance` | 12 | 4.8 | 9 | 3.2 | 1.8 | 0.2 | 5 | 8 | 1.8 | 1 | 9 | 10 |
| `cycling_sprint` | 20 | 6.8 | 15 | 4.5 | 3 | 0.5 | 5.5 | 11 | 2.5 | 1.5 | 12 | 7 |
| `rowing` | 10 | 5 | 12 | 4.5 | 3 | 0.5 | 6 | 13 | 3 | 1.5 | 9 | 8 |
| `ski_alpine` | 20 | 6.2 | 15 | 3.5 | 2.8 | 0.5 | 5 | 8 | 1.8 | 1.2 | 9 | 9 |
| `ski_freestyle` | 16 | 5.2 | 14 | 4.8 | 4 | 0.8 | 5 | 9 | 2 | 1.8 | 9 | 9 |
| `rec_triathlon` | 12 | 4 | 12 | 5 | 5 | 5 | 6.2 | 11.2 | 2.5 | 2 | 12 | 7 |
| `rec_rowing` | 12 | 4.2 | 13 | 5 | 5 | 5 | 5.5 | 11 | 2.5 | 2 | 12 | 7 |
| `judo` | 11 | 5.6 | 14.5 | 3.5 | 2.8 | 0.5 | 6 | 16 | 5.8 | 3.2 | 12 | 7 |
| `taekwondo` | 13 | 6 | 16 | 3.5 | 2.8 | 0.5 | 5.5 | 10 | 2.2 | 1.2 | 12 | 7 |
| `weightlifting` | 15 | 5.2 | 8 | 3.5 | 6.5 | 1.5 | 5 | 9 | 2 | 2 | 12 | 9 |
| `strongman` | 12 | 5.8 | 14 | 8.5 | 11.5 | 5.5 | 6 | 14 | 7.2 | 8 | 6 | 7 |
| `crossfit_class` | 3 | 1.5 | 3 | 0.8 | 3 | 0.8 | 4 | 1 | 0 | 0.8 | 6 | 11 |
| `hyrox_competitive` | 17 | 5.8 | 12 | 5 | 5 | 1 | 6 | 13 | 3 | 2 | 9 | 8 |
| `ocr_spartan` | 13 | 5.8 | 12 | 4.8 | 4 | 0.8 | 5.5 | 15 | 5.5 | 1.8 | 9 | 8 |
| `gymnastics_artistic` | 7 | 3.2 | 8 | 5 | 5 | 1 | 5 | 11 | 4.5 | 4 | 9 | 10 |
| `climbing` | 7 | 3.2 | 8 | 5 | 5 | 1 | 7.5 | 15.5 | 3.5 | 4 | 6 | 10 |
| `pickleball_competitive` | 13 | 5.6 | 14.5 | 3.5 | 2.8 | 0.5 | 7.5 | 10.5 | 2.2 | 1.2 | 12 | 7 |
| `rec_pickleball` | 9.5 | 4.2 | 13.5 | 9.6 | 3.8 | 3.6 | 6.2 | 10.8 | 2.4 | 1.9 | 14 | 8 |
| `rec_padel` | 9.5 | 4.2 | 13.5 | 9.6 | 3.8 | 3.6 | 6.2 | 10.8 | 2.4 | 1.9 | 14 | 8 |
| `rec_tennis` | 9.5 | 4.2 | 13.5 | 9.6 | 3.8 | 3.6 | 6.2 | 10.8 | 2.4 | 1.9 | 14 | 8 |
| `rec_golf` | 9.5 | 4.2 | 13.5 | 9.6 | 3.8 | 3.6 | 6.2 | 10.8 | 2.4 | 1.9 | 14 | 8 |
| `hyrox_fitness` | 11.5 | 3.1 | 9 | 5.1 | 3.1 | 1.6 | 2.9 | 11.8 | 2.9 | 1.2 | 14 | 8 |
| `rec_combat_fitness` | 9.5 | 4.3 | 13.5 | 7.6 | 3.5 | 3.6 | 6.5 | 11.8 | 2.6 | 1.6 | 14 | 8 |
| `rec_climbing` | 9.5 | 4.3 | 13.5 | 9.9 | 5 | 3.9 | 7 | 9 | 1.9 | 4.4 | 14 | 9 |
| `rec_ocr` | 12.5 | 3.4 | 9 | 5.1 | 3.1 | 1.6 | 3.9 | 14 | 3.4 | 1.3 | 14 | 8 |
| `rec_league` | 9.5 | 4.2 | 13.5 | 9.6 | 3.8 | 3.6 | 4.2 | 10.2 | 2.4 | 1.9 | 14 | 8 |
| `rec_kickball` | 9.5 | 4.2 | 13.5 | 9.6 | 3.8 | 3.6 | 4.2 | 10.2 | 2.4 | 1.9 | 14 | 8 |
| `run_fitness` | 9 | 2.5 | 9 | 5.1 | 3.1 | 1.6 | 2.2 | 9.2 | 2.2 | 1.2 | 7 | 11 |
| `hike_ruck` | 9.5 | 4.2 | 13.5 | 9.6 | 3.8 | 3.6 | 4.2 | 10.2 | 2.4 | 1.9 | 14 | 8 |
| `cycling_fitness` | 9 | 2.5 | 9 | 5.1 | 3.1 | 1.6 | 4.2 | 9.8 | 2.2 | 1.2 | 7 | 11 |
| `lap_swim` | 9 | 2.5 | 9 | 5.1 | 3.1 | 1.6 | 4.2 | 9.8 | 2.2 | 1.2 | 7 | 11 |
| `ski_snow_prep` | 9.5 | 4.2 | 13.5 | 9.6 | 3.8 | 3.6 | 4.2 | 10.2 | 2.4 | 1.9 | 14 | 8 |
| `surf_paddle` | 9.5 | 4.2 | 13.5 | 9.6 | 3.8 | 3.6 | 7.2 | 11 | 2.4 | 1.9 | 10.5 | 8 |
| `dance_fitness` | 9 | 2.5 | 9 | 5.1 | 3.1 | 1.6 | 2.2 | 9.2 | 2.2 | 1.2 | 7 | 11 |
| `active_aging_50plus` | 9.5 | 4.2 | 13.5 | 9.6 | 3.8 | 3.6 | 4.2 | 10.2 | 2.4 | 1.9 | 14 | 8 |
| `active_aging_60plus` | 9.5 | 4.2 | 13.5 | 9.6 | 3.8 | 3.6 | 4.2 | 10.2 | 2.4 | 1.9 | 14 | 8 |
| `youth_general_athletic` | 9.5 | 4.2 | 13.5 | 9.6 | 3.8 | 3.6 | 4.2 | 10.2 | 2.4 | 1.9 | 10.5 | 8 |

## 8. Profile cards

Grouped by sport group, then sport; recreational and goal profiles at the end. Each card: who it is for, where it came from, the key numbers and what is still open. Full detail (sample weeks, prehab rules, US calendars, field-level evidence) is in the JSON.

### 8.1 Team field and court

#### American football - quarterback (QB) (`football_qb`)

- ES: Fútbol americano - mariscal de campo (Quarterback) | category: competitive | sport: american_football | picked by: american_football:QB | positions: QB
- origin: sports/team.json (unchanged); family field_court; ath03 rotational_power; evidence: REUSED from 04 v1 (04v:football_qb)
- why: Throwing athlete inside a contact sport: arm care, rotational power and pocket footwork; far fewer jumps and sprints than skill players.
- template: BYOP ATHLETIC 4-day with 2 SPRINT slots and COD on every main day
- numbers: 4 main + 2 optional days; 140.5 sets / week (53.5 athletic); contact class 4 (40 % plyometric at block end, 25 % at start); aerobic 3 / pre 2 / in 2 (gym_plan)
- athletic dose / week: plyometric contacts 35-45; all jump contacts 65-85; throws 85-115 (T2); COD cuts 70-95 (MOD. TURN); sprint m 305-415; Olympic sets 6-10
- resistance: goal power / strength; emphasis hypertrophy 25; strength 40; power 35; rep zone main lift 3-6, secondary 8-12, arm care 12-15; bilateral/unilateral % of lower compound sets: block start 20/80 -> end 10/90, in season 10/90; contra / ipsi: contralateral for drop-back and escape cuts (CAT-13 football); ipsilateral step-ups for the throw's drive leg (INFERRED)
- season: pre-season 60 % of off-season sets (3 lift days); in season 43 % (2 lift days, game-heavy yes); the one hard gym day >= 48 h before a game (COACH-R2 ATH-07)
- Olympic lifts: everyone in athletic training gets Olympic lifts (COACH-ANSWER ATH-10); 60+: none by default; offered as an option with the warning to work with a fitness professional (COACH-R2 ATH-08); older / injured / high-volume clients never get snatch variants (EQ-03)
- injuries: SHOULDER_THROWER, ELBOW_THROWER, SHOULDER_CONTACT, LOW_BACK_ROTATIONAL, ANKLE_SPRAIN, NECK, PAIN_GENERAL
- sample week (off season): Mon - A1 knee + pull: warm-up -> core 2 x 2 sets, light (R2-SES-03) -> 1 plyo / ballistic -> clean variant (squat pattern, R2-ATH-04) -> HEAVY SQUAT (axial day  / Tue - B1 hip + push: speed / COD block first (squirrel jumps -> MACH / acceleration starts -> max velocity, LIB-21; route tree EASY -> MOD. -> HARD TURN, ATH-06 / Wed - aerobic 1 + optional Focus / core (optional days ideally separate - ORD-10) / Thu - A2 knee + pull: core 2 x 2 -> 1 plyo / ballistic -> clean variant -> leg press or belt squat (non-axial) + pull -> unilateral knee-dominant -> neck isomet / Fri - B2 hip + push: speed / COD block first (squirrel jumps -> MACH / acceleration starts -> max velocity, LIB-21; route tree EASY -> MOD. -> HARD TURN, ATH-06 / Sat - aerobic 2 + aerobic 3 (or after a lifting day) / Sun - off

#### American football - running back (RB) (`football_rb`)

- ES: Fútbol americano - corredor (Running Back) | category: competitive | sport: american_football | picked by: american_football:RB | positions: RB, FB (lighter fullbacks)
- origin: sports/team.json (delta), base `football_skill`; family field_court; ath03 speed_power; evidence: 04 v1 (04:football_skill) + PROPOSED deltas
- why: Skill player who also takes contact on most touches: skill-player speed / COD with extra strength, pressing and neck (between 04 football_skill and football_big_skill).
- template: BYOP ATHLETIC 4-day with 2 SPRINT slots and COD on every main day
- numbers: 4 main + 2 optional days; 153.5 sets / week (64.5 athletic); contact class 2 (60 % plyometric at block end, 45 % at start); aerobic 3 / pre 2 / in 2 (gym_plan)
- athletic dose / week: plyometric contacts 75-100; all jump contacts 110-150; throws 70-90 (T2); COD cuts 95-130 (HARD TURN); sprint m 410-550; Olympic sets 6-10
- resistance: goal power / strength; emphasis hypertrophy 25; strength 40; power 35; rep zone STRENGTH main lifts + contrast (L2+, off-season - ATH-12); VOL 2 secondary; bilateral/unilateral % of lower compound sets: block start 20/80 -> end 10/90, in season 10/90; contra / ipsi: contralateral loading for cuts - gets the athlete into and out of the hip quickly (COACH-ANSWER CAT-13 names football route runners, soccer, basketball, tennis); ipsilateral step-ups for acceleration 
- season: pre-season 62 % of off-season sets (3 lift days); in season 47 % (2 lift days, game-heavy yes); the one hard gym day >= 48 h before a game (COACH-R2 ATH-07)
- Olympic lifts: everyone in athletic training gets Olympic lifts (COACH-ANSWER ATH-10); 60+: none by default; offered as an option with the warning to work with a fitness professional (COACH-R2 ATH-08); older / injured / high-volume clients never get snatch variants (EQ-03)
- injuries: HAMSTRING, ACL_LANDING_CUTTING, ANKLE_SPRAIN, SHOULDER_CONTACT, NECK, GROIN_ADDUCTOR, PAIN_GENERAL
- sample week (off season): Mon - A1 knee + pull: warm-up -> core 2 x 2 sets, light (R2-SES-03) -> 2 plyo / ballistic -> clean variant (squat pattern, R2-ATH-04) -> HEAVY SQUAT (axial day  / Tue - B1 hip + push: speed / COD block first (squirrel jumps -> MACH / acceleration starts -> max velocity, LIB-21; route tree EASY -> MOD. -> HARD TURN, ATH-06 / Wed - aerobic 1 + optional Focus / core (optional days ideally separate - ORD-10) / Thu - A2 knee + pull: core 2 x 2 -> 2 plyo / ballistic -> clean variant -> leg press or belt squat (non-axial) + pull -> unilateral knee-dominant -> Nordic / sl / Fri - B2 hip + push: speed / COD block first (squirrel jumps -> MACH / acceleration starts -> max velocity, LIB-21; route tree EASY -> MOD. -> HARD TURN, ATH-06 / Sat - aerobic 2 + aerobic 3 (or after a lifting day) / Sun - off

#### American football - tight end / linebacker (TE / LB, FB, box S) (`football_big_skill`)

- ES: Fútbol americano - ala cerrada / apoyador (TE / LB) | category: competitive | sport: american_football | picked by: american_football:FB, american_football:TE, american_football:LB | positions: TE, LB, FB, box S | aliases: football_te_lb
- origin: 04_v1 (04); family field_court; ath03 speed_power; evidence: INFERRED
- why: Between skill players and linemen on every dial.
- template: BYOP ATHLETIC 4-day
- numbers: 4 main + 2 optional days; 148.5 sets / week (59 athletic); contact class 3 (50 % plyometric at block end, 35 % at start); aerobic 3 / pre 2 / in 2 (gym_plan)
- athletic dose / week: plyometric contacts 60-90; all jump contacts 105-145; throws 70-110 (T2); COD cuts 80-100 (HARD TURN); sprint m 300-400; Olympic sets 8-12
- resistance: goal strength / power; emphasis hypertrophy 25; strength 45; power 30; rep zone STRENGTH + VOL 2; bilateral/unilateral % of lower compound sets: block start 30/70 -> end 20/80, in season 10/90; contra / ipsi: contralateral for COD (CAT-13), ipsilateral for acceleration
- season: pre-season 61 % of off-season sets (3 lift days); in season 44 % (2 lift days, game-heavy yes); the one hard gym day >= 48 h before a game (COACH-R2 ATH-07)
- Olympic lifts: everyone in athletic training gets Olympic lifts (COACH-ANSWER ATH-10); 60+: none by default; offered as an option with the warning to work with a fitness professional (COACH-R2 ATH-08); older / injured / high-volume clients never get snatch variants (EQ-03)
- injuries: HAMSTRING, NECK, GROIN_ADDUCTOR, ACL_LANDING_CUTTING, LOW_BACK_LOADING, PAIN_GENERAL, SHOULDER_CONTACT
- sample week (off season): Mon - A1 knee + pull: warm-up -> core 2 x 2 sets, light (R2-SES-03) -> 2 plyo / ballistic -> clean variant (squat pattern, R2-ATH-04) -> HEAVY SQUAT (axial day  / Tue - B1 hip + push: speed / COD block first (squirrel jumps -> MACH / acceleration starts -> max velocity, LIB-21; route tree EASY -> MOD. -> HARD TURN, ATH-06 / Wed - aerobic 1 + optional Focus / core (optional days ideally separate - ORD-10) / Thu - A2 knee + pull: core 2 x 2 -> 2 plyo / ballistic -> clean variant -> leg press or belt squat (non-axial) + pull -> unilateral knee-dominant -> Nordic / sl / Fri - B2 hip + push: speed / COD block first (squirrel jumps -> MACH / acceleration starts -> max velocity, LIB-21; route tree EASY -> MOD. -> HARD TURN, ATH-06 / Sat - aerobic 2 + aerobic 3 (or after a lifting day) / Sun - off

#### American football - wide receiver / defensive back (WR / CB / S) (`football_skill`)

- ES: Fútbol americano - receptor / back defensivo (WR / DB) | category: competitive | sport: american_football | picked by: american_football:WR, american_football:CB, american_football:S | positions: WR, CB, S (cover safeties; box safeties -> football_te_lb) | aliases: football_wr_db
- origin: 04_v1 (04); family field_court; ath03 speed_power; evidence: INFERRED. Note: the coach's COD library is mostly the receiver route tree ('FADE', 'SLANT', 'POST/CORNER', 'FLAT', 'DIG/OUT', 'COMEBACK/CURL') plus 'Shuffles', 'LEFT TEST' (INFERRED: L-test) and a date-coerced 5-10-5 cell - OBSERVED.
- why: Highest sprint and route-COD demand; short 5-6 s plays with long rests -> alactic conditioning, horizontal/lateral plyos.
- template: BYOP ATHLETIC 4-day with 2 SPRINT slots and COD on every main day
- numbers: 4 main + 2 optional days; 151.5 sets / week (68.5 athletic); contact class 2 (60 % plyometric at block end, 45 % at start); aerobic 3 / pre 2 / in 2 (gym_plan)
- athletic dose / week: plyometric contacts 80-110; all jump contacts 120-160; throws 60-100 (T2); COD cuts 120-160 (HARD TURN); sprint m 400-600; Olympic sets 6-10
- resistance: goal power / strength; emphasis hypertrophy 20; strength 40; power 40; rep zone STRENGTH main lifts, contrast (heavy -> jump) 1-2x/week (contrast / complexes: L2+ athletes, off-season only, ~78-85% - ATH-12); bilateral/unilateral % of lower compound sets: block start 20/80 -> end 10/90, in season 10/90; contra / ipsi: contralateral for route cuts (COACH-ANSWER CAT-13: 'football players ... running and changing directions, routes'); ipsilateral step-ups for acceleration (CAT-13)
- season: pre-season 64 % of off-season sets (3 lift days); in season 47 % (2 lift days, game-heavy yes); the one hard gym day >= 48 h before a game (COACH-R2 ATH-07)
- Olympic lifts: everyone in athletic training gets Olympic lifts (COACH-ANSWER ATH-10); 60+: none by default; offered as an option with the warning to work with a fitness professional (COACH-R2 ATH-08); older / injured / high-volume clients never get snatch variants (EQ-03)
- injuries: HAMSTRING, GROIN_ADDUCTOR, ACL_LANDING_CUTTING, ANKLE_SPRAIN, NECK, PAIN_GENERAL, SHOULDER_CONTACT
- promoted v1 variants: football_qb -> now the full profile `football_qb` (position profile in v1.1); football_specialist -> now the full profile `football_k_p` (position profile in v1.1)
- sample week (off season): Mon - A1 knee + pull: warm-up -> core 2 x 2 sets, light (R2-SES-03) -> 2 plyo / ballistic -> clean variant (squat pattern, R2-ATH-04) -> HEAVY SQUAT (axial day  / Tue - B1 hip + push: speed / COD block first (squirrel jumps -> MACH / acceleration starts -> max velocity, LIB-21; route tree EASY -> MOD. -> HARD TURN, ATH-06 / Wed - aerobic 1 + optional Focus / core (optional days ideally separate - ORD-10) / Thu - A2 knee + pull: core 2 x 2 -> 2 plyo / ballistic -> clean variant -> leg press or belt squat (non-axial) + pull -> unilateral knee-dominant -> Nordic / sl / Fri - B2 hip + push: speed / COD block first (squirrel jumps -> MACH / acceleration starts -> max velocity, LIB-21; route tree EASY -> MOD. -> HARD TURN, ATH-06 / Sat - aerobic 2 + aerobic 3 (or after a lifting day) / Sun - off

#### American football - offensive line (OL) (`football_ol`)

- ES: Fútbol americano - línea ofensiva (OL) | category: competitive | sport: american_football | picked by: american_football:OL | positions: T, G, C
- origin: sports/team.json (delta), base `football_lineman`; family field_court; ath03 resistance; evidence: 04 v1 (04:football_lineman) + PROPOSED deltas
- why: 'Some need more resistance training' end of the athlete spectrum (ATH-03); OL push more and move less than DL.
- template: BYOP ATHLETIC 4-day with fewer plyo slots and more resistance slots
- numbers: 4 main + 2 optional days; 145 sets / week (33.5 athletic); contact class 4 (40 % plyometric at block end, 25 % at start); aerobic 3 / pre 2 / in 2 (gym_plan)
- athletic dose / week: plyometric contacts 25-35; all jump contacts 35-50; throws 85-115 (T2); COD cuts 25-30 (MOD. TURN); sprint m 155-205; Olympic sets 7.5-12.5
- resistance: goal strength / hypertrophy; emphasis hypertrophy 30; strength 55; power 15; rep zone STRENGTH 3-5 + VOL 2 8-12 for mass; bilateral/unilateral % of lower compound sets: block start 50/50 -> end 40/60, in season 30/70; contra / ipsi: contra / ipsi lunges and step-ups as health accessories, more in the first 2-4 weeks, then bilateral-dominant (COACH-ANSWER CAT-13 size / strength rule; applied to strength-type athletes INFERRED)
- season: pre-season 60 % of off-season sets (3 lift days); in season 46 % (2 lift days, game-heavy yes); the one hard gym day >= 48 h before a game (COACH-R2 ATH-07)
- Olympic lifts: everyone in athletic training gets Olympic lifts (COACH-ANSWER ATH-10); 60+: none by default; offered as an option with the warning to work with a fitness professional (COACH-R2 ATH-08); older / injured / high-volume clients never get snatch variants (EQ-03)
- injuries: LOW_BACK_LOADING, SHOULDER_CONTACT, NECK, ACL_LANDING_CUTTING, ANKLE_SPRAIN, PAIN_GENERAL
- sample week (off season): Mon - A1 knee + pull: warm-up -> core 2 x 2 sets, light (R2-SES-03) -> 1 plyo / ballistic -> clean variant (squat pattern, R2-ATH-04) -> HEAVY SQUAT (axial day  / Tue - B1 hip + push: core 2 x 2 -> plyo + medball throws -> snatch variant (hinge pattern) -> non-axial hinge (hip thrust / back extension / reverse hyper) + ho / Wed - aerobic 1 + optional Focus / core (optional days ideally separate - ORD-10) / Thu - A2 knee + pull: core 2 x 2 -> 1 plyo / ballistic -> clean variant -> leg press or belt squat (non-axial) + pull -> unilateral knee-dominant -> neck isomet / Fri - B2 hip + push: core 2 x 2 -> plyo + medball throws -> snatch variant (hinge pattern) -> HEAVY DEADLIFT / trap-bar (axial day 2, R2-SES-01) + push -> unila / Sat - aerobic 2 + aerobic 3 (or after a lifting day) / Sun - off

#### American football - linemen (OL / DL base profile) (`football_lineman`)

- ES: Fútbol americano - linieros (OL / DL, base de las dos líneas) | category: competitive | sport: american_football | picked by: american_football:line
- origin: 04_v1 (04); family field_court; ath03 resistance; evidence: INFERRED
- why: 'Some need more resistance training' end of the athlete spectrum.
- template: BYOP ATHLETIC 4-day with fewer plyo slots and more resistance slots
- numbers: 4 main + 2 optional days; 146 sets / week (36.5 athletic); contact class 4 (40 % plyometric at block end, 25 % at start); aerobic 3 / pre 2 / in 2 (gym_plan)
- athletic dose / week: plyometric contacts 20-40; all jump contacts 35-50; throws 80-120 (T2); COD cuts 40-50 (MOD. TURN); sprint m 100-160; Olympic sets 8-12
- resistance: goal strength / hypertrophy; emphasis hypertrophy 30; strength 50; power 20; rep zone STRENGTH 3-5 + VOL 2 8-12 for mass; bilateral/unilateral % of lower compound sets: block start 50/50 -> end 40/60, in season 30/70; contra / ipsi: health accessory (INFERRED)
- season: pre-season 60 % of off-season sets (3 lift days); in season 46 % (2 lift days, game-heavy yes); the one hard gym day >= 48 h before a game (COACH-R2 ATH-07)
- Olympic lifts: everyone in athletic training gets Olympic lifts (COACH-ANSWER ATH-10); 60+: none by default; offered as an option with the warning to work with a fitness professional (COACH-R2 ATH-08); never snatch variants for older / injured / high-volume clients (EQ-03)
- injuries: LOW_BACK_LOADING, NECK, PAIN_GENERAL, ACL_LANDING_CUTTING
- sample week (off season): Mon - A1 knee + pull: warm-up -> core 2 x 2 sets, light (R2-SES-03) -> 1 plyo / ballistic -> clean variant (squat pattern, R2-ATH-04) -> HEAVY SQUAT (axial day  / Tue - B1 hip + push: core 2 x 2 -> plyo + medball throws -> snatch variant (hinge pattern) -> non-axial hinge (hip thrust / back extension / reverse hyper) + ho / Wed - aerobic 1 + optional Focus / core (optional days ideally separate - ORD-10) / Thu - A2 knee + pull: core 2 x 2 -> 1 plyo / ballistic -> clean variant -> leg press or belt squat (non-axial) + pull -> unilateral knee-dominant -> neck isomet / Fri - B2 hip + push: core 2 x 2 -> plyo + medball throws -> snatch variant (hinge pattern) -> HEAVY DEADLIFT / trap-bar (axial day 2, R2-SES-01) + push -> unila / Sat - aerobic 2 + aerobic 3 (or after a lifting day) / Sun - off

#### American football - defensive line (DL) (`football_dl`)

- ES: Fútbol americano - línea defensiva (DL) | category: competitive | sport: american_football | picked by: american_football:DL | positions: DT, NT, DE / edge
- origin: sports/team.json (delta), base `football_lineman`; family field_court; ath03 resistance; evidence: 04 v1 (04:football_lineman) + PROPOSED deltas
- why: Linemen who must win the first step and chase: lineman strength with more ballistic jumps, COD and short sprints than OL.
- template: BYOP ATHLETIC 4-day with fewer plyo slots and more resistance slots
- numbers: 4 main + 2 optional days; 151 sets / week (41.5 athletic); contact class 4 (40 % plyometric at block end, 25 % at start); aerobic 3 / pre 2 / in 2 (gym_plan)
- athletic dose / week: plyometric contacts 35-45; all jump contacts 55-70; throws 85-115 (T2); COD cuts 40-55 (HARD TURN); sprint m 255-345; Olympic sets 7.5-12.5
- resistance: goal strength / power; emphasis hypertrophy 30; strength 45; power 25; rep zone STRENGTH 3-5 + contrast (L2+, off-season - ATH-12) + VOL 2 for mass; bilateral/unilateral % of lower compound sets: block start 50/50 -> end 40/60, in season 30/70; contra / ipsi: contra / ipsi lunges and step-ups as health accessories, more in the first 2-4 weeks, then bilateral-dominant (COACH-ANSWER CAT-13 size / strength rule; applied to strength-type athletes INFERRED)
- season: pre-season 60 % of off-season sets (3 lift days); in season 45 % (2 lift days, game-heavy yes); the one hard gym day >= 48 h before a game (COACH-R2 ATH-07)
- Olympic lifts: everyone in athletic training gets Olympic lifts (COACH-ANSWER ATH-10); 60+: none by default; offered as an option with the warning to work with a fitness professional (COACH-R2 ATH-08); older / injured / high-volume clients never get snatch variants (EQ-03)
- injuries: LOW_BACK_LOADING, SHOULDER_CONTACT, NECK, ACL_LANDING_CUTTING, ANKLE_SPRAIN, PAIN_GENERAL
- variants: `football_dl_edge` Edge rusher (DE / OLB in a 3-4) (COD 2; SPRINT 1; PLYO 1)
- sample week (off season): Mon - A1 knee + pull: warm-up -> core 2 x 2 sets, light (R2-SES-03) -> 1 plyo / ballistic -> clean variant (squat pattern, R2-ATH-04) -> HEAVY SQUAT (axial day  / Tue - B1 hip + push: speed / COD block first (squirrel jumps -> MACH / acceleration starts -> max velocity, LIB-21; route tree EASY -> MOD. -> HARD TURN, ATH-06 / Wed - aerobic 1 + optional Focus / core (optional days ideally separate - ORD-10) / Thu - A2 knee + pull: core 2 x 2 -> 1 plyo / ballistic -> clean variant -> leg press or belt squat (non-axial) + pull -> unilateral knee-dominant -> neck isomet / Fri - B2 hip + push: speed / COD block first (squirrel jumps -> MACH / acceleration starts -> max velocity, LIB-21; route tree EASY -> MOD. -> HARD TURN, ATH-06 / Sat - aerobic 2 + aerobic 3 (or after a lifting day) / Sun - off

#### American football - kicker / punter (K / P / LS) (`football_k_p`)

- ES: Fútbol americano - pateador / despejador (K / P) | category: competitive | sport: american_football | picked by: american_football:KP | positions: K, P, LS (long snapper: use football_te_lb strength with less COD)
- origin: sports/team.json (unchanged); family field_court; ath03 speed_power; evidence: REUSED from 04 v1 (04v:football_specialist)
- why: Specialists: kicking-leg speed, plant-leg strength, hip flexor / groin capacity; little COD or sprint.
- template: BYOP ATHLETIC 4-day with 2 SPRINT slots and COD on every main day
- numbers: 4 main + 2 optional days; 128.5 sets / week (39.5 athletic); contact class 4 (40 % plyometric at block end, 25 % at start); aerobic 3 / pre 2 / in 2 (gym_plan)
- athletic dose / week: plyometric contacts 10-15; all jump contacts 35-50; throws 70-90 (T2); COD cuts 35-50 (EASY TURN); sprint m 205-275; Olympic sets 6-10
- resistance: goal power / strength; emphasis hypertrophy 25; strength 40; power 35; rep zone main 3-6, single-leg 6-10; bilateral/unilateral % of lower compound sets: block start 20/80 -> end 10/90, in season 10/90; contra / ipsi: contralateral lunges into the plant leg (INFERRED from CAT-13); ipsilateral step-ups for the kicking-leg drive
- season: pre-season 60 % of off-season sets (3 lift days); in season 46 % (2 lift days, game-heavy yes); the one hard gym day >= 48 h before a game (COACH-R2 ATH-07)
- Olympic lifts: everyone in athletic training gets Olympic lifts (COACH-ANSWER ATH-10); 60+: none by default; offered as an option with the warning to work with a fitness professional (COACH-R2 ATH-08); older / injured / high-volume clients never get snatch variants (EQ-03)
- injuries: HIP_FLEXOR, GROIN_ADDUCTOR, HAMSTRING, LOW_BACK_ROTATIONAL, PAIN_GENERAL
- sample week (off season): Mon - A1 knee + pull: warm-up -> core 2 x 2 sets, light (R2-SES-03) -> 1 plyo / ballistic -> clean variant (squat pattern, R2-ATH-04) -> HEAVY SQUAT (axial day  / Tue - B1 hip + push: speed / COD block first (squirrel jumps -> MACH / acceleration starts -> max velocity, LIB-21; route tree EASY -> MOD. -> HARD TURN, ATH-06 / Wed - aerobic 1 + optional Focus / core (optional days ideally separate - ORD-10) / Thu - A2 knee + pull: core 2 x 2 -> 1 plyo / ballistic -> clean variant -> leg press or belt squat (non-axial) + pull -> unilateral knee-dominant -> Nordic / sl / Fri - B2 hip + push: speed / COD block first (squirrel jumps -> MACH / acceleration starts -> max velocity, LIB-21; route tree EASY -> MOD. -> HARD TURN, ATH-06 / Sat - aerobic 2 + aerobic 3 (or after a lifting day) / Sun - off

#### Flag football - competitive (HS / club / national team) (`flag_football`)

- ES: Flag football (fútbol bandera) - competitivo | category: competitive | sport: flag_football | picked by: flag_football:QB, flag_football:other | positions: QB, center, WR / route runner, rusher, DB / safety
- origin: sports/team.json (delta), base `football_skill`; family field_court; ath03 speed_power; evidence: 04 v1 (04:football_skill) + PROPOSED deltas
- why: Every flag player is a skill player: football_skill speed / COD dials with less contact strength. Girls flag football is one of the fastest-growing US school sports and shows a high non-contact ACL rate, so the ACL landing / cutting rules are front-loaded (applied by landing competency, never by sex - ATH-09).
- template: BYOP ATHLETIC 4-day with 2 SPRINT slots and COD on every main day
- numbers: 4 main + 2 optional days; 148.5 sets / week (68.5 athletic); contact class 2 (60 % plyometric at block end, 45 % at start); aerobic 3 / pre 2 / in 2 (gym_plan)
- athletic dose / week: plyometric contacts 80-110; all jump contacts 120-160; throws 70-90 (T2); COD cuts 105-145 (HARD TURN); sprint m 460-620; Olympic sets 6-10
- resistance: goal power / strength; emphasis hypertrophy 20; strength 40; power 40; rep zone STRENGTH main lifts + contrast (L2+, off-season - ATH-12); bilateral/unilateral % of lower compound sets: block start 20/80 -> end 10/90, in season 10/90; contra / ipsi: contralateral loading for cuts - gets the athlete into and out of the hip quickly (COACH-ANSWER CAT-13 names football route runners, soccer, basketball, tennis); ipsilateral step-ups for acceleration 
- season: pre-season 64 % of off-season sets (3 lift days); in season 46 % (2 lift days, game-heavy yes); the one hard gym day >= 48 h before a game (COACH-R2 ATH-07)
- Olympic lifts: everyone in athletic training gets Olympic lifts (COACH-ANSWER ATH-10); 60+: none by default; offered as an option with the warning to work with a fitness professional (COACH-R2 ATH-08); older / injured / high-volume clients never get snatch variants (EQ-03)
- injuries: ACL_LANDING_CUTTING, ANKLE_SPRAIN, HAMSTRING, SHOULDER_CONTACT, NECK, PAIN_GENERAL
- variants: `flag_football_qb` Flag QB (PLYO -8; COD -6; SPRINT -3; VPUSH -2; ISO_REAR 6; THROW 2)
- sample week (off season): Mon - A1 knee + pull: warm-up -> core 2 x 2 sets, light (R2-SES-03) -> 2 plyo / ballistic -> clean variant (squat pattern, R2-ATH-04) -> HEAVY SQUAT (axial day  / Tue - B1 hip + push: speed / COD block first (squirrel jumps -> MACH / acceleration starts -> max velocity, LIB-21; route tree EASY -> MOD. -> HARD TURN, ATH-06 / Wed - aerobic 1 + optional Focus / core (optional days ideally separate - ORD-10) / Thu - A2 knee + pull: core 2 x 2 -> 2 plyo / ballistic -> clean variant -> leg press or belt squat (non-axial) + pull -> unilateral knee-dominant -> Nordic / sl / Fri - B2 hip + push: speed / COD block first (squirrel jumps -> MACH / acceleration starts -> max velocity, LIB-21; route tree EASY -> MOD. -> HARD TURN, ATH-06 / Sat - aerobic 2 + aerobic 3 (or after a lifting day) / Sun - off

#### Basketball - guards (PG / SG) (`basketball_guard`)

- ES: Baloncesto - bases y escoltas (Guards) | category: competitive | sport: basketball | picked by: basketball:guard | positions: PG, SG
- origin: sports/team.json (unchanged); family field_court; ath03 speed_power; evidence: REUSED from 04 v1 (04v:basketball_guard)
- why: Highest jump and landing frequency of the team sports, short accelerations and constant lateral COD -> the top plyo tier and a high COD tier, moderate throws.
- template: BYOP 'ATHLETIC - FULL BODY - 4 DAYS A' (4 main x 10 slots + Wed/Sat optional) with a SPRINT slot added
- numbers: 4 main + 2 optional days; 159 sets / week (77 athletic); contact class 3 (50 % plyometric at block end, 35 % at start); aerobic 3 / pre 2 / in 2 (gym_plan)
- athletic dose / week: plyometric contacts 90-120; all jump contacts 160-215; throws 85-115 (T2); COD cuts 120-160 (HARD TURN); sprint m 305-415; Olympic sets 6-10
- resistance: goal power / strength; emphasis hypertrophy 25; strength 40; power 35; rep zone main lift 3-6 (VOL 3 / STRENGTH), secondary 8-12 (VOL 2), isolation 15-20; bilateral/unilateral % of lower compound sets: block start 20/80 -> end 10/90, in season 10/90; contra / ipsi: contralateral 'a lot' for getting into and out of the hip (COACH-ANSWER CAT-13)
- season: pre-season 63 % of off-season sets (3 lift days); in season 41 % (2 lift days, game-heavy yes); the one hard gym day >= 48 h before a game (COACH-R2 ATH-07)
- Olympic lifts: everyone in athletic training gets Olympic lifts (COACH-ANSWER ATH-10); 60+: none by default; offered as an option with the warning to work with a fitness professional (COACH-R2 ATH-08); older / injured / high-volume clients never get snatch variants (EQ-03)
- injuries: PATELLAR_TENDON, ANKLE_SPRAIN, ACL_LANDING_CUTTING, HAMSTRING, ACHILLES_CALF, PAIN_GENERAL
- sample week (off season): Mon - A1 knee + pull: warm-up -> core 2 x 2 sets, light (R2-SES-03) -> 2 plyo / ballistic -> clean variant (squat pattern, R2-ATH-04) -> HEAVY SQUAT (axial day  / Tue - B1 hip + push: speed / COD block first (squirrel jumps -> MACH / acceleration starts -> max velocity, LIB-21; route tree EASY -> MOD. -> HARD TURN, ATH-06 / Wed - aerobic 1 + optional Focus / core (optional days ideally separate - ORD-10) / Thu - A2 knee + pull: core 2 x 2 -> 2 plyo / ballistic -> clean variant -> leg press or belt squat (non-axial) + pull -> unilateral knee-dominant -> Nordic / sl / Fri - B2 hip + push: speed / COD block first (squirrel jumps -> MACH / acceleration starts -> max velocity, LIB-21; route tree EASY -> MOD. -> HARD TURN, ATH-06 / Sat - aerobic 2 + aerobic 3 (or after a lifting day) / Sun - off

#### Basketball - wings (SF / combo forwards) (`basketball`)

- ES: Baloncesto - aleros (Wings) | category: competitive | sport: basketball | picked by: basketball:wing | positions: SF, wing / combo forward | aliases: basketball_wing
- origin: 04_v1 (04); family field_court; ath03 speed_power; evidence: INFERRED (no basketball program in the sheets). Ordering anchor OBSERVED in the coach's own words: 'basketball players need more plyos'.
- why: Highest jump and landing frequency of the team sports, short accelerations and constant lateral COD -> the top plyo tier and a high COD tier, moderate throws.
- template: BYOP 'ATHLETIC - FULL BODY - 4 DAYS A' (4 main x 10 slots + Wed/Sat optional) with a SPRINT slot added
- numbers: 4 main + 2 optional days; 157 sets / week (75 athletic); contact class 3 (50 % plyometric at block end, 35 % at start); aerobic 3 / pre 2 / in 2 (gym_plan)
- athletic dose / week: plyometric contacts 100-140; all jump contacts 170-230; throws 80-120 (T2); COD cuts 120-160 (HARD TURN); sprint m 180-300; Olympic sets 6-10
- resistance: goal power / strength; emphasis hypertrophy 25; strength 40; power 35; rep zone main lift 3-6 (VOL 3 / STRENGTH), secondary 8-12 (VOL 2), isolation 15-20; bilateral/unilateral % of lower compound sets: block start 20/80 -> end 10/90, in season 10/90; contra / ipsi: contralateral 'a lot' for getting into and out of the hip (COACH-ANSWER CAT-13)
- season: pre-season 63 % of off-season sets (3 lift days); in season 42 % (2 lift days, game-heavy yes); the one hard gym day >= 48 h before a game (COACH-R2 ATH-07)
- Olympic lifts: everyone in athletic training gets Olympic lifts (COACH-ANSWER ATH-10); 60+: none by default; offered as an option with the warning to work with a fitness professional (COACH-R2 ATH-08); older / injured / high-volume clients never get snatch variants (EQ-03)
- injuries: PATELLAR_TENDON, ANKLE_SPRAIN, ACL_LANDING_CUTTING, HAMSTRING, ACHILLES_CALF, PAIN_GENERAL
- promoted v1 variants: basketball_guard -> now the full profile `basketball_guard` (position profile in v1.1); basketball_big -> now the full profile `basketball_big` (position profile in v1.1)
- sample week (off season): Mon - A1 knee + pull: warm-up -> core 2 x 2 sets, light (R2-SES-03) -> 2 plyo / ballistic -> clean variant (squat pattern, R2-ATH-04) -> HEAVY SQUAT (axial day  / Tue - B1 hip + push: speed / COD block first (squirrel jumps -> MACH / acceleration starts -> max velocity, LIB-21; route tree EASY -> MOD. -> HARD TURN, ATH-06 / Wed - aerobic 1 + optional Focus / core (optional days ideally separate - ORD-10) / Thu - A2 knee + pull: core 2 x 2 -> 2 plyo / ballistic -> clean variant -> leg press or belt squat (non-axial) + pull -> unilateral knee-dominant -> Nordic / sl / Fri - B2 hip + push: speed / COD block first (squirrel jumps -> MACH / acceleration starts -> max velocity, LIB-21; route tree EASY -> MOD. -> HARD TURN, ATH-06 / Sat - aerobic 2 + aerobic 3 (or after a lifting day) / Sun - off

#### Basketball - bigs (PF / C) (`basketball_big`)

- ES: Baloncesto - ala-pívots y pívots (Bigs) | category: competitive | sport: basketball | picked by: basketball:big | positions: PF, C
- origin: sports/team.json (unchanged); family field_court; ath03 speed_power; evidence: REUSED from 04 v1 (04v:basketball_big)
- why: Highest jump and landing frequency of the team sports, short accelerations and constant lateral COD -> the top plyo tier and a high COD tier, moderate throws.
- template: BYOP 'ATHLETIC - FULL BODY - 4 DAYS A' (4 main x 10 slots + Wed/Sat optional) with a SPRINT slot added
- numbers: 4 main + 2 optional days; 157 sets / week (69 athletic); contact class 3 (50 % plyometric at block end, 35 % at start); aerobic 3 / pre 2 / in 2 (gym_plan)
- athletic dose / week: plyometric contacts 105-145; all jump contacts 185-250; throws 85-115 (T2); COD cuts 70-95 (HARD TURN); sprint m 100-140; Olympic sets 6-10
- resistance: goal strength / power; emphasis hypertrophy 25; strength 40; power 35; rep zone main lift 3-6 (VOL 3 / STRENGTH), secondary 8-12 (VOL 2), isolation 15-20; bilateral/unilateral % of lower compound sets: block start 30/70 -> end 20/80, in season 10/90; contra / ipsi: contralateral 'a lot' for getting into and out of the hip (COACH-ANSWER CAT-13)
- season: pre-season 60 % of off-season sets (3 lift days); in season 45 % (2 lift days, game-heavy yes); the one hard gym day >= 48 h before a game (COACH-R2 ATH-07)
- Olympic lifts: everyone in athletic training gets Olympic lifts (COACH-ANSWER ATH-10); 60+: none by default; offered as an option with the warning to work with a fitness professional (COACH-R2 ATH-08); older / injured / high-volume clients never get snatch variants (EQ-03)
- injuries: PATELLAR_TENDON, ANKLE_SPRAIN, ACL_LANDING_CUTTING, HAMSTRING, ACHILLES_CALF, PAIN_GENERAL
- sample week (off season): Mon - A1 knee + pull: warm-up -> core 2 x 2 sets, light (R2-SES-03) -> 2 plyo / ballistic -> clean variant (squat pattern, R2-ATH-04) -> HEAVY SQUAT (axial day  / Tue - B1 hip + push: speed / COD block first (squirrel jumps -> MACH / acceleration starts -> max velocity, LIB-21; route tree EASY -> MOD. -> HARD TURN, ATH-06 / Wed - aerobic 1 + optional Focus / core (optional days ideally separate - ORD-10) / Thu - A2 knee + pull: core 2 x 2 -> 2 plyo / ballistic -> clean variant -> leg press or belt squat (non-axial) + pull -> unilateral knee-dominant -> Nordic / sl / Fri - B2 hip + push: speed / COD block first (squirrel jumps -> MACH / acceleration starts -> max velocity, LIB-21; route tree EASY -> MOD. -> HARD TURN, ATH-06 / Sat - aerobic 2 + aerobic 3 (or after a lifting day) / Sun - off

#### Baseball - position players (no position picked; base of infield / outfield) (`baseball_position`)

- ES: Béisbol - jugadores de posición (sin posición elegida; base de cuadro y jardines) | category: competitive | sport: baseball
- origin: 04_v1 (04); family field_court; ath03 rotational_power; evidence: OBSERVED (MASTER_MODEL 'BASEBALL', Block 1 off-season means) + INFERRED position deltas; v1: COACH-ANSWER PRG-09 (high school = college = pro), ATH-08 (pitchers), ATH-10 (Olympic lifts standard)
- why: The only fully-written athlete year in the workbook (24 week-grids). Template for rotational / overhead sports. High school, college and pro players get the same plan; loads and speeds change per athlete, pros get more care, college players adapt as much as they can, high school players 'just have to do a lot of work' (COACH-ANSWER PRG-09). Thursday = strength (PRG-09).
- template: MM BASEBALL 4-day Parts A-E, v1 order: CORE FIRST (warm-up, movable - ATH-11; the sheet puts it in Part B) -> Part A ballistics -> Olympic lifts (STANDARD, not optional - ATH-10) -> Part C bilateral + upper compound superset -> Part D unilateral + 2 isolation tri-set -> Part E 'Buy out'
- numbers: 4 main + 0 optional days; 136.6 sets / week (35.7 athletic); contact class 4 (40 % plyometric at block end, 25 % at start); aerobic 2 / pre 2 / in 2 (gym_plan)
- athletic dose / week: plyometric contacts 35-60; all jump contacts 100-150; throws 170-200 (T3); COD cuts 10-30 (MOD. TURN); sprint m 60-150; Olympic sets 6-16
- resistance: goal power / hypertrophy; emphasis hypertrophy 45; strength 35; power 20; rep zone VOL 1 -> VOL 2 off-season ('12/10/8/8'), VOL 3 pre-season, VOL 2 in-season (4 x 10); bilateral/unilateral % of lower compound sets: block start 50/50 -> end 40/60, in season 20/80; contra / ipsi: both directions for rotation: contralateral lead-leg work INTO the hip, ipsilateral out of the hip (OBSERVED 'IPSILATERAL loading' lateral step-ups); INFERRED
- season: pre-season 60 % of off-season sets (3 lift days); in season 51 % (2 lift days, game-heavy no); the one hard gym day >= 48 h before a game (COACH-R2 ATH-07)
- Olympic lifts: everyone in athletic training gets Olympic lifts (COACH-ANSWER ATH-10); 60+: none by default; offered as an option with the warning to work with a fitness professional (COACH-R2 ATH-08); never snatch variants for older / injured / high-volume clients (EQ-03)
- injuries: SHOULDER_THROWER, ELBOW_THROWER, LOW_BACK_ROTATIONAL, LEAD_HIP_GLUTE, HAMSTRING, GROIN_ADDUCTOR, PAIN_GENERAL
- promoted v1 variants: baseball_pitcher -> now the full profile `baseball_pitcher` (position profile in v1.1); baseball_catcher -> now the full profile `baseball_catcher` (position profile in v1.1)
- sample week (off season): Mon - A1 knee + pull: warm-up -> core 2 x 2 sets, light (R2-SES-03) -> 1 plyo / ballistic -> clean variant (squat pattern, R2-ATH-04) -> HEAVY SQUAT (axial day  / Tue - B1 hip + push: core 2 x 2 -> plyo + medball throws -> snatch variant (hinge pattern) -> non-axial hinge (hip thrust / back extension / reverse hyper) + ho / Wed - aerobic 1 + optional Focus / core (optional days ideally separate - ORD-10) / Thu - A2 knee + pull: core 2 x 2 -> 1 plyo / ballistic -> clean variant -> leg press or belt squat (non-axial) + pull -> unilateral knee-dominant -> Nordic / sl / Fri - B2 hip + push: core 2 x 2 -> plyo + medball throws -> snatch variant (hinge pattern) -> HEAVY DEADLIFT / trap-bar (axial day 2, R2-SES-01) + push -> unila / Sat - aerobic 2 / Sun - off
- open: Catcher variant is INFERRED (not asked). The observed year keeps about 55/45 bilateral/unilateral even in-season; v1 applies the coach's rule (minimal bilateral in-season, UNI-10) - confirm for baseball.

#### Baseball - pitchers (`baseball_pitcher`)

- ES: Béisbol - lanzadores (Pitchers) | category: competitive | sport: baseball | picked by: baseball:pitcher | positions: SP, RP
- origin: sports/team.json (unchanged); family field_court; ath03 rotational_power; evidence: REUSED from 04 v1 (04v:baseball_pitcher)
- why: The only fully-written athlete year in the workbook (24 week-grids). Template for rotational / overhead sports. High school, college and pro players get the same plan; loads and speeds change per athlete, pros get more care, college players adapt as much as they can, high school players 'just have to do a lot of work' (COACH-ANSWER PRG-09). Thursday = strength (PRG-09).
- template: MM BASEBALL 4-day Parts A-E, v1 order: CORE FIRST (warm-up, movable - ATH-11; the sheet puts it in Part B) -> Part A ballistics -> Olympic lifts (STANDARD, not optional - ATH-10) -> Part C bilateral + upper compound superset -> Part D unilateral + 2 isolation tri-set -> Part E 'Buy out'
- numbers: 4 main + 0 optional days; 130.6 sets / week (27.7 athletic); contact class 4 (40 % plyometric at block end, 25 % at start); aerobic 2 / pre 2 / in 2 (gym_plan)
- athletic dose / week: plyometric contacts 35-45; all jump contacts 50-70; throws 40-55 (T1); COD cuts 0 (MOD. TURN); sprint m 50-70; Olympic sets 6-10
- resistance: goal power / hypertrophy; emphasis hypertrophy 45; strength 35; power 20; rep zone VOL 1 -> VOL 2 off-season ('12/10/8/8'), VOL 3 pre-season, VOL 2 in-season (4 x 10); bilateral/unilateral % of lower compound sets: block start 50/50 -> end 40/60, in season 20/80; contra / ipsi: both directions for rotation: contralateral lead-leg work INTO the hip, ipsilateral out of the hip (OBSERVED 'IPSILATERAL loading' lateral step-ups); INFERRED
- season: pre-season 60 % of off-season sets (3 lift days); in season 50 % (2 lift days, game-heavy no); the one hard gym day >= 48 h before a game (COACH-R2 ATH-07)
- Olympic lifts: everyone in athletic training gets Olympic lifts (COACH-ANSWER ATH-10); 60+: none by default; offered as an option with the warning to work with a fitness professional (COACH-R2 ATH-08); older / injured / high-volume clients never get snatch variants (EQ-03)
- injuries: SHOULDER_THROWER, ELBOW_THROWER, LOW_BACK_ROTATIONAL, LEAD_HIP_GLUTE, HAMSTRING, GROIN_ADDUCTOR, PAIN_GENERAL
- sample week (off season): Mon - A1 knee + pull: warm-up -> core 2 x 2 sets, light (R2-SES-03) -> 1 plyo / ballistic -> clean variant (squat pattern, R2-ATH-04) -> HEAVY SQUAT (axial day  / Tue - B1 hip + push: core 2 x 2 -> plyo -> high pull or light single-arm DB snatch (overhead thrower) -> non-axial hinge (hip thrust / back extension / reverse  / Wed - aerobic 1 + optional Focus / core (optional days ideally separate - ORD-10) / Thu - A2 knee + pull: core 2 x 2 -> 1 plyo / ballistic -> clean variant -> leg press or belt squat (non-axial) + pull -> unilateral knee-dominant -> Nordic / sl / Fri - B2 hip + push: core 2 x 2 -> plyo -> high pull or light single-arm DB snatch (overhead thrower) -> HEAVY DEADLIFT / trap-bar (axial day 2, R2-SES-01) + pu / Sat - aerobic 2 / Sun - off

#### Baseball - catchers (`baseball_catcher`)

- ES: Béisbol - receptores (Catchers) | category: competitive | sport: baseball | picked by: baseball:catcher | positions: C
- origin: sports/team.json (unchanged); family field_court; ath03 rotational_power; evidence: REUSED from 04 v1 (04v:baseball_catcher)
- why: The only fully-written athlete year in the workbook (24 week-grids). Template for rotational / overhead sports. High school, college and pro players get the same plan; loads and speeds change per athlete, pros get more care, college players adapt as much as they can, high school players 'just have to do a lot of work' (COACH-ANSWER PRG-09). Thursday = strength (PRG-09).
- template: MM BASEBALL 4-day Parts A-E, v1 order: CORE FIRST (warm-up, movable - ATH-11; the sheet puts it in Part B) -> Part A ballistics -> Olympic lifts (STANDARD, not optional - ATH-10) -> Part C bilateral + upper compound superset -> Part D unilateral + 2 isolation tri-set -> Part E 'Buy out'
- numbers: 4 main + 0 optional days; 139.6 sets / week (35.7 athletic); contact class 4 (40 % plyometric at block end, 25 % at start); aerobic 2 / pre 2 / in 2 (gym_plan)
- athletic dose / week: plyometric contacts 35-45; all jump contacts 50-70; throws 75-100 (T2); COD cuts 10-15 (MOD. TURN); sprint m 155-205; Olympic sets 6-10
- resistance: goal strength / power; emphasis hypertrophy 45; strength 35; power 20; rep zone VOL 1 -> VOL 2 off-season ('12/10/8/8'), VOL 3 pre-season, VOL 2 in-season (4 x 10); bilateral/unilateral % of lower compound sets: block start 50/50 -> end 40/60, in season 20/80; contra / ipsi: both directions for rotation: contralateral lead-leg work INTO the hip, ipsilateral out of the hip (OBSERVED 'IPSILATERAL loading' lateral step-ups); INFERRED
- season: pre-season 60 % of off-season sets (3 lift days); in season 51 % (2 lift days, game-heavy no); the one hard gym day >= 48 h before a game (COACH-R2 ATH-07)
- Olympic lifts: everyone in athletic training gets Olympic lifts (COACH-ANSWER ATH-10); 60+: none by default; offered as an option with the warning to work with a fitness professional (COACH-R2 ATH-08); older / injured / high-volume clients never get snatch variants (EQ-03)
- injuries: KNEE_DEEP_FLEXION, HIP_FAI_DEEP_FLEXION, LOW_BACK_FLEXED_POSTURE, SHOULDER_THROWER, ELBOW_THROWER, PAIN_GENERAL
- sample week (off season): Mon - A1 knee + pull: warm-up -> core 2 x 2 sets, light (R2-SES-03) -> 1 plyo / ballistic -> clean variant (squat pattern, R2-ATH-04) -> HEAVY SQUAT (axial day  / Tue - B1 hip + push: core 2 x 2 -> plyo + medball throws -> snatch variant (hinge pattern) -> non-axial hinge (hip thrust / back extension / reverse hyper) + ho / Wed - aerobic 1 + optional Focus / core (optional days ideally separate - ORD-10) / Thu - A2 knee + pull: core 2 x 2 -> 1 plyo / ballistic -> clean variant -> leg press or belt squat (non-axial) + pull -> unilateral knee-dominant -> arm care (p / Fri - B2 hip + push: core 2 x 2 -> plyo + medball throws -> snatch variant (hinge pattern) -> HEAVY DEADLIFT / trap-bar (axial day 2, R2-SES-01) + push -> unila / Sat - aerobic 2 / Sun - off

#### Baseball - infielders (`baseball_infield`)

- ES: Béisbol - cuadro interior (Infielders) | category: competitive | sport: baseball | picked by: baseball:infield | positions: 1B, 2B, SS, 3B
- origin: sports/team.json (delta), base `baseball_position`; family field_court; ath03 rotational_power; evidence: 04 v1 (04:baseball_position) + PROPOSED deltas
- why: Coach's baseball template (OBSERVED) with a lateral / reactive first-step emphasis for the infield (INFERRED).
- template: MM BASEBALL 4-day Parts A-E, v1 order: CORE FIRST (warm-up, movable - ATH-11; the sheet puts it in Part B) -> Part A ballistics -> Olympic lifts (STANDARD, not optional - ATH-10) -> Part C bilateral + upper compound superset -> Part D unilateral + 2 isolation tri-set -> Part E 'Buy out'
- numbers: 4 main + 0 optional days; 140.6 sets / week (39.7 athletic); contact class 4 (40 % plyometric at block end, 25 % at start); aerobic 2 / pre 2 / in 2 (gym_plan)
- athletic dose / week: plyometric contacts 30-45; all jump contacts 50-70; throws 75-100 (T2); COD cuts 35-50 (MOD. TURN); sprint m 155-205; Olympic sets 6-10
- resistance: goal power / hypertrophy; emphasis hypertrophy 45; strength 35; power 20; rep zone VOL 1 -> VOL 2 off-season ('12/10/8/8'), VOL 3 pre-season, VOL 2 in-season (4 x 10); bilateral/unilateral % of lower compound sets: block start 50/50 -> end 40/60, in season 20/80; contra / ipsi: both directions for rotation: contralateral lead-leg work INTO the hip, ipsilateral out of the hip (OBSERVED 'IPSILATERAL loading' lateral step-ups); INFERRED
- season: pre-season 60 % of off-season sets (3 lift days); in season 51 % (2 lift days, game-heavy no); the one hard gym day >= 48 h before a game (COACH-R2 ATH-07)
- Olympic lifts: everyone in athletic training gets Olympic lifts (COACH-ANSWER ATH-10); 60+: none by default; offered as an option with the warning to work with a fitness professional (COACH-R2 ATH-08); older / injured / high-volume clients never get snatch variants (EQ-03)
- injuries: SHOULDER_THROWER, ELBOW_THROWER, LOW_BACK_ROTATIONAL, LEAD_HIP_GLUTE, HAMSTRING, GROIN_ADDUCTOR, PAIN_GENERAL
- sample week (off season): Mon - A1 knee + pull: warm-up -> core 2 x 2 sets, light (R2-SES-03) -> 1 plyo / ballistic -> clean variant (squat pattern, R2-ATH-04) -> HEAVY SQUAT (axial day  / Tue - B1 hip + push: core 2 x 2 -> plyo + medball throws -> snatch variant (hinge pattern) -> non-axial hinge (hip thrust / back extension / reverse hyper) + ho / Wed - aerobic 1 + optional Focus / core (optional days ideally separate - ORD-10) / Thu - A2 knee + pull: core 2 x 2 -> 1 plyo / ballistic -> clean variant -> leg press or belt squat (non-axial) + pull -> unilateral knee-dominant -> Nordic / sl / Fri - B2 hip + push: core 2 x 2 -> plyo + medball throws -> snatch variant (hinge pattern) -> HEAVY DEADLIFT / trap-bar (axial day 2, R2-SES-01) + push -> unila / Sat - aerobic 2 / Sun - off

#### Baseball - outfielders (`baseball_outfield`)

- ES: Béisbol - jardineros (Outfielders) | category: competitive | sport: baseball | picked by: baseball:outfield | positions: LF, CF, RF
- origin: sports/team.json (delta), base `baseball_position`; family field_court; ath03 rotational_power; evidence: 04 v1 (04:baseball_position) + PROPOSED deltas
- why: Coach's baseball template (OBSERVED) with more max-velocity sprinting and hamstring protection for outfielders (INFERRED; 'they do need to sprint' - ATH-01).
- template: MM BASEBALL 4-day Parts A-E, v1 order: CORE FIRST (warm-up, movable - ATH-11; the sheet puts it in Part B) -> Part A ballistics -> Olympic lifts (STANDARD, not optional - ATH-10) -> Part C bilateral + upper compound superset -> Part D unilateral + 2 isolation tri-set -> Part E 'Buy out'
- numbers: 4 main + 0 optional days; 140.6 sets / week (38.7 athletic); contact class 4 (40 % plyometric at block end, 25 % at start); aerobic 2 / pre 2 / in 2 (gym_plan)
- athletic dose / week: plyometric contacts 35-45; all jump contacts 50-70; throws 75-100 (T2); COD cuts 10-15 (MOD. TURN); sprint m 305-415; Olympic sets 6-10
- resistance: goal power / hypertrophy; emphasis hypertrophy 45; strength 35; power 20; rep zone VOL 1 -> VOL 2 off-season ('12/10/8/8'), VOL 3 pre-season, VOL 2 in-season (4 x 10); bilateral/unilateral % of lower compound sets: block start 50/50 -> end 40/60, in season 20/80; contra / ipsi: both directions for rotation: contralateral lead-leg work INTO the hip, ipsilateral out of the hip (OBSERVED 'IPSILATERAL loading' lateral step-ups); INFERRED
- season: pre-season 60 % of off-season sets (3 lift days); in season 51 % (2 lift days, game-heavy no); the one hard gym day >= 48 h before a game (COACH-R2 ATH-07)
- Olympic lifts: everyone in athletic training gets Olympic lifts (COACH-ANSWER ATH-10); 60+: none by default; offered as an option with the warning to work with a fitness professional (COACH-R2 ATH-08); older / injured / high-volume clients never get snatch variants (EQ-03)
- injuries: SHOULDER_THROWER, ELBOW_THROWER, LOW_BACK_ROTATIONAL, LEAD_HIP_GLUTE, HAMSTRING, GROIN_ADDUCTOR, PAIN_GENERAL
- sample week (off season): Mon - A1 knee + pull: warm-up -> core 2 x 2 sets, light (R2-SES-03) -> 1 plyo / ballistic -> clean variant (squat pattern, R2-ATH-04) -> HEAVY SQUAT (axial day  / Tue - B1 hip + push: speed / COD block first (squirrel jumps -> MACH / acceleration starts -> max velocity, LIB-21; route tree EASY -> MOD. -> HARD TURN, ATH-06 / Wed - aerobic 1 + optional Focus / core (optional days ideally separate - ORD-10) / Thu - A2 knee + pull: core 2 x 2 -> 1 plyo / ballistic -> clean variant -> leg press or belt squat (non-axial) + pull -> unilateral knee-dominant -> Nordic / sl / Fri - B2 hip + push: speed / COD block first (squirrel jumps -> MACH / acceleration starts -> max velocity, LIB-21; route tree EASY -> MOD. -> HARD TURN, ATH-06 / Sat - aerobic 2 / Sun - off

#### Softball - pitchers (windmill) (`softball_pitcher`)

- ES: Sóftbol - lanzadores (Pitchers, molino) | category: competitive | sport: softball | picked by: softball:pitcher | positions: P
- origin: sports/team.json (unchanged); family field_court; ath03 rotational_power; evidence: REUSED from 04 v1 (04v:softball_pitcher)
- why: Same rotational / overhead demands as baseball; landing work is set by landing competency and injury history, never by sex (COACH-ANSWER ATH-09).
- template: MM BASEBALL 4-day Parts A-E
- numbers: 4 main + 0 optional days; 138.5 sets / week (35 athletic); contact class 4 (40 % plyometric at block end, 25 % at start); aerobic 2 / pre 2 / in 2 (gym_plan)
- athletic dose / week: plyometric contacts 40-55; all jump contacts 50-65; throws 130-170 (T2); COD cuts 10-15 (MOD. TURN); sprint m 155-205; Olympic sets 3-5
- resistance: goal power / hypertrophy; emphasis hypertrophy 45; strength 35; power 20; rep zone as baseball; bilateral/unilateral % of lower compound sets: block start 50/50 -> end 40/60, in season 20/80; contra / ipsi: as baseball (INFERRED)
- season: pre-season 60 % of off-season sets (3 lift days); in season 52 % (2 lift days, game-heavy no); the one hard gym day >= 48 h before a game (COACH-R2 ATH-07)
- Olympic lifts: everyone in athletic training gets Olympic lifts (COACH-ANSWER ATH-10); 60+: none by default; offered as an option with the warning to work with a fitness professional (COACH-R2 ATH-08); older / injured / high-volume clients never get snatch variants (EQ-03)
- injuries: SHOULDER_THROWER, ELBOW_THROWER, ACL_LANDING_CUTTING, LOW_BACK_ROTATIONAL, LEAD_HIP_GLUTE, PAIN_GENERAL
- sample week (off season): Mon - A1 knee + pull: warm-up -> core 2 x 2 sets, light (R2-SES-03) -> 1 plyo / ballistic -> clean variant (squat pattern, R2-ATH-04) -> HEAVY SQUAT (axial day  / Tue - B1 hip + push: core 2 x 2 -> plyo + medball throws -> non-axial hinge (hip thrust / back extension / reverse hyper) + horizontal push -> unilateral hip-do / Wed - aerobic 1 + optional Focus / core (optional days ideally separate - ORD-10) / Thu - A2 knee + pull: core 2 x 2 -> 1 plyo / ballistic -> leg press or belt squat (non-axial) + pull -> unilateral knee-dominant -> arm care (posterior cuff / s / Fri - B2 hip + push: core 2 x 2 -> plyo + medball throws -> high pull or light single-arm DB snatch (overhead thrower) -> HEAVY DEADLIFT / trap-bar (axial day 2 / Sat - aerobic 2 / Sun - off

#### Softball - position players (`softball`)

- ES: Sóftbol - jugadores de posición | category: competitive | sport: softball | picked by: softball:catcher, softball:infield, softball:outfield | positions: C, IF, OF | aliases: softball_position
- origin: 04_v1 (04); family field_court; ath03 rotational_power; evidence: INFERRED from OBSERVED BASEBALL (same skeleton) + SCIENCE on windmill pitching
- why: Same rotational / overhead demands as baseball; landing work is set by landing competency and injury history, never by sex (COACH-ANSWER ATH-09).
- template: MM BASEBALL 4-day Parts A-E
- numbers: 4 main + 0 optional days; 133.5 sets / week (38 athletic); contact class 4 (40 % plyometric at block end, 25 % at start); aerobic 2 / pre 2 / in 2 (gym_plan)
- athletic dose / week: plyometric contacts 35-60; all jump contacts 50-65; throws 160-200 (T3); COD cuts 10-30 (MOD. TURN); sprint m 60-150; Olympic sets 2-6
- resistance: goal power / hypertrophy; emphasis hypertrophy 45; strength 35; power 20; rep zone as baseball; bilateral/unilateral % of lower compound sets: block start 50/50 -> end 40/60, in season 20/80; contra / ipsi: as baseball (INFERRED)
- season: pre-season 60 % of off-season sets (3 lift days); in season 53 % (2 lift days, game-heavy no); the one hard gym day >= 48 h before a game (COACH-R2 ATH-07)
- Olympic lifts: everyone in athletic training gets Olympic lifts (COACH-ANSWER ATH-10); 60+: none by default; offered as an option with the warning to work with a fitness professional (COACH-R2 ATH-08); older / injured / high-volume clients never get snatch variants (EQ-03)
- injuries: SHOULDER_THROWER, ELBOW_THROWER, ACL_LANDING_CUTTING, LOW_BACK_ROTATIONAL, LEAD_HIP_GLUTE, PAIN_GENERAL
- variants: `softball_catcher` Softball catcher (BKD -3; UHD 3; ISO_REAR 3)
- promoted v1 variants: softball_pitcher -> now the full profile `softball_pitcher` (position profile in v1.1)
- sample week (off season): Mon - A1 knee + pull: warm-up -> core 2 x 2 sets, light (R2-SES-03) -> 1 plyo / ballistic -> clean variant (squat pattern, R2-ATH-04) -> HEAVY SQUAT (axial day  / Tue - B1 hip + push: core 2 x 2 -> plyo + medball throws -> non-axial hinge (hip thrust / back extension / reverse hyper) + horizontal push -> unilateral hip-do / Wed - aerobic 1 + optional Focus / core (optional days ideally separate - ORD-10) / Thu - A2 knee + pull: core 2 x 2 -> 1 plyo / ballistic -> leg press or belt squat (non-axial) + pull -> unilateral knee-dominant -> arm care (posterior cuff / s / Fri - B2 hip + push: core 2 x 2 -> plyo + medball throws -> snatch variant (hinge pattern) -> HEAVY DEADLIFT / trap-bar (axial day 2, R2-SES-01) + push -> unila / Sat - aerobic 2 / Sun - off

#### Soccer - goalkeeper (`soccer_gk`)

- ES: Fútbol - portero (Goalkeeper) | category: competitive | sport: soccer | picked by: soccer:goalkeeper | positions: GK
- origin: sports/team.json (unchanged); family field_court; ath03 speed_power; evidence: REUSED from 04 v1 (04v:soccer_gk)
- why: Most turns and running of any sport here; hamstring and groin are the dominant injury drivers.
- template: BYOP ATHLETIC 4-day (2-3 in-season) + Copenhagen + Nordic as fixed accessories
- numbers: 4 main + 2 optional days; 132 sets / week (53 athletic); contact class 3 (50 % plyometric at block end, 35 % at start); aerobic 3 / pre 2 / in 2 (gym_plan)
- athletic dose / week: plyometric contacts 60-85; all jump contacts 120-160; throws 60-80 (T2); COD cuts 70-95 (MOD. TURN); sprint m 155-205; Olympic sets 3-5
- resistance: goal power / strength; emphasis hypertrophy 20; strength 40; power 40; rep zone STRENGTH low volume (3 x 3-5) + contrast (contrast / complexes: L2+ athletes, off-season only, ~78-85% - ATH-12); bilateral/unilateral % of lower compound sets: block start 20/80 -> end 10/90, in season 10/90; contra / ipsi: contralateral (COACH-ANSWER CAT-13 names soccer); ipsilateral for acceleration
- season: pre-season 61 % of off-season sets (3 lift days); in season 46 % (2 lift days, game-heavy yes); the one hard gym day >= 48 h before a game (COACH-R2 ATH-07)
- Olympic lifts: everyone in athletic training gets Olympic lifts (COACH-ANSWER ATH-10); 60+: none by default; offered as an option with the warning to work with a fitness professional (COACH-R2 ATH-08); older / injured / high-volume clients never get snatch variants (EQ-03)
- injuries: SHOULDER_THROWER, HIP_FAI_DEEP_FLEXION, GROIN_ADDUCTOR, WRIST_HAND, ANKLE_SPRAIN, PAIN_GENERAL
- sample week (off season): Mon - A1 knee + pull: warm-up -> core 2 x 2 sets, light (R2-SES-03) -> 2 plyo / ballistic -> clean variant (squat pattern, R2-ATH-04) -> HEAVY SQUAT (axial day  / Tue - B1 hip + push: speed / COD block first (squirrel jumps -> MACH / acceleration starts -> max velocity, LIB-21; route tree EASY -> MOD. -> HARD TURN, ATH-06 / Wed - aerobic 1 + optional Focus / core (optional days ideally separate - ORD-10) / Thu - A2 knee + pull: core 2 x 2 -> 2 plyo / ballistic -> leg press or belt squat (non-axial) + pull -> unilateral knee-dominant -> Copenhagen plank, arm care ( / Fri - B2 hip + push: speed / COD block first (squirrel jumps -> MACH / acceleration starts -> max velocity, LIB-21; route tree EASY -> MOD. -> HARD TURN, ATH-06 / Sat - aerobic 2 + aerobic 3 (or after a lifting day) / Sun - off

#### Soccer - defenders (CB / FB) (`soccer_defender`)

- ES: Fútbol - defensas (centrales y laterales) | category: competitive | sport: soccer | picked by: soccer:defender | positions: CB, FB / wing-back
- origin: sports/team.json (delta), base `soccer`; family field_court; ath03 speed_power; evidence: 04 v1 (04:soccer) + PROPOSED deltas
- why: Most turns and running of any sport here; hamstring and groin are the dominant injury drivers.
- template: BYOP ATHLETIC 4-day (2-3 in-season) + Copenhagen + Nordic as fixed accessories
- numbers: 4 main + 2 optional days; 139 sets / week (58 athletic); contact class 2 (60 % plyometric at block end, 45 % at start); aerobic 3 / pre 2 / in 2 (gym_plan)
- athletic dose / week: plyometric contacts 70-95; all jump contacts 120-160; throws 25-35 (T1); COD cuts 95-130 (HARD TURN); sprint m 410-550; Olympic sets 3-5
- resistance: goal strength / power; emphasis hypertrophy 20; strength 45; power 35; rep zone STRENGTH low volume (3 x 3-5) + contrast (L2+, off-season - ATH-12); bilateral/unilateral % of lower compound sets: block start 20/80 -> end 10/90, in season 10/90; contra / ipsi: contralateral (COACH-ANSWER CAT-13 names soccer); ipsilateral for acceleration
- season: pre-season 63 % of off-season sets (3 lift days); in season 42 % (2 lift days, game-heavy yes); the one hard gym day >= 48 h before a game (COACH-R2 ATH-07)
- Olympic lifts: everyone in athletic training gets Olympic lifts (COACH-ANSWER ATH-10); 60+: none by default; offered as an option with the warning to work with a fitness professional (COACH-R2 ATH-08); older / injured / high-volume clients never get snatch variants (EQ-03)
- injuries: HAMSTRING, GROIN_ADDUCTOR, ACL_LANDING_CUTTING, ANKLE_SPRAIN, NECK, PAIN_GENERAL
- variants: `soccer_fullback` Full-back / wing-back (SPRINT 2; COD 1; BKD -1)
- sample week (off season): Mon - A1 knee + pull: warm-up -> core 2 x 2 sets, light (R2-SES-03) -> 2 plyo / ballistic -> clean variant (squat pattern, R2-ATH-04) -> HEAVY SQUAT (axial day  / Tue - B1 hip + push: speed / COD block first (squirrel jumps -> MACH / acceleration starts -> max velocity, LIB-21; route tree EASY -> MOD. -> HARD TURN, ATH-06 / Wed - aerobic 1 + optional Focus / core (optional days ideally separate - ORD-10) / Thu - A2 knee + pull: core 2 x 2 -> 2 plyo / ballistic -> leg press or belt squat (non-axial) + pull -> unilateral knee-dominant -> Nordic / slider curls, Copen / Fri - B2 hip + push: speed / COD block first (squirrel jumps -> MACH / acceleration starts -> max velocity, LIB-21; route tree EASY -> MOD. -> HARD TURN, ATH-06 / Sat - aerobic 2 + aerobic 3 (or after a lifting day) / Sun - off

#### Soccer - midfielders (CM / DM / AM / wide) (`soccer`)

- ES: Fútbol - mediocampistas | category: competitive | sport: soccer | picked by: soccer:midfielder | positions: DM, CM, AM, wide midfielder | aliases: soccer_midfielder
- origin: 04_v1 (04); family field_court; ath03 speed_power; evidence: INFERRED
- why: Most turns and running of any sport here; hamstring and groin are the dominant injury drivers.
- template: BYOP ATHLETIC 4-day (2-3 in-season) + Copenhagen + Nordic as fixed accessories
- numbers: 4 main + 2 optional days; 136 sets / week (61 athletic); contact class 2 (60 % plyometric at block end, 45 % at start); aerobic 4 / pre 2 / in 2 (gym_plan)
- athletic dose / week: plyometric contacts 70-95; all jump contacts 120-160; throws 20-40 (T1); COD cuts 120-160 (HARD TURN); sprint m 400-600; Olympic sets 2-6
- resistance: goal power / endurance-strength; emphasis hypertrophy 20; strength 40; power 40; rep zone STRENGTH low volume (3 x 3-5) + contrast (contrast / complexes: L2+ athletes, off-season only, ~78-85% - ATH-12); bilateral/unilateral % of lower compound sets: block start 20/80 -> end 10/90, in season 10/90; contra / ipsi: contralateral (COACH-ANSWER CAT-13 names soccer); ipsilateral for acceleration
- season: pre-season 65 % of off-season sets (3 lift days); in season 41 % (2 lift days, game-heavy yes); the one hard gym day >= 48 h before a game (COACH-R2 ATH-07)
- Olympic lifts: everyone in athletic training gets Olympic lifts (COACH-ANSWER ATH-10); 60+: none by default; offered as an option with the warning to work with a fitness professional (COACH-R2 ATH-08); older / injured / high-volume clients never get snatch variants (EQ-03)
- injuries: HAMSTRING, GROIN_ADDUCTOR, ACL_LANDING_CUTTING, ANKLE_SPRAIN, HIP_FLEXOR, PAIN_GENERAL
- variants: `soccer_wide_mid` Wide midfielder / winger (SPRINT 2; COD 1)
- promoted v1 variants: soccer_gk -> now the full profile `soccer_gk` (position profile in v1.1)
- sample week (off season): Mon - A1 knee + pull: warm-up -> core 2 x 2 sets, light (R2-SES-03) -> 2 plyo / ballistic -> clean variant (squat pattern, R2-ATH-04) -> HEAVY SQUAT (axial day  / Tue - B1 hip + push: speed / COD block first (squirrel jumps -> MACH / acceleration starts -> max velocity, LIB-21; route tree EASY -> MOD. -> HARD TURN, ATH-06 / Wed - aerobic 1 + optional Focus / core (optional days ideally separate - ORD-10) / Thu - A2 knee + pull: core 2 x 2 -> 2 plyo / ballistic -> leg press or belt squat (non-axial) + pull -> unilateral knee-dominant -> Nordic / slider curls -> cal / Fri - B2 hip + push: speed / COD block first (squirrel jumps -> MACH / acceleration starts -> max velocity, LIB-21; route tree EASY -> MOD. -> HARD TURN, ATH-06 / Sat - aerobic 2 + aerobic 3 (or after a lifting day) / Sun - off (or aerobic 4 when 4 sessions are set)

#### Soccer - forwards (ST / W) (`soccer_forward`)

- ES: Fútbol - delanteros | category: competitive | sport: soccer | picked by: soccer:forward | positions: ST, W
- origin: sports/team.json (delta), base `soccer`; family field_court; ath03 speed_power; evidence: 04 v1 (04:soccer) + PROPOSED deltas
- why: Most turns and running of any sport here; hamstring and groin are the dominant injury drivers.
- template: BYOP ATHLETIC 4-day (2-3 in-season) + Copenhagen + Nordic as fixed accessories
- numbers: 4 main + 2 optional days; 141 sets / week (65 athletic); contact class 2 (60 % plyometric at block end, 45 % at start); aerobic 3 / pre 2 / in 2 (gym_plan)
- athletic dose / week: plyometric contacts 75-100; all jump contacts 130-175; throws 25-35 (T1); COD cuts 105-145 (HARD TURN); sprint m 560-760; Olympic sets 3-5
- resistance: goal power / strength; emphasis hypertrophy 20; strength 40; power 40; rep zone STRENGTH low volume (3 x 3-5) + contrast (contrast / complexes: L2+ athletes, off-season only, ~78-85% - ATH-12); bilateral/unilateral % of lower compound sets: block start 20/80 -> end 10/90, in season 10/90; contra / ipsi: contralateral (COACH-ANSWER CAT-13 names soccer); ipsilateral for acceleration
- season: pre-season 65 % of off-season sets (3 lift days); in season 48 % (2 lift days, game-heavy yes); the one hard gym day >= 48 h before a game (COACH-R2 ATH-07)
- Olympic lifts: everyone in athletic training gets Olympic lifts (COACH-ANSWER ATH-10); 60+: none by default; offered as an option with the warning to work with a fitness professional (COACH-R2 ATH-08); older / injured / high-volume clients never get snatch variants (EQ-03)
- injuries: HAMSTRING, GROIN_ADDUCTOR, ACL_LANDING_CUTTING, ANKLE_SPRAIN, HIP_FLEXOR, PAIN_GENERAL
- sample week (off season): Mon - A1 knee + pull: warm-up -> core 2 x 2 sets, light (R2-SES-03) -> 2 plyo / ballistic -> clean variant (squat pattern, R2-ATH-04) -> HEAVY SQUAT (axial day  / Tue - B1 hip + push: speed / COD block first (squirrel jumps -> MACH / acceleration starts -> max velocity, LIB-21; route tree EASY -> MOD. -> HARD TURN, ATH-06 / Wed - aerobic 1 + optional Focus / core (optional days ideally separate - ORD-10) / Thu - A2 knee + pull: core 2 x 2 -> 2 plyo / ballistic -> leg press or belt squat (non-axial) + pull -> unilateral knee-dominant -> Nordic / slider curls -> cal / Fri - B2 hip + push: speed / COD block first (squirrel jumps -> MACH / acceleration starts -> max velocity, LIB-21; route tree EASY -> MOD. -> HARD TURN, ATH-06 / Sat - aerobic 2 + aerobic 3 (or after a lifting day) / Sun - off

#### Ice hockey - forwards (C / W) (`hockey`)

- ES: Hockey sobre hielo - delanteros | category: competitive | sport: ice_hockey | picked by: ice_hockey:forward | positions: C, LW, RW | aliases: hockey_forward
- origin: 04_v1 (04); family field_court; ath03 speed_power; evidence: INFERRED
- why: Skating = hip extension + abduction + external rotation -> frontal/transverse priority; adductor deceleration drives groin strains.
- template: BYOP ATHLETIC 4-day; lateral plyo emphasis; Copenhagen fixed
- numbers: 4 main + 2 optional days; 118.5 sets / week (37.5 athletic); contact class 4 (40 % plyometric at block end, 25 % at start); aerobic 3 / pre 2 / in 2 (gym_plan)
- athletic dose / week: plyometric contacts 25-45; all jump contacts 55-75; throws 70-100 (T2); COD cuts 20-30 (MOD. TURN); sprint m 150-200; Olympic sets 6-10
- resistance: goal power / strength; emphasis hypertrophy 25; strength 45; power 30; rep zone STRENGTH + VOL 2; bilateral/unilateral % of lower compound sets: block start 20/80 -> end 10/90, in season 10/90; contra / ipsi: contralateral for crossovers and lateral pushes (INFERRED from CAT-13)
- season: pre-season 60 % of off-season sets (3 lift days); in season 47 % (2 lift days, game-heavy yes); the one hard gym day >= 48 h before a game (COACH-R2 ATH-07)
- Olympic lifts: everyone in athletic training gets Olympic lifts (COACH-ANSWER ATH-10); 60+: none by default; offered as an option with the warning to work with a fitness professional (COACH-R2 ATH-08); older / injured / high-volume clients never get snatch variants (EQ-03)
- injuries: GROIN_ADDUCTOR, HIP_FAI_DEEP_FLEXION, NECK, LOW_BACK_ROTATIONAL, PAIN_GENERAL
- promoted v1 variants: hockey_goalie -> now the full profile `hockey_goalie` (position profile in v1.1)
- sample week (off season): Mon - A1 knee + pull: warm-up -> core 2 x 2 sets, light (R2-SES-03) -> 1 plyo / ballistic -> clean variant (squat pattern, R2-ATH-04) -> HEAVY SQUAT (axial day  / Tue - B1 hip + push: core 2 x 2 -> plyo + medball throws -> snatch variant (hinge pattern) -> non-axial hinge (hip thrust / back extension / reverse hyper) + ho / Wed - aerobic 1 + optional Focus / core (optional days ideally separate - ORD-10) / Thu - A2 knee + pull: core 2 x 2 -> 1 plyo / ballistic -> clean variant -> leg press or belt squat (non-axial) + pull -> unilateral knee-dominant -> Copenhagen  / Fri - B2 hip + push: core 2 x 2 -> plyo + medball throws -> snatch variant (hinge pattern) -> HEAVY DEADLIFT / trap-bar (axial day 2, R2-SES-01) + push -> unila / Sat - aerobic 2 + aerobic 3 (or after a lifting day) / Sun - off

#### Ice hockey - defensemen (D) (`hockey_defense`)

- ES: Hockey sobre hielo - defensas | category: competitive | sport: ice_hockey | picked by: ice_hockey:defense | positions: LD, RD
- origin: sports/team.json (delta), base `hockey`; family field_court; ath03 speed_power; evidence: 04 v1 (04:hockey) + PROPOSED deltas
- why: Skating = hip extension + abduction + external rotation -> frontal/transverse priority; adductor deceleration drives groin strains.
- template: BYOP ATHLETIC 4-day; lateral plyo emphasis; Copenhagen fixed
- numbers: 4 main + 2 optional days; 122.5 sets / week (36.5 athletic); contact class 4 (40 % plyometric at block end, 25 % at start); aerobic 4 / pre 2 / in 2 (gym_plan)
- athletic dose / week: plyometric contacts 30-40; all jump contacts 55-75; throws 70-100 (T2); COD cuts 25-30 (MOD. TURN); sprint m 100-140; Olympic sets 6-10
- resistance: goal strength / power; emphasis hypertrophy 25; strength 50; power 25; rep zone STRENGTH + VOL 2; bilateral/unilateral % of lower compound sets: block start 20/80 -> end 10/90, in season 10/90; contra / ipsi: contralateral for crossovers and lateral pushes (INFERRED from CAT-13)
- season: pre-season 60 % of off-season sets (3 lift days); in season 47 % (2 lift days, game-heavy yes); the one hard gym day >= 48 h before a game (COACH-R2 ATH-07)
- Olympic lifts: everyone in athletic training gets Olympic lifts (COACH-ANSWER ATH-10); 60+: none by default; offered as an option with the warning to work with a fitness professional (COACH-R2 ATH-08); older / injured / high-volume clients never get snatch variants (EQ-03)
- injuries: GROIN_ADDUCTOR, HIP_FAI_DEEP_FLEXION, NECK, LOW_BACK_ROTATIONAL, PAIN_GENERAL
- sample week (off season): Mon - A1 knee + pull: warm-up -> core 2 x 2 sets, light (R2-SES-03) -> 1 plyo / ballistic -> clean variant (squat pattern, R2-ATH-04) -> HEAVY SQUAT (axial day  / Tue - B1 hip + push: core 2 x 2 -> plyo + medball throws -> snatch variant (hinge pattern) -> non-axial hinge (hip thrust / back extension / reverse hyper) + ho / Wed - aerobic 1 + optional Focus / core (optional days ideally separate - ORD-10) / Thu - A2 knee + pull: core 2 x 2 -> 1 plyo / ballistic -> clean variant -> leg press or belt squat (non-axial) + pull -> unilateral knee-dominant -> Copenhagen  / Fri - B2 hip + push: core 2 x 2 -> plyo + medball throws -> snatch variant (hinge pattern) -> HEAVY DEADLIFT / trap-bar (axial day 2, R2-SES-01) + push -> unila / Sat - aerobic 2 + aerobic 3 (or after a lifting day) / Sun - off (or aerobic 4 when 4 sessions are set)

#### Ice hockey - goalies (`hockey_goalie`)

- ES: Hockey sobre hielo - porteros (Goalies) | category: competitive | sport: ice_hockey | picked by: ice_hockey:goalie | positions: G
- origin: sports/team.json (unchanged); family field_court; ath03 speed_power; evidence: REUSED from 04 v1 (04v:hockey_goalie)
- why: Skating = hip extension + abduction + external rotation -> frontal/transverse priority; adductor deceleration drives groin strains.
- template: BYOP ATHLETIC 4-day; lateral plyo emphasis; Copenhagen fixed
- numbers: 4 main + 2 optional days; 108.5 sets / week (27.5 athletic); contact class 4 (40 % plyometric at block end, 25 % at start); aerobic 3 / pre 2 / in 2 (gym_plan)
- athletic dose / week: plyometric contacts 0; all jump contacts 20-30; throws 40-50 (T1); COD cuts 35-50 (MOD. TURN); sprint m 0; Olympic sets 6-10
- resistance: goal power / strength; emphasis hypertrophy 25; strength 45; power 30; rep zone STRENGTH + VOL 2; bilateral/unilateral % of lower compound sets: block start 20/80 -> end 10/90, in season 10/90; contra / ipsi: contralateral for crossovers and lateral pushes (INFERRED from CAT-13)
- season: pre-season 60 % of off-season sets (3 lift days); in season 47 % (2 lift days, game-heavy yes); the one hard gym day >= 48 h before a game (COACH-R2 ATH-07)
- Olympic lifts: everyone in athletic training gets Olympic lifts (COACH-ANSWER ATH-10); 60+: none by default; offered as an option with the warning to work with a fitness professional (COACH-R2 ATH-08); older / injured / high-volume clients never get snatch variants (EQ-03)
- injuries: HIP_FAI_DEEP_FLEXION, GROIN_ADDUCTOR, KNEE_DEEP_FLEXION, LOW_BACK_ROTATIONAL, PAIN_GENERAL
- sample week (off season): Mon - A1 knee + pull: warm-up -> core 2 x 2 sets, light (R2-SES-03) -> 1 plyo / ballistic -> clean variant (squat pattern, R2-ATH-04) -> HEAVY SQUAT (axial day  / Tue - B1 hip + push: core 2 x 2 -> plyo -> snatch variant (hinge pattern) -> non-axial hinge (hip thrust / back extension / reverse hyper) + horizontal push ->  / Wed - aerobic 1 + optional Focus / core (optional days ideally separate - ORD-10) / Thu - A2 knee + pull: core 2 x 2 -> 1 plyo / ballistic -> clean variant -> leg press or belt squat (non-axial) + pull -> unilateral knee-dominant -> Copenhagen  / Fri - B2 hip + push: core 2 x 2 -> plyo -> snatch variant (hinge pattern) -> HEAVY DEADLIFT / trap-bar (axial day 2, R2-SES-01) + push -> unilateral hip-dominan / Sat - aerobic 2 + aerobic 3 (or after a lifting day) / Sun - off

#### Volleyball - outside / opposite hitters (`volleyball`)

- ES: Voleibol - atacantes punta y opuesto (Outside / Opposite) | category: competitive | sport: volleyball | picked by: volleyball:outside_opposite | positions: OH, OPP | aliases: volleyball_outside_opposite
- origin: 04_v1 (04); family field_court; ath03 speed_power; evidence: INFERRED (no volleyball program in the sheets)
- why: Jump frequency per match rivals basketball but vertical/bilateral and with less running -> top plyo tier, low sprint/COD, shoulder care. Coach confirms basketball = volleyball at the top of the plyo ranking (ATH-02).
- template: BYOP ATHLETIC 4-day; second A-day plyo slot = approach/block jump; ISO_REAR added for the hitting shoulder
- numbers: 4 main + 2 optional days; 146.5 sets / week (61.5 athletic); contact class 2 (60 % plyometric at block end, 45 % at start); aerobic 3 / pre 2 / in 2 (gym_plan)
- athletic dose / week: plyometric contacts 100-140; all jump contacts 165-225; throws 60-100 (T2); COD cuts 50-70 (MOD. TURN); sprint m 60-120; Olympic sets 6-10
- resistance: goal power / strength; emphasis hypertrophy 25; strength 40; power 35; rep zone main 3-6, secondary 8-12, quad isometric/slow 3x30-45 s; bilateral/unilateral % of lower compound sets: block start 40/60 -> end 30/70, in season 20/80; contra / ipsi: contralateral for lateral block footwork (INFERRED from CAT-13)
- season: pre-season 60 % of off-season sets (3 lift days); in season 45 % (2 lift days, game-heavy yes); the one hard gym day >= 48 h before a game (COACH-R2 ATH-07)
- Olympic lifts: everyone in athletic training gets Olympic lifts (COACH-ANSWER ATH-10); 60+: none by default; offered as an option with the warning to work with a fitness professional (COACH-R2 ATH-08); older / injured / high-volume clients never get snatch variants (EQ-03)
- injuries: PATELLAR_TENDON, ANKLE_SPRAIN, SHOULDER_THROWER, ACL_LANDING_CUTTING, LOW_BACK_ROTATIONAL, PAIN_GENERAL
- promoted v1 variants: volleyball_setter -> now the full profile `volleyball_setter` (position profile in v1.1); volleyball_libero -> now the full profile `volleyball_libero` (position profile in v1.1)
- sample week (off season): Mon - A1 knee + pull: warm-up -> core 2 x 2 sets, light (R2-SES-03) -> 2 plyo / ballistic -> clean variant (squat pattern, R2-ATH-04) -> HEAVY SQUAT (axial day  / Tue - B1 hip + push: speed / COD block first (squirrel jumps -> MACH / acceleration starts -> max velocity, LIB-21; route tree EASY -> MOD. -> HARD TURN, ATH-06 / Wed - aerobic 1 + optional Focus / core (optional days ideally separate - ORD-10) / Thu - A2 knee + pull: core 2 x 2 -> 2 plyo / ballistic -> clean variant -> leg press or belt squat (non-axial) + pull -> unilateral knee-dominant -> arm care (p / Fri - B2 hip + push: speed / COD block first (squirrel jumps -> MACH / acceleration starts -> max velocity, LIB-21; route tree EASY -> MOD. -> HARD TURN, ATH-06 / Sat - aerobic 2 + aerobic 3 (or after a lifting day) / Sun - off

#### Volleyball - middle blockers (`volleyball_middle`)

- ES: Voleibol - centrales (Middle Blockers) | category: competitive | sport: volleyball | picked by: volleyball:middle | positions: MB
- origin: sports/team.json (delta), base `volleyball`; family field_court; ath03 speed_power; evidence: 04 v1 (04:volleyball) + PROPOSED deltas
- why: Jump frequency per match rivals basketball but vertical/bilateral and with less running -> top plyo tier, low sprint/COD, shoulder care. Coach confirms basketball = volleyball at the top of the plyo ranking (ATH-02).
- template: BYOP ATHLETIC 4-day; second A-day plyo slot = approach/block jump; ISO_REAR added for the hitting shoulder
- numbers: 4 main + 2 optional days; 145.5 sets / week (60.5 athletic); contact class 2 (60 % plyometric at block end, 45 % at start); aerobic 3 / pre 2 / in 2 (gym_plan)
- athletic dose / week: plyometric contacts 115-155; all jump contacts 180-245; throws 70-90 (T2); COD cuts 40-55 (MOD. TURN); sprint m 50-70; Olympic sets 6-10
- resistance: goal power / strength; emphasis hypertrophy 25; strength 40; power 35; rep zone main 3-6, secondary 8-12, quad isometric/slow 3x30-45 s; bilateral/unilateral % of lower compound sets: block start 40/60 -> end 30/70, in season 20/80; contra / ipsi: contralateral for lateral block footwork (INFERRED from CAT-13)
- season: pre-season 60 % of off-season sets (3 lift days); in season 46 % (2 lift days, game-heavy yes); the one hard gym day >= 48 h before a game (COACH-R2 ATH-07)
- Olympic lifts: everyone in athletic training gets Olympic lifts (COACH-ANSWER ATH-10); 60+: none by default; offered as an option with the warning to work with a fitness professional (COACH-R2 ATH-08); older / injured / high-volume clients never get snatch variants (EQ-03)
- injuries: PATELLAR_TENDON, ANKLE_SPRAIN, SHOULDER_THROWER, ACL_LANDING_CUTTING, LOW_BACK_ROTATIONAL, PAIN_GENERAL
- sample week (off season): Mon - A1 knee + pull: warm-up -> core 2 x 2 sets, light (R2-SES-03) -> 2 plyo / ballistic -> clean variant (squat pattern, R2-ATH-04) -> HEAVY SQUAT (axial day  / Tue - B1 hip + push: core 2 x 2 -> plyo + medball throws -> snatch variant (hinge pattern) -> non-axial hinge (hip thrust / back extension / reverse hyper) + ho / Wed - aerobic 1 + optional Focus / core (optional days ideally separate - ORD-10) / Thu - A2 knee + pull: core 2 x 2 -> 2 plyo / ballistic -> clean variant -> leg press or belt squat (non-axial) + pull -> unilateral knee-dominant -> arm care (p / Fri - B2 hip + push: core 2 x 2 -> plyo + medball throws -> snatch variant (hinge pattern) -> HEAVY DEADLIFT / trap-bar (axial day 2, R2-SES-01) + push -> unila / Sat - aerobic 2 + aerobic 3 (or after a lifting day) / Sun - off

#### Volleyball - setters (`volleyball_setter`)

- ES: Voleibol - armadores (Setters) | category: competitive | sport: volleyball | picked by: volleyball:setter | positions: S
- origin: sports/team.json (unchanged); family field_court; ath03 speed_power; evidence: REUSED from 04 v1 (04v:volleyball_setter)
- why: Jump frequency per match rivals basketball but vertical/bilateral and with less running -> top plyo tier, low sprint/COD, shoulder care. Coach confirms basketball = volleyball at the top of the plyo ranking (ATH-02).
- template: BYOP ATHLETIC 4-day; second A-day plyo slot = approach/block jump; ISO_REAR added for the hitting shoulder
- numbers: 4 main + 2 optional days; 143.5 sets / week (58.5 athletic); contact class 2 (60 % plyometric at block end, 45 % at start); aerobic 3 / pre 2 / in 2 (gym_plan)
- athletic dose / week: plyometric contacts 80-110; all jump contacts 140-190; throws 50-70 (T1); COD cuts 55-70 (MOD. TURN); sprint m 100-140; Olympic sets 6-10
- resistance: goal power / endurance-strength; emphasis hypertrophy 25; strength 40; power 35; rep zone main 3-6, secondary 8-12, quad isometric/slow 3x30-45 s; bilateral/unilateral % of lower compound sets: block start 40/60 -> end 30/70, in season 20/80; contra / ipsi: contralateral for lateral block footwork (INFERRED from CAT-13)
- season: pre-season 60 % of off-season sets (3 lift days); in season 45 % (2 lift days, game-heavy yes); the one hard gym day >= 48 h before a game (COACH-R2 ATH-07)
- Olympic lifts: everyone in athletic training gets Olympic lifts (COACH-ANSWER ATH-10); 60+: none by default; offered as an option with the warning to work with a fitness professional (COACH-R2 ATH-08); older / injured / high-volume clients never get snatch variants (EQ-03)
- injuries: PATELLAR_TENDON, ANKLE_SPRAIN, SHOULDER_THROWER, ACL_LANDING_CUTTING, LOW_BACK_ROTATIONAL, PAIN_GENERAL
- sample week (off season): Mon - A1 knee + pull: warm-up -> core 2 x 2 sets, light (R2-SES-03) -> 2 plyo / ballistic -> clean variant (squat pattern, R2-ATH-04) -> HEAVY SQUAT (axial day  / Tue - B1 hip + push: speed / COD block first (squirrel jumps -> MACH / acceleration starts -> max velocity, LIB-21; route tree EASY -> MOD. -> HARD TURN, ATH-06 / Wed - aerobic 1 + optional Focus / core (optional days ideally separate - ORD-10) / Thu - A2 knee + pull: core 2 x 2 -> 2 plyo / ballistic -> clean variant -> leg press or belt squat (non-axial) + pull -> unilateral knee-dominant -> arm care (p / Fri - B2 hip + push: speed / COD block first (squirrel jumps -> MACH / acceleration starts -> max velocity, LIB-21; route tree EASY -> MOD. -> HARD TURN, ATH-06 / Sat - aerobic 2 + aerobic 3 (or after a lifting day) / Sun - off

#### Volleyball - libero / defensive specialist (`volleyball_libero`)

- ES: Voleibol - líbero / especialista defensivo | category: competitive | sport: volleyball | picked by: volleyball:libero | positions: L, DS
- origin: sports/team.json (unchanged); family field_court; ath03 speed_power; evidence: REUSED from 04 v1 (04v:volleyball_libero)
- why: Jump frequency per match rivals basketball but vertical/bilateral and with less running -> top plyo tier, low sprint/COD, shoulder care. Coach confirms basketball = volleyball at the top of the plyo ranking (ATH-02).
- template: BYOP ATHLETIC 4-day; second A-day plyo slot = approach/block jump; ISO_REAR added for the hitting shoulder
- numbers: 4 main + 2 optional days; 134.5 sets / week (49.5 athletic); contact class 2 (60 % plyometric at block end, 45 % at start); aerobic 3 / pre 2 / in 2 (gym_plan)
- athletic dose / week: plyometric contacts 15-20; all jump contacts 60-80; throws 35-45 (T1); COD cuts 90-120 (MOD. TURN); sprint m 205-275; Olympic sets 6-10
- resistance: goal power / strength; emphasis hypertrophy 25; strength 40; power 35; rep zone main 3-6, secondary 8-12, quad isometric/slow 3x30-45 s; bilateral/unilateral % of lower compound sets: block start 40/60 -> end 30/70, in season 20/80; contra / ipsi: contralateral for lateral block footwork (INFERRED from CAT-13)
- season: pre-season 60 % of off-season sets (3 lift days); in season 42 % (2 lift days, game-heavy yes); the one hard gym day >= 48 h before a game (COACH-R2 ATH-07)
- Olympic lifts: everyone in athletic training gets Olympic lifts (COACH-ANSWER ATH-10); 60+: none by default; offered as an option with the warning to work with a fitness professional (COACH-R2 ATH-08); older / injured / high-volume clients never get snatch variants (EQ-03)
- injuries: PATELLAR_TENDON, ANKLE_SPRAIN, SHOULDER_THROWER, ACL_LANDING_CUTTING, LOW_BACK_ROTATIONAL, PAIN_GENERAL
- sample week (off season): Mon - A1 knee + pull: warm-up -> core 2 x 2 sets, light (R2-SES-03) -> 1 plyo / ballistic -> clean variant (squat pattern, R2-ATH-04) -> HEAVY SQUAT (axial day  / Tue - B1 hip + push: speed / COD block first (squirrel jumps -> MACH / acceleration starts -> max velocity, LIB-21; route tree EASY -> MOD. -> HARD TURN, ATH-06 / Wed - aerobic 1 + optional Focus / core (optional days ideally separate - ORD-10) / Thu - A2 knee + pull: core 2 x 2 -> 1 plyo / ballistic -> clean variant -> leg press or belt squat (non-axial) + pull -> unilateral knee-dominant -> arm care (p / Fri - B2 hip + push: speed / COD block first (squirrel jumps -> MACH / acceleration starts -> max velocity, LIB-21; route tree EASY -> MOD. -> HARD TURN, ATH-06 / Sat - aerobic 2 + aerobic 3 (or after a lifting day) / Sun - off

#### Beach volleyball (pairs) (`volleyball_beach`)

- ES: Voleibol de playa (Beach) | category: competitive | sport: beach_volleyball | picked by: beach_volleyball:blocker, beach_volleyball:defender | positions: blocker, defender
- origin: sports/team.json (new); family field_court; ath03 speed_power; evidence: NEW (PROPOSED budget, INFERRED from SCIENCE)
- why: Two players cover the court: 52-85 jumps per player per match, more small jumps and a higher heart-rate load than indoor; sand slows the push -> class 3 (PROPOSED).
- template: BYOP ATHLETIC 4-day as indoor volleyball; plyo direction more mixed (2 players cover the court)
- numbers: 4 main + 2 optional days; 149 sets / week (63 athletic); contact class 3 (50 % plyometric at block end, 35 % at start); aerobic 3 / pre 2 / in 2 (gym_plan)
- athletic dose / week: plyometric contacts 85-115; all jump contacts 145-195; throws 85-115 (T2); COD cuts 70-95 (HARD TURN); sprint m 155-205; Olympic sets 6-10
- resistance: goal power / endurance-strength; emphasis hypertrophy 25; strength 40; power 35; rep zone main 3-6, secondary 8-12, quad isometric / slow 3 x 30-45 s; bilateral/unilateral % of lower compound sets: block start 30/70 -> end 20/80, in season 10/90; contra / ipsi: contralateral for lateral sand movement (INFERRED from CAT-13)
- season: pre-season 60 % of off-season sets (3 lift days); in season 44 % (2 lift days, game-heavy yes); the one hard gym day >= 48 h before a game (COACH-R2 ATH-07)
- Olympic lifts: everyone in athletic training gets Olympic lifts (COACH-ANSWER ATH-10); 60+: none by default; offered as an option with the warning to work with a fitness professional (COACH-R2 ATH-08); older / injured / high-volume clients never get snatch variants (EQ-03)
- injuries: PATELLAR_TENDON, SHOULDER_THROWER, LOW_BACK_ROTATIONAL, ANKLE_SPRAIN, ACHILLES_CALF, PAIN_GENERAL
- variants: `volleyball_beach_blocker` Blocker (PLYO 2; COD -2); `volleyball_beach_defender` Defender (COD 2; PLYO -2; SPRINT 1)
- sample week (off season): Mon - A1 knee + pull: warm-up -> core 2 x 2 sets, light (R2-SES-03) -> 2 plyo / ballistic -> clean variant (squat pattern, R2-ATH-04) -> HEAVY SQUAT (axial day  / Tue - B1 hip + push: speed / COD block first (squirrel jumps -> MACH / acceleration starts -> max velocity, LIB-21; route tree EASY -> MOD. -> HARD TURN, ATH-06 / Wed - aerobic 1 + optional Focus / core (optional days ideally separate - ORD-10) / Thu - A2 knee + pull: core 2 x 2 -> 2 plyo / ballistic -> clean variant -> leg press or belt squat (non-axial) + pull -> unilateral knee-dominant -> arm care (p / Fri - B2 hip + push: speed / COD block first (squirrel jumps -> MACH / acceleration starts -> max velocity, LIB-21; route tree EASY -> MOD. -> HARD TURN, ATH-06 / Sat - aerobic 2 + aerobic 3 (or after a lifting day) / Sun - off

#### Men's lacrosse - attack (`lacrosse_m_attack`)

- ES: Lacrosse masculino - ataque (Attack) | category: competitive | sport: lacrosse | picked by: lacrosse:attack | positions: A
- origin: sports/team.json (new); family field_court; ath03 speed_power; evidence: NEW (PROPOSED budget, INFERRED from SCIENCE)
- why: Attackers dodge in a tight area behind and around the cage: the most COD and rotational shooting of the men's positions; contact sport (body checks) -> neck and shoulder work.
- template: BYOP ATHLETIC 4-day (4 main + Wed / Sat optional)
- numbers: 4 main + 2 optional days; 154 sets / week (71 athletic); contact class 2 (60 % plyometric at block end, 45 % at start); aerobic 3 / pre 2 / in 2 (gym_plan)
- athletic dose / week: plyometric contacts 80-110; all jump contacts 120-165; throws 75-105 (T2); COD cuts 120-160 (HARD TURN); sprint m 355-485; Olympic sets 6-10
- resistance: goal power / strength; emphasis hypertrophy 20; strength 40; power 40; rep zone STRENGTH main lifts + contrast (L2+, off-season - ATH-12); bilateral/unilateral % of lower compound sets: block start 20/80 -> end 10/90, in season 10/90; contra / ipsi: contralateral loading for cuts and dodges (INFERRED from COACH-ANSWER CAT-13 - same change-of-direction demand); ipsilateral step-ups for acceleration (CAT-13)
- season: pre-season 64 % of off-season sets (3 lift days); in season 41 % (2 lift days, game-heavy yes); the one hard gym day >= 48 h before a game (COACH-R2 ATH-07)
- Olympic lifts: everyone in athletic training gets Olympic lifts (COACH-ANSWER ATH-10); 60+: none by default; offered as an option with the warning to work with a fitness professional (COACH-R2 ATH-08); older / injured / high-volume clients never get snatch variants (EQ-03)
- injuries: ANKLE_SPRAIN, ACL_LANDING_CUTTING, HAMSTRING, GROIN_ADDUCTOR, SHOULDER_CONTACT, NECK, PAIN_GENERAL
- sample week (off season): Mon - A1 knee + pull: warm-up -> core 2 x 2 sets, light (R2-SES-03) -> 2 plyo / ballistic -> clean variant (squat pattern, R2-ATH-04) -> HEAVY SQUAT (axial day  / Tue - B1 hip + push: speed / COD block first (squirrel jumps -> MACH / acceleration starts -> max velocity, LIB-21; route tree EASY -> MOD. -> HARD TURN, ATH-06 / Wed - aerobic 1 + optional Focus / core (optional days ideally separate - ORD-10) / Thu - A2 knee + pull: core 2 x 2 -> 2 plyo / ballistic -> clean variant -> leg press or belt squat (non-axial) + pull -> unilateral knee-dominant -> Nordic / sl / Fri - B2 hip + push: speed / COD block first (squirrel jumps -> MACH / acceleration starts -> max velocity, LIB-21; route tree EASY -> MOD. -> HARD TURN, ATH-06 / Sat - aerobic 2 + aerobic 3 (or after a lifting day) / Sun - off

#### Women's lacrosse - attack (`lacrosse_w_attack`)

- ES: Lacrosse femenino - ataque (Attack) | category: competitive | sport: lacrosse | picked by: lacrosse:attack | positions: A
- origin: sports/team.json (new); family field_court; ath03 speed_power; evidence: NEW (PROPOSED budget, INFERRED from SCIENCE)
- why: No body checking (rules), so less contact strength and neck than the men's game; more total and sprint distance (T3). The difference comes from the RULES of the women's game, not from sex (ATH-09).
- template: BYOP ATHLETIC 4-day (4 main + Wed / Sat optional)
- numbers: 4 main + 2 optional days; 153 sets / week (72 athletic); contact class 2 (60 % plyometric at block end, 45 % at start); aerobic 3 / pre 2 / in 2 (gym_plan)
- athletic dose / week: plyometric contacts 80-110; all jump contacts 120-165; throws 75-105 (T2); COD cuts 120-160 (HARD TURN); sprint m 410-550; Olympic sets 6-10
- resistance: goal power / strength; emphasis hypertrophy 20; strength 40; power 40; rep zone STRENGTH main lifts + contrast (L2+, off-season - ATH-12); bilateral/unilateral % of lower compound sets: block start 20/80 -> end 10/90, in season 10/90; contra / ipsi: contralateral loading for cuts and dodges (INFERRED from COACH-ANSWER CAT-13 - same change-of-direction demand); ipsilateral step-ups for acceleration (CAT-13)
- season: pre-season 65 % of off-season sets (3 lift days); in season 41 % (2 lift days, game-heavy yes); the one hard gym day >= 48 h before a game (COACH-R2 ATH-07)
- Olympic lifts: everyone in athletic training gets Olympic lifts (COACH-ANSWER ATH-10); 60+: none by default; offered as an option with the warning to work with a fitness professional (COACH-R2 ATH-08); older / injured / high-volume clients never get snatch variants (EQ-03)
- injuries: ANKLE_SPRAIN, ACL_LANDING_CUTTING, HAMSTRING, NECK, GROIN_ADDUCTOR, PAIN_GENERAL
- sample week (off season): Mon - A1 knee + pull: warm-up -> core 2 x 2 sets, light (R2-SES-03) -> 2 plyo / ballistic -> clean variant (squat pattern, R2-ATH-04) -> HEAVY SQUAT (axial day  / Tue - B1 hip + push: speed / COD block first (squirrel jumps -> MACH / acceleration starts -> max velocity, LIB-21; route tree EASY -> MOD. -> HARD TURN, ATH-06 / Wed - aerobic 1 + optional Focus / core (optional days ideally separate - ORD-10) / Thu - A2 knee + pull: core 2 x 2 -> 2 plyo / ballistic -> clean variant -> leg press or belt squat (non-axial) + pull -> unilateral knee-dominant -> Nordic / sl / Fri - B2 hip + push: speed / COD block first (squirrel jumps -> MACH / acceleration starts -> max velocity, LIB-21; route tree EASY -> MOD. -> HARD TURN, ATH-06 / Sat - aerobic 2 + aerobic 3 (or after a lifting day) / Sun - off

#### Men's lacrosse - midfield (incl. FOGO variant) (`lacrosse_m_midfield`)

- ES: Lacrosse masculino - mediocampo (Midfield) | category: competitive | sport: lacrosse | picked by: lacrosse:midfield | positions: M, SSDM, FOGO (variant)
- origin: sports/team.json (new); family field_court; ath03 speed_power; evidence: NEW (PROPOSED budget, INFERRED from SCIENCE)
- why: Two-way runners: the highest speed, sprint distance, accelerations and decelerations of the men's positions (T2, T3).
- template: BYOP ATHLETIC 4-day (4 main + Wed / Sat optional)
- numbers: 4 main + 2 optional days; 153 sets / week (70 athletic); contact class 2 (60 % plyometric at block end, 45 % at start); aerobic 4 / pre 2 / in 2 (gym_plan)
- athletic dose / week: plyometric contacts 80-110; all jump contacts 120-165; throws 70-90 (T2); COD cuts 105-145 (HARD TURN); sprint m 460-620; Olympic sets 6-10
- resistance: goal power / endurance-strength; emphasis hypertrophy 20; strength 40; power 40; rep zone STRENGTH main lifts + contrast (L2+, off-season - ATH-12); bilateral/unilateral % of lower compound sets: block start 20/80 -> end 10/90, in season 10/90; contra / ipsi: contralateral loading for cuts and dodges (INFERRED from COACH-ANSWER CAT-13 - same change-of-direction demand); ipsilateral step-ups for acceleration (CAT-13)
- season: pre-season 64 % of off-season sets (3 lift days); in season 41 % (2 lift days, game-heavy yes); the one hard gym day >= 48 h before a game (COACH-R2 ATH-07)
- Olympic lifts: everyone in athletic training gets Olympic lifts (COACH-ANSWER ATH-10); 60+: none by default; offered as an option with the warning to work with a fitness professional (COACH-R2 ATH-08); older / injured / high-volume clients never get snatch variants (EQ-03)
- injuries: HAMSTRING, ANKLE_SPRAIN, ACL_LANDING_CUTTING, GROIN_ADDUCTOR, SHOULDER_CONTACT, NECK, PAIN_GENERAL
- variants: `lacrosse_fogo` Face-off specialist (FOGO) (COD -8; SPRINT -4; PLYO -4; BKD 3; ISO_GRIP 3; ISO_NECK 1; THROW -2)
- sample week (off season): Mon - A1 knee + pull: warm-up -> core 2 x 2 sets, light (R2-SES-03) -> 2 plyo / ballistic -> clean variant (squat pattern, R2-ATH-04) -> HEAVY SQUAT (axial day  / Tue - B1 hip + push: speed / COD block first (squirrel jumps -> MACH / acceleration starts -> max velocity, LIB-21; route tree EASY -> MOD. -> HARD TURN, ATH-06 / Wed - aerobic 1 + optional Focus / core (optional days ideally separate - ORD-10) / Thu - A2 knee + pull: core 2 x 2 -> 2 plyo / ballistic -> clean variant -> leg press or belt squat (non-axial) + pull -> unilateral knee-dominant -> Nordic / sl / Fri - B2 hip + push: speed / COD block first (squirrel jumps -> MACH / acceleration starts -> max velocity, LIB-21; route tree EASY -> MOD. -> HARD TURN, ATH-06 / Sat - aerobic 2 + aerobic 3 (or after a lifting day) / Sun - off (or aerobic 4 when 4 sessions are set)

#### Women's lacrosse - midfield (incl. draw specialist) (`lacrosse_w_midfield`)

- ES: Lacrosse femenino - mediocampo (Midfield) | category: competitive | sport: lacrosse | picked by: lacrosse:midfield | positions: M, draw specialist (variant)
- origin: sports/team.json (new); family field_court; ath03 speed_power; evidence: NEW (PROPOSED budget, INFERRED from SCIENCE)
- why: Women's midfielders and defenders reached the highest top speeds and most accelerations (T3); midfielders run the most.
- template: BYOP ATHLETIC 4-day (4 main + Wed / Sat optional)
- numbers: 4 main + 2 optional days; 152 sets / week (71 athletic); contact class 2 (60 % plyometric at block end, 45 % at start); aerobic 4 / pre 2 / in 2 (gym_plan)
- athletic dose / week: plyometric contacts 80-110; all jump contacts 120-165; throws 70-90 (T2); COD cuts 105-145 (HARD TURN); sprint m 510-690; Olympic sets 6-10
- resistance: goal power / endurance-strength; emphasis hypertrophy 20; strength 40; power 40; rep zone STRENGTH main lifts + contrast (L2+, off-season - ATH-12); bilateral/unilateral % of lower compound sets: block start 20/80 -> end 10/90, in season 10/90; contra / ipsi: contralateral loading for cuts and dodges (INFERRED from COACH-ANSWER CAT-13 - same change-of-direction demand); ipsilateral step-ups for acceleration (CAT-13)
- season: pre-season 65 % of off-season sets (3 lift days); in season 47 % (2 lift days, game-heavy yes); the one hard gym day >= 48 h before a game (COACH-R2 ATH-07)
- Olympic lifts: everyone in athletic training gets Olympic lifts (COACH-ANSWER ATH-10); 60+: none by default; offered as an option with the warning to work with a fitness professional (COACH-R2 ATH-08); older / injured / high-volume clients never get snatch variants (EQ-03)
- injuries: HAMSTRING, ANKLE_SPRAIN, ACL_LANDING_CUTTING, GROIN_ADDUCTOR, NECK, PAIN_GENERAL
- variants: `lacrosse_w_draw` Draw specialist (THROW 2; ISO_GRIP 3; HPULL 1; VPUSH 1)
- sample week (off season): Mon - A1 knee + pull: warm-up -> core 2 x 2 sets, light (R2-SES-03) -> 2 plyo / ballistic -> clean variant (squat pattern, R2-ATH-04) -> HEAVY SQUAT (axial day  / Tue - B1 hip + push: speed / COD block first (squirrel jumps -> MACH / acceleration starts -> max velocity, LIB-21; route tree EASY -> MOD. -> HARD TURN, ATH-06 / Wed - aerobic 1 + optional Focus / core (optional days ideally separate - ORD-10) / Thu - A2 knee + pull: core 2 x 2 -> 2 plyo / ballistic -> clean variant -> leg press or belt squat (non-axial) + pull -> unilateral knee-dominant -> Nordic / sl / Fri - B2 hip + push: speed / COD block first (squirrel jumps -> MACH / acceleration starts -> max velocity, LIB-21; route tree EASY -> MOD. -> HARD TURN, ATH-06 / Sat - aerobic 2 + aerobic 3 (or after a lifting day) / Sun - off (or aerobic 4 when 4 sessions are set)

#### Men's lacrosse - defense (close D / LSM) (`lacrosse_m_defense`)

- ES: Lacrosse masculino - defensa (Defense / LSM) | category: competitive | sport: lacrosse | picked by: lacrosse:defense | positions: D, LSM (variant)
- origin: sports/team.json (new); family field_court; ath03 speed_power; evidence: NEW (PROPOSED budget, INFERRED from SCIENCE)
- why: Close defenders mirror dodgers and deliver checks: strongest lacrosse group, many accelerations / decelerations, less sprinting than midfield.
- template: BYOP ATHLETIC 4-day (4 main + Wed / Sat optional)
- numbers: 4 main + 2 optional days; 154 sets / week (68 athletic); contact class 2 (60 % plyometric at block end, 45 % at start); aerobic 3 / pre 2 / in 2 (gym_plan)
- athletic dose / week: plyometric contacts 75-105; all jump contacts 125-170; throws 60-80 (T2); COD cuts 95-130 (HARD TURN); sprint m 305-415; Olympic sets 7.5-12.5
- resistance: goal strength / power; emphasis hypertrophy 25; strength 45; power 30; rep zone STRENGTH + VOL 2; bilateral/unilateral % of lower compound sets: block start 30/70 -> end 20/80, in season 10/90; contra / ipsi: contralateral loading for cuts and dodges (INFERRED from COACH-ANSWER CAT-13 - same change-of-direction demand); ipsilateral step-ups for acceleration (CAT-13)
- season: pre-season 62 % of off-season sets (3 lift days); in season 42 % (2 lift days, game-heavy yes); the one hard gym day >= 48 h before a game (COACH-R2 ATH-07)
- Olympic lifts: everyone in athletic training gets Olympic lifts (COACH-ANSWER ATH-10); 60+: none by default; offered as an option with the warning to work with a fitness professional (COACH-R2 ATH-08); older / injured / high-volume clients never get snatch variants (EQ-03)
- injuries: ANKLE_SPRAIN, ACL_LANDING_CUTTING, SHOULDER_CONTACT, NECK, GROIN_ADDUCTOR, LOW_BACK_ROTATIONAL, PAIN_GENERAL
- variants: `lacrosse_lsm` Long-stick midfielder (LSM) (SPRINT 2; COD 1)
- sample week (off season): Mon - A1 knee + pull: warm-up -> core 2 x 2 sets, light (R2-SES-03) -> 2 plyo / ballistic -> clean variant (squat pattern, R2-ATH-04) -> HEAVY SQUAT (axial day  / Tue - B1 hip + push: speed / COD block first (squirrel jumps -> MACH / acceleration starts -> max velocity, LIB-21; route tree EASY -> MOD. -> HARD TURN, ATH-06 / Wed - aerobic 1 + optional Focus / core (optional days ideally separate - ORD-10) / Thu - A2 knee + pull: core 2 x 2 -> 2 plyo / ballistic -> clean variant -> leg press or belt squat (non-axial) + pull -> unilateral knee-dominant -> Copenhagen  / Fri - B2 hip + push: speed / COD block first (squirrel jumps -> MACH / acceleration starts -> max velocity, LIB-21; route tree EASY -> MOD. -> HARD TURN, ATH-06 / Sat - aerobic 2 + aerobic 3 (or after a lifting day) / Sun - off

#### Women's lacrosse - defense (`lacrosse_w_defense`)

- ES: Lacrosse femenino - defensa (Defense) | category: competitive | sport: lacrosse | picked by: lacrosse:defense | positions: D
- origin: sports/team.json (new); family field_court; ath03 speed_power; evidence: NEW (PROPOSED budget, INFERRED from SCIENCE)
- why: No body checking (rules): defenders win with footwork and speed rather than contact strength.
- template: BYOP ATHLETIC 4-day (4 main + Wed / Sat optional)
- numbers: 4 main + 2 optional days; 146 sets / week (66 athletic); contact class 2 (60 % plyometric at block end, 45 % at start); aerobic 4 / pre 2 / in 2 (gym_plan)
- athletic dose / week: plyometric contacts 75-100; all jump contacts 115-155; throws 60-80 (T2); COD cuts 105-145 (HARD TURN); sprint m 355-485; Olympic sets 6-10
- resistance: goal power / strength; emphasis hypertrophy 20; strength 45; power 35; rep zone STRENGTH + VOL 2; bilateral/unilateral % of lower compound sets: block start 20/80 -> end 10/90, in season 10/90; contra / ipsi: contralateral loading for cuts and dodges (INFERRED from COACH-ANSWER CAT-13 - same change-of-direction demand); ipsilateral step-ups for acceleration (CAT-13)
- season: pre-season 64 % of off-season sets (3 lift days); in season 41 % (2 lift days, game-heavy yes); the one hard gym day >= 48 h before a game (COACH-R2 ATH-07)
- Olympic lifts: everyone in athletic training gets Olympic lifts (COACH-ANSWER ATH-10); 60+: none by default; offered as an option with the warning to work with a fitness professional (COACH-R2 ATH-08); older / injured / high-volume clients never get snatch variants (EQ-03)
- injuries: ANKLE_SPRAIN, ACL_LANDING_CUTTING, HAMSTRING, GROIN_ADDUCTOR, NECK, PAIN_GENERAL
- sample week (off season): Mon - A1 knee + pull: warm-up -> core 2 x 2 sets, light (R2-SES-03) -> 2 plyo / ballistic -> clean variant (squat pattern, R2-ATH-04) -> HEAVY SQUAT (axial day  / Tue - B1 hip + push: speed / COD block first (squirrel jumps -> MACH / acceleration starts -> max velocity, LIB-21; route tree EASY -> MOD. -> HARD TURN, ATH-06 / Wed - aerobic 1 + optional Focus / core (optional days ideally separate - ORD-10) / Thu - A2 knee + pull: core 2 x 2 -> 2 plyo / ballistic -> clean variant -> leg press or belt squat (non-axial) + pull -> unilateral knee-dominant -> Nordic / sl / Fri - B2 hip + push: speed / COD block first (squirrel jumps -> MACH / acceleration starts -> max velocity, LIB-21; route tree EASY -> MOD. -> HARD TURN, ATH-06 / Sat - aerobic 2 + aerobic 3 (or after a lifting day) / Sun - off (or aerobic 4 when 4 sessions are set)

#### Men's lacrosse - goalie (`lacrosse_m_goalie`)

- ES: Lacrosse masculino - portero (Goalie) | category: competitive | sport: lacrosse | picked by: lacrosse:goalie | positions: G
- origin: sports/team.json (new); family field_court; ath03 speed_power; evidence: NEW (PROPOSED budget, INFERRED from SCIENCE)
- why: Crease goalie: quick visual / auditory reactions and short explosive steps in a small space (T4).
- template: BYOP ATHLETIC 4-day (4 main + Wed / Sat optional)
- numbers: 4 main + 2 optional days; 125 sets / week (46 athletic); contact class 3 (50 % plyometric at block end, 35 % at start); aerobic 3 / pre 2 / in 2 (gym_plan)
- athletic dose / week: plyometric contacts 45-60; all jump contacts 80-110; throws 70-90 (T2); COD cuts 50-65 (MOD. TURN); sprint m 100-140; Olympic sets 6-10
- resistance: goal power / strength; emphasis hypertrophy 25; strength 40; power 35; rep zone main 3-6, secondary 8-12; bilateral/unilateral % of lower compound sets: block start 30/70 -> end 20/80, in season 10/90; contra / ipsi: contralateral loading for cuts and dodges (INFERRED from COACH-ANSWER CAT-13 - same change-of-direction demand); ipsilateral step-ups for acceleration (CAT-13)
- season: pre-season 60 % of off-season sets (3 lift days); in season 46 % (2 lift days, game-heavy yes); the one hard gym day >= 48 h before a game (COACH-R2 ATH-07)
- Olympic lifts: everyone in athletic training gets Olympic lifts (COACH-ANSWER ATH-10); 60+: none by default; offered as an option with the warning to work with a fitness professional (COACH-R2 ATH-08); older / injured / high-volume clients never get snatch variants (EQ-03)
- injuries: HIP_FAI_DEEP_FLEXION, GROIN_ADDUCTOR, WRIST_HAND, NECK, PAIN_GENERAL
- sample week (off season): Mon - A1 knee + pull: warm-up -> core 2 x 2 sets, light (R2-SES-03) -> 2 plyo / ballistic -> clean variant (squat pattern, R2-ATH-04) -> HEAVY SQUAT (axial day  / Tue - B1 hip + push: speed / COD block first (squirrel jumps -> MACH / acceleration starts -> max velocity, LIB-21; route tree EASY -> MOD. -> HARD TURN, ATH-06 / Wed - aerobic 1 + optional Focus / core (optional days ideally separate - ORD-10) / Thu - A2 knee + pull: core 2 x 2 -> 2 plyo / ballistic -> clean variant -> leg press or belt squat (non-axial) + pull -> unilateral knee-dominant -> Copenhagen  / Fri - B2 hip + push: speed / COD block first (squirrel jumps -> MACH / acceleration starts -> max velocity, LIB-21; route tree EASY -> MOD. -> HARD TURN, ATH-06 / Sat - aerobic 2 + aerobic 3 (or after a lifting day) / Sun - off

#### Women's lacrosse - goalie (`lacrosse_w_goalie`)

- ES: Lacrosse femenino - portera / portero (Goalie) | category: competitive | sport: lacrosse | picked by: lacrosse:goalie | positions: G
- origin: sports/team.json (new); family field_court; ath03 speed_power; evidence: NEW (PROPOSED budget, INFERRED from SCIENCE)
- why: Same job as the men's goalie (the women's goalie wears the full protective kit).
- template: BYOP ATHLETIC 4-day (4 main + Wed / Sat optional)
- numbers: 4 main + 2 optional days; 125 sets / week (46 athletic); contact class 3 (50 % plyometric at block end, 35 % at start); aerobic 3 / pre 2 / in 2 (gym_plan)
- athletic dose / week: plyometric contacts 45-60; all jump contacts 80-110; throws 70-90 (T2); COD cuts 50-65 (MOD. TURN); sprint m 100-140; Olympic sets 6-10
- resistance: goal power / strength; emphasis hypertrophy 25; strength 40; power 35; rep zone main 3-6, secondary 8-12; bilateral/unilateral % of lower compound sets: block start 30/70 -> end 20/80, in season 10/90; contra / ipsi: contralateral loading for cuts and dodges (INFERRED from COACH-ANSWER CAT-13 - same change-of-direction demand); ipsilateral step-ups for acceleration (CAT-13)
- season: pre-season 60 % of off-season sets (3 lift days); in season 46 % (2 lift days, game-heavy yes); the one hard gym day >= 48 h before a game (COACH-R2 ATH-07)
- Olympic lifts: everyone in athletic training gets Olympic lifts (COACH-ANSWER ATH-10); 60+: none by default; offered as an option with the warning to work with a fitness professional (COACH-R2 ATH-08); older / injured / high-volume clients never get snatch variants (EQ-03)
- injuries: HIP_FAI_DEEP_FLEXION, GROIN_ADDUCTOR, WRIST_HAND, NECK, PAIN_GENERAL
- sample week (off season): Mon - A1 knee + pull: warm-up -> core 2 x 2 sets, light (R2-SES-03) -> 2 plyo / ballistic -> clean variant (squat pattern, R2-ATH-04) -> HEAVY SQUAT (axial day  / Tue - B1 hip + push: speed / COD block first (squirrel jumps -> MACH / acceleration starts -> max velocity, LIB-21; route tree EASY -> MOD. -> HARD TURN, ATH-06 / Wed - aerobic 1 + optional Focus / core (optional days ideally separate - ORD-10) / Thu - A2 knee + pull: core 2 x 2 -> 2 plyo / ballistic -> clean variant -> leg press or belt squat (non-axial) + pull -> unilateral knee-dominant -> Copenhagen  / Fri - B2 hip + push: speed / COD block first (squirrel jumps -> MACH / acceleration starts -> max velocity, LIB-21; route tree EASY -> MOD. -> HARD TURN, ATH-06 / Sat - aerobic 2 + aerobic 3 (or after a lifting day) / Sun - off

#### Field hockey - field players (forwards / midfielders / defenders) (`field_hockey_field`)

- ES: Hockey sobre césped - jugadores de campo | category: competitive | sport: field_hockey | picked by: field_hockey:forward, field_hockey:midfield, field_hockey:defense | positions: F, M, D
- origin: sports/team.json (new); family field_court; ath03 speed_power; evidence: NEW (PROPOSED budget, INFERRED from SCIENCE)
- why: Soccer-like running and cutting done in 30-50 degrees of trunk flexion with asymmetric rotation toward the stick side: low-back endurance and hip-flexor care are fixed accessories.
- template: BYOP ATHLETIC 4-day (as soccer) + a fixed back-extension / hinge-endurance slot
- numbers: 4 main + 2 optional days; 141 sets / week (60 athletic); contact class 2 (60 % plyometric at block end, 45 % at start); aerobic 3 / pre 2 / in 2 (gym_plan)
- athletic dose / week: plyometric contacts 70-95; all jump contacts 105-145; throws 50-70 (T1); COD cuts 95-130 (HARD TURN); sprint m 410-550; Olympic sets 4.5-7.5
- resistance: goal power / endurance-strength; emphasis hypertrophy 20; strength 40; power 40; rep zone STRENGTH low volume + contrast (L2+, off-season - ATH-12); bilateral/unilateral % of lower compound sets: block start 20/80 -> end 10/90, in season 10/90; contra / ipsi: contralateral loading for cuts and dodges (INFERRED from COACH-ANSWER CAT-13 - same change-of-direction demand); ipsilateral step-ups for acceleration (CAT-13)
- season: pre-season 63 % of off-season sets (3 lift days); in season 42 % (2 lift days, game-heavy yes); the one hard gym day >= 48 h before a game (COACH-R2 ATH-07)
- Olympic lifts: everyone in athletic training gets Olympic lifts (COACH-ANSWER ATH-10); 60+: none by default; offered as an option with the warning to work with a fitness professional (COACH-R2 ATH-08); older / injured / high-volume clients never get snatch variants (EQ-03)
- injuries: LOW_BACK_FLEXED_POSTURE, ANKLE_SPRAIN, HAMSTRING, GROIN_ADDUCTOR, ACL_LANDING_CUTTING, NECK, PAIN_GENERAL
- variants: `field_hockey_forward` Forwards (SPRINT 2; COD 1); `field_hockey_midfielder` Midfielders; `field_hockey_defender` Defenders (BKD 1; BHD 1; COD 1; SPRINT -1)
- sample week (off season): Mon - A1 knee + pull: warm-up -> core 2 x 2 sets, light (R2-SES-03) -> 2 plyo / ballistic -> clean variant (squat pattern, R2-ATH-04) -> HEAVY SQUAT (axial day  / Tue - B1 hip + push: speed / COD block first (squirrel jumps -> MACH / acceleration starts -> max velocity, LIB-21; route tree EASY -> MOD. -> HARD TURN, ATH-06 / Wed - aerobic 1 + optional Focus / core (optional days ideally separate - ORD-10) / Thu - A2 knee + pull: core 2 x 2 -> 2 plyo / ballistic -> leg press or belt squat (non-axial) + pull -> unilateral knee-dominant -> Nordic / slider curls, Copen / Fri - B2 hip + push: speed / COD block first (squirrel jumps -> MACH / acceleration starts -> max velocity, LIB-21; route tree EASY -> MOD. -> HARD TURN, ATH-06 / Sat - aerobic 2 + aerobic 3 (or after a lifting day) / Sun - off

#### Field hockey - goalkeeper (`field_hockey_gk`)

- ES: Hockey sobre césped - portero (Goalkeeper) | category: competitive | sport: field_hockey | picked by: field_hockey:goalkeeper | positions: GK
- origin: sports/team.json (new); family field_court; ath03 speed_power; evidence: NEW (PROPOSED budget, INFERRED from SCIENCE)
- why: Low-stance lateral saves in heavy pads: hip, groin and knee deep-flexion care plus lateral power.
- template: BYOP ATHLETIC 4-day (4 main + Wed / Sat optional)
- numbers: 4 main + 2 optional days; 119 sets / week (40 athletic); contact class 3 (50 % plyometric at block end, 35 % at start); aerobic 3 / pre 2 / in 2 (gym_plan)
- athletic dose / week: plyometric contacts 40-55; all jump contacts 80-110; throws 50-70 (T1); COD cuts 50-65 (MOD. TURN); sprint m 100-140; Olympic sets 4.5-7.5
- resistance: goal power / strength; emphasis hypertrophy 25; strength 40; power 35; rep zone main 3-6, secondary 8-12; bilateral/unilateral % of lower compound sets: block start 30/70 -> end 20/80, in season 10/90; contra / ipsi: contralateral loading for cuts and dodges (INFERRED from COACH-ANSWER CAT-13 - same change-of-direction demand); ipsilateral step-ups for acceleration (CAT-13)
- season: pre-season 60 % of off-season sets (3 lift days); in season 46 % (2 lift days, game-heavy yes); the one hard gym day >= 48 h before a game (COACH-R2 ATH-07)
- Olympic lifts: everyone in athletic training gets Olympic lifts (COACH-ANSWER ATH-10); 60+: none by default; offered as an option with the warning to work with a fitness professional (COACH-R2 ATH-08); older / injured / high-volume clients never get snatch variants (EQ-03)
- injuries: HIP_FAI_DEEP_FLEXION, GROIN_ADDUCTOR, KNEE_DEEP_FLEXION, LOW_BACK_FLEXED_POSTURE, WRIST_HAND, PAIN_GENERAL
- sample week (off season): Mon - A1 knee + pull: warm-up -> core 2 x 2 sets, light (R2-SES-03) -> 2 plyo / ballistic -> clean variant (squat pattern, R2-ATH-04) -> HEAVY SQUAT (axial day  / Tue - B1 hip + push: speed / COD block first (squirrel jumps -> MACH / acceleration starts -> max velocity, LIB-21; route tree EASY -> MOD. -> HARD TURN, ATH-06 / Wed - aerobic 1 + optional Focus / core (optional days ideally separate - ORD-10) / Thu - A2 knee + pull: core 2 x 2 -> 2 plyo / ballistic -> leg press or belt squat (non-axial) + pull -> unilateral knee-dominant -> Copenhagen plank, back-exten / Fri - B2 hip + push: speed / COD block first (squirrel jumps -> MACH / acceleration starts -> max velocity, LIB-21; route tree EASY -> MOD. -> HARD TURN, ATH-06 / Sat - aerobic 2 + aerobic 3 (or after a lifting day) / Sun - off

#### Rugby union - forwards (front row / locks / back row) (`rugby_forwards`)

- ES: Rugby - delanteros (Forwards) | category: competitive | sport: rugby | picked by: rugby:forwards | positions: prop, hooker, lock, flanker, No. 8
- origin: sports/team.json (new), base `football_lineman`; family field_court; ath03 resistance; evidence: NEW (PROPOSED budget, INFERRED from SCIENCE)
- why: Coach: rugby needs more resistance training (ATH-03). Forwards do the collisions, scrums, rucks and mauls (T10): lineman-level strength + neck, with more running and conditioning than linemen.
- template: BYOP ATHLETIC 4-day with the lineman's resistance slots + neck and carries
- numbers: 4 main + 2 optional days; 151.5 sets / week (41 athletic); contact class 4 (40 % plyometric at block end, 25 % at start); aerobic 3 / pre 2 / in 2 (gym_plan)
- athletic dose / week: plyometric contacts 25-30; all jump contacts 40-55; throws 70-90 (T2); COD cuts 50-65 (MOD. TURN); sprint m 305-415; Olympic sets 7.5-12.5
- resistance: goal strength / hypertrophy; emphasis hypertrophy 30; strength 50; power 20; rep zone STRENGTH 3-5 + VOL 2 8-12 for mass; bilateral/unilateral % of lower compound sets: block start 50/50 -> end 40/60, in season 30/70; contra / ipsi: contra / ipsi lunges and step-ups as health accessories, more in the first 2-4 weeks, then bilateral-dominant (COACH-ANSWER CAT-13 size / strength rule; applied to strength-type athletes INFERRED)
- season: pre-season 60 % of off-season sets (3 lift days); in season 45 % (2 lift days, game-heavy yes); the one hard gym day >= 48 h before a game (COACH-R2 ATH-07)
- Olympic lifts: everyone in athletic training gets Olympic lifts (COACH-ANSWER ATH-10); 60+: none by default; offered as an option with the warning to work with a fitness professional (COACH-R2 ATH-08); older / injured / high-volume clients never get snatch variants (EQ-03)
- injuries: NECK, SHOULDER_CONTACT, LOW_BACK_LOADING, HAMSTRING, ACL_LANDING_CUTTING, PAIN_GENERAL
- variants: `rugby_front_row` Front row (props / hooker) (ISO_NECK 2; BKD 1; SPRINT -2); `rugby_lock` Locks (PLYO 2; VPUSH 2); `rugby_back_row` Back row (flankers / No. 8) (COD 2; SPRINT 2; PLYO 1)
- sample week (off season): Mon - A1 knee + pull: warm-up -> core 2 x 2 sets, light (R2-SES-03) -> 1 plyo / ballistic -> clean variant (squat pattern, R2-ATH-04) -> HEAVY SQUAT (axial day  / Tue - B1 hip + push: speed / COD block first (squirrel jumps -> MACH / acceleration starts -> max velocity, LIB-21; route tree EASY -> MOD. -> HARD TURN, ATH-06 / Wed - aerobic 1 + optional Focus / core (optional days ideally separate - ORD-10) / Thu - A2 knee + pull: core 2 x 2 -> 1 plyo / ballistic -> clean variant -> leg press or belt squat (non-axial) + pull -> unilateral knee-dominant -> Nordic / sl / Fri - B2 hip + push: speed / COD block first (squirrel jumps -> MACH / acceleration starts -> max velocity, LIB-21; route tree EASY -> MOD. -> HARD TURN, ATH-06 / Sat - aerobic 2 + aerobic 3 (or after a lifting day) / Sun - off

#### Rugby union - backs (halves / centres / back three) (`rugby_backs`)

- ES: Rugby - tres cuartos (Backs) | category: competitive | sport: rugby | picked by: rugby:backs | positions: scrum-half, fly-half, centre, wing, fullback
- origin: sports/team.json (delta), base `football_big_skill`; family field_court; ath03 resistance; evidence: 04 v1 (04:football_big_skill) + PROPOSED deltas
- why: Backs do more high-speed running and fewer collisions than forwards (T10): the big-skill football profile with more sprint and COD.
- template: BYOP ATHLETIC 4-day
- numbers: 4 main + 2 optional days; 152.5 sets / week (63 athletic); contact class 3 (50 % plyometric at block end, 35 % at start); aerobic 3 / pre 2 / in 2 (gym_plan)
- athletic dose / week: plyometric contacts 65-85; all jump contacts 105-145; throws 75-105 (T2); COD cuts 85-115 (HARD TURN); sprint m 410-550; Olympic sets 7.5-12.5
- resistance: goal power / strength; emphasis hypertrophy 25; strength 45; power 30; rep zone STRENGTH + VOL 2; bilateral/unilateral % of lower compound sets: block start 30/70 -> end 20/80, in season 10/90; contra / ipsi: contralateral loading for cuts and dodges (INFERRED from COACH-ANSWER CAT-13 - same change-of-direction demand); ipsilateral step-ups for acceleration (CAT-13)
- season: pre-season 62 % of off-season sets (3 lift days); in season 48 % (2 lift days, game-heavy yes); the one hard gym day >= 48 h before a game (COACH-R2 ATH-07)
- Olympic lifts: everyone in athletic training gets Olympic lifts (COACH-ANSWER ATH-10); 60+: none by default; offered as an option with the warning to work with a fitness professional (COACH-R2 ATH-08); older / injured / high-volume clients never get snatch variants (EQ-03)
- injuries: HAMSTRING, NECK, SHOULDER_CONTACT, ACL_LANDING_CUTTING, ANKLE_SPRAIN, GROIN_ADDUCTOR, PAIN_GENERAL
- variants: `rugby_halves` Halves (9 / 10) (THROW 2; SPRINT -1); `rugby_centres` Centres (BKD 1; HPUSH 1; ISO_NECK 1); `rugby_back_three` Back three (wings / fullback) (SPRINT 2; PLYO 1)
- sample week (off season): Mon - A1 knee + pull: warm-up -> core 2 x 2 sets, light (R2-SES-03) -> 2 plyo / ballistic -> clean variant (squat pattern, R2-ATH-04) -> HEAVY SQUAT (axial day  / Tue - B1 hip + push: speed / COD block first (squirrel jumps -> MACH / acceleration starts -> max velocity, LIB-21; route tree EASY -> MOD. -> HARD TURN, ATH-06 / Wed - aerobic 1 + optional Focus / core (optional days ideally separate - ORD-10) / Thu - A2 knee + pull: core 2 x 2 -> 2 plyo / ballistic -> clean variant -> leg press or belt squat (non-axial) + pull -> unilateral knee-dominant -> Nordic / sl / Fri - B2 hip + push: speed / COD block first (squirrel jumps -> MACH / acceleration starts -> max velocity, LIB-21; route tree EASY -> MOD. -> HARD TURN, ATH-06 / Sat - aerobic 2 + aerobic 3 (or after a lifting day) / Sun - off

#### Rugby sevens (`rugby_sevens`)

- ES: Rugby 7 (Sevens) | category: competitive | sport: rugby | picked by: rugby:sevens | positions: forward, back
- origin: sports/team.json (delta), base `football_big_skill`; family field_court; ath03 resistance; evidence: 04 v1 (04:football_big_skill) + PROPOSED deltas
- why: Same field, 7 players: more running and tackles per minute than 15s; tournaments of about 6 matches in 2-3 days (T12).
- template: BYOP ATHLETIC 4-day
- numbers: 4 main + 2 optional days; 156.5 sets / week (67 athletic); contact class 2 (60 % plyometric at block end, 45 % at start); aerobic 4 / pre 2 / in 2 (gym_plan)
- athletic dose / week: plyometric contacts 75-100; all jump contacts 110-150; throws 70-90 (T2); COD cuts 95-130 (HARD TURN); sprint m 560-760; Olympic sets 7.5-12.5
- resistance: goal power / endurance-strength; emphasis hypertrophy 25; strength 45; power 30; rep zone STRENGTH + VOL 2; bilateral/unilateral % of lower compound sets: block start 20/80 -> end 10/90, in season 10/90; contra / ipsi: contralateral loading for cuts and dodges (INFERRED from COACH-ANSWER CAT-13 - same change-of-direction demand); ipsilateral step-ups for acceleration (CAT-13)
- season: pre-season 63 % of off-season sets (3 lift days); in season 48 % (2 lift days, game-heavy yes); the one hard gym day >= 48 h before a game (COACH-R2 ATH-07)
- Olympic lifts: everyone in athletic training gets Olympic lifts (COACH-ANSWER ATH-10); 60+: none by default; offered as an option with the warning to work with a fitness professional (COACH-R2 ATH-08); older / injured / high-volume clients never get snatch variants (EQ-03)
- injuries: HAMSTRING, NECK, SHOULDER_CONTACT, ACL_LANDING_CUTTING, ANKLE_SPRAIN, GROIN_ADDUCTOR, PAIN_GENERAL
- sample week (off season): Mon - A1 knee + pull: warm-up -> core 2 x 2 sets, light (R2-SES-03) -> 2 plyo / ballistic -> clean variant (squat pattern, R2-ATH-04) -> HEAVY SQUAT (axial day  / Tue - B1 hip + push: speed / COD block first (squirrel jumps -> MACH / acceleration starts -> max velocity, LIB-21; route tree EASY -> MOD. -> HARD TURN, ATH-06 / Wed - aerobic 1 + optional Focus / core (optional days ideally separate - ORD-10) / Thu - A2 knee + pull: core 2 x 2 -> 2 plyo / ballistic -> clean variant -> leg press or belt squat (non-axial) + pull -> unilateral knee-dominant -> Nordic / sl / Fri - B2 hip + push: speed / COD block first (squirrel jumps -> MACH / acceleration starts -> max velocity, LIB-21; route tree EASY -> MOD. -> HARD TURN, ATH-06 / Sat - aerobic 2 + aerobic 3 (or after a lifting day) / Sun - off (or aerobic 4 when 4 sessions are set)

#### Cheerleading / STUNT - bases and back spots (`cheer_base_spot`)

- ES: Cheerleading (porrismo) / STUNT - bases y spotters (Bases / Back spots) | category: competitive | sport: cheerleading | picked by: cheerleading:base, cheerleading:back_spot | positions: main base, side base, back spot
- origin: sports/team.json (new); family field_court; ath03 resistance; evidence: NEW (PROPOSED budget, INFERRED from SCIENCE)
- why: 'Competitive spirit' is now the 6th biggest girls' school sport (T33). Bases and spotters suffer most stunt injuries (T13): overhead lockout, squat-catch strength, wrists and low back first.
- template: BYOP ATHLETIC 4-day with a vertical-push / overhead-hold emphasis (toss and catch)
- numbers: 4 main + 2 optional days; 124 sets / week (36 athletic); contact class 4 (40 % plyometric at block end, 25 % at start); aerobic 2 / pre 2 / in 2 (gym_plan)
- athletic dose / week: plyometric contacts 25-30; all jump contacts 55-75; throws 70-90 (T2); COD cuts 10-15 (EASY TURN); sprint m 0; Olympic sets 9-15
- resistance: goal strength / power; emphasis hypertrophy 30; strength 50; power 20; rep zone STRENGTH 3-6 + VOL 2 8-12; bilateral/unilateral % of lower compound sets: block start 50/50 -> end 40/60, in season 30/70; contra / ipsi: contra / ipsi lunges and step-ups as health accessories, more in the first 2-4 weeks, then bilateral-dominant (COACH-ANSWER CAT-13 size / strength rule; applied to strength-type athletes INFERRED)
- season: pre-season 60 % of off-season sets (3 lift days); in season 47 % (2 lift days, game-heavy yes); the one hard gym day >= 48 h before a game (COACH-R2 ATH-07)
- Olympic lifts: everyone in athletic training gets Olympic lifts (COACH-ANSWER ATH-10); 60+: none by default; offered as an option with the warning to work with a fitness professional (COACH-R2 ATH-08); older / injured / high-volume clients never get snatch variants (EQ-03)
- injuries: STUNT_CATCH_LOAD, LOW_BACK_LOADING, WRIST_HAND, SHOULDER_CONTACT, ANKLE_SPRAIN, NECK, PAIN_GENERAL
- sample week (off season): Mon - A1 knee + pull: warm-up -> core 2 x 2 sets, light (R2-SES-03) -> 1 plyo / ballistic -> clean variant (squat pattern, R2-ATH-04) -> HEAVY SQUAT (axial day  / Tue - B1 hip + push: core 2 x 2 -> plyo + medball throws -> snatch variant (hinge pattern) -> non-axial hinge (hip thrust / back extension / reverse hyper) + ho / Wed - aerobic 1 + optional Focus / core (optional days ideally separate - ORD-10) / Thu - A2 knee + pull: core 2 x 2 -> 1 plyo / ballistic -> clean variant -> leg press or belt squat (non-axial) + pull -> unilateral knee-dominant -> neck isomet / Fri - B2 hip + push: core 2 x 2 -> plyo + medball throws -> snatch variant (hinge pattern) -> HEAVY DEADLIFT / trap-bar (axial day 2, R2-SES-01) + push -> unila / Sat - aerobic 2 / Sun - off

#### Cheerleading / STUNT - flyers and tumblers (`cheer_flyer_tumbler`)

- ES: Cheerleading (porrismo) / STUNT - voladores y tumbling (Flyers / Tumblers) | category: competitive | sport: cheerleading | picked by: cheerleading:flyer, cheerleading:tumbler | positions: flyer, tumbler / all-around
- origin: sports/team.json (new); family field_court; ath03 speed_power; evidence: NEW (PROPOSED budget, INFERRED from SCIENCE)
- why: Flyers and tumblers are jumpers: very short tumbling contacts (T15) and heavy dismount landings (T14) -> landing stage first, ankle stiffness, rigid core and wrists.
- template: BYOP ATHLETIC 4-day; landing (Receive) work every block; tumbling passes are practice volume
- numbers: 4 main + 2 optional days; 124 sets / week (45 athletic); contact class 2 (60 % plyometric at block end, 45 % at start); aerobic 2 / pre 2 / in 2 (gym_plan)
- athletic dose / week: plyometric contacts 55-75; all jump contacts 105-145; throws 60-80 (T2); COD cuts 25-30 (EASY TURN); sprint m 100-140; Olympic sets 4.5-7.5
- resistance: goal power / strength; emphasis hypertrophy 20; strength 40; power 40; rep zone main 4-6, secondary 8-12; bilateral/unilateral % of lower compound sets: block start 30/70 -> end 20/80, in season 10/90; contra / ipsi: contra / ipsi lunges as health accessories (INFERRED from CAT-13)
- season: pre-season 60 % of off-season sets (3 lift days); in season 48 % (2 lift days, game-heavy yes); the one hard gym day >= 48 h before a game (COACH-R2 ATH-07)
- Olympic lifts: everyone in athletic training gets Olympic lifts (COACH-ANSWER ATH-10); 60+: none by default; offered as an option with the warning to work with a fitness professional (COACH-R2 ATH-08); older / injured / high-volume clients never get snatch variants (EQ-03)
- injuries: TUMBLING_LANDING, ANKLE_SPRAIN, WRIST_HAND, ACL_LANDING_CUTTING, LOW_BACK_LOADING, NECK, PAIN_GENERAL
- sample week (off season): Mon - A1 knee + pull: warm-up -> core 2 x 2 sets, light (R2-SES-03) -> 2 plyo / ballistic -> clean variant (squat pattern, R2-ATH-04) -> HEAVY SQUAT (axial day  / Tue - B1 hip + push: core 2 x 2 -> plyo + medball throws -> snatch variant (hinge pattern) -> non-axial hinge (hip thrust / back extension / reverse hyper) + ho / Wed - aerobic 1 + optional Focus / core (optional days ideally separate - ORD-10) / Thu - A2 knee + pull: core 2 x 2 -> 2 plyo / ballistic -> leg press or belt squat (non-axial) + pull -> unilateral knee-dominant -> neck isometrics 4-way -> cal / Fri - B2 hip + push: core 2 x 2 -> plyo + medball throws -> snatch variant (hinge pattern) -> HEAVY DEADLIFT / trap-bar (axial day 2, R2-SES-01) + push -> unila / Sat - aerobic 2 / Sun - off

#### Ultimate - handlers (`ultimate_handler`)

- ES: Ultimate (frisbee) - handlers (lanzadores) | category: competitive | sport: ultimate | picked by: ultimate:handler | positions: handler
- origin: sports/team.json (delta), base `soccer`; family field_court; ath03 speed_power; evidence: 04 v1 (04:soccer) + PROPOSED deltas
- why: Handlers throw most of the passes and make short resets: more rotational throws, fewer long sprints than cutters.
- template: BYOP ATHLETIC 4-day (2-3 in-season) + Copenhagen + Nordic as fixed accessories
- numbers: 4 main + 2 optional days; 141 sets / week (63 athletic); contact class 3 (50 % plyometric at block end, 35 % at start); aerobic 3 / pre 2 / in 2 (gym_plan)
- athletic dose / week: plyometric contacts 60-80; all jump contacts 100-140; throws 70-90 (T2); COD cuts 105-145 (HARD TURN); sprint m 355-485; Olympic sets 4.5-7.5
- resistance: goal power / strength; emphasis hypertrophy 20; strength 40; power 40; rep zone STRENGTH low volume + contrast (L2+, off-season - ATH-12); bilateral/unilateral % of lower compound sets: block start 20/80 -> end 10/90, in season 10/90; contra / ipsi: contralateral loading for cuts and dodges (INFERRED from COACH-ANSWER CAT-13 - same change-of-direction demand); ipsilateral step-ups for acceleration (CAT-13)
- season: pre-season 64 % of off-season sets (3 lift days); in season 42 % (2 lift days, game-heavy yes); the one hard gym day >= 48 h before a game (COACH-R2 ATH-07)
- Olympic lifts: everyone in athletic training gets Olympic lifts (COACH-ANSWER ATH-10); 60+: none by default; offered as an option with the warning to work with a fitness professional (COACH-R2 ATH-08); older / injured / high-volume clients never get snatch variants (EQ-03)
- injuries: ANKLE_SPRAIN, ACL_LANDING_CUTTING, HAMSTRING, SHOULDER_THROWER, LOW_BACK_ROTATIONAL, PAIN_GENERAL
- sample week (off season): Mon - A1 knee + pull: warm-up -> core 2 x 2 sets, light (R2-SES-03) -> 2 plyo / ballistic -> clean variant (squat pattern, R2-ATH-04) -> HEAVY SQUAT (axial day  / Tue - B1 hip + push: speed / COD block first (squirrel jumps -> MACH / acceleration starts -> max velocity, LIB-21; route tree EASY -> MOD. -> HARD TURN, ATH-06 / Wed - aerobic 1 + optional Focus / core (optional days ideally separate - ORD-10) / Thu - A2 knee + pull: core 2 x 2 -> 2 plyo / ballistic -> leg press or belt squat (non-axial) + pull -> unilateral knee-dominant -> Nordic / slider curls -> cal / Fri - B2 hip + push: speed / COD block first (squirrel jumps -> MACH / acceleration starts -> max velocity, LIB-21; route tree EASY -> MOD. -> HARD TURN, ATH-06 / Sat - aerobic 2 + aerobic 3 (or after a lifting day) / Sun - off

#### Ultimate - cutters (`ultimate_cutter`)

- ES: Ultimate (frisbee) - cutters (corredores) | category: competitive | sport: ultimate | picked by: ultimate:cutter | positions: cutter, deep
- origin: sports/team.json (delta), base `soccer`; family field_court; ath03 speed_power; evidence: 04 v1 (04:soccer) + PROPOSED deltas
- why: Intense intermittent sport (mean HR 82% HRmax, 17 sprints a game - T17) played in tournaments of many games: repeat-sprint capacity, hamstrings and ankles first.
- template: BYOP ATHLETIC 4-day (2-3 in-season) + Copenhagen + Nordic as fixed accessories
- numbers: 4 main + 2 optional days; 139 sets / week (64 athletic); contact class 2 (60 % plyometric at block end, 45 % at start); aerobic 4 / pre 2 / in 2 (gym_plan)
- athletic dose / week: plyometric contacts 65-90; all jump contacts 105-145; throws 50-70 (T1); COD cuts 105-145 (HARD TURN); sprint m 510-690; Olympic sets 4.5-7.5
- resistance: goal power / endurance-strength; emphasis hypertrophy 20; strength 35; power 45; rep zone STRENGTH low volume + contrast (L2+, off-season - ATH-12); bilateral/unilateral % of lower compound sets: block start 20/80 -> end 10/90, in season 10/90; contra / ipsi: contralateral loading for cuts and dodges (INFERRED from COACH-ANSWER CAT-13 - same change-of-direction demand); ipsilateral step-ups for acceleration (CAT-13)
- season: pre-season 65 % of off-season sets (3 lift days); in season 48 % (2 lift days, game-heavy yes); the one hard gym day >= 48 h before a game (COACH-R2 ATH-07)
- Olympic lifts: everyone in athletic training gets Olympic lifts (COACH-ANSWER ATH-10); 60+: none by default; offered as an option with the warning to work with a fitness professional (COACH-R2 ATH-08); older / injured / high-volume clients never get snatch variants (EQ-03)
- injuries: HAMSTRING, ANKLE_SPRAIN, ACL_LANDING_CUTTING, GROIN_ADDUCTOR, SHOULDER_CONTACT, PAIN_GENERAL
- sample week (off season): Mon - A1 knee + pull: warm-up -> core 2 x 2 sets, light (R2-SES-03) -> 2 plyo / ballistic -> clean variant (squat pattern, R2-ATH-04) -> HEAVY SQUAT (axial day  / Tue - B1 hip + push: speed / COD block first (squirrel jumps -> MACH / acceleration starts -> max velocity, LIB-21; route tree EASY -> MOD. -> HARD TURN, ATH-06 / Wed - aerobic 1 + optional Focus / core (optional days ideally separate - ORD-10) / Thu - A2 knee + pull: core 2 x 2 -> 2 plyo / ballistic -> leg press or belt squat (non-axial) + pull -> unilateral knee-dominant -> Nordic / slider curls -> cal / Fri - B2 hip + push: speed / COD block first (squirrel jumps -> MACH / acceleration starts -> max velocity, LIB-21; route tree EASY -> MOD. -> HARD TURN, ATH-06 / Sat - aerobic 2 + aerobic 3 (or after a lifting day) / Sun - off (or aerobic 4 when 4 sessions are set)

### 8.2 Aquatic, endurance and track

#### Swimming - sprint (50-100) (`swimming_sprint`)

- ES: Natación - velocidad (50-100) | category: competitive | sport: swimming | picked by: swimming:sprint | positions: 50 free, 100 free, 100 back, 100 breast, 100 fly
- origin: sports/aquatic-endurance-track.json (new); family aquatic; ath03 speed_power; evidence: INFERRED + SCIENCE (needs analysis AQ1-AQ13, AQ40); coach rules applied (COACH-ANSWER / COACH-R2)
- why: Sprint races are decided by power off the block and walls plus stroke force: lower-body maximal strength and jump power explain 55-73 % of start performance (AQ6), and strength at 85-100 % 1RM plus plyometrics improve turns (AQ5). Sprinters need the longest power preparation (AQ40). The pool already supplies the aerobic work, so dryland is strength, power, shoulder health (AQ3) and bone loading (AQ8).
- template: 3 dryland days (A knee + pull / B hip + push / C full) + 1 optional Focus day; pool sessions around them
- numbers: 3 main + 1 optional days (2 + 1 for younger / lower-level swimmers - COACH-R3 ATH-01); 97 sets / week (23 athletic); contact class 5 (25 % plyometric at block end, 10 % at start); aerobic 0 / pre 0 / in 0 (sport_plan)
- athletic dose / week: plyometric contacts 8-12; all jump contacts 42-57; throws 40-55 (T1); COD cuts 0 (-); sprint m 0; Olympic sets 4.5-7.5
- resistance: goal strength / power; emphasis hypertrophy 15; strength 45; power 40; rep zone STRENGTH 3-5 + POWER (VOL 1 -> VOL 2 -> VOL 3 one per block, PER-11); hypertrophy only where the coach adds size; bilateral/unilateral % of lower compound sets: block start 50/50 -> end 60/40, in season 50/50; contra / ipsi: neither is a race driver: contra / ipsi lunges and step-ups are HEALTH accessories for hips and low back, mostly in weeks 1-4 of a block (CAT-13 size / strength logic); the kick start is a staggered s
- season: pre-season 60 % of off-season sets (- lift days); in season 40 % (2 lift days, game-heavy no); the harder lift >= 48 h before a meet (COACH-R2 ATH-07 spacing applied to meets - INFERRED extension)
- Olympic lifts: everyone in athletic training gets Olympic lifts (COACH-ANSWER ATH-10); 60+: none by default; offered as an option with the warning 'Make sure that you have a fitness professional to help you understand what this means' (COACH-R2 ATH-08); older / injured / high-volume clients 
- injuries: SHOULDER_SWIMMER, LOW_BACK_EXTENSION, KNEE_MEDIAL_KICK, BONE_LOADING_NON_IMPACT, PAIN_GENERAL
- variants: `stroke_free` Freestyle (front crawl); `stroke_back` Backstroke (ISO_REAR 1; BALL 1; THROW -1); `stroke_breast` Breaststroke (UKD 1; UHD -1; FOCUS 1); `stroke_fly` Butterfly (BHD 1; VPUSH -1; CORE 0); `stroke_im` Individual medley (IM) (FOCUS 1)
- sample week (off season): Mon - A knee + pull (before or after a pool session, >= 4 h apart when possible): warm-up (5 min any cardio + A March / Skip or mobility; never counte / Wed - B hip + push: warm-up (5 min any cardio + A March / Skip or mobility; never counted - ORD-08) -> core 2 x 2 light (dead bug / hollow / side plan / Fri - C full: warm-up (5 min any cardio + A March / Skip or mobility; never counted - ORD-08) -> core 2 x 2 light (dead bug / hollow / side plank - AT / Sat or after any pool session (optional Focus day, ORD-10): rotator cuff (side-lying ER, prone Y / T), scapular push-up plus, hip internal-rotation mo / pool practices on the other sessions (the swim coach's plan = the aerobic work); 2-4 exercises per muscle trained that day (COACH-R2 SES-05) - lats an
- dryland realism (v1.1 sport verification; approved COACH-R3 ATH-01): pool_load: the pool supplies the aerobic work (elite about 40-70 km a week - AQ12): 0 extra gym aerobic sessions by default; the user can add one (COACH-R3 ATH-01, ATH-04; COACH-R2 SES-06); an optional land Orange only in the transition block; dryland_days: 3 dryland gym days + 1 optional around pool training; 2 for younger or lower-level swimmers (COACH-R3 ATH-01; 'younger' = under about 14 or L1 - PROPOSED); each >= 4 h from a hard pool set when possible (INFERRED); focus: strength and power for starts and turns (lower-body max strength and jump power relate to 15 m start time - West et al. 2011, r = -0.74 to -0.85, AQ6) + shoulder health every session + trunk; plyo: jump work mostly ballistic: 25 % plyometric at the end of a block (class 5; start 10 %), because starts and turns are single big efforts (COACH-R3 ATH-01, ATH-04); ballistic jumps from a start / streamline position; small ankle block for bone (AQ8); no depth jumps, bounds or hurdle hops by default; shoulder: shoulder care in every dryland session: external rotation, floor Y / T raises, KB face pulls - never bands (COACH-R3 ATH-01); low-volume, seated or landmine overhead pressing; overhead medball throws kept off heavy-pull pool days; snatch variants single-arm DB first; taper: a 2-week dryland taper lined up with the swim coach's pool taper before the main championship meet; 1 week or none before smaller meets (COACH-R3 ATH-01); the swim coach tapers the pool, the tool tapers dryland only; olympic: Olympic lifts 2-3 days a week (COACH-R3 ATH-01): sprint and middle-distance 3 by default, distance 2
- open: sprint swimmers lean bilateral (55/45 mid-block) unlike land athletes - approve?
- **v1.2 (round 3):** COACH-R3 ATH-01 approved the dryland defaults: 3 dryland gym days + 1 optional around pool training (2 for younger or lower-level swimmers); 0 extra gym cardio (the pool is the aerobic work; the user can add one); jump work mostly ballistic, 25 % plyometric at the end of a block; Olympic lifts 2-3 days (this profile: 3); shoulder care (external rotation, floor Y / T raises, KB face pulls) every session, never bands; a 2-week dryland taper lined up with the swim coach's taper before the main championship meet, 1 week or none before smaller meets | sample week fixed in v1.2: the B (hip + push) day and the optional third pre-season lift now carry shoulder care too, so every dryland session has it | no check-ins (COACH-R3 VOL-02): the whole dryland plan is printed ahead; in a heavy pool week the swimmer or coach switches off that day's athletic block or removes sets (COACH-R3 SES-02)

#### Swimming - middle distance (200-400 / IM) (`swimming_middle`)

- ES: Natación - medio fondo (200-400 / combinado) | category: competitive | sport: swimming | picked by: swimming:middle | positions: 200 free, 400 free / 500 yd, 200 back / breast / fly, 200 IM, 400 IM
- origin: sports/aquatic-endurance-track.json (new); family aquatic; ath03 speed_power; evidence: INFERRED + SCIENCE (needs analysis AQ1-AQ13, AQ40); coach rules applied (COACH-ANSWER / COACH-R2)
- why: 200-400 events mix speed with a large aerobic share; dryland keeps the sprinter's strength-power base at a lower dose and adds strength-endurance for the shoulder girdle and hips (AQ40). IM swimmers are usually here.
- template: 3 dryland days (A knee + pull / B hip + push / C full) + 1 optional Focus day; pool sessions around them
- numbers: 3 main + 1 optional days (2 + 1 for younger / lower-level swimmers - COACH-R3 ATH-01); 94 sets / week (21 athletic); contact class 5 (25 % plyometric at block end, 10 % at start); aerobic 0 / pre 0 / in 0 (sport_plan)
- athletic dose / week: plyometric contacts 6-8; all jump contacts 37-49; throws 35-45 (T1); COD cuts 0 (-); sprint m 0; Olympic sets 4.5-7.5
- resistance: goal strength / power; emphasis hypertrophy 10; strength 45; power 30; endurance_strength 15; rep zone STRENGTH 4-6 + POWER; one accessory per day at 12-15 reps (VOL 1) for shoulder / hip endurance; bilateral/unilateral % of lower compound sets: block start 50/50 -> end 55/45, in season 45/55; contra / ipsi: neither is a race driver: contra / ipsi lunges and step-ups are HEALTH accessories for hips and low back, mostly in weeks 1-4 of a block (CAT-13 size / strength logic); the kick start is a staggered s
- season: pre-season 60 % of off-season sets (- lift days); in season 40 % (2 lift days, game-heavy no); the harder lift >= 48 h before a meet (COACH-R2 ATH-07 spacing applied to meets - INFERRED extension)
- Olympic lifts: everyone in athletic training gets Olympic lifts (COACH-ANSWER ATH-10); 60+: none by default; offered as an option with the warning 'Make sure that you have a fitness professional to help you understand what this means' (COACH-R2 ATH-08); older / injured / high-volume clients 
- injuries: SHOULDER_SWIMMER, LOW_BACK_EXTENSION, KNEE_MEDIAL_KICK, BONE_LOADING_NON_IMPACT, PAIN_GENERAL
- variants: `stroke_free` Freestyle (front crawl); `stroke_back` Backstroke (ISO_REAR 1; BALL 1; THROW -1); `stroke_breast` Breaststroke (UKD 1; UHD -1; FOCUS 1); `stroke_fly` Butterfly (BHD 1; VPUSH -1; CORE 0); `stroke_im` Individual medley (IM) (FOCUS 1)
- sample week (off season): Mon - A knee + pull (before or after a pool session, >= 4 h apart when possible): warm-up (5 min any cardio + A March / Skip or mobility; never counte / Wed - B hip + push: warm-up (5 min any cardio + A March / Skip or mobility; never counted - ORD-08) -> core 2 x 2 light (dead bug / hollow / side plan / Fri - C full: warm-up (5 min any cardio + A March / Skip or mobility; never counted - ORD-08) -> core 2 x 2 light (dead bug / hollow / side plank - AT / Sat or after any pool session (optional Focus day, ORD-10): rotator cuff, scapular stabilisers, hip IR / adductors (Copenhagen) for IM and breaststrok / pool practices on the other sessions (the swim coach's plan = the aerobic work); 2-4 exercises per muscle trained that day (COACH-R2 SES-05) - lats an
- dryland realism (v1.1 sport verification; approved COACH-R3 ATH-01): pool_load: the pool supplies the aerobic work (elite about 40-70 km a week - AQ12): 0 extra gym aerobic sessions by default; the user can add one (COACH-R3 ATH-01, ATH-04; COACH-R2 SES-06); an optional land Orange only in the transition block; dryland_days: 3 dryland gym days + 1 optional around pool training; 2 for younger or lower-level swimmers (COACH-R3 ATH-01; 'younger' = under about 14 or L1 - PROPOSED); each >= 4 h from a hard pool set when possible (INFERRED); focus: strength and power for starts and turns (lower-body max strength and jump power relate to 15 m start time - West et al. 2011, r = -0.74 to -0.85, AQ6) + shoulder health every session + trunk; plyo: jump work mostly ballistic: 25 % plyometric at the end of a block (class 5; start 10 %), because starts and turns are single big efforts (COACH-R3 ATH-01, ATH-04); ballistic jumps from a start / streamline position; small ankle block for bone (AQ8); no depth jumps, bounds or hurdle hops by default; shoulder: shoulder care in every dryland session: external rotation, floor Y / T raises, KB face pulls - never bands (COACH-R3 ATH-01); low-volume, seated or landmine overhead pressing; overhead medball throws kept off heavy-pull pool days; snatch variants single-arm DB first; taper: a 2-week dryland taper lined up with the swim coach's pool taper before the main championship meet; 1 week or none before smaller meets (COACH-R3 ATH-01); the swim coach tapers the pool, the tool tapers dryland only; olympic: Olympic lifts 2-3 days a week (COACH-R3 ATH-01): sprint and middle-distance 3 by default, distance 2
- **v1.2 (round 3):** COACH-R3 ATH-01 approved the dryland defaults: 3 dryland gym days + 1 optional around pool training (2 for younger or lower-level swimmers); 0 extra gym cardio (the pool is the aerobic work; the user can add one); jump work mostly ballistic, 25 % plyometric at the end of a block; Olympic lifts 2-3 days (this profile: 3); shoulder care (external rotation, floor Y / T raises, KB face pulls) every session, never bands; a 2-week dryland taper lined up with the swim coach's taper before the main championship meet, 1 week or none before smaller meets | sample week fixed in v1.2: the B (hip + push) day and the optional third pre-season lift now carry shoulder care too, so every dryland session has it | no check-ins (COACH-R3 VOL-02): the whole dryland plan is printed ahead; in a heavy pool week the swimmer or coach switches off that day's athletic block or removes sets (COACH-R3 SES-02)

#### Swimming - distance (800-1500 / open water) (`swimming_distance`)

- ES: Natación - fondo (800-1500 / aguas abiertas) | category: competitive | sport: swimming | picked by: swimming:distance | positions: 500 / 1000 / 1650 yd, 800 / 1500 m, open water 5-10 km
- origin: sports/aquatic-endurance-track.json (new); family aquatic; ath03 endurance; evidence: INFERRED + SCIENCE (needs analysis AQ1-AQ13, AQ40); coach rules applied (COACH-ANSWER / COACH-R2)
- why: Distance swimmers carry the biggest pool load and the most shoulder revolutions (AQ3): dryland is stability and endurance-strength for the shoulder girdle, hips and core with a small strength and power dose (AQ40), plus jumping and heavy lifting for bone (AQ8). Turns still matter (dozens per race), so a small ballistic block stays.
- template: 3 dryland days (A knee + pull / B hip + push / C full) + 1 optional Focus day; pool sessions around them
- numbers: 3 main + 1 optional days (2 + 1 for younger / lower-level swimmers - COACH-R3 ATH-01); 73 sets / week (13 athletic); contact class 5 (25 % plyometric at block end, 10 % at start); aerobic 0 / pre 0 / in 0 (sport_plan)
- athletic dose / week: plyometric contacts 3; all jump contacts 22-30; throws 25-35 (T1); COD cuts 0 (-); sprint m 0; Olympic sets 2-4
- resistance: goal endurance-strength / strength; emphasis hypertrophy 5; strength 35; power 15; endurance_strength 45; rep zone VOL 1 -> VOL 2 (12-15 then 8-12) for accessories; one strength lift per day at 4-6 reps; DB / cable / single-arm work for stability (no bands, EQ-01); bilateral/unilateral % of lower compound sets: block start 40/60 -> end 40/60, in season 30/70; contra / ipsi: neither is a race driver: contra / ipsi lunges and step-ups are HEALTH accessories for hips and low back, mostly in weeks 1-4 of a block (CAT-13 size / strength logic); the kick start is a staggered s
- season: pre-season 60 % of off-season sets (- lift days); in season 40 % (2 lift days, game-heavy no); the harder lift >= 48 h before a meet (COACH-R2 ATH-07 spacing applied to meets - INFERRED extension)
- Olympic lifts: everyone in athletic training gets Olympic lifts (COACH-ANSWER ATH-10); 60+: none by default; offered as an option with the warning 'Make sure that you have a fitness professional to help you understand what this means' (COACH-R2 ATH-08); older / injured / high-volume clients 
- injuries: SHOULDER_SWIMMER, LOW_BACK_EXTENSION, KNEE_MEDIAL_KICK, BONE_LOADING_NON_IMPACT, PAIN_GENERAL
- variants: `stroke_free` Freestyle (front crawl); `stroke_back` Backstroke (ISO_REAR 1; BALL 1; THROW -1); `stroke_breast` Breaststroke (UKD 1; UHD -1; FOCUS 1); `stroke_fly` Butterfly (BHD 1; VPUSH -1; CORE 0); `stroke_im` Individual medley (IM) (FOCUS 1)
- sample week (off season): Mon - A knee + pull (before or after a pool session, >= 4 h apart when possible): warm-up (5 min any cardio + A March / Skip or mobility; never counte / Wed - B hip + push: warm-up (5 min any cardio + A March / Skip or mobility; never counted - ORD-08) -> core 2 x 2 light (dead bug / hollow / side plan / Fri - C full: warm-up (5 min any cardio + A March / Skip or mobility; never counted - ORD-08) -> core 2 x 2 light (dead bug / hollow / side plank - AT / Sat or after any pool session (optional Focus day, ORD-10): rotator cuff endurance (2 x 15-20 side-lying ER, prone Y / T), scapular push-up plus, hip  / pool practices on the other sessions (the swim coach's plan = the aerobic work); 2-4 exercises per muscle trained that day (COACH-R2 SES-05) - lats an
- dryland realism (v1.1 sport verification; approved COACH-R3 ATH-01): pool_load: the pool supplies the aerobic work (elite about 40-70 km a week - AQ12): 0 extra gym aerobic sessions by default; the user can add one (COACH-R3 ATH-01, ATH-04; COACH-R2 SES-06); an optional land Orange only in the transition block; dryland_days: 3 dryland gym days + 1 optional around pool training; 2 for younger or lower-level swimmers (COACH-R3 ATH-01; 'younger' = under about 14 or L1 - PROPOSED); each >= 4 h from a hard pool set when possible (INFERRED); focus: strength and power for starts and turns (lower-body max strength and jump power relate to 15 m start time - West et al. 2011, r = -0.74 to -0.85, AQ6) + shoulder health every session + trunk; plyo: jump work mostly ballistic: 25 % plyometric at the end of a block (class 5; start 10 %), because starts and turns are single big efforts (COACH-R3 ATH-01, ATH-04); ballistic jumps from a start / streamline position; small ankle block for bone (AQ8); no depth jumps, bounds or hurdle hops by default; shoulder: shoulder care in every dryland session: external rotation, floor Y / T raises, KB face pulls - never bands (COACH-R3 ATH-01); low-volume, seated or landmine overhead pressing; overhead medball throws kept off heavy-pull pool days; snatch variants single-arm DB first; taper: a 2-week dryland taper lined up with the swim coach's pool taper before the main championship meet; 1 week or none before smaller meets (COACH-R3 ATH-01); the swim coach tapers the pool, the tool tapers dryland only; olympic: Olympic lifts 2-3 days a week (COACH-R3 ATH-01): sprint and middle-distance 3 by default, distance 2
- **v1.2 (round 3):** COACH-R3 ATH-01 approved the dryland defaults: 3 dryland gym days + 1 optional around pool training (2 for younger or lower-level swimmers); 0 extra gym cardio (the pool is the aerobic work; the user can add one); jump work mostly ballistic, 25 % plyometric at the end of a block; Olympic lifts 2-3 days (this profile: 2); shoulder care (external rotation, floor Y / T raises, KB face pulls) every session, never bands; a 2-week dryland taper lined up with the swim coach's taper before the main championship meet, 1 week or none before smaller meets | sample week fixed in v1.2: the B (hip + push) day and the optional third pre-season lift now carry shoulder care too, so every dryland session has it | no check-ins (COACH-R3 VOL-02): the whole dryland plan is printed ahead; in a heavy pool week the swimmer or coach switches off that day's athletic block or removes sets (COACH-R3 SES-02)

#### Diving (springboard / platform) (`diving`)

- ES: Clavados (trampolín / plataforma) | category: competitive | sport: diving | picked by: diving:springboard, diving:platform | positions: 1 m springboard, 3 m springboard, platform 5 / 7.5 / 10 m
- origin: sports/aquatic-endurance-track.json (new); family aquatic; ath03 speed_power; evidence: INFERRED + SCIENCE (AQ14, AQ15); coach rules applied
- why: Divers need maximal jump height, fast rotation (tight tuck / pike = hip-flexor and core compression strength), and overhead shoulder and wrist stability for entries. Injuries cluster at the shoulder, lumbar spine (repetitive hyperextension -> spondylolysis, LBP up to 89 % lifetime) and wrist / hand (AQ14). Land jumping volume is already high in dry-board and trampoline work, so the gym biases ballistic, low-contact jumps and strength.
- template: 3 dryland strength / power days + 1 optional Focus day; dry-board, trampoline and pool diving are the sport (not generated)
- numbers: 3 main + 1 optional days; 99 sets / week (29 athletic); contact class 4 (40 % plyometric at block end, 25 % at start); aerobic 2 / pre 2 / in 2 (gym_plan)
- athletic dose / week: plyometric contacts 30-40; all jump contacts 75-100; throws 50-70 (T1); COD cuts 0 (-); sprint m 0; Olympic sets 4-6
- resistance: goal strength / power; emphasis hypertrophy 10; strength 45; power 45; rep zone STRENGTH 3-5 + POWER; bilateral/unilateral % of lower compound sets: block start 50/50 -> end 60/40, in season 40/60; contra / ipsi: ipsilateral step-ups for the hurdle-step drive (out of the hip - CAT-13 sprinter logic, INFERRED); contra / ipsi lunges as early-block health accessories
- season: pre-season 60 % of off-season sets (- lift days); in season 40 % (2 lift days, game-heavy no); the harder lift >= 48 h before a meet (INFERRED extension of COACH-R2 ATH-07)
- Olympic lifts: everyone in athletic training gets Olympic lifts (COACH-ANSWER ATH-10); 60+: none by default; offered as an option with the warning 'Make sure that you have a fitness professional to help you understand what this means' (COACH-R2 ATH-08); older / injured / high-volume clients 
- injuries: SHOULDER_SWIMMER, LOW_BACK_EXTENSION, WRIST_HAND, PATELLAR_TENDON, BONE_LOADING_NON_IMPACT, PAIN_GENERAL
- variants: `diving_platform` Platform (ISO_GRIP 1; VPUSH 1; BALL -1)
- sample week (off season): Mon - knee + pull: warm-up (5 min any cardio + A March / Skip or mobility; never counted - ORD-08) -> core 2 x 2 light (dead bug / hollow / side plank - ATH-11, / Wed - hip + push: warm-up (5 min any cardio + A March / Skip or mobility; never counted - ORD-08) -> core 2 x 2 light (dead bug / hollow / side plank - ATH-11,  / Fri - full: warm-up (5 min any cardio + A March / Skip or mobility; never counted - ORD-08) -> core 2 x 2 light (dead bug / hollow / side plank - ATH-11, R2-SES / optional Focus day: overhead stability holds, handstand prep (platform), hip-flexor compression, wrist conditioning / aerobic 2 x (Orange / Green) on dry-board or pool days
- open: diving class 4 (40 % plyometric) because the springboard contact is long and board-timed - approve? no depth jumps for divers by default (the board supplies reactive loading) - approve?

#### Water polo - field players (drivers, wings, point, defenders) (`water_polo_field`)

- ES: Waterpolo - jugadores de campo (Field players) | category: competitive | sport: water_polo | picked by: water_polo:field | positions: driver / attacker, wing, point, field defender
- origin: sports/aquatic-endurance-track.json (new); family aquatic; ath03 rotational_power; evidence: INFERRED + SCIENCE (AQ16, AQ17, AQ18)
- why: Field players swim, wrestle and throw without a stable base: up to 80 % report shoulder pain in their career (AQ17), and the eggbeater kick loads the medial knee and hip / groin (AQ16, AQ17). The gym builds rotational and overhead throwing power with heavy shoulder care, hip / adductor strength for the eggbeater, and leg power for the vertical 'boost' out of the water.
- template: 3 weight sessions a week (the elite norm - AQ16) + 1 optional Focus day; polo and swim practices are the sport
- numbers: 3 main + 1 optional days; 96 sets / week (22 athletic); contact class 5 (25 % plyometric at block end, 10 % at start); aerobic 0 / pre 0 / in 0 (sport_plan)
- athletic dose / week: plyometric contacts 10-15; all jump contacts 40-55; throws 50-70 (T1); COD cuts 0 (-); sprint m 0; Olympic sets 4.5-7.5
- resistance: goal strength / power; emphasis hypertrophy 15; strength 45; power 40; rep zone STRENGTH 4-6 + POWER; VOL 1 -> 3 per block (PER-11); bilateral/unilateral % of lower compound sets: block start 40/60 -> end 40/60, in season 30/70; contra / ipsi: contralateral loading (load opposite the working leg) for the throwing rotation and eggbeater hip control ('into the hip' - CAT-13 COD logic applied INFERRED); frontal / transverse unilateral work for
- season: pre-season 60 % of off-season sets (- lift days); in season 40 % (2 lift days, game-heavy no); the harder lift >= 48 h before a game (COACH-R2 ATH-07 spacing)
- Olympic lifts: everyone in athletic training gets Olympic lifts (COACH-ANSWER ATH-10); 60+: none by default; offered as an option with the warning 'Make sure that you have a fitness professional to help you understand what this means' (COACH-R2 ATH-08); older / injured / high-volume clients 
- injuries: SHOULDER_SWIMMER, SHOULDER_THROWER, KNEE_MEDIAL_KICK, GROIN_ADDUCTOR, LOW_BACK_ROTATIONAL, BONE_LOADING_NON_IMPACT, NECK, PAIN_GENERAL
- sample week (off season): Mon - knee + pull: warm-up (5 min any cardio + A March / Skip or mobility; never counted - ORD-08) -> core 2 x 2 light (dead bug / hollow / side plank - ATH-11, / Wed - hip + push: warm-up (5 min any cardio + A March / Skip or mobility; never counted - ORD-08) -> core 2 x 2 light (dead bug / hollow / side plank - ATH-11,  / Fri - full: warm-up (5 min any cardio + A March / Skip or mobility; never counted - ORD-08) -> core 2 x 2 light (dead bug / hollow / side plank - ATH-11, R2-SES / optional Focus day: hip internal / external rotation strength, adductors, cuff / polo and swim practices on the other sessions; 2-4 exercises per muscle trained that day (COACH-R2 SES-05)
- open: field players: moderate medball (T2) rather than the 'high' rotational level, because they already throw a lot - approve?

#### Water polo - center (2-meter) and center defender (`water_polo_center`)

- ES: Waterpolo - boya / centro (Center) y defensor de boya | category: competitive | sport: water_polo | picked by: water_polo:center | positions: center (hole set), center defender
- origin: sports/aquatic-endurance-track.json (delta), base `water_polo_field`; family aquatic; ath03 resistance; evidence: INFERRED + SCIENCE (AQ16, AQ17, AQ18)
- why: Centers fight for position all game (wrestling in the water) and shoot with their back to goal: more bilateral strength and size, like the contact 'more resistance' group (ATH-03 linemen / wrestlers), on top of the field-player shoulder and hip care.
- template: 3 weight sessions a week (the elite norm - AQ16) + 1 optional Focus day; polo and swim practices are the sport
- numbers: 3 main + 1 optional days; 102 sets / week (22 athletic); contact class 5 (25 % plyometric at block end, 10 % at start); aerobic 0 / pre 0 / in 0 (sport_plan)
- athletic dose / week: plyometric contacts 10-15; all jump contacts 40-55; throws 50-70 (T1); COD cuts 0 (-); sprint m 0; Olympic sets 4.5-7.5
- resistance: goal strength / hypertrophy; emphasis hypertrophy 25; strength 50; power 25; rep zone STRENGTH 3-6 + hypertrophy accessories 8-12; bilateral/unilateral % of lower compound sets: block start 55/45 -> end 60/40, in season 40/60; contra / ipsi: contralateral loading (load opposite the working leg) for the throwing rotation and eggbeater hip control ('into the hip' - CAT-13 COD logic applied INFERRED); frontal / transverse unilateral work for
- season: pre-season 60 % of off-season sets (- lift days); in season 40 % (2 lift days, game-heavy no); the harder lift >= 48 h before a game (COACH-R2 ATH-07 spacing)
- Olympic lifts: everyone in athletic training gets Olympic lifts (COACH-ANSWER ATH-10); 60+: none by default; offered as an option with the warning 'Make sure that you have a fitness professional to help you understand what this means' (COACH-R2 ATH-08); older / injured / high-volume clients 
- injuries: SHOULDER_SWIMMER, SHOULDER_THROWER, KNEE_MEDIAL_KICK, GROIN_ADDUCTOR, LOW_BACK_ROTATIONAL, BONE_LOADING_NON_IMPACT, NECK, PAIN_GENERAL
- sample week (off season): Mon - knee + pull: warm-up (5 min any cardio + A March / Skip or mobility; never counted - ORD-08) -> core 2 x 2 light (dead bug / hollow / side plank - ATH-11, / Wed - hip + push: warm-up (5 min any cardio + A March / Skip or mobility; never counted - ORD-08) -> core 2 x 2 light (dead bug / hollow / side plank - ATH-11,  / Fri - full: warm-up (5 min any cardio + A March / Skip or mobility; never counted - ORD-08) -> core 2 x 2 light (dead bug / hollow / side plank - ATH-11, R2-SES / optional Focus day: hip internal / external rotation strength, adductors, cuff / polo and swim practices on the other sessions
- open: centers in the 'more resistance' group (like linemen / wrestlers) - approve?

#### Water polo - goalkeeper (`water_polo_goalkeeper`)

- ES: Waterpolo - portero (Goalkeeper) | category: competitive | sport: water_polo | picked by: water_polo:goalkeeper | positions: goalkeeper
- origin: sports/aquatic-endurance-track.json (delta), base `water_polo_field`; family aquatic; ath03 speed_power; evidence: INFERRED + SCIENCE (AQ16, AQ17, AQ18)
- why: Goalkeepers explode vertically and laterally out of the water to block and rarely shoot: more ballistic leg power and frontal-plane hip strength, overhead reach strength, fewer throws.
- template: 3 weight sessions a week (the elite norm - AQ16) + 1 optional Focus day; polo and swim practices are the sport
- numbers: 3 main + 1 optional days; 98 sets / week (22 athletic); contact class 5 (25 % plyometric at block end, 10 % at start); aerobic 0 / pre 0 / in 0 (sport_plan)
- athletic dose / week: plyometric contacts 10-15; all jump contacts 50-70; throws 25-35 (T1); COD cuts 0 (-); sprint m 0; Olympic sets 4.5-7.5
- resistance: goal power / strength; emphasis hypertrophy 10; strength 40; power 50; rep zone STRENGTH 3-5 + POWER; bilateral/unilateral % of lower compound sets: block start 40/60 -> end 35/65, in season 30/70; contra / ipsi: contralateral loading (load opposite the working leg) for the throwing rotation and eggbeater hip control ('into the hip' - CAT-13 COD logic applied INFERRED); frontal / transverse unilateral work for
- season: pre-season 60 % of off-season sets (- lift days); in season 40 % (2 lift days, game-heavy no); the harder lift >= 48 h before a game (COACH-R2 ATH-07 spacing)
- Olympic lifts: everyone in athletic training gets Olympic lifts (COACH-ANSWER ATH-10); 60+: none by default; offered as an option with the warning 'Make sure that you have a fitness professional to help you understand what this means' (COACH-R2 ATH-08); older / injured / high-volume clients 
- injuries: SHOULDER_SWIMMER, SHOULDER_THROWER, KNEE_MEDIAL_KICK, GROIN_ADDUCTOR, LOW_BACK_ROTATIONAL, BONE_LOADING_NON_IMPACT, NECK, PAIN_GENERAL
- sample week (off season): Mon - knee + pull: warm-up (5 min any cardio + A March / Skip or mobility; never counted - ORD-08) -> core 2 x 2 light (dead bug / hollow / side plank - ATH-11, / Wed - hip + push: warm-up (5 min any cardio + A March / Skip or mobility; never counted - ORD-08) -> core 2 x 2 light (dead bug / hollow / side plank - ATH-11,  / Fri - full: warm-up (5 min any cardio + A March / Skip or mobility; never counted - ORD-08) -> core 2 x 2 light (dead bug / hollow / side plank - ATH-11, R2-SES / optional Focus day: hip internal / external rotation strength, adductors, cuff / polo and swim practices on the other sessions
- open: goalkeepers: more ballistic jumps, fewer throws - approve?

#### Track - sprints (100-200 m) (`track_sprinter`)

- ES: Atletismo - velocidad (100-200 m) | category: competitive | sport: track_and_field | picked by: track_and_field:sprints | positions: 60 m (indoor), 100 m, 200 m, 4 x 100 relay
- origin: 04_v1 (04); family field_court; ath03 speed_power; evidence: INFERRED (sprint itself is the sport; the S&C profile is what the generator writes)
- why: Sprinting is the S&C priority; plyos are horizontal and stiffness-oriented; hamstrings are the injury driver. Speed / power group (COACH-ANSWER ATH-03): more plyos than ballistics, 'even though they will have ballistics' (ATH-01); ipsilateral step-ups for the take-off (CAT-13); sprints in season (PER-08).
- template: BYOP ATHLETIC 4-day with SPRINT slots as the anchor
- numbers: 4 main + 2 optional days; 128 sets / week (54 athletic); contact class 1 (75 % plyometric at block end, 60 % at start); aerobic 2 / pre 2 / in 2 (gym_plan)
- athletic dose / week: plyometric contacts 90-120; all jump contacts 110-150; throws 40-60 (T1); COD cuts 0 (-); sprint m 600-1000; Olympic sets 8-12
- resistance: goal strength / power; emphasis hypertrophy 15; strength 45; power 40; rep zone STRENGTH 3-5 + POWER; bilateral/unilateral % of lower compound sets: block start 40/60 -> end 30/70, in season 20/80; contra / ipsi: ipsilateral step-ups for the acceleration take-off ('get out of the hip', COACH-ANSWER CAT-13)
- season: pre-season 60 % of off-season sets (- lift days); in season 40 % (2 lift days, game-heavy no); the harder lift >= 48 h before a meet (COACH-R2 ATH-07 spacing applied to meets)
- Olympic lifts: everyone in athletic training gets Olympic lifts (COACH-ANSWER ATH-10); 60+: none by default; offered as an option with the warning 'Make sure that you have a fitness professional to help you understand what this means' (COACH-R2 ATH-08); older / injured / high-volume clients 
- injuries: HAMSTRING, ACHILLES_CALF, HIP_FLEXOR, LOW_BACK_LOADING, PAIN_GENERAL
- promoted v1 variants: track_400 -> now the full profile `track_400` (position profile in v1.1); track_jumper -> now the full profile `track_jumper` (position profile in v1.1); track_thrower -> now the full profile `track_thrower` (position profile in v1.1)
- sample week (off season): Mon - speed + knee + pull: warm-up (5 min any cardio + A March / Skip / Run; A-drills never count - ORD-08) -> speed block first: squirrel jumps -> MACH / accel / Tue - hip + push: warm-up (5 min any cardio + A March / Skip / Run; A-drills never count - ORD-08) -> core 2 x 2 light (ATH-11, R2-SES-03) -> medball throws + b / Wed - track session (coach) or aerobic 1 + optional Focus / Thu - speed + knee + pull: warm-up (5 min any cardio + A March / Skip / Run; A-drills never count - ORD-08) -> flying 20s / max velocity 3-4 x -> core 2 x 2 lig / Fri - hip + push: warm-up (5 min any cardio + A March / Skip / Run; A-drills never count - ORD-08) -> core 2 x 2 light (ATH-11, R2-SES-03) -> plyo + throws -> s / Sat - aerobic 2 (Orange / Green) or track session; Sun off / 2-4 exercises per muscle trained that day (COACH-R2 SES-05); consolidate athletic work if over 12 + 2 core (COACH-R2 SES-04)

#### Track - 400 m (`track_400`)

- ES: Atletismo - 400 m | category: competitive | sport: track_and_field | picked by: track_and_field:400 | positions: 400 m, 4 x 400 relay
- origin: sports/aquatic-endurance-track.json (delta), base `track_sprinter`; family field_court; ath03 speed_power; evidence: 04 v1 variant 'track_400' (notes only: add LC and B conditioning) built out: sprinter budget + PROPOSED deltas
- why: The 400 m is a sprint with a large aerobic share (about 41-45 % aerobic - AQ19): the sprinter's strength-power profile with slightly fewer plyometric contacts, plus speed-endurance and lactate-clearance conditioning (04 note: add LC and B).
- template: BYOP ATHLETIC 4-day with SPRINT slots as the anchor
- numbers: 4 main + 2 optional days; 124.5 sets / week (50.5 athletic); contact class 1 (75 % plyometric at block end, 60 % at start); aerobic 2 / pre 2 / in 2 (gym_plan)
- athletic dose / week: plyometric contacts 75-105; all jump contacts 100-130; throws 40-55 (T1); COD cuts 0 (-); sprint m 610-830; Olympic sets 7.5-12.5
- resistance: goal strength / power; emphasis hypertrophy 15; strength 45; power 35; endurance_strength 5; rep zone STRENGTH 3-5 + POWER; one 12-15-rep accessory (VOL 1) for hamstring / calf work capacity; bilateral/unilateral % of lower compound sets: block start 40/60 -> end 30/70, in season 20/80; contra / ipsi: ipsilateral step-ups for acceleration (CAT-13)
- season: pre-season 60 % of off-season sets (- lift days); in season 40 % (2 lift days, game-heavy no); the harder lift >= 48 h before a meet (COACH-R2 ATH-07 spacing applied to meets)
- Olympic lifts: everyone in athletic training gets Olympic lifts (COACH-ANSWER ATH-10); 60+: none by default; offered as an option with the warning 'Make sure that you have a fitness professional to help you understand what this means' (COACH-R2 ATH-08); older / injured / high-volume clients 
- injuries: HAMSTRING, ACHILLES_CALF, HIP_FLEXOR, LOW_BACK_LOADING, PAIN_GENERAL
- sample week (off season): Mon - speed + knee + pull: warm-up (5 min any cardio + A March / Skip / Run; A-drills never count - ORD-08) -> speed block first: squirrel jumps -> MACH / accel / Tue - hip + push: warm-up (5 min any cardio + A March / Skip / Run; A-drills never count - ORD-08) -> core 2 x 2 light (ATH-11, R2-SES-03) -> medball throws + b / Wed - track session (coach) or aerobic 1 + optional Focus / Thu - speed + knee + pull: warm-up (5 min any cardio + A March / Skip / Run; A-drills never count - ORD-08) -> flying 20s 3 x -> core 2 x 2 light (ATH-11, R2-SE / Fri - hip + push: warm-up (5 min any cardio + A March / Skip / Run; A-drills never count - ORD-08) -> core 2 x 2 light (ATH-11, R2-SES-03) -> plyo + throws -> s / Sat - aerobic 2 (Orange / Green) or track session; Sun off / 2-4 exercises per muscle trained that day (COACH-R2 SES-05); consolidate athletic work if over 12 + 2 core (COACH-R2 SES-04)
- open: 400 m: sprinter plyo share 75 % with ~15 % fewer contacts and B / LC conditioning - approve?

#### Track - hurdles (100 / 110 m H; 400 m H variant) (`track_hurdles`)

- ES: Atletismo - vallas (100 / 110 m con vallas; 400 m con vallas) | category: competitive | sport: track_and_field | picked by: track_and_field:hurdles, track_and_field:400h | positions: 100 m hurdles, 110 m hurdles, 400 m hurdles (variant)
- origin: sports/aquatic-endurance-track.json (delta), base `track_sprinter`; family field_court; ath03 speed_power; evidence: 04 v1 sprinter budget + PROPOSED hip-mobility / strength delta (04 note 'hurdlers add hip mobility')
- why: Hurdlers are sprinters who need extra hip range and strength in flexion, abduction and rotation (lead and trail leg). The sprinter budget is kept; 2 Focus sets go to loaded hip flexion and adductor / abductor work (hurdle mobility drills are warm-up and never count - ORD-08).
- template: BYOP ATHLETIC 4-day with SPRINT slots as the anchor
- numbers: 4 main + 2 optional days; 130 sets / week (54 athletic); contact class 1 (75 % plyometric at block end, 60 % at start); aerobic 2 / pre 2 / in 2 (gym_plan)
- athletic dose / week: plyometric contacts 90-120; all jump contacts 110-150; throws 40-55 (T1); COD cuts 0 (-); sprint m 610-830; Olympic sets 7.5-12.5
- resistance: goal strength / power; emphasis hypertrophy 15; strength 45; power 40; rep zone STRENGTH 3-5 + POWER; bilateral/unilateral % of lower compound sets: block start 40/60 -> end 30/70, in season 20/80; contra / ipsi: ipsilateral step-ups for the drive (CAT-13); frontal / transverse unilateral work (lateral lunge, Cossack) for the trail leg (UNI-12 logic, INFERRED)
- season: pre-season 60 % of off-season sets (- lift days); in season 40 % (2 lift days, game-heavy no); the harder lift >= 48 h before a meet (COACH-R2 ATH-07 spacing applied to meets)
- Olympic lifts: everyone in athletic training gets Olympic lifts (COACH-ANSWER ATH-10); 60+: none by default; offered as an option with the warning 'Make sure that you have a fitness professional to help you understand what this means' (COACH-R2 ATH-08); older / injured / high-volume clients 
- injuries: HAMSTRING, HIP_FLEXOR, GROIN_ADDUCTOR, ACHILLES_CALF, PAIN_GENERAL
- variants: `track_400h` 400 m hurdles (PLYO -2; JLK -1.5)
- sample week (off season): Mon - speed + knee + pull: warm-up (5 min any cardio + A March / Skip / Run; A-drills never count - ORD-08) -> speed block first: squirrel jumps -> MACH / accel / Tue - hip + push: warm-up (5 min any cardio + A March / Skip / Run; A-drills never count - ORD-08) -> core 2 x 2 light (ATH-11, R2-SES-03) -> medball throws + b / Wed - track session (coach) or aerobic 1 + optional Focus / Thu - speed + knee + pull: warm-up (5 min any cardio + A March / Skip / Run; A-drills never count - ORD-08) -> flying 20s -> core 2 x 2 light (ATH-11, R2-SES-03 / Fri - hip + push: warm-up (5 min any cardio + A March / Skip / Run; A-drills never count - ORD-08) -> core 2 x 2 light (ATH-11, R2-SES-03) -> plyo + throws -> s / Sat - aerobic 2 (Orange / Green) or track session; Sun off / 2-4 exercises per muscle trained that day (COACH-R2 SES-05); consolidate athletic work if over 12 + 2 core (COACH-R2 SES-04)
- open: hurdlers = sprinter budget + 2 hip Focus sets - approve?

#### Track - horizontal jumps (long / triple) (`track_jumper`)

- ES: Atletismo - saltos horizontales (longitud / triple) | category: competitive | sport: track_and_field | picked by: track_and_field:long_triple | positions: long jump, triple jump
- origin: sports/aquatic-endurance-track.json (unchanged); family field_court; ath03 speed_power; evidence: 04 v1 variant track_jumper (sprinter + PLYO +6 / SPRINT -4, INFERRED) reused unchanged
- why: Horizontal jumpers are fast sprinters with the highest single-leg plyometric loads: one-leg take-off stiffness (AQ20), bounding, hamstrings and Achilles. 04 budget reused; the triple jump adds bone-stress and patellar-tendon care (step phase).
- template: BYOP ATHLETIC 4-day with SPRINT slots as the anchor
- numbers: 4 main + 2 optional days; 130 sets / week (56 athletic); contact class 1 (75 % plyometric at block end, 60 % at start); aerobic 2 / pre 2 / in 2 (gym_plan)
- athletic dose / week: plyometric contacts 125-170; all jump contacts 150-205; throws 40-55 (T1); COD cuts 0 (-); sprint m 410-550; Olympic sets 7.5-12.5
- resistance: goal strength / power; emphasis hypertrophy 10; strength 45; power 45; rep zone STRENGTH 3-5 + POWER; bilateral/unilateral % of lower compound sets: block start 40/60 -> end 30/70, in season 20/80; contra / ipsi: ipsilateral step-ups for take-off ('get out of the hip' - CAT-13)
- season: pre-season 60 % of off-season sets (- lift days); in season 41 % (2 lift days, game-heavy no); the harder lift >= 48 h before a meet (COACH-R2 ATH-07 spacing applied to meets)
- Olympic lifts: everyone in athletic training gets Olympic lifts (COACH-ANSWER ATH-10); 60+: none by default; offered as an option with the warning 'Make sure that you have a fitness professional to help you understand what this means' (COACH-R2 ATH-08); older / injured / high-volume clients 
- injuries: HAMSTRING, ACHILLES_CALF, PATELLAR_TENDON, BONE_STRESS, ANKLE_SPRAIN, PAIN_GENERAL
- variants: `track_triple_jump` Triple jump (JLK -1.5; ISO_QUAD 2)
- sample week (off season): Mon - speed + knee + pull: warm-up (5 min any cardio + A March / Skip / Run; A-drills never count - ORD-08) -> speed block first: squirrel jumps -> MACH / accel / Tue - hip + push: warm-up (5 min any cardio + A March / Skip / Run; A-drills never count - ORD-08) -> core 2 x 2 light (ATH-11, R2-SES-03) -> medball throws + b / Wed - track session (coach) or aerobic 1 + optional Focus / Thu - speed + knee + pull: warm-up (5 min any cardio + A March / Skip / Run; A-drills never count - ORD-08) -> flying 20s -> core 2 x 2 light (ATH-11, R2-SES-03 / Fri - hip + push: warm-up (5 min any cardio + A March / Skip / Run; A-drills never count - ORD-08) -> core 2 x 2 light (ATH-11, R2-SES-03) -> plyo + throws -> s / Sat - aerobic 2 (Orange / Green) or track session; Sun off / 2-4 exercises per muscle trained that day (COACH-R2 SES-05); consolidate athletic work if over 12 + 2 core (COACH-R2 SES-04)

#### Track - high jump (`track_high_jump`)

- ES: Atletismo - salto de altura | category: competitive | sport: track_and_field | picked by: track_and_field:high_jump | positions: high jump
- origin: sports/aquatic-endurance-track.json (new); family field_court; ath03 speed_power; evidence: INFERRED + SCIENCE; built from the 04 jumper structure
- why: High jumpers convert a curved approach into vertical lift on one leg: more vertical and single-leg ballistic work than the horizontal jumpers, slightly less sprinting, and frontal-plane hip strength for the curve and the take-off lean.
- template: BYOP ATHLETIC 4-day with SPRINT slots as the anchor
- numbers: 4 main + 2 optional days; 123 sets / week (49 athletic); contact class 2 (60 % plyometric at block end, 45 % at start); aerobic 2 / pre 2 / in 2 (gym_plan)
- athletic dose / week: plyometric contacts 85-115; all jump contacts 125-170; throws 50-70 (T1); COD cuts 0 (-); sprint m 305-415; Olympic sets 7.5-12.5
- resistance: goal power / strength; emphasis hypertrophy 10; strength 40; power 50; rep zone STRENGTH 3-5 + POWER; bilateral/unilateral % of lower compound sets: block start 35/65 -> end 25/75, in season 20/80; contra / ipsi: ipsilateral step-ups for the take-off drive (CAT-13)
- season: pre-season 60 % of off-season sets (- lift days); in season 40 % (2 lift days, game-heavy no); the harder lift >= 48 h before a meet (COACH-R2 ATH-07 spacing applied to meets)
- Olympic lifts: everyone in athletic training gets Olympic lifts (COACH-ANSWER ATH-10); 60+: none by default; offered as an option with the warning 'Make sure that you have a fitness professional to help you understand what this means' (COACH-R2 ATH-08); older / injured / high-volume clients 
- injuries: PATELLAR_TENDON, ACHILLES_CALF, ANKLE_SPRAIN, LOW_BACK_EXTENSION, HAMSTRING, PAIN_GENERAL
- sample week (off season): Mon - speed + knee + pull: warm-up (5 min any cardio + A March / Skip / Run; A-drills never count - ORD-08) -> speed block first: squirrel jumps -> MACH / accel / Tue - hip + push: warm-up (5 min any cardio + A March / Skip / Run; A-drills never count - ORD-08) -> core 2 x 2 light (ATH-11, R2-SES-03) -> medball throws + b / Wed - track session (coach) or aerobic 1 + optional Focus / Thu - speed + knee + pull: warm-up (5 min any cardio + A March / Skip / Run; A-drills never count - ORD-08) -> rhythm runs -> core 2 x 2 light (ATH-11, R2-SES-0 / Fri - hip + push: warm-up (5 min any cardio + A March / Skip / Run; A-drills never count - ORD-08) -> core 2 x 2 light (ATH-11, R2-SES-03) -> plyo + throws -> s / Sat - aerobic 2 (Orange / Green) or track session; Sun off / 2-4 exercises per muscle trained that day (COACH-R2 SES-05); consolidate athletic work if over 12 + 2 core (COACH-R2 SES-04)
- open: high jump class 2 (60 % plyometric) - approve?

#### Track - pole vault (`track_pole_vault`)

- ES: Atletismo - salto con garrocha (pértiga) | category: competitive | sport: track_and_field | picked by: track_and_field:pole_vault | positions: pole vault
- origin: sports/aquatic-endurance-track.json (new); family field_court; ath03 speed_power; evidence: INFERRED + SCIENCE (AQ23)
- why: Vaulters combine sprint speed, a one-leg take-off and gymnastic upper-body / core strength (pulling, inversion, push-off at the top). The shoulders take the plant and the back takes the swing (AQ23). More vertical pulling, overhead strength and hanging core than any other track event; landings into the pit are part of practice.
- template: BYOP ATHLETIC 4-day with SPRINT slots + gymnastic upper-body / core slots
- numbers: 4 main + 2 optional days; 130 sets / week (45 athletic); contact class 2 (60 % plyometric at block end, 45 % at start); aerobic 2 / pre 2 / in 2 (gym_plan)
- athletic dose / week: plyometric contacts 60-85; all jump contacts 90-120; throws 50-70 (T1); COD cuts 0 (-); sprint m 510-690; Olympic sets 6-10
- resistance: goal strength / power; emphasis hypertrophy 15; strength 45; power 40; rep zone STRENGTH 3-5 + POWER; gymnastic holds; bilateral/unilateral % of lower compound sets: block start 40/60 -> end 30/70, in season 20/80; contra / ipsi: ipsilateral step-ups for take-off (CAT-13)
- season: pre-season 60 % of off-season sets (- lift days); in season 40 % (2 lift days, game-heavy no); the harder lift >= 48 h before a meet (COACH-R2 ATH-07 spacing applied to meets)
- Olympic lifts: everyone in athletic training gets Olympic lifts (COACH-ANSWER ATH-10); 60+: none by default; offered as an option with the warning 'Make sure that you have a fitness professional to help you understand what this means' (COACH-R2 ATH-08); older / injured / high-volume clients 
- injuries: SHOULDER_THROWER, LOW_BACK_EXTENSION, WRIST_HAND, HAMSTRING, ACHILLES_CALF, FALL_UPPER_LIMB, PAIN_GENERAL
- sample week (off season): Mon - speed + knee + pull: warm-up (5 min any cardio + A March / Skip / Run; A-drills never count - ORD-08) -> speed block first: squirrel jumps -> MACH / accel / Tue - hip + push: warm-up (5 min any cardio + A March / Skip / Run; A-drills never count - ORD-08) -> core 2 x 2 light (ATH-11, R2-SES-03) -> medball throws + b / Wed - track session (coach) or aerobic 1 + optional Focus / Thu - speed + knee + pull: warm-up (5 min any cardio + A March / Skip / Run; A-drills never count - ORD-08) -> flying 20s -> core 2 x 2 light (ATH-11, R2-SES-03 / Fri - hip + push: warm-up (5 min any cardio + A March / Skip / Run; A-drills never count - ORD-08) -> core 2 x 2 light (ATH-11, R2-SES-03) -> plyo + throws -> s / Sat - aerobic 2 (Orange / Green) or track session; Sun off / 2-4 exercises per muscle trained that day (COACH-R2 SES-05); consolidate athletic work if over 12 + 2 core (COACH-R2 SES-04)
- open: pole vault class 2 (60 % plyometric) and a gymnastic upper-body block - approve?

#### Track - throws (shot put, discus, hammer) (`track_thrower`)

- ES: Atletismo - lanzamientos (bala, disco, martillo) | category: competitive | sport: track_and_field | picked by: track_and_field:throws | positions: shot put (glide / spin), discus, hammer, weight throw (indoor)
- origin: sports/aquatic-endurance-track.json (delta); family field_court; ath03 resistance; evidence: 04 v1 variant track_thrower (COACH-ANSWER ATH-03 'more resistance' group; deltas INFERRED) + PROPOSED class-4 plyo correction
- why: Throwers are the track's strength athletes (ATH-03): bilateral strength and size, rotational power through a planted lead leg, medball and implement ballistics (implement throws are the sport). The 04 variant kept the sprinter's plyo split; it is corrected to the long-contact class (40 % plyometric) like baseball.
- template: BYOP ATHLETIC 4-day with SPRINT slots as the anchor
- numbers: 4 main + 2 optional days; 129 sets / week (44 athletic); contact class 4 (40 % plyometric at block end, 25 % at start); aerobic 2 / pre 2 / in 2 (gym_plan)
- athletic dose / week: plyometric contacts 35-45; all jump contacts 55-70; throws 130-170 (T2); COD cuts 0 (-); sprint m 205-275; Olympic sets 7.5-12.5
- resistance: goal strength / hypertrophy; emphasis hypertrophy 25; strength 50; power 25; rep zone STRENGTH 3-5 + hypertrophy 6-10 (VOL 2-3); bilateral/unilateral % of lower compound sets: block start 60/40 -> end 70/30, in season 25/75; contra / ipsi: contralateral split-stance and lead-hip work (LEAD_HIP_GLUTE) for the block / rotation (INFERRED)
- season: pre-season 60 % of off-season sets (- lift days); in season 40 % (2 lift days, game-heavy no); the harder lift >= 48 h before a meet (COACH-R2 ATH-07 spacing applied to meets)
- Olympic lifts: everyone in athletic training gets Olympic lifts (COACH-ANSWER ATH-10); 60+: none by default; offered as an option with the warning 'Make sure that you have a fitness professional to help you understand what this means' (COACH-R2 ATH-08); older / injured / high-volume clients 
- injuries: LOW_BACK_ROTATIONAL, LOW_BACK_LOADING, LEAD_HIP_GLUTE, SHOULDER_THROWER, WRIST_HAND, PAIN_GENERAL
- variants: `track_thrower_hammer` Hammer (ISO_GRIP 2; THROW -2)
- sample week (off season): Mon - knee + pull: warm-up (5 min any cardio + A March / Skip / Run; A-drills never count - ORD-08) -> core 2 x 2 light (ATH-11, R2-SES-03) -> medball rotationa / Tue - hip + push: warm-up (5 min any cardio + A March / Skip / Run; A-drills never count - ORD-08) -> core 2 x 2 light (ATH-11, R2-SES-03) -> overhead / chest t / Wed - throwing practice + aerobic 1 (Orange) / Thu - knee + pull: core 2 x 2 light (ATH-11, R2-SES-03) -> broad jumps + hurdle hops -> hang clean -> belt squat / leg press (non-axial) + row -> lateral lunge  / Fri - hip + push: core 2 x 2 light (ATH-11, R2-SES-03) -> rotational throws -> snatch variant -> HEAVY DEADLIFT (axial 2) + push press -> contralateral split-st / Sat aerobic 2 (Orange); Sun off
- open: throwers corrected from the sprinter's class 1 to class 4 (40 % plyometric, like baseball) - approve?

#### Track - javelin (`track_javelin`)

- ES: Atletismo - lanzamiento de jabalina | category: competitive | sport: track_and_field | picked by: track_and_field:javelin | positions: javelin
- origin: sports/aquatic-endurance-track.json (new); family field_court; ath03 resistance; evidence: INFERRED + SCIENCE (AQ22, AQ23)
- why: Javelin is an overhead throw at the end of a run-up: the shoulder (about 30 % of injuries) and the medial elbow (UCL sprain = 'javelin thrower's elbow') are the hotspots (AQ22), plus the low back and the blocking knee. Pitcher rules apply: less overhead pressing, more arm care (COACH-ANSWER ATH-08 logic).
- template: BYOP ATHLETIC 4-day with SPRINT slots as the anchor
- numbers: 4 main + 2 optional days; 123 sets / week (42 athletic); contact class 3 (50 % plyometric at block end, 35 % at start); aerobic 2 / pre 2 / in 2 (gym_plan)
- athletic dose / week: plyometric contacts 50-65; all jump contacts 70-95; throws 85-115 (T2); COD cuts 0 (-); sprint m 305-415; Olympic sets 6-10
- resistance: goal strength / power; emphasis hypertrophy 15; strength 45; power 40; rep zone STRENGTH 3-5 + POWER; bilateral/unilateral % of lower compound sets: block start 50/50 -> end 50/50, in season 25/75; contra / ipsi: contralateral loading into the block leg (into the hip - CAT-13, INFERRED)
- season: pre-season 60 % of off-season sets (- lift days); in season 40 % (2 lift days, game-heavy no); the harder lift >= 48 h before a meet (COACH-R2 ATH-07 spacing applied to meets)
- Olympic lifts: everyone in athletic training gets Olympic lifts (COACH-ANSWER ATH-10); 60+: none by default; offered as an option with the warning 'Make sure that you have a fitness professional to help you understand what this means' (COACH-R2 ATH-08); older / injured / high-volume clients 
- injuries: SHOULDER_THROWER, ELBOW_THROWER, LOW_BACK_ROTATIONAL, PATELLAR_TENDON, LEAD_HIP_GLUTE, HAMSTRING, PAIN_GENERAL
- sample week (off season): Mon - speed + knee + pull: warm-up (5 min any cardio + A March / Skip / Run; A-drills never count - ORD-08) -> speed block first: squirrel jumps -> MACH / accel / Tue - hip + push: warm-up (5 min any cardio + A March / Skip / Run; A-drills never count - ORD-08) -> core 2 x 2 light (ATH-11, R2-SES-03) -> medball throws + b / Wed - track session (coach) or aerobic 1 + optional Focus / Thu - speed + knee + pull: warm-up (5 min any cardio + A March / Skip / Run; A-drills never count - ORD-08) -> crossover-step runs -> core 2 x 2 light (ATH-11,  / Fri - hip + push: warm-up (5 min any cardio + A March / Skip / Run; A-drills never count - ORD-08) -> core 2 x 2 light (ATH-11, R2-SES-03) -> plyo + throws -> s / Sat - aerobic 2 (Orange / Green) or track session; Sun off / 2-4 exercises per muscle trained that day (COACH-R2 SES-05); consolidate athletic work if over 12 + 2 core (COACH-R2 SES-04)
- open: javelin as its own profile (overhead thrower: pitcher-style arm care, class 3) - approve?

#### Track - middle distance (800-1500 m / mile) (`track_middle`)

- ES: Atletismo - medio fondo (800-1500 m / milla) | category: competitive | sport: track_and_field | picked by: track_and_field:middle | positions: 800 m, 1500 m / mile, steeplechase (variant)
- origin: sports/aquatic-endurance-track.json (new); family endurance; ath03 endurance; evidence: INFERRED + SCIENCE (AQ19, AQ24); built between 04 track_sprinter and distance_runner
- why: 800-1500 m runners need speed (800 m about 40 % anaerobic, 1500 m about 20 % - AQ19) and running economy: heavy strength + plyometrics 2-3 x / week improve economy (AQ24). More sprint and plyometric work than the distance runner, less than the sprinter.
- template: 3 strength / power days + the running plan (track coach)
- numbers: 3 main + 0 optional days; 79 sets / week (25 athletic); contact class 1 (75 % plyometric at block end, 60 % at start); aerobic 0 / pre 0 / in 0 (sport_plan)
- athletic dose / week: plyometric contacts 25-35; all jump contacts 45-60; throws 0 (T0); COD cuts 0 (-); sprint m 205-275; Olympic sets 2-4
- resistance: goal strength / power; emphasis hypertrophy 5; strength 55; power 40; rep zone STRENGTH 3-6 heavy (economy without mass) + POWER; bilateral/unilateral % of lower compound sets: block start 25/75 -> end 20/80, in season 10/90; contra / ipsi: ipsilateral step-ups for push-off (04 distance runner, INFERRED; CAT-13 sprinter logic)
- season: pre-season 60 % of off-season sets (- lift days); in season 40 % (1-2 lift days, game-heavy no); the harder lift >= 48 h before a meet (COACH-R2 ATH-07 spacing applied to meets)
- Olympic lifts: everyone in athletic training gets Olympic lifts (COACH-ANSWER ATH-10); 60+: none by default; offered as an option with the warning 'Make sure that you have a fitness professional to help you understand what this means' (COACH-R2 ATH-08); older / injured / high-volume clients 
- injuries: ACHILLES_CALF, BONE_STRESS, HAMSTRING, PATELLOFEMORAL_ITB, PAIN_GENERAL
- variants: `track_steeple` 3000 m steeplechase (PLYO 1; UKD 1)
- sample week (off season): Mon: warm-up (5 min any cardio + A March / Skip / Run; A-drills never count - ORD-08) -> core 2 x 2 light (ATH-11, R2-SES-03) -> pogo / ankle hops + bounds -> h / Wed: warm-up (5 min any cardio + A March / Skip / Run; A-drills never count - ORD-08) -> core 2 x 2 light (ATH-11, R2-SES-03) -> skips + hurdle hops -> hex-bar  / Fri: warm-up (5 min any cardio + A March / Skip / Run; A-drills never count - ORD-08) -> core 2 x 2 light (ATH-11, R2-SES-03) -> flat sprints 4 x 40-60 m -> tra / runs on the other days per the track coach
- open: new 'endurance' ath03 group for runners / swimmers / cyclists / rowers - approve, or keep 04's 'health'?

#### Distance running (5K-10K, half marathon, marathon) (`distance_runner`)

- ES: Carreras de fondo (5K-10K, medio maratón, maratón) | category: competitive | sport: distance_running | picked by: track_and_field:long_distance, distance_running:5k_10k, distance_running:half, distance_running:marathon | positions: 5K-10K (track / road), half marathon, marathon
- origin: 04_v1 (04); family endurance; ath03 endurance; evidence: INFERRED + OBSERVED analog (Sheet24 'HALF MARATHON PROGRAM by CHRIS HINSHAW ' + 'Program we use for all Blaze Camp Athletes who are looking to run a half marathon.')
- why: Strength and plyos are there for running economy and tissue capacity, not mass. PRG-12: the Chris Hinshaw half-marathon plan is used as-is, for the half marathon only. COACH-R2 LIB-06: the '21.6 [REMOVED - COACH-R2 LIB-06] mile run' is removed from plans and tests; the longest run stays the half-marathon plan.2 km).
- template: 2-3 strength sessions/week + the running plan (Sheet24: 2 runs/week x 21 weeks)
- numbers: 3 main + 0 optional days; 69.5 sets / week (19.5 athletic); contact class 1 (75 % plyometric at block end, 60 % at start); aerobic 0 / pre 0 / in 0 (sport_plan)
- athletic dose / week: plyometric contacts 10-25; all jump contacts 35-45; throws 0 (T0); COD cuts 0 (-); sprint m 80-150; Olympic sets 1-4
- resistance: goal strength / power; emphasis hypertrophy 10; strength 55; power 35; rep zone STRENGTH 3-6 reps heavy (running economy without mass); bilateral/unilateral % of lower compound sets: block start 20/80 -> end 20/80, in season 10/90; contra / ipsi: ipsilateral step-ups for push-off (INFERRED)
- season: pre-season 60 % of off-season sets (- lift days); in season 40 % (1-2 lift days, game-heavy no); the harder lift >= 48 h before a race (COACH-R2 ATH-07 spacing applied to races)
- Olympic lifts: everyone in athletic training gets Olympic lifts (COACH-ANSWER ATH-10); 60+: none by default; offered as an option with the warning 'Make sure that you have a fitness professional to help you understand what this means' (COACH-R2 ATH-08); older / injured / high-volume clients 
- injuries: ACHILLES_CALF, BONE_STRESS, HAMSTRING, PAIN_GENERAL, PATELLOFEMORAL_ITB
- sample week (off season): Mon: warm-up (5 min any cardio + A March / Skip or mobility; never counted - ORD-08) -> core 2 x 2 light (ATH-11, R2-SES-03) -> pogo / ankle hops -> hex-bar jum / Wed: warm-up (5 min any cardio + A March / Skip or mobility; never counted - ORD-08) -> core 2 x 2 light (ATH-11, R2-SES-03) -> skips / bounds -> hip thrust (no / Fri: warm-up (5 min any cardio + A March / Skip or mobility; never counted - ORD-08) -> core 2 x 2 light (ATH-11, R2-SES-03) -> hill or flat sprints (Sheet24 st / runs: half marathon = the coach's Chris Hinshaw plan used as-is (2 runs a week, 21 weeks - PRG-12, COACH-R2 LIB-06); 5K-10K and marathon = the runner's own plan / 2-4 exercises per muscle trained that day (COACH-R2 SES-05)
- open: distance runners stay class 1 (75 % plyometric of a small T1 power budget) although easy-pace contacts are 0.20-0.30 s - approve?

#### Cross country (HS / college) (`cross_country`)

- ES: Campo traviesa (cross country) | category: competitive | sport: distance_running | picked by: distance_running:cross_country | positions: HS 5K, college 6K / 8K / 10K
- origin: sports/aquatic-endurance-track.json (delta), base `distance_runner`; family endurance; ath03 endurance; evidence: 04 distance_runner + PROPOSED terrain deltas
- why: Cross country is distance running on grass, dirt and hills with uneven footing: the distance runner's profile plus more multi-directional ankle work, lateral hip strength (FOCUS) and ankle-sprain care. Season is fixed (late Aug-Nov, AQ27).
- template: 2-3 strength sessions/week + the running plan (Sheet24: 2 runs/week x 21 weeks)
- numbers: 3 main + 0 optional days; 72.5 sets / week (20.5 athletic); contact class 1 (75 % plyometric at block end, 60 % at start); aerobic 0 / pre 0 / in 0 (sport_plan)
- athletic dose / week: plyometric contacts 15-20; all jump contacts 35-45; throws 0 (T0); COD cuts 0 (-); sprint m 100-140; Olympic sets 1.5-2.5
- resistance: goal strength / power; emphasis hypertrophy 10; strength 55; power 35; rep zone STRENGTH 3-6 reps heavy (running economy without mass); bilateral/unilateral % of lower compound sets: block start 20/80 -> end 20/80, in season 10/90; contra / ipsi: ipsilateral step-ups for push-off (INFERRED)
- season: pre-season 60 % of off-season sets (- lift days); in season 40 % (1-2 lift days, game-heavy no); the harder lift >= 48 h before a race (COACH-R2 ATH-07 spacing applied to races)
- Olympic lifts: everyone in athletic training gets Olympic lifts (COACH-ANSWER ATH-10); 60+: none by default; offered as an option with the warning 'Make sure that you have a fitness professional to help you understand what this means' (COACH-R2 ATH-08); older / injured / high-volume clients 
- injuries: ACHILLES_CALF, BONE_STRESS, ANKLE_SPRAIN, HAMSTRING, PATELLOFEMORAL_ITB, PAIN_GENERAL
- sample week (off season): Mon: warm-up (5 min any cardio + A March / Skip or mobility; never counted - ORD-08) -> core 2 x 2 light (ATH-11, R2-SES-03) -> multi-directional ankle hops + p / Wed: warm-up (5 min any cardio + A March / Skip or mobility; never counted - ORD-08) -> core 2 x 2 light (ATH-11, R2-SES-03) -> skips / bounds -> hip thrust (no / Fri: warm-up (5 min any cardio + A March / Skip or mobility; never counted - ORD-08) -> core 2 x 2 light (ATH-11, R2-SES-03) -> hill sprints -> trap-bar DEADLIF / summer base (Jun-Aug) = off-season block; Aug-Sep = pre-season block; Sep-Nov = in season / 2-4 exercises per muscle trained that day (COACH-R2 SES-05)
- open: cross country as its own profile (terrain / ankle deltas on the distance runner) - approve?

#### Triathlon (sprint / Olympic, 70.3, full) (`triathlon`)

- ES: Triatlón (sprint / olímpico, 70.3, distancia completa) | category: competitive | sport: triathlon | picked by: triathlon:sprint_olympic, triathlon:70_3, triathlon:full | positions: sprint / Olympic (incl. draft-legal youth / collegiate), 70.3, full distance
- origin: sports/aquatic-endurance-track.json (new); family endurance; ath03 endurance; evidence: INFERRED + SCIENCE (AQ24, AQ28, AQ31)
- why: Triathletes train three sports (10-20 h a week at higher levels); most injuries come from the run and hit the knee and spine (AQ28), and the swim adds shoulder load. Two short, heavy strength sessions with low-amplitude plyometrics improve economy (AQ24, AQ31) without stealing endurance time.
- template: 2 strength / power days + the swim-bike-run plan (the athlete's coach)
- numbers: 2 main + 1 optional days; 60 sets / week (13 athletic); contact class 1 (75 % plyometric at block end, 60 % at start); aerobic 0 / pre 0 / in 0 (sport_plan)
- athletic dose / week: plyometric contacts 10-15; all jump contacts 25-35; throws 0 (T0); COD cuts 0 (-); sprint m 0; Olympic sets 1.5-2.5
- resistance: goal strength / power; emphasis hypertrophy 5; strength 50; power 25; endurance_strength 20; rep zone STRENGTH 4-6 heavy + 1 accessory at 12-15; bilateral/unilateral % of lower compound sets: block start 30/70 -> end 30/70, in season 20/80; contra / ipsi: ipsilateral step-ups for run push-off (INFERRED)
- season: pre-season 60 % of off-season sets (- lift days); in season 40 % (1-2 lift days, game-heavy no); the harder lift >= 48 h before a race (COACH-R2 ATH-07 spacing applied to races)
- Olympic lifts: everyone in athletic training gets Olympic lifts (COACH-ANSWER ATH-10); 60+: none by default; offered as an option with the warning 'Make sure that you have a fitness professional to help you understand what this means' (COACH-R2 ATH-08); older / injured / high-volume clients 
- injuries: ACHILLES_CALF, BONE_STRESS, PATELLOFEMORAL_ITB, SHOULDER_SWIMMER, LOW_BACK_LOADING, PAIN_GENERAL
- sample week (off season): Mon: warm-up (5 min any cardio + A March / Skip or mobility; never counted - ORD-08) -> core 2 x 2 light (ATH-11, R2-SES-03) -> pogo / ankle hops -> hex-bar jum / Thu: warm-up (5 min any cardio + A March / Skip or mobility; never counted - ORD-08) -> core 2 x 2 light (ATH-11, R2-SES-03) -> skips -> trap-bar DEADLIFT 4-6 r / swim / bike / run sessions on the other days (the athlete's plan); optional Focus: cuff, hips, soleus / 2-4 exercises per muscle trained that day (COACH-R2 SES-05)
- open: triathlon: 2 strength days, class 1 from the run leg - approve?

#### Cycling - endurance (road, mountain bike, gravel, indoor racing) (`cycling_endurance`)

- ES: Ciclismo de resistencia (ruta, montaña, gravel, bajo techo) | category: competitive | sport: cycling | picked by: cycling:road, cycling:mountain, cycling:gravel, cycling:indoor | positions: road, mountain bike (XC / enduro), gravel, indoor racing
- origin: sports/aquatic-endurance-track.json (new); family endurance; ath03 endurance; evidence: INFERRED + SCIENCE (AQ30, AQ31, AQ32)
- why: Heavy strength training (about 2 x / week, 4-10RM) improves cycling economy and sprint power (AQ31). Road cyclists show low bone density because the sport has no impact (AQ30): keep jumps and heavy lifting all year. Low back and anterior knee are the overuse hotspots (AQ32), neck / shoulders from the position, clavicle from crashes.
- template: 3 strength / power days in the off-season (2 minimum) + the riding plan
- numbers: 3 main + 1 optional days; 79 sets / week (18 athletic); contact class 4 (40 % plyometric at block end, 25 % at start); aerobic 0 / pre 0 / in 0 (sport_plan)
- athletic dose / week: plyometric contacts 10-15; all jump contacts 35-45; throws 35-45 (T1); COD cuts 0 (-); sprint m 0; Olympic sets 2-4
- resistance: goal strength / power; emphasis hypertrophy 5; strength 55; power 30; endurance_strength 10; rep zone STRENGTH 4-10RM heavy (AQ31) + POWER; bilateral/unilateral % of lower compound sets: block start 50/50 -> end 50/50, in season 40/60; contra / ipsi: ipsilateral step-ups (out of the hip, pushing - CAT-13 sprinter logic, INFERRED)
- season: pre-season 60 % of off-season sets (- lift days); in season 40 % (1-2 lift days, game-heavy no); the harder lift >= 48 h before a race (COACH-R2 ATH-07 spacing applied to races)
- Olympic lifts: everyone in athletic training gets Olympic lifts (COACH-ANSWER ATH-10); 60+: none by default; offered as an option with the warning 'Make sure that you have a fitness professional to help you understand what this means' (COACH-R2 ATH-08); older / injured / high-volume clients 
- injuries: LOW_BACK_LOADING, PATELLOFEMORAL_ITB, NECK, BONE_LOADING_NON_IMPACT, FALL_UPPER_LIMB, PAIN_GENERAL
- variants: `cycling_mtb` Mountain bike (XC / enduro) (HPULL 2; ISO_GRIP 2; PLYO 1); `cycling_indoor` Indoor racing / training
- sample week (off season): Mon - knee + pull: warm-up (5 min any cardio + A March / Skip or mobility; never counted - ORD-08) -> core 2 x 2 light (ATH-11, R2-SES-03) -> box jumps + ankle  / Wed - hip + push: warm-up (5 min any cardio + A March / Skip or mobility; never counted - ORD-08) -> core 2 x 2 light (ATH-11, R2-SES-03) -> medball chest / rot / Fri - full: warm-up (5 min any cardio + A March / Skip or mobility; never counted - ORD-08) -> core 2 x 2 light (ATH-11, R2-SES-03) -> broad jumps -> trap-bar D / rides on the other days per the riding plan / 2-4 exercises per muscle trained that day (COACH-R2 SES-05)
- open: cycling class 4 (40 % plyometric) and year-round jumping for bone - approve?

#### Cycling - sprint (track sprint, keirin, BMX) (`cycling_sprint`)

- ES: Ciclismo de velocidad (pista y BMX) | category: competitive | sport: cycling | picked by: cycling:track_sprint, cycling:bmx | positions: track sprint / keirin / 1 km, BMX racing
- origin: sports/aquatic-endurance-track.json (new); family strength; ath03 resistance; evidence: INFERRED + SCIENCE (AQ33)
- why: Sprint cyclists and BMX racers win with maximal force and power over < 60 s: back-squat force and power-clean power are the best predictors of on-bike force and power (AQ33). Bilateral strength leads; jumps for rate of force; BMX adds landings and upper-body for gate starts and jumps.
- template: 4 strength / power days (resistance-group sport) + track / BMX sessions
- numbers: 4 main + 0 optional days; 112 sets / week (29 athletic); contact class 4 (40 % plyometric at block end, 25 % at start); aerobic 2 / pre 2 / in 2 (gym_plan)
- athletic dose / week: plyometric contacts 30-40; all jump contacts 65-85; throws 25-35 (T1); COD cuts 0 (-); sprint m 0; Olympic sets 9-15
- resistance: goal strength / power; emphasis hypertrophy 20; strength 50; power 30; rep zone STRENGTH 3-5 (5 x 5 / 5 x 3) + POWER; hypertrophy 6-10 for quads / glutes in early blocks; bilateral/unilateral % of lower compound sets: block start 60/40 -> end 70/30, in season 30/70; contra / ipsi: ipsilateral step-ups (push out of the hip - CAT-13 sprinter logic)
- season: pre-season 60 % of off-season sets (- lift days); in season 40 % (2 lift days, game-heavy no); the harder lift >= 48 h before a race day (COACH-R2 ATH-07 spacing)
- Olympic lifts: everyone in athletic training gets Olympic lifts (COACH-ANSWER ATH-10); 60+: none by default; offered as an option with the warning 'Make sure that you have a fitness professional to help you understand what this means' (COACH-R2 ATH-08); older / injured / high-volume clients 
- injuries: LOW_BACK_LOADING, PATELLAR_TENDON, BONE_LOADING_NON_IMPACT, FALL_UPPER_LIMB, PAIN_GENERAL
- variants: `cycling_bmx` BMX racing (PLYO 2; HPULL 2; ISO_GRIP 2)
- sample week (off season): Mon: warm-up (5 min any cardio + A March / Skip or mobility; never counted - ORD-08) -> core 2 x 2 light (ATH-11, R2-SES-03) -> loaded / hex-bar jumps -> power  / Tue: warm-up (5 min any cardio + A March / Skip or mobility; never counted - ORD-08) -> core 2 x 2 light (ATH-11, R2-SES-03) -> box jumps + medball throws -> ha / Thu: warm-up (5 min any cardio + A March / Skip or mobility; never counted - ORD-08) -> core 2 x 2 light (ATH-11, R2-SES-03) -> squat jumps -> squat clean -> le / Fri: warm-up (5 min any cardio + A March / Skip or mobility; never counted - ORD-08) -> core 2 x 2 light (ATH-11, R2-SES-03) -> broad jumps -> power clean -> HE / track / BMX sessions and 2 easy Orange rides on other days
- open: sprint cyclists / BMX in the 'more resistance' group - approve?

#### Rowing (crew: sweep / sculling) (`rowing`)

- ES: Remo (punta / couple) | category: competitive | sport: rowing | picked by: rowing:sweep, rowing:sculling | positions: sweep (port / starboard), sculling, lightweight (variant note)
- origin: sports/aquatic-endurance-track.json (new); family endurance; ath03 endurance; evidence: INFERRED + SCIENCE (AQ34, AQ34b, AQ35, AQ36)
- why: A 2000 m race is about 70-80 % aerobic over 220-250 strokes (AQ35), but each stroke is a big leg-hip-back push: rowers need strength-endurance and strength (deadlift / squat / row patterns), a resilient low back (15-25 % of injuries) and ribs (stress fractures) (AQ34). Heavy squats can aggravate the back (AQ34b), so the coach's two-day spine rule matters (COACH-R2 SES-01/02).
- template: 3 strength / power days + water / erg sessions (rowing coach)
- numbers: 3 main + 1 optional days; 85 sets / week (18 athletic); contact class 5 (25 % plyometric at block end, 10 % at start); aerobic 0 / pre 0 / in 0 (sport_plan)
- athletic dose / week: plyometric contacts 5; all jump contacts 30-40; throws 35-45 (T1); COD cuts 0 (-); sprint m 0; Olympic sets 4.5-7.5
- resistance: goal strength / endurance-strength; emphasis hypertrophy 15; strength 45; power 15; endurance_strength 25; rep zone STRENGTH 4-6 + strength-endurance 12-20 (VOL 1) in the early block; bilateral/unilateral % of lower compound sets: block start 55/45 -> end 65/35, in season 40/60; contra / ipsi: contra / ipsi lunges and step-ups as early-block health accessories (CAT-13 size / strength logic)
- season: pre-season 60 % of off-season sets (- lift days); in season 40 % (2 lift days, game-heavy no); the harder lift >= 48 h before a race (COACH-R2 ATH-07 spacing applied to races)
- Olympic lifts: everyone in athletic training gets Olympic lifts (COACH-ANSWER ATH-10); 60+: none by default; offered as an option with the warning 'Make sure that you have a fitness professional to help you understand what this means' (COACH-R2 ATH-08); older / injured / high-volume clients 
- injuries: LOW_BACK_LOADING, RIB_STRESS, LOW_BACK_ROTATIONAL, PATELLOFEMORAL_ITB, WRIST_HAND, PAIN_GENERAL
- variants: `rowing_sweep` Sweep (CORE 2; THROW 1); `rowing_sculling` Sculling (ISO_GRIP 2)
- sample week (off season): Mon - knee + pull: warm-up (5 min any cardio + A March / Skip or mobility; never counted - ORD-08) -> core 2 x 2 light (ATH-11, R2-SES-03) -> box jumps + medbal / Wed - hip + push: warm-up (5 min any cardio + A March / Skip or mobility; never counted - ORD-08) -> core 2 x 2 light (ATH-11, R2-SES-03) -> broad jumps -> sing / Fri - full: warm-up (5 min any cardio + A March / Skip or mobility; never counted - ORD-08) -> core 2 x 2 light (ATH-11, R2-SES-03) -> hex-bar jump -> trap-bar  / water / erg sessions on the other days per the rowing coach; winter (Dec-Feb) = the main off-season strength block / 2-4 exercises per muscle trained that day (COACH-R2 SES-05)
- open: rowing bilateral-leaning (60/40) - approve? (the 25 % plyo share is approved in COACH-R3 ATH-04)

#### Alpine ski racing and snowboard racing / cross (`ski_alpine`)

- ES: Esquí alpino y snowboard (carreras / cross) | category: competitive | sport: ski_snowboard | picked by: ski_snowboard:alpine, ski_snowboard:speed, ski_snowboard:snowboard_race | positions: slalom / GS, speed (super-G / downhill), snowboard parallel / snowboard cross
- origin: sports/aquatic-endurance-track.json (new); family snow; ath03 resistance; evidence: INFERRED + SCIENCE (AQ37, AQ39)
- why: Ski racers hold huge eccentric and isometric loads on one leg at speed; ACL injuries are common (about 15 % of young racers over 10 years) and low leg and core strength predicted knee injury (AQ37). Dryland builds eccentric quad and hamstring strength, core strength, single-leg power and reactive balance; runs last 45-150 s, so an aerobic base matters.
- template: 4 dryland strength / power days (May-Oct) + 1 optional; on-snow training in season
- numbers: 4 main + 1 optional days; 115 sets / week (37 athletic); contact class 4 (40 % plyometric at block end, 25 % at start); aerobic 3 / pre 2 / in 2 (gym_plan)
- athletic dose / week: plyometric contacts 30-40; all jump contacts 80-105; throws 50-70 (T1); COD cuts 25-30 (MOD. TURN); sprint m 0; Olympic sets 6-10
- resistance: goal strength / power; emphasis hypertrophy 20; strength 50; power 30; rep zone STRENGTH 3-6 with slow eccentrics / isometric holds + POWER; bilateral/unilateral % of lower compound sets: block start 35/65 -> end 30/70, in season 20/80; contra / ipsi: contralateral loading (into the hip on the outside leg - CAT-13 COD logic, INFERRED); frontal / transverse unilateral work 40 %
- season: pre-season 60 % of off-season sets (- lift days); in season 40 % (1-2 lift days, game-heavy no); the harder lift >= 48 h before a race day (COACH-R2 ATH-07 spacing)
- Olympic lifts: everyone in athletic training gets Olympic lifts (COACH-ANSWER ATH-10); 60+: none by default; offered as an option with the warning 'Make sure that you have a fitness professional to help you understand what this means' (COACH-R2 ATH-08); older / injured / high-volume clients 
- injuries: ACL_LANDING_CUTTING, LOW_BACK_LOADING, HAMSTRING, FALL_UPPER_LIMB, PATELLAR_TENDON, PAIN_GENERAL, GROIN_ADDUCTOR
- variants: `ski_speed` Speed events (super-G / downhill) (BKD 2; ISO_QUAD 2; COD -2); `snowboard_race` Snowboard parallel / cross (ISO_GRIP 2)
- sample week (off season): Mon - knee + pull: warm-up (5 min any cardio + A March / Skip or mobility; never counted - ORD-08) -> core 2 x 2 light (ATH-11, R2-SES-03) -> lateral bounds (st / Tue - hip + push: warm-up (5 min any cardio + A March / Skip or mobility; never counted - ORD-08) -> core 2 x 2 light (ATH-11, R2-SES-03) -> rotational medball  / Wed - aerobic (Blue) + optional Focus (balance / reactive) / Thu - knee + pull: warm-up (5 min any cardio + A March / Skip or mobility; never counted - ORD-08) -> lateral shuffle / reactive agility -> core 2 x 2 light (AT / Fri - hip + push: warm-up (5 min any cardio + A March / Skip or mobility; never counted - ORD-08) -> core 2 x 2 light (ATH-11, R2-SES-03) -> broad jumps -> snat / Sat aerobic (Green) + Sun aerobic (Orange: bike / hike)
- open: alpine skiing class 4 (40 % plyometric) and 'more resistance' group - approve?

#### Freestyle skiing / snowboarding (moguls, slopestyle, halfpipe, big air) (`ski_freestyle`)

- ES: Esquí y snowboard estilo libre (moguls, slopestyle, halfpipe, big air) | category: competitive | sport: ski_snowboard | picked by: ski_snowboard:freestyle | positions: moguls, slopestyle / big air, halfpipe
- origin: sports/aquatic-endurance-track.json (new); family snow; ath03 speed_power; evidence: INFERRED + SCIENCE (AQ37, AQ38)
- why: Freestyle athletes land from height many times a day: landing capacity (stage 1 'receive'), eccentric strength, knee (ACL) and back protection come first; rotation and air awareness come from trampoline and ramps (sport, not generated). Competitive snowboarders get more back and knee injuries than wrist (AQ38).
- template: 4 dryland days + 1 optional; trampoline / water-ramp / airbag sessions are the sport
- numbers: 4 main + 1 optional days; 118 sets / week (40 athletic); contact class 3 (50 % plyometric at block end, 35 % at start); aerobic 2 / pre 2 / in 2 (gym_plan)
- athletic dose / week: plyometric contacts 40-55; all jump contacts 105-145; throws 50-70 (T1); COD cuts 10-15 (MOD. TURN); sprint m 0; Olympic sets 6-10
- resistance: goal strength / power; emphasis hypertrophy 15; strength 45; power 40; rep zone STRENGTH 3-6 + POWER; bilateral/unilateral % of lower compound sets: block start 40/60 -> end 35/65, in season 25/75; contra / ipsi: contralateral loading (into the hip) for rotation (CAT-13, INFERRED)
- season: pre-season 60 % of off-season sets (- lift days); in season 40 % (1-2 lift days, game-heavy no); the harder lift >= 48 h before a contest (COACH-R2 ATH-07 spacing)
- Olympic lifts: everyone in athletic training gets Olympic lifts (COACH-ANSWER ATH-10); 60+: none by default; offered as an option with the warning 'Make sure that you have a fitness professional to help you understand what this means' (COACH-R2 ATH-08); older / injured / high-volume clients 
- injuries: ACL_LANDING_CUTTING, LOW_BACK_LOADING, HAMSTRING, FALL_UPPER_LIMB, PATELLAR_TENDON, PAIN_GENERAL, LOW_BACK_EXTENSION, WRIST_HAND, NECK
- sample week (off season): Mon: warm-up (5 min any cardio + A March / Skip or mobility; never counted - ORD-08) -> core 2 x 2 light (ATH-11, R2-SES-03) -> box drop & stick (RC1, double bl / Tue: warm-up (5 min any cardio + A March / Skip or mobility; never counted - ORD-08) -> core 2 x 2 light (ATH-11, R2-SES-03) -> rotational medball throws -> han / Wed: trampoline / water ramp (sport) + aerobic (Blue) / Thu: warm-up (5 min any cardio + A March / Skip or mobility; never counted - ORD-08) -> reactive footwork -> core 2 x 2 light (ATH-11, R2-SES-03) -> lateral bou / Fri: warm-up (5 min any cardio + A March / Skip or mobility; never counted - ORD-08) -> core 2 x 2 light (ATH-11, R2-SES-03) -> box jumps -> snatch variant -> H / Sat aerobic (Orange)
- open: freestyle class 3 (50 % plyometric) with a doubled landing block - approve?

#### Artistic gymnastics (women's and men's) (`gymnastics_artistic`)

- ES: Gimnasia artística (femenil y varonil) | category: competitive | sport: gymnastics | picked by: figure_skating:singles, figure_skating:pairs_dance, gymnastics:womens, gymnastics:mens | positions: women's artistic (vault, bars, beam, floor), men's artistic (6 events - see variant), all-around / event specialists
- origin: sports/combat-strength-fitness.json (new), base `youth_athlete`; family field_court; ath03 speed_power; evidence: NEW (PROPOSED budget, INFERRED from SCIENCE and the nearest 04 profile: 04:youth_athlete (age rules) + 04:volleyball (short-contact class))
- why: New. Mostly youth athletes: youth rules apply (floor Olympic lifts from ~14 after a hang block, growth-spurt caps). Short-contact class 2 (60 % plyometric at block end) but low gym volume, because practice already gives huge landing loads (K29). Wrist, Achilles and low back are the prehab priorities.
- template: 3 short gym sessions (45-60 min) on top of 15-30 h of gymnastics practice (PROPOSED)
- numbers: 3 main + 0 optional days; 81 sets / week (15 athletic); contact class 2 (60 % plyometric at block end, 45 % at start); aerobic 2 / pre 2 / in 2 (gym_plan)
- athletic dose / week: plyometric contacts 12-16; all jump contacts 29-39; throws 17-23 (T1); COD cuts 0 (-); sprint m 102-138; Olympic sets 2.4-3.6
- resistance: goal power / strength; emphasis hypertrophy 10; strength 50; power 40; rep zone STRENGTH with body weight + light loads; VOL 2 for prehab; no failure on wrists; bilateral/unilateral % of lower compound sets: block start 40/60 -> end 30/70, in season 20/80; contra / ipsi: ipsilateral step-ups for take-off power (CAT-13 acceleration logic, INFERRED); contralateral for the split / leap ranges
- season: pre-season 60 % of off-season sets (3 lift days); in season 45 % (2 lift days, game-heavy yes); the one hard gym day >= 48 h before a competition (COACH-R2 ATH-07, extended INFERRED)
- Olympic lifts: everyone in athletic training gets Olympic lifts (COACH-ANSWER ATH-10); 60+: none by default; offered as an option with the warning 'Make sure that you have a fitness professional to help you understand what this means' (COACH-R2 ATH-08); older / injured / high-volume clients 
- injuries: WRIST_HAND, ACHILLES_CALF, ANKLE_SPRAIN, LOW_BACK_EXTENSION_SPONDY, GROWTH_APOPHYSIS, SHOULDER_GYMNASTIC, PAIN_GENERAL
- variants: `gymnastics_mag` Men's artistic (6 events incl. rings, pommel, p-bars, high bar) (VPULL 2; HPUSH 2; ISO_BICEP 2; ISO_GRIP 2)
- sample week (off season): Mon - knee + pull: warm-up -> core 2 x 2 light (hollow / compression) -> landing sticks (RC1) -> hang clean (L1) -> goblet / front squat (axial day 1, youth loa / Wed - hip + push: core 2 x 2 -> pogos / ankle hops (by RC stage) -> DB snatch (from ~14 after a hang block) -> trap-bar deadlift (axial day 2) + handstand push- / Fri - full body: core -> overhead medball throws -> 10-20 m sprints (vault run) -> step-ups (ipsilateral) + rows -> hip thrust + dips / push-ups -> loaded hip f / Tue / Thu / Sat - gymnastics practice; aerobic 2 = routine-length Green + easy Orange

### 8.3 Combat sports

#### Wrestling (folkstyle / freestyle / Greco-Roman) (`wrestling`)

- ES: Lucha olímpica y colegial (Wrestling) | category: competitive | sport: wrestling | picked by: wrestling:light, wrestling:middle, wrestling:heavy | positions: lighter weight classes, middle weight classes, upper weights / heavyweight (see variant)
- origin: 04_v1 (04); family combat; ath03 resistance; evidence: INFERRED
- why: Pulling, grip, neck and relative strength dominate; plyos are horizontal and moderate. 'More resistance' group (COACH-ANSWER ATH-03); wrestling / BJJ rank above boxing / karate on plyos (ATH-02).
- template: MM BOXING build-up structure with pulling, grip, neck, carries/drags
- numbers: 4 main + 0 optional days; 132 sets / week (44 athletic); contact class 5 (25 % plyometric at block end, 10 % at start); aerobic 4 / pre 2 / in 2 (gym_plan)
- athletic dose / week: plyometric contacts 20-40; all jump contacts 45-60; throws 150-200 (T3); COD cuts 40-50 (MOD. TURN); sprint m 0-60; Olympic sets 6-10
- resistance: goal strength / power; emphasis hypertrophy 15; strength 55; power 30; rep zone STRENGTH (relative strength, weight class); bilateral/unilateral % of lower compound sets: block start 50/50 -> end 40/60, in season 30/70; contra / ipsi: health accessory (INFERRED)
- season: pre-season 60 % of off-season sets (3 lift days); in season 45 % (2 lift days, game-heavy yes); the one hard gym day >= 48 h before a competition (COACH-R2 ATH-07, extended INFERRED)
- Olympic lifts: everyone in athletic training gets Olympic lifts (COACH-ANSWER ATH-10); 60+: none by default; offered as an option with the warning 'Make sure that you have a fitness professional to help you understand what this means' (COACH-R2 ATH-08); older / injured / high-volume clients 
- injuries: NECK, LOW_BACK_LOADING, PAIN_GENERAL, ACL_LANDING_CUTTING, SHOULDER_CONTACT, KNEE_GRAPPLING, ELBOW_GRAPPLING
- variants: `wrestling_greco` Greco-Roman (HPULL 2; THROW 2; COD -2; UKD -1); `wrestling_heavyweight` Upper weights / heavyweight (BKD 2; BHD 1; HPUSH 2; PLYO -1.5)
- sample week (off season): Mon - knee + pull: warm-up -> core 2 x 2 light (COACH-R2 SES-03) -> medball (rotational slams + overhead backward throws) -> ballistic jump (broad jumps / box j / Tue - hip + push: real aerobic block first (Orange 20-30 min or Green 2-3 min period simulations, ORD-09) -> core 2 x 2 -> plyo (sprawl landings -> penetration- / Wed - wrestling practice / Thu - knee + pull: core 2 x 2 -> medball -> loaded jump -> clean variant -> belt squat or leg press (non-axial) + chest-supported row -> lateral lunge / cossack / Fri - hip + push: conditioning first (Blue short-burst repeats) -> core 2 x 2 -> plyo -> snatch variant -> HEAVY DEADLIFT / trap bar (axial day 2) + DB press -> / Sat - practice / competition; Sun - off; remaining aerobic sessions (colours not used yet) after practice

#### Boxing (`boxing`)

- ES: Boxeo | category: competitive | sport: boxing | picked by: boxing:light, boxing:middle, boxing:heavy | positions: weight classes (no position split), amateur (3 x 3 min), pro (4-12 rounds)
- origin: 04_v1 (04); family combat; ath03 combat; evidence: OBSERVED (MASTER_MODEL 'EXAMPLE BOXING 8 WEEK BUILD UP', weeks 3-6 mean = conversion phase; weeks 1-2 = base); v1: COACH-ANSWER ATH-04 (reduce, not cut, pressing / arm volume), ORD-09 (real aerobic block), ATH-01 / ATH-02 (more ballistics; boxing near the bottom of the plyo ranking)
- why: Coach's only fighter program; defines the striker template (base -> conversion), the medball dose and the striker pressing rule. v1: the generator keeps some pressing, pulling and arm work when punching volume is high (ATH-04); the build-up's fast-reactive plyometric contacts (31/week) sit at the top of the boxing range, its other jump contacts are ballistic jumps and landings (v1 re-count).
- template: MM BOXING build-up (Mon/Tue/Thu/Fri; medball list Mon/Thu, conditioning first Tue/Fri)
- numbers: 4 main + 0 optional days; 176 sets / week (79 athletic); contact class 5 (25 % plyometric at block end, 10 % at start); aerobic 3 / pre 2 / in 2 (gym_plan)
- athletic dose / week: plyometric contacts 15-30; all jump contacts 110-130; throws 190-380 (T4); COD cuts 0-30 (EASY TURN); sprint m 0-60; Olympic sets 9-12
- resistance: goal power / strength; emphasis hypertrophy 25; strength 35; power 40; rep zone base 3 x 10; conversion 3-8 reps heavy + complexes ('3-5-5-5', '4-5-5-5/5'); bilateral/unilateral % of lower compound sets: block start 40/60 -> end 30/70, in season 20/80; contra / ipsi: contralateral for getting into the hip in stance (INFERRED from CAT-13 COD logic); 'Db contralateral LOW step up' is written in the boxing tab (OBSERVED)
- season: pre-season 60 % of off-season sets (3 lift days); in season 45 % (2 lift days, game-heavy no); the one hard gym day >= 48 h before a competition (COACH-R2 ATH-07, extended INFERRED)
- Olympic lifts: everyone in athletic training gets Olympic lifts (COACH-ANSWER ATH-10); 60+: none by default; offered as an option with the warning 'Make sure that you have a fitness professional to help you understand what this means' (COACH-R2 ATH-08); older / injured / high-volume clients 
- injuries: SHOULDER_STRIKER, WRIST_HAND, NECK, LOW_BACK_ROTATIONAL, GROIN_ADDUCTOR, PAIN_GENERAL
- variants: `boxing_heavyweight` Heavyweight (BKD 2; BHD 2; HPUSH 1; VPULL 1; PLYO -2; JLK -2)
- sample week (off season): Mon - knee + pull: warm-up -> core 2 x 2 light (COACH-R2 SES-03) -> medball list part 1 (rotational scoops, chest passes, slams, 1 x 10 each - LIB-22) -> ballis / Tue - conditioning first: a real aerobic block (OBSERVED 'Sprint 20/ Recover 40' (Blue) or 20-40 min easy (Orange); ORD-09) -> core 2 x 2 -> plyo (single-leg ma / Wed - boxing practice (rope, bag, pads); optional Focus / core day (optional days ideally separate - ORD-10) / Thu - knee + pull: core 2 x 2 -> medball list part 2 -> loaded jump (hex-bar / DB jump, 10-20 % body weight - EQ-15) -> clean variant -> belt squat or leg press / Fri - conditioning first (Green 1-3 min rounds, a different colour from Tuesday) -> core 2 x 2 -> plyo -> 'Hang Power Clean & Press' (OBSERVED) -> HEAVY DEADLIF / Sat - sparring; Sun - off; the 3rd (and 4th) aerobic session = the colour not used yet, after practice

#### MMA (mixed martial arts) (`mma`)

- ES: Artes marciales mixtas (MMA) | category: competitive | sport: mma | picked by: mma:light, mma:middle, mma:heavy | positions: weight classes (no position split), amateur (3 x 3 min), pro (3 x 5 min; title 5 x 5 min)
- origin: 04_v1 (04); family combat; ath03 combat; evidence: INFERRED; ordering anchor OBSERVED in coach's words ('MMA fighters need a lot more plyos [than boxers], not as much as basketball')
- why: MMA above tennis and below soccer on plyos (COACH-ANSWER ATH-02); fighters get 'a lot more ballistics and plyos' (ATH-01); adds grappling pulling, grip, neck and horizontal (shot) power.
- template: MM BOXING build-up structure + grappling pull/grip/neck
- numbers: 4 main + 0 optional days; 143 sets / week (58 athletic); contact class 4 (40 % plyometric at block end, 25 % at start); aerobic 4 / pre 2 / in 2 (gym_plan)
- athletic dose / week: plyometric contacts 55-80; all jump contacts 95-130; throws 150-200 (T3); COD cuts 40-50 (MOD. TURN); sprint m 0-100; Olympic sets 7-11
- resistance: goal strength / power; emphasis hypertrophy 20; strength 45; power 35; rep zone STRENGTH + POWER (weight class); bilateral/unilateral % of lower compound sets: block start 40/60 -> end 30/70, in season 20/80; contra / ipsi: contralateral for level changes and sprawls (INFERRED from CAT-13)
- season: pre-season 60 % of off-season sets (3 lift days); in season 45 % (2 lift days, game-heavy no); the one hard gym day >= 48 h before a competition (COACH-R2 ATH-07, extended INFERRED)
- Olympic lifts: everyone in athletic training gets Olympic lifts (COACH-ANSWER ATH-10); 60+: none by default; offered as an option with the warning 'Make sure that you have a fitness professional to help you understand what this means' (COACH-R2 ATH-08); older / injured / high-volume clients 
- injuries: NECK, SHOULDER_STRIKER, LOW_BACK_LOADING, GROIN_ADDUCTOR, WRIST_HAND, PAIN_GENERAL, KNEE_GRAPPLING, ELBOW_GRAPPLING
- variants: `mma_heavyweight` Heavyweight (BKD 2; BHD 2; HPUSH 1; PLYO -2; JLK -2)
- sample week (off season): Mon - knee + pull: warm-up -> core 2 x 2 light (COACH-R2 SES-03) -> medball list part 1 (rotational throws, overhead slams, 1 x 10 each - LIB-22) -> ballistic j / Tue - conditioning first: a real aerobic block (Orange 20-40 min or Green grappling exchanges 35-75 s at ~1:1; ORD-09) -> core 2 x 2 -> plyo (sprawl landings -> / Wed - MMA practice (striking / wrestling / BJJ); optional Focus / core day (optional days ideally separate - ORD-10) / Thu - knee + pull: core 2 x 2 -> medball list part 2 -> loaded jump (hex-bar / DB jump, 10-20 % body weight - EQ-15) -> clean variant -> belt squat or leg press / Fri - conditioning first (Blue striking bursts 12-24 s at 1:3-1:7, a different colour from Tuesday) -> core 2 x 2 -> plyo -> power clean -> HEAVY DEADLIFT / tra / Sat - sparring; Sun - off; the 3rd (and 4th) aerobic session = the colour not used yet, after practice

#### Brazilian jiu-jitsu / submission grappling (`bjj_grappling`)

- ES: Jiu-jitsu brasileño (BJJ) y grappling | category: competitive | sport: bjj | picked by: bjj:gi, bjj:nogi | positions: gi, no-gi (see variant), weight classes / belt divisions
- origin: 04_v1 (04); family combat; ath03 combat; evidence: INFERRED
- why: Least ballistic combat sport: strength, grip and isometric endurance.
- template: 3-day strength + grip/neck accessories
- numbers: 3 main + 0 optional days; 99 sets / week (28 athletic); contact class 5 (25 % plyometric at block end, 10 % at start); aerobic 3 / pre 2 / in 2 (gym_plan)
- athletic dose / week: plyometric contacts 20-35; all jump contacts 70-90; throws 80-120 (T2); COD cuts 0 (-); sprint m 0; Olympic sets 2-6
- resistance: goal strength / endurance-strength; emphasis hypertrophy 30; strength 50; power 20; rep zone STRENGTH + VOL 2; bilateral/unilateral % of lower compound sets: block start 50/50 -> end 40/60, in season 30/70; contra / ipsi: health accessory (INFERRED)
- season: pre-season 60 % of off-season sets (3 lift days); in season 45 % (2 lift days, game-heavy no); the one hard gym day >= 48 h before a competition (COACH-R2 ATH-07, extended INFERRED)
- Olympic lifts: everyone in athletic training gets Olympic lifts (COACH-ANSWER ATH-10); 60+: none by default; offered as an option with the warning 'Make sure that you have a fitness professional to help you understand what this means' (COACH-R2 ATH-08); older / injured / high-volume clients 
- injuries: NECK, LOW_BACK_LOADING, PAIN_GENERAL, KNEE_GRAPPLING, ELBOW_GRAPPLING, SHOULDER_CONTACT
- variants: `bjj_nogi` No-gi / submission grappling (ISO_GRIP -1; BALL 1; COD 2)
- sample week (off season): Mon - full body A (knee + pull): warm-up -> core 2 x 2 -> medball (rotational slams) -> ballistic jump -> clean variant (hang clean / KB squat clean) -> HEAVY S / Wed - full body B (hip + push): real aerobic block first (Orange 20-30 min) -> core 2 x 2 -> plyo / landing (landing + box jumps (mostly ballistic, class 5)) -> / Fri - full body C: core 2 x 2 -> medball -> KB squat clean -> belt squat / leg press (non-axial) + single-arm row -> lateral lunge + DB press -> carries (farmer / Tue / Thu / Sat - BJJ practice; aerobic sessions after practice (one of each colour)

#### Judo (`judo`)

- ES: Judo | category: competitive | sport: judo | picked by: judo:light, judo:middle, judo:heavy | positions: light weight classes, middle weight classes, heavy weight classes (see variant)
- origin: sports/combat-strength-fitness.json (new), base `wrestling`; family combat; ath03 resistance; evidence: NEW (PROPOSED budget, INFERRED from SCIENCE and the nearest 04 profile: 04:wrestling (nearest profile))
- why: New profile sized like 04 wrestling (more-resistance group, class 5). Judo adds gi grip work, rotational throwing power both directions and elbow care (ELBOW_GRAPPLING). Aerobic 4 is PROPOSED (judo is not in R2-ATH-06).
- template: MM BOXING build-up structure with grappling pull / grip / neck (as 04 wrestling)
- numbers: 4 main + 0 optional days; 130 sets / week (39.5 athletic); contact class 5 (25 % plyometric at block end, 10 % at start); aerobic 4 / pre 2 / in 2 (gym_plan)
- athletic dose / week: plyometric contacts 20-28; all jump contacts 44-60; throws 128-172 (T2); COD cuts 24-32 (MOD. TURN); sprint m 102-138; Olympic sets 6.4-9.6
- resistance: goal strength / power; emphasis hypertrophy 15; strength 55; power 30; rep zone STRENGTH (relative strength, weight class) + POWER; bilateral/unilateral % of lower compound sets: block start 50/50 -> end 40/60, in season 30/70; contra / ipsi: contra / ipsi lunges as health accessories early in the block (CAT-13 size / strength logic); contralateral for entries into the hip on throws (INFERRED)
- season: pre-season 60 % of off-season sets (3 lift days); in season 45 % (2 lift days, game-heavy no); the one hard gym day >= 48 h before a competition (COACH-R2 ATH-07, extended INFERRED)
- Olympic lifts: everyone in athletic training gets Olympic lifts (COACH-ANSWER ATH-10); 60+: none by default; offered as an option with the warning 'Make sure that you have a fitness professional to help you understand what this means' (COACH-R2 ATH-08); older / injured / high-volume clients 
- injuries: SHOULDER_CONTACT, KNEE_GRAPPLING, ELBOW_GRAPPLING, NECK, WRIST_HAND, PAIN_GENERAL
- variants: `judo_heavyweight` Heavy weight classes (BKD 2; BHD 1; HPUSH 1; PLYO -1.5)
- sample week (off season): Mon - knee + pull: warm-up -> core 2 x 2 light (COACH-R2 SES-03) -> medball (rotational throws both sides) -> ballistic jump (broad jumps / hip-in jumps) -> cle / Tue - hip + push: real aerobic block first (Orange 20-30 min or Green 4-min match simulations, ORD-09) -> core 2 x 2 -> plyo (landing sticks -> entry hops -> re / Wed - judo practice (randori) / Thu - knee + pull: core 2 x 2 -> medball -> loaded jump -> clean variant -> belt squat or leg press (non-axial) + chest-supported row -> lateral lunge (foot swe / Fri - hip + push: conditioning first (Blue 20-30 s on / 10 s off repeats) -> core 2 x 2 -> plyo -> snatch variant -> HEAVY DEADLIFT / trap bar (axial day 2) + D / Sat - randori / tournament; Sun - off; remaining aerobic sessions (colours not used yet) after practice

#### Karate (kumite) (`karate_taekwondo`)

- ES: Karate (kumite) | category: competitive | sport: karate | picked by: karate:kumite, karate:kata | positions: kumite (sparring) - weight classes, kata (forms) - see variant | aliases: karate
- origin: 04_v1 (04); family combat; ath03 combat; evidence: INFERRED; ordering anchor OBSERVED in coach's words ('boxers and karate athletes don't need that many plyos')
- why: Coach: 'the more time on the ground they have to have, like a karate athlete, the more ballistics and less plyos' (ATH-01) and boxing = karate near the bottom of the plyo ranking (ATH-02) -> long ground-contact class, plyometric P1, high throws. v1 lowers the v0 low-amplitude bounce target (200-260 -> 80-120): stance bounce is practised in the sport itself (INFERRED).
- template: MM BOXING build-up structure
- numbers: 4 main + 0 optional days; 125 sets / week (48 athletic); contact class 5 (25 % plyometric at block end, 10 % at start); aerobic 3 / pre 2 / in 2 (gym_plan)
- athletic dose / week: plyometric contacts 15-30; all jump contacts 35-50; throws 180-220 (T3); COD cuts 55-70 (MOD. TURN); sprint m 60-120; Olympic sets 2-6
- resistance: goal power / strength; emphasis hypertrophy 20; strength 35; power 45; rep zone POWER + STRENGTH low volume (weight classes); bilateral/unilateral % of lower compound sets: block start 30/70 -> end 20/80, in season 20/80; contra / ipsi: contralateral (INFERRED)
- season: pre-season 60 % of off-season sets (3 lift days); in season 45 % (2 lift days, game-heavy no); the one hard gym day >= 48 h before a competition (COACH-R2 ATH-07, extended INFERRED)
- Olympic lifts: everyone in athletic training gets Olympic lifts (COACH-ANSWER ATH-10); 60+: none by default; offered as an option with the warning 'Make sure that you have a fitness professional to help you understand what this means' (COACH-R2 ATH-08); older / injured / high-volume clients 
- injuries: HAMSTRING, HIP_FLEXOR, GROIN_ADDUCTOR, ANKLE_SPRAIN, PAIN_GENERAL
- variants: `karate_kata` Kata (forms) (COD -4; THROW -6; SPRINT -2; UKD 1; UHD 1)
- sample week (off season): Mon - knee + pull: warm-up -> core 2 x 2 light (COACH-R2 SES-03) -> medball list part 1 (rotational throws both sides, 1 x 10 each - LIB-22) -> ballistic jump ( / Tue - conditioning first: a real aerobic block (Orange 20-30 min; ORD-09) -> core 2 x 2 -> plyo (low-amplitude stance bounce, skips, single-leg hops, by Receive / Wed - karate practice; optional Focus / core day (optional days ideally separate - ORD-10) / Thu - knee + pull: core 2 x 2 -> medball list part 2 -> loaded jump (hex-bar / DB jump, 10-20 % body weight - EQ-15) -> clean variant -> belt squat or leg press / Fri - conditioning first (Blue efforts ~8-10 s at 1:1-1:4, a different colour from Tuesday) -> core 2 x 2 -> plyo -> hang power clean -> HEAVY DEADLIFT / trap b / Sat - kumite / practice; Sun - off; the 3rd (and 4th) aerobic session = the colour not used yet, after practice

#### Taekwondo (sparring / kyorugi) (`taekwondo`)

- ES: Taekwondo (combate / kyorugi) | category: competitive | sport: taekwondo | picked by: taekwondo:sparring, taekwondo:poomsae | positions: sparring (kyorugi) - weight classes, poomsae (forms) - see variant
- origin: sports/combat-strength-fitness.json (delta), base `karate_taekwondo`; family combat; ath03 combat; evidence: 04 v1 'karate_taekwondo' + PROPOSED deltas; base evidence: INFERRED; ordering anchor OBSERVED in coach's words ('boxers and karate athletes don't need that many plyos')
- why: Split out of 04 'karate_taekwondo' with small PROPOSED deltas (a little more low-amplitude bounce, one more ballistic set, two fewer throw sets, one more hamstring set). Plyometric share 28 % vs karate 25 % because of the bouncing stance.
- template: MM BOXING build-up structure
- numbers: 4 main + 0 optional days; 126 sets / week (48 athletic); contact class 5 (25 % plyometric at block end, 10 % at start); aerobic 3 / pre 2 / in 2 (gym_plan)
- athletic dose / week: plyometric contacts 19-25; all jump contacts 42-56; throws 153-207 (T3); COD cuts 54-72 (MOD. TURN); sprint m 153-207; Olympic sets 3.2-4.8
- resistance: goal power / strength; emphasis hypertrophy 20; strength 35; power 45; rep zone POWER + STRENGTH low volume (weight classes); bilateral/unilateral % of lower compound sets: block start 30/70 -> end 20/80, in season 20/80; contra / ipsi: contralateral (INFERRED)
- season: pre-season 60 % of off-season sets (3 lift days); in season 45 % (2 lift days, game-heavy no); the one hard gym day >= 48 h before a competition (COACH-R2 ATH-07, extended INFERRED)
- Olympic lifts: everyone in athletic training gets Olympic lifts (COACH-ANSWER ATH-10); 60+: none by default; offered as an option with the warning 'Make sure that you have a fitness professional to help you understand what this means' (COACH-R2 ATH-08); older / injured / high-volume clients 
- injuries: HAMSTRING, HIP_FLEXOR, GROIN_ADDUCTOR, ANKLE_SPRAIN, PAIN_GENERAL, ACHILLES_CALF
- variants: `taekwondo_poomsae` Poomsae (forms) (COD -4; THROW -6; SPRINT -2; UKD 1; BALL 1)
- sample week (off season): Mon - knee + pull: warm-up -> core 2 x 2 light (COACH-R2 SES-03) -> medball list part 1 (rotational throws both sides, 1 x 10 each - LIB-22) -> ballistic jump ( / Tue - conditioning first: a real aerobic block (Orange 20-30 min; ORD-09) -> core 2 x 2 -> plyo (stance bounce (low amplitude), switch hops, single-leg hops, by / Wed - taekwondo practice; optional Focus / core day (optional days ideally separate - ORD-10) / Thu - knee + pull: core 2 x 2 -> medball list part 2 -> loaded jump (hex-bar / DB jump, 10-20 % body weight - EQ-15) -> clean variant -> belt squat or leg press / Fri - conditioning first (Blue efforts ~8 s at 1:1, a different colour from Tuesday) -> core 2 x 2 -> plyo -> hang power clean -> HEAVY DEADLIFT / trap bar (axi / Sat - sparring / practice; Sun - off; the 3rd (and 4th) aerobic session = the colour not used yet, after practice

#### Kickboxing / Muay Thai (`kickboxing_muay_thai`)

- ES: Kickboxing / Muay Thai | category: competitive | sport: kickboxing_muay_thai | picked by: kickboxing_muay_thai:kickboxing, kickboxing_muay_thai:muay_thai | positions: weight classes (no position split), amateur (3 x 2-3 min), pro (3-5 x 3 min)
- origin: 04_v1 (04); family combat; ath03 combat; evidence: INFERRED from OBSERVED boxing template
- why: Boxing plus kicks and clinch: more single-leg, frontal and transverse work, neck.
- template: MM BOXING build-up structure
- numbers: 4 main + 0 optional days; 129 sets / week (51 athletic); contact class 5 (25 % plyometric at block end, 10 % at start); aerobic 4 / pre 2 / in 2 (gym_plan)
- athletic dose / week: plyometric contacts 20-40; all jump contacts 40-55; throws 220-260 (T3); COD cuts 35-50 (MOD. TURN); sprint m 0-60; Olympic sets 4-8
- resistance: goal power / strength; emphasis hypertrophy 20; strength 40; power 40; rep zone as boxing; bilateral/unilateral % of lower compound sets: block start 30/70 -> end 20/80, in season 20/80; contra / ipsi: contralateral (INFERRED from CAT-13)
- season: pre-season 60 % of off-season sets (3 lift days); in season 45 % (2 lift days, game-heavy no); the one hard gym day >= 48 h before a competition (COACH-R2 ATH-07, extended INFERRED)
- Olympic lifts: everyone in athletic training gets Olympic lifts (COACH-ANSWER ATH-10); 60+: none by default; offered as an option with the warning 'Make sure that you have a fitness professional to help you understand what this means' (COACH-R2 ATH-08); older / injured / high-volume clients 
- injuries: GROIN_ADDUCTOR, HIP_FLEXOR, NECK, SHOULDER_STRIKER, LOW_BACK_ROTATIONAL, PAIN_GENERAL
- variants: `muay_thai_clinch` Muay Thai (clinch heavy) (ISO_NECK 2; HPULL 1; ISO_GRIP 2)
- sample week (off season): Mon - knee + pull: warm-up -> core 2 x 2 light (COACH-R2 SES-03) -> medball list part 1 (rotational throws both sides, 1 x 10 each - LIB-22) -> ballistic jump ( / Tue - conditioning first: a real aerobic block (Orange 20-40 min; ORD-09) -> core 2 x 2 -> plyo (switch-kick hops, skips, rope, by Receive-Create stage) -> snat / Wed - Muay Thai / kickboxing practice; optional Focus / core day (optional days ideally separate - ORD-10) / Thu - knee + pull: core 2 x 2 -> medball list part 2 -> loaded jump (hex-bar / DB jump, 10-20 % body weight - EQ-15) -> clean variant -> belt squat or leg press / Fri - conditioning first (Green 3-min rounds, a different colour from Tuesday) -> core 2 x 2 -> plyo -> hang power clean -> HEAVY DEADLIFT / trap bar (axial day / Sat - sparring; Sun - off; the 3rd (and 4th) aerobic session = the colour not used yet, after practice

#### Tennis - competitive (`tennis`)

- ES: Tenis - competitivo | category: competitive | sport: tennis | picked by: tennis:singles, tennis:doubles, racket_other:badminton, racket_other:squash, racket_other:racquetball, racket_other:table_tennis | positions: singles, doubles
- origin: 04_v1 (04); family field_court; ath03 rotational_power; evidence: INFERRED
- why: Rotation both directions + lateral COD + overhead serve -> high throws (transverse), high COD, frontal/transverse priority.
- template: MM BASEBALL-style Parts (upper ballistics + lower ballistics days, core by plane) or BYOP ATHLETIC 4-day
- numbers: 4 main + 2 optional days; 136.5 sets / week (57 athletic); contact class 3 (50 % plyometric at block end, 35 % at start); aerobic 3 / pre 2 / in 2 (gym_plan)
- athletic dose / week: plyometric contacts 45-70; all jump contacts 60-80; throws 150-200 (T3); COD cuts 100-120 (HARD TURN); sprint m 80-150; Olympic sets 2-6
- resistance: goal power / strength; emphasis hypertrophy 25; strength 40; power 35; rep zone VOL 2 + STRENGTH; bilateral/unilateral % of lower compound sets: block start 20/80 -> end 10/90, in season 10/90; contra / ipsi: contralateral 'definitely' (COACH-ANSWER CAT-13)
- season: pre-season 60 % of off-season sets (3 lift days); in season 45 % (2 lift days, game-heavy yes); the one hard gym day >= 48 h before a competition (COACH-R2 ATH-07, extended INFERRED)
- Olympic lifts: everyone in athletic training gets Olympic lifts (COACH-ANSWER ATH-10); 60+: none by default; offered as an option with the warning 'Make sure that you have a fitness professional to help you understand what this means' (COACH-R2 ATH-08); older / injured / high-volume clients 
- injuries: ELBOW_LATERAL_RACKET, SHOULDER_THROWER, LOW_BACK_ROTATIONAL, ACHILLES_CALF, ANKLE_SPRAIN, GROIN_ADDUCTOR, PAIN_GENERAL
- variants: `padel_competitive` Padel - competitive (tournament)
- sample week (off season): Mon - knee + pull: warm-up -> core 2 x 2 light -> lateral plyos (RC stage) + split-step pogos -> clean variant (hang pull) -> front / goblet squat (axial day 1) / Tue - COD / speed: squirrel jumps -> MACH / 3-10 m starts -> route tree EASY -> MOD. -> HARD TURN (ATH-06, LIB-21) -> core -> medball scoops both sides + overhe / Thu - hip + push: core -> lateral bounds -> DB snatch -> trap-bar deadlift (axial day 2) + landmine press -> step-ups (ipsilateral first step) -> Copenhagen ->  / Fri - COD + full body: core -> reactive agility -> medball list -> belt squat / leg press (non-axial) -> unilateral push / pull -> calves / Wed / Sat - practice / matches; aerobic 3 (one of each colour)
- **v1.2 (round 3):** COACH-R3 ATH-02 (approved): pickleball, padel and tennis players 50+ get knee-friendly strength, calf and Achilles work every leg day, rotator-cuff work, and only low-impact jumps (no depth jumps, hurdle hops or bounds) unless switched on; structured as age_50_plus.plyo_off_by_default for the engine (applied only from age 50 - flag G4)
- 50+: COACH-R3 ATH-02 (approved): pickleball, padel and tennis players 50+ get knee-friendly strength, calf and Achilles work every leg day, rotator-cuff work, and only low-impact jumps (no depth jumps, hurdle hops or bounds) unless switched on. Detail: knee - knee-friendly strength every week: leg press / box squat to a pain-free depth, split squat and low step-ups, slow-eccentric leg extensions and isometric holds; lateral hip strength (KNEE_DEGENERATIVE_COURT rules, INFERRED detail); Achilles / calf - calf and Achilles work every leg day: straight-knee and bent-knee calf raises (3 sets, VOL-17), slow lowering, ankle work progressed by no more than about 10-20 % a week (ACHILLES_CALF); shoulder / elbow - rotator-cuff work (COACH-R3 ATH-02): side-lying DB external rotation, prone Y / T and KB face pulls 2-3 x / week; wrist-extensor isometrics for the racket elbow (ELBOW_LATERAL_RACKET); plyo - 50+: low-impact jumps only - landings, split-step pogos and low lateral line hops; depth jumps, hurdle hops and bounds stay off by default and can be switched on (COACH-R3 ATH-02); off by default: depth_jump, high_depth_drop, hurdle_hop, bound (from age 50; the user or coach can switch these jumps on (COACH-R3 ATH-02))

### 8.4 Strength and fitness sports

#### Powerlifting - competitive (meet lifter) (`powerlifting_strength`)

- ES: Powerlifting (levantamiento de potencia) - competitivo | category: competitive | sport: powerlifting | picked by: powerlifting:raw, powerlifting:equipped | positions: raw / classic, equipped (single-ply) - same profile, technique work differs, weight classes | aliases: powerlifting_competitive | goal default for: strength
- origin: 04_v1 (04); family strength; ath03 size_strength; evidence: OBSERVED ('(NOT DONE) 4 TRACKS PROGRAMMING' STRENGTH-8 conjugate, mean of loading weeks; STRENGTH-12 as variant)
- why: Coach's conjugate-style product for strength clients.
- template: STRENGTH-8: 'the work' -> 'the accessory' -> 'the nuance' -> 'the survival'; Mon lower M.E., Wed upper M.E., Thu plyo + lower D.E., Sat upper D.E.
- numbers: 4 main + 0 optional days; 73.5 sets / week (3 athletic); contact class - (- % plyometric at block end, - % at start); aerobic 2 / pre 2 / in 2 (gym_plan)
- athletic dose / week: plyometric contacts -; all jump contacts 18; throws 0 (T0); COD cuts 0 (-); sprint m 0; Olympic sets 0
- resistance: goal strength / hypertrophy; emphasis hypertrophy 20; strength 60; power 20; rep zone M.E. 5,4,3,2,1,3,2,1 @ '1RIR'; D.E. 3,3,2,1,3,2,1,1 'FAST'; accessory 3x6 '2RIR'; nuance 'MAX'; survival 'ALL'; bilateral/unilateral % of lower compound sets: block start 50/50 -> end 90/10, in season -; contra / ipsi: contra / ipsi lunges and step-ups as health accessories in weeks 1-4, then bilateral; kept later only if something bugs the lifter (COACH-ANSWER CAT-13)
- season: pre-season 75 % of off-season sets (3 lift days); in season 50 % (3 lift days, game-heavy no); the one hard gym day >= 48 h before a competition (COACH-R2 ATH-07, extended INFERRED)
- Olympic lifts: not in athletic training -> no Olympic lifts by default (COACH-ANSWER ATH-10 applies to athletic training); 60+: -
- injuries: LOW_BACK_LOADING, PAIN_GENERAL, BICEPS_TENDON
- variants: `strength_12wk` Strength 12-week (percent + RPE)
- sample week (off season): Mon - lower max effort ('the work'): warm-up -> core 1-2 x 2 light (COACH-R2 SES-03) -> HEAVY SQUAT or box squat to RPE 8-9 (axial day 1, COACH-R2 SES-01) -> 't / Wed - upper max effort: core -> bench press to RPE 8-9 -> close-grip / incline press -> rows (pull every day - OBSERVED) -> triceps + rear delts (in the shoulders group - COACH-R3 VOL-01) / Thu - plyo 'EASY' 3 x 6 (weighted depth drop / depth drop & jump / high squat jumps - OBSERVED potentiator) -> lower dynamic effort: HEAVY DEADLIFT week = deadl / Sat - upper dynamic effort: speed bench 'FAST' -> overhead or incline -> pull-ups / rows -> biceps (mixed-grip health - BICEPS_TENDON) -> rear delts / Tue / Fri / Sun - off or easy Orange cardio x 2 (COACH-R2 ATH-06)

#### Olympic weightlifting (snatch / clean & jerk) - competitive (`weightlifting`)

- ES: Halterofilia / levantamiento olímpico (Weightlifting) - competitivo | category: competitive | sport: olympic_weightlifting | positions: weight classes, youth / junior / senior / masters age groups
- origin: sports/combat-strength-fitness.json (new), base `powerlifting_strength`; family strength; ath03 resistance; evidence: NEW (PROPOSED budget, INFERRED from SCIENCE and the nearest 04 profile: 04:powerlifting_strength (strength family) + 04 olympic_by_level)
- why: Scaffold only. The coach said competitive Olympic lifting 'becomes a nuance, and now the program needs to change to Olympic weightlifting programming' (R2-GEN-06). This is the one profile where % of each lift's 1RM is the default. The two-heavy-squat-days tradition is reconciled with R2-SES-01 by making the second squat light-moderate and the pull day the 'deadlift' day - open question Q2.
- template: 4-day weightlifting week (snatch day / clean & jerk day x 2) - PROPOSED scaffold; the coach says competitive weightlifting is its own programming (COACH-R2 GEN-06)
- numbers: 4 main + 1 optional days; 107 sets / week (36 athletic); contact class 5 (25 % plyometric at block end, 10 % at start); aerobic 2 / pre 2 / in 2 (gym_plan)
- athletic dose / week: plyometric contacts 5-7; all jump contacts 20-26; throws 0 (T0); COD cuts 0 (-); sprint m 0; Olympic sets 25.6-38.4
- resistance: goal power / strength; emphasis hypertrophy 15; strength 40; power 45; rep zone competition lifts 1-3 reps (PROPOSED, % of that lift's own 1RM - COACH-R2 GEN-06); squats 2-5; pulls 2-4; accessories VOL 2; bilateral/unilateral % of lower compound sets: block start 60/40 -> end 85/15, in season 90/10; contra / ipsi: contra / ipsi lunges and step-ups as health accessories in weeks 1-4, then bilateral (COACH-ANSWER CAT-13 size / strength rule)
- season: pre-season 70 % of off-season sets (3 lift days); in season 50 % (3 lift days, game-heavy no); the one hard gym day >= 48 h before a competition (COACH-R2 ATH-07, extended INFERRED)
- Olympic lifts: the competition lifts ARE the sport: % of each lift's own 1RM is the default here because this is the competitive-weightlifter case (COACH-R2 GEN-06); 60+: masters lifters opt in with the warning (COACH-R2 ATH-08); snatch / overhead squat never by default for older / injured clients (EQ-03)
- injuries: PATELLAR_TENDON, LOW_BACK_LOADING, WRIST_HAND, SHOULDER_GYMNASTIC, PAIN_GENERAL
- variants: `weightlifting_advanced` L3 / national-level lifter (5-6 days) (TE 10; BKD 4; BHD 1; VPUSH 2)
- sample week (off season): Mon - snatch + squat: warm-up -> core 2 x 2 light (COACH-R2 SES-03) -> box jumps 2 x 3 (potentiation) -> snatch (or hang / power snatch by level) 5-6 sets x 1-3 / Tue - clean & jerk + upper: core 2 x 2 -> clean & jerk 5-6 sets x 1-2 (+1) -> jerk drives / push press -> pull-ups -> rear delts -> calves / Wed - off or easy Orange (COACH-R2 ATH-06 = powerlifters) / Thu - snatch technique + front squat: core -> hang snatch / snatch balance (L2+) -> FRONT SQUAT moderate (second squat exposure kept light-moderate, like the ap / Fri - clean + pulls: core -> power clean / clean 5 x 2 -> HEAVY clean deadlift / clean pull (axial day 2) -> RDL light or back extension -> push press -> calves / Sat - optional (L3): technique / max-out day by the coach's eye; Sun off; easy Orange

#### Strongman (`strongman`)

- ES: Strongman (pruebas de fuerza) | category: competitive | sport: strongman | positions: weight classes (lightweight / middleweight / heavyweight / open), novice / masters divisions
- origin: sports/combat-strength-fitness.json (new), base `powerlifting_strength`; family strength; ath03 size_strength; evidence: NEW (PROPOSED budget, INFERRED from SCIENCE and the nearest 04 profile: 04:powerlifting_strength (strength family))
- why: New. Sized like 04 powerlifting plus overhead, carries and loading events. Carries go in ISO_GRIP (the library's empty CARRY / DRAGS columns, LIB-19). The yoke is treated as an axial lift and shares the squat day (INFERRED from K14) - confirm with the coach.
- template: 4-day strongman week: squat / yoke day, overhead day, deadlift / stone day, moving-events day (PROPOSED)
- numbers: 4 main + 0 optional days; 108 sets / week (12 athletic); contact class 5 (25 % plyometric at block end, 10 % at start); aerobic 2 / pre 2 / in 2 (gym_plan)
- athletic dose / week: plyometric contacts 7-9; all jump contacts 20-28; throws 17-23 (T1); COD cuts 0 (-); sprint m 0; Olympic sets 4.8-7.2
- resistance: goal strength / hypertrophy; emphasis hypertrophy 30; strength 55; power 15; rep zone STRENGTH 2-5 for the barbell lifts; events by distance / time; accessories VOL 2; bilateral/unilateral % of lower compound sets: block start 50/50 -> end 80/20, in season 85/15; contra / ipsi: contra / ipsi lunges and step-ups as health accessories in weeks 1-4, then bilateral (COACH-ANSWER CAT-13)
- season: pre-season 70 % of off-season sets (3 lift days); in season 50 % (3 lift days, game-heavy no); the one hard gym day >= 48 h before a competition (COACH-R2 ATH-07, extended INFERRED)
- Olympic lifts: everyone in athletic training gets Olympic lifts (COACH-ANSWER ATH-10); 60+: none by default; offered as an option with the warning 'Make sure that you have a fitness professional to help you understand what this means' (COACH-R2 ATH-08); older / injured / high-volume clients 
- injuries: LOW_BACK_LOADING, BICEPS_TENDON, SHOULDER_GYMNASTIC, PATELLAR_TENDON, PAIN_GENERAL
- sample week (off season): Mon - squat + yoke: warm-up -> core 2 x 2 light -> box jump 2 x 3 -> HEAVY SQUAT (axial day 1) -> yoke runs (axial - stays on the squat day, INFERRED) -> sandba / Tue - overhead: core -> log clean & press (event) -> push press / axle press -> DB incline press -> rows -> triceps -> side raises + rear delts / Thu - deadlift + loading: core -> overhead backward medball throw -> HEAVY DEADLIFT / axle deadlift (axial day 2) -> stones or sandbag-to-shoulder (moderate) -> / Sat - moving events + upper: core -> farmers carry / frame carry, sled drag or truck push (light-moderate, non-axial day) -> pull-ups -> DB bench -> grip -> eve / Wed / Fri / Sun - off; 1 easy Orange

#### CrossFit - competitor (FULL TIME) (`crossfit_competitor`)

- ES: CrossFit - competidor (FULL TIME) | category: competitive | sport: crossfit | picked by: crossfit:individual, crossfit:team, crossfit:masters_teens | positions: individual, team, age groups (masters / teens)
- origin: 04_v1 (04); family crossfit; ath03 size_strength; evidence: OBSERVED (MASTER_MODEL 'EXAMPLE CROSSFIT SPLIT' macro grid + FULL TIME table; weekly sets = JULY strength month)
- why: Quality x month x level is the coach's master abstraction; the competitor gets volume progression (add sets), the class member intensification (cut reps). FULL TIME = competitor, HALF TIME = class member (COACH-ANSWER PRG-10). 40-rep / AMRAP sets belong here as an option (VOL-11).
- template: CF macro: plan[quality][month] = level; dose = FULL TIME table
- numbers: 4 main + 1 optional days; 78 sets / week (0 athletic); contact class - (- % plyometric at block end, - % at start); aerobic 2 / pre 3 / in 2 (gym_plan)
- athletic dose / week: plyometric contacts -; all jump contacts 0-60; throws 50-150 (T2 (wall balls / slams in WODs)); COD cuts 0 (-); sprint m 0-150; Olympic sets 0-24
- resistance: goal strength / power; emphasis hypertrophy 20; strength 45; power 35; rep zone STRENGTH L1 3x7 -> L4 6x4 (FULL TIME); RESISTANCE 2x10 / 3x10 only; bilateral/unilateral % of lower compound sets: block start 50/50 -> end 70/30, in season 60/40; contra / ipsi: health accessory (CAT-13 size/strength logic, INFERRED for CrossFit)
- Olympic lifts: everyone in athletic training gets Olympic lifts (COACH-ANSWER ATH-10); 60+: none by default; offered as an option with the warning 'Make sure that you have a fitness professional to help you understand what this means' (COACH-R2 ATH-08); older / injured / high-volume clients 
- injuries: SHOULDER_GYMNASTIC, LOW_BACK_LOADING, WRIST_HAND, PAIN_GENERAL
- promoted v1 variants: crossfit_class -> now the full profile `crossfit_class` (position profile in v1.1)
- sample week (off season): OBSERVED 'COMPETE CROSSFIT SPLIT' (month grid decides which rows are active): Mon knee-dominant strength + snatch + lower resistance + aerobic / Tue pull + clean + upper resistance + skill 'T2B/ DUBS' + WOD / Wed OFF / Thu hip-dominant strength + snatch + lower resistance + aerobic / Fri push + clean + upper resistance + skill 'H.S./ DUBS' + WOD / Sat aerobic in level 3-4 aerobic months (AUG, SEPT, NOV, DEC, MAY); Sun OFF / v1.1 additions: core first 2 x 2 light (COACH-R2 SES-03); Mon knee day = heavy squat (axial day 1) and Thu hip day = heavy deadlift (axial day 2) (COACH-R2 SES-
- open: Number of WODs at 'LVL 4 = wods a week' (not asked).

#### HYROX - competitive (Open / Pro / Doubles) (`hyrox_competitive`)

- ES: HYROX - competitivo (Open / Pro / Doubles) | category: competitive | sport: hyrox | picked by: hyrox:open, hyrox:pro, hyrox:doubles_relay | positions: Open division, Pro division (heavier stations - see variant), Doubles / relay (see variant), age groups
- origin: sports/combat-strength-fitness.json (new), base `hybrid`; family crossfit; ath03 endurance; evidence: NEW (PROPOSED budget, INFERRED from SCIENCE and the nearest 04 profile: 04:hybrid (OBSERVED HYBRID-8) + 04:distance_runner (aerobic logic))
- why: Competitive HYROX (the coach's 'high rows'). Running is about 60 % of race time (K18), so the aerobic sessions are the backbone (4, approved - COACH-R3 ATH-03) and the gym holds strength for the sled, lunges and carries. Gen-pop people who want HYROX for fitness use the recreational profile in genpop-active (not this one).
- template: approved HYROX plan (COACH-R3 ATH-03): strength A (squat + pull), strength B (deadlift + push), hybrid 1 (run intervals + station circuit finisher), hybrid 2 ('1 km run + 1 station' repeated + station circuit finisher) + 2 Orange sessions = 4 cardio sessions (Blue, Green, Orange, second Orange)
- numbers: 4 main + 1 optional days; 102 sets / week (22 athletic); contact class 3 (50 % plyometric at block end, 35 % at start); aerobic 4 / pre 4 / in 3 (gym_plan)
- athletic dose / week: plyometric contacts 17-23; all jump contacts 33-45; throws 34-46 (T1); COD cuts 0 (EASY TURN); sprint m 102-138; Olympic sets 4.8-7.2
- resistance: goal endurance-strength / strength; emphasis hypertrophy 20; strength 50; power 10; endurance_strength 20; rep zone STRENGTH 3-6 on squat / deadlift, VOL 1-2 on lunges and rows; station work as timed sets; bilateral/unilateral % of lower compound sets: block start 40/60 -> end 30/70, in season 30/70; contra / ipsi: ipsilateral step-ups / lunges to drive out of the hip (sled push, uphill running - CAT-13 acceleration logic, INFERRED); contra / ipsi health accessories early in the block
- season: pre-season 60 % of off-season sets (3 lift days); in season 50 % (2 lift days, game-heavy no); the one hard gym day >= 48 h before a competition (COACH-R2 ATH-07, extended INFERRED)
- Olympic lifts: everyone in athletic training gets Olympic lifts (COACH-ANSWER ATH-10); 60+: none by default; offered as an option with the warning 'Make sure that you have a fitness professional to help you understand what this means' (COACH-R2 ATH-08); older / injured / high-volume clients 
- injuries: ACHILLES_CALF, PATELLAR_TENDON, LOW_BACK_LOADING, HAMSTRING, PAIN_GENERAL
- variants: `hyrox_pro` Pro division (heavier stations) (BKD 2; UKD 2; ISO_GRIP 2; HPULL 1); `hyrox_doubles` Doubles / relay (UKD -1; ISO_GRIP -1)
- sample week (off season): Mon - strength A (squat + pull): warm-up -> core 2 x 2 light (COACH-R2 SES-03) -> broad jumps (ballistic, RC stage) -> hang power clean -> HEAVY FRONT / Tue - hybrid 1 (Blue): core 2 x 2 -> pogos -> run or erg intervals 30/30 or 40/20 -> station circuit finisher 1 (sled push / pull, wall balls with the / Wed - Orange: long easy run 45-75 min / Thu - strength B (deadlift + push): core 2 x 2 -> pogos / ankle hops (running economy) -> KB snatch -> HEAVY TRAP-BAR DEADLIFT (axial day 2) + DB benc / Sat - hybrid 2 (Green): core 2 x 2 -> 4 x (1 km run + 1 rotating station: sled push / sled pull / burpee broad jumps / sandbag lunges / wall balls / s / Sun - second easy Orange (bike / erg / walk) - the 4th cardio session (COACH-R3 ATH-03) / Fri - off or optional (Focus / core / calves)
- **v1.2 (round 3):** COACH-R3 ATH-03 (approved HYROX plan): 2 strength days (squat + pull, deadlift + push) + 2 hybrid days (run intervals, or 1 km run + 1 station repeated); 4 cardio sessions (Blue, Green, Orange + a second Orange) because running is about half the race; 2 short station circuits a week (sled push / pull, burpee broad jumps, wall balls, farmers carry, sandbag lunges, SkiErg / row) as finishers that do not count as muscle sets; wall balls with the race ball (never over 20 lb); 40-rep / AMRAP sets only inside these circuits; jumps 50 % plyometric, like basketball | competitive profile aligned with the approved plan: 4 main days (2 strength + 2 hybrid) instead of v1.1's 3 gym days; race-specific pre-season keeps 4 cardio sessions (COACH-R3 ATH-03 reasoning, INFERRED) | race date: the season inputs (COACH-R2 GEN-05) place the race-specific block and its 1-2-week taper

#### Obstacle course racing (Spartan and similar) (`ocr_spartan`)

- ES: Carreras de obstáculos (OCR / Spartan) | category: competitive | sport: ocr | picked by: ocr:short, ocr:long | positions: short course: Sprint 5 km / Super 10 km, long course: Beast 21 km / Ultra 50 km (see variant), elite / age group
- origin: sports/combat-strength-fitness.json (new), base `hybrid`; family crossfit; ath03 endurance; evidence: NEW (PROPOSED budget, INFERRED from SCIENCE and the nearest 04 profile: 04:hybrid + 04:distance_runner (nearest))
- why: New. Like HYROX but trail running plus rig / grip / carry obstacles: more vertical pulling and grip, landing-first plyos (wall drops). Aerobic 4 is PROPOSED.
- template: 3 gym days (strength + grip / rig) + 4 aerobic (trail / hill) sessions (PROPOSED)
- numbers: 3 main + 1 optional days; 107 sets / week (26 athletic); contact class 3 (50 % plyometric at block end, 35 % at start); aerobic 4 / pre 4 / in 3 (gym_plan)
- athletic dose / week: plyometric contacts 18-24; all jump contacts 40-54; throws 34-46 (T1); COD cuts 24-32 (MOD. TURN); sprint m 102-138; Olympic sets 4.8-7.2
- resistance: goal endurance-strength / strength; emphasis hypertrophy 15; strength 45; power 15; endurance_strength 25; rep zone STRENGTH 3-6 + VOL 1-2; grip by time under load; bilateral/unilateral % of lower compound sets: block start 30/70 -> end 20/80, in season 20/80; contra / ipsi: contralateral for uneven-terrain direction changes; ipsilateral step-ups for uphill drive (COACH-ANSWER CAT-13 logic, INFERRED)
- season: pre-season 60 % of off-season sets (3 lift days); in season 50 % (2 lift days, game-heavy no); the one hard gym day >= 48 h before a competition (COACH-R2 ATH-07, extended INFERRED)
- Olympic lifts: everyone in athletic training gets Olympic lifts (COACH-ANSWER ATH-10); 60+: none by default; offered as an option with the warning 'Make sure that you have a fitness professional to help you understand what this means' (COACH-R2 ATH-08); older / injured / high-volume clients 
- injuries: ANKLE_SPRAIN, SHOULDER_CONTACT, FINGER_PULLEY, ACHILLES_CALF, ACL_LANDING_CUTTING, PAIN_GENERAL
- variants: `ocr_long_course` Long course (Beast 21 km / Ultra) (PLYO -1; BALL -1; UKD 1)
- sample week (off season): Mon - strength A (knee + pull): warm-up -> core 2 x 2 light -> landing sticks from a box (RC1) -> hang power clean -> HEAVY SQUAT (axial day 1) + weighted pull- / Tue - aerobic B: hill / trail intervals (Green) / Wed - strength B (hip + push): core -> box / broad jumps -> KB snatch -> HEAVY DEADLIFT / trap bar (axial day 2) + push-ups or DB press -> single-leg RDL -> buc / Thu - aerobic A: hill sprints / short intervals (Blue) / Fri - grip + obstacles: core -> overhead / rotational medball throws (spear pattern) -> rig work (monkey bars, towel hangs, wall practice) + burpees -> lateral  / Sat - aerobic C: long trail run (Orange); Sun - off or a second easy Orange
- **v1.2 (round 3):** not named in round 3: keeps 4 aerobic sessions and station-style circuits by analogy to the approved HYROX plan (COACH-R3 ATH-03) - PROPOSED

#### Bodybuilding / physique - competitive (all NPC divisions) (`bodybuilding_aesthetics`)

- ES: Fisicoculturismo y físico (Bodybuilding / Physique) - competitivo | category: competitive | sport: bodybuilding_physique | picked by: bodybuilding_physique:bodybuilding, bodybuilding_physique:classic, bodybuilding_physique:mens_physique, bodybuilding_physique:bikini, bodybuilding_physique:wellness, bodybuilding_physique:figure, bodybuilding_physique:womens_physique | positions: men's bodybuilding, classic physique, men's physique, bikini, wellness, figure, women's physique / bodybuilding | aliases: physique_competitive | goal default for: muscle
- origin: 04_v1 (04); family physique; ath03 size_strength; evidence: OBSERVED (BYOP 'AESTHETICS - FULL BODY - 4 DAYS' coach convention + optional days; MM AESTHETICS-8/12 and PPL as variants)
- why: Defines the resistance skeleton every other template reuses.
- template: BYOP AESTHETICS 4-day A/B/OPT (A: Calves, Bilateral KD, Horizontal Pull, Unilateral KD, Vertical Pull, Bicep, Leg Extensions; B: Bilateral HD, Horizontal Push, Unilateral HD, Vertical Push, Leg Curls, Tricep, ABdution)
- numbers: 4 main + 2 optional days; 108 sets / week (0 athletic); contact class - (- % plyometric at block end, - % at start); aerobic 4 / pre 4 / in - (gym_plan)
- athletic dose / week: plyometric contacts -; all jump contacts 0; throws 0 (T0); COD cuts 0 (-); sprint m 0; Olympic sets 0
- resistance: goal hypertrophy / strength; emphasis hypertrophy 80; strength 15; power 5; rep zone compounds 8-15 (mean ~12), single-joint 20, calves 15, MYO last on machines / isolation (VOL-15); '1-2 RIR' (RIR primary, VOL-13); preference moves the compound; bilateral/unilateral % of lower compound sets: block start 50/50 -> end 80/20, in season -; contra / ipsi: contra / ipsi accessories mostly in the first 2-4 weeks, then mostly bilateral (COACH-ANSWER CAT-13); same-pattern pairing (squat + lunge) to drive the muscle (UNI-06)
- Olympic lifts: not in athletic training -> no Olympic lifts by default (COACH-ANSWER ATH-10 applies to athletic training); 60+: -
- injuries: PAIN_GENERAL, HIGH_VOLUME_CONSTRAINT
- variants: `aesthetics_12wk_ppl` Aesthetics 12-week PPL (6 days); `aesthetics_3day` Aesthetics 3-day builder; `physique_mens_bodybuilding` Men's bodybuilding (ISO_QUAD 2; ISO_HAM 2; VPULL 2; HPULL 2); `physique_classic` Classic physique (VPULL 2; ISO_SIDE 2; ISO_QUAD 2; ISO_HAM 1); `physique_mens_physique` Men's physique (ISO_SIDE 4; VPULL 2; HPUSH 2; BKD -2; ISO_QUAD -2); `physique_bikini` Bikini (BHD 2; UHD 2; ISO_SIDE 3; ISO_HAM 1; HPUSH -2); `physique_wellness` Wellness (BKD 2; BHD 2; UKD 2; UHD 2; ISO_QUAD 2; ISO_HAM 2; HPUSH -2; VPUSH -2); `physique_figure` Figure (ISO_SIDE 4; VPULL 2; ISO_QUAD 2); `physique_womens_physique` Women's physique / bodybuilding (VPULL 2; HPULL 2; ISO_QUAD 2; ISO_HAM 2)
- sample week (off season): OBSERVED BYOP AESTHETICS 4-day A / B / OPT: Mon A1 - core 1 x 2 -> calves first only if a priority (ORD-04) -> HEAVY SQUAT / bilateral KD (axial day 1) -> horiz / Tue B1 - core -> bilateral HD: barbell RDL / deadlift (axial day 2, COACH-R2 SES-01) -> horizontal push -> unilateral HD -> vertical push -> leg curls -> tricep / Wed - optional day: Focus 1 / Focus 2 on the division's priority muscles (2-3 sets each, ORD-11) + cardio + core / Thu A2 - leg press / hack / belt squat (non-axial) + the A pattern, 2-4 exercises per muscle trained (COACH-R2 SES-05) -> calves / Fri B2 - hip thrust / back extension (non-axial) + the B pattern -> rear delts (in the shoulders group - COACH-R3 VOL-01) -> calves / Sat - optional day (Focus + cardio); Sun off; aerobic 4 a week + walks after workouts

#### Rock climbing / bouldering - competitive (`climbing`)

- ES: Escalada deportiva y búlder (Bouldering) - competitivo | category: competitive | sport: climbing | picked by: climbing:bouldering, climbing:lead, climbing:speed | positions: bouldering, lead / sport climbing (see variant), speed (see variant)
- origin: sports/combat-strength-fitness.json (new); family field_court; ath03 resistance; evidence: NEW (PROPOSED budget, INFERRED from SCIENCE and the nearest 04 profile: none close in 04 (nearest by strength type: 04 bjj_grappling - grip and pulling))
- why: New. Relative-strength sport: pulling, finger strength (hangboard - a PROPOSED library addition, no bands), antagonists, landing skill for bouldering falls. Floor-10 check shows the legs and chest below 10 by design (relative strength) - open question Q1.
- template: 3 gym sessions on top of 3-4 climbing days (PROPOSED)
- numbers: 3 main + 0 optional days; 82 sets / week (9 athletic); contact class 5 (25 % plyometric at block end, 10 % at start); aerobic 2 / pre 2 / in 2 (gym_plan)
- athletic dose / week: plyometric contacts 4-6; all jump contacts 19-25; throws 21-29 (T1); COD cuts 0 (-); sprint m 0; Olympic sets 2.4-3.6
- resistance: goal strength / endurance-strength; emphasis hypertrophy 10; strength 55; power 15; endurance_strength 20; rep zone STRENGTH 3-6 (weighted pull-ups, lock-offs), finger strength by 7-10 s hangs; antagonists VOL 2; bilateral/unilateral % of lower compound sets: block start 40/60 -> end 30/70, in season 30/70; contra / ipsi: contralateral loaded high step-ups to get INTO the hip (CAT-13 'we help them by creating those ranges', INFERRED)
- season: pre-season 60 % of off-season sets (3 lift days); in season 50 % (2 lift days, game-heavy no); the one hard gym day >= 48 h before a competition (COACH-R2 ATH-07, extended INFERRED)
- Olympic lifts: everyone in athletic training gets Olympic lifts (COACH-ANSWER ATH-10); 60+: none by default; offered as an option with the warning 'Make sure that you have a fitness professional to help you understand what this means' (COACH-R2 ATH-08); older / injured / high-volume clients 
- injuries: FINGER_PULLEY, SHOULDER_GYMNASTIC, ELBOW_GRAPPLING, ANKLE_SPRAIN, PAIN_GENERAL
- variants: `climbing_lead` Lead / sport climbing (THROW -1; BALL -1; ISO_GRIP 1); `climbing_speed` Speed climbing (PLYO 3; JLK 2; BALL 1; SPRINT 2; TE 2)
- sample week (off season): Mon - pull + legs: warm-up -> core 2 x 2 light (hanging knee raises, hollow) -> landing sticks from a box (RC1) -> KB squat clean -> HEAVY GOBLET / FRONT SQUAT  / Wed - push + hinge: core -> overhead slams / plyo push-ups -> TRAP-BAR DEADLIFT (axial day 2) + DB bench (antagonist) -> single-leg RDL + DB overhead press -> w / Fri - pull endurance + mobility: core -> lock-offs / lat pulldown + push-ups -> hip-flexion strength and mobility (Focus) -> forearm extensors -> calves / Tue / Thu / Sat - climbing (limit bouldering not on the day after max hangs); aerobic 2 (Green + Orange)

### 8.5 Racket and club

#### Pickleball - competitive / tournament (`pickleball_competitive`)

- ES: Pickleball - competitivo / torneos | category: competitive | sport: pickleball | picked by: pickleball:doubles, pickleball:singles | positions: doubles, singles, mixed doubles, age divisions (19+, 35+, 50+, 60+, 70+ - see senior variant)
- origin: sports/combat-strength-fitness.json (delta), base `tennis`; family field_court; ath03 rotational_power; evidence: 04 v1 'tennis' + PROPOSED deltas; base evidence: INFERRED
- why: New, built from the 04 tennis profile with smaller-court deltas (less sprint and COD distance, a little less plyo and throw volume, more quad endurance for the low ready position). The senior variant applies R2-ATH-08 by default. Recreational pickleball (the coach's gen-pop request) is in genpop-active.
- template: BYOP ATHLETIC 4-day (as 04 tennis) with smaller-court speed work (PROPOSED)
- numbers: 4 main + 2 optional days; 130 sets / week (48.5 athletic); contact class 3 (50 % plyometric at block end, 35 % at start); aerobic 3 / pre 2 / in 2 (gym_plan)
- athletic dose / week: plyometric contacts 35-47; all jump contacts 41-55; throws 128-172 (T2); COD cuts 77-105 (MOD. TURN); sprint m 76-103; Olympic sets 3.2-4.8
- resistance: goal power / endurance-strength; emphasis hypertrophy 25; strength 40; power 35; rep zone VOL 2 + STRENGTH; bilateral/unilateral % of lower compound sets: block start 20/80 -> end 10/90, in season 10/90; contra / ipsi: contralateral 'definitely' (COACH-ANSWER CAT-13)
- season: pre-season 60 % of off-season sets (3 lift days); in season 45 % (2 lift days, game-heavy yes); the one hard gym day >= 48 h before a competition (COACH-R2 ATH-07, extended INFERRED)
- Olympic lifts: everyone in athletic training gets Olympic lifts (COACH-ANSWER ATH-10); 60+: none by default; offered as an option with the warning 'Make sure that you have a fitness professional to help you understand what this means' (COACH-R2 ATH-08); older / injured / high-volume clients 
- injuries: ELBOW_LATERAL_RACKET, SHOULDER_THROWER, LOW_BACK_ROTATIONAL, ACHILLES_CALF, ANKLE_SPRAIN, GROIN_ADDUCTOR, PAIN_GENERAL, FALLS_BONE_DENSITY, KNEE_DEGENERATIVE_COURT
- variants: `pickleball_senior_60_plus` Senior divisions (60+; also offered to 50+) (PLYO -6; JLK -9; TE -4; SPRINT -1.5; COD -5; THROW -5; UKD 1; ISO_GRIP 1)
- sample week (off season): Mon - knee + pull: warm-up -> core 2 x 2 light -> split-step pogos + lateral hops (RC stage) -> hang pull / DB snatch (L1) -> goblet / front squat (axial day 1) / Tue - lateral speed: squirrel jumps -> shuffle / crossover starts 1-3 m -> EASY -> MOD. TURN patterns (ATH-06) -> core -> medball scoops both sides -> single-le / Thu - hip + push: core -> lateral bounds -> trap-bar deadlift (axial day 2) + landmine press -> step-ups -> wall-sit / low ready-position isometrics + leg exten / Fri - full body: core -> medball chest passes (hand speed) -> belt squat / leg press -> unilateral push / pull -> balance work (single-leg reach) -> calves / Wed / Sat / Sun - play; aerobic 3 (one of each colour)
- 50+: COACH-R3 ATH-02 (approved): pickleball, padel and tennis players 50+ get knee-friendly strength, calf and Achilles work every leg day, rotator-cuff work, and only low-impact jumps (no depth jumps, hurdle hops or bounds) unless switched on. Detail: knee - KNEE_DEGENERATIVE_COURT rules every week: leg press / box squat to a pain-free depth, split squat and low step-ups, slow-eccentric leg extensions and isometric holds; lateral hip strength; no deep loaded pivoting under fatigue; Achilles / calf - ACHILLES_CALF every leg day: straight-knee and bent-knee calf raises (3 sets, VOL-17), slow lowering, progress ankle work by no more than about 10-20 % a week; a 5-min warm-up before play and before ankle work (K34c: Achilles ruptures); shoulder / elbow - rotator-cuff work (COACH-R3 ATH-02): side-lying DB external rotation, prone Y / T and KB face pulls (R2-LIB-04) 2-3 x / week; overhead pressing seated / landmine and pain-free; wrist-extensor isometrics for the paddle / racket elbow (ELBOW_LATERAL_RACKET); rotator-cuff tears are a common older-player injury (K34c); lateral - lateral shuffles, crossover steps and drop-step 'turn and run' (EASY TURN -> MOD. TURN; HARD TURN only for L2+ under 60); no fast backpedal drills (FALLS_COURT); plyo - low-impact only: RC1 landings (stick the split step / lateral stick), low-amplitude split-step pogos and lateral line hops on a forgiving surface, bilateral before single-leg; no depth jumps, hurdle hops or bounds by default at 50-59; progress only when landings are quiet and pain-free (FALLS_COURT, ACL_LANDING_CUTTING stage-1 logic); at 60+ all of it except the landing drills is opt-in with the warning (COACH-R2 ATH-08); falls / wrist - balance, reactive stepping and wrist / forearm strength every week (FALLS_COURT; wrist fractures dominate senior falls - G3); off by default: depth_jump, high_depth_drop, hurdle_hop, bound (from age 50; the user or coach can switch these jumps on (COACH-R3 ATH-02); from 60 the active_aging_60plus rules and the warning apply on top (COACH-R2 ATH-08))
- **v1.2 (round 3):** COACH-R3 ATH-02 (approved): pickleball, padel and tennis players 50+ get knee-friendly strength, calf and Achilles work every leg day, rotator-cuff work, and only low-impact jumps (no depth jumps, hurdle hops or bounds) unless switched on; structured as age_50_plus.plyo_off_by_default for the engine (applied only from age 50 - flag G4)

#### Golf - competitive (`golf`)

- ES: Golf - competitivo | category: competitive | sport: golf
- origin: 04_v1 (04); family general; ath03 rotational_power; evidence: INFERRED
- why: Clubhead speed tracks rotational power and lower-body RFD; the coach's into/out-of-hip medball matrix is the most golf-specific tool in the library.
- template: 3-day full body (UPPER/LOWER-style) with BASEBALL-style rotational medball block
- numbers: 3 main + 2 optional days; 84.5 sets / week (26.5 athletic); contact class 5 (25 % plyometric at block end, 10 % at start); aerobic 3 / pre 2 / in 2 (gym_plan)
- athletic dose / week: plyometric contacts 0-15; all jump contacts 10-15; throws 150-200 (T3); COD cuts 0 (-); sprint m 0; Olympic sets 2-6
- resistance: goal power / strength; emphasis hypertrophy 25; strength 40; power 35; rep zone VOL 2 + STRENGTH lower body; bilateral/unilateral % of lower compound sets: block start 30/70 -> end 20/80, in season 20/80; contra / ipsi: into / out of the hip loaded lunges and step-ups ('GET INTO THE HIP' / 'GET OUT OF THE HIP'), lead leg into, trail leg out (INFERRED)
- season: pre-season 60 % of off-season sets (3 lift days); in season 50 % (2 lift days, game-heavy no); the one hard gym day >= 48 h before a competition (COACH-R2 ATH-07, extended INFERRED)
- Olympic lifts: everyone in athletic training gets Olympic lifts (COACH-ANSWER ATH-10); 60+: none by default; offered as an option with the warning 'Make sure that you have a fitness professional to help you understand what this means' (COACH-R2 ATH-08); older / injured / high-volume clients 
- injuries: LOW_BACK_ROTATIONAL, LEAD_HIP_GLUTE, ELBOW_LATERAL_RACKET, SHOULDER_THROWER, PAIN_GENERAL
- sample week (off season): Mon - full body A: warm-up -> core 2 x 2 light (Pallof holds -> chops) -> medball matrix (into / out of each hip, half-kneeling) -> hex-bar jump -> goblet / fro / Wed - full body B: core -> medball step-back rotational passes -> DB snatch -> trap-bar deadlift (axial day 2) + DB press -> ipsilateral 'GET OUT OF THE HIP' st / Fri - full body C: core -> CMJ / box jump (RC stage) -> belt squat or leg press (non-axial) + pull-ups -> single-leg RDL + landmine press -> thoracic rotation m / Tue / Thu / Sat - practice / rounds; aerobic 3 (walking 18 holes = Orange)

### 8.6 Other competitive / overlays

#### Youth athlete (multi-sport, pre/circa/post-PHV) (`youth_athlete`)

- ES: Atleta juvenil (multideporte; antes, durante y después del estirón) | category: competitive
- origin: 04_v1 (04); family youth; ath03 health; evidence: INFERRED + SCIENCE (Lloyd & Oliver)
- why: Exposure to every athletic pattern at foundational levels; landing competency before rebound volume.
- template: BYOP ATHLETIC 4-day cut to 2-3 days, mostly FOUNDATIONAL library blocks (levels are still theoretical, CAT-05)
- numbers: 3 main + 0 optional days; 78 sets / week (39 athletic); contact class 3 (50 % plyometric at block end, 35 % at start); aerobic 2 / pre 2 / in 2 (gym_plan)
- athletic dose / week: plyometric contacts 30-60; all jump contacts 85-115; throws 50-80 (T2); COD cuts 35-50 (MOD. TURN); sprint m 100-150; Olympic sets 2-6
- resistance: goal - / -; emphasis hypertrophy 40; strength 40; power 20; rep zone technique first, 8-15 reps, bodyweight / light DB; bilateral/unilateral % of lower compound sets: block start 50/50 -> end 50/50, in season 40/60; contra / ipsi: both, light (INFERRED)
- Olympic lifts: everyone in athletic training gets Olympic lifts (COACH-ANSWER ATH-10); 60+: none by default; offered as an option with the warning to work with a fitness professional (COACH-R2 ATH-08); never snatch variants for older / injured / high-volume clients (EQ-03)
- injuries: GROWTH_APOPHYSIS, ACL_LANDING_CUTTING, BONE_STRESS, PAIN_GENERAL

### 8.7 Recreational - stay athletic and active

#### Athletic Performance - Non-Competitive (weekend warrior; formerly 'Justice League') (`weekend_warrior`)

- ES: Rendimiento atlético - no competitivo (atleta de fin de semana) | category: recreational | sport: general_athletic | goal default for: athletic (no sport), active (a bit of everything)
- origin: 04_v1 (04); family field_court; ath03 health; evidence: COACH-ANSWER ATH-13 (the program was 'for weekend warriors: people that wanted to be athletic, but they didn't need to compete ... a good mix of everything') + OBSERVED slots (BYOP 'ATHLETIC - FULL BODY - 4 DAYS A') + the PARTIAL fill of the weekend-warrior tab (sheet tab name 'JUSTICE LEAGUE', a marketing name - ATH-13): Monday's 10 slots and Tuesday's plyo slot at 2 sets, Thursday 'Low Bar Back 
- why: Non-competitive athletic adults (and youth, kids): 'good health all around and just having a body that performs well' (COACH-ANSWER ATH-13). Also the fallback for a recreational player of any sport (GEN-02: recreational -> general sport only, no position / season). Competitive athletes whose sport has no profile use the nearest sport profile by ground-contact class and ATH-03 group (PROPOSED). v1.1: renamed 'Athletic Performance - Non-Competitive' (FIX-03: 'no one's going to know what Justice League means'); this is also the 'A bit of everything' choice in the activity picker and the fallback for any recreational activity without its own profile.
- template: BYOP 'ATHLETIC - FULL BODY - 4 DAYS A' (OBSERVED, OT04) as re-wired in 05 v1.1 generator_split_templates.athletic['4'] (A1 squat + pull / B1 non-axial hinge + push / A2 leg press + pull / B2 deadlift + push; Wed / Sat optional)
- numbers: 4 main + 2 optional days; 163 sets / week (40 athletic); contact class 3 (50 % plyometric at block end, 35 % at start); aerobic 3 / pre - / in - (gym_plan_or_activity)
- athletic dose / week: plyometric contacts 48-64; all jump contacts 85-115; throws 68-92 (T2); COD cuts 48-64 (per slot level (EASY / MOD. / HARD TURN, ATH-06)); sprint m 0; Olympic sets 6-10
- resistance: goal strength / hypertrophy; emphasis hypertrophy 40; strength 40; power 20; rep zone '6 to 8 Reps' primary, '8 to 12 Reps' secondary / unilateral / upper, 'MYO SET' leg extensions (OBSERVED); bilateral/unilateral % of lower compound sets: block start 50/50 -> end 40/60, in season -; contra / ipsi: cross-pattern pairing (UNI-06); contra / ipsi variety (INFERRED)
- season: no season for recreational activities (COACH-ANSWER GEN-02); the gen-pop year applies and is fully user-tunable - re-order blocks, more / less cardio, e.g. a winter strength block (COACH-R2 PER-01/02)
- Olympic lifts: everyone in athletic training gets Olympic lifts (COACH-ANSWER ATH-10); the 'stay athletic and active' goal maps to the athletic family (generator_spec F07 'act; 60+: none by default; offered as an option with the warning to work with a fitness professional (COACH-R2 ATH-08); older / injured / high-volume clients never get snatch variants (EQ-03)
- injuries: PAIN_GENERAL, ANKLE_SPRAIN, ACHILLES_CALF, HAMSTRING, ACL_LANDING_CUTTING
- variants: `mm_athletic_starting` MM athletic STARTING (off-season block 1); `mm_athletic_mid` MM athletic MID; `mm_athletic_advanced` MM athletic ADVANCED
- sample week (training block): Mon - A1 (squat + pull; clean day): warm-up 5 min any cardio + A-drills / mobility (ORD-08, not volume) -> core 2 exercises x 2 sets, light, short of failure (R / Tue - B1 (non-axial hinge + push; snatch day): warm-up 5 min any cardio + A-drills / mobility (ORD-08, not volume) -> core 2 exercises x 2 sets, light, short of / Wed - optional: Focus 1 / Focus 2, calves, core, or an aerobic session (ORD-10: ideally a separate day) / Thu - A2 (leg press / belt squat + pull; clean day): warm-up 5 min any cardio + A-drills / mobility (ORD-08, not volume) -> core 2 exercises x 2 sets, light, sh / Fri - B2 (deadlift + push; snatch day): warm-up 5 min any cardio + A-drills / mobility (ORD-08, not volume) -> core 2 exercises x 2 sets, light, short of failur / Sat - optional: Focus / calves / core / aerobic, or the weekend game / Sun - off
- **v1.2 (round 3):** stay athletic and active (COACH-R3 ATH-05, approved): play days entered by the user - the hardest gym day sits at least 48 h before the biggest play day (COACH-R3 ATH-05); weeks with 3+ play sessions drop the extra agility drills and half the jumps (COACH-R3 ATH-05); a 45-60+ minute session of the activity counts as one of the 3 cardio sessions (up to 2) (COACH-R3 ATH-05); optional event date: the hardest weeks end 1 week before, then 1 easy week at about half the sets (COACH-R3 ATH-05); no date -> the normal stairway or the gen-pop year | 'a bit of everything' stays 50 % (COACH-R3 ATH-04)

#### Flag football - recreational (adult / youth league) (`rec_flag_football`)

- ES: Flag football recreativo (liga de adultos / juvenil) | category: recreational | sport: flag_football
- origin: sports/team.json (delta), base `weekend_warrior`; family field_court; ath03 health; evidence: 04 v1 (04:weekend_warrior) + PROPOSED deltas
- why: Gen-pop players who want to stay athletic and play on a team: the weekend-warrior plan with a sprint slot and route-tree COD so a weekly game does not pull a hamstring. recreational player: sport tag on the weekend_warrior profile, no position and no season (COACH-ANSWER GEN-02, ATH-13).
- template: BYOP 'ATHLETIC - FULL BODY - 4 DAYS A': A = Plyo, Plyo, Throwing, COD, Tripple Extension, Bilateral KD, Horizontal Pull, Unilateral KD, Vertical Pull, Leg Extensions; B = PLYO, Throwing, COD, Tripple Extension, Bilateral HD, Horizontal Push, Unilateral HD, Vertical Push, Leg Curls, ABdution; Wed/Sat = Calves, Aerobic Capacity, Core, Focus 1, Focus 2
- numbers: 4 main + 2 optional days; 129 sets / week (45 athletic); contact class 2 (60 % plyometric at block end, 45 % at start); aerobic 3 / pre - / in - (gym_plan)
- athletic dose / week: plyometric contacts 60-78; all jump contacts 85-115; throws 57-73 (T2); COD cuts 60-80 (MOD. TURN); sprint m 155-205; Olympic sets 6-10
- resistance: goal strength / hypertrophy; emphasis hypertrophy 40; strength 40; power 20; rep zone '6 to 8 Reps' primary, '8 to 12 Reps' secondary/unilateral/upper, 'MYO SET' leg extensions; bilateral/unilateral % of lower compound sets: block start 30/70 -> end 20/80 (v1.1 sport verification: UNI-02 COD rule), in season -; contra / ipsi: cross-pattern pairing (UNI-06); contra / ipsi variety (INFERRED)
- season: no season for recreational players (GEN-02); the user's year plan applies (R2-PER-01/02)
- Olympic lifts: everyone in athletic training gets Olympic lifts (COACH-ANSWER ATH-10); 60+: none by default; offered as an option with the warning to work with a fitness professional (COACH-R2 ATH-08); older / injured / high-volume clients never get snatch variants (EQ-03)
- injuries: HAMSTRING, ACL_LANDING_CUTTING, ANKLE_SPRAIN, PAIN_GENERAL
- sample week (any block): Mon - A1 knee + pull: warm-up -> core 2 x 2 sets, light (R2-SES-03) -> 2 plyo / ballistic -> clean variant (squat pattern, R2-ATH-04) -> HEAVY SQUAT (axial day  / Tue - B1 hip + push: speed / COD block first (squirrel jumps -> MACH / acceleration starts -> max velocity, LIB-21; route tree EASY -> MOD. -> HARD TURN, ATH-06 / Wed - aerobic 1 + optional Focus / core (optional days ideally separate - ORD-10) / Thu - A2 knee + pull: core 2 x 2 -> 2 plyo / ballistic -> clean variant -> leg press or belt squat (non-axial) + pull -> unilateral knee-dominant -> Nordic / sl / Fri - B2 hip + push: speed / COD block first (squirrel jumps -> MACH / acceleration starts -> max velocity, LIB-21; route tree EASY -> MOD. -> HARD TURN, ATH-06 / Sat - aerobic 2 + aerobic 3 (or after a lifting day) / Sun - off
- **v1.2 (round 3):** stay athletic and active (COACH-R3 ATH-05, approved): play days entered by the user - the hardest gym day sits at least 48 h before the biggest play day (COACH-R3 ATH-05); weeks with 3+ play sessions drop the extra agility drills and half the jumps (COACH-R3 ATH-05); a 45-60+ minute session of the activity counts as one of the 3 cardio sessions (up to 2) (COACH-R3 ATH-05); optional event date: the hardest weeks end 1 week before, then 1 easy week at about half the sets (COACH-R3 ATH-05); no date -> the normal stairway or the gen-pop year

#### Basketball - recreational (league / pickup) (`rec_basketball`)

- ES: Baloncesto recreativo (liga / pickup) | category: recreational | sport: basketball
- origin: sports/team.json (delta), base `weekend_warrior`; family field_court; ath03 health; evidence: 04 v1 (04:weekend_warrior) + PROPOSED deltas
- why: Adults who play pickup or league basketball: weekend-warrior plan with more landing, lateral COD and calf / Achilles work. recreational player: sport tag on the weekend_warrior profile, no position and no season (COACH-ANSWER GEN-02, ATH-13).
- template: BYOP 'ATHLETIC - FULL BODY - 4 DAYS A': A = Plyo, Plyo, Throwing, COD, Tripple Extension, Bilateral KD, Horizontal Pull, Unilateral KD, Vertical Pull, Leg Extensions; B = PLYO, Throwing, COD, Tripple Extension, Bilateral HD, Horizontal Push, Unilateral HD, Vertical Push, Leg Curls, ABdution; Wed/Sat = Calves, Aerobic Capacity, Core, Focus 1, Focus 2
- numbers: 4 main + 2 optional days; 128 sets / week (44 athletic); contact class 3 (50 % plyometric at block end, 35 % at start); aerobic 3 / pre - / in - (gym_plan)
- athletic dose / week: plyometric contacts 55-70; all jump contacts 95-130; throws 70-90 (T2); COD cuts 60-80 (MOD. TURN); sprint m 0; Olympic sets 6-10
- resistance: goal strength / hypertrophy; emphasis hypertrophy 40; strength 40; power 20; rep zone '6 to 8 Reps' primary, '8 to 12 Reps' secondary/unilateral/upper, 'MYO SET' leg extensions; bilateral/unilateral % of lower compound sets: block start 30/70 -> end 20/80 (v1.1 sport verification: UNI-02 COD rule), in season -; contra / ipsi: cross-pattern pairing (UNI-06); contra / ipsi variety (INFERRED)
- season: no season for recreational players (GEN-02); the user's year plan applies (R2-PER-01/02)
- Olympic lifts: everyone in athletic training gets Olympic lifts (COACH-ANSWER ATH-10); 60+: none by default; offered as an option with the warning to work with a fitness professional (COACH-R2 ATH-08); older / injured / high-volume clients never get snatch variants (EQ-03)
- injuries: ANKLE_SPRAIN, PATELLAR_TENDON, ACHILLES_CALF, ACL_LANDING_CUTTING, PAIN_GENERAL
- sample week (any block): Mon - A1 knee + pull: warm-up -> core 2 x 2 sets, light (R2-SES-03) -> 2 plyo / ballistic -> clean variant (squat pattern, R2-ATH-04) -> HEAVY SQUAT (axial day  / Tue - B1 hip + push: speed / COD block first (squirrel jumps -> MACH / acceleration starts -> max velocity, LIB-21; route tree EASY -> MOD. -> HARD TURN, ATH-06 / Wed - aerobic 1 + optional Focus / core (optional days ideally separate - ORD-10) / Thu - A2 knee + pull: core 2 x 2 -> 2 plyo / ballistic -> clean variant -> leg press or belt squat (non-axial) + pull -> unilateral knee-dominant -> slow / isom / Fri - B2 hip + push: speed / COD block first (squirrel jumps -> MACH / acceleration starts -> max velocity, LIB-21; route tree EASY -> MOD. -> HARD TURN, ATH-06 / Sat - aerobic 2 + aerobic 3 (or after a lifting day) / Sun - off
- **v1.2 (round 3):** stay athletic and active (COACH-R3 ATH-05, approved): play days entered by the user - the hardest gym day sits at least 48 h before the biggest play day (COACH-R3 ATH-05); weeks with 3+ play sessions drop the extra agility drills and half the jumps (COACH-R3 ATH-05); a 45-60+ minute session of the activity counts as one of the 3 cardio sessions (up to 2) (COACH-R3 ATH-05); optional event date: the hardest weeks end 1 week before, then 1 easy week at about half the sets (COACH-R3 ATH-05); no date -> the normal stairway or the gen-pop year

#### Softball - recreational slow-pitch (adult league) (`rec_softball`)

- ES: Sóftbol recreativo de lanzamiento lento (Slow-pitch) | category: recreational | sport: softball
- origin: sports/team.json (delta), base `weekend_warrior`; family field_court; ath03 health; evidence: 04 v1 (04:weekend_warrior) + PROPOSED deltas
- why: The most common adult team sport for gen-pop: short sprints and swings after sitting in a dugout are what pull hamstrings and shoulders, so the tag adds a sprint slot, hamstring work and rotational throws. recreational player: sport tag on the weekend_warrior profile, no position and no season (COACH-ANSWER GEN-02, ATH-13).
- template: BYOP 'ATHLETIC - FULL BODY - 4 DAYS A': A = Plyo, Plyo, Throwing, COD, Tripple Extension, Bilateral KD, Horizontal Pull, Unilateral KD, Vertical Pull, Leg Extensions; B = PLYO, Throwing, COD, Tripple Extension, Bilateral HD, Horizontal Push, Unilateral HD, Vertical Push, Leg Curls, ABdution; Wed/Sat = Calves, Aerobic Capacity, Core, Focus 1, Focus 2
- numbers: 4 main + 2 optional days; 125 sets / week (38 athletic); contact class 4 (40 % plyometric at block end, 25 % at start); aerobic 3 / pre - / in - (gym_plan)
- athletic dose / week: plyometric contacts 40-52; all jump contacts 75-105; throws 102-138 (T2); COD cuts 25-30 (EASY TURN); sprint m 100-140; Olympic sets 6-10
- resistance: goal strength / hypertrophy; emphasis hypertrophy 40; strength 40; power 20; rep zone '6 to 8 Reps' primary, '8 to 12 Reps' secondary/unilateral/upper, 'MYO SET' leg extensions; bilateral/unilateral % of lower compound sets: block start 50/50 -> end 40/60, in season -; contra / ipsi: cross-pattern pairing (UNI-06); contra / ipsi variety (INFERRED)
- season: no season for recreational players (GEN-02); the user's year plan applies (R2-PER-01/02)
- Olympic lifts: everyone in athletic training gets Olympic lifts (COACH-ANSWER ATH-10); 60+: none by default; offered as an option with the warning to work with a fitness professional (COACH-R2 ATH-08); older / injured / high-volume clients never get snatch variants (EQ-03)
- injuries: HAMSTRING, SHOULDER_THROWER, LOW_BACK_ROTATIONAL, ACHILLES_CALF, PAIN_GENERAL
- sample week (any block): Mon - A1 knee + pull: warm-up -> core 2 x 2 sets, light (R2-SES-03) -> 1 plyo / ballistic -> clean variant (squat pattern, R2-ATH-04) -> HEAVY SQUAT (axial day  / Tue - B1 hip + push: core 2 x 2 -> plyo + medball throws -> snatch variant (hinge pattern) -> non-axial hinge (hip thrust / back extension / reverse hyper) + ho / Wed - aerobic 1 + optional Focus / core (optional days ideally separate - ORD-10) / Thu - A2 knee + pull: core 2 x 2 -> 1 plyo / ballistic -> clean variant -> leg press or belt squat (non-axial) + pull -> unilateral knee-dominant -> Nordic / sl / Fri - B2 hip + push: core 2 x 2 -> plyo + medball throws -> snatch variant (hinge pattern) -> HEAVY DEADLIFT / trap-bar (axial day 2, R2-SES-01) + push -> unila / Sat - aerobic 2 + aerobic 3 (or after a lifting day) / Sun - off
- **v1.2 (round 3):** stay athletic and active (COACH-R3 ATH-05, approved): play days entered by the user - the hardest gym day sits at least 48 h before the biggest play day (COACH-R3 ATH-05); weeks with 3+ play sessions drop the extra agility drills and half the jumps (COACH-R3 ATH-05); a 45-60+ minute session of the activity counts as one of the 3 cardio sessions (up to 2) (COACH-R3 ATH-05); optional event date: the hardest weeks end 1 week before, then 1 easy week at about half the sets (COACH-R3 ATH-05); no date -> the normal stairway or the gen-pop year

#### Soccer - recreational (adult outdoor / indoor league) (`rec_soccer`)

- ES: Fútbol recreativo (liga de adultos, cancha abierta o techada) | category: recreational | sport: soccer
- origin: sports/team.json (delta), base `weekend_warrior`; family field_court; ath03 health; evidence: 04 v1 (04:weekend_warrior) + PROPOSED deltas
- why: Adult league players: hamstring and groin first (Nordic + Copenhagen), a sprint slot and 0-90-degree COD. recreational player: sport tag on the weekend_warrior profile, no position and no season (COACH-ANSWER GEN-02, ATH-13).
- template: BYOP 'ATHLETIC - FULL BODY - 4 DAYS A': A = Plyo, Plyo, Throwing, COD, Tripple Extension, Bilateral KD, Horizontal Pull, Unilateral KD, Vertical Pull, Leg Extensions; B = PLYO, Throwing, COD, Tripple Extension, Bilateral HD, Horizontal Push, Unilateral HD, Vertical Push, Leg Curls, ABdution; Wed/Sat = Calves, Aerobic Capacity, Core, Focus 1, Focus 2
- numbers: 4 main + 2 optional days; 130 sets / week (45 athletic); contact class 2 (60 % plyometric at block end, 45 % at start); aerobic 3 / pre - / in - (gym_plan)
- athletic dose / week: plyometric contacts 60-78; all jump contacts 85-115; throws 57-73 (T2); COD cuts 60-80 (MOD. TURN); sprint m 155-205; Olympic sets 6-10
- resistance: goal strength / hypertrophy; emphasis hypertrophy 40; strength 40; power 20; rep zone '6 to 8 Reps' primary, '8 to 12 Reps' secondary/unilateral/upper, 'MYO SET' leg extensions; bilateral/unilateral % of lower compound sets: block start 30/70 -> end 20/80 (v1.1 sport verification: UNI-02 COD rule), in season -; contra / ipsi: cross-pattern pairing (UNI-06); contra / ipsi variety (INFERRED)
- season: no season for recreational players (GEN-02); the user's year plan applies (R2-PER-01/02)
- Olympic lifts: everyone in athletic training gets Olympic lifts (COACH-ANSWER ATH-10); 60+: none by default; offered as an option with the warning to work with a fitness professional (COACH-R2 ATH-08); older / injured / high-volume clients never get snatch variants (EQ-03)
- injuries: HAMSTRING, GROIN_ADDUCTOR, ANKLE_SPRAIN, ACL_LANDING_CUTTING, PAIN_GENERAL
- sample week (any block): Mon - A1 knee + pull: warm-up -> core 2 x 2 sets, light (R2-SES-03) -> 2 plyo / ballistic -> clean variant (squat pattern, R2-ATH-04) -> HEAVY SQUAT (axial day  / Tue - B1 hip + push: speed / COD block first (squirrel jumps -> MACH / acceleration starts -> max velocity, LIB-21; route tree EASY -> MOD. -> HARD TURN, ATH-06 / Wed - aerobic 1 + optional Focus / core (optional days ideally separate - ORD-10) / Thu - A2 knee + pull: core 2 x 2 -> 2 plyo / ballistic -> clean variant -> leg press or belt squat (non-axial) + pull -> unilateral knee-dominant -> Nordic / sl / Fri - B2 hip + push: speed / COD block first (squirrel jumps -> MACH / acceleration starts -> max velocity, LIB-21; route tree EASY -> MOD. -> HARD TURN, ATH-06 / Sat - aerobic 2 + aerobic 3 (or after a lifting day) / Sun - off
- **v1.2 (round 3):** stay athletic and active (COACH-R3 ATH-05, approved): play days entered by the user - the hardest gym day sits at least 48 h before the biggest play day (COACH-R3 ATH-05); weeks with 3+ play sessions drop the extra agility drills and half the jumps (COACH-R3 ATH-05); a 45-60+ minute session of the activity counts as one of the 3 cardio sessions (up to 2) (COACH-R3 ATH-05); optional event date: the hardest weeks end 1 week before, then 1 easy week at about half the sets (COACH-R3 ATH-05); no date -> the normal stairway or the gen-pop year

#### Ice hockey - recreational (adult league) (`rec_hockey`)

- ES: Hockey sobre hielo recreativo (liga de adultos) | category: recreational | sport: ice_hockey
- origin: sports/team.json (delta), base `weekend_warrior`; family field_court; ath03 health; evidence: 04 v1 (04:weekend_warrior) + PROPOSED deltas
- why: Adult league skaters: groin, hip and low-back care plus lateral power; COD slots become lateral bounds. recreational player: sport tag on the weekend_warrior profile, no position and no season (COACH-ANSWER GEN-02, ATH-13).
- template: BYOP 'ATHLETIC - FULL BODY - 4 DAYS A': A = Plyo, Plyo, Throwing, COD, Tripple Extension, Bilateral KD, Horizontal Pull, Unilateral KD, Vertical Pull, Leg Extensions; B = PLYO, Throwing, COD, Tripple Extension, Bilateral HD, Horizontal Push, Unilateral HD, Vertical Push, Leg Curls, ABdution; Wed/Sat = Calves, Aerobic Capacity, Core, Focus 1, Focus 2
- numbers: 4 main + 2 optional days; 120 sets / week (36 athletic); contact class 4 (40 % plyometric at block end, 25 % at start); aerobic 3 / pre - / in - (gym_plan)
- athletic dose / week: plyometric contacts 40-52; all jump contacts 85-115; throws 83-107 (T2); COD cuts 25-30 (EASY TURN); sprint m 0; Olympic sets 6-10
- resistance: goal strength / hypertrophy; emphasis hypertrophy 40; strength 40; power 20; rep zone '6 to 8 Reps' primary, '8 to 12 Reps' secondary/unilateral/upper, 'MYO SET' leg extensions; bilateral/unilateral % of lower compound sets: block start 30/70 -> end 20/80 (v1.1 sport verification: UNI-02 COD rule), in season -; contra / ipsi: cross-pattern pairing (UNI-06); contra / ipsi variety (INFERRED)
- season: no season for recreational players (GEN-02); the user's year plan applies (R2-PER-01/02)
- Olympic lifts: everyone in athletic training gets Olympic lifts (COACH-ANSWER ATH-10); 60+: none by default; offered as an option with the warning to work with a fitness professional (COACH-R2 ATH-08); older / injured / high-volume clients never get snatch variants (EQ-03)
- injuries: GROIN_ADDUCTOR, HIP_FAI_DEEP_FLEXION, LOW_BACK_FLEXED_POSTURE, PAIN_GENERAL
- sample week (any block): Mon - A1 knee + pull: warm-up -> core 2 x 2 sets, light (R2-SES-03) -> 2 plyo / ballistic -> clean variant (squat pattern, R2-ATH-04) -> HEAVY SQUAT (axial day  / Tue - B1 hip + push: core 2 x 2 -> plyo + medball throws -> snatch variant (hinge pattern) -> non-axial hinge (hip thrust / back extension / reverse hyper) + ho / Wed - aerobic 1 + optional Focus / core (optional days ideally separate - ORD-10) / Thu - A2 knee + pull: core 2 x 2 -> 2 plyo / ballistic -> clean variant -> leg press or belt squat (non-axial) + pull -> unilateral knee-dominant -> Copenhagen  / Fri - B2 hip + push: core 2 x 2 -> plyo + medball throws -> snatch variant (hinge pattern) -> HEAVY DEADLIFT / trap-bar (axial day 2, R2-SES-01) + push -> unila / Sat - aerobic 2 + aerobic 3 (or after a lifting day) / Sun - off
- **v1.2 (round 3):** stay athletic and active (COACH-R3 ATH-05, approved): play days entered by the user - the hardest gym day sits at least 48 h before the biggest play day (COACH-R3 ATH-05); weeks with 3+ play sessions drop the extra agility drills and half the jumps (COACH-R3 ATH-05); a 45-60+ minute session of the activity counts as one of the 3 cardio sessions (up to 2) (COACH-R3 ATH-05); optional event date: the hardest weeks end 1 week before, then 1 easy week at about half the sets (COACH-R3 ATH-05); no date -> the normal stairway or the gen-pop year

#### Volleyball - recreational (indoor / sand / grass league) (`rec_volleyball`)

- ES: Voleibol recreativo (liga en cancha, arena o pasto) | category: recreational | sport: volleyball
- origin: sports/team.json (delta), base `weekend_warrior`; family field_court; ath03 health; evidence: 04 v1 (04:weekend_warrior) + PROPOSED deltas
- why: Adult league players: landing, knee-tendon and hitting-shoulder care. recreational player: sport tag on the weekend_warrior profile, no position and no season (COACH-ANSWER GEN-02, ATH-13).
- template: BYOP 'ATHLETIC - FULL BODY - 4 DAYS A': A = Plyo, Plyo, Throwing, COD, Tripple Extension, Bilateral KD, Horizontal Pull, Unilateral KD, Vertical Pull, Leg Extensions; B = PLYO, Throwing, COD, Tripple Extension, Bilateral HD, Horizontal Push, Unilateral HD, Vertical Push, Leg Curls, ABdution; Wed/Sat = Calves, Aerobic Capacity, Core, Focus 1, Focus 2
- numbers: 4 main + 2 optional days; 128 sets / week (42 athletic); contact class 3 (50 % plyometric at block end, 35 % at start); aerobic 3 / pre - / in - (gym_plan)
- athletic dose / week: plyometric contacts 55-75; all jump contacts 105-145; throws 70-90 (T2); COD cuts 35-50 (per slot level); sprint m 0; Olympic sets 6-10
- resistance: goal strength / hypertrophy; emphasis hypertrophy 40; strength 40; power 20; rep zone '6 to 8 Reps' primary, '8 to 12 Reps' secondary/unilateral/upper, 'MYO SET' leg extensions; bilateral/unilateral % of lower compound sets: block start 50/50 -> end 40/60, in season -; contra / ipsi: cross-pattern pairing (UNI-06); contra / ipsi variety (INFERRED)
- season: no season for recreational players (GEN-02); the user's year plan applies (R2-PER-01/02)
- Olympic lifts: everyone in athletic training gets Olympic lifts (COACH-ANSWER ATH-10); 60+: none by default; offered as an option with the warning to work with a fitness professional (COACH-R2 ATH-08); older / injured / high-volume clients never get snatch variants (EQ-03)
- injuries: PATELLAR_TENDON, SHOULDER_THROWER, ANKLE_SPRAIN, PAIN_GENERAL
- sample week (any block): Mon - A1 knee + pull: warm-up -> core 2 x 2 sets, light (R2-SES-03) -> 2 plyo / ballistic -> clean variant (squat pattern, R2-ATH-04) -> HEAVY SQUAT (axial day  / Tue - B1 hip + push: core 2 x 2 -> plyo + medball throws -> snatch variant (hinge pattern) -> non-axial hinge (hip thrust / back extension / reverse hyper) + ho / Wed - aerobic 1 + optional Focus / core (optional days ideally separate - ORD-10) / Thu - A2 knee + pull: core 2 x 2 -> 2 plyo / ballistic -> clean variant -> leg press or belt squat (non-axial) + pull -> unilateral knee-dominant -> arm care (p / Fri - B2 hip + push: core 2 x 2 -> plyo + medball throws -> snatch variant (hinge pattern) -> HEAVY DEADLIFT / trap-bar (axial day 2, R2-SES-01) + push -> unila / Sat - aerobic 2 + aerobic 3 (or after a lifting day) / Sun - off
- **v1.2 (round 3):** stay athletic and active (COACH-R3 ATH-05, approved): play days entered by the user - the hardest gym day sits at least 48 h before the biggest play day (COACH-R3 ATH-05); weeks with 3+ play sessions drop the extra agility drills and half the jumps (COACH-R3 ATH-05); a 45-60+ minute session of the activity counts as one of the 3 cardio sessions (up to 2) (COACH-R3 ATH-05); optional event date: the hardest weeks end 1 week before, then 1 easy week at about half the sets (COACH-R3 ATH-05); no date -> the normal stairway or the gen-pop year

#### Ultimate - recreational league (`rec_ultimate`)

- ES: Ultimate (frisbee) recreativo | category: recreational | sport: ultimate
- origin: sports/team.json (delta), base `weekend_warrior`; family field_court; ath03 health; evidence: 04 v1 (04:weekend_warrior) + PROPOSED deltas
- why: Rec-league ultimate is one of the most running-heavy adult team options: sprint slot + hamstring and ankle care. recreational player: sport tag on the weekend_warrior profile, no position and no season (COACH-ANSWER GEN-02, ATH-13).
- template: BYOP 'ATHLETIC - FULL BODY - 4 DAYS A': A = Plyo, Plyo, Throwing, COD, Tripple Extension, Bilateral KD, Horizontal Pull, Unilateral KD, Vertical Pull, Leg Extensions; B = PLYO, Throwing, COD, Tripple Extension, Bilateral HD, Horizontal Push, Unilateral HD, Vertical Push, Leg Curls, ABdution; Wed/Sat = Calves, Aerobic Capacity, Core, Focus 1, Focus 2
- numbers: 4 main + 2 optional days; 129 sets / week (45 athletic); contact class 2 (60 % plyometric at block end, 45 % at start); aerobic 3 / pre - / in - (gym_plan)
- athletic dose / week: plyometric contacts 60-78; all jump contacts 85-115; throws 57-73 (T2); COD cuts 60-80 (MOD. TURN); sprint m 155-205; Olympic sets 6-10
- resistance: goal strength / hypertrophy; emphasis hypertrophy 40; strength 40; power 20; rep zone '6 to 8 Reps' primary, '8 to 12 Reps' secondary/unilateral/upper, 'MYO SET' leg extensions; bilateral/unilateral % of lower compound sets: block start 30/70 -> end 20/80 (v1.1 sport verification: UNI-02 COD rule), in season -; contra / ipsi: cross-pattern pairing (UNI-06); contra / ipsi variety (INFERRED)
- season: no season for recreational players (GEN-02); the user's year plan applies (R2-PER-01/02)
- Olympic lifts: everyone in athletic training gets Olympic lifts (COACH-ANSWER ATH-10); 60+: none by default; offered as an option with the warning to work with a fitness professional (COACH-R2 ATH-08); older / injured / high-volume clients never get snatch variants (EQ-03)
- injuries: HAMSTRING, ANKLE_SPRAIN, ACL_LANDING_CUTTING, PAIN_GENERAL
- sample week (any block): Mon - A1 knee + pull: warm-up -> core 2 x 2 sets, light (R2-SES-03) -> 2 plyo / ballistic -> clean variant (squat pattern, R2-ATH-04) -> HEAVY SQUAT (axial day  / Tue - B1 hip + push: speed / COD block first (squirrel jumps -> MACH / acceleration starts -> max velocity, LIB-21; route tree EASY -> MOD. -> HARD TURN, ATH-06 / Wed - aerobic 1 + optional Focus / core (optional days ideally separate - ORD-10) / Thu - A2 knee + pull: core 2 x 2 -> 2 plyo / ballistic -> clean variant -> leg press or belt squat (non-axial) + pull -> unilateral knee-dominant -> Nordic / sl / Fri - B2 hip + push: speed / COD block first (squirrel jumps -> MACH / acceleration starts -> max velocity, LIB-21; route tree EASY -> MOD. -> HARD TURN, ATH-06 / Sat - aerobic 2 + aerobic 3 (or after a lifting day) / Sun - off
- **v1.2 (round 3):** stay athletic and active (COACH-R3 ATH-05, approved): play days entered by the user - the hardest gym day sits at least 48 h before the biggest play day (COACH-R3 ATH-05); weeks with 3+ play sessions drop the extra agility drills and half the jumps (COACH-R3 ATH-05); a 45-60+ minute session of the activity counts as one of the 3 cardio sessions (up to 2) (COACH-R3 ATH-05); optional event date: the hardest weeks end 1 week before, then 1 easy week at about half the sets (COACH-R3 ATH-05); no date -> the normal stairway or the gen-pop year

#### Triathlon - recreational (first race / age group) (`rec_triathlon`)

- ES: Triatlón recreativo (primer triatlón / grupos de edad) | category: recreational | sport: triathlon
- origin: sports/aquatic-endurance-track.json (delta), base `weekend_warrior`; family general; ath03 health; evidence: 04 v1 weekend_warrior (COACH-ANSWER ATH-13 / GEN-02) + PROPOSED sport deltas
- why: First-timers and age-groupers: run injuries dominate (AQ28), plus swim-shoulder care; 2-3 strength days keep them durable while the swim-bike-run sessions fill the aerobic slots. Recreational user: sport tag on the weekend_warrior profile, no position and no season (COACH-ANSWER GEN-02, ATH-13); the year plan applies (COACH-R2 PER-01/02).
- template: BYOP 'ATHLETIC - FULL BODY - 4 DAYS A': A = Plyo, Plyo, Throwing, COD, Tripple Extension, Bilateral KD, Horizontal Pull, Unilateral KD, Vertical Pull, Leg Extensions; B = PLYO, Throwing, COD, Tripple Extension, Bilateral HD, Horizontal Push, Unilateral HD, Vertical Push, Leg Curls, ABdution; Wed/Sat = Calves, Aerobic Capacity, Core, Focus 1, Focus 2
- numbers: 4 main + 2 optional days; 112 sets / week (25 athletic); contact class 1 (75 % plyometric at block end, 60 % at start); aerobic 3 / pre - / in - (gym_plan)
- athletic dose / week: plyometric contacts 30-38; all jump contacts 45-60; throws 18-22 (T1); COD cuts 0 (-); sprint m 0; Olympic sets 6-10
- resistance: goal hypertrophy / strength; emphasis hypertrophy 40; strength 40; power 20; rep zone '6 to 8 Reps' primary, '8 to 12 Reps' secondary (weekend-warrior tab); bilateral/unilateral % of lower compound sets: block start 50/50 -> end 40/60, in season -; contra / ipsi: cross-pattern pairing (UNI-06); contra / ipsi variety (INFERRED)
- season: no season for recreational users (GEN-02); the user's year plan applies (COACH-R2 PER-01/02)
- Olympic lifts: everyone in athletic training gets Olympic lifts (COACH-ANSWER ATH-10); 60+: none by default; offered as an option with the warning 'Make sure that you have a fitness professional to help you understand what this means' (COACH-R2 ATH-08); older / injured / high-volume clients 
- injuries: ACHILLES_CALF, PATELLOFEMORAL_ITB, SHOULDER_SWIMMER, BONE_STRESS, PAIN_GENERAL
- sample week (any block): weekend-warrior 4-day template (A knee + pull / B hip + push, Mon-Tue-Thu-Fri) with the sport deltas; Wed / Sat optional days = Calves, Aerobic, Core, Focus (OB / the user may pick 3 gym days instead of 4 (the engine scales sets) / heavy squat and heavy deadlift on different days (COACH-R2 SES-01); core first 2 x 2 (R2-SES-03)
- open: recreational triathlon = weekend-warrior profile + sport tag (may duplicate genpop-active.json; the merge keeps one)
- **v1.2 (round 3):** stay athletic and active (COACH-R3 ATH-05, approved): play days entered by the user - the hardest gym day sits at least 48 h before the biggest play day (COACH-R3 ATH-05); weeks with 3+ play sessions drop the extra agility drills and half the jumps (COACH-R3 ATH-05); a 45-60+ minute session of the activity counts as one of the 3 cardio sessions (up to 2) (COACH-R3 ATH-05); optional event date: the hardest weeks end 1 week before, then 1 easy week at about half the sets (COACH-R3 ATH-05); no date -> the normal stairway or the gen-pop year

#### Rowing - recreational (indoor rowing / masters crew) (`rec_rowing`)

- ES: Remo recreativo (remo bajo techo / masters) | category: recreational | sport: rowing
- origin: sports/aquatic-endurance-track.json (delta), base `weekend_warrior`; family general; ath03 health; evidence: 04 v1 weekend_warrior (COACH-ANSWER ATH-13 / GEN-02) + PROPOSED sport deltas
- why: Indoor rowers and masters crews: posterior-chain strength, low-back and rib care (AQ34), pressing balance. Recreational user: sport tag on the weekend_warrior profile, no position and no season (COACH-ANSWER GEN-02, ATH-13); the year plan applies (COACH-R2 PER-01/02).
- template: BYOP 'ATHLETIC - FULL BODY - 4 DAYS A': A = Plyo, Plyo, Throwing, COD, Tripple Extension, Bilateral KD, Horizontal Pull, Unilateral KD, Vertical Pull, Leg Extensions; B = PLYO, Throwing, COD, Tripple Extension, Bilateral HD, Horizontal Push, Unilateral HD, Vertical Push, Leg Curls, ABdution; Wed/Sat = Calves, Aerobic Capacity, Core, Focus 1, Focus 2
- numbers: 4 main + 2 optional days; 109 sets / week (22 athletic); contact class 5 (25 % plyometric at block end, 10 % at start); aerobic 3 / pre - / in - (gym_plan)
- athletic dose / week: plyometric contacts 12-16; all jump contacts 45-60; throws 48-62 (T1); COD cuts 0 (-); sprint m 0; Olympic sets 6-10
- resistance: goal hypertrophy / strength; emphasis hypertrophy 40; strength 40; power 20; rep zone '6 to 8 Reps' primary, '8 to 12 Reps' secondary (weekend-warrior tab); bilateral/unilateral % of lower compound sets: block start 50/50 -> end 40/60, in season -; contra / ipsi: cross-pattern pairing (UNI-06); contra / ipsi variety (INFERRED)
- season: no season for recreational users (GEN-02); the user's year plan applies (COACH-R2 PER-01/02)
- Olympic lifts: everyone in athletic training gets Olympic lifts (COACH-ANSWER ATH-10); 60+: none by default; offered as an option with the warning 'Make sure that you have a fitness professional to help you understand what this means' (COACH-R2 ATH-08); older / injured / high-volume clients 
- injuries: LOW_BACK_LOADING, RIB_STRESS, PAIN_GENERAL
- sample week (any block): weekend-warrior 4-day template (A knee + pull / B hip + push, Mon-Tue-Thu-Fri) with the sport deltas; Wed / Sat optional days = Calves, Aerobic, Core, Focus (OB / heavy squat and deadlift on different days (COACH-R2 SES-01); push-ups / presses at least half of row sets / heavy squat and heavy deadlift on different days (COACH-R2 SES-01); core first 2 x 2 (R2-SES-03)
- open: recreational rowing = weekend-warrior profile + sport tag (may duplicate genpop-active.json; the merge keeps one)
- **v1.2 (round 3):** stay athletic and active (COACH-R3 ATH-05, approved): play days entered by the user - the hardest gym day sits at least 48 h before the biggest play day (COACH-R3 ATH-05); weeks with 3+ play sessions drop the extra agility drills and half the jumps (COACH-R3 ATH-05); a 45-60+ minute session of the activity counts as one of the 3 cardio sessions (up to 2) (COACH-R3 ATH-05); optional event date: the hardest weeks end 1 week before, then 1 easy week at about half the sets (COACH-R3 ATH-05); no date -> the normal stairway or the gen-pop year

#### CrossFit - class member (HALF TIME) (`crossfit_class`)

- ES: CrossFit - miembro de clase (HALF TIME) | category: recreational | sport: crossfit
- origin: sports/combat-strength-fitness.json (new), base `crossfit_competitor`; family crossfit; ath03 health; evidence: NEW (PROPOSED budget, INFERRED from SCIENCE and the nearest 04 profile: 04:crossfit_competitor variant 'crossfit_class' (OBSERVED CLASS PROGRAMMING SPLIT + HALF TIME table))
- why: Promoted from the 04 variant to its own recreational profile because it is the base of the coach's 'CrossFit-style bootcamp' sample plan (R2-GEN-07). Only the strength / power slots are counted as sets; the WOD carries most of the work, so most muscles sit below the floor of 10 sets - open question Q10.
- template: OBSERVED 'CLASS PROGRAMMING SPLIT': every class 'WARMUP/SKILL' -> 'STRENGTH/POWER' -> 'WOD'
- numbers: 4 main + 2 optional days; 37 sets / week (6 athletic); contact class - (- % plyometric at block end, - % at start); aerobic 2 / pre - / in - (gym_plan)
- athletic dose / week: plyometric contacts 0; all jump contacts 0; throws 0 (T0); COD cuts 0 (-); sprint m 0; Olympic sets 4.8-7.2
- resistance: goal endurance-strength / strength; emphasis hypertrophy 30; strength 50; power 20; rep zone HALF TIME: STRENGTH 3 x 7 -> 3 x 4 -> 'LVL 5 = Work up to 1RM' (wk 8); POWER 3 x 4 -> 3 x 1 (OBSERVED); bilateral/unilateral % of lower compound sets: block start 50/50 -> end 60/40, in season -; contra / ipsi: health accessory (CAT-13 size / strength logic, INFERRED)
- season: no season: continuous training blocks on the stairway (COACH-R2 PER-03/04/05); gen-pop year plan optional and fully tunable (COACH-R2 PER-01/02)
- Olympic lifts: everyone in athletic training gets Olympic lifts (COACH-ANSWER ATH-10); 60+: none by default; offered as an option with the warning 'Make sure that you have a fitness professional to help you understand what this means' (COACH-R2 ATH-08); older / injured / high-volume clients 
- injuries: SHOULDER_GYMNASTIC, LOW_BACK_LOADING, WRIST_HAND, PAIN_GENERAL
- sample week (off season): Mon - warm-up / skill (DUBS) -> core 1-2 x 2 light (COACH-R2 SES-03) -> STRENGTH back squat 3 x 7 -> 3 x 4 (HALF TIME) (axial day 1) -> WOD -> calves 3 sets; ae / Tue - warm-up / skill -> core -> STRENGTH press + POWER snatch -> WOD -> rear delts / Wed - WOD only (INFERRED) / Thu - warm-up / skill (GYMNASTICS) -> core -> STRENGTH deadlift (axial day 2) -> WOD -> calves 3 sets; aerobic 'LVL 3' / Fri - warm-up / skill -> core -> POWER clean -> WOD / Sat - WOD only (INFERRED); Sun off / week 8: 'LVL 5 = Work up to 1RM' only for members who finished a block; others test a 3-5RM (COACH-R2 PER-07)

#### Pickleball - recreational (open play, league, ladder) (`rec_pickleball`)

- ES: Pickleball recreativo (juego libre, liga, escalera) | category: recreational | sport: pickleball
- origin: sports/genpop-active.json (new), base `weekend_warrior`; family field_court; ath03 health; evidence: PROPOSED (analyst) on COACH rules; activity demands SCIENCE (cited)
- why: The coach asked for pickleball by name ('a very popular sport right now'). Players need lateral first steps, split-step reactions, rotation both ways, single-leg control, calves / Achilles and shoulder-elbow care. Many players are older, so the 60+ rules switch on automatically (COACH-R2 ATH-08) and falls are the main injury mechanism in seniors (G3).
- template: 05 v1.1 generator_split_templates.athletic['3'] (Athletic Performance - Non-Competitive, cross pattern, 60 min) with this activity's athletic stations
- numbers: 3 main + 1 optional days; 109 sets / week (22 athletic); contact class 3 (50 % plyometric at block end, 35 % at start); aerobic 3 / pre - / in - (gym_plan_or_activity)
- athletic dose / week: plyometric contacts 7-9; all jump contacts 14-18; throws 51-69 (T1); COD cuts 24-32 (MOD. TURN (HARD TURN for L2+ under 60)); sprint m 0; Olympic sets 4-8
- resistance: goal strength (legs, single-leg, lateral) / power (rotational, first step); emphasis hypertrophy 35; strength 45; power 20; rep zone VOL 1 -> VOL 2 (12-15 -> 8-12 compounds, PER-11 logic); calves and wrist work 12-20; bilateral/unilateral % of lower compound sets: block start 30/70 -> end 20/80, in season -; contra / ipsi: contralateral loading for getting in and out of the hip on lateral reaches (COACH-ANSWER CAT-13: COD athletes, 'tennis definitely' - pickleball INFERRED the same); ipsilateral step-ups for the first s
- season: no season for recreational activities (COACH-ANSWER GEN-02); the gen-pop year applies and is fully user-tunable - re-order blocks, more / less cardio, e.g. a winter strength block (COACH-R2 PER-01/02)
- Olympic lifts: everyone in athletic training gets Olympic lifts (COACH-ANSWER ATH-10); the 'stay athletic and active' goal maps to the athletic family (generator_spec F07 'act; 60+: none by default; offered as an option with the warning to work with a fitness professional (COACH-R2 ATH-08); older / injured / high-volume clients never get snatch variants (EQ-03)
- injuries: ACHILLES_CALF, ANKLE_SPRAIN, FALLS_COURT, WRIST_HAND, ELBOW_LATERAL_RACKET, SHOULDER_THROWER, LOW_BACK_ROTATIONAL, PAIN_GENERAL, KNEE_DEGENERATIVE_COURT
- sample week (training block): Mon - S1 (jump + knee + pull; clean day): warm-up 5 min any cardio + A-drills / mobility (ORD-08, not volume) -> core 2 exercises x 2 sets, light, short of fail / Wed - S2 (medball + hip + push; snatch day): warm-up 5 min any cardio + A-drills / mobility (ORD-08, not volume) -> core 2 exercises x 2 sets, light, short of f / Fri - S3 (Olympic + strength): warm-up 5 min any cardio + A-drills / mobility (ORD-08, not volume) -> core 2 exercises x 2 sets, light, short of failure (R2-SES / Tue / Thu / Sun - play days (open play, league) or aerobic sessions / Sat - optional: Focus 1 / Focus 2, calves, core or an aerobic session (ORD-10)
- 50+: COACH-R3 ATH-02 (approved): pickleball, padel and tennis players 50+ get knee-friendly strength, calf and Achilles work every leg day, rotator-cuff work, and only low-impact jumps (no depth jumps, hurdle hops or bounds) unless switched on. Detail: knee - KNEE_DEGENERATIVE_COURT rules every week: leg press / box squat to a pain-free depth, split squat and low step-ups, slow-eccentric leg extensions and isometric holds; lateral hip strength; no deep loaded pivoting under fatigue; Achilles / calf - ACHILLES_CALF every leg day: straight-knee and bent-knee calf raises (3 sets, VOL-17), slow lowering, progress ankle work by no more than about 10-20 % a week; a 5-min warm-up before play and before ankle work (K34c: Achilles ruptures); shoulder / elbow - rotator-cuff work (COACH-R3 ATH-02): side-lying DB external rotation, prone Y / T and KB face pulls (R2-LIB-04) 2-3 x / week; overhead pressing seated / landmine and pain-free; wrist-extensor isometrics for the paddle / racket elbow (ELBOW_LATERAL_RACKET); rotator-cuff tears are a common older-player injury (K34c); lateral - lateral shuffles, crossover steps and drop-step 'turn and run' (EASY TURN -> MOD. TURN; HARD TURN only for L2+ under 60); no fast backpedal drills (FALLS_COURT); plyo - low-impact only: RC1 landings (stick the split step / lateral stick), low-amplitude split-step pogos and lateral line hops on a forgiving surface, bilateral before single-leg; no depth jumps, hurdle hops or bounds by default at 50-59; progress only when landings are quiet and pain-free (FALLS_COURT, ACL_LANDING_CUTTING stage-1 logic); at 60+ all of it except the landing drills is opt-in with the warning (COACH-R2 ATH-08); falls / wrist - balance, reactive stepping and wrist / forearm strength every week (FALLS_COURT; wrist fractures dominate senior falls - G3); off by default: depth_jump, high_depth_drop, hurdle_hop, bound (from age 50; the user or coach can switch these jumps on (COACH-R3 ATH-02); from 60 the active_aging_60plus rules and the warning apply on top (COACH-R2 ATH-08))
- **v1.2 (round 3):** COACH-R3 ATH-02 (approved): pickleball, padel and tennis players 50+ get knee-friendly strength, calf and Achilles work every leg day, rotator-cuff work, and only low-impact jumps (no depth jumps, hurdle hops or bounds) unless switched on; structured as age_50_plus.plyo_off_by_default for the engine (applied only from age 50 - flag G4) | plyo share approved: pickleball 50 % (COACH-R3 ATH-04) | a sore player can switch off that day's athletic block (jumps / COD) and keep the resistance work, or delete exercises (COACH-R3 SES-02 - his own pickleball example) | stay athletic and active (COACH-R3 ATH-05, approved): play days entered by the user - the hardest gym day sits at least 48 h before the biggest play day (COACH-R3 ATH-05); weeks with 3+ play sessions drop the extra agility drills and half the jumps (COACH-R3 ATH-05); a 45-60+ minute session of the activity counts as one of the 3 cardio sessions (up to 2) (COACH-R3 ATH-05); optional event date: the hardest weeks end 1 week before, then 1 easy week at about half the sets (COACH-R3 ATH-05); no date -> the normal stairway or the gen-pop year

#### Padel - recreational (`rec_padel`)

- ES: Pádel recreativo | category: recreational | sport: padel
- origin: sports/genpop-active.json (new), base `weekend_warrior`; family field_court; ath03 health; evidence: PROPOSED (analyst) on COACH rules; activity demands SCIENCE (cited)
- why: Padel is a fast-growing doubles racket sport (over 1 million US players in 2025). Rallies are short and frequent, with many overheads and low volleys; the elbow is the most injured site, then knee, shoulder and low back (G5). Same frame as recreational pickleball with more overhead and forward-back work.
- template: 05 v1.1 generator_split_templates.athletic['3'] (Athletic Performance - Non-Competitive, cross pattern, 60 min) with this activity's athletic stations
- numbers: 3 main + 1 optional days; 109 sets / week (22 athletic); contact class 3 (50 % plyometric at block end, 35 % at start); aerobic 3 / pre - / in - (gym_plan_or_activity)
- athletic dose / week: plyometric contacts 7-9; all jump contacts 14-18; throws 51-69 (T1); COD cuts 24-32 (MOD. TURN (HARD TURN for L2+ under 60)); sprint m 0; Olympic sets 4-8
- resistance: goal strength (legs, single-leg, lateral) / power (overhead and rotational); emphasis hypertrophy 35; strength 45; power 20; rep zone VOL 1 -> VOL 2 (12-15 -> 8-12 compounds, PER-11 logic); calves and wrist work 12-20; bilateral/unilateral % of lower compound sets: block start 30/70 -> end 20/80, in season -; contra / ipsi: contralateral loading for getting in and out of the hip on lateral reaches and low volleys (COACH-ANSWER CAT-13: COD athletes, 'tennis definitely' - padel INFERRED the same); ipsilateral step-ups for 
- season: no season for recreational activities (COACH-ANSWER GEN-02); the gen-pop year applies and is fully user-tunable - re-order blocks, more / less cardio, e.g. a winter strength block (COACH-R2 PER-01/02)
- Olympic lifts: everyone in athletic training gets Olympic lifts (COACH-ANSWER ATH-10); the 'stay athletic and active' goal maps to the athletic family (generator_spec F07 'act; 60+: none by default; offered as an option with the warning to work with a fitness professional (COACH-R2 ATH-08); older / injured / high-volume clients never get snatch variants (EQ-03)
- injuries: ELBOW_LATERAL_RACKET, ACL_LANDING_CUTTING, SHOULDER_THROWER, LOW_BACK_ROTATIONAL, ACHILLES_CALF, ANKLE_SPRAIN, FALLS_COURT, PAIN_GENERAL, KNEE_DEGENERATIVE_COURT
- sample week (training block): Mon - S1 (jump + knee + pull; clean day): warm-up 5 min any cardio + A-drills / mobility (ORD-08, not volume) -> core 2 exercises x 2 sets, light, short of fail / Wed - S2 (medball + hip + push; snatch day): warm-up 5 min any cardio + A-drills / mobility (ORD-08, not volume) -> core 2 exercises x 2 sets, light, short of f / Fri - S3 (Olympic + strength): warm-up 5 min any cardio + A-drills / mobility (ORD-08, not volume) -> core 2 exercises x 2 sets, light, short of failure (R2-SES / Tue / Thu / Sun - matches or aerobic sessions / Sat - optional: Focus 1 / Focus 2, calves, core or an aerobic session (ORD-10)
- 50+: COACH-R3 ATH-02 (approved): pickleball, padel and tennis players 50+ get knee-friendly strength, calf and Achilles work every leg day, rotator-cuff work, and only low-impact jumps (no depth jumps, hurdle hops or bounds) unless switched on. Detail: knee - KNEE_DEGENERATIVE_COURT rules every week: leg press / box squat to a pain-free depth, split squat and low step-ups, slow-eccentric leg extensions and isometric holds; lateral hip strength; no deep loaded pivoting under fatigue; Achilles / calf - ACHILLES_CALF every leg day: straight-knee and bent-knee calf raises (3 sets, VOL-17), slow lowering, progress ankle work by no more than about 10-20 % a week; a 5-min warm-up before play and before ankle work (K34c: Achilles ruptures); shoulder / elbow - rotator-cuff work (COACH-R3 ATH-02): side-lying DB external rotation, prone Y / T and KB face pulls (R2-LIB-04) 2-3 x / week; overhead pressing seated / landmine and pain-free; wrist-extensor isometrics for the paddle / racket elbow (ELBOW_LATERAL_RACKET); rotator-cuff tears are a common older-player injury (K34c); lateral - lateral shuffles, crossover steps and drop-step 'turn and run' (EASY TURN -> MOD. TURN; HARD TURN only for L2+ under 60); no fast backpedal drills (FALLS_COURT); plyo - low-impact only: RC1 landings (stick the split step / lateral stick), low-amplitude split-step pogos and lateral line hops on a forgiving surface, bilateral before single-leg; no depth jumps, hurdle hops or bounds by default at 50-59; progress only when landings are quiet and pain-free (FALLS_COURT, ACL_LANDING_CUTTING stage-1 logic); at 60+ all of it except the landing drills is opt-in with the warning (COACH-R2 ATH-08); falls / wrist - balance, reactive stepping and wrist / forearm strength every week (FALLS_COURT; wrist fractures dominate senior falls - G3); off by default: depth_jump, high_depth_drop, hurdle_hop, bound (from age 50; the user or coach can switch these jumps on (COACH-R3 ATH-02); from 60 the active_aging_60plus rules and the warning apply on top (COACH-R2 ATH-08))
- **v1.2 (round 3):** COACH-R3 ATH-02 (approved): pickleball, padel and tennis players 50+ get knee-friendly strength, calf and Achilles work every leg day, rotator-cuff work, and only low-impact jumps (no depth jumps, hurdle hops or bounds) unless switched on; structured as age_50_plus.plyo_off_by_default for the engine (applied only from age 50 - flag G4) | plyo share approved: padel 50 % (COACH-R3 ATH-04) | stay athletic and active (COACH-R3 ATH-05, approved): play days entered by the user - the hardest gym day sits at least 48 h before the biggest play day (COACH-R3 ATH-05); weeks with 3+ play sessions drop the extra agility drills and half the jumps (COACH-R3 ATH-05); a 45-60+ minute session of the activity counts as one of the 3 cardio sessions (up to 2) (COACH-R3 ATH-05); optional event date: the hardest weeks end 1 week before, then 1 easy week at about half the sets (COACH-R3 ATH-05); no date -> the normal stairway or the gen-pop year

#### Tennis - recreational (social, club or adult league) (`rec_tennis`)

- ES: Tenis recreativo (social, club o liga de adultos) | category: recreational | sport: tennis
- origin: sports/genpop-active.json (new), base `weekend_warrior`; family field_court; ath03 health; evidence: PROPOSED (analyst) on COACH rules; activity demands SCIENCE (cited)
- why: The coach already covered tennis (04): class 3, 50 % plyo share, high medball, contralateral loading 'definitely', 80-90 % unilateral in the gym. The recreational version reuses those rules at a recreational dose, with no season and with the 60+ defaults for older club players.
- template: 05 v1.1 generator_split_templates.athletic['3'] (Athletic Performance - Non-Competitive, cross pattern, 60 min) with this activity's athletic stations
- numbers: 3 main + 1 optional days; 113 sets / week (26 athletic); contact class 3 (50 % plyometric at block end, 35 % at start); aerobic 3 / pre - / in - (gym_plan_or_activity)
- athletic dose / week: plyometric contacts 12-16; all jump contacts 20-28; throws 68-92 (T2); COD cuts 24-32 (MOD. TURN (HARD TURN for L2+)); sprint m 0; Olympic sets 4-8
- resistance: goal strength / power (rotational); emphasis hypertrophy 30; strength 45; power 25; rep zone VOL 2 + STRENGTH lower body for L2+ (04 tennis); bilateral/unilateral % of lower compound sets: block start 30/70 -> end 20/80, in season -; contra / ipsi: contralateral 'definitely' (COACH-ANSWER CAT-13: tennis)
- season: no season for recreational activities (COACH-ANSWER GEN-02); the gen-pop year applies and is fully user-tunable - re-order blocks, more / less cardio, e.g. a winter strength block (COACH-R2 PER-01/02)
- Olympic lifts: everyone in athletic training gets Olympic lifts (COACH-ANSWER ATH-10); the 'stay athletic and active' goal maps to the athletic family (generator_spec F07 'act; 60+: none by default; offered as an option with the warning to work with a fitness professional (COACH-R2 ATH-08); older / injured / high-volume clients never get snatch variants (EQ-03)
- injuries: ELBOW_LATERAL_RACKET, SHOULDER_THROWER, LOW_BACK_ROTATIONAL, ACHILLES_CALF, ANKLE_SPRAIN, GROIN_ADDUCTOR, FALLS_COURT, PAIN_GENERAL, KNEE_DEGENERATIVE_COURT
- sample week (training block): Mon - S1 (jump + knee + pull; clean day): warm-up 5 min any cardio + A-drills / mobility (ORD-08, not volume) -> core 2 exercises x 2 sets, light, short of fail / Wed - S2 (medball + hip + push; snatch day): warm-up 5 min any cardio + A-drills / mobility (ORD-08, not volume) -> core 2 exercises x 2 sets, light, short of f / Fri - S3 (Olympic + strength): warm-up 5 min any cardio + A-drills / mobility (ORD-08, not volume) -> core 2 exercises x 2 sets, light, short of failure (R2-SES / Tue / Thu / Sat - matches or aerobic sessions / Sat - optional: Focus 1 / Focus 2, calves, core or an aerobic session (ORD-10)
- 50+: COACH-R3 ATH-02 (approved): pickleball, padel and tennis players 50+ get knee-friendly strength, calf and Achilles work every leg day, rotator-cuff work, and only low-impact jumps (no depth jumps, hurdle hops or bounds) unless switched on. Detail: knee - KNEE_DEGENERATIVE_COURT rules every week: leg press / box squat to a pain-free depth, split squat and low step-ups, slow-eccentric leg extensions and isometric holds; lateral hip strength; no deep loaded pivoting under fatigue; Achilles / calf - ACHILLES_CALF every leg day: straight-knee and bent-knee calf raises (3 sets, VOL-17), slow lowering, progress ankle work by no more than about 10-20 % a week; a 5-min warm-up before play and before ankle work (K34c: Achilles ruptures); shoulder / elbow - rotator-cuff work (COACH-R3 ATH-02): side-lying DB external rotation, prone Y / T and KB face pulls (R2-LIB-04) 2-3 x / week; overhead pressing seated / landmine and pain-free; wrist-extensor isometrics for the paddle / racket elbow (ELBOW_LATERAL_RACKET); rotator-cuff tears are a common older-player injury (K34c); lateral - lateral shuffles, crossover steps and drop-step 'turn and run' (EASY TURN -> MOD. TURN; HARD TURN only for L2+ under 60); no fast backpedal drills (FALLS_COURT); plyo - low-impact only: RC1 landings (stick the split step / lateral stick), low-amplitude split-step pogos and lateral line hops on a forgiving surface, bilateral before single-leg; no depth jumps, hurdle hops or bounds by default at 50-59; progress only when landings are quiet and pain-free (FALLS_COURT, ACL_LANDING_CUTTING stage-1 logic); at 60+ all of it except the landing drills is opt-in with the warning (COACH-R2 ATH-08); falls / wrist - balance, reactive stepping and wrist / forearm strength every week (FALLS_COURT; wrist fractures dominate senior falls - G3); off by default: depth_jump, high_depth_drop, hurdle_hop, bound (from age 50; the user or coach can switch these jumps on (COACH-R3 ATH-02); from 60 the active_aging_60plus rules and the warning apply on top (COACH-R2 ATH-08))
- open: Recreational tennis: start 30/70 and end 20/80 bilateral : unilateral (one step more bilateral than your competitive tennis player)?
- **v1.2 (round 3):** COACH-R3 ATH-02 (approved): pickleball, padel and tennis players 50+ get knee-friendly strength, calf and Achilles work every leg day, rotator-cuff work, and only low-impact jumps (no depth jumps, hurdle hops or bounds) unless switched on; structured as age_50_plus.plyo_off_by_default for the engine (applied only from age 50 - flag G4) | stay athletic and active (COACH-R3 ATH-05, approved): play days entered by the user - the hardest gym day sits at least 48 h before the biggest play day (COACH-R3 ATH-05); weeks with 3+ play sessions drop the extra agility drills and half the jumps (COACH-R3 ATH-05); a 45-60+ minute session of the activity counts as one of the 3 cardio sessions (up to 2) (COACH-R3 ATH-05); optional event date: the hardest weeks end 1 week before, then 1 easy week at about half the sets (COACH-R3 ATH-05); no date -> the normal stairway or the gen-pop year

#### Golf - recreational (`rec_golf`)

- ES: Golf recreativo | category: recreational | sport: golf
- origin: sports/genpop-active.json (new), base `weekend_warrior`; family field_court; ath03 health; evidence: PROPOSED (analyst) on COACH rules; activity demands SCIENCE (cited)
- why: The coach covered golf (04): class 5, 25 % plyo share, high rotational medball, into / out-of-the-hip lunges. Recreational golfers (many older) get the same qualities at a recreational dose; one light footwork station keeps the 'stay athletic' agility piece.
- template: 05 v1.1 generator_split_templates.athletic['3'] (Athletic Performance - Non-Competitive, cross pattern, 60 min) with this activity's athletic stations
- numbers: 3 main + 1 optional days; 106 sets / week (19 athletic); contact class 5 (25 % plyometric at block end, 10 % at start); aerobic 3 / pre - / in - (gym_plan_or_activity)
- athletic dose / week: plyometric contacts 3-5; all jump contacts 15-21; throws 68-92 (T2); COD cuts 12-16 (EASY TURN); sprint m 0; Olympic sets 2-6
- resistance: goal power (rotational) / strength (lower body, lead-leg block); emphasis hypertrophy 25; strength 40; power 35; rep zone VOL 2 + STRENGTH lower body for L2+ (04 golf); bilateral/unilateral % of lower compound sets: block start 30/70 -> end 20/80, in season -; contra / ipsi: into / out of the hip: contralateral-loaded lunges and step-ups ('GET INTO THE HIP'), ipsilateral ('GET OUT OF THE HIP'); lead leg into, trail leg out (04 golf, COACH-ANSWER CAT-13)
- season: no season for recreational activities (COACH-ANSWER GEN-02); the gen-pop year applies and is fully user-tunable - re-order blocks, more / less cardio, e.g. a winter strength block (COACH-R2 PER-01/02)
- Olympic lifts: everyone in athletic training gets Olympic lifts (COACH-ANSWER ATH-10); the 'stay athletic and active' goal maps to the athletic family (generator_spec F07 'act; 60+: none by default; offered as an option with the warning to work with a fitness professional (COACH-R2 ATH-08); older / injured / high-volume clients never get snatch variants (EQ-03)
- injuries: LOW_BACK_ROTATIONAL, LEAD_HIP_GLUTE, ELBOW_LATERAL_RACKET, SHOULDER_THROWER, PAIN_GENERAL
- sample week (training block): Mon - S1 (jump + knee + pull; clean day): warm-up 5 min any cardio + A-drills / mobility (ORD-08, not volume) -> core 2 exercises x 2 sets, light, short of fail / Wed - S2 (medball + hip + push; snatch day): warm-up 5 min any cardio + A-drills / mobility (ORD-08, not volume) -> core 2 exercises x 2 sets, light, short of f / Fri - S3 (Olympic + strength): warm-up 5 min any cardio + A-drills / mobility (ORD-08, not volume) -> core 2 exercises x 2 sets, light, short of failure (R2-SES / Tue / Thu / Sat / Sun - rounds, range or aerobic sessions / Sat - optional: Focus 1 / Focus 2, calves, core or an aerobic session (ORD-10)
- open: One light footwork (COD) station a week for recreational golfers to keep 'some agility' - yes or no?
- **v1.2 (round 3):** stay athletic and active (COACH-R3 ATH-05, approved): play days entered by the user - the hardest gym day sits at least 48 h before the biggest play day (COACH-R3 ATH-05); weeks with 3+ play sessions drop the extra agility drills and half the jumps (COACH-R3 ATH-05); a 45-60+ minute session of the activity counts as one of the 3 cardio sessions (up to 2) (COACH-R3 ATH-05); optional event date: the hardest weeks end 1 week before, then 1 easy week at about half the sets (COACH-R3 ATH-05); no date -> the normal stairway or the gen-pop year | recreational players use their activity's share (COACH-R3 ATH-04): golf 25 %

#### HYROX for fitness (first race / Open division) (`hyrox_fitness`)

- ES: HYROX por salud (primera carrera / división Open) | category: recreational | sport: hyrox
- origin: sports/genpop-active.json (new), base `hybrid`; family crossfit; ath03 health; evidence: PROPOSED (analyst) on COACH rules; activity demands SCIENCE (cited)
- why: The coach named HYROX ('high rows') as something gen-pop people want to do. The race is 8 x 1 km runs, each followed by a station (SkiErg 1000 m, sled push 50 m, sled pull 50 m, burpee broad jumps 80 m, row 1000 m, farmers carry 200 m, sandbag lunges 100 m, wall balls 100). Aerobic capacity is the main predictor; strength must be enough to move the Open loads. The coach already mentions HYROX twice in round 1 (EQ-06 heavier ball for wall balls, VOL-11 40-rep sets).
- template: approved HYROX plan (COACH-R3 ATH-03) on the 05 v1.1 hybrid_crossfit family: 2 strength days on the athletic 2-day template (A squat + pull, B deadlift + push - R2-SES-01) + 2 hybrid days (hybrid 1 run intervals, hybrid 2 '1 km run + 1 station' repeated), each closed by a short station circuit finisher; + 2 Orange sessions
- numbers: 4 main + 1 optional days; 100 sets / week (18 athletic); contact class 3 (50 % plyometric at block end, 35 % at start); aerobic 4 / pre - / in - (gym_plan_or_activity)
- athletic dose / week: plyometric contacts 9-13; all jump contacts 31-41; throws 17-23 (T1); COD cuts 12-16 (EASY TURN); sprint m 0; Olympic sets 2-6
- resistance: goal endurance-strength / strength; emphasis hypertrophy 20; strength 40; power 10; endurance_strength 30; rep zone strength days: VOL 1 -> VOL 2 (12-15 -> 8-12), squat / deadlift 4-6 reps for L2+; station work 20-40 reps or set distances; 40-rep / AMRAP style allowed here (C; bilateral/unilateral % of lower compound sets: block start 50/50 -> end 50/50, in season -; contra / ipsi: ipsilateral step-ups and lunges for push-off (CAT-13 acceleration logic, INFERRED); contra / ipsi variety as health accessories
- season: no season for recreational activities (COACH-ANSWER GEN-02); the gen-pop year applies and is fully user-tunable - re-order blocks, more / less cardio, e.g. a winter strength block (COACH-R2 PER-01/02)
- Olympic lifts: everyone in athletic training gets Olympic lifts (COACH-ANSWER ATH-10); the 'stay athletic and active' goal maps to the athletic family (generator_spec F07 'act; 60+: none by default; offered as an option with the warning to work with a fitness professional (COACH-R2 ATH-08); older / injured / high-volume clients never get snatch variants (EQ-03)
- injuries: PATELLAR_TENDON, LOW_BACK_LOADING, ACHILLES_CALF, RUNNING_OVERUSE, NEW_CLASS_EASE_IN, PAIN_GENERAL
- sample week (training block): Mon - A (squat + pull; clean day): warm-up 5 min any cardio + A-drills / mobility (ORD-08, not volume) -> core 2 exercises x 2 sets, light, short of f / Thu - B (deadlift + push; snatch day): warm-up 5 min any cardio + A-drills / mobility (ORD-08, not volume) -> core 2 exercises x 2 sets, light, short  / Tue - hybrid 1: core 2 x 2 -> skips / pogo -> Blue run intervals (200-400 m) -> station circuit finisher 1 (sled push / pull, wall balls with the race / Sat - hybrid 2: core 2 x 2 -> Green '1 km run + 1 station' x 3-5 (race simulation) -> station circuit finisher 2 (farmers carry, sandbag lunges, SkiEr / Wed or Sun - Orange steady run or row / SkiErg 30-50 min (the second Orange) / Sun - optional: Focus / calves / core or an easy walk
- **v1.2 (round 3):** COACH-R3 ATH-03 (approved HYROX plan): 2 strength days (squat + pull, deadlift + push) + 2 hybrid days (run intervals, or 1 km run + 1 station repeated); 4 cardio sessions (Blue, Green, Orange + a second Orange) because running is about half the race; 2 short station circuits a week (sled push / pull, burpee broad jumps, wall balls, farmers carry, sandbag lunges, SkiErg / row) as finishers that do not count as muscle sets; wall balls with the race ball (never over 20 lb); 40-rep / AMRAP sets only inside these circuits; jumps 50 % plyometric, like basketball | station circuits sit as finishers on the two hybrid days (placement PROPOSED); the 2 strength days keep the heavy squat and the heavy deadlift on different days (COACH-R2 SES-01) | optional race date: hardest weeks end 1 week before, then 1 easy week at about half the sets (COACH-R3 ATH-05) | stay athletic and active (COACH-R3 ATH-05, approved): play days entered by the user - the hardest gym day sits at least 48 h before the biggest play day (COACH-R3 ATH-05); weeks with 3+ play sessions drop the extra agility drills and half the jumps (COACH-R3 ATH-05); a 45-60+ minute session of the activity counts as one of the 3 cardio sessions (up to 2) (COACH-R3 ATH-05); optional event date: the hardest weeks end 1 week before, then 1 easy week at about half the sets (COACH-R3 ATH-05); no date -> the normal stairway or the gen-pop year

#### Boxing, kickboxing and martial-arts classes for fitness (incl. BJJ / Muay Thai hobbyists) (`rec_combat_fitness`)

- ES: Boxeo, kickboxing y artes marciales por salud (incluye BJJ / Muay Thai recreativo) | category: recreational | sport: combat_fitness
- origin: v1.1 sport verification (new), base `rec_golf`; family combat; ath03 health; evidence: PROPOSED (v1.1 sport verification) on COACH rules (ATH-01 / ATH-04 / ATH-05 / R2-ATH-01); activity demands from the 04 combat profiles
- why: Boxing gyms, kickboxing / Muay Thai classes and BJJ academies are among the most common ways adults 'stay athletic and active'. The coach's combat rules apply at a recreational dose: strikers and grapplers sit in contact class 5 (25 % plyometric - 'karate / boxing more ballistic', COACH-R2 ATH-01), rotational medball work is high for striking (ATH-05), pressing and arm volume come DOWN but never to zero in weeks with many classes (ATH-04), rows and rear delts keep the shoulders balanced, and the neck and grip get a little direct work for grapplers.
- template: 05 v1.1 generator_split_templates.athletic['3'] (Athletic Performance - Non-Competitive, cross pattern, 60 min) with combat athletic stations
- numbers: 3 main + 1 optional days; 112 sets / week (24 athletic); contact class 5 (25 % plyometric at block end, 10 % at start); aerobic 3 / pre - / in - (gym_plan_or_activity)
- athletic dose / week: plyometric contacts 5-7; all jump contacts 23-31; throws 77-104 (T2); COD cuts 12-16 (MOD. TURN (EASY TURN first)); sprint m 0; Olympic sets 5-7
- resistance: goal strength (legs, posterior chain, upper back) / rotational power; emphasis hypertrophy 30; strength 40; power 30; rep zone VOL 1 -> VOL 2 (12-15 -> 8-12 compounds, PER-11 logic); STRENGTH 4-6 for the main lower lift for L2+; bilateral/unilateral % of lower compound sets: block start 40/60 -> end 30/70, in season -; contra / ipsi: contralateral loading for getting in and out of the hip on stance switches, pivots and kicks (COACH-ANSWER CAT-13 logic for rotational / COD athletes - INFERRED); ipsilateral step-ups for the push-off
- season: no season for recreational activities (COACH-ANSWER GEN-02); the gen-pop year applies and is fully user-tunable - re-order blocks, more / less cardio, e.g. a winter strength block (COACH-R2 PER-01/02)
- Olympic lifts: everyone in athletic training gets Olympic lifts (COACH-ANSWER ATH-10); the 'stay athletic and active' goal maps to the athletic family (generator_spec F07 'active'), so it applies here (INFERRED); 60+: none by default; offered as an option with the warning to work with a fitness professional (COACH-R2 ATH-08); older / injured / high-volume clients never get snatch variants (EQ-03)
- injuries: SHOULDER_STRIKER, WRIST_HAND, LOW_BACK_ROTATIONAL, HIP_FLEXOR, GROIN_ADDUCTOR, ACHILLES_CALF, NEW_CLASS_EASE_IN, PAIN_GENERAL
- sample week (training block): Mon - S1 (jump + knee + pull; clean day): warm-up 5 min any cardio + A-drills / mobility (ORD-08, not volume) -> core 2 exercises x 2 sets, light, sho / Wed - S2 (medball + hip + push; snatch day): warm-up 5 min any cardio + A-drills / mobility (ORD-08, not volume) -> core 2 exercises x 2 sets, light,  / Fri - S3 (Olympic + strength): warm-up 5 min any cardio + A-drills / mobility (ORD-08, not volume) -> core 2 exercises x 2 sets, light, short of failu / Tue / Thu / Sat / Sun - classes or aerobic sessions / Sat - optional: Focus 1 / Focus 2, calves, core or an aerobic session (ORD-10)
- variants: `combat_fitness_grappling` Grappling style (BJJ, judo, wrestling for fitness) (THROW -3; BALL 1; ISO_NECK 2; ISO_GRIP 2; HPULL 1; ISO_BICEP 2)
- 60+: no Olympic lifts, no plyos, no depth jumps; landing drills (RC1 'Land': step-down and stick, no rebound) stay; low ankle hops join the opt-in (plyometric list, COACH-R2 ATH-02); light medball throws (4-8 lb) and EASY-TURN footwork stay (throws and COD are not plyos - INFERRED); compounds and isolation on constrained machines where available (EQ-03 / EQ-04)
- open: Should a class replace up to 2 of the 3 gym aerobic sessions? Grappling hobbyists: a variant with neck + grip work and fewer throws - OK?
- **v1.2 (round 3):** stay athletic and active (COACH-R3 ATH-05, approved): play days entered by the user - the hardest gym day sits at least 48 h before the biggest play day (COACH-R3 ATH-05); weeks with 3+ play sessions drop the extra agility drills and half the jumps (COACH-R3 ATH-05); a 45-60+ minute session of the activity counts as one of the 3 cardio sessions (up to 2) (COACH-R3 ATH-05); optional event date: the hardest weeks end 1 week before, then 1 easy week at about half the sets (COACH-R3 ATH-05); no date -> the normal stairway or the gen-pop year

#### Climbing and bouldering gym (recreational) (`rec_climbing`)

- ES: Escalada y búlder en gimnasio (recreativo) | category: recreational | sport: climbing
- origin: v1.1 sport verification (new), base `rec_golf`; family general; ath03 health; evidence: PROPOSED (v1.1 sport verification) on COACH rules; activity demands from the competitive climbing profile (K31, K32 - cited there)
- why: Bouldering and rope-climbing gyms are a fast-growing way adults stay athletic. The wall already gives a lot of pulling and finger load, so the gym plan balances it: antagonist pushing and shoulder external rotation, wrist-extensor and grip balance, legs and hips for high steps, trunk tension, and landing practice for bouldering falls. Finger-specific training (hangboard) is for L2+ only and follows FINGER_PULLEY. Contact class 5 (sustained contact, 25 % plyometric).
- template: 05 v1.1 generator_split_templates.athletic['3'] (Athletic Performance - Non-Competitive, cross pattern, 60 min) with climbing-friendly athletic stations
- numbers: 3 main + 1 optional days; 107 sets / week (16 athletic); contact class 5 (25 % plyometric at block end, 10 % at start); aerobic 3 / pre - / in - (gym_plan_or_activity)
- athletic dose / week: plyometric contacts 2-3; all jump contacts 20-27; throws 38-52 (T1); COD cuts 12-16 (EASY TURN); sprint m 0; Olympic sets 3-5
- resistance: goal relative strength + antagonist balance / shoulder and elbow health; emphasis hypertrophy 20; strength 50; power 15; endurance_strength 15; rep zone VOL 1 -> VOL 2 for antagonists and legs; STRENGTH 3-6 for weighted pull-ups / lock-offs only for L2+; bilateral/unilateral % of lower compound sets: block start 50/50 -> end 40/60, in season -; contra / ipsi: contralateral-loaded lunges and step-ups to 'get into the hip' for high steps and drop-knees (COACH-ANSWER CAT-13 health logic - INFERRED)
- season: no season for recreational activities (COACH-ANSWER GEN-02); the gen-pop year applies and is fully user-tunable - re-order blocks, more / less cardio, e.g. a winter strength block (COACH-R2 PER-01/02)
- Olympic lifts: everyone in athletic training gets Olympic lifts (COACH-ANSWER ATH-10); the 'stay athletic and active' goal maps to the athletic family (generator_spec F07 'active'), so it applies here (INFERRED); 60+: none by default; offered as an option with the warning to work with a fitness professional (COACH-R2 ATH-08); older / injured / high-volume clients never get snatch variants (EQ-03)
- injuries: FINGER_PULLEY, SHOULDER_GYMNASTIC, ELBOW_GRAPPLING, ANKLE_SPRAIN, PAIN_GENERAL
- sample week (training block): Mon - S1 (jump + knee + pull; clean day): warm-up 5 min any cardio + A-drills / mobility (ORD-08, not volume) -> core 2 exercises x 2 sets, light, sho / Wed - S2 (medball + hip + push): warm-up 5 min any cardio + A-drills / mobility (ORD-08, not volume) -> core 2 exercises x 2 sets, light, short of fai / Fri - S3 (Olympic + strength): warm-up 5 min any cardio + A-drills / mobility (ORD-08, not volume) -> core 2 exercises x 2 sets, light, short of failu / Tue / Thu / Sat / Sun - climbing sessions or aerobic sessions / Sat - optional: Focus 1 / Focus 2, calves, core or an aerobic session (ORD-10)
- 60+: no Olympic lifts, no plyos, no depth jumps; landing drills (RC1 'Land': step-down and stick, no rebound) stay; low ankle hops join the opt-in (plyometric list, COACH-R2 ATH-02); light medball throws (4-8 lb) and EASY-TURN footwork stay (throws and COD are not plyos - INFERRED); compounds and isolation on constrained machines where available (EQ-03 / EQ-04)
- open: Gym pulling reduced (the wall supplies it) and antagonist pushing raised - OK? Hangboard only for L2+ adults - OK?
- **v1.2 (round 3):** stay athletic and active (COACH-R3 ATH-05, approved): play days entered by the user - the hardest gym day sits at least 48 h before the biggest play day (COACH-R3 ATH-05); weeks with 3+ play sessions drop the extra agility drills and half the jumps (COACH-R3 ATH-05); a 45-60+ minute session of the activity counts as one of the 3 cardio sessions (up to 2) (COACH-R3 ATH-05); optional event date: the hardest weeks end 1 week before, then 1 easy week at about half the sets (COACH-R3 ATH-05); no date -> the normal stairway or the gen-pop year | v1.1 said climbing does not count as cardio; the approved general rule (a 45-60+ min session counts, up to 2 of 3) now applies - the user can add a cardio session if they want more (COACH-R3 ATH-05; flag G6)

#### Obstacle course racing for fitness (first Spartan / Tough Mudder) (`rec_ocr`)

- ES: Carreras de obstáculos por salud (primer Spartan / Tough Mudder) | category: recreational | sport: ocr
- origin: v1.1 sport verification (new), base `hyrox_fitness`; family crossfit; ath03 health; evidence: PROPOSED (v1.1 sport verification) on COACH rules; activity demands SCIENCE K20-K22 (cited in ocr_spartan)
- why: A first Spartan Sprint (about 5 km and 20 obstacles) or a Tough Mudder is a classic 'stay athletic' goal next to HYROX. It is mostly trail running with obstacles in between: aerobic base first, then grip and pulling (hangs, rope, rig, monkey bars), carries, crawls, wall climbs and confident landings. Contact class 3 'mixed' like the competitive OCR profile (50 % plyometric).
- template: 05 v1.1 hybrid_crossfit family ('strength day + a OCR-style circuit', 05 rules.stay_athletic_and_active_genpop): 2 strength days on the athletic 2-day template (squat + pull / deadlift + push, R2-SES-01) + 2 hybrid days (run intervals or compromised running + a obstacle-skill circuit (hangs, carries, crawls, wall drills))
- numbers: 4 main + 1 optional days; 108 sets / week (20 athletic); contact class 3 (50 % plyometric at block end, 35 % at start); aerobic 4 / pre - / in - (gym_plan_or_activity)
- athletic dose / week: plyometric contacts 8-11; all jump contacts 31-41; throws 17-23 (T1); COD cuts 24-32 (MOD. TURN); sprint m 0; Olympic sets 2-6
- resistance: goal endurance-strength (pull, grip, carry) / strength; emphasis hypertrophy 20; strength 40; power 10; endurance_strength 30; rep zone strength days: VOL 1 -> VOL 2 (12-15 -> 8-12), squat / deadlift 4-6 reps for L2+; station work 20-40 reps or set distances; 40-rep / AMRAP style allowed here (COACH-ANSWER VOL-11: 'CrossFit or high-raw athletes'); bilateral/unilateral % of lower compound sets: block start 40/60 -> end 30/70, in season -; contra / ipsi: ipsilateral step-ups and lunges for uphill push-off (CAT-13 acceleration logic, INFERRED); contra / ipsi variety as health accessories
- season: no season for recreational activities (COACH-ANSWER GEN-02); the gen-pop year applies and is fully user-tunable - re-order blocks, more / less cardio, e.g. a winter strength block (COACH-R2 PER-01/02)
- Olympic lifts: everyone in athletic training gets Olympic lifts (COACH-ANSWER ATH-10); the 'stay athletic and active' goal maps to the athletic family (generator_spec F07 'active'), so it applies here (INFERRED); 60+: none by default; offered as an option with the warning to work with a fitness professional (COACH-R2 ATH-08); older / injured / high-volume clients never get snatch variants (EQ-03)
- injuries: ANKLE_SPRAIN, ACHILLES_CALF, KNEE_DESCENT_ECCENTRIC, RUNNING_OVERUSE, FINGER_PULLEY, SHOULDER_GYMNASTIC, FALL_UPPER_LIMB, PAIN_GENERAL
- sample week (training block): Mon - A (squat + pull; clean day): warm-up 5 min any cardio + A-drills / mobility (ORD-08, not volume) -> core 2 exercises x 2 sets, light, short of f / Tue - Blue: hill repeats or run intervals / Thu - B (deadlift + push; snatch day): warm-up 5 min any cardio + A-drills / mobility (ORD-08, not volume) -> core 2 exercises x 2 sets, light, short  / Sat - Orange: trail run 30-60 min (+ obstacle-skill circuit: hangs, crawls, wall drills) / Sun / Wed - Green obstacle intervals or the optional day (Focus, core, a second Orange hike / ruck - ORD-10)
- 60+: no Olympic lifts, no plyos (incl. burpee broad jumps and box jumps), no depth jumps; landing drills (step-down and stick) stay; low ankle hops join the opt-in (plyometric list, COACH-R2 ATH-02); hangs, carries, crawls, hikes and ergs stay
- open: OCR for fitness: class 3 (50 % plyometric) like the competitive OCR profile? 4 aerobic sessions (A + B + C + a second C) with 2 obstacle-skill circuits as finishers? Burpees (the race penalty) as conditioning, not plyo sets - OK?
- **v1.2 (round 3):** not named in round 3: keeps 4 aerobic sessions and station-style circuits by analogy to the approved HYROX plan (COACH-R3 ATH-03) - PROPOSED | stay athletic and active (COACH-R3 ATH-05, approved): play days entered by the user - the hardest gym day sits at least 48 h before the biggest play day (COACH-R3 ATH-05); weeks with 3+ play sessions drop the extra agility drills and half the jumps (COACH-R3 ATH-05); a 45-60+ minute session of the activity counts as one of the 3 cardio sessions (up to 2) (COACH-R3 ATH-05); optional event date: the hardest weeks end 1 week before, then 1 easy week at about half the sets (COACH-R3 ATH-05); no date -> the normal stairway or the gen-pop year

#### Rec league (adult recreational team sport - pick the sport) (`rec_league`)

- ES: Liga recreativa (deporte de equipo para adultos - elige el deporte) | category: recreational | sport: rec_league
- origin: sports/genpop-active.json (delta), base `weekend_warrior`; family field_court; ath03 health; evidence: PROPOSED (analyst) on COACH rules; activity demands SCIENCE (cited)
- why: The intake (generator_spec F11r 'rec_league') asks the league sport. Each sport has its own recreational profile; this router is the fallback with the weekend-warrior dial and the game-day rule.
- template: 05 v1.1 generator_split_templates.athletic['3'] (Athletic Performance - Non-Competitive, cross pattern, 60 min) with this activity's athletic stations
- numbers: 3 main + 1 optional days; 107 sets / week (24 athletic); contact class 3 (50 % plyometric at block end, 35 % at start); aerobic 3 / pre - / in - (gym_plan_or_activity)
- athletic dose / week: plyometric contacts 24-32; all jump contacts 47-63; throws 34-46 (T1); COD cuts 24-32 (MOD. TURN); sprint m 0; Olympic sets 4-8
- resistance: goal strength / hypertrophy; emphasis hypertrophy 40; strength 40; power 20; rep zone 04 weekend warrior: '6 to 8 Reps' primary, '8 to 12 Reps' secondary; bilateral/unilateral % of lower compound sets: block start 50/50 -> end 40/60, in season -; contra / ipsi: cross-pattern pairing (UNI-06); contra / ipsi variety (04 weekend warrior)
- season: no season for recreational activities (COACH-ANSWER GEN-02); the gen-pop year applies and is fully user-tunable - re-order blocks, more / less cardio, e.g. a winter strength block (COACH-R2 PER-01/02)
- Olympic lifts: everyone in athletic training gets Olympic lifts (COACH-ANSWER ATH-10); the 'stay athletic and active' goal maps to the athletic family (generator_spec F07 'act; 60+: none by default; offered as an option with the warning to work with a fitness professional (COACH-R2 ATH-08); older / injured / high-volume clients never get snatch variants (EQ-03)
- injuries: HAMSTRING, ANKLE_SPRAIN, ACHILLES_CALF, ACL_LANDING_CUTTING, PAIN_GENERAL
- sample week (training block): Mon - S1 (jump + knee + pull; clean day): warm-up 5 min any cardio + A-drills / mobility (ORD-08, not volume) -> core 2 exercises x 2 sets, light, short of fail / Wed - S2 (medball + hip + push; snatch day): warm-up 5 min any cardio + A-drills / mobility (ORD-08, not volume) -> core 2 exercises x 2 sets, light, short of f / Fri - S3 (Olympic + strength): warm-up 5 min any cardio + A-drills / mobility (ORD-08, not volume) -> core 2 exercises x 2 sets, light, short of failure (R2-SES / game day (enter play_days): no heavy lower-body day in the 48 h before it / Sat - optional: Focus 1 / Focus 2, calves, core or an aerobic session (ORD-10)
- open: Should a weekly league game replace one aerobic session?
- **v1.2 (round 3):** stay athletic and active (COACH-R3 ATH-05, approved): play days entered by the user - the hardest gym day sits at least 48 h before the biggest play day (COACH-R3 ATH-05); weeks with 3+ play sessions drop the extra agility drills and half the jumps (COACH-R3 ATH-05); a 45-60+ minute session of the activity counts as one of the 3 cardio sessions (up to 2) (COACH-R3 ATH-05); optional event date: the hardest weeks end 1 week before, then 1 easy week at about half the sets (COACH-R3 ATH-05); no date -> the normal stairway or the gen-pop year

#### Kickball - adult rec league (`rec_kickball`)

- ES: Kickball - liga recreativa de adultos | category: recreational | sport: kickball
- origin: sports/genpop-active.json (new), base `weekend_warrior`; family field_court; ath03 health; evidence: PROPOSED (analyst) on COACH rules; activity demands SCIENCE (cited)
- why: Kickball is one of the league sports the intake lists (F11r rec_league). It plays like softball (planted kicking and throwing + short base sprints), so it uses the diamond class (40 %) and the weekend-warrior structure. No peer-reviewed kickball injury data were found; injury hotspots are INFERRED from softball / soccer analogs.
- template: 05 v1.1 generator_split_templates.athletic['3'] (Athletic Performance - Non-Competitive, cross pattern, 60 min) with this activity's athletic stations
- numbers: 3 main + 1 optional days; 103 sets / week (20 athletic); contact class 4 (40 % plyometric at block end, 25 % at start); aerobic 3 / pre - / in - (gym_plan_or_activity)
- athletic dose / week: plyometric contacts 8-12; all jump contacts 22-30; throws 34-46 (T1); COD cuts 12-16 (MOD. TURN); sprint m 102-138; Olympic sets 4-8
- resistance: goal power (sprint start, kick, throw) / strength; emphasis hypertrophy 40; strength 40; power 20; rep zone VOL 1 -> VOL 2; bilateral/unilateral % of lower compound sets: block start 40/60 -> end 30/70, in season -; contra / ipsi: ipsilateral step-ups for the base-running start (COACH-ANSWER CAT-13: ipsilateral for acceleration); contralateral lunges for fielding cuts (INFERRED)
- season: no season for recreational activities (COACH-ANSWER GEN-02); the gen-pop year applies and is fully user-tunable - re-order blocks, more / less cardio, e.g. a winter strength block (COACH-R2 PER-01/02)
- Olympic lifts: everyone in athletic training gets Olympic lifts (COACH-ANSWER ATH-10); the 'stay athletic and active' goal maps to the athletic family (generator_spec F07 'act; 60+: none by default; offered as an option with the warning to work with a fitness professional (COACH-R2 ATH-08); older / injured / high-volume clients never get snatch variants (EQ-03)
- injuries: HAMSTRING, HIP_FLEXOR, GROIN_ADDUCTOR, ANKLE_SPRAIN, SHOULDER_THROWER, PAIN_GENERAL
- sample week (training block): Mon - S1 (jump + knee + pull; clean day): warm-up 5 min any cardio + A-drills / mobility (ORD-08, not volume) -> core 2 exercises x 2 sets, light, short of fail / Wed - S2 (medball + hip + push; snatch day): warm-up 5 min any cardio + A-drills / mobility (ORD-08, not volume) -> core 2 exercises x 2 sets, light, short of f / Fri - S3 (Olympic + strength): warm-up 5 min any cardio + A-drills / mobility (ORD-08, not volume) -> core 2 exercises x 2 sets, light, short of failure (R2-SES / game night (enter play_days): the heavy lower-body day sits >= 48 h before it / Sat - optional: Focus 1 / Focus 2, calves, core or an aerobic session (ORD-10)
- open: Kickball at the softball share (40 %) or the weekend-warrior share (50 %)?
- **v1.2 (round 3):** stay athletic and active (COACH-R3 ATH-05, approved): play days entered by the user - the hardest gym day sits at least 48 h before the biggest play day (COACH-R3 ATH-05); weeks with 3+ play sessions drop the extra agility drills and half the jumps (COACH-R3 ATH-05); a 45-60+ minute session of the activity counts as one of the 3 cardio sessions (up to 2) (COACH-R3 ATH-05); optional event date: the hardest weeks end 1 week before, then 1 easy week at about half the sets (COACH-R3 ATH-05); no date -> the normal stairway or the gen-pop year | recreational players use their activity's share (COACH-R3 ATH-04): kickball 40 % (class 4, PROPOSED - kickball not named)

#### Running for fitness (first 5K / 10K, run club) (`run_fitness`)

- ES: Correr por salud (primer 5K / 10K, club de corredores) | category: recreational | sport: distance_running | aliases: rec_running
- origin: sports/genpop-active.json (new), base `distance_runner`; family endurance; ath03 health; evidence: PROPOSED (analyst) on COACH rules; activity demands SCIENCE (cited)
- why: Running is one of the most popular US activities (over 50 million). New runners get hurt more per hour than experienced ones (G13), so the gym part builds strength, calves / Achilles and reactive stiffness while the runs climb gently. The coach's own endurance plan is the Chris Hinshaw half marathon, used as-is (PRG-12).
- template: 05 v1.1 generator_split_templates.athletic['2'] (Athletic Performance - Non-Competitive, cross pattern, 60 min) with this activity's athletic stations
- numbers: 2 main + 0 optional days; 61 sets / week (10 athletic); contact class 1 (75 % plyometric at block end, 60 % at start); aerobic 3 / pre - / in - (gym_plan_or_activity)
- athletic dose / week: plyometric contacts 8-12; all jump contacts 22-30; throws 0 (T0); COD cuts 0 (-); sprint m 0; Olympic sets 0-4
- resistance: goal strength / power (reactive stiffness); emphasis hypertrophy 15; strength 55; power 30; rep zone STRENGTH 3-6 reps on the main lower lifts for L2+ (04 distance runner); 8-12 for L1; calves 12-20; bilateral/unilateral % of lower compound sets: block start 20/80 -> end 20/80, in season -; contra / ipsi: ipsilateral step-ups for push-off (04 distance runner; COACH-ANSWER CAT-13 acceleration logic)
- season: no season for recreational activities (COACH-ANSWER GEN-02); the gen-pop year applies and is fully user-tunable - re-order blocks, more / less cardio, e.g. a winter strength block (COACH-R2 PER-01/02)
- Olympic lifts: everyone in athletic training gets Olympic lifts (COACH-ANSWER ATH-10); the 'stay athletic and active' goal maps to the athletic family (generator_spec F07 'act; 60+: none by default; offered as an option with the warning to work with a fitness professional (COACH-R2 ATH-08); older / injured / high-volume clients never get snatch variants (EQ-03)
- injuries: RUNNING_OVERUSE, ACHILLES_CALF, BONE_STRESS, HAMSTRING, PAIN_GENERAL, PATELLOFEMORAL_ITB
- sample week (training block): Mon - A (squat + pull; clean day): warm-up 5 min any cardio + A-drills / mobility (ORD-08, not volume) -> core 2 exercises x 2 sets, light, short of failure (R2 / Thu - B (deadlift + push; snatch day): warm-up 5 min any cardio + A-drills / mobility (ORD-08, not volume) -> core 2 exercises x 2 sets, light, short of failure / Tue - run 1 (Orange easy, + 4-6 strides) / Thu - run 2 (Green repeats or Blue hills for L2+; beginners run / walk) / Sat - run 3 (Orange, the longer run) / Wed / Fri / Sun - off (gym days Mon / Thu can swap with run days; keep the hard run >= 48 h after the heavy leg day) / no optional day by default
- merge: rec_running (sports/aquatic-endurance-track.json) folded in: same activity; this record keeps the genpop numbers and the F11r id; injury codes added ['PATELLOFEMORAL_ITB']; the sibling used the weekend-warrior class 3 (50 %) - v1.1 uses the activity class (merge decision M-REC-CLASS)
- open: Runners: 2 gym days + 3 runs, the runs counting as the 3 aerobic sessions? recreational running = weekend-warrior profile + sport tag (may duplicate genpop-active.json; the merge keeps one)
- **v1.2 (round 3):** stay athletic and active (COACH-R3 ATH-05, approved): play days entered by the user - the hardest gym day sits at least 48 h before the biggest play day (COACH-R3 ATH-05); weeks with 3+ play sessions drop the extra agility drills and half the jumps (COACH-R3 ATH-05); a 45-60+ minute session of the activity counts as one of the 3 cardio sessions (up to 2) (COACH-R3 ATH-05); optional event date: the hardest weeks end 1 week before, then 1 easy week at about half the sets (COACH-R3 ATH-05); no date -> the normal stairway or the gen-pop year

#### Hiking and rucking (`hike_ruck`)

- ES: Senderismo y rucking (caminata con mochila con peso) | category: recreational | sport: hiking
- origin: sports/genpop-active.json (new), base `weekend_warrior`; family endurance; ath03 health; evidence: PROPOSED (analyst) on COACH rules; activity demands SCIENCE (cited)
- why: Hiking keeps growing and rucking (walking with a loaded pack) is a popular way to stay fit. The plan builds climbing and braking legs, carries and a back that holds a pack, with a gentle load progression.
- template: 05 v1.1 generator_split_templates.athletic['3'] (Athletic Performance - Non-Competitive, cross pattern, 60 min) with this activity's athletic stations
- numbers: 3 main + 1 optional days; 101 sets / week (14 athletic); contact class 5 (25 % plyometric at block end, 10 % at start); aerobic 3 / pre - / in - (gym_plan_or_activity)
- athletic dose / week: plyometric contacts 0; all jump contacts 17-23; throws 17-23 (T1); COD cuts 12-16 (EASY TURN); sprint m 0; Olympic sets 2-6
- resistance: goal endurance-strength / strength; emphasis hypertrophy 20; strength 45; power 10; endurance_strength 25; rep zone VOL 1 -> VOL 2 + slow eccentrics on step-downs and split squats; bilateral/unilateral % of lower compound sets: block start 40/60 -> end 30/70, in season -; contra / ipsi: ipsilateral step-ups (drive up the hill - CAT-13 acceleration logic, INFERRED); contralateral lunges as health accessories
- season: no season for recreational activities (COACH-ANSWER GEN-02); the gen-pop year applies and is fully user-tunable - re-order blocks, more / less cardio, e.g. a winter strength block (COACH-R2 PER-01/02)
- Olympic lifts: everyone in athletic training gets Olympic lifts (COACH-ANSWER ATH-10); the 'stay athletic and active' goal maps to the athletic family (generator_spec F07 'act; 60+: none by default; offered as an option with the warning to work with a fitness professional (COACH-R2 ATH-08); older / injured / high-volume clients never get snatch variants (EQ-03)
- injuries: ANKLE_SPRAIN, KNEE_DESCENT_ECCENTRIC, LOW_BACK_LOADING, ACHILLES_CALF, PAIN_GENERAL
- sample week (training block): Mon - S1 (jump + knee + pull; clean day): warm-up 5 min any cardio + A-drills / mobility (ORD-08, not volume) -> core 2 exercises x 2 sets, light, short of fail / Wed - S2 (medball + hip + push; snatch day): warm-up 5 min any cardio + A-drills / mobility (ORD-08, not volume) -> core 2 exercises x 2 sets, light, short of f / Fri - S3 (Olympic + strength): warm-up 5 min any cardio + A-drills / mobility (ORD-08, not volume) -> core 2 exercises x 2 sets, light, short of failure (R2-SES / Sat or Sun - the hike or ruck (Orange) / Tue or Thu - incline treadmill / stair intervals (Green) / Sat - optional: Focus 1 / Focus 2, calves, core or an aerobic session (ORD-10)
- open: Hikers / ruckers: the weekly hike or ruck counts as the Orange session?
- **v1.2 (round 3):** stay athletic and active (COACH-R3 ATH-05, approved): play days entered by the user - the hardest gym day sits at least 48 h before the biggest play day (COACH-R3 ATH-05); weeks with 3+ play sessions drop the extra agility drills and half the jumps (COACH-R3 ATH-05); a 45-60+ minute session of the activity counts as one of the 3 cardio sessions (up to 2) (COACH-R3 ATH-05); optional event date: the hardest weeks end 1 week before, then 1 easy week at about half the sets (COACH-R3 ATH-05); no date -> the normal stairway or the gen-pop year

#### Cycling and indoor cycling for fitness (`cycling_fitness`)

- ES: Ciclismo y ciclismo indoor (spinning) por salud | category: recreational | sport: cycling | aliases: rec_cycling
- origin: sports/genpop-active.json (new), base `weekend_warrior`; family endurance; ath03 health; evidence: PROPOSED (analyst) on COACH rules; activity demands SCIENCE (cited)
- why: Cyclists get great aerobic work but little impact and a flexed posture. The gym part adds heavy legs, posture work and jumps for bone, and the first indoor classes are eased into (rhabdomyolysis case reports).
- template: 05 v1.1 generator_split_templates.athletic['2'] (Athletic Performance - Non-Competitive, cross pattern, 60 min) with this activity's athletic stations
- numbers: 2 main + 0 optional days; 65 sets / week (12 athletic); contact class 4 (40 % plyometric at block end, 25 % at start); aerobic 3 / pre - / in - (gym_plan_or_activity)
- athletic dose / week: plyometric contacts 7-9; all jump contacts 31-41; throws 17-23 (T1); COD cuts 0 (-); sprint m 0; Olympic sets 0-4
- resistance: goal strength / power; emphasis hypertrophy 20; strength 55; power 25; rep zone STRENGTH 4-6 reps on squat / leg press and hinge for L2+; 8-12 L1; bilateral/unilateral % of lower compound sets: block start 50/50 -> end 40/60, in season -; contra / ipsi: contra / ipsi as health accessories (CAT-13 size-strength logic, INFERRED)
- season: no season for recreational activities (COACH-ANSWER GEN-02); the gen-pop year applies and is fully user-tunable - re-order blocks, more / less cardio, e.g. a winter strength block (COACH-R2 PER-01/02)
- Olympic lifts: everyone in athletic training gets Olympic lifts (COACH-ANSWER ATH-10); the 'stay athletic and active' goal maps to the athletic family (generator_spec F07 'act; 60+: none by default; offered as an option with the warning to work with a fitness professional (COACH-R2 ATH-08); older / injured / high-volume clients never get snatch variants (EQ-03)
- injuries: CYCLING_POSTURE, BONE_LOW_IMPACT, NEW_CLASS_EASE_IN, WRIST_HAND, PAIN_GENERAL, LOW_BACK_LOADING, PATELLOFEMORAL_ITB, NECK, BONE_LOADING_NON_IMPACT
- sample week (training block): Mon - A (squat + pull; clean day): warm-up 5 min any cardio + A-drills / mobility (ORD-08, not volume) -> core 2 exercises x 2 sets, light, short of failure (R2 / Thu - B (deadlift + push; snatch day): warm-up 5 min any cardio + A-drills / mobility (ORD-08, not volume) -> core 2 exercises x 2 sets, light, short of failure / Tue - ride 1 (Blue intervals or a class) / Sat - ride 2 (Orange long ride) / Thu or Sun - ride 3 (Green climbs) / no optional day by default
- merge: rec_cycling (sports/aquatic-endurance-track.json) folded in: same activity; this record keeps the genpop numbers and the F11r id; injury codes added ['LOW_BACK_LOADING', 'PATELLOFEMORAL_ITB', 'NECK', 'BONE_LOADING_NON_IMPACT']; the sibling used the weekend-warrior class 3 (50 %) - v1.1 uses the activity class (merge decision M-REC-CLASS)
- open: Cyclists: keep jumps for bone (box / squat jumps, ankle hops) even though the sport has no ground contact? Optional 2-3-min 'impact snack' on ride days (BONE_LOW_IMPACT)? recreational cycling = weekend-warrior profile + sport tag (may duplicate genpop-active.json; the merge keeps one)
- **v1.2 (round 3):** stay athletic and active (COACH-R3 ATH-05, approved): play days entered by the user - the hardest gym day sits at least 48 h before the biggest play day (COACH-R3 ATH-05); weeks with 3+ play sessions drop the extra agility drills and half the jumps (COACH-R3 ATH-05); a 45-60+ minute session of the activity counts as one of the 3 cardio sessions (up to 2) (COACH-R3 ATH-05); optional event date: the hardest weeks end 1 week before, then 1 easy week at about half the sets (COACH-R3 ATH-05); no date -> the normal stairway or the gen-pop year

#### Lap swimming for fitness (incl. masters-style workouts) (`lap_swim`)

- ES: Natación por salud (nado de piscina, incluye entrenamientos tipo master) | category: recreational | sport: swimming | aliases: rec_swimming
- origin: sports/genpop-active.json (new), base `weekend_warrior`; family endurance; ath03 health; evidence: PROPOSED (analyst) on COACH rules; activity demands SCIENCE (cited)
- why: The coach asked to include swimming. Competitive swimming is in sports/aquatic-endurance-track.json; this is the gen-pop lap swimmer: the pool gives the aerobic work, the gym protects the shoulders, builds the pull and adds impact for bone.
- template: 05 v1.1 generator_split_templates.athletic['2'] (Athletic Performance - Non-Competitive, cross pattern, 60 min) with this activity's athletic stations
- numbers: 2 main + 0 optional days; 65 sets / week (12 athletic); contact class 5 (25 % plyometric at block end, 10 % at start); aerobic 3 / pre - / in - (gym_plan_or_activity)
- athletic dose / week: plyometric contacts 3-5; all jump contacts 22-30; throws 34-46 (T1); COD cuts 0 (-); sprint m 0; Olympic sets 0-4
- resistance: goal strength / power (push-off, pull); emphasis hypertrophy 25; strength 50; power 25; rep zone VOL 1 -> VOL 2; shoulder external-rotation work 12-20; bilateral/unilateral % of lower compound sets: block start 50/50 -> end 40/60, in season -; contra / ipsi: contra / ipsi as health accessories (INFERRED)
- season: no season for recreational activities (COACH-ANSWER GEN-02); the gen-pop year applies and is fully user-tunable - re-order blocks, more / less cardio, e.g. a winter strength block (COACH-R2 PER-01/02)
- Olympic lifts: everyone in athletic training gets Olympic lifts (COACH-ANSWER ATH-10); the 'stay athletic and active' goal maps to the athletic family (generator_spec F07 'act; 60+: none by default; offered as an option with the warning to work with a fitness professional (COACH-R2 ATH-08); older / injured / high-volume clients never get snatch variants (EQ-03)
- injuries: SHOULDER_SWIMMER_PADDLER, BONE_LOW_IMPACT, NECK, PAIN_GENERAL, SHOULDER_SWIMMER, BONE_LOADING_NON_IMPACT, KNEE_MEDIAL_KICK
- sample week (training block): Mon - A (squat + pull; clean day): warm-up 5 min any cardio + A-drills / mobility (ORD-08, not volume) -> core 2 exercises x 2 sets, light, short of failure (R2 / Thu - B (deadlift + push; snatch day): warm-up 5 min any cardio + A-drills / mobility (ORD-08, not volume) -> core 2 exercises x 2 sets, light, short of failure / Tue - swim 1 (Green repeats) / Thu or Sat - swim 2 (Orange continuous) / Sun - swim 3 (Blue sprints + easy) - optional / no optional day by default
- merge: rec_swimming (sports/aquatic-endurance-track.json) folded in: same activity; this record keeps the genpop numbers and the F11r id; injury codes added ['SHOULDER_SWIMMER', 'BONE_LOADING_NON_IMPACT', 'KNEE_MEDIAL_KICK']; the sibling used the weekend-warrior class 3 (50 %) - v1.1 uses the activity class (merge decision M-REC-CLASS)
- open: Lap swimmers: 2 gym days, swims count as the aerobic sessions, jumps kept for bone? recreational swimming = weekend-warrior profile + sport tag (may duplicate genpop-active.json; the merge keeps one)
- **v1.2 (round 3):** stay athletic and active (COACH-R3 ATH-05, approved): play days entered by the user - the hardest gym day sits at least 48 h before the biggest play day (COACH-R3 ATH-05); weeks with 3+ play sessions drop the extra agility drills and half the jumps (COACH-R3 ATH-05); a 45-60+ minute session of the activity counts as one of the 3 cardio sessions (up to 2) (COACH-R3 ATH-05); optional event date: the hardest weeks end 1 week before, then 1 easy week at about half the sets (COACH-R3 ATH-05); no date -> the normal stairway or the gen-pop year

#### Ski / snowboard season prep (`ski_snow_prep`)

- ES: Preparación para la temporada de esquí / snowboard | category: recreational | sport: ski_snowboard | aliases: rec_ski_snowboard
- origin: sports/genpop-active.json (new), base `weekend_warrior`; family field_court; ath03 health; evidence: PROPOSED (analyst) on COACH rules; activity demands SCIENCE (cited)
- why: Skiers and snowboarders ski a few weeks a year and get hurt when their legs fatigue. Prep builds eccentric / isometric quads, lateral strength, landing control and Green-interval fitness, peaks before the first trip and holds through the season.
- template: 05 v1.1 generator_split_templates.athletic['3'] (Athletic Performance - Non-Competitive, cross pattern, 60 min) with this activity's athletic stations
- numbers: 3 main + 1 optional days; 103 sets / week (20 athletic); contact class 4 (40 % plyometric at block end, 25 % at start); aerobic 3 / pre - / in - (gym_plan_or_activity)
- athletic dose / week: plyometric contacts 7-9; all jump contacts 31-41; throws 17-23 (T1); COD cuts 24-32 (MOD. TURN (HARD TURN for L2+)); sprint m 0; Olympic sets 4-8
- resistance: goal strength (eccentric / isometric legs) / power; emphasis hypertrophy 25; strength 50; power 25; rep zone VOL 1 -> VOL 2 + slow eccentrics (3 s) and isometric squat holds 30-60 s for the quads; bilateral/unilateral % of lower compound sets: block start 40/60 -> end 30/70, in season -; contra / ipsi: contralateral lunges (getting into the hip edge to edge - CAT-13 COD logic, INFERRED); ipsilateral step-ups as variety
- season: no season for recreational activities (COACH-ANSWER GEN-02); the gen-pop year applies and is fully user-tunable - re-order blocks, more / less cardio, e.g. a winter strength block (COACH-R2 PER-01/02)
- Olympic lifts: everyone in athletic training gets Olympic lifts (COACH-ANSWER ATH-10); the 'stay athletic and active' goal maps to the athletic family (generator_spec F07 'act; 60+: none by default; offered as an option with the warning to work with a fitness professional (COACH-R2 ATH-08); older / injured / high-volume clients never get snatch variants (EQ-03)
- injuries: ACL_LANDING_CUTTING, KNEE_DESCENT_ECCENTRIC, WRIST_HAND, PAIN_GENERAL, FALL_UPPER_LIMB, PATELLAR_TENDON
- sample week (training block): Mon - S1 (jump + knee + pull; clean day): warm-up 5 min any cardio + A-drills / mobility (ORD-08, not volume) -> core 2 exercises x 2 sets, light, short of fail / Wed - S2 (medball + hip + push; snatch day): warm-up 5 min any cardio + A-drills / mobility (ORD-08, not volume) -> core 2 exercises x 2 sets, light, short of f / Fri - S3 (Olympic + strength): warm-up 5 min any cardio + A-drills / mobility (ORD-08, not volume) -> core 2 exercises x 2 sets, light, short of failure (R2-SES / Tue / Thu - aerobic (Green intervals; Orange base) / Sat - optional: Focus 1 / Focus 2, calves, core or an aerobic session (ORD-10)
- merge: rec_ski_snowboard (sports/aquatic-endurance-track.json) folded in: same activity; this record keeps the genpop numbers and the F11r id; injury codes added ['FALL_UPPER_LIMB', 'PATELLAR_TENDON']; the sibling used the weekend-warrior class 3 (50 %) - v1.1 uses the activity class (merge decision M-REC-CLASS)
- open: Ski prep: the first trip is the event date (taper 1 week), then 2 gym days at about 60 % while skiing? recreational skiing / snowboarding = weekend-warrior profile + sport tag (may duplicate genpop-active.json; the merge keeps one)
- **v1.2 (round 3):** stay athletic and active (COACH-R3 ATH-05, approved): play days entered by the user - the hardest gym day sits at least 48 h before the biggest play day (COACH-R3 ATH-05); weeks with 3+ play sessions drop the extra agility drills and half the jumps (COACH-R3 ATH-05); a 45-60+ minute session of the activity counts as one of the 3 cardio sessions (up to 2) (COACH-R3 ATH-05); optional event date: the hardest weeks end 1 week before, then 1 easy week at about half the sets (COACH-R3 ATH-05); no date -> the normal stairway or the gen-pop year

#### Surfing and stand-up paddleboarding (`surf_paddle`)

- ES: Surf y stand-up paddle (SUP) | category: recreational | sport: surfing_paddleboarding
- origin: sports/genpop-active.json (new), base `weekend_warrior`; family endurance; ath03 health; evidence: PROPOSED (analyst) on COACH rules; activity demands SCIENCE (cited)
- why: Surfers spend about half the session paddling and only 4-5 % riding waves; overuse injuries cluster in the shoulder, low back and neck. The gym part builds a strong, healthy pull, a fast pop-up, hips that rotate and a core that holds the board.
- template: 05 v1.1 generator_split_templates.athletic['3'] (Athletic Performance - Non-Competitive, cross pattern, 60 min) with this activity's athletic stations
- numbers: 3 main + 0 optional days; 87.5 sets / week (12 athletic); contact class 5 (25 % plyometric at block end, 10 % at start); aerobic 3 / pre - / in - (gym_plan_or_activity)
- athletic dose / week: plyometric contacts 0; all jump contacts 8-12; throws 34-46 (T1); COD cuts 0 (-); sprint m 0; Olympic sets 2-6
- resistance: goal strength (pulling, upper back) / power (pop-up); emphasis hypertrophy 25; strength 45; power 30; rep zone VOL 1 -> VOL 2; shoulder ER / Y-T 12-20; bilateral/unilateral % of lower compound sets: block start 50/50 -> end 40/60, in season -; contra / ipsi: contralateral lunges for rotation into the hip (CAT-13 logic, INFERRED)
- season: no season for recreational activities (COACH-ANSWER GEN-02); the gen-pop year applies and is fully user-tunable - re-order blocks, more / less cardio, e.g. a winter strength block (COACH-R2 PER-01/02)
- Olympic lifts: everyone in athletic training gets Olympic lifts (COACH-ANSWER ATH-10); the 'stay athletic and active' goal maps to the athletic family (generator_spec F07 'act; 60+: none by default; offered as an option with the warning to work with a fitness professional (COACH-R2 ATH-08); older / injured / high-volume clients never get snatch variants (EQ-03)
- injuries: SHOULDER_SWIMMER_PADDLER, LOW_BACK_LOADING, NECK, BONE_LOW_IMPACT, PAIN_GENERAL
- sample week (training block): Mon - S1 (jump + knee + pull; clean day): warm-up 5 min any cardio + A-drills / mobility (ORD-08, not volume) -> core 2 exercises x 2 sets, light, short of fail / Wed - S2 (medball + hip + push; snatch day): warm-up 5 min any cardio + A-drills / mobility (ORD-08, not volume) -> core 2 exercises x 2 sets, light, short of f / Fri - S3 (Olympic + strength): warm-up 5 min any cardio + A-drills / mobility (ORD-08, not volume) -> core 2 exercises x 2 sets, light, short of failure (R2-SES / water days - surf or SUP sessions (aerobic) / no optional day by default
- open: Surf / SUP: pull : push about 2 : 1 and a plyo push-up 'pop-up' in the throw slot?
- **v1.2 (round 3):** stay athletic and active (COACH-R3 ATH-05, approved): play days entered by the user - the hardest gym day sits at least 48 h before the biggest play day (COACH-R3 ATH-05); weeks with 3+ play sessions drop the extra agility drills and half the jumps (COACH-R3 ATH-05); a 45-60+ minute session of the activity counts as one of the 3 cardio sessions (up to 2) (COACH-R3 ATH-05); optional event date: the hardest weeks end 1 week before, then 1 easy week at about half the sets (COACH-R3 ATH-05); no date -> the normal stairway or the gen-pop year

#### Dance and group fitness classes (Zumba, dance cardio, step) (`dance_fitness`)

- ES: Baile y clases grupales (Zumba, dance cardio, step) | category: recreational | sport: dance_fitness
- origin: sports/genpop-active.json (new), base `weekend_warrior`; family field_court; ath03 health; evidence: PROPOSED (analyst) on COACH rules; activity demands SCIENCE (cited)
- why: Class-goers already move a lot. The gym part adds what classes miss: real strength, single-leg landing control, calves / Achilles and shoulders, plus a light power and agility piece.
- template: 05 v1.1 generator_split_templates.athletic['2'] (Athletic Performance - Non-Competitive, cross pattern, 60 min) with this activity's athletic stations
- numbers: 2 main + 0 optional days; 63 sets / week (12 athletic); contact class 3 (50 % plyometric at block end, 35 % at start); aerobic 3 / pre - / in - (gym_plan_or_activity)
- athletic dose / week: plyometric contacts 7-9; all jump contacts 22-30; throws 17-23 (T1); COD cuts 12-16 (MOD. TURN); sprint m 0; Olympic sets 0-4
- resistance: goal strength / hypertrophy; emphasis hypertrophy 35; strength 45; power 20; rep zone VOL 1 -> VOL 2; bilateral/unilateral % of lower compound sets: block start 50/50 -> end 40/60, in season -; contra / ipsi: contra / ipsi variety (INFERRED)
- season: no season for recreational activities (COACH-ANSWER GEN-02); the gen-pop year applies and is fully user-tunable - re-order blocks, more / less cardio, e.g. a winter strength block (COACH-R2 PER-01/02)
- Olympic lifts: everyone in athletic training gets Olympic lifts (COACH-ANSWER ATH-10); the 'stay athletic and active' goal maps to the athletic family (generator_spec F07 'act; 60+: none by default; offered as an option with the warning to work with a fitness professional (COACH-R2 ATH-08); older / injured / high-volume clients never get snatch variants (EQ-03)
- injuries: ACL_LANDING_CUTTING, PATELLAR_TENDON, ANKLE_SPRAIN, ACHILLES_CALF, NEW_CLASS_EASE_IN, PAIN_GENERAL
- sample week (training block): Mon - A (squat + pull; clean day): warm-up 5 min any cardio + A-drills / mobility (ORD-08, not volume) -> core 2 exercises x 2 sets, light, short of failure (R2 / Thu - B (deadlift + push; snatch day): warm-up 5 min any cardio + A-drills / mobility (ORD-08, not volume) -> core 2 exercises x 2 sets, light, short of failure / Tue / Thu / Sat - classes (aerobic) / no optional day by default
- open: Classes count as the aerobic sessions (one per class, by colour)?
- **v1.2 (round 3):** stay athletic and active (COACH-R3 ATH-05, approved): play days entered by the user - the hardest gym day sits at least 48 h before the biggest play day (COACH-R3 ATH-05); weeks with 3+ play sessions drop the extra agility drills and half the jumps (COACH-R3 ATH-05); a 45-60+ minute session of the activity counts as one of the 3 cardio sessions (up to 2) (COACH-R3 ATH-05); optional event date: the hardest weeks end 1 week before, then 1 easy week at about half the sets (COACH-R3 ATH-05); no date -> the normal stairway or the gen-pop year

#### Active aging 50-59 (stay athletic) (`active_aging_50plus`)

- ES: Envejecimiento activo 50-59 (mantenerse atlético) | category: recreational | sport: general_athletic
- origin: sports/genpop-active.json (new), base `weekend_warrior`; family field_court; ath03 health; evidence: PROPOSED (analyst) on COACH rules; activity demands SCIENCE (cited)
- why: Many players of pickleball, tennis, golf and hiking are in their 50s. The coach's older-client rules start at 60 (COACH-R2 ATH-08), so 50-59 keeps the adult athletic plan, with tendon, landing and bone emphases (INFERRED) and the coach's age-agnostic rules (no sex rules - ATH-09).
- template: 05 v1.1 generator_split_templates.athletic['3'] (Athletic Performance - Non-Competitive, cross pattern, 60 min) with this activity's athletic stations
- numbers: 3 main + 1 optional days; 97 sets / week (14 athletic); contact class 3 (50 % plyometric at block end, 35 % at start); aerobic 3 / pre - / in - (gym_plan_or_activity)
- athletic dose / week: plyometric contacts 7-9; all jump contacts 22-30; throws 17-23 (T1); COD cuts 12-16 (MOD. TURN); sprint m 0; Olympic sets 2-6
- resistance: goal strength / power; emphasis hypertrophy 35; strength 45; power 20; rep zone VOL 1 -> VOL 2; calves slow and heavy; bilateral/unilateral % of lower compound sets: block start 50/50 -> end 40/60, in season -; contra / ipsi: cross-pattern pairing (UNI-06); contra / ipsi variety
- season: no season for recreational activities (COACH-ANSWER GEN-02); the gen-pop year applies and is fully user-tunable - re-order blocks, more / less cardio, e.g. a winter strength block (COACH-R2 PER-01/02)
- Olympic lifts: everyone in athletic training gets Olympic lifts (COACH-ANSWER ATH-10); the 'stay athletic and active' goal maps to the athletic family (generator_spec F07 'act; 60+: none by default; offered as an option with the warning to work with a fitness professional (COACH-R2 ATH-08); older / injured / high-volume clients never get snatch variants (EQ-03)
- injuries: ACHILLES_CALF, ANKLE_SPRAIN, PATELLAR_TENDON, LOW_BACK_LOADING, PAIN_GENERAL
- sample week (training block): Mon - S1 (jump + knee + pull; clean day): warm-up 5 min any cardio + A-drills / mobility (ORD-08, not volume) -> core 2 exercises x 2 sets, light, short of fail / Wed - S2 (medball + hip + push; snatch day): warm-up 5 min any cardio + A-drills / mobility (ORD-08, not volume) -> core 2 exercises x 2 sets, light, short of f / Fri - S3 (Olympic + strength): warm-up 5 min any cardio + A-drills / mobility (ORD-08, not volume) -> core 2 exercises x 2 sets, light, short of failure (R2-SES / Tue / Thu / Sat - the user's activity or aerobic sessions / Sat - optional: Focus 1 / Focus 2, calves, core or an aerobic session (ORD-10)
- open: 50-59: keep the full adult athletic plan (jumps, Olympic lifts) with extra calf / landing care?
- **v1.2 (round 3):** stay athletic and active (COACH-R3 ATH-05, approved): play days entered by the user - the hardest gym day sits at least 48 h before the biggest play day (COACH-R3 ATH-05); weeks with 3+ play sessions drop the extra agility drills and half the jumps (COACH-R3 ATH-05); a 45-60+ minute session of the activity counts as one of the 3 cardio sessions (up to 2) (COACH-R3 ATH-05); optional event date: the hardest weeks end 1 week before, then 1 easy week at about half the sets (COACH-R3 ATH-05); no date -> the normal stairway or the gen-pop year | when the activity is pickleball, padel or tennis the approved racket 50+ rules apply (COACH-R3 ATH-02); the generic 50-59 question stays open (Q12-6)

#### Active aging 60+ (stay athletic, older-adult rules) (`active_aging_60plus`)

- ES: Envejecimiento activo 60+ (mantenerse atlético, reglas para adultos mayores) | category: recreational | sport: general_athletic
- origin: sports/genpop-active.json (new), base `general_population`; family field_court; ath03 health; evidence: PROPOSED (analyst) on COACH rules; activity demands SCIENCE (cited)
- why: The coach: older adults 'are not going to need ... Olympic lifting, plyos, depth jumps', but it should be 'an additional option if they want to do it', with a warning to work with a fitness professional (COACH-R2 ATH-08). The 'stay athletic' parts that remain by default are landing drills (step-down and stick), light throws, reactive stepping, fast-concentric machine work and balance - plus aerobic work and a strength stairway with small steps.
- template: 05 v1.1 generator_split_templates.athletic['3'] (Athletic Performance - Non-Competitive, cross pattern, 60 min) with this activity's athletic stations
- numbers: 3 main + 1 optional days; 89 sets / week (6 athletic); contact class - (- % plyometric at block end, - % at start); aerobic 3 / pre - / in - (gym_plan_or_activity)
- athletic dose / week: plyometric contacts 0; all jump contacts 14-18; throws 17-23 (T1); COD cuts 12-16 (EASY TURN (MOD. TURN when steady)); sprint m 0; Olympic sets 0
- resistance: goal strength / power (fast concentric); emphasis hypertrophy 40; strength 40; power 20; rep zone 10-15 for beginners, then 6-12 (NSCA, G28); power sets at 40-60 % of 1RM moved fast (G28); calves 12-20; bilateral/unilateral % of lower compound sets: block start 50/50 -> end 50/50, in season -; contra / ipsi: cross-pattern pairing, less soreness (UNI-06); contralateral lunges as the default variant (04 general population)
- season: no season for recreational activities (COACH-ANSWER GEN-02); the gen-pop year applies and is fully user-tunable - re-order blocks, more / less cardio, e.g. a winter strength block (COACH-R2 PER-01/02)
- Olympic lifts: everyone in athletic training gets Olympic lifts (COACH-ANSWER ATH-10); the 'stay athletic and active' goal maps to the athletic family (generator_spec F07 'act; 60+: none by default; offered as an option with the warning 'Make sure that you have a fitness professional to help you understand what this means.' (COACH-R2 ATH-08)
- injuries: FALLS_BONE_DENSITY, DECONDITIONED_JOINTS, ACHILLES_CALF, WRIST_HAND, PAIN_GENERAL
- sample week (training block): Mon - S1 (jump + knee + pull; clean day): warm-up 5 min any cardio + A-drills / mobility (ORD-08, not volume) -> core 2 exercises x 2 sets, light, short of fail / Wed - S2 (medball + hip + push; snatch day): warm-up 5 min any cardio + A-drills / mobility (ORD-08, not volume) -> core 2 exercises x 2 sets, light, short of f / Fri - S3 (fast machine power + strength; Olympic lifts only if switched on): warm-up 5 min any cardio + A-drills / mobility (ORD-08, not volume) -> core 2 exercises x 2 sets, light, short of failure (R2-SES / Tue / Thu / Sat - the user's activity or aerobic sessions (Orange / Green first) / Sat - optional: Focus 1 / Focus 2, calves, core or an aerobic session (ORD-10)
- **v1.2 (round 3):** COACH-R3 ATH-02 (approved): from 60 the defaults ON are landing drills (step down and stick, no bounce), balance, quick stepping without a hop, light medball throws and fast machine work; low ankle hops, other jumps, Olympic lifts and depth jumps are OFF and can be switched on with the warning 'Make sure that you have a fitness professional to help you understand what this means'; overhead squats and low-bar squats stay out (snatch variants stay out too - COACH-ANSWER EQ-03, not revisited) | the plan can also be edited by the user or coach: switch off a day's athletic or core block, add or remove exercises or blocks; supersets are recommended to save time (COACH-R3 SES-02) | play days, activity cardio credit and an optional event date follow COACH-R3 ATH-05 (see play_adjustment / event_prep) | stay athletic and active (COACH-R3 ATH-05, approved): play days entered by the user - the hardest gym day sits at least 48 h before the biggest play day (COACH-R3 ATH-05); weeks with 3+ play sessions drop the extra agility drills and half the jumps (COACH-R3 ATH-05); a 45-60+ minute session of the activity counts as one of the 3 cardio sessions (up to 2) (COACH-R3 ATH-05); optional event date: the hardest weeks end 1 week before, then 1 easy week at about half the sets (COACH-R3 ATH-05); no date -> the normal stairway or the gen-pop year

#### Youth general athletic development (non-competitive kids and teens) (`youth_general_athletic`)

- ES: Desarrollo atlético general juvenil (niños y adolescentes no competitivos) | category: recreational | sport: general_athletic
- origin: sports/genpop-active.json (new), base `youth_athlete`; family youth; ath03 health; evidence: PROPOSED (analyst) on COACH rules; activity demands SCIENCE (cited)
- why: The coach's non-competitive athletic program is for adults and 'youth can be there too, and kids' (COACH-ANSWER ATH-13). Kids and teens who are not training for a competitive sport get every athletic pattern at foundational levels, landing competency before rebounds, light loads and games-based fitness (04 youth + NSCA LTAD).
- template: 05 v1.1 generator_split_templates.athletic['3'] (Athletic Performance - Non-Competitive, cross pattern, 60 min) with this activity's athletic stations
- numbers: 3 main + 0 optional days; 100.5 sets / week (28 athletic); contact class 3 (50 % plyometric at block end, 35 % at start); aerobic 3 / pre - / in - (gym_plan_or_activity)
- athletic dose / week: plyometric contacts 14-18; all jump contacts 44-60; throws 34-46 (T1); COD cuts 24-32 (MOD. TURN); sprint m 204-276; Olympic sets 2-6
- resistance: goal strength (movement competency) / power; emphasis hypertrophy 30; strength 50; power 20; rep zone technique first, 8-15 reps, bodyweight / light DB (04 youth); bilateral/unilateral % of lower compound sets: block start 50/50 -> end 50/50, in season -; contra / ipsi: both, light (04 youth)
- season: no season for recreational activities (COACH-ANSWER GEN-02); the gen-pop year applies and is fully user-tunable - re-order blocks, more / less cardio, e.g. a winter strength block (COACH-R2 PER-01/02)
- Olympic lifts: everyone in athletic training gets Olympic lifts (COACH-ANSWER ATH-10); the 'stay athletic and active' goal maps to the athletic family (generator_spec F07 'act; 60+: none by default; offered as an option with the warning to work with a fitness professional (COACH-R2 ATH-08); older / injured / high-volume clients never get snatch variants (EQ-03)
- injuries: GROWTH_APOPHYSIS, ACL_LANDING_CUTTING, BONE_STRESS, ANKLE_SPRAIN, PAIN_GENERAL
- sample week (training block): Mon - S1 (jump + knee + pull; clean day): warm-up 5 min any cardio + A-drills / mobility (ORD-08, not volume) -> core 2 exercises x 2 sets, light, short of fail / Wed - S2 (medball + hip + push; snatch day): warm-up 5 min any cardio + A-drills / mobility (ORD-08, not volume) -> core 2 exercises x 2 sets, light, short of f / Fri - S3 (Olympic + strength): warm-up 5 min any cardio + A-drills / mobility (ORD-08, not volume) -> core 2 exercises x 2 sets, light, short of failure (R2-SES / other days - free play, PE or the youth's other sports; at least 2 days a week off organised training (G34) / no optional day
- open: Youth (non-competitive): 3 short sessions with all athletic patterns, floor Olympic lifts from about 14?
- **v1.2 (round 3):** stay athletic and active (COACH-R3 ATH-05, approved): play days entered by the user - the hardest gym day sits at least 48 h before the biggest play day (COACH-R3 ATH-05); weeks with 3+ play sessions drop the extra agility drills and half the jumps (COACH-R3 ATH-05); a 45-60+ minute session of the activity counts as one of the 3 cardio sessions (up to 2) (COACH-R3 ATH-05); optional event date: the hardest weeks end 1 week before, then 1 easy week at about half the sets (COACH-R3 ATH-05); no date -> the normal stairway or the gen-pop year

### 8.8 Goal profiles

#### Hybrid athlete (strength - athletic - 'crossfitish') (`hybrid`)

- ES: Atleta híbrido (fuerza - atlético - estilo CrossFit) | category: goal | goal default for: hybrid
- origin: 04_v1 (04); family crossfit; ath03 health; evidence: OBSERVED ('(NOT DONE) 4 TRACKS PROGRAMMING' HYBRID 8-week, mean of weeks 1-7, assumed sets where blank)
- why: Observed general 'athletic gym' product.
- template: HYBRID-8: Mon squat + clean + 'UNI RDL/ CORE/ UNI GB', Tue sprint + bench/core + jumps, Thu deadlift + snatch + lunge/row/core, Fri easy cardio + jumps + 'uni RDL/ core/ OH press', Sat squat + lunge/T2B/press tri-set; an 'AMRAP' 12 -> 20 row (row 70) is not tied to any day
- numbers: 5 main + 0 optional days; 81.6 sets / week (10.9 athletic); contact class - (- % plyometric at block end, - % at start); aerobic 2 / pre - / in - (gym_plan)
- athletic dose / week: plyometric contacts -; all jump contacts 30-40; throws 0 (T0); COD cuts 0 (-); sprint m 0; Olympic sets 4-8
- resistance: goal - / -; emphasis hypertrophy 30; strength 50; power 20; rep zone 3-week waves REPS 6,8,10 at SETS 2,2,2,3,3,3,4,4; bilateral/unilateral % of lower compound sets: block start - -> end -, in season -; contra / ipsi: -
- season: no season: continuous training blocks on the stairway (COACH-R2 PER-03/04/05); gen-pop year plan optional and fully tunable (COACH-R2 PER-01/02)
- Olympic lifts: everyone in athletic training gets Olympic lifts (COACH-ANSWER ATH-10); 60+: none by default; offered as an option with the warning to work with a fitness professional (COACH-R2 ATH-08); never snatch variants for older / injured / high-volume clients (EQ-03)
- injuries: LOW_BACK_LOADING, SHOULDER_GYMNASTIC, PAIN_GENERAL
- open: What does the 'AMRAP' row 12..20 apply to?

#### Fat loss / body toning (`fat_loss`)

- ES: Pérdida de grasa / tonificación corporal | category: goal | goal default for: fat_loss
- origin: 04_v1 (04); family physique; ath03 health; evidence: OBSERVED (MASTER_MODEL 'EXAMPLE FAT BURNBODY TONING PRO' weeks 1-4 mean incl. circuits; BYOP BOOTCAMP options as variants)
- why: Fat loss = hypertrophy lifting + steady cardio + metabolic circuits (OBSERVED).
- template: FAT BURN: Mon lower, Tue upper, Wed cardio, Thu lower, Fri upper, Sat cardio; 2 'CIRCUITS RECCOMENDED' per week
- numbers: 4 main + 2 optional days; 102.2 sets / week (0 athletic); contact class - (- % plyometric at block end, - % at start); aerobic 3 / pre - / in - (gym_plan)
- athletic dose / week: plyometric contacts -; all jump contacts 0; throws 0 (T0); COD cuts 0 (-); sprint m 0; Olympic sets 0
- resistance: goal - / -; emphasis hypertrophy 85; strength 10; power 5; rep zone compounds 15/12 -> 8-10; isolation 15 -> 20 (the observed 40-rep sets are retired as a default - optional AMRAP style only, COACH-ANSWER VOL-11); bilateral/unilateral % of lower compound sets: block start 50/50 -> end 50/50, in season -; contra / ipsi: cross-pattern pairing so clients are less sore and can train more often (COACH-ANSWER UNI-06)
- season: no season: continuous training blocks on the stairway (COACH-R2 PER-03/04/05); gen-pop year plan optional and fully tunable (COACH-R2 PER-01/02)
- Olympic lifts: no Olympic lifts by default: not an athletic-training profile (COACH-ANSWER ATH-10 covers athletic training); 60+: none by default (COACH-R2 ATH-08)
- injuries: DECONDITIONED_JOINTS, PAIN_GENERAL
- variants: `bootcamp_1` Bootcamp option 1; `bootcamp_2` Bootcamp option 2

#### General population / longevity (`general_population`)

- ES: Población general / longevidad | category: goal | goal default for: general
- origin: 04_v1 (04); family general; ath03 health; evidence: INFERRED from OBSERVED UPPER/LOWER + BOOTCAMP 1 (full-body sessions) + SCIENCE (NSCA older-adult position); v1: COACH-ANSWER ATH-07 (3 aerobic sessions), ATH-09 (older: few plyos unless asked), EQ-03 (constrained machines; never OHS / snatch / low-bar / depth jumps)
- why: Health and longevity: strength + power + balance + aerobic base; athletic patterns only as movement literacy.
- template: BOOTCAMP OPTION 1-style full body (each session = knee + hip, push + pull, bilateral + unilateral)
- numbers: 3 main + 2 optional days; 52 sets / week (4 athletic); contact class - (- % plyometric at block end, - % at start); aerobic 3 / pre - / in - (gym_plan)
- athletic dose / week: plyometric contacts 0; all jump contacts 0; throws 20-40 (T1); COD cuts 0-20 (EASY TURN); sprint m 0; Olympic sets 0-3
- resistance: goal - / -; emphasis hypertrophy 60; strength 25; power 15; rep zone 10-15 beginners, 6-12 later; power at 40-60% 1RM moved fast; bilateral/unilateral % of lower compound sets: block start 50/50 -> end 50/50, in season -; contra / ipsi: cross-pattern pairing, less soreness (UNI-06); contralateral lunges as the default variant (INFERRED)
- season: no season: continuous training blocks on the stairway (COACH-R2 PER-03/04/05); gen-pop year plan optional and fully tunable (COACH-R2 PER-01/02)
- Olympic lifts: no Olympic lifts by default: not an athletic-training profile (COACH-ANSWER ATH-10 covers athletic training); 60+: none by default (COACH-R2 ATH-08)
- injuries: DECONDITIONED_JOINTS, PAIN_GENERAL, FALLS_BONE_DENSITY
- variants: `older_adult` Older adults (age threshold PROPOSED 60+, or foundation / injury based)

## 9. Model sections (v1.1; v1.2 edits marked)

### 9.1 ath03 groups

- **resistance** - more resistance training (strength / size) (COACH-ANSWER ATH-03). v1.1 members: cheer_base_spot, climbing, cycling_sprint, football_dl, football_lineman, football_ol, judo, rugby_backs, rugby_forwards, rugby_sevens, ski_alpine, track_javelin, track_thrower, water_polo_center, weightlifting, wrestling
- **speed_power** - more speed and power (COACH-ANSWER ATH-03). v1.1 members: basketball, basketball_big, basketball_guard, cheer_flyer_tumbler, diving, field_hockey_field, field_hockey_gk, flag_football, football_big_skill, football_k_p, football_rb, football_skill, gymnastics_artistic, hockey, hockey_defense, hockey_goalie, lacrosse_m_attack, lacrosse_m_defense, lacrosse_m_goalie, lacrosse_m_midfield, lacrosse_w_attack, lacrosse_w_defense, lacrosse_w_goalie, lacrosse_w_midfield, ski_freestyle, soccer, soccer_defender, soccer_forward, soccer_gk, swimming_middle, swimming_sprint, track_400, track_high_jump, track_hurdles, track_jumper, track_pole_vault, track_sprinter, ultimate_cutter, ultimate_handler, volleyball, volleyball_beach, volleyball_libero, volleyball_middle, volleyball_setter, water_polo_goalkeeper
- **rotational_power** - rotational power + ballistics (COACH-ANSWER ATH-01 + INFERRED grouping). v1.1 members: baseball_catcher, baseball_infield, baseball_outfield, baseball_pitcher, baseball_position, football_qb, golf, pickleball_competitive, softball, softball_pitcher, tennis, water_polo_field
- **combat** - combat (ballistic-leaning power + conditioning) (COACH-ANSWER ATH-01 / ATH-04 + INFERRED grouping). v1.1 members: bjj_grappling, boxing, karate_taekwondo, kickboxing_muay_thai, mma, taekwondo
- **size_strength** - size / strength (no athletic block) (COACH-ANSWER UNI-02 / ATH-05). v1.1 members: bodybuilding_aesthetics, crossfit_competitor, powerlifting_strength, strongman
- **health** - health / general (COACH-ANSWER ATH-07 / ATH-09 / ATH-13). v1.1 members: active_aging_50plus, active_aging_60plus, crossfit_class, cycling_fitness, dance_fitness, fat_loss, general_population, hike_ruck, hybrid, hyrox_fitness, lap_swim, rec_basketball, rec_climbing, rec_combat_fitness, rec_flag_football, rec_golf, rec_hockey, rec_kickball, rec_league, rec_ocr, rec_padel, rec_pickleball, rec_rowing, rec_soccer, rec_softball, rec_tennis, rec_triathlon, rec_ultimate, rec_volleyball, run_fitness, ski_snow_prep, surf_paddle, weekend_warrior, youth_athlete, youth_general_athletic
- **endurance** - endurance (strength for economy and tissue capacity, not mass) (PROPOSED at v1.1 (aquatic-endurance-track.json O8; combat-strength-fitness.json Q7) - flag F7). v1.1 members: cross_country, cycling_endurance, distance_runner, hyrox_competitive, ocr_spartan, rowing, swimming_distance, track_middle, triathlon

### 9.2 Bilateral : unilateral, contra / ipsi, medball

- bodybuilders / powerlifters: about 50/50 at the start (unilateral as a small health foundation), then 80/20 -> 90/10 bilateral (COACH-ANSWER UNI-02)
- field / change-of-direction athletes (tennis example): 80-90% unilateral in the gym; bilateral = health foundation for connective tissue and joints (COACH-ANSWER UNI-02)
- in-season athletes: bilateral kept minimal (maintain strength and potentiation), unilateral keeps ranges of motion and health (COACH-ANSWER UNI-10)
- pain or injury moves the share (usually toward unilateral / split grips, or to machines) - COACH-ANSWER UNI-02, VOL-03, MASTER_MODEL athletic A6
- **contralateral**: load in the hand opposite the working leg pulls you INTO the hip (eccentric coil); used for change-of-direction athletes who must get in and out of the hip quickly and need the range (football route runners, soccer, basketball 'a lot', tennis 'definitely') - COACH-ANSWER CAT-13
- **ipsilateral**: load on the same side helps you OUT of the hip; used for sprint acceleration (e.g. ipsilateral step-ups for a 100 m sprinter's take-off) - COACH-ANSWER CAT-13
- **size_strength**: bodybuilders / powerlifters: contra/ipsi lunges and step-ups are HEALTH accessories (hips, low back, the rotational forces lost in symmetrical lifting), mostly in the first 2-4 weeks of a program, then mostly bilateral; kept as an accessory later only if something bugs them - COACH-ANSWER CAT-13
- **pairing**: same-pattern pairing (squat + lunge) drives one muscle harder for aesthetics and high-level athletes who need more stimulus; cross-pattern pairing (squat + single-leg RDL) for bootcamp / general clients so they are less sore and can train more often - COACH-ANSWER UNI-06
- **medball by_sport**: high for baseball, boxing, MMA, tennis and golf (rotational); moderate for basketball and football; NONE in the main workout for aesthetics / bodybuilders (warm-up only) - COACH-ANSWER ATH-05
- **medball weights**: passes / rotations 8-10 lb (speed), slams 10-20 lb, overhead throws 6-10 lb, sit-up throws 6-8 lb, lighter for youth and older clients; never more than 20 lb (a heavier ball only for something specific like a heavy med-ball hang clean or wall balls) - COACH-ANSWER EQ-06
- **medball no_ball**: no medball -> plyo push-ups (pressing), fast cable rotations or the 'fake medball slam'; never band chops (COACH-ANSWER EQ-07)
- **medball list**: a 'Throwing' slot can be the whole 'ALL LIST' = one pass of the ~19 throws at 1 x 10 each (~200 throws) - COACH-ANSWER LIB-22

### 9.3 Age, experience, competition level

- **no_sex**: no rule in this document depends on sex: the coach programs by age, foundation (training experience), goal and injuries; 'the rules kind of apply to everybody' (COACH-ANSWER ATH-09; GEN-02 drops sex from the intake)
- **older**: older clients from 60: COACH-R3 ATH-02 (approved): from 60 the defaults ON are landing drills (step down and stick, no bounce), balance, quick stepping without a hop, light medball throws and fast machine work; low ankle hops, other jumps, Olympic lifts and depth jumps are OFF and can be switched on with the warning 'Make sure that you have a fitness professional to help you understand what this means'; overhead squats and low-bar squats stay out (snatch variants stay out too - COACH-ANSWER EQ-03, not revisited); compounds AND isolation lean to constrained machines / cables; machines filed MODERATE / ADVANCED are fine (EQ-04)
- **youth**: youth: foundational lists; floor Olympic lifts from about 14 after one block of hang work (COACH-R2 ATH-08); growth-spurt caps stay INFERRED
- **injured_high_volume**: injured clients and clients carrying high volume collect that volume 'in a safe place with more constraints' (constraint 4-5 machines) - COACH-ANSWER EQ-03
- **experience**: training experience in years (GEN-02 / PRG-05): L1 novice = under about 6-12 months; L2 intermediate = over 1 year consistent; L3 advanced; more than 6-12 months off -> the body is treated as L1 (skills come back fast); ex-pros start at L1 only briefly
- **active_aging_profiles**: active_aging_50plus / active_aging_60plus (genpop-active.json) carry the stay-athletic version; competitive 60+ athletes keep their sport profile with the same defaults (e.g. pickleball_senior_60_plus)
- **level rule**: high school, college and pro athletes need the same things; only loads and speeds change per athlete (COACH-ANSWER PRG-09)
- **level high_school**: 'just have to do a lot of work' - same template, general work capacity and technique (PROPOSED: no separate profile)
- **level college**: 'trying to adapt as much as they can' - full progression (PROPOSED)
- **level pro**: 'a higher level and a little bit more care for their body because of contracts' - PROPOSED: weekly volume increase kept at the low end of the person-based 3/5/7% rate, injury rules applied first, testing optional
- **level baseball_calendars**: the calendars in the sheet are 'just whatever I wrote' - no level-specific season model; Thursday = strength (PRG-09)

### 9.4 Season families

**field_court** - basketball, volleyball, American football, soccer, baseball, softball, hockey, tennis, track sprint (as 'competition' season); v1.1 also lacrosse, field hockey, rugby, cheer / STUNT, ultimate, flag football, beach volleyball, track field events, gymnastics, climbing, pickleball (competitive)

- *off_early_GPP* (INFERRED from OBSERVED boxer wk1-2 base (3x10, zero plyos), MM athletic STARTING notes A41-A45 'Bring athletes back to feeling/moving great'): plyo method stage 1 'receive and pause' (stick the landing) and a BALLISTIC-biased power mix (programs start more ballistic - COACH-ANSWER CAT-10) | bilateral : unilateral at the block-start value; contra / ipsi accessories (CAT-13) | COD 'EASY TURN' only | Olympic L1 variants (DB / KB snatch, hang pulls) - ATH-10 | rep zone VOL 1 (PER-11) | conditioning C + B (build the base)
- *off_build* (OBSERVED BASEBALL Block 1 (the block itself carries no season label; reading it as off/soft season is INFERRED from its 2022 cell dates agai): rep zone VOL 1 -> VOL 2 ('12/10/8/8' pyramids) - PER-11 confirmed for all athletes | plyo method stage 2 'receive then create' | Olympic lifts are STANDARD, not optional (COACH-ANSWER ATH-10): L1 variants or full lifts by level | contrast / complexes for L2+ athletes (ATH-12: off-season only, ~78-85%) | new weekly exercise menu each week in the observed baseball block (BASEBALL B1 menu overlap <= 0.15); the generator default is the coach's block rule instead: exercises fixed for 4-6 weeks, small variables change between blocks (PER-02) | day tags 'Speed' Mon / 'strength' Tue / 'speed' Fri (OBSERVED); Thursday = strength (PRG-09)
- *pre_intensify* (OBSERVED BASEBALL Block 2 (B1 -> B2 deltas); reading Block 2 as 'PRE SEASON' is INFERRED from dates (Jan - early Mar 2023) and the closing '): rep zone VOL 3 and below ('8/6/4/4', '6/6/5/4', '4/4/4/4') | contrast and complexes ('Heavy front squats' + 'KB squat cleans'; '5 of each' x 5 rounds) - L2+ athletes only (ATH-12) (ATH-12 says 'off-season only': v1 treats this pre-season build as the late off-season because the coach's own block 2 uses contrast - INFERRED, open question; never in season) | OBSERVED baseball: Part C/D sets 4 -> 5 for the last 3 weeks | RETIRED as a generator default (COACH-R2 VOL-07: no deload inside a block) - OBSERVED evidence only: final week = DELOAD: resistance -31%, all sets -46%, athletic 1-2 sets, no buy-out, no OLY, 3 x 8 everywhere (B2 'DELOAD WEEK') | COD adds 'MOD. TURN' / 'HARD TURN' and reactive agility (INFERRED) | plyo method stage 3 'repeated receive / create' at the sport's target plyo share (CAT-10) | RETIRED as a generator default (COACH-R2 VOL-07: no deload inside a block) - OBSERVED 
- *in_season* (OBSERVED BASEBALL Block 3 (week labels dated 'March 20 - 26' .. '04/24 to 04/28'; that these dates are 'IN SEASON' is INFERRED by matching t): about 2 lifting days a week, low volume (COACH-ANSWER PER-08) | content by athlete type: speed athletes -> sprints; most others -> strength maintenance; some -> high jumps (COACH-ANSWER PER-08) | bilateral work minimal, unilateral keeps range and health (UNI-10) | 2 aerobic sessions a week (ATH-07) | no contrast (ATH-12) | OBSERVED baseball in-season: main lifts flat 4 x 10 (4 x 8 early), no compound below 8 reps, no Olympic lifts, two alternating proven weekly menus, short buy-outs ('1x 30 Sec Fast Run', '2x 15 cal bike sprint') | INFERRED for jump/run-dominant sports whose games already supply contacts (basketball, volleyball, soccer): PLYO x0.3-0.5, keep 1 max-velocity exposure for hamstring protection
- *post_season_recovery* (OBSERVED recovery-week CONTENT from BASEBALL Block 1 'wk 8' (24 sets: 'Kettlebell arm bars', 'Half kneeling shoulder roll', 'floor windchiel): arm care + mobility + easy colour-C cardio | no athletic work
- v1.1 stairway: every block climbs like a stairway, hardest weeks last (COACH-R2 PER-03/04/05)
- v1.1 no deload inside a block: stop -> maintenance (length chosen) -> new block (COACH-R2 VOL-07, PER-06); the easy week after a block is a recommendation and the user builds the next block (COACH-R3 PER-01)
- v1.1 profiles override: profiles[].season_overrides (built on COACH-R2 PER-06 / ATH-07) replace these family multipliers where both exist
- v1.1 pre season: 4-6 weeks at about 60 % of off-season sets, more speed and power, 1-2-week taper before the first game (COACH-R2 PER-06)
- v1.1 in season: about 2 lifting days; game-heavy sports: plyos x0.5, no extra COD, sprints only for speed athletes, hard day >= 48 h before a game (COACH-R2 ATH-07)

**combat** - boxing, kickboxing/Muay Thai, karate/taekwondo, MMA, wrestling, BJJ; v1.1 also judo, taekwondo

- *base_GPP* (OBSERVED 'EXAMPLE BOXING 8 WEEK BUILD UP' weeks 1-2 (yellow FFFF00)): upper/lower split Mon/Thu legs, Tue/Fri upper | one medball list (19 throws x 10 = 190) | 1 colour-A ('20 sec fast/ 40 sec slow') + 1 colour-C ('20 min' easy) per week | the opening cardio on conditioning days is a REAL aerobic block for fighters, not a warm-up (COACH-ANSWER ORD-09) | stage-1 'receive and pause' landing drills may be added at low volume ('the beginning of a program might have a lot more receiving' - COACH-ANSWER CAT-10; PROPOSED - the OBSERVED boxer base has no jumps) | length: OBSERVED 2 weeks inside the boxer's 8-week build; the generator's 8-week shape is COACH-ANSWER PER-01 (about 4 weeks getting used to it, 4 weeks driving hard), so the base / adapt part runs about 4 weeks unless a fight date forces it shorter (PROPOSED); fight prep keeps 2-week steps and waves (PER-10)
- *conversion_build* (OBSERVED boxing weeks 3-8 (EA9999 -> E06666 -> CC0000 heat ramp)): exercise list replaced (phase change, +41% component sets) | 2-week steps: sets constant for 2 weeks | the deadlift complex '4 Deadlifts - 5 broad jumps - 5 KB swings - 5/5 High Knee runs' (L46), 'Hang Power Clean & Press' (L35) and 'Single Leg swiss ball knee tuck in + DB rows' (L20) are the levers: 3 sets wk3-6 -> 4 (wk7) -> 6 (wk8); the squat complex '3 Heavy SQUATs + 5 Tuck jumps + 5 DB squat jumps + 5 Squirrel jumps' (L22) goes 3 -> 2 (wk7) -> 3 (wk8) | RETIRED as a generator default (COACH-R2 VOL-07: no deload inside a block) - OBSERVED evidence only: wk 7 = accessory mini-deload (eleven rows 3 -> 2 sets: L12-L14, L21-L23, L32, L36, L37, L45, L48) | wk 8 = peak (dark red CC0000): hinge complex, clean & press and DB-row superset 6 sets, 'Sprint 20/ Recover 40' 8 rounds, deadlift + rope 4 sets | strikers: when punching volume is high, horizontal push, vertical pull and arm isolation 
- *fight_camp* (INFERRED (no camp program in the sheets); SCIENCE: maintain strength/power with low volume while sport-specific conditioning peaks): lifting 2-3 days, 2 sets per slot, keep 1 heavy and 1 fast exposure per pattern | conditioning = round simulations (colour B / LC) matched to the sport's round length | taper last 7-10 days: volume -40-60%, intensity kept | weight cut: no new exercises in the final 3 weeks | press / arm volume stays reduced but never zero (ATH-04) | bilateral share minimal (UNI-10) - each profile's in-season value (20% strikers / MMA, 30% wrestling / BJJ; PROPOSED)
- *post_fight* (INFERRED): easy colour C, mobility, injury check
- v1.1 stairway: every block climbs like a stairway, hardest weeks last (COACH-R2 PER-03/04/05)
- v1.1 no deload inside a block: stop -> maintenance (length chosen) -> new block (COACH-R2 VOL-07, PER-06); the easy week after a block is a recommendation and the user builds the next block (COACH-R3 PER-01)
- v1.1 profiles override: profiles[].season_overrides (built on COACH-R2 PER-06 / ATH-07) replace these family multipliers where both exist
- v1.1 camp: off-camp = off-season blocks; camp = the 4-6-week pre-season block at about 60 % + 1-2-week taper to the fight (COACH-R2 PER-06; combat-strength-fitness.json Q3 - confirm)

**strength** - powerlifting / strength track; v1.1 also Olympic weightlifting (its own %-based programming - COACH-R2 GEN-06), strongman, track sprint cycling

- *8_week* (COACH-ANSWER PER-01 (shape) + OBSERVED STRENGTH-8 / '(NOT DONE) EXAMPLE CONJUGATE' (example)): RETIRED (COACH-R2 PER-03: stairway, not 4 + 4 / start hard): GENERATOR SHAPE = COACH-ANSWER PER-01 (NOT RIGHT for the 7 + 1 reading): first 4 weeks adapting, next 4 driving hard, start hard; the OBSERVED shape below is an example only, retired as a default | RETIRED as a generator default (COACH-R2 VOL-07: no deload inside a block) - OBSERVED evidence only: 7 loading weeks, WK8 = 'TEST' (max-effort days) + 'DELOAD' (dynamic days) | three UNLABELLED coloured rows over WK1-WK8 (E4:L6): green B6D7A8 5,5,4,4,3,3,2,1; pink EAD1DC 5,4,3,2,1,3,2,1; blue CFE2F3 3,3,2,1,3,2,1,1 - the day rows only say 'SEE'. Reading pink = M.E. reps, blue = D.E. reps, green = sets is INFERRED (the B column fixes 'the work' at 5 sets Mon/Wed/Thu and 3 Sat) | volume flat or falling, intensity rising
- *12_week* (COACH-ANSWER PER-01 (shape) + OBSERVED STRENGTH-12 (example)): RETIRED as a generator default (COACH-R2 VOL-07: no deload inside a block) - OBSERVED evidence only: GENERATOR SHAPE = COACH-ANSWER PER-01 (preferred plan): 2-4 weeks acclimation, 4-6 weeks driving hard 'not all the way to the top', last weeks hardest; a repeated cycle starts one level higher; the OBSERVED 6 + mid-deload + 5 shape below is an example only, retired as a default | RETIRED as a generator default (COACH-R2 VOL-07: no deload inside a block) - OBSERVED evidence only: % 80,80,85,85,90,90 then 'MID DELOAD' WK7 | RPE 7,7,7,8,8,9,7,8,9,9,9,10; SETS 4,4,5,5,6,6,3,5,6,6,7,7; REPS 5,5,4,4,3,3,4,4,3,3,2,2 | main-lift sets +5.2%/week | PER-09 confirmed: the %-template (OLY 75 -> 80 -> 85 -> 90% with 4x8 -> 4x6 -> 4x6 -> 4x4; 4 TRACKS % / RPE / sets / reps rows) is the default for strength-focused plans
- *meet_peak* (INFERRED): last 2-3 weeks: accessories -50%, singles at RPE 8-9, plyo 'EASY' kept or dropped
- *bilateral_share* (COACH-ANSWER UNI-02 / CAT-13): start about 50/50 with contra/ipsi health accessories in weeks 1-4, end 90/10 bilateral; unilateral accessory kept later only if something bugs the lifter
- v1.1 stairway: every block climbs like a stairway, hardest weeks last (COACH-R2 PER-03/04/05)
- v1.1 no deload inside a block: stop -> maintenance (length chosen) -> new block (COACH-R2 VOL-07, PER-06); the easy week after a block is a recommendation and the user builds the next block (COACH-R3 PER-01)
- v1.1 profiles override: profiles[].season_overrides (built on COACH-R2 PER-06 / ATH-07) replace these family multipliers where both exist

**physique** - bodybuilding / aesthetics / fat loss / bootcamp

- *8_week* (COACH-ANSWER PER-01 + OBSERVED AESTHETICS-8): RETIRED (COACH-R2 PER-03: stairway, not 4 + 4 / start hard): COACH-ANSWER PER-01: 8 weeks = first 4 weeks adapting, next 4 driving hard ('an 8-week program wants to modify you, so you have to start hard') | RETIRED as a generator default (COACH-R2 VOL-07: no deload inside a block) - OBSERVED evidence only: OBSERVED AESTHETICS-8 example: SETS 2,3,3,3,4,4,5 per exercise, REPS 12,10,8 waves, '1-2 RIR', WK8 'DELOAD WEEK'
- *12_week* (COACH-ANSWER PER-01 / PER-03 / UNI-02 + OBSERVED AESTHETICS-12): COACH-ANSWER PER-01 (preferred plan): 2-4 weeks acclimation, 4-6 weeks driving hard 'not all the way to the top', last weeks hardest; a repeated 12-week cycle starts one level higher (1 -> 10, then 2 -> 11) | OBSERVED AESTHETICS-12 example: SETS 3,3,3,4,4,4,3,4,4,4,4,5; WK7 'A WEEK LOWER'; WK9-12 supersets, '2 sets LEG PRESS MYO - 15-5-5-5-5-5'; A/B weeks rotate variants (A/B lead-lift weeks are optional, for variety seekers - PER-03) | bilateral share 50/50 -> 80/20 (adjustable to 90/10) across the block (UNI-02); contra/ipsi accessories mostly in weeks 1-4 (CAT-13)
- *4_week_fat_loss* (OBSERVED FAT BURN + COACH-ANSWER VOL-11 / PRG-11): RETIRED as a generator default (COACH-R2 VOL-07: no deload inside a block) - OBSERVED evidence only: weekly lifting sets 60,60,64,70 (circuits excluded); compound reps 15/12 -> 8-10; leg isolation 4x15 -> 3x20 -> 2-3x40, arm isolation 2x30 -> 3x40, side raises 3x15 -> 4x20; circuits 3x30 s -> 5x50 s (two 4-station circuits/week); variation upgrade at WK3; no deload | the 40-rep sets (2-3x40, 3x40) are not a default any more: optional AMRAP / CrossFit style only (COACH-ANSWER VOL-11); circuits stay as finishers after lifting (PRG-11) | v1: this is an OBSERVED 4-week BUILDING block; under COACH-ANSWER PER-01 a stand-alone 4-6-week PLAN is a maintenance / transition block at about 50-70% volume, so the generator uses this progression only as weeks inside an 8- or 12-week fat-loss plan (INFERRED)
- *4_6_week_maintenance* (COACH-ANSWER PER-01): 4-6-week plans are maintenance / transition blocks (vacation, travel, season change, moving) at about 50-70% of the usual volume
- v1.1 stairway: every block climbs like a stairway, hardest weeks last (COACH-R2 PER-03/04/05)
- v1.1 no deload inside a block: stop -> maintenance (length chosen) -> new block (COACH-R2 VOL-07, PER-06); the easy week after a block is a recommendation and the user builds the next block (COACH-R3 PER-01)
- v1.1 profiles override: profiles[].season_overrides (built on COACH-R2 PER-06 / ATH-07) replace these family multipliers where both exist
- v1.1 contest prep: prep = 1-2 full blocks (no deload inside) at about 90 % of off-season sets, longer cardio and daily walks; peak week about -45 %, no new exercises (combat-strength-fitness.json Q11 - PROPOSED)

**endurance** - distance runners, cross country, middle distance, triathlon, endurance cycling, rowing (v1.1)

- *base* (INFERRED + SCIENCE (strength + plyo 2-3x/week for 8-12 weeks improves running economy)): strength 2x/week heavy 3-6 reps + low-amplitude plyos | running mostly colour C
- *build* (OBSERVED Sheet24 structure (running only - Sheet24 contains no strength work; the strength rule is INFERRED)): 2 run sessions/week: long run + quality (hill sprints 6-10 reps x 8-20 s, flat sprints 40-80 m, intervals '5x200m fast', progression runs) | cut-back weeks 3, 6, 8, 12, 18; '1-mile at max effort' tests wk 10 and 14 | strength 1-2x/week maintain (INFERRED)
- *taper_race* (OBSERVED Sheet24 wk 21 taper ('Tapering: 6 miles, comfortable pace', then 'Race day: Half Marathon'); strength/plyo rules INFERRED): strength 1x/week low volume; no new plyos 10 days out (INFERRED)
- v1.1 stairway: every block climbs like a stairway, hardest weeks last (COACH-R2 PER-03/04/05)
- v1.1 no deload inside a block: stop -> maintenance (length chosen) -> new block (COACH-R2 VOL-07, PER-06); the easy week after a block is a recommendation and the user builds the next block (COACH-R3 PER-01)
- v1.1 profiles override: profiles[].season_overrides (built on COACH-R2 PER-06 / ATH-07) replace these family multipliers where both exist
- v1.1 sport plan: the sport's own run / ride / row plan is the aerobic work (0 extra gym sessions); the strength block beside it follows the stairway and tests only before and at the end; the borrowed half-marathon plan is used as written (COACH-R2 LIB-06, PER-07)

**crossfit** - CrossFit competitor / class / hybrid; v1.1 also HYROX (competitive / fitness) and OCR

- *annual_macro* (OBSERVED 'EXAMPLE CROSSFIT SPLIT' A10:M17): 3 blocks of ~4 months: RESISTANCE -> STRENGTH -> POWER -> TEST/PEAK | aerobic and WOD levels ramp 1 -> 4 inside each block and reset higher at the next | event month strips all lifting | FULL TIME = add sets; HALF TIME = cut reps at 3 sets + 'LVL 5 = Work up to 1RM'
- v1.1 stairway: every block climbs like a stairway, hardest weeks last (COACH-R2 PER-03/04/05)
- v1.1 no deload inside a block: stop -> maintenance (length chosen) -> new block (COACH-R2 VOL-07, PER-06); the easy week after a block is a recommendation and the user builds the next block (COACH-R3 PER-01)
- v1.1 profiles override: profiles[].season_overrides (built on COACH-R2 PER-06 / ATH-07) replace these family multipliers where both exist

**youth** - youth athletes

- *pre_PHV* (SCIENCE (Lloyd & Oliver youth physical development; NSCA youth position)): 2-3 sessions/week of 30-60 min | wide range of jumps/landings at moderate volume (T2), games-based COD/sprint | bodyweight + light DB/medball resistance at FOUNDATIONAL levels; L1 Olympic variants (DB / KB snatch, hang pulls) - ATH-09 / ATH-10
- *circa_PHV* (SCIENCE for the risk (growth-related apophysitis: Osgood-Schlatter, Sever's); the -30-50% and ~30 cm caps are INFERRED analyst heuristics, n): high-amplitude plyos -30-50%, no depth jumps above ~30 cm | technique emphasis, flexibility/ROM maintenance | the athlete, a parent or the coach watches for knee / heel pain and swaps or removes the exercise on the printed plan (no check-ins or logs - COACH-R3 VOL-02, GEN-01; SES-02)
- *post_PHV* (SCIENCE): progress toward the adult sport profile; barbell and Olympic lifts with technical competency - and SOME Olympic lifts from the floor are allowed earlier according to the program (COACH-ANSWER ATH-09)
- v1.1 stairway: every block climbs like a stairway, hardest weeks last (COACH-R2 PER-03/04/05)
- v1.1 no deload inside a block: stop -> maintenance (length chosen) -> new block (COACH-R2 VOL-07, PER-06); the easy week after a block is a recommendation and the user builds the next block (COACH-R3 PER-01)
- v1.1 profiles override: profiles[].season_overrides (built on COACH-R2 PER-06 / ATH-07) replace these family multipliers where both exist

**general** - general population / longevity / older adults

- *continuous_blocks* (INFERRED from OBSERVED UPPER/LOWER levels + SCIENCE (NSCA older-adult position stand)): COACH-ANSWER PER-01: 12-week plans preferred; repeated 12-week cycles start one level higher; an open-ended week-by-week mode that 'keeps me in line' (RETIRED in v1.2 - it needed check-ins, COACH-R3 VOL-02); a yearly mode (quarter themes, holiday weeks = maintenance, printed by default as a recommendation - COACH-R3 PER-01; 06_periodization v1.2) | 4-6-week maintenance / transition blocks at 50-70% volume | no seasons; tests chosen by checkbox at block start, or none (PER-07)
- v1.1 stairway: every block climbs like a stairway, hardest weeks last (COACH-R2 PER-03/04/05)
- v1.1 no deload inside a block: stop -> maintenance (length chosen) -> new block (COACH-R2 VOL-07, PER-06); the easy week after a block is a recommendation and the user builds the next block (COACH-R3 PER-01)
- v1.1 profiles override: profiles[].season_overrides (built on COACH-R2 PER-06 / ATH-07) replace these family multipliers where both exist
- v1.1 year: gen-pop stay-in-shape year (Jan-Mar hard work + cardio, Apr-Jun summer shape, Jul-Sep maintain ~70 %, Oct-mid-Dec build, last 2 weeks of Dec maintenance), fully user-tunable: re-order blocks, more / less cardio, e.g. a winter powerlifting-style block (COACH-R2 PER-01 / PER-02)
- v1.1 recreational: recreational activities (activities[]) have no season: training blocks + optional event date - the hardest weeks end 1 week before, then 1 easy week at about half the sets (approved COACH-R3 ATH-05; 06 v1.2)

**aquatic** - swimming (sprint / middle / distance), diving, water polo

- *off_season / general prep* (aquatic-endurance-track.json season_model (double-periodised year mapped onto off / pre / in) - PROPOSED): dryland strength and power blocks on the stairway; 0 extra aerobic sessions (the pool is the aerobic work) | shoulder care every session (SHOULDER_SWIMMER), no bands (EQ-01 / EQ-12)
- *pre_season* (COACH-R2 PER-06): 4-6 weeks at about 60 % of off-season sets, more speed and power
- *in_season / championship taper* (COACH-R3 ATH-01 (approved) + COACH-R2 PER-06 + SCIENCE (swim taper literature, aquatic-endurance-track.json)): about 2 short gym days | swimmers: a 2-week dryland taper lined up with the swim coach's taper before the main championship meet; 1 week or none before smaller meets (COACH-R3 ATH-01; the meet date is an intake field)
- v1.1 stairway: COACH-R2 PER-03/04/05
- v1.1 no deload inside a block: COACH-R2 VOL-07
- v1.1 profiles override: profiles[].season_overrides

**snow** - alpine / speed / snowboard racing, freestyle ski and snowboard

- *dryland off-season (spring-summer)* (aquatic-endurance-track.json ski profiles - PROPOSED): strength (eccentric quads, hips), power and landing blocks on the stairway
- *pre_season (fall, before snow)* (COACH-R2 PER-06): 4-6 weeks at about 60 %, more speed and power
- *in_season (on snow)* (COACH-ANSWER PER-08): about 2 short gym days; on-snow days count as practice
- v1.1 stairway: COACH-R2 PER-03/04/05
- v1.1 no deload inside a block: COACH-R2 VOL-07
- v1.1 profiles override: profiles[].season_overrides

### 9.5 Plan-length shapes

- **rule**: every plan is a stairway: gradual weekly steps, smaller in the first weeks, slightly bigger after the halfway point but not too much, hardest weeks last; 'start at a 2, end at an 11' = perceived effort / overall load (COACH-R2 PER-03 / PER-04 / PER-05)
- **4-6**: maintenance / transition at about 50-70 % volume; length chosen by the user; after a block it is a recommendation, not mandatory; when it ends the plan ends and the user builds the next plan in the app (COACH-R2 PER-06; COACH-R3 PER-01)
- **after a block (v1.2)**: when a block ends it ends; the easy week at about half the sets is recommended (an extra week, not mandatory); holiday weeks are planned between blocks (COACH-R3 PER-01)
- **8**: stairway: small steps weeks 1-4, slightly bigger steps weeks 5-8, week 8 the hardest (COACH-R2 PER-03 NOT RIGHT about 4 + 4 / start hard)
- **12**: stairway: small steps early, slightly bigger after week 6, the last 4 weeks 'brutal' (COACH-R2 PER-04)
- **week_by_week**: RETIRED in v1.2: the open-ended mode needed weekly check-ins and a stored history (COACH-R3 VOL-02, VOL-04, GEN-01); a block ends and the user builds the next (COACH-R3 PER-01)
- **yearly**: gen-pop stay-in-shape year: quarter themes + holiday weeks = maintenance; fully user-tunable (COACH-R2 PER-01 / PER-02)
- **pre_season**: 4-6-week block at about 60 % of off-season sets, more speed and power, then a 1-2-week taper (COACH-R2 PER-06)
- **no_deload_inside_a_block**: a block that cannot be completed is cancelled -> maintenance -> a new block (COACH-R2 VOL-07)
- **observed examples**: 8 7 loading + deload/test; 12 6 + deload wk7 + 5; athlete_8_build 2 base + 6 conversion, 2-week steps, wk7 mini-deload, wk8 peak (boxer); note OBSERVED examples only - retired as generator defaults by COACH-ANSWER PER-01 (NOT RIGHT)
- **retired v1**: 8 4 weeks adapting + 4 weeks driving hard, start hard (COACH-ANSWER PER-01); 12 2-4 acclimation + 4-6 driving hard (not to the top) + hardest last weeks; repeat cycles one level higher (COACH-ANSWER PER-01, preferred); why COACH-R2 PER-03 / PER-04 (stairway replaces 4 + 4 / start hard / acclimation caps)
- **detail**: 06_periodization v1.2 and 12_volume_algorithm_v1 v1.2 own the step sizes

### 9.6 Session load and assembly

> **Changed in v1.3** (COACH-CT CT-01; COACH-R4 R4-SES-02, R4-SES-04, R4-SES-05). Sessions are sized by exercise count (athletes up to 12 + 2 core; resistance-only 5-7; older adults 5-6), not by a time cap. Nothing is consolidated or cut automatically when a day runs long: the template comes out complete and the person removes what they want (the plan names the easiest things). Step 1 no longer takes a session length; step 7 uses his A / B lifts after the athletic block; step 10 no longer audits minutes against a cap. Where the text below differs, the v1.3 section at the top of this file wins.

- **heuristic**: PROPOSED: 2 sets per athletic, core, isolation or focus exercise and 3 per compound (VOL-16 defaults); a medball 'Throwing' block = 1 exercise per main day (LIB-22); Focus on optional days when the profile has them (ORD-10); minutes add 50% time to unilateral lower sets (UNI-09)
- **caps**: athletes with a power block 12 exercises (VOL-08 'max maybe 12', VOL-17 composition); resistance-only 5-7 + 1 core-first exercise = 8 (VOL-08 / VOL-16 / ATH-11); time 90 min athletes / bodybuilders / powerlifters (max 120), 45-60 min general and weight-loss clients (UNI-09)
- **fat loss minutes**: about 62 min (67 with unilateral time) - over the 60 min weight-loss cap; its circuit stations are finishers (PRG-11)
- **assembly rule when over**: PROPOSED - PENDING COACH APPROVAL: (1) consolidate - 3 sets on fewer plyo / ballistic / Olympic exercises instead of 2 sets on more (same weekly dose); (2) run COD and SPRINT as their own speed block in the fixed order squirrel jumps -> MACH / acceleration starts -> max velocity (LIB-21), on a separate day or as the extension of the warm-up; (3) superset calves, rear delts and arm isolation with the main lifts (ORD-05); (4) move Focus and extra isolation to the optional days (ORD-10); never drop core-first or the athletic prefix
- **caps v1 1**: field athletes: up to 12 exercises + the 2-exercise core block (COACH-R2 SES-04); warm-up drills never count; a superset of two small isolations counts as one; full-body days 2-4 exercises per muscle trained that day, never 1, even if the day gets longer (COACH-R2 SES-05)
- **caps v1 2**: v1.2: 2-4 exercises for each FOCUS group trained that day (hips = glutes + hamstrings, shoulders = all delts; COACH-R3 SES-01); field athletes inside 12 + 2 core: cross pattern (default) = 2 jump / throw stations + 1 Olympic lift, same-pattern athletic template (size-focused / high-level) = 3-4 jump stations + 1 Olympic lift; when the time cannot hold the minimums the plan says so up front, offers another day or longer sessions, then trains fewer groups directly (big movers first), recommends supersets and keeps the stairway climbing on the trained groups; never 2-4 exercises per group squeezed into a day that cannot hold them (COACH-R3 SES-02; 12_volume_algorithm v1.2 §3.10.1)
- 1. Intake (COACH-ANSWER GEN-02, COACH-R2 GEN-05): goal; competitive sport -> sport + position + season start date + practice / game days, recreational -> activity only (activities[]); no sleep / stress / job inputs (COACH-R2 GEN-04); training experience in YEARS (-> L1 / L2 / L3, PRG-05); age; body weight; days; ~~session length~~ (retired in v1.3, COACH-CT CT-01); equipment; injuries / pain; Focus muscle 1 / 2 (optional, max 2 - COACH-R3 SES-01); rep-style preference; plan type. NO sex field (GEN-02, ATH-09).
- 2. Pick the profile from sports[] / activities[] (position -> profile, + variant), season phase and competition level (high school / college / pro = same plan, different loads - PRG-09). A competitive sport without a profile uses the nearest profile by ground-contact class and ATH-03 group (PROPOSED).
- 3. Weekly set budget per category = profile.weekly_sets (v1 off-season build baseline) x season multiplier x the volume engine's planned stairway step (approved COACH-R3 VOL-04; no check-ins - COACH-R3 VOL-02). Plan type shapes the curve: every plan is a stairway, hardest weeks last (COACH-R2 PER-03...
- 4. Power block: split power sets plyo : ballistic by the ground-contact class (ATH-01; map PROPOSED), start ballistic-biased and move to the target (CAT-10); plyo method stage 1 -> 2 -> 3 across the block; unilateral plyos after bilateral; medball volume by sport, none for aesthetics, ball <= 20 lb (ATH-05 / EQ-06); Olympic lifts for every athletic trainee at their level (ATH-10); contrast only L2+ off-season (ATH-12).
- 5. Resistance block: bilateral : unilateral share from the profile (block start -> end, in-season value; UNI-02 / UNI-10), the same logic for upper-body pressing and pulling (UNI-03); contralateral for COD athletes, ipsilateral for acceleration, contra/ipsi as early-block health accessories for size/strength clients (CAT-13); frontal / transverse unilateral share for court and combat athletes (UNI-12); pain moves the share or the machine choice (VOL-03).
- 6. Session order (COACH-ANSWER ATH-11, ORD-01..03, ORD-08): warm-up -> CORE FIRST (movable) -> plyo / ballistics -> Olympic / power -> main strength lift -> resistance accessories -> isolation (calves 3 sets every leg day, rear-delt work inside the shoulders group - VOL-17, COACH-R3 VOL-01); hip-dominant with push, knee-dominant with pull (UNI-11 / ORD-06); heavy squat and heavy deadlift on two different days (COACH-R2 SES-01); fighters open conditioning days with a real aerobic block (ORD-09).
- 7. Session caps (COACH-ANSWER VOL-08 / VOL-16 / VOL-17 / UNI-09): resistance-only 5-7 exercises; field athletes off-season up to 12 + the 2-exercise core block (COACH-R2 SES-04) with 2-4 exercises for each group trained that day - cross pattern (default): 2 jump / throw stations + 1 Olympic lift; same-pattern athletic template (size-focused / high-level): 3-4 jump stations + 1 Olympic lift (COACH-R3 SES-01); about 1.5 h for athletes, bodybuilders and powerlifters (max 2 h), 45-60 min for general / weight-loss clients, 35-45 min bootcamps. Over budget -> supersets (ORD-05: also a fatigue tool) or fewer sets per slot, never drop the athletic prefix of an athlete profile. Over the EXERCISE cap -> consolidate athletic work into fewer exercises with more sets, a separate speed block for COD / sprint, supersets for calves / rear delts / arms, Focus on optional days (PROPOSED, session_load_check).
- 8. Fill each slot with a DEFAULT exercise plus a dropdown of same-category swaps (GEN-04), filtered by level, equipment (no bands / variable resistance - EQ-01 / EQ-12), age and injury rules (older / injured / high-volume -> constrained machines; never OHS, snatch, low-bar squat (EQ-03; COACH-R3 ATH-02), depth jumps only switched on for 60+ - EQ-03), and client preference (EQ-10). Hard rules (GEN-08) + coach-added rules.
- 9. Dose reps by category and rep zone (VOL 1 / 2 / 3 per block for athletes - PER-11; STRENGTH; POWER; MYO last - VOL-15; RIR primary - VOL-13); athletic slots in contacts / throws / cuts / metres; no deload inside a block (COACH-R2 VOL-07); tests chosen by checkbox at block start, or none (PER-07).
- 10. Audit: muscle sets vs targets (helpers 0.25, athletic sets excluded - VOL-09 / VOL-10); plyometric contacts vs the ATH-02 ranking band; all jump contacts vs the NSCA per-session guide; throws vs the ATH-05 tier; aerobic sessions 3 / 2 / 4 (+ walks) by population (ATH-07); ~~estimated minutes vs the session-length cap~~ (retired in v1.3: minutes are an estimate only, COACH-CT CT-01).

## 10. Injury hotspot library

Selection rules per code are in `injury_library` (JSON); no bands anywhere (EQ-01 / EQ-12). Codes used by the v1.1 profiles all resolve (check C20).

| Code | Evidence | Rules | Added / extended in v1.1 | Used by |
|---|---|---|---|---|
| PAIN_GENERAL | OBSERVED | COACH-ANSWER VOL-03: cut that muscle or pattern 30-50%, move it to machines or split grips, keep it moving - or drop the exercise altogether if it is too much / swap fixed-grip barbell/bar -> DB/KB/handles in the same pattern; swap bilateral -> unilateral in the same pattern (MASTER_MODEL athletic A6); keep the sets ideally, 'but you have to adjust accordingly' (UNI-08) / pain moves the bilateral  |  | 124 profiles |
| SHOULDER_THROWER | OBSERVED + SCIENCE | pressing = DB / alternating / landmine ('Kneeling Landmine Press' AA93, 'Sesaw Db Press' AA91, alternating presses AD126-AD129; AD130 is 'Push ups (1 hand Higher)'); heavy barbell overhead only occasionally (the coach writes it 3x in a 24-week baseball year, never in-season); pitchers: less overhead pressing, more arm care, rotational throws kept light (COACH-ANSWER ATH-08) / add ISO_REAR (posteri | extended by sports/aquatic-endurance-track.json | 31 profiles |
| SHOULDER_STRIKER | OBSERVED (boxer) + COACH-ANSWER ATH-04 | when punching volume is high, bring HPUSH, VPULL and arm-isolation volume DOWN (PROPOSED: to about 30-50% of the base-phase sets) - never to zero (COACH-ANSWER ATH-04: 'don't completely cut it') / keep HPULL (rows) and ISO_SIDE / ISO_REAR for scapular balance / presses that remain = alternating DB / push press |  | 3 profiles |
| SHOULDER_GYMNASTIC | SCIENCE | cap kipping/high-volume hanging work in skill blocks; keep strict pulling strength (VPULL) >= kipping volume / ISO_REAR 2x/week | extended by sports/combat-strength-fitness.json | 7 profiles |
| ELBOW_THROWER | SCIENCE | forearm/grip and wrist-flexor work (ISO_GRIP) 2x/week / softball pitchers: eccentric biceps emphasis in ISO_BICEP / count medball overhead throws as arm load on high-pitch days | extended by sports/aquatic-endurance-track.json | 9 profiles |
| ELBOW_LATERAL_RACKET | SCIENCE | wrist-extensor isometric/eccentric (ISO_GRIP) 2-3x/week / neutral-grip DB pressing |  | 7 profiles |
| WRIST_HAND | INFERRED + SCIENCE | prefer DB/KB neutral grips over front-rack barbell for strikers / limit front-squat rack volume when wrist pain flagged | extended by sports/aquatic-endurance-track.json, sports/combat-strength-fitness.json, sports/team.json | 22 profiles |
| NECK | SCIENCE (gap in coach library) | add ISO_NECK 2x/week (isometric 4-way, then plate or manual eccentric; no bands - EQ-01) - NO library column exists: create one / progress static -> dynamic like the core plane ladder | extended by sports/aquatic-endurance-track.json, sports/combat-strength-fitness.json, sports/team.json | 39 profiles |
| LOW_BACK_ROTATIONAL | OBSERVED (core ladder) + SCIENCE | anti-rotation static first (Pallof holds BC46-BC49) before rotational dynamic (chops BC9/BC13/BC17, 'Woodchoppers', 'Cable Machine Oblique Rotations') / hip rotation (into/out-of-hip) emphasis so rotation comes from the hips, not the lumbar spine (medball half-kneeling 2x2 matrix) / avoid high-volume loaded flexion+rotation (e.g. weighted Russian twists) when back pain is flagged | extended by sports/aquatic-endurance-track.json | 34 profiles |
| LOW_BACK_LOADING | SCIENCE + OBSERVED pain rule | spine loading (COACH-R2 SES-01/02, refines COACH-ANSWER PER-04): heavy squat and heavy deadlift once a week each, on two different days; non-axial hinge (hip thrust, back extension, reverse hyper), leg press or belt squat on the other days; axial = barbell back / front / zercher / overhead / Smith squats, barbell or trap-bar deadlifts and RDLs, good mornings / belt squat when the back was already  | extended by sports/aquatic-endurance-track.json, sports/combat-strength-fitness.json | 32 profiles |
| GROIN_ADDUCTOR | OBSERVED (coach uses it) + SCIENCE | 'Coppenhaggen Plank' (R47 / O165) 3x/week pre-season, 1-2x/week in-season / adductor-integrated chops / Pallofs ('Hold object Adducted between knees'); banded adduction variants are out of scope (no bands, EQ-01 / EQ-07) / frontal / transverse unilateral work (lateral lunges, cossacks, lateral step-ups) - UNI-12 | extended by sports/aquatic-endurance-track.json, sports/team.json | 44 profiles |
| HIP_FLEXOR | SCIENCE | loaded hip-flexion (FOCUS slot) 1-2x/week / A March / A Skip progressions |  | 10 profiles |
| HIP_FAI_DEEP_FLEXION | SCIENCE | limit loaded deep hip flexion volume (box squats to parallel) / hip IR/ER mobility in warm-up / more UHD than deep BKD | extended by sports/team.json | 9 profiles |
| LEAD_HIP_GLUTE | SCIENCE | lateral hip strength: 'Side Lunges' AL12, 'Step ups (Forward & Side)' AL19, contralateral-loaded lunges / medball half-kneeling scoops labelled 'INTO THE LEFT LEG/HIP' / 'INTO THE RIGHT LEG/HIP' (ballistics MEDBALL CHEAT SHEET D65/D68) both sides |  | 10 profiles |
| HAMSTRING | SCIENCE + OBSERVED library | 'Nordic Curl' (AN91) or slider/swiss-ball curls (AN18/AN19) 1-2x/week year-round / keep at least one max-velocity sprint exposure per week in every phase / hip-extension strength (RDL / staggered stance DL) | extended by sports/aquatic-endurance-track.json, sports/combat-strength-fitness.json, sports/team.json | 49 profiles |
| ACL_LANDING_CUTTING | SCIENCE + OBSERVED progression | plyo method stage 1 first: 'STICK THE LANDING BILATERAL' -> 'UNILATERAL' -> weighted (OBSERVED ballistics tab; CAT-10) / COD 'EASY TURN' -> 'MOD. TURN' -> 'HARD TURN' only after landing competency / single-leg strength + hip abductor work every week / athletes with an ACL history, a poor landing screen or a low training age: double the stage-1 landing block (INFERRED; replaces the v0 sex-based rul | extended by sports/aquatic-endurance-track.json, sports/combat-strength-fitness.json, sports/team.json | 47 profiles |
| PATELLAR_TENDON | SCIENCE | cap REBOUNDING (phase 4) contacts; never stack max approach jumps + depth jumps on the same day / heavy slow quad work / isometrics (ISO_QUAD 'Leg Extensions', 'Sissy Squats' AK18) 2x/week / in-season: count game/practice jumps before adding gym plyos | extended by sports/combat-strength-fitness.json | 24 profiles |
| ANKLE_SPRAIN | SCIENCE + OBSERVED library | ankle-dominant track (the 'JUMPING ANKLE' ankle-hop block C124-C136 under 'TRIPPLE EXTENSION', same list as Sheet23 'FOUNDATINONAL - AP - JUMPING LIMITED KNEE' E2:E12; lateral plate hops G50-G52) 2x/week / single-leg landings with lateral component | extended by sports/combat-strength-fitness.json, sports/team.json | 56 profiles |
| ACHILLES_CALF | SCIENCE | 'Standing Calf raises (use deficit)' AU9 / bent-knee soleus 2-3x/week / progress JLK volume <= 10-20%/week (INFERRED) | extended by sports/aquatic-endurance-track.json, sports/combat-strength-fitness.json | 34 profiles |
| BONE_STRESS | SCIENCE | plyo low-amplitude only until 6+ weeks of tolerance / progress total impact load gradually; heavy strength training is protective | extended by sports/aquatic-endurance-track.json | 9 profiles |
| GROWTH_APOPHYSIS | SCIENCE | reduce high-amplitude plyos and depth drops during growth spurts (INFERRED caps) / no maximal loading; foundational lists, with some Olympic lifts from the floor allowed by program (COACH-ANSWER ATH-09) | extended by sports/combat-strength-fitness.json | 3 profiles |
| DECONDITIONED_JOINTS | INFERRED + OBSERVED | no plyos beyond low-amplitude until body mass and landing control allow / constrained machines / supported variants first (constraint 4-5), free weights later (EQ-03 / EQ-13) |  | 3 profiles |
| FALLS_BONE_DENSITY | SCIENCE (NSCA older-adult position statement) | few plyos unless the client asks (COACH-ANSWER ATH-09) / compounds and isolation on constrained machines / cables; never overhead squat, snatch or low-bar squat (COACH-ANSWER EQ-03; COACH-R3 ATH-02); depth jumps: never for injured / high-volume clients (EQ-03); for 60+ off by default and switchable with the warning (COACH-R3 ATH-02) / power work at 40-60% 1RM moved explosively (SCIENCE) / balance + sit-to-stand + step-ups every session; 2-3 sets per major muscle group, 2-3 days/week (SCIENCE) | extended by sports/combat-strength-fitness.json | 3 profiles |
| HIGH_VOLUME_CONSTRAINT | COACH-ANSWER EQ-03 / EQ-04 | compounds and isolation lean to constrained machines (constraint scale 4-5, EQ-13; hack squat / leg press more constrained than Smith; belt squat avoids axial load; GHD / reverse hyper if available and the client feels the right muscles - no machine ranking, brands and angles differ, EQ-11) / never overhead squat, snatch, low-bar squat or depth jumps / the client's preference picks between equival |  | 1 profiles |
| SHOULDER_CONTACT | SCIENCE (T29, T30, T11) for the hotspot; rules INFERRED from 04 SHOULDER_* rules and COACH-ANSWER VOL-17 / EQ-01 | pull sets >= push sets every week (rows before pulldowns - ORD-01); rear-delt work every week (VOL-17) - part of the shoulders group, not a muscle with its own floor; users / coaches can add more (COACH-R3 VOL-01) / scapular / rotator-cuff work with DB, cable or KB (KB face pulls = shoulder work on pull / shoulder days - COACH-R2 LIB-04, LIB-10); never bands (EQ-01) / after a flagged sprain or dislocation: DB / landmine / neutral-grip pressing and end-range isometric holds instead of barbell bench; no  | sports/team.json | 19 profiles |
| LOW_BACK_FLEXED_POSTURE | SCIENCE (T7) for the hotspot; rules INFERRED from 04 LOW_BACK_* rules and COACH-R2 SES-01/02 | trunk-extensor endurance on the non-axial hinge day (back extension, reverse hyper - EQ-11) and core first every session, anti-flexion / anti-rotation before dynamic (ATH-11, R2-SES-03) / heavy squat and heavy deadlift on two different days; other days non-axial (COACH-R2 SES-01/02) / loaded hip-flexion and hip-flexor length work in the FOCUS / warm-up slot 1-2x/week; thoracic rotation mobility in | sports/team.json | 4 profiles |
| KNEE_DEEP_FLEXION | SCIENCE (T31, T23) for the hotspot; rules INFERRED | build deep-flexion tolerance gradually (goblet squat to depth, split squats, belt squat) - goblet / hack / pendulum fine on the second day if not sore (COACH-R2 SES-02) / quad-tendon isometrics / slow leg extensions 2x/week (ISO_QUAD) / in season: no high-volume loaded deep squats; deep positions come from the sport (INFERRED) | sports/team.json | 3 profiles |
| STUNT_CATCH_LOAD | SCIENCE (T13) for the hotspot; rules INFERRED | overhead lockout strength: push press / push jerk / DB-KB overhead holds and carries (push press is the easier rung - LIB-13) / eccentric squat-catch strength: front squat, goblet squat, belt squat on non-axial days (R2-SES-01/02) / wrist and forearm work (ISO_GRIP) 2x/week; neutral-grip DB pressing when wrists are flagged (WRIST_HAND) / anti-extension core first every session (ATH-11) | sports/team.json | 1 profiles |
| TUMBLING_LANDING | SCIENCE (T14, T15, T13) for the hotspot; rules from COACH-R2 ATH-02/03 and 04 ACL / ANKLE rules | Receive-Create stage 1 (Land) every block before stage 2-3 (COACH-R2 ATH-03); stick-the-landing drills are the 'receive' stage (R2-ATH-02) / ankle stiffness track (JLK) 2x/week and single-leg landings with a lateral component (ANKLE_SPRAIN) / anti-extension core (walkovers / back handsprings load lumbar extension); wrist work (WRIST_HAND) / count practice tumbling passes before adding gym plyos in | sports/team.json | 1 profiles |
| SHOULDER_SWIMMER | SCIENCE (AQ3, AQ13, AQ16) for the hotspot; rules INFERRED from the 04 SHOULDER_* rules and COACH-ANSWER VOL-17 / EQ-01 / | pull sets at least 1.5 x push sets every dryland week; horizontal pull before vertical pull (ORD-01); rear-delt work every week (VOL-17) - part of the shoulders group, not a muscle with its own floor; users / coaches can add more (COACH-R3 VOL-01) / swimmers: shoulder care in EVERY dryland session - external rotation (side-lying DB), prone floor Y / T raises (R2-LIB-07) and KB face pulls (R2-LIB-04, LIB-10), never bands (COACH-R3 ATH-01; EQ-01); the other sports on this list: posterior cuff and scapular work 2-3 x / week (INFERRED) / pressing = push-up  | sports/aquatic-endurance-track.json | 10 profiles |
| KNEE_MEDIAL_KICK | SCIENCE (AQ4: 73-75 % of breaststrokers report knee pain; AQ16: eggbeater kick loads the medial knee and hip) for the ho | hip internal-rotation range and hip strength every week: lateral lunge, Cossack lunge, Copenhagen plank (GROIN_ADDUCTOR), hold-between-knees squats (UNI-12 frontal / transverse unilateral list) / quad strength through a pain-free range: split squats, step-ups, leg extensions / isometric holds (slow, heavy) 2 x / week / avoid deep loaded valgus positions; knees track over toes on all squats and lun | sports/aquatic-endurance-track.json | 7 profiles |
| LOW_BACK_EXTENSION | SCIENCE (AQ4: about 76 % lifetime low back pain in competitive swimmers, butterfly / breaststroke highest; AQ14: divers  | core first every session as anti-extension / anti-rotation (dead bug, plank, hollow hold) before any dynamic or extension work (ATH-11, R2-SES-03) / heavy squat and heavy deadlift on two different days; non-axial hinge (hip thrust, back extension to neutral, reverse hyper), leg press or belt squat on the other days (COACH-R2 SES-01/02) / no loaded end-range spinal extension (no hyperextension past | sports/aquatic-endurance-track.json | 7 profiles |
| RIB_STRESS | SCIENCE (AQ34: low back 15-25 % of rowing injuries; rib stress fractures a main time-loss injury, more in international  | serratus and pressing balance: push-ups / DB bench at least half of the rowing-pattern pull sets every week (INFERRED) / sudden jumps in on-water or erg volume and long low-rate / high-pressure blocks are introduced only as stairway steps, never all at once (INFERRED; COACH-R2 PER-03/04) / sweep rowers: anti-rotation core and both-side unilateral work every week (UNI-02 health use) / pain at the side of the chest -> the rower or coach stops rowing-pattern lifts that day and refers (INFERRED; no check-ins - COACH-R3 VOL-02) | sports/aquatic-endurance-track.json | 2 profiles |
| BONE_LOADING_NON_IMPACT | SCIENCE (AQ8: swimming is not osteogenic and a 9-month jumping programme improved bone in adolescent swimmers and cyclis | keep some jumping all year even when the plyo share is low: ballistic jumps (squat / box / broad / hex-bar - R2-ATH-02) plus a small low-amplitude block (pogo / ankle hops) 2-3 x / week / heavy compound lifting (squat, deadlift, loaded carries) every off-season block / progress impact gradually with the Receive-Create stages (COACH-R2 ATH-03); older clients follow COACH-R2 ATH-08 (no plyos by defa | sports/aquatic-endurance-track.json | 11 profiles |
| PATELLOFEMORAL_ITB | SCIENCE (AQ25: patellofemoral pain and ITB syndrome among the most prevalent running injuries; AQ32: anterior knee pain  | quad strength through a pain-free range (split squat, step-up, leg extension / isometric holds) 2 x / week / hip abductor / lateral hip strength: side lunges, lateral step-ups (LEAD_HIP_GLUTE list) every week / pain -> COACH-ANSWER VOL-03; bike-fit and shoe questions go to a professional (outside the tool - INFERRED) | sports/aquatic-endurance-track.json | 9 profiles |
| FALL_UPPER_LIMB | SCIENCE (AQ32: clavicle the most common fracture in cyclists; AQ38: hand / wrist injuries in snowboarders) for the hotsp | upper-body pushing and pulling strength kept every block (no zero-push weeks) / wrist / forearm work (ISO_GRIP: wrist curls, reverse curls, plate pinches) 2 x / week / stage-1 upper-body receive drills ('Push up Stick the Landing' - LIB-02) in the early off-season (INFERRED) | sports/aquatic-endurance-track.json | 6 profiles |
| KNEE_GRAPPLING | SCIENCE (K7 / K7b BJJ: knee the most injured site, 27-33 %; K5b judo top level: knee ~17 %) for the hotspot; rules INFER | single-leg strength every week (split squats, step-ups, SL RDL) and hamstring strength ('Nordic Curl' or slider curls) 1-2x/week / adductors: 'Coppenhaggen Plank' 2x/week (04 GROIN_ADDUCTOR rule) / deep-flexion tolerance built gradually (goblet / belt squat to depth on non-axial days - COACH-R2 SES-02) / landing / receive stage first for throws and shots (Receive-Create stage 1, COACH-R2 ATH-03) / | sports/combat-strength-fitness.json | 4 profiles |
| ELBOW_GRAPPLING | SCIENCE (K5b judo top level: elbow ~14 %; K7 BJJ elbow 8.4 %) for the hotspot; rules INFERRED | elbow flexor and extensor strength every week (ISO_BICEP / ISO_TRICEP 2 sets 2x/week, DB or cable - no bands, EQ-01) / grip and forearm work (ISO_GRIP) 2x/week: towel / gi hangs, farmer holds / a flagged elbow: neutral-grip DB pressing and rows, no straight-arm hanging to failure in tournament weeks (INFERRED) | sports/combat-strength-fitness.json | 5 profiles |
| FINGER_PULLEY | SCIENCE (K31: fingers are the most injured site in climbers; A2 / A4 pulley ruptures the most common injury) for the hot | count finger load from climbing and hangboard together; max hangs at most 2x/week, never on back-to-back days and never within 48 h of limit bouldering or a competition (INFERRED) / open-hand / half-crimp grips for loaded hangs; no loaded full-crimp max hangs (INFERRED) / add load in small steps inside the block stairway (COACH-R2 PER-03/04); a painful finger drops the hangboard first, then the ha | sports/combat-strength-fitness.json | 2 profiles |
| BICEPS_TENDON | SCIENCE (K13: biceps 11 % of strongman injuries; strains / tears of muscle 38 % and tendon 23 %) for the hotspot; rules  | biceps strength incl. slow eccentrics (ISO_BICEP 2-4 sets 2x/week) - stones are lifted with long arms / alternate the supinated hand on mixed-grip pulls between sets / weeks; hook or double-overhand with straps for volume (INFERRED) / stone and sandbag loads climb the block stairway; no max stone loads on the day after heavy pulls (INFERRED) | sports/combat-strength-fitness.json | 2 profiles |
| LOW_BACK_EXTENSION_SPONDY | SCIENCE (K28 trunk 13.4 % of NCAA women's gymnastics injuries; high incidence of suspected spondylolysis in young compet | anti-extension core first every session (hollow holds, dead bugs) before any dynamic arching (COACH-ANSWER ATH-11, COACH-R2 SES-03) / no loaded end-range spinal extension in the gym (back extensions to neutral only); hip-flexor length and hip-extension strength instead / persistent extension pain in a young athlete = stop the plan and refer to a professional (health-screen logic, COACH-R2 GEN-03) | sports/combat-strength-fitness.json | 1 profiles |
| FALLS_COURT | SCIENCE G3 (seniors >= 60: slip / trip / fall / dive = 66.9 % of pickleball injuries; fractures 30.4 %; wrist and lower  | teach the drop-step 'turn and run' for lobs as a COD drill (EASY TURN -> MOD. TURN, ATH-06); fast backpedalling is not trained as a default drill (INFERRED from the fall mechanism) / deceleration and stick-the-landing work = Receive-Create stage 1 'Land' before any rebound (COACH-R2 ATH-03; CAT-10) / single-leg balance and reactive stepping in the warm-up or core block every session; lateral hip s | sports/genpop-active.json | 3 profiles |
| KNEE_DESCENT_ECCENTRIC | SCIENCE G24 (recreational skiing leaves eccentric quadriceps and hamstring fatigue lasting >= 24 h) and G16 (load carria | slow-eccentric knee-dominant work 2x/week: step-downs from a low box, split squats with a 3-s lowering, leg extensions with slow eccentrics (ISO_QUAD) / isometric quad holds (static squat / wall-sit holds 30-60 s) in the knee-dominant block for skiers (INFERRED) / progress downhill / ruck load gradually: start ~10 % of body weight, add about 5 % of body weight every 2-4 weeks, stay under ~30 % (pr | sports/genpop-active.json | 2 profiles |
| RUNNING_OVERUSE | SCIENCE G13 (novice runners 17.8 injuries per 1000 h vs 7.7 for recreational runners; knee and lower leg most affected)  | run / walk start for beginners (NHS Couch to 5K pattern: 3 runs a week, rest day between - G14) / weekly running minutes climb the plan's stairway - small steps early, slightly bigger after halfway, never a big jump (COACH-R2 PER-03/04 logic applied to run time; ~10 %/week ceiling INFERRED) / heavy slow strength 2x/week (quads, hips, calves) and bent-knee soleus raises (ISO_CALF) - strength and pl | sports/genpop-active.json | 2 profiles |
| CYCLING_POSTURE | SCIENCE G19 (recreational cyclists: 85 % report an overuse injury; neck 48.8 %, knees 41.7 %, groin / buttocks 36.1 %, h | rows >= presses, rear delts and KB face pulls every week (VOL-17, R2-LIB-04); thoracic extension mobility in the warm-up / back extensions / reverse hyper on the non-axial hinge day (R2-SES-01/02); core anti-flexion holds / hip-flexor length and glute work (hip thrust on the non-axial day) to balance the flexed riding position / anterior knee pain: slow quad work and isometrics (ISO_QUAD) and a bi | sports/genpop-active.json | 1 profiles |
| NEW_CLASS_EASE_IN | SCIENCE G20 (exertional rhabdomyolysis case series after a FIRST spin class, often in previously fit adults); rule PROPO | the first 2-3 classes are done at an easy-to-moderate effort (about 5-6 out of 10), seated, with low resistance, and the user stops at unusual muscle pain / dark urine, severe muscle pain or weakness after a class = see a doctor (safety copy for the product, LEGAL REVIEW) / class count adds to the plan's aerobic sessions; more classes = fewer gym aerobic sessions (COACH-R2 SES-06 adjustable) | sports/genpop-active.json | 3 profiles |

Injury-code aliases: SHOULDER_SWIMMER_PADDLER -> SHOULDER_SWIMMER, BONE_LOW_IMPACT -> BONE_LOADING_NON_IMPACT
| KNEE_DEGENERATIVE_COURT | SCIENCE K34c (UC Davis orthopaedics: arthritis flare-ups, meniscus tears, Achilles ruptures and rotator-cuff tears among the most frequent pickleball injuries;  | knee-friendly strength 2-3 x / week: leg press, box squat to a pain-free depth, split squat and step-up (low box first), leg extensions with slow eccentrics and isometric holds; quads and glutes are the knee's shock absorbers (INFERRED) / lateral hip strength every week (side lunges / lateral step-ups - UNI-12; LEAD_HIP_GLUTE list) so the knee does not collapse inward on wide reaches / pivot control: short-step COD (EASY TURN -> MOD. TURN), no deep loaded pivoting on a planted foot under fatigue; deep knee flexion under load only when pain-free (KNEE_DEEP_FLEXION logic) / a painful or swollen knee: COACH-ANSWER VOL-03 (cut 30-50 %, machines, keep moving) and refer to a professional for locking / giving way (outside the tool) / no bands (EQ-01): isometric holds use machines, a wall sit or DB holds | added in the v1.1 sport verification | 4 profiles |

## 11. Library gaps the profiles need

> **Changed in v1.3** (COACH-R4 R4-LIB-01, R4-LIB-02). The proposed additions are live as optional add-ons (never picks; wall balls and sled pushes in HYROX excepted). Carries and drags are dosed by distance or time and count no muscle sets. Neck work stays proposed. Where the text below differs, the v1.3 section at the top of this file wins.

- **No SPRINT slot in any BYOP template** - OBSERVED: in BYOP only ' Max velocity running (top speed)' (PLYOS ADVANCED G128 and FULL JUMPING J11). MASTER_MODEL has Sheet23 '✅ MACH DRILLS' / '✅ Acceleration starts' (B48/B49), the cheat-sheet 'RUNNING WARMUP', UL/PPL A-drills, BASEBALL '30m acceleration sprint'. COACH-ANSWER LIB-21: add MACH dr (needed by: soccer, football skill, track, basketball, baseball position players; every speed athlete in season (PER-08))
- **No ground-contact / plyo-vs-ballistic tag on the athletic library items (NEW in v1)** - COACH-ANSWER ATH-01 / CAT-10 make the split a programming variable; the library only has PLYOS / FULL JUMPING / JUMPING ANKLE / THROWING columns; v1 classifies by keyword (v1_power_mix.py, INFERRED) (needed by: every athletic profile (the generator needs a PLYO / BALL / JLK / landing tag per item; the plyo METHOD STAGE is a way of performing a jump chosen per block, not a fixed property of the exercise - COACH-ANSWER CAT-11; only items whose name fixes it, e.g. 'Stick the landing', carry a default stage))
- **REPS menu cannot express contacts, throws per side, metres, seconds or 1-3 reps** - OBSERVED AW8:AW14 '4 to 6 Reps' .. '20 Reps', 'MYO SET' (needed by: every athletic profile)
- **No neck exercises** - OBSERVED: none in the library or programs; not asked in the questionnaire (needed by: wrestling, BJJ, MMA, football, Muay Thai, hockey)
- **CARRY and DRAGS headings have no exercises** - OBSERVED BA/BB columns hold only sub-headings (CARRY: 'PROPULSIVE', 'STATIONARY', 'BILATERAL', 'UNILARTERAL'; DRAG: 'SAGITAL', 'FRONTAL'); carries are programmed in BASEBALL (E47, S65, W49) and CONTROL PATTERNS (B10). COACH-ANSWER LIB-19: build them out (athletes, general fitness; slings for advance (needed by: wrestling, BJJ, MMA, linemen, general population)
- **Rear-delt / external-rotation work has no own slot** - OBSERVED: reverse flies share the 'ABdution' list; COACH-ANSWER VOL-17: rear delts need sets every week (v1.2: as part of the shoulders group - COACH-R3 VOL-01) (needed by: every profile (throwers and racket athletes first))
- **Frontal / transverse lower-body moves missing from the main library** - COACH-ANSWER LIB-20: add 'Hold between knees Squats', cossacks etc. from RESISTANCE PATTERNS for court and combat athletes (strap rotations excluded - LIB-09); UNI-12 (needed by: basketball, tennis, soccer, MMA, hockey, combat)
- **Reactive agility is defined but not programmed** - OBSERVED AGILITYCOD tab ('Agility: Reactive in nature - Incognitive Competence' vs 'COD: Proactive in nature - Cognitive Competence'; empty headings 'HOPS IN PLACE', 'KRUMRIE FORMATION', 'MUNOZ FORMATION', 'EIGHT SQUARE PLYOMETRIC FORMATION', 'FOUR SQUARE FORMATION', 'RUNNING ROUTES', 'ROUTE TREE'); (needed by: basketball, soccer, football, tennis, combat)
- **No observed COD in any MASTER_MODEL program** - OBSERVED AP_COD = 0 in athletic, boxing, baseball (needed by: decide whether sport practice covers COD)
- **No equipment tags on the library** - OBSERVED; equipment answers EQ-01..16 (no bands, constraint scale 1-5) (needed by: home / no-gym clients; youth; older adults)
- **Exercises the v1.1 sports need (PROPOSED-ADDITION, never band-based)** - combat-strength-fitness.json Q12; aquatic-endurance-track.json (swim dryland); genpop-active.json (pickleball / HYROX) (needed by: hangboard (climbing); neck 4-way isometrics (wrestling, judo, MMA, Muay Thai, rugby, lacrosse, soccer defenders); carries / drags (strongman, HYROX, OCR); sled push / pull and wall balls (HYROX); rope climb / dead hang / monkey bars (OCR); handstand push-up progression and parallette holds (gymnastics); log / axle / yoke / stones (strongman); prone Y / T, streamline holds, cable / DB external rotation (swimming); split-step and lateral shuffle drills (pickleball / padel / tennis))

## 12. Open questions

### 12.1 Round-3 candidates (for the coach) - v1.2 status added

- **R3-01** Recreational players: should their plyometric share follow their sport (golf 25 %, running 75 %, soccer 60 %) or always the weekend-warrior 50 %? (from F5 / M-REC-CLASS) - **v1.2: ANSWERED** (COACH-R3 ATH-04: recreational players use their activity's share (golf 25 %, running 75 %, rec soccer 60 %); a bit of everything 50 %)
- **R3-02** Does the floor of 10 sets per muscle apply to athletes in every block, or only to the muscles their off-season plan trains for size / strength? Are rear delts (4 / 6 / 8 own sets) exempt? (from F2 / F3) - **v1.2: PARTLY ANSWERED** (COACH-R3 VOL-01 (rear delts part of the shoulders group; floor on groups) + R3-SES-01 / SES-02)
- **R3-03** Sports you did not name in round 2 (lacrosse, field hockey, rugby, cheer, ultimate, flag, beach volleyball, swimming, diving, water polo, track field events, cycling, rowing, skiing, judo, taekwondo, gymnastics, climbing, pickleball, padel, HYROX, OCR): are the proposed contact classes and aerobic counts right? (table in 04_athlete_profiles.md section 4; swimming moved to class 5 / 25 % in the v1.1 sport verification - starts and turns are one big effort = ballistic) (from team O3, aquatic O3, combat Q6 / Q14) - **v1.2: ANSWERED** (COACH-R3 ATH-04 (classes and off-season cardio 2-4), ATH-01 (swimming), ATH-03 (HYROX))
- **R3-04** In-season game-heavy rule: extend it to lacrosse, field hockey, rugby, ultimate, flag football, beach volleyball and tennis tournaments? (from team O3) - **v1.2: ANSWERED** (COACH-R3 ATH-04 for lacrosse, field hockey, rugby, ultimate, flag football and beach volleyball; tennis tournaments were not in the final question (still INFERRED))
- **R3-05** HYROX / OCR race blocks keep 4 aerobic sessions (not the athletes' 2)? (from F6 / combat Q4) - **v1.2: ANSWERED** (COACH-R3 ATH-03 for HYROX (4 cardio); OCR PROPOSED by analogy)
- **R3-06** Swimmers, runners, cyclists, rowers: 0 extra gym cardio because their practice is the aerobic work - right? And a championship / goal-race date for the taper? (from aquatic O4 / O9) - **v1.2: ANSWERED** (COACH-R3 ATH-01 (swimmers 0 extra, 2-week taper with the swim taper), ATH-04 (runners, rowers, endurance cyclists 0 extra), ATH-05 (event date for gen pop))
- **R3-07** 60+: by default only landing drills (step-down and stick), balance and light throws; low ankle hops, other plyos, Olympic lifts and depth jumps are opt-in with the warning. Right? (v1.1 applied this stricter reading of your words) (from F9) - **v1.2: ANSWERED** (COACH-R3 ATH-02 (approved as written; depth jumps switchable))
- **R3-08** Olympic weightlifting as a sport: will you write (or approve) its own %-based template? (from combat Q8) - **v1.2: OPEN** (not asked in round 3)
- **R3-09** Spanish names: approve the sport, position and activity names line by line (COACH-R2 GEN-08). (from team O9, combat Q15, genpop GP-10) - **v1.2: OPEN** (not asked in round 3)
- **R3-10** New 'stay athletic and active' choices added for completeness: boxing / kickboxing / martial-arts classes, climbing gyms and a first obstacle race (Spartan / Tough Mudder), plus routes for badminton / squash, disc golf, bowling, trail running, mountain biking, kayak and wakeboard, and skateboarding / surfing / speed skating for athletes. Keep, remove or add any? (from v1.1 sport verification) - **v1.2: OPEN** (not asked in round 3)
- **R3-11** Pickleball / padel / tennis players 50+: knee-friendly strength, calf / Achilles work every leg day, cuff work and low-impact jumps only (no depth jumps, hurdle hops or bounds) by default - right? (from v1.1 sport verification (age_50_plus)) - **v1.2: ANSWERED** (COACH-R3 ATH-02 (approved))

### 12.1b New questions after round 3 (v1.2)

- **Q12-1** 'Goalkeepers 50 %': we kept the ice-hockey goalie with hockey (40 %) and the water-polo goalkeeper with water polo (25 %). Right? (from G1)
- **Q12-2** 60+ who switch the Olympic lifts on: still no snatch variants (round-1 EQ-03), only hang cleans, KB squat cleans, hex-bar jumps and pulls? (from G2)
- **Q12-3** Swimmers with 2 dryland days: 'younger' = age-group swimmers under about 14, 'lower-level' = training under a year (L1)? (from G3)
- **Q12-4** Sports not in your round-3 list (horizontal jumpers 75 %, triathlon 75 %, ultimate handlers 50 %, freestyle ski 50 %, strongman / weightlifting 25 %, OCR 50 %): keep these shares? (from G8)
- **Q12-5** Tennis tournaments, pickleball tournaments, cheer, gymnastics and wrestling: use the in-season game-heavy rule too (now INFERRED)? (from R3-04 remainder)
- **Q12-6** Generic 50-59 (not a racket player): keep the full adult athletic plan (jumps, Olympic lifts) with extra calf / landing care? (from active_aging_50plus.confirm)

### 12.1c After round 4 (v1.3)

- **Answered:** sport profiles carry a confidence label (COACH-R4 R4-SCP-03); the proposed sport exercises are optional add-ons (R4-LIB-01); GP-2, the floor on 2-day plans (R4-SES-03).
- **Not asked in round 4, defaults kept:** Q12-1 to Q12-6, R3-08 and R3-09.
- **New, for the coach:** do the athletic days keep each slot's laterality when the sport asks for 80-90 % single-leg work (`BLAZE_CAMP_BRAIN.md` §0d.3 #3)? Wall balls and sled pushes in the CrossFit-style class WOD ("maybe")?

### 12.2 Questions raised by the sports files

| id | Source | Topic | Detail | Status |
|---|---|---|---|---|
| O1 | team.json | Floor of 10 weekly sets per muscle vs athlete budgets | COACH-R2 VOL-04/06: 'I don't think anybody needs less than 10 sets a week per muscle.' The 04 athlete budgets reused here give field athletes far fewer direct upper-body sets (e.g. soccer chest about 2-4). Proposed reading: the floor applies to muscles the athlete's plan trains for size / strength in the off-season; pre-season (about 60 %) and in-season blocks are maintenance phases and may sit below 10. Needs the coach's yes. | OPEN - flag to the volume engine owner - **v1.2: PARTLY ANSWERED by COACH-R3 VOL-01 / SES-01: the floor of 10 is counted on groups in training blocks; maintenance, pre- and in-season stay lower; 12_volume_algorithm v1.2 §3.4 sets the athlete group floors (chest, back, shoulders to 10; arms from compound credit)** |
| O2 | team.json | 2-4 exercises per muscle on full-body days vs the 12 + 2 cap | COACH-R2 SES-05 (2-4 exercises per muscle on full-body days, never 1) and COACH-R2 SES-04 (field athletes up to 12 exercises + 2 core) collide on athletic full-body days that already hold 4-6 athletic exercises. Proposed: 2-4 exercises for each muscle TRAINED that day (knee + pull day / hip + push day pairing), not for every muscle; athletic exercises do not count toward the cap's resistance part. | OPEN - **v1.2: ANSWERED by COACH-R3 SES-01: 2-4 exercises for each group trained that day (knee + pull day, hip + push day) inside 12 + 2 core; cross pattern (default) leaves 2 jump / throw stations + 1 Olympic lift; the same-pattern template for size-focused / high-level athletes** |
| O3 | team.json | Sports not on the coach's approved lists | COACH-R2 ATH-01 (plyo share by class) and ATH-06 (aerobic sessions) named basketball, volleyball, soccer, football, baseball, softball and hockey. Lacrosse, field hockey, rugby, cheer / STUNT, ultimate, flag and beach volleyball use INFERRED classes and PROPOSED aerobic counts. COACH-R2 ATH-07 (game-heavy in-season reductions) is extended to lacrosse, field hockey, rugby, ultimate, flag, beach and cheer by analogy. | OPEN - needs coach confirmation - **v1.2: ANSWERED by COACH-R3 ATH-04 (shares, off-season cardio 2-4, game-heavy rule for lacrosse, field hockey, rugby, ultimate, flag football, beach volleyball); cheer stays INFERRED (Q12-5)** |
| O4 | team.json | In-season sprints for non-speed athletes | COACH-R2 ATH-07 says in-season sprints only for speed athletes; the 04 HAMSTRING rule keeps one max-velocity exposure a week in every phase. Resolved here as: games supply it; athletes with few game minutes keep one exposure (INFERRED). Basketball guards are no longer given in-season sprints (04 v1 INFERRED content superseded). | PROPOSED resolution |
| O5 | team.json | Baseball / softball in season | Not on the ATH-07 game-heavy list. The coach's OBSERVED Block 3 kept 4 days at 4 x 10 with no Olympic lifts; PER-08 says about 2 lifting days, and COACH-R2 ATH-04 approves a light Olympic piece in season. Profiles use 2 days + the light piece; the 4-day observed version stays evidence. | OPEN (carried from 04 v1) |
| O6 | team.json | Recreational league game days | GEN-02 gives recreational players no season. Many rec players have a fixed weekly game. Proposed: an optional 'league game day' input that keeps the hardest lower-body day >= 48 h away and swaps one aerobic session for the game. | PROPOSED - **v1.2: ANSWERED by COACH-R3 ATH-05: play days (the hardest gym day >= 48 h before the biggest play day; 3+ play sessions -> no extra agility drills, half the jumps); a 45-60+ min session counts as one of 3 cardio sessions (up to 2)** |
| O7 | team.json | Beach volleyball class | Indoor volleyball is class 2 (60 %, COACH-R2 ATH-01). Sand slows the take-off (T20), so beach is set to class 3 (50 %) - PROPOSED. | OPEN - **v1.2: ANSWERED by COACH-R3 ATH-04 (beach volleyball 50 %)** |
| O8 | team.json | Neck work for more sports | Neck isometrics added for lacrosse, field hockey, rugby, cheer, flag and soccer defenders on the concussion / neck-strength evidence (T38). The library still has no neck column (04 library gap). | OPEN - library gap |
| O9 | team.json | Spanish names | All name_es values are drafts in neutral Latin American Spanish with English terms in brackets; the coach (or a coach he trusts) approves every line (COACH-R2 GEN-08). 'Cheerleading (porrismo)' and the field-hockey / lacrosse terms especially need a check. | PENDING approval |
| O1 | aquatic-endurance-track.json | Floor of 10 weekly sets per muscle vs athlete budgets | COACH-R2 VOL-04/06 ('I don't think anybody needs less than 10 sets a week per muscle'). Every athlete budget here leaves non-sport muscles (chest, arms, side delts, often calves in 3-day plans) below 10 - see derived.muscles_below_floor_10. PROPOSED reading (same as team.json O1): the floor applies to the muscles the athlete's plan trains for size / strength (resistance.priorities); pre-season (~60 %) and in-season (~40 %) are maintenance-like and may sit below 10. Needs the coach's yes. | OPEN - **v1.2: PARTLY ANSWERED by COACH-R3 VOL-01 / SES-01: the floor of 10 is counted on groups in training blocks; maintenance, pre- and in-season stay lower; 12_volume_algorithm v1.2 §3.4 sets the athlete group floors (chest, back, shoulders to 10; arms from compound credit)** |
| O2 | aquatic-endurance-track.json | Rear delts: own sets 4 / 6 / 8 vs the floor of 10 | COACH-R2 VOL-04 approved rear delts at 4 / 6 / 8 own sets, but the same answer says nobody needs fewer than 10. Swimmers / water polo / javelin get 6 own sets + 0.25 credit from rows (about 7.5-8); others 4 (about 5-6). PROPOSED: rear-delt own sets count toward the floor only as 'shoulder health' work - coach to confirm whether rear delts are exempt from the floor. | OPEN - **v1.2: CLOSED by COACH-R3 VOL-01** (rear delts part of the shoulders group) |
| O3 | aquatic-endurance-track.json | Ground-contact classes for sports not on the approved R2-ATH-01 list | Approved: sprinters 75 %, weekend warriors 50 % (and the team / combat sports). PROPOSED here: swimming class 4 (40 %; block ~0.7 s, wall ~0.3 s), diving 4 (40 %), water polo 5 (25 %), high jump 2 (60 %), pole vault 2 (60 %), javelin 3 (50 %), throwers 4 (40 % - corrects the 04 variant that inherited the sprinter's class), middle / distance / XC / triathlon 1 (75 %), cycling 4 (40 %), rowing 5 (25 %), alpine skiing 4 (40 %), freestyle 3 (50 %). | OPEN - **v1.2: ANSWERED by COACH-R3 ATH-04 / ATH-01 (swimming, water polo, rowing 25 %; diving, alpine skiing, cycling, throwers 40 %; javelin 50 %; high jump, pole vault 60 %; runners 75 %); triathlon and freestyle ski stay PROPOSED (G8)** |
| O4 | aquatic-endurance-track.json | Championship / goal-race date for meet and race sports | COACH-R2 GEN-05 approved 'next season start date + practice / game days'. Swimmers, track athletes, runners, triathletes, rowers and skiers peak at the END of the season, so the taper needs the main championship / goal-race date. PROPOSED: one optional extra tap for these sports. | OPEN - **v1.2: ANSWERED by COACH-R3 ATH-01 (main championship meet: 2-week dryland taper lined up with the swim taper; 1 week or none before smaller meets) and ATH-05 (event date for gen pop); the meet / race date is an intake field** |
| O5 | aquatic-endurance-track.json | Sport load (pool yardage, mileage) and the dryland stairway | The coach rejected lifestyle inputs (COACH-R2 GEN-04) and no check-in = no change (COACH-R2 VOL-03). So the tool does NOT ask yardage / mileage; a hard sport week reaches the plan only through the check-in (effort, completion, pain - COACH-R2 VOL-01). Flag: confirm that no 'sport volume this week' question is wanted. | OPEN (resolution applied: no extra input) - **v1.2: CLOSED by COACH-R3 VOL-02 / VOL-04** (no check-ins; the swimmer or coach lightens a heavy pool week themselves) |
| O6 | aquatic-endurance-track.json | Run plans other than the half marathon | The only coach running plan is the Chris Hinshaw half-marathon plan (PRG-12, COACH-R2 LIB-06); the 21.6-mile run is removed. 5K-10K, marathon, cross-country and triathlon athletes get the strength plan + 'follow your own run plan'. Should the tool offer more run plans later (coach-written)? | OPEN |
| O7 | aquatic-endurance-track.json | Borrowed half-marathon plan vs the block rules | The Hinshaw plan (used as-is) has cut-back weeks 3/6/8/12/18 and '1-mile at max effort' tests in weeks 10 and 14, while the coach's rules say no deload inside a block (COACH-R2 VOL-07) and no mid-block tests (COACH-R2 PER-07). PROPOSED: the borrowed run plan stays exactly as written; the Blaze strength block beside it follows the stairway and tests only at start and end. | OPEN |
| O8 | aquatic-endurance-track.json | New ath03 group 'endurance' | 04 put distance runners under 'health'. PROPOSED: a new 'endurance' group for runners, distance swimmers, triathletes, endurance cyclists and rowers (strength for economy and tissue capacity, not mass). | OPEN |
| O9 | aquatic-endurance-track.json | Sport practice = the aerobic sessions | Swimmers, water polo players, runners, triathletes, cyclists and rowers get 0 extra gym colour sessions because their sport practice is the aerobic work (04 distance_runner rule); recreational users' own swims / runs / rides fill the 3 general sessions (ATH-07). Users can add or remove (COACH-R2 SES-06). | OPEN (PROPOSED default) - **v1.2: ANSWERED by COACH-R3 ATH-01 / ATH-04 (0 extra gym cardio for swimmers, runners, rowers and endurance cyclists; the user can add one)** |
| O10 | aquatic-endurance-track.json | Olympic lifts for endurance athletes | 'Everyone in athletic training gets Olympic lifts' (ATH-10). Endurance profiles keep a small dose (2-3 sets / 1-2 exposures: hex-bar jumps, hang pulls, KB squat clean). Confirm that this low dose is what he wants for runners, triathletes and cyclists. | OPEN |
| O11 | aquatic-endurance-track.json | Overlap with genpop-active.json | The rec_ profiles here (swimming, running, cycling, triathlon, rowing, ski prep) may duplicate the 'stay athletic and active' set; the merge keeps one id per activity. | RESOLVED at the v1.1 merge (see merge_log / v1_1_resolution_flags) |
| O12 | aquatic-endurance-track.json | 2-4 exercises per muscle on full-body days vs the 12 + 2 cap | COACH-R2 SES-05 vs SES-04 (same as team.json O2): applied as 2-4 exercises for each muscle TRAINED that day (knee + pull / hip + push pairing); athletic exercises do not count toward the resistance part. Swimming / diving / water polo 3-day plans land at about 11-12 exercises + 2 core. | OPEN - **v1.2: ANSWERED by COACH-R3 SES-01: 2-4 exercises for each group trained that day (knee + pull day, hip + push day) inside 12 + 2 core; cross pattern (default) leaves 2 jump / throw stations + 1 Olympic lift; the same-pattern template for size-focused / high-level athletes** |
| Q1 | combat-strength-fitness.json | Floor of 10 weekly sets per muscle vs these budgets | COACH-R2 VOL-04/06: 'I don't think anybody needs less than 10 sets a week per muscle.' derived.floor_10_check shows that most fighters, court and relative-strength athletes (climbers, gymnasts) sit below 10 for chest, side delts, arms and (with the 0.25 credit of COACH-R2 VOL-05) glutes; the physique budget reused from 04 also shows chest, side delts and arms below 10 before its 12 Focus sets are assigned. Proposed reading (same as team.json O1): the floor applies to muscles a plan trains for si | OPEN - flag to the volume engine owner - **v1.2: PARTLY ANSWERED by COACH-R3 VOL-01 / SES-01: the floor of 10 is counted on groups in training blocks; maintenance, pre- and in-season stay lower; 12_volume_algorithm v1.2 §3.4 sets the athlete group floors (chest, back, shoulders to 10; arms from compound credit)** |
| Q2 | combat-strength-fitness.json | Weightlifting and the two-axial-days rule | COACH-R2 SES-01/02: heavy squat and heavy deadlift on two different days, other days non-axial; the approved exception is a light technique squat or deadlift for powerlifters. Weightlifters traditionally squat heavy 2-3x a week. Proposed: heavy back squat day + heavy pull (clean deadlift / pull) day; the front squat stays light-moderate (same exception as powerlifters). Needs the coach. | OPEN |
| Q3 | combat-strength-fitness.json | Fight camps vs COACH-R2 PER-06 and the OBSERVED boxing build-up | The OBSERVED boxing tab builds weeks 3-8 (+41 % component sets) with a week-7 mini-deload. COACH-R2 VOL-07 removes deloads inside a block, and COACH-R2 PER-06 makes the pre-season block about 60 % of off-season sets with more speed and power + a 1-2-week taper. Resolution used: off-camp = off-season blocks (the 8-week build is the coach's example of one), camp = the 4-6-week pre-season block at about 60 %, then the 1-2-week taper to the fight; the week-7 mini-deload is retired as a default (OBSE | PROPOSED resolution - confirm |
| Q4 | combat-strength-fitness.json | Aerobic sessions in race-prep blocks (HYROX, OCR) | COACH-R2 ATH-06 approved 'pre-season 2' for athletes. HYROX is about 60 % running (K18) and OCR is mostly trail running, so cutting to 2 aerobic sessions before a race would remove the main work. Proposed: HYROX / OCR keep 4 in the race-specific block (3 between races); gym sets still drop to about 60 % (COACH-R2 PER-06). | OPEN - **v1.2: ANSWERED for HYROX by COACH-R3 ATH-03 (4 cardio sessions); OCR by analogy (PROPOSED)** |
| Q5 | combat-strength-fitness.json | 60+ competitive athletes (senior pickleball, masters lifters, masters grapplers) | COACH-R2 ATH-08: 60+ get no Olympic lifts, plyos or depth jumps by default, with an opt-in and the warning 'Make sure that you have a fitness professional to help you understand what this means.' Our round-2 proposal also said landing drills and low ankle hops stay OK; the coach's words say no plyos by default. Profiles use the stricter reading (none by default; balance, step-ups and fast-intent resistance instead). For a masters weightlifter the Olympic lifts are the sport - they opt in with th | OPEN - **v1.2: ANSWERED by COACH-R3 ATH-02 (60+ defaults; Olympic lifts, other jumps and depth jumps switchable with the warning - a masters weightlifter switches the lifts on)** |
| Q6 | combat-strength-fitness.json | Taekwondo ground-contact class | 04 shared one class (5, 25 %) for karate and taekwondo; the coach approved karate at 25 % (COACH-R2 ATH-01). Taekwondo's bouncing stance and jump / spinning kicks could argue for class 4 (40 %). Kept at class 5 with a slightly higher budget (28 %). | OPEN - **v1.2: ANSWERED by COACH-R3 ATH-04 (taekwondo 25 %)** |
| Q7 | combat-strength-fitness.json | ATH-03 group for HYROX and OCR | 04 places the hybrid product and distance runners in 'health'. Competitive HYROX / OCR racers are not a health goal. Proposed new group 'hybrid_endurance' (strength-endurance + aerobic) at the merge; until then they use 'health' per the 04 convention. | RESOLVED at the v1.1 merge (see merge_log / v1_1_resolution_flags) |
| Q8 | combat-strength-fitness.json | Competitive Olympic weightlifting is its own programming | COACH-R2 GEN-06: '% only ... unless you're a competitive Olympic lifter. That becomes a nuance, and now the program needs to change to Olympic weightlifting programming.' The weightlifting profile is a scaffold (4-day snatch / clean & jerk week, % of each lift's 1RM, 1-3 reps on the competition lifts). The coach has not written one - needs his template or approval. | OPEN |
| Q9 | combat-strength-fitness.json | Where cleans and snatches sit in the week | COACH-R2 ATH-04: cleans read as squat-pattern, snatches as hinge-pattern, up to 4 exposures a week. team.json places cleans on knee days and snatches on hip days; the coach's own CrossFit split (OBSERVED) puts snatches on both lower days (Mon knee dom, Thu hip dom) and cleans on the upper days. Both are used here (team convention for athletes, OBSERVED split for CrossFit). Is the pattern a day-placement rule or only a balance rule? | OPEN |
| Q10 | combat-strength-fitness.json | CrossFit class / bootcamp muscle volume | In the OBSERVED class split only the strength / power slots are sets (about 15 a week); the WOD carries most of the work but is conditioning (VOL-10 logic), so every muscle sits below 10. Options: count WOD resistance movements at a fraction, or add a RESISTANCE slot (the FULL / HALF TIME tables have 'RESISTANCE LVL 1 = 2 SETS x 10'). This matters for the 'CrossFit-style bootcamp' sample plan the coach will grade (COACH-R2 GEN-07). | OPEN |
| Q11 | combat-strength-fitness.json | Physique contest prep and peak week | Proposed: prep = 1-2 full blocks (no deload inside, COACH-R2 VOL-07) at about 90 % of off-season sets with longer cardio and daily walks; peak week about -45 %, no new exercises. The tool gives no nutrition, water or posing-schedule advice (COACH-R2 GEN-04: workouts only). Division priority deltas (bikini glutes / shoulders, men's physique V-taper, wellness lower body) are PROPOSED. | PROPOSED |
| Q12 | combat-strength-fitness.json | Library additions needed by these sports | Hangboard (finger strength, climbing), neck 4-way isometrics (wrestling, judo, MMA, Muay Thai - 04 library gap), carries / drags exercises (CARRY / DRAGS columns are empty - LIB-19: strongman, HYROX, OCR), sled push / pull and wall balls (HYROX), rope climb / dead hang / monkey bars (OCR), handstand push-up progression and parallette holds (gymnastics), log / axle / yoke / stones (strongman). All PROPOSED-ADDITION, no bands (EQ-01). | OPEN - library owner |
| Q13 | combat-strength-fitness.json | Strongman yoke and farmers as axial loading | COACH-R2 SES-02 lists the axial lifts; strongman implements are not on it. The yoke produces the highest spine loads of the events studied (K14), so it is treated as axial and shares the squat day; heavy farmers share the deadlift day (INFERRED). | OPEN |
| Q14 | combat-strength-fitness.json | Medball for sports not in ATH-05 | COACH-ANSWER ATH-05 named baseball, boxing, MMA, tennis, golf (high), basketball, football (moderate), aesthetics (none). Judo / wrestling (T3), taekwondo / kickboxing / karate (T3, 04), pickleball (T2-T3 like tennis), HYROX / OCR / gymnastics / climbing / strongman (T1), weightlifting and powerlifting (none) are INFERRED. | OPEN |
| Q15 | combat-strength-fitness.json | Spanish names | All name_es values are drafts in neutral Latin American Spanish with English terms in brackets ('Halterofilia (Weightlifting)', 'Búlder (Bouldering)', 'Fisicoculturismo (Bodybuilding / Physique)'); the coach or a coach he trusts approves every line (COACH-R2 GEN-08). | PENDING approval |
| GP-1 | genpop-active.json | Does the activity count as aerobic? | Proposed: a moderate session of 45-60+ min (open-play pickleball, a padel or tennis match, walking golf, a hike, a ride, a swim, a class) replaces one of the 3 aerobic sessions, at most 2. ATH-07 fixes the count (3) but not what counts. | PROPOSED - ask the coach (round 3) - **v1.2: ANSWERED by COACH-R3 ATH-05 (a 45-60+ min session of the activity counts as one of the 3 cardio sessions, up to 2)** |
| GP-2 | genpop-active.json | Floor of 10 sets per muscle on 2-day plans | COACH-R2 VOL-04/06 ('nobody needs less than 10'). Runners, cyclists, swimmers and dance-class users are planned at 2 gym days; at 60 min the 05 2-day template leaves several muscles below 10 at mid-block (see derived.muscles_below_floor_10_at_mid_block). The engine lifts them (longer days, supersets, optional day). Alternative: treat the activity's own work as partial credit (e.g. swimming for lats). Needs a coach rule. | OPEN - volume engine owner - **v1.3: ANSWERED by COACH-R4 R4-SES-03 - on 2 days every big group is trained at about 6-8 weekly sets, the plan says so and suggests a third day; nothing is dropped and no exercises are piled on.** v1.2 (superseded): PARTLY ANSWERED by COACH-R3 SES-02 (time vs minimums: say so up front, offer more time, then train fewer groups directly, recommend supersets, keep the stairway climbing)** |
| GP-3 | genpop-active.json | Recreational profiles: the activity's class or the weekend-warrior 50 %? | COACH-R2 ATH-01 approved weekend warriors 50 %. sports/team.json gives every rec_* team sport 50 %. This file uses the activity's own class where its contact time clearly differs (golf / hiking / surf = 25 %; swimming / cycling / ski / kickball = 40 %, matching the competitive swimming, cycling and alpine-ski classes in sports/aquatic-endurance-track.json; running = 75 %), following the coach's rule that contact time sets the share (ATH-01). The merge should pick one convention. | RESOLVED at the v1.1 merge (see merge_log / v1_1_resolution_flags) |
| GP-4 | genpop-active.json | 60+ default: what stays | 05 v1.1 keeps landing drills and low ankle hops by default (the approved R2-ATH-08 proposal); the coach's added words say no plyos by default. This file keeps landing drills and low ankle hops, plus light medball throws and EASY-TURN reactive stepping (not plyos - INFERRED). Depth jumps: EQ-03 says never; R2-ATH-08's text lists them among the optional items. This file keeps them OFF even with the opt-in and never offers snatch variants (EQ-03). | OPEN - round 3 - **v1.2: ANSWERED by COACH-R3 ATH-02 (landing drills, balance, quick stepping, light throws, fast machine work on; low ankle hops, other jumps, Olympic lifts, depth jumps off and switchable with the warning)** |
| GP-5 | genpop-active.json | HYROX numbers | HYROX is not on the coach's approved class or aerobic lists. Proposed: class 3 (50 %), 4 aerobic sessions (A + B + C + a second C, like the approved aesthetics second Orange), 2 station circuits a week as density work not counted as muscle sets, wall balls with the race ball (EQ-06 exception). | PROPOSED - **v1.2: ANSWERED by COACH-R3 ATH-03 (the approved HYROX plan)** |
| GP-6 | genpop-active.json | Light footwork station for golf, HYROX and hiking | The 'stay athletic' wording asks for some agility; these activities need none. Proposed: one EASY-TURN footwork station a week (2 sets). | PROPOSED |
| GP-7 | genpop-active.json | Event date and the 1-week taper | 06 v1.1 proposes an optional event date for gen pop (race, tournament, trip) with a 1-week taper at about half the sets. The coach approved the 1-2-week taper for competitive athletes (R2-PER-06), not yet for gen pop. | PROPOSED (06 v1.1 14.3 #5) - **v1.2: ANSWERED by COACH-R3 ATH-05 (hardest weeks end 1 week before, then 1 easy week at about half the sets)** |
| GP-8 | genpop-active.json | Bone-loading 'impact snack' for cyclists and swimmers | ESSA suggests about 50 impacts a session several days a week for bone (G30); the plan gives about 60-80 jump and hop contacts a week in the gym. Proposed: an optional 2-3-min ankle-hop / jump-rope snack on ride or swim days (under 60, no osteoporosis). | PROPOSED |
| GP-9 | genpop-active.json | Kickball and other unresearched rec sports | No peer-reviewed kickball data were found; hotspots and class are INFERRED from softball. HYROX injury data come from a 2026 preprint (G11). | INFO |
| GP-11 | genpop-active.json | Duplicate recreational profiles in sports/aquatic-endurance-track.json | That file also defines rec_swimming, rec_cycling and rec_ski_snowboard (weekend-warrior 50 % convention). The intake (generator_spec v1.1 F11r) points to lap_swim, cycling_fitness and ski_snow_prep in this file. Proposed: keep the F11r ids from this file, fold the sibling's extra injury codes (KNEE_MEDIAL_KICK, LOW_BACK_EXTENSION, FALL_UPPER_LIMB, PATELLOFEMORAL_ITB) into them, and alias SHOULDER_SWIMMER_PADDLER / BONE_LOW_IMPACT to SHOULDER_SWIMMER / BONE_LOADING_NON_IMPACT. | RESOLVED at the v1.1 merge (see merge_log / v1_1_resolution_flags) |
| GP-10 | genpop-active.json | Spanish names | All name_es values are PROPOSED neutral Latin American Spanish with English gym words in brackets (COACH-R2 GEN-08) and need the coach's line-by-line approval; 'pickleball', 'kickball', 'HYROX' and 'flag football' stay in English (no common Spanish name). | PENDING APPROVAL |

### 12.3 Still pending from v1

- Ground-contact class per sport and the class -> plyo-share map (75/60/50/40/25) are PROPOSED - need coach approval, especially basketball = 50/50 ('good mix'), karate / boxing 25/75 and distance runners.
- Per-sport bilateral : unilateral values for sports the coach did not name (baseball, softball, golf, sprinters, linemen, wrestlers, volleyball, combat) are PROPOSED.
- Athlete OFF-season aerobic sessions (ATH-07 only fixes in-season = 2) are PROPOSED at 2-4 by sport.
- Doses for rear delts (4-6 sets/week), core for non-athletes (1 exercise/session) and striker press reduction (30-50% of base) are PROPOSED.
- Plyo method stage timing per plan length is PROPOSED (the coach described the order, not the weeks).
- Older-adult age threshold (PROPOSED 60+) not given by the coach.
- Added by the v1 verification (PROPOSED): the exercise-count consolidation rule for athlete days over the 12-exercise cap (session_load_check), the clamp of OBSERVED budgets to their plyometric band (boxer = karate, ath02_ranking_check.budget_check), contrast allowed through the pre-season build (season_families.field_court), and the hinge credit (muscle_credit_rules.hip_dominant) - open questions new_v1 #11-13.
- Added by the second v1 verification (PROPOSED): field-court pre-season multipliers (resistance 0.8, PLYO 1.2) and in-season multipliers (about half the weekly sets: resistance / core 0.5, PLYO 0.4, THROW 0.6) re-based on PER-08; BALL multipliers per phase; combat base phase with L1 Olympic variants and an about-4-week adapt part (PER-01); Olympic substitutes without snatch variants for older / injured athletes; the powerlifting second lower day non-axial - open questions new_v1 #14-16.
- Still open from v0 (not in the questionnaire): youth maturation input (Q15), neck library column (Q16, carries/drags confirmed by LIB-19), golf / tennis / hockey template choice (Q17), core plane rotation by day (Q12), lactate-clearance sports (Q13), position splits beyond pitchers (Q19), reactive-agility list (Q5), the hybrid 'AMRAP' row, CrossFit WOD count at level 4.
- Volume per muscle: the per-person 3/5/7% weekly rate, landmarks and set-addition order live in the volume engine (03 v1 / 12_volume_algorithm_v1); this file only carries the profile baselines.
- Classes, aerobic counts and in-season rules for sports not named by the coach: **answered in v1.2** (COACH-R3 ATH-04); the few sports on neither list stay PROPOSED (flag G8).
- Spanish names are drafts (R3-09).
- Floor-10 reading for athletes (R3-02): **partly answered** (COACH-R3 VOL-01, SES-01 / SES-02: groups; time-short plans train fewer groups directly) - group floors for athletes set by 12 v1.2.
- Weekly-set budgets of the new sports are PROPOSED (nearest 04 profile + deltas); the volume engine sets the real per-muscle numbers.
- synthesis/_build_04/render.py is stale (v1); v1.1 is built by the merge script.

## 13. Sources (SCIENCE)

- [S1] Basketball time-motion (jumps per game by position; ~1,050 activities, 5.3% of live time sprinting): Ben Abdelkrim et al. 2007 BJSM and related - https://bjsm.bmj.com/content/41/2/69 (04 v1)
- [S2] Basketball jumps backcourt 41 +/- 6 vs frontcourt 79 +/- 5 per game (search result, video time-motion) - https://ojs.ub.uni-konstanz.de/cpa/article/view/6622/5981 (04 v1)
- [S3] Volleyball jump counts per match by position (hitters 19.7-80, middles 52.5-77.2, setter ~104.5) - https://reference-global.com/article/10.1515/tperj-2017-0032 (04 v1)
- [S4] NSCA plyometric volume guide 80-100 / 100-120 / 120-140 contacts per session (Potach & Chu 2008), up to ~200 for trained adults (Chu & Myer 2013) - https://ojs.ub.uni-konstanz.de/cpa/article/view/6015/5496 (04 v1)
- [S5] Soccer: 726 +/- 203 turns per EPL match, 609 of 0-90 degrees (Bloomfield et al. 2007) - https://jssm.org/06-1-63.p_d_f (04 v1)
- [S6] Tennis: ~1.6 changes of direction per point, every ~2.7-3.1 s - https://jssm.org/tablejssm-16-489.xml/table004.xml (04 v1)
- [S7] MMA: high:low intensity 1:2-1:4; grappling ~1:1, striking up to 1:7 - https://pmc.ncbi.nlm.nih.gov/articles/PMC8439691 (04 v1)
- [S8] Amateur boxing: predominantly aerobic; activity:rest elite 18:1; post-bout lactate ~11.8 mmol/L - https://lida.sport-iat.de/ta/Record/4042892?lng=en (04 v1)
- [S9] Karate kumite / taekwondo effort-pause (karate HIA 1.5 s, 10 s effort : 16 s rest; TKD 8 s : 8 s) - https://pmc.ncbi.nlm.nih.gov/articles/PMC4009084 (04 v1)
- [S10] Elite kickboxing time-motion: HIA 2.2 s, LIA 2.3 s, pauses 5.4 s; fighting:non-fighting 1:1 (Ouergui) - https://paulogentil.com/pdf/Time-Motion%20Analysis%20of%20Elite%20Male%20Kickboxing%20Competition.pdf (04 v1)
- [S11] Ice hockey shifts 30-80 s with 4-5 min recovery; skating = hip extension, abduction, external rotation - https://pmc.ncbi.nlm.nih.gov/articles/PMC6224850 (04 v1)
- [S12] Hockey groin: pre-season adduction strength 18% lower in later-injured players - https://mikereinold.com/groin-injuries-in-hockey-players/ (04 v1)
- [S13] American football: plays ~5.3-5.7 s, ~33 s between plays, exercise:rest ~1:5.9 - https://www.ncbi.nlm.nih.gov/pmc/articles/PMC11701232/ (04 v1)
- [S14] Nordic hamstring exercise programmes reduce hamstring injuries by up to 51% (van Dyk et al. 2019) - https://bjsm.bmj.com/content/53/21/1362 (04 v1)
- [S15] Copenhagen adduction programme: 41% fewer groin problems (Harøy et al. 2019) - https://bjsm.bmj.com/content/53/3/150.abstract (04 v1)
- [S16] Strength + plyometric training 2-3x/week for 8-12 weeks improves running economy (meta-analysis) - https://www.ncbi.nlm.nih.gov/pmc/articles/PMC11052887/ (04 v1)
- [S17] Youth plyometrics: 2 sessions/week for low training age, 3-4 when competent (Lloyd & Oliver) - https://pure.cardiffmet.ac.uk/en/publications/plyometric-training-for-young-athletes/ (04 v1)
- [S18] Wrestling neck injury and cervical strength - https://scholars.georgiasouthern.edu/en/publications/the-effectiveness-of-cervical-strengthening-in-decreasing-neck-in/ (04 v1)
- [S19] BJJ physical demands (grip, isometric back strength) - NSCA Coach - https://www.nsca.com/contentassets/246f9b22016841e68ad57b43efe15f32/coach-10.2.6-developing-strength-power-and-endurance-in-the-brazilian-jiu-jitsu-athlete.pdf (04 v1)
- [S20] Neuromuscular training cuts non-contact ACL injury risk ~50% (trials in female athletes; the generator applies it by landing competency and injury history, never by sex - COACH-ANSWER ATH-09) - https://www.aafp.org/pubs/afp/issues/2011/0115/p210.pdf (04 v1)
- [S21] Jumper's knee prevalence: volleyball 44.6%, basketball 31.9% (Lian et al. 2005) - https://pubmed.ncbi.nlm.nih.gov/15722279/ (04 v1)
- [S22] NSCA older adults: 2-3 days/week, 2-3 sets per major muscle group, power at 40-60% 1RM (Fragala et al. 2019) - https://www.unm.edu/~lkravitz/Article%20folder/NSCApositionstand.html (04 v1)
- [S23] Golf: rotational power and lower-body RFD vs clubhead speed - https://bmcsportsscimedrehabil.biomedcentral.com/track/pdf/10.1186/s13102-017-0086-9 (04 v1)
- [S24] Golf low back injury and lead-hip load - https://pmc.ncbi.nlm.nih.gov/articles/PMC12358233 (04 v1)
- [S25] Baseball pitchers: up to 60% of shoulder and 40% of elbow injuries (college/pro); posterior cuff weakness and ROM deficits - https://pmc.ncbi.nlm.nih.gov/articles/PMC11545345 (04 v1)
- [S26] CrossFit injury locations: shoulder 6.7-40.6%, low back 12.9-36% - https://www.germanjournalsportsmedicine.com/archive/archive-2021/issue-7/musculoskeletal-injuries-in-crossfitr-a-systematic-review-and-meta-analysis-of-injury-rates-and-locations/ (04 v1)
- [S27] Tennis injuries: elbow 21.4%, shoulder 19.4%, lumbar 17.3% - https://pmc.ncbi.nlm.nih.gov/articles/PMC10594564/ (04 v1)
- [S28] Volleyball shoulder injuries mostly overuse from spiking - https://lida.sport-iat.de/ta/Record/4005400 (04 v1)
- [S29] Softball windmill pitching shoulder/elbow loads comparable to baseball; biceps eccentric load - https://pmc.ncbi.nlm.nih.gov/articles/PMC6704423 (04 v1)
- [S30] Hamstring injury mechanism in sprinting (late swing / early stance) - https://bmcmusculoskeletdisord.biomedcentral.com/track/pdf/10.1186/s12891-017-1716-9 (04 v1)
- [S32] Flanagan & Comyns 2008, Strength Cond J: ground-contact time and the reactive strength index to prescribe fast stretch-shortening-cycle (plyometric) training; fast SSC under ~250 ms vs slow SSC (Schmidtbleicher) - https://pure.ul.ie/en/publications/the-use-of-contact-time-and-the-reactive-strength-index-to-optimi/ (04 v1)
- [S33] Sprint acceleration kinematics: faster early accelerators show shorter ground-contact times; contacts ~0.14-0.16 s in acceleration (JSSM 2003 field-sport athletes; Swansea sprint data) - https://www.jssm.org/jssm-02-144.xml%3EFulltext (04 v1)
- [S31] Schoenfeld et al. 2017 dose-response: 10+ weekly sets per muscle > 5-9 > <5 - https://researchgate.net/profile/Brad-Schoenfeld/publication/305455324_Dose-response_relationship_between_weekly_resistance_training_volume_and_increases_in_muscle_mass_A_systematic_review_and_meta-analysis/links/59dc0269458515e9ab4527d6/Dose-response-relationship-between-weekly-resistance-training-volume-and-increases-in-muscle-mass-A-systematic-review-and-meta-analysis.pdf (04 v1)
- [T1] NCAA D-I football GPS: WR and DB cover the most distance, high-intensity running, sprints and max accelerations/decelerations; linemen the least (Wellman et al. 2016) - https://research.bond.edu.au/en/publications/quantification-of-competitive-game-demands-of-ncaa-division-i-col/ (sports/team.json)
- [T2] Lacrosse GPS by position (Japan national team): midfielders highest average speed and sprint distance - https://www.jssm.org/jssm-18-290.xml-abst (sports/team.json)
- [T3] NCAA lacrosse match loads: women 7,698 m total / 398 m sprint vs men 6,914 m / 210 m; men higher top speed (7.78 vs 6.93 m/s) and more accelerations (70 vs 57); men's midfielders highest intensity (Fields et al. 2023, J Funct Morphol Kinesiol) - https://pmc.ncbi.nlm.nih.gov/articles/PMC10443359/ (sports/team.json)
- [T4] Lacrosse physiological analysis (NSCA / Human Kinetics): all three energy systems; defenders strongest (NCAA D-I 1RM data); attack and midfield most agile; FOGO and goalie need close-range reactive agility - https://us.humankinetics.com/blogs/excerpt/general-physiological-analysis-for-lacrosse (sports/team.json)
- [T5] NCAA women's lacrosse injuries 2014-19: 4.99 / 1000 AE; ankle sprains 9.1%, concussions 7.2%, hamstring 3.8% - https://www.sponet.de/sponet/Record/4071926?lng=en (sports/team.json)
- [T6] NCAA men's lacrosse game injuries: ankle sprains 11.3%, knee internal derangement 9.1%, concussion 8.6% (Dick et al. 2007) - https://pmc.ncbi.nlm.nih.gov/articles/PMC1941301 (sports/team.json)
- [T7] Field hockey: 30-50 degrees of trunk flexion for most of play; 3-5x the low-back-pain risk of other sports; LBP prevalence about 33-60% - https://www.sportsinjurybulletin.com/improve/lower-back-pain-in-field-hockey (sports/team.json)
- [T8] Field hockey peak running intensity by position: forwards 194, midfielders 189, defenders 183 m/min; forwards fastest - https://johk.pl/?p=6048 (sports/team.json)
- [T9] NCAA women's field hockey injuries 2014-19: 6.27 / 1000 AE; head/face 16%, thigh 12.3%; concussion 8.6%, ankle sprain 6.7% - https://pmc.ncbi.nlm.nih.gov/articles/PMC8293883 (sports/team.json)
- [T10] Rugby union: forwards do more collisions, backs more high-speed running (worst-case scenario analysis) - https://www.ncbi.nlm.nih.gov/pmc/articles/PMC5433699/ (sports/team.json)
- [T11] Professional rugby union match injury incidence about 87 / 1000 h; tackle involved in about half of injuries; concussion the most common diagnosis (16-season review) - https://blogs.bmj.com/bjsm/2020/12/05/the-low-down-on-trends-in-match-injury-risk-in-professional-male-rugby-union-a-16-season-review/ (sports/team.json)
- [T12] Rugby sevens: high-intensity intermittent running + contact, about 6 matches over 2-3 days per tournament - https://lida.sport-iat.de/ta/Record/4048163 (sports/team.json)
- [T13] US cheerleading: stunts cause about 60% of injuries and 96% of concussions / closed head injuries; bases and spotters most often injured; ankle, low back and wrist re-injured most - https://www.bisp-surf.de/Record/PU201010007430 (sports/team.json)
- [T14] Cheer pop-off dismount landings: 2.1-14.9 body weights (flyers about 6 BW) - https://www.ncbi.nlm.nih.gov/pmc/articles/PMC11347287/ (sports/team.json)
- [T15] Tumbling take-off contact about 120-130 ms (double back somersault, World Championships); back handspring take-off about 0.13-0.18 s - https://ojs.ub.uni-konstanz.de/cpa/article/view/2934 (sports/team.json)
- [T16] STUNT (head-to-head competitive cheer): spring season (first contest Feb 1), NCAA championship sport from spring 2027 - https://stuntthesport.org/championship-status-media-guide (sports/team.json)
- [T17] Competitive ultimate (GPS): 4.7 km per game, 0.63 km high-intensity, 0.21 km sprinting, 17 sprints, mean HR 82% / peak 99% HRmax (Krustrup & Mohr 2015) - https://test01.ku.dk/:obvius/pureproxy/3974268/en/publications/physical-demands-in-competitive-ultimate-frisbee (sports/team.json)
- [T18] Ultimate injuries: muscle strains 76%, ankle 65%, knee 53%, shoulder 37%, head 30% of players; 49% recurrent (Reynolds & Halsmer 2006) - https://pubmed.ncbi.nlm.nih.gov/17042420/ (sports/team.json)
- [T19] Beach volleyball: 52-85 jumps per player per match, rallies about 8.5 s, blockers jump most (systematic review) - https://lida.sport-iat.de/ta/Record/4090916 (sports/team.json)
- [T20] Jumping on sand vs a rigid surface: lower jump height and longer time to reach peak take-off velocity - https://www.ncbi.nlm.nih.gov/pmc/articles/PMC10443322/ (sports/team.json)
- [T21] Beach vs indoor volleyball: similar external load, more small (<20 cm) jumps and higher heart-rate load on sand - https://www.ncbi.nlm.nih.gov/pmc/articles/PMC12522762/ (sports/team.json)
- [T22] Pro ice hockey: defensemen more time on ice (16:35 vs 14:39) and more decelerations; forwards more high-intensity work per minute - https://www.ncbi.nlm.nih.gov/pmc/articles/PMC9679183/ (sports/team.json)
- [T23] Butterfly goalies: high prevalence of symptomatic FAI (cam deformity) vs skaters - https://vivo.weill.cornell.edu/display/pubid25498869 (sports/team.json)
- [T24] Ice hockey skating: blade contact per stride shortens with speed but stays long (about 0.6 s at fast speed, ISBS proceedings) - https://ojs.ub.uni-konstanz.de/cpa/article/view/3781/3501 (sports/team.json)
- [T25] Soccer positions: central midfielders the most total distance, wide midfielders and full-backs the most high-speed running, centre-backs the least (but many accelerations) - https://www.ncbi.nlm.nih.gov/pmc/articles/PMC6843975/ (sports/team.json)
- [T26] Soccer goalkeepers: about 50% of outfield total distance and 10% of high-intensity distance; dives and explosive efforts rise late in matches - https://pure.solent.ac.uk/en/publications/understanding-workload-dynamics-in-football-goalkeepers-insights-/ (sports/team.json)
- [T27] Change of direction: ground contact time rises with cut angle (45 < 90 < 180 degrees); 45-degree cuts about 0.16-0.24 s - https://link.springer.com/article/10.1007/s40279-021-01448-3 (sports/team.json)
- [T28] Basketball positions: guards more distance, accelerations and decelerations; forwards more high-speed running; centres more jumps and rebounds (scoping review) - https://www.ncbi.nlm.nih.gov/pmc/articles/PMC12121883/ (sports/team.json)
- [T29] NCAA football injuries 2014-19: 9.31 / 1000 AE; concussion 7.5%, ankle sprain 6.9%, hamstring 4.7%; blocking and tackling common mechanisms - https://pmc.ncbi.nlm.nih.gov/articles/PMC8293875 (sports/team.json)
- [T30] NFL quarterbacks: shoulder 15.2% of injuries (AC sprains about 40% of them); overuse = rotator cuff / biceps tendinitis - https://www.springermedicine.com/common-injuries-in-professional-football-quarterbacks/22068126 (sports/team.json)
- [T31] Baseball catcher squat biomechanics (relaxed / ready stance, throw to second): repeated deep knee flexion - https://budc.barry.edu/AA00001243/00001/citation (sports/team.json)
- [T32] NFHS: football, basketball, girls volleyball, cross country, outdoor track in the same season in all 51 associations; boys soccer fall 32 / spring 14 / winter 5 states, girls 26 / 20 / 5; field hockey fall (16 states); lacrosse spring (23 states); baseball spring in 47 of 48 states - https://nfhs.org/stories/some-high-school-sports-are-played-in-all-three-seasons (sports/team.json)
- [T33] NFHS 2024-25 participation: boys top 10 = 11-player football, outdoor track, basketball, soccer, baseball, wrestling, cross country, golf, tennis, swimming; girls top 10 = outdoor track, volleyball, soccer, basketball, softball, competitive spirit (cheer, 206,262), tennis, cross country, swimming, lacrosse; girls flag football 68,847 (+60%), sanctioned in 16 states - https://www.si.com/high-school/national/high-school-sports-participation-hits-all-time-high-in-2024-25-fueled-by-growth-in-girls-programs-01k2z4rs5sgj (sports/team.json)
- [T34] CIF girls flag football ACL tears: 21 of 24 non-contact (pivot / cut / sudden stop), game risk 0.17 -> 0.64 per 1000 AE (2023 -> 2024) - https://doi.org/10.1177/2325967126S00167 (sports/team.json)
- [T35] Flag football is predominantly anaerobic: accelerations, decelerations, max sprints, jumps, COD (physical qualities of national-league female flag players) - https://repository.mmu.ac.uk/articles/journal_contribution/The_physical_qualities_of_national_league_female_British_American_flag_football_players/32549703 (sports/team.json)
- [T36] NCAA countable hours: in season max 20 h/week, 4 h/day, 1 day off; out of season 8 h/week - https://www.compliance.lsu.edu/countable-athletically-related-activities (sports/team.json)
- [T37] One strength session per week in season kept the strength, sprint and jump gains of pre-season in pro soccer players; one every second week did not (Ronnestad et al. 2011) - https://www.ncbi.nlm.nih.gov/pubmed/21873897 (sports/team.json)
- [T38] High-school athletes: each 1 lb more neck strength = 5% lower odds of concussion (Collins et al. 2014) - https://www.springermedicine.com/neck-strength-a-protective-factor-reducing-risk-for-concussion-i/21683656 (sports/team.json)
- [T39] NCAA football: 15 spring practices; NFL offseason program Phase I-III (Apr-Jun) then training camp late July - https://www.nationalfootballpost.com/nfl-rolls-out-offseason-program-with-usual-on-field-otas (sports/team.json)
- [T40] 2026 MLS regular season Feb 21 - Nov 7 (Cup final Dec); NWSL Mar 13 - Nov 1; NCAA soccer Aug - early Dec (College Cups Dec 10-14) - https://en.wikipedia.org/wiki/2026_Major_League_Soccer_season (sports/team.json)
- [T41] NHL 2025-26: Oct 7 - Apr 16, playoffs through June; NCAA D-I men's hockey Oct - April (Frozen Four) - https://www.wflx.com/2025/07/16/nhl-releases-2025-26-schedule-last-82-game-season-before-new-cba-increases-it-84/ (sports/team.json)
- [T42] NBA 2025-26: Oct 21 - Apr 12, playoffs from Apr 19, Finals June; NCAA men's basketball Nov - early April (March Madness) - https://www.nba.com/news/key-dates (sports/team.json)
- [T43] 2026 NCAA D-I baseball Feb 13 - Jun 22; softball Feb 5 - Jun 4; MLB spring training Feb 20 - Mar 24, season Mar 25 - Sep 27 - https://en.wikipedia.org/wiki/2026_NCAA_Division_I_baseball_season (sports/team.json)
- [T44] NCAA beach volleyball championship early May (Gulf Shores); men's college volleyball runs January into May - https://en.wikipedia.org/wiki/2026_NCAA_Beach_Volleyball_Championship (sports/team.json)
- [T45] Lacrosse calendars: NCAA early Feb - Memorial Day weekend; PLL 2026 May 8 - Sep 20; NLL (box) late Nov - May - https://en.wikipedia.org/wiki/2026_Premier_Lacrosse_League_season (sports/team.json)
- [T46] US rugby calendars: college fall 15s and spring 7s (National Collegiate Rugby); most high-school leagues in spring; MLR spring-summer - https://en.wikipedia.org/wiki/National_Collegiate_Rugby (sports/team.json)
- [T47] Cheer calendar: HS tryouts Mar-May, summer camp Jun-Jul, sideline Aug-Nov, competition Dec-Feb; all-star season summer to spring - https://www.cheerleading.com/when-is-cheer-season.html (sports/team.json)
- [T48] USA Ultimate: college season winter-spring; club regular season in summer, championship series in fall; AUDL about one game per week - https://en.wikipedia.org/wiki/USA_Ultimate (sports/team.json)
- [T49] Lacrosse ACL: male college lacrosse ACL rate about twice basketball; female lacrosse similar to male lacrosse - https://www.sportsmed.org/membership/sports-medicine-update/spring-2024/common-lacrosse-injuries (sports/team.json)
- [T50] MLB 2026 spring training and season dates - https://www.mlb.com/news/press-release-mlb-announces-2026-spring-training-schedule (sports/team.json)
- [T51] NWSL 2026 key dates - https://www.nbcphiladelphia.com/news/sports/soccer/nwsl-key-dates-2026-season/4367093/ (sports/team.json)
- [T52] NLL 2026 season dates - https://en.wikipedia.org/wiki/2026_NLL_season (sports/team.json)
- [T53] Major League Rugby season (spring - summer) - https://en.wikipedia.org/wiki/Major_League_Rugby (sports/team.json)
- [T54] 2026 NCAA D-I softball season dates - https://en.wikipedia.org/wiki/2026_NCAA_Division_I_softball_season (sports/team.json)
- [T55] NCAA D-I men's hockey 2024-25 season (Oct 4 - Apr 12) - https://en.wikipedia.org/wiki/2024%E2%80%9325_NCAA_Division_I_men%27s_ice_hockey_season (sports/team.json)
- [AQ1] Swim start: block time 0.70 +/- 0.04 s (kick start) vs 0.74 s (track start) in elite collegiate swimmers; 0.77 vs 0.80 s in another elite sample - https://coachsci.sdsu.edu/swim/biomechs/honda.htm (sports/aquatic-endurance-track.json)
- [AQ2] Tumble turns: wall contact time must be long enough to build push-off force in a streamlined position (Dutch national swimmers, force plate); mean wall contact ~0.32 s in another study - https://pmc.ncbi.nlm.nih.gov/articles/PMC9354539/ (sports/aquatic-endurance-track.json)
- [AQ3] Shoulder = most common injury site in competitive swimmers (prevalence 40-91%); NCAA: 34.7% (men) and 36.8% (women) of swim injuries involve the shoulder; rotator-cuff fatigue from thousands of strokes - https://pmc.ncbi.nlm.nih.gov/articles/PMC3435931 (sports/aquatic-endurance-track.json)
- [AQ4] Knee and back in swimming (Aspetar): 73% of breaststroke specialists report knee pain (75% at least 3 episodes a season); restricted hip internal rotation linked to knee pain; about 76% lifetime low back pain, butterfly / breaststroke highest (hyperextension, dolphin kick) - https://journal.aspetar.com/en/journals/volume-4-targeted-topic-aquatic-sports/the-knee-and-back-in-swimming (sports/aquatic-endurance-track.json)
- [AQ5] Systematic review, dry-land training and swim-turn performance: plyometrics 2-4 sessions/week of ~20-25 min for 6-10 weeks; strength at 85-100% 1RM, 1-6 reps, 4-5 sets improved push-off impulse and turn time - https://pmc.ncbi.nlm.nih.gov/articles/PMC8431432/ (sports/aquatic-endurance-track.json)
- [AQ6] Strength and power predictors of swim starts in international sprint swimmers: 15 m start time vs CMJ peak power r = -0.85, jump height r = -0.69 (West et al.); youth: 1RM squat and jumps r = -0.75 to -0.86 with 5 / 15 m times - https://researchportal.bath.ac.uk/en/publications/strength-and-power-predictors-of-swimming-starts-in-international/ (sports/aquatic-endurance-track.json)
- [AQ7] Taper meta-analysis (Bosquet et al. 2007; swimmers, cyclists, runners): about 2 weeks, training volume cut 41-60% exponentially, intensity and frequency kept - https://pubmed.ncbi.nlm.nih.gov/17762369/ (sports/aquatic-endurance-track.json)
- [AQ8] Swimming is not osteogenic; a 9-month jumping programme improved bone mass and fitness in adolescent swimmers and cyclists (PRO-BONE) - https://www.ncbi.nlm.nih.gov/pmc/articles/PMC4424564/ (sports/aquatic-endurance-track.json)
- [AQ9] USA Swimming year: short course (25 yd) September-March, long course (50 m) April-early August - https://www.gomotionapp.com/team/92fd/page/news/415778/usa-swimmings-short-course-and-long-course-seasons (sports/aquatic-endurance-track.json)
- [AQ10] High-school swimming and diving: season dates are set by each state association (example: Iowa girls' season memo); seasons run about 12-16 weeks, fall (Aug-Nov) in some states or for one sex, winter (Nov-Mar) in most - INFERRED from state pages - https://ighsau.org/news/swimming-and-diving-memo-8-11-22/ (sports/aquatic-endurance-track.json)
- [AQ11] NCAA Division I swimming and diving: conference championships mid-late February; NCAA Championships mid-late March (women one week before men) - https://swimswam.com/2026-ncaa-swimming-and-diving-conference-championships-primer-division-i/ (sports/aquatic-endurance-track.json)
- [AQ12] Training volumes: elite swimmers about 40-70 km/week; youth about 38-44 km/week; 11-14-year-olds ~5 practices of 90-120 min, 14-19-year-olds ~6 x 2 h a week - https://pmc.ncbi.nlm.nih.gov/articles/PMC5504587 (sports/aquatic-endurance-track.json)
- [AQ13] Shoulder pain and disability across the lifespan of competitive swimmers: 19.4% of masters swimmers (23-77 y), more at 40-60; risk = swim exposure, prior trauma, instability, less cross-training; pec-minor tightness and low core endurance in symptomatic swimmers - https://pmc.ncbi.nlm.nih.gov/articles/PMC3418126 (sports/aquatic-endurance-track.json)
- [AQ14] Competitive divers (systematic review 2024): shoulder, lumbar spine, trunk and wrist/hand most injured; low back pain up to 89% lifetime; spondylolysis from repetitive hyperextension; more injuries on entries, back / reverse dives and platform - https://researchsystem.canberra.edu.au/ws/portalfiles/portal/113004481/currie-et-al-2024-diving-into-the-health-problems-of-competitive-divers-a-systematic-review-of-injuries-and-illnesses.pdf (sports/aquatic-endurance-track.json)
- [AQ15] Springboard take-off: the board completes about 2.25-2.5 oscillation cycles before take-off; board-tip depression explains most of the hurdle flight time (long, board-timed contact) - https://lida.sport-iat.de/twm/Record/4001856?lng=en (sports/aquatic-endurance-track.json)
- [AQ16] Water polo (Aspetar): typical week = up to 5 polo sessions + 2-3 swim sessions + 3 weight sessions; overhead throwing without a stable base; eggbeater kick; heavy lifting is part of elite programmes - https://journal.aspetar.com/en/journals/volume-4-targeted-topic-aquatic-sports/keeping-the-water-polo-player-out-of-the-clinic-and-in-the-water (sports/aquatic-endurance-track.json)
- [AQ17] Water polo: high self-reported shoulder and hip / groin pain across playing levels (eggbeater during growth); up to 80% of players report shoulder pain in their career - https://ijspt.scholasticahq.com/article/18801-quantifying-the-burden-of-shoulder-and-hip-pain-in-water-polo-players-across-different-playing-levels (sports/aquatic-endurance-track.json)
- [AQ18] NCAA water polo: men's championship in December (fall season), women's in May (spring season) - https://collegiatewaterpolo.org/?p=50874 (sports/aquatic-endurance-track.json)
- [AQ19] Energy contribution (Duffield et al. 2005): 400 m about 41/59% (men) and 45/55% (women) aerobic/anaerobic; 800 m about 60/40 and 70/30; 1500 m anaerobic only ~17-20% - https://pubmed.ncbi.nlm.nih.gov/15966348/ (sports/aquatic-endurance-track.json)
- [AQ20] Horizontal jumps (championship biomechanics): long-jump take-off contact 0.12-0.14 s; triple jump hop 0.12-0.14, step 0.13-0.15, jump 0.14-0.16 s - https://trackandfieldnews.com/track-coach/horizontal-jumps-training-and-design/ (sports/aquatic-endurance-track.json)
- [AQ21] Athletics injuries by event group: sprinters / hurdlers / jumpers more acute (hamstring strain most common in sprints), distance runners more overuse (stress fractures, MTSS), throwers spine and upper limb; bone stress injuries ~20% annual incidence - https://pmc.ncbi.nlm.nih.gov/articles/PMC8975568 (sports/aquatic-endurance-track.json)
- [AQ22] Javelin injuries (10-year overview): shoulder ~30% of injuries; medial UCL sprain ('javelin thrower's elbow') the most common injury; also low back and knee - https://lida.sport-iat.de/dlv/Record/4042917 (sports/aquatic-endurance-track.json)
- [AQ23] Preventing shoulder injuries in throwers and pole vaulters (Aspetar Sports Medicine Journal, athletics issue) - https://journal.aspetar.com/en/journals/volume-13-targeted-topic-sports-medicine-in-athletics/preventing-shoulder-injuries-in-throwers-and-pole-vaulters (sports/aquatic-endurance-track.json)
- [AQ24] Balsalobre-Fernandez et al. 2016 meta-analysis: strength + plyometric training 2-3x/week for 8-12 weeks improves running economy in high-level middle- and long-distance runners (SMD -1.42) - https://pubmed.ncbi.nlm.nih.gov/26694507/ (sports/aquatic-endurance-track.json)
- [AQ25] Running-related injuries (Kakouris et al. 2021 systematic review): incidence ~40%; Achilles tendinopathy 10.3%, MTSS 9.4%, patellofemoral pain 6.3%, plantar fasciitis 6.1%, ankle sprain 5.8%; ITB syndrome high in prevalence - https://doi.org/10.1016/j.jshs.2021.04.001 (sports/aquatic-endurance-track.json)
- [AQ26] Distance runners at 14 km/h: ground contact ~0.23-0.24 s (midfoot 0.228 s vs rearfoot 0.242 s); faster / elite runners < 0.20 s - https://lida.sport-iat.de/dlv/Record/4032532?lng=en (sports/aquatic-endurance-track.json)
- [AQ27] US running calendar: cross country late August-November (college championships late November); indoor track December-February/March; outdoor track March-June - https://trackbarn.com/blogs/faq/when-does-track-and-field-start-in-us (sports/aquatic-endurance-track.json)
- [AQ28] Long-distance triathlon injuries (systematic review): overuse dominates (37-91%), most from the run; knee and spine the most frequent sites - https://jhk.termedia.pl/A-Systematic-Review-of-Long-Distance-Triathlon-Musculoskeletal-Injuries,158676,0,2.html (sports/aquatic-endurance-track.json)
- [AQ29] USA Triathlon Age Group National Championships are held in August (Olympic and sprint distance), 4,000+ athletes - https://www.sportsdestinations.com/destinations/ohio/news/usa-triathlon-releases-details-age-group-nationals-15034 (sports/aquatic-endurance-track.json)
- [AQ30] Cycling and bone health systematic review: road cyclists have low bone mineral density (lumbar spine); resistance / impact training recommended - https://pmc.ncbi.nlm.nih.gov/articles/PMC3554602 (sports/aquatic-endurance-track.json)
- [AQ31] Ronnestad & Mujika 2014 review: heavy strength training (about 2 sessions/week, 4-10RM) improves cycling and running economy / performance; 1 session/week maintains in season - https://paulogentil.com/pdf/Optimizing%20strength%20training%20for%20running%20and%20cycling%20endurance%20performance%20-%20A%20review.pdf (sports/aquatic-endurance-track.json)
- [AQ32] Overuse injuries in professional road cyclists (Clarsen et al. 2010): 58% low back pain in 12 months, 36% anterior knee pain; clavicle the most common fracture in cyclists - https://pubmed.ncbi.nlm.nih.gov/20847225/ (sports/aquatic-endurance-track.json)
- [AQ33] Elite sprint cyclists: back-squat maximal force and power-clean maximal power the strongest predictors of on-bike force and power - https://sponet.de/Record/4096959 (sports/aquatic-endurance-track.json)
- [AQ34] Rowing injuries: lumbar / thoracic back pain and rib stress fractures typical, low back about 15-25% of rowing injuries; national-level rowers had more low back injuries, international rowers more rib stress fractures - https://repository.brieflands.com/items/a3503653-dc7d-4cfd-9a20-99074cf21c46/full (sports/aquatic-endurance-track.json)
- [AQ34b] Cumulative trauma injuries in rowing: heavy weight lifting (especially squats), missing warm-up / cool-down, high-pressure low-rate work and stroke technique named as contributing factors - https://ojs.ub.uni-konstanz.de/cpa/article/view/3789 (sports/aquatic-endurance-track.json)
- [AQ35] 2000 m rowing: about 70-80% aerobic energy; races 5.5-7.5 min; 220-250 strokes - https://www.germanjournalsportsmedicine.com/archive/archive-2021/issue-4/olympic-rowing-maximum-capacity-over-2000-meters/ (sports/aquatic-endurance-track.json)
- [AQ36] College rowing: fall head races (e.g. Head of the Charles, October), spring 2 km sprint season from late March, NCAA Championships late May / early June - https://ca.thegistsports.com/article/41216fd6-6922-447d-bf26-0a13456f1105/ (sports/aquatic-endurance-track.json)
- [AQ37] Alpine ski racing: high ACL injury rates (World Cup ~36 injuries / 100 athletes / season); 10-year youth study: 15% ACL injuries; low leg and core strength and core ratios predicted knee injury - https://www.ncbi.nlm.nih.gov/pmc/articles/PMC4989489/ (sports/aquatic-endurance-track.json)
- [AQ38] Competitive snowboarders (national elite): back 22%, knee 16%, hand / wrist 9% of injuries; big air / snowboard cross / halfpipe riskier than slalom - https://bjsm.bmj.com/content/40/3/230 (sports/aquatic-endurance-track.json)
- [AQ39] US ski-club calendar example: dryland May-August and from late August, on-snow late October to mid-April (competition season) - https://www.sswsc.org/?p=2414 (sports/aquatic-endurance-track.json)
- [AQ40] Swim-specific dryland: sprinters = power / speed with a longer preparatory phase; distance swimmers = stability and endurance of shoulder girdle, hips and core - https://blog.bridgeathletic.com/swim-specific-dryland-training (sports/aquatic-endurance-track.json)
- [AQ41] Masters swimmers need strength training (shoulder protection, bone density, recovery with age) - https://swimmingworldmagazine.com/news/4-reasons-masters-swimming-strength-training (sports/aquatic-endurance-track.json)
- [K1] Wrestling technical-tactical and physiological demands review (Miarka 2016): after the 2013 rule change bouts show quicker, more varied actions; decisive actions in standing and ground positions - https://revpubli.unileon.es/index.php/artesmarciales/article/view/3309 (sports/combat-strength-fitness.json)
- [K1b] Greco-Roman World Championship time-motion (Nilsson et al. 2002, J Sports Sci): mean work 37.2 s / rest 13.8 s (~3:1); blood lactate ~14.8 mmol/L - https://www.bisp-surf.de/Record/PU200911005944 (sports/combat-strength-fitness.json)
- [K2] High-school vs college wrestling injuries (Yard et al. 2008, AJSM): 2.33 vs 7.25 injuries / 1000 AE; matches riskier than practice at both levels - https://lida.sport-iat.de/twm/Record/4013945?lng=en (sports/combat-strength-fitness.json)
- [K3] Example state high-school wrestling calendar (TSSAA, Tennessee) - winter season, state tournament in February - https://cms-files.tssaa.org/documents/tssaa/2026-27/sports-calendar/2026WrCalendar.pdf (sports/combat-strength-fitness.json)
- [K3b] Secondary summary of NFHS / NCAA wrestling season dates (NCAA championships third weekend of March) - https://sportssurge.alibaba.com/wrestling/when-is-wrestling-season (sports/combat-strength-fitness.json)
- [K4] Judo combat time-motion and physiology (Franchini, Artioli & Brito 2013): effort:pause 2:1-3:1 with 20-30 s efforts and ~10 s pauses - https://lida.sport-iat.de/dfb-fechten/Record/4030246 (sports/combat-strength-fitness.json)
- [K4b] Judo time-motion by championship phase, 53,403 actions (J Hum Kinet 2018) - https://pmc.ncbi.nlm.nih.gov/articles/PMC6231334 (sports/combat-strength-fitness.json)
- [K5] Epidemiology of injuries during judo tournaments (Translational Sports Medicine 2023): sprains, contusions, lacerations; knee, shoulder, elbow and fingers among the main sites - https://www.ncbi.nlm.nih.gov/pmc/articles/PMC11022761/ (sports/combat-strength-fitness.json)
- [K5b] Injuries in judo: systematic review with prevention suggestions (BJSM 2013) - top-level competition: knee ~17 %, shoulder ~16 %, elbow ~14 %; being thrown the main mechanism - https://bjsm.bmj.com/content/47/18/1139 (sports/combat-strength-fitness.json)
- [K6] BJJ matches of 2-10 min (Andreato et al. 2017, Kinesiology): effort:pause ratio stable across durations; longer matches add pause time, lower grip-strength endurance and raise RPE - https://hrcak.srce.hr/180731 (sports/combat-strength-fitness.json)
- [K6b] Female high-level BJJ time-motion by weight division (Frontiers in Psychology 2023) - https://pmc.ncbi.nlm.nih.gov/articles/PMC9969123 (sports/combat-strength-fitness.json)
- [K7] High-performance professional BJJ athletes (Nery et al. 2022): injury prevalence 85 %; knee 32.6 %, shoulder 11.2 %, elbow 8.4 % - https://opus.lib.uts.edu.au/handle/10453/166268 (sports/combat-strength-fitness.json)
- [K7b] BJJ survey of 1140 athletes (Hinz et al. 2021, OJSM): knee the most frequent injury (27.1 %); lower extremity 45.7 %, upper extremity 30.2 % - https://pmc.ncbi.nlm.nih.gov/articles/PMC8721390 (sports/combat-strength-fitness.json)
- [K8] Korean elite taekwondo, prospective (Son et al. 2020): competition 24.86 vs practice 4.79 injuries / 1000 AE; foot / ankle the most common location, ligament sprain the most common type, contact the main mechanism - https://www.ncbi.nlm.nih.gov/pmc/articles/PMC7399793/ (sports/combat-strength-fitness.json)
- [K9] Weightlifting and powerlifting injuries, updated systematic review 2024: powerlifting 1.0-4.4 / 1000 h (low back / pelvis, shoulder, elbow / upper arm); weightlifting 2.4-3.3 / 1000 h (knee, low back, shoulder, hands) - https://pubmed.ncbi.nlm.nih.gov/39650568/ (sports/combat-strength-fitness.json)
- [K10] Tapering and peaking maximal strength for powerlifting: reduce volume, keep intensity; taper about 1-2 weeks (Travis et al. 2020) - https://www.ncbi.nlm.nih.gov/pmc/articles/PMC7552788/ (sports/combat-strength-fitness.json)
- [K11] Young elite weightlifters: a second daily high-intensity session gave no extra gain over one session - https://johk.pl/wp-content/uploads/2023/02/10.2478_v10078-010-0057-7.pdf (sports/combat-strength-fitness.json)
- [K11b] Practitioner: weightlifters train each competition lift often (advanced 6-10 sessions / week) - Catalyst Athletics - https://mail.catalystathletics.com/article/1946/Ask-Greg-Weightlifting-Training-Frequency-Volume (sports/combat-strength-fitness.json)
- [K12] USA Weightlifting 2026 national events (North American Open series Mar / Sep / Dec, Masters + University Apr, National Championships week June) - https://usaweightlifting.org/news/2025/august/01/2026-usa-weightlifting-national-event-schedule (sports/combat-strength-fitness.json)
- [K13] Strongman injury epidemiology (Winwood et al.): 82 % injured in 1 year, 5.5 / 1000 h; low back 24 %, shoulder 21 %, biceps 11 %, knee 11 %; implement training 1.9x riskier per exposure - https://research.bond.edu.au/en/publications/retrospective-injury-epidemiology-of-strongman-athletes/ (sports/combat-strength-fitness.json)
- [K14] Strongman events: the yoke produces the highest spine loads; stone lifts load the back in a flexed posture (McGill et al. 2009) - https://pubmed.ncbi.nlm.nih.gov/19528856/ (sports/combat-strength-fitness.json)
- [K14b] Strongman Corporation National Championships (Erie, PA, October) - https://www.sportsdestinations.com/destinations/pennsylvania/news/strongman-corporation-national-championships-32294 (sports/combat-strength-fitness.json)
- [K15] CrossFit injury reviews: about 2-3 injuries / 1000 h (one meta-analysis 3.2); shoulders most common, then back and knees - https://www.germanjournalsportsmedicine.com/archive/archive-2021/issue-7/musculoskeletal-injuries-in-crossfitr-a-systematic-review-and-meta-analysis-of-injury-rates-and-locations/ (sports/combat-strength-fitness.json)
- [K16] CrossFit Games 2026 season: Open Feb 26 - Mar 16, quarterfinals Mar 26-30, online semifinals May-June, Games July 24-26 - https://games.crossfit.com/article/2026-crossfit-games-season-dates-and-details-division (sports/combat-strength-fitness.json)
- [K17] HYROX format: 8 x 1 km run, each followed by a station (SkiErg 1000 m, sled push 50 m, sled pull 50 m, burpee broad jumps 80 m, row 1000 m, farmers carry 200 m, sandbag lunges 100 m, wall balls 100); 60-90+ min for non-elite - https://us.puma.com/us/en/articles/what-is-hyrox (sports/combat-strength-fitness.json)
- [K17b] HYROX division weights (Open vs Pro: sled push 152 / 202 kg men, farmers 2 x 24 / 2 x 32 kg, lunges 20 / 30 kg, wall ball 6 / 9 kg; women lighter) - https://www.redbull.com/gb-en/hyrox-weights-overview (sports/combat-strength-fitness.json)
- [K18] HYROX physiology (Brandt et al. 2025): 86.5 min simulated race, runs 51.2 min vs stations 32.8 min; VO2max correlates with finish time (rho -0.71); ~80 % of the race at very hard intensity - https://www.frontiersin.org/journals/physiology/articles/10.3389/fphys.2025.1519240/pdf (sports/combat-strength-fitness.json)
- [K19] HYROX season calendar (Sept-June; 2026 World Championships Stockholm June 18-21; 21 US races in 2025/26) - https://www.redbull.com/us-en/hyrox-event-calendar-fitness-racing (sports/combat-strength-fitness.json)
- [K20] Spartan race types: Sprint 5 km / 20 obstacles, Super 10 km / 25, Beast 21 km / 30; 30-burpee penalty - https://shop.spartan.com/blogs/unbreakable-race-stories/different-spartan-race-types (sports/combat-strength-fitness.json)
- [K21] OCR physiology: pre-race handgrip strength correlates with performance; leg strength falls after Sprint and Super (Applied Sciences 2024) - https://www.mdpi.com/2076-3417/14/20/9604 (sports/combat-strength-fitness.json)
- [K21b] Spartan Race heart rate averages ~166 bpm (Charles University thesis) - https://dspace.cuni.cz/handle/20.500.11956/105962 (sports/combat-strength-fitness.json)
- [K22] Spartan Race injuries over 5 years (Eastern Canada): 18.7 presentations / 1000 participants; most treated on site - https://resolve.cambridge.org/core/journals/prehospital-and-disaster-medicine/article/this-is-sparta-a-fiveyear-obstacle-course-racing-injury-analysis/366937AE0AB0B9CF2F3E855FE004952F (sports/combat-strength-fitness.json)
- [K22b] Obstacle course events review: ankle / knee sprains, shoulder dislocations, fractures, skin injuries (JSOM 2022) - https://jsomonline.org/product/obstacle-course-events-hazards-and-prevention-measures/ (sports/combat-strength-fitness.json)
- [K23] Spartan 2025 US schedule (spring to late fall; Pan American Championship Sept, Super World Championship Oct) - https://www.spartan.com/blog/2025-spartan-race-schedule (sports/combat-strength-fitness.json)
- [K24] Natural bodybuilding contest prep (Helms et al. 2014): lose ~0.5-1 % body weight / week; dehydration / electrolyte manipulation in peak week can be dangerous - https://jissn.biomedcentral.com/track/pdf/10.1186/1550-2783-11-20 (sports/combat-strength-fitness.json)
- [K25] Natural elite bodybuilders pre-contest: ~5 training days / week, ~8-17 direct sets per muscle group per week - https://www.ncbi.nlm.nih.gov/pmc/articles/PMC12846200/ (sports/combat-strength-fitness.json)
- [K25b] Weekly training volume per muscle group in competitive physique athletes - https://www.ncbi.nlm.nih.gov/pmc/articles/PMC12345604/ (sports/combat-strength-fitness.json)
- [K25c] Physique competitors survey: volume reduced for most muscle groups and cardio duration increased in pre-contest (Frontiers 2025) - https://www.frontiersin.org/articles/10.3389/fspor.2025.1536360/full (sports/combat-strength-fitness.json)
- [K26] NPC divisions and judging (men's physique, classic physique, bodybuilding, bikini, wellness, figure, women's physique) - https://www.nasm.org/resource-center/blog/fitness/bodybuilding-competition-divisions-a-coach-guide-to-the-categories (sports/combat-strength-fitness.json)
- [K27] Adolescent artistic gymnasts: pooled wrist-pain prevalence 53 %; chronic wrist injury 36 % - https://www.ncbi.nlm.nih.gov/pmc/articles/PMC12804664/ (sports/combat-strength-fitness.json)
- [K28] NCAA women's gymnastics injuries 2009-14: 9.22 / 1000 AE; ankle 17.9 %, lower leg / Achilles 13.6 %, trunk 13.4 %, foot 12.4 %; competition 1.67x practice - https://scholarworks.indianapolis.iu.edu/items/56c83fbc-267f-411f-8aff-d22fa53bedda/full (sports/combat-strength-fitness.json)
- [K29] Landing impacts (Mueller et al. 2024, cheerleaders) citing gymnastics data: two-foot landings 5 BW in training to 11 BW in competition (Hume et al.); somersault landings ~7-13 BW (Wade et al.) - https://www.frontiersin.org/articles/10.3389/fspor.2024.1419783/full (sports/combat-strength-fitness.json)
- [K29b] Round-off hand contact forces up to ~4 BW (upper-extremity loading) - https://ojs.ub.uni-konstanz.de/cpa/article/view/5539/5033 (sports/combat-strength-fitness.json)
- [K30] USA Gymnastics Development Program: competitive year Aug 1 - Jul 31, national championships in May - https://usagym.org/2024-usa-gymnastics-mens-and-womens-development-program-national-championships-begin-this-weekend/ (sports/combat-strength-fitness.json)
- [K30b] NCAA women's gymnastics season January - April - https://en.wikipedia.org/wiki/2019_NCAA_Division_I_women%27s_gymnastics_season (sports/combat-strength-fitness.json)
- [K31] Climbing injuries systematic review: fingers most injured (A2 / A4 pulley), shoulder ~17 %, elbow (medial epicondylopathy); overuse > acute - https://www.ncbi.nlm.nih.gov/pmc/articles/PMC12821603/ (sports/combat-strength-fitness.json)
- [K31b] AMSSM rock-climbing injury basics (upper extremity ~70 %, lower ~20 % - ankle) - https://sportsmedref.amssm.org/wp-content/uploads/2022/08/Rock-Climbing-Injuries-Basics-JL.pdf (sports/combat-strength-fitness.json)
- [K32] Editorial: Training and testing in climbing (Andersen et al. 2022): finger strength is central; 10 weeks of hangboard training raised maximal finger strength more than regular climbing in intermediate-advanced climbers (Hermans et al.) - https://www.ncbi.nlm.nih.gov/pmc/articles/PMC9433113/ (sports/combat-strength-fitness.json)
- [K32b] Determinants for success in climbing: a systematic review (2019) - https://doaj.org/article/8e5acfc4f7a640128f77e8d6a2a19b10 (sports/combat-strength-fitness.json)
- [K33] USA Climbing youth series: bouldering qualifiers Oct-Dec, regionals Jan, divisionals Feb; rope season in spring; youth nationals late June - July - https://usaclimbing.org/wp-content/uploads/2022/01/Competitor-Parent-Guide-to-Youth-Series.pdf (sports/combat-strength-fitness.json)
- [K34] Pickleball orthopedic injuries rising (10-year national study) - https://aoao.org/2025/03/21/rising-orthopedic-injuries-in-pickleball-insights-from-a-10-year-national-study/ (sports/combat-strength-fitness.json)
- [K34b] Pickleball injury survey 2023 (Cureus): about 41 % of injuries came from falling or diving for a shot - https://assets.cureus.com/uploads/original_article/pdf/149619/20230601-3265-mafcmc.pdf (sports/combat-strength-fitness.json)
- [K34c] UC Davis: pickleball injuries rising - falls in older players, wrist fractures - https://health.ucdavis.edu/research/news/headlines/pickleball-injuries-are-on-this-rise-here-are-tips-to-avoid-them-while-playing/2024/08 (sports/combat-strength-fitness.json)
- [K35] Pickleball players over 40: mean HR ~111 bpm, moderate intensity >70 % of play in singles and doubles - https://journal.unnes.ac.id/journals/jpehs/article/view/48396 (sports/combat-strength-fitness.json)
- [K35b] ACE-sponsored study: pickleball improves fitness in middle-aged and older adults - https://www.acefitness.org/education-and-resources/professional/certified/august-2018/7053/ace-sponsored-research-can-pickleball-help-middle-aged-and-older-adults-get-fit (sports/combat-strength-fitness.json)
- [K36] SFIA: 24.3 M US pickleball players in 2025, fastest-growing US sport four years running - https://sfia.org/research/u-s-pickleball-participation/ (sports/combat-strength-fitness.json)
- [K37] PPA Tour 2026-27 schedule (season starts Aug 31; ~20 US stops) - https://thekitchenpickle.com/blogs/news/ppa-tour-2026-2027-season-schedule/ (sports/combat-strength-fitness.json)
- [K38] Amateur boxing: 3 rounds x 3 min with 1-min rest - https://en.wikipedia.org/wiki/Amateur_boxing (sports/combat-strength-fitness.json)
- [K38b] USA Boxing National Championships held in December (2024 Richmond, VA) - https://www.boxingscene.com/articles/usa-boxing-brings-national-championships-richmond-virginia (sports/combat-strength-fitness.json)
- [K39] MMA camps: fights usually known 8-12 weeks out; off-camp / pre-camp / camp structure (practitioner) - https://getphysical.com/blog/out-of-camp-strength-training-for-mma (sports/combat-strength-fitness.json)
- [K40] IBJJF 2026: Pan Championship late March (Kissimmee), World Championship late May - https://www.flograppling.com/articles/15609157-ibjjf-pans-2026-everything-you-need-to-know (sports/combat-strength-fitness.json)
- [K41] USA Judo 2026 national events: Youth Nationals March, Senior Nationals May, Junior Olympics June, President's Cup November - https://www.usajudo.com/news/2026/november/03/usa-judo-announces-16-point-events-for-2026 (sports/combat-strength-fitness.json)
- [K42] USA Karate National Championships & Team Trials in July - https://usankf.org/2024-karate-national-championships-team-trials (sports/combat-strength-fitness.json)
- [K42b] USA Taekwondo National Championships in July - https://www.usatkd.org/2024-u-s-taekwondo-national-championships (sports/combat-strength-fitness.json)
- [K43] US high-school golf season fall or spring by state (14 fall, 28 spring, 7 both) - https://highschoolgolf.org/?p=2279 (sports/combat-strength-fitness.json)
- [K43b] NCAA golf: fall + spring segments; regionals mid-May, championships late May - https://goducks.com/news/2024/8/21/mens-golf-releases-full-2024-25-schedule (sports/combat-strength-fitness.json)
- [K44] College tennis: fall individual tournaments, spring dual-match (team) season - https://www.tennisrecruiting.net/article.asp?id=1356 (sports/combat-strength-fitness.json)
- [04] sport science already cited in 04_profiles.json references (boxing, MMA, kickboxing, karate / taekwondo time-motion; golf; tennis) is reused as-is - synthesis/04_profiles.json#references (sports/combat-strength-fitness.json)
- [G1] 24.3 million US pickleball players in 2025; strong engagement 25-44 and 65+ (SFIA) - https://sfia.org/research/u-s-pickleball-participation/ (sports/genpop-active.json)
- [G2] SFIA 2026 topline: 24.3 M pickleball players, 16.8 M casual, 7.48 M core; +171.8 % in 3 years - https://thekitchenpickle.com/blogs/news/24-3-million-americans-played-pickleball-in-2025-sfia-report-says/ (sports/genpop-active.json)
- [G2b] SFIA 2024 pickleball report (2023 data): 25-34 = 16.7 %, 65+ = 15.4 % (second-largest bracket) - https://www.pickleheads.com/guides/pickleball-statistics (sports/genpop-active.json)
- [G3] Weiss, Dougherty, DiMaggio 2021 (Injury Epidemiology): senior (>= 60) pickleball and tennis injuries in US EDs 2010-2019 - strains / sprains 31.0 %, fractures 30.4 %, slip / trip / fall 66.9 %, wrist and lower leg most common - https://pmc.ncbi.nlm.nih.gov/articles/PMC8091689 (sports/genpop-active.json)
- [G4] ACE-sponsored study (Dalleck et al.): pickleball in 40-85-year-olds ~70 % of predicted max HR; 6 weeks improved VO2max, BP, lipids - https://www.acefitness.org/continuing-education/certified/august-2018/7053/ace-sponsored-research-can-pickleball-help-middle-aged-and-older-adults-get-fit/ (sports/genpop-active.json)
- [G5] Padel injuries systematic review (BMJ Open SEM 2023): 3 / 1000 h training, 8 / 1000 matches; elbow most common, then knee, shoulder, low back - https://pmc.ncbi.nlm.nih.gov/articles/PMC10277135/ (sports/genpop-active.json)
- [G6] Padel match-play activity profile systematic review (Kinesiology): HR 70-80 % max, rallies mostly 3-15 s, work : rest ~0.84 - https://ojs.srce.hr/kinesiology/article/view/9871 (sports/genpop-active.json)
- [G7] USPA / SFIA 2026: 1.07 million US padel players in 2025; ~1,000 courts (April 2026) - https://padelusa.org/padel-surpasses-one-million-players-in-the-united-states/ (sports/genpop-active.json)
- [G8] HYROX race format and Open-division weights (official) - https://hyrox.com/the-fitness-race/ (sports/genpop-active.json)
- [G9] Brandt, Ebel, Lebahn, Schmidt 2025 (Front Physiol): HYROX ~86.5 min at ~79.5 % HRmax; VO2max, body fat and endurance volume predict time; grip and resistance volume do not - https://www.frontiersin.org/journals/physiology/articles/10.3389/fphys.2025.1519240/full (sports/genpop-active.json)
- [G10] Davids CJ 2026, Strength Cond J 48(1):88-100: HYROX performance review (as cited in 06 v1.1 SCI_HYROX) - None (sports/genpop-active.json)
- [G11] Injury epidemiology in HYROX athletes - international cross-sectional survey (preprint 2026): 49.8 % injured, knee 20.8 %, more HYROX-specific sessions = more injuries (OR 1.61) - https://sciety.org/articles/activity/10.64898/2026.08.09.26359590 (sports/genpop-active.json)
- [G12] WAKA adult kickball: 4-16 coed teams, 8 regular-season games + tournament, ~10-week seasons, one night a week - https://patch.com/virginia/reston/playing-for-kicks-2 (sports/genpop-active.json)
- [G13] Videbaek et al. 2015 (Sports Med): novice runners 17.8 vs recreational 7.7 injuries per 1000 h - https://pmc.ncbi.nlm.nih.gov/articles/PMC4473093/ (sports/genpop-active.json)
- [G14] NHS Couch to 5K: 9 weeks, 3 runs a week, run / walk progression - https://www.nhs.uk/better-health/get-active/get-running-with-couch-to-5k/couch-to-5k-running-plan/ (sports/genpop-active.json)
- [G15] Strength training (high-load, plyometric, combined) and running economy in middle- and long-distance runners: systematic review with meta-analysis (Sports Med) - https://repository.essex.ac.uk/37272/1/s40279-023-01978-y.pdf (sports/genpop-active.json)
- [G16] Load carriage: NSCA TSAC report 80 (loaded marching) and HPRC load-carriage strategies (start ~10 % BW, build eccentric strength, avoid spikes) - https://www.nsca.com/globalassets/education/articles/tsac/tsac-80/tsac-report-80_biomechanical-effects-of-loaded-marching.pdf (sports/genpop-active.json)
- [G16b] HPRC load-carriage strategies - https://www.hprc-online.org/articles/load-carriage-strategies (sports/genpop-active.json)
- [G17] Epidemiology of ankle sprain during hiking in uniformed groups (prevalence 9.15 %, downhill / scree; risk factors) - https://www.bisp-surf.de/Record/ftdoajarticles:oai:doaj.org%2Farticle:81d5a8dd7c2a423cb4b75c924e7afc74 (sports/genpop-active.json)
- [G18] Olmedillas et al. 2012 (BMC Med): cycling and bone health systematic review - low BMD in road cyclists - https://pmc.ncbi.nlm.nih.gov/articles/PMC3554602/ (sports/genpop-active.json)
- [G19] Wilber et al. 1995 (Int J Sports Med): overuse injuries in recreational cyclists - neck 48.8 %, knees 41.7 % - https://pubmed.ncbi.nlm.nih.gov/7649713/ (sports/genpop-active.json)
- [G20] Spin-related exertional rhabdomyolysis case series (after a first class) - https://pmc.ncbi.nlm.nih.gov/articles/PMC8276198/ (sports/genpop-active.json)
- [G21] Thomas et al. 2021 (J Athl Train): masters swimmers - shoulder pain 69 % with strenuous activity, 50 % disability, less IR / ER - https://nata.kglmeridian.com/view/journals/attr/56/12/article-p1313.xml (sports/genpop-active.json)
- [G22] Recreational alpine skiing: the ACL is predominantly injured in knee injuries needing hospitalisation; knee ~1/3 of injuries - https://pmc.ncbi.nlm.nih.gov/articles/PMC8126542/ (sports/genpop-active.json)
- [G23] Injury trends in alpine skiing and snowboarding 2008-09 to 2017-18 (snowboard wrist ~22 % vs ski ~5 %) - https://pubmed.ncbi.nlm.nih.gov/33384220/ (sports/genpop-active.json)
- [G24] Recreational skiing causes prolonged eccentric quadriceps / hamstring fatigue (Front Physiol 2018) - https://www.frontiersin.org/journals/physiology/articles/10.3389/fphys.2018.01687/full (sports/genpop-active.json)
- [G25] Mendez-Villanueva & Bishop 2005 (Sports Med): physiology of surfing - paddling ~50 %, stationary ~40 %, riding 4-5 %; paddling overuse (shoulder, low back, neck) - https://pubmed.ncbi.nlm.nih.gov/15651913/ (sports/genpop-active.json)
- [G25b] Time-motion analysis of a 2-hour surfing training session - https://ro.ecu.edu.au/ecuworkspost2013/1703 (sports/genpop-active.json)
- [G26] ACE-sponsored research: stand-up paddleboarding core activation and energy cost - https://www.acefitness.org/continuing-education/prosource/august-2016/5997/ace-sponsored-research-can-stand-up-paddleboarding-stand-up-to-scrutiny/ (sports/genpop-active.json)
- [G27] Inouye et al. 2013 (Hawaii J Med Public Health): Zumba injuries 29 %; knees 42 %, ankles 14 %, shoulders 14 % - https://pmc.ncbi.nlm.nih.gov/articles/PMC3872921/ (sports/genpop-active.json)
- [G27b] Injury surveillance of female adult Zumba dancers: instructors 5.7 vs participants 3.9 injuries / 1000 h - https://pureportal.coventry.ac.uk/en/publications/injury-surveillance-of-female-adult-zumba-dancers-2/ (sports/genpop-active.json)
- [G28] Fragala et al. 2019, NSCA position statement: resistance training for older adults (2-3 d/wk; power at 40-60 % 1RM) - https://pubmed.ncbi.nlm.nih.gov/31343601/ (sports/genpop-active.json)
- [G29] Physical Activity Guidelines for Americans, 2nd ed.: 150-300 min moderate; muscle strengthening 2+ days; multicomponent with balance for older adults - https://health.gov/sites/default/files/2019-10/PAG_ExecutiveSummary.pdf (sports/genpop-active.json)
- [G30] Beck et al. 2017, ESSA position statement on exercise for osteoporosis (~50 impacts / session, 4-7 d/wk; moderate impact with osteoporosis / fractures) - https://ro.ecu.edu.au/ecuworkspost2013/2797 (sports/genpop-active.json)
- [G31] Incidence of Achilles tendon rupture (Acta Orthop): highest 30-39, largest rise 40-59; most in ball games - https://actaorthop.org/actao/article/view/21019 (sports/genpop-active.json)
- [G32] Tennis leg (medial gastrocnemius strain) in middle-aged recreational players - https://radiopaedia.org/articles/tennis-leg (sports/genpop-active.json)
- [G33] Lloyd et al. 2016, NSCA position statement on long-term athletic development - https://nsca.com/education/articles/nsca-position-statement-on-long-term-athletic-development (sports/genpop-active.json)
- [G34] NATA youth sport specialization recommendations (>= 2 days off, <= 8 months one sport) and the AAP 'hours per week <= age' guide - https://www.nata.org/sites/default/files/youth_sports_specialization_recommendations.pdf (sports/genpop-active.json)
- [G34b] AAP hours-per-week guide summarised by Johns Hopkins Medicine - https://www.hopkinsmedicine.org/health/conditions-and-diseases/sports-injuries/youth-sport-specialization (sports/genpop-active.json)
- [G35] Golf-related low back pain review: 18-54 % of golf ailments; amateurs 15-34 %; risk factors - https://brieflands.com/articles/asjsm-21618 (sports/genpop-active.json)
- [G36] SFIA 2025 topline: 247.1 M active Americans; running / jogging > 50 M; day hiking growing - https://sfia.org/resources/sfias-topline-participation-report-shows-247-1-million-americans-were-active-in-20 (sports/genpop-active.json)
- [G37] Practitioner analysis: running ~45-55 % of HYROX race time - https://www.fasttalklabs.com/training/performance-determinants-of-hyrox-competition/ (sports/genpop-active.json)

## 14. Merge log and history

- **M-CANON** When a sports-file record was numerically identical to a 04 v1 profile, the 04 id stays canonical (keeps every downstream reference in 03 / 05 / 09 / 12 / 13 / engine fixtures valid) and the new id becomes an alias: football_wr_db -> football_skill, football_te_lb -> football_big_skill, basketball_wing -> basketball, softball_position -> softball, soccer_midfielder -> soccer, hockey_forward -> hockey, volleyball_outside_opposite -> volleyball, karate -> karate_taekwondo, powerlifting_competitive -> powerlifting_strength, physique_competitive -> bodybuilding_aesthetics (task: keep the coach-derived numbers)
- **M-BASE** baseball_position and football_lineman stay as the sport-level base profiles (used when no position is picked; infield / outfield and OL / DL are deltas on them) (INFERRED)
- **M-SPORT-IDS** final picker sport ids: ice_hockey (was hockey), bjj (bjj_grappling), karate + taekwondo (karate_taekwondo split), powerlifting (powerlifting_strength), olympic_weightlifting, crossfit (crossfit_competitor), hyrox (hyrox_competitive), bodybuilding_physique (bodybuilding_aesthetics), pickleball (pickleball_competitive), padel (padel_competitive), cheerleading (team.json cheer), distance_running (incl. cross country) - sport ids never equal a profile id unless the sport has one profile (generator_spec F11 ids were provisional until this merge)
- **M-DEDUP-boxing** boxing (04 v1) + sports/combat-strength-fitness.json:boxing -> one record `boxing`; 04 numbers kept (twin weekly_sets identical: yes); round-2 fields from the twin; twin id kept as alias (task: dedupe sports that already existed, keep the coach-derived numbers)
- **M-DEDUP-crossfit_competitor** crossfit_competitor (04 v1) + sports/combat-strength-fitness.json:crossfit_competitor -> one record `crossfit_competitor`; 04 numbers kept (twin weekly_sets identical: yes); round-2 fields from the twin; twin id kept as alias (task: dedupe sports that already existed, keep the coach-derived numbers)
- **M-DEDUP-powerlifting_strength** powerlifting_strength (04 v1) + sports/combat-strength-fitness.json:powerlifting_competitive -> one record `powerlifting_strength`; 04 numbers kept (twin weekly_sets identical: yes); round-2 fields from the twin; twin id kept as alias (task: dedupe sports that already existed, keep the coach-derived numbers)
- **M-DEDUP-bodybuilding_aesthetics** bodybuilding_aesthetics (04 v1) + sports/combat-strength-fitness.json:physique_competitive -> one record `bodybuilding_aesthetics`; 04 numbers kept (twin weekly_sets identical: yes); round-2 fields from the twin; twin id kept as alias (task: dedupe sports that already existed, keep the coach-derived numbers)
- **M-DEDUP-basketball** basketball (04 v1) + sports/team.json:basketball_wing -> one record `basketball`; 04 numbers kept (twin weekly_sets identical: yes); round-2 fields from the twin; twin id kept as alias (task: dedupe sports that already existed, keep the coach-derived numbers)
- **M-DEDUP-volleyball** volleyball (04 v1) + sports/team.json:volleyball_outside_opposite -> one record `volleyball`; 04 numbers kept (twin weekly_sets identical: yes); round-2 fields from the twin; twin id kept as alias (task: dedupe sports that already existed, keep the coach-derived numbers)
- **M-DEDUP-football_skill** football_skill (04 v1) + sports/team.json:football_wr_db -> one record `football_skill`; 04 numbers kept (twin weekly_sets identical: yes); round-2 fields from the twin; twin id kept as alias (task: dedupe sports that already existed, keep the coach-derived numbers)
- **M-DEDUP-football_big_skill** football_big_skill (04 v1) + sports/team.json:football_te_lb -> one record `football_big_skill`; 04 numbers kept (twin weekly_sets identical: yes); round-2 fields from the twin; twin id kept as alias (task: dedupe sports that already existed, keep the coach-derived numbers)
- **M-DEDUP-soccer** soccer (04 v1) + sports/team.json:soccer_midfielder -> one record `soccer`; 04 numbers kept (twin weekly_sets identical: yes); round-2 fields from the twin; twin id kept as alias (task: dedupe sports that already existed, keep the coach-derived numbers)
- **M-DEDUP-softball** softball (04 v1) + sports/team.json:softball_position -> one record `softball`; 04 numbers kept (twin weekly_sets identical: yes); round-2 fields from the twin; twin id kept as alias (task: dedupe sports that already existed, keep the coach-derived numbers)
- **M-DEDUP-hockey** hockey (04 v1) + sports/team.json:hockey_forward -> one record `hockey`; 04 numbers kept (twin weekly_sets identical: yes); round-2 fields from the twin; twin id kept as alias (task: dedupe sports that already existed, keep the coach-derived numbers)
- **M-DEDUP-tennis** tennis (04 v1) + sports/combat-strength-fitness.json:tennis -> one record `tennis`; 04 numbers kept (twin weekly_sets identical: yes); round-2 fields from the twin; twin id kept as alias (task: dedupe sports that already existed, keep the coach-derived numbers)
- **M-DEDUP-golf** golf (04 v1) + sports/combat-strength-fitness.json:golf -> one record `golf`; 04 numbers kept (twin weekly_sets identical: yes); round-2 fields from the twin; twin id kept as alias (task: dedupe sports that already existed, keep the coach-derived numbers)
- **M-DEDUP-track_sprinter** track_sprinter (04 v1) + sports/aquatic-endurance-track.json:track_sprinter -> one record `track_sprinter`; 04 numbers kept (twin weekly_sets identical: yes); round-2 fields from the twin; twin id kept as alias (task: dedupe sports that already existed, keep the coach-derived numbers)
- **M-DEDUP-distance_runner** distance_runner (04 v1) + sports/aquatic-endurance-track.json:distance_runner -> one record `distance_runner`; 04 numbers kept (twin weekly_sets identical: yes); round-2 fields from the twin; twin id kept as alias (task: dedupe sports that already existed, keep the coach-derived numbers)
- **M-DEDUP-kickboxing_muay_thai** kickboxing_muay_thai (04 v1) + sports/combat-strength-fitness.json:kickboxing_muay_thai -> one record `kickboxing_muay_thai`; 04 numbers kept (twin weekly_sets identical: yes); round-2 fields from the twin; twin id kept as alias (task: dedupe sports that already existed, keep the coach-derived numbers)
- **M-DEDUP-karate_taekwondo** karate_taekwondo (04 v1) + sports/combat-strength-fitness.json:karate -> one record `karate_taekwondo`; 04 numbers kept (twin weekly_sets identical: yes); round-2 fields from the twin; twin id kept as alias (task: dedupe sports that already existed, keep the coach-derived numbers)
- **M-DEDUP-mma** mma (04 v1) + sports/combat-strength-fitness.json:mma -> one record `mma`; 04 numbers kept (twin weekly_sets identical: yes); round-2 fields from the twin; twin id kept as alias (task: dedupe sports that already existed, keep the coach-derived numbers)
- **M-DEDUP-wrestling** wrestling (04 v1) + sports/combat-strength-fitness.json:wrestling -> one record `wrestling`; 04 numbers kept (twin weekly_sets identical: yes); round-2 fields from the twin; twin id kept as alias (task: dedupe sports that already existed, keep the coach-derived numbers)
- **M-DEDUP-bjj_grappling** bjj_grappling (04 v1) + sports/combat-strength-fitness.json:bjj_grappling -> one record `bjj_grappling`; 04 numbers kept (twin weekly_sets identical: yes); round-2 fields from the twin; twin id kept as alias (task: dedupe sports that already existed, keep the coach-derived numbers)
- **M-WW** weekend_warrior: the genpop-active.json record replaces the 04 v1 numbers for resistance / core / calves (re-based on the 05 v1.1 4-day template under COACH-R2 SES-01/05); the athletic budget (PLYO 10 / JLK 2 / BALL 4 / THROW 8 / COD 8 / TE 8) is unchanged; the 04 v1 weekly_sets are kept as weekly_sets_v1 (COACH-R2 SES-05 (round 2 outranks round 1); genpop-active.json merge_action)
- **M-DEDUP-weekend_warrior** weekend_warrior (04 v1) + sports/genpop-active.json:weekend_warrior -> one record `weekend_warrior`; 04 numbers kept (twin weekly_sets identical: NO - see weekly_sets_v1); round-2 fields from the twin; twin id kept as alias (task: dedupe sports that already existed, keep the coach-derived numbers)
- **M-DEDUP-rec_swimming** rec_swimming (sports/aquatic-endurance-track.json) and lap_swim (sports/genpop-active.json) describe the same recreational activity -> one record `lap_swim` (F11r id), alias rec_swimming; extra injury codes folded in: ['SHOULDER_SWIMMER', 'BONE_LOADING_NON_IMPACT', 'KNEE_MEDIAL_KICK'] (genpop-active.json GP-11 / aquatic-endurance-track.json O11 (merge step))
- **M-DEDUP-rec_running** rec_running (sports/aquatic-endurance-track.json) and run_fitness (sports/genpop-active.json) describe the same recreational activity -> one record `run_fitness` (F11r id), alias rec_running; extra injury codes folded in: ['PATELLOFEMORAL_ITB'] (genpop-active.json GP-11 / aquatic-endurance-track.json O11 (merge step))
- **M-DEDUP-rec_cycling** rec_cycling (sports/aquatic-endurance-track.json) and cycling_fitness (sports/genpop-active.json) describe the same recreational activity -> one record `cycling_fitness` (F11r id), alias rec_cycling; extra injury codes folded in: ['LOW_BACK_LOADING', 'PATELLOFEMORAL_ITB', 'NECK', 'BONE_LOADING_NON_IMPACT'] (genpop-active.json GP-11 / aquatic-endurance-track.json O11 (merge step))
- **M-DEDUP-rec_ski_snowboard** rec_ski_snowboard (sports/aquatic-endurance-track.json) and ski_snow_prep (sports/genpop-active.json) describe the same recreational activity -> one record `ski_snow_prep` (F11r id), alias rec_ski_snowboard; extra injury codes folded in: ['FALL_UPPER_LIMB', 'PATELLAR_TENDON'] (genpop-active.json GP-11 / aquatic-endurance-track.json O11 (merge step))
- **M-PROMOTE** 04 v1 variants promoted to full profiles by the sports files (baseball_catcher, baseball_pitcher, basketball_big, basketball_guard, crossfit_class, football_qb, football_specialist, hockey_goalie, soccer_gk, softball_pitcher, track_400, track_jumper, track_thrower, volleyball_libero, volleyball_setter) are removed from their 04 parent variant lists and listed under promoted_variants; football_specialist became football_k_p (alias kept) (sports/team.json id_note; aquatic-endurance-track.json id_note)
- **M-PADEL** competitive padel has no researched profile: the picker sport `padel` maps to `tennis` + variant `padel_competitive` (INFERRED); recreational padel keeps its own profile rec_padel (combat-strength-fitness.json has no padel profile; generator_spec F11 padel_competitive routes_to)
- **M-REC-CLASS** recreational profiles take the ground-contact class of their activity (golf 25 %, running 75 %, softball / hockey 40 %, soccer / flag / ultimate 60 %, swimming / cycling / ski 40 % ...); the generic weekend_warrior, rec_league (no sport), dance and active-aging profiles stay class 3 (50 %, 'weekend warriors 50 %' COACH-R2 ATH-01). Volume stays small; only the plyometric : ballistic split follows the activity (COACH-ANSWER ATH-01 ('the longer they're on the ground, the less it is going to be plyo'), COACH-R2 ATH-01 approved shares; resolves genpop-active.json GP-3 (team.json and aquatic-endurance-track.json used 50 % for every rec profile, genpop used the activity class))

### 14.1 v1 headline findings (kept for history)

- COACH-ANSWER ATH-01 / CAT-10: what decides plyos vs ballistics is how long the sport keeps the athlete on the ground - short contacts (sprinters) -> more plyos, long contacts (karate, fighters, baseball) -> more ballistics, basketball 'a good mix'; programs start ballistic and become plyometric. v1 encodes a `ground_contact` class (1-5) per sport and derives the plyo share of power sets (PROPOSED map 75 / 60 / 50 / 40 / 25%, floor 20, ceiling 80). OBSERVED anchors from a re-count of his own programs by ground contact: BASEBALL blocks 44% / 36% / 44% plyo side, BOXER weeks 3-6 30%, MM athletic STARTING / MID / ADVANCED 33% / 8% / 9% (throw-dominant).
- COACH-ANSWER ATH-02 (ranking confirmed): basketball = volleyball > sprinters > football skill > soccer > MMA > tennis > baseball > hockey > wrestling / BJJ > boxing = karate > golf. v1 applies it to FAST-reactive plyometric contacts (the ground-contact definition): the boxer's 113-129 weekly jump contacts are mostly ballistic jumps (66) and landings (24), only 31 are fast-reactive, below baseball's 37 / 58 / 74 - so the coach's own programs agree with his ranking once contacts are classified his way. Targets follow the ranking by construction (section 5.12).
- COACH-ANSWER UNI-02 / UNI-03 / UNI-10: bilateral : unilateral runs from 90/10 to 10/90 by athlete, goal, phase and pain - bodybuilders / powerlifters about 50/50 at the start then 80/20-90/10 bilateral, field / change-of-direction athletes 80-90% unilateral, bilateral minimal in season; unilateral = health and rotational foundation, bilateral = driving force; upper body the same. OBSERVED today: 26-32% unilateral in strength / conjugate, ~50% in the BYOP 4-day templates, 43-47% in baseball (every block, including in-season), 50-75% in the MM athletic blocks, 63% HYBRID. v1 sets block-start / block-end / in-season values per profile (section 5.11).
- COACH-ANSWER CAT-13 / UNI-12 / UNI-06: contralateral loading pulls you INTO the hip (change-of-direction athletes: football, soccer, basketball, tennis), ipsilateral helps you OUT of the hip (sprint acceleration - ipsilateral step-ups); for bodybuilders / powerlifters contra/ipsi work is a health accessory mostly in weeks 1-4. Court and combat athletes get more frontal / transverse unilateral work, aesthetics clients little. Same-pattern pairing (squat + lunge) drives a muscle harder (aesthetics, high-level athletes); cross-pattern pairing keeps bootcamp clients less sore.
- COACH-ANSWER ATH-05 / EQ-06: medball volume is high for baseball, boxing, MMA, tennis and golf, moderate for basketball and football, and NONE in the main workout for aesthetics clients (warm-up only); balls never over 20 lb. OBSERVED volumes: 176-192 throws/week in baseball (block means; single weeks 70-290; 45-63% transverse), 190 -> 380 for the boxer, 210 -> 400 -> 420 in the MM athletic blocks (210 and 420 ASSUMED from 'ALL LIST'), 64-96 in the BYOP athletic template at 2 sets.
- COACH-ANSWER ATH-10 / ATH-12 / ATH-09: everyone in athletic training gets Olympic lifts (L1: DB/KB snatches, hex-bar jumps, hang pulls / cleans without bumpers; L2+: full 'Squat' lifts), youth may do some from the floor; contrast / complexes only for L2+ athletes in the off-season at ~78-85%. v1 raises the Olympic dose where it was optional or zero (baseball 0.6 -> 8 sets, golf, soccer, tennis, karate, BJJ, youth, distance runners).
- COACH-ANSWER ATH-07 / ORD-09: aerobic sessions per week = 3 for general and fat-loss clients, 2 for athletes in season, 4 for aesthetics / bodybuilders plus long walks after workouts; fighters get a real aerobic block, not a warm-up. OBSERVED today: physique colour C 2x/week; fat loss C 2x + 2 metabolic circuits (12 -> 33 min work); boxer one A + one C; baseball only short A-type buy-outs (10-39 s, 3-4 bouts/week); HYBRID one A + one C; CrossFit 2-4 by level + 1-4 WODs.
- COACH-ANSWER ATH-04: boxers REDUCE pressing and arm volume when punching volume is high - 'don't completely cut it'. OBSERVED: the boxing tab removed horizontal push, vertical pull and arm isolation in weeks 3-8; v1 keeps HPUSH 3, VPULL 3 and 2 + 2 arm sets in the boxing budget and applies the same reduce-not-cut rule to the other strikers.
- COACH-ANSWER PER-08: in season, speed athletes sprint, most others maintain strength, some keep high jumps; about 2 lifting days, low volume, bilateral minimal, 2 aerobic sessions; pre-season = more speed / power, less volume (PER-08 RIGHT) - the v1 season multipliers (section 7) follow this, not the observed baseball volumes. OBSERVED (BASEBALL; season labels INFERRED from dates): off-season = new menu every week, '12/10/8/8', OLY late; pre-season = +47% jump contacts, x3 sprint sets, contrast complexes, OLY 75 -> 90%, resistance flat then +2.6 / +3.8 / +3.7% per week, DELOAD (-31% resistance, -46% all sets); in-season = flat 4 x 10, no compound below 8 reps, no Olympic lifts, two alternating proven menus.
- COACH-ANSWER ATH-09 / GEN-02: no rule depends on sex - age, foundation (training experience), goal and injuries decide. v1 removed the female-athlete landing rule, the softball 'female populations' rationale and the sex-based bone-stress list. Older clients get few plyos unless they ask; older, injured and high-volume clients collect volume on constrained machines and never get the overhead squat, snatch, low-bar squat or depth jumps (EQ-03).
- COACH-ANSWER PRG-09: high school, college and pro athletes need the same things; loads and speeds change, pros get more care (contracts), college athletes adapt as much as they can, high school athletes 'just have to do a lot of work'. Competition level is therefore a modifier on loads and progression, not a separate profile.
- COACH-ANSWER ATH-13: the 'Justice League' tab was a marketing name for a weekend-warrior program (non-competitive athletic adults and youth). The profile is now 'All-around athletic / weekend warrior' (`weekend_warrior`), and it is also where recreational players of any sport land (GEN-02).
- OBSERVED athletic share of weekly working sets (excluding medball throws): 0% in every physique, bootcamp and fat-loss template and - after COACH-ANSWER ORD-08 (A-drills are warm-up) - 0% in the gym UPPER/LOWER and PPL examples too; 5% strength/conjugate (one 3x6 'EASY' plyo); 16% HYBRID; 16-22% BASEBALL; 32% BYOP athletic at the coach's 2-sets dose; 28% -> 19% -> 15% across the MM athletic STARTING / MID / ADVANCED blocks; 36% for the boxer's conversion weeks.
- OBSERVED + INFERRED: the BYOP templates share one resistance skeleton (knee + pull / hip + push, bilateral -> unilateral -> isolation, every pattern 2x/week - pairing confirmed by UNI-11 / ORD-06) and swap the PREFIX: athletic slots for athletes, calves / biceps / triceps for physique, cardio slots for bootcamp. BASEBALL (Parts A-E) and BOXING (3x10 base -> complexes) are structurally different programs that reuse the same 8-pattern vocabulary, so 'one skeleton, many dials' is an INFERRED modelling choice.
- COACH-ANSWER VOL-09 / VOL-10 / UNI-01 / VOL-17: helpers get 0.25 set (not 0.5), a 10/10 unilateral set is 1 set credited mainly to the primary muscle, athletic sets never count toward muscles, calves get 3 sets every leg day, rear delts their own sets and athletes about 2 core exercises a session. The per-muscle table (5.6) is recomputed with the 0.25 map; weekly budgets now carry the calves / rear-delt / core sets the coach says he always had athletes do but never wrote.
- COACH-ANSWER ATH-11: core goes FIRST, as the warm-up, for everybody (movable after the plyos or the strength block if the user prefers) - replacing the v0 reading (BYOP core on optional days; BASEBALL core second; MM STARTING first / second / last). OBSERVED core-by-plane: BASEBALL rotates 'LATERAL CORE' (Mon), 'Transverse core' (Tue/Fri), 'Sagital core' (Thu) -> 48% transverse, 24% sagittal, 22% frontal sets.
- COACH-ANSWER ATH-06 / LIB-21: the route-tree COD names are for every athlete, tiered by turn angle, and MACH drills plus the fixed speed-session order go into the library. OBSERVED: change of direction is zero in every MASTER_MODEL program; only the BYOP athletic template has COD (4 slots/week = 48-64 cuts at 2 sets); sprinting has no BYOP slot.
- OBSERVED: 'level' moved volume in opposite directions by population - athletes STARTING -> MID -> ADVANCED: working sets -19% and -18%, jump contacts -51% and -55%, throws +90% and +5%; gym clients NOVICE -> NEWBY -> INTERMEDIATE: weekly sets +18-23% and +13-14%. COACH-ANSWER PRG-04 says STARTING / MID / ADVANCED are blocks or levels 'depending on whatever is needed', PRG-05 defines L1-L3 by training experience in years, and PRG-06 asks for one sound rep/set algorithm for every model (the upper-day rep rise was a fill error).
- OBSERVED combat phasing (boxer): 2-week hypertrophy base (3 x 10 on all 8 patterns, no plyos) -> 6-week conversion (exercise list replaced, contrast complexes of the 'ALL ABOUT SQUATS' 'FRENCH CONTRAST' type - the boxing tab never uses that term, 2-week steps, wk 7 accessory mini-deload while the hinge complex / clean & press / row superset rise 3 -> 4 -> 6 sets, wk 8 peak). Steps and waves for fight prep are confirmed (PER-10).
- OBSERVED injury logic the coach already uses (and confirmed by VOL-03 / UNI-08 / EQ-03): joint pain -> unilateral and split grips (DB/KB) first, cut the pattern 30-50%, machines, or drop the exercise; throwers press mostly with DBs / landmine / single-arm (barbell overhead pressing appears 3 times in the baseball year); Copenhagen planks appear in the athletic, boxing and baseball programs. SCIENCE adds Nordics (-51% hamstring injuries), Copenhagen (-41% groin problems), landing-first neuromuscular training (about -50% non-contact ACL injuries), jumper's-knee volume caps (44.6% prevalence in volleyball, 31.9% in basketball).
- MATRIX v1: 27 profiles and 24 position/phase variants, each a weekly set budget per category (PLYO, JLK, BALL, THROW, COD, SPRINT, TE, 8 resistance patterns, isolations, CORE, FOCUS) so shares, muscle sets, plyo:ballistic split and contact checks are computed, not asserted. Off-season main days land at 16.3-44 sets and an estimated 41-80 minutes (PROPOSED time heuristic), inside the coach's 1.5 h (max 2 h) athlete cap; the general-population profile sits at about 43 min against the 45-60 min general cap, fat loss at about 62 min, just over it (UNI-09). v1 verification: by EXERCISE COUNT most athlete profiles exceed the coach's 10-12 cap (VOL-08) when each category gets its own exercises - session_load_check adds the check and a PROPOSED consolidation rule.
- Library gaps the profiles need: a SPRINT slot and MACH drills (confirmed LIB-21), a plyo / ballistic / landing tag on every athletic item (new, ATH-01), REPS units for contacts / metres / seconds / per-side, neck exercises, CARRY and DRAGS items (confirmed LIB-19), a rear-delt slot (VOL-17), frontal / transverse lower-body moves (LIB-20), reactive agility drills and equipment tags.

### 14.2 v1 changes (kept for history)

- **ATH-01 / CAT-10** - Plyo vs ballistic is decided by the sport's ground-contact time. New per-profile attribute `ground_contact` (class 1-5) and a derived plyo : ballistic split of power sets (PROPOSED map 75/60/50/40/25 % plyo, floor 20, ceiling 80); new BALL category (ballistic jumps) split out of PLYO; programs start ballistic and become more plyometric.
- **ATH-01 (observed re-count)** - The coach's written athletic work was re-classified by ground contact (v1_power_mix.py): BASEBALL blocks 36-44% plyo, BOXER weeks 3-6 30%, MM athletic 8-33% - these anchor the class map.
- **ATH-02** - Confirmed plyo ranking is now enforced by construction on a new PLYOMETRIC-contacts dial (fast-SSC, high amplitude): basketball = volleyball > sprinters > football skill > soccer > MMA > tennis > baseball > hockey > wrestling / BJJ > boxing = karate > golf. The v0 scale (all jump contacts) is kept as the NSCA safety check. Resolves v0 open questions 1-3.
- **ATH-03** - Resistance vs speed/power groups encoded per profile (`ath03_group`); rugby mapped to lineman / big-skill profiles, heavyweight fighters by body weight, track & field throwers added as a variant.
- **UNI-02 / UNI-03 / UNI-10** - Bilateral : unilateral share per profile on the 90/10 <-> 10/90 scale with block-start, block-end and in-season values (bodybuilders / powerlifters 50/50 -> 80/20-90/10; field / COD athletes 80-90% unilateral; in-season bilateral minimal); upper body follows the same logic; weekly set budgets re-split to the mid-block value.
- **CAT-13** - Contralateral (into the hip: COD sports - football, soccer, basketball, tennis) vs ipsilateral (out of the hip: sprint acceleration, ipsilateral step-ups); contra/ipsi as health accessories for bodybuilders / powerlifters mostly in weeks 1-4.
- **UNI-12** - Frontal / transverse share of unilateral lower sets per profile (high for basketball, tennis, soccer, MMA and other court / combat athletes; low for aesthetics).
- **UNI-06 / UNI-11 / ORD-06** - Pairing: same-pattern for aesthetics and high-level athletes, cross-pattern for bootcamp / general; hip-dominant + push and knee-dominant + pull in full-body and bootcamp days (Bootcamp Option 1 Tue/Fri wiring corrected).
- **ATH-04** - Boxers (and, by extension, strikers) REDUCE pressing, vertical pulling and arm isolation when punching volume is high - never cut to zero; SHOULDER_STRIKER rule and boxing budget changed (HPUSH 3, VPULL 3, arms 2 + 2).
- **ATH-05 / EQ-06 / EQ-07 / LIB-22** - Medball volume by sport: high for baseball, boxing, MMA, tennis, golf; moderate for basketball and football; none in the main workout for aesthetics (warm-up only); ball never over 20 lb; no band chops; a throwing slot can be the whole ~19-throw list.
- **ATH-07 / ORD-09** - Aerobic sessions/week: 3 general and fat loss, 2 athletes in season, 4 aesthetics / bodybuilders + long walks after workouts; fighters get a real aerobic block; athlete off-season counts PROPOSED.
- **ATH-08** - Pitcher variant confirmed: less overhead pressing, more arm care, rotational throws kept light.
- **ATH-09 / GEN-02** - No sex-based logic anywhere (female-athlete landing rule, softball rationale and bone-stress list removed; v0 open question 14 answered): age, foundation, goal and injuries decide. Older clients: few plyos unless asked. Youth: some Olympic lifts from the floor.
- **ATH-10 / LIB-07 / LIB-13** - Everyone in athletic training gets Olympic lifts by level (L1 DB/KB snatch, hex-bar jumps, hang pulls/cleans; L2+ full 'Squat' lifts); Olympic dose raised where it was optional or zero (baseball 0.6 -> 8, golf, soccer, tennis, karate, BJJ, youth, distance runner).
- **ATH-12** - Contrast / complexes: L2+ athletes, off-season only, ~78-85%, no rest inside the complex.
- **ATH-13 / FIX-03** - The 'Justice League' name is retired: the profile is now 'All-around athletic / weekend warrior (non-competitive adults and youth)' (`weekend_warrior`, was `athlete_generic`); the sheet tab is cited only as a source.
- **PER-08** - In-season content by athlete type: speed athletes -> sprints, most others -> strength maintenance, some -> high jumps; about 2 lifting days; minimal bilateral; 2 aerobic sessions.
- **PRG-09** - High school, college and pro baseball (and other) athletes share the same plan; loads and speeds differ; pros get more care. Competition level is a modifier, not a profile. Thursday = strength.
- **EQ-03 / EQ-04 / EQ-11** - Older, injured and high-volume clients collect volume on constrained machines (compounds and isolation); never overhead squat, snatch, low-bar squat, depth jumps; new HIGH_VOLUME_CONSTRAINT rule; hack squat no longer 'deprioritised' (machines are not ranked).
- **EQ-01 / EQ-12** - No bands or variable resistance in any generator rule (banded neck, banded adduction, chained / banded pulls, 'reverse banded' squirrel jumps written unbanded).
- **VOL-09 / UNI-01 / VOL-10** - Muscle credit map: helpers 0.25 (was 0.5); unilateral knee-dominant credits quads 1.0, glutes 0.25; athletic sets credit no muscle. Per-muscle table recomputed.
- **VOL-17 / ATH-11** - Calves 3 sets every leg day, rear delts their own sets, about 2 core exercises for athletes; core FIRST in every session (movable). Weekly budgets updated.
- **VOL-08 / VOL-16 / UNI-09** - Session caps and length per population added to the assembly rules (field athletes off-season up to 10-12 exercises; resistance-only 5-7; ~1.5 h athletes, 45-60 min general).
- **PER-01 / PER-05 / PER-07 / PER-10 / PER-11** - Plan-length shapes rewritten: 4-6-week maintenance / transition at 50-70% volume, 8-week = 4 adapt + 4 drive, 12-week = 2-4 acclimation + 4-6 build + hardest last weeks, repeated cycles one level higher, week-by-week and yearly modes; deload ~half the sets; tests by checkbox; VOL 1/2/3 per block for all athletes.
- **ORD-08** - A-drills are warm-up, not volume: the MM UPPER/LOWER and PPL rows in section 2 now show 0% athletic share (A-drill sets moved out of the totals).
- **ATH-06 / LIB-21** - Route-tree COD names are for every athlete, tiered by turn angle; MACH drills and the fixed speed-session order go into the library (resolves v0 questions 4-5 except reactive agility).
- **VOL-11 / PRG-07 / UNI-04** - 40-rep sets are an optional AMRAP / CrossFit style only; '12/10/8 -20' pyramid and '10/10' per-side meanings recorded; heavy low-rep unilateral work optional.
- **PRG-04 / PRG-05 / PRG-06** - STARTING / MID / ADVANCED can be blocks or levels as needed; levels L1-L3 defined by training experience in years; rep/set rises must follow one sound algorithm for every model.
- **PRG-10 / PRG-12 / LIB-18** - CrossFit FULL TIME = competitor, HALF TIME = class member; Chris Hinshaw plan used as-is for the half marathon only; the '21.6 mile run' is the coach's 'marathon' (flag: 26.2 mi).

The v0 and v1 verification logs are kept in the JSON (`verification_log_v0`, `verification_log_v1`). The v1 build scripts in `synthesis/_build_04/` are stale for v1.1.

## v1.1 sport verification log

Adversarial check of the merged sport profiles (2026-10-08) against the coach's request ('all of the different popular sports in the United States ... include swimming ... for the general population include pickleball ... high rows [HYROX] and pickleball ... stay athletic and active'), coach_answers_full.md (ATH-01..13, UNI-02/03/10/12, CAT-13) and coach_answers_round2.md (R2-ATH-01..08, R2-PER-06/07). Authority order: COACH-R2 > COACH-ANSWER > everything else. No Google Sheet was opened or modified. JSON twin: `verification_log_v1_1_sports` in 04_profiles.json.

**Verdict:** PASS WITH FIXES - coverage complete after additions; coach rules consistent after fixes; 11 science claims spot-checked (8 verified, 3 corrected / narrowed).

### (1) Coverage

- All 45 popular US sports in the coach list were already present (own profiles or a routed nearest profile); swimming has sprint / middle / distance profiles + 5 stroke variants, plus diving, water polo and lap swimming; gen-pop pickleball (`rec_pickleball`, 50+ / 60+ rules) and HYROX (`hyrox_fitness`) exist alongside their competitive versions.
- Gaps found and ADDED (PROPOSED, every number for the coach's review): `rec_combat_fitness` (boxing / kickboxing / martial-arts classes; grappling variant `combat_fitness_grappling`), `rec_climbing` (climbing / bouldering gym), `rec_ocr` (first Spartan / Tough Mudder - sits next to HYROX); routed activities for badminton / squash / racquetball / table tennis (-> rec_tennis), disc golf and bowling (-> rec_golf), trail running (-> run_fitness), mountain biking (-> cycling_fitness), kayak / canoe / wakeboard / water-ski (-> surf_paddle); routed competitive sports skateboarding and surfing (-> ski_freestyle) and speed skating (-> ski_alpine); a trail / ultramarathon choice under distance running. Counts now: 127 profiles, 52 picker sports, 26 activities.
- Not added (not gym-performance sports, or covered by the 'not listed -> closest type' fallback): equestrian, rodeo, motorsports, archery / shooting, esports, cornhole.

### (2) Consistency with the coach

| Rule | Evidence | Result | Fix |
|---|---|---|---|
| karate / boxing / kickboxing / wrestling / BJJ / golf more ballistic (25 %), sprinters more plyometric (75 %), all named shares exact | COACH-ANSWER ATH-01, COACH-R2 ATH-01 | PASS (C1b) | - |
| ballistic = one big effort / longer contact; plyometric = short bouncy contacts | COACH-R2 ATH-02 | FIXED | swimming (sprint / middle / distance) and lap swimming class 4 (40 %) -> class 5 (25 %): starts and turns are single big efforts = ballistic; PLYO / JLK / BALL / THROW re-split at the same total (flag F10) |
| no medball in the main workout for aesthetics | COACH-ANSWER ATH-05 | PASS (C9) | - (physique, fat_loss, hybrid all 0) |
| older adults: no Olympic lifts / plyos / depth jumps by default; option with the warning | COACH-R2 ATH-08, COACH-ANSWER ATH-09 / EQ-03 | FIXED | 'low ankle hops' were a default for 60+ although they are on the coach's own plyometric list (R2-ATH-02) and the competitive senior variant already had none: moved to the opt-in (113 JSON strings, md cards, active_aging_60plus JLK 2 -> 0); landing drills = step-down and stick (receive stage, no rebound) stay (flag F9, R3-07) |
| field / COD athletes 80-90 % unilateral; bodybuilders / powerlifters bilateral-leaning | COACH-ANSWER UNI-02 / UNI-03 / UNI-10 | PASS + FIXED | competitive COD sports 20/80 -> 10/90, physique 50/50 -> 80/20, powerlifting 50/50 -> 90/10 (PASS); rec soccer / basketball / flag / ultimate / hockey were 50/50 -> 40/60 while rec tennis / pickleball / padel were 30/70 -> 20/80: harmonised to 30/70 -> 20/80 (flag F11) |
| contralateral for COD athletes, ipsilateral for acceleration, contra / ipsi as health accessories for size / strength | COACH-ANSWER CAT-13 | PASS | new profiles follow it |
| frontal / transverse unilateral work higher for court and combat athletes | COACH-ANSWER UNI-12 | PASS | rec_combat_fitness 40 % |
| everyone in athletic training gets Olympic lifts; up to 4 x / week; full lifts 3-5 reps | COACH-ANSWER ATH-10, COACH-R2 ATH-04 / ATH-05 | PASS + clarified | crossfit_competitor showed 0 Olympic sets (the OBSERVED strength-month budget): note added (power months 20-24 sets); swimming_distance L2+ list no longer lists barbell snatch (matches its avoid list) |
| no bands / variable resistance anywhere | COACH-ANSWER EQ-01 / EQ-12 | PASS (C10) | 0 prescriptions; 'v0 analyst band' = a volume range |
| strikers: pressing / arm volume down, never to zero, when punching volume is high | COACH-ANSWER ATH-04 | PASS | applied to rec_combat_fitness |
| aerobic sessions by sport; pre-season 2; in season 2; user-adjustable | COACH-R2 ATH-06, COACH-ANSWER ATH-07, COACH-R2 SES-06 | PASS (C3-C5) | swimming 0 extra (0-1) kept |
| pre-season 4-6 weeks at about 60 % + 1-2-week taper; maintenance length chosen and extendable | COACH-R2 PER-06 | PASS + swim note | swimming: the taper sits before the championship meet, not the first dual meet (swimmers train through early meets) |
| tests before / at the end of a block, never mid-block; no 1RM / max mile from zero | COACH-R2 PER-07 | PASS | every profile's tests block (incl. the new ones) |

### (3) Science spot-checks (web)

| Claim | Result | Source |
|---|---|---|
| taper about 2 weeks, volume -41-60 %, intensity and frequency kept (AQ7, Bosquet 2007) | VERIFIED | https://pubmed.ncbi.nlm.nih.gov/17762369/ |
| start time vs 1RM r = -0.74, jump height r = -0.69, CMJ peak power r = -0.85 (AQ6, West et al. 2011, n = 11) | VERIFIED | https://researchportal.bath.ac.uk/en/publications/strength-and-power-predictors-of-swimming-starts-in-international/ |
| 73 % of breaststroke specialists report knee pain (AQ4) | VERIFIED | https://journal.aspetar.com/en/journals/volume-4-targeted-topic-aquatic-sports/the-knee-and-back-in-swimming |
| block time 0.77 vs 0.80 s kick vs track start (AQ1) | VERIFIED (0.70 s figure from another study not re-checked) | https://coachsci.sdsu.edu/swim/biomechs/honda.htm |
| swimmer shoulder prevalence 40-91 % (AQ3) | VERIFIED; the NCAA 34.7 / 36.8 % shares are not in that article - flagged | https://pmc.ncbi.nlm.nih.gov/articles/PMC3435931 |
| senior pickleball injuries: strains / sprains 31.0 %, fractures 30.4 %, slip / trip / fall / dive 66.9 %, women OR 9.3 wrist fracture (G3) | VERIFIED (pickleball values) | https://pmc.ncbi.nlm.nih.gov/articles/PMC8091689 |
| 24.3 M US pickleball players in 2025, 16.8 M casual, 7.48 M core, +171.8 % in 3 years (G1 / G2) | VERIFIED | https://sfia.org/research/u-s-pickleball-participation/ |
| pickleball ~70 % of max HR in 40-85-year-olds (G4) | CORRECTED - the source reports moderate intensity by heart-rate reserve (HR 79-158) with vigorous bursts; 6 weeks of 3 x 60 min improved VO2max, BP, HDL / LDL | https://www.acefitness.org/continuing-education/certified/august-2018/7053/ace-sponsored-research-can-pickleball-help-middle-aged-and-older-adults-get-fit/ |
| HYROX = 8 x 1 km run + 8 stations (K17) | VERIFIED | https://hyrox.com/the-fitness-race/ |
| HYROX about 60 % running: 51.2 of 84 min running, VO2max rho -0.71, ~80 % of the race very hard (K18, Brandt 2025) | VERIFIED | https://www.frontiersin.org/journals/physiology/articles/10.3389/fphys.2025.1519240/full |
| pickleball injuries: adults 50+ = 91 % of injuries; fractures 27 %, sprains 27 % (K34) | VERIFIED | https://aoao.org/2025/03/21/rising-orthopedic-injuries-in-pickleball-insights-from-a-10-year-national-study/ |
| older pickleball players: arthritis flare-ups, meniscus tears, Achilles ruptures, rotator-cuff tears; fractures highest at 60-69 (K34c) - basis of the new KNEE_DEGENERATIVE_COURT code | VERIFIED | https://health.ucdavis.edu/research/news/headlines/pickleball-injuries-are-on-this-rise-here-are-tips-to-avoid-them-while-playing/2024/08 |

### (4) Swimming - dryland realism

- **pool_load**: the pool supplies the aerobic work (elite about 40-70 km a week - AQ12): 0 extra gym aerobic sessions by default (0-1, user-adjustable - COACH-R2 SES-06); an optional land Orange only in the transition block
- **dryland_days**: 3 dryland days + 1 optional (2 for younger / lower-level swimmers or heavy pool phases - PROPOSED); each >= 4 h from a hard pool set when possible
- **focus**: strength and power for starts and turns (lower-body max strength and jump power relate to 15 m start time - West et al. 2011, r = -0.74 to -0.85, AQ6) + shoulder health every session + trunk
- **plyo**: low: class 5 share 25 %; ballistic jumps from a start / streamline position; small ankle block for bone (AQ8); no depth jumps, bounds or hurdle hops by default
- **shoulder**: posterior cuff and scapular work 2-3 x / week (DB / cable / KB, never bands); low-volume, seated or landmine overhead pressing; overhead medball throws kept off heavy-pull pool days; snatch variants single-arm DB first
- **taper**: championship taper 1-2 weeks (AQ7); the swim coach tapers the pool, the tool tapers dryland only
- **evidence**: SCIENCE AQ6 / AQ7 / AQ8 / AQ12 verified or cited; day counts PROPOSED; v1.1 sport verification
- Numbers after the fix (off-season, mid-block): sprint PLYO 1.5 / JLK 3 / BALL 7.5 / THROW 5 (26 %), middle 1 / 3 / 7 / 4 (27 %), distance 0.5 / 2 / 4.5 / 3 (25 %), lap swim 1 / 1.5 / 3.5 / 4 (25 %); weekly totals unchanged.

### (5) Pickleball / padel / recreational tennis 50+

- **who**: players 50+ (many recreational players - adults 50+ are about 91 % of pickleball injuries, K34); at 60+ the active_aging_60plus rules switch on on top (COACH-R2 ATH-08)
- **knee**: KNEE_DEGENERATIVE_COURT rules every week: leg press / box squat to a pain-free depth, split squat and low step-ups, slow-eccentric leg extensions and isometric holds; lateral hip strength; no deep loaded pivoting under fatigue
- **achilles_calf**: ACHILLES_CALF every leg day: straight-knee and bent-knee calf raises (3 sets, VOL-17), slow lowering, progress ankle work by no more than about 10-20 % a week; a 5-min warm-up before play and before ankle work (K34c: Achilles ruptures)
- **shoulder_elbow**: posterior cuff and rear delts 2-3 x / week (side-lying DB external rotation, prone Y / T, KB face pulls - R2-LIB-04), overhead pressing seated / landmine and pain-free; wrist-extensor isometrics for the paddle / racket elbow (ELBOW_LATERAL_RACKET); rotator-cuff tears are a common older-player injury (K34c)
- **lateral**: lateral shuffles, crossover steps and drop-step 'turn and run' (EASY TURN -> MOD. TURN; HARD TURN only for L2+ under 60); no fast backpedal drills (FALLS_COURT)
- **plyo**: low-impact only: RC1 landings (stick the split step / lateral stick), low-amplitude split-step pogos and lateral line hops on a forgiving surface, bilateral before single-leg; no depth jumps, hurdle hops or bounds by default at 50-59; progress only when landings are quiet and pain-free (FALLS_COURT, ACL_LANDING_CUTTING stage-1 logic); at 60+ all of it except the landing drills is opt-in with the warning (COACH-R2 ATH-08)
- **falls_wrist**: balance, reactive stepping and wrist / forearm strength every week (FALLS_COURT; wrist fractures dominate senior falls - G3)
- New injury code `KNEE_DEGENERATIVE_COURT` (knee arthritis flare-ups / meniscus in older court players - K34c) added to rec_pickleball, rec_padel, rec_tennis and pickleball_competitive; existing ACHILLES_CALF, FALLS_COURT, SHOULDER_THROWER and ELBOW_LATERAL_RACKET rules kept. G4 wording corrected (moderate intensity by heart-rate reserve, not '~70 % of max HR').

### Fix list (JSON)

- **A1** swimming_sprint: class 4 -> 5, share 26 %, split {'PLYO': 3.0, 'JLK': 4.0, 'BALL': 5.0, 'THROW': 5.0} -> {'PLYO': 1.5, 'JLK': 3.0, 'BALL': 7.5, 'THROW': 5.0}
- **A1** swimming_middle: class 4 -> 5, share 27 %, split {'PLYO': 2.0, 'JLK': 4.0, 'BALL': 5.0, 'THROW': 4.0} -> {'PLYO': 1.0, 'JLK': 3.0, 'BALL': 7.0, 'THROW': 4.0}
- **A1** swimming_distance: class 4 -> 5, share 25 %, split {'PLYO': 1.0, 'JLK': 3.0, 'BALL': 3.0, 'THROW': 3.0} -> {'PLYO': 0.5, 'JLK': 2.0, 'BALL': 4.5, 'THROW': 3.0}
- **A1** lap_swim: class 4 -> 5, share 25 %, split {'PLYO': 2, 'JLK': 2, 'BALL': 2, 'THROW': 4} -> {'PLYO': 1.0, 'JLK': 1.5, 'BALL': 3.5, 'THROW': 4.0}
- **A2** swimming: pre-season taper note (taper sits before the championship meet), dryland_realism_v1_1 block, distance L2+ barbell snatch removed
- **A3** 60+ default: low ankle hops moved to the opt-in (113 strings); active_aging_60plus JLK 2 -> 0; F9 / R3-07 updated
- **A4** rec_soccer / rec_basketball / rec_flag_football / rec_ultimate / rec_hockey: bilateral : unilateral 50/50 -> 40/60 changed to 30/70 -> 20/80 (UNI-02)
- **A5** rec_pickleball / rec_padel / rec_tennis / pickleball_competitive: age_50_plus block + new injury code KNEE_DEGENERATIVE_COURT (injury_library)
- **A6** science wording: G4 (pickleball intensity) corrected in 2 strings + reference; AQ3 NCAA part flagged unverified; G3 / AQ1 marked verified
- **A7** crossfit_competitor: olympic_policy.weekly_sets_note (0 = strength month; power months 20-24 sets)
- **A8** hyrox_fitness activity note: 'high rows' = HYROX reading backed by COACH-ANSWER EQ-06 / VOL-11
- **B1** 3 new recreational profiles: rec_combat_fitness (+ variant combat_fitness_grappling), rec_climbing, rec_ocr
- **B2** activities: + rec_combat_fitness (style router), rec_climbing, rec_ocr; routed: racket_other -> rec_tennis, disc golf / bowling -> rec_golf, trail running -> run_fitness, mountain biking -> cycling_fitness, kayak / wakeboard -> surf_paddle
- **B3** sports: + skateboarding, surfing (competitive), speed skating (routed); distance_running + trail / ultra choice; coverage tables extended
- **C1** generator_spec_v1.json vocab / F11 / F11r / D2 synced with the new profiles, activities and routed sports

### Checked and not changed

- distance runners / run_fitness / triathlon stay contact class 1 (75 %) although distance-pace contacts (~0.18-0.26 s) are longer than the class-1 text says: the 04 v1 reading is 'repeated reactive contacts' (bouncy, R2-ATH-01 'fast, bouncy contacts'); dose is small - flagged for round 3 (R3 candidate)
- volleyball 40/60 -> 30/70 and baseball 50/50 -> 40/60 bilateral : unilateral kept: volleyball take-offs are mostly two-footed; baseball is OBSERVED in the coach's program (4 + 4 sets)
- swimmers lean bilateral (sprint 50/50 -> 60/40): starts and turns are two-footed pushes, not change of direction - consistent with UNI-02 (bilateral drives force)
- no bands anywhere: 0 prescriptions found (only 'never bands' rules, 'v0 analyst band' = a volume range, and avoid-lists)
- no medball in the main workout for physique / aesthetics (C9 PASS); fat_loss and hybrid also 0
- older adults (60+): Olympic lifts none by default in every olympic_policy (C8 PASS)

### For the master step (outside 04 - not edited here)

- 05_session_architecture.md / 05_templates.json (rules.older_adults_R2ATH08), 06_periodization, 11_training_variables, 12_volume_algorithm_v1 and BLAZE_CAMP_BRAIN.md still say 60+ keep 'landing drills and low ankle hops' by default - align with flag F9 (low ankle hops -> opt-in) or keep the old reading if the coach says so in round 3 (R3-07).
- generator_spec_v1.json was synced only where the new ids must resolve: vocab.profiles / profile_categories / template_refs, vocab.sports + F11 picker (3 routed sports, trail / ultra), F11r options + vocab.activities (9 activities, style router), D2 step 4 + 2 examples; ocr / climbing / combat sports point to their new recreational activity.
- Round-3 candidates added: R3-10 (new stay-athletic choices), R3-11 (racket 50+ rules); R3-03 and R3-07 reworded.


## v1.2 verification log

### Adversarial check of the v1.2 update (2026-10-09)

`coach_answers_round3.md` was read in full first; every round-3 answer was traced through the profile cards, tables, model sections and `04_profiles.json` (all 127 profiles and their variants), and checked against `06_periodization` v1.2 and `12_volume_algorithm_v1` v1.2. Edits were made in place by one script (session scratchpad `v12check/fix04.py`, count-checked; pre-check copies in `v12check/bak/`). The JSON was re-scanned after the edits (consistency checks C33-C35 added).

| Answer(s) | Where | Result |
|---|---|---|
| R3-VOL-02, R3-VOL-04, R3-GEN-01 (no check-ins, nothing stored) | injury_library, every injury_prehab copy, season_families.youth | FIXED: C31 ('no live check-in text') missed the BYOP logbook rules - PAIN_GENERAL "'Felt a PAIN' -> ... if twice in a slot" (69 strings), SHOULDER_SWIMMER (10), RIB_STRESS (3) and the youth circa-PHV "watch ... via 'HOW IT FELT?'" (1) needed logged answers and a stored history. Rewritten as rules the person or coach applies on the printed plan; the pain protocol itself (VOL-03, UNI-08, GEN-05) is unchanged. New check C33. |
| R3-VOL-01 (rear delts part of the shoulders group) | sample weeks, swimming priorities, legacy derived floor checks | FIXED: 94 sample-week strings still said 'rear delts (own sets)' / 'rear delts own sets' (and the swimming priority 'rear delts own sets'); 21 `derived.floor_10_check.rule` texts still said 'rear delts have their own approved 4/6/8'; 53 legacy per-muscle 'below the floor' lists still listed rear_delts. Now: rear-delt work sits in the shoulders group; rear_delts removed from the legacy lists, which are marked SUPERSEDED by `derived.v1_2_group_audit` (116 derived blocks). The swimming priority is worded 'counted in the deltoid group' so the compiled priority muscles do not change. |
| R3-VOL-04 (each trained group reaches its ceiling in the last week) | older_60_plus.steps, age_notes, the 60+ sample rules | FIXED: 37 strings still capped 60+ steps at 3 % ('12 v1.1 §3.4, PROPOSED'), a cap 12 v1.2 retired because it contradicts the approved stairway. Now: the same stairway; older adults are protected by the R3-ATH-02 defaults and constrained machines (EQ-03). Engine pointers updated to 12 v1.2 and the floor on groups (77 strings). |
| R3-PER-01 (recommendation; the plan ends; holidays between blocks) | season_families.general, aquatic | FIXED: the general family still offered 'an open-ended week-by-week mode' and 'holiday weeks = automatic maintenance' without a v1.2 note; the recreational event still read 'a 1-week taper (06 v1.1, PROPOSED)'. |
| R3-ATH-01 (swimming) | season_families.aquatic, swimming cards | FIXED: the aquatic family still read '1-2-week taper ... (the championship date is an open question - aquatic O4)' - now the approved 2-week dryland taper with the swim taper, 1 week or none before smaller meets. The profiles themselves were already correct. |
| R3-ATH-03 (HYROX) | hyrox_competitive | FIXED: two labels still pointed to 'open question Q4' - now the COACH-R3 ATH-03 reason (flag G5). |
| R3-ATH-04 (shares) | every class-5 profile, tables 4.1 / v1.2, cards, C1 | FIXED: the approved rule is 'each block starts 15 points more ballistic' (COACH-R2 ATH-01), but v1.1 had added a 20 % floor, so the 25 % class started at 20 % (5 points). The engine already computes end - 0.15. Now the class starts at 10 % (44 numeric fields, 119 block_shift texts, 50 evidence texts, the cards, the tables, C1; flag G11, check C34). |
| R3-ATH-05 (play days, cardio credit, event date) | event_prep texts, rec_pickleball / rec_padel / rec_tennis rules, rec_combat_fitness | FIXED: 14 event texts still read '1-week taper (06 v1.1 - PROPOSED)' - now 'then 1 easy week at about half the sets (approved COACH-R3 ATH-05)'; four rules still said 'the hardest lower-body day' (flag G7 claimed the data used the approved 'hardest gym day'). |
| R3-SES-01, R3-SES-02 (groups, field athletes, time, supersets) | session_rules, assembly_rules, session_load_check, stay_athletic_standard, 4.6 / 4.7 / 9.6 | FIXED: the field-athlete session rule and assembly step 7 still read '10-12 (about 2 core + 2-4 plyo/ballistic + 2-3 Olympic/power + 3-4 resistance)'; the full-body rule counted per muscle; supersets were not 'recommended'; assembly step 1 asked 'priority muscles' instead of Focus muscle 1 / 2; the md 4.7 floor line lacked the group counting its JSON twin has. New `session_load_check.caps_v1_2`. |
| Round-3 answers to the sports-file questions | open_questions.v1_1_sports, section 12.2 | FIXED: 20 questions answered or partly answered in round 3 (team O1 O2 O3 O6 O7; aquatic O1 O2 O3 O4 O9 O12; combat Q1 Q4 Q5 Q6; genpop GP-1 GP-2 GP-4 GP-5 GP-7) were still OPEN / PROPOSED - each now carries `status_v1_2` (and the md row its v1.2 status). |

**Leftover grep (md before section 14; JSON outside the history keys).** check-in / readiness / adapt() / tracking / stored data: only 'no check-ins', 'nothing stored' and RETIRED statements. Logbook-driven rules: none left (C33; the OBSERVED cell citation in PAIN_GENERAL.source stays as evidence). Rear delts with their own floor: none (C35). Apache / CC BY licensing: none. Mandatory maintenance week: none ('a recommendation, not mandatory' everywhere). 60+ step cap: none (C35).

**Engine-side check.** The compiler output (catalog, rules, templates, profiles) built from the pre-check and post-check JSON is byte-identical and the cross-checks are unchanged (session scratchpad `v12check/cmp.mjs`); the engine already used start = end - 15.

**New flags for the coach.** None beyond 06 v1.2 14.5 #5-6; G11-G14 record the corrections above.

**For the integrator (other files, not edited here).** `tools/compile/rules.mjs` still gives rear delts own targets and caps (`own_sets: true`, L(4, 6, 8)); `tools/fixture/rules.mjs` still caps 60+ steps at 3 %; `tools/fixture/review-v12.mjs` maps the word 'shoulder' in `resistance.priorities` to side delts, so priority texts must avoid it when they mean rear delts.


## v1.3 verification log (2026-10-11)

- Read first, in full: `design/ENGINE_V05_PLAN.md`, `coach_answers_round4.md`, `coach_answers_time_2026-10-10.md`, `coach_answers_codex_2026-10-10.md`.
- Added the v1.3 section; marked §3.1, §4.6, §4.7, §9.6 and §11 as changed; struck the session-length input and the minutes audit in §9.6; answered GP-2; added §12.1c.
- Confidence counts (23 confirmed by coach, 67 based on a similar sport, 37 proposed; 127 profiles) are those of the compiled model 1.3.0 (`model/CHANGELOG.md`, package V2).
- Not changed: every sport number (plyo shares, aerobic sessions, in-season rules, age overlays), the picker, the profile matrix, the weekly set budgets and the profile cards. The cards still print estimated minutes: read them as estimates. `04_profiles.json` is v1.2 (not re-issued).