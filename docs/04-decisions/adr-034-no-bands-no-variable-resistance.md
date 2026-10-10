# ADR-034: No bands and no variable resistance

The model uses no resistance bands, no chains and no weight releasers. Not as equipment, not as a substitute, not in an exercise name. The coach said this in five separate answers in round 1. For bands it is his view of what works. For the rest of variable resistance it is "for now", because it is too complicated to include yet.

| | |
|---|---|
| **Status** | Accepted. Variable resistance may come back later by his decision. |
| **Decided by** | Coach: EQ-01, EQ-02, EQ-07, EQ-08, EQ-12 (round 1, 2026-10-08) |
| **Replaces** | Bands in the equipment options, the home kit and the substitution lists; band and chain percentages from his older strength sheets |

## Decision (the rule)

**Variable resistance** means adding bands, chains or weight releasers to a lift so the load changes through the movement.

- No bands anywhere.
- No chains and no weight releasers.
- When equipment is missing, the substitute never uses a band.

| Missing | Substitute (no bands) | Source |
|---|---|---|
| Leg extension machine | sissy squats | EQ-08 |
| Leg curl machine | Nordics, slider or swiss-ball curls | EQ-08 |
| Medicine ball | plyo push-ups, fast cable rotations, the "fake medball slam" | EQ-07 |

## Why

> "The only exception is I don't do bands. I don't program anything with bands." (EQ-01)

> "In my model, bands are not something that you're going to make changes to your body with." (EQ-02)

> "We don't want any variable resistance right now. No variable resistance should be available in this for now. We will work with that later on." (EQ-12)

## Context

Some of his older strength sheets do mention bands and chains (OBSERVED). So the team's first version offered a "bands only" equipment option, put bands in the minimum home kit, used band exercises as substitutes, and asked what the band and chain percentages in those sheets meant. He took bands out each time, and marked the variable-resistance question NOT RIGHT.

## Options considered

| Option | What it meant | Outcome |
|---|---|---|
| A. Bands as cheap home equipment | A "bands only" profile, band substitutes | Rejected (EQ-01, EQ-02, EQ-07, EQ-08) |
| B. Bands and chains on strength lifts | As in his older strength sheets | Rejected for now (EQ-12) |
| C. None | Free weights, machines, cables, bodyweight | **Chosen** |

## Consequences

- The intake has no "bands only" option. The ideal home kit is adjustable dumbbells, a bench, a pull-up bar and an 8-10 lb medball (EQ-02, without the bands).
- Shoulder care for swimmers uses dumbbells, cables or kettlebells, never bands (R3-ATH-01).
- What his sheets say about bands and chains is kept as an archive only. The tool never uses it.
- The build fails if a band shows up in an exercise, a swap or an equipment list.
- Open for the coach: eight core exercises in his sheets use a band around the knees. The team's default is a ball or pad squeeze instead (N-PROD-11, PROPOSED).

## Where it lives in the data

| File | Key | What |
|---|---|---|
| [generator_spec_v1.json](../../generator_spec_v1.json) | `rule_tables.equipment.no_variable_resistance` | The rule |
| [generator_spec_v1.json](../../generator_spec_v1.json) | `rule_tables.equipment.machine_isolation_swaps` | Substitutes without bands |
| [generator_spec_v1.json](../../generator_spec_v1.json) | `validation_checks.V9_bands` | The check |
| [synthesis/01_taxonomy.json](../../synthesis/01_taxonomy.json) | `facets` | Entry `F.ACCOM`, marked dormant |
| [model/rules.json](../../model/rules.json) | `equipment.banned_tokens` | Runtime copy (generated) |

Hard rule H01 in [AGENTS.md](../../AGENTS.md) §10.

## Related

[ADR-035](adr-035-machines-not-ranked.md) machines · [What he rejected](../01-philosophy/what-he-rejected.md) · [Equipment](../02-model/equipment.md)
