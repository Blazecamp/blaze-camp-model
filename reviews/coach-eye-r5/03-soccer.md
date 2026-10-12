# Coach-eye review, round 5: 03 Soccer (semi-pro midfielder, 3 days, 8 weeks, ES)

**Grade: B+.** Only small tweaks are left. I would hand this to the player after a quick copy pass. All three round-4 majors are fixed:
- Practices are handled as CH5-01 asks: one line, and the athlete adjusts.
- No hard intervals fall the day before Friday's sprints.
- Chest stops at 11.
- The jump menu is now mostly single-leg, with lateral work.
- Slot 5 (curl on A, Tate press on B) is in, as CH5-02 asks.

What remains is copy and a handful of carried-over minors. The one a coach would catch first: the plan says biceps and triceps have "no exercise of its own" in the same plan that prints a curl and a Tate press every week.

Files reviewed:
- `samples/plans/03-soccer.en.md`, `.es.md` and `.json` (engine 0.6.0, model 1.3.0, validation ok)
- intake `samples/intakes/03-soccer.json`

Checked against:
- CH5-01..03, R4-SES-02/04/05, R4-PRG-01..04, R4-LIB-01..05, R4-SCP-01/02, CT-01, CX-01..04
- R3-SES-01, R3-VOL-01, R3-ATH-04, R2-ATH-01..07, R2-PER-06/07, R2-LIB-01, R2-GEN-08
- the `soccer` profile in `synthesis/04_profiles.json` and `model/templates.json > athletic.3`
- his athletic sheet (`analysis/programs/prog_byop_athletic.md`)
- `engine/DECISIONS.md` G-112, G-132, G-136, G-197..G-199

I did not judge session length (CT-01). STATUS open questions 2, 3 and 11 and the G-119 / G-139 open items are raised as minors at most.

## Round-4 majors: status

| R4 # | Status | What the plan does now |
|---|---|---|
| M1 practices / hard eve | **Fixed** (by CH5-01 + G-197 / G-136) | "This plan does not count your 2 team practices a week: take them into account and adjust the load yourself" (EN line 20, ES line 20). No practice days are built in, which is CH5-01's reading. Aerobic: Tue Green, Wed Orange (after the lift), Thu Orange, Sat Blue. Thursday is easy now, so nothing hard sits the day before Friday's max-velocity sprints and hex-bar deadlift. Blue is on Saturday, with Sunday off before Monday. 4 sessions off-season and 2 pre-season (R2-ATH-06). |
| M2 pressing over legs | **Fixed in the main** (G-112). The 4-set flat bench remains (G-119 open item 4; see m4) | Chest 10 → 11 (was 10 → 14). Flat pressing in week 6 is 8 sets (was 10). Front squat 3 → 4, hex bar 2 → 4. Shoulders end at the floor + about 1.75. |
| M3 jump menu | **Fixed** (G-132) | Single-leg forward hurdle hops (Mon), single-leg broad jump (Wed) and lateral box step-up jump per leg (Fri, wks 2-5) from week 1. Pre-season adds single-leg lateral hurdle hops. Week 2: about 74 of 89 jump contacts are single-leg, and the lateral share is about 40 %. |

## Blockers

None.

## Major

None.

## Minor

| # | Where | Problem | Rule | Severity | Engine fix hint |
|---|---|---|---|---|---|
| m1 | "Before you start" line 2; weekly tables (Biceps / Triceps "- (5)", "no exercise of its own"); "How to adjust": "Switching off the accessories block takes away every direct set for Biceps, Triceps and Calves" | **The copy contradicts the plan.** Monday prints a 2-set DB curl and Wednesday a 2-set Tate press every week (CH5-02 slot 5), and "Week 1 at a glance" lists "Biceps 1" and "Triceps 1". Yet the plan says the arms are "trained through your sport work and compound lifts (no extra sets)" and have no exercise of their own. A player would ask which is true. Same in ES. | CH5-02; R4-SES-05; R3-VOL-01 (arms stay helper work in the stairway); H14 | minor (the most visible one) | `render.mjs` notices / weekly table: when a credit-only group has a slot-5 station (`why.arm_slot`), print "2 sets of its own, held level (not part of the stairway)" instead of "-" and "no exercise of its own". Drop the `credit_only_groups` "no extra sets" line for those groups. Test on 03 EN + ES. |
| m2 | Weekly table, Shoulders | The week columns read 10 10 10 10 **12 12** but "Final sets" reads **11**. Realized is 11.5 / 11.75 against a planned top of 11 (`meta.stairway.realized_top.shoulders` 11.75), so the group runs above its planned final sets from week 5. Small, but the table looks wrong. | R4-PRG-01; H10 | minor | `volume.planWeeklySets`: cap helper overflow at `planned_top` + 0.5, or print the final column from `realized_top` with the same rounding as the week columns. |
| m3 | Wednesday Nordic; Monday Copenhagen | The Copenhagen is now in every Monday core block (good). The Nordic, the profile's top injury-prevention lift ("Nordic 2x/week"), is still trained once a week. It is still listed under "easiest to remove", and its progression line still says "add weight next time" for a bodyweight eccentric at 6-8 reps from week 1. | Soccer profile `priorities` (INFERRED); R4-SES-04; R4-PRG-03 | minor | Carried over from r4 m2/m3: a `never_easy_to_remove` list read from `profile.priorities`, and a bodyweight-eccentric progression variant (slower lowering / more range / reps, then load; start at 3-5 reps) in `prescription.mjs`. |
| m4 | Friday Barbell bench 4 4 4 4 4 4 vs Hex bar 2 3 3 3 3 4 | The week's only heavy hinge starts at 2 working sets on the day the bench starts at 4. For a midfielder the leg lift should never trail the press. The bench at a flat 4 sets is the engine's athlete number (G-101), listed in G-119 as open for the coach. | G-119 items (4)/(5) (open); soccer profile `resistance.avoid` | minor (open item) | When the coach answers G-119: in `volume.planWeeklySets`, give the day's axial `work` lift placement before `paired_upper` for the athletic family, so the hex bar is at least as high as the bench in each week. |
| m5 | Leg extension, curl, Tate press, lateral raise, weeks 4-6 | The rep bracket changes inside the block (10-12 → 8-12 or 10-15), which breaks the person's own "start again at 10" rule. | R4-PRG-03 | minor | Carried over from r4 m4: `dose.mjs` keeps an exercise's bracket fixed within an exercise block. |
| m6 | Week 6 (end-test week) | Hang clean 3 → 2 sets, DB snatch 3 → 2 and sprints 440 → 120 m, in the week the lifting peaks. The tests now sit right after core, before the jumps (good: tested fresh). | R2-PER-07; H21 | minor | Carried over from r4 m9: hold the Olympic sets in the end-test week (`generate.mjs`). Only the tested station gives way. |
| m7 | Weeks 1-6 plyo share line | 64 → 53 → 57 → 60 → 60 → 64 %: it does not start more ballistic and end more plyometric. | R2-ATH-01; G-139 (open) | minor (open item) | Carried over from r4 m5: `athletic.mjs` drives station choice from `plyo_share.start/end` per week. |
| m8 | Monday single-leg forward hurdle hops, weeks 1-6 | The week says "Receive-Create 2: Land & Go", but this drill is cued "quick, continuous contacts: stay springy", which is a Repeat (stage 3) cue. That is continuous single-leg reactive work from week 1 for an L2. The single-leg broad jump next to it has the right Land & Go cue. | R2-ATH-03; CAT-10; G-132 | minor | `dose.mjs` / `athletic.mjs`: in a Land & Go week, a single-leg hop takes the stage's "stick, then go" cue and a reset between reps. Keep continuous single-leg hurdle hops for the Repeat block (the pre-season already has them). |
| m9 | Wed + Thu aerobic | Two identical Orange runs on back-to-back days: 30 → 40 min after the week's biggest session (13 entries), then the same run the next day. Nothing is broken, but a coach would split the two (e.g. Thu Green, or let the person move Wednesday's run to Sunday). | R2-ATH-06; R3-ATH-04 | minor | `week.aerobicPlan`: never place the same colour on consecutive days when another colour or a free day exists. |
| m10 | Wednesday order | The bonus lateral raise still prints after the calf raise. His B day puts the shoulder work right after the leg curl. | OBSERVED BYOP athletic B day | minor | Carried over from r4 m6: `week.mjs` orders shoulder isolation before calves unless calves are a Focus muscle. |
| m11 | Pre-season Monday | The hang power clean becomes a low-hang clean pull: the position changes and the catch is dropped. That is two details, in a "more speed and power" block. | R2-LIB-01; G-134 | minor | Carried over from r4 m8: keep the lift and change one detail (e.g. mid-hang power clean). |
| m12 | Calves weeks 1-3 | Calves are 9 9 9, under the floor of 10, because the per-leg-day rule (3 × 3) sets them. R3-SES-01 is the newer rule, so this is for discussion, not a fix. | R3-SES-01 vs R2-VOL-06 / H17 | minor | None until the coach says which wins for calves. Print the reason in the plan ("calves: one exercise x 3 sets per leg day"). |
| m13 | Step-up, RFE, side lunge | The load cue is always "hold dumbbells at your sides". A COD athlete gets no contralateral (one-dumbbell, opposite-hand) option. | CAT-13 | minor | Carried over from r4 m7: a contralateral load cue for `field_court` single-leg knee lifts in `dose.mjs` notes. |
| m14 | "Before you start", two-leg line (50 % vs the guide's 20 %); core block (no anti-rotation drill: the Russian twist rotates) | Noted only. | STATUS open Q2, Q11 | minor (open) | n/a until he answers. |
| m15 | Spanish | Mostly clean, natural Latin American Spanish, with the English terms in brackets and the release line and copy-name line right. Carried over: "Prueba L de tres conos (L-Drill)" names the training drill as a test. "Pantorrillas" and "talones" are both used. "Pierde la sensación del implemento original" is a calque. One bracket term covers different drills: "(Ankle Hops)" for in-place and forward/backward, "(Single-Arm Cable Row)", "(Seal DB Row)" for both grips, "(Lat Pulldown)", "(Lateral Plate Hops)". New: "Aperturas posteriores inclinado" reads oddly; "con el torso inclinado" is better. For a soccer player "entrenamientos de equipo" is more neutral than "prácticas de equipo". | R2-GEN-08 | minor | `tools/compile/es/exercises.mjs` and the swap-note and words tables: "Drill en L (L-Drill)", one calf term, "pierde el implemento original", distinct bracket names, "con el torso inclinado", "entrenamientos de equipo". |

Count: 0 blockers, 0 majors, 15 minors.

## What is right (praise)

- **His A / B skeleton, slot for slot.**
  - Monday A: core → jumps / COD → hang power clean → two-arm seal row → front squat → pull-up → step-up → **DB curl** → leg extension → calves.
  - Wednesday B: core → acceleration / jumps / throw → flat DB press → 45° hip extension (no spine load) → incline press (incline before overhead, R4-LIB-03) → staggered single-leg deadlift → **Tate press** → Nordic as the leg-curl slot.
  - Friday follows his builder's day 3: snatch → bench + hex bar → one-arm row + RFE → side lunge + one-arm pulldown → calves.
- **Order and pairing:** core first, power before strength, horizontal before vertical, knee with pull and hip with push, every day.
- **Spine days:** the heavy squat is on Monday and the heavy hinge on Friday. Wednesday's hinge is a hip extension. The clean is on the squat day and the snatch on the hinge day (R2-ATH-04). The DB snatch ramps 8/8 → 6/6 → 4/4 (R2-ATH-05).
- **Exercise count:** 10-12 counted exercises a day plus 2 core. The ankle hops sit outside the count (E-108), inside R4-SES-02's "up to 12". The easiest-to-remove lists name the extra stations and accessories, never a main lift or core (R4-SES-04).
- **Weekly sets:** every group but calves (m12) is at or above 10 from week 1. Quads and hips go 11 → 16, back 10 → 14, chest 10 → 11. Each reaches its final sets in week 6 (chest and shoulders in week 5, which is allowed). The largest step is hips +14 % in week 6, under the 15 % note line, and no group is near 35 (CH5-03 not triggered). The pre-season holds about 58 % of the last off-season week's sets (R2-PER-06).
- **Pre-season is "more speed and power":** 110 jump contacts, 108 cuts, 440 m of sprints, 6 Olympic sets and Receive-Create 3 (Repeat), at the off-season peak. This fixes the old review-r2f2 TODO.
- **Athletic doses** are inside the 3-day scaled profile: 53-110 jumps, 54-108 cuts, 180-440 m of sprints, max velocity once a week, accelerations on Wednesday, 20-32 rotational throws and an 8-10 lb ball. The reaction drill is an optional add-on only (R4-LIB-01).
- **Progression is a rule** the person applies (R4-PRG-03), with the next-block line (R4-PRG-04) and the editable-template lines (CX-02 / CX-04). Effort goes 3 → 2 → 1-2 → 1 RIR, plus MYO on the leg extension and the lateral raise in week 6.
- **Block-2 changes are one-detail variations** (except m11): neutral-grip DB press, one-leg leg extension, kickstand deadlift, paused side lunge, squeeze-at-the-top row and calves.
- **Liability:** the release line is at the top and bottom in EN and ES. Every swap says what it keeps and what it loses, there are YouTube search links with a copy-name line, and no link appears on the aerobic colours. The r4 copy minors (heading, range header, per-leg wording) are fixed.
- No session-length fitting anywhere (CT-01).
