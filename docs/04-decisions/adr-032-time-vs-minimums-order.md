# ADR-032: When time is short, what gives, and in what order

Sometimes the days and minutes a person picks cannot hold the coach's minimums. The plan then follows a fixed order: tell the person and offer more time; if they keep their time, train fewer muscle groups directly; recommend supersets; and keep the stairway climbing on what is trained. It never squeezes 2 to 4 exercises per group into a day that cannot hold them. The coach approved this order in round 3. The team called it the biggest open decision of that round.

| | |
|---|---|
| **Status** | **Retired** (2026-10-10). Replaced by [ADR-050](adr-050-no-time-fitting-sessions-sized-by-exercise-count.md) and [ADR-052](adr-052-two-day-rule.md). It was Accepted from round 3 until then. |
| **Decided by** | Coach: R3-SES-02, RIGHT with words (round 3, 2026-10-09) |
| **Replaces** | The earlier time-overflow rule: superset, then cut sets in a fixed order when a day ran past its length |

> **Retired. Do not build this.** On 2026-10-10 the coach removed time-fitting: "You need to stop trying to be responsible for the people's time." (CT-01). Round 4 confirmed it: the form no longer asks for a session length (R4-SES-01), sessions are sized by exercise count (R4-SES-02), nothing is dropped automatically (R4-SES-04), and a 2-day week trains every big muscle with about 6 to 8 sets instead of training fewer muscles (R4-SES-03). **What still stands from R3-SES-02:** supersets are recommended, blocks can be switched off, and exercises can be added or removed ([ADR-005](adr-005-editable-plan-switches-and-supersets.md)). The text below is kept as history, so nobody rebuilds the time check. The data keys it lists are retired too.

## Decision (the rule)

The minimums that take time:

| Minimum | Source |
|---|---|
| 10 sets a week per trained group | [ADR-017](adr-017-floor-of-10-on-focus-groups.md) |
| 2 to 4 exercises per group on its day | [ADR-031](adr-031-two-to-four-exercises-per-group.md) |
| 3 calf sets per leg day | VOL-17, R3-SES-01 |
| A stairway that climbs | [ADR-022](adr-022-every-plan-is-a-stairway.md) |

When the time cannot hold them, in this order (R3-SES-02):

1. **Tell them up front** and offer another day or longer sessions.
2. **If they keep their time, train fewer muscles directly.** Big movers first. Arms, calves and rear delts then get their work only from compound lifts.
3. **Use supersets** to save time.
4. **The stairway climbs** on the muscles that are trained. Never flat.

Never: squeeze 2 to 4 exercises per muscle into a day that cannot hold them.

**Big movers** are the large muscle groups that carry the main lifts. The team reads that as hips, quads, back and chest; he approved the phrase, not a list. A **compound lift** uses more than one joint, so it also works smaller muscles. A **superset** is two exercises done back to back.

## Why

> "Yeah, this is fine. Recommend doing supersets so that it's a faster workout, but they should be able to get things done." (R3-SES-02)

The order is the team's proposal, and he marked it RIGHT. The idea behind step 2 is to do a few things properly rather than everything below the minimum.

## Context

Before round 3 the model had only a time-overflow rule: when added sets pushed a day past its length, superset first, then cut in a fixed order. It did not say what to do when the chosen days and minutes cannot hold his minimums at all. The team put the question to him with two examples: a pickleball player with 2 × 45 minutes, and a CrossFit class member with 4 × 60 minutes. The team's later review of the first engine showed what cutting after the fact costs: groups under the floor and flat stairways ([ADR-048](adr-048-optimizer-rebuild-of-the-planner.md)).

## Options considered

| Option | What it meant | Outcome |
|---|---|---|
| A. Shrink everything evenly | Every group trained, all under the floor | Not chosen. The approved order trains fewer groups "instead of dropping below the floor on everything" (the team's proposal he marked RIGHT, R3-SES-02) |
| B. Make the sessions longer without asking | The plan ignores the chosen minutes | Not chosen (team) |
| C. Refuse to build a plan | Short schedules get nothing | Not chosen (team). His words: "they should be able to get things done" (R3-SES-02) |
| D. Tell, offer, train fewer groups, superset, keep climbing | His approved order | **Chosen** |

## Consequences

- The check runs before the plan is built, so the person starts from a plan that fits.
- People can also switch off a day's athletic or core block to make room ([ADR-005](adr-005-editable-plan-switches-and-supersets.md)).
- PROPOSED keep order: groups pinned by the sport and Focus muscles first, then hips, quads, back, chest, shoulders, calves, triceps, biceps. He approved only "big movers first".
- PROPOSED: the plan lists what is "trained directly" and what is "not trained directly (time)".
- PROPOSED: the minutes each kind of set takes (the time model).
- Open for the coach: a 2 × 45 minute week holds about one big group plus calves. Should very short weeks train the big movers once a week at the floor instead?
- Getting this exactly right is the main reason for the planner rebuild ([ADR-048](adr-048-optimizer-rebuild-of-the-planner.md)).

## Where it lives in the data

| File | Key | What |
|---|---|---|
| [generator_spec_v1.json](../../generator_spec_v1.json) | `rule_tables.session_limits.time_vs_minimums` | The order, the "never", the keep order, examples |
| [generator_spec_v1.json](../../generator_spec_v1.json) | `derived_values.D15_time_fit` | The time check |
| [generator_spec_v1.json](../../generator_spec_v1.json) | `validation_checks.V28_time_fit`, `validation_checks.V29_stairway_climbs` | The checks |
| [generator_spec_v1.json](../../generator_spec_v1.json) | `rule_tables.time_model` | Minutes per set and per changeover |
| [synthesis/12_volume_algorithm_v1.json](../../synthesis/12_volume_algorithm_v1.json) | `session_limits.time_vs_minimums_R3SES02` | Same, in the volume algorithm |

Master text: [BLAZE_CAMP_BRAIN.md](../../BLAZE_CAMP_BRAIN.md) §5.6.

## Related

[ADR-024](adr-024-focus-muscle-1-and-2.md) Focus muscles · [Sessions](../02-model/sessions.md)
