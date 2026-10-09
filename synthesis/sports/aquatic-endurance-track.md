# Sport profiles - swimming, aquatic, endurance and track (v1)

Companion to `aquatic-endurance-track.json` (same folder). Written 2026-10-08 after the coach asked for every popular US sport, **including swimming** (also the first sample plan he will grade - COACH-R2 GEN-07). Authority: coach round-2 answers > round-1 answers > everything else. Evidence labels: OBSERVED / COACH-ANSWER <ID> / COACH-R2 <ID> / INFERRED / SCIENCE / PROPOSED. No Google Sheet was read or changed.

How to read: every profile keeps the 04 schema (`weekly_sets` = off-season build week, mid-block, in working sets; athletic work in contacts / throws / metres). New fields are listed in section 14 and in the JSON `new_fields`. Numbers the coach already approved are reused, not re-invented: sprinters 75 % plyometric and 2 aerobic sessions, weekend warriors 50 %, pre-season 2 aerobic sessions (R2-ATH-01 / 06), 2 lifting days and 2 aerobic sessions in season (PER-08, ATH-07). The 04 profiles `track_sprinter`, `track_jumper` and `distance_runner` are carried over unchanged; the 04 variants `track_400` and `track_thrower` are built out.

## 1. Coverage

| Sport | Profile ids | Events / positions |
|---|---|---|
| Swimming | swimming_sprint, swimming_middle, swimming_distance (+ stroke variants free / back / breast / fly / IM); rec_swimming | 50-100 / 200-400 + IM / 800-1500 + open water; age group, HS, college, masters |
| Diving | diving (+ platform variant) | 1 m / 3 m springboard, platform |
| Water polo | water_polo_field, water_polo_center, water_polo_goalkeeper | field / center (2-meter) / goalkeeper |
| Track & field | track_sprinter, track_400, track_hurdles (+ 400 H), track_jumper (+ triple), track_high_jump, track_pole_vault, track_thrower (+ hammer), track_javelin, track_middle (+ steeple) | 100-400, hurdles, LJ / TJ, HJ, PV, shot / discus / hammer, javelin, 800-1500 |
| Distance / road running | distance_runner, cross_country; rec_running | 5K-10K (track / road), half marathon (coach's Hinshaw plan), marathon; XC |
| Triathlon | triathlon; rec_triathlon | sprint / Olympic, 70.3, full |
| Cycling | cycling_endurance (+ MTB, indoor), cycling_sprint (+ BMX); rec_cycling | road, mountain, gravel, indoor, track sprint, BMX |
| Rowing | rowing (+ sweep, sculling); rec_rowing | sweep, sculling, lightweight note |
| Alpine skiing / snowboarding | ski_alpine (+ speed, snowboard race / cross), ski_freestyle; rec_ski_snowboard | SL / GS, super-G / DH, snowboard parallel / cross, moguls, slopestyle, halfpipe, big air |

30 profiles: 24 competitive, 6 recreational; 3 reused unchanged from 04, 12 04 budget + deltas, 15 new budgets.

## 2. Summary table

| id | cat | GC class -> plyo % start->end | budget plyo % | ATH-03 group | days | sets / wk | min / day | plyometric contacts | throws | Olympic tier (sets) | bil / uni mid | aerobic off / pre / in | in-season lifts | top injuries |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| swimming_sprint | comp | 4 -> 25->40 % | 41 % | speed_power | 3+1 | 97 | 68 | 15-25 | 40-55 | T2 (6) | 55/45 | 0 / 0 / 0 | 2 | SHOULDER_SWIMMER, LOW_BACK_EXTENSION, KNEE_MEDIAL_KICK |
| swimming_middle | comp | 4 -> 25->40 % | 40 % | speed_power | 3+1 | 94 | 67 | 10-15 | 35-45 | T2 (6) | 50/50 | 0 / 0 / 0 | 2 | SHOULDER_SWIMMER, LOW_BACK_EXTENSION, KNEE_MEDIAL_KICK |
| swimming_distance | comp | 4 -> 25->40 % | 40 % | endurance | 3+1 | 73 | 54 | 5 | 25-35 | T1 (3) | 40/60 | 0 / 0 / 0 | 2 | SHOULDER_SWIMMER, LOW_BACK_EXTENSION, KNEE_MEDIAL_KICK |
| diving | comp | 4 -> 25->40 % | 42 % | speed_power | 3+1 | 99 | 67 | 30-40 | 50-70 | T1 (5) | 55/45 | 2 / 2 / 2 | 2 | SHOULDER_SWIMMER, LOW_BACK_EXTENSION, WRIST_HAND |
| water_polo_field | comp | 5 -> 20->25 % | 25 % | rotational_power | 3+1 | 96 | 68 | 10-15 | 50-70 | T2 (6) | 40/60 | 0 / 0 / 0 | 2 | SHOULDER_SWIMMER, SHOULDER_THROWER, KNEE_MEDIAL_KICK |
| water_polo_center | comp | 5 -> 20->25 % | 25 % | resistance | 3+1 | 102 | 73 | 10-15 | 50-70 | T2 (6) | 55/45 | 0 / 0 / 0 | 2 | SHOULDER_SWIMMER, SHOULDER_THROWER, KNEE_MEDIAL_KICK |
| water_polo_goalkeeper | comp | 5 -> 20->25 % | 25 % | speed_power | 3+1 | 98 | 70 | 10-15 | 25-35 | T2 (6) | 40/60 | 0 / 0 / 0 | 2 | SHOULDER_SWIMMER, SHOULDER_THROWER, KNEE_MEDIAL_KICK |
| track_sprinter | comp | 1 -> 60->75 % | 75 % | speed_power | 4+2 | 128 | 62 | 90-120 | 40-55 | T2 (10) | 35/65 | 2 / 2 / 2 | 2 | HAMSTRING, ACHILLES_CALF, HIP_FLEXOR |
| track_400 | comp | 1 -> 60->75 % | 72 % | speed_power | 4+2 | 124.5 | 61 | 75-105 | 40-55 | T2 (10) | 35/65 | 2 / 2 / 2 | 2 | HAMSTRING, ACHILLES_CALF, HIP_FLEXOR |
| track_hurdles | comp | 1 -> 60->75 % | 75 % | speed_power | 4+2 | 130 | 63 | 90-120 | 40-55 | T2 (10) | 35/65 | 2 / 2 / 2 | 2 | HAMSTRING, HIP_FLEXOR, GROIN_ADDUCTOR |
| track_jumper | comp | 1 -> 60->75 % | 79 % | speed_power | 4+2 | 130 | 62 | 125-170 | 40-55 | T2 (10) | 35/65 | 2 / 2 / 2 | 2 | HAMSTRING, ACHILLES_CALF, PATELLAR_TENDON |
| track_high_jump | comp | 2 -> 45->60 % | 61 % | speed_power | 4+2 | 123 | 60 | 85-115 | 50-70 | T2 (10) | 30/70 | 2 / 2 / 2 | 2 | PATELLAR_TENDON, ACHILLES_CALF, ANKLE_SPRAIN |
| track_pole_vault | comp | 2 -> 45->60 % | 59 % | speed_power | 4+2 | 130 | 65 | 60-85 | 50-70 | T2 (8) | 35/65 | 2 / 2 / 2 | 2 | SHOULDER_THROWER, LOW_BACK_EXTENSION, WRIST_HAND |
| track_thrower | comp | 4 -> 25->40 % | 40 % | resistance | 4+2 | 129 | 66 | 35-45 | 130-170 | T2 (10) | 65/35 | 2 / 2 / 2 | 2 | LOW_BACK_ROTATIONAL, LOW_BACK_LOADING, LEAD_HIP_GLUTE |
| track_javelin | comp | 3 -> 35->50 % | 50 % | resistance | 4+2 | 123 | 62 | 50-65 | 85-115 | T2 (8) | 50/50 | 2 / 2 / 2 | 2 | SHOULDER_THROWER, ELBOW_THROWER, LOW_BACK_ROTATIONAL |
| track_middle | comp | 1 -> 60->75 % | 78 % | endurance | 3+0 | 79 | 55 | 25-35 | 0 | T1 (3) | 20/80 | running plan / running plan / running plan | 1-2 | ACHILLES_CALF, BONE_STRESS, HAMSTRING |
| distance_runner | comp | 1 -> 60->75 % | 74 % | endurance | 3+0 | 69.5 | 50 | 15-20 | 0 | T1 (2) | 20/80 | running plan / running plan / running plan | 1-2 | ACHILLES_CALF, BONE_STRESS, HAMSTRING |
| cross_country | comp | 1 -> 60->75 % | 76 % | endurance | 3+0 | 72.5 | 51 | 15-20 | 0 | T1 (2) | 20/80 | running plan / running plan / running plan | 1-2 | ACHILLES_CALF, BONE_STRESS, ANKLE_SPRAIN |
| triathlon | comp | 1 -> 60->75 % | 73 % | endurance | 2+1 | 60 | 65 | 10-15 | 0 | T1 (2) | 30/70 | swim-bike-run plan / swim-bike-run plan / swim-bike-run plan | 1-2 | ACHILLES_CALF, BONE_STRESS, PATELLOFEMORAL_ITB |
| cycling_endurance | comp | 4 -> 25->40 % | 40 % | endurance | 3+1 | 79 | 57 | 10-15 | 35-45 | T1 (3) | 50/50 | riding plan / riding plan / riding plan | 1-2 | LOW_BACK_LOADING, PATELLOFEMORAL_ITB, NECK |
| cycling_sprint | comp | 4 -> 25->40 % | 41 % | resistance | 4+0 | 112 | 60 | 30-40 | 25-35 | T3 (12) | 65/35 | 2 / 2 / 2 | 2 | LOW_BACK_LOADING, PATELLAR_TENDON, BONE_LOADING_NON_IMPACT |
| rowing | comp | 5 -> 20->25 % | 25 % | endurance | 3+1 | 85 | 63 | 5 | 35-45 | T2 (6) | 60/40 | rowing / erg plan / rowing / erg plan / rowing / erg plan | 2 | LOW_BACK_LOADING, RIB_STRESS, LOW_BACK_ROTATIONAL |
| ski_alpine | comp | 4 -> 25->40 % | 40 % | resistance | 4+1 | 115 | 59 | 30-40 | 50-70 | T2 (8) | 35/65 | 3 / 2 / 2 | 1-2 | ACL_LANDING_CUTTING, LOW_BACK_LOADING, HAMSTRING |
| ski_freestyle | comp | 3 -> 35->50 % | 50 % | speed_power | 4+1 | 118 | 60 | 40-55 | 50-70 | T2 (8) | 40/60 | 2 / 2 / 2 | 1-2 | ACL_LANDING_CUTTING, LOW_BACK_LOADING, HAMSTRING |
| rec_swimming | recr | 3 -> 35->50 % | 50 % | health | 4+2 | 112 | 58 | 20-25 | 35-45 | T2 (8) | 45/55 | 3 / - / - | - | SHOULDER_SWIMMER, BONE_LOADING_NON_IMPACT, KNEE_MEDIAL_KICK |
| rec_running | recr | 3 -> 35->50 % | 56 % | health | 4+2 | 115 | 58 | 30-40 | 35-45 | T2 (8) | 45/55 | 3 / - / - | - | ACHILLES_CALF, PATELLOFEMORAL_ITB, BONE_STRESS |
| rec_cycling | recr | 3 -> 35->50 % | 50 % | health | 4+2 | 112 | 58 | 20-25 | 35-45 | T2 (8) | 45/55 | 3 / - / - | - | LOW_BACK_LOADING, PATELLOFEMORAL_ITB, NECK |
| rec_triathlon | recr | 3 -> 35->50 % | 53 % | health | 4+2 | 112 | 58 | 20-25 | 35-45 | T2 (8) | 45/55 | 3 / - / - | - | ACHILLES_CALF, PATELLOFEMORAL_ITB, SHOULDER_SWIMMER |
| rec_rowing | recr | 3 -> 35->50 % | 43 % | health | 4+2 | 109 | 57 | 20-25 | 35-45 | T2 (8) | 45/55 | 3 / - / - | - | LOW_BACK_LOADING, RIB_STRESS, PAIN_GENERAL |
| rec_ski_snowboard | recr | 3 -> 35->50 % | 50 % | health | 4+2 | 122 | 61 | 50-65 | 70-90 | T2 (8) | 45/55 | 3 / - / - | - | ACL_LANDING_CUTTING, FALL_UPPER_LIMB, PATELLAR_TENDON |

Plyo % = plyometric share of power work (PLYO + JLK vs BALL + THROW) by ground-contact class (COACH-R2 ATH-01); each block starts 15 points more ballistic (floor 20). 'running plan' / 'pool' = the sport practice is the aerobic work. Minutes and exercise counts use the 04 heuristics; all profiles sit at or under about 12 exercises + 2 core (COACH-R2 SES-04) except the reused 04 sprinter / jumper budgets (12.6-12.9), which follow the 04 consolidation rule.

## 3. Coach rules applied (and how the round-2 conflicts were resolved)

- **Stairway** (COACH-R2 PER-03/04/05): every block climbs in gradual steps, smaller early, a bit bigger after halfway, hardest weeks last; 'start at a 2, end at an 11' is perceived effort. No deload or maintenance week inside a block; a block that cannot be finished is cancelled -> maintenance -> new block (COACH-R2 VOL-07). Every profile carries this in `stairway`.
- **Pre-season** = 4-6 weeks at about 60 % of off-season sets, more speed and power, then a 1-2-week taper (COACH-R2 PER-06). `season_overrides.pre_season` solves the resistance factor so the week lands at about 60 %; for meet / race sports the taper is placed before the main championship (see O4).
- **In season**: about 2 lifting days, low volume (PER-08); hard day >= 48 h before a game / meet / race (COACH-R2 ATH-07 spacing); Olympic lifts as a light 2 x 3 piece on 1-2 gym days, dropped in heavy weeks (COACH-R2 ATH-04); weeks at about 40 % of off-season sets (PROPOSED).
- **Plyo : ballistic** by ground contact (COACH-R2 ATH-01), with the approved lists: ballistic = squat / box / broad / loaded / hex-bar jumps and medball throws; plyometric = pogo / ankle hops, hurdle hops, depth jumps, bounds, squirrel and repeated jumps (COACH-R2 ATH-02). Receive-Create stages RC1 Land / RC2 Land & Go / RC3 Repeat at weeks 1-3 / 4-7 / 8-12 (COACH-R2 ATH-03).
- **Olympic lifts for everyone in athletic training** (ATH-10), up to 4 exposures a week, cleans on squat days and snatches on hinge days (COACH-R2 ATH-04); full squat cleans / snatches 3-5 reps (COACH-R2 ATH-05); load by RIR / RPE, explained as power output, % only for competitive Olympic lifters (COACH-R2 GEN-06). 60+: none by default, optional with the fitness-professional warning (COACH-R2 ATH-08); youth floor lifts from about 14 after a hang block.
- **Session order and caps**: core first, light, 2 exercises x 2 sets (ATH-11, COACH-R2 SES-03), movable, supersets / monster sets allowed anywhere; heavy squat and heavy deadlift on two different days with non-axial hinge / leg press / belt squat on the others (COACH-R2 SES-01/02); 2-4 exercises per muscle trained that day on full-body days (COACH-R2 SES-05); field / athletic cap 12 + 2 core (COACH-R2 SES-04); calves 3 sets every leg day, rear delts own sets (VOL-17).
- **Aerobic sessions**: user-adjustable up or down (COACH-R2 SES-06). Where the sport practice is the aerobic work (pool, runs, rides, ergs) the gym adds 0 colour sessions by default (04 distance-runner rule, O9).
- **Tests** only before / at the start and in the last week, never mid-block; untrained people never test a 1RM or a max mile / time trial from zero - 5RM / 3RM or 80-90 % efforts (COACH-R2 PER-07).
- **No lifestyle inputs** (COACH-R2 GEN-04): no sleep, stress, job or 'pool yardage' questions. **No check-in = no change** (COACH-R2 VOL-03): the plan follows its planned stairway; with a check-in the approved step table uses effort, completion and pain only (COACH-R2 VOL-01, life question removed). Flag: this is why the swim profiles do NOT auto-adjust dryland to pool load (O5).
- **Muscle counting**: athletic sets credit no muscle (VOL-10); compounds credit glutes 0.25, KB swings never count as glute volume (COACH-R2 VOL-05). The floor of 10 sets per muscle (COACH-R2 VOL-04/06) is audited per profile in `derived.muscles_below_floor_10` and left OPEN for non-sport muscles of athletes (O1); rear-delt own sets 4 / 6 vs the floor is O2.
- **No bands** anywhere (EQ-01 / EQ-12). Swim dryland traditionally relies on bands; every shoulder rule here uses DB, cable, KB, machine, plates or bodyweight (side-lying DB ER, prone floor Y / T raises - R2-LIB-07, KB face pulls as shoulder work - R2-LIB-04 / LIB-10).
- **Library**: library exercises first; small one-detail variations between blocks only (COACH-R2 LIB-01); new library items used here: belt squat, seated machine shoulder press, hang clean, single-arm DB snatch, KB squat clean, hex-bar jump, floor Y / T raises (COACH-R2 LIB-07). The 21.6-mile run is gone (COACH-R2 LIB-06).

## 4. Swimming in depth

### 4.1 Why swim dryland is different

- The pool is the sport **and** the aerobic work: elite swimmers cover about 40-70 km a week, 14-19-year-olds about 6 x 2 h (AQ12). Dryland is added on top, so it stays 45-75 min on 3 days and never chases soreness (INFERRED). Gym aerobic colour sessions: **0 by default**, adjustable (COACH-R2 SES-06).
- What dryland is for: (1) start and turn power - 15 m start time correlates with jump peak power r = -0.85 in international sprinters (AQ6), and strength at 85-100 % 1RM plus plyometrics improve turns (AQ5); (2) stroke force (lats, upper back, triceps); (3) **shoulder health** - the shoulder is 35-37 % of NCAA swim injuries and 40-91 % prevalence overall (AQ3); (4) **bone loading** - swimming is not osteogenic, jumping programmes help (AQ8).
- Ground contact: the only 'contacts' are the block (about 0.70-0.77 s on the block - AQ1) and the wall push-off (about 0.3 s - AQ2): slow stretch-shortening, so swimmers sit in **class 4 = 40 % plyometric** (PROPOSED, O3) and get mostly ballistic jumps (box / squat / broad / hex-bar) plus a small pogo block for bone.

### 4.2 Event groups

| Event group | sets / wk | min / day | goal | split % | Olympic exposures | pull : push sets | bil / uni start -> end | group |
|---|---|---|---|---|---|---|---|---|
| Swimming - sprint (50-100) | 97 | 68 | strength / power | {hypertrophy: 15, strength: 45, power: 40} | 3 | 13 : 6 | 50/50 -> 60/40 | speed_power |
| Swimming - middle distance (200-400 / IM) | 94 | 67 | strength / power | {hypertrophy: 10, strength: 45, power: 30, endurance_strength: 15} | 3 | 14 : 6 | 50/50 -> 55/45 | speed_power |
| Swimming - distance (800-1500 / open water) | 73 | 54 | endurance-strength / strength | {hypertrophy: 5, strength: 35, power: 15, endurance_strength: 45} | 2 | 11 : 4 | 40/60 -> 40/60 | endurance |

Sprinters (50-100) get the longest power preparation (AQ40), bilateral-leaning legs (two-footed pushes off block and wall - 'bilateral is more for driving and creating forces', UNI-02) and 3 Olympic exposures. Middle-distance / IM swimmers keep that base at a lower dose plus one strength-endurance accessory a day. Distance and open-water swimmers get stability and endurance-strength (single-arm DB work, 12-15 reps), a small power dose and the most cuff work (AQ40).

### 4.3 Strokes (second tap in the picker)

| Stroke | set delta | adds injury codes | main rule |
|---|---|---|---|
| Freestyle (front crawl) | {} | - | base profile = freestyle; long-axis rotation -> transverse core (anti-rotation first, then rotation) and thoracic rotation mobility |
| Backstroke | {ISO_REAR: 1, BALL: 1, THROW: -1} | - | backstroke start = pulling up into the wall then a backward hip extension -> hip-thrust / back-extension power (BALL from a supine-like start is not possible: use broad jumps and hip-dominant ballistics) |
| Breaststroke | {UKD: 1, UHD: -1, FOCUS: 1} | KNEE_MEDIAL_KICK, GROIN_ADDUCTOR, LOW_BACK_EXTENSION | 73-75 % of breaststrokers report knee pain (AQ4): frontal-plane unilateral work (lateral lunge, Cossack), Copenhagen plank and hip internal-rotation range every week (KNEE_MEDIAL_KICK) |
| Butterfly | {BHD: 1, VPUSH: -1, CORE: 0} | LOW_BACK_EXTENSION | dolphin kick + simultaneous overhead recovery: highest low-back extension and shoulder load (AQ4) - anti-extension core first, non-axial hinge (back extension to neutral, reverse hyper) for trunk-extensor endurance, no loaded end-range extension |
| Individual medley (IM) | {FOCUS: 1} | KNEE_MEDIAL_KICK, LOW_BACK_EXTENSION | all four strokes: base freestyle profile + the breaststroke hip / knee block + the butterfly low-back rules |

### 4.4 Levels

- **Age group** (USA Swimming 10 & under to 15-18): foundational lists, bodyweight / DB / light medball, landing skills, cuff work; floor Olympic lifts from about 14 after a hang block (COACH-R2 ATH-08).
- **High school**: 12-16-week season, winter in most states, fall in some (AQ10); same plan as college with lighter loads (PRG-09).
- **College**: dual meets Oct-Jan, conference championships mid-late February, NCAA mid-late March (AQ11); the heaviest pool loads, so dryland stays short and strength-focused.
- **Masters** (US Masters Swimming): 19.4 % report shoulder pain and disability, most at 40-60 (AQ13); strength for shoulders and bone (AQ41); from 60 the older-adult rules apply (no Olympic lifts / plyos / depth jumps by default, optional with the warning - COACH-R2 ATH-08). Fitness / lap swimmers use `rec_swimming`.

### 4.5 Shoulder, knee and back rules (no bands)

**SHOULDER_SWIMMER** (SCIENCE (AQ3, AQ13, AQ16) for the hotspot; rules INFERRED from the 04 SHOULDER_* rules and COACH-ANSWER VOL-17 / EQ-01 / R2-LIB-04 / R2-LIB-07)
- pull sets at least 1.5 x push sets every dryland week; horizontal pull before vertical pull (ORD-01); rear delts get their own sets (VOL-17)
- posterior cuff and scapular work 2-3 x / week with DB, cable or KB: side-lying DB external rotation, prone floor Y / T raises (R2-LIB-07), KB face pulls as shoulder work on pull / shoulder days (R2-LIB-04, LIB-10) - never bands (EQ-01)
- pressing = push-up variations (hands on bench = foundational, feet on bench = advanced - R2-LIB-05), neutral-grip DB or landmine press; overhead pressing low volume and seated (seated machine shoulder press - R2-LIB-07) when needed; no behind-the-neck pressing (INFERRED)
- the pool is part of the load: when a check-in shows effort 9-10, missed sessions or shoulder pain, the approved check-in table holds the step or removes a set (COACH-R2 VOL-01); with no check-in the dryland stairway runs as planned (COACH-R2 VOL-03) - no yardage or lifestyle questions are asked (COACH-R2 GEN-04)
- pec-minor / thoracic mobility in the warm-up; a stiff, rounded posture plus tight pec minor is a known risk sign (AQ13)
- 'Felt a PAIN' at the shoulder -> COACH-ANSWER VOL-03 (cut that pattern 30-50 %, move it to machines or split grips) and tell the swim coach / a professional

**KNEE_MEDIAL_KICK** (SCIENCE (AQ4: 73-75 % of breaststrokers report knee pain; AQ16: eggbeater kick loads the medial knee and hip) for the hotspot; rules INFERRED)
- hip internal-rotation range and hip strength every week: lateral lunge, Cossack lunge, Copenhagen plank (GROIN_ADDUCTOR), hold-between-knees squats (UNI-12 frontal / transverse unilateral list)
- quad strength through a pain-free range: split squats, step-ups, leg extensions / isometric holds (slow, heavy) 2 x / week
- avoid deep loaded valgus positions; knees track over toes on all squats and lunges (INFERRED)
- the tool asks no kick-volume or yardage questions (COACH-R2 GEN-04): frontal-plane plyos stay low-amplitude for breaststrokers and polo players, and knee pain reported in a check-in moves the share / swaps exercises (VOL-03, UNI-02)

**LOW_BACK_EXTENSION** (SCIENCE (AQ4: about 76 % lifetime low back pain in competitive swimmers, butterfly / breaststroke highest; AQ14: divers up to 89 % lifetime, spondylolysis; AQ23 pole vault) for the hotspot; rules INFERRED + COACH-R2 SES-01/02)
- core first every session as anti-extension / anti-rotation (dead bug, plank, hollow hold) before any dynamic or extension work (ATH-11, R2-SES-03)
- heavy squat and heavy deadlift on two different days; non-axial hinge (hip thrust, back extension to neutral, reverse hyper), leg press or belt squat on the other days (COACH-R2 SES-01/02)
- no loaded end-range spinal extension (no hyperextension past neutral, no heavy good-morning grinders) for athletes with extension pain (INFERRED)
- hip-flexor length and glute strength every week so extension comes from the hips (INFERRED)
- a young athlete with one-sided low back pain on extension -> stop the extension work and refer (health screen - COACH-R2 GEN-03)

**BONE_LOADING_NON_IMPACT** (SCIENCE (AQ8: swimming is not osteogenic and a 9-month jumping programme improved bone in adolescent swimmers and cyclists; AQ30: road cyclists show low bone density, strength training helps))
- keep some jumping all year even when the plyo share is low: ballistic jumps (squat / box / broad / hex-bar - R2-ATH-02) plus a small low-amplitude block (pogo / ankle hops) 2-3 x / week
- heavy compound lifting (squat, deadlift, loaded carries) every off-season block
- progress impact gradually with the Receive-Create stages (COACH-R2 ATH-03); older clients follow COACH-R2 ATH-08 (no plyos by default; landings and low ankle hops OK)

### 4.6 Season, phases and taper

- swimming has no classic off-season: each season (short course and long course) is a macrocycle - general prep ('off-season' block in the tool, 6-12 weeks) -> specific prep ('pre-season' block, 4-6 weeks, about 60 % of off-season dryland sets, more speed and power - COACH-R2 PER-06) -> competition ('in-season', 2 lifts a week) -> championship taper 1-2 weeks (COACH-R2 PER-06; SCIENCE AQ7) -> 1-3 weeks transition (a maintenance block - COACH-R2 VOL-07 / PER-06). Club swimmers run this twice a year; high-school-only swimmers once (INFERRED)
- Club calendar: short course September-March, long course April-early August (AQ9). High school once a year; college peaks in February-March.
- Taper: the coach's 1-2 weeks (COACH-R2 PER-06) matches the taper meta-analysis (about 2 weeks, volume -41-60 %, intensity and frequency kept - AQ7). The tool tapers **dryland** only: last heavy lift 7-10 days out, short power primer to about 4-5 days out (INFERRED); the swim coach tapers the pool.
- Intake: next season start date + practice / meet days (COACH-R2 GEN-05) + PROPOSED optional championship date (O4).

### 4.7 Sample week - sprint swimmer

**off season**
- Mon - A knee + pull (before or after a pool session, >= 4 h apart when possible): warm-up (5 min any cardio + A March / Skip or mobility; never counted - ORD-08) -> core 2 x 2 light (dead bug / hollow / side plank - ATH-11, R2-SES-03) -> ballistic jumps: box jump / squat jump from a deep start position (BALL, R2-ATH-02) -> hang clean / KB squat clean (squat pattern, R2-ATH-04) -> HEAVY SQUAT 3-5 reps (axial day 1 - COACH-R2 SES-01) + chest-supported / 1-arm DB row -> rear-foot-elevated split squat (staggered = kick-start stance) + pull-up or lat pulldown -> side-lying DB external rotation + KB face pulls (shoulder work, R2-LIB-04) -> calves 3 sets
- Wed - B hip + push: warm-up (5 min any cardio + A March / Skip or mobility; never counted - ORD-08) -> core 2 x 2 light (dead bug / hollow / side plank - ATH-11, R2-SES-03) -> medball overhead throw + slam (streamline) + rotational scoop toss -> single-arm DB snatch (hinge pattern, single-arm DB snatch by default for swimmers - INFERRED) -> hip thrust / back extension to neutral (non-axial) + push-ups (hands on bench -> feet on bench, R2-LIB-05) -> single-leg RDL + neutral-grip DB press -> Nordic or slider curls -> calves 3 sets
- Fri - C full: warm-up (5 min any cardio + A March / Skip or mobility; never counted - ORD-08) -> core 2 x 2 light (dead bug / hollow / side plank - ATH-11, R2-SES-03) -> ballistic jumps from a streamline / deep start position + pogo hops (bone loading - AQ8) -> hex-bar jump or hang clean -> HEAVY trap-bar DEADLIFT 3-5 reps (axial day 2) + straight-arm pull-over (pull under, LIB-09) -> lateral lunge (frontal plane) + DB row -> triceps (streamline lockout) + prone floor Y / T raises (R2-LIB-07) -> calves 3 sets
- Sat or after any pool session (optional Focus day, ORD-10): rotator cuff (side-lying ER, prone Y / T), scapular push-up plus, hip internal-rotation mobility, thoracic rotation
- pool practices on the other sessions (the swim coach's plan = the aerobic work); 2-4 exercises per muscle trained that day (COACH-R2 SES-05) - lats and quads get 2 each on A, chest 2 on B

**pre season**
- Mon: core 2 x 2 light (dead bug / hollow / side plank - ATH-11, R2-SES-03) -> ballistic jumps: box jump / squat jump from a deep start position (BALL, R2-ATH-02) (fewer, max intent) -> hang clean / KB squat clean heavier, fewer sets -> HEAVY SQUAT 3-5 reps fast intent (axial 1) + row -> split squat -> cuff work
- Thu: core 2 x 2 light (dead bug / hollow / side plank - ATH-11, R2-SES-03) -> medball overhead throw + slam (streamline) + rotational scoop toss -> single-arm DB snatch -> trap-bar deadlift 3 x 3 fast (axial 2) + push-ups -> single-leg RDL -> Y / T raises -> calves
- optional third short lift (Fri: core -> jumps 2 x 3 -> 1 lower + 1 pull) or a Focus session (cuff / scap / hips) 20 min
- about 60 % of the off-season dryland sets, more speed and power (COACH-R2 PER-06); last 1-2 weeks = taper (see in_season_gym.taper)

**in season**
- 2 lifts (e.g. Mon / Wed with a Saturday meet - the harder lift >= 48 h before the meet): core 2 x 2 light (dead bug / hollow / side plank - ATH-11, R2-SES-03) -> 1 ballistic jump (3 x 3) -> hang clean / KB squat clean 2 x 3 (R2-ATH-04) -> squat or trap-bar 2-3 x 3 at about 80 % effort -> 1 pull + 1 push -> cuff work
- Fri (day before a meet): nothing heavy; optional 10 min core / cuff activation
- championship taper (last 1-2 weeks): dryland volume -40-60 %, keep intensity, last heavy lift 7-10 days out, short power primer (2-3 jumps x 3, 1 x 2 hang clean) up to ~4-5 days out (AQ7; timing INFERRED)

Season-override weeks (sets): pre-season {PLYO: 2.4, JLK: 3.2, BALL: 4.0, THROW: 4.0, TE: 4.8, BKD: 2.6, BHD: 1.8, UKD: 2.2, UHD: 1.8, HPUSH: 1.8, VPUSH: 0.9, HPULL: 2.6, VPULL: 3.1, ISO_HAM: 1.3, ISO_REAR: 2.6, ISO_TRICEP: 1.3, ISO_CALF: 6.8, CORE: 9.0, FOCUS: 2.2} = 60 % of off-season; in season {PLYO: 1.5, JLK: 2.0, BALL: 2.5, THROW: 2.5, TE: 3.0, BKD: 1.9, BHD: 1.2, UKD: 1.6, UHD: 1.2, HPUSH: 1.2, VPUSH: 0.6, HPULL: 1.9, VPULL: 2.2, ISO_HAM: 0.9, ISO_REAR: 1.9, ISO_TRICEP: 0.9, ISO_CALF: 4.5, CORE: 6.0, FOCUS: 1.5} = 40 %.

## 5. Diving

**Diving (springboard / platform)** (`diving`; Clavados (trampolín / plataforma)) - class 4 (40 % plyometric), speed_power, 3 days, 99 sets / wk, aerobic 2; reuse: new.
- Divers need maximal jump height, fast rotation (tight tuck / pike = hip-flexor and core compression strength), and overhead shoulder and wrist stability for entries. Injuries cluster at the shoulder, lumbar spine (repetitive hyperextension -> spondylolysis, LBP up to 89 % lifetime) and wrist / hand (AQ14). Land jumping volume is already high in dry-board and trampoline work, so the gym biases ballistic, low-contact jumps and strength.
- Contact: springboard take-off rides the board through ~2.25-2.5 oscillation cycles (AQ15) - a long, board-timed contact; platform take-offs are standing countermovement jumps or a short run + hurdle = single maximal efforts (ballistic).
- Injuries -> rules: SHOULDER_SWIMMER, LOW_BACK_EXTENSION, WRIST_HAND, PATELLAR_TENDON, BONE_LOADING_NON_IMPACT, PAIN_GENERAL.
- Variants: Platform ({ISO_GRIP: 1, VPUSH: 1, BALL: -1})
- US calendar: high_school: with the swim team: winter in most states (AQ10); college: with swimming: conference February, NCAA zones / championships March (AQ11); club_usa_diving: year-round; summer nationals (INFERRED); frequency: pool / dry-board / trampoline practice 5-6 days a week (INFERRED)
- For the coach: diving class 4 (40 % plyometric) because the springboard contact is long and board-timed - approve? / no depth jumps for divers by default (the board supplies reactive loading) - approve?

## 6. Water polo

**Water polo - field players (drivers, wings, point, defenders)** (`water_polo_field`; Waterpolo - jugadores de campo (Field players)) - class 5 (25 % plyometric), rotational_power, 3 days, 96 sets / wk, aerobic 0; reuse: new.
- Field players swim, wrestle and throw without a stable base: up to 80 % report shoulder pain in their career (AQ17), and the eggbeater kick loads the medial knee and hip / groin (AQ16, AQ17). The gym builds rotational and overhead throwing power with heavy shoulder care, hip / adductor strength for the eggbeater, and leg power for the vertical 'boost' out of the water.
- Contact: no ground: the body is held up by a sustained eggbeater kick and every throw, block or jump out of the water is a single maximal effort without a stable base (AQ16) - the 'sustained / grappling' class (wrestling in the water).
- Injuries -> rules: SHOULDER_SWIMMER, SHOULDER_THROWER, KNEE_MEDIAL_KICK, GROIN_ADDUCTOR, LOW_BACK_ROTATIONAL, BONE_LOADING_NON_IMPACT, NECK, PAIN_GENERAL.
- US calendar: high_school: California and a few other states: boys fall (Aug-Nov), girls winter (Nov-Feb) (INFERRED, state-dependent); college: NCAA men fall season, championship in December; women spring season, championship in May (AQ18); club_olympic: USA Water Polo club / Junior Olympics in summer (INFERRED); frequency: elite week up to 5 polo + 2-3 swim + 3 weight sessions (AQ16)
- For the coach: water polo class 5 (25 % plyometric) - approve? / field players: moderate medball (T2) rather than the 'high' rotational level, because they already throw a lot - approve?

**Water polo - center (2-meter) and center defender** (`water_polo_center`; Waterpolo - boya / centro (Center) y defensor de boya) - class 5 (25 % plyometric), resistance, 3 days, 102 sets / wk, aerobic 0; reuse: delta.
- Centers fight for position all game (wrestling in the water) and shoot with their back to goal: more bilateral strength and size, like the contact 'more resistance' group (ATH-03 linemen / wrestlers), on top of the field-player shoulder and hip care.
- Contact: no ground: the body is held up by a sustained eggbeater kick and every throw, block or jump out of the water is a single maximal effort without a stable base (AQ16) - the 'sustained / grappling' class (wrestling in the water).
- Injuries -> rules: SHOULDER_SWIMMER, SHOULDER_THROWER, KNEE_MEDIAL_KICK, GROIN_ADDUCTOR, LOW_BACK_ROTATIONAL, BONE_LOADING_NON_IMPACT, NECK, PAIN_GENERAL.
- US calendar: high_school: California and a few other states: boys fall (Aug-Nov), girls winter (Nov-Feb) (INFERRED, state-dependent); college: NCAA men fall season, championship in December; women spring season, championship in May (AQ18); club_olympic: USA Water Polo club / Junior Olympics in summer (INFERRED); frequency: elite week up to 5 polo + 2-3 swim + 3 weight sessions (AQ16)
- For the coach: centers in the 'more resistance' group (like linemen / wrestlers) - approve?

**Water polo - goalkeeper** (`water_polo_goalkeeper`; Waterpolo - portero (Goalkeeper)) - class 5 (25 % plyometric), speed_power, 3 days, 98 sets / wk, aerobic 0; reuse: delta.
- Goalkeepers explode vertically and laterally out of the water to block and rarely shoot: more ballistic leg power and frontal-plane hip strength, overhead reach strength, fewer throws.
- Contact: no ground: the body is held up by a sustained eggbeater kick and every throw, block or jump out of the water is a single maximal effort without a stable base (AQ16) - the 'sustained / grappling' class (wrestling in the water).
- Injuries -> rules: SHOULDER_SWIMMER, SHOULDER_THROWER, KNEE_MEDIAL_KICK, GROIN_ADDUCTOR, LOW_BACK_ROTATIONAL, BONE_LOADING_NON_IMPACT, NECK, PAIN_GENERAL.
- US calendar: high_school: California and a few other states: boys fall (Aug-Nov), girls winter (Nov-Feb) (INFERRED, state-dependent); college: NCAA men fall season, championship in December; women spring season, championship in May (AQ18); club_olympic: USA Water Polo club / Junior Olympics in summer (INFERRED); frequency: elite week up to 5 polo + 2-3 swim + 3 weight sessions (AQ16)
- For the coach: goalkeepers: more ballistic jumps, fewer throws - approve?

## 7. Track and field

| profile | reuse | class | plyo % target / budget | group | gym sprint m | plyometric contacts | throws | Olympic sets | aerobic | injuries |
|---|---|---|---|---|---|---|---|---|---|---|
| track_sprinter | unchanged | 1 | 75 / 75 | speed_power | 610-830 | 90-120 | 40-55 | 10 | 2 | HAMSTRING, ACHILLES_CALF, HIP_FLEXOR, LOW_BACK_LOADING |
| track_400 | delta | 1 | 75 / 72 | speed_power | 610-830 | 75-105 | 40-55 | 10 | 2 | HAMSTRING, ACHILLES_CALF, HIP_FLEXOR, LOW_BACK_LOADING |
| track_hurdles | delta | 1 | 75 / 75 | speed_power | 610-830 | 90-120 | 40-55 | 10 | 2 | HAMSTRING, HIP_FLEXOR, GROIN_ADDUCTOR, ACHILLES_CALF |
| track_jumper | unchanged | 1 | 75 / 79 | speed_power | 410-550 | 125-170 | 40-55 | 10 | 2 | HAMSTRING, ACHILLES_CALF, PATELLAR_TENDON, BONE_STRESS |
| track_high_jump | new | 2 | 60 / 61 | speed_power | 305-415 | 85-115 | 50-70 | 10 | 2 | PATELLAR_TENDON, ACHILLES_CALF, ANKLE_SPRAIN, LOW_BACK_EXTENSION |
| track_pole_vault | new | 2 | 60 / 59 | speed_power | 510-690 | 60-85 | 50-70 | 8 | 2 | SHOULDER_THROWER, LOW_BACK_EXTENSION, WRIST_HAND, HAMSTRING |
| track_thrower | delta | 4 | 40 / 40 | resistance | 205-275 | 35-45 | 130-170 | 10 | 2 | LOW_BACK_ROTATIONAL, LOW_BACK_LOADING, LEAD_HIP_GLUTE, SHOULDER_THROWER |
| track_javelin | new | 3 | 50 / 50 | resistance | 305-415 | 50-65 | 85-115 | 8 | 2 | SHOULDER_THROWER, ELBOW_THROWER, LOW_BACK_ROTATIONAL, PATELLAR_TENDON |
| track_middle | new | 1 | 75 / 78 | endurance | 205-275 | 25-35 | 0 | 3 | running plan | ACHILLES_CALF, BONE_STRESS, HAMSTRING, PATELLOFEMORAL_ITB |

## 7.1 Track event notes

**Track - sprints (100-200 m)** (`track_sprinter`; Atletismo - velocidad (100-200 m)) - class 1 (75 % plyometric), speed_power, 4 days, 128 sets / wk, aerobic 2; reuse: unchanged.
- Sprinting is the S&C priority; plyos are horizontal and stiffness-oriented; hamstrings are the injury driver. Speed / power group (COACH-ANSWER ATH-03): more plyos than ballistics, 'even though they will have ballistics' (ATH-01); ipsilateral step-ups for the take-off (CAT-13); sprints in season (PER-08). Reused unchanged from 04 v1; in-season / pre-season factors rewritten to COACH-R2 PER-06 / ATH-07.
- Contact: about 0.10-0.16 s per contact (sprinting: ~0.14-0.16 s in acceleration, shorter at top speed [S33]; bounding, repeated hops).
- Injuries -> rules: HAMSTRING, ACHILLES_CALF, HIP_FLEXOR, LOW_BACK_LOADING, PAIN_GENERAL.
- US calendar: high_school: spring outdoor season (about Mar-May/Jun); many states also run winter indoor (Dec-Feb) (AQ27; state-dependent); college: indoor Dec-early Mar (NCAA indoor mid-March), outdoor Mar-June (NCAA outdoor early-mid June) (AQ27); pro: indoor circuit Jan-Mar; outdoor / Diamond League about May-Sep; global championships Jul-Sep (INFERRED); adult_masters: USATF masters meets spring-summer (INFERRED); frequency: track practice 5-6 days a week; meets 1-2 a week in season (HS often mid-week + Saturday) (INFERRED)

**Track - 400 m** (`track_400`; Atletismo - 400 m) - class 1 (75 % plyometric), speed_power, 4 days, 124.5 sets / wk, aerobic 2; reuse: delta.
- The 400 m is a sprint with a large aerobic share (about 41-45 % aerobic - AQ19): the sprinter's strength-power profile with slightly fewer plyometric contacts, plus speed-endurance and lactate-clearance conditioning (04 note: add LC and B).
- Contact: sprint contacts (~0.10-0.16 s) held for ~45-60 s; contacts lengthen as fatigue builds.
- Injuries -> rules: HAMSTRING, ACHILLES_CALF, HIP_FLEXOR, LOW_BACK_LOADING, PAIN_GENERAL.
- US calendar: high_school: spring outdoor season (about Mar-May/Jun); many states also run winter indoor (Dec-Feb) (AQ27; state-dependent); college: indoor Dec-early Mar (NCAA indoor mid-March), outdoor Mar-June (NCAA outdoor early-mid June) (AQ27); pro: indoor circuit Jan-Mar; outdoor / Diamond League about May-Sep; global championships Jul-Sep (INFERRED); adult_masters: USATF masters meets spring-summer (INFERRED); frequency: track practice 5-6 days a week; meets 1-2 a week in season (HS often mid-week + Saturday) (INFERRED)
- For the coach: 400 m: sprinter plyo share 75 % with ~15 % fewer contacts and B / LC conditioning - approve?

**Track - hurdles (100 / 110 m H; 400 m H variant)** (`track_hurdles`; Atletismo - vallas (100 / 110 m con vallas; 400 m con vallas)) - class 1 (75 % plyometric), speed_power, 4 days, 130 sets / wk, aerobic 2; reuse: delta.
- Hurdlers are sprinters who need extra hip range and strength in flexion, abduction and rotation (lead and trail leg). The sprinter budget is kept; 2 Focus sets go to loaded hip flexion and adductor / abductor work (hurdle mobility drills are warm-up and never count - ORD-08).
- Contact: sprint contacts between hurdles (~0.10-0.16 s); the take-off and touch-down steps are stiff, short contacts.
- Injuries -> rules: HAMSTRING, HIP_FLEXOR, GROIN_ADDUCTOR, ACHILLES_CALF, PAIN_GENERAL.
- Variants: 400 m hurdles ({PLYO: -2, JLK: -1.5})
- US calendar: high_school: spring outdoor season (about Mar-May/Jun); many states also run winter indoor (Dec-Feb) (AQ27; state-dependent); college: indoor Dec-early Mar (NCAA indoor mid-March), outdoor Mar-June (NCAA outdoor early-mid June) (AQ27); pro: indoor circuit Jan-Mar; outdoor / Diamond League about May-Sep; global championships Jul-Sep (INFERRED); adult_masters: USATF masters meets spring-summer (INFERRED); frequency: track practice 5-6 days a week; meets 1-2 a week in season (HS often mid-week + Saturday) (INFERRED)
- For the coach: hurdlers = sprinter budget + 2 hip Focus sets - approve?

**Track - horizontal jumps (long / triple)** (`track_jumper`; Atletismo - saltos horizontales (longitud / triple)) - class 1 (75 % plyometric), speed_power, 4 days, 130 sets / wk, aerobic 2; reuse: unchanged.
- Horizontal jumpers are fast sprinters with the highest single-leg plyometric loads: one-leg take-off stiffness (AQ20), bounding, hamstrings and Achilles. 04 budget reused; the triple jump adds bone-stress and patellar-tendon care (step phase).
- Contact: take-off contacts 0.12-0.14 s (long jump); triple jump hop 0.12-0.14, step 0.13-0.15, jump 0.14-0.16 s (AQ20).
- Injuries -> rules: HAMSTRING, ACHILLES_CALF, PATELLAR_TENDON, BONE_STRESS, ANKLE_SPRAIN, PAIN_GENERAL.
- Variants: Triple jump ({JLK: -1.5, ISO_QUAD: 2})
- US calendar: high_school: spring outdoor season (about Mar-May/Jun); many states also run winter indoor (Dec-Feb) (AQ27; state-dependent); college: indoor Dec-early Mar (NCAA indoor mid-March), outdoor Mar-June (NCAA outdoor early-mid June) (AQ27); pro: indoor circuit Jan-Mar; outdoor / Diamond League about May-Sep; global championships Jul-Sep (INFERRED); adult_masters: USATF masters meets spring-summer (INFERRED); frequency: track practice 5-6 days a week; meets 1-2 a week in season (HS often mid-week + Saturday) (INFERRED)

**Track - high jump** (`track_high_jump`; Atletismo - salto de altura) - class 2 (60 % plyometric), speed_power, 4 days, 123 sets / wk, aerobic 2; reuse: new.
- High jumpers convert a curved approach into vertical lift on one leg: more vertical and single-leg ballistic work than the horizontal jumpers, slightly less sprinting, and frontal-plane hip strength for the curve and the take-off lean.
- Contact: curved approach (sprint contacts) into a one-leg take-off of roughly 0.15-0.20 s; 'speed floppers' have shorter take-offs than 'power floppers' (Dapena-type analyses) - fast SSC but longer than the horizontal jumps.
- Injuries -> rules: PATELLAR_TENDON, ACHILLES_CALF, ANKLE_SPRAIN, LOW_BACK_EXTENSION, HAMSTRING, PAIN_GENERAL.
- US calendar: high_school: spring outdoor season (about Mar-May/Jun); many states also run winter indoor (Dec-Feb) (AQ27; state-dependent); college: indoor Dec-early Mar (NCAA indoor mid-March), outdoor Mar-June (NCAA outdoor early-mid June) (AQ27); pro: indoor circuit Jan-Mar; outdoor / Diamond League about May-Sep; global championships Jul-Sep (INFERRED); adult_masters: USATF masters meets spring-summer (INFERRED); frequency: track practice 5-6 days a week; meets 1-2 a week in season (HS often mid-week + Saturday) (INFERRED)
- For the coach: high jump class 2 (60 % plyometric) - approve?

**Track - pole vault** (`track_pole_vault`; Atletismo - salto con garrocha (pértiga)) - class 2 (60 % plyometric), speed_power, 4 days, 130 sets / wk, aerobic 2; reuse: new.
- Vaulters combine sprint speed, a one-leg take-off and gymnastic upper-body / core strength (pulling, inversion, push-off at the top). The shoulders take the plant and the back takes the swing (AQ23). More vertical pulling, overhead strength and hanging core than any other track event; landings into the pit are part of practice.
- Contact: sprint approach (class-1 contacts) into a plant and take-off; the decisive action after take-off is a long, whole-body swing / inversion on the pole (no ground) - a mix that sits in the 'short' class.
- Injuries -> rules: SHOULDER_THROWER, LOW_BACK_EXTENSION, WRIST_HAND, HAMSTRING, ACHILLES_CALF, FALL_UPPER_LIMB, PAIN_GENERAL.
- US calendar: high_school: spring outdoor season (about Mar-May/Jun); many states also run winter indoor (Dec-Feb) (AQ27; state-dependent); college: indoor Dec-early Mar (NCAA indoor mid-March), outdoor Mar-June (NCAA outdoor early-mid June) (AQ27); pro: indoor circuit Jan-Mar; outdoor / Diamond League about May-Sep; global championships Jul-Sep (INFERRED); adult_masters: USATF masters meets spring-summer (INFERRED); frequency: track practice 5-6 days a week; meets 1-2 a week in season (HS often mid-week + Saturday) (INFERRED)
- For the coach: pole vault class 2 (60 % plyometric) and a gymnastic upper-body block - approve?

**Track - throws (shot put, discus, hammer)** (`track_thrower`; Atletismo - lanzamientos (bala, disco, martillo)) - class 4 (40 % plyometric), resistance, 4 days, 129 sets / wk, aerobic 2; reuse: delta.
- Throwers are the track's strength athletes (ATH-03): bilateral strength and size, rotational power through a planted lead leg, medball and implement ballistics (implement throws are the sport). The 04 variant kept the sprinter's plyo split; it is corrected to the long-contact class (40 % plyometric) like baseball.
- Contact: rotational / glide throws end in a planted double-support delivery well over 0.25 s (stride-plant-rotate, like baseball).
- Injuries -> rules: LOW_BACK_ROTATIONAL, LOW_BACK_LOADING, LEAD_HIP_GLUTE, SHOULDER_THROWER, WRIST_HAND, PAIN_GENERAL.
- Variants: Hammer ({ISO_GRIP: 2, THROW: -2})
- US calendar: high_school: spring outdoor season (about Mar-May/Jun); many states also run winter indoor (Dec-Feb) (AQ27; state-dependent); college: indoor Dec-early Mar (NCAA indoor mid-March), outdoor Mar-June (NCAA outdoor early-mid June) (AQ27); pro: indoor circuit Jan-Mar; outdoor / Diamond League about May-Sep; global championships Jul-Sep (INFERRED); adult_masters: USATF masters meets spring-summer (INFERRED); frequency: track practice 5-6 days a week; meets 1-2 a week in season (HS often mid-week + Saturday) (INFERRED)
- For the coach: throwers corrected from the sprinter's class 1 to class 4 (40 % plyometric, like baseball) - approve?

**Track - javelin** (`track_javelin`; Atletismo - lanzamiento de jabalina) - class 3 (50 % plyometric), resistance, 4 days, 123 sets / wk, aerobic 2; reuse: new.
- Javelin is an overhead throw at the end of a run-up: the shoulder (about 30 % of injuries) and the medial elbow (UCL sprain = 'javelin thrower's elbow') are the hotspots (AQ22), plus the low back and the blocking knee. Pitcher rules apply: less overhead pressing, more arm care (COACH-ANSWER ATH-08 logic).
- Contact: sprint approach and crossover steps (short contacts) into a stiff block / plant step, then an overhead throw from the braced lead leg - a mix of short and planted contacts.
- Injuries -> rules: SHOULDER_THROWER, ELBOW_THROWER, LOW_BACK_ROTATIONAL, PATELLAR_TENDON, LEAD_HIP_GLUTE, HAMSTRING, PAIN_GENERAL.
- US calendar: high_school: spring outdoor season (about Mar-May/Jun); many states also run winter indoor (Dec-Feb) (AQ27; state-dependent); college: indoor Dec-early Mar (NCAA indoor mid-March), outdoor Mar-June (NCAA outdoor early-mid June) (AQ27); pro: indoor circuit Jan-Mar; outdoor / Diamond League about May-Sep; global championships Jul-Sep (INFERRED); adult_masters: USATF masters meets spring-summer (INFERRED); frequency: track practice 5-6 days a week; meets 1-2 a week in season (HS often mid-week + Saturday) (INFERRED)
- For the coach: javelin as its own profile (overhead thrower: pitcher-style arm care, class 3) - approve?

**Track - middle distance (800-1500 m / mile)** (`track_middle`; Atletismo - medio fondo (800-1500 m / milla)) - class 1 (75 % plyometric), endurance, 3 days, 79 sets / wk, aerobic running plan; reuse: new.
- 800-1500 m runners need speed (800 m about 40 % anaerobic, 1500 m about 20 % - AQ19) and running economy: heavy strength + plyometrics 2-3 x / week improve economy (AQ24). More sprint and plyometric work than the distance runner, less than the sprinter.
- Contact: repeated reactive running contacts (~0.15-0.20 s at race pace; < 0.20 s in fast runners - AQ26).
- Injuries -> rules: ACHILLES_CALF, BONE_STRESS, HAMSTRING, PATELLOFEMORAL_ITB, PAIN_GENERAL.
- Variants: 3000 m steeplechase ({PLYO: 1, UKD: 1})
- US calendar: high_school: spring outdoor season (about Mar-May/Jun); many states also run winter indoor (Dec-Feb) (AQ27; state-dependent); college: indoor Dec-early Mar (NCAA indoor mid-March), outdoor Mar-June (NCAA outdoor early-mid June) (AQ27); pro: indoor circuit Jan-Mar; outdoor / Diamond League about May-Sep; global championships Jul-Sep (INFERRED); adult_masters: USATF masters meets spring-summer (INFERRED); frequency: track practice 5-6 days a week; meets 1-2 a week in season (HS often mid-week + Saturday) (INFERRED)
- For the coach: new 'endurance' ath03 group for runners / swimmers / cyclists / rowers - approve, or keep 04's 'health'?

## 8. Distance running and cross country

**Distance running (5K-10K, half marathon, marathon)** (`distance_runner`; Carreras de fondo (5K-10K, medio maratón, maratón)) - class 1 (75 % plyometric), endurance, 3 days, 69.5 sets / wk, aerobic running plan; reuse: unchanged.
- Strength and plyos are there for running economy and tissue capacity, not mass. PRG-12: the Chris Hinshaw half-marathon plan is used as-is, for the half marathon only. The '21.6 mile run' is removed from plans and tests (COACH-R2 LIB-06): the longest run the tool writes is the coach's half-marathon plan; marathoners get the strength plan only and follow their own running plan (open question O6).
- Contact: repeated reactive running contacts: ~0.23-0.24 s at 14 km/h in competitive runners, < 0.20 s in fast / elite runners (AQ26).
- Injuries -> rules: ACHILLES_CALF, BONE_STRESS, HAMSTRING, PAIN_GENERAL, PATELLOFEMORAL_ITB.
- US calendar: high_school: cross country late Aug-Nov; winter indoor track (some states) Dec-Feb; spring track Mar-May/Jun (AQ27); college: cross country Aug-Nov (NCAA late Nov); indoor Dec-Mar; outdoor Mar-Jun (AQ27); road_adult: big road seasons in spring (Mar-May) and fall (Sep-Nov) with races all year (INFERRED); frequency: runs 3-7 a week; the coach's half-marathon plan uses 2 runs a week for 21 weeks (OBSERVED Sheet24)
- For the coach: distance runners stay class 1 (75 % plyometric of a small T1 power budget) although easy-pace contacts are 0.20-0.30 s - approve?

**Cross country (HS / college)** (`cross_country`; Campo traviesa (cross country)) - class 1 (75 % plyometric), endurance, 3 days, 72.5 sets / wk, aerobic running plan; reuse: delta.
- Cross country is distance running on grass, dirt and hills with uneven footing: the distance runner's profile plus more multi-directional ankle work, lateral hip strength (FOCUS) and ankle-sprain care. Season is fixed (late Aug-Nov, AQ27).
- Contact: repeated reactive running contacts: ~0.23-0.24 s at 14 km/h in competitive runners, < 0.20 s in fast / elite runners (AQ26).
- Injuries -> rules: ACHILLES_CALF, BONE_STRESS, ANKLE_SPRAIN, HAMSTRING, PATELLOFEMORAL_ITB, PAIN_GENERAL.
- US calendar: high_school: late Aug - Nov (state meets early-mid Nov) (AQ27); college: Aug - Nov, NCAA championships late November (AQ27); frequency: 1 meet a week; runs 5-7 days a week (INFERRED)
- For the coach: cross country as its own profile (terrain / ankle deltas on the distance runner) - approve?

- **Half marathon** = the coach's Chris Hinshaw plan used as-is (PRG-12, COACH-R2 LIB-06): 2 runs a week x 21 weeks, longest run 3 -> 12 mi, taper week 21 (OBSERVED Sheet24). The 21.6-mile run is removed from plans and tests (COACH-R2 LIB-06). 5K-10K and marathon runners get the strength plan + their own run plan (O6).
- Conflict flagged (O7): the borrowed plan has cut-back weeks and mid-plan max-effort mile tests; the coach's own block rules forbid both (COACH-R2 VOL-07, PER-07). PROPOSED: run plan untouched, the Blaze strength block next to it follows the stairway.

## 9. Triathlon

**Triathlon (sprint / Olympic, 70.3, full)** (`triathlon`; Triatlón (sprint / olímpico, 70.3, distancia completa)) - class 1 (75 % plyometric), endurance, 2 days, 60 sets / wk, aerobic swim-bike-run plan; reuse: new.
- Triathletes train three sports (10-20 h a week at higher levels); most injuries come from the run and hit the knee and spine (AQ28), and the swim adds shoulder load. Two short, heavy strength sessions with low-amplitude plyometrics improve economy (AQ24, AQ31) without stealing endurance time.
- Contact: the run leg sets the contact class (repeated reactive contacts - AQ26); swim and bike have no impact.
- Injuries -> rules: ACHILLES_CALF, BONE_STRESS, PATELLOFEMORAL_ITB, SHOULDER_SWIMMER, LOW_BACK_LOADING, PAIN_GENERAL.
- US calendar: race_season: about April-October; USA Triathlon Age Group Nationals in August (AQ29); off_season: Nov-Feb base and strength (INFERRED); collegiate: NCAA women's triathlon (emerging sport) fall season (INFERRED); frequency: 8-15+ training sessions a week across three sports (INFERRED)
- For the coach: triathlon: 2 strength days, class 1 from the run leg - approve?

## 10. Cycling

**Cycling - endurance (road, mountain bike, gravel, indoor racing)** (`cycling_endurance`; Ciclismo de resistencia (ruta, montaña, gravel, bajo techo)) - class 4 (40 % plyometric), endurance, 3 days, 79 sets / wk, aerobic riding plan; reuse: new.
- Heavy strength training (about 2 x / week, 4-10RM) improves cycling economy and sprint power (AQ31). Road cyclists show low bone density because the sport has no impact (AQ30): keep jumps and heavy lifting all year. Low back and anterior knee are the overuse hotspots (AQ32), neck / shoulders from the position, clavicle from crashes.
- Contact: no ground contact; the pedal down-stroke is a sustained push of roughly 0.2-0.3 s per leg at 90-120 rpm - a long, pushing contact.
- Injuries -> rules: LOW_BACK_LOADING, PATELLOFEMORAL_ITB, NECK, BONE_LOADING_NON_IMPACT, FALL_UPPER_LIMB, PAIN_GENERAL.
- Variants: Mountain bike (XC / enduro) ({HPULL: 2, ISO_GRIP: 2, PLYO: 1}); Indoor racing / training ({})
- US calendar: road: US road racing about March-September; cyclocross Sep-Dec (INFERRED); mountain: spring-fall race season (INFERRED); track: velodrome seasons vary; national championships summer (INFERRED); indoor: winter indoor racing / training (Zwift-type) Nov-Mar (INFERRED); frequency: riding 4-7 days a week (INFERRED)
- For the coach: cycling class 4 (40 % plyometric) and year-round jumping for bone - approve?

**Cycling - sprint (track sprint, keirin, BMX)** (`cycling_sprint`; Ciclismo de velocidad (pista y BMX)) - class 4 (40 % plyometric), resistance, 4 days, 112 sets / wk, aerobic 2; reuse: new.
- Sprint cyclists and BMX racers win with maximal force and power over < 60 s: back-squat force and power-clean power are the best predictors of on-bike force and power (AQ33). Bilateral strength leads; jumps for rate of force; BMX adds landings and upper-body for gate starts and jumps.
- Contact: no ground contact; standing starts and sprints are maximal, sustained pedal pushes (~0.2-0.3 s per stroke) - long, pushing contacts.
- Injuries -> rules: LOW_BACK_LOADING, PATELLAR_TENDON, BONE_LOADING_NON_IMPACT, FALL_UPPER_LIMB, PAIN_GENERAL.
- Variants: BMX racing ({PLYO: 2, HPULL: 2, ISO_GRIP: 2})
- US calendar: road: US road racing about March-September; cyclocross Sep-Dec (INFERRED); mountain: spring-fall race season (INFERRED); track: velodrome seasons vary; national championships summer (INFERRED); indoor: winter indoor racing / training (Zwift-type) Nov-Mar (INFERRED); frequency: riding 4-7 days a week (INFERRED)
- For the coach: sprint cyclists / BMX in the 'more resistance' group - approve?

## 11. Rowing

**Rowing (crew: sweep / sculling)** (`rowing`; Remo (punta / couple)) - class 5 (25 % plyometric), endurance, 3 days, 85 sets / wk, aerobic rowing / erg plan; reuse: new.
- A 2000 m race is about 70-80 % aerobic over 220-250 strokes (AQ35), but each stroke is a big leg-hip-back push: rowers need strength-endurance and strength (deadlift / squat / row patterns), a resilient low back (15-25 % of injuries) and ribs (stress fractures) (AQ34). Heavy squats can aggravate the back (AQ34b), so the coach's two-day spine rule matters (COACH-R2 SES-01/02).
- Contact: no ground; the drive is a sustained leg-hip-back push of roughly 0.7-1.0 s from the foot stretcher against the oar - very long, grounded-type contact.
- Injuries -> rules: LOW_BACK_LOADING, RIB_STRESS, LOW_BACK_ROTATIONAL, PATELLOFEMORAL_ITB, WRIST_HAND, PAIN_GENERAL.
- Variants: Sweep ({CORE: 2, THROW: 1}); Sculling ({ISO_GRIP: 2})
- US calendar: college: fall head races Sep-Nov (e.g. Head of the Charles, October); winter erg / strength Dec-Feb; spring 2 km sprint season late Mar-May; NCAA Championships late May / early June (AQ36); high_school_club: similar fall head / spring sprint seasons (INFERRED); masters: regattas spring-fall (INFERRED); frequency: college 10-12 sessions a week incl. 2-3 lifts (INFERRED)
- For the coach: rowing class 5 (25 % plyometric) and bilateral-leaning (60/40) - approve?

## 12. Alpine skiing, snowboarding and freestyle

**Alpine ski racing and snowboard racing / cross** (`ski_alpine`; Esquí alpino y snowboard (carreras / cross)) - class 4 (40 % plyometric), resistance, 4 days, 115 sets / wk, aerobic 3; reuse: new.
- Ski racers hold huge eccentric and isometric loads on one leg at speed; ACL injuries are common (about 15 % of young racers over 10 years) and low leg and core strength predicted knee injury (AQ37). Dryland builds eccentric quad and hamstring strength, core strength, single-leg power and reactive balance; runs last 45-150 s, so an aerobic base matters.
- Contact: no ground contact; each turn is a sustained eccentric / isometric load on the outside leg (roughly 0.5-1.5 s per turn) with reactive corrections on rough snow - long contacts.
- Injuries -> rules: ACL_LANDING_CUTTING, LOW_BACK_LOADING, HAMSTRING, FALL_UPPER_LIMB, PATELLAR_TENDON, PAIN_GENERAL, GROIN_ADDUCTOR.
- Variants: Speed events (super-G / downhill) ({BKD: 2, ISO_QUAD: 2, COD: -2}); Snowboard parallel / cross ({ISO_GRIP: 2})
- US calendar: club_usss: dryland May-Oct (5-6 days a week from late August), on-snow late Oct-mid Apr = competition season (AQ39); high_school: some states (MN, VT, NH, CO, ...) have HS alpine racing Dec-Feb (INFERRED); college: NCAA skiing (alpine + nordic) Jan-Mar (INFERRED); frequency: on-snow 5-6 days a week in season; races in blocks (INFERRED)
- For the coach: alpine skiing class 4 (40 % plyometric) and 'more resistance' group - approve?

**Freestyle skiing / snowboarding (moguls, slopestyle, halfpipe, big air)** (`ski_freestyle`; Esquí y snowboard estilo libre (moguls, slopestyle, halfpipe, big air)) - class 3 (50 % plyometric), speed_power, 4 days, 118 sets / wk, aerobic 2; reuse: new.
- Freestyle athletes land from height many times a day: landing capacity (stage 1 'receive'), eccentric strength, knee (ACL) and back protection come first; rotation and air awareness come from trampoline and ramps (sport, not generated). Competitive snowboarders get more back and knee injuries than wrist (AQ38).
- Contact: big landings and quick mogul absorptions (short reactive contacts) mixed with planted take-offs from kickers and pipe walls - mixed.
- Injuries -> rules: ACL_LANDING_CUTTING, LOW_BACK_LOADING, HAMSTRING, FALL_UPPER_LIMB, PATELLAR_TENDON, PAIN_GENERAL, LOW_BACK_EXTENSION, WRIST_HAND, NECK.
- US calendar: club_usss: dryland May-Oct (5-6 days a week from late August), on-snow late Oct-mid Apr = competition season (AQ39); high_school: some states (MN, VT, NH, CO, ...) have HS alpine racing Dec-Feb (INFERRED); college: NCAA skiing (alpine + nordic) Jan-Mar (INFERRED); frequency: on-snow 5-6 days a week in season; races in blocks (INFERRED)
- For the coach: freestyle class 3 (50 % plyometric) with a doubled landing block - approve?

## 13. Recreational versions

Recreational users pick an activity, no position and no season (COACH-ANSWER GEN-02); the profile is the 04 `weekend_warrior` (ATH-13) with sport deltas, the weekend-warrior plyo share (50 %, COACH-R2 ATH-01), 3 aerobic sessions (ATH-07) filled by their own swims / runs / rides (EQ-14), adjustable (COACH-R2 SES-06), and the year plan (COACH-R2 PER-01/02). These may overlap the gen-pop 'stay athletic and active' set in `genpop-active.json` - the merge keeps one id per activity (O11).

| id | name | delta vs weekend_warrior | sets / wk | aerobic colours | injury codes |
|---|---|---|---|---|---|
| rec_swimming | Swimming - recreational (masters fitness / lap / open water) | {COD: -8, PLYO: -6, THROW: -4, JLK: 2, HPULL: 2, VPULL: 2, ISO_REAR: 2, ISO_SIDE: -2} | 112 | swims: 1 Blue (e.g. 10-20 x 25-50 fast with rest) + 1 Green (100-200 repeats) + 1 Orange (continuous 20-40 min); land erg allowed (EQ-14) | SHOULDER_SWIMMER, BONE_LOADING_NON_IMPACT, KNEE_MEDIAL_KICK, PAIN_GENERAL |
| rec_running | Running - recreational (5K to half marathon for fitness) | {COD: -6, THROW: -4, JLK: 2, PLYO: -4, SPRINT: 2, ISO_HAM: 1, UKD: 1, UHD: 1, BKD: -1, BHD: -1} | 115 | runs: 1 Blue (strides / short hill repeats) + 1 Green (1-3-min repeats or tempo) + 1 Orange (easy / long run); half-marathon goal -> the Hinshaw plan replaces these | ACHILLES_CALF, PATELLOFEMORAL_ITB, BONE_STRESS, HAMSTRING, PAIN_GENERAL |
| rec_cycling | Cycling - recreational (road, gravel, indoor / spin) | {COD: -8, PLYO: -6, THROW: -4, JLK: 2, BKD: 1, HPULL: 1, ISO_NECK: 2} | 112 | rides / classes: 1 Blue (short hard intervals) + 1 Green (1-3-min climbs) + 1 Orange (long easy ride) | LOW_BACK_LOADING, PATELLOFEMORAL_ITB, NECK, BONE_LOADING_NON_IMPACT, PAIN_GENERAL |
| rec_triathlon | Triathlon - recreational (first race / age group) | {COD: -8, PLYO: -6, THROW: -4, JLK: 3, HPULL: 1, VPULL: 1, ISO_REAR: 1} | 112 | swim / bike / run sessions mapped to Blue + Green + Orange (any mode, EQ-14); more sessions as the user adds them (COACH-R2 SES-06) | ACHILLES_CALF, PATELLOFEMORAL_ITB, SHOULDER_SWIMMER, BONE_STRESS, PAIN_GENERAL |
| rec_rowing | Rowing - recreational (indoor rowing / masters crew) | {COD: -8, PLYO: -6, THROW: -4, HPULL: 2, BHD: 1} | 109 | rows: 1 Blue (e.g. 8 x 250 m) + 1 Green (4-6 x 2-3 min) + 1 Orange (20-40 min steady) | LOW_BACK_LOADING, RIB_STRESS, PAIN_GENERAL |
| rec_ski_snowboard | Ski / snowboard season prep (recreational) | {COD: -4, ISO_HAM: 1, UKD: 1} | 122 | 1 Blue (30/30 intervals) + 1 Green (1-3 min) + 1 Orange (hike / bike) | ACL_LANDING_CUTTING, FALL_UPPER_LIMB, PATELLAR_TENDON, PAIN_GENERAL |

## 14. New fields (beyond the 04 schema)

| field | type | why |
|---|---|---|
| name_es | string | Spanish display name (COACH-R2 GEN-08; pending coach approval) |
| sport / sport_name / sport_name_es | string | groups event / position profiles under one sport for the intake picker (same as team.json) |
| category | enum competitive / recreational | COACH-ANSWER GEN-02 |
| positions | list | events / positions / disciplines covered (empty for recreational) |
| picker_map | object | NEW here: links each profile to the provisional F11 picker ids in generator_spec_v1 (sport + position value) so the merge step can wire D2_profile |
| base_profile / reuse_status / weekly_sets_delta_vs_base | string / enum / object | traceability to 04 v1 numbers (unchanged / delta / new); '04v:' = a 04 variant |
| emphasis | object 0-3 | jump / throw / sprint / COD emphasis from the weekly gym-dose tiers |
| power_mix_by_phase | object | plyo : ballistic share by phase (COACH-R2 ATH-01 / 03 / 07) |
| upper_lower_emphasis | object | share of resistance sets upper vs lower (computed) |
| rotation_emphasis | string | rotation need in plain words |
| resistance_goal | object primary / secondary / split_pct | strength / power / hypertrophy / endurance-strength; 'endurance_strength' added to resistance.emphasis_pct for endurance sports |
| olympic_policy | object | COACH-ANSWER ATH-10 + COACH-R2 ATH-04 / 05 / 08 / GEN-06 per profile |
| medball_policy | object | ATH-05 / EQ-06 / EQ-07 / LIB-22 per profile |
| in_season_gym | object | lift days, hard-day spacing (>= 48 h, COACH-R2 ATH-07), competitions per week, taper block for meet / race sports |
| in_season_gym.taper | object | NEW here: championship / goal-race taper (COACH-R2 PER-06 1-2 weeks; SCIENCE AQ7) |
| injury_prehab | list | injury hotspots -> selection rules (no bands) |
| age_notes | list | youth / older / competition-level rules (COACH-R2 ATH-08) + sport notes (age group / masters) |
| equipment | list | typical equipment |
| sample_week | object | day-by-day skeleton per phase |
| tests | object | test menu and timing (COACH-R2 PER-07) |
| season_calendar_us | object | US HS / college / club / pro / adult calendars + practice / competition frequency, cited |
| season_model | string | NEW here (swimming): double-periodised year (short course + long course macrocycles) mapped onto the tool's off / pre / in-season blocks |
| season_overrides.phase_labels / pre_season_week_sets / in_season_week_sets | object | NEW here: sport wording for the tool's phases and the resulting weekly sets |
| sport_load_context | object | NEW here: how much the sport practice (pool, runs, rides, ergs, on-snow) already supplies - why the gym adds 0 aerobic sessions or few contacts |
| stairway | string | COACH-R2 PER-03/04/05 + VOL-07 reminder on every profile |
| field_evidence | object | evidence label per field (COACH vs INFERRED vs SCIENCE vs PROPOSED) |
| ath03_evidence | string | evidence for the ath03_group value |
| ath03_group value 'endurance' | enum value | NEW PROPOSED value for distance / endurance sports (04 filed distance runners under 'health') |
| aerobic_sessions_wk.off_season_range / pre_season / user_adjustable / colour_mix_by_phase / colours / modes / evidence / note | sub-fields | COACH-R2 ATH-06 / SES-06; value may be a string ('running plan') when the sport plan is the aerobic work |
| bilateral_unilateral.pre_season | [bilateral, unilateral] | UNI-10 drift toward the season |
| plyo.ballistic_jump_reps_wk / plyo.lists | range / list | NEW here: ballistic jump reps (BALL) shown next to plyometric contacts; R2-ATH-02 lists |
| core.dose | string | COACH-R2 SES-03 light core-first dose |
| variants[].injuries_add | list | NEW here: injury codes a variant (stroke / event) adds to the base profile |
| derived.muscles_below_floor_10 / floor_10_note / upper_lower_resistance_sets / est_exercises_per_main_day_excl_core / exercise_cap_check | derived | NEW here: COACH-R2 VOL-04/06 floor-10 audit and COACH-R2 SES-04 exercise-cap audit per profile |
| sport_tag / intake_rule | string | recreational profiles only (weekend_warrior + sport tag) |

## 15. New and extended injury codes

| code | sports | evidence |
|---|---|---|
| SHOULDER_SWIMMER | swimming (all strokes; freestyle / fly / back highest overhead volume); water polo; triathlon (swim leg); diving (entries); masters swimmers 40-60 (AQ13) | SCIENCE (AQ3, AQ13, AQ16) for the hotspot; rules INFERRED from the 04 SHOULDER_* rules and COACH-ANSWER VOL-17 / EQ-01 / R2-LIB-04 / R2-LIB-07 |
| KNEE_MEDIAL_KICK | breaststroke and IM swimmers; water polo (eggbeater kick); masters breaststrokers | SCIENCE (AQ4: 73-75 % of breaststrokers report knee pain; AQ16: eggbeater kick loads the medial knee and hip) for the hotspot; rules INFERRED |
| LOW_BACK_EXTENSION | butterfly and breaststroke swimmers (dolphin kick); divers; pole vaulters; high jumpers; freestyle skiers / snowboarders (landings) | SCIENCE (AQ4: about 76 % lifetime low back pain in competitive swimmers, butterfly / breaststroke highest; AQ14: divers up to 89 % lifetime, spondylolysis; AQ23 pole vault) for the hotspot; rules INFERRED + COACH-R2 SES-01/02 |
| RIB_STRESS | rowing (sweep more than sculling); elite rowers in high-volume blocks | SCIENCE (AQ34: low back 15-25 % of rowing injuries; rib stress fractures a main time-loss injury, more in international rowers) for the hotspot; rules INFERRED |
| BONE_LOADING_NON_IMPACT | swimmers; cyclists (road / track / indoor); divers and water polo (no land impact in the sport); rowers (partly) | SCIENCE (AQ8: swimming is not osteogenic and a 9-month jumping programme improved bone in adolescent swimmers and cyclists; AQ30: road cyclists show low bone density, strength training helps) |
| PATELLOFEMORAL_ITB | runners (road / XC / track distance); cyclists; triathletes; rowers | SCIENCE (AQ25: patellofemoral pain and ITB syndrome among the most prevalent running injuries; AQ32: anterior knee pain 36 % in pro road cyclists) |
| FALL_UPPER_LIMB | mountain bike / road cycling; snowboarding; freestyle skiing; pole vault (landings) | SCIENCE (AQ32: clavicle the most common fracture in cyclists; AQ38: hand / wrist injuries in snowboarders) for the hotspot; rules INFERRED |

- **ACL_LANDING_CUTTING** (extended): sports added: alpine skiing / snowboard racing and freestyle skiing (AQ37: about 15 % of young racers tore an ACL over 10 years; low leg / core strength predicted knee injury). Extra rules for snow athletes (INFERRED): hamstring strength 2 x / week (Nordic, slider curls), heavy eccentric / isometric quad work, core strength every session, reactive balance; freestyle athletes double the stage-1 landing block. Applied by landing competency and injury history, never by sex (ATH-09).
- **HAMSTRING** (extended): sports added: 400 m, hurdles, horizontal jumpers, pole vault, high jump, javelin approach (AQ21: sprint events = hip / thigh injuries).
- **ACHILLES_CALF** (extended): sports added: middle distance, cross country, triathlon, jumpers (AQ25: Achilles tendinopathy 10.3 % of running injury incidence).
- **BONE_STRESS** (extended): sports added: middle distance, cross country, triathlon run leg, triple jump (AQ21: bone stress injuries about 20 % per year in athletics; AQ25: medial tibial stress syndrome 9.4 %).
- **SHOULDER_THROWER** (extended): sports added: javelin, water polo field players (overhead throwing without a stable base - AQ16), pole vault plant (AQ23).
- **ELBOW_THROWER** (extended): sports added: javelin (AQ22: medial UCL sprain = 'javelin thrower's elbow').
- **LOW_BACK_ROTATIONAL** (extended): sports added: shot / discus / hammer, javelin, sweep rowing, snowboarding.
- **LOW_BACK_LOADING** (extended): round-2 update (supersedes the 04 'once a week' wording): heavy squat and heavy deadlift on two DIFFERENT days; non-axial hinge (hip thrust, back extension, reverse hyper), leg press or belt squat on the other days; axial = barbell back / front / zercher / overhead / Smith squats, barbell or trap-bar deadlifts and RDLs, good mornings; not axial = leg press, belt squat, hip thrust, back extension, reverse hyper, single-leg DB work, Olympic lifts, loaded jumps (COACH-R2 SES-01/02). Sports added: rowing (AQ34b: heavy squats named as an aggravating factor), track sprint cycling, shot put, road cycling (AQ32: 58 % low back pain).
- **GROIN_ADDUCTOR** (extended): sports added: breaststroke / IM swimmers, water polo (eggbeater; AQ17 hip / groin pain), hurdlers, skiers.
- **WRIST_HAND** (extended): sports added: divers (flat-hand entry - AQ14), sculling rowers, snowboarders (AQ38), pole vaulters.
- **NECK** (extended): sports added: road / track cyclists (long time in the drops - AQ32 neck / shoulder complaints), water polo (contact).

## 16. Open questions for the coach / merge step

- **O1 - Floor of 10 weekly sets per muscle vs athlete budgets** (OPEN): COACH-R2 VOL-04/06 ('I don't think anybody needs less than 10 sets a week per muscle'). Every athlete budget here leaves non-sport muscles (chest, arms, side delts, often calves in 3-day plans) below 10 - see derived.muscles_below_floor_10. PROPOSED reading (same as team.json O1): the floor applies to the muscles the athlete's plan trains for size / strength (resistance.priorities); pre-season (~60 %) and in-season (~40 %) are maintenance-like and may sit below 10. Needs the coach's yes.
- **O2 - Rear delts: own sets 4 / 6 / 8 vs the floor of 10** (OPEN): COACH-R2 VOL-04 approved rear delts at 4 / 6 / 8 own sets, but the same answer says nobody needs fewer than 10. Swimmers / water polo / javelin get 6 own sets + 0.25 credit from rows (about 7.5-8); others 4 (about 5-6). PROPOSED: rear-delt own sets count toward the floor only as 'shoulder health' work - coach to confirm whether rear delts are exempt from the floor.
- **O3 - Ground-contact classes for sports not on the approved R2-ATH-01 list** (OPEN): Approved: sprinters 75 %, weekend warriors 50 % (and the team / combat sports). PROPOSED here: swimming class 4 (40 %; block ~0.7 s, wall ~0.3 s), diving 4 (40 %), water polo 5 (25 %), high jump 2 (60 %), pole vault 2 (60 %), javelin 3 (50 %), throwers 4 (40 % - corrects the 04 variant that inherited the sprinter's class), middle / distance / XC / triathlon 1 (75 %), cycling 4 (40 %), rowing 5 (25 %), alpine skiing 4 (40 %), freestyle 3 (50 %).
- **O4 - Championship / goal-race date for meet and race sports** (OPEN): COACH-R2 GEN-05 approved 'next season start date + practice / game days'. Swimmers, track athletes, runners, triathletes, rowers and skiers peak at the END of the season, so the taper needs the main championship / goal-race date. PROPOSED: one optional extra tap for these sports.
- **O5 - Sport load (pool yardage, mileage) and the dryland stairway** (OPEN (resolution applied: no extra input)): The coach rejected lifestyle inputs (COACH-R2 GEN-04) and no check-in = no change (COACH-R2 VOL-03). So the tool does NOT ask yardage / mileage; a hard sport week reaches the plan only through the check-in (effort, completion, pain - COACH-R2 VOL-01). Flag: confirm that no 'sport volume this week' question is wanted.
- **O6 - Run plans other than the half marathon** (OPEN): The only coach running plan is the Chris Hinshaw half-marathon plan (PRG-12, COACH-R2 LIB-06); the 21.6-mile run is removed. 5K-10K, marathon, cross-country and triathlon athletes get the strength plan + 'follow your own run plan'. Should the tool offer more run plans later (coach-written)?
- **O7 - Borrowed half-marathon plan vs the block rules** (OPEN): The Hinshaw plan (used as-is) has cut-back weeks 3/6/8/12/18 and '1-mile at max effort' tests in weeks 10 and 14, while the coach's rules say no deload inside a block (COACH-R2 VOL-07) and no mid-block tests (COACH-R2 PER-07). PROPOSED: the borrowed run plan stays exactly as written; the Blaze strength block beside it follows the stairway and tests only at start and end.
- **O8 - New ath03 group 'endurance'** (OPEN): 04 put distance runners under 'health'. PROPOSED: a new 'endurance' group for runners, distance swimmers, triathletes, endurance cyclists and rowers (strength for economy and tissue capacity, not mass).
- **O9 - Sport practice = the aerobic sessions** (OPEN (PROPOSED default)): Swimmers, water polo players, runners, triathletes, cyclists and rowers get 0 extra gym colour sessions because their sport practice is the aerobic work (04 distance_runner rule); recreational users' own swims / runs / rides fill the 3 general sessions (ATH-07). Users can add or remove (COACH-R2 SES-06).
- **O10 - Olympic lifts for endurance athletes** (OPEN): 'Everyone in athletic training gets Olympic lifts' (ATH-10). Endurance profiles keep a small dose (2-3 sets / 1-2 exposures: hex-bar jumps, hang pulls, KB squat clean). Confirm that this low dose is what he wants for runners, triathletes and cyclists.
- **O11 - Overlap with genpop-active.json** (MERGE STEP): The rec_ profiles here (swimming, running, cycling, triathlon, rowing, ski prep) may duplicate the 'stay athletic and active' set; the merge keeps one id per activity.
- **O12 - 2-4 exercises per muscle on full-body days vs the 12 + 2 cap** (OPEN): COACH-R2 SES-05 vs SES-04 (same as team.json O2): applied as 2-4 exercises for each muscle TRAINED that day (knee + pull / hip + push pairing); athletic exercises do not count toward the resistance part. Swimming / diving / water polo 3-day plans land at about 11-12 exercises + 2 core.

## 17. Sources

- [S4] NSCA plyometric volume guide 80-100 / 100-120 / 120-140 contacts per session (Potach & Chu 2008), up to ~200 for trained adults (Chu & Myer 2013) - https://ojs.ub.uni-konstanz.de/cpa/article/view/6015/5496
- [S14] Nordic hamstring exercise programmes reduce hamstring injuries by up to 51% (van Dyk et al. 2019) - https://bjsm.bmj.com/content/53/21/1362
- [S16] Strength + plyometric training 2-3x/week for 8-12 weeks improves running economy (meta-analysis) - https://www.ncbi.nlm.nih.gov/pmc/articles/PMC11052887/
- [S32] Flanagan & Comyns 2008, Strength Cond J: ground-contact time and the reactive strength index to prescribe fast stretch-shortening-cycle (plyometric) training; fast SSC under ~250 ms vs slow SSC (Schmidtbleicher) - https://pure.ul.ie/en/publications/the-use-of-contact-time-and-the-reactive-strength-index-to-optimi/
- [S33] Sprint acceleration kinematics: faster early accelerators show shorter ground-contact times; contacts ~0.14-0.16 s in acceleration (JSSM 2003 field-sport athletes; Swansea sprint data) - https://www.jssm.org/jssm-02-144.xml%3EFulltext
- [AQ1] Swim start: block time 0.70 +/- 0.04 s (kick start) vs 0.74 s (track start) in elite collegiate swimmers; 0.77 vs 0.80 s in another elite sample - https://coachsci.sdsu.edu/swim/biomechs/honda.htm
- [AQ2] Tumble turns: wall contact time must be long enough to build push-off force in a streamlined position (Dutch national swimmers, force plate); mean wall contact ~0.32 s in another study - https://pmc.ncbi.nlm.nih.gov/articles/PMC9354539/
- [AQ3] Shoulder = most common injury site in competitive swimmers (prevalence 40-91%); NCAA: 34.7% (men) and 36.8% (women) of swim injuries involve the shoulder; rotator-cuff fatigue from thousands of strokes - https://pmc.ncbi.nlm.nih.gov/articles/PMC3435931
- [AQ4] Knee and back in swimming (Aspetar): 73% of breaststroke specialists report knee pain (75% at least 3 episodes a season); restricted hip internal rotation linked to knee pain; about 76% lifetime low back pain, butterfly / breaststroke highest (hyperextension, dolphin kick) - https://journal.aspetar.com/en/journals/volume-4-targeted-topic-aquatic-sports/the-knee-and-back-in-swimming
- [AQ5] Systematic review, dry-land training and swim-turn performance: plyometrics 2-4 sessions/week of ~20-25 min for 6-10 weeks; strength at 85-100% 1RM, 1-6 reps, 4-5 sets improved push-off impulse and turn time - https://pmc.ncbi.nlm.nih.gov/articles/PMC8431432/
- [AQ6] Strength and power predictors of swim starts in international sprint swimmers: 15 m start time vs CMJ peak power r = -0.85, jump height r = -0.69 (West et al.); youth: 1RM squat and jumps r = -0.75 to -0.86 with 5 / 15 m times - https://researchportal.bath.ac.uk/en/publications/strength-and-power-predictors-of-swimming-starts-in-international/
- [AQ7] Taper meta-analysis (Bosquet et al. 2007; swimmers, cyclists, runners): about 2 weeks, training volume cut 41-60% exponentially, intensity and frequency kept - https://pubmed.ncbi.nlm.nih.gov/17762369/
- [AQ8] Swimming is not osteogenic; a 9-month jumping programme improved bone mass and fitness in adolescent swimmers and cyclists (PRO-BONE) - https://www.ncbi.nlm.nih.gov/pmc/articles/PMC4424564/
- [AQ9] USA Swimming year: short course (25 yd) September-March, long course (50 m) April-early August - https://www.gomotionapp.com/team/92fd/page/news/415778/usa-swimmings-short-course-and-long-course-seasons
- [AQ10] High-school swimming and diving: season dates are set by each state association (example: Iowa girls' season memo); seasons run about 12-16 weeks, fall (Aug-Nov) in some states or for one sex, winter (Nov-Mar) in most - INFERRED from state pages - https://ighsau.org/news/swimming-and-diving-memo-8-11-22/
- [AQ11] NCAA Division I swimming and diving: conference championships mid-late February; NCAA Championships mid-late March (women one week before men) - https://swimswam.com/2026-ncaa-swimming-and-diving-conference-championships-primer-division-i/
- [AQ12] Training volumes: elite swimmers about 40-70 km/week; youth about 38-44 km/week; 11-14-year-olds ~5 practices of 90-120 min, 14-19-year-olds ~6 x 2 h a week - https://pmc.ncbi.nlm.nih.gov/articles/PMC5504587
- [AQ13] Shoulder pain and disability across the lifespan of competitive swimmers: 19.4% of masters swimmers (23-77 y), more at 40-60; risk = swim exposure, prior trauma, instability, less cross-training; pec-minor tightness and low core endurance in symptomatic swimmers - https://pmc.ncbi.nlm.nih.gov/articles/PMC3418126
- [AQ14] Competitive divers (systematic review 2024): shoulder, lumbar spine, trunk and wrist/hand most injured; low back pain up to 89% lifetime; spondylolysis from repetitive hyperextension; more injuries on entries, back / reverse dives and platform - https://researchsystem.canberra.edu.au/ws/portalfiles/portal/113004481/currie-et-al-2024-diving-into-the-health-problems-of-competitive-divers-a-systematic-review-of-injuries-and-illnesses.pdf
- [AQ15] Springboard take-off: the board completes about 2.25-2.5 oscillation cycles before take-off; board-tip depression explains most of the hurdle flight time (long, board-timed contact) - https://lida.sport-iat.de/twm/Record/4001856?lng=en
- [AQ16] Water polo (Aspetar): typical week = up to 5 polo sessions + 2-3 swim sessions + 3 weight sessions; overhead throwing without a stable base; eggbeater kick; heavy lifting is part of elite programmes - https://journal.aspetar.com/en/journals/volume-4-targeted-topic-aquatic-sports/keeping-the-water-polo-player-out-of-the-clinic-and-in-the-water
- [AQ17] Water polo: high self-reported shoulder and hip / groin pain across playing levels (eggbeater during growth); up to 80% of players report shoulder pain in their career - https://ijspt.scholasticahq.com/article/18801-quantifying-the-burden-of-shoulder-and-hip-pain-in-water-polo-players-across-different-playing-levels
- [AQ18] NCAA water polo: men's championship in December (fall season), women's in May (spring season) - https://collegiatewaterpolo.org/?p=50874
- [AQ19] Energy contribution (Duffield et al. 2005): 400 m about 41/59% (men) and 45/55% (women) aerobic/anaerobic; 800 m about 60/40 and 70/30; 1500 m anaerobic only ~17-20% - https://pubmed.ncbi.nlm.nih.gov/15966348/
- [AQ20] Horizontal jumps (championship biomechanics): long-jump take-off contact 0.12-0.14 s; triple jump hop 0.12-0.14, step 0.13-0.15, jump 0.14-0.16 s - https://trackandfieldnews.com/track-coach/horizontal-jumps-training-and-design/
- [AQ21] Athletics injuries by event group: sprinters / hurdlers / jumpers more acute (hamstring strain most common in sprints), distance runners more overuse (stress fractures, MTSS), throwers spine and upper limb; bone stress injuries ~20% annual incidence - https://pmc.ncbi.nlm.nih.gov/articles/PMC8975568
- [AQ22] Javelin injuries (10-year overview): shoulder ~30% of injuries; medial UCL sprain ('javelin thrower's elbow') the most common injury; also low back and knee - https://lida.sport-iat.de/dlv/Record/4042917
- [AQ23] Preventing shoulder injuries in throwers and pole vaulters (Aspetar Sports Medicine Journal, athletics issue) - https://journal.aspetar.com/en/journals/volume-13-targeted-topic-sports-medicine-in-athletics/preventing-shoulder-injuries-in-throwers-and-pole-vaulters
- [AQ24] Balsalobre-Fernandez et al. 2016 meta-analysis: strength + plyometric training 2-3x/week for 8-12 weeks improves running economy in high-level middle- and long-distance runners (SMD -1.42) - https://pubmed.ncbi.nlm.nih.gov/26694507/
- [AQ25] Running-related injuries (Kakouris et al. 2021 systematic review): incidence ~40%; Achilles tendinopathy 10.3%, MTSS 9.4%, patellofemoral pain 6.3%, plantar fasciitis 6.1%, ankle sprain 5.8%; ITB syndrome high in prevalence - https://doi.org/10.1016/j.jshs.2021.04.001
- [AQ26] Distance runners at 14 km/h: ground contact ~0.23-0.24 s (midfoot 0.228 s vs rearfoot 0.242 s); faster / elite runners < 0.20 s - https://lida.sport-iat.de/dlv/Record/4032532?lng=en
- [AQ27] US running calendar: cross country late August-November (college championships late November); indoor track December-February/March; outdoor track March-June - https://trackbarn.com/blogs/faq/when-does-track-and-field-start-in-us
- [AQ28] Long-distance triathlon injuries (systematic review): overuse dominates (37-91%), most from the run; knee and spine the most frequent sites - https://jhk.termedia.pl/A-Systematic-Review-of-Long-Distance-Triathlon-Musculoskeletal-Injuries,158676,0,2.html
- [AQ29] USA Triathlon Age Group National Championships are held in August (Olympic and sprint distance), 4,000+ athletes - https://www.sportsdestinations.com/destinations/ohio/news/usa-triathlon-releases-details-age-group-nationals-15034
- [AQ30] Cycling and bone health systematic review: road cyclists have low bone mineral density (lumbar spine); resistance / impact training recommended - https://pmc.ncbi.nlm.nih.gov/articles/PMC3554602
- [AQ31] Ronnestad & Mujika 2014 review: heavy strength training (about 2 sessions/week, 4-10RM) improves cycling and running economy / performance; 1 session/week maintains in season - https://paulogentil.com/pdf/Optimizing%20strength%20training%20for%20running%20and%20cycling%20endurance%20performance%20-%20A%20review.pdf
- [AQ32] Overuse injuries in professional road cyclists (Clarsen et al. 2010): 58% low back pain in 12 months, 36% anterior knee pain; clavicle the most common fracture in cyclists - https://pubmed.ncbi.nlm.nih.gov/20847225/
- [AQ33] Elite sprint cyclists: back-squat maximal force and power-clean maximal power the strongest predictors of on-bike force and power - https://sponet.de/Record/4096959
- [AQ34] Rowing injuries: lumbar / thoracic back pain and rib stress fractures typical, low back about 15-25% of rowing injuries; national-level rowers had more low back injuries, international rowers more rib stress fractures - https://repository.brieflands.com/items/a3503653-dc7d-4cfd-9a20-99074cf21c46/full
- [AQ34b] Cumulative trauma injuries in rowing: heavy weight lifting (especially squats), missing warm-up / cool-down, high-pressure low-rate work and stroke technique named as contributing factors - https://ojs.ub.uni-konstanz.de/cpa/article/view/3789
- [AQ35] 2000 m rowing: about 70-80% aerobic energy; races 5.5-7.5 min; 220-250 strokes - https://www.germanjournalsportsmedicine.com/archive/archive-2021/issue-4/olympic-rowing-maximum-capacity-over-2000-meters/
- [AQ36] College rowing: fall head races (e.g. Head of the Charles, October), spring 2 km sprint season from late March, NCAA Championships late May / early June - https://ca.thegistsports.com/article/41216fd6-6922-447d-bf26-0a13456f1105/
- [AQ37] Alpine ski racing: high ACL injury rates (World Cup ~36 injuries / 100 athletes / season); 10-year youth study: 15% ACL injuries; low leg and core strength and core ratios predicted knee injury - https://www.ncbi.nlm.nih.gov/pmc/articles/PMC4989489/
- [AQ38] Competitive snowboarders (national elite): back 22%, knee 16%, hand / wrist 9% of injuries; big air / snowboard cross / halfpipe riskier than slalom - https://bjsm.bmj.com/content/40/3/230
- [AQ39] US ski-club calendar example: dryland May-August and from late August, on-snow late October to mid-April (competition season) - https://www.sswsc.org/?p=2414
- [AQ40] Swim-specific dryland: sprinters = power / speed with a longer preparatory phase; distance swimmers = stability and endurance of shoulder girdle, hips and core - https://blog.bridgeathletic.com/swim-specific-dryland-training
- [AQ41] Masters swimmers need strength training (shoulder protection, bone density, recovery with age) - https://swimmingworldmagazine.com/news/4-reasons-masters-swimming-strength-training
