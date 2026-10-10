# ADR-007: English first, with a full Spanish toggle

Everything a user reads exists in English and in Spanish. The tool starts in English and one toggle switches the whole thing. The Spanish is neutral Latin American Spanish, with the English gym word in brackets where gyms use it. The coach set the two languages in round 1 and approved the kind of Spanish in round 2. In round 3 he asked that the legal texts be as legally equivalent as possible in both.

| | |
|---|---|
| **Status** | Accepted. The Spanish lines themselves are PROPOSED until he, or a coach he trusts, approves them. |
| **Decided by** | Coach: GEN-01 (round 1), R2-GEN-08 (round 2), R3-GEN-01 (round 3) |
| **Replaces** | Nothing |

## Decision (the rule)

| Item | Rule | Source |
|---|---|---|
| Languages | English (default) and Spanish, for "the whole thing" | GEN-01 |
| Which Spanish | Neutral Latin American, English gym word in brackets, e.g. 'Empuje de cadera (Hip Thrust)' | R2-GEN-08 |
| Who approves | The coach or a coach he trusts approves every line | R2-GEN-08 |
| Units | Pounds in the US, kilograms elsewhere, switchable | R2-GEN-08 |
| Legal texts | English and Spanish, as legally equivalent as possible | R3-GEN-01 |

## Why

> "It's going to be used in Spanish, all in Spanish. There should be a toggle for the whole thing, and it's also going to be used in English. It should start in English and toggle to Spanish if needed, the whole thing." (GEN-01)

On the legal texts:

> "it should be translated as legally equivalent as possible in English and Spanish." (R3-GEN-01)

## Context

His users are "clients", "coaches", "trainers", "strength and conditioning coaches" and "anyone" (GEN-01). The team proposed the neutral Latin American style with the English gym term in brackets, because gyms use both words. He answered: "That sounds right. If it's the best way to go, then let's do that" (R2-GEN-08).

## Options considered

| Option | What it meant | Outcome |
|---|---|---|
| A. English only | Simplest | Rejected (GEN-01) |
| B. A regional Spanish | One country's gym vocabulary | Not chosen |
| C. Neutral Latin American Spanish + English gym term in brackets | Understood across countries; matches how gyms talk | **Chosen** (R2-GEN-08) |

## Consequences

- No word is typed straight into a plan. The plan holds codes, and the words come from an English list and a Spanish list.
- Every new exercise needs a Spanish name. See [Adding exercises (Spanish)](../adding-exercises.es.md).
- Machine-translated Spanish lines are listed for review until approved.
- The disclaimers exist in both languages and both are drafts for an attorney ([ADR-009](adr-009-mit-license-and-disclaimers.md)).
- His sheet labels keep his spelling inside quotes (for example 'SAGITAL'). Names shown to users use correct spelling (FIX-04).

## Where it lives in the data

| File | Key | What |
|---|---|---|
| [generator_spec_v1.json](../../generator_spec_v1.json) | `output.language` | The language and units rule |
| [generator_spec_v1.json](../../generator_spec_v1.json) | `inputs_schema.i18n` | Default language, languages, scope |
| [model/manifest.json](../../model/manifest.json) | `languages`, `default_lang` | Runtime copy (generated) |

Word lists (generated): `model/i18n/en.json`, `model/i18n/es.json`, and the lines waiting for approval in `model/i18n/es_review.json`. Hard rule H14 in [AGENTS.md](../../AGENTS.md) §10.

## Related

[ADR-006](adr-006-website-not-app.md) website · [Glossary](../05-reference/glossary.md)
