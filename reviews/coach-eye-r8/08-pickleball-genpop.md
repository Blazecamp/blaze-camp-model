# Coach-eye review, round 8: 08 Pickleball, gen-pop, 52, knee pain (engine 0.6.0)

**Grade: B+** (same grade, but closer to A-). The round-7 major is fixed the way the review asked. The Friday rear-delt fly is gone (G-221). Shoulders now sit at 6 → 7 on Monday + Thursday, inside the 2-day band and below back, chest and hips. The bad "shoulders ends" line is gone with it.

No group now goes over the band or its cap. The plan reads like his 2-day rule: every big group at about 6-8, quads held for the knee, and the band and the third-day suggestion said up front.

What keeps it at B+ is a long tail of small carried items:
- the face pull's 4 sets from week 1, now the shoulders' only direct exercise and still listed as "easiest to remove";
- the week-11 bunching;
- the pain-knee rep drift;
- the Olympic copy for a plan with no Olympic lift;
- the Spanish slips.

Reviewed: `samples/plans/08-pickleball-genpop.en.md`, `.es.md` and `.json` (engine 0.6.0, model 1.3.0, `validation.ok: true`, warnings `two_day_rule`, `pain_plan`). Intake: `samples/intakes/08-pickleball-genpop.json`. The client is 52, L1, trains Mon / Thu, plays Wed / Sat / Sun, and has mild right-knee pain that is worse with deep knee bends.

Authority used, in order: CH5, R4 and CT-01, then CX, R3, R2, the full answers, chat and the sheets. Also read: DECISIONS G-200..G-225.

Not judged: session length (CT-01). Open questions are rated minor at most: STATUS Q1 / Q5 / Q6 / Q14, G-198, G-199 and G-205.

---

## Round-7 items: status

| R7 # | Issue | Status in r8 |
|---|---|---|
| **M1** | Shoulders 8 → 9, the plan's top group, via a Friday rear-delt fly on top of a training-day band | **Fixed** (G-221).<br>- No Friday fly.<br>- Shoulders `6 6 6 6 · 6 6 6 6 · 6 6 7 7` (JSON 6.25 → 7), final 7, under back 8, chest 8 and hips 8.<br>- No optional-day line and no "Bonus exercise to reach your weekly sets" note.<br>- `meta.stairway.bonus` and `main_bonus` are both empty. |
| m1 | Face pull at 4 sets from week 1, over the day's first lift; listed first as easiest to remove | **Open** (G-224 keeps it on purpose: it holds the band on the training days). Now it is also the shoulders' only direct exercise. See m1. |
| m2 | Week-11 bunching | **Open** (m2). |
| m3 | "shoulders ends" grammar; contradicting fly note | **Fixed / moot.** The line is gone. G-222 changed the template to "the {group} total ends". |
| m4 | Two hard rear-delt days back to back in week 12 | **Fixed** with M1. |
| m5 | Thursday joint-care calf raise missing from the glance row | **Open** (m4). |
| m6 | Arms print 4 against a start of 3 | **Open** (m5). |
| m7 | Hack squat / step-up drift to 8-12 reps | **Open** (m6). |
| m8 | Single-leg hinge steps down the stability ladder | **Open** (m7). |
| m9 | "Receive-Create 3: Repeat" over a single-contact step-up jump | **Open** (m8). |
| m10 | MYO on the joint-care face pull; "day's last" wording | **Open** (m9). |
| m11 | Calves 4 + 2 (G-198) | Open question (m10). |
| m12 | Olympic paragraph with no Olympic lift | **Open** (m11). |
| m13 | "Instead of Mid-Hang Clean Pull, to protect your knee" | **Open** (m12). |
| m14 | Accessories switch-off line leaves out quads / hips | **Open** (m13). |
| m15 | Hyperextension swaps | **Open** (m14). |
| m16 | "Step-Up (forward and lateral)" as one item | **Open** (m15). |
| m17 / m18 | 9-10 exercises a session; back = chest | Open questions (m16, m17). |
| m19 | Spanish slips | Six carried. The r7 new slip ("hombros termina") is gone with the line. One new (m18). |

---

## Problems by severity

### Blockers

None.

### Major

None.

### Minor

| # | Where | Problem | Rule | Severity | Engine fix hint |
|---|---|---|---|---|---|
| m1 | Thu **KB Face Pull 4 4 4 4 · 4 4 4 4 · 4 4 4 4** next to Flat DB Bench `3 ×5, 4 ×7` and the hip lifts at 2. "Easiest to remove" on Thursday: "small-muscle accessories: **KB Face Pull**, Seated Leg Curl, Overhead DB Triceps Extension". | (Carried, now sharper.)<br>- The joint-care accessory holds more sets than the day's first lift in weeks 1-5 and twice the sets of both hip lifts for 10 weeks. It has no set step in 12 weeks.<br>- With the fly gone, it is now the shoulders' **only** direct exercise: 4 of the 6.25-7 shoulder sets. Yet it is listed first as easiest to remove. Removing it leaves the shoulders at about 2-3 sets a week, well under the 6-8 band, and the plan does not say so.<br>- All of it is rear-delt work. Side delts get about 1 set a week of helper credit (R3-VOL-01: spread front / side / rear).<br>- Defensible for a racket shoulder (R3-ATH-02), but on paper it reads backwards. | VOL-07; R4-SES-04 (name what is easiest to remove, truthfully); R4-SES-03 (band); R3-VOL-01 | minor | `week.mjs` easy_to_remove: skip an item that holds a band group's training-day floor, or print "(holds your shoulder sets)". Start the face pull at 3 and step it to 4 at the block-2 change (shoulders 5.25-6.25 → 7, "about 6", said). If a set is spare, alternate the Thursday item by block (face pull → side raise), not a second rear-delt lift. |
| m2 | Totals `36 36 37 37 · 37 38 38 39 · 39 40 43 43`. Week 11 adds three big-group steps at once (hyperextension 2 → 3, pulldown 3 → 4, incline 3 → 4). Hips sit at 7 for weeks 1-10, back at 7 for weeks 3-10, chest at 7 for weeks 6-10. Weeks 7 and 9 add nothing; weeks 8 and 10 only step an arm. | (Carried.) Legal (every step is one set, under the 15 % note; CX-02 allows held weeks), but the plan says "small steps up to week 6, a bit bigger from week 7" and then holds the big groups flat until week 11. | R3-VOL-04; R4-PRG-01; accurate copy | minor | `volume.planStairs`: spread the big groups' last steps (back week 8, chest week 10, hips week 11) before an arm-slot step takes a week. |
| m3 | Fri optional day: **Plank (forearm)** 2 sets + Orange bike 30 min. Line: "This cardio session is part of the plan even if you skip the optional lifting." (ES: "aunque te saltes las pesas opcionales") | **New.**<br>- With the fly gone, the optional day holds no lifting at all, so the line about "the optional lifting" is stale.<br>- The day's only exercise repeats Monday's plank.<br>- His optional day is calves / aerobic / core / Focus. For this client, the listed add-ons are the natural fill: soleus raise, tibialis raise, wrist extension for the paddle elbow, side-lying ER, balance reach. The plan keeps them separate.<br>- Not wrong (the aerobic session is the point), just thin. | `prog_byop_athletic` optional day (OBSERVED); R3-ATH-02 / R3-ATH-05; accurate copy | minor | `render`: print the "skip the optional lifting" line only when the optional day holds a lifting item. Pick a different core drill than the week's other days (e.g. a Pallof hold), and print "optional: core + any of the add-ons above". |
| m4 | "Week 1 at a glance", Thursday: no calves; the table counts only Monday's 4 | (Carried.) The Thursday joint-care calf raise (2 × 12-15) counts for nothing. | R3-ATH-02; R3-SES-01; G-198 (open) | minor | `render.mjs` glance row: list prehab items with their group, marked "(joint care)". |
| m5 | Weekly table: Biceps / Triceps `4 4 4 4 · 4 4 4 4 · 4 4 5 5` against `target_by_group_by_week` 3 in weeks 1-7 | (Carried.) 3.5-3.75 rounds up to 4 against a stairway start of 3. G-212 prints a number under the final as one under it, so the rounding rules still disagree with each other. | Accurate copy (G-203 / G-212) | minor | Round a held arm row the way the stairway start does, or print "4 (2 direct)". |
| m6 | Mon **Hack Squat** 12-15 → 8-12, **Step-Up** 10-12 → 8-12 (weeks 5-12) | (Carried.) Heavier, lower-rep loading moves onto the deep-knee-bend lifts of the painful knee while quads are "held for the knee". | VOL-03; EQ-03; pain plan | minor | `dose.mjs`: keep a pain-flagged pattern in its higher rep zone across blocks. |
| m7 | Thu block 1 → 2: Rear-Foot-on-Wall DB RDL → Staggered-Stance (Kickstand) DB Deadlift | (Carried.) Steps down the stability ladder with no pain reason. | R2-LIB-01; PER-02 | minor | `select.mjs`: never rotate down a rung without a pain reason. |
| m8 | Week 9 "Jumps move to Receive-Create 3: Repeat" over Lateral Box Step-up Jump (2 contacts a leg); ES "Recibir-Crear 3: Repetir" | (Carried.) The stage label promises repeats over a single-contact drill. It is jargon for a 52-year-old recreational player. | R2-ATH-03; accurate copy | minor | `athletic.mjs`: stage 3 picks a low-amplitude lateral repeat, or print plain words. |
| m9 | Week 12 MYO on **KB Face Pull - 1-second squeeze** (joint care, 4 sets) and **Dumbbell Hammer Curl**; line "a MYO set on the day's last small-muscle or machine exercise" | (Carried.) A MYO cluster on the lift labelled "joint care: lower slowly and stay in a pain-free range". Monday's last exercise is the calf raise, not the curl. | G-69; H02; accurate copy | minor | `dose.intensifierEligibleRc`: exclude `prehab` / joint-care items. Words: "the day's last eligible small-muscle exercise". |
| m10 | Calves: Mon Machine Calf Raise 4, Thu joint-care Standing DB Calf Raise 2 | (Carried, open G-198.) His rule is 1 exercise × 3 sets per leg day. | R3-SES-01; G-198 (open) | minor (open question) | None until the coach answers. |
| m11 | "Olympic lifts are for power. Cleans, snatches ..." paragraph; "Power / Olympic lifts" blocks; "4 Olympic-lift sets" in every week header | (Carried.) The plan holds only KB swings. For a gen-pop 52-year-old it is noise, and it invites a lift the filter removed. | Accurate copy; EQ-03 | minor | Print the paragraph only with an Olympic-family item; otherwise count "power (KB swings)". |
| m12 | Mon KB swing: "Instead of Mid-Hang Clean Pull, to protect your knee." | (Carried.) The real filter is age / L1 / 3 play days (EQ-03). A clean pull is not a deep-knee-bend lift. | Honest output (G-94 / G-133) | minor | Key the note from the actual `olympic_safe` reason. |
| m13 | "Switching off the accessories block takes away every direct set for Shoulders, Biceps, Triceps and Calves." | (Carried.) The block also holds the leg extension (2 of 6 quad sets) and the leg curl (2 of 7-8 hip sets), and they are not named. | Accurate copy | minor | Add "and part of: quads, hips" from the groups whose sets drop when the block is off. |
| m14 | Thu 45-Degree Hyperextension swaps | (Carried.) "loses the feel of the original implement" for back extension → DB / KB deadlift. There is no glute bridge or hip thrust swap. | R4-LIB-04 | minor | Swap-reason table: "loses the supported hip extension". Add bridge / hip thrust. |
| m15 | Mon "Step-Up (forward and lateral)" | (Carried.) One item, two directions, no split. | Clarity | minor | "Alternate forward and lateral sets", or two variants by block. |
| m16 | Header "about 9-10 exercises a session" | (Carried, open STATUS Q6.) Above gen-pop 5-7. | R4-SES-02; STATUS Q6 | minor (open question) | None until the coach answers. |
| m17 | Back 6 → 8 = chest 6 → 8 | (Carried, open STATUS Q1 / Q5 / Q14.) Pull = push for a racket player. | STATUS Q1 / Q5 / Q14 | minor (open question) | None until the coach answers. |
| m18 | Spanish (`.es.md`) | Six slips carried:<br>- "mantiene cuádriceps en las mismas series" needs "los cuádriceps".<br>- The bracket "(Back Extension)" does not match the copy name "45-Degree Hyperextension".<br>- "Elevación de talones sentado" sits next to "Elevación de pantorrillas" for the same muscle.<br>- "Aperturas posteriores inclinado" (now only in swaps).<br>- "Cuidado articular de hombros por encima de la cabeza / raqueta".<br>- "Recibir-Crear 3: Repetir".<br>New: "aunque te saltes las pesas opcionales" on a day with no weights (m3). | R2-GEN-08; H14 | minor | `model/i18n/es.json` / `tools/compile/es/exercises.mjs`: add the article, align the bracket term, use one calf term, fix the labels. Key the cardio line on whether the optional day holds lifting. |

**Count: 0 blockers, 0 majors, 18 minors.** m10, m16 and m17 are open coach questions.

---

## Fresh checks

- **His A/B template (R4-SES-05, CH5-02).** Unchanged and right.
  - A day: seal row → hack squat → single-arm pulldown → step-up → hammer curl (slot 5) → leg extension, plus a calf raise.
  - B day: flat DB bench → 45° hyperextension → incline DB press (R4-LIB-03) → single-leg DB hinge → triceps extension (slot 5) → leg curl, plus the face pull and the joint-care calf raise.
  - Core first. Horizontal before vertical. Knee lifts with pulls, hip lifts with pushes.
- **VOL-07.** The seal row takes the back's first step (3 → 4 in week 3), the pulldown its second (week 11). Flat DB bench 3 → 4 (week 6) before the incline (week 11). No later lift out-sets the day's first lift of its group, except the face pull (m1).
- **2-day rule (R4-SES-03).** Quads 6 (held for the knee, said). Hips 7 → 8, back 6 → 8, chest 6 → 8, shoulders 6 → 7. The band is said, with a third-day suggestion. No group is over 8 or under 6.
- **Bonus rule (G-217 / G-218 / G-221).** No bonus exercise anywhere. The training days hold every group inside the band, so none is needed (CH5-03 "if needed").
- **Stairway.** Totals 36 → 43. The largest weekly rise is 7.5 %, and every group step is one set (no 15 % note required, `note_min_whole_sets`). The groups arrive in week 11 and hold in week 12. Effort 3 → 2 → 1-2 → 1 RIR + MYO.
- **Knee and older-player care.** The hack squat runs at 2 sets with range stops. The step is low, the leg extension is joint care, and landings use a low box. Jumps are halved for 3 play days, with no agility drills. KB swings only. The gym is 48 h from the play days. The Orange bike session sits inside "max 40 min of steady".
- **Liability (R4-SCP-01 / 02).** The release line is at the top and the bottom in EN and ES. Each exercise has a YouTube search link with a name to copy.

## What Lalo would like

- The fix did exactly what was asked: shoulders back inside the band, no rear-delt pile-up, no extra exercise.
- A beginner's 2-day week that reads simple: 6-8 for every big group, quads protected and said, arms in their slot at 2-3 sets.
- The plan is honest: nothing up front promises more than the days hold.

## The one change that lifts it

Make the face pull's job visible and correct: 3 → 4 sets across the block, not "easiest to remove", with a note that it holds the shoulder sets (m1). Then fix the stale Friday line (m3) and the knee rep drift (m6). After those, this is an A-.
