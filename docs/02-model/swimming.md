# Swimming: dryland training, worked from start to finish

Swimming is the model's worked example for a sport. **Dryland** is the gym training a swimmer does out of the water. The coach asked for swimming by name, it is the first of the seven sample plans he will grade, and he approved its defaults in round 3: three dryland gym days plus one optional day, no extra cardio in the gym, jump work that is mostly ballistic, Olympic lifts on two or three days, shoulder care in every session with no bands, and a two-week dryland taper before the main championship meet. This page walks through one swimmer from the first question to a finished week. At each step it shows which rule decides, why, and where the data lives. It also shows what is his decision and what is still PROPOSED.

> **How to read this page.** Ids with no prefix (`ATH-01`, `EQ-01`) are the coach's round-1 answers (`coach_answers_full.md`). `R2-` is round 2 (`coach_answers_round2.md`). `R3-` is round 3 (`coach_answers_round3.md`), the newest. A later round wins. "chat" means something he said in conversation. "Approved" means he marked our proposal RIGHT with no extra words, so the wording is ours and the decision is his. **PROPOSED** means the team designed it and he has not confirmed it. His answers: [../03-coach-answers/athletes-and-sports.md](../03-coach-answers/athletes-and-sports.md).

Related pages: [athletes.md](athletes.md) (the rules used here), [sports.md](sports.md) (swimming next to the other 51 sports), [special-populations.md](special-populations.md) (young swimmers, masters swimmers, pain), [sessions.md](sessions.md), [volume.md](volume.md), [stairway.md](stairway.md), [plans-and-calendar.md](plans-and-calendar.md), [testing.md](testing.md), [equipment.md](equipment.md). Terms: [../05-reference/glossary.md](../05-reference/glossary.md).

This is general fitness information, not medical advice. Read [DISCLAIMER.md](../../DISCLAIMER.md) before you use it with anyone.

---

## 1. The rule: his approved dryland defaults

**Rule.** These six defaults are approved (R3-ATH-01).

| Dial | Default |
|---|---|
| Gym days | 3 dryland days plus 1 optional day, around pool training. 2 days for younger or lower-level swimmers. |
| Extra cardio in the gym | 0 sessions. The pool is the aerobic work. The swimmer can add one. |
| Jump work | Mostly ballistic. 25 % plyometric at the end of a block. |
| Olympic lifts | 2-3 days a week. |
| Shoulder care | In every session: external rotation, floor Y and T raises, kettlebell face pulls. Never bands. |
| Taper | A 2-week dryland taper lined up with the swim coach's taper before the main championship meet. 1 week or none before smaller meets. |

**Why.** He asked for the sport himself:

> "include swimming as well." (chat)

He approved the six defaults as proposed. The reasons written in that proposal were: the pool already is the aerobic work, and "starts and turns are single big efforts" (R3-ATH-01, our wording, his approval). That second reason is his own rule applied to the pool. A swimmer's foot is not bouncing off the ground. It pushes once off the block and once off each wall. In his words about any sport:

> "The more time on the ground they have to have, like a karate athlete, the more ballistics and less plyos." (ATH-01)

On bands, his rule covers every plan in the model:

> "I don't program anything with bands." (EQ-01)

**Where it lives.**

| What | File and key |
|---|---|
| The approved defaults in one place | `generator_spec_v1.json > rule_tables.athletic.swimming_dryland` |
| The three swimming profiles | `synthesis/04_profiles.json > profiles[]` with `id` `swimming_sprint`, `swimming_middle`, `swimming_distance` |
| Profile cards in text | `synthesis/04_athlete_profiles.md` §8.2 |
| Compiled copy the engine reads | `model/profiles.json > sports.swimming_middle` (and `_sprint`, `_distance`) |
| Master text | `BLAZE_CAMP_BRAIN.md` §9.11 |

---

## 2. The swimmer in this example

A 16-year-old high-school swimmer. Main events: 200 freestyle and 100 butterfly. Two years of training. Off-season. Three gym days of 60 minutes, with an optional Saturday. A full gym. The season starts in about four months.

This is the same swimmer as sample plan 01 in the repo (`samples/intakes/01-swimming.json`).

---

## 3. Step 1: what the swimmer enters

**Rule.** Few answers go in. The whole plan comes out. No check-ins, no tracking, no data kept (R3-VOL-02, R3-VOL-04, R3-GEN-01).

| Question | This swimmer | Field | Decided by |
|---|---|---|---|
| Main goal | Train for my sport | `F07` | GEN-02 |
| Do you compete? | Yes | `F11a` | GEN-02 |
| Sport | Swimming | `F11` | chat |
| Event group | Middle distance (200-400 and IM) | `F12` | PROPOSED list |
| Main stroke | Freestyle | `F12`, second choice | PROPOSED list |
| Level of play | High school | `F13` | PRG-09 |
| Season | Next season start date, and the main championship meet date when known | `F14` | R2-GEN-05, R3-ATH-01 |
| Practice and meet days | Pool practices per week, meet days | `F15` | R2-GEN-05 |
| Age, body weight | 16, 145 lb | `F02`, `F05` | GEN-02 |
| Training experience | 2 years | `F17` | GEN-02, PRG-05 |
| Days and minutes | 3 x 60, optional Saturday | days and session length | GEN-02 |
| Equipment | Full gym | equipment | EQ-01 |
| Anything hurting? | Nothing | `F35` | VOL-03 |
| Focus muscles (optional) | None | `F09` | R3-SES-01 |
| Tests (optional) | Strength and jumps | tests | PER-07, R2-PER-07 |
| Health check and release | A parent accepts for a minor | `F01`, `F46` | R2-GEN-03, R3-GEN-01; the parent step for minors is a legal draft (PROPOSED) |

**Not asked:** pool yardage, sleep, stress, sex. He wanted nothing in the tool except the workouts:

> "I just need the workouts here. There's no need to talk about sleep or stress or anything else." (R2-GEN-04)

**Where it lives.** `generator_spec_v1.json > inputs_schema.fields`. The swimming entry of the picker: `synthesis/04_profiles.json > sports.list[]` with `id` `swimming` (`positions`, `second_choice`).

---

## 4. Step 2: the tool picks a profile

**Rule.** The event group picks the profile. The stroke adds a small variant. With no event group, the middle-distance profile is used.

The three profiles, their differences and their stroke variants are PROPOSED. He approved the six defaults of section 1, which all three share.

| | Sprint (50-100) | Middle distance (200-400, IM) | Distance (800-1500, open water) |
|---|---|---|---|
| Profile id | `swimming_sprint` | `swimming_middle` | `swimming_distance` |
| What decides the race (from research) | Power off the block and the walls, stroke force | Speed plus a large aerobic share | The biggest pool load and the most shoulder turns |
| What dryland is for | Strength and power | Strength and power at a lower dose, plus strength-endurance for shoulders and hips | Stability and strength-endurance, with a small strength and power dose |
| Olympic days | 3 | 3 | 2 |
| Two-leg : one-leg lifting (start → end of block; in season) | 50/50 → 60/40; 50/50 | 50/50 → 55/45; 45/55 | 40/60 → 40/60; 30/70 |
| Pull sets for each push set | about 2.2 | about 2.3 | about 2.75 |
| Budget, sets a week | 97 (23 athletic) | 94 (21 athletic) | 73 (13 athletic) |
| Estimated minutes per main day | about 68 | about 67 | about 54 |

The budget row is the profile's description of an off-season week in the middle of a block. It is a guide for the generator, not a promise. The real weekly sets come from the volume rules (section 9).

**Stroke variants** (all PROPOSED):

| Main stroke | What changes |
|---|---|
| Freestyle | The base profile. Core work against rotation first, then controlled rotation. |
| Backstroke | One more rear-shoulder set and one more ballistic set, one less throw set. No fast throws behind the body. |
| Breaststroke | More single-leg knee work and side-to-side work. Extra care for the inner knee, the groin and the low back. |
| Butterfly | One more hinge set, one less overhead-press set. Core work against arching first. |
| Individual medley | The freestyle base plus the breaststroke hip and knee care and the butterfly low-back care. |

Our swimmer gets `swimming_middle` with the freestyle variant. Because the swimmer is under 18, the youth rules are laid on top of the profile (section 14).

**Where it lives.** How a profile is picked: `generator_spec_v1.json > derived_values.D2_profile` (the first example there is a swimmer). Variants: `synthesis/04_profiles.json > profiles[].variants[]` (`id` `stroke_free`, `stroke_back`, `stroke_breast`, `stroke_fly`, `stroke_im`). Budgets: `profiles[].weekly_sets` and `profiles[].derived`.

---

## 5. Step 3: the week

**Rule.** Three dryland days, one optional day, pool practice around them (R3-ATH-01). Each day follows the coach's pairing: a knee-dominant lift (the squat and lunge family) goes with a pull, and a hip-dominant lift (the hinge family: deadlifts, hip thrusts) goes with a push (ORD-06, UNI-11). The heavy squat and the heavy deadlift are on two different days (R2-SES-01).

| Day | Type | Main pairing |
|---|---|---|
| Monday | A: knee + pull | Heavy squat with a row |
| Wednesday | B: hip + push | A hinge that does not load the spine (hip thrust or back extension) with push-ups |
| Friday | C: full | Heavy deadlift with a pull-over, then a little of everything |
| Saturday (optional) | Focus | Rotator cuff, shoulder blades, hips |
| Other sessions | Pool | The swim coach's plan. It is the aerobic work. |

PROPOSED details: which weekdays; keeping a dryland session at least 4 hours away from a hard pool session when possible; what the optional day holds; reading "younger or lower-level swimmers" as under about 14 or first-level trainees; keeping 1 optional day on top of their 2 days.

**Why.** On the pairing, he explained that working the back of the lower body with the front of the upper body keeps the two from getting in each other's way:

> "If I'm doing the back of my lower body, then the opposite would be the front of my upper body." (UNI-11)

On the spine:

> "I don't want to always load the lower back and the spine twice per week." (PER-04)

**Where it lives.** `synthesis/04_profiles.json > profiles[]` (`id` `swimming_middle`): `template`, `days`, `sample_week`. Pairing and spine rules: `generator_spec_v1.json > rule_tables.pairing` and `rule_tables.axial_loading`; see [sessions.md](sessions.md).

---

## 6. Step 4: inside one session

**Rule.** Every session runs in the same order: warm-up, core, power, Olympic lift, strength, accessories. Power comes before strength (ORD-03). Core comes first (ATH-11).

Monday, the A day, for our swimmer. The exercise picks are a PROPOSED skeleton. The order and the rules in the right-hand column are his.

| # | Block | Monday example | Rule |
|---|---|---|---|
| 0 | Warm-up | 5 minutes of any cardio, then marching and skipping drills or mobility. Not counted. | ORD-08 |
| 1 | Core | 2 exercises x 2 sets, light: dead bug, hollow hold or side plank | ATH-11, R2-SES-03 |
| 2 | Jump | Box jump or squat jump (ballistic) | R2-ATH-02, R3-ATH-01 |
| 3 | Olympic lift | Hang clean. Cleans go on squat-pattern days. | ATH-10, R2-ATH-04 |
| 4 | Main lift and partner | Heavy squat + chest-supported or one-arm dumbbell row | R2-SES-01, UNI-11, ORD-01 |
| 5 | Second pair | Rear-foot-elevated split squat + pull-up or lat pulldown | R2-SES-05; the row comes before the pulldown (ORD-01) |
| 6 | Shoulder care | Side-lying dumbbell external rotation + kettlebell face pulls | R3-ATH-01, R2-LIB-04 |
| 7 | Calves | One exercise x 3 sets | VOL-17, R3-SES-01 |

The split squat has a link to the sport: the swimmer's start is a staggered stance. That link is our reading (PROPOSED).

Wednesday and Friday in short:

| Day | Session |
|---|---|
| Wednesday, B | Warm-up → core → medball overhead throw and rotational toss → single-arm dumbbell snatch (snatches go on hinge days) → hip thrust or back extension + push-ups → single-leg RDL + neutral-grip dumbbell press → Nordic or slider curls → external rotation + floor Y and T raises → calves 3 sets |
| Friday, C | Warm-up → core → jumps from a deep start position + pogo hops → hex-bar jump or hang clean → heavy trap-bar deadlift + straight-arm pull-over → lateral lunge + dumbbell row → triceps + floor Y and T raises → calves 3 sets |
| Saturday, optional | Rotator cuff, shoulder-blade work, hip rotation and adductor work |

**Why.** On the order of pulls: he said in conversation that a row (a horizontal pull) comes before an overhead (vertical) pull, and a horizontal push before a vertical push. He confirmed it in the questionnaire (ORD-01). On core, his answer was short:

> "we need all the core work to be done first." (ATH-11)

**Where it lives.** `synthesis/04_profiles.json > profiles[]` (`id` `swimming_middle`) `> sample_week.off_season`. Order rules: `generator_spec_v1.json > rule_tables.ordering` and `rule_tables.core_block`.

---

## 7. Step 5: power for starts and turns

**Rule.** A swimmer's jump work is mostly ballistic: 25 % plyometric at the end of a block (R3-ATH-01, R3-ATH-04). Like every sport, each block starts 15 points more ballistic (R2-ATH-01), so a swimmer starts a block at 10 %.

**Ballistic** means one big push with a longer contact: squat jumps, box jumps, broad jumps, loaded or hex-bar jumps, medball throws. **Plyometric** means short, bouncy contacts: pogo and ankle hops, hurdle hops, depth jumps, bounds (R2-ATH-02).

| Item | For swimmers | Status |
|---|---|---|
| Share of plyometric work | 10 % at the start of a block, 25 % at the end | Approved |
| Main jumps | Squat, box and broad jumps, jumps from a deep start position, hex-bar jumps | Exercise types approved as ballistic (R2-ATH-02); the picks are PROPOSED |
| Throws | Medball overhead throws, slams and rotational tosses, with a light ball | Ball never over 20 lb (EQ-06); the 4-8 lb range and the picks are PROPOSED |
| Small ankle block | A few pogo or ankle hops each week | PROPOSED, from research: swimming does not load the bones, so a little impact is kept |
| Not by default | Depth jumps, bounds, hurdle hops | PROPOSED |
| Change of direction, sprints | None in the gym | PROPOSED |
| Jump stages | Land, then land and go, then repeat (weeks 1-3, 4-7, 8-12 on a 12-week plan) | Approved for all athletes (R2-ATH-03) |
| Weekly amounts | Middle distance: about 37-49 jump contacts, of which 6-8 plyometric; 35-45 throws | PROPOSED |

**Why.** The pool gives the swimmer no bouncing contacts at all. The start and each turn are single pushes. So by his rule the gym gives mostly single big efforts.

**Where it lives.** `synthesis/04_profiles.json > profiles[]` (`id` `swimming_middle`): `ground_contact` (`class` 5, `plyo_share_pct` 25, `plyo_share_start_pct` 10), `power_mix_by_phase`, `plyo`, `throwing`, `medball_policy`. The rule itself: [athletes.md](athletes.md) sections 2 and 3.

---

## 8. Step 6: Olympic lifts

**Rule.** Everyone in athletic training gets Olympic lifts (ATH-10). Swimmers get them on 2-3 days a week (R3-ATH-01). Clean versions go on squat-pattern days and snatch versions on hinge-pattern days (R2-ATH-04).

| Day | Lift | Why this one |
|---|---|---|
| Monday, A (knee) | Hang clean | Clean = squat pattern |
| Wednesday, B (hip) | Single-arm dumbbell snatch | Snatch = hinge pattern. The one-arm dumbbell version is the default for swimmers (PROPOSED: it loads the shoulder less than a barbell snatch). |
| Friday, C | Hex-bar jump or hang clean | A simple, fast lift |

| Item | Rule | Decided by |
|---|---|---|
| Beginners | Dumbbell and kettlebell snatches, kettlebell squat clean, hang clean, hang pulls, hex-bar jumps | ATH-10, R2-LIB-07 |
| Load | By effort. The lift is explained as power: move it fast. | R2-GEN-06 |
| From the floor | From about age 14, after one block of hang work | R2-ATH-08 |
| In season | A light piece: 2 sets of 3, dropped in heavy competition weeks | R2-ATH-04 |
| Sprint and middle-distance swimmers: 3 days; distance swimmers: 2 days | Inside his 2-3 | R3-ATH-01; the split by event is PROPOSED |
| Distance swimmers skip the barbell snatch | | PROPOSED |

**Why.**

> "Those are still going to be there, so everyone gets Olympic lifts." (ATH-10)

**Where it lives.** `synthesis/04_profiles.json > profiles[].olympic_policy` (`off_season_exposures_wk`, `pattern_split`, `sport_note`, `frequency_r3`).

---

## 9. Step 7: strength and weekly sets

**Rule.** The resistance part follows the same volume rules as every plan. Sets are counted per muscle group. A trained group gets at least 10 sets a week in a training block. The sets climb week by week like a stairway. Jumps, throws and Olympic lifts are never counted as muscle sets.

| Rule | For the swimmer | Decided by |
|---|---|---|
| Groups | Sets are counted on groups: hips = glutes + hamstrings; shoulders = front, side and rear delts. | R3-SES-01, R3-VOL-01 |
| Floor | At least 10 weekly sets on each trained group, in training blocks. Pre-season and in-season weeks sit lower on purpose. | R2-VOL-06, R3-VOL-01. The lower pre-season and in-season weeks were in our R3-VOL-01 proposal. He marked it PARTLY and his words did not change that part. |
| Exercises per group | 2-4 on each day the group is trained, never 1. | R2-SES-05 |
| Stairway | About 3 % more sets a week to the halfway week, about 5 % after it. The hardest weeks are last. | R3-VOL-04 |
| No easy week inside a block | | R2-VOL-07 |
| Rear delts | Part of the shoulders group. The shoulder-care work adds to it. More can always be added. | R3-VOL-01 |
| Helpers | A muscle that only helps in a lift gets a quarter of a set. | VOL-09 |
| What is not counted | Jumps, throws, Olympic lifts, sprints. | VOL-10 |

What the swimming profiles add on top (PROPOSED):

| Item | Value |
|---|---|
| Priorities | Middle distance: lats and upper back first, then the back of the shoulder, then quads and glutes for turns. Sprint: lats and upper back, then quads and glutes for starts and turns, then the back of the shoulder. |
| Pull vs push | At least 1.5 pull sets for each push set, every week |
| Overhead pressing | Low volume, seated or with a landmine |
| Avoid | Sessions that leave the swimmer sore for the next pool set |
| Share of work | Middle distance: strength about 45 %, power 30 %, strength-endurance 15 %, muscle size 10 % |

**When 3 x 60 minutes cannot hold all of it.** The model has an approved order (R3-SES-02): tell the swimmer up front and offer another day or longer sessions; if they keep their time, train fewer groups directly, big movers first; recommend supersets; and keep the stairway climbing on the groups that are trained. Which groups a swimmer keeps when time is short is PROPOSED: the back, the hips, the shoulders and the quads come before the chest and the arms.

**Why.** On the floor:

> "I don't think anybody needs less than 10 sets a week per muscle" (R2-VOL-06)

On short sessions:

> "Recommend doing supersets so that it's a faster workout, but they should be able to get things done." (R3-SES-02)

**Where it lives.** Volume rules: `generator_spec_v1.json > rule_tables.weekly_sets`, `rule_tables.counting`, `rule_tables.rate_engine`, `rule_tables.time_model`; see [volume.md](volume.md) and [stairway.md](stairway.md). Swimmer priorities: `synthesis/04_profiles.json > profiles[].resistance` (`priorities`, `push_pull`, `avoid`, `emphasis_pct`). The group count of the budget: `profiles[].derived.v1_2_group_audit`.

---

## 10. Step 8: shoulder care in every session

**Rule.** Every dryland session has shoulder care: external rotation, floor Y and T raises, kettlebell face pulls. Never bands (R3-ATH-01).

| Exercise | What it is | In the library because |
|---|---|---|
| External rotation | Lying on the side, a light dumbbell turned outward | Added by the team for this rule. The exercise record is PROPOSED; the default it serves is approved (R3-ATH-01). |
| Floor Y and T raises | Lying face down, arms lifted in a Y and then a T | Added with his approval (R2-LIB-07) |
| Kettlebell face pulls | A rear-shoulder pull | In his library. Moved from vertical pulls to shoulder work with his approval (R2-LIB-04, LIB-10). |

This applies to the A, B and C days and to the pre-season and in-season lifts. An earlier version of the data had it on two or three days only. It was fixed after his round-3 approval.

Bands are a common tool for this work in swim programs (general knowledge, not his words). This model does not use them. Each band exercise has a dumbbell, cable or kettlebell swap.

**Why.**

> "I don't work with anything with bands, so I don't really like bands." (EQ-02)

On where face pulls belong, he said: "i would categorize this as a shoulder work but shoulder work is complicated" (LIB-10, round-1 leftover).

**Where it lives.** `synthesis/04_profiles.json > profiles[]` (`id` `swimming_middle`) `> sample_week.shoulder_care_rule` and `injury_prehab` (code `SHOULDER_SWIMMER`); `injury_library.SHOULDER_SWIMMER`. Compiled: `model/rules.json > prehab.by_injury_code.SHOULDER_SWIMMER`. The no-bands rule: `generator_spec_v1.json > rule_tables.equipment.no_variable_resistance`; see [equipment.md](equipment.md).

---

## 11. Step 9: cardio

**Rule.** 0 extra cardio sessions in the gym. The pool is the aerobic work. The swimmer can add one (R3-ATH-01, R3-ATH-04).

The same holds for runners, rowers and endurance cyclists: their practice is the cardio (R3-ATH-04). Any swimmer can still ask for more, as in every plan (R2-SES-06).

**Where it lives.** `synthesis/04_profiles.json > profiles[].aerobic_sessions_wk` (`off_season_or_default` 0, `aerobic_source` `sport_plan`). `generator_spec_v1.json > rule_tables.conditioning.sessions_per_week.sport_is_the_aerobic_work`.

---

## 12. Step 10: the season and the taper

**Rule.** The dryland plan follows the swim season. The volume is highest in the off-season, about 60 % in the pre-season, and low in season (R2-PER-06, PER-08). Before the main championship meet there is a 2-week dryland taper lined up with the swim coach's taper. Before smaller meets there is 1 week or none (R3-ATH-01).

A **taper** is a short stretch of less work before a competition so the athlete arrives fresh.

| Phase | Dryland | Decided by |
|---|---|---|
| Off-season | 3 days + 1 optional. Training blocks that climb like a stairway. Jumps go from 10 % to 25 % plyometric. Olympic lifts 2-3 days. | R3-ATH-01, R3-VOL-04 |
| Pre-season, 4-6 weeks | About 60 % of the off-season sets. More speed and power. | R2-PER-06 |
| In season | About 2 short lifts a week. Bilateral lifting kept low. A light Olympic piece of 2 x 3. | PER-08, UNI-10, R2-ATH-04 |
| Championship taper | 2 weeks before the main meet, in step with the pool taper. 1 week or none before smaller meets. | R3-ATH-01 |
| After the season | The block ends. An easy week or a maintenance phase is a recommendation, not a must. Then the swimmer builds the next plan. | R3-PER-01 |

An in-season week for our swimmer, with a Saturday meet (PROPOSED skeleton):

| Day | Session |
|---|---|
| Monday | The harder lift: core → 1 ballistic jump → hang clean 2 x 3 → squat or trap-bar deadlift, a few fast sets → 1 pull + 1 push → shoulder care |
| Wednesday | A short power and maintenance lift, with shoulder care |
| Friday | Nothing heavy |
| Saturday | Meet |

PROPOSED details: during the taper, cut dryland volume by about 40-60 % and keep the intensity; do the last heavy lift 7-10 days before the main meet; keep the harder in-season lift at least 48 hours before a meet (his 48-hour rule was approved for games, R2-ATH-07); swimmers train through the early meets without a taper; a club swimmer has two seasons a year (short course and long course).

The swim coach tapers the pool. The tool only tapers dryland.

**Why.** He approved the taper as proposed. In round 2 he had already approved a 1-2-week taper for every pre-season and added that the length must stay adjustable:

> "that should always be able to be modified." (R2-PER-06)

**Where it lives.** `synthesis/04_profiles.json > profiles[]` (`id` `swimming_middle`): `season_overrides` (`pre_season`, `in_season`), `in_season_gym.taper`, `season_model`, `sample_week.pre_season`, `sample_week.in_season`. `generator_spec_v1.json > plan_types.season.meet_sports_taper`. The meet date: `inputs_schema.fields.F14`.

---

## 13. Step 11: what the swimmer or the coach can change

**Rule.** The dryland plan is printed once, with every week visible. The tool does not ask how the pool week went. After a hard pool week, the swimmer or the coach lightens dryland by hand.

| They can | Decided by |
|---|---|
| Switch off that day's jump and Olympic block | R3-SES-02 |
| Switch off that day's core block | R3-SES-02 |
| Remove a set or an exercise, or add one | R3-SES-02 |
| Use the recommended supersets to save time | R3-SES-02 |
| Add a cardio session | R2-SES-06 |
| Swap an exercise for another from the same category | GEN-04 |

**Why.**

> "The program would just kick itself out, and then people will adjust accordingly over time." (R3-VOL-04)

**Where it lives.** `generator_spec_v1.json > plan_editing`. `synthesis/04_profiles.json > profiles[]` (`id` `swimming_middle`) `> sport_load_context`.

---

## 14. Young swimmers, masters swimmers, and other water sports

| Who | What changes | Status |
|---|---|---|
| Younger or lower-level swimmers | 2 dryland days | Approved (R3-ATH-01). Keeping the 1 optional day for them, and the cut-off (under about 14, or first-level trainees), are PROPOSED. |
| Under 18 | Simpler exercise lists, lighter medballs, Olympic lifts from the floor from about 14 after a hang block. A parent or guardian is involved. | R2-ATH-08, EQ-06; lists PROPOSED |
| Masters swimmers from 60 | The older-adult defaults: jumps and Olympic lifts off unless switched on | R3-ATH-02 |
| Lap swimming for fitness | Its own activity, `lap_swim`, with 2 gym days | Share 25 % by his rule (R3-ATH-04); the rest PROPOSED |
| Diving | Its own profile, 40 % plyometric | R3-ATH-04 for the share |
| Water polo | Three profiles, 25 % plyometric | R3-ATH-04 for the share |

See [special-populations.md](special-populations.md), [stay-athletic-and-active.md](stay-athletic-and-active.md) and [sports.md](sports.md).

---

## 15. Hotspots and tests

**Hotspots** are the body areas a sport tends to hurt. For swimmers the profile lists four, with care rules. All are PROPOSED, from research.

| Hotspot | What the plan does |
|---|---|
| Swimmer's shoulder | Shoulder care every session (this part is approved, R3-ATH-01). More pulling than pushing. Little overhead pressing. |
| Low back, from arching (butterfly, breaststroke) | Core work against arching first. No loaded arching past neutral. |
| Inner knee, from the breaststroke kick | Hip rotation range and hip strength. Side-to-side single-leg work. |
| Bone loading | Some jumping and heavy lifting all year, because swimming does not load the bones. |

If something hurts, the swimmer or coach applies his pain rule on the printed plan: cut that pattern by 30-50 %, move it to machines or split grips, keep it moving, and drop the exercise if it is too much (VOL-03). They also tell the swim coach or a professional.

**Tests.** The swimmer ticks what to test at the start. Tests happen before the block and in its last week, never in the middle (R2-PER-07).

| Test | Note |
|---|---|
| Jump (standing jump or broad jump) | Start power |
| Strength | A 5-rep or 3-rep best. Never a 1-rep max from zero (R2-PER-07). |
| Medball overhead throw | PROPOSED |
| Pool tests (times, starts, turns) | They belong to the swim coach, not to the tool. |

**Where it lives.** `synthesis/04_profiles.json > profiles[]` (`id` `swimming_middle`): `injuries`, `injury_prehab`, `tests`. See [testing.md](testing.md).

---

## 16. What he confirmed and what is PROPOSED

| Confirmed by him | Still PROPOSED |
|---|---|
| Swimming is in the model (chat) and is the first sample plan (R2-GEN-07) | The three event-group profiles and the five stroke variants |
| 3 dryland days + 1 optional; 2 for younger or lower-level swimmers (R3-ATH-01) | The age and level cut-off for "younger or lower-level" |
| 0 extra cardio in the gym (R3-ATH-01, R3-ATH-04) | Keeping dryland 4 hours from a hard pool session |
| Jumps mostly ballistic, 25 % plyometric at block end (R3-ATH-01, R3-ATH-04) | Weekly jump, throw and Olympic amounts; the small ankle block |
| Olympic lifts 2-3 days (R3-ATH-01) | 3 days for sprint and middle distance, 2 for distance; the lift picks |
| Shoulder care every session, no bands (R3-ATH-01) | The pull-to-push ratio; the exact care exercises per day |
| 2-week dryland taper with the swim taper; 1 week or none before smaller meets (R3-ATH-01) | How much the taper cuts; the last heavy lift 7-10 days out |
| Pre-season about 60 %; in season about 2 lifts (R2-PER-06, PER-08) | The set multipliers per category; the 48-hour rule applied to meets |
| All general rules: core first, power before strength, pairing, the spine rule, the floor of 10, the stairway, editing | The weekly set budget of each profile; which groups come first when time is short |
| | The two-leg : one-leg numbers; the hotspot rules; the sample weeks on this page |

---

## 17. The generated sample plan

The repo holds one generated plan for the swimmer of this page:

| File | What it is |
|---|---|
| `samples/intakes/01-swimming.json` | The answers that went in |
| `samples/plans/01-swimming.en.md` | The plan in English |
| `samples/plans/01-swimming.json` | The same plan as data, with a reason attached to every decision |
| `samples/SAMPLES.md` | Notes on what the engine decided |

That plan is the output of the first engine. Its structure follows the rules on this page. Its dosing is still being rebuilt, and the coach has not graded it yet. When the sample and this page disagree, read the coach's answers.
