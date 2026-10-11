# Combat, strength & fitness sport profiles (v1.1, round-2 rules applied)

> **Status (2026-10-11, model v1.3).** This file was last issued at v1.1 (round 2) and was not re-issued for round 3, round 4, CT-01 or CX-01..04. The profiles were merged into `synthesis/04_athlete_profiles.md` (v1.3) and `04_profiles.json`, which win where they differ. Each profile now carries a confidence label in the compiled model: confirmed by the coach, based on a similar sport, or proposed (COACH-R4 R4-SCP-03). Read as history in this file: every mention of a check-in ("with a check-in the step table uses effort, completion and pain", "knee pain reported in a check-in": there is no check-in, the plan is computed once and the person or coach edits it, COACH-R3 R3-VOL-02, R3-VOL-04); session lengths and minutes used to size or check a plan (session minutes are not an input and not a limit; a plan is sized by exercise count, COACH-CT CT-01; COACH-R4 R4-SES-01, R4-SES-02); on 2 training days every big group is trained at about 6-8 weekly sets and a third day is suggested (COACH-R4 R4-SES-03). Sled pushes, wall balls, carries and the other proposed exercises named here are optional add-ons, primary only in HYROX and optionally the CrossFit-style class (COACH-R4 R4-LIB-01), and carries and sleds are dosed by distance or time (R4-LIB-02).

Companion to `combat-strength-fitness.json` (same folder). 21 profiles (20 competitive, 1 recreational) for the combat, strength, physique and fitness-racing sports plus competitive golf, tennis and pickleball, with 24 position / division / style variants. Every profile keeps the `04_profiles.json` field names; new fields are listed in section 6 and match `team.json`.

**Authority order:** coach round-2 answers (COACH-R2) > round-1 answers (COACH-ANSWER) > everything else. **Evidence tags:** OBSERVED (coach's sheets), COACH-ANSWER <ID>, COACH-R2 <ID>, INFERRED (analyst reasoning), SCIENCE (cited sources, section 9 - K-ids), PROPOSED (waiting for the coach's yes). No Google Sheet was modified.

## 1. What the coach asked, and how it is covered

> "For the athletes, all of the different popular sports in the United States are there. Include swimming as well. And for the general population include pickleball ... Gen pop and general fitness people are wanting to do things like HYROX and pickleball, meaning they want to stay athletic and active." (request of 2026-10-08)

This file covers the combat, strength and fitness sports and the competitive racket / club sports (team sports, swimming / endurance and the gen-pop 'stay athletic and active' set are in their own files).

| Sport | Profile(s) | Status vs 04 |
|---|---|---|
| Wrestling | `wrestling` (+2 variants) | 04 wrestling |
| Boxing | `boxing` (+1 variant) | 04 boxing |
| MMA | `mma` (+1 variant) | 04 mma |
| Brazilian jiu-jitsu | `bjj_grappling` (+1 variant) | 04 bjj_grappling |
| Judo | `judo` (+1 variant) | new budget |
| Karate | `karate` (+1 variant) | 04 karate_taekwondo |
| Taekwondo | `taekwondo` (+1 variant) | 04 karate_taekwondo + deltas |
| Kickboxing / Muay Thai | `kickboxing_muay_thai` (+1 variant) | 04 kickboxing_muay_thai |
| Powerlifting | `powerlifting_competitive` | 04 powerlifting_strength |
| Olympic weightlifting | `weightlifting` (+1 variant) | new budget |
| Strongman | `strongman` | new budget |
| CrossFit | `crossfit_competitor`, `crossfit_class` | 04 crossfit_competitor; new budget |
| Bodybuilding / physique | `physique_competitive` (+7 variants) | 04 bodybuilding_aesthetics |
| HYROX (fitness racing) | `hyrox_competitive` (+2 variants) | new budget |
| Obstacle course racing | `ocr_spartan` (+1 variant) | new budget |
| Artistic gymnastics | `gymnastics_artistic` (+1 variant) | new budget |
| Climbing | `climbing` (+2 variants) | new budget |
| Golf | `golf` | 04 golf |
| Tennis | `tennis` | 04 tennis |
| Pickleball | `pickleball_competitive` (+1 variant) | 04 tennis + deltas |

**Pickleball and HYROX for gen pop.** The coach's point is that ordinary fitness clients now want to play pickleball and race HYROX to stay athletic. Here those sports get their *competitive* profiles: `pickleball_competitive` (with a `pickleball_senior_60_plus` variant that applies the 60+ rule by default) and `hyrox_competitive` (Open / Pro / Doubles). The *recreational* versions - the option a gen-pop client picks - are in `sports/genpop-active.json`. By COACH-ANSWER GEN-02 a recreational user gives the activity only (no position, no season).

**No lifestyle inputs (resolution flag).** None of these profiles uses sleep, stress, job or 'how was life' data: the coach rejected them (COACH-R2 GEN-04, 'I just need the workouts'). With no check-in the plan follows its planned stairway (COACH-R2 VOL-03); a check-in step uses effort, completion and pain only. Effort 10 = 'the max I could do, but successful' (COACH-R2 VOL-02).

## 2. Coach rules applied to every profile

- **Stairway blocks** (COACH-R2 PER-03/04/05): gradual weekly steps, smaller early, a little bigger after halfway, hardest weeks last ('start at a 2, end at an 11' is perceived load, not sets). No deload or maintenance week inside a block; a block that can't be finished is cancelled -> maintenance -> new block (COACH-R2 VOL-07).
- **Event-driven seasons.** Combat, strength, physique, HYROX and OCR have no school season. 'Pre-season' = camp / meet prep / race block before the next event date: 4-6 weeks at about 60 % of off-season sets with more speed and power, then a 1-2-week taper (COACH-R2 PER-06; strength sports and physique use their own targets - see the table). 'In season' = competition-dense weeks: about 2 lifts (PER-08), the hard one >= 48 h before competing (COACH-R2 ATH-07 extended, INFERRED). Wrestling, gymnastics, golf, tennis and youth climbing also have real school / tour seasons. The intake asks the next event / season date and practice / competition days (COACH-R2 GEN-05).
- **Plyo : ballistic share by ground-contact class** (COACH-R2 ATH-01): class 5 (boxing, karate, kickboxing, wrestling, BJJ, golf) = 25 %, class 4 (MMA) = 40 %, class 3 (tennis) = 50 % plyometric at block end; each block starts 15 points more ballistic (floor 20). New sports get an INFERRED class (judo, taekwondo, weightlifting, strongman, climbing 5; HYROX, OCR, pickleball 3; gymnastics 2). Ballistic vs plyometric lists and the Receive-Create stages (RC1 Land wk 1-3, RC2 Land & Go wk 4-7, RC3 Repeat wk 8-12 in a 12-week block) are the approved ones (COACH-R2 ATH-02 / ATH-03).
- **Olympic lifts for everyone in athletic training** (ATH-10), up to 4 exposures a week, cleans = squat-pattern, snatches = hinge-pattern (COACH-R2 ATH-04); full squat lifts 3-5 reps with the coach's eye on speed (COACH-R2 ATH-05); RIR / RPE guidance and 'power output' wording - % only for competitive Olympic lifters, which is the `weightlifting` profile (COACH-R2 GEN-06). Powerlifters and physique athletes are not in athletic training: none by default.
- **Aerobic sessions** (COACH-R2 ATH-06, approved): wrestling and MMA 4; boxing, BJJ, golf, tennis 3; karate and kickboxing 3-4; powerlifters 2 easy Orange; pre-season 2; in season 2 (ATH-07); physique 4 incl. a second easy Orange + optional walks (COACH-R2 SES-06). Sports not on his list are PROPOSED (judo 4, taekwondo 3, weightlifting 2, strongman 2, HYROX 4, OCR 4, gymnastics 2, climbing 2, pickleball 3). The user can always add or remove sessions (COACH-R2 SES-06). Colours: A Blue short / high, B Green 1-3 min, C Orange long / low, LC lactate clearance.
- **Session**: core first, 2 exercises x 2 light sets (1-2 for non-athletes) - core supersets / monster sets may be added anywhere (COACH-R2 SES-03); up to 12 exercises + the core block for athletes (COACH-R2 SES-04); heavy squat and heavy deadlift on two different days, non-axial work (hip thrust, back extension, reverse hyper, leg press, belt squat) on the others - powerlifters may add a light technique squat / deadlift (COACH-R2 SES-01/02); muscles trained on a full-body day get 2-4 exercises (COACH-R2 SES-05); hip-dominant with push, knee-dominant with pull (UNI-11); calves 3 sets every leg day, rear delts their own sets (VOL-17). Fighters open conditioning days with a real aerobic block (ORD-09).
- **Strikers' pressing**: reduce, never cut, when punching volume is high (ATH-04) - boxing, MMA, kickboxing, karate, taekwondo.
- **Laterality**: bilateral : unilateral from 90/10 to 10/90 (UNI-02) - strength / physique start about 50/50 and end 80/20 -> 90/10; court and striking athletes 70-90 % unilateral; in season bilateral minimal (UNI-10). Contralateral loading for COD / 'getting into the hip', ipsilateral for acceleration / take-off, contra / ipsi as early-block health accessories for strength and physique (CAT-13).
- **Muscle credits**: compounds credit glutes 0.25, hip thrusts / bridges 1.0, thruster 1.0 quads / 0.5 shoulders / 0.25 glutes; KB swings are ballistic and never glute volume (COACH-R2 VOL-05). Athletic sets never count as muscle sets (VOL-10).
- **Medballs** (ATH-05, EQ-06, EQ-07): high for boxing, MMA, golf, tennis; none in the main workout for physique; never over 20 lb; no ball -> plyo push-ups / fast cable rotations / fake slam. **No bands or variable resistance anywhere** (EQ-01, EQ-12).
- **Age** (COACH-R2 ATH-08): 60+ get no Olympic lifts, plyos or depth jumps by default - optional with the warning 'Make sure that you have a fitness professional to help you understand what this means'; youth floor Olympic lifts from about 14 after a hang block. High school, college and pro = same plan, different loads (PRG-09). No rule depends on sex (ATH-09).
- **Tests** before the block (or week 1) and in the last week, never mid-block; people starting from zero test a 5RM / 3RM or 80-90 % efforts, never a 1RM or a max mile (COACH-R2 PER-07). For meet / race / fight sports the event itself is the end test.

## 3. Summary table

J / T / S / C = jump, throw, sprint, change-of-direction emphasis (0 none - 3 high, from the weekly dose). Plyo % = plyometric share of power work at block start -> block end (class target; budget in brackets when it differs). Bi:Uni = bilateral : unilateral share of lower-body compound sets, block start -> end (in season). Aerobic = sessions per week off / pre / in season. Pre / In = total weekly sets as % of the off-season week. Weekly sets = off-season build week.

| ID | Profile | Cat. | Built from | GC class | Plyo % | J/T/S/C | Bi:Uni | Aerobic | Oly /wk | Pre / In % | Main goal | Weekly sets |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| `wrestling` | Wrestling (folkstyle / freestyle / Greco-Roman) | comp. | 04 wrestling | 5 | 20 -> 25 | 1/2/1/1 | 50/50 -> 40/60 (30/70) | 4 / 2 / 2 | 3 | 60 / 45 | strength | 132.0 |
| `boxing` | Boxing | comp. | 04 boxing | 5 | 20 -> 25 (30) | 2/3/2/0 | 40/60 -> 30/70 (20/80) | 3 / 2 / 2 | 3 | 60 / 45 | power | 176.0 |
| `mma` | MMA (mixed martial arts) | comp. | 04 mma | 4 | 25 -> 40 | 2/2/2/1 | 40/60 -> 30/70 (20/80) | 4 / 2 / 2 | 3 | 60 / 45 | strength | 143.0 |
| `bjj_grappling` | Brazilian jiu-jitsu / submission grappling | comp. | 04 bjj_grappling | 5 | 20 -> 25 | 1/1/0/0 | 50/50 -> 40/60 (30/70) | 3 / 2 / 2 | 1 | 60 / 45 | strength | 99.0 |
| `judo` | Judo | comp. | new budget | 5 | 20 -> 25 | 1/1/1/1 | 50/50 -> 40/60 (30/70) | 4 / 2 / 2 | 3 | 60 / 45 | strength | 130.0 |
| `karate` | Karate (kumite) | comp. | 04 karate_taekwondo | 5 | 20 -> 25 | 1/2/2/1 | 30/70 -> 20/80 (20/80) | 3 / 2 / 2 | 1 | 60 / 45 | power | 125.0 |
| `taekwondo` | Taekwondo (sparring / kyorugi) | comp. | 04 karate_taekwondo + deltas | 5 | 20 -> 25 (28) | 1/2/2/1 | 30/70 -> 20/80 (20/80) | 3 / 2 / 2 | 1 | 60 / 45 | power | 126.0 |
| `kickboxing_muay_thai` | Kickboxing / Muay Thai | comp. | 04 kickboxing_muay_thai | 5 | 20 -> 25 | 1/2/2/1 | 30/70 -> 20/80 (20/80) | 4 / 2 / 2 | 2 | 60 / 45 | power | 129.0 |
| `powerlifting_competitive` | Powerlifting - competitive (meet lifter) | comp. | 04 powerlifting_strength | - | - | 1/0/0/0 | 50/50 -> 90/10 | 2 / 2 / 2 | 0 | 75 / 50 | strength | 73.5 |
| `weightlifting` | Olympic weightlifting (snatch / clean & jerk) - competitive | comp. | new budget | 5 | 20 -> 25 | 1/0/0/0 | 60/40 -> 85/15 (90/10) | 2 / 2 / 1 | 4 | 70 / 50 | power | 107.0 |
| `strongman` | Strongman | comp. | new budget | 5 | 20 -> 25 | 1/1/0/0 | 50/50 -> 80/20 (85/15) | 2 / 2 / 1 | 2 | 70 / 50 | strength | 108.0 |
| `crossfit_competitor` | CrossFit - competitor (FULL TIME) | comp. | 04 crossfit_competitor | - | - | 0/0/0/0 | 50/50 -> 70/30 (60/40) | 2-4 / 3-4 / 2 + event | 4 | month grid (OBSERVED) | strength | 78.0 |
| `crossfit_class` | CrossFit - class member (HALF TIME) | rec. | new budget | - | - | 0/0/0/0 | 50/50 -> 60/40 | 2 / - / - | 2 | - | endurance-strength | 37.0 |
| `physique_competitive` | Bodybuilding / physique - competitive (all NPC divisions) | comp. | 04 bodybuilding_aesthetics | - | - | 0/0/0/0 | 50/50 -> 80/20 | 4 / 4 / - | 0 | prep 93 / peak 54 | hypertrophy | 108.0 |
| `hyrox_competitive` | HYROX - competitive (Open / Pro / Doubles) | comp. | new budget | 3 | 35 -> 50 | 1/1/1/0 | 40/60 -> 30/70 (30/70) | 4 / 4 / 3 | 2 | 60 / 50 | endurance-strength | 102.0 |
| `ocr_spartan` | Obstacle course racing (Spartan and similar) | comp. | new budget | 3 | 35 -> 50 | 1/1/1/1 | 30/70 -> 20/80 (20/80) | 4 / 4 / 3 | 2 | 60 / 50 | endurance-strength | 107.0 |
| `gymnastics_artistic` | Artistic gymnastics (women's and men's) | comp. | new budget | 2 | 45 -> 60 | 1/1/1/0 | 40/60 -> 30/70 (20/80) | 2 / 2 / 2 | 2 | 60 / 45 | power | 81.0 |
| `climbing` | Rock climbing / bouldering - competitive | comp. | new budget | 5 | 20 -> 25 | 1/1/0/0 | 40/60 -> 30/70 (30/70) | 2 / 2 / 2 | 1 | 60 / 50 | strength | 82.0 |
| `golf` | Golf - competitive | comp. | 04 golf | 5 | 20 -> 25 (22) | 1/2/0/0 | 30/70 -> 20/80 (20/80) | 3 / 2 / 2 | 1 | 60 / 50 | power | 84.5 |
| `tennis` | Tennis - competitive | comp. | 04 tennis | 3 | 35 -> 50 | 2/2/2/2 | 20/80 -> 10/90 (10/90) | 3 / 2 / 2 | 1 | 60 / 45 | power | 136.5 |
| `pickleball_competitive` | Pickleball - competitive / tournament | comp. | 04 tennis + deltas | 3 | 35 -> 50 | 1/1/1/2 | 20/80 -> 10/90 (10/90) | 3 / 2 / 2 | 1 | 60 / 45 | power | 130.0 |

Class sources: boxing, karate, kickboxing, wrestling, BJJ, golf (class 5), MMA (4) and tennis (3) are the coach's (COACH-R2 ATH-01). Every other class is INFERRED and stated in each profile's `ground_contact.evidence`.

## 4. Per-sport notes

### 4.1 Wrestling (folkstyle / freestyle / Greco-Roman) - ES: Lucha olímpica y colegial (Wrestling)

- **Profile:** `wrestling` (competitive; 04 wrestling). Positions / divisions: lighter weight classes, middle weight classes, upper weights / heavyweight (see variant).
- **Demands (SCIENCE):** neck-injured wrestlers show weaker neck flexion/extension; cervical work is mostly eccentric/isometric; elite match time-motion: work 37.2 s / rest 13.8 s (~3:1), blood lactate ~14.8 mmol/L (K1b); bouts got quicker and more varied after the 2013 rules (K1); injury rate 2.33 / 1000 AE in high school vs 7.25 in college; matches riskier than practice (K2).
- **Power block:** ground-contact class 5 -> 20 % -> 25 % plyometric across the block; jump / throw / sprint / COD emphasis 1/2/1/1; plyometric contacts about 29 a week, throws about 175, Olympic exposures 3 a week (8.0 sets).
- **Resistance:** goal strength / power (relative strength for a weight class; repeat-effort power); bilateral : unilateral 50/50 -> 40/60 (30/70); upper / lower 51 / 49 %; weekly sets 132.0 (athletic 44.0, lower 35.0, upper 37.0, core 16.0).
- **Aerobic:** 4 / 2 / 2 (off / pre / in) - A + B + C + LC (period simulations 2-3 min as LC / B). Evidence: COACH-R2 ATH-06 (MMA and wrestling 4).
- **Seasons:** pre-season / pre-competition block (camp for fighters) -> 60 % of the off-season sets; competition season -> 45 % (2 lift days).
- **US calendar:** HS: winter season: practice from early November, duals and tournaments Dec - Feb, state tournaments in February - early March (K3 example state calendar; K3b); college: NCAA practice early Nov, duals from December, conference late Feb - early Mar, NCAA Championships third weekend of March (K3b); pro / elite: freestyle / Greco-Roman national and international events, mostly spring - summer (INFERRED); adult / rec: club / masters freestyle tournaments year-round (INFERRED); frequency: daily 2-h practices; 1-2 duals a week + weekend tournaments (INFERRED).
- **Injury hotspots -> prehab codes:** NECK, LOW_BACK_LOADING, PAIN_GENERAL, ACL_LANDING_CUTTING, SHOULDER_CONTACT, KNEE_GRAPPLING, ELBOW_GRAPPLING (all no-band; rules in the JSON `injury_prehab`).
- **Variants:** `wrestling_greco` Greco-Roman (HPULL +2, THROW +2, COD -2, UKD -1); `wrestling_heavyweight` Upper weights / heavyweight (BKD +2, BHD +1, HPUSH +2, PLYO -1.5).
- **Notes:** The coach's 04 wrestling budget is kept unchanged (more-resistance group, ATH-03; class 5, 25 % plyometric approved in R2-ATH-01; 4 aerobic sessions approved in R2-ATH-06). Wrestling is the one combat sport with a real US school season, so it gets a true in-season (2 lifts, hard day >= 48 h before a dual).
- **Off-season week (skeleton):**
  - Mon - knee + pull: warm-up -> core 2 x 2 light (COACH-R2 SES-03) -> medball (rotational slams + overhead backward throws) -> ballistic jump (broad jumps / box jumps) -> clean variant (hang clean -> power clean, squat pattern - COACH-R2 ATH-04) -> HEAVY SQUAT (axial day 1, COACH-R2 SES-01) + bent-over row -> contralateral split squat + pull-ups (towel pull-ups for grip) -> towel hangs / farmer holds -> calves 3 sets
  - Tue - hip + push: real aerobic block first (Orange 20-30 min or Green 2-3 min period simulations, ORD-09) -> core 2 x 2 -> plyo (sprawl landings -> penetration-step hops -> repeated shots, by Receive-Create stage) -> snatch variant (DB snatch -> power snatch (L2+), hinge pattern) -> non-axial hinge (hip thrust / back extension / reverse hyper) + DB bench or push-ups -> single-leg RDL -> neck isometrics 4-way (no bands - EQ-01) + rear delts -> calves
  - Wed - wrestling practice
  - Thu - knee + pull: core 2 x 2 -> medball -> loaded jump -> clean variant -> belt squat or leg press (non-axial) + chest-supported row -> lateral lunge / cossack (frontal plane - UNI-12) -> carries / drags (sandbag carry, sled drag) -> Copenhagen plank -> calves
  - Fri - hip + push: conditioning first (Blue short-burst repeats) -> core 2 x 2 -> plyo -> snatch variant -> HEAVY DEADLIFT / trap bar (axial day 2) + DB press -> unilateral hinge -> biceps / triceps (elbow health) -> rear delts -> calves
  - Sat - practice / competition; Sun - off; remaining aerobic sessions (colours not used yet) after practice
- **Floor-10 audit:** below 10 sets at category level: glutes, chest, side_delts, biceps, triceps (see Q1).

### 4.2 Boxing - ES: Boxeo

- **Profile:** `boxing` (competitive; 04 boxing). Positions / divisions: weight classes (no position split), amateur (3 x 3 min), pro (4-12 rounds).
- **Demands (SCIENCE):** boxing is predominantly aerobic with high lactate (post-bout ~11.8 mmol/L); elite activity:rest about 18:1.
- **Power block:** ground-contact class 5 -> 20 % -> 25 % plyometric across the block; jump / throw / sprint / COD emphasis 2/3/2/0; plyometric contacts about 59 a week, throws about 380, Olympic exposures 3 a week (9.0 sets).
- **Resistance:** goal power / strength (punch power and repeat-effort power; pressing reduced, not cut (ATH-04)); bilateral : unilateral 40/60 -> 30/70 (20/80); upper / lower 32 / 68 %; weekly sets 176.0 (athletic 79.0, lower 54.0, upper 26.0, core 17.0).
- **Aerobic:** 3 / 2 / 2 (off / pre / in) - A + B + C - one of each colour; opening block on Tue / Fri is real aerobic work (ORD-09); OBSERVED 'Sprint 20/ Recover 40' (A) + 'Cardio of any choice' 20-40 min (C). Evidence: COACH-R2 ATH-06 (boxing 3).
- **Seasons:** pre-season / pre-competition block (camp for fighters) -> 60 % of the off-season sets; competition season -> 45 % (2 lift days).
- **US calendar:** HS: no school season (USA Boxing club programs); college: club boxing (no NCAA); pro / elite: fight-driven: camps of 6-12 weeks (K39 logic shared with MMA); adult / rec: amateur events year-round; USA Boxing National Championships in December (K38b); amateur bouts 3 x 3 min (K38); frequency: amateur: 1-several bouts per tournament; pro: 2-4 fights a year (INFERRED).
- **Injury hotspots -> prehab codes:** SHOULDER_STRIKER, WRIST_HAND, NECK, LOW_BACK_ROTATIONAL, GROIN_ADDUCTOR, PAIN_GENERAL (all no-band; rules in the JSON `injury_prehab`).
- **Variants:** `boxing_heavyweight` Heavyweight (BKD +2, BHD +2, HPUSH +1, VPULL +1, PLYO -2, JLK -2).
- **Notes:** The coach's only written fighter program. The 04 budget (OBSERVED weeks 3-6 of the 8-week build-up + v1 adjustments) is reused unchanged, including the pressing rule (reduce, never cut - ATH-04). The OBSERVED week-7 mini-deload is not a default any more (COACH-R2 VOL-07: no deload inside a block); the fight taper sits after the build as its own 1-2-week block (COACH-R2 PER-06).
- **Off-season week (skeleton):**
  - Mon - knee + pull: warm-up -> core 2 x 2 light (COACH-R2 SES-03) -> medball list part 1 (rotational scoops, chest passes, slams, 1 x 10 each - LIB-22) -> ballistic jump (DB squat jumps / broad jumps) -> clean variant (clean pull -> hang power clean, squat pattern - COACH-R2 ATH-04) -> HEAVY SQUAT complex '3 Heavy SQUATs + 5 Tuck jumps + 5 DB squat jumps + 5 Squirrel jumps' (OBSERVED; contrast for L2+ off-season only - ATH-12) (axial day 1, COACH-R2 SES-01) + row -> DB contralateral LOW step-up (OBSERVED) + pull-ups -> Copenhagen plank -> calves 3 sets
  - Tue - conditioning first: a real aerobic block (OBSERVED 'Sprint 20/ Recover 40' (Blue) or 20-40 min easy (Orange); ORD-09) -> core 2 x 2 -> plyo (single-leg march jumps, squirrel jumps, rope, by Receive-Create stage) -> snatch variant (DB snatch, hinge pattern) -> non-axial hinge (hip thrust / back extension / reverse hyper) + alternating DB press (reduced, not cut - ATH-04) -> single-leg RDL -> side raises -> rear delts (own sets) -> calves
  - Wed - boxing practice (rope, bag, pads); optional Focus / core day (optional days ideally separate - ORD-10)
  - Thu - knee + pull: core 2 x 2 -> medball list part 2 -> loaded jump (hex-bar / DB jump, 10-20 % body weight - EQ-15) -> clean variant -> belt squat or leg press (non-axial) + single-arm row -> rear-foot-elevated split squat -> leg extensions / leg curls -> calves
  - Fri - conditioning first (Green 1-3 min rounds, a different colour from Tuesday) -> core 2 x 2 -> plyo -> 'Hang Power Clean & Press' (OBSERVED) -> HEAVY DEADLIFT / trap bar complex '4 Deadlifts - 5 broad jumps - 5 KB swings - 5/5 High Knee runs' (OBSERVED) (axial day 2) -> unilateral hinge -> push press + rear delts -> calves
  - Sat - sparring; Sun - off; the 3rd (and 4th) aerobic session = the colour not used yet, after practice
- **Floor-10 audit:** below 10 sets at category level: glutes, chest, side_delts, lats_upper_back, biceps, triceps (see Q1).

### 4.3 MMA (mixed martial arts) - ES: Artes marciales mixtas (MMA)

- **Profile:** `mma` (competitive; 04 mma). Positions / divisions: weight classes (no position split), amateur (3 x 3 min), pro (3 x 5 min; title 5 x 5 min).
- **Demands (SCIENCE):** MMA high:low intensity ~1:2-1:4; grappling ~1:1, striking up to 1:7.
- **Power block:** ground-contact class 4 -> 25 % -> 40 % plyometric across the block; jump / throw / sprint / COD emphasis 2/2/2/1; plyometric contacts about 68 a week, throws about 175, Olympic exposures 3 a week (9.0 sets).
- **Resistance:** goal strength / power (strength-power for takedowns and striking; grip and neck); bilateral : unilateral 40/60 -> 30/70 (20/80); upper / lower 43 / 57 %; weekly sets 143.0 (athletic 58.0, lower 39.0, upper 30.0, core 16.0).
- **Aerobic:** 4 / 2 / 2 (off / pre / in) - A + B + C + LC (5-min round simulations). Evidence: COACH-R2 ATH-06 (MMA and wrestling 4).
- **Seasons:** pre-season / pre-competition block (camp for fighters) -> 60 % of the off-season sets; competition season -> 45 % (2 lift days).
- **US calendar:** HS: no school season; college: no NCAA program; pro / elite: fight-driven: 2-3 fights a year; camps 8-12 weeks (K39); adult / rec: amateur MMA events year-round (INFERRED); frequency: 1 fight per camp.
- **Injury hotspots -> prehab codes:** NECK, SHOULDER_STRIKER, LOW_BACK_LOADING, GROIN_ADDUCTOR, WRIST_HAND, PAIN_GENERAL, KNEE_GRAPPLING, ELBOW_GRAPPLING (all no-band; rules in the JSON `injury_prehab`).
- **Variants:** `mma_heavyweight` Heavyweight (BKD +2, BHD +2, HPUSH +1, PLYO -2, JLK -2).
- **Notes:** Reused unchanged from 04 (class 4 = 40 % plyometric, approved in R2-ATH-01; 4 aerobic sessions approved in R2-ATH-06). Pull-dominant (grappling), grip and neck kept; pressing reduced, not cut, when punching volume is high (ATH-04).
- **Off-season week (skeleton):**
  - Mon - knee + pull: warm-up -> core 2 x 2 light (COACH-R2 SES-03) -> medball list part 1 (rotational throws, overhead slams, 1 x 10 each - LIB-22) -> ballistic jump (broad jumps / box jumps) -> clean variant (hang clean -> power clean, squat pattern - COACH-R2 ATH-04) -> HEAVY SQUAT (contrast with a jump for L2+ off-season - ATH-12) (axial day 1, COACH-R2 SES-01) + row -> contralateral split squat (level changes) + pull-ups -> towel hangs / farmer holds (grip) -> calves 3 sets
  - Tue - conditioning first: a real aerobic block (Orange 20-40 min or Green grappling exchanges 35-75 s at ~1:1; ORD-09) -> core 2 x 2 -> plyo (sprawl landings -> level-change hops -> lateral bounds, by Receive-Create stage) -> snatch variant (DB snatch, hinge pattern) -> non-axial hinge (hip thrust / back extension / reverse hyper) + alternating DB press (punching volume high: reduced, not cut - ATH-04) -> single-leg RDL -> neck isometrics 4-way -> rear delts (own sets) -> calves
  - Wed - MMA practice (striking / wrestling / BJJ); optional Focus / core day (optional days ideally separate - ORD-10)
  - Thu - knee + pull: core 2 x 2 -> medball list part 2 -> loaded jump (hex-bar / DB jump, 10-20 % body weight - EQ-15) -> clean variant -> belt squat or leg press (non-axial) + single-arm row -> lateral lunge / cossack (UNI-12) -> leg extensions / leg curls -> calves
  - Fri - conditioning first (Blue striking bursts 12-24 s at 1:3-1:7, a different colour from Tuesday) -> core 2 x 2 -> plyo -> power clean -> HEAVY DEADLIFT / trap bar (axial day 2) -> unilateral hinge -> sled drag + rear delts -> calves
  - Sat - sparring; Sun - off; the 3rd (and 4th) aerobic session = the colour not used yet, after practice
- **Floor-10 audit:** below 10 sets at category level: glutes, chest, side_delts, biceps, triceps (see Q1).

### 4.4 Brazilian jiu-jitsu / submission grappling - ES: Jiu-jitsu brasileño (BJJ) y grappling

- **Profile:** `bjj_grappling` (competitive; 04 bjj_grappling). Positions / divisions: gi, no-gi (see variant), weight classes / belt divisions.
- **Demands (SCIENCE):** BJJ demands high handgrip strength/endurance and isometric low-back strength; moderate glycolytic demand; effort:pause stays the same from 2- to 10-min matches; longer matches add pause time, cut grip-strength endurance and raise RPE (K6, K6b); knee 32.6 %, shoulder 11.2 %, elbow 8.4 % of injuries in high-performance athletes (K7); knee the most frequent injury (27 %) in a survey of 1140 athletes (K7b).
- **Power block:** ground-contact class 5 -> 20 % -> 25 % plyometric across the block; jump / throw / sprint / COD emphasis 1/1/0/0; plyometric contacts about 28 a week, throws about 100, Olympic exposures 1 a week (4.0 sets).
- **Resistance:** goal strength / endurance-strength (isometric grip and trunk endurance); bilateral : unilateral 50/50 -> 40/60 (30/70); upper / lower 53 / 47 %; weekly sets 99.0 (athletic 28.0, lower 28.0, upper 31.0, core 12.0).
- **Aerobic:** 3 / 2 / 2 (off / pre / in) - A + B + C - one of each colour (rolling rounds 5-6 min = B). Evidence: COACH-R2 ATH-06 (BJJ 3).
- **Seasons:** pre-season / pre-competition block (camp for fighters) -> 60 % of the off-season sets; competition season -> 45 % (2 lift days).
- **US calendar:** HS: no school season (club only); college: club only; pro / elite: IBJJF circuit: Pan Championship late March, World Championship late May (K40); ADCC / no-gi events through the year; adult / rec: local tournaments most weekends; masters divisions 30+ (INFERRED); frequency: 1-2 tournaments a month in busy periods (INFERRED).
- **Injury hotspots -> prehab codes:** NECK, LOW_BACK_LOADING, PAIN_GENERAL, KNEE_GRAPPLING, ELBOW_GRAPPLING, SHOULDER_CONTACT (all no-band; rules in the JSON `injury_prehab`).
- **Variants:** `bjj_nogi` No-gi / submission grappling (ISO_GRIP -1, BALL +1, COD +2).
- **Notes:** Reused unchanged from 04 (3 main days; least ballistic combat sport; class 5 = 25 % approved; 3 aerobic sessions approved in R2-ATH-06). New injury codes KNEE_GRAPPLING / ELBOW_GRAPPLING carry the BJJ hotspots (knee is the most injured site, K7).
- **Off-season week (skeleton):**
  - Mon - full body A (knee + pull): warm-up -> core 2 x 2 -> medball (rotational slams) -> ballistic jump -> clean variant (hang clean / KB squat clean) -> HEAVY SQUAT (axial day 1) + bent-over row -> split squat + pull-ups (gi / towel pull-ups) -> gi hangs (static grip endurance) -> calves
  - Wed - full body B (hip + push): real aerobic block first (Orange 20-30 min) -> core 2 x 2 -> plyo / landing (landing + box jumps (mostly ballistic, class 5)) -> snatch variant (KB / DB snatch) -> HEAVY DEADLIFT / trap bar (axial day 2) + DB bench -> single-leg RDL -> neck isometrics 4-way + rear delts -> calves
  - Fri - full body C: core 2 x 2 -> medball -> KB squat clean -> belt squat / leg press (non-axial) + single-arm row -> lateral lunge + DB press -> carries (farmer carry) -> biceps / triceps -> calves
  - Tue / Thu / Sat - BJJ practice; aerobic sessions after practice (one of each colour)
- **Floor-10 audit:** below 10 sets at category level: quads, glutes, chest, side_delts, biceps, triceps, calves (see Q1).

### 4.5 Judo - ES: Judo

- **Profile:** `judo` (competitive; new budget). Positions / divisions: light weight classes, middle weight classes, heavy weight classes (see variant).
- **Demands (SCIENCE):** effort:pause 2:1-3:1 with 20-30 s efforts and ~10 s pauses (K4); action times differ by championship phase (K4b); top-level competition injuries: knee ~17 %, shoulder ~16 %, elbow ~14 %; sprains and contusions; being thrown is the main mechanism (K5, K5b).
- **Power block:** ground-contact class 5 -> 20 % -> 25 % plyometric across the block; jump / throw / sprint / COD emphasis 1/1/1/1; plyometric contacts about 24 a week, throws about 150, Olympic exposures 3 a week (8.0 sets).
- **Resistance:** goal strength / power (relative strength and throwing power for a weight class); bilateral : unilateral 50/50 -> 40/60 (30/70); upper / lower 50 / 50 %; weekly sets 130.0 (athletic 39.5, lower 37.5, upper 37.0, core 16.0).
- **Aerobic:** 4 / 2 / 2 (off / pre / in) - A + B + C + LC (match simulations). Evidence: PROPOSED (judo not in R2-ATH-06; grappling at 2:1-3:1 effort:pause like wrestling = 4).
- **Seasons:** pre-season / pre-competition block (camp for fighters) -> 60 % of the off-season sets; competition season -> 45 % (2 lift days).
- **US calendar:** HS: not a school sport in most states (club / dojo); college: club / collegiate nationals (INFERRED); pro / elite: USA Judo point events: Youth Nationals March, Senior Nationals May, Junior Olympics June, President's Cup November (K41); adult / rec: dojo tournaments and masters events (INFERRED); frequency: 1 tournament a month in busy periods (INFERRED).
- **Injury hotspots -> prehab codes:** SHOULDER_CONTACT, KNEE_GRAPPLING, ELBOW_GRAPPLING, NECK, WRIST_HAND, PAIN_GENERAL (all no-band; rules in the JSON `injury_prehab`).
- **Variants:** `judo_heavyweight` Heavy weight classes (BKD +2, BHD +1, HPUSH +1, PLYO -1.5).
- **Notes:** New profile sized like 04 wrestling (more-resistance group, class 5). Judo adds gi grip work, rotational throwing power both directions and elbow care (ELBOW_GRAPPLING). Aerobic 4 is PROPOSED (judo is not in R2-ATH-06).
- **Off-season week (skeleton):**
  - Mon - knee + pull: warm-up -> core 2 x 2 light (COACH-R2 SES-03) -> medball (rotational throws both sides) -> ballistic jump (broad jumps / hip-in jumps) -> clean variant (hang clean -> power clean, squat pattern - COACH-R2 ATH-04) -> HEAVY SQUAT (axial day 1, COACH-R2 SES-01) + bent-over row -> contralateral split squat + pull-ups (judogi / towel pull-ups) -> gi hangs, towel farmer holds -> calves 3 sets
  - Tue - hip + push: real aerobic block first (Orange 20-30 min or Green 4-min match simulations, ORD-09) -> core 2 x 2 -> plyo (landing sticks -> entry hops -> repeated hops, by Receive-Create stage) -> snatch variant (DB snatch -> power snatch (L2+), hinge pattern) -> non-axial hinge (hip thrust / back extension / reverse hyper) + DB bench or push-ups -> single-leg RDL -> neck isometrics 4-way (no bands - EQ-01) + rear delts -> calves
  - Wed - judo practice (randori)
  - Thu - knee + pull: core 2 x 2 -> medball -> loaded jump -> clean variant -> belt squat or leg press (non-axial) + chest-supported row -> lateral lunge (foot sweeps) -> carries / drags (sandbag carry) -> Copenhagen plank -> calves
  - Fri - hip + push: conditioning first (Blue 20-30 s on / 10 s off repeats) -> core 2 x 2 -> plyo -> snatch variant -> HEAVY DEADLIFT / trap bar (axial day 2) + DB press -> unilateral hinge -> biceps / triceps (elbow health) -> rear delts -> calves
  - Sat - randori / tournament; Sun - off; remaining aerobic sessions (colours not used yet) after practice
- **Floor-10 audit:** below 10 sets at category level: glutes, chest, side_delts, biceps, triceps (see Q1).

### 4.6 Karate (kumite) - ES: Karate (kumite)

- **Profile:** `karate` (competitive; 04 karate_taekwondo). Positions / divisions: kumite (sparring) - weight classes, kata (forms) - see variant.
- **Demands (SCIENCE):** karate official matches: high-intensity actions 1.5 s, effort 10 s / rest 16 s; taekwondo effort 8 s / pause 8 s (1:1).
- **Power block:** ground-contact class 5 -> 20 % -> 25 % plyometric across the block; jump / throw / sprint / COD emphasis 1/2/2/1; plyometric contacts about 22 a week, throws about 200, Olympic exposures 1 a week (4.0 sets).
- **Resistance:** goal power / strength (explosive single-leg entries and kicks; low body mass); bilateral : unilateral 30/70 -> 20/80 (20/80); upper / lower 31 / 69 %; weekly sets 125.0 (athletic 48.0, lower 40.0, upper 18.0, core 16.0).
- **Aerobic:** 3 / 2 / 2 (off / pre / in) - A + B + C - one of each colour; a 4th (Blue) on request (COACH-R2 SES-06). Evidence: COACH-R2 ATH-06 (kickboxing and karate 3-4).
- **Seasons:** pre-season / pre-competition block (camp for fighters) -> 60 % of the off-season sets; competition season -> 45 % (2 lift days).
- **US calendar:** HS: no school season (dojo / club); college: club only; pro / elite: USA Karate National Championships & Team Trials in July (K42); WKF international events; adult / rec: regional tournaments year-round (INFERRED); frequency: 1 tournament a month in busy periods (INFERRED).
- **Injury hotspots -> prehab codes:** HAMSTRING, HIP_FLEXOR, GROIN_ADDUCTOR, ANKLE_SPRAIN, PAIN_GENERAL (all no-band; rules in the JSON `injury_prehab`).
- **Variants:** `karate_kata` Kata (forms) (COD -4, THROW -6, SPRINT -2, UKD +1, UHD +1).
- **Notes:** 04 'karate_taekwondo' is split into karate (this profile, numbers unchanged) and taekwondo (small deltas). Class 5 = 25 % plyometric (approved R2-ATH-01: 'boxing, karate, kickboxing ... 25 %'); 3-4 aerobic sessions approved (R2-ATH-06).
- **Off-season week (skeleton):**
  - Mon - knee + pull: warm-up -> core 2 x 2 light (COACH-R2 SES-03) -> medball list part 1 (rotational throws both sides, 1 x 10 each - LIB-22) -> ballistic jump (single-leg box jumps / broad jumps) -> clean variant (hang clean / KB squat clean, squat pattern - COACH-R2 ATH-04) -> HEAVY SQUAT (goblet / front squat; karate keeps bilateral low - 30/70 -> 20/80) (axial day 1, COACH-R2 SES-01) + row -> contralateral split squat + pull-ups -> Copenhagen plank -> calves 3 sets
  - Tue - conditioning first: a real aerobic block (Orange 20-30 min; ORD-09) -> core 2 x 2 -> plyo (low-amplitude stance bounce, skips, single-leg hops, by Receive-Create stage) -> snatch variant (DB snatch / jump shrug, hinge pattern) -> non-axial hinge (hip thrust / back extension / reverse hyper) + alternating DB press (reduced when striking volume is high - ATH-04 extended) -> single-leg RDL -> loaded hip flexion (Focus) + hamstring length-strength (RDL eccentrics) -> rear delts (own sets) -> calves
  - Wed - karate practice; optional Focus / core day (optional days ideally separate - ORD-10)
  - Thu - knee + pull: core 2 x 2 -> medball list part 2 -> loaded jump (hex-bar / DB jump, 10-20 % body weight - EQ-15) -> clean variant -> belt squat or leg press (non-axial) + single-arm row -> lateral lunge / cossack (UNI-12) -> leg extensions / leg curls -> calves
  - Fri - conditioning first (Blue efforts ~8-10 s at 1:1-1:4, a different colour from Tuesday) -> core 2 x 2 -> plyo -> hang power clean -> HEAVY DEADLIFT / trap bar (axial day 2) -> unilateral hinge -> side raises + rear delts -> calves
  - Sat - kumite / practice; Sun - off; the 3rd (and 4th) aerobic session = the colour not used yet, after practice
- **Floor-10 audit:** below 10 sets at category level: glutes, chest, side_delts, biceps, triceps (see Q1).

### 4.7 Taekwondo (sparring / kyorugi) - ES: Taekwondo (combate / kyorugi)

- **Profile:** `taekwondo` (competitive; 04 karate_taekwondo + deltas). Positions / divisions: sparring (kyorugi) - weight classes, poomsae (forms) - see variant.
- **Demands (SCIENCE):** competition injury rate 24.86 vs practice 4.79 / 1000 AE; foot / ankle the most common location, ligament sprains, contact mechanism (K8); taekwondo effort ~8 s / pause ~8 s (1:1) (04 science); karate official matches: high-intensity actions 1.5 s, effort 10 s / rest 16 s; taekwondo effort 8 s / pause 8 s (1:1).
- **Power block:** ground-contact class 5 -> 20 % -> 25 % plyometric across the block; jump / throw / sprint / COD emphasis 1/2/2/1; plyometric contacts about 22 a week, throws about 180, Olympic exposures 1 a week (4.0 sets).
- **Resistance:** goal power / strength (kicking power and speed; hip flexor and hamstring length-strength); bilateral : unilateral 30/70 -> 20/80 (20/80); upper / lower 31 / 69 %; weekly sets 126.0 (athletic 48.0, lower 41.0, upper 18.0, core 16.0).
- **Aerobic:** 3 / 2 / 2 (off / pre / in) - A + B + C - one of each colour. Evidence: PROPOSED (taekwondo not named in R2-ATH-06; = karate 3-4).
- **Seasons:** pre-season / pre-competition block (camp for fighters) -> 60 % of the off-season sets; competition season -> 45 % (2 lift days).
- **US calendar:** HS: no school season; college: club / collegiate taekwondo (INFERRED); pro / elite: USA Taekwondo National Championships in July (K42b); World Taekwondo events; adult / rec: regional tournaments year-round (INFERRED); frequency: 1 tournament a month in busy periods (INFERRED).
- **Injury hotspots -> prehab codes:** HAMSTRING, HIP_FLEXOR, GROIN_ADDUCTOR, ANKLE_SPRAIN, PAIN_GENERAL, ACHILLES_CALF (all no-band; rules in the JSON `injury_prehab`).
- **Variants:** `taekwondo_poomsae` Poomsae (forms) (COD -4, THROW -6, SPRINT -2, UKD +1, BALL +1).
- **Notes:** Split out of 04 'karate_taekwondo' with small PROPOSED deltas (a little more low-amplitude bounce, one more ballistic set, two fewer throw sets, one more hamstring set). Plyometric share 28 % vs karate 25 % because of the bouncing stance.
- **Off-season week (skeleton):**
  - Mon - knee + pull: warm-up -> core 2 x 2 light (COACH-R2 SES-03) -> medball list part 1 (rotational throws both sides, 1 x 10 each - LIB-22) -> ballistic jump (single-leg box jumps, scissor jumps) -> clean variant (hang clean / KB squat clean, squat pattern - COACH-R2 ATH-04) -> HEAVY SQUAT (goblet / front squat) (axial day 1, COACH-R2 SES-01) + row -> contralateral split squat + pull-ups -> Copenhagen plank -> calves 3 sets
  - Tue - conditioning first: a real aerobic block (Orange 20-30 min; ORD-09) -> core 2 x 2 -> plyo (stance bounce (low amplitude), switch hops, single-leg hops, by Receive-Create stage) -> snatch variant (DB snatch, hinge pattern) -> non-axial hinge (hip thrust / back extension / reverse hyper) + alternating DB press -> single-leg RDL -> loaded hip flexion (Focus) + Nordic / slider curls -> rear delts (own sets) -> calves
  - Wed - taekwondo practice; optional Focus / core day (optional days ideally separate - ORD-10)
  - Thu - knee + pull: core 2 x 2 -> medball list part 2 -> loaded jump (hex-bar / DB jump, 10-20 % body weight - EQ-15) -> clean variant -> belt squat or leg press (non-axial) + single-arm row -> lateral lunge -> leg extensions / leg curls -> calves
  - Fri - conditioning first (Blue efforts ~8 s at 1:1, a different colour from Tuesday) -> core 2 x 2 -> plyo -> hang power clean -> HEAVY DEADLIFT / trap bar (axial day 2) -> unilateral hinge -> rear delts -> calves
  - Sat - sparring / practice; Sun - off; the 3rd (and 4th) aerobic session = the colour not used yet, after practice
- **Floor-10 audit:** below 10 sets at category level: glutes, chest, side_delts, biceps, triceps (see Q1).

### 4.8 Kickboxing / Muay Thai - ES: Kickboxing / Muay Thai

- **Profile:** `kickboxing_muay_thai` (competitive; 04 kickboxing_muay_thai). Positions / divisions: weight classes (no position split), amateur (3 x 2-3 min), pro (3-5 x 3 min).
- **Demands (SCIENCE):** elite kickboxing HIA 2.2 s, LIA 2.3 s, pauses 5.4 s; fighting:non-fighting 1:1.
- **Power block:** ground-contact class 5 -> 20 % -> 25 % plyometric across the block; jump / throw / sprint / COD emphasis 1/2/2/1; plyometric contacts about 29 a week, throws about 240, Olympic exposures 2 a week (6.0 sets).
- **Resistance:** goal power / strength (kicking power, clinch strength, neck); bilateral : unilateral 30/70 -> 20/80 (20/80); upper / lower 35 / 65 %; weekly sets 129.0 (athletic 51.0, lower 40.0, upper 22.0, core 16.0).
- **Aerobic:** 4 / 2 / 2 (off / pre / in) - A + B + C + (LC on request). Evidence: COACH-R2 ATH-06 (kickboxing and karate 3-4).
- **Seasons:** pre-season / pre-competition block (camp for fighters) -> 60 % of the off-season sets; competition season -> 45 % (2 lift days).
- **US calendar:** HS: no school season; college: club only; pro / elite: fight-driven (INFERRED); adult / rec: amateur events year-round (INFERRED); frequency: 1 fight per camp.
- **Injury hotspots -> prehab codes:** GROIN_ADDUCTOR, HIP_FLEXOR, NECK, SHOULDER_STRIKER, LOW_BACK_ROTATIONAL, PAIN_GENERAL (all no-band; rules in the JSON `injury_prehab`).
- **Variants:** `muay_thai_clinch` Muay Thai (clinch heavy) (ISO_NECK +2, HPULL +1, ISO_GRIP +2).
- **Notes:** Reused unchanged from 04. Class 5 = 25 % (approved R2-ATH-01); aerobic 3-4 approved (R2-ATH-06) - default 4 for Muay Thai / kickboxing round lengths, 3 on request.
- **Off-season week (skeleton):**
  - Mon - knee + pull: warm-up -> core 2 x 2 light (COACH-R2 SES-03) -> medball list part 1 (rotational throws both sides, 1 x 10 each - LIB-22) -> ballistic jump (single-leg box jumps / broad jumps) -> clean variant (hang power clean, squat pattern - COACH-R2 ATH-04) -> HEAVY SQUAT (front / goblet squat) (axial day 1, COACH-R2 SES-01) + row -> contralateral split squat + pull-ups -> Copenhagen plank -> calves 3 sets
  - Tue - conditioning first: a real aerobic block (Orange 20-40 min; ORD-09) -> core 2 x 2 -> plyo (switch-kick hops, skips, rope, by Receive-Create stage) -> snatch variant (DB snatch, hinge pattern) -> non-axial hinge (hip thrust / back extension / reverse hyper) + alternating DB press (reduced, not cut - ATH-04) -> single-leg RDL -> neck isometrics 4-way (clinch) + loaded hip flexion -> rear delts (own sets) -> calves
  - Wed - Muay Thai / kickboxing practice; optional Focus / core day (optional days ideally separate - ORD-10)
  - Thu - knee + pull: core 2 x 2 -> medball list part 2 -> loaded jump (hex-bar / DB jump, 10-20 % body weight - EQ-15) -> clean variant -> belt squat or leg press (non-axial) + single-arm row -> lateral lunge / cossack (UNI-12) -> leg extensions / leg curls -> calves
  - Fri - conditioning first (Green 3-min rounds, a different colour from Tuesday) -> core 2 x 2 -> plyo -> hang power clean -> HEAVY DEADLIFT / trap bar (axial day 2) -> unilateral hinge -> rear delts + side raises -> calves
  - Sat - sparring; Sun - off; the 3rd (and 4th) aerobic session = the colour not used yet, after practice
- **Floor-10 audit:** below 10 sets at category level: glutes, chest, side_delts, biceps, triceps (see Q1).

### 4.9 Powerlifting - competitive (meet lifter) - ES: Powerlifting (levantamiento de potencia) - competitivo

- **Profile:** `powerlifting_competitive` (competitive; 04 powerlifting_strength). Positions / divisions: raw / classic, equipped (single-ply) - same profile, technique work differs, weight classes.
- **Demands (SCIENCE):** powerlifting injuries 1.0-4.4 / 1000 h; low back / pelvis, shoulder and elbow / upper arm most common (K9); peaking: cut volume, keep intensity; taper about 1-2 weeks (K10).
- **Power block:** ground-contact class n/a; jump / throw / sprint / COD emphasis 1/0/0/0; plyometric contacts about 17 a week, throws about 0, Olympic exposures 0 a week (0 sets).
- **Resistance:** goal strength / hypertrophy (max squat, bench and deadlift on the platform); bilateral : unilateral 50/50 -> 90/10; upper / lower 61 / 39 %; weekly sets 73.5 (athletic 3.0, lower 24.5, upper 38.0, core 8.0).
- **Aerobic:** 2 / 2 / 2 (off / pre / in) - C + C - two easy Orange sessions (COACH-R2 ATH-06). Evidence: COACH-R2 ATH-06 (powerlifters 2 easy, Orange).
- **Seasons:** meet-prep (peaking) block 4-8 weeks: sets about 75 % of the build block, intensity rising to singles at RPE 8-9; last 1-2 weeks = taper (volume -30-60 %, intensity kept) - SCIENCE K10, COACH-R2 PER-06 -> 75 % of the off-season sets; meet week / between close meets: 2-3 short sessions, openers practised, no new exercises -> 50 % (3 lift days).
- **US calendar:** HS: some states run high-school powerlifting meets (INFERRED); college: collegiate nationals (INFERRED); pro / elite: national federations (USAPL, USPA ...) run meets year-round; national championships in summer (INFERRED); adult / rec: local meets most months; masters divisions by age (INFERRED); frequency: 2-4 meets a year (INFERRED).
- **Injury hotspots -> prehab codes:** LOW_BACK_LOADING, PAIN_GENERAL, BICEPS_TENDON (all no-band; rules in the JSON `injury_prehab`).
- **Notes:** Competitive meet lifter. The 04 'powerlifting_strength' budget (OBSERVED STRENGTH-8 conjugate) is reused unchanged; gen-pop clients who just want to get stronger stay on 04 'powerlifting_strength'. New here: meet-prep block + taper, the approved light technique squat / deadlift exception (R2-SES-02), 2 easy Orange sessions (R2-ATH-06), BICEPS_TENDON care for mixed grips.
- **Off-season week (skeleton):**
  - Mon - lower max effort ('the work'): warm-up -> core 1-2 x 2 light (COACH-R2 SES-03) -> HEAVY SQUAT or box squat to RPE 8-9 (axial day 1, COACH-R2 SES-01) -> 'the accessory' opposite-dominance (snatch-grip RDL is axial - keep it light or use back extension / reverse hyper on squat weeks) -> 'the nuance' (unilateral contra / ipsi lunges weeks 1-4 only - CAT-13) -> 'the survival' -> calves 3 sets
  - Wed - upper max effort: core -> bench press to RPE 8-9 -> close-grip / incline press -> rows (pull every day - OBSERVED) -> triceps + rear delts (own sets)
  - Thu - plyo 'EASY' 3 x 6 (weighted depth drop / depth drop & jump / high squat jumps - OBSERVED potentiator) -> lower dynamic effort: HEAVY DEADLIFT week = deadlift speed pulls + heavy pull (axial day 2); squat week = light speed box squat (the approved powerlifter technique exception, COACH-R2 SES-02) -> belt squat / leg press -> hamstrings -> calves
  - Sat - upper dynamic effort: speed bench 'FAST' -> overhead or incline -> pull-ups / rows -> biceps (mixed-grip health - BICEPS_TENDON) -> rear delts
  - Tue / Fri / Sun - off or easy Orange cardio x 2 (COACH-R2 ATH-06)
- **Floor-10 audit:** below 10 sets at category level: glutes, hamstrings, side_delts, biceps, triceps, calves (see Q1).

### 4.10 Olympic weightlifting (snatch / clean & jerk) - competitive - ES: Halterofilia / levantamiento olímpico (Weightlifting) - competitivo

- **Profile:** `weightlifting` (competitive; new budget). Positions / divisions: weight classes, youth / junior / senior / masters age groups.
- **Demands (SCIENCE):** weightlifting injuries 2.4-3.3 / 1000 h; knee (mostly tendinitis), low back, shoulder, hands (K9); a second daily high-intensity session gave young elite weightlifters no extra gain (K11).
- **Power block:** ground-contact class 5 -> 20 % -> 25 % plyometric across the block; jump / throw / sprint / COD emphasis 1/0/0/0; plyometric contacts about 6 a week, throws about 0, Olympic exposures 4 a week (32.0 sets).
- **Resistance:** goal power / strength (snatch and clean & jerk totals); bilateral : unilateral 60/40 -> 85/15 (90/10); upper / lower 36 / 64 %; weekly sets 107.0 (athletic 36.0, lower 35.0, upper 20.0, core 16.0).
- **Aerobic:** 2 / 2 / 1 (off / pre / in) - C + C (easy). Evidence: PROPOSED (= powerlifters 2 easy Orange, COACH-R2 ATH-06).
- **Seasons:** meet-prep block 4-6 weeks: total sets about 70 %, competition-lift intensity up (singles / doubles 85-95 %), then a 1-2-week taper (COACH-R2 PER-06, PROPOSED numbers) -> 70 % of the off-season sets; meet week: openers only (about 2-3 short sessions) -> 50 % (3 lift days).
- **US calendar:** HS: no NFHS season; USAW youth events (K12); college: National University Championships in April (K12); pro / elite: USAW National Championships week in June; North American Open series March / September / December (K12); adult / rec: local USAW meets year-round; Masters Nationals in April (K12); frequency: 2-4 meets a year (INFERRED).
- **Injury hotspots -> prehab codes:** PATELLAR_TENDON, LOW_BACK_LOADING, WRIST_HAND, SHOULDER_GYMNASTIC, PAIN_GENERAL (all no-band; rules in the JSON `injury_prehab`).
- **Variants:** `weightlifting_advanced` L3 / national-level lifter (5-6 days) (TE +10, BKD +4, BHD +1, VPUSH +2).
- **Notes:** Scaffold only. The coach said competitive Olympic lifting 'becomes a nuance, and now the program needs to change to Olympic weightlifting programming' (R2-GEN-06). This is the one profile where % of each lift's 1RM is the default. The two-heavy-squat-days tradition is reconciled with R2-SES-01 by making the second squat light-moderate and the pull day the 'deadlift' day - open question Q2.
- **Off-season week (skeleton):**
  - Mon - snatch + squat: warm-up -> core 2 x 2 light (COACH-R2 SES-03) -> box jumps 2 x 3 (potentiation) -> snatch (or hang / power snatch by level) 5-6 sets x 1-3 -> snatch pull 3-4 x 3 -> HEAVY BACK SQUAT (axial day 1, COACH-R2 SES-01) -> rows -> calves 3 sets
  - Tue - clean & jerk + upper: core 2 x 2 -> clean & jerk 5-6 sets x 1-2 (+1) -> jerk drives / push press -> pull-ups -> rear delts -> calves
  - Wed - off or easy Orange (COACH-R2 ATH-06 = powerlifters)
  - Thu - snatch technique + front squat: core -> hang snatch / snatch balance (L2+) -> FRONT SQUAT moderate (second squat exposure kept light-moderate, like the approved powerlifter exception - COACH-R2 SES-02; open question Q2) -> split squats -> calves
  - Fri - clean + pulls: core -> power clean / clean 5 x 2 -> HEAVY clean deadlift / clean pull (axial day 2) -> RDL light or back extension -> push press -> calves
  - Sat - optional (L3): technique / max-out day by the coach's eye; Sun off; easy Orange
- **Floor-10 audit:** below 10 sets at category level: glutes, hamstrings, chest, side_delts, lats_upper_back, biceps, triceps (see Q1).

### 4.11 Strongman - ES: Strongman (pruebas de fuerza)

- **Profile:** `strongman` (competitive; new budget). Positions / divisions: weight classes (lightweight / middleweight / heavyweight / open), novice / masters divisions.
- **Demands (SCIENCE):** 82 % of strongman athletes injured in a year, 5.5 / 1000 h; low back 24 %, shoulder 21 %, biceps 11 %, knee 11 %; implement training 1.9x riskier per exposure (K13); the yoke carry produced the highest spine loads of the events tested; stones load the back in a flexed posture (K14).
- **Power block:** ground-contact class 5 -> 20 % -> 25 % plyometric across the block; jump / throw / sprint / COD emphasis 1/1/0/0; plyometric contacts about 8 a week, throws about 20, Olympic exposures 2 a week (6.0 sets).
- **Resistance:** goal strength / hypertrophy (absolute strength on events; size); bilateral : unilateral 50/50 -> 80/20 (85/15); upper / lower 62 / 38 %; weekly sets 108.0 (athletic 12.0, lower 32.0, upper 52.0, core 12.0).
- **Aerobic:** 2 / 2 / 1 (off / pre / in) - B (event medley) + C (easy). Evidence: PROPOSED (not in R2-ATH-06; powerlifters 2 approved; strongman adds event medleys).
- **Seasons:** contest prep 4-6 weeks: events at contest weights / distances, total sets about 70 %, then a 1-2-week taper (COACH-R2 PER-06; numbers PROPOSED) -> 70 % of the off-season sets; contest week: openers / light event practice only -> 50 % (3 lift days).
- **US calendar:** HS: none; college: none; pro / elite: pro strongman circuit (INFERRED); adult / rec: Strongman Corporation local shows year-round; Nationals in October (K14b); frequency: 2-4 contests a year (INFERRED).
- **Injury hotspots -> prehab codes:** LOW_BACK_LOADING, BICEPS_TENDON, SHOULDER_GYMNASTIC, PATELLAR_TENDON, PAIN_GENERAL (all no-band; rules in the JSON `injury_prehab`).
- **Notes:** New. Sized like 04 powerlifting plus overhead, carries and loading events. Carries go in ISO_GRIP (the library's empty CARRY / DRAGS columns, LIB-19). The yoke is treated as an axial lift and shares the squat day (INFERRED from K14) - confirm with the coach.
- **Off-season week (skeleton):**
  - Mon - squat + yoke: warm-up -> core 2 x 2 light -> box jump 2 x 3 -> HEAVY SQUAT (axial day 1) -> yoke runs (axial - stays on the squat day, INFERRED) -> sandbag lunges -> leg curls -> calves 3 sets
  - Tue - overhead: core -> log clean & press (event) -> push press / axle press -> DB incline press -> rows -> triceps -> side raises + rear delts
  - Thu - deadlift + loading: core -> overhead backward medball throw -> HEAVY DEADLIFT / axle deadlift (axial day 2) -> stones or sandbag-to-shoulder (moderate) -> back extension -> biceps (eccentric - BICEPS_TENDON) -> calves
  - Sat - moving events + upper: core -> farmers carry / frame carry, sled drag or truck push (light-moderate, non-axial day) -> pull-ups -> DB bench -> grip -> event medley 60-90 s (Green) as the conditioning piece
  - Wed / Fri / Sun - off; 1 easy Orange
- **Floor-10 audit:** below 10 sets at category level: glutes, chest, side_delts, biceps, triceps, calves (see Q1).

### 4.12 CrossFit - competitor (FULL TIME) - ES: CrossFit - competidor (FULL TIME)

- **Profile:** `crossfit_competitor` (competitive; 04 crossfit_competitor). Positions / divisions: individual, team, age groups (masters / teens).
- **Demands (SCIENCE):** CrossFit injury reviews: shoulder 6.7-40.6% of injuries (gymnastics), low back 12.9-36% (powerlifting movements); CrossFit injuries 3.2 / 1000 h; shoulders, then back and knees (K15).
- **Power block:** ground-contact class n/a; jump / throw / sprint / COD emphasis 0/0/0/0; plyometric contacts about 0 a week, throws about 0, Olympic exposures 4 a week (0 sets).
- **Resistance:** goal strength / power (strength, Olympic lifting, gymnastics skill and mixed-modal capacity); bilateral : unilateral 50/50 -> 70/30 (60/40); upper / lower 49 / 51 %; weekly sets 78.0 (athletic 0.0, lower 36.0, upper 34.0, core 8.0).
- **Aerobic:** 2-4 / 3-4 / 2 + event (off / pre / in) - level 1 C; level 2 C + B; level 3 C + B + A; level 4 lactate clearance (OBSERVED). Evidence: OBSERVED 'EXAMPLE CROSSFIT SPLIT' (aerobic levels 1-4: C -> C,B -> C,B,A -> lactate clearance).
- **Seasons:** the coach's OBSERVED month grid (strength months -> power months -> TEST / PEAK month).
- **US calendar:** HS: teen divisions online; college: none; pro / elite: CrossFit Games season 2026: Open Feb 26 - Mar 16, quarterfinals Mar 26-30, online semifinals May-June, Games July 24-26 (K16); adult / rec: local throwdowns year-round; masters divisions (INFERRED); frequency: Open: 1 workout a week x 3; local events monthly (INFERRED).
- **Injury hotspots -> prehab codes:** SHOULDER_GYMNASTIC, LOW_BACK_LOADING, WRIST_HAND, PAIN_GENERAL (all no-band; rules in the JSON `injury_prehab`).
- **Notes:** Reused unchanged from 04 (the coach's quality x month x level macro is his own annual plan for competitors). The 2026 season dates (K16) let the generator map the macro's TEST / PEAK month onto the Open.
- **Off-season week (skeleton):**
  - OBSERVED 'COMPETE CROSSFIT SPLIT' (month grid decides which rows are active): Mon knee-dominant strength + snatch + lower resistance + aerobic
  - Tue pull + clean + upper resistance + skill 'T2B/ DUBS' + WOD
  - Wed OFF
  - Thu hip-dominant strength + snatch + lower resistance + aerobic
  - Fri push + clean + upper resistance + skill 'H.S./ DUBS' + WOD
  - Sat aerobic in level 3-4 aerobic months (AUG, SEPT, NOV, DEC, MAY); Sun OFF
  - v1.1 additions: core first 2 x 2 light (COACH-R2 SES-03); Mon knee day = heavy squat (axial day 1) and Thu hip day = heavy deadlift (axial day 2) (COACH-R2 SES-01); calves 3 sets on Mon / Thu, rear delts own sets (VOL-17)
- **Floor-10 audit:** below 10 sets at category level: glutes, chest, side_delts, biceps, triceps, calves (see Q1).

### 4.13 CrossFit - class member (HALF TIME) - ES: CrossFit - miembro de clase (HALF TIME)

- **Profile:** `crossfit_class` (recreational; new budget). Positions / divisions: -.
- **Demands (SCIENCE):** CrossFit injuries 3.2 / 1000 h; shoulders, then back and knees (K15).
- **Power block:** ground-contact class n/a; jump / throw / sprint / COD emphasis 0/0/0/0; plyometric contacts about 0 a week, throws about 0, Olympic exposures 2 a week (6.0 sets).
- **Resistance:** goal endurance-strength / strength (general fitness, strength once a week per lift, WOD capacity); bilateral : unilateral 50/50 -> 60/40; upper / lower 37 / 63 %; weekly sets 37.0 (athletic 6.0, lower 12.0, upper 7.0, core 12.0).
- **Aerobic:** 2 / - / - (off / pre / in) - aerobic level 3-4 = C, B, A / lactate clearance (OBSERVED class split). Evidence: OBSERVED class split ('AEROBIC CAPACITY' LVL 4 Mon, LVL 3 Thu) + WODs; COACH-ANSWER ATH-07 general rule is 3 - the user can add the 3rd (COACH-R2 SES-06).
- **US calendar:** HS: -; college: -; pro / elite: -; adult / rec: no season; the CrossFit Open (Feb-Mar) is open to every member (K16); frequency: 3-6 classes a week.
- **Injury hotspots -> prehab codes:** SHOULDER_GYMNASTIC, LOW_BACK_LOADING, WRIST_HAND, PAIN_GENERAL (all no-band; rules in the JSON `injury_prehab`).
- **Notes:** Promoted from the 04 variant to its own recreational profile because it is the base of the coach's 'CrossFit-style bootcamp' sample plan (R2-GEN-07). Only the strength / power slots are counted as sets; the WOD carries most of the work, so most muscles sit below the floor of 10 sets - open question Q10.
- **Off-season week (skeleton):**
  - Mon - warm-up / skill (DUBS) -> core 1-2 x 2 light (COACH-R2 SES-03) -> STRENGTH back squat 3 x 7 -> 3 x 4 (HALF TIME) (axial day 1) -> WOD -> calves 3 sets; aerobic 'LVL 4'
  - Tue - warm-up / skill -> core -> STRENGTH press + POWER snatch -> WOD -> rear delts
  - Wed - WOD only (INFERRED)
  - Thu - warm-up / skill (GYMNASTICS) -> core -> STRENGTH deadlift (axial day 2) -> WOD -> calves 3 sets; aerobic 'LVL 3'
  - Fri - warm-up / skill -> core -> POWER clean -> WOD
  - Sat - WOD only (INFERRED); Sun off
  - week 8: 'LVL 5 = Work up to 1RM' only for members who finished a block; others test a 3-5RM (COACH-R2 PER-07)
- **Floor-10 audit:** below 10 sets at category level: quads, glutes, hamstrings, chest, side_delts, lats_upper_back, biceps, triceps, calves (see Q1).

### 4.14 Bodybuilding / physique - competitive (all NPC divisions) - ES: Fisicoculturismo y físico (Bodybuilding / Physique) - competitivo

- **Profile:** `physique_competitive` (competitive; 04 bodybuilding_aesthetics). Positions / divisions: men's bodybuilding, classic physique, men's physique, bikini, wellness, figure, women's physique / bodybuilding.
- **Demands (SCIENCE):** Schoenfeld 2017: graded dose-response up to ~10+ sets/muscle/week; prep: lose ~0.5-1 % body weight per week; peak-week dehydration can be dangerous (K24); natural elite bodybuilders pre-contest: ~5 days / week, ~8-17 direct sets per muscle (K25, K25b); competitors cut volume for most muscle groups and lengthen cardio in prep (K25c).
- **Power block:** ground-contact class n/a; jump / throw / sprint / COD emphasis 0/0/0/0; plyometric contacts about 0 a week, throws about 0, Olympic exposures 0 a week (0 sets).
- **Resistance:** goal hypertrophy / strength (muscle size, symmetry and conditioning for the division); bilateral : unilateral 50/50 -> 80/20; upper / lower 50 / 50 %; weekly sets 108.0 (athletic 0.0, lower 44.0, upper 44.0, core 8.0).
- **Aerobic:** 4 / 4 / - (off / pre / in) - A + B + C + C (second easy Orange) + optional walks. Evidence: COACH-ANSWER ATH-07 + COACH-R2 SES-06 (4 for every aesthetics / physique client; the 4th = a second easy Orange; long walks 20-30 min after workouts; adjustable up or down).
- **Seasons:** contest prep 93 % (12-20 weeks, 1-2 blocks), peak week 54 %.
- **US calendar:** HS: teen divisions at some shows (INFERRED); college: collegiate divisions at some shows (INFERRED); pro / elite: NPC / IFBB Pro League shows; most amateur shows run in spring and fall (INFERRED); adult / rec: masters divisions 35+ / 40+ / 50+ (INFERRED); frequency: 1-3 shows a season; prep 12-20 weeks (K25c and practitioner range, INFERRED).
- **Injury hotspots -> prehab codes:** PAIN_GENERAL, HIGH_VOLUME_CONSTRAINT (all no-band; rules in the JSON `injury_prehab`).
- **Variants:** `physique_mens_bodybuilding` Men's bodybuilding (ISO_QUAD +2, ISO_HAM +2, VPULL +2, HPULL +2); `physique_classic` Classic physique (VPULL +2, ISO_SIDE +2, ISO_QUAD +2, ISO_HAM +1); `physique_mens_physique` Men's physique (ISO_SIDE +4, VPULL +2, HPUSH +2, BKD -2, ISO_QUAD -2); `physique_bikini` Bikini (BHD +2, UHD +2, ISO_SIDE +3, ISO_HAM +1, HPUSH -2); `physique_wellness` Wellness (BKD +2, BHD +2, UKD +2, UHD +2, ISO_QUAD +2, ISO_HAM +2, HPUSH -2, VPUSH -2); `physique_figure` Figure (ISO_SIDE +4, VPULL +2, ISO_QUAD +2); `physique_womens_physique` Women's physique / bodybuilding (VPULL +2, HPULL +2, ISO_QUAD +2, ISO_HAM +2).
- **Notes:** Uses the coach's 04 'bodybuilding_aesthetics' budget unchanged (non-competitive aesthetics clients stay on that profile). Divisions are variants with PROPOSED priority-muscle deltas (K26 judging). Aerobic = 4 incl. a second easy Orange + walks, adjustable (R2-SES-06). Contest prep is 1-2 full blocks; peak week has no new exercises. No nutrition or water advice: the coach wants workouts only (R2-GEN-04).
- **Off-season week (skeleton):**
  - OBSERVED BYOP AESTHETICS 4-day A / B / OPT: Mon A1 - core 1 x 2 -> calves first only if a priority (ORD-04) -> HEAVY SQUAT / bilateral KD (axial day 1) -> horizontal pull -> unilateral KD (same-pattern pairing to drive the muscle - UNI-06) -> vertical pull -> biceps -> leg extensions
  - Tue B1 - core -> bilateral HD: barbell RDL / deadlift (axial day 2, COACH-R2 SES-01) -> horizontal push -> unilateral HD -> vertical push -> leg curls -> triceps -> side raises
  - Wed - optional day: Focus 1 / Focus 2 on the division's priority muscles (2-3 sets each, ORD-11) + cardio + core
  - Thu A2 - leg press / hack / belt squat (non-axial) + the A pattern, 2-4 exercises per muscle trained (COACH-R2 SES-05) -> calves
  - Fri B2 - hip thrust / back extension (non-axial) + the B pattern -> rear delts (own sets) -> calves
  - Sat - optional day (Focus + cardio); Sun off; aerobic 4 a week + walks after workouts
- **Floor-10 audit:** below 10 sets at category level: glutes, chest, side_delts, biceps, triceps (see Q1).

### 4.15 HYROX - competitive (Open / Pro / Doubles) - ES: HYROX - competitivo (Open / Pro / Doubles)

- **Profile:** `hyrox_competitive` (competitive; new budget). Positions / divisions: Open division, Pro division (heavier stations - see variant), Doubles / relay (see variant), age groups.
- **Demands (SCIENCE):** simulated race 86.5 min: runs 51.2 min vs stations 32.8 min; VO2max correlates with finish time (rho -0.71); ~80 % of the race at very hard intensity (K18); format: 8 x 1 km run + 8 stations (K17).
- **Power block:** ground-contact class 3 -> 35 % -> 50 % plyometric across the block; jump / throw / sprint / COD emphasis 1/1/1/0; plyometric contacts about 20 a week, throws about 40, Olympic exposures 2 a week (6.0 sets).
- **Resistance:** goal endurance-strength / strength (strength that holds up for 60-90 min of racing; running economy); bilateral : unilateral 40/60 -> 30/70 (30/70); upper / lower 44 / 56 %; weekly sets 102.0 (athletic 22.0, lower 38.0, upper 30.0, core 12.0).
- **Aerobic:** 4 / 4 / 3 (off / pre / in) - A + B + C + C (second easy Orange). Evidence: PROPOSED (HYROX not in R2-ATH-06): about 60 % of race time is running (K18), so 4 = A + B + C + a second easy Orange (the approved 4th-session pattern, COACH-R2 SES-06).
- **Seasons:** race-specific block 4-6 weeks at about 60 % of the gym sets, more race simulations, then a 1-2-week taper (COACH-R2 PER-06 applied, INFERRED); aerobic stays at 4 (open question Q4) -> 60 % of the off-season sets; race weeks: 2 short gym sessions, the hard one >= 48 h before the race (COACH-R2 ATH-07 extended, INFERRED) -> 50 % (2 lift days).
- **US calendar:** HS: youth / junior divisions at some events (INFERRED); college: -; pro / elite: HYROX season Sept - June; Elite 15 / World Championships (2026: Stockholm, June 18-21) (K19); adult / rec: 21 US races in 2025/26 (K19); Open, Doubles, Relay and age groups (K17); frequency: 2-4 races a year for most; competitive athletes every 4-8 weeks (INFERRED).
- **Injury hotspots -> prehab codes:** ACHILLES_CALF, PATELLAR_TENDON, LOW_BACK_LOADING, HAMSTRING, PAIN_GENERAL (all no-band; rules in the JSON `injury_prehab`).
- **Variants:** `hyrox_pro` Pro division (heavier stations) (BKD +2, UKD +2, ISO_GRIP +2, HPULL +1); `hyrox_doubles` Doubles / relay (UKD -1, ISO_GRIP -1).
- **Notes:** Competitive HYROX (the coach's 'high rows'). Running is about 60 % of race time (K18), so the aerobic sessions are the backbone (4, PROPOSED) and the gym holds strength for the sled, lunges and carries. Gen-pop people who want HYROX for fitness use the recreational profile in genpop-active (not this one).
- **Off-season week (skeleton):**
  - Mon - strength A (knee + pull): warm-up -> core 2 x 2 light (COACH-R2 SES-03) -> broad jumps (ballistic, RC stage) -> hang power clean -> HEAVY FRONT SQUAT (axial day 1, COACH-R2 SES-01) + bent-over row -> walking lunges (sandbag) + pull-ups -> leg extensions -> calves 3 sets
  - Tue - aerobic B: 1 km repeats at race pace (Green)
  - Wed - strength B (hip + push): core 2 x 2 -> pogos / ankle hops (running economy) -> KB snatch -> HEAVY TRAP-BAR DEADLIFT (axial day 2) + DB bench -> single-leg RDL + push press -> farmers carry (grip) -> rear delts -> calves
  - Thu - aerobic A: run or erg intervals 30/30 or 40/20 (Blue)
  - Fri - stations + accessories: core -> hip thrust (non-axial) + rows -> compromised-running finisher: 4 x (1 km run + 1 rotating station: sled push / sled pull / burpee broad jumps / sandbag lunges / wall balls / ski / row / farmers) -> calves
  - Sat - aerobic C: long easy run 45-75 min (Orange)
  - Sun - off or a second easy Orange (bike / erg / walk) - the 4th session (COACH-R2 SES-06 pattern)
- **Floor-10 audit:** below 10 sets at category level: glutes, chest, side_delts, biceps, triceps, calves (see Q1).

### 4.16 Obstacle course racing (Spartan and similar) - ES: Carreras de obstáculos (OCR / Spartan)

- **Profile:** `ocr_spartan` (competitive; new budget). Positions / divisions: short course: Sprint 5 km / Super 10 km, long course: Beast 21 km / Ultra 50 km (see variant), elite / age group.
- **Demands (SCIENCE):** Sprint 5 km / 20 obstacles, Super 10 km / 25, Beast 21 km / 30; 30-burpee penalty (K20); handgrip strength before the race correlates with performance (K21); mean race HR ~166 bpm (K21b); Spartan injuries 18.7 presentations / 1000 participants; ankle / knee sprains, shoulder dislocations, fractures (K22 / K22b).
- **Power block:** ground-contact class 3 -> 35 % -> 50 % plyometric across the block; jump / throw / sprint / COD emphasis 1/1/1/1; plyometric contacts about 21 a week, throws about 40, Olympic exposures 2 a week (6.0 sets).
- **Resistance:** goal endurance-strength / strength (relative strength, grip, trail running); bilateral : unilateral 30/70 -> 20/80 (20/80); upper / lower 51 / 49 %; weekly sets 107.0 (athletic 26.0, lower 34.0, upper 35.0, core 12.0).
- **Aerobic:** 4 / 4 / 3 (off / pre / in) - A + B + C + C. Evidence: PROPOSED (OCR not in R2-ATH-06; mostly running) = A + B + C + second easy Orange (COACH-R2 SES-06 pattern).
- **Seasons:** race-specific block 4-6 weeks at about 60 % of gym sets, more obstacle circuits on trail, then a 1-2-week taper (COACH-R2 PER-06 applied, INFERRED) -> 60 % of the off-season sets; race weeks: 2 short gym sessions, the hard one >= 48 h before the race (INFERRED) -> 50 % (2 lift days).
- **US calendar:** HS: -; college: some collegiate OCR teams (INFERRED); pro / elite: Spartan US season spring - late fall; Pan American Championship September, Super World Championship October (K23); adult / rec: Sprint / Super / Beast weekends across the US (K20 / K23); frequency: monthly in season for committed racers (INFERRED).
- **Injury hotspots -> prehab codes:** ANKLE_SPRAIN, SHOULDER_CONTACT, FINGER_PULLEY, ACHILLES_CALF, ACL_LANDING_CUTTING, PAIN_GENERAL (all no-band; rules in the JSON `injury_prehab`).
- **Variants:** `ocr_long_course` Long course (Beast 21 km / Ultra) (PLYO -1, BALL -1, UKD +1).
- **Notes:** New. Like HYROX but trail running plus rig / grip / carry obstacles: more vertical pulling and grip, landing-first plyos (wall drops). Aerobic 4 is PROPOSED.
- **Off-season week (skeleton):**
  - Mon - strength A (knee + pull): warm-up -> core 2 x 2 light -> landing sticks from a box (RC1) -> hang power clean -> HEAVY SQUAT (axial day 1) + weighted pull-ups -> step-ups (ipsilateral, uphill drive) + rope climbs / rows -> dead hangs (grip) -> calves 3 sets
  - Tue - aerobic B: hill / trail intervals (Green)
  - Wed - strength B (hip + push): core -> box / broad jumps -> KB snatch -> HEAVY DEADLIFT / trap bar (axial day 2) + push-ups or DB press -> single-leg RDL -> bucket / sandbag carry -> biceps (rope climbs) -> calves
  - Thu - aerobic A: hill sprints / short intervals (Blue)
  - Fri - grip + obstacles: core -> overhead / rotational medball throws (spear pattern) -> rig work (monkey bars, towel hangs, wall practice) + burpees -> lateral lunges (frontal - UNI-12) -> rear delts
  - Sat - aerobic C: long trail run (Orange); Sun - off or a second easy Orange
- **Floor-10 audit:** below 10 sets at category level: glutes, chest, side_delts, biceps, triceps, calves (see Q1).

### 4.17 Artistic gymnastics (women's and men's) - ES: Gimnasia artística (femenil y varonil)

- **Profile:** `gymnastics_artistic` (competitive; new budget). Positions / divisions: women's artistic (vault, bars, beam, floor), men's artistic (6 events - see variant), all-around / event specialists.
- **Demands (SCIENCE):** adolescent artistic gymnasts: wrist pain prevalence 53 % (K27); NCAA women's gymnastics: 9.22 injuries / 1000 AE; ankle 17.9 %, lower leg / Achilles 13.6 %, trunk 13.4 % (K28); landing forces 5 BW in training to 11 BW in competition; somersault landings ~7-13 BW (K29); round-off hand forces ~4 BW (K29b).
- **Power block:** ground-contact class 2 -> 45 % -> 60 % plyometric across the block; jump / throw / sprint / COD emphasis 1/1/1/0; plyometric contacts about 14 a week, throws about 20, Olympic exposures 2 a week (3.0 sets).
- **Resistance:** goal power / strength (relative strength and power-to-weight); bilateral : unilateral 40/60 -> 30/70 (20/80); upper / lower 54 / 46 %; weekly sets 81.0 (athletic 15.0, lower 24.0, upper 28.0, core 12.0).
- **Aerobic:** 2 / 2 / 2 (off / pre / in) - B + C (routine-length Green + easy Orange). Evidence: PROPOSED (gymnastics not in R2-ATH-06; practice supplies conditioning) - 2 like baseball / softball.
- **Seasons:** pre-competition block 4-6 weeks at about 60 % of the off-season sets, more speed and power, then a 1-2-week taper (COACH-R2 PER-06) -> 60 % of the off-season sets; competition season: 2 short lifts, gym plyos about half (COACH-R2 ATH-07 extended) -> 45 % (2 lift days).
- **US calendar:** HS: winter season (practice from late Oct / Nov, state Feb - Mar) (INFERRED); college: NCAA women's season January - April (K30b); NCAA men's similar (INFERRED); pro / elite: USA Gymnastics elite / national team calendar (INFERRED); adult / rec: USA Gymnastics Development Program: competitive year Aug 1 - Jul 31, nationals in May (K30); frequency: 1 meet most weekends in season; practice 15-30 h a week (INFERRED).
- **Injury hotspots -> prehab codes:** WRIST_HAND, ACHILLES_CALF, ANKLE_SPRAIN, LOW_BACK_EXTENSION_SPONDY, GROWTH_APOPHYSIS, SHOULDER_GYMNASTIC, PAIN_GENERAL (all no-band; rules in the JSON `injury_prehab`).
- **Variants:** `gymnastics_mag` Men's artistic (6 events incl. rings, pommel, p-bars, high bar) (VPULL +2, HPUSH +2, ISO_BICEP +2, ISO_GRIP +2).
- **Notes:** New. Mostly youth athletes: youth rules apply (floor Olympic lifts from ~14 after a hang block, growth-spurt caps). Short-contact class 2 (60 % plyometric at block end) but low gym volume, because practice already gives huge landing loads (K29). Wrist, Achilles and low back are the prehab priorities.
- **Off-season week (skeleton):**
  - Mon - knee + pull: warm-up -> core 2 x 2 light (hollow / compression) -> landing sticks (RC1) -> hang clean (L1) -> goblet / front squat (axial day 1, youth loads) + pull-ups / rope climbs -> split squats + inverted rows -> Nordic / slider curls -> soleus / deficit calf raises 3 sets
  - Wed - hip + push: core 2 x 2 -> pogos / ankle hops (by RC stage) -> DB snatch (from ~14 after a hang block) -> trap-bar deadlift (axial day 2) + handstand push-up progression -> single-leg RDL + DB press -> wrist conditioning (loaded wrist extension / flexion, parallette holds - no bands) -> cuff ER / rear delts -> calves
  - Fri - full body: core -> overhead medball throws -> 10-20 m sprints (vault run) -> step-ups (ipsilateral) + rows -> hip thrust + dips / push-ups -> loaded hip flexion (Focus) -> calves
  - Tue / Thu / Sat - gymnastics practice; aerobic 2 = routine-length Green + easy Orange
- **Floor-10 audit:** below 10 sets at category level: quads, glutes, hamstrings, chest, side_delts, biceps, triceps, calves (see Q1).

### 4.18 Rock climbing / bouldering - competitive - ES: Escalada deportiva y búlder (Bouldering) - competitivo

- **Profile:** `climbing` (competitive; new budget). Positions / divisions: bouldering, lead / sport climbing (see variant), speed (see variant).
- **Demands (SCIENCE):** fingers are the most injured site (A2 / A4 pulleys); shoulder ~17 %; medial elbow (K31); finger strength is a key determinant of climbing level; 10 weeks of hangboard training raised maximal finger strength more than regular climbing (K32, K32b).
- **Power block:** ground-contact class 5 -> 20 % -> 25 % plyometric across the block; jump / throw / sprint / COD emphasis 1/1/0/0; plyometric contacts about 5 a week, throws about 25, Olympic exposures 1 a week (3.0 sets).
- **Resistance:** goal strength / endurance-strength (relative and finger strength); bilateral : unilateral 40/60 -> 30/70 (30/70); upper / lower 64 / 36 %; weekly sets 82.0 (athletic 9.0, lower 21.0, upper 38.0, core 12.0).
- **Aerobic:** 2 / 2 / 2 (off / pre / in) - B + C. Evidence: PROPOSED (climbing not in R2-ATH-06).
- **Seasons:** pre-competition block 4-6 weeks at about 60 % of the gym sets, more power (dynos), finger strength kept; 1-2-week taper (COACH-R2 PER-06) -> 60 % of the off-season sets; competition season: 2 short gym sessions; no max hangs within 48 h of a comp (FINGER_PULLEY) -> 50 % (2 lift days).
- **US calendar:** HS: some high-school climbing leagues (INFERRED); college: USA Climbing collegiate series (INFERRED); pro / elite: national cups and IFSC (INFERRED); adult / rec: youth series: bouldering Oct - Feb, rope spring, nationals late June - July (K33); frequency: 1 comp a month in season (INFERRED).
- **Injury hotspots -> prehab codes:** FINGER_PULLEY, SHOULDER_GYMNASTIC, ELBOW_GRAPPLING, ANKLE_SPRAIN, PAIN_GENERAL (all no-band; rules in the JSON `injury_prehab`).
- **Variants:** `climbing_lead` Lead / sport climbing (THROW -1, BALL -1, ISO_GRIP +1); `climbing_speed` Speed climbing (PLYO +3, JLK +2, BALL +1, SPRINT +2, TE +2).
- **Notes:** New. Relative-strength sport: pulling, finger strength (hangboard - a PROPOSED library addition, no bands), antagonists, landing skill for bouldering falls. Floor-10 check shows the legs and chest below 10 by design (relative strength) - open question Q1.
- **Off-season week (skeleton):**
  - Mon - pull + legs: warm-up -> core 2 x 2 light (hanging knee raises, hollow) -> landing sticks from a box (RC1) -> KB squat clean -> HEAVY GOBLET / FRONT SQUAT (axial day 1) + weighted pull-ups -> contralateral high step-ups + one-arm rows -> hangboard max hangs 7-10 s (open hand / half crimp) -> calves
  - Wed - push + hinge: core -> overhead slams / plyo push-ups -> TRAP-BAR DEADLIFT (axial day 2) + DB bench (antagonist) -> single-leg RDL + DB overhead press -> wrist extensors / pronators + cuff ER (KB / DB) -> rear delts
  - Fri - pull endurance + mobility: core -> lock-offs / lat pulldown + push-ups -> hip-flexion strength and mobility (Focus) -> forearm extensors -> calves
  - Tue / Thu / Sat - climbing (limit bouldering not on the day after max hangs); aerobic 2 (Green + Orange)
- **Floor-10 audit:** below 10 sets at category level: quads, glutes, hamstrings, chest, side_delts, biceps, triceps, calves (see Q1).

### 4.19 Golf - competitive - ES: Golf - competitivo

- **Profile:** `golf` (competitive; 04 golf). Positions / divisions: -.
- **Demands (SCIENCE):** rotational power correlates with clubhead speed; low back is the most common golf injury; lumbar compression up to ~8x body weight.
- **Power block:** ground-contact class 5 -> 20 % -> 25 % plyometric across the block; jump / throw / sprint / COD emphasis 1/2/0/0; plyometric contacts about 8 a week, throws about 175, Olympic exposures 1 a week (4.0 sets).
- **Resistance:** goal power / strength (clubhead speed: rotational power and lower-body RFD); bilateral : unilateral 30/70 -> 20/80 (20/80); upper / lower 41 / 59 %; weekly sets 84.5 (athletic 26.5, lower 27.0, upper 19.0, core 12.0).
- **Aerobic:** 3 / 2 / 2 (off / pre / in) - A + B + C - one of each colour (walking 18 holes counts as Orange). Evidence: COACH-R2 ATH-06 (golf 3).
- **Seasons:** pre-season / pre-competition block (camp for fighters) -> 60 % of the off-season sets; competition season -> 50 % (2 lift days).
- **US calendar:** HS: fall or spring by state (14 fall, 28 spring, 7 both - K43); college: NCAA fall and spring segments; regionals mid-May, championships late May (K43b); pro / elite: PGA / LPGA tours year-round (INFERRED); adult / rec: club / amateur events spring - fall (INFERRED); frequency: 1-2 events a week in season for juniors / college (INFERRED).
- **Injury hotspots -> prehab codes:** LOW_BACK_ROTATIONAL, LEAD_HIP_GLUTE, ELBOW_LATERAL_RACKET, SHOULDER_THROWER, PAIN_GENERAL (all no-band; rules in the JSON `injury_prehab`).
- **Notes:** Reused unchanged from 04 (class 5, 25 % approved R2-ATH-01; 3 aerobic sessions approved R2-ATH-06). The coach's into / out-of-hip medball matrix is the core tool. Recreational golfers are in genpop-active.
- **Off-season week (skeleton):**
  - Mon - full body A: warm-up -> core 2 x 2 light (Pallof holds -> chops) -> medball matrix (into / out of each hip, half-kneeling) -> hex-bar jump -> goblet / front squat (axial day 1) + rows -> contralateral 'GET INTO THE HIP' lunges (lead leg) -> calves
  - Wed - full body B: core -> medball step-back rotational passes -> DB snatch -> trap-bar deadlift (axial day 2) + DB press -> ipsilateral 'GET OUT OF THE HIP' step-ups (trail leg) -> lateral lunges -> grip / wrist extensors -> rear delts
  - Fri - full body C: core -> CMJ / box jump (RC stage) -> belt squat or leg press (non-axial) + pull-ups -> single-leg RDL + landmine press -> thoracic rotation mobility -> calves
  - Tue / Thu / Sat - practice / rounds; aerobic 3 (walking 18 holes = Orange)
- **Floor-10 audit:** below 10 sets at category level: glutes, hamstrings, chest, side_delts, biceps, triceps, calves (see Q1).

### 4.20 Tennis - competitive - ES: Tenis - competitivo

- **Profile:** `tennis` (competitive; 04 tennis). Positions / divisions: singles, doubles.
- **Demands (SCIENCE):** players change direction ~1.6 times per point (every ~2.7-3.1 s); elbow 21.4%, shoulder 19.4%, lumbar 17.3% of tennis injuries.
- **Power block:** ground-contact class 3 -> 35 % -> 50 % plyometric across the block; jump / throw / sprint / COD emphasis 2/2/2/2; plyometric contacts about 58 a week, throws about 175, Olympic exposures 1 a week (4.0 sets).
- **Resistance:** goal power / strength (lateral first step, rotational power, serve); bilateral : unilateral 20/80 -> 10/90 (10/90); upper / lower 39 / 61 %; weekly sets 136.5 (athletic 57.0, lower 37.5, upper 24.0, core 16.0).
- **Aerobic:** 3 / 2 / 2 (off / pre / in) - A + B + C - one of each colour. Evidence: COACH-R2 ATH-06 (tennis 3).
- **Seasons:** pre-season / pre-competition block (camp for fighters) -> 60 % of the off-season sets; competition season -> 45 % (2 lift days).
- **US calendar:** HS: fall or spring by state and sex (INFERRED); college: fall individual tournaments; spring dual-match season (K44); pro / elite: ATP / WTA year-round (INFERRED); adult / rec: USTA leagues year-round (INFERRED); frequency: tournaments of 3-6 matches over several days (INFERRED).
- **Injury hotspots -> prehab codes:** ELBOW_LATERAL_RACKET, SHOULDER_THROWER, LOW_BACK_ROTATIONAL, ACHILLES_CALF, ANKLE_SPRAIN, GROIN_ADDUCTOR, PAIN_GENERAL (all no-band; rules in the JSON `injury_prehab`).
- **Notes:** Reused unchanged from 04 (class 3, 50 % approved R2-ATH-01; 3 aerobic sessions approved R2-ATH-06; contralateral 'definitely' - CAT-13). Recreational tennis lives in genpop-active.
- **Off-season week (skeleton):**
  - Mon - knee + pull: warm-up -> core 2 x 2 light -> lateral plyos (RC stage) + split-step pogos -> clean variant (hang pull) -> front / goblet squat (axial day 1) + rows -> contralateral lateral lunges ('definitely' contralateral - CAT-13) + pull-ups -> wrist extensors (ELBOW_LATERAL_RACKET) -> calves
  - Tue - COD / speed: squirrel jumps -> MACH / 3-10 m starts -> route tree EASY -> MOD. -> HARD TURN (ATH-06, LIB-21) -> core -> medball scoops both sides + overhead (serve) -> single-leg RDL -> cuff ER / rear delts
  - Thu - hip + push: core -> lateral bounds -> DB snatch -> trap-bar deadlift (axial day 2) + landmine press -> step-ups (ipsilateral first step) -> Copenhagen -> calves
  - Fri - COD + full body: core -> reactive agility -> medball list -> belt squat / leg press (non-axial) -> unilateral push / pull -> calves
  - Wed / Sat - practice / matches; aerobic 3 (one of each colour)
- **Floor-10 audit:** below 10 sets at category level: glutes, chest, side_delts, biceps, triceps (see Q1).

### 4.21 Pickleball - competitive / tournament - ES: Pickleball - competitivo / torneos

- **Profile:** `pickleball_competitive` (competitive; 04 tennis + deltas). Positions / divisions: doubles, singles, mixed doubles, age divisions (19+, 35+, 50+, 60+, 70+ - see senior variant).
- **Demands (SCIENCE):** SFIA: 24.3 M US players in 2025, fastest-growing US sport (K36); over-40 players: mean HR ~111 bpm, moderate intensity >70 % of play (K35, K35b); about 41 % of injuries come from falling or diving (K34b); orthopedic injuries are rising, with wrist fractures from falls, Achilles ruptures and lateral epicondylitis among those reported (K34, K34c).
- **Power block:** ground-contact class 3 -> 35 % -> 50 % plyometric across the block; jump / throw / sprint / COD emphasis 1/1/1/2; plyometric contacts about 41 a week, throws about 150, Olympic exposures 1 a week (4.0 sets).
- **Resistance:** goal power / endurance-strength (lateral first step, hand speed, low ready position for hours); bilateral : unilateral 20/80 -> 10/90 (10/90); upper / lower 38 / 62 %; weekly sets 130.0 (athletic 48.5, lower 39.5, upper 24.0, core 16.0).
- **Aerobic:** 3 / 2 / 2 (off / pre / in) - A + B + C - one of each colour. Evidence: PROPOSED (= tennis 3, COACH-R2 ATH-06).
- **Seasons:** pre-season / pre-competition block (camp for fighters) -> 60 % of the off-season sets; competition season -> 45 % (2 lift days).
- **US calendar:** HS: club / some school leagues (INFERRED); college: collegiate club championships (INFERRED); pro / elite: PPA Tour 2026-27 season from Aug 31, ~20 US stops + international (K37); USA Pickleball National Championships in November (K37); adult / rec: tournaments and leagues year-round; 24.3 M US players in 2025 (K36); frequency: tournament weekends; many matches a day (INFERRED).
- **Injury hotspots -> prehab codes:** ELBOW_LATERAL_RACKET, SHOULDER_THROWER, LOW_BACK_ROTATIONAL, ACHILLES_CALF, ANKLE_SPRAIN, GROIN_ADDUCTOR, PAIN_GENERAL, FALLS_BONE_DENSITY (all no-band; rules in the JSON `injury_prehab`).
- **Variants:** `pickleball_senior_60_plus` Senior divisions (60+; also offered to 50+) (PLYO -6, JLK -9, TE -4, SPRINT -1.5, COD -5, THROW -5, UKD +1, ISO_GRIP +1).
- **Notes:** New, built from the 04 tennis profile with smaller-court deltas (less sprint and COD distance, a little less plyo and throw volume, more quad endurance for the low ready position). The senior variant applies R2-ATH-08 by default. Recreational pickleball (the coach's gen-pop request) is in genpop-active.
- **Off-season week (skeleton):**
  - Mon - knee + pull: warm-up -> core 2 x 2 light -> split-step pogos + lateral hops (RC stage) -> hang pull / DB snatch (L1) -> goblet / front squat (axial day 1) + rows -> contralateral lateral lunges + pull-ups -> wrist extensors (ELBOW_LATERAL_RACKET) -> soleus / calves 3 sets
  - Tue - lateral speed: squirrel jumps -> shuffle / crossover starts 1-3 m -> EASY -> MOD. TURN patterns (ATH-06) -> core -> medball scoops both sides -> single-leg RDL -> rear delts / cuff
  - Thu - hip + push: core -> lateral bounds -> trap-bar deadlift (axial day 2) + landmine press -> step-ups -> wall-sit / low ready-position isometrics + leg extensions (dink position) -> Copenhagen -> calves
  - Fri - full body: core -> medball chest passes (hand speed) -> belt squat / leg press -> unilateral push / pull -> balance work (single-leg reach) -> calves
  - Wed / Sat / Sun - play; aerobic 3 (one of each colour)
- **Floor-10 audit:** below 10 sets at category level: glutes, chest, side_delts, biceps, triceps (see Q1).

## 5. How a profile is laid out (example: `judo`)

- `weekly_sets` (off-season build week, 04 units): PLYO 4, JLK 2.5, BALL 4, THROW 15, COD 4, SPRINT 2, TE 8, BKD 4.5, BHD 6, UKD 6.5, UHD 5.5, HPUSH 3, VPUSH 2, HPULL 8, VPULL 7, ISO_HAM 3, ISO_REAR 4, ISO_BICEP 2, ISO_TRICEP 2, ISO_CALF 12, ISO_NECK 4, ISO_GRIP 5, CORE 16.
- `ground_contact` class 5 -> `power_mix_by_phase` 20 % -> 25 % plyometric; `plyo` / `throwing` / `cod` / `sprint` / `triple_ext` hold tiers and weekly ranges; `emphasis` turns them into 0-3.
- `bilateral_unilateral` block start / end / pre-season / in-season; `contra_ipsi`; `planes`; `core` (dose, plane mix).
- `aerobic_sessions_wk` (count by phase, colours, evidence); `season_overrides` (pre-season and in-season factors + % of the off-season week); `in_season_gym` (lift days, >= 48 h rule, typical competitions).
- `olympic_policy`, `medball_policy`, `injury_prehab`, `age_notes`, `equipment`, `tests`, `season_calendar_us`, `sample_week` (off / pre / in / post), `variants`, `derived` (incl. the floor-10 audit) and `field_evidence` (one evidence label per field).

## 6. New fields (not in the 04 schema)

| Field | Type | Why |
|---|---|---|
| `name_es` | string | Spanish display name (COACH-R2 GEN-08; pending coach approval) |
| `sport / sport_name / sport_name_es` | string | groups profiles under one sport for the intake menu (same as team.json) |
| `category` | enum: competitive / recreational | COACH-ANSWER GEN-02: competitive = sport + position + season; recreational = activity only |
| `positions` | list | positions / divisions / weight-class groups / styles covered by the profile |
| `base_profile / reuse_status / weekly_sets_delta_vs_base` | string / enum (unchanged, delta, new) / object | traceability to the 04 v1 numbers |
| `emphasis` | object 0-3 | jump / throw / sprint / COD emphasis from the weekly dose tiers (team.json mapping) |
| `power_mix_by_phase` | object or null | plyo : ballistic share by phase (COACH-R2 ATH-01 / ATH-02 / ATH-03 / ATH-07); null for profiles without an athletic block |
| `upper_lower_emphasis` | object | share of resistance sets upper vs lower (computed) |
| `rotation_emphasis` | string | rotation need in plain words |
| `resistance_goal` | object primary / secondary / note | strength / power / hypertrophy / endurance-strength |
| `resistance.emphasis_pct.endurance_strength` | number | NEW key in this file for HYROX, OCR and climbing (the 04 split had only hypertrophy / strength / power) |
| `olympic_policy` | object | COACH-ANSWER ATH-10 + COACH-R2 ATH-04 / ATH-05 / ATH-08 / GEN-06 per profile; weightlifting carries the %-based exception |
| `medball_policy` | object | ATH-05 / EQ-06 / EQ-07 / LIB-22 per profile |
| `in_season_gym` | object or null | lift days, hard-day spacing (>= 48 h, COACH-R2 ATH-07 extended), typical_games_wk (= competitions: bouts, matches, meets, races), intake (COACH-R2 GEN-05); same field names as team.json |
| `injury_prehab` | list | injury hotspots -> selection rules (no bands) |
| `age_notes` | list | youth / older / competition-level rules (COACH-R2 ATH-08 etc.) |
| `equipment` | list | typical equipment for the sport |
| `sample_week` | object | day-by-day skeleton per phase (off / pre / in / post) + rules + evidence |
| `tests` | object | test menu and timing (COACH-R2 PER-07) |
| `season_calendar_us` | object | US high school / college / pro / adult-rec calendars + frequency, cited |
| `field_evidence` | object | evidence label per field (COACH vs INFERRED vs SCIENCE vs PROPOSED) |
| `ath03_evidence` | string | evidence for the ath03_group value |
| `aerobic_sessions_wk.off_season_range / pre_season / user_adjustable / colour_mix_by_phase / colours / modes / walks / evidence` | sub-fields | COACH-R2 ATH-06 / SES-06 and colour mix by phase |
| `bilateral_unilateral.pre_season` | [bilateral, unilateral] | UNI-10: unilateral share rises toward the season |
| `power_mix.rank_note` | string | where an unranked sport sits on the ATH-02 ranking (INFERRED) |
| `core.dose` | string | COACH-R2 SES-03 light core-first dose (athlete vs non-athlete wording) |
| `plyo.ranges_evidence` | string | states that the contact ranges are nominal dose +/- 15 % (PROPOSED) |
| `season_overrides.pre_season / in_season (rewritten); season_overrides.contest_prep / peak_week (physique); season_overrides.strength_months / power_months / test_peak_month (CrossFit, OBSERVED)` | object | COACH-R2 PER-06 / ATH-07 factors with total % of off-season sets; event-driven sports get label + length |
| `derived (light) + derived.resistance_sets_by_muscle + derived.floor_10_check` | object | same names as 04 derived (subset) + a category-level audit of the COACH-R2 VOL-04/06 floor of 10 sets per muscle |
| `variants[].weekly_sets_delta / weekly_sets / derived` | object | position / division / style variants as deltas on the profile budget (same as team.json) |

## 7. New injury codes and extensions of the 04 library

New codes (rules INFERRED; hotspots SCIENCE):

- **KNEE_GRAPPLING** (BJJ / submission grappling, judo, wrestling, MMA) - SCIENCE (K7 / K7b BJJ: knee the most injured site, 27-33 %; K5b judo top level: knee ~17 %) for the hotspot; rules INFERRED from 04 rules. Rules: single-leg strength every week (split squats, step-ups, SL RDL) and hamstring strength ('Nordic Curl' or slider curls) 1-2x/week / adductors: 'Coppenhaggen Plank' 2x/week (04 GROIN_ADDUCTOR rule) / deep-flexion tolerance built gradually (goblet / belt squat to depth on non-axial days - COACH-R2 SES-02) / landing / receive stage first for throws and shots (Receive-Create stage 1, COACH-R2 ATH-03) / a flagged knee moves bilateral work to unilateral or machines and cuts the pattern 30-50 % (COACH-ANSWER VOL-03, UNI-02)
- **ELBOW_GRAPPLING** (judo, BJJ / submission grappling, MMA, wrestling) - SCIENCE (K5b judo top level: elbow ~14 %; K7 BJJ elbow 8.4 %) for the hotspot; rules INFERRED. Rules: elbow flexor and extensor strength every week (ISO_BICEP / ISO_TRICEP 2 sets 2x/week, DB or cable - no bands, EQ-01) / grip and forearm work (ISO_GRIP) 2x/week: towel / gi hangs, farmer holds / a flagged elbow: neutral-grip DB pressing and rows, no straight-arm hanging to failure in tournament weeks (INFERRED)
- **FINGER_PULLEY** (rock climbing / bouldering, OCR (rig / monkey bars, minor)) - SCIENCE (K31: fingers are the most injured site in climbers; A2 / A4 pulley ruptures the most common injury) for the hotspot; rules INFERRED. Rules: count finger load from climbing and hangboard together; max hangs at most 2x/week, never on back-to-back days and never within 48 h of limit bouldering or a competition (INFERRED) / open-hand / half-crimp grips for loaded hangs; no loaded full-crimp max hangs (INFERRED) / add load in small steps inside the block stairway (COACH-R2 PER-03/04); a painful finger drops the hangboard first, then the hardest climbing (COACH-ANSWER VOL-03 logic) / youth: bodyweight dead hangs only, no added-load hangboard (INFERRED - growth plates) / antagonist work: wrist extensors, push-ups / presses (keeps the elbow and shoulder balanced)
- **BICEPS_TENDON** (strongman (stones, mixed-grip deadlifts), powerlifting (mixed grip)) - SCIENCE (K13: biceps 11 % of strongman injuries; strains / tears of muscle 38 % and tendon 23 %) for the hotspot; rules INFERRED. Rules: biceps strength incl. slow eccentrics (ISO_BICEP 2-4 sets 2x/week) - stones are lifted with long arms / alternate the supinated hand on mixed-grip pulls between sets / weeks; hook or double-overhand with straps for volume (INFERRED) / stone and sandbag loads climb the block stairway; no max stone loads on the day after heavy pulls (INFERRED)
- **LOW_BACK_EXTENSION_SPONDY** (artistic gymnastics, cheer flyers / tumblers, divers (variant)) - SCIENCE (K28 trunk 13.4 % of NCAA women's gymnastics injuries; high incidence of suspected spondylolysis in young competitive gymnasts) for the hotspot; rules INFERRED. Rules: anti-extension core first every session (hollow holds, dead bugs) before any dynamic arching (COACH-ANSWER ATH-11, COACH-R2 SES-03) / no loaded end-range spinal extension in the gym (back extensions to neutral only); hip-flexor length and hip-extension strength instead / persistent extension pain in a young athlete = stop the plan and refer to a professional (health-screen logic, COACH-R2 GEN-03)

Also reused from `team.json`: SHOULDER_CONTACT. Extensions of existing codes:

- **SHOULDER_CONTACT**: sports added: wrestling (takedowns, mat returns - INFERRED), judo (~16 % at top level - K5b), BJJ (11.2 % - K7), OCR (shoulder dislocations - K22b). Rules unchanged from team.json.
- **SHOULDER_GYMNASTIC**: sports added: artistic gymnastics, climbing (~17 % shoulder - K31), weightlifting (overhead receive), strongman (overhead events), OCR rig work.
- **WRIST_HAND**: sports added: artistic gymnastics (wrist pain 53 % - K27; add loaded wrist extension / flexion and parallette holds, no bands, and cap handstand volume steps inside the stairway), weightlifting (front rack), judo (grip), pickleball (falls -> wrist fractures - K34b).
- **NECK**: sports added: judo. Rules unchanged (isometric 4-way -> plate / manual eccentric; no bands).
- **ACHILLES_CALF**: sports added: artistic gymnastics (lower leg / Achilles 13.6 % NCAA - K28), pickleball (Achilles ruptures - K34b), HYROX, OCR, taekwondo.
- **ANKLE_SPRAIN**: sports added: taekwondo (foot / ankle most common - K8), OCR (K22b), climbing (bouldering falls - K31b), artistic gymnastics (17.9 % NCAA - K28).
- **PATELLAR_TENDON**: sports added: weightlifting (knee injuries mostly tendinitis - K9), HYROX (lunges, wall balls), strongman.
- **LOW_BACK_LOADING**: sports added: strongman (low back 24 % - K13), weightlifting (K9), HYROX (sled), crossfit_class.
- **FALLS_BONE_DENSITY**: sports added: pickleball 50+ / 60+ (falls are the main cause of serious pickleball injuries in older players - K34b / K34c).
- **GROWTH_APOPHYSIS**: sports added: artistic gymnastics (mostly youth athletes).
- **HAMSTRING**: sports added: HYROX (running), OCR (trail running), taekwondo (high kicks).
- **ACL_LANDING_CUTTING**: sports added: OCR (high-impact landing obstacles - K22b).

## 8. Flags and open questions for the coach

| ID | Topic | Detail | Status |
|---|---|---|---|
| Q1 | Floor of 10 weekly sets per muscle vs these budgets | COACH-R2 VOL-04/06: 'I don't think anybody needs less than 10 sets a week per muscle.' derived.floor_10_check shows that most fighters, court and relative-strength athletes (climbers, gymnasts) sit below 10 for chest, side delts, arms and (with the 0.25 credit of COACH-R2 VOL-05) glutes; the physique budget reused from 04 also shows chest, side delts and arms below 10 before its 12 Focus sets are assigned. Proposed reading (same as team.json O1): the floor applies to muscles a plan trains for size / strength; athletes' pre-season / in-season blocks are maintenance phases; the volume engine (12 / 03) raises physique and gen-pop muscles to the floor and uses Focus sets for priorities. Rear delts keep their approved 4 / 6 / 8 own sets plus helper credit - the tension with the floor is flagged for round 3. | OPEN - flag to the volume engine owner |
| Q2 | Weightlifting and the two-axial-days rule | COACH-R2 SES-01/02: heavy squat and heavy deadlift on two different days, other days non-axial; the approved exception is a light technique squat or deadlift for powerlifters. Weightlifters traditionally squat heavy 2-3x a week. Proposed: heavy back squat day + heavy pull (clean deadlift / pull) day; the front squat stays light-moderate (same exception as powerlifters). Needs the coach. | OPEN |
| Q3 | Fight camps vs COACH-R2 PER-06 and the OBSERVED boxing build-up | The OBSERVED boxing tab builds weeks 3-8 (+41 % component sets) with a week-7 mini-deload. COACH-R2 VOL-07 removes deloads inside a block, and COACH-R2 PER-06 makes the pre-season block about 60 % of off-season sets with more speed and power + a 1-2-week taper. Resolution used: off-camp = off-season blocks (the 8-week build is the coach's example of one), camp = the 4-6-week pre-season block at about 60 %, then the 1-2-week taper to the fight; the week-7 mini-deload is retired as a default (OBSERVED example only). | PROPOSED resolution - confirm |
| Q4 | Aerobic sessions in race-prep blocks (HYROX, OCR) | COACH-R2 ATH-06 approved 'pre-season 2' for athletes. HYROX is about 60 % running (K18) and OCR is mostly trail running, so cutting to 2 aerobic sessions before a race would remove the main work. Proposed: HYROX / OCR keep 4 in the race-specific block (3 between races); gym sets still drop to about 60 % (COACH-R2 PER-06). | OPEN |
| Q5 | 60+ competitive athletes (senior pickleball, masters lifters, masters grapplers) | COACH-R2 ATH-08: 60+ get no Olympic lifts, plyos or depth jumps by default, with an opt-in and the warning 'Make sure that you have a fitness professional to help you understand what this means.' Our round-2 proposal also said landing drills and low ankle hops stay OK; the coach's words say no plyos by default. Profiles use the stricter reading (none by default; balance, step-ups and fast-intent resistance instead). For a masters weightlifter the Olympic lifts are the sport - they opt in with the warning. Confirm both. | OPEN |
| Q6 | Taekwondo ground-contact class | 04 shared one class (5, 25 %) for karate and taekwondo; the coach approved karate at 25 % (COACH-R2 ATH-01). Taekwondo's bouncing stance and jump / spinning kicks could argue for class 4 (40 %). Kept at class 5 with a slightly higher budget (28 %). | OPEN |
| Q7 | ATH-03 group for HYROX and OCR | 04 places the hybrid product and distance runners in 'health'. Competitive HYROX / OCR racers are not a health goal. Proposed new group 'hybrid_endurance' (strength-endurance + aerobic) at the merge; until then they use 'health' per the 04 convention. | OPEN - merge decision |
| Q8 | Competitive Olympic weightlifting is its own programming | COACH-R2 GEN-06: '% only ... unless you're a competitive Olympic lifter. That becomes a nuance, and now the program needs to change to Olympic weightlifting programming.' The weightlifting profile is a scaffold (4-day snatch / clean & jerk week, % of each lift's 1RM, 1-3 reps on the competition lifts). The coach has not written one - needs his template or approval. | OPEN |
| Q9 | Where cleans and snatches sit in the week | COACH-R2 ATH-04: cleans read as squat-pattern, snatches as hinge-pattern, up to 4 exposures a week. team.json places cleans on knee days and snatches on hip days; the coach's own CrossFit split (OBSERVED) puts snatches on both lower days (Mon knee dom, Thu hip dom) and cleans on the upper days. Both are used here (team convention for athletes, OBSERVED split for CrossFit). Is the pattern a day-placement rule or only a balance rule? | OPEN |
| Q10 | CrossFit class / bootcamp muscle volume | In the OBSERVED class split only the strength / power slots are sets (about 15 a week); the WOD carries most of the work but is conditioning (VOL-10 logic), so every muscle sits below 10. Options: count WOD resistance movements at a fraction, or add a RESISTANCE slot (the FULL / HALF TIME tables have 'RESISTANCE LVL 1 = 2 SETS x 10'). This matters for the 'CrossFit-style bootcamp' sample plan the coach will grade (COACH-R2 GEN-07). | OPEN |
| Q11 | Physique contest prep and peak week | Proposed: prep = 1-2 full blocks (no deload inside, COACH-R2 VOL-07) at about 90 % of off-season sets with longer cardio and daily walks; peak week about -45 %, no new exercises. The tool gives no nutrition, water or posing-schedule advice (COACH-R2 GEN-04: workouts only). Division priority deltas (bikini glutes / shoulders, men's physique V-taper, wellness lower body) are PROPOSED. | PROPOSED |
| Q12 | Library additions needed by these sports | Hangboard (finger strength, climbing), neck 4-way isometrics (wrestling, judo, MMA, Muay Thai - 04 library gap), carries / drags exercises (CARRY / DRAGS columns are empty - LIB-19: strongman, HYROX, OCR), sled push / pull and wall balls (HYROX), rope climb / dead hang / monkey bars (OCR), handstand push-up progression and parallette holds (gymnastics), log / axle / yoke / stones (strongman). All PROPOSED-ADDITION, no bands (EQ-01). | OPEN - library owner |
| Q13 | Strongman yoke and farmers as axial loading | COACH-R2 SES-02 lists the axial lifts; strongman implements are not on it. The yoke produces the highest spine loads of the events studied (K14), so it is treated as axial and shares the squat day; heavy farmers share the deadlift day (INFERRED). | OPEN |
| Q14 | Medball for sports not in ATH-05 | COACH-ANSWER ATH-05 named baseball, boxing, MMA, tennis, golf (high), basketball, football (moderate), aesthetics (none). Judo / wrestling (T3), taekwondo / kickboxing / karate (T3, 04), pickleball (T2-T3 like tennis), HYROX / OCR / gymnastics / climbing / strongman (T1), weightlifting and powerlifting (none) are INFERRED. | OPEN |
| Q15 | Spanish names | All name_es values are drafts in neutral Latin American Spanish with English terms in brackets ('Halterofilia (Weightlifting)', 'Búlder (Bouldering)', 'Fisicoculturismo (Bodybuilding / Physique)'); the coach or a coach he trusts approves every line (COACH-R2 GEN-08). | PENDING approval |

## 9. Sources

- **K1** - Wrestling technical-tactical and physiological demands review (Miarka 2016): after the 2013 rule change bouts show quicker, more varied actions; decisive actions in standing and ground positions. https://revpubli.unileon.es/index.php/artesmarciales/article/view/3309
- **K1b** - Greco-Roman World Championship time-motion (Nilsson et al. 2002, J Sports Sci): mean work 37.2 s / rest 13.8 s (~3:1); blood lactate ~14.8 mmol/L. https://www.bisp-surf.de/Record/PU200911005944
- **K2** - High-school vs college wrestling injuries (Yard et al. 2008, AJSM): 2.33 vs 7.25 injuries / 1000 AE; matches riskier than practice at both levels. https://lida.sport-iat.de/twm/Record/4013945?lng=en
- **K3** - Example state high-school wrestling calendar (TSSAA, Tennessee) - winter season, state tournament in February. https://cms-files.tssaa.org/documents/tssaa/2026-27/sports-calendar/2026WrCalendar.pdf
- **K3b** - Secondary summary of NFHS / NCAA wrestling season dates (NCAA championships third weekend of March). https://sportssurge.alibaba.com/wrestling/when-is-wrestling-season
- **K4** - Judo combat time-motion and physiology (Franchini, Artioli & Brito 2013): effort:pause 2:1-3:1 with 20-30 s efforts and ~10 s pauses. https://lida.sport-iat.de/dfb-fechten/Record/4030246
- **K4b** - Judo time-motion by championship phase, 53,403 actions (J Hum Kinet 2018). https://pmc.ncbi.nlm.nih.gov/articles/PMC6231334
- **K5** - Epidemiology of injuries during judo tournaments (Translational Sports Medicine 2023): sprains, contusions, lacerations; knee, shoulder, elbow and fingers among the main sites. https://www.ncbi.nlm.nih.gov/pmc/articles/PMC11022761/
- **K5b** - Injuries in judo: systematic review with prevention suggestions (BJSM 2013) - top-level competition: knee ~17 %, shoulder ~16 %, elbow ~14 %; being thrown the main mechanism. https://bjsm.bmj.com/content/47/18/1139
- **K6** - BJJ matches of 2-10 min (Andreato et al. 2017, Kinesiology): effort:pause ratio stable across durations; longer matches add pause time, lower grip-strength endurance and raise RPE. https://hrcak.srce.hr/180731
- **K6b** - Female high-level BJJ time-motion by weight division (Frontiers in Psychology 2023). https://pmc.ncbi.nlm.nih.gov/articles/PMC9969123
- **K7** - High-performance professional BJJ athletes (Nery et al. 2022): injury prevalence 85 %; knee 32.6 %, shoulder 11.2 %, elbow 8.4 %. https://opus.lib.uts.edu.au/handle/10453/166268
- **K7b** - BJJ survey of 1140 athletes (Hinz et al. 2021, OJSM): knee the most frequent injury (27.1 %); lower extremity 45.7 %, upper extremity 30.2 %. https://pmc.ncbi.nlm.nih.gov/articles/PMC8721390
- **K8** - Korean elite taekwondo, prospective (Son et al. 2020): competition 24.86 vs practice 4.79 injuries / 1000 AE; foot / ankle the most common location, ligament sprain the most common type, contact the main mechanism. https://www.ncbi.nlm.nih.gov/pmc/articles/PMC7399793/
- **K9** - Weightlifting and powerlifting injuries, updated systematic review 2024: powerlifting 1.0-4.4 / 1000 h (low back / pelvis, shoulder, elbow / upper arm); weightlifting 2.4-3.3 / 1000 h (knee, low back, shoulder, hands). https://pubmed.ncbi.nlm.nih.gov/39650568/
- **K10** - Tapering and peaking maximal strength for powerlifting: reduce volume, keep intensity; taper about 1-2 weeks (Travis et al. 2020). https://www.ncbi.nlm.nih.gov/pmc/articles/PMC7552788/
- **K11** - Young elite weightlifters: a second daily high-intensity session gave no extra gain over one session. https://johk.pl/wp-content/uploads/2023/02/10.2478_v10078-010-0057-7.pdf
- **K11b** - Practitioner: weightlifters train each competition lift often (advanced 6-10 sessions / week) - Catalyst Athletics. https://mail.catalystathletics.com/article/1946/Ask-Greg-Weightlifting-Training-Frequency-Volume
- **K12** - USA Weightlifting 2026 national events (North American Open series Mar / Sep / Dec, Masters + University Apr, National Championships week June). https://usaweightlifting.org/news/2025/august/01/2026-usa-weightlifting-national-event-schedule
- **K13** - Strongman injury epidemiology (Winwood et al.): 82 % injured in 1 year, 5.5 / 1000 h; low back 24 %, shoulder 21 %, biceps 11 %, knee 11 %; implement training 1.9x riskier per exposure. https://research.bond.edu.au/en/publications/retrospective-injury-epidemiology-of-strongman-athletes/
- **K14** - Strongman events: the yoke produces the highest spine loads; stone lifts load the back in a flexed posture (McGill et al. 2009). https://pubmed.ncbi.nlm.nih.gov/19528856/
- **K14b** - Strongman Corporation National Championships (Erie, PA, October). https://www.sportsdestinations.com/destinations/pennsylvania/news/strongman-corporation-national-championships-32294
- **K15** - CrossFit injury reviews: about 2-3 injuries / 1000 h (one meta-analysis 3.2); shoulders most common, then back and knees. https://www.germanjournalsportsmedicine.com/archive/archive-2021/issue-7/musculoskeletal-injuries-in-crossfitr-a-systematic-review-and-meta-analysis-of-injury-rates-and-locations/
- **K16** - CrossFit Games 2026 season: Open Feb 26 - Mar 16, quarterfinals Mar 26-30, online semifinals May-June, Games July 24-26. https://games.crossfit.com/article/2026-crossfit-games-season-dates-and-details-division
- **K17** - HYROX format: 8 x 1 km run, each followed by a station (SkiErg 1000 m, sled push 50 m, sled pull 50 m, burpee broad jumps 80 m, row 1000 m, farmers carry 200 m, sandbag lunges 100 m, wall balls 100); 60-90+ min for non-elite. https://us.puma.com/us/en/articles/what-is-hyrox
- **K17b** - HYROX division weights (Open vs Pro: sled push 152 / 202 kg men, farmers 2 x 24 / 2 x 32 kg, lunges 20 / 30 kg, wall ball 6 / 9 kg; women lighter). https://www.redbull.com/gb-en/hyrox-weights-overview
- **K18** - HYROX physiology (Brandt et al. 2025): 86.5 min simulated race, runs 51.2 min vs stations 32.8 min; VO2max correlates with finish time (rho -0.71); ~80 % of the race at very hard intensity. https://www.frontiersin.org/journals/physiology/articles/10.3389/fphys.2025.1519240/pdf
- **K19** - HYROX season calendar (Sept-June; 2026 World Championships Stockholm June 18-21; 21 US races in 2025/26). https://www.redbull.com/us-en/hyrox-event-calendar-fitness-racing
- **K20** - Spartan race types: Sprint 5 km / 20 obstacles, Super 10 km / 25, Beast 21 km / 30; 30-burpee penalty. https://shop.spartan.com/blogs/unbreakable-race-stories/different-spartan-race-types
- **K21** - OCR physiology: pre-race handgrip strength correlates with performance; leg strength falls after Sprint and Super (Applied Sciences 2024). https://www.mdpi.com/2076-3417/14/20/9604
- **K21b** - Spartan Race heart rate averages ~166 bpm (Charles University thesis). https://dspace.cuni.cz/handle/20.500.11956/105962
- **K22** - Spartan Race injuries over 5 years (Eastern Canada): 18.7 presentations / 1000 participants; most treated on site. https://resolve.cambridge.org/core/journals/prehospital-and-disaster-medicine/article/this-is-sparta-a-fiveyear-obstacle-course-racing-injury-analysis/366937AE0AB0B9CF2F3E855FE004952F
- **K22b** - Obstacle course events review: ankle / knee sprains, shoulder dislocations, fractures, skin injuries (JSOM 2022). https://jsomonline.org/product/obstacle-course-events-hazards-and-prevention-measures/
- **K23** - Spartan 2025 US schedule (spring to late fall; Pan American Championship Sept, Super World Championship Oct). https://www.spartan.com/blog/2025-spartan-race-schedule
- **K24** - Natural bodybuilding contest prep (Helms et al. 2014): lose ~0.5-1 % body weight / week; dehydration / electrolyte manipulation in peak week can be dangerous. https://jissn.biomedcentral.com/track/pdf/10.1186/1550-2783-11-20
- **K25** - Natural elite bodybuilders pre-contest: ~5 training days / week, ~8-17 direct sets per muscle group per week. https://www.ncbi.nlm.nih.gov/pmc/articles/PMC12846200/
- **K25b** - Weekly training volume per muscle group in competitive physique athletes. https://www.ncbi.nlm.nih.gov/pmc/articles/PMC12345604/
- **K25c** - Physique competitors survey: volume reduced for most muscle groups and cardio duration increased in pre-contest (Frontiers 2025). https://www.frontiersin.org/articles/10.3389/fspor.2025.1536360/full
- **K26** - NPC divisions and judging (men's physique, classic physique, bodybuilding, bikini, wellness, figure, women's physique). https://www.nasm.org/resource-center/blog/fitness/bodybuilding-competition-divisions-a-coach-guide-to-the-categories
- **K27** - Adolescent artistic gymnasts: pooled wrist-pain prevalence 53 %; chronic wrist injury 36 %. https://www.ncbi.nlm.nih.gov/pmc/articles/PMC12804664/
- **K28** - NCAA women's gymnastics injuries 2009-14: 9.22 / 1000 AE; ankle 17.9 %, lower leg / Achilles 13.6 %, trunk 13.4 %, foot 12.4 %; competition 1.67x practice. https://scholarworks.indianapolis.iu.edu/items/56c83fbc-267f-411f-8aff-d22fa53bedda/full
- **K29** - Landing impacts (Mueller et al. 2024, cheerleaders) citing gymnastics data: two-foot landings 5 BW in training to 11 BW in competition (Hume et al.); somersault landings ~7-13 BW (Wade et al.). https://www.frontiersin.org/articles/10.3389/fspor.2024.1419783/full
- **K29b** - Round-off hand contact forces up to ~4 BW (upper-extremity loading). https://ojs.ub.uni-konstanz.de/cpa/article/view/5539/5033
- **K30** - USA Gymnastics Development Program: competitive year Aug 1 - Jul 31, national championships in May. https://usagym.org/2024-usa-gymnastics-mens-and-womens-development-program-national-championships-begin-this-weekend/
- **K30b** - NCAA women's gymnastics season January - April. https://en.wikipedia.org/wiki/2019_NCAA_Division_I_women%27s_gymnastics_season
- **K31** - Climbing injuries systematic review: fingers most injured (A2 / A4 pulley), shoulder ~17 %, elbow (medial epicondylopathy); overuse > acute. https://www.ncbi.nlm.nih.gov/pmc/articles/PMC12821603/
- **K31b** - AMSSM rock-climbing injury basics (upper extremity ~70 %, lower ~20 % - ankle). https://sportsmedref.amssm.org/wp-content/uploads/2022/08/Rock-Climbing-Injuries-Basics-JL.pdf
- **K32** - Editorial: Training and testing in climbing (Andersen et al. 2022): finger strength is central; 10 weeks of hangboard training raised maximal finger strength more than regular climbing in intermediate-advanced climbers (Hermans et al.). https://www.ncbi.nlm.nih.gov/pmc/articles/PMC9433113/
- **K32b** - Determinants for success in climbing: a systematic review (2019). https://doaj.org/article/8e5acfc4f7a640128f77e8d6a2a19b10
- **K33** - USA Climbing youth series: bouldering qualifiers Oct-Dec, regionals Jan, divisionals Feb; rope season in spring; youth nationals late June - July. https://usaclimbing.org/wp-content/uploads/2022/01/Competitor-Parent-Guide-to-Youth-Series.pdf
- **K34** - Pickleball orthopedic injuries rising (10-year national study). https://aoao.org/2025/03/21/rising-orthopedic-injuries-in-pickleball-insights-from-a-10-year-national-study/
- **K34b** - Pickleball injury survey 2023 (Cureus): about 41 % of injuries came from falling or diving for a shot. https://assets.cureus.com/uploads/original_article/pdf/149619/20230601-3265-mafcmc.pdf
- **K34c** - UC Davis: pickleball injuries rising - falls in older players, wrist fractures. https://health.ucdavis.edu/research/news/headlines/pickleball-injuries-are-on-this-rise-here-are-tips-to-avoid-them-while-playing/2024/08
- **K35** - Pickleball players over 40: mean HR ~111 bpm, moderate intensity >70 % of play in singles and doubles. https://journal.unnes.ac.id/journals/jpehs/article/view/48396
- **K35b** - ACE-sponsored study: pickleball improves fitness in middle-aged and older adults. https://www.acefitness.org/education-and-resources/professional/certified/august-2018/7053/ace-sponsored-research-can-pickleball-help-middle-aged-and-older-adults-get-fit
- **K36** - SFIA: 24.3 M US pickleball players in 2025, fastest-growing US sport four years running. https://sfia.org/research/u-s-pickleball-participation/
- **K37** - PPA Tour 2026-27 schedule (season starts Aug 31; ~20 US stops). https://thekitchenpickle.com/blogs/news/ppa-tour-2026-2027-season-schedule/
- **K38** - Amateur boxing: 3 rounds x 3 min with 1-min rest. https://en.wikipedia.org/wiki/Amateur_boxing
- **K38b** - USA Boxing National Championships held in December (2024 Richmond, VA). https://www.boxingscene.com/articles/usa-boxing-brings-national-championships-richmond-virginia
- **K39** - MMA camps: fights usually known 8-12 weeks out; off-camp / pre-camp / camp structure (practitioner). https://getphysical.com/blog/out-of-camp-strength-training-for-mma
- **K40** - IBJJF 2026: Pan Championship late March (Kissimmee), World Championship late May. https://www.flograppling.com/articles/15609157-ibjjf-pans-2026-everything-you-need-to-know
- **K41** - USA Judo 2026 national events: Youth Nationals March, Senior Nationals May, Junior Olympics June, President's Cup November. https://www.usajudo.com/news/2026/november/03/usa-judo-announces-16-point-events-for-2026
- **K42** - USA Karate National Championships & Team Trials in July. https://usankf.org/2024-karate-national-championships-team-trials
- **K42b** - USA Taekwondo National Championships in July. https://www.usatkd.org/2024-u-s-taekwondo-national-championships
- **K43** - US high-school golf season fall or spring by state (14 fall, 28 spring, 7 both). https://highschoolgolf.org/?p=2279
- **K43b** - NCAA golf: fall + spring segments; regionals mid-May, championships late May. https://goducks.com/news/2024/8/21/mens-golf-releases-full-2024-25-schedule
- **K44** - College tennis: fall individual tournaments, spring dual-match (team) season. https://www.tennisrecruiting.net/article.asp?id=1356
- **04** - sport science already cited in `04_profiles.json` (boxing, MMA, kickboxing, karate / taekwondo time-motion; golf; tennis) is reused as-is.

