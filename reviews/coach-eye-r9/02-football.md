# Coach-eye review, round 9: 02 Football (college LB, off-season, 4 days, 12 weeks; engine 0.7.0)

**Grade: A** (coach's round-5 grade: A; kept). Both round-5 answers written about this plan are in exactly as he chose them:
- Friday's RDL starts at 3 and takes the hips' first step (R5-ATH-12).
- The bench takes a 5th set in the last block, so chest reaches 13 of 13 (R5-VOL-11).

The old "chest held at 12" line is gone, and the RDL now leads the Friday DB bench (r8 m1 is closed). Nothing new is wrong in the lifting. What is left is a tail of minors, most carried from earlier rounds, plus two new athletic-block items (m1, m2) that Lalo would fix in a minute with a pen.

Reviewed: `samples/plans/02-football.en.md` and `.json` (engine 0.7.0, model 1.3.0, `validation.ok: true`), plus `samples/intakes/02-football.json`.
- Warnings: `slot_held_groups` (arms), `athletic_capacity_block` (jumps 83 %, block 1), `laterality_capped` (56 / 30).
- There is no Spanish file.

Not judged: session length (CT-01).

---

## Round-5 answers that touch this plan

| Answer | What the plan does | Status |
|---|---|---|
| R5-ATH-12: heavy deadlift starts at 3 and takes the hips' next set first | Fri Stiff-Leg Deadlift / RDL `3 3 4 4 · 4 4 4 4 · 4 4 4 4` (was 2 for 9 weeks). Hyperextension steps only in week 11. Hips start at 15. | Applied |
| R5-VOL-11: one-set shortfall → the day's first press takes a 5th set in the last block | Tue Barbell Bench `4 4 5 4(+test)` in weeks 9-12. Chest `10 … 12 12 13 13`, final 13. `meta.stairway.one_set_shortfall` records it. | Applied |
| R5-VOL-09: athlete's flat press ≤ 4 by default | Bench 4 and Fri DB bench 4; the only 5 is the R5-VOL-11 set. | Applied |
| R5-ATH-10: a single-leg or lateral jump every training day; two-foot lateral first | Blocks 2-3: yes on every day. Block 1: Mon (lateral onto box) and Thu (two-foot lateral jump) yes, **Tue and Fri no** (m1). | Partly |
| R5-GRD-03: jumps go two-leg low → single-leg higher; no single-leg hurdle hops in block 1 | Block 1: lateral box jump, low box jump, ankle hops, low depth drop. Block 2: lateral box jump, bilateral right-angle hurdle hops. Block 3: Bulgarian split jumps, bilateral lateral hurdle hops, single-leg broad jump, single-leg ankle hops. No single-leg hurdle hop anywhere. | Applied |
| R5-ATH-02: athletic doses may hold ≤ 2 weeks and reach the block's final number | Totals climb weeks 1-11. Week 12 drops by half (m2). | Applied, apart from the test week |
| R5-ATH-11: no hard cardio on the eve of sprints or the heavy hinge | Blue run on Saturday (two days before Monday's starts). Thursday has no aerobic session, but it ends with a calorie buyout sprint (1 → 3 sets) the day before Friday's RDL (m18). | Applied (one borderline case) |
| R5-VOL-02: pull ≥ press | Back 10 → 13, chest 10 → 13. | Applied |
| R5-GRD-06: core optional | Printed on every core block. | Applied |
| CH5-01 / CH5-02 | No practices built in; the arm slot on every A / B day, held and said. | Applied |

## Round-8 items: status

| R8 # | Status in r9 |
|---|---|
| m1 RDL 2 sets vs DB bench 4 (G-205) | **Fixed** by R5-ATH-12: RDL 3 → 4 in week 3, ahead of the DB bench (week 5). |
| m2 front squat flat at 3 while lunges and leg extensions take the quads' steps | **Open** (m3): `2+T 3 3 3 · 3 3 3 3 · 3 3 3 2+T`. |
| m3 overview prints a tested week's back-off sets only | **Open** (m4). |
| m4 no throw on B days, no COD on Thursday | **Open** (m5). |
| m5 push : pull | **Answered** by R5-VOL-02 (equal finals, adjustable). |
| m6 two-leg share 56 % vs 30 % | Open question (m6), said up front. |
| m7 two staggered-stance single-leg hinges | **Open** (m7). |
| m8 barbell calf raise on the axial Friday | **Open** (m8). |
| m9 snatch pull 8 / 6 reps | **Open** (m9): "Low-Hang Snatch Pull — 2 × 8 Reps" in weeks 1-3. |
| m10 "3 rep max or work up to a 1 rep max", first block | **Open** (m10): 12 occurrences. |
| m11 "this one is easier" wrong way round | **Open** (m11). |
| m12 "Superset to save time: Seal Row + Front Squat" | **Open** (m12): 10 occurrences. |
| m13 Friday core flexion only | **Open** (m13): crunch / reverse crunch → leg raise / sit-up. |
| m14 Mon / Tue core never changes | **Open** (m14). |
| m15 420 m sprints vs 300-400 | **Open** (m15): weeks 9-11. |
| m16 Nordic "add weight next time" | **Open** (m16). |
| m17 slot-6 lifts labelled small-muscle accessories | **Open** (m17). |
| m18 "add an exercise" chest line | **Moot**: chest reaches 13. |

---

## Problems

### Blockers

None.

### Major

None.

### Minor

| # | Where | Problem | Rule | Severity | Engine fix hint |
|---|---|---|---|---|---|
| m1 | Tue B1 jump station weeks 1-4: **Low Box Jump** + ankle hops in place. Fri B2 weeks 1-4: **Low Depth Drop** + forward-backward ankle hops. | **New.** A linebacker is a cutting sport (`football_big_skill`, `cod_sport: true`). R5-ATH-10 confirmed "one single-leg or lateral jump every training day; in the first weeks a two-foot lateral jump". On two of the four days in block 1 there is none. The rule is only a +8 score (`selection.s6.jumps.cutting.bonus`), and here it lost to the plyo-share and variety terms. | R5-ATH-10; G-254 | minor | Make the cutting-sport daily lateral / single-leg jump a hard slot requirement (one jump station of the day must qualify). Or give the bonus a weight that outranks the variety terms. |
| m2 | Week 12 "Athletic work": 54 jumps, 56 throws, 120 m sprints, against 120 / 108 / 420 in week 11. The week is titled "Hardest weeks". Mon Bulgarian split jumps drop to 3 × 2. | **New in wording** (the drop is the test week). The plan says only "Same sets: on a tested lift the test takes the place of the top set". It never says the athletic work is halved so the athlete tests fresh. A reader of R5-ATH-02 ("reach the block's final number") sees the block end on its lowest week. | R5-ATH-02; R2-PER-07; H21 copy | minor | `render.mjs` week-12 "What changes" line: "Test week: jumps, throws and sprints are lighter so you test fresh". Or keep the non-tested days' athletic doses at their week-11 numbers. |
| m3 | Mon Front Squat `2+T 3 3 3 · 3 3 3 3 · 3 3 3 2+T`; side lunge 3, leg extension 2 → 3 | (Carried.) The week's counted squat never takes a 4th set while the quads' steps go to the lunges and leg extensions. There is no `why` saying it is held on purpose. | VOL-07; R3-VOL-03 | minor | Let the counted squat take the quads' next step once the day's lifts are level, or attach "held at 3: progress it by load". |
| m4 | Block tables, tested lifts in weeks 1 and 12 | (Carried.) Only the back-off sets print: bench "4 4 5 4" reads as a drop in week 12. | R2-PER-07 / G-60 | minor | Print "4+T". |
| m5 | Tue / Fri athletic blocks; Thu | (Carried.) No medball throw on either B day, and no COD station on Thursday. | OBSERVED BYOP athletic skeleton | minor | `AP_THROW` on B1 / B2, `AP_COD` on A2. |
| m6 | "Two-leg lifts are about 56 %" | (Carried, open Q2.) | open Q2 | minor (open question) | Wait for the coach. |
| m7 | Tue slot 4 staggered-stance DB deadlift + Fri slot 4 alternating staggered DB deadlift | (Carried.) The same hinge family on both B days. | Variety across exposures | minor | Penalise a second exposure from the same family. |
| m8 | Fri Barbell Calf Raise | (Carried.) A bar on the back on the axial RDL / snatch-pull day. | PER-04 spirit | minor | Rank non-axial calf picks first on the axial day. |
| m9 | Fri Low-Hang Snatch Pull 8 → 6 → 4 reps | (Carried.) Above the L3 Olympic 3-5 reps in weeks 1-9. | `reps.matrix.olympic.L3` | minor | Send Olympic pulls through the Olympic bracket. |
| m10 | Tests, weeks 1 and 12 | (Carried.) "3 rep max or work up to a 1 rep max" with `previous_cycles.count: 0`. | R2-PER-07; H19 | minor | 3RM only in a first block's week 1. |
| m11 | Swap lines: pull-up, weighted Russian twist | (Carried.) "this one is easier" is the wrong way round. | R4-LIB-04 | minor | Fix the difficulty order. |
| m12 | Mon "Superset to save time: Seal Row + Front Squat" | (Carried.) The front squat is a strength-rest `work` lift. | R3-SES-02 | minor | No superset that holds a strength-rest `work` lift. |
| m13 | Fri core: crunch / reverse crunch → leg raise / sit-up | (Carried.) Flexion only on the RDL / snatch-pull day. | R2-SES-03; G-131 | minor | One brace / anti-movement pick on the heavy-hinge day. |
| m14 | Mon / Tue core | (Carried.) Plank, bird dogs, side plank and dead bugs never change in 12 weeks; only the hold times move. The same anti-movement set as sample 08 (see 08 M1), for an athlete with no low-back pain (R5-ATH-08). | PER-02 / G-131; R5-ATH-08 | minor | One change per block within kind; let the profile's planes bring a rotational pick. |
| m15 | Weeks 9-11 sprints 420 m | (Carried.) Against the profile's 300-400 m. | profile `sprint.m_wk` | minor | Clamp to the band's top. |
| m16 | Tue Nordic Hamstring Curl | (Carried.) "When you hit 8 ... add weight next time" on a body-weight eccentric. | R4-PRG-03 | minor | "Lean further / slow the lowering". |
| m17 | "Easiest to remove" | (Carried.) Leg extension, Nordic and leg curl are listed as "small-muscle accessories". | R4-SES-04 | minor | A slot-6 label, or rank them after arms and calves. |
| m18 | Thu A2 conditioning: Calorie Effort (20 → 15 → 10 cal, bike / rower / ski), 1 → 3 all-out sets, the day before Friday's heavy RDL and snatch pull | **New, borderline.** R5-ATH-11 bans hard (Blue) cardio on the eve of the week's heavy deadlift. A sprint buyout is not a Blue session, but by week 9 it is 3 all-out efforts. The engine's `conditioning.s6.hard_eve` reads aerobic sessions only. | R5-ATH-11 | minor | Let `hard_eve` read conditioning finishers too: on the eve of the counted hinge or a top-speed day, keep the buyout at 1 set or move it to Monday. |

**Count: 0 blockers, 0 majors, 18 minors** (m6 is an open question).

## Fresh checks (as Lalo)

- **His A / B days, slot for slot** (R4-SES-05, CH5-02).
  - A day: row, squat, vertical pull, single-leg knee lift, biceps, leg extension, calf.
  - B day: bench, hinge, incline / overhead press, single-leg hinge, triceps, leg curl or Nordic, side or rear delts, calf.
  - Athletic block first, then power, then strength. Core first.
- **Spine days.** One counted squat (Mon front squat) and one counted hinge (Fri RDL), on different days.
- **The presses.** Bench 4 from week 2 and a 5th set in week 11. Incline 3 → 4 in block 3. DB bench 3 → 4 in week 5. Overhead (alternating DB → seesaw) 2 → 3 in block 3. The first press leads on both B days.
- **Stairway.** 73 → 87 sets. Every group arrives in week 11 and holds in week 12. RIR goes 3 → 2 → 1-2 → 1, with one MYO set on Friday in week 12 (not on a test day).
- **R5-CLS-07.** No group starts at its top.

## The one change that lifts it further

It is already his A. To make it cleaner:
- Hold the cutting-sport lateral jump on every day of block 1 (m1).
- Say why week 12's athletic work is lighter (m2).
- Close the long-carried athletic trio: the B-day throw and Thursday COD (m5), Olympic reps (m9), and a 3RM first test (m10).
