# Sports: all 52 sports, their positions and their dials

This page is the lookup table for competitive athletes. The sport picker has **52 sports**. Each sport, and often each position, points to a **profile**: a record that sets the dials of the plan. The main dials are the plyometric share of jump work, the share of two-leg vs one-leg lifting, the number of aerobic sessions, the number of Olympic-lift days, whether the in-season "game-heavy" rule applies, and the injury hotspots to protect. The table below lists all of them in one place and says, number by number, what the coach confirmed and what is still PROPOSED.

> **How to read this page.** Ids with no prefix (`ATH-01`, `UNI-02`) are the coach's round-1 answers (`coach_answers_full.md`). `R2-` is round 2 (`coach_answers_round2.md`). `R3-` is round 3 (`coach_answers_round3.md`). A later round wins. **PROPOSED** means the team placed it and he has not confirmed it. The rules behind the dials are explained on [athletes.md](athletes.md). His answers: [../03-coach-answers/athletes-and-sports.md](../03-coach-answers/athletes-and-sports.md). **Since model v1.3** there are newer answers too: round 4 (`R4-`, `coach_answers_round4.md`) and two clarifications of 2026-10-10 (`CT-01` on session time, `CX-01..04` on progression and editing). They win on their subjects.

Related pages: [athletes.md](athletes.md), [stay-athletic-and-active.md](stay-athletic-and-active.md) (the 26 activities for people who play for fun), [special-populations.md](special-populations.md), [swimming.md](swimming.md), [bilateral-unilateral.md](bilateral-unilateral.md). Terms: [../05-reference/glossary.md](../05-reference/glossary.md). Field by field: [../05-reference/data-dictionary.md](../05-reference/data-dictionary.md).

This is general fitness information, not medical advice. Read [DISCLAIMER.md](../../DISCLAIMER.md) before you use it with anyone.

---

## 1. The rule

**Rule.** Every popular sport in the United States is in the picker, swimming included. A competitive athlete picks the sport, then the position if it changes the training. The position picks the profile. With no position, the sport's default profile is used.

**Rule.** High school, college and professional athletes get the same plan. Weights and speeds change with the athlete. He said this about his baseball program (PRG-09). Applying it to every sport is the model's reading.

**Rule.** A sport that has no profile of its own yet is **routed** to the nearest profile. Its numbers are PROPOSED until someone writes that profile.

**Why.** He asked for the list in conversation:

> "For the athletes, all of the different popular sports in the United States" (chat)

> "include swimming as well." (chat)

On positions, he said to "open up the options for sports and positions if they are trying to train for athleticism in sports" (GEN-02). On levels of play:

> "High school is the same as college, the same as pro, essentially." (PRG-09)

**Where it lives.**

| What | File and key |
|---|---|
| The 52 sports with positions (English and Spanish) | `synthesis/04_profiles.json > sports.list[]` (`id`, `group`, `positions[]`, `default_profile`, `kind`) |
| The 127 profiles | `synthesis/04_profiles.json > profiles[]` |
| The picker as the tool shows it | `generator_spec_v1.json > inputs_schema.fields.F11` and `F12`; `generator_spec_v1.json > vocab.sports` |
| How a profile is chosen | `generator_spec_v1.json > derived_values.D2_profile` |
| Compiled copy the engine reads | `model/profiles.json > picker.sports[]` and `sports.<profile_id>` |
| Text version with a card per profile | `synthesis/04_athlete_profiles.md` sections 2 and 8 |

---

## 2. The dials

| Dial | What it means | Rule behind it | Key in each profile (`synthesis/04_profiles.json > profiles[]`) |
|---|---|---|---|
| **Plyo share** | The share of jump and throw work that is plyometric (short, bouncy contacts) at the end of a training block. The rest is ballistic (one big push). Each block starts 15 points lower. | Ground-contact time (ATH-01); shares approved by sport (R2-ATH-01, R3-ATH-04) | `ground_contact.plyo_share_pct`, `ground_contact.plyo_share_start_pct` |
| **Bilateral : unilateral** | The share of lower-body compound sets done on two legs vs one leg. Written two-leg/one-leg: 20/80 means 20 % on two legs. Shown at the start of a block, at the end, and in season. | His scale runs from 90/10 to 10/90 (UNI-02); in season bilateral stays minimal (UNI-10) | `bilateral_unilateral.block_start`, `.block_end`, `.in_season` |
| **Aerobic sessions** | Cardio sessions a week in the gym plan: off-season / pre-season / in season. The person can ask for more or less. | Off-season by sport (R2-ATH-06, R3-ATH-04); pre-season 2 (R2-ATH-06); in season 2 (ATH-07) | `aerobic_sessions_wk.off_season_or_default`, `.pre_season`, `.in_season` |
| **Olympic days** | Days a week with an Olympic lift in the off-season. | Everyone in athletic training gets them (ATH-10), up to 4 a week (R2-ATH-04) | `olympic_policy.off_season_exposures_wk` |
| **Game-heavy rule** | In season: gym plyos at about half, no extra change-of-direction work, sprints only for speed athletes, the hard gym day at least 48 hours before a game. | R2-ATH-07, R3-ATH-04 | `in_season_gym.game_heavy` |
| **Hotspots** | Body areas this sport tends to hurt. The plan adds care work for them and picks safer versions. | Research and his own programs. See [special-populations.md](special-populations.md). | `injuries` (codes explained in `injury_library`) |

**What the letters in the table mean.**

| Letter | Meaning |
|---|---|
| **C** | Confirmed. He named this sport or this number in the answer shown in the last column. |
| **R** | He gave the rule or the range. The team placed the sport inside it. The exact number is PROPOSED. |
| **P** | PROPOSED. The team placed it from the sport's demands or from research. He has not confirmed it. |
| **O** | OBSERVED. Read from the programs in his own sheets. He was not asked about it. |

Some parts of the table carry no letter, because one status covers every row:

- **Olympic days**: **R** for every sport. He set the rule (everyone, up to 4 a week). The count per sport is PROPOSED. The one exception is swimming, where he approved 2-3 days (R3-ATH-01).
- **Pre-season and in-season aerobic sessions**: **C** for every sport with a season (2 and 2), unless the cell says otherwise. The letter in the aerobic column is about the off-season number.
- **Hotspots**: all PROPOSED. They come from research and from what his programs already protect. He was not asked sport by sport.

---

## 3. The table: 52 sports

Read a cell like this: `60 % · C: Defender, Midfielder` means 60 %, confirmed, for those positions. A cell with no position names applies to the whole sport. In the profile column, a **variant** is a small change on top of a profile (a few sets moved, an extra hotspot). It does not change the dials shown here.

| # | Sport and picker id | Positions or choices → profile | Plyo share at block end | Bilateral : unilateral (start → end; in season) | Aerobic sessions (off / pre / in) | Olympic days (off-season) | Game-heavy rule in season | Hotspots | His answers behind the row |
|---|---|---|---|---|---|---|---|---|---|
| | **Team field and court** | | | | | | | | |
| 1 | **American football**<br>`american_football` | Quarterback → `football_qb`<br>Running back → `football_rb`<br>Fullback, Tight end, Linebacker → `football_big_skill`<br>Wide receiver, Cornerback, Safety → `football_skill`<br>Offensive line → `football_ol`<br>Lineman → `football_lineman`<br>Defensive line → `football_dl`<br>Kicker / punter / long snapper → `football_k_p`<br>no choice → `football_big_skill` | 40 % · P: Quarterback, Kicker / punter / long snapper<br>60 % · C: Running back, Wide receiver, Cornerback, Safety<br>50 % · C: Fullback, Tight end, Linebacker<br>40 % · C: Offensive line, Lineman, Defensive line | 20/80 → 10/90; in season 10/90 · R: Quarterback, Running back, Wide receiver, Cornerback, Safety, Kicker / punter / long snapper<br>30/70 → 20/80; in season 10/90 · P: Fullback, Tight end, Linebacker<br>50/50 → 40/60; in season 30/70 · P: Offensive line, Lineman, Defensive line | 3 / 2 / 2 · C | 4 | yes · C | neck, shoulder (contact), knee (landing and cutting), hamstring, groin, ankle | R2-ATH-01, R2-ATH-06, R2-ATH-07, UNI-02, UNI-10 |
| 2 | **Flag football**<br>`flag_football` | Quarterback (variant `flag_football_qb`), Any other position → `flag_football` | 60 % · C | 20/80 → 10/90; in season 10/90 · R | 3 / 2 / 2 · R | 4 | yes · C | knee (landing and cutting), ankle, hamstring, shoulder (contact), neck | R3-ATH-04, UNI-02, UNI-10 |
| 3 | **Basketball**<br>`basketball` | Guard → `basketball_guard`<br>Wing → `basketball`<br>Big → `basketball_big`<br>no choice → `basketball` | 50 % · C | 20/80 → 10/90; in season 10/90 · R: Guard, Wing<br>30/70 → 20/80; in season 10/90 · P: Big | 3 / 2 / 2 · C | 4 | yes · C | patellar tendon, ankle, knee (landing and cutting), hamstring, Achilles and calf | R2-ATH-01, R2-ATH-06, R2-ATH-07, UNI-02, UNI-10 |
| 4 | **Baseball**<br>`baseball` | Pitcher → `baseball_pitcher`<br>Catcher → `baseball_catcher`<br>Infield → `baseball_infield`<br>Outfield → `baseball_outfield`<br>no choice → `baseball_position` | 40 % · C | 50/50 → 40/60; in season 20/80 · P | 2 / 2 / 2 · C | 4 | no | throwing shoulder, throwing elbow, low back (rotation), lead hip, hamstring, groin | R2-ATH-01, R2-ATH-06 |
| 5 | **Softball**<br>`softball` | Pitcher → `softball_pitcher`<br>Catcher (variant `softball_catcher`), Infield, Outfield → `softball`<br>no choice → `softball` | 40 % · C | 50/50 → 40/60; in season 20/80 · P | 2 / 2 / 2 · C | 2 | no | throwing shoulder, throwing elbow, knee (landing and cutting), low back (rotation), lead hip | R2-ATH-01, R2-ATH-06 |
| 6 | **Soccer**<br>`soccer` | Goalkeeper → `soccer_gk`<br>Defender → `soccer_defender`<br>Midfielder → `soccer`<br>Forward → `soccer_forward`<br>no choice → `soccer` | 50 % · C (note 1): Goalkeeper<br>60 % · C: Defender, Midfielder, Forward | 20/80 → 10/90; in season 10/90 · R | 3-4 / 2 / 2 · C | 2 | yes · C | groin, ankle, hamstring, knee (landing and cutting), hip flexor, throwing shoulder | R2-ATH-01, R2-ATH-06, R2-ATH-07, R3-ATH-04, UNI-02, UNI-10 |
| 7 | **Ice hockey**<br>`ice_hockey` | Forward → `hockey`<br>Defense → `hockey_defense`<br>Goalie → `hockey_goalie`<br>no choice → `hockey` | 40 % · C: Forward, Defense<br>40 % · C (note 1): Goalie | 20/80 → 10/90; in season 10/90 · P | 3-4 / 2 / 2 · C | 4 | yes · C | groin, hip (deep flexion), low back (rotation), neck, knee (deep flexion) | R2-ATH-01, R2-ATH-06, R2-ATH-07 |
| 8 | **Volleyball (indoor)**<br>`volleyball` | Outside / opposite hitter → `volleyball`<br>Middle blocker → `volleyball_middle`<br>Setter → `volleyball_setter`<br>Libero / defensive specialist → `volleyball_libero`<br>no choice → `volleyball` | 60 % · C | 40/60 → 30/70; in season 20/80 · P | 3 / 2 / 2 · C | 4 | yes · C | patellar tendon, ankle, throwing shoulder, knee (landing and cutting), low back (rotation) | R2-ATH-01, R2-ATH-06, R2-ATH-07 |
| 9 | **Beach volleyball**<br>`beach_volleyball` | Blocker (variant `volleyball_beach_blocker`), Defender (variant `volleyball_beach_defender`) → `volleyball_beach` | 50 % · C | 30/70 → 20/80; in season 10/90 · P | 3 / 2 / 2 · R | 4 | yes · C | patellar tendon, throwing shoulder, low back (rotation), ankle, Achilles and calf | R3-ATH-04 |
| 10 | **Lacrosse (men's and women's)**<br>`lacrosse` | Attack → `lacrosse_m_attack` / `lacrosse_w_attack`<br>Midfield → `lacrosse_m_midfield` / `lacrosse_w_midfield`<br>Defense → `lacrosse_m_defense` / `lacrosse_w_defense`<br>Goalie → `lacrosse_m_goalie` / `lacrosse_w_goalie`<br>no choice → `lacrosse_m_midfield` | 60 % · C: Attack, Midfield, Defense<br>50 % · C (note 1): Goalie | 20/80 → 10/90; in season 10/90 · R: Attack, Midfield<br>men's 30/70 → 20/80; in season 10/90 · P; women's 20/80 → 10/90; in season 10/90 · R: Defense<br>30/70 → 20/80; in season 10/90 · P: Goalie | 3-4 / 2 / 2 · R | 4 | yes · C | groin, neck, ankle, knee (landing and cutting), hamstring, shoulder (contact) | R3-ATH-04, UNI-02, UNI-10 |
| 11 | **Field hockey**<br>`field_hockey` | Forward (variant `field_hockey_forward`), Midfielder (variant `field_hockey_midfielder`), Defender (variant `field_hockey_defender`) → `field_hockey_field`<br>Goalkeeper → `field_hockey_gk`<br>no choice → `field_hockey_field` | 60 % · C: Forward, Midfielder, Defender<br>50 % · C (note 1): Goalkeeper | 20/80 → 10/90; in season 10/90 · R: Forward, Midfielder, Defender<br>30/70 → 20/80; in season 10/90 · P: Goalkeeper | 3 / 2 / 2 · R | 3 | yes · C | low back (flexed posture), groin, ankle, hamstring, knee (landing and cutting), neck | R3-ATH-04, UNI-02, UNI-10 |
| 12 | **Rugby**<br>`rugby` | Forwards → `rugby_forwards`<br>Backs → `rugby_backs`<br>Sevens → `rugby_sevens`<br>no choice → `rugby_backs` | 40 % · C: Forwards<br>50 % · C: Backs<br>60 % · C: Sevens | 50/50 → 40/60; in season 30/70 · P: Forwards<br>30/70 → 20/80; in season 10/90 · P: Backs<br>20/80 → 10/90; in season 10/90 · R: Sevens | 3-4 / 2 / 2 · R | 4 | yes · C | neck, shoulder (contact), hamstring, knee (landing and cutting), ankle, groin | R3-ATH-04, UNI-02, UNI-10 |
| 13 | **Cheerleading / STUNT**<br>`cheerleading` | Base, Back spot → `cheer_base_spot`<br>Flyer, Tumbler / all-around → `cheer_flyer_tumbler`<br>no choice → `cheer_flyer_tumbler` | 40 % · C: Base, Back spot<br>60 % · C: Flyer, Tumbler / all-around | 50/50 → 40/60; in season 30/70 · P: Base, Back spot<br>30/70 → 20/80; in season 10/90 · P: Flyer, Tumbler / all-around | 2 / 2 / 2 · R | 4: Base, Back spot<br>3: Flyer, Tumbler / all-around | yes · P | low back (heavy loading), wrist and hand, ankle, neck, overhead catching, shoulder (contact) | R3-ATH-04 |
| 14 | **Ultimate**<br>`ultimate` | Handler → `ultimate_handler`<br>Cutter / deep → `ultimate_cutter`<br>no choice → `ultimate_cutter` | 50 % · P: Handler<br>60 % · C: Cutter / deep | 20/80 → 10/90; in season 10/90 · R | 3-4 / 2 / 2 · R | 3 | yes · C | ankle, knee (landing and cutting), hamstring, throwing shoulder, low back (rotation), groin | R3-ATH-04, UNI-02, UNI-10 |
| 15 | **Competitive dance / drill team**<br>`dance_team` | routed to `cheer_flyer_tumbler` (nearest profile) | 60 % · P | 30/70 → 20/80; in season 10/90 · P | 2 / 2 / 2 · P | 3 | yes · P | tumbling landings, ankle, wrist and hand, knee (landing and cutting), low back (heavy loading), neck | - |
| | **Aquatic, endurance and track** | | | | | | | | |
| 16 | **Swimming**<br>`swimming` | Sprint → `swimming_sprint`<br>Middle distance → `swimming_middle`<br>Distance → `swimming_distance`<br>no choice → `swimming_middle` | 25 % · C | 50/50 → 60/40; in season 50/50 · P: Sprint<br>50/50 → 55/45; in season 45/55 · P: Middle distance<br>40/60 → 40/60; in season 30/70 · P: Distance | 0 / 0 / 0 · C | 3: Sprint, Middle distance<br>2: Distance<br>· C (2-3 days) | no | swimmer's shoulder, low back (extension), inner knee (kick), bone loading | R3-ATH-01, R3-ATH-04 |
| 17 | **Diving**<br>`diving` | Springboard, Platform (variant `diving_platform`) → `diving` | 40 % · C | 50/50 → 60/40; in season 40/60 · P | 2 / 2 / 2 · R | 3 | no | swimmer's shoulder, low back (extension), wrist and hand, patellar tendon, bone loading | R3-ATH-04 |
| 18 | **Water polo**<br>`water_polo` | Field player → `water_polo_field`<br>Center / center defender → `water_polo_center`<br>Goalkeeper → `water_polo_goalkeeper`<br>no choice → `water_polo_field` | 25 % · C | 40/60 → 40/60; in season 30/70 · P: Field player<br>55/45 → 60/40; in season 40/60 · P: Center / center defender<br>40/60 → 35/65; in season 30/70 · P: Goalkeeper | 0 / 0 / 0 · P | 3 | no | swimmer's shoulder, throwing shoulder, inner knee (kick), groin, low back (rotation), bone loading | R3-ATH-04 |
| 19 | **Track and field**<br>`track_and_field` | Sprints → `track_sprinter`<br>400 m → `track_400`<br>Hurdles, 400 m hurdles (variant `track_400h`) → `track_hurdles`<br>Long / triple jump → `track_jumper`<br>High jump → `track_high_jump`<br>Pole vault → `track_pole_vault`<br>Shot put / discus / hammer → `track_thrower`<br>Javelin → `track_javelin`<br>800-1500 m / mile → `track_middle`<br>5000-10,000 m → `distance_runner`<br>no choice → `track_sprinter` | 75 % · C: Sprints, 400 m, Hurdles, 400 m hurdles, 800-1500 m / mile, 5000-10,000 m<br>75 % · P: Long / triple jump<br>60 % · C: High jump, Pole vault<br>40 % · C: Shot put / discus / hammer<br>50 % · C: Javelin | 40/60 → 30/70; in season 20/80 · P: Sprints, 400 m, Hurdles, 400 m hurdles, Long / triple jump, Pole vault<br>35/65 → 25/75; in season 20/80 · P: High jump<br>60/40 → 70/30; in season 25/75 · P: Shot put / discus / hammer<br>50/50 → 50/50; in season 25/75 · P: Javelin<br>25/75 → 20/80; in season 10/90 · P: 800-1500 m / mile<br>20/80 → 20/80; in season 10/90 · P: 5000-10,000 m | 2 / 2 / 2 · C: Sprints<br>2 / 2 / 2 · R: 400 m, Hurdles, jumps, vault, throws, Javelin<br>0 / 0 / 0 · C: 800 m and longer | 4: Sprints, 400 m, Hurdles, jumps, vault, throws<br>3: Javelin<br>2: 800 m and longer | no | hamstring, Achilles and calf, hip flexor, low back (heavy loading), patellar tendon, bone stress | R2-ATH-01, R2-ATH-06, R3-ATH-04 |
| 20 | **Cross country and road running**<br>`distance_running` | Cross country → `cross_country`<br>Road 5K-10K, Half marathon, Marathon, Trail / ultramarathon → `distance_runner`<br>no choice → `distance_runner` | 75 % · C | 20/80 → 20/80; in season 10/90 · P | 0 / 0 / 0 · C | 2 | no | Achilles and calf, bone stress, hamstring, front and outside of the knee, ankle | R3-ATH-04 |
| 21 | **Triathlon**<br>`triathlon` | Sprint / Olympic, 70.3, Full distance → `triathlon` | 75 % · P | 30/70 → 30/70; in season 20/80 · P | 0 / 0 / 0 · P | 2 | no | Achilles and calf, bone stress, front and outside of the knee, swimmer's shoulder, low back (heavy loading) | - |
| 22 | **Cycling**<br>`cycling` | Road, Mountain bike (variant `cycling_mtb`), Gravel, Indoor racing (variant `cycling_indoor`) → `cycling_endurance`<br>Track sprint / keirin, BMX racing (variant `cycling_bmx`) → `cycling_sprint`<br>no choice → `cycling_endurance` | 40 % · C | 50/50 → 50/50; in season 40/60 · P: Road, Mountain bike, Gravel, Indoor racing<br>60/40 → 70/30; in season 30/70 · P: Track sprint / keirin, BMX racing | 0 / 0 / 0 · C: Road, Mountain bike, Gravel, Indoor racing<br>2 / 2 / 2 · R: Track sprint / keirin, BMX racing | 3: Road, Mountain bike, Gravel, Indoor racing<br>4: Track sprint / keirin, BMX racing | no | low back (heavy loading), bone loading, falls on the arm, front and outside of the knee, neck, patellar tendon | R3-ATH-04 |
| 23 | **Rowing (crew)**<br>`rowing` | Sweep (variant `rowing_sweep`), Sculling (variant `rowing_sculling`) → `rowing` | 25 % · C | 55/45 → 65/35; in season 40/60 · P | 0 / 0 / 0 · C | 3 | no | low back (heavy loading), ribs, low back (rotation), front and outside of the knee, wrist and hand | R3-ATH-04 |
| 24 | **Skiing / snowboarding (competitive)**<br>`ski_snowboard` | Alpine racing, Speed (variant `ski_speed`), Snowboard racing / snowboard cross (variant `snowboard_race`) → `ski_alpine`<br>Freestyle ski or snowboard → `ski_freestyle`<br>no choice → `ski_alpine` | 40 % · C: Alpine racing, Speed, Snowboard racing / snowboard cross<br>50 % · P: Freestyle ski or snowboard | 35/65 → 30/70; in season 20/80 · P: Alpine racing, Speed, Snowboard racing / snowboard cross<br>40/60 → 35/65; in season 25/75 · P: Freestyle ski or snowboard | 2-3 / 2 / 2 · R | 4 | no | knee (landing and cutting), low back (heavy loading), hamstring, falls on the arm, patellar tendon, groin | R3-ATH-04 |
| 25 | **Figure skating**<br>`figure_skating` | routed to `gymnastics_artistic` (nearest profile)<br>choices: Singles, Pairs / ice dance | 60 % · P | 40/60 → 30/70; in season 20/80 · P | 2 / 2 / 2 · P | 2 | yes · P | wrist and hand, Achilles and calf, ankle, low back (extension), growth plates, shoulder (hanging and overhead) | - |
| 26 | **Skateboarding (street / park)**<br>`skateboarding` | routed to `ski_freestyle` (nearest profile) | 50 % · P | 40/60 → 35/65; in season 25/75 · P | 2 / 2 / 2 · P | 4 | no | knee (landing and cutting), low back (heavy loading), hamstring, falls on the arm, patellar tendon, low back (extension) | - |
| 27 | **Surfing (competitive)**<br>`surfing` | routed to `ski_freestyle` (nearest profile) | 50 % · P | 40/60 → 35/65; in season 25/75 · P | 2 / 2 / 2 · P | 4 | no | knee (landing and cutting), low back (heavy loading), hamstring, falls on the arm, patellar tendon, low back (extension) | - |
| 28 | **Speed skating (long / short track)**<br>`speed_skating` | routed to `ski_alpine` (nearest profile) | 40 % · P | 35/65 → 30/70; in season 20/80 · P | 3 / 2 / 2 · P | 4 | no | knee (landing and cutting), low back (heavy loading), hamstring, falls on the arm, patellar tendon, groin | - |
| | **Combat sports** | | | | | | | | |
| 29 | **Wrestling (folkstyle / freestyle / Greco-Roman)**<br>`wrestling` | Light, Middle, Heavy (variant `wrestling_heavyweight`) → `wrestling` | 25 % · C | 50/50 → 40/60; in season 30/70 · P | 4 / 2 / 2 · C | 3 | yes · P | neck, low back (heavy loading), knee (landing and cutting), shoulder (contact), knee (grappling), elbow | R2-ATH-01, R2-ATH-06 |
| 30 | **Boxing**<br>`boxing` | Light, Middle, Heavy (variant `boxing_heavyweight`) → `boxing` | 25 % · C | 40/60 → 30/70; in season 20/80 · P | 3 / 2 / 2 · C | 3 | no | punching shoulder, wrist and hand, neck, low back (rotation), groin | R2-ATH-01, R2-ATH-06 |
| 31 | **MMA (mixed martial arts)**<br>`mma` | Light, Middle, Heavy (variant `mma_heavyweight`) → `mma` | 40 % · C | 40/60 → 30/70; in season 20/80 · P | 4 / 2 / 2 · C | 3 | no | neck, punching shoulder, low back (heavy loading), groin, wrist and hand, knee (grappling) | R2-ATH-01, R2-ATH-06 |
| 32 | **Brazilian jiu-jitsu / grappling**<br>`bjj` | Gi, No-gi / submission grappling (variant `bjj_nogi`) → `bjj_grappling` | 25 % · C | 50/50 → 40/60; in season 30/70 · P | 3 / 2 / 2 · C | 1 | no | neck, low back (heavy loading), knee (grappling), elbow, shoulder (contact) | R2-ATH-01, R2-ATH-06 |
| 33 | **Judo**<br>`judo` | Light, Middle, Heavy (variant `judo_heavyweight`) → `judo` | 25 % · C | 50/50 → 40/60; in season 30/70 · P | 4 / 2 / 2 · R | 3 | no | shoulder (contact), knee (grappling), elbow, neck, wrist and hand | R3-ATH-04 |
| 34 | **Karate**<br>`karate` | Kumite, Kata (variant `karate_kata`) → `karate_taekwondo` | 25 % · C | 30/70 → 20/80; in season 20/80 · P | 3 / 2 / 2 · C (his list says 3-4) | 1 | no | hamstring, hip flexor, groin, ankle | R2-ATH-01, R2-ATH-06 |
| 35 | **Taekwondo**<br>`taekwondo` | Sparring, Poomsae (variant `taekwondo_poomsae`) → `taekwondo` | 25 % · C | 30/70 → 20/80; in season 20/80 · P | 3 / 2 / 2 · R | 1 | no | hamstring, hip flexor, groin, ankle, Achilles and calf | R3-ATH-04 |
| 36 | **Kickboxing / Muay Thai**<br>`kickboxing_muay_thai` | Kickboxing, Muay Thai (variant `muay_thai_clinch`) → `kickboxing_muay_thai` | 25 % · C | 30/70 → 20/80; in season 20/80 · P | 4 / 2 / 2 · C (his list says 3-4) | 2 | no | groin, hip flexor, neck, punching shoulder, low back (rotation) | R2-ATH-01, R2-ATH-06 |
| 37 | **Fencing**<br>`fencing` | routed to `tennis` (nearest profile) | 50 % · P | 20/80 → 10/90; in season 10/90 · P | 3 / 2 / 2 · P | 1 | yes · P | racket elbow, throwing shoulder, low back (rotation), Achilles and calf, ankle, groin | - |
| | **Strength and fitness sports** | | | | | | | | |
| 38 | **Powerlifting**<br>`powerlifting` | Raw / classic, Equipped → `powerlifting_strength` | none (no athletic block) | 50/50 → 90/10 · R | 2 easy Orange · C; the data repeats 2 for the other phases (P) | 0 (no athletic block) | no | low back (heavy loading), biceps tendon | R2-ATH-06, UNI-02, UNI-10 |
| 39 | **Olympic weightlifting**<br>`olympic_weightlifting` | one profile: `weightlifting` | 25 % · P | 60/40 → 85/15; in season 90/10 · P | 2 / 2 / 2 · R | the sport itself: its own percentage-based program (R2-GEN-06); this profile is a placeholder | no | patellar tendon, low back (heavy loading), wrist and hand, shoulder (hanging and overhead) | R3-ATH-04 |
| 40 | **Strongman**<br>`strongman` | one profile: `strongman` | 25 % · P | 50/50 → 80/20; in season 85/15 · P | 2 / 2 / 2 · R | 2 | no | low back (heavy loading), biceps tendon, shoulder (hanging and overhead), patellar tendon | R3-ATH-04 |
| 41 | **CrossFit (competitive)**<br>`crossfit` | Individual, Team, Masters / teens → `crossfit_competitor` | none as a block (jumps sit inside the workouts of the day) | 50/50 → 70/30; in season 60/40 · P | 2 / 3 / 2 · O off-season; P pre- and in-season | up to 4 in his power months · O | no | shoulder (hanging and overhead), low back (heavy loading), wrist and hand | - |
| 42 | **HYROX (competitive)**<br>`hyrox` | Open, Pro (variant `hyrox_pro`), Doubles / relay (variant `hyrox_doubles`) → `hyrox_competitive` | 50 % · C | 40/60 → 30/70; in season 30/70 · P | 4 / 4 / 3 · C off-season; P pre- and in-season | 2 | no | Achilles and calf, patellar tendon, low back (heavy loading), hamstring | R3-ATH-03, R3-ATH-04 |
| 43 | **Obstacle course racing (Spartan and similar)**<br>`ocr` | Short course, Long course (variant `ocr_long_course`) → `ocr_spartan` | 50 % · P | 30/70 → 20/80; in season 20/80 · P | 4 / 4 / 3 · P | 2 | no | ankle, shoulder (contact), finger pulleys, Achilles and calf, knee (landing and cutting) | - |
| 44 | **Bodybuilding / physique**<br>`bodybuilding_physique` | Men's bodybuilding (variant `physique_mens_bodybuilding`), Classic physique (variant `physique_classic`), Men's physique (variant `physique_mens_physique`), Bikini (variant `physique_bikini`), Wellness (variant `physique_wellness`), Figure (variant `physique_figure`), Women's physique / bodybuilding (variant `physique_womens_physique`) → `bodybuilding_aesthetics` | none (no athletic block) | 50/50 → 80/20 · R | 4 + walks / 4 / - · C | 0 (no athletic block) | no | high training volume (collect it on machines, EQ-03) | ATH-07, R2-SES-06, UNI-02, UNI-10 |
| 45 | **Gymnastics (artistic)**<br>`gymnastics` | Women's artistic, Men's artistic (variant `gymnastics_mag`) → `gymnastics_artistic` | 60 % · C | 40/60 → 30/70; in season 20/80 · P | 2 / 2 / 2 · R | 2 | yes · P | wrist and hand, Achilles and calf, ankle, low back (extension), growth plates, shoulder (hanging and overhead) | R3-ATH-04 |
| 46 | **Climbing / bouldering**<br>`climbing` | Bouldering, Lead / sport climbing (variant `climbing_lead`), Speed climbing (variant `climbing_speed`) → `climbing` | 25 % · C | 40/60 → 30/70; in season 30/70 · P | 2 / 2 / 2 · R | 1 | no | finger pulleys, shoulder (hanging and overhead), elbow, ankle | R3-ATH-04 |
| | **Racket and club** | | | | | | | | |
| 47 | **Tennis**<br>`tennis` | Singles, Doubles → `tennis` | 50 % · C | 20/80 → 10/90; in season 10/90 · R | 3 / 2 / 2 · C | 1 | yes · P | racket elbow, throwing shoulder, low back (rotation), Achilles and calf, ankle, groin | R2-ATH-01, R2-ATH-06, UNI-02, UNI-10 |
| 48 | **Pickleball (tournament)**<br>`pickleball` | Doubles / mixed doubles, Singles → `pickleball_competitive` | 50 % · C | 20/80 → 10/90; in season 10/90 · R | 3 / 2 / 2 · R | 1 | yes · P | racket elbow, throwing shoulder, low back (rotation), Achilles and calf, ankle, groin | R3-ATH-04, UNI-02, UNI-10 |
| 49 | **Padel (tournament)**<br>`padel` | one profile: `tennis` (variant `padel_competitive`) | 50 % · C | 20/80 → 10/90; in season 10/90 · R | 3 / 2 / 2 · R | 1 | yes · P | racket elbow, throwing shoulder, low back (rotation), Achilles and calf, ankle, groin | R3-ATH-04, UNI-02, UNI-10 |
| 50 | **Golf**<br>`golf` | one profile: `golf` | 25 % · C | 30/70 → 20/80; in season 20/80 · P | 3 / 2 / 2 · C | 1 | no | low back (rotation), lead hip, racket elbow, throwing shoulder | R2-ATH-01, R2-ATH-06 |
| 51 | **Badminton / squash / racquetball / table tennis**<br>`racket_other` | routed to `tennis` (nearest profile)<br>choices: Badminton, Squash, Racquetball, Table tennis | 50 % · P | 20/80 → 10/90; in season 10/90 · P | 3 / 2 / 2 · P | 1 | yes · P | racket elbow, throwing shoulder, low back (rotation), Achilles and calf, ankle, groin | - |
| 52 | **Bowling**<br>`bowling` | routed to `golf` (nearest profile) | 25 % · P | 30/70 → 20/80; in season 20/80 · P | 3 / 2 / 2 · P | 1 | no | low back (rotation), lead hip, racket elbow, throwing shoulder | - |

**Note 1: goalkeepers.** In round 3 he approved "goalkeepers 50 %". The model reads this as the goalkeepers of soccer, lacrosse and field hockey. The ice-hockey goalie stays with hockey at 40 % (R2-ATH-01), and the water-polo goalkeeper stays with water polo at 25 % (R3-ATH-04). This reading is PROPOSED.

**Note 2: routed sports.** Eight sports have no profile of their own: competitive dance, figure skating, skateboarding, competitive surfing, speed skating, fencing, the other racket sports (badminton, squash, racquetball, table tennis) and bowling. They use the nearest profile. Every number in those rows is PROPOSED, even when the borrowed profile's own sport was confirmed.

**Note 3: "men's or women's" in the picker.** Lacrosse asks which game is played, because the men's and women's games have different contact rules, sticks and fields (the team's reason, not his words). Gymnastics asks for the discipline, and physique sports ask for the division. These are competition formats. They are not rules based on the person's sex. The model has no sex field (GEN-02, ATH-09). He has not seen these picker choices: PROPOSED. See [special-populations.md](special-populations.md).

**Note 4: sports with no jump block.** Powerlifting and bodybuilding have no athletic block, so they have no plyo share and no Olympic days. Competitive CrossFit keeps its jumps and Olympic lifts inside its own class structure, as written in his CrossFit sheet.

**Note 5: Olympic weightlifting.** He said competitive Olympic lifting needs its own percentage-based program (R2-GEN-06). That program is not written. The profile in the data is a placeholder.

---

## 4. Same table, sorted by plyo share

This is the quick view of the first dial. Sports in **bold** were named by him.

| Plyo share at block end (start) | Round 2 (R2-ATH-01) | Round 3 (R3-ATH-04) | Placed by the team (PROPOSED) |
|---|---|---|---|
| 75 % (60 %) | **sprinters** | **runners** (read by the team as cross country, road running, 800 m and up, 400 m, hurdles) | long and triple jump, triathlon |
| 60 % (45 %) | **volleyball, soccer, football skill positions** | **lacrosse, field hockey, flag football, ultimate cutters, rugby sevens, high jump, pole vault, gymnastics, cheer flyers** | competitive dance, figure skating (routed) |
| 50 % (35 %) | **basketball, tennis, football big-skill positions** | **beach volleyball, pickleball, padel, rugby backs, goalkeepers, javelin, HYROX** | ultimate handlers, freestyle skiing and snowboarding, obstacle course racing, fencing, other racket sports, skateboarding, surfing (routed) |
| 40 % (25 %) | **baseball, softball, hockey, linemen, MMA** | **rugby forwards, cheer bases, throwers, diving, alpine skiing, cycling** | quarterbacks, kickers and punters, speed skating (routed) |
| 25 % (10 %) | **boxing, karate, kickboxing, wrestling, BJJ, golf** | **swimming, water polo, rowing, judo, taekwondo, climbing** | Olympic weightlifting, strongman, bowling (routed) |

**Why.** The sport's time on the ground sets the share:

> "The more time on the ground they have to have, like a karate athlete, the more ballistics and less plyos. The less time on the ground, like a sprinter, the more plyos and less ballistics." (ATH-01)

---

## 5. What he confirmed and what he did not, dial by dial

| Dial | Confirmed by him | Still PROPOSED |
|---|---|---|
| Plyo share | The rule (ATH-01). The share for every sport in his two lists (R2-ATH-01, R3-ATH-04). The 15-point start (R2-ATH-01). | Sports in neither list. The goalkeeper reading. Every routed sport. |
| Bilateral : unilateral | The scale from 90/10 to 10/90. Field athletes who change direction a lot: 80-90 % single-leg in the gym. Bodybuilders and powerlifters: about 50/50 at the start, then 80/20 or 90/10. In season: bilateral minimal (UNI-02, UNI-10). | The number for every other sport and position. He said: "We got to figure that out and put that algorithm together." (UNI-02) |
| Aerobic sessions | Off-season numbers for the sports in R2-ATH-06. The 2-4 range for the rest and 0 extra for swimmers, runners, rowers and endurance cyclists (R3-ATH-04). Pre-season 2. In season 2. HYROX 4 (R3-ATH-03). | The exact number inside 2-4 for sports he did not name. Water polo and triathlon at 0. Obstacle course racing at 4. |
| Olympic days | Everyone in athletic training (ATH-10). Up to 4 a week, cleans on squat days, snatches on hinge days (R2-ATH-04). Swimmers 2-3 days (R3-ATH-01). | The count for every other sport. |
| Game-heavy rule | Basketball, volleyball, soccer, football, hockey (R2-ATH-07). Lacrosse, field hockey, rugby, ultimate, flag football, beach volleyball (R3-ATH-04). | Cheer, gymnastics, competitive pickleball, tennis, padel, wrestling and the routed sports. |
| Hotspots | The general pain rule (VOL-03) and his rules for pitchers (ATH-08) and strikers (ATH-04). | The hotspot list for each sport. |
| Positions | That competitive athletes pick a sport and a position (GEN-02). | The position lists, the default profile for each sport, and the Spanish names (he approves those line by line, R2-GEN-08). |

### 5.1 The confidence label on every profile (R4-SCP-03)

**Rule.** Every sport profile carries one of three labels, in the data (`model/profiles.json > sports[id].confidence`, with a one-line `confidence_basis`) and on this page. The label is **not** printed on a plan.

> "Many sport numbers were confirmed by you, others we inferred from similar sports. Should each sport profile carry a label?" - "Yes, in the data and docs: 'Confirmed by coach', 'Based on a similar sport', or 'Proposed'. Not shown on the plan itself." (R4-SCP-03, approved)

How the label is read from the profile's own provenance (`synthesis/04_profiles.json`; the rule is in `tools/fixture/v05-library.mjs > profileConfidence`):

| Label | Meaning | Profiles |
|---|---|---|
| `confirmed_by_coach` | The numbers come from his own programs (the profile's evidence says OBSERVED), or he approved this sport's plan by name (swimming, R3-ATH-01; HYROX, R3-ATH-03). | 23 |
| `similar_sport` | Built on another profile: a base profile, a position delta, or a variant reused unchanged. | 67 |
| `proposed` | Inferred from a needs analysis with his general rules applied. There is no program of this sport in his sheets. | 37 |

A label describes the whole profile. Single dials inside a `proposed` or `similar_sport` profile can still be his (the plyo share of soccer and volleyball is R2-ATH-01, for example): the table in section 5 says which.

- **confirmed_by_coach:** `baseball_position`, `basketball`, `bodybuilding_aesthetics`, `boxing`, `crossfit_class`, `crossfit_competitor`, `distance_runner`, `fat_loss`, `football_skill`, `general_population`, `hybrid`, `hyrox_competitive`, `hyrox_fitness`, `karate_taekwondo`, `kickboxing_muay_thai`, `mma`, `powerlifting_strength`, `softball`, `swimming_distance`, `swimming_middle`, `swimming_sprint`, `taekwondo`, `weekend_warrior`
- **similar_sport:** `active_aging_50plus`, `active_aging_60plus`, `baseball_catcher`, `baseball_infield`, `baseball_outfield`, `baseball_pitcher`, `basketball_big`, `basketball_guard`, `cross_country`, `cycling_fitness`, `dance_fitness`, `flag_football`, `football_dl`, `football_k_p`, `football_ol`, `football_qb`, `football_rb`, `gymnastics_artistic`, `hike_ruck`, `hockey_defense`, `hockey_goalie`, `judo`, `lap_swim`, `ocr_spartan`, `pickleball_competitive`, `rec_basketball`, `rec_climbing`, `rec_combat_fitness`, `rec_flag_football`, `rec_golf`, `rec_hockey`, `rec_kickball`, `rec_league`, `rec_ocr`, `rec_padel`, `rec_pickleball`, `rec_rowing`, `rec_soccer`, `rec_softball`, `rec_tennis`, `rec_triathlon`, `rec_ultimate`, `rec_volleyball`, `rugby_backs`, `rugby_forwards`, `rugby_sevens`, `run_fitness`, `ski_snow_prep`, `soccer_defender`, `soccer_forward`, `soccer_gk`, `softball_pitcher`, `strongman`, `surf_paddle`, `track_400`, `track_hurdles`, `track_jumper`, `track_thrower`, `ultimate_cutter`, `ultimate_handler`, `volleyball_libero`, `volleyball_middle`, `volleyball_setter`, `water_polo_center`, `water_polo_goalkeeper`, `weightlifting`, `youth_general_athletic`
- **proposed:** `bjj_grappling`, `cheer_base_spot`, `cheer_flyer_tumbler`, `climbing`, `cycling_endurance`, `cycling_sprint`, `diving`, `field_hockey_field`, `field_hockey_gk`, `football_big_skill`, `football_lineman`, `golf`, `hockey`, `lacrosse_m_attack`, `lacrosse_m_defense`, `lacrosse_m_goalie`, `lacrosse_m_midfield`, `lacrosse_w_attack`, `lacrosse_w_defense`, `lacrosse_w_goalie`, `lacrosse_w_midfield`, `rowing`, `ski_alpine`, `ski_freestyle`, `soccer`, `tennis`, `track_high_jump`, `track_javelin`, `track_middle`, `track_pole_vault`, `track_sprinter`, `triathlon`, `volleyball`, `volleyball_beach`, `water_polo_field`, `wrestling`, `youth_athlete`

---

## 6. A sport that is not listed

**Rule.** The picker has a "Not listed?" choice. The person picks the closest type: court sport, field sport, endurance, combat, strength and power, water sport, or board and snow. The tool uses the nearest generic profile. This rule is PROPOSED.

To add a real profile for a new sport, copy the nearest profile in `synthesis/04_profiles.json > profiles[]`, set its dials with the rules on [athletes.md](athletes.md), label every number PROPOSED, and add the sport to `sports.list[]`. How to propose a change, and the evidence labels to use, are in [CONTRIBUTING.md](../../CONTRIBUTING.md).

**Where it lives.** `generator_spec_v1.json > inputs_schema.fields.F11.picker.not_listed`.
