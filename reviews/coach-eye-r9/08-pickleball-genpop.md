# Coach-eye review, round 9: 08 Pickleball, gen-pop, 52, knee pain, 2 days (engine 0.7.0)

**Grade: B+** (coach's round-5 grade: B+; target A-). Every round-5 answer that names this plan is in, and done well:
- two full-body days in his pairing;
- assisted jumps first for the knee, then a slow two-leg progression;
- the pain-above-6 line;
- the calf raise on both days.

One round-5 answer is not visible in the plan: R5-ATH-08 "normal core, including rotation" for a 50+ player without low-back pain (M1). Beyond that, a long tail of carried minors keeps it from A-.

Reviewed: `samples/plans/08-pickleball-genpop.en.md`, `.es.md`, `.json`. The plan is engine 0.7.0, model 1.3.0, `validation.ok: true`, with warnings `two_day_rule`, `racket_calf_both_days`, `pain_plan` and `jump_pain_scale`. Intake: `samples/intakes/08-pickleball-genpop.json`. The client is 52, L1, trains Mon / Thu and plays Wed / Sat / Sun, with mild right-knee pain that is worse with deep knee bends.

The health-warning path was also exercised on this intake in a scratch run; no repository file was written. With `safety.heart: true` the plan is built with status `ok`, `meta.health.warn`, and the health warning under the release line in EN and ES. The stamp reads "you said yes to at least one question". With `severity: 'severe'` knee pain the plan is built with the warning and the short line on the week view. This matches R5-GEN-02, G-270 and G-271.

Authority: R5 and CH5, then R4 and CT-01, CX, R3, R2, the full answers and the sheets. Not judged: session length (CT-01). Open questions are rated minor at most.

---

## Round-5 answers that touch this plan

| Answer | What the plan does | Status |
|---|---|---|
| R5-GEN-01: two full-body days | Mon "Full body 1 - squat + pull, single-leg hinge + press": seal row, hack squat, incline DB press, rear-foot-on-wall RDL, hammer curl, leg extension, calf raise.<br>Thu "Full body 2 - hinge + push, lunge + pull": flat DB bench, 45° hyperextension, single-arm pulldown, step-up, triceps extension, leg curl, face pull, calf raise.<br>Knee lift with a pull and hip lift with a press on each day; both pull vectors, both push vectors, two-leg and single-leg of both lower patterns over the two days. | Applied |
| R5-GRD-08: assisted plyos with knee pain | Weeks 1-4: Assisted Lateral Jump (holding a rack) on Mon and Assisted Pogo Hops on Thu.<br>Weeks 5-8: two-foot lateral box jump and lateral ankle hops.<br>Weeks 9-12: low box jump (half-shin) and zig-zag ankle hops.<br>All two-leg and low; no band. | Applied |
| R5-GRD-08: pain-scale warning | "Jumps and pain: skip the jumps on any day your pain is above 6 on a scale of 1 to 10 (10 = you need a hospital)..." EN and ES, up front. | Applied |
| R5-VOL-10: calf raise both days, one more exercise | Mon machine calf raise 3 → 4; Thu standing DB calf raise 3 → 4. Calves 6 → 8. Said up front ("Thursday holds one exercise more than usual. Remove it if you need a shorter session"). | Applied |
| R5-ATH-07: 5-10 exercises for stay-athletic | Range 5-10; each day holds 10 (8 lifts + 2 athletic stations), Thu one more lift for the calf. | Applied (default at the top of the range, see m14) |
| R5-ATH-09: safe power slot from 3 play days | KB swings only (Russian, split-stance single-arm). | Applied (the note's wording is wrong, m10) |
| R5-ATH-08: normal core incl. rotation unless low-back pain | See M1. | **Not visible** |
| R5-GRD-06: core optional | "Core (optional: you may switch it off or change it)" on every day + the adjust line. | Applied |
| R5-VOL-02: pull ≥ press | Back 6 → 8, chest 6 → 8; back leads in weeks 3-4. | Applied |
| R5-GEN-02: health warning | Not triggered by this intake. The stamp is correct, and the path works when a flag is set (see above). | Applied |

## Round-8 items: status

| R8 # | Status in r9 |
|---|---|
| m1 face pull 4 sets ×12, the shoulders' only direct lift, listed as easiest to remove | **Open** (m1). Now also carries the week-12 MYO (m8). |
| m2 week-11 bunching | **Open** (m2): totals 42 43 **46** 47; week 11 steps bench, hyperextension and pulldown at once. |
| m3 Friday line "even if you skip the optional lifting" on a day with no lifting | **Partly**: the day's core is now a Pallof press (no longer a repeat of Monday's plank), but the stale line stays in EN and ES (m3). |
| m4 Thursday calf raise missing from the glance row | **Fixed** (Thursday shows "Calves 1"). |
| m5 arms print 4 against a start of 3 | **Open** (m4). |
| m6 hack squat / step-up drift to 8-12 under knee pain | **Open** (m5). |
| m7 single-leg hinge steps down the stability ladder | **Fixed**: the rear-foot-on-wall RDL holds all 12 weeks. |
| m8 "Receive-Create 3: Repeat" jargon | **Moot** for this plan: the week header no longer shows a stage. |
| m9 MYO on joint-care face pull | **Open** (m8). |
| m10 calves 4 + 2 | **Moot** (R5-VOL-10: 3 + 3 → 4 + 4). |
| m11 Olympic paragraph with no Olympic lift | **Open** (m9). |
| m12 "Instead of Mid-Hang Clean Pull, to protect your knee" | **Open** (m10). |
| m13 accessories switch-off line leaves out quads / hips | **Open** (m11). |
| m14 hyperextension swaps | **Open** (m12). |
| m15 "Step-Up (forward and lateral)" as one item | **Open** (m13). |
| m16 / m17 session size; back = chest | m16 is now partly answered by R5-ATH-07 (m14); m17 is answered by R5-VOL-02 (equal is fine). |
| m18 Spanish | **Open** (m15). |

---

## Problems

### Blockers

None.

### Major

| # | Where | Problem | Rule | Severity | Engine fix hint |
|---|---|---|---|---|---|
| M1 | Core blocks, weeks 1-12: Mon **Plank + Bird Dogs**, Thu **Side Plank + Dead Bugs**, Fri **Pallof Press**. Every item carries `why.hotspot` (D-23). | **The plan still reads as the low-back core list, for a client with no low-back pain.**<br>- All five core picks are exactly the R5-LIB-02 low-back list (dead bugs, bird dogs, side planks, Pallof press) plus the plank: anti-movement only, no rotational drill at all.<br>- Round 5 asked this exact question about a 50+ client with a low-back hot spot but no reported pain. His answer: "No. Only when they report low-back pain. Otherwise normal core, including rotation" (R5-ATH-08). G-261 retired the list, but the profile hot-spot lean (`selection.s6.core.hotspot_anti_bonus` +2, `hotspot_flexion` -2) still produces it here.<br>- Pickleball is a rotational sport. The rotation sits only in the athletic block (medball scoops and passes), not in the core.<br>- The core block also never changes in 12 weeks (G-131 / PER-02 "one core exercise of every main day changes at an exercise-block boundary"). | R5-ATH-08; G-261; PER-02 / G-131 | major | `select.mjs` core scoring: when the intake has no `lower_back` pain, drop the hot-spot anti-movement bonus for the 50+ overlay, so that the profile's `core_rules.plane_pct` (E-184) deals one rotational drill a week (cable / medball rotation, half-kneeling chop or lift). Keep the flexion penalty only for loaded flexion. Apply the per-block core change on both main days. |

### Minor

| # | Where | Problem | Rule | Severity | Engine fix hint |
|---|---|---|---|---|---|
| m1 | Thu **KB Face Pull** 4 × 12 weeks | (Carried.)<br>- It holds more sets than the day's first lift in weeks 1-10 and twice the sets of both hip lifts. It never steps.<br>- It is the shoulders' only direct exercise, yet it is listed among the easiest to remove.<br>- Side delts get helper credit only. | VOL-07; R4-SES-04; R3-VOL-01 | minor | Start it at 3 and step it to 4 at a block change. Keep a band-holding item out of `easy_to_remove`, or print "(holds your shoulder sets)". |
| m2 | Totals `38 38 39 39 · 40 40 41 41 · 42 43 46 47` | (Carried.) Week 11 adds bench 3 → 4, hyperextension 2 → 3 and pulldown 3 → 4 at once; the big groups sit flat in weeks 5-10. | R3-VOL-04; R4-PRG-01 | minor | `volume.planStairs`: spread the big groups' last steps (back wk 8, chest wk 10, hips wk 11). |
| m3 | Fri optional day: Pallof press + Orange run; "This cardio session is part of the plan even if you skip the optional lifting" (ES "aunque te saltes las pesas opcionales") | (Carried.) There is no lifting on that day. | Accurate copy | minor | Key the line on the optional day holding a lifting item. |
| m4 | Weekly tables: biceps / triceps `4 4 4 4 · 4 4 4 4 · 4 4 5 5` against a schedule of 3 | (Carried.) Rounding disagrees with the stairway start. | Accurate copy (G-203 / G-212) | minor | Round a held arm row like the stairway start, or print "4 (2 direct)". |
| m5 | Mon Hack Squat 12-15 → 8-12; Thu Step-Up 10-12 → 8-12 (weeks 5-12) | (Carried.) Heavier, lower-rep loading moves onto the painful knee's deep-bend lifts while quads are "held for the knee". | Pain plan; VOL-03 | minor | `dose.mjs`: keep a pain-flagged pattern in its higher rep zone across blocks. |
| m6 | Mon assisted lateral jump → two-foot lateral **box** jump (wk 5) → low box jump (wk 9) | The weeks 5-8 pick lands sideways onto a box, which is a higher-skill landing than the week 9-12 low box jump. The progression steps down in block 3. Small. | R5-GRD-03 (low → higher); R5-GRD-08 | minor | Rank the knee-pain track so lateral-onto-box comes after the forward low box jump. |
| m7 | Mon and Thu, no overhead press in 12 weeks | Pickleball is an overhead racket sport. R5-ATH-04: "going overhead is also important ... to reach up and have that range of motion". The incline press holds the slot all 12 weeks. The G-252 keeper reads only throwers, volleyball and swimmers. | R5-ATH-04 (spirit); G-252 scope | minor | Add racket overhead profiles (pickleball, tennis, padel) to `incline_overhead.profile_re`, or offer the light overhead joint-care press. |
| m8 | Week 12 MYO on **KB Face Pull** (joint care) and **Dumbbell Hammer Curl**; "MYO set on the day's last small-muscle or machine exercise" | (Carried.) A MYO cluster on the joint-care lift. Monday's last exercise is the calf raise, not the curl. | G-69; H02; copy | minor | `dose.intensifierEligibleRc`: exclude `prehab` / joint-care items; word it "the day's last eligible small-muscle exercise". |
| m9 | "Olympic lifts are for power. Cleans, snatches..." paragraph; "Power / Olympic lifts" block; "4 Olympic-lift sets" in each week header | (Carried.) The plan holds only KB swings. | Copy; R5-ATH-09 | minor | Print the paragraph only with an Olympic-family item; count "power (KB swings)". |
| m10 | Mon KB swing: "Instead of Mid-Hang Clean Pull, to protect your knee." | (Carried.) The real reason is R5-ATH-09 (50+ racket player, 3 play days), not the knee. | R5-ATH-09; honest output | minor | Key the note from the actual `olympic_safe` reason. |
| m11 | "Switching off the accessories block takes away every direct set for Shoulders, Biceps, Triceps and Calves." | (Carried.) It also removes the leg extension (quads) and the leg curl (hips). | Copy | minor | Add "and part of: quads, hips". |
| m12 | Thu 45° Hyperextension swaps | (Carried.) "loses the feel of the original implement" for back extension → DB / KB deadlift; there is no bridge or hip thrust swap. | R4-LIB-04 | minor | Fix the swap reason and add a bridge / hip-thrust swap. |
| m13 | Thu "Step-Up (forward and lateral)" | (Carried.) One item, two directions, no split. | Clarity | minor | "Alternate forward and lateral sets", or two variants by block. |
| m14 | Header "about 10 exercises a session" | R5-ATH-07 confirms 5-10 for stay-athletic players. R5-GEN-03 sets general 7 and older adults 6. A 52-year-old L1 beginner at the top of the range on both days is a lot for a 2-day plan. | R5-ATH-07; R5-GEN-03 | minor (open question) | Ask whether the stay-active default is the mid-range (7) for L1 / 50+. |
| m15 | Spanish (`.es.md`) | (Carried.)<br>- "mantiene cuádriceps" needs "los cuádriceps".<br>- "(Back Extension)" does not match "45-Degree Hyperextension".<br>- Calves are "talones" in one place and "pantorrillas" in another.<br>- "pesas opcionales" (m3).<br>New: "así que jueves lleva" needs "así que el jueves lleva". | R2-GEN-08; H14 | minor | `model/i18n/es.json` and `tools/compile/es/exercises.mjs`. |

**Count: 0 blockers, 1 major, 15 minors** (m14 is an open question).

## Fresh checks (as Lalo)

- **His pairing on two full-body days.** Both days open with the core, then the athletic block (jump + throw), power (KB swing), then strength in his order: pull or press first, then the knee or hip lift. Horizontal comes before vertical on both days.
- **The 2-day band.** Quads are held at 6 for the knee, and the plan says so. Hips run 7 → 8, back 6 → 8, chest 6 → 8, shoulders 6 → 7, calves 6 → 8. Nothing is over 8 or under 6. The plan suggests a third day.
- **The knee.** The jump work is assisted in block 1, two-leg and low throughout, and halved because of the 3 play days. The pain scale is printed. The hack squat runs at 2 sets with range stops, and the leg extension is joint care.
- **Play days.** Both gym days sit at least 48 h before a match day (Mon → Wed, Thu → Sat). There are no agility drills. The Orange run is on Friday.
- **Liability.** The release line prints at the top and bottom in EN and ES. Every exercise has a YouTube search link and a name to copy.

## The one change that lifts it

Give this player normal core with one rotational drill a week, and change one core drill per block (M1). Then fix the face pull's role (m1) and the knee rep drift (m5). With those done, this is an A-.
