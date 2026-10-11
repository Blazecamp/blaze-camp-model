# ADR-050: No time-fitting. Sessions are sized by exercise count

The plan is never fitted to a number of minutes. The form does not ask how long a person wants to train. A session is sized by its number of exercises, using the counts the coach gave for each kind of client. Each day prints an average time as information only. Nothing is cut, moved, reshaped or flagged because of time. The coach decided this on 2026-10-10 and confirmed the details in round 4. It retires the round-3 rule for what gives when time is short ([ADR-032](adr-032-time-vs-minimums-order.md)).

| | |
|---|---|
| **Status** | Accepted. The width of the printed time range, the default count inside each range and the two extra client types are PROPOSED. |
| **Decided by** | Coach: CT-01 (2026-10-10); R4-SES-01, R4-SES-02, R4-SES-04 (round 4, 2026-10-11) |
| **Replaces** | [ADR-032](adr-032-time-vs-minimums-order.md) (the time check and its order); session length as an intake field; exercise caps by minutes; the 100 % / 110 % day-length rules; time offers |

## Decision (the rule)

1. **Session minutes are not an input and not a limit** (CT-01, R4-SES-01).
2. **A session is sized by exercise count** (R4-SES-02). The count leaves out the warm-up and the 2 core exercises.

| Client type | Exercises per session | Source |
|---|---|---|
| General fitness, fat loss | 5 to 7 | R4-SES-02 (he widened our 5 to 6) |
| Aesthetics, bodybuilding | 6 to 8 | R4-SES-02 |
| Strength | 5 to 6 | R4-SES-02 |
| Bootcamp | 5 to 7 stations | R4-SES-02, PRG-03 |
| Field athletes, off-season | up to 12 | R4-SES-02, VOL-08, R2-SES-04 |
| Older adults, 60 and over | 5 to 6 | R4-SES-02 |

3. **The counts are recommendations in a template.** The person adds or removes exercises.
4. **Each day prints an average time** as a range, marked as an estimate (CT-01, R4-SES-01).
5. **Nothing is dropped automatically** (R4-SES-04). The template comes out complete. The person decides what to keep and what to take away. The plan only names what is easiest to remove: conditioning finishers, extra jump or throw stations, small-muscle accessories and bonus exercises.
6. **What still holds.** The floor of 10 weekly sets from 3 training days ([ADR-017](adr-017-floor-of-10-on-focus-groups.md)), every ordering and pairing rule, supersets as a recommendation, and switching blocks off ([ADR-005](adr-005-editable-plan-switches-and-supersets.md)).

## Why

> "You need to stop trying to be responsible for the people's time. We just need to be able to give them that responsibility and not worry about how long the session is going to be." (CT-01)

> "We can give an average recommendation of what it should take, but we will never know what it's going to take." (CT-01)

> "Drop it. We don't need it. Sometimes it might be 45 minutes. Sometimes they can take off exercises and make it faster. Sometimes they can add exercises and make it longer." (R4-SES-01)

On the counts: "This is just our recommendation. These are templates that we're giving them for them to add or take away" (R4-SES-02). On what to leave out: "That's something for the athlete to adjust." (R4-SES-04)

## Context

Round 3 asked what should give when the chosen days and minutes could not hold his minimums, and he approved an order ([ADR-032](adr-032-time-vs-minimums-order.md)). Building that order was the hardest part of the engine. Reviewers of the sample plans kept finding groups dropped for time, days over their minutes and stairways that went flat. The planned rebuild as an optimizer ([ADR-048](adr-048-optimizer-rebuild-of-the-planner.md)) existed mostly to solve the time fit. The coach then removed the requirement: "I want you to not get complicated over the time." (CT-01)

## Options considered

| Option | What it meant | Outcome |
|---|---|---|
| A. Keep fitting plans to chosen minutes | The round-3 order, solved exactly by an optimizer | Retired by CT-01 |
| B. Keep session length as an optional, informational input | Ask, but never act on it | Not chosen. "Drop it. We don't need it." (R4-SES-01) |
| C. Size by exercise count, print an average time | His counts, an estimate on each day | **Chosen** (CT-01, R4-SES-01, R4-SES-02) |
| D. Leave things out in a fixed order when a session is full | Accessories first, then extra stations, then finishers | Not chosen as an automatic rule. The person picks (R4-SES-04). The plan names the easiest items only. |

## Consequences

- The time-fit parts of R3-SES-02 are superseded. Its other parts stand: supersets are still recommended, blocks can be switched off, exercises can be added or removed.
- The session lengths he gave earlier (UNI-09: 45 to 60 minutes for everyday people, about 1.5 hours for athletes) are now background for the estimate. They limit nothing.
- An intake that still sends a session length is accepted and the value is ignored, with a notice.
- No check, warning or benchmark metric reads minutes. Check V3 fails a plan that still carries a session length, a minute limit, a time check or a time offer.
- PROPOSED: the estimate is printed as a range 10 % each way, rounded to 5 minutes. The minutes-per-set numbers behind it were never his.
- PROPOSED: the default count inside each range (7 for general fitness and aesthetics, 6 for strength and older adults, 7 stations for bootcamp, 12 for field athletes).
- PROPOSED: two client types he did not list. The CrossFit-style class takes 5 to 7. The non-competitive "stay athletic" adult takes 5 to 10, read from his 'JUSTICE LEAGUE' tab (OBSERVED). Both wait for his word.
- When a template cannot hold a group's planned sets, the plan says so in words ([ADR-051](adr-051-coach-templates-are-the-skeleton.md)). It does not shrink other groups to make room.

## Where it lives in the data

| File | Key | What |
|---|---|---|
| [coach_answers_time_2026-10-10.md](../../coach_answers_time_2026-10-10.md) | CT-01 | His words, and what they supersede |
| [coach_answers_round4.md](../../coach_answers_round4.md) | R4-SES-01, R4-SES-02, R4-SES-04 | His answers |
| `model/rules.json` | `session.size` | The count range and default for each client type |
| `model/rules.json` | `session.easy_to_remove` | The order of the "easiest to remove" list; `automatic` is false |
| `model/rules.json` | `time_model` (`use: estimate_only`), `render.estimate` | The estimate and how it is printed |
| `engine/estimate.mjs` | | The estimate code. Nothing reads it to cut or reshape. |
| [coverage_matrix_round4.md](../../coverage_matrix_round4.md) | CT-01, R4-SES-01, -02, -04 | The master-document section and the spec key for each answer |

## Related

[ADR-051](adr-051-coach-templates-are-the-skeleton.md) his templates · [ADR-052](adr-052-two-day-rule.md) the 2-day rule · [ADR-058](adr-058-engine-v05-template-first-not-the-large-planner.md) the engine that follows from this · [Sessions](../02-model/sessions.md) · [Coach answers: sessions and order](../03-coach-answers/sessions-and-order.md#ct-01)
