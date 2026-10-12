# Coach-eye review, round 6: 08 Pickleball, gen-pop, 52, knee pain (engine 0.6.0)

**Grade: B+** (Lalo would hand it over after small tweaks. The one major below is a cheap fix: one printed line and one set.)

Reviewed: `samples/plans/08-pickleball-genpop.en.md`, `.es.md` and `.json` (engine 0.6.0, model 1.3.0, validation ok, warnings `two_day_rule` and `pain_plan`). Intake: `samples/intakes/08-pickleball-genpop.json`. The client is 52, L1 with 0.5 years of lifting, trains Mon/Thu in a basic gym and plays pickleball Wed/Sat/Sun. He has mild right-knee pain that is worse with deep knee bends.

Authority used: CH5 + round 4 + CT-01 > CX > round 3 > round 2 > full answers > chat > sheets.

Not judged:
- Session length (CT-01).
- Open coach questions are raised as minors at most: STATUS_v0.5 #5, #6 and #14, the incline-press credit question, and the open items in G-198 / G-199 / G-205. One of those is the B-day calf raise that gives its place to the arm slot.

**In short.** Round 5's M1 is fixed (G-200):
- The hammer curl and the triceps extension run 2 → 3 sets × 15-20, which is his A/B sheet's slot-5 dose.
- The arms end at 5 of 5. There is no Friday arm day, and no group prints above its final sets.
- The big groups (quads, hips, back, chest) now lead the week at 6-8.

The template is his A/B day slot for slot. The knee handling and the athletic layer are what he would write for a 52-year-old court player.

One problem comes from the same fix. Shoulders now count as a "small" line on 2 days, so:
- the training days hold only 4.25-6 shoulder sets;
- the 6-8 band depends on the Friday "optional" reverse fly;
- the plan never says so. The G-204 line that does this for big groups is skipped, because the shoulders are not a "big" line.

---

## Round-5 items: status

| R5 # | Issue | Status in r6 |
|---|---|---|
| **M1** | Arms out-trained the big groups: 4 × 15-20 curls and triceps work, a Friday arm day, arms 9 against a final of 8 | **Fixed.**<br>- Monday: Dumbbell Hammer Curl 2 2 2 2 · 2 2 2 2 · 3 3 3 3.<br>- Thursday: Overhead DB Triceps Extension → Floor DB Skullcrusher 2 … 2 3 3 3.<br>- The Friday arm bonuses are gone.<br>- Biceps 3.5 → 5 and triceps 3.5 → 5, against a final of 5; the table prints 4 → 5.<br>- Big groups: quads 6, hips 7 → 8, back 6 → 8, chest 6 → 8.<br>- The arm lift is no longer the day's highest-set lift: the seal row has 4 sets and the bench 4.<br>- This is R4-SES-03, R4-SES-05 slot 5 and his "Bicep 2 × 20". |
| m1 | Hack squat moves to 8-12 reps in blocks 2-3 | **Open** (carried as m4). |
| m2 | Calves 4 + 2, Thursday's set not counted | **Open.** This is G-198 and still open for the coach (m8). |
| m3 | Shoulders 7 of 8 | **Closed** on paper: 8 of 8. It now depends on the optional day (see M1 below). |
| m4 | Stairway bunched in weeks 11-12 | **Fixed** for the most part. Totals run 36 36 37 37 · 38 38 39 39 · 40 41 44 44, a step in weeks 3, 5, 7, 9, 10 and 11. The "small steps to week 6, a bit bigger from week 7" line now fits. |
| m5 | Single-leg hinge rotates down the stability ladder | **Open** (m5). |
| m6 | "Receive-Create 3: Repeat" over a single-contact step-up jump | **Open** (m6). |
| m7 | MYO on the joint-care face pull; the "day's last" wording | **Open** (m7). |
| m8 | Olympic paragraph and "Olympic-lift sets" with no Olympic lift | **Open** (m9). |
| m9 | "Instead of Mid-Hang Clean Pull, to protect your knee" | **Open** (m10). |
| m10 | Incomplete accessories switch-off line | **Open**, at lower weight (m11). G-202 kept it on purpose. |
| m11 | Hyperextension swap reasons; no bridge, hip thrust or split-squat swap | **Open** (m12). |
| m12 | "Step-Up (forward and lateral)" as one item | **Open** (m13). |
| m13 / m14 | 9-10 exercises a session; back = chest | Open coach questions (STATUS #6, #5 / #14). Listed for the record only. |
| m15 | Spanish slips | **Partly fixed.** The accessories line has lower-case group names now. "mantiene cuádriceps", "(Back Extension)" and the two calf terms remain (m16). |

---

## Problems by severity

### Blockers

None.

### Major

| # | Where | Problem | Rule | Severity | Engine fix hint |
|---|---|---|---|---|---|
| M1 | "Before you start" (no shoulder line). Thursday **KB Face Pull 2 2 2 2 · 2 2 3 3 · 3 3 3 3** (was 4 sets from week 1 in r5). Friday **Bent-Over DB Reverse Fly (bonus) 2 × 15-20**. Weekly table: Shoulders 6 → 8. | **The shoulders reach the 6-8 band only through the optional day, and the plan does not say so.**<br><br>JSON `sets_by_group_by_week.shoulders` is 6.25 → 8. Two of those sets every week are the Friday fly, so on Monday + Thursday the shoulders hold 4.25-4.75 in weeks 1-6 and about 5.75-6 in weeks 7-12. This is the round-4 M2 again. G-106 had fixed it ("the training days hold the band's low end (6) for every trained group"). G-200 then narrowed the floor to `big_classes`, and `rules.muscles.lines.defs.shoulders.class` is `small`.<br><br>For the same reason, `render.optionalBonusLines` (G-204) skips the shoulders: `big(g)` is false. So the "Skip those days and shoulders end at about 6" line never prints.<br><br>Meanwhile:<br>- "Before you start" tells him every big group gets 6-8.<br>- The Friday aerobic note says "part of the plan even if you skip the optional lifting".<br><br>A 52-year-old court player who skips the optional lifting gets about 4-5 shoulder sets a week, and the face pull (his only cuff-and-rear-delt lift on a training day) runs at 2 sets for six weeks. For a racket shoulder, Lalo would keep this work on the training days. | R4-SES-03 (6-8 band; the plan says so); R3-VOL-01 (the shoulders are a counted group with its floor); H17 ("a group the template cannot take to the floor is named in the plan, never hidden"); G-106 (training days hold the band first); G-204 (an optional-day share is said); R3-ATH-02 (rotator-cuff work for racket players 50+) | Major (a rule regression and hidden copy, cheap to fix) | `volume.mjs` `floorMain`, 2-day branch: read the band on the groups R4-SES-03 / H17 count as groups with a floor (quads, hips, back, chest **and shoulders**), not on the line class. Only the arm slot (biceps / triceps, `ARM2`) and calves stay outside. In 08 that puts the face pull back at 3-4 sets from week 1; there is room, since no exercise is added. Also `render.optionalBonusLines`: test "group with a floor" (or `rec.bonus` on any group the 2-day band covers) instead of `class === 'big'`, so the line prints whenever a band group's sets sit on an optional day. Test: `R4-SES-03 2-day shoulders on the training days (08)`. |

### Minor

| # | Where | Problem | Rule | Engine fix hint |
|---|---|---|---|---|
| m1 | Friday **Bent-Over DB Reverse Fly**, the day after Thursday's **KB Face Pull**. JSON `side_delts` 0.5-0.75 a week. | The shoulder bonus is a second rear-delt exercise, back to back with Thursday's rear-delt lift. The side delts get almost nothing all plan. For a racket player, a lateral raise (or, if M1 moves the shoulders onto Thursday, nothing) is the better bonus. It is not wrong: rear-delt work is allowed and suits posture. | R3-VOL-01 (front / side / rear as one group: spread the work); R4-LIB-03 | `volume.openBonus`: for the shoulders group, prefer the delt line the week trains least (side) for the bonus pick. |
| m2 | "Week 1 at a glance": Thursday lists no calves; the weekly table counts only Monday's calf sets | The Thursday joint-care calf raise (2 × 12-15) exists but counts for nothing in the table and the glance row. It reads as if calves were trained once a week. Part of G-198 (open). | R3-ATH-02 (calf / Achilles work every leg day); R3-SES-01 | `render.mjs` glance row: list prehab items with their group, marked "(joint care)". |
| m3 | Weekly table: Biceps / Triceps "4 4 4 4" in block 1 against `meta.stairway.group_start` 3 | Rounding 3.5 up prints 4 while the stairway's start is 3. It is harmless, but a coach reading "start 3" in the JSON and "4" on the plan will ask why. | Accurate copy (G-203 rounding) | Print a held arm row as "4 (2 direct)" like G-202's held groups, or round with the stairway's start. |
| m4 | Monday, weeks 5-12: **Hack Squat** 12-15 → 8-12 reps, at 1 in the tank in week 12 (carried, r5 m1) | Heavier, lower-rep loading moves onto the deep-knee-bend lift of the painful knee. The quads are held at 6 sets, which is good, but the load should progress inside a higher rep zone. The step-up has the same issue (10-12 → 8-12). | VOL-03; EQ-03 | `dose.mjs`: keep a pain-flagged pattern (`hotspot` + `pain_plan` groups) in its higher rep zone across blocks. |
| m5 | Thursday, block 1 → 2: **Rear-Foot-on-Wall DB RDL → Staggered-Stance (Kickstand) DB Deadlift** (carried, r5 m5) | The block change steps down the stability ladder with no pain reason. | R2-LIB-01; PER-02 | `select.mjs` block rotation: order the variants kickstand → rear-foot-on-wall, and never rotate down a rung without a pain reason. |
| m6 | Week 5 "Jumps move to Receive-Create 2: Land & Go"; week 9 "Receive-Create 3: Repeat"; Monday **Lateral Box Step-up Jump 2 × 2 contacts per leg** (carried, r5 m6) | The stage label says "Repeat", but the drill is the same single-contact step-up jump. The Receive-Create jargon is back in the week headers (EN and ES "Recibir-Crear"). | R2-ATH-03; accurate copy | `athletic.mjs`: in stage 3 pick a low-amplitude lateral repeat (line hops, small skater hops), or print the drill's real stage in plain words ("landings → land and go → quick repeats"). |
| m7 | Week 12: MYO on **KB Face Pull** (Thursday) and **Hammer Curl** (Monday); line "a MYO set on the day's last small-muscle or machine exercise" (carried, r5 m7) | A MYO cluster on the face pull contradicts its own "joint care: lower slowly and stay in a pain-free range" cue. On Monday, the day's last exercise is the calf raise, not the curl. | G-69; H02; accurate copy | `dose.intensifierEligibleRc`: exclude items flagged `prehab` / joint care. Words: "the day's last eligible small-muscle exercise". |
| m8 | Calves: Monday **Machine Calf Raise 4**, Thursday joint-care **Standing DB Calf Raise 2**; final 4 | His rule is one exercise × 3 sets per leg day. Now that slot 5 holds 2-3 sets, a counted 3 + 3 would fit. This is the open G-198 question (calves vs the full arm slot), so it is for the record only. | R3-SES-01; R3-ATH-02; G-198 (open) | None until the coach answers. |
| m9 | "Olympic lifts are for power. Cleans, snatches…" paragraph; "Power / Olympic lifts" block; "4 Olympic-lift sets" in every week header (carried, r5 m8) | The plan holds only KB swings. For a gen-pop 52-year-old, the cleans-and-snatches text is noise and invites the lift round 4 removed. | Accurate copy; EQ-03 | `render.mjs`: print the Olympic paragraph only when an Olympic-family item is in the plan. Otherwise name the block and count "power (KB swings)". |
| m10 | Monday KB swing note "Instead of Mid-Hang Clean Pull, to protect your knee." (carried, r5 m9) | The swap is right, but the reason is partial. Age, L1 and 3 play days are the real filter (EQ-03), and a clean pull is not a deep-knee-bend lift. | Honest output (G-94 / G-133) | Note key from the actual `olympic_safe` filter reason (age / level / pain). |
| m11 | "Switching off the accessories block takes away every direct set for Biceps, Triceps and Calves." (carried, r5 m10) | It is true for counted sets (G-202 kept it). But the block also holds the leg extension (quads), the leg curl (hips), the face pull (most of the shoulders' training-day sets) and the Friday fly. | Accurate copy | Add "and part of: quads, hips, shoulders" from the groups whose sets drop when the block is off. |
| m12 | Thursday **45-Degree Hyperextension** swaps (carried, r5 m11) | Swap reasons read "loses the feel of the original implement" for back extension → DB / KB deadlift. There is still no glute bridge or hip thrust swap. The step-up has one swap only. | R4-LIB-04 | Swap-reason table: "loses the supported hip extension". Add bridge / hip thrust and a box split squat where the pain filter allows. |
| m13 | Monday **Step-Up (forward and lateral)** (carried, r5 m12) | One item, two directions, no split. | Clarity | Add the note "alternate forward and lateral sets", or two variants rotated by block. |
| m14 | Header "about 9-10 exercises a session" | Above gen-pop 5-7. This is STATUS open question #6. For the record. | R4-SES-02; STATUS Q6 | None until the coach answers. |
| m15 | Back 6 → 8 = chest 6 → 8; incline press credited to chest, not shoulders | Pull = push for a racket player (STATUS Q5 / Q14). The incline press credit is an open question. For the record. | Profile `push_pull`; STATUS Q5 / Q14 / incline credit | None until the coach answers. |
| m16 | Spanish (`.es.md`) | Good neutral Latin American Spanish, with the gym term in brackets. The lower-case group names in the accessories line are fixed. Remaining slips:<br>- "mantiene cuádriceps en las mismas series" needs "los cuádriceps" (carried).<br>- "Hiperextensión a 45° (Back Extension)": the bracket term does not match the copy name "45-Degree Hyperextension" (carried).<br>- "Elevación de talones sentado" sits next to "Elevación de pantorrillas" for the same muscle (carried).<br>- New: "Aperturas posteriores inclinado con mancuernas" does not agree; use "con el torso inclinado".<br>- New: "Cuidado articular de hombros por encima de la cabeza / raqueta" reads oddly; better "de hombros que trabajan por encima de la cabeza o con raqueta".<br>- New: "Recibir-Crear 3: Repetir" is jargon (see m6). | R2-GEN-08; H14 | `model/i18n/es.json` / `tools/compile/es/exercises.mjs`: add the article in the pain template, align the bracket term, use one calf term, fix the two exercise / care labels. |

**Count: 0 blockers, 1 major, 16 minors** (m8, m14 and m15 are open coach questions, listed for the record).

---

## Fresh checks requested

- **His A/B slots, including the arm slot (CH5-02).** The template holds.
  - A day: seal row (horizontal, two-arm), hack squat (two-leg knee), single-arm pulldown (vertical), step-up (single-leg knee), hammer curl (slot 5), leg extension (slot 6), plus a calf raise.
  - B day: flat DB bench, 45° hyperextension (two-leg hip), incline DB press (R4-LIB-03 incline bias), single-leg DB hinge, triceps extension (slot 5), leg curl (slot 6), plus the face pull and the joint-care calf raise.
  - Core comes first. Then jumps / throws, power and strength (H03, H05), horizontal before vertical (H04), and his cross pairs (row + squat, pulldown + step-up, curl + leg extension, bench + hip extension, incline + hinge, triceps + leg curl; H06).
  - Slot 5 is now dosed like his sheet: 2-3 × 15-20.
- **2-day rule (R4-SES-03).** Printed at the top with the third-day suggestion. Quads, hips, back and chest sit at 6-8 on the training days. Quads are held at 6 for the knee, and the plan says so. The shoulders are the exception (M1).
- **Knee pain.**
  - Hack squat at 2 sets with machine range stops and a pain-free-range cue. Step-up on a 6-12 in step, "lower yourself slowly". Leg extension as joint care with range stops.
  - Box landings on a low box (6-12 in). No deep-knee-bend Olympic lift. Quads held, said once up front.
  - Only the rep-zone drift in blocks 2-3 (m4) is left. A coach would sign this.
- **Athletic work for a 52-year-old (R3-ATH-02, R3-ATH-05).**
  - Jumps are halved for 3 play days, with no agility drills. Stick-the-landing → low lateral step-up jump. Ankle hops progress in place → lateral → zig-zag (27 → 57 low-amplitude contacts).
  - Rotational and step-forward throws with an 8 lb ball. Russian and split-stance single-arm KB swings, no Olympic lifts.
  - Each gym day sits 48 h before a play day. Play counts as aerobic, with one Orange bike session of 30 → 40 min on Friday, inside his "max 40 min of steady".
  - Appropriate.
- **Spanish.** Good quality. Small slips are listed in m16.

## What Lalo would like (praise)

- The arm fix is done his way: slot 5 at 2-3 × 15-20, no arm day, and the sets go to the legs, back and chest.
- The progression is a rule the person applies ("when you hit 12 on every set … add weight and start again at 10", R4-PRG-03). Same-set weeks say "add load or reps" (CX-02). Next block +5 % (R4-PRG-04). "Template you can edit" (CX-04).
- The stairway is now spread across the 12 weeks. No group prints above its final sets (G-203).
- Block changes are one-detail variations: grip on the seal row, squeeze on the pulldown and face pull, single-leg leg extension, calf raise from a step, pause on the incline.
- The add-ons fit the person: soleus, tibialis, wrist extension for the paddle elbow, balance reach, wall sit, side-lying ER.
- Liability: the release line sits at the top and bottom in both languages, and was accepted before the build. Each exercise carries a YouTube search link and the name to copy (R4-SCP-01/02, R4-LIB-05).
