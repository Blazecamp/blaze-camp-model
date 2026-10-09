# Review log - v1.2 review round (coach-eye reviews of the 8 sample plans)

The eight sample plans (engine 0.2.0, model 1.1.0) were each reviewed "with a coach's eye" and graded **D**: 151 issues, 17 blockers, 68 majors and 66 minors. Every fix was made in the engine, the model compiler or the rules (the amendment layer `tools/fixture/review-v12.mjs`, applied identically to the fixture and to `model/`), never by editing a plan; the samples were then regenerated (engine 0.3.0, model 1.2.0).

**Status:** Fixed 97, Partly fixed 36, Deferred 18.

| Severity | Fixed | Partly fixed | Deferred |
|---|---|---|---|
| blocker | 12 | 5 | 0 |
| major | 49 | 15 | 4 |
| minor | 36 | 16 | 14 |

How to read: **ID** = `R<sample>-<n>`, n = the issue's position in that sample's review. **Test** = the regression test in `tests/review-v12.test.mjs` (same ID prefix) that fails if the issue comes back; issues fixed through a shared rule cite the test of the first sample that covers it. "Partly fixed" names what is still missing. Deferred items carry the reason; they are also returned as `problems`.

Verification after the fixes: `node tools/fixture/build-fixture.mjs`, `node tools/compile-model.mjs` (0 errors), `node tools/check-model.mjs` (0 errors), `node --test tests/` (all pass; 6 `todo` entries are random-corpus limits listed at the end), `node tools/generate-samples.mjs` (8 / 8 plans `ok`, zero failing error checks).

## 01-swimming - reviewer: coach-eye review (grade D)

| ID | Severity | Issue | Status | Fix made / reason deferred | Test |
|---|---|---|---|---|---|
| R01-1 | blocker | Main days frozen at 2 sets; every step lands on the optional Saturday | Fixed | volume.mjs: the stairway is placed on main days only (ORD-10), VOL-07 order with the work-lift guard, sized to the minutes (D-67). Main-day total 50 -> 56; Saturday flat. | `R01-1` |
| R01-2 | blocker | Placed weekly jumps of +10-17 % per muscle (two bonus exercises in one week) | Fixed | volume.mjs: placed rise capped at max(1 set, 7 %) per muscle and 7 % in total; added slots enter at 1 set (rules.stairway.limits.placed). | `R01-2` |
| R01-3 | major | Depth drop turned depth jump; 0 -> 50 lateral single-leg contacts; printed plyo share is the target | Fixed | select.mjs: profile plyo exclusions (no depth jumps / bounds / hurdle hops for class-5 swimmers), landing drills RC1 only, RC-stage re-picks; dose.mjs/generate.mjs: contacts reconciled to the 6-8 budget (D-73); render prints the planned share. | `R01-3`, `R02-17` |
| R01-4 | major | 81-min Mondays, 12 Olympic sets vs budget 5; only priority muscles cut | Fixed | Data-driven cut chain (athletic budget first, then fillers, then groups); Olympic sets from the profile budget and exposures (budget.mjs, week.mjs trimOlympicExposures). Days 61-66 min for the 60 picked. | `R01-4` |
| R01-5 | major | Wednesday stacks two hinges, no knee-dominant lift (opposite-pattern pairing) | Deferred | Changing athletic.3 S1 / S2 to bkd + uhd / bhd + ukd breaks the template's knee + pull / hip + push pairs (ORD-06, V11 / H06) and the 2-4-per-group rule; needs the coach's call (round-3 conflict noted in DECISIONS D-81). | - |
| R01-6 | major | Alternating staggered barbell deadlift classed as a non-axial second day | Fixed | tools/fixture/review-v12.mjs amendExercise: any barbell / hex-bar hinge (staggered, kickstand, alternating) is spine_class counted (R2-SES-02). | `R01-6` |
| R01-7 | major | Glutes 3.5, triceps 1.5, side delts 2.5 for a swimmer (credit-only) | Partly fixed | D-03 revised: glutes and side delts are targets for athletes (R2-VOL-06); arms stay credit-only for field athletes (D-07 revised, R3-VOL-01 pending). Glutes 4.25 -> 5.5 placed; the floor miss is named (warning.floor_schedule). | `R01-7` |
| R01-8 | major | Lats flat, VPULL 4 sets, rear delts cut for time while flies stay; prehab credits 0 | Partly fixed | Prehab credits by catalog (rear delts / face pulls count, R2-LIB-04); aquatic chest fly cut before pulls; pulls >= presses. Lats stay at 10 (start sized to 60 min, D-67); the 1 : 2.3 push : pull ratio is not enforced. | `R01-8` |
| R01-9 | major | Upright row and standing overhead press for a swimmer's shoulder | Fixed | select.mjs: profile injury hotspots act as default avoid / prefer tags without reported pain (SHOULDER_SWIMMER). | `R01-9` |
| R01-10 | major | Tests attached to different plyo exercises, rep-max tests written as "2 x" and supersetted | Fixed | week.mjs markTests: tests are their own TEST items (protocol per test), the same in week 1 and the last week; a tested lift never runs in a superset; the tested exercise is locked across blocks. | `R01-10` |
| R01-11 | minor | Placeholder names ("Calf Raise - any", empty "different implement" variations) | Fixed | select.mjs: library-first statuses, generic records only as swaps (a named repeat beats a placeholder); full kits take a real alternative at block changes. | `R01-11` |
| R01-12 | minor | Contradicting box heights; RC cues on ballistic jumps; "bar" on DB / KB lifts | Fixed | dose.mjs: one box height from the exercise record; stage cues by quality; implement-aware Olympic copy (effort.olympic_power_db / _kb). | `R01-12` |
| R01-13 | minor | Olympic rep rule inverted (barbell 4 x 8, KB squat clean 3-5) | Fixed | dose.mjs: the scheme follows implement + catch (DB / KB / pulls ramp, barbell catches 3-5), one ramp across the block. | `R01-13` |
| R01-14 | minor | Core all flexion; dynamic core dosed in seconds with RIR | Fixed | select.mjs: core picks follow the profile plane mix (sagittal + frontal / transverse); dose.mjs: holds in seconds with a form cue, dynamic core in reps. | `R01-14`, `R08-7` |
| R01-15 | minor | Sprint A-drills for a T0 swimmer; no thoracic / pec-minor mobility | Fixed | budget.mjs warmupMode: mobility prep for non-running sports and shoulder hotspots, A-drills for running sports, balance for court players. | `R01-15` |
| R01-16 | minor | MAX on a mid-session lateral raise | Fixed | dose.mjs / positionFor: MAX only on the day's last small-muscle item and only once the planned effort is 1-2 in the tank. | `R01-16` |
| R01-17 | minor | Hex-bar squat and hex-bar deadlift as the two axial lifts, both rep-max tested | Partly fixed | The plan now squats on the hex bar and deadlifts with a barbell (different implements, both still tested); there is no explicit rule forcing different implements. | - |
| R01-18 | minor | 20 throws a week, no transverse throw, no ankle block | Fixed | week.mjs ensureAthleticTracks / ensureThrowStation: throw station with a rotational pick and a low-amplitude ankle block; throws 36-40 and low contacts 50 against 35-45 / 51-69. | `R01-3` |
| R01-19 | minor | Pull-ups 12-15 at 3 RIR for a 145-lb 16-year-old | Fixed | dose.mjs capToHint: body-weight pull-ups 7-10 (or the assisted regression note), weighted pulls 5-8. | `R01-19` |
| R01-20 | minor | Accessory brackets zig-zag; degenerate 15-15 range | Partly fixed | Rep caps never produce a min = max range (capToHint widens to 3 reps); the accessory brackets in rules.reps still follow the coach's matrix per block (PRG-06 re-ordering left for the coach). | `R01-20` |

## 02-football - reviewer: coach-eye review (grade D)

| ID | Severity | Issue | Status | Fix made / reason deferred | Test |
|---|---|---|---|---|---|
| R02-1 | blocker | No stairway in weeks 1-9 (template minimum above the starts) | Fixed | D-67 capacity sizing + D-68 group-day reduction: main-day total 75 -> 95, every week climbs or holds by the 7 % cap. | `R02-1` |
| R02-2 | blocker | No loaded horizontal press for a linebacker; dip rep-max test | Fixed | select.mjs: athletes with a strength goal get a high-ceiling bench; constraint band no longer forces dips; tests relocate to a testable press. | `R02-2` |
| R02-3 | major | Max-velocity sprints / accelerations as an end-of-session buy-out | Fixed | Sprints sit in the athletic block before lifting; the buy-out is a conditioning finisher only (note.buyout) and the first room cut. | `R02-3` |
| R02-4 | major | Nordics 15, weighted pull-ups / dips 12-15, 16-contact depth drops | Fixed | dose.mjs: exercise rep hints cap the phase bracket (Nordic 5-8, weighted 5-8, body-weight pulls 7-10); per-leg contact caps. | `R01-19` |
| R02-5 | major | Athletic budget missed (COD 18 of 80, low contacts 0, throws 120 of 70) | Fixed | D-73: tracks ensured (COD, JLK, sprint, throw) and doses reconciled to the weekly targets; week 1 now COD 80 / 80, low contacts 50 / 60, sprint 240 / 300 m, throws 72 / 70. | `R02-5` |
| R02-6 | major | Baseline and end tests on different exercises; trained athlete tested "from zero" | Fixed | Tested lifts locked across blocks; same drill ids; from_zero = untrained only (rules.tests.from_zero_if, intake.mjs). | `R02-6` |
| R02-7 | major | Side delts 1.5, biceps 4, triceps 4.5, glutes 5-6, traps 0 (credit-only) | Partly fixed | Glutes and side delts targeted (D-03 revised); arms credit-only for field athletes (R3-VOL-01 pending); the floor misses are named (warning.floor_schedule: glutes, side delts). Traps are not targeted. | `R02-7` |
| R02-8 | major | All unilateral lower work sagittal (no frontal / transverse quota) | Partly fixed | select.mjs scores frontal / transverse unilateral picks for COD sports (side lateral lunge on Tuesday); no hard weekly quota yet. | - |
| R02-9 | major | Work lift gets fewer sets than its pair; added sets go to flies and calves | Fixed | volume.mjs: VOL-07 order with the work-lift guard (work >= any station of its group), compounds start at 3 at >= 60 min. | `R02-9` |
| R02-10 | major | RC3 "repeat" cue on single-effort depth drops; hurdles unused | Fixed | Landing drills RC1 only; RC2 / RC3 re-pick a repeatable drill (RC-stage re-picks in generate.mjs). | `R02-10` |
| R02-11 | major | Session times leave out aerobic blocks; Tue really 97-110 min | Fixed | week.mjs estimateMinutes counts add-on aerobic work; a full main day takes the session separately (aerobic_minutes per day in the plan). | `R02-11` |
| R02-12 | minor | Day titles promise lifts the day does not hold | Partly fixed | Client-facing titles drop coach jargon (plainDayLabel); titles are not yet rebuilt from the actual work picks after a laterality flip. | `R02-12` |
| R02-13 | minor | Contradictory box heights | Fixed | One height from the exercise record (see 01-12). | `R01-12` |
| R02-14 | minor | Second calf station note says 1 set but doses 2; calves supersetted with calves | Fixed | Calves = one exercise x 3 sets per leg day; the 1-set second station is the first cut; small isolations re-pair across groups (calves with a delt). | `R02-14` |
| R02-15 | minor | Bilateral overhead throw dosed "per side" | Fixed | dose.mjs throwDose: per side only for rotational / unilateral throws. | `R02-15` |
| R02-16 | minor | Same exercise twice a week in a category | Fixed | select.mjs: week-wide second exposure for isolation / Focus slots. | - |
| R02-17 | minor | Plyo share printed from the target | Fixed | render.mjs prints the planned share (plyo / all jump + throw work). | `R02-17` |
| R02-18 | minor | Implement-not-stated / "any" records as defaults | Fixed | Generic records are swaps only (see 01-11). | `R01-11` |
| R02-19 | minor | Olympic lifts never move; pulls 3 sets instead of 4 x 8 -> 4 x 4 | Partly fixed | Olympic sets follow the budget (2-4 a station, low -> high across the block); barbell catches keep 3-5 reps; the 4 x 8 -> 4 x 4 ramp runs once across the block for DB / KB / pull variants. | `R02-19` |

## 03-soccer - reviewer: coach-eye review (grade D)

| ID | Severity | Issue | Status | Fix made / reason deferred | Test |
|---|---|---|---|---|---|
| R03-1 | blocker | COD 6-12 cuts vs 120-160, sprinting 0 m vs 400-600 m | Fixed | D-73 athletic tracks + reconcile: COD 96 / 120 cuts and 240 -> 400 m of sprints a week, max-velocity work weekly. | `R03-1` |
| R03-2 | major | Six weeks of landing-only depth drops; plyo share printed from the target | Fixed | Landings RC1 only, repeated / reactive picks from RC2; planned share printed. | `R03-2`, `R02-17` |
| R03-3 | major | Lower-body share 43 % bilateral vs the 20 % -> 10 % target | Deferred | The laterality dial keeps the counted squat / deadlift bilateral, so a 3-day field plan cannot go below ~45 % bilateral; V28 now warns (0.52 vs 0.2). Needs the stance-swap work (see 06-7). | - |
| R03-4 | major | VOL1 12-15 reps for the whole off-season; VOL2 skipped | Partly fixed | Work lifts now take the heavier preference bracket (front squat 7-10, deadlift 7-10); the season-phase rep mapping (OFF_LATE -> VOL2/3) in shape.mjs is not done. | - |
| R03-5 | major | 14 Olympic / ballistic sets over 3 exposures vs the 2-6 budget | Fixed | Olympic exposures trimmed to the profile (2) and sets from the budget (4-6 a week); one ramp across the block. | `R03-5` |
| R03-6 | major | Mon 82 min, Friday 98-118 min with the Orange add-on | Partly fixed | Add-ons count as time and move to a separate session when the day is full; Monday still runs 81-84 min for the 75 picked and carries warning.long_day. | `R03-6` |
| R03-7 | major | Barbell deadlift variant on the non-axial hinge day; bent-over barbell rows on spine days | Fixed | Barbell hinges count as spine days (R2-SES-02); the non-axial day draws DB / KB hinges (double-KB deadlift); a bent-over barbell row next to the day's axial lift is penalised. | `R01-6`, `R06-8` |
| R03-8 | major | Upper body progresses faster than legs; 4 chest-fly sets; Focus quads on Saturday | Fixed | Main-day stairway with priority tiers (floored big muscles first): quads 10 -> 12, hamstrings 10 -> 13.25, chest 10 -> 12, back 10 -> 11; glutes targeted; Focus no longer carries stairway sets. | `R01-1` |
| R03-9 | major | Baseline test names no drill; from_zero for a 2-year athlete | Fixed | TEST items with protocols; same drill both weeks; from_zero = untrained only. | `R01-10`, `R02-6` |
| R03-10 | minor | Pre-season: 12 of 16 lifts drop to 1 set, Olympic keeps all 14 | Fixed | D-37 revised: about 60 %, work and paired lifts keep 2 sets, Focus / second calf / duplicate isolations go first, Olympic x the profile TE factor. | `R03-10` |
| R03-11 | minor | Contradicting box heights; box notes on plate hops | Fixed | One height from the exercise record; box notes only on box drills. | `R01-12` |
| R03-12 | minor | Near-duplicate exercises supersetted to meet 2-4 per group | Partly fixed | Second-of-group variety scoring (pattern / implement / grip) and no same-group supersets; stem stripping of "alternating / single-arm" names is not done. | - |
| R03-13 | minor | Superset partners with unequal set counts | Deferred | Needs a superset-aware placement step in volume.mjs (give the partner a matching set or render the extra set straight); not done. | - |
| R03-14 | minor | Spanish wording (jalón for pulls, pájaros, swing copy) | Deferred | Spanish strings stay PROPOSED for the coach's review (D-64); the KB swing copy no longer says "bar" (implement-aware copy). | - |
| R03-15 | minor | Core dosed in seconds with RIR; Nordics / Copenhagen under-dosed | Partly fixed | Holds in seconds, dynamic core in reps; Copenhagen 10-30 s; the soccer Nordic 2 x / Copenhagen 3 x weekly prehab rule is not mapped. | `R01-14` |
| R03-16 | minor | Practice days never placed (about 9 sessions a week) | Deferred | Needs intake/2 practice weekdays (contract change); not in Phase 0 scope. | - |
| R03-17 | minor | Weekly totals move in lumps (+8.1 % in week 4) | Fixed | Placed total rise <= 7 % with staggered releases (max rise 6.2 %). | `R01-2` |

## 04-crossfit-style-bootcamp - reviewer: coach-eye review (grade D)

| ID | Severity | Issue | Status | Fix made / reason deferred | Test |
|---|---|---|---|---|---|
| R04-1 | blocker | Back 4, quads 5, hamstrings 5, calves 6 on 4 x 60 min; floor warning claims the schedule cannot fit | Partly fixed | Cut order for the class model: skill folds into the warm-up, the WOD holds 10 -> 15 min, then groups (D-78); the pull partners stay (keep_work_pair): back 9 -> 10. The 60-min class still cannot hold 10 sets for every muscle; the misses and the offer (one more day) are named up front. | `R04-1` |
| R04-2 | blocker | No set stairway at all (42 flat) | Partly fixed | D-67 sizing: 44 -> 46 main sets; WOD minutes and class levels carry most of the climb. A real set climb needs more minutes (offer shown). | `R04-1` |
| R04-3 | major | Two push days and one pull day | Fixed | Template amendment (review-v12 amendTemplates): DEADLIFT day gets its push partner, Friday becomes CLEAN + PULL; V29 checks pull >= 0.8 x push. | `R04-3` |
| R04-4 | major | Generic 10-15 reps; HALF TIME class levels ignored; hypertrophy rest on work lifts | Fixed | rules.reps.class_levels (strength 7/6/5/4, power, resistance) read by dose.mjs for hybrid_crossfit; strength rest (or rest after the pair) for work lifts; body-weight pulls capped. | `R04-4` |
| R04-5 | major | Alternating DB press as the work; DB floor press tested | Fixed | Work lifts prefer bilateral canonical barbell lifts in the kit (seated barbell press on Tuesday); tests stay on the locked work lift. | `R07-6` |
| R04-6 | major | Pulls only, 12 Olympic sets vs budget 5; clean on the hinge day | Fixed | Clean on the squat day, snatch on the deadlift day; class power table 3 sets; exposures trimmed to the budget (6 sets a week). | `R04-6` |
| R04-7 | major | Days 69-79 min; WOD midpoint and add-ons not counted; skill as a separate block | Fixed | WOD minutes from the dose, add-ons counted (the Green session moved to the WOD day), skill folded into the warm-up on over-time days. | `R04-1` |
| R04-8 | major | Time spent on duplicate rear-delt / chest isolations while back is cut | Partly fixed | Duplicate isolations and the second calf go before groups; back keeps its pair. Floors still missed on 60-min days (named). | - |
| R04-9 | major | Cardio test after a strength test and a WOD; protocols differ | Fixed | The cardio test sits on the aerobic day with the same protocol at both ends. | `R04-9` |
| R04-10 | major | WODs without reps / loads, EMOM stations that cannot fit | Fixed | dose.mjs WOD builder: reps or calories per station by format and level, rotation across the week, ball <= 20 lb. | `R04-10` |
| R04-11 | major | Validators green on a plan the coach would not sign | Fixed | H21 stairway_flat / total_flat / circuit_flat, V27 athletic budget, V29 push : pull, V28 share (warn), long-day check with the real minutes. | `R04-11` |
| R04-12 | minor | "Calf Raise - any", flat DB fly twice, dips note ignored | Partly fixed | Generic records are swaps only; week-wide uniqueness for isolations; station note tokens (dips / push-up) score the pick only where the template note matches. | `R01-11` |
| R04-13 | minor | Skill picks repeat the core block; DUBS / GYMNASTICS notes ignored | Deferred | Skill selection by station note and excluding the day's core picks is not done. | - |
| R04-14 | minor | Phase labels say "bigger steps" while sets hold | Deferred | Phase labels still come from the stair table; render does not yet suppress them on hold weeks. | - |
| R04-15 | minor | Biceps 1, triceps 2.5 shown as bare numbers | Fixed | Class-model and stay-active plans target every muscle (biceps 4.25 -> 4.5) and name the floor misses. | - |
| R04-16 | minor | Two aerobic sessions, no Blue; beginner run-walk for a 2-year CrossFitter | Deferred | D14 for crossfit_class still gives 2 sessions; level-based aerobic variants not done. | - |
| R04-17 | minor | [VIDEO_CONTACT] placeholder; 1-RIR header vs 3-RIR weeks; weight tip on a body-weight lift | Fixed | video.note resolved (@BLAZECAMP on Instagram), assertModel fails any [PLACEHOLDER]; the planned-effort drift line under the Basic Instruction; the week-1 tip skips tests. | `R04-17`, `R07-17` |

## 05-bootcamp - reviewer: coach-eye review (grade D)

| ID | Severity | Issue | Status | Fix made / reason deferred | Test |
|---|---|---|---|---|---|
| R05-1 | blocker | No stairway: 84 sets flat, work seconds jump in 5-s lumps | Fixed | D-19 revised (D-72): work seconds climb by the planned steps, lambda-scaled to the top, in 1-s steps - 35 36 37 38 40 42 44 46 s; H21 circuit_flat / circuit_step_over_ceiling. | `R05-1` |
| R05-2 | blocker | Six muscles below 10 sets, floor exemption hides it | Partly fixed | Circuits are no longer floor exempt (floored list, V22 / H17 apply); the misses are named with the offer of a 4th day. Stations are not yet re-assigned to under-floor muscles. | `R05-2` |
| R05-3 | major | Session length ignores the work-time progression and the rest between circuits | Fixed | estimateMinutes takes the week's work seconds and adds 1 min between circuits; warning.long_day per weekday. | `R05-3` |
| R05-4 | major | 18 calf sets a week (two calf stations x 3 rounds) | Partly fixed | The bootcamp cut order removes the second calf station first (9 calf sets a week now); calf station 2 as a 1-round station is not modelled. | - |
| R05-5 | major | "Bent-Over Barbell Row" in a kit without a barbell | Fixed | amendExercise: a record named barbell requires the barbell token. | `R05-5` |
| R05-6 | major | Unloaded box squat vs advanced sissy squat / row | Partly fixed | Implement ladder by level (goblet / high-zercher DB squat now); assisted / home-substitute penalties. Sissy squat can still fill the second quad station in block 1. | - |
| R05-7 | major | Block 2 announced but nothing changes in the circuits | Fixed | Circuit stations take part in the block change (goblet squat -> high-zercher DB squat in block 2); a Nordic never fills a timed station. | `R05-7`, `R05-16` |
| R05-8 | major | Metabolic station cut while second calf / biceps stay; no ballistic or athletic work | Partly fixed | Cut order protects one metabolic station a day and cuts the second calf / duplicate isolations first. No ballistic medball / KB station is added for the general-population profile. | `R05-8` |
| R05-9 | major | Rear delts 3 own sets shown as 6 through helper credit | Deferred | Own-sets muscles are compared on direct sets in the stairway, but the circuit plan has no room for a second rear-delt station; deferred with the circuit station re-assignment. | - |
| R05-10 | minor | Weekly table shows no progression; work seconds missing | Partly fixed | Each week says what changed (work seconds, changes.circuit_longer); the macro table still shows sets, not rounds x seconds. | - |
| R05-11 | minor | Week-8 header: "replaces top sets" for a body test; MYO note with no MYO | Deferred | Test-week copy by test type and an intensifier note only when an item carries one are not done. | - |
| R05-12 | minor | Same row / calf raise on two days | Partly fixed | Week-wide second exposure for isolation slots; with this kit the table row still fills two pull slots (VPULL gap, see 05-13). | - |
| R05-13 | minor | No vertical pull (rows in both VPULL slots) | Deferred | A DB pullover as the VPULL substitute for no-bar kits is not tagged yet. | - |
| R05-14 | minor | Two posterior-chain stations back to back | Deferred | Circuit interleaving by region is not done. | - |
| R05-15 | minor | Unilateral holds without "per side"; long Copenhagen; RIR on holds | Partly fixed | Copenhagen 10-30 s and a hold cue instead of RIR; the side plank still prints 20-60 s without "per side". | `R01-14` |
| R05-16 | minor | Same cue on every station | Fixed | Effort key by station kind (effort.circuit_resistance / effort.circuit_metabolic). | - |
| R05-17 | minor | Warm-up is cardio only | Fixed | ensureWarmupPrep: every main day gets cardio + drills or mobility (ORD-08). | `R05-17` |
| R05-18 | minor | Raw tokens (pullup_bar), [VIDEO_CONTACT], "1 years", ES label / wording | Partly fixed | Equipment tokens by name (equipment.token.*), placeholder resolved and checked, BC3 label; the "1 years" plural and "lagartija" wording are left for the coach's ES review. | `R05-18`, `R04-17` |
| R05-19 | minor | "Calf Raise - any" and a reference-only record as main picks | Fixed | Program-only / reference-only records are swaps whenever a library record passes. | `R01-11` |
| R05-20 | minor | Share labelled "sport" for a general-population client | Deferred | intake.mjs D10 still keys the share on the generic profile row; the numbers match (50 / 50). | - |

## 06-full-body-aesthetics - reviewer: coach-eye review (grade D)

| ID | Severity | Issue | Status | Fix made / reason deferred | Test |
|---|---|---|---|---|---|
| R06-1 | blocker | The plan does not climb (162 sets, +3 %); holds without check-ins | Fixed | D-67: the stairway is sized to 4 x 75 min first; non-priority duplicate isolation groups leave a day for the priorities; main total 89 -> 99, side delts (priority) 11 -> 18; no "hold" without a check-in (load_up). | `R06-1` |
| R06-2 | major | Every day over 75 min; aerobic add-ons outside the estimate | Fixed | Add-ons counted (separate sessions when the day is full); days 70-82 min (limit 82.5). | `R06-1` |
| R06-3 | major | Optional days became 80-min training days with 9 Focus slots | Fixed | Optional days hold their template's 2 Focus slots; target / floor / priority sets go to main days first. | `R06-3` |
| R06-4 | major | Posterior chain 5 days in a row; same exercise on back-to-back days | Partly fixed | Week-wide uniqueness for Focus / bonus picks; optional days keep 2 Focus slots. Muscle spacing around optional days is not checked. | - |
| R06-5 | major | Nordic curls 15-20 reps, also as a Focus | Fixed | Nordic never a Focus / circuit filler; rep hint caps it at 5-8. | `R06-5` |
| R06-6 | major | Work lift gets the fewest sets | Fixed | VOL-07 work-lift guard; compounds start at 3. | `R02-9` |
| R06-7 | major | Bilateral share never moves toward bilateral (stance swap) | Deferred | D10 now picks the bb_pl row (0.5 / 0.8 / 0.9) but the stance swap at exercise-block boundaries is not implemented; V28 warns (0.58 vs 0.9). | - |
| R06-8 | major | Kickstand barbell deadlift on the non-axial hinge day | Fixed | Counted spine class for barbell hinge variants; the non-axial day draws DB / KB / machine hinges. | `R06-8` |
| R06-9 | major | 10 x 10 m sprints with no running space; reference-only aerobic item | Partly fixed | Reference-only items are swaps; distance sprints are avoided without running space. The Blue session is still a run / walk interval with "any cardio tool" copy rather than an erg-specific item. | `R06-9` |
| R06-10 | major | MAX on the first item of the day and in 3-RIR weeks | Fixed | MAX only on the last small item and only at planned RIR <= 2. | `R01-16` |
| R06-11 | major | Zercher squat supersetted with a bent-over barbell row | Fixed | select.mjs penalises a bent-over barbell row next to the day's axial work lift. | `R06-11` |
| R06-12 | minor | Calves split into 2 + 1 sets and supersetted | Fixed | One calf exercise x 3 sets per leg day. | `R02-14` |
| R06-13 | minor | Non-competitive client labelled competitive NPC | Fixed | render.mjs uses profile.<id>.name_recreational for non-competitive clients ("Muscle & physique"). | `R06-13` |
| R06-14 | minor | L3 cut-off PROPOSED; L3 starts saturate 4 x 75 | Partly fixed | L3 stays flagged (D-01, round 3); the capacity sizing now steps the start down to what the minutes hold and says so (warning.start_lowered, offers). | `R06-1` |
| R06-15 | minor | Standing alternating cable press as the lead chest lift | Partly fixed | Block changes never lower the load ceiling of a station; the lead press is still alternating in some blocks. | - |
| R06-16 | minor | Mixed effort messages; RIR on timed holds | Fixed | Planned-effort drift line; holds use a form cue. | `R04-17` |

## 07-push-pull-legs - reviewer: coach-eye review (grade D)

| ID | Severity | Issue | Status | Fix made / reason deferred | Test |
|---|---|---|---|---|---|
| R07-1 | blocker | No stairway in sets (+4.3 % over 12 weeks) | Fixed | D-67 sizing: 102 -> 118 main sets (+16 %), every muscle climbs in the second half or sits at its week-12 target; H21 stairway_flat guards it. | `R07-1` |
| R07-2 | blocker | Chest (priority) frozen at 21 vs 26 -> 30 | Fixed | Priorities that cannot reach their peak start lower and climb first (priority-first probe): chest 16.5 -> 21.5; the start change is named (warning.start_lowered, offer.lower_start). | `R07-1` |
| R07-3 | major | Warnings only after week 12 | Fixed | render.mjs noticesSection: warnings and schedule offers right after the header. | `R07-3` |
| R07-4 | major | Calves 9 (< floor 10) while Focus slots keep 3 sets | Partly fixed | Calves are named in warning.floor_schedule; one calf exercise x 3 per leg day; Focus is cut before calves on over-time days. Calves stay at 6 placed on 2 leg days. | - |
| R07-5 | major | Days 82 min for 75; add-ons outside the estimate (real days ~140 min) | Fixed | Days 63-75 min; add-ons are separate sessions on full days and counted otherwise. | - |
| R07-6 | major | Unilateral / alternating lifts as the work, bilateral barbell lift second | Fixed | select.mjs work_bilateral_canonical for physique / strength clients: barbell bench, row, squat, RDL as the work. | `R07-6` |
| R07-7 | major | Heavy preference shift lands on unilateral lifts; barbell -> machine at block changes | Fixed | The work is bilateral now; block changes never move a barbell main lift to a machine or lower its load ceiling. | `R07-6` |
| R07-8 | major | Share profile "sport" instead of bb_pl; share never moves | Partly fixed | D10 picks the bb_pl row (0.5 / 0.8 / 0.9); the stance swap is not implemented (V28 warns). | - |
| R07-9 | major | Tests and heavy work with hypertrophy rest | Fixed | Strength rest (180-360 s) for tests and heavy work lifts. | `R07-9` |
| R07-10 | major | Front squat (work) gets the fewest sets | Fixed | Work-lift guard (VOL-07). | `R02-9` |
| R07-11 | major | Barbell hinge twice a week (kickstand / alternating barbell deadlifts) | Fixed | Counted spine class for barbell hinge variants (H07). | `R01-6` |
| R07-12 | major | Nordic 15-20 reps | Fixed | Rep hint 5-8; never a Focus / high-rep filler. | `R06-5` |
| R07-13 | major | Assisted dips for a 4-year lifter; weighted -> assisted at block 2 | Fixed | Assisted records penalised for trained lifters; a block change never moves to an assisted version (noAssist). | `R07-13` |
| R07-14 | minor | Delivered rises +8.1 % / +8.2 % on small muscles | Fixed | Placed per-muscle rise <= max(1 set, 7 %). | `R01-2` |
| R07-15 | minor | MAX on 4-6 small exercises from week 1 | Fixed | MAX only at planned RIR <= 2 and on the last small item. | `R07-15` |
| R07-16 | minor | Calf note says 1 set but doses 2 | Fixed | One calf exercise x 3 sets per leg day; the 1-set second station note matches its dose. | `R02-14` |
| R07-17 | minor | Rep-max test item also carries the week-1 "pick a weight" tip | Fixed | dose.mjs suppresses the week-1 tip on test items. | `R07-17` |
| R07-18 | minor | 24 ab sets a week (over the L3 cap of 20) | Deferred | The core opener stays 2 x 2 on each of 6 days (core supersets save time, not sets); an abs cap on 5-6-day splits is not applied. | - |
| R07-19 | minor | Home substitutes (floor Y/T, prone DB curl) in a full gym | Fixed | Catalog tag home_substitute + select penalty when the gym holds the machine. | - |
| R07-20 | minor | Hip thrust twice a week; bent-over row = barbell row | Fixed | Week-wide uniqueness for Focus / bonus fills; implement-not-stated records are swaps only. | `R01-11` |
| R07-21 | minor | Near-duplicate lat pulldowns / cable raises back to back | Partly fixed | Second-of-group variety scoring (pattern / implement / grip); exact-stem stripping is not done. | - |
| R07-22 | minor | Competitive NPC label for a non-competitor | Fixed | Recreational profile name for non-competitive clients. | `R06-13` |
| R07-23 | minor | Hardest weeks and max tests on Christmas / New Year | Deferred | Holiday notices need a calendar rule (shape.mjs); not done. | - |
| R07-24 | minor | 1 triceps isolation per push day; split days checked against 2 per group | Deferred | V23 still checks split days against the full-body lower bound; the 3-4-per-group split rule needs the coach (R3-SES-01). | - |
| R07-25 | minor | Intensifier flag on heavy compounds in week 12 | Fixed | rirEffort never sets the intensifier on never-to-failure rep classes. | `R07-25` |
| R07-26 | minor | "2 Mile Run" item prescribed as 30-40 min | Deferred | Aerobic items still render the library name next to the colour and minutes. | - |

## 08-pickleball-genpop - reviewer: coach-eye review (grade D)

| ID | Severity | Issue | Status | Fix made / reason deferred | Test |
|---|---|---|---|---|---|
| R08-1 | blocker | Mon ~81 / Thu ~77 min for 2 x 45 (16 items) | Fixed | Stay-active cut chain (one athletic piece a day keeping the throw, one light Olympic piece, arm care to the optional day, knee / Achilles care kept), the core pair alternates, work starts at 2 sets under 60 min: Mon 50, Thu 43-49 min; offers (3 days) shown up front. | `R08-1` |
| R08-2 | blocker | Main-day sets never move (2 2 2 2 ...); no stairway | Partly fixed | Isolations enter at 1 set when the minutes leave no room (VOL-07) and climb: main total 20 -> 23, leg curl / leg extension / calves climb. The big lifts stay at 2 sets inside 45 min (named: warning.stairway_time, offer of a 3rd day). | `R08-2` |
| R08-3 | blocker | Glutes 2, side delts 0.5, biceps / triceps ~1-2 for a stay-active client | Partly fixed | Stay-active muscles are targets (floor 10, D-07 revised) and the floor misses are named up front; with 2 x 45 min the main days still place glutes ~1 and side delts / arms only on the optional day. | `R08-3` |
| R08-4 | blocker | Zercher squat and deep lateral lunge labelled "protect your knee" | Fixed | deep_knee_flexion tagged on deep squats / lunges / drops (D-70); knee pain picks step-ups / machines. | `R08-4` |
| R08-5 | blocker | Single-leg / weighted depth drops for a 52-year-old with knee pain | Fixed | No depth drops for the 50-59 racket overlay or knee pain; landings RC1 only; low box jumps / ankle hops. | `R08-5` |
| R08-6 | major | Plyo contacts 6-8 x over budget; printed share is the target | Fixed | Contacts reconciled to the budget (V27); planned share printed. | `R08-6`, `R02-17` |
| R08-7 | major | 0 medball throws; core 100 % sagittal flexion | Fixed | Throw station kept on stay-active days (one athletic piece a day keeps the throw); core picks follow the plane mix (rotation / anti-rotation). | `R08-7` |
| R08-8 | major | Olympic 4 sets x 2 days on the strength ramp | Fixed | Stay-active policy: one light piece, 2 sets of 3-6 (2 x 3 in heavy-play weeks), no 4 x 8 ramp. | `R08-8` |
| R08-9 | major | Copenhagen plank as Achilles care; missing wrist / balance / soleus work | Fixed | Preferred joint-care lists per injury code (soleus calf raise, tibialis raise, Y/T arm care); knee / Achilles care each leg day (D-32). | `R08-9` |
| R08-10 | major | Knee pain pushed the share toward bilateral barbells | Partly fixed | Pain shift now toward single-leg work (share 0.1); the Thursday hinge is still an alternating barbell deadlift (split stance, counted spine day). | `R08-10` |
| R08-11 | major | Fly-heavy Focus and near-failure calves / hamstrings the day before two play days | Fixed | Optional-day Focus only for priority or small floor-lifted muscles; no lower-body or calf work < 48 h before play. | `R08-11` |
| R08-12 | minor | 10-15 reps for 12 weeks; 15-rep barbell deadlifts to 1 RIR | Fixed | Stay-active compounds 12-15 -> 8-12 from exercise block 2 (rules.reps.stay_active_compound_by_block). | `R08-12` |
| R08-13 | minor | Running A-drills and run intervals for a knee-pain player with no running space | Partly fixed | Balance / reactive-stepping warm-up for court players; the Orange session still names a run / walk interval (any cardio tool). | `R08-13` |
| R08-14 | minor | Joint-care Y/T and face pulls credit nothing; rear-delt shortfall reported | Fixed | Prehab credits by catalog (rules.prehab.credits by_catalog); shoulder care never a third rear-delt item on a day. | - |
| R08-15 | minor | Advanced renegade row for an L1; calf load drops in block 3; block table hides block 3 | Partly fixed | Block changes never lower the load ceiling or regress to an assisted version; level-band scoring of block-change candidates and a per-block column in the block table are not done. | - |
| R08-16 | minor | Header 1 RIR vs 3-RIR weeks; "a 8.0" / "a 11.0"; jargon in titles | Fixed | Effort-drift line, "Effort level this week: 8", plain day titles. | `R08-16`, `R02-12` |

## Random-corpus limits (tests run as `todo`, tests/invariants/invariants.test.mjs)

The stricter checks added in this round pass on all 8 samples, the 52 picker sports and the 26 activities except where listed; on the 300 seeded random intakes these remain:

- **V27** (2 of 378): wall-ball / sit-up throws are dosed at fixed reps, so a small weekly throw target can be exceeded (the per-week station trim does not resize fixed-rep throws).
- **H21** (9 of 378): a muscle whose only day sits at its per-session cap on 6-day crossfit / athletic templates stays flat although the peak probe sized room for it; in one plan (sport-45) a block change flips a hinge work slot to a glute bridge and the hamstring sets drop.
- **H10 / V15** (1 of 378): a 2 x 30 min plan adds a bonus slot and a set at an exercise-block boundary (+14 %).

