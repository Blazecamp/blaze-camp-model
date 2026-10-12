# Coach-eye review, round 5: sample 06, full-body aesthetics. Grade: **B+**

Reviewed: `samples/plans/06-full-body-aesthetics.en.md` and `.json` (engine 0.6.0, model 1.3.0, `status: ok`, validation ok), built from `samples/intakes/06-full-body-aesthetics.json`: 29 years old, 3 years of training, L3, 4 days A/B plus 2 optional days, Focus glutes and side delts, full gym, 12 weeks.

Not judged:
- Session length and minutes (CT-01).
- Spanish: there is no `.es.md` for this sample, so H14 was not graded.

Authority used: CH5-01..03, round 4 and CT-01 first, then CX, round 3, round 2 and the full answers. Items that are open coach questions are listed as minors at most: G-119 (1)-(5), G-199 (chest 23 of 25, arms 18 / 20 of 25), and STATUS open question 7 (side-delt direct sets).

**Verdict.** All three round-4 majors are fixed:
- The block starts lower, and every slot-1 lift now climbs.
- The back's final sets reach 25 through an optional-day bonus, which CH5-03 now allows.
- The pyramid lifts read clearly.

The skeleton is still his, slot for slot. Spine loading, core first, pairing, horizontal before vertical, incline bias, the stairway, progression as a rule and the release line are all correct. What remains are small tweaks, most of them carried over from round 4. Lalo could hand this out after a short edit pass. B+.

---

## Round-4 majors: status

| R4 | Problem | Status in 0.6 | Evidence |
|---|---|---|---|
| M1 | Volume started at the top: 5-set first lifts, 25-28 sets per main day in week 1, and slot 1 could never take a set (VOL-07) | **Fixed** | Big non-Focus groups start at 16 (G-111): quads, back and chest 16, week 1 total 112 (was 121). Week-1 slot 1 holds 4 sets (Seal Row, Bench, BB Row) or 3 (Flat DB Bench) (G-108). Every slot-1 lift climbs: Seal Row 4 → 5 (wk 6), BB Row 4 → 5 (wk 7), Bench 4 → 5 (wk 8), Flat DB Bench 3 → 4 → 5 (wk 3, wk 9). Main days hold 25 / 23 / 23 / 21 working sets in week 1 (was 28 / 25 / 26 / 20). |
| M2 | Back and chest progression lived only on the optional days, outside R3-VOL-03 | **Resolved by CH5-03** | CH5-03 ("they should reach more if needed, no cap until 35") allows a big group a bonus exercise when the main days cannot hold its final sets. The four back lifts top out at 5 × 4 = 20, so Wed Machine Row (2) and Sat Close-Grip Pulldown (2 → 3, block 3) take back 20 → 25. Neither repeats a compound pattern from the day before (G-104). Chest reaches 23 of 25 with a Friday pec-deck bonus, and this is said up front (open item G-199). One leftover is listed as minor m1. |
| M3 | Pyramid schemes printed raw ("12/10/8 -20") and contradicted by "Keep this lift at 8-10 reps" | **Fixed** | "4 sets: 12, 10, 8, then a light back-off set of 20" with a pyramid note on how to load it, and a progression rule ("when you hit the written reps on every set ..."). No pyramid item carries a rep-cap note any more. |

Round-4 minors fixed in 0.6:
- m6: every capped group is said up front.
- m10: the header says "about 8 exercises", and every main day holds 8.
- m11: "11 = your hardest week".
- m12 wording: Orange now reads "30 min · steady pace".
- The Wednesday half of m4: the supine curl stays, and the spider curl changes only its grip.

Partly fixed: m5. Shoulders now end at exactly 27, but hips still end at 27.25 (see minor m9).

Still open: m1, m2, m3, m7, m8, m9, m13, m15. They are listed below.

---

## Fresh review

### Blockers

None.

### Major

None.

### Minor

| # | Where | Problem | Rule id | Severity | Engine fix hint |
|---|---|---|---|---|---|
| m1 | Wed Machine Row (bonus) 2 sets in weeks 1-12, and Sat Lat Pulldown (Close Grip) from week 9. "Before you start" section | Five of the back's 25 final sets now sit on the optional days, but the plan never says so. Someone who skips the optional days (his "bonuses") ends back at 20 and gets no back progression from week 11 on. The Wednesday row is also in the plan from week 1, while the main-day back lifts are under their 5-set top until week 11. CH5-03 says "when the main days cannot hold them". | CH5-03, H10 (capped or moved volume is "said plainly"), R3-VOL-03 | minor | Print one line from `meta.stairway[].bonus` when a big group's final sets need an optional day: "Back reaches 25 only with the Wednesday row and the Saturday pulldown." Optionally, open a big group's first optional-day bonus in the first exercise block whose last week needs it (as G-199 already does for the 2nd and 3rd bonus), not in week 1. |
| m2 | Mon slot 3 Single-Arm Lat Pulldown and Thu slot 3 Lat Pulldown (Rope), all 12 weeks | An advanced full-gym physique client never gets a standard two-arm pulldown or a pull-up on an A day. His demo pick is 'Lat Pulldown Pronated Grip'. The only two-arm bar pulldown is the Saturday bonus, and only in block 3. Carried over from r4 m1. | R4-SES-05 slot 3 "vertical pull, like a lat pulldown"; OBSERVED BYOP U11 | minor | `select.mjs`: rank a two-arm standard-grip pulldown or pull-up first for A-day slot 3 at L2-L3. Keep the single-arm and rope versions as swaps or block details. |
| m3 | B-day slot 3, all three blocks | Incline bias is right, but there is no overhead press anywhere in 12 weeks. He wants "that variability". Carried over from r4 m2. | R4-LIB-03 | minor | Let one block of one B day (for example Friday, block 3) pick a seated DB shoulder press, or list it as that slot's first swap. |
| m4 | Tue Incline Barbell Bench, block 2 "close grip (hands shoulder-width)" | The close grip moves the 'Chest/Shoulders' slot toward triceps, on a day that already holds two triceps exercises. Carried over from r4 m3. | R2 one-detail rule (the detail keeps the slot's job) | minor | Variation picker: leave out the close-grip detail on press slots, and prefer a pause, tempo or implement detail. |
| m5 | Tue and Fri slot 0 (side raises); Wed only for glutes | Focus 2 (side delts) opens both B days. Focus 1 (glutes) never opens a session, although both B days are hip days. Carried over from r4 m7. | ORD-04 | minor | When two Focus muscles share a day, Focus 1 takes the first place on at least one of the two B days (for example a Tuesday glute-bridge or hip-thrust opener), or alternate the two B days. |
| m6 | Mon core: Copenhagen Plank before Front Squat and the RFE lunge. Tue core: Hanging Rotational Knees-to-Chest before Bench and Hip Thrust | Adductor pre-fatigue before the week's counted squat, and a grip-heavy hanging drill as the opener of a press day. His core opener is light. Carried over from r4 m8. | ATH-11, R2-SES-03 (core first, light) | minor | Core picker: on the counted-squat day, prefer a plank or dead bug over the Copenhagen plank. Keep hanging drills off a day whose next block is heavy pressing or pulling. |
| m7 | Thu Bent-Over Barbell Row, 4-5 pyramid sets with a 20-rep back-off, the day before Fri Hex-Bar Deadlift | Erector fatigue the day before the week's counted hinge. The row is `not_counted` for spine load, and the 20-rep back-off makes it worse. Carried over from r4 m9. | PER-04, EQ-11 (spine days) | minor | Mark the bent-over barbell row as a light spinal load in the catalog, or pick a supported row (seal row or machine row) for the A day that falls before the counted hinge. |
| m8 | Week 12, Mon Seated DB Reverse Fly and Thu Machine Reverse Fly (MYO) | Rep range 20-30, but the MYO activation set says "about 15 reps". Carried over from r4 m13. | VOL-15 | minor | Scale the MYO activation set to the item's rep range (for example "about 25"), or move the MYO to an exercise in the 15-20 range. |
| m9 | `summary.sets_by_group_by_week.hips` week 12 = 27.25 against a final of 27 | A quarter-credit overshoot remains: hips only now (shoulders are fixed). Carried over from r4 m5. | R4-PRG-04 "never above the level's top" | minor | `volume.planWeeklySets`: count helper credit before the last added set and trim the step that tips the group over. |
| m10 | Fri Hex (Trap) Bar Deadlift 3 sets and Tue Staggered-Stance DB Deadlift 3 sets, flat for 12 weeks; Tue Barbell Hip Thrust 3 → 4 → 5 | B-day slot 2 takes both of its steps on Tuesday, so the two exposures of the day type do not alternate. Holding the counted hinge flat may be the right call for the spine, but no `why` says so. (On the A days, Front Squat and Leg Press do alternate.) | R3-VOL-03 (alternate the two exposures), VOL-07 | minor | If it is deliberate (spine load), attach a `why` to the hex-bar item and print "sets held: heavy hinge, progress by load". Otherwise let `addSet` alternate B-day slot 2 between Tuesday and Friday. |
| m11 | Wed optional day = glutes Focus × 2 (Machine Hip Thrust, Reverse Hyper); Sat optional day = side-delt Focus × 2 (Cable Lateral Raise, DB Upright Row) | His sheet puts **both** 'Focus 1' and 'Focus 2' on **each** optional day. Splitting them means someone who does only one optional day loses all the extra work for one Focus muscle. | OBSERVED BYOP 'AESTHETICS - FULL BODY - 4 DAYS' optional rows D21/D22, D42/D43; R3-SES-01 | minor | `placement.optional_focus`: give each optional day one Focus 1 and one Focus 2 exercise, rather than two of the same Focus. |
| m12 | Block 3 calves: Mon and Sat both run "Machine Calf Raise - 1-second squeeze at the top"; Thu runs "Machine Calf Raise - from a step" | Three of the week's four calf exercises are the same machine, and two are identical. There is no seated (soleus) or free-weight variety in the hardest block. | PER-02, R2-LIB (variety by one detail across the week) | minor | Block-change picker: no two items of a week share the same exercise and detail, and prefer a seated calf raise on one exposure. |
| m13 | Mon RFE lunge and Thu Stationary Lunge: "Hold dumbbells at your sides (or a barbell on your back) once your body weight is easy at this effort" | A beginner's cue printed on an L3 plan, next to "Week 1: pick a weight you could lift about 3 more times". The two lines contradict each other for a 3-year lifter. | GEN-01 (clear wording) | minor | Print the body-weight-first note only at L1, or when the lift is prescribed unloaded. |
| m14 | Every main day: 25 / 23 / 23 / 21 working sets in week 1, 33 / 31 / 32 / 30 in week 12 (plus 4 core sets); slot 1 opens at 4 sets | Per-session volume (sets, not minutes) stays above VOL-08's approved "about 7 × 2-3 (14-21 sets)", and slot 1 opens at 4 sets against his AESTHETICS track's 3 sets in weeks 1-3. Minor only: the start numbers are PROPOSED (G-108, G-111), and CH5-03 allows more weekly volume. | VOL-08, VOL-16, OBSERVED 4 TRACKS 'AESTHETICS' row 31 | minor | Ask him with the G-119 questions. If he wants his track, set `placement.x3.start_max_sets.compound` to 3 for weeks 1-3 in the aesthetics family. |
| m15 | Plan JSON exercise id `alternating-db-deadlift-alternate-lead-leg-staggered-side-each-rep-meaning-infer` | Leftover inference text in a public id. Carried over from r4 m15. | Data hygiene | minor | Rename it through `id_aliases` in the next library amendment. |
| m16 | "Before you start": Chest 23 of 25, Biceps 18 of 25, Triceps 20 of 25 | This is the known open item G-199: both optional days follow a press day, and the main days are at 8 exercises. The plan says it plainly, so it is listed for completeness only. | CH5-03, G-199 (open) | minor | None until he answers G-199. |

Not counted, because it is an open question: m14 of round 4 (4 of the 8 week-1 direct side-delt sets are on Saturday), which is STATUS open question 7.

---

## Checklist

| Check | Result |
|---|---|
| His A/B template, slot for slot | **Yes.** A1/A2: two-arm horizontal pull (Seal Row, BB Row) → two-leg squat (Front Squat, Leg Press) → vertical pull → lunge (RFE, split squat) → biceps → leg extension, + calf and rear-delt fly. B1/B2: horizontal push (BB Bench, Flat DB) → two-leg hip lift (Hip Thrust, Hex-Bar DL) → incline press → single-leg hinge → triceps → leg curl, + one extra (pushdown, or the pec-deck bonus). The side raise opens both B days as Focus (ORD-04). Laterality holds in every block. |
| 6-8 exercises | Every main day holds 8; the optional days hold 4-5. The header says "about 8". |
| Choices and order | Good overall. Leftovers: m2 (no two-arm vertical pull), m3 (no overhead press), m12 (calf duplicates). |
| Pairing | Every suggested superset pairs a knee lift with a pull and a hip lift with a push: Seal Row + Front Squat, BB Row + Leg Press, Bench + Hip Thrust, Flat DB + Hex DL, incline + single-leg hinge. |
| Core first | Yes, every day, including the optional days. Exercise choice: m6. |
| Horizontal before vertical | Yes, every day. Saturday's pulldown has no horizontal pull that day. |
| Spine loading | One counted squat (Mon Front Squat) and one counted hinge (Fri Hex DL), on different days. The leg press and hip thrust fill the second exposures. The row before the hinge: m7. |
| Sets per exercise | 2-5 throughout. Slot 1 opens at 3-4 and reaches 5. Isolation stays at 2-4. |
| Weekly sets: floor, final and ceiling | Floor 10 is held (calves 10, lowest). Quads, hips, back, shoulders and calves reach their finals in week 12. Chest, biceps and triceps are capped and said (G-199 open). Highest group: 27.25, under 35. Hips 0.25 over the top: m9. |
| Stairway steps | They never decrease. No group step above 15 %: the largest is triceps in week 3, +8 % (15.25 → 16.5). The largest weekly total rise is 4.9 %. `meta.stairway.acceleration` is empty, which is correct. Effort goes 3 → 2 → 1-2 → 1 RIR, with MYO only on each main day's last isolation exercise in week 12. |
| Progression as a rule | Yes: "when you hit X on every set with N left in the tank, add weight and start again at Y". The pyramid lifts use "the written reps". No promised numbers. |
| Incline bias | Two incline presses a week and no overhead pressing (m3 asks for some variety). |
| Focus muscles | Glutes 12 → 15.5 and side delts 8 → 13, both built into the stairway. The "+2" header and the hips start of 22 against 16 are open item G-119 (1). Ordering: m5. Optional-day split: m11. |
| Block changes as one-detail variations | Mostly right: DB → barbell seal row, grip on the spider curl, pause and squeeze details, one-leg curl, attachment on the pushdown. Leftovers: m4 (close-grip incline) and m12 (calf duplicates). Kickstand DL → rear-foot-on-wall DL is a stance detail and acceptable. |
| Liability line | At the top (the release, with a link) and at the bottom ("Liability released ... Use at your own risk"), both with the disclaimer link. The terms-accepted line is in the header. |

---

## What he would like

- **The fix landed where it mattered.** Week 1 now looks like a first week, and each slot-1 lift (seal row, bent-over row, bench, flat DB bench) climbs to 5 sets by the middle or last block, as his VOL-07 asks.
- **The pyramid reads like his track.** "12, 10, 8, then a light back-off set of 20", with a one-line loading cue and a rule the person can apply.
- **CH5-03 applied cleanly.** The back reaches its 25 through an optional-day row and pulldown. Neither repeats the previous day's pattern, and pulling stays at or above pressing all block (back 25, chest 23).
- **Honest up front.** Every capped group is said in "Before you start", along with the holiday weeks.
- **Product details hold.** Swaps say what they keep and lose. YouTube search links come with a name to copy. Each day lists what is easiest to remove. The edit guidance and the stairway table are in place.
