# Coach-eye review, round 8: 01 Swimming (16-year-old, middle distance, 3 dryland days)

**Grade: B+** (same as r5, no regression). The r5 copy major is fixed. The arms now read "one exercise of their own ... held at its sets", the tables print "6 (2 direct)", and the glance row is correct.

The new bonus rule changed three things, all for the better for a swimmer:
- The Monday cable-row bonus is gone, and the back is held at 20 of 21 and said (G-219).
- The Friday chest fly no longer runs from week 1. It opens in week 9 at 2 sets (it was 2 → 3 from week 1).
- The week-12 test days carry no MYO set (G-214).

The cost of opening the chest bonus later is a held-then-jump chest. Chest sits at 11 for weeks 4-8 and then takes +2 (18 %) in week 9. The plan notes the jump (↑ and the up-front line), so it is legal. But the fly opens two weeks before the incline press reaches its own top, and the copy says the template's lifts are "already at their top sets". That is not true in weeks 9-10 (minor).

The rest are minors, most carried from r5.

Files reviewed: `samples/plans/01-swimming.en.md` and `samples/plans/01-swimming.json` (engine 0.6.0, model 1.3.0, `validation.ok: true`; warnings `acceleration` (week 9, chest, 18 %), `capped_by_template` (back 20/21), `slot_held_groups`), plus `samples/intakes/01-swimming.json`. There is no `.es.md`, so Spanish was not graded.

Authority used, in order: CH5, R4 and CT-01, then CX, R3 (R3-ATH-01 swimming dryland), R2, the full answers and the sheets. Also read: the `swimming_middle` profile and DECISIONS G-200..G-225.

Not judged: session length (CT-01). Open items are rated minor at most: STATUS Q5 / Q14 (push : pull), Q11, G-119, G-199 and G-219.

---

## Round-5 items: status

| R5 # | Problem then | Status now |
|---|---|---|
| **M1** | The plan said biceps / triceps had no exercise of their own and no extra sets, while slot 5 held one | **Fixed.**<br>- "Biceps, Triceps: one exercise of their own on the training days (the template's arm slot), held at its sets ... progress them with weight and reps."<br>- Tables: "6 (2 direct)", "5 (2 direct)", "held: 2 direct sets a week".<br>- "Switching off the accessories block takes away every direct set for Shoulders, Biceps, Triceps and Calves" is now true. |
| m1 | Hinge staircase: the hyperextension flat at 3; the hex bar reaches 4 only in week 11 | **Open** (m1). |
| m2 | Bonus cable row printed first on Monday | **Fixed.** The row is gone (G-219); the back is held at 20 of 21 and said. |
| m3 | Chest bonus fly from week 1 (2 → 3) for a swimmer | **Improved.** The fly opens in week 9 at 2 sets and stays at 2. The opening has its own issue (m2). Push : pull is still open (Q5). |
| m4 | 21 direct back sets on five exercises | **Improved** to 20 (m4). |
| m5 | 1-set stations | **Open** (m5). |
| m6 | Jump track goes to a lower box in block 3 | **Open** (m6). |
| m7 | "runs of 2-3 (for 7 jumps: 3 + 2 + 2)" on 5-contact sets | **Open** (m7). |
| m8 | MYO on the test days | **Fixed** (G-214). Week 12 has no intensifier, and the effort line says only "1 in the tank". |
| m9 | "3 rep max or work up to a 1 rep max" for a 16-year-old; DB-press test | **Open** (m8). |
| m10 | Block 3 reps stay at 8-10 | **Open** (m9). |
| m11 | Plyo share 22 % vs 25 %; Olympic sets 8 in week 11 vs 4.5-7.5 | **Open** (m10). |
| m12 | Block tables list the tested lift first | **Open** (m11). |
| m13 | Hyperextension for a low-back-extension hot spot | **Open** (m12). |
| m14 | Overhead DB triceps extension in block 3 for a swimmer's shoulder | **Open** (m13). |
| m15 | Saturday optional day = one weighted decline sit-up | **Open** (m14). |
| m16 | Glance "Chest 1, Shoulders 3" on Wednesday | **Fixed** (G-213): "Chest 2, Shoulders 2". |

---

## Blockers

None.

## Major

None.

## Minor

| # | Where | Problem | Rule | Severity | Engine fix hint |
|---|---|---|---|---|---|
| m1 | Wed 45-Degree Hyperextension `3 ×12`; Fri Hex Bar Deadlift `1+test 2 3 3 · 3 3 3 3 · 3 3 4 3+test`; Wed staggered deadlift 2 → 3 (wk 6), leg curl 2 → 3 (wk 8) | (Carried r5 m1.) By week 8 Wednesday is 3 / 3 / 3. The hips' steps go to the single-leg hinge and the leg curl, and the day's first hip lift never takes its 4th set. Quads got the fix (front squat 2 → 3 → 4); the hinge did not. | VOL-07; G-100 | minor | `volume.mjs` addSet: once a day's hip lifts are level, the day's first hip lift takes the next set (3 / 3 / 3 → 4 / 3 / 3), as on the quads. |
| m2 | Fri **Flat DB Fly (bonus)** `– ×8, 2 2 2 2`; Wed Incline DB Bench `3 ×10, 4 4`; Wed Flat DB Bench 4 from week 4; Fri Machine Bench 4. Chest `10 10 10 11 · 11 11 11 11 · 13 13 14 14`. Up front: "Chest: 2 of its 14 final sets sit on a bonus exercise ... (Flat DB Fly, Friday, from week 9), because your template's lifts for it are at their top sets." The fly note says "your template's lifts for this muscle group are already at their top sets". | **New (follows from G-217).**<br>- The fly opens with exercise block 3 (week 9) while the incline press still sits at 3 under its cap of 4. The incline takes its 4th set only in week 11. So in weeks 9-10 the printed reason is not true, and the opening goes against the round's own summary: "opens only when every template lift of its group is at its cap".<br>- To leave room for the fly, chest holds flat at 11 for weeks 4-8 (5 weeks), then jumps +2 (18 %) in week 9. The jump is noted correctly (↑, "Week 9 jumps more than usual"), so it is legal.<br>- A coach would rather see the incline take its 4th set first (for example week 7 → chest 12), with the fly last in week 11 (12 → 14, about 17 %, noted). Or keep chest at 13 without a fly for a swimmer.<br>- The fly never takes a set ahead of a press, so this is minor. | VOL-07; CH5-03 "if needed"; G-218 wording; H10 / R4-PRG-02 (note is present); accurate copy; `swimming_middle.resistance.avoid` "high-volume pressing" (open Q5) | minor | `volume.planStairs` (`gbOpen`): open a training-day bonus in the **week** its group's template lifts all reach their tops, not at the start of its exercise block. Let the template lift with room take the block's earlier steps (incline 3 → 4 before the fly opens). Key `note.bonus_final` / `ui.plan.bonus_line_main` to the week the template is actually at its top. When Q5 is answered, let the aquatic push : pull ratio lower chest's planned final before a chest bonus opens. |
| m3 | Wed **Seated DB Lateral Raise (bonus)** 3 sets × 12 weeks. Up front: "Shoulders: 3 of its 12 final sets sit on a bonus exercise ... because your template's lifts for it are at their top sets. Skip it and the shoulders total ends at about 9." Listed under "bonus exercises" in easiest to remove. Shoulders `11 ×10, 12 12` (10.5 → 12.5). | **New (copy / labelling).**<br>- The lateral raise is there from week 1 because the floor of 10 needs it (H17; the G-217 floor exception). It is not there because the template is full: Wednesday's reverse fly holds 3 with a 4th set open from the second half, and steps only in week 11.<br>- It is also the side-delt place of his athletic sheet ('ABdution').<br>- Calling it a bonus and listing it first to remove invites the swimmer to go to 9, under the floor the plan promises.<br>- Shoulders then sit flat at about 11 for ten weeks and step once. | H17 (floor named honestly); R4-SES-04 (easiest to remove, truthfully); R3-VOL-01 (front / side / rear spread); R3-VOL-04 | minor | When a bonus opens for the floor (`gb` floor case), use a floor note ("holds your shoulders at the 10-set floor") and leave it out of `easy_to_remove`. Let the reverse fly take its 4th set when the 4th opens (around week 7) so shoulders step twice. |
| m4 | Back, weeks 9-12: Seal Row 5, Pull-up 5 (both Monday), SA DB Row 5, SA Pulldown 5 = 20 | (Carried r5 m4, improved from 21.) Two 5-set back lifts on one day, for a 16-year-old with 6 pool sessions a week. The plan says "Back: this template holds 20 ... Add an exercise if you want more". For a swimmer, the invitation to add is the wrong way round. | `swimming_middle.resistance.avoid` ("sessions that leave the swimmer sore"); open G-219 | minor | An aquatic cap modifier in `rules.volume.modifiers`. For high-practice aquatic profiles, print the capped line without the "add an exercise" clause. |
| m5 | Mon ankle hops wk 5 and 9-12 (1 set); Fri single-leg ankle hops wk 12 (1); Wed medball wk 12 (1); Fri hex bar wk 1 (1 back-off set after the test) | (Carried.) 1-set stations are not worth the station. | R3-ATH-01; G-116 spirit | minor | `athletic.mjs`: an athletic station takes at least 2 sets, or merges into the day's other jump station. A test-week back-off holds at least 2 sets. |
| m6 | Fri jump track Medium Depth Drop → Mid Box Jump → Low Box Jump (6-12 in) | (Carried.) The hardest block (RC3 Repeat) gets the lowest box and a "one big effort" cue. | R2-ATH-03 | minor | The jump selector never picks a lower-intensity record of the same family for a new stage. For RC3, prefer repeat / rebound versions. |
| m7 | Weeks 9-12 Repeat cue | (Carried.) "runs of 2-3 big jumps (for 7 jumps: 3 + 2 + 2)" on 5-contact sets. | Copy | minor | Build the example from the item's own contacts. |
| m8 | Week 1 and 12 tests: Front Squat, Flat DB Bench, Hex Bar | (Carried.) "3 rep max or work up to a 1 rep max" for a 16-year-old, on a dumbbell press. | R2-PER-07; youth overlay | minor | `rules.tests`: a minor tests a 3RM only. Prefer a machine or barbell press as the test lift. |
| m9 | Block 3 | (Carried.) Machine bench, seal row, single-arm rows, pulldown, KB front-rack squat and split squats stay at 8-10, against the profile's "STRENGTH 4-6 + POWER". | PER-11; `swimming_middle.resistance.rep_zone` | minor | `dose.mjs`: the VOL-3 zone for every two-arm compound. |
| m10 | Athletic block, weeks 6-12 | (Carried.) Plyo share ends at 22 % against 25 %. Olympic sets reach 8 in week 11 against 4.5-7.5. | R3-ATH-01; profile `triple_ext.sets_wk` | minor | `athletic.mjs`: reach `plyo_share.end` in the last exercise block; cap Olympic sets at the profile's top. |
| m11 | Block tables, Mon / Fri | (Carried.) Built from week 1, so the tested lift is listed first (Front Squat above Seal Row, Hex above Machine Bench). Non-test weeks use his order. | R4-SES-05 | minor | `render.mjs`: build the block table from the first non-test week. |
| m12 | Wed slot 2 | (Carried.) The 45-degree hyperextension is the only two-leg hinge on Wednesday, for a `LOW_BACK_EXTENSION` hot spot. | R4-SES-05; profile injuries | minor | `select.mjs`: a light penalty on spinal-extension records for that hot spot when an in-slot alternative exists. |
| m13 | Wed slot 5, block 3: Tate Press → Overhead DB Triceps Extension at 1 RIR | (Carried.) Loaded end-range shoulder flexion for `SHOULDER_SWIMMER` / "avoid high-volume overhead". | profile injuries / avoid; R4-LIB-03 spirit | minor | Apply the swimmer shoulder penalty to overhead triceps records. |
| m14 | Saturday optional day: one Weighted Decline Sit-Up (10-15 min) | (Carried.) A near-empty day, and loaded flexion for a low-back hot spot. The swimmer add-ons (ER, streamline hold, dead hang) would fit there. | `prog_byop_athletic` optional day (OBSERVED); R4-LIB-01 | minor | Render a core-only optional day as "core + the add-ons above". Use an unloaded anti-extension drill for `LOW_BACK_EXTENSION`. |
| m15 | Fri Double-KB Front-Rack Squat 2 × 12 weeks; Fri FFE & RFE Split Squat 2 × 12 weeks; Mon Front Squat 4, lunge 4, leg extension 4 by week 11 | **New, small.** Every quad step lands on Monday: 12 quad sets in one session by week 11. Friday's two quad lifts never move. For a swimmer, spreading the load across the week is kinder on the legs before pool sessions. | R3-VOL-03 spirit (spread over the exposures); VOL-07 | minor | Let `kExp` read a group's lifts across all training days, not only the two exposures of one day type, so Friday's KB squat takes a quad step before Monday's third lift reaches 4. |

**Count: 0 blockers, 0 majors, 15 minors.** m2 and m4 touch open questions (Q5, G-219).

Not counted:
- Arms at 6-7 / 5 are held on purpose (G-130 / G-198), and the words now say so.
- Calves at 9 → 11 follow his "one exercise × 3 sets per leg day" rule, then step.

---

## Steps after the bonus change (the round's question)

- **Chest:** 11 for weeks 4-8, then +2 (18 %) in week 9, then +1 in week 11. Noted (↑ in the table, a line up front, a week-9 banner). Legal, but avoidable by stepping the incline first (m2).
- **Back:** a smooth stairway, 15 → 20, with no step over 7 % and no flat stretch longer than 3 weeks. Held 20 of 21, said.
- **Shoulders:** about 11 for 10 weeks, then 12 in week 11 (+11 %). Flat but not wrong (m3).
- **Totals:** 64 → 85. The largest weekly rise is 7.6 %, in week 11. No other group step is over 15 %.

## What he would like

- **His template, slot for slot**, on all three days, with the athletic block first, core first, horizontal before vertical, knee lifts with pulls and hip lifts with pushes.
- **Dryland done his way (R3-ATH-01).** No extra cardio, and shoulder care in every session with no bands. A clean on the squat day and a snatch on the hinge day. 36-44 throws. The 4-hour gap and the 2-week taper are printed. CH5-01: practices are not counted, and the athlete adjusts.
- **Honest numbers.** The arms are described correctly. The back's cap is said. Both bonuses are said with the week they come in. The 18 % week is flagged.
- **Test weeks are clean:** no MYO on a test day.

## The one change that lifts it

Open the chest fly in the week the incline is full (or drop it for a swimmer), and give the lateral raise a floor note instead of a bonus label (m2, m3). Then work through the carried athletic minors (m5-m8). With those done, this is an A-.
