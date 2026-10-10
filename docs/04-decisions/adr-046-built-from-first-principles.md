# ADR-046: Built from first principles, not on packaged programs

The model captures the coach's own way of segmenting and dosing training. He names his lineage as Dr. Pat Davidson, Dr. Mike Israetel and training science from first principles. The team's lineage map ties Davidson mainly to how movement is categorized and Israetel mainly to how volume is dosed (INFERRED). It is deliberately not built on packaged programs such as 5/3/1, the Texas Method or Prilepin's chart. Building from his own segmentation, and not from a packaged program, is the coach's stated starting point for the whole project. Research is used to check his numbers and to fill gaps he asked the team to fill. The rule that research never overrules one of his answers is the team's method ([ADR-047](adr-047-authority-order-and-evidence-labels.md)).

| | |
|---|---|
| **Status** | Accepted |
| **Decided by** | Coach: conversation (2026-10-07 to 2026-10-09); PER-01, VOL-01, VOL-14 (round 1) |
| **Replaces** | Nothing. It is the starting point. |

## Decision (the rule)

| Layer of the model | Main source | How it is used |
|---|---|---|
| How exercises are categorized | Dr. Pat Davidson | His own categories and lenses, extended by the coach |
| Position zones | Davidson's *A Coach's Guide to Optimizing Movement* | As tags ([ADR-013](adr-013-davidson-zones-as-tags.md)) |
| How much volume, and effort | Dr. Mike Israetel | The ideas, not the templates |
| Everything else | The coach's experience, checked against research | His rules, labelled |

Which source feeds which layer is the team's lineage map (INFERRED from his sheets and the published work). He named the two people and the zones book. He did not assign the layers.

- A **packaged program** is a ready-made template with fixed weeks, sets and percentages. The model does not start from one.
- Where he asked for research, the team supplies it and marks it SCIENCE or PROPOSED.
- Research never overrules a coach answer.

## Why

He describes his work as "building the segmentation and the buckets from the ground up." (conversation)

> "I don't need it to be conjugate or anything like that, but I do want to have good sound science behind it so we can research on this and make sure we do it correctly." (PER-01)

> "Let's make sure that we do it correctly and we give them good sound science here." (VOL-14)

## Context

He named his lineage at the start and said what he does not build on. He also believes nothing quite like this model exists in the open (conversation). The team mapped every concept in his sheets to its most likely origin. The result, by the team's count of 138 concepts: about 38 % follow a source faithfully, 43 % adapt one, 20 % are his own, and 7 % pull against the source or the evidence (the categories overlap). Two parts of his sheets do use other people's structures: the strength track echoes a known powerlifting system, and the half-marathon plan is Chris Hinshaw's, used as-is (PRG-12).

## Options considered

| Option | What it meant | Outcome |
|---|---|---|
| A. Start from a packaged system and tune it | Faster, but not his model | Rejected by the coach |
| B. Copy his sheets as templates, with no rules behind them | Plans that look like his, with no way to adapt them | Not enough: he wants the logic captured |
| C. Capture his own rules as a model, checked against research | His system, explained | **Chosen** |

## Consequences

- Every rule in the repo carries a label saying where it came from ([ADR-047](adr-047-authority-order-and-evidence-labels.md)).
- His own inventions stay as rules he can edit. Examples: the pairing rule, the stairway, the Receive-Create stages, the time-versus-minimums order.
- A coach answer that looks questionable against research is not a bug. It is written up "for discussion" and left alone.
- He asked reviewers to research two things: data to back up the science of the model, and exercises or anything else the model might be missing compared with other models (conversation). The brief written for that job is [CODEX_BRIEF.md](../../CODEX_BRIEF.md).
- The borrowed parts, the strength track and the half-marathon plan, are treated as optional modules (team proposal).

## Where it lives in the data

| File | Key | What |
|---|---|---|
| [generator_spec_v1.json](../../generator_spec_v1.json) | `_meta.authority_order` | Science fills gaps and never overrules |
| [synthesis/12_volume_algorithm_v1.json](../../synthesis/12_volume_algorithm_v1.json) | `research_vs_coach`, `science` | His volume numbers next to the research |

Human text: [synthesis/07_science_lineage.md](../../synthesis/07_science_lineage.md), especially §13 (packaged models) and §14 (his own contributions). Short version: [BLAZE_CAMP_BRAIN.md](../../BLAZE_CAMP_BRAIN.md) §15.

## Related

[Lineage](../01-philosophy/lineage.md) · [How he thinks](../01-philosophy/how-he-thinks.md) · [Method](../06-history/method.md)
