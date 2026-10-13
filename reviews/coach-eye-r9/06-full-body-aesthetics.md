# Coach-eye review, round 9: 06 Full-body aesthetics (L3, 4 days A / B + 2 optional, Focus glutes + side delts; engine 0.7.0)

**Grade: A-** (coach's round-5 grade: B+; target reached). His one note on this plan was "make the core work optional, everything should be adjustable". It is done:
- every core block reads "Core (optional: you may switch it off or change it)";
- "How to adjust" says the core is optional and everything is adjustable.

Two round-5 decisions also improved the numbers:
- **Chest reaches its final 25 (R5-VOL-07).** It was held at 23. A pec deck comes on Friday from week 9, and a light flat DB fly on Wednesday's optional day in weeks 11-12, the day after the bench.
- **Advanced physique starts (R5-VOL-08).** Focus glutes start at 22 and the other groups at 16.

What remains is the carried list of small selection and copy items. The biggest is an open question: the arms are held at 18 / 20 of 25. Nothing here would stop Lalo from handing it out.

Reviewed: `samples/plans/06-full-body-aesthetics.en.md` and `.json` (engine 0.7.0, model 1.3.0, `validation.ok: true`, warnings `capped_by_template` biceps 18 / 25 and triceps 20 / 25), plus `samples/intakes/06-full-body-aesthetics.json`. There is no Spanish file.

Not judged: session length (CT-01).

---

## Round-5 answers that touch this plan

| Answer | What the plan does | Status |
|---|---|---|
| R5-GRD-06: core optional, everything adjustable | The heading on every day, plus the adjust line. The engine still builds the core first and never drops it (H05). | Applied |
| R5-VOL-07: light chest exercise on the optional day after a press day | Wed **Flat DB Fly** 2 sets in weeks 11-12 (the day after Tuesday's bench). Fri **Machine Fly (Pec Deck)** 2 → 3 from week 9. Chest `16 … 22 23 25 25`, final 25. Said up front ("Chest: 5 of its 25 final sets sit on bonus exercises ..."). | Applied |
| R5-VOL-08: advanced physique, Focus 22, others 16 | Hips (Focus) start at 22; quads, back and chest at 16. Shoulders start at 19 (side delts are the Focus; the group counts front, side and rear). | Applied |
| R5-VOL-03: side delts ≥ 8 direct (advanced) | Tue Seated DB Lateral Raise 2 → 4, Fri Cable Side Raise 2 → 4, Sat Side-Lying Cable Raise 2 → 3, Sat DB Upright Row 2. That is 8 → 13. | Applied |
| R5-VOL-04: one biceps and one triceps exercise on A / B days | Mon Spider Curl, Thu Concentration Curl, Tue Skullcrusher, Fri Pushdown, plus optional-day and bonus arm work. | Applied |
| R5-VOL-05: A day calves 7th, rear delts 8th; B day side delts 7th, calves 8th | A days: as he says. B days: the side raise moves to the front (it is a Focus, ORD-04), and B days hold no calf raise (m6). | Mostly |
| R5-VOL-02: pull ≥ press | Back 16 → 25, chest 16 → 25. | Applied |
| R5-CLS-07 / CH5-03 | Every group climbs. Back and chest take optional-day or bonus work to reach 25, and every group stays under 35. | Applied |

## Round-8 items: status

| R8 # | Status in r9 |
|---|---|
| m1 optional-day row opens before the pulldowns reach 5 | **Fixed**: the Wed machine row now opens in week 7; both pulldowns reach 5 in week 5. |
| m2 optional-day bonus curl 4 sets while the main curls hold 3 | **Open** (m1). |
| m3 A-day rear-delt flies printed as "Bonus exercise to reach your weekly sets" | **Open** (m2). |
| m4 no two-arm standard pulldown / pull-up on the A days | **Open** (m3). |
| m5 no overhead press in 12 weeks | **Open** (m4). |
| m6 twin pushdowns / close-grip incline on a two-triceps day | **Open** (m5). |
| m7 Focus 1 (glutes) never opens a session | **Open** (m7). |
| m8 Copenhagen before the front squat; hanging drill before the bench | **Open** (m8). |
| m9 bent-over row the day before the hex-bar deadlift | **Open** (m9). |
| m10 MYO "about 15 reps" on 20-30-rep reverse flies | **Open** (m10). |
| m11 quarter-set overshoot | **Open** (m11). |
| m12 optional days split by Focus | **Open** (m12). |
| m13 calf duplicates | **Open** (m13). |
| m14 body-weight-first cue on an L3 plan | **Open** (m14). |
| m15 per-session volume (G-119) | Open question (m15). |
| m16 inference text in an id | **Open** (m16). |
| m17 arms 18 / 20 of 25 | Open question (m17); chest now closed. |

---

## Problems

### Blockers

None.

### Major

None.

### Minor

| # | Where | Problem | Rule | Severity | Engine fix hint |
|---|---|---|---|---|---|
| m1 | Wed **Supine (Lying) Biceps Curl** `3 4 4 4 · 4 ×8` vs Mon Spider Curl `3 ×7, 4 ×5`, Thu Concentration Curl `3 ×10, 4 4` | (Carried.) The optional-day curl is the week's biggest biceps exercise from week 2. | VOL-07; R3-VOL-03 | minor | An optional-day bonus never holds more sets than the training days' lift of its group. |
| m2 | Mon Seated Reverse Fly / Thu Rear-Delt Pec Deck: "Bonus exercise to reach your weekly sets"; listed under "bonus exercises" in easiest to remove | (Carried.) These are his A-day 8th station (rear delts, R5-VOL-05), not bonuses. | R5-VOL-05; R4-SES-04 | minor | Give `template_extra_station` items the template note and the small-muscle label. |
| m3 | Mon Single-Arm Lat Pulldown, Thu Rope Pulldown | (Carried.) No two-arm standard pulldown or pull-up on an A day for an advanced full-gym client. | R4-SES-05 slot 3 | minor | Prefer a two-arm vertical pull in one of the two A-day slots. |
| m4 | B-day slot 3, 12 weeks | (Carried.) No overhead press at all. R5-ATH-04 asks to keep some overhead work for health and range, even with incline first. | R4-LIB-03; R5-ATH-04 spirit | minor | One block of one B day takes a seated DB shoulder press, or the overhead keeper of G-252 for physique plans. |
| m5 | Tue Skullcrusher + Cable Pushdown (bonus, supinated); Fri Pushdown (pronated); Sat Overhead Cable Extension | (Carried.) Two near-identical pushdowns a week. | Variety | minor | The triceps bonus picks a different action (overhead or dip). |
| m6 | B days: no calf raise | **New reading.** R5-VOL-05 confirms "B day: side delts 7th, calves 8th". Here the calves sit on the A days and the optional days (10 → 12). The total is fine; the B-day place is not his. | R5-VOL-05; R3-SES-01 | minor | Move one optional-day calf raise to a B day's 8th place. |
| m7 | Tue / Fri: the side raise opens the strength block | (Carried.) Focus 2 (side delts) opens both B days; Focus 1 (glutes) never opens a session. | ORD-04 | minor | Focus 1 takes the first place on one B day. |
| m8 | Mon core Copenhagen Plank before the front squat; Tue hanging drill before the bench | (Carried.) | ATH-11; R2-SES-03 | minor | A plank or dead bug on the counted-squat day. |
| m9 | Thu Bent-Over Barbell Row → Yates row, the day before Fri Hex Bar Deadlift | (Carried.) Erector fatigue on the eve of the counted hinge. | PER-04 | minor | A supported row before the counted-hinge day. |
| m10 | Week 12 MYO on the 20-30-rep reverse flies; "about 15 reps" | (Carried.) | VOL-15 | minor | Scale the activation set to the item's range. |
| m11 | `realized_top` hips and shoulders 27.25 vs 27 | (Carried.) | R4-PRG-04 | minor | Count helper credit before the last step. |
| m12 | Wed = glutes × 2, Sat = side delts × 2 | (Carried.) His sheet puts Focus 1 and Focus 2 on each optional day. | OBSERVED BYOP AESTHETICS | minor | One of each Focus per optional day. |
| m13 | Block-3 calves: Mon and Sat both "Machine Calf Raise - 1-second squeeze at the top" | (Carried.) | PER-02 | minor | No two items of a week share exercise + detail. |
| m14 | "Hold dumbbells ... once your body weight is easy" on the lunges | (Carried.) A beginner cue on an L3 plan. | GEN-01 | minor | Only at L1. |
| m15 | Main days about 25 / 23 / 23 / 21 sets in week 1, 31-33 in week 12 | (Carried, G-119.) | VOL-08 | minor (open) | Ask. |
| m16 | `alternating-db-deadlift-...-meaning-infer` | (Carried.) | Data hygiene | minor | Rename. |
| m17 | "Biceps: this template holds 18 ... below the planned 25"; "Triceps: 20 ... 25" | (Carried, open G-199.) CH5-03's reading says "no group is capped below its planned final sets by the template", while the bonus rule still caps the small groups at 3 bonuses. Five lines up front about arms, back and chest is a lot of reading. | CH5-03; G-199 | minor (open question) | Ask whether the arms may take one more bonus each; merge the "held" and "bonus" lines per group. |
| m18 | Wed optional day "Easiest to remove: small-muscle accessories: ... Reverse Hyperextension, Hip Thrust (machine)" | **New, small.** The glute Focus work is called small-muscle accessories. | R4-SES-04 | minor | Label Focus items "Focus work". |

**Count: 0 blockers, 0 majors, 18 minors** (m15 and m17 are open questions).

## Fresh checks (as Lalo)

- **His A / B skeleton** (R4-SES-05).
  - A1: seal row, front squat, single-arm pulldown, RFE lunge, curl, leg extension, calf, rear delt.
  - B1: bench, hip thrust, incline, single-leg hinge, triceps, leg curl, plus the side raise as Focus.
  - A2 and B2 mirror them.
- **Order.** Core comes first. Horizontal before vertical. Knee lifts with pulls, hip lifts with pushes. Spine days: front squat on Monday, hex bar on Friday.
- **Stairway.** 110 → 156 sets. No group step is over 15 %. The groups arrive in weeks 11-12. RIR goes 3 → 1, with MYO on the last isolation item of week 12.
- **Honesty.** Every bonus and optional-day share is said up front with its week.

## The one change that lifts it to A

Label the A-day rear-delt station as his template (m2). Keep the optional-day curl at or under the main curls (m1). Then ask the arms question (m17).
