# ADR-039: Olympic lifts for everyone in athletic training

Anyone whose plan includes athletic training gets Olympic lifts. Beginners do the simpler versions with dumbbells, kettlebells and hang positions. Intermediate and advanced lifters do the full lifts. They can appear up to four times a week: cleans on squat-pattern days and snatches on hinge-pattern days. The coach set "everyone" in round 1 and the details in round 2.

| | |
|---|---|
| **Status** | Accepted. The dose for endurance athletes and the percentage switch are PROPOSED. |
| **Decided by** | Coach: ATH-10 (round 1); R2-ATH-04, R2-ATH-05, R2-ATH-08, R2-GEN-06 (round 2); R3-ATH-02 (round 3) |
| **Replaces** | Olympic lifts for intermediate and advanced athletes only, off-season only |

## Decision (the rule)

**Olympic lifts** are the clean, the snatch and their variations: fast lifts that train power.

| Item | Rule | Source |
|---|---|---|
| Who | Everyone in athletic training | ATH-10 |
| Beginners | Dumbbell and kettlebell snatches, hex-bar jumps, hang pulls, hang cleans. No bumper plates needed. | ATH-10 |
| Intermediate and up | The full scope | ATH-10 |
| How often | Up to four times a week | R2-ATH-04 |
| Which day | Snatch days are hinge-pattern days (his words below). Clean days are squat-pattern days (the team's reading of the same answer). | R2-ATH-04 |
| Reps, full squat cleans and snatches | 3 to 5 per set | R2-ATH-05 |
| Reps, dumbbell, kettlebell and pull versions | His ramp: 4×8 at 75 % up to 4×4 at 90 % | PER-09, R2-ATH-05 |
| Load | By effort and speed. Percentages are for competitive Olympic lifters. | R2-GEN-06 |
| Over 60 | Off by default; can be switched on with the warning | R2-ATH-08, R3-ATH-02 |
| Youth | From the floor from about age 14, after one block of hang work | R2-ATH-08 |

## Why

> "everyone gets Olympic lifts." (ATH-10)

> "According to my programming, it could be done four times a week." (R2-ATH-04)

> "I take snatches a little bit more hingy than squatty" (R2-ATH-04)

On reps and load: "this also constitutes the coach's eye and how the athlete's feeling to make sure that they're fast and powerful." (R2-ATH-05)

## Context

The team assumed Olympic lifts were for intermediate and advanced athletes in the off-season. He widened it to everyone in athletic training, with easier versions for beginners. In round 2 the team proposed one light session a week in season. He marked it RIGHT and added that it need not be once a week. The team also pointed out that eight reps is a lot for a full squat clean, and he agreed to keep the eights for the simpler versions.

## Options considered

| Option | What it meant | Outcome |
|---|---|---|
| A. Intermediate and advanced athletes only | Beginners skip power lifts | Rejected (ATH-10) |
| B. Once a week | One Olympic day | Not his practice (R2-ATH-04) |
| C. Everyone in athletic training, scaled by level, up to four days | His programming | **Chosen** |

## Consequences

- Olympic lifts never count as muscle sets ([ADR-020](adr-020-athletic-work-never-counts-as-muscle-sets.md)) and do not count as heavy spinal loading ([ADR-030](adr-030-axial-loading-once-per-pattern.md)).
- They come before the heavy strength lift ([ADR-028](adr-028-power-first-horizontal-before-vertical.md)).
- In season: a light piece, dropped in heavy game weeks (team proposal he marked RIGHT, R2-ATH-04).
- Swimmers get Olympic lifts on 2 to 3 dryland days (R3-ATH-01).
- The full versions are named with the word "squat", for example Squat Clean (LIB-07). The push press is the easier lift; the push jerk is more technical (LIB-13).
- Competitive Olympic weightlifting is its own kind of programming and is not built yet (R2-GEN-06).
- The person can switch off a day's Olympic block ([ADR-005](adr-005-editable-plan-switches-and-supersets.md)).

## Where it lives in the data

| File | Key | What |
|---|---|---|
| [generator_spec_v1.json](../../generator_spec_v1.json) | `rule_tables.athletic.olympic` | Who, how often, reps, load, older, youth |
| [synthesis/04_profiles.json](../../synthesis/04_profiles.json) | `olympic_by_level` | What each level gets |
| [model/rules.json](../../model/rules.json) | `olympic` | Runtime copy (generated) |

Each sport profile in `synthesis/04_profiles.json > profiles` has an `olympic_policy` field. Master text: [BLAZE_CAMP_BRAIN.md](../../BLAZE_CAMP_BRAIN.md) §9.5.

## Related

[ADR-026](adr-026-effort-in-reps-in-reserve.md) effort · [ADR-040](adr-040-older-adult-defaults.md) older adults · [Athletes](../02-model/athletes.md)
