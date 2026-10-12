# Coach-eye review, round 7: 08 Pickleball, gen-pop, 52, knee pain (engine 0.6.0)

**Grade: B+** (Lalo would hand it over after small tweaks. The round-6 major is fixed, but the fix went one step too far. The shoulders are now the most-trained group in the plan, and they get there with a second rear-delt exercise the plan does not need. The fix is cheap: drop or swap one optional-day exercise and change one set count.)

Reviewed: `samples/plans/08-pickleball-genpop.en.md`, `.es.md` and `.json` (engine 0.6.0, model 1.3.0, validation ok, warnings `two_day_rule` and `pain_plan`). Intake: `samples/intakes/08-pickleball-genpop.json`. The client is 52, L1 with 0.5 years of lifting, trains Mon/Thu in a basic gym and plays pickleball Wed/Sat/Sun. He has mild right-knee pain that is worse with deep knee bends.

Authority used: CH5 + round 4 + CT-01 > CX > round 3 > round 2 > full answers > chat > sheets (`dumps/BYOP/`, `analysis/programs/`). Engine decisions read: G-200 … G-216.

Not judged:
- Session length (CT-01).
- Open coach questions are raised as minors at most: STATUS_v0.5 #5, #6 and #14, the incline-press credit question (STATUS #1), and the open items in G-198 / G-199 / G-205. One of those is the B-day calf raise that gives its place to the arm slot.

---

## Round-6 items: status

| R6 # | Issue | Status in r7 |
|---|---|---|
| **M1** | Shoulders reached 6-8 only through the Friday fly, and the plan did not say so | **Fixed** (G-207, G-208).<br>- Thursday KB Face Pull runs 4 sets from week 1 (was 2 2 2 2 · 2 2 3 3 · 3 3 3 3).<br>- Monday + Thursday hold 6.25 → 7 shoulder sets.<br>- "Before you start" says: "Shoulders: 2 of its 9 final sets sit on your optional day (Bent-Over DB Reverse Fly, Friday). Skip that day and shoulders ends at about 7." (EN and ES)<br>- **New side effect:** the Friday fly is now extra on top of the band. Shoulders land at 8 → 9, the plan's top group, above the 6-8 it prints. See the new M1. |
| m1 | The shoulder bonus is a second rear-delt exercise the day after the face pull; side delts get about nothing | **Open, and heavier.** There are now 6 rear-delt sets in 2 days (4 + 2). Folded into M1. |
| m2 | Thursday's joint-care calf raise is missing from the glance row and the table | **Open** (m5). |
| m3 | Arms print "4" against a stairway start of 3 | **Open** (m6). JSON `target_by_group_by_week.biceps` is 3 in weeks 1-7, and the table prints 4. |
| m4 | Hack squat and step-up drift to 8-12 reps | **Open** (m7). |
| m5 | Single-leg hinge steps down the stability ladder | **Open** (m8). |
| m6 | "Receive-Create 3: Repeat" over a single-contact step-up jump | **Open** (m9). |
| m7 | MYO on the joint-care face pull; "day's last" wording | **Open** (m10). With the face pull at 4 sets, the week-12 MYO now goes on a 4-set rear-delt lift at 1 in the tank. |
| m8 | Calves 4 + 2 (G-198) | Open coach question (m11). |
| m9 | Olympic paragraph with no Olympic lift | **Open** (m12). |
| m10 | "Instead of Mid-Hang Clean Pull, to protect your knee" | **Open** (m13). |
| m11 | Accessories switch-off line incomplete | **Partly fixed.** It now names Shoulders. It still leaves out the quads (leg extension, 2 of 6) and the hips (leg curl, 2 of 7). (m14) |
| m12 | Hyperextension swap reasons; no bridge, hip-thrust or split-squat swap | **Open** (m15). |
| m13 | "Step-Up (forward and lateral)" as one item | **Open** (m16). |
| m14 / m15 | 9-10 exercises a session; back = chest | Open coach questions (m17, m18). |
| m16 | Spanish slips | **Open.** All six remain, and one new slip (m19). |

---

## Problems by severity

### Blockers

None.

### Major

| # | Where | Problem | Rule | Severity | Engine fix hint |
|---|---|---|---|---|---|
| M1 | Weekly table: **Shoulders 8 8 8 8 · 8 8 8 8 · 8 8 9 9, final 9**. Back 6 → 8, chest 6 → 8, hips 7 → 8, quads 6. JSON `sets_by_group_by_week.shoulders` 8.25 → 9; `meta.stairway[0].cap.shoulders` 8. Thursday **KB Face Pull 4 × 15-20** from week 1. Friday **Bent-Over DB Reverse Fly (bonus) 2 × 15-20**, labelled "Bonus exercise to reach your weekly sets". "Before you start": "every big muscle group is trained with about 6-8 weekly sets". | **The shoulders now out-train every big group, through an extra rear-delt exercise the plan does not need.**<br><br>G-207 got the training days to hold the band (6.25 → 7 on Mon + Thu), which was the round-6 ask. It then kept the Friday fly as "extra" on top. So:<br>- Shoulders are the most-trained group in **every** week (8-9). That is above back (6-8), chest (6-8), hips (7-8) and quads (6), in a plan whose first line promises 6-8.<br>- The final 9 is above the 2-day band and above the shoulders' own cap of 8 in `meta.stairway.cap` (G-207 allows the extra set under "credited sets at most one above").<br>- 6 of the 9 sets are rear-delt work on back-to-back days: Thursday face pull 4, Friday reverse fly 2. Side delts get about 1 set a week from helper credit.<br>- The fly prints "Bonus exercise to reach your weekly sets", but the training days already reach the band. The plan's own up-front line says that without it "shoulders ends at about 7", which is inside 6-8.<br><br>This is the round-5 arms problem (a small line out-training the big groups) moved over to the shoulders. Lalo's 2-day rule is "every big muscle trained at about 6-8", and the extra goes to legs, back and chest. He would not give a beginner 9 shoulder sets against 6 for quads and 8 for back on 2 days a week, and certainly not as two rear-delt lifts in 24 hours. | R4-SES-03 (2 days: about 6-8, say so; never pile on); R3-VOL-01 (rear delts are part of the shoulders, with no floor of their own; spread front / side / rear); CH5-03 (a bonus is for a group that **needs** it to reach its planned final sets); R4-PRG-04 (never above the top); H10 / H17 | Major (cheap: one exercise) | `volume.mjs` `floorMain` / `twoDayAlso` and the bonus loop (G-207): on a 2-day plan, when the training days already hold a `two_day_main_floor.also_groups` group inside the band (≥ 6), **open no optional-day bonus for it** (`noBonusFor`), and set its final sets to what the training days hold (7). G-207's "the bonus is EXTRA" reading is PROPOSED; CH5-03 opens a bonus only "if needed". If a bonus is kept for any reason, pick the delt line the week trains least (side raise; carried r6 m1, `volume.openBonus`), never a second rear-delt exercise the day after the face pull, and key its note to "extra" (not "to reach your weekly sets"). Test: `R4-SES-03 08 shoulders inside the 2-day band, no optional-day rear-delt bonus`. |

### Minor

| # | Where | Problem | Rule | Engine fix hint |
|---|---|---|---|---|
| m1 | Thursday **KB Face Pull 4 4 4 4 · 4 4 4 4 · 4 4 4 4**, next to **Flat DB Bench Press 3 3 3 3 · 3 4 …**, **45-Degree Hyperextension 2 … 2 3 3**, **single-leg DB hinge 2 × 12 weeks**. "Easiest to remove" lists KB Face Pull first. | On the B day, the joint-care accessory holds more sets than the day's first lift in weeks 1-5. It also holds twice the sets of both hip lifts for 10-12 weeks. It has no set step in 12 weeks (L1 max 4, G-215), so its only progression is load. It now carries the shoulders' training-day band, yet the day lists it first as "easiest to remove". His sheets give face pulls the same sets as the day's other lifts (BYOP PPL rows 49 / 65: 3 → 5 with the rest). Defensible for a racket shoulder (R3-ATH-02), but it reads backwards on paper. | VOL-07 (sets go to the first exercises first); R4-SES-05 (the extras sit at the end); R4-SES-04 | Start the face pull at 3 and step it to 4 at the block 2 change (shoulders on the training days 5.25-6.25 → 7, "about 6", said). Or let `easy_to_remove` skip an item that holds a band group's training-day floor. |
| m2 | Totals **38 38 39 39 · 39 40 40 41 · 41 42 45 45**. Week 11 adds three big-group steps at once (hyperextension 2 → 3, pulldown 3 → 4, incline 3 → 4). Hips sit at 7 for weeks 1-10; back at 7 for weeks 3-10; chest at 7 for weeks 6-10. Weeks 7 and 9 add nothing. | The r5 m4 bunching is back. The plan says "small steps up to week 6, a bit bigger from week 7", but between weeks 6 and 10 only the arm slot steps (weeks 8, 10). All three big groups wait for week 11. This is legal (R4-PRG-01, under the 15 % note), but a coach reads it as a flat plan with a jump at the end. | R3-VOL-04 (the stairway feel); R4-PRG-01; accurate copy | `volume.planStairs`: spread the big groups' last steps (for example back in week 8, chest week 10, hips week 11) before giving an arm-slot step its week. |
| m3 | Up-front line "Skip that day and shoulders ends at about 7"; Friday note "Bonus exercise to reach your weekly sets" | "shoulders ends" is ungrammatical (EN, G-208 template for a plural group name). The fly's note contradicts the up-front line (see M1). | Accurate copy; H14 | `ui.plan.optional_bonus_one_day`: "… and your shoulders end at about 7". Use a separate note key for an extra bonus (if M1 keeps one). |
| m4 | Friday **Bent-Over DB Reverse Fly** at 1 in the tank in week 12, the day after the MYO face pull | Two hard rear-delt days back to back in the hardest week. This goes away with M1. | R3-VOL-01; G-104 spirit (no repeat of the day before) | See M1. |
| m5 | "Week 1 at a glance": Thursday lists no calves; the table counts only Monday's calf sets (carried r6 m2) | The joint-care calf raise (2 × 12-15) counts for nothing. It reads as if calves were trained once a week. Part of G-198 (open). | R3-ATH-02; R3-SES-01 | `render.mjs` glance row: list prehab items with their group, marked "(joint care)". |
| m6 | Weekly table Biceps / Triceps **4 4 4 4** in block 1 against `target_by_group_by_week` 3 (carried r6 m3) | 3.5 rounds up to 4 against a stairway start of 3. G-212 now prints a number under the final sets one under the final, so the rounding rules disagree with each other. | Accurate copy (G-203 / G-212) | Round a held arm row the way the stairway's start does, or print "4 (2-3 direct)". |
| m7 | Monday weeks 5-12: **Hack Squat** 12-15 → 8-12 reps; **Step-Up** 10-12 → 8-12 (carried r6 m4) | Heavier, lower-rep loading moves onto the deep-knee-bend lifts of the painful knee, while the quads are held "for the knee". | VOL-03; EQ-03; pain plan | `dose.mjs`: keep a pain-flagged pattern in its higher rep zone across blocks. |
| m8 | Thursday block 1 → 2: **Rear-Foot-on-Wall DB RDL → Staggered-Stance (Kickstand) DB Deadlift** (carried r6 m5) | Steps down the stability ladder with no pain reason. | R2-LIB-01; PER-02 | `select.mjs` block rotation: never rotate down a rung without a pain reason. |
| m9 | Week 5 "Jumps move to Receive-Create 2: Land & Go"; week 9 "Receive-Create 3: Repeat" over **Lateral Box Step-up Jump 2 contacts per leg** (carried r6 m6) | The stage label promises repeats over a single-contact drill. The jargon is printed in EN and ES ("Recibir-Crear 3: Repetir"). | R2-ATH-03; accurate copy | `athletic.mjs`: stage 3 picks a low-amplitude lateral repeat (line hops), or print plain words. |
| m10 | Week 12 MYO on **KB Face Pull - 1-second squeeze** (4 sets, Thursday) and **Hammer Curl** (Monday); line "a MYO set on the day's last small-muscle or machine exercise" (carried r6 m7) | A MYO cluster on the lift labelled "joint care: lower slowly and stay in a pain-free range". Monday's last exercise is the calf raise, not the curl. | G-69; H02; accurate copy | `dose.intensifierEligibleRc`: exclude `prehab` / joint-care items. Words: "the day's last eligible small-muscle exercise". |
| m11 | Calves: Monday **Machine Calf Raise 4**, Thursday joint-care **Standing DB Calf Raise 2** (carried r6 m8) | His rule is 1 exercise × 3 sets per leg day. Open G-198 question: listed for the record only. | R3-SES-01; R3-ATH-02; G-198 (open) | None until the coach answers. |
| m12 | "Olympic lifts are for power. Cleans, snatches …" paragraph; "Power / Olympic lifts" blocks; "4 Olympic-lift sets" in every week header (carried r6 m9) | The plan holds only KB swings. For a gen-pop 52-year-old this is noise, and it invites the lift the filter removed. | Accurate copy; EQ-03 | Print the paragraph only with an Olympic-family item; otherwise count "power (KB swings)". |
| m13 | Monday KB swing: "Instead of Mid-Hang Clean Pull, to protect your knee." (carried r6 m10) | The real filter is age / L1 / 3 play days (EQ-03). A clean pull is not a deep-knee-bend lift. | Honest output (G-94 / G-133) | Key the note from the actual `olympic_safe` reason. |
| m14 | "Switching off the accessories block takes away every direct set for Shoulders, Biceps, Triceps and Calves." (r6 m11, partly fixed) | Shoulders are now named. The block also holds the leg extension (2 of 6 quad sets) and the leg curl (2 of 7 hip sets), and those are not named. | Accurate copy | Add "and part of: quads, hips" from the groups whose sets drop when the block is off. |
| m15 | Thursday **45-Degree Hyperextension** swaps (carried r6 m12) | "loses the feel of the original implement" for back extension → DB / KB deadlift. There is no glute bridge or hip thrust swap. The step-up has one swap. | R4-LIB-04 | Swap-reason table: "loses the supported hip extension". Add bridge / hip thrust and a box split squat where the pain filter allows. |
| m16 | Monday **Step-Up (forward and lateral)** (carried r6 m13) | One item, two directions, no split. | Clarity | Note "alternate forward and lateral sets", or two variants by block. |
| m17 | Header "about 9-10 exercises a session" | Above gen-pop 5-7. Open STATUS #6, for the record. | R4-SES-02; STATUS Q6 | None until the coach answers. |
| m18 | Back 6 → 8 = chest 6 → 8; incline press credited to chest only | Pull = push for a racket player. Open STATUS #5 / #14 and the incline-credit question (which would also ease m1: half an incline set for the front delts). For the record. | STATUS Q1 / Q5 / Q14 | None until the coach answers. |
| m19 | Spanish (`.es.md`) | Good neutral Latin American Spanish with the gym term in brackets. Slips:<br>- "mantiene cuádriceps en las mismas series" needs "los cuádriceps" (carried).<br>- "Hiperextensión a 45° (Back Extension)": the bracket does not match the copy name "45-Degree Hyperextension" (carried).<br>- "Elevación de talones sentado" next to "Elevación de pantorrillas" for the same muscle (carried).<br>- "Aperturas posteriores inclinado con mancuernas" does not agree: use "con el torso inclinado" (carried, now also in the new up-front line).<br>- "Cuidado articular de hombros por encima de la cabeza / raqueta" reads oddly (carried).<br>- "Recibir-Crear 3: Repetir" is jargon (carried; m9).<br>- New: "Si te saltas ese día, hombros termina en unas 7" needs "los hombros terminan en unas 7 series". | R2-GEN-08; H14 | `model/i18n/es.json` / `tools/compile/es/exercises.mjs`: add the article in the pain and optional-bonus templates (plural agreement), align the bracket term, use one calf term, fix the two labels. |

**Count: 0 blockers, 1 major, 19 minors** (m11, m17 and m18 are open coach questions, listed for the record).

---

## Fresh checks

- **His A/B template (R4-SES-05, CH5-02).** Unchanged and right. The order is core → jumps / throws → power → strength (H03, H05), with horizontal before vertical (H04).
  - A day: seal row, hack squat, single-arm pulldown, step-up, hammer curl (slot 5), leg extension, plus a calf raise.
  - B day: flat DB bench, 45° hyperextension, incline DB press (incline bias, R4-LIB-03), single-leg DB hinge, triceps extension (slot 5), leg curl, plus the face pull and the joint-care calf raise.
  - His cross pairs: row + squat, pulldown + step-up, curl + leg extension, bench + hip extension, incline + hinge, triceps + leg curl.
- **2-day rule (R4-SES-03).** Printed up front with the third-day suggestion. Quads, hips, back and chest sit at 6-8 on the training days. Quads are held at 6 for the knee, and the plan says so. The shoulders are now **over** the band (M1), where in round 6 they were under it on the training days.
- **Optional-day honesty (H17, G-204 / G-208).** Every group with optional-day sets is now said. The round-6 hidden copy is gone.
- **Arms (G-200).** Slot 5 at 2 → 3 × 15-20, biceps / triceps 3.5 → 5 of 5, no arm day. As his sheet does it.
- **Knee pain.** Hack squat at 2 sets with range stops and a pain-free cue. Low step on the step-up, lowered slowly. Leg extension as joint care. Low box (6-12 in) for landings. Quads held. Only the rep-zone drift is left (m7).
- **Athletic work for a 52-year-old (R3-ATH-02, R3-ATH-05).**
  - Jumps are halved for 3 play days, with no agility drills.
  - Ankle hops progress in place → lateral → zig-zag (27 → 57 low contacts).
  - 8 lb ball throws, rotational and step-forward.
  - KB swings only.
  - Each gym day is at least 48 h before a play day.
  - The Orange bike session (30 → 40 min) sits inside his "max 40 min of steady".
  - Appropriate.
- **Progression copy (R4-PRG-03, CX-02, R4-PRG-04, CX-04).** It is a rule he applies himself ("when you hit 12 on every set … start again at 10"). Same-set weeks say "add load or reps". The next block starts +5 %. The plan is a template you can edit. All correct.
- **Liability (R4-SCP-01/02).** The release line is at the top and the bottom in EN and ES. Each exercise has a YouTube search link and the name to copy (R4-LIB-05).

## What Lalo would like

- The round-6 fix keeps the shoulder and cuff work on the training days, where a racket player needs it, and the plan says what the optional day adds.
- The big groups are never capped, the arms are dosed his way, and no number prints above the final sets.
- Block changes are one-detail variations (grip, squeeze, pause, one leg at a time, from a step).
- The add-ons fit this person: soleus, tibialis, wrist extension for the paddle elbow, balance reach, wall sit and side-lying ER.

## The one change that lifts it

Drop the Friday reverse fly, or make it a side raise and call it extra. The shoulders then sit at 6-7 on the training days, inside the band and under back and chest. After that, the plan is one face-pull set count (m1) and some copy away from an A-.
