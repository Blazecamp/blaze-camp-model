# ADR-054: Proposed exercises are optional add-ons, never the template's pick

The exercises the team proposed are allowed, but only as options. A template never picks one. A person can choose one as a swap or add it to a day. Two exceptions: wall balls and sled pushes may be picked in the HYROX program, and maybe in the CrossFit program. Neck work stays proposed and is not shown. Carries and sled work are written by distance or time and do not count as muscle sets. The coach decided this in round 4.

| | |
|---|---|
| **Status** | Accepted. "Maybe CrossFit" is read as on, with a switch (PROPOSED). Which add-ons a plan lists is PROPOSED. |
| **Decided by** | Coach: R4-LIB-01, RIGHT with words; R4-LIB-02, RIGHT (round 4, 2026-10-11) |
| **Replaces** | "PROPOSED records are swaps only until he approves them" (CAT-07, R2-LIB-07, as applied by the team) |

## Decision (the rule)

| Subject | Rule | Source |
|---|---|---|
| Proposed exercises | Live as **optional add-ons**: carries, sled work, wall balls, sandbag lunges, burpee broad jumps, split-step reaction drills, swimmer shoulder work, tibialis and soleus raises. They can be chosen and added. | R4-LIB-01 |
| Template picks | Never an add-on. The template picks only from his own library. | R4-LIB-01 |
| Exceptions | Wall balls and sled pushes may be primary in the HYROX program, "maybe in the CrossFit program, but that's it". | R4-LIB-01 |
| Neck work | Stays proposed until he decides. Never picked, never offered. | R4-LIB-01 (the proposal he marked RIGHT) |
| Carries and sled work | Dosed by distance or time, not reps: 2 to 4 trips of 20 to 40 metres, or 20 to 40 seconds. No muscle-set credit. They sit with core and conditioning. | R4-LIB-02 |

## Why

> "Yeah, those exercises can be allowed. It's just that I don't want to make them primary exercises. None of these look like primary exercises for the program, so they can be optional, and they can be chosen and added, but not primary ones that the program is going to throw at you as part of the template." (R4-LIB-01)

> "The only ones that I see that might be primary are wall balls and sled pushes because that's part of High Rocks programming." (R4-LIB-01)

"High Rocks" is how his dictation wrote HYROX (R3-ATH-03).

## Context

His library is the source of truth ([ADR-015](adr-015-library-source-of-truth-one-detail-variations.md)). While building sport profiles the team proposed 31 exercises his sheets do not hold. Until round 4 they could only be swaps and were marked "never, until he approves". Round 4 asked whether to make them live.

## Options considered

| Option | What it meant | Outcome |
|---|---|---|
| A. Keep them proposed | Swaps only, flagged as not his | Replaced |
| B. Make them fully live | A template may pick them | Not chosen: "I don't want to make them primary exercises" (R4-LIB-01) |
| C. Optional add-ons | Listed, selectable, never picked by a template | **Chosen** |
| D. Count carries as muscle sets | Credit grip, traps or core | Not chosen (R4-LIB-02) |

## Consequences

- In the compiled library these records have the status `optional_addon`. The count is 32: the 29 team proposals other than neck work, the 2 mid-range pull rows ([ADR-055](adr-055-incline-preference-and-mid-range-pull.md)), and his own single-side (suitcase) carry record, which R4-LIB-01 names beside the farmer carry.
- 2 neck records keep the status `proposed_v1_1`.
- A plan prints a short "Optional add-ons" list. PROPOSED: at most 6, in the order joint care, sport, carry.
- PROPOSED: wall balls and sled pushes are on for the CrossFit-style class workout. One switch in the rules turns that off.
- Athletic work still never counts as muscle sets ([ADR-020](adr-020-athletic-work-never-counts-as-muscle-sets.md)). A carry or sled trip is in the same family for counting.
- Wall balls stay at 20 lb or less ([ADR-036](adr-036-light-medballs.md)).
- A new exercise added by a contributor still starts as proposed ([adding exercises](../adding-exercises.md)).

## Where it lives in the data

| File | Key | What |
|---|---|---|
| [coach_answers_round4.md](../../coach_answers_round4.md) | R4-LIB-01, R4-LIB-02 | His answers |
| `model/catalog.json` | `exercises[].status` = `optional_addon` | The add-on records |
| `model/rules.json` | `selection.addons` | Which statuses are never picked, the two exceptions, what a plan offers |
| `model/rules.json` | `conditioning.carry` | Trips, metres, seconds, no muscle sets |
| `synthesis/02_exercise_catalog.json` | `exercises[].library_status` | The source records (`proposed_v1`, `proposed_v1_1`) |
| [coverage_matrix_round4.md](../../coverage_matrix_round4.md) | R4-LIB-01, R4-LIB-02 | The master-document section and the spec key |

## Related

[ADR-015](adr-015-library-source-of-truth-one-detail-variations.md) · [ADR-020](adr-020-athletic-work-never-counts-as-muscle-sets.md) · [Exercise library](../02-model/exercise-library.md) · [Coach answers: library details](../03-coach-answers/library-details.md#r4-lib-01)
