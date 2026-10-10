# Adding an exercise (or a variation) to the Blaze Camp catalog

For coaches and developers. This guide shows how to add a new exercise to the library, or a variation of one, so the plan generator files it, counts it and uses it the way coach Lalo Vera (Blaze Camp) would. You need Node 22 and Python 3 (standard library only). No npm install.

*Versión en español: [adding-exercises.es.md](adding-exercises.es.md).*

> **Use at your own risk.** The exercise library and every plan built from it are general fitness information, not medical advice. Adding or using an exercise is at your own expense and risk. If you program for other people, you need your own health screening, liability release and insurance. Read [DISCLAIMER.md](../DISCLAIMER.md) ([DISCLAIMER.es.md](../DISCLAIMER.es.md) in Spanish). License: [MIT](../LICENSE).

**Evidence labels used here** (see [CONTRIBUTING.md](../CONTRIBUTING.md)): `OBSERVED` (read from his sheets), `COACH-ANSWER <id>` (round 1), `COACH-R2 <id>`, `COACH-R3 <id>` (his later rounds), `INFERRED` (our reading), `SCIENCE`, `PROPOSED` (waiting for his approval). Every exercise you add starts as **PROPOSED**.

## Contents

1. [Rules that never bend](#1-rules-that-never-bend)
2. [New exercise or a variation?](#2-new-exercise-or-a-variation)
3. [Where it goes: source and compiled files](#3-where-it-goes-source-and-compiled-files)
4. [The coach's lenses: how to classify an exercise](#4-the-coachs-lenses-how-to-classify-an-exercise)
5. [Field reference](#5-field-reference)
6. [Words in the id that change what happens](#6-words-in-the-id-that-change-what-happens)
7. [Three worked examples](#7-three-worked-examples)
8. [Step by step: add, recompile, test](#8-step-by-step-add-recompile-test)
9. [When the coach approves (or says no)](#9-when-the-coach-approves-or-says-no)
10. [Checklist](#10-checklist)
11. [Troubleshooting](#11-troubleshooting)

---

## 1. Rules that never bend

| Rule | Source |
|---|---|
| **No bands, chains or weight releasers**, anywhere: not in a set-up, id, name, cue, swap or Spanish name ("liga", "banda", "cadena" fail the check too, so write "cadena posterior" another way). | COACH-ANSWER EQ-01, EQ-07, EQ-08, EQ-12; hard rule H01 |
| **No V-squat**, ever. | COACH-ANSWER GEN-08 |
| **The generator never invents exercises.** It only uses records in the catalog. A record you add is `PROPOSED`: it can appear in the swap lists, never as the main pick, until the coach approves it. | COACH-ANSWER CAT-07; COACH-R2 R2-LIB-01, R2-LIB-07 |
| **Athletic work never counts as muscle sets** (jumps, throws, Olympic lifts, sprints, change of direction, KB swings, conditioning). It is counted in contacts, throws, reps, cuts or metres. | COACH-ANSWER VOL-10; COACH-R2 R2-VOL-05 |
| **One record per real exercise.** Near-duplicates are merged. Search before you add. | COACH-ANSWER LIB-17 |
| **English and Spanish names** for every exercise. Spanish is neutral Latin American Spanish with the English gym term in brackets. | COACH-ANSWER GEN-01; COACH-R2 R2-GEN-08 |
| **Cues are the coach's words.** Don't write a "coach cue" for him; leave it out unless he wrote it. | COACH-ANSWER GEN-07 |
| **Never edit the coach's Google Sheets**, the exports in `raw/` and `dumps/`, or the coach-answer files. | CONTRIBUTING.md |

## 2. New exercise or a variation?

The coach approved **one-detail variations**: his library exercise stays the main pick, and between exercise blocks the plan may change one detail and show it as "Library name - detail", for example "Reverse Lunge - dumbbell in the opposite hand" (COACH-R2 R2-LIB-01). A variation like that is **not a new record**. It is an axis on the existing record.

| What changes | What to do |
|---|---|
| Only one of these details: which hand holds the weight, grip, stance, implement, range (box height, depth, hexagon size ...) | **Variation.** It is an axis of the existing record (`variation_axes`). Use only these five axes: `implement`, `stance`, `grip`, `range`, `hand` (written `which hand holds the weight` in the source). The plan already has words for them (`detail.implement` ... `detail.hand`). If the axis is missing, see "Adding an axis to an existing record" below. |
| Anything the generator files or counts differently: level rung, pattern, prime mover or credit, laterality, the equipment set-up, spine class, constraint level, ballistic vs plyometric, Receive-Create stage, a safety tag (overhead, deep knee bend, depth jump ...), the 60+ default | **New record.** Example: "Bench Push-Up - Hands on Bench" (foundational) and "Bench Push-Up - Feet on Bench" (advanced) are two records (COACH-R2 R2-LIB-05). Link them with `related`. |
| The same exercise under another name | **Nothing to add.** Near-duplicates are merged (LIB-17). If the name is better, propose a rename in an issue. |

**Adding an axis to an existing record.** Existing records are not rewritten in the source; corrections to them go through the amendment layer that both the fixture and the compiler run (`AGENTS.md` §11.3). Open an issue, or (developers) add one labelled line to `amendExercise` in `tools/fixture/review-v12.mjs`, just before `e.tags = [...tags].sort();`:

```js
  // R2-LIB-01 one-detail variation axis (PROPOSED 2026-10-09): a DB hip thrust can also use a KB or a plate
  if (e.id === 'dumbbell-hip-thrust' && !e.variation_axes.includes('implement')) e.variation_axes = [...e.variation_axes, 'implement'];
```

Then recompile, rebuild the fixture and test as in steps 8.6-8.12 (no pinned count changes). The plan may now show "Dumbbell Hip Thrust - different implement" in a later exercise block, so read the sample-plan diff.

Before adding anything, search for duplicates (from the repo root):

```sh
python3 - "hip thrust" <<'EOF'
import json, sys
q = sys.argv[1].lower()
for r in json.load(open('synthesis/02_exercise_catalog.json', encoding='utf-8')):
    if q in (r['id'] + ' ' + r['name']).lower().replace('-', ' '):
        print(f"{r['id']:55} {r['record_type']:12} {r['status']}")
EOF
```

Try two or three wordings ("meadows", "landmine row", "single arm row").

## 3. Where it goes: source and compiled files

```
SOURCE (you edit these)
  synthesis/02_exercise_catalog.json   the exercise record (a JSON array; 939 records in v1.1)
  tools/compile/es/exercises.mjs       its Spanish name, keyed by the English name
        |
        |  node tools/compile-model.mjs
        |    tools/compile/catalog.mjs      normalizeExercise(): source record -> runtime record
        |    tools/compile/patches.mjs      the coach's corrections (bands removed, renames, credits ...)
        |    tools/fixture/review-v12.mjs   amendExercise(): v1.2 review amendments (spine class, barbell set-ups, tags)
        v
GENERATED (never edit by hand)
  model/catalog.json                   runtime records the engine reads (CONTRACTS.md §3.2)
  model/i18n/en.json, es.json, es_review.json
  model/CHANGELOG.md, COMPILE_REPORT.json, manifest.json
  engine/fixtures/mini-model.json      reference copy, rebuilt by node tools/fixture/build-fixture.mjs
```

- `model/` is rebuilt from the sources every time. A hand edit there is overwritten, and the test "model/ on disk is the current compile of the sources" fails.
- `engine/CONTRACTS.md` §1.1 lists `synthesis/` as read-only for the engine build roles. A catalog addition is a **model change**, not engine code: it goes in its own pull request that touches only the catalog source, the Spanish name, the regenerated files and the pinned counts (step 8), and the maintainers review it as a model change.
- Keep the source file's format: 1-space indent, UTF-8 (accents kept as letters), no newline at the end, and numbers like `1.0` kept as written. The append script in step 8 does exactly that. Don't re-save the file from an editor or with `JSON.stringify` (it rewrites every `1.0` as `1`, a 10 MB diff).

## 4. The coach's lenses: how to classify an exercise

**Every exercise is tagged on all lenses at once** (family, pattern, laterality, plane, size class, muscles credited, implement and constraint, level), so the generator can segment by any of them. He called this "the whole taxonomy of each exercise" (COACH-ANSWER CAT-01). The master document is `BLAZE_CAMP_BRAIN.md` §2-§3; this section is the short version.

### 4.1 Family: what quality it trains

| Coach code | `taxonomy.family` | It trains | Counted as | Source |
|---|---|---|---|---|
| AP Athletic patterns | `ATHLETIC` | a quality: speed, power, reactivity, change of direction | contacts, throws, power reps, cuts, metres; **never muscle sets** | VOL-10 |
| RP Resistance patterns | `RESISTANCE` | a muscle | sets x reps at 1-3 reps in reserve, per muscle | VOL-09 |
| CO Control / core: CT thorax, CP pelvis, CB both | `CONTROL` | the trunk | core sets (abs / obliques) | CAT-08 |
| CA Cardio / conditioning | `CARDIO` | the aerobic system | sessions and bouts | ATH-07 |
| FN Functional (carries, drags, slings) | `FUNCTIONAL` | the whole body | no muscle sets | LIB-19 |

### 4.2 Pattern: the organising lens

Big muscles, athletic work and core are organised **by pattern**; small muscles **by muscle** (COACH-ANSWER CAT-02, CAT-03). `taxonomy.pattern_code` picks the slots the exercise can fill and how it is credited:

| `pattern_code` | Meaning | Slot (template bucket) | Credit class and credits per set |
|---|---|---|---|
| `BKD` | bilateral knee dominant (squats, leg press) | `RP_BKD` | `BKD`: quads 1, glutes 0.25, adductors 0.25 (`THRUSTER` for thrusters) |
| `UKD` | unilateral knee dominant (lunges, split squats, step-ups) | `RP_UKD` | `UKD`: same as BKD |
| `BHD` | bilateral hip dominant (deadlifts, RDLs, hip thrusts, bridges) | `RP_BHD` | `BHD`: hamstrings 1, glutes 0.25; `GLUTE_ISO` (glutes 1, hamstrings 0.25) when glutes are the 1.0 mover |
| `UHD` | single-leg hinge or bridge | `RP_UHD` | `UHD` or `GLUTE_ISO`, as above |
| `KEXT` | leg extension | `ISO_QUAD` | `LEG_EXTENSION`: quads 1 |
| `KFLEX` | **leg flexion**: leg curls, Nordics, slider and ball curls (not hip dominant, CAT-09) | `ISO_LEG_FLEXION` | `LEG_FLEXION`: hamstrings 1 |
| `HPUSH` | horizontal push (bench press, push-ups, flies, dips) | `RP_HPUSH` | `HPUSH`: chest 1, triceps 0.25, front delts 0.25; `DIPS`: chest 0.5, triceps 0.5; `ISO_CHEST` (flies, slot `ISO_CHEST`): chest 1 |
| `MRPUSH` | mid-range push (incline, landmine press) | `RP_HPUSH` or `RP_VPUSH` by the prime mover | `HPUSH` or `VPUSH` |
| `VPUSH` | vertical push | `RP_VPUSH` | `VPUSH`: front delts 1, side delts 0.25, triceps 0.25 |
| `HPULL` | horizontal pull (rows) | `RP_HPULL` | `HPULL`: back 1, biceps 0.25, rear delts 0.25 |
| `VPULL` | vertical pull (pull-ups, pulldowns, pull-overs) | `RP_VPULL` | `VPULL`: back 1, biceps 0.25; `PULLOVER`: back 1 |
| `SHLD` | shoulder isolation: side raises, upright rows, rear-delt work, front raises, face pulls | `ISO_SIDE_REAR_DELT` | `ISO_SIDE` side delts 1; `ISO_REAR` rear delts 1; `ISO_FRONT` front delts 1; `FACEPULL` rear delts 1 + side delts 0.25 |
| `BIC` / `TRI` / `CALF` / `NECK` | biceps / triceps / calves / neck | `ISO_BICEP` / `ISO_TRICEP` / `ISO_CALF` / `PREHAB_NECK` | target muscle 1 (biceps also forearms 0.25) |
| `CT` / `CP` / `CB` | core thorax (trunk moves on a still pelvis) / core pelvis (pelvis and legs move on a still trunk) / both | `CT_CORE_THORAX` / `CP_CORE_PELVIS` / both, plus `CORE_ANY` | `CORE`: abs and obliques 1 |
| `AOS` | anterior oblique sling (chops, Pallof work) | `CT_CORE_THORAX`, `CORE_ANY` | `CORE` |
| `PLYO` | jumps (plyometric and ballistic) | `AP_PLYO` | `ATHLETIC`: nothing |
| `ANKLE` | jumping ankle / limited knee (ankle hops, pogo-type work) | `AP_JUMP_LIMITED_KNEE` | `ATHLETIC` |
| `THROW` | medball throws | `AP_THROW` | `ATHLETIC` |
| `TX` | triple extension / Olympic lifts | `AP_TRIPLE_EXT` | `ATHLETIC` |
| `COD` / `SPRINT` | change of direction / sprinting and mechanics | `AP_COD` / `AP_SPRINT` | `ATHLETIC` |
| `CARDIO` / `WARMUP` | cardio / warm-up prep | `COND_AEROBIC` / `WARMUP_PREP` | `ATHLETIC` |
| `CARRY` / `DRAG` / `ARMCARE` | carries / drags / shoulder and arm care | `FUNCTIONAL` / `RECOVERY_ARM_CARE` | `NONE` |

Every resistance record (neck work aside) also fills the **`FOCUS`** slot, which serves the person's Focus muscle 1 and 2 (each gets 1-3 extra weekly sets, COACH-R3 R3-SES-01). Superset pairs are built from slots: knee + pull, hip + push, biceps + rear delts, triceps + side delts, calves + delts (`rules.supersets`), so your pattern also decides which pairs the plan can recommend.

### 4.3 Laterality and plane

- `laterality`: `bilateral`, `unilateral`, `alternating` (counts as unilateral), or `n/a`. For one-side work, **10 reps each side = 1 set** (COACH-ANSWER UNI-01, UNI-07). Laterality feeds the bilateral / unilateral share of the plan, which the coach calls very important.
- `plane`: `sagittal`, `frontal`, `transverse`, `multi` or `n/a`. Biomechanics is the description every exercise carries, not a bucket (CAT-03). The plan reads the plane for the court and combat athletes' frontal / transverse share and to rotate core planes.

### 4.4 Level: load position + skill + stability (and the Davidson zone)

- **Level = skill + stability demand + where the load sits.** Load in front or low = foundational; close to and on the body = intermediate; behind the body or overhead = advanced (COACH-ANSWER CAT-04).
- **A seat, machine or cable makes any position easier**: a seated DB press or a lat pulldown is foundational although it is overhead (CAT-04; COACH-R2 R2-LIB-02).
- **Levels add options and never remove them**; they are a soft default, never a gate (CAT-05). The exercise level is not the client's level (L1-L3 is how much volume; CAT-06).
- **Davidson zone** (from Dr. Pat Davidson's book, as the coach uses it) is a **tag, not a level** (COACH-R2 R2-LIB-02, R2-LIB-03):

| Zone | Position | Rotation bias |
|---|---|---|
| 1, vertical-low | standing, arms down, load low and close | external |
| 2, horizontal | hands in front; knee at hip height (halfway down a squat) | internal, more compressive |
| 3, vertical-high | arms overhead; deep squat | external |

  The plan keeps both biases every week and uses the bias to pick a swap when something hurts. Zones do not apply to plyos (CAT-10); leave the zone out for jumps and for unloaded core work.

### 4.5 Muscles: big vs small, prime mover 1.0, helpers 0.25

- **Big**: quads, glutes, hamstrings, lats / upper back, chest. **Small**: biceps, triceps, side delts, rear delts, calves, forearms, abs (COACH-ANSWER CAT-02). Front delts, traps, adductors and neck are "unplaced": they receive credit but are not filled on their own.
- **Credit per set: the main mover 1.0, each helper 0.25** (VOL-09). The credit comes from the pattern (table in 4.2), not from the slot and not from the numbers you type. His exceptions, all built into the credit classes:
  - hip thrusts and bridges: **glutes 1.0** (hamstrings 0.25); squats, lunges, deadlifts and RDLs give glutes only 0.25 (COACH-R2 R2-VOL-05);
  - **dips: chest 0.5 + triceps 0.5** (LIB-16);
  - **thrusters: quads 1.0 + front delts 0.5 + glutes 0.25** (LIB-14; R2-VOL-05: "that's good math");
  - face pulls (cable or KB) are shoulder work: rear delts 1.0 + side delts 0.25, never the main vertical pull (R2-LIB-04, LIB-10);
  - **KB swings: no muscle credit** (ballistic power reps, R2-VOL-05);
  - leg curls count fully to hamstrings as leg flexion (CAT-09); the lat pull-over counts back 1.0 only (LIB-09).
- **Groups** (COACH-R3 R3-SES-01): the plan counts 2-4 exercises per **group** trained on a day: hips = glutes + hamstrings (an RDL + a hip thrust + a leg curl = 3 hip exercises), shoulders = front + side + rear delts (the model also files traps here, INFERRED). Calves get one exercise x 3 sets per leg day.
- **Rear delts are part of the shoulders group** (COACH-R3 R3-VOL-01): keep crediting `rear_delts` in the record (rows give them 0.25, rear-delt raises 1.0); the plan counts that work inside the shoulders group, and users and coaches can add more rear-delt work.

### 4.6 Equipment and constraint (1-5)

- `equipment.setups_any_of` lists the **set-ups**. Each set-up is a list of implements that are all needed; more than one set-up means alternatives. Example: `[["dumbbell", "bench"], ["kettlebell", "bench"]]`.
- Use only the implement words the compiler knows (`IMPLEMENT_TO_KIT` in `tools/compile/catalog.mjs`): `none any_cardio_mode rope dumbbell kettlebell barbell medball open_space_long open_space_short cable box machine cardio_treadmill cardio_machine step bench weight_bench wall pullup_bar plate plate_low_target hex_bar squat_rack household_object hurdles landmine seal_bench stability_ball ez_bar suspension_trainer dip_station sled sandbag slider jump_rope cones smith dip_belt farmer_handles box_high ssb foam_roller hyper_bench ghd anchor reverse_hyper`. A new kind of equipment is an equipment-model change (`synthesis/10_equipment_model.json` and the intake profiles): open an issue instead.
- **Constraint level** (approved scale, COACH-ANSWER EQ-13):

| Level | Definition | Examples | Suits |
|---|---|---|---|
| 5 | seated machine with back pad, fixed path | leg press, leg extension, machine row, machine chest press, bike | older or frail, pain, high-volume finishers |
| 4 | plate-loaded machine, Smith, chest-supported free weight | pendulum, hack squat, lat pulldown, belt squat, GHD | beginners on pulls, volume clients, older / injured |
| 3 | cable, or free weight supported by a bench or the floor | cable press, DB bench press, glute bridge, floor core | beginners, hypertrophy accessories, pain regressions |
| 2 | standing free weights | front squat, deadlift, standing DB press, push-up, loaded lunges, Olympic lifts | strength main lifts, athletes |
| 1 | bodyweight, ballistic, reactive | pull-ups, pistol, push press, KB swing, all plyos and sprints | athletes, advanced bodyweight skill |

  Older, injured and high-volume clients lean on levels 4-5; athletes' main lifts on 1-2 (`BLAZE_CAMP_BRAIN.md` §8.3).

### 4.7 Axial load: the two spine days

The coach puts the heavy squat and the heavy deadlift on **two different days** (COACH-R2 R2-SES-01). Only these lifts are **counted** spine-loading lifts: barbell back, front, zercher, overhead and Smith squats; barbell or trap-bar deadlifts and RDLs; good mornings. **Not counted**: leg press, belt squat, hip thrust, back extension, reverse hyper, single-leg DB work, Olympic lifts, loaded jumps. Goblet, hack and pendulum squats are a "second-day option if not sore" (R2-SES-02).

- `axial_spinal_load.value`: `none`, `low`, `moderate`, `high` (how much the spine is loaded).
- `axial_spinal_load.spine_day_v1_1`: `class` = "counted spine-loading lift", "second-day option if not sore" or "not counted"; `counts_as_heavy_spine_lift` = true only for the counted list.
- The compiler counts a lift only on a squat or hinge pattern, and the v1.2 amendment layer also counts **any hinge (credit class BHD or UHD, so not a hip thrust or bridge) whose every set-up needs a barbell or a hex bar** (staggered and kickstand stances included, R2-SES-02) unless it is an Olympic lift, a loaded jump or a KB swing. So a new barbell deadlift variation is counted even if you write "not counted".

### 4.8 Athletic tags: ballistic vs plyometric, Receive-Create stage, Olympic family

- **Ballistic** = a longer ground contact or one big effort: squat jumps, box jumps, broad jumps, loaded or hex-bar jumps, medball throws, KB swings. **Plyometric** = short, bouncy, repeated contacts: pogo and ankle hops, hurdle hops, depth jumps, bounds, squirrel jumps, repeated jumps. **Receive** = stick-the-landing drills (COACH-R2 R2-ATH-02). Fill `contact_class_v1_1.value` (`ballistic`, `plyometric`, `receive`) and `athletic_quality.value` (the text must start with the quality: "plyometric (short ground contact, repeated)", "ballistic (longer ground contact, single effort)", "landing (receive force)", "olympic / triple extension", "change of direction", "speed (sprint / sprint drill)", "ballistic (throw)").
- Why it matters: each sport has a plyometric share of its jump and throw work at the end of a block (runners 75 %, pickleball 50 %, swimming 25 % ...; COACH-R2 R2-ATH-01, COACH-R3 R3-ATH-04), and every block starts 15 points more ballistic. The plan counts your exercise on the right side of that share.
- **Receive-Create stages** (R2-ATH-03): 1 Land (stick it), 2 Land & Go (stick, then one jump), 3 Repeat (continuous rebounds). Set `athletic_quality.receive_create_stage.default_stage` to the stage the name implies and `plyo_method` to `receive_and_pause`, `receive_then_create`, `repeated_receive_create` or `create_then_land`. The plan still picks the stage per week (12 weeks: weeks 1-3 / 4-7 / 8-12). Set `unilateral_harder` true for single-leg jumps.
- **Olympic lifts**: `olympic_v1_1.family` = `clean` (knee / squat days), `snatch` (hip / hinge days), `jerk` (either day) or `loaded_jump` (R2-ATH-04). Full squat cleans and snatches use 3-5 reps per set (R2-ATH-05).

### 4.9 Older adults and youth

- **60+ (COACH-R3 R3-ATH-02)**: on by default are landing drills (step down and stick, no bounce), balance, quick stepping without a hop, light medball throws and fast machine work. Off by default, and switchable on with his warning ("Make sure that you have a fitness professional to help you understand what this means"): low ankle hops, other jumps, Olympic lifts, depth jumps. Never: overhead squats and low-bar squats.
  - Set `older_default_excluded.value: true` on every plyo or ankle jump, Olympic lift or derivative, loaded or depth jump and jumping conditioning item. The compiler then sets `older_ok: false` (off by default). Plyometric and Olympic qualities are off by default even if you forget.
  - `older_opt_in_ok` is false only for the never-list tags. Today the compile also keeps depth jumps, high depth drops and snatches locked for 60+ even when switched on (`OLDER_NEVER_PHASE0`, `engine/DECISIONS.md` D-05). R3-ATH-02 approved allowing depth jumps with the warning, so check D-05 for the current state.
- **Pickleball, padel and tennis players aged 50-59** (R3-ATH-02): only low-impact jumps unless switched on; depth jumps, hurdle hops and bounds are avoided (`rules.population.active_aging_50`). Those are found by tags made from the id (section 6).
- **Youth (under 18)**: `youth_ok` is always true; limits come from the level ladder (up to intermediate) and Olympic lifts from the floor from about age 14 after one hang block (R2-ATH-08).
- **Population rules** turn into tags only when the text matches these phrases exactly (use them as written):

| `population_rules[].population` | `rule` starts with / contains | Tag |
|---|---|---|
| "older / injured / high-volume clients" | starts with "preferred" | `older_preferred` |
| "aesthetics / bodybuilding clients" | contains "warm-up only" | `aesthetics_warmup_only` |
| "baseball pitchers" | contains "overhead" | `pitcher_reduce` |
| "boxers / striking athletes in high punching-volume weeks" | (any) | `striker_reduce` |
| "beginners in athletic training / no bumper plates" | (any) | `beginner_olympic` |
| "youth athletes" | contains "floor" | `youth_floor_ok` |
| "athletes already axially loaded that week, or sore" | (any) | `axial_unload` |
| "clients with shoulder or back pain" | (any) | `pain_friendly` |
| "older adults (60+)" | "excluded by default; opt-in with the WARN_60PLUS_POWER_WORK warning" | (documents `older_default_excluded`) |

### 4.10 Dose hint, video, sport use

- `typical_rep_range`: a hint (`value` like "8-12 per side") and a `dose_unit`: `reps`, `reps per side`, `contacts`, `throws`, `seconds`, `reps or seconds`, `time / distance / calories`. The real dose comes from the rules (goal, rep class, stairway week). `seconds` makes it a timed hold.
- `video_urls`: optional (COACH-R2 R2-GEN-02). Leave it empty unless the coach supplies his own video; without one the plan offers a YouTube search link. Third-party videos are not owned by Blaze Camp.
- `sport_use_v1_1`: sports or activities that especially need the exercise ("pickleball", "tennis", "swimming", "general population", "home" ...). It gives a small selection bonus; it never filters.
- `implement_load` (medball items only): `typical_lb` like "8-10". **Never above 20 lb** (EQ-06); no medball in an aesthetics client's main work, warm-up only (ATH-05).

## 5. Field reference

Left: the field you write in `synthesis/02_exercise_catalog.json`. Middle: what the compiler makes of it in `model/catalog.json` (CONTRACTS.md §3.2). Fields the compiler does not read are still part of the record: they document the decision and feed the other model documents.

**Identity and status**

| Source field | Runtime field | What to write |
|---|---|---|
| `id` | `id`, `source_id`, `name_key` | Lowercase kebab-case made from the name, unique, plain gym words. The words matter (section 6). |
| `name` | English name (`exercise.<id>.name`) | Plain gym English, generic and understandable (FIX-03, FIX-04). One short detail may go in brackets: "Landmine Meadows Row (bent-over, one arm)". Brackets that contain "inferred", "not stated", "unconfirmed", "ambiguous", "unclear", "verify" or "listing" are removed from the shown name. |
| `record_type` | `kind` | `exercise` (almost always); `drill` (technique drills), `test`, `conditioning_prescription` (a cardio session, becomes `conditioning`). Other types are dropped. |
| `status` | `status` | New: **`proposed_v1_1`** (the proposed status the compiler and the selector recognise: swaps only). After approval: `added_v1_1`. Existing values: `live_library_selectable` (his BYOP library, can be the main pick), `reference_only` and `program_only` (swaps), `live_library_not_selectable`, `retired` (dropped). |
| `generic` | none | `false`. |
| `aliases`, `placements` | none | `[]`. They hold sheet cells, OBSERVED only. |

**Generator**

| Source field | Runtime field | What to write |
|---|---|---|
| `generator.eligible` | (kept or dropped) | `true`. |
| `generator.pools` | `slots` | The pattern code(s) whose slots it may fill, normally `[pattern_code]`. A jump that also fits the low ankle block: `["PLYO", "ANKLE"]`. |
| `generator.default_candidate` | `default_in_slots` | `false` for a new record. The proposed status forces `[]` anyway. |
| `generator.default_candidate_by_pool` | `default_in_slots` | Optional: default in some pools only (a KB swing is a default only in `TX`). |
| `generator.why` | none | One line, e.g. "PROPOSED addition - swap only until the coach approves it". |

**Classification**

| Source field | Runtime field | What to write |
|---|---|---|
| `taxonomy.family` | `family` | `RESISTANCE`, `ATHLETIC`, `CONTROL`, `CARDIO`, `FUNCTIONAL` (4.1). |
| `taxonomy.pattern_code` | `pattern`, `slots`, `credit_class` | A code from the table in 4.2. |
| `taxonomy.node_01_taxonomy` | `node` | The canonical tree id, e.g. `RP.PL.H.UL`, `AP.JMP.LK`, `CO.CT` (`BLAZE_CAMP_BRAIN.md` §2.3, `synthesis/01_taxonomy.json > nodes`). |
| `taxonomy.region`, `category`, `category_label`, `sub_pattern`, `path`, `pattern_label_verbatim` | none | Copy from a sibling record of the same pattern; `pattern_label_verbatim: null` (it quotes his sheet). |
| `laterality` | `laterality` | `bilateral`, `unilateral`, `alternating`, `n/a` (4.3). |
| `plane` | `plane` | `sagittal`, `frontal`, `transverse`, `multi`, `n/a`. |
| `level.generator_min_level` (+ `primary`, `basis`, `generator_min_level_basis`) | `level` | `foundational`, `intermediate`, `advanced` (4.4). Say why in `basis`. |
| `davidson_zone.zone`, `.rotation_bias` (+ `basis`, `use_v1_1`) | `zone`, `rotation_bias` | 1, 2 or 3; the bias text starts with "external-rotation bias" or "internal-rotation bias". Leave the whole field out for plyos and unloaded core. |
| `muscle_size_class` | `size_class` | `big`, `small`, `mixed`, `n/a` (of the prime mover; descriptive). |
| `exercise_class` | `exercise_class` | `compound`, `isolation`, `athletic`, `control`, `conditioning`, `warmup`, `mobility`. On a horizontal push, `isolation` makes it a fly. |
| `volume_counting` | `counting` | `hypertrophy_sets`, `control_sets`, `contacts`, `throws`, `power_reps`, `conditioning_bouts`, `reps_or_distance`, `warmup_not_counted`, `not_counted`. |

**Muscles and credit**

| Source field | Runtime field | What to write |
|---|---|---|
| `primary_muscles`, `secondary_muscles`, `coach_muscle_groups` | none | Who works (descriptive): e.g. `["lats", "upper_back"]`, `["biceps", "rear_delts"]`, `["BACK"]`. |
| `volume_credit.counts_toward_muscle_volume` | (credit class) | `true` for resistance and core; `false` for athletic, cardio, warm-up. |
| `volume_credit.per_set` | (exceptions only) | His coarse groups with 1.0 / 0.25: `QUADS`, `HAMSTRINGS`, `GLUTES`, `CHEST`, `BACK`, `SHOULDERS/TRAPS`, `BICEP`, `TRICEP`, `CALVES`, `CORE`. The compiler does **not** copy these numbers; it reads them for the exceptions: `GLUTES: 1.0` on a hinge = hip thrust credit; `CHEST: 0.5` + `TRICEP: 0.5` = dips; `SHOULDERS/TRAPS: 0.5` on a squat = thruster; `CHEST: 1.0` alone on a push = a fly. So **write the helpers** on a compound push. |
| `delt_head.value` | (credit class) | Shoulder isolation only: `side`, `rear` or `front`. |
| (computed) | `credit_class`, `credits`, `primary_muscle`, `is_athletic` | From the pattern and the exceptions (4.2, 4.5). |

**Equipment**

| Source field | Runtime field | What to write |
|---|---|---|
| `equipment.setups_any_of` | `equipment.any_of` | Set-ups (4.6). `[["none"]]` = no equipment. |
| `equipment.machine_type` | `equipment.machine` (with the id words) | `null` unless it is a machine; then the machine kind ("leg curl") and the machine words in the id (section 6). |
| `equipment.implements`, `min_access_tier`, `min_access_tier_label`, `household_substitutions`, `substitutes_by_equipment`, `basis` | none | Descriptive. Tiers: 0 "T0 bodyweight + household", 1 "T1 minimal kit ...", 2 "T2 home light weights (DB/KB/medball)", 3 "T3 gym". |
| `no_equipment_ok`, `minimal_kit_ok`, `home_weights_ok` | none | Descriptive booleans. |
| `constraint_level.value` (+ `basis`) | `constraint` | 1-5 (4.6). Default 2. |

**Load and spine**

| Source field | Runtime field | What to write |
|---|---|---|
| `axial_spinal_load.value` | `axial_class` | `none`, `low`, `moderate`, `high`. Missing = `none`. |
| `axial_spinal_load.spine_day_v1_1.counts_as_heavy_spine_lift` | `axial` | `true` only for the counted list (4.7). |
| `axial_spinal_load.spine_day_v1_1.class` | `spine_class` | "counted spine-loading lift", "second-day option if not sore", "not counted". |
| (computed) | `axial_pattern` | `squat` for BKD / UKD, `hinge` for BHD / UHD, else null. |
| `load_ceiling` | `load_ceiling` | `low`, `moderate`, `high`: how heavy it can go. Main-lift slots prefer higher; a block change never swaps to a lower ceiling. |
| `skill_demand` | `skill` | `low`, `moderate`, `high`. |
| `impact_level` | `impact` | `none`, `low`, `moderate`, `high` ("high" in the text adds the `high_impact` tag). |
| `implement_load.typical_lb`, `.max_lb` | `medball` | Medball items only; capped at 20 lb. |

**Athletic** (jumps, throws, Olympic lifts, sprints, COD)

| Source field | Runtime field | What to write |
|---|---|---|
| `athletic_quality.value` | `athletic.quality` | Text starting with the quality (4.8). |
| `contact_class_v1_1.value` | `athletic.contact_class` | `plyometric`, `ballistic`, `receive` (shown as `landing`). |
| `athletic_quality.plyo_method` | `athletic.plyo_method_default` | `receive_and_pause`, `receive_then_create`, `repeated_receive_create`, `create_then_land`. |
| `athletic_quality.receive_create_stage.default_stage` | `athletic.rc_stage_default` | 1, 2, 3 (shown as `RC1`-`RC3`). |
| `athletic_quality.unilateral_harder` | `athletic.unilateral_harder` | `true` for single-leg jumps. |
| `olympic_v1_1.family` | `athletic.olympic_family`, `day_pattern`, `olympic_tier` | `clean`, `snatch`, `jerk`, `loaded_jump`. |
| (computed) | `athletic.count_unit`, `full_catch`, `from_floor`, `loaded_jump` | From the quality and id words. |

**Population**

| Source field | Runtime field | What to write |
|---|---|---|
| `older_default_excluded.value` (+ `population`, `what`, `opt_in`, `warning_key`, `evidence`) | `older_ok` | `true` = off by default for 60+ (4.9). |
| `population_rules[]` | `tags` | Exact phrases (4.9). |
| (computed) | `older_opt_in_ok`, `youth_ok` | 4.9. |

**Dose, media, sport, variation**

| Source field | Runtime field | What to write |
|---|---|---|
| `typical_rep_range.value`, `.dose_unit` | `rep_hint` | 4.10. |
| `video_urls[]` (`url`, `source`) | `video` | Optional; usually `[]`. |
| `coach_cues[]` (`cue`) | `cue_key` and the English cue | Only the coach's own words. A cue also needs a Spanish line in `tools/compile/es/labels.mjs > ES_CUES`. |
| `sport_use_v1_1` | `sport_use` | 4.10. |
| `variation_v1_1.axes` (+ `evidence`) | `variation_axes` | `implement`, `stance`, `grip`, `range`, `which hand holds the weight` (section 2). |

**Evidence and bookkeeping**

| Source field | Runtime field | What to write |
|---|---|---|
| `new_in_v1_1` | `rule_refs` (its `qid`) | `{"kind": "PROPOSED-ADDITION", "qid": "PROPOSED <YYYY-MM-DD>", "evidence": "PROPOSED - PENDING COACH APPROVAL", "why_needed": "<the gap it fills>"}`. |
| `sources` | none | `["PROPOSED - PENDING COACH APPROVAL (contributor addition <date>)"]`. |
| `inferred_fields` | none | The fields you decided yourself (muscles, equipment, level, constraint ...). |
| `notes`, `related` | none | How it is done in one or two lines; the ids of its nearest relatives. |
| (computed) | `tags` | The closed tag list of CONTRACTS.md §3.2.5, made by the compiler (section 6). You cannot set tags by hand. |
| (computed) | `conditioning` | Cardio sessions only (the colour is read from names like "Aerobic A (blue) ..."). |

## 6. Words in the id that change what happens

Several rules read words in the id (`tools/compile/catalog.mjs`: `creditClass`, `slotsFor`, `tagsFor`, `machineFor`, `athleticFor`; `tools/fixture/review-v12.mjs`; `engine/select.mjs` and `engine/dose.mjs`). These are engineering shortcuts (INFERRED), so name the id after what the exercise really is, recompile, and **read the compiled `tags`**. If a tag the exercise needs is missing, change the id only if the new id is still a true name; otherwise ask the maintainers for a compiler rule in a separate pull request. Never patch `model/` by hand.

| Id contains | Effect |
|---|---|
| `band`, `banded`, `chain`, `weight-releaser` | Stripped, renamed or rejected. Don't use them. |
| `v-squat` | Rejected everywhere. |
| `face-pull` | Face pull: rear delts 1.0 + side delts 0.25, shoulder slot, never a vertical pull. |
| `front-raise` | Front-delt credit. |
| `reverse-fly`, `rear-delt`, `t-raise`, `y-raise`, `y-t-raise` | Rear-delt credit. |
| `thruster` | Thruster credit (quads 1.0, front delts 0.5, glutes 0.25). |
| `pullover`, `pull-over` | Lat pull-over: back 1.0 only. |
| `swing` (on a hinge pattern) | KB swing: ballistic, 0 muscle sets, power slot only. |
| `tibialis-raise` | Lower-leg care, no calf credit. |
| `overhead-squat`, `low-bar` | Never for 60+, injured or high-volume clients. |
| `snatch`, `depth-jump` (and the drop-jump family), `high-depth-drop` | Locked for 60+ in the current compile (D-05) and for injured / high-volume clients. |
| `hurdle-hop`, `bound` | Avoided for racket players aged 50-59 unless switched on, and with knee pain. |
| `ankle-hops`, `pogo` | `ankle_hop` tag: preferred in the low ankle block. |
| `dip` (not "hip"), `upright-row`, `skull`, `good-morning`, `bent-over`, `chest-supported` / `seal-` / `machine-row` / `seated-cable-row`, `sumo`, `cossack`, `pistol` / `sissy` / `deep`, `front-squat` / `front-rack` / `clean`, `push-up`, `overhead` | Pain-filter tags (`dips`, `upright_row`, `skullcrusher`, `good_morning`, `bent_over`, `chest_supported`, `sumo`, `cossack`, `deep_knee_flexion`, `front_rack`, `push_up_floor`, `overhead`). Example: neck, upper-back and lower-back pain avoid `bent_over`. |
| `single-arm`, `alternating` (also any DB or KB set-up) | `split_grip` (preferred with shoulder, elbow or wrist pain). |
| `assisted` | Less likely for L2-L3 clients. |
| `barbell` (with no db / kb / ez in the id) | Only the bar set-ups are kept. |
| `wall-ball`, `slam`, `sit-up`, `overhead` (medball items) | The medball kind and its load range. |
| `lateral`, `side`, `zig-zag`, `skater`, `cossack` / `broad`, `forward`, `bound`, `hurdle`, `backward` | Jump direction: lateral / horizontal (anything else counts as vertical), matched to the sport's jump directions. |
| `plank`, `hold`, `hollow`, `dead-hang`, `wall-sit`, `isometric` | Dosed as a timed hold. |
| `plank`, `pallof`, `dead-bug`, `bird-dog`, `hollow`, `suitcase`, `offset`, `anti` | Anti-movement core. |
| `plank`, `crunch`, `sit-up`, `lying`, `supine`, `floor`, `v-up`, `leg-raise`, `hollow`, `dead-bug`, `bird-dog`, `bridge` | Floor core: skipped when the person excludes floor work. |
| `sit-up`, `crunch`, `v-up`, `leg-raise`, `knees-to`, `toes-to` | Trunk flexion: the plan avoids two in one day. |
| `split`, `lunge`, `staggered`, `kickstand` | Split stance: contralateral loading cue on single-leg lower work. |
| `nordic` | Never a Focus filler or a circuit station. |
| `-not-stated`, `-any-kind`, `-any-loading` | Treated as a generic placeholder: last choice. |
| Machine words: `leg-press`, `hack-squat-machine`, `pendulum-squat`, `belt-squat`, `leg-extension-machine`, `seated-leg-curl`, `lying-leg-curl`, `lat-pulldown`, `assisted-pull-up`, `machine-row`, `machine-chest-press`, `seated-machine-shoulder-press`, `hip-thrust-machine` | Which machine (and kit token) a `machine` set-up needs; any other machine counts as a selectorized machine. |

Olympic lifts from the floor and the deep-knee list are also partly fixed lists (`fromFloor` in `athleticFor`, `DEEP_KNEE_IDS` in `review-v12.mjs`). A new lift of that kind needs a maintainer to add it to the list.

## 7. Three worked examples

All three were added to a scratch copy of the repo, compiled and tested (2026-10-09): the compile and `check-model` passed with 0 errors, and after the two pinned numbers were raised (step 8.10) the whole suite passed with 0 failures. They are examples: they are **not** in the catalog.

### 7.1 A resistance exercise: Landmine Meadows Row

A heavy one-arm row on the thick end of a landmine bar, bent over on a staggered stance.

| Lens | Decision | Why |
|---|---|---|
| Duplicate? | No. The library has a bench-supported one-arm DB / KB row, a two-hand barbell bent-over row and a chest-supported row. This one differs in set-up, level and constraint, so it is a new record. | LIB-17; section 2 |
| Family | `RESISTANCE`: it trains a muscle with sets x reps. | CAT-01 |
| Pattern | `HPULL`, horizontal pull, node `RP.PL.H.UL`: slot `RP_HPULL`, plus `FOCUS`. | §4.2 |
| Laterality, plane | `unilateral` (10 reps each arm = 1 set), `sagittal`. | UNI-01, UNI-07 |
| Davidson zone | 2: hands in front, horizontal pull, internal-rotation bias. | R2-LIB-02, R2-LIB-03 |
| Level | `intermediate`: the load hangs low and in front (an easy position), but the lifter stands bent over on a staggered stance with no pad or seat, so balance and hinge skill add a rung. A chest-supported row stays foundational. | CAT-04, R2-LIB-02 |
| Muscles | Back (big) 1.0; biceps 0.25 and rear delts 0.25 as helpers. In the plan the rear-delt credit counts inside the shoulders group. | VOL-09, CAT-02, R3-VOL-01 |
| Equipment, constraint | One set-up `["landmine", "barbell"]`; constraint 2 (standing free weight). | EQ-13 |
| Axial | `low`, "not counted": the load is in the hand, and it is not a squat or hinge lift. | R2-SES-01, R2-SES-02 |
| Id words | `bent-over` gives the `bent_over` tag so neck, upper-back and lower-back pain avoid it. | section 6 |
| Variation axes | `grip`, `stance`, `range`. | R2-LIB-01 |
| Status | `proposed_v1_1`, `default_candidate: false`. | CAT-07 |

Source record (what you append):

```json
{
 "id": "landmine-meadows-row-bent-over",
 "name": "Landmine Meadows Row (bent-over, one arm)",
 "record_type": "exercise",
 "generic": false,
 "status": "proposed_v1_1",
 "aliases": [],
 "placements": [],
 "taxonomy": {
  "family": "RESISTANCE",
  "region": "UPPER",
  "pattern_code": "HPULL",
  "category": "horizontal_pull",
  "category_label": "HORIZONTAL PULL",
  "pattern_label_verbatim": null,
  "sub_pattern": "UNILATERAL",
  "path": "RESISTANCE > UPPER > HORIZONTAL PULL > UNILATERAL",
  "node_01_taxonomy": "RP.PL.H.UL"
 },
 "laterality": "unilateral",
 "plane": "sagittal",
 "level": {
  "primary": "intermediate",
  "basis": "PROPOSED (new record): the load hangs low and in front (an easy position), but the lifter stands bent over on a staggered stance with no pad or seat, so balance and hinge skill raise it one rung (COACH-ANSWER CAT-04; COACH-R2 R2-LIB-02)",
  "generator_min_level": "intermediate",
  "generator_min_level_basis": "primary level; higher-level clients may still pick it (COACH-ANSWER CAT-05)"
 },
 "primary_muscles": ["lats", "upper_back"],
 "secondary_muscles": ["biceps", "rear_delts", "forearms_grip", "obliques"],
 "coach_muscle_groups": ["BACK"],
 "muscle_size_class": "big",
 "exercise_class": "compound",
 "volume_counting": "hypertrophy_sets",
 "equipment": {
  "setups_any_of": [["landmine", "barbell"]],
  "implements": ["landmine", "barbell"],
  "machine_type": null,
  "basis": "PROPOSED (new record)",
  "substitutes_by_equipment": {},
  "min_access_tier": 3,
  "min_access_tier_label": "T3 gym",
  "household_substitutions": []
 },
 "no_equipment_ok": false,
 "minimal_kit_ok": false,
 "home_weights_ok": false,
 "load_ceiling": "moderate",
 "skill_demand": "moderate",
 "impact_level": "none",
 "typical_rep_range": {"value": "8-12 per side", "dose_unit": "reps per side", "basis": "PROPOSED (new record)"},
 "video_urls": [],
 "sources": ["PROPOSED - PENDING COACH APPROVAL (contributor addition 2026-10-09)"],
 "inferred_fields": ["muscles", "equipment", "typical_rep_range", "level", "constraint_level", "davidson_zone", "axial_spinal_load"],
 "notes": ["Bent-over one-arm row on the thick end of a landmine bar; staggered stance, free hand on the front knee."],
 "related": ["single-arm-db-kb-row", "bent-over-barbell-row", "chest-supported-row"],
 "new_in_v1_1": {
  "kind": "PROPOSED-ADDITION",
  "qid": "PROPOSED 2026-10-09",
  "evidence": "PROPOSED - PENDING COACH APPROVAL",
  "why_needed": "a heavy one-arm back row for full-gym clients that is neither bench-supported nor a barbell bent-over row"
 },
 "generator": {"eligible": true, "pools": ["HPULL"], "default_candidate": false, "why": "PROPOSED addition - swap only until the coach approves it"},
 "constraint_level": {"value": 2, "basis": "PROPOSED: standing free weight = level 2 on the approved 1-5 scale (COACH-ANSWER EQ-13)"},
 "volume_credit": {
  "counts_toward_muscle_volume": true,
  "per_set": {"BACK": 1.0, "BICEP": 0.25, "SHOULDERS/TRAPS": 0.25},
  "basis": "COACH-ANSWER VOL-09: 1.0 to the main mover, 0.25 to each helper",
  "set_counting": "one set = both sides (10/10 = 1 set) - COACH-ANSWER UNI-01 / UNI-07"
 },
 "davidson_zone": {
  "zone": 2,
  "rotation_bias": "internal-rotation bias (horizontal: hands in front / knee at hip height; compressive)",
  "basis": "zone PROPOSED for this new record; meaning approved by COACH-R2 R2-LIB-02 (tag only; level from load position, skill and stability)",
  "use_v1_1": "swap selector when something hurts (pick the other bias); both biases every week (COACH-R2 R2-LIB-03)"
 },
 "axial_spinal_load": {
  "value": "low",
  "basis": "PROPOSED: bent-over hold with the load in one hand; not on the back",
  "spine_day_v1_1": {"class": "not counted", "counts_as_heavy_spine_lift": false, "evidence": "COACH-R2 R2-SES-02 (counted: barbell squats, barbell or trap-bar deadlifts and RDLs, good mornings)"}
 },
 "variation_v1_1": {"axes": ["grip", "stance", "range"], "evidence": "COACH-R2 R2-LIB-01 (rule approved); axes PROPOSED"},
 "sport_use_v1_1": []
}
```

What the compiler made of it:

| Runtime field | Value | Meaning |
|---|---|---|
| `credit_class`, `credits` | `HPULL`, `{lats_upper_back: 1, biceps: 0.25, rear_delts: 0.25}` | His row credit, from the pattern. |
| `primary_muscle` | `lats_upper_back` | Back is the prime mover. |
| `slots`, `default_in_slots` | `["FOCUS", "RP_HPULL"]`, `[]` | Swap for any horizontal-pull slot or a back Focus slot; never the main pick yet. |
| `equipment.any_of` | `[["barbell", "landmine"]]` | Needs both; today only the full-gym profiles list a landmine. |
| `zone`, `rotation_bias` | `2`, `internal` | Used to pick a swap for shoulder pain. |
| `tags` | `["barbell", "bent_over", "fixed_grip"]` | Pain filters: avoided with neck, upper-back or lower-back pain (`bent_over`) and with shoulder, elbow or wrist pain (`fixed_grip`). |
| `axial`, `spine_class` | `false`, `not_counted` | Not one of the week's two heavy spine lifts. |
| `older_ok`, `older_opt_in_ok` | `true`, `true` | Allowed for 60+ (it is not power work). |
| `rule_refs` | `["PROPOSED 2026-10-09"]` | Where it came from. |

In the plans: in the dry run it appeared only in the swap lists of the football sample's horizontal-pull slots. One set = both arms.

<details><summary>Full compiled record</summary>

```json
{"id": "landmine-meadows-row-bent-over", "source_id": "landmine-meadows-row-bent-over", "name_key": "exercise.landmine-meadows-row-bent-over.name", "cue_key": null, "kind": "exercise", "family": "RESISTANCE", "pattern": "HPULL", "node": "RP.PL.H.UL", "slots": ["FOCUS", "RP_HPULL"], "default_in_slots": [], "laterality": "unilateral", "plane": "sagittal", "level": "intermediate", "zone": 2, "rotation_bias": "internal", "size_class": "big", "exercise_class": "compound", "counting": "hypertrophy_sets", "credit_class": "HPULL", "credits": {"lats_upper_back": 1, "biceps": 0.25, "rear_delts": 0.25}, "primary_muscle": "lats_upper_back", "equipment": {"any_of": [["barbell", "landmine"]], "machine": null}, "constraint": 2, "axial_class": "low", "axial": false, "spine_class": "not_counted", "axial_pattern": null, "skill": "moderate", "impact": "none", "load_ceiling": "moderate", "is_athletic": false, "athletic": null, "conditioning": null, "medball": null, "older_ok": true, "older_opt_in_ok": true, "youth_ok": true, "tags": ["barbell", "bent_over", "fixed_grip"], "variation_axes": ["grip", "stance", "range"], "rep_hint": {"text": "8-12 per side", "unit": "reps per side"}, "video": null, "status": "proposed_v1_1", "sport_use": [], "rule_refs": ["PROPOSED 2026-10-09"]}
```
</details>

Spanish name row (`tools/compile/es/exercises.mjs`):

```js
  'Landmine Meadows Row (bent-over, one arm)': 'Remo Meadows con landmine, inclinado a un brazo (Meadows Row)',
```

### 7.2 A plyometric: Hexagon Ankle Hops

Quick, low hops on both feet out over each side of a taped hexagon and back to the centre, facing one way the whole time.

| Lens | Decision | Why |
|---|---|---|
| Duplicate? | No. The ankle-hop family has lateral, zig-zag, right-angle and forward / backward hops, but no all-direction hexagon. (A bigger or smaller hexagon would only be a `range` variation.) | LIB-17; section 2 |
| Family | `ATHLETIC`: it trains a quality (quick, stiff ankles), counted in contacts, never muscle sets. | VOL-10 |
| Pattern | `ANKLE` (jumping ankle / limited knee), node `AP.JMP.LK`: slot `AP_JUMP_LIMITED_KNEE`. | §4.2 |
| Laterality, plane | `bilateral`, `multi` (forward, side and back on every trip). | CAT-03 |
| Zone | None: zones do not apply to plyos. | CAT-10 |
| Level | `foundational`: low hops on two feet, no load; the direction change is the only extra demand. | CAT-04 |
| Ballistic or plyometric | `plyometric`: short, bouncy, repeated contacts (ankle hops are on his plyometric list). | R2-ATH-02 |
| Receive-Create stage | Default 3 (Repeat), `repeated_receive_create`. The plan still chooses the stage each week. | R2-ATH-03 |
| Muscles | None credited. The calves work, but athletic work never counts as sets. | VOL-10 |
| Equipment, constraint | `[["none"]]` (tape or chalk); constraint 1 (bodyweight, reactive). | EQ-13 |
| Impact | `low`: no `high_impact` tag. | |
| 60+ | `older_default_excluded: true`: off by default from 60, can be switched on with the warning. | R2-ATH-08, R3-ATH-02 |
| Racket players 50-59 | A low-impact jump with none of the avoided tags (depth jump, hurdle hop, bound): allowed. | R3-ATH-02 |
| Id words | `ankle-hops` gives the `ankle_hop` tag, which the low ankle block prefers. | section 6 |
| Sport use | pickleball, tennis, padel, basketball (a selection bonus, never a filter). | R3-ATH-04 |

Source record:

```json
{
 "id": "hexagon-ankle-hops",
 "name": "Hexagon Ankle Hops",
 "record_type": "exercise",
 "generic": false,
 "status": "proposed_v1_1",
 "aliases": [],
 "placements": [],
 "taxonomy": {
  "family": "ATHLETIC",
  "region": "ATHLETIC",
  "pattern_code": "ANKLE",
  "category": "jumping_ankle",
  "category_label": "JUMPING ANKLE / LIMITED KNEE",
  "pattern_label_verbatim": null,
  "sub_pattern": "JUMPING ANKLE",
  "path": "ATHLETIC > JUMPING ANKLE / LIMITED KNEE > JUMPING ANKLE",
  "node_01_taxonomy": "AP.JMP.LK"
 },
 "laterality": "bilateral",
 "plane": "multi",
 "level": {
  "primary": "foundational",
  "basis": "PROPOSED (new record): low hops on both feet, no load; the direction change each hop is the only extra demand",
  "generator_min_level": "foundational",
  "generator_min_level_basis": "primary level; higher-level clients may still pick it (COACH-ANSWER CAT-05)"
 },
 "primary_muscles": ["calves"],
 "secondary_muscles": ["quads", "glutes", "glute_med", "lower_leg_foot"],
 "coach_muscle_groups": [],
 "muscle_size_class": "small",
 "exercise_class": "athletic",
 "volume_counting": "contacts",
 "equipment": {
  "setups_any_of": [["none"]],
  "implements": ["none"],
  "machine_type": null,
  "basis": "PROPOSED (new record): a hexagon of tape or chalk on the floor, about 60 cm (24 in) a side",
  "substitutes_by_equipment": {},
  "min_access_tier": 0,
  "min_access_tier_label": "T0 bodyweight + household",
  "household_substitutions": []
 },
 "no_equipment_ok": true,
 "minimal_kit_ok": true,
 "home_weights_ok": true,
 "load_ceiling": "low",
 "skill_demand": "moderate",
 "impact_level": "low",
 "typical_rep_range": {"value": "2-3 trips around the hexagon (12-18 contacts)", "dose_unit": "contacts", "basis": "PROPOSED (new record)"},
 "video_urls": [],
 "sources": ["PROPOSED - PENDING COACH APPROVAL (contributor addition 2026-10-09)"],
 "inferred_fields": ["muscles", "equipment", "typical_rep_range", "level", "constraint_level", "athletic_quality"],
 "notes": ["Face one way the whole time; hop out over each side of the hexagon and back to the centre, quick and low."],
 "related": ["bilateral-lateral-ankle-hops", "bilateral-zig-zag-ankle-hops"],
 "new_in_v1_1": {
  "kind": "PROPOSED-ADDITION",
  "qid": "PROPOSED 2026-10-09",
  "evidence": "PROPOSED - PENDING COACH APPROVAL",
  "why_needed": "a multi-direction, low-impact ankle drill for court players (pickleball, tennis, padel)"
 },
 "generator": {"eligible": true, "pools": ["ANKLE"], "default_candidate": false, "why": "PROPOSED addition - swap only until the coach approves it"},
 "constraint_level": {"value": 1, "basis": "PROPOSED: bodyweight reactive = level 1 (COACH-ANSWER EQ-13)"},
 "volume_credit": {
  "counts_toward_muscle_volume": false,
  "per_set": {},
  "basis": "COACH-ANSWER VOL-10: athletic patterns never count toward muscle volume; tracked as contacts"
 },
 "athletic_quality": {
  "value": "plyometric (short ground contact, repeated)",
  "plyo_method": "repeated_receive_create",
  "receive_create_stage": {"default_stage": 3, "default_stage_name": "Repeat", "stages_available": [1, 2, 3], "role": "default_as_named", "evidence": "COACH-R2 R2-ATH-03"},
  "unilateral_harder": false,
  "basis": "COACH-R2 R2-ATH-02 (pogo and ankle hops are plyometric: short, bouncy contacts)"
 },
 "contact_class_v1_1": {"value": "plyometric", "basis": "COACH-R2 R2-ATH-02"},
 "older_default_excluded": {
  "value": true,
  "population": "older adults (60+)",
  "what": "Olympic lifts, plyos and depth jumps are not in a 60+ plan by default",
  "opt_in": "an additional option when the client wants it (or their coach decides), shown with the warning",
  "warning_key": "WARN_60PLUS_POWER_WORK",
  "evidence": "COACH-R2 R2-ATH-08; COACH-R3 R3-ATH-02 (low ankle hops off by default from 60, can be switched on with the warning)"
 },
 "population_rules": [
  {"population": "older adults (60+)", "rule": "excluded by default; opt-in with the WARN_60PLUS_POWER_WORK warning", "evidence": "COACH-R2 R2-ATH-08; COACH-R3 R3-ATH-02"}
 ],
 "variation_v1_1": {"axes": ["range"], "evidence": "COACH-R2 R2-LIB-01 (rule approved); axes PROPOSED"},
 "sport_use_v1_1": ["pickleball", "tennis", "padel", "basketball"]
}
```

What the compiler made of it:

| Runtime field | Value | Meaning |
|---|---|---|
| `credit_class`, `credits`, `is_athletic` | `ATHLETIC`, `{}`, `true` | Never a muscle set. |
| `slots` | `["AP_JUMP_LIMITED_KNEE"]` | The low ankle block. |
| `athletic` | `quality: plyometric`, `contact_class: plyometric`, `plyo_method_default: repeated_receive_create`, `rc_stage_default: RC3`, `count_unit: contacts` | Counted as plyometric contacts in the sport's plyo share (pickleball: 50 % at the end of a block). |
| `tags` | `["ankle_hop", "plyo_repeated"]` | Preferred in the ankle block; avoided with ankle or foot pain (`plyo_repeated`). |
| `older_ok`, `older_opt_in_ok` | `false`, `true` | Off by default from 60; available when switched on with the warning. |
| `rule_refs` | `["PROPOSED 2026-10-09", "R2-ATH-08"]` | Added by the 60+ rule. |

<details><summary>Full compiled record</summary>

```json
{"id": "hexagon-ankle-hops", "source_id": "hexagon-ankle-hops", "name_key": "exercise.hexagon-ankle-hops.name", "cue_key": null, "kind": "exercise", "family": "ATHLETIC", "pattern": "ANKLE", "node": "AP.JMP.LK", "slots": ["AP_JUMP_LIMITED_KNEE"], "default_in_slots": [], "laterality": "bilateral", "plane": "multi", "level": "foundational", "zone": null, "rotation_bias": null, "size_class": "small", "exercise_class": "athletic", "counting": "contacts", "credit_class": "ATHLETIC", "credits": {}, "primary_muscle": null, "equipment": {"any_of": [[]], "machine": null}, "constraint": 1, "axial_class": "none", "axial": false, "spine_class": "not_counted", "axial_pattern": null, "skill": "moderate", "impact": "low", "load_ceiling": "low", "is_athletic": true, "athletic": {"quality": "plyometric", "contact_class": "plyometric", "olympic_family": null, "day_pattern": null, "olympic_tier": null, "full_catch": false, "from_floor": false, "plyo_method_default": "repeated_receive_create", "rc_stage_default": "RC3", "unilateral_harder": false, "loaded_jump": false, "count_unit": "contacts"}, "conditioning": null, "medball": null, "older_ok": false, "older_opt_in_ok": true, "youth_ok": true, "tags": ["ankle_hop", "plyo_repeated"], "variation_axes": ["range"], "rep_hint": {"text": "2-3 trips around the hexagon (12-18 contacts)", "unit": "contacts"}, "video": null, "status": "proposed_v1_1", "sport_use": ["basketball", "padel", "pickleball", "tennis"], "rule_refs": ["PROPOSED 2026-10-09", "R2-ATH-08"]}
```
</details>

Spanish name row:

```js
  'Hexagon Ankle Hops': 'Saltos de tobillo en hexágono (Hexagon Ankle Hops)',
```

### 7.3 A core exercise: Slider Body Saw

A forearm plank with the feet on sliders (or a towel on a smooth floor): the body rocks forward and back from the shoulders while the trunk stays still.

| Lens | Decision | Why |
|---|---|---|
| Duplicate? | No. The forearm plank and the medball rollout exist; the sliding base and longer lever make a harder rung, not a one-detail change. | section 2 |
| Family | `CONTROL` (core). | CAT-08 |
| Pattern | `CT`, core thorax, node `CO.CT`: slots `CT_CORE_THORAX` and `CORE_ANY`. His library files planks under CORE THORAX (OBSERVED), so the body saw follows (INFERRED by analogy). | CAT-08 |
| Laterality, plane | `bilateral`, `sagittal`. | |
| Zone | None (unloaded core). | R2-LIB-02 |
| Level | `intermediate`: a plank (foundational) plus a sliding base and a longer lever. | CAT-04 |
| Muscles | Abs and obliques 1.0 (core sets for the core group). | VOL-17 |
| Equipment, constraint | `[["slider"]]`: the kit token `slider` means "towel or glider on a smooth floor", so it works at home. Constraint 3 (floor core). | EQ-13 |
| Dose | 20-40 s. `plank` in the id makes it a timed hold anyway. | section 6 |
| Variation axes | `range` (how far you saw). | R2-LIB-01 |

Source record:

```json
{
 "id": "slider-body-saw-forearm-plank",
 "name": "Slider Body Saw (forearm plank)",
 "record_type": "exercise",
 "generic": false,
 "status": "proposed_v1_1",
 "aliases": [],
 "placements": [],
 "taxonomy": {
  "family": "CONTROL",
  "region": "CORE",
  "pattern_code": "CT",
  "category": "core_thorax",
  "category_label": "CORE THORAX",
  "pattern_label_verbatim": null,
  "sub_pattern": "CORE THORAX SAGITAL",
  "path": "CONTROL > CORE > CORE THORAX > CORE THORAX SAGITAL",
  "node_01_taxonomy": "CO.CT"
 },
 "laterality": "bilateral",
 "plane": "sagittal",
 "level": {
  "primary": "intermediate",
  "basis": "PROPOSED (new record): a forearm plank (foundational) with a sliding base and a longer lever; more stability demand, one rung up (COACH-ANSWER CAT-04)",
  "generator_min_level": "intermediate",
  "generator_min_level_basis": "primary level; higher-level clients may still pick it (COACH-ANSWER CAT-05)"
 },
 "primary_muscles": ["abs"],
 "secondary_muscles": ["obliques", "front_delts", "serratus", "lats"],
 "coach_muscle_groups": ["CORE"],
 "muscle_size_class": "small",
 "exercise_class": "control",
 "volume_counting": "control_sets",
 "equipment": {
  "setups_any_of": [["slider"]],
  "implements": ["slider"],
  "machine_type": null,
  "basis": "PROPOSED (new record): sliders, or a towel on a smooth floor",
  "substitutes_by_equipment": {},
  "min_access_tier": 0,
  "min_access_tier_label": "T0 bodyweight + household",
  "household_substitutions": ["slider: towel on a smooth floor"]
 },
 "no_equipment_ok": true,
 "minimal_kit_ok": true,
 "home_weights_ok": true,
 "load_ceiling": "low",
 "skill_demand": "moderate",
 "impact_level": "none",
 "typical_rep_range": {"value": "20-40 s of slow saws", "dose_unit": "seconds", "basis": "PROPOSED (new record)"},
 "video_urls": [],
 "sources": ["PROPOSED - PENDING COACH APPROVAL (contributor addition 2026-10-09)"],
 "inferred_fields": ["muscles", "equipment", "typical_rep_range", "level", "constraint_level", "taxonomy.pattern_code"],
 "notes": ["Forearm plank with the feet on sliders; rock the body forward and back from the shoulders while the trunk stays still. Filed CORE THORAX like the forearm plank in the coach's library (INFERRED by analogy, COACH-ANSWER CAT-08)."],
 "related": ["plank-forearm-low-plank", "medball-ab-rollouts-hands-on-medball"],
 "new_in_v1_1": {
  "kind": "PROPOSED-ADDITION",
  "qid": "PROPOSED 2026-10-09",
  "evidence": "PROPOSED - PENDING COACH APPROVAL",
  "why_needed": "a harder anti-extension step after the forearm plank that needs no gym"
 },
 "generator": {"eligible": true, "pools": ["CT"], "default_candidate": false, "why": "PROPOSED addition - swap only until the coach approves it"},
 "constraint_level": {"value": 3, "basis": "PROPOSED: floor core = level 3 (COACH-ANSWER EQ-13)"},
 "volume_credit": {
  "counts_toward_muscle_volume": true,
  "per_set": {"CORE": 1.0},
  "basis": "core control sets (VOL-17: about 2 core exercises a day; core first by default, ATH-11)"
 },
 "variation_v1_1": {"axes": ["range"], "evidence": "COACH-R2 R2-LIB-01 (rule approved); axes PROPOSED"},
 "sport_use_v1_1": []
}
```

What the compiler made of it:

| Runtime field | Value | Meaning |
|---|---|---|
| `credit_class`, `credits` | `CORE`, `{abs_obliques: 1}` | One core set per set. |
| `slots` | `["CORE_ANY", "CT_CORE_THORAX"]` | Thorax core stations and any-core stations. |
| `equipment.any_of` | `[["slider"]]` | Every equipment profile, bodyweight included, lists `slider`. |
| `rep_hint` | `20-40 s of slow saws`, `seconds` | A timed hold. |
| `tags` | `[]` | No tag; the engine still reads `plank` in the id as anti-movement and floor core. |

In the plans: in the dry run it appeared only in the swap list of the core slot of the full-body aesthetics sample. It can sit in the light core opener (2 exercises x 2 sets, first by default) or a core block. On any day the person or coach may switch the core block off (COACH-R3 R3-SES-02), and it is skipped when the person excludes floor work.

<details><summary>Full compiled record</summary>

```json
{"id": "slider-body-saw-forearm-plank", "source_id": "slider-body-saw-forearm-plank", "name_key": "exercise.slider-body-saw-forearm-plank.name", "cue_key": null, "kind": "exercise", "family": "CONTROL", "pattern": "CT", "node": "CO.CT", "slots": ["CORE_ANY", "CT_CORE_THORAX"], "default_in_slots": [], "laterality": "bilateral", "plane": "sagittal", "level": "intermediate", "zone": null, "rotation_bias": null, "size_class": "small", "exercise_class": "control", "counting": "control_sets", "credit_class": "CORE", "credits": {"abs_obliques": 1}, "primary_muscle": "abs_obliques", "equipment": {"any_of": [["slider"]], "machine": null}, "constraint": 3, "axial_class": "none", "axial": false, "spine_class": "not_counted", "axial_pattern": null, "skill": "moderate", "impact": "none", "load_ceiling": "low", "is_athletic": false, "athletic": null, "conditioning": null, "medball": null, "older_ok": true, "older_opt_in_ok": true, "youth_ok": true, "tags": [], "variation_axes": ["range"], "rep_hint": {"text": "20-40 s of slow saws", "unit": "seconds"}, "video": null, "status": "proposed_v1_1", "sport_use": [], "rule_refs": ["PROPOSED 2026-10-09"]}
```
</details>

Spanish name row:

```js
  'Slider Body Saw (forearm plank)': 'Sierra en plancha de antebrazos con deslizadores (Body Saw)',
```

## 8. Step by step: add, recompile, test

All commands run from the repo root.

**8.1 Search for duplicates** (section 2) and decide: variation or new record.

**8.2 Start from a sibling.** Print a record of the same pattern and copy its shape:

```sh
python3 - single-arm-db-kb-row <<'EOF'
import json, sys
for r in json.load(open('synthesis/02_exercise_catalog.json', encoding='utf-8')):
    if r['id'] == sys.argv[1]:
        print(json.dumps(r, indent=1, ensure_ascii=False))
EOF
```

**8.3 Write your record(s)** in a separate file, for example `my-exercises.json`, as a JSON array (one or more records). Fill every field in section 5; label every decision.

**8.4 Append them to the catalog**, keeping the file's exact format:

```sh
python3 - my-exercises.json <<'EOF'
import json, sys
SRC = 'synthesis/02_exercise_catalog.json'
cat = json.load(open(SRC, encoding='utf-8'))
new = json.load(open(sys.argv[1], encoding='utf-8'))
ids = {r['id'] for r in cat}
for r in new:
    assert r['id'] not in ids, 'duplicate id ' + r['id']
    cat.append(r); ids.add(r['id'])
with open(SRC, 'w', encoding='utf-8') as f:
    f.write(json.dumps(cat, indent=1, ensure_ascii=False))  # same format: 1-space indent, UTF-8, no final newline
EOF
git diff --stat synthesis/02_exercise_catalog.json   # only insertions, no deletions
```

**8.5 Add the Spanish name** as one row in `tools/compile/es/exercises.mjs > ES_EXERCISE_NAMES`. The key is the **English name exactly as compiled** (the `name` without removed qualifiers). Neutral Latin American Spanish, the English gym term in brackets, no "the / with / and / single-leg / lunge / squat" left outside the brackets, no "liga / banda / cadena". The line is listed as machine-translated (PROPOSED) until the coach or a coach he trusts approves it (R2-GEN-08).

**8.6 Compile:**

```sh
node tools/compile-model.mjs
```

It prints one summary line. Check that `kept` grew by the number you added and `es_missing` is `0`. Exit code 1 means a contract error and nothing was written.

**8.7 Read your compiled record** and compare it with what you meant (credits, slots, level, equipment, tags, older flags):

```sh
node -e 'const c = require("./model/catalog.json"); console.log(JSON.stringify(c.exercises.find(e => e.id === process.argv[1]), null, 1))' landmine-meadows-row-bent-over
```

**8.8 Run the contract checks:**

```sh
node tools/check-model.mjs        # its summary line must say "errors":0
```

**8.9 Rebuild the reference fixture** so it keeps every active record:

```sh
node tools/fixture/build-fixture.mjs && node tools/fixture/check-fixture.mjs
git diff --stat engine/fixtures/
```

Only your records (plus the fixture's manifest) should change. If anything else changes, stop and tell the maintainers: the fixture was out of date before your change.

**8.10 Update the pinned numbers.** `tests/compile.test.mjs` pins the number of kept exercises (731 in v1.2; three places in the "counts" test) and of machine-translated Spanish lines (861 in v1.2). Raise each by the number you added. Also update the exercise counts quoted in `README.md` and `engine/README.md` if they changed.

**8.11 Run the whole suite:**

```sh
node --test tests/                # 0 failures; a few tests are marked "todo" on purpose
```

**8.12 Regenerate the sample plans and read the diff:**

```sh
node tools/generate-samples.mjs   # every sample must say ok
git diff --stat samples/plans/
```

A PROPOSED record can only appear in `swaps` lists. If a main pick changed, something in the record is wrong (most often the status).

**8.13 Open the pull request** with: what you added and why (the gap it fills); the lens table for each exercise (like section 7); the evidence labels; the commands you ran and their results; the swap-list changes in the samples. Keep the PR data-only: catalog record, Spanish row, regenerated `model/`, fixture and samples, pinned numbers. Compiler or engine changes go in a separate PR.

## 9. When the coach approves (or says no)

The maintainers collect PROPOSED additions into the next round of questions for the coach (like `round3_questions.json` and `coach-questions.html`). His answer is recorded in a new `coach_answers_round<N>.md`.

- **Approved:** set `status` to `added_v1_1` and `generator.default_candidate` to `true`; in `new_in_v1_1` set `kind: "coach-approved addition"`, `qid` = his answer id, `evidence: "COACH-R<N> <id>"`; replace PROPOSED with his id in every basis he confirmed. Recompile and test: now `default_in_slots` is filled and sample plans may change their main picks, so read that diff. The Spanish name stays in review until he or a coach he trusts approves it.
- **Changed:** apply his corrections to the fields and say so in the basis lines.
- **Rejected:** set `status` to `retired` (the compiler drops it; the record stays so old references resolve), remove the Spanish row and lower the pinned numbers again.

## 10. Checklist

- [ ] Searched for duplicates; this is a new exercise, not a one-detail variation.
- [ ] `id`: unique kebab-case, plain words; no band or V-squat words; section 6 checked.
- [ ] `name`: plain, generic gym English.
- [ ] `status: proposed_v1_1`, `generator.eligible: true`, `generator.default_candidate: false`, `generator.pools` set.
- [ ] Family and pattern from section 4.1 and 4.2; node set.
- [ ] Laterality and plane.
- [ ] Level from load position + skill + stability (seat, machine or cable = easier), with a basis line.
- [ ] Davidson zone and bias for loaded non-plyo work (none for plyos and unloaded core).
- [ ] Muscles: prime and helpers listed; `per_set` written with the helpers; any exception (hip thrust, dips, thruster, face pull, KB swing) intended.
- [ ] Equipment set-ups from the known implement words; constraint 1-5.
- [ ] Axial load and spine class (counted only for the approved list).
- [ ] Athletic work: contact class, quality text, Receive-Create stage, plyo method, `unilateral_harder`, Olympic family if any; `counts_toward_muscle_volume: false`.
- [ ] 60+: `older_default_excluded` for every jump, Olympic lift and jumping conditioning item; population phrases exact.
- [ ] No bands anywhere; medball loads 20 lb or less.
- [ ] `variation_v1_1.axes` only from implement, stance, grip, range, which hand holds the weight.
- [ ] No coach cue unless the coach wrote it; video optional.
- [ ] Evidence: `sources`, `inferred_fields`, `new_in_v1_1` filled; every decision labelled.
- [ ] Spanish name row added.
- [ ] `node tools/compile-model.mjs` (kept +N, `es_missing` 0), compiled record read and correct.
- [ ] `node tools/check-model.mjs`: 0 errors.
- [ ] Fixture rebuilt; only your records changed.
- [ ] Pinned numbers raised; README counts updated.
- [ ] `node --test tests/`: 0 failures.
- [ ] Samples regenerated: all ok; the record appears only in swap lists.
- [ ] PR description with the lens table, labels and results.

## 11. Troubleshooting

| You see | What it means | Fix |
|---|---|---|
| `Error: unmapped implement X in <id>` (the compiler stops) | An implement word the compiler does not know. | Use a word from section 4.6, or open an issue for a new kind of equipment. |
| `compile-model: N contract error(s); nothing written` | A shape or rule check failed (band word, duplicate id, bad value ...). | Read the `ERROR` lines; fix the record. |
| Test "counts: 731 kept ..." fails with `734 !== 731` | The pinned exercise count. | Step 8.10. |
| Test "i18n: every key used has EN and ES ..." fails with `864 !== 861` | The pinned machine-translated count. | Step 8.10. |
| `es_missing` above 0, or a missing `exercise.<id>.name` key | No Spanish row, or its key differs from the compiled English name. | Copy the English name from `model/i18n/en.json` as the key. |
| Test "Spanish exercise names ..." fails | English words left outside the brackets, or the Spanish equals the English. | Rewrite the Spanish name. |
| `model/ is stale: run node tools/compile-model.mjs` | `model/` does not match the sources. | Recompile and commit the regenerated files. |
| A plan's main pick changed after adding a PROPOSED record | The record is not swap-only. | Check `status: proposed_v1_1` and `default_candidate: false`. |
| Credits are not what you expected | The pattern or an exception decided it. | Check section 4.2, the `per_set` exceptions and the id words (`face-pull`, `thruster`, `pullover`, `swing` ...). |
| A tag is missing or unwanted | Tags come from the id, the pattern, the equipment and the population phrases. | Section 6; ask for a compiler rule if the id cannot carry the word. |
| `git diff` shows the whole catalog changed | The file was re-saved with another serializer. | Restore it and use the script in step 8.4. |
