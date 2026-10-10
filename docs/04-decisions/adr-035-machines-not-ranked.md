# ADR-035: Machines are not ranked; equipment is described by constraint

The model does not rank machines from best to worst. Machines differ by brand and angle, and what matters is that the person feels the right muscles. What the model does record is constraint: how much the equipment holds the body in place. Constraint runs on a scale from 1 to 5. Older, injured and high-volume clients do more of their work on more constrained equipment. The coach decided all of this in round 1.

| | |
|---|---|
| **Status** | Accepted |
| **Decided by** | Coach: EQ-11 (NOT RIGHT to a ranking), EQ-13, EQ-03, EQ-04, EQ-10 (round 1, 2026-10-08) |
| **Replaces** | A preference ranking of machines, with the hack squat last |

## Decision (the rule)

**Constraint** is how many fixed reference points the equipment gives you: a seat, a back pad, a fixed path.

| Constraint | What it is | Source |
|---|---|---|
| 5 | Seated machine with a back pad | EQ-13 |
| 4 | Plate-loaded machine, Smith machine, chest-supported lift | EQ-13 |
| 3 | Cable, or dumbbells on a bench | EQ-13 |
| 2 | Standing free weights | EQ-13 |
| 1 | Bodyweight, ballistic, reactive | EQ-13 |

- No machine is ranked above another. A hack squat and a leg press are more constrained; a Smith machine is less.
- The belt squat is for people who should not be loaded through the spine that week.
- The GHD (glute-ham developer) and the reverse hyper are used if they are available and feel good.
- Older, injured and high-volume clients collect their volume on more constrained equipment (EQ-03).
- Where there are alternatives, the client's own preference can choose (EQ-10).

## Why

> "I don't want to rank them because they have different brands, angles, and things like that." (EQ-11)

> "I want them to feel the right muscles. I want them to get the right stimulus." (EQ-11)

On who uses machines: "I'd rather they collect that volume in a safe place with more constraints" (EQ-03).

## Context

He had explained in conversation why machines suit some people: you sit, your feet are on the ground, you move your hands or feet, so you can push a lot and it is safer. Barbells are the most skilled; dumbbells, kettlebells and medicine balls sit in between. The team then assumed he disliked the hack squat and ranked it last. He said no to any ranking.

## Options considered

| Option | What it meant | Outcome |
|---|---|---|
| A. Rank machines by his preference | Hack squat last, others ordered | Rejected (EQ-11) |
| B. Describe equipment by constraint only | A 1-5 scale; no "best machine" | **Chosen** (EQ-13) |

## Consequences

- An older or injured beginner may use machines his sheet files as moderate or advanced. Safety beats the label (EQ-04).
- A machine or cable also makes an exercise easier to learn ([ADR-012](adr-012-levels-from-load-position.md)).
- The belt squat is a standard choice for the second squat day ([ADR-030](adr-030-axial-loading-once-per-pattern.md)).
- A seated machine shoulder press was added for older and injured clients (EQ-05).
- When no implement is named, the default goes bodyweight, then dumbbell, then barbell as the level rises, limited by what the person has (EQ-09).
- The V-squat is never used (GEN-08).

## Where it lives in the data

| File | Key | What |
|---|---|---|
| [generator_spec_v1.json](../../generator_spec_v1.json) | `rule_tables.equipment.machines_not_ranked` | The rule |
| [generator_spec_v1.json](../../generator_spec_v1.json) | `rule_tables.equipment.constraint_scale` | The 1-5 scale |
| [generator_spec_v1.json](../../generator_spec_v1.json) | `rule_tables.equipment.older_injured_high_volume` | Who leans on constrained equipment |
| [synthesis/10_equipment_model.json](../../synthesis/10_equipment_model.json) | `constraint_scale`, `client_rules`, `machine_preferences` | The equipment model |
| [model/rules.json](../../model/rules.json) | `equipment.machines` | Runtime copy (generated) |

Each catalog record has a `constraint_level` field. Master text: [BLAZE_CAMP_BRAIN.md](../../BLAZE_CAMP_BRAIN.md) §8.

## Related

[ADR-034](adr-034-no-bands-no-variable-resistance.md) no bands · [ADR-040](adr-040-older-adult-defaults.md) older adults · [Equipment](../02-model/equipment.md)
