# Sport profiles - gen pop: stay athletic and active (v1.1)

> **Status (2026-10-11, model v1.3).** This file was last issued at v1.1 (round 2) and was not re-issued for round 3, round 4, CT-01 or CX-01..04. The profiles were merged into `synthesis/04_athlete_profiles.md` (v1.3) and `04_profiles.json`, which win where they differ. Each profile now carries a confidence label in the compiled model: confirmed by the coach, based on a similar sport, or proposed (COACH-R4 R4-SCP-03). Read as history in this file: every mention of a check-in ("with a check-in the step table uses effort, completion and pain", "knee pain reported in a check-in": there is no check-in, the plan is computed once and the person or coach edits it, COACH-R3 R3-VOL-02, R3-VOL-04); session lengths and minutes used to size or check a plan (session minutes are not an input and not a limit; a plan is sized by exercise count, COACH-CT CT-01; COACH-R4 R4-SES-01, R4-SES-02); on 2 training days every big group is trained at about 6-8 weekly sets and a third day is suggested (COACH-R4 R4-SES-03). Sled pushes, wall balls, carries and the other proposed exercises named here are optional add-ons, primary only in HYROX and optionally the CrossFit-style class (COACH-R4 R4-LIB-01), and carries and sleds are dosed by distance or time (R4-LIB-02).

**What this is.** Profiles for people who do not compete but want to *stay athletic and active*: recreational pickleball, padel, tennis and golf, HYROX for fitness, rec leagues (kickball here; the other league sports in `team.json`), running, hiking / rucking, cycling, lap swimming, ski / snowboard prep, surf / paddle, dance and fitness classes, the coach's non-competitive athletic program (weekend warrior, formerly 'Justice League'), active aging 50-59 and 60+, and youth general athletic development. Machine-readable twin: `genpop-active.json` (same folder).

**Why.** The coach, 2026-10-08: gen-pop and general-fitness people "are wanting to do things like high rows [HYROX] and pickleball, meaning they want to stay athletic and active, so we need to understand that that's an option for them." He also asked for pickleball by name ("a very popular sport right now") and for swimming (competitive swimming is in `aquatic-endurance-track.json`; lap swimming is here).

**Authority.** Coach round-2 answers (COACH-R2) > round-1 answers (COACH-ANSWER) > everything else. Tags: OBSERVED (his sheets), COACH-ANSWER / COACH-R2 <ID>, INFERRED (analyst reasoning), SCIENCE (cited source), PROPOSED (needs his approval). Every profile carries a `field_evidence` block. No Google Sheet was opened or changed.

**Schema.** The 04 profile fields keep their names; the extra fields from `team.json` keep theirs; this file adds a few (listed at the end). Weekly sets = the activity's athletic budget (PROPOSED) + the 05 v1.1 athletic template's resistance, core and calves at 60 min, mid-block, + optional days. The volume engine (12 v1.1) sets the real per-muscle numbers: general factor x0.8, then the floor of 10 sets a week (COACH-R2 VOL-04/06).

## 1. What a 'stay athletic and active' plan contains (in the coach's terms)

The coach's own non-competitive athletic program (BYOP 'ATHLETIC - FULL BODY - 4 DAYS A', the former 'Justice League' tab, renamed 'Athletic Performance - Non-Competitive') is the template: every main day opens with light core, then a short athletic block (jumps, a throw, a change-of-direction drill, an Olympic lift), then full-body resistance in hip + push / knee + pull pairs, calves and rear delts; optional days carry Focus work and aerobic sessions. Recreational = no position, no season dates, no pre- / in-season blocks (GEN-02); the activity only changes WHICH athletic qualities lead and how much.

| Part of every main day | How much | Coach rule |
|---|---|---|
| warm-up | 5 min any cardio + A-drills / mobility; never counted as volume | COACH-ANSWER ORD-08 |
| core (opens the session) | 2 exercises x 2 sets, light, short of failure; movable; core supersets / monster sets may be added anywhere | COACH-ANSWER ATH-11, VOL-17; COACH-R2 SES-03 |
| some power - jumps | 1-2 jump stations x 2 sets; plyometric vs ballistic by the activity's ground-contact class (75 / 60 / 50 / 40 / 25 %), each block 15 points more ballistic at the start; Receive-Create stages 1 Land -> 2 Land & Go -> 3 Repeat | COACH-ANSWER ATH-01, CAT-10; COACH-R2 ATH-01/02/03 |
| some power - throws | 0-1 medball station x 2 sets (more for rotational activities: racket sports, golf); ball <= 20 lb, lighter for youth and older | COACH-ANSWER ATH-05, EQ-06, EQ-07, LIB-22 |
| some agility | 0-1 change-of-direction station x 2 sets, EASY -> MOD. TURN (HARD TURN and reactive agility for L2+); none needed for linear / grounded activities, but one light footwork station a week keeps 'some agility' (PROPOSED) | COACH-ANSWER ATH-06; stay-athletic minimum PROPOSED |
| Olympic / triple extension | 1 station x 2 sets on most main days (up to 4 a week): clean variants on squat days, snatch variants on hinge days; L1 = hang clean, KB squat clean, single-arm DB snatch, hex-bar jump, hang pulls; explained as power output, loaded by RIR / RPE | COACH-ANSWER ATH-10; COACH-R2 ATH-04/05, GEN-06, LIB-07 |
| resistance | 2-4 exercises per muscle group trained that day (never 1); hip-dominant + push, knee-dominant + pull; cross-pattern pairing; heavy squat and heavy deadlift on different days; volume by the engine: general factor x0.8, floor 10 sets a week per muscle, stairway steps | COACH-ANSWER UNI-06, UNI-11; COACH-R2 SES-01/02/05, VOL-04/06, PER-03/04; 12 v1.1 §3.4 |
| calves and rear delts | calves 3 sets every leg day; rear delts / KB face pulls their own sets | COACH-ANSWER VOL-17; COACH-R2 LIB-04 |
| aerobic (separate days or add-ons) | 3 sessions a week - one Blue (A), one Green (B), one Orange (C); the user can add or remove sessions; the activity itself can count (PROPOSED) | COACH-ANSWER ATH-07, EQ-14; COACH-R2 SES-06 |

**How much, by number of gym days.**
- 2 days: 2 main days + the activity: ~4 athletic stations a day (8-10 sets), resistance on the 05 2-day template; aerobic = the activity + 0-1 gym sessions
- 3 days: the default for most activities: 4-5 athletic stations a day (10-14 sets per day at most, often less), resistance on the 05 3-day template (S1 squat / S2 non-axial hinge / S3 deadlift)
- 4 days: the coach's own template (weekend warrior): 2 jumps + 1 throw + 1 COD + 1 Olympic a day (about 10 athletic sets a day), 2 optional days
- Evidence: OBSERVED BYOP athletic slots (OT04) + 05 v1.1 templates; scaling PROPOSED

**Shares in these 18 profiles (computed).** Athletic 8.8-27.9 % of weekly sets, resistance 57.1-72.6 %, core 11.9-18.0 %. The coach's own weekend-warrior template was about 32 % athletic sets in 04 v1 (40 of 124); with the v1.1 resistance block (R2-SES-05, 2-4 exercises per muscle group) it is about 25 %; endurance and 60+ profiles sit lower, court and youth profiles higher (computed). Estimated minutes per main day: 56-85 at the block start, 59-90 mid-block (rough upper bound; the coach allows longer full-body days - R2-SES-05; supersets first).

**Weekly ranges across the set (PROPOSED).** fast reactive plyometric contacts: 0-56 (gen-pop sits below the coach's field-athlete bands; 60+ default 0 beyond low ankle hops); low amplitude contacts: 40-100 (ankle hops, pogo, skips); all jump contacts incl landings and ballistic: 10-100; throws: 0-80 (rotational activities and the weekend warrior at the top); cod cuts: 0-56 (court activities and the weekend warrior at the top); olympic sets: 0-8 (60+ default 0); core sets: 4 per session; aerobic sessions: 3 (adjustable 2-5).

**What it is not.** not competitive: no position, no season start date, no pre-season or in-season blocks (COACH-ANSWER GEN-02) / no contrast / French-contrast complexes by default - they are for L2+ athletes in an off-season (COACH-ANSWER ATH-12; gen-pop reading INFERRED) / not aesthetics: medball throws stay in the main workout (ATH-05 removes them only for aesthetics) / no 1RM or max-mile tests from zero (COACH-R2 PER-07) / no lifestyle questions (sleep, stress, job) - workouts only (COACH-R2 GEN-04)

**Play days.** play / activity days are entered like practice or game days: hardest gym day >= 48 h before the heaviest play day; weeks with 3+ play sessions drop the extra agility drills and halve the plyos; a 45-60+ min session of a moderate activity can replace up to 2 of the 3 aerobic sessions (COACH-R2 ATH-07 logic extended; 06 v1.1 R17 - PROPOSED)

**Event date.** optional (race, tournament, trip): the block's hardest weeks end 1 week before, then a 1-week taper at about half the sets (06 v1.1 event_peak_genpop - PROPOSED)

**Year and check-ins.** the gen-pop year stays the default and is fully user-tunable (re-order blocks, more / less cardio, e.g. a winter strength block); an activity block can be dropped where the user wants it (COACH-R2 PER-01/02). no check-in = the plan follows its planned stairway (COACH-R2 VOL-03); a check-in uses effort, completion and pain only (COACH-R2 VOL-01 without the life column - COACH-R2 GEN-04).

**60+.** no Olympic lifts, plyos or depth jumps by default; landing drills and low ankle hops stay (05 v1.1 reading of the approved R2-ATH-08 proposal); throws, stepping, fast-concentric machine work and balance carry the 'athletic' part; the rest is an option with W_OLDER_POWER: 'Make sure that you have a fitness professional to help you understand what this means.'

**Youth.** kids and teens can use it (ATH-13); floor Olympic lifts from about 14 after a hang block (COACH-R2 ATH-08); youth_general_athletic profile

**Example week - recreational pickleball, 3 gym days, training block (from the JSON `sample_week`; every profile has one, plus heavy-play, event and 60+ variants where relevant).**

- Mon - S1 (jump + knee + pull; clean day): warm-up 5 min any cardio + A-drills / mobility (ORD-08, not volume) -> core 2 exercises x 2 sets, light, short of failure (R2-SES-03; movable - ATH-11) -> 2 plyo stations (split-step pogo; lateral bound-and-stick) -> COD (shuffle / crossover / drop-step) -> clean variant (KB squat clean) -> HEAVY SQUAT (axial day 1, R2-SES-01) + horizontal pull -> split squat / lunge + vertical pull -> single-leg hinge + leg curls -> side + rear delts (KB face pulls, R2-LIB-04) -> calves 2 exercises (3 sets, VOL-17)
- Wed - S2 (medball + hip + push; snatch day): warm-up 5 min any cardio + A-drills / mobility (ORD-08, not volume) -> core 2 exercises x 2 sets, light, short of failure (R2-SES-03; movable - ATH-11) -> medball rotational throws both sides + overhead slam -> 1 plyo (lateral line hops) -> snatch variant (single-arm DB snatch) -> NON-AXIAL HINGE (hip thrust / back extension / reverse hyper, R2-SES-01) + horizontal push -> single-leg hinge + vertical push -> chest fly or push-up variant + side / rear delts -> calves 2 exercises
- Fri - S3 (Olympic + strength): warm-up 5 min any cardio + A-drills / mobility (ORD-08, not volume) -> core 2 exercises x 2 sets, light, short of failure (R2-SES-03; movable - ATH-11) -> COD (lateral reaction for L2+) -> clean variant (hang clean) + wrist / grip work in the isolation block -> HEAVY DEADLIFT / trap bar (axial day 2, R2-SES-01) + horizontal push -> split squat / step-up + row -> leg curls + chest fly -> leg extensions + pulldown -> calves 2 exercises
- Tue / Thu / Sun - play days (open play, league) or aerobic sessions
- Sat - optional: Focus 1 / Focus 2, calves, core or an aerobic session (ORD-10)
- Heavy-play weeks: 3+ play sessions: drop the COD station, halve the plyo contacts, keep the light Olympic piece and the resistance block; play replaces 2 aerobic sessions (play_adjustment)
- 60+: S1 / S2 / S3 keep the same order without Olympic lifts and plyos (landing drills + low ankle hops only); each day adds 1 fast-concentric machine exercise and a balance drill; switch-on with W_OLDER_POWER

## 2. Summary table

Dial = power / agility / core / resistance / aerobic, 0-3 (PROPOSED). Plyo share = plyometric share of jump + throw sets at the end of a block (COACH-R2 ATH-01; each block starts 15 points more ballistic). Doses are nominal weekly values from the sets (fast-reactive plyometric contacts / all jump contacts incl. landings and ballistic jumps / throws / cuts).

| id | Name (EN) | Name (ES, PROPOSED) | Gym days (+ activity) | Class -> plyo share | Athletic sets | Plyo / jumps | Throws | Cuts | Olympic (default) | Aerobic / wk | Bil : uni start -> end | Dial P/A/C/R/Ae |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| `rec_pickleball` | Pickleball - recreational (open play, league, ladder) | Pickleball recreativo (juego libre, liga, escalera) | 3 (+1 opt; 2-4 play sessions a week typical) | 3 -> 50 % | 22 | 8 / 16 | 60 | 28 | 3x / wk, 6 sets | 3 | 30/70 -> 20/80 | 2/3/2/2/2 |
| `rec_padel` | Padel - recreational | Pádel recreativo | 3 (+1 opt; 2-3 matches a week typical) | 3 -> 50 % | 22 | 8 / 16 | 60 | 28 | 3x / wk, 6 sets | 3 | 30/70 -> 20/80 | 2/3/2/2/2 |
| `rec_tennis` | Tennis - recreational (social, club or adult league) | Tenis recreativo (social, club o liga de adultos) | 3 (+1 opt; 1-3 matches or hits a week typical) | 3 -> 50 % | 26 | 14 / 24 | 80 | 28 | 3x / wk, 6 sets | 3 | 30/70 -> 20/80 | 2/3/2/2/2 |
| `rec_golf` | Golf - recreational | Golf recreativo | 3 (+1 opt; 1-3 rounds or range sessions a week) | 5 -> 25 % | 19 | 4 / 18 | 80 | 14 | 2x / wk, 4 sets | 3 | 30/70 -> 20/80 | 2/1/3/2/2 |
| `hyrox_fitness` | HYROX for fitness (first race / Open division) | HYROX por salud (primera carrera / división Open) | 4 (+1 opt; running and erg sessions = the aerobic work) | 3 -> 50 % | 18 | 11 / 36 | 20 | 14 | 2x / wk, 4 sets | 4 | 50/50 -> 50/50 | 1/1/2/2/3 |
| `rec_league` | Rec league (adult recreational team sport - pick the sport) | Liga recreativa (deporte de equipo para adultos - elige el deporte) | 3 (+1 opt; usually 1 league game a week) | 3 -> 50 % | 24 | 28 / 55 | 40 | 28 | 3x / wk, 6 sets | 3 | 50/50 -> 40/60 | 2/2/2/2/2 |
| `rec_kickball` | Kickball - adult rec league | Kickball - liga recreativa de adultos | 3 (+1 opt; 1 game a week) | 4 -> 40 % | 20 | 10 / 26 | 40 | 14 | 3x / wk, 6 sets | 3 | 40/60 -> 30/70 | 2/2/2/2/2 |
| `run_fitness` | Running for fitness (first 5K / 10K, run club) | Correr por salud (primer 5K / 10K, club de corredores) | 2 (+0 opt; 3 runs a week = the aerobic sessions) | 1 -> 75 % | 10 | 10 / 26 | 0 | 0 | 1x / wk, 2 sets | 3 | 20/80 -> 20/80 | 1/0/2/2/3 |
| `hike_ruck` | Hiking and rucking | Senderismo y rucking (caminata con mochila con peso) | 3 (+1 opt; 1 long hike or ruck a week) | 5 -> 25 % | 14 | 0 / 20 | 20 | 14 | 2x / wk, 4 sets | 3 | 40/60 -> 30/70 | 1/1/2/2/3 |
| `cycling_fitness` | Cycling and indoor cycling for fitness | Ciclismo y ciclismo indoor (spinning) por salud | 2 (+0 opt; 2-4 rides or classes a week = the aerobic sessions) | 4 -> 40 % | 12 | 8 / 36 | 20 | 0 | 1x / wk, 2 sets | 3 | 50/50 -> 40/60 | 1/0/2/2/3 |
| `lap_swim` | Lap swimming for fitness (incl. masters-style workouts) | Natación por salud (nado de piscina, incluye entrenamientos tipo master) | 2 (+0 opt; 2-3 swims a week = the aerobic sessions) | 4 -> 40 % | 12 | 8 / 26 | 40 | 0 | 1x / wk, 2 sets | 3 | 50/50 -> 40/60 | 1/0/2/2/3 |
| `ski_snow_prep` | Ski / snowboard season prep | Preparación para la temporada de esquí / snowboard | 3 (+1 opt; ski days in season) | 4 -> 40 % | 20 | 8 / 36 | 20 | 28 | 3x / wk, 6 sets | 3 | 40/60 -> 30/70 | 2/2/2/3/2 |
| `surf_paddle` | Surfing and stand-up paddleboarding | Surf y stand-up paddle (SUP) | 3 (+0 opt; 1-4 sessions in the water a week) | 5 -> 25 % | 12 | 0 / 10 | 40 | 0 | 2x / wk, 4 sets | 3 | 50/50 -> 40/60 | 2/0/3/2/2 |
| `dance_fitness` | Dance and group fitness classes (Zumba, dance cardio, step) | Baile y clases grupales (Zumba, dance cardio, step) | 2 (+0 opt; 2-4 classes a week = most of the aerobic work) | 3 -> 50 % | 12 | 8 / 26 | 20 | 14 | 1x / wk, 2 sets | 3 | 50/50 -> 40/60 | 1/2/2/2/3 |
| `weekend_warrior` | Athletic Performance - Non-Competitive (weekend warrior; formerly 'Justice League') | Rendimiento atlético - no competitivo (atleta de fin de semana) | 4 (+2 opt; weekend games, hikes, pickup - optional play_days) | 3 -> 50 % | 40.0 | 56 / 100 | 80 | 56 | 4x / wk, 8.0 sets | 3 | 50/50 -> 40/60 | 2/2/2/2/2 |
| `active_aging_50plus` | Active aging 50-59 (stay athletic) | Envejecimiento activo 50-59 (mantenerse atlético) | 3 (+1 opt; any activity) | 3 -> 50 % | 14 | 8 / 26 | 20 | 14 | 2x / wk, 4 sets | 3 | 50/50 -> 40/60 | 2/2/2/3/2 |
| `active_aging_60plus` | Active aging 60+ (stay athletic, older-adult rules) | Envejecimiento activo 60+ (mantenerse atlético, reglas para adultos mayores) | 3 (+1 opt; any activity) | - (60+ default) | 8 | 0 / 16 | 20 | 14 | none (opt-in) | 3 | 50/50 -> 50/50 | 1/1/2/3/2 |
| `youth_general_athletic` | Youth general athletic development (non-competitive kids and teens) | Desarrollo atlético general juvenil (niños y adolescentes no competitivos) | 3 (+0 opt; free play, PE and other sports) | 3 -> 50 % | 28 | 16 / 52 | 40 | 28 | 2x / wk, 4 sets | 2.5 | 50/50 -> 50/50 | 2/3/2/2/2 |

All profiles: core first (2 x 2, light - R2-SES-03), heavy squat and heavy deadlift on different days (R2-SES-01/02), 2-4 exercises per muscle group trained that day (R2-SES-05), calves 3 sets every leg day and rear delts own sets (VOL-17), no bands (EQ-01), the stairway with no mid-block deload (R2-PER-03/04, R2-VOL-07), tests only before and at the end of a block and never a 1RM / max mile from zero (R2-PER-07), weight by RIR / RPE and Olympic lifts explained as power output (R2-GEN-06), cardio count adjustable (R2-SES-06), 60+ defaults (R2-ATH-08).

### Rec leagues: which profile each league sport uses

| League sport (F11r) | Profile |
|---|---|
| basketball | rec_basketball (sports/team.json) |
| soccer | rec_soccer (sports/team.json) |
| softball | rec_softball (sports/team.json) |
| flag_football | rec_flag_football (sports/team.json) |
| volleyball | rec_volleyball (sports/team.json) |
| kickball | rec_kickball (this file) |
| also_available | rec_hockey (sports/team.json), rec_ultimate (sports/team.json) |
| fallback | rec_league (this profile) when the sport is not listed |

## 3. Per-activity notes

### Pickleball - recreational (open play, league, ladder) (`rec_pickleball`)

Agility leads: split-step reactions, lateral shuffles, crossover and a drop-step 'turn and run' instead of backpedalling (seniors' injuries are mostly falls, and the wrist is the most common fracture site - G3). Rotational and overhead medball throws both sides; lateral-hip, single-leg, calf / Achilles, posterior-cuff and wrist-extensor work. Many players are 50+; at 60 the older rules switch on automatically. Open play of 45-60+ min is moderate exercise (~70 % of max heart rate in 40-85-year-olds - G4) and can replace up to 2 aerobic sessions (PROPOSED).

- **Injury hotspots -> prehab codes:** ACHILLES_CALF, ANKLE_SPRAIN, FALLS_COURT, WRIST_HAND, ELBOW_LATERAL_RACKET, SHOULDER_THROWER, LOW_BACK_ROTATIONAL, PAIN_GENERAL (rules in the JSON `injury_prehab`; never bands).
- **Resistance goal:** strength (legs, single-leg, lateral) (then power (rotational, first step)). **Rotation:** high (forehand and backhand, both sides). **Contra / ipsi:** contralateral loading for getting in and out of the hip on lateral reaches (COACH-ANSWER CAT-13: COD athletes, 'tennis definitely' - pickleball INFERRED the same); ipsilateral step-ups for the first step (INFERRED)
- **60+:** no Olympic lifts, no plyos, no depth jumps; landing drills (RC1 'Land') and low ankle hops stay; light medball throws (4-8 lb) and EASY-TURN footwork stay (throws and COD are not plyos - INFERRED); compounds and isolation on constrained machines where available (EQ-03 / EQ-04)
- **Event date:** a tournament or a pickleball trip -> hardest weeks end 1 week before, then a 1-week taper (PROPOSED).
- **Evidence:** 24.3 million US players in 2025 (16.8 M casual, 7.48 M core); +171.8 % in three years [G1, G2] | players 65+ were the second-largest age bracket (15.4 %) in SFIA's 2023 data [G2b] | seniors (>= 60) 2010-2019: strains / sprains 31.0 %, fractures 30.4 %; slip / trip / fall / dive 66.9 %; wrist and lower leg the most common sites; women 9.3 x more likely to fracture a wrist [G3] | singles and doubles reach about 70 % of predicted max heart rate in 40-85-year-olds; 6 weeks of play (3 x 60 min) improved VO2max, blood pressure and lipids [G4] | racket sports: Achilles and calf problems in masters players; 'tennis leg' (medial gastrocnemius) is typical of middle-aged recreational players [G31, G32]
- **For the coach to confirm:** Should open-play sessions replace gym aerobic sessions (up to 2 of 3)? / Pickleball's plyo share: 50 % like tennis (class 3)?

### Padel - recreational (`rec_padel`)

Same frame as pickleball with more overhead work (bandeja, vibora, smash) and forward-back movement; elbow tendon care first (elbow is the most injured site - G5), then knee, shoulder and low back. Matches run at ~70-80 % of max heart rate with short rallies (G6).

- **Injury hotspots -> prehab codes:** ELBOW_LATERAL_RACKET, ACL_LANDING_CUTTING, SHOULDER_THROWER, LOW_BACK_ROTATIONAL, ACHILLES_CALF, ANKLE_SPRAIN, FALLS_COURT, PAIN_GENERAL (rules in the JSON `injury_prehab`; never bands).
- **Resistance goal:** strength (legs, single-leg, lateral) (then power (overhead and rotational)). **Rotation:** high (forehand and backhand, both sides). **Contra / ipsi:** contralateral loading for getting in and out of the hip on lateral reaches and low volleys (COACH-ANSWER CAT-13: COD athletes, 'tennis definitely' - padel INFERRED the same); ipsilateral step-ups for the first step (INFERRED)
- **60+:** no Olympic lifts, no plyos, no depth jumps; landing drills (RC1 'Land') and low ankle hops stay; light medball throws (4-8 lb) and EASY-TURN footwork stay (throws and COD are not plyos - INFERRED); compounds and isolation on constrained machines where available (EQ-03 / EQ-04)
- **Event date:** a padel tournament or club event -> hardest weeks end 1 week before, then a 1-week taper (PROPOSED).
- **Evidence:** injury incidence about 3 per 1000 h of training and 8 per 1000 matches; elbow most common, then knee, shoulder, low back; tendon 44-49 %, muscle 27-34 % (mean ages 31-57) [G5] | match play: heart rate about 70-80 % of max, rallies mostly 3-15 s, work : rest about 0.84, low glycolytic contribution [G6] | 1.07 million Americans played padel in 2025; about 1,000 US courts by April 2026, Florida about 41 % of courts [G7]
- **For the coach to confirm:** Padel's plyo share: 50 % (class 3, like tennis)?

### Tennis - recreational (social, club or adult league) (`rec_tennis`)

Reuses the coach's tennis rules (04): class 3 / 50 %, high medball (ATH-05), contralateral loading 'definitely' (CAT-13), unilateral bias (UNI-02), posterior cuff / wrist extensors / lateral hip priorities, push : pull 1 : 1.8. Recreational dose and one step more bilateral (30/70 -> 20/80) than the competitive player.

- **Injury hotspots -> prehab codes:** ELBOW_LATERAL_RACKET, SHOULDER_THROWER, LOW_BACK_ROTATIONAL, ACHILLES_CALF, ANKLE_SPRAIN, GROIN_ADDUCTOR, FALLS_COURT, PAIN_GENERAL (rules in the JSON `injury_prehab`; never bands).
- **Resistance goal:** strength (then power (rotational)). **Rotation:** high (forehand and backhand, both sides). **Contra / ipsi:** contralateral 'definitely' (COACH-ANSWER CAT-13: tennis)
- **60+:** no Olympic lifts, no plyos, no depth jumps; landing drills (RC1 'Land') and low ankle hops stay; light medball throws (4-8 lb) and EASY-TURN footwork stay (throws and COD are not plyos - INFERRED); compounds and isolation on constrained machines where available (EQ-03 / EQ-04)
- **Event date:** a club tournament or league playoff -> hardest weeks end 1 week before, then a 1-week taper (PROPOSED).
- **Evidence:** players change direction ~1.6 times per point, every ~2.7-3.1 s (04 tennis) | elbow 21.4 %, shoulder 19.4 %, lumbar 17.3 % of tennis injuries (04 tennis) | seniors' tennis injuries: falls and lower-leg / wrist injuries dominate as in pickleball [G3] | 'tennis leg' (medial gastrocnemius strain) in middle-aged recreational players [G32]
- **For the coach to confirm:** Recreational tennis: start 30/70 and end 20/80 bilateral : unilateral (one step more bilateral than your competitive tennis player)?

### Golf - recreational (`rec_golf`)

Reuses the coach's golf rules (04): class 5 / 25 %, the into / out-of-the-hip medball matrix, contralateral / ipsilateral lunges, transverse core (Pallof -> chops on a cable, never bands), lead-leg block, thoracic rotation. Walking 9-18 holes counts as an Orange session (PROPOSED). One light footwork station a week keeps 'some agility' (PROPOSED - golf itself needs none).

- **Injury hotspots -> prehab codes:** LOW_BACK_ROTATIONAL, LEAD_HIP_GLUTE, ELBOW_LATERAL_RACKET, SHOULDER_THROWER, PAIN_GENERAL (rules in the JSON `injury_prehab`; never bands).
- **Resistance goal:** power (rotational) (then strength (lower body, lead-leg block)). **Rotation:** very high (one-directional sport - train both sides). **Contra / ipsi:** into / out of the hip: contralateral-loaded lunges and step-ups ('GET INTO THE HIP'), ipsilateral ('GET OUT OF THE HIP'); lead leg into, trail leg out (04 golf, COACH-ANSWER CAT-13)
- **60+:** no Olympic lifts, no plyos, no depth jumps; landing drills (RC1 'Land') and low ankle hops stay; light medball throws (4-8 lb) and EASY-TURN footwork stay (throws and COD are not plyos - INFERRED); compounds and isolation on constrained machines where available (EQ-03 / EQ-04)
- **Event date:** a club championship, a golf trip or a scramble -> hardest weeks end 1 week before, then a 1-week taper (PROPOSED).
- **Evidence:** low back is the most common golf injury: 18-54 % of reported ailments; 15-34 % incidence in amateurs; poor trunk endurance, restricted lead-hip internal rotation and swing flaws are risk factors [G35] | rotational power correlates with clubhead speed (04 golf)
- **For the coach to confirm:** One light footwork (COD) station a week for recreational golfers to keep 'some agility' - yes or no?

### HYROX for fitness (first race / Open division) (`hyrox_fitness`)

The race (8 x 1 km run + 8 stations, G8) is mostly aerobic: VO2max, body fat and endurance volume predicted time; grip and resistance volume did not (G9). Plan: 2 strength days (squat + pull, deadlift + push) + 2 hybrid days (Blue run intervals + a station circuit; Green 'compromised running'), 4 aerobic sessions (A + B + C + a second C, like the approved aesthetics second Orange). The coach already linked HYROX to wall balls with a heavier ball (EQ-06) and to 40-rep sets (VOL-11). No more than 2 race-simulation days a week (more HYROX-specific sessions = more injuries in a 2026 survey - G11).

- **Injury hotspots -> prehab codes:** PATELLAR_TENDON, LOW_BACK_LOADING, ACHILLES_CALF, RUNNING_OVERUSE, NEW_CLASS_EASE_IN, PAIN_GENERAL (rules in the JSON `injury_prehab`; never bands).
- **Resistance goal:** endurance-strength (then strength). **Rotation:** low. **Contra / ipsi:** ipsilateral step-ups and lunges for push-off (CAT-13 acceleration logic, INFERRED); contra / ipsi variety as health accessories
- **60+:** no Olympic lifts, no plyos (incl. burpee broad jumps), no depth jumps; landing drills and low ankle hops stay; sled, carries, lunges, ergs and wall balls (lighter ball) stay
- **Event date:** a HYROX race (Open, Doubles or Relay) -> hardest weeks end 1 week before, then a 1-week taper (PROPOSED).
- **Evidence:** race format and Open weights: sled push 152 / 102 kg incl. sled, sled pull 103 / 78 kg, farmers 2 x 24 / 2 x 16 kg, sandbag 20 / 10 kg, wall ball 6 / 4 kg (men / women) [G8] | about 86.5 min at about 79.5 % of max heart rate; VO2max, lower body fat and endurance-training volume predicted time; grip strength and resistance-training volume did not; recommended resistance : endurance training about 1 : 1 to 1 : 2 [G9] | running takes about half the race time (practitioner analysis) [G37]; HYROX = aerobic base + anaerobic power + local muscular endurance + strength (review) [G10] | survey (preprint): about half of HYROX athletes reported an injury; knee most common (20.8 %), mostly gradual tendon complaints; more HYROX-specific sessions per week = more injuries (OR 1.61) [G11]
- **For the coach to confirm:** HYROX: 4 aerobic sessions (A + B + C + a second C) with 2 station circuits as finishers? / HYROX plyo share 50 % (class 3 'mixed')? / Are station circuits counted as muscle sets? (proposed: no - conditioning)

### Rec league (adult recreational team sport - pick the sport) (`rec_league`)

Router: the league sport picks the profile (table above). Fallback = the weekend-warrior dial at 3 days; a weekly game replaces one aerobic session and the heavy lower day sits >= 48 h before it.

- **Injury hotspots -> prehab codes:** HAMSTRING, ANKLE_SPRAIN, ACHILLES_CALF, ACL_LANDING_CUTTING, PAIN_GENERAL (rules in the JSON `injury_prehab`; never bands).
- **Resistance goal:** strength (then hypertrophy). **Rotation:** moderate. **Contra / ipsi:** cross-pattern pairing (UNI-06); contra / ipsi variety (04 weekend warrior)
- **60+:** no Olympic lifts, no plyos, no depth jumps; landing drills (RC1 'Land') and low ankle hops stay; light medball throws and EASY-TURN footwork stay (not plyos - INFERRED); compounds and isolation lean to constrained machines (EQ-03 / EQ-04)
- **Evidence:** adult kickball (WAKA) example: leagues of 4-16 coed teams, 8 regular-season games + a championship tournament, about a 10-week season, one night a week [G12]
- **For the coach to confirm:** Should a weekly league game replace one aerobic session?

### Kickball - adult rec league (`rec_kickball`)

Plays like softball: planted kicking, fielding and throwing + short base-path sprints -> class 4 (40 %), acceleration starts 10-20 m, overhand / rotational throws, hamstring (Nordics), hip-flexor and adductor care. Typical WAKA season: ~10 weeks, one game night a week (G12). No kickball injury study was found (search 2026-10-08); hotspots are INFERRED.

- **Injury hotspots -> prehab codes:** HAMSTRING, HIP_FLEXOR, GROIN_ADDUCTOR, ANKLE_SPRAIN, SHOULDER_THROWER, PAIN_GENERAL (rules in the JSON `injury_prehab`; never bands).
- **Resistance goal:** power (sprint start, kick, throw) (then strength). **Rotation:** moderate (kicking, throwing). **Contra / ipsi:** ipsilateral step-ups for the base-running start (COACH-ANSWER CAT-13: ipsilateral for acceleration); contralateral lunges for fielding cuts (INFERRED)
- **60+:** no Olympic lifts, no plyos, no depth jumps; landing drills (RC1 'Land') and low ankle hops stay; light medball throws and EASY-TURN footwork stay (not plyos - INFERRED); compounds and isolation lean to constrained machines (EQ-03 / EQ-04)
- **Event date:** a kickball tournament -> hardest weeks end 1 week before, then a 1-week taper (PROPOSED).
- **Evidence:** league structure from WAKA reporting [G12] | no kickball-specific injury study found (searched 2026-10-08) - hotspots INFERRED
- **For the coach to confirm:** Kickball at the softball share (40 %) or the weekend-warrior share (50 %)?

### Running for fitness (first 5K / 10K, run club) (`run_fitness`)

2 gym days + 3 runs (the runs are the aerobic sessions). Strength for running economy (G15), calves / soleus, hip abductors, ipsilateral step-ups (04 distance runner), low-amplitude plyos first (class 1 / 75 % at a low dose). Beginners start run / walk (Couch to 5K - G14); running minutes climb the same stairway; novice runners get hurt more per hour (G13). The half marathon stays the longest run (the coach's Chris Hinshaw plan as-is - PRG-12; the 21.6-mile run is removed - R2-LIB-06).

- **Injury hotspots -> prehab codes:** RUNNING_OVERUSE, ACHILLES_CALF, BONE_STRESS, HAMSTRING, PAIN_GENERAL (rules in the JSON `injury_prehab`; never bands).
- **Resistance goal:** strength (then power (reactive stiffness)). **Rotation:** low. **Contra / ipsi:** ipsilateral step-ups for push-off (04 distance runner; COACH-ANSWER CAT-13 acceleration logic)
- **60+:** no Olympic lifts, no plyos except low ankle hops and landing drills (useful for runners), no depth jumps; constrained machines lean (EQ-03)
- **Event date:** a 5K / 10K race or a run-club event -> hardest weeks end 1 week before, then a 1-week taper (PROPOSED).
- **Evidence:** novice runners 17.8 injuries per 1000 h vs 7.7 for recreational runners; most injuries at the knee and lower leg [G13] | high-load, plyometric and combined strength training improve running economy (systematic review with meta-analysis) [G15] | Couch to 5K: 3 runs a week for 9 weeks, run / walk progression [G14]
- **For the coach to confirm:** Runners: 2 gym days + 3 runs, the runs counting as the 3 aerobic sessions?

### Hiking and rucking (`hike_ruck`)

Endurance-strength: step-ups and slow step-downs (descents), split squats, carries (LIB-19), back-extension endurance for the pack, calves and ankles; ballistic step-up / box jumps (class 5 / 25 %). The hike or ruck is the Orange session; ruck load climbs ~10 % -> +5 % of body weight every 2-4 weeks, under ~30 % (G16).

- **Injury hotspots -> prehab codes:** ANKLE_SPRAIN, KNEE_DESCENT_ECCENTRIC, LOW_BACK_LOADING, ACHILLES_CALF, PAIN_GENERAL (rules in the JSON `injury_prehab`; never bands).
- **Resistance goal:** endurance-strength (then strength). **Rotation:** low. **Contra / ipsi:** ipsilateral step-ups (drive up the hill - CAT-13 acceleration logic, INFERRED); contralateral lunges as health accessories
- **60+:** no Olympic lifts, no plyos, no depth jumps; landing drills (RC1 'Land') and low ankle hops stay; light medball throws and EASY-TURN footwork stay (not plyos - INFERRED); compounds and isolation lean to constrained machines (EQ-03 / EQ-04)
- **Event date:** a big hike, a trek or a ruck event -> hardest weeks end 1 week before, then a 1-week taper (PROPOSED).
- **Evidence:** load-carriage practice: start about 10 % of body weight, add about 5 % every 2-4 weeks, stay under about 30 %; build eccentric strength and avoid volume spikes [G16] | hiking ankle sprains happen mostly on downhill and loose ground; older, heavier hikers and past sprains are at higher risk [G17]
- **For the coach to confirm:** Hikers / ruckers: the weekly hike or ruck counts as the Orange session?

### Cycling and indoor cycling for fitness (`cycling_fitness`)

2 gym days + rides. Heavy legs, upper back / rear delts and back extensions for the riding posture (neck, knee and back complaints are common - G19), and jumps for bone (cyclists often have low bone density - G18). The first indoor-cycling classes are done easy (rhabdomyolysis case reports after a first class - G20).

- **Injury hotspots -> prehab codes:** CYCLING_POSTURE, BONE_LOW_IMPACT, NEW_CLASS_EASE_IN, WRIST_HAND, PAIN_GENERAL (rules in the JSON `injury_prehab`; never bands).
- **Resistance goal:** strength (then power). **Rotation:** low. **Contra / ipsi:** contra / ipsi as health accessories (CAT-13 size-strength logic, INFERRED)
- **60+:** no Olympic lifts, no plyos, no depth jumps; landing drills (RC1 'Land') and low ankle hops stay; light medball throws and EASY-TURN footwork stay (not plyos - INFERRED); compounds and isolation lean to constrained machines (EQ-03 / EQ-04)
- **Event date:** a charity ride, gran fondo or century -> hardest weeks end 1 week before, then a 1-week taper (PROPOSED).
- **Evidence:** recreational cyclists: 85 % report an overuse injury; neck 48.8 %, knees 41.7 %, groin / buttocks 36.1 %, hands 31.1 %, back 30.3 % [G19] | road cyclists show low bone density (lumbar spine); strength training may help [G18] | exertional rhabdomyolysis after a first spin class, including previously fit adults [G20]
- **For the coach to confirm:** Cyclists: keep jumps for bone (box / squat jumps, ankle hops) even though the sport has no ground contact? / Optional 2-3-min 'impact snack' on ride days (BONE_LOW_IMPACT)?

### Lap swimming for fitness (incl. masters-style workouts) (`lap_swim`)

2 gym days + swims. Pull bias (pull >= 1.5 x push), external rotation and scapular work with DB / cable, floor Y/T raises and KB face pulls - never bands, although most swim studies use them (masters swimmers report a lot of shoulder pain - G21). Legs and ballistic jumps for push-offs and bone.

- **Injury hotspots -> prehab codes:** SHOULDER_SWIMMER_PADDLER, BONE_LOW_IMPACT, NECK, PAIN_GENERAL (rules in the JSON `injury_prehab`; never bands).
- **Resistance goal:** strength (then power (push-off, pull)). **Rotation:** moderate (body roll; both sides). **Contra / ipsi:** contra / ipsi as health accessories (INFERRED)
- **60+:** no Olympic lifts, no plyos, no depth jumps; landing drills (RC1 'Land') and low ankle hops stay; light medball throws and EASY-TURN footwork stay (not plyos - INFERRED); compounds and isolation lean to constrained machines (EQ-03 / EQ-04)
- **Evidence:** masters swimmers: shoulder pain in 69 % with strenuous activity, 50 % report disability; painful shoulders had less internal and external rotation [G21] | shoulder-stabilising dryland work reduces shoulder ailments in swimmers (studies mostly use bands - the coach uses DB / cable instead, EQ-01) [G21]
- **For the coach to confirm:** Lap swimmers: 2 gym days, swims count as the aerobic sessions, jumps kept for bone?

### Ski / snowboard season prep (`ski_snow_prep`)

8-12-week prep that peaks before the first trip (event date, 1-week taper), then 2 gym days at about 60 % while skiing (PROPOSED). Eccentric and isometric quads (fatigue lasts >= 24 h after a ski day - G24), lateral strength, landing control for the knee (ACL - G22), snowboarders' wrists (G23); Green intervals mimic a run down the hill.

- **Injury hotspots -> prehab codes:** ACL_LANDING_CUTTING, KNEE_DESCENT_ECCENTRIC, WRIST_HAND, PAIN_GENERAL (rules in the JSON `injury_prehab`; never bands).
- **Resistance goal:** strength (eccentric / isometric legs) (then power). **Rotation:** moderate (upper / lower body separation). **Contra / ipsi:** contralateral lunges (getting into the hip edge to edge - CAT-13 COD logic, INFERRED); ipsilateral step-ups as variety
- **60+:** no Olympic lifts, no plyos, no depth jumps; landing drills (RC1 'Land') and low ankle hops stay; light medball throws and EASY-TURN footwork stay (not plyos - INFERRED); compounds and isolation lean to constrained machines (EQ-03 / EQ-04)
- **Event date:** the first ski / snowboard trip of the season -> hardest weeks end 1 week before, then a 1-week taper (PROPOSED).
- **Evidence:** knee = about one-third of recreational alpine ski injuries; the ACL is the most often injured structure in knee injuries needing hospitalisation [G22] | snowboarders: wrist injuries about 18-22 % (vs about 5 % in skiers); patterns stable since 1999 [G23] | a day of recreational skiing leaves eccentric quadriceps and hamstring fatigue lasting >= 24 h; eccentric pre-season training is recommended [G24]
- **For the coach to confirm:** Ski prep: the first trip is the event date (taper 1 week), then 2 gym days at about 60 % while skiing?

### Surfing and stand-up paddleboarding (`surf_paddle`)

Paddling is about half of a surf session (G25): pull bias (1 : 2), shoulder external rotation and Y/T, back-extension endurance, deep-squat and hip-rotation mobility; the pop-up is trained as a plyo push-up 'stick the landing' (LIB-02) in the throw slot. SUP adds rotational and anti-rotation core (G26).

- **Injury hotspots -> prehab codes:** SHOULDER_SWIMMER_PADDLER, LOW_BACK_LOADING, NECK, BONE_LOW_IMPACT, PAIN_GENERAL (rules in the JSON `injury_prehab`; never bands).
- **Resistance goal:** strength (pulling, upper back) (then power (pop-up)). **Rotation:** high (turns, SUP strokes). **Contra / ipsi:** contralateral lunges for rotation into the hip (CAT-13 logic, INFERRED)
- **60+:** no Olympic lifts, no plyos, no depth jumps; landing drills (RC1 'Land') and low ankle hops stay; light medball throws and EASY-TURN footwork stay (not plyos - INFERRED); compounds and isolation lean to constrained machines (EQ-03 / EQ-04)
- **Evidence:** surfing time: paddling ~50 %, stationary ~35-40 %, wave riding ~4-5 %, sprint paddling ~2 %; heart rate 75-85 % of arm-paddling peak [G25] | overuse injuries in the shoulder, low back and neck are linked to repetitive paddling [G25] | stand-up paddleboarding activates the trunk enough to strengthen the rectus abdominis and erector spinae at moderate effort [G26]
- **For the coach to confirm:** Surf / SUP: pull : push about 2 : 1 and a plyo push-up 'pop-up' in the throw slot?

### Dance and group fitness classes (Zumba, dance cardio, step) (`dance_fitness`)

Classes are the aerobic work (one session per class, by colour - PROPOSED). The gym adds strength, single-leg landing control (knees are the most injured site in Zumba - G27), calves / ankles and shoulders, plus a light power and agility piece. New high-intensity classes are eased into.

- **Injury hotspots -> prehab codes:** ACL_LANDING_CUTTING, PATELLAR_TENDON, ANKLE_SPRAIN, ACHILLES_CALF, NEW_CLASS_EASE_IN, PAIN_GENERAL (rules in the JSON `injury_prehab`; never bands).
- **Resistance goal:** strength (then hypertrophy). **Rotation:** moderate (turns, pivots). **Contra / ipsi:** contra / ipsi variety (INFERRED)
- **60+:** no Olympic lifts, no plyos, no depth jumps; landing drills (RC1 'Land') and low ankle hops stay; light medball throws and EASY-TURN footwork stay (not plyos - INFERRED); compounds and isolation lean to constrained machines (EQ-03 / EQ-04)
- **Evidence:** Zumba participants: 29 % reported an injury; knees 42 %, ankles 14 %, shoulders 14 %; participants took about 3 classes a week [G27] | instructors had about 7 x the injury odds of participants (5.7 vs 3.9 injuries / 1000 h), linked to their higher weekly volume [G27]
- **For the coach to confirm:** Classes count as the aerobic sessions (one per class, by colour)?

### Athletic Performance - Non-Competitive (weekend warrior; formerly 'Justice League') (`weekend_warrior`)

The coach's own non-competitive athletic program, renamed 'Athletic Performance - Non-Competitive' (FIX-03). Athletic budget unchanged from 04 v1 (PLYO 10 / JLK 2 / BALL 4 / THROW 8 / COD 8 / TE 8); the resistance block follows the 05 v1.1 4-day template (R2-SES-05). This is also the 'A bit of everything' activity and the fallback for any recreational activity without its own profile. Replaces the 04 entry with the same id at the merge.

- **Injury hotspots -> prehab codes:** ANKLE_SPRAIN, ACHILLES_CALF, HAMSTRING, ACL_LANDING_CUTTING, PAIN_GENERAL (rules in the JSON `injury_prehab`; never bands).
- **Resistance goal:** strength (then hypertrophy). **Rotation:** moderate. **Contra / ipsi:** cross-pattern pairing (UNI-06); contra / ipsi variety (04)
- **60+:** no Olympic lifts, no plyos, no depth jumps; landing drills (RC1 'Land') and low ankle hops stay; light medball throws and EASY-TURN footwork stay (not plyos - INFERRED); compounds and isolation lean to constrained machines (EQ-03 / EQ-04)
- **Event date:** any event the user names (a race, a tournament, a trip) -> hardest weeks end 1 week before, then a 1-week taper (PROPOSED).

### Active aging 50-59 (stay athletic) (`active_aging_50plus`)

The coach's older-client rules start at 60 (R2-ATH-08), so 50-59 keeps the adult athletic plan with tendon (Achilles ruptures rise most in 40-59 - G31), landing and bone emphases and machines welcome (EQ-04).

- **Injury hotspots -> prehab codes:** ACHILLES_CALF, ANKLE_SPRAIN, PATELLAR_TENDON, LOW_BACK_LOADING, PAIN_GENERAL (rules in the JSON `injury_prehab`; never bands).
- **Resistance goal:** strength (then power). **Rotation:** moderate. **Contra / ipsi:** cross-pattern pairing (UNI-06); contra / ipsi variety
- **60+:** at 60 the active_aging_60plus rules switch on automatically from the age field (generator_spec F02 / F11r.age_rules)
- **Event date:** any event the user names -> hardest weeks end 1 week before, then a 1-week taper (PROPOSED).
- **Evidence:** Achilles ruptures: incidence highest at 30-39, the largest rise in 40-59-year-olds; most happen in sport, ball games above all [G31] | impact loading of about 50 jumps a session, several days a week, helps bone in people without osteoporosis (ESSA) [G30] | adults: 150-300 min of moderate aerobic activity and muscle strengthening on 2+ days a week [G29]
- **For the coach to confirm:** 50-59: keep the full adult athletic plan (jumps, Olympic lifts) with extra calf / landing care?

### Active aging 60+ (stay athletic, older-adult rules) (`active_aging_60plus`)

This IS the R2-ATH-08 default: no Olympic lifts, plyos or depth jumps; landing drills and low ankle hops stay (05 v1.1). 'Athletic' work = light medball throws, reactive stepping, fast-concentric machine work at 40-60 % of 1RM (G28) and balance every session (G29). The opt-in shows the coach's warning; depth jumps and snatch variants stay off even then (EQ-03 - open question GP-4). Planned steps <= 3 %; tests submaximal only.

- **Injury hotspots -> prehab codes:** FALLS_BONE_DENSITY, DECONDITIONED_JOINTS, ACHILLES_CALF, WRIST_HAND, PAIN_GENERAL (rules in the JSON `injury_prehab`; never bands).
- **Resistance goal:** strength (then power (fast concentric)). **Rotation:** low-moderate. **Contra / ipsi:** cross-pattern pairing, less soreness (UNI-06); contralateral lunges as the default variant (04 general population)
- **60+:** this profile IS the 60+ default (COACH-R2 ATH-08)
- **Event date:** any event the user names -> hardest weeks end 1 week before, then a 1-week taper (PROPOSED).
- **Evidence:** NSCA: resistance training 2-3 days a week; progress loads from < 51 % to 51-69 % and, for some, 70-85 % of 1RM; power exercises at 40-60 % of 1RM moved explosively improve daily function [G28] | older adults: multicomponent activity (balance + aerobic + muscle strengthening) on most weeks; muscle strengthening 2+ days [G29] | seniors' pickleball injuries: 66.9 % slip / trip / fall, fractures 30.4 %, wrist the most common site [G3] | impact exercise for bone: moderate impact only with osteoporosis or a fragility fracture (ESSA) [G30]
- **For the coach to confirm:** 60+ default keeps landing drills, low ankle hops, light medball throws and reactive stepping - is that right, or should throws also be opt-in? / 60+ opt-in: may depth jumps ever be switched on? (round 1 EQ-03 says never; round 2 ATH-08 lists them with the optional items)

### Youth general athletic development (non-competitive kids and teens) (`youth_general_athletic`)

Kids and teens who are not training for a competitive sport (ATH-13 'youth can be there too, and kids'): every athletic pattern at foundational levels, landing competency first, light loads, games-based fitness, floor Olympic lifts from about 14 after a hang block (R2-ATH-08), growth-spurt reductions (04 youth). Organised sport hours per week no more than the child's age and 2+ days off (G34).

- **Injury hotspots -> prehab codes:** GROWTH_APOPHYSIS, ACL_LANDING_CUTTING, BONE_STRESS, ANKLE_SPRAIN, PAIN_GENERAL (rules in the JSON `injury_prehab`; never bands).
- **Resistance goal:** strength (movement competency) (then power). **Rotation:** moderate. **Contra / ipsi:** both, light (04 youth)
- **60+:** not applicable
- **Evidence:** NSCA long-term athletic development: develop athleticism over time for health, fitness and performance with lower injury risk [G33] | no more organised sport hours per week than the child's age; >= 2 days off a week; avoid one sport > 8 months a year [G34] | two plyo sessions a week are enough at low training age; 3-4 once competent (Lloyd & Oliver, 04 youth)
- **For the coach to confirm:** Youth (non-competitive): 3 short sessions with all athletic patterns, floor Olympic lifts from about 14?

## 4. Consistency with the coach's existing numbers

| Already in 04 | Reused here | Changed |
|---|---|---|
| tennis: class 3 / 50 %, ATH-05 high medball, CAT-13 contralateral, UNI-02 80-90 % unilateral, push : pull 1 : 1.8, aerobic 3 | all reused in `rec_tennis` (and as the model for pickleball / padel) | recreational dose; bilateral 30/70 -> 20/80 instead of 20/80 -> 10/90 (no season, general strength - PROPOSED) |
| golf: class 5 / 25 %, into / out-of-hip matrix, 30/70 -> 20/80, transverse core 55 %, push : pull 1 : 2.25 | all reused in `rec_golf` | + one light footwork station a week (PROPOSED) |
| weekend warrior: athletic budget PLYO 10 / JLK 2 / BALL 4 / THROW 8 / COD 8 / TE 8, 50/50 -> 40/60, aerobic 3 | unchanged | resistance re-based on the 05 v1.1 4-day template (R2-SES-05); Olympic 4x/week (R2-ATH-04); 60+ defaults; play / event rules |
| distance runner: class 1 / 75 %, 20/80, ipsilateral step-ups, STRENGTH reps, calves / abductors / hamstrings | reused in `run_fitness` | 2 gym days + 3 runs for beginners; Couch-to-5K start (SCIENCE) |
| youth athlete: class 3, foundational lists, circa-PHV multipliers, games and relays | reused in `youth_general_athletic` | non-competitive dose; floor Olympic lifts from ~14 after a hang block (R2-ATH-08) |
| general population / older: EQ-03 never-list, EQ-04 machines, few plyos unless asked | reused in `active_aging_60plus` | R2-ATH-08 default + opt-in warning; NSCA power at 40-60 % (SCIENCE) |

Sibling files written in this run: competitive pickleball, padel, HYROX, tennis and golf (`combat-strength-fitness.json`) use the same classes as here (3 / 50 % for racket sports and HYROX, 5 / 25 % for golf; HYROX 4 aerobic sessions). Swimming, cycling and alpine skiing (`aquatic-endurance-track.json`) are class 4 / 40 %; `lap_swim`, `cycling_fitness` and `ski_snow_prep` follow them. That file also has `rec_swimming`, `rec_cycling` and `rec_ski_snowboard` at the weekend-warrior 50 % - duplicates to resolve at the merge (GP-11).

Recreational team sports (basketball, soccer, softball, flag football, volleyball, hockey, ultimate) are NOT duplicated here: they live in `team.json` and are reached through `rec_league`.

## 5. Round-2 rules applied in every profile

- Stairway: gradual weekly steps, smaller early, slightly bigger after halfway, hardest weeks last; 'start at a 2, end at an 11' = perceived effort / overall load (R2-PER-03/04/05).
- No deload or maintenance week inside a block; cancel -> maintenance (length chosen, extendable, then keep maintaining / change plan / new block) -> new block (R2-VOL-07, R2-PER-06).
- No check-in = no change: the plan follows its planned stairway (R2-VOL-03). The check-in decides the step from effort, completion and pain only - the coach rejected sleep / stress / job inputs (R2-GEN-04), which removes the 'life' column of the approved R2-VOL-01 table. Effort 10 = 'the max I could do, but successful' (R2-VOL-02).
- Floor of 10 sets per muscle; small muscles grow by the same idea; caps customizable (R2-VOL-04/06) - enforced by the volume engine; the profiles flag where the template sits below 10 (`derived.muscles_below_floor_10_at_mid_block`).
- Glute credits: compounds 0.25, hip thrusts / bridges 1.0, KB swings 0 (ballistic only), thrusters 1.0 / 0.5 / 0.25 (R2-VOL-05).
- Two axial days (heavy squat, heavy deadlift), non-axial hinge / leg press / belt squat on the other days (R2-SES-01/02).
- Core opens light (2 x 2), core supersets / monster sets optional anywhere (R2-SES-03); field cap 12 + 2 core (R2-SES-04); 2-4 exercises per muscle on full-body days (R2-SES-05); cardio count adjustable (R2-SES-06).
- Plyo : ballistic share by ground-contact class, ballistic vs plyometric lists, Receive-Create stages and timing, Olympic lifts up to 4x/week (cleans = squat days, snatches = hinge days), squat cleans / snatches 3-5 reps, older 60+ defaults, youth floor lifts from ~14 (R2-ATH-01..05, 08).
- Library: only library exercises, one-detail variations between blocks (R2-LIB-01); KB face pulls = shoulder work (R2-LIB-04); R2-LIB-07 additions used (hang clean, single-arm DB snatch, KB squat clean, hex-bar jump, seated machine shoulder press, floor Y/T raises, table rows); no 21.6-mile run (R2-LIB-06).
- Tests before / at the end only; no 1RM or max mile from zero (R2-PER-07). Weight by RIR / RPE; Olympic lifts as power output (R2-GEN-06). Spanish names neutral LatAm with English gym words (R2-GEN-08, PROPOSED).
- R2-VOL-08 (not understood by the coach): default kept - a new set alternates between the two weekly exposures of a day type; a bonus exercise goes on the optional day (05 / 12 v1.1).

## 6. New injury codes

- **FALLS_COURT** (recreational pickleball, padel, recreational tennis (older players)): teach the drop-step 'turn and run' for lobs as a COD drill (EASY TURN -> MOD. TURN, ATH-06); fast backpedalling is not trained as a default drill (INFERRED from the fall mechanism) / deceleration and stick-the-landing work = Receive-Create stage 1 'Land' before any rebound (COACH-R2 ATH-03; CAT-10) / single-leg balance and reactive stepping in the warm-up or core block every session; lateral hip strength (side lunges, lateral step-ups - UNI-12) / wrist / forearm strength (ISO_GRIP) 2x/week - wrist fractures dominate senior falls (G3) / 60+: constrained machines for the big lifts (EQ-03 / EQ-04); no plyos except landing drills and low ankle hops unless switched on with the warning (COACH-R2 ATH-08) - *SCIENCE G3 (seniors >= 60: slip / trip / fall / dive = 66.9 % of pickleball injuries; fractures 30.4 %; wrist and lower leg the most common sites) for the hotspot; rules INFERRED from 04 FALLS_BONE_DENSITY / ACL_LANDING_CUTTING and COACH-R2 ATH-02/03* **Merge:** related to FALL_UPPER_LIMB in sports/aquatic-endurance-track.json (wrist / forearm rule shared); FALLS_COURT adds the court-specific fall mechanism.
- **SHOULDER_SWIMMER_PADDLER** (lap swimming, surfing, stand-up paddleboarding): pull sets >= 1.5 x push sets; rows before pulldowns (ORD-01); rear delts get their own sets (VOL-17) / external-rotation and scapular work with DB or cable (side-lying DB external rotation, cable external rotation), floor Y/T raises (COACH-R2 LIB-07 addition) and KB face pulls as shoulder work on pull or shoulder days (COACH-R2 LIB-04, LIB-10) - never bands (EQ-01), even though most swim dryland studies use them / overhead pressing with DB / landmine / seated machine press (R2-LIB-07) and pain-free range; no behind-the-neck pressing (INFERRED) / thoracic extension mobility in the warm-up; back extensions on the non-axial hinge day for prone-paddling endurance (R2-SES-01/02) / breaststroke swimmers: adductor and medial-knee care (Copenhagen-style side planks, lateral lunges) - INFERRED / pain moves the pattern to machines / neutral grips or drops it (VOL-03) - *SCIENCE G21 (masters swimmers: shoulder pain 69 % with strenuous activity, 50 % disability, less internal and external rotation) and G25 (surf: paddling ~50 % of the time; shoulder, low back and neck overuse) for the hotspot; rules INFERRED from 04 SHOULDER_* rules, COACH-ANSWER VOL-17, EQ-01, COACH-R2 LIB-04 / LIB-07* **Merge:** same rules as SHOULDER_SWIMMER in sports/aquatic-endurance-track.json, extended to surf / SUP paddlers - merge into one code.
- **KNEE_DESCENT_ECCENTRIC** (hiking, rucking, skiing / snowboarding, trail running): slow-eccentric knee-dominant work 2x/week: step-downs from a low box, split squats with a 3-s lowering, leg extensions with slow eccentrics (ISO_QUAD) / isometric quad holds (static squat / wall-sit holds 30-60 s) in the knee-dominant block for skiers (INFERRED) / progress downhill / ruck load gradually: start ~10 % of body weight, add about 5 % of body weight every 2-4 weeks, stay under ~30 % (practitioner consensus, G16) - one step at a time with the plan's stairway / trekking poles on long descents (G17, mixed evidence - user choice) - *SCIENCE G24 (recreational skiing leaves eccentric quadriceps and hamstring fatigue lasting >= 24 h) and G16 (load carriage: build eccentric strength, avoid spikes in volume) for the hotspot; rules INFERRED*
- **RUNNING_OVERUSE** (running for fitness, run clubs, HYROX (8 km of running)): run / walk start for beginners (NHS Couch to 5K pattern: 3 runs a week, rest day between - G14) / weekly running minutes climb the plan's stairway - small steps early, slightly bigger after halfway, never a big jump (COACH-R2 PER-03/04 logic applied to run time; ~10 %/week ceiling INFERRED) / heavy slow strength 2x/week (quads, hips, calves) and bent-knee soleus raises (ISO_CALF) - strength and plyometric training improve running economy (G15) / low-amplitude plyometrics first (pogo, ankle hops), then hops and bounds through the Receive-Create stages (COACH-R2 ATH-02/03) / hip abductor work (side-lying / cable abduction, lateral step-ups) every week - *SCIENCE G13 (novice runners 17.8 injuries per 1000 h vs 7.7 for recreational runners; knee and lower leg most affected) for the hotspot; rules from 04 ACHILLES_CALF / BONE_STRESS + INFERRED* **Merge:** overlaps PATELLOFEMORAL_ITB in sports/aquatic-endurance-track.json (knee part); keep both or merge.
- **CYCLING_POSTURE** (cycling, indoor cycling, mountain biking): rows >= presses, rear delts and KB face pulls every week (VOL-17, R2-LIB-04); thoracic extension mobility in the warm-up / back extensions / reverse hyper on the non-axial hinge day (R2-SES-01/02); core anti-flexion holds / hip-flexor length and glute work (hip thrust on the non-axial day) to balance the flexed riding position / anterior knee pain: slow quad work and isometrics (ISO_QUAD) and a bike-fit check with a professional (saddle height) - INFERRED / hands / wrists: grip and forearm work (ISO_GRIP); no extra loaded wrist extension if numbness is reported - *SCIENCE G19 (recreational cyclists: 85 % report an overuse injury; neck 48.8 %, knees 41.7 %, groin / buttocks 36.1 %, hands 31.1 %, back 30.3 %) for the hotspot; rules INFERRED*
- **BONE_LOW_IMPACT** (cycling, lap swimming, surf / paddle (non-weight-bearing)): keep the plan's jump and landing work (ballistic box / squat jumps, ankle hops, stick-the-landing) - for these activities it is also bone loading (PROPOSED) / heavy compound strength 2x/week (squat or leg press, deadlift or hinge) - floor of 10 sets per muscle (COACH-R2 VOL-04/06) / PROPOSED for coach approval: an optional 2-3-minute 'impact snack' (ankle hops / jump rope) on ride or swim days for users under 60 without osteoporosis or a fracture history / 60+ or osteoporosis / fracture history: moderate impact only (landing drills, low ankle hops - COACH-R2 ATH-08 default) + progressive resistance (G30) - *SCIENCE G18 (road cyclists show low bone density, two-thirds of professional and masters road cyclists osteopenic in some samples; strength training may help) and G30 (ESSA: about 50 impacts per session, 4-7 days a week, for bone); rule PROPOSED* **Merge:** same idea as BONE_LOADING_NON_IMPACT in sports/aquatic-endurance-track.json; this file adds the optional 'impact snack' (PROPOSED) - merge into one code.
- **NEW_CLASS_EASE_IN** (indoor cycling classes, dance cardio / HIIT classes, HYROX classes): the first 2-3 classes are done at an easy-to-moderate effort (about 5-6 out of 10), seated, with low resistance, and the user stops at unusual muscle pain / dark urine, severe muscle pain or weakness after a class = see a doctor (safety copy for the product, LEGAL REVIEW) / class count adds to the plan's aerobic sessions; more classes = fewer gym aerobic sessions (COACH-R2 SES-06 adjustable) - *SCIENCE G20 (exertional rhabdomyolysis case series after a FIRST spin class, often in previously fit adults); rule PROPOSED*

## 7. Open questions

- **GP-1 - Does the activity count as aerobic?** (PROPOSED - ask the coach (round 3)): Proposed: a moderate session of 45-60+ min (open-play pickleball, a padel or tennis match, walking golf, a hike, a ride, a swim, a class) replaces one of the 3 aerobic sessions, at most 2. ATH-07 fixes the count (3) but not what counts.
- **GP-2 - Floor of 10 sets per muscle on 2-day plans** (OPEN - volume engine owner): COACH-R2 VOL-04/06 ('nobody needs less than 10'). Runners, cyclists, swimmers and dance-class users are planned at 2 gym days; at 60 min the 05 2-day template leaves several muscles below 10 at mid-block (see derived.muscles_below_floor_10_at_mid_block). The engine lifts them (longer days, supersets, optional day). Alternative: treat the activity's own work as partial credit (e.g. swimming for lats). Needs a coach rule.
- **GP-3 - Recreational profiles: the activity's class or the weekend-warrior 50 %?** (OPEN - merge step): COACH-R2 ATH-01 approved weekend warriors 50 %. sports/team.json gives every rec_* team sport 50 %. This file uses the activity's own class where its contact time clearly differs (golf / hiking / surf = 25 %; swimming / cycling / ski / kickball = 40 %, matching the competitive swimming, cycling and alpine-ski classes in sports/aquatic-endurance-track.json; running = 75 %), following the coach's rule that contact time sets the share (ATH-01). The merge should pick one convention.
- **GP-4 - 60+ default: what stays** (OPEN - round 3): 05 v1.1 keeps landing drills and low ankle hops by default (the approved R2-ATH-08 proposal); the coach's added words say no plyos by default. This file keeps landing drills and low ankle hops, plus light medball throws and EASY-TURN reactive stepping (not plyos - INFERRED). Depth jumps: EQ-03 says never; R2-ATH-08's text lists them among the optional items. This file keeps them OFF even with the opt-in and never offers snatch variants (EQ-03).
- **GP-5 - HYROX numbers** (PROPOSED): HYROX is not on the coach's approved class or aerobic lists. Proposed: class 3 (50 %), 4 aerobic sessions (A + B + C + a second C, like the approved aesthetics second Orange), 2 station circuits a week as density work not counted as muscle sets, wall balls with the race ball (EQ-06 exception).
- **GP-6 - Light footwork station for golf, HYROX and hiking** (PROPOSED): The 'stay athletic' wording asks for some agility; these activities need none. Proposed: one EASY-TURN footwork station a week (2 sets).
- **GP-7 - Event date and the 1-week taper** (PROPOSED (06 v1.1 14.3 #5)): 06 v1.1 proposes an optional event date for gen pop (race, tournament, trip) with a 1-week taper at about half the sets. The coach approved the 1-2-week taper for competitive athletes (R2-PER-06), not yet for gen pop.
- **GP-8 - Bone-loading 'impact snack' for cyclists and swimmers** (PROPOSED): ESSA suggests about 50 impacts a session several days a week for bone (G30); the plan gives about 60-80 jump and hop contacts a week in the gym. Proposed: an optional 2-3-min ankle-hop / jump-rope snack on ride or swim days (under 60, no osteoporosis).
- **GP-9 - Kickball and other unresearched rec sports** (INFO): No peer-reviewed kickball data were found; hotspots and class are INFERRED from softball. HYROX injury data come from a 2026 preprint (G11).
- **GP-11 - Duplicate recreational profiles in sports/aquatic-endurance-track.json** (OPEN - merge step): That file also defines rec_swimming, rec_cycling and rec_ski_snowboard (weekend-warrior 50 % convention). The intake (generator_spec v1.1 F11r) points to lap_swim, cycling_fitness and ski_snow_prep in this file. Proposed: keep the F11r ids from this file, fold the sibling's extra injury codes (KNEE_MEDIAL_KICK, LOW_BACK_EXTENSION, FALL_UPPER_LIMB, PATELLOFEMORAL_ITB) into them, and alias SHOULDER_SWIMMER_PADDLER / BONE_LOW_IMPACT to SHOULDER_SWIMMER / BONE_LOADING_NON_IMPACT.
- **GP-10 - Spanish names** (PENDING APPROVAL): All name_es values are PROPOSED neutral Latin American Spanish with English gym words in brackets (COACH-R2 GEN-08) and need the coach's line-by-line approval; 'pickleball', 'kickball', 'HYROX' and 'flag football' stay in English (no common Spanish name).

## 8. New fields (beyond 04 and team.json)

- `name_es / sport / sport_name / sport_name_es / category / positions` (string / list): same as sports/team.json new_fields (COACH-R2 GEN-08 Spanish; COACH-ANSWER GEN-02 recreational)
- `base_profile / reuse_status / weekly_sets_delta_vs_base` (string / enum / object): same as team.json: traceability to the 04 v1 numbers
- `emphasis, power_mix_by_phase, upper_lower_emphasis, rotation_emphasis, resistance_goal, olympic_policy, medball_policy, in_season_gym, injury_prehab, age_notes, equipment, sample_week, tests, season_calendar_us, field_evidence, core.dose, sport_tag, intake_rule, ath03_evidence, aerobic_sessions_wk.*` (as in team.json): same names and meaning as sports/team.json new_fields (kept identical for the merge)
- `activity_id` (string): the generator_spec v1.1 F11r activity-picker option id that maps to this profile (age overlays say so)
- `competitive_counterpart` (string | null): the competitive profile of the same sport (04 or a sibling sports file) for the merge and for users who start competing
- `days.play_or_activity_sessions / days.week_layout_05` (string / object): how often the user plays (intake play_days) and the 05 v1.1 week layout the profile uses
- `play_adjustment` (object | null): recreational replacement for in_season_gym: spacing from play days, heavy-play weeks, which play counts as aerobic (COACH-R2 ATH-07 logic + 06 v1.1 R17 - PROPOSED)
- `event_prep` (object | null): optional event date (race, tournament, trip) -> peak and 1-week taper (06 v1.1 event_peak_genpop; generator_spec F11r.fields.event_date)
- `older_60_plus` (object | null): what the 60+ default removes / keeps for this activity and what the opt-in (W_OLDER_POWER) adds (COACH-R2 ATH-08)
- `stay_athletic_dial` (object 0-3): power / agility / core / resistance / aerobic summary of the 'stay athletic' mix (PROPOSED)
- `participation_us` (object | null): US participation data where found (SFIA / USPA), cited
- `aerobic_sessions_wk.activity_counts_as_aerobic` (string): which activity sessions replace gym aerobic sessions (PROPOSED)
- `derived.share_pct / shoulder_group_sets / muscles_below_floor_10_at_mid_block / est_minutes_per_main_day_block_start / est_minutes_per_main_day_mid_block / minutes_note` (computed): the 'how much' check against the floor of 10 (COACH-R2 VOL-04/06) and the session length (UNI-09, R2-SES-05)
- `ground_contact.activity_reading` (string): why this activity sits in its ground-contact class
- `league_sport_profiles (rec_league only)` (object): router from F11r league_sport to the recreational sport profiles in team.json / this file
- `merge_action (weekend_warrior only)` (string): this file's weekend_warrior replaces the 04 v1 entry with the same id
- `season_overrides.maintenance / no_mid_block_deload / ski_season / circa_PHV` (string / object): COACH-R2 PER-06 / VOL-07 for recreational users; seasonal activity holds

## 9. Sources

- **G1** 24.3 million US pickleball players in 2025; strong engagement 25-44 and 65+ (SFIA) - https://sfia.org/research/u-s-pickleball-participation/
- **G2** SFIA 2026 topline: 24.3 M pickleball players, 16.8 M casual, 7.48 M core; +171.8 % in 3 years - https://thekitchenpickle.com/blogs/news/24-3-million-americans-played-pickleball-in-2025-sfia-report-says/
- **G2b** SFIA 2024 pickleball report (2023 data): 25-34 = 16.7 %, 65+ = 15.4 % (second-largest bracket) - https://www.pickleheads.com/guides/pickleball-statistics
- **G3** Weiss, Dougherty, DiMaggio 2021 (Injury Epidemiology): senior (>= 60) pickleball and tennis injuries in US EDs 2010-2019 - strains / sprains 31.0 %, fractures 30.4 %, slip / trip / fall 66.9 %, wrist and lower leg most common - https://pmc.ncbi.nlm.nih.gov/articles/PMC8091689
- **G4** ACE-sponsored study (Dalleck et al.): pickleball in 40-85-year-olds ~70 % of predicted max HR; 6 weeks improved VO2max, BP, lipids - https://www.acefitness.org/continuing-education/certified/august-2018/7053/ace-sponsored-research-can-pickleball-help-middle-aged-and-older-adults-get-fit/
- **G5** Padel injuries systematic review (BMJ Open SEM 2023): 3 / 1000 h training, 8 / 1000 matches; elbow most common, then knee, shoulder, low back - https://pmc.ncbi.nlm.nih.gov/articles/PMC10277135/
- **G6** Padel match-play activity profile systematic review (Kinesiology): HR 70-80 % max, rallies mostly 3-15 s, work : rest ~0.84 - https://ojs.srce.hr/kinesiology/article/view/9871
- **G7** USPA / SFIA 2026: 1.07 million US padel players in 2025; ~1,000 courts (April 2026) - https://padelusa.org/padel-surpasses-one-million-players-in-the-united-states/
- **G8** HYROX race format and Open-division weights (official) - https://hyrox.com/the-fitness-race/
- **G9** Brandt, Ebel, Lebahn, Schmidt 2025 (Front Physiol): HYROX ~86.5 min at ~79.5 % HRmax; VO2max, body fat and endurance volume predict time; grip and resistance volume do not - https://www.frontiersin.org/journals/physiology/articles/10.3389/fphys.2025.1519240/full
- **G10** Davids CJ 2026, Strength Cond J 48(1):88-100: HYROX performance review (as cited in 06 v1.1 SCI_HYROX) - (no URL - cited in 06 v1.1)
- **G11** Injury epidemiology in HYROX athletes - international cross-sectional survey (preprint 2026): 49.8 % injured, knee 20.8 %, more HYROX-specific sessions = more injuries (OR 1.61) - https://sciety.org/articles/activity/10.64898/2026.08.09.26359590
- **G12** WAKA adult kickball: 4-16 coed teams, 8 regular-season games + tournament, ~10-week seasons, one night a week - https://patch.com/virginia/reston/playing-for-kicks-2
- **G13** Videbaek et al. 2015 (Sports Med): novice runners 17.8 vs recreational 7.7 injuries per 1000 h - https://pmc.ncbi.nlm.nih.gov/articles/PMC4473093/
- **G14** NHS Couch to 5K: 9 weeks, 3 runs a week, run / walk progression - https://www.nhs.uk/better-health/get-active/get-running-with-couch-to-5k/couch-to-5k-running-plan/
- **G15** Strength training (high-load, plyometric, combined) and running economy in middle- and long-distance runners: systematic review with meta-analysis (Sports Med) - https://repository.essex.ac.uk/37272/1/s40279-023-01978-y.pdf
- **G16** Load carriage: NSCA TSAC report 80 (loaded marching) and HPRC load-carriage strategies (start ~10 % BW, build eccentric strength, avoid spikes) - https://www.nsca.com/globalassets/education/articles/tsac/tsac-80/tsac-report-80_biomechanical-effects-of-loaded-marching.pdf
- **G16b** HPRC load-carriage strategies - https://www.hprc-online.org/articles/load-carriage-strategies
- **G17** Epidemiology of ankle sprain during hiking in uniformed groups (prevalence 9.15 %, downhill / scree; risk factors) - https://www.bisp-surf.de/Record/ftdoajarticles:oai:doaj.org%2Farticle:81d5a8dd7c2a423cb4b75c924e7afc74
- **G18** Olmedillas et al. 2012 (BMC Med): cycling and bone health systematic review - low BMD in road cyclists - https://pmc.ncbi.nlm.nih.gov/articles/PMC3554602/
- **G19** Wilber et al. 1995 (Int J Sports Med): overuse injuries in recreational cyclists - neck 48.8 %, knees 41.7 % - https://pubmed.ncbi.nlm.nih.gov/7649713/
- **G20** Spin-related exertional rhabdomyolysis case series (after a first class) - https://pmc.ncbi.nlm.nih.gov/articles/PMC8276198/
- **G21** Thomas et al. 2021 (J Athl Train): masters swimmers - shoulder pain 69 % with strenuous activity, 50 % disability, less IR / ER - https://nata.kglmeridian.com/view/journals/attr/56/12/article-p1313.xml
- **G22** Recreational alpine skiing: the ACL is predominantly injured in knee injuries needing hospitalisation; knee ~1/3 of injuries - https://pmc.ncbi.nlm.nih.gov/articles/PMC8126542/
- **G23** Injury trends in alpine skiing and snowboarding 2008-09 to 2017-18 (snowboard wrist ~22 % vs ski ~5 %) - https://pubmed.ncbi.nlm.nih.gov/33384220/
- **G24** Recreational skiing causes prolonged eccentric quadriceps / hamstring fatigue (Front Physiol 2018) - https://www.frontiersin.org/journals/physiology/articles/10.3389/fphys.2018.01687/full
- **G25** Mendez-Villanueva & Bishop 2005 (Sports Med): physiology of surfing - paddling ~50 %, stationary ~40 %, riding 4-5 %; paddling overuse (shoulder, low back, neck) - https://pubmed.ncbi.nlm.nih.gov/15651913/
- **G25b** Time-motion analysis of a 2-hour surfing training session - https://ro.ecu.edu.au/ecuworkspost2013/1703
- **G26** ACE-sponsored research: stand-up paddleboarding core activation and energy cost - https://www.acefitness.org/continuing-education/prosource/august-2016/5997/ace-sponsored-research-can-stand-up-paddleboarding-stand-up-to-scrutiny/
- **G27** Inouye et al. 2013 (Hawaii J Med Public Health): Zumba injuries 29 %; knees 42 %, ankles 14 %, shoulders 14 % - https://pmc.ncbi.nlm.nih.gov/articles/PMC3872921/
- **G27b** Injury surveillance of female adult Zumba dancers: instructors 5.7 vs participants 3.9 injuries / 1000 h - https://pureportal.coventry.ac.uk/en/publications/injury-surveillance-of-female-adult-zumba-dancers-2/
- **G28** Fragala et al. 2019, NSCA position statement: resistance training for older adults (2-3 d/wk; power at 40-60 % 1RM) - https://pubmed.ncbi.nlm.nih.gov/31343601/
- **G29** Physical Activity Guidelines for Americans, 2nd ed.: 150-300 min moderate; muscle strengthening 2+ days; multicomponent with balance for older adults - https://health.gov/sites/default/files/2019-10/PAG_ExecutiveSummary.pdf
- **G30** Beck et al. 2017, ESSA position statement on exercise for osteoporosis (~50 impacts / session, 4-7 d/wk; moderate impact with osteoporosis / fractures) - https://ro.ecu.edu.au/ecuworkspost2013/2797
- **G31** Incidence of Achilles tendon rupture (Acta Orthop): highest 30-39, largest rise 40-59; most in ball games - https://actaorthop.org/actao/article/view/21019
- **G32** Tennis leg (medial gastrocnemius strain) in middle-aged recreational players - https://radiopaedia.org/articles/tennis-leg
- **G33** Lloyd et al. 2016, NSCA position statement on long-term athletic development - https://nsca.com/education/articles/nsca-position-statement-on-long-term-athletic-development
- **G34** NATA youth sport specialization recommendations (>= 2 days off, <= 8 months one sport) and the AAP 'hours per week <= age' guide - https://www.nata.org/sites/default/files/youth_sports_specialization_recommendations.pdf
- **G34b** AAP hours-per-week guide summarised by Johns Hopkins Medicine - https://www.hopkinsmedicine.org/health/conditions-and-diseases/sports-injuries/youth-sport-specialization
- **G35** Golf-related low back pain review: 18-54 % of golf ailments; amateurs 15-34 %; risk factors - https://brieflands.com/articles/asjsm-21618
- **G36** SFIA 2025 topline: 247.1 M active Americans; running / jogging > 50 M; day hiking growing - https://sfia.org/resources/sfias-topline-participation-report-shows-247-1-million-americans-were-active-in-20
- **G37** Practitioner analysis: running ~45-55 % of HYROX race time - https://www.fasttalklabs.com/training/performance-determinants-of-hyrox-competition/
- **S32** Fast SSC < ~250 ms vs slow SSC > ~250 ms (Flanagan & Comyns 2008; reused from 04) - https://pure.ul.ie/en/publications/the-use-of-contact-time-and-the-reactive-strength-index-to-optimi
