# ADR-019: Helper muscles get a quarter set

When a compound lift is counted, the main muscle gets 1 set and each helper muscle gets 0.25 of a set. The team had assumed 0.5. The coach set 0.25 in round 1 and confirmed the glute and thruster math in round 2. A few exercises have their own split.

| | |
|---|---|
| **Status** | Accepted |
| **Decided by** | Coach: VOL-09, LIB-16, UNI-01 (round 1); R2-VOL-05 (round 2) |
| **Replaces** | 0.5 credit to helpers (team assumption) |

## Decision (the rule)

The **main mover** is the muscle that does most of the work in a lift. A **helper** is a muscle that assists. A **compound** lift uses more than one joint.

| Exercise type | 1.0 set | 0.25 set | Source |
|---|---|---|---|
| Squats, lunges, leg press | quads | glutes | VOL-09, R2-VOL-05 |
| Deadlifts, RDLs (Romanian deadlifts) | hamstrings | glutes | R2-VOL-05 |
| Hip thrusts, bridges | glutes | hamstrings | R2-VOL-05; helper per VOL-09 |
| Horizontal press (bench) | chest | triceps, front delts | VOL-09 |
| Rows | lats and upper back | biceps, rear delts | VOL-09 |
| Leg extension, leg curl | quads / hamstrings | none | VOL-09 |

| Exception | Credit | Source |
|---|---|---|
| Dips | 0.5 triceps + 0.5 chest | LIB-16 |
| Thruster | 1.0 quads + 0.5 shoulders + 0.25 glutes | R2-VOL-05 |
| Kettlebell swing | no muscle sets (ballistic) | R2-VOL-05, see [ADR-020](adr-020-athletic-work-never-counts-as-muscle-sets.md) |

A unilateral set written 10/10 (10 reps each side) is one set (UNI-01).

## Why

> "I would suggest a 0.25 to the helpers, not a 0.5." (VOL-09)

> "dips i would say more tricep than chest but still .5 and .5 done in push day or push exercise" (LIB-16)

On single-leg work, he counts it "mostly for quads" (UNI-01). On the compound math with glutes at a quarter he said: "that sounds like the math is correct" (R2-VOL-05).

## Context

To count weekly sets per muscle, the tool has to decide what a bench press gives the triceps. The team's first version gave helpers half a set, and gave glutes a full set from every hinge and lunge. He lowered both.

## Options considered

| Option | What it meant | Outcome |
|---|---|---|
| A. Count the main mover only | Presses give the triceps nothing | Not chosen |
| B. Helpers 0.5 | The team's assumption | Rejected (VOL-09) |
| C. Helpers 0.25, with a few named exceptions | His count | **Chosen** |

## Consequences

- Arms get little from presses and rows, so they need direct sets to reach their numbers.
- A physique plan reaches its glute target only with direct glute work such as hip thrusts.
- PROPOSED display only: the plan may show a second, research-style count (helpers at 0.5) next to his count. It changes nothing in the plan and is not the retired rule. The tool steers on his count of 0.25.
- PROPOSED: a set counts at most 1.0 toward a focus group ([ADR-017](adr-017-floor-of-10-on-focus-groups.md)).

## Where it lives in the data

| File | Key | What |
|---|---|---|
| [generator_spec_v1.json](../../generator_spec_v1.json) | `rule_tables.counting.credit_map` | Credit for every exercise type |
| [generator_spec_v1.json](../../generator_spec_v1.json) | `rule_tables.counting.unilateral` | The 10/10 rule |
| [synthesis/12_volume_algorithm_v1.json](../../synthesis/12_volume_algorithm_v1.json) | `counting.credit_map` | Same, in the volume algorithm |
| [model/rules.json](../../model/rules.json) | `credit.helper`, `credit.exceptions` | Runtime copy (generated) |

Each catalog record has a `volume_credit` field. Hard rule H08 in [AGENTS.md](../../AGENTS.md) §10. Master text: [BLAZE_CAMP_BRAIN.md](../../BLAZE_CAMP_BRAIN.md) §5.2.

## Related

[ADR-014](adr-014-leg-flexion-own-segment.md) leg flexion · [Volume](../02-model/volume.md) · [Parameters](../05-reference/parameters.md)
