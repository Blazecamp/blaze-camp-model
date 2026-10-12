# Coach-eye review, round 8: 06 Full-body aesthetics (L3, 4 days A/B + 2 optional, Focus glutes + side delts)

**Grade: B+** (same as r5, no regression). The skeleton, spine days, pairing, core-first order, incline bias, the stairway and the honesty lines all hold.

The new bonus rule helps this plan:
- The Friday pec-deck now opens only in week 9, once the four presses are all at 5 sets.
- The Wednesday machine row comes in at week 5 instead of week 1.
- The r5 m1 gap is closed: the plan now says that 5 of the back's 25 final sets sit on the optional days, and from which week.

Every group step stays under 15 %: the largest are back +11 % (week 5) and chest +10 % (week 9), so no note is owed.

The flat-then-step pattern the change brought is mild. Back runs 20 / 20 / 20 → 22 → 24 / 24 / 24 → 25, and chest 22 / 22 / 22 → 23. Both are sensible for an L3 client who progresses load in the held weeks (CX-02).

What is new is small:
- The optional-day row opens three weeks before the main-day pulldowns reach their 5th set.
- The optional-day bonus curl holds 4 sets while both main-day curls hold 3.
- The A-day rear-delt stations still print as "(bonus) ... to reach your weekly sets", although they are template work.

The rest are the r5 minors, nearly all still open.

Reviewed: `samples/plans/06-full-body-aesthetics.en.md` and `samples/plans/06-full-body-aesthetics.json` (engine 0.6.0, model 1.3.0, `validation.ok: true`, warnings `capped_by_template` for chest 23/25, biceps 18/25 and triceps 20/25), plus `samples/intakes/06-full-body-aesthetics.json`. There is no `.es.md`.

Authority used, in order: CH5-03 ("no cap until 35"), R4 and CT-01, then CX, R3, R2, the full answers and the sheets (`analysis/programs/prog_byop_aesthetics.md`). Also read: DECISIONS G-200..G-225.

Not judged: session length (CT-01). Open items are rated minor at most: G-119 (1)-(5), G-199 (chest 23 / biceps 18 / triceps 20 of 25), STATUS Q7 (side-delt direct sets) and G-219.

---

## Round-5 items: status

| R5 # | Problem | Status in r8 |
|---|---|---|
| m1 | Back's optional-day sets not said; the Wed row in from week 1 | **Fixed.**<br>- "Back: 5 of its 25 final sets sit on your optional days (Machine Row (Close / Neutral Grip), Wednesday, from week 5; Lat Pulldown (Close Grip), Saturday, from week 9). Skip those days and the back total ends at about 20."<br>- The row opens in week 5, not week 1.<br>- New nuance: see m1 below. |
| m2 | No two-arm standard pulldown or pull-up on the A days | **Open** (m4). |
| m3 | No overhead press in 12 weeks | **Open** (m5). |
| m4 | Close-grip incline in block 2 on a 2-triceps day | **Open** (m6, now with the twin pushdowns). |
| m5 | Focus 1 (glutes) never opens a session | **Open** (m7). |
| m6 | Copenhagen plank before the front squat; hanging drill before the bench | **Open** (m8). |
| m7 | Bent-over barbell row the day before the hex-bar deadlift | **Open** (m9). Block 3 is now the Yates-grip row. |
| m8 | MYO "about 15 reps" on 20-30-rep reverse flies | **Open** (m10). |
| m9 | Hips 27.25 against a final of 27 | **Open, and shoulders now too** (27.25 against 27) (m11). |
| m10 | B-day slot 2 did not alternate; hex flat at 3 | **Mostly fixed.** Hip thrust 3 → 4 (wk 7), hex 3 → 4 (wk 8), hip thrust 4 → 5 (wk 11): the two exposures alternate. Tuesday's staggered deadlift stays at 3 for 12 weeks (held at the B-day's slot-4 level), which is acceptable. |
| m11 | Optional days split by Focus (Wed glutes × 2, Sat side delts × 2) | **Open** (m12). |
| m12 | Calf duplicates in block 3 | **Open** (m13): Monday and Saturday both run "Machine Calf Raise - 1-second squeeze at the top". |
| m13 | Body-weight-first cue on an L3 plan | **Open** (m14): 24 occurrences. |
| m14 | Per-session volume above VOL-08; slot 1 opens at 4 | Open question G-119 (m15). |
| m15 | Inference text in an exercise id | **Open** (m16): `alternating-db-deadlift-alternate-lead-leg-staggered-side-each-rep-meaning-infer`. |
| m16 | Chest 23 / biceps 18 / triceps 20 of 25 | Open question G-199 (m17). Said up front. |

---

## Problems by severity

### Blockers

None.

### Major

None.

### Minor

| # | Where | Problem | Rule | Severity | Engine fix hint |
|---|---|---|---|---|---|
| m1 | Wed **Machine Row (bonus)** `– – – – · 2 2 2 2 · 2 2 2 3` against Mon **Single-Arm Lat Pulldown** `4 ×7, 5 ×5` and Thu **Lat Pulldown (Rope)** `4 ×7, 5 ×5`. Week 5 changes: "New bonus exercise: Machine Row" (back 18 → 20). Week 8: both pulldowns 4 → 5 (20 → 22). | **New (follows from G-217).**<br>- The optional-day row opens with exercise block 2 (week 5), while both A-day pulldowns still sit at 4 sets under their L3 top of 5. They get their 5th set only in week 8.<br>- This goes against the round's summary rule: "opens only when every template lift of its group is at its cap, never takes a set while one has room".<br>- A coach would step the two pulldowns first (weeks 5-6, back 18 → 20) and bring the row in at week 8. Both orders reach 25, and the steps are the same size.<br>- On his rule, the optional day is the extra, and the person who skips it should lose only the last sets, not the block-2 step. | VOL-07; CH5-03 "if needed"; G-218; R3-VOL-03 | minor | `volume.planStairs` (`gbOpen`): open a bonus in the **week** its group's template lifts all reach their tops, not at its exercise block's start. Let the template lifts with room take the block's earlier steps. Test: no bonus item with sets > 0 in a week where a template item of its group is below its top. |
| m2 | Wed **Supine (Lying) Biceps Curl (bonus)** `3 4 4 4 · 4 ×8`; Mon Spider Curl `3 ×7, 4 ×5`; Thu Concentration Curl `3 ×10, 4 4` | **New.**<br>- The optional-day bonus curl takes a 4th set in week 2 and is the week's biggest biceps exercise until week 8 (Monday) and week 11 (Thursday). Both main-day curls hold 3.<br>- This is legal by the engine's tops (a main-day isolation's 4th set opens only in the second half, `placement.x2.iso_fourth_from_share` in `volume.mjs` `isoFourthOpen`; an optional-day bonus may run to 4). But it is the "bonus out-sets the template" shape the round set out to remove.<br>- Its note says "your template's lifts ... are already at their top sets": true only under that early isolation cap.<br>- Skipping the optional day costs 4 biceps sets, more than either main-day curl gives. | VOL-07; G-218 spirit (the bonus is the extra); R4-SES-05 (slot 5 is the biceps exercise) | minor | Cap a group bonus's sets at the fewest sets of its group's template lifts that week (bonus ≤ min template sets), or read the optional-day bonus's top through the same `isoMainMax()` as the main-day isolations. |
| m3 | Mon **Seated (Chest-to-Thighs) DB Reverse Fly (bonus)**; Thu **Machine Reverse Fly (rear-delt pec deck) (bonus)**: note "Bonus exercise to reach your weekly sets"; listed under "bonus exercises" in easiest to remove | **New (copy).**<br>- Both items carry `why.template_extra_station`: his A-day rear-delt station (R4-SES-05), which G-217 calls template work.<br>- They still print "(bonus)" with the old note, while the real group bonuses (pec deck, pushdown, curl, row, pulldown) print the G-222 note.<br>- No up-front line names the shoulders, which is right for template work, so the label is the odd one out. | G-217 / G-222 (template extra stations are not bonuses); R4-SES-04; accurate copy | minor | `dose.mjs` / `render.mjs`: key the "(bonus)" label and the note on `isGroupBonus` (first why outside `bonus_last.template_whys`). Print template extra stations as accessories ("the A day's rear-delt exercise"). |
| m4 | Mon slot 3 Single-Arm Lat Pulldown, Thu slot 3 Lat Pulldown (Rope), 12 weeks | (Carried r5 m2.) No two-arm standard pulldown or pull-up on an A day for an advanced full-gym client. The only bar pulldown is the Saturday bonus, from week 9. | R4-SES-05 slot 3; OBSERVED BYOP U11 | minor | `select.mjs`: rank a two-arm standard-grip pulldown or pull-up first for A-day slot 3 at L2-L3. |
| m5 | B-day slot 3, all blocks | (Carried.) No overhead press in 12 weeks. | R4-LIB-03 ("that variability") | minor | One block of one B day picks a seated DB shoulder press, or list it as the first swap. |
| m6 | Tue: Incline Barbell Bench "close grip" (block 2), EZ-Bar Skullcrusher, **Cable Triceps Pushdown - straight bar, supinated (bonus)**; Fri: **Cable Triceps Pushdown - straight bar, pronated** (blocks 2-3); Sat Overhead Cable Triceps Extension (bonus) | (Carried r5 m4, widened.) In block 2 Tuesday holds a close-grip press and two triceps exercises. The week holds two straight-bar pushdowns that differ only by grip (Tuesday bonus, Friday template). | R2 one-detail rule; variety across the week | minor | Variation picker: no close-grip detail on press slots. A group bonus avoids an exercise of the same family the week already holds (pick an overhead or a kickback). |
| m7 | Tue / Fri slot 0 side raises; Wed only for glutes | (Carried.) Focus 2 (side delts) opens both B days. Focus 1 (glutes) never opens a session. | ORD-04 | minor | Focus 1 takes the first place on at least one of the two B days. |
| m8 | Mon core Copenhagen Plank; Tue Hanging Rotational Knees-to-Chest | (Carried.) Adductor pre-fatigue before the counted squat, and a grip-heavy hanging drill before the bench. | ATH-11; R2-SES-03 | minor | Core picker: a plank or dead bug on the counted-squat day; no hanging drill before heavy pressing. |
| m9 | Thu Bent-Over Barbell Row → Yates-grip row, the day before Fri Hex-Bar Deadlift | (Carried.) Erector fatigue the day before the counted hinge. | PER-04; EQ-11 | minor | Mark the bent-over row as a light spinal load, or pick a supported row before the counted-hinge day. |
| m10 | Week 12 MYO on Mon / Thu reverse flies (20-30 reps) | (Carried.) "about 15 reps" activation on a 20-30 rep exercise. | VOL-15 | minor | Scale the activation set to the item's range. |
| m11 | `summary.sets_by_group_by_week`: hips 27.25 and **shoulders 27.25** in week 12, against finals of 27 | (Carried; shoulders new.) A quarter-set credit overshoot. It is inside the "one above" ceiling reading, but the final should be the final. | R4-PRG-04 | minor | Count helper credit before the last added set and trim the step that tips the group over. |
| m12 | Wed optional day = glutes Focus × 2; Sat = side-delt Focus × 2 | (Carried.) His sheet puts Focus 1 **and** Focus 2 on each optional day. | OBSERVED BYOP AESTHETICS optional rows | minor | `placement.optional_focus`: one Focus 1 and one Focus 2 exercise per optional day. |
| m13 | Block 3 calves: Mon and Sat both "Machine Calf Raise - 1-second squeeze at the top"; Thu "from a step" | (Carried.) Three of four calf exercises use the same machine, and two are identical. | PER-02 | minor | No two items of a week share exercise + detail. Prefer a seated calf raise on one exposure. |
| m14 | Mon RFE lunge / Thu stationary lunge: "Hold dumbbells ... once your body weight is easy" | (Carried.) A beginner cue on an L3 plan. | GEN-01 | minor | Print it only at L1, or when the lift is prescribed unloaded. |
| m15 | Main days 25 / 23 / 23 / 21 sets in week 1, 31-33 in week 12 | (Carried, open G-119.) Above VOL-08's "about 7 × 2-3". | VOL-08; G-119 | minor (open question) | Ask with G-119. |
| m16 | Exercise id `alternating-db-deadlift-alternate-lead-leg-staggered-side-each-rep-meaning-infer` | (Carried.) Inference text in a public id. | Data hygiene | minor | Rename through `id_aliases`. |
| m17 | "Before you start": chest 23, biceps 18, triceps 20 of 25 | (Carried, open G-199.) Said plainly. | CH5-03; G-199 | minor (open question) | None until he answers. |

**Count: 0 blockers, 0 majors, 17 minors.** m15 and m17 are open coach questions.

---

## Steps after the bonus change (the round's question)

| Group | Weeks 1-12 | Judgement |
|---|---|---|
| Back | 16 17 17 18 · **20** 20 20 **22** · **24** 24 24 25 | Steps of +2 at weeks 5, 8 and 9 (11 %, 10 %, 9 %), each under 15 %, no note owed. Flat for 3 weeks between steps: fine for L3 (CX-02). The week-5 step should come from the pulldowns, not the row (m1). |
| Chest | 16 16 17 17 · 18 18 19 20 · **22** 22 22 23 | +2 in week 9 when the pec deck opens with all four presses at 5 (10 %). Exactly the rule. Held 23 of 25, said. |
| Biceps | 13 14 14 15 · 15 15 15 17 · 17 17 18 18 | Smooth. The bonus curl's early 4th set is m2. |
| Triceps | 15 15 16 16 · 17 17 18 18 · 18 18 19 20 | Smooth. |
| Quads / hips / shoulders | 16 → 25 / 22 → 27 / 19 → 27 | Smooth, one-set steps; quads arrive in week 12. |
| Total | 110 → 154 | The largest weekly rise is 4.7 %. |

## Checklist

| Check | Result |
|---|---|
| His A/B template, slot for slot | Yes. A: two-arm row → two-leg squat → vertical pull → lunge → biceps → leg extension + calf + rear-delt station. B: horizontal press → hip thrust / hex → incline press → single-leg hinge → triceps → leg curl (+ pushdown / pec deck). Focus side raise opens the B days. |
| 6-8 exercises | 8 / 8 / 8 on Mon / Tue / Thu. Friday holds 7 until week 8 and 8 once the pec deck opens. The header "about 7-8" is correct. |
| VOL-07 (first lift leads) | Yes on every main day and every group. Every slot-1 lift reaches 5. |
| Bonus last (G-222) | Yes. The pec deck prints after the leg curl on Friday, the pushdown last on Tuesday, and the optional-day bonuses last. |
| Weekly sets: floor, final, ceiling | Floor 10 held (calves 10 lowest). Finals reached in weeks 11-12. Chest, biceps and triceps capped and said. Highest 27.25, under 35. |
| Spine | One counted squat (Mon), one counted hinge (Fri), different days. |
| Progression as a rule | Yes, with the pyramid lifts in "the written reps". |
| Liability | Release at the top and the bottom. |

## What he would like

- The bonus exercises now feel like his "bonuses": they come late, sit last and are said.
- Every slot-1 lift climbs to 5, and B-day slot 2 alternates between the two exposures.
- The honesty block up front says exactly what the template holds and what the optional days carry.

## The one change that lifts it

Open each bonus in the week its template lifts are full (m1, m2), and give the A-day rear-delt stations their template label (m3). Then work through the long-carried exercise picks (m4-m7). That makes it an A-.
