# Special populations: older adults, youth, pain and injury, and no rules by sex

This page explains how the model changes a plan for people who need more care. The coach plans by **age, training foundation, goal and injuries**. He does not plan by sex, so the tool has no sex field. From **age 60**, jumps and Olympic lifts are off by default and can be switched on with a warning; landing drills, balance, quick steps, light throws and fast machine work stay on. **Pickleball, padel and tennis players from 50** get knee-friendly strength, calf and Achilles work, rotator-cuff work and low-impact jumps. **Youth** use simpler exercises and may lift from the floor from about 14. With **pain or injury**, the plan cuts that area by 30-50 %, moves it to machines or split grips, and keeps it moving. Nothing is tracked: the plan prints what to do if something hurts, and the person or coach does it.

> **How to read this page.** Ids with no prefix (`ATH-09`, `VOL-03`) are the coach's round-1 answers (`coach_answers_full.md`). `R2-` is round 2 (`coach_answers_round2.md`). `R3-` is round 3 (`coach_answers_round3.md`). A later round wins. "chat" means something he said in conversation. "Approved" means he marked our proposal RIGHT. **OBSERVED** means read from his sheets. **PROPOSED** means the team designed it and he has not confirmed it. His answers: [../03-coach-answers/athletes-and-sports.md](../03-coach-answers/athletes-and-sports.md) and [../03-coach-answers/equipment.md](../03-coach-answers/equipment.md). **Since model v1.3** there are newer answers too: round 4 (`R4-`, `coach_answers_round4.md`) and two clarifications of 2026-10-10 (`CT-01` on session time, `CX-01..04` on progression and editing). They win on their subjects.

Related pages: [athletes.md](athletes.md), [stay-athletic-and-active.md](stay-athletic-and-active.md), [sports.md](sports.md), [equipment.md](equipment.md) (machines and the constraint scale), [levels-and-zones.md](levels-and-zones.md), [volume.md](volume.md), [testing.md](testing.md). Terms: [../05-reference/glossary.md](../05-reference/glossary.md).

**This is not medical advice.** These are training defaults, not treatment. Anyone with a medical condition, an injury or pain should talk to a qualified professional first. Read [DISCLAIMER.md](../../DISCLAIMER.md) ([Spanish](../../DISCLAIMER.es.md)). Both are drafts that still need a lawyer's review.

---

## 1. No rules by sex

**Rule.** No rule in the model depends on sex. The intake has no sex field. The plan changes with age, training experience, goal and injuries.

**Rule.** If a person wants more work for a muscle, they choose it as a **Focus muscle** (up to two). That is the person's choice. The tool never assumes it.

**Why.**

> "For the older population, female or male doesn't really matter, so I don't go by sex on these things, but mainly by age, foundation, goal, and injuries. The rules kind of apply to everybody." (ATH-09)

When we listed the intake fields, he said:

> "I need you to take away just sex." (GEN-02)

His own example for Focus muscles shows how a preference is handled: by choice, not by a rule. He said, "if it's a female and she chooses glutes as one of the focus muscles, then the program should bias more toward glutes in the lower body." (R3-SES-01)

Some sports in the picker ask about a format that has "men's" or "women's" in its name: the lacrosse game, the gymnastics discipline, the physique division. These describe the competition the person entered. They are not rules about the person's body. The lists themselves are PROPOSED.

**Where it lives.** The removed field: `generator_spec_v1.json > inputs_schema.removed_fields` (entry `F04_sex`). The principle: `synthesis/04_profiles.json > age_experience_rules.no_sex`. Focus muscles: `generator_spec_v1.json > inputs_schema.fields.F09`; see [volume.md](volume.md). Age: `inputs_schema.fields.F02`. Experience: `inputs_schema.fields.F17`.

---

## 2. Older adults: age 60 and over

**Rule.** From 60, power work that involves impact or high skill is off by default. The person or the coach can switch it on. The safer athletic work stays on. The age of 60 is approved (R2-ATH-08). The on and off lists are approved (R3-ATH-02).

| On by default | Off by default, can be switched on with the warning | Stays out |
|---|---|---|
| Landing drills: step down and stick, no bounce | Low ankle hops | Overhead squats |
| Balance | Other jumps | Low-bar squats |
| Quick stepping without a hop | Olympic lifts (cleans, snatches and their simpler versions) | |
| Light medball throws | Depth jumps (step off a box, land, and jump at once) | |
| Fast machine work (a normal machine exercise, moved with speed) | | |

**The warning.** When a person switches the off-list on, the tool shows his words:

> "Make sure that you have a fitness professional to help you understand what this means." (R2-ATH-08)

**More rules for this group:**

| Rule | Decided by |
|---|---|
| Compound lifts and isolation work both lean toward machines and cables. | EQ-03 |
| A machine that his library files as moderate or advanced (leg press, pendulum squat, hip thrust machine) is fine for an older or injured beginner. Safety beats the level label. | EQ-04 |
| A seated machine shoulder press is in the library for them. | EQ-05, R2-LIB-07 |
| Medballs are lighter. | EQ-06 |
| They do not need many plyos (jumps with short, bouncy contacts) unless they ask. | ATH-09 |
| The same weekly stairway as everyone. The stairway "goes for every plan", so there is no slower step for age. | R2-PER-03, R3-VOL-04 (the team's earlier PROPOSED 3 % cap for this age was dropped) |

**How "machines" is measured.** The model rates every exercise on a **constraint scale** from 1 to 5 (approved, EQ-13). Constraint means how much the equipment holds you in place. 5 is a seated machine with a back pad. 4 is a plate-loaded machine, a Smith machine or a chest-supported exercise. 3 is a cable, or dumbbells on a bench. 2 is standing free weights. 1 is body weight, ballistic or reactive work. Older, injured and high-volume clients get mostly 4 and 5. See [equipment.md](equipment.md).

**Why.** On power work:

> "Older adults: we're not going to need them to be doing any Olympic lifting, plyos, depth jumps, or anything like that, but it should be an additional option if they want to do it according to the coach." (R2-ATH-08)

On machines:

> "If they're old, they're injured, or they have a lot of high volume, I'd rather they collect that volume in a safe place with more constraints" (EQ-03)

In conversation he gave the reason: on a machine you sit, your feet are down, and you move only your hands or your feet, so you can push a lot and it is safer (chat, paraphrased).

**One change between rounds.** In round 1 he agreed that older, injured and high-volume clients never get the overhead squat, snatch, low-bar squat or depth jumps (EQ-03). In round 3 he approved depth jumps on the off-but-switchable list for people 60 and over (R3-ATH-02). So for age alone, depth jumps moved from never to off by default. For injured and high-volume clients, EQ-03 still stands. Round 3 did not mention snatches. The model keeps snatch versions out for 60 and over, even when Olympic lifts are switched on. That reading is PROPOSED.

PROPOSED for this group: maintenance phases at 70 % of the volume or more; tests at sub-maximal effort only, with no jump tests by default; jump sessions spaced 3-4 days apart; power work on machines at about 40-60 % of a 1-rep max, moved fast.

**Where it lives.**

| What | File and key |
|---|---|
| The on, off and never lists, and the switch | `generator_spec_v1.json > rule_tables.athletic.older` (`default_on`, `default_off`, `never`, `switch`) |
| The switch in the intake | `generator_spec_v1.json > inputs_schema.fields.F44.fields.older_athletic_opt_in` (warning key `warn.older_athletic`) |
| The check before a plan is shown | `generator_spec_v1.json > validation_checks.V5_older` |
| The age overlay and its profile | `synthesis/04_profiles.json > age_overlays.active_aging_60plus`; `profiles[]` with `id` `active_aging_60plus` |
| Machines for older, injured and high-volume clients | `generator_spec_v1.json > rule_tables.equipment.older_injured_high_volume` and `constraint_scale`; `synthesis/10_equipment_model.json > client_rules`; `synthesis/04_profiles.json > injury_library.HIGH_VOLUME_CONSTRAINT` |
| Compiled copy the engine reads | `model/rules.json > population.older` |
| Master text | `BLAZE_CAMP_BRAIN.md` §9.9 and §8.3 |

A note for developers: the 3 % step cap for older adults is deleted from the compiled `model/rules.json` (it was PROPOSED, never his rule). The engine is still stricter than his round-3 answer in two places, on purpose: depth jumps stay locked for over-60s even after the switch, and handstand work is never picked for them. Older adults get 5 to 6 exercises a session, not counting the warm-up and the 2 core exercises (R4-SES-02). The coach answers win.

---

## 3. Pickleball, padel and tennis players from age 50

**Rule.** Racket players from 50 get four defaults (approved, R3-ATH-02). They apply to people who play for fun and to people who compete.

| Default | What it means in the plan |
|---|---|
| Knee-friendly strength | Leg press, box squat to a pain-free depth, split squats and low step-ups before deep, heavy, twisting work (exercise choices PROPOSED) |
| Calf and Achilles work every leg day | It stays on every leg day. Nothing is dropped for time any more (CT-01). |
| Rotator-cuff work | Side-lying external rotation, floor Y and T raises, kettlebell face pulls. No bands. (Exercise choices PROPOSED) |
| Low-impact jumps only | No depth jumps, hurdle hops or bounds, unless the person switches them on |

From 60, the older-adult rules of section 2 apply on top.

**Why.** He approved this proposal as written, with no extra words. The reasons behind the proposal are from injury research on older racket players (falls, knees, Achilles, rotator cuff). They are not his words.

**Ages 50-59 in other activities.** The model keeps the full adult athletic plan and adds joint-care choices. PROPOSED.

**Where it lives.** `generator_spec_v1.json > rule_tables.athletic.racket_50plus`. Switch: `inputs_schema.fields.F44.fields.racket_50_impact_opt_in`. Profiles `rec_pickleball`, `rec_padel`, `rec_tennis`, `pickleball_competitive` and `tennis`: field `age_50_plus` in `synthesis/04_profiles.json > profiles[]`. Overlay: `age_overlays.active_aging_50plus`. Compiled: `model/rules.json > population.active_aging_50`.

---

## 4. Youth

**Rule.** Young people can do athletic training. They start with the simpler exercise lists and lighter tools. Olympic lifts from the floor come later.

| Rule | Decided by |
|---|---|
| Youth use the foundational exercise lists. | ATH-09 (he said our list "seems about right") |
| Olympic lifts from the floor from about age 14, after one block of hang work. | R2-ATH-08 (approved) |
| Before that: hang versions, dumbbell and kettlebell versions, hex-bar jumps. | ATH-10 |
| Lighter medballs. | EQ-06 |
| His non-competitive athletic program is open to youth and kids. | ATH-13 |
| High school athletes get the same plan as college and pro athletes. The weights and speeds are their own. | PRG-09 |
| No 1-rep max test and no all-out mile from zero. | R2-PER-07 |
| A plan for anyone under 18 must be reviewed and supervised by a parent or legal guardian and a qualified coach. In the tool the guardian accepts the release (PROPOSED). | `DISCLAIMER.md` §6 (legal draft) |

**Why.** In round 1 we assumed "no Olympic lifts from the floor" for youth. He softened it:

> "Doesn't need to be like that. It could be some Olympic lift from the ground according to their program." (ATH-09)

Round 2 then fixed the age and the condition (R2-ATH-08). On young athletes in general:

> "the high school ones just have to do a lot of work." (PRG-09)

PROPOSED for youth (from research and our reading, not from him): how far up the exercise levels a young athlete goes by default; fewer high jumps and no high depth jumps during a growth spurt; a "growth stage" question in the intake; three short sessions a week for non-competitive kids; at least two days a week off organised training.

**Where it lives.** `generator_spec_v1.json > rule_tables.athletic.youth` and `validation_checks.V4_youth`. Overlays: `synthesis/04_profiles.json > age_overlays.youth_athlete` (competitive) and `age_overlays.youth_general_athletic` (not competitive). Growth phases: `season_families.youth`. Compiled: `model/rules.json > population.youth`.

---

## 5. Pain and injury

### 5.1 The rule

**Rule.** With pain or an injury, do less for that area, make it more stable, and keep it moving. If it is too much, drop the exercise.

| Step | Rule | Decided by |
|---|---|---|
| 1 | Cut that muscle or movement pattern by 30-50 %. | VOL-03 |
| 2 | Move it to machines or to split grips (dumbbells, kettlebells, single handles) instead of a fixed bar. | VOL-03, his sheet note |
| 3 | Keep it moving. | VOL-03 |
| 4 | If it is still too much, drop that exercise. | VOL-03 |
| Swap to one side at a time | When a two-leg or two-arm lift hurts, a single-side version of the same pattern often helps. Keep the sets if you can. | his sheet note, UNI-08 |
| Spine | Use the belt squat when the back should not be loaded. | EQ-11 |
| Rotation | Keep both rotation positions in every week (arms low or overhead, and arms in front; see [levels-and-zones.md](levels-and-zones.md)). When an exercise hurts, pick the swap that uses the other one. | R2-LIB-03 |
| Never | No bands, anywhere. No V-squat. | EQ-01, GEN-08 |

**Why.** We proposed steps 1 to 3. He agreed and added step 4:

> "That's correct, and maybe even drop the exercise altogether if it's too much." (VOL-03)

His own sheet says it in his words (OBSERVED, his spelling; MASTER MODEL workbook, tab 'EXAMPLE ATHLETIC FULL BODY SPLI', cell A6, in `dumps/MASTER_MODEL/05_EXAMPLE_ATHLETIC_FULL_BODY_SPLI.txt`):

> '****When there are joint pains, usually going unilateral or/and also getting away from fixed grips (barbells, bars) and going split grips (dumbbells, kbs, indivitual grips) help take care of some stuff'

On keeping the sets when you swap to a single-side lift:

> "Ideally, but you have to adjust accordingly, by the way." (UNI-08)

On the belt squat:

> "Belt squats are for people that you don't need to load them axially, so it won't be a load on their back." (EQ-11)

### 5.2 How the tool uses it: at the start, and on paper

There are no check-ins and no pain log (R3-VOL-02, R3-GEN-01). So pain is handled in two places.

**At the start.** The person marks what hurts. The plan is built around it.

| Input | What the plan does | Status |
|---|---|---|
| A pain area | That group or pattern starts at 50-70 % of its normal sets. | VOL-03 |
| | Its exercises move to constraint 4-5 machines or split grips. Painful positions are left out. | VOL-03, EQ-03 |
| | The floor of 10 weekly sets does not apply to that group. | PROPOSED reading of VOL-03. Our R3-VOL-01 proposal said "a muscle cut back for pain stays cut". He marked it PARTLY and his words did not touch this part. |
| | It still climbs a little: one set over the block. | PROPOSED |
| A side | The two-leg vs one-leg share moves 20 points toward the pain-free option. | The idea is his (UNI-02); the 20 points are PROPOSED |
| Severe pain | No automatic plan. See a professional. | PROPOSED (follows the health check, R2-GEN-03) |

**During the block.** The plan prints a short guide. The person or the coach follows it. The wording is PROPOSED; the steps come from his answers.

| If | Then |
|---|---|
| An exercise hurts | 1. Swap to the listed alternative in the same category and keep the sets if you can. 2. Still hurts: cut that exercise's sets by a third to a half. 3. Still hurts: drop it for the rest of the block and see a professional. (VOL-03, UNI-08) |
| You feel the wrong muscle, or you cannot do it | Change one small detail, or use the easier listed version. The sets stay. (GEN-05, R2-LIB-01) |
| Several things hurt in one week | Stop the block. Do an easy week or a maintenance phase. Build a new block when ready. The tool never inserts an easy week by itself. (R2-VOL-07, R3-PER-01) |

**Why nothing is tracked.**

> "We're only doing outputs, and people can change accordingly." (R3-VOL-02)

### 5.3 The health check comes first

**Rule.** Before any plan, a short health check (approved, R2-GEN-03). Since round 5 a yes no longer stops the plan: the plan is built with a clear warning to see a medical professional first (R5-GEN-02).

| No automatic plan if the person has |
|---|
| Chest pain or heart issues |
| Surgery or a fracture in the last 6 months |
| A pregnancy, or a birth in the last 6 months |
| An injury under treatment |
| A doctor's instruction not to train |

A coach who builds a plan for a client can run this check with the client, or skip it with a legal warning, because the coach must use their own screening. Everyone accepts a use-at-your-own-risk release each time a plan is built (R2-GEN-03, R3-GEN-01). The exact wording is a legal draft and must be reviewed by a lawyer. See [../00-overview/safety-and-liability.md](../00-overview/safety-and-liability.md).

### 5.4 Hotspots by sport

A **hotspot** is a body area that a sport tends to hurt. Each sport profile carries a short list of hotspot codes. Each code has a few rules: care work to add, positions to avoid, safer versions to choose. [sports.md](sports.md) shows the hotspots of every sport.

The hotspot lists and their rules come from injury research and from what his own programs already do. He was not asked about them sport by sport. Treat all of them as PROPOSED, except the rows marked with his answer.

| Code | Plain name | Example of what the plan does | Source |
|---|---|---|---|
| `PAIN_GENERAL` | Any pain | The rule of section 5.1 | VOL-03, UNI-08, his sheet note |
| `SHOULDER_STRIKER` | Punching shoulder | When punching volume is high, pressing and arm work come down, never to zero | ATH-04 |
| `SHOULDER_THROWER` | Throwing shoulder | Pitchers: less overhead pressing, more arm care, light rotational throws | ATH-08; the rest PROPOSED |
| `HIGH_VOLUME_CONSTRAINT` | High volume | Collect the volume on machines | EQ-03, EQ-04 |
| `LOW_BACK_LOADING` | Low back under heavy load | Heavy squat and heavy deadlift on two different days; other leg days do not load the spine | R2-SES-01, R2-SES-02 |
| `SHOULDER_SWIMMER` | Swimmer's shoulder | Shoulder care in every dryland session, no bands; more pulling than pushing | R3-ATH-01 for the care rule; the rest PROPOSED |
| `ACHILLES_CALF` | Achilles and calf | Calf work on leg days, with a slow lowering | VOL-17 (calves every leg day); the rest PROPOSED |
| `HAMSTRING` | Hamstring | Nordic curls or slider curls every week | PROPOSED |
| `GROIN_ADDUCTOR` | Groin | Copenhagen planks; side-to-side single-leg work | PROPOSED (he uses the Copenhagen plank in his library) |
| `ACL_LANDING_CUTTING` | Knee in landing and cutting | Landing drills first: Receive-Create stage 1 before stages 2 and 3 | PROPOSED, built on CAT-10 |
| `PATELLAR_TENDON` | Patellar tendon (jumper's knee) | Cap the repeated-jump contacts; slow, heavy quad work | PROPOSED |
| `KNEE_DEGENERATIVE_COURT` | Worn knees on court | Knee-friendly strength for racket players from 50 | R3-ATH-02 for the default; the rest PROPOSED |
| `FALLS_COURT`, `FALLS_BONE_DENSITY` | Falls and bone | Balance and quick stepping; landing drills; no fast backpedal drills | PROPOSED |
| `GROWTH_APOPHYSIS` | Growth plates | Fewer high jumps during a growth spurt | PROPOSED |
| `NECK` | Neck (contact and grappling sports) | Direct neck work. His library has no neck column yet. | PROPOSED |

There are 47 codes in all. No rule uses bands.

**Where it lives.**

| What | File and key |
|---|---|
| The pain rules | `generator_spec_v1.json > rule_tables.pain` |
| The pain questions | `generator_spec_v1.json > inputs_schema.fields.F35` (what hurts) and `F36` (detail, PROPOSED) |
| The health check | `generator_spec_v1.json > inputs_schema.fields.F01` and `F45`; `legal_and_privacy.health_check`; `validation_checks.V1_safety` |
| The hotspot library | `synthesis/04_profiles.json > injury_library` (one entry per code: `evidence`, `rules`) |
| Each sport's hotspots | `synthesis/04_profiles.json > profiles[].injuries` and `profiles[].injury_prehab` |
| Compiled copy the engine reads | `model/profiles.json > sports.<profile>.injuries`; `model/rules.json > prehab` |
| Master text | `BLAZE_CAMP_BRAIN.md` §5.7 and §9.9 |

---

## 6. Coming back after time off, and former athletes

**Rule.** Someone who stopped training for more than six months to a year is treated as a beginner in the body, not in skill. A former pro starts at the first level only for a short time.

**Why.**

> "If they take off for more than 6 months to a year, then we have to automatically treat them as a newby as far as their body, but not necessarily as their skills, because they might pick up the skills right away." (PRG-05)

> "I don't want to make an ex-pro athlete go back to Level 1 for no reason." (PRG-05)

In practice: the weekly sets start at the beginner level, the exercise choices can stay at the person's skill level, and the first tests are sub-maximal (R2-PER-07):

> "you should not go from not training to a one-rep max test." (R2-PER-07)

**Where it lives.** `generator_spec_v1.json > inputs_schema.fields.F17` (`years_consistent`, `months_off_last_2y`, `former_competitor`, `level_rule`) and `tests.never_from_zero`. See [levels-and-zones.md](levels-and-zones.md) and [testing.md](testing.md).

---

## 7. Who gets what by default

| Person | Jumps | Olympic lifts | Equipment | Other |
|---|---|---|---|---|
| Adult in athletic training | By the sport's share | Yes, at their level | By level, preference and the equipment they have | - |
| Age 60 and over | Landing drills only. Other jumps off unless switched on. | Off unless switched on. No snatch versions (PROPOSED). | Mostly machines and cables | No overhead squat, no low-bar squat. Lighter medballs. |
| Racket player, 50-59 | Low-impact only, unless switched on | Yes, at their level | Normal | Knee-friendly strength; calves and Achilles every leg day; rotator cuff |
| Under 18 | Yes, landing first | From the floor from about 14, after a hang block | Foundational lists, lighter medballs | A parent or guardian and a qualified coach supervise |
| Injured or in pain | No depth jumps (EQ-03). The rest depends on the area. | No snatch (EQ-03). The rest depends on the area. | Machines or split grips for that area | That area cut 30-50 %. No overhead squat, no low-bar squat (EQ-03). |
| Carrying a lot of training volume | No depth jumps (EQ-03) | No snatch (EQ-03) | More machines, so the volume is collected "in a safe place" | No overhead squat, no low-bar squat (EQ-03) |
| Back after 6-12 months off | Start at stage 1 (our reading of R2-ATH-03) | By skill, which may be higher than the body's level | Normal | Beginner sets; sub-maximal tests |

---

## 8. What is still PROPOSED

| Item | Section |
|---|---|
| Keeping snatch versions out for 60 and over when Olympic lifts are switched on | 2 |
| Maintenance at 70 % or more, sub-maximal tests, jump spacing and machine power loads for 60 and over | 2 |
| The exercise choices behind the racket defaults; the plan for ages 50-59 in other activities | 3 |
| Exercise levels, growth-spurt limits and the growth-stage question for youth | 4 |
| The numbers of the intake pain rule (50-70 % start, one set of climb, 20 points of shift); the "tell us more" pain question | 5.2 |
| The wording of the printed pain guide | 5.2 |
| The hotspot list for each sport and most hotspot rules | 5.4 |
| The legal wording of the health check and the release | 5.3 |
