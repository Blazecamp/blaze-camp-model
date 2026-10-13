# ADR-051: The coach's own templates are the skeleton of every day

The tool does not invent day layouts. Every training day is built on one of the coach's own templates, slot for slot. His "full body" day is an A day or a B day: A is pull plus knee dominant, B is push plus hip dominant, about 6 exercises each. Push / pull / legs is his other main layout. The template comes out complete, and the person edits it. He set this in round 4, after marking both of the team's ideas for full-body days NOT RIGHT.

| | |
|---|---|
| **Status** | Accepted. The order inside a pair and two credit details are PROPOSED (see Consequences). |
| **Decided by** | Coach: R4-SES-05, verdict NOT RIGHT with a full description (round 4, 2026-10-11); R4-SES-04; his sheets (OBSERVED) |
| **Replaces** | Day layouts assembled by the engine from rules; "2 to 4 exercises for every muscle, never 1" on full-body days (R2-SES-05) |

## Decision (the rule)

**The A / B days.** A **knee-dominant** lift bends mostly at the knee (squat, lunge). A **hip-dominant** lift bends mostly at the hip (deadlift, hip thrust).

| Slot | Day A: pull + knee dominant | Day B: push + hip dominant |
|---|---|---|
| 1 | Horizontal pull, two arms (a row) | Horizontal push (bench press, machine chest press) |
| 2 | Two-leg knee-dominant lift (a squat) | Two-leg hip-dominant lift (deadlift, hip extension or hip thrust) |
| 3 | Vertical pull (a lat pulldown) | Vertical push, or an incline press |
| 4 | Single-leg knee-dominant lift (a lunge) | Single-leg hip-dominant lift |
| 5 | Biceps | Triceps |
| 6 | Leg extension | Leg curl |

- A day runs 6 to 8 exercises. The 7th and 8th are "an extra small muscle exercise at the end, or a core" (R4-SES-05). His 'AESTHETICS - FULL BODY - 4 DAYS' tab adds calves to the A day and a side raise to the B day (OBSERVED), and the data uses those as slot 7. Slot 8 is PROPOSED: rear delts on A, calves on B.
- The default week for 4 days: A, B, rest, A, B, rest, rest. The rest days can hold cardio, accessories and Focus work.
- Other layouts come from his sheets the same way: push / pull / legs (3 or 6 days), the 3-day builder (A, B and a C day), bootcamp, the athletic days (the athletic block first, then the same A / B lifts), the CrossFit-style class, HYROX, and strength (the work, the accessory, the nuance, the survival).
- **Nothing is dropped automatically** (R4-SES-04). When a template cannot hold a group's planned sets, the plan adds his bonus exercise on the optional day. If there is no optional day, the group is capped at what the slots hold and the plan says so.

## Why

> "The template is usually 6 exercises for the full-body days because we do that A-day/B-day of upper/lower" (R4-SES-05)

> "Day A: back, quads, and biceps. It's going to be more pull- and knee-dominant movements." / "Day B: push with hip-dominant movements. Let's say, for example, chest, shoulders, and tricep with hamstrings and glutes." (R4-SES-05)

> "We don't design full bodies only with push, pull, and legs. This is the model that I believe is the greatest one." (R4-SES-05)

The A / B split is his pairing rule made into a week: knee dominant with pull, hip dominant with push ([ADR-029](adr-029-pairing-hip-push-knee-pull.md)).

## Context

Two of his rules did not fit together on a full-body day: about 5 to 7 exercises a session, and 2 to 4 exercises for every muscle. Six muscles times two exercises is twelve. The team offered two ways out in round 4: count by area (legs, push, pull), or make full-body days 10 to 12 exercises long. He rejected both and described his own template instead. Reviewers of the earlier sample plans had also found days that did not look like his sheets.

## Options considered

| Option | What it meant | Outcome |
|---|---|---|
| A. Count by area | Legs, push and pull each get 2 exercises | NOT RIGHT (R4-SES-05) |
| B. Longer full-body days | 10 to 12 exercises so every muscle gets 2 | NOT RIGHT (R4-SES-05) |
| C. His A / B template, about 6 exercises | Slots fixed by pattern and by one or two legs | **Chosen** |
| D. Let an optimizer choose the layout | The large planner | Not built ([ADR-058](adr-058-engine-v05-template-first-not-the-large-planner.md)) |

## Consequences

- On an A or B day a group can have one exercise (biceps on A, triceps on B). So "never one exercise" ([ADR-031](adr-031-two-to-four-exercises-per-group.md)) now holds on split days such as push / pull / legs. A full-body day follows the template: 1 to 4 exercises for a group.
- Each slot keeps its kind in every block: a two-leg slot holds a two-leg lift, a single-leg slot a single-leg lift, and slot 1 of the A day is a two-arm row. The bilateral-to-unilateral dial ([ADR-033](adr-033-bilateral-unilateral-scale.md)) acts only on the slots the template leaves open. The team read this from his words "bilateral, symmetrical" and "unilateral" for each slot.
- Heavy squat and heavy deadlift still fall on different days, once each a week ([ADR-030](adr-030-axial-loading-once-per-pattern.md)). The second A day's squat slot takes a leg press or similar. The second B day's hinge slot takes a hip thrust or a back extension.
- PROPOSED: the order inside a pair. His sheet lists the leg lift first (leg press, then row). His round-4 answer lists the upper lift first (row, then squat). The data follows round 4 because it is newer.
- PROPOSED: an incline press in slot 3 of the B day counts for chest once a week. A high-incline press counts 1 set for front delts and half a set for chest. **Answered by R5-VOL-01 (round 5): a high-incline press counts 1.0 chest + 0.25 front delts + 0.25 triceps.** His sheet labels that slot "Chest/Shoulders".
- Open for the coach: athletic A / B days now keep a two-leg lift in slot 2 on every day. That gives field athletes less single-leg work than his earlier 80 to 90 % answer (UNI-02).
- On a 4-day A / B plan a group such as chest has few slots. A high set target may not fit, and the plan says so. Push / pull / legs holds more.

## Where it lives in the data

| File | Key | What |
|---|---|---|
| [coach_answers_round4.md](../../coach_answers_round4.md) | R4-SES-05, R4-SES-04 | His description of both days |
| `synthesis/05_templates.json` | `generator_split_templates` | His templates as read from the sheets |
| `model/templates.json` | `families.<family>.days.<n>.day_types.<day>.skeleton`, `.stations[].rank` | The compiled day types: `gym_A`, `gym_B`, `gym_C`, `athletic_A` / `_B` / `_C`, `ppl_push` / `_pull` / `_legs`, `class_*` |
| `model/rules.json` | `session.full_body_days`, `session.exercises_per_group`, `selection.skeleton_laterality`, `placement` | The rule, the per-group counts, slot kinds, and how sets are placed |
| `dumps/BYOP/` | | His sheet tabs, for checking slot by slot |
| [coverage_matrix_round4.md](../../coverage_matrix_round4.md) | R4-SES-05 | The master-document section and the spec key |

## Related

[ADR-050](adr-050-no-time-fitting-sessions-sized-by-exercise-count.md) session size · [ADR-052](adr-052-two-day-rule.md) 2 days a week · [ADR-055](adr-055-incline-preference-and-mid-range-pull.md) incline in slot 3 · [Sessions](../02-model/sessions.md) · [Coach answers: sessions and order](../03-coach-answers/sessions-and-order.md#r4-ses-05)
