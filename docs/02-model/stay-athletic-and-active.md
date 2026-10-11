# Stay athletic and active: pickleball, padel, HYROX, rec leagues, running

This page covers people who do not compete but want to stay athletic: pickleball and padel players, HYROX first-timers, rec-league players, runners, hikers and people who want "a bit of everything". They pick an **activity**, not a sport with a position and a season. The plan is the coach's own non-competitive athletic program, tuned by the activity: light core first, a short block of jumps, throws, agility and an Olympic lift, then full-body resistance work, plus three cardio sessions. The person can tell the tool which days they play and whether they have an event. Play days move the hard gym day. A long session of the activity counts as cardio. An event date sets when the hardest weeks end.

> **How to read this page.** Ids with no prefix (`ATH-13`, `GEN-02`) are the coach's round-1 answers (`coach_answers_full.md`). `R2-` is round 2 (`coach_answers_round2.md`). `R3-` is round 3 (`coach_answers_round3.md`). A later round wins. "chat" means something he said in conversation (`coach_chat_statements.md`). "Approved" means he marked our proposal RIGHT. **PROPOSED** means the team designed it and he has not confirmed it. His answers: [../03-coach-answers/athletes-and-sports.md](../03-coach-answers/athletes-and-sports.md). **Since model v1.3** there are newer answers too: round 4 (`R4-`, `coach_answers_round4.md`) and two clarifications of 2026-10-10 (`CT-01` on session time, `CX-01..04` on progression and editing). They win on their subjects.

Related pages: [athletes.md](athletes.md) (the rules for jumps, Olympic lifts and medballs), [sports.md](sports.md) (competitive sports), [special-populations.md](special-populations.md) (age 60 and over, racket players from 50, youth, pain), [sessions.md](sessions.md), [volume.md](volume.md), [plans-and-calendar.md](plans-and-calendar.md). Terms: [../05-reference/glossary.md](../05-reference/glossary.md).

This is general fitness information, not medical advice. Read [DISCLAIMER.md](../../DISCLAIMER.md) before you use it with anyone.

---

## 1. The rule

**Rule.** General-population people who want to stay athletic get their own way into the tool. They name the activity. They are not asked for a position or a season.

**Rule.** Their plan is the coach's non-competitive athletic program. In his sheets the tab was called 'JUSTICE LEAGUE'. That was only a marketing name (ATH-13), and he asked for names people can understand (FIX-03). The model calls it "Athletic Performance - Non-Competitive" (name PROPOSED). The activity changes which athletic qualities lead and how much of each.

**Why.** He asked for this group by name:

> "They want to stay athletic and active, so we need to understand that that's an option for them." (chat)

He named pickleball, which he called "very popular right now" (chat), and HYROX. About his non-competitive program he said it was written for:

> "people that wanted to be athletic, but they didn't need to compete in any sport. These are non-competitive, all-around athletic adults." (ATH-13)

On what to ask them:

> "If they're recreational sports, you don't need to go into position and season, just general sports." (GEN-02)

**Where it lives.**

| What | File and key |
|---|---|
| The goal choice "Stay athletic and active" | `generator_spec_v1.json > inputs_schema.fields.F07` (option `active`) |
| The activity question | `generator_spec_v1.json > inputs_schema.fields.F11r` |
| The 26 activities | `synthesis/04_profiles.json > activities.list[]`; `generator_spec_v1.json > vocab.activities` |
| The standard plan for this group | `synthesis/04_profiles.json > stay_athletic_standard` |
| Each activity's profile | `synthesis/04_profiles.json > profiles[]` where `category` is `recreational` |
| Compiled copy the engine reads | `model/profiles.json > picker.activities[]` and `sports.<profile_id>` |
| Master text | `BLAZE_CAMP_BRAIN.md` §9.10 |

---

## 2. How someone gets in

| Step | What happens | Status |
|---|---|---|
| Goal | The person picks "Stay athletic and active". | The option is his request (chat). The wording of the tile is PROPOSED. |
| Activity | They pick what they play or do. Up to two; the first one leads the plan and the second adds its demands. | The list and the "up to two" rule are PROPOSED. |
| Fat-loss or general-fitness goal | A one-line link asks "Do you also play something?". The plan keeps its goal and adds the activity's athletic work. | PROPOSED |
| Play days | Optional. The days they play. | Approved, R3-ATH-05 |
| Event date | Optional. A first HYROX race, a pickleball tournament, a 10K. | Approved, R3-ATH-05 |
| Not asked | Position, season dates, sleep, stress, job. No sex field. | GEN-02, R2-GEN-04 |

Someone who plays in real competition with a season uses the competitive path instead. See [sports.md](sports.md). Pickleball, padel, HYROX and several others exist on both paths.

---

## 3. What the plan contains

**Rule.** Every main day has the same parts, in this order.

| Part of the day | Amount | Decided by |
|---|---|---|
| Warm-up | 5 minutes of any cardio plus running drills or mobility. Never counted. | ORD-08 |
| Core, first | 2 exercises x 2 sets, light, short of failure. The person can move it or switch it off for the day. | ATH-11, R2-SES-03, R3-SES-02 |
| Jumps | 1-2 stations x 2 sets. Plyometric or ballistic by the activity's share. Taught in the Receive-Create stages. Can be switched off for the day. | ATH-01, R2-ATH-01 to R2-ATH-03, R3-ATH-04, R3-SES-02; the number of stations is PROPOSED |
| Throws | 0-1 medball station. More for racket sports and golf. Never over 20 lb. | ATH-05, EQ-06; the number of stations is PROPOSED |
| Agility | 0-1 change-of-direction station, easy turns first. | ATH-06; the number of stations is PROPOSED |
| Olympic lift | 1 station x 2 sets on most main days, in a beginner-friendly version (hang clean, kettlebell squat clean, single-arm dumbbell snatch, hex-bar jump, hang pulls). Explained as power. | ATH-10, R2-ATH-04, R2-GEN-06; the dose is PROPOSED |
| Resistance | 2-4 exercises for each muscle group trained that day. A hip-dominant lift (hinge family: deadlifts, hip thrusts) with a push, a knee-dominant lift (squat and lunge family) with a pull. The heavy squat and the heavy deadlift on different days. | R2-SES-05, ORD-06, UNI-11, R2-SES-01 |
| Weekly sets | At least 10 sets a week on every trained group, climbing week by week like a stairway. | R2-VOL-06, R3-VOL-01, R3-VOL-04 |
| Calves | One exercise x 3 sets on every leg day. | VOL-17, R3-SES-01 |
| Shoulders | Rear-delt work every week, counted inside the shoulders group. | VOL-17, R3-VOL-01 |
| Cardio | 3 sessions a week: one Blue (short and hard), one Green (moderate), one Orange (long and easy). More or less on request. | ATH-07, R3-ATH-05, R2-SES-06; the colours are OBSERVED in his cheat sheet |

The jump, throw, agility and Olympic work follows the rules on [athletes.md](athletes.md). It never counts as muscle sets (VOL-10).

**How many gym days.** These layouts are PROPOSED, except the 4-day one, which is his own template (OBSERVED in his sheet).

| Gym days | Layout |
|---|---|
| 2 | Two full days plus the activity. Used for running, cycling, lap swimming and dance classes, where the activity already fills the week. |
| 3 | The default for most activities: a heavy squat day, a hinge day that does not load the spine, and a heavy deadlift day. One optional day. |
| 4 | His own template for "a bit of everything": 2 jumps, 1 throw, 1 change-of-direction drill and 1 Olympic lift a day, plus 2 optional days. |
| 4 for HYROX | 2 strength days and 2 hybrid days (approved, see section 8). |

Session length is not asked and nothing is cut for time (CT-01, R4-SES-01). A day is sized by its exercise count; for a non-competitive "stay athletic" adult the data uses 5 to 10 exercises, read from his 'JUSTICE LEAGUE' tab (**PROPOSED**; he gave counts for other client types in R4-SES-02). With 2 training days every big muscle is trained at about 6 to 8 weekly sets and the plan suggests a third day (R4-SES-03). See [sessions.md](sessions.md).

---

## 4. The 26 activities

**Rule.** People who play for fun use their activity's plyometric share. "A bit of everything" stays at 50 % (R3-ATH-04).

The **plyo share** is the part of the jump and throw work that is plyometric (short, bouncy contacts) at the end of a block. The rest is ballistic (one big push). Each block starts 15 points lower. [athletes.md](athletes.md) explains why.

Status letters: **C** = he named this activity and number. **R** = it follows his rule from a sport he confirmed; the team applied it. **P** = PROPOSED, placed by the team. **O** = OBSERVED in his sheets.

| # | Activity | Profile | Plyo share at block end | What leads the plan (PROPOSED) |
|---|---|---|---|---|
| 1 | Pickleball | `rec_pickleball` | 50 % · C (R3-ATH-04) | Side-to-side first steps, split-step reactions, rotation both ways, single-leg control, calves and Achilles, shoulder and elbow care |
| 2 | HYROX | `hyrox_fitness` | 50 % · C (R3-ATH-03) | The approved HYROX plan (section 8) |
| 3 | Tennis | `rec_tennis` | 50 % · R (tennis, R2-ATH-01) | As pickleball, on a bigger court |
| 4 | Padel | `rec_padel` | 50 % · C (R3-ATH-04) | As pickleball, with more overhead and forward-and-back work |
| 5 | Golf | `rec_golf` | 25 % · C (R3-ATH-04) | Rotation, hips and trunk, light throws |
| 6 | Rec league: basketball | `rec_basketball` | 50 % · R | The league sport's demands, with no position |
| 6 | Rec league: soccer | `rec_soccer` | 60 % · C (R3-ATH-04) | same |
| 6 | Rec league: softball | `rec_softball` | 40 % · R | same |
| 6 | Rec league: flag football | `rec_flag_football` | 60 % · R | same |
| 6 | Rec league: volleyball (indoor, sand or grass) | `rec_volleyball` | 50 % · P | same |
| 6 | Rec league: ice hockey | `rec_hockey` | 40 % · R | same |
| 6 | Rec league: ultimate | `rec_ultimate` | 60 % · R | same |
| 6 | Rec league: kickball | `rec_kickball` | 40 % · P | same |
| 6 | Rec league: other team sport | `rec_league` | 50 % · R | same |
| 7 | Running for fitness (first 5K or 10K, run club) | `run_fitness` | 75 % · C (R3-ATH-04) | Calves and Achilles, single-leg strength, tissue that can take the miles. The runs are the cardio. |
| 8 | Hiking and rucking | `hike_ruck` | 25 % · P | Carries, step-ups, slow lowering for the quads |
| 9 | Cycling and indoor cycling | `cycling_fitness` | 40 % · R (cycling) | Hips, trunk, upper body, and some jumping for bone |
| 10 | Lap swimming | `lap_swim` | 25 % · R (swimming) | Shoulder care, pulling, legs and bone loading |
| 11 | Ski and snowboard season prep | `ski_snow_prep` | 40 % · R (alpine skiing) | Slow lowering for the quads, side-to-side work, a block before the trip |
| 12 | Surf and paddleboard | `surf_paddle` | 25 % · P | Pulling, pop-up power, shoulder care |
| 13 | Dance and fitness classes | `dance_fitness` | 50 % · P | Landing quality, single-leg control |
| 14 | Triathlon for fitness | `rec_triathlon` | 75 % · P | The sport is the cardio |
| 15 | Rowing and indoor rowing | `rec_rowing` | 25 % · R (rowing) | The sport is the cardio |
| 16 | CrossFit-style classes | `crossfit_class` | no separate jump block · O | His class model: warm-up, light core, skill, strength or power, then the workout of the day |
| 17 | Boxing, kickboxing or martial-arts classes | `rec_combat_fitness` (grappling uses the variant `combat_fitness_grappling`) | 25 % · P | Rotational throws; pressing kept in check when class volume is high |
| 18 | Climbing and bouldering gym | `rec_climbing` | 25 % · R (climbing) | Pushing work to balance the pulling, grip |
| 19 | Obstacle course race (first Spartan or Tough Mudder) | `rec_ocr` | 50 % · P | Pulling, grip and carries; 4 cardio sessions like HYROX |
| 20 | Badminton, squash, racquetball or table tennis | uses `rec_tennis` | 50 % · P | As tennis |
| 21 | Disc golf | uses `rec_golf` | 25 % · P | As golf |
| 22 | Bowling | uses `rec_golf` | 25 % · P | As golf |
| 23 | Trail running | uses `run_fitness` | 75 % · P | As running, plus knees on the downhills and ankles on uneven ground |
| 24 | Mountain biking | uses `cycling_fitness` | 40 % · P | As cycling, plus upper-body strength for falls |
| 25 | Kayak, canoe, wakeboard or water-ski | uses `surf_paddle` | 25 % · P | As surfing and paddleboarding |
| 26 | A bit of everything | `weekend_warrior` | 50 % · C (R2-ATH-01, R3-ATH-04) | "a good mix of everything" (ATH-13) |

The picker has 26 entries. "Rec league" is one entry that then asks for the league sport, so it fills nine rows here. Rows 20-25 have no profile of their own yet and borrow the nearest one.

**Other dials for this group** (all PROPOSED):

| Dial | Value |
|---|---|
| Two-leg vs one-leg lower-body lifting: racket activities, golf, and rec soccer, basketball, flag football, ultimate and hockey | 30/70 at the start of a block, 20/80 at the end. One step more two-leg than competitive players. |
| Two-leg vs one-leg, most other activities | 50/50 at the start, 40/60 at the end. A few start at 40/60 and end at 30/70 (hiking, kickball, ski prep, combat classes, first obstacle race). |
| Two-leg vs one-leg, running | 20/80 |
| Weekly jump contacts, throws and cuts | Lower than for competitive athletes. Ranges in `stay_athletic_standard.weekly_ranges`. |

**Where it lives.** `synthesis/04_profiles.json > activities.list[]` (`id`, `profile`, `competitive_counterpart`, `event_type`, `routed`). Shares: `profiles[].ground_contact`. The recreational rule: `generator_spec_v1.json > rule_tables.athletic.plyo_share_remaining_sports.recreational`. Two-leg share: `profiles[].bilateral_unilateral`; see [bilateral-unilateral.md](bilateral-unilateral.md).

---

## 5. Play days

**Rule.** The person can enter the days they play. Then (approved, R3-ATH-05):

| Rule | Number |
|---|---|
| The hardest gym day stays ahead of the biggest play day. | At least 48 hours before it |
| A week with a lot of play drops the extra agility drills and half the jumps. | 3 or more play sessions in the week |
| A long session of the activity counts as cardio (section 6). | 45-60 minutes or more |

With no play days entered, the plan is printed as written. There are no check-ins. The person or coach adjusts it ahead of time.

PROPOSED: in a heavy play week the Olympic lift stays light, 2 sets of 3.

**Why.** He approved the proposal as written. The idea behind it is the same one he approved for game-heavy sports in season: the play already gives the jumps and the cuts, so the gym gives less of them (R2-ATH-07).

**Where it lives.** `generator_spec_v1.json > rule_tables.athletic.stay_active_play` and `inputs_schema.fields.F11r.fields.play_days`. Per profile: `synthesis/04_profiles.json > profiles[].play_adjustment` (`spacing`, `heavy_play_weeks`, `aerobic`). Compiled: `model/rules.json > athletic.heavy_play_weeks`.

---

## 6. Your activity counts as cardio

**Rule.** The plan has 3 cardio sessions a week. A session of the activity that lasts 45-60 minutes or more counts as one of them. Up to 2 of the 3 can be covered this way (approved, R3-ATH-05).

| Case | Cardio in the plan |
|---|---|
| Most activities | 3 sessions: Blue, Green, Orange. Long play sessions replace up to 2. |
| Running, cycling, lap swimming, rowing for fitness | The runs, rides, swims or rows are the 3 sessions. He approved a credit of up to 2 of the 3 (R3-ATH-05). Letting the activity cover all 3 is PROPOSED. |
| HYROX, first obstacle race | 4 sessions (HYROX approved, R3-ATH-03; obstacle racing PROPOSED) |
| CrossFit-style classes | The classes are the training, so the play-day and cardio-credit rules do not apply. Cardio follows the aerobic levels in his CrossFit sheet (OBSERVED). |
| Anyone | More or less on request (R2-SES-06). |

Any machine works: run, bike, rower or ski erg, tracked by time, distance or calories (EQ-14).

**Where it lives.** `generator_spec_v1.json > rule_tables.conditioning.sessions_per_week.stay_athletic_and_active` and `derived_values.D14_aerobic_sessions`. Per profile: `synthesis/04_profiles.json > profiles[].aerobic_sessions_wk`. Compiled: `model/rules.json > conditioning.activity_counts_as_aerobic`.

---

## 7. An event date

**Rule.** The person can enter an event date: a first HYROX race, a pickleball tournament, a 10K. Then (approved, R3-ATH-05):

| Step | What the plan does |
|---|---|
| 1 | The stairway is timed so the hardest weeks end 1 week before the event. |
| 2 | The last week is 1 easy week at about half the sets. |
| 3 | After the event the plan ends. The person builds the next one (R3-PER-01). |

With no date, the person gets the normal block or the yearly plan.

**Where it lives.** `generator_spec_v1.json > plan_types.prep.gen_pop_event` and `inputs_schema.fields.F11r.fields.event_date`. Per profile: `synthesis/04_profiles.json > profiles[].event_prep`. The calendar rules are on [plans-and-calendar.md](plans-and-calendar.md).

---

## 8. HYROX

**HYROX** is a fitness race: eight 1-km runs, each followed by a workout station. When he said gen-pop people want to do "high rows", he meant HYROX. He confirmed that reading and approved this plan (R3-ATH-03).

| Part | Rule (approved, R3-ATH-03) |
|---|---|
| Strength days | 2 a week: squat + pull, and deadlift + push |
| Hybrid days | 2 a week: run intervals, or "1 km run + 1 station" repeated |
| Cardio sessions | 4 a week: Blue, Green, Orange and a second Orange. Running is about half the race. |
| Station circuits | 2 short circuits a week, as finishers: sled push and pull, burpee broad jumps, wall balls, farmers carry, sandbag lunges, SkiErg or row |
| Counting | The circuits never count as muscle sets. |
| Wall balls | The race ball. Never over 20 lb. |
| 40-rep sets and AMRAP sets (as many reps as possible) | Only inside these circuits |
| Jumps | 50 % plyometric at the end of a block, like basketball |

PROPOSED: one circuit closes each hybrid day; a circuit lasts about 8-12 minutes; no more than 2 station days a week; one optional fifth day.

**Why.** His view on very high-rep sets explains why they stay inside the circuits:

> "I'm not really a big fan of 40 reps of doing something." (VOL-11)

In the same answer he placed them with CrossFit-style and HYROX-style training, "into different styles of workouts, like maybe an AMRAP or things like that" (VOL-11). On heavier medballs he asked the same question about the person: "Are they doing CrossFit, or are they doing high rows?" (EQ-06).

**Where it lives.** `generator_spec_v1.json > rule_tables.athletic.hyrox_station_circuits` and `rule_tables.conditioning.sessions_per_week.hyrox_ocr_race_block`. Profiles: `synthesis/04_profiles.json > profiles[]` with `id` `hyrox_fitness` (for fun) and `hyrox_competitive` (racing), field `hyrox_plan_r3`. Compiled: `model/rules.json > athletic.hyrox`.

---

## 9. Pickleball, padel and tennis

**Rule.** From age 50, racket players get extra protection by default (approved, R3-ATH-02). At every age the model leads their plan with side-to-side first steps, rotation both ways, single-leg strength, and care for the calves, Achilles, shoulder and elbow. That second part is PROPOSED.

| From age 50 | Rule |
|---|---|
| Strength | Knee-friendly choices |
| Calves and Achilles | Worked on every leg day |
| Shoulder | Rotator-cuff work (with dumbbells, cables or kettlebells; the model never uses bands, EQ-01) |
| Jumps | Low-impact only. No depth jumps, hurdle hops or bounds, unless the person switches them on. |
| From age 60 | The older-adult defaults apply as well. |

The details are on [special-populations.md](special-populations.md).

**Why.** He used a pickleball player as his own example of why a block must be easy to switch off:

> "Maybe a pickleball player that played a lot of pickleball has a lot of soreness in their calves" (R3-SES-02)

He went on to say that on such a day the jump work "could be turned off, or they can delete certain exercises" (R3-SES-02).

**Where it lives.** `generator_spec_v1.json > rule_tables.athletic.racket_50plus`. Profiles `rec_pickleball`, `rec_padel`, `rec_tennis`, `pickleball_competitive`, `tennis`: field `age_50_plus` in `synthesis/04_profiles.json > profiles[]`. Compiled: `model/rules.json > population.active_aging_50`.

---

## 10. Rec leagues

**Rule.** The person picks "Rec league" and then the sport. The plan follows that sport's demands with no position and no season. The plyo share is the sport's share (section 4).

A rec player usually has one game a week. That game is a play day (section 5).

**Where it lives.** `synthesis/04_profiles.json > activities.list[]` entry `rec_league`, field `league_sport` (sport → profile).

---

## 11. Running

**Rule.** Runners get a 75 % plyometric share (approved, R3-ATH-04). The reason in the model: every running step is a very short ground contact. The runs are the cardio. The gym work is strength for the legs, calves and Achilles.

| Item | Rule | Decided by |
|---|---|---|
| Half marathon | His borrowed Chris Hinshaw plan, used as written. It is the longest run plan in the model. | PRG-12, R2-LIB-06 |
| The "21.6 mile run" from his sheet | Removed from plans and tests. | R2-LIB-06 |
| Tests | A beginner never starts with an all-out mile. Test at 80-90 % effort. | R2-PER-07 |
| Beginners | A run and walk start, three runs a week. | PROPOSED (from research) |
| Gym days | 2 a week. | PROPOSED |

**Where it lives.** Profile `run_fitness` in `synthesis/04_profiles.json > profiles[]`. Run plan: `generator_spec_v1.json > rule_tables.conditioning.endurance_plan`.

---

## 12. Active aging

**Rule.** Age changes the defaults, not the door. A 64-year-old pickleball player still picks pickleball. The older-adult rules are laid on top.

| Age | What changes | Status |
|---|---|---|
| 50-59, racket sports | The racket rules of section 9 | Approved, R3-ATH-02 |
| 50-59, other activities | The normal plan with extra joint-care choices | PROPOSED |
| 60 and over | Landing drills, balance, quick stepping, light medball throws and fast machine work stay on. Ankle hops, other jumps, Olympic lifts and depth jumps are off unless switched on with his warning. | Approved, R3-ATH-02 |

Full rules: [special-populations.md](special-populations.md).

---

## 13. The year

**Rule.** People in this group can use his yearly plan for the general population: hard work with more cardio from January to March, summer shape from April to June, maintenance at about 70 % from July to September, a muscle-building block from October to mid-December, and maintenance in the last two weeks of the year. The person can re-order it and tune it (R2-PER-01, R2-PER-02). An activity block or an event block can be placed where the person wants it.

**Why.** He said the yearly plan is for exactly this group:

> "this is for the general population that wants to just stay in shape and wants to have some type of planning for how the year works" (R2-PER-01)

Details: [plans-and-calendar.md](plans-and-calendar.md).

---

## 14. What the person or coach can change

**Rule.** The whole plan comes out at once. The person follows it and adjusts it by hand. Nothing is tracked.

| They can | Decided by |
|---|---|
| Switch off a day's athletic block (jumps, throws, agility, Olympic lift) | R3-SES-02 |
| Switch off a day's core block | R3-SES-02 |
| Remove or add exercises or blocks | R3-SES-02 |
| Do the recommended supersets to save time | R3-SES-02 |
| Ask for more or less cardio | R2-SES-06 |

**Why.**

> "It's already a template, and you need to adjust it as you need to." (R3-VOL-04)

**Where it lives.** `generator_spec_v1.json > plan_editing`; `synthesis/04_profiles.json > stay_athletic_standard.editing_r3`.

---

## 15. What this plan is not

| It is not | Because |
|---|---|
| A competitive plan | No position, no season dates, no pre-season or in-season blocks (GEN-02) |
| An aesthetics plan | Medball throws stay in the main workout. He removes them only for aesthetics (ATH-05). |
| A max-testing plan | No 1-rep max or all-out mile from zero (R2-PER-07) |
| A lifestyle tracker | No sleep, stress or job questions (R2-GEN-04). No check-ins (R3-VOL-02). No data kept (R3-GEN-01). |

---

## 16. What is still PROPOSED

| Item | Section |
|---|---|
| The wording of the goal tile, the activity list, picking up to two activities, the "I also play something" link | 2 |
| The number of jump, throw and agility stations a day, and the Olympic dose | 3 |
| The 2-day and 3-day layouts | 3 |
| The share for activities he did not name (hiking, surfing, dance, triathlon for fitness, combat classes, first obstacle race, rec volleyball, kickball) and for every borrowed profile | 4 |
| What leads each activity's plan | 4 |
| The two-leg vs one-leg numbers | 4 |
| The light Olympic lift in heavy play weeks | 5 |
| Four cardio sessions for a first obstacle race; the activity covering all 3 cardio sessions for runners, cyclists, lap swimmers and rowers | 6 |
| What leads a racket player's plan at every age | 9 |
| Where the HYROX circuits sit and how long they last | 8 |
| The plan for ages 50-59 outside racket sports | 12 |

The activities added by the team after his request (combat classes, climbing gym, first obstacle race, and the borrowed profiles in rows 20-25) have not been shown to him yet.
