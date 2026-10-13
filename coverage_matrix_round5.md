# Coverage matrix, round 5: the coach's round-5, CH5 and CH6 answers in the master, the model and the tests

Audit date 2026-10-13, release "model v1.4 + engine 0.7.0". Sources of truth: `coach_answers_round5.md` (43 answers: 8 grades, then 29 RIGHT, 5 PARTLY, 1 NOT RIGHT), `coach_answers_chat_2026-10-11.md` (CH5-01..03) and `coach_answers_chat_2026-10-13.md` (CH6-01..02). Checked against `BLAZE_CAMP_BRAIN.md` **v1.4** (the v1.3 master is archived as `BLAZE_CAMP_BRAIN_v1_3.md`), `generator_spec_v1.json` **1.4.0**, the compiled `model/rules.json` **1.4.0**, `engine/DECISIONS.md` and `tests/`.

**Authority.** Round 5 with CH5 and CH6 (the chats on their own subjects only) come first, then round 4 and CT-01, CX, round 3, round 2, round 1.

**How the answers reach the engine.** The compiler does not read the answer files. Every rule below reaches `model/` through a shared amendment layer in `tools/fixture/` (applied by both `build-fixture.mjs` and `compile-model.mjs`): `v06-volume.mjs`, `v06-select.mjs` (CH5), `v07-volume.mjs`, `v07-select.mjs`, `v07-words.mjs` (round 5, CH6-01 and the release). The spec carries round 5 in `_meta` (`coach_answers_round5`, `coach_clarifications_2026_10_11_and_13`, `v1_4_changelog`) and in the health-check keys; its rule tables were not re-issued for round 5.

**Master column.** "§0e.2 #n" is the row of the v1.4 change table. A section after it marked *(in place)* was rewritten for the answer; *(topic)* is where the subject lives and was not rewritten line by line.

**Result.** 48 / 48 answers traced (43 round 5 + 3 CH5 + 2 CH6). 46 are in the model and held by a test or by the data. 1 is a design for the front-end tool, not built (CH6-02). 1 confirms the engine as it is (CH6-01). 14 rows carry a PROPOSED detail. 2 rows carry an open item (R5-ATH-10 / G-298; R5-GEN-02 wording for the attorney).

## Grades (R5-GRD)

| ID | Coach rule (one line) | Master v1.4 | Rules key (layer) | Decision | Test | Status |
|---|---|---|---|---|---|---|
| R5-GRD-01 | Swimming 16, 3 days: **A** | §0e.1; §14.3 | none (a grade) | G-278 | `v07-words.test.mjs` (grades recorded); `v07-release.test.mjs` (the plan did not move with the label) | recorded |
| R5-GRD-02 | Football linebacker, 4 days: **A** | §0e.1; §14.3 | none | G-278 | `v07-words.test.mjs` | recorded |
| R5-GRD-03 | Soccer **B+**: jumps go two-leg, symmetrical, low -> single-leg and higher; never start with single-leg hurdle hops | §0e.2 #10; §9.2, §9.3 *(topic)* | `selection.v7.jumps` (levels, cap, return / stay-low penalties) (`v07-select.mjs`) | G-253, G-264 | `v07-select.test.mjs` "R5-GRD-03 / R5-ATH-10"; `v06-select.test.mjs`; `review-b2.test.mjs` | in model · PROPOSED: the four levels, one level a block, the weights |
| R5-GRD-04 | CrossFit-style class **B+**: popular community WODs, a Girl a week, a Hero once a block, a benchmark every 2-4 weeks, varied | §0e.2 #15; §10.6 *(topic)* | `conditioning.v7.named_wods`, `conditioning.v7.vary` (`v07-select.mjs`); `engine/classwork.mjs` | G-257, G-258, G-293 | `v07-select.test.mjs` "R5-GRD-04"; `v07-fix-r9.test.mjs` | in model · PROPOSED: the library, scaling by level, the Hero's week, one format step and two stations a week |
| R5-GRD-05 | Bootcamp **B+**: vary between station-by-station and rounds (circuits) | §0e.2 #16; §10.6 *(topic)* | `supersets.v7.bootcamp_format` (`v07-select.mjs`) | G-259 | `v07-select.test.mjs` "R5-GRD-05"; `v06-words.test.mjs` | in model · PROPOSED: the split |
| R5-GRD-06 | Full-body aesthetics **B+**: make the core work optional; everything adjustable | §0e.2 #20; §1.2 #18 *(in place)*; §10.10 *(topic)* | `render.v7.core_optional` (`v07-words.mjs`) | G-275 | `v07-words.test.mjs`; `render.test.mjs` | in model · PROPOSED: the wording |
| R5-GRD-07 | Push / pull / legs, 6 days: **A** | §0e.1; §14.3 | none | G-278 (and G-291, G-292: the round-9 regression fixed) | `v07-words.test.mjs`; `v07-fix-r9.test.mjs` | recorded |
| R5-GRD-08 | Pickleball **B+**: with knee pain, assisted jumps first; warn to skip jumps above 6 of 10 pain; no bands | §0e.2 #11; §9.9 *(topic)* | `selection.v7.assisted_jumps`, `selection.v7.jump_pain_warning` (`v07-select.mjs`); 5 new records | G-255 | `v07-select.test.mjs` "R5-GRD-08"; `compile.test.mjs` (record count) | in model · PROPOSED: the list of landing areas; open: more jump stations than assisted records |

## Sets and muscle groups (R5-VOL)

| ID | Coach rule (one line) | Master v1.4 | Rules key (layer) | Decision | Test | Status |
|---|---|---|---|---|---|---|
| R5-VOL-01 | PARTLY: a high-incline press counts 1.0 chest, 0.25 front delts, 0.25 triceps | §0e.2 #3; §5.2 *(in place)*; §0b table, §0d.3 #5 *(in place)* | `credit.classes.MRPUSH` (`v07-volume.mjs` `amendExerciseV07`) | G-230, G-290 | `v07-volume.test.mjs` "R5-VOL-01"; `compile.test.mjs` H08 | in model |
| R5-VOL-02 | Pulling at or above pressing in every plan; adjustable | §0e.2 (confirmed) | none new (VOL-18 holds, V29) | G-239 | `v07-volume.test.mjs` "R5-VOL-02 / 03 / 04" | confirmed as built |
| R5-VOL-03 | Side delts at least 4 / 6 / 8 direct sets (minimums) | §0e.2 (confirmed) | none new | G-239 | `v07-volume.test.mjs` "R5-VOL-02 / 03 / 04" | confirmed as built |
| R5-VOL-04 | One biceps and one triceps exercise on A / B days; adjustable | §0e.2 (confirmed); §10.3 *(topic)* | template slot 5 (`templates.json`) | G-239 | `v07-volume.test.mjs` "R5-VOL-02 / 03 / 04" | confirmed as built |
| R5-VOL-05 | A day: calves 7th, rear delts 8th; B day: side delts 7th, calves 8th | §0e.2 (confirmed); §10.8 *(topic)* | template skeletons `gym_A` / `gym_B` | G-239 | held by the skeleton tests (`v05-structure.test.mjs`); no test by this id | confirmed as built |
| R5-VOL-07 | A light chest exercise (fly or machine press) on the optional day, even after a press day | §0e.2 #6; §5.5 *(topic)* | `placement.x7.light_chest_optional` (`v07-volume.mjs`) | G-231 | `v07-volume.test.mjs` "R5-VOL-07" | in model · PROPOSED: a third optional-day place on physique weeks |
| R5-VOL-08 | Advanced physique: Focus muscles start at 22, the others at 16 | §0e.2 (confirmed) | `volume.x3.nonfocus_start`; approval recorded in `release.confirmations` (`v07-words.mjs`) | G-111, G-239 | `v07-release.test.mjs`; `v06-volume.test.mjs`; `review-r3.test.mjs` | confirmed; approval recorded at the release |
| R5-VOL-09 | PARTLY: an athlete's flat press 4 sets by default; more with a chest Focus or the goal | §0e.2 #7; §5.5 *(topic)* | `placement.x7.athlete_press_focus` (`v07-volume.mjs`) | G-232 | `v07-volume.test.mjs` "R5-VOL-09" | in model · "goals" has no intake field; a coach edits the sets |
| R5-VOL-10 | Racket players 50+ keep the calf raise on both days; the day holds one more exercise | §0e.2 (confirmed) | `session.x7.racket_calf_both_days` (`v07-volume.mjs`) | G-233 | `v07-volume.test.mjs` "R5-VOL-10"; `week.test.mjs` | in model |
| R5-VOL-11 | A one-set shortfall: the day's first press takes a 5th set in the last block | §0e.2 #8; §5.5 *(topic)* | `placement.x7.one_set_shortfall` (`v07-volume.mjs`) | G-235 | `v07-volume.test.mjs` "R5-VOL-11"; `v06-fix3.test.mjs` | in model |

## Athletes (R5-ATH)

| ID | Coach rule (one line) | Master v1.4 | Rules key (layer) | Decision | Test | Status |
|---|---|---|---|---|---|---|
| R5-ATH-01 | Athletic A / B days keep a two-leg lift in slot 2 and a single-leg lift in slot 4; extra single-leg work from jumps and open slots | §0e.2 (confirmed) | `selection.skeleton_laterality` | G-58 (built in 0.5) | `v05-fix1.test.mjs` (G-58); no test by this id | confirmed as built |
| R5-ATH-02 | Jumps, throws, cuts and sprint metres may hold up to 2 weeks, reaching the block's final number | §0e.2 #12; §9.2 *(topic)* | `athletic.v7.hold` (`v07-select.mjs`) | G-256, G-303, G-304 | `v07-select.test.mjs` "R5-ATH-02"; `v07-sweep.test.mjs`; `review-r2f2.test.mjs` | in model |
| R5-ATH-03 | 2-3 training days: about three quarters of a 4-day week's athletic dose | §0e.2 (confirmed) | `athletic.x1.scale_by_days` (floor 0.75); approval recorded in `release.confirmations` | G-67 | `v07-release.test.mjs`; `v05-fix1.test.mjs` | confirmed; approval recorded at the release |
| R5-ATH-04 | Incline first for throwers and volleyball too; overhead pressing stays for health and range of motion | §0e.2 #13; §4.1b *(topic)* | `selection.v7.incline_overhead` (`keep_overhead`, `one_slot_care`, `general_care`), `prehab.by_injury_code.OVERHEAD_HEALTH` (`v07-select.mjs`) | G-252, G-299 | `v07-select.test.mjs` "R5-ATH-04"; `v07-fix-r9.test.mjs`; `v05-library.test.mjs` | in model · PROPOSED: one overhead press a week, the weekly light joint-care press, and its use in general / physique plans |
| R5-ATH-05 | A gym session the day before a game is the lighter one | §0e.2 (confirmed) | `placement.x1.eve_of_game` (status approved) | G-262 | `v07-select.test.mjs` (confirmations); `v05-fix1.test.mjs` | confirmed as built |
| R5-ATH-07 | Stay-athletic players: 5-10 exercises a day | §0e.2 (confirmed) | `session.size.by_type.stay_active`; approval recorded in `release.confirmations` | - | `v07-release.test.mjs` | confirmed; approval recorded at the release |
| R5-ATH-08 | Low-back core only with reported low-back pain; otherwise normal core, including rotation | §0e.2 #14; §9.9 *(topic)* | `selection.x2.core_primary`, `selection.s6.core`, `selection.v7.core_rotation` (`v07-select.mjs`) | G-261, G-295, G-296 | `v07-select.test.mjs`; `v07-fix-r9.test.mjs`; `v06-select.test.mjs` | in model · PROPOSED: the 30 % transverse line, the rotational picks |
| R5-ATH-09 | KB swing or high pull instead of snatches and cleans with pain, 3+ play days or a 50+ racket player | §0e.2 (confirmed) | `selection.s6.olympic_safe` (status approved) | G-262 | `v07-select.test.mjs` (confirmations) | confirmed as built |
| R5-ATH-10 | Cutting sports: a single-leg or lateral jump each training day; a two-foot lateral jump in the first weeks | §0e.2 #10; §9.2 *(topic)* | `selection.s6.jumps`, `selection.v7.jumps`; 3 two-foot lateral records (`v07-select.mjs`) | G-254, G-262, G-298 | `v07-select.test.mjs`; `v07-fix-r9.test.mjs`; `v06-select.test.mjs` | in model · **open (G-298):** 02's first block holds a lateral jump on 2 of 4 days (two records, each once a week) |
| R5-ATH-11 | No hard (Blue) cardio the day before a top-speed sprint day or the heavy deadlift | §0e.2 (confirmed) | `conditioning.s6.hard_eve` (status approved) | G-262 | `v07-select.test.mjs` (confirmations) | confirmed as built |
| R5-ATH-12 | The heavy deadlift starts at 3 sets and takes its group's next set first | §0e.2 #9; §5.5 *(topic)* | `placement.x7.heavy_hinge_lead` (`v07-volume.mjs`) | G-236 | `v07-volume.test.mjs` "R5-ATH-12" | in model |

## Class and bootcamp (R5-CLS)

| ID | Coach rule (one line) | Master v1.4 | Rules key (layer) | Decision | Test | Status |
|---|---|---|---|---|---|---|
| R5-CLS-01 | A lunge on the class clean + pull day | §0e.2 (confirmed) | class template (`templates.json`, already built) | G-262 | `v07-select.test.mjs` (confirmations) | confirmed as built |
| R5-CLS-02 | Bootcamp with no pull-up bar: a hip thrust or bridge in the free station | §0e.2 (confirmed) | `selection.x2.circuit.stand_in.RP_VPULL` (`v07-select.mjs`); V29 reading | G-260, G-263 | `v07-select.test.mjs`; `select.test.mjs`; `v05-fix1.test.mjs` | in model |
| R5-CLS-03 | PARTLY: circuit rounds climb with the plan in thirds (3 / 4 / 5); people adjust | §0e.2 #17; §10.6 *(topic)* | `supersets.bootcamp.x7.rounds_by_third` (`v07-volume.mjs`) | G-234 | `v07-volume.test.mjs` "R5-CLS-03"; `shape.test.mjs` | in model |
| R5-CLS-04 | Wall balls and sled pushes in the class workout, with a switch | §0e.2 (confirmed) | `selection.addons.primary_exceptions` (status approved) | G-262 | `v07-select.test.mjs` (confirmations) | confirmed as built · open minor: the switch is not yet told to the member (round-10 review 04 m1) |
| R5-CLS-05 | Class member's lifting: arms and shoulders near floor + 2, chest and back 14-16, legs full, small muscles 10-12 reps | §0e.2 #18; §7.3 *(topic)* | `volume.x3.class_tops`, `reps.x7.class_small_reps` (`v06-volume.mjs`, `v07-volume.mjs`) | G-113, G-294 | `v07-fix-r9.test.mjs` "R5-CLS-05" | in model · PROPOSED: the fly and leg curl in the 10-12 bracket |
| R5-CLS-06 | Bootcamp cardio station: plain cardio by default; a swing or slam is a swap | §0e.2 (confirmed) | `selection.s6.circuit_cardio_first` (status approved) | G-262 | `v07-select.test.mjs` (confirmations) | confirmed as built |
| R5-CLS-07 | PARTLY: nothing starts at its top number; all gradual; a Focus starts a little higher | §0e.2 #4; §5.4 *(topic)* | `volume.x7.start_below_top` (`v07-volume.mjs`) | G-237 | `v07-volume.test.mjs` "R5-CLS-07" | in model · PROPOSED: a climb of at least 1 set |

## Library (R5-LIB)

| ID | Coach rule (one line) | Master v1.4 | Rules key (layer) | Decision | Test | Status |
|---|---|---|---|---|---|---|
| R5-LIB-01 | Two-arm bent-over DB row and chest-supported DB row are regular picks for small kits | §0e.2 (confirmed) | `selection.x2.small_kit_rows` (status approved) | G-262 | `v07-select.test.mjs` (confirmations) | confirmed as built |
| R5-LIB-02 | Low-back anti-rotation picks: dead bugs, bird dogs, side planks, Pallof press | §0e.2 #14 | `selection.x2.core_primary`, `selection.s6.core` (`v07-select.mjs`) | G-261 | `v07-select.test.mjs` | in model |

## Plans and safety (R5-GEN)

| ID | Coach rule (one line) | Master v1.4 | Rules key (layer) | Decision | Test | Status |
|---|---|---|---|---|---|---|
| R5-GEN-01 | NOT RIGHT: 2 days a week = two full-body days, not A + B | §0e.2 #2; §5.1 V25 *(in place)*; §5.6.2 *(in place)*; §10.1 W30 *(in place)* | template skeletons `gym_FB1`, `gym_FB2`, `athletic_FB1`, `athletic_FB2` (`v07-select.mjs` `amendTemplatesV07`); `selection.v7.two_day_full_body` | G-250, G-251 | `v07-select.test.mjs` "R5-GEN-01"; `v05-structure.test.mjs`; `v05-integrate.test.mjs` | in model · PROPOSED: which slots go to which day |
| R5-GEN-02 | PARTLY: a health-check flag no longer stops the plan; the plan warns: not a plan from a doctor, see a medical professional | §0e.2 #1; §13.1 G7, §13.2 F01, F35-F36, §13.3, §13.6 V1 *(in place)* | `legal.health_flag` (`v07-words.mjs`); spec `legal_and_privacy`, `inputs_schema` F01 / F36, `validation_checks.V1_safety` | G-270, G-271, G-272, G-273, G-274 | `v07-words.test.mjs`; `intake.test.mjs`; `generate.test.mjs`; `validate.test.mjs` | in model · PROPOSED: severe pain built as moderate · **open:** the warning wording for the attorney (`[LEGAL REVIEW]`) |
| R5-GEN-03 | Default exercise counts: general 7, aesthetics 7, strength 6, bootcamp 7, field athletes 12, older adults 6 | §0e.2 (confirmed) | `session.size.by_type.*.default`; approval recorded in `release.confirmations` | - | `v07-release.test.mjs`; `intake.test.mjs` | confirmed; approval recorded at the release |

## Public repo (R5-PUB)

| ID | Coach rule (one line) | Master v1.4 | Where | Decision | Test | Status |
|---|---|---|---|---|---|---|
| R5-PUB-01 | Keep the sheet exports public, strip third-party links, remove client names | §0e.2 #21 | `raw/`, `dumps/`, `analysis/`, `synthesis/02_exercise_catalog_crosswalk.json`, `design/scratch/snap*/`; `AGENTS.md` §5, §13, §14 | G-276 | `v07-words.test.mjs` "R5-PUB-01" | done (no client name found) |
| R5-PUB-02 | Credentials as written: "Master NASM coach" only | §0e.2 #21; §0d.3 #18 *(in place)* | `README.md`, `MODEL_CARD.md`, `AGENTS.md` §13; spec `_meta.credit.other_certifications` | G-277 | `v07-words.test.mjs` "R5-PUB-02" | done |

## Chat answers (CH5, CH6)

| ID | Coach rule (one line) | Master v1.4 | Rules key (layer) | Decision | Test | Status |
|---|---|---|---|---|---|---|
| CH5-01 | Team practices: not built in or counted as aerobic sessions; the athlete accounts for them (one line) | §0e.2 #19; §9.7 *(topic)* | `conditioning.s6.practice.counts_as_aerobic` false, `render.v6.team_practice_line` (`v06-select.mjs`) | G-197 | `v06-select.test.mjs`; `intake.test.mjs`; `week.test.mjs` | in model |
| CH5-02 | Every athletic A / B day holds the arm slot (biceps A, triceps B), adjustable | §0e.2 #19; §10.8 *(topic)* | `selection.s6.arm_slot.every_athletic_day` (`v06-select.mjs`); the FB days keep slot 5 (`v07-select.mjs`) | G-198, G-200, G-202 | `v06-select.test.mjs`; `v06-fix2.test.mjs` | in model |
| CH5-03 | A big group reaches its planned final sets, with a bonus if needed; no group above 35 | §0e.2 #5; §5.5 *(topic)* | `placement.x3.bonus_small_only.big_when_needed`, `placement.x3.reach_planned`, `volume.x3.group_max` (`v06-volume.mjs`); `placement.x3.bonus_last`, `placement.x7.bonus_open_week` | G-199, G-204, G-217 ... G-221, G-238 | `v06-volume.test.mjs`; `v06-fix2.test.mjs`; `v06-fix3.test.mjs`; `v05-structure.test.mjs` | in model |
| CH6-01 | A weighted dip at 5 next to the bench at 4 in the last weeks is fine; editable | §0e.2 (confirmed) | `placement.x7.lead_first_step`, `placement.x7.later_not_above_lead` (`v07-volume.mjs`) | G-291, G-292 (stand) | `v07-fix-r9.test.mjs` | confirmed: no change |
| CH6-02 | People and coaches may add their own exercise anywhere, answering one question (main muscle, or jump / cardio); labelled "your exercise: not checked by Blaze Camp rules" | §0e.2 #22; §10.10 *(topic)* | none yet: today `engine/edit.mjs > add_exercise` takes library exercises only | - | none | **design for the front-end tool, not built** (`HANDOFF.md` "Next step") |

## The release itself

| Item | Where | Decision | Test |
|---|---|---|---|
| Model label 1.4.0 (`model/MODEL_VERSION`, manifest, `rules.rules_version`, spec `_meta.version`, BRAIN header) | `tools/fixture/v07-words.mjs` `V07_MODEL_VERSION`; `tools/compile-model.mjs` (changelog line) | G-305 | `v07-release.test.mjs`; `compile.test.mjs`; `review-r3.test.mjs` |
| The label changes no plan: the seed keeps 1.3.0 | `rules.determinism.seed_version_map`; `engine/generate.mjs` | G-305 | `v07-release.test.mjs` |
| Confirmed-rule approvals (R5-VOL-08, R5-ATH-03, R5-ATH-07, R5-GEN-03) | `rules.release.confirmations` (`tools/fixture/v07-words.mjs`; no value changes) | - | `v07-release.test.mjs` |

## Machine checks (2026-10-13)

- `node tools/fixture/build-fixture.mjs && node tools/fixture/check-fixture.mjs`: 0 errors, 0 warnings.
- `node tools/compile-model.mjs` then `node tools/check-model.mjs`: model 1.4.0, 742 exercises, 0 errors, 0 warnings.
- `node tools/generate-samples.mjs`: 8 of 8 `ok`, 0 failing error checks; the plans differ from the engine 0.7.0 / model 1.3.0 ones only in `model_version` and the printed "Model 1.4.0" line.
- Every rules key named above exists in `model/rules.json` (checked by script).
