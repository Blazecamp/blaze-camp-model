# Judge 1: coach fidelity

Lens: would the plans feel like Lalo wrote them, and does every rule tier match his stated priorities?
Written 2026-10-10. Judged: `design_milp.md`, `design_two-stage.md`, `design_template-parametric.md`.
Only this file was written. Nothing outside `design/` was touched and no git command was run.

## 0. Verdict

| Design | Score (1-10) | One-line reason |
|---|---|---|
| **two-stage** | **8** | Its dosing numbers are the ones his own answers and worked examples give (days inside the chosen minutes, calves 3 per leg day, "19, 20, 21, 22", Monday then Thursday), and its tier order is the closest to R3-SES-02. Its default 2 x 45 plan is still hinge-only, which is the over-cutting failure. |
| template-parametric | 6.5 | The sessions look most like his sheets (day identity, pairs, the squat stays on the squat day), but the dosing defaults repeat three reviewed failures: days over from week 1, long flat runs then a jump above 7 %, and a proposed soft number (11 sets a session) used as a hard wall. |
| milp | 6 | The most exact answer to "who is trained" and the best decision table for the coach, but several of his rules sit at the wrong tier or are not in the model yet (laterality last, day pattern not a rule, athletic doses flat at capacity, joint care cut for a 50+ racket player, no third exercise). |

**Winner: two-stage**, on the condition that the day-pattern rule of template-parametric is grafted in before any plan is shown to the coach (section 5, graft 1). Without that graft its pickleball and swimmer plans would fail the next coach-eye review on the same blockers as before (R08-patterns, R01-press).

One conflict is not resolved by any design, and it decides the 2 x 45 plan more than the algorithm does (section 4).

## 1. What I checked

- Read in full: the three designs; `coach_answers_round3.md`; `coach_chat_statements.md`; `12_volume_algorithm_v1.md` sections 3.7-3.10 and the worked examples 5.1 and 5.5; `design/diagnosis.md` sections 0-1; the tier table, failure modes (FM-01 ... FM-15), conflicts (C-01 ... C-17) and open items of `design/rules_as_constraints.md`.
- Read in part: `coach_answers_round2.md` (R2-VOL-06 ... R2-SES-05, R2-PER-04/05); `samples/REVIEW_LOG.md` (fix round 2 tables and open items); `samples/RECHECK_v0.3.md` (swimming); `engine/DECISIONS.md` E-11, E-81, E-140 ... E-146; `model/rules.json` (`session.time_fit`, `long_day`, `volume.calves`, `per_session`, `stairway.limits`, `pattern_keep`).
- Reran the prototypes with output to a scratch folder: `two-stage/proto/explain.mjs` (identical to the saved output apart from a timing line), `sim_template-parametric/run.mjs all` (identical apart from milliseconds), `milp_proto/run_samples.mjs pickleball` (matches section 14.1 of the design). The MILP class and swimmer runs, the grids and the brute-force tests were not rerun; those numbers are taken from the documents.
- Not checked: solver speed, proofs and code quality beyond what bears on fidelity. Other judges hold those lenses.

## 2. The yardstick

"Coach fidelity" is scored against these sources, in authority order:

| # | Rule or priority | Source |
|---|---|---|
| a | When time is short: tell first and offer; keep the time and train fewer groups directly, big movers first; supersets; the stairway climbs, never flat. "Never squeeze 2-4 exercises per muscle into a day that can't hold them." Blocks can be switched off. | R3-SES-02 (RIGHT) |
| b | Floor 10 on a trained group; 2-4 exercises per group per day, "there's never one exercise"; calves one exercise x 3 sets per leg day | R2-VOL-06, R2-SES-05, R3-SES-01 |
| c | About 3 % a week to halfway, about 5 % after; each muscle reaches its ceiling in the last week; "the last four weeks 19, 20, 21, 22"; never more than 7 %; 2 -> 11 is how it feels, not the set count | R3-VOL-04, R2-VOL-01, R2-PER-04/05 |
| d | The back set goes to Monday this time, Thursday the next; a bonus exercise on the optional day, never as the only exercise of its muscle | R3-VOL-03 |
| e | Hip + push, knee + pull; power before strength; horizontal before vertical; squat and deadlift on different days | round 1, R2-SES-01 |
| f | "The volume between unilateral and bilateral is very important" | chat statements |
| g | Athletic work is its own budget per sport and climbs with the block | R2-ATH, R3-ATH-01 ... 05 |
| h | Racket players 50+: calf and Achilles work every leg day, rotator-cuff work; joint-health work is "done no matter what" | R3-ATH-02, ORD-07 |
| i | "Very simple"; the plan is kicked out whole and the person adjusts | R3-VOL-04 |
| j | The reviewed failures the task names: flat stairways, trained groups under 10, days over the minutes, too many exercises, over-cutting (only hinges), athletic work off budget or not climbing | task brief, FM-01 ... FM-06 |

Where a design's default differs from another's only by a parameter the coach has not decided (fit factor, calves floor, tests), I scored the default, because the default is what the next review will read.

## 3. Scorecard

`yes` = holds by construction or by default. `part` = specified but not prototyped, or only with a non-default setting. `no` = the default plan breaks it.

| Rule | milp | two-stage | template-parametric |
|---|---|---|---|
| Trained group never under its floor (b) | yes | yes | yes (floor test is conservative on helper credit: a group that fits can be left out by up to one set) |
| 2-4 exercises per trained group per day (b) | yes | yes | yes |
| One-exercise "pattern stations" for untrained groups, default 2 x 45 | 3 a week | 1 a week | 3 a week |
| Calves 3 sets per leg day (b) | part: floor 7 (3 + 4) from the model's formula | yes: 6 -> 7, as in his example 5.5 | part: 7 -> 8 (4 + 4 at the peak) |
| Days inside the chosen minutes (a, j) | no: pickleball 46-49 of 45 from week 6; class Tuesday 61.5 of 60 every week and Monday to 63.4; swimmer 63 in weeks 9-12 | yes: 43.9 of 45, 58.5 and 59.9 of 60 | no: Monday 47.2 of 45 in all 12 weeks; class 62-64.5 of 60 from week 1; swimmer to 65 |
| Test days inside the limit (FM-10) | no (reported apart) | no (outside and printed) | yes (test replaces its station, room items skipped that day) |
| Stairway shape, 3 % then 5 % (c) | part: fewest flat weeks first; the curve is the fourth tie-break | yes: reproduces 15 -> 22 with "19, 20, 21, 22"; the last week always adds a set | part: landing first gives 7-9 flat weeks, then a jump |
| Weekly total never above 7 % (c) | part: 10 % hard, 7 % is the last tie-break | yes: 7 % hard on the weeks really placed | no: last-week rises of 7.9 %, 8.1 % and 8.3 % in the three samples |
| Each group reaches its top in the last week (c) | part: swimmer's back peaks in week 9 and holds through the hardest four weeks | part: third in the order; swimmer hips land in week 11 | yes by default, at the cost of the two rows above |
| "Never flat" as he meant it (2 -> 11 is level) (c) | part: effort drift mentioned | yes: defined as level + sets, a progress cue printed for every week | yes: progression card (set, reps, effort, load) |
| R3-VOL-03 placement (d) | part: evenness is a low tier; bonus exercises and optional day not in the model | yes: "Monday this time, Thursday the next" is the add sequence; extension exercises on "a day that already trains it" | yes for sets; optional-day bonus cells specified, not prototyped; twin days tied |
| Hip + push, knee + pull; a day keeps its pattern (e) | part: a work lift keeps its partner (row R6), but day pattern "is not a rule here": swimmer's knee + pull Monday has no knee lift, no squat all week | no: pickleball Monday becomes a second hinge day; swimmer has no squat and no press at all | yes: structural; the squat stays on the squat day, paired with the row |
| Bilateral : unilateral share (f) | no: lowest tier (L8); the solver may pick the cheaper two-leg variant to save minutes | part: fixed by the picks before the solve, then only measured | yes: a pre-pass sets each slot's laterality to hit the share |
| Athletic budget climbs with the stairway (g, FM-06) | no: doses sit flat at station capacity (pickleball throws 40 for 12 weeks, swimmer jumps 32); station sets not co-planned in the prototype | yes: one printed scale per key, climbs, never drops, lands on capacity; level ladder | yes: one printed scale, running maximum; Olympic sets flat at 6 |
| Joint care for a 50+ racket player (h) | no: moved to the optional day to make room | yes: one item a day, paired with the calf raise | yes: fixed block inside the rests |
| Exercise count by session length (j, FM-04) | part: only minimized at tier L6, no cap on full-body days | yes: hard cap (his count + 2), then fewest exercises | part: a third exercise opens only when two are full; no cap on full-body days |
| Over-cutting (j, FM-05) | part: patterns kept; but no third exercise, so chest (2-day) and quads (class) can never be trained | no at 2 x 45 by default (section 4); yes for one-day groups (extension exercises, 11 lifts to 14) | part: patterns kept; but 11 a session is a hard wall, so one-day groups can never be trained "at any length" |
| Tell first, offer, switches (a) | yes; the "why" is a list of rule ids and costs seconds to minutes | yes: minutes missing per group, the day that refuses, every offer and switch re-solved with what it buys | yes: plain texts, "more days fix it, longer sessions do not" |
| "Very simple" wording (i) | part | yes | yes |

Count of the six named failures that the default plans still show: two-stage 1 (over-cutting at 2 x 45), milp 3 (days over, athletic flat, early peaks), template-parametric 3 (days over, flat runs, hard-11 over-cut).

## 4. The conflict none of them resolves

A 45-minute day for this pickleball player holds about 23 minutes of lifting after the warm-up, core, one athletic piece and joint care. That is hips plus the pinned calves. Three things cannot all hold:

| Reading | What the plan looks like | Who defaults to it | Which reviewed failure returns |
|---|---|---|---|
| Keep 45 exactly | hinge, leg curl and calf raise on both days, one press | two-stage (and his own computed example, 12 section 5.5) | "left with only hinges"; the knee day is a second hinge day (R08-patterns, blocker) |
| Use the 10 % "a little longer day" for the squat, row and press at 2 sets each | knee + pull Monday, hip + push Thursday, 47-49 minutes | milp, template-parametric | days over the chosen minutes; three one-exercise groups against "there's never one exercise" |
| Switch off the core opener or the athletic piece | squat, row and press kept inside 45 | offered by two-stage as a re-solved switch | none, but it is the person's choice |

All three designs can produce all three plans; only the default differs. This is the first question for Lalo (open items O-02, O-03, O-04 of the inventory), and it should be asked with the three plans side by side. Two-stage's switch list already prints the third row, which is what he asked for in R3-SES-02 ("they should be able to turn off that day's athletic training or that day's core training").

## 5. Per-design reasons

### two-stage (8)

Matches his words:
- **Time.** When the person keeps their time the day limit is 100 %; the 10 % is kept for the full plan on full-body days, which is where he said it ("it might be a little longer day", R2-SES-05). No day of the three samples is over. Seconds per set come from the pick's own dose parameters, so the printed dose and the planned minutes are the same number (the diagnosis measured 51-54 minutes re-costed on a "45-minute" day).
- **Stairway.** The default order is: the last week adds a set, then closest to the 3 % / 5 % curve, then landing. His own line 15 -> 22 comes out with the last four weeks at 19, 20, 21, 22, and it is a golden test. The 7 % limit is checked on the weeks really placed.
- **Placement.** Hips go 5 / 5 to 6 / 6, Monday in week 4 and Thursday in week 12. When a day cannot take its turn the plan prints why.
- **Peaks.** Groups climb by relative progress from start to ceiling, so the swimmer's back (his first priority, 1.5 x chest) reaches 15 while hips reach 12. MILP ends back, hips and chest all at 12.
- **Calves, counts, athletic work, joint care**: see the scorecard.
- **What the person reads** is in his voice: what the time holds, minutes missing per group, offers, switches, supersets needed.
- **Tier order** follows R3-SES-02: hard rows including time, who is trained, kept movements, athletic level for competitive athletes, peaks, week 1, structure, stairway, fewest supersets.

Misses:
- **Day pattern is not protected.** Pickleball Monday (knee + pull) has no knee lift and no row. Swimmer Monday is three pulls and nothing else; Wednesday and Friday (hip + push) have no press; the swimmer does no squat and no pressing all week. These are the review's blocker R08-patterns and major R01-press.
- **Hard 100 % plus an exact search gives cliffs.** The class member's chest is refused "by about 1 minute" while Tuesday runs 50 of 60. A coach would shave a rest. The plan says it, but the plan is thin: one trained group at 4 x 60.
- **Tests sit outside the day limit** by default.
- **The "protected minimum" of athletic work (level 0) is a proposal that decides who is trained.** One joint-care item or two decides whether hips fit at all. The design says so; the coach has not.
- **Exercise cap is his count + 2** (11 at 75 minutes; he said 8-9).
- **Not prototyped:** Focus muscles, optional-day slots, the builder from `templates.json`, the athletic ladder beyond one step. Samples 06 and 07, where flat main days and too many exercises were found, were not run.

### template-parametric (6.5)

Matches his words:
- **The skeleton is his template and nothing else.** A short catalogue of edit rules, each with its source, is the only way an exercise is added or removed. Every day keeps its identity. A big mover that is not trained keeps its own work lift at 2 sets on its own day, paired with the day's partner: `[squat 2 | row 2]`, `[hinge 4 | press 2]`. This reads like his sheet.
- **Tests inside the day** with a swap rule, and a strength test only on a lift the plan trains.
- **Laterality set before the solve** to hit the profile's share.
- **Progression card, twin-day tying, "one more day is never worse", templates as a coach's rule pack.**

Misses:
- **Days over from week 1.** The band is spent on kept movements as well as minimums, so Monday is 47 minutes in every week of a 45-minute plan.
- **Stairway default.** Landing first leaves the pickleball total flat for seven weeks and jumps 24 -> 26 in the last (8.3 %); class 38 -> 41 (7.9 %); swimmer 37 -> 40 (8.1 %). The model's placed limit is 7 % (`stairway.limits.placed.total_pct`).
- **11 sets a session is treated as hard.** It is a proposed soft value (14 for Focus). The result is "quads and hips can never be trained on the class template at any length".
- **A kept 2-set movement outranks training a lower group fully.** The keep vector is FULL > PATTERN > NONE per group in keep order, so a quad station is preferred to back at its floor. His order is "train fewer muscles directly, big movers first".
- **Everything lands on floor + 2.** The L2 class member's back runs 10 -> 12; his level start is 12.
- **Frequency before peak height** can bring back "week 1 at the ceiling" (FM-07).
- **Least evidence on dosing**: 42 solves on three samples, no brute-force check, splits, twins, Focus and circuits not prototyped.

### milp (6)

Matches his words:
- **"One exact question per group" is literally his sentence** (keep a group only if every kept group still meets its minimums), and it is proven on 609 grid cells.
- **A work lift always keeps its upper partner** (row R6), found because the first run without it dropped the squat and the deadlift.
- **Kept movements rank below trained groups and below room cuts**, argued against the inventory's literal filing. This is the right reading of "big movers first".
- **The decision table D1-D10** shows the coach each open choice with the re-solved effect on the three samples. Nothing else in the three documents is as useful to put in front of him.
- **Week 1 is inside the chosen minutes** for the pickleball player and the swimmer (not for the class: Tuesday 61.5); the overrun is its own minimized tier.

Misses:
- **Days over the chosen minutes** in all three samples (fit 1.10 by default).
- **Day pattern "is not a rule here" (D10).** The swimmer's knee + pull Monday holds a single-leg RDL with a shoulder press; the hip + push Wednesday holds a split squat with a row; there is no squat in the week, and its test goes with it.
- **Laterality is the lowest tier**, so the share he calls "very important" is the first thing traded for minutes (FM-13 would return).
- **Athletic doses are flat at capacity** and station sets are not in the prototype model. This is the reviewed failure "held one total through the hardest weeks".
- **Joint care moves to the optional day** for a 52-year-old racket player with knee pain so that kept movements fit. The review called a cut cuff exercise a major ("done no matter what").
- **No third exercise** for a group with one day, although he said "from 2 all the way to 4". Chest on two days and quads in the class "can never be trained".
- **The swimmer's back peaks in week 9** and equals chest at 12.
- **No exercise cap on full-body days; Focus, optional day and bonus exercises outside the model.**
- **The "why" is a minimal conflict in rule ids** and costs 16 s to minutes. It is exact, and it is not his voice. Step 1 of his policy (tell first) depends on it arriving on time.

## 6. Grafts onto two-stage

From template-parametric:
1. **Day pattern as a rule (R-LEAD + A-PATTERN).** A big mover that is not trained keeps its own work lift at 2 sets on the day the template names for it, paired with that day's partner. Give this its own named band (`fit_factor_pattern`), separate from the limit for trained groups, so the coach can choose 45 exactly or 47 with the squat and the row without touching anything else. This removes R08-patterns and R01-press.
2. **Tests inside the day (R-TEST).** A timed test takes its station's place, that day's optional items are skipped, and a strength test sits only on a lift the plan trains.
3. **Laterality pre-pass.** Set each compound slot's laterality per exercise block to hit the profile and phase share before stage 1, and print the share reached.
4. **The edit-rule catalogue** as the coach-readable contract: the only ways an exercise enters or leaves, each with its source. Include the optional-day cells (bonus, Focus, calves) that count for the peak and never for the floor.
5. **Twin-day tying** on 4-6-day templates (A1 and A2 differ by at most one set, the earlier day takes the odd one).
6. **"One more day is never worse"**: the n-day plan is the better of the n-day template and the (n-1)-day plan plus an optional day.
7. **The progression card** (set, then reps, then effort, then load) in place of the shorter progress cue.
8. **A minimum length per template**, refused with the first length that fits (no 30- or 45-minute class plan).

From milp:
9. **Row R6**: an active lower work lift always keeps its upper partner, trained or as a 2-set station.
10. **The measured decision table** (D1-D10) as the format for the coach: each open choice, its default, and the re-solved plan under the other choice.
11. **Kept movements never force a cut of joint care or athletic work**: they take only the room that is left.
12. **Minimal conflict in rule ids, on demand**, as the coach's and developer's second "why" behind the minutes-missing text.
13. **Epochs from the dominance test** instead of reserved costs, so a physique plan whose first exercise block is the costliest (50 % single-leg) does not lose a peak set.
14. **The certified grid with a second solver in CI** (HiGHS as a dev-only check), so every "does not fit" the person reads was confirmed offline.

## 7. Conditions on the winner before it is built

- Ship graft 1 with it, and put the three 2 x 45 plans of section 4 in front of the coach.
- Get his answer on the athletic "protected minimum" per profile class (level 0), because it decides who is trained before any group is asked.
- Decide the exercise cap margin (his count, or his count + 2).
- Run samples 06 (aesthetics 4 x 75, Focus) and 07 (push / pull / legs 6 x 75, Focus) through the prototype. The flat main days and the 10-12 exercises a day were found there, and no design has shown those plans.
- Keep "tests outside the limit" only until graft 2 is in.
