# ADR-047: The coach's newest answer wins, and every rule carries a label

When two sources disagree, the coach's most recent answer wins. His answers outrank what his sheets show, and both outrank anything the team reasoned or proposed. Every rule in the repo carries a label that says where it came from. This is a team decision about method. It follows from how the model was built: three rounds of questions to the coach, each one changing some earlier answers.

| | |
|---|---|
| **Status** | Accepted (team). It governs every document and data file in the repo. |
| **Decided by** | Team. Consistent with the coach's own corrections of his sheets (VOL-17, ORD-06, PRG-06) |
| **Replaces** | Treating the sheets as the ground truth |

## Decision (the rule)

Highest authority first:

| Rank | Source | Label |
|---|---|---|
| 1 | Round-3 answers ([coach_answers_round3.md](../../coach_answers_round3.md)) | `COACH-R3 <id>` |
| 2 | Round-2 answers ([coach_answers_round2.md](../../coach_answers_round2.md)) | `COACH-R2 <id>` |
| 3 | Round-1 answers ([coach_answers_full.md](../../coach_answers_full.md)) | `COACH-ANSWER <id>` |
| 4 | Things he said in conversation ([coach_chat_statements.md](../../coach_chat_statements.md), [coach_answers.md](../../coach_answers.md)) | `COACH-CHAT` |
| 5 | Facts read from his sheets (`raw/`, `dumps/`) | `OBSERVED` |
| 6 | Team work | `INFERRED`, `SCIENCE`, `PROPOSED` |

- An answer marked RIGHT with no words makes the team's proposal his rule.
- **PROPOSED** means "waiting for the coach's approval". It is not his rule yet.
- His words and his sheets are never edited.

## Why

His sheets are a record of how he has written programs, and he told us they contain things he did not intend. On missing calf and rear-delt sets: "It wasn't intentional." (VOL-17). On a reversed pairing in one bootcamp tab: "that was not intentional." (ORD-06). So when a sheet and an answer disagree, the answer is the better guide to what he means.

His answers also changed as the questions got sharper. A check-in approved in round 2 was removed in round 3. Later answers were given with more of the model in view, so they win.

## Context

The model started from two Google Sheets, decoded tab by tab. The team then asked 140 questions in round 1, 45 in round 2 (plus two left over from round 1), and 13 in round 3. Each question showed what the team assumed or proposed, and he answered RIGHT, PARTLY or NOT RIGHT, often with his own words.

## Options considered

| Option | What it meant | Outcome |
|---|---|---|
| A. The sheets are the truth | Copy what he wrote, including fill errors | Rejected |
| B. The team's judgment or the research is the truth | "Correct" him where studies differ | Rejected: it would no longer be his model |
| C. His newest answer wins; everything is labelled | His model, traceable | **Chosen** |

## Consequences

- A document that contradicts a coach answer has a bug. A coach answer someone doubts is written up "for discussion" and left in place.
- Each answer is traced to the place it is applied, in the coverage matrices ([round 1](../../coverage_matrix.md), [round 2](../../coverage_matrix_round2.md), [round 3](../../coverage_matrix_round3.md)).
- Retired ideas are kept on a list so nobody rebuilds them ([AGENTS.md](../../AGENTS.md) §13).
- New coaching content goes to him as a question first. Until he answers, it ships only as PROPOSED.
- Where two of his answers pull against each other, the team writes down its reading, marks it INFERRED or PROPOSED, and asks in the next round.
- These decision records follow the same order. See the status of each one in the [index](index.md).

## Where it lives in the data

| File | Key | What |
|---|---|---|
| [generator_spec_v1.json](../../generator_spec_v1.json) | `_meta.authority_order`, `_meta.status_values` | The order and the allowed labels |
| [generator_spec_v1.json](../../generator_spec_v1.json) | `_meta.integration_decisions` | Places where two team files disagreed and which one was adopted |

Human text: [AGENTS.md](../../AGENTS.md) §3, [CONTRIBUTING.md](../../CONTRIBUTING.md) §2 and §3, and the "Evidence labels" table at the top of [BLAZE_CAMP_BRAIN.md](../../BLAZE_CAMP_BRAIN.md).

## Related

[ADR-046](adr-046-built-from-first-principles.md) first principles · [Coach answers index](../03-coach-answers/index.md) · [Method](../06-history/method.md)
