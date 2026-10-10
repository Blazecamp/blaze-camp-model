# ADR-004: No sex field and no sex-based rules

The form has no sex or gender question, and no rule in the model changes by sex. The coach programs by age, training foundation, goal and injuries. A person who wants more work on one muscle picks it as a Focus muscle. The coach removed the field in round 1.

| | |
|---|---|
| **Status** | Accepted |
| **Decided by** | Coach: GEN-02 and ATH-09 (round 1, 2026-10-08); confirmed in practice by R3-SES-01 |
| **Replaces** | A "sex" field in the team's first intake list |

## Decision (the rule)

- Never ask sex or gender.
- No default, exercise choice, volume or safety rule depends on sex.
- Personal emphasis comes from the person's own choice of Focus muscle 1 and Focus muscle 2 ([ADR-024](adr-024-focus-muscle-1-and-2.md)).

## Why

> "I need you to take away just sex." (GEN-02)

> "female or male doesn't really matter, so I don't go by sex on these things, but mainly by age, foundation, goal, and injuries. The rules kind of apply to everybody." (ATH-09)

## Context

The team's first intake list had: goal, sport and position, season, training age, age, sex, days, session length, equipment, injuries, priority muscles, rep style and plan length. He changed three things in one answer (GEN-02): remove sex, ask "training experience" in years instead of "training age", and add body weight.

In round 3 he described the Focus muscle with an example: "if it's a female and she chooses glutes as one of the focus muscles, then the program should bias more toward glutes in the lower body" (R3-SES-01). That is a choice the person makes. It is not a default the tool applies.

## Options considered

| Option | What it meant | Outcome |
|---|---|---|
| A. Ask sex and set defaults from it | For example more glute volume for women | Rejected (GEN-02, ATH-09) |
| B. Ask sex but use it nowhere | A field with no purpose | Rejected by the team: the form asks nothing the tool does not use |
| C. No field; the person picks Focus muscles | Emphasis is a choice | **Chosen** |

## Consequences

- An intake that carries `sex` or `gender` is refused by the engine.
- Older-adult rules go by age ([ADR-040](adr-040-older-adult-defaults.md)). Volume goes by training experience ([ADR-016](adr-016-client-levels-by-training-experience.md)).
- Body weight is required. It sets loaded-jump weights, for example (10-20 % of body weight, EQ-15).
- The health check still asks about pregnancy or a recent birth as a "see a professional first" item (R2-GEN-03). That is a safety screen, not a programming rule.

## Where it lives in the data

| File | Key | What |
|---|---|---|
| [generator_spec_v1.json](../../generator_spec_v1.json) | `inputs_schema.removed_fields` | The removed sex field, with his words |
| [generator_spec_v1.json](../../generator_spec_v1.json) | `rule_tables.priority.v1_2_focus_muscles.no_sex_field` | Focus muscles are never inferred from sex |
| [model/rules.json](../../model/rules.json) | `locked` | Locked rule LK10 `locked.no_sex_rules` (generated) |

Hard rule H13 in [AGENTS.md](../../AGENTS.md) §10.

## Related

[ADR-003](adr-003-no-lifestyle-inputs.md) no lifestyle inputs · [Special populations](../02-model/special-populations.md)
