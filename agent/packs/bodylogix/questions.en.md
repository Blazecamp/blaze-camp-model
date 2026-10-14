# BodyLogix Fitness Center & Massage plan builder questions (model 1.4.0)

Generated from `GET /api/questions?lang=en`. **Always fetch the live list before asking**: this is only a copy to read in one go.

`when` = ask it only when this holds. What is not asked keeps its default.

## `lang` · Language
- *type*: choice
- *choices*: English (`en`) · Spanish (`es`)
- *default*: `"en"`
- *required*
- The plan language (not an answers field: pass it as `lang`). Ask in the person's language; both are complete.

## `role` · This plan is for
- *type*: choice
- *choices*: Me (`self`) · A client (I'm a coach) (`client`)
- *default*: `"self"`
- *required*

## `health_route` · Health check for your client
- *when*: `role == "client"`
- *type*: choice
- *choices*: Run the health check (PAR-Q) with my client now (`coach_screen`) · Skip: I'm a fitness professional and I screen clients with my own onboarding (`coach_own_sop`)
- *default*: `"coach_screen"`
- *required*
- coach_own_sop skips the health questions; the plan then prints: You chose to skip the health check. You confirm you are a fitness professional and that you screen this client with your own onboarding procedures (health questionnaire, and medical clearance when needed) before they start. BodyLogix Fitness Center & Massage has not screened this client.

## `age` · Age
- *type*: integer
- *default*: `30`
- *required*
- Under 18: a parent or guardian accepts the release at the last step.

## `weight` · Body weight
- *type*: number
- *default*: `170`
- *required*

## `unit` · Units
- *type*: choice
- *choices*: Pounds (lb) (`lb`) · Kilograms (kg) (`kg`)
- *default*: `"lb"`
- *required*

## `years` · Years training consistently
- *type*: choice
- *choices*: New (`0`) · 6-12 months (`0.5`) · 1-2 years (`1`) · 2-3 years (`2`) · 3-5 years (`3`) · 5+ years (`5`)
- *default*: `1`
- *required*

## `goal` · Your goal
- *type*: choice
- *choices*: Build muscle (`muscle`) · Get stronger (`strength`) · Lose fat (`fat_loss`) · General fitness (`general`) · Sport athlete (`athletic`) · Stay active (`active`)
- *required*

## `sport.id` · Your sport
- *when*: `goal == "athletic"`
- *type*: choice
- *choices*: American football (`american_football`) · Badminton / squash / racquetball / table tennis (`racket_other`) · Baseball (`baseball`) · Basketball (`basketball`) · Beach volleyball (`beach_volleyball`) · Bodybuilding / physique (`bodybuilding_physique`) · Bowling (`bowling`) · Boxing (`boxing`) · Brazilian jiu-jitsu / grappling (`bjj`) · Cheerleading / STUNT (`cheerleading`) · Climbing / bouldering (`climbing`) · Competitive dance / drill team (`dance_team`) · Cross country and road running (`distance_running`) · CrossFit (competitive) (`crossfit`) · Cycling (`cycling`) · Diving (`diving`) · Fencing (`fencing`) · Field hockey (`field_hockey`) · Figure skating (`figure_skating`) · Flag football (`flag_football`) · Golf (`golf`) · Gymnastics (artistic) (`gymnastics`) · HYROX (competitive) (`hyrox`) · Ice hockey (`ice_hockey`) · Judo (`judo`) · Karate (`karate`) · Kickboxing / Muay Thai (`kickboxing_muay_thai`) · Lacrosse (men's and women's) (`lacrosse`) · MMA (mixed martial arts) (`mma`) · Obstacle course racing (Spartan and similar) (`ocr`) · Olympic weightlifting (`olympic_weightlifting`) · Padel (tournament) (`padel`) · Pickleball (tournament) (`pickleball`) · Powerlifting (`powerlifting`) · Rowing (crew) (`rowing`) · Rugby (`rugby`) · Skateboarding (street / park) (`skateboarding`) · Skiing / snowboarding (competitive) (`ski_snowboard`) · Soccer (`soccer`) · Softball (`softball`) · Speed skating (long / short track) (`speed_skating`) · Strongman (`strongman`) · Surfing (competitive) (`surfing`) · Swimming (`swimming`) · Taekwondo (`taekwondo`) · Tennis (`tennis`) · Track and field (`track_and_field`) · Triathlon (`triathlon`) · Ultimate (`ultimate`) · Volleyball (indoor) (`volleyball`) · Water polo (`water_polo`) · Wrestling (folkstyle / freestyle / Greco-Roman) (`wrestling`)
- *required*
- Each sport lists its positions (sport.position) and, for some, a second choice (sport.detail).

## `sport.position` · Position or event (optional)
- *when*: `goal == "athletic" and the sport has positions`
- *type*: choice
- *choices from*: `sport.id -> positions`
- Not sure / all-round

## `sport.detail` · Second choice
- *when*: `goal == "athletic" and the sport has a second_choice`
- *type*: choice
- *choices from*: `sport.id -> second_choice.options`

## `sport.season` · Your season
- *when*: `goal == "athletic"`
- *type*: choice
- *choices*: Off-season now (`no_season`) · Season starts on (`next_season_start`) · In season until (`in_season_until`) · Competition on (`competition_date`)
- *default*: `"no_season"`

## `sport.season_date` · Date
- *when*: `sport.season != "no_season"`
- *type*: date
- *required*

## `sport.level` · Level of play (optional)
- *when*: `goal == "athletic"`
- *type*: choice
- *choices*: Youth / club / age-group (`youth_club`) · High school (`high_school`) · College (`college`) · Professional (`pro`) · Masters (`masters`) · Amateur (`amateur`)

## `sport.practice` · Team practices per week
- *when*: `goal == "athletic"`
- *type*: integer
- *default*: `0`
- Team practices are not built into the plan; the plan tells the athlete to account for them (CH5-01).

## `activity.id` · Your activity
- *when*: `goal == "active"`
- *type*: choice
- *choices*: A bit of everything (`weekend_warrior`) · Badminton, squash, racquetball or table tennis (`rec_racket_other`) · Bowling (`rec_bowling`) · Boxing, kickboxing or martial-arts classes (`rec_combat_fitness`) · Climbing / bouldering gym (`rec_climbing`) · CrossFit-style classes (`crossfit_class`) · Cycling / indoor cycling (`cycling_fitness`) · Dance and fitness classes (`dance_fitness`) · Disc golf (`rec_disc_golf`) · Golf (`rec_golf`) · Hiking and rucking (`hike_ruck`) · HYROX (`hyrox_fitness`) · Kayak, canoe, wakeboard or water-ski (`rec_paddle_water`) · Lap swimming (incl. masters-style workouts) (`lap_swim`) · Mountain biking (`rec_mountain_biking`) · Obstacle course race (first Spartan / Tough Mudder) (`rec_ocr`) · Padel (`rec_padel`) · Pickleball (`rec_pickleball`) · Rec league (pick the sport) (`rec_league`) · Rowing / indoor rowing (`rec_rowing`) · Running for fitness (first 5K / 10K, run club) (`run_fitness`) · Ski / snowboard season prep (`ski_snow_prep`) · Surf and paddleboard (`surf_paddle`) · Tennis (`rec_tennis`) · Trail running (`rec_trail_running`) · Triathlon for fitness (first race / age group) (`rec_triathlon`)
- *required*

## `activity.league` · Which sport? (optional)
- *when*: `goal == "active" and the activity has league choices`
- *type*: choice
- *choices from*: `activity.id -> league`

## `activity.style` · Which style? (optional)
- *when*: `goal == "active" and the activity has style choices`
- *type*: choice
- *choices from*: `activity.id -> style`

## `activity.play_days` · Which days do you play? (optional)
- *when*: `goal == "active"`
- *type*: multi
- *choices*: Monday (`Mon`) · Tuesday (`Tue`) · Wednesday (`Wed`) · Thursday (`Thu`) · Friday (`Fri`) · Saturday (`Sat`) · Sunday (`Sun`)
- *default*: `[]`

## `activity.event_date` · Event date (optional)
- *when*: `goal == "active"`
- *type*: date
- The hardest weeks end one week before it.

## `focus` · Focus muscles (optional, up to 2)
- *when*: `goal == "muscle"`
- *type*: multi
- *choices*: Chest (`chest`) · Back (`back`) · Shoulders (front, side and rear delts) (`shoulders`) · V shape (back and shoulders; uses both picks) (`v_taper`) · Quads (`quads`) · Glutes (`glutes`) · Hamstrings (`hamstrings`) · Biceps (`biceps`) · Triceps (`triceps`) · Calves (`calves`) · Core (`core`)
- *default*: `[]`
- Pick up to 2 muscles to grow a bit faster (optional). The plan adds about 2 sets a week to each.

## `format` · How do you like to train?
- *when*: `goal in ["fat_loss", "general"]`
- *type*: choice
- *choices*: Gym sessions (`gym`) · Bootcamp circuits (`bootcamp`)
- *default*: `"gym"`

## `days` · Training days per week
- *type*: choice
- *choices*: 2 (`2`) · 3 (`3`) · 4 (`4`) · 5 (`5`) · 6 (`6`)
- *default*: `3`
- *required*
- 2 days works. Every big muscle still gets trained. A third day lets each muscle reach 10 sets.

## `weekdays` · Which days?
- *type*: multi
- *choices*: Monday (`Mon`) · Tuesday (`Tue`) · Wednesday (`Wed`) · Thursday (`Thu`) · Friday (`Fri`) · Saturday (`Sat`) · Sunday (`Sun`)
- Exactly `days` weekdays, or leave it out: the plan then uses its template's own days.

## `equipment` · Where do you train?
- *type*: choice
- *choices*: Full commercial gym (`FULL_GYM`) · Basic gym (no specialty machines) (`BASIC_GYM`) · Home gym (rack + barbell + dumbbells) (`HOME_BARBELL`) · Home: dumbbells + bench (`HOME_DB_BENCH`) · Kettlebells only (`KB_ONLY`) · Bodyweight only (`BODYWEIGHT`) · Hotel gym (`HOTEL_GYM`) · Field / track / outdoor kit (`FIELD_TRACK_KIT`)
- *default*: `"FULL_GYM"`
- *required*

## `split` · How the week is split
- *when*: `goal == "muscle" and days in [4, 6]`
- *type*: choice
- *choices*: Coach's full-body days (`default`) · Upper / lower (`upper_lower`) · Push / pull / legs (`ppl`)
- *default*: `"default"`
- upper_lower only with 4 days, ppl only with 6 days.

## `supersets` · Supersets
- *type*: choice
- *choices*: As planned (`normal`) · More supersets (`more`)
- *default*: `"normal"`
- more = the template's exercise pairs are done as supersets (CH7-07).

## `weeks` · Plan length
- *type*: choice
- *choices*: 12 weeks (`12`) · 8 weeks (`8`)
- *default*: `12`

## `start_date` · Start date
- *type*: date
- Default: the next Monday.

## `tests` · Test at the start and the end? (optional)
- *type*: multi
- *choices*: Strength (`strength`) · Cardio (`cardio`) · Speed / agility (`speed_agility`) · Jumps (`jumps`) · Body weight / measurements (`body`)
- *default*: `[]`
- Tests only in week 1 and the last week.

## `extras` · Anything extra? (optional)
- *type*: multi
- *choices*: dumbbells (`dumbbell`) · kettlebells (`kettlebell`) · barbell (`barbell`) · squat rack (`rack`) · bench (`bench`) · pull-up bar (`pullup_bar`) · cable station (`cable`) · medicine ball (`medball`) · box (`box`) · sled (`sled`) · jump rope (`jump_rope`) · suspension trainer (TRX) (`trx`) · cardio machine with a calorie display (`cardio_machine_cal`) · open space (20 m or more) (`open_space_long`)
- *default*: `[]`

## `pain` · Anything hurting? (optional)
- *type*: list
- *default*: `[]`
- Tap an area, then how much it hurts.

## `health` · Health check
- *when*: `not (role == "client" and health_route == "coach_own_sop")`
- *type*: choice
- *choices*: None of these apply to me (`none`) · Some apply (`some`)
  - `heart`: Chest pain, fainting or a heart condition
  - `surgery_6mo`: Surgery or a fracture in the last 6 months
  - `pregnant_postpartum_6mo`: Pregnant, or gave birth in the last 6 months
  - `injury_in_treatment`: An injury currently under treatment
  - `doctor_said_no`: A doctor told you not to train
- *required*
- A yes does not stop your plan. The plan is built with a health warning: see a medical professional first.

## `safety` · Health check
- *when*: `health == "some"`
- *type*: yes_no_each
- *default*: `{"heart":false,"surgery_6mo":false,"pregnant_postpartum_6mo":false,"injury_in_treatment":false,"doctor_said_no":false}`
- *required*

## `accepted` · Terms and release (required)
- *type*: release
- *default*: `false`
- *required*
- Show the release text for the version that applies (release.client for the person themselves, release.coach for a coach building for a client, release.minor in addition under 18), then ask for an explicit "I accept". Never assume it.

## `guardian` · I am the parent or legal guardian of this athlete (under 18), I read the release and I accept it for them.
- *when*: `age < 18`
- *type*: boolean
- *default*: `false`
- *required*
- Under 18: a parent or legal guardian must read and accept this release. Guardian's name: [ ]
