# Equipment

This page explains how the model thinks about equipment. The main idea is **constraint**: how many reference points a set-up gives you. A machine with a seat and a back pad guides you a lot. A barbell in open space guides you very little and asks for the most skill. The coach approved a constraint scale from 1 to 5, and he uses it to decide who gets machines: people who are older, injured, or collecting a lot of volume. The page also covers the eight places people train (access profiles), what the plan does when equipment is missing (substitutions), the rule of no bands and no variable resistance, and the medball rules (light balls, never over 20 lb).

**How to read the tags.** `EQ-01`, `ATH-05` and similar = his round-1 answers (`coach_answers_full.md`). `R2-...` = round 2. `R3-...` = round 3, the newest; a later round wins. "chat" = things he said in conversation (`coach_chat_statements.md`, paraphrased closely unless quoted there). **OBSERVED** = read from his sheets. **INFERRED** = our reading. **PROPOSED** = our design, not confirmed by him. "Approved as proposed" = he marked our wording RIGHT without adding words.

**Short forms.** DB = dumbbell. KB = kettlebell. GHD = glute-ham developer, a bench that holds the feet and hips. TRX = a suspension trainer. HYROX = a fitness race of 1 km runs, each followed by a workout station.

Related pages: [categories.md](categories.md), [levels-and-zones.md](levels-and-zones.md), [exercise-library.md](exercise-library.md), [sessions.md](sessions.md), [athletes.md](athletes.md), [special-populations.md](special-populations.md), [stay-athletic-and-active.md](stay-athletic-and-active.md). His answers on this topic: [../03-coach-answers/equipment.md](../03-coach-answers/equipment.md). What he turned down: [../01-philosophy/what-he-rejected.md](../01-philosophy/what-he-rejected.md).

Decision records: [no bands, no variable resistance](../04-decisions/adr-034-no-bands-no-variable-resistance.md), [machines not ranked](../04-decisions/adr-035-machines-not-ranked.md), [light medballs](../04-decisions/adr-036-light-medballs.md).

---

## 1. How he thinks about equipment

**Rule.** Read equipment by how much it constrains you.

| Implement | How he describes it (chat) |
|---|---|
| Machines | many reference points and constraints: you sit, feet on the ground, you move hands or feet. You can push a lot and it is safer. |
| Dumbbells, kettlebells, medicine balls | in between |
| Barbells | the most skilled |

**Who gets more machines (chat):** people who want more volume, people with injuries, and older people.

He also said: "If you read the workouts you can understand them by their equipment usage." (chat) His own programs show it (OBSERVED):

| His programs | Machine share of the items (cable where counted) | Fast or ballistic items | Medball items |
|---|---|---|---|
| General population | machine 18 %, cable 15 % | 2 % | 0 % |
| Strength / powerlifting | machine 11 % | 16 % | 0 % |
| Athletes | machine 0.5 % (5 of 949 items) | 45 % | 13 % |

The implement tags behind these counts are INFERRED from exercise names. His sheets have no equipment column.

---

## 2. The constraint scale, 1 to 5

**Constraint:** how much the set-up holds and guides the body. More constraint = less to balance, safer to push hard. Less constraint = more skill and stability needed.

**Rule (EQ-13, approved as proposed).**

| Level | Definition | Examples from his library | Who it suits |
|---|---|---|---|
| **5** | seated machine with a back pad | leg press, leg extension, seated leg curl, machine calf raise, machine row, machine chest press, seated machine shoulder press, bike | older or frail people, pain, high-volume finishers, MYO sets |
| **4** | plate-loaded machine, Smith machine, or chest-supported | pendulum squat, hack squat, Smith machine, lat pulldown, assisted pull-up machine, chest-supported rows, belt squat, GHD | beginners learning to pull, volume clients, older or injured people |
| **3** | cable, or a dumbbell on a bench | cable chest press, DB bench press, box squat, glute bridge, push-up with hands on a bench, floor core work | beginners, hypertrophy accessories, an easier option when something hurts |
| **2** | standing free weights | front squat, barbell deadlift, standing DB press, push-up, goblet squat, loaded lunges, hang pulls and Olympic lifts | strength main lifts, athletes, intermediate and up |
| **1** | bodyweight, ballistic, reactive | pull-ups, handstand push-ups, pistol squat, push press, kettlebell swing, all plyos and sprints | athletes, advanced bodyweight skill |

**MYO set:** one longer set followed by several short ones with brief pauses. Only on the last exercise, on a machine or an isolation (VOL-15).

The five definitions are the wording he approved (EQ-13). The model reads them a little wider when it tags exercises: level 5 also means a fixed path, level 4 includes seated cables, and level 3 includes free weights held up by the floor, floor core work and a box used as a depth mark. That wider reading is INFERRED. The "who it suits" column is our reading of his answers (EQ-03, VOL-15, chat). The level on each exercise is INFERRED.

**Inside level 4.** Machines with a back pad (hack squat, pendulum) constrain more than the Smith machine, where the trunk is free. The leg press is level 5. His words: "Probably more constraint would be a hack squat and a leg press. Less constraint would be a Smith machine." (EQ-11) This orders machines by constraint only. It is not a ranking of which machine is better (section 4.3).

**The library by constraint level** (732 active records, recounted from the catalog):

| Family | Level 1 | Level 2 | Level 3 | Level 4 | Level 5 |
|---|---|---|---|---|---|
| Athletic | 194 | 43 | 2 | 0 | 0 |
| Resistance | 22 | 147 | 74 | 40 | 16 |
| Core | 0 | 19 | 62 | 2 | 0 |
| Functional | 0 | 12 | 15 | 0 | 0 |
| Cardio | 70 | 0 | 0 | 0 | 14 |
| **All** | **286** | **221** | **153** | **42** | **30** |

**Constraint and level.** A seat, machine or cable also makes an exercise easier: "When it's machines or cables, it changes because it's easier because the machine or the cable is doing the work for you." (CAT-04) That is why a lat pulldown or a seated press is foundational. See [levels-and-zones.md](levels-and-zones.md).

**Where it lives.** `generator_spec_v1.json > rule_tables.equipment.constraint_scale`; `synthesis/10_equipment_model.json > constraint_scale` (`levels`, `rules`); each catalog record's `constraint_level.value` and `constraint_level.basis`; facet `F.CONSTRAINT` in `synthesis/01_taxonomy.json`.

---

## 3. Implements

| Group | What it is | Constraint | Notes |
|---|---|---|---|
| Guided machines | fixed path plus seat and pads | 4-5 | "the machine or the cable is doing the work for you" (CAT-04) |
| Cables | free line of pull | 3 standing, 4 seated | no band ever stands in for a cable (EQ-01, EQ-07) |
| Barbell family (barbell, hex bar, EZ bar, safety squat bar, landmine) | one rigid bar | 2 (landmine 3) | the most skilled (chat); the only implement that loads behind the body (our note, INFERRED) |
| Hand-held weights (dumbbells, kettlebells, plates, sandbag) | one in each hand, or one alone | 2-3 | one implement is enough for contralateral or ipsilateral loading |
| Medball, slam ball | thrown at speed | 1 standing, up to 3 for sit-up throws | light, for speed (section 7) |
| Bodyweight gear (pull-up bar, dip bars, rings or TRX, stability ball, sliders) | lets bodyweight carry a pattern | 1-4 | |
| Props (boxes, benches, steps, walls, hurdles, cones) | set depth, height or a target, not load | | |
| Space (10-20 m, 40-60 m, track, turf) | for change of direction and sprints | 1 | |
| Cardio machines (bike, rower, ski erg, treadmill) | | bike 5 | any of them works for the aerobic sessions (EQ-14) |

**Default implement when the name has none.** For "lunges", "deadlifts", "rows" or "calf raises": bodyweight, then dumbbell, then barbell as the client's level rises, limited by what they have (EQ-09, approved as proposed).

**Where it lives.** `synthesis/10_equipment_model.json > implement_groups`, `implements`, `kit_tokens`; each catalog record's `equipment.implements` and `equipment.setups_any_of` (a list of set-ups; each set-up lists the implements it needs).

---

## 4. Who gets machines

### 4.1 The rule

**Older people, injured people and high-volume clients collect their volume with more constraint.** For them, both the compound lifts and the isolation work lean to machines and cables.

**Why.** "If they're old, they're injured, or they have a lot of high volume, I'd rather they collect that volume in a safe place with more constraints" (EQ-03)

| Rule | Source |
|---|---|
| Compounds and isolation both lean to machine or cable for these three groups | EQ-03 |
| None of the three groups gets the overhead squat or the low-bar squat | EQ-03; R3-ATH-02 (both "stay out" for older adults) |
| Injured and high-volume clients never get the snatch or depth jumps | EQ-03 |
| A foundational older or injured client may use machines that his library files as MODERATE or ADVANCED (leg press, pendulum, hip thrust machine). Safety beats the level label. | EQ-04 |
| A seated machine shoulder press was added so vertical push has a machine option | EQ-05, R2-LIB-07 |
| With pain: move the muscle or pattern to machines or split grips and cut its sets 30-50 %; "maybe even drop the exercise altogether if it's too much" | VOL-03 |
| MYO sets only on the last exercise, on machines or isolation | VOL-15 |

### 4.2 Older adults (from 60)

Round 2 set the age and the opt-in. Round 3 approved the on / off list.

| On by default | Off by default, can be switched on | Stays out |
|---|---|---|
| landing drills (step down and stick, no bounce), balance, quick stepping without a hop, light medball throws, fast machine work | low ankle hops, other jumps, Olympic lifts, depth jumps | overhead squats, low-bar squats |

- Switching the "off" items on shows his warning: "Make sure that you have a fitness professional to help you understand what this means." (R2-ATH-08)
- The on / off list is R3-ATH-02 (approved as proposed).
- The model keeps snatch variants out for 60+ even when Olympic lifts are switched on. That is our reading of EQ-03 against R3-ATH-02: PROPOSED.
- He does not go by sex: "I don't go by sex on these things, but mainly by age, foundation, goal, and injuries." (ATH-09)

More in [special-populations.md](special-populations.md).

### 4.3 Machines are not ranked

**Rule.** The model never says one machine is better than another. It only knows how constrained each one is and whether it loads the spine.

**Why.** We had guessed he would rank the hack squat last. He said no: "my opinion on machines is that if the hack squat that you have in your gym works and you feel it is good, then that's great. If a Smith machine feels good, that's great." And: "I don't want to rank them because they have different brands, angles, and things like that." (EQ-11)

| Machine | Set-up | Constraint | Loads the spine? | His note |
|---|---|---|---|---|
| Leg press | seated, back pad | 5 | no | more constrained than the Smith machine (EQ-11) |
| Hack squat | back and shoulder pads, fixed path | 4 | supported | more constrained than the Smith machine (EQ-11) |
| Pendulum squat | back and shoulder pads, arc path | 4 | supported | |
| Belt squat | load hangs from a hip belt | 4 | no | "Belt squats are for people that you don't need to load them axially" (EQ-11) |
| Smith machine | bar on a fixed path, trunk free | 4 | yes, when the bar is on the back | "Less constraint would be a Smith machine." (EQ-11) |
| GHD, reverse hyper | hips on a pad | 4 | no | use them "if they're available and if they feel good doing them" (EQ-11) |
| V-squat | | | | **never prescribed** (GEN-08) |

**Axially** = along the spine, as when a bar sits on your back.

- **The belt squat** is the option when the back should not be loaded: "If you have an athlete that already has been loaded on their back that week or a couple of weeks and they're sore, then you might want to switch over to the belt squat." (EQ-11) It is also a default choice for the second squat day of the week, next to the leg press (PER-04, R2-SES-01). See [sessions.md](sessions.md).
- **Feel decides.** "I want them to feel the right muscles. I want them to get the right stimulus." (EQ-11)
- **Preference decides between alternatives.** "The client might have that preference, so that can be completely up to them as well." (EQ-10)

His sheet holds personal opinions on four squat machines (OBSERVED, 'ALL ABOUT SQUATS'): pendulum 'LOVE IT', leg press 'LOVE IT', hack squat "I PERSONALLY DON'T LIKE IT", V-squat "DON'T LIKE IT". After EQ-11 these rank nothing. Only the V-squat rule is hard.

### 4.4 Everyone else

These bands are the team's reading of his programs and answers. The table is INFERRED unless a source is given.

| Client | Main lifts (constraint) | Accessories (constraint) | Notes | Source |
|---|---|---|---|---|
| Athlete | 1-2 | 2-4; machines only in the last one or two slots | athletic work at full intent; Olympic lifts for everyone in athletic training | ATH-10; OBSERVED machine share 0.5 % |
| Hypertrophy / aesthetics | one or two free-weight lead lifts, then 3-5 | 3-5 | no medball throws in the main workout | ATH-05; VOL-15 |
| Strength | 2-3, barbell first | 3-5 | speed work with straight weight, no bands or chains | EQ-12 |
| Fat loss, bootcamp, general, stay athletic | 2-3 | 2-4 | dumbbells, bodyweight, kettlebells | |
| Beginner | 2-4 | 3-5 | front-loaded lifts and leg machines; machines to learn the pulls | CAT-04 |
| Older (60+), injured, high-volume | 4-5 | 4-5 | section 4.1 and 4.2 | EQ-03, EQ-04 |
| Pain in one area | one or two levels more constraint for that area | | split grips, one side at a time, then cut sets, then drop | VOL-03, UNI-08 |

**Where it lives.** `generator_spec_v1.json > rule_tables.equipment` (`older_injured_high_volume`, `machines_not_ranked`, `alternatives`, `default_implement`); `derived_values.D7_constraint_band`; `synthesis/10_equipment_model.json > client_rules` (38 rules, `CR-01` and up), `client_families`, `machine_preferences`; catalog record fields `population_rules` and `older_default_excluded`. Note: `synthesis/10_equipment_model.json` is version 1, written before round 2. Its "older (65+)" label is out of date. The age is 60 (R2-ATH-08), as the master document and the spec say.

---

## 5. Where people train: access profiles

**Access profile:** the kit a person has, chosen at intake with the question "Where do you train?".

**Rule.** The intake offers his eight options. Two more are worked out from follow-up answers. There is no bands option.

**Why.** We proposed nine options. He marked the list RIGHT, with one change: "The only exception is I don't do bands. I don't program anything with bands." (EQ-01) He also said people will ask based on the equipment they have, and "we want to be ready for that" (chat).

| # | Profile id | Kit | Main slots with no option as written |
|---|---|---|---|
| 1 | `FULL_GYM` | full commercial gym, with specialty machines | none |
| 2 | `BASIC_GYM` | commercial gym without specialty machines or bars | none |
| 3 | `HOME_BARBELL` | rack, barbell, plates, bench, dumbbells | throws, leg extension, cable chops |
| 4 | `HOME_DB_BENCH` | dumbbells and an adjustable bench | throws, vertical pull, leg extension, cable chops |
| 5 | `KB_ONLY` | one or two kettlebells and household items | throws, vertical pull, leg extension, triceps, chops |
| 6 | `BODYWEIGHT` | floor, wall, stairs, chair, table, towel, outdoor space | throws, vertical pull and biceps (true gaps), leg extension, triceps, chops |
| 7 | `HOTEL_GYM` | light to moderate dumbbells, bench, stability ball, treadmill or bike | throws, vertical pull, leg extension, chops |
| 8 | `FIELD_TRACK_KIT` | medballs, slam balls, cones, mini hurdles, boxes | pulls, leg extension, delts, biceps, triceps, chops |
| derived | `FULL_FACILITY` | full gym plus platform and bumpers, turf or runway, hurdles, belt squat, sled | none |
| derived | `FIELD_TRACK_NO_KIT` | runway, steps, turf, nothing carried | throws, both pulls, leg extension, delts, arms, chops |

"No option as written" means the library has no exercise for that slot with that kit. The plan then substitutes (section 6). The gap list is computed by the team (INFERRED).

**His ideal home kit.** Adjustable dumbbells, a bench, a pull-up bar and an 8-10 lb medball. "People have different things for their home kit, but that'll be ideal for the home kit. I just never use bands." (EQ-02) With a box added, that kit fills every main slot as written except the leg extension and the cable chops (INFERRED count).

**Home gaps he closed (R2-LIB-07, approved as proposed).**

| Profile | Gap | Approved exercise |
|---|---|---|
| Kettlebells only | no curl | Kettlebell Curl |
| Bodyweight only | no horizontal pull | Table Row (inverted row under a sturdy table) |
| Bodyweight only | no shoulder isolation | Floor Prone Y / T Raises |

**Follow-up questions at intake.**

| Field | Question | What it does | Status |
|---|---|---|---|
| F27 | Where do you train? | picks the profile | EQ-01 |
| F28 | Anything else you have? | add-ons (pull-up bar, medball, kettlebell, TRX, bumper plates and platform, hurdles ...) | EQ-01 |
| F29 | Machines available | for gym users: leg press, pendulum, hack squat, belt squat, leg extension, leg curls, lat pulldown, assisted pull-up, row machine, chest press, shoulder press machine, cable stack, Smith, GHD or 45-degree, reverse hyper, hip thrust machine | EQ-11, EQ-05 |
| F29b | Equipment you prefer | machines, free weights, dumbbells, no preference | the idea is EQ-10; the question is PROPOSED |
| F30-F34 | Your kit in detail | heaviest dumbbell pair, medball weights owned (20 lb or less), box height, running space, cardio options | EQ-06, EQ-14, EQ-16 |

For a bodyweight-only person, the add-ons that open the most slots are, in order: dumbbells, a barbell set, a kettlebell, a TRX, a pull-up bar, a medball (INFERRED ranking).

**Never infer equipment from a template name.** His two hidden 'NO ACCESS' tabs are not "no equipment" plans. They are a self-serve version without coach access, using the full gym library (R2-LIB-08, approved as proposed).

**Removed profiles.** `BANDS_ONLY`; `HOME_DB_BENCH_BANDS` (now `HOME_DB_BENCH`); `BOOTCAMP_OUTDOOR` (now `FIELD_TRACK_KIT`); `TRACK_FIELD` (now `FIELD_TRACK_NO_KIT`).

**Where it lives.** `generator_spec_v1.json > vocab.equipment_profiles`, `inputs_schema.fields.F27`, `F28`, `F29`, `F29b`, `F30_F34`, `derived_values.D8_kit`, `rule_tables.equipment.ideal_home_kit`, `rule_tables.equipment.home_additions_approved`, `rule_tables.equipment.no_access`; `synthesis/10_equipment_model.json > access_profiles` (kit per profile), `intake`, `gap_matrix`; home lists in `synthesis/02_no_equipment_subset.md`. Compiled copy: `model/rules.json > equipment.profiles` (generated).

---

## 6. Substitutions: what happens when equipment is missing

### 6.1 The order

**Rule.** Substitute, don't skip. The plan tries these steps in order and stops at the first one that works.

| Step | What it tries | Source |
|---|---|---|
| 1 | The slot's own library list, filtered by the person's kit, their limits (age rules, pain, things they will not do) and status (never out-of-scope items; PROPOSED items never as the default) | CAT-07, GEN-04 |
| 2 | His own 'X or Y' alternates that fit the kit | OBSERVED; EQ-10 |
| 3 | The same pattern with another implement: machine, then cable, then dumbbell, then kettlebell, then bodyweight | EQ-09; order INFERRED |
| 4 | For a missing isolation machine: his swaps (section 6.3). Fallback: add 2 sets to the compound lift of the same pattern | EQ-08; OBSERVED 'leg press or just add 2 more rounds to front squats' |
| 5 | Athletic work: a substitute that keeps the intent. Resistance work: the nearest pattern, and the missing item goes on a "buy list" | ATH-10, EQ-07; buy list PROPOSED |

When a substitute changes something that matters (the level, the intent, one side instead of two, or the pattern), the plan flags it. The flags and the buy list are our mechanism: PROPOSED.

### 6.2 His own 'X or Y' alternates (OBSERVED)

He writes swaps straight into his program cells. The equipment model keeps 42 of them (`synthesis/10_equipment_model.json > coach_alternates`). Some of the most frequent:

| His text (verbatim) | Kind |
|---|---|
| 'Machine Dips or dips' | implement swap |
| 'Any Cardio Equipment' | free choice |
| 'machine or db flies' | implement swap |
| 'machine rows or db rows' | implement swap |
| 'Sqats or Leg Press' | implement swap |
| 'Deadlifts (DB or Barbell)' | implement swap |
| 'Pull ups or Lat pull down' | same movement family |
| 'Curls (any kind)' | free choice |
| 'leg press or just add 2 more rounds to front squats' | a missing machine becomes extra sets |

**The first one written is not automatically the default.** We asked. He said to pick by the client, "but also the preference of the client" (EQ-10).

### 6.3 Specific cases he answered

| Missing | Use instead | Never | Source |
|---|---|---|---|
| Leg extension machine | sissy squats (the model also lists the DB leg extension on a box from his reference tab) | banded leg extensions | EQ-08 |
| Leg curl machine | Nordics, slider curls, swiss-ball curls | banded curls | EQ-08 |
| Medball | plyo push-ups (for pressing), fast cable rotations, or the "fake medball slam" with no ball | band chops: "Band chops are, to me, worthless." | EQ-07 |
| Bumper plates, or a beginner in athletic training | DB / KB snatches and cleans, hex-bar jumps, hang pulls and hang cleans | | ATH-10 |
| A machine for vertical push | seated machine shoulder press added to the library | | EQ-05 |
| A running track, or the person is not a runner | bike, rower, ski erg or treadmill for the Blue / Green / Orange sessions | | EQ-14 |
| A second heavy squat day | leg press or belt squat | a second heavy spinal load | PER-04, R2-SES-01 |

On cardio tools he added: "doing the block is the important part, and being able to track it and see any changes week to week is important." Track by calories or time, and do not throw distance away (EQ-14). The person does that tracking on their own. Since round 3 the tool has no check-ins and keeps no data (R3-VOL-02, R3-GEN-01).

**Other fixes (PROPOSED).** No pull-up bar at home: a dumbbell pull-over and extra rows, plus a note to buy a doorway bar. Foot-assisted pull-ups, eccentric-only Nordics and similar helpers are swaps only, never library defaults. HYROX kit (sled, SkiErg, rower, wall ball) as add-ons with substitutes when missing.

**Where it lives.** `generator_spec_v1.json > rule_tables.equipment.substitution_order`, `machine_isolation_swaps`; `synthesis/10_equipment_model.json > substitution_by_category` (an ordered list for every slot and every profile), `coach_alternates`, `gap_matrix`; pseudo-code in `BLAZE_CAMP_BRAIN.md` §8.5; each catalog record's `equipment.substitutes_by_equipment`. Compiled copy: `model/rules.json > equipment.substitution_order`, `machine_isolation_swaps`, `buy_list` (generated).

---

## 7. No bands, no variable resistance

**Variable resistance:** bands, chains or weight releasers added to a lift so the load changes through the movement.

**Rule.** None of it, anywhere. Not as an exercise, not as a swap, not as a profile, not at intake.

**Why (his words).**
- "The only exception is I don't do bands. I don't program anything with bands. That is something that will eventually come up about variable resistance, but I don't really want to talk about variable resistance in any of this right now because it's so complicated." (EQ-01)
- "I just never use bands. I don't work with anything with bands, so I don't really like bands. In my model, bands are not something that you're going to make changes to your body with." (EQ-02)
- "Yes, just no bands. I don't need any bands. Band chops are, to me, worthless." (EQ-07)
- "Yes, just no bands. I don't want any bands in the program." (EQ-08)
- "We don't want any variable resistance right now. No variable resistance should be available in this for now. We will work with that later on." (EQ-12)

Round 3 repeated it for swimmers: shoulder care every session, never with bands (R3-ATH-01, approved as proposed).

**What this did to the data.**

| Item | What happened |
|---|---|
| 36 band, chain and weight-releaser records | marked `out_of_scope`; kept only so old references resolve; 32 of them point to a non-band replacement (the three 'LOADING VARIABLES' entries and one reverse-banded squat have none) |
| Active records that use a band | 0 |
| Band tokens in the kit vocabulary | removed; the compiled rules ban `band`, `bands`, `band_anchor`, `chains`, `weight_releaser` |
| Bands-only and "dumbbells + bench + bands" profiles | removed |
| Banded and chained lifts in his older sheets ('FAST BANDED BENCH PRESS', 'HEAVY CHAINED DEADLIFT') | the same lift with straight weight (INFERRED from EQ-12) |
| Band-assisted pull-ups | assisted pull-up machine in a gym; other helpers PROPOSED |
| Facet `F.ACCOM` (bands, reverse bands, chains, releasers) | DORMANT: kept as an archive, never used |

"For now" matters. He said they will work with variable resistance later. The archive stays so it can be switched on if he decides so. Until then, a validation check requires zero band, chain or releaser exercises, swaps or kit tokens.

**Where it lives.** `generator_spec_v1.json > rule_tables.equipment.no_variable_resistance`, `validation_checks.V9_bands`; `synthesis/10_equipment_model.json > out_of_scope_implements`; catalog records with `record_type: out_of_scope`; `synthesis/02_exercise_catalog.md` §7.1; `synthesis/01_taxonomy.json > facets` (`F.ACCOM`, `F.PERTURB`). Compiled copy: `model/rules.json > equipment.banned_tokens` (generated).

---

## 8. Medball rules

### 8.1 Light, for speed

**Rule.** Medballs are for speed. Use a light ball. Never over 20 lb.

**Why.** To go faster you do not need a lot of weight. Medball upper-body passes should be light, 8-10 lb (chat). "The heavier I go, the slower I'm going to be. The lighter I go, ideally, the faster I can be." (chat)

| Throw type | Ball weight | Source |
|---|---|---|
| Chest passes, push throws, rotational passes | 8-10 lb | chat |
| Overhead throws | 6-10 lb | EQ-06. The model uses the same range for backward throws (INFERRED). |
| Sit-up throws | 6-8 lb | EQ-06 |
| Slams (slam ball) | 10-20 lb | EQ-06 |
| Specific heavy uses only: medball hang clean, wall balls | up to 20 lb | EQ-06 |
| **Cap** | **never over 20 lb** | EQ-06 |
| Youth and older clients | lighter for every throw | EQ-06 |

His words on heavy balls: "the only point of having a heavier med ball is for something specific, like a heavy med ball hang clean or something like wall balls." And: "I don't think there's any need for anything more than 20 lbs., to be honest." (EQ-06)

No ball weight is written anywhere in his two workbooks (OBSERVED). The numbers come from his answers.

### 8.2 The other medball rules

| Rule | Source |
|---|---|
| Throws have no levels: "No levels in throws, just do them right" | LIB-06 |
| Dose: 1 x 10 per throw. A throwing slot can be the whole 'ALL LIST', about 19 throws, one pass each. | LIB-22; OBSERVED |
| Medball throws are ballistic work. They count in the sport's plyometric vs ballistic share. | R2-ATH-01, R2-ATH-02 |
| Throws never count toward muscle sets | VOL-10 |
| How much throwing depends on the sport: high for rotational sports (baseball, boxing, MMA, tennis, golf), moderate for basketball and football | ATH-05 |
| Aesthetics and bodybuilding: no throwing in the main workout. "If you're a bodybuilder, you don't need to do med ball throwing. That might be something for warming up, but it's not something in the main workout." | ATH-05 |
| No medball: substitute (section 6.3). Never band chops. | EQ-07 |
| Wall balls for HYROX: the race ball, never over 20 lb, inside the station circuits, and they never count as muscle sets. The model treats wall balls in CrossFit workouts the same way (INFERRED). | R3-ATH-03 |
| From 60: light medball throws stay on by default | R3-ATH-02 |

**Team additions (PROPOSED).** Start passes at the 8 lb end. For youth and older clients go 2 lb lighter, not under 4 lb. If the throw slows down or the posture breaks, drop 2 lb; if it is clearly too easy and clean, add 2 lb, staying inside the ranges above.

The sport-by-sport use of throws is in [athletes.md](athletes.md) and [sports.md](sports.md).

**Where it lives.** `synthesis/10_equipment_model.json > load_velocity.medball_rule` (`generator_default_lb`, `modifiers`, `quality_gate`, `no_medball`); `BLAZE_CAMP_BRAIN.md` §8.1 rule E9 and §9.6; each medball record's `implement_load` (`max_lb`, `typical_lb`) in the catalog (93 records); intake field `F30_F34` (`medball_lb_owned`). Compiled copy: `model/rules.json > medball` (generated).

---

## 9. Other equipment numbers he approved

| Item | Value | Source |
|---|---|---|
| Loaded jumps (dumbbell or hex-bar jumps) | 10-20 % of body weight; too heavy when jump height or speed clearly drops | EQ-15 (approved as proposed) |
| Depth-drop box height | low about 6-12 in, medium about 12-18 in, high = above the hip | EQ-16 (approved as proposed) |
| Hurdle height | about 6 in for moderate, 12 in or more for advanced | EQ-16 |
| Aerobic sessions | any tool: run, bike, rower, ski erg, treadmill | EQ-14 |
| Speed lifts | straight weight only, no bands or chains | EQ-12 (application INFERRED) |

The loaded-jump rule needs body weight, and the intake asks for it. He added that field himself: "weight is going to be important for their training" (GEN-02).

**Where it lives.** `generator_spec_v1.json > rule_tables.equipment.loaded_jumps`, `rule_tables.equipment.heights`; `synthesis/10_equipment_model.json > load_velocity` (`loaded_jumps`, `plyo_heights`, `aerobic_modality`).

---

## 10. Where it all lives

| What | File | Key or section |
|---|---|---|
| The equipment rules in one page | `BLAZE_CAMP_BRAIN.md` | §8 (rules E1-E19, the scale, client rules, profiles, substitution) |
| Equipment rules as data | `generator_spec_v1.json` | `rule_tables.equipment` |
| Profiles and intake fields | `generator_spec_v1.json` | `vocab.equipment_profiles`; `inputs_schema.fields.F27` to `F30_F34` |
| Full equipment model (version 1) | `synthesis/10_equipment_model.md` / `.json` | `constraint_scale`, `implements`, `access_profiles`, `substitution_by_category`, `gap_matrix`, `client_rules`, `client_families`, `machine_preferences`, `coach_alternates`, `load_velocity`, `out_of_scope_implements` |
| The science behind the equipment choices | `synthesis/10b_equipment_variables_science.md` | |
| Equipment on each exercise | `synthesis/02_exercise_catalog.json` | `equipment.setups_any_of`, `equipment.min_access_tier`, `equipment.substitutes_by_equipment`, `constraint_level`, `implement_load` |
| Home and no-equipment lists | `synthesis/02_no_equipment_subset.md` | by home profile |
| Checks before a plan is shown | `generator_spec_v1.json` | `validation_checks.V5_older`, `V7_no_equipment`, `V9_bands`, `V20_vsquat` |
| Compiled copy the engine reads | `model/rules.json` | `equipment`, `medball`, `population` (generated; the engine is being rebuilt) |

`synthesis/10_equipment_model.md` / `.json` was not re-issued after round 1. Where it differs from the master document or the spec (the age of 60, zones as tags instead of level steps, the home additions), the master document and the spec win.

---

## 11. Not confirmed yet

| Item | Our proposal | Status |
|---|---|---|
| Constraint level on each exercise | from the approved scale | INFERRED |
| Hack squat and pendulum at level 4 or 5 | 4, above the Smith machine | INFERRED from EQ-11 |
| Constraint bands by type of client (section 4.4) | as in the table | INFERRED from his programs and EQ-03 |
| Snatch variants for 60+ when Olympic lifts are switched on | stay out | PROPOSED (EQ-03 against R3-ATH-02) |
| "Equipment you prefer" as an intake question | one optional question | PROPOSED (the idea is EQ-10) |
| The second squat day at home or in a hotel with no machine | a single-leg squat, or a goblet squat if not sore | PROPOSED |
| Substitution flags and the buy list | as in section 6.1 | PROPOSED |
| Medball fine-tuning (start at 8 lb, 2 lb steps, 4 lb minimum) | as in section 8.2 | PROPOSED |
| HYROX kit as add-ons, and their substitutes | sled, SkiErg, rower, wall ball | PROPOSED |
| Variable resistance | dormant | he said "We will work with that later on" (EQ-12) |
