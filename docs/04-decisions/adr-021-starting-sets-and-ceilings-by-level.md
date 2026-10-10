# ADR-021: Starting sets and ceilings by level

A plan starts each muscle group at a number of weekly sets that fits the person's level, and it has a ceiling it does not pass in one plan. The numbers are the coach's: his ranges from round 1, and the ceilings he approved in round 2. He calls all of it customizable. Where he gave a range, the tool uses the low end.

| | |
|---|---|
| **Status** | Accepted. The advanced start of 20, the goal factors and the Pro setting are PROPOSED. |
| **Decided by** | Coach: VOL-01, UNI-01 (round 1); R2-VOL-04, R2-VOL-06 (round 2); R3-VOL-01 (round 3) |
| **Replaces** | Reading "15 to 20 sets" as the peak week (team's first reading) |

## Decision (the rule)

A **hard set** is a working set done 1 to 3 reps short of failure. L1, L2 and L3 are the client levels ([ADR-016](adr-016-client-levels-by-training-experience.md)). Weekly hard sets for one muscle group:

| | L1 beginner | L2 intermediate | L3 advanced | Source |
|---|---|---|---|---|
| Start, big muscles (his range) | 10-12 | 15-20 | 20+ | VOL-01 |
| Start used by the tool | 10 | 15 | 20 | The low end of each range. He marked RIGHT a proposal that named "big muscles 10 / 15 / 20" (R2-VOL-04). The 20 for his "20+" stays PROPOSED. |
| Start, shoulders, biceps, triceps | 10 | 12 | 15 | R2-VOL-04; L1 lifted from 8 by the floor of 10 |
| Ceiling in one 12-week plan | 14 | 22 | 25 | R2-VOL-06 |
| Ceiling for a priority muscle (now a Focus muscle, [ADR-024](adr-024-focus-muscle-1-and-2.md)) | 18 | 26-28 | 30 | R2-VOL-06 |

- After a completed plan, the next one starts 5 % higher with the ceiling 1 set higher. It never passes 25, or 30 for a Focus or priority muscle (R2-VOL-06).
- More than 30 sets is for a very advanced person only.

## Why

> "I like that 15 to 20 sets of any muscle group per week would be a good foundation for maintenance to a little bit of growth, and then 20 to 25 sets maybe can be a good growth foundation." (UNI-01)

> "I think doing 40 sets of chest per week might be way too much, but I think 5 might be too little." (UNI-01)

> "More than 30 sets per week of a muscle group should probably be for a very advanced person." (R2-VOL-06)

> "Yeah, but this is all customizable." (R2-VOL-06)

## Context

He asked the team to check his numbers against research: "You should probably go and find some charts out there that can show those averages and also match them with what my experience is." (VOL-01). The team did. The summary is that his starts, floor and ceilings sit inside what the studies support (SCIENCE; see the volume algorithm document, section 2).

## Options considered

| Option | What it meant | Outcome |
|---|---|---|
| A. One number for everyone | 15 to 20 sets for all | Not chosen: he gave ranges by level |
| B. Published per-muscle landmark tables | A different number for every muscle | Used only as a research check |
| C. His starts and ceilings by level | Simple, his own experience | **Chosen** |

## Consequences

- Levels come from training experience ([ADR-016](adr-016-client-levels-by-training-experience.md)).
- The plan climbs from the start toward the ceiling ([ADR-022](adr-022-every-plan-is-a-stairway.md)).
- No trained group sits below 10 ([ADR-017](adr-017-floor-of-10-on-focus-groups.md)).
- Pain cuts a muscle or pattern by 30 to 50 %, or drops the exercise (VOL-03). Maintenance runs at about 50 to 70 % (PER-01).
- PROPOSED: multipliers by goal and phase, for example 0.8 for fat loss and general fitness, and lower numbers for field athletes whose plan also holds jumps and Olympic lifts.
- PROPOSED: a "Pro setting" lets one muscle pass 30, from his words "Maybe we can add a pro level" (R2-VOL-06).
- Nothing is stored, so the person says how many plans in a row they completed when they build the next one (PROPOSED input).

## Where it lives in the data

| File | Key | What |
|---|---|---|
| [generator_spec_v1.json](../../generator_spec_v1.json) | `rule_tables.weekly_sets.muscles` | Start and ceiling for every line |
| [generator_spec_v1.json](../../generator_spec_v1.json) | `rule_tables.weekly_sets.landmarks_coach` | His ranges in his words |
| [generator_spec_v1.json](../../generator_spec_v1.json) | `rule_tables.goal_phase_modifiers` | Goal and phase multipliers |
| [generator_spec_v1.json](../../generator_spec_v1.json) | `plan_types.cycles` | The next plan one step up |
| [synthesis/12_volume_algorithm_v1.json](../../synthesis/12_volume_algorithm_v1.json) | `starting_table`, `cycles` | Same, in the volume algorithm |
| [model/rules.json](../../model/rules.json) | `volume.start`, `volume.cap` | Runtime copy (generated) |

Research check: [synthesis/12_volume_algorithm_v1.md](../../synthesis/12_volume_algorithm_v1.md).

## Related

[ADR-024](adr-024-focus-muscle-1-and-2.md) Focus muscles · [Volume](../02-model/volume.md) · [Parameters](../05-reference/parameters.md)
