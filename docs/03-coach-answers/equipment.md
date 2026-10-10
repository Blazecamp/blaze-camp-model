# Coach answers: Equipment

What equipment the model uses and who gets what. Machines give many reference points and constraints, so you can push hard and it is safer: more machines for people doing high volume, for injured people and for older people. Free weights ask for more skill, with barbells the most skilled. The coach never programs bands, and there is no variable resistance (bands, chains, weight releasers) for now. Machines are not ranked: what feels right in your gym is right. This page also holds the medball, jump and cardio-tool answers.

This page is part of [the coach answers by topic](index.md). It holds 16 question ids. Every place where a later round changed an earlier answer is also listed in [changes across rounds](changes-across-rounds.md). Read next: [model guide: equipment](../02-model/equipment.md).

## The rules in short

CONFIRMED means the coach said it or approved it. PROPOSED means the team designed it and he has not confirmed it. INFERRED means the team's reading of his words; he has not confirmed that either.

| # | Rule | Answer ids | Status |
|---|---|---|---|
| 1 | No bands anywhere. No variable resistance (bands, chains, weight releasers) for now. | [EQ-01](#eq-01), [EQ-02](#eq-02), [EQ-07](#eq-07), [EQ-08](#eq-08), [EQ-12](#eq-12) | CONFIRMED |
| 2 | Machines have many reference points and constraints: you can push a lot and it is safer. Barbells are the most skilled; dumbbells, kettlebells and medicine balls sit in between. | conversation | CONFIRMED |
| 3 | The 1 to 5 constraint scale: 5 = seated machine with a back pad, 4 = plate-loaded / Smith / chest-supported, 3 = cable or DB on a bench, 2 = standing free weights, 1 = bodyweight, ballistic, reactive. | [EQ-13](#eq-13) | CONFIRMED |
| 4 | Machines are not ranked. If it works and feels good in your gym, use it. Hack squat and leg press are more constrained than the Smith machine. | [EQ-11](#eq-11) | CONFIRMED |
| 5 | Belt squat is for when the back should not be loaded. | [EQ-11](#eq-11) | CONFIRMED |
| 6 | Older, injured and high-volume clients lean on machines and cables for compounds and isolation. Overhead squats and low-bar squats are never given to them. | [EQ-03](#eq-03), [R3-ATH-02](athletes-and-sports.md#r3-ath-02) | CONFIRMED |
| 7 | A foundational older or injured client may use machines filed as moderate or advanced. Safety beats the level label. | [EQ-04](#eq-04) | CONFIRMED |
| 8 | Ideal home kit: adjustable dumbbells, a bench, a pull-up bar and an 8-10 lb medball. People have different things. | [EQ-02](#eq-02) | CONFIRMED |
| 9 | When the exercise name gives no implement: bodyweight, then dumbbell, then barbell as the level rises, limited by what the person has. | [EQ-09](#eq-09) | CONFIRMED |
| 10 | When he writes alternatives ("Squats or Leg Press"), pick by client and by the client's own preference. | [EQ-10](#eq-10) | CONFIRMED |
| 11 | Medballs are light: 8-10 lb passes and rotations, never more than 20 lb for anything. | [EQ-06](#eq-06), conversation | CONFIRMED |
| 12 | No medball: substitute (plyo push-ups, fast cable rotations, the fake medball slam). Never band chops. | [EQ-07](#eq-07) | CONFIRMED |
| 13 | No leg extension or leg curl machine: sissy squats for quads; nordics, slider or swiss-ball curls for hamstrings. | [EQ-08](#eq-08) | CONFIRMED |
| 14 | Aerobic work can run on any machine. Use calories, time or distance; doing the block is what matters. | [EQ-14](#eq-14) | CONFIRMED |
| 15 | Loaded jumps: 10 to 20 % of bodyweight. Box and hurdle heights as listed in EQ-16. | [EQ-15](#eq-15), [EQ-16](#eq-16) | CONFIRMED |
| 16 | The kit list of each access profile and the full substitution order. | [EQ-01](#eq-01), [EQ-08](#eq-08) | PROPOSED |

## Why, in his words

- "I'd rather they collect that volume in a safe place with more constraints" ([EQ-03](#eq-03))
- "In my model, bands are not something that you're going to make changes to your body with." ([EQ-02](#eq-02))
- "I want them to feel the right muscles. I want them to get the right stimulus." ([EQ-11](#eq-11))
- "The heavier I go, the slower I'm going to be. The lighter I go, ideally, the faster I can be." (conversation, `coach_chat_statements.md`)

## Where it lives in the data

Keys are in [`generator_spec_v1.json`](../../generator_spec_v1.json), the machine-readable twin of the model, unless another file is named.

| What | File | JSON key |
|---|---|---|
| Constraint scale | `generator_spec_v1.json` | `rule_tables.equipment.constraint_scale` |
| No bands, no variable resistance | `generator_spec_v1.json` | `rule_tables.equipment.no_variable_resistance` |
| The check that no plan contains bands | `generator_spec_v1.json` | `validation_checks.V9_bands` |
| Rules for older, injured and high-volume clients | `generator_spec_v1.json` | `rule_tables.equipment.older_injured_high_volume` |
| Machines are not ranked | `generator_spec_v1.json` | `rule_tables.equipment.machines_not_ranked` |
| Default implement | `generator_spec_v1.json` | `rule_tables.equipment.default_implement` |
| Swaps when a machine is missing | `generator_spec_v1.json` | `rule_tables.equipment.machine_isolation_swaps` |
| Medball weights and substitutes | `generator_spec_v1.json` | `rule_tables.athletic.medball.loads_lb` |
| Equipment options on the intake form | `generator_spec_v1.json` | `inputs_schema.fields.F27` |
| The full equipment model | `synthesis/10_equipment_model.json` | `client_rules` |

## Questions on this page

| ID | Round | His verdict | Final rule in one line | Status |
|---|---|---|---|---|
| [EQ-01](#eq-01) | 1 | RIGHT | Intake equipment options approved, minus bands: he never programs bands. | Stands |
| [EQ-12](#eq-12) | 1 | NOT RIGHT | No variable resistance (bands, chains, weight releasers) for now. | Stands |
| [EQ-02](#eq-02) | 1 | answered in words (no chip) | Ideal home kit: adjustable DBs + bench + pull-up bar + 8-10 lb medball; never bands. | Stands, refined |
| [EQ-13](#eq-13) | 1 | RIGHT | The 1-5 constraint scale is approved (5 = seated machine with back pad ... 1 = bodyweight, ballistic, reactive). | Stands |
| [EQ-11](#eq-11) | 1 | NOT RIGHT | Machines are not ranked; use what works and feels right. Belt squat = no load on the back. | Stands, refined |
| [EQ-03](#eq-03) | 1 | RIGHT | Older, injured, high-volume clients lean on machines and cables; overhead and low-bar squats never. For 60+, jumps and Olympic lifts are off but switchable. | Partly superseded |
| [EQ-04](#eq-04) | 1 | RIGHT | Foundational older or injured clients may use machines filed as moderate or advanced. | Stands |
| [EQ-05](#eq-05) | 1 | RIGHT | Add a seated machine shoulder press (foundational). | Stands, refined |
| [EQ-09](#eq-09) | 1 | RIGHT | No implement named: bodyweight, then DB, then barbell as level rises. | Stands |
| [EQ-10](#eq-10) | 1 | PARTLY | Alternatives: pick by client and by the client's own preference. | Stands |
| [EQ-08](#eq-08) | 1 | answered in words (no chip) | No leg extension / leg curl machine: sissy squats; nordics, slider or swiss-ball curls. No bands. | Stands |
| [EQ-07](#eq-07) | 1 | RIGHT | No medball: substitute (plyo push-ups, fast cable rotations, fake slam); never band chops. | Stands |
| [EQ-06](#eq-06) | 1 | RIGHT | Medballs: 8-10 lb passes and rotations, slams 10-20 lb; never over 20 lb. | Stands, refined |
| [EQ-15](#eq-15) | 1 | RIGHT | Loaded jumps: 10-20 % of bodyweight; too heavy when height or speed drops. | Stands |
| [EQ-16](#eq-16) | 1 | RIGHT | Depth drops low 6-12 in, medium 12-18 in, high above hip; hurdles 6 in moderate, 12+ in advanced. | Stands |
| [EQ-14](#eq-14) | 1 | RIGHT | Aerobic work on any tool; calories, time or distance; doing the block is what matters. | Stands |

## What he said in conversation

These are statements he made while the model was being built. They are closely paraphrased in the source files, with his exact words in quotation marks. A questionnaire answer wins where the two differ.

| Statement | Source | How the questionnaires treated it |
|---|---|---|
| Machines have many reference points and constraints (you sit, feet on the ground, move hands or feet). You can push a lot and it's safer. More machines for people who want more volume, people with injuries, and older people. | `coach_chat_statements.md` | Confirmed by [EQ-03](#eq-03) and [EQ-04](#eq-04). |
| Free weights are different: barbells are the most skilled; dumbbells, kettlebells and medicine balls sit in between. "If you read the workouts you can understand them by their equipment usage." | `coach_chat_statements.md` | The 1 to 5 constraint scale ([EQ-13](#eq-13)) turns this into numbers. |
| People will ask based on the equipment they have: "we want to be ready for that." | `coach_chat_statements.md` | Answered by [EQ-01](#eq-01) (intake options) and [EQ-07](#eq-07) to [EQ-10](#eq-10) (defaults and substitutions). |
| Speed: to go faster you don't need a lot of weight. Medball upper-body passes should be light (8–10 lb). "The heavier I go, the slower I'm going to be. The lighter I go, ideally, the faster I can be." Quality of movement matters as much as quantity. | `coach_chat_statements.md` | [EQ-06](#eq-06) added the other medball weights and the 20 lb limit. |
| Speed, range of motion (full, mid), load and volume are all variables. | `coach_chat_statements.md` | No questionnaire answer changed it. |
| Equipment: machines have many reference points/constraints (sit, feet down, move hands or feet) -> you can push a lot and it's safer -> better for people going up in volume, injured, older. Free weights differ; barbells are more skilled; DB, KB, medballs in between. Clients will state what equipment they have; be ready with references/substitutions. | `coach_answers.md` (earliest notes) | No questionnaire answer changed it. |
| Load-velocity: to go faster you don't need much weight; medball upper-body passes/rotations should be light (8-10 lb) so force is produced with speed. Heavier = slower, lighter = faster. Quality of movement matters as much as quantity. Speed, ROM (full/mid), load and volume (sets x reps over time) are all variables. | `coach_answers.md` (earliest notes) | No questionnaire answer changed it. |

## Every question and his final answer

Each entry gives the question, the final rule as it stands today, what we assumed or proposed, his verdict, a short quote, what is not confirmed, where the rule lives, and every later change. His full dictated answer is folded under each entry.

### Equipment options and no bands

#### EQ-01

**Question (round 1).** Are these the right equipment options for the intake form?

**Final rule.** The equipment options for the intake form are right, with one exception: no bands. He does not program anything with bands. Variable resistance may come later, but he does not want it in the model now because it is so complicated. The options: full commercial gym; basic gym (no specialty machines); home gym (rack + barbell + dumbbells); home dumbbells + bench; kettlebells only; bodyweight only; hotel gym; field / track / outdoor kit (medballs, cones, hurdles, boxes). The "bands only" option is gone, and bands are taken out of the home option.

- **Status:** Stands as answered.
- **We assumed (round 1):** Full commercial gym · basic gym (no specialty machines) · home gym (rack + barbell + DBs) · home DBs + bench + bands · kettlebells only · bands only · bodyweight only · hotel gym · field/track/outdoor kit (medballs, cones, hurdles, boxes).
- **His verdict (round 1):** RIGHT, with words
- **In his words:** "The only exception is I don't do bands. I don't program anything with bands." (EQ-01)
- **Where it lives:** `generator_spec_v1.json` → `inputs_schema.fields.F27`, `vocab.equipment_profiles`, `rule_tables.equipment.no_variable_resistance`
- **See also:** [EQ-02](#eq-02), [EQ-12](#eq-12)

<details>
<summary>His full answer, round 1 (from <code>coach_answers_full.md</code>)</summary>

> The only exception is I don't do bands. I don't program anything with bands. That is something that will eventually come up about variable resistance, but I don't really want to talk about variable resistance in any of this right now because it's so complicated.

</details>

#### EQ-12

**Question (round 1).** Bands ~50% and chains ~70%: percent of what? Include weight releasers?

**Final rule.** No variable resistance right now: no bands, no chains, no weight releasers. "We will work with that later on." The band and chain percentages in his sheets are kept only as an archive and are never used.

- **Status:** Stands as answered.
- **We assumed (round 1):** Percent of 1RM as bar weight; leave weight releasers out.
- **His verdict (round 1):** NOT RIGHT
- **In his words:** "We don't want any variable resistance right now." (EQ-12)
- **Where it lives:** `generator_spec_v1.json` → `rule_tables.equipment.no_variable_resistance`, `validation_checks.V9_bands`
- **See also:** [EQ-01](#eq-01)

<details>
<summary>His full answer, round 1 (from <code>coach_answers_full.md</code>)</summary>

> We don't want any variable resistance right now. No variable resistance should be available in this for now. We will work with that later on.

</details>

#### EQ-02

**Question (round 1).** What's the minimum home kit you design for?

**Final rule.** There is no single minimum home kit: people have different things. Adjustable dumbbells, a bench, a pull-up bar and an 8-10 lb medball would be ideal. Never bands: "In my model, bands are not something that you're going to make changes to your body with." Round 2 added a few home exercises to the library.

- **Status:** Stands. Later answers added detail (see "Changed later").
- **We assumed (round 1):** Adjustable DBs + bench + pull-up bar + bands + an 8–10 lb medball.
- **His verdict (round 1):** answered in words, no chip
- **In his words:** "In my model, bands are not something that you're going to make changes to your body with." (EQ-02)
- **Where it lives:** `generator_spec_v1.json` → `rule_tables.equipment.ideal_home_kit`
- **Changed later:**
  - **REFINED by [R2-LIB-07](library-details.md#r2-lib-07) (round 2).** Before: The ideal home kit, without bands. Now: For home clients a KB curl, a table row and floor Y/T raises are added to the library.
- **See also:** [EQ-01](#eq-01), [R2-LIB-07](library-details.md#r2-lib-07)

<details>
<summary>His full answer, round 1 (from <code>coach_answers_full.md</code>)</summary>

> I don't know. People have different things for their home kit, but that'll be ideal for the home kit. I just never use bands. I don't work with anything with bands, so I don't really like bands. In my model, bands are not something that you're going to make changes to your body with.

</details>

### Machines and constraint

#### EQ-13

**Question (round 1).** Our 1–5 constraint scale: do you agree?

**Final rule.** The 1 to 5 constraint scale is approved. 5 = seated machine with a back pad. 4 = plate-loaded, Smith or chest-supported. 3 = cable, or dumbbell on a bench. 2 = standing free weights. 1 = bodyweight, ballistic, reactive. Constraint means how much the equipment holds you in place.

- **Status:** Stands as answered.
- **We assumed (round 1):** 5 = seated machine with back pad, 4 = plate-loaded / Smith / chest-supported, 3 = cable or DB on a bench, 2 = standing free weights, 1 = bodyweight, ballistic, reactive.
- **His verdict (round 1):** RIGHT, no words (our proposal became his rule)
- **Where it lives:** `generator_spec_v1.json` → `rule_tables.equipment.constraint_scale`
- **See also:** [EQ-11](#eq-11), [CAT-04](levels-and-zones.md#cat-04)

#### EQ-11

**Question (round 1).** Your opinion on other machines: Smith machine, hip thrust machine, belt squat, GHD, reverse hyper? And hack squat: drop it or rank it last?

**Final rule.** He rejected ranking machines. If the hack squat in your gym works and feels good, that is great; the same for a Smith machine. Brands and angles differ, so machines do not always feel the same. People should know that a hack squat and a leg press are more constrained and a Smith machine is less constrained, and act on it. A belt squat is for people who should not be loaded on the back: if an athlete has already had the back loaded that week and is sore, switch to the belt squat. GHD and reverse hyper: use them if they are available and feel good. What he wants is the right muscles and the right stimulus.

- **Status:** Stands. Later answers added detail (see "Changed later").
- **We assumed (round 1):** Hack squat ranked last (you dislike it); the others are fine.
- **His verdict (round 1):** NOT RIGHT
- **In his words:** "What I'm trying to do is I don't want to rank them because they have different brands, angles, and things like that." / "I want them to feel the right muscles. I want them to get the right stimulus." (EQ-11)
- **Note:** We had assumed he disliked the hack squat and wanted it ranked last. That was wrong.
- **Where it lives:** `generator_spec_v1.json` → `rule_tables.equipment.machines_not_ranked`, `rule_tables.axial_loading.soreness_switch`
- **Changed later:**
  - **REFINED by [R2-SES-02](sessions-and-order.md#r2-ses-02) (round 2).** Before: Belt squat when the back has been loaded. Now: Belt squat and leg press do not count as loading the spine. Hack squat and pendulum are fine on the second day if not sore.
  - **REFINED by [R2-LIB-07](library-details.md#r2-lib-07) (round 2).** Before: Belt squat discussed as an option. Now: Belt squat added to the library: foundational, knee dominant.
- **See also:** [EQ-13](#eq-13), [R2-SES-02](sessions-and-order.md#r2-ses-02), [PER-04](sessions-and-order.md#per-04)

<details>
<summary>His full answer, round 1 (from <code>coach_answers_full.md</code>)</summary>

> No, my opinion on machines is that if the hack squat that you have in your gym works and you feel it is good, then that's great. If a Smith machine feels good, that's great. Some people have certain machines that are different, so they don't always feel the same.
>
> What I'm trying to do is I don't want to rank them because they have different brands, angles, and things like that. I just want them to make sure that they do. Probably more constraint would be a hack squat and a leg press. Less constraint would be a Smith machine. I just want them to understand that and act accordingly to it. Belt squats are for people that you don't need to load them axially, so it won't be a load on their back. That's important. If you have an athlete that already has been loaded on their back that week or a couple of weeks and they're sore, then you might want to switch over to the belt squat. That's the way I look at it. The GHD reverse hyper is also if they're available and if they feel good doing them. That's very subjective in that sense. I want them to feel the right muscles. I want them to get the right stimulus.

</details>

### Who gets machines

#### EQ-03

**Question (round 1).** Older / injured / high-volume clients go to machines: every resistance slot or just the compounds? Any lifts they never get?

**Final rule.** Older, injured and high-volume clients lean on machines and cables, for compounds and for isolation. He would rather they collect that volume "in a safe place with more constraints". In round 1 these clients never got overhead squats, snatches, low-bar squats or depth jumps. Round 3 changed one part for people 60 and over: depth jumps, other jumps and Olympic lifts are off by default but can be switched on with his warning. Overhead squats and low-bar squats stay out. For injured and high-volume clients the round-1 list stands.

- **Status:** PARTLY SUPERSEDED. Part of this answer was reversed later (see "Changed later").
- **We assumed (round 1):** Compounds and isolation both lean machine/cable. They never get overhead squat, snatch, low-bar squat or depth jumps.
- **His verdict (round 1):** RIGHT, with words
- **In his words:** "I'd rather they collect that volume in a safe place with more constraints" (EQ-03)
- **Not confirmed by him:** Keeping snatch variants out for people 60 and over, even when they switch Olympic lifts on, is INFERRED from this answer (round 3 did not name snatches).
- **Where it lives:** `generator_spec_v1.json` → `rule_tables.equipment.older_injured_high_volume`, `rule_tables.athletic.older`
- **Changed later:**
  - **REFINED by [R2-ATH-08](athletes-and-sports.md#r2-ath-08) (round 2).** Before: They never get overhead squat, snatch, low-bar squat or depth jumps. Now: Older adults: no Olympic lifting, plyos or depth jumps by default, but an option if they want it, with a warning.
  - **REVERSED by [R3-ATH-02](athletes-and-sports.md#r3-ath-02) (round 3).** Before (superseded): Older clients never get depth jumps. Now: From 60: depth jumps, other jumps and Olympic lifts are off and can be switched on with his warning. Overhead squats and low-bar squats stay out.
- **See also:** [EQ-04](#eq-04), [R2-ATH-08](athletes-and-sports.md#r2-ath-08), [R3-ATH-02](athletes-and-sports.md#r3-ath-02), [VOL-03](volume.md#vol-03)

<details>
<summary>His full answer, round 1 (from <code>coach_answers_full.md</code>)</summary>

> Yeah, no need to do any of that. If they're old, they're injured, or they have a lot of high volume, I'd rather they collect that volume in a safe place with more constraints

</details>

#### EQ-04

**Question (round 1).** Can a FOUNDATIONAL older or injured client get the machines you filed as MODERATE/ADVANCED (leg press, pendulum, hip thrust machine)?

**Final rule.** A foundational older or injured client can get the machines he filed as moderate or advanced (leg press, pendulum, hip thrust machine). For them safety beats the level label.

- **Status:** Stands as answered.
- **We assumed (round 1):** Yes. Safety beats the level label for them.
- **His verdict (round 1):** RIGHT, no words (our proposal became his rule)
- **Where it lives:** `generator_spec_v1.json` → `rule_tables.equipment.older_injured_high_volume.machines_from_foundational`
- **See also:** [EQ-03](#eq-03), [CAT-04](levels-and-zones.md#cat-04)

#### EQ-05

**Question (round 1).** VERTICAL PUSH has no machine or cable option. Add a seated machine shoulder press?

**Final rule.** The vertical push list had no machine or cable option. A seated machine shoulder press is added for older and injured clients. Round 2 filed it as foundational in the master library.

- **Status:** Stands. Later answers added detail (see "Changed later").
- **We assumed (round 1):** Yes, for older and injured clients.
- **His verdict (round 1):** RIGHT, no words (our proposal became his rule)
- **Where it lives:** `generator_spec_v1.json` → `rule_tables.library_decisions.additions_approved`, `inputs_schema.fields.F29`
- **Changed later:**
  - **REFINED by [R2-LIB-07](library-details.md#r2-lib-07) (round 2).** Before: Add a seated machine shoulder press. Now: Added to the master library as foundational, vertical push.
- **See also:** [R2-LIB-07](library-details.md#r2-lib-07), [EQ-03](#eq-03)

### Defaults and substitutions

#### EQ-09

**Question (round 1).** When the exercise name has no implement (lunges, deadlifts, rows, calf raises), which do you default to?

**Final rule.** When an exercise name gives no implement (lunges, deadlifts, rows, calf raises), the default follows the client: bodyweight, then dumbbell, then barbell as their level rises, limited by the equipment they have.

- **Status:** Stands as answered.
- **We assumed (round 1):** By client: bodyweight → DB → barbell as level rises, limited by what equipment they have.
- **His verdict (round 1):** RIGHT, no words (our proposal became his rule)
- **Where it lives:** `generator_spec_v1.json` → `rule_tables.equipment.default_implement`
- **See also:** [EQ-10](#eq-10), [CAT-04](levels-and-zones.md#cat-04)

#### EQ-10

**Question (round 1).** When you write alternatives ('Squats or Leg Press', 'DB or Barbell'), is the first one the default?

**Final rule.** When he writes alternatives such as "Squats or Leg Press" or "DB or Barbell", the first one is not the default. Pick by client (older or injured: machine or dumbbell; experienced: barbell) and also by the client's own preference, which "can be completely up to them".

- **Status:** Stands as answered.
- **We assumed (round 1):** No. Pick by client: older/injured → machine or DB, experienced → barbell.
- **His verdict (round 1):** PARTLY
- **In his words:** "The client might have that preference, so that can be completely up to them as well." (EQ-10)
- **Where it lives:** `generator_spec_v1.json` → `rule_tables.equipment.alternatives`, `inputs_schema.fields.F29b`
- **See also:** [EQ-09](#eq-09), [GEN-04](product-and-generator.md#gen-04)

<details>
<summary>His full answer, round 1 (from <code>coach_answers_full.md</code>)</summary>

> Yeah, you could pick my client, but also the preference of the client. The client might have that preference, so that can be completely up to them as well.

</details>

#### EQ-08

**Question (round 1).** No leg extension or leg curl machine: swap, or move those sets to another quad/hamstring slot?

**Final rule.** With no leg extension or leg curl machine, swap the exercise: sissy squats for quads; nordics, slider curls or swiss-ball curls for hamstrings. No banded leg extensions: "I don't want any bands in the program."

- **Status:** Stands as answered.
- **We assumed (round 1):** Swap: sissy squats or banded leg extensions for quads; nordics, slider or swiss-ball curls for hamstrings.
- **His verdict (round 1):** answered in words, no chip
- **In his words:** "Yes, just no bands. I don't want any bands in the program." (EQ-08)
- **Where it lives:** `generator_spec_v1.json` → `rule_tables.equipment.machine_isolation_swaps`
- **See also:** [EQ-07](#eq-07), [CAT-09](categorization.md#cat-09)

<details>
<summary>His full answer, round 1 (from <code>coach_answers_full.md</code>)</summary>

> Yes, just no bands. I don't want any bands in the program.

</details>

#### EQ-07

**Question (round 1).** No medball: skip the throwing slot or substitute?

**Final rule.** With no medball, substitute the throwing slot instead of skipping it: plyo push-ups for pressing throws, fast cable rotations, or the "fake medball slam" with no ball. No band chops: "Band chops are, to me, worthless."

- **Status:** Stands as answered.
- **We assumed (round 1):** Substitute: plyo push-ups (pressing), band chops or fast cable rotations, or the 'fake medball slam' with no ball.
- **His verdict (round 1):** RIGHT, with words
- **In his words:** "Band chops are, to me, worthless." (EQ-07)
- **Where it lives:** `generator_spec_v1.json` → `rule_tables.athletic.medball.loads_lb.no_ball`
- **See also:** [EQ-06](#eq-06), [ATH-05](athletes-and-sports.md#ath-05)

<details>
<summary>His full answer, round 1 (from <code>coach_answers_full.md</code>)</summary>

> Yes, just no bands. I don't need any bands. Band chops are, to me, worthless.

</details>

### Medballs, jumps and cardio tools

#### EQ-06

**Question (round 1).** Medball weights beyond the 8–10 lb passes and rotations?

**Final rule.** Medball weights: passes and rotations 8-10 lb; slams 10-20 lb with a slam ball; overhead throws 6-10 lb; sit-up throws 6-8 lb; lighter for youth and older clients. A heavier ball is only for something specific, like a heavy medball hang clean or wall balls in CrossFit or HYROX. Nothing needs more than 20 lb.

- **Status:** Stands. Later answers added detail (see "Changed later").
- **We assumed (round 1):** Slams 10–20 lb (slam ball), overhead throws 6–10 lb, sit-up throws 6–8 lb. Lighter for youth and older clients.
- **His verdict (round 1):** RIGHT, with words
- **In his words:** "No, I don't think there's any need for anything more than 20 lbs., to be honest." (EQ-06)
- **Where it lives:** `generator_spec_v1.json` → `rule_tables.athletic.medball.loads_lb`
- **Changed later:**
  - **REFINED by [R3-ATH-03](athletes-and-sports.md#r3-ath-03) (round 3).** Before: Wall balls for CrossFit "or are they doing high rows?" (dictation). Now: "High rows" confirmed as HYROX. Wall balls use the race ball, never over 20 lb.
- **See also:** [EQ-07](#eq-07), [ATH-05](athletes-and-sports.md#ath-05), [LIB-22](library-details.md#lib-22), [R3-ATH-03](athletes-and-sports.md#r3-ath-03)

<details>
<summary>His full answer, round 1 (from <code>coach_answers_full.md</code>)</summary>

> Yeah, the only point of having a heavier med ball is for something specific, like a heavy med ball hang clean or something like wall balls. Are they doing CrossFit, or are they doing high rows? That's about it. Nothing else is needed for that. No, I don't think there's any need for anything more than 20 lbs., to be honest.

</details>

#### EQ-15

**Question (round 1).** Loaded jumps (DB depth-drop jumps, DB squat jumps): fixed weight or % of bodyweight? When is it too heavy?

**Final rule.** Loaded jumps (DB depth-drop jumps, DB squat jumps) use 10 to 20 % of bodyweight. The load is too heavy when jump height or speed clearly drops.

- **Status:** Stands as answered.
- **We assumed (round 1):** 10–20% of bodyweight. Too heavy when jump height or speed clearly drops.
- **His verdict (round 1):** RIGHT, no words (our proposal became his rule)
- **Where it lives:** `generator_spec_v1.json` → `rule_tables.equipment.loaded_jumps`
- **See also:** [EQ-16](#eq-16), [R2-ATH-02](athletes-and-sports.md#r2-ath-02)

#### EQ-16

**Question (round 1).** Box and hurdle heights for low/medium/high depth drops and for hurdle hops?

**Final rule.** Heights. Depth drops: low about 6-12 inches, medium about 12-18 inches, high = above the hip as written. Hurdles: 6 inches for moderate, 12 inches or more for advanced.

- **Status:** Stands as answered.
- **We assumed (round 1):** Low ≈ 6–12 in, medium ≈ 12–18 in, high = above hip as written. Hurdles 6 in moderate, 12+ in advanced.
- **His verdict (round 1):** RIGHT, no words (our proposal became his rule)
- **Where it lives:** `generator_spec_v1.json` → `rule_tables.equipment.heights`
- **See also:** [EQ-15](#eq-15), [LIB-04](library-details.md#lib-04)

#### EQ-14

**Question (round 1).** Can the Blue/Green/Orange aerobic work run on a bike, rower or ski erg for non-runners? Treadmill OK for tests?

**Final rule.** The Blue, Green and Orange aerobic work can run on any tool that is available (bike, rower, ski erg, running), which gives non-runners more options. Calories or time are easier to manage on some tools, but distance is not thrown away. What matters is doing the block, and being able to see changes from week to week.

- **Status:** Stands as answered.
- **We assumed (round 1):** Yes, any erg. Use calories or time instead of distance.
- **His verdict (round 1):** RIGHT, with words
- **In his words:** "I just want you to make sure that they understand that doing the block is the important part" (EQ-14)
- **Note:** "Being able to track it" means the person tracking it for themselves. Since round 3 the tool keeps nothing ([R3-GEN-01](legal-and-open-source.md#r3-gen-01)).
- **Where it lives:** `generator_spec_v1.json` → `rule_tables.conditioning.rules`, `rule_tables.conditioning.menus`
- **See also:** [ATH-07](sessions-and-order.md#ath-07), [FIX-02](library-details.md#fix-02), [PER-07](testing.md#per-07)

<details>
<summary>His full answer, round 1 (from <code>coach_answers_full.md</code>)</summary>

> Yeah, some things are easier to manage with calories or time, but you can also manage them and track them with distance. I wouldn't completely throw away distance. Yes, the blue, green, and orange aerobic work can run on different things that are available, different tools: a runner, a skier. For non-runners, it is completely fine, and there are more options. I just want you to make sure that they understand that doing the block is the important part, and being able to track it and see any changes week to week is important.

</details>

## Related answers on other pages

| ID | Page | What it says |
|---|---|---|
| [R2-LIB-07](library-details.md#r2-lib-07) | [library-details](library-details.md) | Belt squat, seated machine shoulder press and home exercises added to the library. |
| [R2-SES-02](sessions-and-order.md#r2-ses-02) | [sessions-and-order](sessions-and-order.md) | Which lifts count as loading the spine (belt squat does not). |
| [R3-ATH-02](athletes-and-sports.md#r3-ath-02) | [athletes-and-sports](athletes-and-sports.md) | On / off defaults for people 60 and over. |
| [R3-ATH-01](athletes-and-sports.md#r3-ath-01) | [athletes-and-sports](athletes-and-sports.md) | Swimmers: shoulder care every session, never bands. |
| [R3-ATH-03](athletes-and-sports.md#r3-ath-03) | [athletes-and-sports](athletes-and-sports.md) | HYROX wall balls with the race ball, never over 20 lb. |
| [ATH-10](athletes-and-sports.md#ath-10) | [athletes-and-sports](athletes-and-sports.md) | What replaces Olympic lifts when there are no bumper plates. |
| [CAT-04](levels-and-zones.md#cat-04) | [levels-and-zones](levels-and-zones.md) | Machines and cables make a movement easier. |
| [VOL-03](volume.md#vol-03) | [volume](volume.md) | Pain: move the work to machines or split grips. |
| [R2-LIB-08](library-details.md#r2-lib-08) | [library-details](library-details.md) | NO ACCESS means a self-serve version, not "no equipment". |
| [ATH-05](athletes-and-sports.md#ath-05) | [athletes-and-sports](athletes-and-sports.md) | Who throws medballs and how much. |
