# ADR-031: Two to four exercises per group on its day, never one

On any day a muscle group is trained, it gets 2 to 4 exercises. It never gets just one. This holds on full-body days too, so those days can run longer. Calves are the exception, with one exercise of 3 sets per leg day. The coach set "never one exercise" in round 2 and approved the way groups are counted in round 3. The same answers set the size of a session.

| | |
|---|---|
| **Status** | Accepted for split days. Changed for full-body days in round 4: they follow his A / B template, where a group can have one exercise ([ADR-051](adr-051-coach-templates-are-the-skeleton.md)). |
| **Decided by** | Coach: VOL-07, VOL-08 (round 1); R2-SES-04, R2-SES-05, verdict PARTLY (round 2); R3-SES-01 (round 3) |
| **Replaces** | At most 2 exercises per muscle per session; 1 to 2 per muscle on full-body days (team proposals) |

> **Update, round 4 (R4-SES-05, R4-SES-02, CT-01).** His full-body day is an A day or a B day of about 6 exercises. On it a group can have a single exercise: biceps on A, triceps on B. So on a full-body day a group gets 1 to 4 exercises, as his template says. "2 to 4, never 1" still holds on split days such as push / pull / legs. Session size is now a count by client type (general 5 to 7, aesthetics 6 to 8, strength 5 to 6, bootcamp 5 to 7 stations, field athletes up to 12, older adults 5 to 6), not a count by minutes, and session length limits nothing ([ADR-050](adr-050-no-time-fitting-sessions-sized-by-exercise-count.md)).

## Decision (the rule)

| Item | Rule | Source |
|---|---|---|
| Exercises per trained group per day | 2 to 4, never 1 | R2-SES-05 |
| Split days | usually 3 to 4 | VOL-07 |
| What a "group" is | the focus groups: hips = glutes + hamstrings, shoulders = front + side + rear delts | R3-SES-01 |
| Calves | one exercise × 3 sets per leg day | VOL-17, R3-SES-01 |
| Resistance session | about 5 to 7 exercises (the round-1 mapping to minutes, 5 in 45, 6-7 in 60, 8-9 in 75-90, is retired: R4-SES-01, R4-SES-02) | VOL-08, VOL-16, R4-SES-02 |
| Field athlete, off-season | at most 12 exercises plus the 2 core exercises | VOL-08, R2-SES-04 |

## Why

> "No, full-body days need to have the same 2-4 exercises per muscle that day, so it might be a little longer day." (R2-SES-05)

> "there's never one exercise, so from 2 all the way to 4" (R2-SES-05)

On the athlete's cap: "It's going to be 10 to 12, so max maybe 12 different exercises." (VOL-08)

## Context

A full-body day holds only 5 to 7 exercises. The team proposed 1 to 2 exercises per muscle on those days. He said no. That raised a counting problem: with every small muscle counted alone, a full-body day would need far too many exercises. Round 3 asked how to count, and he approved counting by focus group ([ADR-017](adr-017-floor-of-10-on-focus-groups.md)).

For field athletes he had said "max maybe 12" in one answer and "12 to 14" in another. Round 2 settled it: 12 plus the 2 core exercises.

## Options considered

| Option | What it meant | Outcome |
|---|---|---|
| A. 1 to 2 exercises per muscle on full-body days | Shorter days | Rejected (R2-SES-05) |
| B. 2 to 4 for every single muscle | Far too many exercises on a full-body day | Not workable |
| C. 2 to 4 for every focus group trained that day | Fewer units to fill | **Chosen** (R3-SES-01) |

## Consequences

- Full-body days are longer than split days for the same person.
- When a day cannot hold 2 exercises for a group, the plan does not squeeze them in. It trains fewer groups directly ([ADR-032](adr-032-time-vs-minimums-order.md)).
- For field athletes the 2 to 4 applies to each group trained that day, inside the 12. With the cross pattern that leaves 2 jump or throw stations and 1 Olympic lift (R3-SES-01).
- Warm-up drills never count toward the cap. A superset of two small isolation exercises counts as one (R2-SES-04).
- Session length (UNI-09: about 1.5 hours for athletes, bodybuilders and powerlifters; 45 minutes to 1 hour for everyday people) is now background for the printed time estimate only. It is not asked and limits nothing (CT-01, R4-SES-01).

## Where it lives in the data

| File | Key | What |
|---|---|---|
| [generator_spec_v1.json](../../generator_spec_v1.json) | `rule_tables.session_limits.exercises_per_muscle_on_its_day`, `rule_tables.session_limits.full_body_days` | The 2 to 4 rule |
| [generator_spec_v1.json](../../generator_spec_v1.json) | `rule_tables.session_limits.resistance_exercises`, `rule_tables.session_limits.field_athlete_off_season` | Session sizes |
| [generator_spec_v1.json](../../generator_spec_v1.json) | `validation_checks.V23_exercises_per_group` | The check |
| [model/rules.json](../../model/rules.json) | `session.exercises_per_group`, `session.athlete_cap` | Runtime copy (generated) |

Hard rule H18 in [AGENTS.md](../../AGENTS.md) §10.

## Related

[ADR-025](adr-025-where-a-new-set-goes.md) where sets go · [Sessions](../02-model/sessions.md)
