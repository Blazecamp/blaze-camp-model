# Coach-eye review, round 5: 08 Pickleball, gen-pop, 52, knee pain (engine 0.6)

**Grade: B** (one real fix, and a list of small ones, before Lalo hands it to a client)

Reviewed: `samples/plans/08-pickleball-genpop.en.md`, `.es.md`, `.json` (engine 0.6.0, model 1.3.0); intake `samples/intakes/08-pickleball-genpop.json` (52 years old, L1 with 0.5 years of lifting, 2 gym days Mon/Thu, pickleball Wed/Sat/Sun, basic gym, mild right-knee pain worse with deep knee bends, 18 in box).
Authority used: CH5 + round 4 + CT-01 > CX > round 3 > round 2 > full answers > chat > sheets. I did not judge session length (CT-01). Open coach questions (STATUS_v0.5 #1-14, G-119 / G-139 / G-199 open items) and the known G-198 note (calves 8 → 4, shoulders 7 of 8) are raised as minors at most.

**In short.** All three round-4 majors are fixed:
- The snatch and the barbell clean pull are gone. Both power slots are now KB swings.
- The shoulders sit inside the 6-8 band on the training days, and the plan says up front that they hold 7 of 8.
- The step-up gets a 6-12 in step cue, and the leg extension gets a real machine-range cue.

The template is his slot for slot, now with the CH5-02 arm slot. Order, pairing, incline bias, core and athletic work suit this client. The new problem comes from the arm slot. The 2-day "train at least 6 sets on the training days" rule is applied to biceps and triceps as if they were big groups. The result is 4-set curls and 4-set triceps extensions next to a 2-set hack squat, plus an arm day on Friday. So the arms out-train every big group and end above their own final number.

---

## Round-4 majors: status

| R4 # | Issue | Status in 0.6 |
|---|---|---|
| M1 | Snatch / barbell clean pull for a 52-year-old L1 with knee pain (EQ-03) | **Fixed.** Monday has a Russian KB swing ("Instead of Mid-Hang Clean Pull, to protect your knee"). Thursday has a split-stance single-arm KB swing. There is no snatch or barbell Olympic lift anywhere, and the swaps are a high pull and an American swing. This is what Lalo would pick. |
| M2 | Shoulders reached 6-8 only through the optional-day fly | **Fixed** in the sense of R4-SES-03. KB face pull runs 4 sets from week 1, the training days hold 6.25 → 7, and "Before you start" says "Shoulders: this template holds 7 weekly sets, below the planned 8." The 7 of 8 is the known G-198 note (minor m3 below). |
| M3 | Step-up had no step height; the pain cue did not fit the lift | **Fixed.** Step-up: "Use a low step, about 6-12 in (15-30 cm); go higher only if it stays pain-free, and lower yourself slowly." Hack squat and leg extension: "set the machine (seat, pad or range stops)". The Spanish twins are correct. |

Round-4 minors fixed: m1 (the quads hold is now explained in the pain line), m2 (a lift note now exists: the KB swing), m4 (the arm slot now exists, CH5-02), m8 (the cardio bridge now names Friday), m9 (the plyo share and Receive-Create jargon are gone from week headers, "11 = your hardest week", and the intensifier line is correct for two days), and m14 for the most part (rodilla article, lower-case group names in the pain line, "11 y 12").
Still open: m3, m5, m6, m7, m12, m13 (carried below).

---

## Problems by severity

### Blockers

None.

### Major

| # | Where | Problem | Rule | Engine fix hint |
|---|---|---|---|---|
| M1 | Monday **Dumbbell Hammer Curl 4 × 15-20**; Thursday **Overhead DB Triceps Extension → Floor DB Skullcrusher 4 × 15-20**; Friday **Triceps Kickback (bonus) 2 → 3** and **Supine Biceps Curl (bonus) 2 → 3**; weekly table: Biceps 8 → 9, Triceps 8 → 9, final sets 8 | **The arms out-train every big group.** In week 1, biceps and triceps get 8 credited sets each, about 6 direct sets each, across 3 days. Back, chest and quads get 6, and shoulders get 6. The arm exercise is the highest-set lift on both days (4 sets), while the main knee lift (hack squat), the step-up, the hyperextension and the single-leg hinge get 2 each. In weeks 11-12 the arms reach 8.75-9, above their own printed final of 8. The table prints "9 … \| 8". The cause is the engine's 2-day main-day floor of 6, applied to every trained group. R4-SES-03 asks for "every **big** muscle group about 6-8". The arm slot is slot 5, a single small exercise. His own A/B sheet doses the bicep slot at 2 × 20. For a 52-year-old recreational court player who trains twice a week, Lalo would put the sets into legs, back and shoulders. He would keep the arms at 2-3 sets in slot 5, with no arm day. The same choice is why the optional day's 2 places go to the arms and none goes to the shoulders, which are a big group stuck at 7 of 8 for a racket player. | R4-SES-03 (the 6-8 band is for big groups); R4-SES-05 (slot 5 = one biceps / triceps exercise); CH5-03 / G-199 (a big group takes its bonus before small groups take the optional day's places); his A/B sheet (AESTHETICS Day 1 'Bicep' 2 × '20 Reps', OBSERVED); R3-ATH-02 (rotator-cuff work for 50+ racket players) | `engine/volume.mjs` `floorMain`, 2-day branch (~line 907-913): set `out[g] = V.two_day.weekly_sets[0]` only for groups with a line in `V.two_day.big_classes`, as `floorOfGroup` (~line 1486) already does. In `computeTargets`, a small group on a 2-day plan starts at what slot 5 holds at 2-3 sets plus its helper credit (about 4-6), not at 7. With the arms off the optional day, the 2 bonus places go first to the shoulders (a rear-delt fly or lateral raise, CH5-03), which also closes the known 7 of 8. Then no group is printed above its final sets. Add a test `R4-SES-03 two-day small groups below big groups` on sample 08. |

### Minor

| # | Where | Problem | Rule | Engine fix hint |
|---|---|---|---|---|
| m1 | Monday, weeks 5-12: **Hack Squat** 12-15 → 8-12 reps (carried from R4 m3) | Heavier, lower-rep loading moves onto the deep-knee-bend lift of the painful knee in blocks 2-3, and to 2 in the tank in block 3. The pain line says the quads are held "same sets, progress with reps and load". That is fine, but this client should progress the load inside a higher rep zone. | VOL-03; EQ-03 (pain: safer loading) | `engine/dose.mjs`: keep a pain-flagged pattern in its higher rep zone (10-15 / 12-15) across blocks. |
| m2 | Calves: Monday **Machine Calf Raise 4 sets**; Thursday **Standing DB Calf Raise 2 sets** in the joint-care block; table "Calves 4" | This is the known G-198 trade (the B day's calf slot gave way to triceps). On paper the calves are trained on both leg days, as R3-ATH-02 asks. But his rule is one exercise × 3 sets per leg day, and the dose is lopsided at 4 + 2. The Thursday sets count for nothing in the table, and "Week 1 at a glance" leaves calves off Thursday. It reads as if calves were trained once. If M1 is fixed (arms at 2-3 sets), the room is there for 3 + 3 counted. | R3-SES-01 (calves one exercise × 3 per leg day); R3-ATH-02; G-198 (known) | `volume.mjs` / `week.mjs`: after M1, restore the B-day calf slot as a counted 3-set station. Until then, count a joint-care calf raise in the group table and in "at a glance". |
| m3 | "Before you start": "Shoulders: this template holds 7 weekly sets, below the planned 8" | This is the known G-198 note. It is stated honestly. Listed for the record only, because M1's fix would close it. | R4-SES-03; G-198 | See M1. |
| m4 | Stairway: totals 44 44 44 44 · 45 45 45 45 · 46 46 49 51; Quads and Calves flat for 12 weeks (carried from R4 m5) | 5 of the 7 added sets land in weeks 11-12. Four identical weeks open the plan. The printed line "small steps up to week 6, a bit bigger from week 7" does not describe this schedule. CX-02 allows weeks that hold, so this is not wrong, only bunched. | R3-VOL-04; R4-PRG-01; CX-02 | `progression/stairway.mjs`: spread whole-set steps across the blocks, and generate the stairway sentence from the real schedule. |
| m5 | Thursday, block 1 → 2: **Rear-Foot-on-Wall DB RDL → Staggered-Stance (Kickstand) DB Deadlift** (carried from R4 m6) | The block change steps down the stability ladder: it goes from the harder hinge to the more supported one, with no pain reason. | R2-LIB-01; PER-02 | `select.mjs` block rotation: order the single-leg hinge variants by stability, and never rotate down a rung without a pain reason. Here, kickstand first, then rear-foot-on-wall. |
| m6 | Monday, blocks 2-3: **Lateral Box Step-up Jump 2 × 2 contacts per leg** (carried from R4 m7) | The week-9 header says "Jumps move to Receive-Create 3: Repeat", but the drill stays the same single-contact step-up jump at 4 contacts per leg. | R2-ATH-03 (Land → Land & Go → Repeat) | `athletic.mjs`: in stage 3, pick a low-amplitude lateral repeat (lateral line hops, small skater hops), or print the stage the drill really is. |
| m7 | Week 12: **MYO set on KB Face Pull** (Thursday) and on **Hammer Curl** (Monday); line "a MYO set on the day's last small-muscle or machine exercise" | The face pull is printed as "also your joint care: lower slowly and stay in a pain-free range". A MYO cluster (15 + 5 × 5) on the racket shoulder's cuff-care lift contradicts that cue. On Monday, the MYO falls on the curl, while the day's last exercise is the calf raise, so the printed line does not match. | G-69 (no intensifier where the plan protects); H02; accurate copy | `dose.intensifierEligibleRc`: exclude items flagged `joint_care`. Render the line as "the day's last eligible small-muscle exercise". |
| m8 | "Olympic lifts are for power. Cleans, snatches and their dumbbell and kettlebell versions…" paragraph; "Power / Olympic lifts" block; "4 Olympic-lift sets" in every week header | The plan holds no Olympic lift, only KB swings. For a gen-pop 52-year-old, the cleans and snatches paragraph is noise and invites the lift M1 of round 4 removed. | Accurate copy; EQ-03 | `render.mjs`: print the Olympic paragraph only when an Olympic-family item is in the plan. Otherwise say "power (KB swings)" and count "power sets". |
| m9 | Monday power note: "Instead of Mid-Hang Clean Pull, to protect your knee." | The swap is right, but the reason given is partial. The real reasons are age, L1 and 3 play days (EQ-03). A clean pull is not a deep-knee-bend lift, so the line reads oddly. | Honest output (G-94 / G-133) | `why` arg: use the actual filter reason (`olympic_safe`: age / level / pain) in the note key. |
| m10 | "Switching off the accessories block takes away every direct set for Biceps, Triceps and Calves." | This is incomplete. The accessories block also holds the KB face pull (4 of the shoulders' 7 sets), the leg extension and the leg curl. Thursday's calf raise sits in joint care, so "every direct set" for calves is also wrong. | Accurate copy | `render.mjs`: build the line from the groups whose direct sets actually leave with the block. |
| m11 | Thursday: **45-Degree Hyperextension** swaps (carried from R4 m12) | The swap reasons read "loses the feel of the original implement" for a back extension → DB / KB deadlift. There is still no glute bridge or hip thrust swap. The step-up has only one swap (step-up to knee drive) and no split-squat-to-box or lateral-lunge option. | R4-LIB-04 | Catalog swap-reason table: "loses the supported hip extension". Add bridge / hip thrust and a box split squat as swaps where the pain filter allows. |
| m12 | Monday: **Step-Up (forward and lateral)** (carried from R4 m13) | One item names two directions with no split. | Clarity | Split it into two variants and rotate them by block, or add the note "alternate forward and lateral sets". |
| m13 | Header "about 9-10 exercises a session" (Mon 10, Thu 9 + 1 joint care) | This is above the gen-pop 5-7 range. It is STATUS open question #6 (non-competitive adult sized 5-10). For the record only. | R4-SES-02; STATUS Q6 | None until the coach answers. |
| m14 | Back 6 → 8 vs chest 6 → 8 | Pulling equals pressing for a racket player. This is open questions #5 and #14. For the record only. | Profile `push_pull`; STATUS Q5 / Q14 | None until the coach answers. |
| m15 | Spanish (`.es.md`) | It is good neutral Latin American Spanish, with the gym term in brackets. Small slips remain: "mantiene cuádriceps" should be "mantiene los cuádriceps". "series directas de Bíceps, Tríceps y Pantorrillas" capitalizes group names mid-sentence. "(Back Extension)" does not match the copy name "45-Degree Hyperextension". "Elevación de talones sentado" sits beside "Elevación de pantorrillas" for the same muscle. | R2-GEN-08 / H14 | `model/i18n/es.json`: add an article in the pain template, lower-case the interpolated groups in the accessories line, align the bracket term with the copy name, and use one calf term. |

**Count: 0 blockers, 1 major, 15 minors** (m3, m13 and m14 are known or open items, listed for the record).

---

## What Lalo would like (praise)

- **His A / B template, slot for slot, with slot 5 (CH5-02).**
  - A day: seal row (two-arm horizontal pull), hack squat, single-arm pulldown, step-up, hammer curl, leg extension.
  - B day: flat DB bench, 45° hyperextension, incline DB press (incline in the vertical slot, R4-LIB-03), single-leg DB hinge, triceps extension, leg curl.
  - Extras sit at the end: calf raise on A; face pull and calf on B.
- **Order and pairing.**
  - Core first (planks, bird dogs, side plank, dead bugs: low-back friendly). Then jumps, throws, power, strength, accessories (H03, H05).
  - Horizontal before vertical on both days (H04).
  - The supersets follow his cross pairs: row + squat, pulldown + step-up, curl + leg extension, press + hip extension, incline + single-leg hinge, triceps + leg curl.
- **Knee handling is now coach-like.** Machine range stops, a 6-12 in step, low-box (6-12 in) landings, "chosen to protect your knee" on the lift it changed, quads held, and the pain line said once at the top.
- **Athletic layer fits a 52-year-old court player** (R3-ATH-02, R3-ATH-05).
  - Low-box stick-the-landing, then a low lateral step-up jump. Ankle hops progress in place → lateral → zig-zag.
  - Rotational medball throws on both sides with an 8 lb ball.
  - Swings instead of Olympic lifts.
  - Jumps are halved and there are no agility drills, because he plays 3 times a week. Each gym day sits 48 h before a play day.
- **Aerobic.** Play counts as 2 of the 3 sessions. The one Orange bike session waves 30 → 33 → 37 → 40 min in each block, inside his "max 40 min of steady". The copy places it on Friday correctly.
- **The 2-day rule** is printed at the top with the third-day suggestion (R4-SES-03).
- **Progression is a rule.** "When you hit 12 on every set … add weight next time and start again at 10" (R4-PRG-03). Same-set weeks say add load or reps (CX-02). The next-block rule is +5 % (R4-PRG-04), and the plan states "template you can edit" (CX-04).
- **Block changes are one-detail variations:** pronated grip on the seal row, a 1-second squeeze on the pulldown and face pull, one leg at a time on the leg extension, a step for the calf raise, and a pause at the bottom on the incline press.
- **Liability.** The release line is printed at the top and the bottom in both languages, and the terms were accepted before the build (R4-SCP-01/02). The YouTube search link and the name to copy sit on every lift (R4-LIB-05).
- **Optional add-ons fit the person:** soleus, tibialis, wrist extension for the paddle elbow, balance reach, wall sit, side-lying external rotation (R4-LIB-01).
