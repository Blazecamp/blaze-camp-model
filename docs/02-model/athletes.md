# Athletes: jumps, throws, Olympic lifts and the season

This page explains how the Blaze Camp model trains athletes. The sport's **ground-contact time** decides how much of the jump and throw work is plyometric (short, bouncy contacts) and how much is ballistic (one big push). Jumps are taught in three **Receive-Create stages**: land, land and go, repeat. Everyone in athletic training gets **Olympic lifts**, at their own level. Medballs stay light and fast. Change-of-direction drills are for every athlete. The **season** decides the volume: most in the off-season, about 60 % in the pre-season, about two short lifting days in season. The page gives each rule, the coach's reason in his own words, and the file and JSON key where it lives.

> **How to read this page.** A rule with an answer id was decided by coach Lalo Vera. Ids with no prefix (`ATH-01`, `CAT-10`) are round 1 (`coach_answers_full.md`). `R2-` is round 2 (`coach_answers_round2.md`). `R3-` is round 3 (`coach_answers_round3.md`), the newest. A later round wins. "chat" means something he said in conversation (`coach_chat_statements.md`, `coach_answers.md`). "Approved" means he marked our proposal RIGHT, so the wording is ours and the decision is his. **PROPOSED** means the team designed it and he has not confirmed it. His full answers on this topic: [../03-coach-answers/athletes-and-sports.md](../03-coach-answers/athletes-and-sports.md).

Related pages: [sports.md](sports.md) (every sport and its numbers), [stay-athletic-and-active.md](stay-athletic-and-active.md) (people who play for fun), [special-populations.md](special-populations.md) (older adults, youth, pain), [swimming.md](swimming.md) (a full worked example), [sessions.md](sessions.md), [bilateral-unilateral.md](bilateral-unilateral.md), [plans-and-calendar.md](plans-and-calendar.md), [testing.md](testing.md), [categories.md](categories.md). Terms: [../05-reference/glossary.md](../05-reference/glossary.md).

This is general fitness information, not medical advice. Read [DISCLAIMER.md](../../DISCLAIMER.md) before you use it with anyone.

---

## 1. Who gets athletic training

**Rule.** Athletic training is a block of work early in the session, after the warm-up and the core: jumps, throws, change of direction, sprints and Olympic lifts. The coach calls this family **athletic patterns**. A person gets it through one of three doors.

| Door | Who | What the tool asks | Read |
|---|---|---|---|
| Competitive sport | Someone who competes and has a season | Sport, position (optional), level of play, season date, practice and game days | this page and [sports.md](sports.md) |
| Stay athletic and active | Someone who plays for fun: pickleball, HYROX, a rec league, running | The activity only. No position, no season. Play days and an event date are optional | [stay-athletic-and-active.md](stay-athletic-and-active.md) |
| No sport | Someone who picks the choice "No sport, I just want to be athletic" | Nothing more | the all-round profile `weekend_warrior` |

People whose goal is muscle (aesthetics, bodybuilding) or strength (powerlifting) do not get this block. This is OBSERVED: his aesthetics and strength templates have no athletic block.

**Rule.** Athletic work never counts as muscle sets. It is counted in its own units: contacts (one landing), throws, cuts (one change of direction), metres and Olympic sets.

**Why.** He said different athletes need different amounts of each thing:

> "Different athletes need different things." (chat)

On counting:

> "I don't believe that Olympic lifts, sprints, throws, and plyos are going to count towards specific muscles because there are so many things happening at so many different levels." (VOL-10)

**Where it lives.** Goal and sport questions: `generator_spec_v1.json > inputs_schema.fields` (`F07` goal, `F11a` compete or not, `F11` sport, `F12` position, `F13` level of play, `F14` season, `F15` practice and games, `F11r` activity). Choosing the profile: `generator_spec_v1.json > derived_values.D2_profile`. Counting rule: `generator_spec_v1.json > rule_tables.athletic.counting` and `never_counts_to_muscles`. The athletic categories: `synthesis/01_taxonomy.json > nodes` (ids that start with `AP`).

---

## 2. Ground-contact time decides plyometric vs ballistic

**Rule.** Look at how long the athlete's foot stays on the ground in the sport. A short time on the ground means more **plyometric** work. A long time on the ground means more **ballistic** work. Every athlete gets some of both.

Three terms, in plain words:

- **Ground-contact time**: how long the foot is on the ground in the sport's key actions (a sprint step, a jump take-off, a punch from a planted stance).
- **Plyometric** work (he says "plyos"): short, bouncy contacts. You land and leave the ground again at once.
- **Ballistic** work: a longer contact or one big effort. You push hard once and let go.

**Which exercise is which** (approved, R2-ATH-02):

| Ballistic (longer contact or one big effort) | Plyometric (short, bouncy contacts) | Landing only |
|---|---|---|
| squat jumps, box jumps, broad jumps, loaded or hex-bar jumps, medball throws | pogo and ankle hops, hurdle hops, depth jumps, bounds, squirrel jumps, repeated jumps | stick-the-landing drills (the "receive" stage, see section 3) |

Kettlebell swings are ballistic too. He said they "are mostly supposed to be used for the ballistic movements, not for resistance training" (R2-VOL-05).

**The share by sport.** The number below is the share of jump and throw work that is plyometric at the end of a training block. The rest is ballistic. He approved these shares sport by sport (R2-ATH-01 for the first list, R3-ATH-04 for the second).

| Time on the ground | Plyometric share at the end of a block | Share at the start of a block | Sports he confirmed in round 2 | Sports he confirmed in round 3 |
|---|---|---|---|---|
| Very short | 75 % | 60 % | sprinters | runners |
| Short | 60 % | 45 % | volleyball, soccer, football skill positions | lacrosse, field hockey, flag football, ultimate cutters, rugby sevens, high jump, pole vault, gymnastics, cheer flyers |
| Mixed | 50 % | 35 % | basketball, tennis, football big-skill positions, weekend warriors | beach volleyball, pickleball, padel, rugby backs, goalkeepers, javelin, HYROX |
| Long | 40 % | 25 % | baseball, softball, hockey, linemen, MMA | rugby forwards, cheer bases, throwers, diving, alpine skiing, cycling |
| Very long or grounded | 25 % | 10 % | boxing, karate, kickboxing, wrestling, BJJ, golf | swimming, water polo, rowing, judo, taekwondo, climbing |

How the share is used:

| Detail | Rule | Decided by |
|---|---|---|
| Start of a block | Each block starts 15 points more ballistic than it ends. A 50 % sport starts at 35 %. | R2-ATH-01 |
| Direction of travel | Programs start more ballistic and slowly become more plyometric. | CAT-10 |
| What is counted | Jump work and throw work together. Medball throws sit on the ballistic side. | R2-ATH-01, R2-ATH-02 |
| How to read his sport ranking | As fast, bouncy contacts, not as total jumps. | R2-ATH-01 |
| People who play for fun | They use their activity's share (golf 25 %, running 75 %, rec soccer 60 %). "A bit of everything" stays 50 %. | R3-ATH-04 |
| Aesthetics, bodybuilding, powerlifting | No jump block at all. | OBSERVED: his aesthetics and strength templates have no athletic block; ATH-05 for medballs |
| Age 60 and over | Landing drills stay on. Ankle hops, other jumps and depth jumps are off unless the person switches them on. See [special-populations.md](special-populations.md). | R3-ATH-02 |

The five rows are our way to file the shares he approved. In the data they are called classes 1 to 5. The seconds behind each class (for example under about 0.25 s for a "short" contact) come from research, not from him: PROPOSED. Sports that are in neither of his lists were placed by the same rule and are PROPOSED. [sports.md](sports.md) marks each one.

**Why.** His reason is the sport itself:

> "If the athlete has more plyo work in their sport, then we give them more plyo work. If they have less plyo work or less time to be off the ground, the more time they're on the ground, the less plyos I really need to be giving them, and more ballistics I can give them for power." (ATH-01)

> "The more time on the ground they have to have, like a karate athlete, the more ballistics and less plyos. The less time on the ground, like a sprinter, the more plyos and less ballistics. But both of those ranges are important" (ATH-01)

Why blocks start ballistic:

> "Usually, they start the programs with more ballistic movements, and then slowly and gradually we go into more plyometric movements because we're trying to work on the connective tissue resistance and endurance, and just overall structure." (CAT-10)

**Where it lives.**

| What | File and key |
|---|---|
| The rule, the two exercise lists, the start rule | `generator_spec_v1.json > rule_tables.athletic.plyo_vs_ballistic` (`rule`, `classes`, `lists_approved`, `start_rule`, `end_of_block_by_sport_approved`) |
| Round-3 shares | `generator_spec_v1.json > rule_tables.athletic.plyo_share_remaining_sports` |
| The classes and what he approved | `synthesis/04_profiles.json > ground_contact_model` (`classes`, `plyo_pct_by_class`, `approved_v1_2`) |
| Each sport's own share | `synthesis/04_profiles.json > profiles[].ground_contact` (`class`, `plyo_share_pct`, `plyo_share_start_pct`, `evidence`) and `profiles[].power_mix_by_phase` |
| Compiled copy the engine reads | `model/rules.json > athletic` (`ground_contact_classes`, `block_start_offset`, `classification`) and `model/profiles.json > sports.<profile>.plyo_share` |
| Master text | `BLAZE_CAMP_BRAIN.md` §9.1 (rules A1-A4) and §9.2 |

---

## 3. Receive-Create stages

**Rule.** The body learns to **receive** force before it learns to **create** force. Jumps are taught in three stages. The name "Receive-Create stages" and the weeks are approved (R2-ATH-03).

| Stage | Short name | His words | What the athlete does | Examples | 12-week plan | 8-week plan |
|---|---|---|---|---|---|---|
| 1 | Land | "receive and pause" | Lands and holds the landing | stick-the-landing drills, a depth drop that you stick, 'Push up Stick the Landing' (hands start on the box and land on the floor, LIB-02) | weeks 1-3 | weeks 1-2 |
| 2 | Land & Go | "receive and then create" | Sticks the landing, then does one jump or hop | stick the landing then jump, a drop into a box jump | weeks 4-7 | weeks 3-5 |
| 3 | Repeat | "repetitively receiving and creating" | Bounces again and again without stopping | repeated hops, hurdle hops, pogos, bounds | weeks 8-12 | weeks 6-8 |

Rules that go with the stages:

| Rule | Decided by |
|---|---|
| Restart at stage 1 each off-season. | R2-ATH-03 |
| Stay at the same stage during a maintenance block. | R2-ATH-03 |
| Intermediate and advanced athletes may start at stage 2. | R2-ATH-03 |
| Single-leg hops and jumps are harder than two-foot ones. | CAT-10 |
| Inside each stage the plan puts two feet before one foot. | PROPOSED (our reading of CAT-10) |
| A stage is a way to **do** a jump. It is not a label on the exercise. For example, the same hurdle hop can be done as a stick, as one rebound, or as repeated hops (our example). | CAT-11 |
| The stages are not the "zones" from Dr. Pat Davidson's book. Those zones describe body positions in lifting. See [levels-and-zones.md](levels-and-zones.md). | CAT-10 |
| Loaded jumps use 10-20 % of body weight. The load is too heavy when jump height or speed clearly drops. | EQ-15 |
| Box heights for depth drops: low about 6-12 in, medium about 12-18 in, high = above the hip. Hurdles: 6 in for moderate, 12 in or more for advanced. | EQ-16 |
| Advanced hurdle hops = taller hurdles and continuous quick contacts. | LIB-04 |
| His library has two MODERATE jump columns (plate hops and hurdles). The plan takes one jump from each, not one column by sport. | LIB-05 |

PROPOSED (from research and our reading, not confirmed by him): a cap on jump contacts per session (80 for beginners, 100 for intermediate, 120 for advanced); two or three jump sessions a week in the off-season with 48-72 hours between them; unloaded jumps before loaded jumps; the weekly number of contacts, throws and cuts for each sport.

**Why.** He explained the order:

> "Your body and your connective tissue need to learn how to receive forces before we teach it how to create." (CAT-10)

> "The beginning of a program might have a lot more receiving, like stick-the-landing drills and things like that." (CAT-10)

On the name, he said it is not a zone, it is a way of doing the jump:

> "it's more like the way I want the plyos to be done" (CAT-11)

**Where it lives.**

| What | File and key |
|---|---|
| Stage names, weeks and rules | `generator_spec_v1.json > rule_tables.athletic.method_stage` |
| Stages with examples | `synthesis/04_profiles.json > ground_contact_model.plyo_method_stages` |
| Stage weeks for any plan length | `model/rules.json > athletic.stages.weeks_by_N` |
| Heights and loaded-jump loads | `model/rules.json > athletic.heights` and `athletic.loaded_jump_bw_pct` |
| Session caps (PROPOSED) | `generator_spec_v1.json > rule_tables.athletic.contacts_per_session_max` and `plyo_sessions` |
| Master text | `BLAZE_CAMP_BRAIN.md` §9.3 |

---

## 4. How much: his ranking and his two groups

**Rule.** Sports are ranked by how much plyometric work they need. From most to least (ATH-02, confirmed):

basketball ≈ volleyball > sprinters > football skill positions > soccer > MMA > tennis > baseball > hockey > wrestling and BJJ > boxing ≈ karate > golf. (≈ means about the same.)

**Rule.** Some athletes need more resistance training. Others need more speed and power (ATH-03, confirmed).

| Needs more resistance training (strength and size) | Needs more speed and power |
|---|---|
| football linemen, wrestlers, rugby, heavyweight fighters, throwers | sprinters, basketball, skill positions, volleyball |

**Why.** In conversation he said that basketball players need more plyos, boxers and karate athletes don't need that many, and MMA fighters need more than boxers but fewer than basketball players. He summed it up in four words:

> "Play with the volume." (chat)

The weekly amounts in each sport profile (contacts, throws, cuts, sprint metres, Olympic sets) follow this ranking. He gave the order, not the numbers. The numbers are PROPOSED.

**Where it lives.** `generator_spec_v1.json > rule_tables.athletic.plyo_volume_ranking` and `resistance_vs_speed_groups`. Per sport: `synthesis/04_profiles.json > profiles[]` fields `plyo`, `throwing`, `cod`, `sprint`, `triple_ext`, `ath03_group`. Compiled: `model/profiles.json > sports.<profile>.athletic_weekly` and `tiers`.

---

## 5. Olympic lifts for everyone in athletic training

**Rule.** Every person in athletic training gets Olympic lifts. Beginners get simple versions. Intermediate and advanced athletes get the full lifts.

**Olympic lifts** are cleans, snatches, jerks and their simpler versions. His sheets file them under 'TRIPPLE EXTENSION' (his spelling): the hips, knees and ankles straighten together to move the weight fast.

| Item | Rule | Decided by |
|---|---|---|
| Who | Everyone in athletic training. Not people training only for muscle or only for powerlifting. | ATH-10 |
| Beginners and early intermediates | Dumbbell and kettlebell snatches, single-arm dumbbell snatch, kettlebell squat clean, hang clean, hang pulls, hex-bar jumps. No bumper plates needed. | ATH-10, R2-LIB-07 |
| Intermediate and up | "The full scope" of the lifts, up to the squat snatch, squat clean and squat clean & jerk. The steps in between (hang and power versions with the barbell first) are PROPOSED. | ATH-10, LIB-07 |
| Names | 'Snatch', 'Clean' and 'Clean & Jerk' in his library are the full squat versions. The word "squat" is added to the name. | LIB-07 |
| Push press and push jerk | The push press is easier. The push jerk is more technical: intermediate or advanced. | LIB-13 |
| How often | Up to four times a week. | R2-ATH-04 |
| Which day | Clean days go with the squat pattern. Snatch days go with the hinge pattern. | R2-ATH-04 |
| Reps: dumbbell, kettlebell and pull versions | His ramp: 4 x 8 at 75 %, then 4 x 6 at 80 %, 4 x 6 at 85 %, 4 x 4 at 90 %. | PER-09, R2-ATH-05 |
| Reps: full squat cleans and snatches | 3-5 reps per set, with the same weekly reps (for example 6 x 5 at 75 %). | R2-ATH-05 |
| Load | By effort when the lift has not been tested: reps in reserve (how many more reps you could have done) or RPE (how hard it felt). A percentage only when the athlete has a tested best for that same lift. The plan explains the lifts as power output. Percentage-based programming belongs to competitive Olympic lifters. | R2-GEN-06, R2-ATH-05 |
| Speed check | The coach's eye: the lift must stay fast and powerful. | R2-ATH-05 |
| In season | A light piece: 2 sets of 3 (hang power clean or dumbbell snatch), dropped in heavy game weeks. | R2-ATH-04 (approved) |
| Without bumper plates | Dumbbell and kettlebell snatches and cleans, hex-bar jumps, hang pulls. | ATH-10 |
| Youth | From the floor from about age 14, after one block of hang work. | R2-ATH-08 |
| Age 60 and over | Off by default. Can be switched on with a warning. | R2-ATH-08, R3-ATH-02 |
| Competitive weightlifters | Their sport needs its own percentage-based program. It is not written yet. | R2-GEN-06 |
| Contrast work (a heavy lift followed at once by a jump) | Intermediate and advanced athletes, off-season only, heavy lift at about 78-85 %, no rest inside the pair. | ATH-12 |

One reading to know about. We proposed a light piece once a week in season. He approved it and added that it "doesn't need to be once a week". The model reads this as: up to four times a week is the general ceiling, and in season the light piece sits on one or two gym days. The in-season count is PROPOSED. The number of Olympic days per sport in the off-season is also PROPOSED, except for swimmers (2-3 days, R3-ATH-01).

**Why.**

> "If you're a field athlete, you're going to do more of the Olympic lifts, and even if you're a beginner, you can do a lot of the dumbbell, kettlebell, snatches, hex bar jumps, and hang pulls. Those are still going to be there, so everyone gets Olympic lifts." (ATH-10)

On frequency and which day:

> "According to my programming, it could be done four times a week. Some days are about cleans, and some days are about snatches or snatch style. I take them as more of a squatty pattern and a hinging pattern. I take snatches a little bit more hingy than squatty" (R2-ATH-04)

On load:

> "Olympic lifts should be explained on there easily: these are for power output, and they don't necessarily need to go by percentage unless you're a competitive Olympic lifter." (R2-GEN-06)

**Where it lives.** `generator_spec_v1.json > rule_tables.athletic.olympic` (`who`, `frequency`, `reps`, `load`, `older`, `youth`) and `rule_tables.athletic.contrast`. By level: `synthesis/04_profiles.json > olympic_by_level`. Per sport: `profiles[].olympic_policy` (`off_season_exposures_wk`, `pattern_split`, `in_season`). Compiled: `model/rules.json > olympic` and `model/profiles.json > sports.<profile>.olympic`. Master text: `BLAZE_CAMP_BRAIN.md` §9.5.

---

## 6. Medballs

**Rule.** Medicine balls are for speed. Keep them light and throw them fast. Never use a ball over 20 lb.

| Item | Rule | Decided by |
|---|---|---|
| Passes and rotations | 8-10 lb | chat, EQ-06 |
| Overhead throws | 6-10 lb | EQ-06 |
| Sit-up throws | 6-8 lb | EQ-06 |
| Slams | 10-20 lb, with a slam ball | EQ-06 |
| Heaviest ball | 20 lb, never more. A ball heavier than the 8-10 lb speed ball is only for something specific, like a heavy medball hang clean or wall balls. | EQ-06 |
| Youth and older clients | Lighter | EQ-06 |
| How much, by sport | High for baseball, boxing, MMA, tennis and golf (rotation). Moderate for basketball and football. | ATH-05 |
| Aesthetics and bodybuilding | None in the main workout. It may be used in the warm-up. | ATH-05 |
| Levels | None. "No levels in throws, just do them right" | LIB-06 |
| Dose | His 'ALL LIST' is one pass through all of his roughly 19 throws, 1 set of 10 each, about 200 throws. Using 1 x 10 as the dose for any single throw is our reading: PROPOSED. | LIB-22 |
| No medball | Plyo push-ups, fast cable rotations, or the "fake medball slam" with no ball. Never band chops. | EQ-07 |
| How throws are counted | As ballistic work, inside the plyometric vs ballistic share. Never as muscle sets. | R2-ATH-02, VOL-10 |
| Pitchers | Rotational throws kept light. | ATH-08 |
| HYROX wall balls | Conditioning, not muscle sets. The race ball, never over 20 lb. | R3-ATH-03 |

**Why.** A heavy ball is a slow ball:

> "The heavier I go, the slower I'm going to be. The lighter I go, ideally, the faster I can be." (chat)

> "I don't really need any med ball throwing for aesthetics." (ATH-05)

> "I don't think there's any need for anything more than 20 lbs., to be honest." (EQ-06)

The amount for sports he did not name in ATH-05 is PROPOSED.

**Where it lives.** `generator_spec_v1.json > rule_tables.athletic.medball` (`rule`, `loads_lb`). `synthesis/04_profiles.json > medball_rule` and `profiles[].medball_policy`. Compiled: `model/rules.json > medball`. The throw categories: `synthesis/01_taxonomy.json > nodes` (ids that start with `AP.THR`). See also [equipment.md](equipment.md).

---

## 7. Change of direction and speed

**Rule.** Change-of-direction work is for every athlete. **Change of direction** (COD) means planned cuts and turns. His library names the drills after football routes (FADE, SLANT, POST and so on) and sorts them by how sharp the turn is.

| Item | Rule | Decided by |
|---|---|---|
| Who | Every athlete, not only football players. | ATH-06 |
| Levels | By turn angle: 'EASY TURN', then 'MOD. TURN', then 'HARD TURN'. | ATH-06 |
| Tests | The L-test (three cones) and the 5-10-5 pro agility drill. | LIB-01 |
| Speed session order | Squirrel jumps, then MACH drills or acceleration starts, then max-velocity sprints. | LIB-21 |
| In season, game-heavy sports | No extra change-of-direction work in the gym. | R2-ATH-07 |
| Side-to-side and rotational single-leg work | More for court and combat athletes (basketball, tennis, soccer, MMA). Little for aesthetics. | UNI-12, LIB-20 |
| Weight in the opposite hand (contralateral) | For athletes who change direction a lot. It helps them get into the hip. | CAT-13 |
| Weight in the same hand (ipsilateral) | For sprint acceleration. It helps them get out of the hip fast. | CAT-13 |

**Why.** On the two ways to hold the weight in a lunge or step-up, he named the athletes:

> "usually it's more for change-of-direction athletes." (CAT-13)

He listed football players who run routes, soccer players, basketball players "a lot" and tennis "definitely". For a 100-metre sprinter he uses the other side: "I need them to get out of the hip really quick." (CAT-13). The full rule is on [bilateral-unilateral.md](bilateral-unilateral.md).

PROPOSED: the weekly number of cuts and sprint metres per sport; the share of side-to-side single-leg work (about 45-50 % for court and combat sports, about 10 % for aesthetics); a first reactive drill (split-step reaction) for court sports. His library defines reactive agility but lists no exercises for it yet.

**Where it lives.** `generator_spec_v1.json > rule_tables.athletic.cod` and `speed_session_order`. Categories: `synthesis/01_taxonomy.json > nodes` (`AP.COD`, `AP.AGI`, `AP.SPD`) and the turn facet `F.TURN` in `facets`. Per sport: `synthesis/04_profiles.json > profiles[].cod`, `profiles[].sprint`, `profiles[].contra_ipsi`, `profiles[].frontal_transverse_unilateral_pct`.

---

## 8. Aerobic work for athletes

**Rule.** The number of aerobic sessions depends on the sport and the season. Every number is a starting point. The person can ask for more or less.

His aerobic sessions come in three colours. **Blue** is short and hard. **Green** is moderate, with efforts of about one to three minutes. **Orange** is long and easy. A normal week has one of each. This is OBSERVED in his sheet, tab 'AEROBIC CAPACITY CHEAT SHEET'.

| Who | Sessions a week | Decided by |
|---|---|---|
| Off-season: baseball, softball, sprinters | 2 | R2-ATH-06 |
| Off-season: basketball, volleyball, football, tennis, golf, boxing, BJJ | 3 | R2-ATH-06 |
| Off-season: soccer, hockey, kickboxing, karate | 3-4 | R2-ATH-06 |
| Off-season: MMA, wrestling | 4 | R2-ATH-06 |
| Off-season: the sports he did not name | 2-4, placed like the list above | R3-ATH-04 (range approved; the exact number per sport is PROPOSED) |
| Swimmers, runners, rowers, endurance cyclists | 0 extra in the gym. Their practice is the cardio. The person can add one. | R3-ATH-01, R3-ATH-04 |
| Pre-season | 2 | R2-ATH-06 |
| In season | 2 | ATH-07 |
| Powerlifters | 2 easy (Orange) | R2-ATH-06 |
| HYROX | 4 (Blue, Green, Orange and a second Orange) | R3-ATH-03 |
| Fighters | The cardio that opens their day is a real aerobic block, not a warm-up. | ORD-09 |

Other rules: any machine works (run, bike, rower, ski erg), tracked by time, distance or calories (EQ-14). Water polo and triathlon also get 0 extra sessions by the same logic, but he was not asked about them: PROPOSED.

**Why.** On adjusting:

> "You can always say, "I need more cardio," and then it just adds it to the program." (R2-SES-06)

**Where it lives.** `generator_spec_v1.json > rule_tables.conditioning` (`sessions_per_week`, `colours`, `rules`). Per sport: `synthesis/04_profiles.json > profiles[].aerobic_sessions_wk` (`off_season_or_default`, `pre_season`, `in_season`, `aerobic_source`, `evidence`). Compiled: `model/profiles.json > sports.<profile>.aerobic`. How the tool picks the number: `generator_spec_v1.json > derived_values.D14_aerobic_sessions`.

---

## 9. What an athlete's session looks like

**Rule.** Power comes before strength, and core comes first of all. A field athlete far from competition can have up to 12 exercises plus 2 core exercises.

| Order | Block | What is in it | Decided by |
|---|---|---|---|
| 0 | Warm-up | 5 minutes of any cardio plus running drills or mobility. Never counted. | ORD-08 |
| 1 | Core | 2 exercises x 2 sets, light, short of failure. The person can move it. | ATH-11, R2-SES-03 |
| 2 | Jumps and throws | Plyometric or ballistic by the sport's share, at the stage of the week. | sections 2 and 3 |
| 3 | Change of direction, sprints | By turn angle; the speed order of section 7. | ATH-06, LIB-21 |
| 4 | Olympic lift | Before any strength work. | ORD-03, ATH-10 |
| 5 | Main strength lift and its partner | A knee-dominant lift (squat and lunge family) with a pull. A hip-dominant lift (hinge family: deadlifts, hip thrusts) with a push. | ORD-02, ORD-06, UNI-11 |
| 6 | Accessories | 2-4 exercises for each muscle group trained that day. Calves: one exercise x 3 sets on every leg day. | R2-SES-05, R3-SES-01 |

Session size, in his words, for an off-season field athlete: about 3 jump or ballistic exercises, 2 or 3 Olympic or power lifts, and about 4 resistance exercises, so "max maybe 12 different exercises" (VOL-08). Round 2 settled it as 12 exercises plus the 2-exercise core block (R2-SES-04). Round 3 settled the layout (R3-SES-01): most athletes use the **cross pattern** (a knee-dominant lift with a single-leg hip lift on the same day), which leaves room for 2 jump or throw stations and 1 Olympic lift. Size-focused and high-level athletes use his **same-pattern** athletic template, with 3-4 jump stations. He gave the order core, then jumps, then Olympic lifts, then resistance work (VOL-17). Where throws and change-of-direction drills sit between the jumps and the Olympic lift is the model's order: PROPOSED. A good session for an athlete lasts about an hour and a half, two hours at most (UNI-09).

**Why.** On core:

> "we need all the core work to be done first." (ATH-11)

The full session rules are on [sessions.md](sessions.md).

**Where it lives.** `generator_spec_v1.json > rule_tables.athletic.field_athlete_cap`, `rule_tables.ordering`, `rule_tables.core_block`, `rule_tables.session_limits`. Templates: `synthesis/05_templates.json > generator_split_templates` (family `athletic`). Master text: `BLAZE_CAMP_BRAIN.md` §10.2.

---

## 10. The season

**Rule.** A competitive athlete's year has four phases. The plan follows them.

The tool asks for the next season start date (or "in season until") and the practice and game days per week. It works out the phase from the dates (R2-GEN-05). The model adds a third choice, a competition, fight or meet date: PROPOSED.

| Phase | Resistance volume | Athletic work | Both legs vs one leg | Decided by |
|---|---|---|---|---|
| **Off-season** (no games) | The most volume. Training blocks that climb like a stairway. | Starts ballistic and becomes plyometric. Stages 1 to 3. Olympic lifts up to 4 times a week. Contrast work for intermediate and advanced athletes. | The sport's normal share | PER-08, R2-ATH-01, R2-ATH-03, R2-ATH-04, ATH-12 |
| **Pre-season** (the 4-6 weeks before the first game) | About 60 % of off-season sets. | More speed and power. The jump stage stays where it is. | Less bilateral, more single-leg | R2-PER-06, R2-ATH-03, UNI-10 |
| **In season** (games) | About 2 lifting days a week, low volume. | See section 11. | Bilateral kept to a minimum | PER-08, UNI-10 |
| **Post-season** (after the last game) | Recovery and general work. | PROPOSED: none at first. | - | PER-08 |

More rules:

| Rule | Decided by |
|---|---|
| The pre-season ends with a 1-2-week **taper** before the first game. A taper is a short stretch of less work so the athlete arrives fresh. Its length can be changed. How much to cut is PROPOSED. | R2-PER-06 |
| Rep phases for compound lifts, one per block, for every athlete: VOL 1 (12-15 reps) early in the off-season, VOL 2 (8-12) in the middle, VOL 3 (6-8) late in the off-season or in the pre-season. | PER-11 |
| His 'STARTING / MID / ADVANCED OFF SEASON' templates can be three blocks in a row or three athlete levels. "Depends on whatever is needed." | PRG-04 |
| No easy week is ever placed inside a training block. | R2-VOL-07 |
| After a block ends, an easy week is a recommendation, not a must. | R3-PER-01 |
| Fight and competition prep uses 2-week steps and waves instead of smooth weekly steps. This is a round-1 answer. In round 2 he said the stairway "goes for every plan" (R2-PER-03) and he was not asked about fight prep again. The model keeps the 2-week steps as the shape of that stairway: PROPOSED reading. | PER-10 |
| Swimmers: a 2-week dryland taper lined up with the swim coach's taper before the main championship meet. | R3-ATH-01 |
| Tests are ticked at the start and done before the block and in its last week, never in the middle. The menu for athletes: strength, a 1-mile run or an erg time trial, a 10-30 m sprint, the 5-10-5, the L-test, jumps and body weight. Nobody tests a 1-rep max or an all-out mile from zero. See [testing.md](testing.md). | PER-07, R2-PER-07 |

**Why.** On the two halves of leg training through the season:

> "I would like for them to keep their bilateral work more minimal so that they're not trying to drive changes in their body during their season. I just want them to maintain their strength and their potentiation, and have their nervous system be up high and be able to be powerful." (UNI-10)

PROPOSED: the exact set multipliers for each phase and category; the season types for each sport (team sports with many games, meet sports that peak at the end, combat sports with a fight date, tournament sports, endurance races); how the plan handles a week with three or more games (keep only the light day); printing the off-season and pre-season once and building the in-season plan afterwards.

**Where it lives.** `generator_spec_v1.json > plan_types.season` (`calendar`, `off`, `pre`, `in`, `post`) and `derived_values.D4_season_phase`. Per sport: `synthesis/04_profiles.json > profiles[].season_overrides` (`pre_season`, `in_season`) and `season_families`. Compiled: `model/profiles.json > sports.<profile>.pre_season` and `in_season`. Plans and blocks: [plans-and-calendar.md](plans-and-calendar.md). Master text: `BLAZE_CAMP_BRAIN.md` §9.8 and §11.

---

## 11. In-season rules

**Rule.** In season the gym keeps the athlete strong, fast and healthy. It does not try to change the body.

| # | Rule | Decided by |
|---|---|---|
| 1 | About 2 lifting days a week, low volume. | PER-08 |
| 2 | Bilateral lifting stays minimal. Single-leg work keeps range of motion and health. | UNI-10 |
| 3 | What fills the days depends on the athlete: sprints for speed athletes, strength maintenance for most others, high jumps for some. | PER-08 |
| 4 | **Game-heavy sports**: gym plyos at about half. | R2-ATH-07 |
| 5 | Game-heavy sports: no extra change-of-direction work. | R2-ATH-07 |
| 6 | Game-heavy sports: sprints only for speed athletes. | R2-ATH-07 |
| 7 | Game-heavy sports: the one hard gym day is at least 48 hours before a game. | R2-ATH-07 |
| 8 | Olympic lifts: a light piece of 2 sets of 3, dropped in heavy game weeks. | R2-ATH-04 |
| 9 | 2 aerobic sessions a week. | ATH-07 |
| 10 | No contrast work. It is for the off-season. | ATH-12 |
| 11 | No easy week is placed inside a block. | R2-VOL-07 |

**Game-heavy sports** are sports where the games already give the athlete jumps and sprints. He confirmed the list in two steps:

| Round | Sports |
|---|---|
| R2-ATH-07 | basketball, volleyball, soccer, football, hockey |
| R3-ATH-04 | lacrosse, field hockey, rugby, ultimate, flag football, beach volleyball |

The same rule is applied to cheer, gymnastics, competitive pickleball, tennis, padel and wrestling, and to the routed sports that borrow those profiles. He was not asked about them: PROPOSED.

**Why.**

> "for speed athletes, it'll be sprints on the on-season, but for other athletes, it might be just maintenance of strength. For some athletes, it might be high jumps. It can be different things." (PER-08)

**Where it lives.** `generator_spec_v1.json > rule_tables.athletic.in_season_game_heavy` (`rule`, `sports`, `still_inferred`). `synthesis/04_profiles.json > in_season_content` and `profiles[].in_season_gym` (`lift_days_wk`, `game_heavy`, `hard_day_rule`). Compiled: `model/rules.json > athletic.in_season_game_heavy` and `model/profiles.json > sports.<profile>.in_season`.

---

## 12. Rules he gave for specific athletes

| Athlete | Rule | Decided by |
|---|---|---|
| Boxers and other strikers | When punching volume is high, bring pressing and arm volume down. Do not cut it to zero. Keep the rows and the rotational throws. | ATH-04 |
| Baseball pitchers | Less overhead pressing, more arm care, rotational throws kept light. | ATH-08 |
| High school, college, pro | The same plan. Weights and speeds change with the athlete. Pros need more care for their body. He said this about his baseball program. The model applies it to every sport (our reading). | PRG-09 |
| Competitive Olympic weightlifters | Their own percentage-based program. | R2-GEN-06 |
| Swimmers | Their own approved dryland defaults. See [swimming.md](swimming.md). | R3-ATH-01 |
| HYROX | Its own approved plan. See [stay-athletic-and-active.md](stay-athletic-and-active.md). | R3-ATH-03 |
| Older athletes, youth athletes | See [special-populations.md](special-populations.md). | R2-ATH-08, R3-ATH-02 |

**Why.** On boxers:

> "don't completely cut it." (ATH-04)

On levels of play:

> "High school is the same as college, the same as pro, essentially." (PRG-09)

The size of the cut for strikers (to about half to two thirds) and what "more care" means for pros are PROPOSED.

**Where it lives.** `generator_spec_v1.json > rule_tables.athletic.strikers` and `pitchers`. `synthesis/04_profiles.json > competition_level`. The level-of-play question: `generator_spec_v1.json > inputs_schema.fields.F13`.

---

## 13. What the athlete or coach can change

**Rule.** The plan comes out whole, with every week visible. There are no check-ins and nothing is tracked. The athlete or the coach adjusts it by hand.

| They can | Decided by |
|---|---|
| Switch off a day's athletic block (jumps, throws, agility, sprints, Olympic lift) | R3-SES-02 |
| Switch off a day's core block | R3-SES-02 |
| Remove or add exercises or whole blocks | R3-SES-02 |
| Use the supersets the plan recommends to save time | R3-SES-02 |
| Ask for more or less cardio | R2-SES-06 |
| Move the core block to another place in the session | ATH-11 |

Switching off athletic work does not change any muscle's weekly sets, because athletic work is never counted as muscle sets.

**Why.**

> "they should be able to turn off that day's athletic training or that day's core training and just focus on resistance." (R3-SES-02)

> "I want them to be able to kick out a program, and that's it." (R3-VOL-04)

**Where it lives.** `generator_spec_v1.json > plan_editing` and `rule_tables.athletic.block_toggle`. Full guide: [sessions.md](sessions.md).

---

## 14. What is still PROPOSED

These parts are the team's design. He has not confirmed them.

| Item | Where it is used |
|---|---|
| The seconds of ground contact behind each class | section 2 |
| The share for sports in neither of his lists (for example quarterbacks, kickers, triathlon, freestyle skiing, strongman) | [sports.md](sports.md) |
| Reading "goalkeepers 50 %" as soccer, lacrosse and field hockey goalkeepers | [sports.md](sports.md) |
| Weekly contacts, throws, cuts, sprint metres and Olympic sets per sport | section 4 |
| Contact caps per session and the 48-72 hour spacing; two feet before one foot inside each stage | section 3 |
| The steps between the beginner lifts and the full squat lifts | section 5 |
| 1 set of 10 as the dose for a single throw | section 6 |
| Where throws and change-of-direction drills sit in the session order | section 9 |
| The competition-date choice in the season question; no athletic work at the start of the post-season | section 10 |
| Keeping 2-week steps and waves for fight prep after round 2 said the stairway goes for every plan | section 10 |
| Applying "high school is the same as college, the same as pro" (said about baseball) to every sport | section 12 |
| Olympic days per sport, and the in-season count | section 5 |
| The exact off-season aerobic number for sports he did not name | section 8 |
| Set multipliers per phase, season types per sport, heavy game weeks | section 10 |
| The game-heavy rule for cheer, gymnastics, competitive pickleball, tennis, padel, wrestling and the routed sports | section 11 |
| The size of the pressing cut for strikers; what "more care" means for pros | section 12 |
| The bilateral : unilateral numbers for most sports (he gave the scale and the two ends) | [bilateral-unilateral.md](bilateral-unilateral.md) |
| Injury hotspots per sport | [special-populations.md](special-populations.md) |

---

## 15. Where everything lives

| What | File | Key |
|---|---|---|
| The rules of this page | `generator_spec_v1.json` | `rule_tables.athletic`, `rule_tables.conditioning`, `plan_types.season` |
| Every sport and activity profile | `synthesis/04_profiles.json` | `profiles[]` (127 profiles), `sports.list` (52 sports), `activities.list` (26 activities) |
| The same profiles, explained in text | `synthesis/04_athlete_profiles.md` | sections 4 and 8 |
| Compiled data the engine reads | `model/profiles.json`, `model/rules.json` | `sports`, `picker`; `athletic`, `olympic`, `medball`, `conditioning` |
| The master document | `BLAZE_CAMP_BRAIN.md` | §9 |
| His answers | `coach_answers_round3.md`, `coach_answers_round2.md`, `coach_answers_full.md` | ids `R3-ATH-01..05`, `R2-ATH-01..08`, `ATH-01..13` |

The engine in `engine/` and the compiled files in `model/` are being rebuilt. When they disagree with a coach answer, the coach answer wins.
