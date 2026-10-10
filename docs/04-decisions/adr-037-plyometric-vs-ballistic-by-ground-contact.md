# ADR-037: Ground-contact time decides plyometric vs ballistic

How much of an athlete's jump and throw work is plyometric and how much is ballistic depends on the sport: the less time the athlete spends on the ground in the sport, the more plyometrics; the more time on the ground, the more ballistics. Both are always present. The coach gave this rule in round 1. He approved the percentages by sport in round 2 and for the remaining sports in round 3.

| | |
|---|---|
| **Status** | Accepted. Sports he did not name are placed by the same rule (INFERRED). |
| **Decided by** | Coach: ATH-01, ATH-02, CAT-10 (round 1); R2-ATH-01, R2-ATH-02 (round 2); R3-ATH-04 (round 3) |
| **Replaces** | A "plyo dial" that counted more slots, more contacts and higher jumps (team's first version) |

## Decision (the rule)

| Kind | What it is | Examples (R2-ATH-02) |
|---|---|---|
| **Plyometric** | Short, bouncy ground contacts | Pogo and ankle hops, hurdle hops, depth jumps, bounds, squirrel jumps, repeated jumps |
| **Ballistic** | A longer contact, or one big effort | Squat jumps, box jumps, broad jumps, loaded or hex-bar jumps, medball throws |

Share of jump and throw work that is plyometric by the end of a block:

| Share | Sports he approved in round 2 | Sports he approved in round 3 |
|---|---|---|
| 75 % | sprinters | runners |
| 60 % | volleyball, soccer, football skill positions | lacrosse, field hockey, flag football, ultimate cutters, rugby sevens, high jump, pole vault, gymnastics, cheer flyers |
| 50 % | basketball, tennis, football big-skill positions, weekend warriors | beach volleyball, pickleball, padel, rugby backs, goalkeepers, javelin, HYROX |
| 40 % | baseball, softball, hockey, linemen, MMA | rugby forwards, cheer bases, throwers, diving, alpine skiing, cycling |
| 25 % | boxing, karate, kickboxing, wrestling, BJJ, golf | swimming, water polo, rowing, judo, taekwondo, climbing |

Each block starts 15 points more ballistic than these numbers (R2-ATH-01). Recreational players use their activity's share (R3-ATH-04).

## Why

> "The more time on the ground they have to have, like a karate athlete, the more ballistics and less plyos. The less time on the ground, like a sprinter, the more plyos and less ballistics." (ATH-01)

> "The longer they're on the ground, the less it is going to be plyo, so it's more of a ballistic movement." (CAT-10)

He starts programs "with more ballistic movements" and moves "slowly and gradually" to plyometric ones, to build up the connective tissue (CAT-10).

## Context

He had said early on that basketball players need more plyos, boxers and karate athletes few, and MMA fighters something in between. The team first read "more plyos" as more jumping of every kind. His round-1 answer changed the question from "how much" to "which kind". Round 2 put numbers on it, reading his sport ranking as "fast, bouncy contacts, not total jumps". He marked them RIGHT.

## Options considered

| Option | What it meant | Outcome |
|---|---|---|
| A. A volume dial | More slots, contacts and height for "plyo sports" | Replaced |
| B. One jump program for every athlete | Same mix for a sprinter and a boxer | Rejected |
| C. A plyometric : ballistic share set by ground-contact time | Different mix per sport, shifting through the block | **Chosen** |

## Consequences

- Each sport profile carries a contact class and a share. Sports and positions outside his two lists, such as quarterbacks or obstacle-course racers, are placed by the same rule and marked INFERRED.
- "Goalkeepers 50 %" is read as soccer, lacrosse and field-hockey goalkeepers (PROPOSED reading).
- The team's five contact classes and their time bands come from sport-science sources (SCIENCE), not from him.
- Jump work follows the Receive-Create stages ([ADR-038](adr-038-receive-create-stages.md)).
- None of this counts as muscle sets ([ADR-020](adr-020-athletic-work-never-counts-as-muscle-sets.md)).

## Where it lives in the data

| File | Key | What |
|---|---|---|
| [generator_spec_v1.json](../../generator_spec_v1.json) | `rule_tables.athletic.plyo_vs_ballistic.classes` | The five classes with their shares |
| [generator_spec_v1.json](../../generator_spec_v1.json) | `rule_tables.athletic.plyo_vs_ballistic.lists_approved` | Which jumps are ballistic and which plyometric |
| [generator_spec_v1.json](../../generator_spec_v1.json) | `rule_tables.athletic.plyo_share_remaining_sports` | The round-3 sports |
| [synthesis/04_profiles.json](../../synthesis/04_profiles.json) | `ground_contact_model` | The model behind the classes |
| [model/rules.json](../../model/rules.json) | `athletic.ground_contact_classes`, `athletic.block_start_offset` | Runtime copy (generated) |

Each sport profile in `synthesis/04_profiles.json > profiles` has a `ground_contact` field. Master text: [BLAZE_CAMP_BRAIN.md](../../BLAZE_CAMP_BRAIN.md) §9.2.

## Related

[ADR-041](adr-041-every-sport-and-stay-athletic.md) sports · [Athletes](../02-model/athletes.md) · [Sports](../02-model/sports.md)
