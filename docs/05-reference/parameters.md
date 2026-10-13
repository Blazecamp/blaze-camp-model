# Parameters: every tunable number in the model

This page lists every number the Blaze Camp model uses to build a plan: how sets are counted, where a person starts, how a plan climbs to its final sets, how big a session is, how athletes are dosed and how the year is laid out. Each row gives the value, its unit, the file and JSON key where it lives, the source, and whether coach Lalo Vera confirmed it or the team proposed it. Use it to look up a number, to see who decided it, or to find the one place to change it. The coach said of the volume numbers: "this is all customizable" (R2-VOL-06). So every number here is a default that a coach may tune, except the hard rules. This page is at model v1.3: it includes round 4 and the two clarifications of 2026-10-10. Session minutes are no longer a parameter of the plan: they are an estimate, printed as information (section 10).

## How to read the tables

**Status.**

| Status | Meaning |
|---|---|
| **Confirmed** | The coach gave the number, or approved the team's number. The answer id is in the Source column. |
| **PROPOSED** | The team chose it. He has not confirmed it. It can change when he answers. |
| **INFERRED** | The team's reading of his sheets or answers. Treat it like PROPOSED. |
| **OBSERVED** | Read from his sheets. |
| **SCIENCE** | Taken from published research or a coaching reference. It fills a gap. It is not his number. |

A row can be split: "Confirmed range; PROPOSED value" means he gave a range and the team picked a point in it.

**Where it lives.** Keys are written with `>` between levels.

| Letter | File | What it is |
|---|---|---|
| **S** | [`generator_spec_v1.json`](../../generator_spec_v1.json) | The machine spec. The twin of the master document. Edit numbers here. |
| **V** | [`synthesis/12_volume_algorithm_v1.json`](../../synthesis/12_volume_algorithm_v1.json) | The volume algorithm (counting, starts, stairway, time). Kept in step with S. |
| **P** | [`synthesis/04_profiles.json`](../../synthesis/04_profiles.json) | One record per sport, position, activity and goal. |
| **T** | [`synthesis/05_templates.json`](../../synthesis/05_templates.json) | Week and day templates. |
| **R** | `model/rules.json` | The compiled rules the engine (version 0.5) reads. It is generated. Never edit it by hand. The numbers of round 4, CT-01 and CX-01..04 are cited from R on this page, because engine 0.5 was built and tested on those keys; [coverage_matrix_round4.md](../../coverage_matrix_round4.md) gives the matching S key for each answer. When R and a coach answer differ, the coach answer wins. |

**Answer ids.** `VOL-09` is round 1, `R2-…` round 2, `R3-…` round 3, `R4-…` round 4. `CT-01` and `CX-01..04` are two clarifications he gave on 2026-10-10. The newest answer wins: round 4 and CT-01 first, then CX. "conversation" means [coach_chat_statements.md](../../coach_chat_statements.md).

Terms are defined in the [glossary](glossary.md).

---

## 1. Counting sets (credit)

**Rule.** Count weekly hard sets. The main mover of a lift gets 1 set. Each helper muscle gets a quarter. Athletic work gets nothing.

**Why.** The team proposed half a set for helpers. He corrected it: "I would suggest a 0.25 to the helpers, not a 0.5" (VOL-09). On athletic work: "counting towards muscles is more for resistance patterns, not for athletic patterns" (VOL-10).

| Parameter | Value | Unit | Where it lives | Source | Status |
|---|---|---|---|---|---|
| Hard set: effort | 1 to 3 | reps in reserve | S `rule_tables > counting > hard_set`; R `effort > rir_band` | VOL-13 | Confirmed |
| Hard set: reps | 5 to 30 | reps | S `rule_tables > counting > hard_set` | conversation; VOL-11 | Confirmed |
| Main mover credit | 1.0 | sets per set | S `rule_tables > counting > credit_map`; V `counting > credit_map`; R `credit > classes` | VOL-09 | Confirmed |
| Helper credit | 0.25 | sets per set | same; R `credit > helper` | VOL-09 | Confirmed |
| Glutes on squats, lunges, deadlifts, RDLs | 0.25 | sets per set | `credit_map > BKD, UKD, BHD, UHD` | R2-VOL-05 | Confirmed |
| Adductors on squats and lunges | 0.25 | sets per set | `credit_map > BKD, UKD > adductors` | team | PROPOSED |
| Hip thrusts and bridges | glutes 1.0, hamstrings 0.25 | sets per set | `credit_map > GLUTE_ISO` | R2-VOL-05 (glutes); VOL-09 (helper rate) | Confirmed for glutes 1.0; hamstrings as the helper INFERRED |
| Leg curl / leg extension | hamstrings 1.0 / quads 1.0 | sets per set | `credit_map > LEG_FLEXION, LEG_EXTENSION` | CAT-09, VOL-09 | Confirmed |
| Horizontal push | chest 1.0; triceps 0.25; front delts 0.25 | sets per set | `credit_map > HPUSH` | VOL-09 | Confirmed |
| Vertical push | front delts 1.0; side delts 0.25; triceps 0.25 | sets per set | `credit_map > VPUSH` | VOL-09 (rate); helper list team | Confirmed rate; INFERRED helper list |
| Horizontal pull | back 1.0; biceps 0.25; rear delts 0.25 | sets per set | `credit_map > HPULL` | VOL-09 (rate); R3-VOL-01 ("the rear delts also get worked when you do back") | Confirmed rate; rear delts as a helper confirmed; biceps INFERRED |
| Vertical pull | back 1.0; biceps 0.25 | sets per set | `credit_map > VPULL` | VOL-09 (rate); helper list team | Confirmed rate; INFERRED helper list |
| Lat pull-over | back 1.0 only | sets per set | `credit_map > PULLOVER` | LIB-09 (he named the exercise: 'Pull under' is a lat pull-over) | Name confirmed; credit INFERRED |
| Dips | triceps 0.5 + chest 0.5 | sets per set | `credit_map > DIPS` | LIB-16 | Confirmed |
| Thruster | quads 1.0 + shoulders 0.5 + glutes 0.25 | sets per set | `credit_map > THRUSTER` | LIB-14, R2-VOL-05 | Confirmed |
| Face pull (cable or KB) | rear delts 1.0 + side delts 0.25 | sets per set | `credit_map > FACEPULL` | R2-LIB-04, LIB-10 (shoulder work) | Confirmed as shoulder work; the 1.0 / 0.25 split PROPOSED |
| Curls | biceps 1.0 (+ forearms 0.25) | sets per set | `credit_map > ISOLATION`; R `credit > classes > ISO_BICEPS` | VOL-09 | Confirmed; forearms INFERRED |
| Core exercise | abs and obliques 1.0 | sets per set | `credit_map > CORE` | CAT-08 (the core segments); the 1.0 follows the main-mover rule of VOL-09 | INFERRED |
| Athletic work (plyos, ballistics, throws, Olympic lifts, sprints, change of direction) | 0 | sets per set | `credit_map > ATHLETIC…`; S `rule_tables > athletic > never_counts_to_muscles` | VOL-10 | Confirmed |
| KB swings | 0 | sets per set | `credit_map > KB_SWING`; R `credit > never_credit_tags` | R2-VOL-05 | Confirmed |
| HYROX station circuits | 0 | sets per set | S `rule_tables > athletic > hyrox_station_circuits > muscle_sets` | R3-ATH-03 | Confirmed |
| One-side set written 10/10 | 1 | set | S `rule_tables > counting > unilateral` | UNI-01, UNI-07 | Confirmed |
| MYO set counts as | 2 | sets | S `rule_tables > counting > myo_set > value`; R `credit > myo_set_value` | team (VOL-15 says where it is allowed) | INFERRED |
| A set counts to a group at most | 1.0 | sets | S `rule_tables > weekly_sets > floors > group_credit`; V `counting > group_credit` | team, to make R3-VOL-01 work | PROPOSED |
| A second, research-style count shown beside the coach count | helpers 0.5; display only, it never steers the plan | sets per set | S `rule_tables > counting > dual_count` | team. He rejected 0.5 as the credit (VOL-09). | PROPOSED |

## 2. Client levels

**Rule.** A person's level sets where they start and how high they can go. It is separate from how hard an exercise is (CAT-06).

**Why.** "... a novice is somebody with less than a year of training experience ... A more intermediate athlete can be somebody that has consistently gone to the gym for over a year. If they take off for more than 6 months to a year, then we have to automatically treat them as a newby as far as their body" (PRG-05).

| Parameter | Value | Unit | Where it lives | Source | Status |
|---|---|---|---|---|---|
| Level 1 below | 1 | year of consistent training | S `vocab > levels > L1`; S `derived_values > D3_client_level`; R `levels > client > L1_below_years` | PRG-05 | Confirmed (the exact 12-month line INFERRED) |
| Level 2 from | 1 | year of consistent training | S `vocab > levels > L2` | PRG-05 | Confirmed |
| Level 3 from | 3 years and 4+ training days a week now, or a competitive physique or strength athlete | | S `vocab > levels > L3`; R `levels > client > L3_min_years, L3_min_days` | team | PROPOSED |
| Time off that sends the body back to Level 1 | 6 (to 12) | months | R `levels > client > layoff_months_body_L1` | PRG-05 | Confirmed |
| Former competitive athlete | Level 1 for a short first block | | S `inputs_schema > fields > F17 > level_rule` | PRG-05 | Confirmed (length of "a little bit of time" PROPOSED) |

## 3. Weekly sets: starts, ceilings, floor

**Rule.** Every trained group starts at a number set by level and climbs to a top number (ceiling) set by level, which it reaches in the last week. With 3 or more training days no trained group is below 10. With 2 training days every big muscle runs about 6 to 8 weekly sets.

**Why.** "I like that 15 to 20 sets of any muscle group per week would be a good foundation for maintenance to a little bit of growth, and then 20 to 25 sets maybe can be a good growth foundation" (UNI-01). "I don't think anybody needs less than 10 sets a week per muscle" (R2-VOL-06).

| Parameter | L1 | L2 | L3 | Unit | Where it lives | Source | Status |
|---|---|---|---|---|---|---|---|
| Start, big muscles (quads, hamstrings, glutes, chest, back) | 10 | 15 | 20 | sets / week | S `rule_tables > weekly_sets > muscles > <muscle> > start`; V `starting_table > muscles`; R `volume > start` | VOL-01 (10-12 / 15-20 / 20+) | Confirmed ranges; the engine uses the low end; L3 = 20 PROPOSED |
| Start, shoulders, biceps, triceps | 10 | 12 | 15 | sets / week | same | R2-VOL-04 (8 / 12 / 15), R2-VOL-06 (floor lifts 8 to 10), R3-VOL-01 (read on the shoulders group) | Confirmed for 12 and 15; Level 1 = 10 is his floor applied by the team (INFERRED) |
| Ceiling, every line | 14 | 22 | 25 | sets / week | S `… > muscles > <muscle> > cap`; R `volume > cap` | R2-VOL-06 | Confirmed for big muscles; applied to small muscles INFERRED ("the little muscles also grow the same idea") |
| Ceiling, abs and obliques | 16 | 20 | 20 | sets / week | S `… > muscles > abs_obliques > cap` | team | INFERRED |

| Parameter | Value | Unit | Where it lives | Source | Status |
|---|---|---|---|---|---|
| Floor for every trained focus group, 3 or more training days | 10 | sets / week | S `rule_tables > weekly_sets > floors > value`; V `starting_table > floors`; R `volume > floor > value`, `volume > floor > applies_from_days` (3) | R2-VOL-06; counted on groups R3-VOL-01, R3-SES-01; "from 3 days" follows R4-SES-03 | Confirmed |
| Every big muscle on 2 training days | about 6 to 8 (start 6, top 8) | sets / week | R `volume > two_day > weekly_sets` | R4-SES-03 | Confirmed range; 6 as the start and 8 as the top is the team's reading |
| Small groups on 2 training days | at most the same 6 to 8 | sets / week | R `volume > two_day` | team | PROPOSED |
| On 2 days the plan suggests | a third training day | days | R `volume > two_day > suggest_days` (3) | R4-SES-03 | Confirmed (a recommendation only) |
| Floor does not apply to | maintenance; pre-season; in-season; a group cut for pain; plans with 2 training days; credit-only groups of field athletes; a group its template cannot hold at 10 (the plan says so) | | S `… > floors > exempt`; R `volume > floor > exempt` | R3-VOL-01 proposal (his answer spoke only about rear delts), VOL-03, R4-SES-03, R4-SES-04 | INFERRED for the phases and for pain; Confirmed for 2 days. The round-3 exemption "a group the time check leaves to compound credit" is retired (CT-01). |
| Calves | 1 exercise × 3 | sets per leg day | S `… > muscles > calves > start`; R `volume > calves > per_leg_day` | VOL-17, R3-SES-01 | Confirmed |
| Calves, weekly top-up to | 10 | sets / week | S `… > floors > calves`; R `volume > calves > weekly_floor` | team | PROPOSED |
| Core opener | 2 exercises × 2 | sets per session | S `rule_tables > core_block > dose`; R `volume > core_block` | VOL-17, R2-SES-03 | Confirmed |
| Rear delts | at least 1 rear-delt exercise a week, 2+ sets, inside the shoulders group | | S `… > muscles > shoulders > content_rule` | R3-VOL-01 (not an individual muscle); VOL-17 (rear delts need their own sets) | Confirmed idea; "one exercise, 2+ sets, every week" PROPOSED |
| His landmarks: maintenance to some growth | 15 to 20 | sets / week | S `… > landmarks_coach` | UNI-01 | Confirmed |
| His landmarks: growth | 20 to 25 | sets / week | same | UNI-01 | Confirmed |
| His landmarks: too little / too much | 5 / 40 | sets / week | same | UNI-01 | Confirmed |
| What most people do | 20 to 30 | sets / week | S `… > landmarks_coach > most_people_20_30` | R2-VOL-06 ("you can do some research") | Confirmed as his view; checked against research, no number changed |
| Sets for one group in one session, soft limit | 11 | sets | S `rule_tables > session_limits > per_muscle_per_session` | research | SCIENCE / PROPOSED. The compiled rules of engine 0.5 no longer carry it (R `volume > per_session` is deleted): a group's sets are bounded by its template slots, at 2 to 5 sets an exercise. |
| Same, for a Focus muscle | 14 | sets | same | team | PROPOSED |

## 4. Focus muscles, the priority push and the Pro setting

**Rule.** A person may pick Focus muscle 1 and Focus muscle 2. Each gets a few extra sets every week. The other groups are not slowed down.

**Why.** "As much as everything else is balanced, the glutes should have an extra set or two or three ... There could be a main focus muscle 1 and a main focus muscle 2, and that should be enough for the whole thing" (R3-SES-01).

| Parameter | Value | Unit | Where it lives | Source | Status |
|---|---|---|---|---|---|
| Focus muscles, most | 2 | muscles | S `rule_tables > priority > v1_2_focus_muscles > max`; V `focus_muscles > max`; R `volume > focus > max` | R3-SES-01 | Confirmed |
| Extra sets per Focus muscle | 1 to 3 | sets / week | `… > extra_sets > range`; R `volume > focus > add_range` | R3-SES-01 | Confirmed |
| Extra sets, default | 2 | sets / week | `… > extra_sets > default`; R `volume > focus > add_default` | team | PROPOSED |
| Added to | start and ceiling | | `… > extra_sets > applies_to` | team reading of "throughout this program" | INFERRED |
| Ceiling of a Focus muscle | 18 / 26 (chest 26-28) / 30 | sets / week by level | `… > cap_bound`; R `volume > priority > cap` | R2-VOL-06 (priority caps) | Confirmed as priority-muscle ceilings; used for Focus muscles INFERRED |
| Focus exercise position | first in its session | | `… > order_in_session` | ORD-04 | Confirmed |
| Priority push (optional coach setting, off by default) | +4 / +4 / +6 | sets / week by level | S `rule_tables > priority > start_add`; V `priority > start_add` | VOL-02 (verdict: partly; the team proposed +4 to 6 and he answered "That's the idea") | Confirmed range; split by level PROPOSED |
| ~~While a priority push runs, other muscles grow at most 3 % a week~~ | retired | | S `rule_tables > priority > nonpriority_rate_cap` (deleted from R) | R2-VOL-06; retired by R3-VOL-04 and CX-01: every trained group reaches its final sets | Retired |
| Pro setting: who | Level 3 only, one muscle | | S `vocab > levels > Pro`; R `levels > pro_setting` | R2-VOL-06 ("maybe we can add a pro level") | Confirmed idea; rules PROPOSED |
| Pro setting: ceiling | 35 | sets / week | same | team | PROPOSED |

## 5. Goal, phase and population factors

**Rule.** The starting sets are multiplied by a factor for the goal or the season phase, rounded, and then the floor of 10 is applied to trained groups.

**Why.** "Different athletes need different things" (conversation): some need more resistance training, others more power through athletic patterns. Field athletes "don't need to get bigger and stronger that much" (UNI-02).

Where it lives: S `rule_tables > goal_phase_modifiers`; V `goal_phase_modifiers`; R `volume > modifiers` and `volume > phase_factors`.

| Situation | Lower body | Upper body | Small muscles | Source | Status |
|---|---|---|---|---|---|
| Aesthetics / bodybuilding | 1.0 | 1.0 | 1.0 | VOL-01, UNI-06 | Confirmed (this is the base table) |
| Strength / powerlifting | 1.0 | 1.0 | 0.75, then floor 10 | VOL-12 (weekly sets stay similar) | Small-muscle factor PROPOSED |
| General fitness, weekend-warrior athletic, stay athletic and active | 0.8 | 0.8 | 0.8, then floor 10 | UNI-09, ATH-13 | PROPOSED |
| HYROX | 0.8 | 0.8 | 0.8, then floor 10 | R3-ATH-03 (structure) | Structure confirmed; factor PROPOSED |
| Fat loss | 0.8 | 0.8 | 0.8, then floor 10 | ATH-07 | PROPOSED |
| Field or court athlete, off-season | 0.7 | 0.5, then floor 10 | arms and glutes from compound credit; shoulders at the floor | VOL-08, VOL-17, UNI-02 | PROPOSED |
| Competitive swimmer (dryland) | 0.7 | 0.5, then floor 10 | as field athletes | R3-ATH-01 (structure) | Structure confirmed; factors PROPOSED |
| Strength-type athlete, off-season (linemen, wrestlers, rugby, throwers, heavyweight fighters) | 0.9 | 0.8 | 0.6, then floor 10 | ATH-03 (who needs more resistance) | Factors PROPOSED |
| Athlete, pre-season | about 0.6 of off-season sets, flat, no floor | | | R2-PER-06 | Confirmed for about 60 %; "flat, no floor" INFERRED |
| Athlete, in-season | 0.4-0.5 | 0.3-0.4 | credit only | PER-08, UNI-10 (2 days, low volume) | Factors PROPOSED |
| Boxer or striker in high-punching weeks | pressing and arms × 0.5-0.7, never zero | | | ATH-04 ("bring the volume down ... but not completely cut it out") | Rule confirmed; factor PROPOSED |
| Rounding | half up, then the floor | | | team | PROPOSED |

Bootcamp is dosed by time, not by these factors (see section 15).

## 6. Pain declared at intake

**Rule.** A painful area gets less work, on safer equipment. Severe pain stops the automatic plan.

**Why.** The team proposed to cut that muscle or pattern 30-50 %, move it to machines or split grips, and keep it moving. He answered: "That's correct, and maybe even drop the exercise altogether if it's too much" (VOL-03).

| Parameter | Value | Unit | Where it lives | Source | Status |
|---|---|---|---|---|---|
| Start of the painful group or pattern | × 0.5 to 0.7 | factor | S `rule_tables > pain[0]`; V `pain`; R `volume > pain > start_factor_range` | VOL-03 | Confirmed |
| Value the engine uses | × 0.6 | factor | R `volume > pain > start_factor` | team | PROPOSED |
| Equipment for the painful area | constraint 4-5 machines, or split grips | constraint level | S `rule_tables > pain[0]`; R `volume > pain > constraint_bias` | VOL-03, EQ-03 | Confirmed |
| Ceiling of a pain-reduced group | start + 1 | sets / week | S `rule_tables > pain[0]` | team | PROPOSED |
| Floor of 10 on a pain-reduced group | does not apply | | S `rule_tables > weekly_sets > floors > exempt` | VOL-03 (the cut); the exemption was in the team's R3-VOL-01 proposal, and his answer spoke only about rear delts | INFERRED |
| Shift of the bilateral share toward the pain-free side | 20 | points | S `rule_tables > pain[4]`; R `bilateral_share > pain_shift` | UNI-02 (adjust for pain) | Rule confirmed; 20 PROPOSED |
| Pain severity that gives the health warning (built with the moderate pain rules; it no longer stops the plan) | severe | | S `validation_checks > V1_safety`; R `legal.health_flag.severe_pain` | team, reading R5-GEN-02 (before round 5: the refer route of R2-GEN-03) | PROPOSED |
| Printed guide: when an exercise hurts mid-plan | swap; then cut its sets by a third to a half; then drop it | | S `rule_tables > pain[1]`; S `rule_tables > rate_engine > self_adjust_guide` | UNI-08, VOL-03, R3-VOL-04 | The actions are his (swap or machine, cut, drop); their order and wording PROPOSED |

## 7. The stairway

**Rule.** Every plan climbs. Small steps to the halfway week, slightly bigger after it, the hardest weeks last. Each trained group reaches its planned final sets, with bigger steps when needed. A week may keep the same sets while reps or load progress. Nothing changes the plan after it is built, except the person's own edits.

**Why.** "It should be like steps up a stairway. In the beginning, the first 2, 3, 4 weeks, the steps are a little bit smaller, but they're gradually going up. When they get to that halfway point and upwards, the steps get a little bit higher, but not too much ... and that goes for every plan" (R2-PER-03). On the numbers he approved: "The program will just have its natural algorithm recommendation of growth throughout it" (R3-VOL-04).

### 7.1 Steps, arrival and the big-step note

| Parameter | Value | Unit | Where it lives | Source | Status |
|---|---|---|---|---|---|
| Usual step, week 2 to the halfway week | about 3 | % of the group's weekly sets | S `rule_tables > rate_engine > standard_steps > early_weeks_2_to_halfway`; V `stairway > math > standard_step`; R `stairway > standard_steps > early` | R3-VOL-04 | Confirmed |
| Usual step, after the halfway week | about 5 | % | `… > late_after_halfway`; R `stairway > standard_steps > late` | R3-VOL-04 | Confirmed |
| Halfway week | N ÷ 2, rounded up | week | S `rule_tables > rate_engine > math > halfway_week`; R `stairway > halfway` | R3-VOL-04 (approved wording: "until the halfway week"); rounding team | Confirmed idea; rounding PROPOSED |
| Each group reaches its planned final sets | yes, always | | R `stairway > progression > target_reached` (true) | CX-01 | Confirmed |
| When the usual steps fall short | every step of the group is scaled up by one factor | factor above 1 | R `stairway > progression`; `engine/progression/stairway.mjs` | CX-01; the formula is the team's | Confirmed choice; formula team math |
| When the usual steps would overshoot | every step is scaled down by one factor | factor below 1 | same | R3-VOL-04 | Confirmed |
| Week the final number arrives | the last week | week | R `stairway > progression > arrival_weeks_early` (0) | R4-PRG-01 | Confirmed |
| Earliest it may arrive | one week early | weeks | R `stairway > progression > arrival_weeks_early_max` (1) | R4-PRG-01 | Confirmed |
| Hard limit on a weekly step | none | | R `stairway > limits` (only a painful area keeps a slow step) | CX-01, R4-PRG-02 | Confirmed |
| A week carries a note when it adds more than | about 15 | % | R `stairway > progression > note_above` (0.15); `render > acceleration > above` | R4-PRG-02 | Confirmed |
| A single added set is flagged | never; the note needs 2 or more whole sets | sets | R `stairway > progression > note_min_whole_sets` (2) | team | PROPOSED |
| Same sets in consecutive weeks | allowed, while reps or load progress | | R `stairway > progression > flat_weeks_ok` (true) | CX-02, CX-03 | Confirmed |
| Step depends on | the person and the plan, never on muscle size | | S `rule_tables > rate_engine > principle` | VOL-05 | Confirmed |
| Sets are written as | whole sets | sets | S `rule_tables > banking`; R `stairway > progression > rounding` (`arrival`) | VOL-06 | Confirmed; the rounding method is the team's |
| The groups of a plan add their sets | in turns, so the week's total climbs a set or two most weeks | | R `stairway > progression > stagger` | team | PROPOSED |
| Start of a line | the larger of the table start (+ Focus) and its week-1 sets | sets / week | S `… > math > start` | team | PROPOSED |
| A painful area | slow steps | 3 % | R `stairway > limits > pain_after_freeze` | VOL-03; number team | PROPOSED |
| Does the stairway restart at an exercise-block change? | no | | S `rule_tables > set_placement > block_rule` | team reading of R2-PER-04, R2-VOL-07 | INFERRED |
| What can keep a group below its planned final sets | only its template: too few slots and no optional day. The plan says so. | | R `placement > bonus > no_optional_day` (`cap_and_say_so`) | R4-SES-04; mechanism team | Confirmed idea; mechanism PROPOSED |

**Retired in v1.3** (see section 22): the 7 % limit on one group's step, the under-10 % limit on the weekly total and its exceptions, the "one whole set may always be added" allowance, the coach-set step of 0 to 7 %, the rule that the scale factor never goes above 1, the "ceiling the time holds", and the least climb of 2 sets. The old open question (steps of 3 % and 5 % against "reaches its ceiling in the last week") is answered: the final sets win (CX-01).

**How reps and load progress** (R4-PRG-03):

| Parameter | Value | Where it lives | Source | Status |
|---|---|---|---|---|
| How rep and load progress is written | a rule the person applies: "When you hit 12 on every set with 1-2 reps left in the tank, add weight next time and start again at 8." | R `render > progression`; words `ui.plan.progress.double`, `ui.plan.progress_rule` | R4-PRG-03 | Confirmed |
| Promised reps or load for a given week | never | R `render > progression > promised_numbers` (false) | R4-PRG-03 | Confirmed |
| Reps in reserve named in the rule | the week's planned effort; "1-2" when none is planned | R `render > progression > rir_default` | R4-PRG-03; default team | Confirmed idea; default PROPOSED |
| Wording for fixed-rep lifts, pyramids and single-side lifts | matching rules | R `render > progression > keys` | team | PROPOSED |

### 7.2 By plan length

Where it lives: S `rule_tables > rate_engine > steps_by_plan_length`; V `stairway > steps_by_plan_length`; R `stairway > by_N`. Growth is what the usual steps multiply to. The stair level is the "2 to 11" shown to the person. The set rows below were recomputed on 2026-10-11 with the engine's arithmetic (`engine/progression/stairway.mjs`) for one group on its own; in a real plan the groups take turns, so a week can differ by one set.

| Weeks (N) | Halfway week | 3 % steps in weeks | 5 % steps in weeks | Growth if never scaled | Status |
|---|---|---|---|---|---|
| 4 | 2 | 2 | 3-4 | × 1.136 | Computed from confirmed steps |
| 6 | 3 | 2-3 | 4-6 | × 1.228 | same |
| 8 | 4 | 2-4 | 5-8 | × 1.328 | same |
| 10 | 5 | 2-5 | 6-10 | × 1.437 | same |
| 12 | 6 | 2-6 | 7-12 | × 1.554 | same |
| 16 | 8 | 2-8 | 9-16 | × 1.817 | same |

| Week of a 12-week plan | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | Status |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Stair level | 2 | 2.6 | 3.2 | 3.8 | 4.4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | "start at a 2 and end at an 11" confirmed (PER-01, R2-PER-05, R3-VOL-04); formula PROPOSED |
| Planned reps in reserve | 3 | 3 | 3 | 3 | 3 | 3 | 2 | 2 | 2 | 1-2 | 1-2 | 1 + intensifiers | Drift confirmed (R3-VOL-04); week mapping PROPOSED |
| L1 big muscle, 10 → 14 (scale 0.76) | 10 | 10 | 10 | 11 | 11 | 11 | 12 | 12 | 13 | 13 | 13 | 14 | Computed |
| L2 big muscle, 15 → 22 (scale 0.87) | 15 | 15 | 16 | 16 | 17 | 17 | 18 | 19 | 19 | 20 | 21 | 22 | Computed; matches the approved example, last four weeks 19, 20, 21, 22 (R3-VOL-04) |
| L3 big muscle, 20 → 25 (scale 0.50) | 20 | 20 | 21 | 21 | 21 | 22 | 22 | 23 | 23 | 24 | 24 | 25 | Computed |
| L2 shoulders or arms, 12 → 22 (scale 1.39: steps above the usual) | 12 | 12 | 13 | 14 | 14 | 15 | 16 | 17 | 18 | 19 | 21 | 22 | Computed; reaches the top of 22 (CX-01). No week needs the big-step note. |
| L2 Focus muscle +2, 17 → 24 (scale 0.78) | 17 | 17 | 18 | 18 | 19 | 19 | 20 | 21 | 21 | 22 | 23 | 24 | Computed with the PROPOSED +2 |
| A big muscle on 2 training days, 6 → 8 | 6 | 6 | 6 | 6 | 6 | 7 | 7 | 7 | 7 | 7 | 7 | 8 | Computed (R4-SES-03) |

| Week of an 8-week plan | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 |
|---|---|---|---|---|---|---|---|---|
| Stair level | 2 | 2.9 | 3.9 | 4.8 | 6.3 | 7.9 | 9.4 | 11 |
| Planned reps in reserve | 3 | 3 | 3 | 3 | 2 | 2 | 1-2 | 1 + intensifiers |
| L1 big muscle, 10 → 14 (scale 1.19) | 10 | 10 | 11 | 11 | 12 | 12 | 13 | 14 |
| L2 big muscle, 15 → 22 (scale 1.36) | 15 | 16 | 16 | 17 | 18 | 19 | 21 | 22 |
| L3 big muscle, 20 → 25 (scale 0.78) | 20 | 20 | 21 | 21 | 22 | 23 | 24 | 25 |

An 8-week block reaches the same final sets as a 12-week block, with bigger steps (CX-01). The spec's own curve tables are in S `rule_tables > rate_engine > planned_targets_by_level` and S `plan_types > fixed_12`, `fixed_8 > reference_curve_big_muscle`.

| Parameter | Value | Where it lives | Source | Status |
|---|---|---|---|---|
| Stair level formula | level = 2 + 9 × (steps climbed so far ÷ all steps), a late step counting 5/3 of an early one | S `rule_tables > rate_engine > start_at_2_end_at_11 > display_level` | R2-PER-05 (meaning) | PROPOSED |
| Effort from stair level | level ≤ 5: 3 RIR; ≤ 8: 2; below 11: 1-2; last week: 1 + intensifiers | S `… > start_at_2_end_at_11 > planned_effort`; R `effort > planned_map` | R3-VOL-04 (the drift) | Drift confirmed; cut-offs PROPOSED |
| Phase labels, 12 weeks | getting used to it: L1 weeks 1-4, L2 1-3, L3 1-2; hardest: weeks 9-12 | S `plan_types > fixed_12 > phases_by_level`; R `stairway > phases_by_N` | PER-01, R2-PER-04 ("the last 4 weeks are going to be brutal") | Last 4 weeks confirmed; other label weeks PROPOSED |
| Phase labels, 8 weeks | getting used to it: L1 1-3, L2 1-2, L3 1; hardest: 6-8 | S `plan_types > fixed_8 > phases_by_level` | team | PROPOSED |

### 7.3 The next block

| Parameter | Value | Unit | Where it lives | Source | Status |
|---|---|---|---|---|---|
| Start of the next block after a completed block | about 5 % above where the last block started (× 105 / 100), in whole sets | factor | S `plan_types > cycles > rule`; V `cycles`; R `cycles > next_block > multiplier`, `cycles > start_multiplier` | R4-PRG-04, R2-VOL-06 | Confirmed |
| Never above | the level's top number | sets / week | R `cycles > next_block > never_above_top` (true) | R4-PRG-04 | Confirmed |
| Already at the top | sets stay; load and reps progress | | R `cycles > next_block > at_top` | R4-PRG-04, CX-03 | Confirmed |
| Least step between blocks while below the top | 1 whole set | sets | R `cycles > next_block > min_whole_sets` | team | PROPOSED (5 % of a small number rounds to nothing) |
| The level's top from block to block | fixed (14 / 22 / 25) | sets / week | R `volume > cap` | team reading of "never above the level's top number" (R4-PRG-04). Round 2 had also approved a ceiling one set higher per finished block, never above 25, or 30 for a Focus muscle (R2-VOL-06). | INFERRED |
| After a stopped block | the same start | | S `plan_types > cycles > after_cancelled_block`; R `cycles > same_start_if` | team | PROPOSED |
| How the tool knows | the person says how many blocks they completed in a row | blocks | S `inputs_schema > fields > F25c` | R3-GEN-01 (nothing is stored); the input is the team's | PROPOSED |
| Example, L2 big muscle over three blocks | 15→22, 16→22, 17→22 | sets / week | computed with R `cycles > next_block` | computed | Computed |

## 8. Where a new set goes

**Rule.** A new set goes to the first exercise for that muscle, then the second, and so on.

**Why.** "I'm adding sets to the things that matter most. Those things that matter most are usually in the beginning of the exercise because I put all my energy into it" (VOL-07).

| Parameter | Value | Unit | Where it lives | Source | Status |
|---|---|---|---|---|---|
| Order | 2/2/2 → 3/2/2 → 3/3/2 → 3/3/3 → 4/3/3 | sets per exercise | S `rule_tables > set_placement > steps[2]`; R `placement > order_rule` | VOL-07 | Confirmed |
| Same day type twice a week | the added set alternates: Monday's first exercise, then Thursday's | | S `… > steps[0]`; R `placement > day_rotation` | R3-VOL-03 | Confirmed |
| Default sets, compound | 3 | sets | S `rule_tables > session_limits > default_sets`; R `session > default_sets` | VOL-16 | Confirmed |
| Default sets, isolation | 2 | sets | same | VOL-16 | Confirmed |
| Default sets, calves | 3 | sets | same | VOL-17 | Confirmed |
| Default sets, athletic template slot | 2 | sets | same | VOL-16 | Confirmed |
| Fewest sets on an exercise | 2 | sets | same (`min`) | team | PROPOSED |
| Most sets on one exercise | 4 (L1), 5 (L2-L3) | sets | S `… > steps[3]`; R `placement > max_sets_per_exercise` | team | PROPOSED |
| Isolation exercises on a training day | 3 sets, 4 in the hardest weeks; the rest goes to the bonus exercise | sets | R `placement > x1 > iso_main_day_max` | team | PROPOSED |
| Bonus exercise for a group its day cannot hold | 2 to 4, on the optional day; at most 2 added exercises a day | sets | S `… > steps[5]`; R `placement > bonus` | VOL-07, R3-VOL-03 | Confirmed placement; the numbers PROPOSED |
| No optional day for the bonus exercise | the group is capped at what the slots hold, and the plan says so | | R `placement > bonus > no_optional_day` | R4-SES-04 | Confirmed idea; mechanism PROPOSED |
| Focus 1 / Focus 2 slot | 2 to 3 | sets each | S `rule_tables > priority > delivery` | ORD-11 | Confirmed |
| Bilateral or unilateral exercise first, when the share is off by more than | 3 | points | S `… > steps[1]`; R `placement > laterality_tolerance` | team | PROPOSED |

## 9. Session size

**Rule.** A session is sized by its number of exercises, not by minutes. The count leaves out the warm-up and the 2 core exercises. Every day is built on one of his own templates. The counts are recommendations: people add or remove.

**Why.** "You can probably go from 5 to 7. They can add 1 if they want to. This is just our recommendation. These are templates that we're giving them for them to add or take away" (R4-SES-02). "The template is usually 6 exercises for the full-body days because we do that A-day/B-day of upper/lower" (R4-SES-05). "We just worry about the amount of exercises within the session" (CT-01).

| Parameter | Value | Unit | Where it lives | Source | Status |
|---|---|---|---|---|---|
| General fitness, fat loss | 5 to 7 (default 7) | exercises | R `session > size > by_type > general` | R4-SES-02 | Confirmed range; default PROPOSED |
| Aesthetics, bodybuilding | 6 to 8 (default 7) | exercises | R `… > by_type > aesthetics` | R4-SES-02, VOL-16 | Confirmed range; default PROPOSED |
| Strength | 5 to 6 (default 6) | exercises | R `… > by_type > strength` | R4-SES-02 | Confirmed range; default PROPOSED |
| Bootcamp | 5 to 7 (default 7) | stations | R `… > by_type > bootcamp` | R4-SES-02, PRG-03 | Confirmed range; default PROPOSED |
| Field athletes, off-season | up to 12 (default 12) | exercises | R `… > by_type > athletic` | R4-SES-02, VOL-08, R2-SES-04 | Confirmed |
| Older adults, 60 and over | 5 to 6 (default 6) | exercises | R `… > by_type > older` | R4-SES-02 | Confirmed range; default PROPOSED |
| CrossFit-style class | 5 to 7; the workout and the skill piece are outside the count | exercises | R `… > by_type > class` | team | PROPOSED |
| Non-competitive "stay athletic" adult | 5 to 10 | exercises | R `… > by_type > stay_active` | OBSERVED in his 'JUSTICE LEAGUE' tab (10 slots a day) | PROPOSED |
| Not counted | the warm-up; the 2 core exercises; a superset of two small isolations counts as one | | R `session > size > counts`, `session > outside_cap_blocks` | R4-SES-02, R2-SES-04 | Confirmed |
| Also not counted | joint care, skill practice, conditioning, cardio, the cool-down, tests | | R `session > outside_cap_blocks` | team | PROPOSED |
| A full-body day | his A day or B day: about 6 exercises, up to 8 | exercises | R `session > full_body_days`; `model/templates.json` (`skeleton: gym_A`, `gym_B`) | R4-SES-05 | Confirmed |
| Exercises per group on a full-body day | what the template gives: 1 to 4 | exercises | R `session > exercises_per_group > full_body_day` | R4-SES-05 | Confirmed |
| Exercises per group on a split day | 2 to 4 (usually 3-4), never 1 | exercises | S `… > exercises_per_muscle_on_its_day`; R `session > exercises_per_group > split_day` | VOL-07, R2-SES-05, R3-SES-01 | Confirmed in rounds 1 to 3; keeping it for split days after round 4 is INFERRED |
| Calves per leg day | 1 | exercise | same | R3-SES-01 | Confirmed |
| Cross-pattern athletic day inside the 12 | 2 jump or throw stations + 1 Olympic lift | stations | S `… > field_athlete_off_season` | R3-SES-01 | Confirmed |
| Same-pattern athletic day | 3-4 jump stations + 1 Olympic lift | stations | same | R3-SES-01 | Confirmed for 3-4 jump stations; the Olympic lift on that day INFERRED |
| What is removed automatically when a session is full | nothing | | R `session > easy_to_remove > automatic` (false) | R4-SES-04 | Confirmed |
| What the plan names as easiest to remove, in order | conditioning finisher; extra athletic station; small-muscle accessory; bonus exercise (at most 6 listed) | | R `session > easy_to_remove > order`, `render > easy_to_remove` | R4-SES-04 (the person picks); the list is the team's | PROPOSED |
| Never named as removable | the core block, the main lift, its paired upper lift, the first athletic station | | R `session > easy_to_remove > always_keep` | team | PROPOSED |
| Session length asked in the intake | no | | R: the intake's `schedule` holds `days_per_week`, `weekdays`, `start_date` only (`engine/CONTRACTS.md`) | CT-01, R4-SES-01 | Confirmed |
| His typical session lengths | everyday people 45 to 60; athletes, bodybuilders, powerlifters about 90, most 120; bootcamp 35 to 45 | minutes | S `… > session_minutes` | UNI-09, PRG-03 | Confirmed as his words. Background for the printed estimate only. They limit nothing (CT-01). |
| Training days offered | 2 to 6 (default 4) | days / week | S `inputs_schema > fields > F22` | team | PROPOSED |
| Full days off, at least | 1 | day / week | R `session > off_days_min` | OBSERVED week shape | OBSERVED |
| Core block | first, after the warm-up; movable | | S `rule_tables > core_block`; R `core_block` | ATH-11 | Confirmed |
| Warm-up | 5 min of any cardio + A-drills or mobility | minutes | S `rule_tables > warmup` | ORD-08 | Confirmed |

## 10. The time estimate (information only)

**Rule.** The tool estimates how long each day takes and prints it as a range, marked as an estimate. Nothing is cut, moved, reshaped or flagged because of it (CT-01, R4-SES-01).

**Why.** "We can give an average recommendation of what it should take, but we will never know what it's going to take" (CT-01). He gave session lengths and rest ranges. He did not give minutes per set. Every number below is the team's estimate.

Where it lives: R `time_model` (`use: estimate_only`), R `render > estimate`; S `rule_tables > time_model`; V `time_model`.

| Parameter | Value | Unit | Source | Status |
|---|---|---|---|---|
| What the estimate may change in a plan | nothing | | CT-01 | Confirmed |
| How it is printed | a range 10 % each way around the estimate, rounded to 5 minutes: "Average time: about 55-70 min (an estimate, for information only)" | minutes | R4-SES-01 (an estimate like "about 60-75 minutes"); width team | Confirmed idea; width PROPOSED |
| Warm-up, per session | 8 | minutes | ORD-08 | PROPOSED |
| Core set | 1.5 | minutes per set, rest included | team | PROPOSED |
| Compound, bilateral | 2.5 | minutes per set | VOL-14 rests | PROPOSED |
| Compound, unilateral | 3.75 | minutes per set | UNI-09 | PROPOSED |
| Isolation | 1.75 | minutes per set | team | PROPOSED |
| Isolation, unilateral | 2.5 | minutes per set | team | PROPOSED |
| Plyo or ballistic | 1.5 | minutes per set | team | PROPOSED |
| Olympic lift | 3.0 | minutes per set | team | PROPOSED |
| Throw | 1.25 | minutes per set | team | PROPOSED |
| Unilateral time cost | × 1.5 | factor | UNI-09 (his verdict: partly) | PROPOSED |
| Changeover between exercises | 1.0 (0.5 inside a superset pair) | minutes | team | PROPOSED |
| A superset pair takes | × 0.65 of doing both apart | factor | ORD-05 | PROPOSED |
| Check against his sheet | his BYOP day 1 (7 exercises, 19 sets) comes out at about 59 min | minutes | OBSERVED | Check only |

The compiled `model/rules.json > time_model` also holds a split of these numbers into work minutes and rest minutes by kind of set. All of it is PROPOSED and used only for the printed estimate.

## 11. Nothing is cut for time (the time check is retired)

**Rule.** There is no time check. The round-3 order for a chosen time that could not hold the minimums (say so and offer more time; train fewer groups directly; recommend supersets; keep climbing) was retired on 2026-10-10 (CT-01). What replaced it:

| Parameter | Value | Where it lives | Source | Status |
|---|---|---|---|---|
| Fitting a plan to minutes | never | R `time_model > use` (`estimate_only`); check V3 fails a plan that carries a session length, a minute limit, a time check or a time offer | CT-01, R4-SES-01 | Confirmed |
| 2 training days a week | every big muscle at about 6 to 8 weekly sets; the plan says so and suggests a third day | R `volume > two_day` | R4-SES-03 | Confirmed |
| Whole muscle groups dropped, or extra exercises piled on, to cope with few days | never | R `volume > two_day > never` | R4-SES-03 | Confirmed |
| What is left out of a full session | the person picks; nothing is automatic | R `session > easy_to_remove` | R4-SES-04 | Confirmed |
| Supersets | recommended; the person switches each one on; no session length switches them on | S `plan_editing > superset_recommendations`; R `supersets` | R3-SES-02, ORD-05, CT-01 | Confirmed |
| An old intake that still sends a session length | accepted; the value is ignored, with a notice | `engine/intake.mjs` (`warning.session_minutes_retired`) | team | PROPOSED |

Retired keys of the round-3 design: S `rule_tables > session_limits > time_vs_minimums`, S `derived_values > D15_time_fit`, S `inputs_schema > fields > F24` (session length), the 110 % fit rule, the keep order of groups, and the two worked examples (4 × 60 minutes; 2 × 45 minutes). Their state in spec 1.3.0 is listed in [coverage_matrix_round4.md](../../coverage_matrix_round4.md).

## 12. Bilateral : unilateral share

**Rule.** The share of lower-body compound sets that are bilateral slides between 90/10 and 10/90. Bodybuilders and powerlifters end mostly bilateral. Field and court athletes stay mostly unilateral.

**Why.** "The unilateral work is more for health and keeping rotational foundations, and the bilateral is more for driving and creating forces" (UNI-02). For bodybuilders and powerlifters: "maybe 50. It then turns more into an 80/20 or 90/10". For field athletes: "more like 80% or 90% unilateral work in the gym" (UNI-02).

Where it lives: S `rule_tables > bilateral_unilateral > profiles`; V `bilateral_share`; R `bilateral_share > profiles`; per sport in P `profiles[] > bilateral_unilateral`. Values are the **bilateral** share (0.8 = 80 % bilateral).

| Who | Start of the plan | Later | In season | Source | Status |
|---|---|---|---|---|---|
| Bodybuilder or powerlifter, L2-L3 | 0.5 (weeks 1-4) | 0.8 → 0.9 by the peak | | UNI-02, CAT-13 | Confirmed |
| Beginner aesthetics or general, L1 | 0.5 | 0.5 → 0.6 in later blocks | | team | PROPOSED |
| Weekend-warrior athletic, bootcamp | 0.5 | 0.5 | | UNI-06 (cross pattern) | Numbers PROPOSED |
| Field or court change-of-direction athlete | 0.2 | 0.15 | 0.1 (pre-season 0.15) | UNI-02, UNI-10 | Confirmed range (80-90 % unilateral, less bilateral in season); values by phase PROPOSED |
| Sprinters | 0.4 | pre-season 0.3 | 0.2 | team | PROPOSED |
| Strength-type athletes | 0.6 | pre-season 0.4 | 0.25 | team | PROPOSED |
| Baseball, softball | 0.5 | pre-season 0.35 | 0.2 | OBSERVED 4 + 4 sets; UNI-10 | OBSERVED start; rest PROPOSED |
| Combat (boxing, MMA, karate) | 0.4 | pre-season 0.3 | 0.2 | team | PROPOSED |
| Older or injured | 0.6 | | | EQ-03 | Numbers PROPOSED |
| Recreational cutting and racket sports | 0.3 | 0.2 | | UNI-02 | PROPOSED |
| Stay active without a cutting sport | 0.5 | 0.5 → 0.4 | | team | PROPOSED |

| Parameter | Value | Unit | Where it lives | Source | Status |
|---|---|---|---|---|---|
| Range of the slider | 0.1 to 0.9 | share | S `rule_tables > bilateral_unilateral > slider`; R `bilateral_share > slider_range` | UNI-02 ("from one side, like 90/10, to the other side, 10/90") | Confirmed |
| Upper body | the same logic as the lower body | | S `… > profiles[0] > upper` | UNI-03 | Confirmed logic; upper numbers PROPOSED |
| Counted in the share | knee- and hip-dominant compounds only | | S `… > definition` | CAT-09; team | INFERRED |
| Contralateral share of loaded single-leg sets, change-of-direction athletes | about 70 | % | S `rule_tables > contra_ipsi`; R `contra_ipsi > cod_contralateral_share` | CAT-13 (direction) | Direction confirmed; 70 PROPOSED |
| Ipsilateral share, sprinters | about 60 | % | same | CAT-13 | Direction confirmed; 60 PROPOSED |
| Contralateral and ipsilateral work for bodybuilders and powerlifters | mostly weeks 1-4 | weeks | same | CAT-13 ("the first couple of weeks, 3 weeks, up to 4") | Confirmed |
| Frontal and transverse share of single-leg work, court and combat athletes | 45 to 50 | % | S `rule_tables > bilateral_unilateral > frontal_transverse_share_of_unilateral`; R `frontal_transverse` | UNI-12 (more for them) | Direction confirmed; numbers PROPOSED |
| Same, aesthetics | about 10 | % | same | UNI-12 | PROPOSED |

## 13. Pairing and spine loading

**Rule.** In a session that mixes lower and upper body: hip dominant with a push, knee dominant with a pull. One heavy squat day and one heavy deadlift day a week, never the same day.

**Why.** "If I'm doing the back of my lower body, then the opposite would be the front of my upper body. That'll allow me to keep as far away as I can from bleeding over problems" (UNI-11). "I would rather just load it once per week and load it correctly" (PER-04).

| Parameter | Value | Unit | Where it lives | Source | Status |
|---|---|---|---|---|---|
| Pairing | hip + push; knee + pull | | S `rule_tables > pairing > hip_push_knee_pull`; R `pairing` | UNI-11, ORD-06 | Confirmed |
| Heavy squat days | 1 | per week | S `rule_tables > axial_loading > budget_per_week`; R `axial > budget > squat` | PER-04, R2-SES-01 | Confirmed |
| Heavy deadlift days | 1 | per week | same; R `axial > budget > hinge` | R2-SES-01 | Confirmed |
| Both on the same day | never | | same (`same_day: false`) | R2-SES-01 | Confirmed |
| Counted as spine loading | barbell back, front, zercher, overhead and Smith squats; barbell or trap-bar deadlifts and RDLs; good mornings | | S `… > classes > COUNTED_AXIAL` | R2-SES-02 | Confirmed |
| Fine on the second day if not sore | goblet squat, hack squat, pendulum | | S `… > classes > SECOND_DAY_IF_NOT_SORE` | R2-SES-02 | Confirmed |
| Not counted | leg press, belt squat, hip thrust, back extension, reverse hyper, single-leg DB work, Olympic lifts, loaded jumps | | S `… > classes > NOT_COUNTED` | R2-SES-02 | Confirmed |
| Powerlifters | may add a light technique squat or deadlift | | S `… > powerlifter_exception` | R2-SES-02 | Confirmed |
| Records tagged in the catalog | 25 counted, 25 second-day options | records | `synthesis/02_exercise_catalog.json > axial_spinal_load > spine_day_v1_1` (the note in S `… > catalog_ref` says 29) | counted in the file on 2026-10-09 | Of the 25 counted: 17 named by him; 8 barbell and trap-bar variants INFERRED |

## 14. Reps, effort and rest

**Rule.** Every working set is 5 to 30 reps at 1 to 3 reps in reserve. Small muscles take higher reps. Never to failure on heavy compounds.

**Why.** "I like RIR in my model, so that's what I'm going to be using" (VOL-13). On rest: "every time they do a set, they do it correctly and they do it with effort" (VOL-14).

| Parameter | Value | Unit | Where it lives | Source | Status |
|---|---|---|---|---|---|
| Reps, small muscles | 12 to 30 | reps | S `rule_tables > reps > by_size`; R `reps` | VOL-11 | Confirmed |
| Reps, big muscles | 5 to 15, a mix | reps | same | VOL-11 | Confirmed |
| 40-rep sets | not a default; only in an optional AMRAP-style workout or inside HYROX station circuits | reps | S `rule_tables > reps > forty_rep_sets` | VOL-11, R3-ATH-03 | Confirmed |
| Unilateral lifts | 8 to 12 per side | reps | S `rule_tables > reps > unilateral` | UNI-04 | Confirmed |
| Heavy single-leg option | 4-6 or 6-8 per side | reps | same (`heavy_toggle`) | UNI-04 ("optional") | Option confirmed; numbers PROPOSED |
| Preference "heavier, fewer reps" or "lighter, more" | moves the rep range on big compound lifts only; weekly sets unchanged | | S `rule_tables > reps > preference_styles`; R `reps > preference` | VOL-12 | Confirmed |
| Athlete rep phase VOL 1 | compounds 12-15, isolation 10-12 | reps | S `rule_tables > reps > athlete_phases` | PER-11 (compounds); his baseball legend (isolation) | Compounds confirmed; isolation OBSERVED |
| Athlete rep phase VOL 2 | compounds 8-12, isolation 15 | reps | same | PER-11; baseball legend | Compounds confirmed; isolation OBSERVED |
| Athlete rep phase VOL 3 | compounds 6-8, isolation MAX REPS | reps | same | PER-11; baseball legend | Compounds confirmed; isolation OBSERVED |
| Olympic ramp (DB/KB and pull variants) | 4×8 at 75 % → 4×6 at 80 % → 4×6 at 85 % → 4×4 at 90 % | sets × reps, % of that lift's max | S `rule_tables > reps > olympic`; R `olympic > ramp` | PER-09, R2-ATH-05 | Confirmed |
| Full squat cleans and snatches | 3 to 5 reps per set, same weekly reps | reps | same; R `olympic > full_catch_reps` | R2-ATH-05 | Confirmed |
| Strength template, main lift by week | 80, 80, 85, 85, 90, 90 at RPE 7 → 10 | % of 1RM | S `rule_tables > strength_template` | PER-09 | Confirmed |
| Effort band | 1 to 3 | reps in reserve | S `rule_tables > effort > scale`; R `effort > rir_band` | VOL-13 | Confirmed |
| RIR to RPE | 3 = 7; 2 = 8; 1 = 9; 0 (MAX) = 10 | | S `rule_tables > effort > rir_rpe`; R `effort > rpe_for_rir` | VOL-13 (he wants RIR explained and mixed with RPE) | Mapping PROPOSED |
| Strength roles | the work 1 RIR; the accessory 2 RIR; the nuance MAX; the survival done no matter what | | S `rule_tables > effort > strength_roles` | ORD-07 | Confirmed |
| MAX (technical failure) | last set of small-muscle or bodyweight work only | | S `rule_tables > effort > max` | VOL-13, GEN-08 | Confirmed for small-muscle or bodyweight work only; "last set" INFERRED |
| MYO set | last exercise of the day only, machine or isolation | | S `rule_tables > effort > myo` | VOL-15 | Confirmed |
| Easy-week effort | 3 or more | reps in reserve | S `rule_tables > effort > deload`; R `recovery > rir_min` | PER-05, R2-VOL-07 | Confirmed |
| Maintenance effort | 2 to 3 | reps in reserve | S `plan_types > maintenance_4_6 > effort` | team | PROPOSED |
| Speed work | 'FAST RPE6 or about 60-70%', straight weight | | S `rule_tables > effort > speed_work` | OBSERVED; EQ-12 | OBSERVED |
| Rest, hypertrophy | 1 to 2 (up to 3) | minutes | S `rule_tables > rest`; R `rest > hypertrophy_s` | VOL-14 | Confirmed |
| Rest, strength | 3 to 6 | minutes | same | VOL-14 | Confirmed |
| Rest, athletic | as prescribed | | same | VOL-14 | Confirmed |
| Rest in a superset | after the pair | | same | VOL-14 | Confirmed |
| Rest, plyos | work : rest 1:5 to 1:10; depth jumps 2-3 min between sets | | same | reference | SCIENCE |

## 15. Athletic work

**Rule.** A sport's ground-contact time sets how much of its jump and throw work is plyometric. Plans start more ballistic and become more plyometric. Everyone in athletic training gets Olympic lifts.

**Why.** "The more time on the ground they have to have, like a karate athlete, the more ballistics and less plyos. The less time on the ground, like a sprinter, the more plyos and less ballistics" (ATH-01).

### 15.1 Plyometric share

Share of jump and throw work that is plyometric at the **end** of a block. Where it lives: S `rule_tables > athletic > plyo_vs_ballistic > end_of_block_by_sport_approved` and `… > plyo_share_remaining_sports`; R `athletic > ground_contact_classes`; per sport P `profiles[] > ground_contact > plyo_share_pct`.

| Share at block end | Sports | Source | Status |
|---|---|---|---|
| 75 % | sprinters; runners | R2-ATH-01; R3-ATH-04 | Confirmed |
| 60 % | volleyball, soccer, football skill positions; lacrosse, field hockey, flag football, ultimate cutters, rugby sevens, high jump, pole vault, gymnastics, cheer flyers | R2-ATH-01; R3-ATH-04 | Confirmed |
| 50 % | basketball, tennis, football big-skill, weekend warriors; beach volleyball, pickleball, padel, rugby backs, goalkeepers, javelin, HYROX; "a bit of everything" | R2-ATH-01; R3-ATH-04, R3-ATH-03 | Confirmed |
| 40 % | baseball, softball, hockey, linemen, MMA; rugby forwards, cheer bases, throwers, diving, alpine skiing, cycling | R2-ATH-01; R3-ATH-04 | Confirmed |
| 25 % | boxing, karate, kickboxing, wrestling, BJJ, golf; swimming, water polo, rowing, judo, taekwondo, climbing | R2-ATH-01; R3-ATH-04, R3-ATH-01 | Confirmed |
| Recreational players | their activity's share (golf 25 %, running 75 %, rec soccer 60 %) | R3-ATH-04 | Confirmed |
| Sports he was not asked about (quarterback, kicker, freestyle ski, obstacle racing, dance, figure skating, weightlifting, strongman, hiking, surf) | set by the team from the same rule | team | INFERRED |

| Parameter | Value | Unit | Where it lives | Source | Status |
|---|---|---|---|---|---|
| Share at the start of each block | end share − 15 | points | S `… > plyo_vs_ballistic > start_rule`; R `athletic > block_start_offset` | R2-ATH-01 | Confirmed |
| Share ceiling | 80 | % | S `… > plyo_vs_ballistic > ceiling`; R `athletic > share_ceiling` | team (ATH-01: both ends of the range always stay in) | INFERRED |
| Ground-contact classes | 1 very short … 5 very long | class | S `… > plyo_vs_ballistic > classes`; P `ground_contact_model` | ATH-01 (the rule); contact times from research | Rule confirmed; classes and times INFERRED / SCIENCE |

### 15.2 Receive-Create stages

| Plan length | Stage 1 Land | Stage 2 Land & Go | Stage 3 Repeat | Where it lives | Source | Status |
|---|---|---|---|---|---|---|
| 12 weeks | weeks 1-3 | 4-7 | 8-12 | S `rule_tables > athletic > method_stage`; R `athletic > stages > weeks_by_N` | R2-ATH-03 | Confirmed |
| 8 weeks | weeks 1-2 | 3-5 | 6-8 | same | R2-ATH-03 | Confirmed |
| Other lengths | scaled the same way | | | R `athletic > stages > weeks_by_N` | team | PROPOSED |

Rules, all confirmed in R2-ATH-03: restart at stage 1 each off-season; stay put in maintenance blocks; intermediate and advanced athletes may start at stage 2.

### 15.3 Other athletic numbers

| Parameter | Value | Unit | Where it lives | Source | Status |
|---|---|---|---|---|---|
| Olympic lifts, most | 4 | days / week | S `rule_tables > athletic > olympic > frequency`; R `olympic > per_week_max` | R2-ATH-04 | Confirmed |
| Olympic lifts in season | a light piece, 2 sets of 3, dropped in heavy game weeks | sets × reps | same; R `olympic > in_season` | R2-ATH-04 | Confirmed |
| Olympic lifts from the floor, youth | from about 14, after one block of hang work | years | S `rule_tables > athletic > youth`; R `olympic > youth_floor_min_age` | R2-ATH-08 | Confirmed |
| Olympic percentages | not shown by default | | S `output > weight_guidance > olympic`; R `olympic > pct` | R2-GEN-06 | Confirmed; the coach opt-in PROPOSED |
| Medball, passes and rotations | 8 to 10 | lb | S `rule_tables > athletic > medball > loads_lb`; R `medball > loads_lb` | conversation | Confirmed |
| Medball, overhead throws | 6 to 10 | lb | same | EQ-06 | Confirmed |
| Medball, sit-up throws | 6 to 8 | lb | same | EQ-06 | Confirmed |
| Medball, slams | 10 to 20 | lb | same | EQ-06 | Confirmed |
| Medball or wall ball, most | 20 | lb | same (`max`); R `medball > max_lb` | EQ-06, R3-ATH-03 | Confirmed |
| Medball, youth and older adults | lighter | lb | same | EQ-06 | Confirmed; "2 lb lighter" in R is PROPOSED |
| Medball dose in his 'ALL LIST' session | 1 × 10 per throw, one pass through about 19 throws | throws | same (`dose`) | LIB-22 | Confirmed |
| Medball for aesthetics clients | warm-up only | | S `rule_tables > athletic > medball > rule` | ATH-05 | Confirmed |
| Loaded jumps | 10 to 20 | % of body weight | S `rule_tables > equipment > loaded_jumps`; R `athletic > loaded_jump_bw_pct` | EQ-15 | Confirmed |
| Depth-drop height: low / medium / high | 6-12 / 12-18 / above the hip | inches | S `rule_tables > equipment > heights`; R `athletic > heights` | EQ-16 | Confirmed |
| Hurdle height: moderate / advanced | 6 / 12 or more | inches | same | EQ-16 | Confirmed |
| Contrast work: who, when, load | Level 2+ athletes; off-season; heavy lift 78-85 %; no rest inside | % of 1RM | S `rule_tables > athletic > contrast`; R `athletic > contrast` | ATH-12 | Confirmed |
| Jump contacts per session, most | 80 / 100 / 120 by level | contacts | S `rule_tables > athletic > contacts_per_session_max`; R `athletic > contacts_per_session_max` | NSCA guide; his sessions run lower (18-77 observed) | SCIENCE |
| Plyo sessions per week, off-season | 2 to 3, with 48-72 h between sessions for the same area | sessions | S `rule_tables > athletic > plyo_sessions` | NSCA guide | SCIENCE |
| In-season, game-heavy sports: gym plyos | about half | factor | S `rule_tables > athletic > in_season_game_heavy`; R `athletic > in_season_game_heavy > plyo_factor` | R2-ATH-07, R3-ATH-04 | Confirmed |
| In-season: hard gym day before a game | at least 48 | hours | same | R2-ATH-07 | Confirmed |
| Pitchers | less overhead pressing, more arm care, light rotational throws | | S `rule_tables > athletic > pitchers` | ATH-08 | Confirmed; the 0.5 factor in R is PROPOSED |
| Weekly athletic amounts per sport (contacts, throws, cuts, sprint metres, Olympic sets) | per profile | | P `profiles[] > plyo, throwing, cod, sprint, triple_ext, weekly_sets` | ATH-02 (ranking), ATH-03, ATH-05; his baseball and boxing sheets | Ranking confirmed; amounts INFERRED or PROPOSED |

### 15.4 Approved plans for named groups

| Group | Value | Where it lives | Source | Status |
|---|---|---|---|---|
| Swimming dryland: days | 3 gym days + 1 optional (2 for younger or lower-level swimmers) | S `rule_tables > athletic > swimming_dryland` | R3-ATH-01 | Confirmed ("younger or lower-level" read as under about 14 or Level 1: PROPOSED) |
| Swimming dryland: extra cardio | 0 by default | same | R3-ATH-01 | Confirmed |
| Swimming dryland: Olympic lifts | 2 to 3 days a week | same | R3-ATH-01 | Confirmed |
| Swimming dryland: taper | 2 weeks before the main championship meet; 1 week or none before smaller meets | same | R3-ATH-01 | Confirmed |
| HYROX: week | 2 strength days + 2 hybrid days; 4 cardio sessions; 2 short station circuits | S `rule_tables > athletic > hyrox_station_circuits`; S `rule_tables > conditioning > sessions_per_week > hyrox_ocr_race_block` | R3-ATH-03 | Confirmed |
| Stay active: hard gym day before the biggest play day | at least 48 hours | S `rule_tables > athletic > stay_active_play`; R `athletic > heavy_play_weeks` | R3-ATH-05 | Confirmed |
| Stay active: a week with 3 or more play sessions | drops the extra agility drills and half the jumps | same | R3-ATH-05 | Confirmed |
| Stay active: event date | hardest weeks end 1 week before; then 1 easy week at about half the sets | S `plan_types > prep > gen_pop_event` | R3-ATH-05 | Confirmed |

## 16. Conditioning

**Rule.** Aerobic sessions per week depend on the goal and the sport. The person can always ask for more or less.

**Why.** "You can always say, 'I need more cardio,' and then it just adds it to the program ... so it can always be adjustable" (R2-SES-06).

Where it lives: S `rule_tables > conditioning > sessions_per_week` and S `rule_tables > session_limits > aerobic_sessions_per_week`; R `conditioning > sessions`; per sport P `profiles[] > aerobic_sessions_wk`.

| Who | Sessions per week | Source | Status |
|---|---|---|---|
| General and fat-loss clients | 3 (one Blue, one Green, one Orange) | ATH-07 | Confirmed |
| Aesthetics and bodybuilders | 4 (Blue, Green, Orange + a second easy Orange) + optional 20-30 min easy walks | ATH-07, R2-SES-06 | Confirmed |
| Athletes in season | 2 | ATH-07 | Confirmed |
| Athletes pre-season | 2 | R2-ATH-06 | Confirmed |
| Athletes off-season: baseball, softball, sprinters | 2 | R2-ATH-06 | Confirmed |
| Athletes off-season: basketball, volleyball, football, tennis, golf, boxing, BJJ | 3 | R2-ATH-06 | Confirmed |
| Athletes off-season: soccer, hockey, kickboxing, karate | 3 to 4 | R2-ATH-06 | Confirmed |
| Athletes off-season: MMA, wrestling | 4 | R2-ATH-06 | Confirmed |
| Other sports, off-season | 2 to 4, like the list above | R3-ATH-04 | Confirmed |
| Swimmers, runners, rowers, endurance cyclists | 0 extra (their practice is the cardio; they can add one) | R3-ATH-01, R3-ATH-04 | Confirmed (water polo and triathlon added by the team: INFERRED) |
| Powerlifters | 2 easy (Orange) | R2-ATH-06 | Confirmed |
| HYROX | 4 | R3-ATH-03 | Confirmed |
| Stay athletic and active | 3; a 45-60+ min session of the activity counts as one, up to 2 | R3-ATH-05 | Confirmed |

| Parameter | Value | Unit | Where it lives | Source | Status |
|---|---|---|---|---|---|
| Same colour twice in a week | never, except the second Orange for aesthetics | | S `rule_tables > conditioning > rules` | OBSERVED; R2-SES-06 | OBSERVED / Confirmed |
| Steady cardio, most | 40 | minutes | same; R `conditioning > steady_max_min` | OBSERVED (his instruction block) | OBSERVED |
| User's more / less cardio control | −3 to +3 | sessions | R `conditioning > cardio_adjust` | R2-SES-06 (adjustable) | Range PROPOSED |
| An extra 5th or 6th session | Orange repeats first | | S `… > extra_sessions_order` | team | PROPOSED |
| Bootcamp circuit: rounds | 3 to 5 | rounds | S `rule_tables > supersets_contrast_circuits > bootcamp_circuits > his_rule`; R `supersets > bootcamp` | PRG-03 | Confirmed |
| Bootcamp circuit: work per station | 30 to 50 | seconds | same | PRG-03 | Confirmed |
| Bootcamp circuit: stations | 5 to 7 | stations | same | PRG-03 | Confirmed |
| Bootcamp session | 35 to 45 | minutes | same | PRG-03 | Confirmed as his description of a class. Not a limit the plan is fitted to (CT-01). |
| Bootcamp sessions per week | 4, 5 or 6 | sessions | same | PRG-03 | Confirmed |
| Bootcamp as built by the model | two circuits a day of 4-6 stations, 3 rounds × 35-50 s | | same (`v1_1`) | R2-SES-05 applied by the team | INFERRED |

## 17. Equipment

**Rule.** No bands. No variable resistance. Machines are not ranked. More constraint for older, injured and high-volume clients.

**Why.** "I don't do bands" (EQ-01). "In my model, bands are not something that you're going to make changes to your body with" (EQ-02). "I'd rather they collect that volume in a safe place with more constraints" (EQ-03).

| Parameter | Value | Unit | Where it lives | Source | Status |
|---|---|---|---|---|---|
| Constraint scale | 5 seated machine with back pad; 4 plate-loaded, Smith, chest-supported; 3 cable or DB on a bench; 2 standing free weights; 1 bodyweight, ballistic, reactive | level 1-5 | S `rule_tables > equipment > constraint_scale`; `synthesis/10_equipment_model.json > constraint_scale` | EQ-13 | Confirmed |
| Older, injured, high-volume clients | constraint 4-5 for compounds and isolation | level | S `rule_tables > equipment > older_injured_high_volume`; R `equipment > client_families > older_or_pain` | EQ-03 | Confirmed |
| Constraint bands for other client types | athlete 1-2 on main lifts, and so on | level | R `equipment > client_families` | team | PROPOSED |
| Band, chain and weight-releaser items that can reach a plan | 0 | items | S `rule_tables > equipment > no_variable_resistance`; R `equipment > banned_tokens` | EQ-01, EQ-07, EQ-08, EQ-12 | Confirmed. The band and chain items of his sheets stay in the source catalog as `out_of_scope` records. They are never picked and never compiled. |
| Machine ranking | none | | S `rule_tables > equipment > machines_not_ranked` | EQ-11 | Confirmed |
| Equipment choices in the intake | 8 | profiles | S `vocab > equipment_profiles`; R `equipment > profiles` | EQ-01 | Confirmed (2 more are derived by the tool) |
| Ideal home kit | adjustable dumbbells, bench, pull-up bar, 8-10 lb medball | | S `rule_tables > equipment > ideal_home_kit` | EQ-02 | Confirmed ("ideal", not required) |
| No implement in the name | bodyweight → dumbbell → barbell as the level rises | | S `rule_tables > equipment > default_implement` | EQ-09 | Confirmed |
| Carries and sled work: dose | 2 to 4 trips of 20 to 40 metres, or 20 to 40 seconds | trips, m, s | R `conditioning > carry` | R4-LIB-02 | Confirmed |
| Carries and sled work: muscle sets | 0; they sit with core and conditioning | sets | R `conditioning > carry > counts_as_muscle_sets` (false) | R4-LIB-02 | Confirmed |
| Team-proposed exercises (optional add-ons) a template may pick | 0. Exceptions: wall balls and sled pushes in HYROX | records | R `selection > addons` | R4-LIB-01 | Confirmed |
| Wall balls and sled pushes in the CrossFit-style class workout | on, with a switch | | R `selection > addons > primary_exceptions[1] > enabled` | R4-LIB-01 ("maybe") | PROPOSED |
| Optional add-ons listed on a plan | up to 6 (joint care, then sport, then a carry), 2 to 3 sets each | add-ons | R `selection > addons > offer` | team | PROPOSED |
| Neck work | not picked, not offered, not shown | | R `selection > addons > not_shown_statuses` | R4-LIB-01 | Confirmed |
| Vertical / mid-range push slot for muscle, general, fat-loss and "stay active" goals | an incline press leads; overhead presses stay as swaps | | R `selection > incline_first` | R4-LIB-03 | Confirmed preference; the selection weight (4) and the goal list PROPOSED |
| Mid-range pull | its own category between horizontal and vertical pull; counts as a horizontal pull for credit | | R `selection > mid_range > pull` | R4-LIB-03; credit team | Confirmed category; credit and the 2 row records PROPOSED |
| A swap prints | one line: what it keeps, what it loses | | R `selection > swap_notes` | R4-LIB-04 | Confirmed; phrases PROPOSED |
| Video | a YouTube search link built from the English exercise name, plus the name to copy; third-party links: none | | R `render > video` | R4-LIB-05 | Confirmed |

## 18. Age rules

**Rule.** Rules go by age, experience, goal and injuries. Never by sex.

**Why.** "I don't go by sex on these things, but mainly by age, foundation, goal, and injuries" (ATH-09).

| Parameter | Value | Unit | Where it lives | Source | Status |
|---|---|---|---|---|---|
| Older-adult defaults start at | 60 | years | S `rule_tables > athletic > older > age`; R `population > older > from_age` | R2-ATH-08 | Confirmed |
| On by default from 60 | landing drills, balance, quick stepping without a hop, light medball throws, fast machine work | | S `… > older > default_on` | R3-ATH-02 | Confirmed |
| Off by default from 60, can be switched on with his warning | low ankle hops, other jumps, Olympic lifts, depth jumps | | S `… > older > default_off` | R2-ATH-08, R3-ATH-02 | Confirmed |
| Never from 60 | overhead squats, low-bar squats | | S `… > older > never` | EQ-03, R3-ATH-02 | Confirmed (snatch variants also kept out: PROPOSED) |
| Racket-player rules start at | 50 (pickleball, padel, tennis) | years | S `rule_tables > athletic > racket_50plus > applies_from_age`; R `population > active_aging_50` | R3-ATH-02 | Confirmed |
| Racket players 50+ | knee-friendly strength; calf and Achilles work every leg day; rotator-cuff work; only low-impact jumps unless switched on | | same | R3-ATH-02 | Confirmed |
| Youth | under 18 | years | R `population > youth > below_age` | legal age; R2-ATH-08 | INFERRED |
| Maintenance for older adults, at least | 70 | % of sets | S `plan_types > maintenance_4_6 > older_floor` | research | SCIENCE / PROPOSED |
| Age accepted by the intake | 10 to 90 | years | S `inputs_schema > fields > F02 > range` | team | PROPOSED |
| Sex field | none | | S `inputs_schema > removed_fields` | GEN-02, ATH-09 | Confirmed |

## 19. Plans, blocks and the calendar

**Rule.** A plan is a block that is completed and then ends. Nothing is inserted in the middle. After it, an easy week is recommended.

**Why.** "It should never be thrown in the middle of a block. No matter what the athlete puts, they need to be able to manage their block and complete it" (R2-VOL-07). "... maintenance weeks are a recommendation. They don't have to be mandatory ... when the block ends, it just ends, and then you have to go back into the app and build whatever you want next" (R3-PER-01).

| Parameter | Value | Unit | Where it lives | Source | Status |
|---|---|---|---|---|---|
| Preferred plan length | 12 | weeks | S `plan_types > fixed_12`; R `plan_types > fixed_12` | PER-01 | Confirmed |
| Shorter plan | 8 | weeks | S `plan_types > fixed_8` | PER-01, R2-PER-03 | Confirmed |
| Short training block | 4 to 6 | weeks | S `plan_types > short_block_4_6` | R2-PER-03 ("that goes for every plan") | PROPOSED use (inside a tuned year or set by a coach) |
| Exercise block (same exercises) | 4 to 6 | weeks | S `rule_tables > set_placement > block_rule` | PER-02 | Confirmed |
| Exercise blocks in 12 / 8 weeks | 1-4, 5-8, 9-12 / 1-4, 5-8 | weeks | S `plan_types > fixed_12 > exercise_blocks`; R `stairway > exercise_blocks_by_N` | PER-02; team layout | Confirmed length; layout PROPOSED |
| What changes at the next exercise block | 1 or 2 small variables, or one detail of a library exercise; never all at once | | same | PER-02, R2-LIB-01 | Confirmed |
| Deload or maintenance week inside a block | 0 | weeks | S `plan_types > deload > when > inside_a_block` | R2-VOL-07 | Confirmed |
| Easy week after a block: sets | about half of the hardest (last) week | factor 0.5 | S `plan_types > deload > dose`; R `recovery > sets_factor` | PER-05, R2-VOL-07 | Confirmed |
| Easy week: is it required? | no, recommended | | S `plan_types > deload > when > place` | R3-PER-01 | Confirmed |
| Easy week: length | 1 extra week (12 + 1 = a 13-week quarter) | weeks | same | R3-PER-01 | Confirmed |
| Easy week: jumps, throws, Olympic lifts | about half, low-amplitude landings, light technique loads | | S `plan_types > deload > dose` | team | PROPOSED |
| Maintenance phase: volume | 50 to 70 | % | S `plan_types > maintenance_4_6 > factor`; R `plan_types > maintenance_4_6 > factor` | PER-01 | Confirmed |
| Maintenance factor by reason | vacation or little equipment 0.5; travel, moving, season change, after a stopped block 0.6; planned 0.7 | factor | same | team split of his range | PROPOSED |
| Maintenance phase: length | chosen by the person | weeks | S `plan_types > maintenance_4_6 > length` | R2-PER-06; PER-01 ("4 to 6 weeks") | Confirmed |
| Maintenance length offered | 1 to 8, default 4 | weeks | S `inputs_schema > fields > F25d` | team | PROPOSED |
| Maintenance phase: weekly step | 0 | % | S `plan_types > maintenance_4_6 > step` | PER-01 (a lower-volume phase to "recover and not push too hard") | INFERRED |
| Pre-season: length | 4 to 6 | weeks | S `plan_types > season > pre`; R `plan_types > season > pre_weeks_range` | R2-PER-06 | Confirmed |
| Pre-season: sets | about 60 % of off-season sets | % | same; R `volume > phase_factors > pre_season` | R2-PER-06 | Confirmed |
| Pre-season: taper before the first game | 1 to 2 | weeks | same | R2-PER-06 | Confirmed |
| Taper: volume cut | 40 to 60 | % | S `plan_types > prep > rule`; R `plan_types > prep > taper_volume_cut` | research | SCIENCE |
| In-season gym days | 2 | days / week | S `plan_types > season > in` | PER-08 | Confirmed |
| Fight or meet prep | 2-week steps and waves | weeks | S `plan_types > prep > rule` | PER-10 | Confirmed |
| Year plan: quarters | Q1 weeks 1-13, Q2 14-26, Q3 27-39, Q4 40-50, holidays 51-52 | weeks | S `plan_types > year > quarters`; R `plan_types > year > layout` | R2-PER-01 (themes) | Themes confirmed; week layout PROPOSED |
| Year plan: Q3 volume | about 70 | % | same | R2-PER-01 | Confirmed |
| Year plan: last 2 weeks of December | maintenance, about 60 (50-70) | % | same | PER-01, R2-PER-01; R3-PER-01 (a recommendation) | Confirmed; 60 PROPOSED |
| Year plan: Q1 sets | stay at the starting level | | same | R2-PER-01 | Confirmed |
| Year plan: who | general population only; athletes follow their season | | S `plan_types > year > who` | R2-PER-01 | Confirmed |
| Holidays and vacations | planned between blocks; a holiday marked inside a running block ends it | | S `plan_types > year > calendar` | R3-PER-01 | Confirmed |
| Hemisphere | the user's own; southern shifts by 6 months | months | same | R2-PER-02 | Confirmed idea; the shift PROPOSED |

## 20. Tests

**Rule.** Test before the block and at the end. Never during it. Never a max test from zero.

**Why.** "They should not test during the weeks, during the block ... you should not go from not training to a one-rep max test ... They should try to test at 80%, 90%, but not at 100%" (R2-PER-07).

| Parameter | Value | Unit | Where it lives | Source | Status |
|---|---|---|---|---|---|
| Test weeks, 12-week plan | 1 and 12 | week | S `tests > timing_by_mode`; R `plan_types > fixed_12 > test_weeks` | R2-PER-07 | Confirmed |
| Test weeks, 8-week plan | 1 and 8 | week | same | R2-PER-07 | Confirmed |
| Test weeks, year plan | 1, 12, 25, 50 | week | S `plan_types > year > tests` | R2-PER-07 on the PROPOSED layout | PROPOSED |
| Strength test, no completed block yet | 5-rep or 3-rep max (beginners 5 to 8) | rep max | S `tests > never_from_zero`; R `tests > catalogue > strength` | R2-PER-07 | Confirmed |
| Strength test, after a completed block | 3-rep max, or work up to a 1-rep max | rep max | S `tests > catalogue > strength` | R2-PER-07 | Confirmed |
| Cardio and speed tests from zero | 80 to 90 | % effort | S `tests > never_from_zero` | R2-PER-07 | Confirmed |
| Cardio test | 1-mile run or an erg time trial | | S `tests > catalogue > cardio` | R2-PER-07 | Confirmed |
| Speed and agility tests | 10-30 m sprint, 5-10-5, L-test | | S `tests > catalogue > speed_agility` | R2-PER-07, LIB-01 | Confirmed |
| Reminders | at block start, 7 days before, the day before | | S `tests > reminders` | R2-PER-07 | Confirmed. Printing them in the plan with no notification is the team's way to keep nothing stored (PROPOSED, after R3-GEN-01) |
| Rest of the test week | about 50-70 % of its sets | % | S `tests > when` | team | PROPOSED |
| The '21.6 mile run' | removed | | S `tests > excluded` | R2-LIB-06 | Confirmed |

## 21. Product limits

**Rule.** Few inputs. The release first. One build. Nothing kept. Everything editable.

**Why.** "I want this to be very simple. This works. We're not going to need a lot of inputs for this" (R3-VOL-04). "I don't want any data kept" (R3-GEN-01).

| Parameter | Value | Where it lives | Source | Status |
|---|---|---|---|---|
| Inputs after the plan is built | 0 | S `rule_tables > rate_engine > no_feedback` | R3-VOL-02, R3-VOL-04 | Confirmed |
| User data stored | none | S `legal_and_privacy > no_data_kept` | R3-GEN-01 | Confirmed |
| Terms and release accepted | required before a plan is generated, at every build or rebuild. No acceptance: no plan (status invalid, no weeks). | S `legal_and_privacy > release_every_build`; R `legal > gate` | R2-GEN-03, R3-GEN-01, R4-SCP-01, R4-SCP-02 | Confirmed |
| Release line printed on the plan | top and bottom of a full plan and of the overview; a short line on block, week and day views; English and Spanish; 3 wordings (self, coach, guardian) | R `legal > release_line` | R4-SCP-01, R4-SCP-02 | Rule confirmed; wording PROPOSED, LEGAL REVIEW |
| Who may use the plans on their own | everyone | R `legal > gate > applies_to` | R4-SCP-01 | Confirmed |
| Session length asked | no | (no field) | R4-SES-01 | Confirmed |
| What a person may edit | everything: sets by day or week, add or remove an exercise, a block on or off, swaps | S `plan_editing`; `engine/edit.mjs` | R3-SES-02, CX-02, CX-04 | Confirmed; screen mechanics PROPOSED |
| Sport profile confidence labels | 3: `confirmed_by_coach` (23 profiles), `similar_sport` (67), `proposed` (37); never shown on a plan | R `render > profile_confidence`; `model/profiles.json > sports[id].confidence` | R4-SCP-03 | Confirmed; the sorting INFERRED |
| Health-check items that stop the automatic plan | 5 | S `legal_and_privacy > health_check > route` | R2-GEN-03 | Confirmed in round 2; final wording by a lawyer. Open after R4-SCP-01 ("everyone should be able to use the plan"): whether they should still stop a plan. Today they do. |
| Languages | English first, full Spanish | S `output > language` | GEN-01, R2-GEN-08 | Confirmed |
| Units | pounds in the US, kilograms elsewhere, switchable | S `inputs_schema > fields > F06` | R2-GEN-08 | Confirmed |
| Activities a person may pick | up to 2 | S `inputs_schema > fields > F11r > type` | team | PROPOSED |
| Sample plans he will grade | 7 (the repo holds 8: his 7 plus a pickleball sample) | S `output > sample_plans_for_grading` | R2-GEN-07 | Confirmed |

## 22. Retired numbers (do not reuse)

| Number | What it was | Retired by |
|---|---|---|
| Helper credit 0.5 | half a set for helper muscles | VOL-09 |
| Glutes 0.5 on deadlifts and RDLs; KB swings = 1 glute set | old glute counting | R2-VOL-05 |
| Small-muscle Level 1 start of 8; small-muscle ceilings 12 / 18 / 22; floors of 4 (big) and 2 (small) | lower small-muscle volume (the starts of 12 and 15 stay) | R2-VOL-04, R2-VOL-06 |
| Rear delts 4 / 6 / 8 own sets, ceilings 8 / 12 / 16 | rear delts as their own line | R3-VOL-01 |
| 3 % / 5 % / 7 % by muscle size | step tied to the muscle | VOL-05 |
| Check-in steps: +7 % "too easy", +5 % "perfect", hold, −1 set | weekly feedback | R3-VOL-02, R3-VOL-04 |
| 5 % default step when nobody checks in; 3 % for stressed or under-slept people | intake-driven step | R2-VOL-03, R2-GEN-04 |
| 60+ step limit of 3 % (it was PROPOSED, never his) | slower stairway for older adults | dropped by the team after R3-VOL-04 approved one stairway for every plan |
| 8-week plan: start × 1.10, 4 + 4 weeks, first 4 weeks ≤ 5 % | "start hard" | R2-PER-03 |
| 12-week plan: weeks 1-3 ≤ 3 %; week-7 deload; week 1 of the next cycle as a deload | old 12-week shape | PER-01, R2-PER-03, R2-PER-04, R2-VOL-07, R3-PER-01 |
| Plyo share floor of 20 % | a floor under the starting share | R2-ATH-01 |
| Unilateral slot = 1.5 slots, used to cut exercises | time rule as an exercise cap | UNI-09 (partly); then CT-01: time is an estimate only |
| Step for one group at most 7 % a week; coach-set step 0 to 7 % | a hard limit on the weekly step | CX-01, R4-PRG-02 |
| Total weekly sets rise by less than 10 %; its exceptions; the one-set allowance | a hard limit on the weekly total | CX-01, R4-PRG-02 |
| Scale factor on the steps never above 1; "the ceiling is a maximum" when 3 % and 5 % steps cannot reach it | ending below the planned final sets | CX-01 |
| Least climb of 2 sets (calves 1) for a trained group | a rule that sets must rise | CX-02, CX-03 |
| Exercises by minutes: 5 at 45, 6-7 at 60, 8-9 at 75-90 | session size from session length | R4-SES-01, R4-SES-02 |
| Session lengths offered: 30, 45, 60, 75, 90, 105, 120 minutes | an intake question | R4-SES-01 |
| A day "fits" at up to 110 % of the chosen length; "longer sessions" offers; the keep order of groups | the time check | CT-01 |
| Full-body day of 7 to 10 resistance exercises with 2 to 4 per group | a layout built from the 2-to-4 rule | R4-SES-05 |
| Next-block ceiling + 1 set per finished block (never above 25, or 30) | a rising ceiling | not carried into R4-PRG-04's "never above the level's top number" (INFERRED reading; it was R2-VOL-06) |
| 136 third-party video links in the catalog | links that are not his | R4-LIB-05 |
| Maintenance fixed at 4-6 weeks | fixed length | R2-PER-06 |
| Bands about 50 %, chains about 70 % | variable-resistance loads | EQ-12 |

## Related pages

- [glossary.md](glossary.md): what each term means.
- [data-dictionary.md](data-dictionary.md): the fields that carry these numbers.
- [volume](../02-model/volume.md), [stairway](../02-model/stairway.md), [sessions](../02-model/sessions.md), [athletes](../02-model/athletes.md), [plans and calendar](../02-model/plans-and-calendar.md): the same rules explained.
- [decision records](../04-decisions/index.md): why each rule is the way it is.
- [His answers by topic](../03-coach-answers/index.md): the full text behind every answer id.
- [BLAZE_CAMP_BRAIN.md](../../BLAZE_CAMP_BRAIN.md) §16.3: the master list of PROPOSED items.
