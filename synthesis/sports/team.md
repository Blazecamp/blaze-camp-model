# Team field & court sport profiles (v1, round-2 rules applied)

Companion to `team.json` (same folder). 53 profiles for the popular US team sports, by position group, plus recreational versions for adults who play in leagues. Every profile keeps the `04_profiles.json` field names; new fields are listed in section 6.

**Authority order:** coach round-2 answers (COACH-R2) > round-1 answers (COACH-ANSWER) > everything else. **Evidence tags:** OBSERVED (coach's sheets), COACH-ANSWER <ID>, COACH-R2 <ID>, INFERRED (analyst reasoning), SCIENCE (cited sources, section 9), PROPOSED (waiting for the coach's yes). No Google Sheet was modified.

## 1. What the coach asked, and how it is covered

> "For the athletes, all of the different popular sports in the United States are there." (request of 2026-10-08)

This file covers the team field and court sports (swimming, pickleball, HYROX and the individual sports are handled in their own files). The list follows US participation: the NFHS 2024-25 top-10 school sports include 11-player football, basketball, soccer, baseball, volleyball, softball, competitive spirit (cheer) and lacrosse; girls flag football grew 60 % in one year and is sanctioned in 16 states (T33). Ice hockey, field hockey, rugby and ultimate complete the US team-sport picture.

| Sport | Competitive profiles (position groups) | Recreational profile |
|---|---|---|
| American football (tackle) | `football_qb`, `football_rb`, `football_wr_db`, `football_te_lb`, `football_ol`, `football_dl`, `football_k_p` | - (adults use `weekend_warrior` + the nearest sport tag) |
| Flag football | `flag_football` | `rec_flag_football` |
| Basketball | `basketball_guard`, `basketball_wing`, `basketball_big` | `rec_basketball` |
| Baseball | `baseball_pitcher`, `baseball_catcher`, `baseball_infield`, `baseball_outfield` | - (adults use `weekend_warrior` + the nearest sport tag) |
| Softball | `softball_pitcher`, `softball_position` | `rec_softball` |
| Soccer | `soccer_gk`, `soccer_defender`, `soccer_midfielder`, `soccer_forward` | `rec_soccer` |
| Ice hockey | `hockey_forward`, `hockey_defense`, `hockey_goalie` | `rec_hockey` |
| Volleyball | `volleyball_outside_opposite`, `volleyball_middle`, `volleyball_setter`, `volleyball_libero`, `volleyball_beach` | `rec_volleyball` |
| Lacrosse | `lacrosse_m_attack`, `lacrosse_m_midfield`, `lacrosse_m_defense`, `lacrosse_m_goalie`, `lacrosse_w_attack`, `lacrosse_w_midfield`, `lacrosse_w_defense`, `lacrosse_w_goalie` | - (adults use `weekend_warrior` + the nearest sport tag) |
| Field hockey | `field_hockey_field`, `field_hockey_gk` | - (adults use `weekend_warrior` + the nearest sport tag) |
| Rugby union (15s and 7s) | `rugby_forwards`, `rugby_backs`, `rugby_sevens` | - (adults use `weekend_warrior` + the nearest sport tag) |
| Cheerleading / STUNT | `cheer_base_spot`, `cheer_flyer_tumbler` | - (adults use `weekend_warrior` + the nearest sport tag) |
| Ultimate (frisbee) | `ultimate_cutter`, `ultimate_handler` | `rec_ultimate` |

**Gen-pop who want to stay athletic.** The coach said general-fitness people want to 'stay athletic and active'. The recreational profiles (`rec_*`) are exactly that option for team sports: the coach's weekend-warrior plan (ATH-13: 'non-competitive, all-around athletic adults') with a sport tag that adds what the weekly game needs (a sprint slot, route-tree COD, hamstring / groin / ankle care). By COACH-ANSWER GEN-02 a recreational player gives the sport only: no position and no season.

## 2. Coach rules applied to every profile

- **Plyo : ballistic share by ground-contact class** (COACH-R2 ATH-01, approved): class 1 = 75 %, 2 = 60 %, 3 = 50 %, 4 = 40 %, 5 = 25 % plyometric at the end of a block; each block starts 15 points more ballistic (floor 20). Sports the coach named keep his class (volleyball / soccer / football skill 60; basketball / football big skill / weekend warriors 50; baseball / softball / hockey / linemen 40). New sports get an INFERRED class.
- **Ballistic vs plyometric** (COACH-R2 ATH-02): ballistic = squat, box, broad, loaded / hex-bar jumps and medball throws; plyometric = pogos, ankle hops, hurdle hops, depth jumps, bounds, squirrel and repeated jumps; stick-the-landing = the receive stage.
- **Receive-Create stages** (COACH-R2 ATH-03): RC1 Land, RC2 Land & Go, RC3 Repeat - 12-week plan weeks 1-3 / 4-7 / 8-12, 8-week plan 1-2 / 3-5 / 6-8; restart each off-season; hold in maintenance blocks; L2-L3 may start at stage 2.
- **Olympic lifts for everyone in athletic training** (ATH-10), up to 4 exposures a week - cleans on squat days, snatches on hinge days (COACH-R2 ATH-04); full squat lifts 3-5 reps with the coach's eye on speed (R2-ATH-05); RIR / RPE guidance, % only for competitive weightlifters (R2-GEN-06); in season a light 2 x 3 piece, dropped in heavy game weeks (R2-ATH-04). L1 list includes the new hang clean, single-arm DB snatch, KB squat clean and hex-bar jump (R2-LIB-07).
- **Season**: off-season blocks climb a stairway (R2-PER-03/04/05), no deload inside a block (R2-VOL-07); pre-season = 4-6 weeks at about 60 % of off-season sets, more speed and power, then a 1-2-week taper (R2-PER-06); in season about 2 lifts a week (PER-08) with the hard day >= 48 h before a game, gym plyos about half, no extra COD and sprints only for speed athletes in game-heavy sports (R2-ATH-07).
- **Aerobic sessions** (R2-ATH-06): off-season baseball / softball 2; basketball, volleyball, football 3; soccer and hockey 3-4; pre-season 2; in season 2 (ATH-07); general / recreational 3; the user can add or remove sessions (R2-SES-06). Colours: A Blue short / high, B Green 1-3 min, C Orange long / low, LC lactate clearance; one of each colour when 3.
- **Session**: core first, 2 exercises x 2 light sets (ATH-11, R2-SES-03); up to 12 exercises + the core block for field athletes (R2-SES-04); heavy squat and heavy deadlift on two different days, non-axial work on the other days (R2-SES-01/02); hip-dominant with push, knee-dominant with pull (UNI-11); calves 3 sets every leg day, rear delts their own sets (VOL-17).
- **Laterality**: bilateral : unilateral from 90/10 to 10/90 (UNI-02) - field / COD athletes 80-90 % unilateral, strength-type athletes more bilateral; in season bilateral minimal (UNI-10); contralateral loading for COD athletes, ipsilateral step-ups for acceleration (CAT-13).
- **Medballs** (ATH-05, EQ-06, EQ-07): high for rotational sports, moderate for basketball and football, never over 20 lb, no ball -> plyo push-ups / fast cable rotations / fake slam; never bands. **No bands or variable resistance anywhere** (EQ-01, EQ-12).
- **Age** (R2-ATH-08): 60+ get no Olympic lifts, plyos or depth jumps by default - optional with the fitness-professional warning; youth do floor Olympic lifts from about 14 after a hang block. High school, college and pro get the same plan with different loads (PRG-09). No rule depends on sex (ATH-09).
- **Tests** before the block and in the last week, never mid-block; people starting from zero test 5RM / 3RM or 80-90 % efforts, never a 1RM or a max mile (R2-PER-07).
- **No lifestyle inputs**: the profiles use no sleep / stress / job data (the coach rejected them, R2-GEN-04); with no check-in the plan follows its planned stairway (R2-VOL-03).

## 3. Summary table

J / T / S / C = jump, throw, sprint, change-of-direction emphasis (0 none - 3 high, from the weekly dose). Plyo % = plyometric share of power work at block start -> block end. Bi:Uni = bilateral : unilateral share of lower-body compound sets, block start -> end (in season). Aerobic = sessions per week off / pre / in season. Pre / In = total weekly sets as % of the off-season week.

| ID | Profile | Cat. | Built from | GC class | Plyo % | J/T/S/C | Bi:Uni | Aerobic | Oly /wk | Pre / In % | Main goal | Weekly sets |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| `football_qb` | American football - quarterback (QB) | comp. | 04 variant football_qb | 4 | 25 -> 40 | 1/1/3/2 | 20/80 -> 10/90 (10/90) | 3 / 2 / 2 | 4 | 60 / 43 | power | 140.5 |
| `football_rb` | American football - running back (RB) | comp. | 04 football_skill + deltas | 2 | 45 -> 60 | 3/1/3/2 | 20/80 -> 10/90 (10/90) | 3 / 2 / 2 | 4 | 62 / 47 | power | 153.5 |
| `football_wr_db` | American football - wide receiver / defensive back (WR / CB / S) | comp. | 04 football_skill | 2 | 45 -> 60 | 3/1/3/3 | 20/80 -> 10/90 (10/90) | 3 / 2 / 2 | 4 | 64 / 47 | power | 151.5 |
| `football_te_lb` | American football - tight end / linebacker (TE / LB, FB, box S) | comp. | 04 football_big_skill | 3 | 35 -> 50 | 2/1/3/2 | 30/70 -> 20/80 (10/90) | 3 / 2 / 2 | 4 | 61 / 44 | strength | 148.5 |
| `football_ol` | American football - offensive line (OL) | comp. | 04 football_lineman + deltas | 4 | 25 -> 40 | 1/1/2/1 | 50/50 -> 40/60 (30/70) | 3 / 2 / 2 | 4 | 60 / 46 | strength | 145.0 |
| `football_dl` | American football - defensive line (DL) | comp. | 04 football_lineman + deltas | 4 | 25 -> 40 | 1/1/2/1 | 50/50 -> 40/60 (30/70) | 3 / 2 / 2 | 4 | 60 / 45 | strength | 151.0 |
| `football_k_p` | American football - kicker / punter (K / P / LS) | comp. | 04 variant football_specialist | 4 | 25 -> 40 | 1/1/2/1 | 20/80 -> 10/90 (10/90) | 3 / 2 / 2 | 4 | 60 / 46 | power | 128.5 |
| `flag_football` | Flag football - competitive (HS / club / national team) | comp. | 04 football_skill + deltas | 2 | 45 -> 60 | 3/1/3/3 | 20/80 -> 10/90 (10/90) | 3 / 2 / 2 | 4 | 64 / 46 | power | 148.5 |
| `rec_flag_football` | Flag football - recreational (adult / youth league) | rec. | 04 weekend_warrior + deltas | 3 | 35 -> 50 | 2/1/2/1 | 50/50 -> 40/60 (-) | 3 / - / - | 4 | - / - | strength | 129.0 |
| `basketball_guard` | Basketball - guards (PG / SG) | comp. | 04 variant basketball_guard | 3 | 35 -> 50 | 3/1/3/3 | 20/80 -> 10/90 (10/90) | 3 / 2 / 2 | 4 | 63 / 41 | power | 159.0 |
| `basketball_wing` | Basketball - wings (SF / combo forwards) | comp. | 04 basketball | 3 | 35 -> 50 | 3/1/2/3 | 20/80 -> 10/90 (10/90) | 3 / 2 / 2 | 4 | 63 / 42 | power | 157.0 |
| `basketball_big` | Basketball - bigs (PF / C) | comp. | 04 variant basketball_big | 3 | 35 -> 50 | 3/1/1/2 | 30/70 -> 20/80 (10/90) | 3 / 2 / 2 | 4 | 60 / 45 | strength | 157.0 |
| `rec_basketball` | Basketball - recreational (league / pickup) | rec. | 04 weekend_warrior + deltas | 3 | 35 -> 50 | 2/1/0/1 | 50/50 -> 40/60 (-) | 3 / - / - | 4 | - / - | strength | 128.0 |
| `baseball_pitcher` | Baseball - pitchers | comp. | 04 variant baseball_pitcher | 4 | 25 -> 40 | 1/1/1/0 | 50/50 -> 40/60 (20/80) | 2 / 2 / 2 | 4 | 60 / 50 | power | 130.6 |
| `baseball_catcher` | Baseball - catchers | comp. | 04 variant baseball_catcher | 4 | 25 -> 40 | 1/1/2/1 | 50/50 -> 40/60 (20/80) | 2 / 2 / 2 | 4 | 60 / 51 | strength | 139.6 |
| `baseball_infield` | Baseball - infielders | comp. | 04 baseball_position + deltas | 4 | 25 -> 40 | 1/1/2/1 | 50/50 -> 40/60 (20/80) | 2 / 2 / 2 | 4 | 60 / 51 | power | 140.6 |
| `baseball_outfield` | Baseball - outfielders | comp. | 04 baseball_position + deltas | 4 | 25 -> 40 | 1/1/3/1 | 50/50 -> 40/60 (20/80) | 2 / 2 / 2 | 4 | 60 / 51 | power | 140.6 |
| `softball_pitcher` | Softball - pitchers (windmill) | comp. | 04 variant softball_pitcher | 4 | 25 -> 40 | 1/1/2/1 | 50/50 -> 40/60 (20/80) | 2 / 2 / 2 | 2 | 60 / 52 | power | 138.5 |
| `softball_position` | Softball - position players | comp. | 04 softball | 4 | 25 -> 40 | 1/2/2/1 | 50/50 -> 40/60 (20/80) | 2 / 2 / 2 | 2 | 60 / 53 | power | 133.5 |
| `rec_softball` | Softball - recreational slow-pitch (adult league) | rec. | 04 weekend_warrior + deltas | 3 | 35 -> 50 | 2/1/1/1 | 50/50 -> 40/60 (-) | 3 / - / - | 4 | - / - | strength | 125.0 |
| `soccer_gk` | Soccer - goalkeeper | comp. | 04 variant soccer_gk | 3 | 35 -> 50 | 2/1/2/2 | 20/80 -> 10/90 (10/90) | 3 / 2 / 2 | 2 | 61 / 46 | power | 132.0 |
| `soccer_defender` | Soccer - defenders (CB / FB) | comp. | 04 soccer + deltas | 2 | 45 -> 60 | 3/1/3/2 | 20/80 -> 10/90 (10/90) | 3 / 2 / 2 | 2 | 63 / 42 | strength | 139.0 |
| `soccer_midfielder` | Soccer - midfielders (CM / DM / AM / wide) | comp. | 04 soccer | 2 | 45 -> 60 | 3/1/3/3 | 20/80 -> 10/90 (10/90) | 4 / 2 / 2 | 2 | 65 / 41 | power | 136.0 |
| `soccer_forward` | Soccer - forwards (ST / W) | comp. | 04 soccer + deltas | 2 | 45 -> 60 | 3/1/3/3 | 20/80 -> 10/90 (10/90) | 3 / 2 / 2 | 2 | 65 / 48 | power | 141.0 |
| `rec_soccer` | Soccer - recreational (adult outdoor / indoor league) | rec. | 04 weekend_warrior + deltas | 3 | 35 -> 50 | 2/1/2/1 | 50/50 -> 40/60 (-) | 3 / - / - | 4 | - / - | strength | 130.0 |
| `hockey_forward` | Ice hockey - forwards (C / W) | comp. | 04 hockey | 4 | 25 -> 40 | 1/1/2/1 | 20/80 -> 10/90 (10/90) | 3 / 2 / 2 | 4 | 60 / 47 | power | 118.5 |
| `hockey_defense` | Ice hockey - defensemen (D) | comp. | 04 hockey + deltas | 4 | 25 -> 40 | 1/1/1/1 | 20/80 -> 10/90 (10/90) | 4 / 2 / 2 | 4 | 60 / 47 | strength | 122.5 |
| `hockey_goalie` | Ice hockey - goalies | comp. | 04 variant hockey_goalie | 4 | 25 -> 40 | 0/1/0/1 | 20/80 -> 10/90 (10/90) | 3 / 2 / 2 | 4 | 60 / 47 | power | 108.5 |
| `rec_hockey` | Ice hockey - recreational (adult league) | rec. | 04 weekend_warrior + deltas | 3 | 35 -> 50 | 2/1/0/1 | 50/50 -> 40/60 (-) | 3 / - / - | 4 | - / - | strength | 120.0 |
| `volleyball_outside_opposite` | Volleyball - outside / opposite hitters | comp. | 04 volleyball | 2 | 45 -> 60 | 3/1/1/1 | 40/60 -> 30/70 (20/80) | 3 / 2 / 2 | 4 | 60 / 45 | power | 146.5 |
| `volleyball_middle` | Volleyball - middle blockers | comp. | 04 volleyball + deltas | 2 | 45 -> 60 | 3/1/1/1 | 40/60 -> 30/70 (20/80) | 3 / 2 / 2 | 4 | 60 / 46 | power | 145.5 |
| `volleyball_setter` | Volleyball - setters | comp. | 04 variant volleyball_setter | 2 | 45 -> 60 | 3/1/1/1 | 40/60 -> 30/70 (20/80) | 3 / 2 / 2 | 4 | 60 / 45 | power | 143.5 |
| `volleyball_libero` | Volleyball - libero / defensive specialist | comp. | 04 variant volleyball_libero | 2 | 45 -> 60 | 1/1/2/2 | 40/60 -> 30/70 (20/80) | 3 / 2 / 2 | 4 | 60 / 42 | power | 134.5 |
| `volleyball_beach` | Beach volleyball (pairs) | comp. | new budget | 3 | 35 -> 50 | 3/1/2/2 | 30/70 -> 20/80 (10/90) | 3 / 2 / 2 | 4 | 60 / 44 | power | 149.0 |
| `rec_volleyball` | Volleyball - recreational (indoor / sand / grass league) | rec. | 04 weekend_warrior + deltas | 3 | 35 -> 50 | 2/1/0/1 | 50/50 -> 40/60 (-) | 3 / - / - | 4 | - / - | strength | 128.0 |
| `lacrosse_m_attack` | Men's lacrosse - attack | comp. | new budget | 2 | 45 -> 60 | 3/1/3/3 | 20/80 -> 10/90 (10/90) | 3 / 2 / 2 | 4 | 64 / 41 | power | 154.0 |
| `lacrosse_m_midfield` | Men's lacrosse - midfield (incl. FOGO variant) | comp. | new budget | 2 | 45 -> 60 | 3/1/3/3 | 20/80 -> 10/90 (10/90) | 4 / 2 / 2 | 4 | 64 / 41 | power | 153.0 |
| `lacrosse_m_defense` | Men's lacrosse - defense (close D / LSM) | comp. | new budget | 3 | 35 -> 50 | 2/1/3/2 | 30/70 -> 20/80 (10/90) | 3 / 2 / 2 | 4 | 62 / 42 | strength | 154.0 |
| `lacrosse_m_goalie` | Men's lacrosse - goalie | comp. | new budget | 3 | 35 -> 50 | 2/1/1/1 | 30/70 -> 20/80 (10/90) | 3 / 2 / 2 | 4 | 60 / 46 | power | 125.0 |
| `lacrosse_w_attack` | Women's lacrosse - attack | comp. | new budget | 2 | 45 -> 60 | 3/1/3/3 | 20/80 -> 10/90 (10/90) | 3 / 2 / 2 | 4 | 65 / 41 | power | 153.0 |
| `lacrosse_w_midfield` | Women's lacrosse - midfield (incl. draw specialist) | comp. | new budget | 2 | 45 -> 60 | 3/1/3/3 | 20/80 -> 10/90 (10/90) | 4 / 2 / 2 | 4 | 65 / 47 | power | 152.0 |
| `lacrosse_w_defense` | Women's lacrosse - defense | comp. | new budget | 2 | 45 -> 60 | 3/1/3/3 | 20/80 -> 10/90 (10/90) | 4 / 2 / 2 | 4 | 64 / 41 | power | 146.0 |
| `lacrosse_w_goalie` | Women's lacrosse - goalie | comp. | new budget | 3 | 35 -> 50 | 2/1/1/1 | 30/70 -> 20/80 (10/90) | 3 / 2 / 2 | 4 | 60 / 46 | power | 125.0 |
| `field_hockey_field` | Field hockey - field players (forwards / midfielders / defenders) | comp. | new budget | 2 | 45 -> 60 | 3/1/3/2 | 20/80 -> 10/90 (10/90) | 3 / 2 / 2 | 3 | 63 / 42 | power | 141.0 |
| `field_hockey_gk` | Field hockey - goalkeeper | comp. | new budget | 3 | 35 -> 50 | 1/1/1/1 | 30/70 -> 20/80 (10/90) | 3 / 2 / 2 | 3 | 60 / 46 | power | 119.0 |
| `rugby_forwards` | Rugby union - forwards (front row / locks / back row) | comp. | 04 football_lineman (new budget) | 4 | 25 -> 40 | 1/1/3/1 | 50/50 -> 40/60 (30/70) | 3 / 2 / 2 | 4 | 60 / 45 | strength | 151.5 |
| `rugby_backs` | Rugby union - backs (halves / centres / back three) | comp. | 04 football_big_skill + deltas | 3 | 35 -> 50 | 2/1/3/2 | 30/70 -> 20/80 (10/90) | 3 / 2 / 2 | 4 | 62 / 48 | power | 152.5 |
| `rugby_sevens` | Rugby sevens | comp. | 04 football_big_skill + deltas | 2 | 45 -> 60 | 3/1/3/2 | 20/80 -> 10/90 (10/90) | 4 / 2 / 2 | 4 | 63 / 48 | power | 156.5 |
| `cheer_base_spot` | Cheerleading / STUNT - bases and back spots | comp. | new budget | 4 | 25 -> 40 | 1/1/0/1 | 50/50 -> 40/60 (30/70) | 2 / 2 / 2 | 4 | 60 / 47 | strength | 124.0 |
| `cheer_flyer_tumbler` | Cheerleading / STUNT - flyers and tumblers | comp. | new budget | 2 | 45 -> 60 | 2/1/1/1 | 30/70 -> 20/80 (10/90) | 2 / 2 / 2 | 3 | 60 / 48 | power | 124.0 |
| `ultimate_cutter` | Ultimate - cutters | comp. | 04 soccer + deltas | 2 | 45 -> 60 | 2/1/3/3 | 20/80 -> 10/90 (10/90) | 4 / 2 / 2 | 3 | 65 / 48 | power | 139.0 |
| `ultimate_handler` | Ultimate - handlers | comp. | 04 soccer + deltas | 3 | 35 -> 50 | 2/1/3/3 | 20/80 -> 10/90 (10/90) | 3 / 2 / 2 | 3 | 64 / 42 | power | 141.0 |
| `rec_ultimate` | Ultimate - recreational league | rec. | 04 weekend_warrior + deltas | 3 | 35 -> 50 | 2/1/2/1 | 50/50 -> 40/60 (-) | 3 / - / - | 4 | - / - | strength | 129.0 |

Class sources: the classes for basketball, volleyball, soccer, football, baseball, softball, hockey and the weekend warrior are the coach's (COACH-R2 ATH-01). Every other class is INFERRED and listed in each profile's `ground_contact.evidence`.

## 4. Per-sport notes

### 4.1 American football (tackle) - ES: Fútbol americano (con tacleo)

- **Positions differ a lot.** NCAA GPS: wide receivers and defensive backs run the most total, high-intensity and sprint distance and make the most max accelerations / decelerations; linemen cover the least (T1). Profiles: QB (04 variant: arm care, rotational, no heavy overhead), RB (skill speed + contact strength - new deltas), WR / DB (04 football_skill unchanged), TE / LB (04 big skill unchanged), OL and DL (04 lineman split: OL more pressing, DL more first-step power and COD), K / P (04 specialist).
- **Injuries:** concussion 7.5 %, ankle sprain 6.9 %, hamstring 4.7 % are the top NCAA injuries (T29); QB shoulder 15.2 % of injuries (T30). Neck work for every tackle position (NECK; T38), SHOULDER_CONTACT (new code) for linemen and QBs.
- **In season:** one game a week -> MD+2 hard lift, MD-3/-4 short power lift; WR / DB and RB keep sprints (speed athletes, R2-ATH-07).
- **US calendar:** high school - practice from late Jul / Aug; games late Aug - Nov (playoffs into Dec); off-season Jan - Jul; college - fall camp Aug; games late Aug - Dec, bowls / playoff into Jan; winter conditioning Jan - Feb; 15 spring practices (Mar - Apr); summer program Jun - Jul; pro - NFL offseason program Apr - Jun (Phase I conditioning, II on-field without contact, III OTAs / minicamp); training camp late Jul; preseason Aug; season Sep - Jan; playoffs to Feb; adult rec - tackle is rarely played by adults recreationally -> flag football (see flag_football). Frequency: 1 game a week; high school 4-5 practices a week; NCAA in season max 20 h/week (4 h/day, 1 day off), out of season 8 h/week (T32, T39, T36; SCIENCE (external calendars, cited)).
- **In-season default pattern:** 1 game a week. Game Sat (college) / Fri (HS) / Sun (NFL): MD+1 recovery + Orange flush; MD+2 = the HARD lift (>= 48 h before the next game, COACH-R2 ATH-07); MD-3 / MD-4 = short power + maintenance lift; MD-1 nothing in the gym. Game-heavy status: COACH-R2 ATH-07 (football is named).
- **Typical equipment:** full weight room (racks, platforms, bumper plates, trap bar), sleds / prowler (drags), medballs 6-20 lb, hurdles, cones, boxes, turf / field for speed and COD, neck harness or plates for neck work; no bands.

| ID | Positions | Key weekly sets (off-season baseline) | Injury codes |
|---|---|---|---|
| `football_qb` | QB | PLYO 6, JLK 6, BALL 5.5, THROW 10, COD 12, SPRINT 6, TE 8; compounds 36; core 16 | SHOULDER_THROWER, ELBOW_THROWER, SHOULDER_CONTACT, LOW_BACK_ROTATIONAL, ANKLE_SPRAIN, NECK, PAIN_GENERAL |
| `football_rb` | RB, FB (lighter fullbacks) | PLYO 13, JLK 6, BALL 5.5, THROW 8, COD 16, SPRINT 8, TE 8; compounds 43; core 16 | HAMSTRING, ACL_LANDING_CUTTING, ANKLE_SPRAIN, SHOULDER_CONTACT, NECK, GROIN_ADDUCTOR, PAIN_GENERAL |
| `football_wr_db` | WR, CB, S (cover safeties; box safeties -> football_te_lb) | PLYO 14, JLK 6, BALL 5.5, THROW 8, COD 18, SPRINT 9, TE 8; compounds 38; core 16 | HAMSTRING, GROIN_ADDUCTOR, ACL_LANDING_CUTTING, ANKLE_SPRAIN, NECK, SHOULDER_CONTACT, PAIN_GENERAL |
| `football_te_lb` | TE, LB, FB, box S | PLYO 11.5, JLK 4, BALL 6.5, THROW 9, COD 12, SPRINT 6, TE 10; compounds 44.5; core 16 | HAMSTRING, NECK, SHOULDER_CONTACT, GROIN_ADDUCTOR, ACL_LANDING_CUTTING, LOW_BACK_LOADING, PAIN_GENERAL |
| `football_ol` | T, G, C | PLYO 5.5, JLK 1, THROW 10, COD 4, SPRINT 3, TE 10; compounds 60.5; core 16 | LOW_BACK_LOADING, SHOULDER_CONTACT, NECK, ACL_LANDING_CUTTING, ANKLE_SPRAIN, PAIN_GENERAL |
| `football_dl` | DT, NT, DE / edge | PLYO 6.5, JLK 1, BALL 2, THROW 10, COD 7, SPRINT 5, TE 10; compounds 58.5; core 16 | LOW_BACK_LOADING, SHOULDER_CONTACT, NECK, ACL_LANDING_CUTTING, ANKLE_SPRAIN, PAIN_GENERAL |
| `football_k_p` | K, P, LS (long snapper: use football_te_lb strength with less COD) | PLYO 2, JLK 6, BALL 5.5, THROW 8, COD 6, SPRINT 4, TE 8; compounds 44; core 16 | HIP_FLEXOR, GROIN_ADDUCTOR, HAMSTRING, LOW_BACK_ROTATIONAL, PAIN_GENERAL |

### 4.2 Flag football - ES: Flag football (fútbol bandera)

- **Every flag player is a skill player**: football_skill dials, less neck and pressing (no tackling). QB is a variant.
- **ACL first.** CIF girls flag: 21 of 24 ACL tears were non-contact (pivot, cut, sudden stop); the game ACL risk rose from 0.17 to 0.64 per 1000 exposures in one year (T34). The ACL landing / cutting rules (stage-1 landings, COD tiers after landing competency) apply by landing competency and history, never by sex (ATH-09).
- **Recreational flag** is one of the easiest team sports for gen-pop adults: `rec_flag_football` = weekend warrior + sprint slot + route tree.
- **US calendar:** high school - girls flag football: 68,847 players in 2024-25 (+60%), sanctioned in 16 states (2 more by 2027, 22 with pilots); the season differs by state (fall, winter or spring); college - small number of college programs; season varies (INFERRED - not researched); pro - national teams / international events; flag football is on the LA 2028 Olympic programme (INFERRED - general knowledge, not cited); adult rec - weekly league nights all year; weekend tournaments of 3-6 short games. Frequency: HS 1-3 games a week; rec 1 game night a week or a tournament day (T33, T34; SCIENCE (cited) + INFERRED where marked).
- **In-season default pattern:** 1-2 games a week: the hard lift >= 48 h before the next game (COACH-R2 ATH-07 logic), a short power lift mid-week; tournament weekends count as 2 games. Game-heavy status: INFERRED extension of COACH-R2 ATH-07 (football family).
- **Typical equipment:** field / turf, cones, flags, DBs / KBs or full gym, medballs 6-10 lb, mini hurdles, boxes; no bands.

| ID | Positions | Key weekly sets (off-season baseline) | Injury codes |
|---|---|---|---|
| `flag_football` | QB, center, WR / route runner, rusher, DB / safety | PLYO 14, JLK 6, BALL 5.5, THROW 8, COD 18, SPRINT 9, TE 8; compounds 37; core 16 | ACL_LANDING_CUTTING, ANKLE_SPRAIN, HAMSTRING, SHOULDER_CONTACT, NECK, PAIN_GENERAL |
| `rec_flag_football` | - (recreational) | PLYO 10, JLK 2, BALL 4, THROW 8, COD 10, SPRINT 3, TE 8; compounds 32; core 16 | HAMSTRING, ACL_LANDING_CUTTING, ANKLE_SPRAIN, PAIN_GENERAL |

### 4.3 Basketball - ES: Baloncesto

- **Reuses the coach's basketball numbers unchanged**: guards = 04 `basketball_guard`, wings = 04 `basketball`, bigs = 04 `basketball_big`. Guards: more distance, accelerations / decelerations and COD; forwards: most high-speed running; centres: most jumps and rebounds (T28; S2: about 41 vs 79 jumps a game).
- **In season (R2-ATH-07):** plyos about half, no extra COD; guards are not treated as speed athletes, so the 04 v1 'guards: sprint exposures' in-season content is superseded (open question O4).
- **Recreational:** league / pickup players get landing, lateral COD and calf / Achilles work.
- **US calendar:** high school - winter season (Nov - Mar) in every state; spring / summer club (AAU) Apr - Jul; college - practice from late Sep; games Nov - Mar; NCAA tournament mid-Mar to early Apr; pro - NBA camp late Sep; season late Oct - mid Apr; playoffs to June; adult rec - leagues and pickup all year. Frequency: HS / college about 2 games a week (more in tournaments); NBA 3-4 a week (T32, T42; SCIENCE (external calendars, cited)).
- **In-season default pattern:** 2 games a week (e.g. Tue / Fri): the hard lift on Saturday or Sunday after Friday's game (both are >= 48 h before Tuesday, COACH-R2 ATH-07); a short power / maintenance lift on Wednesday (48 h before Friday). 3+ games a week: 1 lift + core / calves micro-doses. Game-heavy status: COACH-R2 ATH-07 (basketball is named).
- **Typical equipment:** full gym or DB / KB gym, court, medballs 6-10 lb, boxes, hurdles, cones, slant board / step for calf and tendon work; no bands.

| ID | Positions | Key weekly sets (off-season baseline) | Injury codes |
|---|---|---|---|
| `basketball_guard` | PG, SG | PLYO 15.5, JLK 5, BALL 12.5, THROW 10, COD 20, SPRINT 6, TE 8; compounds 42; core 16 | PATELLAR_TENDON, ANKLE_SPRAIN, ACL_LANDING_CUTTING, HAMSTRING, ACHILLES_CALF, PAIN_GENERAL |
| `basketball_wing` | SF, wing / combo forward | PLYO 17.5, JLK 5, BALL 12.5, THROW 10, COD 18, SPRINT 4, TE 8; compounds 42; core 16 | PATELLAR_TENDON, ANKLE_SPRAIN, ACL_LANDING_CUTTING, HAMSTRING, ACHILLES_CALF, PAIN_GENERAL |
| `basketball_big` | PF, C | PLYO 19.5, JLK 5, BALL 12.5, THROW 10, COD 12, SPRINT 2, TE 8; compounds 48; core 16 | PATELLAR_TENDON, ANKLE_SPRAIN, ACL_LANDING_CUTTING, HAMSTRING, ACHILLES_CALF, PAIN_GENERAL |
| `rec_basketball` | - (recreational) | PLYO 11, JLK 2, BALL 5, THROW 8, COD 10, TE 8; compounds 32; core 16 | ANKLE_SPRAIN, PATELLAR_TENDON, ACHILLES_CALF, ACL_LANDING_CUTTING, PAIN_GENERAL |

### 4.4 Baseball - ES: Béisbol

- **Pitchers and catchers = 04 variants unchanged** (pitchers: less overhead pressing, more arm care, light rotational throws - ATH-08). Infield (+ lateral / reactive first step) and outfield (+ max-velocity sprinting) are new PROPOSED deltas on the coach's own baseball template (OBSERVED).
- **Not a game-heavy sport on the coach's list**: in season keeps the 04 v1 factors (plyos 0.4, throws 0.6) with 2 lifting days; the coach's observed 4-day Block 3 stays evidence (open question O5).
- **US calendar:** high school - spring (Feb / Mar - May / Jun) in 47 of 48 states (Iowa plays in summer); summer and fall ball; college - NCAA D-I Feb - Jun (2026: Feb 13 - Jun 22, College World Series in June); fall practice Sep - Nov; pro - MLB spring training mid-Feb - late Mar; season late Mar - late Sep; postseason Oct; adult rec - adult leagues spring - fall (small); most adults play softball. Frequency: HS 2-4 games a week; college about 4 (midweek + 3-game weekend series); MLB about 6. The coach's own calendars (high school / pro, months and weeks) are OBSERVED in the BASEBALL tab. (T32, T43, T50; SCIENCE (external calendars, cited) + OBSERVED (coach calendars, 06 section 8.2.4)).
- **In-season default pattern:** 4-6 games a week: 2 lifts - Mon after the weekend series (heavier) and a short mid-week lift; pitchers lift by rotation (strength the day after a start, light 2 days before the next). Game-heavy status: not on the R2-ATH-07 list; in season follows the coach's baseball (OBSERVED Block 3) and 04 v1 field_court multipliers.
- **Typical equipment:** full gym (DB-heavy pressing; landmine), medballs 4-10 lb for rotational throws, boxes, hurdles, turf / field for accelerations; no bands.

| ID | Positions | Key weekly sets (off-season baseline) | Injury codes |
|---|---|---|---|
| `baseball_pitcher` | SP, RP | PLYO 5.2, JLK 4.9, BALL 3.9, THROW 4.7, SPRINT 1, TE 8; compounds 40.3; core 16 | SHOULDER_THROWER, ELBOW_THROWER, LOW_BACK_ROTATIONAL, LEAD_HIP_GLUTE, HAMSTRING, GROIN_ADDUCTOR, PAIN_GENERAL |
| `baseball_catcher` | C | PLYO 5.2, JLK 4.9, BALL 3.9, THROW 8.7, COD 2, SPRINT 3, TE 8; compounds 44.3; core 16 | KNEE_DEEP_FLEXION, HIP_FAI_DEEP_FLEXION, LOW_BACK_FLEXED_POSTURE, SHOULDER_THROWER, ELBOW_THROWER, PAIN_GENERAL |
| `baseball_infield` | 1B, 2B, SS, 3B | PLYO 5.2, JLK 4.9, BALL 3.9, THROW 8.7, COD 6, SPRINT 3, TE 8; compounds 44.3; core 16 | SHOULDER_THROWER, ELBOW_THROWER, LOW_BACK_ROTATIONAL, LEAD_HIP_GLUTE, HAMSTRING, GROIN_ADDUCTOR, PAIN_GENERAL |
| `baseball_outfield` | LF, CF, RF | PLYO 5.2, JLK 4.9, BALL 3.9, THROW 8.7, COD 2, SPRINT 6, TE 8; compounds 44.3; core 16 | SHOULDER_THROWER, ELBOW_THROWER, LOW_BACK_ROTATIONAL, LEAD_HIP_GLUTE, HAMSTRING, GROIN_ADDUCTOR, PAIN_GENERAL |

### 4.5 Softball - ES: Sóftbol

- **Windmill pitchers = 04 `softball_pitcher` unchanged** (shoulder and eccentric biceps care; tournament weekends of many pitches). Position players = 04 `softball` with a catcher variant.
- **Slow-pitch recreational softball** is the classic adult league: the tag adds a sprint slot (base running), hamstring and shoulder work and rotational throws.
- **US calendar:** high school - spring in most states (some states play in fall - INFERRED); college - NCAA D-I Feb - early Jun (2026: Feb 5 - Jun 4; Women's College World Series early June); pro - small pro leagues in summer (INFERRED); adult rec - slow-pitch leagues spring - fall, weekly game nights / double-headers. Frequency: HS 2-4 games a week; college 4-5 (series / weekend tournaments); travel ball 4-8 games per tournament weekend (T43, T54; SCIENCE (cited) + INFERRED where marked).
- **In-season default pattern:** as baseball: 2 lifts (one after the weekend games, one short mid-week); pitchers plan around tournament weekends (very high pitch counts in 2-3 days). Game-heavy status: not on the R2-ATH-07 list; same in-season logic as baseball.
- **Typical equipment:** full gym or DB gym, medballs 4-10 lb, boxes, hurdles, field for accelerations; no bands.

| ID | Positions | Key weekly sets (off-season baseline) | Injury codes |
|---|---|---|---|
| `softball_pitcher` | P | PLYO 7, JLK 4, THROW 15, COD 2, SPRINT 3, TE 4; compounds 42.5; core 16 | SHOULDER_THROWER, ELBOW_THROWER, ACL_LANDING_CUTTING, LOW_BACK_ROTATIONAL, LEAD_HIP_GLUTE, PAIN_GENERAL |
| `softball_position` | C, IF, OF | PLYO 7, JLK 4, THROW 18, COD 2, SPRINT 3, TE 4; compounds 42.5; core 16 | SHOULDER_THROWER, ELBOW_THROWER, ACL_LANDING_CUTTING, LOW_BACK_ROTATIONAL, LEAD_HIP_GLUTE, PAIN_GENERAL |
| `rec_softball` | - (recreational) | PLYO 10, JLK 2, BALL 2, THROW 10, COD 4, SPRINT 2, TE 8; compounds 32; core 16 | HAMSTRING, SHOULDER_THROWER, LOW_BACK_ROTATIONAL, ACHILLES_CALF, PAIN_GENERAL |

### 4.6 Soccer - ES: Fútbol

- **Midfielders = 04 `soccer` unchanged** (aerobic 4, top of the coach's 3-4). Defenders add duel / aerial strength and neck (headers); forwards add sprint and jump work; keeper = 04 `soccer_gk`. Central midfielders run the most; wide midfielders and full-backs do the most high-speed running; centre-backs the least distance but many accelerations (T25). Keepers: about half the distance, 10 % of the high-intensity distance (T26).
- **Fixed prehab:** Nordic (S14) and Copenhagen (S15) for outfield players.
- **US calendar:** high school - boys: fall in 32 states, spring in 14, winter in 5; girls: fall 26, spring 20, winter 5; college - NCAA Aug - early Dec (College Cups mid-Dec) + spring non-traditional season; pro - MLS late Feb - early Nov, playoffs to December; NWSL mid-Mar - Nov; adult rec - outdoor and indoor leagues all year. Frequency: 1-2 matches a week (college often Thu / Fri + Sun) (T32, T40, T51; SCIENCE (external calendars, cited)).
- **In-season default pattern:** 1 match: MD+2 hard lift (>= 48 h before the next match, COACH-R2 ATH-07), MD-3 / MD-4 short power lift (04 v1 soccer). 2 matches a week: one lift on MD+2 of the first match if it is >= 48 h before the second, otherwise core / calves micro-doses only. Game-heavy status: COACH-R2 ATH-07 (soccer is named).
- **Typical equipment:** full gym or DB / KB gym, field, cones, mini hurdles, medballs 6-10 lb, Nordic anchor / partner, bench for Copenhagen planks; no bands.

| ID | Positions | Key weekly sets (off-season baseline) | Injury codes |
|---|---|---|---|
| `soccer_gk` | GK | PLYO 12, JLK 6, BALL 9, THROW 7, COD 12, SPRINT 3, TE 4; compounds 34; core 16 | SHOULDER_THROWER, HIP_FAI_DEEP_FLEXION, GROIN_ADDUCTOR, WRIST_HAND, ANKLE_SPRAIN, PAIN_GENERAL |
| `soccer_defender` | CB, FB / wing-back | PLYO 12, JLK 6, BALL 9, THROW 3, COD 16, SPRINT 8, TE 4; compounds 37; core 16 | HAMSTRING, GROIN_ADDUCTOR, ACL_LANDING_CUTTING, ANKLE_SPRAIN, NECK, PAIN_GENERAL |
| `soccer_midfielder` | DM, CM, AM, wide midfielder | PLYO 12, JLK 6, BALL 9, THROW 3, COD 18, SPRINT 9, TE 4; compounds 33; core 16 | HAMSTRING, GROIN_ADDUCTOR, ACL_LANDING_CUTTING, ANKLE_SPRAIN, HIP_FLEXOR, PAIN_GENERAL |
| `soccer_forward` | ST, W | PLYO 13, JLK 6, BALL 10, THROW 3, COD 18, SPRINT 11, TE 4; compounds 33; core 16 | HAMSTRING, GROIN_ADDUCTOR, ACL_LANDING_CUTTING, ANKLE_SPRAIN, HIP_FLEXOR, PAIN_GENERAL |
| `rec_soccer` | - (recreational) | PLYO 10, JLK 2, BALL 4, THROW 8, COD 10, SPRINT 3, TE 8; compounds 32; core 16 | HAMSTRING, GROIN_ADDUCTOR, ANKLE_SPRAIN, ACL_LANDING_CUTTING, PAIN_GENERAL |

### 4.7 Ice hockey - ES: Hockey sobre hielo

- **Forwards = 04 `hockey` unchanged; goalie = 04 variant.** Defensemen get more strength and aerobic work: they play more minutes (16:35 vs 14:39) and make more decelerations (T22). Skating contacts stay long even at speed (T24) -> class 4.
- **Goalies:** butterfly goalies show high rates of symptomatic FAI (T23) -> hip, groin and deep-flexion rules.
- **Recreational:** adult-league skaters get groin, hip and low-back care; on-land COD becomes lateral bounds.
- **US calendar:** high school - winter (Nov - Mar); college - NCAA Oct - Apr (Frozen Four in April); pro - NHL Oct - mid Apr; playoffs through June; adult rec - adult leagues all year (late-night 'beer league' games). Frequency: 2-3 games a week (weekend series in college); NHL 3-4 (T32, T41, T55; SCIENCE (external calendars, cited) + INFERRED where marked).
- **In-season default pattern:** 2-3 games a week: 2 lifts, the hard one >= 48 h before the next game (COACH-R2 ATH-07); weekend series (Fri / Sat) -> Mon hard lift, Wed short power lift. Game-heavy status: COACH-R2 ATH-07 (hockey is named).
- **Typical equipment:** full gym, slide board, medballs 6-10 lb, bike / skate treadmill for conditioning (any erg - EQ-14); no bands.

| ID | Positions | Key weekly sets (off-season baseline) | Injury codes |
|---|---|---|---|
| `hockey_forward` | C, LW, RW | PLYO 5, JLK 4, BALL 5, THROW 8.5, COD 4, SPRINT 3, TE 8; compounds 39; core 16 | GROIN_ADDUCTOR, HIP_FAI_DEEP_FLEXION, NECK, LOW_BACK_ROTATIONAL, PAIN_GENERAL |
| `hockey_defense` | LD, RD | PLYO 5, JLK 4, BALL 5, THROW 8.5, COD 4, SPRINT 2, TE 8; compounds 43; core 16 | GROIN_ADDUCTOR, HIP_FAI_DEEP_FLEXION, NECK, LOW_BACK_ROTATIONAL, PAIN_GENERAL |
| `hockey_goalie` | G | PLYO 0, JLK 4, BALL 5, THROW 4.5, COD 6, TE 8; compounds 39; core 16 | HIP_FAI_DEEP_FLEXION, GROIN_ADDUCTOR, KNEE_DEEP_FLEXION, LOW_BACK_ROTATIONAL, PAIN_GENERAL |
| `rec_hockey` | - (recreational) | PLYO 10, JLK 2, BALL 4, THROW 8, COD 4, TE 8; compounds 32; core 16 | GROIN_ADDUCTOR, HIP_FAI_DEEP_FLEXION, LOW_BACK_FLEXED_POSTURE, PAIN_GENERAL |

### 4.8 Volleyball - ES: Voleibol

- **Outside / opposite = 04 `volleyball` unchanged; setter and libero = 04 variants; middles add block jumps.** Jumps per match: hitters 19.7-80, middles 52.5-77.2, setters about 104.5 (S3); jumper's knee 44.6 % in elite volleyball (S21).
- **Beach (new, PROPOSED class 3):** 52-85 jumps per player per match (T19), more small jumps and a higher heart-rate load than indoor (T21), and sand slows the take-off (T20).
- **Recreational:** indoor / sand / grass league players get landing, knee-tendon and shoulder care.
- **US calendar:** high school - girls: fall in every state; boys: spring (INFERRED); college - NCAA women late Aug - mid Dec; NCAA men Jan - May; NCAA beach Feb / Mar - early May (championship early May); pro - pro indoor leagues vary; AVP beach in summer (INFERRED); adult rec - indoor, sand and grass leagues all year. Frequency: HS 2-3 matches a week; college 2 a week (weekend); club / beach tournaments 3-6 matches a day (T32, T44; SCIENCE (cited) + INFERRED where marked).
- **In-season default pattern:** 2 matches a week (e.g. Fri / Sat): Mon hard lift, Wed short power lift (>= 48 h before Friday, COACH-R2 ATH-07); count match / practice jumps before adding gym plyos (PATELLAR_TENDON). Game-heavy status: COACH-R2 ATH-07 (volleyball is named).
- **Typical equipment:** full gym or DB gym, court / sand, boxes, hurdles, medballs 4-10 lb (overhead / rotational), slant board for tendon work; no bands.

| ID | Positions | Key weekly sets (off-season baseline) | Injury codes |
|---|---|---|---|
| `volleyball_outside_opposite` | OH, OPP | PLYO 19, JLK 6.5, BALL 9, THROW 8, COD 9, SPRINT 2, TE 8; compounds 40; core 16 | PATELLAR_TENDON, ANKLE_SPRAIN, SHOULDER_THROWER, ACL_LANDING_CUTTING, LOW_BACK_ROTATIONAL, PAIN_GENERAL |
| `volleyball_middle` | MB | PLYO 21, JLK 6.5, BALL 9, THROW 8, COD 7, SPRINT 1, TE 8; compounds 40; core 16 | PATELLAR_TENDON, ANKLE_SPRAIN, SHOULDER_THROWER, ACL_LANDING_CUTTING, LOW_BACK_ROTATIONAL, PAIN_GENERAL |
| `volleyball_setter` | S | PLYO 15, JLK 9.5, BALL 9, THROW 6, COD 9, SPRINT 2, TE 8; compounds 40; core 16 | PATELLAR_TENDON, ANKLE_SPRAIN, SHOULDER_THROWER, ACL_LANDING_CUTTING, LOW_BACK_ROTATIONAL, PAIN_GENERAL |
| `volleyball_libero` | L, DS | PLYO 3, JLK 6.5, BALL 9, THROW 4, COD 15, SPRINT 4, TE 8; compounds 40; core 16 | PATELLAR_TENDON, ANKLE_SPRAIN, SHOULDER_THROWER, ACL_LANDING_CUTTING, LOW_BACK_ROTATIONAL, PAIN_GENERAL |
| `volleyball_beach` | blocker, defender | PLYO 15, JLK 5, BALL 10, THROW 10, COD 12, SPRINT 3, TE 8; compounds 41; core 16 | PATELLAR_TENDON, SHOULDER_THROWER, LOW_BACK_ROTATIONAL, ANKLE_SPRAIN, ACHILLES_CALF, PAIN_GENERAL |
| `rec_volleyball` | - (recreational) | PLYO 12, JLK 2, BALL 6, THROW 8, COD 6, TE 8; compounds 32; core 16 | PATELLAR_TENDON, SHOULDER_THROWER, ANKLE_SPRAIN, PAIN_GENERAL |

### 4.9 Lacrosse - ES: Lacrosse

- **Built new (lacrosse is not in the coach's sheets).** Men's midfielders show the highest sprint distance, top speed, accelerations and decelerations; women's matches show more total and sprint distance than men's, men's more top speed and accelerations (T3, T2). Defenders were the strongest NCAA group (T4).
- **Men's vs women's** differ by RULES (body checking only in the men's game), not by sex - so the women's profiles carry less contact strength and neck work, and the ACL rules come from landing competency (ATH-09).
- **Specialists:** FOGO (men's midfield variant, class 4: front-squat leverage, grip, wrists), LSM (defense variant), draw specialist (women's midfield variant: grip and rotational pulling).
- **Injuries:** ankle sprains and knee injuries lead in men's games; ankle sprain, concussion and hamstring in women's (T5, T6); male lacrosse ACL rate about twice basketball (T49).
- **US calendar:** high school - spring (all 23 states with championships play in spring); college - NCAA early Feb - Memorial Day weekend (championships); fall ball in autumn; pro - PLL (outdoor) May - Sep; WLL (women's pro) launched 2026 in summer; NLL (indoor box) late Nov - May; adult rec - summer and box leagues (small). Frequency: HS 2-3 games a week; college 1-2 (T32, T45, T52; SCIENCE (external calendars, cited)).
- **In-season default pattern:** 1-2 games a week: MD+2 hard lift >= 48 h before the next game; MD-3 short power lift (as soccer). Game-heavy status: INFERRED extension of COACH-R2 ATH-07 (running / cutting field sport like soccer).
- **Typical equipment:** full gym, field, cones, hurdles, medballs 6-10 lb (rotational shooting pattern), neck harness or plates (men); no bands.

| ID | Positions | Key weekly sets (off-season baseline) | Injury codes |
|---|---|---|---|
| `lacrosse_m_attack` | A | PLYO 14, JLK 7, BALL 6, THROW 9, COD 20, SPRINT 7, TE 8; compounds 38; core 16 | ANKLE_SPRAIN, ACL_LANDING_CUTTING, HAMSTRING, GROIN_ADDUCTOR, SHOULDER_CONTACT, NECK, PAIN_GENERAL |
| `lacrosse_m_midfield` | M, SSDM, FOGO (variant) | PLYO 14, JLK 7, BALL 6, THROW 8, COD 18, SPRINT 9, TE 8; compounds 38; core 16 | HAMSTRING, ANKLE_SPRAIN, ACL_LANDING_CUTTING, GROIN_ADDUCTOR, SHOULDER_CONTACT, NECK, PAIN_GENERAL |
| `lacrosse_m_defense` | D, LSM (variant) | PLYO 12, JLK 6, BALL 9, THROW 9, COD 16, SPRINT 6, TE 10; compounds 43; core 16 | ANKLE_SPRAIN, ACL_LANDING_CUTTING, SHOULDER_CONTACT, NECK, GROIN_ADDUCTOR, LOW_BACK_ROTATIONAL, PAIN_GENERAL |
| `lacrosse_m_goalie` | G | PLYO 8, JLK 6, BALL 6, THROW 8, COD 8, SPRINT 2, TE 8; compounds 38; core 16 | HIP_FAI_DEEP_FLEXION, GROIN_ADDUCTOR, WRIST_HAND, NECK, PAIN_GENERAL |
| `lacrosse_w_attack` | A | PLYO 14, JLK 7, BALL 6, THROW 9, COD 20, SPRINT 8, TE 8; compounds 37; core 16 | ANKLE_SPRAIN, ACL_LANDING_CUTTING, HAMSTRING, NECK, GROIN_ADDUCTOR, PAIN_GENERAL |
| `lacrosse_w_midfield` | M, draw specialist (variant) | PLYO 14, JLK 7, BALL 6, THROW 8, COD 18, SPRINT 10, TE 8; compounds 37; core 16 | HAMSTRING, ANKLE_SPRAIN, ACL_LANDING_CUTTING, GROIN_ADDUCTOR, NECK, PAIN_GENERAL |
| `lacrosse_w_defense` | D | PLYO 13, JLK 7, BALL 6, THROW 7, COD 18, SPRINT 7, TE 8; compounds 39; core 16 | ANKLE_SPRAIN, ACL_LANDING_CUTTING, HAMSTRING, GROIN_ADDUCTOR, NECK, PAIN_GENERAL |
| `lacrosse_w_goalie` | G | PLYO 8, JLK 6, BALL 6, THROW 8, COD 8, SPRINT 2, TE 8; compounds 38; core 16 | HIP_FAI_DEEP_FLEXION, GROIN_ADDUCTOR, WRIST_HAND, NECK, PAIN_GENERAL |

### 4.10 Field hockey - ES: Hockey sobre césped

- **Built new.** Soccer-like running in a crouch: 30-50 degrees of trunk flexion for most of play and 3-5x the low-back-pain risk of other sports (T7). The new code LOW_BACK_FLEXED_POSTURE puts back-extension endurance, anti-flexion core and hip-flexor work in every week.
- **Positions:** forwards fastest (peak about 194 m/min) and defenders slowest (T8) -> variants inside the field-player profile; goalkeeper separate (lateral saves in heavy pads).
- **Injuries:** NCAA head / face 16 % of injuries, concussion 8.6 %, ankle sprain 6.7 % (T9).
- **US calendar:** high school - fall (16 states sponsor it, all in fall); college - NCAA late Aug - Nov; spring non-traditional season and winter indoor (INFERRED); pro - no US pro league; national team / club (INFERRED); adult rec - club and masters hockey (small). Frequency: HS 2-3 games a week; college about 2 (Fri / Sun) (T32, T9; SCIENCE (cited) + INFERRED where marked).
- **In-season default pattern:** Fri / Sun games: Mon / Tue hard lift (>= 48 h before Friday), Wed short power lift. Game-heavy status: INFERRED extension of COACH-R2 ATH-07 (running / cutting field sport like soccer).
- **Typical equipment:** full gym or DB gym, turf, cones, medballs 4-10 lb (rotational hitting pattern); no bands.

| ID | Positions | Key weekly sets (off-season baseline) | Injury codes |
|---|---|---|---|
| `field_hockey_field` | F, M, D | PLYO 12, JLK 6, BALL 6, THROW 6, COD 16, SPRINT 8, TE 6; compounds 37; core 16 | LOW_BACK_FLEXED_POSTURE, ANKLE_SPRAIN, HAMSTRING, GROIN_ADDUCTOR, ACL_LANDING_CUTTING, NECK, PAIN_GENERAL |
| `field_hockey_gk` | GK | PLYO 8, JLK 4, BALL 6, THROW 6, COD 8, SPRINT 2, TE 6; compounds 40; core 16 | HIP_FAI_DEEP_FLEXION, GROIN_ADDUCTOR, KNEE_DEEP_FLEXION, LOW_BACK_FLEXED_POSTURE, WRIST_HAND, PAIN_GENERAL |

### 4.11 Rugby union (15s and 7s) - ES: Rugby (XV y 7)

- **The coach put rugby in the 'more resistance' group** (ATH-03) and 04 mapped forwards to the lineman profile and backs to big skill. Forwards = lineman-level strength with more running, neck 6 sets and line-out lifting; backs = 04 big skill + sprint and COD; sevens = a speed variant (PROPOSED class 2, aerobic 4).
- **Why:** forwards do the collisions, backs the high-speed running (T10); match injury about 87 / 1000 h with the tackle in about half of them (T11); sevens tournaments pack about 6 matches into 2-3 days (T12).
- **US calendar:** high school - mostly spring (from mid-Jan); a few states in fall; college - fall = 15s championships; spring = 7s and tournaments; pro - Major League Rugby spring - summer; adult rec - adult club rugby fall and spring; touch / social 7s in summer (INFERRED). Frequency: 15s: 1 match a week; 7s: tournaments of about 6 matches over 2-3 days (T46, T53, T12; SCIENCE (external calendars, cited)).
- **In-season default pattern:** 15s, Sat match: Mon MD+2 hard lift (>= 48 h before the next match), Wed MD-3 power lift; 7s tournament weeks: 1 short power lift early in the week only. Game-heavy status: INFERRED extension of COACH-R2 ATH-07 (collision + running sport).
- **Typical equipment:** full gym (racks, platforms, trap bar), sleds, tackle bags / pads (practice), neck harness or plates, medballs up to 20 lb; no bands.

| ID | Positions | Key weekly sets (off-season baseline) | Injury codes |
|---|---|---|---|
| `rugby_forwards` | prop, hooker, lock, flanker, No. 8 | PLYO 5, JLK 2, BALL 2, THROW 8, COD 8, SPRINT 6, TE 10; compounds 60.5; core 16 | NECK, SHOULDER_CONTACT, LOW_BACK_LOADING, HAMSTRING, ACL_LANDING_CUTTING, PAIN_GENERAL |
| `rugby_backs` | scrum-half, fly-half, centre, wing, fullback | PLYO 11.5, JLK 4, BALL 6.5, THROW 9, COD 14, SPRINT 8, TE 10; compounds 44.5; core 16 | HAMSTRING, NECK, SHOULDER_CONTACT, ACL_LANDING_CUTTING, ANKLE_SPRAIN, GROIN_ADDUCTOR, PAIN_GENERAL |
| `rugby_sevens` | forward, back | PLYO 13.5, JLK 4, BALL 4.5, THROW 8, COD 16, SPRINT 11, TE 10; compounds 44.5; core 16 | HAMSTRING, NECK, SHOULDER_CONTACT, ACL_LANDING_CUTTING, ANKLE_SPRAIN, GROIN_ADDUCTOR, PAIN_GENERAL |

### 4.12 Cheerleading / STUNT - ES: Cheerleading (porrismo) / STUNT

- **Competitive spirit is now the 6th-largest girls' school sport** (T33); STUNT becomes an NCAA championship sport in spring 2027 (T16).
- **Two roles, two profiles.** Bases / back spots: lift, toss and catch people overhead -> vertical-push lockout, push press / push jerk / cleans (the basket toss is triple extension + an overhead push), squat-catch strength, wrists, low back (new code STUNT_CATCH_LOAD). Flyers / tumblers: jumpers with very short tumbling contacts (120-180 ms, T15) and dismount landings around 6 BW (T14) -> landing stage first (new code TUMBLING_LANDING).
- **Injuries:** stunts cause about 60 % of cheer injuries and 96 % of concussions; bases and spotters are injured most (T13).
- **US calendar:** high school - tryouts Mar - May; summer camp Jun - Jul; sideline Aug - Nov (football) and winter (basketball); competition Dec - Feb; college - sideline + competition (nationals in spring); STUNT is a spring sport (first contest Feb 1) and an NCAA championship sport from spring 2027; pro - n/a (all-star gyms: season summer to spring, nationals / Worlds in spring); adult rec - adult / open all-star teams (small). Frequency: practice 3-5 a week; 1-2 sideline games a week in season; competition weekends (T47, T16, T33; SCIENCE (external calendars, cited)).
- **In-season default pattern:** competition season: 2 lifts (Mon hard, Wed short power) with >= 48 h before a competition weekend; sideline-only weeks can keep 3 lifts. Game-heavy status: INFERRED: practice supplies most tumbling / jump contacts -> treat like a game-heavy sport for gym plyos.
- **Typical equipment:** full gym or DB / KB gym, mats / spring floor (practice), boxes, low hurdles, medballs 4-10 lb, wrist-friendly handles (DB / KB); no bands.

| ID | Positions | Key weekly sets (off-season baseline) | Injury codes |
|---|---|---|---|
| `cheer_base_spot` | main base, side base, back spot | PLYO 5, JLK 4, BALL 5, THROW 8, COD 2, TE 12; compounds 44; core 16 | STUNT_CATCH_LOAD, LOW_BACK_LOADING, WRIST_HAND, SHOULDER_CONTACT, ANKLE_SPRAIN, NECK, PAIN_GENERAL |
| `cheer_flyer_tumbler` | flyer, tumbler / all-around | PLYO 12, JLK 8, BALL 6, THROW 7, COD 4, SPRINT 2, TE 6; compounds 38; core 16 | TUMBLING_LANDING, ANKLE_SPRAIN, WRIST_HAND, ACL_LANDING_CUTTING, LOW_BACK_LOADING, NECK, PAIN_GENERAL |

### 4.13 Ultimate (frisbee) - ES: Ultimate (frisbee)

- **Built from the soccer profile.** Competitive games: 4.7 km, 17 sprints, mean heart rate 82 % HRmax (T17). Cutters = repeat sprints and hard cuts (class 2, aerobic 4, speed athletes); handlers = rotational throwing and short resets (class 3).
- **Injuries:** muscle strains, ankles and knees (T18) -> hamstring, ankle and ACL rules.
- **Recreational ultimate** is a running-heavy adult league option: sprint slot + hamstring / ankle care.
- **US calendar:** high school - club / school teams mostly in spring (INFERRED); college - USA Ultimate college season winter - spring (nationals late May - INFERRED date); pro - AUDL about one game a week in spring - summer; club regular season summer, championship series in fall; adult rec - rec leagues all year (spring / summer / fall / winter leagues). Frequency: tournaments of 5-8 games over a weekend (INFERRED); AUDL 1 game a week (T48; SCIENCE (cited) + INFERRED where marked).
- **In-season default pattern:** weekend tournaments: Mon recovery + Orange flush, Tue hard lift (>= 48 h before Saturday), Thu short power lift or off. Game-heavy status: INFERRED extension of COACH-R2 ATH-07 (running / cutting field sport).
- **Typical equipment:** field, cones, DB / KB or full gym, medballs 4-10 lb (rotational), boxes, hurdles; no bands.

| ID | Positions | Key weekly sets (off-season baseline) | Injury codes |
|---|---|---|---|
| `ultimate_cutter` | cutter, deep | PLYO 12, JLK 6, BALL 6, THROW 6, COD 18, SPRINT 10, TE 6; compounds 33; core 16 | HAMSTRING, ANKLE_SPRAIN, ACL_LANDING_CUTTING, GROIN_ADDUCTOR, SHOULDER_CONTACT, PAIN_GENERAL |
| `ultimate_handler` | handler | PLYO 10, JLK 6, BALL 8, THROW 8, COD 18, SPRINT 7, TE 6; compounds 35; core 16 | ANKLE_SPRAIN, ACL_LANDING_CUTTING, HAMSTRING, SHOULDER_THROWER, LOW_BACK_ROTATIONAL, PAIN_GENERAL |
| `rec_ultimate` | - (recreational) | PLYO 10, JLK 2, BALL 4, THROW 8, COD 10, SPRINT 3, TE 8; compounds 32; core 16 | HAMSTRING, ANKLE_SPRAIN, ACL_LANDING_CUTTING, PAIN_GENERAL |

## 5. How a profile is laid out (example: men's lacrosse midfield)

Off-season week (from `sample_week.off_season`):

- Mon - A1 knee + pull: warm-up -> core 2 x 2 sets, light (R2-SES-03) -> 2 plyo / ballistic -> clean variant (squat pattern, R2-ATH-04) -> HEAVY SQUAT (axial day 1, R2-SES-01) + horizontal pull -> unilateral knee-dominant (contralateral load) + vertical pull -> Nordic / slider curls, Copenhagen plank -> calves 3 sets
- Tue - B1 hip + push: speed / COD block first (squirrel jumps -> MACH / acceleration starts -> max velocity, LIB-21; route tree EASY -> MOD. -> HARD TURN, ATH-06) -> core 2 x 2 -> plyo + medball throws -> snatch variant (hinge pattern) -> non-axial hinge (hip thrust / back extension / reverse hyper) + horizontal push -> unilateral hip-dominant + vertical push -> neck isometrics 4-way -> calves 3 sets
- Wed - aerobic 1 + optional Focus / core (optional days ideally separate - ORD-10)
- Thu - A2 knee + pull: core 2 x 2 -> 2 plyo / ballistic -> clean variant -> leg press or belt squat (non-axial) + pull -> unilateral knee-dominant -> Nordic / slider curls, Copenhagen plank -> calves 3 sets
- Fri - B2 hip + push: speed / COD block first (squirrel jumps -> MACH / acceleration starts -> max velocity, LIB-21; route tree EASY -> MOD. -> HARD TURN, ATH-06) -> core 2 x 2 -> plyo + medball throws -> snatch variant (hinge pattern) -> HEAVY DEADLIFT / trap-bar (axial day 2, R2-SES-01) + push -> unilateral hip-dominant -> neck isometrics 4-way -> calves 3 sets
- Sat - aerobic 2 + aerobic 3 (or after a lifting day)
- Sun - off (or aerobic 4 when 4 sessions are set)

In season (from `sample_week.in_season`):

- Pattern: 1-2 games a week: MD+2 hard lift >= 48 h before the next game; MD-3 short power lift (as soccer).
- Hard lift (>= 48 h before the next game, R2-ATH-07): core 2 x 2 -> 1 plyo at about half volume -> Olympic light 2 x 3 -> squat OR deadlift (alternate weeks; 3-5 reps, RIR 2-3; bilateral kept minimal - UNI-10) + pull -> 1 unilateral -> Nordic / slider curls, Copenhagen plank -> calves
- Short lift (mid-week): core 2 x 2 -> unilateral + upper push / pull 2 sets -> neck isometrics 4-way
- Day after a game: Orange flush 20-30 min + mobility; game days: no lifting
- Aerobic: 2 a week in season (COACH-ANSWER ATH-07) - usually the post-game Orange flush + 1 short Blue / Green if game minutes are low

Each profile also carries `olympic_policy`, `medball_policy`, `in_season_gym`, `injury_prehab`, `age_notes`, `tests`, `season_calendar_us` and a `field_evidence` map that labels every field COACH / INFERRED / SCIENCE / PROPOSED.

## 6. New fields (not in the 04 schema)

| Field | Type | Why |
|---|---|---|
| `name_es` | string | Spanish display name (COACH-R2 GEN-08; pending coach approval) |
| `sport / sport_name / sport_name_es` | string | groups position profiles under one sport for the intake menu |
| `category` | enum: competitive / recreational | COACH-ANSWER GEN-02: competitive = sport + position + season; recreational = sport tag on weekend_warrior |
| `positions` | list | positions covered by the profile (empty for recreational) |
| `base_profile / reuse_status / weekly_sets_delta_vs_base` | string / enum / object | traceability to the 04 v1 numbers (unchanged / delta / new) |
| `emphasis` | object 0-3 | jump / throw / sprint / COD emphasis computed from the weekly dose tiers |
| `power_mix_by_phase` | object | plyo : ballistic share by phase (COACH-R2 ATH-01 / ATH-03 / ATH-07) |
| `upper_lower_emphasis` | object | share of resistance sets upper vs lower (computed) |
| `rotation_emphasis` | string | rotation need in plain words (complements planes / core.plane_pct) |
| `resistance_goal` | object primary / secondary | strength / power / hypertrophy / endurance-strength |
| `olympic_policy` | object | COACH-ANSWER ATH-10 + COACH-R2 ATH-04 / ATH-05 / ATH-08 / GEN-06 per profile |
| `medball_policy` | object | ATH-05 / EQ-06 / EQ-07 / LIB-22 per profile |
| `in_season_gym` | object | lift days, hard-day spacing (>= 48 h, COACH-R2 ATH-07), typical games, reductions, intake (COACH-R2 GEN-05) |
| `injury_prehab` | list | injury hotspots -> selection rules (no bands) |
| `age_notes` | list | youth / older / competition-level rules (COACH-R2 ATH-08 etc.) |
| `equipment` | list | typical equipment for the sport |
| `sample_week` | object | day-by-day skeleton per phase |
| `tests` | object | test menu and timing (COACH-R2 PER-07) |
| `season_calendar_us` | object | US high school / college / pro / adult-rec calendars + practice / game frequency, cited |
| `field_evidence` | object | evidence label per field (COACH vs INFERRED vs SCIENCE vs PROPOSED) |
| `ath03_evidence` | string | evidence for the ath03_group value |
| `aerobic_sessions_wk.off_season_range / pre_season / user_adjustable / colour_mix_by_phase / colours / modes / evidence` | sub-fields | COACH-R2 ATH-06 / SES-06 and colour mix by phase |
| `bilateral_unilateral.pre_season` | [bilateral, unilateral] | UNI-10: unilateral share rises toward the season |
| `power_mix.rank_note` | string | where an unranked sport sits on the ATH-02 ranking (INFERRED) |
| `core.dose` | string | R2-SES-03 light core-first dose |
| `season_overrides.pre_season / in_season (rewritten)` | object | COACH-R2 PER-06 / ATH-07 factors with total % of off-season sets |
| `sport_tag / intake_rule` | string | recreational profiles only (weekend_warrior + sport tag) |
| `derived (light)` | object | same names as 04 derived but a subset (no muscle-credit block) |

## 7. New injury codes and extensions of the 04 library

- **SHOULDER_CONTACT** (SCIENCE (T29, T30, T11) for the hotspot; rules INFERRED from 04 SHOULDER_* rules and COACH-ANSWER VOL-17 / EQ-01) - sports: American football (all positions, linemen and QB first), rugby, men's lacrosse, ice hockey, cheer bases / back spots (catching), flag football (falls). Rules: pull sets >= push sets every week (rows before pulldowns - ORD-01); rear delts get their own sets (VOL-17) / scapular / rotator-cuff work with DB, cable or KB (KB face pulls = shoulder work on pull / shoulder days - COACH-R2 LIB-04, LIB-10); never bands (EQ-01) / after a flagged sprain or dislocation: DB / landmine / neutral-grip pressing and end-range isometric holds instead of barbell bench; no behind-the-neck pressing (INFERRED) / in season keep pressing strength at maintenance - do not cut it to zero (same logic as COACH-ANSWER ATH-04)
- **LOW_BACK_FLEXED_POSTURE** (SCIENCE (T7) for the hotspot; rules INFERRED from 04 LOW_BACK_* rules and COACH-R2 SES-01/02) - sports: field hockey (field players and goalkeeper), ice hockey skaters, baseball / softball catchers. Rules: trunk-extensor endurance on the non-axial hinge day (back extension, reverse hyper - EQ-11) and core first every session, anti-flexion / anti-rotation before dynamic (ATH-11, R2-SES-03) / heavy squat and heavy deadlift on two different days; other days non-axial (COACH-R2 SES-01/02) / loaded hip-flexion and hip-flexor length work in the FOCUS / warm-up slot 1-2x/week; thoracic rotation mobility in the warm-up / avoid high-volume loaded flexion + rotation; pain moves the work to machines / split grips or drops it (VOL-03)
- **KNEE_DEEP_FLEXION** (SCIENCE (T31, T23) for the hotspot; rules INFERRED) - sports: baseball / softball catchers, ice hockey and field hockey goalkeepers, lacrosse face-off specialists, cheer bases (squat catch). Rules: build deep-flexion tolerance gradually (goblet squat to depth, split squats, belt squat) - goblet / hack / pendulum fine on the second day if not sore (COACH-R2 SES-02) / quad-tendon isometrics / slow leg extensions 2x/week (ISO_QUAD) / in season: no high-volume loaded deep squats; deep positions come from the sport (INFERRED)
- **STUNT_CATCH_LOAD** (SCIENCE (T13) for the hotspot; rules INFERRED) - sports: cheer bases and back spots, rugby locks (line-out lifting), STUNT bases. Rules: overhead lockout strength: push press / push jerk / DB-KB overhead holds and carries (push press is the easier rung - LIB-13) / eccentric squat-catch strength: front squat, goblet squat, belt squat on non-axial days (R2-SES-01/02) / wrist and forearm work (ISO_GRIP) 2x/week; neutral-grip DB pressing when wrists are flagged (WRIST_HAND) / anti-extension core first every session (ATH-11)
- **TUMBLING_LANDING** (SCIENCE (T14, T15, T13) for the hotspot; rules from COACH-R2 ATH-02/03 and 04 ACL / ANKLE rules) - sports: cheer flyers and tumblers, STUNT flyers. Rules: Receive-Create stage 1 (Land) every block before stage 2-3 (COACH-R2 ATH-03); stick-the-landing drills are the 'receive' stage (R2-ATH-02) / ankle stiffness track (JLK) 2x/week and single-leg landings with a lateral component (ANKLE_SPRAIN) / anti-extension core (walkovers / back handsprings load lumbar extension); wrist work (WRIST_HAND) / count practice tumbling passes before adding gym plyos in season (same logic as PATELLAR_TENDON)
- **NECK** (extension): sports added: lacrosse (both), field hockey, rugby (all), cheer, flag football, soccer defenders (headers). Rationale: each 1 lb of neck strength = 5% lower concussion odds in high-school athletes (T38, SCIENCE). Rules unchanged from 04 (isometric 4-way -> plate / manual eccentric; no bands).
- **GROIN_ADDUCTOR** (extension): sports added: lacrosse, field hockey, rugby, ultimate (cutting / kicking).
- **HAMSTRING** (extension): sports added: lacrosse, field hockey, rugby backs, ultimate, flag football.
- **ACL_LANDING_CUTTING** (extension): sports added: lacrosse (male ACL rate about 2x basketball - T49), flag football (CIF: 21 of 24 ACL tears non-contact - T34), ultimate, field hockey, rugby, cheer. Applied by landing competency and injury history, never by sex (ATH-09).
- **ANKLE_SPRAIN** (extension): sports added: lacrosse (top injury both sexes - T5/T6), field hockey (T9), ultimate (T18), flag football, cheer (T13).
- **HIP_FAI_DEEP_FLEXION** (extension): sports added: lacrosse goalies, field hockey goalkeepers.
- **WRIST_HAND** (extension): sports added: cheer (tumbling, bases), lacrosse face-off specialists, field hockey goalkeepers.

## 8. Flags and open questions for the coach

- **O1 - Floor of 10 weekly sets per muscle vs athlete budgets** (OPEN - flag to the volume engine owner): COACH-R2 VOL-04/06: 'I don't think anybody needs less than 10 sets a week per muscle.' The 04 athlete budgets reused here give field athletes far fewer direct upper-body sets (e.g. soccer chest about 2-4). Proposed reading: the floor applies to muscles the athlete's plan trains for size / strength in the off-season; pre-season (about 60 %) and in-season blocks are maintenance phases and may sit below 10. Needs the coach's yes.
- **O2 - 2-4 exercises per muscle on full-body days vs the 12 + 2 cap** (OPEN): COACH-R2 SES-05 (2-4 exercises per muscle on full-body days, never 1) and COACH-R2 SES-04 (field athletes up to 12 exercises + 2 core) collide on athletic full-body days that already hold 4-6 athletic exercises. Proposed: 2-4 exercises for each muscle TRAINED that day (knee + pull day / hip + push day pairing), not for every muscle; athletic exercises do not count toward the cap's resistance part.
- **O3 - Sports not on the coach's approved lists** (OPEN - needs coach confirmation): COACH-R2 ATH-01 (plyo share by class) and ATH-06 (aerobic sessions) named basketball, volleyball, soccer, football, baseball, softball and hockey. Lacrosse, field hockey, rugby, cheer / STUNT, ultimate, flag and beach volleyball use INFERRED classes and PROPOSED aerobic counts. COACH-R2 ATH-07 (game-heavy in-season reductions) is extended to lacrosse, field hockey, rugby, ultimate, flag, beach and cheer by analogy.
- **O4 - In-season sprints for non-speed athletes** (PROPOSED resolution): COACH-R2 ATH-07 says in-season sprints only for speed athletes; the 04 HAMSTRING rule keeps one max-velocity exposure a week in every phase. Resolved here as: games supply it; athletes with few game minutes keep one exposure (INFERRED). Basketball guards are no longer given in-season sprints (04 v1 INFERRED content superseded).
- **O5 - Baseball / softball in season** (OPEN (carried from 04 v1)): Not on the ATH-07 game-heavy list. The coach's OBSERVED Block 3 kept 4 days at 4 x 10 with no Olympic lifts; PER-08 says about 2 lifting days, and COACH-R2 ATH-04 approves a light Olympic piece in season. Profiles use 2 days + the light piece; the 4-day observed version stays evidence.
- **O6 - Recreational league game days** (PROPOSED): GEN-02 gives recreational players no season. Many rec players have a fixed weekly game. Proposed: an optional 'league game day' input that keeps the hardest lower-body day >= 48 h away and swaps one aerobic session for the game.
- **O7 - Beach volleyball class** (OPEN): Indoor volleyball is class 2 (60 %, COACH-R2 ATH-01). Sand slows the take-off (T20), so beach is set to class 3 (50 %) - PROPOSED.
- **O8 - Neck work for more sports** (OPEN - library gap): Neck isometrics added for lacrosse, field hockey, rugby, cheer, flag and soccer defenders on the concussion / neck-strength evidence (T38). The library still has no neck column (04 library gap).
- **O9 - Spanish names** (PENDING approval): All name_es values are drafts in neutral Latin American Spanish with English terms in brackets; the coach (or a coach he trusts) approves every line (COACH-R2 GEN-08). 'Cheerleading (porrismo)' and the field-hockey / lacrosse terms especially need a check.

Changes against 04 v1 (by authority order): in-season factors now follow COACH-R2 ATH-07 (e.g. basketball COD 0.3 -> no extra COD, plyos 0.35 -> 0.5); pre-season follows COACH-R2 PER-06 (about 60 % of sets; the 04 'final week = DELOAD' is replaced by the approved 1-2-week taper at the END of pre-season); aerobic off-season counts follow COACH-R2 ATH-06. Weekly set budgets of covered sports are unchanged.

## 9. Sources

S-numbers are the existing 04 references (reused); T-numbers are new for this file.

- **S1** - Basketball time-motion (reused from 04). <https://bjsm.bmj.com/content/41/2/69>
- **S2** - Basketball jumps backcourt ~41 vs frontcourt ~79 per game (reused from 04). <https://ojs.ub.uni-konstanz.de/cpa/article/view/6622/5981>
- **S3** - Volleyball jumps per match by position (reused from 04). <https://reference-global.com/article/10.1515/tperj-2017-0032>
- **S5** - Soccer ~726 turns per match, most 0-90 degrees (reused from 04). <https://jssm.org/06-1-63.p_d_f>
- **S11** - Ice hockey shifts 30-80 s, 4-5 min recovery (reused from 04). <https://pmc.ncbi.nlm.nih.gov/articles/PMC6224850>
- **S13** - American football plays ~5.3-5.7 s, ~33 s rest (reused from 04). <https://www.ncbi.nlm.nih.gov/pmc/articles/PMC11701232/>
- **S14** - Nordic hamstring programmes cut hamstring injuries up to 51% (reused from 04). <https://bjsm.bmj.com/content/53/21/1362>
- **S15** - Copenhagen adduction programme -41% groin problems (reused from 04). <https://bjsm.bmj.com/content/53/3/150.abstract>
- **S20** - Neuromuscular training ~halves non-contact ACL risk (reused from 04; applied by landing competency, never by sex - ATH-09). <https://www.aafp.org/pubs/afp/issues/2011/0115/p210.pdf>
- **S21** - Jumper's knee prevalence volleyball 44.6%, basketball 31.9% (reused from 04). <https://pubmed.ncbi.nlm.nih.gov/15722279/>
- **S25** - Baseball pitcher shoulder / elbow injury load (reused from 04). <https://pmc.ncbi.nlm.nih.gov/articles/PMC11545345>
- **S29** - Softball windmill pitching loads comparable to baseball (reused from 04). <https://pmc.ncbi.nlm.nih.gov/articles/PMC6704423>
- **S32** - Fast SSC < ~250 ms vs slow SSC > ~250 ms; contact time guides plyometric prescription (Flanagan & Comyns 2008; reused from 04). <https://pure.ul.ie/en/publications/the-use-of-contact-time-and-the-reactive-strength-index-to-optimi>
- **S33** - Sprint acceleration contacts ~0.14-0.16 s (reused from 04). <https://www.jssm.org/jssm-02-144.xml%3EFulltext>
- **T1** - NCAA D-I football GPS: WR and DB cover the most distance, high-intensity running, sprints and max accelerations/decelerations; linemen the least (Wellman et al. 2016). <https://research.bond.edu.au/en/publications/quantification-of-competitive-game-demands-of-ncaa-division-i-col/>
- **T2** - Lacrosse GPS by position (Japan national team): midfielders highest average speed and sprint distance. <https://www.jssm.org/jssm-18-290.xml-abst>
- **T3** - NCAA lacrosse match loads: women 7,698 m total / 398 m sprint vs men 6,914 m / 210 m; men higher top speed (7.78 vs 6.93 m/s) and more accelerations (70 vs 57); men's midfielders highest intensity (Fields et al. 2023, J Funct Morphol Kinesiol). <https://pmc.ncbi.nlm.nih.gov/articles/PMC10443359/>
- **T4** - Lacrosse physiological analysis (NSCA / Human Kinetics): all three energy systems; defenders strongest (NCAA D-I 1RM data); attack and midfield most agile; FOGO and goalie need close-range reactive agility. <https://us.humankinetics.com/blogs/excerpt/general-physiological-analysis-for-lacrosse>
- **T5** - NCAA women's lacrosse injuries 2014-19: 4.99 / 1000 AE; ankle sprains 9.1%, concussions 7.2%, hamstring 3.8%. <https://www.sponet.de/sponet/Record/4071926?lng=en>
- **T6** - NCAA men's lacrosse game injuries: ankle sprains 11.3%, knee internal derangement 9.1%, concussion 8.6% (Dick et al. 2007). <https://pmc.ncbi.nlm.nih.gov/articles/PMC1941301>
- **T7** - Field hockey: 30-50 degrees of trunk flexion for most of play; 3-5x the low-back-pain risk of other sports; LBP prevalence about 33-60%. <https://www.sportsinjurybulletin.com/improve/lower-back-pain-in-field-hockey>
- **T8** - Field hockey peak running intensity by position: forwards 194, midfielders 189, defenders 183 m/min; forwards fastest. <https://johk.pl/?p=6048>
- **T9** - NCAA women's field hockey injuries 2014-19: 6.27 / 1000 AE; head/face 16%, thigh 12.3%; concussion 8.6%, ankle sprain 6.7%. <https://pmc.ncbi.nlm.nih.gov/articles/PMC8293883>
- **T10** - Rugby union: forwards do more collisions, backs more high-speed running (worst-case scenario analysis). <https://www.ncbi.nlm.nih.gov/pmc/articles/PMC5433699/>
- **T11** - Professional rugby union match injury incidence about 87 / 1000 h; tackle involved in about half of injuries; concussion the most common diagnosis (16-season review). <https://blogs.bmj.com/bjsm/2020/12/05/the-low-down-on-trends-in-match-injury-risk-in-professional-male-rugby-union-a-16-season-review/>
- **T12** - Rugby sevens: high-intensity intermittent running + contact, about 6 matches over 2-3 days per tournament. <https://lida.sport-iat.de/ta/Record/4048163>
- **T13** - US cheerleading: stunts cause about 60% of injuries and 96% of concussions / closed head injuries; bases and spotters most often injured; ankle, low back and wrist re-injured most. <https://www.bisp-surf.de/Record/PU201010007430>
- **T14** - Cheer pop-off dismount landings: 2.1-14.9 body weights (flyers about 6 BW). <https://www.ncbi.nlm.nih.gov/pmc/articles/PMC11347287/>
- **T15** - Tumbling take-off contact about 120-130 ms (double back somersault, World Championships); back handspring take-off about 0.13-0.18 s. <https://ojs.ub.uni-konstanz.de/cpa/article/view/2934>
- **T16** - STUNT (head-to-head competitive cheer): spring season (first contest Feb 1), NCAA championship sport from spring 2027. <https://stuntthesport.org/championship-status-media-guide>
- **T17** - Competitive ultimate (GPS): 4.7 km per game, 0.63 km high-intensity, 0.21 km sprinting, 17 sprints, mean HR 82% / peak 99% HRmax (Krustrup & Mohr 2015). <https://test01.ku.dk/:obvius/pureproxy/3974268/en/publications/physical-demands-in-competitive-ultimate-frisbee>
- **T18** - Ultimate injuries: muscle strains 76%, ankle 65%, knee 53%, shoulder 37%, head 30% of players; 49% recurrent (Reynolds & Halsmer 2006). <https://pubmed.ncbi.nlm.nih.gov/17042420/>
- **T19** - Beach volleyball: 52-85 jumps per player per match, rallies about 8.5 s, blockers jump most (systematic review). <https://lida.sport-iat.de/ta/Record/4090916>
- **T20** - Jumping on sand vs a rigid surface: lower jump height and longer time to reach peak take-off velocity. <https://www.ncbi.nlm.nih.gov/pmc/articles/PMC10443322/>
- **T21** - Beach vs indoor volleyball: similar external load, more small (<20 cm) jumps and higher heart-rate load on sand. <https://www.ncbi.nlm.nih.gov/pmc/articles/PMC12522762/>
- **T22** - Pro ice hockey: defensemen more time on ice (16:35 vs 14:39) and more decelerations; forwards more high-intensity work per minute. <https://www.ncbi.nlm.nih.gov/pmc/articles/PMC9679183/>
- **T23** - Butterfly goalies: high prevalence of symptomatic FAI (cam deformity) vs skaters. <https://vivo.weill.cornell.edu/display/pubid25498869>
- **T24** - Ice hockey skating: blade contact per stride shortens with speed but stays long (about 0.6 s at fast speed, ISBS proceedings). <https://ojs.ub.uni-konstanz.de/cpa/article/view/3781/3501>
- **T25** - Soccer positions: central midfielders the most total distance, wide midfielders and full-backs the most high-speed running, centre-backs the least (but many accelerations). <https://www.ncbi.nlm.nih.gov/pmc/articles/PMC6843975/>
- **T26** - Soccer goalkeepers: about 50% of outfield total distance and 10% of high-intensity distance; dives and explosive efforts rise late in matches. <https://pure.solent.ac.uk/en/publications/understanding-workload-dynamics-in-football-goalkeepers-insights-/>
- **T27** - Change of direction: ground contact time rises with cut angle (45 < 90 < 180 degrees); 45-degree cuts about 0.16-0.24 s. <https://link.springer.com/article/10.1007/s40279-021-01448-3>
- **T28** - Basketball positions: guards more distance, accelerations and decelerations; forwards more high-speed running; centres more jumps and rebounds (scoping review). <https://www.ncbi.nlm.nih.gov/pmc/articles/PMC12121883/>
- **T29** - NCAA football injuries 2014-19: 9.31 / 1000 AE; concussion 7.5%, ankle sprain 6.9%, hamstring 4.7%; blocking and tackling common mechanisms. <https://pmc.ncbi.nlm.nih.gov/articles/PMC8293875>
- **T30** - NFL quarterbacks: shoulder 15.2% of injuries (AC sprains about 40% of them); overuse = rotator cuff / biceps tendinitis. <https://www.springermedicine.com/common-injuries-in-professional-football-quarterbacks/22068126>
- **T31** - Baseball catcher squat biomechanics (relaxed / ready stance, throw to second): repeated deep knee flexion. <https://budc.barry.edu/AA00001243/00001/citation>
- **T32** - NFHS: football, basketball, girls volleyball, cross country, outdoor track in the same season in all 51 associations; boys soccer fall 32 / spring 14 / winter 5 states, girls 26 / 20 / 5; field hockey fall (16 states); lacrosse spring (23 states); baseball spring in 47 of 48 states. <https://nfhs.org/stories/some-high-school-sports-are-played-in-all-three-seasons>
- **T33** - NFHS 2024-25 participation: boys top 10 = 11-player football, outdoor track, basketball, soccer, baseball, wrestling, cross country, golf, tennis, swimming; girls top 10 = outdoor track, volleyball, soccer, basketball, softball, competitive spirit (cheer, 206,262), tennis, cross country, swimming, lacrosse; girls flag football 68,847 (+60%), sanctioned in 16 states. <https://www.si.com/high-school/national/high-school-sports-participation-hits-all-time-high-in-2024-25-fueled-by-growth-in-girls-programs-01k2z4rs5sgj>
- **T34** - CIF girls flag football ACL tears: 21 of 24 non-contact (pivot / cut / sudden stop), game risk 0.17 -> 0.64 per 1000 AE (2023 -> 2024). <https://doi.org/10.1177/2325967126S00167>
- **T35** - Flag football is predominantly anaerobic: accelerations, decelerations, max sprints, jumps, COD (physical qualities of national-league female flag players). <https://repository.mmu.ac.uk/articles/journal_contribution/The_physical_qualities_of_national_league_female_British_American_flag_football_players/32549703>
- **T36** - NCAA countable hours: in season max 20 h/week, 4 h/day, 1 day off; out of season 8 h/week. <https://www.compliance.lsu.edu/countable-athletically-related-activities>
- **T37** - One strength session per week in season kept the strength, sprint and jump gains of pre-season in pro soccer players; one every second week did not (Ronnestad et al. 2011). <https://www.ncbi.nlm.nih.gov/pubmed/21873897>
- **T38** - High-school athletes: each 1 lb more neck strength = 5% lower odds of concussion (Collins et al. 2014). <https://www.springermedicine.com/neck-strength-a-protective-factor-reducing-risk-for-concussion-i/21683656>
- **T39** - NCAA football: 15 spring practices; NFL offseason program Phase I-III (Apr-Jun) then training camp late July. <https://www.nationalfootballpost.com/nfl-rolls-out-offseason-program-with-usual-on-field-otas>
- **T40** - 2026 MLS regular season Feb 21 - Nov 7 (Cup final Dec); NWSL Mar 13 - Nov 1; NCAA soccer Aug - early Dec (College Cups Dec 10-14). <https://en.wikipedia.org/wiki/2026_Major_League_Soccer_season>
- **T41** - NHL 2025-26: Oct 7 - Apr 16, playoffs through June; NCAA D-I men's hockey Oct - April (Frozen Four). <https://www.wflx.com/2025/07/16/nhl-releases-2025-26-schedule-last-82-game-season-before-new-cba-increases-it-84/>
- **T42** - NBA 2025-26: Oct 21 - Apr 12, playoffs from Apr 19, Finals June; NCAA men's basketball Nov - early April (March Madness). <https://www.nba.com/news/key-dates>
- **T43** - 2026 NCAA D-I baseball Feb 13 - Jun 22; softball Feb 5 - Jun 4; MLB spring training Feb 20 - Mar 24, season Mar 25 - Sep 27. <https://en.wikipedia.org/wiki/2026_NCAA_Division_I_baseball_season>
- **T44** - NCAA beach volleyball championship early May (Gulf Shores); men's college volleyball runs January into May. <https://en.wikipedia.org/wiki/2026_NCAA_Beach_Volleyball_Championship>
- **T45** - Lacrosse calendars: NCAA early Feb - Memorial Day weekend; PLL 2026 May 8 - Sep 20; NLL (box) late Nov - May. <https://en.wikipedia.org/wiki/2026_Premier_Lacrosse_League_season>
- **T46** - US rugby calendars: college fall 15s and spring 7s (National Collegiate Rugby); most high-school leagues in spring; MLR spring-summer. <https://en.wikipedia.org/wiki/National_Collegiate_Rugby>
- **T47** - Cheer calendar: HS tryouts Mar-May, summer camp Jun-Jul, sideline Aug-Nov, competition Dec-Feb; all-star season summer to spring. <https://www.cheerleading.com/when-is-cheer-season.html>
- **T48** - USA Ultimate: college season winter-spring; club regular season in summer, championship series in fall; AUDL about one game per week. <https://en.wikipedia.org/wiki/USA_Ultimate>
- **T49** - Lacrosse ACL: male college lacrosse ACL rate about twice basketball; female lacrosse similar to male lacrosse. <https://www.sportsmed.org/membership/sports-medicine-update/spring-2024/common-lacrosse-injuries>
- **T50** - MLB 2026 spring training and season dates. <https://www.mlb.com/news/press-release-mlb-announces-2026-spring-training-schedule>
- **T51** - NWSL 2026 key dates. <https://www.nbcphiladelphia.com/news/sports/soccer/nwsl-key-dates-2026-season/4367093/>
- **T52** - NLL 2026 season dates. <https://en.wikipedia.org/wiki/2026_NLL_season>
- **T53** - Major League Rugby season (spring - summer). <https://en.wikipedia.org/wiki/Major_League_Rugby>
- **T54** - 2026 NCAA D-I softball season dates. <https://en.wikipedia.org/wiki/2026_NCAA_Division_I_softball_season>
- **T55** - NCAA D-I men's hockey 2024-25 season (Oct 4 - Apr 12). <https://en.wikipedia.org/wiki/2024%E2%80%9325_NCAA_Division_I_men%27s_ice_hockey_season>
