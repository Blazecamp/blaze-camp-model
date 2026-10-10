# ADR-012: Exercise levels come from load position, skill and stability

An exercise is foundational, intermediate or advanced by three things: how much skill it needs, how much stability it needs, and where the load sits on the body. A seat, a machine or a cable makes any position easier. Levels add options and never take any away, and the coach calls them "very theoretical", so they are a soft default and never a gate. He explained the rule in round 1 and approved the team's reading in round 2.

| | |
|---|---|
| **Status** | Accepted |
| **Decided by** | Coach: CAT-04, CAT-05, EQ-04 (round 1); R2-LIB-02 (round 2) |
| **Replaces** | "Zone = level" (team's first reading) and levels as strict gates |

## Decision (the rule)

| Where the load sits | Level | His examples |
|---|---|---|
| In front of you, or low | Foundational | Goblet squat, front-loaded zercher |
| Close to and on your body | Intermediate | Barbell front squat |
| Behind your body, or overhead | Advanced | Barbell back squat |

- More skill and more stability demand mean a higher level.
- A seat, machine or cable lowers the level. A deep goblet squat stays foundational. A seated dumbbell shoulder press and a lat pulldown are foundational even though the arms go overhead (R2-LIB-02).
- A higher-level client can still use lower-level exercises (CAT-05).
- Safety beats the label: a foundational older or injured client may use machines his sheet files as moderate or advanced (EQ-04).

## Why

> "The positioning of the bar or the load in front of you would be more foundational because people need to learn how to be more upright." (CAT-04)

> "When it's machines or cables, it changes because it's easier because the machine or the cable is doing the work for you." (CAT-04)

> "The levels are still very theoretical, so we don't need to rely heavily on them." (CAT-05)

## Context

His library files exercises under FOUNDATIONAL, MODERATE and ADVANCED. Some placements looked odd: the leg press, the pendulum and the hip thrust machine sit in ADVANCED although they are safe and easy to learn. The team asked what makes a level. His answer added load position to skill and stability, and pointed to Dr. Pat Davidson's zones. The zones turned out to be a separate idea ([ADR-013](adr-013-davidson-zones-as-tags.md)).

## Options considered

| Option | What it meant | Outcome |
|---|---|---|
| A. Level = skill and stability only | The team's assumption | Incomplete (CAT-04 adds load position) |
| B. Level = the zone number | Zone 1 easy, zone 3 advanced | Retired (R2-LIB-02) |
| C. Level = skill + stability + load position, eased by support | His rule | **Chosen** |
| D. Levels as gates | A beginner can never pick an advanced exercise | Rejected (CAT-05, EQ-04) |

## Consequences

- The level of the *exercise* is separate from the level of the *client* ([ADR-016](adr-016-client-levels-by-training-experience.md)).
- Throws and the GHD (glute-ham developer) have no levels (LIB-06, LIB-08). Leg extensions and leg curls are available at every level (LIB-15).
- Moving a slot up a level happens when the next block is built, if the exercise felt like "8 - That was perfect" or easier with no pain (PER-06). The person or coach decides.
- Team check (OBSERVED + INFERRED): the load-position rule gives his library level exactly for 98 of 176 levelled entries and within one level for 157. The misses are barbell lifts (harder than position says) and machines filed as volume tools.

## Where it lives in the data

| File | Key | What |
|---|---|---|
| [generator_spec_v1.json](../../generator_spec_v1.json) | `rule_tables.levels_exercise.rule` | The rule in one line |
| [generator_spec_v1.json](../../generator_spec_v1.json) | `rule_tables.taxonomy.levels` | Levels add options; soft default |
| [synthesis/01_taxonomy.json](../../synthesis/01_taxonomy.json) | `facets` | Entries `F.LEVEL` and `F.LOADPOS` |
| [synthesis/10_equipment_model.json](../../synthesis/10_equipment_model.json) | `level_model` | How the level is computed and checked |
| [model/rules.json](../../model/rules.json) | `levels.exercise_ladder` | Runtime copy (generated) |

Each catalog record has a `level` field. Master text: [BLAZE_CAMP_BRAIN.md](../../BLAZE_CAMP_BRAIN.md) §3.1.

## Related

[ADR-035](adr-035-machines-not-ranked.md) machines · [Levels and zones](../02-model/levels-and-zones.md)
