# Coach-eye review, round 9: 07 Push / pull / legs (L3, 6 days, Focus back + chest; engine 0.7.0)

**Grade: B+** (coach's round-5 grade: A; **regressed**). Two things changed since the plan he graded A (engine 0.6.0, commit 547b453): the round-5 credit for the high-incline press (R5-VOL-01) and the "nothing starts at its top" rule (R5-CLS-07). Most of what they did is right:
- The shoulders now climb 19 → 25, where before they sat at 23 for 8 weeks.
- The biceps bonus is a barbell curl, no longer a TRX curl.
- The side delts get more direct work.

But the chest steps moved off the two main presses. In the A version the barbell bench went 3 → 4 in week 7 and the flat DB bench 3 → 4 in week 8. Now both stay at **3 sets for 12 weeks**, while the weighted dip in the last slot climbs 3 → 5 and the parallel dip 3 → 4 (M1). On his push day the first press is the lift that gets the next set. Fix that one thing and this is his A again.

Reviewed: `samples/plans/07-push-pull-legs.en.md` and `.json` (engine 0.7.0, model 1.3.0, `validation.ok: true`, no warnings), plus `samples/intakes/07-push-pull-legs.json`. Compared against the version he graded: `git show 547b453:samples/plans/07-push-pull-legs.json`. There is no Spanish file.

Not judged: session length (CT-01).

---

## Round-5 answers that touch this plan

| Answer | What the plan does | Status |
|---|---|---|
| R5-VOL-01: high-incline press = 1.0 chest, 0.25 front delts, 0.25 triceps | Mon High-Incline Seated Barbell Press and Thu High-Incline Seated DB Press now count for chest. Shoulders start at 19 (were 23) and climb to 25. | Applied |
| R5-VOL-02: pull ≥ press | Back 22 → 27, chest 22 → 27. | Applied |
| R5-VOL-03: side delts at least 8 direct sets (advanced) | Tue Seated DB Lateral Raise 3 → 4 and Cable Side Raise 2 → 3; Fri Cable Side Raise 3 → 4. That is 8 → 11 direct sets. | Applied |
| R5-VOL-04: 2-4 exercises per muscle on PPL days | 2 biceps and 2 triceps exercises a day, and a bonus barbell curl on Friday from week 9. | Applied |
| R5-CLS-07: nothing starts at its top; Focus a little higher | Every group climbs. Back and chest (Focus) start at 22, the rest at 15-20. | Applied |
| R5-GRD-06: core optional | Printed on every core block. | Applied |
| VOL-07 / R3-VOL-03 (unchanged rules, broken by the new distribution) | See M1. | **Regressed** |

## Round-5 review items (r5, the last 07 review): status

| R5 # | Status in r9 |
|---|---|
| m1 calves under 10 for 10 weeks, not said | **Open** (m2). |
| m2 Sat Legs 2: deadlift before leg press, title | **Open** (m3). |
| m3 two staggered-stance DB deadlifts a week | **Open** (m4) for weeks 1-8. |
| m4 Thursday no side raise; side delts flat | **Fixed**: side delts rise 8 → 11 on the pull days, and the shoulders climb. |
| m5 session sets uneven (Tue 30) | **Worse** (m5): week 11 has Tue 32 and Fri 30, against Thu 23 and Mon 25. |
| m6 hanging / rotational core before heavy rows, squat and deadlift tests | **Open** (m6). |
| m7 flat DB bench at 4-6 reps | **Open** (m7). |
| m8 TRX bonus curl | **Fixed**: barbell curl on Friday from week 9 (2 → 3). |
| m9 supine → seated curl, two details | **Open** (m8). |
| m10 cable side raises swap days between blocks | **Open** (m9). |
| m11 week-12 table above the final | **Improved**: the table prints 27 / 25; JSON `realized_top` still shows chest 27.5, biceps 25.75 (m10). |
| m12 heavy bent-over row on the eve of squat day | **Open** (m11). |
| m14 inference text in an exercise id | **Open** (m12). |
| m15 no Spanish | **Open** (m13). |

---

## Problems

### Blockers

None.

### Major

| # | Where | Problem | Rule | Severity | Engine fix hint |
|---|---|---|---|---|---|
| M1 | Mon Push: **Barbell Bench Press** `2+T 3 3 3 · 3 3 3 3 · 3 3 3 2+T`; High-Incline Seated BB Press 3 × 12; Incline DB 2 → 3 (wk 7); Flat DB Fly 2 → 3 (wk 11); **Weighted Dip 3 3 3 3 3 3 4 4 4 4 5 5**.<br>Thu Push: **Flat DB Bench 3 × 12 weeks**; High-Incline DB 2 → 3 (wk 3); Incline BB 2 → 3 (wk 8); Pec Deck 2 × 12; **Parallel Dip 3 → 4** (wk 10). | **Both push days' first press never takes a set, while the last chest slot (dips) climbs to 5.**<br>- Chest (a Focus group) climbs 22 → 27, and every one of the 5 added sets goes to slots 2-5. In weeks 11-12 the weighted dip holds 5 sets against the bench's 3.<br>- The version he graded A had bench 3 → 4 (week 7), DB bench 3 → 4 (week 8), weighted dip 3 → 4. This is a regression from that plan.<br>- Probable cause: the high-incline press now earns chest credit (R5-VOL-01). The chest steps are then spread across five chest lifts, and the dip's 0.5 chest credit plus its higher rep cap make it the cheapest place for a step.<br>- No `why` on the bench says it is held on purpose. `why.tested_locked` only means "same exercise in both tests". | VOL-07 (the day's first exercise takes the next set); R3-VOL-03; R5-VOL-01 side effect | major | `volume.mjs` addSet / boundsOf: after the credit change, keep VOL-07's order: the day's slot-1 press takes the group's first added set of each block before any later chest slot. A dip (0.5 chest) never out-sets slot 1. Add a regression test on 07: bench ≥ 4 by block 2 or 3, and dip ≤ bench + 1. |

### Minor

| # | Where | Problem | Rule | Severity | Engine fix hint |
|---|---|---|---|---|---|
| m1 | Shoulders on push days | **New, small.** Since R5-VOL-01, his 'Chest / Shoulders' slot (a high-incline press) counts for chest. The push days hold no shoulder press at all, and the shoulders reach 25 on helper credit plus the pull-day raises. Incline-first is his rule (R4-LIB-03), but R5-ATH-04 asks to keep some overhead pressing for health. | R4-LIB-03; R5-ATH-04 spirit | minor | In one block, let Thursday's 'Chest / Shoulders' slot take a seated DB overhead press, or offer it as the first swap. |
| m2 | Calves `6 6 6 6 · 7 7 7 8 · 8 9 10 10` | (Carried.) Under the floor of 10 for 10 weeks; one calf exercise on each leg day (R3-SES-01). The plan says nothing about it. | R3-SES-01 vs H17 | minor (open) | A line: "calves follow one exercise a leg day". |
| m3 | Sat "Legs 2 - hinge-led (leg press)" | (Carried.) Deadlift in slot 1, then the leg press; his sheet runs BKD → BHD. The title names the leg press. | R4-SES-05 | minor | Say why the tested hinge leads, or follow his order. |
| m4 | Wed Staggered-Stance DB Deadlift / Sat Alternating Staggered-Stance DB Deadlift, weeks 1-8 | (Carried.) The same lift twice a week. | Variety across exposures | minor | Penalise the same family on the twin leg day. |
| m5 | Week 11 working sets: Mon 25, **Tue 32**, Wed 29, Thu 23, **Fri 30**, Sat 27 | (Carried, worse.) The pull days carry the side-delt and bonus-curl growth; Thursday is 9 sets lighter than Tuesday. | VOL-08; R3-VOL-03 (alternate exposures) | minor | Balance added small-muscle sets across the two exposures by day load. |
| m6 | Tue / Wed hanging rotational knee raises; Sat Russian twist + V-up | (Carried.) Grip and flexion openers before a 4-6-rep row, the squat test and the deadlift test. | ATH-11; R2-SES-03 | minor | A plank or dead bug on the heavy-test days. |
| m7 | Thu Flat DB Bench at 4-6 reps | (Carried.) Heavy dumbbells at 4-6 are awkward to get into position. | Coach style | minor | A barbell or machine press for a 4-6 `work` slot. |
| m8 | Fri Supine (Lying) Curl → Seated DB Curl (block 3) | (Carried.) Two details change. | R2-LIB-01 | minor | One detail per block change. |
| m9 | Tue x01 / Fri s08 cable side raises | (Carried.) Leaning and side-lying trade days between blocks: the same two exercises. | R2-LIB-01 | minor | Change one detail, not the day. |
| m10 | `realized_top` chest 27.5, biceps 25.75, hips / shoulders 25.25 | (Carried, copy fixed.) A helper-credit overshoot in the JSON. | R4-PRG-04 | minor | Count helper credit before the last step. |
| m11 | Tue Bent-Over Barbell Row 4 → 5 at 4-6 reps | (Carried.) A heavy spinal load on the eve of the squat (and squat-test) day. | PER-04 spirit | minor | Mark it a light spinal load, or prefer a supported row there. |
| m12 | Sat `alternating-db-deadlift-alternate-lead-leg-staggered-side-each-rep-meaning-infer` | (Carried.) Inference text in a public id. | Data hygiene | minor | Rename through `id_aliases`. |
| m13 | No `07-push-pull-legs.es.md` | (Carried.) | H14 | minor | Add 07 to the Spanish run. |
| m14 | Tests in weeks 1 and 12 | "3 rep max or work up to a 1 rep max" (18 occurrences) with `previous_cycles.count: 0`. Defensible for an L3, but the wording is the same as in the other samples. | R2-PER-07 | minor | 3RM wording in a first block's week 1. |

**Count: 0 blockers, 1 major, 14 minors** (m2 is an open question).

## Fresh checks (as Lalo)

- **His PPL slots** (prog_byop_ppl_bootcamp, OBSERVED).
  - Push: horizontal press, 'Chest / Shoulders', incline, flies, dips, then two triceps.
  - Pull: two horizontal pulls, a vertical pull, ABduction, reverse flies, two biceps.
  - Legs: bilateral KD, bilateral HD, unilateral KD, leg extension, leg curl, unilateral HD, plus a calf raise.
  - The order holds. Core comes first.
- **Spine days.** One counted squat (Wed) and one counted deadlift (Sat).
- **Stairway.** 121 → 166 sets. Every group arrives in week 11 and holds. Back and chest (Focus) start at 22, the others at 15-20. RIR goes 3 → 1, with MYO on the last small-muscle items of week 12.
- **Honesty.** The bonus curl is said up front with its week.

## The one change that lifts it back to A

Restore VOL-07 on the push days: bench and flat DB bench take their 4th set in block 2, and the dips do not out-set them (M1).
