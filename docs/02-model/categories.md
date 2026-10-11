# Categories: how every exercise is sorted

This page explains the coach's categorization, which he called "the hardest thing to understand" (chat). Every exercise carries all of its labels at once: a **family** (what quality it trains), a **pattern** (the movement), a **laterality** (two sides together or one side at a time), a **plane** (the direction of the movement), a **muscle size class** (big or small), the muscles it counts for, its equipment and its level. Two late decisions sit on top of that: muscles are counted in **focus groups** (hips = glutes + hamstrings, shoulders = front + side + rear delts), and a person can choose a **Focus muscle 1** and a **Focus muscle 2**. The page gives each rule, the coach's reason in his own words, and the file and JSON key where it lives.

**How to read the tags.** `CAT-01`, `VOL-10` and similar = his round-1 answers (`coach_answers_full.md`). `R2-...` = round 2 (`coach_answers_round2.md`). `R3-...` = round 3 (`coach_answers_round3.md`). `R4-...` = round 4 (`coach_answers_round4.md`), the newest questionnaire round. `CT-01` and `CX-01..04` = two clarifications he gave on 2026-10-10 (session time; progression and editing). The newest answer wins on its subject. "chat" = things he said in conversation (`coach_chat_statements.md`, `coach_answers.md`). Those files paraphrase him closely, so only the words they put in quotation marks are quoted here. **OBSERVED** = read from his sheets. **INFERRED** = our reading. **PROPOSED** = our design, not confirmed by him.

**Short forms.** DB = dumbbell. KB = kettlebell. RDL = Romanian deadlift. COD = change of direction. BYOP = his "BUILD YOUR OWN PROGRAM" workbook, which holds the MASTER EXERCISE LIBRARY.

Related pages: [levels-and-zones.md](levels-and-zones.md), [exercise-library.md](exercise-library.md), [equipment.md](equipment.md), [volume.md](volume.md), [bilateral-unilateral.md](bilateral-unilateral.md), [sessions.md](sessions.md), [athletes.md](athletes.md). His answers on this topic, question by question: [../03-coach-answers/categorization.md](../03-coach-answers/categorization.md). Terms: [../05-reference/glossary.md](../05-reference/glossary.md).

Decision records: [tag every exercise on all lenses](../04-decisions/adr-011-tag-every-exercise-on-all-lenses.md), [leg flexion as its own segment](../04-decisions/adr-014-leg-flexion-own-segment.md), [rear delts are part of shoulders](../04-decisions/adr-018-rear-delts-part-of-shoulders.md), [floor of 10 on focus groups](../04-decisions/adr-017-floor-of-10-on-focus-groups.md), [Focus muscle 1 and 2](../04-decisions/adr-024-focus-muscle-1-and-2.md), [athletic work never counts as muscle sets](../04-decisions/adr-020-athletic-work-never-counts-as-muscle-sets.md), [no sex field](../04-decisions/adr-004-no-sex-field.md).

---

## 1. The rule: every exercise is tagged on all lenses at once

**Rule.** An exercise is not filed in one box. It gets one value on every lens, so a plan can be cut by any of them.

Example: **Goblet Squat** = resistance pattern (RP) · bilateral · knee dominant · quads (big muscle) · sagittal · foundational.

**Why.** We asked him if this was the right way to tag. He said: "Yes, this is the whole taxonomy of each exercise. This is very important because then we can segment by whatever we need in different families, in different segments, different variables. This is huge." (CAT-01)

| Lens | What it answers | Values | Section |
|---|---|---|---|
| Family | What quality is trained, and how is it counted? | Athletic (AP), Resistance (RP), Control / core (CT, CP), Cardio, Functional | 2 |
| Pattern | Which movement is it? | knee dominant, hip dominant, leg flexion, push, pull, and so on | 4 |
| Laterality | Two sides together, or one side at a time? | bilateral, unilateral, alternating | 5 |
| Plane | In which direction does it move or resist? | sagittal, frontal, transverse, multi | 6 |
| Muscle size | Big muscle or small muscle? | big, small | 7 |
| Muscles credited | Which muscles get the set? | main mover 1.0, helpers 0.25 | [volume.md](volume.md) |
| Focus group | Which group does the set count in? | quads, hips, back, chest, shoulders, biceps, triceps, calves, core | 8 |
| Equipment and constraint | What is needed, and how much does it guide you? | implement + constraint 1-5 | [equipment.md](equipment.md) |
| Level | How hard is the movement to do well? | foundational, intermediate, advanced | [levels-and-zones.md](levels-and-zones.md) |

**Where it lives.** Rule: `generator_spec_v1.json > rule_tables.taxonomy.all_lenses`. Category tree: `synthesis/01_taxonomy.json > nodes` (91 nodes). Extra descriptors, called facets: `synthesis/01_taxonomy.json > facets` (47 facets, 255 values). Each exercise record: `synthesis/02_exercise_catalog.json`, fields `taxonomy`, `laterality`, `plane`, `muscle_size_class`, `volume_credit`, `equipment`, `constraint_level`, `level`. Master text: `BLAZE_CAMP_BRAIN.md` §2.

---

## 2. Families: AP, RP, CT-CP, cardio, functional

**Rule.** The family says what a piece of work is for and how it is counted. A plan never mixes the counting units: resistance work is counted in sets per muscle, athletic work is not.

| Family (his sheet label) | His code | Model id | What it trains | How it is counted | Active records |
|---|---|---|---|---|---|
| Athletic patterns ('ATHLETIC') | AP | `AP` | a quality: speed, power, being reactive, change of direction | contacts, throws, power reps, cuts, metres. **Never muscle sets.** | 239 |
| Resistance patterns ('RESISTANCE') | RP | `RP` | a muscle | sets x reps, 1-3 reps in reserve, counted per muscle | 299 |
| Control patterns ('CONTROL') = core | CT (core thorax), CP (core pelvis) | `CO` with `CO.CT`, `CO.CP`, `CO.CB` (both) | the trunk | core sets (abs and obliques) | 83 |
| Cardio ('CARDIO') | none | `CA` | the aerobic system and conditioning | sessions and bouts, by colour: Blue (A, short and hard), Green (B, moderate), Orange (C, long and easy), plus lactate clearance | 84 |
| Functional ('FUNCTIONAL') | none | `FN` | carries, drags and the sling systems | carries as core sets and drags by distance (both PROPOSED) | 27 |

"Active records" = exercise-like records in the catalog today (732 in all). See [exercise-library.md](exercise-library.md).

**Terms.**
- **Athletic pattern (AP):** work done for speed or power, such as jumps, medball throws, Olympic lifts, sprints and change of direction.
- **Resistance pattern (RP):** lifting to load a muscle.
- **Control pattern (CT, CP):** core work. His sheet calls the family 'CONTROL'.
- **Reps in reserve (RIR):** how many more clean reps you could have done when you stopped.

**Why.**
- These are his own buckets. He named the lenses as athletic patterns, resistance patterns and core (chat, paraphrased), and row 4 of his MASTER EXERCISE LIBRARY labels each exercise column 'ATHLETIC', 'RESISTANCE', 'CONTROL', 'CARDIO' or 'FUNCTIONAL' (OBSERVED).
- Athletic work is counted apart because of his answer on volume: "I don't believe that Olympic lifts, sprints, throws, and plyos are going to count towards specific muscles because there are so many things happening at so many different levels. I think counting towards muscles is more for resistance patterns, not for athletic patterns. That's important." (VOL-10)
- Kettlebell swings are athletic, not resistance: "kettlebell swings are not glutes. They are hip-dominant, but at the speed they are swinging like that, it doesn't really become a resistance movement-building muscle work." (R2-VOL-05)
- Functional is unfinished in his sheet. He confirmed it should be built out: carries and drags for athletes and general fitness, sling systems for advanced athletes and rehab (LIB-19, approved as proposed). The starter carries and drags in the catalog are PROPOSED.

**What the family decides.**

| | Athletic (AP) | Resistance (RP) | Control (core) |
|---|---|---|---|
| The slot's purpose names | a quality ('SPEED/POWER', 'CHANGE OF DIRECTION') | a muscle ('QUADS', 'BACK') | 'CORE' |
| Counts toward weekly sets per muscle | no (VOL-10) | yes | as core sets |
| Default place in the session | after the core opener, before strength (ORD-03) | after the athletic work | first, as a light opener; movable (ATH-11, R2-SES-03) |

Session order is explained in [sessions.md](sessions.md). The athletic doses are in [athletes.md](athletes.md).

**Where it lives.** `synthesis/01_taxonomy.json > nodes` (ids `AP`, `RP`, `CO`, `CA`, `FN`); each catalog record's `taxonomy.family`; `generator_spec_v1.json > rule_tables.taxonomy` and `rule_tables.counting`. In the compiled model: `model/catalog.json > exercises[].family` (generated, do not edit).

---

## 3. Biomechanics is the description, not a bucket

**Rule.** There is no "biomechanics" list of exercises. Biomechanics is the set of descriptors every exercise carries: plane, laterality, where the load sits, stance, range of motion and position zone.

**Why.** "No, biomechanics is just the definition of the whole thing, but it doesn't necessarily have its own bucket of exercises." (CAT-03)

**Where it lives.** `generator_spec_v1.json > rule_tables.taxonomy.biomechanics`; the descriptors are the facets in `synthesis/01_taxonomy.json > facets` (for example `F.LAT`, `F.PLANE`, `F.LOADPOS`, `F.STANCE`, `F.ROM`, `F.DZONE`).

---

## 4. Patterns

**Rule.** Inside a family, exercises are listed in one of two ways:

- **Big muscles, all athletic work and all core work are listed by pattern** (the movement).
- **Small muscles are listed by muscle** (one list each: side raises, biceps, triceps, calves).

**Why.** This is how his library is built (OBSERVED: the pattern columns have level blocks and bilateral / unilateral lanes; the small-muscle columns are one plain list each). He confirmed which muscles are big and which are small (CAT-02, section 7).

### 4.1 Resistance patterns for big muscles

| His label (verbatim) | Catalog code | Node id | What is in it | Active records |
|---|---|---|---|---|
| 'BILATERAL KNEE DOMINANT' | `BKD` | `RP.KD.BS` | squats, leg press, hack squat, belt squat | 41 |
| 'UNILATERAL KNEE DOMINANT' | `UKD` | `RP.KD.UL` | lunges, split squats, step-ups, single-leg squats | 21 |
| 'LEG EXTENSIONS' | `KEXT` | `RP.KD.ISO` | leg extension | 2 |
| 'BILATERAL HIP DOMNANT' (his spelling) | `BHD` | `RP.HD.BS` | deadlifts, RDLs, good mornings, hip thrusts, bridges, back extensions | 27 |
| 'UNILATERAL HIP DOMINANT' | `UHD` | `RP.HD.UL` | single-leg hinges and single-leg bridges | 12 |
| 'LEG CURLS', now **LEG FLEXION** | `KFLEX` | `RP.LF` | leg curls, Nordics, slider and ball curls | 9 |
| 'HORIZONTAL PULL' | `HPULL` | `RP.PL.H` | rows | 31 |
| mid-range pull (added in round 4; not a header in his sheets) | `MRPULL` | `RP.PL.M` | high row, 45-degree row, the face-pull angle. Two row records, both optional add-ons (**PROPOSED** records). | 2 in the compiled library |
| 'VERTICAL PULL' | `VPULL` | `RP.PL.V` | pulldowns, pull-ups, lat pull-over | 25 |
| 'HORIZONTAL PUSH' | `HPUSH` | `RP.PU.H` | bench press, push-ups, flies, dips | 30 |
| 'MID RANGE PUSH' (reference tab only) | `MRPUSH` | `RP.PU.M` (PROPOSED node) | incline press, landmine press, viking press. Preferred over overhead pressing for bodybuilders and the general population (R4-LIB-03). | 5 |
| 'VERTICAL PUSH' | `VPUSH` | `RP.PU.V` | overhead presses, push press | 27 |

**Terms.**
- **Knee dominant (KD):** the knee does most of the bending: squats and lunges. Counts for quads.
- **Hip dominant (HD):** the hip does most of the bending: hinges, thrusts, bridges. Counts for hamstrings, or for glutes on thrusts and bridges.
- **Leg flexion:** bending the knee against load: leg curls. It has its own segment.
- **Horizontal / vertical:** the direction of an upper-body push or pull. A row is a horizontal pull. A pulldown is a vertical pull.
- **Mid-range:** an angle between horizontal and vertical. An incline press is a mid-range push. A high row is a mid-range pull. He approved the mid-range pull as "its own small category between horizontal and vertical pull" (R4-LIB-03).

**Three decisions worth knowing.**

1. **Leg curls are not hip dominant.** "No, they shouldn't go in the hip-dominant movements. They should go in more of a flexion of the leg, kind of like bicep curls, which are a little bit different, but we should find the right segmentations for them." (CAT-09) So leg curls, Nordics and slider or ball curls form the LEG FLEXION segment. They count fully for hamstrings. They never count as the hinge of the day. One of his own tabs already used the words 'LEG FLEXION' (OBSERVED, Sheet25).
2. **Kettlebell swings are not a hip-dominant resistance exercise.** His sheet lists them in the hip-dominant column. In the model they are ballistic power reps with no muscle credit (R2-VOL-05). They fill the triple-extension / ballistic slot (that placement is INFERRED).
3. **Push press and push jerk can play two roles.** In the vertical-push slot they count for shoulders. In the triple-extension slot they are power reps and count for no muscle. This is our application of VOL-10 (INFERRED). He was not asked about the two roles.

**A note on node ids.** The node column gives the id in `synthesis/01_taxonomy.json`. The catalog was not re-issued after the taxonomy. Its nine leg-flexion records still carry the retired id `RP.HD.ISO` in `taxonomy.node_01_taxonomy`. That id resolves to `RP.LF` (section 10). Many catalog records also carry a finer child id, such as `RP.PL.H.BS` or `AP.TEX.PULL`. The record counts on this page are by catalog code (`taxonomy.pattern_code`).

### 4.2 Resistance lists for small muscles

| His label (verbatim) | Catalog code | Node id | What is in it | Active records |
|---|---|---|---|---|
| 'SIDE RAISES' (program slot 'ABdution') | `SHLD` | `RP.SM.DELT` | side raises and upright rows (9), rear-delt work incl. face pulls (10), front raises (4) | 23 |
| 'BICEP' | `BIC` | `RP.SM.BI` | curls | 21 |
| 'TRICEP' | `TRI` | `RP.SM.TRI` | extensions, pushdowns | 15 |
| 'CALVES' | `CALF` | `RP.SM.CALF` | calf raises | 8 |
| (none) Neck | `NECK` | `RP.SM.NECK` | 2 neck exercises for collision and grappling sports. **PROPOSED**, no muscle credit. | 2 |

**KB face pulls are shoulder work.** His sheet had 'KB Face Pulls' under VERTICAL PULL. He moved it: "move to side/rear delts/traps but its all to be done on either pull or push days mainly on shoulders or pull days on our program but can be adjusted, i would categorize this as a shoulder work but shoulder work is complicated" (LIB-10). Round 2 approved it as a rear-delt option and a swap only, never the main vertical pull (R2-LIB-04).

### 4.3 Athletic patterns

| His label (verbatim) | Catalog code | Node id | What is in it | Counted in | Active records |
|---|---|---|---|---|---|
| 'TRIPPLE EXTENSION' (his spelling) | `TX` | `AP.TEX` | Olympic lifts and pulls, DB / KB snatches and cleans, hex-bar jump, jerks | power reps | 40 |
| 'PLYOS' ('PLYO', 'FULL JUMPING') | `PLYO` | `AP.JMP` | landings, box jumps, hurdle hops, depth jumps, loaded jumps, plyo push-ups | contacts | 83 |
| 'JUMPING ANKLE' | `ANKLE` | `AP.JMP.LK` | ankle hops and other limited-knee jumping | contacts | 13 |
| 'THROWING' | `THROW` | `AP.THR` | medball passes, rotations, overhead throws, slams | throws | 41 |
| 'CHANGE OF DIRECTION' | `COD` | `AP.COD` | pre-planned cuts, by turn: 'EASY TURN', 'MOD. TURN', 'HARD TURN' | reps or distance | 17 |
| speed session (no library column) | `SPRINT` | `AP.SPD` | MACH and A-drills, acceleration starts, max-velocity sprint | reps or metres | 10 |
| 'DYNAMIC MEDBALL WARMUP DRILLS' | `WARMUP` | `X.PREP` | medball warm-up drills | not counted | 35 |

**Terms.**
- **Triple extension:** ankle, knee and hip straightening together, as in a jump or an Olympic lift.
- **Plyometric vs ballistic:** plyometric = short, bouncy ground contacts. Ballistic = a longer contact or one big effort. The split by sport is in [athletes.md](athletes.md).
- **Change of direction (COD):** planned cutting drills. Reactive agility is a separate, still empty node (`AP.AGI`; the one drill in it is PROPOSED).

Notes:
- Speed is a library category, with a fixed order inside the speed session: squirrel jumps, then MACH drills or acceleration starts, then max velocity (LIB-21, approved as proposed).
- The football route names in the COD list (FADE, SLANT, POST ...) are for every athlete, tiered by turn angle (ATH-06).
- A-drills are warm-up. They never count as athletic volume (ORD-08).

### 4.4 Core: thorax, pelvis, both

**Rule.** Core work is sorted by which part moves.

| Segment | His label | Node id | Rule | Examples | Active records |
|---|---|---|---|---|---|
| Thorax | 'CORE THORAX' (CT) | `CO.CT` | the trunk moves on a still pelvis | crunch, Russian twist | 30 |
| Pelvis | 'CORE PELVIS' (CP) | `CO.CP` | the pelvis and legs move on a still trunk | leg raise | 26 |
| Both | 'BOTH' | `CO.CB` | both move, or both brace, at once | V-up | 25 |

Each can be done in any plane, held still (static) or moving (dynamic). Two more records are generic entries ("core, coach's choice"), which makes 83 core records.

**Why.** "The rule is deciding the trunk on core, or the pelvis on core. Those are two different things. Then both at the same time, and then you can do those in different planes of movement and all of that stuff too." (CAT-08) He also said toes to bar and Copenhagen planks "are a little bit more complicated". Their placement in the model is PROPOSED: toes to bar and hanging knees to chest in core pelvis, Copenhagen plank in "both" (frontal, static, with adductor credit).

In his sheet the core columns are ordered by plane: sagittal = 'EASY', frontal = 'MODERATE', transverse = 'HARD' (OBSERVED). The model keeps that only as a default order, because he calls levels "still very theoretical" (CAT-05).

### 4.5 Cardio and functional

| Family | Sub-buckets | Node ids | Status |
|---|---|---|---|
| Cardio | A / Blue (short, high intensity), B / Green (moderate), C / Orange (long, low intensity), lactate clearance, buy-out finishers, mixed workouts, circuits | `CA.A`, `CA.B`, `CA.C`, `CA.LC`, `CA.BUY`, `CA.WOD`, `CA.CIRC` | OBSERVED (AEROBIC CAPACITY CHEAT SHEET). Any cardio tool can be used (EQ-14). |
| Functional | carries, drags | `FN.CARRY`, `FN.DRAG` | headings in his sheet with no exercises. 9 starter records PROPOSED, plus 1 PROPOSED sled rope pull. |
| Functional | anterior oblique system (chops, Pallof holds, planks with something squeezed between the knees) | `FN.AOS` | 9 library items (OBSERVED); no program slot reads them yet |
| Functional | posterior oblique system, lateral subsystem | `FN.POS`, `FN.LSS` | empty headings |
| Functional | arm care and mobility (shoulder external rotation, scapular push-up, dead hang ...) | catalog code `ARMCARE` | 8 records; the bucket is INFERRED and 5 of the records are PROPOSED; not counted |

**Where patterns live.** `synthesis/01_taxonomy.json > nodes`; `synthesis/01_taxonomy.json > library_column_map` (his sheet column for each node); each catalog record's `taxonomy.pattern_code` and `taxonomy.node_01_taxonomy`; program slots to nodes: `BLAZE_CAMP_BRAIN.md` §2.4. Decisions on single items: `generator_spec_v1.json > rule_tables.library_decisions`.

---

## 5. Laterality: bilateral and unilateral

**Rule.** Every exercise says whether both sides work together or one side works at a time.

| Value | Meaning | His label | Active records |
|---|---|---|---|
| bilateral | both sides together, evenly | 'BILATERAL', 'BILATERAL SYMMETRICAL' (BS) | 414 |
| unilateral | one side at a time | 'UNILATERAL' (UL) | 143 |
| alternating | sides take turns inside the set | (alternating in the name) | 73 |
| n/a | does not apply (most cardio) | | 101 |

One more record is tagged "either". Total 732.

**Counting.** A set of one-side work covers both sides: "So when I say 10/10, it means 10 on each leg." (UNI-01) So 3 x 10/10 = 3 sets, not 6. An alternating exercise counts the same way (UNI-07, approved as proposed).

**Why it matters.** He called the bilateral vs unilateral volume relationship "very important" (chat), and gave the reason: "the unilateral work is more for health and keeping rotational foundations, and the bilateral is more for driving and creating forces." (UNI-02) The share of each (from 90/10 to 10/90, by type of client and by phase) is a dial of the plan, not a property of the exercise. It is explained in [bilateral-unilateral.md](bilateral-unilateral.md).

### Which hand holds the weight: contralateral and ipsilateral

On one-leg work there is a second question: which hand holds the load.

| Term | Meaning | His sheet label | What it does, in his words (CAT-13) |
|---|---|---|---|
| **Contralateral** | the weight is in the hand opposite the working leg | 'GET INTO THE HIP' | "Contralateral exercises are usually to pull me into the hip" |
| **Ipsilateral** | the weight is in the hand on the same side as the working leg | 'GET OUT OF THE HIP' | "To get out, that right hand is going to help me get pulled out of the hip." |

When he uses each (CAT-13): mostly for change-of-direction athletes (football route runners, soccer, basketball, tennis), who must get in and out of the hip fast. Ipsilateral step-ups for sprinters, to drive out of the hip. For powerlifters and bodybuilders, both are accessory work to keep the hips and lower back healthy, more in the first weeks of a program. There is no global default between the two. The percentages in the model for this split are PROPOSED.

This choice is also one of the "one-detail" changes the plan may make between blocks. See [exercise-library.md](exercise-library.md).

**Where it lives.** Catalog record `laterality`; facets `F.LAT` (stance) and `F.LOADLAT` (which hand holds the load) in `synthesis/01_taxonomy.json > facets`; counting rule `generator_spec_v1.json > rule_tables.counting`; the share `rule_tables.bilateral_unilateral`; contralateral and ipsilateral use `rule_tables.contra_ipsi`.

---

## 6. Planes

**Rule.** Every exercise has a plane.

| Plane | Plain meaning | His spelling | Active records |
|---|---|---|---|
| sagittal | forward and back, up and down (squat, lunge, press) | 'SAGITAL' | 543 |
| frontal | side to side (lateral lunge, side plank) | 'FRONTAL' | 45 |
| transverse | rotation (rotational throw, chop) | 'TRANSVERSE' | 82 |
| multi | more than one | | 41 |
| n/a | does not apply | | 21 |

**How the plan uses it.**
- Core can be done in every plane: "you can do those in different planes of movement" (CAT-08). The plan rotates the planes of the core opener across the week. That rotation is our application (INFERRED).
- Court and combat athletes get more frontal and transverse one-leg work (lateral lunges, cossacks, lateral step-ups, rotational lunges) than aesthetics clients (UNI-12, approved as proposed). The numbers for that share are PROPOSED.
- He approved adding the frontal and transverse lower-body moves from his reference tab to the main library, for court and combat athletes (LIB-20, approved as proposed: he marked our wording RIGHT). The rotating-strap squats from that tab were removed (LIB-09).

**A reading note (INFERRED).** In his reference tabs, "plane" often means the direction of the force you must resist, not only the direction you move. A normal squat with something squeezed between the knees is filed under 'BILATERAL FRONTAL'. The catalog stores one `plane` per record. Storing "plane of motion" and "plane of demand" as two fields is an open, low-priority idea.

**Where it lives.** Catalog record `plane`; facet `F.PLANE` in `synthesis/01_taxonomy.json > facets`. His spelling is kept when his sheets are quoted and corrected in everything a user sees (FIX-04).

---

## 7. Bigger muscles and smaller muscles

**Rule.**

| Class | Muscles | Source |
|---|---|---|
| **Big** | quads, glutes, hamstrings, lats / upper back, chest | CAT-02 (RIGHT) |
| **Small** | biceps, triceps, side delts, rear delts, calves, forearms, abs | CAT-02 (RIGHT) |
| Not placed by him | front delts, traps, adductors, neck | **PROPOSED**: front delts small (credit only), traps small, adductors big (credit only), neck small |

**What the size class changes.**

| It changes | How | Source |
|---|---|---|
| How the library is listed | big muscles by pattern, small muscles by muscle (section 4) | OBSERVED; CAT-02 |
| The usual rep range | small muscles 12-30 reps, big muscles 5-15 mixed | VOL-11; chat (paraphrased: smaller muscles take more reps because you can't go heavy, bigger muscles take a mix) |
| The starting weekly sets | shoulders, biceps and triceps start a little lower than big muscles | R2-VOL-04; numbers in [volume.md](volume.md) |

**What it does not change.** The weekly increase. We had guessed 3 % for big muscles and 7 % for small. He corrected it: "It doesn't really go by muscle, so this is not a big muscle thing or small muscle thing. It's just more on what's going on with the person." (VOL-05) Size-based percentages are retired. Every plan now climbs like a stairway. See [stairway.md](stairway.md).

**Round 3 on rear delts.** Rear delts are in the "small" list above, and they keep their own id for muscle credit. But they are not a separate muscle for counting. See section 8.

**Where it lives.** `generator_spec_v1.json > vocab.muscles.big`, `vocab.muscles.small`, `vocab.muscles.unplaced_PROPOSED` (the same lists are in `rule_tables.muscles`); `synthesis/01_taxonomy.json > muscles` (18 muscle entries with his labels); catalog record `muscle_size_class`. In the compiled model: `model/rules.json > muscles.defs` (generated).

---

## 8. Focus groups: hips and shoulders

**Rule.** When the model counts a "muscle", it counts one of nine **focus groups**. Two of them join muscles together.

| Focus group | Muscles inside it | Note |
|---|---|---|
| quads | quads | |
| **hips** | **glutes + hamstrings** | an RDL + a hip thrust + a leg curl = 3 hip exercises |
| back | lats / upper back | |
| chest | chest | |
| **shoulders** | **front delts + side delts + rear delts** | traps are shown on this line but add no group credit of their own (INFERRED) |
| biceps | biceps | |
| triceps | triceps | |
| calves | calves | one exercise x 3 sets on every leg day |
| core | abs and obliques | the core opener of the session |

**What the groups are used for.**

| Use | Rule | Source | Explained in |
|---|---|---|---|
| The floor | in a training block, never under 10 sets a week on a group the plan trains | R2-VOL-06, R3-VOL-01 | [volume.md](volume.md) |
| Exercises per day | a full-body day follows his A / B template (a group has 1 to 4 exercises); a split day gives each group 2 to 4 | R4-SES-05, R2-SES-05, R3-SES-01 | [sessions.md](sessions.md) |
| 2 training days | every big group is still trained, at about 6 to 8 weekly sets (the time check of round 3 is retired: CT-01) | R4-SES-03 | [volume.md](volume.md) |
| Focus muscle 1 and 2 | the person may pick up to two groups for extra sets | R3-SES-01 | [volume.md](volume.md) |

**Why hips and shoulders are groups.** We proposed counting his FOCUS groups, "with glutes + hamstrings as one 'hips' group ... and front / side / rear delts as 'shoulders'". He marked it RIGHT (R3-SES-01).

**Why rear delts are not their own muscle.** An earlier plan gave rear delts their own 4 / 6 / 8 weekly sets. In round 3 he said: "rear delts are weird because they're part of the shoulder cap, so there are side delts and front delts as well. I just figured the shoulders were what we were talking about." And: "I wouldn't categorize the rear delt as an individual muscle, so it should always be adaptable. People and coaches should always be able to add more rear delts" (R3-VOL-01, PARTLY). He also noted that rear delts get worked when you train back. So:

- The floor of 10 is counted on the whole shoulders group.
- Rear-delt work still exists in the library and in plans. It counts inside shoulders.
- Adding more rear-delt work is always allowed.
- The model keeps at least one rear-delt exercise in every week. The exact form of that rule is PROPOSED. See [volume.md](volume.md).
- The older statement "Rear delts and calves need to get their own sets and reps" (VOL-17) still holds for calves. For rear delts, the newer answer wins: they get their sets inside the shoulders group, with no number of their own (R3-VOL-01). Reading the two answers together this way is ours (INFERRED).

**Focus muscle 1 and Focus muscle 2.** "when a person is picking their training program, they should be able to choose one of the main muscles that they want to work on the most. The program will then automatically choose extra sets for that one compared to the other one." And: "There could be a main focus muscle 1 and a main focus muscle 2, and that should be enough for the whole thing." (R3-SES-01) He spoke of "an extra set or two or three". The default of +2 sets is PROPOSED.

The intake list for Focus muscles offers: glutes, quads, hamstrings, back, chest, shoulders, biceps, triceps, calves, core, and a V-taper option (back + shoulders, uses both picks). That option list is PROPOSED. Glutes and hamstrings can be picked separately, because they keep their own lines for starting sets and for display. They are joined only for the group rules above. Side delts and rear delts cannot be picked alone any more. Both map to shoulders.

**No sex field.** His example was "if it's a female and she chooses glutes as one of the focus muscles". That is a choice the person makes. The model has no sex field and no sex-based default (GEN-02, ATH-09).

**Where it lives.** `generator_spec_v1.json > vocab.muscles.focus_groups` (with `rule` and `rear_delts_note`); the intake field `inputs_schema.fields.F09` (code `focus_muscles`, slots `focus_1` and `focus_2`; the old name `priority_muscles` is accepted as an alias); `rule_tables.priority`; `BLAZE_CAMP_BRAIN.md` §2.1 rule S13 and §5.3. In the compiled model: `model/rules.json > muscles.groups` (generated).

---

## 9. Where the lenses meet: the slot

**Rule (OBSERVED).** Each row of his program templates has two labels: a PURPOSE and a CATEGORY. For example PURPOSE 'Quads/Glutes' and CATEGORY 'Unilateral KD'. The category says which list the exercise is drawn from (a pattern). The purpose says what the set counts for (a muscle, or a quality for athletic work).

| Slot example (his words) | Family | Listed by | Counts for |
|---|---|---|---|
| 'Quads' / 'Bilateral KD' | RP, big muscle | pattern | quads |
| 'Bicep' / 'Bicep' | RP, small muscle | muscle | biceps |
| 'Plyo' / 'Plyo' | AP | pattern | nothing: contacts |

One rule follows from his answers: **credit follows the exercise picked, not the slot.** A thruster placed in a squat slot still gives shoulders their half set (LIB-14, R2-VOL-05). That half set is his own answer for thrusters. It is not the general helper credit, which is 0.25 (VOL-09). The rule "credit follows the exercise" is our wording (INFERRED from those answers). The credit rules are in [volume.md](volume.md).

**Where it lives.** `BLAZE_CAMP_BRAIN.md` §2.4 (slot to node to credit); `synthesis/01_taxonomy.md` §1.2; each catalog record's `program_slots`; `synthesis/05_templates.json` for the day templates.

---

## 10. Retired ideas (do not rebuild)

| Retired idea | What replaced it | Source |
|---|---|---|
| Leg curls as a hip-dominant isolation (`RP.HD.ISO`) | LEG FLEXION, node `RP.LF` | CAT-09 |
| "Biomechanics" as a third bucket of exercises | a description on every exercise | CAT-03 |
| Rear delts as their own muscle with their own floor and sets | part of the shoulders group | R3-VOL-01 |
| Side delts and rear delts as separate Focus choices | one shoulders focus | R3-VOL-01 |
| Weekly increase set by muscle size (3 / 5 / 7 %) | the stairway: one rule for every muscle (about 3 % a week until the halfway week, about 5 % after it), with bigger steps when needed so each trained group reaches its final sets in the last week | VOL-05, R2-PER-03, R3-VOL-04, CX-01 |
| "Plyo zones" | Receive-Create stages (a way to do a jump, not a zone) | CAT-11, R2-ATH-03 |
| KB swings as glute sets | ballistic power reps, no muscle credit | R2-VOL-05 |
| KB face pulls as a vertical pull | shoulder work, a swap only | LIB-10, R2-LIB-04 |
| A band axis on exercises (bands, chains, weight releasers) | dormant, never used | EQ-01, EQ-12 |
| A sex field | removed | GEN-02, ATH-09 |

The old ids still resolve as aliases: `synthesis/01_taxonomy.json > _meta.retired_ids` and `generator_spec_v1.json > vocab.retired_ids`. More on what he turned down: [../01-philosophy/what-he-rejected.md](../01-philosophy/what-he-rejected.md).

---

## 11. Not confirmed yet

| Item | Our proposal | Status |
|---|---|---|
| Size class of front delts, traps, adductors, neck | small, small, big, small | PROPOSED |
| Toes to bar, hanging knees to chest, Copenhagen plank | core pelvis; core pelvis; core "both" with adductor credit | PROPOSED |
| Lanes inside leg flexion | machine curls (`RP.LF.MACH`) and bodyweight / free-weight curls (`RP.LF.BW`) | PROPOSED |
| Mid-range push and pull nodes | `RP.PU.M`, `RP.PL.M` | PROPOSED (his main library has no column for them) |
| Neck node and reactive agility drill | `RP.SM.NECK`, split-step drill in `AP.AGI` | PROPOSED |
| Where KB swings sit | the triple-extension / ballistic pool | INFERRED from R2-VOL-05 |
| Front raises in the side-raise list | left as he filed them | never asked |
| Carries and drags | 9 starter records + 1 sled rope pull | PROPOSED (LIB-19 approved the build-out, not the items) |
| Traps on the shoulders line | shown there, no group credit | INFERRED |
| Focus option list and the default of +2 sets | see section 8 | PROPOSED |

---

## 12. Where it all lives

| What | File | Key or section |
|---|---|---|
| The rules in one page | `BLAZE_CAMP_BRAIN.md` | §2 (segmentation), Appendix A (his labels) |
| Category tree | `synthesis/01_taxonomy.json` | `nodes` |
| Descriptors (facets) | `synthesis/01_taxonomy.json` | `facets` |
| Muscles and size class | `synthesis/01_taxonomy.json`; `generator_spec_v1.json` | `muscles`; `vocab.muscles` |
| Focus groups | `generator_spec_v1.json` | `vocab.muscles.focus_groups` |
| Focus muscle 1 and 2 (intake) | `generator_spec_v1.json` | `inputs_schema.fields.F09` |
| His sheet label for every id | `synthesis/01_taxonomy.json` | `crosswalk` (641 rows), `library_column_map` |
| The long explanation | `synthesis/01_taxonomy.md` | §0-§4 |
| Each exercise | `synthesis/02_exercise_catalog.json` | `taxonomy`, `laterality`, `plane`, `muscle_size_class`, `volume_credit` |
| Compiled copy the engine reads | `model/catalog.json`, `model/rules.json` | `exercises[]`, `muscles` (generated by the compiler; never edited by hand) |
| His original sheets | `raw/BYOP.xlsx`, `dumps/BYOP/09_MASTER_EXERCISE_LIBRARY.txt` | rows 1-6 hold his category labels |

Field-by-field meanings are in [../05-reference/data-dictionary.md](../05-reference/data-dictionary.md). To add an exercise and classify it, follow [../adding-exercises.md](../adding-exercises.md).
