# ADR-020: Athletic work never counts as muscle sets

Jumps, throws, Olympic lifts, sprints and change-of-direction work are tracked on their own. They never count toward a muscle's weekly sets. Kettlebell swings are ballistic work, so they count for no muscle either. The coach set this in round 1, added the kettlebell swing in round 2, and approved the same for HYROX station circuits in round 3.

| | |
|---|---|
| **Status** | Accepted |
| **Decided by** | Coach: VOL-10 (round 1); R2-VOL-05 (round 2); R3-ATH-03 (round 3) |
| **Replaces** | Kettlebell swings counted as 1.0 glute set (team proposal) |

## Decision (the rule)

The model has two kinds of work.

| Kind | Examples | Counted as |
|---|---|---|
| Resistance patterns | squats, presses, rows, curls | weekly hard sets per muscle group |
| Athletic patterns | plyometrics, ballistic jumps, throws, Olympic lifts, sprints, change of direction | their own units: contacts, throws, reps, metres |

- Athletic work adds nothing to muscle sets.
- Kettlebell swings are ballistic (R2-VOL-05). The team files them with the power work and never makes them the default in a hip-dominant strength slot (INFERRED placement).
- HYROX station circuits are finishers. They do not count as muscle sets. (HYROX is a fitness race: eight 1 km runs, each followed by a workout station.)

**Ballistic** means one explosive effort with a longer push, like a throw or a loaded jump.

## Why

> "I think counting towards muscles is more for resistance patterns, not for athletic patterns. That's important." (VOL-10)

His reason: in those movements "there are so many things happening at so many different levels" (VOL-10).

> "kettlebell swings are not glutes." (R2-VOL-05)

> "kettlebell swings are mostly supposed to be used for the ballistic movements, not for resistance training." (R2-VOL-05)

## Context

The team asked in round 1 whether athletic sets count toward a muscle's weekly sets. We assumed they do not, and he agreed. In round 2 we proposed that hip thrusts, bridges and kettlebell swings each give the glutes a full set. He accepted the first two and took the swing out.

## Options considered

| Option | What it meant | Outcome |
|---|---|---|
| A. Athletic sets count toward muscles | A clean counts for quads and glutes | Rejected (VOL-10) |
| B. Two separate budgets | Muscle sets for resistance work, own units for athletic work | **Chosen** |
| Kettlebell swing as glute volume | 1.0 glute set per set of swings | Rejected (R2-VOL-05) |

## Consequences

- An athlete's plan has a muscle-set budget and a separate athletic budget from the sport profile.
- Switching off a day's athletic block changes no muscle-set number ([ADR-005](adr-005-editable-plan-switches-and-supersets.md)).
- The stairway for muscle sets is computed without athletic work.
- A swing is never the default pick for a deadlift or RDL slot (INFERRED placement).

## Where it lives in the data

| File | Key | What |
|---|---|---|
| [generator_spec_v1.json](../../generator_spec_v1.json) | `rule_tables.athletic.never_counts_to_muscles`, `rule_tables.athletic.counting` | The rule and the units |
| [generator_spec_v1.json](../../generator_spec_v1.json) | `rule_tables.counting.credit_map.KB_SWING` | Kettlebell swings: no credit |
| [generator_spec_v1.json](../../generator_spec_v1.json) | `rule_tables.athletic.hyrox_station_circuits` | Station circuits as finishers |
| [model/rules.json](../../model/rules.json) | `credit.athletic_slot_zero`, `athletic.never_counts_to_muscles` | Runtime copy (generated) |

Hard rule H09 in [AGENTS.md](../../AGENTS.md) §10.

## Related

[ADR-019](adr-019-helper-credit-0-25.md) credit · [ADR-037](adr-037-plyometric-vs-ballistic-by-ground-contact.md) plyometric vs ballistic · [Athletes](../02-model/athletes.md)
