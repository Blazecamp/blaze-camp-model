# Plans and the calendar: blocks, maintenance and the year

A Blaze Camp plan is a *block*: a run of weeks that climbs like a stairway and is meant to be finished. The coach's preferred block is 12 weeks. An 8-week block is the shorter option. Plans of 4 to 6 weeks are for maintenance and transitions, at 50 to 70 % of the volume. The general population can also get a whole year, with one theme per quarter. Athletes follow their season instead. There is never an easy week in the middle of a block. After a block an easy week is recommended, not required. When a block ends, it ends, and the person builds whatever comes next.

> **How to read this page.** A rule with an answer id was decided by coach Lalo Vera. Ids with no prefix (`PER-01`) are round 1, `R2-` is round 2, `R3-` is round 3. The newest round wins. **PROPOSED** means the team designed it and he has not confirmed it. **OBSERVED** means it was read from his sheets. His full answers by topic: [../03-coach-answers/plans-and-calendar.md](../03-coach-answers/plans-and-calendar.md).

## The rule

| # | Rule | Decided by |
|---|---|---|
| 1 | **Plan types:** 12 weeks (his preferred), 8 weeks, a 4 to 6 week maintenance or transition plan, and a full year for the general population. Athletes get a season plan. | PER-01, R2-PER-01 |
| 2 | **Every training plan is a stairway.** See [stairway.md](stairway.md). | R2-PER-03 |
| 3 | **Longer than 12 weeks?** Repeat another 12 weeks, one step higher. | PER-01, R2-VOL-06 |
| 4 | **Exercises stay the same for 4 to 6 weeks.** Then one or two small things change, never everything. | PER-02 |
| 5 | **No deload and no maintenance week inside a block.** | R2-VOL-07 |
| 6 | A block that cannot be finished is **stopped**. Then maintenance. Then a whole new block. | R2-VOL-07 |
| 7 | **After a block, an easy week** at about half the sets is **recommended, not mandatory**. It is an extra week. | PER-05, R2-VOL-07, R3-PER-01 |
| 8 | **When a block ends, it ends.** The person goes back and builds what they want next. | R3-PER-01 |
| 9 | **Maintenance** runs at 50 to 70 % of the volume. The person picks how many weeks. | PER-01, R2-PER-06 |
| 10 | **The yearly plan** is for the general population. It follows the person's own calendar and can be tuned. | R2-PER-01, R2-PER-02 |
| 11 | **Holidays and vacations go between blocks.** | R3-PER-01 |
| 12 | **Athletes:** off-season (most volume), pre-season (4 to 6 weeks at about 60 %, ending with a 1 to 2 week taper), in-season (2 days a week, low volume), post-season (recovery). | PER-08, R2-PER-06 |
| 13 | **Tests** only before a block and at its end. See [testing.md](testing.md). | R2-PER-07 |

## Why

**Why 12 weeks, and what 4 to 6 weeks is for.** The team first guessed fixed shapes with a deload in the middle. He marked that NOT RIGHT and described his own:

> "Usually, I like, personally, on my model, the 12-week programs." (PER-01)

> "I would like for people to be able to use the 4- to 6-week plans when they need to transition, like if they need a maintenance phase, or if they need to do a transition of vacation, things like that." (PER-01)

> "Anything more than 12 weeks, they can just repeat another 12 weeks." (PER-01)

**Why nothing easy goes in the middle.**

> "It should never be thrown in the middle of a block. No matter what the athlete puts, they need to be able to manage their block and complete it. If they can't complete it, they should cancel the block and start a maintenance phase, but then, when they're done with maintenance, they should start a whole new block." (R2-VOL-07)

**Why the easy week is only a recommendation.**

> "Yeah, maintenance weeks are a recommendation. They don't have to be mandatory, so people can go ahead and start one, or when the block ends, it just ends, and then you have to go back into the app and build whatever you want next." (R3-PER-01)

**Why a year plan.** It helps everyday people plan their year:

> "This is correct, but this is for the general population that wants to just stay in shape and wants to have some type of planning for how the year works" (R2-PER-01)

**Why it is not a fixed system.**

> "I don't need it to be conjugate or anything like that, but I do want to have good sound science behind it" (PER-01)

## Where it lives in the data

The readable source is [`generator_spec_v1.json`](../../generator_spec_v1.json). The fuller file is [`synthesis/06_periodization.json`](../../synthesis/06_periodization.json), explained in [`synthesis/06_periodization.md`](../../synthesis/06_periodization.md). `model/rules.json` is the compiled copy the engine reads. It is rebuilt by tools, so check the spec first when the two differ.

| What | File | JSON key |
|---|---|---|
| The plan types and their shapes | `generator_spec_v1.json` | `plan_types` (`fixed_12`, `fixed_8`, `maintenance_4_6`, `short_block_4_6`, `year`, `season`, `prep`, `week_by_week`) |
| The plan-type question on the form | `generator_spec_v1.json` | `inputs_schema.fields.F25` |
| Maintenance: why, and how many weeks | `generator_spec_v1.json` | `inputs_schema.fields.F25b`, `inputs_schema.fields.F25d`; `plan_types.maintenance_4_6` |
| The easy week: dose and when | `generator_spec_v1.json` | `plan_types.deload` (`dose`, `when`) |
| The next block one step up | `generator_spec_v1.json` | `plan_types.cycles`; form field `inputs_schema.fields.F25c` |
| Stopping a block; what the last page says | `generator_spec_v1.json` | `plan_editing.stopping_and_next_block`; text key `plan.next_steps` in `output.copy.strings` |
| The yearly plan | `generator_spec_v1.json` | `plan_types.year` (`quarters`, `calendar`, `tunable`, `guardrails`) |
| Athlete seasons | `generator_spec_v1.json` | `plan_types.season`; form fields `inputs_schema.fields.F14`, `inputs_schema.fields.F15` |
| Event dates and fight prep | `generator_spec_v1.json` | `plan_types.prep` |
| Exercise blocks and what may change between them | `generator_spec_v1.json` | `rule_tables.set_placement.block_rule`, `rule_tables.set_placement.second_weekly_exposure` |
| The check that nothing easy sits inside a block | `generator_spec_v1.json` | `validation_checks.V24_block_structure` |
| Kinds of week | `generator_spec_v1.json` | `vocab.week_types`, `vocab.plan_modes`, `vocab.season_phases` |
| Plan lengths with computed curves, the block flow, the year | `synthesis/06_periodization.json` | `plan_length_model` (`modes`, `stairway`, `maintenance`, `cycles`, `yearly`, `block_flow`) |
| Week-by-week skeletons per goal | `synthesis/06_periodization.json` | `skeletons` |
| Season phases per sport | `synthesis/06_periodization.json`; `synthesis/04_profiles.json` | `athlete.season_phases_v1_1`; `profiles[].season_overrides_v1` |
| Compiled copy | `model/rules.json` | `plan_types`, `recovery`, `cycles` |

---

## In detail

### 1. The words

| Word | Meaning |
|---|---|
| Block (training block) | The whole plan a person builds: for example 12 weeks that climb from week 1 to week 12. |
| Exercise block | A stretch of 4 to 6 weeks inside a plan in which the exercises stay the same. A 12-week plan has three. |
| Easy week | A light week after a finished block. His sheets and the data call it a deload or recovery week. He also says "maintenance week". |
| Maintenance phase | Several weeks at lower volume (50 to 70 %), built as its own plan. |
| Taper | The last 1 to 2 weeks before a game, a meet or an event, with less volume. |
| Off-season, pre-season, in-season, post-season | The four phases of an athlete's year. |

### 2. The plan types

| Plan | Weeks | For whom, when | Shape | Status |
|---|---|---|---|---|
| **12-week block** | 12 | the default; his preferred plan | a stairway; the last four weeks are the hardest | Coach: PER-01, R2-PER-04, R3-VOL-04 |
| **8-week block** | 8 | a shorter plan | the same stairway from the normal start | Coach: R2-PER-03 |
| **Maintenance plan** | the person picks (he described 4 to 6) | a transition, vacation, travel, moving, a season change, or after a stopped block | flat, at 50 to 70 % of the volume | Coach: PER-01, R2-PER-06. Holding it flat is the team's reading of "maintenance" (**PROPOSED**). |
| **Yearly plan** | 52 | the general population that wants to stay in shape | four quarters, each with a theme | Coach: R2-PER-01, R2-PER-02. Week layout **PROPOSED**. |
| **Season plan** | from the season dates | competitive athletes | off-season blocks → pre-season → in-season → post-season | Coach: PER-08, R2-PER-06, R2-GEN-05 |
| **Event prep** | up to a date | a fight, meet, race or tournament | see section 11 | Coach: PER-10, R3-ATH-05 |
| Short training block | 4 to 6 | inside a tuned year, or set by a coach | a short stairway | **PROPOSED** |
| Week by week | | | retired as a separate mode (section 12) | Coach: R3-VOL-02, R3-VOL-04 |

The form offers: 12 weeks (recommended), 8 weeks, Maintenance (you choose the weeks), and A full year. The full year is shown only for goals that are not a competitive sport. On the form the maintenance length runs from 1 to 8 weeks with a default of 4. That range and default are **PROPOSED**.

Whatever the type, the whole plan is built once and shown ahead of time. "This needs to be very simple for them to see the whole thing ahead of time" (R3-VOL-04).

### 3. The 12-week block

**Rule.** Twelve weeks, one stairway, the hardest weeks last.

**Why.** He described it in round 1 (PER-01): the first 2 to 4 weeks are "you getting used to the movements"; the next 4 to 6 weeks are "you driving it hard, not all the way to the top"; in the last weeks "you're going to get more tired, more stimulus, more changes, more adaptations". In round 2 he sharpened the end: "the last 4 weeks are going to be brutal" (R2-PER-04).

| Part of the plan | Weeks | Status |
|---|---|---|
| Getting used to it | weeks 1-4 for beginners (client level L1), 1-3 for intermediates (L2), 1-2 for advanced lifters (L3) | **PROPOSED** split inside his "first 2 to 4 weeks" |
| Driving | up to week 8 | **PROPOSED** split |
| Hardest | **9-12** | Coach: "the last 4 weeks" (R2-PER-04) |
| Exercise blocks | 1-4, 5-8, 9-12 | 4 to 6 weeks: PER-02. This split is **PROPOSED**. |
| Steps | about 3 % into weeks 2-6, about 5 % into weeks 7-12 | Coach: R3-VOL-04 |
| Tests, if ticked | before the block or in week 1, and in week 12 | Coach: R2-PER-07 |
| Easy week inside | none | Coach: R2-VOL-07 |

The weekly sets and the effort targets for each week are on [stairway.md](stairway.md).

### 4. The 8-week block

**Rule.** Eight weeks, the same stairway, from the same start as a 12-week plan.

**What changed between rounds.** In round 1 he described the 8-week plan as four weeks of getting used to it and four weeks of driving hard, and said "you have to start hard" (PER-01). The team turned that into a 4 + 4 plan with about 10 % more sets at the start. In round 2 he rejected that reading:

> "No, the 8-week plan should gradually go up like steps up a stairway. That's how every program should be." (R2-PER-03)

Round 2 wins. There is no harder start and no 4 + 4 split.

| Part of the plan | Weeks | Status |
|---|---|---|
| Steps | about 3 % into weeks 2-4, about 5 % into weeks 5-8 | Coach: R3-VOL-04 |
| Getting used to it / driving / hardest | 1-3, 4-5, 6-8 for L1 (shorter start for L2 and L3) | **PROPOSED** |
| Exercise blocks | 1-4, 5-8 | **PROPOSED** split |
| Tests, if ticked | week 1 and week 8 | Coach: R2-PER-07 |

An 8-week plan has fewer steps, so it ends lower than a 12-week plan. An L2 big muscle goes 15 → 19 in 8 weeks and 15 → 22 in 12.

### 5. Nothing easy inside a block

**Rule.** The generator never puts a deload week or a maintenance week inside a block. The printed stairway runs from the first week to the last.

**Why.** A block is something you manage and complete (R2-VOL-07, quoted above).

| Situation | What happens | Decided by |
|---|---|---|
| A hard week (busy, sore, tired) | the person goes lighter inside the effort target, switches off a block for the day, or repeats the week. Their call. | People adjust the plan themselves: R3-SES-02, R3-VOL-04. This list of options is **PROPOSED**. |
| The block cannot be finished | the person or coach stops it, builds a maintenance plan, then a whole new block | R2-VOL-07 |
| Where the new block starts after a stopped one | at the same level as the stopped block | **PROPOSED** |
| Does the app warn or offer to stop? | no. That needed check-ins, and there are none. | R3-VOL-02, R3-PER-01 |
| A holiday marked after the block has started | that block ends there, unless the mark is removed | R3-PER-01 |

### 6. The easy week after a block

**Rule.** After a finished block the plan recommends one easy week. The person can skip it.

| Parameter | Value | Status |
|---|---|---|
| Sets | about half the sets of the hardest (last) week | Coach: PER-05, R2-VOL-07 |
| Exercises | the same | Coach: PER-05 |
| Effort | lighter load, or 3 or more reps in reserve (reps you could still have done) | Coach: PER-05, R2-VOL-07 |
| Finishers and buy-outs | none | Coach: PER-05 |
| MYO sets and supersets | none | **PROPOSED** |
| Jumps, Olympic lifts, cardio in that week | landings only at about half the contacts; Olympic lifts at half the sets with light loads; easy cardio only | **PROPOSED** |
| How it counts in the calendar | it is an extra week: a 12-week block + 1 = a 13-week quarter | Coach: R3-PER-01 |
| Mandatory? | no. "maintenance weeks are a recommendation" | Coach: R3-PER-01 |
| When a maintenance phase follows the block | no easy week is needed; maintenance is the recovery | **PROPOSED** |

A *buy-out* is his name for a short conditioning finisher at the end of a session (OBSERVED).

### 7. When a block ends

**Rule.** The plan ends with its last week. Nothing rolls over by itself.

The last page of every plan says what comes next (the wording is **PROPOSED**):

1. Recommended: one easy week, then build the next block. After a finished block the next one starts 5 % higher with the ceiling one set higher (R2-VOL-06; see [stairway.md](stairway.md#8-after-the-block-the-next-stairway)).
2. Or build a maintenance plan and choose its weeks.
3. Or build something new.

Building again means filling in the form again and ticking the own-risk release again (R3-GEN-01). Nothing was stored, so the form asks how many blocks were finished in a row (**PROPOSED**).

**Moving up a level.** He approved moving a slot up a level at the end of a block when the exercise felt like '8 - That was perfect' or easier, with no pain (PER-06). With no logs, this is now the person's or the coach's call when they build the next block.

### 8. Maintenance

**Rule.** A maintenance plan holds what the person has. It runs flat at 50 to 70 % of the volume for as many weeks as the person picks.

**Why.**

> "That's usually a lower-volume maintenance volume kind of thing, which would drop all of the complete volume to maybe 70% around there, 50%. This allows them to recover and not push too hard." (PER-01)

> "You should be able to pick how many weeks you're going to do with maintenance." (R2-PER-06)

| Parameter | Value | Status |
|---|---|---|
| Volume | 50 to 70 % | Coach: PER-01 |
| Length | the person picks | Coach: R2-PER-06 |
| 50 % | vacation, limited equipment, marked holiday weeks | **PROPOSED** split |
| 60 % | travel, moving, a season change, after a stopped block | **PROPOSED** split |
| 70 % | planned maintenance, the summer quarter of the year plan | 70 % for that quarter: R2-PER-01. The rest of the split is **PROPOSED**. |
| Older adults | never below 70 % | **PROPOSED** |
| 50 to 70 % of what | the average of the last four weeks of the previous block; for a new client, the level's starting sets | **PROPOSED** |
| Effort | 2 to 3 reps in reserve, no intensifiers (MYO sets, supersets); loads kept, sets cut | **PROPOSED** |
| Floor of 10 sets | does not apply | **PROPOSED** reading. See [volume.md](volume.md). |
| After maintenance | a whole new block from week 1 | Coach: R2-VOL-07 |

**When it ends.** He listed three choices (R2-PER-06): keep going on maintenance, change the plan, or start a block of training. In round 2 he pictured the tool stopping to ask. Nothing tracks the weeks any more (round 3), so the plan prints the three choices on its last page. Printing them is **PROPOSED**.

**When to use it.** After a block (as a recommendation), around vacations and holidays, when moving or travelling, at a season change, or after stopping a block. Never forced.

### 9. Exercise blocks: what changes, and when

**Rule.** Inside an exercise block the exercises do not change. Only sets, reps, load and effort move. At the next exercise block one or two small things change.

**Why.** In conversation he put it this way: do not try to confuse the muscle. Keep the same exercises over the block, and change some small variables in the next one (chat statement). He then approved this wording:

> "Exercises stay fixed for the block (4–6 weeks). Next block: change one or two of grip, stance, implement, range of motion or rep range. Never all at once." (PER-02, the team's wording, marked RIGHT)

| Topic | Rule | Decided by |
|---|---|---|
| What may change between exercise blocks | one or two of: grip, stance, implement, range of motion, rep range | PER-02 |
| One-detail variations | allowed, shown as "Reverse lunge - dumbbell in opposite hand". The tool never invents a new exercise. | R2-LIB-01 |
| The same slot twice in one week | a different exercise from the same category | PER-04 |
| A/B weeks (the lead lift alternates week to week) | for people who want more variety | PER-03 |
| Swapping in the middle of an exercise block | only by the person's or coach's own choice | GEN-04, R3-SES-02 |
| Does the stairway restart when exercises change? | no | **PROPOSED** reading |
| Athletes' rep phases (his VOL 1, VOL 2, VOL 3: 12-15, then 8-12, then 6-8 reps on compounds) | one phase per off-season block | PER-11 |

### 10. The yearly plan

**Rule.** People who are not competitive athletes can get a full year. Each quarter has a theme he approved (R2-PER-01).

| Quarter | Theme (approved) | How the model lays it out (**PROPOSED**) | Cardio (**PROPOSED**) |
|---|---|---|---|
| January to March | hard work + more cardio; start cutting; sets stay at the starting level | weeks 1-12 a block, week 13 an easy week | one session more than the goal's default |
| April to June | summer shape: keep losing fat while building a little muscle | weeks 14-25 a block one step up, week 26 an easy week | the goal's default |
| July to September | maintain at about 70 % of the volume | weeks 27-39 maintenance | the goal's default; outdoor activity counts |
| October to mid-December | build muscle, less cardio | weeks 40-50 an 11-week block, one more step up | one session fewer |
| Last 2 weeks of December | maintenance | weeks 51-52 at about 60 % | walks, any activity |

Example for an L2 big muscle (computed by the team): 15 sets flat in the first quarter; 16 → 23 in the second; 15 in the third; 17 → 24 in the fourth; about 13 over the holidays.

**Why the first quarter does not climb in sets.** His approved text says the sets stay at the starting level while cutting. The weeks still get harder through cardio, load and effort. That reading is **PROPOSED**.

**The person's own calendar** (R2-PER-02, R3-PER-01):

| Topic | Rule | Status |
|---|---|---|
| Summer | follows the person's hemisphere | Coach: R2-PER-02. Shifting the year by six months is **PROPOSED**. |
| Holiday and vacation weeks | the person marks their own (Christmas, Semana Santa, Thanksgiving ...). They become maintenance and are placed between blocks. | Coach: R2-PER-02, R3-PER-01 |
| A holiday marked inside a running block | ends that block there, unless the mark is removed | Coach: R3-PER-01 |
| December maintenance | printed by default; the person can switch it off or move it | Round 2 said "automatic"; round 3 says maintenance weeks are a recommendation. The reading is **PROPOSED**. |
| Tuning | re-order the blocks, change a block's goal, more or less cardio | Coach: R2-PER-02 |
| A switched-off easy week | the next block starts a week earlier | **PROPOSED** |

On tuning he said: "They can set it up however they want, and they can adjust their year as well." A person may, for example, "ramp it up to powerlifting style" in deep winter (R2-PER-02).

What tuning cannot remove: every training block is a stairway, and nothing easy goes inside a block.

### 11. Athletes and events

**Rule.** A competitive athlete's plan follows the season, not the calendar year.

| Phase | What it is | Decided by |
|---|---|---|
| Off-season | the most volume; strength plus jumps; stairway blocks | PER-08 |
| Pre-season | a block of 4 to 6 weeks at about 60 % of off-season sets, with more speed and power, ending with a 1 to 2 week taper before the first game. The length can be changed. | R2-PER-06 |
| In-season | 2 days a week, low volume. Bilateral work is minimal. | PER-08, UNI-10 |
| In-season, game-heavy sports | gym jumps at about half, no extra change-of-direction work, sprints only for speed athletes, the one hard gym day at least 48 hours before a game | R2-ATH-07, R3-ATH-04 |
| Post-season | recovery and general work | PER-08 |

The form asks for the next season start date and the practice and game days per week. The tool works out the phases (R2-GEN-05). What an athlete keeps in season differs by sport: "for speed athletes, it'll be sprints on the on-season, but for other athletes, it might be just maintenance of strength" (PER-08).

| Event | Plan | Decided by |
|---|---|---|
| A fight or a competition | 2-week steps and waves instead of smooth weekly steps | PER-10 |
| A general-population event (a first HYROX fitness race, a pickleball tournament, a 10K run) | the hardest weeks end 1 week before the date, then 1 easy week at about half the sets | R3-ATH-05 |
| A swimmer's main championship meet | a 2-week dryland taper lined up with the swim coach's taper; 1 week or none before smaller meets | R3-ATH-01 |

More: [athletes.md](athletes.md), [sports.md](sports.md), [swimming.md](swimming.md), [stay-athletic-and-active.md](stay-athletic-and-active.md).

### 12. Week by week

In round 1 he wanted an option with no set length: "Just keep me in line, kind of thing, and then it does it by itself." (PER-01). In round 2 that mode was tied to the weekly check-in (R2-GEN-01). In round 3 he removed check-ins and asked that people see the whole plan ahead of time (R3-VOL-02, R3-VOL-04).

So week by week no longer exists as a separate mode. Someone who wants to be kept in line can use the year plan, or build one block after another. Keeping the old code as a 12-week plan that opens on its week view is **PROPOSED**.

### 13. What research says about these shapes

This is **SCIENCE** collected by the team. It does not overrule his answers. Full references: `synthesis/06_periodization.json > science`.

- Deloads in practice come about every 5 to 6 weeks, and most lifters cut sets in them (Rogerson, Bell and colleagues 2024). A week off in the middle of a program did not change growth (Coleman 2024). His rule keeps blocks whole and puts recovery between them.
- Strength and size can be held with much less volume than it took to build them (Bickel 2011; Spiering 2021). His 50 to 70 % is well above that minimum.
- Tapers of about two weeks with less volume and the same intensity are well supported (Bosquet 2007).

---

## Retired: do not rebuild

| Retired idea | Replaced by | Retired by |
|---|---|---|
| 6-week plans as a main training plan | 4 to 6 weeks is for maintenance and transitions | PER-01 |
| A fixed deload inside the plan (for example week 7 of 12, week 8 of 8) | no easy week inside a block | PER-01, R2-VOL-07 |
| A deload triggered in the middle of a block | the person stops the block if needed | R2-VOL-07 |
| The 8-week plan as 4 + 4 with a 10 % harder start | the same stairway as every plan | R2-PER-03 |
| "week 1 of the next cycle is a deload" | an extra easy week between blocks, recommended | R3-PER-01 |
| A mandatory recovery week between blocks | a recommendation | R3-PER-01 |
| In-app prompts (block done, maintenance ended, block at risk) | printed next steps on the last page | R3-VOL-02, R3-PER-01 |
| Week by week driven by check-ins | the whole plan shown ahead of time | R3-VOL-02, R3-VOL-04 |
| The '21.6 mile run' as a plan or test | removed; the longest run is the half-marathon plan | R2-LIB-06 |

Every change between rounds: [../03-coach-answers/changes-across-rounds.md](../03-coach-answers/changes-across-rounds.md).

## Still PROPOSED

Waiting for his yes or no:

- The split of a plan into "getting used to it", "driving" and "hardest" weeks, and the exercise-block weeks.
- The week layout of the yearly plan, the cardio per quarter and the hemisphere shift.
- The first-quarter cut with flat sets.
- The maintenance factors by reason (50 / 60 / 70 %), the 1-8 week range and the default of 4.
- Maintenance held flat, and its three end choices printed on the last page instead of asked by the tool.
- Asking "how many blocks did you finish in a row?" at the next build, and the same start after a stopped block.
- What happens to the calendar when a recommended easy week is switched off.
- Printing an athlete's season as one plan (off-season blocks plus pre-season), then building the in-season plan separately.
- Keeping "week by week" as a name for the week view of a 12-week plan.
- The athletic details of the easy week.

## Related pages

- [stairway.md](stairway.md): the weekly steps and the effort drift.
- [volume.md](volume.md): starts, ceilings and the floor of 10.
- [sessions.md](sessions.md): how a week is laid out.
- [testing.md](testing.md): tests before and after a block.
- [athletes.md](athletes.md): season phases in depth.
- [../00-overview/how-a-plan-is-made.md](../00-overview/how-a-plan-is-made.md): one worked example.
- Decision records: [plan lengths](../04-decisions/adr-042-plan-lengths.md), [no deload inside a block](../04-decisions/adr-043-no-deload-inside-a-block.md), [same exercises within a block](../04-decisions/adr-045-same-exercises-within-a-block.md), [every plan is a stairway](../04-decisions/adr-022-every-plan-is-a-stairway.md). All records: [../04-decisions/index.md](../04-decisions/index.md).
- [../05-reference/glossary.md](../05-reference/glossary.md): every term.
