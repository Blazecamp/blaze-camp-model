# ADR-011: Tag every exercise on all lenses at once

Every exercise carries a full set of tags: its family, pattern, sides used, plane, muscle size, main muscles, equipment and level. The tool can then sort and pick by any of them. Biomechanics is the description each exercise carries, not a bucket of its own. The coach confirmed this in round 1 and called it "huge".

| | |
|---|---|
| **Status** | Accepted |
| **Decided by** | Coach: CAT-01, CAT-02, CAT-03 (round 1, 2026-10-08) |
| **Replaces** | One tree where each exercise sits in a single bucket |

## Decision (the rule)

A **lens** is one way of looking at an exercise. Each exercise is tagged on every lens.

| Lens | Values (his vocabulary) |
|---|---|
| Family | Athletic patterns, Resistance patterns, Control / core (thorax, pelvis), Cardio, Functional |
| Pattern | For example knee dominant, hip dominant, horizontal push, vertical pull |
| Laterality | Bilateral (both sides together) or unilateral (one side at a time) |
| Plane | Sagittal, frontal, transverse |
| Muscle size | Big or small |
| Main muscles | The muscles the set is counted for |
| Equipment | What it needs, and how much the equipment holds the body |
| Level | Foundational, intermediate, advanced |

Example he confirmed: Goblet Squat = resistance pattern · bilateral · knee dominant · quads (big) · sagittal · foundational.

Big muscles: quads, glutes, hamstrings, lats and upper back, chest. Small muscles: biceps, triceps, side and rear delts, calves, forearms, abs (CAT-02). Since round 3, rear delts are not counted as a muscle of their own. They sit in the shoulders group with the front and side delts ([ADR-018](adr-018-rear-delts-part-of-shoulders.md)).

## Why

> "Yes, this is the whole taxonomy of each exercise. This is very important because then we can segment by whatever we need in different families, in different segments, different variables. This is huge." (CAT-01)

> "No, biomechanics is just the definition of the whole thing, but it doesn't necessarily have its own bucket of exercises. No." (CAT-03)

## Context

He has said that the hardest thing to understand in his system is the categorization of everything: bigger muscles, smaller muscles, biomechanics; athletic patterns, resistance patterns, core (conversation, 2026-10-07 to 2026-10-09). His library sheet lays exercises out in columns, so each exercise appears to live in one place. The team asked whether one place was enough.

## Options considered

| Option | What it meant | Outcome |
|---|---|---|
| A. One bucket per exercise | Follow the sheet columns only | Not enough |
| B. Tags on every lens | Segment by family, pattern, muscle, equipment, level and more | **Chosen** (CAT-01) |
| C. Biomechanics as its own bucket | A separate list of "biomechanics" exercises | Rejected (CAT-03) |

## Consequences

- Adding an exercise means filling every lens. See [Adding exercises](../adding-exercises.md).
- The same tags drive counting ([ADR-019](adr-019-helper-credit-0-25.md)), order ([ADR-028](adr-028-power-first-horizontal-before-vertical.md)), pairing ([ADR-029](adr-029-pairing-hip-push-knee-pull.md)) and equipment swaps.
- Rounds 2 and 3 added the *focus groups* used for counting: hips = glutes + hamstrings, shoulders = front + side + rear delts ([ADR-017](adr-017-floor-of-10-on-focus-groups.md)).
- Traps, front delts, adductors and neck have no confirmed size class. The team left them as credit-only lines (PROPOSED).
- Carries, drags and sling systems are in his sheet as empty columns. He agreed they should be built out (LIB-19).

## Where it lives in the data

| File | Key | What |
|---|---|---|
| [generator_spec_v1.json](../../generator_spec_v1.json) | `rule_tables.taxonomy.all_lenses`, `rule_tables.taxonomy.biomechanics` | The two rules |
| [synthesis/01_taxonomy.json](../../synthesis/01_taxonomy.json) | `nodes`, `facets` | The category tree and the list of lenses with their values |
| [generator_spec_v1.json](../../generator_spec_v1.json) | `vocab.muscles.focus_groups` | The groups used for counting |

Each record in [synthesis/02_exercise_catalog.json](../../synthesis/02_exercise_catalog.json) has the fields `taxonomy`, `laterality`, `plane`, `level`, `primary_muscles`, `muscle_size_class`, `equipment` and `constraint_level`. Human text: [synthesis/01_taxonomy.md](../../synthesis/01_taxonomy.md).

## Related

[ADR-012](adr-012-levels-from-load-position.md) levels · [ADR-014](adr-014-leg-flexion-own-segment.md) leg flexion · [Categories](../02-model/categories.md)
