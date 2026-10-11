# ADR-015: His library is the source of truth; variations change one detail only

The exercise library in the coach's "BUILD YOUR OWN PROGRAM" sheet is the single source of truth for exercises. The tool picks a default exercise for every slot and offers a dropdown of swaps from the same category. Between blocks it may change one small detail of a library exercise. It never invents a new exercise. He set the first two points in round 1 and approved the variation rule in round 2.

| | |
|---|---|
| **Status** | Accepted |
| **Decided by** | Coach: CAT-07, GEN-04 (round 1); R2-LIB-01, R2-LIB-07 (round 2) |
| **Replaces** | Building exercises freely from a "grammar" of parts |

## Decision (the rule)

1. The MASTER EXERCISE LIBRARY tab of his "BUILD YOUR OWN PROGRAM" workbook (short: BYOP) is the source of truth.
2. Every slot gets a **default** exercise plus a **dropdown** of swaps in the same category.
3. Only library exercises, plus ones a coach answer added, can be the default. This is how the team applies CAT-07 (INFERRED).
4. About 120 exercises appear only in his written programs. They stay dropdown swaps until he adds them to the library (R2-LIB-07).
5. Between blocks the tool may change **one detail**: which hand holds the weight, grip, stance, implement or range. It shows it as, for example, 'Reverse lunge - dumbbell in opposite hand'.
6. The tool never invents an exercise.

## Why

> "The YOP master exercise library: that's the single source of truth as far as I was able to take it so far." (CAT-07)

("YOP" is how the dictation wrote BYOP.)

> "pick the default and be able to do the drop-downs. That's going to be important." (GEN-04)

Rule 5 and rule 6 are the team's proposal, which he marked RIGHT with no changes (R2-LIB-01).

## Context

His sheets also hold older drafts of the library. He confirmed those are older, and useful only for levels and for how exercises are described. In round 1 we asked whether the tool should build variations from a grammar (base pattern + implement + load position + stance + range). He answered that he did not understand the question (CAT-12). We asked again in plain words in round 2.

## Options considered

| Option | What it meant | Outcome |
|---|---|---|
| A. Generate exercises from a grammar | Many new combinations | Not chosen: the tool must not invent |
| B. Named library exercises only | No variation between blocks | Too rigid for "change some small variables" |
| C. Library first, one-detail variations between blocks | His exercises, small changes | **Chosen** (R2-LIB-01) |

## Consequences

- A new exercise proposed by a contributor starts as PROPOSED: never a default, until the coach approves it. In round 4 he made the team's own proposed exercises live as **optional add-ons**: they can be chosen and added, but a template never picks them (R4-LIB-01, [ADR-054](adr-054-proposed-exercises-are-optional-add-ons.md)).
- A swap prints one short line on what it keeps and what it loses, for example "DB snatch instead of power clean: keeps the explosive hip drive, loses the barbell catch" (R4-LIB-04, the proposal he marked RIGHT).
- People must be able to add exercises, and the repo explains how (his request in conversation). See [Adding exercises](../adding-exercises.md).
- Spelling is corrected in the tool only. His sheets stay as they are (FIX-04).
- Program names must be general and understandable. "Justice League" was a marketing name (ATH-13, FIX-03).
- Near-duplicates in the library are merged (LIB-17).
- Round 2 added a few exercises at set levels, for example belt squat, seated machine shoulder press and hang clean (R2-LIB-07).

## Where it lives in the data

| File | Key | What |
|---|---|---|
| [generator_spec_v1.json](../../generator_spec_v1.json) | `rule_tables.taxonomy.source_of_truth` | Rule 1 and rule 3 |
| [generator_spec_v1.json](../../generator_spec_v1.json) | `rule_tables.library_decisions.variations` | The one-detail rule |
| [generator_spec_v1.json](../../generator_spec_v1.json) | `rule_tables.library_decisions.program_only_exercises`, `rule_tables.library_decisions.additions_approved` | Program-only swaps; approved additions |

The catalog itself is [synthesis/02_exercise_catalog.json](../../synthesis/02_exercise_catalog.json): one record per exercise, with a `status` field and a `variation_v1_1` field. The original sheets are in `raw/` and, as text, in `dumps/`.

## Related

[ADR-045](adr-045-same-exercises-within-a-block.md) same exercises within a block · [ADR-005](adr-005-editable-plan-switches-and-supersets.md) editing · [Exercise library](../02-model/exercise-library.md)
