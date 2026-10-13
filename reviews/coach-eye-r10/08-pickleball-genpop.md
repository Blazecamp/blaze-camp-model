# Coach-eye review, round 10: 08 Pickleball, gen-pop, 52, knee pain, 2 days (engine 0.7.0)

**Grade: A-** (coach's round-5 grade: B+; round 9: B+). **The round-9 major is fixed.** The player has no low-back pain, so she gets normal core with rotation (R5-ATH-08, G-295, G-296):
- **Monday:** Bicycle Crunch (block 1) → Cable Woodchopper (blocks 2-3), next to the Reverse Crunch.
- **Thursday:** Side Plank and Bird Dogs → Dead Bugs.
- **Friday:** Plank.

That is one moving rotational drill each week, plus normal flexion and anti-movement work. It is no longer the low-back list.

The R5-ATH-04 overhead gap (r9 m7) is also closed: a light weekly overhead press sits in Thursday's joint care. The press chosen is tall-kneeling, which is a poor fit for a painful knee (n1).

Every round-5 answer that names this plan is applied:
- two full-body days in his pairing;
- assisted jumps first;
- the pain-above-6 line;
- the calf raise on both days.

What is left is a long tail of minors, mostly copy, with two knee details among them (n1, m5).

Reviewed: the committed `samples/plans/08-pickleball-genpop.en.md`, `.es.md` and `.json` at `HEAD` (commit 5a45b2b + 1d883f5; engine 0.7.0, model 1.3.0, `validation.ok: true`). Warnings: `two_day_rule`, `racket_calf_both_days`, `pain_plan`, `jump_pain_scale`. Intake: `samples/intakes/08-pickleball-genpop.json`. The client is 52, L1, trains Mon / Thu and plays Wed / Sat / Sun, with mild right-knee pain that is worse with deep knee bends.

During this review another session was regenerating the working tree (model 1.4.0 label, G-305). One transient regeneration of the `.en.md` showed different picks, such as an incline curl and a medball overhead throw. The final working-tree JSON matched `HEAD`, which is what is reviewed here.

Not judged: session length (CT-01). Open coach questions are rated minor at most.

---

## Round-9 items: status

| R9 # | Status in r10 |
|---|---|
| **M1** low-back core list for a client with no low-back pain; no rotation; the core never changes | **Fixed** (G-295 / G-296).<br>- Rotation: the bicycle crunch in weeks 1-4, then the cable chop in weeks 5-12.<br>- Normal flexion: the reverse crunch.<br>- Anti-movement: side plank, bird dogs → dead bugs, plank.<br>- Changes at the block-2 boundary on both days. Block 3 changes nothing (n2). |
| m1 KB face pull 4 × 12 weeks, shoulders' only direct lift, listed as easiest to remove | **Open** (m1). |
| m2 week-11 bunching | **Open** (m2). Totals `38 38 39 39 · 40 40 41 41 · 42 43 46 47`. |
| m3 Friday "even if you skip the optional lifting" | **Open** (m3), EN and ES. |
| m4 arms print 4 against a start of 3 | **Open** (m4). |
| m5 hack squat / step-up drift to 8-12 under knee pain | **Open** (m5). |
| m6 lateral box jump (block 2) before the low box jump (block 3) | **Open** (m6). |
| m7 no overhead press for an overhead racket sport | **Fixed** (G-299). Thursday joint care: a light overhead press, 2 × 12-15. The kneeling position is a new small issue (n1). |
| m8 MYO on the joint-care face pull | **Open** (m7). |
| m9 Olympic paragraph and "4 Olympic-lift sets" with KB swings only | **Open** (m8). |
| m10 "Instead of Mid-Hang Clean Pull, to protect your knee" | **Open** (m9). |
| m11 accessories switch-off line leaves out quads / hips | **Open** (m10). |
| m12 hyperextension swaps ("loses the feel of the original implement"; no bridge) | **Open** (m11). |
| m13 "Step-Up (forward and lateral)" as one item | **Open** (m12). |
| m14 about 10 exercises a session for a 52-year-old L1 | **Open question** (m13). |
| m15 Spanish | **Open** (m14). |

## Round-5 answers that touch this plan

| Answer | What the plan does | Status |
|---|---|---|
| R5-ATH-08: normal core incl. rotation without reported low-back pain | Bicycle crunch → cable chop each week, plus the reverse crunch, side plank, bird dogs / dead bugs and plank. | Applied |
| R5-ATH-04: overhead pressing kept for health | Thursday joint care: light overhead press, 2 × 12-15, no muscle credit. | Applied (position: n1) |
| R5-GEN-01: two full-body days | Mon "squat + pull, single-leg hinge + press"; Thu "hinge + push, lunge + pull". Both vectors and both lower patterns over the two days. | Applied |
| R5-GRD-08: assisted plyos first; the pain-above-6 line | Assisted lateral jump and assisted pogo hops in block 1. The pain-scale line prints up front in EN and ES. | Applied |
| R5-VOL-10: calf raise both days, one more exercise | Mon 3 → 4, Thu 3 → 4; said up front. | Applied |
| R5-ATH-07 / R5-GEN-03: 5-10 exercises | 10 a day. | Applied (default at the top of the range, m13) |
| R5-ATH-09: safe power slot from 3 play days | KB swings only. | Applied (note wording: m9) |
| R5-VOL-02: pull ≥ press | Back 6 → 8 leads chest 6 → 8 in weeks 3-4. | Applied |
| R5-GRD-06: core optional | Printed on every core block. | Applied |
| R5-GEN-02: health warning | Not triggered by this intake. The stamp reads correctly. | Applied |

---

## Problems

### Blockers

None.

### Major

None.

### Minor

| # | Where | Problem | Rule | Severity | Engine fix hint |
|---|---|---|---|---|---|
| n1 | Thu joint care **Tall-Kneeling DB Overhead Press**, 12 weeks | **New.** The weekly overhead press (G-299) is done kneeling, by a client whose plan is built around knee pain. Tall kneeling puts the body's weight straight onto the kneecap. Nothing on the item says to pad the knee or choose another position. The swaps (seated floor Z-press, seated machine press, standing DB press) are all knee-free. | R5-GRD-08 / pain plan; VOL-03 "cut, do not push it" | minor | `week.addPrehab`: with knee pain, rank kneeling set-ups last (standing or seated DB press first). Or add the knee-pain note "use a thick pad or press standing". |
| n2 | Core, weeks 9-12 | **New, small.** The core changes at the block-2 boundary but not at block 3. Monday keeps the cable chop and reverse crunch, Thursday the side plank and dead bugs, for 8 weeks. G-296 reads "a core exercise changes at a block boundary". | PER-02; G-131 / G-296 | minor | Apply the block change at every boundary, e.g. chop → half-kneeling lift (or standing, n1) in block 3. |
| m1 | Thu **KB Face Pull** 4 × 12 weeks | (Carried.)<br>- It holds more sets than the day's first lift until week 11, and never steps.<br>- It is the shoulders' only direct lift, yet it is listed among the easiest to remove.<br>- Its sets go to the rear delts, while the side delts get helper credit only. | VOL-07; R4-SES-04; R3-VOL-01 | minor | Start at 3, step to 4 at a block change, and print "(holds your shoulder sets)". |
| m2 | Totals `… 42 43 46 47` | (Carried.) Week 11 adds bench 3 → 4, hyperextension 2 → 3 and pulldown 3 → 4 at once. | R3-VOL-04; R4-PRG-01 | minor | Spread the big groups' last steps. |
| m3 | Fri optional day: "This cardio session is part of the plan even if you skip the optional lifting" (ES "aunque te saltes las pesas opcionales") | (Carried.) There is no lifting on that day. | Accurate copy | minor | Key the line on the optional day holding a lifting item. |
| m4 | Biceps / triceps tables `4 … 4 5 5` against a start of 3 | (Carried.) Rounding disagrees with the stairway start. | Accurate copy | minor | Round like the stairway, or print "4 (2 direct)". |
| m5 | Mon Hack Squat 12-15 → 8-12; Thu Step-Up 10-12 → 8-12 (weeks 5-12) | (Carried.) Heavier, lower-rep loading moves onto the painful knee's deep-bend lifts while the quads are "held for the knee". | Pain plan; VOL-03 | minor | Keep a pain-flagged pattern in its higher rep zone. |
| m6 | Mon assisted lateral jump → two-foot lateral **box** jump (block 2) → low box jump (block 3) | (Carried.) Jumping sideways onto a box is a harder landing than the forward low box jump that follows it. | R5-GRD-03; R5-GRD-08 | minor | Rank lateral-onto-box after the forward low box jump. |
| m7 | Week 12 MYO on **KB Face Pull** (joint care) | (Carried.) | G-69; H02 | minor | Exclude joint-care items from intensifiers. |
| m8 | "Olympic lifts are for power…" paragraph; "4 Olympic-lift sets" in every week header | (Carried.) The plan holds only KB swings. | Copy; R5-ATH-09 | minor | Print it only with an Olympic-family item; say "power (KB swings)". |
| m9 | Mon KB swing: "Instead of Mid-Hang Clean Pull, to protect your knee." | (Carried.) The reason is R5-ATH-09 (50+ racket player, 3 play days). | Honest output | minor | Key the note from the actual `olympic_safe` reason. |
| m10 | "Switching off the accessories block takes away every direct set for Shoulders, Biceps, Triceps and Calves." | (Carried.) It also removes the leg extension and leg curl. | Copy | minor | "and part of: quads, hips". |
| m11 | Thu 45° Hyperextension swaps | (Carried.) Three deadlifts, each "loses the feel of the original implement"; no bridge or hip-thrust swap. | R4-LIB-04 | minor | Fix the reason; add a bridge / hip thrust. |
| m12 | Thu "Step-Up (forward and lateral)" | (Carried.) One item, two directions. | Clarity | minor | "Alternate forward and lateral sets". |
| m13 | "about 10 exercises a session" for an L1, 52 | (Carried.) Top of R5-ATH-07's 5-10; R5-GEN-03 gives general 7 and older adults 6. | R5-ATH-07; R5-GEN-03 | minor (open question) | Ask whether the stay-active default for L1 / 50+ is the mid-range. |
| m14 | Spanish | (Carried.)<br>- "mantiene cuádriceps" (needs "los").<br>- "(Back Extension)" for the 45° hyperextension.<br>- Calves are "talones" (26 times) and "pantorrillas".<br>- "pesas opcionales".<br>- "así que jueves lleva" (needs "el jueves"). | R2-GEN-08; H14 | minor | `model/i18n/es.json`, `tools/compile/es/exercises.mjs`. |

**Count: 0 blockers, 0 majors, 16 minors** (m13 is an open question).

## Fresh checks (as Lalo)

- **His pairing on two full-body days.**
  - Monday: knee lift + pull (seal row, hack squat), then single-leg hinge + press (incline DB, rear-foot-on-wall RDL).
  - Thursday: hip lift + push (flat DB bench, hyperextension), then lunge + pull (single-arm pulldown, step-up).
  - Core comes first, then the jumps and throws, then the power slot.
- **The 2-day band.**
  - Quads are held at 6 for the knee, and the plan says so.
  - Hips run 7 → 8, back 6 → 8, chest 6 → 8, shoulders 6 → 7, calves 6 → 8.
  - The plan suggests a third day.
- **The knee.**
  - Jumps are assisted in block 1 and two-leg and low throughout.
  - Jumps are halved for 3 play days, with no agility drills.
  - The pain scale is printed.
  - The hack squat runs at 2 sets with range stops, and the step-up uses a low step.
  - The leg extension is joint care.
- **The core.** One moving rotation a week for a rotational sport, without low-back pain. This is his "normal core, including rotation".
- **Play days.** Both gym days are at least 48 h before a match day. The Orange run is on Friday.
- **Liability.** The release line prints at the top and bottom in EN and ES. Every exercise has a YouTube search link and a name to copy.

## The one change that lifts it to A

Move the weekly overhead press off the knees (n1) and keep the knee lifts in their higher rep zone (m5). Then give the face pull its proper role (m1) and change one core drill in block 3 (n2).
