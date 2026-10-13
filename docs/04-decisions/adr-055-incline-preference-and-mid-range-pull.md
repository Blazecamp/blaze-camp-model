# ADR-055: Incline pressing before overhead pressing, and a mid-range pull category

Two decisions about pressing and pulling angles. First, the library gets a small **mid-range pull** category between the horizontal pull and the vertical pull. Second, for bodybuilders and the general population the plan prefers an incline press over an overhead press in the vertical or mid-range push slot. Overhead pressing stays in the program as a variation. The coach decided both in one round-4 answer.

| | |
|---|---|
| **Status** | Accepted. The selection weight, the two new row records and one credit detail are PROPOSED. |
| **Decided by** | Coach: R4-LIB-03, RIGHT with words (round 4, 2026-10-11); R4-SES-05 names "an incline press" for slot 3 of Day B |
| **Replaces** | Overhead press as the default vertical push for every client |

## Decision (the rule)

| Subject | Rule | Source |
|---|---|---|
| Mid-range pull | Its own small category between horizontal and vertical pull: high row, 45-degree row, the face-pull angle. | R4-LIB-03 |
| Mid-range push | Already his: incline and landmine presses ('MID RANGE PUSH' in his sheet, OBSERVED). | OBSERVED; R4-LIB-03 |
| Bodybuilders | Focus more on incline pressing than on overhead pressing. | R4-LIB-03 |
| General population | Bias incline pressing over overhead pressing. | R4-LIB-03 |
| Overhead pressing | Stays available: "they're part of the program, and we should have that variability". | R4-LIB-03 |

A **mid-range** lift moves at an angle between straight ahead (horizontal) and straight up or down (vertical).

## Why

> "That's correct, and ideally we want to prioritize incline for the pushing instead of overhead pressing, but they're part of the program, and we should have that variability. For bodybuilders, I would rather focus more on incline pressing than on overhead pressing. For the general population, I would rather focus more on incline pressing and bias incline pressing instead of overhead pressing." (R4-LIB-03)

He gave the preference, not a reason. Do not write one for him.

## Context

His sheets have a 'MID RANGE PUSH' group and no matching pull group. The team asked whether to add one. He said yes and used the answer to set the pressing preference. His round-4 description of Day B also reads "Vertical push, like shoulder press or an incline press. That is more vertical than horizontal." (R4-SES-05)

## Options considered

| Option | What it meant | Outcome |
|---|---|---|
| A. Two pull directions only | Horizontal and vertical | Replaced |
| B. Add a mid-range pull category | A third, small group | **Chosen** |
| C. Remove overhead pressing for these clients | Incline only | Not chosen: "we should have that variability" |
| D. Prefer incline, keep overhead as a swap | A bias in selection | **Chosen** |

## Consequences

- For muscle, general fitness, fat loss and "stay active" goals, the vertical / mid-range push slot leads with an incline press. Overhead presses stay in the swap list.
- He named bodybuilders and the general population. Athletes and strength clients were not named, so their press selection is unchanged. PROPOSED: the non-competitive "stay athletic" adult counts as general population.
- Horizontal still comes before vertical ([ADR-028](adr-028-power-first-horizontal-before-vertical.md)). A mid-range lift sits between them.
- The mid-range pull category has two new row records (high row machine, 45-degree cable row). Both are PROPOSED records and optional add-ons ([ADR-054](adr-054-proposed-exercises-are-optional-add-ons.md)), offered as swaps for a row or a pulldown. A template does not pick them.
- Face pulls stay shoulder work for counting (LIB-10, R2-LIB-04). "The face-pull angle" names the direction only.
- PROPOSED: a mid-range pull counts as a horizontal pull for credit.
- PROPOSED: an incline press of 30 to 45 degrees counts for chest. A high-incline press counts 1 set for front delts and half a set for chest. Open for the coach. **Answered by R5-VOL-01 (round 5): a high-incline press counts 1.0 chest + 0.25 front delts + 0.25 triceps.** Round 5 also keeps overhead pressing in the plan for shoulder health (R5-ATH-04).
- A check (V32) warns when incline or mid-range presses are fewer than half of that slot's picks for these clients. It is a warning, not a failure.

## Where it lives in the data

| File | Key | What |
|---|---|---|
| [coach_answers_round4.md](../../coach_answers_round4.md) | R4-LIB-03, R4-SES-05 | His answers |
| `model/rules.json` | `selection.mid_range` | The push and pull tags, patterns and which slots they can fill |
| `model/rules.json` | `selection.incline_first` | The slot, the goals it applies to, the weight |
| `model/catalog.json` | `exercises[].pattern` = `MRPULL`; tags `mid_range_push`, `mid_range_pull` | The records |
| [coverage_matrix_round4.md](../../coverage_matrix_round4.md) | R4-LIB-03 | The master-document section and the spec key |

## Related

[ADR-028](adr-028-power-first-horizontal-before-vertical.md) · [ADR-051](adr-051-coach-templates-are-the-skeleton.md) · [Categories](../02-model/categories.md) · [Coach answers: library details](../03-coach-answers/library-details.md#r4-lib-03)
