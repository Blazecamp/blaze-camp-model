# Coach-eye review, round 7: 02 Football (college LB, off-season, 4 days, 12 weeks)

**Grade: B.** The round-6 major is fixed as worded: Tuesday's incline DB press never holds more sets than the bench press again. But the fix brought a new major. To give chest its 13th set, the engine added a flat DB fly to Tuesday from week 1. Once the fly is in, it takes chest's week-9 step ahead of the bench. As a result the linebacker's main press, which is also the lift he tests, never gets a 4th work set in 12 weeks (r6: 4 from week 5). Tuesday ends at bench 3 / incline 3 / fly 3, while Friday's DB bench reaches 4. This is the same "add it to the first exercise" rule broken in a new way. Four r6 minors are fixed (m15-m18). m1 (the RDL) narrowed. Most other minors are carried over unchanged. Four new minors were found.

Reviewed: `samples/plans/02-football.en.md`, `samples/plans/02-football.json` (engine 0.6.0, model 1.3.0, `validation.ok: true`) and the intake `samples/intakes/02-football.json` (`lang: en`, no `.es.md`).
Authority used: CH5 + R4 + CT-01 > CX > R3 > R2 > full > chat > sheets (`analysis/programs/prog_byop_athletic.md`), plus the `football_big_skill` profile (`synthesis/04_profiles.json`) and DECISIONS G-200..G-216.
Session length and minutes were not judged (CT-01). Open coach questions (STATUS Q1-Q14; DECISIONS G-205) are rated minor at most.

## Round-6 items: status

| R6 # | Problem | Status in r7 |
|---|---|---|
| M1 | Tue incline DB press 5 sets over the bench's 4 (weeks 11-12) | **Fixed as written** (G-209 `athlete_press_max.later_capped`). Incline `2 2 2 2 · 3 3 3 3 · 3 3 3 3`, never above the bench. **But the fix created new M1 below:** the bench itself now stops at 3, and a bonus fly takes the step. |
| m1 | Fri RDL 2 sets vs DB bench (G-205) | **Narrowed, still open.** The DB bench is now `3 ×10, 4 4`, not 4 every week. The RDL is `2 ×9, 3 3 3`. The gap is 1 set in weeks 1-9 (was 2). The RDL is level with it in week 10 and one under in weeks 11-12. |
| m2 | No throw on B days, no COD on Thursday; throws under band wk 1-3 | Not changed (throws 63 / 63 / 69 against 70-78). |
| m3 | Push ahead of pull, weeks 9-12 | **Improved.** Push 15-16 (bench 3, incline 3, fly 3, DB bench 3-4, seesaw 3) against pull 15-16 (seal row 3-4, pull-up 3, cable row 3, SA pulldown 3, reverse fly 3): now 1 : 1, still under `push_pull 1 : 1.1`. Open Q14. |
| m4 | Two-leg share 53 % vs 30 % | Not changed (open Q2). |
| m5 | Two kickstand-style single-leg hinges | Not changed. |
| m6 | Barbell calf raise on the axial Friday | Not changed. |
| m7 | Snatch pull 8, then 6 reps | **Partly fixed.** Weeks 10-12 are now 4 reps. Weeks 1-3 are still 8 and weeks 4-9 still 6, outside the L3 Olympic 3-5. |
| m8 | "3 rep max or work up to a 1 rep max" with `previous_cycles.count: 0` | Not changed (lines 297-299, 398-399). |
| m9 | "Pull-up ... this one is easier", "Weighted Russian Twist ... easier" | Not changed. |
| m10 | "Superset to save time: Seal Row + Front Squat" while the squat rests 3-6 min | Not changed (week 5 shows 3 × 6-8 at 3-6 min rest, with the superset still printed). |
| m11 | Flexion-only core on the RDL Friday; weighted sit-ups on Thursday | Not changed. |
| m12 | Core block changes not one detail; Mon / Tue core never changes | Not changed. |
| m13 | 420 m sprints in weeks 10-11 vs 300-400 | Not changed. |
| m14 | Nordic "add weight next time" with no regression | Not changed. |
| m15 | Table legend explained '-' rows / bracket read two ways | **Fixed** (G-211): the legend now says only what "7 (4 direct)" means. |
| m16 | Shoulders printed 13 from week 9 | **Fixed** (G-212): `12 12 13 13` in weeks 9-12. |
| m17 | Week-1 glance "Chest 1, Shoulders 2" on Tuesday | **Fixed** (G-213): "Chest 3, Shoulders 1". Friday "Chest 1, Shoulders 2" is right. |
| m18 | MYO on the test days of week 12 | **Fixed** (G-214): week 12 has one MYO, on Friday's reverse fly. |

## Problems by severity

### Blockers

None.

### Major

| # | Where | Problem | Rule | Severity | Engine fix hint |
|---|---|---|---|---|---|
| M1 | Tue B1: Barbell Bench Press (slot 1), Alternating Incline DB Press (slot 3), **Flat DB Fly (bonus `Tue.B1.x01`)**; Fri B2 Flat DB Bench Press | **The bonus fly takes the chest's step ahead of the day's first press. The linebacker's main bench never gets a 4th set.** Sets by week: bench `2+test 3 3 3 · 3 3 3 3 · 3 3 3 2+test`; incline `2 2 2 2 · 3 3 3 3 · 3 3 3 3`; fly `2 2 2 2 · 2 2 2 2 · 3 3 3 3`; Fri DB bench `3 ×10, 4 4`. Week 9's chest step is printed as "+1 set on Flat DB Fly (Tuesday): 2 → 3 sets" while the bench sits at 3, under the athlete press cap of 4. Week 11's step goes to Friday's DB bench (3 → 4), not Tuesday's bench. So in the hardest weeks Tuesday reads 3 / 3 / 3 (bench / incline / fly), and a B2 secondary press out-sets the B1 bench that he tests in week 12. This is a regression: in r6 the bench held 4 from week 5. Three things go wrong. (1) The fly is in from week 1, but a bonus is needed only for the 13th set, which the template lifts cannot hold. At the cap, bench 4 + incline 4 + DB bench 4 = 12. In weeks 1-10 the template lifts have 2-3 free set places. (2) `kMainBig` in `volume.mjs` lets a bonus "take its turn as the fewest" whenever it sits under every template lift of its day. That moves it ahead of the bench. This is the opposite of G-209's own words, "takes a set only when the group's template lifts can take no more". (3) R3-VOL-03 alternation (B1's first exposure, then B2's) is broken: B2 steps and B1 never does. Coach's sheet: his athletic B day holds press, incline / vertical press, triceps; there is no chest fly. His rule: "if there are 3 exercises and I need to add an extra set of volume, then I add it to the first exercise on the list." This is the main press and the tested lift of a 230-lb LB. Lalo would not sign a plan where the fly gets the set. | VOL-07 ("add it to the first exercise ... 4, 3, 3"); CH5-03 (bonus only "if needed"); R3-VOL-03 (alternate B1 then B2); R4-SES-05 (slot 1 = the day's main horizontal press; extras are small-muscle or core); G-209 `main_day_template_first` | major | `volume.planWeeklySets`: (a) do not open a training-day bonus for a big group until every template lift of the group is at its bound (`athlete_press_max` 4) in that week. Open it at the latest exercise block that needs it, at its fewest sets (2), not from week 1. (b) In `kMainBig`, drop the "bonus under every template lift takes its turn as the fewest" clause on athletic days: a bonus always sorts after a template lift with room. (c) Let `kTwinGo` / R3-VOL-03 alternation apply to the slot-1 presses of B1 / B2: Tuesday's bench takes 3 → 4 before Friday's DB bench. Expected chest: bench `… 4 4 4`, incline 3-4, DB bench 4. Then either hold chest at 12 of 13, marked `capped` and said (H10), or add a 2-set bonus at the top only. Which one is the coach's call; the r6 hint (b), raising `athlete_press_max` to the L3 max of 5 for the slot-1 press only, also removes the need for the fly. Test: on athletic.4 B1 / B2, for every week, no bonus item of a group gains a set while a template item of that group on a main day is below its upper bound; and the B1 slot-1 press reaches the cap no later than the B2 slot-1 press. |

### Minor

| # | Where | Problem | Rule | Severity | Engine fix hint |
|---|---|---|---|---|---|
| m1 | Fri B2 slot 2, RDL | (Open, G-205; narrowed.) The week's only heavy hinge holds 2 sets for weeks 1-9 while the DB bench holds 3. They are level in week 10, and the bench is ahead again in weeks 11-12 (4 vs 3). | VOL-07; R4-SES-05; **open G-205** | minor (open question) | Wait for the coach's answer. After M1 the DB bench may rise less, which narrows this further. |
| m2 | Tue / Fri athletic block; Thu | (Carried over, 4th round.) No medicine-ball throw on either B day, no change-of-direction station on Thursday. Throws are 63 / 63 / 69 in weeks 1-3, against a 70-78 target. | OBSERVED BYOP athletic skeleton; profile `throwing.throws_wk`, `cod` | minor | `AP_THROW` on B1 / B2, `AP_COD` on A2, or give a free station to the quality furthest under its band. |
| m3 | Weeks 9-12, upper body | Push and pull now 1 : 1 (15-16 each), still under `push_pull 1 : 1.1`. M1's fix (the fly out) moves this to the target. | open Q14 / Q5 | minor (open question) | Re-measure after M1. |
| m4 | "Before you start" | Two-leg lifts are 53 % of lower-body sets against 30 %. The plan says so honestly. | open Q2 | minor (open question) | Wait for the coach. |
| m5 | Tue B1 slot 4 + Fri B2 slot 4 | (Carried over, 4th round.) Both single-leg hinges are staggered-stance DB deadlifts, with the same "1-second pause just below the knee" block change. | R4-SES-05 slot 4; variety across exposures | minor | `select.mjs`: penalise a second exposure from the same movement family. |
| m6 | Fri B2 accessories | (Carried over.) Barbell calf raise (bar on the back) on the axial RDL / snatch-pull day. | PER-04 / R2-SES-01 spirit (H07 not broken) | minor | Rank non-axial calf picks first on the axial day. |
| m7 | Fri power block, Low-Hang Snatch Pull | (Partly fixed.) Weeks 10-12 are now 4 reps; weeks 1-3 are still 8 and weeks 4-9 still 6, against the L3 Olympic 3-5. The block overview table also prints "8 Reps → 6 Reps" and leaves out the 4 that weeks 10-12 print. | `rules.reps.matrix.olympic.L3`; R4-LIB-04 spirit | minor | `dose.mjs`: send Olympic pulls through the Olympic bracket in every week; the overview's rep column lists every distinct stage. |
| m8 | Mon / Tue week 1 | (Carried over.) "3 rep max or work up to a 1 rep max" for an athlete with no completed block. | R2-PER-07; H19 | minor | When `previous_cycles.count == 0`, print the 3RM only. |
| m9 | Swap lines: Chin-Up / Wide-Grip Pull-Up (Mon), Cable Oblique Rotation (Wed), Woodchopper (Sat) | (Carried over.) "Pull-up ... this one is easier"; "Weighted Russian Twist ... this one is easier". | R4-LIB-04 | minor | Fix the difficulty order in the catalog amendment. |
| m10 | Mon, weeks 5-11 | (Carried over.) "Superset to save time: Seal Row + Front Squat" while the front squat rests 3-6 min. | R3-SES-02; ORD | minor | `week.mjs`: no superset holding the day's `work` lift once its rest is strength-length. |
| m11 | Core, Thu / Fri | (Carried over.) Friday core is flexion only all block (crunch + reverse crunch, then crunch + leg raise, then sit-up + leg raise) on the RDL / snatch-pull day. Thursday has weighted decline sit-up, then V-up, then weighted sit-up. This goes against "static bracing first" and the G-131 low-back lean. | R2-SES-03; profile `core.mode`; G-131 | minor | Pair one flexion pick with one brace / anti-movement pick on the heavy-hinge day. |
| m12 | Core block changes | (Carried over.) Mon / Tue core (plank, bird dogs, side plank, dead bugs) never changes in 12 weeks; Thursday's "Weighted Decline Sit-Up → V-Up" is not a one-detail change. | PER-02 / G-134; open Q11 | minor | Change within kind and loading, one detail at a time. |
| m13 | Weeks 10-11 | (Carried over.) 420 m of sprints against the profile's 300-400 m (targets 390 / 400). | profile `sprint.m_wk` | minor | `budget.mjs`: clamp the sprint ladder to the band's top. |
| m14 | Tue B1, Nordic Hamstring Curl | (Carried over.) "When you hit 8 ... add weight next time" on a body-weight eccentric, with no regression cue, from week 1 for a first-block athlete. | R4-PRG-03 | minor | Body-weight eccentric wording: "lean further / slow the lowering"; add a regression note. |
| m15 | "Easiest to remove" lines, Mon / Tue / Thu / Fri | **New.** Under "small-muscle accessories" the plan lists the leg extension (quads), Nordic hamstring curl and leg curls (hips). These are R4-SES-05 slot-6 lifts of big groups. Removing them takes 2-3 sets a day off quads or hips, but the client is told they are small-muscle extras. | R4-SES-04 (name what is easiest to remove, truthfully); R4-SES-05 slot 6; R4-LIB-04 spirit | minor | `week.mjs` easy_to_remove: give slot-6 lifts of a big group their own label ("leg extension / leg curl: your template's last lift"), or rank them after the arm and calf accessories. |
| m16 | "Before you start" | **New.** The Tuesday fly holds 3 of chest's 13 final sets, but nothing up front says so. The fly is also listed as easiest to remove ("· 1 more"). Removing it leaves chest at about 10. G-204 / G-208 print this line only for optional-day bonuses. (After M1, this matters only if a bonus remains.) | H10 / H17 "said plainly"; CH5-03; G-208 | minor | Extend `render.v6.optional_bonus_line` to training-day bonus exercises: "Chest: n of its 13 final sets come from the Flat DB Fly on Tuesday; skip it and chest ends at about …". |
| m17 | `engine/DECISIONS.md` G-209 / G-215, `samples/STATUS_v0.5.md` round-6 section | **New (docs, not the plan).** The text does not match the plan. G-215 says "Tuesday bench holds 3 sets until week 11 while Friday's DB bench takes its 4th in week 9". STATUS says the incline is "capped at the athlete's press cap with it". In the plan, the bench never takes a 4th work set, the DB bench steps in week 11, and the cap of 4 is never reached on Tuesday. A reader of the decision log would not see M1. | AGENTS §11.1 step 5 (log what changed, truthfully) | minor | Correct G-209 / G-215 and the STATUS line when M1 is fixed. |
| m18 | Tue B1, Flat DB Fly placement | **New.** The fly is printed last, after the calf raise, 5th of 5 accessories. It is a big-group exercise sitting behind small-muscle work. If a bonus stays after M1, it belongs right after the day's template presses or before the arm and calf accessories. | ORD (big before small); R4-SES-05 "extras ... at the end" are small-muscle or core | minor | `week.mjs`: place a big group's training-day bonus after the last template lift of its group, before the accessories. |

**Count: 0 blockers, 1 major, 18 minors** (m1, m3 and m4 are open coach questions).

## What is right (praise)

- **His skeleton, slot for slot.** A = two-arm row, two-leg squat, vertical pull, single-leg knee lift, biceps, leg extension. B = horizontal press, two-leg hinge, incline / vertical press, single-leg hinge, triceps, leg curl (Nordic on Tuesday). The athletic block comes first, then power, then strength. Day counts are 9-12 inside the field-athlete cap, with the ankle prep and core outside the count.
- **The r6 incline problem is gone.** No later lift of any group out-sets the day's first lift of that group in any week, the test set counted with its lift.
- **Spine loading is correct.** One heavy squat (Monday front squat) and one heavy hinge (Friday RDL), on different days.
- **Clean stairway.** Quads and hips 14 → 18, back / chest / shoulders 10 → 13. Totals 73 → 88. Every group arrives in week 11 and holds in week 12. The floor of 10 holds from week 1. Set lines say exactly what moved.
- **Printed words are now true.** The table legend, the "7 (4 direct)" cells, the glance counts by credit, and shoulders not printed as arrived early.
- **The test weeks are the session's focus.** Week 12 carries one MYO set, on Friday. Tests fall only in weeks 1 and 12, and the tested lift goes first and replaces its top set.
- **Athletic dosing fits a linebacker.** Accelerations and falling starts; Receive-Create Land → Land & Go → Repeat; route-named cuts (81-99 against 80-100); medicine balls of 20 lb or less; Olympic sets 8-12 a week; the snatch pull finally reaches 4 reps in the last block.
- **Progression is a rule the athlete applies.** Effort drifts 3 → 2 → 1-2 → 1 RIR + MYO and never goes to failure on a compound.
