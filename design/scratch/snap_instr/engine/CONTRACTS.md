# Blaze Camp plan generator — engine CONTRACTS (Phase 0, binding) — v1.1

Status: **binding for Phase 0** ("freeze the model"). Version `contracts/1.1.1`, 2026-10-09 (integration step; 1.1.0 by the
architect, 2026-10-08). The 1.1.1 amendments resolve `engine/CONTRACT_REQUESTS.md`; each is marked **[1.1.1]** below and listed in §11.
The plan schema name stays `plan/2` and `manifest.contracts_version` stays `1.1.0` (no runtime shape was removed or renamed).
Supersedes `contracts/1.0.0` (written before round 2 was answered). Every builder (B1-B4, `engine/BUILD_PLAN.md`) implements
exactly the shapes, names and signatures below. If something here is wrong or missing, **do not silently diverge**: implement
the closest compliant thing, write the issue to `engine/CONTRACT_REQUESTS.md` and in your final report under `problems`.

> **Engine 0.4.0 amendments (stage B1, round 3; model 1.3.0; 2026-10-09) - binding, they supersede the text below where it
> conflicts.** Authority now starts with `coach_answers_round3.md` (COACH-R3). Decisions: `engine/DECISIONS.md` section E.
> * **Lines and groups** (R3-VOL-01, R3-SES-01): `rules.muscles.lines` (quads, hamstrings, glutes, chest, lats_upper_back,
>   **shoulders** = side + rear + front delts, biceps, triceps, calves) carry the stairway; `meta.targets.start / cap /
>   step_by_muscle / target_by_muscle / main_sets_by_muscle` are keyed by line. The floor of 10, the 2-4 rule and the time check
>   read `rules.muscles.groups` (hips = glutes + hamstrings). A set counts at most 1.0 to a line / group (`engine/timefit.mjs`).
> * **No check-ins** (R3-VOL-02 / R3-VOL-04): `adapt`, `adaptWith`, `checkinRow` and `checkin/2` are retired; `output_mode` is read
>   and normalized to `plan_only` (`warning.checkin_retired` otherwise); `plan.mode: week_by_week` = `fixed_12` with
>   `plan.view: 'week'`; `rules.stairway.checkin` is gone (`stairway.no_checkin: 'planned_only'`).
> * **Intake additions** (§2.1): `focus_muscles` (<= 2; `priority_muscles` is its alias; `v_taper` takes both slots),
>   `plan.previous_cycles.last_block_finished` (alias `last_had_holds_or_pain`), `activity.play_minutes` (`under_45|45_60|60_plus`), `plan.view`,
>   `prefs.superset_recommendations` (`show|hide`), `prefs.racket_50_impact_opt_in`. Derived adds `focus_lines`,
>   `priority_choices`; `D9_start_sets` adds `lines`, `floor_groups`, `focus_add`, `calves_floor`, `leg_days`.
> * **The time check** (R3-SES-02): `plan.time_check` = `{training_block, fits, kept_time, needed_minutes, offered: {extra_day:
>   {days, minutes} | null, session_minutes | null} | null, trained_groups[], not_trained_directly[{group, reason: time |
>   no_station | credit_only | class_lift (B4)}], lowered_peak[], trained_below_floor[{group, reason: work_lift_time}], supersets_recommended,
>   supersets_needed[], by_block[{training_block, fits, trained_groups, not_trained_directly, trained_below_floor}]}` (between
>   `offers` and `meta`; null when the plan has no stairway block). Offers are the time check's only: `offer.more_days {days}`,
>   `offer.more_days_min {days, min}`, `offer.longer_sessions {min}`, `offer.keep_time` / `offer.keep_time_lower_peak {days,
>   minutes}` (chosen). Warnings: `warning.time_check`, `warning.not_trained_directly`, `warning.time_lower_peak`,
>   `warning.below_floor_work_lift`, `warning.credit_only_groups`, `warning.supersets_needed`, `warning.test_day_long`;
>   `warning.floor_schedule`, `warning.start_lowered`, `warning.stairway_time` and `offer.lower_start` are retired.
> * **Plan additions** (§5, additive; `plan/2` and `contracts_version 1.1.0` kept): week `weekly_sets_by_line`,
>   `weekly_sets_by_group`, `main_sets_by_group`, `not_trained_directly[]` (after `main_sets_by_muscle`); day `supersets_needed`,
>   `superset_recommendations[{pair_id, items[], minutes_saved, on, needed}]`, `toggle_blocks[]` (after `supersets_on`); block
>   `id` (`blk.<day_type>.<kind>.<n>`; fix round 1: `blk.<weekday>-<day_type slug>.<kind>.<n>`), `toggle`, `removable` (after `items`); item `superset_suggested` (last); summary
>   `sets_by_line_by_week`, `sets_by_group_by_week`. A rep-max test is its own item (`slot_id` + `.test`, role / origin `test`,
>   1 set, `credits {}`, `note.test_top_set`) before the lift's planned sets.
> * **Time model v1.3** (`rules.time_model.work_minutes`, `rest_class_minutes`, `rest_class_by_time_class`,
>   `test_workup_minutes`, `test_item_minutes`, `superset_rule: pair_shares_rest`); `week.estimateMinutes(day, sets, fills,
>   model, {week, derived, lifting_only, supersets: false | true | 'eligible'})`; `week.testPlan(base, weekShape, derived, model)`.
> * **Validators** (§6): V22 / H17, H21 and H22 as rewritten in §6; no warning exempts a trained group.
>
> **Engine 0.4.0 amendments, stage B2 (athletic work; model 1.3.0; 2026-10-09) - binding.** Decisions: `engine/DECISIONS.md`
> E-26 ... E-45; model data: `tools/fixture/athletic-b2.mjs` (applied by both builds after `round3.mjs`).
> * **New module `engine/athletic.mjs`** (owner B2): `stagesForStairway(model, st, level)` (Receive-Create stage per week, changing
>   only at an exercise-block boundary; shape.mjs calls it), `responseOf`, `isUpperPlyo`, `athleticKeyOf(bucket, ex)` (adds the key
>   `upper_contacts`), `cueKeyFor(ex, stage, model)`, `perSetBounds(model, key, ex, progress)`, `sprintMetres`, `throwSided`,
>   `endTestHold`, `rampProgress`, `splitContacts(H, Ppro, Lo, T, share, stage)`, **`athleticBudget(derived, shape, model)`** (moved
>   here; `volume.mjs` re-exports it, the pipeline dependency is unchanged), `circuitBallistic(derived, model)`,
>   **`planAthletic(model, derived, shape, budget, weeksItems)`** -> `{weeks: [{slot_plan: {slot_id: {per_set, per_leg, key}}, goals,
>   scale, hold}], warnings}`, `plannedAthletic(items)`, `plannedShare(planned)`. `budget.olympicSetsForIndex(derived, model,
>   exposures, week, index)` (the per-exposure Olympic sets; volume.mjs reads it).
> * **Pipeline** (§4.12): `generate` collects every week's items first, then `planAthletic` doses the athletic stations of the whole
>   block, then each week is dosed (`doseItem` input `athletic` carries `slot_plan`; plyo / throw / COD / sprint doses use it).
> * **Catalog** (§3.2): `athletic` gains six fields, in this order after `count_unit`: `response` (`landing|single|repeat|null`),
>   `upper` (bool), `low_amplitude` (bool), `sport_only` (sport ids or null), `no_cuts` (bool), `sprint_kind`
>   (`acceleration|max_velocity|drill|run|null`). A single-response plyometric is never tagged `plyo_repeated`.
> * **Rules** (§3.3): `athletic.stages.align_to_exercise_blocks`, `athletic.response_cues`, `athletic.rc3_plyometric_response`,
>   `athletic.split`, `athletic.reconcile` (+ `scale_to_capacity`, `climb`, `hold_end_test_week`, `unilateral_counts_both_legs`,
>   `unilateral_contacts_per_leg_max_low`, `climb_families`; `per_set_max.sprint_m` 240), `athletic.first_reactive`,
>   `athletic.cod`, `athletic.sprint` (metres by drill, `round_m`), `athletic.circuit_ballistic`, `athletic.hyrox`,
>   `olympic.sets` (+ `climb`, `distribute`, `hold_end_test_week`), `selection.olympic_never_in_resistance`,
>   `medball.no_ball_only_ids`, `prehab.by_injury_code.SHOULDER_SWIMMER` (+ `each_session`, `each_session_sets`,
>   `each_session_sports`), `plan_types.prep.taper_weeks_by_sport`, `population.older.default_on` / `quick_stepping_*` /
>   `fast_intent_note`, `population.active_aging_50.opt_in_field`. Profiles: `sprint_focus`, `plyo_rules.exclude_tags_age_50`,
>   HYROX `template_hint`. Templates: `athletic.4` variant `hyrox` (S1 / H1 / S2 / H2; program `OTHYX`); a `COND_AEROBIC` station
>   whose `variant` names a colour takes that colour.
> * **Targets** (§4.5 athleticBudget): `jump_contacts` = ballistic / landing jumps, `plyo_contacts` = reactive jumps,
>   `low_contacts` = ankle work - the 04 volume split by the plyo share (reactive jumps + ankle work over all jump and throw work);
>   stage 1 has no reactive jumps; the end-test week holds the week before (`hold`); 60+ default keeps landings, light throws and
>   quick stepping; a general-population circuit keeps its throws.
> * **Plan additions** (§5, additive): `week.athletic_budget` adds `planned.upper_contacts`, `planned_share`, `goals`, `scale`,
>   `hold`; `item.athletic` adds `key`, `response` (a single-leg drill's `per_set` counts both legs; `reps.value` is per leg).
>   New warning `warning.athletic_capacity {key, pct, training_block}`.
> * **V27** (§6) checks over, under the goal, drops inside a stairway block, an untold peak under 60 %, stage / jump exercise
>   changes inside an exercise block, stage-3 single-response drills and sport-only COD drills.

> **Engine 0.4.0 amendments, stage B3 (exercise selection, variation and rendering; model 1.3.0; 2026-10-09) - binding.** Decisions:
> `engine/DECISIONS.md` E-46 ... E-63; model data: `tools/fixture/render-b3.mjs` (applied by both builds after `athletic-b2.mjs`).
> * **select.mjs** (owner B3) exports `variationValues(model, ex, kitTokens, painAreas)` (the concrete one-detail variations of a record,
>   `[{axis, key: 'detail.v.<id>', value}]`), `isNearDuplicate(model, a, b)`, `detailDistance(a, b)`; `aerobicPick(colour, derived, model,
>   seed, slotId, ebIdx)` (6th parameter: the exercise block inside the training block). `SlotFill.detail` = `{axis, key, value}` (the
>   axis-only `detail.<axis>` keys are no longer emitted). `Selection.history` (`{<slot_id>: [ids of earlier blocks], details: {...}}`) is
>   internal to the pipeline (not in `plan/2`). Block changes (§4.7): a real one-detail alternative first (any kit, at least one slot a
>   day), else a concrete detail, else no change; near-duplicates never share a session; the lead chest press, the canonical axial work
>   lift, two-arm presses for heavy-powerlifting clients, home substitutes only when needed, core once a week with same-plane swaps.
> * **dose.mjs** (owner B3): `doseAerobic(slot, weekShape, derived, model, fill)` (5th parameter: the fill names the session's pattern);
>   `doseItem` input `block_first_sets` (the slot's sets in the exercise block's first week: the pyramid is decided per block). Effort:
>   intensifiers only in the last stairway week, one a day (`last_set: 'myo'` on the last small-muscle / machine isolation item;
>   `intensifier: true` on that item only; no `'max'` while `rules.effort.intensifiers` exists); a resistance circuit station
>   `{type:'rir', min, max, rpe_min, rpe_max, last_set, intensifier:false, circuit:true, key}`; an aerobic session
>   `{type:'aerobic', colour, modality, pattern}`. Rest `{type:'after_pair', min?, max?}` (a pair with the work lift keeps the strength
>   rest). Load `{type:'lb_range', unit:'dumbbells'|'kettlebell', min, max}` (WOD stations; `wod.station_loads[]`).
> * **render.mjs** (owner B4, stage B3): `view: 'overview'` (macro tables for screenshots); every plan opens with the use-at-your-own-risk
>   line and the link of `rules.legal.disclaimer_url[lang]` (R3-GEN-01; a short line on block / week / day views and fragments, refer and
>   invalid plans too); 'Your schedule' from `plan.time_check`; per day: the switch-off line (`toggle_blocks`), superset suggestions
>   (`superset_recommendations` not on; hidden by `prefs.superset_recommendations: 'hide'`), pair tags `[A1]`; the stairway table week ·
>   level · effort · sets (circuits: work seconds); weekly sets per FOCUS group; the week at a glance; failed checks via
>   `check.failed.<id>`; day titles rebuilt from the day's lifts; a Christmas / New Year notice. Tables stay at most 4 columns.
> * **explain.mjs**: a weekday inside a Spanish sentence is lower case; a reason with a count of 1 takes `<key>_one` when it exists.
> * **Derived** (intake.mjs, additive): `D8_kit.cardio_options`, `D8_kit.running_space`. **shape.mjs**: the athlete rep phase follows
>   `reps.athlete_vol_phases.by_season_phase` of the exercise block's first week.
> * **Rules** (§3.3, additive): `selection.variations`, `selection.near_duplicate`, `selection.lead_press`, `selection.powerlifting_presses`,
>   `selection.barbell_l1_50_pain`, `selection.home_substitute_only_when_needed`, `selection.assisted_id_re`, `selection.core_week_unique`,
>   `selection.core_swaps_same_plane`, `selection.hotspots.LOW_BACK_ROTATIONAL`, `selection.pain_avoid_id_patterns`,
>   `selection.class_work_prefer_id_patterns`, `selection.skill_rotate`, `selection.block_change` + `one_detail`, `max_distance`,
>   `no_return_to_earlier_pick`, `never_olympic_tag`, `constraint_up_max_l2_l3`, `week_unique`, `concrete_detail_only`;
>   `selection.generic_id_patterns` + 6 patterns; `effort.intensifiers`, `effort.circuit_rir`; `reps.pyramid.never_lift_styles` /
>   `decide`; `rest.pair_with_work_lift`; `conditioning.aerobic_b3` (ladder, level start, climb, patterns, modalities);
>   `conditioning.wod.station_loads_lb` / `calorie_station_generic`; `legal` (`disclaimer_url`, owner, nothing stored);
>   `prehab.preferred_by_code.ELBOW_LATERAL_RACKET` starts with the catalog's wrist extension. Catalog (no shape change): the lunge /
>   split-squat family and full-catch Olympic records carry `deep_knee_flexion`.
> * **i18n**: `detail.v.<id>`, `ui.plan.own_risk*`, the schedule / switch / superset / macro-table / test / aerobic / WOD words,
>   `check.failed.V28` / `V29`, `cardio.modality.*`, `block.short.*`; retired: `felt.*`, `intake.error.week_by_week_needs_checkin`.

> **Engine 0.4.0 amendments, stage B4 (integration; model 1.3.0; 2026-10-09) - binding.** Decisions: `engine/DECISIONS.md`
> E-64 ... E-80; model data: `tools/fixture/integrate-b4.mjs` (applied by both builds after `render-b3.mjs`); tests
> `tests/review-b4.test.mjs`; sweep `tools/sweep.mjs`.
> * **Rules** (§3.3, additive): `session.time_fit.keep_work_lift = {families: ['hybrid_crossfit'], roles: ['work'], sets: 3, reason:
>   'class_lift', refs, status}` - the class model's day work lift is never removed by the time check (E-64).
> * **plan.time_check** (§5): `not_trained_directly[].reason` adds `class_lift` (a group not trained directly that keeps its class
>   lift on a main day, at `keep_work_lift.sets`, no set stairway); `lowered_peak` lists trained groups only.
> * **volume.mjs**: `WeekVolume.added_fills` (`{slot_id: SlotFill}`, after `added_slots`) - the fill each added slot was counted with;
>   generate prints that pick (E-70). A template station whose same-day partners of its FOCUS group all came back empty from select
>   leaves that day (E-69). Room cuts of a group's exercises come off the most loaded day first (E-77). A class lift leaves a day whose
>   fixed class work cannot hold it (E-64).
> * **budget.mjs**: `olympicSetsForIndex` returns `rules.olympic.in_season.sets` for the first `per_week` exposures of a game-heavy
>   in-season week and 0 for the others (E-66).
> * **dose.mjs**: `doseConditioning(slot, fill, weekShape, derived, model, input)` - generate passes the week's athletic object as
>   `weekShape.athletic_week` (`{...AthleticBudget, stations_sets, circuit_ball_sets, slot_plan}`); a timed-circuit ball station counts
>   throws only when it is metabolic and shares `athletic_week.targets.throws` with the week's other ball rounds (E-65).
> * **athletic.mjs**: `planAthletic`'s never-drop raise stops at the V27 over-budget limit of the key (E-71).
> * **week.mjs**: the Olympic exposure trim removes unfillable stations first (E-68); joint care: every weekly code takes one session
>   before any code takes a second (E-75); the jump test goes to a jump day without a strength test or the speed / agility test (E-79).
> * **render.mjs**: 'Your schedule' prints `ui.plan.not_trained_class_lift` (reason `class_lift`) and `ui.plan.not_trained_time_none`
>   for a 'time' group the block gives no credited set (E-76); a class-model day title with no day code is rebuilt from its lifts
>   when it names a piece the day no longer holds (`ui.plan.day_title_plain`, E-78).
> * **generate.mjs**: a test week's long day with a work-up is `warning.test_day_long` (E-73).
> * **Validators** (§6): see the B4 readings under §6.
>
> **Engine 0.4.0 amendments, fix round 1 / F1 (time, volume and structure; model 1.3.0; 2026-10-09) - binding.** Decisions:
> `engine/DECISIONS.md` E-81 ... E-96; model data: `tools/fixture/fix-r1-f1.mjs` (applied by both builds after `integrate-b4.mjs`);
> tests `tests/review-f1.test.mjs`. Additive: no field removed or renamed.
> * **Rules** (§3.3, additive): `volume.one_target_groups {groups, modifiers, unless_focus}`, `volume.calves.{athlete_cap_modifiers,
>   athlete_climb, optional_slot_below_leg_days}`, `volume.rear_from_rows_min` (1.5), `volume.pattern_keep {buckets, order, sets,
>   max_per_week}`, `stairway.release_rounding {mode: 'half_up'}`, `stairway.hold_rules {min_N, min_climb, hold_extra_weeks}`,
>   `placement.added_slots {entry_sets, only_at_exercise_block_start, big_lines_on_optional_day}`, `prehab.credits: 'none'` (was
>   by catalog), `time_model.skill_in_warmup_min` (6) + `skill_in_warmup_short {at_or_below_minutes, min}`, `tests.replaces_top_set
>   {back_off_rir_add, back_off_rir_min}`, `r3_approved[]` (the 13 round-3 ids), `ordering.block_editing.id_format` =
>   `blk.<weekday>-<day_type slug>.<kind>.<n>`.
> * **Block ids** (§5): `blk.<weekday lower-case>-<day type slug>.<kind>.<n>` (slug: a-z, 0-9, '-'), e.g. `blk.mon-a1.strength.1` -
>   unique within a week, the same id every week of the block (E-90).
> * **Test items** (§5): when `rules.tests.replaces_top_set` is set and the lift has 2+ planned sets, the `.test` item IS the week's top
>   set - 1 set, the lift's `credits`, `note.test_top_set_replaces {test}` (else `note.test_top_set`, `credits {}`); the lift's own
>   item carries the other `sets - 1` as back-off sets: item flag `back_off`, effort RIR = planned + `back_off_rir_add` (at least
>   `back_off_rir_min`, at most 3), `note.test_back_off {n, rir}` first. V14 counts the top set; V17 accepts the back-off effort; V12 /
>   H04 read a test of a work lift as the work lift (E-91). `SlotFill` / item `flags` add `back_off`.
> * **Origins** (§3.4 SlotDef / item `origin`): add `circuit_swap` (a circuit station that took a donor station's place; was
>   `bonus`) and `pattern_kept` (a big mover's pattern station on the optional day, fixed sets, no stairway; slot suffix `.yNN`).
> * **plan.time_check** (§5): `trained_below_floor[].reason` adds `circuit_time` (a big group a timed circuit holds below its floor,
>   no donor station; E-93); `lowered_peak` may list groups of a plan that `fits` when the peak allocation holds less than the
>   level ceiling (E-92).
> * **Superset recommendations**: `days[].superset_recommendations` also lists the pairs `generate` forms from exercises whose layout
>   partner was cut (an isolation and the joint care at the head of the next block may pair; ids `X<n>`, E-90).
> * **volume.mjs**: keep order, peak guard, structure cut, one hips target, half-up release, 2-set added exercises, compound-first
>   steps, calves, pattern stations, the absolute ceiling (`volume.priority.absolute_cap` on every line's all-days total), the main-day
>   total in the block verification; the week's 7 % ceiling counts the main days, the all-days total stays under
>   `stairway.limits.total_weekly_ceiling` (E-81 ... E-95).
> * **shape.mjs**: `circuitWorkSeconds(N, steps, CS, maxStep)` - with `maxStep` the steps scale up so the last week reaches
>   `work_s_max` (E-93).
> * **week.mjs**: `estimateMinutes` costs a skill folded into the warm-up (E-96); `pairRemaining` (E-90); racket 50+ arm care
>   `keep_main_day` (E-89); the class model tests its work lifts (E-91).
> * **Validators** (§6, `CHECK_IDS` unchanged at 51): V13 adds `line_absolute_cap`; V18 counts the rows' rear-delt credit
>   (`rear_delt_weekly` needs a rear-delt station or `rear_from_rows_min` row credit; not judged when back is not trained directly) and
>   reads `circuit_time`; H21 adds `flat_second_half` and `group_hold` (`stairway.hold_rules`; big groups, planned climb 3+, not held
>   below the floor, below the absolute ceiling) and needs the calves' climb from a group held below its floor.
>
> **Engine 0.4.0 amendments, fix round 1 / F2 (athletic work; model 1.3.0; 2026-10-09) - binding.** Decisions: `engine/DECISIONS.md`
> E-97 ... E-109; model data: `tools/fixture/fix-r1-f2.mjs` (applied by both builds after `fix-r1-f1.mjs`); tests
> `tests/review-f2.test.mjs`. Additive: no field removed or renamed.
> * **Rules** (§3.3, additive): `athletic.f2 = {share {tolerance, enforce}, ankle_block {outside_day_split, outside_athlete_cap,
>   time_class, bone_loading_days, bone_loading_min_peak, bone_loading_codes, keep_for_ankle_track, keep_from_minutes}, tracks
>   {from_budget, per_station {jumps, throws, low_contacts, cod_cuts}, max_stations {jumps, throws, low_contacts, cod_cuts, sprint_m},
>   sprint_second_station, add_from_minutes}, ballistic_stage_cues {RC1, RC2, RC3}, stage_drill_change {enabled,
>   ankle_first_block_in_place}, throws {per_set, per_side, situp_range, one_side_id_re, majority_plane_first}, cod {reps_from_cuts_per_rep,
>   reactive_drill_ids, cuts_per_rep{}}, contacts_per_cycle{}, sprint {max_velocity_station}, olympic_ceiling {enabled,
>   hang_before_floor}, pre_season_after_single_block, pick_ok_ids[]}`; `athletic.stages.pre_season_after_single_block`
>   ('advance_one'); `athletic.reconcile.per_set_min.throws` 6 (was 8), `.low_contacts` 6 (was 10); `time_model.work_minutes.ankle`,
>   `rest_class_minutes.ankle`, `rest_class_by_time_class.ankle`, `minutes_per_set.ankle`.
> * **Profiles** (§3.5, additive): `sports[].olympic.ceiling` ('power' | 'pull', from 04 `triple_ext.ceiling`), `sports[].cod_reactive`
>   (04 `cod.reactive`).
> * **athletic.mjs** (new exports): `ensureAthleticStations(mains, ctx, kit, olderDefault, helpers)` (the tracks' stations from the
>   block's peak targets; called by `week.ensureAthleticTracks` when `rules.athletic.f2.tracks.from_budget`; marks slots `track`,
>   `track_added`, `ankle_block`, `ankle_keep`, `time_class: 'ankle'`, `counts_in_cap: false` for the ankle block), `pairAthleticBlock(day)`
>   (the jump + throw contrast pair `AJ1`, superset_eligible), `isFloorJump(ex)`, `olympicAboveCeiling(ex, sport, rules, derived)`.
>   `planAthletic` result: `weeks[].slot_plan[slot_id].sets` (only when the stairway runs the ankle block at fewer sets than the
>   volume engine gave it; `generate` applies it) and `weeks[].share {target, planned}`; warnings `athletic_capacity` may carry
>   `args.key` `athletic.key.jumps` / `athletic.key.ankle` (or `contacts`) and the key `warning.athletic_capacity_block` (the family
>   climbs across the block, not every week). `cueKeyFor` returns the stage cue of a single ballistic jump (`note.ballistic_stick` /
>   `note.ballistic_land_go` / `note.ballistic_repeat`). `perSetBounds`: throws 6-10 (5-10 a side), the sit-up pass not fixed, COD and
>   patterned hops in whole reps / patterns. `athleticBudget`: no throws in the kit -> the share split counts the jumps only.
> * **select.mjs**: the Olympic ceiling filter (step 'profile'); pick-ok athletic records; stage / direction / single-leg / ladder /
>   one-side / main-plane scoring (E-99, E-101); the reactive : ballistic station count from the exercise block's targets.
> * **dose.mjs**: a COD drill with several cuts a rep -> `reps {type: 'fixed', value: reps}` + `note.cod_reps {cuts}` (athletic per_set stays
>   in cuts); a ballistic circuit station's effort is `effort.max_intent`.
> * **week.mjs**: the Olympic budget trim runs before the athletic tracks; the ankle block is outside the jump / throw split, the
>   athlete-cap count and the stay-active 'one athletic station a day' cut; the athlete-cap trim removes priority groups last; the
>   jump test may join the speed-test day before it joins a rep-max day.
> * **shape.mjs**: a pre-season after a single-exercise-block stairway takes the next Receive-Create stage.
> * **generate.mjs**: applies `slot_plan[].sets`; a ballistic circuit station opens its circuit.
> * **Validators** (§6, `CHECK_IDS` unchanged at 51): V27 adds `share_over` (E-97) and reads the split capacity warnings; V13 leaves
>   the ankle block out of the athlete cap; V19 reads the Olympic ceiling.
> * **i18n**: `note.ballistic_stick`, `note.ballistic_land_go`, `note.ballistic_repeat`, `athletic.key.jumps`, `athletic.key.ankle`,
>   `warning.athletic_capacity_block`, `note.cod_reps`, `why.olympic_ceiling`, `olympic.ceiling.power` / `.pull` (EN + ES, ES
>   PROPOSED).
>
> **Engine 0.4.0 amendments, fix round 1 / F3 (selection, dosing and the printed plan; model 1.3.0; 2026-10-09) - binding.** Decisions:
> `engine/DECISIONS.md` E-110 ... E-134; model data: `tools/fixture/fix-r1-f3.mjs` (`amendRulesF3`, `amendExerciseF3`, `UI_F3`,
> `F3_FINAL`, `TEXT_F3`, `ES_PRIORITY_F3`; applied by both builds after `fix-r1-f2.mjs`); tests `tests/review-f3.test.mjs`. Additive:
> no field removed or renamed.
> * **Rules** (§3.3, additive): `selection.f3 = {dial {all_lower, keep_axial, skip_roles, flipped_bilateral_counted}, non_spinal_hinge
>   {prefer_re, avoid_re, deadlift_re, weight, hotspot_extra, hotspot_avoid, second_bilateral_deadlift, hotspots}, core_low_back
>   {hotspots, anti_bonus, avoid_re, avoid}, hanging_core {re, penalty}, core_swaps_by_category, swaps_not_on_day,
>   axial_high_non_axial_day, families[] {id, re, lying?}, family_penalty, lying_week_max, powerlifting_canonical {lift_style, prefer{},
>   weight}, glute_with_leg_curl {enabled: false, ...}, level_hard {skills, max_ladder, circuit_any_above}, delt_variants
>   {side_focus_choices, side_focus_keep_rear, second_rear_to_side}}`; `selection.hotspots.ACL_LANDING_CUTTING` / `.LOW_BACK_LOADING`;
>   `selection.variations.values` (`incline_bench` / `kettlebell` / `plate_at_chest` never contradict the record name, new `db_at_chest`);
>   `rest.after_pair_numbers` (true); `reps.rep_hint.cap_max_compound_lte` (10); `reps.preference.heavy_powerlifting.first_lift_of_day_shift`
>   -2 (was -1); `reps.athlete_vol_phases.off_late_single_block_step {enabled: false, from, to, at}`; `reps.class_levels.strength_buckets`;
>   `effort.circuit_intensifier {enabled, kind: 'hold', per_day, hold_s}`; `legal.parq_url`.
> * **i18n** (§1.6): `es_review.json` may hold `priority_review[]` (translated ES lines the coach should review first; sorted, unique).
> * **select.mjs**: the laterality dial takes every lower station but the tested lifts and the counted axial squat / hinge, one way only
>   (toward the plan's end share); FOCUS slots of a lower muscle steer the share; delt stations take side / rear picks by the client's
>   Focus (`why.delt_variant`); above-ladder high-skill picks (any above-ladder pick in a timed circuit) are fallbacks; a hot spot's
>   avoided pick, or an above-level one, is `weak` (the real exercise comes back with a detail); swaps never name another exercise of the
>   day; the F3 weights (`f3Score`).
> * **dose.mjs**: new export `intensifierEligible(slot, fill, exercise, derived, model)`; `doseItem` reads `position.is_last_intensifier`
>   when given (else `is_last_resistance`); a superset partner's rest is `{type: 'after_pair', min, max}` (its class rest); a pair core
>   item too; `repClassFor` reads a delt station's variant from the exercise it holds; a heavy two-legged compound of an athlete keeps its
>   rep-hint top in every block (`note.rep_cap`); the class strength table only on `class_levels.strength_buckets` work slots; a one-arm
>   Olympic lift is `reps {type: 'per_side'}` + `note.per_side`; `doseConditioning(slot, fill, week, derived, model, {day, position})` for
>   a circuit station: the last stairway week's day's last eligible station carries `effort.last_set: 'hold'`, `intensifier: true`; a
>   `pattern_kept` slot gets `note.pattern_kept`.
> * **generate.mjs** (minimal seams): `position.is_last_intensifier` (the day's last item `deps.intensifierEligible` accepts); a circuit
>   station is dosed with `{day, position}`.
> * **shape.mjs** (minimal): the late off-season VOL2 -> VOL3 step after the halfway week of a single-block stairway when
>   `off_late_single_block_step.enabled` (off by default).
> * **Validators** (§6, `CHECK_IDS` unchanged at 51): V12 `myo_not_last` / V17 `myo_rule` accept a MYO on the day's last ELIGIBLE item
>   (every resistance item after it never takes one: a free-weight compound, a `never_credit_classes` lift, calves for an Achilles hot
>   spot, a machine compound whose matrix cell has no `myo_if_last`).
> * **render.mjs / explain.mjs**: the minutes promise only when true (`ui.plan.supersets_today_over[_none]`, `ui.plan.day_over[_none]`,
>   `warning.supersets_needed_over`, `warning.test_day_long_tests`); every switchable block (`accessories`, `cooldown` too;
>   `ui.plan.edit_aerobic_day`); `check.failed.V28_more_single` / `_more_two`; '(Focus)' only for a Focus muscle, else '(bonus)';
>   the Focus muscles header line (`ui.plan.focus_add`), `ui.plan.profile_label`; one optional tag; the flat release stamp
>   (`ui.plan.release_stamp_flat`, `release.who.*`), the health-check line (`ui.plan.health_check_ok` + `ui.plan.parq_link`), the footer
>   link; 'climbing every week' only when true (`ui.plan.trained_directly_block`, `_circuit`, `ui.plan.schedule_fits_block`,
>   `warning.time_lower_peak_block`), below-floor groups out of the 10+ list, `ui.plan.calves_line[_flat]`; the weekly sets table with
>   every FOCUS group (`ui.plan.sets_not_direct`, `ui.plan.sets_class_lift`); `rest.after_pair_seconds`, `ui.plan.superset_leftover[_one]`;
>   superset partners printed next to each other (a later block's partner after its mate); intensifier lines by day
>   (`effort.drift_intensifier_days[_circuit]`, `effort.intensifier_days[_circuit]`, `effort.last_set.hold`, `effort.how_hard_no_int`);
>   `instruction.1_bridge`; `ui.plan.core_supersets_line`; 'How to adjust this plan' (`guide.adjust.*`); `plan.stairway_intro_half`;
>   change lines per FOCUS group (`changes.held_group`, `changes.at_target_group`); every test item 'Test: ...'; `ui.plan.heavy_play_plan`.

**Authority for numbers and coaching rules** (highest first): `coach_answers_round3.md` (COACH-R3, newest; answered 2026-10-09) >
`coach_answers_round2.md` (COACH-R2) > `coach_answers_full.md` (COACH-ANSWER) > `coach_answers.md` > OBSERVED sheet facts >
`generator_spec_v1.json` 1.1.0 (+ `_meta.integration_decisions`) > `synthesis/12_volume_algorithm_v1.json` (content v1.1) > other
synthesis files (INFERRED / SCIENCE / PROPOSED). (Before round 3 was answered the round-3 questions were **open**: the engine used each
question's proposal, the value carried `"r3": "R3-…"` in `model/rules.json`, code had the comment `// R3-pending: R3-…`, and the plan
lists the ids in `meta.r3_pending`; the approved answers are applied by the 0.4.0 stages above.) **Authority for shapes, names, file layout and APIs**: this file. **Every decision taken where the
sources are silent or conflict is in `engine/DECISIONS.md` (D-01 … D-45)**; they are referenced here as `D-nn`.

The canonical, machine-checked example of every runtime file is **`engine/fixtures/mini-model.json`**, built by
`node tools/fixture/build-fixture.mjs` and checked by `node tools/fixture/check-fixture.mjs`. In v1.1 the fixture is a *full*
reference compile (731 exercises, all 30 templates with their variants, all 127 profiles, the 52-sport picker, 26 activities,
complete EN, partial ES) — "mini" is kept as the file name only (D-44). When this document and the fixture disagree on a
*shape*, the fixture wins and this document gets fixed.

---

## 0. Contents

1. Global conventions (layout, ownership, runtime rules, determinism, vocabularies, why-codes, i18n, hard rules, round-3 tags)
2. Intake contract (`intake/2`) and check-in contract (`checkin/2`)
3. Runtime model files (`model/`): manifest, catalog, rules, templates, profiles, i18n + compile rules
4. Engine modules: exact exports, typedefs, required behaviour (who owns what)
5. Plan output schema (`plan/2`)
6. Validation checks (V1-V26, H01-H22)
7. Why-code registry
8. Tests contract (unit, invariants, determinism, i18n, golden)
9. Acceptance targets for the 8 sample clients (derived values the engine must reproduce)
10. Decisions → `engine/DECISIONS.md`
11. Change log

What changed from contracts/1.0.0 (one line each; details in the sections):
round 2 applied (stairway, no deload inside a block, no check-in = no change, no lifestyle inputs, effort 10 = successful max,
floor 10, small muscles 10/12/15 on the big caps, KB swing 0 credit, thruster 1 / 0.5 / 0.25, face pull = shoulder work,
2-4 exercises per muscle group, two spine days, tests before / end only and never from zero, 60+ power work opt-in,
release every build, coach health-check bypass, pre-season 60 % + taper, cardio adjustable, Olympic up to 4 × a week with
clean / snatch day pattern, 3-5-rep full catches, power language); every popular US sport + swimming + the "stay athletic
and active" door (pickleball, HYROX …); the coach's 7 sample plans + the pickleball bonus replace the 5 v1.0 samples
(moved to `samples/_retired_v1_0/`).

---

## 1. Global conventions

### 1.1 Repository layout and ownership

```
blaze-camp-model/                       (code root; becomes a git repo)
  model/                                B1  compiled runtime data (generated; never hand-edited)
    manifest.json  catalog.json  rules.json  templates.json  profiles.json
    i18n/en.json  i18n/es.json  i18n/es_review.json
    MODEL_VERSION  CHANGELOG.md  COMPILE_REPORT.json
  engine/                               pure ES modules, no I/O
    CONTRACTS.md  BUILD_PLAN.md  DECISIONS.md          architect
    CONTRACT_REQUESTS.md                               any builder (append-only; integrator resolves)
    fixtures/mini-model.json                           architect (generated by tools/fixture; never hand-edited)
    version.mjs  util.mjs  model.mjs                   B4 (first versions by the architect, so B2 / B3 start at once)
    intake.mjs  shape.mjs  volume.mjs                  B2
    athletic.mjs  budget.mjs  timefit.mjs              B2 (v0.4: athletic.mjs stage B2, timefit.mjs stage B1)
    week.mjs  select.mjs  dose.mjs                     B3
    validate.mjs  explain.mjs  render.mjs  generate.mjs   B4
  tools/                                CLIs (may use node:fs, node:path, node:crypto, node:url)
    fixture/build-fixture.mjs  fixture/*.mjs  fixture/check-fixture.mjs   architect (B1 may copy code from it); v0.4 amendment
                                                       layers fixture/round3.mjs (stage B1), fixture/athletic-b2.mjs (stage B2),
                                                       fixture/render-b3.mjs (stage B3), fixture/integrate-b4.mjs (stage B4)
    compile-model.mjs  check-model.mjs                 B1
    compile/*.mjs  compile/es/*.mjs                    B1 [1.1.1] compiler modules + Spanish tables (sources, catalog, rules,
                                                       templates-profiles, patches, crosscheck, i18n)
    generate-samples.mjs  sweep.mjs                    B4 (sweep.mjs: the random-intake sweep, v0.4 stage B4)
  tests/                                node:test, **/*.test.mjs  (scaffold + helpers B4; module tests by module owner)
    run-all.mjs  package.json                          [1.1.1] lets `node --test tests/` run on Node 22 (a directory argument is
                                                       loaded as a module: package.json main -> run-all.mjs imports every test)
    helpers/  invariants/  golden/
  samples/
    intakes/01-swimming.json … 08-pickleball-genpop.json   architect (the coach's R2-GEN-07 choice + bonus)
    plans/<name>.json  <name>.<lang>.md  (+ <name>.en.md when lang is es)   generated by tools/generate-samples.mjs
    _retired_v1_0/intakes/                              v1.0 samples (intake/1, not run)
  synthesis/ analysis/ dumps/ raw/ answers_raw*/        READ-ONLY sources. Never write there.
```

### 1.2 Runtime rules (all engine files)

* Plain modern JavaScript ES modules (`.mjs`), Node 22, **no npm dependencies**, no TypeScript, no build step.
* Engine files import **only** other `engine/*.mjs` files. No `node:` imports, no `fs`, no `process`, no `console`, no `fetch`.
  They run unchanged in a browser.
* **No `Date.now()`, `new Date()` without an argument, `Math.random()`, `performance.now()`, locale-dependent APIs
  (`toLocaleString`, `Intl`, `localeCompare`) or object-identity-dependent ordering.** Dates are ISO strings `YYYY-MM-DD`;
  date arithmetic uses `Date.UTC(y, m-1, d)` only (util helpers).
* Pure functions: inputs are never mutated (copy first). Every exported function has a JSDoc block with `@param`/`@returns`
  using the typedef names of §4.0.
* **Data-driven**: any number or list that exists in `model/rules.json`, `templates.json` or `profiles.json` is read from the
  model, never re-typed in code. A literal in engine code is allowed only for structure (indices, the string ids of §1.4), or
  with `// INFERRED: <why>` when no table exists (then also add it to `CONTRACT_REQUESTS.md` so B1 can move it into rules).
* Programmer errors throw `EngineError` (from `util.mjs`) with a `code`; user-input problems are returned as issues, never thrown.
* Every rounding of sets uses `roundHalfUp` (util): `floor(x + 0.5 + 1e-9)`. Comparisons of fractional sets use `EPS = 1e-9`.

### 1.3 Determinism

* Same intake + same model → **byte-identical** plan JSON (`JSON.stringify(plan, null, 2)`).
* `seed = 'c53:' + hash53(canonicalJSON(intakeForHash) + '|' + model.version)`; `intakeForHash` = the normalized intake without
  `id`, `email`, `release.accepted_at`, `release.signer_name` and any key starting with `_`. `canonicalJSON` sorts keys recursively.
* Tie-breaks: sort by (score desc, `tieBreak(seed, slot_id, exercise_id)` asc, `exercise_id` asc). Never rely on sort stability
  except as the last key.
* Iteration order: weekdays Mon→Sun; muscles in `rules.muscles.order`; groups in `rules.muscles.groups.order`; slots in session
  order; objects emitted with keys in the order this document lists them (build objects literally).
* Numbers in output: fractional weekly sets `round2` (2 decimals, half away from zero); rates as decimals (0.05); minutes rounded
  to integers. No `NaN` / `Infinity` / `undefined` anywhere in output (use `null`).
* `intake_hash = 'c53:' + hash53(canonicalJSON(intakeForHash))`.
* λ (stairway scale) is solved by bisection with exactly `rules.stairway.lambda.iterations` (60) iterations from [0, 1]; it is
  stored rounded to 4 decimals for display only; computations use the unrounded value (D-18).

### 1.4 Canonical vocabularies (string ids used everywhere)

| Vocabulary | Values |
|---|---|
| Muscles (`rules.muscles.order`) | target: `quads hamstrings glutes chest lats_upper_back side_delts rear_delts biceps triceps calves`; core: `abs_obliques`; credit-only (reported, never filled): `forearms front_delts traps adductors neck` (CAT-02) |
| Muscle groups (R2-SES-05; `rules.muscles.groups`) | `quads hips back chest shoulders biceps triceps calves core` — hips = glutes + hamstrings, shoulders = front / side / rear delts + traps (INFERRED; R3-SES-01) |
| Muscle class / region | `big` `small` `unplaced`; region `lower` `upper` `core` |
| Goals (F07) | `muscle strength athletic active fat_loss general hybrid` (`active` = "Stay athletic and active", COACH-CHAT 2026-10-08) |
| Template families (D1) | `aesthetics athletic strength fat_loss_bootcamp hybrid_crossfit no_equipment` |
| Client level (volume) | `L1 L2 L3` (Pro setting = L3 opt-in, not a level) |
| Exercise ladder | `foundational intermediate advanced` |
| Plan modes (F25) | `fixed_12 fixed_8 maintenance_4_6 week_by_week year` (+ overlays `season` for competitive athletes, `prep` for event dates) |
| Training-block types | `stairway pre_season taper in_season maintenance recovery` — **recovery only between two stairway blocks; maintenance only as its own block** (R2-VOL-07) |
| Week phases (labels) | stairway weeks: `ACCLIMATION DRIVE HARDEST` (labels only, from `rules.stairway.phases_by_N`); other blocks: `PRE_SEASON TAPER IN_SEASON MAINTENANCE RECOVERY POST`. **Retired**: `ADAPT`, `DELOAD`, `TEST` (a test is a flag on a week, not a phase) |
| Season phases | `OFF_EARLY OFF_BUILD OFF_LATE PRE IN POST` (null when not competitive) |
| Season types (06 §8.2.5) | `A` game-heavy team · `B` diamond · `C` meet / championship · `D` combat · `E` tournament individual · `F` endurance / event · `G` strength / physique · `H` seasonal outdoor · `I` gen-pop / no season |
| Receive-Create stages | `RC1 RC2 RC3` (1 Land, 2 Land & Go, 3 Repeat; R2-ATH-03) |
| Athlete rep phases | `VOL1 VOL2 VOL3` (PER-11; one per off-season exercise block; pre-/in-season `VOL3`) |
| Athletic qualities (catalog) | `plyometric ballistic landing throw olympic sprint cod` (R2-ATH-02; KB swings `ballistic`, R2-VOL-05) |
| Olympic families | `clean snatch jerk loaded_jump swing`; day pattern `clean, loaded_jump → knee day`, `snatch, swing → hip day`, `jerk → either` (R2-ATH-04) |
| Template buckets | `WARMUP_GENERAL WARMUP_PREP CT_CORE_THORAX CP_CORE_PELVIS CORE_ANY CORE_OTHER SKILL AP_SPRINT AP_PLYO AP_JUMP_LIMITED_KNEE AP_THROW AP_COD AP_TRIPLE_EXT RP_BKD RP_UKD RP_BHD RP_UHD RP_HPUSH RP_VPUSH RP_HPULL RP_VPULL ISO_QUAD ISO_LEG_FLEXION ISO_CHEST ISO_SIDE_REAR_DELT ISO_BICEP ISO_TRICEP ISO_CALF FOCUS COND_AEROBIC COND_SPRINT_BUYOUT COND_CIRCUIT COND_WOD FUNCTIONAL RECOVERY_ARM_CARE PREHAB_LOWER PREHAB_NECK COMPLEX TEST` (`ISO_HAM`, `RP.HD.ISO` = retired aliases of `ISO_LEG_FLEXION`, CAT-09) |
| Credit classes (`rules.credit.classes`) | `BKD UKD BHD UHD GLUTE_ISO LEG_FLEXION LEG_EXTENSION HPUSH VPUSH DIPS THRUSTER HPULL VPULL PULLOVER ISO_CHEST ISO_SIDE ISO_REAR FACEPULL ISO_FRONT ISO_BICEPS ISO_TRICEPS ISO_CALF ISO_NECK CORE ATHLETIC NONE` |
| Station roles (05) | `warmup core_block skill athletic power work paired_upper secondary secondary_upper accessory nuance survival iso focus conditioning aerobic_block circuit_station prehab` (+ engine-added origins `bonus focus_added aerobic_addon cooldown prehab_added`) |
| Block kinds (plan; order = `rules.ordering.block_order`) | `warmup core skill athletic power strength accessories prehab circuit conditioning aerobic cooldown` |
| Rep classes | `main_bilateral_compound machine_stable_compound unilateral_compound big_muscle_isolation small_muscle_isolation rear_delts calves core olympic plyo throw cod sprint skill wod prehab` |
| Aerobic colours | `A` Blue (short / high) · `B` Green (moderate) · `C` Orange (long / easy) · `LC` lactate clearance |
| Equipment profiles (F27) | `FULL_GYM BASIC_GYM HOME_BARBELL HOME_DB_BENCH KB_ONLY BODYWEIGHT HOTEL_GYM FIELD_TRACK_KIT` (+ derived `FULL_FACILITY FIELD_TRACK_NO_KIT`; a CrossFit box = `HOME_BARBELL` + extras, D-16) |
| Kit tokens | keys of `10_equipment_model.json > kit_tokens` (`dumbbell barbell rack cable machine_selectorized … medball hurdles open_space_long barbell_bumpers_platform rings sled …`). **Never** `band bands band_anchor chains weight_releaser` (`rules.equipment.banned_tokens`) |
| Machine ids (F29) | `leg_press pendulum hack_squat belt_squat leg_extension leg_curl_seated leg_curl_lying lat_pulldown assisted_pullup row_machine chest_press shoulder_press_machine cable_stack smith ghd_or_45deg reverse_hyper hip_thrust_machine` → kit token in `rules.equipment.machines` |
| Weekdays | `Mon Tue Wed Thu Fri Sat Sun` |
| Pain areas (F35) | `neck shoulder elbow wrist_hand upper_back lower_back hip_groin knee ankle_foot other` |
| Sports (F11) / positions (F12) / activities (F11r) / profiles | the ids in `model/profiles.json > picker.sports[].id`, `picker.sports[].positions[].value`, `picker.activities[].id`, `sports{}` keys (52 sports, 26 activities, 127 profiles; 04 v1.1) |

### 1.5 Why-codes

Every non-trivial decision carries one or more **why** objects (exactly these keys; `args` optional):

```json
{"key": "why.two_spine_days", "ref": "R2-SES-01", "args": {"pattern": "squat"}}
```

* `key`: an i18n key under `why.` (registry §7). `ref`: a coach answer id (`VOL-07`), a round-2 id (`R2-SES-01`), a round-3 id
  (`R3-VOL-04`, PROPOSED default), a rule id (`V10`, `D-10`), `COACH-CHAT 2026-10-08`, or `INFERRED` / `PROPOSED`.
  `args`: flat object of strings / numbers filling `{placeholders}`.
* Build them with `why(key, ref, args)` from `util.mjs` (frozen plain object; `args` omitted when empty).
* Where: every plan item (`items[].why`), day (`days[].why`), week (`weeks[].why`: step, phase, block type, tests), and
  `meta.why` (profile, level, template, modifier, share profile, season plan, aerobic count).

### 1.6 i18n conventions

* The engine and the plan JSON store **keys only**; all words are resolved in `render.mjs` / `explain.mjs` through
  `model.t(lang, key, args)`. English is the default; Spanish is a full twin (R2-GEN-08: neutral Latin American Spanish,
  English gym term in brackets, e.g. `"Empuje de cadera con barra (Hip Thrust)"`; every ES line PROPOSED until he approves).
* Key namespaces: `intake.<field>.label|opt.<value>`, `exercise.<id>.name|cue`, `slot.<BUCKET>`, `block.<kind>`,
  `day.<family>.<days>[.<variant>].<day_type>`, `program.<id>.name`, `profile.<id>.name`, `sport.<id>.name`,
  `sport.<id>.position.<value>`, `sport.<id>.second_choice[.<value>]`, `sport_group.<id>.name`, `activity.<id>.name`,
  `goal.<id>`, `group.<id>`, `muscle.<id>`, `weekday.<Mon>`, `plan.phase.<PHASE>`, `plan.block_type.<type>`, `plan.*`,
  `season.<PHASE>`, `level.<L>`, `level.reason.<k>`, `reps.*`, `effort.*`, `rest.*`, `load.*`, `note.*`, `warmup.*`,
  `conditioning.colour.<C>`, `plyo.stage.<RCn>`, `changes.*`, `warning.*`, `warn.*` (spec copy), `refer.reason.*`, `check.*`,
  `locked.*`, `tests.*`, `why.*`, `instruction.*`, `ui.*`, `checkin.*`, `health.*`, `release.*`, `video.*`, `block.*`,
  `maint.*`, `unit.*`, `felt.*`.
* Placeholders `{name}` filled from `args`; unknown placeholders stay verbatim (never `undefined`).
* Fallback: missing ES key → EN string; missing EN key → the key itself (and H14 fails). `model/i18n/es_review.json` =
  `{"missing_keys": [...], "machine_translated": [...], "priority_review": [...]}` (v0.4 fix round 1 / F3: `priority_review`, optional,
  lists translated ES lines the coach should review first; sorted, unique, every key in `es.json`).
* The coach's instruction block (GEN-07) = `instruction.title` + `instruction.1..5`, rendered at the top of every plan.
* Copy marked `[LEGAL REVIEW]` (health check, release, coach bypass warning) comes verbatim from the spec's
  `inputs_schema.copy_placeholders`, `output.copy` and `adaptation.copy` (EN + ES) and is never edited by the engine.

### 1.7 The coach's hard rules (locked layer; each is a test and a validation check)

| Id | Rule (never breaks) | Source | Check |
|---|---|---|---|
| H01 | No bands, chains or weight releasers anywhere (exercise, swap, kit token, name, id) | EQ-01, EQ-07, EQ-08, EQ-12 | V9 |
| H02 | Never to failure on heavy compounds: compounds are "leave 1-2 (up to 3) in the tank" (RIR band 1-3, min 1); `MAX` only on the last set of small-muscle / bodyweight work; `MYO` only on the day's last machine or isolation exercise | GEN-08, VOL-13, VOL-15 | V17 |
| H03 | Power before strength (athletic and Olympic blocks precede strength work) | ORD-03, GEN-08 | V12 |
| H04 | Horizontal pull before vertical pull and horizontal push before vertical push inside a session — **except** when the vertical lift is the day's `work` (ORD-02 "the work first", D-30) | ORD-01, ORD-02, GEN-08 | V12 |
| H05 | Core block first by default (light opener 2 × 2, after the warm-up; the user may move it); never skipped on a training day | ATH-11, VOL-17, GEN-08, R2-SES-03 | V12, V18 |
| H06 | Hip-dominant lower paired with a push, knee-dominant lower paired with a pull, in every mixed session | UNI-11, ORD-06 | V11 |
| H07 | **Two spine days**: at most one heavy (counted) squat and one heavy (counted) hinge a week, **never on the same day**; every other squat / hinge exposure is non-counted (leg press, belt squat, hip thrust, back extension, single-leg DB …) | PER-04, EQ-11, R2-SES-01, R2-SES-02 | V10 |
| H08 | Credits: prime mover 1.0, helpers 0.25 (glutes 0.25 on squats / lunges / deadlifts / RDLs), hip thrusts and bridges glutes 1.0; dips 0.5 triceps + 0.5 chest; **thruster 1.0 quads + 0.5 front delts + 0.25 glutes**; face pull rear delts 1.0 + side 0.25; 10/10 = 1 set | VOL-09, LIB-14, LIB-16, UNI-01, R2-VOL-05, R2-LIB-04 | V14 |
| H09 | Athletic patterns (plyo, ballistic, **KB swing**, throw, Olympic, sprint, COD, conditioning, WOD, skill) never count toward muscle sets | VOL-10, R2-VOL-05 | V14 |
| H10 | Planned step never above 7 % for any muscle; the person's total weekly resistance sets rise by **strictly less than 10 %** week over week | UNI-05, VOL-05, R2-VOL-01 | V15 |
| H11 | No medball in aesthetics (goal `muscle`) main work — warm-up only; no medball load above 20 lb anywhere | ATH-05, EQ-06 | V16 |
| H12 | Never overhead squat or low-bar squat for older (60+), injured or high-volume clients; never snatch or depth jumps for injured / high-volume clients; **60+: no Olympic lifts, plyos or depth jumps unless `prefs.older_athletic_opt_in` (then with the warning); in Phase 0 depth jumps, high depth drops and snatches stay locked for 60+ even with the opt-in (D-05, R3-ATH-02)** | EQ-03, R2-ATH-08 | V5 |
| H13 | No sex / gender field anywhere (intake, derived, plan) | GEN-02, ATH-09 | V1, H13 |
| H14 | English default with full Spanish: every user-facing string through i18n; every key used has EN and ES (or is in `es_review.missing_keys`) | GEN-01, R2-GEN-08 | H14 |
| H15 | **No deload or maintenance week inside a training block**; recovery weeks only between two stairway blocks; maintenance only as its own block | R2-VOL-07 | V24 |
| H16 | **No sleep, stress, job or life input** anywhere (intake, derived, check-in, plan) | R2-GEN-04 | V26 |
| H17 | **Floor of 10** weekly sets (main days, group credit) for every trained FOCUS group in a stairway block (v0.4: circuits included; exemptions: pain-reduced, credit-only, a group the time check lists as not trained directly - then it has no direct exercise -, a work-lift big mover listed as trained below the floor; no warning exempts; not applied to pre-season / in-season / taper / maintenance / recovery) | R2-VOL-06, R3-SES-01, R3-SES-02 | V22 |
| H18 | **2-4 exercises per FOCUS group trained on a day, never 1** (full-body days included; calves and the core opener excepted; strength-family conjugate days flagged; a day that cannot hold 2 drops the group from that day, R3-SES-02) | R2-SES-05, R3-SES-01 | V23 |
| H19 | **Tests only before the block (week 1) and in its last week, never mid-block; never a 1RM or max-effort mile without a completed block** (5RM / 3RM, 80-90 %) | R2-PER-07 | V25 |
| H20 | **Release accepted for this build** (client, coach or guardian version); the health check runs unless a coach chose `coach_own_sop` | R2-GEN-03 | V21, V1 |
| H21 | **Stairway shape**: inside every stairway block the planned step is never larger in the first half than in the second, every trained group climbs by the minimum climb (2 sets, 1 in blocks <= 7 weeks, calves 1) and never drops a set, the main-day total rises, the last week is the hardest (highest total), and on 12 weeks the last 4 weeks are the 4 hardest; planned RIR never rises (never flat, no warning exempts) | R2-PER-03, R2-PER-04, R2-PER-05, R3-SES-02 | H21 |
| H22 | **No check-ins, the planned stairway only** (v0.4): every week is exactly the planned stairway week of its block; no check-in offer exists | R2-VOL-03, R3-VOL-02, R3-VOL-04 | H22 |

### 1.8 Round-3 tagging

`rules.json` values that a round-3 question owns carry a sibling key `"r3": "R3-…"` (a string, several ids comma-separated).
Engine code applying such a value has the line comment `// R3-pending: R3-…`. The plan surfaces them in `meta.r3_pending`
(sorted unique ids whose defaults shaped this plan). Round-2 ids are now answered: they appear only as `ref`s.

---

## 2. Intake contract (`intake/2`) and check-in contract (`checkin/2`)

### 2.1 Intake

Input to `generate()`. Mirrors `generator_spec_v1.json > inputs_schema` (intake/2). Unknown keys are rejected except keys
starting with `_` (comments) and `id`. **Any key named (case-insensitive, any depth) `sex`, `gender`, `sleep`, `stress`,
`recovery`, `job`, `hard_job_or_other_sport`, `life`, `energy` is an error** (H13, H16, V26). Example = `samples/intakes/01-swimming.json`.

```jsonc
{
  "schema": "intake/2",
  "id": "sample-01-swimming",
  "lang": "en",                                  // F00 en|es (default en)
  "units": "lb",                                 // F06 lb|kg
  "role": "self",                                // F39 self|client (first tap; routes health check + release version)
  "health_route": null,                          // F45 coach_screen|coach_own_sop (required when role == client, else null)
  "safety": {"heart": false, "surgery_6mo": false, "pregnant_postpartum_6mo": false,
             "injury_in_treatment": false, "doctor_said_no": false},   // F01; all 5 keys; null only when health_route == coach_own_sop
  "release": {"accepted": true, "version": "release.minor", "lang": "en", "guardian": true},
                                                 // F46 for THIS build: version release.client (self) | release.coach (client) |
                                                 // release.minor (age < 18; guardian true). accepted_at / signer_name may be
                                                 // present (UI) but are excluded from the hash and never read by the engine
  "age": 16,                                     // F02 int 10-90
  "body_weight": {"value": 145, "unit": "lb"},   // F05 required
  "experience": {"years_consistent": 2, "months_off_last_2y": 0, "former_competitor": false},   // F17 (years may be 0.5)
  "goal": "athletic",                            // F07 muscle|strength|athletic|active|fat_loss|general|hybrid
  "format": null,                                // F07b gym|bootcamp (goal fat_loss|general only; default gym)
  "sport": {                                     // goal athletic only, else null
    "competitive": "competitive",                // F11a competitive|recreational|none
    "sport": "swimming",                         // F11 picker sport id (competitive)
    "position": "middle",                        // F12 positions[].value or null (-> sport default_profile)
    "position_detail": "free",                   // F12 second_choice value (swimming stroke, lacrosse m|w) or null
    "level_of_play": "high_school",              // F13 youth_club|high_school|college|pro|masters|amateur|null
    "season": {"type": "next_season_start", "date": "2027-02-01"},   // F14 next_season_start|in_season_until|competition_date|no_season (+date)
    "practice": {"practice_days_per_week": 6, "game_days": []}       // F15 (required when competitive); game_days ⊆ weekdays ∪ {varies}
  },
  "activity": null,                              // F11r: {"ids": [<=2 activity ids], "play_days": [weekdays], "event_date": null|ISO,
                                                 //        "league_sport": null|value, "style": null|value}
                                                 // required when goal == active or sport.competitive == recreational; optional
                                                 // for fat_loss|general ("I also play something"); null otherwise
  "priority_muscles": [],                        // F09 Focus muscle 1 / 2 (v0.4: alias of focus_muscles): <= 2 of quads glutes hamstrings back chest
                                                 // shoulders biceps triceps calves core v_taper (side_delts / rear_delts read as shoulders; v_taper = 2 slots)
  "lift_style": "balanced",                      // F10 volume_lighter|balanced|heavy_powerlifting
  "schedule": {"days_per_week": 3, "weekdays": ["Mon", "Wed", "Fri"], "session_minutes": 60, "start_date": "2026-10-12"},
                                                 // F22 2-6, F23, F24 30|45|60|75|90|105|120 (105/120 competitive only), F26
  "plan": {"mode": "fixed_12", "maint_reason": null, "maint_weeks": null,
           "previous_cycles": {"count": 0, "last_block_finished": true},   // v0.4 (R3-PER-02); last_had_holds_or_pain = alias (true -> not finished)
           "tests": ["strength", "jumps"], "just_finished_block": false},
                                                 // F25, F25b, F25d (1-8, default 4), F25c, F26b (["none"] = no testing), one_rm_gate tap
  "equipment": {"profile": "FULL_GYM", "extras": [], "machines": [], "preference": "none",
                "detail": {"heaviest_db_pair": null, "medball_lb_owned": [4, 6, 8, 10], "box_height_in": 24,
                           "running_space": "10_20m", "cardio_options": ["bike", "rower"]}},
                                                 // F27, F28 kit tokens, F29 machine ids, F29b machines|free_weights|dumbbells|none, F30-F34
  "pain": [],                                    // F35+F36: [] = "Nothing"; else [{area, side left|right|both, severity mild|moderate|severe, worse_with[]}]
  "exclusions": [],                              // F38 running|jumping|barbell|lunges|overhead_pressing|floor_work|machines|other
  "output_mode": "plan_only",                    // F43 RETIRED in v0.4 (R3-VOL-02): read for old intakes, always normalized to plan_only
  "prefs": {"core_position": "start", "optional_days": "separate", "variety_ab": false, "heavy_unilateral": false,
            "supersets_for_fatigue": false, "cardio_adjust": 0, "older_athletic_opt_in": false, "split_style": "default"},
                                                 // F44 (+ cardio_adjust -3..3, older_athletic_opt_in (age >= 60 only),
                                                 //   split_style default|upper_lower|ppl = PROPOSED F44 addition, D-15)
  "growth_stage": "post_phv",                    // F03 (age < 18 and athletic) pre_phv|circa_phv|post_phv|not_sure|null
  "email": null,                                 // F41 never read by the engine
  "coach_rule_pack_ids": []                      // Phase 0 accepts [] only (coach_rule_hooks = Phase 1)
}
```

**Normalization** (`validateIntake`): fill defaults (`lang en`, `units lb`, `format gym` when shown, `lift_style balanced`,
`schedule.weekdays` = the template's default weekdays when missing, `session_minutes` = `rules.session.minutes_default` by
population, `plan.mode fixed_12`, `plan.tests ["none"]`, `maint_weeks 4` for maintenance, `output_mode plan_only` (always, v0.4), all `prefs`
defaults, `previous_cycles {0, last_block_finished: true}`; `week_by_week` becomes `fixed_12` with `plan.view: 'week'`), convert `body_weight` to `body_weight_lb` in Derived (1 kg = 2.20462 lb, round2).

**Errors** (`ok: false`, plan `status: 'invalid'`): missing required field; enum out of range; > 2 priority muscles (from the
form; when the engine is called directly it keeps the first 2 and warns V8);
`year` for a competitive athlete; any forbidden key (sex / gender / lifestyle, H13, H16); banned kit token in `extras`;
`release.accepted !== true` or a release version that does not match role / age (`release_missing`, V21, H20);
`role == client` without `health_route`; `older_athletic_opt_in: true` under 60 (ignored + warning, not an error).
**Warnings**: 105/120 min for a non-competitive client (clamped to 90, `warning.minutes_competitive_only`), split style
not available for the days (`warning.split_style_unavailable`).
**Refer** (plan `status: 'refer'`, no weeks): any `safety.*` true when `role == self` or `health_route == coach_screen`; any pain
`severity == "severe"` (always, also with the coach bypass) (V1).

### 2.2 Check-in (`checkin/2`) - RETIRED in engine 0.4.0 (R3-VOL-02 'we're only doing outputs'); kept for reference only

```jsonc
{"schema": "checkin/2", "week": 3,
 "sessions": [{"weekday": "Mon", "done": true, "effort": 8}, {"weekday": "Wed", "done": false, "effort": null}],
                                               // effort = his EFFORT menu 1-10; 10 = "the max I could do, and I made it" (R2-VOL-02)
 "felt": [{"slot_id": "Mon.S1.s09", "value": "right|wrong|pain|couldnt"}],   // default right; couldnt = the failed set
 "pain_now": [{"area": "knee", "trend": "better|same|worse"}],
 "results": [], "block_action": null}          // null | stop_block_start_maintenance | maintenance_extend:<n> | maintenance_end:keep|change_plan|new_block
```

No life / sleep / stress question (R2-GEN-04, H16). v0.4: nothing reads a check-in; `adapt()` is gone (§4.12).

---

## 3. Runtime model files (`model/`)

`tools/compile-model.mjs` (B1) reads the read-only sources and writes these files. The engine never reads files: tools read
them and pass plain objects to `loadModel(raw)` where

```js
raw = { manifest, catalog, rules, templates, profiles, i18n: { en, es, es_review } }   // = the fixture's top-level keys minus _fixture
```

All model JSON is UTF-8, keys in the order shown, arrays sorted where stated. **No timestamps anywhere in `model/`** (a
re-compile of the same sources is byte-identical).

### 3.1 `manifest.json` (`manifest/2`)

```json
{"schema": "manifest/2", "model_version": "1.1.0", "spec_version": "1.1.0", "contracts_version": "1.1.0",
 "files": {"catalog": "catalog.json", "rules": "rules.json", "templates": "templates.json", "profiles": "profiles.json",
           "i18n": {"en": "i18n/en.json", "es": "i18n/es.json", "es_review": "i18n/es_review.json"}},
 "languages": ["en", "es"], "default_lang": "en",
 "counts": {"exercises": 731, "templates": 30, "profiles": 127, "sports_in_picker": 52, "activities": 26},
 "sources_sha256": {"generator_spec_v1.json": "…", "synthesis/02_exercise_catalog.json": "…"}}
```

`model_version` also goes to `model/MODEL_VERSION` (one line). `CHANGELOG.md` lists every coach-correction patch applied
(id, target, rule); `COMPILE_REPORT.json` the counts (kept / dropped by reason, aliases, templates built / unbuilt, ES missing).

### 3.2 `catalog.json` (`catalog/2`)

```json
{"schema": "catalog/2", "model_version": "1.1.0", "id_aliases": {"<source id>": "<runtime id>"}, "exercises": [ExerciseRecord, …]}
```

**ExerciseRecord** (every field present, `null` when not applicable; sorted by `id`). Executable reading:
`tools/fixture/catalog.mjs > normalizeExercise`.

| Field | Type | Meaning / compile rule (source = `02_exercise_catalog.json` record `r`, v1.1) |
|---|---|---|
| `id` | string | `r.id` with band words removed (§3.2.2); unique kebab-case |
| `source_id` | string | `r.id` |
| `name_key` / `cue_key` | string / string\|null | `exercise.<id>.name` (EN = `r.name` cleaned: band words and "(… inferred / not stated …)" qualifiers removed); `exercise.<id>.cue` when `r.coach_cues` exists |
| `kind` | enum | `exercise drill test conditioning` |
| `family` / `pattern` / `node` | string | `r.taxonomy.family` / `.pattern_code` / `.node_01_taxonomy` |
| `slots` | string[] sorted | buckets the record may fill (§3.2.1): the "category" for picks and swaps |
| `default_in_slots` | string[] sorted | buckets where it may be **the default pick** (CAT-07 BYOP library first): from `r.generator.default_candidate_by_pool` when present (e.g. KB swing: default in `AP_TRIPLE_EXT` only), else all `slots` when `default_candidate` (FOCUS only for isolation-type classes); **`[]` for `proposed_v1` / `proposed_v1_1` records (swaps only until he approves)** |
| `laterality` | enum | `bilateral unilateral alternating n/a` ("either …" → unilateral; alternating counts as unilateral, UNI-07) |
| `plane` | enum | `sagittal frontal transverse multi n/a` |
| `level` | enum | `r.level.generator_min_level` (default `foundational`) — soft ladder (CAT-05) |
| `zone` / `rotation_bias` | 1-3\|null / `external internal null` | Davidson zone tag and rotation bias (R2-LIB-02/03: used to pick pain swaps) |
| `size_class` / `exercise_class` / `counting` | string | `r.muscle_size_class` / `r.exercise_class` / `r.volume_counting` |
| `credit_class` | enum | §3.2.3 |
| `credits` | object | **copy of `rules.credit.classes[credit_class]`** (`{}` for ATHLETIC / NONE) |
| `primary_muscle` | string\|null | the muscle with credit 1.0 (null for DIPS; placement treats triceps as prime, LIB-16) |
| `equipment` | `{any_of: [[token…]…], machine: id\|null}` | available when **some** inner list ⊆ kit tokens **and** (`machine` null or available); `[[]]` = no equipment (§3.2.4) |
| `constraint` | 1-5 | `r.constraint_level.value` (EQ-13), default 2 |
| `axial_class` | `high moderate low none` | `r.axial_spinal_load.value` |
| `axial` | bool | **counted heavy spine lift** = `r.axial_spinal_load.spine_day_v1_1.counts_as_heavy_spine_lift` and squat / hinge pattern (R2-SES-02: 25 records) |
| `spine_class` | `counted second_day not_counted` | from `spine_day_v1_1.class` ("second-day option if not sore": goblet, hack, pendulum …) |
| `axial_pattern` | `squat hinge null` | BKD/UKD → squat, BHD/UHD → hinge |
| `skill` / `impact` / `load_ceiling` | string | `r.skill_demand`, `r.impact_level`, `r.load_ceiling` |
| `is_athletic` | bool | `credit_class == "ATHLETIC"` |
| `athletic` | object\|null | `{quality, contact_class, olympic_family, day_pattern, olympic_tier: L1\|L2_plus\|null, full_catch, from_floor, plyo_method_default, rc_stage_default: RC1\|RC2\|RC3\|null, unilateral_harder, loaded_jump, count_unit: contacts\|throws\|cuts\|metres\|reps, response: landing\|single\|repeat\|null, upper, low_amplitude, sport_only: string[]\|null, no_cuts, sprint_kind: acceleration\|max_velocity\|drill\|run\|null}` from `athletic_quality`, `contact_class_v1_1` (R2-ATH-02), `olympic_v1_1` (R2-ATH-04: clean = knee day, snatch = hip day); the last six fields by `tools/fixture/athletic-b2.mjs` (engine 0.4.0 stage B2, E-27 / E-33 / E-34) |
| `conditioning` | `{colour: A\|B\|C\|LC}`\|null | parsed from "Aerobic A (blue) …" names and lactate-clearance ids |
| `medball` | `{min_lb, max_lb, kind}`\|null | from `implement_load`; `max_lb` clamped to 20 (EQ-06); kind `pass_rotation overhead situp slam warmup wall_ball` |
| `older_ok` | bool | allowed for 60+ **by default**: false when `r.older_default_excluded.value` (R2-ATH-08: Olympic, plyos, depth jumps), quality plyometric / olympic, or any never tag |
| `older_opt_in_ok` | bool | allowed for 60+ **with** `prefs.older_athletic_opt_in`: false only for the never tags (`overhead_squat low_bar` always; `depth_jump high_depth_drop snatch` in Phase 0, D-05) |
| `youth_ok` | bool | true (youth limits = ladder + floor-lift rules at selection) |
| `tags` | string[] sorted | closed list §3.2.5 |
| `variation_axes` | string[] | first word of `r.variation_v1_1.axes` (`implement stance grip range hand …`) — the one-detail changes allowed between exercise blocks (R2-LIB-01) |
| `rep_hint` | `{text, unit}` | `r.typical_rep_range` (hint only) |
| `video` | `{url, kind: coach\|observed}`\|null | first `r.video_urls` entry; when null the renderer offers a YouTube **search** link (R2-GEN-02: videos optional) |
| `status` | string | `r.status` (`live_library_selectable reference_only program_only proposed_v1 proposed_v1_1 added_v1 added_v1_1 …`) |
| `sport_use` | string[] sorted | `r.sport_use_v1_1` (scored, never filtered) |
| `rule_refs` | string[] sorted | coach ids that changed this record (`R2-VOL-05`, `LIB-16`, `EQ-01`, `R2-ATH-08`, `R2-LIB-07` …) |

**Active filter**: `record_type ∈ {exercise, drill, test, conditioning_prescription}` with `generator.eligible`, status not
`retired`, never the 21.6-mile run (R2-LIB-06). Dropped: `out_of_scope`, `retired`, `taxonomy_placeholder`, `modifier`,
`variant_rule`, `progression_note`, `generic_choice`, `complex` (contrast complexes Phase 1, D-21 of v1.0 kept). The fixture
build keeps 731 records, drops 208. B1 logs every drop in `COMPILE_REPORT.json`.

#### 3.2.1 `slots`

`r.generator.pools` → buckets: `BKD→RP_BKD UKD→RP_UKD BHD→RP_BHD UHD→RP_UHD HPUSH→RP_HPUSH VPUSH→RP_VPUSH HPULL→RP_HPULL
VPULL→RP_VPULL KEXT→ISO_QUAD KFLEX→ISO_LEG_FLEXION SHLD→ISO_SIDE_REAR_DELT BIC→ISO_BICEP TRI→ISO_TRICEP CALF→ISO_CALF
CT→CT_CORE_THORAX,CORE_ANY CP→CP_CORE_PELVIS,CORE_ANY CB→CT_CORE_THORAX,CP_CORE_PELVIS,CORE_ANY AOS→CT_CORE_THORAX,CORE_ANY
CORE→CORE_ANY PLYO→AP_PLYO ANKLE→AP_JUMP_LIMITED_KNEE THROW→AP_THROW TX→AP_TRIPLE_EXT COD→AP_COD
SPRINT→AP_SPRINT,COND_SPRINT_BUYOUT CARDIO→COND_AEROBIC WARMUP→WARMUP_PREP CARRY,DRAG→FUNCTIONAL ARMCARE→RECOVERY_ARM_CARE
NECK→PREHAB_NECK`. Then:
* `MRPUSH` → `RP_HPUSH` if chest is prime else `RP_VPUSH`; credit class `ISO_CHEST` → `ISO_CHEST` (not `RP_HPUSH`).
* **Face pulls** (cable and KB; pool `SHLD` in v1.1) → `ISO_SIDE_REAR_DELT` (+ `RECOVERY_ARM_CARE`), never `RP_VPULL` (R2-LIB-04, LIB-10).
* **KB swings** (any swing in a BHD / UHD pool) → `AP_TRIPLE_EXT` (+ `COND_WOD`), **never `RP_BHD` / `RP_UHD`** (R2-VOL-05; 02 lists them as 0-credit swaps there — excluded so set accounting stays honest, D-12).
* `tibialis-raise…` → `PREHAB_LOWER` (credit NONE; it is not calves, INFERRED). Single-leg balance reach, seated calf raise, Copenhagen plank also `PREHAB_LOWER`.
* `sissy-squat` also `ISO_QUAD` (EQ-08 swap); SKILL pool = `SKILL_IDS` in `tools/fixture/catalog.mjs` (double-unders, jump rope, toes-to-bar, dead hang, hollow rocks, pull-up …; INFERRED, Phase 0); `COND_WOD` pool = calorie efforts, burpees, burpee broad jump, wall ball, ergs, sled, carries, sandbag, KB swing, thrusters, box jumps; `COND_CIRCUIT` pool = calorie efforts, burpees, jumping jacks, jump rope, erg sprints.
* `COND_AEROBIC` holds colour sessions and cardio prescriptions only (never a WOD station).
* every non-athletic, non-core record with a prime target muscle also gets `FOCUS`. `CORE_OTHER` stations draw from `CORE_ANY`.

#### 3.2.2 Bands (EQ-01, EQ-07, EQ-08, EQ-12)

Remove every setup that contains a band / chain / releaser token; drop the record if no setup remains (`band_only`). Remove band
words from ids and names (`-band-or-machine` → `-machine`, `-cable-band-` → `-cable-`, `-banded-cable-` → `-cable-`, the KB face
pull's `-as-written-…-cable-band` suffix → `kb-face-pull`); record `source_id → id` in `id_aliases`. After compile **no id,
name, cue, swap, kit token or substitute** may match `/\b(band|bands|banded|chain|chains|weight[- _]?releasers?)\b/i`
(`tools/fixture/check-fixture.mjs` and `tools/check-model.mjs` fail otherwise).

#### 3.2.3 `credit_class` (VOL-09, VOL-10, LIB-09, LIB-14, LIB-16, CAT-09, R2-VOL-05, R2-LIB-04)

Athletic patterns (`PLYO ANKLE THROW TX COD SPRINT CARDIO WARMUP COMPLEX`) → `ATHLETIC`; **any KB swing → `ATHLETIC`**;
tibialis raise → `NONE`; `CARRY DRAG ARMCARE POS LSS MODIFIER` → `NONE`; `NECK` → `ISO_NECK`; core patterns → `CORE`;
`BKD` → `THRUSTER` for thrusters, else `BKD`; `UKD` → `UKD`; `BHD`/`UHD` → `GLUTE_ISO` when glutes is the 1.0 mover (hip
thrust, bridge, kickback, abduction), else `BHD`/`UHD`; `KEXT` → `LEG_EXTENSION`; `KFLEX` → `LEG_FLEXION`; `HPUSH` → `DIPS`
(chest 0.5 + triceps 0.5), `ISO_CHEST` (flies), else `HPUSH`; `MRPUSH` by prime; `VPUSH` → `VPUSH`; `HPULL` → `HPULL`; `VPULL` →
`PULLOVER` for pull-overs, else `VPULL`; `SHLD` → `FACEPULL` (face pulls), `ISO_REAR` (rear head, reverse fly, Y / T raises),
`ISO_FRONT` (front raise), else `ISO_SIDE` (incl. upright rows); `BIC` → `ISO_BICEPS`; `TRI` → `ISO_TRICEPS`; `CALF` → `ISO_CALF`.
**[1.1.1]** the `front-raise` id test runs before the `delt_head` test (02 marks 4 front raises `delt_head: rear`; they compiled as
`ISO_REAR` and credited rear-delt sets). `video.url` keeps the first URL when a 02 cell lists two labelled links (4 records).
`credits` = copy of `rules.credit.classes[credit_class]`. The catalog's coarse `per_set` groups are **not** copied.

**Slot rule (H09):** an exercise placed in an athletic bucket (`rules.credit.athletic_slot_buckets`: `SKILL AP_* COND_* WARMUP_*
FUNCTIONAL RECOVERY_ARM_CARE PREHAB_*`) credits **nothing**, whatever its class (e.g. push press in `AP_TRIPLE_EXT` = power
reps; LIB-13, VOL-10). `model.credits(exercise, bucket)` implements it.

#### 3.2.4 Equipment tokens

Implement tokens map to kit tokens (`tools/fixture/catalog.mjs > IMPLEMENT_TO_KIT`): `none, any_cardio_mode, rope → (nothing)`,
`step → step_low`, `plate → weight_plate`, `squat_rack → rack`, `suspension_trainer → trx`, `dip_station → dip_bars`,
`household_object → household`, `cardio_treadmill → treadmill`, `cardio_machine → cardio_machine_cal`, `box_high → plyo_box_high`,
`anchor → anchor_point`, `machine → the machine's kit token` (`machine_selectorized | machine_plate_loaded | machine_specialty |
belt_squat | smith | cable`); all others map to themselves. Setups are deduplicated and sorted (shortest first).
`equipment.machine` = F29 id when the record needs a specific machine, else null.

#### 3.2.5 Tags (closed list)

`overhead_squat snatch low_bar depth_jump high_depth_drop` (never-lists, EQ-03) · `hurdle_hop bound ankle_hop landing`
(50+ racket and 60+ rules, R3-ATH-02) · `overhead overhead_barbell dips upright_row skullcrusher good_morning bent_over
chest_supported sumo cossack deep_knee_flexion front_rack push_up_floor` (pain filters) · `belt_squat kong_row push_press
push_jerk thruster pullover face_pull kb_swing wall_ball glute_iso spine_counted` (specific rules) · `fixed_grip split_grip
machine cable barbell medball` (implement) · `olympic loaded_jump olympic_from_floor plyo_repeated high_impact axial_high`
(athletic / load) · `older_preferred aesthetics_warmup_only pitcher_reduce striker_reduce beginner_olympic youth_floor_ok
axial_unload pain_friendly` (02 population rules). `v_squat` is reserved: no record may carry it; the selector rejects it.

### 3.3 `rules.json` (`rules/2`)

One object. **The fixture's `rules` object is the complete, normative content** (built by `tools/fixture/rules.mjs` from the
spec 1.1.0 rule tables + 12 v1.1 + 05 / 06 / 04 v1.1 + round 2). B1 must emit a `rules.json` that **deep-equals** the fixture's
`rules` (test `tests/compile.test.mjs`); new keys only through a `CONTRACT_REQUESTS.md` entry the integrator accepts.

| Section | Holds (highlights) | Read by |
|---|---|---|
| `locked` | LK01-LK18 `{id, key, refs}` (coach_rule_hooks layer 1, v1.1: two spine days, no deload inside a block, no max test from zero, 60+ opt-in, no lifestyle inputs, release every build, no check-in no change) | validate, render |
| `muscles` | `order`, `defs[m] = {class, region, fill: target\|core_block\|floor, target, group, athlete_fill?: credit, own_sets?, floor_on_group?, per_leg_day?}`, `groups {order, members}` | all |
| `credit` | `helper 0.25`, `unilateral_set 1`, `myo_set_value 2`, `athletic_slot_buckets`, `classes` (credit map v1.1), `never_credit_tags [kb_swing, wall_ball]` | select, volume, validate |
| `levels` | client thresholds (`L1_below_years 1`, `L3_min_years 3`, `L3_min_days 4`, layoff 6 months, former competitor), `exercise_ladder`, `youth_max_ladder`, `older_age 60`, `active_aging_age 50`, `youth_age 18`, `pro_setting` (off by default) | intake, select |
| `volume` | `start[m][L]` (big 10/15/20, small 10/12/15, rear 4/6/8), `cap[m][L]` (14/22/25 all target muscles incl. calves; rear 8/12/16; abs 16/20/20), `cap_rule`, `calves {per_leg_day 3, weekly_floor 10, second_station_sets 1}`, `core_block {2, 2}`, `floor {value 10, exempt}`, `priority {add L(4,4,6), cap {default L(18,26,30), chest L(18,28,30), rear_delts L(12,16,20)}, absolute_cap 30, nonpriority_step_cap 0.03, per_session_cap 14, intake_map}`, `per_session`, `rounding half_up`, `order_of_operations`, `modifiers` (aesthetics, strength, general, fat_loss, **stay_active**, field_off, strength_athlete_off, athlete_in), `modifier_select`, `phase_factors` (pre_season 0.6, in_season, taper 0.5), `striker`, `pitcher`, `older`, `pain` (areas, worse_with) | intake, volume, select |
| `stairway` | `standard_steps {early 0.03, late 0.05}`, `halfway ceil(N/2)`, `lambda`, **`by_N[2..16]`** = `{halfway, standard_steps{w}, growth, display_level{w} (2 → 11), planned_effort{w} ("3" "2" "1-2" "1+")}`, `phases_by_N[N][L]` (ACCLIMATION / DRIVE / HARDEST labels), `exercise_blocks_by_N`, `limits` (step ≤ 0.07, non-priority ≤ 0.03, 60+ ≤ 0.03, pain after freeze ≤ 0.03, total < 10 % strict, exemptions), `release` (threshold 1, epsilon, bank max 1.99, staggering), `continues_across_exercise_blocks`, `no_checkin: planned`, `checkin` rows read against the stairway (no life column) | shape, volume, dose, generate.adapt |
| `placement` | `day_rotation alternate` (r3 R3-VOL-03), laterality tolerance 0.03, `first_below_first`, max sets / exercise L(4,5,5), isolation 4, min 2, `bonus` (optional day first, else a day already training the group, never its only exercise), `focus`, `week1_fit` | volume |
| `session` | `exercise_cap_by_minutes` (**split days only**), `full_body_days` (no count cap; 2-4 per group), `athlete_cap 12` (+ core, R2-SES-04), `outside_cap_blocks`, `exercises_per_group` (full-body [2,4], split [3,4], exempt groups calves / core, exempt family strength), `default_sets` (compound 3, isolation 2, calves 2 + 1, core 2, athletic 2 / 3 at 90, focus 2), `minutes_default`, `long_day.warn_above_factor 1.10`, `off_days_min 1` | week, volume, validate |
| `time_model` | minutes per working set incl. rest by time class, changeover 1.0 (0.5 in a pair), superset factor 0.65, aerobic add-on minutes, WOD minutes, circuit transition / between rounds | week, volume, validate |
| `cut_order` | per family ordered cuts; `never_cut` (core opener, work, paired upper, survival, calves, the Olympic slot, `group_min_exercises 2`, one rear-delt station a week, one plyo/ballistic); `superset_first`; `when_nothing_left: warn_long_day` | week |
| `bilateral_share` | regions, tolerance, siblings, `profiles` (bb_pl, beginner_general, weekend_bootcamp, rec_cod, field_cod, sprinters, strength_athletes, baseball_softball, combat, older_injured) with `by_exercise_block[]` (+ PRE / IN), `select` (first match; `sport` = SportDef.share), `pain_shift 0.2`, `slider_range` | intake (D10), select, volume |
| `contra_ipsi`, `frontal_transverse` | COD contralateral 0.7, sprinter ipsilateral 0.6, split stance contralateral; frontal / transverse share from the profile | select, dose |
| `pairing` | `hip_with`, `knee_with`, `hip_buckets`, `knee_buckets`, `not_for_variants [upper_lower, ppl_x2]`, same / cross pattern rules | week, validate |
| `axial` | `budget {squat 1, hinge 1}`, `never_same_day`, counted = catalog `axial`, `second_day_classes`, `not_counted_tags`, powerlifter light extra, `home_second_squat unilateral`, `spacing` day types | select, validate |
| `reps` | `brackets`, `ladder`, `matrix[rep_class][column]` (columns hypertrophy / strength / athletic / fat_loss / general; olympic, plyo by stage, throw, cod, sprint, skill, prehab), `goal_column` (active → general, hybrid → general), `athlete_vol_phases`, `preference`, `pyramid`, `notation` | dose |
| `effort` | `rir_band [1,3]`, `planned_from_stairway`, `planned_map` ("3" → 3, "2" → 2, "1-2" → 1-2, "1+" → 1 + intensifiers), `compound_floor_rir 1`, `by_block_type` (maintenance 2-3, pre-season 2, taper 2-3, in-season 2-3, recovery 3-4), `rpe_for_rir`, `max`, `myo` (last item, isolation or constraint ≥ 4, last stairway week or at cap in HARDEST), `never_failure_rep_classes`, `strength_roles`, `speed_work`, `athletic`, `olympic` (power language; % never by default) | dose, validate |
| `rest` | seconds by class | dose |
| `athletic` | `ground_contact_classes {1..5: end}` (0.75 / 0.6 / 0.5 / 0.4 / 0.25), `block_start_offset -0.15` (no floor), counted over plyometric + ballistic + throw, classification lists, `stages.weeks_by_N` (12: 1-3 / 4-7 / 8-12; 8: 1-2 / 3-5 / 6-8), start RC1, `contacts_per_session_max L(80,100,120)`, loaded jump 10-20 % BW, heights, contrast off in Phase 0, tiers, `in_season_game_heavy`, `heavy_play_weeks` (r3) | intake (D11), shape, select, dose, validate |
| `olympic` | families, day pattern, `per_week_max 4`, tiers (L1 / L2_plus examples), `ramp` 4×8 @75 → 4×4 @90 for DB / KB / pulls / hang, `full_catch_reps [3,5]`, `power_language`, `pct.shown false` (needs tested best + coach opt-in, D-29), `no_bumpers: hang_variants`, `older {default false, opt_in true, opt_in_excludes_tags [snatch]}`, youth floor ≥ 14 after a hang block, in-season 2 × 3 | select, dose, validate |
| `medball` | `max_lb 20`, loads by kind (wall ball 10-20), youth / older −2 lb, min 4, dose, aesthetics warm-up only, no-ball substitutes | select, dose, validate |
| `conditioning` | `sessions` by population (fat_loss 3, general 3, active 3, aesthetics 4, athlete_in 2, athlete_pre 2, powerlifter 2, hybrid 2, sport_is_aerobic 0), `from_profile`, `cardio_adjust` (−3..3, extra colour C), `activity_counts_as_aerobic` (max 2 replaced, r3), walks, colours, `fill_order [C,B,A]`, minutes, steady ≤ 40, placement order, fighter open day, recovery C only, `wod`, `circuit_finisher` | intake (D14), week, dose |
| `equipment` | `profiles{id:{kit[]}}` (10 v1 ids), `intake_profiles`, `machines`, `cardio_tokens`, `running_space`, `banned_tokens`, `client_families` (athlete, hypertrophy, strength, beginner, older_or_pain, general), `family_select`, substitution order, implement ladder, machine isolation swaps, fallback sets, never tags, buy list | intake (D7, D8), select, validate |
| `population` | `older` (from 60: default exclusions, opt-in unlocks, never tags, Phase-0 never-even-with-opt-in tags, warning key, constraint 4-5, step cap 0.03), `active_aging_50` (50-59 racket profiles: avoid depth jumps / hurdle hops / bounds unless opted in; prehab each leg day; r3 R3-ATH-02), `youth` | intake, select, validate |
| `prehab` | `by_injury_code` (SHOULDER_SWIMMER / SHOULDER_THROWER → RECOVERY_ARM_CARE ×2 a week; ACHILLES_CALF, KNEE_DEGENERATIVE_COURT → PREHAB_LOWER; NECK → PREHAB_NECK), block `prehab`, outside the cap, no credit | week, select, dose |
| `selection` | score `weights`, swaps 2-4, `block_change` (one small change or one-detail variation, never invented, R2-LIB-01), variety A/B, second exposure different, proposed records swap-only, KB swing never in a resistance slot | select |
| `ordering` | `block_order`, core positions, athletic bucket order, `role_to_block`, `hard`, `h_before_v_exempt_when_vertical_is: work`, `allowed_overrides` | week, validate |
| `supersets` | triggers, pairs, never-list, `core_supersets_optional` (R2-SES-03), `bootcamp` circuits (2 circuits, 4-6 stations, rounds by minutes, work 35 → 50 s stairway, transition 15 s, 90 s between rounds; a round = 1 set) | week, volume, dose |
| `plan_types` | `fixed_12`, `fixed_8` (one stairway each; tests week 1 + last), `short_block`, `maintenance_4_6` (weeks 1-8, default 4, factors 0.5 / 0.6 / 0.7, older floor 0.7, flat, RIR 2-3, end prompt), `week_by_week` (rolling 12 + recovery), `year` (layout Q1 stairway flat sets, recovery, Q2, recovery, Q3 maintenance 0.7, Q4 11-week stairway, holidays 0.6), `prep`, `season` (weeks-to-season thresholds, `pre_weeks_default 4`, range 4-6, `min_offseason_stairway_weeks 4`, taper weeks by pre-season length, no taper before the first meet for season type C, in-season template `athletic.2.in_season`), `skeleton_ids` | intake, shape |
| `recovery` | between-block easy week: 0.5 × the hardest week, round up, min 1, RIR ≥ 3, removals, Olympic half light, athletic landings half, conditioning C only, only between blocks, extra week (r3 R3-PER-01) | shape, volume, dose |
| `cycles` | next block after a completed block: start × 1.05 (half up), cap + 1 (max 25 / 30); same start after holds / pain / a cancelled block | volume |
| `tests` | catalogue (`from_zero` vs `after_completed_block` by level; cardio and speed 80-90 % from zero), `when` (week 1 + last week of each stairway; never in pre / in / taper / recovery / maintenance), `from_zero_if`, `end_test_counts_as_completed_block`, `other_sets_factor 1.0` (D-17), reminders, excluded 21.6-mile run | shape, dose, validate, render |
| `warmup`, `core_block` | warm-up content; core opener 2 × 2 light, positions, harder only when moved to the end, plane rotation, rotational groups, counts to abs | week, select, dose |
| `template_select` | variant order (`in_season_week`, `split_style`, `profile_template_hint`, `unbuilt_main_fallback`, `same_pattern`, `format_circuit`), split-style variants, unbuilt fallback, weekday mapping, optional-day placement | intake (D6), week |
| `validation` | `checks [{id V1..V26, key, severity}]`, `hard [{id H01..H22, key}]` | validate |

### 3.4 `templates.json` (`templates/2`)

```json
{"schema": "templates/2",
 "buckets": {"RP_BKD": BucketDef, …},
 "goal_to_family": {"muscle": "aesthetics", "strength": "strength", "athletic": "athletic", "active": "athletic",
                    "fat_loss": "fat_loss_bootcamp", "general": "fat_loss_bootcamp", "hybrid": "hybrid_crossfit"},
 "kit_family_override": {"profiles": ["BODYWEIGHT", "FIELD_TRACK_NO_KIT"], "family": "no_equipment", "except_goals": ["athletic", "active"]},
 "families": {"<family>": {"pairing": "…", "default_minutes": {…}, "notes": "…", "days": {"2": Template, …, "6": Template}}},
 "program_names": [{"when": {…}, "id": "OT03"}, …]}
```

**BucketDef**: `{kind: warmup|core|skill|athletic|power|resistance|isolation|focus|aerobic|conditioning|functional|prehab|test,
block, rep_class, time_class, pattern?, region?, dominance?: knee|hip, laterality?, vector?, direction?, axial_pattern?, group?,
muscle?, muscle_by_variant?, rep_class_by_variant?, athletic_unit?, core_segment?, machine_swap?, alias_of?, pool_as?, catalog?, phase0?}`.

**Template** (`families[f].days[d]`): `{id: "athletic.3", family, days, status: built|unbuilt, format_note, week_layout,
day_types, variants, aerobic: {in_layout}, evidence}`.
* `week_layout[wd] = {day_type, kind: main|optional|aerobic|off, optional, note}`. 05 values: `OPT` = planned training day
  (counts toward F22); `OPT (optional)` = offered extra day (`optional: true`); `sport/OFF`, `sport` = off with note
  `sport_or_off`; `aerobic` = aerobic day; `WOD` (CrossFit class Saturday) = optional day (`note: wod_only_class`).
* **DayType**: `{label (EN from 05), label_key, kind: main|optional|aerobic, format: straight|circuit, dose_text, lower_focus:
  knee|hip|null, full_body (lower and upper resistance on the day), groups [group ids trained], axial {squat, hinge} (the day
  that holds the counted spine lift), stations: Station[]}`.
* **Station** (session order as the coach writes it):

```json
{"id": "S1.s10", "bucket": "RP_HPULL", "role": "paired_upper", "block": "strength", "group": "back",
 "sets_hint": [2, 3], "sets_text": null, "dose_text": null, "pair": "P1", "superset": "P1", "superset_below_minutes": 999,
 "circuit": null, "include_from_minutes": null, "axial": null, "variant": null, "variant_text": null,
 "laterality_dial": false, "loading": null, "movable": false, "counts_as_volume": true, "condition": null, "condition_text": null,
 "older_default_excluded": false, "older_default_text": null, "group_label": null, "pool_filter": null, "rir": null,
 "note": "HEAVY single-arm row"}
```

  `sets_hint [a, b]`: `a` below 90 min, `b` at ≥ 90 min (05, INFERRED). `axial ∈ axial | non_axial | light_or_non_axial | null`
  (**[1.1.1]** compiled from 05: `light_technique` → `light_or_non_axial`, `n/a (bodyweight)` → `null`)
  (the template decides which squat / hinge station is the week's counted one). `variant`: `ISO_SIDE_REAR_DELT` → `side|rear|front`;
  `AP_TRIPLE_EXT` → `clean|snatch|swing|jerk` (the day pattern, R2-ATH-04); `AP_PLYO` `upper` = plyo push-ups. `circuit` = 1 | 2 for
  bootcamp stations. `group` = the R2-SES-05 muscle group the station serves. `superset_below_minutes 999` = always paired
  (athletic off-season VO2 case, ORD-05). `note` / `dose_text` / `condition_text` are **internal hints (EN only), never rendered** (H14).
* `variants{name}` = `{week_layout|null, day_types, evidence, use_when}` from 05 `alternative` objects (`upper_lower`, `ppl_x2`,
  `crossfit_style_bootcamp`, `bootcamp_circuit` …), `same_pattern_variant`, `in_season_variant`, `baseball_parts_variant`.
  A variant with `week_layout: null` uses the base layout.
* `hybrid_crossfit.4` main day types are a pointer to OT17 (`status: unbuilt`); its built alternative `crossfit_style_bootcamp`
  is the default (D-22).
* Compile (B1) = `tools/fixture/templates-profiles.mjs > normTemplate` over all families × 2-6 days (30 templates, 1,821 stations).
* `program_names`: first match wins; `when` keys `family`, `days`, `variant`, `goal`, `format`, `competitive`, `profile_family`
  (SportDef `family`); ids `OT01 OT02 OT03 OT04b OT05 OT06 OT08 OT10 OT11 OT14 OT16 OT19 OT23 OTACT OTCFB OTGEN OTNOEQ`
  (`program.<id>.name`, EN + ES).

### 3.5 `profiles.json` (`profiles/2`)

```json
{"schema": "profiles/2",
 "goals": {"muscle": GoalDef, "strength": GoalDef, "athletic": GoalDef, "active": GoalDef, "fat_loss": GoalDef, "general": GoalDef, "hybrid": GoalDef},
 "sports": {"<profile id>": SportDef, … 127 …},
 "picker": {"groups": [{id, name_key}], "sports": [PickerSport × 52], "activities": [Activity × 26]},
 "goal_defaults": {"muscle": "bodybuilding_aesthetics", "strength": "powerlifting_strength", "fat_loss": "fat_loss", "general": "general_population", "hybrid": "hybrid", "athletic": "weekend_warrior", "active": "weekend_warrior"},
 "age_overlays": {"active_aging_60plus": {when, scope}, "active_aging_50plus": {…}, "youth_general_athletic": {…}, "youth_athlete": {…}},
 "id_aliases": {"profiles": {…}, "sports": {…}},
 "recreational_profile": "weekend_warrior"}
```

* **GoalDef**: `{family, competitive?, default_profile, modifier: "by_rule", aerobic (number | "by_profile"), walks, medball_main,
  plyo_block, olympic, pairing, rep_column, default_minutes, default_minutes_L3?, default_minutes_noncompetitive?, refs}`.
* **SportDef** (normalized from `04_profiles.json > profiles[]` v1.1 by `normSport`):

```json
{"id": "swimming_middle", "name_key": "profile.swimming_middle.name", "category": "competitive|recreational|goal",
 "sport": "swimming", "family": "aquatic", "group": "aquatic", "ath03_group": "speed_power", "season_type": "C",
 "ground_contact_class": 5, "plyo_share": {"start": 0.1, "end": 0.25},
 "share": {"lower": {"by_exercise_block": [0.5, 0.5, 0.55], "PRE": 0.5, "IN": 0.45}, "upper": {"same_logic": true}},
 "contra_ipsi": "contralateral|ipsilateral|both|health_accessory", "frontal_transverse_share": 0.1,
 "aerobic": {"off": 0, "off_range": [0, 1], "pre": 0, "in": 0, "walks": false, "sport_is_aerobic": true, "activity_counts": false},
 "athletic_sets_wk": {"PLYO": 1, "JLK": 3, "BALL": 7, "THROW": 4, "TE": 6},
 "athletic_weekly": {"plyo_contacts": [6, 8], "jump_contacts": [37, 49], "low_contacts": [51, 69], "throws": [35, 45],
                     "cod_cuts": [0, 0], "sprint_m": [0, 0], "olympic_sets": [4.5, 7.5]},
 "tiers": {"plyo": "T2", "throws": "T1", "cod": "T0", "sprint": "T0", "olympic": "T2"},
 "medball": {"tier": "T1", "throws_wk": [35, 45], "main_workout": true},
 "olympic": {"exposures_wk": 3, "weekly_sets": 6, "none_by_default": false},
 "cod_sport": false, "speed_athlete": true, "rotational_core": false,
 "in_season": {"lift_days": 2, "game_heavy": false, "hard_day_gap_h": 48},
 "pre_season": {"PLYO": 0.8, "…": 0.8, "resistance": 0.44, "total_sets_pct_of_off_season": 60},
 "injuries": ["SHOULDER_SWIMMER", "…"], "variants": {"stroke_free": {"name_key": "…", "weekly_sets_delta": {}, "injuries_add": []}},
 "age_rules": {"age_50_plus": false, "older_60_plus": false},
 "template_hint": null, "lead_for_goals": [],
 "volume_ratios": [{"muscle": "lats_upper_back", "plus": ["rear_delts"], "over": ["chest"], "min": 1.5, "applies_to": ["start", "cap"]}],
 "play": null, "stay_athletic_dial": null, "resistance_goal": "strength", "rules": [], "evidence": "synthesis/04_profiles.json v1.1"}
```

  `plyo_share.end` = the class share (R2-ATH-01 approved: 75 / 60 / 50 / 40 / 25 %); `start = end − 0.15` (no floor; 04's
  "floor 20" dropped per the approved wording). `share.lower.by_exercise_block` = 04 `block_start`, `baseline_mid_block`,
  `block_end` (bilateral fractions). `season_type` = by family for competitive profiles, `I` otherwise. `template_hint` (e.g.
  `crossfit_class → {family: hybrid_crossfit, variant: crossfit_style_bootcamp}`, baseball / softball → `baseball_parts`).
  `lead_for_goals`: the activity profile leads the plan for these goals (crossfit_class, hyrox_fitness → active, hybrid).
  `volume_ratios`: swimming / water polo / lap swim pull rule (04 SHOULDER_SWIMMER "pull sets ≥ 1.5 × push sets", read as
  back + rear delts vs chest, D-09).
* **PickerSport**: `{id, name_key, group, kind, default_profile, default_variant, positions: [{value, name_key, profile,
  profile_by_choice (lacrosse m|w), variant}], second_choice: {name_key, options: [{value, name_key, variant, profile}]}|null,
  age_variant (pickleball 60+), routes_to, rec_activity}`.
* **Activity**: `{id, name_key, profile, variant, event_type, league_sport: [{value, profile}], style: [{value, profile, variant}],
  competitive_counterpart}` (rec_league routes by `activity.league_sport`, rec_combat_fitness by `activity.style`).

### 3.6 i18n files

`model/i18n/en.json` and `es.json` are **flat** objects `{"_meta": {...}, "<key>": "<string>", …}` sorted by key;
`es_review.json` as §1.6. Required coverage (B1): every key referenced by the catalog, templates (`label_key`, `slot.<bucket>`),
profiles / picker / activities (`name_key`; EN + ES from 04 v1.1), rules (`key` fields), the spec intake labels / options and
copy placeholders (EN + ES given in the spec, marked LEGAL REVIEW where so), check-in labels, and every key in the fixture's
`i18n.en` (UI strings, why-codes, notes, warnings, checks; sources `tools/fixture/i18n.mjs` + `i18n-v11.mjs`). B1 translates
**all** exercise names, cues and day labels into neutral Latin American Spanish (gym term in brackets) and lists every
machine-translated line in `es_review.machine_translated`. The fixture leaves 866 ES keys missing on purpose (fallback path).

---

## 4. Engine modules

### 4.0 Shared typedefs (JSDoc names used in every signature)

Put these `@typedef` blocks in `engine/util.mjs` (B4) and reference them as `import('./util.mjs').Derived` etc.

```js
/** @typedef {{key:string, ref:string, args?:Object<string,string|number>}} Why */
/** @typedef {{code:string, field?:string, key:string, args?:Object}} Issue      // key = i18n key (warning.*, intake.*) */

/** @typedef {Object} Derived   — output of intake.deriveValues (D1-D14 + helpers); plain JSON, no functions
 * @property {'aesthetics'|'athletic'|'strength'|'fat_loss_bootcamp'|'hybrid_crossfit'|'no_equipment'} D1_family
 * @property {{id:string, variant:string|null, sport_id:string|null, position:string|null, position_detail:string|null,
 *             activity_ids:string[], overlays:string[], competitive:'competitive'|'recreational'|'none',
 *             ath03_group:string|null, ground_contact_class:number|null, season_type:string, name_key:string}} D2_profile
 * @property {{level:'L1'|'L2'|'L3', reason_keys:Array<{key:string,args:Object}>, exercise_ladder:'foundational'|'intermediate'|'advanced',
 *             replace_after_block:number|null}} D3_client_level
 * @property {{phase:string|null, weeks_to_season:number|null, season_date:string|null, competition_date:string|null,
 *             season_type:string|null, practice_days:number|null, game_days:string[],
 *             in_season_until:string|null}} D4_season_phase      // [1.1.1] ISO end of the in-season window inside the plan (D-51)
 * @property {{mode:string, overlay:'season'|'prep'|null, skeleton:string, weeks:number}} D5_plan_shape
 * @property {{template_id:string, family:string, days:number, variant:string|null, pairing:'same_pattern'|'cross_pattern', format:'gym'|'bootcamp'}} D6_week_layout
 * @property {{client_family:string, main:[number,number], iso:[number,number], machine_pen:number, skill_pen:number}} D7_constraint_band
 * @property {{profile:string, tokens:string[], machines:string[], medball_max_lb:number|null, heaviest_db_pair:number|null, box_height_in:number|null, buy_list:string[], cardio_options?:string[], running_space?:string|null}} D8_kit   // v0.4 B3: cardio_options / running_space (aerobic tools)
 * @property {Targets} D9_start_sets
 * @property {{profile_id:string, lower:{by_exercise_block:number[], PRE:number|null, IN:number|null}, upper:{by_exercise_block:number[]}, pain_shift:number}} D10_bilateral_share
 * @property {{enabled:boolean, older_mode:'default'|'opt_in'|null, plyo_share:{start:number,end:number}|null, ground_contact_class:number|null,
 *             contacts_session_max:number, weekly:{plyo_contacts:[number,number]|null, jump_contacts:[number,number]|null, low_contacts:[number,number]|null,
 *             throws:[number,number]|null, cod_cuts:[number,number]|null, sprint_m:[number,number]|null, olympic_sets:[number,number]|null},
 *             olympic_exposures_wk:number|null, medball_main:boolean, cod_sport:boolean, game_heavy:boolean, heavy_play_week:boolean}} D11_athletic_budget
 * @property {{early:number, late:number, caps:{nonpriority_while_priority:number|null, older:number|null}, source:'planned_stairway'}} D12_planned_step
 * @property {{items:string[], baseline_week:number|null, end_weeks:number[], from_zero:boolean}} D13_tests
 * @property {{per_week:number, base:number, adjust:number, replaced_by_activity:number, walks:boolean, colours:string[], fighter_open:boolean, sport_is_aerobic:boolean}} D14_aerobic_sessions
 * @property {string} goal  @property {string} format  @property {'en'|'es'} lang  @property {'lb'|'kg'} units
 * @property {number} age  @property {'youth'|'adult'|'active_aging_50'|'older'} age_group  @property {number} body_weight_lb
 * @property {number} days_per_week  @property {string[]} weekdays  @property {number} session_minutes  @property {string} start_date
 * @property {string[]} play_days  @property {string|null} event_date
 * @property {string[]} priority_muscles     // canonical muscle ids (rules.volume.priority.intake_map), max 2 intake choices
 * @property {string[]} priority_choices     // [1.1.1] the intake F09 ids (<= 2; v_taper = 1 choice) - V8 counts these
 * @property {Array<{area:string, side:string, severity:string, worse_with:string[]}>} pain
 * @property {string[]} exclusions  @property {string} lift_style  @property {string} output_mode
 * @property {{core_position:string, optional_days:string, variety_ab:boolean, heavy_unilateral:boolean, supersets_for_fatigue:boolean,
 *             cardio_adjust:number, older_athletic_opt_in:boolean, split_style:'default'|'upper_lower'|'ppl'}} prefs
 * @property {{count:number, last_had_holds_or_pain:boolean}} previous_cycles  @property {boolean} just_finished_block
 * @property {string|null} maint_reason  @property {number|null} maint_weeks
 * @property {{role:'self'|'client', health_route:string|null, refer:boolean, reasons:string[], bypass:boolean}} health
 * @property {{accepted:boolean, version:string, lang:string, guardian:boolean|null}} release
 * @property {string} equipment_preference   // F29b
 * @property {string} modifier_id            // rules.volume.modifiers key (also in D9)
 * @property {string[]} r3_pending
 * @property {Issue[]} warnings              // V2, V3, V6, V7, V8, older opt-in, minutes, split style …
 * @property {Why[]} why
 */

/** @typedef {Object} Targets   — volume.computeTargets (= D9)
 * @property {string} modifier_id
 * @property {Object<string,number|null>} start          // whole weekly sets per target muscle at week 1 of the first stairway (null = credit-only)
 * @property {Object<string,number|null>} cap
 * @property {Object<string,'target'|'credit'|'own_sets'|'core_block'|'floor'>} fill
 * @property {string[]} priority  @property {string[]} pain_muscles  @property {string[]} floored  @property {string[]} credit_only
 * @property {number} calves_per_leg_day  @property {{exercises:number, sets:number}} core_block
 * @property {Object<string,Why[]>} why                    // per muscle (modifier, priority, floor_10, pain, ratio …)
 */

/** @typedef {Object} TrainingBlock
 * @property {number} n  @property {'stairway'|'pre_season'|'taper'|'in_season'|'maintenance'|'recovery'} type
 * @property {[number,number]} weeks              // plan week numbers, inclusive
 * @property {number|null} stair_N                // stairway length (null for flat blocks)
 * @property {number} first_exercise_block  @property {string} label_key   // plan.block_type.<type>
 * @property {Object|null} factor                 // pre_season / taper / maintenance factor rule echoed from rules
 */
/** @typedef {Object} WeekShape
 * @property {number} n  @property {number} training_block  @property {string} block_type  @property {number} exercise_block
 * @property {number|null} stair_week             // 1..N inside a stairway, null otherwise
 * @property {number|null} stair_level            // rules.stairway.by_N[N].display_level[stair_week] (2 -> 11)
 * @property {{early:number, late:number, this_week:number}|null} standard_step   // the unscaled step INTO this week (null week 1 / flat)
 * @property {'ACCLIMATION'|'DRIVE'|'HARDEST'|'PRE_SEASON'|'TAPER'|'IN_SEASON'|'MAINTENANCE'|'RECOVERY'} phase  @property {string} phase_key
 * @property {{min:number, max:number, intensifiers:boolean}} planned_rir     // rules.effort.planned_map[planned_effort] or by_block_type
 * @property {string|null} season_phase  @property {'VOL1'|'VOL2'|'VOL3'|null} rep_phase  @property {'RC1'|'RC2'|'RC3'|null} plyo_stage
 * @property {{type:'baseline'|'end', items:string[], from_zero:boolean}|null} test
 * @property {{rounds:number, work_s:number}|null} circuit       // bootcamp circuit format only
 * @property {boolean} is_exercise_block_start  @property {boolean} is_training_block_start  @property {boolean} is_last_stair_week
 * @property {number|null} stair_N  @property {number|null} exercise_block_week   // [1.1.1] stairway weeks only (dose: ramp, RC stage)
 * @property {Why[]} why
 */
/** @typedef {{mode:string, skeleton:string, weeks_total:number, open_ended:boolean, training_blocks:TrainingBlock[],
 *             exercise_blocks:Array<{n:number, training_block:number, weeks:[number,number]}>, weeks:WeekShape[],
 *             after_plan:{next:'pre_season'|'pre_season_rest'|'block_choice'|'maintenance_end', weeks:number|null, date:string|null}}} Shape */

/** @typedef {Object} SlotDef   — one station instance on one weekday
 * @property {string} slot_id            // `${weekday}.${station.id}` e.g. "Mon.S1.s10"; engine-added `${weekday}.${day_type}.<suffix>`
 *                                       // [1.1.1] one suffix per origin: .xNN volume bonus / focus_added, .pNN prehab_added,
 *                                       // .aNN aerobic add-on (new aerobic day `${weekday}.aerobic.a01`), .c01 cooldown, .kNN core top-up
 * @property {number} [day_index]        // [1.1.1] index of the day among the week's training days (WOD format, core plane rotation)
 * @property {string|null} [test]        // [1.1.1] test id set by layoutForWeek in test weeks (strength tests may be moved by generate, D-46)
 * @property {string} station_id  @property {string} bucket  @property {string} role  @property {string} block  @property {string|null} group
 * @property {[number,number]|null} sets_hint  @property {number} default_sets
 * @property {string|null} pair  @property {string|null} superset  @property {number|null} circuit
 * @property {'axial'|'non_axial'|'light_or_non_axial'|null} axial_req
 * @property {string|null} variant        // side|rear|front, clean|snatch|swing|jerk, upper
 * @property {boolean} laterality_dial  @property {string|null} loading
 * @property {string|null} focus_muscle   // FOCUS / bonus slots
 * @property {string} time_class  @property {boolean} counts_in_cap  @property {boolean} counts_as_volume
 * @property {string|null} text_key       // warm-up / cooldown text items (no exercise)
 * @property {{colour:string, minutes:[number,number], position:'separate'|'addon_after'|'open_day'}|null} aerobic
 * @property {'template'|'bonus'|'focus_added'|'aerobic_addon'|'cooldown'|'prehab_added'} origin
 * @property {Why[]} why
 */
/** @typedef {{weekday:string, day_type:string|null, kind:'main'|'optional'|'aerobic'|'play'|'sport', optional:boolean, label_key:string,
 *             lower_focus:'knee'|'hip'|null, full_body:boolean, format:'straight'|'circuit', minutes_limit:number, supersets_on:boolean,
 *             est_minutes:number, groups:string[], blocks:Array<{kind:string, movable:boolean, circuit:number|null, slots:SlotDef[]}>, why:Why[],
 *             circuit_dose?:{rounds:number, work_s:number, transition_s:number, between_rounds_s:number}}} DayLayout   // [1.1.1] circuit days
/** @typedef {{template_id:string, variant:string|null, family:string, pairing:string, program_id:string, training_block:number,
 *             days:DayLayout[], off_days:string[], play_days:string[], why:Why[], warnings?:Issue[]}} WeekLayout   // [1.1.1] warnings:
 *             warning.long_day (a cap that cannot be met without a group of 1), warning.play_48h */

/** @typedef {{slot_id:string, bucket:string, exercise_id:string|null, detail:{axis:string, key:string, value?:string}|null, swaps:string[],
 *             laterality:string|null, loading:'contralateral'|'ipsilateral'|null, why:Why[], flags:string[],
 *             stations?:string[]}} SlotFill     // [1.1.1] COND_WOD: 3-4 distinct movements, [0] = exercise_id; a WOD has no swaps
 *   flags ⊆ pain_swap level_shift pattern_gap no_candidate axial_counted second_day block_change detail_variation laterality_flip
 *           machine_iso_swap no_medball_sub older_default older_opt_in age_50_racket clean_day snatch_day kb_swing_power */
/** @typedef {{exercise_block:number, fills:Object<string,SlotFill>, buy_list:string[], why:Why[], history?:Object}} Selection   // v0.4 B3: history internal (no A-B-A) */

/** @typedef {Object} WeekVolume
 * @property {number} n  @property {Object<string,number|null>} sets_by_slot   // slot_id -> whole sets (0 = dropped slot; [1.1.1] null =
 *                                                                           // a slot that carries no sets: warm-up, aerobic, WOD, skill, text)
 * @property {SlotDef[]} added_slots                                         // bonus / focus slots created up to this week (persist in the block)
 * @property {Object<string,SlotFill>} added_fills                           // v0.4 B4: the fill each added slot was counted with (generate prints it)
 * @property {Object<string,boolean>} supersets_on                          // weekday -> bool
 * @property {Object<string,number>} target_by_muscle                        // T(w) of the stairway (round2), null for credit-only
 * @property {Object<string,number>} weekly_sets_by_muscle                   // credited (coach count), round2, all muscles in order
 * @property {Object<string,number>} direct_sets_by_muscle
 * @property {Object<string,number>} step_by_muscle                          // planned step used INTO this week (0 week 1 / flat)
 * @property {number} total_resistance_sets  @property {number|null} rise_vs_prev
 * @property {Object<string,number>} banks  @property {Object<string,number>} est_minutes   // weekday -> minutes
 * @property {Array<{key:string, args:Object}>} changes  @property {Issue[]} shortfalls  @property {Why[]} why
 */
/** @typedef {{weeks:WeekVolume[], athletic:AthleticBudget[], warnings:Issue[]}} VolumePlan */
/** @typedef {{n:number, enabled:boolean, plyo_share:number|null, stage:string|null, factor:number,
 *             targets:{plyo_contacts:number|null, jump_contacts:number|null, low_contacts:number|null, throws:number|null, cod_cuts:number|null, sprint_m:number|null, olympic_sets:number|null},
 *             contacts_session_max:number}} AthleticBudget */

/** @typedef {{reps:RepSpec|null, set_reps:RepSpec[]|null, effort:Effort|null, rest:Rest|null, load:Load|null, tempo_key:string|null,
 *             athletic:{unit:string, per_set:number, total:number, stage:string|null, quality:string}|null,
 *             circuit:{rounds:number, work_s:number, transition_s:number}|null,
 *             wod:{format:'amrap'|'emom'|'for_time', minutes:[number,number], stations:string[]}|null,
 *             notes:Array<{key:string, args?:Object}>, why:Why[]}} Dose */
/** RepSpec  = {type:'range', min, max, bracket?} | {type:'fixed', value} | {type:'per_side', min, max} | {type:'max'} | {type:'myo'}
 *            | {type:'seconds', min, max} | {type:'contacts', value} | {type:'throws_per_side', value} | {type:'metres', value}
 *            | {type:'minutes', min, max} | {type:'rounds_work', rounds, work_s} | {type:'cuts', value} | {type:'test', test}
 *  Effort   = {type:'rir', min, max, rpe_min, rpe_max, last_set:'max'|'myo'|null, intensifier:boolean, circuit?:true, key?:string}   // v0.4 B3: circuit stations
 *            | {type:'intent', key} | {type:'role', role:'survival'} | {type:'aerobic', colour, modality?, pattern?} | {type:'power', key}
 *  Rest     = {type:'seconds', min, max} | {type:'after_pair', min?, max?} | {type:'work_rest', min, max} | {type:'as_prescribed'} | {type:'circuit', transition_s, between_rounds_s}
 *  Load     = {type:'week1_tip'} | {type:'power'} | {type:'bw_pct', min, max} | {type:'medball_lb', min, max} | {type:'height', value:'low'|'medium'} | {type:'pct_hint', pct}
 *            | {type:'lb_range', unit:'dumbbells'|'kettlebell', min, max}   // pct_hint never emitted in Phase 0 (D-29); lb_range = WOD station loads (B3) */
```

### 4.1 `engine/util.mjs` — owner B4 (first version shipped by the architect; everyone imports it)

```js
export class EngineError extends Error { constructor(code, message, details) }
export function canonicalJSON(value) → string               // sorted keys, no whitespace
export function hash53(str) → string                        // cyrb53, 14 lowercase hex chars
export function makeSeed(intakeForHash, modelVersion) → string   // 'c53:' + hash53(canonicalJSON(i) + '|' + v)
export function tieBreak(seed, ...parts) → number          // uint32 = parseInt(hash53(seed+'|'+parts.join('|')).slice(0,8),16)
export function round2(x) → number                          // half away from zero
export function roundHalfUp(x) → number                     // Math.floor(x + 0.5 + 1e-9)
export const EPS = 1e-9
export function why(key, ref, args) → Why                  // frozen; omit args when empty
export function addDays(isoDate, n) → string               // UTC 'YYYY-MM-DD'
export function weeksBetween(isoA, isoB) → number           // floor((B-A)/7 days)
export function weekdayOf(isoDate) → 'Mon'|…|'Sun'
export function stableSortBy(arr, ...keyFns) → arr copy    // multi-key; keys return number|string; ascending
export const WEEKDAYS = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun']
export function deepFreeze(o) → o
export function clamp(x, lo, hi) → number
export function forbiddenKeys(obj) → string[]               // dotted paths of keys matching /^(sex|gender|sleep|stress|recovery|job|hard_job_or_other_sport|life|energy)$/i (H13, H16)
```

### 4.2 `engine/model.mjs` — owner B4 (first working version shipped by the architect, smoke-tested on the fixture; B4 completes `assertModel` and the tests)

```js
/** @param {{manifest,catalog,rules,templates,profiles,i18n:{en,es,es_review?}}} raw  @returns {Model} */
export function loadModel(raw)
/** @returns {string[]} contract errors (empty = OK): every §3 shape, band regex, credits == class map, KB swing rules, i18n coverage */
export function assertModel(raw)
```

`Model` (deep-frozen; raw objects not copied twice). Engine code reaches the data **only** through these members:

| Member | Contract |
|---|---|
| `version` | `raw.manifest.model_version` |
| `rules`, `templates`, `profiles`, `manifest`, `i18n` | the raw objects (frozen) |
| `ex(id)` / `hasEx(id)` / `exercises()` | ExerciseRecord (aliases resolved; throws `model.unknown_exercise`) / boolean / all sorted by id |
| `bySlot(bucket)` | records whose `slots` include `bucket` (`CORE_OTHER` → `CORE_ANY`, `ISO_HAM` → `ISO_LEG_FLEXION`), sorted by id |
| `isDefaultIn(exercise, bucket)` | `exercise.default_in_slots.includes(bucket)` (alias-resolved bucket) |
| `byMuscle(m, {prime=true})` | non-athletic records crediting `m` at 1.0 (prime) or > 0 |
| `bucket(id)` | BucketDef (aliases resolved) |
| `template(family, days)` | Template or throws `model.unknown_template` |
| `dayTypes(template, variant)` | `{week_layout, day_types, variant}`: the variant's day types merged over the base (`week_layout: null` → base layout) |
| `templateFor(family, days, variant)` | `{template, variant, fallback_days?}`; the requested variant when it exists, else D-22: a `status: unbuilt` template → its first built variant (alphabetical) with a week layout, else the family's `days − 1` template |
| `goal(id)`, `sport(profileId)`, `hasSport(profileId)`, `pickerSport(sportId)`, `activity(id)` | defs (profile and sport aliases resolved) |
| `muscle(id)`, `muscleIds({target})`, `groupOf(muscle)`, `groupMembers(group)` | muscle defs / ordered ids / R2-SES-05 group |
| `stair(N)` | `rules.stairway.by_N[N]` + `phases_by_N[N]` + `exercise_blocks_by_N[N]` + `athletic.stages.weeks_by_N[N]` (throws for N outside 2-16) |
| `kitAvailable(exercise, kit)` | `kit = {tokens:Set|string[], machines:string[]}`; §3.2 availability rule |
| `credits(exercise, bucket)` | per-set credits; `{}` when `bucket` is in `rules.credit.athletic_slot_buckets` (H09) |
| `t(lang, key, args)` | string, ES→EN fallback, `{x}` filled from args |
| `has(lang, key)` | boolean (no fallback) |

### 4.3 `engine/intake.mjs` — owner B2

```js
/** @returns {{ok:boolean, errors:Issue[], warnings:Issue[], intake:object}} normalized intake (defaults filled) — §2.1 */
export function validateIntake(intake, model)
/** @returns {{refer:boolean, reasons:string[], bypass:boolean}} reasons = refer.reason.* keys (V1; R2-GEN-03) */
export function safetyScreen(intake)
/** @returns {{ok:boolean, issues:Issue[]}} V21 / H20: release accepted, version matches role and age */
export function checkRelease(intake)
/** @returns {Derived} — calls volume.computeTargets for D9 */
export function deriveValues(intake, model)
```

Required behaviour (each line = at least one unit test):
* **safetyScreen**: `role == self` or `health_route == coach_screen` → any `safety.*` true → refer (`refer.reason.<key>`);
  `health_route == coach_own_sop` → safety not read, `bypass: true` (the plan shows `warning.coach_bypass` /
  `ui.plan.coach_bypass_stamp`); any pain `severity: severe` → refer `refer.reason.severe_pain` **always**.
* **checkRelease**: `accepted === true`; expected version = `release.minor` when age < 18 (and `guardian === true`), else
  `release.coach` when role client, else `release.client`.
* **D1** family = `D2.template_hint.family` when the lead profile has one, else `templates.goal_to_family[goal]`;
  `no_equipment` when the kit profile is in `kit_family_override.profiles` and the goal is not in `except_goals`.
  `format = intake.format || 'gym'`.
* **D2 profile** (spec `derived_values.D2_profile`, 7 steps):
  1. resolve aliases (`profiles.id_aliases`);
  2. goal muscle / strength / fat_loss / general / hybrid → `goal_defaults[goal]`; when an `activity` is given, the activity's
     profile leads only if its `lead_for_goals` includes the goal (crossfit_class, hyrox_fitness for `hybrid`); otherwise the goal
     profile leads and the activity is kept in `activity_ids` (aerobic counting only in Phase 0, D-24);
  3. goal athletic + competitive → `picker.sports[sport]`: `positions[position].profile` (or `profile_by_choice[position_detail]`);
     no position → `default_profile`; `variant` = position variant, else `second_choice` option variant (swimming stroke), else
     `default_variant`; `age_variant` (pickleball 60+ → `pickleball_senior_60_plus` when it exists as a variant);
  4. goal active, or athletic + recreational → `activity(ids[0]).profile` (`rec_league` → `league_sport[].profile`,
     `rec_combat_fitness` → `style[]`); `ids[1]` kept in `activity_ids`; no position, no season;
  5. athletic + none → `weekend_warrior`;
  6. overlays from age: ≥ 60 → `active_aging_60plus` (lead when the profile is weekend_warrior); 50-59 non-competitive →
     `active_aging_50plus` (lead when weekend_warrior; otherwise overlay + the profile's `age_rules.age_50_plus` racket rules);
     < 18 competitive → `youth_athlete`, < 18 otherwise → `youth_general_athletic`;
  7. copy `ath03_group`, `ground_contact_class`, `season_type`, `name_key`.
* **D3** `years < L1_below_years` → L1; else L2; **L3 when `years ≥ 3` and `days_per_week ≥ 4`**, or a competitive physique /
  strength athlete (PROPOSED, D-01; `level.reason.*` + `why.level_reason_l3`). `months_off_last_2y ≥ 6` → L1 (`layoff`; ladder
  keeps the years level). `former_competitor` → L1, `replace_after_block: 1`. `exercise_ladder = levels.exercise_ladder[years
  level]`, capped at `youth_max_ladder` below 18.
* **D4** competitive only. `next_season_start`: `weeks_to_season = weeksBetween(start_date, date)`; phase by
  `plan_types.season.weeks_to_season` (≥ 20 OFF_EARLY, ≥ 12 OFF_BUILD, ≥ 6 OFF_LATE, else PRE). `in_season_until` → IN.
  `competition_date` → same thresholds + `D5.overlay = 'prep'`. `no_season` → OFF_BUILD (INFERRED). `season_type` from D2;
  `practice_days`, `game_days` from F15.
* **D5** `mode = plan.mode`; `skeleton = plan_types.skeleton_ids[goal or 'athletic'][mode]` (`any` for maintenance / wbw / year);
  `weeks` = 12 / 8 / `maint_weeks` (default 4) / 12 (week_by_week) / 52 (year); overlay `season` for competitive athletes with a
  dated season, `prep` with a competition or event date.
* **D6** template = `templateFor(D1, days, variant)`; variant by `rules.template_select.variant_order` (first that applies and
  exists on the template): `split_style` (`ppl → ppl_x2`, `upper_lower → upper_lower`; not available → default +
  `warning.split_style_unavailable`), `profile_template_hint.variant`, unbuilt-main fallback, `same_pattern` (athletic with
  `ath03_group ∈ pairing.same_pattern.ath03_groups`), circuit format (fat_loss_bootcamp + `format: bootcamp` → the circuit day
  types: 3-day BC1-BC3 are already circuits; 4-day → `bootcamp_circuit`). `in_season` variants are chosen per training block by
  `week.mjs`, not here. `pairing` = template family pairing (`same_pattern` for aesthetics / strength, `cross_pattern` otherwise;
  same-pattern variant → same).
* **D7** first match of `rules.equipment.family_select` (`older` = age ≥ 60; `pain_moderate` = any moderate pain).
* **D8** kit tokens = `profiles[profile].kit` ∪ `extras` ∪ tokens of listed `machines` ∪ `cardio_tokens[cardio_options]`, then
  `running_space` (drop / add per `rules.equipment.running_space`; `run` keeps `open_space_long`), minus banned tokens; sorted
  unique. `machines` = intake list if non-empty, else every machine whose token is in the kit. `medball_max_lb = min(20,
  max(medball_lb_owned))` or null. **Never infer kit from a template or program name** (R2-LIB-08).
* **D9** `volume.computeTargets(derivedSoFar, model)`.
* **D10** first match of `rules.bilateral_share.select` (`sport` → `D2` SportDef `share` when not null); pain shift −0.2 for areas
  with `share_shift_to: unilateral`, +0.2 for `bilateral`; clamp to `slider_range`.
* **D11** enabled when `goals[goal].plyo_block` (athletic, active) or the family is athletic; `plyo_share` from SportDef;
  `older_mode`: age ≥ 60 → `opt_in` when `prefs.older_athletic_opt_in` else `default` (power work off: landings only);
  `contacts_session_max = athletic.contacts_per_session_max[L]`; `weekly` from SportDef `athletic_weekly`;
  `olympic_exposures_wk` from SportDef (null / `none_by_default` → no Olympic slot content outside athletic families);
  `game_heavy` = SportDef `in_season.game_heavy` (or sport in `in_season_game_heavy.sports`);
  `heavy_play_week = play_days.length ≥ athletic.heavy_play_weeks.min_play_sessions` (R3-ATH-05).
* **D12** the planned stairway step: `{early: 0.03, late: 0.05}` from `rules.stairway.standard_steps`, `caps.nonpriority_while_priority
  = 0.03` when priorities exist, `caps.older = 0.03` from 60. **No intake input decides the step** (R2-VOL-03, R2-GEN-04).
* **D13** `items = plan.tests` (minus `none`); `baseline_week = 1`, `end_weeks` = last week of every stairway block (shape fills
  exact weeks); `from_zero = previous_cycles.count == 0 && !just_finished_block || level L1 || layoff` (R2-PER-07).
* **D14** base = SportDef `aerobic.off` (athletes / activities; `pre` / `in` per block in week.mjs), else
  `rules.conditioning.sessions[population]` (muscle → aesthetics, strength → powerlifter, hybrid → hybrid); `adjust =
  prefs.cardio_adjust` (clamped, total ≥ 0; extra sessions colour C); `replaced_by_activity` = min(play sessions, `max_replaced`)
  when the profile has `aerobic.activity_counts` and play days exist, keeping ≥ `keep_gym_led_min` gym session if base ≥ 1
  (r3 R3-ATH-05); `walks` from the goal; `fighter_open` for combat profiles (ORD-09); `sport_is_aerobic` from SportDef.
* Warnings: V2 (weekdays < days), V3 (athlete at 30 min), V6 (season inside the plan window), V7 (buy list), V8 (priorities
  trimmed), older opt-in (`warning.older_athletic` whenever age ≥ 60, R2-ATH-08 copy), minutes clamp, split style, coach bypass.

### 4.4 `engine/shape.mjs` — owner B2

```js
/** @returns {Shape} */
export function buildShape(derived, model)
```

* **Training blocks** (H15: nothing is ever inserted inside a stairway):
  * `fixed_12` / `fixed_8` → one `stairway` block of N = 12 / 8 weeks, **unless the season overlay applies**.
  * **Season overlay (competitive, dated season, D-10)**: `W = weeks_to_season`, `pre = plan_types.season.pre_weeks_default` (4).
    If `W − pre ≥ N` → one stairway of N (pre-season follows after the plan: `after_plan.next = 'pre_season'`). Else if
    `W − pre ≥ min_offseason_stairway_weeks` (4) → `stairway [1, W − pre]` + `pre_season [W − pre + 1, min(N, W)]` (+ `in_season`
    weeks after `W` when `N > W`); the last `taper_weeks_by_pre_len[pre]` weeks of the pre-season are `taper` weeks (none for
    season type `C`: meet sports taper before the championship, not the first meet). Else (`W < 8`) → the lead-in is all
    `pre_season` (taper as above), then `in_season`. `after_plan` names what follows (`pre_season_rest` with the remaining weeks).
  * `maintenance_4_6` → one `maintenance` block of `maint_weeks` (1-8).
  * `week_by_week` → one 12-week `stairway` block (`open_ended: true`; Phase 0 shows the planned 12, D-27).
  * `year` → `rules.plan_types.year.layout` (Q1 stairway 1-12 with `flat_sets`, recovery 13, Q2 stairway 14-25 one cycle up,
    recovery 26, Q3 maintenance 27-39 × 0.7, Q4 stairway 40-50 two cycles up, holidays 51-52 × 0.6) from the start date (D-26).
* **Exercise blocks** = `rules.stairway.exercise_blocks_by_N[N]` inside each stairway (12 → 1-4 / 5-8 / 9-12; 8 → 1-4 / 5-8;
  6 → 1-6); every other training block is one exercise block. Every training-block boundary starts an exercise block (D-25).
* **Stairway weeks**: `stair_week` 1..N; `stair_level = stair(N).display_level[w]`; `standard_step = stair(N).standard_steps[w]`;
  `phase` from `stair(N).phases_by_N[L]` (ACCLIMATION / DRIVE / HARDEST); `planned_rir = effort.planned_map[planned_effort[w]]`
  (12 weeks: 3,3,3,3,3,3,2,2,2,1-2,1-2,1 + intensifiers). Flat blocks: phase = block type, `planned_rir =
  effort.by_block_type[type]`, `standard_step = null`.
* **Athletes** (`D1 = athletic` or D11 enabled): `rep_phase = reps.athlete_vol_phases.by_exercise_block[i]` (clamped; pre / in →
  VOL3); `plyo_stage` from `stair(N)` RC weeks (`start_stage` RC1; pre-season / maintenance hold the stage reached; in-season hold);
  `season_phase` per week from `W − (n − 1)` thresholds (PRE inside pre-season, IN after the date).
* **Tests** (D13, H19): if items, week 1 of every stairway = `{type: 'baseline', from_zero}`; its last week = `{type: 'end',
  from_zero: false}` (an end test closes a completed block, D-40); never in other block types or other weeks.
* **Circuit format** (D6 format circuit): `circuit = {rounds, work_s}` per stairway week: `rounds = supersets.bootcamp.stairway.
  rounds_max_by_minutes[minutes]` capped at `rounds_start` (3) for ≤ 45 min; `work_s = roundTo5(work_s_start + (work_s_max −
  work_s_start) × (stair_level − 2) / 9)` (8 weeks: 35 35 40 40 40 45 45 50) (D-19).
* `phase_key = 'plan.phase.' + phase`; `why` carries step, phase, block type, season plan, tests.

### 4.5 `engine/volume.mjs` — owner B2 (the 12_volume_algorithm_v1 v1.1 engine)

```js
/** @returns {Targets} */
export function computeTargets(derived, model)
/** planned T(w) per target muscle for one stairway block @returns {{lambda:Object<string,number>, steps:Object<string,number[]>, T:Object<string,number[]>}} */
export function stairwayPlan(targets, trainingBlock, derived, model)
/** @param {{derived:Derived, shape:Shape, layouts:WeekLayout[], selections:Selection[], model:Model,
 *           fillSlot:(slot:SlotDef, weekN:number)=>SlotFill,
 *           estimateMinutes?:(day, setsBySlot, fillsBySlot, model)=>number}} ctx   // layouts[i] = base layout of training block i+1;
 *           fillSlot injected by generate; [1.1.1] generate passes week.estimateMinutes so volume and the plan use one time model
 *  @returns {VolumePlan} */
export function planWeeklySets(ctx)
/** @returns {AthleticBudget[]} one per week */
export function athleticBudget(derived, shape, model)
/** weekly credited sets from a set map (exported for validate / tests) */
export function weeklyCredits(layout, setsBySlot, fillsBySlot, model) → {muscle: number}
```

**computeTargets** — for each muscle with `defs[m].target` (rules.volume.order_of_operations):
1. `base = volume.start[m][L]`; modifier = `modifier_select` first match (ctx: family, competitive, ath03_group, body_weight_lb,
   goal). Factor = modifier `lower|upper|small` by class / region. **Own sets** (rear delts, `own_sets`) → factor 1 always
   (4 / 6 / 8, R2-VOL-04; D-04). **Calves** (`per_leg_day`) are never credit-only (step 7). **Credit-only**: any other muscle
   whose factor is `'credit'`, or with `athlete_fill: 'credit'` when the modifier's `small` is `'credit'` (glutes) → `fill
   'credit'`, `start = cap = null` (UNI-02; stay_active too, D-07).
2. `start = roundHalfUp(base × factor)`; `cap` per `rules.volume.cap_rule` = `max(roundHalfUp(cap[m][L] × factor), start +
   roundHalfUp((cap[m][L] − start[m][L]) × factor))` (D-02); own-sets caps unscaled.
3. Priority (≤ 2 intake choices, `intake_map`; `v_taper` → side delts + lats, chest held): `start += priority.add[L]`;
   `cap = priority.cap[m] || priority.cap.default` [L] (≤ `absolute_cap` 30; Pro setting Phase 1).
4. **Floor**: `start = max(start, 10)` for `fill: target` muscles except own-sets (R2-VOL-06, H17).
5. Pain muscles (`pain.areas[area].muscles`): `start = roundHalfUp(start × pain.start_factor)` (pain wins over the floor; floor
   exempt).
6. Profile `volume_ratios` (swimming pull rule): raise `muscle` start / cap so `muscle + Σplus ≥ min × Σover` (D-09).
7. Calves: `start = max(volume.calves.weekly_floor, per_leg_day[L] × leg_days)` (leg days = main days with an `ISO_CALF`
   station), cap `cap.calves[L]` unscaled. Abs: `core_block`.
8. Maintenance mode: `start = factor[maint_reason] × start` (older ≥ 0.7), flat, not floored. Cycles (`previous_cycles.count > 0`
   and not `last_had_holds_or_pain`): `start × 1.05^count` (half up), `cap + count` (≤ 25 / 30).
9. `cap = max(cap, start)`.

**stairwayPlan** (12 v1.1 §3.7.1; D-18): for a stairway of N weeks, standard steps `s_w` (w = 2..N) from `stair(N)`; per
muscle the steps are first capped, `s'_w = min(s_w, caps)` (non-priority while priorities exist 0.03; age ≥ 60 0.03; pain
muscles 0 for the first `freeze_weeks` steps, then 0.03, D-11); `G = Π(1 + s'_w)`; `λ = 1` if `start × G ≤ cap`, else
bisection (60 iterations on [0, 1]) of `start × Π(1 + λ s'_w) = cap`; `T(1) = start`, `T(w) = min(cap, T(w−1) × (1 + λ s'_w))`,
and **`T(N) = cap` exactly when λ < 1**. Planned step into week w = `λ s'_w` (≤ 0.07 always; the early steps never exceed the
late ones). Acceptance (12 weeks, single muscle, no priority, no staggering): L1 10 → 14 = 10 10 10 10 10 11 11 12
12 12 13 14 (λ 0.76); L2 15 → 22 = 15 15 15 16 16 17 17 18 19 20 21 22 (λ 0.867); L3 20 → 25 = 20 20 20 20 21 21 22 22 23 23 24
25 (λ 0.501); 8 weeks L2 15 → 22 = 15 15 15 16 17 18 18 19 (λ 1).

**planWeeklySets** — 12 v1.1 pseudo-code, with these rules:
* **Sets per slot, week 1 of a stairway**: `sets_hint[minutes ≥ 90 ? 1 : 0]` when present, else `session.default_sets` by kind
  (compound 3, isolation 2, first calf station 2 / second 1, core 2, athletic 2 / 3 at 90 min, focus 2); `AP_TRIPLE_EXT` with a
  ramp lift (DB / KB / pull / hang, L1 tier): `olympic.ramp[exercise_block_week−1].sets` (4). Warm-up / cooldown / aerobic / WOD /
  skill slots have no sets.
* **Credits** use the *picked* exercise and the slot (`model.credits(ex, effectiveBucket)`), never the slot alone.
* **Week-1 fit**: trim muscles above start + 1 (latest isolation first, never below `min_sets`), then add to muscles below start − 1
  (largest relative deficit first) with `placeSet`. Credit-only muscles are never trimmed or steered.
* **Weekly loop (stair_week ≥ 2)**: `T(w)` from stairwayPlan (no check-in = exactly this, H22); release whole sets while
  `T(w) − sets[m] ≥ 1 − EPS` and `sets[m] + 1 ≤ cap[m]` and the person's total stays **strictly below** `1.10 × total(w−1)`
  (staggering order: priority, big, small, then `muscles.order`; a muscle that cannot release this week keeps its bank, max 1.99);
  at cap → hold + `changes.load_up`. Sets never decrease inside a stairway (H21).
* **placeSet(m)**: days where `m` is a prime mover, alternating (the day after the last add for that muscle; when a day type runs
  twice a week: day A's first exercise, then day B's — R3-VOL-03 default); laterality group when the region's bilateral share is
  > 0.03 off target; inside the day **VOL-07**: the first slot (session order) whose sets < the first slot's sets, else the first
  → 2/2/2 → 3/2/2 → 3/3/2 → 3/3/3 → 4/3/3. Limits: `max_sets_per_exercise[L]` (isolation 4), per-session fractional ≤ 11 (priority
  14), day minutes ≤ `minutes × long_day.warn_above_factor` (try supersets first, ORD-05). No room → small muscle: bonus exercise
  (2 sets, same bucket, `origin: 'bonus'`) on the optional day as a Focus slot, else on a training day that already trains its group
  (fewest exercises first; never its only exercise of the day); big muscle: Focus slot (2 sets) on the optional day, else a day
  training the region; created via `ctx.fillSlot`. Still no room → `shortfalls += {muscle, missing}`; when a floor-10 muscle stays
  below 10 because of time → `warning.floor_schedule {muscles, advice}` (D-33).
* **Pre-season block**: every slot `max(1, roundHalfUp(0.6 × sets in the last stairway week))` (D-37), flat; RIR from
  `by_block_type`; athletic budget × SportDef `pre_season` factors. **Taper weeks**: `max(1, roundHalfUp(0.5 × pre-season sets))`.
  **In-season**: `athlete_in` factors on the in-season layout (2 days), flat. **Maintenance**: week-1 fit to the maintenance
  targets, flat; time check → `warning.maintenance_time` when the schedule holds < 90 % (D-18 of v1.0 kept). **Recovery week**
  (between two stairway blocks only): `ceil(0.5 × hardest-week sets)` per slot, min 1.
* **Circuit format** (bootcamp): sets per circuit station = the week's `circuit.rounds` (a round = 1 set, D-19); the stairway climbs
  by `work_s`; floor exempt; total-rise check applies to rounds (rounds never rise inside a 45-min block).
* **Year Q1 `flat_sets`**: sets stay at week-1 values (the cut: "sets stay at the starting level", R2-PER-01); the stair climbs by
  load, RIR and cardio.
* Output per week: integer `sets_by_slot`, `target_by_muscle`, `weekly_sets_by_muscle` (all muscles, round2, coach count),
  `direct_sets_by_muscle`, `step_by_muscle`, `total_resistance_sets` (resistance + isolation + focus + bonus slots; excludes core,
  warm-up, athletic, power, skill, WOD, prehab, aerobic), `rise_vs_prev`, `banks`, `est_minutes`, `changes` (`changes.set_added
  {exercise, day}`, `changes.bonus_added`, `changes.at_cap`, `changes.load_up`, `changes.new_exercise_block`, `changes.stage_up`,
  `changes.circuit_longer`), `shortfalls`.
* Exercise-block boundaries: sets carry over by `slot_id`; credits recomputed with the new selection; a laterality swap that adds no
  sets is exempt from the 10 % check. The stairway does **not** restart at an exercise-block boundary.
* **MYO** never changes `sets` or caps; reported as `summary.myo_equivalent_sets_by_week` only (D-13).

**athleticBudget** — per week: `plyo_share = start + (end − start) × (w − 1) / (N − 1)` over the stairway (pre-season / in-season:
`end`); `stage` from the shape; `targets` linearly from `weekly[x][0]` (stair week 1) to `weekly[x][1]` (last stair week), rounded;
factor: pre-season SportDef factors, taper 0.5, recovery 0.5, game-heavy in-season 0.5, heavy play week (D11) plyo 0.5 + no extra
COD; disabled (non-athletic families; 60+ default → landings only, contacts from `low_contacts`) → targets null except landings.
**v0.4 stage B2** (now in `engine/athletic.mjs`, re-exported here): the contact targets are the 04 volume split by the plyo share
(`jump_contacts` = ballistic / landing jumps, `plyo_contacts` = reactive jumps, none in stage 1, `low_contacts` = ankle work,
E-28); the ramp tops out the week before an end-test week, which holds it (`hold: true`); the 60+ default keeps landings
(`jump_contacts`), light throws and quick stepping (`cod_cuts`); a general-population circuit keeps its `throws` (E-38).

### 4.6 `engine/week.mjs` — owner B3

```js
/** base week of one training block @returns {WeekLayout} */
export function buildWeekLayout(derived, shape, trainingBlock, model)
/** per-week view: test flags, taper / recovery removals, aerobic colours of week n, circuit dose @returns {WeekLayout} */
export function layoutForWeek(base, weekShape, derived, model)
/** estimated minutes of a day (time_model; supersets; changeovers; circuits) */
export function estimateMinutes(day, setsBySlot, fillsBySlot, model) → number
```

* Template = `model.templateFor(D6.family, D6.days, D6.variant)` for stairway / pre-season / maintenance blocks; in-season blocks
  use `plan_types.season.in_season` (`athletic.2` variant `in_season`) on the user's first 2 weekdays, hard day ≥ 48 h before a game.
* **Weekdays**: the template's planned training days (kind main + non-optional OPT) map in order onto `derived.weekdays` (sorted
  Mon→Sun); optional OPT days, WOD-only days and aerobic days go to free weekdays nearest the template weekday (ties: later),
  **skipping play days and game days** (D-42); ≥ `session.off_days_min` full OFF day always (Sunday preferred). Play days appear as
  `kind: 'play'` days (no items; `ui.plan.play_day`), practice days are not placed (sport practice is not in the gym plan).
  `warning.play_48h` when a day with a counted spine lift sits < 48 h before a play / game day (R3-ATH-05).
* **Stations → slots**: keep stations with `include_from_minutes ≤ session_minutes`; apply `condition`; `older_default_excluded`
  stations for age ≥ 60 without opt-in become landing / easy versions (select restricts the pool; AP_TRIPLE_EXT dropped, why
  `why.older_default`); prehab stations added from `rules.prehab.by_injury_code` for the profile's injuries (+ 50-59 racket rules:
  `PREHAB_LOWER` on each leg day, `RECOVERY_ARM_CARE` weekly) in block `prehab`.
* **Order**: blocks by `rules.ordering.block_order`; the core block per `prefs.core_position`; fighter opening aerobic (ORD-09);
  athletic block by `athletic_bucket_order`; priority small muscle first (ORD-04, allowed override); H before V asserted per day
  (exempt when the vertical is role `work`, D-30) — `week.mjs` swaps the two upper slots if a template ever violates it otherwise.
* **Pairing** (UNI-11) kept from the template pairs (`pair` / `superset` ids); not checked for `upper_lower`, `ppl_x2`.
* **Supersets** active when `session_minutes < superset_below_minutes`, or `prefs.supersets_for_fatigue` and L1 / L3, or athletic
  family off-season (999); off in taper and recovery weeks.
* **Caps / time**: split days (`full_body: false`) count `counts_in_cap` stations ≤ `exercise_cap_by_minutes[minutes]`; athletic
  family ≤ `athlete_cap` 12 (core, warm-up, skill, prehab, conditioning, aerobic, cooldown outside; two small isolations in one
  superset = 1); full-body days have **no count cap** but keep 2-4 per group. Over the cap or over `minutes × 1.10`: supersets first,
  then `cut_order[family]` — **never cutting a group below 2 exercises** (`group_min_exercises`); nothing left → keep the day and add
  `warning.long_day {day, min, limit}` (D-34).
* **Exclusions / pain buckets**: `running` → drop `AP_SPRINT AP_COD COND_SPRINT_BUYOUT`; `jumping` → drop `AP_PLYO
  AP_JUMP_LIMITED_KNEE`; heavy play week / game-heavy in-season → drop `AP_COD` (no extra agility); each drop adds a day-level why.
* **Warm-up** (ORD-08): `WARMUP_GENERAL` → text `warmup.any_cardio_5min`; `WARMUP_PREP` → A-drills on lower / athletic days (catalog
  warm-up record in kit, else `warmup.running_warmup`), mobility on press days; aesthetics may use the dynamic medball warm-up (the
  only medball use, ATH-05). Never volume.
* **Skill / WOD** (class model): `SKILL` → one skill item; `COND_WOD` → one WOD item (format rotates amrap → emom → for_time by
  main-day index; 10-20 min by stair level; 3-4 stations from the COND_WOD pool in kit; never muscle credit) (D-20).
* **Aerobic** (D14, R2-SES-06): sessions placed 1) on aerobic days and optional days that hold a `COND_AEROBIC` station, 2) on new
  aerobic days on free weekdays while ≥ 1 OFF day remains (never on play days), 3) as add-ons after lifting (lowest est. minutes
  first); colours `fill_order [C, B, A]`, extra sessions C (never the same colour twice except the extra Orange); recovery weeks C
  only; `D14.sport_is_aerobic` and `per_week 0` → no aerobic slot (optional-day `COND_AEROBIC` station dropped, `why.sport_is_aerobic`);
  walks → `cooldown` text slot `note.walk_after` on main days.
* `layoutForWeek`: taper / recovery → remove buy-outs, finishers, MYO, supersets; test weeks → mark tested items; recolour aerobic
  slots; circuit dose; nothing else changes inside an exercise block.

### 4.7 `engine/select.mjs` — owner B3

```js
/** @param {{derived, shape, layout:WeekLayout, targets:Targets, exerciseBlock:number, prev:Selection|null, model, seed:string}} ctx
 *  @returns {Selection} fills for every exercise slot of the layout for that exercise block */
export function selectBlock(ctx)
/** single slot (bonus / focus / substitutes) @returns {SlotFill}
 *  [1.1.1] ctx.selection (the exercise block's Selection: template picks feed second-exposure and spine state) and ctx.day_used
 *  (exercise ids already on the slot's weekday from other added slots): an added slot never repeats an exercise of its day */
export function fillSlot(slot, ctx)
/** scored candidate list (tests, explain) @returns {Array<{exercise_id, score, reasons:Why[]}>} */
export function candidates(slot, ctx)
```

Hard filters, in order (an empty pool walks `rules.equipment.substitution_order`):
1. Pool = `model.bySlot(bucket)`; `ISO_SIDE_REAR_DELT` by `variant` → classes `ISO_SIDE | ISO_REAR + FACEPULL | ISO_FRONT`;
   `AP_TRIPLE_EXT` by `variant` → olympic families `clean + loaded_jump` (clean station), `snatch` (snatch station), `swing`
   (swing station: KB swings, ballistic), `jerk` either; no variant → any family (R2-ATH-04, `why.clean_day` / `why.snatch_day`); FOCUS / bonus → records whose prime muscle is `focus_muscle`
   (isolation or constraint ≥ 4 preferred); laterality-dial slots may use the sibling bucket (effective bucket).
2. `model.kitAvailable(ex, D8)`; `olympic_from_floor` lifts also need `barbell_bumpers_platform` (no bumpers → hang variants, ATH-10).
3. Never: tags in `never_exercise_tags` (`v_squat`), banned tokens (H01); **KB swings never in a resistance slot** (D-12).
4. **Older (≥ 60)**: `older_ok` by default; `older_opt_in_ok` with `prefs.older_athletic_opt_in` (+ `note.older_opt_in`); plyo
   buckets by default only `landing` quality; never `overhead_squat low_bar`; Phase 0 also never `depth_jump high_depth_drop snatch`
   (D-05). **Injured / high-volume** (client family `older_or_pain`): never `snatch depth_jump overhead_squat low_bar` (EQ-03).
   **50-59 racket profiles** (`population.active_aging_50`): avoid `depth_jump high_depth_drop hurdle_hop bound` unless opted in
   (R3-ATH-02). **Youth**: `level ≤ youth_max_ladder`; `olympic_from_floor` only age ≥ 14 with tag `youth_floor_ok` **and**
   `previous_cycles.count ≥ 1` (after one hang block, D-41).
5. Pain: per area, `avoid_tags` and `worse_with` filters on slots whose muscles / patterns the area touches (shoulder → pushes and
   delts; lower back → `spine_counted` / axial ≤ `max_axial_class`; knee → deep knee flexion, depth jumps, high impact, hurdle hops,
   bounds); `prefer_tags`, `constraint_bias` and rotation bias (R2-LIB-03) are scored.
6. Exclusions (F38): `barbell` → tag barbell; `lunges` → UKD lunges; `overhead_pressing` → tag overhead; `floor_work` → floor core;
   `machines` → tag machine.
7. Medball: goal `muscle` → no `medball` tag outside the warm-up (H11); loads must fit `D8.medball_max_lb` (≤ 20). No medball in
   kit → `medball.no_ball_substitutes` (`no_medball_sub`, EQ-07).
8. **Two spine days (H07)**: walk days Mon→Sun; per pattern at most one `axial: true` pick a week, on the station with
   `axial_req: 'axial'`; the counted squat and the counted hinge never on the same day; every other squat / hinge slot of the week
   takes `spine_class ∈ {second_day, not_counted}` (`why.two_spine_days`); `home_second_squat: 'unilateral'` without machines.
9. **Second weekly exposure** (PER-04): an exercise already picked for the same bucket earlier in the week is excluded.
10. Machine isolation slot empty (`ISO_QUAD`, `ISO_LEG_FLEXION`) → `equipment.machine_isolation_swaps`, else drop + 2 extra sets on
    the paired compound (`machine_iso_swap`).
11. Still empty → slot dropped, `buy_list` + V7 (`equipment.buy_list[bucket]`).

Score (`rules.selection.weights`): `+default_in_slot` (only `default_in_slots` records may be the pick when any passes the filters;
proposed records never default); `+preference_match` (F29b); `+constraint_in_band` when `constraint ∈ D7.main|iso`,
`constraint_distance × |distance|` otherwise; `over_ladder_step × steps above D3.exercise_ladder` (soft, CAT-05); pain prefer tags and
constraint bias; `machine_pen` / `skill_pen`; `+continuity` for the previous exercise block's pick; `+sport_use_match` when the
record's `sport_use` names the sport / activity; `+older_preferred` for 60+ / older_or_pain; core slots: plane rotation by day
(`core_block.plane_rotation`), transverse bonus for rotational groups; unilateral lower slots of court / combat profiles: frontal /
transverse bonus until `frontal_transverse_share`; **plyo / ballistic share**: athletic slots pick quality so that the exercise
block's plyometric sets ≈ `plyo_share × (plyometric + ballistic + throw sets)` (throws count as ballistic; R2-ATH-01), RC1 favours
`landing` / ballistic, RC2 receive-then-create, RC3 repeated plyometric; Olympic tier `L1` for L1 and for L2 in exercise block 1,
`L2_plus` from block 2 for L2 and always for L3 (ATH-10); profile Olympic preferences (swimmers: single-arm DB snatch first, 04).
Ties: §1.3.

Other rules:
* **Laterality share** (UNI-02): dial / secondary lower slots choose bilateral or unilateral (sibling bucket) so the week's lower
  bilateral share is within `tolerance` of `D10.lower.by_exercise_block[i]` (PRE / IN in those blocks); upper pushes / pulls likewise.
* **Contra / ipsi** (CAT-13): unilateral lower fills get `loading` from SportDef `contra_ipsi` (contralateral for COD sports,
  ipsilateral for sprinters, split stance always contralateral, health accessory in weeks 1-4 for bb / pl / swimmers).
* **Swaps**: 2-4 alternatives from the same filtered pool (same effective bucket), best score first, never the pick, never excluded
  (H01, H12 apply to swaps).
* **Exercise-block boundaries** (PER-02, R2-LIB-01): keep `work` and core picks; change at most `block_change.max_share_of_slots` of
  the other resistance slots per day (v0.4 B3: at least one, any kit) to a library alternative with the same pattern and laterality
  that differs in one detail (`detailDistance` <= `block_change.max_distance`; never Olympic-tagged, never back to an earlier block's
  pick, never another day's previous pick, never a home substitute from the real thing, never more than 3 score points below the
  current pick), or keep the exercise and set `detail = {axis, key: 'detail.v.<value>', value}` from `rules.selection.variations`
  (`variationValues`; rendered "<name> - <detail>"; never an invented exercise, never an axis-only placeholder); no concrete value ->
  no change (the day's next slot takes it); a kept exercise keeps its block's detail; flip laterality where the new share target
  requires it; flags `block_change`, `detail_variation`, `laterality_flip`. v0.4 B3: a session never holds two near-duplicates
  (`isNearDuplicate`); a second weekly exposure the kit cannot vary comes back with a concrete detail.
* `prefs.variety_ab` (PER-03): odd / even weeks alternate the `work` pick with the second-best default (supported; off in samples).

### 4.8 `engine/dose.mjs` — owner B3

```js
/** @param {{slot:SlotDef, fill:SlotFill, exercise:object|null, sets:number, week:WeekShape, day:DayLayout, derived:Derived,
 *           athletic:AthleticBudget, position:{index_in_day:number, is_last_resistance:boolean, is_first_lift_of_day:boolean,
 *           is_first_unilateral_lower:boolean, superset_active:boolean}, at_cap:boolean, model}} input
 *  @returns {Dose} */
export function doseItem(input)
/** aerobic slot dose (colour, minutes, any erg) @returns {Dose} */
export function doseAerobic(slot, weekShape, derived, model)
/** WOD / skill / circuit-station doses (class model, bootcamp). v0.4 B4: weekShape.athletic_week = the week's athletic object
 *  (targets, circuit_ball_sets) when generate calls it; input = doseItem's input when doseItem delegates @returns {Dose} */
export function doseConditioning(slot, fill, weekShape, derived, model, input)
/** rep class resolution, exported for tests @returns {string} */
export function repClassFor(slot, exercise, model)
```

* **Rep class**: bucket `rep_class`; FOCUS → by exercise; `RP_*` with constraint ≥ 4 → `machine_stable_compound`; unilateral /
  alternating → `unilateral_compound`; `ISO_SIDE_REAR_DELT` rear → `rear_delts`; prehab → `prehab`.
* **Column** = `rules.reps.goal_column[goal]` (active → general). Athletes: compound / isolation brackets from
  `athlete_vol_phases[week.rep_phase]` (VOL3 isolation = MAX). L1 hypertrophy main compound uses the `L1` bracket. Fat loss by
  exercise block.
* **Preference** (VOL-12): `volume_lighter` → big compounds one bracket up the ladder; `heavy_powerlifting` → the first lift of each
  day one bracket down; weekly sets never change.
* **Pyramid** `12/10/8 -20` (PRG-07): L2+, hypertrophy column, first main bilateral compound of the day, sets ≥ 4.
* **Unilateral**: `per_side` (10/10 = 1 set, UNI-01); `prefs.heavy_unilateral` → first unilateral lower lift `b4_6` (UNI-04).
* **Effort (H02, R2-PER-05; v0.4 B3 R3-VOL-04: intensifiers only in the last stairway week, one a day - a MYO set on the day's last
  small-muscle or machine isolation item, no MAX sets, never `effort.intensifiers.never_credit_classes`, never calves for an Achilles hot
  spot; circuits `{type:'rir', circuit:true, key}` from the planned RIR)**: `{type:'rir'}` from `week.planned_rir` ∩ `rir_band`, **min ≥ 1 for `never_failure_rep_classes`**
  (`compound_floor_rir`); RPE from `rpe_for_rir`; `intensifier: true` only in the last stairway week; `last_set:'max'` only for
  `effort.max.allowed_rep_classes` (small iso, rear delts, calves) and bodyweight work; `last_set:'myo'` only when
  `position.is_last_resistance` **and** (isolation or constraint ≥ 4) **and** (last stairway week, or `at_cap` in HARDEST); never in
  flat blocks. Strength roles: work 1, accessory 2, nuance MAX (small / bodyweight only), survival `{type:'role'}`. Speed work
  `effort.fast_rpe6`; athletic `{type:'intent', key:'effort.max_intent'}`; Olympic `{type:'power', key:'effort.olympic_power'}`
  (R2-GEN-06); circuits `effort.circuit`; WOD `effort.wod`; prehab `effort.prehab`; recovery RIR ≥ 3.
* **Rest** (VOL-14): hypertrophy compound 60-120 s (max 180), isolation 60-90 s, strength / heavy brackets 180-360 s, core 30-60 s,
  Olympic 120-180 s, plyo work:rest 1:5-1:10 (depth jumps 120-180 s), throws 45-90 s, prehab 30-60 s; active superset →
  `{type:'after_pair'}`; circuits `{type:'circuit', transition_s 15, between_rounds_s 90}`.
* **Load**: week 1 of each stairway → `load.week1_tip` note on main compounds (R2-GEN-06); Olympic → `{type:'power'}` + ramp sets ×
  reps for DB / KB / pull / hang lifts (`olympic.ramp[exercise_block_week−1]`, no %); full-catch lifts 3-5 reps with the same weekly
  reps (R2-ATH-05, `note.olympic_full_catch`); **no `pct_hint` in Phase 0** (no tested bests in intake/2; coach opt-in = Phase 1, D-29);
  loaded jumps `bw_pct 10-20` (EQ-15); medball `loads_lb[kind]` (youth / older −2 lb, min 4, ≤ min(20, owned max)); wall balls 10-20
  lb, ≤ 20; plyo heights low in RC1, low / medium later (EQ-16).
* **Athletic counts** (VOL-10): plyo contacts per set from `reps.matrix.plyo[stage]` (lower bound in the stage's first week rising to
  the upper), × 2 unilateral; throws `reps_per_side × 2`; COD reps; sprint metres; `athletic.total = sets × per_set`; per session
  plyo contacts ≤ `contacts_session_max` (trim per_set + why).
* **Tests**: in a test week the first item of each tested pattern on the test day becomes `{type:'test', test: <catalogue id>}`
  (from-zero catalogue in a baseline of a first block, after-completed-block catalogue at the end; never a 1RM / max mile from
  zero, `note.test_from_zero`); all other sets as planned (D-17).
* **Notes**: `note.rc1|rc2|rc3`, `note.per_side`, `note.split_grip` (joint pain; his instruction ****), `note.pain_swap`,
  `load.week1_tip`, `note.olympic_no_bumpers`, `note.olympic_power`, `note.olympic_full_catch`, `note.kb_swing_ballistic`,
  `note.second_calf`, `note.pre_season`, `note.taper`, `note.recovery`, `note.focus`, `note.bonus`, `note.fighter_aerobic_open`,
  `note.any_erg`, `note.wod`, `note.circuit`, `note.prehab`, `note.long_day`, `note.older_opt_in`, `note.play_counts_aerobic`,
  `note.heavy_play_week`, `note.core_supersets_optional` (once per plan, R2-SES-03).
* `doseAerobic`: catalog `COND_AEROBIC` pick of the slot colour available in the kit (any erg, EQ-14) or a text item; minutes
  `conditioning.minutes[colour]`; steady ≤ 40 min. `doseConditioning`: WOD `{format, minutes, stations}`; skill `minutes 6-10`;
  circuit station `{type:'rounds_work', rounds, work_s}`.

### 4.9 `engine/validate.mjs` — owner B4

```js
/** @returns {{ok:boolean, checks:Array<{id:string, key:string, severity:'error'|'warn', pass:boolean,
 *            violations:Array<{where:{week?:number, weekday?:string, slot_id?:string}, key:string, args?:Object}>}>}} */
export function validatePlan(plan, model)
export const CHECK_IDS  // ['V1',…,'V26','H01',…,'H22'] in order
```
Pure: reads only `plan` + `model`. `ok` = no failing `error` check. Definitions in §6.

### 4.10 `engine/explain.mjs` — owner B4

```js
export function whyText(why, model, lang) → string          // t(key,args) + ' [' + ref + ']'
export function explainItem(plan, ref:{week:number, weekday:string, slot_id:string}, model, lang) → string[]
export function levelText(plan, model, lang) → string       // "Intermediate (L2): 2 years of consistent training" (PRG-05)
export function changesText(plan, weekN, model, lang) → string[]   // "+1 set on Back Squat (Monday)" — never percentages (VOL-06)
export function stairText(plan, weekN, model, lang) → string // "Week feels like a 6.0 (2 = start, 11 = a little past your limits)"
```

### 4.11 `engine/render.mjs` — owner B4

```js
/** @param {{lang?:'en'|'es', format?:'markdown'|'text', view?:'full'|'overview'|'block'|'week'|'day', weeks?:'all'|number[],
 *           show_why?:boolean, show_swaps?:boolean, units?:'lb'|'kg'}} opts  @returns {string}   // v0.4 B3: 'overview' (screenshots) */
export function renderPlan(plan, model, opts)
export function renderBlockView(plan, trainingBlock, model, opts) → string   // one compact table per training day: exercises × weeks (sets×reps), stairway bar
export function renderWeek(plan, weekN, model, opts) → string
export function renderDay(plan, weekN, weekday, model, opts) → string
export function formatReps(rep, model, lang) → string       // '8 to 12 Reps', '10/10', '12/10/8 -20', 'MAX', '3 rounds x 40 s'
export function formatEffort(effort, model, lang) → string  // 'leave 2 in the tank (2 RIR · RPE 8)'
export function formatRest(rest, model, lang) → string
export function formatLoad(load, model, lang, units) → string
```

Markdown `view: 'full'` (phone-friendly; no table wider than 4 columns except the block view, which may be split per day). v0.4 stage
B3: the use-at-your-own-risk line with the release link comes right after the title (R3-GEN-01); 'Before you start' then 'Your
schedule' (`plan.time_check`, offers) come before the instruction block; the stairway table is week · level · effort · sets; the weekly
sets table is per FOCUS group; the week at a glance (day · session · time · groups) follows; each day card adds the switch-off line, the
superset suggestions and pair tags; `view: 'overview'` = header, notices, schedule, stairway table, group table, the first week at a
glance and one exercise table per day.
1. `# {program name}` · profile line · level line (`levelText`) · plan type / weeks · start date · release stamp
   (`ui.plan.release_stamp`) · coach bypass stamp when used.
2. **The coach's instruction block** (`instruction.title`, `instruction.1..5`) — always first after the title — then
   `effort.how_hard` (+ `effort.olympic` when the plan has Olympic lifts) and `warning.older_athletic` when age ≥ 60.
3. `plan.stairway_intro` + the stairway bar (week → stair level, phase, tests, exercise-block changes) · training blocks ·
   `plan.next_after_plan` · tests and reminder dates (block start, 7 days and 1 day before the end test, R2-PER-07).
4. Block view (`renderBlockView`) for each training block (R2-GEN-02 macro view).
5. Per week: `## Week n — {phase}` · stair level · `changesText` · per day card `### {weekday} · {day label}` + `ui.plan.est_minutes`,
   then each block `**{block}**` and numbered items `**{name}** — {sets} × {reps} · {effort} · {rest}` (+ superset marker, load,
   notes, cue `> …`, swaps `ui.plan.swaps: a / b / c`, video link: coach video url, else `ui.plan.video_search` → YouTube search
   URL `https://www.youtube.com/results?search_query=<name in the plan language>`; optional why line). Play days and aerobic days
   are one-line cards.
6. Weekly sets per muscle (first, middle and last stairway week; `ui.plan.weekly_sets_note`) and the athletic budget.
7. Validation summary (failed checks and warnings only) · footer `ui.plan.model_version` + `ui.disclaimer` + `video.note`.
`format: 'text'` = same content without markdown symbols. Renders only through `model.t`; zero hard-coded words; never renders
template `note` / `dose_text` / `condition_text` (EN-only internal hints).

### 4.12 `engine/generate.mjs` — owner B4 (orchestrator)

```js
/** @param {object} intake  @param {Model} model  @param {{checkins?:object[]}} [opts]  @returns {Plan} */
export function generate(intake, model, opts = {})
// v0.4: adapt() / adaptWith() / checkinRow() are RETIRED (R3-VOL-02 / R3-VOL-04: no check-ins, the planned stairway only)
export { ENGINE_VERSION } from './version.mjs'   // '0.4.0'
```

Pipeline (fixed order; each step's output is stored for the plan):
```
v = validateIntake(intake, model);            if !v.ok → plan{status:'invalid', errors}          (incl. release_missing, V21)
s = safetyScreen(v.intake);                   if s.refer → plan{status:'refer', refer:{reasons}}   (V1; coach bypass honoured)
seed = makeSeed(intakeForHash(v.intake), model.version)
derived = deriveValues(v.intake, model)       // D1-D14 (D9 via volume.computeTargets)
shape   = buildShape(derived, model)
layouts = shape.training_blocks.map(tb => buildWeekLayout(derived, shape, tb, model))
selections = per exercise block e: selectBlock({derived, shape, layout: layouts[tb(e)], targets: derived.D9_start_sets, exerciseBlock: e, prev: selections[e-1]||null, model, seed})
volume  = planWeeklySets({derived, shape, layouts, selections, model, estimateMinutes,              // [1.1.1] one time model
                           fillSlot: (slot, n) => fillSlot(slot, {...ctxFor(n), selection, day_used})})   // [1.1.1] no same-day repeat
athletic = athleticBudget(derived, shape, model)                                   // v0.4 B2: engine/athletic.mjs (re-exported by volume)
for week n: L = layoutForWeek(layouts[tb(n)] + volume.weeks[n].added_slots, shape.weeks[n], derived, model)   // v0.4 B2: collectWeek
            relocateStrengthTests(L, selection)                                   // [1.1.1] D-46: rep-max tests on bilateral compounds
            items = slots with an exercise and sets; athletic stations trimmed to a small / 0 target (each station's own minimum dose)
athleticPlan = planAthletic(model, derived, shape, athletic, athletic items of every week)   // v0.4 B2 (E-29): the athletic stairway
for week n: for each slot: dose = aerobic ? doseAerobic(...) : conditioning ? doseConditioning(...) : doseItem({... sets: volume.weeks[n].sets_by_slot[id], athletic: {...athletic[n], slot_plan: athleticPlan.weeks[n].slot_plan} ...})
            assemble Week (§5); omit slots with 0 sets; distinctDetails(day)             // [1.1.1] D-48: a repeat takes the next detail axis
meta.warnings += warning.long_day (est > minutes x 1.10, D-34) + warning.test_day_long (a test week's work-ups, v0.4) + athleticPlan.warnings (warning.athletic_capacity, v0.4 B2)
plan.time_check = volume.time_check (first stairway block + by_block, v0.4)
plan.summary = …; plan.validation = validatePlan(plan, model)
```
The B2 / B3 modules are imported statically (**[1.1.1]**; the build-time tolerant dynamic import is gone). `realModulesStatus()`
stays exported for the tests and always reports `ready: true`.
**adapt(plan, checkins, intake, model)** - RETIRED in engine 0.4.0 (kept below for the record): (Phase 0, mechanism APPROVED R2-GEN-01 / R2-VOL-01, rows read against the stairway,
PROPOSED R3-VOL-02 / R3-VOL-04): `checkins = []` → returns `generate(intake, model)` byte-identical (H22). For each check-in of week
k apply `rules.stairway.checkin.rows` in `order` to the step INTO week k+1: repeat (sessions done < half → the stairway waits one
week; the block becomes one week longer), ten (hold + −1 set on that day's most recently added set; that muscle's T − 1), pain
(that muscle 0 + pain protocol swap), hard (hold), easy (planned + 0.02, max 0.07), on target (planned); non-priority ≤ 0.03 while
priorities run; total < 10 %. HOW IT FELT: `couldnt` → one ladder step down or an assisted variant next week (sets unchanged);
`wrong` → one-detail change; `pain` → same-category swap one step more constrained. `block_cannot_be_finished` triggers only
produce `plan.offers = [{key:'block.cannot_finish', week}]` (never an automatic deload, H15). Deterministic; must pass every
invariant.

### 4.13 Tools

* `node tools/fixture/build-fixture.mjs` (architect): rebuilds `engine/fixtures/mini-model.json`; `node tools/fixture/check-fixture.mjs
  [model.json]`: structural checks (bands, credits, KB swing, thruster, medball, older never-list, defaults ⊆ slots, buckets have
  candidates, day labels, picker profiles, stairway tables equal the spec, no lifestyle keys, no sex keys, ES coverage).
* `node tools/compile-model.mjs [--out model]` (B1): reads sources, writes §3 files, prints counts, exits 1 on any contract error
  (calls `assertModel`). `node tools/check-model.mjs [model-dir|--fixture]` (B1): `assertModel` + band regex + i18n coverage +
  `rules` deep-equals the fixture's `rules` + the `check-fixture` checks on the assembled model.
* `node tools/generate-samples.mjs [--model model|--fixture] [--only 01]` (B4): for every `samples/intakes/*.json` →
  `samples/plans/<name>.json`, `samples/plans/<name>.<lang>.md` and `<name>.en.md` when the intake is Spanish; prints a one-line
  validation summary per sample; exits 1 if any `error` check fails.
* `node tools/sweep.mjs [N] [--render] [--model-only|--fixture-only]` (B4, v0.4): N seeded random intakes (default 1,500) + one
  competitive athlete per picker sport + one stay-active client per activity, on the fixture and on `model/`; prints plans ok, throws,
  failing error / warn checks (plans per check id + examples), non-test main days over 125 % of the minutes, plans training no group
  directly and (with `--render`) EN / ES render problems; exits 1 on a not-ok plan, a throw, a failing error check or a render problem.

---

## 5. Plan output schema (`plan/2`)

Spec `output.plan_schema`: "codes only; words resolved through EN/ES word lists; every plan stamped with model_version,
engine_version and release_stamp; shape carries the stairway labels and level_by_week 2 → 11; items carry effort {rir, rpe},
load_hint and video {kind}". Completed here and named `plan/2` (D-36). Key order in output = the order below. (Task-brief names:
`slot` = `slot_id`, `notes_key` = `notes[].key`.)

```jsonc
{
  "schema": "plan/2",
  "status": "ok",                                   // ok | refer | invalid
  "model_version": "1.1.0", "engine_version": "0.2.0", "contracts_version": "1.1.0",
  "seed": "c53:…", "intake_hash": "c53:…",
  "lang": "en", "units": "lb",
  "release_stamp": {"version": "release.minor", "lang": "en", "role": "self", "guardian": true},   // V21; null when status != ok
  "refer": null,                                    // {"reasons": ["refer.reason.heart", …]} when status == refer (no weeks)
  "errors": [],                                     // Issue[] when status == invalid (no weeks)
  "offers": [],                                     // v0.4: the time check's offers only (more_days / more_days_min / longer_sessions / keep_time*, one chosen)
  "time_check": {"training_block": 1, "fits": false, "kept_time": true, "needed_minutes": 115, "offered": {"extra_day": {"days": 4, "minutes": 85}, "session_minutes": 115},
                 "trained_groups": ["hips", "back", "shoulders"], "not_trained_directly": [{"group": "quads", "reason": "time"}, {"group": "biceps", "reason": "credit_only"}],
                 "lowered_peak": [], "trained_below_floor": [], "supersets_recommended": true, "supersets_needed": ["Mon"], "by_block": ["…"]},   // v0.4 (R3-SES-02)
  "meta": {
    "program_id": "OT11", "program_name_key": "program.OT11.name",
    "goal": "athletic", "family": "athletic", "format": "gym",
    "profile": {"id": "swimming_middle", "variant": "stroke_free", "sport_id": "swimming", "position": "middle",
                "activity_ids": [], "overlays": ["youth_athlete"], "competitive": "competitive", "season_type": "C",
                "name_key": "profile.swimming_middle.name"},
    "level": {"client": "L2", "exercise_ladder": "intermediate", "reason_keys": [{"key": "level.reason.exp_years", "args": {"years": 2}}]},
    "season": {"phase": "OFF_BUILD", "weeks_to_season": 16, "season_date": "2027-02-01", "practice_days": 6, "game_days": []},
    "plan_mode": "fixed_12", "skeleton": "ATHLETE_OFF_C12", "weeks": 12, "start_date": "2026-10-12",
    "days_per_week": 3, "session_minutes": 60, "weekdays": ["Mon", "Wed", "Fri"], "play_days": [],
    "template": {"id": "athletic.3", "variant": null, "pairing": "cross_pattern"},
    "kit": {"profile": "FULL_GYM", "tokens": ["…"], "machines": ["…"], "medball_max_lb": 10, "buy_list": []},
    "constraint_band": {"client_family": "athlete", "main": [1, 2], "iso": [2, 4]},
    "targets": {"modifier_id": "field_off", "start": {"quads": 11, "glutes": null, "…": 0}, "cap": {"quads": 16, "…": 0},
                "fill": {"quads": "target", "glutes": "credit", "rear_delts": "own_sets", "…": "…"}, "priority": [], "pain_muscles": [],
                "floored": ["chest", "lats_upper_back", "calves"], "credit_only": ["glutes", "side_delts", "biceps", "triceps"],
                "calves_per_leg_day": 3, "core_block": {"exercises": 2, "sets": 2}},
    "stairway": [{"training_block": 1, "N": 12, "lambda": {"quads": 0.8478, "chest": 0.7599, "…": 1}}],
    "share_targets": {"profile_id": "sport", "lower": {"by_exercise_block": [0.5, 0.5, 0.55], "PRE": 0.5, "IN": 0.45}, "upper": {"by_exercise_block": [0.5]}, "pain_shift": 0},
    "athletic": {"enabled": true, "older_mode": null, "plyo_share": {"start": 0.1, "end": 0.25}, "ground_contact_class": 5,
                 "contacts_session_max": 100, "olympic_exposures_wk": 3, "game_heavy": false, "heavy_play_week": false},
    "aerobic": {"per_week": 0, "base": 0, "adjust": 0, "replaced_by_activity": 0, "walks": false, "sport_is_aerobic": true},
    "tests": {"items": ["strength", "jumps"], "baseline_week": 1, "end_weeks": [12], "from_zero": true,
              "reminders": ["2026-10-12", "2026-12-21", "2026-12-27"]},   // block start, 7 days and 1 day before the end-test week
    "health": {"role": "self", "health_route": null, "refer": false, "reasons": [], "bypass": false},
    "older_opt_in": false,
    "after_plan": {"next": "pre_season", "weeks": 4, "date": "2027-02-01"},
    "instruction_keys": ["instruction.title", "instruction.1", "instruction.2", "instruction.3", "instruction.4", "instruction.5"],
    "locked_rule_keys": ["locked.no_failure_heavy_compounds", "…"],
    "input_audit": {"keys": ["age", "body_weight", "…"], "forbidden_found": []},                     // V26 / H16 (dotted key paths of the intake)
    "warnings": [],                                 // Issue[] (V2, V3, V6, V7, V8, floor_schedule, long_day, older_athletic, play_48h …)
    "r3_pending": ["R3-ATH-01", "R3-SES-01", "R3-VOL-01", "R3-VOL-03", "R3-VOL-04"],
    "derived": {"…": "full Derived object (D1-D14) for audit"},
    "why": [{"key": "why.profile", "ref": "COACH-CHAT 2026-10-08", "args": {"profile": "swimming_middle"}}, {"key": "why.template", "ref": "VOL-08", "args": {"template": "athletic.3"}}]
  },
  "shape": {"mode": "fixed_12", "skeleton": "ATHLETE_OFF_C12", "weeks_total": 12, "open_ended": false,
            "training_blocks": [{"n": 1, "type": "stairway", "weeks": [1, 12], "stair_N": 12, "first_exercise_block": 1, "label_key": "plan.block_type.stairway", "factor": null}],
            "exercise_blocks": [{"n": 1, "training_block": 1, "weeks": [1, 4]}, {"n": 2, "training_block": 1, "weeks": [5, 8]}, {"n": 3, "training_block": 1, "weeks": [9, 12]}],
            "level_by_week": [2, 2.6, 3.2, 3.8, 4.4, 5, 6, 7, 8, 9, 10, 11]},
  "weeks": [{
    "n": 1, "training_block": 1, "block_type": "stairway", "exercise_block": 1,
    "stair_week": 1, "stair_level": 2, "phase": "ACCLIMATION", "phase_key": "plan.phase.ACCLIMATION",
    "planned_rir": {"min": 3, "max": 3, "intensifiers": false},
    "season_phase": "OFF_BUILD", "rep_phase": "VOL1", "plyo_stage": "RC1",
    "test": {"type": "baseline", "items": ["strength", "jumps"], "from_zero": true},
    "circuit": null,
    "step_by_muscle": {"quads": 0, "…": 0},                       // planned step INTO this week (stairwayPlan; 0 in week 1 and flat blocks)
    "target_by_muscle": {"quads": 11, "chest": 10, "glutes": null, "…": 0},
    "weekly_sets_by_muscle": {"quads": 11.25, "hamstrings": 11.0, "glutes": 5.5, "chest": 10.0, "…": 0},
    "direct_sets_by_muscle": {"quads": 11, "…": 0},
    "group_counts_by_day": {"Mon": {"quads": 2, "back": 2, "hips": 2, "shoulders": 2, "calves": 2}},
    "total_resistance_sets": 58, "rise_vs_prev": null,
    "athletic_budget": {"plyo_share": 0.1, "stage": "RC1", "factor": 1,
                        "targets": {"plyo_contacts": 6, "jump_contacts": 37, "low_contacts": 51, "throws": 35, "cod_cuts": 0, "sprint_m": 0, "olympic_sets": 5},
                        "planned": {"plyo_contacts": 6, "jump_contacts": 36, "low_contacts": 0, "throws": 40, "cod_cuts": 0, "sprint_m": 0, "olympic_sets": 6, "upper_contacts": 0},
                        "planned_share": 0.0732, "goals": {"jump_contacts": 37, "throws": 35}, "scale": {"jump_contacts": 1, "throws": 1}, "hold": false,
                        "contacts_session_max": 100},   // v0.4 B2: planned.upper_contacts, planned_share, goals, scale, hold (E-28, E-29)
    "aerobic_sessions": 0,
    "changes": [],
    "why": [{"key": "why.no_checkin_planned", "ref": "R2-VOL-03"}, {"key": "why.test_timing", "ref": "R2-PER-07"}],
    "days": [{
      "weekday": "Mon", "day_type": "S1", "kind": "main", "optional": false, "label_key": "day.athletic.3.S1",
      "full_body": true, "format": "straight", "est_minutes": 63, "minutes_limit": 60, "supersets_on": true,
      "groups": {"quads": 2, "back": 2, "hips": 2, "shoulders": 2, "calves": 2},
      "why": [{"key": "why.template", "ref": "VOL-08", "args": {"template": "athletic.3"}}, {"key": "why.clean_day", "ref": "R2-ATH-04"}],
      "blocks": [
        {"kind": "warmup", "position": 0, "movable": false, "circuit": null, "items": [
          {"slot_id": "Mon.S1.s01", "station_id": "S1.s01", "bucket": "WARMUP_GENERAL", "role": "warmup", "origin": "template", "group": null,
           "exercise_id": null, "name_key": null, "detail": null, "text_key": "warmup.any_cardio_5min", "cue_key": null, "video": null,
           "sets": null, "reps": null, "set_reps": null, "effort": null, "rest": null, "load": null, "tempo_key": null,
           "superset": null, "laterality": null, "loading": null, "credits": {}, "athletic": null, "aerobic": null, "circuit": null, "wod": null,
           "test": null, "notes": [], "swaps": [], "flags": [], "why": [{"key": "why.warmup", "ref": "ORD-08"}]}]},
        {"kind": "core", "position": 1, "movable": true, "circuit": null, "items": ["…"]},
        {"kind": "strength", "position": 4, "movable": false, "circuit": null, "items": [
          {"slot_id": "Mon.S1.s09", "station_id": "S1.s09", "bucket": "RP_BKD", "role": "work", "origin": "template", "group": "quads",
           "exercise_id": "front-squat-barbell", "name_key": "exercise.front-squat-barbell.name", "detail": null, "text_key": null,
           "cue_key": null, "video": {"kind": "search", "url": null},
           "sets": 3, "reps": {"type": "range", "min": 12, "max": 15, "bracket": "b12_15"}, "set_reps": null,
           "effort": {"type": "rir", "min": 3, "max": 3, "rpe_min": 7, "rpe_max": 7, "last_set": null, "intensifier": false},
           "rest": {"type": "after_pair"}, "load": {"type": "week1_tip"}, "tempo_key": null,
           "superset": "P1", "laterality": "bilateral", "loading": null,
           "credits": {"quads": 1, "glutes": 0.25, "adductors": 0.25}, "athletic": null, "aerobic": null, "circuit": null, "wod": null,
           "test": {"type": "test", "test": "rm_3_or_5"},
           "notes": [{"key": "load.week1_tip"}, {"key": "note.test_from_zero", "args": {"test": "tests.rm_3_or_5"}}],
           "swaps": ["high-bar-back-squat", "hex-trap-bar-squat", "box-squat-any-loading-touch-and-go-fast"],
           "flags": ["axial_counted"],
           "why": [{"key": "why.two_spine_days", "ref": "R2-SES-01", "args": {"pattern": "squat"}}, {"key": "why.reps_vol_phase", "ref": "PER-11", "args": {"phase": "VOL1"}},
                   {"key": "why.planned_rir", "ref": "R2-PER-05", "args": {"rir": "3"}}]}]}
      ]}]
  }],
  "summary": {"total_resistance_sets_by_week": [58, 58, 58, 59, 60, 61, 63, 64, 66, 67, 69, 71], "max_weekly_rise": 0.032,
              "planned_steps_max": 0.05, "stair_levels": [2, 2.6, 3.2, 3.8, 4.4, 5, 6, 7, 8, 9, 10, 11],
              "sets_by_muscle_by_week": {"quads": [11.25, "…"]}, "target_by_muscle_by_week": {"quads": [11, "…"]},
              "myo_equivalent_sets_by_week": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], "shortfalls": []},
  "validation": {"ok": true, "checks": [{"id": "V10", "key": "check.v10_spine", "severity": "error", "pass": true, "violations": []}]}
}
```
(The numbers in the example are illustrative shapes; §9 holds the binding acceptance numbers.)

Rules for the plan object:
* Days included: every non-OFF weekday (main, optional, aerobic, play). Items with 0 sets that week are omitted; blocks with no items
  are omitted. `block.position` = index of the block in the day after ordering (0-based).
* `item.credits` = per-set credits as counted (slot-aware). `weekly_sets_by_muscle[m] = Σ sets × credits[m]` over the week (round2);
  validate recomputes it (H09).
* `item.video` = `{kind: coach|observed, url}` from the catalog, else `{kind: "search", url: null}` (the renderer builds the YouTube
  search link in the plan language; R2-GEN-02). `item.detail` = one-detail variation `{axis, key}` or null.
* Refer plan: `status: 'refer'`, `refer.reasons`, `meta` with only `health`, `instruction_keys`; `weeks: []`; `validation` with V1.
  Invalid plan: `status: 'invalid'`, `errors`, `weeks: []`.
* The plan never contains free text, dates other than ISO strings, health answers, personal data beyond the intake-derived values
  in `meta`, or any `sex` / `gender` / lifestyle key. Share links and images (Phase 1) strip `meta.derived`, `meta.kit`, age, weight,
  pain and health (R2-GEN-02, 13 §14.1).

---

## 6. Validation checks

`validatePlan(plan, model)` runs every id of `CHECK_IDS` in order. Each check: `{id, key, severity, pass, violations[]}`; a
violation: `{where: {week, weekday, slot_id}, key, args}`. **Stairway weeks** = `block_type == 'stairway'`. "Resistance item" =
bucket kind resistance | isolation | focus or origin bonus.

| Id | Severity | Exact check |
|---|---|---|
| V1 safety | error | `status == 'refer'` iff (`meta.health.refer`); an `ok` plan has `meta.health.reasons == []`; with `health_route == coach_own_sop` the safety items were not read and `warning.coach_bypass` is in `meta.warnings`; severe pain always refers |
| V2 days | warn | `meta.weekdays.length ≥ meta.days_per_week` |
| V3 short athletes | warn | family athletic and `session_minutes ≤ 30` → warning present |
| V4 youth | error | age < 18: no item `level` above `levels.youth_max_ladder`; `olympic_from_floor` only age ≥ 14 with `youth_floor_ok` and `previous_cycles.count ≥ 1`; medball loads ≤ youth loads |
| V5 older | error | age ≥ 60: never `overhead_squat`, `low_bar`; Phase 0 never `depth_jump`, `high_depth_drop`, `snatch` (D-05); without opt-in: no item with athletic quality `plyometric` / `olympic`, no `loaded_jump`, AP_PLYO items only quality `landing`; `warning.older_athletic` present; every planned step ≤ 0.03; maintenance factor ≥ 0.7; (warn) ≥ 70 % of resistance items constraint ≥ 4. Client family `older_or_pain` (injured / high-volume): never `snatch`, `depth_jump`, `overhead_squat`, `low_bar` |
| V6 season | warn | season overlay with pre-season or in-season weeks inside the plan → `warning.v6_season` / `warning.v6_in_season` present |
| V7 no equipment | warn | `kit.buy_list` non-empty → `warning.v7_no_equipment` present |
| V8 priorities | error | ≤ `volume.priority.max_muscles` intake priorities in `meta.targets.priority` (v_taper counts as 1 choice) |
| V9 bands (H01) | error | no item exercise id, swap id, `name_key` EN text, kit token or `id_aliases` target matches the band regex; kit ∩ `banned_tokens` = ∅ |
| V10 spine (H07) | error | per week: items with `exercise.axial && axial_pattern == 'squat'` ≤ 1, hinge ≤ 1, and the counted squat and the counted hinge are on different weekdays; items tagged `olympic` / `loaded_jump` / `kb_swing` / `thruster` never counted |
| V11 pairing (H06) | error | every main day of a template not in `pairing.not_for_variants` with lower and upper resistance items: per `pair` group, effective bucket in `hip_buckets` ⇒ partner in `hip_with`; `knee_buckets` ⇒ `knee_with` (circuit days included) |
| V12 order (H03, H04, H05) | error | per day, block order follows `ordering.block_order` except allowed overrides (core moved by `prefs.core_position`; fighter opening aerobic; priority small muscle first); every `athletic` / `power` block precedes `strength`; athletic precedes Olympic; first `RP_HPULL` < first `RP_VPULL` and first `RP_HPUSH` < first `RP_VPUSH` (effective buckets) **unless the vertical item is role `work`** (D-30); the first strength item is role `work` (or the moved priority isolation); bilateral before unilateral of the same region unless the unilateral is the `work`; `last_set: 'myo'` only on the day's last resistance item; core block first after the warm-up when `core_position == 'start'` |
| V13 caps | error | split days (`full_body: false`): `counts_in_cap` items ≤ `session.exercise_cap_by_minutes[minutes]`; athletic family: counted items ≤ `athlete_cap` 12 (core, warm-up, skill, prehab, conditioning, aerobic, cooldown excluded; a small-isolation superset = 1); any day with `est_minutes > minutes × long_day.warn_above_factor` has `warning.long_day` for that weekday (else error) |
| V14 counting (H08, H09) | error | every item: `credits` == `credit.classes[exercise.credit_class]` or `{}` in an athletic-slot bucket / athletic exercise; KB swings and wall balls `{}`; helper values ∈ {0.25} except DIPS 0.5 / 0.5, THRUSTER front_delts 0.5 + glutes 0.25; per-side items 1 per set; recomputed weekly sets == `weekly_sets_by_muscle` (± 0.001) |
| V15 step (H10) | error | every `step_by_muscle` ≤ `stairway.limits.planned_step_max` (0.07); for consecutive stairway weeks of one block `total(n) < 1.10 × total(n−1)` (strict; exempt: first week after recovery / maintenance, laterality-only swaps) |
| V16 aesthetics medball (H11) | error | goal `muscle`: no item tagged `medball` outside the `warmup` block; any goal: no `load.medball_lb.max > 20`, no catalog medball `max_lb > 20` |
| V17 effort (H02) | error | items with rep class in `effort.never_failure_rep_classes` have `effort.type` rir / intent / role / power and, when rir, `min ≥ 1` and `last_set` not `max` / `myo`; `last_set: 'max'` only for `effort.max.allowed_rep_classes` or bodyweight; `last_set: 'myo'` only on the last resistance item, isolation or constraint ≥ 4, in the last stairway week or at cap in HARDEST; recovery items `min ≥ 3`; no RIR outside `rir_band` except recovery; planned RIR follows `week.planned_rir` |
| V18 minimums | error | stairway weeks: every main day with a lower resistance item has `ISO_CALF` sets ≥ `calves_per_leg_day` (circuit days: 2 calf stations); ≥ 1 rear-delt item (`ISO_REAR` or `FACEPULL`) per week; core block ≥ 2 items on main days ≥ 45 min (≥ 1 at 30) |
| V19 Olympic | error | family athletic (and hybrid class model) training weeks, unless age ≥ 60 without opt-in: ≥ 1 `AP_TRIPLE_EXT` item; ≤ `olympic.per_week_max` (4) exposures; tier `L1` for L1 and L2 in exercise block 1, `L2_plus` allowed for L2 block ≥ 2 and L3; the item's olympic family matches its station `variant` (clean station → clean / loaded_jump; snatch station → snatch / swing; jerk → any) — the templates encode the clean-day / snatch-day pattern (R2-ATH-04, a default per the master §7.7, so no check against `lower_focus`); no `pct_hint` load |
| V20 V-squat | error | no item or swap tagged `v_squat` or matching `/\bv[- ]?squat\b/i` |
| V21 release (H20) | error | `status == 'ok'` ⇒ `release_stamp` present with the version required by role / age (§4.3 checkRelease) |
| V22 floor (H17) | error | v0.4: every stairway week: each group in `targets.floor_groups` (not pain-reduced, not all credit-only) holds ≥ 10 sets on the main days counted from the items with group credit (calves: max(3 × leg days, min(10, 4 × leg days − 1)); circuits 3 × leg days), unless the time check of its block lists it as not trained directly or as trained below the floor (`work_lift_time`); a listed group with an exercise that trains it as main mover is a violation (`listed_but_trained`); no warning exempts |
| V23 exercises per group (H18) | error | every main day, every group in `rules.muscles.groups.order` except `exempt_groups` that has ≥ 1 resistance item: item count in that group ∈ [2, 4] on full-body days, ≥ 2 on split days (3-4 is a warn); strength family exempt (flagged) |
| V24 block structure (H15) | error | no week of type `recovery` or `maintenance` lies inside the span of a `stairway` block; a `recovery` week is always preceded and followed by a stairway block; stairway `stair_week` runs 1..N without gaps |
| V25 tests (H19) | error | `week.test` only on `stair_week == 1` (baseline) or `stair_week == N` (end) of a stairway; never in other block types; when `test.from_zero`, no test item is a 1RM (`rm_3_or_work_up_to_1`) or a max-effort mile / time trial |
| V26 inputs (H16) | error | `meta.input_audit.forbidden_found == []` and the plan has no key matching the forbidden lifestyle / sex list at any depth |
| V27 athletic budget | error | v1.2: planned <= target x (1 + tolerance) + one set (reactive + ballistic jumps as one budget, v0.4 B2); Olympic <= 1.5 x target or the exposures' minimum. **v0.4 stage B2** (E-44): per family (contacts, throws, cuts, sprint metres) planned >= (1 - tolerance) x `athletic_budget.goals` - one set (`under`); a goal never above the target; inside a stairway block no family and no Olympic total drops week over week (`athletic_drop`); a stairway peak under `reconcile.warn_below_share` (0.6) of the target carries `warning.athletic_capacity` for that family and block (`capacity_not_told`); `plyo_stage` and every AP_PLYO / AP_JUMP_LIMITED_KNEE pick hold for the exercise block (`stage_mid_block`, `jump_exercise_mid_block`); no stage-3 plyometric item with `response != repeat` (`rc3_single_response`); no AP_COD item whose `sport_only` excludes the profile's sport (`sport_only_drill`) |
| H01-H12 | error | the §1.7 rules implemented by V-checks (H01 = V9, H02 = V17, H03/H04/H05 = V12 + V18, H06 = V11, H07 = V10, H08/H09 = V14, H10 = V15, H11 = V16, H12 = V5) |
| H13 no sex | error | no key named `sex` or `gender` (case-insensitive) at any depth of the plan |
| H14 i18n | error | every key referenced in the plan (`name_key`, `cue_key`, `text_key`, `label_key`, `phase_key`, notes, why, changes, warnings, program / profile / sport / activity keys, instruction / locked / check keys) exists in `i18n.en` and in `i18n.es` or `es_review.missing_keys` |
| H15-H20 | error | = V24, V26, V22, V23, V25, V21 |
| H21 stairway | error | v0.4: per stairway block, per line with `fill: target`: `target_by_muscle` never decreases; every step into week w ≤ h (`halfway`) is ≤ every step into weeks > h; per trained floored group (not listed by the time check, not pain): `weekly_sets_by_group` of the last week ≥ week 1 + the minimum climb − 0.5 (`stairway.min_climb`: 2, 1 in blocks ≤ 7 weeks, calves 1) and never drops by more than 0.5 week over week; the main-day total rises (unless the block trains no group directly; not for the year plan's flat Q1); circuits: work seconds x sets rise within 10 %; the block's last week has the highest `total_resistance_sets` (ties allowed); when N = 12 the last 4 weeks hold the 4 highest totals; `stair_level` strictly rises 2 → 11; planned RIR never rises; no warning exempts |
| H22 no check-in | error | v0.4: every week's `step_by_muscle` equals the planned step recomputed from its block's start / ceiling (`meta.stairway[].start / cap`; groups the time check dropped are skipped); no step in week 1 or a flat block; no `block.cannot_finish` offer |

**[1.1.1] Readings adopted in the integration step** (validate.mjs implements exactly these; DECISIONS D-52 … D-56):
* **V5 / H12** — the "AP_PLYO items only quality `landing`" default for 60+ is checked by quality; landing-quality drills are exempt from
  the `older_ok` clause (every landing record is `older_ok: false` in 02; select uses landing records that are `older_opt_in_ok` and not
  `high_impact`, the C-11 reading). The never-tags and the plyometric / olympic / loaded-jump clauses are unchanged.
* **V8** — counts `meta.derived.priority_choices` when present (v_taper = 1 choice), else infers from `targets.priority`.
* **V12** — "bilateral before unilateral" and "the work first" apply on days that hold a `work` lift; the strength family's conjugate
  days (`session.exercises_per_group.exempt_families`) are exempt from work-first.
* **V13** — an over-cap or over-time day is legal when `meta.warnings` holds `warning.long_day` for that weekday (D-34: a cap that
  cannot be met without a group of 1 keeps the day and warns; H18 wins over the count cap).
* **V17 / H02** — MYO is allowed on a `machine_stable_compound` that is the day's last resistance item (VOL-15 "last machine or
  isolation exercise", `reps.matrix.machine_stable_compound.hypertrophy.myo_if_last`); MAX / MYO on free-weight compounds stays an error.
* **V19** — an athletic week needs Olympic work only where the template keeps an `AP_TRIPLE_EXT` station at the session length and
  some record passes kit / youth ladder / floor-lift / tier / pain / exclusions / day pattern; a `jerk`-family lift fits any station.
* **V23 / H18** — strict: a rear-delt own-sets station never stands alone in the shoulders group (week.mjs adds a second shoulders
  station when it re-adds the weekly rear-delt minimum).

**[0.4.0 B4] Readings adopted in the integration stage** (validate.mjs and the invariants implement exactly these; DECISIONS E-64 ...):
* **V18** — a lower-body class lift kept for a group listed `class_lift` does not make that day a leg day (calves per leg day).
* **V19** — a `jerk` or unnamed Olympic station needs a record with an Olympic family (select's pool); a triple-extension record
  without a family never makes Olympic work 'possible'.
* **V22 / H17** — a class-model work lift of a group listed `class_lift` is not 'listed but trained'.
* **V23 / H18** — in the class model (`session.time_fit.keep_work_lift.families`) a group whose only exercise on a day is the day's
  work lift passes (the class lift); every other lone exercise still fails.
* **H21** — a circuit block with no resistance work (every group listed by the time check) has no work-seconds stairway to check; a
  block that trains no group directly (`time_check.trained_groups` empty, e.g. all class lifts) has no main-day-total rule.

---

## 7. Why-code registry (keys exist in the fixture's `i18n.en` / `es`)

| Key | Typical ref | Emitted by |
|---|---|---|
| `why.profile` / `why.level` / `why.level_reason_l3` | COACH-CHAT 2026-10-08, GEN-02 / PRG-05 / D-01 | intake |
| `why.template` / `why.template_variant` | VOL-08, ORD-06 / R2-GEN-07, D-15 | intake, week |
| `why.season_plan` / `why.pre_season` / `why.taper` / `why.in_season` / `why.game_heavy` | R2-GEN-05, R2-PER-06, R2-ATH-07, D-10 | shape, volume |
| `why.core_first` / `why.core_moved` | ATH-11, R2-SES-03 | week |
| `why.pair_hip_push` / `why.pair_knee_pull` | UNI-11 | week |
| `why.h_before_v` / `why.work_first_vertical` | ORD-01 / ORD-02, D-30 | week |
| `why.power_before_strength` / `why.work_first` / `why.priority_first` | ORD-03 / ORD-02 / ORD-04 | week |
| `why.two_spine_days` / `why.axial_first` / `why.axial_second` | R2-SES-01, R2-SES-02, PER-04 | select |
| `why.second_exposure` | PER-04 | select |
| `why.default_pick` / `why.preference` / `why.constraint_band` / `why.kit` / `why.level_soft` | CAT-07 / EQ-10 / EQ-13 / EQ-09 / CAT-05 | select |
| `why.pain_swap` / `why.pain_cut` | VOL-03, UNI-08, R2-LIB-03 | select / volume |
| `why.older_never` / `why.older_default` / `why.older_opt_in` | EQ-03 / R2-ATH-08 | select, week |
| `why.age_50_racket` / `why.prehab` | R3-ATH-02 / 04 injury_prehab | select, week |
| `why.machine_iso_swap` / `why.no_medball_sub` | EQ-08 / EQ-07 | select |
| `why.laterality_share` / `why.contralateral` / `why.ipsilateral` / `why.frontal_plane` | UNI-02 / CAT-13 / UNI-12 | select |
| `why.block_change` / `why.detail_variation` / `why.continuity` / `why.variety_ab` | PER-02 / R2-LIB-01 / PER-02 / PER-03 | select |
| `why.kb_swing_power` / `why.clean_day` / `why.snatch_day` / `why.olympic_level` | R2-VOL-05 / R2-ATH-04 / ATH-10 | select |
| `why.sets_default` / `why.set_added` / `why.bonus` / `why.focus` | VOL-16 / VOL-07 / VOL-07, R3-VOL-03 / ORD-11 | volume |
| `why.stairway_step` / `why.stairway_lambda` / `why.no_checkin_planned` | R2-PER-03, R2-PER-04, R3-VOL-04 / R2-VOL-03 | volume, shape |
| `why.total_ceiling` / `why.nonpriority_cap` / `why.older_step` | UNI-05 / R2-VOL-06 / D-05 | volume |
| `why.at_cap` / `why.priority_add` / `why.floor_10` / `why.volume_ratio` | VOL-02, R2-VOL-06 / VOL-02 / R2-VOL-06 / D-09 | volume |
| `why.group_two_to_four` / `why.superset_short` / `why.cut_time` | R2-SES-05 / ORD-05 / UNI-09 | week |
| `why.calves_leg_day` / `why.rear_delt_own` | VOL-17 / R2-VOL-04 | volume |
| `why.maintenance` / `why.striker` | PER-01, R2-PER-06 / ATH-04 | volume |
| `why.reps_matrix` / `why.reps_preference` / `why.reps_vol_phase` / `why.pyramid` / `why.unilateral_reps` | VOL-11 / VOL-12 / PER-11 / PRG-07 / UNI-04 | dose |
| `why.rir` / `why.planned_rir` / `why.intensifier_last_week` / `why.max_last` / `why.myo_last` / `why.rest` | VOL-13 / R2-PER-05, R3-VOL-04 / R2-PER-05 / VOL-13 / VOL-15 / VOL-14 | dose |
| `why.olympic_ramp` / `why.plyo_stage` / `why.plyo_share` / `why.medball_load` / `why.loaded_jump` | PER-09, R2-ATH-05 / R2-ATH-03 / R2-ATH-01 / EQ-06 / EQ-15 | dose, select |
| `why.test_timing` / `why.test_from_zero` | R2-PER-07 | shape, dose |
| `why.circuit_stairway` / `why.wod` | PRG-03, D-19 / OBSERVED OT18, D-20 | volume, week |
| `why.aerobic_count` / `why.aerobic_colour` / `why.cardio_adjust` / `why.sport_is_aerobic` / `why.activity_counts` / `why.aerobic_fighter_open` / `why.walks` | ATH-07, R2-ATH-06 / R2-SES-06 / R2-SES-06 / R3-ATH-01 / R3-ATH-05 / ORD-09 / ATH-07 | week |
| `why.heavy_play` | R2-ATH-07, R3-ATH-05 | week, volume |
| `why.warmup` | ORD-08 | week |
| `why.pro_setting` | R2-VOL-06 (Phase 1) | volume |
| `why.r3_pending` | R3-… (args `{id}`) | any |

Retired keys (v1.0): `why.deload`, `why.c8_start_hard`, `why.rate`, `why.rate_phase_cap`, `why.rate_ceiling`, `why.r2_pending`.

**[1.1.1] keys added** (EN + ES in `tools/fixture/i18n-v11.mjs`, compiled into `model/i18n`): `prehab.code.<CODE>` (resolved for the
`{code}` arg of `note.prehab` / `why.prehab`), `note.focus_added` (engine-placed Focus slot of a non-priority muscle; `note.focus` only
for a priority), `note.test_day_session` (aerobic test), `warning.stairway_time {week, muscles, advice, min}`,
`warning.older_opt_in_ignored {age}`, `ui.plan.exercise`, `ui.plan.total`, `ui.plan.wod_dose_fixed`, `release.short.client|coach|minor`,
`intake.error.<code>` (rendered `{field}: …` for invalid intakes).
New why keys: add EN + ES to `tools/fixture/i18n-v11.mjs`, rebuild the fixture, and tell B1 (the compiler copies the fixture's
UI / why strings into `model/i18n/*.json`).

---

## 8. Tests contract (`node --test tests/`)

* Runner: `node --test tests/` **or** `node --test` (Node 22). [1.1.1] Node 22 loads a directory argument as a module, so
  `tests/package.json` (`main: run-all.mjs`) imports every `tests/**/*.test.mjs` in one test process; with no argument Node's default
  discovery finds the same files (run-all.mjs does not match the default patterns, so nothing runs twice). Only `node:test`,
  `node:assert/strict`, `node:fs`, `node:path`, `node:url`, `node:crypto`. No snapshot libraries.
* `tests/helpers/models.mjs` (B4): `loadFixtureModel()` (reads `engine/fixtures/mini-model.json`, drops `_fixture`, `loadModel`),
  `loadCompiledModel()` (reads `model/*.json`; returns null when absent so tests can `skip`), `loadSample(name)`, `allSamples()`.
  `tests/helpers/random-intake.mjs` (B4): deterministic generator of valid `intake/2` objects from a seed.
* Module tests (owner writes them with the module): `intake.test.mjs`, `shape.test.mjs`, `volume.test.mjs` (B2); `week.test.mjs`,
  `select.test.mjs`, `dose.test.mjs` (B3); `model.test.mjs`, `validate.test.mjs`, `explain.test.mjs`, `render.test.mjs`,
  `generate.test.mjs` (B4); `compile.test.mjs` (B1: `assertModel(model) == []`, band regex, `rules` deep-equals fixture rules, every
  catalog `credits` == class map, KB swings never in RP slots, every i18n key used has EN + ES-or-review, `check-fixture` passes on
  the compiled model).
* **Worked numbers B2 must reproduce** (fixture rules): the 12-week and 8-week single-muscle stairways of §4.5 (L1 / L2 / L3,
  λ 0.76 / 0.867 / 0.501); the §9 targets (starts, caps, λ, whole-set curves) for all 8 samples; floor 10 lifts field-athlete chest
  and back from 7.5 to 10; L3 priority 26 → 30 lands exactly on 30 in week 12; non-priority steps ≤ 0.03 while a priority runs;
  pain freeze 2 weeks; VOL-07 placement on one day `2/2/2 → 3/2/2 → 3/3/2 → 3/3/3 → 4/3/3`; total-rise guard strictly < 10 %
  with staggering (an L1 plan whose 9 target muscles all release in the same week must spread them); KB swing credits 0;
  thruster 1 / 0.5 / 0.25; maintenance factors 0.5 / 0.6 / 0.7 (older floor 0.7); soccer shape = stairway 1-6 + pre-season 7-8;
  bootcamp circuit work seconds 35 35 40 40 40 45 45 50.
* **Invariants** (B4, `tests/invariants/invariants.test.mjs`): for the 8 sample intakes **and** 300 seeded random valid intakes
  (every goal incl. `active` × days 2-6 × minutes 30-90 × all 8 equipment profiles × ages incl. 15, 16, 52, 61, 70 × pain areas ×
  competitive sports drawn from the picker incl. swimming × activities incl. pickleball and HYROX × plan modes fixed_12 / fixed_8 /
  maintenance / week_by_week(with checkin) / year (non-competitive) × older opt-in on / off), `generate()` returns `status ok` and
  `validatePlan` has **no failing error check**. Plus explicit property tests of every hard rule H01-H22 (the brief's list): no bands;
  never to failure on heavy compounds (RIR ≥ 1, MAX / MYO only where allowed); power before strength; H before V (work exemption);
  core first by default; hip + push / knee + pull; two spine days never the same day; helpers 0.25 (dips 0.5 / 0.5, thruster
  1 / 0.5 / 0.25); KB swings never glute volume; athletic patterns never count; planned step ≤ 7 %, total < 10 %; no medball in
  aesthetics main work, ≤ 20 lb; 60+ never depth jumps / overhead squat / snatch / low-bar, no Olympic / plyo without opt-in; no
  sex field; EN + ES; stairway shape (small early, bigger late, last weeks hardest, 12-week last 4 the hardest); no deload or
  maintenance week inside a block; no check-in = no change (`adapt(plan, [])` byte-identical); no sleep / stress / lifestyle input
  accepted (intake with `sleep` is invalid); effort 10 meaning in the check-in copy; floor 10; 2-4 exercises per group on full-body
  days; tests only week 1 / last week, never a 1RM or max mile from zero.
* **Review regression suites** (v0.4): `review-v12.test.mjs` (v1.2 review), `review-r3.test.mjs` (B1), `review-b2.test.mjs` (B2),
  `review-b3.test.mjs` (B3), `review-b4.test.mjs` (B4 integration: `R<sample>-<slug>` and `B4-sweep-random-<n>-<slug>`). The full
  random sweep (`node tools/sweep.mjs [N] [--render]`: N random + every sport + every activity, fixture and `model/`) is a tool, not a
  test (about 4 min for N = 1,500); the invariants suite keeps its 300 random intakes.
* **Determinism** (B4): generate each sample twice → identical `JSON.stringify`; intake with shuffled key order → identical plan;
  no `Date` without argument / `Math.random` / `Intl` / `localeCompare` in `engine/*.mjs` (a test greps the sources).
* **i18n** (B4): `renderPlan` in EN and ES (all views) for every sample contains no `undefined`, no `{placeholder}` left, no raw
  `why.` / `note.` / `exercise.` keys, and every key used exists in both languages (or is listed in `es_review`).
* **Golden** (after the coach grades): `tests/golden/<sample>.json` snapshots; any diff needs review; his grades become tests (R2-GEN-07).

---

## 9. Acceptance targets for the 8 sample clients (computed from the fixture rules; B2 / B3 must reproduce)

> **v0.4 (engine 0.4.0):** starts / caps are now per line (side + rear delts = the shoulders line; Focus +2) and the time check
> decides which groups each sample trains directly; the binding per-line numbers are pinned in `tests/volume.test.mjs`
> ('start -> cap per line', 'lambda and whole-set curves') and the time-check outcomes in `samples/REVIEW_LOG.md` v0.4 and
> `tests/review-r3.test.mjs`. The per-muscle tables below are the v1.1 record.

Intakes: `samples/intakes/01-swimming.json` … `08-pickleball-genpop.json` (intake/2; no sex, no lifestyle fields; release
accepted). Start 2026-10-12 (football 2027-01-11). "T" = planned whole weekly sets per stairway week (no check-in), before the
10 % staggering, which may delay a release by one week.

| | 01 swimming | 02 football | 03 soccer (ES) | 04 CrossFit-style bootcamp |
|---|---|---|---|---|
| D2 profile | `swimming_middle` + variant `stroke_free`; overlay `youth_athlete`; competitive; season type C | `football_big_skill` (LB); competitive; A | `soccer` (midfielder); competitive; A | `crossfit_class` (activity, leads for goal active); recreational; I |
| D1 / format | athletic / gym | athletic | athletic | **hybrid_crossfit** (template hint) |
| D3 level / ladder | L2 / intermediate (youth cap intermediate) | **L3** / advanced (3 y + 4 days, D-01) | L2 / intermediate | L2 / intermediate |
| D4 season | OFF_BUILD, 16 weeks to 2027-02-01 | OFF_EARLY, 32 weeks to 2027-08-28 | OFF_LATE, 10 weeks to 2026-12-21 | — |
| D5 / training blocks | fixed_12, ATHLETE_OFF_C12; stairway 1-12; after plan: pre-season 4 weeks (13-16) | fixed_12; stairway 1-12 | fixed_8, ATHLETE_OFF_C8; **stairway 1-6 + pre_season 7-8** (pre-season 7-10, taper week 10 after the plan); `warning.v6_season` | fixed_8, C8_GENERAL; stairway 1-8 |
| Exercise blocks | 1-4, 5-8, 9-12 | 1-4, 5-8, 9-12 | 1-6, 7-8 | 1-4, 5-8 |
| D6 template | `athletic.3` S1 Mon / S2 Wed / S3 Fri + OPT Sat (optional); cross pattern | `athletic.4` A1 Mon / B1 Tue / A2 Thu / B2 Fri + OPT Wed, Sat (optional) | `athletic.3` | `hybrid_crossfit.4` variant `crossfit_style_bootcamp`: SQUAT Mon / PRESS Tue / DEADLIFT Thu / CLEAN-PUSH Fri + WOD Sat (optional) |
| Program | OT11 | OT11 | OT11 | OTCFB |
| D7 band | athlete [1,2] / [2,4] | athlete | athlete | general [2,3] / [2,4] |
| D8 kit | FULL_GYM (no `open_space_long`: 10-20 m), medball ≤ 10 lb, no bumpers → hang Olympic variants | FULL_GYM + hurdles, bumpers, long space; medball ≤ 20 | FULL_GYM + hurdles, long space; medball ≤ 10 | HOME_BARBELL + bumpers, KB, medball / slam ball ≤ 20, high box, rings, rope, ergs; no machines, no cable |
| Modifier | field_off (0.7 / 0.5 / credit) | field_off | field_off | stay_active (0.8 / 0.8 / credit) |
| D9 start → cap (λ) | quads, hams 11 → 16 (0.848); chest 10 → 14 (0.760, floored); lats 10 → 14 (swim pull rule met by back + rear delts); rear delts 6 → 12 (1); calves 10 (3 leg days × 3, floored); glutes, side delts, biceps, triceps credit | quads, hams 14 → 18 (0.565); chest, lats 10 → 13 (0.591, floored); rear 8 → 16; calves 12 (4 × 3) | quads, hams 11 → 16 (λ 1 over N = 6); chest, lats 10 → 14 (floored); rear 6 → 12; calves 10 | quads, hams, chest, lats 12 → 18 (1); rear 6 → 12; calves 10 (2 leg days) ; glutes / arms / side delts credit |
| T quads (wk 1 → last) | 11 11 11 11 12 12 13 13 14 14 15 16 | 14 14 14 14 14 15 15 16 16 17 17 18 | 11 11 11 12 12 13 → pre-season ≈ 0.6 × wk-6 sets per slot | 12 12 12 13 13 14 15 15 |
| D10 share (lower) | sport: 0.5 / 0.5 / 0.55 | sport: 0.3 / 0.25 / 0.2 | sport: 0.2; PRE 0.1 | sport: 0.5 / 0.55 |
| D11 athletic | plyo 0.10 → 0.25 (class 5); ≤ 100 contacts / session; plyometric 6-8, jumps 37-49, throws 35-45 / wk; Olympic 3 exposures (clean S1 / S3, snatch S2; swimmer preference single-arm DB snatch, hang power clean; the S2 swing station is ballistic power) | plyo 0.35 → 0.50; ≤ 120; plyo 60-90, throws 70-110, cuts 80-100, sprint 300-400 m; Olympic 4 a week (clean A days, snatch B days; L3 full scope from block 1, from floor allowed: bumpers) | plyo 0.45 → 0.60; ≤ 100; cuts 120-160, sprint 400-600 m; pre-season factors (plyo 0.75, COD / sprint 1.0); Olympic 2 | no plyo share (class model: jumps live in WODs); Olympic 3 slots (snatch Tue, clean Thu, Fri); skill Mon (double-unders) / Thu (gymnastics) |
| Rep phase / RC stage | VOL1 / 2 / 3 by exercise block; RC1 1-3, RC2 4-7, RC3 8-12 | same | VOL1; RC1 1-2, RC2 3-4, RC3 5-6 (N = 6), held in pre-season; pre-season VOL3 | — (general column) |
| D13 tests | wk 1 baseline (strength 3RM or 5RM — from zero; jumps CMJ / broad) · wk 12 end (3RM or work up to 1RM) | wk 1 / 12 (strength, speed 80-90 % at baseline, jumps) | wk 1 / 6 (speed / agility 80-90 % at baseline, jumps); none in pre-season | wk 1 / 8 (strength 3RM / 5RM; cardio 80-90 % at baseline, 1-mile or erg trial at the end) |
| D14 aerobic | **0** (the pool is the aerobic work; OPT-day aerobic station dropped) | 3 (C B A: Wed + Sat optional days, 1 add-on) | 4 off-season (C B A + C), 2 pre-season | 2 (C, B: Wed free day + 1 add-on) |
| Notes | pull ≥ 1.5 × push (back + rear delts vs chest); shoulder care `RECOVERY_ARM_CARE` 2 × a week (SHOULDER_SWIMMER); youth floor Olympic lifts locked (first block) | linebacker = mixed class 3; two spine days A1 squat Mon, B2 deadlift Fri | ES output; contralateral unilateral loading; game-heavy rule only in season | H before V exempt on PRESS day (work = vertical press, D-30); WOD 10-20 min, stations never credit muscles; wall balls ≤ 20 lb |

| | 05 bootcamp (ES) | 06 full-body aesthetics | 07 push / pull / legs | 08 pickleball (bonus) |
|---|---|---|---|---|
| D2 profile | `general_population` (goal general + bootcamp format); I | `bodybuilding_aesthetics`; G | `bodybuilding_aesthetics`; G | `rec_pickleball` + overlay `active_aging_50plus` (age 52); recreational; I |
| D1 / format | fat_loss_bootcamp / **bootcamp (circuit)** | aesthetics / gym | aesthetics / gym | athletic / gym |
| D3 level | L2 (1 year) | **L3** (3 y + 4 days, D-01) | **L3** (4 y + 6 days) | L1 (0.5 year) |
| D5 / blocks | fixed_8, C8_GENERAL; stairway 1-8 (circuit); exercise blocks 1-4, 5-8 | fixed_12, C12_HYPERTROPHY; stairway 1-12 | fixed_12; stairway 1-12 | fixed_12, C12_GENERAL; stairway 1-12 |
| D6 template | `fat_loss_bootcamp.3` BC1 Mon / BC2 Wed / BC3 Fri (two circuits each) + aerobic Tue / Thu / Sat | `aesthetics.4` A1 Mon / B1 Tue / A2 Thu / B2 Fri + OPT Wed, Sat (optional); same pattern | `aesthetics.6` variant **`ppl_x2`** (prefs.split_style ppl, D-15): Push Mon, Thu / Pull Tue, Fri / Legs 1 Wed / Legs 2 Sat | `athletic.2` A Mon / B Thu + OPT moved to **Fri** (Sat is a play day); play days Wed / Sat / Sun |
| Program | OT06 | OT01 | OT03 | OTACT |
| D7 band | general | hypertrophy [2,5] / [3,5] | hypertrophy | general (mild pain is not "moderate") |
| D8 kit | FIELD_TRACK_KIT + DB + KB (no barbell, no machines, no cable); medball ≤ 14 | FULL_GYM, no running space | FULL_GYM | BASIC_GYM (no specialty machines, no sled / belt squat); medball ≤ 8 |
| Modifier | general 0.8 (reported; circuits are not set-based, D-19) | aesthetics 1.0 | aesthetics 1.0 | stay_active (0.8 / 0.8 / credit) |
| D9 start → cap | reported targets 12 → 18 big, 10 → 18 small; **circuit**: 3 rounds × work 35 35 40 40 40 45 45 50 s; a round = 1 set; floor exempt | quads, hams, chest, lats 20 → 25 (λ 0.683, steps ≤ 3 %: priorities run); **glutes 26 → 30 (priority, λ 0.320)**; **side delts 21 → 30 (priority, λ 0.806)**; biceps, triceps 15 → 25 (≤ 3 %); rear 8 → 16; calves 12 | quads, hams, glutes 20 → 25 (0.683); **chest, lats 26 → 30 (priority, 0.320)**; side delts, biceps, triceps 15 → 25 (≤ 3 %); rear 8 → 16; calves 10 (2 leg days) | quads **6 → 11** (knee pain × 0.6 wins over the floor; frozen weeks 1-2, then ≤ 3 %: ≈ 6 → 7); hams, chest, lats 10 → 13 (floored, λ 0.591); rear 4 → 8; calves 10; glutes / arms / side delts credit |
| T examples | — | glutes 26 26 26 26 27 27 27 28 28 29 29 30; quads 20 20 20 21 21 22 22 23 23 24 24 25 | chest 26 26 26 26 27 27 27 28 28 29 29 30 | hams 10 10 10 10 10 10 11 11 11 12 12 13 |
| D10 share | sport 0.5 | sport 0.5 / 0.65 / 0.8 | sport 0.5 / 0.65 / 0.8 | sport 0.3 / 0.25 / 0.2 **+ 0.2 knee shift** = 0.5 / 0.45 / 0.4 |
| D11 athletic | off | off (dynamic medball warm-up only) | off | plyo 0.35 → 0.50 (class 3), ≤ 80 contacts / session; **heavy play week** (3 play days): plyos × 0.5, no extra COD (`AP_COD` dropped); 50-59 racket rules: no depth jumps, hurdle hops, bounds; prehab `PREHAB_LOWER` each leg day + `RECOVERY_ARM_CARE` weekly; Olympic L1 variants clean A / snatch B (2 slots) |
| D13 tests | wk 1 / 8 body weight | none | wk 1 baseline strength 3RM or 5RM (from zero), wk 12 3RM or work up to 1RM | none |
| D14 aerobic | 3 (C B A on Tue / Thu / Sat) | 4 + walks (C B A + C: Wed, Sat optional days + 2 add-ons) | 4 + walks (all add-ons: no free day but Sunday OFF) | base 3, **2 replaced by play** (R3-ATH-05) → 1 gym session (C on the Fri optional day) |
| Notes | ES output; two circuits of 4-6 stations, 15 s transition, 90 s between rounds; every group 2 stations | priority isolations first in session (ORD-04); long full-body days expected → OPT-day Focus slots and `warning.long_day` (R2-SES-05) | heavy_powerlifting: first lift of each day one bracket down; split days 3-4 per group; Legs 1 heavy squat, Legs 2 heavy deadlift | 45-min days cannot hold the floor → `warning.floor_schedule` + advice (3 days or ~70 min, D-33); hard gym days ≥ 48 h before play |

**[1.1.1] Observed in the integration step** (compiled model 1.1.0, engine 0.2.0; details and numbers per client in
`samples/SAMPLES.md`): every §9 profile, family, level, template / variant, program, weekday mapping, plan shape, λ and start / cap
is reproduced. Where the generated plans differ from the expectations above it is a time effect, shown to the reader as a warning:
08 keeps the floor of 10 by running the 45-min days at ~77-81 min (`warning.long_day` + `warning.stairway_time`, not
`warning.floor_schedule`: the 2-4-exercises-per-group rule holds every group on both days); 04's class model cannot hold 10 sets for
quads / hamstrings / chest / back / calves (`warning.floor_schedule`) and its sets stay flat (the WOD and work time climb); 06 and 07 fill
their 75-min days by week 1-2, so their last weeks climb by load and RIR rather than sets (`warning.stairway_time`); 02's four
full-body days start every muscle above its target (template minimum 2 exercises x 2 sets per group per day), so sets hold to week 9.
These are round-3 questions for the coach (session length vs. volume), not contract violations: H17 / H18 / H21 pass on all eight.

---

## 10. Decisions

All gap decisions and every resolution of a conflict between round 2 and the docs are in **`engine/DECISIONS.md`** (D-01 … D-45; the
integration step D-46 … D-66; the v1.2 review round D-67 … D-81; round 3 / engine 0.4.0 E-01 … E-80 - stage B1 E-01 … E-25, B2 E-26 …
E-45, B3 E-46 … E-63, B4 E-64 … E-80), each with the default used, the source tags and the round-3 question that would close it.

---

## 11. Change log

| Version | Date | Change |
|---|---|---|
| contracts/1.0.0 | 2026-10-08 | First binding version (before round 2 was answered). Fixture model_version 1.0.0-fixture. 5 v1.0 sample intakes. |
| contracts/1.1.1 | 2026-10-09 | Integration step (CONTRACT_REQUESTS resolved): static imports in generate; `estimateMinutes` passed to `planWeeklySets`; `fillSlot` ctx `selection` + `day_used` (no same-day repeats); slot-id suffix per origin; accepted extra keys (`WeekLayout.warnings`, `SlotDef.day_index` / `test`, `DayLayout.circuit_dose`, `SlotFill.stations`, `WeekShape.stair_N` / `exercise_block_week`, `Derived.priority_choices`, `D4.in_season_until`, `sets_by_slot` null); catalogue fixes (front raises `ISO_FRONT`, first video URL) and station `axial` enum mapping in both builders; D-46 rep-max tests on bilateral compounds; D-47 `warning.stairway_time`; D-48 distinct detail for a same-day repeat; V5 / V8 / V12 / V13 / V17 / V19 / V23 readings (§6); new i18n keys (§7); `node --test tests/` runner (§8); `tools/compile/**` owned by B1 (§1.1). |
| contracts/1.1.0 | 2026-10-08 | Round 2 applied in full (stairway, no deload inside a block, no check-in = no change, no lifestyle inputs, floor 10, small 10/12/15, KB swing 0, thruster 1/0.5/0.25, face pull FACEPULL, 2-4 per group, two spine days, tests start / end only and never from zero, 60+ opt-in, release + coach bypass, pre-season 60 % + taper, cardio adjustable, Olympic day pattern); intake/2, checkin/2, catalog/2, rules/2, templates/2, profiles/2 (127 profiles, 52-sport picker, 26 activities incl. pickleball, HYROX, CrossFit-style classes), plan/2; V21-V26 and H15-H22; fixture rebuilt from v1.1 sources as a full reference compile (`tools/fixture/`); the coach's 7 sample plans + pickleball bonus replace the 5 v1.0 samples; decisions moved to `engine/DECISIONS.md`. |
| engine 0.4.0 (F3) | 2026-10-09 | Fix round 1 / F3 (selection, dosing and the printed plan): the laterality dial on every lower station (one way), non-spinal second hinge and low-back core for low-back hot spots, side / rear delt stations by the Focus, above-level picks as fallbacks, week-wide movement families, heavy-powerlifting canonical lifts; MYO on the day's last eligible item (V12 / V17 readings), the circuit hold intensifier, pair rest in numbers, per-side one-arm Olympic lifts, rep-hint tops in every block; the printed plan says only what is true (minutes, climbing, Focus, intensifier days, change lines per group, the two-leg / single-leg direction), every switchable block, the flat release stamp + health-check / PAR-Q+ line, 'How to adjust this plan', the effort bridge, the weekly sets table with every group; `es_review.priority_review`. See the F3 amendments box and DECISIONS E-110 ... E-134. |
| engine 0.4.0 (F2) | 2026-10-09 | Fix round 1 / F2 (athletic work): the plyo share held per week (V27 `share_over`), the athletic tracks' stations sized from the block's peak targets (`athletic.ensureAthleticStations`: ballistic jump track, second sprint / max velocity, second throw, ankle block outside the jump / throw split and the 12 + 2 count), Receive-Create stage cues and drills, throws 6-10 a set, COD in whole reps, the sport's Olympic ceiling, the pre-season's next stage, split capacity warnings, a ballistic circuit station first. See the F2 amendments box and DECISIONS E-97 ... E-109. |
| engine 0.4.0 (B4) | 2026-10-09 | Stage B4 (integration): pipeline from clean + a 1,578-intake sweep on both models (15 failing intakes -> 0); class lifts kept by the time check (`session.time_fit.keep_work_lift`, reason `class_lift`); circuit throws share the week's target; in-season game-heavy Olympic 2 x 3 once a week; Olympic trim keeps fillable stations; lone stations leave the day; `WeekVolume.added_fills`; the athletic raise stops at the V27 limit; joint care round robin; day-aware room cuts; test spread; honest schedule copy and class titles; V18 / V19 / V22 / V23 / H21 readings (§6). Additive shapes only (`plan/2`, `contracts_version 1.1.0` unchanged). See the B4 amendments box and DECISIONS E-64 ... E-80. |
| engine 0.4.0 (B3) | 2026-10-09 | Stage B3 (exercise selection, variation and rendering; R3-VOL-02 / 04, R3-SES-01 / 02, R3-GEN-01): concrete one-detail block changes (`selection.variations`, `variationValues`, `detail.v.*`), near-duplicates, lead / canonical lifts, home substitutes only when needed, core once a week, skill rotation; intensifiers in the last week only (one a day), circuit RIR effort, pyramid per block, pair strength rest, aerobic sessions by the client's tools and level (`D8_kit.cardio_options`), WOD loads and rotation; the printed plan (use-at-your-own-risk line + release link, 'Your schedule', block switches, superset suggestions, macro tables, `view: 'overview'`, test items, failed checks in words, day titles from picks, holiday notice); check-in words retired; Spanish fixes. Additive shapes only (`plan/2`, `contracts_version 1.1.0` unchanged). See the B3 amendments box and DECISIONS E-46 ... E-63. |
| engine 0.4.0 (B2) | 2026-10-09 | Stage B2 (athletic work, R3-ATH-01 .. 05): `engine/athletic.mjs` (stages per exercise block, drill responses and cues, share-split targets, the athletic stairway `planAthletic`), Olympic climb (`budget.olympicSetsForIndex`), catalog `athletic` + 6 fields, sport-only COD drills, sprint kinds, first reactive exposures, circuit ballistic stations, WOD rotation, HYROX template variant (`athletic.4/hyrox`, OTHYX), swimmer every-session shoulder care and championship taper, 60+ defaults, racket 50+ opt-in; V27 under / drop / stage / sport checks; additive plan fields (`athletic_budget.planned.upper_contacts / planned_share / goals / scale / hold`, item `athletic.key / response`). See the B2 amendments box and DECISIONS E-26 ... E-45. |
| engine 0.4.0 | 2026-10-09 | Stage B1 (round 3: time, volume and structure): lines + FOCUS groups, Focus muscle 1 / 2 (+2), the time check (`plan.time_check`, offers in numbers), time model v1.3, test top-set items, superset recommendations, block toggles, check-ins retired (`adapt` removed, `output_mode` normalized, `week_by_week` = 12-week view), validators V22 / H17 / H21 / H22 rewritten (no warning exemptions); additive plan fields; `plan/2` and `contracts_version 1.1.0` unchanged. See the amendments box at the top and DECISIONS section E. |
