# Coach-eye review, round 9: 01 Swimming (16-year-old, middle distance, 3 dryland days; engine 0.7.0)

**Grade: A** (coach's round-5 grade: A; kept). The round-5 answers that reach this plan are in, and the plan is a little better than the one he graded:
- **Overhead for shoulder health (R5-ATH-04).** A light seated machine shoulder press (2 × 12-15, joint care) now sits on Monday, the day without the incline slot. The incline press keeps the strength slot on Wednesday.
- **The chest fly moves to the optional day (R5-VOL-07).** It is a Saturday optional item from week 11, and it now opens only after the incline press has its 4th set (r8 m2).
- **The heavy hinge leads (R5-ATH-12).** The hex bar is at 4 sets from week 3.

What is left is minor, mostly carried. Two new small items: the block-3 jump picks slide back to stage-1 drills on Monday (m6), and one copy slip (m15).

Reviewed: `samples/plans/01-swimming.en.md` and `.json` (engine 0.7.0, model 1.3.0, `validation.ok: true`), plus `samples/intakes/01-swimming.json`.
- Warnings: `acceleration` (week 11, chest, 17 %), `capped_by_template` (back 20 / 21), `slot_held_groups`, `laterality_capped` (61 / 50).
- There is no Spanish file.

Not judged: session length (CT-01).

---

## Round-5 answers that touch this plan

| Answer | What the plan does | Status |
|---|---|---|
| R5-ATH-04: incline first, but overhead stays for health and range | Wed Incline DB Bench 3 → 4 (the strength slot). Mon **Seated Machine Shoulder Press** 2 × 12-15, joint care (`OVERHEAD_HEALTH`), 1-second pause variant in block 3. No standing or seesaw press (the swimmer's hot spot). | Applied |
| R5-VOL-07: a light chest exercise on the optional day | Sat **Flat DB Fly** 2 sets, weeks 11-12. Said up front ("Skip that day and the chest total ends at about 12"). | Applied |
| R5-ATH-12: heavy deadlift starts at 3, takes the hips' next set first | Fri Hex Bar `2+T 3 4 4 · 4 4 4 4 · 4 4 4 3+T`. Hyperextension 2 → 3 in week 6, after the hex. | Applied |
| R5-GRD-03: jumps two-leg low → single-leg higher; no single-leg hurdle hops in block 1 | Block 1 is two-leg (low depth drop, low box, ankle hops, knee-height box, medium depth drop). Block 2 is two-leg (squat jump, broad jump, knee-height box, lateral jump, backward and lateral ankle hops). Block 3 is single-leg (single-leg broad jump, single-leg ankle hops, single-leg right-angle ankle hops), plus broad jump. No hurdle hops. | Applied (see m6, m7) |
| R5-VOL-02: pull ≥ press | Back 15 → 20, chest 10 → 14. | Applied |
| R5-CLS-07: nothing starts at its top | Every group climbs. | Applied |
| R5-GRD-06 / CH5-01 / CH5-02 | Core printed optional. "This plan does not count your 6 team practices a week". The arm slot is held and said. | Applied |

## Round-8 items: status

| R8 # | Status in r9 |
|---|---|
| m1 hinge staircase (Wed hyperextension flat at 3, hex 4 only in wk 11) | **Fixed** by R5-ATH-12: hex 4 from week 3, hyperextension 3 from week 6. |
| m2 chest fly opens before the incline is full; chest held 11 for weeks 4-8, then +2 | **Improved**: the incline takes its 4th set in week 9 and the fly opens in week 11 on the optional day. Chest still sits at 11 for weeks 4-8 (m1). |
| m3 lateral raise labelled "bonus ... because your template's lifts are at their top sets" | **Open** (m2). |
| m4 back 20 with "Add an exercise if you want more" for a swimmer | **Open** (m3). |
| m5 1-set stations | **Open** (m4). |
| m6 jump track goes to a lower box in block 3 | **Fixed** on Friday (medium depth drop → knee-height box → broad jump). A similar slide now shows on Monday (m6). |
| m7 Repeat cue "3 + 2 + 2" on 5-contact sets | **Open** (m8). |
| m8 youth 1RM wording / DB-press test | **Open** (m9). |
| m9 block-3 reps 8-10 | **Open** (m10). |
| m10 plyo share 22 % vs 25 %; Olympic sets 8 vs 4.5-7.5 | **Open** (m11): 22 % from week 6 to the end; 8 Olympic sets in week 11. |
| m11 block tables list the tested lift first | **Open** (m12). |
| m12 hyperextension for a low-back-extension hot spot | **Open** (m13). |
| m13 overhead DB triceps extension in block 3 | **Open** (m14). |
| m14 Saturday optional day thin | **Partly**: weighted decline sit-up + the fly in weeks 11-12 (m5). |
| m15 every quad step on Monday | **Open** (m16). |

---

## Problems

### Blockers

None.

### Major

None.

### Minor

| # | Where | Problem | Rule | Severity | Engine fix hint |
|---|---|---|---|---|---|
| m1 | Chest `10 10 10 11 · 11 11 11 11 · 12 12 14 14` | (Carried, milder.) Five flat weeks, then +1 and +2 (17 %, noted with ↑ and a line up front). It is legal (CX-02). A swimmer would rather have no fly and 13. | R4-PRG-01 / -02; open Q5 | minor | Let the aquatic push : pull reading lower chest's final before an optional-day fly is planned. |
| m2 | Wed **Seated DB Lateral Raise** 3 × 12 weeks; "Shoulders: 3 of its 12 final sets sit on a bonus exercise ... because your template's lifts for it are at their top sets. Skip it and the shoulders total ends at about 9." | (Carried.) It is there for the 10-set floor, not because the template is full, and it is the side-delt place of his athletic B day. Skipping it puts the shoulders under the floor the plan promises. | H17; R4-SES-04; R5-VOL-05 (B day: side delts 7th) | minor | Treat a floor-opened bonus as a template station: a floor note, and keep it out of `easy_to_remove`. |
| m3 | "Back: this template holds 20 weekly sets, below the planned 21. Add an exercise if you want more." | (Carried.) For a swimmer with 6 pool sessions a week, the invitation runs the wrong way. | profile `resistance.avoid` | minor | Drop the "add" clause for high-practice aquatic profiles. |
| m4 | Mon ankle hops 1 set in weeks 5 and 9-12; Fri single-leg ankle hops 1 set in week 12; Wed medball 1 set in week 12 | (Carried.) A 1-set station is not worth the station. | R3-ATH-01; G-116 | minor | An athletic station holds at least 2 sets, or merges. |
| m5 | Sat optional day: Weighted Decline Sit-Up (12 weeks) + Flat DB Fly (weeks 11-12) | (Carried, partly.) The day is loaded flexion for a low-back-extension hot spot, and the swimmer add-ons are not placed there. | `prog_byop_athletic` optional day; profile injuries | minor | Unloaded anti-extension core there; print "core + the add-ons above". |
| m6 | Mon jump stations, block 3: **Two-Foot Lateral Jump** (s06) and **Squat Jump** (s05), both stage-1 / level-1 drills, in "Receive-Create 3: Repeat". The squat jump is the same drill s06 held in block 2. | **New.** On Monday the hardest block steps back to the lowest drills, while Wednesday and Friday move on to single-leg and broad jumps. That works against R5-GRD-03 ("progressed ... to eventually ... unilateral hops"). The G-264 stay-low penalty did not hold here. | R5-GRD-03; G-264; R2-LIB-01 | minor | `select.v7Score`: from block 3, apply `stay_low_penalty` to any drill below the block's own level (not only one the slot held before). A drill another slot used in the previous block counts as "returned". |
| m7 | Fri **Medium Depth Drop** and Wed **Mid Box Jump (knee height)** in weeks 1-4, for a 16-year-old in his first plan | **New, small.** Both are level-2 drills ("two-leg higher") in block 1. R5-GRD-03 starts with "jump rope then bilateral ... hops". Swimming is mostly ballistic (R3-ATH-01), and the plyo share in week 1 is only 15 %, so the load is light. | R5-GRD-03; youth overlay | minor | For youth or a first plan, cap block 1 at level 1 (the `cap_offset` 0). |
| m8 | Weeks 9-12 Repeat cue | (Carried.) "runs of 2-3 big jumps (for 7 jumps: 3 + 2 + 2)" on 5-contact sets. | Copy | minor | Build the example from the item's contacts. |
| m9 | Tests, weeks 1 and 12 | (Carried.) "3 rep max or work up to a 1 rep max" for a 16-year-old, and the flat DB bench as the press test. | R2-PER-07; youth overlay | minor | A minor tests a 3RM only; prefer a machine or barbell press. |
| m10 | Block 3 | (Carried.) Machine bench, rows, pulldown, KB front-rack squat and split squats stay at 8-10, against the profile's "strength 4-6 + power". | PER-11 | minor | The VOL-3 zone for two-arm compounds in block 3. |
| m11 | Athletic block | (Carried.) Plyo share 22 % from week 6 against 25 %. Olympic sets 8 in week 11 against 4.5-7.5. Week 12 (the test week) halves the jumps without saying why (as in 02 m2). | R3-ATH-01; profile `triple_ext.sets_wk`; R5-ATH-02 | minor | Reach `plyo_share.end` in the last block; cap Olympic sets; add a test-week line. |
| m12 | Block tables Mon / Fri | (Carried.) Built from week 1, so the tested lift is listed first. | R4-SES-05 | minor | Build the table from the first non-test week. |
| m13 | Wed slot 2: 45° Hyperextension | (Carried.) Spinal extension for a `LOW_BACK_EXTENSION` hot spot. | profile injuries | minor | A light penalty when an in-slot alternative exists. |
| m14 | Wed slot 5, block 3: Tate Press → **Overhead DB Triceps Extension** | (Carried.) Loaded end-range shoulder flexion for `SHOULDER_SWIMMER`. The plan now adds a deliberate light overhead press for health, which makes this the second overhead item a week. | profile avoid; R5-ATH-04 | minor | Swimmer penalty on overhead triceps records. |
| m15 | "Before you start": "Week 11 jumps more than usual (17 % more sets for Chest)" | **New (copy).** In an athlete's plan full of jump drills, "jumps" reads as plyometrics. The ES twin in 05 says "sube" (rises). | Accurate copy; H14 parity | minor | `warning.acceleration`: "Week 11 rises more than usual". |
| m16 | Fri Double-KB Front-Rack Squat 2 × 12 and FFE / RFE Split Squat 2 × 12; Mon front squat, lunge and leg extension take every quad step | (Carried.) 12 quad sets on Monday by week 11; Friday's two quad lifts never move. Friday's **Machine Bench** also holds 4 × 12 weeks, above Wednesday's flat DB bench in weeks 1-3 (2+T, 3, 3) and never steps. | R3-VOL-03; VOL-07 | minor | Let `kExp` read a group's lifts across all training days. A day's later press does not open above the week's first press. |

**Count: 0 blockers, 0 majors, 16 minors** (m1 and m3 touch open questions).

## Fresh checks (as Lalo)

- **Dryland his way (R3-ATH-01).** No extra cardio (practices count). Shoulder care every session, with no bands: face pull on Monday and Friday, Y / T raises on Wednesday, plus the new light overhead press. A clean on the squat day and a snatch on the hinge day. 36-44 throws. The taper and the 4-hour gap are printed.
- **His S1 / S2 / S3 days.** Jump, knee and pull; medball, hip and push; Olympic and strength. Core comes first, then the athletic block, then power, then strength. Horizontal comes before vertical.
- **Stairway.** 64 → 85 sets. The groups arrive in week 11 and hold. The only step over 15 % (chest, week 11) is flagged. RIR goes 3 → 2 → 1-2 → 1, with no MYO on test days.
- **Honesty.** The back cap, the arms held at their slot, the optional-day fly and the two-leg share are all said up front.

## The one change that lifts it further

It is already his A. To polish it:
- Label the lateral raise as the template's side-delt place, not a bonus (m2).
- Keep Monday's block-3 jumps moving on (m6).
- Then the youth test wording (m9).
