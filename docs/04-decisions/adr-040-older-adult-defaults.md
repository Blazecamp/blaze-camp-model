# ADR-040: Defaults for older adults

From age 60, a plan leaves out jumps, Olympic lifts and depth jumps by default. The person or their coach can switch them on, and the plan then shows a warning. Landing drills, balance, quick stepping, light medball throws and fast machine work stay on. Two squat variations stay out. Racket-sport players from age 50 get knee-friendly, low-impact defaults. The coach set the principle in rounds 1 and 2 and approved the exact lists in round 3. The rules go by age, never by sex.

| | |
|---|---|
| **Status** | Accepted. The reading that snatches stay out for over-60s is INFERRED and goes back to the coach. |
| **Decided by** | Coach: ATH-09, EQ-03 (round 1); R2-ATH-08 (round 2); R3-ATH-02, RIGHT (round 3) |
| **Replaces** | Low-impact plyos for older clients as a fixed rule (team assumption); hard bans with no way to opt in |

## Decision (the rule)

From age 60 (R3-ATH-02):

| | Items |
|---|---|
| **On by default** | Landing drills (step down and stick, no bounce), balance, quick stepping without a hop, light medball throws, fast machine work |
| **Off by default, can be switched on with the warning** | Low ankle hops, other jumps, Olympic lifts, depth jumps |
| **Out** | Overhead squats, low-bar squats |

The warning, in his words: "Make sure that you have a fitness professional to help you understand what this means." (R2-ATH-08)

Pickleball, padel and tennis players aged 50 and over (R3-ATH-02):

| | Items |
|---|---|
| Always | Knee-friendly strength; calf and Achilles work every leg day; rotator-cuff work |
| Jumps | Only low-impact jumps. No depth jumps, hurdle hops or bounds, unless switched on. |

## Why

> "Older adults: we're not going to need them to be doing any Olympic lifting, plyos, depth jumps, or anything like that, but it should be an additional option if they want to do it according to the coach." (R2-ATH-08)

> "the older population doesn't really need a lot of plyos unless they ask for it." (ATH-09)

On equipment for older, injured and high-volume clients: "I'd rather they collect that volume in a safe place with more constraints" (EQ-03).

## Context

In round 2 the team proposed: older rules from 60, never depth jumps, landing drills and low ankle hops still fine. He marked it RIGHT, but his words were stricter on what is on by default and looser on what may be switched on. The team took the stricter reading for the defaults and asked again. Round 3 approved the on and off lists above.

## Options considered

| Option | What it meant | Outcome |
|---|---|---|
| A. The same defaults at every age | A 65-year-old gets depth jumps like anyone | Rejected |
| B. Hard bans from 60 | Never jumps or Olympic lifts | Rejected: "it should be an additional option" |
| C. Off by default, switch on with a warning | Safe default, the person or coach decides | **Chosen** |

## Consequences

- Older clients do more of their work on constrained equipment ([ADR-035](adr-035-machines-not-ranked.md)).
- They climb the same stairway as everyone. An earlier team proposal to cap their steps at 3 % is retired (R3-VOL-04).
- For racket players over 50, calf and Achilles work stays on every leg day (R3-ATH-02). Nothing is dropped for time any more ([ADR-050](adr-050-no-time-fitting-sessions-sized-by-exercise-count.md)).
- Older adults get 5 to 6 exercises a session, not counting the warm-up and the 2 core exercises (R4-SES-02).
- INFERRED: snatch variations stay out for over-60s even with the switch. EQ-03 lists the snatch among lifts older clients never get, and R3-ATH-02 did not name it. This is a round-4 question.
- The engine is stricter than the rule: it keeps depth jumps locked for over-60s even when switched on, and it never picks handstand work for them. Stricter is the safe side.
- PROPOSED: tests for over-60s are submaximal only.

## Where it lives in the data

| File | Key | What |
|---|---|---|
| [generator_spec_v1.json](../../generator_spec_v1.json) | `rule_tables.athletic.older` | Age, on, off, never, the switch |
| [generator_spec_v1.json](../../generator_spec_v1.json) | `rule_tables.athletic.racket_50plus` | The racket-sport rules from 50 |
| [generator_spec_v1.json](../../generator_spec_v1.json) | `rule_tables.equipment.older_injured_high_volume` | The equipment bias |
| [generator_spec_v1.json](../../generator_spec_v1.json) | `validation_checks.V5_older` | The check |
| [synthesis/04_profiles.json](../../synthesis/04_profiles.json) | `age_overlays` | The 50+ and 60+ overlays |
| [model/rules.json](../../model/rules.json) | `population.older`, `population.active_aging_50` | Runtime copy (generated) |

Hard rule H12 in [AGENTS.md](../../AGENTS.md) §10.

## Related

[ADR-004](adr-004-no-sex-field.md) no sex field · [ADR-039](adr-039-olympic-lifts-policy.md) Olympic lifts · [Special populations](../02-model/special-populations.md)
