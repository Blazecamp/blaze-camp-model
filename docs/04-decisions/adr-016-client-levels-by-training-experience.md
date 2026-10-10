# ADR-016: Client level comes from training experience

A person's level says how much volume they start with. It comes from how long they have trained consistently and how long they have been away. It is separate from the level of an exercise. The coach defined the first two levels in round 1. The definition of the third level is the team's proposal.

| | |
|---|---|
| **Status** | Accepted for L1 and L2. The L3 definition and the "Pro setting" numbers are PROPOSED. |
| **Decided by** | Coach: PRG-05, CAT-06, GEN-02 (round 1, 2026-10-08) |
| **Replaces** | Four levels that mixed training experience with competition level; a "training age" field |

## Decision (the rule)

| Level | Who | Source |
|---|---|---|
| L1 (novice, "newby") | Less than about a year of consistent training. Also anyone back after 6 to 12 months or more away: the body is treated as a beginner's, the skills are not. | PRG-05 |
| L2 (intermediate) | Has gone to the gym consistently for over a year | PRG-05 |
| L3 (advanced) | 3+ years consistent and training 4+ days a week now, or a competitive physique or strength athlete | PROPOSED (he did not define it) |

- The form asks "training experience" in years, not "training age" (GEN-02).
- Client level (how much volume) and exercise level (how hard the movement is) are separate (CAT-06).

## Why

> "a novice is somebody with less than a year of training experience, or maybe less than 6 months around there." (PRG-05)

> "I don't want to make an ex-pro athlete go back to Level 1 for no reason." (PRG-05)

For someone who took a long break, he treats them as a beginner "as far as their body, but not necessarily as their skills, because they might pick up the skills right away" (PRG-05).

## Context

His sheets use NOVICE and NEWBY side by side. He confirmed they mean the same. In one of his examples a NOVICE does barbell deadlifts and leg press, which his library files as moderate or advanced. That is why the two kinds of level had to be separated.

## Options considered

| Option | What it meant | Outcome |
|---|---|---|
| A. One level for everything | A beginner gets only beginner exercises | Rejected (CAT-06) |
| B. Four levels, the top one for competitors | Competition level raises volume | Retired: competition level changes the sport profile and the care, not the volume level (PRG-09) |
| C. Three levels by training experience | L1, L2, L3 | **Chosen** |

## Consequences

- The level sets the starting sets and the ceilings ([ADR-021](adr-021-starting-sets-and-ceilings-by-level.md)).
- The tool should explain the level in plain words, so nobody is sent back to Level 1 without a reason.
- An ex-pro starts at L1 only briefly.
- High school, college and pro athletes need about the same plan structure. Loads, speeds and care differ (PRG-09).
- One algorithm for reps, sets and volume at every level (PRG-06).
- The line between L1 and L2 is read as 12 months of consistent training (INFERRED from PRG-05).
- An optional "Pro setting" above the normal ceilings comes from his words "Maybe we can add a pro level" (R2-VOL-06). Its numbers are PROPOSED.

## Where it lives in the data

| File | Key | What |
|---|---|---|
| [generator_spec_v1.json](../../generator_spec_v1.json) | `vocab.levels` | L1, L2, L3 and the Pro setting |
| [generator_spec_v1.json](../../generator_spec_v1.json) | `derived_values.D3_client_level` | How the level is worked out from the answers |
| [generator_spec_v1.json](../../generator_spec_v1.json) | `inputs_schema.fields.F17` | The training-experience question |
| [synthesis/12_volume_algorithm_v1.json](../../synthesis/12_volume_algorithm_v1.json) | `levels` | Levels in the volume algorithm |
| [model/rules.json](../../model/rules.json) | `levels.client` | Runtime copy (generated) |

Master text: [BLAZE_CAMP_BRAIN.md](../../BLAZE_CAMP_BRAIN.md) §3.3.

## Related

[ADR-012](adr-012-levels-from-load-position.md) exercise levels · [Volume](../02-model/volume.md)
