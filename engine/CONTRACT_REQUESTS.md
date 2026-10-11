# CONTRACT_REQUESTS (append-only during the build; the integrator resolves)

> **Status (2026-10-11, engine 0.5.0).** History. These requests were raised and resolved during the first build (contracts/1.1.1, 2026-10-09). Entries about session minutes, time fitting or check-ins are retired with those features (COACH-CT CT-01; COACH-R3 R3-VOL-02; round 4). The binding text is `engine/CONTRACTS.md` with its engine 0.5.0 boxes.

Resolved in the integration step (contracts/1.1.1, 2026-10-09): every entry below carries its status. Accepted changes are in
CONTRACTS.md (marked [1.1.1]) and DECISIONS.md (D-46 ... D-66).

Format, one entry per ask:

```
## <B1|B2|B3|B4> · <CONTRACTS section> · <one-line ask>
- why: <the problem, with file / rule ids>
- fallback implemented meanwhile: <what your code does now>
- status: open            (integrator sets: accepted -> CONTRACTS/DECISIONS/fixture updated | rejected: <why>)
```

## B1 · §1.1 / BUILD_PLAN §1 · add `tools/compile/**` to B1's files
- why: the compiler is split into modules instead of one 3,000-line file: `tools/compile/{sources,catalog,rules,templates-profiles,patches,crosscheck,i18n}.mjs` and the Spanish translation tables `tools/compile/es/{exercises,labels}.mjs` (866 machine-translated lines). Nobody else owns these paths.
- fallback implemented meanwhile: the files exist under `tools/compile/`; `tools/compile-model.mjs` and `tools/check-model.mjs` are the two CLIs of the contract.
- status: accepted -> CONTRACTS §1.1 lists `tools/compile/*.mjs` and `tools/compile/es/*.mjs` (B1).

## B1 · §8 / BUILD_PLAN §5 · `node --test tests/` does not run on Node 22.22
- why: Node 22 treats a directory argument to `--test` as a module path (`Cannot find module '.../tests'`, 1 failing pseudo-test), so the documented command fails before any test runs. `node --test` (no argument: default `**/*.test.mjs` discovery) and `node --test "tests/**/*.test.mjs"` both work (25 / 25 pass for tests/compile.test.mjs).
- fallback implemented meanwhile: none needed in B1 code; I ran `node --test tests/compile.test.mjs` and `node --test`. Proposal: CONTRACTS §8 and BUILD_PLAN §5 say `node --test` (or the quoted glob).
- status: accepted -> `tests/package.json` (main) + `tests/run-all.mjs` make `node --test tests/` work; `node --test` works too (CONTRACTS §8, BUILD_PLAN §5).

## B1 · §3.3 / 12 v1.1 §3.7.1 · stairway.by_N[16].planned_effort[12]: rules "2" vs 12 v1.1 "1-2 RIR"
- why: at N = 16, week 12 has display level exactly 8.0. `tools/fixture/rules.mjs > stairTable` maps the ROUNDED level (`lv <= 8 -> '2'`); 12 v1.1 `stairway.steps_by_plan_length.16.planned_effort.12` says "1-2 RIR" (it apparently used the unrounded level, 8.0x). Every other value of the 4 / 6 / 8 / 10 / 12 / 16-week tables matches (cross-check X04 in model/COMPILE_REPORT.json). Only 16-week stairways (season / year blocks) are affected, one week.
- fallback implemented meanwhile: model/rules.json deep-equals the fixture ("2"); the mismatch is a compile warning and is pinned by tests/compile.test.mjs (so a fix on either side is noticed).
- status: accepted as is -> DECISIONS D-49: level 8.0 maps to "2" for every N; the compile warning and the pinning test stay.

## B1 · §3.4 · two 05 station `axial` values outside the enum `axial | non_axial | light_or_non_axial | null`
- why: `light_technique` (strength.4 DE_LOWER_A/B s09, strength.5 / strength.6 DE_LOWER_A s09) and `n/a (bodyweight)` (no_equipment.2 / no_equipment.4 A_BW, B_BW s05) come verbatim from 05 v1.1 through `normStation`.
- fallback implemented meanwhile: kept verbatim (templates.json must equal the reference build); `tools/check-model.mjs` warns. Proposal: `normStation` maps `light_technique -> light_or_non_axial` and `n/a (bodyweight) -> null`, fixture rebuilt, B1 re-ports.
- status: accepted -> `normAxial` in tools/fixture and tools/compile/templates-profiles.mjs (light_technique -> light_or_non_axial, 'n/a (bodyweight)' -> null); fixture rebuilt; check-model now reports 0 warnings (CONTRACTS §3.4).

## B1 · §3.2 / §3.6 · compiled EN differs from the fixture EN on 31 user-facing strings (coach corrections FIX-03 / FIX-04)
- why: (a) CONTRACTS §3.2 says the EN name drops every "(… inferred / not stated …)" qualifier; the fixture's `cleanName` only drops qualifiers that start with a known word, so 8 names kept decoder notes ("Back Squat (bar position not stated)", "Seal Cable Row … (typo ambiguous)", "Low Depth Drop … (second FOUNDATIONAL listing)" …). (b) FIX-03 ("program and day names generic and understandable"): 23 rendered day labels / cues / profile names carried notes such as "(corrected)", "(complete)", "(OT02 Day 3)", "INFERRED", "(COACH-R2 ATH-08)", "the BYOP cell says …", "(bodyweight pools)".
- fallback implemented meanwhile: patches P15 / P16 clean the EN i18n strings (templates.json `label` stays verbatim); every change is listed in model/CHANGELOG.md and `COMPILE_REPORT.json > fixture_diff.en_values_changed`. Proposal: the architect adopts `cleanName` / `cleanUserText` (tools/compile/catalog.mjs, tools/compile/i18n.mjs) in tools/fixture so fixture EN == model EN.
- status: accepted (divergence by design) -> DECISIONS D-65: compiled EN wins for user-facing text; the fixture stays the shape reference; differences listed in COMPILE_REPORT.fixture_diff. Porting cleanName / cleanUserText into tools/fixture is a Phase 1 tidy-up.

## B1 · §3.2 · catalog `status` / `rule_refs` differ from the fixture on 61 records
- why: R2-LIB-07 added hang clean, single-arm DB snatch, KB squat clean and hex-bar jump to the master library at FOUNDATIONAL; 02 v1.1 still says `program_only` ("lives only in his programs"). Patch P08 sets `status: added_v1_1` (like the other R2-LIB-07 additions kb-curl, table row, Y / T raises). Patches also add the coach id to `rule_refs` of every record they verify or change (CONTRACTS §3.2: "coach ids that changed this record"): CAT-09, LIB-13, LIB-15, LIB-16, R2-LIB-04, R2-LIB-05, R2-LIB-07, R2-SES-02, EQ-05, EQ-11, ATH-10, LIB-01/07/09/11.
- fallback implemented meanwhile: model/catalog.json carries the patched values; no engine rule keys on `program_only` (selection keys on `default_in_slots` and the `proposed_*` statuses). Proposal: mirror P08 + refs in tools/fixture/catalog.mjs, or accept the divergence (`COMPILE_REPORT.json > fixture_diff`).
- status: accepted (divergence by design) -> DECISIONS D-65.

## B1 · §1.6 / §3.6 · scope of `es_review.machine_translated`
- why: R2-GEN-08 wants every Spanish line approved by the coach. `machine_translated` now lists the 866 lines B1 machine-translated (599 exercise names, 70 cues, 145 day labels, 52 profile names). The 681 lines of the architect's word lists (tools/fixture/i18n*.mjs, also PROPOSED) and the 384 lines from 04 v1.1 `name_es` / `es` are not flagged; the 160 spec lines ([LEGAL REVIEW] copy) are verbatim from the spec.
- fallback implemented meanwhile: B1 lines only; provenance counts per source in `COMPILE_REPORT.json > i18n.es_by_source`. Ask: should the architect word lists also be flagged (a coach-review UI would then list ~1,550 lines)?
- status: accepted as is -> DECISIONS D-64 (B1 lines only; the other sources are counted in COMPILE_REPORT; every ES line stays PROPOSED until the coach approves).

## B1 · §3.6 · export `SLOT_NAMES_V11` and `ES_EXERCISES_V11` from tools/fixture/i18n-v11.mjs
- why: both are module-local constants in tools/fixture/build-fixture.mjs (which runs on import), so the compiler had to copy them (tools/compile/i18n.mjs). The UI word lists themselves are imported read-only from tools/fixture/i18n.mjs / i18n-v11.mjs ("the compiler copies the fixture's UI / why strings", §7).
- fallback implemented meanwhile: copied verbatim; tests/compile.test.mjs asserts that every fixture ES line is identical in model/i18n/es.json, so drift is caught.
- status: deferred (Phase 1) - the copies are guarded by tests/compile.test.mjs, so drift is caught.

## B2 · §3.2.3 / H08 · front raises are credited as rear delts (ISO_REAR) in the fixture and in model/
- why: `barbell-front-raise`, `db-front-raise`, `db-front-raise-supinated-grip`, `db-hammer-grip-side-front-raise-neutral-grip` have `credit_class: ISO_REAR` (`credits {rear_delts: 1}`) and are `default_in_slots` ISO_SIDE_REAR_DELT; §3.2.3 says "front raise -> ISO_FRONT". `tools/fixture/catalog.mjs:183` tests `head === 'rear'` before `/front-raise/`. A "rear" ISO_SIDE_REAR_DELT station filled with a front raise credits rear-delt own sets that the person never trains (H08), and select's variant filter (`rear` -> ISO_REAR + FACEPULL) offers front raises as rear-delt work.
- fallback implemented meanwhile: none in B2 code (credits are read from the catalog); tests pick rear-delt records by id (`reverse-fly`). Owner: architect / B1.
- status: accepted -> fixed in tools/fixture/catalog.mjs and tools/compile/catalog.mjs (front-raise id before delt_head); fixture + model rebuilt: the 4 records are ISO_FRONT (CONTRACTS §3.2.3).

## B2 · §4.5 · `planWeeklySets` ctx: add `estimateMinutes` (week.estimateMinutes)
- why: placement checks day minutes <= minutes x `long_day.warn_above_factor`, and generate copies `WeekVolume.est_minutes` into the plan. One time model avoids drift between volume and week. My internal estimator follows `rules.time_model` and matches week.estimateMinutes on the base days (differences: a superset pair is timed as a pair only when the day's supersets are on; a WOD counts its lower bound).
- fallback implemented meanwhile: `planWeeklySets` uses `ctx.estimateMinutes(day, setsBySlot, fillsBySlot, model)` when present (the day it passes includes the added bonus / Focus slots as an extra `accessories` block), else the internal estimator. Ask B4: `planWeeklySets({ ..., fillSlot: fillFor, estimateMinutes: deps.estimateMinutes })`.
- status: accepted -> generate passes `estimateMinutes: deps.estimateMinutes` (CONTRACTS §4.5); day cards and warnings now show one number per day.

## B2 · §4.5 · time-bound stairways in real layouts (samples 04, 06, 07)
- why: with B3's layouts, 06 (L3, 4 x 75 min full body + 2 optional days) and 07 (L3 PPL 6 x 75) fill every day to minutes x 1.10 by week 4-5; the planner then holds (`changes.load_up`) to week 12 and lists `shortfalls`. H21 passes (ties allowed) but the last 4 weeks are not "brutal" in sets, only in load / RIR. 04 (CrossFit class, 60 min: warm-up + skill + WOD) cannot hold the floor of 10 for quads, hamstrings, chest, back and calves -> `warning.floor_schedule`. 12 v1.1 §5.1 relaxed the limit to ~80 min for full-body days; CONTRACTS §4.5 fixes it at minutes x 1.10.
- fallback implemented meanwhile: contract rule (minutes x 1.10, supersets first, optional-day Focus, then main-day bonus, then shortfall). Ask: (a) a warning key for "sessions full from week {week}: the last weeks climb by load and effort; add a day or ~{min} min" (e.g. `warning.stairway_time`), and/or (b) a decision whether full-body / L3 days may place sets up to a higher factor with `warning.long_day`. Coach question for round 3.
- status: accepted (warning) -> DECISIONS D-47 `warning.stairway_time` (generate.mjs); the placement limit stays minutes x 1.10. Round-3 question for the coach (time limit for full-body / L3 days) in samples/SAMPLES.md.

## B2 · §4.5 / §6 V22 · `targets.floored` lists every floor-protected muscle, not only the muscles the floor raised
- why: §5 example shows `floored: [chest, lats_upper_back, calves]` (raised ones) for the swimmer; H17 protects every target muscle in a stairway block. With all protected muscles listed, V22 checks the real rule (quads at 11 must not fall below 10 either).
- fallback implemented meanwhile: `floored` = target muscles with `fill: target` (calves included), floor applied, not pain-reduced, not own-sets, not credit; the planner adds sets until each is >= 10 in week 1 (or >= start - 1) and names any muscle it cannot fit in `warning.floor_schedule.args.muscles` ("chest, lats_upper_back"). Circuit plans: `floored: []` (D-19).
- status: accepted -> CONTRACTS Targets typedef reading (V22 checks every floored muscle).

## B2 · §4.3 · intake error keys, the under-60 opt-in warning, and warnings repeated by deriveValues
- why: (1) the fixture has no strings for field errors; (2) no key for "older opt-in ignored under 60"; (3) §2.1 normalization says clamp 105/120 min and keep 2 priorities, which loses what the person typed.
- fallback implemented meanwhile: (1) `Issue = {code, field, key, args}` with `code` in `required enum range type date too_many unknown_key forbidden_key banned_token release_missing health_route_required week_by_week_needs_checkin year_not_for_competitive coach_rule_packs_phase1 not_object`, `key` = the field label `intake.<field>.label` (or `check.h13_no_sex`, `check.h16_no_lifestyle`, `check.h01_no_bands`, `check.v26_inputs`, `warning.release_missing`). Ask: `intake.error.<code>` EN + ES. (2) code `older_opt_in_ignored` with key `warning.older_athletic`; ask for `warning.older_opt_in_ignored`. (3) the normalized intake keeps minutes / priorities / opt-in as typed (defaults filled only); `deriveValues` applies the clamp / trim / opt-in rule and its `warnings` repeat validateIntake's (generate uses `derived.warnings`, so nothing is lost or doubled).
- status: accepted -> keys `intake.error.<code>` (rendered '{field}: ...' by render.mjs for invalid intakes) and `warning.older_opt_in_ignored` (intake.mjs uses it); normalization reading accepted.

## B2 · §4.0 / §4.4 · D4 `in_season_until`, `planTrainingBlocks` export, prep overlay and in-season-then-off-season shapes (INFERRED)
- why: the Derived typedef has no place for the in-season end date; §4.4 describes only the dated season overlay.
- fallback implemented meanwhile: `D4_season_phase.in_season_until` (ISO or null) added. `shape.mjs` also exports `planTrainingBlocks(derived, model)` (deriveValues uses it for `D13.end_weeks` and the V6 warnings). Prep overlay (competition date or gen-pop `activity.event_date` inside the plan): stairway to the week before the event week, `taper` in the event week (`plan_types.prep.taper_weeks[0]` / `gen_pop_event.taper_weeks`), the plan ends at the event (`weeks_total` = event week); an event too close (stairway < 4 weeks) or after the plan leaves one stairway. `in_season_until` inside the plan: `in_season [1, E]` then an off-season stairway when >= 4 weeks remain. Lead-in shorter than 8 weeks: all pre-season with taper weeks by `taper_weeks_by_pre_len[W]` (W = 6 -> 2 taper weeks). Ask: confirm in DECISIONS.
- status: accepted -> DECISIONS D-50, D-51; CONTRACTS typedef D4.in_season_until; planTrainingBlocks stays an extra export.

## B2 · §4.5 · WeekVolume details other modules rely on
- why: shapes the contract leaves open.
- fallback implemented meanwhile: `sets_by_slot[id]` = `null` for slots that carry no sets (warm-up, aerobic, WOD, skill, text), `0` for a dropped slot (no candidate), else whole sets (circuit stations = the week's rounds). Added slots: `slot_id = <weekday>.<day_type>.xNN` (weekday = prefix), `origin bonus` (small muscle) / `focus_added` (big), bucket = the muscle's isolation bucket (+ `variant` side / rear) on a training day or `FOCUS` on the optional day, `group` = the muscle group, `focus_muscle` = the muscle. Optional days get Focus / bonus work only when the template gave them a lifting station (never the WOD-only class day or an aerobic day). Pre-season / taper / recovery: resistance slots scaled per D-37 / recovery rule; athletic and power slots keep their sets in pre-season (the athletic budget factors carry the change) and are halved (ceil) in taper and recovery; core unchanged; sprint buy-outs 0 in taper / recovery. `changes[].args` and `warning.floor_schedule.args` carry ids (`exercise` id, `day` weekday id, `muscle` id, `advice` = a `ui.plan.schedule_advice.*` key, `min`): render / explain resolve them. `why.level.args.reason` is a `level.reason.*` key. There is no `why.modifier` key (the modifier is `meta.targets.modifier_id`). `checkRelease(intake)` has no model: the minor age 18 is a literal asserted equal to `rules.levels.youth_age` in tests/intake.test.mjs.
- status: accepted -> CONTRACTS WeekVolume.sets_by_slot (null / 0), SlotDef id suffixes; render / explain resolve the id args (exercise, weekday, muscle, advice keys).

## B2 · §4.0 Derived / §6 V8 · add `derived.priority_choices` (the intake F09 ids, <= 2)
- why: `priority_muscles` holds canonical muscles, so `v_taper` (one choice -> side delts + lats) cannot be told apart from `side_delts` + `back` (two choices). computeTargets needs it for `rules.volume.priority.v_taper_hold` (chest held), and V8 counts choices ("v_taper counts as 1 choice"), not muscles.
- fallback implemented meanwhile: `Derived.priority_choices` (after `priority_muscles`); with `v_taper` the held muscles (chest) get `cap = start` (flat stairway, `why.at_cap` ref VOL-18). Ask B4: V8 reads `meta.derived.priority_choices.length <= max_muscles`.
- status: accepted -> CONTRACTS Derived.priority_choices; validate V8 counts it (v_taper = 1 choice).

## B2 · §4.7 / H21 · exercise-block changes should keep the slot's main muscle (credit class family)
- why: at an exercise-block boundary select may swap e.g. a single-leg RDL (UHD: hamstrings 1.0) for a single-leg glute bridge (GLUTE_ISO: glutes 1.0) in the same RP_UHD slot ("same pattern and laterality"), so the hamstrings' direct sets drop 6 -> 4 and H21 ("sets never drop inside a stairway") fails (seen in the 300-intake run: fat-loss 2 x 30 min, week 5 and week 9).
- fallback implemented meanwhile: planWeeklySets puts the lost direct sets back at the boundary week (VOL-07 order, alternating days, under the strict +10 % total; the minutes check is skipped for these sets because H21 is a hard rule and a long day only warns). Added Focus / bonus slots are re-filled only with a record whose main muscle is the slot's `focus_muscle`. Ask B3: block changes pick alternatives with the same `primary_muscle` (or credit class) as the block-1 pick.
- status: accepted -> select keeps pattern + credit class + laterality class at block changes (B3 entry below).

## B4 · §4.12 · generate.mjs loads the B2 / B3 modules with a tolerant dynamic import
- why: the six B2 / B3 files were built in parallel; a static import would have made generate.mjs (and every B4 test) unloadable until all existed.
- fallback implemented meanwhile: top-level `await import('./intake.mjs')` … per file, a missing file is recorded (`realModulesStatus()`), `generate()` throws `generate.modules_missing`; tests use `generateWith(STUB_DEPS, …)`. Any other load error is re-thrown. Ask: switch to static imports in the integration step (all six files exist now).
- status: accepted -> static imports (CONTRACTS §4.12); realModulesStatus() kept for the tests.

## B4 · §4.5 / §4.6 · one id scheme per origin for engine-added slots
- why: volume (bonus / focus) and week (prehab_added) both name added slots `${weekday}.${day_type}.x01…`; during the build `Thu.S3.x01` was a FOCUS slot in `volume.added_slots` and a prehab slot in the week layout, so `sets_by_slot['Thu.S3.x01']` landed on the prehab item and V14 / H08 failed (random intake 241). B2 / B3 changed something meanwhile (no collision in the last run), but the contract still allows it.
- fallback implemented meanwhile: generate keeps the layout's slot when an added slot id already exists (V14 then flags the mismatch). Proposal: suffixes by origin (`.b01` bonus, `.f01` focus_added, `.p01` prehab_added, `.a01` aerobic_addon, `.c01` cooldown) in §4.0 SlotDef.
- status: accepted -> CONTRACTS SlotDef.slot_id suffixes (.x volume, .p prehab, .a aerobic, .c cooldown, .k core).

## B4 · §6 V17 vs §1.7 H02 / §4.8 · MYO on a machine compound
- why: V17 says never-failure rep classes (incl. `machine_stable_compound`) may not carry `last_set: 'myo'`; H02 / dose say MYO goes on "the day's last machine or isolation exercise" (`reps.matrix.machine_stable_compound.hypertrophy.myo_if_last: true`).
- fallback implemented meanwhile: validate allows MYO on `machine_stable_compound` (all other MYO conditions apply: last resistance item, last stairway week or at cap in HARDEST, never in flat blocks); MYO / MAX on free-weight compounds stays an error.
- status: accepted -> DECISIONS D-55; CONTRACTS §6 readings.

## B4 · §6 V12 · "bilateral before unilateral" and "the work first" on days the coach wrote differently
- why: hybrid_crossfit.5 FRI has no `work` lift and puts the single-leg hinge before a non-axial hinge; strength-family conjugate days have two `work` lifts and, for 60+ without opt-in, the DE jump (`work`) is dropped so an accessory comes first.
- fallback implemented meanwhile: both sub-rules apply only on days that hold a `work` lift; the strength family (`session.exercises_per_group.exempt_families`, "conjugate days stay as written") is exempt from work-first.
- status: accepted -> DECISIONS D-53; CONTRACTS §6 readings.

## B4 · §6 V13 vs D-34 · an over-cap day that cannot be cut further
- why: V13 makes a split day above `exercise_cap_by_minutes` (and an athlete day above 12) an error; D-34 / §4.6 say that when the cut order is exhausted the day is kept with `warning.long_day`.
- fallback implemented meanwhile: over-cap / over-time is legal when `meta.warnings` holds `warning.long_day` for that weekday (args.day `Mon` or `weekday.Mon`); otherwise error. Generate adds `warning.long_day` for any day whose volume estimate exceeds minutes × 1.10 when week / volume did not.
- status: accepted -> DECISIONS D-54; CONTRACTS §6 readings.

## B4 · §6 V19 vs §4.7 filter 1 · when must an athletic week hold Olympic work
- why: V19 demands ≥ 1 AP_TRIPLE_EXT item every athletic week; select drops the slot when no record passes (kit without barbell / DB / KB, lower-back pain axial limits, youth floor lifts) and nothing reports it (no `equipment.buy_list.AP_TRIPLE_EXT`). The two sections also read "`jerk` either" differently (V19: a jerk-family lift fits any station; select: clean station = clean + loaded_jump only).
- fallback implemented meanwhile: V19 requires an item only where the template keeps an AP_TRIPLE_EXT station at the session length and some catalog record passes kit / youth ladder / floor-lift / tier-of-the-week / pain avoid-tags + max axial class / exclusions / day pattern (null family not allowed on a variant station; jerk family fits any). 4 of 378 random / sweep intakes still fail (B3 drops the slot although a push press fits; listed as `todo` in tests/invariants). Ask: one reading for both sections, and a `buy_list` / `why` when the slot is dropped.
- status: accepted -> DECISIONS D-56; CONTRACTS §6 readings. The V19 `todo` is gone: 0 of 1,578 random / sweep intakes fail on the fixture or on model/.

## B4 · §3.2 `older_ok` vs C-11 / V5 · landing drills for 60+
- why: C-11 and V5 allow landing drills by default from 60 ("AP_PLYO items only quality `landing`"), but the catalog (fixture and model/) marks every landing drill `older_ok: false` (low depth drop, stick-the-landing, DB snap-down …) and no AP_PLYO record is `older_ok: true` - so "select by older_ok" leaves a 60+ client no default plyo / landing work.
- fallback implemented meanwhile: V5 / H12 exempt athletic quality `landing` from the `older_ok` clause (never tags and the plyometric / olympic / loaded-jump clauses stay). Ask: compile `older_ok: true` for landing-quality records without a never tag (02 `older_default_excluded`), or change V5's text.
- status: accepted (reading) -> DECISIONS D-52; catalogue values unchanged pending the coach.

## B4 · §3.2.3 · front raises compiled as ISO_REAR
- why: `barbell-front-raise`, `db-front-raise`, `db-front-raise-supinated-grip`, `db-hammer-grip-side-front-raise-neutral-grip` have `credit_class: ISO_REAR` (rear delts 1.0) in the fixture and in model/catalog.json; §3.2.3 maps front raises to ISO_FRONT. Front raises on a rear-delt station would count as rear-delt sets (V18 rear-delt minimum, rear-delt own sets).
- fallback implemented meanwhile: none in engine code (validate trusts the catalog class); the test stub skips `/front-raise/` on rear stations.
- status: accepted -> fixed (see B2 entry above).

## B4 · §6 V23 / R3-SES-01 · the weekly rear-delt station alone in the shoulders group
- why: `cut_order.never_cut.rear_delt_station_per_week_min: 1` keeps one rear-delt station; on short days it was the only shoulders exercise, so V23 / H18 (never 1 per group, R2-SES-05) failed for ~30 random intakes during the build (fixed by B3 in the last run).
- fallback implemented meanwhile: none (V23 strict). Ask: state in the contract whether a rear-delt own-sets station may stand alone (exempt like calves) or must be paired with side / front delt work.
- status: accepted -> V23 strict (CONTRACTS §6 readings); week.mjs adds a second shoulders station (D-60).

## B4 · §4.12 adapt · hooks the Phase 0 check-in mechanism needs
- why: rows `easy` (planned + 0.02), `ten` (−1 set on that day's last added set, T − 1), `pain` (that muscle's step 0 + protocol swap) and HOW IT FELT (couldnt / wrong / pain) need volume / select inputs the contract does not define.
- fallback implemented meanwhile: `adaptWith` reads every check-in with `checkinRow` (rules.stairway.checkin.order); repeat / ten / pain / hard make the volume stairway wait one week (week k+1 repeats week k's sets and targets, later weeks shift; calendar labels, RIR and block length unchanged; weekly sets recomputed from the items); easy / on target = planned; offers from `block_cannot_be_finished_offer_when`. Adapted weeks carry `why.r3_pending {id: R3-VOL-02}` (H21 step order / H22 relaxed for them when output_mode ≠ plan_only); plan_only intakes ignore check-ins. Ask: `planWeeklySets(ctx.step_overrides)`, `selectBlock(ctx.felt)`, and keys `why.checkin_row` + `meta.checkins_applied` to replace the R3 marker.
- status: deferred (round 3 / Phase 1) - Phase 0 keeps the 'stairway waits' mechanism with `why.r3_pending {R3-VOL-02}`; easy +0.02, ten -1 set, pain step 0 + swap and HOW IT FELT need the hooks listed here.

## B4 · §1.6 / §7 · UI keys render needs
- why: no short label per release version (`release.client|coach|minor` hold the full legal text), no word for an exercise column header or a "total" row.
- fallback implemented meanwhile: release stamp shows `release.label` + `intake.lang.opt.<lang>`; block-view exercise column header left empty; totals row labelled `ui.plan.sets`. Ask: `release.short.client|coach|minor`, `ui.plan.exercise`, `ui.plan.total` (EN + ES).
- status: accepted -> `release.short.client|coach|minor`, `ui.plan.exercise`, `ui.plan.total` (+ `ui.plan.wod_dose_fixed`) added and used by render.mjs.

## B4 · §6 V17 · INFERRED body-weight token list
- why: "MAX on the last set of body-weight work" needs to know what counts as body-weight; rules have no list.
- fallback implemented meanwhile: body-weight = available with `equipment.profiles.BODYWEIGHT.kit` + `pullup_bar dip_bars rings trx` (`// INFERRED` in validate.mjs). Ask: `rules.effort.max.bodyweight_tokens`.
- status: deferred (Phase 1) -> DECISIONS D-66 (stays a commented INFERRED literal in validate.mjs).

## B4 · §8 / BUILD_PLAN · paths and file names
- why: the task brief names `tests/invariants.test.mjs` and `samples/plans/<name>.md`; CONTRACTS §8 / §4.13 name `tests/invariants/invariants.test.mjs` and `samples/plans/<name>.<lang>.md` (+ `<name>.en.md` for Spanish intakes). B1 already reported that `node --test tests/` fails on Node 22.
- fallback implemented meanwhile: contract paths; run the suite with `node --test` (or `node --test "tests/**/*.test.mjs"`).
- status: accepted -> the contract paths stand (tests/invariants/invariants.test.mjs, samples/plans/<name>.<lang>.md + .en.md).

## B4 · observations for the integration step (other modules, not contract changes)
- why: found while reading the generated samples as the coach would (§4 step 5):
  * 06 full-body aesthetics (model/): total sets 160 → 171 by week 8, then flat to week 12 with 64 `why.cut_time` shortfalls and no warning shown; 07 PPL flat from week 4 (95 shortfalls, only `warning.floor_schedule` for calves). Passes H21 (ties allowed) but the last 4 weeks are not harder.
  * 08 pickleball: §9 expects `warning.floor_schedule` (2 × 45 min cannot hold 10 sets); the plan shows only `warning.long_day` (72 / 68 min) - and the day cards say "about 81 min" (volume estimate) while the warning says 72 (another estimate).
  * 04 / 05: total sets flat for all 8 weeks (class model / circuits climb by work seconds; expected) - fine.
- fallback implemented meanwhile: none (B4 renders what B2 / B3 produce).
- status: accepted -> 06 / 07 / 08 / 01 now carry `warning.stairway_time` (D-47); the 72 vs 81 min mismatch is gone (one time model); 04 / 05 flat sets are by design (class model / circuits climb by work time). Reported in samples/SAMPLES.md.

## B3 · §4.0 / §4.6 · extra output keys week.mjs / select.mjs emit (consumers may rely on them)
- why: the typedefs have no place for facts later steps need: `WeekLayout.warnings: Issue[]` (`warning.long_day` when a split / athlete cap cannot be met without a group of 1, `warning.play_48h`); `SlotDef.day_index` (index of the day among the week's training days: WOD format rotation AMRAP -> EMOM -> for time, core plane rotation); `SlotDef.test` (catalogue test id, set by `layoutForWeek` in test weeks on the week's counted squat / hinge station, first HPUSH work, first plyo / sprint / COD / aerobic slot); `DayLayout.circuit_dose {rounds, work_s, transition_s, between_rounds_s}` (circuit days, from `WeekShape.circuit`); `SlotFill.stations: string[]` (COND_WOD: 3-4 distinct movements, `[0]` = `exercise_id`; a WOD has no swaps).
- fallback implemented meanwhile: emitted as extra keys; generate.mjs already merges `L.warnings` and reads `slot.test` / `dose.wod.stations`.
- status: accepted -> CONTRACTS §4.0 typedefs (WeekLayout.warnings, SlotDef.day_index / test, DayLayout.circuit_dose, SlotFill.stations).

## B3 · §4.4 · WeekShape: add `stair_N` and `exercise_block_week`
- why: dose needs the week inside its exercise block (Olympic ramp 4x8 @75 -> 4x4 @90, PER-09) and the stairway length (Receive-Create stage weeks for the contacts ramp). Neither is in WeekShape.
- fallback implemented meanwhile: dose reads `week.stair_N` / `week.exercise_block_week` (or `input.exercise_block_week`) when present; else N = `stair_week` in the last stair week, otherwise the N whose `display_level[stair_week]` equals `stair_level`; the block week from `exercise_blocks_by_N[N]`; flat blocks: 1 at `is_exercise_block_start`, else 2. Exact for every sample (stub and B2 shapes).
- status: accepted -> shape.mjs emits both for stairway weeks (null in flat blocks, where dose keeps its flat-block reading); CONTRACTS WeekShape typedef.

## B3 · §4.5 / §4.6 · engine-added slot ids by origin (answers B4 "one id scheme per origin")
- why: id collisions between volume and week (`.x01`).
- fallback implemented meanwhile: week.mjs uses `${weekday}.${day_type}.p0N` (prehab_added), `.a0N` (aerobic add-ons; new aerobic days `${weekday}.aerobic.a01`), `.c01` (cooldown walk), `.k0N` (core top-up); `.xNN` is left to volume. Re-added template stations (weekly rear-delt minimum) keep their template station id.
- status: accepted -> see the B4 id-scheme entry.

## B3 · §3.4 · no cooldown bucket for the walk text item
- why: `walks` (D14) need a cooldown text slot; `templates.buckets` has no COOLDOWN bucket.
- fallback implemented meanwhile: bucket `WARMUP_GENERAL`, role / block `cooldown`, `text_key: note.walk_after`, `origin: cooldown`, no sets, outside the cap. Ask: a `COOLDOWN` bucket (kind warmup-like) in templates/2.
- status: accepted (reading) -> DECISIONS D-61; no templates/2 change in Phase 0.

## B3 · §4.7 · INFERRED selection weights and maps (move into rules.selection)
- why: CONTRACTS §1.2 wants numbers in the model. Not in rules: score for the counted lift on the station marked `axial` (+3) and for `not_counted` on second-day slots (+1); prime mover is a steered (target / own_sets) muscle (+1); main lifts loadable (`load_ceiling` high +2.5 / moderate +2 / low -1.5 for roles work / paired_upper / secondary / accessory, client families athlete / strength / hypertrophy / general: the stairway progresses by load at cap, `changes.load_up`); a station serving another group than its bucket (PPL push-day triceps press) prefers lifts crediting that group >= 0.5 (+4); contra / ipsi stations prefer DB / KB-loadable single-leg lifts (+1.5); core plane rotation and rotational-profile transverse (+1 each); frontal / transverse single-leg work under the profile share (+1); upper bilateral share (+1); plyo : ballistic share (+2); Receive-Create stage (quality in stage +1 / not -1; drill above the stage -3, equal +1); profile Olympic `prefer_ids` (+3, also allowed as the pick); L2+ Olympic scope (+2); Focus isolation or constraint >= 4 (+1); external rotation bias on shoulder pain (+0.5). Maps: pain area -> slots it touches (neck / wrist / lower back: all; shoulder / elbow / upper back: upper; hip / knee / ankle: lower); `floor_work` exclusion regex; AP_PLYO `upper` = push-up / clap plyos; split stance regex; nearest pattern (VPULL <-> HPULL, VPUSH <-> HPUSH, ISO_CHEST -> HPUSH -> VPUSH, BKD <-> UKD, BHD <-> UHD, ISO_QUAD -> UKD, ISO_LEG_FLEXION -> UHD).
- fallback implemented meanwhile: constants in engine/select.mjs, each commented INFERRED.
- status: deferred (Phase 1) -> DECISIONS D-66: move into rules.selection with the coach's numbers.

## B3 · §4.7 filters 10-11 · keep 2-4 per group when the kit has one option (instead of "drop + 2 extra sets on the paired compound")
- why: dropping a station (filter 10) leaves a muscle group with one exercise -> V23 / H18 (R2-SES-05) fails (64 of 300 random intakes before the change: KB-only biceps / triceps, bodyweight side delts, field kit vertical pulls, youth without a leg extension).
- fallback implemented meanwhile: substitution order = filtered pool -> repeats allowed in the bucket -> same pattern other variant (a side / front delt station may take any delt isolation; a rear station stays rear; clean station + jerk family, snatch station + swing / jerk family) -> no-ball substitutes / machine isolation swaps -> nearest pattern (two hops, buy list kept for V7, flag `pattern_gap`) -> the same exercise again with a one-detail variation (`detail`, flag `detail_variation`, R2-LIB-01 "never invented") -> no candidate (`buy_list`). With this, 0 of 1,500 random intakes fail an error check (fixture) and 0 of 600 (model/).
- status: accepted -> DECISIONS D-59 (plus D-48: a same-day repeat takes another detail axis).

## B3 · §4.7 · exercise-block changes keep the credit class (answers B2 "keep the slot's main muscle")
- why: a change from a single-leg RDL (UHD) to a single-leg glute bridge (GLUTE_ISO) dropped hamstring sets (H21).
- fallback implemented meanwhile: a block-change alternative must share pattern, credit class and bilateral / unilateral class with the block-1 pick; otherwise the slot keeps its exercise with a one-detail variation. Kept picks are reserved so no other slot of the bucket takes them that week.
- status: accepted.

## B3 · §3.2 / §4.7 / V5 · 60+ landing drills and the catalog `older_ok`
- why: same finding as B4's: every landing record is `older_ok: false`, so "older_ok by default" + "plyo buckets only landing" leaves the 60+ plyo station empty.
- fallback implemented meanwhile: 60+ without opt-in, AP_PLYO / AP_JUMP_LIMITED_KNEE take `landing` records that are `older_opt_in_ok` and not `high_impact` (C-11 reading); every other bucket still requires `older_ok`.
- status: accepted (reading) -> DECISIONS D-52.

## B3 · §3.2.3 · front raises compiled ISO_REAR (also filed by B2 / B4)
- why: 02 marks them `delt_head: rear`; `tools/fixture/catalog.mjs > creditClass` checks the head before the `/front-raise/` id.
- fallback implemented meanwhile: select removes `/front-raise/` ids from rear-delt station pools (INFERRED guard, remove when the catalog is fixed).
- status: accepted -> fixed; the INFERRED guard in select stays harmless.

## B3 · §3.2 / §6 V19 · no dumbbell clean-family lift
- why: a dumbbell-only kit (no barbell / KB / hex bar) cannot fill a clean station from the clean / loaded-jump families (kb-squat-clean needs a kettlebell).
- fallback implemented meanwhile: the relaxed step allows the jerk family (DB push press) on clean / snatch stations, which V19 accepts ("jerk fits any"). Ask B1: add the dumbbell setup to kb-squat-clean (a DB squat clean) so the clean day keeps a clean.
- status: deferred (coach / catalogue) - D-56 lets the jerk family (DB push press) fill the clean station meanwhile.

## B3 · §4.6 / §6 V13 · caps that cannot be met without a group of 1 (same as B4 "V13 vs D-34")
- why: an `upper_lower` Upper day at 60 min trains 5 groups (10 exercises at 2 per group) against a split cap of 7; a PPL push day at 45 min likewise.
- fallback implemented meanwhile: supersets, then `cut_order[family]` (never a group below 2); if the count cap still fails, the day is kept and week.mjs adds `warning.long_day {day, min, limit}` + `why.group_two_to_four`. Time-only long days are no longer warned by week.mjs (week-1 estimate): generate raises them from the week's volume estimate, so the plan shows one number per day (answers B4's 72 vs 81 min observation).
- status: accepted -> DECISIONS D-54.

## B3 · §4.6 · supersets in taper / recovery weeks
- why: `recovery.remove` lists "superset"; removing the calf pair (two small isolations = 1 for the athlete cap) pushed 90-min athlete recovery weeks to 13 counted exercises (V13).
- fallback implemented meanwhile: light weeks drop every superset except pairs made only of small isolations (no added fatigue). Ask: confirm, or let V13 count template small-isolation pairs as one regardless of the superset flag.
- status: accepted -> DECISIONS D-58.

## B3 · §4.6 · week.mjs completes the template where 05 leaves gaps
- why: V18 / H05 / R2-VOL-04: the `baseball_parts` variant has one core station per day; aesthetics.2 / 3 / 5 (and strength.2) start every rear-delt station at 45 / 75 min, so 30-min weeks had no rear-delt work.
- fallback implemented meanwhile: core block topped up to `core_block.exercises` (2) on main days >= 45 min (1 at 30) with CT / CP / CORE_ANY slots; when a week has no rear-delt station the first rear station of a main day is re-added (plus a second shoulders station when the day had none, so the group never stands at 1).
- status: accepted -> DECISIONS D-60.

## B3 · §4.8 · dose readings to confirm
- why: (a) athletes' VOL3 "isolation = MAX" is applied as last-set MAX for small / rear / calf work only (H02 limits MAX to small-muscle work); big-muscle isolation keeps its range + RIR (MYO if last). (b) MYO is allowed on a machine compound that is the day's last item (H02 "last machine exercise", matrix `myo_if_last`), never on free-weight compounds (B4's V17 reading). (c) The core opener keeps RIR >= 2 when the core block is first (R2-SES-03 "short of failure") even when the planned RIR is 1. (d) Test items use effort `{type:'intent', key:'effort.max_intent'}`. (e) A plyo drill below the week's Receive-Create stage keeps its own stage's contacts (a stick-the-landing drill in RC3 = RC1 counts). (f) Swings 10-15 reps, loaded jumps 3-5 reps at 10-20 % BW, strength-family brackets by role (work 3-5, accessory 6-8, else 8-12) - INFERRED, no table.
- fallback implemented meanwhile: as described.
- status: accepted as INFERRED -> DECISIONS D-62 (coach review).

## B3 · §1.6 · prehab note arguments are codes
- why: `note.prehab {code}` / `why.prehab {code}` carry injury codes (`SHOULDER_SWIMMER`, `AGE_50_RACKET`) that render verbatim.
- fallback implemented meanwhile: codes passed as args. Ask: `prehab.code.<CODE>` keys (EN + ES) for render to resolve.
- status: accepted -> `prehab.code.<CODE>` keys (EN + ES) and explain.resolveArgs maps `{code}`; the i18n test now fails on any raw code.

## v0.6 volume package · §3.3 / §5 · new rule sections, a profile flag and two plan fields
- why: the round-4 coach-eye reviews (reviews/coach-eye-r4/01-08, the volume majors): main lift first (VOL-07), the optional day's bonus for small groups only (R3-VOL-03), every capped group said (CX-04), the profile tops (UNI-02, R4-SES-02), a circuit above its top said (CX-03).
- implemented: `rules.placement.x3`, `rules.volume.x3` (tools/fixture/v06-volume.mjs, both builds); `profiles.sports[].upper_maintenance`; `meta.stairway[].over_top`; capped groups in `summary.shortfalls`; `changes.sets_added_n`; warning `circuit_over_top`. Every new key is read with a guard, so an older model behaves as before.
- status: implemented in the engine 0.6 volume package -> DECISIONS G-100 ... G-116; the CONTRACTS box at the top lists the shapes. The engine version bump is left to the lead (three packages merge into 0.6).
