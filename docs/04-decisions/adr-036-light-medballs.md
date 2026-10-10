# ADR-036: Medicine balls stay light

Medicine-ball throws are speed work, so the ball is light: 8 to 10 lb for passes and rotations, and never more than 20 lb for anything. Throws have no levels. Bodybuilders do not throw medicine balls in their main workout. The coach said the first part in conversation and confirmed the weights and limits in round 1.

| | |
|---|---|
| **Status** | Accepted |
| **Decided by** | Coach: conversation; EQ-06, EQ-07, ATH-05, LIB-06 (round 1) |
| **Replaces** | Progressing throws by ball weight or by stance |

## Decision (the rule)

| Throw | Ball weight | Source |
|---|---|---|
| Upper-body passes and rotations | 8-10 lb | Conversation |
| Overhead throws | 6-10 lb | EQ-06 |
| Sit-up throws | 6-8 lb | EQ-06 |
| Slams | 10-20 lb | EQ-06 |
| Anything | never over 20 lb | EQ-06 |
| Youth and older clients | lighter | EQ-06 |

- A heavier ball only has a specific use, such as a medball hang clean or wall balls.
- No levels in throws.
- No medicine ball in a bodybuilder's main workout. It may appear in a warm-up.
- No ball available: substitute, do not skip. Never with bands (EQ-07).

## Why

> "The heavier I go, the slower I'm going to be. The lighter I go, ideally, the faster I can be." (conversation)

> "No, I don't think there's any need for anything more than 20 lbs., to be honest." (EQ-06)

> "If you're a bodybuilder, you don't need to do med ball throwing." (ATH-05)

> "No levels in throws, just do them right" (LIB-06)

## Context

His point in conversation was about speed: to go faster you do not need a lot of weight, and quality of movement matters as much as quantity. The team then asked about weights for other throws, which sports throw most, and whether throws progress by ball weight or stance.

## Options considered

| Option | What it meant | Outcome |
|---|---|---|
| A. Heavier balls for stronger athletes | Progress by weight | Rejected: heavier is slower |
| B. Progress by stance | Standing, then split, then half-kneeling | Not adopted: no levels in throws (LIB-06) |
| C. Light and fast, done right | Fixed light weights | **Chosen** |

## Consequences

- Throwing volume goes by sport: high for baseball, boxing, MMA, tennis and golf; moderate for basketball and football (ATH-05).
- A throw counts as ballistic work in a sport's mix ([ADR-037](adr-037-plyometric-vs-ballistic-by-ground-contact.md)).
- Wall balls for HYROX use the race ball, never over 20 lb (R3-ATH-03).
- Light medball throws stay on by default for clients over 60 ([ADR-040](adr-040-older-adult-defaults.md)).
- Throws never count as muscle sets ([ADR-020](adr-020-athletic-work-never-counts-as-muscle-sets.md)).

## Where it lives in the data

| File | Key | What |
|---|---|---|
| [generator_spec_v1.json](../../generator_spec_v1.json) | `rule_tables.athletic.medball` | The rule, the weights, the substitutes |
| [model/rules.json](../../model/rules.json) | `medball` | Runtime copy (generated) |

Hard rule H11 in [AGENTS.md](../../AGENTS.md) §10. Master text: [BLAZE_CAMP_BRAIN.md](../../BLAZE_CAMP_BRAIN.md) §9.6.

## Related

[ADR-028](adr-028-power-first-horizontal-before-vertical.md) session order · [Athletes](../02-model/athletes.md) · [Equipment](../02-model/equipment.md)
