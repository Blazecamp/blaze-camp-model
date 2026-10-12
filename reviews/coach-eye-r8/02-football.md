# Coach-eye review, round 8: 02 Football (college LB, off-season, 4 days, 12 weeks)

**Grade: B+** (up from B). The round-7 major is fixed. The Tuesday fly is gone. The bench press takes its 4th work set in week 2 and keeps it to the end. Chest is held at 12 of its planned 13, and the plan says so in its first line. The two B days now step in his order (G-218 / G-219 / G-220): Tuesday's bench in week 2, Friday's DB bench in week 5, the incline in week 11. No lift is out-set by a later lift of its group on any day.

What is left is a list of minors. Most are carried over from earlier rounds: the athletic block's missing throw and COD stations, flexion-only Friday core, the snatch-pull reps, the "1 rep max" wording, the superset with the front squat, and similar. One minor is new: the front squat stays at 3 sets for all 12 weeks while the quads' steps go to the lunges and leg extensions. Lalo would hand this plan to the linebacker after a short edit pass.

Reviewed: `samples/plans/02-football.en.md` and `samples/plans/02-football.json` (engine 0.6.0, model 1.3.0, `validation.ok: true`, warnings `capped_by_template` chest 12/13, `slot_held_groups`, `laterality_capped` 53/30), plus the intake `samples/intakes/02-football.json`. There is no `.es.md` for this sample.

Authority used, in order: CH5, R4 and CT-01, then CX, R3, R2, the full answers, chat, and the sheets (`analysis/programs/prog_byop_athletic.md`, `dumps/BYOP/`). Also read: the `football_big_skill` profile and DECISIONS G-200..G-225.

Not judged: session length (CT-01). Open coach questions are rated minor at most: G-205 (RDL vs press), G-219 (one-set shortfall), and STATUS Q2 / Q5 / Q14.

## Round-7 items: status

| R7 # | Problem | Status in r8 |
|---|---|---|
| **M1** | Bonus fly took chest's step ahead of the bench; the bench never got a 4th set | **Fixed.**<br>- No fly.<br>- Bench `3+test 4 4 4 · 4 4 4 4 · 4 4 4 3+test`.<br>- Incline `3 3 3 3 · 3 3 3 3 · 3 3 4 4`.<br>- Friday DB bench `3 3 3 3 · 4 4 4 4 · 4 4 4 4`.<br>- Chest `10 → 12 of 13`, held and said up front: "Chest: this template holds 12 weekly sets, below the planned 13. Add an exercise if you want more." (G-219)<br>- B1 steps before B2 (G-220). |
| m1 | Fri RDL vs DB bench (G-205) | **Open, and wider.** Now that the DB bench takes its 4th set in week 5 (it was week 11), the gap is 2 sets in weeks 5-9: DB bench 4, RDL 2. It is 1 set in weeks 1-4 and 10-12. Open question, so minor. |
| m2 | No throw on the B days, no COD on Thursday; throws under the band in weeks 1-3 | Not changed: 63 / 63 / 69 throws. |
| m3 | Push ahead of pull in weeks 9-12 | **Improved.** In week 11, push is 15 (bench 4, incline 4, DB bench 4, seesaw 3) and pull is 16 (seal row 4, pull-up 3, cable row 3, SA pulldown 3, reverse fly 3). That is about 1 : 1.07, just under 1 : 1.1. Open Q5 / Q14. |
| m4 | Two-leg share 53 % vs 30 % | Not changed (open Q2). Said up front. |
| m5 | Two kickstand-style single-leg hinges | Not changed. |
| m6 | Barbell calf raise on the axial Friday | Not changed. |
| m7 | Snatch pull at 8 / 6 reps | Not changed: 8 in weeks 1-4, 6 in weeks 5-9, 4 in weeks 10-12. The overview still prints "8 Reps → 6 Reps". |
| m8 | "3 rep max or work up to a 1 rep max", first block | Not changed (12 occurrences). |
| m9 | "this one is easier" wrong way round | Not changed (Pull-up; Weighted Russian Twist). |
| m10 | "Superset to save time: Seal Row + Front Squat" | Not changed. |
| m11 | Friday core flexion only | Not changed. |
| m12 | Mon / Tue core never changes | Not changed. |
| m13 | 420 m sprints in weeks 10-11 | Not changed. |
| m14 | Nordic "add weight next time" | Not changed. Week 1 reads "when you hit 8 ... add weight next time". |
| m15 | "Easiest to remove" labels slot-6 lifts as small-muscle | Not changed. Leg extension, Nordic and leg curl are still listed under "small-muscle accessories". |
| m16 | Fly's share of chest not said | **Moot.** There is no fly. The capped line is printed. |
| m17 | DECISIONS / STATUS text did not match the plan | **Fixed.** G-220 ("bench 3 → 4 in week 2, DB bench in week 5, the incline in week 11") matches the plan. G-224 retires G-209's second half and G-215's sentence. |
| m18 | Fly printed after the calf raise | **Moot.** There is no fly. |

## Problems by severity

### Blockers

None.

### Major

None.

### Minor

| # | Where | Problem | Rule | Severity | Engine fix hint |
|---|---|---|---|---|---|
| m1 | Fri B2: Stiff-Leg Deadlift / RDL `2 ×9, 3 3 3` vs Flat DB Bench `3 3 3 3 · 4 ×8` | (Open G-205, wider than in r7.) The week's only heavy hinge holds 2 sets while the B2 press holds 4 in weeks 5-9. | VOL-07; R4-SES-05; **open G-205** | minor (open question) | Wait for the coach. If he says hinge before press, let the counted hinge take the B2 day's next set before the press's 4th. |
| m2 | Mon A1: Front Squat `2+test 3 3 3 · 3 3 3 3 · 3 3 3 2+test`; Side Lunge 3; Leg Extension `2 ×9, 3 3 3`. Thu A2: Leg Press 3 flat; RFE / FFE 2 → 3; Leg Extension 2 → 3 (wk 11) | **New.** The week's counted squat, which is also the tested lift, never takes a 4th set. The quads' steps go to the lunges (weeks 2 and 7) and the leg extensions (weeks 10 and 11). By week 10, Monday reads 3 / 3 / 3 and Thursday 3 / 3 / 3. This is the same "the first lift waits while the last lift fills up" shape as r7 M1, but on template lifts only and with no bonus. A front squat at 3 × 6-8 is a sensible dose for a linebacker, and his athletic sheet doses 2 sets a slot, so this is minor. But no `why` says the squat is held on purpose, and VOL-07 says the next set goes to the first lift ("4, 3, 3"). | VOL-07; R3-VOL-03; R2-SES-01 (heavy squat once a week) | minor | Either let the day's counted `work` squat take the quads' next step once the day's lifts are level (3 / 3 / 2 → 4 / 3 / 2, not 3 / 3 / 3). Or, if it is held for the spine (as with the bench at the press cap), attach a `why` and print "held at 3 work sets: progress it by load". |
| m3 | Block overview table, Tue Barbell Bench `3 4 4 4 · … · 4 4 4 3`, Mon Front Squat `2 3 3 3 · … · 3 3 3 2`, Fri RDL; week 12 Tuesday detail: bench "3 × 6-8 back-off" next to incline "4 × 8-10" | **New (copy).** The overview prints only the back-off sets of a tested lift. In weeks 1 and 12 the bench reads one set lower than the incline press below it (3 vs 4 in week 12). The test set takes the top set's place (G-60), so the count is right, but a reader of the table sees the main press drop in the test week. | R2-PER-07 / G-60; accurate copy | minor | `render.mjs` block table: print a tested week as "3+T" (with a legend line "T = the test top set"), or count the test set into the cell. |
| m4 | Tue / Fri athletic block; Thu | (Carried, 5th round.) No medicine-ball throw on either B day, and no change-of-direction station on Thursday. Throws are 63 / 63 / 69 in weeks 1-3, against 70-78. | OBSERVED BYOP athletic skeleton; profile `throwing`, `cod` | minor | `AP_THROW` on B1 / B2, `AP_COD` on A2, or give a free station to the quality furthest under its band. |
| m5 | Weeks 9-12, upper body | (Carried.) Push : pull about 1 : 1.07, just under `push_pull 1 : 1.1`. | open Q5 / Q14 | minor (open question) | Wait for the coach. |
| m6 | "Before you start", line 3 | (Carried.) Two-leg lifts are 53 % of lower-body sets against 30 %. The plan says so. | open Q2 | minor (open question) | Wait for the coach. |
| m7 | Tue B1 slot 4 + Fri B2 slot 4 | (Carried.) Both single-leg hinges are staggered-stance DB deadlifts with the same "1-second pause just below the knee" change. | R4-SES-05 slot 4; variety across exposures | minor | `select.mjs`: penalise a second exposure from the same movement family. |
| m8 | Fri B2 accessories | (Carried.) Barbell calf raise (bar on the back) on the axial RDL / snatch-pull day. | PER-04 / R2-SES-01 spirit | minor | Rank non-axial calf picks first on the axial day. |
| m9 | Fri power block, Low-Hang Snatch Pull | (Carried.) 8 reps in weeks 1-4 and 6 in weeks 5-9, against the L3 Olympic 3-5. The overview prints "8 Reps → 6 Reps" and leaves out the 4 of weeks 10-12. | `rules.reps.matrix.olympic.L3` | minor | `dose.mjs`: send Olympic pulls through the Olympic bracket in every week. The overview lists every rep stage. |
| m10 | Mon / Tue week 1 and week 12 tests | (Carried.) "3 rep max or work up to a 1 rep max" for an athlete with `previous_cycles.count: 0` (in week 1 especially). | R2-PER-07; H19 | minor | When `previous_cycles.count == 0`, print the 3RM only in week 1. |
| m11 | Swap lines: Pull-up, Weighted Russian Twist | (Carried.) "this one is easier" is wrong way round. | R4-LIB-04 | minor | Fix the difficulty order in the catalog amendment. |
| m12 | Mon, weeks 1-11 | (Carried.) "Superset to save time: Seal Row + Front Squat" while the front squat rests 3-6 min. | R3-SES-02; ORD | minor | `week.mjs`: no superset that holds the day's `work` lift once its rest is strength-length. |
| m13 | Core, Thu / Fri | (Carried.) Friday core is flexion only for the whole block (crunch, reverse crunch → sit-up, leg raise) on the RDL / snatch-pull day. Thursday runs weighted decline sit-up → V-up → weighted sit-up. | R2-SES-03; G-131 | minor | Pair one flexion pick with one brace / anti-movement pick on the heavy-hinge day. |
| m14 | Core block changes | (Carried.) Mon / Tue core (plank, bird dogs, side plank, dead bugs) never changes in 12 weeks. | PER-02 / G-134; open Q11 | minor | Change within kind and loading, one detail at a time. |
| m15 | Weeks 10-11 | (Carried.) 420 m of sprints against the profile's 300-400 m. | profile `sprint.m_wk` | minor | `budget.mjs`: clamp the sprint ladder to the band's top. |
| m16 | Tue B1, Nordic Hamstring Curl | (Carried.) "When you hit 8 ... add weight next time" on a body-weight eccentric, with no regression cue. | R4-PRG-03 | minor | Body-weight eccentric wording: "lean further / slow the lowering", plus a regression note. |
| m17 | "Easiest to remove" lines, Mon / Tue / Thu / Fri | (Carried.) Leg extension, Nordic and leg curls are listed as "small-muscle accessories". They are R4-SES-05 slot-6 lifts of big groups. | R4-SES-04; R4-SES-05 slot 6 | minor | Give slot-6 lifts their own label, or rank them after the arm and calf accessories. |
| m18 | "Before you start", chest line | **New (small).** "Add an exercise if you want more" does not say which exercise or where. On a full-gym 4-day athletic week the natural answer is a 2-set fly or a cable press at the end of Tuesday. It is also an open question whether the slot-1 press should take a 5th set instead (G-219). | H10 "said plainly"; CX-04; **open G-219** | minor (open question) | `ui.plan.capped_group`: name the day and the kind of exercise ("e.g. a 2-set fly at the end of Tuesday"). Wait for G-219. |

**Count: 0 blockers, 0 majors, 18 minors.** m1, m5, m6 and m18 are open coach questions.

## Fresh checks

- **His A/B skeleton (R4-SES-05).** It is intact. A = two-arm row, two-leg squat, vertical pull, single-leg knee lift, biceps (slot 5, CH5-02), leg extension. B = horizontal press, two-leg hinge, incline / vertical press, single-leg hinge, triceps, leg curl / Nordic. The athletic block comes first, then power, then strength. Core is first (H05). Horizontal comes before vertical (H04). Knee lifts pair with pulls and hip lifts with pushes (H06).
- **VOL-07 on the presses.** Tuesday is bench 4 / incline 3 from week 2, then 4 / 4 in weeks 11-12. Friday is DB bench 4 / seesaw 2-3. The first press leads on both days, and B1 steps before B2 (R3-VOL-03).
- **Stairway.** Totals run 72 → 87. The largest weekly rise is 6.1 %, and no group step is over 15 %. Every group but chest arrives in week 11 and holds in week 12. Chest is held at 12 and said (H10). Shoulders credit to 13.75 against a final of 13 (helper credit from the incline's 4th set), and the table prints 13. That is inside the "one above" ceiling reading. The effort cue drifts 3 → 2 → 1-2 → 1 RIR, with one MYO set on Friday in week 12 (no test day carries one).
- **Spine days.** One counted squat (Monday front squat) and one counted hinge (Friday RDL), on different days.
- **Team practices (CH5-01).** They are not built in, and the plan does not count them.
- **Liability and product.** The release is at the top. Swaps say what they keep and lose. Every exercise has a YouTube search link and a name to copy. Progression is written as a rule the athlete applies.

## What Lalo would like

- The bench is the lift again: 4 work sets from week 2, the tested lift, and first on its day.
- The answer to "the template cannot hold 13" is honest and short: the plan holds 12 and says so, with no fly forced in.
- The chest steps alternate between his two B days the way he described.

## The one change that lifts it

Close out the long-carried athletic minors: add the B-day throw and the Thursday COD station (m4), put Olympic reps in the 3-5 band (m9), and use a 3RM-only test for a first block (m10). Then decide whether the front squat is held on purpose and say so (m2). With those done, this is an A-.
