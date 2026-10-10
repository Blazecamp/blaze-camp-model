# Coach answers: Categorization

How the coach sorts every exercise. He tags each exercise on every lens at once: family (athletic, resistance, core, cardio, functional), pattern, one side or two, plane, muscle size, main muscles, equipment and level. He splits muscles into bigger and smaller. Biomechanics is a way to describe an exercise, not a bucket of exercises. This page lists every answer he gave about categories, the final rule for each, and where the rule sits in the data.

This page is part of [the coach answers by topic](index.md). It holds 6 question ids. Every place where a later round changed an earlier answer is also listed in [changes across rounds](changes-across-rounds.md). Read next: [model guide: categories](../02-model/categories.md).

## The rules in short

CONFIRMED means the coach said it or approved it. PROPOSED means the team designed it and he has not confirmed it. INFERRED means the team's reading of his words; he has not confirmed that either.

| # | Rule | Answer ids | Status |
|---|---|---|---|
| 1 | Tag every exercise on all lenses at once, so the model can segment by any of them. | [CAT-01](#cat-01) | CONFIRMED |
| 2 | His lenses: bigger muscles, smaller muscles, biomechanics; athletic patterns, resistance patterns, core. | conversation | CONFIRMED |
| 3 | Bigger muscles: quads, glutes, hamstrings, lats and upper back, chest. Smaller muscles: biceps, triceps, side and rear delts, calves, forearms, abs. | [CAT-02](#cat-02) | CONFIRMED |
| 4 | Rear delts are not an individual muscle. They are part of the shoulders group (front, side and rear delts). | [R3-VOL-01](volume.md#r3-vol-01) | CONFIRMED |
| 5 | The 2-to-4-exercises rule is counted on his FOCUS groups: hips = glutes + hamstrings, shoulders = front + side + rear delts. The floor of 10 is counted on the shoulders group. | [R3-SES-01](sessions-and-order.md#r3-ses-01), [R3-VOL-01](volume.md#r3-vol-01) | CONFIRMED |
| 6 | Biomechanics describes every exercise. It has no bucket of its own. | [CAT-03](#cat-03) | CONFIRMED |
| 7 | Core is sorted by what moves: the trunk, the pelvis, or both at once, in any plane. | [CAT-08](#cat-08) | CONFIRMED |
| 8 | Leg curls, nordics and slider curls are leg flexion, not hip dominant. | [CAT-09](#cat-09) | CONFIRMED |
| 9 | The MASTER EXERCISE LIBRARY in the BUILD YOUR OWN PROGRAM sheet is the single source of truth. | [CAT-07](#cat-07) | CONFIRMED |
| 10 | Where traps, front delts, adductors and neck go (he did not place them). Reading the floor of 10 on every FOCUS group, not only on shoulders. | [CAT-02](#cat-02), [R3-SES-01](sessions-and-order.md#r3-ses-01) | PROPOSED |

## Why, in his words

- "This is very important because then we can segment by whatever we need in different families, in different segments, different variables. This is huge." ([CAT-01](#cat-01))
- "No, biomechanics is just the definition of the whole thing, but it doesn't necessarily have its own bucket of exercises." ([CAT-03](#cat-03))
- "They should go in more of a flexion of the leg, kind of like bicep curls" ([CAT-09](#cat-09))
- "I wouldn't categorize the rear delt as an individual muscle" ([R3-VOL-01](volume.md#r3-vol-01))

## Where it lives in the data

Keys are in [`generator_spec_v1.json`](../../generator_spec_v1.json), the machine-readable twin of the model, unless another file is named.

| What | File | JSON key |
|---|---|---|
| The all-lenses rule | `generator_spec_v1.json` | `rule_tables.taxonomy.all_lenses` |
| Bigger and smaller muscles, FOCUS groups | `generator_spec_v1.json` | `vocab.muscles` |
| Biomechanics is not a bucket | `generator_spec_v1.json` | `rule_tables.taxonomy.biomechanics` |
| Core segments (trunk, pelvis, both) | `generator_spec_v1.json` | `rule_tables.taxonomy.core_segments` |
| Leg flexion credit | `generator_spec_v1.json` | `rule_tables.counting.credit_map.LEG_FLEXION` |
| Source of truth | `generator_spec_v1.json` | `rule_tables.taxonomy.source_of_truth` |
| The full category tree | `synthesis/01_taxonomy.json` | `nodes` |
| Every exercise with its tags | `synthesis/02_exercise_catalog.json` | (whole file) |

## Questions on this page

| ID | Round | His verdict | Final rule in one line | Status |
|---|---|---|---|---|
| [CAT-01](#cat-01) | 1 | answered in words (no chip) | Tag every exercise on all lenses at once. | Stands |
| [CAT-03](#cat-03) | 1 | answered in words (no chip) | Biomechanics describes every exercise; it is not a bucket. | Stands |
| [CAT-02](#cat-02) | 1 | RIGHT | Big: quads, glutes, hamstrings, lats/upper back, chest. Small: biceps, triceps, delts, calves, forearms, abs. Rear delts sit inside shoulders. | Stands, refined |
| [CAT-08](#cat-08) | 1 | answered in words (no chip) | Core = trunk moves, pelvis moves, or both; in any plane. | Stands |
| [CAT-09](#cat-09) | 1 | answered in words (no chip) | Leg curls, nordics and slider curls = leg flexion, not hip dominant. | Stands, refined |
| [CAT-07](#cat-07) | 1 | RIGHT | The BYOP MASTER EXERCISE LIBRARY is the single source of truth. | Stands, refined |

## What he said in conversation

These are statements he made while the model was being built. They are closely paraphrased in the source files, with his exact words in quotation marks. A questionnaire answer wins where the two differ.

| Statement | Source | How the questionnaires treated it |
|---|---|---|
| "The hardest thing to understand is the categorization of everything": bigger muscles, smaller muscles, biomechanics; athletic patterns, resistance patterns, core. | `coach_chat_statements.md` | Confirmed by [CAT-01](#cat-01) to [CAT-03](#cat-03). |
| His lineage: Dr. Pat Davidson, Dr. Mike Israetel, and training science from first principles. He is deliberately not building on packaged models (5/3/1, Texas Method, Prilepin's chart). He is "building the segmentation and the buckets from the ground up." | `coach_chat_statements.md` | Davidson's zones are explained in [CAT-04](levels-and-zones.md#cat-04) and [CAT-10](levels-and-zones.md#cat-10) (levels-and-zones). |
| The MASTER EXERCISE LIBRARY in the "BUILD YOUR OWN PROGRAM" sheet is the main thing to understand. | `coach_chat_statements.md` | Confirmed by [CAT-07](#cat-07). |
| Lenses: bigger muscles / smaller muscles / biomechanics; athletic patterns / resistance patterns / core. | `coach_answers.md` (earliest notes) | No questionnaire answer changed it. |
| Lineage: Dr. Pat Davidson + Dr. Mike Israetel + first-principles science, NOT packaged models (5/3/1, Texas Method, Prilepin). | `coach_answers.md` (earliest notes) | No questionnaire answer changed it. |

## Every question and his final answer

Each entry gives the question, the final rule as it stands today, what we assumed or proposed, his verdict, a short quote, what is not confirmed, where the rule lives, and every later change. His full dictated answer is folded under each entry.

### How exercises are tagged

#### CAT-01

**Question (round 1).** Is this the right way to tag every exercise: on all lenses at once?

**Final rule.** Every exercise is tagged on every lens at once: family, pattern, laterality (one side or two), plane, muscle size, main muscles, equipment and level. He calls this "the whole taxonomy of each exercise". The point is that the model can then segment by any lens.

- **Status:** Stands as answered.
- **We assumed (round 1):** Every exercise gets a family (Athletic AP, Resistance RP, Control/core CT/CP, Cardio, Functional), a pattern (e.g. knee dominant), laterality (bilateral/unilateral), plane, muscle size (big/small), main muscles, equipment and level. Example: Goblet Squat = RP · bilateral · knee dominant · quads (big) · sagittal · foundational.
- **His verdict (round 1):** answered in words, no chip
- **In his words:** "Yes, this is the whole taxonomy of each exercise." (CAT-01)
- **Where it lives:** `generator_spec_v1.json` → `rule_tables.taxonomy.all_lenses`; `synthesis/01_taxonomy.json` → `facets`
- **See also:** [CAT-03](#cat-03), [CAT-07](#cat-07)

<details>
<summary>His full answer, round 1 (from <code>coach_answers_full.md</code>)</summary>

> Yes, this is the whole taxonomy of each exercise. This is very important because then we can segment by whatever we need in different families, in different segments, different variables. This is huge.

</details>

#### CAT-03

**Question (round 1).** Is 'biomechanics' its own bucket of exercises, or a way of describing any exercise?

**Final rule.** Biomechanics is the description of any exercise (plane, laterality, load position, stance, range of motion). It is not a bucket that holds its own exercises.

- **Status:** Stands as answered.
- **We assumed (round 1):** Mostly a way of describing any exercise (plane, laterality, load position, stance, range of motion). The FUNCTIONAL columns (carry, drags, oblique slings) are the only place it's a bucket, and they're empty.
- **His verdict (round 1):** answered in words, no chip
- **In his words:** "biomechanics is just the definition of the whole thing" (CAT-03)
- **Where it lives:** `generator_spec_v1.json` → `rule_tables.taxonomy.biomechanics`
- **See also:** [CAT-01](#cat-01), [LIB-19](library-details.md#lib-19)

<details>
<summary>His full answer, round 1 (from <code>coach_answers_full.md</code>)</summary>

> No, biomechanics is just the definition of the whole thing, but it doesn't necessarily have its own bucket of exercises. No.

</details>

### Bigger and smaller muscles

#### CAT-02

**Question (round 1).** Which muscles are 'bigger' and which are 'smaller' in your system?

**Final rule.** Bigger muscles: quads, glutes, hamstrings, lats and upper back, chest. Smaller muscles: biceps, triceps, side and rear delts, calves, forearms, abs. Round 3 added two things. Rear delts are not counted as an individual muscle: they are part of the shoulders group. And the 2-to-4-exercises rule is counted on his FOCUS groups, where glutes + hamstrings are one "hips" group and front + side + rear delts are "shoulders". The model reads the floor of 10 sets a week on the same groups: he confirmed that for shoulders, and for the other groups it is the team's reading (INFERRED).

- **Status:** Stands. Later answers added detail (see "Changed later").
- **We assumed (round 1):** Big: quads, glutes, hamstrings, lats/upper back, chest. Small: biceps, triceps, side and rear delts, calves, forearms, abs. Unsure where traps, front delts, adductors and neck go.
- **His verdict (round 1):** RIGHT, no words (our proposal became his rule)
- **Not confirmed by him:** He marked the lists RIGHT but did not say where traps, front delts, adductors and neck go. Their placement (front delts and traps small, adductors big and credit only, neck small and only for some sports) is PROPOSED.
- **Where it lives:** `generator_spec_v1.json` → `vocab.muscles.big`, `vocab.muscles.small`, `vocab.muscles.focus_groups`
- **Changed later:**
  - **REFINED by [R3-VOL-01](volume.md#r3-vol-01) (round 3).** Before: Side and rear delts were listed as two small muscles. Now: Rear delts are part of the shoulder cap, not an individual muscle. Shoulders are counted as one group.
  - **REFINED by [R3-SES-01](sessions-and-order.md#r3-ses-01) (round 3).** Before: Muscles were listed one by one. Now: For the 2-to-4-exercises rule, count FOCUS groups: hips = glutes + hamstrings, shoulders = front + side + rear delts. The model reads the floor of 10 on the same groups (INFERRED for every group but shoulders).
- **See also:** [R3-VOL-01](volume.md#r3-vol-01), [R3-SES-01](sessions-and-order.md#r3-ses-01), [VOL-11](volume.md#vol-11)

### Core and leg flexion

#### CAT-08

**Question (round 1).** Core thorax vs core pelvis: which rule decides?

**Final rule.** Core work is sorted by what moves. Thorax: the trunk moves on a still pelvis. Pelvis: the pelvis and legs move on a still trunk. Then both at the same time. Each can be done in different planes. Toes to bar and Copenhagen planks are "a little bit more complicated" cases; he did not place them.

- **Status:** Stands as answered.
- **We assumed (round 1):** Thorax = the trunk moves on a still pelvis (crunch, Russian twist). Pelvis = the pelvis/legs move on a still trunk (leg raise, toes to bar). The library and the CONTROL PATTERNS tab disagree on toes to bar and the Copenhagen plank.
- **His verdict (round 1):** answered in words, no chip
- **In his words:** "The rule is deciding the trunk on core, or the pelvis on core. Those are two different things." (CAT-08)
- **Not confirmed by him:** Where toes to bar and the Copenhagen plank are filed is the team's choice (INFERRED), because he called them complicated and did not decide.
- **Where it lives:** `generator_spec_v1.json` → `rule_tables.taxonomy.core_segments`
- **See also:** [ATH-11](sessions-and-order.md#ath-11), [R2-SES-03](sessions-and-order.md#r2-ses-03), [LIB-17](library-details.md#lib-17)

<details>
<summary>His full answer, round 1 (from <code>coach_answers_full.md</code>)</summary>

> Yes, those bars are a little bit more complicated, and Copenhagen planks are a little bit more complicated, but yes, overall, that is right. The rule is deciding the trunk on core, or the pelvis on core. Those are two different things. Then both at the same time, and then you can do those in different planes of movement and all of that stuff too.

</details>

#### CAT-09

**Question (round 1).** Do leg curls, nordics and slider/swiss-ball curls count as HIP DOMINANT volume, or as their own 'LEG FLEXION' bucket?

**Final rule.** Leg curls, nordics and slider or swiss-ball curls are not hip-dominant movements. They belong in a leg-flexion segment, "kind of like bicep curls". In round 3 he approved that a leg curl still counts as one of the hip-group exercises when the plan counts 2 to 4 exercises per group (RDL + hip thrust + leg curl = 3 hip exercises).

- **Status:** Stands. Later answers added detail (see "Changed later").
- **We assumed (round 1):** Their own bucket (LEG FLEXION, as written in Sheet25) that counts toward hamstrings but not toward the hinge pattern.
- **His verdict (round 1):** answered in words, no chip
- **In his words:** "No, they shouldn't go in the hip-dominant movements." (CAT-09)
- **Not confirmed by him:** He asked the team to "find the right segmentations". The bucket name LEG FLEXION and the credit (1 full set for hamstrings, nothing for the hinge pattern) are the team's assumption, taken from his own Sheet25 label.
- **Where it lives:** `generator_spec_v1.json` → `rule_tables.counting.credit_map.LEG_FLEXION`
- **Changed later:**
  - **REFINED by [R3-SES-01](sessions-and-order.md#r3-ses-01) (round 3).** Before: Leg flexion was only said to be separate from hip-dominant work. Now: When counting exercises per group, a leg curl counts in the hips group (RDL + hip thrust + leg curl = 3 hip exercises).
- **See also:** [VOL-09](volume.md#vol-09), [R3-SES-01](sessions-and-order.md#r3-ses-01)

<details>
<summary>His full answer, round 1 (from <code>coach_answers_full.md</code>)</summary>

> No, they shouldn't go in the hip-dominant movements. They should go in more of a flexion of the leg, kind of like bicep curls, which are a little bit different, but we should find the right segmentations for them.

</details>

### The library as the source

#### CAT-07

**Question (round 1).** Is the BYOP MASTER EXERCISE LIBRARY the single source of truth?

**Final rule.** The MASTER EXERCISE LIBRARY in the BUILD YOUR OWN PROGRAM sheet is the single source of truth, "as far as I was able to take it so far". Older tabs (Sheet23, RESISTANCE PATTERNS) are drafts. In round 2 he approved a short list of additions to it.

- **Status:** Stands. Later answers added detail (see "Changed later").
- **We assumed (round 1):** Yes. Sheet23 and the RESISTANCE PATTERNS library are older drafts that still help with levels and with the exercise 'grammar'.
- **His verdict (round 1):** RIGHT, with words
- **In his words:** "that's the single source of truth as far as I was able to take it so far." (CAT-07)
- **Where it lives:** `generator_spec_v1.json` → `rule_tables.taxonomy.source_of_truth`; `synthesis/02_exercise_catalog.json`
- **Changed later:**
  - **REFINED by [R2-LIB-07](library-details.md#r2-lib-07) (round 2).** Before: The library as he had built it so far. Now: A named list of exercises is added (belt squat, seated machine shoulder press, hang clean and others). Exercises that only appear in his programs stay swap options until he adds them.
- **See also:** [R2-LIB-07](library-details.md#r2-lib-07), [R2-LIB-01](library-details.md#r2-lib-01)

<details>
<summary>His full answer, round 1 (from <code>coach_answers_full.md</code>)</summary>

> That's correct. The YOP master exercise library: that's the single source of truth as far as I was able to take it so far.

</details>

## Related answers on other pages

| ID | Page | What it says |
|---|---|---|
| [VOL-10](volume.md#vol-10) | [volume](volume.md) | Athletic work (plyos, throws, Olympic lifts, sprints) never counts toward muscle sets. |
| [R3-VOL-01](volume.md#r3-vol-01) | [volume](volume.md) | Rear delts sit inside the shoulders group. |
| [R3-SES-01](sessions-and-order.md#r3-ses-01) | [sessions-and-order](sessions-and-order.md) | FOCUS groups: hips and shoulders. |
| [R2-VOL-05](volume.md#r2-vol-05) | [volume](volume.md) | Kettlebell swings are ballistic work, not glute-building work. |
| [CAT-04](levels-and-zones.md#cat-04) | [levels-and-zones](levels-and-zones.md) | What makes an exercise foundational, intermediate or advanced. |
| [CAT-10](levels-and-zones.md#cat-10) | [levels-and-zones](levels-and-zones.md) | What "zone" means. |
| [CAT-13](bilateral-unilateral.md#cat-13) | [bilateral-unilateral](bilateral-unilateral.md) | Contralateral and ipsilateral loading. |
| [R2-LIB-01](library-details.md#r2-lib-01) | [library-details](library-details.md) | One-detail variations of a library exercise. |
| [LIB-19](library-details.md#lib-19) | [library-details](library-details.md) | Carries, drags and sling systems are to be built out. |
