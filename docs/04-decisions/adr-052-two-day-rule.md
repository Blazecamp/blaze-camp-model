# ADR-052: Two training days a week: every big muscle, fewer sets

A person who trains only 2 days a week still trains every big muscle group. Each group gets fewer weekly sets, about 6 to 8 instead of 10. The plan says so and suggests a third day. It never drops whole muscle groups and never piles on more exercises. The coach approved this in round 4. It replaces the round-3 step "train fewer muscles directly".

| | |
|---|---|
| **Status** | Accepted. The treatment of small groups on 2 days is PROPOSED. |
| **Decided by** | Coach: R4-SES-03, RIGHT with words (round 4, 2026-10-11) |
| **Replaces** | Step 2 of the round-3 order: "train fewer muscles directly", big movers first (R3-SES-02, [ADR-032](adr-032-time-vs-minimums-order.md)) |

## Decision (the rule)

| Training days a week | Weekly sets per trained group | Source |
|---|---|---|
| 2 | About 6 to 8 for every big group | R4-SES-03 |
| 3 or more | At least 10 (the floor) | R2-VOL-06, [ADR-017](adr-017-floor-of-10-on-focus-groups.md) |

- Two full-body days cover every big group (round 5, R5-GEN-01: "Two full-body days would be more beneficial"; round 4 had one A day and one B day, [ADR-051](adr-051-coach-templates-are-the-skeleton.md)). Each day trains a knee lift with a pull and a hip lift with a push.
- The plan prints the rule and suggests a third day. That line is a recommendation only.
- The plan never drops a whole muscle group, and never adds exercises to force 10 sets into 2 days.
- The person can still add, remove or adjust.

## Why

> "That sounds right, but if you find that there is something better that we can give them, then good. If not, if this sounds pretty logical, it makes sense, and the data backs it up, the science backs it up, then we leave it there." (R4-SES-03)

> "People can add or remove or adjust accordingly. That's fine. We can maybe give them a small recommendation, but it's only a recommendation." (R4-SES-03)

## Context

With his exercise counts ([ADR-050](adr-050-no-time-fitting-sessions-sized-by-exercise-count.md)), two sessions cannot give every muscle 10 or more sets. His round-3 answer was to train fewer muscles directly and leave the small ones to the credit from compound lifts. The team asked which he wanted now that time-fitting is gone. He approved training everything with fewer sets.

## Options considered

| Option | What it meant | Outcome |
|---|---|---|
| A. Fewer muscles, each at 10 sets | Big movers only; arms and calves from compound credit | Replaced (it was R3-SES-02 step 2) |
| B. Every big muscle at about 6 to 8 sets | Say so and suggest a third day | **Chosen** (R4-SES-03) |
| C. More exercises per session | Reach 10 by making the two days longer | Not chosen: "we do NOT pile on more exercises" (the proposal he marked RIGHT) |

## Consequences

- The floor of 10 now reads: "when there are 3 or more training days". On 2 days the lower number is the rule, not a failure.
- The stairway still climbs on 2 days: a big group starts at 6 and ends at 8 weekly sets, plus any Focus add.
- PROPOSED: small groups (biceps, triceps, shoulders, calves) take at most the same 6 to 8 on 2 days. He spoke only of big muscles.
- He left the door open to "something better". Any research note on 2-day volume is labelled SCIENCE. It can go to him "for discussion"; it never overrules his answer.
- Check V22 reads the floor as 10 from 3 days and 6 for big groups on 2 days.

## Where it lives in the data

| File | Key | What |
|---|---|---|
| [coach_answers_round4.md](../../coach_answers_round4.md) | R4-SES-03 | His answer |
| `model/rules.json` | `volume.two_day` | `days_max: 2`, `weekly_sets: [6, 8]`, `suggest_days: 3`, and the two "never" items |
| `model/rules.json` | `volume.floor.applies_from_days` | 3 |
| [coverage_matrix_round4.md](../../coverage_matrix_round4.md) | R4-SES-03 | The master-document section and the spec key |

## Related

[ADR-017](adr-017-floor-of-10-on-focus-groups.md) the floor · [ADR-050](adr-050-no-time-fitting-sessions-sized-by-exercise-count.md) · [Volume](../02-model/volume.md) · [Coach answers: sessions and order](../03-coach-answers/sessions-and-order.md#r4-ses-03)
