# Data dictionary

This page describes every field of the four records that make up the Blaze Camp model's data: an **exercise** (the catalog), a **profile** (a sport, activity or goal), a **template** (the skeleton of a week) and the **plan** the generator returns. It also lists the intake fields, because the plan is built from them. For each field you get its meaning and the values it may hold. Use it when you read the JSON files, build an app on them, or add data. The rule behind all of it comes from the coach: tag every exercise on every lens at once, so the tool can sort by any of them.

## The rule, the why, and where it lives

**The rule.** Every exercise carries its whole description: family, pattern, laterality, plane, muscle size, muscles credited, equipment, level. Athletes are described by profiles. Weeks are described by templates. The plan holds codes, not prose.

**Why.** "Yes, this is the whole taxonomy of each exercise. This is very important because then we can segment by whatever we need in different families, in different segments, different variables. This is huge" (CAT-01). And on what goes in and out: "I want this to be very simple ... We're not going to need a lot of inputs for this" (R3-VOL-04).

**Where it lives.** There are two layers. People edit the **source** files. A compiler turns them into the **runtime** files that the engine reads.

| Record | Source (edit here) | Runtime (generated, never edit) | Shape defined in |
|---|---|---|---|
| Exercise | [`synthesis/02_exercise_catalog.json`](../../synthesis/02_exercise_catalog.json): an array of 939 records | `model/catalog.json > exercises[]`: 742 records (731 source records, the 2 mid-range pull rows of round 4, 9 round-5 records) | [`engine/CONTRACTS.md`](../../engine/CONTRACTS.md) §3.2 |
| Profile | [`synthesis/04_profiles.json`](../../synthesis/04_profiles.json) `> profiles[]`: 127 records | `model/profiles.json > sports{}` | CONTRACTS §3.5 |
| Template | [`synthesis/05_templates.json`](../../synthesis/05_templates.json) `> generator_split_templates[family][days]`: 30 templates | `model/templates.json > families{}` | CONTRACTS §3.4 |
| Rules (numbers) | [`generator_spec_v1.json`](../../generator_spec_v1.json) and `synthesis/12_volume_algorithm_v1.json` | `model/rules.json` | CONTRACTS §3.3; see [parameters.md](parameters.md) |
| Intake | `generator_spec_v1.json > inputs_schema` | (passed in by the caller) | CONTRACTS §2.1 |
| Plan | (output) | (returned by the engine) | CONTRACTS §5 |
| Words (English, Spanish) | `tools/compile/` | `model/i18n/en.json`, `es.json` | CONTRACTS §1.6, §3.6 |

Things to know before you start:

- **Codes stay in English.** Field names and values (`pattern_code`, `HPULL`, `bilateral`) are ids. Only display text is translated.
- **The runtime shapes below describe engine 0.5** (template-first, no time-fitting; [ADR-058](../04-decisions/adr-058-engine-v05-template-first-not-the-large-planner.md)). They were checked against the repo on 2026-10-11 (model 1.3.0, engine 0.5.0, plan schema `plan/2`). The source files and the coach's answers are the authority. Read `engine/CONTRACTS.md` for the current shape before you depend on a runtime field.
- **Time is not in the data as a limit.** There is no session-length field in the intake, no time check and no time offer in a plan (CT-01, R4-SES-01). A day carries `est_minutes` as information only. Some source templates still hold minute fields from before; the compiler drops them (section 3).
- **Evidence travels with the data.** Source records carry fields such as `evidence`, `basis`, `tag` or `sources` that say whether a value is the coach's answer, OBSERVED in his sheets, INFERRED or PROPOSED. Keep them when you edit.
- **Four things never reach the runtime files or a plan**: a third-party video link (R4-LIB-05); a band, chain or weight-releaser set-up (EQ-01, EQ-12); a sex or gender field (GEN-02, ATH-09); a sleep, stress, job or lifestyle field (R2-GEN-04). One detail on bands: the band and chain items of his sheets are kept in the source catalog as `out_of_scope` records, with `generator.eligible: false`. Some source ids also keep the word "band" from his sheet names. The compiler drops those records, removes every band set-up and takes the word out of the ids.

Terms are defined in the [glossary](glossary.md).

---

## 1. Exercise record

A step-by-step guide to writing one, with worked examples, is in [adding-exercises.md](../adding-exercises.md). This section is the reference.

### 1.1 Source record (`synthesis/02_exercise_catalog.json`)

**Identity and status**

| Field | Meaning | Allowed values |
|---|---|---|
| `id` | Unique id, made from the name | lowercase kebab-case, e.g. `front-squat-barbell` |
| `name` | Display name in plain gym English | text |
| `record_type` | What kind of record this is | `exercise` (633), `conditioning_prescription` (72), `complex` (63), `modifier` (51), `out_of_scope` (36: the band, chain and other variable-resistance items of his sheets, kept on file and never used), `generic_choice` (30), `drill` (14), `test` (13), `taxonomy_placeholder` (12), `retired` (11), `variant_rule` (3), `progression_note` (1). Only `exercise`, `drill`, `test` and `conditioning_prescription` reach the runtime catalog. |
| `status` | Where it came from and how it may be used | `live_library_selectable` (in his BYOP library; can be the default pick), `live_library_not_selectable`, `reference_only` and `program_only` (swaps only), `added_v1`, `added_v1_1` (added and approved by him), `proposed_v1`, `proposed_v1_1` (proposed by the team). Since round 4 the compiler turns the proposed records into `optional_addon` in the runtime file: a swap and an offered add-on, never a template's pick (R4-LIB-01). Only the 2 neck records stay `proposed_v1_1`: never picked, never shown. |
| `generic` | True for a placeholder that is not one real exercise | `true`, `false` |
| `aliases[]` | Every place the name appears in his sheets, as written | objects: `raw`, `workbook`, `tab`, `cell`, `role`, `category_verbatim`. OBSERVED only. |
| `placements[]` | The cells where the library files it, with the level label | objects: `workbook`, `tab`, `cell`, `role`, `pattern_code`, `level`, `level_label_verbatim`, `level_evidence`. OBSERVED only. |

**Classification (his lenses)**

| Field | Meaning | Allowed values |
|---|---|---|
| `taxonomy.family` | The quality it trains | `RESISTANCE`, `ATHLETIC`, `CONTROL`, `CARDIO`, `FUNCTIONAL` (also `MODIFIER`, `MIXED` on non-exercise records) |
| `taxonomy.region` | Body region | `LOWER`, `UPPER`, `CORE`, `ATHLETIC`, `CARDIO`, `FUNCTIONAL` |
| `taxonomy.pattern_code` | The movement pattern | `BKD`, `UKD`, `BHD`, `UHD`, `KEXT`, `KFLEX`, `HPUSH`, `MRPUSH`, `VPUSH`, `HPULL`, `VPULL`, `SHLD`, `BIC`, `TRI`, `CALF`, `NECK`, `CT`, `CP`, `CB`, `AOS`, `PLYO`, `ANKLE`, `THROW`, `TX`, `COD`, `SPRINT`, `CARDIO`, `WARMUP`, `CARRY`, `DRAG`, `ARMCARE` (also `COMPLEX`, `MODIFIER`, `POS`, `LSS`, `CORE` on special records) |
| `taxonomy.node_01_taxonomy` | Its place in the category tree | a node id from `synthesis/01_taxonomy.json > nodes`, e.g. `RP.KD.BS`, `AP.JMP.LK`, `CO.CT` |
| `taxonomy.category`, `category_label`, `sub_pattern`, `path` | Finer grouping and a readable path | text |
| `taxonomy.pattern_label_verbatim`, `category_label_verbatim`, `zone_code_verbatim`, `coach_purpose_row6`, `coach_row5_label` | His own labels from the sheet, with his spelling | text or null. OBSERVED. |
| `laterality` | One side or both | `bilateral`, `unilateral`, `alternating` (counts as unilateral, UNI-07), `n/a` |
| `plane` | Plane of movement | `sagittal`, `frontal`, `transverse`, `multi`, `n/a` |
| `level.primary` | The level his sheets give it | `foundational`, `intermediate`, `advanced`, `any`, `unrated` |
| `level.generator_min_level` | The level the generator uses. A soft default, never a gate (CAT-05). | `foundational`, `intermediate`, `advanced` |
| `level.basis`, `generator_min_level_basis` | Why that level | text with the evidence |
| `level.levels_in_byop`, `levels_all_sources`, `byop_placements`, `reference_placements`, `multi_level_in_byop`, `cross_source_disagreement` | Where and how his sheets level it | lists and booleans. OBSERVED. |
| `davidson_zone.zone` | Davidson zone tag | `1`, `2`, `3`, or absent for plyos and unloaded core |
| `davidson_zone.rotation_bias` | The bias of that position | text starting "external-rotation bias" or "internal-rotation bias" |
| `muscle_size_class` | Size class of the main mover (CAT-02). Descriptive. | `big`, `small`, `mixed`, `n/a` |
| `exercise_class` | Coarse type | `compound`, `isolation`, `athletic`, `control`, `conditioning`, `warmup`, `mobility` |
| `volume_counting` | What it is counted in | `hypertrophy_sets`, `control_sets`, `contacts`, `throws`, `power_reps`, `conditioning_bouts`, `reps_or_distance`, `warmup_not_counted`, `not_counted` |

**Muscles and credit**

| Field | Meaning | Allowed values |
|---|---|---|
| `primary_muscles[]` | Who does the work. Descriptive. | e.g. `quads`, `glutes`, `hamstrings`, `chest`, `lats`, `upper_back`, `front_delts`, `side_delts`, `rear_delts`, `biceps`, `triceps`, `calves`, `abs`, `obliques`, `adductors`, `traps` |
| `secondary_muscles[]` | Helpers. Descriptive. | same list |
| `coach_muscle_groups[]` | His FOCUS headers | `QUADS`, `HAMSTRINGS`, `GLUTES`, `CHEST`, `BACK`, `SHOULDERS/TRAPS`, `BICEP`, `TRICEP`, `CALVES`, `CORE` |
| `volume_credit.counts_toward_muscle_volume` | Does a set count as a muscle set? | `true` for resistance and core; `false` for athletic, cardio and warm-up (VOL-10) |
| `volume_credit.per_set` | Credit on his coarse groups | numbers 1.0, 0.5, 0.25. The 0.5 appears only on the dips and thruster exceptions (LIB-14, LIB-16). It is not a helper credit: helpers are 0.25 (VOL-09). The compiler does not copy these numbers. It reads them only to spot the exceptions (hip thrust, dips, thruster, fly). The real credits come from the credit class (1.3). |
| `delt_head.value` | Which delt head, on shoulder isolation | `side`, `rear`, `front` |

**Equipment**

| Field | Meaning | Allowed values |
|---|---|---|
| `equipment.setups_any_of` | The set-ups that work. Each inner list is one set-up, and every item in it is needed. | lists of implement words: `none`, `dumbbell`, `barbell`, `kettlebell`, `medball`, `cable`, `machine`, `bench`, `box`, `squat_rack`, `pullup_bar`, `hex_bar`, `landmine`, `sled`, `sandbag` and others. A `band` or `chains` word appears only on `out_of_scope` records, and the compiler removes it. |
| `equipment.machine_type` | Which machine, if it needs one | text or null |
| `equipment.implements[]`, `household_substitutions[]`, `substitutes_by_equipment` | Descriptive lists | text |
| `equipment.min_access_tier`, `min_access_tier_label` | The least equipment it needs | `0` bodyweight + household, `1` minimal kit, `2` home light weights, `3` gym |
| `no_equipment_ok`, `minimal_kit_ok`, `home_weights_ok` | Quick flags | booleans |
| `constraint_level.value` | Constraint level (EQ-13) | `1` to `5` |

**Load and spine**

| Field | Meaning | Allowed values |
|---|---|---|
| `axial_spinal_load.value` | How much the spine is loaded | `none`, `low`, `moderate`, `high` |
| `axial_spinal_load.spine_day_v1_1.class` | Its class for the two spine days (R2-SES-02) | "counted spine-loading lift", "second-day option if not sore", "not counted" |
| `axial_spinal_load.spine_day_v1_1.counts_as_heavy_spine_lift` | True only for the counted list | boolean |
| `load_ceiling` | How heavy it can go | `low`, `moderate`, `high` |
| `skill_demand` | How much skill it takes | `low`, `moderate`, `high` |
| `impact_level` | Landing impact | `none`, `low`, `moderate`, `high` (a few records use in-between words) |
| `implement_load` | Medball items only: typical and maximum load | `typical_lb` text, `max_lb` number, never above 20 (EQ-06) |

**Athletic** (jumps, throws, Olympic lifts, sprints, change of direction)

| Field | Meaning | Allowed values |
|---|---|---|
| `athletic_quality.value` | The quality | text starting with one of: "plyometric (short ground contact, repeated)", "plyometric (receive then create)", "ballistic (longer ground contact, single effort)", "ballistic (throw)", "ballistic (loaded jump)", "landing (receive force)", "olympic / triple extension", "change of direction", "speed (sprint / sprint drill)" |
| `contact_class_v1_1.value` | Ballistic or plyometric (R2-ATH-02) | `ballistic`, `plyometric`, `receive` |
| `athletic_quality.plyo_method` | How the jump is done | `receive_and_pause`, `receive_then_create`, `repeated_receive_create`, `create_then_land` |
| `athletic_quality.receive_create_stage.default_stage` | The Receive-Create stage its name implies | `1`, `2`, `3` |
| `athletic_quality.unilateral_harder` | True for single-leg jumps | boolean |
| `olympic_v1_1.family` | Olympic family (R2-ATH-04) | `clean` (knee days), `snatch` (hip days), `jerk` (either day), `loaded_jump` |

**Population**

| Field | Meaning | Allowed values |
|---|---|---|
| `older_default_excluded.value` | True = off by default from age 60, can be switched on with the warning (R3-ATH-02) | boolean (+ `population`, `what`, `opt_in`, `warning_key`, `evidence`) |
| `population_rules[]` | Rules for named groups (older, injured, pitchers, strikers, beginners, youth, pain) | objects: `population`, `rule`, `evidence` |
| `sport_use_v1_1[]` | Sports or activities that especially need it. A small bonus, never a filter. | sport and activity names |

**Dose, media, variation**

| Field | Meaning | Allowed values |
|---|---|---|
| `typical_rep_range.value` | A dose hint. The real dose comes from the rules. | text, e.g. "8-12 per side" |
| `typical_rep_range.dose_unit` | The unit | `reps`, `reps per side`, `contacts`, `throws`, `seconds`, `reps or seconds`, `time / distance / calories`, `distance` and a few mixed units (`reps or meters`, `distance or seconds`) |
| `typical_rep_range.observed_doses[]` | Doses he wrote for it in his programs | OBSERVED |
| `video_urls[]` | Empty on every record. The third-party links from his sheets were removed from the public data (R4-LIB-05). The compiler gives each exercise a YouTube search link built from its English name (see `video` in 1.2). His own videos can be added later. | `[]` |
| `coach_cues[]` | His own cue for the exercise (GEN-07). Never written for him. | objects: `cue` |
| `variation_v1_1.axes[]` | The one detail that may change between exercise blocks (R2-LIB-01) | `implement`, `stance`, `grip`, `range`, `which hand holds the weight` |
| `program_slots[]`, `observed_in_programs[]`, `observed_in_programs_count` | Where his programs use it | OBSERVED |
| `coach_preference`, `coach_statements[]` | What he said about this exercise | text with answer ids |

**Generator**

| Field | Meaning | Allowed values |
|---|---|---|
| `generator.eligible` | May the generator use it? | boolean |
| `generator.pools[]` | The pattern lists it may fill | pattern codes, e.g. `["PLYO", "ANKLE"]` |
| `generator.default_candidate` | May it be the default pick? Only library items and items he approved (CAT-07). | boolean |
| `generator.default_candidate_by_pool` | Default in some pools only | object by pool |
| `generator.why` | One line that explains the above | text |

**Evidence and bookkeeping**

| Field | Meaning |
|---|---|
| `sources[]` | The analysis files or answers the record was built from |
| `observed_fields[]`, `inferred_fields[]` | Which fields were read from his sheets and which the team decided |
| `flags[]` | Open problems on the record: a typo kept in an alias, a name that is unclear, a placement conflict |
| `notes[]`, `related[]` | How it is done, in a line or two; the ids of its nearest relatives |
| `new_in_v1_1` | Set on additions: `kind` (`coach-approved addition`, `PROPOSED-ADDITION`), `qid`, `evidence`, `why_needed` |
| `v1_changes[]`, `v1_1_changes[]` | The change log of the record, with the answer id behind each change |

### 1.2 Runtime record (`model/catalog.json > exercises[]`)

The compiler turns each usable source record into this flat record. Every field is present. `null` means "not applicable".

| Field | Meaning | Allowed values |
|---|---|---|
| `id` | Runtime id (band words removed) | kebab-case |
| `source_id` | The source record's id | kebab-case |
| `name_key`, `cue_key` | Keys of the name and the cue in the word lists | `exercise.<id>.name`, `exercise.<id>.cue` or null |
| `kind` | Record kind | `exercise`, `drill`, `test`, `conditioning` |
| `family`, `pattern`, `node` | Copied from `taxonomy` | as in 1.1 |
| `slots[]` | The buckets it may fill | bucket ids (3.3) |
| `default_in_slots[]` | The buckets where it may be the default pick | bucket ids. Empty for PROPOSED records. |
| `laterality`, `plane` | Copied | as in 1.1 |
| `level` | Exercise level | `foundational`, `intermediate`, `advanced` |
| `zone`, `rotation_bias` | Davidson zone and bias | `1`-`3` or null; `external`, `internal` or null |
| `size_class`, `exercise_class`, `counting` | Copied | as in 1.1 |
| `credit_class` | The credit code | see 1.3 |
| `credits` | Sets credited per muscle for one set | object, e.g. `{"quads": 1, "glutes": 0.25, "adductors": 0.25}`; `{}` for athletic work |
| `primary_muscle` | The muscle with credit 1.0 | muscle id or null |
| `equipment` | What it needs | `{any_of: [[kit token …] …], machine: id or null}` |
| `constraint` | Constraint level | `1` to `5` |
| `axial_class` | Spine load | `high`, `moderate`, `low`, `none` |
| `axial` | True = a counted heavy spine lift | boolean |
| `spine_class` | Its class for the two spine days | `counted`, `second_day`, `not_counted` |
| `axial_pattern` | Which spine day it belongs to | `squat`, `hinge`, null |
| `skill`, `impact`, `load_ceiling` | Copied | as in 1.1 |
| `is_athletic` | True when the credit class is `ATHLETIC` | boolean |
| `athletic` | Athletic details | object or null: `quality`, `contact_class`, `olympic_family`, `day_pattern`, `olympic_tier` (`L1`, `L2_plus`), `full_catch`, `from_floor`, `plyo_method_default`, `rc_stage_default` (`RC1`-`RC3`), `unilateral_harder`, `loaded_jump`, `count_unit` (`contacts`, `throws`, `cuts`, `metres`, `reps`) and a few engine fields |
| `conditioning` | Aerobic colour | `{colour: A, B, C or LC}` or null |
| `medball` | Medball load | `{min_lb, max_lb, kind}` or null; `max_lb` never above 20 |
| `older_ok` | Allowed from age 60 by default | boolean |
| `older_opt_in_ok` | Allowed from age 60 when switched on with the warning | boolean |
| `youth_ok` | Allowed under 18 | boolean |
| `tags[]` | Rule tags | a closed list, see 1.4 |
| `variation_axes[]` | One-detail axes | `implement`, `stance`, `grip`, `range`, `hand` |
| `rep_hint` | Dose hint | `{text, unit}` |
| `video` | A video link | always `{url, kind}`. `kind: search` = a YouTube search for the exercise's English name (`rules.render.video.search_url` + the name). `kind: coach` is reserved for his own videos. There is no third-party link (R4-LIB-05). |
| `status` | Copied, except that the team-proposed records become `optional_addon` | as in 1.1, plus `optional_addon` (32 records: 29 team proposals, the 2 mid-range pull rows, his single-side carry). `proposed_v1_1` remains on the 2 neck records only. |
| `sport_use[]` | Copied | sport names |
| `rule_refs[]` | Answer ids that changed this record | e.g. `R2-VOL-05`, `LIB-16` |

### 1.3 Credit classes

The credit class decides how one set counts. Values: `model/rules.json > credit > classes`. Sources: VOL-09, VOL-10, LIB-09, LIB-14, LIB-16, CAT-09, R2-VOL-05, R2-LIB-04.

| Credit class | Credits per set |
|---|---|
| `BKD`, `UKD` | quads 1, glutes 0.25, adductors 0.25 |
| `BHD`, `UHD` | hamstrings 1, glutes 0.25 |
| `GLUTE_ISO` | glutes 1, hamstrings 0.25 |
| `LEG_FLEXION` | hamstrings 1 |
| `LEG_EXTENSION` | quads 1 |
| `HPUSH` | chest 1, triceps 0.25, front delts 0.25 |
| `VPUSH` | front delts 1, side delts 0.25, triceps 0.25 |
| `DIPS` | triceps 0.5, chest 0.5 |
| `THRUSTER` | quads 1, front delts 0.5, glutes 0.25 |
| `HPULL` | back 1, biceps 0.25, rear delts 0.25 |
| `VPULL` | back 1, biceps 0.25 |
| `PULLOVER` | back 1 |
| `ISO_CHEST`, `ISO_SIDE`, `ISO_REAR`, `ISO_FRONT`, `ISO_TRICEPS`, `ISO_CALF`, `ISO_NECK` | the target muscle 1 |
| `ISO_BICEPS` | biceps 1, forearms 0.25 |
| `FACEPULL` | rear delts 1, side delts 0.25 |
| `CORE` | abs and obliques 1 |
| `ATHLETIC`, `NONE` | nothing |

An exercise placed in an athletic slot credits nothing, whatever its class. Example: a push press in the Olympic slot is power reps, not shoulder sets (VOL-10, LIB-13).

The coach confirmed these parts: the 1.0 and 0.25 rates (VOL-09); the dips and thruster splits (LIB-16, LIB-14, R2-VOL-05); glutes 1.0 on hip thrusts and bridges, and 0.25 on squats, lunges, deadlifts and RDLs (R2-VOL-05); no credit for athletic work and KB swings (VOL-10, R2-VOL-05). The helper lists of the other classes, the adductor and forearm credits and the face-pull split are INFERRED or PROPOSED. See [parameters.md](parameters.md) section 1.

Front, side and rear delt credits all add up inside the one `shoulders` group. Rear delts have no start, ceiling or floor of their own (R3-VOL-01). A set counts at most 1.0 to a group (PROPOSED).

### 1.4 Tags (closed list)

| Group | Tags |
|---|---|
| Never-lists (EQ-03) | `overhead_squat`, `snatch`, `low_bar`, `depth_jump`, `high_depth_drop` |
| Age rules (R3-ATH-02) | `hurdle_hop`, `bound`, `ankle_hop`, `landing` |
| Pain filters | `overhead`, `overhead_barbell`, `dips`, `upright_row`, `skullcrusher`, `good_morning`, `bent_over`, `chest_supported`, `sumo`, `cossack`, `deep_knee_flexion`, `front_rack`, `push_up_floor` |
| Specific rules | `belt_squat`, `kong_row`, `push_press`, `push_jerk`, `thruster`, `pullover`, `face_pull`, `kb_swing`, `wall_ball`, `glute_iso`, `spine_counted` |
| Implement | `fixed_grip`, `split_grip`, `machine`, `cable`, `barbell`, `medball` |
| Athletic and load | `olympic`, `loaded_jump`, `olympic_from_floor`, `plyo_repeated`, `high_impact`, `axial_high` |
| From population rules | `older_preferred`, `aesthetics_warmup_only`, `pitcher_reduce`, `striker_reduce`, `beginner_olympic`, `youth_floor_ok`, `axial_unload`, `pain_friendly` |

`v_squat` is reserved. No record may carry it and the selector rejects it (GEN-08). The compiled catalog also carries two engine tags that are not in the contract's list: `assisted` and `home_substitute`.

---

## 2. Profile record

A profile describes what one kind of athlete or active person needs. Most numbers in a profile are the team's: INFERRED from his programs or PROPOSED. The parts he confirmed are named in the last column. For the full picture by sport see [sports](../02-model/sports.md).

### 2.1 Source record (`synthesis/04_profiles.json > profiles[]`)

**Identity**

| Field | Meaning | Allowed values | Confirmed by him? |
|---|---|---|---|
| `id` | Profile id | snake_case, e.g. `basketball`, `rec_pickleball`, `fat_loss` | |
| `name`, `name_es` | Display names | text. Spanish PROPOSED until he approves (R2-GEN-08). | |
| `category` | Kind of profile | `competitive` (93), `recreational` (31), `goal` (3) | competitive vs recreational: GEN-02 |
| `sport`, `sport_name`, `sport_name_es` | The sport it belongs to | sport id and names | the sport list: conversation, R3-ATH-04 |
| `positions[]`, `position_values[]` | Positions it covers | text; `sport:position` values | |
| `aliases[]` | Older ids that point here | ids | |
| `family` | Broad type | `field_court`, `combat`, `strength`, `physique`, `endurance`, `crossfit`, `youth`, `general`, `aquatic`, `snow` | |
| `group` | A readable sub-type | text, e.g. "court - jump/COD" | |
| `ath03_group` | Which side of his split between athletes who need more resistance training and athletes who need more speed and power | `resistance`, `speed_power`, `rotational_power`, `combat`, `size_strength`, `health`, `endurance` | the two named groups: ATH-03 |
| `origin`, `reuse_status`, `base_profile`, `merged_from[]` | How the record was built | `reuse_status`: `04` (from his programs), `unchanged`, `delta` (PROPOSED changes on a base profile), `new` (new PROPOSED budget) | |
| `template` | Which week template it uses | text | |
| `evidence`, `rationale`, `science[]`, `field_evidence`, `confirm[]` | Why the numbers are what they are | text and references | |

**Week and budget**

| Field | Meaning | Allowed values | Confirmed by him? |
|---|---|---|---|
| `days.main`, `days.optional` | Gym days and optional days | integers | swimming 3 + 1: R3-ATH-01 |
| `weekly_sets` | The weekly budget in sets per bucket | keys: `PLYO` (plyometric jumps), `JLK` (ankle jumps), `BALL` (ballistic jumps), `THROW`, `COD`, `SPRINT`, `TE` (Olympic), `BKD`, `BHD`, `UKD`, `UHD`, `HPUSH`, `VPUSH`, `HPULL`, `VPULL`, `ISO_QUAD`, `ISO_HAM`, `ISO_CHEST`, `ISO_SIDE`, `ISO_REAR`, `ISO_BICEP`, `ISO_TRICEP`, `ISO_CALF`, `ISO_NECK`, `ISO_GRIP`, `CORE`, `FOCUS` | no: INFERRED budgets sized to his observed sessions |
| `weekly_sets_basis`, `weekly_sets_source` | Where the budget came from | `04_v1_budget`, `05_v1_1_template` | |
| `derived` | Numbers computed from the budget for checking (totals, shares, estimated minutes) | object | computed |

**Athletic dials**

| Field | Meaning | Allowed values | Confirmed by him? |
|---|---|---|---|
| `ground_contact.class` | Ground-contact class | `1` (very short) to `5` (very long) | the rule: ATH-01; the classes are INFERRED |
| `ground_contact.plyo_share_pct` | Plyometric share at the end of a block | `75`, `60`, `50`, `40`, `25` | yes, for the sports he was asked about: R2-ATH-01, R3-ATH-04 |
| `ground_contact.plyo_share_start_pct` | Share at the start of a block | end − 15 | R2-ATH-01 |
| `plyo` | Jump work per week | `tier_high` (`T0`-`T5`), `high_contacts_wk` [low, high], `low_contacts_wk`, `direction_pct` {vertical, horizontal, lateral}, `unilateral_pct`, `landing_pct`, `plyometric_target_wk` | ranking only: ATH-02 |
| `throwing` | Medball throws per week | `tier`, `throws_wk` [low, high], `plane_pct` {sagittal, transverse} | who throws a lot: ATH-05 |
| `cod` | Change-of-direction work | `tier`, `cuts_wk`, `max_turn` (`EASY TURN`, `MOD. TURN`, `HARD TURN`), `reactive` | for every athlete, by turn angle: ATH-06 |
| `sprint` | Sprint work | `tier`, `m_wk` [low, high], `focus` | |
| `triple_ext` | Olympic work | `tier`, `sets_wk`, `ceiling`, `level_note` | everyone in athletic training: ATH-10 |
| `power_mix`, `power_mix_by_phase` | Plyometric share by season phase and how it shifts across a block | percentages; `volume_x` factors by phase | block shift: R2-ATH-01; in-season half: R2-ATH-07 |
| `emphasis` | A 0-3 summary of jump, throw, sprint and COD work | `0` none, `1` low, `2` moderate, `3` high | computed |
| `olympic_policy` | Olympic rules for the profile | `rule`, `off_season_exposures_wk`, `pattern_split`, `weekly_sets`, lists by level, `reps`, `load_guidance`, `in_season`, `youth`, `older_60_plus` | ATH-10, R2-ATH-04, R2-ATH-05, R2-ATH-08 |
| `medball_policy` | Medball rules for the profile | `tier`, `throws_wk`, `loads_lb`, `no_ball`, `dose_unit`, `aesthetics_rule` | loads: EQ-06; no-ball swaps: EQ-07 |
| `plyo_rank_ath02` | Its place in his plyo ranking | integer or null | ATH-02 |

**Resistance dials**

| Field | Meaning | Allowed values | Confirmed by him? |
|---|---|---|---|
| `resistance` | How the resistance part is shaped | `emphasis_pct` {hypertrophy, strength, power}, `rep_zone`, `unilateral_pct`, `push_pull`, `pairing`, `priorities[]`, `avoid[]` | pairing: UNI-11 |
| `bilateral_unilateral` | Bilateral : unilateral share by phase | `block_start`, `baseline_mid_block`, `block_end`, `pre_season`, `in_season`: pairs `[bilateral %, unilateral %]` | the two ends: UNI-02, UNI-10 |
| `contra_ipsi` | Which load side to favour | text | CAT-13 |
| `frontal_transverse_unilateral_pct` | Share of single-leg work in the frontal and transverse planes | number | direction only: UNI-12 |
| `planes` | Emphasis on frontal and transverse work | `0`-`3` each | |
| `core` | Core work | `slots_wk`, `plane_pct`, `region`, `mode`, `dose` | dose 2 × 2: R2-SES-03 |
| `upper_lower_emphasis` | Split of resistance sets | `lower_pct`, `upper_pct` | computed |
| `rotation_emphasis` | How much rotation the sport needs | text: low, moderate, high | |
| `resistance_goal` | What the resistance work is for | `primary`, `secondary`: strength, power, hypertrophy, endurance-strength | |

**Conditioning and season**

| Field | Meaning | Allowed values | Confirmed by him? |
|---|---|---|---|
| `aerobic_sessions_wk` | Aerobic sessions per week by phase | `off_season_or_default`, `off_season_range`, `pre_season`, `in_season`, `walks_after_workouts`, `aerobic_source` (`gym_plan`, `sport_plan`, `gym_plan_or_activity`) | ATH-07, R2-ATH-06, R3-ATH-01, R3-ATH-04 |
| `conditioning` | Sessions by colour and formats | `A`, `B`, `C`, `LC` numbers; `formats[]` | colours OBSERVED |
| `season_overrides` | Factors on the budget in pre-season and in-season | per-bucket multipliers; `total_sets_pct_of_off_season`; `length_weeks`; `lift_days` | pre-season about 60 %: R2-PER-06 |
| `in_season_gym` | In-season rules | `lift_days_wk`, `hard_day_rule`, `typical_games_wk`, `game_heavy`, `reductions`, `speed_athlete` | 2 days: PER-08; game-heavy rule: R2-ATH-07, R3-ATH-04 |
| `in_season_content` | What stays in during the season | text | PER-08 |
| `season_calendar_us` | When the sport's seasons run in the US | text by level of play | no: outside calendars, cited |
| `sample_week` | A written example week by phase | lists of text | PROPOSED skeleton |

**People and health**

| Field | Meaning | Allowed values | Confirmed by him? |
|---|---|---|---|
| `injuries[]` | The sport's injury hot spots | 49 codes, e.g. `PATELLAR_TENDON`, `ANKLE_SPRAIN`, `SHOULDER_SWIMMER`, `ACHILLES_CALF`, `HAMSTRING` | no: from sports-medicine sources |
| `injury_prehab[]` | Protective work for each hot spot | objects: `code`, `rules[]`, `source` | racket players 50+: R3-ATH-02; swimmers' shoulder care: R3-ATH-01 |
| `age_notes[]` | Notes by age and level of play | text | PRG-09, R2-ATH-08 |
| `variants[]` | Named versions of the profile (a position, a stroke, a weight class) | objects: `id`, `name`, `weekly_sets_delta`, `notes[]`, `evidence` | heavyweights need more resistance: ATH-03 |
| `tests` | Suggested tests | `menu[]`, `timing`, `safety` | R2-PER-07 |
| `equipment[]` | What the sport's training usually needs | text | |

**Stay-active fields** (on 30 of the 31 recreational profiles; `crossfit_class` has none. `age_50_plus` and `hyrox_plan_r3` also sit on the matching competitive profiles.)

| Field | Meaning | Confirmed by him? |
|---|---|---|
| `activity_id`, `competitive_counterpart` | The activity that picks this profile, and its competitive twin | |
| `play_adjustment` | What changes around play days: spacing, heavy-play weeks, cardio credit | R3-ATH-05 |
| `event_prep` | How an event date shapes the plan | R3-ATH-05 |
| `stay_athletic_dial` | The mix of power, agility, core, resistance and aerobic work | PROPOSED |
| `older_60_plus`, `age_50_plus` | Age defaults for this activity | R3-ATH-02 |
| `hyrox_plan_r3` | The approved HYROX week (HYROX profiles only) | R3-ATH-03 |
| `sport_load_context` | How much the sport itself already loads the person | |

### 2.2 The pickers (`synthesis/04_profiles.json`)

| Key | What it holds | Fields |
|---|---|---|
| `sports.list[]` (52) | The sports a competitive athlete can choose | `id`, `group` (`team_field_court`, `aquatic_endurance_track`, `combat`, `strength_fitness`, `racket_club`), `en`, `es`, `default_profile`, `positions[]` {`value`, `en`, `es`, `profile`, `variant`}, `second_choice`, `routed` (true when the sport uses another sport's profile), `rec_activity` |
| `activities.list[]` (26) | The "stay athletic and active" choices | `id`, `en`, `es`, `profile`, `event_type` (true when an event date makes sense), `competitive_counterpart`, `routed` |
| `age_overlays{}` (4) | Age rule sets | `active_aging_60plus`, `active_aging_50plus`, `youth_general_athletic`, `youth_athlete`: each `when`, `scope`, `rule` |
| `goal_defaults{}` | The profile used when a goal has no sport | `muscle` → `bodybuilding_aesthetics`, `strength` → `powerlifting_strength`, `fat_loss` → `fat_loss`, `general` → `general_population`, `hybrid` → `hybrid`, `athletic` and `active` → `weekend_warrior` |
| `id_aliases{}` | Old ids and what they now point to | `profiles`, `sports`, `injury_codes` |

### 2.3 Runtime record (`model/profiles.json > sports{}`)

The compiler reduces each profile to the fields the engine reads.

| Field | Meaning | Allowed values |
|---|---|---|
| `id`, `name_key`, `category`, `sport`, `family`, `group`, `ath03_group` | Identity | as in 2.1 |
| `season_type` | How the sport's year runs | `A` game-heavy team, `B` diamond, `C` meet or championship, `D` combat, `E` tournament individual, `F` endurance or event, `G` strength or physique, `H` seasonal outdoor, `I` general population, stay athletic (no season). INFERRED. |
| `ground_contact_class` | Ground-contact class | `1`-`5` |
| `plyo_share` | Plyometric share | `{start, end}` as fractions, e.g. `{0.35, 0.5}` |
| `share` | Bilateral share by exercise block and phase | `{lower: {by_exercise_block: [..], PRE, IN}, upper: {...}}` |
| `contra_ipsi` | Load side | `contralateral`, `ipsilateral`, `both`, `health_accessory` |
| `frontal_transverse_share` | Frontal and transverse share | fraction |
| `aerobic` | Aerobic sessions | `{off, off_range, pre, in, walks, sport_is_aerobic, activity_counts}` |
| `athletic_sets_wk`, `athletic_weekly` | Weekly athletic budget in sets and in units | sets by bucket; `plyo_contacts`, `jump_contacts`, `low_contacts`, `throws`, `cod_cuts`, `sprint_m`, `olympic_sets` as [low, high] |
| `tiers` | Dose tiers | `T0`-`T5` for plyo, throws, cod, sprint, olympic |
| `medball`, `olympic` | Policies | `{tier, throws_wk, main_workout}`; `{exposures_wk, weekly_sets, none_by_default}` |
| `cod_sport`, `speed_athlete`, `rotational_core` | Quick flags | booleans |
| `in_season`, `pre_season` | Season rules | `{lift_days, game_heavy, hard_day_gap_h}`; multipliers by bucket |
| `injuries[]`, `variants{}`, `age_rules`, `play`, `stay_athletic_dial`, `resistance_goal` | As in 2.1 | |
| `template_hint`, `lead_for_goals[]`, `volume_ratios[]` | Engine hints | objects |
| `confidence` | How sure the profile is (R4-SCP-03). In the data and the docs only; never printed on a plan. | `confirmed_by_coach` (23 profiles), `similar_sport` (67), `proposed` (37) |
| `confidence_basis` | One line saying what the label rests on | text, e.g. "built on the weekend_warrior profile" |

`model/profiles.json` also holds `goals{}` (one record per goal: family, default profile, aerobic count; a `default_minutes` value there is a leftover that feeds nothing but the time estimate), `picker{}` (groups, sports, activities), `goal_defaults{}`, `age_overlays{}` and `id_aliases{}`.

---

## 3. Template

A template is the skeleton of a week for one family and one number of training days. It lists the days, and for each day the stations in the order the coach writes them. The generator fills each station with an exercise.

### 3.1 Source (`synthesis/05_templates.json > generator_split_templates`)

**Family level** (`[family]`)

| Field | Meaning | Allowed values |
|---|---|---|
| (key) | The template family | `aesthetics`, `athletic`, `strength`, `fat_loss_bootcamp`, `hybrid_crossfit`, `no_equipment` |
| `family_notes` | What the family is for and how it is built | text |
| `pairing_mode` | Same pattern or cross pattern (UNI-06) | `same_pattern` (aesthetics), `cross_pattern` (fat loss, bootcamp, no equipment; the default for athletes), a four-role layout (strength), a class model (hybrid / CrossFit) |
| `default_minutes` | Usual session length by kind of client (UNI-09). Source field only: background for the time estimate. Not an input and not a limit (CT-01). | minutes |
| `"2"` … `"6"` | One template per number of training days | template objects |

**Template level** (`[family][days]`)

| Field | Meaning | Allowed values |
|---|---|---|
| `week_layout` | Which day type falls on which weekday | `Mon`…`Sun` → a day-type id (`A1`, `B1`, `S1`, `BC1` …), `OPT` (a planned optional-block day), `OPT (optional)` (an offered extra day), `aerobic`, `run`, `WOD`, `sport/OFF`, `OFF` |
| `day_types{}` | The day types of the week | see below |
| `alternative`, `same_pattern_variant`, `in_season_variant`, `baseball_parts_variant` | Other versions of the same week (upper/lower, push/pull/legs, in-season, and so on) | template-like objects |
| `aerobic_ATH07` | How many aerobic sessions the layout holds and the target by client type | object |
| `checks` | Stored checks of the template from before round 4, at 45, 60 and 90 minutes. Source field only; nothing reads the minute parts any more. | computed |
| `evidence` | What is OBSERVED from his program and which answers shaped it | text |

**Day type** (`day_types[id]`)

| Field | Meaning | Allowed values |
|---|---|---|
| `label` | Readable name, e.g. "A1 - squat + pull (axial squat)" | text |
| `stations[]` | The stations in session order | see below |
| `blocks_R3SES02[]` | The session blocks of the day and whether a person can switch each off (R3-SES-02) | objects: `id` (`warmup`, `core`, `resistance`, `focus`, `athletic` …), `default`, `user_can_switch_off`, `counts_as_muscle_sets` |
| `format`, `dose`, `mode` | Set for circuit days and class-style days | text |
| `evidence` | Sources | text |

**Station** (`stations[]`)

| Field | Meaning | Allowed values |
|---|---|---|
| `bucket` | The category the exercise is drawn from | a bucket id (3.3) |
| `role` | What the station does in the session | `warmup`, `core_block`, `skill`, `athletic`, `power`, `work`, `paired_upper`, `secondary`, `accessory`, `nuance`, `survival`, `iso`, `focus`, `conditioning`, `aerobic_block`, `circuit_station` |
| `group` | The focus group the station serves | `quads`, `hips`, `back`, `chest`, `shoulders`, `biceps`, `triceps`, `calves`, `core` |
| `sets_hint` | Starting sets in week 1 | a number, or "a-b" in older source records (two values that used to depend on session length; the runtime keeps one pair and time no longer chooses between them) |
| `pair` | The lower lift and upper lift that belong together (hip + push, knee + pull) | `P1`, `P2`, `P3` |
| `superset`, `superset_rule` | The superset group. A superset is a recommendation the person switches on (R3-SES-02). The source field `superset_below_minutes` is retired: the compiler deletes it (CT-01). | group id |
| `include_from_minutes` | Retired source field (it tied a station to a session length). The compiler deletes it and gives every station a `rank` instead (3.2). | - |
| `axial` | Which squat or hinge station is the week's heavy spine lift | `axial`, `non_axial`, light variants, or absent |
| `variant` | A narrower choice inside the bucket | in the runtime file: `side`, `rear` (delts); `clean`, `snatch` (Olympic family, placed by the team's reading of R2-ATH-04); `upper` (plyo push-ups); `swing`. The source file writes the same choices as short phrases. |
| `movable`, `default_position`, `allowed_positions[]` | For the core block: it may be moved (ATH-11) | `first`, `after_plyo`, `after_strength`, `end` |
| `circuit` | Which circuit a bootcamp station belongs to | `1`, `2` |
| `counts_as_volume` | False for warm-up stations | boolean |
| `older_default`, `older_option_warning` | What a station does for a person aged 60+ | text |
| `block_R3SES02` | The session block the station belongs to | block id |
| `dose`, `note`, `exercise_hint`, `evidence` | Internal hints and sources. Never shown to the person. | text |

### 3.2 Runtime (`model/templates.json`)

| Part | Fields |
|---|---|
| Top level | `schema`, `buckets{}`, `goal_to_family{}`, `kit_family_override`, `families{}`, `program_names[]` |
| `goal_to_family` | `muscle` → `aesthetics`; `strength` → `strength`; `athletic`, `active` → `athletic`; `fat_loss`, `general` → `fat_loss_bootcamp`; `hybrid` → `hybrid_crossfit` |
| Template (`families[f].days[d]`) | `id` (e.g. `athletic.3`), `family`, `days`, `status` (`built`, `unbuilt`), `format_note`, `week_layout`, `day_types`, `variants`, `aerobic`, `evidence` |
| `week_layout[weekday]` | `day_type`, `kind` (`main`, `optional`, `aerobic`, `off`), `optional`, `note` |
| Day type | `label`, `label_key`, `kind`, `format` (`straight`, `circuit`), `dose_text`, `lower_focus` (`knee`, `hip`, null), `full_body`, `groups[]`, `axial` {squat, hinge}, `stations[]`, `count`, `skeleton` |
| `skeleton` | Which of the coach's day templates the day follows (R4-SES-05): `gym_A` (pull + knee dominant), `gym_B` (push + hip dominant), `gym_C` (the 3-day builder's third day), `athletic_A`, `athletic_B`, `athletic_C`, `ppl_push`, `ppl_pull`, `ppl_legs`, `class_squat`, `class_press`, `class_deadlift`, `class_pull`; null on a day type with no named skeleton |
| `count` | The exercise count the day is built to; null = the client type's default from `rules.session.size` (R4-SES-02) |
| Station | `id` (e.g. `A1.s09`), `bucket`, `role`, `block`, `group`, `sets_hint` [a, b], `sets_text`, `dose_text`, `pair`, `superset`, `circuit`, `axial`, `variant`, `variant_text`, `laterality_dial`, `loading`, `movable`, `counts_as_volume`, `condition`, `older_default_excluded`, `pool_filter`, `rir`, `note`, `rank` |
| `rank` | A counted station's place in the day: 1 = first to stay. A day holds the stations with `rank` up to its exercise count. `99` = a template extra outside the default session (there to add). `null` = an uncounted station that is always in (warm-up, core, cardio). |
| `program_names[]` | `when` (family, days, variant, goal …) → `id`. Names are generic and understandable (FIX-03). |

### 3.3 Buckets

A bucket is the "category" of a station. Each has a definition in `model/templates.json > buckets` with its `kind`, `block`, `rep_class`, `time_class` and, where it applies, `pattern`, `region`, `dominance`, `laterality`, `axial_pattern` and `group`.

| Buckets | What they hold |
|---|---|
| `WARMUP_GENERAL`, `WARMUP_PREP` | Warm-up: 5 minutes of cardio; A-drills or mobility |
| `CT_CORE_THORAX`, `CP_CORE_PELVIS`, `CORE_ANY`, `CORE_OTHER` | Core |
| `SKILL` | Skill practice |
| `AP_SPRINT`, `AP_PLYO`, `AP_JUMP_LIMITED_KNEE`, `AP_THROW`, `AP_COD`, `AP_TRIPLE_EXT` | Athletic work: sprints, jumps, ankle hops, throws, change of direction, Olympic lifts |
| `RP_BKD`, `RP_UKD`, `RP_BHD`, `RP_UHD` | Lower-body compounds: knee or hip dominant, bilateral or unilateral |
| `RP_HPUSH`, `RP_VPUSH`, `RP_HPULL`, `RP_VPULL` | Upper-body compounds: horizontal or vertical, push or pull |
| `ISO_QUAD`, `ISO_LEG_FLEXION`, `ISO_CHEST`, `ISO_SIDE_REAR_DELT`, `ISO_BICEP`, `ISO_TRICEP`, `ISO_CALF` | Isolation |
| `FOCUS` | The Focus 1 and Focus 2 slots |
| `COND_AEROBIC`, `COND_SPRINT_BUYOUT`, `COND_CIRCUIT`, `COND_WOD` | Conditioning: colour sessions, buy-outs, circuits, WODs |
| `FUNCTIONAL`, `RECOVERY_ARM_CARE`, `PREHAB_LOWER`, `PREHAB_NECK` | Carries and drags; joint care |
| `TEST`, `COMPLEX` | Tests; complexes |

`ISO_HAM` in the source files is an old name for `ISO_LEG_FLEXION` (CAT-09).

---

## 4. Intake (what goes in)

The intake is the only input. Nothing is asked after the plan is built (R3-VOL-02, R3-VOL-04). The form is defined in `generator_spec_v1.json > inputs_schema` (fields F00-F46). The engine's contract in `engine/CONTRACTS.md` §2.1 uses the name `intake/2`. The field names below are the engine's. Since round 4 the intake has no session length (R4-SES-01), and the release must be accepted or no plan is generated (R4-SCP-02).

| Field | Form id | Meaning | Allowed values | Source |
|---|---|---|---|---|
| `lang` | F00 | Language | `en` (default), `es` | GEN-01 |
| `units` | F06 | Units | `lb`, `kg` | R2-GEN-08 |
| `role` | F39 | Who the plan is for | `self`, `client` (a coach building for a client) | R2-GEN-03 |
| `health_route` | F45 | For a coach: run the health check or skip it | `coach_screen`, `coach_own_sop` | R2-GEN-03, R3-GEN-01 |
| `safety` | F01 | The five health-check answers | booleans: `heart`, `surgery_6mo`, `pregnant_postpartum_6mo`, `injury_in_treatment`, `doctor_said_no`. Since engine 0.7 (R5-GEN-02) a true answer no longer stops the plan: it is built with a health warning, and the plan never says which answer was true. (Before: any true answer stopped the automatic plan.) | R2-GEN-03, R4-SCP-01 |
| `release` | F46 | The acceptance of the terms and the release of liability for this build. **Required**: without `accepted: true` the engine returns `status: invalid`, no weeks and the error `release_missing`. It is checked first, before the health screen. | `accepted: true`; `version`: `release.client`, `release.coach`, `release.minor` (with `guardian: true` under 18) | R3-GEN-01, R4-SCP-01, R4-SCP-02 |
| `age` | F02 | Age | 10 to 90 (range PROPOSED) | ATH-09 |
| `body_weight` | F05 | Body weight | `{value, unit}` | GEN-02 |
| `experience` | F17 | Training experience | `years_consistent`, `months_off_last_2y`, `former_competitor` | GEN-02, PRG-05 |
| `goal` | F07 | Main goal | `muscle`, `strength`, `athletic`, `active`, `fat_loss`, `general`, `hybrid` | GEN-02; conversation |
| `format` | F07b | Gym sessions or bootcamp circuits | `gym`, `bootcamp` (fat loss and general only) | PRG-03 |
| `sport` | F11a-F15 | For athletes: `competitive`, `sport`, `position`, `position_detail`, `level_of_play`, `season` {`type`, `date`}, `practice` {`practice_days_per_week`, `game_days`} | sport and position ids from the picker; season types `next_season_start`, `in_season_until`, `competition_date`, `no_season` | GEN-02, R2-GEN-05 |
| `activity` | F11r | For stay-active people: `ids` (up to 2), `play_days`, `play_minutes`, `event_date`, `league_sport`, `style` | activity ids; `play_minutes`: `under_45`, `45_60`, `60_plus` | conversation, R3-ATH-05 |
| `focus_muscles` (old name `priority_muscles`) | F09 | Focus muscle 1 and 2 | up to 2 of `quads`, `glutes`, `hamstrings`, `back`, `chest`, `shoulders`, `biceps`, `triceps`, `calves`, `core`, `v_taper`. There is no `rear_delts` or `side_delts` choice: old values read as `shoulders` (R3-VOL-01). | R3-SES-01 (two Focus muscles); the list of options is PROPOSED |
| `lift_style` | F10 | Rep-style preference | `volume_lighter`, `balanced`, `heavy_powerlifting` | VOL-12 |
| `schedule` | F22, F23, F26 | `days_per_week`, `weekdays`, `start_date`. There is no session length (R4-SES-01). An old intake that still sends `session_minutes` is accepted and the value is ignored, with `warning.session_minutes_retired`. | 2-6 days | R4-SES-01, CT-01 |
| `plan` | F25-F26b | `mode`, `maint_reason`, `maint_weeks`, `previous_cycles` {`count`, `last_block_finished`}, `tests[]` | modes `fixed_12`, `fixed_8`, `maintenance_4_6`, `year`; tests `strength`, `cardio`, `speed_agility`, `jumps`, `body`, `none` | PER-01, R2-PER-06, R2-PER-07 |
| `equipment` | F27-F34 | `profile`, `extras[]`, `machines[]`, `preference`, `detail` | profiles `FULL_GYM`, `BASIC_GYM`, `HOME_BARBELL`, `HOME_DB_BENCH`, `KB_ONLY`, `BODYWEIGHT`, `HOTEL_GYM`, `FIELD_TRACK_KIT` | EQ-01, EQ-10 |
| `pain[]` | F35, F36 | Painful areas | `area`: `neck`, `shoulder`, `elbow`, `wrist_hand`, `upper_back`, `lower_back`, `hip_groin`, `knee`, `ankle_foot`, `other`; `side`; `severity`: `mild`, `moderate`, `severe` (severe stops the plan) | VOL-03 |
| `exclusions[]` | F38 | Things the person will not do | `running`, `jumping`, `barbell`, `lunges`, `overhead_pressing`, `floor_work`, `machines`, `other` | team (PROPOSED) |
| `growth_stage` | F03 | For athletes under 18: growth stage | `pre_phv`, `circa_phv`, `post_phv`, `not_sure` | team (PROPOSED) |
| `prefs` | F44 | Preferences | `core_position` (`start`, `after_plyos`, `after_strength`, `end`), `optional_days` (`separate`, `add_on`), `variety_ab`, `heavy_unilateral`, `supersets_for_fatigue`, `cardio_adjust`, `superset_recommendations` (`show`, `hide`), `older_athletic_opt_in`, `racket_50_impact_opt_in` | ATH-11, ORD-10, PER-03, UNI-04, ORD-05, R2-SES-06, R2-ATH-08, R3-ATH-02, R3-SES-02 |

**Removed fields.** `sex` (GEN-02); sleep, stress and job (R2-GEN-04); `output_mode` with its check-in and logbook options (R3-VOL-02); `email` (R3-GEN-01); `schedule.session_minutes`, the session length (R4-SES-01). The engine rejects any key named `sex`, `gender`, `sleep`, `stress`, `recovery`, `job`, `hard_job_or_other_sport`, `life` or `energy`.

---

## 5. Plan output (`plan/2`)

The plan is one JSON object. It holds codes and word-list keys, never sentences. A renderer turns it into English or Spanish text. The same intake and the same model always give the same plan.

### 5.1 Top level

| Field | Meaning | Allowed values |
|---|---|---|
| `schema` | Schema name | `plan/2` |
| `status` | Result | `ok` (a full plan; since round 5 also after a yes on the health check or with severe pain, with the health warning, R5-GEN-02), `refer` (retired: only a model without `rules.legal.health_flag` still stops on a health answer or severe pain), `invalid` (the intake was wrong, or the terms and release were not accepted: R4-SCP-02) |
| `model_version`, `engine_version`, `contracts_version` | What built the plan | version strings |
| `seed`, `intake_hash` | Fixed values taken from the intake, so the result can be reproduced | strings |
| `lang`, `units` | Language and units | `en`, `es`; `lb`, `kg` |
| `release_stamp` | The release accepted for this build. Printed on the plan as the release line, top and bottom (R4-SCP-01, R4-SCP-02). Never stored (R3-GEN-01). | `{version, lang, role, guardian, accepted}`; `accepted: true` on every `ok` plan; null when the status is not `ok` |
| `refer` | Why the person was referred (retired by R5-GEN-02; null on this model) | `{reasons: [keys]}` or null |
| `errors[]` | Intake problems, when `invalid` | issue objects |
| `edited` | False on a generated plan. True after `applyPlanEdits` (CX-04): totals are recounted, an `edits` list is added, and the checks that judge the generated layout no longer vouch for the plan. | boolean |
| `meta` | Everything decided once for the whole plan | see 5.2 |
| `shape` | The calendar of the plan | see 5.3 |
| `weeks[]` | The weeks | see 5.4 |
| `summary` | Totals by week | see 5.7 |
| `validation` | The checks that were run | see 5.7 |

### 5.2 `meta`

| Field | Meaning |
|---|---|
| `program_id`, `program_name_key` | The generic program name |
| `goal`, `family`, `format` | Goal, template family, gym or bootcamp |
| `profile` | `{id, variant, sport_id, position, activity_ids, overlays, competitive, season_type, name_key}` |
| `level` | `{client: L1, L2 or L3, exercise_ladder, reason_keys}`: the level and the plain-words reason for it (PRG-05) |
| `season` | For athletes: `{phase, weeks_to_season, season_date, practice_days, game_days}` |
| `plan_mode`, `skeleton`, `weeks`, `start_date` | The plan type and length |
| `days_per_week`, `weekdays`, `play_days` | The schedule |
| `session_size` | The exercise count the days are built to (R4-SES-02): `{type, range: [lo, hi], default}`; types `general`, `aesthetics`, `strength`, `bootcamp`, `athletic`, `stay_active`, `class`, `older` |
| `two_day` | Set on a plan with 2 training days (R4-SES-03): `{weekly_sets: [6, 8], suggest_days: 3}`; else null |
| `time` | Always `estimate_only` (CT-01) |
| `template` | `{id, variant, pairing}` |
| `kit` | `{profile, tokens, machines, medball_max_lb, buy_list}` |
| `constraint_band` | The constraint levels preferred for this person |
| `targets` | Weekly-set starts and ceilings by line, the fill policy of each muscle, Focus muscles, pain-reduced muscles, groups under the floor rule, credit-only groups, calves per leg day, core block |
| `stairway[]` | One entry per training block: `training_block`, `N`, `groups`, `credit_only_groups`, `group_start`, `group_top`, `planned_top`, `schedule` (whole sets per group and week), `arrival_week`, `realized_arrival_week`, `realized_top`, `capped[]` (`{group, planned, held}`: what the template could not hold), `below_floor`, `bonus[]` (bonus exercises opened), `focus_closed`, `acceleration` (weeks above the note threshold), and more |
| `share_targets` | The bilateral share targets by exercise block |
| `athletic` | `{enabled, older_mode, plyo_share {start, end}, ground_contact_class, contacts_session_max, olympic_exposures_wk, game_heavy, heavy_play_week}` |
| `aerobic` | `{per_week, base, adjust, replaced_by_activity, walks, sport_is_aerobic}` |
| `tests` | `{items, baseline_week, end_weeks, from_zero, test_days, test_dates}` |
| `addons[]` | Optional add-ons that fit this person (R4-LIB-01): `{exercise_id, name_key, kind: joint_care, sport or carry, code, bucket, block, sets: [min, max], reps, counts_as_muscle_sets, video, why}`. None is in the plan's days; the person adds one with an edit. |
| `health` | `{role, health_route, refer, warn, reasons, bypass}`. `warn: true` when the plan was built with the health warning (R5-GEN-02); `reasons` say only 'a yes on the health check' and / or 'severe pain'. The health answers themselves are not in the plan. |
| `after_plan` | What comes next for an athlete (for example a pre-season) |
| `instruction_keys[]` | The coach's instruction block shown at the top of the plan (GEN-07) |
| `locked_rule_keys[]` | The hard rules in force |
| `input_audit` | The intake keys that were read, and any forbidden key found |
| `warnings[]` | Notes for the person: `{code, key, args}`. Codes of engine 0.5 include `two_day_rule`, `acceleration`, `capped_by_template`, `below_floor_template`, `credit_only_groups`, `floor_needs_optional_day`, `session_minutes_retired`, `plan_edited`. None is about time. |
| `derived` | The full set of derived values, for audit |
| `why[]` | Why the profile, level and template were chosen |

### 5.3 `shape`

| Field | Meaning | Allowed values |
|---|---|---|
| `mode`, `skeleton`, `weeks_total`, `open_ended` | Plan mode and length | |
| `training_blocks[]` | `{n, type, weeks [from, to], stair_N, label_key, factor}` | `type`: `stairway`, `pre_season`, `taper`, `in_season`, `maintenance`, `recovery` (the easy week, only between two stairway blocks) |
| `exercise_blocks[]` | `{n, training_block, weeks [from, to]}`: where the exercises stay the same | |
| `level_by_week[]` | The stair level of each week | 2 → 11 |

### 5.4 Week (`weeks[]`)

| Field | Meaning | Allowed values |
|---|---|---|
| `n`, `training_block`, `block_type`, `exercise_block` | Where the week sits | |
| `stair_week`, `stair_level` | Its place and level on the stairway | 1…N; 2…11 |
| `phase`, `phase_key` | The week's label | `ACCLIMATION`, `DRIVE`, `HARDEST`; or `PRE_SEASON`, `TAPER`, `IN_SEASON`, `MAINTENANCE`, `RECOVERY`, `POST` |
| `planned_rir` | The effort target of the week | `{min, max, intensifiers}` inside 1-3 |
| `season_phase` | Athlete season phase | `OFF_EARLY`, `OFF_BUILD`, `OFF_LATE`, `PRE`, `IN`, `POST`, or null |
| `rep_phase` | Athlete rep phase | `VOL1`, `VOL2`, `VOL3` |
| `plyo_stage` | Receive-Create stage | `RC1`, `RC2`, `RC3` |
| `test` | Test week details | `{type: baseline or end, items, from_zero}` or null. Only in week 1 and the last week (R2-PER-07). |
| `circuit` | Bootcamp circuit dose for the week | rounds and work seconds, or null |
| `step_by_muscle` | The planned step into this week | fractions; 0 in week 1 |
| `target_by_group` | The planned whole sets of each focus group this week (the stairway schedule) | integers |
| `acceleration[]` | Groups whose step into this week is above the note threshold (about 15 %, R4-PRG-02) | entries, or `[]` |
| `credit_only_groups[]` | Groups with no exercise of their own this week | group ids |
| `target_by_muscle` | The planned weekly sets | numbers |
| `weekly_sets_by_muscle`, `direct_sets_by_muscle`, `main_sets_by_muscle` | Sets actually placed, with credits; direct sets only; main-day sets only | numbers |
| `weekly_sets_by_line`, `weekly_sets_by_group`, `main_sets_by_group` | The same, by line and by focus group | numbers |
| `total_main_sets` | Resistance sets on the main training days | number |
| `group_counts_by_day` | Exercises per group on each day (1 to 4 on a full-body day, 2 to 4 on a split day) | counts |
| `total_resistance_sets`, `rise_vs_prev` | The week's total and its rise over the week before | number; fraction |
| `athletic_budget` | Jumps, throws, cuts, sprint metres and Olympic sets: targets and planned amounts | object |
| `aerobic_sessions` | Aerobic sessions in the week | integer |
| `changes[]` | What changed from the week before | keys |
| `why[]` | Why this week looks the way it does | why objects |
| `days[]` | The days | see 5.5 |

### 5.5 Day, block and item

**Day** (`days[]`)

| Field | Meaning | Allowed values |
|---|---|---|
| `weekday`, `day_type`, `label_key` | Which day | `Mon`…`Sun`; a day-type id |
| `kind`, `optional` | Kind of day | `main`, `optional`, `aerobic`, `play` |
| `full_body`, `format` | Full-body day or split day; straight sets or circuit | boolean; `straight`, `circuit` |
| `est_minutes`, `aerobic_minutes` | The estimated length of the day, and the part of it that is cardio. Information only: nothing reads it to cut or reshape (CT-01). There is no chosen length and no limit. | minutes |
| `exercise_count` | The exercise count the day was built to (R4-SES-02) | integer |
| `skeleton` | The coach's day template the day follows (R4-SES-05) | as in 3.2, or null |
| `easy_to_remove[]` | What is easiest to remove if the person wants a shorter day (R4-SES-04). A hint: nothing is removed. | `{slot_id, kind}`; kinds `conditioning_finisher`, `extra_athletic_station`, `small_muscle_accessory`, `bonus_exercise` |
| `supersets_on` | Whether the person switched supersets on. No session length switches them on. | boolean |
| `superset_recommendations[]` | Suggested pairs (R3-SES-02) | `{pair_id, items[], minutes_saved, on}` |
| `toggle_blocks[]`, `toggle_items[]` | The blocks and circuit stations a person may switch off | block kinds; item references |
| `groups` | Exercises per focus group that day | counts |
| `why[]` | Why the day is built this way | why objects |
| `blocks[]` | The session blocks in order | see below |

**Block** (`blocks[]`)

| Field | Meaning | Allowed values |
|---|---|---|
| `kind` | The kind of block | `warmup`, `core`, `skill`, `athletic`, `power`, `strength`, `accessories`, `prehab`, `circuit`, `conditioning`, `aerobic`, `cooldown`, `test` |
| `id` | Stable id, the same every week of the block | `blk.<weekday>-<day type>.<kind>.<n>`, e.g. `blk.mon-a1.strength.1` |
| `position` | Order in the day | 0, 1, 2 … |
| `movable` | True for the core block | boolean |
| `toggle` | May the person switch it off? | boolean. False for the warm-up and the strength block. |
| `removable` | May it be removed exercise by exercise? | boolean |
| `circuit` | Circuit details when the block is a circuit | object or null |
| `items[]` | The exercises | see below |

**Item** (`items[]`)

| Field | Meaning | Allowed values |
|---|---|---|
| `slot_id`, `station_id` | Which slot of which day | e.g. `Mon.S1.s09`, `S1.s09` |
| `bucket`, `role`, `group` | The category, the role and the focus group | as in section 3 |
| `origin` | Where the item came from | `template`; or added by the engine: `bonus`, `focus_added`, `aerobic_addon`, `cooldown`, `prehab_added`, `pattern_kept`, `circuit_swap`, `test` |
| `exercise_id`, `name_key` | The exercise | catalog id; word-list key. Null for a text-only item such as the general warm-up. |
| `detail` | A one-detail variation (R2-LIB-01) | `{axis, key, value}` or null |
| `text_key`, `cue_key`, `tempo_key` | Extra text keys | keys or null |
| `video` | Video link | `{kind, url, copy_name}` or null. `kind: search` = a YouTube search link; `copy_name` = the exact English name to copy into YouTube (R4-LIB-05). `kind: coach` is reserved for his own videos. Never a third-party link. |
| `sets` | Sets this week | integer |
| `reps` | Reps | `{type, …}`; types `range`, `fixed`, `per_side`, `seconds`, `minutes`, `contacts`, `throws_per_side`, `cuts`, `sprint_reps`, `rounds_work`, `test`, and `distance_or_time` for carries and sled work (`metres: [20, 40]`, `seconds: [20, 40]`, `per_side`; the item's `sets` are trips: R4-LIB-02) |
| `set_reps` | Per-set reps for a pyramid such as 12/10/8 then 20 | list or null |
| `effort` | Effort target | `{type, …}`; types `rir` (with `min`, `max`, `rpe_min`, `rpe_max`, `last_set`: null, `max`, `myo`), `intent`, `power`, `aerobic` |
| `rest` | Rest | `{type, …}`; types `seconds`, `after_pair`, `work_rest`, `circuit`, `as_prescribed` |
| `load` | Load guidance | `{type, …}`; types `week1_tip`, `medball_lb`, `bw_pct`, `height`, `power` |
| `superset`, `superset_suggested` | The pair it belongs to; the suggested pair | pair id or null |
| `laterality`, `loading` | Bilateral or unilateral; contralateral or ipsilateral cue | |
| `credits` | Sets credited per muscle for one set of this item | object; `{}` for athletic work |
| `athletic`, `aerobic`, `circuit`, `wod`, `test` | Details for those kinds of item | objects or null |
| `progression` | The rule the person applies to progress reps and load (R4-PRG-03). Never a promised number. | `{kind: double_progression, rep_range: [lo, hi], when, then, else, promised_numbers: false}` or null |
| `notes[]` | Notes to show | `{key, args}` |
| `swaps[]` | Other exercises of the same category the person may choose (GEN-04) | catalog ids |
| `swap_notes[]` | What each swap keeps and loses (R4-LIB-04) | `{id, keeps, loses}`: word-list keys under `swap.keeps.` and `swap.loses.` |
| `instead_of` | Set when the pick stands in for missing equipment: what it replaces, keeps and loses | `{exercise_id, keeps, loses}` or null |
| `flags[]` | Marks set by the engine | e.g. `axial_counted`, `clean_day`, `snatch_day`, `detail_variation`, `block_change`, `pain_swap`, `back_off` |
| `why[]` | Why this exercise, these sets, this effort | why objects |

### 5.6 `time_check` (retired)

Engine 0.5 has no `time_check` and no `offers` in a plan. The round-3 time check was removed on 2026-10-10 (CT-01). Check V3 fails any plan that still carries `time_check`, a time offer, `session_minutes`, a day `minutes_limit` or a retired time warning. What a plan says instead:

| Situation | Where the plan says it |
|---|---|
| 2 training days: every big muscle at about 6 to 8 weekly sets | `meta.two_day`, `warning.two_day_rule` |
| A group its template cannot take to its planned final sets | `meta.stairway[].capped[]`, `warning.capped_by_template` |
| A group its template holds under the floor | `meta.stairway[].below_floor`, `warning.below_floor_template` |
| A group with no exercise of its own | `week.credit_only_groups[]`, `warning.credit_only_groups` |
| What is easiest to remove from a day | `day.easy_to_remove[]` |
| How long a day takes on average | `day.est_minutes` (printed as a range, information only) |

### 5.7 `summary` and `validation`

| Field | Meaning |
|---|---|
| `summary.total_resistance_sets_by_week[]` | Total resistance sets, week by week |
| `summary.max_weekly_rise`, `planned_steps_max` | The biggest weekly rise of the total, and the biggest planned step |
| `summary.stair_levels[]` | Stair level by week |
| `summary.sets_by_muscle_by_week`, `sets_by_line_by_week`, `sets_by_group_by_week`, `target_by_muscle_by_week`, `target_by_group_by_week` | Sets and targets, week by week |
| `summary.acceleration` | The weeks that carry the big-step note (R4-PRG-02) |
| `summary.myo_equivalent_sets_by_week[]` | Extra sets counted for MYO sets |
| `summary.shortfalls[]` | Where the plan fell short of a target |
| `validation.ok` | True when no error check failed |
| `validation.checks[]` | One entry per check: `{id, key, severity: error or warn, pass, violations[]}`. Engine 0.5 runs 59 checks: `V1`-`V37` and `H01`-`H22`. |

A note on check ids: the engine's list (`model/rules.json > validation > checks`, explained in `engine/CONTRACTS.md` §6) is `V1`-`V37` plus `H01`-`H22`. The spec's own list (`generator_spec_v1.json > validation_checks`) uses different numbers after `V26`. Cite a check together with the file you read it in. The engine checks added or changed for the newest answers:

| Check | What it holds | Answer |
|---|---|---|
| `V3` | No time fitting anywhere in the plan | CT-01, R4-SES-01 |
| `V13` | Session size by exercise count | R4-SES-02 |
| `V15`, `H10` | Final sets reached in the last week, one week early at most | CX-01, R4-PRG-01 |
| `V21`, `H20` | The liability gate: release accepted, the release line's words and link in English and Spanish | R4-SCP-01, R4-SCP-02 |
| `V22`, `H17` | Floor of 10 from 3 training days; 6 for big groups on 2 days | R2-VOL-06, R4-SES-03 |
| `V23`, `H18` | 1 to 4 exercises a group on a full-body day | R4-SES-05 |
| `V30` | A day that names a skeleton follows the coach's template; nothing dropped | R4-SES-05, R4-SES-04 |
| `V31` | No optional add-on or proposed record as a pick outside the two exceptions | R4-LIB-01 |
| `V32` (warning) | Incline first for bodybuilding and general-population plans | R4-LIB-03 |
| `V33` | No third-party video link | R4-LIB-05 |
| `V34` | Every set-and-rep lift carries its progression rule; no promised numbers | R4-PRG-03 |
| `V35` | A week above about 15 % carries its note | R4-PRG-02 |
| `V36` | The easy-to-remove list names only removable items | R4-SES-04 |
| `V37` | A carry or sled item is dosed by distance or time and credits nothing | R4-LIB-02 |

An edited plan (`edited: true`) is not judged by V30, V32 and V35.

### 5.8 Why objects and word keys

Every decision of note carries a **why** object:

```json
{"key": "why.two_spine_days", "ref": "R2-SES-01", "args": {"pattern": "squat"}}
```

| Field | Meaning |
|---|---|
| `key` | A word-list key under `why.` |
| `ref` | The source of the rule: a coach answer id (`VOL-07`, `R2-SES-01`, `R3-VOL-04`), a check id (`V10`), an engine decision id, or `INFERRED` / `PROPOSED` |
| `args` | Values that fill the sentence |

Words live in `model/i18n/en.json` and `es.json` as flat key → text lists. Key families: `exercise.<id>.name`, `slot.<BUCKET>`, `block.<kind>`, `plan.phase.<PHASE>`, `goal.<id>`, `group.<id>`, `muscle.<id>`, `effort.*`, `note.*`, `warning.*`, `why.*`, `instruction.*`, `guide.adjust.*`. Spanish lines that the coach has not approved yet are listed in `model/i18n/es_review.json`.

### 5.9 What a plan never contains

- Free text. Only codes and keys.
- Health answers, or any personal data beyond what the plan needs. Shared links and images also leave out age, weight and pain.
- A `sex`, `gender` or lifestyle key (GEN-02, R2-GEN-04).
- A band, chain or weight-releaser exercise or swap (EQ-01, EQ-12).
- A check-in, a log or anything that feeds back into the plan (R3-VOL-02).
- A session length, a minute limit, a time check or a time offer (CT-01, R4-SES-01).
- A third-party video link (R4-LIB-05).
- A promised number of reps or a load for a given week (R4-PRG-03).
- A team-proposed exercise as a template pick, outside wall balls and sled pushes in HYROX and the CrossFit-style class (R4-LIB-01).

---

## Related pages

- [adding-exercises.md](../adding-exercises.md): how to write a new exercise record, step by step.
- [parameters.md](parameters.md): the numbers behind the rules.
- [glossary.md](glossary.md): what the terms mean.
- [categories](../02-model/categories.md), [exercise library](../02-model/exercise-library.md), [sports](../02-model/sports.md), [sessions](../02-model/sessions.md): the same data explained in words.
- [For developers](../00-overview/for-developers.md) and [how a plan is made](../00-overview/how-a-plan-is-made.md): where to start.
- [AGENTS.md](../../AGENTS.md): how the files fit together and how to change them safely.
