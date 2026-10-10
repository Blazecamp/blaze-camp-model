# ADR-033: The bilateral to unilateral scale runs from 90/10 to 10/90

How much of a person's lower-body work is done on two legs and how much on one is a dial, not a fixed split. It runs from 90 % bilateral and 10 % unilateral to the reverse, set by the kind of athlete, the phase of the year and pain. Bilateral work drives force. Unilateral work keeps the body healthy and able to rotate. The coach laid this out in round 1 and called the relationship very important.

| | |
|---|---|
| **Status** | Accepted (the scale and its end points). Most per-sport numbers are PROPOSED. |
| **Decided by** | Coach: UNI-02, UNI-03, UNI-10, CAT-13 (round 1, 2026-10-08) |
| **Replaces** | A narrow band of 35 to 70 % bilateral by goal (team's first version) |

## Decision (the rule)

**Bilateral** means both legs or both arms work together (squat, bench press). **Unilateral** means one side at a time (lunge, single-arm row).

| Who | Bilateral : unilateral | Source |
|---|---|---|
| Bodybuilders, powerlifters, at the start | about 50 : 50 | UNI-02 |
| Bodybuilders, powerlifters, later in the program | 80 : 20 or 90 : 10 | UNI-02 |
| Field athletes with a lot of change of direction (his example: tennis) | 20 : 80 to 10 : 90 | UNI-02 |
| Athletes in season | bilateral kept minimal | UNI-10 |
| Upper body | the same logic | UNI-03 |
| Anyone with pain or injury | adjusted | UNI-02 |

Inside unilateral work, where the weight is held matters (CAT-13):

| Loading | What it does | Used for |
|---|---|---|
| Contralateral (weight in the hand opposite the working leg) | pulls you into the hip | change-of-direction athletes |
| Ipsilateral (weight on the same side) | helps you get out of the hip | sprinters' acceleration, e.g. step-ups |

## Why

> "the unilateral work is more for health and keeping rotational foundations, and the bilateral is more for driving and creating forces." (UNI-02)

> "It should be a range anywhere from one side, like 90/10, to the other side, 10/90." (UNI-02)

> "The volume between unilateral and bilateral is very important." (conversation)

For field athletes he does not want them "to lose their rotational forces and skills" (UNI-02). In season he wants them to keep strength without trying "to drive changes in their body" (UNI-10).

## Context

His written programs sit near 50 : 50 (OBSERVED: physique days have one bilateral and one unilateral lower lift; baseball has 4 + 4 sets). The team asked for rough percentages by goal. His answer was much wider than the sheets show, and tied the share to the athlete rather than to a template.

## Options considered

| Option | What it meant | Outcome |
|---|---|---|
| A. 50 : 50 for everyone | What the sheets show | Not his rule |
| B. A narrow band by goal | 35 to 70 % bilateral | Replaced |
| C. A full slider by athlete, phase and pain | 90 : 10 to 10 : 90, adjustable | **Chosen** (UNI-02) |

## Consequences

- A 10/10 set (10 reps each side) counts as one set. Alternating lifts count as unilateral (UNI-01, UNI-07).
- Unilateral work progresses like bilateral work, on the same stairway (UNI-05).
- Unilateral reps are moderate to high by default. Heavy, low-rep unilateral work is optional (UNI-04).
- Court and combat athletes get more sideways and rotational single-leg work (UNI-12). The percentages are PROPOSED.
- Unilateral work takes longer and has to be counted in the session time (UNI-09). The factor is PROPOSED.
- The share is counted on knee- and hip-dominant compound lifts. Leg curls, leg extensions and isolation work are left out (team definition).
- Every sport profile carries its own share. Apart from his end points, those numbers are PROPOSED.

## Where it lives in the data

| File | Key | What |
|---|---|---|
| [generator_spec_v1.json](../../generator_spec_v1.json) | `rule_tables.bilateral_unilateral.definition`, `rule_tables.bilateral_unilateral.slider`, `rule_tables.bilateral_unilateral.profiles` | The scale and the share by kind of client |
| [generator_spec_v1.json](../../generator_spec_v1.json) | `rule_tables.contra_ipsi` | Contralateral and ipsilateral use |
| [generator_spec_v1.json](../../generator_spec_v1.json) | `derived_values.D10_bilateral_share` | How a person's target share is worked out |
| [synthesis/04_profiles.json](../../synthesis/04_profiles.json) | `bilateral_unilateral_model` | The model and his anchor points |
| [model/rules.json](../../model/rules.json) | `bilateral_share` | Runtime copy (generated) |

Each sport profile in `synthesis/04_profiles.json > profiles` has a `bilateral_unilateral` field. Master text: [BLAZE_CAMP_BRAIN.md](../../BLAZE_CAMP_BRAIN.md) §6.

## Related

[ADR-029](adr-029-pairing-hip-push-knee-pull.md) pairing · [ADR-030](adr-030-axial-loading-once-per-pattern.md) spine loading · [Bilateral and unilateral](../02-model/bilateral-unilateral.md)
