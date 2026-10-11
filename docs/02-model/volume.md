# Volume: weekly sets per muscle group

The Blaze Camp model doses resistance training in **weekly hard sets per muscle group**. With 3 or more training days, every group a plan trains directly gets at least 10 sets a week in a training block. With 2 training days every big muscle is still trained, at about 6 to 8 weekly sets, and the plan suggests a third day. Where a person starts and how high they go depends on their level, and each group reaches its planned final sets by the end of the block. On each exercise the main mover counts one full set and each helper muscle counts a quarter of a set, with a few named exceptions. Jumps, throws, Olympic lifts, sprints, kettlebell swings, carries and sled work never count as muscle sets. A person can pick up to two Focus muscles, and each one gets one to three extra sets a week. This page gives the rules, the coach's reasons and where every number lives in the data.

> **How to read this page.** A rule with an answer id was decided by coach Lalo Vera. Ids with no prefix (`VOL-09`) are round 1, `R2-` is round 2, `R3-` is round 3, `R4-` is round 4. `CT-01` and `CX-01..04` are two clarifications he gave on 2026-10-10. The newest answer wins. **PROPOSED** means the team designed it and he has not confirmed it. **OBSERVED** means it was read from his sheets. His full answers by topic: [../03-coach-answers/volume.md](../03-coach-answers/volume.md).

## The rule

| # | Rule | Decided by |
|---|---|---|
| 1 | Count **weekly hard sets** for each muscle group. A hard set is a working set of 5 to 30 reps that ends with 1 to 3 reps in reserve. | VOL-04, VOL-13 |
| 2 | **The main mover gets 1.0 set. Each helper muscle gets 0.25.** | VOL-09 |
| 3 | Exceptions: **dips** 0.5 triceps + 0.5 chest. **Thruster** 1.0 quads + 0.5 shoulders + 0.25 glutes. **Hip thrusts and bridges** 1.0 glutes. Squats, lunges, deadlifts and RDLs (Romanian deadlifts) give glutes 0.25. Leg extensions and leg curls count in full. | LIB-16, R2-VOL-05, VOL-09 |
| 4 | A single-leg or single-arm set written **10/10 is one set**, not two. | UNI-01, UNI-07 |
| 5 | **Athletic work never counts** as muscle sets. Kettlebell swings do not count. HYROX station circuits do not count (HYROX is a fitness race of runs and workout stations). Carries and sled work do not count. Warm-ups do not count. | VOL-10, R2-VOL-05, R3-ATH-03, R4-LIB-02, ORD-08 |
| 6 | Count on the coach's **FOCUS groups**. Hips = glutes + hamstrings. Shoulders = front + side + rear delts. Rear delts are not a muscle of their own. | R3-SES-01, R3-VOL-01 |
| 7 | **Floor: 10 sets a week** for every group a training block trains directly, when there are 3 or more training days. A training block is a plan that climbs week by week, as opposed to a maintenance phase. | R2-VOL-06, R3-VOL-01 |
| 7b | **2 training days a week:** every big muscle is still trained, at about 6 to 8 weekly sets instead of 10. The plan says so and suggests a third day. No whole muscle is dropped and no extra exercises are piled on. | R4-SES-03 |
| 8 | **Starts by level:** big muscles 10 / 15 / 20. Shoulders, biceps and triceps 10 / 12 / 15. | VOL-01, R2-VOL-04, R2-VOL-06 |
| 9 | **Top numbers (ceilings) by level:** 14 / 22 / 25 sets a week. Each trained group reaches its top number in the last week of the block. All customizable. | R2-VOL-06, CX-01, R4-PRG-01 |
| 10 | **Calves:** one exercise × 3 sets on every leg day. **Core:** 2 exercises × 2 sets at the start of every session. | VOL-17, R3-SES-01, R2-SES-03 |
| 11 | **Focus muscle 1 and Focus muscle 2** (optional): each gets 1 to 3 extra weekly sets on top of a balanced plan. | R3-SES-01 |
| 12 | **Pain:** cut that muscle or pattern 30 to 50 %, move it to machines or split grips, or drop the exercise. | VOL-03 |
| 13 | The tool does the math. It keeps no data and learns nothing from users. | VOL-06, R3-GEN-01 |

How these weekly sets grow from week to week is on its own page: [stairway.md](stairway.md).

## Why

**Why weekly sets.** This is how he already coaches. He counts the sets a muscle got this week and adds a little next week (chat statements, VOL-04). His ranges come from experience, and he asked the team to check them against research:

> "I like that 15 to 20 sets of any muscle group per week would be a good foundation for maintenance to a little bit of growth, and then 20 to 25 sets maybe can be a good growth foundation." (UNI-01)

> "I think doing 40 sets of chest per week might be way too much, but I think 5 might be too little." (UNI-01)

**Why helpers count a quarter.** The team proposed half a set for helpers. He corrected it:

> "I would suggest a 0.25 to the helpers, not a 0.5." (VOL-09)

**Why athletic work does not count.**

> "I don't believe that Olympic lifts, sprints, throws, and plyos are going to count towards specific muscles because there are so many things happening at so many different levels. I think counting towards muscles is more for resistance patterns, not for athletic patterns." (VOL-10)

**Why a floor of 10.**

> "I don't think anybody needs less than 10 sets a week per muscle" (R2-VOL-06)

> "8 sets a week is probably just barely maintenance. Essentially, the little muscles also grow the same idea." (R2-VOL-04)

**Why shoulders are one group.**

> "I wouldn't categorize the rear delt as an individual muscle, so it should always be adaptable." (R3-VOL-01)

> "If you put together all the sets of shoulders, it'll equate to more than 10 sets" (R3-VOL-01)

**Why Focus muscles.**

> "they should be able to choose one of the main muscles that they want to work on the most. The program will then automatically choose extra sets for that one compared to the other one." (R3-SES-01)

**Why the numbers are not fixed forever.**

> "Yeah, but this is all customizable." (R2-VOL-06)

## Where it lives in the data

The readable source is [`generator_spec_v1.json`](../../generator_spec_v1.json). The fuller volume file is [`synthesis/12_volume_algorithm_v1.json`](../../synthesis/12_volume_algorithm_v1.json), explained in [`synthesis/12_volume_algorithm_v1.md`](../../synthesis/12_volume_algorithm_v1.md). `model/rules.json` is the compiled copy the engine reads. It is rebuilt by tools, so check the spec first when the two differ.

| What | File | JSON key |
|---|---|---|
| What a hard set is | `generator_spec_v1.json` | `rule_tables.counting.hard_set` |
| Credit per exercise type (1.0 / 0.5 / 0.25) | `generator_spec_v1.json` | `rule_tables.counting.credit_map` |
| 10/10 = one set | `generator_spec_v1.json` | `rule_tables.counting.unilateral` |
| Credit of one exercise | `synthesis/02_exercise_catalog.json` | `volume_credit.per_set` on each exercise record |
| Credit of one exercise (compiled) | `model/catalog.json` | `exercises[].credits`, `exercises[].credit_class` |
| Big and small muscles, FOCUS groups | `generator_spec_v1.json` | `vocab.muscles.big`, `vocab.muscles.small`, `vocab.muscles.focus_groups` |
| Group credit (PROPOSED) | `synthesis/12_volume_algorithm_v1.json` | `counting.group_credit` |
| Starts and ceilings by level | `generator_spec_v1.json` | `rule_tables.weekly_sets.muscles.<line>.start` and `rule_tables.weekly_sets.muscles.<line>.cap` (`<line>` is `quads`, `chest`, `shoulders` ...) |
| The floor of 10 and what is exempt | `generator_spec_v1.json`; `model/rules.json` | `rule_tables.weekly_sets.floors`; `volume.floor` (`applies_from_days: 3`) |
| The 2-day rule (R4-SES-03) | `model/rules.json` | `volume.two_day` (`weekly_sets: [6, 8]`, `suggest_days: 3`) |
| Carries and sled work: no muscle sets (R4-LIB-02) | `model/rules.json` | `conditioning.carry` (`counts_as_muscle_sets: false`) |
| His landmarks (15-20, 20-25, 5, 40) | `generator_spec_v1.json` | `rule_tables.weekly_sets.landmarks_coach` |
| Focus muscles | `generator_spec_v1.json` | `rule_tables.priority.v1_2_focus_muscles`; intake field `inputs_schema.fields.F09` |
| Goal and phase factors | `generator_spec_v1.json` | `rule_tables.goal_phase_modifiers` |
| Pain rules | `generator_spec_v1.json` | `rule_tables.pain` |
| His numbers next to the research | `synthesis/12_volume_algorithm_v1.json` | `research_vs_coach`, `research_20_30_sets`, `science` |
| Compiled copy | `model/rules.json` | `credit`, `muscles.groups`, `volume.start`, `volume.cap`, `volume.floor`, `volume.two_day`, `volume.focus` |

Every tunable number is also listed in [../05-reference/parameters.md](../05-reference/parameters.md).

---

## In detail

### 1. What counts as a set

**Rule.** The unit is the *hard set*: a working set of 5 to 30 reps that stops with 1 to 3 *reps in reserve* (RIR). Reps in reserve means how many more clean reps you could have done. Warm-up sets never count.

| Case | How it counts | Decided by |
|---|---|---|
| A working set at 1-3 RIR | 1 set | VOL-13 |
| A set written 10/10 (10 reps on each side) | 1 set | UNI-01 |
| An alternating exercise (alternating dumbbell press, alternating lunges) | counts like a unilateral one: 1 set | UNI-07 |
| Warm-up sets and A-drills (his running warm-up drills: A march, A skip, A run) | 0 | ORD-08 |
| A MYO set (written '15/5/5/5/5/5' in his sheet: one long set, then short mini-sets after a few seconds of rest; OBSERVED) | 2 sets | **PROPOSED**; he confirmed where it may be used: only on the last exercise, machine or isolation (VOL-15) |
| The light core sets that open a session | count toward abs | **PROPOSED** |

**Why.** A unilateral exercise works one side at a time. He writes it per side and counts it once:

> "So when I say 10/10, it means 10 on each leg." (UNI-01)

### 2. Credit: which muscle gets the set

**Rule.** The *main mover* (the muscle the exercise is for) gets 1.0 set. A *helper* (a muscle that assists) gets 0.25. The engine adds these up for the week.

Example: 3 sets of bench press give chest 3.0 sets, triceps 0.75 and front delts 0.75.

| Exercise type | 1.0 set to | 0.5 set to | 0.25 set to | Decided by |
|---|---|---|---|---|
| Squat, leg press, hack squat, belt squat | quads | | glutes | VOL-09; glutes R2-VOL-05 |
| Split squat, lunge, step-up | quads | | glutes | UNI-01; glutes R2-VOL-05 |
| Deadlift, RDL, single-leg RDL, back extension | hamstrings | | glutes | R2-VOL-05 |
| Hip thrust, bridge (the model also files cable pull-throughs and reverse hypers here: **PROPOSED**) | glutes | | hamstrings | R2-VOL-05 (hip thrusts and bridges); helper value VOL-09 |
| Leg curl, Nordic, slider or ball curl | hamstrings | | | CAT-09, VOL-09 |
| Leg extension | quads | | | VOL-09 |
| Horizontal push (bench press, push-up) | chest | | triceps, front delts | VOL-09 |
| Vertical push (overhead press) | front delts | | side delts, triceps | VOL-09 |
| **Dips** | | triceps, chest | | LIB-16 |
| **Thruster** | quads | shoulders | glutes | LIB-14, R2-VOL-05 |
| Horizontal pull (rows) | lats / upper back | | biceps, rear delts | VOL-09 |
| Vertical pull (pulldown, pull-up) | lats / upper back | | biceps | VOL-09 |
| Lat pull-over | lats / upper back | | | LIB-09 |
| Face pull (cable or kettlebell) | rear delts | | side delts | R2-LIB-04, LIB-10; the 1.0 / 0.25 split is **PROPOSED** |
| Isolation (fly, side raise, upright row, rear-delt fly, curl, triceps work, calf raise) | the target muscle | | | VOL-09, LIB-16 |
| Core exercises | abs / obliques | | | CAT-08 |

What is his in this table: the values (1.0 for the main mover, 0.25 for a helper, VOL-09) and the rows that cite an answer about that exact exercise (dips, the thruster, the quarter set for glutes, leg curls and leg extensions in full, the lat pull-over, face pulls as shoulder work). The only worked example he was shown and approved was the bench press: chest as the main mover, triceps and front delts as helpers (VOL-09). Which muscles are listed as helpers in the other rows is the team's tagging (**PROPOSED**).

Adductors also get 0.25 from squats and lunges, and forearms 0.25 from curls. Both are **PROPOSED**: he never said how those two muscles earn credit.

**The exceptions, in his words.**

- Dips: "dips i would say more tricep than chest but still .5 and .5 done in push day or push exercise" (LIB-16).
- Thruster: 1 set for squats (quads), half a set for shoulders, a quarter set for glutes. "Yeah, that's good math." (R2-VOL-05)
- Glutes: a quarter set from squats, lunges, deadlifts and RDLs; a full set from hip thrusts and bridges (R2-VOL-05). On single-leg lunges he counts "mostly for quads" (UNI-01).

**What the glute rule means in practice.** Every compound lift gives glutes only a quarter set. So a physique plan reaches its glute target only with direct glute work: the hip-thrust family, or a Focus muscle (section 7).

**Group credit (PROPOSED).** When sets are counted on a group, one set counts at most once for that group. A face pull is one shoulder set, not 1.25. A leg curl is one hip set. A squat is a quarter of a hip set. The plan still shows front, side and rear delts, and glutes and hamstrings, as separate numbers for display.

### 3. What does not count

| Work | Counts as muscle sets? | How it is counted instead | Decided by |
|---|---|---|---|
| Jumps, both plyometric (short, bouncy ground contacts) and ballistic (one big effort); medball throws; Olympic lifts; sprints; change of direction | No | contacts, throws, reps, metres | VOL-10 |
| Kettlebell swings | No. They are ballistic, never glute volume. | reps in the power block | R2-VOL-05 |
| HYROX station circuits | No. They are finishers. | time, distance, reps or calories (units **PROPOSED**) | R3-ATH-03 |
| Carries and sled work (farmer carry, sled push) | No. They sit with core and conditioning. | 2 to 4 trips of 20 to 40 metres, or 20 to 40 seconds | R4-LIB-02 |
| Warm-up and A-drills | No | not counted | ORD-08 |
| Push press and push jerk | Only when they fill the vertical-push slot. In the power block they are power reps. | | VOL-10, LIB-13; the slot rule is **PROPOSED** |

**Why swings do not count.**

> "kettlebell swings are not glutes. They are hip-dominant, but at the speed they are swinging like that, it doesn't really become a resistance movement-building muscle work." (R2-VOL-05)

Athletic work has its own budget. See [athletes.md](athletes.md).

### 4. The groups

**Rule.** The floor and the count of exercises per group both read the coach's FOCUS groups. These are the muscle headers of his own program sheets ('QUADS', 'HAMSTRINGS', 'GLUTES', 'CHEST', 'BACK', 'SHOULDERS/TRAPS', 'BICEP', 'TRICEP', 'CALVES', 'CORE'; OBSERVED), with two groupings he approved in round 3.

| Group | Muscles inside it | Size class | Note |
|---|---|---|---|
| Quads | quads | big | |
| **Hips** | glutes + hamstrings | big | RDL + hip thrust + leg curl = 3 hip exercises (R3-SES-01) |
| Chest | chest | big | |
| Back | lats / upper back | big | |
| **Shoulders** | front + side + rear delts | small | traps are shown with shoulders for display only (**PROPOSED**) |
| Biceps | biceps | small | |
| Triceps | triceps | small | |
| Calves | calves | small | one exercise × 3 sets per leg day |
| Core | abs / obliques | small | the 2-exercise opener |

Big and small come from CAT-02. Glutes and hamstrings each keep their own line (start and ceiling). The floor of 10 and the exercise count are read on the two together.

**Rear delts.** They sit inside shoulders. Rows also give them a quarter set ("I think the rear delts also get worked when you do back", R3-VOL-01). Two things follow:

- Every plan keeps at least one rear-delt exercise each week. In round 1 he said "Rear delts and calves need to get their own sets and reps, yes." (VOL-17). Turning that into one rear-delt exercise a week inside the shoulders group (a reverse fly or kettlebell face pull, 2 sets or more) is the team's rule: **PROPOSED**.
- People and coaches can always add more: "People and coaches should always be able to add more rear delts" (R3-VOL-01).

**No line of their own.** Traps, forearms, adductors and neck have no start and no ceiling. They collect helper credit and are reported, never filled on purpose. This treatment is **PROPOSED**. In CAT-02 he confirmed forearms as a small muscle. The same question said the team was unsure where traps, front delts, adductors and neck go, and he did not place them. Front delts now sit inside shoulders (R3-SES-01).

### 5. Starts and ceilings by level

**Rule.** The *client level* sets how many weekly sets a person starts with and the most they reach in one plan. Client level is about training history. It is separate from how hard an exercise is (CAT-06; see [levels-and-zones.md](levels-and-zones.md)).

| Level | Who | Decided by |
|---|---|---|
| L1 (novice, "newby") | less than about a year of consistent training, or back after 6 to 12 months or more off | PRG-05 |
| L2 (intermediate) | consistently in the gym for over a year | PRG-05 |
| L3 (advanced) | 3+ years consistent and training 4+ days a week now, or a competitive physique or strength athlete | **PROPOSED** |

The table below is for a muscle-building (aesthetics) goal. Other goals scale it (section 8).

| Line | Start L1 | Start L2 | Start L3 | Ceiling L1 / L2 / L3 | Decided by |
|---|---|---|---|---|---|
| Quads, hamstrings, glutes, chest, back (big) | 10 | 15 | 20 | 14 / 22 / 25 | starts VOL-01, R2-VOL-04; ceilings R2-VOL-06 |
| Shoulders (front + side + rear delts) | 10 | 12 | 15 | 14 / 22 / 25 | He approved 8 / 12 / 15 for the small muscles, side delts included (R2-VOL-04). L1 is lifted to 10 by the floor. Using those numbers for the whole shoulders group after R3-VOL-01 is a **PROPOSED** reading. |
| Biceps, triceps | 10 | 12 | 15 | 14 / 22 / 25 | R2-VOL-04; L1 lifted from 8 to 10 by the floor (R2-VOL-06) |
| Calves | one exercise × 3 sets every leg day | same | 3-4 sets per leg day | 14 / 22 / 25 | 3 sets per leg day: VOL-17, R3-SES-01. The fourth set at L3 is **PROPOSED**. |
| Core | 2 exercises × 2 sets, first in every session, short of failure | same | same | 16 / 20 / 20 (**PROPOSED**) | VOL-17, ATH-11, R2-SES-03 |

Notes on status:

- The round-1 ranges he approved were 10-12, 15-20 and 20+ (VOL-01: "Sounds about right."). The generator starts at the low end. Big muscles at 10 / 15 / 20 were part of the proposal he approved in R2-VOL-04. The data files still tag the L3 start of 20 as **PROPOSED**, because the approved range for advanced was open-ended (20+).
- He approved ceilings of 14 / 22 / 25 for muscles that are not a priority (R2-VOL-06). Using the same ceilings for the small muscles is **PROPOSED**, read from "the little muscles also grow the same idea" (R2-VOL-04).
- Above 30 sets is rare: "More than 30 sets per week of a muscle group should probably be for a very advanced person." (R2-VOL-06). An optional **Pro setting** (L3 only, one muscle, up to 35 sets, set by a coach) is **PROPOSED**.

His own landmarks, for reference (UNI-01):

| Weekly sets | What he calls it |
|---|---|
| about 5 | "might be too little" |
| 15-20 | "maintenance to a little bit of growth" |
| 20-25 | "a good growth foundation" |
| about 40 | "might be way too much" |

### 6. The floor of 10

**Rule.** In a training block with 3 or more training days, every group the plan trains directly holds 10 or more sets a week. The groups are quads, hips, chest, back, shoulders, biceps, triceps and calves.

**Why.** "I don't think anybody needs less than 10 sets a week per muscle" (R2-VOL-06). For shoulders the 10 is counted on the whole group (R3-VOL-01).

**Where the floor does not apply.**

| Case | Why | Status |
|---|---|---|
| Maintenance phases | maintenance is 50-70 % of the volume by his own definition (PER-01) | **PROPOSED** reading. It was in the proposal he answered PARTLY in R3-VOL-01, and his words changed only the rear-delt part. |
| Athlete pre-season and in-season | they run at maintenance volume (R2-PER-06, PER-08) | **PROPOSED** reading, same source |
| A muscle cut back for pain | the pain cut wins (VOL-03) | **PROPOSED** reading, same source |
| A plan with 2 training days a week | every big muscle runs about 6 to 8 weekly sets instead (section 6a) | Coach: R4-SES-03 |
| A group its template cannot hold at 10 | rare; the plan adds a bonus exercise on the optional day, or says in words that the template holds fewer sets. Nothing is shrunk elsewhere to make room. | R4-SES-04; mechanics **PROPOSED** |
| Arms and glutes of field athletes, which get helper credit only | "field athletes don't need to get bigger and stronger that much" (UNI-02) | **PROPOSED** |

**Retired exemption.** Until 2026-10-10 a group could be left to helper credit "because time is short" (R3-SES-02). There is no time check any more (CT-01), so no group is left out for minutes.

### 6a. Two training days a week

**Rule.** With his exercise counts, two sessions cannot give every muscle 10 or more sets. So on 2 days every big muscle is still trained, with about 6 to 8 weekly sets. The plan says so and suggests a third day. It never drops whole muscles and never piles on more exercises (R4-SES-03, the proposal he marked RIGHT).

> "People can add or remove or adjust accordingly. That's fine. We can maybe give them a small recommendation, but it's only a recommendation." (R4-SES-03)

| Detail | Value | Status |
|---|---|---|
| Weekly sets for a big group on 2 days | starts at 6, ends at 8 (plus any Focus add) | Coach: R4-SES-03 gave "about 6-8". Using 6 as the start and 8 as the top is the team's reading. |
| Small groups on 2 days | at most the same 6 to 8 | **PROPOSED**: he spoke of big muscles |
| The week | one A day and one B day cover every big group ([sessions.md](sessions.md) §6) | R4-SES-05 |
| The printed line | "With 2 training days a week every big muscle group is trained with about 6-8 weekly sets instead of 10 or more. A third training day would let every group reach 10." | wording **PROPOSED** |
| His earlier answer | "train fewer muscles directly" (R3-SES-02) | replaced by R4-SES-03 |

He left room for "something better" if "the science backs it up". Any research note on 2-day volume is SCIENCE and goes to him "for discussion".

**Calves.** His minimum is 3 sets on every leg day. With fewer than four leg days that is under 10 a week. Reaching 10 through a fourth set or the optional-day 'Calves' slot is **PROPOSED**. A second calf exercise on a leg day is never added (R3-SES-01).

### 7. Focus muscle 1 and Focus muscle 2

**Rule.** At intake a person may pick one or two Focus muscles. The plan stays balanced, and each Focus muscle gets a little more.

| Parameter | Value | Status |
|---|---|---|
| How many | 0, 1 or 2 | Coach: R3-SES-01 |
| Extra weekly sets for each | +1 to +3 | Coach: "an extra set or two or three" (R3-SES-01) |
| Default extra | +2 | **PROPOSED** |
| Where the extra goes | on the start and on the ceiling, so the muscle stays that many sets above the balanced line all block | **PROPOSED** |
| Highest ceiling for a Focus muscle | 18 / 26-28 / 30 by level. The model uses 26 at L2, and 26-28 for chest. | He approved 18 / 26-28 / 30 for a "priority muscle" (R2-VOL-06). Using them as the limit for Focus muscles, and the 26 against 26-28 split, are **PROPOSED**. |
| Choices | glutes, quads, hamstrings, back, chest, shoulders, biceps, triceps, calves | He said "one of the main muscles" and gave glutes as his example (R3-SES-01). The list itself is **PROPOSED**. "Shoulders" is one choice. Rear delts are not offered alone, because he does not treat them as an individual muscle (R3-VOL-01); that reading is **PROPOSED**. |
| Extra form choices | Core, and a V-taper shortcut (back + shoulders, uses both slots) | **PROPOSED** |
| Order in the session | the Focus muscle's exercise goes first on its day | Coach: ORD-04, where he approved putting a small muscle first only "when that muscle is a priority" |
| The other muscles | not slowed down | **PROPOSED** |
| Sex | never asked, never used | Coach: GEN-02, ATH-09 |

**Why.**

> "As much as everything else is balanced, the glutes should have an extra set or two or three." (R3-SES-01)

> "There could be a main focus muscle 1 and a main focus muscle 2, and that should be enough for the whole thing." (R3-SES-01)

His example was a woman who picks glutes. That is an example of a choice. The model has no sex field and no rule based on sex: "I don't go by sex on these things, but mainly by age, foundation, goal, and injuries." (ATH-09)

**Example.** An L2 lifter's glutes normally go from 15 to 22 sets over 12 weeks. With glutes as a Focus muscle (+2) they go from 17 to 24.

**Two things with similar names.**

- *Focus muscle 1 / 2* is the intake choice described here (round 3).
- *Focus 1 / Focus 2* are two slots on his optional training day. Both may hit the same muscle, 2-3 sets each (ORD-10, ORD-11). The plan uses those slots to deliver the Focus-muscle extras.

**The older "priority" push.** In round 1 the team proposed +4 to +6 sets for a priority muscle, capped around 25-30. He marked it PARTLY: "That's the idea ... I think it's a good range." (VOL-02). In round 2 he approved priority ceilings of 18 / 26-28 / 30, with the other muscles growing at most 3 % a week while it runs (R2-VOL-06). After round 3 the intake path is Focus muscles. The bigger push stays only as an optional coach setting, off by default (**PROPOSED** as a setting).

### 8. Goal and phase change the starts

**Rule.** The table in section 5 is for a muscle-building goal. Other goals and season phases multiply the starts. Then the floor of 10 is applied where it applies.

Almost every factor below is **PROPOSED**. What he decided is in the last column.

| Situation | Lower body | Upper body | Small muscles | What the coach decided |
|---|---|---|---|---|
| Aesthetics / bodybuilding | × 1.0 | × 1.0 | × 1.0 | the starting ranges (VOL-01) |
| Strength / powerlifting | × 1.0 | × 1.0 | × 0.75, then the floor | preference moves reps on the big lifts, not weekly sets (VOL-12) |
| General fitness, non-competitive athletic, "stay athletic and active" | × 0.8 | × 0.8 | × 0.8, then the floor | a lighter plan for everyday people (the factor is **PROPOSED**; his "45 minutes to 1 hour" in UNI-09 is background only) |
| Fat loss | × 0.8 | × 0.8 | × 0.8, then the floor | 3 aerobic sessions, adjustable (ATH-07, R2-SES-06) |
| Field or court athlete, off-season | × 0.7 | × 0.5, then the floor on chest and back | arms and glutes from helper credit only | field athletes need less size work (UNI-02) |
| Strength-type athlete, off-season (linemen, wrestlers, rugby, throwers, heavyweight fighters) | × 0.9 | × 0.8 | × 0.6, then the floor | these athletes need more resistance training (ATH-03) |
| Athlete pre-season | about 60 % of off-season sets | | | the 60 % is approved (R2-PER-06); keeping it flat is **PROPOSED** |
| Athlete in-season | × 0.4-0.5 | × 0.3-0.4 | credit only | 2 days a week, low volume (PER-08) |
| Boxer or striker in high-punching weeks | as the profile | pressing × 0.5-0.7 | arms × 0.5-0.7 | reduce, never cut (ATH-04) |
| Bootcamp | timed circuits, not counted in sets | | | 3-5 rounds, 30-50 seconds a station (PRG-03) |

On boxers he was clear that the cut is partial: "We just need to bring the volume down, down, down when it's like that, but not completely cut it out." (ATH-04)

Sport by sport: [sports.md](sports.md). Older adults, youth and pain: [special-populations.md](special-populations.md).

### 9. Pain and injury

**Rule.** Pain named at intake shapes the plan. The affected muscle or pattern starts at 50 to 70 % of its normal sets (his cut of 30 to 50 %). Its exercises move to constrained machines or split grips (dumbbells, kettlebells, single handles). Painful positions are left out. The floor of 10 does not apply to it (a **PROPOSED** reading, see section 6).

**Why.** He approved the team's wording, "Cut that muscle or pattern 30–50%, move it to machines or split grips, and keep it moving.", and added:

> "That's correct, and maybe even drop the exercise altogether if it's too much." (VOL-03)

During the plan nothing is logged, so the plan cannot react. It prints a short guide instead: swap the exercise, then cut its sets, then drop it. The wording of that guide is **PROPOSED**. See [stairway.md](stairway.md#7-why-there-are-no-check-ins).

When a bilateral lift is swapped for a unilateral one because of pain, the sets stay "Ideally, but you have to adjust accordingly" (UNI-08).

### 10. Balance

**Rule.** The generator balances every muscle to its weekly target. Some of his old sheets gave chest 6-8 sets and side delts 15-16. He said that was not intended (VOL-18).

A V-taper look (more shoulders and back) is allowed when the person wants it: "we need to balance this out, but it can work into that V-taper bias" (VOL-18). Doing it through Focus muscles (shoulders + back) is **PROPOSED**.

### 11. His numbers next to the research

He asked for this check: "You should probably go and find some charts out there that can show those averages and also match them with what my experience is." (VOL-01). This table is **SCIENCE**, not a coach decision. Research never overrules his answers. Full references: `synthesis/12_volume_algorithm_v1.json > science` and [../01-philosophy/lineage.md](../01-philosophy/lineage.md).

| His number | What the research file found | Verdict in the research file |
|---|---|---|
| Beginner 10-12 sets | 10+ weekly sets beat 5-9 for growth (Schoenfeld, Ogborn, Krieger 2017) | matches |
| Intermediate 15-20 | a 12-20 set standard (Baz-Valle 2022); 18 best of 12 / 18 / 24 (Aube 2022) | matches as a productive baseline |
| Growth 20-25 | still grows, with smaller returns per added set (Pelland and colleagues 2026) | matches for trained people, for limited periods |
| Floor 10 | fits growth blocks; true maintenance needs far less (Spiering 2021, Bickel 2011) | matches for growth; this is why maintenance is exempt |
| "I think most people train around that: 20 to 30 sets per muscle per week." (R2-VOL-06) | surveys of bodybuilders report about 8-17 direct sets per muscle a week (Baz-Valle 2026) | fits what trained people work up to when indirect work is counted; high as a description of most people. No number changed. |

One counting note. The Pelland analysis counts indirect sets at 0.5. The coach counts helpers at 0.25. For chest, quads, hamstrings and back the two counts are close. For glutes, arms and delts his count is lower for the same program.

---

## Retired: do not rebuild

| Retired idea | Replaced by | Retired by |
|---|---|---|
| Helper muscles count 0.5 | 0.25 | VOL-09 |
| Glutes get 0.5 or 1.0 from hinges and lunges | 0.25 | R2-VOL-05 |
| Kettlebell swings count as glute sets | they count as nothing | R2-VOL-05 |
| Rear delts as their own muscle with 4 / 6 / 8 sets and their own floor | part of the shoulders group | R3-VOL-01 |
| Side delts as a separate line | part of the shoulders group | R3-VOL-01 |
| Small muscles starting at 8 sets, with lower ceilings | 10 / 12 / 15 with the same ceilings as big muscles (the shared ceilings are still **PROPOSED**) | R2-VOL-04, R2-VOL-06 |
| An early draft's lower-body fatigue budget that charged each athletic set as half a set | athletic work never counts toward muscle sets | VOL-10 |
| A second calf exercise on a leg day | one exercise × 3 sets | R3-SES-01 |
| Priority muscles (+4 / +6) as the intake field | Focus muscle 1 and 2 (+1 to +3) | R3-SES-01 |
| The tool learns from users' data | no data kept | R3-GEN-01 (supersedes VOL-01, VOL-02) |
| Any rule based on sex | none | GEN-02, ATH-09 |

More on what he turned down: [../01-philosophy/what-he-rejected.md](../01-philosophy/what-he-rejected.md).

## Still PROPOSED

Waiting for his yes or no:

- Group credit (a set counts at most once to a group).
- Which muscles count as helpers on each exercise type, beyond the cases he named.
- The shoulders group starting at 10 / 12 / 15, the numbers he approved for small muscles.
- How much direct side-delt work the single shoulders line gives. The model estimates about 3-4 direct side-delt sets a week for an L2 bodybuilder.
- One rear-delt exercise every week as the fixed minimum.
- Focus default of +2, applied to start and ceiling, with the other muscles not slowed.
- The list of Focus choices, and the priority ceilings (18 / 26-28 / 30) used as the Focus limit.
- A fourth calf set per leg day at L3.
- Small muscle groups on 2 training days; 6 as the 2-day start and 8 as the 2-day top.
- What a Focus muscle gets when its template has too few slots (today: a bonus exercise on the optional day, or a cap the plan states).
- The floor of 10 for field athletes' chest, back and shoulders.
- Small muscles on the same ceilings as big ones.
- Calves reaching 10 a week with fewer than four leg days.
- The L3 definition and the L3 start of 20.
- The Pro setting (one muscle up to 35 sets).
- Every goal and phase factor in section 8 that has no answer id.
- The MYO set counted as 2 sets, and the core opener counted toward abs.

## Related pages

- [stairway.md](stairway.md): how the weekly sets climb.
- [sessions.md](sessions.md): his templates, session size by exercise count, and how sets are spread over exercises and days.
- [bilateral-unilateral.md](bilateral-unilateral.md): how sets split between two-leg and one-leg work.
- [plans-and-calendar.md](plans-and-calendar.md): plan lengths, maintenance and the year.
- [categories.md](categories.md): families, patterns, big and small muscles.
- [../05-reference/glossary.md](../05-reference/glossary.md): every term.
- Decision records: [floor of 10 on focus groups](../04-decisions/adr-017-floor-of-10-on-focus-groups.md), [the 2-day rule](../04-decisions/adr-052-two-day-rule.md), [rear delts are part of shoulders](../04-decisions/adr-018-rear-delts-part-of-shoulders.md), [helper credit 0.25](../04-decisions/adr-019-helper-credit-0-25.md), [athletic work never counts as muscle sets](../04-decisions/adr-020-athletic-work-never-counts-as-muscle-sets.md), [starting sets and ceilings by level](../04-decisions/adr-021-starting-sets-and-ceilings-by-level.md), [Focus muscle 1 and 2](../04-decisions/adr-024-focus-muscle-1-and-2.md), [no sex field](../04-decisions/adr-004-no-sex-field.md). All records: [../04-decisions/index.md](../04-decisions/index.md).
