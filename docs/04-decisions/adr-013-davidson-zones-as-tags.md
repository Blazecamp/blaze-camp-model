# ADR-013: Davidson zones are tags, not levels

The "zones" the coach takes from Dr. Pat Davidson's book *A Coach's Guide to Optimizing Movement* describe the rotation bias of a position. The model stores the zone as a tag on each loaded exercise. It does not set the exercise's level, and it does not apply to plyometrics. The coach explained the zones in round 1 and approved this use in round 2.

| | |
|---|---|
| **Status** | Accepted. The exact angle cut-offs between zones are INFERRED. |
| **Decided by** | Coach: CAT-04, CAT-10 (round 1); R2-LIB-02, R2-LIB-03 (round 2) |
| **Replaces** | "Zone = level" (team's first reading) |

## Decision (the rule)

A **rotation bias** is the way the muscles tend to turn the limb in a position: outward (external) or inward (internal).

| Zone | Position (his examples) | Bias |
|---|---|---|
| Zone 1 | Standing, arms down, load low and close to the body | External rotation |
| Zone 2 | Horizontal: hands in front of you, or knee at hip level halfway through a squat | Internal rotation, more compressive |
| Zone 3 | Arms overhead, or a deep squat | External rotation |

How the model uses the tag (R2-LIB-03):

1. Keep both biases in every week.
2. Use the bias to pick a swap when something hurts.
3. Do not program by sport from it, for now.

## Why

> "The zones come from Dr. Pat Davidson's book, A Coach's Guide to Optimizing Movement, which is essentially external rotation biases at the vertical." (CAT-10)

> "It doesn't apply to the plyos. The plyos are different." (CAT-10)

## Context

The word ZONE appears in several of his tabs with different meanings: on cable curls ('Zone 1/2/3'), on plyometrics, and on coloured rows of an older sheet. In CAT-04 he called zone 2 "more intermediate work" and said overhead work "would be more advanced", which reads like a level. In CAT-10 he said the zones are rotation biases. We asked again in round 2 and proposed: the zone is a tag, and the level comes from load position, skill and stability. He marked it RIGHT (R2-LIB-02).

## Options considered

| Option | What it meant | Outcome |
|---|---|---|
| A. Zone = level | Zone 3 exercises are always advanced | Retired: a lat pulldown is overhead and still foundational |
| B. Zone as its own tag | Used for balance across the week and for pain swaps | **Chosen** (R2-LIB-02, R2-LIB-03) |
| C. Zone bias chosen by sport | For example more of one bias for one sport | Not for now (R2-LIB-03) |

## Consequences

- Zones 1 and 3 are both "vertical" positions with the same bias. Zone 2 is the horizontal one.
- The zone is not used to order or pair exercises.
- Plyometrics have their own progression, the Receive-Create stages ([ADR-038](adr-038-receive-create-stages.md)).
- Lineage note from the team: no public description with this exact wording was found (web search, 2026-10-08). The model treats it as the coach's account of the book.

## Where it lives in the data

| File | Key | What |
|---|---|---|
| [generator_spec_v1.json](../../generator_spec_v1.json) | `rule_tables.levels_exercise.davidson_zones` | The three zones and how they are used |
| [synthesis/01_taxonomy.json](../../synthesis/01_taxonomy.json) | `facets` | Entry `F.DZONE` |
| [synthesis/11_training_variables.json](../../synthesis/11_training_variables.json) | `position_zone_model` | The zone model among the training variables |

Each loaded catalog record has a `davidson_zone` field. Master text: [BLAZE_CAMP_BRAIN.md](../../BLAZE_CAMP_BRAIN.md) §3.2. Lineage: [synthesis/07_science_lineage.md](../../synthesis/07_science_lineage.md) §1.1.

## Related

[ADR-012](adr-012-levels-from-load-position.md) levels · [ADR-046](adr-046-built-from-first-principles.md) lineage · [Levels and zones](../02-model/levels-and-zones.md)
