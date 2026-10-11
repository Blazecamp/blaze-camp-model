# Coach answers: Athletes and sports

What changes for an athlete, sport by sport, and for people who just want to stay athletic and active. "Different athletes need different things." The main dial is ground-contact time: the less time the sport spends on the ground, the more plyometric work (short, bouncy contacts); the more time on the ground, the more ballistic work (one big effort). Everyone in athletic training gets Olympic lifts, in a version that fits their level. There are no rules by sex. Older adults, youth, swimmers, HYROX and pickleball players each have their own approved defaults.

This page is part of [the coach answers by topic](index.md). It holds 27 question ids: 26 from rounds 1 to 3 and 1 from round 4. Every place where a later round changed an earlier answer is also listed in [changes across rounds](changes-across-rounds.md). Read next: [model guide: athletes](../02-model/athletes.md), [sports table](../02-model/sports.md), [stay athletic and active](../02-model/stay-athletic-and-active.md), [special populations](../02-model/special-populations.md), [swimming](../02-model/swimming.md).

## The rules in short

CONFIRMED means the coach said it or approved it. PROPOSED means the team designed it and he has not confirmed it. INFERRED means the team's reading of his words; he has not confirmed that either.

| # | Rule | Answer ids | Status |
|---|---|---|---|
| 1 | Ground-contact time decides the mix: less time on the ground = more plyometric work; more time on the ground = more ballistic work. Both ends matter. | [ATH-01](#ath-01) | CONFIRMED |
| 2 | Share of jump and throw work that is plyometric at the end of a block: sprinters and runners 75 %; volleyball, soccer, football skill 60 %; basketball, tennis 50 %; baseball, hockey, MMA 40 %; boxing, karate, wrestling, golf, swimming 25 %. Each block starts 15 points more ballistic. | [R2-ATH-01](#r2-ath-01), [R3-ATH-04](#r3-ath-04) | CONFIRMED |
| 3 | Ballistic: squat jumps, box jumps, broad jumps, loaded jumps, medball throws. Plyometric: pogo and ankle hops, hurdle hops, depth jumps, bounds, repeated jumps. | [R2-ATH-02](#r2-ath-02) | CONFIRMED |
| 4 | Plyos are taught in three Receive-Create stages: 1 Land, 2 Land & Go, 3 Repeat. | [R2-ATH-03](#r2-ath-03) | CONFIRMED |
| 5 | More resistance training: linemen, wrestlers, rugby, heavyweight fighters, throwers. More speed and power: sprinters, basketball, skill positions, volleyball. | [ATH-03](#ath-03) | CONFIRMED |
| 6 | Everyone in athletic training gets Olympic lifts. Beginners use dumbbell and kettlebell snatches, hex-bar jumps, hang pulls and hang cleans; intermediate and up the full scope. | [ATH-10](#ath-10) | CONFIRMED |
| 7 | Olympic lifts can be done up to four times a week. Clean days are squat-pattern days; snatch days are hinge-pattern days. | [R2-ATH-04](#r2-ath-04) | CONFIRMED |
| 8 | Full squat cleans and snatches: 3 to 5 reps per set. The 8-rep ramp stays for dumbbell, kettlebell and pull variants. | [R2-ATH-05](#r2-ath-05) | CONFIRMED |
| 9 | Medball throws: high for rotational sports, moderate for basketball and football, none for aesthetics except the warm-up. | [ATH-05](#ath-05) | CONFIRMED |
| 10 | Strikers: bring pressing and arm volume down when punching volume is high. Never cut it completely. | [ATH-04](#ath-04) | CONFIRMED |
| 11 | No rules by sex. Rules go by age, foundation, goal and injuries. | [ATH-09](#ath-09) | CONFIRMED |
| 12 | From 60: landing drills, balance, quick stepping, light medball throws and fast machine work are on. Jumps, Olympic lifts and depth jumps are off and can be switched on with his warning. | [R2-ATH-08](#r2-ath-08), [R3-ATH-02](#r3-ath-02) | CONFIRMED |
| 13 | Youth can do Olympic lifts from the floor from about 14, after one block of hang work. | [ATH-09](#ath-09), [R2-ATH-08](#r2-ath-08) | CONFIRMED |
| 14 | Aerobic sessions for athletes: off-season 2 to 4 by sport, pre-season 2, in season 2; 0 extra for swimmers, runners, rowers and endurance cyclists. | [R2-ATH-06](#r2-ath-06), [R3-ATH-04](#r3-ath-04), [ATH-07](sessions-and-order.md#ath-07) | CONFIRMED |
| 15 | In season, game-heavy sports: gym plyos at about half, no extra change-of-direction work, the hard gym day at least 48 hours before a game. | [R2-ATH-07](#r2-ath-07), [R3-ATH-04](#r3-ath-04) | CONFIRMED |
| 16 | He asked for all the popular sports in the United States, swimming included, and for a "stay athletic and active" option for the general population, with pickleball and HYROX. | conversation | CONFIRMED |
| 17 | Swimming dryland, HYROX and stay-active defaults as approved in round 3. | [R3-ATH-01](#r3-ath-01), [R3-ATH-03](#r3-ath-03), [R3-ATH-05](#r3-ath-05) | CONFIRMED |
| 18 | Weekly jump-contact numbers, the dials of sports he did not name one by one, the reading of "goalkeepers", the age line for "younger or lower-level swimmers", and snatches for 60+. | [ATH-01](#ath-01), [R3-ATH-04](#r3-ath-04), [R3-ATH-01](#r3-ath-01), [R3-ATH-02](#r3-ath-02) | PROPOSED |

## Why, in his words

- "The less time on the ground, like a sprinter, the more plyos and less ballistics." ([ATH-01](#ath-01))
- "so everyone gets Olympic lifts" ([ATH-10](#ath-10))
- "I don't go by sex on these things, but mainly by age, foundation, goal, and injuries." ([ATH-09](#ath-09))
- "Make sure that you have a fitness professional to help you understand what this means." ([R2-ATH-08](#r2-ath-08))
- "They want to stay athletic and active, so we need to understand that that's an option for them." (conversation, `coach_chat_statements.md`)

## Where it lives in the data

Keys are in [`generator_spec_v1.json`](../../generator_spec_v1.json), the machine-readable twin of the model, unless another file is named.

| What | File | JSON key |
|---|---|---|
| Plyometric vs ballistic rule, classes and approved shares | `generator_spec_v1.json` | `rule_tables.athletic.plyo_vs_ballistic` |
| Shares for the sports he did not name | `generator_spec_v1.json` | `rule_tables.athletic.plyo_share_remaining_sports` |
| Receive-Create stages | `generator_spec_v1.json` | `rule_tables.athletic.method_stage` |
| Olympic lifts: who, how often, reps, load | `generator_spec_v1.json` | `rule_tables.athletic.olympic` |
| Medball rules | `generator_spec_v1.json` | `rule_tables.athletic.medball` |
| People 60 and over | `generator_spec_v1.json` | `rule_tables.athletic.older` |
| Racket players 50 and over | `generator_spec_v1.json` | `rule_tables.athletic.racket_50plus` |
| In-season rule for game-heavy sports | `generator_spec_v1.json` | `rule_tables.athletic.in_season_game_heavy` |
| Swimming dryland | `generator_spec_v1.json` | `rule_tables.athletic.swimming_dryland` |
| HYROX station circuits | `generator_spec_v1.json` | `rule_tables.athletic.hyrox_station_circuits` |
| Stay athletic and active: play days, cardio credit | `generator_spec_v1.json` | `rule_tables.athletic.stay_active_play` |
| Aerobic sessions per week | `generator_spec_v1.json` | `rule_tables.conditioning.sessions_per_week` |
| The sport picker and the activity picker | `generator_spec_v1.json` | `vocab.sports` |
| Every sport and activity profile | `synthesis/04_profiles.json` | `sports` |

## Questions on this page

| ID | Round | His verdict | Final rule in one line | Status |
|---|---|---|---|---|
| [ATH-01](#ath-01) | 1 | answered in words (no chip) | Ground-contact time sets the mix: less time on the ground = more plyos; more time on the ground = more ballistics. | Stands, refined |
| [ATH-02](#ath-02) | 1 | RIGHT | Plyo ranking: basketball = volleyball > sprinters > football skill > soccer > MMA > tennis > baseball > hockey > wrestling/BJJ > boxing = karate > golf. | Stands, refined |
| [R2-ATH-01](#r2-ath-01) | 2 | RIGHT | Plyometric share at block end: 75 / 60 / 50 / 40 / 25 % by sport; each block starts 15 points more ballistic. | Stands, refined |
| [R2-ATH-02](#r2-ath-02) | 2 | RIGHT | Approved lists: which jumps are ballistic and which are plyometric. | Stands |
| [R2-ATH-03](#r2-ath-03) | 2 | RIGHT | Receive-Create stages: 1 Land, 2 Land & Go, 3 Repeat (12 weeks: 1-3 / 4-7 / 8-12; 8 weeks: 1-2 / 3-5 / 6-8). | Stands |
| [R3-ATH-04](#r3-ath-04) | 3 | RIGHT | Plyo shares, cardio and in-season rule for every remaining sport; recreational players use their activity's share. | Stands |
| [ATH-03](#ath-03) | 1 | RIGHT | More resistance: linemen, wrestlers, rugby, heavyweights, throwers. More speed/power: sprinters, basketball, skill positions, volleyball. | Stands |
| [ATH-04](#ath-04) | 1 | RIGHT | Strikers: lower pressing and arm volume when punching volume is high; never cut it completely. | Stands |
| [ATH-05](#ath-05) | 1 | RIGHT | Medball throws: high for rotational sports, moderate for basketball and football, none for aesthetics except the warm-up. | Stands |
| [ATH-06](#ath-06) | 1 | RIGHT | COD route names are for every athlete, tiered by turn angle. | Stands, refined |
| [ATH-08](#ath-08) | 1 | RIGHT | Pitchers: less overhead pressing, more arm care, light rotational throws. | Stands |
| [ATH-12](#ath-12) | 1 | RIGHT | Contrast and complexes: intermediate+ athletes, off-season, heavy lift about 78-85 %, no rest inside. | Stands |
| [ATH-10](#ath-10) | 1 | RIGHT | Everyone in athletic training gets Olympic lifts; beginners the DB/KB/hex-bar/hang versions, intermediate+ the full scope. | Stands, refined |
| [R2-ATH-04](#r2-ath-04) | 2 | RIGHT | Olympic lifts in season too; up to 4 times a week; cleans = squat pattern, snatches = hinge pattern. | Stands |
| [R2-ATH-05](#r2-ath-05) | 2 | RIGHT | Full squat cleans/snatches: 3-5 reps per set; the 8-rep ramp stays for DB/KB and pulls; fast and powerful by the coach's eye. | Stands, refined |
| [R2-ATH-06](#r2-ath-06) | 2 | RIGHT | Athletes off-season 2-4 aerobic sessions by sport; pre-season 2; powerlifters 2 easy. | Stands, refined |
| [R2-ATH-07](#r2-ath-07) | 2 | RIGHT | In season, game-heavy sports: gym plyos ~half, no extra COD, sprints only for speed athletes, hard day 48 h before a game. | Stands, refined |
| [ATH-09](#ath-09) | 1 | PARTLY | No rules by sex; go by age, foundation, goal, injuries. Older: few plyos unless asked. Youth may lift from the floor. | Stands, refined |
| [R2-ATH-08](#r2-ath-08) | 2 | RIGHT | From 60: no Olympic lifts, plyos or depth jumps by default; optional with his warning. Youth from the floor from ~14 after a hang block. | Partly superseded |
| [R3-ATH-02](#r3-ath-02) | 3 | RIGHT | 60+: on/off defaults with a switch and warning. Racket players 50+: knee-friendly strength, calf/Achilles every leg day, rotator cuff, low-impact jumps. | Stands |
| [ATH-13](#ath-13) | 1 | PARTLY | "Justice League" = a marketing name for a non-competitive, all-around athletic program (weekend warriors). | Stands, refined |
| [R3-ATH-01](#r3-ath-01) | 3 | RIGHT | Swimming dryland: 3 + 1 days, 0 extra cardio, 25 % plyo, Olympic lifts 2-3 days, shoulder care every session, 2-week taper with the swim taper. | Stands |
| [R3-ATH-03](#r3-ath-03) | 3 | RIGHT | "High rows" = HYROX. Plan: 2 strength + 2 hybrid days, 4 cardio, 2 station circuits as finishers, wall ball max 20 lb, 50 % plyo. | Stands |
| [R3-ATH-05](#r3-ath-05) | 3 | RIGHT | Stay active: play days (hard gym day 48 h before), activity counts as cardio (up to 2), optional event date. | Stands |
| [PRG-09](#prg-09) | 1 | RIGHT | Baseball: high school = college = pro in structure; loads and speeds differ; Thursday = strength. | Stands |
| [PRG-10](#prg-10) | 1 | RIGHT | CrossFit FULL TIME = competitor, HALF TIME = class member. | Stands |
| [R4-SCP-03](#r4-scp-03) | 4 | RIGHT | Every sport profile carries a label in the data and docs: confirmed by coach, based on a similar sport, or proposed. Not shown on the plan. | Stands |

## What he said in conversation

These are statements he made while the model was being built. They are closely paraphrased in the source files, with his exact words in quotation marks. A questionnaire answer wins where the two differ.

| Statement | Source | How the questionnaires treated it |
|---|---|---|
| "Different athletes need different things." Basketball players need more plyos; boxers and karate athletes don't need that many; MMA fighters need more than boxers but fewer than basketball players. "Play with the volume." | `coach_chat_statements.md` | [ATH-01](#ath-01) gave the reason (ground-contact time) and [R2-ATH-01](#r2-ath-01) the shares by sport. |
| Some athletes need more resistance training; others need more power and explosiveness through athletic patterns. | `coach_chat_statements.md` | The two groups are listed in [ATH-03](#ath-03). |
| "For the athletes, all of the different popular sports in the United States" must be there, "include swimming as well." | `coach_chat_statements.md` | Built as 52 sports in the picker. Swimming defaults approved in [R3-ATH-01](#r3-ath-01); the other sports in [R3-ATH-04](#r3-ath-04). |
| General population: include pickleball ("very popular right now") and HYROX. "They want to stay athletic and active, so we need to understand that that's an option for them." | `coach_chat_statements.md` | His spoken words were "high rows"; [R3-ATH-03](#r3-ath-03) confirmed he meant HYROX. Stay-active rules approved in [R3-ATH-05](#r3-ath-05). |
| Different athletes need different things: basketball = most plyos; MMA = many plyos but fewer than basketball; boxing/karate = few plyos. Some populations need more resistance, others more power/athletic patterns. | `coach_answers.md` (earliest notes) | No questionnaire answer changed it. |

## Every question and his final answer

Each entry gives the question, the final rule as it stands today, what we assumed or proposed, his verdict, a short quote, what is not confirmed, where the rule lives, and every later change. His full dictated answer is folded under each entry.

### Plyometric or ballistic

#### ATH-01

**Question (round 1).** What controls 'more plyos' for a sport?

**Final rule.** What controls "more plyos" is the sport itself. If the sport has more plyometric work, the athlete gets more plyos. The more time the athlete spends on the ground, the fewer plyos and the more ballistics for power. A karate athlete (long ground time) gets more ballistics and fewer plyos. A sprinter (short ground time) gets more plyos and fewer ballistics. A basketball player gets a good mix. A fighter gets more ballistics, but some plyos are always good to keep the tissues strong. A baseball player does not need a lot of plyos: more ballistics and rotational forces, plus sprinting. Both ends of the range matter for everyone.

- **Status:** Stands. Later answers added detail (see "Changed later").
- **We assumed (round 1):** All three: more plyo slots per week, more foot contacts per session, and higher-intensity jumps. Please give rough weekly contacts for basketball, MMA and boxing/karate.
- **His verdict (round 1):** answered in words, no chip
- **In his words:** "The more time on the ground they have to have, like a karate athlete, the more ballistics and less plyos." / "The less time on the ground, like a sprinter, the more plyos and less ballistics." (ATH-01)
- **Not confirmed by him:** We asked for weekly foot contacts for basketball, MMA and boxing. He gave none. Contact numbers are PROPOSED.
- **Where it lives:** `generator_spec_v1.json` → `rule_tables.athletic.plyo_vs_ballistic.rule`
- **Changed later:**
  - **REFINED by [R2-ATH-01](#r2-ath-01) (round 2).** Before: The mix was described sport by sport, in words. Now: Approved shares: 75 / 60 / 50 / 40 / 25 % plyometric at the end of a block, by sport. Each block starts 15 points more ballistic.
  - **REFINED by [R2-ATH-02](#r2-ath-02) (round 2).** Before: Ballistic vs plyometric by contact time. Now: Approved lists of which jumps are which.
  - **REFINED by [R3-ATH-04](#r3-ath-04) (round 3).** Before: Sports he named. Now: Shares for the sports he had not named.
- **See also:** [ATH-02](#ath-02), [R2-ATH-01](#r2-ath-01), [R2-ATH-02](#r2-ath-02), [CAT-10](levels-and-zones.md#cat-10)

<details>
<summary>His full answer, round 1 (from <code>coach_answers_full.md</code>)</summary>

> Well, it's just the athletics. If the athlete has more plyo work in their sport, then we give them more plyo work. If they have less plyo work or less time to be off the ground, the more time they're on the ground, the less plyos I really need to be giving them, and more ballistics I can give them for power.
>
> A fighter might have a lot more ballistics and plyos, but some plyos are always good because I need them to have other tissues really strong. A basketball player may have a good mix of ballistics and plyos, but a sprinter would have a higher mix of plyos than ballistics, even though they will have ballistics. There are different ones for different athletes, depending on the sport at hand.
>
> The more time on the ground they have to have, like a karate athlete, the more ballistics and less plyos. The less time on the ground, like a sprinter, the more plyos and less ballistics. But both of those ranges are important, both end ranges, so we have to work accordingly within the range according to the athlete's sport. A baseball player doesn't need a lot of plyos. They need more ballistics and rotational forces and things like that. Now, they do need to sprint, so sprinting allows them to be good. Some plyos are going to be there. Sprinting is going to be there, but not necessarily a high level of plyos.

</details>

#### ATH-02

**Question (round 1).** Rank sports from most to least plyo volume. Is this close?

**Final rule.** The ranking from most to least plyo volume is right: basketball and volleyball, then sprinters, football skill positions, soccer, MMA, tennis, baseball, hockey, wrestling and BJJ, boxing and karate, golf. Round 2 read this ranking as fast, bouncy contacts and turned it into shares; there sprinters sit in the top class.

- **Status:** Stands. Later answers added detail (see "Changed later").
- **We assumed (round 1):** Basketball ≈ volleyball > sprinters > football skill positions > soccer > MMA > tennis > baseball > hockey > wrestling/BJJ > boxing ≈ karate > golf.
- **His verdict (round 1):** RIGHT, no words (our proposal became his rule)
- **Where it lives:** `generator_spec_v1.json` → `rule_tables.athletic.plyo_volume_ranking`
- **Changed later:**
  - **REFINED by [R2-ATH-01](#r2-ath-01) (round 2).** Before: A ranking by plyo volume. Now: Read as fast, bouncy contacts, not total jumps, and turned into plyometric shares by sport (sprinters 75 %, volleyball 60 %, basketball 50 % ...).
- **See also:** [ATH-01](#ath-01), [R2-ATH-01](#r2-ath-01)

#### R2-ATH-01

**Question (round 2).** Do these plyo vs ballistic splits match your ground-contact rule (share of jump and throw work that is plyometric by the end of a block)?

**Final rule.** The share of jump and throw work that is plyometric by the end of a block: sprinters 75 %; volleyball, soccer and football skill positions 60 %; basketball, tennis, football big-skill positions and weekend warriors 50 %; baseball, softball, hockey, linemen and MMA 40 %; boxing, karate, kickboxing, wrestling, BJJ and golf 25 %. Each block starts 15 points more ballistic. His sport ranking is read as fast, bouncy contacts, not total jumps.

- **Status:** Stands. Later answers added detail (see "Changed later").
- **We proposed (round 2):** Sprinters 75 %; volleyball, soccer, football skill 60 %; basketball, tennis, football big-skill, weekend warriors 50 %; baseball, softball, hockey, linemen, MMA 40 %; boxing, karate, kickboxing, wrestling, BJJ, golf 25 %. Each block starts 15 points more ballistic. Your sport ranking is read as fast, bouncy contacts, not total jumps.
- **His verdict (round 2):** RIGHT, no words (our proposal became his rule)
- **Where it lives:** `generator_spec_v1.json` → `rule_tables.athletic.plyo_vs_ballistic.end_of_block_by_sport_approved`, `rule_tables.athletic.plyo_vs_ballistic.start_rule`
- **Changed later:**
  - **REFINED by [R3-ATH-04](#r3-ath-04) (round 3).** Before: Shares for the sports he had named. Now: Shares for the remaining sports, and for recreational players (their activity's share).
  - **REFINED by [R3-ATH-01](#r3-ath-01) (round 3).** Before: Swimming not listed. Now: Swimming: 25 % plyometric at the end of a block, because starts and turns are single big efforts.
- **This answer changed:** [ATH-01](#ath-01) (refined), [ATH-02](#ath-02) (refined)
- **See also:** [ATH-01](#ath-01), [ATH-02](#ath-02), [R3-ATH-04](#r3-ath-04)

#### R2-ATH-02

**Question (round 2).** Which jumps count as ballistic and which as plyometric?

**Final rule.** Ballistic (a longer contact or one big effort): squat jumps, box jumps, broad jumps, loaded or hex-bar jumps, medball throws. Plyometric (short, bouncy contacts): pogo and ankle hops, hurdle hops, depth jumps, bounds, squirrel jumps, repeated jumps. Stick-the-landing drills are the "receive" stage.

- **Status:** Stands as answered.
- **We proposed (round 2):** Ballistic (longer contact or one big effort): squat jumps, box jumps, broad jumps, loaded or hex-bar jumps, medball throws. Plyometric (short, bouncy contacts): pogo and ankle hops, hurdle hops, depth jumps, bounds, squirrel jumps, repeated jumps. Stick-the-landing drills are the 'receive' stage.
- **His verdict (round 2):** RIGHT, no words (our proposal became his rule)
- **Where it lives:** `generator_spec_v1.json` → `rule_tables.athletic.plyo_vs_ballistic.lists_approved`
- **This answer changed:** [CAT-10](levels-and-zones.md#cat-10) (refined), [ATH-01](#ath-01) (refined)
- **See also:** [ATH-01](#ath-01), [R2-ATH-03](#r2-ath-03)

#### R2-ATH-03

**Question (round 2).** Your plyo progression (receive and pause, then receive and create, then repeat): what do we call it, and how long in each stage?

**Final rule.** His plyo progression is called the Receive-Create stages: 1 Land (receive and pause), 2 Land & Go (receive and create), 3 Repeat. On a 12-week plan: weeks 1-3, 4-7, 8-12. On an 8-week plan: weeks 1-2, 3-5, 6-8. Restart at stage 1 each off-season. Stay in the same stage during maintenance blocks. Intermediate and advanced athletes may start at stage 2.

- **Status:** Stands as answered.
- **We proposed (round 2):** Name: 'Receive-Create stages' (1 Land, 2 Land & Go, 3 Repeat). 12-week plan: weeks 1-3 / 4-7 / 8-12. 8-week plan: weeks 1-2 / 3-5 / 6-8. Restart at stage 1 each off-season; stay put in maintenance blocks; intermediate and advanced athletes may start at stage 2.
- **His verdict (round 2):** RIGHT, no words (our proposal became his rule)
- **Where it lives:** `generator_spec_v1.json` → `rule_tables.athletic.method_stage`, `plan_types.fixed_12.receive_create_weeks`
- **This answer changed:** [CAT-10](levels-and-zones.md#cat-10) (refined), [CAT-11](levels-and-zones.md#cat-11) (answered)
- **See also:** [CAT-10](levels-and-zones.md#cat-10), [CAT-11](levels-and-zones.md#cat-11), [R2-ATH-02](#r2-ath-02)

#### R3-ATH-04

**Question (round 3).** Sports you did not name in round 2: OK to place them with your rule (fast, bouncy contacts = more plyos) like this?

**Final rule.** Sports he did not name in round 2 are placed with his rule (fast, bouncy contacts = more plyos). Plyometric share at the end of a block: 75 % runners. 60 % lacrosse, field hockey, flag football, ultimate cutters, rugby sevens, high jump, pole vault, gymnastics, cheer flyers. 50 % beach volleyball, pickleball, padel, rugby backs, goalkeepers, javelin, HYROX. 40 % rugby forwards, cheer bases, throwers, diving, alpine skiing, cycling. 25 % swimming, water polo, rowing, judo, taekwondo, climbing. Off-season cardio is 2 to 4 sessions like his list, and 0 extra for swimmers, runners, rowers and endurance cyclists, whose practice is the cardio. The in-season game-heavy rule also covers lacrosse, field hockey, rugby, ultimate, flag football and beach volleyball. Recreational players use their activity's share (golf 25 %, running 75 %, rec soccer 60 %); "a bit of everything" stays 50 %.

- **Status:** Stands as answered.
- **We proposed (round 3):** Plyometric share at the end of a block: 75 % runners; 60 % lacrosse, field hockey, flag football, ultimate cutters, rugby sevens, high jump, pole vault, gymnastics, cheer flyers; 50 % beach volleyball, pickleball, padel, rugby backs, goalkeepers, javelin, HYROX; 40 % rugby forwards, cheer bases, throwers, diving, alpine skiing, cycling; 25 % swimming, water polo, rowing, judo, taekwondo, climbing. Off-season cardio 2-4 like your list, 0 extra for swimmers, runners, rowers and endurance cyclists (their practice is the cardio). Your in-season game-heavy rule also for lacrosse, field hockey, rugby, ultimate, flag football and beach volleyball. Recreational players use their activity's share (golf 25 %, running 75 %, rec soccer 60 %); 'a bit of everything' stays 50 %.
- **His verdict (round 3):** RIGHT, no words (our proposal became his rule)
- **Not confirmed by him:** The 50 % group lists "goalkeepers" without a sport. It is read as soccer, lacrosse and field-hockey goalkeepers; the ice-hockey goalie stays with hockey (40 %) and the water-polo goalkeeper with water polo (25 %). That reading is PROPOSED.
- **Where it lives:** `generator_spec_v1.json` → `rule_tables.athletic.plyo_share_remaining_sports`, `rule_tables.athletic.in_season_game_heavy`, `rule_tables.conditioning.sessions_per_week.athletes_off_season`
- **This answer changed:** [ATH-01](#ath-01) (refined), [ATH-07](sessions-and-order.md#ath-07) (refined), [R2-ATH-01](#r2-ath-01) (refined), [R2-ATH-06](#r2-ath-06) (refined), [R2-ATH-07](#r2-ath-07) (refined)
- **See also:** [R2-ATH-01](#r2-ath-01), [R2-ATH-06](#r2-ath-06), [R2-ATH-07](#r2-ath-07)

### What each kind of athlete needs

#### ATH-03

**Question (round 1).** Which athletes need more resistance training (strength/size) vs more speed and power?

**Final rule.** Athletes who need more resistance training (strength and size): football linemen, wrestlers, rugby players, heavyweight fighters, throwers. Athletes who need more speed and power: sprinters, basketball players, skill positions, volleyball players.

- **Status:** Stands as answered.
- **We assumed (round 1):** More resistance: football linemen, wrestlers, rugby, heavyweight fighters, throwers. More speed/power: sprinters, basketball, skill positions, volleyball.
- **His verdict (round 1):** RIGHT, no words (our proposal became his rule)
- **Where it lives:** `generator_spec_v1.json` → `rule_tables.athletic.resistance_vs_speed_groups`
- **See also:** [UNI-02](bilateral-unilateral.md#uni-02), [ATH-01](#ath-01)

#### ATH-04

**Question (round 1).** Your boxing plan drops bench, pull-ups and arm isolation in weeks 3–8. A rule for striking sports?

**Final rule.** For striking sports, pressing and arm volume come down when punching volume is high, while rows and rotational throws stay. But it is never cut completely. His boxing plan dropped bench, pull-ups and arm isolation in weeks 3 to 8 because some boxers punch a very high volume; the rule is to bring the volume "down, down, down", not to zero.

- **Status:** Stands as answered.
- **We assumed (round 1):** Yes. Cut pressing and arm volume when punching volume is high and keep the rows and rotational throws.
- **His verdict (round 1):** RIGHT, with words
- **In his words:** "We just need to bring the volume down, down, down when it's like that, but not completely cut it out." (ATH-04)
- **Where it lives:** `generator_spec_v1.json` → `rule_tables.athletic.strikers`
- **See also:** [ATH-03](#ath-03), [PER-10](plans-and-calendar.md#per-10)

<details>
<summary>His full answer, round 1 (from <code>coach_answers_full.md</code>)</summary>

> Yes, but don't completely cut it. It cuts it in those weeks because some boxers get a really high volume of punching and all of that. I do have that as I cut it on there, but I don't need to cut it all the way. We just need to bring the volume down, down, down when it's like that, but not completely cut it out.

</details>

#### ATH-05

**Question (round 1).** Medball throwing volume by sport?

**Final rule.** Medball throwing volume: high for baseball, boxing, MMA, tennis and golf (rotational sports); moderate for basketball and football. Aesthetics clients do not need medball throwing in the main workout. For a bodybuilder it may be part of the warm-up, nothing more.

- **Status:** Stands as answered.
- **We assumed (round 1):** High for baseball, boxing, MMA, tennis and golf (rotational); moderate for basketball and football; low for aesthetics.
- **His verdict (round 1):** RIGHT, with words
- **In his words:** "If you're a bodybuilder, you don't need to do med ball throwing." (ATH-05)
- **Where it lives:** `generator_spec_v1.json` → `rule_tables.athletic.medball`, `rule_tables.warmup.aesthetics_medball`
- **See also:** [EQ-06](equipment.md#eq-06), [EQ-07](equipment.md#eq-07), [LIB-22](library-details.md#lib-22), [LIB-06](library-details.md#lib-06)

<details>
<summary>His full answer, round 1 (from <code>coach_answers_full.md</code>)</summary>

> I don't really need any med ball throwing for aesthetics. If you're a bodybuilder, you don't need to do med ball throwing. That might be something for warming up, but it's not something in the main workout.

</details>

#### ATH-06

**Question (round 1).** Change of direction: are the football route names (FADE, SLANT, POST…) for every athlete, or football only?

**Final rule.** Change-of-direction (COD) work uses the football route names (FADE, SLANT, POST ...) for every athlete, not only football players. The routes are tiered by turn angle: easy, moderate and hard turns.

- **Status:** Stands. Later answers added detail (see "Changed later").
- **We assumed (round 1):** Every athlete, tiered by turn angle (easy, moderate and hard turns).
- **His verdict (round 1):** RIGHT, no words (our proposal became his rule)
- **Where it lives:** `generator_spec_v1.json` → `rule_tables.athletic.cod`
- **Changed later:**
  - **REFINED by [R2-ATH-07](#r2-ath-07) (round 2).** Before: COD for every athlete. Now: In season, game-heavy sports get no extra change-of-direction work in the gym.
  - **REFINED by [R3-ATH-05](#r3-ath-05) (round 3).** Before: COD for every athlete. Now: For stay-active people, weeks with 3 or more play sessions drop the extra agility drills.
- **See also:** [LIB-21](sessions-and-order.md#lib-21), [R2-ATH-07](#r2-ath-07)

#### ATH-08

**Question (round 1).** Pitchers vs position players: different templates?

**Final rule.** Pitchers get a different template from position players: less overhead pressing, more arm care, and rotational throws kept light.

- **Status:** Stands as answered.
- **We assumed (round 1):** Pitchers: less overhead pressing, more arm care, rotational throws kept light.
- **His verdict (round 1):** RIGHT, no words (our proposal became his rule)
- **Where it lives:** `generator_spec_v1.json` → `rule_tables.athletic.pitchers`
- **See also:** [PRG-09](#prg-09), [ATH-05](#ath-05)

#### ATH-12

**Question (round 1).** Contrast / French contrast and complexes: who, when, and what load?

**Final rule.** Contrast work (a heavy lift followed at once by an explosive one), French contrast and complexes are for intermediate and advanced athletes, in the off-season only. The heavy lift is at about 78 to 85 %, with no rest inside the complex.

- **Status:** Stands as answered.
- **We assumed (round 1):** Intermediate+ athletes, off-season only, heavy lift at about 78–85%, no rest within the complex.
- **His verdict (round 1):** RIGHT, no words (our proposal became his rule)
- **Where it lives:** `generator_spec_v1.json` → `rule_tables.athletic.contrast`
- **See also:** [ORD-05](sessions-and-order.md#ord-05)

### Olympic lifts

#### ATH-10

**Question (round 1).** Who gets Olympic lifts, and what replaces them without bumper plates?

**Final rule.** Everyone in athletic training gets Olympic lifts. "That has to be there." Beginners and early intermediates do the versions that need no bumper plates: dumbbell and kettlebell snatches, hex-bar jumps, hang pulls, hang cleans. Intermediate-plus, advanced and professional athletes do the full scope. The same simple versions replace the full lifts when there are no bumper plates. Later rounds set the frequency, the reps and one exception: older adults do not get them by default.

- **Status:** Stands. Later answers added detail (see "Changed later").
- **We assumed (round 1):** Intermediate+ athletes off-season. Without bumpers: DB/KB snatches and cleans, hex-bar jumps, hang pulls.
- **His verdict (round 1):** RIGHT, with words
- **In his words:** "so everyone gets Olympic lifts" / "If you're in the Olympic lifts, athletic training, or athletic patterns training in your programming, you're going to have to have it." (ATH-10)
- **Where it lives:** `generator_spec_v1.json` → `rule_tables.athletic.olympic.who`
- **Changed later:**
  - **REFINED by [R2-ATH-04](#r2-ath-04) (round 2).** Before: Who gets them. Now: In season too, and up to four times a week: clean days and snatch days.
  - **REFINED by [R2-ATH-05](#r2-ath-05) (round 2).** Before: Who gets them. Now: Reps: 3 to 5 per set on full squat cleans and snatches.
  - **REFINED by [R2-ATH-08](#r2-ath-08) (round 2).** Before: "Everyone gets Olympic lifts." Now: Older adults do not get Olympic lifts by default; they are an option with a warning.
  - **REFINED by [R2-LIB-07](library-details.md#r2-lib-07) (round 2).** Before: Beginner variants named in words. Now: Hang clean, single-arm DB snatch, KB squat clean and hex-bar jump added to the library as foundational.
- **See also:** [R2-ATH-04](#r2-ath-04), [R2-ATH-05](#r2-ath-05), [R2-GEN-06](product-and-generator.md#r2-gen-06), [LIB-07](library-details.md#lib-07), [ORD-03](sessions-and-order.md#ord-03)

<details>
<summary>His full answer, round 1 (from <code>coach_answers_full.md</code>)</summary>

> If you're a field athlete, you're going to do more of the Olympic lifts, and even if you're a beginner, you can do a lot of the dumbbell, kettlebell, snatches, hex bar jumps, and hang pulls. Those are still going to be there, so everyone gets Olympic lifts.
>
> If you're in the Olympic lifts, athletic training, or athletic patterns training in your programming, you're going to have to have it. That has to be there. Not just intermediate plus, but the beginners and beginning intermediates are going to be more like hang cleans and just these things without bumpers. The more intermediate plus and advanced and pros are going to be doing the full scope of it.

</details>

#### R2-ATH-04

**Question (round 2).** Everyone in athletic training gets Olympic lifts. In season too?

**Final rule.** Athletes keep Olympic lifts in season. The proposal was a light piece once a week (2 sets of 3, hang power clean or DB snatch), dropped in heavy game weeks. He added that it does not need to be once a week: in his programming it can be four times a week. Some days are about cleans and some about snatches. He treats cleans as more of a squat pattern and snatches as more of a hinge pattern.

- **Status:** Stands as answered.
- **We proposed (round 2):** Yes, a light piece: 2 sets of 3 (hang power clean or DB snatch) once a week, dropped in heavy game weeks.
- **His verdict (round 2):** RIGHT, with words
- **In his words:** "it doesn't need to be once a week. According to my programming, it could be done four times a week." / "I take snatches a little bit more hingy than squatty" (R2-ATH-04)
- **Not confirmed by him:** Reading "four times a week" as the most a week can hold, and keeping the light 2 x 3 piece for in-season weeks, is the team's reading (INFERRED).
- **Where it lives:** `generator_spec_v1.json` → `rule_tables.athletic.olympic.frequency`, `rule_tables.ordering.defaults.R2-ATH-04`
- **This answer changed:** [ATH-10](#ath-10) (refined)
- **See also:** [ATH-10](#ath-10), [R2-ATH-05](#r2-ath-05), [R2-ATH-07](#r2-ath-07)

<details>
<summary>His full answer, round 2 (from <code>coach_answers_round2.md</code>)</summary>

> Yeah, it doesn't need to be once a week. According to my programming, it could be done four times a week. Some days are about cleans, and some days are about snatches or snatch style. I take them as more of a squatty pattern and a hinging pattern. I take snatches a little bit more hingy than squatty, so that's the idea.

</details>

#### R2-ATH-05

**Question (round 2).** Your ramp is 4x8 at 75 % up to 4x4 at 90 %. Eight reps is a lot for a full squat clean or snatch. Keep 8s only for DB/KB and hang pulls?

**Final rule.** His ramp (4x8 at 75 % up to 4x4 at 90 %) stays for dumbbell and kettlebell variants and hang pulls. Full squat cleans and snatches use 3 to 5 reps per set with the same weekly reps, for example 6x5 at 75 %. The coach's eye and how the athlete feels decide, so the lifts stay fast and powerful. In the same round he said Olympic lifts "don't necessarily need to go by percentage unless you're a competitive Olympic lifter" ([R2-GEN-06](product-and-generator.md#r2-gen-06)).

- **Status:** Stands. Later answers added detail (see "Changed later").
- **We proposed (round 2):** Yes: keep your ramp for DB/KB and pull variants; full squat cleans and snatches use 3-5 reps per set with the same weekly reps (e.g. 6x5 at 75 %). The % comes from that lift's own 1-rep max.
- **His verdict (round 2):** RIGHT, with words
- **In his words:** "this also constitutes the coach's eye and how the athlete's feeling to make sure that they're fast and powerful" (R2-ATH-05)
- **Where it lives:** `generator_spec_v1.json` → `rule_tables.athletic.olympic.reps`, `rule_tables.reps.olympic`
- **Changed later:**
  - **REFINED by [R2-GEN-06](product-and-generator.md#r2-gen-06) (round 2).** Before: The % comes from that lift's own 1-rep max. Now: Same round: Olympic lifts are explained as power output. Untested lifts go by RPE or reps in reserve, and Olympic lifts "don't necessarily need to go by percentage unless you're a competitive Olympic lifter".
- **This answer changed:** [PER-09](progression.md#per-09) (refined), [ATH-10](#ath-10) (refined), [LIB-07](library-details.md#lib-07) (refined)
- **See also:** [PER-09](progression.md#per-09), [R2-GEN-06](product-and-generator.md#r2-gen-06), [LIB-07](library-details.md#lib-07)

<details>
<summary>His full answer, round 2 (from <code>coach_answers_round2.md</code>)</summary>

> Yeah, this also constitutes the coach's eye and how the athlete's feeling to make sure that they're fast and powerful.

</details>

### Cardio and the season

#### R2-ATH-06

**Question (round 2).** How many aerobic sessions for athletes off-season and pre-season, and for powerlifters?

**Final rule.** Aerobic sessions per week for athletes. Off-season, by sport: baseball, softball and sprinters 2; basketball, volleyball, football, tennis, golf, boxing and BJJ 3; soccer, hockey, kickboxing and karate 3 to 4; MMA and wrestling 4. Pre-season 2. Powerlifters 2 easy (Orange) sessions.

- **Status:** Stands. Later answers added detail (see "Changed later").
- **We proposed (round 2):** Off-season 2-4 by sport: baseball, softball and sprinters 2; basketball, volleyball, football, tennis, golf, boxing and BJJ 3; soccer, hockey, kickboxing and karate 3-4; MMA and wrestling 4. Pre-season 2. Powerlifters 2 easy (Orange).
- **His verdict (round 2):** RIGHT, no words (our proposal became his rule)
- **Where it lives:** `generator_spec_v1.json` → `rule_tables.conditioning.sessions_per_week.athletes_off_season`, `rule_tables.conditioning.sessions_per_week.powerlifters`
- **Changed later:**
  - **REFINED by [R3-ATH-04](#r3-ath-04) (round 3).** Before: Sports he had named. Now: The remaining sports: 2 to 4 like the list; 0 extra for swimmers, runners, rowers and endurance cyclists.
- **This answer changed:** [ATH-07](sessions-and-order.md#ath-07) (refined)
- **See also:** [ATH-07](sessions-and-order.md#ath-07), [R2-SES-06](sessions-and-order.md#r2-ses-06), [R3-ATH-04](#r3-ath-04)

#### R2-ATH-07

**Question (round 2).** In season, games already give jumps and sprints. Should game-heavy sports get less of them in the gym?

**Final rule.** In season, games already give jumps and sprints. For basketball, volleyball, soccer, football and hockey: gym plyos at about half, no extra change-of-direction work, sprints only for speed athletes, and the one hard gym day at least 48 hours before a game.

- **Status:** Stands. Later answers added detail (see "Changed later").
- **We proposed (round 2):** Yes for basketball, volleyball, soccer, football and hockey: gym plyos at about half, no extra change-of-direction work, sprints only for speed athletes, and the one hard gym day at least 48 hours before a game.
- **His verdict (round 2):** RIGHT, no words (our proposal became his rule)
- **Where it lives:** `generator_spec_v1.json` → `rule_tables.athletic.in_season_game_heavy`, `plan_types.season.in`
- **Changed later:**
  - **REFINED by [R3-ATH-04](#r3-ath-04) (round 3).** Before: Five sports. Now: Also lacrosse, field hockey, rugby, ultimate, flag football and beach volleyball.
  - **REFINED by [R3-ATH-05](#r3-ath-05) (round 3).** Before: Competitive athletes in season. Now: A similar rule for stay-active people: the hardest gym day at least 48 h before the biggest play day.
- **This answer changed:** [PER-08](plans-and-calendar.md#per-08) (refined), [ATH-06](#ath-06) (refined)
- **See also:** [PER-08](plans-and-calendar.md#per-08), [UNI-10](bilateral-unilateral.md#uni-10), [R3-ATH-04](#r3-ath-04)

### Older adults, youth, and no rules by sex

#### ATH-09

**Question (round 1).** Any different rules for youth athletes, female athletes or older adults?

**Final rule.** There are no rules by sex: "I don't go by sex on these things, but mainly by age, foundation, goal, and injuries." The rules apply to everybody. The older population does not need a lot of plyos unless they ask. Youth use the foundational lists, but they are not barred from Olympic lifts from the ground: that can be in their program. Round 2 set the ages and round 3 set the on / off defaults.

- **Status:** Stands. Later answers added detail (see "Changed later").
- **We assumed (round 1):** Youth: foundational lists only, no Olympic lifts from the floor. Older: more machines, low-impact plyos. Female: same logic.
- **His verdict (round 1):** PARTLY
- **In his words:** "I don't go by sex on these things, but mainly by age, foundation, goal, and injuries." (ATH-09)
- **Where it lives:** `generator_spec_v1.json` → `rule_tables.athletic.older`, `rule_tables.athletic.youth`, `inputs_schema.removed_fields`
- **Changed later:**
  - **REFINED by [R2-ATH-08](#r2-ath-08) (round 2).** Before: Older people: not a lot of plyos unless they ask. Youth: some Olympic lifts from the ground. Now: Older rules start at 60. Youth lift from the floor from about 14, after one block of hang work.
  - **REFINED by [R3-ATH-02](#r3-ath-02) (round 3).** Before: The older population "doesn't really need a lot of plyos unless they ask for it". Now: An exact on / off list for people 60 and over, with the switch and the warning.
- **See also:** [GEN-02](product-and-generator.md#gen-02), [R2-ATH-08](#r2-ath-08), [R3-ATH-02](#r3-ath-02), [EQ-03](equipment.md#eq-03)

<details>
<summary>His full answer, round 1 (from <code>coach_answers_full.md</code>)</summary>

> It seems about right. Definitely, the older population doesn't really need a lot of plyos unless they ask for it. For the older population, female or male doesn't really matter, so I don't go by sex on these things, but mainly by age, foundation, goal, and injuries. The rules kind of apply to everybody. But yes, the youth foundational list: no Olympic lift from the ground. Doesn't need to be like that. It could be some Olympic lift from the ground according to their program.

</details>

#### R2-ATH-08

**Question (round 2).** From what age do the older-client rules start, and from what age can youth do Olympic lifts from the floor?

**Final rule.** The older-client rules start at 60. Older adults do not need Olympic lifting, plyos, depth jumps "or anything like that", but these stay available as an extra option if they want them, according to the coach, with this warning: "Make sure that you have a fitness professional to help you understand what this means." Youth can do Olympic lifts from the floor from about 14, after one block of hang work. The approved proposal also said low ankle hops were still OK for older adults; round 3 moved them to the switched-off list.

- **Status:** PARTLY SUPERSEDED. Part of this answer was reversed later (see "Changed later").
- **We proposed (round 2):** Older rules from 60: never depth jumps (your rule); landing drills and low ankle hops still OK; no hurdle hops or bounding unless they ask. Youth from the floor from about 14, after one block of hang work.
- **His verdict (round 2):** RIGHT, with words
- **In his words:** "Make sure that you have a fitness professional to help you understand what this means." / "it should be an additional option if they want to do it according to the coach" (R2-ATH-08)
- **Where it lives:** `generator_spec_v1.json` → `rule_tables.athletic.older`, `rule_tables.athletic.youth`, `inputs_schema.fields.F44.fields.older_athletic_opt_in`
- **Changed later:**
  - **REVERSED by [R3-ATH-02](#r3-ath-02) (round 3).** Before (superseded): Approved proposal: for 60+, landing drills and low ankle hops are still OK; depth jumps never. Now: Approved: low ankle hops are off by default with the other jumps. Depth jumps are also off by default, and all of them can be switched on with the warning.
- **This answer changed:** [ATH-09](#ath-09) (refined), [ATH-10](#ath-10) (refined), [EQ-03](equipment.md#eq-03) (refined)
- **See also:** [ATH-09](#ath-09), [R3-ATH-02](#r3-ath-02), [EQ-03](equipment.md#eq-03), [ATH-10](#ath-10)

<details>
<summary>His full answer, round 2 (from <code>coach_answers_round2.md</code>)</summary>

> Older adults: we're not going to need them to be doing any Olympic lifting, plyos, depth jumps, or anything like that, but it should be an additional option if they want to do it according to the coach. They should probably have a warning saying, "Make sure that you have a fitness professional to help you understand what this means."

</details>

#### R3-ATH-02

**Question (round 3).** Older clients and pickleball players: what is on by default?

**Final rule.** From age 60, on by default: landing drills (step down and stick, no bounce), balance, quick stepping without a hop, light medball throws and fast machine work. Off by default, and switchable with his warning: low ankle hops, other jumps, Olympic lifts and depth jumps. Out completely: overhead squats and low-bar squats. Pickleball, padel and tennis players aged 50 and over get knee-friendly strength, calf and Achilles work every leg day, rotator-cuff work, and only low-impact jumps (no depth jumps, hurdle hops or bounds) unless switched on.

- **Status:** Stands as answered.
- **We proposed (round 3):** From 60: landing drills (step down and stick, no bounce), balance, quick stepping without a hop, light medball throws and fast machine work are on. Low ankle hops, other jumps, Olympic lifts and depth jumps are off and can be switched on with your warning ('Make sure that you have a fitness professional to help you understand what this means'); overhead squats and low-bar squats stay out. Pickleball, padel and tennis players 50+: knee-friendly strength, calf and Achilles work every leg day, rotator-cuff work, and only low-impact jumps (no depth jumps, hurdle hops or bounds) unless switched on.
- **His verdict (round 3):** RIGHT, no words (our proposal became his rule)
- **Not confirmed by him:** Snatch variants stay out for people 60 and over even when Olympic lifts are switched on. That comes from [EQ-03](equipment.md#eq-03) and was not restated in round 3, so it is INFERRED.
- **Where it lives:** `generator_spec_v1.json` → `rule_tables.athletic.older`, `rule_tables.athletic.racket_50plus`, `inputs_schema.fields.F44.fields.racket_50_impact_opt_in`
- **This answer changed:** [ATH-09](#ath-09) (refined), [EQ-03](equipment.md#eq-03) (reversed), [R2-ATH-08](#r2-ath-08) (reversed)
- **See also:** [R2-ATH-08](#r2-ath-08), [EQ-03](equipment.md#eq-03), [ATH-09](#ath-09), [R3-ATH-05](#r3-ath-05)

### Swimming, HYROX and staying active

#### ATH-13

**Question (round 1).** Who is 'Justice League'?

**Final rule.** "Justice League" was only a marketing name. It was not a team or a client group. It is a solid program for weekend warriors: non-competitive, all-around athletic adults (youth and kids can do it too) who want a good mix of everything, good health and a body that performs well. His later request for pickleball and HYROX grew this into the "stay athletic and active" path.

- **Status:** Stands. Later answers added detail (see "Changed later").
- **We assumed (round 1):** A real team or client group: athletic template, 2 sets per slot.
- **His verdict (round 1):** PARTLY
- **In his words:** "These are non-competitive, all-around athletic adults." (ATH-13)
- **Not confirmed by him:** The generic name used instead ("Athletic Performance - Non-Competitive") is the team's wording, following [FIX-03](library-details.md#fix-03) (PROPOSED).
- **Where it lives:** `generator_spec_v1.json` → `vocab.program_names`, `rule_tables.library_decisions.renames`
- **Changed later:**
  - **REFINED by [R3-ATH-05](#r3-ath-05) (round 3).** Before: One program for non-competitive athletic adults. Now: A full stay-active path: play days, the activity counting as cardio, an optional event date.
- **See also:** [FIX-03](library-details.md#fix-03), [R3-ATH-05](#r3-ath-05), [R3-ATH-03](#r3-ath-03)

<details>
<summary>His full answer, round 1 (from <code>coach_answers_full.md</code>)</summary>

> This was just a marketing name that I gave a program that I designed, but it wasn't a specific group or anything like that. It was just a good, solid program that I wrote for more like weekend warriors: people that wanted to be athletic, but they didn't need to compete in any sport. These are non-competitive, all-around athletic adults. Youth can be there too, and kids, but just non-competitive athletics or training with a good mix of everything. It's just good health all around and just having a body that performs well.

</details>

#### R3-ATH-01

**Question (round 3).** Swimming (your first sample plan): are these the right dryland defaults?

**Final rule.** Swimming dryland defaults. 3 dryland gym days plus 1 optional day (2 days for younger or lower-level swimmers), placed around pool training. 0 extra cardio sessions in the gym by default, because the pool is the aerobic work; the user can add one. Jump work is mostly ballistic (25 % plyometric at the end of a block), because starts and turns are single big efforts. Olympic lifts on 2 to 3 days. Shoulder care (external rotation, floor Y/T raises, KB face pulls) every session, never with bands. A 2-week dryland taper lined up with the swim coach's taper before the main championship meet; 1 week or none before smaller meets.

- **Status:** Stands as answered.
- **We proposed (round 3):** 3 dryland gym days + 1 optional day (2 for younger or lower-level swimmers), around pool training. 0 extra cardio sessions in the gym by default, because the pool is the aerobic work (the user can add one). Jump work mostly ballistic (25 % plyometric at the end of a block), because starts and turns are single big efforts. Olympic lifts 2-3 days. Shoulder care (external rotation, floor Y/T raises, KB face pulls) every session, never bands. A 2-week dryland taper lined up with the swim coach's taper before the main championship meet; 1 week or none before smaller meets.
- **His verdict (round 3):** RIGHT, no words (our proposal became his rule)
- **Not confirmed by him:** Who counts as a "younger or lower-level" swimmer (under about 14, or Level 1) is PROPOSED.
- **Where it lives:** `generator_spec_v1.json` → `rule_tables.athletic.swimming_dryland`, `rule_tables.conditioning.sessions_per_week.sport_is_the_aerobic_work`, `plan_types.season.meet_sports_taper`
- **This answer changed:** [R2-ATH-01](#r2-ath-01) (refined)
- **See also:** [R3-ATH-04](#r3-ath-04), [R2-GEN-07](product-and-generator.md#r2-gen-07), [ATH-10](#ath-10)

#### R3-ATH-03

**Question (round 3).** When you said gen-pop people want to do 'high rows', did you mean HYROX (8 x 1 km runs, each followed by a workout station)? If yes, is this the plan?

**Final rule.** "High rows" meant HYROX, the fitness race of 8 x 1 km runs, each followed by a workout station. The plan: 2 strength days (squat + pull, deadlift + push) plus 2 hybrid days (run intervals, or 1 km run + 1 station repeated). 4 cardio sessions (Blue, Green, Orange and a second Orange), because running is about half the race. 2 short station circuits a week (sled push and pull, burpee broad jumps, wall balls, farmers carry, sandbag lunges, SkiErg or row) as finishers that do not count as muscle sets. Wall balls with the race ball, never over 20 lb. 40-rep and AMRAP sets only inside these circuits. Jumps 50 % plyometric, like basketball.

- **Status:** Stands as answered.
- **We proposed (round 3):** Yes, HYROX. 2 strength days (squat + pull, deadlift + push) + 2 hybrid days (run intervals, or 1 km run + 1 station repeated). 4 cardio sessions (Blue, Green, Orange + a second Orange), because running is about half the race. 2 short station circuits a week (sled push / pull, burpee broad jumps, wall balls, farmers carry, sandbag lunges, SkiErg / row) as finishers that do not count as muscle sets. Wall balls with the race ball (never over 20 lb). 40-rep / AMRAP sets only inside these circuits. Jumps 50 % plyometric, like basketball.
- **His verdict (round 3):** RIGHT, no words (our proposal became his rule)
- **Where it lives:** `generator_spec_v1.json` → `rule_tables.athletic.hyrox_station_circuits`, `rule_tables.conditioning.sessions_per_week.hyrox_ocr_race_block`, `rule_tables.reps.forty_rep_sets`
- **This answer changed:** [VOL-10](volume.md#vol-10) (refined), [VOL-11](volume.md#vol-11) (refined), [EQ-06](equipment.md#eq-06) (refined)
- **See also:** [VOL-11](volume.md#vol-11), [EQ-06](equipment.md#eq-06), [R3-ATH-05](#r3-ath-05), [VOL-10](volume.md#vol-10)

#### R3-ATH-05

**Question (round 3).** 'Stay athletic and active' (pickleball, HYROX, rec leagues ...): how should play days, cardio and events work?

**Final rule.** For people who want to stay athletic and active (pickleball, HYROX, rec leagues and more). The user can enter the days they play. The hardest gym day stays at least 48 hours before the biggest play day. Weeks with 3 or more play sessions drop the extra agility drills and half the jumps. A 45 to 60+ minute session of their activity counts as one of their 3 cardio sessions (up to 2). An event date is optional (a first HYROX race, a pickleball tournament, a 10K): the hardest weeks end 1 week before it, followed by 1 easy week at about half the sets.

- **Status:** Stands as answered.
- **We proposed (round 3):** The user can enter the days they play: the hardest gym day stays at least 48 h before the biggest play day, and weeks with 3+ play sessions drop the extra agility drills and half the jumps. A 45-60+ minute session of their activity counts as one of their 3 cardio sessions (up to 2). Optional event date (a first HYROX race, a pickleball tournament, a 10K): the hardest weeks end 1 week before, then 1 easy week at about half the sets.
- **His verdict (round 3):** RIGHT, no words (our proposal became his rule)
- **Where it lives:** `generator_spec_v1.json` → `rule_tables.athletic.stay_active_play`, `plan_types.prep.gen_pop_event`, `inputs_schema.fields.F11r`
- **This answer changed:** [PER-10](plans-and-calendar.md#per-10) (refined), [ATH-06](#ath-06) (refined), [ATH-07](sessions-and-order.md#ath-07) (refined), [ATH-13](#ath-13) (refined), [R2-ATH-07](#r2-ath-07) (refined)
- **See also:** [ATH-13](#ath-13), [R2-ATH-07](#r2-ath-07), [ATH-07](sessions-and-order.md#ath-07), [R3-ATH-02](#r3-ath-02)

### How sure each sport profile is (round 4)

#### R4-SCP-03

**Question (round 4).** Many sport numbers were confirmed by you, others we inferred from similar sports. Should each sport profile carry a label?

**Final rule.** Yes. Every sport profile carries one of three labels, in the data and in the docs: "Confirmed by coach", "Based on a similar sport" or "Proposed". The label is not shown on the plan itself.

- **Status:** Stands as answered.
- **We proposed (round 4):** Yes, in the data and docs: 'Confirmed by coach', 'Based on a similar sport', or 'Proposed'. Not shown on the plan itself.
- **His verdict (round 4):** RIGHT, no words (our proposal became his rule)
- **Not confirmed by him:** How each of the 127 profiles was sorted is the team's reading (INFERRED): 23 `confirmed_by_coach` (numbers from his own programs, or a sport whose plan he approved by name: swimming, HYROX), 67 `similar_sport` (built on another profile), 37 `proposed` (worked out from the sport's demands with his general rules). A label describes the whole profile; single numbers inside a profile can still be his, such as the plyometric shares of [R2-ATH-01](#r2-ath-01).
- **Where it lives:** `model/profiles.json` → `sports[id].confidence`, `sports[id].confidence_basis`; `model/rules.json` → `render.profile_confidence` (`shown_on_plan: false`); the list of profiles under each label is in [sports](../02-model/sports.md) §5.1. Master section and spec key: [coverage matrix, round 4](../../coverage_matrix_round4.md). Decision record: [ADR-057](../04-decisions/adr-057-sport-profile-confidence-labels.md).
- **See also:** [R3-ATH-04](#r3-ath-04), [R2-ATH-01](#r2-ath-01), [R3-ATH-01](#r3-ath-01), [R3-ATH-03](#r3-ath-03)

### Populations in his sheets

#### PRG-09

**Question (round 1).** Baseball: which calendar is for whom (high school, college, pro)? What's Thursday's focus?

**Final rule.** The baseball calendar in his sheet was just what he wrote; it is not split by level. High school, college and pro players need about the same thing. The weights and speeds change per athlete. Pros need a higher level and more care for their body because of contracts, college players are adapting as much as they can, and high-school players have to do a lot of work. Thursday's focus is strength.

- **Status:** Stands as answered.
- **We assumed (round 1):** Thursday = strength.
- **His verdict (round 1):** RIGHT, with words
- **In his words:** "High school is the same as college, the same as pro, essentially." (PRG-09)
- **Where it lives:** `generator_spec_v1.json` → `inputs_schema.fields.F13`
- **See also:** [ATH-08](#ath-08), [PER-08](plans-and-calendar.md#per-08)

<details>
<summary>His full answer, round 1 (from <code>coach_answers_full.md</code>)</summary>

> The calendar was just whatever I wrote on there. High school is the same as college, the same as pro, essentially. It's just that the weight might change and the speeds might change per athlete, but that's subjective and specific to the athlete. In a general sense, they all need about the same thing. The pros just need a higher level and a little bit more care for their body because of contracts. The college ones are trying to adapt as much as they can, and the high school ones just have to do a lot of work. Either way, all of them need it accordingly.

</details>

#### PRG-10

**Question (round 1).** CrossFit FULL TIME vs HALF TIME, and what's the missing 4th track?

**Final rule.** In the CrossFit tab, FULL TIME means a competitor and HALF TIME means a class member. The missing fourth track stays unknown: he approved our reading as a whole and did not name it.

- **Status:** Stands as answered.
- **We assumed (round 1):** FULL TIME = competitor, HALF TIME = class member; 4th track unknown.
- **His verdict (round 1):** RIGHT, no words (our proposal became his rule)
- **Where it lives:** `generator_spec_v1.json` → `rule_tables.library_decisions.renames`, `vocab.program_names`
- **See also:** [PRG-03](sessions-and-order.md#prg-03), [R2-GEN-07](product-and-generator.md#r2-gen-07)

## Related answers on other pages

| ID | Page | What it says |
|---|---|---|
| [PER-08](plans-and-calendar.md#per-08) | [plans-and-calendar](plans-and-calendar.md) | What changes in off-season, pre-season, in season and post-season. |
| [R2-PER-06](plans-and-calendar.md#r2-per-06) | [plans-and-calendar](plans-and-calendar.md) | Pre-season is the 4-6-week block at about 60 % with a taper. |
| [R2-GEN-05](product-and-generator.md#r2-gen-05) | [product-and-generator](product-and-generator.md) | The form asks for the season start date and practice and game days. |
| [UNI-02](bilateral-unilateral.md#uni-02) | [bilateral-unilateral](bilateral-unilateral.md) | Field athletes keep a big unilateral share. |
| [UNI-10](bilateral-unilateral.md#uni-10) | [bilateral-unilateral](bilateral-unilateral.md) | In season, bilateral work stays minimal. |
| [UNI-12](bilateral-unilateral.md#uni-12) | [bilateral-unilateral](bilateral-unilateral.md) | More frontal and transverse work for court and combat athletes. |
| [CAT-13](bilateral-unilateral.md#cat-13) | [bilateral-unilateral](bilateral-unilateral.md) | Contralateral and ipsilateral loading by athlete type. |
| [CAT-10](levels-and-zones.md#cat-10) | [levels-and-zones](levels-and-zones.md) | Receive before create; ballistic first, then plyometric. |
| [VOL-10](volume.md#vol-10) | [volume](volume.md) | Athletic work never counts toward muscle sets. |
| [ATH-07](sessions-and-order.md#ath-07) | [sessions-and-order](sessions-and-order.md) | Aerobic sessions by population. |
| [ATH-11](sessions-and-order.md#ath-11) | [sessions-and-order](sessions-and-order.md) | Core first, also for athletes. |
| [R3-SES-01](sessions-and-order.md#r3-ses-01) | [sessions-and-order](sessions-and-order.md) | The field-athlete session layout inside 12 + 2. |
| [PER-11](plans-and-calendar.md#per-11) | [plans-and-calendar](plans-and-calendar.md) | Rep phases VOL 1 / 2 / 3 for athletes. |
| [EQ-06](equipment.md#eq-06) | [equipment](equipment.md) | Medball weights. |
| [LIB-22](library-details.md#lib-22) | [library-details](library-details.md) | The medball ALL LIST. |
| [R2-GEN-07](product-and-generator.md#r2-gen-07) | [product-and-generator](product-and-generator.md) | The sample plans he will grade (swimming, football, soccer ...). |
| [PRG-12](plans-and-calendar.md#prg-12) | [plans-and-calendar](plans-and-calendar.md) | The half-marathon plan. |
