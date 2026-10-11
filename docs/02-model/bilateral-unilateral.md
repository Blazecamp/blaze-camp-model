# Bilateral and unilateral: the 90/10 to 10/90 scale

The coach calls the balance between bilateral work (both legs or both arms working together) and unilateral work (one side at a time) very important. In his model bilateral work is for driving and creating force, and unilateral work is for health and for keeping rotation. Every person sits somewhere on a scale that runs from 90 % bilateral and 10 % unilateral to the opposite, 10/90. Bodybuilders and powerlifters start near the middle and end near the bilateral side. Field athletes who change direction sit near the unilateral side, and even more in season. Inside unilateral work, the hand that holds the weight matters too: a contralateral load pulls you into the hip, and an ipsilateral load helps you out of it.

> **How to read this page.** A rule with an answer id was decided by coach Lalo Vera. Ids with no prefix (`UNI-02`) are round 1, `R2-` is round 2, `R3-` is round 3. The newest round wins. **PROPOSED** means the team designed it and he has not confirmed it. **OBSERVED** means it was read from his sheets. Shares are always written bilateral / unilateral. His full answers by topic: [../03-coach-answers/bilateral-unilateral.md](../03-coach-answers/bilateral-unilateral.md). **Since model v1.3** there are newer answers too: round 4 (`R4-`, `coach_answers_round4.md`) and two clarifications of 2026-10-10 (`CT-01` on session time, `CX-01..04` on progression and editing). They win on their subjects.

## The rule

| # | Rule | Decided by |
|---|---|---|
| 1 | The share of bilateral to unilateral work runs **from 90/10 to 10/90**. It depends on the athlete and it is adjustable. | UNI-02 |
| 2 | **Bilateral is for driving and creating forces. Unilateral is for health and rotational foundations.** | UNI-02 |
| 3 | **Bodybuilders and powerlifters:** about 50/50 at the start, then 80/20 or 90/10 bilateral. | UNI-02 |
| 4 | **Field athletes who change direction** (tennis, soccer, basketball, football skill positions): 80 to 90 % unilateral in the gym. | UNI-02; the sports are named in CAT-13 |
| 5 | **The upper body follows the same logic.** | UNI-03 |
| 6 | **In season, bilateral work is kept minimal.** Unilateral volume rises as the season gets closer. | UNI-10 |
| 7 | **Pain or injury moves the share.** | UNI-02 |
| 8 | **Contralateral** (weight in the hand opposite the working leg) pulls you into the hip. **Ipsilateral** (weight on the same side) helps you out of the hip. | CAT-13 |
| 9 | Court and combat athletes get **more side-to-side and rotational** unilateral work. Aesthetics clients get little. | UNI-12 |
| 10 | A 10/10 set is one set. Alternating exercises count as unilateral. Unilateral volume progresses like bilateral volume. | UNI-01, UNI-07, UNI-05 |
| 11 | Unilateral lifts use moderate to high reps by default. Heavy low reps are an option. | UNI-04 |
| 12 | Unilateral work takes longer. That shows in the average time printed on a day; it changes nothing in the plan. | UNI-09, CT-01 |
| 13 | **His templates name each slot's kind.** On an A or B day slot 2 is a two-leg lift and slot 4 a single-leg lift. The share is steered only on the slots the template leaves open. | R4-SES-05; open for him on athletic days (section 9a) |

## Why

**The core idea.**

> "Again, the unilateral work is more for health and keeping rotational foundations, and the bilateral is more for driving and creating forces." (UNI-02)

> "It should be a range anywhere from one side, like 90/10, to the other side, 10/90." (UNI-02)

**Why size and strength athletes lean bilateral.** They need to get bigger and stronger, so they need the lifts that drive the most force. Their unilateral work is a health base:

> "A powerlifter or bodybuilder needs to get bigger and stronger. That would be an athlete that needs more bilateral work and, gradually, more bilateral work, and the unilateral stays at the beginning just as a small foundation, maybe 50. It then turns more into an 80/20 or 90/10." (UNI-02)

**Why field athletes lean unilateral.** Their sport is played one leg at a time, with rotation. He does not want them to lose that:

> "Their unilateral work, which is what they do in their sport, can be more like 80% or 90% unilateral work in the gym because I don't want them to lose their rotational forces and skills." (UNI-02)

For them the roles flip. Bilateral work becomes the health base. For a tennis player who does not need to get bigger, "the bilateral work is more of a health foundation and strength of all the connective tissues and joints" (UNI-02).

**Why the share shifts in season.**

> "I would like for them to keep their bilateral work more minimal so that they're not trying to drive changes in their body during their season. I just want them to maintain their strength and their potentiation, and have their nervous system be up high and be able to be powerful." (UNI-10)

**What symmetrical lifting loses.** He uses one-sided, rotational work to give back "the rotational forces that get lost when you do powerlifting and bodybuilding" (CAT-13).

## Where it lives in the data

The readable source is [`generator_spec_v1.json`](../../generator_spec_v1.json). Per-sport values are in [`synthesis/04_profiles.json`](../../synthesis/04_profiles.json). `model/rules.json` and `model/catalog.json` are compiled copies. They are rebuilt by tools, so check the sources first when they differ.

| What | File | JSON key |
|---|---|---|
| The scale, its definition and the share by client type | `generator_spec_v1.json` | `rule_tables.bilateral_unilateral` (`definition`, `slider`, `profiles`) |
| Contralateral and ipsilateral rules | `generator_spec_v1.json` | `rule_tables.contra_ipsi` |
| Side-to-side and rotational share | `generator_spec_v1.json` | `rule_tables.bilateral_unilateral.frontal_transverse_share_of_unilateral` |
| How a new set picks a side (PROPOSED) | `generator_spec_v1.json` | `rule_tables.bilateral_unilateral.placement_filter`, `rule_tables.set_placement.steps` |
| The share the plan uses for one person | `generator_spec_v1.json` | `derived_values.D10_bilateral_share` |
| 10/10 = one set; time cost of unilateral work | `generator_spec_v1.json` | `rule_tables.counting.unilateral`, `rule_tables.counting.unilateral_time_cost` |
| Same-pattern and cross-pattern pairing | `generator_spec_v1.json` | `rule_tables.pairing.same_vs_cross` |
| The "heavy single-leg sets" option | `generator_spec_v1.json` | `inputs_schema.fields.F44.fields.heavy_unilateral` |
| The scale in his words, and how it moves through a block | `synthesis/04_profiles.json` | `bilateral_unilateral_model`, `contra_ipsi` |
| The share for each sport and activity (127 profiles) | `synthesis/04_profiles.json` | `profiles[].bilateral_unilateral` (`block_start`, `block_end`, `in_season`), `profiles[].contra_ipsi`, `profiles[].frontal_transverse_unilateral_pct` |
| The balance as a training variable | `synthesis/11_training_variables.json` | `variables.V22_bilateral_unilateral_balance`, `variables.V14_load_laterality` |
| Whether an exercise is bilateral, unilateral or alternating | `synthesis/02_exercise_catalog.json` | `laterality` on each record |
| Compiled copies | `model/rules.json`; `model/catalog.json` | `bilateral_share`, `contra_ipsi`, `frontal_transverse`; `exercises[].laterality`, `exercises[].plane` |

---

## In detail

### 1. The words

| Word | Meaning |
|---|---|
| Bilateral | Both legs or both arms do the same thing at the same time: back squat, deadlift, barbell bench press. He also says "bilateral, symmetrical". |
| Unilateral | One side works at a time: split squat, lunge, step-up, single-leg RDL (Romanian deadlift), single-arm row. Written per side, for example 10/10. |
| Alternating | The sides take turns inside one set: alternating DB press, alternating lunges. It counts as unilateral (UNI-07). |
| Contralateral | The weight is in the hand opposite the working leg. |
| Ipsilateral | The weight is in the hand on the same side as the working leg. |
| Change of direction (COD) | Cutting, turning and stopping, as in soccer, basketball, tennis and football routes. |
| The share | Of the lower-body compound sets (squat patterns, and hinge patterns such as deadlifts), how many are bilateral and how many unilateral. Leg curls, leg extensions and isolation work are left out of the count. This exact definition is **PROPOSED**. |

### 2. The scale by client type and phase

**Rule.** Each client type has a place on the scale. It moves through the block, and for athletes it moves through the season.

Read the table as bilateral / unilateral share of lower-body compound sets. L1, L2 and L3 are the client levels: beginner, intermediate and advanced (see [volume.md](volume.md)). The coach gave the anchors in rules 3, 4 and 6. Every other number was built by the team around those anchors and is **PROPOSED**.

| Client type | Start of a block (weeks 1-4) | Later in the block or off-season | Pre-season | In season | Status |
|---|---|---|---|---|---|
| Bodybuilder, powerlifter (L2-L3) | **50/50** | **80/20, then 90/10** by the peak | | | Coach: "maybe 50", then "80/20 or 90/10" (UNI-02), CAT-13. Using 80/20 first and 90/10 at the peak is the team's order (**PROPOSED**). |
| Field and court athletes who change direction (he named tennis, soccer, basketball and football players who run routes, CAT-13; the model also places hockey, lacrosse and similar sports here) | **20/80** | 15/85 | 15/85 | **10/90** | Coach: 80-90 % unilateral (UNI-02), minimal bilateral in season (UNI-10). The exact cells sit inside his range and are **PROPOSED**. Some sport profiles already reach 10/90 by the end of an off-season block. |
| Recreational COD sports and racket play (rec soccer, rec basketball, pickleball, padel, rec tennis) | 30/70 | 20/80 | | | **PROPOSED** |
| Beginner aesthetics or general fitness (L1) | 50/50 | 50/50, then 60/40 in later blocks | | | **PROPOSED** |
| Non-competitive athletic, "stay athletic" without a COD sport, bootcamp | 50/50 | 50/50 to 40/60 | | | **PROPOSED** |
| Sprinters and jumpers | 40/60 | 30/70 | 30/70 | 20/80 | **PROPOSED** |
| Strength-type athletes (linemen, wrestlers, rugby forwards, throwers) | 60/40 to 50/50 | 50/50 to 40/60 | 40/60 | 25/75 to 30/70 | **PROPOSED**; the group is his (ATH-03) |
| Baseball and softball | 50/50 | 40/60 | 35/65 | 20/80 | Start OBSERVED in his baseball sheet (4 + 4 sets). In season follows UNI-10. The rest is **PROPOSED**. |
| Combat sports | 40/60 to 30/70 | 30/70 to 20/80 | 30/70 | 20/80 | **PROPOSED** |
| Swimmers, rowers, endurance cyclists | 40/60 to 55/45 | by sport | 50/50 | 30/70 to 50/50 | **PROPOSED** |
| Older or injured clients | 60/40, on constrained machines with supported unilateral work | | | | Machines: EQ-03. Numbers **PROPOSED**. |
| Any client with pain | shift about 20 points toward the side that does not hurt | | | | Pain adjusts: UNI-02. The 20 points are **PROPOSED**. |

The upper body follows the same logic (UNI-03): about 50/50 early and 80/20 to 90/10 later for bodybuilders and powerlifters, about 20/80 for COD athletes. The upper-body numbers are **PROPOSED**.

A coach can override any cell. He said of the scale: "that should be adjustable, no problem" (UNI-02).

Every sport's own numbers: [sports.md](sports.md).

### 3. How the share moves

**Bodybuilders and powerlifters.** The first weeks hold the most one-sided work. Then the plan turns bilateral so they can drive force and build muscle:

> "I give them much more of that at the beginning of their program, maybe the first couple of weeks, 3 weeks, up to 4, maybe. I then slowly but surely turn it into more bilateral, symmetrical dominant, so that they can just drive more forces, build more muscle, and get stronger." (CAT-13)

If something bothers them, one such exercise stays as an accessory later in the program (CAT-13).

**Athletes through the season.** Off-season has the most bilateral strength work. As the season gets closer the plan shifts toward unilateral work in more directions. In season, bilateral work only maintains strength, and unilateral work keeps "your ranges of motion, your health" (UNI-10).

An old baseball in-season sheet of his sat near 55/45. His answer UNI-10 wins over the sheet, so the model uses 20/80 there.

### 4. Contralateral and ipsilateral

**Rule.** In a one-leg exercise, the side that holds the weight changes what the exercise trains.

| Load | What it does | Used for | Decided by |
|---|---|---|---|
| Contralateral (opposite hand) | pulls you **into the hip** on the way down; you then push yourself out | change-of-direction athletes: football route runners, soccer, basketball, tennis. Also builds hip range of motion they may lack. | CAT-13 |
| Ipsilateral (same-side hand) | getting into the hip is harder; the weight helps you **out of the hip** | sprint acceleration, for example ipsilateral step-ups for a 100-metre sprinter | CAT-13 |
| Either one | a health accessory for the hips and lower back | bodybuilders and powerlifters, mostly in the first 2 to 4 weeks | CAT-13 |
| Split stance | always contralateral | his own library note | OBSERVED |

**Why.** He explains it with a lunge:

> "For example, if I go do a lunge with a contralateral load, I'm getting help being pulled into the hip, and then I have to create forces away from the hip." (CAT-13)

> "If I'm holding a lunge with my right leg forward and my right arm holding the weight, getting into the hip is a lot harder because I have to balance the opposite side getting into the hip. To get out, that right hand is going to help me get pulled out of the hip." (CAT-13)

For a sprinter the goal is a strong take-off: "I don't need them to get into the hip; I need them to get out of the hip really quick." (CAT-13)

How much of each (all **PROPOSED**; he gave the reasoning, not the numbers):

| Population | Default |
|---|---|
| COD athletes | about 70 % of loaded unilateral sets contralateral |
| 100-metre sprinters | about 60 % of unilateral sets ipsilateral |
| Bodybuilders, powerlifters | used in weeks 1-4; later only if something bothers them |
| General fitness, weight loss, older clients | alternate contralateral and ipsilateral from one exercise block to the next |

Between exercise blocks, changing which hand holds the weight is one of the small changes he allows. The plan shows it like "Reverse lunge - dumbbell in opposite hand" (R2-LIB-01).

### 5. Side-to-side and rotational work

**Rule.** Court and combat athletes get more unilateral work in the *frontal plane* (side to side) and the *transverse plane* (rotation). Aesthetics clients get little.

**Why.** He approved this as written: "More for basketball, tennis, soccer and MMA; little for aesthetics clients." (UNI-12, marked RIGHT). His sheets had no numbers.

| Who | Share of unilateral lower-body sets that go sideways or rotational | Status |
|---|---|---|
| Basketball, tennis, soccer, MMA (the four he approved as "more"); the model adds hockey, kickboxing, karate, taekwondo, pickleball and padel | about 45-50 % | **PROPOSED** |
| Boxing, wrestling, judo, Brazilian jiu-jitsu | about 30-40 % | **PROPOSED** |
| Aesthetics clients, swimmers | about 10-15 % | **PROPOSED** |

Typical moves: lateral lunge, Cossack lunge, lateral step-up, rotational lunge, hold-between-knees squat. He approved adding these to the main library for court and combat athletes (LIB-20).

### 6. Counting, reps, progression and time

| Topic | Rule | Decided by |
|---|---|---|
| Counting | 3 sets of 10/10 are 3 sets, not 6 | UNI-01 |
| Alternating exercises | counted like unilateral ones | UNI-07 |
| Which muscle | a single-leg lunge counts "mostly for quads", with a quarter set to glutes | UNI-01, R2-VOL-05 |
| Reps | moderate to high by default (about 8 to 12 per side) | UNI-04 |
| Heavy low reps on one leg | an option the athlete or coach can switch on | UNI-04; the switch is **PROPOSED** |
| Progression | the same stairway as bilateral work | UNI-05 |
| Time | a unilateral set takes longer; the time estimate counts it as 1.5 times a bilateral set. The estimate is information only (CT-01). | UNI-09. The 1.5 is **PROPOSED**. |
| Pain swap, bilateral to unilateral | keep the sets "Ideally, but you have to adjust accordingly" | UNI-08 |
| Order in the session | bilateral before unilateral for the same body region | OBSERVED in 225 of 231 of his sessions |

On heavy unilateral work he answered "yes and No, sometimes they use heavy low reps", and said it "can be something that we can add if the athlete feels like they need that" (UNI-04).

Volume rules: [volume.md](volume.md). Progression: [stairway.md](stairway.md).

### 7. Same-pattern and cross-pattern days

This is a related choice. On one day the second lower-body lift can match the first or oppose it.

| Pairing | Example | Who | Why |
|---|---|---|---|
| Same pattern | squat + lunge | aesthetics clients, high-level athletes | drives one muscle harder |
| Cross pattern | squat + single-leg RDL | bootcamp, general clients, most athletes | less soreness, both patterns covered every day |

He confirmed it: "Correct. This is a rule by goal." (UNI-06). For bootcamp clients, "I don't want them to get too sore so they can do the bootcamp more often" (UNI-06). Round 3 made the cross pattern the default for most athletes (R3-SES-01). Placing general clients with the cross pattern is **PROPOSED**. Details: [sessions.md](sessions.md).

### 8. How it fits the two heavy spine days

A week holds one heavy squat day and one heavy deadlift day (R2-SES-01). Those two lifts are bilateral and load the spine. The other lower-body days use lifts that do not load the spine: leg press, belt squat, hip thrust, back extension, reverse hyper and single-leg dumbbell work (R2-SES-02). So a good part of the unilateral share lands on those other days. See [sessions.md](sessions.md).

### 9. How the generator applies it (PROPOSED)

He asked the team to work this out: "We got to figure that out and put that algorithm together." (UNI-02). These mechanics are the team's design.

1. **Adding sets.** When a muscle earns a new set, it goes to a bilateral or a unilateral exercise, whichever is more than 3 points short of the target share. After that the normal order applies (first exercise first).
2. **Changing exercises between blocks.** A bodybuilder moving from 50/50 to 80/20 at week 5 changes one or two lifts, for example a Bulgarian split squat becomes a hack squat.
3. **Athletes.** Bilateral stations are swapped for unilateral ones of the same pattern, starting with the second lower-body day of the week, until the share matches. Off-season, at least one bilateral lift stays in the week unless pain says otherwise.
4. **Equipment swaps.** If a swap changes a lift from bilateral to unilateral, it is counted on its true side.

### 9a. The scale and his templates (round 4)

**Rule.** His round-4 description of the A and B days names the kind of every lower-body slot: "Knee-dominant movement, bilateral, symmetrical (a squat)" in slot 2 and "Unilateral knee-dominant movement, like a lunge" in slot 4 on Day A; a bilateral hip-dominant lift and a unilateral hip-dominant lift on Day B (R4-SES-05). The data keeps each slot's kind in every block. The scale of this page then acts on what the template leaves open: the vertical pull, the isolation details, the jump stations, and the choice of lift inside a slot.

| Case | What happens | Status |
|---|---|---|
| Gym A / B / C days and push / pull / legs days | a two-leg slot holds a two-leg lift, a single-leg slot a single-leg lift; the A day opens with a two-arm row | R4-SES-05; the selection weights are **PROPOSED** |
| Athletic A / B / C days | the same slots, after the athletic block | R4-SES-05 read by the team; **open for the coach** |
| A plan whose template holds more two-leg work than the sport's share asks for | the plan says so in one line | **PROPOSED** |

**Open for the coach.** A field or court athlete should do 80 to 90 % of gym work on one leg (UNI-02). On his A / B template about half of the lower-body slots are two-leg lifts. The soccer sample plan holds about 45 % two-leg work against a target of 20 % (`samples/STATUS_v0.5.md`). The data follows the template on athletic days because round 4 is the newer answer. He has not said which wins.

### 10. Evidence

- **OBSERVED.** His written programs mostly sit near 50 % bilateral. Bilateral lifts come before unilateral ones in 225 of 231 sessions.
- **SCIENCE.** A review of 14 studies found unilateral training improves single-leg jumps more, and bilateral training improves bilateral strength more (Liao 2022). That fits his split of roles. It is listed in `synthesis/12_volume_algorithm_v1.json > research_vs_coach`.

---

## Do not get these wrong

| Mistake | Correct |
|---|---|
| Counting 3 × 10/10 as 6 sets | 3 sets (UNI-01) |
| Treating an alternating exercise as bilateral | it is unilateral (UNI-07) |
| Giving in-season athletes a bilateral-heavy week because an old sheet did | in season, bilateral is minimal (UNI-10) |
| Choosing the share from a sex field | there is no sex field (GEN-02, ATH-09) |
| Using bands for rotation or stability work | no bands anywhere (EQ-01, EQ-07) |

## Still PROPOSED

Waiting for his yes or no:

- Every share in section 2 except the anchors in rules 3, 4 and 6.
- The shares for recreational players (one step more bilateral than competitive athletes).
- The contralateral and ipsilateral percentages (70 % and 60 %).
- The side-to-side and rotational shares (45-50 %, 30-40 % and 10-15 %).
- Which end of his 80 to 90 % range a change-of-direction athlete sits at in each phase.
- General clients on the cross pattern.
- The 20-point shift for pain.
- Choosing contralateral or ipsilateral by sport only, with no hip-range screen.
- The 3-point tolerance when adding sets, and the switch from 50/50 to 80/20 at week 5.
- Whether COD athletes at 80-90 % unilateral still train each bilateral pattern once a week. After round 4 the bigger form of this question: whether athletic A / B days keep a two-leg lift in slot 2 on every day (section 9a).
- The upper-body numbers.

## Related pages

- [volume.md](volume.md): how sets are counted.
- [stairway.md](stairway.md): how weekly sets climb through a block to their final number.
- [sessions.md](sessions.md): pairing, the two spine days and session order.
- [athletes.md](athletes.md) and [sports.md](sports.md): season phases and each sport's share.
- [categories.md](categories.md): patterns, laterality and planes.
- [special-populations.md](special-populations.md): older adults, pain and injury.
- [../05-reference/glossary.md](../05-reference/glossary.md): every term.
- Decision record: [the bilateral : unilateral scale](../04-decisions/adr-033-bilateral-unilateral-scale.md). All records: [../04-decisions/index.md](../04-decisions/index.md).
