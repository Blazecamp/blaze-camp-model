# 05 - Session and week architecture (Blaze Camp) - v1.3

**What this is.** How the coach builds a training *session* (which slots, in what order, paired how) and a training *week* (which day types, on which weekdays, with which optional, conditioning and OFF days). It does three things:

1. It catalogues every template he has built, from both workbooks, as slot sequences in one bucket vocabulary (section 2, unchanged OBSERVED evidence).
2. It states the rules that govern sessions and weeks. In v1.2 these rules come first from **the coach's round-3 answers** (`coach_answers_round3.md`, 2026-10-09), then from his **round-2 answers** (`coach_answers_round2.md`, 2026-10-08), then from his **round-1 answers** (138 of 140 questions), and only then from what the sheets show.
3. It turns those rules into generator-ready week splits for 2, 3, 4, 5 and 6 days per week, for six goal families, with variants, scaled from 45 to 90 minutes (120 for competitive athletes). v1.1 rebuilt every one of them under the round-2 rule that **each muscle a day trains gets 2-4 exercises** (COACH-R2 R2-SES-05); v1.2 rebuilt them again with **one calf exercise x 3 sets per leg day**, block ids with on/off toggles and superset recommendations, and checks every template against the **time-vs-minimums** policy (COACH-R3 SES-01, SES-02). **v1.3** rebuilt the gym and athletic days on his own A / B / C skeletons and push / pull / legs, sizes every session by exercise count instead of minutes, and retires the time-vs-minimums check (COACH-R4 R4-SES-02, R4-SES-05; COACH-CT CT-01); see the v1.3 section below.

The machine-readable companion is `05_templates.json` in this folder (v1.2). It holds the bucket vocabulary, the observed templates, the v1.2 rules, the time model, the 30 regenerated split templates with their variants, block ids and superset recommendations, the recomputed checks for every template, the time-vs-minimums check and the open questions. **v1.3:** the JSON was not re-issued; `tools/fixture/v05-structure.mjs` rebuilds the days on his skeletons at compile time, and the compiled `model/templates.json` carries them (a rank for every counted exercise, an exercise count and a skeleton per day type).

**Audience.** Two readers:
- the coach, who should be able to say "yes, that is how I do it" or "no, change this";
- the engineer who will encode the generator.

**Evidence tags (on every claim).**
- **COACH-R4 <ID>** = the coach's round-4 answer in `coach_answers_round4.md` (R4-* IDs). It overrides everything below, together with **COACH-CT CT-01** (session time is the user's responsibility; `coach_answers_time_2026-10-10.md`).
- **COACH-CX CX-01..04** = his clarifications on progression and editable templates (`coach_answers_codex_2026-10-10.md`). Above round 3, below round 4 and CT-01.
- **COACH-R3 <ID>** = the coach's round-3 answer in `coach_answers_round3.md` (R3-* IDs, e.g. COACH-R3 SES-02 = R3-SES-02). It overrides rounds 1 and 2 and everything else.
- **COACH-R2 <ID>** = the coach's round-2 answer in `coach_answers_round2.md` (R2-* IDs, plus the round-1 leftovers LIB-10 and LIB-12). It overrides round 1 and everything else.
- **COACH-ANSWER <ID>** = the coach's round-1 answer in `coach_answers_full.md` (question ID cited). It overrides every sheet inference and every earlier team decision.
- **OBSERVED** = read from a cell, label, colour, merge or dropdown in the coach's sheets. Tab and cell are cited.
- **INFERRED** = my reasoning from the observed material, or my application of a coach answer to a case he did not name. Each one is a proposal the coach can overrule.
- **SCIENCE** = general training-science literature (listed in section 12).
- **PROPOSED** = a team proposal where the coach asked us to propose or did not decide. Always **PENDING COACH APPROVAL**.

**Sources.** `coach_answers_round3.md` (read in full first, v1.2), `coach_answers_round2.md` (read in full, v1.1), `coach_answers_full.md` (read in full) and `coach_answers.md` (his earlier chat statements); every decode file in `analysis/programs/`, `analysis/library/` and `analysis/reference/`; the equipment/ordering audit in `analysis/equipment/`; the sibling synthesis files `03_volume_dosing.md` (dose and level numbers) and `06_periodization.md` (plan shapes). The v1.2 templates and every number in sections 7-8 were recomputed with python (project venv) by a build script that also checks each template. Nothing in Google Sheets was opened for writing.

**Labels.** Coach labels are quoted verbatim with their typos ('Tripple Extension', 'ABdution', 'DOMNANT', 'Sagital', 'RECCOMENDED', 'ACCESORY'). My own names are spelled correctly. Generator-facing program and day names are generic and plain (COACH-ANSWER FIX-03), for example 'JUSTICE LEAGUE' becomes 'Athletic Performance - Non-Competitive' (COACH-ANSWER ATH-13). Tab names stay verbatim where they are cited as evidence.

**One important absence (OBSERVED).** No tab in either workbook states how long a session lasts. Session lengths come from the coach's answers (UNI-09, PRG-03, VOL-08; R2-SES-05 'it might be a little longer day'). Minute estimates per template come from the time model in section 7 and are INFERRED. **v1.3:** session length is no longer an input or a limit (COACH-CT CT-01; COACH-R4 R4-SES-01); the minute estimates only feed the average time printed on each day.

---

## v1.3 - round 4, CT-01 and CX-01..04 applied (2026-10-11)

The coach's newest answers outrank everything below: round 4 (`coach_answers_round4.md`, 20 answers, 2026-10-11), his clarification on session time (`coach_answers_time_2026-10-10.md`, **CT-01**) and his clarifications on progression and editing (`coach_answers_codex_2026-10-10.md`, **CX-01..04**). **Authority order: round 4 and CT-01 > CX-01..04 > round 3 > round 2 > round 1 > chat statements > sheets.** **Where this section and a later section of this file disagree, this section wins.** Later sections that v1.3 supersedes carry a "RETIRED in v1.3" or "Changed in v1.3" note under their heading; the text under such a note is history. The master record is `BLAZE_CAMP_BRAIN.md` v1.3 (what changed: §0d). 

### V1. What v1.3 changes in this file

| # | Change | Sections below it replaces | Source |
|---|---|---|---|
| 1 | **His own templates are the skeleton.** A day = pull + knee dominant; B day = push + hip dominant; about 6 exercises, up to 8; 4 days = A, B, rest, A, B; push / pull / legs is the other option. The gym and athletic days are rebuilt on these skeletons. Day layouts are never invented | §0; §4.4; §4.6; §4.7; §8 (8.1, 8.2, 8.4, 8.6); §9 | COACH-R4 R4-SES-05 (NOT RIGHT + his template) |
| 2 | **Session size by exercise count**, by client type (general 5-7, aesthetics 6-8, strength 5-6, bootcamp 5-7 stations, field athletes up to 12, older adults 5-6), not counting the warm-up or the 2 core exercises | §0; §7.2; §7.5; §8 "scaled from 45 to 90 minutes" | COACH-R4 R4-SES-02 |
| 3 | **No time-fitting.** Session length is not an input and not a limit; a day prints an average time estimate. The time-vs-minimums check and its per-template table are retired; `include_from_minutes` and `superset_below_minutes` are gone from the compiled templates | §0; §7.1; §7.4-§7.6; §8.7.1; §9 steps 3-4 | COACH-CT CT-01; COACH-R4 R4-SES-01 |
| 4 | **Two days = two full-body days** (v1.4, COACH-R5 R5-GEN-01; was: one A day and one B day); every big group at about 6-8 weekly sets; a third day suggested | §8 (2-day templates); §8.7.1 | COACH-R4 R4-SES-03; COACH-R5 R5-GEN-01 |
| 5 | **Nothing is dropped automatically.** The cut order is retired; each day names the easiest things to remove and the person decides | §7.6 | COACH-R4 R4-SES-04 |
| 6 | **Each slot keeps the laterality his template names** (two-leg squat or hinge in slot 2, single-leg in slot 4, a two-arm row first on the A day); the laterality dial moves only the slots the template leaves open | §4.5 | COACH-R4 R4-SES-05; athletic-day reading INFERRED |
| 7 | **Incline before overhead** in the vertical / mid-range push slot for bodybuilders and the general population; a **mid-range pull** category between the horizontal and the vertical pull | §1 (buckets); §8 | COACH-R4 R4-LIB-03 |
| 8 | **Supersets are a recommendation only**: the person switches a pair on; no session length does; pairs are suggested between neighbouring exercises | §5.1; §9 step 4 | COACH-R3 SES-02; COACH-CT CT-01 |
| 9 | **Everything is editable**, the sets of any day or week included; after an edit the totals are recomputed and the plan is marked edited | §9 step 11 | COACH-CX CX-02, CX-04 |
| 10 | **Set addition** follows the endpoint stairway: every trained group reaches its planned final sets; the sets are split over the template's slots; what the slots cannot hold goes to the bonus exercise or is capped and said | §6.13 | COACH-CX CX-01; COACH-R4 R4-PRG-01, R4-SES-04 |

### V2. The templates (replaces the layouts of §8.1, §8.2, §8.4 and §8.6)

**The A / B days (COACH-R4 R4-SES-05; slots 7-8 OBSERVED in his BYOP sheets, their order PROPOSED):**

| Slot | A day = pull + knee dominant | B day = push + hip dominant |
|---|---|---|
| 1 | horizontal pull, two-arm (a row) | horizontal push (bench press or machine chest press) |
| 2 | two-leg knee-dominant (a squat) | two-leg hip-dominant (a deadlift, a hip extension or a hip thrust) |
| 3 | vertical pull (a lat pulldown) | vertical push or an incline press ("more vertical than horizontal"); incline first for bodybuilders and the general population (R4-LIB-03) |
| 4 | single-leg knee-dominant (a lunge) | single-leg hip-dominant (staggered-stance DB deadlift, single-leg hip extension, glute bridge) |
| 5 | biceps curl | triceps extension |
| 6 | leg extension | leg curl |
| 7 | calves (3 sets) | side or rear delt |
| 8 | rear delt | calves (3 sets) |

| Family (exercises a session) | 2 days | 3 days | 4 days | 5-6 days |
|---|---|---|---|---|
| Muscle & Physique (6-8) | A, B | his 3-day builder: A, B, C (C = row, squat, press, hinge, lunge + chest, triceps, biceps) | **A1 squat\*, B1 hip thrust~, rest or optional, A2 leg press~, B2 deadlift\*, optional, OFF** (the full-body aesthetics sample plan) | + optional days (Focus 1, Focus 2, calves, cardio); alternative **push / pull / legs × 2** (the PPL sample plan) |
| General fitness / fat loss (5-7) | A, B | Bootcamp 1-2-3 circuits | A, B, aerobic, A, B (gym), or bootcamp circuits (the bootcamp sample plan); FAT BURN finishers | 5 rolling A / B circuits; 6 = Bootcamp 1-2-3 × 2 |
| Athletic Performance (up to 12; non-competitive 5-10) | athletic A, athletic B: the athletic block (a jump station and an Olympic lift first; a throw on A, agility on B), then the A / B lifts without arm isolation; in-season 2-day variant | S1 athletic A (heavy squat), S2 athletic B (non-axial hinge), S3 athletic C (heavy deadlift, push and pull) | A1 / B1 / optional / A2 / B2 / optional / OFF; BASEBALL Parts and HYROX variants as written; swimming dryland 3-4 days | + optional days |
| Strength (5-6) | FB_ME / FB_DE | squat / press / deadlift | ME lower Mon, ME upper Wed, DE lower Thu, DE upper Sat + A / B lead-lift weeks | + optional days |
| Hybrid / CrossFit (class: 5-7 around the skill and the WOD) | HY_1 / HY_2 | class squat / press / deadlift | CrossFit competitor days; **'crossfit_style_bootcamp'** alternative (the CrossFit-style bootcamp sample plan) | HYBRID 5 days; class 6 |
| No equipment | the goal's skeleton filtered by kit; 'NO ACCESS' is not this (R2-LIB-08) | | | |

**Built on his skeletons in v1.3:** the gym days of the physique, fat-loss and no-equipment families, push / pull / legs × 2, and the athletic days with their variants. **Left as written, only ranked:** strength (the work / the accessory / the nuance / the survival), the hybrid and class days, bootcamp circuits, BASEBALL Parts and HYROX. **Laterality:** each slot keeps the laterality his template names (master §5.5). **Push / pull / legs** prints in the order of his sheet (flies before dips; leg extension and leg curl before the single-leg hinge). Checks that hold this: the template skeleton and "nothing dropped" (engine check V30), the session size (V13). The v1.2 statement "all 30 templates regenerated with 2-4 exercises per group" is superseded by this table.

**v1.3: the template's slots keep their laterality (COACH-R4 R4-SES-05).** His template names the laterality of its slots: slot 2 is a two-leg squat or hinge ("bilateral, symmetrical"), slot 4 a single-leg lift, and the A day opens with a two-arm row. On gym A / B / C days, athletic days and push / pull / legs those slots keep it in every exercise block. The slider of §6.2 acts on the slots the template leaves open (the vertical pull, isolation details, jump stations) and through the exercise picked inside a slot; the share is read on those open slots. For field and court athletes, whose targets ask for 80-90 % single-leg work (UNI-02, UNI-03), this is an open question for the coach (master §0d.3 #3).

### V3. Session sizes (replaces §7.1, §7.2 and §7.5)

| Session type | Exercises (not counting the warm-up or the 2 core exercises) | Default sets | ID |
|---|---|---|---|
| General fitness / fat loss, gym days | **5-7** (his A / B day; 7 by default) | 3 compound / 2 isolation / 3 calves | **R4-SES-02**; VOL-16 |
| Aesthetics / bodybuilding | **6-8** (his A / B days; push / pull / legs as his sheet) | 3 compound / 2 isolation / 3 calves | **R4-SES-02, R4-SES-05** |
| Strength | **5-6**: the four roles + survival isolations | his template | **R4-SES-02**; ORD-07 |
| Bootcamp | **5-7 stations**; 3 / 4 / 5 rounds by level (PROPOSED) × 35-50 s | time-based | **R4-SES-02**; PRG-03 |
| Field athlete off-season | **up to 12** (jumps / throws + Olympic + lifts) + the 2-exercise core block | **2 per slot** | **R4-SES-02**; VOL-08, VOL-17, VOL-16; R2-SES-04 |
| Non-competitive athletic / stay athletic | 5-10 (his sheet has 10 slots; range PROPOSED) | 2 per slot | ATH-13 |
| Older adults 60+ | **5-6** | as the goal | **R4-SES-02** |
| CrossFit-style class | warm-up → light core → skill → strength / power → WOD; 5-7 lifts around the skill and the WOD (PROPOSED) | his class tables | OBSERVED; R2-GEN-07 |
| In-season athlete | 2 days a week (the 2-day athletic template, in-season variant) | 1-2 | PER-08 |
| Optional day | Focus 1, Focus 2, calves, core, aerobic; bonus exercises land here | Focus 2-3 sets each | ORD-10, ORD-11 |

**Lengths are estimates, never limits** (CT-01, R4-SES-01). Each day prints "Average time: about 60-75 min (an estimate, for information only)"; the arithmetic is in §5.6. "Sometimes it might be 45 minutes. Sometimes they can take off exercises and make it faster. Sometimes they can add exercises and make it longer. We don't need to be counting their time."

**Counting convention** (APPROVED R2-SES-04; R4-SES-02): warm-up drills never count; the 2 core exercises sit outside the count; a superset of two small isolations counts as one station.

**Time vs minimums: RETIRED** (CT-01; master §5.6.1). **Time-overflow rule: RETIRED** (round 3). Nothing is cut or reshaped for time, and nothing is dropped automatically (R4-SES-04).

### V4. Two training days, and what a template cannot hold (replaces §7.6 and §8.7.1)

"Every big muscle still gets trained, with fewer weekly sets (about 6-8 instead of 10), and the plan says so and suggests a 3rd day. We do NOT drop whole muscles, and we do NOT pile on more exercises" - "That sounds right ... People can add or remove or adjust accordingly. That's fine. We can maybe give them a small recommendation, but it's only a recommendation."

| Item | Rule | Tag |
|---|---|---|
| Days | **two full-body days** (COACH-R5 R5-GEN-01; was: one A day and one B day): day 1 pairs the A day's row and squat with an incline / vertical press and a single-leg hinge; day 2 pairs the B day's press and hinge with a vertical pull and a lunge. Together they train every big group | R4-SES-03; R4-SES-05; R5-GEN-01 |
| Weekly sets | every big group starts at 6 and tops at 8 (+ the Focus add); small groups take the same numbers at most; a 2-day maintenance plan holds no line above 8 | "about 6-8" R4-SES-03; exact numbers PROPOSED |
| The floor of 10 | applies from 3 training days | R4-SES-03; R2-VOL-06 |
| What the plan says | a plain note up front: with 2 days each big muscle gets about 6-8 sets a week; a third day would bring it to 10 or more | R4-SES-03 |
| Never | drop whole muscle groups; pile on more exercises | R4-SES-03 |

This replaces v1.2's reading of R3-SES-02 step 2 ("train fewer muscles directly") and closes round-4 candidate 2 (very short weeks).

Six to eight exercises a day at 2-5 sets each do not always hold every group at its planned final sets. The plan never drops anything to solve that, and it never hides it:

| Case | What the plan does |
|---|---|
| The slots cannot hold the group's planned sets, and there is an optional day | his bonus exercise on the optional day (2-4 sets), opened at the exercise-block start that first needs it |
| No optional day | the group is capped at what its slots hold; the plan says "Chest: 13 of 25 planned sets - your template holds 13; add a day or an exercise to reach more" |
| The slots hold fewer than the floor (10, or 6 on 2 days) | the plan says the group is under its floor, and by how much |
| The group has no exercise of its own (a field athlete's arms; a line a client type leaves to the compound lifts) | listed as "trained through the compound lifts" |
| The person wants a shorter day | each day lists the easiest things to remove, in this order: the conditioning finisher, extra jump / throw stations, small-muscle accessories, bonus exercises. Always kept by the generator: the 2 core exercises, the main lifts and, for athletes, the first athletic station. The person decides (R4-SES-04: "they get to pick what they want to keep or what they want to take away") |

### V5. Editing the plan

"They should be able to turn off that day's athletic training or that day's core training and just focus on resistance. Maybe a pickleball player that played a lot of pickleball has a lot of soreness in their calves, or their connective tissues just don't feel like doing any plies and things like that. Then it could be turned off, or they can delete certain exercises, because an athlete or a coach should be able to modify accordingly. The options should be: Recommend supersets; Adding or removing exercises or blocks within the training session." (R3-SES-02) "It's already a template, and you need to adjust it as you need to." (R3-VOL-04)

"This is essentially a tool that's going to allow people to set up their templates a lot better, and it should be all editable as they need to. Ideally, the tool is just so great and smart that edits are probably not going to be needed ... it will be editable, but they might not need to most of the time." (CX-04) "should be editable if they want to adjust their sets on that week or that day doesnt matter" (CX-02)

| Control | What it does | Tag |
|---|---|---|
| **Blocks with stable ids** | every block of every day carries an id that does not change between the weeks of an exercise block, e.g. `blk.A.core.1`, `blk.A.athletic.1`, `blk.A.olympic.1`, `blk.A.strength.2`, `blk.B.calves.1`, `blk.A.finisher.1`; items keep their slot ids, added items get `edit.<n>` | R3-SES-02; format PROPOSED (spec `plan_editing.block_ids`) |
| **Block switch (on / off)** | `core`, `skill`, `athletic` (jumps, throws, agility, sprints), `olympic`, `accessory`, `calves`, `focus` (optional-day Focus slots), `finisher` (conditioning finishers and HYROX station circuits) and `cardio` carry `optional: true, toggle: true` (the union of the 05 / 12 and 13 / spec lists, master §0.3); the `warmup` cannot be switched off; the `strength` block (05 / 12 `resistance`) is edited exercise by exercise (or removed as a block); default scope "this day every week of the exercise block", or "this day only"; switched-off blocks stay visible, greyed, and print as "(switched off)" | **R3-SES-02**; per-kind flags PROPOSED |
| What a switch changes | athletic, Olympic, core and conditioning work never count as muscle sets (VOL-10), so switching them off changes no stairway and no weekly set number (the opener's abs credit drops for that day); the day's time estimate drops by that block's minutes | VOL-10; R3-SES-02 |
| **Remove an exercise / a block** | removes it (this day or every week of the block); the remaining exercises keep their planned sets and keep climbing; **the sets of a removed exercise are not moved elsewhere automatically** (13 / spec; 12 v1.2 §3.10.2 would move them to the group's other exercises that day - cross-file decision §0.3); when a removal leaves a group with 1 exercise that day, the editor says so; the person's choice wins | R3-SES-02; R2-SES-05; mechanism PROPOSED |
| **Change the sets** (v1.3) | the sets of any exercise, on one day or in one week or for the rest of the block; the weekly sets per group are recomputed from what is now written | **CX-02, CX-04** |
| **Easiest to remove** (v1.3) | each day prints "Easiest to remove if you want a shorter day (your choice)": the conditioning finisher, then extra jump / throw stations, then small-muscle accessories, then bonus exercises; at most 6 names; nothing is removed by the tool | **R4-SES-04** |
| **Optional add-ons** (v1.3) | the plan lists up to 6 optional add-ons that fit the person (joint care for their pain areas, the add-ons marked for their sport, a farmer carry for general and athletic goals); the person adds one with an edit; carries land in the conditioning block and count no muscle sets | **R4-LIB-01, R4-LIB-02**; list size and order PROPOSED |
| **+ Add an exercise / a block** | the list offers only what the generator could have picked for this person (equipment, level, age and pain rules, exclusions; never V-squat, bands or 60+ power work without the switch and its warning); **rear-delt work is always offered on upper days** ("People and coaches should always be able to add more rear delts"); default sets compound 3, isolation 2, calves 3; an added exercise climbs with its group's stairway from the week it is added; blocks: a core superset or monster set anywhere (R2-SES-03), an accessory block, a cardio session | **R3-SES-02, R3-VOL-01**; R2-SES-03 |
| **Swap** | the same-category dropdown (GEN-04); one-detail variations only (R2-LIB-01) | GEN-04 |
| **Superset suggested** | every eligible pair (knee lift + pull, hip lift + push, biceps + rear delts, triceps + side delts, calves + delts, core supersets) carries `{pair_id, items, minutes_saved, on}`; shown by default ("Recommend doing supersets so that it's a faster workout"); the person switches a pair on - no session length does (CT-01); suggested only between neighbouring exercises, so nothing is reordered; never two lower compounds, never a heavy lift with a fatiguing lift for the same muscle (contrast excepted) | **R3-SES-02**; ORD-05 |
| **Reset** | "Reset to the generated plan" undoes every edit | PROPOSED |
| After an edit | the weekly sets per group are **recomputed**; the plan is **marked edited** (`plan.edited = true`, with the list of edits); the checks run again and their result is stamped "edited" - **no old "validated" stamp stays on a changed plan**; where the edit leaves the template's rules (a trained group under its floor, a day without its core block, a day above its exercise count) the tool lists it as a note - **notes, never refusals, and nothing is repaired behind the person's back**: the locked rules bind what the generator builds and what the "add" list offers, not what people take out of their own plan | **CX-04**; R3-VOL-04, R3-SES-02; mechanism PROPOSED |
| Where edits live | inside the plan (`plan.edits[]` on top of the generated plan); they travel with the plan link and the plan file and are printed in every image, PDF and sheet; Blaze Camp keeps nothing | **R3-GEN-01** |
| What every export says | "You can switch off today's jump / throw block or core block, remove or add exercises or blocks, and do the suggested supersets to save time" (copy C17, `edit.hint`), with the optional blocks and suggested supersets marked, so a coach's screenshot tells the client what they can change | **R3-SES-02** |

The generator still builds every plan by the rules first: the core opener every session, the athletic budget, his template complete, calves on leg days, the floor on every trained group from 3 training days, a stairway that reaches its planned final sets. It does not shorten or trim a plan for anyone. The person does that, with the hints above (R4-SES-04). An editable template is not a guarantee that every possible edit follows the rules (CX-04's record). The engine's edit function is `applyPlanEdits(plan, edits, model)` in `engine/edit.mjs` (`set_sets`, `remove_exercise`, `add_exercise`, `set_block`); the generated plan is never changed in place.

---


## v1.2 - round-3 answers applied (2026-10-09)

> **Changed again in v1.3.** This list is the v1.2 change record, kept as written. Its rows about the time check and time vs minimums (R3-SES-02: offers, "fewer groups trained directly", "never flat"), about the 7 % and 10 % limits, and about the next block's "cap + 1" were changed again by COACH-CT CT-01, COACH-CX CX-01..04 and round 4. The v1.3 section above wins.

**Authority order:** round-3 answers > round-2 answers > round-1 answers > everything else. `coach_answers_round3.md` was read in full first. Every split template was rebuilt by the v1.2 build script (one calf exercise per leg day, block ids and toggles, superset recommendations) and re-checked (8.7); the time-vs-minimums check (8.7.1) replaces v1.1's floor-of-10 table. The observed evidence in section 2 is unchanged. The v1.1 and v1 change logs below are kept as history; the v1.1 rows that round 3 changed are marked ‡.

### What changed in v1.2 (one line each, with the round-3 IDs)

| # | Change | Coach answer | Where |
|---|---|---|---|
| 1 | **Groups approved; calves one exercise.** The 2-4 rule counts the coach's FOCUS groups - quads, hips (glutes + hamstrings), chest, back, shoulders (front, side, rear delts + traps), biceps, triceps - and **calves are one exercise x 3 sets on every leg day** (4 at 90 min), never a second calf exercise. Every template was rebuilt: the `<calf + calf>` superset is gone; bootcamp circuits keep one calf station (3 rounds = 3 sets); the BASEBALL Part F second calf exercise is removed (Part D's calf carries the 3 sets). | COACH-R3 SES-01 (RIGHT) | 0, 4.7, 5.1, 6.6, 7, 8 |
| 2 | **Field athletes:** 2-4 exercises for each group trained that day inside 12 + the 2-exercise core block; with the cross pattern that leaves 2 jump / throw stations + 1 Olympic lift, so cross pattern stays the default; the same-pattern athletic template (3-4 jump stations + 1 Olympic lift) is for size-focused and high-level athletes (11.3 question answered). | COACH-R3 SES-01 (RIGHT) | 7.2, 8.2 |
| 3 | **Rear delts are part of the shoulders group** ("I wouldn't categorize the rear delt as an individual muscle"): their own 4 / 6 / 8 sets are retired as a number; every week keeps a rear-delt exercise (on pull days the rear delt + the KB face pull are the shoulders group's 2 exercises); "add rear delts" is a plan-editing option. The floor of 10 is read on groups. | COACH-R3 VOL-01 (PARTLY) | 6.13, 4.7 |
| 4 | **Focus muscle 1 and Focus muscle 2** replace the intake "priority muscle": +1 to +3 weekly sets each (default +2), first in their session, delivered through their own exercises, then the optional day's Focus 1 / Focus 2 slots. | COACH-R3 SES-01 | 6.6, 6.13, 9 |
| 5 | **Time vs minimums replaces the time-overflow rule**: when the chosen days x minutes cannot hold the minimums, the plan says so up front and offers another day or the length that fits; if the user keeps the time, fewer groups are trained directly; supersets are recommended; the stairway climbs on every trained group. Every template is checked at week 1 (with the floor) and at an 8-week peak (8.7.1). | COACH-R3 SES-02 (RIGHT) | 5.1, 7.4, 7.6, 8.7.1, 9 |
| 6 | **Superset recommendations**: every main day lists its eligible pairs, marked "recommended" (the day also fits in straight sets) or "needed" (it fits only with them) - "Recommend doing supersets so that it's a faster workout". | COACH-R3 SES-02 | 5.1, 8.7; JSON `superset_recommendation_R3SES02` |
| 7 | **Plan editing**: every station carries a block id (warm-up, core, skill, athletic, Olympic, resistance, focus, conditioning); the user or coach may switch a day's athletic, Olympic, skill, core, focus or conditioning block off, and add or remove exercises or whole blocks. Toggles change no muscle-set number. | COACH-R3 SES-02 (RIGHT) | 6.10, 9; JSON `blocks_R3SES02`, `rules.plan_editing_R3SES02` |
| 8 | **No check-in, nothing stored.** The v1.1 check-in hooks (the step table, effort 10 = hold -1 set, the block-at-risk prompt, the maintenance end prompt, test reminders, the week-by-week mode) are retired; the plan follows its planned stairway (approved) and prints a self-adjust guide. | COACH-R3 VOL-02, VOL-04, GEN-01 | 0, 6.12, 6.13, 9 |
| 9 | **Set addition approved**: Monday's first exercise, then Thursday's; a small muscle's bonus exercise goes on the optional day, or on a day that already trains it, never as its only exercise that day. | COACH-R3 VOL-03 (RIGHT) | 6.13 |
| 10 | **Calendar**: the easy week after a block is a recommendation, not mandatory; the block ends and the user builds the next; holidays and vacations sit between blocks. | COACH-R3 PER-01 (RIGHT) | 6.12 |
| 11 | **Sport dial and populations**: swimming dryland (3 days + 1 optional, 25 % plyo, 0 extra cardio, shoulder care every session, Olympic lifts 2-3 days, taper with the swim taper); older adults (60+) landing drills, balance, quick stepping, light medball throws and fast machine work on, ankle hops / other jumps / Olympic lifts / depth jumps off by default; pickleball, padel and tennis players 50+ calf and Achilles work every leg day, rotator cuff, low-impact jumps; HYROX plan; the R3-ATH-04 plyo shares for every remaining sport; stay-active play days, activity sessions as cardio, event dates. | COACH-R3 ATH-01..05 (RIGHT) | 6.7, 6.15, 8.2, 8.5, 8.8, 8.9 |
| 12 | **Questions**: 11.3 questions on the grouping, the field-athlete layout, swimming, pickleball 60+, rear delts / check-in and the floor at the start are answered; new questions 11.4. | as listed | 11 |

### Still pending after round 3

- PROPOSED or INFERRED in v1.2: the time-vs-minimums estimates (8.7.1; the engine owns the numbers) and the 10 % fit tolerance; the optional-day Calves slot when the leg days cannot reach 10; the block ids and which blocks a user may switch off; the "recommended" / "needed" superset wording; the stay-active, HYROX and swimming session mappings (8.2, 8.8, 8.9); sprints off by default for 60+ (treated like jumps).
- Still PROPOSED from v1 / v1.1: rolling A/B for 5-session bootcamp weeks; 105/120-min options; laterality default shares; the role mapping of other families onto work / accessory / nuance / survival; conditioning finishers outside the cap; the cross-pattern second exercise as a lighter isolation; two circuits per bootcamp day; BASEBALL Part F.
- Open: 11.3-2, 11.3-3, 11.3-5, 11.3-6; round-1 questions 11, 16, 17, 19, 20, 24, 25; new questions 11.4.

---

## v1.1 - round-2 answers applied (2026-10-08; history)

**Authority order:** round-2 answers > round-1 answers > everything else. `coach_answers_round2.md` was read in full. Every split template was rebuilt by a script and re-checked (8.7); the observed evidence in section 2 is unchanged except for added v1.1 notes. The coach's request of the same day - every popular US sport, swimming, and pickleball / HYROX for people who want to stay athletic and active - is covered here at session level (8.2 sport dial, 8.8, 8.9); the sport profiles themselves live in `04_profiles.json` v1.1.

### What changed in v1.1 (one line each, with the round-2 IDs)

| # | Change | Coach answer | Where |
|---|---|---|---|
| 1 ‡ | **2-4 exercises per muscle, never 1.** On every lifting day, each muscle group the day trains gets 2-4 exercises: "full-body days need to have the same 2-4 exercises per muscle that day, so it might be a little longer day. It could start really short." Every full-body, bootcamp and 2/3/4-day template was regenerated; a new per-day check counts exercises per group. | COACH-R2 R2-SES-05 (PARTLY to our 1-2 proposal) | 4.7, 6.13, 7, 8 |
| 2 | **Two spine days - approved.** Heavy squat Monday, heavy deadlift Friday; Tuesday a non-spinal hinge (hip thrust, back extension, reverse hyper); Thursday leg press or belt squat. The counted list (barbell back / front / zercher / overhead / Smith squats; barbell or trap-bar deadlifts and RDLs; good mornings) and the not-counted list (leg press, belt squat, hip thrust, back extension, reverse hyper, single-leg DB work, Olympic lifts, loaded jumps) are approved. Goblet, hack squat and pendulum are fine on the second day if not sore. Powerlifters may add a light technique squat or deadlift. | R2-SES-01, R2-SES-02 | 6.4, 8 |
| 3 | **Light core opener - approved**: 2 exercises x 2 sets, short of failure. New: coaches and users may add core supersets or monster sets anywhere. | R2-SES-03 | 3.1, 6.10 |
| 4 ‡ | **Field-athlete cap - approved**: up to 12 exercises + the 2-exercise core block. Warm-up drills never count; a superset of two small isolations counts as one. Checked on every day (counted exercises). | R2-SES-04 | 7.2, 8.2 |
| 5 ‡ | **Cardio is adjustable.** "I need more cardio" adds sessions, "less cardio" removes them. Aesthetics 4 = Blue + Green + Orange + a second easy Orange, plus optional 20-30-min walks. Athletes off-season 2-4 by sport, pre-season 2, in season 2; powerlifters 2 easy Orange. | R2-SES-06, R2-ATH-06 | 6.7 |
| 6 | **Olympic lifts up to 4x a week.** Clean days are the squat-pattern days, snatch days the hinge-pattern days ("I take snatches a little bit more hingy"). Every generated athletic main day carries one, except the BASEBALL Parts Tue/Fri hang snatch, which stays 75+ as OBSERVED (a 60-min Parts week has Olympic work on Mon/Thu only). Full squat cleans / snatches 3-5 reps; DB/KB and pulls keep the 4x8 -> 4x4 ramp; weight by RPE / RIR and speed; a % only when the athlete entered a tested recent best; %-driven Olympic programming only for competitive Olympic lifters. | R2-ATH-04, R2-ATH-05, R2-GEN-06 | 6.15, 8.2 |
| 7 ‡ | **Older adults (60+):** no Olympic lifts, plyos or depth jumps by default; landing drills and low ankle hops are fine; the rest is optional with the warning "Make sure that you have a fitness professional to help you understand what this means." Youth: floor lifts from about 14 after one hang block. | R2-ATH-08 | 6.15, 8.2 |
| 8 ‡ | **Sport dial updated**: plyo share by sport (sprinters 75% ... combat and golf 25%; each block starts 15 points more ballistic), ballistic vs plyometric jump lists, Receive-Create stages (1 Land, 2 Land & Go, 3 Repeat), in-season game-heavy reductions keyed to the season start date and game days. | R2-ATH-01, -02, -03, -07, R2-GEN-05 | 8.2 |
| 9 | **KB face pulls = shoulder work** (side / rear delts / traps) on pull or shoulder days - they are now the second shoulder exercise of knee + pull days; never a vertical pull. | R2-LIB-04, LIB-10 | 1, 8 |
| 10 | **KB swings are ballistic only** - never glute or hinge volume. Removed from the non-axial hinge pool; the OT11 S2 swings move to the power block; BASEBALL Friday swings are ballistic partners. | R2-VOL-05 | 6.4, 8.2 |
| 11 ‡ | **No deload inside a block.** Blocks are completed; a client who cannot finish cancels the block, does a maintenance phase (length chosen, extendable), then starts a new block. Every plan is a stairway (hardest weeks last). Tests before the block and at the end, never mid-block, never a 1RM or max mile from zero. | R2-VOL-07, R2-PER-03..07 | 6.12 |
| 12 ‡ | **Set addition**: added sets alternate between the two weekly exposures of a day type; a bonus exercise goes on the optional day (default - the coach did not understand R2-VOL-08). Floor of 10 sets per muscle per week, small muscles too. | R2-VOL-08 (default), R2-VOL-04, R2-VOL-06 | 6.13 |
| 13 ‡ | **Check-in hooks**: no check-in = the planned stairway, unchanged; a check-in changes the step from effort, completion and pain only (the approved table's "life" column is dropped because the coach rejected lifestyle inputs). Effort 10 = "the max I could do, but successful". | R2-VOL-01, -02, -03, R2-GEN-04 | 9 |
| 14 | **Library**: one-detail variations between blocks (never invented exercises); bench push-ups both ways; home additions (KB curl, table row, floor Y/T raises) and Olympic L1 additions in the pools; 'NO ACCESS' = a self-serve version without coach access (not no-equipment). | R2-LIB-01, -05, -07, -08, LIB-12 | 2.1, 6.3, 8.6 |
| 15 | **Bootcamp = two circuits a day** of 4-6 stations each (inside the coach's 5-7), 3 rounds x 35-50 s, 35-45 min - so every muscle group gets 2 stations. | R2-SES-05 + COACH-ANSWER PRG-03 | 5.3, 8.4 |
| 16 | **CrossFit-style class and bootcamp**: warm-up -> light core -> skill -> strength/power -> WOD, with the coach's own level tables (HALF TIME class, FULL TIME competitor, WOD level, aerobic level). New template for the coach's sample plan. | R2-GEN-07; OBSERVED OT17 / OT18 | 5.5, 8.5 |
| 17 | **Sample-plan map** for the plans the coach will grade: swimming, football, soccer, CrossFit-style bootcamp, bootcamp, full-body aesthetics, push/pull/legs. | R2-GEN-07 | 8.8 |
| 18 ‡ | **Stay athletic and active (gen pop)**: pickleball, padel, rec tennis, golf, rec leagues, running / hiking, HYROX for fitness mapped onto the non-competitive athletic and hybrid templates. | coach request 2026-10-08 | 8.9 |
| 19 ‡ | **BASEBALL Parts week**: a 'Part F' gives each muscle group of the day its second exercise (INFERRED application of R2-SES-05). | R2-SES-05 | 8.2 |
| 20 | **Gen-pop year plan** is fully user-tunable (re-order blocks, more or less cardio, a winter powerlifting-style block) - planning lives in 06. | R2-PER-01, R2-PER-02 | 6.12 |
| 21 | **The 21.6-mile run is removed**; the half-marathon plan (Chris Hinshaw) stays the longest run. | R2-LIB-06 | 2.7 |
| 22 ‡ | **Floor of 10 vs the 2-set start (added by the v1.1 adversarial check).** At 2 sets per exercise, 2-3-day plans, upper/lower weeks, arms in 4-6-day weeks and the CrossFit-style class leave some muscles at 2-9 weekly sets; the volume engine lifts them to 10 in week 1, so those first days are longer than the 8.7 start estimate. Recomputed per template (8.7.1); asked in 11.3. | R2-VOL-04, R2-VOL-06, R2-SES-05 | 4.7, 7.4, 8.7.1 |

### Resolutions the coach should see (v1.1; round 3 settled 1-5, 7 and 8 - see the v1.2 table)

1. **Check-in without lifestyle questions (R2-VOL-01 vs R2-GEN-04).** The approved check-in table had a "life was harder / better" column, but the coach later said "I just need the workouts... no need to talk about sleep or stress or anything else". Resolution: the intake and the check-in ask nothing about sleep, stress, life or a physical job; the weekly step comes from effort, completion and pain only. Flagged for round 3.
2. **Rear delts 4 / 6 / 8 vs the floor of 10 (R2-VOL-04 vs R2-VOL-06).** The rear-delt numbers were approved, but the coach also said "I don't think anybody needs less than 10". The templates give rear delts their own exercises every week (on pull days two shoulder exercises, one of them the KB face pull), so either number can be reached; the numbers live in the volume engine, which reads the floor of 10 on the whole shoulders/traps group (rear + side delt work together, 12 v1.1, INFERRED). Flagged.
3. **R2-VOL-08 was not understood.** Our default is kept and marked: added sets alternate between the two weekly exposures (Monday's first exercise, then Thursday's), and a bonus exercise goes on the optional day.
4. **How "2-4 per muscle" is counted (INFERRED).** Muscle groups = the coach's FOCUS headers, with glutes + hamstrings counted together as "hips" and front / side / rear delts + traps as "shoulders". On cross-pattern days the second exercise of each lower group is a lighter one (leg extension after the squat, leg curl after the single-leg RDL), like the coach's own BOOTCAMP 1 A day. The second calf exercise starts at 1 set (2 + 1 = VOL-17's 3 calf sets).
5. **Athletes: cross pattern vs the 12 cap.** With the cross pattern, 2 exercises per muscle uses 9 of the 12 counted slots, which leaves 2 plyo/ballistic stations + 1 Olympic lift. The coach's own same-pattern athletic template (OT04) needs fewer and keeps 3-4 + 1. The cross pattern stays the default (UNI-06); the question is asked again (11.3).
6. **Conjugate strength days stay as written** (four roles, ORD-07) and are flagged where a muscle has one exercise; asked in 11.3.
7. **Longer days.** Full-body days start at about the chosen length with 2 sets per exercise and grow by roughly half by the end of a block (upper estimate). The coach accepted "a little longer day"; the generator supersets first and never cuts a muscle to one exercise.
8. **Floor of 10 vs 2 sets per exercise (R2-VOL-04/06 vs R2-SES-05; found by the v1.1 adversarial check).** In plans that train a muscle once or twice a week with 2 exercises, 2 sets each give it only 4-8 weekly sets, below "I don't think anybody needs less than 10". The volume engine (12) adds the missing sets in week 1, so the first days run longer than "about the chosen length" - about +2-4 min in most 4-6-day plans, but most often +10-25 min (up to about +39) on the longest day of 2-3-day plans, upper/lower weeks and the CrossFit-style class (8.7.1, INFERRED time model). Flagged for round 3 (11.3-10).

### Still pending after round 2 (history; the v1.2 list is above)

- PROPOSED or INFERRED in v1.1: the muscle grouping for R2-SES-05; the cross-pattern second exercise; two circuits per bootcamp day; the 2 + 1 calf start; athlete default under the 12 cap; BASEBALL Part F; the CrossFit 8-week code reading; the stay-active and swimming mappings (8.8, 8.9); the mapping of every other US sport to its nearest ground-contact class (8.2); the floor-of-10 week-1 time estimates (8.7.1); sprints off by default for clients over 60 (treated like plyos).
- Still PROPOSED from v1: the time-overflow rule; rolling A/B for 5-session bootcamp weeks; 105/120-min options; laterality default shares; the role mapping of other families onto work / accessory / nuance / survival; conditioning finishers outside the cap.
- Round-1 questions still open: 11 (buy-outs on every 60+ min athletic session), 16, 17, 19, 20 (minimum home kit), 24 (vertical press optional for physique / fat loss), 25 (CrossFit WOD days by month or by level).
- New questions: 11.3.

---

## v1 - coach answers applied (round 1; history)

*The rows below are the v1 (round-1) changes. Where v1.1 changed a rule, the v1.1 table above and the sections below take precedence.*

### What changed (one line each, with the question IDs)

| # | Change | Coach answer | Where |
|---|---|---|---|
| 1 | **Core first, for everyone.** Every session of every family opens with a core block right after the warm-up: about 2 exercises. The user may move it after the plyos, after strength or to the end. Replaces "core primer only in athletic programs" and "core on optional days for hypertrophy". | ATH-11 (NOT RIGHT to v0), VOL-17 | 3.1, 6.10, all templates |
| 2 | **Pairing rule is universal and slot-level.** In any session that mixes lower and upper work, hip-dominant (back of the lower body) goes with a push (front of the upper body) and knee-dominant goes with a pull. Reason: no bleed-over, more total work across the week. Also for full body and bootcamps. | UNI-11, ORD-06 | 4.1, all templates |
| 3 | **BOOTCAMP 1 Tue/Fri was a mistake.** 'Bilateral HD' -> 'Vertical Pull' -> 'Unilateral KD' -> 'Horizontal Push' becomes hinge + horizontal push, single-leg squat + vertical pull. The G2 grammar is redefined. | ORD-06, UNI-11 | 2.1 note, 4.4, 8.4 |
| 4 | **The vertical vector is no longer "free".** It follows the lower pattern it is paired with. The athletic themed days (G8) and HYBRID Saturday are re-wired. | UNI-11 | 4.4, 6.1 |
| 5 | **Same-pattern vs cross-pattern is a rule by goal.** Same pattern (squat + lunge) to drive a muscle harder: physique, bodybuilding, strength, high-level athletes who need more stimulus to grow. Cross pattern (squat + single-leg hinge) for less soreness: bootcamp, fat loss, general fitness, athletes by default, in season. The athletic default switches to cross pattern; the BYOP same-pattern athletic grammar stays as a variant. | UNI-06 | 4.2, 8.1-8.2 |
| 6 | **Row before pulldown, horizontal before vertical, everywhere.** FAT BURN / 4 TRACKS / boxing pulldown-first is not followed. | ORD-01 (+ coach chat) | 3.3 |
| 7 | **"The work" first**, even when it is vertical. | ORD-02 | 3.3 |
| 8 | **Power before strength**, always (HYBRID's strength-before-OLY is not followed). | ORD-03 | 3.1, 8.5 |
| 9 | **Calves / side raises first only when that muscle is a priority.** Default position: end of the session. | ORD-04 | 3.4, templates |
| 10 | **Supersets are a fatigue and time tool** with four use cases: short session; advanced athlete who needs more stimulus; off-season VO2max / mitochondrial work; beginner who does not fatigue. Intermediate with enough time = straight sets (INFERRED from the four cases). | ORD-05 | 5 |
| 11 | **The work / the accessory / the nuance / the survival** confirmed (1 RIR / 2 RIR / MAX / done no matter what). Strength cut order changed: the survival is never cut first. | ORD-07 | 6.14, 7.6 |
| 12 | **Warm-up always** (5 min any cardio + A-drills or mobility). A-drills never count as volume or toward the exercise cap. | ORD-08 | 6.11 |
| 13 | **Fighters' cardio-first blocks are real aerobic work.** | ORD-09 | 3.4, 6.7 |
| 14 | **Optional days**: add-on or separate, ideally separate. **Focus slots** may hit the same muscle, 2-3 sets each, to bring a priority muscle to its weekly target. | ORD-10, ORD-11 | 6.6 |
| 15 | **Set-addition order**: the first exercise of the day first, then the next (2/2/2 -> 3/2/2 -> 3/3/2 -> 3/3/3 -> 4/3/3); 3-4 exercises per muscle group per day; small muscles at the end get a bonus exercise. Retires the v0 "at most 2 exercises per muscle per session". The weekly 3/5/7% rate is chosen by the person's state, never by muscle size. *[v1.1: superseded - the plan follows a planned stairway; a check-in changes the step from effort, completion and pain only, never from sleep, stress or life (R2-PER-03/04, R2-VOL-01/03, R2-GEN-04).]* | VOL-07, VOL-05, VOL-06 | 6.13 |
| 16 | **Session length and caps by population.** Athletes, bodybuilders, powerlifters, pros about 90 min (max 2 h); general / weight loss 45-60 min; bootcamp 35-45 min. Resistance-only 5-7 exercises (45 min ~5, 60 min ~6-7, 75-90 min ~8-9). Field athletes off-season up to 10-12: 2 core + 2-4 plyo/ballistic + 2-3 Olympic/power + 3-4 resistance. Replaces the v0 "everyone at 60 min" anchor. | UNI-09, VOL-08, VOL-16, VOL-17, PRG-03 | 7 |
| 17 | **Calves 3 sets every leg day; rear delts get their own sets.** A rear-delt station is added on pull days; after the v1 verification every family has calves on every leg day at every length and at least one rear-delt station a week at its default lengths. | VOL-17 | templates |
| 18 | **Axial loading once a week per pattern.** One axial squat and one axial hinge a week; the second squat exposure is leg press or belt squat, the second hinge exposure is non-axial (hinge pool PROPOSED). | PER-04, EQ-11 | 6.4, templates |
| 19 | **Second weekly exposure = a different exercise** (confirmed), now also non-axial for squats and hinges. Blocks of 4-6 weeks with one or two small variable changes; A/B lead-lift weeks optional for variety seekers. | PER-04, PER-02, PER-03 | 6.3 |
| 20 | **Bootcamp = timed circuits**: 4, 5 or 6 sessions a week; 5-7 stations x 3-5 rounds x 30-50 s; 35-45 min. Bootcamp circuit day types added. | PRG-03 | 5, 8.4 |
| 21 | **PPL weekdays flexible.** | PRG-02 | 8.1 |
| 22 | **Levels L1 / L2 / L3.** Novice = newby (same) = under about 6-12 months; intermediate = consistent for over a year; more than 6-12 months off = body treated as L1; ex-pros start L1 briefly. | PRG-05 | 1, JSON `levels` |
| 23 | **One algorithm for every level and model**; no level-specific rep schemes in templates (the UL upper-day pattern was a fill error). | PRG-06 | 8, 9 |
| 24 | **Dose notation**: '12/10/8 -20' = pyramid (12 mid, 10 heavier, 8 heaviest) then drop to a light 20 (4 sets); '10/10' = per side on unilateral work (1 set). | PRG-07, UNI-01 | 1 |
| 25 | **Generic program names**; 'JUSTICE LEAGUE' = a marketing name for a non-competitive (weekend-warrior) athletic program for adults and youth. | FIX-03, ATH-13 | 1, JSON `program_names` |
| 26 | **Aerobic sessions per week**: 3 general / fat loss, 2 athletes in season, 4 aesthetics / bodybuilders + long walks after workouts (the whole Muscle & Physique family; verification pass 2). | ATH-07 | 6.7, 8.1 |
| 27 | **Olympic work for everyone in athletic training** (L1: DB/KB snatch, hex-bar jumps, hang pulls / hang cleans; L2-L3 full lifts) - every athletic week at every length, the BASEBALL Parts week included (verification pass 2); youth may lift from the floor; older clients few plyos unless they ask; no sex-based rules. | ATH-10, ATH-09 | 8.2 sport dial |
| 28 | **Sport dial on ground-contact time** (long ground contact -> more ballistics; short -> more plyos); programs start ballistic and become plyometric; the plyo method progression is not a "zone". | ATH-01, ATH-02, CAT-10, CAT-11 | 8.2 |
| 29 | **Boxers: reduce, never cut** pressing and arm volume when punching volume is high. | ATH-04 | 6.1, 8.2 |
| 30 | **No medball for aesthetics** except as warm-up; medballs never over 20 lb. | ATH-05, EQ-06 | templates |
| 31 | **COD stays for every athlete**, tiered by turn angle. Every generated athletic week from 60 min carries COD (hip days from 60, knee days from 75, 3-day S1 from 60; verification pass 2). | ATH-06 | 8.2 |
| 32 | **Contrast / French contrast**: L2+ athletes off-season, about 78-85%, no rest inside the complex (keep the coach's immediate format). | ATH-12 | 5 |
| 33 | **Deload** = about half the sets, same exercises, lighter, no buy-out or finisher. **Tests** by checkbox at block start, or none. **Plan shapes** (4-6 week maintenance, 8, 12, week-by-week, yearly) follow PER-01 (details in 06). *[v1.1: no deload inside a block - "about half the sets" now describes the maintenance phase after a completed or cancelled block (R2-VOL-07); the 8- and 12-week shapes are stairways (R2-PER-03/04); tests before / at the end only (R2-PER-07).]* | PER-05, PER-07, PER-01 | 6.12 |
| 34 | **Laterality dial** (bilateral:unilateral 90/10 to 10/90 by athlete, phase and pain); contralateral loading pulls into the hip (COD athletes), ipsilateral helps out of the hip (sprint acceleration). | UNI-02, UNI-03, UNI-10, CAT-13 | 4.5 |
| 35 | **Volume credit from the exercise picked**: helpers 0.25, dips 0.5/0.5, 10/10 = 1 set, athletic patterns never count - so ankle hops in the BASEBALL 'calfs' slot no longer count as calf sets. | VOL-09, VOL-10, LIB-16, UNI-01 | 9 |
| 36 | **No bands, no variable resistance** in any pool (banded pulldowns, band-assisted pull-ups, band chops removed); 'Camporini Deadlift' and 'strap rotating in/out' removed; 'Pull under' = lat pull-over. | EQ-01, EQ-07, EQ-08, EQ-12, LIB-09 | 8.6, templates |
| 37 | **All 30 split templates regenerated** (2-6 days x 6 families) plus variants, each with recomputed checks: pattern frequency, slot-level pairing, axial budget, core-first and horizontal-before-vertical order, power before strength, exercise caps and a time estimate. No template fails a check except documented observed-design exemptions. | all of the above | 8, JSON |

### Still pending (as of v1)

*v1.1 status: PRG-01 / FIX-01 answered (R2-LIB-08: 'NO ACCESS' = self-serve); LIB-10 / LIB-12 answered (R2-LIB-04, R2-LIB-05); the non-axial hinge pool, the axial spacing, the core-block dose and the cap counting are approved (R2-SES-01..04); see 11 for every question's status.*

- **PRG-01 (skipped):** what 'NO ACCESS' means on the two hidden tabs. Their generic names are on hold.
- **FIX-01 (skipped):** the NO ACCESS - AESTHETICS Tuesday 'Unilateral HD' dropdown that points at LEG CURLS.
- **LIB-10 / LIB-12 (no answer):** 'KB Face Pulls' under VERTICAL PULL; 'Bench Push ups' hands vs feet on the bench.
- **PROPOSED - PENDING COACH APPROVAL:** the non-axial hinge pool; axial squat Monday / axial hinge Friday spacing; a submaximal core block when it opens the session; the exercise-cap counting convention; the time-overflow rule (superset first, then cut); the rolling A/B order for 5-session bootcamp weeks; 105/120-minute options for competitive athletes; default laterality shares beyond the coach's anchor points; the role mapping of other families onto work / accessory / nuance / survival.
- **INFERRED applications to confirm:** the strength lower-day 'nuance' vector and position under UNI-11; the dynamic-effort speed lift as the week's only axial exposure of its pattern; which athletes get same-pattern days; the COD day placement (hip days from 60 min, knee days from 75, 3-day S1) and whether BASEBALL / in-season weeks need COD (11.2-15); the short 2-set Olympic piece that keeps Olympic work in 60-75-min BASEBALL Parts weeks (ATH-10).
- **v0 questions not covered by the questionnaire:** 11 (buy-outs on every 60+ min athletic session), 16 (the 3-day cut), 17 (fixed strength layout), 19 (default for 5-6 day hypertrophy), 20 (minimum home kit), 24 (vertical press optional for physique / fat loss), 25 (CrossFit WOD days by month or by level).
- **New questions raised by the answers:** section 11.2.

---

## 0. The short answers (v1.3)

| Question | Answer |
|---|---|
| How is a session ordered? | **WARM-UP -> CORE BLOCK (light) -> [SKILL] -> PLYO / BALLISTIC / SPRINT -> THROWS -> COD -> OLYMPIC / POWER -> THE WORK + its paired upper lift -> secondary pairs -> each group's second exercise -> ISOLATION -> CONDITIONING / WOD.** Warm-up always (COACH-ANSWER ORD-08). Core first for everyone, movable, 2 x 2 short of failure (ATH-11; COACH-R2 R2-SES-03). Power before strength (ORD-03). The work first, even when vertical (ORD-02). Row before pulldown, horizontal before vertical (ORD-01). A small muscle goes first only when it is one of the client's Focus muscles (ORD-04; COACH-R3 SES-01). Core supersets or monster sets may be added anywhere (R2-SES-03); the user may switch a day's core or athletic block off (COACH-R3 SES-02). |
| How many exercises per muscle? | **On his A / B days the template gives each group its exercises**: back 2 (row, pulldown), quads 3 (squat, lunge, leg extension), hips 3 (hinge, single-leg hinge, leg curl), chest and shoulders 1-2, biceps or triceps 1 (COACH-R4 R4-SES-05). **On split days (push, pull, legs): 2-4 for every muscle group the day trains, never 1** (COACH-R2 R2-SES-05). Groups: quads, hips (glutes + hamstrings), chest, back, shoulders (front, side, rear delts + traps), biceps, triceps (grouping approved, COACH-R3 SES-01). **Calves: one exercise x 3 sets on every leg day** (COACH-R3 SES-01). |
| How are slots paired? | **Hip-dominant with a push, knee-dominant with a pull**, at slot level (UNI-11, ORD-06); the second exercise of a group follows the same surface rule (leg extension with a pull, leg curl with a push). Same pattern (squat + lunge) for growth goals, cross pattern (squat + single-leg hinge) for bootcamp, fat loss, general fitness and athletes (UNI-06). **v1.3:** gym and athletic days are his A / B days - squat + lunge with the pulls, hinge + single-leg hinge with the pushes (COACH-R4 R4-SES-05); the cross pattern stays in his bootcamp circuits as written. |
| Exercises per session? | **By client type (v1.3, COACH-R4 R4-SES-02)**, not counting the warm-up or the 2 core exercises: general fitness / fat loss **5-7**, aesthetics / bodybuilding **6-8**, strength **5-6**, bootcamp **5-7 stations**, field athletes off-season **up to 12** + the 2-exercise core block (jumps / throws + Olympic + lifts), older adults 60+ **5-6**. A full-body day is his A or B day: about 6, up to 8 (R4-SES-05). Warm-up drills never count; two small isolations in a superset count as one (R2-SES-04). A recommendation: the person adds or removes. *(Retired: full-body days of 8-12 exercises.)* |
| How long is a session? | **Not an input and not a limit (v1.3, COACH-CT CT-01; COACH-R4 R4-SES-01).** Each day prints an average time estimate as information. His typical lengths - athletes, bodybuilders, powerlifters, pros about 90 min; general / weight loss 45-60 min (UNI-09); bootcamp 35-45 min (PRG-03) - describe what sessions usually take. Nothing is cut, reshaped or flagged because of time. With 2 training days every big group is trained at about 6-8 weekly sets and the plan suggests a third day (R4-SES-03). *(Retired: "when the chosen time cannot hold the minimums" and its offers.)* |
| How do sets grow? | A planned **stairway** (smaller steps first, bigger after halfway, hardest weeks last - R2-PER-03/04; engine in 06 / 12); **v1.3: every trained group reaches its planned final sets, with faster steps when needed and a note above about 15 %** (COACH-CX CX-01; COACH-R4 R4-PRG-01, R4-PRG-02). Each new set goes to the **first exercise of the day for that muscle, then the next** (2/2/2 -> 3/2/2 -> 3/3/2 -> 3/3/3 -> 4/3/3, VOL-07), alternating between the two weekly exposures of a day type (approved, COACH-R3 VOL-03). Floor 10 sets a week per trained group from 3 training days (R2-VOL-04/06; COACH-R3 VOL-01; COACH-R4 R4-SES-03). The plan is computed once - no check-in, nothing stored (COACH-R3 VOL-02, VOL-04, GEN-01). |
| Week shape? | **A1, B1, OPT, A2, B2, OPT, OFF** (OBSERVED shape). Heavy squat Monday, non-spinal hinge Tuesday, leg press / belt squat Thursday, heavy deadlift Friday (**approved**, R2-SES-01). PPL weekdays flexible (PRG-02). Bootcamp 4, 5 or 6 sessions (PRG-03). In season: 2 days, the harder one at least 48 h before a game (PER-08, R2-ATH-07). |
| Optional days? | The 5-slot block (OBSERVED) - core, Focus 1, Focus 2 (the client's Focus muscles, COACH-R3 SES-01), the Calves slot (when calves are a Focus muscle or the leg days cannot reach 10), one aerobic session. Separate days preferred, add-ons allowed (ORD-10). Default home of a small-muscle bonus exercise (approved, COACH-R3 VOL-03). |
| Aerobic sessions? | Defaults, **adjustable up or down by the user** (R2-SES-06): **3** general / fat loss; **4** aesthetics / physique (Blue, Green, Orange + a second easy Orange) + optional walks; athletes **2-4 off-season by sport, 2 pre-season, 2 in season**; powerlifters **2 easy Orange** (ATH-07, R2-ATH-06); **HYROX 4**; **0 extra for swimmers, runners, rowers and endurance cyclists**; a stay-active user's 45-60+ min activity session counts as one (up to 2) (COACH-R3 ATH-01, ATH-03, ATH-04, ATH-05). |
| Olympic lifts? | Up to **4 a week** - clean days = squat days, snatch days = hinge days (R2-ATH-04); every athletic main day carries one (the BASEBALL Parts Tue/Fri snatch from 75 min, as OBSERVED). Weight by RPE / RIR and bar speed; a % only with a tested recent best (R2-GEN-06). **Older adults (60+): off by default** with low ankle hops, other jumps, depth jumps and max sprints; landing drills, balance, quick stepping, light medball throws and fast machine work stay on; the rest optional with a warning (R2-ATH-08; COACH-R3 ATH-02). |
| Supersets? | A fatigue and time tool (ORD-05). Small-isolation pairs (arm + shoulder isolations) are always supersets; athletic off-season pairs are supersets (VO2max case). Contrast complexes for L2+ athletes off-season (ATH-12). **Every main day lists its eligible neighbouring pairs as recommended supersets; the person switches them on, and no session length does** (COACH-R3 SES-02; COACH-CT CT-01). |
| Core? | First in every session: 2 exercises x 2 sets, short of failure (ATH-11, VOL-17, **approved** R2-SES-03); the user may switch it off for a day (COACH-R3 SES-02). |
| Calves, rear delts? | Calves **one exercise x 3 sets every leg day** (never a second calf exercise on a leg day, COACH-R3 SES-01). Rear delts are part of the **shoulders group** (COACH-R3 VOL-01): shoulders get 2 exercises on their days - on pull days a rear delt + the **KB face pull** (R2-LIB-04, VOL-17); "add rear delts" is a plan-editing option. |
| Deloads and tests? | **No deload inside a block** (R2-VOL-07); the easy week after a block is a **recommendation**, not mandatory - the block ends and the user builds the next (COACH-R3 PER-01). Tests before the block (or week 1) and at the end, never mid-block, printed in the plan (R2-PER-07). |
| Can the user change the plan? | Yes, everything (COACH-R3 SES-02; COACH-CX CX-02, CX-04): switch a day's core, skill, athletic, Olympic, focus or conditioning block off, add or remove exercises or whole blocks, "add rear delts", and change the sets of any day or week. Nothing is dropped automatically: each day names the easiest things to remove and the person decides (COACH-R4 R4-SES-04). After an edit the weekly totals are recomputed and the plan is marked edited; nothing is stored. |

---

## 1. Vocabulary: bucket IDs and notation

Every slot, from either workbook, maps to one canonical **bucket**. The table in `05_templates.json > bucket_ids` lists, for each bucket, the coach labels that point to it and the library column. Short list:

| Family | Buckets |
|---|---|
| Athletic patterns ('AP') | AP_PLYO (variant 'upper' = plyo push-ups), AP_JUMP_LIMITED_KNEE, AP_SPRINT, AP_THROW, AP_COD, AP_TRIPLE_EXT. They never count toward muscle sets (COACH-ANSWER VOL-10) |
| Resistance patterns ('RP') | RP_BKD, RP_BHD, RP_UKD, RP_UHD, RP_HPUSH ('Incline' and 'Dips' are details of it), RP_VPUSH, RP_HPULL, RP_VPULL |
| Isolation | ISO_QUAD, ISO_HAM (knee flexion is its own segment, COACH-ANSWER CAT-09), ISO_CHEST, ISO_SIDE_REAR_DELT (side / rear / front; v1: rear delts get their own station, COACH-ANSWER VOL-17; v1.1: KB face pulls live here as shoulder work, COACH-R2 R2-LIB-04), ISO_BICEP, ISO_TRICEP, ISO_CALF (v1.1: 2 calf exercises every leg day, VOL-17 + R2-SES-05) |
| Core ('CONTROL') | CT_CORE_THORAX, CP_CORE_PELVIS, CORE_OTHER ('BOTH' / unspecified), CORE_ANY (the BYOP 'Core' slot, where the generator still has to pick CT or CP). v1: these fill the **core block** that opens every session (COACH-ANSWER ATH-11); v1.1: 2 x 2 short of failure (COACH-R2 R2-SES-03) |
| Conditioning | COND_AEROBIC (cheat-sheet colours C/B/A), COND_SPRINT_BUYOUT, COND_CIRCUIT, COND_WOD |
| Other | FOCUS (also 'ACCESSORIES' / 'UPPER ACCESORY' / 'LOWER ACCESORY'), SKILL, WARMUP_GENERAL, WARMUP_PREP, FUNCTIONAL (carries/drags; never wired), RECOVERY_ARM_CARE, COMPLEX (contrast/complex station with members), TEST, DELOAD, OFF |

**Crosswalk to the taxonomy.** These are the same analyst codes used in the decode files. `synthesis/01_taxonomy.json` (crosswalk group G25) maps each one to its hierarchical ID, for example RP_BKD = RP.KD.BS, RP_UHD = RP.HD.UL, ISO_SIDE_REAR_DELT = RP.SM.DELT, AP_JUMP_LIMITED_KNEE = AP.JMP.LK, COND_SPRINT_BUYOUT = CA.BUY. `05_templates.json > bucket_ids[*].taxonomy_id_01` carries that mapping for the 28 buckets that have one. The rest (WARMUP_*, SKILL, COMPLEX, TEST, DELOAD, OFF, COND_CIRCUIT, COND_WOD, CORE_ANY, RECOVERY_ARM_CARE) are session-building IDs only.

**Notation used below (v1.1).**
- `->` = next station.
- `[A | B]` = a UNI-11 pair: a lower pattern and its opposite-surface upper lift (hip + push, knee + pull). Done as straight sets, or as a superset when an ORD-05 use case applies.
- `<A + B>` = an isolation superset or a BASEBALL Part D tri-set. `{X > Y}` = contrast or complex done "directly into" (ATH-12).
- `*` / `~` = the week's axial / non-axial exposure of a squat or hinge pattern (PER-04).
- `(60+)` = station included only when the session is at least 60 min. `|` inside a slot (sheet quotes) = alternatives.
- v1.2: `calf (3 sets)` = the leg day's one calf exercise, 3 sets, 4 at 90 min (COACH-R3 SES-01; v1.1's `<calf + calf>` pair is retired). In the JSON every resistance station carries `group` = the R2-SES-05 muscle group it counts for; athletic stations carry `older_default` / `older_option_warning` (R2-ATH-08); bootcamp stations carry `circuit` = 1 or 2.

**Dose notation (COACH-ANSWER PRG-07, UNI-01).**
- '12/10/8 -20' = a pyramid: 12 reps at a mid weight, 10 heavier, 8 heaviest, then drop to a light 20-rep set (4 working sets).
- '10/10' on a unilateral exercise = 10 reps each side = 1 set. If a bilateral lift is written 10/10 on purpose, it means a set of 10 and then another set of 10.
- 'MYO SET' = 15 + 5x5 with short pauses, last exercise, machine or isolation (VOL-15). 40-rep sets and AMRAPs only in CrossFit / hybrid styles (VOL-11).
- 'Zone' (COACH-ANSWER CAT-04, CAT-10) = Pat Davidson's rotation-bias zones (vertical positions = external-rotation bias; horizontal = zone 2, internal-rotation bias, compressive). It is an exercise property that feeds the exercise level in 01/02, it does not order or pair stations in this file, and it never applies to plyos; levels are still theoretical (CAT-05). The plyo method progression (receive & pause -> receive then create -> repeated) is not a zone (CAT-11); v1.1 names it the **Receive-Create stages** (1 Land, 2 Land & Go, 3 Repeat; COACH-R2 R2-ATH-03). v1.1 (R2-LIB-02/03, RIGHT): zones 1 and 3 are the vertical, external-rotation positions (arms low; arms overhead or deep squat), zone 2 the horizontal, internal-rotation one; the exercise level comes from load position, skill and stability, not from the zone; every week keeps both rotation biases, and the bias is used to pick swaps when something hurts (not by sport).

### 1.1 Levels and program names (v1.1)

**Levels (COACH-ANSWER PRG-05; L3 INFERRED).**

| Level | Who |
|---|---|
| L1 | Novice = 'newby' (the coach uses both for the same thing): under about 6-12 months of training. Also anyone back after more than 6-12 months off (the body is treated as L1; skills come back fast). Ex-pros start at L1 briefly to acclimate, then move up. |
| L2 | Intermediate: has trained consistently for over a year. |
| L3 | Advanced: several years of consistent training and high work capacity (INFERRED; not defined by the coach). |

The MM examples' 'NOVICE' and 'NEWBY' columns are both L1 and 'INTERMEDIATE' is L2. Client level and exercise level are separate axes (CAT-06); levels add options and never remove them, and the coach says they are "still very theoretical" (CAT-05). One algorithm drives rep, set and volume progression for every level (PRG-06).

**Program names (COACH-ANSWER FIX-03, ATH-13; names PROPOSED, Spanish names in the JSON for the EN/ES toggle, GEN-01).** Tab names stay verbatim when cited as evidence; the generator shows generic names: 'AESTHETICS - FULL BODY - 4 DAYS' -> *Muscle & Physique - Full Body A/B*; '3 DAY BUILDER' -> *Muscle & Physique - Full Body 3 Days*; 'PUSHPULLLEGS' -> *Push / Pull / Legs*; 'ATHLETIC - FULL BODY' -> *Athletic Performance - Full Body*; 'JUSTICE LEAGUE' -> *Athletic Performance - Non-Competitive* (weekend athletes, adults and youth); 'BOOTCAMP - OPTION 1 / 2' -> *Bootcamp - Full Body A/B* / *Bootcamp - 3-Session Rotation*; 'EXAMPLE FAT BURNBODY TONING PRO' -> *Fat Loss & Toning*; 4 TRACKS -> *Strength / Bodybuilding / Hybrid 8 or 12 Weeks*; 'NO ACCESS' tabs -> self-serve versions without coach access (COACH-R2 R2-LIB-08): *Athletic Performance - Self-Serve* / *Muscle & Physique - Self-Serve* (names PROPOSED). New in v1.1 (names PROPOSED): *CrossFit-Style Bootcamp* (R2-GEN-07 sample plan) and *Stay Athletic & Active* (pickleball, HYROX, rec sports; coach request 2026-10-08). Days are named by what they train ("Day A1 - squat + pull").

---

## 2. Every observed template as a slot sequence

### 2.1 BYOP workbook (dropdown templates)

**OT01 'AESTHETICS - FULL BODY - 4 DAYS'** (C1 'AESTHETICS - FULL BODY - 4 DAYS A WEEK'). OBSERVED. Day 1 is filled, Day 2 is partly filled.

| Day type | Slots (coach label -> bucket) |
|---|---|
| A = Day 1 / Day 3 (EFEFEF) | 'Calves' ISO_CALF -> 'Bilateral KD' RP_BKD -> 'Horizontal Pull' RP_HPULL -> 'Unilateral KD' RP_UKD -> 'Vertical Pull' RP_VPULL -> 'Bicep' ISO_BICEP -> 'Leg Extensions' ISO_QUAD |
| B = Day 2 / Day 4 (CCCCCC) | 'Bilateral HD' RP_BHD -> 'Horizontal Push' RP_HPUSH -> 'Unilateral HD' RP_UHD -> 'Vertical Push' RP_VPUSH -> 'Leg Curls' ISO_HAM -> 'Tricep' ISO_TRICEP -> 'ABdution' ISO_SIDE_REAR_DELT |
| OPT 'Optional' (FCE5CD) | 'Calves' -> 'Cardio' -> 'Core' -> 'Focus 1' -> 'Focus 2' |
| Week (from the hidden twin OT07) | Mon A, Tue B, **Wed OPT**, Thu A, Fri B, **Sat OPT**, **Sun 'OFF'** |
| Filled dose | Day 1: 'Machine Calf Raises' 3 x '15 Reps'; 'Leg press' 3 x '15 Reps'; 'Bent Over Barbell Rows' 3 x '8 to 12 Reps'; 'Reverse Lunges ' 3 x '8 to 12 Reps'; 'Lat Pulldown Pronated Grip' 3 x '15 Reps'; 'Ez Bar Curls' 2 x '20 Reps'; 'Leg Extensions' 2 x '20 Reps'. Day 2: 'DB Deadlifts' 3 x '15 Reps'; 'Push Ups ' 3 x '15 Reps'; 'Staggered Stance DL w/ DB ' (D12) with SETS/REPS still 'CHOOSE 👇'; 'DB Push press' 5 x '6 to 8 Reps'; rows 14-16 unfilled. Day 1 totals 7 exercises / 19 sets (recomputed). |

**v1 notes.** Calves move to the end unless calves are a priority (COACH-ANSWER ORD-04); a core block opens both days (ATH-11); the second A and B of the week are the non-axial exposures (PER-04); calves 3 sets on both days and a rear-delt station on A (VOL-17). **v1.1:** every group the day trains gets 2-4 exercises (COACH-R2 R2-SES-05) - Day 1 already gives quads 3 and back 2; generated plans add a second biceps exercise, a KB face pull next to the rear delt (R2-LIB-04) and a second calf exercise; Day 2 gets a chest isolation, a side raise, a second triceps exercise and a second calf exercise.

**OT02 '3 DAY BUILDER'** (C1 'AESTHETICS - FULL BODY - 3 DAYS A WEEK'). OBSERVED, empty template. Each DAY is followed by an 'Optional' block.

| Day type | Slots |
|---|---|
| D1 (EFEFEF) | ISO_CALF -> RP_BKD -> RP_HPULL -> RP_UKD -> RP_VPULL |
| D2 (CCCCCC) | RP_BHD -> RP_HPUSH -> RP_UHD -> RP_VPUSH -> ISO_HAM ('Leg Curls', the only isolation that survives the cut) |
| D3 (FFF2CC, a third day type) | RP_BKD -> RP_BHD -> RP_HPULL -> RP_HPUSH -> RP_UKD |
| Frequency | BKD, BHD, HPULL, HPUSH, UKD 2x/week; VPULL, VPUSH, UHD 1x |

**OT03 'PUSHPULLLEGS - 3 or 6 DAYS A WK'** (A1 'PUSH/PULL/LEGS - 6 DAYS A WK'). OBSERVED, empty template. 7 slots every day; Thu-Sat repeat Mon-Wed; 'SUNDAY' 'OFF'.

| Day type | Slots |
|---|---|
| PUSH | 'Horizontal Push' RP_HPUSH -> 'Vertical Push' RP_VPUSH -> 'Incline' RP_HPUSH -> 'Flies' ISO_CHEST -> 'Dips' RP_HPUSH -> 'Push' ISO_TRICEP -> 'Overhead' ISO_TRICEP |
| PULL | 'Horizontal Pull' RP_HPULL -> 'Horizontal Pull' RP_HPULL -> 'Vertical Pull' RP_VPULL -> 'ABdution' ISO_SIDE (side) -> 'Reverse Flies' ISO_SIDE (rear) -> 'Bicep' -> 'Bicep' |
| LEGS | RP_BKD -> RP_BHD -> RP_UKD -> ISO_QUAD -> ISO_HAM -> RP_UHD -> 'Focus 1' FOCUS |

**OT04 'ATHLETIC - FULL BODY - 4 DAYS A'** (A1 '... 4 DAYS A WEEK'). OBSERVED, template. Its filled instance is OT04b 'JUSTICE LEAGUE' - only a marketing name for a non-competitive athletic program for weekend athletes, adults and youth (COACH-ANSWER ATH-13); generic name *Athletic Performance - Non-Competitive* (FIX-03); the hidden copy is OT04c, titled '... 4 to 6 DAYS A WEEK', with a miswire (E19/E46 'Unilateral HD' -> `AR7:AR42` LEG CURLS); OT04c's only filled exercise cells are E12/E39 'Leg extensions'. In OT04 and OT04b the Thursday block (rows 30-39) has no day label (B30:B39 is merged and blank); 'THURSDAY' is written only in OT04c, so "Thu" in OT04/OT04b is read from position.

| Day type | Slots |
|---|---|
| A = MON/THU | 'Plyo' AP_PLYO -> 'Plyo' AP_PLYO -> 'Throwing' AP_THROW -> 'COD' AP_COD -> 'Tripple Extension' AP_TRIPLE_EXT -> RP_BKD -> RP_HPULL -> RP_UKD -> RP_VPULL -> ISO_QUAD (G12 'MYO SET') |
| B = TUE/FRI | 'PLYO' AP_PLYO -> AP_THROW -> AP_COD -> AP_TRIPLE_EXT -> RP_BHD -> RP_HPUSH -> RP_UHD -> RP_VPUSH -> ISO_HAM -> ISO_SIDE_REAR_DELT |
| OPT = WED/SAT | 'Calves' -> 'Aerobic Capacity' -> 'Core' -> 'Focus 1' -> 'Focus 2' |
| JUSTICE LEAGUE Monday (filled) | 'Medium Depth Drop' 2 x 6-8; 'Ankle Hops ' 2 x 6-8; 'Situps to overhead throw' 2 x 8-12; 'DIG/OUT' 2 x 6-8 (H6 'LATERAL'); 'Power Clean' 2 x 6-8; 'Front Squats' 2 x 6-8; 'Cable Machine UL Rows' 2 x 8-12 (H9 'SINGLE ARM'); 'Front Foot Elevated Lunges (FFE)' 2 x 8-12; 'Stricted Pull-ups feet in front ' 2 x 8-12; 'Leg Extensions' 2 x 'MYO SET' (H12 'OUCH'). 10 exercises, 20 sets (10 athletic + 10 resistance). Thursday E35 'Low Bar Back Squat'; Tuesday E13 'SL Depth Drops'. |

**v1 notes.** The generator's athletic default becomes cross pattern (COACH-ANSWER UNI-06); this same-pattern grammar stays as the variant for athletes who need size. Monday front squat + Thursday low-bar back squat are two axial squats; v1 makes Thursday a leg press / belt squat (PER-04). Core block first (ATH-11). **v1.1:** this OBSERVED same-pattern grammar reaches 2 exercises per muscle (R2-SES-05) with fewer exercises than the cross pattern, so it fits the 12 + 2 core cap (R2-SES-04) with 3-4 athletic stations; Olympic work on every main day, clean on the knee days and snatch on the hip days (R2-ATH-04). OT04c ('NO ACCESS'): a self-serve copy without coach access (R2-LIB-08); its 'Unilateral HD' rows should point to the single-leg hinge list.

**OT05 'BOOTCAMP - OPTION 1'** (A1 'BOOTCAMP - FULL BODY - 4 DAYS A WEEK'). OBSERVED, empty logbook except E30 'Leg extensions' on Thursday (verified in raw rows 3-45).

| Day type | Slots |
|---|---|
| A = MON/THU | RP_BKD -> RP_HPULL -> **RP_UHD** -> **RP_VPUSH** -> ISO_BICEP -> ISO_CALF -> ISO_QUAD |
| B = TUE/FRI | RP_BHD -> **RP_VPULL** -> **RP_UKD** -> RP_HPUSH -> ISO_HAM -> ISO_TRICEP -> ISO_SIDE_REAR_DELT |
| OPT = WED/SAT | the 5-slot optional block |

The key observation: it uses the **same 14 resistance slots as OT01, re-paired**. 'Unilateral KD' <-> 'Unilateral HD' and 'Vertical Pull' <-> 'Vertical Push' swap days. As a result **every session is a complete full-body dose**: knee and hip, push and pull, bilateral and unilateral.

**v1 (COACH-ANSWER ORD-06, UNI-11):** the Tue/Fri wiring was not intentional - "You should read hinge and then push: hip-dominant with pushing and knee-dominant with pulling. That's the model that I'm using for full bodies and for boot camps." The corrected B day is 'Bilateral HD' + 'Horizontal Push', 'Unilateral KD' + 'Vertical Pull'. Monday/Thursday already follow the rule.

**OT06 'BOOTCAMP - OPTION 2'** (A1 reads 'BOOTCAMP OPTION 1', a copy-paste leftover). OBSERVED, empty template with no SETS/REPS columns.

| Session | Slots |
|---|---|
| 1A / 1B | RP_BKD -> RP_HPULL -> RP_UHD -> 'Core' -> 'Cardio' (`B7:B335`, which includes the 200m-1000m and calorie options) |
| 2A / 2B | RP_BHD -> RP_HPUSH -> ISO_BICEP (between the two presses) -> RP_VPUSH -> 'Cardio' |
| 3A / 3B | RP_VPULL -> RP_UKD -> **'Cardio' mid-session** (`B7:B122`) -> ISO_TRICEP -> ISO_SIDE_REAR_DELT |
| Week | 1A, 2A, 3A, 1B, 2B, 3B, 'SUNDAY' 'OFF'. Reading it as 3 sessions a week is INFERRED. |

Each A-cycle hits all 8 primary patterns once. Compared with OT05 it drops ISO_CALF, ISO_QUAD, ISO_HAM and FOCUS.

**v1 notes.** The A1 title is fixed to Option 2 (COACH-ANSWER FIX-03). 4, 5 or 6 sessions a week are all valid, run as timed circuits of 5-7 stations x 3-5 rounds x 30-50 s in 35-45 min (PRG-03). Its pairs already follow UNI-11. Calves are added to each session (VOL-17). **v1.1:** each session trains 4-5 muscle groups with 2 stations each (R2-SES-05), run as two circuits of 4-6 stations (5.3, 8.4).

**OT07 'NO ACCESS - AESTHETICS - FB - 4'** (hidden). OBSERVED. It is OT01 as a logbook, with weekday labels: MONDAY A, TUESDAY B, WEDNESDAY optional, THURSDAY A, FRIDAY B, SATURDAY optional, SUNDAY 'OFF'. E12/E33 'Unilateral HD' point at `AR7:AR42` (LEG CURLS). It is **not** an equipment-restricted template. **v1.1 (COACH-R2 R2-LIB-08, RIGHT):** 'NO ACCESS' means a self-serve version without coach access that uses the full gym library; its Tuesday 'Unilateral HD' should point to the single-leg hinge list, not to leg curls (this answers PRG-01 and FIX-01).

### 2.2 MASTER_MODEL gym examples (hand-typed, filled)

**OT08 'EXAMPLE UPPERLOWER SPLIT'** (hidden; three levels: 'NOVICE' green, 'NEWBY' yellow, 'INTERMEDIATE' orange). OBSERVED.

- LOWER ('LOWER BODY WORKOUT', ADAY): 'Any Cardio Equipment' 5 min -> 'A March' -> 'A Skip' -> 'A Run' -> RP_BKD 'Sqats or Leg Press' -> RP_BHD 'Deadlifts (DB or Barbell)' -> RP_UKD 'Reverse Lunges (Bodyweight or DBs)' -> RP_UHD 'Single Leg Deadlift' -> ISO_QUAD -> ISO_HAM -> ISO_CALF 'MAX REPS'.
  That is 10 lines after the warm-up.
- UPPER ('UPPER BODY WORKOUT', BDAY): 5 min cardio -> RP_HPULL 'Dumbbell Rows' -> RP_HPUSH 'Bench Press' -> RP_VPULL -> RP_VPUSH -> ISO_BICEP 'MAX REPS' -> ISO_TRICEP -> 'DB Side Raises' -> 'DB Upright Rows'.
  The upper day alternates pull and push and **starts with a pull**.
- Week (INFERRED from A5): Mon L, Tue U, Wed cardio, Thu L, Fri U, Sat cardio, Sun off.
- **v1:** 'NOVICE' and 'NEWBY' are the same level (L1) and 'INTERMEDIATE' is L2 (COACH-ANSWER PRG-05). The upper day's reps rising with level (3x8 -> 3x10 -> 4x12) was a fill error, not a rule (PRG-06). The A-drills are warm-up, not exercises (ORD-08).

**OT09 'EXAMPLE PUSHPULLLEGS SPLIT'** (hidden). OBSERVED.

- PUSH: 5 min cardio -> 'KB Book openers ' -> incline DB bench -> **'Side raises'** -> barbell bench -> 'Dips' -> overhead triceps.
- PULL: cardio -> DB rows -> **'DB Reverse Flies or Machine '** -> pulldown/pull-ups -> **'DB upright rows'** -> 2 curls.
- LEGS: the same 11 lines as the UL lower day. Newby and intermediate doses are identical; novice reps differ (PPL novice 2 x 8 and 8/8 vs UL novice 2 x 12 and 12/12).
- Delt isolation is **interleaved between compounds**. There is **no vertical press** anywhere.

**OT10 'EXAMPLE FAT BURNBODY TONING PRO'** (visible; B4 'MUSCLE BUILDING', B36 'CIRCUITS RECCOMENDED'). OBSERVED, 4 weeks.

| Day type | Slots |
|---|---|
| LOWER A | 'LEG PRESS' RP_BKD -> deadlift RP_BHD (spelled 'DEALIFTS' D8 in WK1, 'DEADLIFTS' J8 in WK3) -> lunge RP_UKD -> 'SL RDL' RP_UHD -> 'LEG EXTENSIONS' ISO_QUAD |
| LOWER B | deadlift RP_BHD -> 'SQUATS SMITH MACHINE' RP_BKD -> lunge -> 'SL RDL' -> 'LEG CURLS' ISO_HAM. The lead pattern decides the finisher. |
| U1 (press-led) | RP_HPUSH -> RP_VPULL -> RP_VPUSH, upright row or 'SIDE RAISES' (WK2 Fri) -> RP_HPULL -> biceps |
| U2 (pull-led) | RP_VPULL -> RP_HPUSH -> RP_HPULL -> side raises, upright rows or overhead press -> triceps |
| Pull order | In every FAT BURN upper day the **vertical pull comes before the horizontal pull** (audit R1: 0 of 8 sessions put the row first). |
| Vertical press | A true vertical press appears in only **2 of the 8** upper sessions: WK1 Tuesday D14 'DB OVERHEAD PRESS' and WK4 Tuesday M15 'OVERHEAD PRESS'. The other six use 'UPRIGHT ROWS' or 'SIDE RAISES' in that slot, so **WK2 and WK3 contain no vertical press at all** (recounted from the dump). 'Upright rows' is filed in the library under the Focus list 'SHOULDERS/TRAPS 👇' (AZ52-AZ53), not under VERTICAL PUSH (AA). |
| Week | Mon lower, Tue upper, **Wed cardio**, Thu lower, Fri upper, **Sat cardio**. The A/B variant flips every week. |
| v1 | Row first, then pulldown (COACH-ANSWER ORD-01); the circuits are finishers (PRG-11); lead-lift A/B weeks optional (PER-03). |
| Circuits | 4 stations, round count written on the first one: Mon/Fri in odd weeks, Tue/Thu in even weeks. Mon: 'Jumping Jacks', 'Bodyweight reverse lunges', 'Situps', 'Dumbbell overhead press'. Fri: 'Plank shoulder taps', 'Dumbbell curl to press', 'Bicycle crunches', 'Burpees'. Tue: 'Pushups', 'Dumbbell hammer curls', 'Side plank', 'Other side plank'. Thu: 'Mountain climbers', 'Bodyweight forward lunges', 'Plank Hip turns', 'Bodyweight squats'. Rounds x work: 3 x '30 secs' -> 4 x 35 -> 4 x 40 -> 5 x 50. |

### 2.3 MASTER_MODEL athletic and combat examples

**OT11-OT13 'EXAMPLE ATHLETIC FULL BODY SPLI'**: three levels side by side ('STARTING' 3 workouts, ' MID' 4, ' ADVANCED' 4). OBSERVED; verified in raw. Under the STARTING column the coach writes the block's purpose (A41:A45, OBSERVED): 'First 8 weeks (8wk1) adaptation focus:' / 'Bring athletes back to feeling/moving great' / 'Start ramping up volume of work at highest biomechanical demand' / 'Introduce more specific unilateral demands' / 'Drive more strength/power/speed'. So the STARTING sessions are an 8-week block; the length of the MID and ADVANCED blocks is not written.

| Workout | Sequence |
|---|---|
| Starting S1 (jump + knee) | weighted depth jump -> depth jump into box jump -> loaded jump squats -> 'High Knee Runs FAST' -> HEAVY single-arm row (RP_HPULL) -> **{hex-bar squat > 10 repeat jump squats}** -> **{heavy ipsilateral FFE lunge > lunge jumps}** -> sesaw push press (RP_VPUSH) -> {box step-up jumps > nordic curls} -> side plank presses |
| Starting S2 (medball + hip) | '*MEDBALLS ' 'ALL LIST' -> cross connects -> 'KB Swings + 12/12 Single leg Glute bridges' (RP_BHD + RP_UHD) -> banded fast single-arm pulldowns (RP_VPULL) -> staggered DB snatch -> plyo push-ups (the week's H push) -> Tabata flutter kicks / hip turns |
| Starting S3 (strength + Oly) | 'Med ball rolls' (core first) -> HEAVY Camporini DL -> HEAVY walking lunges -> 'SUPERSET: Low Hang Power Cleans (mid weight) ' + 'Heavy Snatch grip DL' -> tri-set dead bugs + front + side raises -> leg ext + leg curl superset |
| Mid M1 / Adv A1 (jump day) | landing 1 x 8 'Drop & Stick - Hold for 3 seconds' -> M1: jumps / squirrel jumps -> core primer 'Hollow rocks'; A1: core primer 'Med Ball Rockers' **before** the jump ('Single Leg to march jumps', H14) -> M1: 'Heavy DB bench presses' -> 'Heavy Deadlifts' -> 'Pull ups or Lat pull downs' -> paired arm and leg isolation. A1: 'DEADLIFTS (1RIR)' 3 x 1 -> 'Unilateral Deadlift DB loaded' -> core superset, **no upper-body lift at all**. |
| Mid M2/M4, Adv A2/A4 (medball day) | throw list -> cross connects (A2 has none: '*MEDBALLS' 'ALL LIST' goes straight to 'Heavy DB rows') -> M2: 'Heavy Power Cleans' -> 'Lateral Step ups IPSILATERAL loading' -> 'Db Staggered Hang Snatch ' (no upper compound). M4/A2: 'Heavy DB rows' -> 'RFE & FFE contralateral lunge...' -> 'DB overhead sesaw alternating press' -> 'DB side raises + Copenhagen plank' -> '50 situps + 50 crunches + 50 reverse crunches'. A4: 'Heel raises & fast/rythmic/1/4 SQUATS' -> step-ups -> hang snatch -> weighted low plank. |
| Adv A3 | squirrel / plate jumps -> 'Hollow rocks' -> 'Power Cleans' 3 x 3 -> 'HEAVY GLUTE BRIDGES' -> curls & kickbacks -> 'Plate core & leg extensions' |
| Mid M3 | landing -> rockers -> SL march jumps -> hex-bar loaded jumps -> 'Bench glute Bridge & fast alternating DB sesaw floor press' (hip + H push in one cell) -> unilateral DL -> banded pulldowns -> tri-set SL glute bridge + curls + skulls |

Level trend: working sets 89 -> 72 -> 59 per week. These are counts of the OBSERVED SETS cells under the decode's convention (every member of a superset counts its own sets, throws excluded, Tabata = 8); as written the totals are 81 / 71 / 59. I re-derived 35+24+30, 21+10+25+16 and 14+19+17+9 from the dump. Two readings are convention choices: M4's '2 to 4' sets are counted as 3, and A4's 'Heel raises & fast/rythmic/1/4 SQUATS' as one movement. If that cell is counted as two members, the way M1's 'Heavy curls & Heavy tricep kickbakcs' is, A4 = 11 and Advanced = 61 (pass-2 recount). Movements per session (excluding throws) fall from about 10 to about 7.5 on average. "Heavier and faster" is INFERRED from the labels ('HEAVY', '1RIR', 'Power Cleans' 3 x 3).

**v1.1 notes.** S2's 'KB Swings' are ballistic / athletic work and never glute or hinge volume (COACH-R2 R2-VOL-05): generated plans move them to the power block and give the hinge slot a hip thrust or back extension. S1 keeps an Olympic station at every length (R2-ATH-04: up to 4 a week). Depth jumps and the other plyos are off by default for clients over 60 (R2-ATH-08).

**v1 notes.** 'STARTING / MID / ADVANCED' are back-to-back blocks or athlete levels "depending on whatever is needed" (COACH-ANSWER PRG-04). 'Camporini DL' is removed from the library (LIB-09); banded pulldowns and S1's 'band row' option are out (EQ-01). S1 gains a COD station from 60 min in generated plans (ATH-06; the sheet has none). In generated plans the vertical vectors follow UNI-11 (S1's push press becomes a vertical pull; S2's pulldown becomes a press; MID/ADVANCED jump days take pushes and medball days pulls). Olympic work goes before strength (ORD-03); the S3 'Med ball rolls' core-first order is now the rule (ATH-11).

**OT14-OT15 'EXAMPLE BOXING 8 WEEK BUILD UP'** (hidden; 'BLAZE CAMP FIGHTER -  8 WEEK BUILD UP '). OBSERVED. Mon / Tue / Thu / Fri; Wednesday and the weekend are empty (INFERRED: sport practice).

| Phase | Mon | Tue | Thu | Fri |
|---|---|---|---|---|
| Wk 1-2 (base, lifts 3 x 10) | **20/40 intervals first** -> sit-ups/T2B -> front squat -> deadlift -> reverse lunge -> SL RDL -> leg curl -> leg ext | medballs (19 x 10) -> DB bench -> pulldowns -> DB OH press -> seal rows -> curls -> skulls | sit-ups -> same lower day | **easy cardio 20 min first** -> core -> DB bench -> pulldowns -> DB OH press -> seal rows (no curls or skull crushers on Friday) |
| Wk 3-8 (conversion) | medballs -> weighted depth drops -> SL high march jump -> clean pull / hang power clean -> lateral box step-up IPSILATERAL -> **'DEADLIFTS (1-2RIR) + 3 min Jump Rope'** -> Copenhagen & unilateral DL -> leg ext/curl | **20-40 min cardio first** -> SL knee tuck + DB rows -> DB snatches -> **'3 Heavy SQUATs + 5 Tuck jumps + 5 DB squat jumps + 5 Squirrel jumps'** -> Jefferson lunge | medballs -> SL squirrel jumps (REVERSE BANDED) -> side + front raises -> rocker + hops + knee tucks -> hang power clean & press -> Bulgarian + SL deficit calf raise -> leg ext/curl | **'Sprint 20/ Recover 40' first** (5 -> 8 rounds) -> drop into box jumps + star toe touches -> **'4 Deadlifts - 5 broad jumps - 5 KB swings - 5/5 High Knee runs'** -> contralateral low step-up -> slider runners + hamstring runners |

After week 2 there is **no horizontal push, no vertical pull and no arm isolation** (OBSERVED).

**v1 (COACH-ANSWER ATH-04, ORD-09):** "don't completely cut it... We just need to bring the volume down, down, down" - pressing and arm volume is reduced, not removed, when punching volume is high. The cardio that opens boxing days is a real aerobic block, not a warm-up. Thursday's 'SL squirrel jumps (REVERSE BANDED)' is out as written (EQ-12: no variable resistance); the unbanded jump stays. The week 1-2 upper days put the pulldown before the seal rows; generated plans put the row first (ORD-01).

### 2.4 BASEBALL (OT16): the coach's most developed program

OBSERVED in 24 week-grids (3 blocks x 8); verified in raw rows 42-58. Four days a week; Wednesday and the weekend are free.

| Part | MONDAY ('Speed') | TUESDAY ('strength') | THURSDAY (no tag) | FRIDAY ('speed') |
|---|---|---|---|---|
| A | 'Upper Ballistics/plyo' AP_THROW (pair) | 'LOWER ballistics/plyo' AP_PLYO (pair) | 'Upper Ballistics/plyo' | 'LOWER ballistics/plyo' |
| B | 'LATERAL CORE' (frontal) | 'Transverse core' | 'Sagital core' | 'Transverse core' |
| OPTIONAL PIECE (D5A6BD) | 'OLY' hang clean @ % | 'OLY' hang snatch @ % | hang clean | hang snatch |
| C (superset) | 'bkd' + 'horiz pull' | 'bhd' + 'horiz push' | 'bkd' + 'vert pull' | 'bhd' + 'vert push' |
| D (tri-set) | 'uhd' + 'bicep' + 'calfs' | 'ukd' + 'tricep' + 'shoulders' | 'uhd' + 'bicep' + 'calfs' | 'ukd' + 'tricep' + 'shoulders' |
| E (FFF2CC) | 'Buy out' | 'Buy out' | 'Buy out' | 'Buy out' |

How the template is filled (OBSERVED unless marked):
- Sets are written once per Part. The second row of Part C reads 'Superset - same reps' (19 cells), 'Superset - max reps' (5 cells) or 'heavy Max reps' (6 cells, all on Thursday 'vert pull' rows), or carries its own rep number (recounted in the dump).
- The day tags (row under Part E) read 'Speed' (Mon), 'strength' (Tue), 'speed' (Fri); **Thursday is never tagged**. The tags are written in only **11 of the 24** week-grids (Block 1 wk 2-5; Block 2 'WK 1', 'wk 2', 'wk 4'; Block 3 week 2, 4, 5, 7; recounted: 33 tag cells). The main lift follows the tag: speed/contrast on Monday's squat (15/22 weeks) and Friday's hinge (19/22), strength on Tuesday's hinge (19/22). Thursday's squat is a strength lift in 16/22 weeks, so "Thursday = strength" is INFERRED.
- Slots are often filled with a ballistic version of the pattern: jump squats in 'bkd' (15 of 57 filled 'bkd' rows), KB swings in 'bhd', ankle hops or hurdle hops in 'calfs' (20 of 46 filled calf rows = 43%; my label-based recount from the dump gives 16 of 39, 41%).
- The OPTIONAL PIECE 'OLY' ('Hang cleans @ 75%' ...) appears only in Block 1 wk 6-8 (wk 8 holds 'OLY' 4 x 6 with no exercise named) and Block 2 wk 5 to 'WEEK 8'; Block 3 (in-season) never has it. It always sits **below Part B** (core) and above Part C.
- DELOAD WEEK keeps the template at 3 x 8, with Part A at 1-2 sets, no buy-out and no Oly.
- **v1:** Part B (core) moves before Part A by default (COACH-ANSWER ATH-11; the athlete may move it back). The calf-slot hops are plyo contacts and no longer count as calf sets (VOL-10); 3 resistance calf sets are added on each leg day (VOL-17). The calendar is the same for high school, college and pro; load and speed differ per athlete (PRG-09).
- **v1.1:** a generated 'Part F' gives each muscle group of the day its second exercise (INFERRED application of COACH-R2 R2-SES-05), e.g. Monday [leg extension | pulldown] + <leg curl + curl + calf>. Monday/Thursday carry the hang clean at every length and Tuesday/Friday the hang snatch from 75 min as observed - clean on squat days, snatch on hinge days (R2-ATH-04); full squat cleans 3-5 reps (R2-ATH-05). Friday's KB swings and broad jumps are ballistic partners with no muscle credit (R2-VOL-05).
- Block 1 'wk 8' is a recovery week instead: 'Kettlebell arm bars', 'Half kneeling shoulder roll', 'Paced Cardio - easy' 4 x '10 min'.
- Block 3 (in-season, dated 'March 20 - 26' to '04/24 to 04/28') has **no deload or recovery week**: its 'WEEK 8' (DM60) is a normal loaded week with buy-outs. Block 2 labels its grids 'WK 1', 'wk 2', 'wk 4', 'wk 5', 'wk 6', 'WEEK 7', 'WEEK 8', 'DELOAD WEEK' (there is no 'wk 3').

### 2.5 CrossFit (OT17, OT18)

**OT17 'COMPETE CROSSFIT SPLIT'** is a quality-by-month grid. OBSERVED. The days carry these labels:
- MON: 'AEROBIC C.', 'STRENGTH' 'KNEE DOM', 'POWER' 'SNATCH', 'RESISTANCE' 'LB', 'WODs'.
- TUESD: 'SKILL' 'T2B/ DUBS', 'PULL', 'CLEAN', 'UB', WOD.
- THURS: aerobic, 'HIP DOM', 'SNATCH', 'LB' (+ skill 'T2B/ DUBS' in DEC/JAN and 'WODs' in SEPT, DEC, JAN, MAY).
- FRID: 'H.S./ DUBS', 'PUSH', 'CLEAN', 'UB', WOD.
- SAT: aerobic 'YES' in the level-3 and level-4 aerobic months (AUG, SEPT, NOV, DEC, MAY); a Saturday WOD only in MAY.
- **WED and SUN 'OFF' in every month** (the only gap: JANUARY's TEST/PEAK row leaves WED blank, the event month).

Which rows are active changes by month: resistance months, strength months, power months and test months. Aerobic work sits on the lower-body days (Mon/Thu), plus Tue at aerobic level 4. WOD days by month (recounted from the dump; WOD level from row 16):
- WOD level 2 (APRIL, JULY, OCT): Tue + Fri, matching 'LVL 2 = 2 wods a week'.
- WOD level 3: AUG Tue + Fri only (2 days, one short of 'LVL 3 = 3 wods a week'); NOV Mon + Tue + Fri; MAY Mon + Thu + Sat (no Tue/Fri WOD).
- WOD level 4 (SEPT, DEC): Mon + Tue + Thu + Fri.
- JAN (event month, no WOD level written in M16): Mon + Tue + Thu + Fri. FEB, MARCH, JUNE: no WODs.
- Skill is not tied to the WOD level: 'T2B/ DUBS' Tue + 'H.S./ DUBS' Fri in MARCH, APRIL, JUNE, JULY, NOV; all four days in DEC and JAN; no skill row in AUG, SEPT, OCT, FEB, MAY.
So "WODs on the upper-body days, spreading to Mon/Thu at higher levels" is only a tendency (INFERRED); the generator should take WOD days from the month grid, not from a level rule.

**The coach's level tables (OBSERVED A19:E24 / Q19:U25, decoded in `analysis/programs/prog_mm_crossfit_tracks.md` 1.4).** FULL TIME (competitor): STRENGTH 'LVL 1 = 3 SETS x 7' -> 4x6 -> 5x5 -> 6x4; POWER 3x3 -> 4x3 -> 5x3 -> 6x3; RESISTANCE 2x10 / 3x10. HALF TIME (class member, INFERRED reading): STRENGTH 3x7 -> 3x6 -> 3x5 -> 3x4 -> 'LVL 5 = Work up to 1RM'; POWER 3x4 -> 3x3 -> 3x2 -> 3x1. WODS 'LVL 1 = 1 a week' ... 'LVL 3 = 3 wods a week' (LVL 4 has no number; the grids show 4). AEROBIC 'LVL 1 = C' -> 'C, B' -> 'C,B, A' -> 'LACTATE CLERANCE'. **v1.1:** these tables drive the CrossFit-style class and bootcamp templates (5.5, 8.5); a LVL 5 1RM only at the end of a completed block, never from zero (R2-PER-07).

**OT18 'CLASS PROGRAMMING SPLIT'**. OBSERVED; verified in raw P1:V16.
- Session order: 'WARMUP/SKILL' -> 'STRENGTH/POWER' -> 'WOD'.
- MON 'SQUAT' + 'DUBS' + aerobic 'LVL 4'; TUES 'PRESS' + 'SNATCH'; THURS 'DEADLIFT' + 'GYMNASTICS' + 'LVL 3'; FRID 'CLEAN'. WED and SAT columns are blank; reading them as WOD-only days is INFERRED from the 'WARMUP/SKILL' -> 'STRENGTH/POWER' -> 'WOD' header. Sunday is not listed.
- S4:S11 hold codes '1/1' ... '4/4', '5' for WK 1-8 (typed as dates). Reading them as strength/power levels with WK 8 = 'LVL 5 = Work up to 1RM' is INFERRED (decode).
- **v1.1:** this class order is the template for the coach's 'CrossFit-style boot camp' sample plan (COACH-R2 R2-GEN-07); each class day trains its strength pattern and the paired upper group with 2 exercises each (R2-SES-05). Read as levels, the 8-week codes climb like the coach's stairway (R2-PER-04).

### 2.6 4 TRACKS and conjugate (OT19-OT24)

The tab is named '(NOT DONE) 4 TRACKS PROGRAMMING', but its own title cell reads A1 '8 WEEKS OF 3 TRACKS PROGRAMMING EXAMPLE - ONGOING TRAINING' (three tracks: A3 'STRENGTH', A30 'AESTHETICS', A69 'HYBRID'), and A2 says '*This is what I sell online to my athletes and coach them through it dependent on their goals' (OBSERVED). INFERRED: despite the '(NOT DONE)' tab name, these tracks represent what the coach actually sells.

| Track | Week | Day sequence (slot buckets) |
|---|---|---|
| OT19 STRENGTH-8 'conjugate style training' | Mon ME lower, Wed ME upper, Thu DE lower, Sat DE upper | ME lower: 'the work' squat or hinge (alternates weekly) -> 'the accessory' the opposite bilateral (3x6 '2RIR') -> 'the nuance' 'PULL UPS' / 'DB ROWS 8/8' ('MAX') -> 'the survival' unilateral of the **same** dominance ('ALL'). ME upper: heavy press -> row/pull-up -> 'ALT INCLINE DB BENCH' -> 'BICEP CURLS'. DE lower: **plyo is 'the work'** (3x6 'EASY') -> fast squat/deadlift -> pull -> unilateral. DE upper: fast press -> pull -> incline DB. |
| OT20 STRENGTH-12 | same days | ME lower: 'the work' (HIGH BAR SQUAT / RDL A/B) -> 'the accessory' opposite bilateral -> 'the nuance' '3x8' unilateral **opposite** to the work -> 'the survival' '3x8' isolation of the **same** muscle as the work. Upper: press -> pull (V in A weeks, H in B weeks) -> 'TATE PRESS' 3x20 / 'CABLE FLIES' -> 'SIDE RAISES'/'CURLS' / 'JM PRESS'. **No vertical press anywhere.** Week 7 'MID DELOAD'. |
| OT21 AESTHETICS-8 'bodybuilding style' | Mon L, Tue U, **Wed cardio**, Thu L, Fri U, **Sat cardio** | Lower: squat + deadlift (order alternates weekly in weeks 1-6; week 7 repeats deadlift first: K35 'DEADLIFTS' over K37 'BACK SQUATS') -> lunge ladder 'FFE CONTRA' -> 'FFE IPSI' -> 'RFE CONTRA' -> 'RFE IPSI' -> 'RFE' -> 'RFE & FFE' -> 'SL RDL' -> 'ACCESSORIES'. Upper: {DB bench <-> unilateral pulldown} -> {DB OH press or upright rows <-> machine-supported row or DB rows} -> 'ACCESSORIES'. The vertical press is there only in weeks 1, 4 and 5 ('DB OVERHEAD PRESS' / 'OVERHEAD PRESS'); weeks 2, 3, 6 and 7 use 'UPRIGHT ROWS' instead, so those weeks have **no vertical press**. Everything '1-2 RIR'; week 8 'DELOAD WEEK'. |
| OT22 AESTHETICS-12 (PPL x2) | Mon push, Tue legs, Wed pull, Thu push, Fri legs, Sat pull | Push: **side raises first** -> incline/flat bench -> flies -> dips -> 2 triceps. Legs (Tuesday): front squat -> leg press -> deadlift -> lunges -> staggered DL. Friday legs differ: only week 1 has 'DEADLIFTS' (O59); weeks 2-8 replace it with 'Staggered DL' and end with 'LEg Extensions', and weeks 9-12 Friday are 'RFE Lunges (bulgarian)' -> 'Staggered stance unilateral deadlifts' -> 'Leg extension one leg at a time' -> 'leg curls one leg at a time' -> '2 sets LEG PRESS MYO - 15-5-5-5-5-5', so **Friday has no bilateral hinge from week 2 on**. Pull: pulldown -> rows -> 'Pull under' -> face pulls/upright row -> curls. Week 7 'A WEEK LOWER'. Weeks 9-12 add mechanical-drop supersets and '2 sets LEG PRESS MYO - 15-5-5-5-5-5'. |
| OT23 HYBRID 'strenght - athletic - crossfitish training' (5 days) | Mon, Tue, Thu, Fri, Sat; Wed and Sun not listed | Mon: 'STRENGTH' squats -> 'OLY/ POWER' cleans -> 'UNI RDL/ CORE/ UNI GB' -> DB rows. Tue: **'A/C' 'SPEED' sprints first** -> '3x6 - DB bench press/ core' -> 'JUMPS' -> lower accessory. Thu: deadlifts ('KD' sic) -> snatches -> 'LUNGES/ ROWS' tri-set with core -> upper accessory. Fri: **'15-40 min constant cardo easy' first** -> jumps -> 'uni RDL/ core/ OH press' -> lower accessory. Sat: squats ('KD REPS') -> 'UNI KD' circuit, e.g. 'FF & RFE Lunge goblet / T2B/ hand switch pushups' -> 'FB ' 'VEr pull/ hor push'. The 'AMRAP' 12->20 row (D70) is a header at the top of the HYBRID block; tying it to the Saturday circuit is INFERRED. |
| OT24 '(NOT DONE) EXAMPLE CONJUGATE' | as OT19 | Earlier draft of OT19 (A1 'UNDER CONSTRUCTION'). It **does** have a sets/reps ladder: two rows E9:L10 (5,4,3,2,1,3,2,1 and 3,3,2,1,3,2,1,1), which equal rows 5-6 of STRENGTH-8's three-row ladder E4:L6. Differences: 'the accessory' 4 sets (vs 3), Saturday 'the work' 5 sets (vs 3), Wednesday ME press alternates 'HEAVY BENCH PRESS' / 'HEAVY OH PRESS' every week, 60 sets per week (vs 56). |

**v1 notes on 4 TRACKS / conjugate.** 'The work' / 'the accessory' / 'the nuance' / 'the survival' are confirmed (COACH-ANSWER ORD-07); the pulldown-first orders of AESTHETICS-8 (pulldown in pair 1, row in pair 2) and AESTHETICS-12 pull days are not followed - row before pulldown (ORD-01); 'FAST BANDED BENCH PRESS' becomes a fast bench press without bands (EQ-12); the work comes first even when it is the overhead press (ORD-02); HYBRID's Olympic lifts move before strength (ORD-03) and its Saturday knee day takes pulls instead of the push (UNI-11); its Saturday squats are the second squat exposure and become non-axial (PER-04); its Friday easy cardio is a real aerobic block (ORD-09); 'Pull under' = lat pull-over (LIB-09); side raises first only when delts are a priority (ORD-04). **v1.1:** powerlifters may add a light technique squat or deadlift (COACH-R2 R2-SES-02); the four-role days keep their OBSERVED design and are flagged where a muscle has one exercise (11.3).

### 2.7 Fragments (OT25)

All OBSERVED:
- **Sheet25** lists a leg day as four headers: 'BILATERAL HIP DOMINANT', 'UNILATERAL KNE DOMINANT', 'LEG FLEXION', 'BILATERAL KNEE DOMINANT'. There is **no unilateral hip-dominant** header. 'LEG FLEXION' as its own bucket is confirmed (COACH-ANSWER CAT-09).
- **'(NOT DONE) RESISTANCE PATTERNS '** lays out knee-dominant rows next to the push patterns and hip-dominant rows next to the pull patterns. That is the opposite of the BYOP day pairing. I treat it as layout only; the coach's pairing rule (UNI-11) confirms the BYOP pairing.
- **'AEROBIC CAPACITY CHEAT SHEET'** says '***Never do the same color workout in the same week ... a total of 3 Aerobic capacity workouts per week'. It also has a 7-drill running warm-up. v1: sessions per week by population (COACH-ANSWER ATH-07).
- **The ballistics tab** has a dynamic medball warm-up.
- **Sheet24** is a half-marathon plan with 2 runs a week. It is credited to someone else: A1 'HALF MARATHON PROGRAM by CHRIS HINSHAW ', A2 'Program we use for all Blaze Camp Athletes who are looking to run a half marathon.' It is an adopted external plan, not the coach's own model. v1.1: it stays the longest run; the library's '21.6 mile run' is removed from plans and tests (COACH-R2 R2-LIB-06).

---

## 3. Ordering rules

### 3.1 The master order (v1.1 tiers)

| Tier | Name | Buckets | Rule | Evidence |
|---|---|---|---|---|
| 0 | WARM-UP | WARMUP_GENERAL, WARMUP_PREP | Always written: 5 min any cardio + A March / A Skip / A Run (lower and athletic days) or mobility such as 'KB Book openers ' (press days). Never counted as volume or toward the exercise cap. | COACH-ANSWER ORD-08; OBSERVED 'Any Cardio Equipment' 1 x '5 Minutes' |
| 0.5 | SKILL (CrossFit / hybrid only) | SKILL | After the core block | OBSERVED class 'WARMUP/SKILL'; position INFERRED from ATH-11 |
| 1 | CORE BLOCK | CT_CORE_THORAX, CP_CORE_PELVIS, CORE_OTHER | 2 exercises x 2 sets, short of failure (one thorax, one pelvis; planes rotate across the week). First by default for every client; the user may move it after the plyos, after strength or to the end. Optional core supersets or monster sets may be added anywhere. | COACH-ANSWER ATH-11 ("we need all the core work to be done first... that'll give you a good warm-up"), VOL-17; COACH-R2 R2-SES-03 (approved; add-ons) |
| 2 | PLYO / BALLISTIC / SPRINT | AP_PLYO, AP_JUMP_LIMITED_KNEE, AP_SPRINT | 2-4 stations for field athletes, together with throws and COD; ballistic vs plyo share by ground-contact time | OBSERVED BYOP 'Plyo'; COACH-ANSWER VOL-08, VOL-17, ATH-01 |
| 3 | THROWS | AP_THROW | Medball ballistics; none for aesthetics except as warm-up | OBSERVED BYOP 'Throwing'; COACH-ANSWER ATH-05 |
| 4 | COD | AP_COD | Every athlete, tiered by turn angle | OBSERVED BYOP 'COD'; COACH-ANSWER ATH-06 |
| 5 | OLYMPIC / POWER | AP_TRIPLE_EXT, COMPLEX | Always before strength; up to 4 Olympic days a week - clean on squat days, snatch on hinge days; off by default for clients over 60 | COACH-ANSWER ORD-03; COACH-R2 R2-ATH-04, R2-ATH-08; OBSERVED BYOP 'Tripple Extension', BASEBALL 'OLY' before Part C |
| 6 | THE WORK + PAIRED UPPER | RP_BKD / RP_BHD + an upper compound | The day's main lift first, even when it is vertical; each upper compound sits beside the lower pattern of the opposite surface; horizontal before vertical | COACH-ANSWER ORD-02, UNI-11, ORD-01 |
| 7 | SECONDARY PAIRS | RP_UKD / RP_UHD + the other upper vector | Unilateral lower + its opposite-surface upper vector | OBSERVED BYOP slots 3-4; COACH-ANSWER UNI-11 |
| 8 | SECOND EXERCISES, ISOLATION / FOCUS | ISO_*, FOCUS, second compounds | Every group the day trains gets its second (third, fourth) exercise here; calves one exercise x 3 sets every leg day (COACH-R3 SES-01); shoulders 2 (rear delt + KB face pull on pull days); a small muscle goes first only when it is the client's priority | COACH-R2 R2-SES-05, R2-LIB-04; COACH-ANSWER VOL-17, ORD-04 |
| 9 | CONDITIONING | COND_SPRINT_BUYOUT, COND_CIRCUIT, COND_WOD | Buy-out, circuit or WOD last; a fighter's or HYBRID Friday aerobic block may open the day | OBSERVED BASEBALL Part E, class 'WOD'; COACH-ANSWER ORD-09 |

**What changed from v0.** v0 put PREP first and a core primer at tier 3b only for athletic programs, with core otherwise on optional days or as a finisher. The coach marked that NOT RIGHT (ATH-11): core goes first for everyone. v0 kept the pull order per parent workbook; the coach confirmed row first everywhere (ORD-01). v0 left HYBRID's strength-before-OLY as an open question; power goes first (ORD-03).

SCIENCE: whatever is done first in a session gets more reps and better quality (Simão et al. 2012). That supports power first, the work first and a priority muscle first. INFERRED: a tiring core block could take quality away from the maximal jumps, sprints or Olympic lifts that follow it, and the coach uses the first-position core block as a warm-up. So the generator keeps that block submaximal, 2 sets each and short of failure, and allows harder core work (Tabata, the '50 situps + 50 crunches + 50 reverse crunches' finisher) only when the block is moved to the end (**approved**, COACH-R2 R2-SES-03).

### 3.2 Verification across every observed template (OBSERVED; v1 status added)

| Template | Followed the v0 order? | Deviation (OBSERVED) | v1 status |
|---|---|---|---|
| OT04 BYOP ATHLETIC (+ JL, NO ACCESS) | 4/4 days | none | core block added first (ATH-11) |
| OT01 BYOP AESTHETICS | 2/4 | A days open with 'Calves' | calves first only if a priority (ORD-04) |
| OT02 3 DAY BUILDER | 2/3 | DAY 1 opens with 'Calves' | as OT01 |
| OT03 BYOP PPL | partly | legs: isolations before 'Unilateral HD'; push: 'Dips' after 'Flies', 'Vertical Push' before 'Incline' | push day re-ordered horizontal before vertical; legs order kept as an allowed lower-only order |
| OT05 BOOTCAMP 1 | 2/4 | Tue/Fri 'Bilateral HD' -> 'Vertical Pull' -> 'Unilateral KD' -> 'Horizontal Push' | **mistake, corrected** (ORD-06) |
| OT06 BOOTCAMP 2 | 2/6 | 2A 'Bicep' between the presses; 3A 'Cardio' third | allowed in circuit format (PRG-03) |
| OT08/OT09 UL, PPL | all | delt isolation interleaved in PPL | interleaving only as a priority / superset choice |
| OT10 FAT BURN | all lifting days | pulldown before row in 8/8 upper days | **row first** (ORD-01) |
| OT11-OT13 athletic | most | S3 core first; M2 snatch after step-ups; contrast pairs | core first is now the rule; Olympic before strength (ORD-03); contrast kept (ATH-12) |
| OT14-OT15 boxing | partial | conditioning first on four day types | real aerobic blocks (ORD-09) |
| OT16 BASEBALL | constant | core (Part B) after the ballistics (Part A) | core moves before Part A by default (ATH-11), movable back |
| OT19-OT24 4 TRACKS / conjugate | constant grammar | HYBRID strength before the Olympic lift; jumps after the bench | **power first** (ORD-03) |

Corroborating counts from the parallel audit (`analysis/equipment/ordering_audit.json`, OBSERVED): athletic before strength BYOP 12/12, BASEBALL 77/92, 4 TRACKS 15/23; power before heavy strength BYOP 12/12, BASEBALL 32/40, 4 TRACKS 0/16 (HYBRID); bilateral before unilateral 225 sessions; compound before isolation 227 sessions.

### 3.3 Rules inside a tier

| Rule | Status |
|---|---|
| Row before pulldown; horizontal before vertical for pulls and pushes | **COACH-ANSWER ORD-01** + coach chat ("row before overhead/vertical pull; horizontal push before vertical push"). Replaces the v0 split by workbook (FAT BURN 0/8, 4 TRACKS 0/38, boxing 0/2 put the pulldown first - OBSERVED, now not followed). |
| 'The work' first, regardless of direction (overhead-press weeks: OH press before the incline bench) | **COACH-ANSWER ORD-02** |
| Power before strength | **COACH-ANSWER ORD-03** |
| Landing / stick before reactive jumping; across a program, receive & pause -> receive then create -> repeated receive/create; more ballistic early, more plyometric later | COACH-ANSWER CAT-10, CAT-11; OBSERVED audit N6 11/13. It is **not** a "plyo zone" (CAT-11). v1.1: named the **Receive-Create stages** (1 Land, 2 Land & Go, 3 Repeat; 12-week plan weeks 1-3 / 4-7 / 8-12) - COACH-R2 R2-ATH-03 (RIGHT). |
| Bilateral jumps before single-leg jumps | WEAK OBSERVED (12/21); single-leg plyos are harder (COACH-ANSWER CAT-10) |
| Speed work in a fixed order: squirrel jumps -> MACH drills / acceleration starts -> max velocity; MACH drills go into the library | COACH-ANSWER LIB-21 (RIGHT); OBSERVED Sheet23 |
| Two plyo stations in one session take one exercise from each MODERATE plyo track (plate hops, hurdles) | COACH-ANSWER LIB-05 (RIGHT); OBSERVED JUSTICE LEAGUE Monday (landing + ankle hops) |
| Never two lower compounds back to back in a full-body session; lower and upper alternate | COACH-ANSWER UNI-11 ("If I do quads and hamstrings, that might bleed over"); OBSERVED audit R8 |
| Squat before hinge on a lower-only day, unless the day is hinge-led | OBSERVED (54 of 84); hinge-led second lower day added by PER-04 |
| Leg extension before leg curl | OBSERVED (12/14) |
| Isolation follows its compound day: quad isolation, biceps and rear delts on knee + pull days; hamstring curl, triceps and side delts on hip + push days | OBSERVED audit N1/N2 (biceps in 79 of 136 pull-only sessions; triceps in 73 of 99 push-only sessions); delt placement INFERRED from the UNI-11 surface logic. BOOTCAMP 2's biceps-on-press-day is kept as observed; the hybrid family puts its one weekly rear-delt station on the hip + push day (HY2) because the knee + pull day is full at 60 min (INFERRED, v1 verification). |

### 3.4 Exceptions

**Kept (each now tied to a coach answer):**
1. **Small muscle first** - only when that muscle is one of the client's declared Focus muscles (COACH-ANSWER ORD-04; COACH-R3 SES-01). OBSERVED cases: 'Calves' first on AESTHETICS A days and 3-DAY D1; side raises / 'Arnold press' first on AESTHETICS-12 push days.
2. **Conditioning first** - a fighter's aerobic block is real aerobic work, not a warm-up (COACH-ANSWER ORD-09); a sprint block can be the day's speed stimulus (OBSERVED boxing, HYBRID Tue).
3. **Contrast and complex stations** - a jump right after the heavy lift that primes it, for L2+ athletes off-season at about 78-85%, with no rest inside the complex (COACH-ANSWER ATH-12). OBSERVED: Starting A17/A18, boxing L22/L46, BASEBALL Block 2 Part C, 'ALL ABOUT SQUATS' 'FRENCH CONTRAST'.
4. **Core block moved** - after the plyos, after strength or to the end, at the user's choice (COACH-ANSWER ATH-11).
5. **Cardio mid-session** - inside bootcamp circuits (OBSERVED BOOTCAMP 2 3A; COACH-ANSWER PRG-03).
6. **Core add-ons anywhere** - a core superset with any exercise, or a monster set with core (usually at the end), at the coach's or user's choice (COACH-R2 R2-SES-03: "It should be optional to be thrown anywhere").

**Retired:**
- core primer only in athletic programs (v0 tier 3b) -> core first for everyone (ATH-11);
- core only on optional days for hypertrophy -> core first on every main day (ATH-11);
- pulldown first in FAT BURN / 4 TRACKS-derived sessions -> row first (ORD-01);
- HYBRID strength before the Olympic lift -> power first (ORD-03);
- calves first on every aesthetics A day -> only when calves are a priority (ORD-04);
- interleaved delt isolation by default -> only as a priority or superset choice.

### 3.5 Generator ordering rule (v1.1)

1. Warm-up (always, ORD-08).
2. Core block (default first, 2 x 2 short of failure, ATH-11, R2-SES-03; honour the user's chosen position).
3. Skill (hybrid only), then athletic tiers 2-4 in order (sprint work as squirrel jumps -> MACH / acceleration -> max velocity, LIB-21).
4. Olympic / power (ORD-03).
5. The work + its paired upper lift (ORD-02, UNI-11), then the secondary pair; horizontal before vertical inside each vector (ORD-01); then the second exercise of each group the day trains (R2-SES-05).
6. Isolation and Focus; a small muscle moves to the front of the resistance block only when it is one of the client's Focus muscles (ORD-04; COACH-R3 SES-01).
7. Conditioning last, except a fighter / hybrid aerobic block or a sprint block that opens the day (ORD-09).

---

## 4. Pairing rules

### 4.1 The coach's rule (COACH-ANSWER UNI-11, ORD-06)

**In any session that mixes lower and upper work, a hip-dominant pattern (the back of the lower body) goes with a push (the front of the upper body), and a knee-dominant pattern goes with a pull.** In the coach's words: "If I'm doing the back of my lower body, then the opposite would be the front of my upper body. That'll allow me to keep as far away as I can from bleeding over problems... You can do a lot of work throughout the week and more volume throughout your program." (UNI-11). And: "hip-dominant with pushing and knee-dominant with pulling. That's the model that I'm using for full bodies and for boot camps." (ORD-06).

What this means for the generator:
- The rule is **slot level**. Each upper compound carries a `pair` label with the lower pattern it belongs to (P1, P2, P3), and every generated template is checked against it (JSON `checks.per_day.pairing_flags`; all empty).
- It holds for full body, bootcamp, athletic, strength compressions and hybrid days. It does not apply to upper/lower or push/pull/legs splits, which do not mix lower and upper work in one session.
- The **vertical vector is no longer a free choice.** It follows the lower pattern it is paired with. v0's V_SAME / V_CROSS / V_ROTATE options become consequences of the lower pairing mode (4.2).
- v0 counted the rule at day level ("20 of 23 template-days"). That count is now only evidence that the coach already did this most of the time (OBSERVED): BASEBALL 92/92, BYOP aesthetics/athletic 100%, BOOTCAMP 2 6/6. The deviations are now either corrected mistakes (BOOTCAMP 1 Tue/Fri, ORD-06) or re-wired by the rule: HYBRID Saturday's push moves to Tuesday/Friday, the MM jump/medball vertical vectors swap, and the STRENGTH-8 lower-day pull is reconsidered (INFERRED, 6.14).

### 4.2 Same pattern vs cross pattern is a rule by goal (COACH-ANSWER UNI-06)

| Mode | What | Use for | Evidence |
|---|---|---|---|
| **Same pattern** | Bilateral and unilateral of the same dominance on one day (squat + lunge; hinge + single-leg hinge). The knee day then carries both pulls and the hip day both pushes. | Physique / bodybuilding, powerlifting / strength, and high-level athletes who demand more of their muscles to grow: "If they are a high-level athlete and they're demanding more of their muscles... I have to make sure I drive a lot harder into that muscle" | COACH-ANSWER UNI-06; OBSERVED BYOP aesthetics/athletic, STRENGTH-8 survival |
| **Cross pattern** | Bilateral of one dominance + unilateral of the other (squat + single-leg hinge). The day carries one pull (with the knee lift) and one push (with the hip lift). | Bootcamp, fat loss, general fitness, athletes by default, in season, 2-3-day plans: "I don't want them to get too sore so they can do the bootcamp more often" | COACH-ANSWER UNI-06; OBSERVED BOOTCAMP 1 A days, BASEBALL, STRENGTH-12 nuance, HYBRID Monday |
| **All four** | Lower-only days with all four lower patterns | Upper/lower and push/pull/legs | OBSERVED OT08, OT09, OT21, OT22 |

**v1.1 (COACH-R2 R2-SES-05).** Both modes now give every group they train 2-4 exercises. Same-pattern days do it with the unilateral lift (squat + lunge = 2 quad exercises). Cross-pattern days keep squat + single-leg hinge and add a lighter second exercise to each lower group - leg extension after the squat, leg curl after the single-leg hinge - as the coach's own BOOTCAMP 1 A day already does ('Leg Extensions' on the squat day, OBSERVED). So a cross day trains quads 2, hips 2, back 2, one push group 2 and calves 1 (about 9 exercises); a same-pattern day trains its lower group 2-3, its upper group 2 and the small muscles of that side.

Change from v0: v0's default gave athletes the BYOP same-pattern grammar for 4-6 days. The coach confirmed that athletes pair squat + single-leg RDL (UNI-06), so the v1 athletic default is cross pattern. The same-pattern athletic grammar stays as a variant for high-level athletes who need more stimulus to grow (the coach's own trigger, UNI-06) and for athletes whose goal is size off-season (INFERRED: the "more resistance" group of ATH-03 - linemen, wrestlers, rugby, heavyweights, throwers; open question 11.2-10).

### 4.3 Observed evidence (kept from v0, OBSERVED)

| Template-day | Bilateral | Unilateral | Relation |
|---|---|---|---|
| OT01 / OT04 / OT07 A and B days; OT02 D1 and D2 | BKD / BHD | UKD / UHD | SAME |
| OT05 BOOTCAMP 1 A / B; OT06 1A | BKD / BHD | UHD / UKD | OPPOSITE |
| OT16 BASEBALL (every labelled week) | 'bkd' / 'bhd' | 'uhd' / 'ukd' | OPPOSITE (audit N3: BKD+UHD 44, BHD+UKD 46) |
| OT20 STRENGTH-12 lower days | work + opposite accessory | 'the nuance' opposite to the work | OPPOSITE |
| OT23 HYBRID Mon / Thu | BKD / BHD | 'UNI HD' / 'UNI KD' | OPPOSITE |
| OT19/OT24 STRENGTH-8 lower days | work + opposite accessory | 'the survival' same as the work | SAME |
| OT11 Starting S1 / S2; OT12 M3, OT13 A1 | BKD / BHD | UKD / UHD | SAME |
| OT08, OT09, OT10, OT14, OT21; OT22 Tuesday | BKD + BHD | UKD + UHD | all four |
| OT22 AESTHETICS-12 Friday (weeks 2-12) | BKD only | UKD + UHD | no bilateral hinge |

Upper vector with the lower pattern, day level (OBSERVED, v0 count): knee + horizontal pull in 11 template-days, hip + horizontal push in 9, 3 exceptions (HYBRID Thursday, HYBRID Saturday, STRENGTH-8). Audit R9: 160 of 193 sessions overall. Audit N18: in BYOP the bilateral lift sits next to the horizontal vector 29 times vs 2, and the unilateral lift next to the vertical vector 24 times vs 2.

### 4.4 Day grammars (v1.1)

> **Changed in v1.3** (COACH-R4 R4-SES-05). Gym and athletic days use his A / B (and C) days; the cross-pattern grammar stays for his bootcamp circuits as written (section V2). Where the text below differs, the v1.3 section at the top of this file wins.

| ID | Grammar | Observed in | v1 status |
|---|---|---|---|
| G1 SAME_PATTERN | A = [BKD \| HPULL] + [UKD \| VPULL] (+ quad, biceps, rear delt, calves); B = [BHD \| HPUSH] + [UHD \| VPUSH] (+ leg curl, triceps, side delt, calves). **v1.1:** A + quad iso + <rear delt + biceps> + <KB face pull + biceps 2> + calf (3 sets); B + [leg curl \| chest iso] + <side raise + triceps> + triceps 2 + calf (3 sets) | OT01, OT02 D1-D2, OT04, OT07 | OBSERVED; consistent with UNI-11; v1.1 R2-SES-05 |
| G2 CROSS_PATTERN | A = [BKD \| HPULL] + [UHD \| VPUSH]; B = [BHD \| HPUSH] + [UKD \| VPULL]. **v1.1:** A + [quad iso \| VPULL] + leg curl + KB face pull + calf (3 sets); B = [BHD \| HPUSH] + [UKD \| HPULL] + [leg curl \| chest iso] + [quad iso \| VPULL] + calf (3 sets) (row added so the back keeps 2 exercises, row before pulldown) | OT05 A days; OT06 over 3 sessions | A days OBSERVED; **B days corrected** (the sheet's B = BHD + VPULL + UKD + HPUSH was a mistake, COACH-ANSWER ORD-06); v1.1 R2-SES-05 |
| G3 BASEBALL_PARTS | Mon [BKD \| HPULL] / UHD + biceps + calves; Tue [BHD \| HPUSH] / UKD + triceps + shoulders; Thu [BKD \| VPULL]; Fri [BHD \| VPUSH] | OT16 | OBSERVED; consistent with UNI-11; core (Part B) first by ATH-11 |
| G4 UPPER_LOWER | Lower 1 squat-led (axial squat, non-axial hinge); Lower 2 hinge-led (axial hinge, leg press); Upper: H pull -> H push -> V pull -> V push + arms + side and rear delts | OT08, OT10, OT14, OT21 | OBSERVED + PER-04, ORD-01, VOL-17 |
| G5 PPL | push / pull / legs; Legs 1 squat-led, Legs 2 hinge-led; weekdays flexible | OT03, OT09, OT22 | OBSERVED + PRG-02, PER-04 |
| G6 CONJUGATE_4ROLE | ME lower / ME upper / DE lower / DE upper: 'the work' -> 'the nuance' paired with the work -> 'the accessory' -> 'the survival' | OT19, OT20, OT24 | roles COACH-ANSWER ORD-07; nuance position and vector INFERRED from UNI-11, PENDING (6.14) |
| G7 QUALITY_DAY | CrossFit: knee + snatch / pull + clean / hip + snatch / push + clean | OT17, OT18 | OBSERVED (single-region strength days) |
| G8 ATHLETIC_THEMED | jump day = hip + pushes; medball day = knee + pulls | OT12 M1/M3/M4, OT13 A2 | **re-wired**: the observed days put the vertical pull on the jump/hip day and the vertical press on the medball/knee day; the generator swaps them (UNI-11) |

### 4.5 Laterality dial (COACH-ANSWER UNI-02, UNI-03, UNI-08, UNI-10, CAT-13)

> **Changed in v1.3** (COACH-R4 R4-SES-05). Each slot of his template keeps its laterality; the dial moves only the slots the template leaves open. For field and court athletes this is an open question for the coach. Where the text below differs, the v1.3 section at the top of this file wins.

Each lower (and upper) compound slot names a dominance. Its laterality - bilateral or unilateral - is set so that the week's bilateral:unilateral share of sets matches the client's dial. The dial runs from 90/10 to 10/90 (UNI-02). The coach's logic: unilateral work is the health and rotational foundation; bilateral work is the driving force for size and strength.

| Population | Share (bilateral : unilateral) | Evidence |
|---|---|---|
| Bodybuilders / powerlifters | about 50/50 at the start, moving to 80/20 - 90/10. Contralateral / ipsilateral work is a health accessory, mostly in the first 2-4 weeks, kept later only if something bothers them. | COACH-ANSWER UNI-02, CAT-13 |
| Field / COD athletes (tennis, soccer, basketball, football skill positions) | 10/90 - 20/80 | COACH-ANSWER UNI-02, UNI-03 |
| Athletes in season | minimal bilateral | COACH-ANSWER UNI-10 |
| Pain or injury | adjusted case by case; a painful bilateral lift swapped for a unilateral one keeps its sets "ideally" | COACH-ANSWER UNI-02, UNI-08 |
| Upper body | same logic | COACH-ANSWER UNI-03 |

**Contralateral vs ipsilateral** (COACH-ANSWER CAT-13): contralateral load pulls the athlete *into* the hip (change-of-direction athletes: football, soccer, basketball, tennis); ipsilateral load helps *out of* the hip (sprint acceleration, for example ipsilateral step-ups). The unilateral stations carry a `loading` note for this.

**Slot conversion** (PROPOSED - PENDING COACH APPROVAL): convert bilateral stations to unilateral stations of the same dominance, starting with the second weekly exposure, until the weekly share matches the dial. Keep at least one bilateral exposure a week off-season unless pain or the season says otherwise. The set math lives in `12_volume_algorithm_v1`.

### 4.6 Generator pairing rule (v1.1)

> **Changed in v1.3** (COACH-R4 R4-SES-05). Hip + push and knee + pull stand. On gym and athletic days the pairs are those of his A / B days. Where the text below differs, the v1.3 section at the top of this file wins.

| Situation | Grammar |
|---|---|
| Physique / bodybuilding, 3-6 days | G1 same pattern |
| Physique, 2 days | complete sessions: same-pattern lead pair + the other bilateral (non-axial) paired with its opposite-surface vector |
| Bootcamp, fat loss, general fitness, no-equipment | G2 cross pattern (gym straight sets or timed circuits) |
| Athletes (default) | G2 cross pattern with the athletic layout; under the 12 + 2 core cap (R2-SES-04) this leaves 2 plyo/ballistic stations + 1 Olympic lift (11.3) |
| High-level athletes who need more stimulus to grow (UNI-06); size-focused athletes off-season (INFERRED, ATH-03) | G1 same-pattern variant |
| In-sport Parts week | G3 |
| In season | 2-day cross pattern, minimal bilateral |
| Upper/lower or PPL requested | G4 / G5 |
| Strength | G6 |
| CrossFit / CrossFit-style bootcamp | G7 class model: each day's strength pattern + its UNI-11 upper group, 2 exercises each (R2-SES-05); the WOD carries the conditioning |


### 4.7 Exercises per muscle (COACH-R2 R2-SES-05; groups approved, COACH-R3 SES-01)

> **Changed in v1.3** (COACH-R4 R4-SES-05). On his A / B days the template gives each group its exercises (1-4); "2-4 per group, never 1" holds on split days. Where the text below differs, the v1.3 section at the top of this file wins.

**Rule.** On every lifting day, each muscle group the day trains directly gets **2-4 exercises, never 1**. In the coach's words: "full-body days need to have the same 2-4 exercises per muscle that day, so it might be a little longer day. It could start really short, but because you're doing more volume throughout the week, there's never one exercise, so from 2 all the way to 4." This replaces our v1 proposal of 1-2 per muscle on full-body days.

| Item | v1.1 rule | Evidence |
|---|---|---|
| Muscle groups | quads; hips (glutes + hamstrings - the back of the lower body); chest; back; shoulders / traps (front, side, rear delts, traps); biceps; triceps. **Calves: one exercise x 3 sets per leg day** (not part of the 2-4 rule). Core has its own 2-exercise block. | the coach's FOCUS headers (OBSERVED); grouping approved (COACH-R3 SES-01: "We count your FOCUS groups, with glutes + hamstrings as one 'hips' group ... calves keep one exercise x 3 sets per leg day" - RIGHT) |
| What counts | an exercise counts for a group when the group is its primary mover (credit 1.0; dips count for triceps). Helper credit (0.25) never makes an exercise. Athletic patterns never count (VOL-10). KB swings never count (R2-VOL-05). | COACH-ANSWER VOL-09, VOL-10, LIB-16; COACH-R2 R2-VOL-05 |
| How the second exercise is chosen | quads: lunge (same pattern) or leg extension / sissy squat (cross pattern); hips: single-leg hinge or leg curl; back: row + pulldown; chest: press + fly / incline / push-up variant; shoulders: vertical press + side raise, or rear delt + KB face pull on pull days; biceps / triceps: two isolations; calves: one exercise (straight-knee and bent-knee alternate between the week's leg days) | OBSERVED (BYOP slots, OT05 'Leg Extensions'); COACH-R2 R2-LIB-04; COACH-R3 SES-01; INFERRED pairing |
| Starting sets | 2 per exercise ("it could start really short"); calves 3 on their one exercise (4 at 90 min, VOL-17; COACH-R3 SES-01). This is the per-station start: where it leaves a trained group below **10 sets a week** (R2-VOL-04/06; read on groups, COACH-R3 VOL-01), the volume engine (12) adds the missing sets in week 1 by the VOL-07 order; whether the chosen length can hold that is the time-vs-minimums check (8.7.1) | COACH-R2 R2-SES-05, R2-VOL-04/06; COACH-R3 SES-01, VOL-01 |
| Length | days start at about the chosen length and grow as sets are added through the block; when the chosen time cannot hold the minimums: tell up front + offer another day or a longer session -> fewer groups trained directly -> recommended supersets -> stairway on the trained groups | COACH-R2 R2-SES-05; COACH-R3 SES-02; time model 7.4 |
| Never | cut a group to one exercise to save time ("never squeeze 2-4 exercises per muscle into a day that can't hold them"). A whole group may sit out of a short day - arms, calves and shoulder isolation first, from compound credit - and comes back at a longer length or on the optional day | COACH-R2 R2-SES-05; COACH-R3 SES-02 |
| Exemptions (flagged) | the OBSERVED four-role conjugate days (ORD-07) and the CrossFit class model (one strength pattern + its upper pair per day) | 8.7, 11.3 |
| Check | `checks.per_day.muscle_groups_R2SES05` in every template; result in 8.7 | recomputed |

---

## 5. Supersets, contrast, complexes and circuits

### 5.1 The coach's rule (COACH-ANSWER ORD-05)

> **Changed in v1.3** (COACH-CT CT-01). Supersets are a recommendation the person switches on. "The session is short" is no longer a trigger, and no pair is ever "needed". Where the text below differs, the v1.3 section at the top of this file wins.

"The supersetting is more like a fatiguing principle... It's a tool to use to fatigue the heart more and compress the time." Four use cases:

| Use case | Who | Generator trigger |
|---|---|---|
| Short session | anyone | session minutes below the length the station list needs (templates mark this with `superset_below_minutes`) |
| More stimulus | advanced (L3) athletes and lifters who no longer fatigue enough | level L3 + client preference |
| Aerobic capacity | athletes in the off-season working on VO2max and mitochondrial capacity | athletic family + off-season phase |
| Beginners who do not fatigue | L1 clients who are not getting fatigued by straight sets and enjoy it | level L1 + client preference |

INFERRED from the four cases: an intermediate (L2) with enough time trains straight sets by default.

**What to pair:** the UNI-11 pairs (knee lift + pull, hip lift + push) and isolation pairs (biceps + rear delts, triceps + side delts, calves + delts). **Never** two lower compounds, and never a heavy lift with a fatiguing lift for the same muscle - except the contrast complexes below. Athletic families may use the BASEBALL grammar (Part C = bilateral lower + one upper compound 'Superset - same reps'; Part D = unilateral + two isolations). Hybrid sessions do the paired accessory in the strength lift's rest period (OBSERVED HYBRID '3x6 - DB bench press/ core').

**v1.1 additions.** Small-isolation pairs are always done as supersets - a biceps exercise with a shoulder isolation, a side raise with a triceps exercise - and count as one exercise for the cap (COACH-R2 R2-SES-04); v1.2: calves are one exercise, so there is no calf pair (COACH-R3 SES-01). Athletic pairs are supersetted in the off-season (the ORD-05 VO2max / mitochondrial case). Core supersets and monster sets are optional add-ons anywhere (R2-SES-03).

**Superset recommendations (v1.2, COACH-R3 SES-02: "Recommend doing supersets so that it's a faster workout").** Every main day lists its eligible pairs (the UNI-11 pairs and the small-isolation pairs) as **recommended** supersets - "needed" when the day fits its length only with them (JSON `checks.per_day.superset_recommendation_R3SES02`, 8.7).

**Time vs minimums (v1.2; replaces v1.1's time-overflow rule; approved, COACH-R3 SES-02).** When the chosen days x minutes cannot hold the minimums - 10 sets a week per trained group, 2-4 exercises per group per day, calves 3 per leg day, a climbing stairway - the plan (1) says so up front and offers another day or the session length that fits; (2) if the user keeps the time, trains fewer groups directly (big movers first; arms, calves and shoulder isolation from compound credit); (3) recommends supersets; (4) lets the stairway climb on every trained group. A group is never cut to one exercise (7.6). The exact algorithm is in `12_volume_algorithm_v1.md` §3.10.1; every template is checked in 8.7.1.

### 5.2 Contrast and complexes (COACH-ANSWER ATH-12)

Contrast / French contrast is for L2+ athletes, off-season only, with the heavy lift at about 78-85% and no rest inside the complex. This closes v0 question 23: the coach's 'directly into' / 'immediately into' format stays as written. SCIENCE: the post-activation literature favours several minutes of rest before the explosive set (Seitz & Haff 2016); immediate-transition French contrast is an established coaching method, so this is a known method and not an error.

### 5.3 Bootcamp circuits (COACH-ANSWER PRG-03; v1.1 COACH-R2 R2-SES-05)

> **Changed in v1.3** (COACH-R4 R4-SES-02). 5-7 stations a session; rounds 3 / 4 / 5 by level (PROPOSED; was by minutes). Where the text below differs, the v1.3 section at the top of this file wins.

"We just have to make sure we keep those time circuits: 3 to 5 rounds, 30 to 50 seconds in each station... probably around 5 to 7 stations... anywhere from a 35-minute to a 45-minute workout total." (PRG-03)

v1.1: every muscle group a bootcamp day trains gets 2 stations (R2-SES-05); v1.2: calves one station, 3 rounds = 3 sets (COACH-R3 SES-01). That makes 8-10 stations, so a bootcamp day is **two circuits** of 4-6 stations, each inside the coach's 5-7.

| Item | Value | Evidence |
|---|---|---|
| Sessions per week | 4, 5 or 6 (also 2-3 for fat-loss clients) | PRG-03 |
| Circuit 1 (squat side) | [squat \| row] -> [2nd quad: wall sit / sissy squat / leg extension \| 2nd back: pull-up / pulldown / TRX high row] | PRG-03, UNI-11, R2-SES-05 |
| Circuit 2 (hinge side) | [single-leg hinge \| press] -> 2nd hip: slider / swiss-ball curl -> 2nd shoulder: KB face pull / floor Y-T raises -> calf (the day's one calf station) -> metabolic station (jumping jacks, mountain climbers, burpees, KB swings) | PRG-03, R2-SES-05, R2-LIB-04, R2-LIB-07, R2-VOL-05 |
| B day | circuit 1: [hinge \| push-up] -> [leg curl \| 2nd push-up variant]; circuit 2: [single-leg squat \| row] -> [2nd quad \| pull-up / pulldown] -> calf (one station) -> metabolic | ORD-06, UNI-11, R2-SES-05, R2-LIB-05 (bench push-ups: hands on the bench = foundational, feet on the bench = advanced) |
| Dose | 3 rounds x 35-50 s per station, 15 s transition, 1.5 min between rounds, 1 min between circuits | PRG-03 range; rounds x work picked by the time model |
| Session | 35-45 min including the 5-min warm-up and the core block; the model lands at ~41-43 min (10 stations at 3 x 40 s; 8 stations at 3 x 50 s) | PRG-03, ORD-08, ATH-11; INFERRED time model |
| Progression | inside the 45-min box: work time and shorter transitions; the OBSERVED FAT BURN ramp (3 x 30 s -> 5 x 50 s) only fits with fewer stations - question 11.3 | OBSERVED OT10; INFERRED |

### 5.4 Observed vocabulary (OBSERVED, kept from v0)

| Type | Verbatim evidence | Use |
|---|---|---|
| Superset flag | 'SUPERSET W/ 👇' (BYOP SETS option AV16) | Never used in a filled cell; the v1 output uses it to mark a pair |
| Non-competing pair (lower + upper) | BASEBALL Part C 'Superset - same reps' (19x), 'Superset - max reps' (5x), 'heavy Max reps' (6x, Thursday vertical pull), 'PART C 4x', 'SUPER SET 4X', '3x super set' | Bilateral lower + upper compound share the set count |
| Tri-set: unilateral + 2 isolations | BASEBALL Part D ('uhd'+'bicep'+'calfs'; 'ukd'+'tricep'+'shoulders') | Sets inherited from row 1 |
| Tri-set: unilateral + core + upper | HYBRID 'UNI RDL/ CORE/ UNI GB', 'FE contra/ DB rows/core', 'uni RDL/ core/ OH press' | v1: core moves to the core block; the pair stays |
| Strength + core | HYBRID '3x6 - DB bench press/ core' | Core in the rest period |
| Contrast pair | 'SUPERSET: HEAVY Hex bar Squats direclty into 10 Repeat Jump Squat HIGH JUMPs' ('3+10'); the ipsilateral FFE lunge into lunge jumps; BASEBALL 'Heavy front squats' + 'KB squat cleans', 'Barbell deadlift' + 'Broad jumps' | Heavy lift, then an explosive version of the same pattern |
| French contrast | 'ALL ABOUT SQUATS' I18 '78% of 1RM whatever squat immediately into tuck jumps, immediately into Goblet squats, immediately into reverse banded squat jumps' (filed 'OFF SEASON'); boxing '3 Heavy SQUATs + 5 Tuck jumps + 5 DB squat jumps + 5 Squirrel jumps', '4 Deadlifts - 5 broad jumps - 5 KB swings - 5/5 High Knee runs' | Heavy -> max jump -> loaded jump -> fastest. v1: the banded member is out (EQ-12); substitute an unloaded or assisted-free fast jump |
| n-of-each complex | BASEBALL 'front squats/high jumps/hex bar squat jumps/ banded assisted hops' 5 x '5 of each' | Rounds = sets (banded member out, EQ-12) |
| Plyo into eccentric | 'Lateral mid size box step up jumps directly into nordic curls' | |
| Strength + conditioning | 'DEADLIFTS (1-2RIR) + 3 min Jump Rope' | Rope in the rest period |
| Isolation pair | 'Heavy curls & Heavy tricep kickbakcs', 'Superset: leg ext. leg curls (MID WEIGHT)', 'Slider Runners + Slider Hamstring Runners' | Finisher |
| Isolation + core | 'DB side raises + Copenhagen plank :50 sec each side', 'SUPERSET: Dead bugs + Front Raises + Side Raises', 'Plate core & leg extensions' | v1: core moves to the block unless the user keeps it here |
| Mechanical-drop superset | 'front squats + Superset with 15 squats with no weight every set'; 'bench press + superset with max pushup set'; 'incline bench press + superset with a set of max bench dips...' | AESTHETICS-12 weeks 9-12 |
| Myo set | 'MYO SET' (15 + 5x5 with 3 s pauses); '2 sets LEG PRESS MYO - 15-5-5-5-5-5'; 'ALL ABOUT SQUATS' A27 '**MYO SET - ADVANCED' | Last exercise, machine or isolation (COACH-ANSWER VOL-15); advanced free-weight squat exception OBSERVED |
| Pyramid + drop | '12/10/8 -20' | 12 mid, 10 heavier, 8 heaviest, then a light 20 (COACH-ANSWER PRG-07) |
| Timed circuit | FAT BURN 4 stations, 3-5 rounds x 30-50 s | Finisher (COACH-ANSWER PRG-11); bootcamp sessions (PRG-03) |
| AMRAP / 40-rep sets | HYBRID 'AMRAP' 12 -> 20 | CrossFit / hybrid styles only (COACH-ANSWER VOL-11) |
| Tabata | '20 on/ 10 off - TABATA TIMER - Flutter kicks & Hip Turns' | Core interval (end-position core only, PROPOSED) |

SCIENCE: non-competing (agonist-antagonist or upper/lower) pairing keeps volume load while cutting session time (Robbins et al. 2010; Weakley et al. 2017; Iversen et al. 2021). Weakley et al. (2017) also report higher perceived intensity and physiological load per minute for supersets and tri-sets than for traditional sets, which fits the coach's "fatiguing principle".


### 5.5 CrossFit-style class and bootcamp (OBSERVED OT17 / OT18; COACH-R2 R2-GEN-07)

The coach will grade a "CrossFit-style boot camp" sample plan (R2-GEN-07). The class model comes straight from his class split (OT18: 'WARMUP/SKILL' -> 'STRENGTH/POWER' -> 'WOD') and his level tables (OT17).

| Part | Content | Evidence |
|---|---|---|
| Warm-up + core | 5 min any cardio + pattern prep; light core block 2 x 2 | ORD-08; ATH-11; R2-SES-03 |
| Skill | 5-8 min: double-unders, toes-to-bar, handstand, gymnastics | OBSERVED OT18 'WARMUP/SKILL', OT17 'T2B/ DUBS' |
| Strength / power | an Olympic lift (clean or snatch) and/or the day's main lift, then its group partner and the paired upper group - 2 exercises each (squat day: squat + lunge with row + pull-up; press day: press + side raise with bench + chest iso; deadlift day: deadlift + single-leg RDL; clean + push day: bench + chest iso, push press + side raise); calves 1 on leg days | OBSERVED OT18; COACH-R2 R2-SES-05, R2-ATH-04 |
| WOD | 10-20 min AMRAP / EMOM / for time; 40-rep sets and AMRAPs live here (VOL-11); WOD movements are conditioning, not counted as muscle exercises (INFERRED) | OBSERVED OT18 'WOD'; COACH-ANSWER VOL-11 |
| Levels (class member = HALF TIME) | STRENGTH 3x7 -> 3x6 -> 3x5 -> 3x4 -> work up to a 1RM; POWER 3x4 -> 3x3 -> 3x2 -> 3x1; RESISTANCE 2x10 -> 3x10 | OBSERVED OT17 Q19:U25; class-member reading INFERRED |
| Levels (competitor = FULL TIME) | STRENGTH 3x7 -> 4x6 -> 5x5 -> 6x4; POWER 3x3 -> 4x3 -> 5x3 -> 6x3 | OBSERVED OT17 A19:E24 |
| WOD level / aerobic level | WOD LVL 1-4 = 1-4 WODs a week; AEROBIC LVL 1 = C, 2 = C + B, 3 = C + B + A, 4 = + lactate clearance | OBSERVED OT17 |
| Weekly progression | the 8-week class codes '1/1' ... '4/4', '5' read as strength / power level per week: a stairway (R2-PER-04); the LVL 5 1RM only at the end of a completed block, never from zero (5RM / 3RM instead) | OBSERVED OT18 S4:S11; reading INFERRED; COACH-R2 R2-PER-04, R2-PER-07 |
| Length | 60-min class; ~67-68 min with the R2-SES-05 accessories, or a shorter WOD | INFERRED time model |

---

## 6. Across the week

### 6.1 Vector rotation

v1.1: KB face pulls are shoulder work, not a vertical pull (R2-LIB-04); cross-pattern B days carry both pulls (row + pulldown) so the back keeps 2 exercises (R2-SES-05).

v1 rule: every upper vector appears at least once a week. Same-pattern weeks give each vector 2x (knee days both pulls, hip days both pushes); cross-pattern A/B weeks give each vector 2x across A and B. Boxers keep pressing and pull-ups at reduced volume when punching volume is high (COACH-ANSWER ATH-04), replacing v0's OBSERVED "H push and V pull removed after week 2" as a rule. The vertical press for physique and fat-loss clients is still an open question (11.1, question 24): FAT BURN weeks 2-3 and AESTHETICS-8 weeks 2, 3, 6, 7 use upright rows or side raises in that slot (OBSERVED).

OBSERVED per template (kept from v0):

| Template | Mon | Tue | Thu | Fri | Option |
|---|---|---|---|---|---|
| OT01 / OT04 | H pull + V pull | H push + V push | = Mon | = Tue | same pattern |
| OT05 | H pull + V push | V pull + H push (mistake, ORD-06) | = Mon | = Tue | cross (corrected) |
| OT16 | H pull | H push | V pull | V push | rotate |
| OT08 UL | all four vectors on every upper day | | | | all four |
| OT10 FAT BURN | H push, V pull, H pull every upper day; vertical press only WK1 and WK4 Tuesday | | | | three vectors + delt slot |
| OT21 AESTHETICS-8 | pair 1 H push <-> V pull; pair 2 V push or upright row <-> H pull (vertical press weeks 1, 4, 5 only) | | | | crossed pairs |
| OT19 / OT20 | the press rotates bench / high incline / OH press (ME) and fast bench / fast DB OH press / push press (DE); pulls alternate H/V | | | | A/B weeks |
| OT15 boxing weeks 3-8 | only H pull + V push | | | | v1: reduce, never cut (ATH-04) |

### 6.2 Frequency invariant

| Status | Rule |
|---|---|
| OBSERVED in OT01, OT04, OT05, OT06, OT16; INFERRED as a rule | With 4 or more resistance days, every lower pattern at least 2x a week, push at least 2x, pull at least 2x, each upper vector at least 1x. With 2-3 days, every primary pattern at least 1x. |
| v1 addition (COACH-ANSWER PER-04) | The two weekly exposures of a squat or hinge pattern differ: one axial, one non-axial (6.4). |
| v1.1 addition (COACH-R2 R2-SES-05) | Per day: each muscle group trained gets 2-4 exercises (4.7). |
| Documented exemptions | Conjugate strength (two lower days, each pattern 1-2x - OBSERVED design); CrossFit class and competitor (one strength pattern per day; WODs carry the rest - INFERRED); strength 3-day H/V rotation by A/B week (OBSERVED); in season minimal bilateral (COACH-ANSWER UNI-10). |

`05_templates.json` runs the check on every v1 template; results are in 8.7. SCIENCE: training each muscle at least twice a week is modestly better than once for hypertrophy (Schoenfeld et al. 2016); with weekly volume equated, frequency matters little (Schoenfeld, Grgic & Krieger 2019).

### 6.3 Variation between the two weekly exposures (COACH-ANSWER PER-04, PER-02, PER-03)

- **Rule.** The second weekly exposure of a slot uses a different exercise from the same category (PER-04, RIGHT), and for squats and hinges the non-axial one (6.4).
- **Blocks.** Exercises stay fixed for a 4-6-week block; between blocks change one or two small variables (grip, stance, implement, range of motion, rep range), never all at once (PER-02, RIGHT).
- **A/B lead-lift weeks** (squat-led / hinge-led; bench / overhead) are optional, for clients who want variety (PER-03).
- **Client choice.** Every slot gets a default exercise plus a dropdown of swaps within the category (GEN-04); the client's preference can choose between alternatives (EQ-10).
- **v1.1 variations (COACH-R2 R2-LIB-01, RIGHT).** Library exercises are always the main pick. Between blocks the tool may change one detail (which hand holds the weight, grip, stance, implement, range) and show it as e.g. 'Reverse lunge - dumbbell in opposite hand'. It never invents an exercise.
- **OBSERVED examples:** JUSTICE LEAGUE (now 'Athletic Performance - Non-Competitive') Monday 'Front Squats' (AI46), Thursday 'Low Bar Back Squat' (AI50) - two axial squats, which the generator no longer reproduces (Thursday becomes leg press / belt squat); Monday 'Medium Depth Drop', Tuesday 'SL Depth Drops'; BASEBALL speed variant one day, strength variant the other; FAT BURN leg press <-> deadlift swap each week; in-season BASEBALL re-uses earlier menus.

### 6.4 Axial loading once a week (COACH-ANSWER PER-04; approved in COACH-R2 R2-SES-01 / R2-SES-02)

"I ideally don't want... to have them squat twice a week... I can do one day of squatting and the other day of leg pressing. I don't want to always load the lower back and the spine twice per week. I would rather just load it once per week and load it correctly, because I'm going to load it with the squat, and I'm probably going to load it with the deadlifts as well." (PER-04)

| Item | Rule | Evidence |
|---|---|---|
| Budget | one heavy axial squat + one heavy axial hinge a week, **on two different days** | COACH-ANSWER PER-04; COACH-R2 R2-SES-01 (RIGHT) |
| Counted (axial) | barbell back, front, zercher, overhead and Smith squats; barbell or trap-bar deadlifts and RDLs; good mornings | COACH-R2 R2-SES-02 (RIGHT) |
| Not counted | leg press, belt squat, hip thrust, back extension, reverse hyper, single-leg DB work, Olympic lifts, loaded jumps | COACH-R2 R2-SES-02 (RIGHT) |
| Second squat day | leg press or belt squat ("Belt squats are for people that you don't need to load them axially"); goblet squat, hack squat and pendulum are fine on that day if not sore; at home or with no machines, the goblet squat (INFERRED application) | COACH-ANSWER PER-04, EQ-11; COACH-R2 R2-SES-02 |
| Non-spinal hinge day | hip thrust, back extension, reverse hyper (approved); glute bridge, GHD hip extension, cable pull-through as INFERRED members. **KB swings are out**: they are ballistic and never count as hinge or glute volume | COACH-R2 R2-SES-01, R2-VOL-05 |
| Weekly layout (4-6 days) | heavy squat Monday (A1), non-spinal hinge Tuesday (B1), leg press / belt squat Thursday (A2), heavy deadlift Friday (B2) | COACH-R2 R2-SES-01 (RIGHT) |
| Powerlifters | may add a light technique squat or deadlift; it is not a heavy exposure (JSON `axial` = light_technique) | COACH-R2 R2-SES-02 |
| Soreness switch | an athlete already loaded on the back that week, or sore, switches to the belt squat | COACH-ANSWER EQ-11 |
| Older / injured / high-volume | constrained machines; never overhead squat, snatch, low-bar squat or depth jumps by default | COACH-ANSWER EQ-03; COACH-R2 R2-ATH-08 |
| Check | every template counts its axial exposures; all are at most 1 squat + 1 hinge (8.7) | recomputed |

v1 open questions 11.2-1 to 11.2-4 are closed by these answers.

### 6.5 Week skeletons and day spacing

- **A1 / B1 / OPT / A2 / B2 / OPT / OFF** (OBSERVED shape: BYOP, BASEBALL, BOOTCAMP 1, FAT BURN, AESTHETICS-8). In v1, A1 and A2 (and B1 and B2) are the same day type with different exercises: one is the axial exposure, the other the non-axial one (PER-04). v1.1: heavy squat Monday, heavy deadlift Friday, non-spinal hinge Tuesday, leg press / belt squat Thursday - approved (R2-SES-01).
- **Consecutive days alternate lower dominance** (knee day, then hip day) in BYOP, BASEBALL, CrossFit and boxing (OBSERVED). HYBRID breaks it (Thursday deadlifts, Friday single-leg RDL).
- **Strength ME/DE:** Mon ME lower, Wed ME upper, Thu DE lower, Sat DE upper (OBSERVED); same-region sessions 72 h apart.
- **PPL:** push / pull / legs (BYOP) or push / legs / pull (AESTHETICS-12); weekdays flexible (COACH-ANSWER PRG-02).
- **Bootcamp:** 4, 5 or 6 sessions a week (PRG-03). 4 = A, B, aerobic, A, B, aerobic; 5 = rolling A/B (A-B-A-B-A, next week B-A-B-A-B) (PROPOSED); 6 = Bootcamp 1-2-3, 1-2-3 (OBSERVED BOOTCAMP 2 order).
- **In season:** 2 days a week, low volume (COACH-ANSWER PER-08). v1.1: the harder gym day sits at least 48 h before a game; the weekdays come from the intake's season start date and practice / game days (COACH-R2 R2-ATH-07, R2-GEN-05).
- **CrossFit:** Mon knee, Tue pull, Thu hip, Fri push; aerobic and WOD days by the month grid (OBSERVED).

### 6.6 Optional days and Focus slots (COACH-ANSWER ORD-10, ORD-11)

- **OBSERVED block:** 'Calves', 'Cardio' / 'Aerobic Capacity', 'Core', 'Focus 1', 'Focus 2' (BYOP 'Optional', FCE5CD), on Wednesday and Saturday; the NO ACCESS athletic title '... 4 to 6 DAYS A WEEK' makes the optional days explicit.
- **Separate or add-on:** "Both. You can throw them in as add-ons, or you can do them on separate days. Ideally, separate days, so they don't get in the way." (ORD-10). The generator defaults to separate days and offers add-on mode.
- **v1.2 content:** warm-up -> core -> Focus 1 -> Focus 2 -> the Calves slot (one exercise; only when calves are a Focus muscle, or when 2-3 leg days cannot reach 10 calf sets - main leg days carry one calf exercise x 3 sets, VOL-17 / COACH-R3 SES-01) -> one aerobic session.
- **Focus slots:** both may hit the same muscle, 2-3 sets each (ORD-11, RIGHT). **v1.2:** they carry the client's **Focus muscle 1 and Focus muscle 2** (+1 to +3 weekly sets each, COACH-R3 SES-01) after the muscle's own exercises; they are also where a small muscle's bonus exercise goes (approved, COACH-R3 VOL-03: "on the optional day (e.g. Saturday); with no optional day, on a day that already trains biceps, never as the only biceps exercise of that day").
- **v1.1 (history):** the optional day was the default home of a small-muscle bonus exercise and of a priority muscle's 2 Focus exercises; calves there as 2 exercises. v1.2: one Calves slot (above); the user may switch the optional day's blocks off (COACH-R3 SES-02).
- **Generator's own restriction** (INFERRED, unchanged): no heavy bilateral lift in an optional block, even though the coach's Focus menu offers 'Back squats' AZ12, 'Zercher squats' AZ11, 'Leg press' AZ10 and 'barbell overhead press' AZ46 (OBSERVED). This now also protects the axial budget (PER-04).

### 6.7 Conditioning days (COACH-ANSWER ATH-07, ORD-09, ORD-10, EQ-14; COACH-R2 R2-SES-06, R2-ATH-06)

**v1.1: every number below is a default the user can change.** "You can always say, 'I need more cardio,' and then it just adds it to the program. Where I need less cardio, it takes away from the program" (R2-SES-06).

| Population | Aerobic sessions per week (default) | Evidence |
|---|---|---|
| General / fat loss | 3 (one Blue, one Green, one Orange) | COACH-ANSWER ATH-07; OBSERVED cheat sheet |
| Aesthetics / physique (all, not only competitive bodybuilders) | 4 = Blue + Green + Orange + a second easy Orange (long, low), plus optional 20-30-min easy walks after workouts | COACH-ANSWER ATH-07; COACH-R2 R2-SES-06 (RIGHT) |
| Athletes off-season | 2 baseball, softball, sprinters; 3 basketball, volleyball, football, tennis, golf, boxing, BJJ; 3-4 soccer, hockey, kickboxing, karate; 4 MMA, wrestling | COACH-R2 R2-ATH-06 (RIGHT) |
| Athletes pre-season / in season | 2 / 2 | COACH-R2 R2-ATH-06; COACH-ANSWER ATH-07 |
| Powerlifters | 2 easy (Orange) | COACH-R2 R2-ATH-06 (RIGHT) |
| CrossFit | by the coach's aerobic level (LVL 1-2: 2, LVL 3: 3, LVL 4: 4) | OBSERVED OT17 |
| Swimmers, runners, rowers, endurance cyclists | **0 extra gym aerobic sessions** by default - their practice is the cardio; the user can add one | COACH-R3 ATH-01, ATH-04 (RIGHT) |
| The remaining sports (R3-ATH-04 list) | 2-4 like the off-season list above | COACH-R3 ATH-04 |
| HYROX | 4 (Blue, Green, Orange + a second Orange: running is about half the race) + 2 short station circuits a week as finishers (never muscle sets) | COACH-R3 ATH-03 (RIGHT) |
| Stay athletic and active | 3; a 45-60+ min session of the user's activity counts as one of them (up to 2) | COACH-R3 ATH-05 (RIGHT) |

Placement: separate days first, then add-ons after lifting (ORD-10). Each JSON template carries `aerobic_ATH07` (key kept for the engine): the sessions its week layout already holds (an optional day counts 1), the default target, the add-ons still needed, and the user's more/less switch. Colours: never the same cheat-sheet colour twice in a week ('***Never do the same color workout in the same week', OBSERVED), except the two approved repeats - the aesthetics 4th session (a second easy Orange) and the powerlifters' 2 Orange. Any erg works (bike, rower, ski); track time, calories or distance (EQ-14). A fighter's aerobic block that opens the day is real aerobic work (ORD-09). OBSERVED placements kept from v0: BYOP 'Cardio' on the Wed/Sat optional blocks and inside every BOOTCAMP 2 session; UL/PPL '... WEDNESDAYS & SATURDAYS max 40 min of steady'; FAT BURN and AESTHETICS-8 Wed/Sat '30-40 mi slow/steady CARDIO'; boxing and HYBRID conditioning first; BASEBALL buy-outs only.

### 6.8 OFF days (OBSERVED)

- Sunday 'OFF' (F4CCCC) in 7 of the 9 BYOP program tabs (PPL, ATHLETIC, JUSTICE LEAGUE, BOOTCAMP 1 and 2, both NO ACCESS tabs). 'AESTHETICS - FULL BODY - 4 DAYS' and '3 DAY BUILDER' have no weekday labels and no 'OFF' row.
- CrossFit: Wednesday and Sunday 'OFF' every month. HYBRID: Wednesday and Sunday empty. STRENGTH tracks: Tuesday, Friday and Sunday empty. BASEBALL and boxing: Wednesday, Saturday and Sunday empty (sport, INFERRED).

**Rule (INFERRED, unchanged).** At least one full OFF day a week (Sunday).

### 6.9 'Buy out' finishers (OBSERVED in BASEBALL)

> **Changed in v1.3** (COACH-CT CT-01). No session length decides anything: the buy-out belongs to competitive athletes' and class sessions (PROPOSED). Where the text below differs, the v1.3 section at the top of this file wins.

- **What it is:** Part E (FFF2CC), 1-3 short maximal bouts ('2x 15 cal bike sprint', '3x 10 cal row sprint or ski', '1x 30 Sec Fast Run', '1 X 12 Cal' bike/SkiErg/row).
- **Weekly dose:** 0-5 bouts a week, block means 3.3 / 3.3 / 3.8 over loaded weeks, filled on 2-4 of the 4 days (recounted in v0).
- **Not a buy-out:** 'Fast run/ walk back or 3 min walk/rest - This is NOT a sprint' is a Part A sprint.
- **Rule.** Athletic sessions of 75+ min may end with 1-3 bouts on 2-4 days a week; none in maintenance phases (COACH-ANSWER PER-05: no buy-out or finisher in a deload; v1.1: deloads inside a block are gone, R2-VOL-07). Whether every 60+ min athletic session should carry one is still open (question 11).

### 6.10 Core placement (COACH-ANSWER ATH-11, VOL-17, CAT-08; COACH-R2 R2-SES-03)

**Rule.** Every session of every family opens with the core block right after the warm-up: "Ideally, start with the core work that'll give you a good warm-up, and then you go to the rest of the stuff... Some athletes like to do it at the end, so that's why I want them to be able to move it around." (ATH-11). About 2 core exercises (VOL-17).

- **Dose when first (approved, R2-SES-03):** 2 exercises x 2 sets, short of failure - a warm-up, not a workout. Harder core (Tabata, '50 situps + 50 crunches + 50 reverse crunches') only when the block is moved to the end.
- **Add-ons (R2-SES-03):** "they can always add supersets of core to any of the exercises that they want to... superset or monster set with different exercises. It should be optional to be thrown anywhere." The generator offers a core partner for any station and a monster set (read as a giant set of three or more exercises, INFERRED) at the end; both are off by default.
- **Content:** one thorax exercise (trunk moves on a still pelvis) and one pelvis exercise (pelvis/legs move on a still trunk) (CAT-08); planes rotate through the week (OBSERVED BASEBALL: frontal Monday, transverse Tuesday/Friday, sagittal Thursday); more rotational core for athletes who need it (VOL-17).
- **Short sessions:** 1 core exercise at 30 min (INFERRED).
- **Switch off (v1.2, COACH-R3 SES-02):** the user may switch the core block off for a day (block id `core`); the generator never leaves it out by itself.
- **OBSERVED placements (v0, now superseded as defaults):** BYOP aesthetics/bootcamp - optional days only; MM UL/PPL - none; FAT BURN - circuits; MM athletic - primer + paired + finisher; BASEBALL - Part B after the ballistics; HYBRID - inside tri-sets; CrossFit - 'SKILL' 'T2B/ DUBS'.

### 6.11 Warm-ups (COACH-ANSWER ORD-08)

Always written: 5 min any cardio + pattern prep. Pattern prep = 'A March' / 'A Skip' / 'A Run' on lower and athletic days, mobility such as 'KB Book openers ' 1 x '8/8' before pressing, the 7-drill running warm-up before sprint work, the dynamic medball warm-up (the only medball use for aesthetics clients, ATH-05), 'WARMUP/SKILL' in CrossFit classes (all OBSERVED). Warm-up items never count toward volume or toward the exercise cap.

### 6.12 Blocks, maintenance, tests and plan shapes (COACH-R2 R2-VOL-07, R2-PER-01..07; COACH-ANSWER PER-01, PER-05, PER-07; details in 06)

- **No deload inside a block (R2-VOL-07).** "No maintenance weeks are supposed to be at the end of a block, or if the athlete or coach demands a program of maintenance. It should never be thrown in the middle of a block." A block is completed. A client who cannot complete it stops the block and builds what comes next - a maintenance phase if they want one (recommended, not mandatory, COACH-R3 PER-01), then a whole new block.
- **Maintenance** (PER-01, PER-05): the same templates at about 50-70% of the sets, same exercises, 3+ RIR, no buy-out or finisher. Its length is chosen (R2-PER-06); at its end the plan simply ends - v1.1's end prompt is retired because nothing is stored (COACH-R3 PER-01, GEN-01).
- **The easy week after a block is a recommendation (v1.2, COACH-R3 PER-01):** "maintenance weeks are a recommendation. They don't have to be mandatory, so people can go ahead and start one, or when the block ends, it just ends, and then you have to go back into the app and build whatever you want next." Holidays and vacations are planned between blocks. A recovery week (BASEBALL Block 1 'wk 8': arm care + easy cardio, OBSERVED) is a maintenance option.
- **Pre-season** (R2-PER-06, approved): a 4-6-week block at about 60% of off-season sets with more speed and power, ending with a 1-2-week taper before the first game.
- **Every plan is a stairway** (R2-PER-03, R2-PER-04): small steps in the first weeks, slightly bigger after the halfway point, the hardest weeks last (a 12-week plan's last 4 weeks are "brutal"). "Start at a 2 and end at an 11" is how hard it feels and the overall load, not set counts (R2-PER-05). **Approved in round 3** (COACH-R3 VOL-04): about 3 % a week to the halfway week, about 5 % after it, each trained group at its peak in the last week, the effort cue 3 RIR → 2 → 1-2 → 1 RIR + intensifiers inside 1-3 RIR; computed once and printed whole. The step sizes live in 06 / 12.
- **Tests** (PER-07, R2-PER-07): chosen by checkbox at block start (strength, cardio, speed, jumps, body weight) or "no need for testing"; done before the block (or in week 1) and at the end - never during the block; the end test takes the place of that week's top sets (approved proposal). People who have not finished a block never test a 1RM or a max mile from zero: they use a 5RM / 3RM or 80-90% efforts.
- **Year plan (gen pop)** (R2-PER-01, R2-PER-02): the quarter themes are for people who want to stay in shape; they can re-order blocks, add or remove cardio, or swap in a winter powerlifting-style block. Athletes follow their season.
- **Retired:** the v1.1 check-in hooks (the step table, effort 10 = hold and -1 set, the block-at-risk prompt, the week-by-week mode, test reminders; COACH-R3 VOL-02, GEN-01); the v1 "deload when check-ins say so" and every OBSERVED tab ending ('DELOAD WEEK', 'MID DELOAD', 'TEST' / 'DELOAD') as a rule - they stay as evidence only (AESTHETICS-8, STRENGTH-8, STRENGTH-12, BASEBALL Block 2; HYBRID and Block 3 have none).

### 6.13 Set addition (COACH-ANSWER VOL-07, VOL-05, VOL-06; COACH-R2 R2-SES-05, R2-VOL-04, R2-VOL-06; COACH-R3 VOL-01, VOL-03, VOL-04, SES-01)

> **Changed in v1.3** (COACH-CX CX-01; COACH-R4 R4-PRG-01, R4-SES-04). The VOL-07 order and the day alternation stand. Every trained group reaches its planned final sets; the sets are split over the template's slots (2-5 an exercise); what the slots cannot hold goes to the bonus exercise on the optional day, or the group is capped and the plan says so (section V4). Where the text below differs, the v1.3 section at the top of this file wins.

- **Exercises per muscle:** 2-4 per muscle group on every day it is trained, never 1 (R2-SES-05; VOL-07 "about 3 to 4 exercises per muscle group per day" on split days). The v0 cap "at most 2 exercises per muscle per session" stays retired.
- **Order:** when a muscle needs one more set, it goes to the first exercise for that muscle in session order; the next added set goes to the second, then the third, then back to the first: **2/2/2 -> 3/2/2 -> 3/3/2 -> 3/3/3 -> 4/3/3**. Equivalent rule: the exercise with the fewest sets, earliest first. "I'm adding sets to the things that matter most... usually in the beginning... because I put all my energy into it."
- **Two sessions of the same day type** (A1 Monday, A2 Thursday) - **approved** (COACH-R3 VOL-03, RIGHT, re-asked with an example): added sets alternate, Monday's first exercise, then Thursday's first exercise, so both days stay even.
- **Small muscles:** they get 2 exercises on their day (R2-SES-05), which builds in most of VOL-07's bonus exercise. Any further bonus exercise (2 sets) goes on the optional day; with no optional day, on a day that already trains that muscle, never as its only exercise that day (approved, COACH-R3 VOL-03). **Calves never get a second calf exercise on a leg day**: extra calf sets go onto the existing calf exercise (max 4), then to the optional-day Calves slot (COACH-R3 SES-01).
- **Floor:** no trained group below 10 weekly sets ("I don't think anybody needs less than 10"); small muscles follow the same idea - 8 is barely maintenance (R2-VOL-04, R2-VOL-06). **v1.2:** the floor is read on the groups (quads, hips, chest, back, shoulders, biceps, triceps, calves), and rear delts are part of the shoulders group - "I wouldn't categorize the rear delt as an individual muscle" (COACH-R3 VOL-01); their own 4 / 6 / 8 sets are retired, a rear-delt exercise stays in every week and "add rear delts" is a plan-editing option.
- **Focus muscles (v1.2, COACH-R3 SES-01):** Focus muscle 1 and Focus muscle 2 get +1 to +3 weekly sets each (default +2), first in their session, through their own exercises, then the optional-day Focus slots. Most people train 20-30 sets per muscle per week; above 30 is for very advanced lifters (R2-VOL-06). The numbers live in 12.
- **Rate:** the plan follows its planned stairway (6.12), approved in round 3 (COACH-R3 VOL-04) and computed once: no check-in, nothing stored (COACH-R3 VOL-02, GEN-01). v1.1's check-in table (effort, completion, pain), 'Failed' and "10 = hold and -1 set" are retired; the plan prints a self-adjust guide instead (12 §3.7.3).

Pseudo-code:

```
def add_set(week, muscle):
    day = next_day_in_rotation(week, muscle)          # A1, then A2, then A1 ... (approved, COACH-R3 VOL-03)
    ex = [e for e in day.exercises if e.primary_group == muscle]
    target = min(ex, key=lambda e: (e.sets, e.position))   # fewest sets, earliest first (VOL-07)
    target.sets += 1
```

### 6.14 The work / the accessory / the nuance / the survival (COACH-ANSWER ORD-07)

| Role | Meaning | Effort |
|---|---|---|
| The work | the main lift, first in the session (ORD-02) | 1 RIR |
| The accessory | a supporting lift | 2 RIR |
| The nuance | weak-point, unilateral or variation work | MAX |
| The survival | isolation or joint-health work, done no matter what | - |

- **Use:** the backbone of strength plans; strength day types use these roles. Other families map onto them (PROPOSED): work = the work; paired upper and secondary lifts = accessory; Focus and unilateral weak-point work = nuance; calves, rear delts and joint-health isolation = survival.
- **Consequence for the cut order:** because the survival is done no matter what, a short strength session cuts the nuance first and then the accessory, and keeps the work and the survival (v0 cut the survival first).
- **Pairing inside strength days (INFERRED application of UNI-11, PENDING):** the OBSERVED STRENGTH-8 lower day puts a pull ('PULL UPS' / 'DB ROWS 8/8' MAX) after the hinge accessory every week. In v1 the nuance pairs with the work lift and sits right after it: a pull in squat-led weeks (as observed), a push in hinge-led weeks. The dynamic-effort speed lift is the week's only axial exposure of its pattern, and the max-effort accessory of the other pattern is non-axial (PER-04).


### 6.15 Olympic lifts through the week and older adults (COACH-R2 R2-ATH-04, R2-ATH-05, R2-ATH-08, R2-GEN-06)

| Item | Rule | Evidence |
|---|---|---|
| Frequency | Olympic work up to 4 times a week: "Some days are about cleans, and some days are about snatches... I take them as more of a squatty pattern and a hinging pattern. I take snatches a little bit more hingy than squatty." Generated athletic weeks put one on every main day: clean on knee / squat days, snatch on hip / hinge days (the BASEBALL Parts Tue/Fri hang snatch stays 75+ as OBSERVED) | COACH-R2 R2-ATH-04 |
| In season | a light piece, 2 sets of 3 (hang power clean or DB snatch), dropped in heavy game weeks; it may run on each in-season gym day | COACH-R2 R2-ATH-04 |
| Reps | full squat cleans and snatches 3-5 reps per set with the same weekly reps (e.g. 6 x 5 @ 75%); DB/KB and pull variants keep the 4 x 8 @ 75% -> 4 x 4 @ 90% ramp; "the coach's eye" on speed and how the athlete feels. The % is shown only when the athlete entered a tested 1RM for that lift; otherwise the same ramp is written in RPE / RIR (R2-GEN-06) | COACH-R2 R2-ATH-05, R2-GEN-06 |
| Load language | Olympic lifts are explained as power output; weight by RPE / reps in reserve and bar speed. A % appears only when the athlete entered a tested recent best (the approved R2-GEN-06 proposal); "they don't necessarily need to go by percentage unless you're a competitive Olympic lifter" - %-driven Olympic programming is its own programming | COACH-R2 R2-GEN-06 |
| L1 options | hang clean, single-arm DB snatch, KB squat clean, hex-bar jump, hang pulls | COACH-ANSWER ATH-10; COACH-R2 R2-LIB-07 |
| Older adults (60+) | **v1.2 (COACH-R3 ATH-02, RIGHT):** on by default - landing drills (step down and stick, no bounce), balance, quick stepping without a hop, light medball throws, fast machine work; off by default - low ankle hops, other jumps, Olympic lifts, depth jumps; overhead and low-bar squats stay out. Pickleball, padel and tennis players 50+: calf and Achilles work every leg day, rotator-cuff work, only low-impact jumps unless switched on. v1.1 text: no Olympic lifts, plyos or depth jumps by default; landing drills and low ankle hops are fine; the rest is an option with the warning W_OLDER_POWER: "Make sure that you have a fitness professional to help you understand what this means." (the coach's words; Spanish PROPOSED). Every plyo, limited-knee jump, Olympic and max-sprint station carries `older_default` + `older_option_warning` (sprints INFERRED as "anything like that") | COACH-R2 R2-ATH-08 |
| Youth | Olympic lifts from the floor from about 14, after one block of hang work | COACH-R2 R2-ATH-08 |
| Axial budget | Olympic lifts do not count toward the spine budget | COACH-R2 R2-SES-02 |

---

## 7. Session budget and session length

> **Changed in v1.3** (COACH-CT CT-01; COACH-R4 R4-SES-01, R4-SES-02, R4-SES-04). Sessions are sized by exercise count by client type. Session length is not an input and not a limit; the time model only feeds a printed estimate; nothing is cut for time (sections V3 and V4). Where the text below differs, the v1.3 section at the top of this file wins.

### 7.1 Session length by population (COACH-ANSWER UNI-09, PRG-03)

> **Changed in v1.3** (COACH-CT CT-01). These are his descriptions of what sessions usually take, not limits and not inputs. Where the text below differs, the v1.3 section at the top of this file wins.

| Population | Length | Evidence |
|---|---|---|
| Competitive athletes (field, court, combat), bodybuilders, powerlifters, pros | about 90 min, max 2 h | COACH-ANSWER UNI-09 |
| General / weight loss / everyday people | 45-60 min | COACH-ANSWER UNI-09 |
| Bootcamp | 35-45 min | COACH-ANSWER PRG-03 |
| Non-competitive athletic adults and youth | 60 min | PROPOSED |
| Older / injured | 45-60 min, constrained machines; for 60+ the R3-ATH-02 on/off defaults (landing drills, balance, quick stepping, light medball, fast machine work on; jumps and Olympic lifts off) | PROPOSED (EQ-03); COACH-R3 ATH-02 |
| CrossFit-style class / bootcamp | 60 min class (OBSERVED class order); ~67-68 min with the R2-SES-05 accessories, or a shorter WOD | INFERRED |

The intake (09, F24) offers 30/45/60/75/90 min. Adding 105 and 120 min for competitive athletes is PROPOSED (UNI-09 allows up to 2 h). v1.1: a full-body day starts at about the chosen length and grows through the block (R2-SES-05: "it might be a little longer day"); 7.5 gives the numbers. v1.2: whether a chosen length can hold the minimums is decided by the time-vs-minimums policy (COACH-R3 SES-02, 5.1, 8.7.1).

### 7.2 Exercise caps (COACH-ANSWER VOL-08, VOL-16, VOL-17, PRG-03; COACH-R2 R2-SES-04, R2-SES-05)

> **Changed in v1.3** (COACH-R4 R4-SES-02). By client type: general fitness / fat loss 5-7, aesthetics 6-8, strength 5-6, bootcamp 5-7 stations, field athletes up to 12 + the 2-exercise core block, older adults 5-6. Where the text below differs, the v1.3 section at the top of this file wins.

| Session type | Cap | Evidence |
|---|---|---|
| Field athletes | **up to 12 exercises + the 2-exercise core block (14 total)** - approved. With 2-4 exercises for each group trained that day, the cross-pattern day holds 2 jump / throw stations + 1 Olympic lift + about 9 counted resistance exercises; the same-pattern template (size-focused and high-level athletes) holds 3-4 + 1 + 6-7 - approved (COACH-R3 SES-01, RIGHT) | COACH-R2 R2-SES-04, R2-SES-05; COACH-R3 SES-01; COACH-ANSWER VOL-08, VOL-17 |
| Full-body days (all families) | 8-12 exercises (7-12 counted) - more than VOL-08's 5-7, because every group the day trains gets 2-4 exercises; the 12 upper bound is applied to every family (INFERRED from "max maybe 12") | COACH-R2 R2-SES-05; COACH-ANSWER VOL-08 |
| Split days (upper/lower, PPL) | 8-11 exercises (close to VOL-08's 8-9 at 75-90 min) | COACH-ANSWER VOL-07, VOL-08 |
| Bootcamp | two circuits of 4-6 stations (each inside the coach's 5-7) = 9-11 stations | COACH-ANSWER PRG-03; COACH-R2 R2-SES-05 |
| Strength | the four roles (OBSERVED) + calves (one exercise x 3) + the optional technique lift for powerlifters | OBSERVED; COACH-R2 R2-SES-02; COACH-R3 SES-01 |

**Counting convention (approved, COACH-R2 R2-SES-04):** warm-up drills never count; the 2-exercise core block sits outside the 12; a superset of two small isolations counts as one exercise. Still PROPOSED: conditioning finishers and WODs sit outside the cap. Each JSON day records `exercises` and `counted_exercises_R2SES04`.

**Unilateral time** (COACH-ANSWER UNI-09, PARTLY): unilateral work takes longer and must be accounted for. It is accounted for in the time model (2.5-2.75 min per unilateral set vs 2.25-2.5 bilateral) instead of a 1.5-slot multiplier.

### 7.3 Observed session sizes (OBSERVED, kept from v0)

Exercise counts are OBSERVED slot counts. Set counts are OBSERVED only where the coach typed sets; for the empty BYOP templates they are ASSUMED at 2-3 per slot.

| Template | Exercises / session | Working sets / session |
|---|---|---|
| 3 DAY BUILDER, BOOTCAMP 2, FAT BURN | 5 | ~15 (assumed); 10-12 + cardio (assumed); 14-18 + circuit (observed) |
| BYOP AESTHETICS, BYOP PPL, BOOTCAMP 1 | 7 | 19 observed on AESTHETICS Day 1; 17-21 (assumed); 18-21 (assumed) |
| MM PPL push/pull; MM UL upper | 6; 8 | 16-23; 24-27 |
| MM UL lower / PPL legs (incl. 3 A-drills) | 10 (7 without the A-drills, which are not exercises in v1, ORD-08) | 20-32 |
| BYOP ATHLETIC / JUSTICE LEAGUE | 10 | 20 (2 sets per slot) |
| BASEBALL | median 9 (6-11) | median 29 (supersets / tri-sets) |
| MM athletic | 4-13 movements excl. throws | 9-35 |
| STRENGTH-8 / -12 | 4 (3 on STRENGTH-8 / CONJUGATE DE upper) | STRENGTH-8 14 / 15 / 16 / 11 (56 a week); CONJUGATE 60 a week |
| HYBRID | 4-6 stations | 8-22 |
| Optional day | 5 | ~12 + 1 cardio bout (assumed) |

### 7.4 Time-cost model (INFERRED; rests COACH-ANSWER VOL-14; set durations SCIENCE)

> **Changed in v1.3** (COACH-CT CT-01; COACH-R4 R4-SES-01). The model only produces the average time printed on each day ("about 60-75 min, an estimate, for information only"). Where the text below differs, the v1.3 section at the top of this file wins.

| Item | Minutes |
|---|---|
| Warm-up | 5 general + 2-3 pattern prep (ORD-08) |
| Core block | about 3 per exercise (2 sets x 1.25 + 0.5 setup); 2 exercises = about 6 |
| Hypertrophy compound set (rest 1-2 min, VOL-14) | 2.25 per set + 1 setup; 2.5 at 90-min sessions (rest ~2 min; VOL-14 allows up to 3) |
| Unilateral set | 2.5 per set + 1 (2.75 at 90 min) |
| Strength set (rest 3-6 min, VOL-14) | 4.0 per set + 2 setup |
| Heavy athletic compound | 3.0 per set + 1 |
| Isolation set (~60 s rest) | 1.75 per set + 0.5 (1.9 at 90 min) |
| Plyo / ankle hops / COD set | 1.5 + 0.5 |
| Throw set | 1.25 + 0.5; the full 19-throw list (LIB-22) about 18 min, 6-8 throws about 8 min |
| Olympic set | 2.5 + 2 setup |
| Superset (per component set) | 1.75 + 1 per pair; a pair with a strength lift = the strength lift + 1 (the partner fits in the rest) |
| Buy-out / WOD / skill / aerobic add-on | 4 / 12-15 / 5-8 / 20-30 |
| Bootcamp circuit | 5 warm-up + core (2 x 2 rounds x 50 s) + rounds x stations x (work + 15 s) + (rounds - 1) x 1.5 |
| Sets range 'a-b' | a below 90 min, b at 90 min |

Calibration on the coach's own sessions (v0 model output, unchanged): AESTHETICS Day 1 51 min straight / 40 supersetted (without core); JUSTICE LEAGUE Monday 61; STRENGTH-8 Monday ME lower 58; BASEBALL B2 'WK 1' Monday 61; BOOTCAMP 2 1A 35-40; FAT BURN WK1 Monday + circuit 57; HYBRID Monday WK1 / WK7 42 / 60. v1 adds the core block (about 6 min) and the always-written warm-up to every session.

**v1.1: two time points.** Every template is timed at the **block start** (its starting sets: 2 per exercise; calves 3 on their one exercise, v1.2 - before the floor of 10 sets a week, which 8.7.1 adds) and **late in the block** (after the VOL-07 order adds about 5 sets per group-day: +2 on each group's first exercise, +1 on the others - an upper estimate, because the weekly ceilings in 12 usually stop sooner). When the start estimate is more than 10% over the chosen length, the JSON also gives the time with every pair supersetted (the supersets the plan recommends, R3-SES-02). Bootcamp circuits: 5 warm-up + core (2 x 2 rounds x 50 s) + for each of the two circuits rounds x stations x (work + 15 s) + (rounds - 1) x 1.5 min, + 1 min between circuits.

**Headroom.** Full-body days start at about their length and lengthen through the block (R2-SES-05: "a little longer day"). v1.2: what a chosen length can hold is the time-vs-minimums check (COACH-R3 SES-02, 8.7.1): tell up front and offer more time; if the time is kept, fewer groups trained directly; supersets recommended; never a group cut to one exercise.

### 7.5 Content and time by session length (v1.1; minutes from the time model, INFERRED) - RETIRED in v1.3

> **RETIRED in v1.3** (COACH-CT CT-01; COACH-R4 R4-SES-02). Content comes from the client type and his template, not from a session length. The text below is kept as history only.

| Minutes | Aesthetics | Athletic | Strength | Fat loss / bootcamp | Hybrid / CrossFit |
|---|---|---|---|---|---|
| 45 | knee day: [squat \| row], [lunge \| pulldown], rear delt + KB face pull, calf (3 sets) = 7 exercises (~44 min supersetted); hip day: [hinge \| bench], [single-leg hinge \| OH press], chest iso, side raise, calf (3 sets) (~44); 2-day days and 3-day Day C ~51-59 | not a default | not a default | gym: 9 exercises (quads 2, hips 2, back 2, shoulders or chest 2, calves 1) ~51 min with pairs supersetted - a longer day; circuit: two circuits, 9-11 stations, ~43-45 min | not a default |
| **60** | knee day 10 exercises (quads 3, back 2, shoulders 2, biceps 2, calves 1) ~62 min at the start / ~90 late; hip day 10 (hips 3, chest 2, shoulders 2, triceps 2, calves 1) ~62 / ~91; upper/lower: lower ~51, upper ~64; PPL ~47-51 | 11-12 exercises / 11-12 counted: core 2, plyo + Olympic (+ COD on hip days), 8 resistance + one calf exercise, ~62-66 / ~89-94; same-pattern variant ~54-58 | - | gym ~60 / ~88 | class ~67-68 (or a shorter WOD); hybrid 2-day ~67 |
| 75 | + Focus room, sets 3 | + medball throw on knee days, buy-out | - | - | - |
| 90 | + lat pull-over and Focus, 3 sets on compounds: ~84-89 / ~113-120 | 3 sets, supersetted pairs (off-season): ~84-85 / ~111; BASEBALL Parts with Part F ~86-96 | conjugate ~58-66; 2-day compression ~87-94; 3-day trio ~70-75 | - | ~80-94 |

### 7.6 What to cut first, what to add first (v1.1) - RETIRED in v1.3

> **RETIRED in v1.3** (COACH-R4 R4-SES-04; COACH-CT CT-01). Nothing is cut automatically. Each day names the easiest things to remove (the conditioning finisher, extra jump / throw stations, small-muscle accessories, bonus exercises) and the person decides; the generator always keeps the 2 core exercises, the main lifts and the first athletic station. The text below is kept as history only.

**When time is short (v1.2, COACH-R3 SES-02):** the plan first tells the user and offers another day or a longer session (8.7.1); with the time kept, supersets are recommended (ORD-05) and whole groups - never the second exercise of a group - leave the day (arms, calves and shoulder isolation first, from compound credit); a group the day trains keeps 2 exercises (COACH-R2 R2-SES-05). The cut orders below apply inside that policy.

| Family | Cut order | Never cut |
|---|---|---|
| Aesthetics | Focus -> the third exercise of the lead group (leg extension / leg curl / pull-over) -> the arm groups as a whole (both biceps or both triceps exercises; they come back on the optional day) | any group's second exercise, calves (2 exercises, VOL-17 / R2-SES-05), the week's rear-delt work (VOL-17), the core block (ATH-11) |
| Athletic | buy-out -> the medball throw on knee days (COD stays on hip days, ATH-06) -> sets drop to 2 | core block, 1 plyo/ballistic, the Olympic lift (ATH-10, R2-ATH-04), any group's second exercise, calves, the week's rear-delt work |
| Strength | the nuance -> the accessory | the work and the survival (ORD-07) |
| Bootcamp | rounds 4 -> 3 -> work time 40 -> 30 s | any group's second station, calves, the week's rear-delt station |

| Family | Add order when time is long |
|---|---|
| Aesthetics | sets on the compounds (2 -> 3 -> 4) by the VOL-07 order; the third exercise of the lead group; Focus for Focus muscle 1 / 2 (VOL-07, ORD-11; COACH-R3 SES-01); an aerobic add-on or a walk (R2-SES-06) |
| Athletic | a third set per slot; the medball throw / a 2nd plyo while the 12 cap allows (R2-SES-04); buy-out (2-4 days a week) |
| Strength | survival isolations; the light technique lift for powerlifters (R2-SES-02); aerobic Orange on a separate day (R2-ATH-06) |

SCIENCE (weak): a per-session ceiling of roughly 6-11 hard sets per muscle is a practitioner heuristic with limited direct trial evidence; Schoenfeld et al. 2017 is about the weekly dose-response. A knee day with squat + lunge + leg extension at 2 sets each puts 6 quad sets in one session at the start and about 10 late in the block, inside that range. The weekly numbers belong to the volume engine (03 / 12).

### 7.7 Reconciliation with `03_volume_dosing.md`

03 gives sets per session by length and level; this file gives station selection, order, pairing and time. Where they differ, set counts come from 03 / 12 and station selection from here. v0's 60-min anchor and v0 03's 75-min athletic anchor are both replaced by the population lengths in 7.1.


v1.2: `12_volume_algorithm_v1` (v1.2) estimates full-body days at 7-10 resistance exercises and 55-85 min with its own changeover-based time model and owns the time-vs-minimums algorithm (§3.10.1). The per-template numbers here (8.7, 8.7.1) also count the small-isolation pairs, and give both ends of a block (start / late). Where they differ, sets and weekly numbers come from 12, station selection, order, pairing and the per-muscle exercise count from here.
---

## 8. Generator-ready split templates (2-6 days x 6 goal families) - regenerated in v1.1 and v1.2

> **Changed in v1.3** (COACH-R4 R4-SES-02, R4-SES-05; COACH-CT CT-01). The gym days of the physique, fat-loss and no-equipment families, push / pull / legs and the athletic days are rebuilt on his skeletons (section V2), with a rank per exercise and a count per client type instead of a scale from 45 to 90 minutes. Strength, hybrid / class, bootcamp circuits, BASEBALL Parts and HYROX stay as written. The tables of 8.1, 8.2, 8.4 and 8.6 below are the v1.2 layouts ("2-4 exercises per group"). Where the text below differs, the v1.3 section at the top of this file wins.

**How to read this section.**
- Every day opens with the warm-up (not shown) and the light core block (`core x2` = 2 exercises x 2 sets, short of failure; movable; core supersets / monster sets optional - ATH-11, R2-SES-03).
- `[A | B]` = a UNI-11 pair (lower pattern or lower isolation + its opposite-surface upper lift). Straight sets, or a superset when the session is short or another ORD-05 use case applies (athletic pairs are supersetted off-season).
- `<A + B>` = a small-isolation superset (always a superset; counts as one exercise for the cap, R2-SES-04) or a BASEBALL Part D tri-set.
- `*` = the week's heavy axial exposure of that pattern; `~` = the non-axial exposure (leg press / belt squat, or hip thrust / back extension / reverse hyper) (PER-04, R2-SES-01/02).
- `(60+)`, `(75+)`, `(90+)` = included only at that session length or longer.
- **Sets (v1.2):** every exercise starts at 2 sets (3 on compounds at 90 min); calves 3 on their one exercise (4 at 90 min; COACH-R3 SES-01); sets then rise by the VOL-07 order through the stairway. Where that start leaves a trained group under 10 sets a week (R2-VOL-04/06), the engine adds sets in week 1; whether the chosen length holds that is the time-vs-minimums check (8.7.1).
- **v1.1 rule:** every muscle group a day trains has 2-4 exercises (R2-SES-05; groups approved, COACH-R3 SES-01), calves one. The `groups` line of each day lists them; the JSON checks them (`muscle_groups_R2SES05`).
- **v1.2:** every station carries a block id and every day its block list with the on/off defaults (COACH-R3 SES-02); every main day lists its recommended supersets.
- Every template, its variants and its checks are in `05_templates.json > generator_split_templates`. The build script checked each one (8.7).
- Evidence: day content tagged OBSERVED where it comes from a coach template; the v1 / v1.1 changes are tagged with the coach answer that caused them; whatever is neither is INFERRED or PROPOSED.

### 8.1 Muscle & Physique (aesthetics / bodybuilding) - same pattern (UNI-06)

Default lengths: 60 min general physique, about 90 min bodybuilders (UNI-09). Aerobic: 4 a week (Blue, Green, Orange + a second easy Orange) + optional 20-30-min walks, adjustable (COACH-R2 R2-SES-06); the week layouts hold 0-3 of them, the rest are add-ons (`aerobic_ATH07`). No medball except as warm-up (ATH-05).

| Days | Week (Mon..Sun) | Day types (v1.1) | Groups per day | Evidence |
|---|---|---|---|---|
| 2 | A, aerobic, OFF, B, aerobic, OPT (or aerobic), OFF | **A - squat + pull, hip thrust + press (complete):** core x2 -> [BKD* \| HPULL] -> [UKD \| VPULL] -> [BHD~ \| HPUSH] -> [leg curl \| chest iso] -> <rear delt + KB face pull> -> calf (3 sets) -> <biceps + biceps> (75+). **B - deadlift + push, leg press + pull (complete):** core x2 -> [BHD* \| HPUSH] -> [UHD \| VPUSH] -> [BKD~ \| HPULL] -> [quad iso \| VPULL] -> <chest iso + side raise> -> calf (3 sets) -> <triceps + triceps> (75+). | 2 each for quads, back, hips, chest, shoulders, calves (+ arms at 75+); 11 exercises, ~60 min at the start with pairs supersetted, ~88 late | INFERRED (no 2-day template exists); each day carries both bilaterals (the second non-axial, PER-04); v1.1 R2-SES-05. Alternative (INFERRED): the 4-day A and B once each - shorter days, each muscle once a week |
| 3 | A, OPT, B, OPT, C, aerobic, OFF | **A - squat + pull:** core x2 -> [BKD* \| HPULL] -> [UKD \| VPULL] -> quad iso (60+) -> <rear delt + biceps (60+)> -> <KB face pull + biceps 2 (60+)> -> calf (3 sets) -> lat pull-over (90+) -> Focus (90+). **B - deadlift + push:** core x2 -> [BHD* \| HPUSH] -> [UHD \| VPUSH] -> [leg curl (60+) \| chest iso] -> <side raise + triceps (60+)> -> triceps 2 (60+) -> calf (3 sets) -> Focus (90+). **C - both bilaterals, non-axial:** core x2 -> [BKD~ \| HPULL] -> [BHD~ \| HPUSH] -> [UKD \| VPULL] -> [leg curl \| chest iso] -> <side + rear delt> (75+) -> calf (3 sets) -> Focus (90+). | A: quads 3, back 2-3, shoulders 2, biceps 2, calves 1; B: hips 3, chest 2, shoulders 2, triceps 2, calves 1; C: quads, back, hips, chest 2 each, calves 1 | Day content OBSERVED (OT02 3 DAY BUILDER D1/D2/D3); calves to the end (ORD-04); Day C non-axial (PER-04); v1.1 R2-SES-05, R2-LIB-04; Mon/Wed/Fri INFERRED. Alternative: PPL once a week on any 3 days (PRG-02). |
| 4 | A1, B1, OPT, A2, B2, OPT, OFF | **A1 - squat + pull (heavy squat):** as 3-day A. **B1 - hip thrust + push (non-axial hinge):** as 3-day B with BHD~. **A2 - leg press / belt squat + pull:** as A1 with BKD~. **B2 - deadlift + push (heavy deadlift):** as B1 with BHD*. **OPT:** core -> Focus 1 -> Focus 2 -> calves (one exercise, only if a Focus muscle or the leg days cannot reach 10) -> aerobic. | A days: quads 3, back 2 (3 at 90), shoulders 2, biceps 2, calves 1; B days: hips 3, chest 2, shoulders 2, triceps 2, calves 1; 10 exercises / 8-9 counted, ~62 min at 60, ~84-89 at 90 | OBSERVED (OT01 A/B; weekdays OT07) + v1 rules; spacing approved (COACH-R2 R2-SES-01); v1.1 R2-SES-05. Alternative: upper/lower (OT08 / OT21): Lower 1 core x2 -> BKD* -> BHD~ -> UKD -> UHD -> quad iso -> leg curl -> calf (3 sets); Lower 2 hinge-led (BHD* first, BKD~); Upper core x2 -> HPULL -> HPUSH -> VPULL -> VPUSH -> chest iso -> <biceps + triceps> -> <biceps 2 + triceps 2> -> <side raise + KB face pull>; Wed/Sat aerobic (lower ~51 min, upper ~64). |
| 5 | A1, B1, OPT, A2, B2, OFF, OFF | as 4 days with one optional day (separate day preferred, ORD-10) | as 4 days | INFERRED from the OBSERVED '4 to 6 DAYS A WEEK' framing |
| 6 | A1, B1, OPT, A2, B2, OPT, OFF | as 4 days with both optional days | as 4 days | OBSERVED. Alternative PPL x2 with flexible weekdays (PRG-02): Push core x2 -> HPUSH -> HPUSH (incline) -> VPUSH -> fly -> dips (triceps 1) -> triceps -> side raise -> overhead triceps (90+); Pull core x2 -> HPULL -> HPULL -> VPULL -> lat pull-over (75+) -> <rear delt + KB face pull> -> biceps -> biceps 2; Legs 1 squat-led (BKD*, BHD~) and Legs 2 hinge-led (BHD*, BKD~), each with quad iso, leg curl, calf (3 sets) (~47-51 min at 60). |

### 8.2 Athletic Performance (field / court / combat / aquatic; non-competitive adults and youth; stay-active path) - cross pattern by default (UNI-06)

Default lengths: about 90 min competitive (max 2 h), 60 min non-competitive and stay-active (UNI-09; 60 PROPOSED). **v1.1 layout per session** (VOL-08, VOL-17, R2-SES-04, R2-SES-05): core x2 -> 2 plyo/ballistic stations (plyo + a medball throw on knee days from 75 min, plyo + COD on hip days from 60 min) -> 1 Olympic lift (clean on knee days, snatch on hip days, R2-ATH-04) -> resistance with 2 exercises per group -> calf (3 sets) -> buy-out (75+). Counted exercises 11-12 (cap 12 + 2 core; the cross-pattern layout approved, COACH-R3 SES-01). Athletic patterns never count toward muscle sets (VOL-10). The user may switch a day's athletic or Olympic block off (COACH-R3 SES-02). Older adults (60+): landing drills, balance, quick stepping, light medball throws and fast machine work on; low ankle hops, other jumps, depth jumps and Olympic lifts off by default, optional with W_OLDER_POWER (R2-ATH-08; COACH-R3 ATH-02).

| Days | Week (Mon..Sun) | Day types (v1.1) | Evidence |
|---|---|---|---|
| 2 | A, sport, sport, B, sport, OPT, OFF | **A - squat + pull (clean day):** core x2 -> plyo -> throw (75+) -> Olympic (clean family) -> [BKD* \| HPULL] -> [UHD \| VPUSH] -> [quad iso \| VPULL] -> leg curl / nordic -> KB face pull / rear delt -> calf (3 sets) -> buy-out (75+). Groups: quads, back, hips, shoulders 2 each, calves 1. **B - deadlift + push (snatch day):** core x2 -> plyo -> COD (60+) -> Olympic (snatch family) -> [BHD* \| HPUSH] -> [UKD \| HPULL] -> [leg curl \| chest iso] -> [quad iso \| VPULL] -> calf (3 sets) -> buy-out (75+). Groups: hips, chest, quads, back 2 each, calves 1. ~62-66 min at 60, ~84-85 at 90. **In-season variant (PER-08, UNI-10, R2-ATH-04/07):** IS_A core x2 -> sprint for speed athletes, otherwise jumps at about half or nothing -> light Olympic 2 x 3 (dropped in heavy game weeks) -> [UKD \| HPULL] -> [UHD \| VPUSH] -> [quad iso \| VPULL] -> leg curl -> KB face pull -> calf (3 sets); IS_B core x2 -> jumps (same choice) -> light Olympic -> [BHD~ \| HPUSH] -> [UKD \| HPULL] -> [leg curl \| chest iso] -> [quad iso \| VPULL] -> calf (3 sets); second exercises at 1-2 sets (~55 min at 60); no extra COD for game-heavy sports; the harder day at least 48 h before a game (weekdays from the intake's practice and game days, R2-GEN-05); 2 aerobic sessions (ATH-07). | INFERRED; BYOP athletic slot list (OBSERVED) re-wired by UNI-06 / UNI-11 / ATH-11 / PER-04; v1.1 R2-SES-04/05, R2-ATH-04/07 |
| 3 | S1, sport, S2, sport, S3, OPT, OFF | **S1 - jump + knee + pull:** core x2 -> 2 plyos (depth jump into box jump - off for 60+, a low-box stick drop instead; loaded jump squats) -> COD (60+) -> Olympic (hex-bar jump / hang clean, every length) -> [BKD* \| HPULL] (L2+: hex-bar squat directly into repeat jump squats) -> [UKD \| VPULL] (ipsilateral FFE lunge; L2+ into lunge jumps) -> single-leg glute bridge / hip thrust -> nordic curl -> <rear delt + KB face pull> -> calf (3 sets). **S2 - medball + hip + push:** core x2 -> throw list -> plyo push-ups -> Olympic (staggered DB snatch) -> KB swings (75+, ballistic only) -> [BHD~ (hip thrust / back extension) \| HPUSH] -> [UHD (SL glute bridges) \| VPUSH] -> <chest iso + side raise> -> calf (3 sets). **S3 - Olympic + strength:** core x2 -> Olympic (low hang power clean) -> [BHD* (snatch-grip DL) \| HPUSH] -> [UKD (walking lunges) \| HPULL] -> [leg curl \| chest iso] -> [leg extension \| VPULL] -> calf (3 sets). ~59-71 min at 60, ~71-91 at 90; up to 12 counted. | Session structure OBSERVED (OT11 'STARTING'); v1: S1's push press -> vertical pull and S2's banded pulldowns -> vertical press (UNI-11, EQ-01); 'Camporini DL' removed (LIB-09); Olympic before strength (ORD-03); v1.1: KB swings out of the hinge slot (R2-VOL-05), Olympic every day (R2-ATH-04), 2 exercises per group (R2-SES-05) - S3's observed front/side raise tri-set moves into S1/S2 shoulder pairs; Mon/Wed/Fri INFERRED |
| 4 | A1, B1, OPT, A2, B2, OPT, OFF | **A1 / A2 - squat (A1 heavy, A2 leg press / belt squat) + pull, clean days** and **B1 / B2 - hinge (B1 non-axial, B2 heavy deadlift) + push, snatch days**, as the 2-day A and B. **OPT:** core, Focus 1, Focus 2, the Calves slot (Focus or short of 10), aerobic capacity. 11-12 exercises / 11-12 counted; ~62-66 min at 60, ~84-85 at 90. | OBSERVED default product (OT04) re-wired to cross pattern (UNI-06); spacing approved (R2-SES-01); v1.1 R2-SES-04/05, R2-ATH-04. **Same-pattern variant** (high-level athletes who need more stimulus, UNI-06; size goals, INFERRED from ATH-03): A = plyo, throw (75+), COD (75+), 2nd plyo (90+), Olympic (clean) -> [BKD \| HPULL] -> [UKD \| VPULL] -> quad iso (75+, 'MYO SET' as in JUSTICE LEAGUE) -> <rear delt + KB face pull> -> calf (3 sets); B = plyo, COD, throw (75+), Olympic (snatch) -> [BHD \| HPUSH] -> [UHD \| VPUSH] -> [chest iso \| leg curl (75+)] -> side raise -> calf (3 sets) (the OBSERVED BYOP grammar; 2 per muscle with fewer exercises, so 3-5 athletic stations fit the cap; ~54-58 min at 60, ~81-90 at 90). **BASEBALL Parts variant** (OBSERVED OT16, core first by ATH-11; second core exercise from 75 min): Mon core -> throws -> OLY hang clean (every length: 2 sets below 90, 4 @ 75->90% at 90) -> [BKD~ speed \| HPULL] -> <UHD + biceps + calf (the day's one calf exercise, 3 sets)> -> **Part F** [quad iso \| VPULL] + <leg curl + biceps 2> -> buy-out; Tue core -> plyos -> OLY hang snatch (75+) -> [BHD* \| HPUSH] -> <UKD + triceps + side delt> -> **Part F** [leg curl \| chest iso] + <quad iso + triceps 2 + side raise> + calf (3 sets) -> buy-out; Thu as Mon with [BKD* \| VPULL] and a lat pull-over as Part F's back exercise; Fri as Tue with [BHD~ speed \| VPUSH] (KB swings / broad jumps = ballistic partners, R2-VOL-05) and rear delt + KB face pull. ~70-74 min at 60, ~86-96 at 90. No COD slot in the sheet (sport practice; 11.2-15). |
| 5 | A1, B1, OPT, A2, B2, OFF, OFF | as 4 days with one optional day | INFERRED from OT04c '4 to 6 DAYS A WEEK'; in-sport athletes stay at 2-4 days (OBSERVED BASEBALL / boxing) |
| 6 | A1, B1, OPT, A2, B2, OPT, OFF | as 4 days with both optional days | OBSERVED |

**Sport dial (v1.2).** `05_templates.json > generator_split_templates.athletic.sport_dial`. It holds the session-level levers; the sport profiles (every popular US sport with positions, swimming in depth, the gen-pop stay-active activities) are in `04_profiles.json` v1.1, which takes precedence for contact numbers and seasons. (At the v1.1 adversarial check `04_profiles.json` was still v1; the v1.1 profiles are drafted in `synthesis/sports/` - `team.json` holds 53 team-sport profiles by position group - and the sports merge step folds them into 04 v1.1.)

| Lever | v1.1 value | Evidence |
|---|---|---|
| Ground-contact rule | longer on the ground -> more ballistics; shorter -> more plyos; both ends always present; programs start ballistic and become plyometric | COACH-ANSWER ATH-01, CAT-10, CAT-11 |
| Plyo share by the end of a block | sprinters 75%; volleyball, soccer, football skill 60%; basketball, tennis, football big-skill, weekend warriors 50%; baseball, softball, hockey, linemen, MMA 40%; boxing, karate, kickboxing, wrestling, BJJ, golf 25%; **v1.2 (R3-ATH-04):** runners 75%; lacrosse, field hockey, flag football, ultimate cutters, rugby sevens, high jump, pole vault, gymnastics, cheer flyers 60%; beach volleyball, pickleball, padel, rugby backs, goalkeepers, javelin, HYROX 50%; rugby forwards, cheer bases, throwers, diving, alpine skiing, cycling 40%; swimming, water polo, rowing, judo, taekwondo, climbing 25%; each block starts 15 points more ballistic; read as fast, bouncy contacts, not total jumps | COACH-R2 R2-ATH-01 (RIGHT); COACH-R3 ATH-04 (RIGHT) |
| Ballistic vs plyometric | ballistic = squat, box, broad, loaded / hex-bar jumps, medball throws; plyometric = pogo / ankle hops, hurdle hops, depth jumps, bounds, squirrel jumps, repeated jumps; stick-the-landing = the 'receive' stage | COACH-R2 R2-ATH-02 (RIGHT) |
| Receive-Create stages | 1 Land -> 2 Land & Go -> 3 Repeat; 12-week plan weeks 1-3 / 4-7 / 8-12, 8-week 1-2 / 3-5 / 6-8; restart at stage 1 each off-season; stay put in maintenance; L2/L3 may start at stage 2 | COACH-R2 R2-ATH-03 (RIGHT) |
| Olympic lifts | up to 4 a week; clean = squat days, snatch = hinge days; full squat lifts 3-5 reps; power-output language, RPE / RIR and bar speed, a % only with a tested recent best, %-driven programming only for competitive Olympic lifters | COACH-R2 R2-ATH-04, -05, R2-GEN-06 |
| Aerobic off-season | 2 baseball, softball, sprinters; 3 basketball, volleyball, football, tennis, golf, boxing, BJJ; 3-4 soccer, hockey, kickboxing, karate; 4 MMA, wrestling; the remaining sports 2-4 like this list; 0 extra for swimmers, runners, rowers and endurance cyclists; pre-season 2; adjustable | COACH-R2 R2-ATH-06, R2-SES-06; COACH-R3 ATH-01, ATH-04 |
| In season (game-heavy: basketball, volleyball, soccer, football, hockey; R3-ATH-04 adds lacrosse, field hockey, rugby, ultimate, flag football, beach volleyball) | gym plyos about half; no extra COD; sprints only for speed athletes; the one hard gym day at least 48 h before a game | COACH-R2 R2-ATH-07 (RIGHT) |
| Older adults / youth | 60+: on by default - landing drills (no bounce), balance, quick stepping without a hop, light medball throws, fast machine work; off by default - low ankle hops, other jumps, Olympic lifts, depth jumps (switchable on with W_OLDER_POWER); overhead and low-bar squats out. Pickleball / padel / tennis 50+: calf and Achilles work every leg day, rotator cuff, low-impact jumps only. Youth floor lifts from ~14 after a hang block | COACH-R2 R2-ATH-08; COACH-R3 ATH-02 (RIGHT) |
| Basketball / volleyball | high COD; 80-90% unilateral; more frontal/transverse work | ATH-06, UNI-02, UNI-12 |
| Football skill / soccer / tennis | 80-90% unilateral, contralateral loading (into the hip); more frontal/transverse work; tennis high throws | UNI-02, CAT-13, UNI-12, ATH-05 |
| MMA / fighters / karate / boxing | more ballistics; pressing and arm volume reduced (never cut) when punching volume is high; cardio-first = real aerobic block; high rotational throws | ATH-01, ATH-04, ORD-09, ATH-05, UNI-12 |
| Baseball / softball | ballistics + rotational + sprinting; pitchers: less overhead pressing, more arm care, light rotational throws; same calendar for high school, college and pro | ATH-01, ATH-08, PRG-09; OBSERVED OT16 |
| Linemen / wrestlers / rugby / heavyweights / throwers | more resistance; same-pattern variant off-season (sport list INFERRED) | ATH-03, UNI-06 |
| Swimming (dryland) | **3 dryland gym days + 1 optional** (2 for younger or lower-level swimmers) around pool training; jumps mostly ballistic, **25 % plyometric** at block end (starts and turns are single big efforts); Olympic lifts 2-3 days; **shoulder care every session** (external rotation, floor Y/T raises, KB face pulls; never bands); **0 extra gym aerobic sessions**; a 2-week dryland taper lined up with the swim taper before the main meet (1 week or none before smaller meets) | COACH-R3 ATH-01 (RIGHT); profile in 04 |
| Pickleball / padel (recreational) | stay-active path (8.9): lateral COD / split-step on hip days, low-amplitude plyos, rotational medball, single-leg balance, shoulder and elbow care; 50 % plyo; 50+: calf and Achilles work every leg day, rotator cuff, low-impact jumps (R3-ATH-02); play days (R3-ATH-05) | COACH-R3 ATH-02, ATH-04, ATH-05; session mapping PROPOSED |
| HYROX (fitness) | 2 strength days (squat + pull, deadlift + push) + 2 hybrid days (run intervals, or 1 km run + 1 station repeated); 4 cardio sessions; 2 short station circuits a week as finishers, never muscle sets; wall balls <= 20 lb; 40-rep / AMRAP sets only inside the circuits; 50 % plyo (8.5, 8.9) | COACH-R3 ATH-03 (RIGHT) |
| Every other popular US sport | lacrosse, field hockey, rugby, flag football, cheer / STUNT, ultimate, track and field event groups, cross country, water polo and the rest: the athletic family (cross pattern by default; same-pattern template for size-focused and high-level athletes, COACH-R3 SES-01), with the coach's R3-ATH-04 plyo share (row above), the in-season rules of R2-ATH-07 when the sport is game-heavy, and 2-4 off-season aerobic sessions (0 extra for endurance sports) | COACH-R3 ATH-04 (RIGHT); JSON `sport_dial.plyo_share_by_sport_R2ATH01.other_sports_v1_2` |
| Non-competitive adults and youth | 50% plyo share; L1 Olympic variants unless experienced; 60 min | ATH-13; R2-ATH-01 |
| Everyone | no sex-based rules: age, foundation, goal and injuries | ATH-09 |

### 8.3 Strength (the work / accessory / nuance / survival, ORD-07)

Default length about 90 min (UNI-09). A/B lead-lift weeks (OBSERVED). One heavy squat and one heavy deadlift a week on different days (PER-04, R2-SES-01): the max-effort day takes one pattern, the dynamic-effort speed lift the other; the accessory of the other pattern is non-axial (INFERRED application, PENDING). Powerlifters may add a light technique squat or deadlift (R2-SES-02). Aerobic: 2 easy Orange a week (R2-ATH-06), adjustable.

| Days | Week | Day types (week A shown; week B swaps squat <-> hinge and the paired vectors) | Evidence |
|---|---|---|---|
| 2 | FB_ME, OFF, OFF, FB_DE, OFF, OPT, OFF | **FB_ME:** core x2 -> [BKD* (the work, 1 RIR) \| HPULL (nuance, in the work's rest)] -> [BHD~ (accessory) \| HPUSH (upper work)] -> [UKD (survival) \| VPULL] -> [leg curl \| chest iso] -> calf (3 sets) -> <rear delt + KB face pull> (75+). **FB_DE:** core x2 -> plyo (the work, 'EASY') -> [BHD* speed \| VPUSH fast] -> [UHD \| side raise] -> [UKD \| HPULL] -> [quad iso \| VPULL] -> calf (3 sets) -> <triceps + triceps> (75+). Every group 2 exercises; ~87-94 min. | INFERRED compression of OT19/OT20; v1.1 R2-SES-05 (partner lifts done in the work lift's rest, INFERRED from HYBRID '3x6 - DB bench press/ core') |
| 3 | SQUAT, OFF, PRESS, OFF, DEADLIFT, OPT, OFF | **Squat:** core x2 -> BKD* -> BHD~ -> UKD (nuance) -> quad iso -> leg curl -> calf (3 sets). **Press:** core x2 -> HPUSH or VPUSH by A/B week (the work first, ORD-02) -> HPULL -> incline -> VPULL -> <biceps + rear delt> -> <biceps 2 + KB face pull>. **Deadlift:** core x2 -> plyo (75+) -> BHD* -> BKD~ -> UHD -> leg curl -> quad iso -> calf (3 sets). ~70-75 min. | OBSERVED class trio skeleton (OT18); fill INFERRED; non-axial second bilateral (PER-04); v1.1 R2-SES-05 |
| 4 | ME_LOWER, OFF, ME_UPPER, DE_LOWER, OFF, DE_UPPER, OFF | **ME lower (week A):** core x2 -> [BKD* the work \| HPULL nuance] -> BHD~ accessory -> UKD survival -> calf (3 sets). **ME upper:** core x2 -> press (the work) -> HPULL (accessory) -> incline (nuance) -> <biceps + rear delt> (survival). **DE lower (week A):** core x2 -> plyo (the work) -> [BHD* speed \| HPUSH] -> UHD -> light technique squat (powerlifters only, optional, R2-SES-02) -> calf (3 sets). **DE upper:** core x2 -> fast press -> VPULL -> incline -> <triceps + side delt>. Week B: ME lower hinge-led [BHD* \| HPUSH] -> BKD~ -> UHD; DE lower squat speed [BKD* \| HPULL] -> UKD -> light technique deadlift (optional). ~58-66 min. | OBSERVED days (OT19/OT20 Mon/Wed/Thu/Sat) + ORD-07 roles; nuance position and vector INFERRED from UNI-11; **flagged:** some muscles have one exercise (four-role design) - exempt pending the coach (11.3) |
| 5 | ME_LOWER, OPT, ME_UPPER, DE_LOWER, OFF, DE_UPPER, OFF | + 1 optional day | INFERRED (never a third heavy lower day) |
| 6 | ME_LOWER, OPT, ME_UPPER, DE_LOWER, OPT, DE_UPPER, OFF | + 2 optional days | INFERRED |

### 8.4 Fat loss / bootcamp / general fitness - cross pattern (UNI-06)

Two formats: **gym** (straight sets, 45-60 min, UNI-09) and **bootcamp circuit** (two circuits of 4-6 stations, 3 rounds x 35-50 s, 35-45 min, PRG-03 + R2-SES-05). 3 aerobic sessions a week by default (ATH-07), adjustable up or down (R2-SES-06); the 4-, 5- and 6-session weeks hold 2, 1 and 0 of them, so the rest are add-ons or walks (`aerobic_ATH07`). v1.1: each lower group's second exercise is a lighter isolation or bodyweight option (leg extension after the squat, leg curl after the single-leg hinge), as on the coach's own BOOTCAMP 1 A day.

| Days | Week | Day types (v1.1) | Evidence |
|---|---|---|---|
| 2 | A, OFF, aerobic, B, aerobic, aerobic, OFF | **A:** core x2 -> [BKD (goblet / DB / leg press) \| HPULL] -> [UHD \| VPUSH] -> [quad iso \| VPULL] -> leg curl -> KB face pull -> calf (3 sets) -> <biceps + biceps> (75+). Groups: quads, back, hips, shoulders 2 each, calves 1. **B (corrected):** core x2 -> [BHD \| HPUSH] -> [UKD \| HPULL] -> [leg curl \| chest iso] -> [quad iso \| VPULL] -> calf (3 sets) -> <triceps + triceps> (75+). Groups: hips, chest, quads, back 2 each, calves 1. 9 exercises; ~60 min at 60, ~51 at 45 (pairs supersetted - a longer day). | OBSERVED OT05 A; B corrected by COACH-ANSWER ORD-06 / UNI-11; v1.1 R2-SES-05 |
| 3 | Bootcamp 1, aerobic, Bootcamp 2, aerobic, Bootcamp 3, aerobic, OFF | **1 - squat + row + single-leg hinge:** circuit 1 [squat \| row] -> [2nd quad \| pull-up / pulldown]; circuit 2 single-leg hinge -> leg curl / slider curl -> metabolic ('Cardio') -> calf (one station). **2 - hinge + presses:** circuit 1 [hinge \| push-up] -> [leg curl \| 2nd push-up variant]; circuit 2 OH press -> biceps -> side raise -> biceps 2 -> calf (one station) -> metabolic. **3 - single-leg squat + pulls + arms:** circuit 1 [single-leg squat \| row] -> [2nd quad \| pull-up / pulldown]; circuit 2 triceps -> side raise -> metabolic (mid-session, as written) -> triceps 2 -> KB face pull -> calf (one station). 8-10 stations, ~41-43 min (or gym straight sets). | OBSERVED (OT06 1A/2A/3A; pairs already follow UNI-11); core moved to the start (ATH-11); v1.1 R2-SES-05 (second station per group; two circuits) |
| 4 | A, B, aerobic, A, B, aerobic, OFF | gym A / B as the 2-day; the third aerobic session as an add-on or a walk | OBSERVED (OT05, corrected). **Bootcamp-circuit variant (PRG-03 + R2-SES-05):** BC_A circuit 1 [squat \| row] -> [wall sit / sissy squat / leg extension \| pull-up / pulldown / TRX high row]; circuit 2 [single-leg RDL \| DB press] -> slider curl -> KB face pull / floor Y-T raises -> calf (one station) -> metabolic. BC_B circuit 1 [DB / KB deadlift or hip thrust \| push-up] -> [slider curl \| 2nd push-up variant]; circuit 2 [reverse lunge / step-up \| row] -> [wall sit \| pull-up] -> calf (one station) -> metabolic. 10 stations at 3 x 40 s, ~43 min. **FAT BURN variant (OBSERVED OT10):** lower A/B + U1/U2 with a 4-station circuit finisher (PRG-11), row before pulldown (ORD-01), core first (ATH-11), lead-lift A/B weeks optional (PER-03); v1.1 each group 2 exercises on its day. |
| 5 | BC_A, BC_B, BC_A, BC_B, BC_A, aerobic, OFF | rolling A/B circuits (next week B-A-B-A-B) | COACH-ANSWER PRG-03 (5 sessions is an option); rolling order PROPOSED |
| 6 | Bootcamp 1, 2, 3, 1, 2, 3, OFF | 1B-3B repeat 1A-3A with a different exercise pick (OBSERVED); aerobic as 10-20 min add-ons or walks (ATH-07, ORD-10, R2-SES-06) | OBSERVED (OT06 order, 'SUNDAY' 'OFF'); PRG-03 |

**Axial note.** Bootcamp and fat-loss stations use goblet / DB / bodyweight / leg-press variants, which do not count toward the spine budget; a barbell squat or deadlift counts as the week's heavy exposure of that pattern (R2-SES-02). KB swings go in the metabolic station - they are ballistic, not hinge volume (R2-VOL-05).

### 8.5 Hybrid / CrossFit and the CrossFit-style bootcamp

Order: warm-up -> light core block -> skill -> Olympic / power -> strength + its group partner -> the paired upper group -> calves -> WOD (ATH-11, ORD-03, R2-SES-03; OBSERVED class order OT18). **v1.1 class model:** each day trains its strength pattern and the paired upper group with 2 exercises each (R2-SES-05); the WOD carries the conditioning. Levels from the coach's tables (5.5): HALF TIME for class members, FULL TIME for competitors. AMRAPs and 40-rep sets live here only (VOL-11). Heavy squat and heavy deadlift on different days (R2-SES-01).

| Days | Week | Day types (v1.1) | Evidence |
|---|---|---|---|
| 2 | HY1, OFF, OFF, HY2, OFF, aerobic, OFF | **HY1 - clean + squat:** core x2 -> skill -> Olympic (clean) -> [BKD* \| HPULL] -> [UKD \| VPULL] -> calf (3 sets) -> single-leg RDL + leg curl (90+) -> WOD / AMRAP 12-20. **HY2 - snatch + deadlift:** core x2 -> skill -> Olympic (snatch) -> [BHD* \| HPUSH] -> [UHD \| chest iso] -> calf (3 sets) -> <VPUSH + KB face pull> -> [lunges \| row] + [quad iso \| pull-up] (90+) -> A-colour sprints. ~67 min at 60, ~92-94 at 90. | INFERRED from HYBRID Mon/Thu (OT23) + class order (OT18); v1.1 class model, R2-SES-05 |
| 3 | SQUAT, OFF, PRESS, OFF, DEADLIFT, aerobic, OFF | **Squat:** core x2 -> skill 'DUBS' -> [BKD* \| HPULL] -> [UKD \| VPULL] -> calf (3 sets) -> <rear delt + KB face pull> -> WOD. **Press:** core x2 -> skill -> Olympic 'SNATCH' -> VPUSH 'PRESS' (the work) -> HPUSH -> chest iso -> side raise -> WOD. **Deadlift:** core x2 -> 'GYMNASTICS' -> Olympic 'CLEAN' -> BHD* -> single-leg RDL -> leg curl (75+) -> calf (3 sets) -> WOD. Aerobic L3/L4 add-ons only on 2-hour days. ~67-68 min at 60. | OBSERVED class skeleton (OT18); accessories INFERRED; v1.1 R2-SES-05 |
| 4 | MON, TUESD, OFF, THURS, FRID, aerobic at L3-4 (WOD only in MAY), OFF | OT17 competitor days (knee + snatch / pull + clean / hip + snatch / push + clean); rows activate by month; FULL TIME levels; v1 session order as above; squat Monday + deadlift Thursday = one heavy exposure each. **CrossFit-style bootcamp alternative (R2-GEN-07 sample plan):** Mon squat class, Tue press + snatch class, Thu deadlift + clean class, Fri clean + push class (core x2 -> skill -> Olympic clean -> HPUSH -> chest iso -> VPUSH -> side raise -> WOD), Sat optional WOD-only class; HALF TIME levels climbing like a stairway; ~67-68 min at 60. | OBSERVED (OT17, OT18); v1 order ATH-11 / ORD-03; PER-04, R2-SES-01; v1.1 R2-SES-05, R2-GEN-07 |
| 5 | MON, TUE, OFF, THU, FRI, SAT, OFF | **Mon** = HY1. **Tue:** core x2 -> sprints 'A/C' 'SPEED' -> jumps -> [HPUSH '3x6 DB bench' \| UHD lower accessory] -> [chest iso \| leg curl] -> calf (3 sets). **Thu** = HY2. **Fri:** easy aerobic 15-40 min first (real aerobic block, ORD-09) -> core x2 -> jumps -> [UHD 'uni RDL' \| VPUSH 'OH press'] -> [BHD~ \| side raise] -> calf (3 sets). **Sat:** core x2 -> [BKD~ 'KD REPS' (leg press / belt squat; goblet if neither) \| HPULL] -> [UKD lunges \| VPULL pull-ups] -> calf (3 sets) -> AMRAP. | OBSERVED (OT23) re-wired: Olympic first (ORD-03), Saturday push -> pulls (UNI-11), second squat non-axial (PER-04, R2-SES-02); v1.1 R2-SES-05 |
| 6 | SQUAT, PRESS, WOD, DEADLIFT, CLEAN/PUSH, WOD, OFF | class split; Wed/Sat WOD-only classes (core -> skill -> WOD) | OBSERVED (OT18 MON-SAT; WED/SAT blank, WOD-only reading INFERRED) |

**HYROX for fitness (approved plan, COACH-R3 ATH-03: "Yes, HYROX").** 2 strength days (squat + pull, deadlift + push; 2-4 exercises per group, calves one exercise) + 2 hybrid days (run intervals, or 1 km run + 1 station repeated); 4 cardio sessions (Blue, Green, Orange + a second Orange, because running is about half the race); 2 short station circuits a week (sled push / pull, burpee broad jumps, wall balls, farmers carry, sandbag lunges, SkiErg / row) as finishers that never count as muscle sets; wall balls with the race ball (never over 20 lb); 40-rep / AMRAP sets only inside these circuits; jumps 50 % plyometric (8.9). Session mapping onto the hybrid family PROPOSED.

### 8.6 No-equipment

No no-equipment template exists (OBSERVED). The hidden 'NO ACCESS' tabs are self-serve versions without coach access that use the full gym library (COACH-R2 R2-LIB-08) - not no-equipment plans. The generator keeps the cross-pattern fat-loss / bootcamp skeleton and filters each slot to bodyweight; every group the day trains still gets 2 exercises (R2-SES-05). **No bands anywhere** (COACH-ANSWER EQ-01, EQ-02, EQ-07, EQ-08, EQ-12).

| Days | Week | Basis |
|---|---|---|
| 2 | A_BW, OFF, run, B_BW, OFF, run, OFF | fat-loss A / B (corrected, v1.1) with bodyweight pools |
| 3 | Bootcamp 1-2-3 BW, run | OT06 rotation, bodyweight, two circuits |
| 4 | A_BW, B_BW, run, A_BW, B_BW, run, OFF | fat-loss A / B, bodyweight |
| 5 | BC_A, BC_B, BC_A, BC_B, BC_A (BW), run | rolling A/B circuits (PROPOSED) |
| 6 | Bootcamp 1-2-3, 1-2-3 BW | OT06 six sessions |

Substitution ladder. The library items are OBSERVED (cells cited); the mapping is INFERRED; band options are removed (EQ-01); v1.1 home additions from R2-LIB-07.

| Bucket | No-equipment options |
|---|---|
| RP_BKD | 'Bodyweight Squats' AI12, 'Squats with Foam Roller or Yoga Ball on the wall' AI14, 'Sissy Squats' AI100 |
| RP_BHD | 'Glute Bridges' AN9, 'Elevated Feet on Bench Glute Bridges' AN10, 'Supine Glidder hamstring curls' AN18 |
| RP_UKD | All AL lunges (AL9-AL21); 'Single leg get ups' = box pistol (LIB-09) |
| RP_UHD | 'SL Glute Bridges (foot on the ground)' AQ9, '(foot on bench)' AQ10, 'SL Hip thrusts' AQ11 |
| RP_HPUSH | 'Kneeling Push Ups' -> 'Incline Push-ups' -> 'Push Ups ' -> 'Push ups (Feet on Wall)' / 'Diamond Push ups' / 'Declined Pushups' -> 'Push ups (1 hand Higher)'; 'Bench Push ups' both ways: hands on the bench = foundational, feet on the bench = advanced (COACH-R2 R2-LIB-05, LIB-12) |
| RP_VPUSH | 'Pike Push Ups' AA53 -> 'Handstand Push ups' AA52 |
| RP_HPULL | 'Inverted Rows' X13, 'TRX Rows' X12; table row (R2-LIB-07 addition) |
| RP_VPULL | 'Seated Pull ups with Rings or TRX' U19; pull-ups if there is a bar. With no bar: a table row or TRX row as the second back exercise (INFERRED). The band-assisted option U15 is out (EQ-01). |
| ISO_QUAD / ISO_HAM / ISO_CALF | sissy squats, wall sits (EQ-08); nordics, slider or swiss-ball curls (EQ-08); 'Standing Calf raises (use deficit)', single-leg + bilateral (2 exercises, R2-SES-05) |
| ISO_CHEST | a second push-up variant (INFERRED) |
| ISO_BICEP / ISO_TRICEP / ISO_SIDE_REAR_DELT | KB curl (R2-LIB-07) if there is a kettlebell, otherwise 'TRX Bicep Curls' (AS); 'Diamond Push ups' AD93 or bench dips for triceps; floor Y/T raises (R2-LIB-07) and the KB face pull (R2-LIB-04) for the shoulders. No band work. |
| AP_THROW | Needs a med ball (never over 20 lb). Without one: plyo push-ups or the no-ball "fake medball slam" (EQ-07); never band chops. |
| COND_AEROBIC | The running options in B9-B47; walk-run for beginners; the half-marathon plan is the longest run (the 21.6-mile run is removed, R2-LIB-06) |

### 8.7 Recomputed checks (v1.2, from `05_templates.json`)

> **Changed in v1.3** (COACH-R4 R4-SES-05). These are the stored checks of the v1.2 templates. The v1.3 days are checked by the engine: the template skeleton and "nothing dropped", the session size, pairing, order and the spine days (`model/rules.json > validation`). Where the text below differs, the v1.3 section at the top of this file wins.

Checked by the v1.2 build script for every template and variant at the family's default lengths: weekly exposures of the 8 primary patterns; heavy axial exposures (squat / hinge); **exercises per muscle group on every day (R2-SES-05: 2-4; groups approved, COACH-R3 SES-01)**; **exactly one calf exercise on every leg day (COACH-R3 SES-01)**; at least one rear-delt / face-pull station a week (VOL-17); exercises and counted exercises per day (R2-SES-04 convention; cap 12); slot-level pairing (UNI-11, incl. the isolation pairs); core block first; horizontal before vertical unless the vertical lift is the work; Olympic before the work; Olympic work in every athletic week; no two lower compounds back to back in a mixed session; time at the block start and late in the block; and, new in v1.2, the **superset recommendation** for every main day (COACH-R3 SES-02: "recommended" when the day also fits in straight sets, "needed" when it fits only with them). **No template has a pairing, order, axial, per-muscle, calf, rear-delt, cap or Olympic failure.** The only hard flags are the documented exemptions (conjugate four-role days, the CrossFit class model, in-season minimal bilateral, the strength 3-day H/V press rotation). "(longer day)" marks a start estimate more than 10% over the chosen length even with pairs supersetted. One calf exercise instead of v1.1's calf pair takes about 1-4 min off a leg day (e.g. the 4-day aesthetics day at 60 min: ~63 -> ~62 min at the start, ~94 -> ~90 late; at 90 min ~118-125 -> ~113-120 late). Every station also carries its block id (`block_R3SES02`) and every day type its block list with the on/off defaults (`blocks_R3SES02`, 9 step 11). Whether the chosen length can hold the minimums is checked in 8.7.1.

| Family | Days | Min | BKD BHD UKD UHD HPUSH VPUSH HPULL VPULL | Axial sq/hinge | Exercises per trained group, calves aside (min-max) | Calf exercises per leg day | Exercises / counted (R2-SES-04) per main day | Est. min at block start | Est. min late block (upper) | Supersets (R3-SES-02) | Result |
|---|---|---|---|---|---|---|---|---|---|---|---|
| aesthetics | 2 | 45 | 2 2 1 1 2 1 2 2 | 1/1 | 2-2 | 1 | 11-11 / 10-11 | 59-59 | 87-87 | 2 of 2 days needed | ok (longer day) |
| aesthetics | 2 | 60 | 2 2 1 1 2 1 2 2 | 1/1 | 2-2 | 1 | 11-11 / 10-11 | 60-60 | 88-88 | 2 of 2 days needed | ok |
| aesthetics | 2 | 90 | 2 2 1 1 2 1 2 2 | 1/1 | 2-2 | 1 | 13-13 / 11-12 | 93-95 | 133-136 | recommended | ok |
| aesthetics | 3 | 45 | 2 2 2 1 2 1 2 2 | 1/1 | 2-2 | 1 | 7-9 / 7-9 | 44-51 | 61-74 | 3 of 3 days needed | ok (longer day) |
| aesthetics | 3 | 60 | 2 2 2 1 2 1 2 2 | 1/1 | 2-3 | 1 | 9-10 / 8-9 | 61-62 | 89-90 | recommended | ok |
| aesthetics | 3 | 90 | 2 2 2 1 2 1 2 3 | 1/1 | 2-3 | 1 | 11-12 / 10-11 | 84-94 | 113-128 | recommended | ok |
| aesthetics | 4 | 45 | 2 2 2 2 2 2 2 2 | 1/1 | 2-2 | 1 | 7-7 / 7-7 | 44-44 | 61-61 | 4 of 4 days needed | ok |
| aesthetics | 4 | 60 | 2 2 2 2 2 2 2 2 | 1/1 | 2-3 | 1 | 10-10 / 8-9 | 62-62 | 90-90 | recommended | ok |
| aesthetics | 4 | 90 | 2 2 2 2 2 2 2 4 | 1/1 | 2-3 | 1 | 11-12 / 10-10 | 84-89 | 113-120 | recommended | ok |
| aesthetics | 4 (upper lower) | 45 | 2 2 2 2 2 2 2 2 | 1/1 | 2-3 | 1 | 7-11 / 7-8 | 50-63 | 69-94 | 4 of 4 days needed | ok (longer day) |
| aesthetics | 4 (upper lower) | 60 | 2 2 2 2 2 2 2 2 | 1/1 | 2-3 | 1 | 7-11 / 7-8 | 51-64 | 70-96 | recommended | ok |
| aesthetics | 4 (upper lower) | 90 | 2 2 2 2 2 2 2 2 | 1/1 | 2-3 | 1 | 7-11 / 7-8 | 66-76 | 86-110 | recommended | ok |
| aesthetics | 5 | 45 | 2 2 2 2 2 2 2 2 | 1/1 | 2-2 | 1 | 7-7 / 7-7 | 44-44 | 61-61 | 4 of 4 days needed | ok |
| aesthetics | 5 | 60 | 2 2 2 2 2 2 2 2 | 1/1 | 2-3 | 1 | 10-10 / 8-9 | 62-62 | 90-90 | recommended | ok |
| aesthetics | 5 | 90 | 2 2 2 2 2 2 2 4 | 1/1 | 2-3 | 1 | 11-12 / 10-10 | 84-89 | 113-120 | recommended | ok |
| aesthetics | 6 | 45 | 2 2 2 2 2 2 2 2 | 1/1 | 2-2 | 1 | 7-7 / 7-7 | 44-44 | 61-61 | 4 of 4 days needed | ok |
| aesthetics | 6 | 60 | 2 2 2 2 2 2 2 2 | 1/1 | 2-3 | 1 | 10-10 / 8-9 | 62-62 | 90-90 | recommended | ok |
| aesthetics | 6 | 90 | 2 2 2 2 2 2 2 4 | 1/1 | 2-3 | 1 | 11-12 / 10-10 | 84-89 | 113-120 | recommended | ok |
| aesthetics | 6 (ppl x2) | 45 | 2 2 2 2 6 2 4 2 | 1/1 | 2-3 | 1 | 7-7 / 6-7 | 46-50 | 65-69 | 2 of 6 days needed | ok (longer day) |
| aesthetics | 6 (ppl x2) | 60 | 2 2 2 2 6 2 4 2 | 1/1 | 2-3 | 1 | 7-7 / 6-7 | 46-51 | 66-70 | recommended | ok |
| aesthetics | 6 (ppl x2) | 90 | 2 2 2 2 6 2 4 4 | 1/1 | 2-4 | 1 | 8-8 / 7-8 | 62-72 | 86-92 | recommended | ok |
| athletic | 2 | 60 | 1 1 1 1 1 1 2 2 | 1/1 | 2-2 | 1 | 11-12 / 11-12 | 62-66 | 89-94 | recommended | ok |
| athletic | 2 | 90 | 1 1 1 1 1 1 2 2 | 1/1 | 2-2 | 1 | 12-12 / 12-12 | 84-85 | 111-111 | recommended | ok |
| athletic | 2 (in season) | 60 | 0 1 2 1 1 1 2 2 | 0/0 | 2-2 | 1 | 11-11 / 11-11 | 55-55 | 82-82 | recommended | exempt - COACH-ANSWER UNI-10: minimal bilateral in season |
| athletic | 2 (in season) | 90 | 0 1 2 1 1 1 2 2 | 0/0 | 2-2 | 1 | 11-11 / 11-11 | 65-65 | 90-90 | recommended | exempt - COACH-ANSWER UNI-10: minimal bilateral in season |
| athletic | 3 | 60 | 1 2 2 2 2 1 2 2 | 1/1 | 2-2 | 1 | 10-13 / 10-12 | 59-71 | 84-102 | 1 of 3 days needed | ok (longer day) |
| athletic | 3 | 90 | 1 2 2 2 2 1 2 2 | 1/1 | 2-2 | 1 | 10-13 / 10-12 | 71-91 | 94-114 | recommended | ok |
| athletic | 4 | 60 | 2 2 2 2 2 2 4 4 | 1/1 | 2-2 | 1 | 11-12 / 11-12 | 62-66 | 89-94 | recommended | ok |
| athletic | 4 | 90 | 2 2 2 2 2 2 4 4 | 1/1 | 2-2 | 1 | 12-12 / 12-12 | 84-85 | 111-111 | recommended | ok |
| athletic | 4 (same pattern) | 60 | 2 2 2 2 2 2 2 2 | 1/1 | 2-2 | 1 | 9-10 / 8-10 | 54-58 | 76-81 | recommended | ok |
| athletic | 4 (same pattern) | 90 | 2 2 2 2 2 2 2 2 | 1/1 | 2-3 | 1 | 11-13 / 11-12 | 81-90 | 104-116 | recommended | ok |
| athletic | 4 (baseball parts) | 60 | 2 2 2 2 1 1 1 3 | 1/1 | 2-3 | 1 | 11-12 / 9-10 | 70-74 | 89-94 | 4 of 4 days needed | ok (longer day) |
| athletic | 4 (baseball parts) | 90 | 2 2 2 2 1 1 1 3 | 1/1 | 2-3 | 1 | 11-13 / 10-11 | 86-96 | 101-115 | recommended | ok |
| athletic | 5 | 60 | 2 2 2 2 2 2 4 4 | 1/1 | 2-2 | 1 | 11-12 / 11-12 | 62-66 | 89-94 | recommended | ok |
| athletic | 5 | 90 | 2 2 2 2 2 2 4 4 | 1/1 | 2-2 | 1 | 12-12 / 12-12 | 84-85 | 111-111 | recommended | ok |
| athletic | 6 | 60 | 2 2 2 2 2 2 4 4 | 1/1 | 2-2 | 1 | 11-12 / 11-12 | 62-66 | 89-94 | recommended | ok |
| athletic | 6 | 90 | 2 2 2 2 2 2 4 4 | 1/1 | 2-2 | 1 | 12-12 / 12-12 | 84-85 | 111-111 | recommended | ok |
| strength | 2 | 90 | 1 2 2 1 1 1 2 2 | 1/1 | 2-2 | 1 | 11-12 / 10-11 | 87-94 | 106-107 | recommended | ok |
| strength | 3 | 90 | 2 2 1 1 2 0 1 1 | 1/1 | 2-3 | 1 | 6-8 / 6-7 | 70-75 | 82-96 | recommended | exempt - A/B weeks: the press day rotates H/V push (OBSERVED OT19/OT20) |
| strength | 4 | 90 | 1 2 1 1 4 1 2 1 | 1/1 | 1-2 | 1 | 5-5 / 4-5 | 58-66 | 66-83 | recommended | exempt - OBSERVED conjugate design: 2 lower days, each pattern 1-2x a week; OBSERVED conjugate max-effort lower day: accessory and survival are lower lifts (open question 11.2-9); OBSERVED four-role conjugate days (ORD-07) keep one exercise for some muscles - exempt pending the coach (open question) |
| strength | 4 (week B) | 90 | 2 1 1 1 4 1 2 1 | 1/1 | 1-2 | 1 | 5-5 / 4-5 | 58-66 | 66-83 | recommended | exempt - OBSERVED conjugate design: 2 lower days, each pattern 1-2x a week; OBSERVED conjugate max-effort lower day: accessory and survival are lower lifts (open question 11.2-9); OBSERVED four-role conjugate days (ORD-07) keep one exercise for some muscles - exempt pending the coach (open question) |
| strength | 5 | 90 | 1 2 1 1 4 1 2 1 | 1/1 | 1-2 | 1 | 5-5 / 4-5 | 58-66 | 66-83 | recommended | exempt - OBSERVED conjugate design: 2 lower days, each pattern 1-2x a week; OBSERVED conjugate max-effort lower day: accessory and survival are lower lifts (open question 11.2-9); OBSERVED four-role conjugate days (ORD-07) keep one exercise for some muscles - exempt pending the coach (open question) |
| strength | 6 | 90 | 1 2 1 1 4 1 2 1 | 1/1 | 1-2 | 1 | 5-5 / 4-5 | 58-66 | 66-83 | recommended | exempt - OBSERVED conjugate design: 2 lower days, each pattern 1-2x a week; OBSERVED conjugate max-effort lower day: accessory and survival are lower lifts (open question 11.2-9); OBSERVED four-role conjugate days (ORD-07) keep one exercise for some muscles - exempt pending the coach (open question) |
| fat loss bootcamp | 2 | 45 | 1 1 1 1 1 1 2 2 | 0/0 | 2-2 | 1 | 9-9 / 9-9 | 51-51 | 74-74 | 2 of 2 days needed | ok (longer day) |
| fat loss bootcamp | 2 | 60 | 1 1 1 1 1 1 2 2 | 0/0 | 2-2 | 1 | 9-9 / 9-9 | 60-60 | 88-88 | recommended | ok |
| fat loss bootcamp | 3 | 45 | 1 1 1 1 1 1 2 2 | 0/0 | 2-2 | 1 | 8-10 st. | 41.3-42.8 (3 x 40 s / 3 x 50 s) | - | - | ok |
| fat loss bootcamp | 3 | 60 | 1 1 1 1 1 1 2 2 | 0/0 | 2-2 | 1 | 8-10 st. | 41.3-42.8 (3 x 40 s / 3 x 50 s) | - | - | ok |
| fat loss bootcamp | 4 | 45 | 2 2 2 2 2 2 4 4 | 0/0 | 2-2 | 1 | 9-9 / 9-9 | 51-51 | 74-74 | 4 of 4 days needed | ok (longer day) |
| fat loss bootcamp | 4 | 60 | 2 2 2 2 2 2 4 4 | 0/0 | 2-2 | 1 | 9-9 / 9-9 | 60-60 | 88-88 | recommended | ok |
| fat loss bootcamp | 4 (bootcamp circuit) | 45 | 2 2 2 2 2 2 4 4 | 0/0 | 2-2 | 1 | 10-10 st. | 42.8-42.8 (3 x 40 s) | - | - | ok |
| fat loss bootcamp | 4 (bootcamp circuit) | 60 | 2 2 2 2 2 2 4 4 | 0/0 | 2-2 | 1 | 10-10 st. | 42.8-42.8 (3 x 40 s) | - | - | ok |
| fat loss bootcamp | 5 | 45 | 3 2 2 3 2 3 5 5 | 0/0 | 2-2 | 1 | 10-10 st. | 42.8-42.8 (3 x 40 s) | - | - | ok |
| fat loss bootcamp | 5 | 60 | 3 2 2 3 2 3 5 5 | 0/0 | 2-2 | 1 | 10-10 st. | 42.8-42.8 (3 x 40 s) | - | - | ok |
| fat loss bootcamp | 6 | 45 | 2 2 2 2 2 2 4 4 | 0/0 | 2-2 | 1 | 8-10 st. | 41.3-42.8 (3 x 40 s / 3 x 50 s) | - | - | ok |
| fat loss bootcamp | 6 | 60 | 2 2 2 2 2 2 4 4 | 0/0 | 2-2 | 1 | 8-10 st. | 41.3-42.8 (3 x 40 s / 3 x 50 s) | - | - | ok |
| hybrid crossfit | 2 | 60 | 1 1 1 1 1 1 1 1 | 1/1 | 2-2 | 1 | 6-8 / 6-8 | 67-67 | 82-88 | 2 of 2 days needed | ok (longer day) |
| hybrid crossfit | 2 | 90 | 1 1 2 2 1 1 2 2 | 1/1 | 2-2 | 1 | 8-12 / 8-12 | 92-95 | 110-120 | recommended | ok |
| hybrid crossfit | 3 | 60 | 1 1 1 1 1 1 1 1 | 1/1 | 2-2 | 1 | 4-7 / 4-6 | 66-68 | 81-86 | 3 of 3 days needed | ok (longer day) |
| hybrid crossfit | 3 | 90 | 1 1 1 1 1 1 1 1 | 1/1 | 2-3 | 1 | 5-7 / 5-6 | 80-86 | 93-94 | recommended | ok |
| hybrid crossfit | 4 | - | day types in OT17 (not recomputed) | - | - | - | - | - | - | - | - |
| hybrid crossfit | 4 (crossfit style bootcamp) | 60 | 1 1 1 1 2 2 1 1 | 1/1 | 2-2 | 1 | 4-7 / 4-6 | 66-68 | 81-86 | 4 of 4 days needed | exempt - OBSERVED class model: one strength pattern per day; WODs carry the rest (INFERRED) (longer day) |
| hybrid crossfit | 4 (crossfit style bootcamp) | 90 | 1 1 1 1 2 2 1 1 | 1/1 | 2-3 | 1 | 5-7 / 5-6 | 80-86 | 93-94 | recommended | exempt - OBSERVED class model: one strength pattern per day; WODs carry the rest (INFERRED) |
| hybrid crossfit | 5 | 60 | 2 2 2 3 2 2 2 2 | 1/1 | 2-2 | 1 | 5-8 / 5-8 | 53-67 | 69-88 | 2 of 5 days needed | ok (longer day) |
| hybrid crossfit | 5 | 90 | 2 2 3 4 2 2 3 3 | 1/1 | 2-2 | 1 | 5-12 / 5-12 | 55-95 | 70-120 | recommended | ok |
| hybrid crossfit | 6 | 60 | 1 1 1 1 2 2 1 1 | 1/1 | 2-2 | 1 | 4-7 / 4-6 | 66-68 | 81-86 | 4 of 4 days needed | exempt - OBSERVED class model: one strength pattern per day; WODs carry the rest (INFERRED) (longer day) |
| hybrid crossfit | 6 | 90 | 1 1 1 1 2 2 1 1 | 1/1 | 2-3 | 1 | 5-7 / 5-6 | 80-86 | 93-94 | recommended | exempt - OBSERVED class model: one strength pattern per day; WODs carry the rest (INFERRED) |
| no equipment | 2 | 45 | 1 1 1 1 1 1 2 2 | 0/0 | 2-2 | 1 | 9-9 / 9-9 | 51-51 | 74-74 | 2 of 2 days needed | ok (longer day) |
| no equipment | 2 | 60 | 1 1 1 1 1 1 2 2 | 0/0 | 2-2 | 1 | 9-9 / 9-9 | 60-60 | 88-88 | recommended | ok |
| no equipment | 3 | 45 | 1 1 1 1 1 1 2 2 | 0/0 | 2-2 | 1 | 8-10 st. | 41.3-42.8 (3 x 40 s / 3 x 50 s) | - | - | ok |
| no equipment | 3 | 60 | 1 1 1 1 1 1 2 2 | 0/0 | 2-2 | 1 | 8-10 st. | 41.3-42.8 (3 x 40 s / 3 x 50 s) | - | - | ok |
| no equipment | 4 | 45 | 2 2 2 2 2 2 4 4 | 0/0 | 2-2 | 1 | 9-9 / 9-9 | 51-51 | 74-74 | 4 of 4 days needed | ok (longer day) |
| no equipment | 4 | 60 | 2 2 2 2 2 2 4 4 | 0/0 | 2-2 | 1 | 9-9 / 9-9 | 60-60 | 88-88 | recommended | ok |
| no equipment | 5 | 45 | 3 2 2 3 2 3 5 5 | 0/0 | 2-2 | 1 | 10-10 st. | 42.8-42.8 (3 x 40 s) | - | - | ok |
| no equipment | 5 | 60 | 3 2 2 3 2 3 5 5 | 0/0 | 2-2 | 1 | 10-10 st. | 42.8-42.8 (3 x 40 s) | - | - | ok |
| no equipment | 6 | 45 | 2 2 2 2 2 2 4 4 | 0/0 | 2-2 | 1 | 8-10 st. | 41.3-42.8 (3 x 40 s / 3 x 50 s) | - | - | ok |
| no equipment | 6 | 60 | 2 2 2 2 2 2 4 4 | 0/0 | 2-2 | 1 | 8-10 st. | 41.3-42.8 (3 x 40 s / 3 x 50 s) | - | - | ok |

### 8.7.1 Time vs minimums (COACH-R3 SES-02; replaces v1.1's floor-of-10 table) - RETIRED in v1.3

> **RETIRED in v1.3** (COACH-CT CT-01; COACH-R4 R4-SES-01, R4-SES-03, R4-SES-04). No template is checked against minutes. The 2-day rule and "what a template cannot hold" replace it (section V4). The text below is kept as history only.

**The coach's rule (approved):** "(1) tell them up front and offer a 3rd day or longer sessions; (2) if they keep their time, train fewer muscles directly (big movers first; arms, calves and rear delts only from compound credit) instead of dropping below the floor on everything; (3) use supersets to save time; (4) the stairway climbs on the muscles that are trained, never flat. Never squeeze 2-4 exercises per muscle into a day that can't hold them" - "Yeah, this is fine. Recommend doing supersets so that it's a faster workout, but they should be able to get things done." (COACH-R3 SES-02, RIGHT). The exact algorithm lives in the volume engine (`12_volume_algorithm_v1.md` §3.10.1); this table checks every template against it.

**How the table was computed (INFERRED estimate; 12 owns the real numbers).** *Start* = the template's starting sets (2 per exercise, calves 3, 8.7). *Week 1 with the floor* = the same week after the volume engine lifts every directly trained group to 10 weekly sets (R2-VOL-04/06, read on groups: COACH-R3 VOL-01, SES-01) by the VOL-07 order across the week's exposures, with station caps (5 sets on compounds, 4 on isolation and calves) - sets that do not fit go to the optional-day slot (calves: never a second calf exercise on a leg day). Direct sets only, so the estimate is conservative (group credit from compounds would add a little). *Peak week* = an 8-week L2 plan (x1.328 on every trained group, ceilings 22, 12 §3.7.1) placed the same way. Minutes = the 7.4 time model with every eligible pair supersetted (the supersets the plan recommends). A day holds the plan when it is at most the chosen length x 1.10 (the coach's "a little longer day"; 10 % PROPOSED). Not checked here: in-season variants (not floored), bootcamp circuits (dosed in rounds, PRG-03), field athletes' biceps and triceps (credit only, 12 §3.4). JSON: `rules.time_vs_minimums_check_R3SES02`.

| Template(s) | Min | Groups under 10 at the template start (weekly sets) | Floor sets added in week 1 (+ optional-day slot) | Longest main day, every pair supersetted: start -> week 1 with the floor -> peak week (min) | R3-SES-02 outcome |
|---|---|---|---|---|---|
| aesthetics 2-day | 45 | back 8, calves 6, chest 8, hips 8, quads 8, shoulders 8 | +12 (+2 optional day: calves 2) | 59 -> 69 -> 87 | step 1: tell + offer 70 min (peak ~90) or another day |
| aesthetics 2-day | 60 | back 8, calves 6, chest 8, hips 8, quads 8, shoulders 8 | +12 (+2 optional day: calves 2) | 60 -> 70 -> 88 | step 1: tell + offer 75 min (peak ~90) or another day |
| aesthetics 2-day | 90 | biceps 4, calves 8, chest 9, shoulders 9, triceps 4 | +10 (+6 optional day: biceps 2, calves 2, triceps 2) | 77 -> 88 -> 103 | step 0; late weeks time-limited unless 105 min |
| aesthetics 3-day | 45 | back 8, calves 9, chest 8, hips 8, quads 8, shoulders 8 | +11 | 51 -> 58 -> 66 | step 1: tell + offer 60 min (peak ~70) or another day |
| aesthetics 3-day | 60 | back 8, biceps 4, calves 9, chest 8, shoulders 8, triceps 4 | +15 (+4 optional day: biceps 2, triceps 2) | 56 -> 68 -> 78 | step 1: tell + offer 70 min (peak ~80) or another day |
| aesthetics 3-day | 90 | biceps 4, triceps 4 | +8 (+4 optional day: biceps 2, triceps 2) | 78 -> 85 -> 98 | step 0: fits |
| aesthetics 4-day, 5-day, 6-day | 45 | back 8, chest 8, hips 8, quads 8 | +8 | 44 -> 47 -> 60 | step 0; late weeks time-limited unless 60 min |
| aesthetics 4-day, 5-day, 6-day | 60 | back 8, biceps 8, chest 8, triceps 8 | +8 | 56 -> 59 -> 75 | step 0; late weeks time-limited unless 75 min |
| aesthetics 4-day, 5-day, 6-day | 90 | biceps 8, triceps 8 | +4 | 78 -> 79 -> 98 | step 0: fits |
| aesthetics 4-day upper/lower | 45 | back 8, biceps 8, calves 6, chest 8, triceps 8 | +10 (+2 optional day: calves 2) | 63 -> 71 -> 90 | step 1: tell + offer 75 min (peak ~95) or another day |
| aesthetics 4-day upper/lower | 60 | back 8, biceps 8, calves 6, chest 8, triceps 8 | +10 (+2 optional day: calves 2) | 64 -> 72 -> 92 | step 1: tell + offer 75 min (peak ~95) or another day |
| aesthetics 4-day upper/lower | 90 | biceps 8, calves 8, triceps 8 | +4 (+2 optional day: calves 2) | 76 -> 80 -> 100 | step 0; late weeks time-limited unless 100 min |
| aesthetics 6-day PPL x2 | 45 | biceps 8, calves 6, triceps 8 | +6 (+2 optional day: calves 2) | 50 -> 52 -> 62 | step 1: tell + offer 55 min (peak ~65) or another day |
| aesthetics 6-day PPL x2 | 60 | biceps 8, calves 6, triceps 8 | +6 (+2 optional day: calves 2) | 51 -> 52 -> 63 | step 0: fits |
| aesthetics 6-day PPL x2 | 90 | biceps 8, calves 8 | +2 (+2 optional day: calves 2) | 72 -> 72 -> 86 | step 0: fits |
| athletic 2-day | 60 | back 8, calves 6, chest 4, hips 8, quads 8, shoulders 4 | +18 (+4 optional day: calves 2, chest 1, shoulders 1) | 66 -> 82 -> 88 | step 1: tell + offer 85 min (peak ~90) or another day |
| athletic 2-day | 90 | calves 8, chest 5, shoulders 5 | +8 (+4 optional day: calves 2, chest 1, shoulders 1) | 85 -> 92 -> 102 | step 0; late weeks time-limited unless 105 min |
| athletic 3-day | 60 | back 8, calves 9, chest 8, quads 8, shoulders 8 | +9 | 71 -> 78 -> 91 | step 1: tell + offer 80 min (peak ~95) or another day |
| athletic 3-day | 90 | shoulders 9 | +1 | 91 -> 91 -> 100 | step 0; late weeks time-limited unless 105 min |
| athletic 4-day, 5-day, 6-day | 60 | chest 8, shoulders 8 | +4 | 66 -> 68 -> 80 | step 1: tell + offer 70 min (peak ~80) or another day |
| athletic 4-day, 5-day, 6-day | 90 | none | +0 | 85 -> 85 -> 94 | step 0: fits |
| athletic 4-day same pattern | 60 | back 8, chest 8, hips 8, quads 8 | +8 | 58 -> 62 -> 72 | step 0; late weeks time-limited unless 75 min |
| athletic 4-day same pattern | 90 | none | +0 | 90 -> 90 -> 103 | step 0; late weeks time-limited unless 105 min |
| athletic 4-day BASEBALL Parts | 60 | chest 6 | +3 (+1 optional day: chest 1) | 74 -> 79 -> 84 | step 1: tell + offer 80 min (peak ~85) or another day |
| athletic 4-day BASEBALL Parts | 90 | chest 6 | +3 (+1 optional day: chest 1) | 96 -> 101 -> 107 | step 1: tell + offer 105 min (peak ~110) or another day |
| strength 2-day | 90 | calves 8, chest 7, triceps 4 | +6 (+5 optional day: calves 2, chest 1, triceps 2) | 94 -> 97 -> 108 | step 0; late weeks time-limited unless 110 min |
| strength 3-day | 90 | back 5, biceps 4, calves 8, chest 8, shoulders 4 | +15 (+6 optional day: biceps 2, calves 2, shoulders 2) | 75 -> 106 -> 106 | step 1: tell + offer 110 min (peak ~110) or another day |
| strength 4-day, 5-day, 6-day | 90 | back 9, biceps 2, calves 8, quads 7, shoulders 9, triceps 2 | +9 (+14 optional day: biceps 6, calves 2, triceps 6) | 66 -> 78 -> 86 | step 0: fits |
| fat loss 2-day | 45 | back 8, calves 6, chest 4, hips 8, quads 8, shoulders 4 | +18 (+4 optional day: calves 2, chest 1, shoulders 1) | 51 -> 66 -> 77 | step 1: tell + offer 70 min (peak ~80) or another day |
| fat loss 2-day | 60 | back 8, calves 6, chest 4, hips 8, quads 8, shoulders 4 | +18 (+4 optional day: calves 2, chest 1, shoulders 1) | 52 -> 68 -> 78 | step 1: tell + offer 70 min (peak ~80) or another day |
| fat loss 4-day | 45 | chest 8, shoulders 8 | +4 | 51 -> 52 -> 68 | step 1: tell + offer 55 min (peak ~70) or another day |
| fat loss 4-day | 60 | chest 8, shoulders 8 | +4 | 52 -> 54 -> 69 | step 0; late weeks time-limited unless 70 min |
| hybrid / CrossFit 2-day | 60 | back 4, calves 6, chest 4, hips 5, quads 5, shoulders 4 | +28 (+4 optional day: calves 2, chest 1, shoulders 1) | 67 -> 94 -> 94 | step 1: tell + offer 95 min (peak ~95) or another day |
| hybrid / CrossFit 2-day | 90 | back 9, calves 8, chest 5, shoulders 4 | +10 (+4 optional day: calves 2, chest 1, shoulders 1) | 95 -> 109 -> 116 | step 1: tell + offer 110 min (peak ~120) or another day |
| hybrid / CrossFit 3-day | 60 | back 4, calves 6, chest 4, hips 5, quads 5, shoulders 9 | +24 (+3 optional day: calves 2, chest 1) | 68 -> 90 -> 93 | step 1: tell + offer 90 min (peak ~95) or another day |
| hybrid / CrossFit 3-day | 90 | back 5, calves 8, chest 4, hips 8, quads 6 | +16 (+3 optional day: calves 2, chest 1) | 86 -> 95 -> 99 | step 0; late weeks time-limited unless 100 min |
| hybrid / CrossFit 4-day CrossFit-style class; hybrid / CrossFit 6-day | 60 | back 4, calves 6, chest 9, hips 5, quads 5 | +19 (+2 optional day: calves 2) | 68 -> 88 -> 92 | step 1: tell + offer 90 min (peak ~95) or another day |
| hybrid / CrossFit 4-day CrossFit-style class; hybrid / CrossFit 6-day | 90 | back 5, calves 8, hips 8, quads 6 | +11 (+2 optional day: calves 2) | 86 -> 95 -> 99 | step 0; late weeks time-limited unless 100 min |
| hybrid / CrossFit 5-day | 60 | chest 9, shoulders 9 | +2 | 67 -> 68 -> 81 | step 1: tell + offer 70 min (peak ~85) or another day |
| hybrid / CrossFit 5-day | 90 | none | +0 | 95 -> 95 -> 110 | step 0; late weeks time-limited unless 115 min |
| no-equipment 2-day | 45 | back 8, calves 6, chest 4, hips 8, quads 8, shoulders 4 | +18 (+4 optional day: calves 2, chest 1, shoulders 1) | 51 -> 66 -> 77 | step 1: tell + offer 70 min (peak ~80) or another day |
| no-equipment 2-day | 60 | back 8, calves 6, chest 4, hips 8, quads 8, shoulders 4 | +18 (+4 optional day: calves 2, chest 1, shoulders 1) | 52 -> 68 -> 78 | step 1: tell + offer 70 min (peak ~80) or another day |
| no-equipment 4-day | 45 | chest 8, shoulders 8 | +4 | 51 -> 52 -> 68 | step 1: tell + offer 55 min (peak ~70) or another day |
| no-equipment 4-day | 60 | chest 8, shoulders 8 | +4 | 52 -> 54 -> 69 | step 0; late weeks time-limited unless 70 min |

**Reading.**
- **Step 0 - fits:** 4-6-day aesthetics weeks at 90 min, athletic 4-6-day weeks at 90 min, the PPL split at 60-90 min, the 3-day aesthetics week at 90 min and the conjugate strength weeks hold the floor and a full 8-week climb inside the chosen length with the recommended supersets; no warning.
- **Step 0 with time-limited late weeks:** most 4-6-day aesthetics plans at 45-60 min, the 4-day fat-loss and no-equipment weeks at 60 min and the same-pattern athletic week at 60 min hold the floor in week 1 (+2-4 min) but the last weeks of a full climb need about 60-75 min; several 90-min plans (the 2-day aesthetics and athletic weeks, the upper/lower split, the 3-day and same-pattern athletic weeks, the 2-day strength week, the hybrid 3- and 5-day weeks and the class) need about 100-115 min at the peak. The plan is built at the chosen length, says so, and lets those lines land on the ceilings the days can hold (12 §3.10.1 step 4) - or the user takes the extra minutes.
- **Step 1 - tell up front and offer:** 2-3-day plans, the upper/lower split at 45-60 min, athletic weeks at 60 min, BASEBALL Parts, the strength 3-day trio, the hybrid 2-, 3- and 5-day weeks at 60 min (the 2-day also at 90), the CrossFit-style class at 60 min and a few 45-min plans (the 3-day aesthetics, PPL, 4-day fat-loss and no-equipment weeks) cannot hold the floor at their chosen length (week 1 needs about 55-110 min). The plan says so before it is built and offers the length shown or another training day; if the user keeps the time, fewer groups are trained directly (big movers first; arms, calves and shoulder isolation from compound credit) and the stairway climbs on the trained groups (12 §3.10.1 step 2; worked in 12 §5.1 and §5.5).
- The conjugate strength days (four roles, ORD-07) and the CrossFit class model stay exempt from 2-4 per muscle (8.7), and their WOD or 'survival' work is not credited here. Calves on 2-3 leg days reach 6-8 sets on their one exercise; the rest goes to the optional-day Calves slot (PROPOSED, 11.4).

### 8.8 The coach's sample plans (COACH-R2 R2-GEN-07)

The coach will grade these sample plans. Each one starts from this template (mapping PROPOSED):

| Sample plan | Template | Key settings |
|---|---|---|
| Swimming | athletic.3 (3 dryland days) + 1 optional day, around pool training (2 days for younger or lower-level swimmers) | sport dial 'swimming (dryland)' (approved, COACH-R3 ATH-01): 25 % plyometric, Olympic lifts 2-3 days, shoulder care every session (no bands), 0 extra gym aerobic sessions, a dryland taper with the swim taper (profile in 04) |
| Football | athletic.4 off-season (A1/B1/A2/B2 + optional days) | plyo share 60% skill / 50% big-skill / 40% linemen (R2-ATH-01); same-pattern variant for linemen and size goals; 3 aerobic sessions (R2-ATH-06); COD route names (ATH-06) |
| Soccer | athletic.4 off-season | 60% plyo share; contralateral unilateral loading (CAT-13); 80-90% unilateral (UNI-02); 3-4 aerobic sessions (R2-ATH-06) |
| CrossFit-style bootcamp | hybrid_crossfit.4 alternative 'crossfit_style_bootcamp' (or hybrid_crossfit.3) | class model, HALF TIME levels, WOD level = WODs per week (5.5) |
| Bootcamp | fat_loss_bootcamp.4 alternative 'bootcamp_circuit' (or fat_loss_bootcamp.6 rotation) | two circuits a day, 3 rounds x 35-50 s, 35-45 min; 3 aerobic sessions, adjustable |
| Full-body aesthetics | aesthetics.4 (A1/B1/A2/B2 + optional days) | same pattern, 2-4 exercises per muscle, heavy squat Monday / heavy deadlift Friday, 4 aerobic sessions + walks |
| Push / pull / legs | aesthetics.6 alternative 'ppl_x2' (or PPL once a week on 3 days, PRG-02) | flexible weekdays; Legs 2 hinge-led with leg press |

### 8.9 Stay athletic and active (gen pop) - coach request 2026-10-08

> **Changed in v1.3** (COACH-R4 R4-SES-02, R4-SES-03). Non-competitive athletic days hold 5-10 exercises (his sheet has 10 slots; range PROPOSED); on 2 days the 2-day rule applies instead of the time check. Where the text below differs, the v1.3 section at the top of this file wins.

"Gen Pop and general fitness people are wanting to do things like high rows [HYROX] and pickleball, meaning they want to stay athletic and active, so we need to understand that that's an option for them." This is a **recreational path**: the user picks an activity - no position and no season dates - and, since v1.2, **the days they play and an optional event date** (COACH-R3 ATH-05, RIGHT): the hardest gym day sits at least 48 h before the biggest play day; weeks with 3+ play sessions drop the extra agility drills and do half the jumps; a 45-60+ min session of the activity counts as one of the 3 cardio sessions (up to 2); with an event (first HYROX race, pickleball tournament, 10K) the hardest weeks end 1 week before it, then 1 easy week. The session mapping is PROPOSED; the activity profiles are in `04_profiles.json`.

| Activity | Template | Session levers |
|---|---|---|
| Pickleball, padel, recreational tennis | Athletic Performance - Non-Competitive (athletic family, cross pattern, 60 min) | lateral COD and split-step work on the hip days; low-amplitude plyos (landing drills, ankle hops); rotational medball throws; single-leg balance; shoulder and elbow care (KB face pulls, rear delts); 50% plyo share (COACH-R3 ATH-04); players 50+: calf and Achilles work every leg day (pinned in the time policy), rotator-cuff work, low-impact jumps only (COACH-R3 ATH-02) |
| HYROX for fitness (first race) | the approved HYROX plan (8.5) on the hybrid family | 2 strength + 2 hybrid days; 4 cardio; 2 station circuits as finishers (never muscle sets); wall balls <= 20 lb; 40-rep / AMRAP sets only inside the circuits; 50 % plyo (COACH-R3 ATH-03) |
| Recreational golf | Athletic - Non-Competitive | rotational throws and core; hip mobility; 25% plyo share (COACH-R3 ATH-04) |
| Rec leagues (basketball, soccer, softball, flag football, volleyball, kickball) | Athletic - Non-Competitive | the sport's own dial at the recreational level, 60 min |
| Running, hiking / rucking, cycling, lap swimming, ski / snowboard prep | Athletic - Non-Competitive with more aerobic sessions (adjustable, R2-SES-06) | the half-marathon plan (Chris Hinshaw) stays the longest run (R2-LIB-06) |
| Everyone over 60 | any of the above | on by default: landing drills, balance, quick stepping, light medball throws, fast machine work; off by default: low ankle hops, other jumps, Olympic lifts, depth jumps - optional with W_OLDER_POWER (R2-ATH-08; COACH-R3 ATH-02) |

The day itself: warm-up -> light core -> 2 plyo/ballistic stations (low amplitude for 50+; for 60+ landing drills, balance and quick stepping by default) -> 1 Olympic or power station (off by default for 60+) -> resistance with 2 exercises per group -> one calf exercise -> optional buy-out. After a heavy play day the user may switch the athletic block off (COACH-R3 SES-02). In the coach's terms this is the JUSTICE LEAGUE idea: "just good health all around and just having a body that performs well" (ATH-13).

---

## 9. Generator algorithm (v1.2)

> **Changed in v1.3** (COACH-CT CT-01; COACH-CX CX-01..04; round 4). The v1.3 pipeline is `BLAZE_CAMP_BRAIN.md` §13.3. In the steps below: step 1 no longer takes a session length, and the release must be accepted or no plan is generated (R4-SCP-02); step 3 keeps the exercises up to the client type's count, not `include_from_minutes`; step 4 never switches supersets on because a session is short; step 6 validates the template skeleton and the session size, with 1-4 exercises per group on A / B days; step 9 reaches the planned final sets; step 11 also edits sets and marks the plan edited. Where the text below differs, the v1.3 section at the top of this file wins.

1. **Inputs** (after the health screen and release - v1.2, COACH-R3 GEN-01: a short Blaze Camp health check in English and Spanish, written by a lawyer, with a link to the official PAR-Q+; a coach may run it with the client or skip it after the Blaze Camp legal warning; everyone, client or coach, ticks the "use at your own risk" box and accepts the terms and conditions and liability release every time a plan is built; nothing is stored; drafts for attorney review in `DISCLAIMER.md` / `DISCLAIMER.es.md`; the flow belongs to the generator spec / 13; v1.1's "PAR-Q for clients" wording, R2-GEN-03, is superseded)**:** goal family; days per week (2-6); session minutes (45/60/75/90; PROPOSED 105/120 for competitive athletes, UNI-09); level L1/L2/L3 (PRG-05); equipment; competitive athletes: sport + position + the next season start date (or "in season until") + practice and game days (GEN-02, COACH-R2 R2-GEN-05); recreational stay-active users: the activity only (8.9); age (60+ defaults, R2-ATH-08); plan type (block length, maintenance, year - PER-01, R2-PER-01/02; week-by-week retired, COACH-R3 VOL-02); Focus muscle 1 and Focus muscle 2 (COACH-R3 SES-01); stay-active play days and an optional event date (COACH-R3 ATH-05); blocks completed in a row when rebuilding (PROPOSED; nothing is stored, COACH-R3 GEN-01); pain areas; rep-style preference; more / less cardio (R2-SES-06); coach-added rules (GEN-08). **No sleep, stress, life or physical-job fields** (COACH-R2 R2-GEN-04). No sex field (GEN-02, ATH-09).
2. **Week:** take `generator_split_templates[family][days].week_layout`, or the variant the sport, phase or preference selects (same-pattern athletic, BASEBALL Parts, in-season keyed to the game days, upper/lower, PPL x2, bootcamp circuit, CrossFit-style bootcamp). Heavy squat Monday, non-spinal hinge Tuesday, leg press / belt squat Thursday, heavy deadlift Friday (R2-SES-01). Optional days are separate by default (ORD-10). Place the aerobic sessions by population and apply the user's more / less request (ATH-07, R2-ATH-06, R2-SES-06).
3. **Sessions:** keep stations with `include_from_minutes` <= minutes; drop stations whose `condition` is false (Focus calves, the powerlifter technique lift); drop the blocks the user switched off for that day (`block_R3SES02`, COACH-R3 SES-02); for clients over 60 drop stations marked `older_default` unless switched on, then show W_OLDER_POWER (R2-ATH-08); write the warm-up (ORD-08); put the light core block first unless moved (ATH-11, R2-SES-03); add core supersets or a monster set only where the coach or user asks (R2-SES-03).
4. **Pairing and supersets:** keep the UNI-11 pairs, including the second-exercise pairs. Superset them when the session is short, when an L3 athlete needs more stimulus, when an off-season athlete is doing VO2max / mitochondrial work, or when an L1 client does not fatigue (ORD-05). Small-isolation pairs are always supersets. v1.2: list every eligible pair as a recommended superset, "needed" when the day fits only with it (COACH-R3 SES-02).
5. **Order:** warm-up -> core block -> (skill) -> plyo / ballistic -> throws -> COD -> Olympic / power (ORD-03; clean on squat days, snatch on hinge days, R2-ATH-04) -> the work + paired upper -> secondary pairs (horizontal before vertical, ORD-01) -> each group's second exercise -> isolation (a small muscle first only if it is a Focus muscle, ORD-04; COACH-R3 SES-01) -> conditioning / WOD.
6. **Validate the week:** 2-4 exercises per muscle group trained each day (R2-SES-05; groups COACH-R3 SES-01); pattern frequency; slot-level pairing; at most 1 heavy squat + 1 heavy hinge, on different days (PER-04, R2-SES-01/02); each upper vector >= 1x; calves one exercise x 3 sets every leg day (COACH-R3 SES-01); >= 1 rear-delt / face-pull station a week (VOL-17); the cap (12 + 2 core for field athletes, small-isolation supersets counted once, R2-SES-04); time at the block start and late in the block; the time-vs-minimums check (COACH-R3 SES-02, 8.7.1); >= 1 OFF day; coach-added rules (GEN-08).
7. **Fill exercises:** a default exercise in every slot plus swaps in the same category (GEN-04). Only library exercises; between blocks one detail may change (hand, grip, stance, implement, range) - never an invented exercise (R2-LIB-01). Filter by level (CAT-05), equipment (no bands, no variable resistance - EQ-01, EQ-12), pain (VOL-03), preference (EQ-10), older / injured constrained machines (EQ-03) and the 60+ defaults (R2-ATH-08). The second weekly exposure is a different exercise, non-axial for squats and hinges (PER-04, R2-SES-02). KB face pulls are shoulder work (R2-LIB-04). The laterality dial sets bilateral vs unilateral (UNI-02).
8. **Dose:** starting weekly sets from the volume engine (12): floor 10 per trained group with group credit (R2-VOL-04/06; COACH-R3 VOL-01, SES-01), Focus muscles +1-3 (COACH-R3 SES-01), ceilings customizable (R2-VOL-06). Credit the exercise picked: primary 1.0, helpers 0.25 (VOL-09), compounds 0.25 to glutes, thruster 1.0 quads / 0.5 shoulders / 0.25 glutes, KB swings 0 (R2-VOL-05), dips 0.5 / 0.5 (LIB-16), 10/10 = 1 set (UNI-01), athletic patterns 0 (VOL-10). Effort by RIR / RPE (VOL-13, R2-GEN-06), the planned cue drifting 3 RIR -> 2 -> 1-2 -> 1 RIR + intensifiers (approved, COACH-R3 VOL-04). Olympic lifts by power output: RPE / RIR and bar speed, a % only when the athlete entered a tested recent best, %-driven programming only for competitive Olympic lifters (R2-GEN-06). Where the templates' 2 sets per exercise leave a trained group under 10 a week, the engine adds the week-1 sets (8.7.1). Rests 1-2 (up to 3) min hypertrophy, 3-6 min strength (VOL-14).
9. **Progress:** the approved planned stairway (R2-PER-03/04/05; COACH-R3 VOL-04), computed once - no check-in, nothing stored (COACH-R3 VOL-02, GEN-01) - adds sets by the VOL-07 order (2/2/2 -> 3/2/2 -> 3/3/2 -> 3/3/3 -> 4/3/3), alternating between the two weekly exposures of a day type (approved, COACH-R3 VOL-03); a small muscle's bonus exercise on the optional day or a day that already trains it; calves never a second exercise on a leg day (COACH-R3 SES-01). **Time (COACH-R3 SES-02):** if the chosen time cannot hold the minimums, tell up front and offer another day or a longer session; if the user keeps the time, train fewer groups directly, recommend supersets and let the stairway climb on every trained group - never cut a group to one exercise. Print the self-adjust guide (12 §3.7.3).
10. **Periodise** (details in 06): blocks are completed - no deload or maintenance week inside a block (R2-VOL-07); the easy week after a block is a recommendation, not mandatory; the block ends and the user builds the next (COACH-R3 PER-01); a client who cannot finish stops the block and builds a maintenance phase (length chosen, no end prompt) or a new block; holidays between blocks; pre-season 4-6 weeks at about 60% with more speed and power + a 1-2-week taper (R2-PER-06); tests before the block (or week 1) and at the end, never mid-block, no 1RM / max mile from zero (R2-PER-07); between blocks change one or two small variables (PER-02, R2-LIB-01); the gen-pop year plan is fully user-tunable (R2-PER-01/02); one algorithm for every level (PRG-06).
11. **Edit (COACH-R3 SES-02):** the user or coach may switch a day's core, skill, athletic, Olympic, focus or conditioning block off, add or remove exercises or whole blocks, and "add rear delts" (a 2-set rear-delt exercise on a pull day, COACH-R3 VOL-01); athletic and core work never count as muscle sets, so a toggle changes no weekly set number; removing an exercise that leaves a group with one exercise that day offers: remove the group from that day, or keep it. Nothing is stored - an edit rebuilds the printed plan (COACH-R3 GEN-01).

---

## 10. What this says about how the coach thinks

> **Changed in v1.3** (COACH-CT CT-01; COACH-R4 R4-SES-01 to R4-SES-05). Items 6 and 9 below are the v1.2 reading. In v1.3: session size is a number of exercises by client type (general 5-7, aesthetics 6-8, strength 5-6, bootcamp 5-7 stations, field athletes up to 12, older adults 5-6), and the minutes named in item 6 are typical lengths, not inputs and not limits. A full-body day is his A or B day of about 6 exercises (up to 8), where a group such as biceps or triceps has one exercise; "2-4 exercises, never one" holds on split days. With 2 training days every big group is still trained, at about 6-8 weekly sets, and a third day is suggested; "train fewer muscles when the time is too short" is retired with time-fitting. Where the text below differs, the v1.3 section at the top of this file wins.

1. **The slot skeleton is the program; the exercise is a choice inside it** (OBSERVED, confirmed by GEN-04: "pick the default and be able to do the drop-downs").
2. **An athlete program is a muscle program with an athletic prefix** (OBSERVED: OT04 is OT01 with Plyo / Throwing / COD / 'Tripple Extension' added). In v1 the prefix sits after the core block, and every athlete gets Olympic work (ATH-10).
3. **Balance is structural, and the coach can say why.** Hip with push and knee with pull keeps paired work "as far away as I can from bleeding over problems", so the client can do more work across the week (UNI-11). Same-pattern days drive a muscle harder; cross-pattern days keep bootcamp clients fresh enough to come back (UNI-06). The spine gets one heavy squat and one heavy hinge a week (PER-04).
4. **Order follows what matters most.** Core first as a warm-up (ATH-11), power before strength (ORD-03), the work first (ORD-02); the new sets go to the first exercise "because I put all my energy into it" (VOL-07).
5. **Fatigue is a tool, not a by-product.** Supersets compress fatigue for those who need more of it - the advanced athlete, the off-season engine, the beginner who does not feel it (ORD-05) - and save time for those who have little.
6. **Session size is set by the person, not by a fixed hour.** About 90 minutes for athletes and physique competitors, 45-60 for everyday clients, 35-45 for bootcamps (UNI-09, PRG-03). Within that, 5-7 hard exercises on split days (VOL-08, VOL-16), 8-12 on full-body days because every muscle gets 2-4 exercises (R2-SES-05), and up to 12 + the 2-exercise core block for a field athlete far from competition (VOL-08, R2-SES-04). He accepts a longer day rather than a muscle with one exercise.
7. **The week has a fixed rhythm** (OBSERVED): two hard pairs, recovery or optional days between and after them, Sunday off. Optional days are better as their own days (ORD-10).
8. **Everything is adjustable to the person.** Pain and response change the rate, the laterality and the exercise (VOL-03, VOL-05, UNI-02, UNI-08); in round 1 he expected the system to learn from data over time (VOL-01, VOL-02); round 3 settled it the other way: "I don't want any data kept" - the plan is an output and people adjust it themselves (COACH-R3 GEN-01, VOL-02). Cardio goes up or down on request (R2-SES-06).
9. **A muscle is never trained with a single exercise.** "There's never one exercise, so from 2 all the way to 4" (R2-SES-05) - he would rather have a longer day than a thin one, and when the time really is too short he would rather train fewer muscles properly, with supersets, than squeeze them all (COACH-R3 SES-02). Calves are the exception: one exercise, 3 sets, every leg day (COACH-R3 SES-01).
10. **A block is a stairway you finish.** Small steps first, the hardest weeks last, no deload in the middle; if you cannot finish, you stop, maintain if you want to, and start a new block (R2-PER-03/04, R2-VOL-07); the easy week after a block is a recommendation, not a rule (COACH-R3 PER-01). Olympic lifts are power, not percentages, and they follow the pattern of the day - cleans with squats, snatches with hinges (R2-ATH-04, R2-GEN-06).

---

## 11. Open questions

### 11.1 Status of the v0 questions

| # | v0 question (short) | Status | Answered by |
|---|---|---|---|
| 1 | Same vs opposite lower pairing | CLOSED - a rule by goal | UNI-06 |
| 2 | Horizontal pull with knee days, push with hip days | CLOSED - deliberate (bleed-over); BOOTCAMP 1 Tue/Fri was a mistake | UNI-11, ORD-06 |
| 3 | Vertical vector same vs crossed | CLOSED - follows the lower pattern | UNI-11 |
| 4 | Supersets | CLOSED - fatigue / time tool, four use cases | ORD-05 |
| 5 | Small muscle first | CLOSED - priority only (v1.2: a Focus muscle, COACH-R3 SES-01) | ORD-04 |
| 6 | Session length, what to cut | CLOSED - 90 / 45-60 min; exercises by length | UNI-09, VOL-08 |
| 7 | Optional days; complete 2-day sessions | PARTLY - add-on or separate (ideally separate); complete 2-day sessions INFERRED | ORD-10 |
| 8 | 2 vs 3 aerobic sessions | CLOSED - 3 / 2 / 4 by population, athletes 2-4 by sport, adjustable; the 4th aesthetics session is a second easy Orange | ATH-07, R2-SES-06, R2-ATH-06 |
| 9 | Conditioning placement | CLOSED - fighter aerobic block first, buy-outs last, cardio inside circuits | ORD-09, PRG-03 |
| 10 | Core placement | CLOSED - core first for everyone, movable | ATH-11 |
| 11 | Buy-out on every 60+ min athletic session | OPEN | - |
| 12 | COD | CLOSED - every athlete, tiered by turn angle | ATH-06 |
| 13 | Plyos by sport | PARTLY - plyo shares by sport approved; weekly contacts per sport live in 04 v1.1 | ATH-01, ATH-02, R2-ATH-01 |
| 14 | Boxing upper body | CLOSED - reduce, never cut | ATH-04 |
| 15 | Second weekly exposure | CLOSED - different exercise, non-axial | PER-04 |
| 16 | Why the 3-day cut keeps leg curls | OPEN | - |
| 17 | Fixed strength layout; squat + deadlift on one day | PARTLY - squat and deadlift on different days (R2-SES-01); the fixed conjugate layout itself is still open | R2-SES-01 |
| 18 | HYBRID order | CLOSED - power first | ORD-03 |
| 19 | 5-6 day hypertrophy default | PARTLY - PPL days flexible; default still open | PRG-02 |
| 20 | No-equipment kit and swaps | PARTLY - no bands; sissy squats / nordics / slider curls; KB curl, table row, floor Y/T raises added; minimum kit unknown | EQ-01, EQ-02, EQ-07, EQ-08, R2-LIB-07 |
| 21 | Deloads | CLOSED - v1.1: no deload inside a block; maintenance (about half the sets, same exercises, lighter, no finisher) at the end or after a cancelled block | PER-05, R2-VOL-07 |
| 22 | Pull order | CLOSED - row first, always | ORD-01 |
| 23 | Contrast rest | CLOSED - no rest inside the complex | ATH-12 |
| 24 | Vertical press optional for physique / fat loss | OPEN | - |
| 25 | CrossFit WOD days by month or by level | OPEN | - |

### 11.2 Questions raised by the round-1 answers - status after round 2

| # | Question (short) | v1.1 status |
|---|---|---|
| 1 | Axial scope: Olympic lifts, loaded jumps, light front-loaded squats, shoulder-pad machines; powerlifters | **CLOSED** (R2-SES-02): Olympic lifts, loaded jumps, leg press, belt squat, hip thrust, back extension, reverse hyper and single-leg DB work don't count; goblet / hack / pendulum fine on the second day if not sore; powerlifters may add a light technique squat or deadlift |
| 2 | Axial spacing | **CLOSED** (R2-SES-01): two different days, squat Monday, deadlift Friday |
| 3 | Non-axial hinge pool | **CLOSED** (R2-SES-01): hip thrust, back extension, reverse hyper; KB swing removed (R2-VOL-05) |
| 4 | Second squat without a leg press | **CLOSED** (INFERRED application of R2-SES-02): goblet squat |
| 5 | Core-first dose | **CLOSED** (R2-SES-03): 2 x 2 short of failure; core add-ons anywhere |
| 6 | Cap counting | **CLOSED** (R2-SES-04): 12 + the 2-exercise core block; warm-up drills never count; two small isolations in a superset count once |
| 7 | Set addition with two A days | **CLOSED** (COACH-R3 VOL-03, RIGHT): alternate between the two sessions |
| 8 | Small-muscle bonus placement | **CLOSED** (COACH-R3 VOL-03, RIGHT): the optional day, else a day that already trains that muscle, never as its only exercise that day |
| 9 | Strength pairing (UNI-11 vs STRENGTH-8) | OPEN (not asked in round 2) |
| 10 | Which athletes get same-pattern days | **CLOSED** (COACH-R3 SES-01): size-focused and high-level athletes; cross pattern stays the default |
| 11 | Fourth aerobic session | **CLOSED** (R2-SES-06): a second easy Orange; all aesthetics / physique clients get 4; walks are extra; adjustable |
| 12 | Calves and rear delts in short sessions | **CLOSED** (R2-SES-05; v1.2 COACH-R3 SES-01, VOL-01): calves one exercise x 3 sets per leg day; rear delts inside the shoulders group's 2 exercises |
| 13 | Hybrid calves and rear delts | PARTLY - the class model gives calves one exercise x 3 sets on leg days (COACH-R3 SES-01) and the week's rear-delt work on HY2 / the squat class (R2-SES-05) |
| 14 | Tracking | **CLOSED** (R2-GEN-01, R2-VOL-03; v1.2 COACH-R3 VOL-02, GEN-01): no check-in, nothing stored; the plan follows its planned stairway |
| 15 | COD in BASEBALL and in-season weeks | PARTLY - R2-ATH-07: game-heavy sports add no extra COD in season; BASEBALL Parts weeks still have no COD (sport practice) |

### 11.3 New questions raised by the round-2 answers (v1.1) - status after round 3

1. **[ANSWERED, COACH-R3 SES-01: FOCUS groups, hips and shoulders together, calves one exercise]** **Per-muscle count (R2-SES-05).** We count glutes and hamstrings as one group ("hips") and the delts + traps as one ("shoulders"), so a hip day with a deadlift, a single-leg RDL and a leg curl meets "2-4 per muscle". Should glutes and hamstrings each get their own 2 exercises (one more exercise on hip days)?
2. **Cross-pattern days (UNI-06 + R2-SES-05).** To give every muscle 2 exercises and keep squat + single-leg RDL on the same day, the second exercise of each lower group is a lighter one (leg extension after the squat, leg curl after the single-leg RDL), as on your BOOTCAMP 1 A day. A fat-loss gym day becomes about 10 exercises (~51 min at 45, ~60 at 60 at the start). OK, or should these clients use knee days and hip days instead?
3. **Bootcamp circuits (PRG-03 + R2-SES-05).** 2 stations per muscle gives 9-11 stations (v1.2: 8-10, calves one station), so we run two circuits of 4-6 stations (3 rounds x 35-50 s, ~43-45 min; v1.2 ~41-43). OK, or one 7-station circuit that trains fewer muscles per day? Your FAT BURN ramp (3 x 30 s -> 5 x 50 s) only fits with fewer stations.
4. **[ANSWERED, COACH-R3 SES-01: cross pattern stays the default; same-pattern template for size-focused and high-level athletes]** **Field athletes (R2-SES-04 + R2-SES-05).** With the cross pattern, 2 exercises per muscle uses 9 of the 12 counted slots, leaving 2 plyo/ballistic stations + 1 Olympic lift. Your own BYOP athletic template (same pattern) needs fewer and leaves 3-4 + 1. Keep the cross pattern as the athlete default, or use your same-pattern template for off-season athletes?
5. **Conjugate strength days (ORD-07 + R2-SES-05).** Your four-role days give some muscles one exercise (e.g. the max-effort lower day: one hinge accessory, one pull). Keep them as written, or add a second exercise per muscle?
6. **In-season days (PER-08 + R2-SES-05).** 2 exercises per muscle in season makes each gym day about 12 exercises at 1-2 sets (~56 min). OK, or should in-season days train fewer muscles?
7. **[ANSWERED, COACH-R3 ATH-01: 3 dryland days + 1 optional (2 for younger or lower-level), 0 extra cardio]** **Swimming (R2-GEN-07 sample).** Dryland around pool training: is 0-1 gym aerobic session a week right (the pool covers it), and how many dryland days for age-group, high-school and college swimmers?
8. **[ANSWERED, COACH-R3 ATH-02: landing drills, balance, quick stepping, light medball, fast machine work on; jumps and Olympic lifts off by default; 50+ racket players calf / Achilles work every leg day]** **Pickleball 60+ (new request).** For recreational players over 60 we keep plyos and Olympic lifts off by default (R2-ATH-08) and use landing drills, low ankle hops and split-step drills. Right?
9. **[ANSWERED, COACH-R3 VOL-01, VOL-02: rear delts inside the shoulders group; the check-in is retired]** **Rear delts 4 / 6 / 8 vs the floor of 10 (R2-VOL-04 vs R2-VOL-06)** and **the check-in without the life column (R2-VOL-01 vs R2-GEN-04)** - see the v1.1 resolutions at the top; both are also raised for the master file.
10. **[ANSWERED, COACH-R3 SES-02: tell up front + offer, fewer groups trained directly, supersets, the stairway on the trained groups - 8.7.1]** **Floor of 10 at the start (R2-VOL-04/06 + R2-SES-05; v1.1 adversarial check).** With 2 sets per exercise, 2-3-day plans, upper/lower weeks and the CrossFit-style class give some muscles only 2-9 sets in week 1, so the floor adds sets and the first days get longer (e.g. a 2-day full-body day ~60 -> ~72 min, a 2-day fat-loss day ~60 -> ~83, a CrossFit-style class ~68 -> ~90; 8.7.1). Accept the longer days, add a training day, or let 2-day and class plans start below 10? And should WOD movements count toward the floor?

### 11.4 New questions raised by the round-3 answers (v1.2)

1. **Very short weeks (R3-SES-02).** With your minimums, a 2-day 45-minute full-body week holds about one big group plus the calf work (12 §5.5), and most 2-day templates need 70-75 minutes in week 1 (8.7.1). Is that right, or should short weeks train the big movers once a week each at 10 sets?
2. **4-6-day plans at 45-60 minutes (R3-SES-02).** They fit in week 1, but the last weeks of a full stairway need about 60-75 minutes (8.7.1). The plan says so and lets those lines climb on time-limited ceilings unless the user takes the extra minutes. OK?
3. **Calves with fewer than 4 leg days (R3-SES-01 + R2-VOL-06).** One calf exercise x 3-4 sets gives 6-8 sets on 2 leg days; we put the rest in the optional-day Calves slot. OK, or may calves stay under 10 in 2-day plans?
4. **Which blocks can be switched off (R3-SES-02).** We let the user switch off core, skill, athletic, Olympic, focus and conditioning blocks; the warm-up and the resistance block stay on (resistance is edited exercise by exercise). Right?

---

### 11.5 After round 4 (v1.3)

Settled or retired: very short weeks (the 2-day rule, R4-SES-03); the time-vs-minimums estimates and the 10 % fit tolerance, the "recommended / needed" superset wording and the 105 / 120-minute options (retired with time-fitting, CT-01); the cross-pattern lighter second exercise on gym days (his A / B template replaces it, R4-SES-05); what gets left out (the person picks, R4-SES-04). Still PROPOSED: the 7th and 8th exercise of the A / B days and the session-size defaults; whether the athletic days keep each slot's laterality; the incline press in the "Chest / Shoulders" slot and its credit; bootcamp rounds by level; which blocks may be switched off and their ids; the optional-day Calves slot with fewer than 4 leg days. The questions for the coach are in `BLAZE_CAMP_BRAIN.md` §0d.3.

## 12. Sources and science references

**Coach answers (AUTHORITATIVE):** `coach_answers_round3.md` (round 3, 2026-10-09; cited as COACH-R3 <ID>; it overrides rounds 1 and 2), `coach_answers_round2.md` (round 2, 2026-10-08; cited as COACH-R2 <ID>; it overrides round 1), `coach_answers_full.md` (138 of 140 questions, 2026-10-08) and `coach_answers.md` (chat statements). Round-1 question IDs are cited as COACH-ANSWER <ID>. The coach's 2026-10-08 request (every popular US sport, swimming, pickleball and HYROX for gen pop) is cited by date; the sport profiles that answer it are in `04_profiles.json` v1.1.

**Coach material** (all read-only):
- BYOP tabs 00-08 and 09 (library wiring).
- MASTER_MODEL tabs 'EXAMPLE UPPERLOWER SPLIT', 'EXAMPLE PUSHPULLLEGS SPLIT', 'EXAMPLE FAT BURNBODY TONING PRO', 'EXAMPLE ATHLETIC FULL BODY SPLI', 'EXAMPLE BOXING 8 WEEK BUILD UP', 'BASEBALL', 'EXAMPLE CROSSFIT SPLIT', '(NOT DONE) 4 TRACKS PROGRAMMING', '(NOT DONE) EXAMPLE CONJUGATE', 'AEROBIC CAPACITY CHEAT SHEET', 'ALL ABOUT SQUATS', '(NOT DONE) ALL ABOUT BALLISTICS', '(NOT DONE) RESISTANCE PATTERNS ', 'Sheet24', 'Sheet25'.
- All of it via the decode files in `analysis/`, plus the raw spot-checks listed at the top.

**Science** (general literature, cited from knowledge; not re-verified against full texts in this session):
- Simão R, et al. (2012). Exercise order in resistance training. *Sports Medicine* 42(3):251-265.
- Schoenfeld BJ, Ogborn D, Krieger JW (2016). Effects of resistance training frequency on measures of muscle hypertrophy: a systematic review and meta-analysis. *Sports Medicine* 46(11):1689-1697.
- Schoenfeld BJ, Ogborn D, Krieger JW (2017). Dose-response relationship between weekly resistance training volume and increases in muscle mass. *Journal of Sports Sciences* 35(11):1073-1082.
- Schoenfeld BJ, Grgic J, Krieger J (2019). How many times per week should a muscle be trained to maximize muscle hypertrophy? A systematic review and meta-analysis of studies examining the effects of resistance training frequency. *Journal of Sports Sciences* 37(11):1286-1295 (volume-equated frequency).
- Robbins DW, Young WB, Behm DG, Payne WR (2010). Agonist-antagonist paired set resistance training: a brief review. *Journal of Strength and Conditioning Research* 24(10):2873-2882.
- Weakley JJS, et al. (2017). The effects of traditional, superset, and tri-set resistance training structures on perceived intensity and physiological responses. *European Journal of Applied Physiology* 117:1877-1889.
- Iversen VM, et al. (2021). No time to lift? Designing time-efficient training programs for strength and hypertrophy: a narrative review. *Sports Medicine* 51:2079-2095.
- Seitz LB, Haff GG (2016). Factors modulating post-activation potentiation of jump, sprint, throw, and upper-body ballistic performances: a systematic review with meta-analysis. *Sports Medicine* 46(2):231-240.
- Haff GG, Triplett NT (eds.) (2016). *Essentials of Strength Training and Conditioning*, 4th ed. (exercise order; plyometric contacts per session).
- Israetel M, Hoffmann J, Davis M, Feather J (2021). *Scientific Principles of Hypertrophy Training* (Renaissance Periodization), for the MEV/MAV/MRV volume landmarks. (Israetel, Hoffmann & Smith is the author team of the separate *Scientific Principles of Strength Training*, 2015.)

---

## Verification log - v0 pass 1 (history)

*These two v0 logs record how the OBSERVED content was fact-checked. Where they mention rules or open questions, the v1 rules and section 11 above take precedence.*

Adversarial fact-check run on 2026-10-07. Every OBSERVED claim was checked against `dumps/BYOP`, `dumps/MASTER_MODEL`, sheet visibility in `raw/*.xlsx` (openpyxl, read-only) and the decode files in `analysis/`. No Google Sheet was opened. `05_templates.json` was patched to match; its `_meta.verification.changes` lists the same items.

### Numbers recomputed independently from the dumps (python on the dump files)

| Claim | Recomputed | Result |
|---|---|---|
| AESTHETICS Day 1 = 7 exercises / 19 sets | 7 / 19 | confirmed |
| JUSTICE LEAGUE Monday = 10 exercises / 20 sets (10 athletic + 10 resistance) | 10 / 20 | confirmed |
| MM UL sets: lower 20-32, upper 24-27 | lower 20 / 30 / 32, upper 24 / 24 / 27 (novice / newby / intermediate) | confirmed |
| FAT BURN weekly sets 60, 60, 64, 70 | 60, 60, 64, 70 | confirmed |
| STRENGTH-8 56 sets/week; CONJUGATE 60 | 56; 60 | confirmed |
| BASEBALL exercises per session median 9 (6-11) | own grid parser: median 9, range 6-11 (counting the OLY row) | confirmed |
| BASEBALL 'Superset - same reps' 19x, 'Superset - max reps' 5x | 19, 5 | confirmed |
| BASEBALL calf slot ballistic ~43% | decode 20/46 = 43%; label-based recount 16/39 = 41% | confirmed (approx.) |
| BASEBALL buy-outs "3-4 bouts a week" | 0-5 per week; block means 3.3 / 3.3 / 3.8 only over loaded weeks; filled on 2-4 of the 4 days | **corrected** |
| CrossFit aerobic sessions 2/2/3/4 at levels 1-4 | Mon+Thu at L1-2, + Sat at L3, + Tue + Sat at L4 | confirmed |
| Athletic example 89 -> 72 -> 59 sets/week | 35+24+30 / 21+10+25+16 / 14+19+17+9 under the component-set convention | confirmed, but **relabelled** as computed, not OBSERVED |
| Boxing week 7: eleven rows drop 3 -> 2 sets | 11 rows | confirmed |

### Corrections made

1. **Sunday 'OFF' "in every BYOP tab"** was wrong. It appears in 7 of 9 program tabs; 'AESTHETICS - FULL BODY - 4 DAYS' and '3 DAY BUILDER' have no weekday or OFF labels (6.7, JSON `off_days`).
2. **Horizontal-before-vertical pull** was wrong. The doc said FAT BURN, 4 TRACKS and boxing "flip the lead each week". In fact they put the **vertical pull first every time** (audit R1: 0/8, 0/38, 0/2), while BYOP, UL and PPL put the row first (19/19). This is a workbook-level split. Rewritten in 3.3, added as generator step 6 in 3.5, open question 22 added, and the FAT BURN pull order noted in 2.2.
3. **Tiers 5/6 evidence** was overstated. "Bilateral + horizontal upper / unilateral + vertical upper" is BYOP-only. BASEBALL Part C pairs the bilateral lift with V on Thu/Fri, and Part D pairs the unilateral lift with two isolations. MASTER_MODEL bilateral+H vs +V is 70 vs 68 (audit N18). Fixed in 3.1 and in the section 5 superset rule.
4. **Audit counts mis-copied:** R9 BASEBALL 91/91 -> **92/92**; R8 BASEBALL 90/91 -> **91/92**; N18 MASTER_MODEL 70 vs 67 -> **70 vs 68**. Added the overall R9 figure (160/193) and the weak tabs, so "20 of 22" is no longer read as universal (0, 4.2).
5. **Audit N6** "bilateral before single-leg" was presented as OBSERVED; it holds in only 12/21 sessions. Split it out as WEAK (3.3).
6. **Sheet25** was listed as an "all four patterns" leg day. It has no unilateral hip-dominant header (2.7, 4.1).
7. **MM athletic Mid/Advanced descriptions** merged days inaccurately. M1 orders bench before deadlift; A1 and A3 have no upper-body lift; M2 and A4 have no upper compound; A3 was missing. Table rewritten; G8 and the lower-pairing matrix narrowed to the days that actually fit (2.3, 4.1, 4.3).
8. **Starting S1** has 3 jumps, not "2 plyos" (8.2).
9. **BASEBALL Thursday 'strength'** was presented as OBSERVED. Thursday is never tagged; 16/22 Thursday main lifts are strength lifts, so this is INFERRED (2.4). Also listed exactly which weeks carry the OPTIONAL PIECE OLY.
10. **BASEBALL "DB-only pressing"** was wrong. The bench is DB-only, but 'barbell press' (2 rows) and 'barbell overhead strict press' (1 row) exist (8.2, JSON sport dial).
11. **Buy-out dose list (JSON)** included 'Fast run/ walk back or 3 min walk/rest' (DI29, DL47, CC48). That is a Part A 'LOWER ballistics/plyo' sprint, not a Part E buy-out. Removed and noted. The weekly dose was restated as a mean with a 0-5 range, and the generator rule changed from "every session" to "2-4 days a week", which is what the coach does (6.6, 6.8).
12. **"All buy-outs in 'SPEED POWER'"** softened: 10-12 cal bouts overlap 'SPEED STRENGTH & POWER' '0-12 Secs'.
13. **Week shape "OBSERVED in ... MM UL ... and BASEBALL"** was overstated. The UL week is inferred from the A5 note, and BASEBALL has no optional blocks. The 5-day optional reading is marked INFERRED (0).
14. **CrossFit:** 'SAT aerobic and WOD at levels 3-4' corrected (Saturday WOD only in MAY). "WODs and skill on upper days" qualified (they spread to Mon/Thu at WOD levels 3-4). Class "WED/SAT WOD only" marked INFERRED (the columns are blank). "Class tests in week 8" marked INFERRED (the cell holds '5') (2.5, 6.11, JSON OT17/OT18/hybrid 6-day).
15. **HYBRID 'AMRAP' 12->20** is a header row (D70). Its link to the Saturday circuit is now marked INFERRED. "Wed and Sun off" changed to "not listed". The A/C colour mapping for HYBRID and boxing conditioning is marked INFERRED (2.6, 5, 6.6).
16. **"Consecutive days never repeat the same lower dominance"** was too strong. HYBRID runs hip-dominant Thu ('DEADLIFTS') then Fri ('uni RDL...') (6.4).
17. **BYOP conditioning "only on Wed/Sat optional blocks"** ignored BOOTCAMP 2, which has 'Cardio' in every session (6.6).
18. **No-equipment overclaim:** the BOOTCAMP 2 menus do **not** have bodyweight options "in every slot". AS (bicep), AT (tricep) and AH (side raises) are all equipment-based, except 'TRX Bicep Curls'. A substitution row was added for those slots (8.6, JSON).
19. **Session sizes:** set counts for empty templates (3 DAY BUILDER, BYOP PPL, BOOTCAMP 1/2, optional day) are now marked "(assumed)". MM athletic movements corrected to 4-13 (excluding throws) (7.1, JSON `session_budget`).
20. **Time model:** the ALL ABOUT SQUATS strength column is 2-5 reps, not 3-6. The BASEBALL "73 with OLY" calibration is flagged hypothetical (B2 'WK 1' has no OLY) (7.2).
21. **Evidence tags in section 8:** aesthetics 3-day (weekday mapping and "45-min version" INFERRED), athletic 3-day (weekday placement INFERRED), strength 3-day (the class trio sits Mon/Tue/Thu; Mon/Wed/Fri INFERRED), fat-loss 6-day (weekday mapping INFERRED), hybrid 6-day (Sunday not listed).
22. **Smaller fixes:** OT01 Day 2 now lists 'Staggered Stance DL w/ DB ' (sets 'CHOOSE 👇'); BOOTCAMP 1 "empty" except E30 'Leg extensions'; FAT BURN deadlift labels quoted verbatim ('DEALIFTS'); MM PPL legs "copied verbatim" corrected (novice reps differ); boxing Friday weeks 1-2 has no curls or skull crushers; Sheet24 credited to 'CHRIS HINSHAW' (external plan); tier 7 "every template" now names its exceptions; OT19 vs OT20 press rotation separated; OT08 frequency evidence marked as depending on an inferred week.

### Science checks

- Simão 2012, Schoenfeld 2016/2017, Robbins 2010, Weakley 2017, Iversen 2021, Seitz & Haff 2016 and Haff & Triplett 2016: citations are plausible as given.
- **Frequency claim:** the "volume-equated frequency matters little" half needs Schoenfeld, Grgic & Krieger 2019, which is now added. "Consistent with the coach raising sets per slot when frequency drops" was unsupported (no sheet shows it) and is now marked INFERRED.
- **Israetel citation fixed:** *Scientific Principles of Hypertrophy Training* is by Israetel, Hoffmann, Davis & Feather (2021). Israetel, Hoffmann & Smith wrote the separate strength-training book.
- **Per-session ceiling:** "6-10 hard sets per muscle per session" is a weak practitioner heuristic. Schoenfeld 2017 is a weekly dose-response and does not support it; reworded.
- **Contrast training:** the PAPE literature favours several minutes of rest, but the coach writes 'directly into' / 'immediately into'. The doc now keeps the coach's format, flags the gap, and adds open question 23 instead of turning his practice into the textbook version.
- **NSCA plyometric guidance** in the JSON sport dial (80-100 / 100-120 / 120-140 contacts per session) matches the NSCA per-session recommendation. It was left unchanged.

---

## Verification log - v0 pass 2 (history)

A second adversarial fact-check ran on 2026-10-08, after the pass above. Every OBSERVED claim was re-read against `dumps/BYOP` and `dumps/MASTER_MODEL`. Grids were rebuilt from the dumps with python. Sheet visibility was re-checked in `raw/*.xlsx` (openpyxl, read-only), and `analysis/equipment/ordering_audit.md` was cross-read. No Google Sheet was opened. `05_templates.json` was patched to match; its `_meta.verification_pass_2.changes` lists the same items.

### Numbers recomputed independently (python on the dump files)

| Claim | Recomputed | Result |
|---|---|---|
| AESTHETICS Day 1 = 7 exercises / 19 sets | 7 / 19 | confirmed |
| JUSTICE LEAGUE Monday = 10 exercises / 20 sets (10 + 10) | 10 / 20 (10 athletic + 10 resistance) | confirmed |
| FAT BURN weekly sets 60, 60, 64, 70; 14-18 per session | sessions WK1 15/15/15/15, WK2 14/16/14/16, WK3 15/17/15/17, WK4 17/18/17/18 | confirmed |
| STRENGTH-8 56 sets/week; CONJUGATE 60 | 14+15+16+11 = 56; 15+16+16+13 = 60 | confirmed (per-day values added to 7.1) |
| BASEBALL buy-out block means 3.3 / 3.3 / 3.8 | weekly bouts B1 0,5,2,5,5,3,3,(0); B2 4,2,4,3,3,3,4,(deload 0); B3 3,4,3,4,5,3,5,3 -> 23/7, 23/7, 30/8 | confirmed; per-week list added |
| BASEBALL Part C 2nd row 'Superset - same reps' 19 / 'max reps' 5 | 19 / 5, **plus 'heavy Max reps' 6** | **incomplete -> fixed** |
| BASEBALL day tags 'Speed' / 'strength' / 'speed' | 33 tag cells in only 11 of 24 grids | **coverage added** |
| BASEBALL calf slot hops 16 of 39 (label-based) | 13 'calfs' + 3 'calf' rows = 16 hops; 40 filled rows minus 1 misaligned (P37 'Bicep hammer Curls') = 39 | confirmed |
| BASEBALL exercises per session median 9 | own rough grid parser: median 9 | confirmed |
| CrossFit aerobic sessions 2/2/3/4 at levels 1-4 | MAR/JUN 2; APR/JUL/OCT 2; MAY/AUG/NOV 3; SEPT/DEC 4 | confirmed |
| CrossFit "WODs/skill on upper days, spreading to Mon/Thu at WOD levels 3-4 (SEPT, NOV, DEC, JAN, MAY)" | AUG (level 3) Tue/Fri only; NOV Mon/Tue/Fri; MAY Mon/Thu/Sat; JAN has no WOD level; skill unrelated to WOD level | **wrong -> rewritten** |
| FAT BURN "all four vectors on every upper day" | true vertical press in 2 of 8 upper sessions; none in WK2-3 | **wrong -> fixed** |
| Boxing week 7: eleven rows 3 -> 2 sets | 11 | confirmed |
| MM athletic 89 -> 72 -> 59 | same under the stated convention; Advanced = 61 if A4's '&' cell is split like M1's | sensitivity noted |

### Corrections made

1. **Session order: core primer vs Olympic lift.** The master order put the core primer after TRIPLE EXTENSION/OLY (tier "4b"). No observed session does that. BASEBALL Part B always sits above the 'OPTIONAL PIECE' 'OLY' row (CI31 -> CI33 -> CI34; BC49 -> BC51 -> BC52). MM M2/A3/A4 and boxing weeks 3-8 Thursday put core before the clean/snatch, and A1/M3 put it even before the jumps. The tier is renamed 3b and moved before tier 4 in section 0, 3.1, 6.9, the 2-day athletic template (8.2), JSON `master_order_string`/`tiers` and the athletic 2-day stations.
2. **Tier 5 "BYOP resistance slots 1-2 always carry the horizontal vector"** was false. BOOTCAMP 1 Tue/Fri slot 2 is 'Vertical Pull' (D11/D32), with 'Horizontal Push' 4th. Section 3.2 had BOOTCAMP 1 at "4/4, none"; corrected to 2/4. The audit (R9, Q7) already flagged it.
3. **Upper pairing "20 of 22"** missed HYBRID Saturday. That is a knee day, its label row C101 reads 'VEr pull/ hor push', and its circuit carries push-ups or DB bench in weeks 1, 3, 5, 7. The count is now 20 of 23, explicitly day-level, with the BOOTCAMP 1 slot-level failure noted (0, 4.2, open question 2, JSON).
4. **"All four lower patterns on every lower day" for AESTHETICS-12 (OT22)** was false. Friday has 'DEADLIFTS' only in week 1; weeks 2-12 have no bilateral hinge. A matrix row was added, and 2.6, 4.1, 4.3 G5 and 6.2 were qualified.
5. **Vertical press.** "All four vectors" for FAT BURN (6.1) and the G4 grammar was false: FAT BURN WK2-3 and AESTHETICS-8 weeks 2, 3, 6, 7 have no vertical press ('UPRIGHT ROWS' / 'SIDE RAISES' instead; upright rows are filed under the Focus list AZ52-AZ53). Exemptions were added (2.2, 2.6, 4.3, 6.1, 6.2). The INFERRED "V press >= 1x" default was softened, and open question 24 added.
6. **Jump/medball dominance theme.** "Jump day = hip, medball day = knee" (4.1, G8) holds only in MID/ADVANCED. In STARTING, S1 (jump) is knee and S2 (medball) is hip.
7. **CONJUGATE "no sets ladder"** was false. E9:L10 hold a two-row ladder equal to STRENGTH-8 rows 5-6. Other differences were listed (Saturday 'the work' 5 sets) (2.6, JSON OT24).
8. **CrossFit Saturday** "aerobic/WOD at levels 3-4" in 8.5 and the JSON hybrid 4-day layout was corrected: Saturday WOD only in MAY. WOD and skill days are now listed by month (2.5, 6.4, JSON OT17 + hybrid 4; Thursday skill/WOD slots added). Open question 25 added.
9. **Myo set "only on the last 1-2 exercises, machine or isolation"** omitted 'ALL ABOUT SQUATS' A27 3 x '15/5/5/5/5/5' '**MYO SET - ADVANCED' in the free-weight squat column (5, JSON).
10. **BASEBALL bench.** "one unnamed 'fast banded assisted bench press'" -> two rows (DL52, CC53) (8.2, JSON).
11. **BASEBALL block endings / 8-week rule.** Block 3 (in-season) has no deload or recovery week. HYBRID (8 weeks) has no deload/test week. Boxing week 7 is a mini-deload and week 8 a peak. Section 6.11 and JSON `deload_test_architecture` were qualified. JSON OT16 in-season dose "main lifts 4x10" corrected: 4 x 8 in weeks 1-2, '10/10/8/8' in week 3, 4 x 10 in weeks 4-8.
12. **'THURSDAY' label.** BYOP ATHLETIC and JUSTICE LEAGUE leave B30:B39 blank; only the hidden NO ACCESS copy writes 'THURSDAY'. Noted in 0, 2.1 and JSON OT04/OT04b. OT04c's only filled cells ('Leg extensions' E12/E39) added.
13. **Optional-block rule** "never holds bilateral heavy lifts" is labelled as the generator's own choice. The coach's Focus menu offers 'Back squats' AZ12, 'Zercher squats' AZ11, 'Leg press' AZ10, 'barbell overhead press' AZ46 (6.5, JSON).
14. **Isolation-follows-compound** now cites the BOOTCAMP 2 inverse ('Bicep' on press day 2A, 'Tricep' on pull day 3A) and the full N1 counts (3.3, JSON).
15. **Evidence tags tightened:** strength 4-day Tue/Fri/Sun and HYBRID Wed/Sun are "not listed" (OFF INFERRED); fat-loss 5-day layout INFERRED; athletic 4-day `[ | ]` pairings INFERRED (BYOP lists straight slots); OT08's weekday layout INFERRED in 8.1; CrossFit "WODs carry the rest" INFERRED; JSON boxing A/C colours INFERRED; JSON CrossFit "JANUARY Wednesday is the event start" changed to INFERRED.
16. **Smaller fixes:**
    - STRENGTH "4 slots (3 on DE upper)" applies to STRENGTH-8/CONJUGATE only; STRENGTH-12 DE upper has 4, and its accessory sets are unwritten.
    - OT19 upper-day pull is not a strict H/V alternation.
    - AESTHETICS-8 lead lift alternates in weeks 1-6 only.
    - A1 puts rockers before the jump; A2 has no cross connects.
    - PPL push puts 'Vertical Push' before 'Incline', and the 'Flies' dropdown is the whole AD list.
    - 'Reverse Lunges (Bodyweight or DBs)' quoted in full.
    - Section 10 #2: arms removed from the main days, not moved to optional days.
17. **Missed items added:**
    - 4 TRACKS A1 '8 WEEKS OF 3 TRACKS PROGRAMMING EXAMPLE - ONGOING TRAINING' and A2 '*This is what I sell online to my athletes...' (2.6).
    - MM athletic A41:A45 'First 8 weeks (8wk1) adaptation focus' (2.3).
    - JSON `tier_note`: bucket_ids put RP_VPUSH/RP_VPULL at tier 5 while `tiers[]` puts the second upper vector at tier 6; the sort must use slot position.

### Science checks (pass 2)

- All ten references were re-checked for author, year, journal and pages, from knowledge and not against the full texts. They are correct as listed, including Weakley et al. 2017 *EJAP* 117:1877-1889 and Iversen et al. 2021 *Sports Med* 51:2079-2095.
- **Seitz & Haff 2016** use the term "post-activation potentiation", not PAPE. Their meta-analysis favoured longer recovery (about 5-7 min) over short recovery. The text now says so. It also says that immediate-transition French-contrast complexes are an established coaching method, so the coach's format is kept and is not called an error.
- Frequency (Schoenfeld 2016/2019), exercise order (Simão 2012), paired sets (Robbins 2010, Weakley 2017, Iversen 2021) and the NSCA plyometric contact ranges were re-read in context. No other change was needed.

---

## Verification log - v1 (2026-10-08)

- `coach_answers_full.md` was read in full; every answer listed in the task (ORD-01..11, ATH-11, UNI-06/09/11, PER-04, VOL-07/08/16/17, PRG-02/03/05/06/07, FIX-03, ATH-13) plus the related answers that touch session architecture (ATH-01/02/04/05/06/07/09/10/12, CAT-08/09/10/11/13, EQ-01/03/06/07/08/10/11/12/14, LIB-06/07/09/13/16/19/22, PER-01/02/03/05/07/08, PRG-04/09/11, UNI-01/02/03/05/08/10/12, VOL-03/05/06/09/10/11/13/14/15) was applied and cited.
- The 30 split templates and their variants were rebuilt by a python script (project venv) that also checks them: weekly exposures of the 8 primary patterns, slot-level pairing (UNI-11), axial exposures (PER-04), core block first (ATH-11), horizontal before vertical unless the vertical lift is the work (ORD-01, ORD-02), Olympic before the work (ORD-03), the station cap by length (VOL-08) and a time estimate (UNI-09, PRG-03). Result: no failures; the only flags are the documented observed-design exemptions in 8.7.
- Scan for retired ideas: no band or variable-resistance option in any generator pool (verbatim sheet quotes that contain 'banded' remain as evidence only); no size-based 3%/7% rule; helpers 0.25; no "core after the power block" default; no pulldown-first default; no hack-squat ranking; 'JUSTICE LEAGUE' appears only as a cited tab name with its generic name.
- OBSERVED content (sections 2, 3.2, 4.3, 5.4, 6.1, 6.8, 6.9, 7.3) is unchanged from the v0 fact-checks below, except for added v1 notes.

---

## v1 verification log

*Adversarial check of the v1 update to this file and `05_templates.json`, run on 2026-10-08 after the v1 log above. `coach_answers_full.md` and `coach_answers.md` were re-read in full. Each coach answer that touches session or week architecture was checked against the rules, the tables, the worked templates, the JSON stations and the recomputed checks, not only against the changelog. Fixes were made in place. The JSON template fixes were made by rebuilding the templates with a patched copy of the v1 build script and re-running its checks; nothing was hand-typed into the check tables. No Google Sheet was opened.*

### Coach answers checked

| Area | Answers | Result |
|---|---|---|
| Order | ORD-01, ORD-02, ORD-03, ORD-04, ORD-08, ORD-09, ATH-11, CAT-08 | Reflected in rules, templates and JSON. Core first for everyone and movable, warm-up always, row before pulldown, the work first, power before strength, calves / side raises first only for a priority. |
| Pairing | UNI-11, ORD-06, UNI-06 | Reflected at slot level. BOOTCAMP 1 Tue/Fri corrected. Same pattern by goal, cross pattern for bootcamp, fat loss and athletes. **Two templates still put two lower compounds back to back in a mixed session; fixed (items 6-7).** |
| Supersets, contrast, circuits | ORD-05, ATH-12, PRG-03, PRG-11 | Reflected (four use cases; L2+ off-season contrast with no rest; 5-7 stations x 3-5 rounds x 30-50 s in 35-45 min; circuits are finishers). |
| Session size | UNI-09, VOL-08, VOL-16, VOL-17 | Lengths and caps reflected. **VOL-17 was only partly applied: calves were missing or 90+ only on some leg days, in-season calves were 2 sets, and several weeks had no rear-delt sets at their default length; fixed (items 1-4).** |
| Week | PER-04, EQ-11, EQ-03, PER-02, PER-03, PRG-02, ORD-10, ORD-11, PER-08, UNI-10 | Axial budget (at most 1 squat + 1 hinge) holds in every template. Belt squat and leg press are the second squat exposure. Optional days are separate by default. **PER-08 in-season wording fixed (item 5).** |
| Aerobic | ATH-07, EQ-14, ORD-09 | Rule stated, **but many week layouts hold fewer sessions than the target (aesthetics 5-day holds 1 vs 3-4; fat-loss 6-day and PPL x2 hold 0) with no note; fixed (item 8).** |
| Volume hooks | VOL-05, VOL-06, VOL-07, VOL-09, VOL-10, UNI-01, LIB-16, UNI-05 | Reflected: 3/5/7% chosen by the person's state; 2/2/2 -> 4/3/3 add order; helpers 0.25; dips 0.5/0.5; 10/10 = 1 set; athletic patterns 0. |
| Athletes | ATH-01, ATH-02, ATH-04, ATH-05, ATH-06, ATH-08, ATH-09, ATH-10, ATH-13, CAT-10, CAT-11, CAT-13, UNI-02, UNI-03, UNI-12, PRG-04, PRG-09 | Reflected in the sport dial and templates. **EQ-03 / ATH-09 limits (older clients: few plyos; never depth jumps) were missing from the plyo stations; added (item 9).** |
| Plan shapes, deload, tests | PER-01, PER-05, PER-07 | Reflected in 6.12 and the JSON `v1_rule`. **But the JSON block was still headed `status: OBSERVED`, with the observed 8- and 12-week endings as bare keys next to the v1 rule; fixed (item 10).** |
| Equipment | EQ-01, EQ-02, EQ-07, EQ-08, EQ-10, EQ-12, EQ-06, LIB-09 | No band or variable-resistance option is in any generator pool. **Five observed templates quoted banded items without saying they are out; v1 notes added (item 11).** |
| Levels, names, dose notation | PRG-05, PRG-06, PRG-07, FIX-03, CAT-05, CAT-06, VOL-11, VOL-15 | Reflected. |
| Generator | GEN-01, GEN-02, GEN-04, GEN-05, GEN-08, GEN-03 | Reflected, **except the GEN-03 / GEN-05 conflict on tracking, which step 9 ignored; fixed (item 12).** |

### Retired ideas: scan of both files (markdown and every JSON string)

| Retired idea | Result |
|---|---|
| Size-based 3/5/7% (big = 3%, small = 7%) | Gone. Only "not by muscle size" (VOL-05) remains. |
| 0.5 helper credit | Gone. Helpers 0.25; the only 0.5 is the dips 0.5/0.5 rule (LIB-16). |
| Band / chain / weight-releaser substitutes | None in any generator pool. Banded wording survives only in verbatim OBSERVED quotes, and each of those templates now says the item is out (EQ-01, EQ-12). |
| Plyo zones as a fixed exercise property | Gone. The method progression is described as "not a zone" (CAT-10, CAT-11). |
| Core after the power block as the default | Gone. Core first in every family; v0 placements are labelled superseded. |
| Sex-based rules | None. "No sex-based rules" (ATH-09); no sex field in the inputs (GEN-02). |
| 'Justice League' as a program name | Only as a cited tab name. The generator name is *Athletic Performance - Non-Competitive* (ATH-13, FIX-03). |
| Hack squat ranked last | Gone. Machines are not ranked (EQ-11). Hack squat / pendulum stay out of the non-axial squat pool only because of shoulder-pad loading (INFERRED, open question 11.2-1). |
| 6-week = 5 weeks + deload (and 8 = 7 + 1, 12 = 6 + 1 + 5) | Gone from the rules. Kept only as OBSERVED tab endings, now explicitly labelled evidence-only, with the v0 rules listed as retired (JSON `deload_test_architecture.retired_v0_rules`). |

### Problems found and fixed

1. **Calves on every leg day (COACH-ANSWER VOL-17).** Three gaps:
   - The hybrid / CrossFit leg days had calves only at 90+ min.
   - The hybrid 5-day Saturday leg day had none.
   - The BASEBALL Parts variant had none on its Tue/Fri leg days. The sheet has no calf slot on those days, although the 2.4 note already said calves were added.

   All three now carry 3 sets at every length. In hybrid sessions under 75 min the calf sets go in the strength lift's rest period, the way the HYBRID tab does its accessories (INFERRED; question 11.2-13).
2. **In-season calves were 2 sets** while the station note said 3. Now 3 (VOL-17).
3. **Rear delts every week (COACH-ANSWER VOL-17).** At their default lengths several weeks had no rear-delt station:
   - athletic 2/4/5/6-day and the same-pattern variant at 60 min (the non-competitive default);
   - the in-season variant;
   - every hybrid week;
   - fat-loss and no-equipment 2/4-day at 45 min;
   - aesthetics at 45 min.

   Fixes:
   - athletic knee + pull days: rear delt from 60 min;
   - aesthetics A days and 3-day Day C, fat-loss and no-equipment A days: rear delt from 45 min;
   - in-season A day: rear delt added;
   - hybrid: one station on HY2 and on the class squat day.

   Cut orders now say calves and the week's rear-delt station are never cut.
4. **Cut / add orders and the stations-by-length table** listed "rear delt" as an early cut for athletes. Updated in 7.5, 7.6 and the JSON `session_length_model`.
5. **In-season slot (COACH-ANSWER PER-08).** The note read "others: jumps". It now reads: speed athletes keep sprints; other athletes keep strength maintenance (the slot may be dropped) or jumps.
6. **Athletic 3-day S3 at 60 min** dropped its press, which put the snatch-grip deadlift and the walking lunges back to back. That is the bleed-over UNI-11 avoids. The press is now kept at every length (~63 min).
7. **Strength 2-day FB_ME** ran hinge accessory -> single-leg hinge back to back. The hinge accessory now comes before the upper press, so lower and upper alternate (INFERRED order).
8. **Aerobic sessions (COACH-ANSWER ATH-07).** Every JSON template and variant now has an `aerobic_ATH07` block:
   - sessions in the week layout (an optional day counts 1);
   - the population target;
   - add-ons still needed;
   - how to add them (separate day if a full OFF day remains, otherwise an add-on after lifting, or long walks for bodybuilders).

   Pointers were added in 6.7, 8.1 and 8.4.
9. **Older / injured clients on athletic plyo stations (COACH-ANSWER ATH-09, EQ-03).** Every plyo station now says older clients get few plyos unless they ask, and older / injured / high-volume clients never do depth jumps. The S1 depth-jump station names a substitute.
10. **JSON `rules.deload_test_architecture`.** The status now says the v1 rule governs and the observed 8/12-week endings are evidence only. A `retired_v0_rules` entry lists the retired 8 = 7 + 1, 12 = 6 + 1 + 5 and 6 = 5 + 1 shapes (PER-01).
11. **Observed-template v1 notes.**
    - Notes added where they were missing: OT04c, OT07 (PRG-01 / FIX-01 skipped), OT09, OT14, OT17, OT18, OT20.
    - Banded items explicitly retired: OT12 banded pulldowns, OT15 reverse-banded squirrel jumps, OT16 banded deadlifts / bench / hops, OT19 'FAST BANDED BENCH PRESS', OT25 reverse-banded squat jumps (EQ-01, EQ-12).
12. **GEN-03 vs GEN-05.** Step 9 assumed every client logs effort. It now adjusts from logs only when the user chooses to log, and otherwise follows the preset progression (PROPOSED - PENDING COACH APPROVAL). Asked as question 11.2-14.
13. **Smaller fixes.**
    - The BASEBALL Parts Tue OLY is marked (75+), as in the JSON.
    - The isolation-follows-compound rule notes the hybrid rear-delt placement.
    - Changelog row 17 is updated.
    - Question 11.2-9 now notes the accessory / survival adjacency that the INFERRED conjugate re-order creates.

### Checks recomputed (python, project venv)

- Templates rebuilt with the v1 build logic plus the fixes above. The checks were then re-run for every template and variant at each family's default lengths: pattern exposures, axial budget, slot pairing, core first, H before V, Olympic before the work, the cap and the time estimate. All results are "ok" or a documented observed-design exemption. The 8.7 table was regenerated from the JSON; a renderer that reproduced the previous table exactly was used, so only the changed rows moved.
- An independent audit script also checked:
  - calves at 3 sets on every leg day;
  - at least one rear-delt station a week;
  - no two lower compounds back to back in a mixed session;
  - no medball in aesthetics;
  - no band text in any station.

  Its only remaining flag is the conjugate ME lower day: the max-effort lower day is lower-dominant, the OBSERVED design already puts squat and hinge back to back, and question 11.2-9 is open. Circuit calf stations are dosed in rounds (3-5 x 30-50 s), not sets, by design (PRG-03).
- Time impact of the fixes:
  - athletic 60-min knee days ~64 min (cap tolerance 65);
  - BASEBALL Parts Tue/Fri ~64 / ~78 min at 60 / 90;
  - fat-loss / no-equipment A days at 45 min ~46 min;
  - hybrid HY2 ~60 min and the class squat day ~56 min at 60;
  - all within the existing 8% tolerance.

### Not changed (flagged)

- Strength plans at 60 min (not a default length) have no rear-delt station on the 2-day FB_ME. The default is 90 min.
- GEN-01 (full Spanish toggle): this file carries Spanish names for programs, optional days and aerobic days only. Day-type labels are not yet translated; that belongs to the generator spec.
- Backups of both files from before this check are in the session scratchpad (`05_templates.pre_v1verify.json`, `05_session_architecture.pre_v1verify.md`).

---

## v1 verification log (pass 2)

*This was a second adversarial check of the v1 update to this file and to `05_templates.json`, run on 2026-10-08 after the first v1 verification log above. Both `coach_answers_full.md` and `coach_answers.md` were re-read in full. Every answer that touches session or week architecture was checked against the rules, the tables, the worked templates, the JSON stations and the recomputed checks, not only against the changelogs.*

*The JSON templates were fixed by rebuilding them with a patched copy of the v1 build script, `build_templates_v1c.py`. That script reproduces the previously installed templates exactly before the patches are applied. It was then merged into the file, and all checks were re-run. Non-template JSON text was patched with python. Nothing was hand-typed into a check table, and no Google Sheet was opened.*

### Coach answers checked

| Area | Answers | Result |
|---|---|---|
| Order | ORD-01, ORD-02, ORD-03, ORD-04, ORD-08, ORD-09, ATH-11, CAT-08, LIB-21, LIB-05 | Rules, templates and JSON already reflected these, with three exceptions, now fixed: **LIB-21 (fixed speed-session order) and LIB-05 (one plyo from each MODERATE track) were missing from the ordering rules** (fix 6); **OT14, OT21 and OT22 quoted pulldown-first orders without a v1 note** (fix 7). |
| Pairing | UNI-11, ORD-06, UNI-06 | Pairing was right at slot level. **The same-pattern athletic variant was tied only to size sports, an INFERRED reading. The coach's own trigger is "a high-level athlete... demanding more of their muscles"** (fix 4). |
| Supersets, contrast, circuits | ORD-05, ATH-12, PRG-03, PRG-11 | Reflected. |
| Session size | UNI-09, VOL-08, VOL-16, VOL-17 | Lengths and caps were reflected. **VOL-17 "about 2 core exercises" was not met in the BASEBALL Parts days (1 core exercise) or in the hybrid WOD-only class (1)** (fix 2). |
| Week | PER-04, EQ-11, EQ-03, PER-02, PER-03, PRG-02, ORD-10, ORD-11, PER-08, UNI-10 | Reflected. The axial budget holds in every template. |
| Aerobic | ATH-07, EQ-14, ORD-09 | **The JSON gave aesthetics clients two targets: "general physique 3 / bodybuilder 4". The 0 table, 6.7, `rules.conditioning_days` and bucket COND_AEROBIC all say "4 aesthetics / bodybuilders"** (fix 3). |
| Athletes | ATH-01, ATH-02, ATH-03, ATH-04, ATH-05, ATH-06, ATH-08, ATH-09, ATH-10, ATH-12, ATH-13, CAT-10, CAT-11, CAT-13, UNI-02, UNI-03, UNI-12, PRG-04, PRG-09 | Three gaps, now fixed:<br>- **ATH-10 was broken in the BASEBALL Parts variant: at 60 min its week had no Olympic work** (fix 1).<br>- **ATH-06 / changelog row 31 ("COD stays for every athlete") was not true in the templates. No 60-min athletic week (the non-competitive default) and no 3-day week at any length had a COD station** (fix 5).<br>- **UNI-12 frontal / transverse work was missing for MMA** (fix 8). |
| Plan shapes, deload, tests | PER-01, PER-05, PER-07 | Reflected. **The JSON deload `architecture_rule` still read as a rule ("conditioning and Oly removed"), but dropping the Olympic piece is OBSERVED, not PER-05** (fix 9). |
| Equipment | EQ-01, EQ-02, EQ-06, EQ-07, EQ-08, EQ-10, EQ-11, EQ-12, LIB-09 | No band or variable-resistance option is in any generator pool. **Four banded verbatims had no v1 note: OT11 'band row', JSON superset types 6-7, the STRENGTH-8 'FAST BANDED BENCH PRESS' rotation row, and the BASEBALL pressing profile** (fix 8). |
| Levels, names, notation | PRG-05, PRG-06, PRG-07, FIX-03, ATH-13, CAT-04, CAT-05, CAT-06, VOL-11, VOL-15 | Reflected. **The sport-dial source still read "renamed 'JUSTICE LEAGUE'"** (fix 9). Section 1 now says what 'zone' means (Davidson rotation-bias zones; not a session variable; never for plyos). |
| Volume hooks | VOL-04, VOL-05, VOL-06, VOL-07, VOL-09, VOL-10, UNI-01, UNI-05, LIB-16 | Reflected: rate by the person's state; the 2/2/2 -> 4/3/3 add order; helpers 0.25; dips 0.5/0.5; 10/10 = 1 set; athletic patterns 0. |
| Generator | GEN-01, GEN-02, GEN-03, GEN-04, GEN-05, GEN-08 | Reflected. The GEN-03 / GEN-05 conflict is handled as PROPOSED. |

### Retired ideas: scan of both files (the markdown above the v0 history logs, and every JSON string)

| Retired idea | Result |
|---|---|
| Size-based 3/5/7% | Gone. The only rate rule is "chosen by the person's state, not by muscle size" (VOL-05). |
| 0.5 helper credit | Gone. Helpers are credited 0.25. The only 0.5 values are the dips 0.5/0.5 rule, tier and setup numbers. |
| Band / chain / weight-releaser substitutes | None in any generator pool. Every remaining "band" string is an OBSERVED verbatim with a v1 "out" note, or a "no bands" rule. The only "chain" hit is "anterior chain". |
| Plyo zones as a fixed exercise property | Gone. The only hit is "not a plyo zone". |
| Core after the power block as the default | Gone. The one JSON hit cites it as the v0 rule the coach marked NOT RIGHT. |
| Sex-based rules | None. The hits are "no sex-based rules" and "no sex field". |
| Justice League as a program name | It appears only as a cited tab name or as evidence. The generator name is *Athletic Performance - Non-Competitive*. |
| Hack squat ranked last | Gone. |
| 6-week = 5 + deload | The only hit is the JSON `retired_v0_rules` entry. |

### Problems found and fixed

1. **ATH-10, Olympic work in the BASEBALL Parts week.**
   - Problem: the OLY piece was set to 75+ min on all four days, so a 60-min week had no Olympic lift.
   - Fix: Mon/Thu now keep it at every length. It runs at 2 sets below 90 min (L1 variants allowed) and at the observed 4 sets @ 75->90% at 90 min. Tue/Fri stay at 75+ as observed.
   - Time: Mon/Thu run ~64.5 min at 60 and ~74 at 90.
2. **VOL-17, about 2 core exercises.**
   - The BASEBALL Parts days now add a second core exercise from 75 min (the other region of Part B, CAT-08). The single observed Part B slot stays below 75 min.
   - The hybrid 6-day WOD-only class now has 2 core exercises.
3. **ATH-07, aerobic target for aesthetics.**
   - Every aesthetics `aerobic_ATH07` block now says 4 + long walks for the whole family, and its add-on count was recomputed. The family notes and 8.1 were updated.
   - The earlier split is withdrawn. Open question 11.2-11 now asks whether general physique clients are meant.
4. **UNI-06, same-pattern athletes.**
   - Updated: `use_when`, the pairing rules (JSON `rules.pairing` and md 4.2 / 4.6), the sport dial, changelog row 5, and question 11.2-10.
   - The variant now covers high-level athletes who need more stimulus (the coach's words). The size-sport list is labelled INFERRED.
5. **ATH-06, COD in every athletic week.**
   - Hip (B) days now carry COD from 60 min, and knee (A) days from 75 min.
   - The 3-day S1 gains a COD station from 60 min. The OBSERVED STARTING sheet has none.
   - Every athletic week from 60 min now has COD. B days at 60 min run ~64 min, which is within tolerance.
   - The day placement is INFERRED. New question 11.2-15 asks about BASEBALL and in-season weeks, which still have no COD.
6. **LIB-21 / LIB-05.**
   - Added to 3.3, 3.5, `rules.ordering.within_tier_rules` and bucket AP_SPRINT: the fixed speed-session order (squirrel jumps -> MACH drills / acceleration -> max velocity) and "one plyo from each MODERATE track".
7. **ORD-01 notes.** OT14 (boxing weeks 1-2), OT21 (AESTHETICS-8) and OT22 (AESTHETICS-12 pull day) now say that the pulldown-first order is not followed.
8. **EQ-01 / EQ-12 and UNI-12.**
   - v1 "out" notes were added to OT11 'band row', the boxing 'REVERSE BANDED' squirrel jumps (md 2.3), JSON superset types 6-7, the STRENGTH-8 rotation row and the BASEBALL pressing profile.
   - The MMA profile and the football / soccer / tennis row now carry frontal / transverse unilateral work.
9. **Wording.**
   - The sport-dial JUSTICE LEAGUE source was clarified.
   - The deload `architecture_rule` is labelled as the OBSERVED v0 reading under the PER-05 `v1_rule`.
   - The RP_BHD non-axial pool now lists the KB swing, as the rules and 6.4 do.
   - The v0 INFERRED "grip / erectors" pairing rationale is marked superseded by the coach's UNI-11 reason.
   - Changelog rows 26, 27, 31 and 36 were updated ('strap rotating in/out' removed, LIB-09).
   - 7.5 now gives the athletic 60/75-min content with COD.
   - "Still pending" lists the new INFERRED items.

### Checks recomputed (python, project venv)

- **Rebuild check.** `build_templates_v1c.py` reproduces the previously installed templates before its patches. The only differences were one evidence string and the separately merged sport dial, and both were preserved. After the patches, the installed templates equal the rebuilt ones.
- **Build checks.** These were re-run for every template and variant at the default lengths: exposures, axial budget, slot pairing, core first, H before V, Olympic before the work, caps and time.
  - Result: "ok", or a documented observed-design exemption only.
  - The 8.7 table was regenerated from the JSON and matches it row for row. Changed rows: athletic 2/3/4/5/6-day and the same-pattern variant at 60 min (8-9 stations, ~64 min), athletic 3-day at 90 min (up to 11 stations, ~84-88 min), BASEBALL Parts (5 stations, ~64 min at 60; ~74-81 min at 90), and the hybrid 6-day WOD days (~31 / ~37 min).
- **First-pass independent audit.** Re-run with unchanged results: calves at 3 sets on every leg day, a weekly rear-delt station, no medball in aesthetics, and no band text in any station. Its only flag is still the conjugate ME lower day (question 11.2-9).
- **New pass-2 audit.** It checks:
  - Olympic work in every athletic week at 60, 75 and 90 min (now passes everywhere);
  - COD in every athletic week (passes, except the in-season and BASEBALL Parts variants, which are flagged as question 11.2-15);
  - about 2 core exercises from 45 min (passes);
  - aesthetics aerobic target = 4 (passes);
  - no sex field (passes);
  - time per day at 45-90 min.
- **Time flags outside the default lengths.**
  - Aesthetics at 45 min: the 2-day, 3-day Day C, upper/lower and PPL x2 days run ~50-60 min. This is now stated in 7.5 and in the JSON `slots_by_length`, and the time-overflow rule plus the cut order handle it.
  - Strength 2-day at 60 min: ~72-75 min. 90 min is the strength default.

### Not changed (flagged)

- **Strength ME lower days.** These still put the non-axial accessory and the survival lunge back to back. The coach's sheet puts squat and hinge back to back instead. This stays as question 11.2-9.
- **In-season and BASEBALL Parts weeks.** These have no COD station: the sheet has none, and sport practice may cover it (question 11.2-15).
- **Davidson zones.** These are explained in section 1 but not used to order or pair stations, because the coach says the levels are still theoretical (CAT-05).
- **GEN-01 (Spanish toggle).** Unchanged from the first log: only program, optional-day and aerobic-day names carry Spanish.
- **Backups and scripts.** Backups of both files from before this pass are in the session scratchpad (`05_templates.pre_v1verify_pass2.json`, `05_session_architecture.pre_v1verify_pass2.md`). The patch scripts are there too (`build_templates_v1c.py`, `patch_v1verify_pass2.py`, `audit2.py`).

---

## v1.1 verification log (2026-10-08)

- `coach_answers_round2.md` was read in full before any edit; every round-2 answer that touches session or week architecture was applied and cited: R2-SES-01..06, R2-ATH-01..08, R2-LIB-01/02/03/04/05/06/07/08, LIB-10, LIB-12, R2-VOL-01..08, R2-PER-01..07, R2-GEN-02/04/05/06/07. Round-1 answers were re-read where round 2 refers to them (VOL-07, VOL-08, VOL-16, VOL-17, UNI-06, UNI-11, PRG-03, ATH-07, ATH-09, ATH-10, ATH-11, ATH-13, ORD-05, PER-01, PER-05).
- **Templates rebuilt by script.** `build_templates_v11.py` (a v1.1 copy of `build_templates_v1c.py`, which was first confirmed to reproduce the installed v1 templates exactly, except one evidence string) regenerated all 30 split templates and their variants; `merge_v11.py` installed them and updated every non-template section of the JSON (meta, bucket ids, notation, rules, session-length model, generator algorithm, open questions, program names, observed-template notes, sport dial). Nothing was hand-typed into a check table: 8.7 was rendered from the JSON (`table87_v11.py`).
- **Checks.** Every template and variant at its default lengths: per-muscle exercise count (R2-SES-05), calves, rear delts, cap (R2-SES-04 convention), pairing, order, axial budget, Olympic work, time at block start and late block. Result: no failure; only documented exemptions (conjugate four-role days, CrossFit class model, in-season minimal bilateral, strength 3-day press rotation). Session-length overruns are reported as "(longer day)", which R2-SES-05 accepts.
- **Independent audit** (`audit_v11.py`): 145 day types, 0 issues - no band option, no KB swing offered as hinge volume, no KB face pull as a vertical pull, the 60+ default on every plyo and Olympic station, no medball in aesthetics, core block at 2 sets, 2 calf exercises on every leg day, an Olympic station on every athletic lifting day.
- **Engine compatibility.** The Phase 0 fixture normaliser (`build_fixture_part3_templates.mjs > normTemplate`) loads all 30 templates and 1,821 stations without error; the `aerobic_ATH07` key is kept (now also `in_layout`), only known bucket ids are used, and new station fields (`group`, `circuit`, `older_default`, `older_option_warning`, `exercise_hint`, `superset_rule`) are additive.
- **Retired ideas re-scanned (v1.1):** KB swing as a hinge / glute exposure (gone from every pool; only ballistic notes remain); deload weeks inside a block (gone from the rules; OBSERVED tab endings kept as evidence); "1-2 exercises per muscle on full-body days" (never adopted; replaced by 2-4); lifestyle inputs (none in the algorithm); KB face pulls under vertical pull (moved to shoulder work); 'NO ACCESS' as pending (resolved, R2-LIB-08); the 21.6-mile run (removed).
- **Not changed (flagged):** the OBSERVED sections 2, 3.2, 4.3, 5.4, 6.8 and 7.3 keep their evidence (v1.1 notes added only); the conjugate four-role days keep their design (11.3-5); BASEBALL Parts Tue/Fri snatch stays 75+ as observed; the sport profiles and contact numbers per sport are owned by `04_profiles.json` v1.1; the stairway step sizes, floor and ceilings are owned by 06 / 12; the generator spec (`generator_spec_v1.json`) is updated by the master v1.1 step, not here.
- Backups of both files from before v1.1 and all scripts are in the session scratchpad (`v11_05/05_templates.pre_v11.json`, `v11_05/05_session_architecture.pre_v11.md`, `build_templates_v11.py`, `merge_v11.py`, `audit_v11.py`, `table87_v11.py`, `md_v11_part1-3.py`).

---

## v1.1 verification log (adversarial check)

*Adversarial check of the v1.1 round-2 update to this file and `05_templates.json`, run on 2026-10-08 after the v1.1 build log above. `coach_answers_round2.md` was re-read in full first. Each round-2 answer that touches sessions or weeks was checked in the rules, the tables, the worked templates, every JSON station and the recomputed checks, not only in the changelog. The JSON checks were re-derived from the stations with independent python (project venv; scratchpad `v11_adv/`: `audit_adv.py`, `audit2.py`, `floor_v2.py`, `patch_json_adv.py`). JSON text was patched with python; no template structure, set or check value was hand-typed, and the 8.7 table still matches the JSON row for row. No Google Sheet was opened.*

### Round-2 answers checked

| Answer | Where it lives | Result |
|---|---|---|
| R2-SES-01 / -02 (two spine days; counted list) | 6.4, 8, JSON `axial` | Applied. Re-derived from the stations: every template has at most 1 heavy squat + 1 heavy hinge, never on the same day; matches every `axial_exposures` check. |
| R2-SES-03 (light 2 x 2 core opener; add-ons anywhere) | 3.1, 6.10, every station | Applied: every main lifting day opens with 2 core stations at 2 sets (circuits 2 rounds). Exception kept as before: the BASEBALL Parts days have 1 core exercise below 75 min (observed Part B; pass-2 decision). |
| R2-SES-04 (12 + 2 core) | 7.2, checks | Applied. Re-counted at 45, 60, 75, 90, 105 and 120 min: no athletic day above 12 counted. |
| R2-SES-05 (2-4 per muscle, never 1) | 4.7, 8, checks | Applied. Re-derived group counts match every `checks.per_day` entry; only the documented conjugate and class exemptions have a group with 1. **But the 2-sets-per-exercise start was never checked against the floor of 10 - fixed below (item 1).** |
| R2-SES-06 (cardio adjustable) | 6.7, every `aerobic_ATH07` | Applied: every template carries the more / less switch; aesthetics target 4 everywhere. |
| R2-ATH-01 / -02 / -03 | 8.2 sport dial, plyo stations | Applied. **3.3 still said the coach "has not named this progression yet"; JSON within-tier rule did not name it - fixed (item 4).** |
| R2-ATH-04 (up to 4 Olympic days; cleans = squat days, snatches = hinge days) | 6.15, 8.2, stations | Applied; no "once a week" cap left. **"Every athletic main day carries one" was not true for the BASEBALL Parts Tue/Fri at 60 min (snatch kept 75+ as OBSERVED); the earlier audit counted stations without `include_from_minutes` - claim qualified everywhere (item 3).** |
| R2-ATH-05 / R2-GEN-06 (3-5 reps; RPE / RIR; %) | 6.15, 8.2, JSON | **"% only for competitive Olympic lifters" (05) contradicted "the % comes from that lift's own 1RM" in the same rule and 12's "% only when tested". Reconciled with the approved proposal + the coach's words (item 5).** |
| R2-ATH-06 / -07 | 6.7, 8.2, in-season variant | Applied (aerobic counts by sport; game-heavy in-season reductions; 48 h rule keyed to the intake's game days, R2-GEN-05). |
| R2-ATH-08 (60+ off by default, optional with warning; youth ~14) | 6.15, stations | **3 power stations had no 60+ default (2 limited-knee jumps in the same-pattern variant, the hybrid Tuesday max-sprint block) and 16 had the default without the W_OLDER_POWER warning; the Spanish warning lacked its accent - fixed (item 2).** |
| R2-LIB-01 / -04 / -05 / -07 / -08, LIB-10, LIB-12 | 6.3, 8.6, buckets, stations | Applied: one-detail variations only; KB face pull only under ISO_SIDE_REAR_DELT (never RP_VPULL); bench push-ups both ways; KB curl, table row, floor Y/T raises in the home pools; NO ACCESS = self-serve. **JSON `v1_pending` still listed PRG-01 / FIX-01 / LIB-10 / LIB-12 as open with no status note - note added (item 7).** |
| R2-LIB-02 / -03 (zones) | section 1 | Applied in the md; **missing from the JSON - `notation.zones_R2LIB02_03` added (item 7).** |
| R2-LIB-06 (21.6-mile run removed) | 2.7, 8.6, JSON | Applied; no pool or test offers it. |
| R2-VOL-01 / -03 / R2-GEN-04 (check-in from effort, completion, pain; no check-in = no change; no lifestyle inputs) | 6.13, 9, JSON | Applied; no sleep / stress / life / physical-job field anywhere. **The v1 history row 15 ("3/5/7% chosen by the person's state") had no superseded marker - marked (item 6).** |
| R2-VOL-02 (effort 10 = max but successful) | 6.13, 9 | Applied; no "10 = fail" or "wrecked" text anywhere. |
| R2-VOL-04 / -06 (floor 10; caps customizable; 20-30; Pro) | 6.13, JSON | Rule stated, **but not reconciled with the templates' starting dose (item 1); the JSON had no caps / Pro line - added.** |
| R2-VOL-05 (KB swings ballistic; 0.25 glutes; thruster) | 6.4, 9, stations | Applied: no station with a muscle `group` is a swing; swings only in power / metabolic slots. |
| R2-VOL-07 / R2-PER-03..06 (no deload in a block; stairway; maintenance; pre-season) | 6.12, 9-10, JSON | Applied in the rules. **Leftovers: JSON `v1_rule` still read as a rule with "4 + 4, start hard" and "2-4 weeks acclimation"; `retired_v0_rules` named those shapes as the replacement; OT20's note gave the "2-4 acclimation" 12-week shape; bucket DELOAD had no v1.1 rule; v0 question 21 still resolved as a deload; v1 history row 33 unmarked - all fixed (item 6).** |
| R2-VOL-08 (not understood; default) | 6.6, 6.13, 11.2 | Applied and marked as a default everywhere. |
| R2-PER-07 (tests before / at the end; no 1RM or max mile from zero) | 6.12, 5.5, class stations | Applied. **Bucket TEST had no v1.1 rule, and "the end test replaces that week's top sets" (approved proposal) was missing - added.** |
| R2-PER-01 / -02 (gen-pop year, tunable) | 6.12 | Applied (details in 06). |
| R2-GEN-02 (fewest clicks, views, screenshots; videos optional) | not session architecture | Nothing to apply here; no video is required anywhere in either file. |
| R2-GEN-03 (PAR-Q, coach bypass, liability release) | 9 step 1 | **Not mentioned - a pointer was added to step 1 (md and JSON); the flow belongs to the generator spec / 13.** |
| R2-GEN-05 / -07 / -08 | 8.2, 8.8, W_OLDER_POWER | Applied (season start + practice / game days; the 7 sample plans mapped; Spanish names PROPOSED). |
| Coach request 2026-10-08 (every popular US sport, swimming, pickleball, HYROX) | 8.2, 8.8, 8.9 | Swimming, pickleball / padel and HYROX are mapped. **The md sport dial had no row for the other popular US sports, and it pointed to "04_profiles.json v1.1" while 04 is still v1 (the v1.1 drafts are in `synthesis/sports/`) - row and pointer added (item 8).** |

### Retired ideas: scan of both files (md above the v0 history logs; every JSON string)

| Retired idea | Result after the fixes |
|---|---|
| Acclimation step caps / "start hard" 8-week / 4 + 4 / target-seeking | Only in history entries now marked superseded (`v1_changes` + `v1_changes_status_v1_1`, `deload_test_architecture.v1_rule` labelled HISTORY, `retired_v0_rules` tagged, OT20 `v1_1_note`). "Acclimate" survives only for ex-pros starting at L1 (PRG-05), which is unrelated. |
| Early or triggered deloads inside a block | Gone from every rule; "deload" survives only as OBSERVED tab endings, history rows marked v1.1, the DELOAD bucket's v1.1 rule and the maintenance wording. |
| Life / sleep / stress / physical-job inputs | Only in "no ... fields" rules and the flagged resolution of the R2-VOL-01 life column. |
| Effort 10 = fail | No hit. |
| KB swing glute or hinge credit | No station gives it a group; every remaining mention says ballistic / no credit or is an OBSERVED verbatim. |
| 1 exercise per muscle on full-body days | Only "never one exercise" and the history status note. |
| Olympic once-a-week cap | No hit ("once a week" only for the spine budget, the PPL-once-a-week option and a v0 question). |
| Mid-block tests; 1RM / max mile for untrained | Only the never-mid-block rules, the OBSERVED CrossFit 'LVL 5 = Work up to 1RM' (always with "only at the end of a completed block") and the bucket TEST v1.1 rule. |
| Mandatory videos | No mention of videos in either file. |
| "% only for competitive Olympic lifters" as the whole rule | Replaced by the reconciled wording (31 JSON strings, 6 md places). |

### Problems found and fixed

1. **Floor of 10 vs the 2-set start (R2-VOL-04 / R2-VOL-06 vs R2-SES-05).** At 2 sets per exercise, a muscle trained once or twice a week with 2 exercises gets 4-9 weekly sets (arms 2 in the conjugate strength weeks), below "I don't think anybody needs less than 10". 05 said full-body days "start at about the chosen length", while 12 starts every trained muscle at 10. New section 8.7.1 and JSON `rules.floor10_start_check_R2VOL06` give, per template and length, the groups below 10, the sets the engine adds in week 1 (VOL-07 order) and the longest block-start day before and after. The time model was first reproduced on all 208 timed main days with 0 differences. Result: most 4-6-day plans +2-8 sets (+2-4 min); 2-3-day plans, upper/lower and the CrossFit-style class +6-32 sets (most often +10-25 min, the strength 3-day trio about +39). Notes added in v1.1 resolution 8, changelog row 22, 0, 4.7, 7.4, 8 "How to read", 9 step 8, JSON `set_addition.floor_vs_template_start` and `exercises_per_muscle_R2SES05.length`; asked as 11.3-10 / JSON `new_v1_1_questions`.
2. **R2-ATH-08 on the stations.** `older_default` + W_OLDER_POWER added to the 2 limited-knee jump stations of the same-pattern athletic variant and to the hybrid 5-day Tuesday sprint block (max sprints treated like plyos - INFERRED); the warning added to 16 stations that had the default without it (in-season sprint and jumps, 3-day S1 / S2 plyos, BASEBALL Parts OLY pieces, strength DE plyos, hybrid jumps). Spanish warning: "Asegurate" -> "Asegúrate". Every plyo, limited-knee, Olympic and sprint station now carries both fields.
3. **"Olympic lift on every athletic main day".** Qualified in changelog row 6, 0, 6.15, 8.7 and in JSON (`olympic_frequency_R2ATH04.frequency`, `sport_dial.olympic_R2ATH04_05.frequency`, `week_structure.v1_rules`): the BASEBALL Parts Tue/Fri hang snatch stays 75+ as OBSERVED, so a 60-min Parts week has Olympic work on Mon/Thu (still 2 a week, within "up to 4"). The 8.7 note now says what the earlier audit did not test.
4. **Receive-Create stages** named in 3.3 and in the JSON within-tier ordering rule (R2-ATH-03).
5. **Olympic load language (R2-ATH-05 + R2-GEN-06).** Now everywhere: weight by RPE / RIR and bar speed; a % only when the athlete entered a tested recent best (the approved proposal: "percentages only ... when they enter a recent best"); %-driven Olympic programming only for competitive Olympic lifters ("they don't necessarily need to go by percentage unless you're a competitive Olympic lifter"). Matches 12.
6. **Retired plan-shape / deload / test leftovers in the JSON and md history:** `v1_rule` labelled HISTORY; `retired_v0_rules` tagged; OT20 `v1_1_note`; DELOAD and TEST buckets got `v1_1_rule`; `v1_1_rule` gained "the end test takes the place of that week's top sets"; v1 history rows 15 and 33 marked superseded.
7. **JSON parity with the md.** v0 questions 8, 11, 13, 17, 20, 21 synced with 11.1 (they still showed the v1 status); `new_v1_1_questions` gained the md's item 9 (rear delts / life column) and the new item 10; `notation.zones_R2LIB02_03`; `set_addition.caps_R2VOL06`; `_meta.v1_pending_status_v1_1` and `_meta.v1_changes_status_v1_1` (both lists are history); `_meta.v1_1_adversarial_verification`.
8. **Every popular US sport (coach request).** 8.2 gained a row for the other sports (lacrosse, field hockey, rugby, flag football, cheer / STUNT, ultimate, track and field, cross country, water polo...) - athletic family, nearest ground-contact class from the 04 profile, R2-ATH-07 when game-heavy, nearest R2-ATH-06 aerobic count (INFERRED); JSON `other_sports` says the same. The sport-dial pointer now says that 04 is still v1 at this check and that the v1.1 profiles are drafted in `synthesis/sports/`.
9. **JSON label error.** 14 resistance "work" stations in the athletic family carried `group_label` 'Olympic/power (2-3)'; set to 'resistance'.
10. **R2-GEN-03** pointer added to algorithm step 1 (md and JSON).

### Checks recomputed (python, project venv)

- Group counts per day and axial exposures re-derived from the stations: they match every `checks.per_day` and `axial_exposures` entry (the only differences are the WOD-only class days, which carry no groups).
- Cap: no athletic day above 12 counted exercises at 45-120 min.
- Older-adult fields: 0 plyo / limited-knee / Olympic / sprint stations without `older_default`; 0 with the default but no warning.
- The v1.1 audit script (`v11_05/audit_v11.py`): 145 day types, 0 issues. The 8.7 table re-rendered from the JSON (`table87_v11.py`) matches the md row for row (78 lines). The engine fixture normaliser loads all 30 templates and 1,821 stations. The JSON parses and round-trips with the original formatting.

### Not changed (flagged)

- **The floor-of-10 tension itself** (item 1) is the coach's call (11.3-10). The templates keep their 2-set start; the engine (12) owns the sets.
- **BASEBALL Parts below 75 min** keep 1 core exercise and no Tue/Fri Olympic lift (OBSERVED; pass-2 decision).
- **Medball throws and COD** have no 60+ default: R2-ATH-08 names Olympic lifts, plyos and depth jumps, and the coach files medball throws as ballistic, not plyometric (R2-ATH-02). Max sprints are treated like plyos (INFERRED) - one of the items to confirm.
- **Strength conjugate and CrossFit class** keep their R2-SES-05 exemptions (11.3-5); their floor numbers in 8.7.1 do not credit WOD or 'survival' work.
- Backups from before this check: scratchpad `v11_adv/05_templates.pre_v11adv.json`, `v11_adv/05_session_architecture.pre_v11adv.md`.

---

## v1.2 update: round 3 applied (2026-10-09)

`coach_answers_round3.md` was read in full first; then this file and its JSON, `12_volume_algorithm_v1` (v1.2, written in the same pass), `03_volume_dosing` and `11_training_variables`. The templates were rebuilt by `build_templates_v12.py` (made from the v1.1 build script by `mk_build_v12.py`: one calf exercise x 3 sets per leg day - BASEBALL Part F and the bootcamp circuits included -, block ids and toggles, superset recommendations, calves exempt from 2-4), merged with the unchanged `merge_v11.py`, re-patched with the v1.1 adversarial patch and the three later v1.1 edits (so every non-template value outside the round-3 changes is byte-for-byte the v1.1 value), and then patched by `patch05json_v12.py`. 8.7 was re-rendered from the JSON (`table87_v12.py`); 8.7.1 was computed by `tvm05_v12.py` on the build's own time model (`table871_v12.py`). Build check: 75 template-length checks, 0 flags outside the documented exemptions; every leg day has exactly one calf exercise. The observed evidence in section 2 is unchanged. No Google Sheet was opened or changed. Scratch work: session scratchpad `r3_05/`.

---

## v1.2 verification log

**Adversarial check of the round-3 update, 2026-10-09.** One log for the four volume and session files; the same text is appended to `12_volume_algorithm_v1.md`, `03_volume_dosing.md`, `11_training_variables.md` and `05_session_architecture.md`. JSON twins: `verification.v1_2_adversarial` (12), `verification_log.v1_2_adversarial` (03, 11), `_meta.v1_2_adversarial_verification` (05).

**Method.** `coach_answers_round3.md` read in full first. Then the v1.2 change tables, rule sections, tables, worked examples, pseudo-code and JSON of 12, 03, 11 and 05. Every round-3 answer that touches these files was traced to the rule that carries it in each file, in the Markdown **and** the JSON (a change-log line alone did not count). Leftover scans (regex over all eight files; every hit outside history sections and "retired" notes read by hand) for: check-in; readiness; a weekly step from effort or feedback; `adapt()`; logbook-driven changes and "learn from users' data"; stored user data; rear delts as a line with a floor of their own; Apache / CC BY licensing; a mandatory maintenance or easy week; the old PAR-Q wording. The time policy of the v1.2 prototype (`r3_vol/tvm.py`) was re-run once with one change (fix 6). All four JSON files parse; indent 1, UTF-8 and the missing final newline are unchanged. `node --test tests/` gives the same 7 failures before and after this pass (the stale compiled `model/` and the cross-checks that wait on the engine, flag 3); no new failure. Backups of the eight files before this pass: session scratchpad `r3_adv/backup/`. No Google Sheet was opened or changed.

**Round-3 answers traced (✔ = applied in rules, tables, examples and JSON; FIXED = gap closed in this pass).**

| Answer | Rule | 12 (engine) | 03 (dosing) | 11 (variables) | 05 (sessions) | Status |
|---|---|---|---|---|---|---|
| R3-VOL-01 | one shoulders line (front + side + rear delts), group credit, floor of 10 read on groups, a rear-delt exercise every week, "add rear delts" | §0, §3.1, §3.3, §3.10.2; JSON `starting_table.muscles.shoulders`, `counting` | §1, §9.2, §9.3, tension 27; JSON `counting.group_credit_v1_2`, `weekly_sets` | 3.2, 3.6 item 10, 3.8 | 0, 6.13, 9 step 11; station notes | **FIXED** (03 §3 rear-delt evidence line; 05 JSON: 40 station evidence strings and 7 station notes still said "rear delts get their own sets") |
| R3-VOL-02 | no check-in, nothing adapts; printed self-adjust guide | §3.7.3, §3.14 | §9.13 | 3.5 | 6.12, 6.13, 9 | ✔ (history leftovers marked, fixes 1, 8) |
| R3-VOL-03 | Monday's first exercise, then Thursday's; bonus on the optional day or a day that already trains it | §3.9 | §9.6 | 3.6 | 6.13 | ✔ |
| R3-VOL-04 | stairway ~3 % then ~5 %, peak in the last week, effort 3 → 2 → 1-2 → 1 RIR + intensifiers; outputs only | §3.7.1-3.7.2; JSON `stairway` | §9.6, §9.9, tension 20 | 3.3, 3.10 | 6.12, 9 | **FIXED** (fix 4; 11's 12-week row still said "numbers PROPOSED"; 05 6.12 lacked the approval) |
| R3-SES-01 | FOCUS groups (hips, shoulders); calves one exercise × 3 sets per leg day; field athletes 2-4 per group inside 12 + 2 core, cross pattern default, same-pattern template for size / high level; Focus muscle 1 / 2 +1-3, no sex field | §3.3, §3.5, §3.10 | §9.1, §9.4, §9.7, §9.10 | 3.6, 3.8 | 0, 4.7, 6.6, 7.2, 8 | ✔ (flag 4) |
| R3-SES-02 | tell up front + offer → fewer groups directly → supersets → stairway on the trained groups; block ids, on/off toggles, add / remove, superset recommendation per pair | §3.10.1-3.10.3, §5.1, §5.5 | §9.7, §9.10 | 3.6 items 11-12, 3.8 | 5.1, 8.7.1, 9; JSON `blocks_R3SES02`, `superset_recommendation_R3SES02` | **FIXED** (fix 6; 5.5 keep order) |
| R3-PER-01 | easy week recommended, never mandatory; the block ends and the user builds the next; holidays between blocks | §3.12 | §9.8 | 3.10 | 6.12, 9 step 10, 10 | **FIXED** (12 holiday mark "then maintenance"; 05 6.12 "does a maintenance phase"; 05 section 10; 05 JSON `deload_test_architecture.status` still named the v1.1 rule current) |
| R3-ATH-01..05 | swimming dryland; 60+ and racket 50+ defaults; HYROX; R3-ATH-04 shares and in-season list; play days, cardio credit, event dates | §3.4, §3.10, §3.13 | §9.10-9.12 | 3.3, 3.8 | 6.7, 8.2, 8.5, 8.8, 8.9 | **FIXED in 11** (swimmers row; in-season game-heavy list lacked the R3-ATH-04 sports) |
| R3-GEN-01 | nothing stored; short Blaze Camp health check (EN / ES, link to the official PAR-Q+), coach skip after the warning, "use at your own risk" + terms + liability release at every build | §2.2, §3.14, §1 | §9.3, tension 13 | 3.2, v1 item 26 | 9 step 1 | **FIXED** (fix 2; 05 still read "PAR-Q for clients ... R2-GEN-03") |

**Fixes made in this pass.**
1. **12 ‡ markers.** The v1.2 change table carried ‡ on its rows 2, 4, 6, 7, 8, 10, 12 and 13, which are the numbers of the v1.1 rows that round 3 changed (the intro says the v1.1 rows carry ‡). Moved to v1.1 rows 2, 4, 6, 7, 8, 10, 12, 13, and rows 1 and 3 marked too (start from the week-1 sets; the "too easy +2 points" inside row 3). JSON: every changed v1.1 entry of 12, 03 and 11 now carries `changed_again_in_v1_2`, and each `v1_1_*` block says it is history; 12 `supersedes[13]` (stairway "+ check-in table") marked; 12 `verification._note` says its top-level keys are the v1.1 run.
2. **Stored data (R3-GEN-01).** 12 §2.2 said "the engine stores both counts so the data can later show which predicts results better"; 03 tension 13 (MD and JSON) said "both counts stored". Both now: the Pelland count may be shown, nothing is stored. 12 §1 and 03 §9.3 ("the tool learns from the data of all the people", "we'll collect data") carry the R3 marker; 11 v1 item 26 ("level up when logs read ...") says no logs are read.
3. **Health check (R3-GEN-01).** 05 section 9 step 1 and JSON `generator_algorithm[0]`: the short Blaze Camp health check in English and Spanish with a link to the official PAR-Q+, the coach's skip after the legal warning, the "use at your own risk" box and the terms and liability release at every build, nothing stored, pointing to `DISCLAIMER.md` / `DISCLAIMER.es.md` (not rewritten).
4. **Ceiling vs step size (R3-VOL-04).** The approved text asks for both "about 3 % ... about 5 %" and "reaches its ceiling exactly in the last week". With λ ≤ 1 a line whose ceiling is more than × G(N) above its start peaks below it: 12-week L2 / L3 shoulders and arms reach 18 / 23 against 22 / 25 (12 §3.7.1 table), while 03 §9.4, 03's v1.2 change row and 11 3.3 said "every trained line reaches its ceiling". Stated as an INFERRED reading in 12 §3.7.1 (JSON `stairway.ceiling_reach_v1_2`) and 11 3.3, wording corrected in 03 and 11, flagged: 12 §7 item 16, 03 tension 33 and question 11.5-5, 11 question 25. No number changed.
5. **Machine-readable regressions in 12 JSON.** `stairway.limits.nonpriority_while_priority` had become a string (the compiler's cross-check X05 reads a number): restored to 0.03, scope in `nonpriority_scope_v1_2`; `stairway.limits.tag` no longer calls the retired older-adult cap PROPOSED. 03 JSON `generator_rules.caps.retired_v1_1` held round-3 retirements: renamed `retired_v1_2` (no tool reads it); 03 MD §9.7 "Retired (v1.1, round 3)" → v1.2. 03 JSON `focus_muscles.others` and `feedback_loop` pointed at `tensions[31]` / `tensions[26]` (0-based indexes of the wrong tensions) → `tensions[30]` / `tensions[25]`. 11 JSON `checkin.retired_v1_1.source_12` pointed at 12 paths that no longer exist; `readiness_gate` gained a v1.2 status (its v1.1 replacements are retired too).
6. **Time policy, step 2 (R3-SES-02).** The prototype gives a kept group that starts above its floor a ceiling of *its week-1 sets + the level's climb*, which can pass the level ceiling (R2-VOL-06): in 12 §5.1 shoulders 16 and biceps 15 against the L1 ceiling 14 (time-lowered to 15 and 14), and §5.1 / §3.10.1 printed "ceilings lowered to ... shoulders 15, biceps 14". Re-run here with the step-2 ceiling clamped to the level ceiling (never below week 1 + 2): §5.5 is unchanged; in §5.1 the 4 × 60 client keeps hips, quads, back, chest and shoulders (quads and back reach 14) and biceps join triceps and calves on compound credit. Documented in 12 §3.10.1 and §5.1 and JSON `session_limits.time_vs_minimums_R3SES02.step2_ceiling_flag_v1_2`; clamping proposed, 12 §7 item 4. The published 5.1 numbers are the unclamped run.
7. **Smaller round-3 gaps.** 12 §3.12: a holiday mark inside a block ends it "then maintenance" → maintenance optional (R3-PER-01); 05 6.12 and section 10 likewise; 05 6.12 now carries the R3-VOL-04 approval; 12 §5.5 keep order listed calves twice; 11 3.10 / JSON `plan_shapes[0]` "numbers PROPOSED" → approved (R3-VOL-04); 11 3.3 swimmers row (2 days for younger or lower-level swimmers, Olympic 2-3 days, 25 % plyo) and in-season game-heavy list (R3-ATH-04 sports) completed in MD and JSON; 03 tensions 6, 8 and answered v0 questions 1, 12 and 15 got their v1.2 status; 03 §11.2 item 7 pointed at "12 §7 (v1.1)".
8. **History logs.** The v1.1 verification logs of 12, 03 and 11 now open with a one-line note that round 3 retired or settled what they treat as current (check-in, rear delts 4 / 6 / 8, R2-VOL-08, the end prompt).

**Leftover scans after the fixes (all eight files).** Check-in, step tables, 'Failed', holds, repeated weeks, the block-at-risk prompt, the week-by-week mode, readiness and the life column: only in "retired" notes, ‡ / † history rows, `*_retired_*` JSON keys, the v1.1 tables kept "for the record" and the verification logs. `adapt()`: none. Logbook: only as a printed page for the user's own notes ("never read back") and as OBSERVED sheet evidence. Stored data / learning from users: only "nothing is stored" statements and retired notes. Rear delts with their own 4 / 6 / 8 or caps 8 / 12 / 16: only in retired notes, v1.1 history and the observed evidence; every current rule reads them inside the shoulders group. Apache / CC BY / Creative Commons: none in these files. A mandatory maintenance or easy week: none ("recommendation, not mandatory" everywhere). PAR-Q: only in 05 section 9 step 1 (now R3-GEN-01) and the v1.1 05 verification table (history). Level up on '8 - That was perfect' or easier stays: it is the coach's own PER-06 rule (RIGHT), judged by the user or coach at the rebuild, never read from logs.

**Flags (not decided here).**
1. Ceiling vs step size (fix 4): keep the small steps or let the late steps rise to 7 % - 12 §7 item 16.
2. The step-2 ceiling clamp (fix 6), which changes §5.1's keep-time branch (biceps to compound credit) - 12 §7 item 4.
3. Engine / compiler follow-ups (outside these files): the compiler cross-checks X01 / X02 / X05 still compare the engine's v1.1 rules (side and rear delts as separate lines, 3 % for 60+) with 12 v1.2; `tools/compile/templates-profiles.mjs` maps the optional-day Calves condition to `if_priority:calves` only when it contains "priority", and 05 v1.2 now says "a Focus muscle", so those 14 stations compile to a plain-text condition; `model/` needs a recompile. The 05 station notes changed here keep the word "rear", which the compiler reads to pick the rear-delt variant, and add no exercise keyword the engine matches.
4. 12 §5.4 hotel-gym maintenance week: calves on Monday and Thursday only, while Tuesday and Friday train hips (RDL, hip thrust, leg curl); maintenance is not floored, but one calf exercise per leg day (R3-SES-01) is not met there. Prototype output, not recomputed.
5. 03 JSON `v1_changes[39].where` ("tensions[24]", 0-based would be [23]) is v1 history and left as written.

**Not re-run.** Apart from the clamp experiment (a copy of `tvm.py` with a CLAMP switch in `r3_adv/proto/`; the published numbers stay the unclamped run), no worked example or table was recomputed; no fix changes a published number.


## v1.3 update: round 4, CT-01 and CX-01..04 applied (2026-10-11)

- Read first, in full: `design/ENGINE_V05_PLAN.md`, `coach_answers_round4.md`, `coach_answers_time_2026-10-10.md`, `coach_answers_codex_2026-10-10.md`.
- Added the v1.3 section (his templates, session sizes, the 2-day rule, what a template cannot hold, editing); rewrote the affected rows of §0; marked §4.4-§4.7, §5.1, §5.3, §6.9, §6.13, §7, §8, §8.7, §8.9 and §9 as changed and §7.5, §7.6 and §8.7.1 as retired.
- The skeleton table was checked against the compiled `model/templates.json` (gym A: row, squat, pulldown, lunge, biceps, leg extension, calves, rear delt; gym B: press, hinge, vertical press, single-leg hinge, triceps, leg curl, side / rear delt, calves; gym C; athletic A / B / C).
- The blocks of sections V2 to V5 are the same text as `BLAZE_CAMP_BRAIN.md` v1.3 (§5.6, §10.5, §10.8, §10.10); "master §" in them points to that file.
- Not changed: the observed templates of section 2 and the ordering and pairing evidence of sections 3-6 (they are what his skeletons were read from), the v1 / v1.1 / v1.2 logs (history), and `05_templates.json` (v1.2; not re-issued).