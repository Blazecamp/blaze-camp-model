# ADR-014: Leg flexion is its own segment

Leg curls, Nordics and slider or swiss-ball curls are not hip-dominant exercises. They sit in their own segment, leg flexion, which the coach compares to biceps curls. A set counts fully for the hamstrings and never counts as a hinge. He decided this in round 1.

| | |
|---|---|
| **Status** | Accepted |
| **Decided by** | Coach: CAT-09 (round 1, 2026-10-08) |
| **Replaces** | Leg curls filed with hip-dominant work |

## Decision (the rule)

- **Hip dominant** means the hips do the work, as in a deadlift or a Romanian deadlift (RDL). These are hinges.
- **Leg flexion** means bending the knee against load: leg curls, Nordics, slider curls, swiss-ball curls.
- Leg flexion is its own segment. A leg-flexion set gives the hamstrings 1.0 set and nothing to the hinge pattern.

## Why

> "No, they shouldn't go in the hip-dominant movements. They should go in more of a flexion of the leg, kind of like bicep curls, which are a little bit different, but we should find the right segmentations for them." (CAT-09)

## Context

In his library the curls were filed in and next to the hip-dominant columns. One of his sheets already used the label 'LEG FLEXION' for this slot (OBSERVED). The team asked whether curls should count as hip-dominant volume.

## Options considered

| Option | What it meant | Outcome |
|---|---|---|
| A. Count curls as hip dominant | A leg curl could stand in for a hinge | Rejected (CAT-09) |
| B. Own segment, credited to hamstrings | Works like an isolation list | **Chosen** |

## Consequences

- The hamstrings line is fed by two segments: hinges and leg flexion.
- In the *hips* focus group (glutes + hamstrings), an RDL, a hip thrust and a leg curl count as three hip exercises (R3-SES-01).
- Leg flexion is left out of the bilateral : unilateral share, which counts knee- and hip-dominant compound lifts only ([ADR-033](adr-033-bilateral-unilateral-scale.md)).
- A leg curl never fills a hinge slot. The 'NO ACCESS' tab where a single-leg hinge dropdown pointed to leg curls was a sheet error (FIX-01, R2-LIB-08).
- No leg curl machine: swap to Nordics, slider or swiss-ball curls. Never bands (EQ-08).
- Leg curls have no level. They are available to everyone (LIB-15).

## Where it lives in the data

| File | Key | What |
|---|---|---|
| [synthesis/01_taxonomy.json](../../synthesis/01_taxonomy.json) | `nodes` | The node with id `RP.LF` (leg flexion) |
| [generator_spec_v1.json](../../generator_spec_v1.json) | `rule_tables.counting.credit_map.LEG_FLEXION` | Credit: hamstrings 1.0 |
| [generator_spec_v1.json](../../generator_spec_v1.json) | `rule_tables.equipment.machine_isolation_swaps` | What to use without the machine |

Master text: [BLAZE_CAMP_BRAIN.md](../../BLAZE_CAMP_BRAIN.md) §2.1 rule S6.

## Related

[ADR-011](adr-011-tag-every-exercise-on-all-lenses.md) lenses · [ADR-019](adr-019-helper-credit-0-25.md) credit · [Categories](../02-model/categories.md)
