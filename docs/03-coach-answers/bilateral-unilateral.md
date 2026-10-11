# Coach answers: Bilateral and unilateral

How the coach splits work between two-sided (bilateral) and one-sided (unilateral) lifts. Bilateral means both limbs work together, like a squat. Unilateral means one side at a time, like a lunge. His rule: unilateral work is for health and for keeping rotation; bilateral work is for driving and creating force. The share runs from 90/10 to 10/90 depending on the athlete, the season and pain. This page also covers contralateral and ipsilateral loading (which hand holds the weight).

This page is part of [the coach answers by topic](index.md). It holds 10 question ids. Every place where a later round changed an earlier answer is also listed in [changes across rounds](changes-across-rounds.md). Read next: [model guide: bilateral and unilateral](../02-model/bilateral-unilateral.md).

## The rules in short

CONFIRMED means the coach said it or approved it. PROPOSED means the team designed it and he has not confirmed it. INFERRED means the team's reading of his words; he has not confirmed that either.

| # | Rule | Answer ids | Status |
|---|---|---|---|
| 1 | Unilateral work is for health and keeping rotational foundations. Bilateral work is for driving and creating forces. | [UNI-02](#uni-02) | CONFIRMED |
| 2 | The bilateral : unilateral share is a range from 90/10 to 10/90, by athlete. It is adjustable, and pain or injury shifts it. | [UNI-02](#uni-02) | CONFIRMED |
| 3 | Bodybuilders and powerlifters: unilateral starts as a small foundation ("maybe 50"), then the plan moves to 80/20 or 90/10 bilateral. | [UNI-02](#uni-02) | CONFIRMED |
| 4 | Field and change-of-direction athletes keep a big unilateral share: up to 80 or 90 % of gym work. | [UNI-02](#uni-02) | CONFIRMED |
| 5 | The upper body follows the same logic. | [UNI-03](#uni-03) | CONFIRMED |
| 6 | In season, bilateral work stays minimal. Unilateral work keeps range of motion and health. | [UNI-10](#uni-10) | CONFIRMED |
| 7 | 10/10 means 10 reps on each side and counts as one set. An alternating exercise counts like a unilateral one. | [UNI-01](#uni-01), [UNI-07](#uni-07) | CONFIRMED |
| 8 | Unilateral lifts use moderate to high reps by default. Heavy low-rep unilateral work is an option, not the default. | [UNI-04](#uni-04) | CONFIRMED |
| 9 | Unilateral volume progresses about the same as bilateral volume. | [UNI-05](#uni-05) | CONFIRMED |
| 10 | When pain makes you swap a bilateral lift for a unilateral one, keep the sets if you can, and adjust. | [UNI-08](#uni-08) | CONFIRMED |
| 11 | Court and combat athletes get more frontal and transverse unilateral work; aesthetics clients get little. | [UNI-12](#uni-12) | CONFIRMED |
| 12 | Contralateral load pulls you into the hip. Ipsilateral load helps you get out of the hip. | [CAT-13](#cat-13) | CONFIRMED |
| 13 | The exact share for each sport and phase, the contralateral / ipsilateral split, and the frontal / transverse numbers. | [UNI-02](#uni-02), [CAT-13](#cat-13), [UNI-12](#uni-12) | PROPOSED |

## Why, in his words

- "the unilateral work is more for health and keeping rotational foundations, and the bilateral is more for driving and creating forces" ([UNI-02](#uni-02))
- "I would like for them to keep their bilateral work more minimal so that they're not trying to drive changes in their body during their season." ([UNI-10](#uni-10))
- "That's the rotational forces that get lost when you do powerlifting and bodybuilding" ([CAT-13](#cat-13))
- "The volume between unilateral and bilateral is very important." (conversation, `coach_chat_statements.md`)

## Where it lives in the data

Keys are in [`generator_spec_v1.json`](../../generator_spec_v1.json), the machine-readable twin of the model, unless another file is named.

| What | File | JSON key |
|---|---|---|
| The 90/10 to 10/90 slider | `generator_spec_v1.json` | `rule_tables.bilateral_unilateral.slider` |
| How the share is measured | `generator_spec_v1.json` | `rule_tables.bilateral_unilateral.definition` |
| Shares by client type and phase | `generator_spec_v1.json` | `rule_tables.bilateral_unilateral.profiles` |
| Shares for every sport profile | `synthesis/04_profiles.json` | `sports` |
| Contralateral and ipsilateral rules | `generator_spec_v1.json` | `rule_tables.contra_ipsi` |
| Frontal and transverse share | `generator_spec_v1.json` | `rule_tables.bilateral_unilateral.frontal_transverse_share_of_unilateral` |
| Counting a unilateral set | `generator_spec_v1.json` | `rule_tables.counting.unilateral` |
| Unilateral reps and the heavy option | `generator_spec_v1.json` | `rule_tables.reps.unilateral` |

## Questions on this page

| ID | Round | His verdict | Final rule in one line | Status |
|---|---|---|---|---|
| [UNI-02](#uni-02) | 1 | answered in words (no chip) | Bilateral : unilateral share runs 90/10 to 10/90 by athlete; unilateral = health and rotation, bilateral = driving force. | Stands |
| [UNI-03](#uni-03) | 1 | answered in words (no chip) | Upper body: same 90/10 to 10/90 logic. | Stands |
| [UNI-10](#uni-10) | 1 | RIGHT | In season: bilateral minimal, unilateral keeps range and health. | Stands |
| [UNI-01](#uni-01) | 1 | answered in words (no chip) | 10/10 = 10 each side = one set, mostly quads. Landmarks: 15-20 maintenance to some growth, 20-25 growth, 5 too little, 40 too much. | Stands, refined |
| [UNI-07](#uni-07) | 1 | RIGHT | Alternating exercises count like unilateral ones. | Stands |
| [UNI-04](#uni-04) | 1 | RIGHT | Unilateral reps moderate to high by default; heavy low reps available as an option. | Stands |
| [UNI-05](#uni-05) | 1 | answered in words (no chip) | Unilateral progresses like bilateral; 10 % a week is way too much. | Stands, refined |
| [UNI-08](#uni-08) | 1 | PARTLY | Pain swap bilateral to unilateral: keep the sets ideally, adjust as needed. | Stands, refined |
| [UNI-12](#uni-12) | 1 | RIGHT | More frontal and transverse unilateral work for court and combat athletes; little for aesthetics. | Stands |
| [CAT-13](#cat-13) | 1 | answered in words (no chip) | Contralateral load gets you into the hip; ipsilateral helps you out. COD athletes use both; sprinters ipsilateral; BB/PL as early accessory work. | Stands, refined |

## What he said in conversation

These are statements he made while the model was being built. They are closely paraphrased in the source files, with his exact words in quotation marks. A questionnaire answer wins where the two differ.

| Statement | Source | How the questionnaires treated it |
|---|---|---|
| "The volume between unilateral and bilateral is very important." | `coach_chat_statements.md` | Answered in detail by [UNI-01](#uni-01) to [UNI-12](#uni-12). |
| The bilateral vs unilateral VOLUME relationship is very important (coach's emphasis). | `coach_answers.md` (earliest notes) | No questionnaire answer changed it. |

## Every question and his final answer

Each entry gives the question, the final rule as it stands today, what we assumed or proposed, his verdict, a short quote, what is not confirmed, where the rule lives, and every later change. His full dictated answer is folded under each entry.

### The share

#### UNI-02

**Question (round 1).** What share of weekly lower-body sets should be bilateral vs unilateral, by goal?

**Final rule.** The share of bilateral and unilateral lower-body work is a range from 90/10 to 10/90. It depends on the athlete and is adjustable. A powerlifter or bodybuilder needs to get bigger and stronger, so unilateral work is a small foundation at the start ("maybe 50") and the plan then moves to 80/20 or 90/10 bilateral; for them unilateral work is mainly for health. A field athlete who does not need to get bigger (his example: a tennis player) is the reverse: bilateral work is the health and strength foundation for connective tissue and joints, and unilateral work can be 80 or 90 % of gym work so they keep their rotational forces and skills. Pain or injury shifts the share.

- **Status:** Stands as answered. One open reading was added after round 4 (see "Changed later").
- **We assumed (round 1):** Observed: aesthetics days run 1 bilateral + 1 unilateral lower lift (about 50/50); baseball runs bilateral 4 sets + unilateral 4 sets. Please give rough % for aesthetics, athletes off-season, athletes in-season, older/injured, beginners and strength/powerlifting.
- **His verdict (round 1):** answered in words, no chip
- **In his words:** "the unilateral work is more for health and keeping rotational foundations, and the bilateral is more for driving and creating forces" / "It should be a range anywhere from one side, like 90/10, to the other side, 10/90." (UNI-02)
- **Not confirmed by him:** He gave the two ends and said "We got to figure that out and put that algorithm together." The exact share for each sport, position and phase is PROPOSED.
- **Where it lives:** `generator_spec_v1.json` → `rule_tables.bilateral_unilateral.slider`, `rule_tables.bilateral_unilateral.profiles`
- **Changed later:**
  - **OPEN after [R4-SES-05](sessions-and-order.md#r4-ses-05) (round 4).** His A / B template names a two-leg lift in slot 2 and a single-leg lift in slot 4, and the athletic days use the same lifts after the athletic block. So a field or court athlete now gets more two-leg lower-body work than the 80 to 90 % single-leg share of this answer. In the soccer sample plan the template holds about 45 % two-leg work against a target of 20 % (`samples/STATUS_v0.5.md`). Which wins on athletic days is a question for him.
- **See also:** [UNI-03](#uni-03), [UNI-10](#uni-10), [CAT-13](#cat-13)

<details>
<summary>His full answer, round 1 (from <code>coach_answers_full.md</code>)</summary>

> So again, athletes that are field athletes don't need to get bigger and stronger that much. A powerlifter or bodybuilder needs to get bigger and stronger. That would be an athlete that needs more bilateral work and, gradually, more bilateral work, and the unilateral stays at the beginning just as a small foundation, maybe 50. It then turns more into an 80/20 or 90/10. We need to figure that out, and that should be adjustable, no problem. That's mainly for health for these types of athletes.
>
> For the field athletes, you're going to need a bigger percentage to keep on the unilateral. If it's a tennis player, for example, that doesn't need to get bigger, then it'll be more like the bilateral work is more of a health foundation and strength of all the connective tissues and joints and all of that, to stimulate that output or that result that I want of keeping them healthy.
>
> Their unilateral work, which is what they do in their sport, can be more like 80% or 90% unilateral work in the gym because I don't want them to lose their rotational forces and skills. Anything that has to do with field athletes in sports that have a lot of change of direction and movement capacities in unilateral work, then they should have more. It should be a range anywhere from one side, like 90/10, to the other side, 10/90. We got to figure that out and put that algorithm together. Also, keeping in mind that sometimes the athletes might have some type of pain or some type of injury, for example, we need to adjust accordingly. Yeah. Again, the unilateral work is more for health and keeping rotational foundations, and the bilateral is more for driving and creating forces.

</details>

#### UNI-03

**Question (round 1).** Same question for upper body: how much unilateral pressing and pulling?

**Final rule.** The upper body follows the same logic as the lower body. He answered with the same words: a range from 90/10 to 10/90, more unilateral work for field athletes whose sport is one-sided and full of direction changes, and adjustment for pain or injury.

- **Status:** Stands as answered.
- **We assumed (round 1):** Your templates are mostly bilateral up top. Unilateral upper work (single-arm rows, alternating/seesaw press, landmine) shows up as variety or for joint pain.
- **His verdict (round 1):** answered in words, no chip
- **In his words:** "Again, the unilateral work is more for health and keeping rotational foundations, and the bilateral is more for driving and creating forces." (UNI-03)
- **Not confirmed by him:** Upper-body shares by client type are PROPOSED.
- **Where it lives:** `generator_spec_v1.json` → `rule_tables.bilateral_unilateral.definition`
- **See also:** [UNI-02](#uni-02)

<details>
<summary>His full answer, round 1 (from <code>coach_answers_full.md</code>)</summary>

> Their unilateral work, which is what they do in their sport, can be more like 80% or 90% unilateral work in the gym because I don't want them to lose their rotational forces and skills. Anything that has to do with field athletes in sports that have a lot of change of direction and movement capacities in unilateral work, then they should have more. It should be a range anywhere from one side, like 90/10, to the other side, 10/90. We got to figure that out and put that algorithm together. Also, keeping in mind that sometimes the athletes might have some type of pain or some type of injury, for example, we need to adjust accordingly. Yeah. Again, the unilateral work is more for health and keeping rotational foundations, and the bilateral is more for driving and creating forces.

</details>

#### UNI-10

**Question (round 1).** For athletes, does unilateral volume rise as the season gets closer?

**Final rule.** For athletes the unilateral share rises as the season gets closer. In season he keeps bilateral work minimal: the aim is not to drive changes in the body during the season, only to maintain strength and potentiation and keep the nervous system high and powerful. Unilateral work keeps range of motion and health.

- **Status:** Stands as answered.
- **We assumed (round 1):** Yes. It shifts from bilateral strength off-season to more unilateral and multi-plane work pre-season and in-season.
- **His verdict (round 1):** RIGHT, with words
- **In his words:** "I would like for them to keep their bilateral work more minimal so that they're not trying to drive changes in their body during their season." (UNI-10)
- **Where it lives:** `generator_spec_v1.json` → `rule_tables.bilateral_unilateral.profiles`, `plan_types.season.in`
- **See also:** [UNI-02](#uni-02), [PER-08](plans-and-calendar.md#per-08), [R2-ATH-07](athletes-and-sports.md#r2-ath-07)

<details>
<summary>His full answer, round 1 (from <code>coach_answers_full.md</code>)</summary>

> In my model, it is correct. I would like for them to keep their bilateral work more minimal so that they're not trying to drive changes in their body during their season. I just want them to maintain their strength and their potentiation, and have their nervous system be up high and be able to be powerful.
>
> The unilateral work is more. It's going to keep that, and it's going to also make sure you're keeping your ranges of motion, your health, and all of that. In my model, in my mind, that's correct. That's exactly what I would want for them, and it's logical to me.

</details>

### Counting, reps and progression

#### UNI-01

**Question (round 1).** How do you count a unilateral set toward weekly volume?

**Final rule.** "10/10" means 10 reps on each leg. 3 sets of 10/10 rear-foot-elevated lunges are 3 sets, not 6. He counts those sets mostly for quads. In round 1 he did not count them for glutes; round 2 gave glutes a quarter set. In the same answer he gave his volume landmarks: 15 to 20 sets of a muscle per week is a good foundation for maintenance to a little growth, 20 to 25 is a growth foundation, 5 is too little and 40 sets of chest is way too much. He asked the team to check these against published research.

- **Status:** Stands. Later answers added detail (see "Changed later").
- **We assumed (round 1):** 3 × 10/10 rear-foot-elevated lunges = 3 sets for quads/glutes, not 6 (one set covers both sides).
- **His verdict (round 1):** answered in words, no chip
- **In his words:** "So when I say 10/10, it means 10 on each leg." / "I think doing 40 sets of chest per week might be way too much, but I think 5 might be too little." (UNI-01)
- **Where it lives:** `generator_spec_v1.json` → `rule_tables.counting.unilateral.rule`, `rule_tables.counting.credit_map.UKD`, `rule_tables.weekly_sets.landmarks_coach`
- **Changed later:**
  - **REFINED by [R2-VOL-05](volume.md#r2-vol-05) (round 2).** Before: "I don't necessarily count it for glutes, but we can figure out a way to do that." Now: Lunges, squats, deadlifts and RDLs count a quarter set for glutes.
  - **REFINED by [R2-VOL-06](volume.md#r2-vol-06) (round 2).** Before: 15 to 20 a good foundation; 5 too little. Now: A floor of 10 sets a week per muscle, and ceilings of 14 / 22 / 25 by level.
- **See also:** [UNI-07](#uni-07), [VOL-01](volume.md#vol-01), [VOL-09](volume.md#vol-09), [R2-VOL-05](volume.md#r2-vol-05), [R2-VOL-06](volume.md#r2-vol-06), [PRG-07](library-details.md#prg-07)

<details>
<summary>His full answer, round 1 (from <code>coach_answers_full.md</code>)</summary>

> So when I say 10/10, it means 10 on each leg. Unilateral work: 10 would be one leg, and 10 would be the other leg. That's how I count that. And if I do 3 sets of 10 and 10 rear-foot-elevated lunges, then I'm counting those mostly for quads. I don't necessarily count it for glutes, but we can figure out a way to do that. Essentially, this goes in line with being able to create a good foundation of total sets, and somehow there's a mathematical correlation or algorithm for doing the best amount of sets for that person per week per muscle group. There's a big average of growth of the muscle between 15 and 20 reps. I'm sure there are a lot of charts out there that can give an idea of what an average amount of sets would be for a good, solid foundation of growth. We need to figure that out: what would be the best algorithm for us?
>
> I think doing 40 sets of chest per week might be way too much, but I think 5 might be too little. We need to figure out what's out there, what has been studied on this specific subject of volume, and see what kind of volume we can adjust. I like that 15 to 20 sets of any muscle group per week would be a good foundation for maintenance to a little bit of growth, and then 20 to 25 sets maybe can be a good growth foundation. That's just the average range that I've seen from my personal experience.

</details>

#### UNI-07

**Question (round 1).** Does an alternating exercise (alternating DB press, alternating lunges) count like a unilateral one?

**Final rule.** An alternating exercise (alternating DB press, alternating lunges) counts like a unilateral one: same counting and same rep logic.

- **Status:** Stands as answered.
- **We assumed (round 1):** Yes. Same counting and same rep logic.
- **His verdict (round 1):** RIGHT, no words (our proposal became his rule)
- **Where it lives:** `generator_spec_v1.json` → `rule_tables.counting.unilateral.rule`
- **See also:** [UNI-01](#uni-01)

#### UNI-04

**Question (round 1).** Do unilateral lifts always use moderate-to-high reps, never heavy low reps?

**Final rule.** Unilateral lifts usually use moderate to high reps. His answer was "yes and no": sometimes they use heavy low reps. In his usual programming he does not need heavy low-rep unilateral work, but it should be available as an option when the athlete or the coach asks for it.

- **Status:** Stands as answered.
- **We assumed (round 1):** Yes. Observed bilateral 4–15 reps (12/10/8/8); unilateral 8/8 to 12/12.
- **His verdict (round 1):** RIGHT, with words
- **In his words:** "That might be something that can be optional in our algorithm." (UNI-04)
- **Note:** His dictated answer breaks off mid-sentence ("but I think that maybe").
- **Where it lives:** `generator_spec_v1.json` → `rule_tables.reps.unilateral`, `inputs_schema.fields.F44.fields.heavy_unilateral`
- **See also:** [VOL-11](volume.md#vol-11)

<details>
<summary>His full answer, round 1 (from <code>coach_answers_full.md</code>)</summary>

> yes and No, sometimes they use heavy low reps. Also, we just need to see where they are and what they need. I don't really need them to do very high volume or low reps and high weight or high load, but it can be something that we can add if the athlete feels like they need that. That might be something that can be optional in our algorithm. If the athlete or the coach wants to submit that to have it on there, then it should be available. In my usual programming, I don't really need it to be, but I think that maybe

</details>

#### UNI-05

**Question (round 1).** Does unilateral volume progress differently from bilateral?

**Final rule.** Unilateral volume progresses about the same as bilateral volume, like any program. Progress might be 3 % or 5 % a week. 10 % a week is way too much and hard to sustain over an 8-week program. Rounds 2 and 3 turned this into the stairway that every plan follows.

- **Status:** Stands. Later answers added detail (see "Changed later").
- **We assumed (round 1):** Add reps per side first, then load, and add sets less often than on bilateral lifts. Not observed, so this is a guess.
- **His verdict (round 1):** answered in words, no chip
- **In his words:** "It progresses about the same." / "That's way too much. It's hard to sustain a program like that for an 8-week program." (UNI-05)
- **Note:** In this answer he lists "the muscle" among the things a step may depend on. Asked directly in [VOL-05](progression.md#vol-05), he said the step does not go by muscle. [VOL-05](progression.md#vol-05) is the rule.
- **Where it lives:** `generator_spec_v1.json` → `rule_tables.counting.unilateral.progression`, `rule_tables.rate_engine.hard_ceiling`
- **Changed later:**
  - **REFINED by [R2-PER-03](progression.md#r2-per-03) (round 2).** Before: Progressions of 3 % or 5 %. Now: Every plan is a stairway: smaller steps first, slightly bigger after halfway.
  - **REFINED by [R3-VOL-04](progression.md#r3-vol-04) (round 3).** Before: Progressions of 3 % or 5 %. Now: About 3 % a week to the halfway week, about 5 % after.
  - **REFINED by [CX-01](progression.md#cx-01) (2026-10-10) and [R4-PRG-02](progression.md#r4-prg-02) (round 4).** Before: 10 % a week is way too much; the team used "under 10 %" as a hard limit on the weekly total. Now: No hard limit. The final sets are reached, and a week that adds more than about 15 % carries a note. His remark still describes the usual pattern of about 3 % and 5 %.
- **See also:** [VOL-04](progression.md#vol-04), [VOL-05](progression.md#vol-05), [R3-VOL-04](progression.md#r3-vol-04)

<details>
<summary>His full answer, round 1 (from <code>coach_answers_full.md</code>)</summary>

> It progresses about the same. It's just, again, how the athlete feels, how good the athlete is getting, and how they're doing the rest of the things in their life. Overall, it just progresses like any progression of a program. The progressions might be 3%, 5%, depending on the muscle, how tired they are, and a lot of things, but it can progress week by week by 10%. That's way too much. It's hard to sustain a program like that for an 8-week program. Sometimes you make jumps and you have potentiation, so we have to assume that everything progresses the same, but it's all independent of the athlete and what's a good average for that.

</details>

### Pain

#### UNI-08

**Question (round 1).** When pain makes you swap a bilateral lift for a unilateral one, do you keep the same sets or cut them?

**Final rule.** When pain makes you swap a bilateral lift for a unilateral one, keep the same sets if you can, but adjust as needed. We had assumed the load and the reps per side come down.

- **Status:** Stands. Later answers added detail (see "Changed later").
- **We assumed (round 1):** Keep the sets, and lower the load and the reps per side.
- **His verdict (round 1):** PARTLY
- **In his words:** "Ideally, but you have to adjust accordingly, by the way." (UNI-08)
- **Where it lives:** `generator_spec_v1.json` → `rule_tables.pain`
- **Changed later:**
  - **REFINED by [R3-VOL-02](progression.md#r3-vol-02) (round 3).** Before: Keep the sets ideally and adjust (the design then made the swap when pain was logged). Now: No check-ins: the person or coach makes the swap. Listing an alternative on the plan is the team's design (PROPOSED).
- **See also:** [VOL-03](volume.md#vol-03), [R2-LIB-03](levels-and-zones.md#r2-lib-03)

<details>
<summary>His full answer, round 1 (from <code>coach_answers_full.md</code>)</summary>

> Ideally, but you have to adjust accordingly, by the way.

</details>

### Planes and which hand holds the weight

#### UNI-12

**Question (round 1).** How much frontal/transverse unilateral work (lateral lunges, cossacks, lateral step-ups, rotational lunges) do court and combat athletes get?

**Final rule.** Court and combat athletes (basketball, tennis, soccer, MMA) get more frontal and transverse unilateral work: lateral lunges, cossacks, lateral step-ups, rotational lunges. Aesthetics clients get little.

- **Status:** Stands as answered.
- **We assumed (round 1):** More for basketball, tennis, soccer and MMA; little for aesthetics clients. No numbers in the sheets.
- **His verdict (round 1):** RIGHT, no words (our proposal became his rule)
- **Not confirmed by him:** He gave no numbers. The share for each profile is PROPOSED.
- **Where it lives:** `generator_spec_v1.json` → `rule_tables.bilateral_unilateral.frontal_transverse_share_of_unilateral`
- **See also:** [LIB-20](library-details.md#lib-20), [CAT-13](#cat-13)

#### CAT-13

**Question (round 1).** Contralateral ('get into the hip') vs ipsilateral ('get out of the hip'): when do you choose each?

**Final rule.** Contralateral means the weight is held on the opposite side of the working leg. It pulls you into the hip: it helps the body coil on the way down, and then you create force away from the hip. Ipsilateral means the weight is on the same side. Getting into the hip is harder, and the weight helps pull you out of it. Who gets what depends on the athlete. Change-of-direction athletes (football players who run routes, soccer, basketball, tennis) need to get in and out of the hip quickly and need the ranges of motion. A 100-meter sprinter uses ipsilateral work such as ipsilateral step-ups to build a strong takeoff: getting out of the hip fast. For powerlifters and bodybuilders he uses both as accessory work to keep the hips and lower back healthy, because their bilateral, symmetrical lifting loses rotation. They get more of it in the first 2 to 4 weeks of a program, then mostly bilateral work, and it stays as an accessory if something is bothering them.

- **Status:** Stands. Later answers added detail (see "Changed later").
- **We assumed (round 1):** Contralateral is the default, and ipsilateral is used for frontal-plane or hip-control goals. Not sure.
- **His verdict (round 1):** answered in words, no chip
- **In his words:** "Contralateral exercises are usually to pull me into the hip" / "I use contralateral and ipsilateral movements for powerlifters and bodybuilders as accessory movements in order to keep them healthy" (CAT-13)
- **Not confirmed by him:** How much of the unilateral work is contralateral or ipsilateral for each profile is PROPOSED.
- **Where it lives:** `generator_spec_v1.json` → `rule_tables.contra_ipsi`
- **Changed later:**
  - **REFINED by [R2-LIB-01](library-details.md#r2-lib-01) (round 2).** Before: Which side holds the weight is chosen by athlete type. Now: It is also one of the single details the tool may change between blocks, shown like "Reverse lunge - dumbbell in opposite hand".
- **See also:** [UNI-02](#uni-02), [UNI-12](#uni-12), [R2-LIB-01](library-details.md#r2-lib-01)

<details>
<summary>His full answer, round 1 (from <code>coach_answers_full.md</code>)</summary>

> This is a good question. Contralateral exercises are usually to pull me into the hip, meaning I'm going to have to create forces that are going to get away. Before I can create those forces concentrically, my eccentric going down is getting into the coiling of the body, so it's helping me coil into my body. It's helping me get into the hip.
>
> For example, if I go do a lunge with a contralateral load, I'm getting help being pulled into the hip, and then I have to create forces away from the hip. Versus ipsilateral, it's as if I can help myself with the weight. If I'm holding a lunge with my right leg forward and my right arm holding the weight, getting into the hip is a lot harder because I have to balance the opposite side getting into the hip. To get out, that right hand is going to help me get pulled out of the hip.
>
> When do you choose those? It depends on the athlete, and usually it's more for change-of-direction athletes. Athletes that have to do a lot of change of direction can be:
>
> - football players that are in positions of running and changing directions, routes, and things like that
> - soccer players
> - basketball players, a lot
> - tennis, definitely
>
> There are a lot of athletes that are going to need to be getting in and out of the hip quickly and also have the ranges of motion. Sometimes they don't have the ranges of motion, so we help them by creating those. That's the contralateral-ipsilateral reasoning.
>
> Now, for us, a sprinter, for example, instead of getting in and out of the hip, if it's a 100-meter sprinter, usually when we do the ipsilateral, it's ipsilateral step-ups, for example. We're trying to create a very strong takeoff, a very strong creation of forces. I don't need them to get into the hip; I need them to get out of the hip really quick. When they step forward and they have to drive forces forward, usually that's an external rotation bias: internal rotation on the leg, but external rotation on the hip. It's creating a force forward. That ipsilateral gets the job done at the foundational acceleration phase of a sprinter.
>
> If I want to create forces of a sprinter or quickly create forces in the speed and athletes, then I would use that for more bodybuilding styles. The contralateral and ipsilateral work is more for mainly foundational health of the hips and the lower back if I'm doing lunges, for example. That's the rotational forces that get lost when you do powerlifting and bodybuilding, for example, because those are more bilateral, symmetrical movements and not so much unilateral.
>
> I use contralateral and ipsilateral movements for powerlifters and bodybuilders as accessory movements in order to keep them healthy, but I don't give them too much of that. I give them much more of that at the beginning of their program, maybe the first couple of weeks, 3 weeks, up to 4, maybe. I then slowly but surely turn it into more bilateral, symmetrical dominant, so that they can just drive more forces, build more muscle, and get stronger. If there is anything bugging them or anything bothering them, I leave it as an accessory sometimes later on in their programs when they're trying to peak.

</details>

## Related answers on other pages

| ID | Page | What it says |
|---|---|---|
| [UNI-06](sessions-and-order.md#uni-06) | [sessions-and-order](sessions-and-order.md) | Same-pattern or opposite-pattern pairing depends on the goal. |
| [UNI-09](sessions-and-order.md#uni-09) | [sessions-and-order](sessions-and-order.md) | Unilateral work takes longer; session lengths. |
| [UNI-11](sessions-and-order.md#uni-11) | [sessions-and-order](sessions-and-order.md) | Hip dominant with push, knee dominant with pull. |
| [R2-VOL-05](volume.md#r2-vol-05) | [volume](volume.md) | A lunge counts a quarter set for glutes. |
| [LIB-20](library-details.md#lib-20) | [library-details](library-details.md) | Frontal and transverse lower-body moves are added to the library. |
| [LIB-09](library-details.md#lib-09) | [library-details](library-details.md) | The alternating staggered-stance deadlift. |
| [R2-SES-02](sessions-and-order.md#r2-ses-02) | [sessions-and-order](sessions-and-order.md) | Single-leg dumbbell work does not count as loading the spine. |
| [R2-LIB-01](library-details.md#r2-lib-01) | [library-details](library-details.md) | Which hand holds the weight is one detail the tool may change between blocks. |
