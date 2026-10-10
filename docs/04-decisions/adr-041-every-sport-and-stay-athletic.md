# ADR-041: Every popular US sport, plus a "stay athletic and active" door

The model covers every popular sport in the United States, swimming included, with positions where they matter. It also gives the general population its own way in: people who do not compete but want to stay athletic and active, such as pickleball players and people training for HYROX (a fitness race of eight 1 km runs, each followed by a workout station). The coach asked for this in conversation on 2026-10-08 and approved the defaults for the new sports and activities in round 3. Most numbers inside the individual sport profiles are still the team's work.

| | |
|---|---|
| **Status** | Accepted (the coverage and the round-3 defaults). Profile numbers he has not seen are INFERRED or PROPOSED. |
| **Decided by** | Coach: conversation, 2026-10-08; GEN-02, ATH-13 (round 1); R2-GEN-05 (round 2); R3-ATH-01, R3-ATH-03, R3-ATH-04, R3-ATH-05 (round 3) |
| **Replaces** | A short list of profiles built only from the sports in his sheets |

## Decision (the rule)

| Door | Who | What the form asks | Source |
|---|---|---|---|
| Train for my sport (competitive) | Athletes | Sport, position, season start date, practice and game days | GEN-02, R2-GEN-05 |
| Stay athletic and active | General population | The activity only. No position, no season. | GEN-02, conversation |

Size of the coverage on 2026-10-09: 52 sports in the picker, 26 "stay athletic and active" activities, 127 profiles behind them.

Defaults he approved for people who stay active (R3-ATH-05):

| Item | Rule |
|---|---|
| Play days | The hardest gym day stays at least 48 hours before the biggest play day |
| Busy weeks | Weeks with 3 or more play sessions drop the extra agility drills and half the jumps |
| Cardio | A 45-60+ minute session of the activity counts as one of the 3 cardio sessions, up to 2 |
| Event date (optional) | The hardest weeks end 1 week before, then 1 easy week at about half the sets |

## Why

> "Different athletes need different things." (conversation)

> "They want to stay athletic and active, so we need to understand that that's an option for them." (conversation)

He wants the database to help "different gyms, different people, different coaches, and all of our clients" (conversation).

## Context

His sheets hold programs for a handful of populations: baseball, boxing, CrossFit, bootcamp, physique, and a non-competitive athletic program he had named "Justice League". That name was marketing. The program is for "weekend warriors": people who want to be athletic without competing (ATH-13). On 2026-10-08 he asked for all popular US sports, swimming, pickleball and what the dictation wrote as "high rows". Round 3 confirmed that means HYROX (R3-ATH-03).

## Options considered

| Option | What it meant | Outcome |
|---|---|---|
| A. Only the sports in his sheets | A few profiles | Too narrow for his request |
| B. Every popular US sport with positions | A profile per sport, built by his rules | **Chosen** |
| Gen pop: gym goals only | Muscle, fat loss, general fitness | Not enough |
| Gen pop: a "stay athletic and active" door | Activity-based plans without a season | **Chosen** |

## Consequences

- Each profile sets a few dials by his rules: the plyometric share ([ADR-037](adr-037-plyometric-vs-ballistic-by-ground-contact.md)), the bilateral share ([ADR-033](adr-033-bilateral-unilateral-scale.md)), cardio sessions, Olympic lifts ([ADR-039](adr-039-olympic-lifts-policy.md)) and injury hot spots.
- Swimming was built out first as the worked example. He approved its dryland defaults (R3-ATH-01).
- HYROX has its own approved week: 2 strength days, 2 hybrid days, 4 cardio sessions and 2 short station circuits (R3-ATH-03).
- High school, college and pro athletes of a sport share one structure (PRG-09).
- A reader should check the label on any single number in a sport profile. Only what he named or approved is confirmed.

## Where it lives in the data

| File | Key | What |
|---|---|---|
| [synthesis/04_profiles.json](../../synthesis/04_profiles.json) | `profiles`, `sports`, `activities` | Every profile, the sport picker, the activity list |
| [synthesis/04_profiles.json](../../synthesis/04_profiles.json) | `stay_athletic_standard` | What "stay athletic and active" means in a plan |
| [generator_spec_v1.json](../../generator_spec_v1.json) | `vocab.sports`, `vocab.activities` | The picker lists |
| [generator_spec_v1.json](../../generator_spec_v1.json) | `rule_tables.athletic.stay_active_play`, `rule_tables.athletic.swimming_dryland`, `rule_tables.athletic.hyrox_station_circuits` | The round-3 defaults |

Human text: [synthesis/04_athlete_profiles.md](../../synthesis/04_athlete_profiles.md). Master text: [BLAZE_CAMP_BRAIN.md](../../BLAZE_CAMP_BRAIN.md) §9.

## Related

[Sports](../02-model/sports.md) · [Stay athletic and active](../02-model/stay-athletic-and-active.md) · [Swimming](../02-model/swimming.md)
