# design/spec_proto - prototypes behind PLANNER_SPEC.md

Evidence for `design/PLANNER_SPEC.md`. Not engine code: nothing here is imported by `engine/`. Plain JS, Node 22, no dependencies.
Everything reads `model/rules.json`, `model/templates.json` and `design/research/*.mjs` and writes only into this folder.

The judges found that the three design documents were never written, and that two central claims were arguments, not
measurements: "the models can be small" (judge 2, section 5.6) and "construct first, prove second" (judge 3, section 5).
These prototypes build both and measure them.

## What is here

| File | What it is |
|---|---|
| `reduced.mjs` | The **reduced model** and the **exact oracle** of the spec. Unknowns per candidate group-day: on / off (with exercise count), sets in week 1, sets in the peak week. Every rule is a monotone row. Integer-only bounds propagation, day-subset ("Hall") cuts with an exact per-group knapsack, two search strategies in a fixed portfolio with growing node budgets, a certificate on every witness, three verdicts (fits / proven not to fit / unknown). |
| `canon_endpoint.mjs` | A copy of `design/research/proto_endpoint.mjs` with three marked switches (balanced staircase row, twin rows off, never one exercise). Used only as an independent LP-based reference oracle. |
| `crosscheck.mjs`, `ref_lp.jsonl` | The reduced oracle against the stored kept lists of the LP reference on all 630 template-grid cells. |
| `variant_check.mjs` | The oracle with exercise-count variants against the LP reference asked once per explicit exercise count (200 small instances). |
| `stairway.mjs` | The exact stairway on the placed weeks (dynamic program over the sorted vector of sets left, then a transportation flow with BigInt costs and a unique optimum), with the tier order as data; brute-force self-test. |
| `pipeline.mjs` | The whole chain: keep vector, structure by preference, the priority water-filling ladder, the evening pass, week 1, the stairway, add sequences, and a check of every week against every row. |
| `examples.mjs` | Eight cases (the racket player at 2 x 45 / 60 / 75, a swimmer-like athlete, L1 / L2 / L3 aesthetics, a field athlete). |
| `grid.mjs`, `gridsum.mjs`, `calls.mjs` | The oracle alone on the grid, in several modes. |
| `grid_pipeline.mjs`, `notes_stats.mjs` | The whole chain on the grid. |
| `*.out.txt`, `*.jsonl` | Saved outputs of the runs quoted in the spec. |

## Results (saved outputs)

| Question | Result | File |
|---|---|---|
| Is the reduced oracle exact? | 609 of 609 grid cells: the same kept groups as the LP-based reference; 0 unknown on both sides | `crosscheck.out.txt` |
| ... with exercise-count variants? | 200 small instances, 510 oracle questions, 4,419 reference solves: 0 verdicts differ | `variant_check.out.txt` |
| How much work is it? | per plan: median 80 nodes, 99th percentile 14,440, maximum 104,376; CPU median 1.1 ms, 99th percentile 168 ms, maximum 1.3 s (the LP reference: median 34 ms, 99th percentile 6.3 s, maximum 14.5 s) | `crosscheck.out.txt` |
| What does a node budget cost? | spec settings, 20,000 nodes per question: 0 of 2,584 "fits" verdicts lost; 9 of 1,637 "does not fit" verdicts left unproven | `grid_spec.out.txt` |
| Is the stairway exact for its tier order? | 5,788 small plans against brute force: 0 differences; hard step rules hold by certificate | `stairway.out.txt` |
| Does the whole chain hold every rule? | 594 plans, 7,128 plan-weeks: 0 days over the minutes, 0 group-weeks under a floor, 0 over a ceiling, 0 slots that lost a set, 0 staircase breaks, 0 step-rule breaks, 0 uneven splits; 0 unknown; CPU median 10 ms, 99th percentile 1.7 s | `grid_pipeline.out.txt` |
| What do the plans look like? | eight worked cases | `examples.out.txt`, `examples.fit110.out.txt`, `examples.landing_first.out.txt` |

## Reproduce

```sh
cd blaze-camp-model
CANON=1 NOTWIN=1 node design/spec_proto/crosscheck.mjs                     # 1 min
CANON=1 NOTWIN=1 NOSINGLE=1 node design/spec_proto/variant_check.mjs 200   # 6 min
node design/spec_proto/stairway.mjs                                        # 1 min
CANON=1 NOTWIN=1 node design/spec_proto/examples.mjs                       # 5 s   (FITS=1.1, TIERS=late,land,shape,flat,hold, ONLY=P1,P2)
CANON=1 NOTWIN=1 node design/spec_proto/grid_pipeline.mjs                  # 3 min
CANON=1 NOTWIN=1 HALL=1 PAIR=rest FIT=1 NOSINGLE=1 OUT=grid_spec.jsonl node design/spec_proto/grid.mjs && node design/spec_proto/gridsum.mjs grid_spec.jsonl && node design/spec_proto/calls.mjs grid_spec.jsonl
# regenerate the LP reference (25 min): CANON=1 NOTWIN=1 HALL=1 REF=1 REFLIMIT=60000 OUT=grid_ref.jsonl node design/spec_proto/grid.mjs
```

Node counts, kept groups, set tables and checksums are deterministic and must reproduce exactly. CPU times were taken on a
laptop that was also running the engine's test suite.

## Limits

- The instances are the research prototype's (`buildInstance`): hips is one line, no optional days, no Focus slots, no tests,
  athletic minutes are fixed per day and scaled to the peak. Extension candidates are added by `examples.mjs > extend()`.
- The exact leximin improver of the spec (section 8.7) is specified and not prototyped.
- No phone was measured. No package was installed.
