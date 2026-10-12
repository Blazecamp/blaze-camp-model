# Coach-eye review, round 5: sample 07, Push / Pull / Legs (6 days, advanced, full gym, 12 weeks)

**Grade: B+.** Lalo would hand this out today. Both round-4 majors are fixed. Biceps now reach their planned final sets through a bonus curl on a pull day, and the Tuesday one-arm row stays a one-arm row, so the week no longer has two seal rows. What is left is a list of small tweaks. The two most visible are a weak bonus pick (a TRX curl for an advanced lifter in a full gym) and leftovers from round 4: Saturday's flipped lead lift is not explained, calves sit under 10 sets with no reason given, and the staggered-stance DB deadlift appears twice a week.

Files reviewed: `samples/plans/07-push-pull-legs.en.md` and `.json` (engine 0.6.0, model 1.3.0; there is still no `.es.md`). Intake: `samples/intakes/07-push-pull-legs.json`. The client is 24, with 4 years of training (L3). Goal muscle, Focus chest and back, `lift_style: heavy_powerlifting`, Mon-Sat, FULL_GYM, fixed 12 weeks, strength tests.

Authority used: CH5 + R4 + CT-01 > CX > R3 > R2 > full > chat > sheets. Session length was not judged (CT-01). These open coach questions are rated minor at most: STATUS Q1 (high-incline credit), Q5 / Q14 (pull vs push), Q7 (side delts on physique plans), DECISIONS G-119 / G-199 open items, and E-139 (calves, "07 minor, open").

## Round-4 majors: are they fixed?

| R4 # | Status | Evidence |
|---|---|---|
| M1 Biceps stop at 22 of 25, hidden | **Fixed** | A bonus curl now sits on Tuesday (`Tue.Pull.x01`, origin `bonus`, 2 → 3 sets) as the 8th exercise of a pull day, which is inside 6-8. Biceps run 15.5 → 25.75, `capped: []`, `shortfalls: []`, `realized_arrival_week.biceps: 11`. `target_by_group` keeps the planned 25. This matches VOL-07 ("more bicep ... as a bonus exercise") and CH5-03 / G-199. The pick itself is weak (m8). |
| M2 Tue one-arm row → DB seal row (not one detail; two seal rows a week) | **Fixed** | `Tue.Pull.s06` is the Single-Arm DB/KB Row in all 12 weeks. Tuesday keeps BB row + one-arm row + pulldown. The only seal row in the week is Friday's barbell one. The smaller round-4 cases are gone too: Friday's one-arm pulldown no longer becomes a rope pulldown, and Saturday's split squat becomes a rear-foot-against-wall split squat (one detail) instead of a deficit reverse lunge. |

Round-4 minors: m8 (block changes now named day by day in "What changes this week") and m9 (no YouTube link on aerobic colours) are **fixed**. m3 is **partly fixed**: Wednesday's single-leg hinge changes in block 3. m1, m2, m4, m5, m6, m7, m10 and m11 are **still open** and are carried below.

## What the plan does (week 1)

| Day | His sheet slot order | Sample 07 (week 1 picks) | Count |
|---|---|---|---|
| Mon Push | H-push, V-push, Incline, Flies, Dips, Tri push, Tri overhead | Bench (test + 2), high-incline seated BB press, incline DB press, flat DB fly, weighted dip, reverse-grip pushdown, OH DB extension + bonus leaning cable side raise | 8 |
| Tue Pull | H-pull, H-pull, V-pull, ABduction, Reverse fly, Bicep, Bicep | BB bent-over row 4-6, 1-arm DB row, supinated pulldown, seated DB lateral, seated reverse fly, incline curl, concentration curl + **bonus TRX curl** | 8 |
| Wed Legs 1 | BKD, BHD, UKD, Leg ext, Leg curl, UHD, Focus | High-bar squat (test + 3), hip thrust, forward lunge, leg ext, lying curl, staggered DB DL, machine calf raise | 7 |
| Thu Push | (= Mon) | Flat DB bench 4-6, high-incline seated DB press, incline BB bench, pec deck, PB dip, pushdown, OH cable extension | 7 |
| Fri Pull | (= Tue) | BB seal row, 1-arm cable row, 1-arm pulldown, side-lying cable lateral, rear-delt machine, supine curl, cable curl | 7 |
| Sat Legs 2 | (= Wed) | Deadlift (test + 2) **first**, then leg press, FFE/RFE split squat, leg ext (one leg), seated curl, alternating staggered SL DL, standing DB calf raise | 7 |

Every day opens with 2 core exercises x 2 sets. Weekly sets by group, week 1 → week 12 (planned final in brackets):

- quads 20 → 25 (25), hips 20.5 → 25.25 (25), back (Focus) 22 → 27 (27), chest (Focus) 22 → 27.5 (27)
- shoulders 23 → 25.5 (25), biceps 15.5 → 25.75 (25), triceps 15 → 25 (25), calves 6 → 10 (10)
- total 122 → 164, largest weekly total rise 4.5%, no group above 35

All groups except shoulders arrive in week 11 and hold in week 12; shoulders reach 25 in week 10. Effort runs 3 RIR (weeks 1-6), then 2 (weeks 7-9), then 1-2 (weeks 10-11), then 1 RIR plus a MYO set in week 12.

## Problems

### Blockers

None.

### Major

None.

### Minor

| # | Where | Problem | Rule | Engine fix hint |
|---|---|---|---|---|
| m1 | Calves, weeks 1-10 (carried from R4 m1) | Calves are a trained group (one calf raise each leg day) and sit at 6-9 weekly sets for 10 weeks, under the floor of 10. The plan still says nothing about it. E-196 planned a line ("below 10 sets - the rule is one exercise each leg day"), and it is not printed. `targets.calves_floor` is 6, while E-05's own formula gives 7 for 2 leg days (max(6, min(10, 4x2-1))). The template can clearly hold 10, because weeks 11-12 run 5 + 5. | CT-01 / R2-VOL-06 floor of 10; H17 ("named in the plan, never hidden"); R3-SES-01 (1 x 3 per leg day); E-139 open | `engine/render.mjs`: print the E-196 calves line whenever `sets_by_group.calves < 10`. Check `volume.calvesFloor` against E-05 (7 for 2 leg days). Keep the 10-from-week-1 question in the STATUS open list. |
| m2 | Sat Legs 2 order and title (carried from R4 m2) | The deadlift (BHD) is slot 1 and the leg press (BKD) slot 2. His sheet runs BKD → BHD. Putting the heavy, tested axial lift first is defensible, but no line says why, and the title "Legs 2 - hinge-led (leg press)" still reads oddly. | Sheet slot order (V30 / R4-SES-05 spirit); ORD-02 | `engine/week.mjs`: emit a `why` when the axial lead flips the order ("The deadlift goes first today: it is the week's heavy hinge"). `render.mjs`: drop "(leg press)" from the day label. |
| m3 | Wed `s10` / Sat `s10`, weeks 1-8 (R4 m3, partly fixed) | Wednesday's Staggered-Stance DB Deadlift and Saturday's Alternating Staggered-Stance Single-Leg DB Deadlift are the same lift twice a week for 8 weeks. Wednesday changes to a rear-foot-on-wall RDL only in block 3. Saturday's never changes in 12 weeks. | PER-04 (second exposure is a different exercise) | `select.mjs` week-family check: treat `staggered-stance` records as one family from week 1. Give Saturday a single-leg hip thrust, a single-leg back extension or a single-leg RDL. |
| m4 | Thu Push; side delts (carried from R4 m4) | Thursday has no side raise. Side delts hold 8 direct sets, flat for 12 weeks, while shoulders rise on press credit and reach 25 in week 10, two weeks before the end (H10 allows one). This matches his sheet (delt raises on pull days) and sits inside open Q1 / Q7. | Open Q1, Q7; R4-PRG-01 | Leave it until Q1 / Q7 are answered. Then step the side raise to 3 sets in block 3, or let the bonus alternate Mon / Thu. |
| m5 | Sessions, weeks 11-12 (carried from R4 m5, slightly worse) | Working sets per day (core excluded): Mon 28, **Tue 30**, Wed 29, Thu 24, Fri 26, Sat 27. The new bonus curl made Tuesday the heaviest day and widened the Tue / Fri gap (30 vs 26). That is far above his observed 14-21 per session. It is the arithmetic of the approved L3 targets, and this is about fatigue, not time. | VOL-08 (observed); R3-VOL-03 (keep both exposures even) | Optional: alternate the biceps bonus's added sets with Friday's curls (R3-VOL-03), or once a compound reaches 4 sets send the next set to the bonus instead of a 5th compound set. |
| m6 | Tue / Wed / Sat core openers (carried from R4 m6) | Hanging rotational knee raises open Tuesday (before a 4-6 rep barbell row: grip) and Wednesday (before a squat test). A V-up + Russian twist opens Saturday before a 1RM deadlift test. They are dosed "easy", but flexion and hanging work are not his first pick before a max pull. | R2-SES-03 (light opener) | `select.mjs` core opener: on a day with a test or a heavy axial / grip-limited first lift, prefer anti-extension and side planks. |
| m7 | Thu `s05` (carried from R4 m7) | Flat DB bench at 4-6 reps for a `heavy_powerlifting` client. Heavy dumbbells at 4-6 are awkward to get into position. A paused or close-grip barbell bench, or a machine press, fits his strength style better as the second flat exposure. | F10 heavy_powerlifting; PER-04 | `select.mjs`: for this style, prefer barbell / machine records in a 4-6 bracket slot over DB records. |
| m8 | Tue `x01`, the new bonus (new) | The bonus that fixes M1 is a **Suspension-Trainer (TRX) Biceps Curl**: `level: foundational`, `load_ceiling: low`, a body-weight curl. That is a poor fit for an advanced 195-lb lifter in a full gym with a heavy style. It also makes three curls on Tuesday, all at 15-20 reps. All four of its swap lines read "loses the feel of the original implement", which says nothing (R4-LIB-04). Lalo would give a barbell / EZ-bar curl or a preacher curl. | F10 heavy_powerlifting; level ladder (advanced); R4-LIB-04; R4-LIB-01 spirit (template picks are his mainstream lifts) | `volume.mjs` `openBonus` / `select.mjs`: rank bonus candidates by `load_ceiling` and the client's ladder, and avoid `trx` / body-weight records when the kit has a barbell or cable. Prefer a different rep bracket from the day's other curls (e.g. 8-12 heavy curl). Give the swap-note builder real "loses" text for same-group isolation swaps. |
| m9 | Fri `s10`, block 3 (new) | "Supine (Lying) Biceps Curl → Seated Dumbbell Curl" changes body position and support (lying → seated). That is a new exercise, not one detail. It is small (same group, same laterality, same kit), but it is the only block change in this plan that is not a single detail. | R2-LIB-01; PER-02 | `select.mjs` B3 history path: prefer a `variation_axes` detail on the same record (pause at the top, grip) before a new record. |
| m10 | Mon `x01` / Fri `s08`; block variation on the back (new) | The two cable lateral raises swap days between blocks: leaning on Monday and side-lying on Friday become side-lying on Monday and leaning on Friday. The week holds the same two exercises in all 12 weeks, yet each counts as a "change" in "What changes this week". Also, back is a Focus muscle, and 6 of its 7 lifts never vary in 12 weeks (Tuesday BB row and 1-arm row; Friday seal row, 1-arm cable row and 1-arm pulldown). Only Tuesday's pulldown changes. Variation is a "may", not a must, so this is cosmetic. | PER-02 / R2-LIB-01 (one or two details between blocks) | `select.mjs`: do not count a cross-day record swap as a block change. Give the Focus group's second-exposure lifts one detail (grip / pause) per block. |
| m11 | Weekly tables vs "Final sets" (new) | Rounded week-12 numbers print above the planned final: chest 28 vs 27, biceps 26 vs 25, shoulders 26 vs 25. `realized_top` is 27.5 / 25.75 / 25.5 against `planned_top` 27 / 25 / 25. The overshoot is helper quarter-sets, but a reader sees "28" next to "Final sets 27" and thinks the plan overshoots its top. | R4-PRG-04 (never above the level's top); GEN clarity | `render.mjs`: round the displayed weekly value down to the planned top when the excess is helper credit under 1 set, or print the planned final as "27 (+ helper credit)". Alternatively, let `volume.mjs` stop the last helper-driven step at the top. |
| m12 | Tue `s05` spine load (new, low) | Bent-over barbell row at 4-6 reps, 4 → 5 sets, on Tuesday, the day before the squat (and squat-test) day. The catalog marks it `axial_class: none`, but a heavy bent-over row loads the lower back. His PER-04 reasoning is to load the spine once per pattern and load it correctly. With Friday's seal row already chest-supported, Tuesday is the only free-standing heavy row. | PER-04 (spine load); R2-SES-01 / 02 | Give `bent-over-barbell-row` an `axial_class: moderate` in the catalog, and in `select.mjs` prefer a chest-supported row for the heavy 4-6 bracket on the day before a counted squat or deadlift (here: the seal row takes Tuesday's 4-6 slot; any bent-over row runs at 8-12). Coach call. |
| m13 | JSON laterality (new) | Detail variations that change the stance or hand keep the record's laterality. Fri `s11` cable curl "one arm at a time", and Wed / Sat leg extension and leg curl "one leg at a time", are all `laterality: bilateral`. Any check on the one-arm / two-arm share (V28) reads them wrong. | V28 / V30 data integrity | `select.mjs`: when `detail.axis` is `hand` or `stance` with a one-arm / one-leg value, set the item's laterality to `unilateral`. |
| m14 | Data hygiene (carried from R4 m10) | The record id `alternating-db-deadlift-alternate-lead-leg-staggered-side-each-rep-meaning-infer` is still in the plan (60 times in the JSON). | - | Rename it in the catalog and fixture, and keep an alias. |
| m15 | Language (carried from R4 m11) | There is no `07-push-pull-legs.es.md`, while 03, 05 and 08 have one. | CX product direction (EN + ES); H14 | Add 07 to the Spanish run in `tools/generate-samples.mjs`. |

Checked and fine (not problems):

- **Calves rise.** The 6 → 7 step (+16.7%) prints no "jumps more than usual" note. It is a one-set step (`progression.note_min_whole_sets: 2`). No other group-week rises above 15%; the biggest is biceps at +10.1% in week 10.
- **Tested lifts in week 12.** Bench 4 → 3, squat 5 → 4 and deadlift 4 → 3 sets is the test replacing the top set, as approved.
- **MYO set on Saturday.** In week 12 it sits on the seated leg curl, the day's last machine exercise, not on the DB calf raise after it. That is consistent with VOL-15 and H02.

## Checklist

| Check | Result |
|---|---|
| His PPL template, slot for slot | Yes on all six days; Saturday's lead lift is flipped (m2). The Focus slot on the leg days holds calves, which is honest because Focus is chest / back. |
| 6-8 exercises (R4-SES-02) | 8 / 8 / 7 / 7 / 7 / 7. Core and warm-up are not counted. |
| Choices | Mostly his mainstream lifts; the weak spots are the TRX bonus (m8) and the flat DB bench at 4-6 (m7). |
| Order | Push and pull days follow his sheet; legs follow it except Saturday (m2). |
| Core first | 2 x 2 core opens every day (H05); the picks before max lifts are m6. |
| Horizontal before vertical | Rows come before pulldowns on both pull days (H04 / ORD-01). On push days the sheet's own V-push → incline order is kept. |
| Spine loading | One counted heavy squat (Wed) and one counted heavy deadlift (Sat), never on the same day (H07). The other lower lifts are non-axial. Bent-over row noted (m12). |
| Sets per exercise | 2-5; compounds lead each group, and sets go to the first exercise first (VOL-07). |
| Weekly sets | Every group reaches its planned final sets (CX-01 / CH5-03). Calves sit under 10 until week 11 (m1). Nothing comes near 35. |
| Stairway steps | Smooth 0-10% steps. Calves +16.7% in one set (fine). Arrival in week 11 with a hold in week 12, except shoulders (m4). |
| Progression as a rule | On every lift: "when you hit 6 on every set with 3 left in the tank, add weight next time and start again at 4" (R4-PRG-03). The next-block line and the template-is-editable lines are present (R4-PRG-04, CX-04). |
| Incline bias | The V-push slot is a high-incline press on both push days, plus a second incline press each day (R4-LIB-03). The flat bench stays heavy for a powerlifting-style lifter. |
| Focus muscles | Chest and back sit +2 over the balanced plan, lead their days and climb to 27 (R3-SES-01). |
| Block changes | One detail each, except m9 (and m10 is cosmetic). The round-4 swap that broke the rule is gone. |
| Liability line | At the top and the bottom, with acceptance stamped (R4-SCP-01 / 02, H20). |

## Praise

- **Both majors fixed the right way.** The biceps reach their endpoint through his own mechanism (a bonus curl on the back day, VOL-07), not by piling a 5th set on the curls. Tuesday keeps its one-arm row all 12 weeks.
- **His template is intact**, and the day count stays inside 6-8 even with two bonus exercises.
- **The "What changes this week" list is now usable.** Each block change is named by day, and each added set is named with its exercise and day. A client can follow the plan alone (R4-PRG-03 spirit).
- **Block changes read like his notes:** neutral grip, a DB between the feet, pause at the bottom, one leg at a time, overhand grip, a squeeze at the top.
- **The stairway is honest.** No hidden caps, `shortfalls: []` is now true, every group lands in week 11 and holds in week 12, and the effort ramp runs 3 → 2 → 1-2 → 1 + MYO.
- **Swap lines say what each swap keeps and loses**, every exercise has a YouTube search link with a name to copy, there are no video links on the cardio colours, and test days and the Christmas / New Year weeks are named.
