# 09 · Generator intake form (landing page inputs)

**What this is.** The proposed intake form for the Blaze Camp program generator. A client fills it in on the landing page, and the generator returns a 6-, 8- or 12-week plan in the coach's style. For every field it gives the type, the options, when it is shown, the default, why the generator needs it, and which rule in the synthesis files consumes it. It also lists the values the generator works out by itself, the checks that stop a bad plan, and one shared vocabulary for goals, sports, season phases, equipment and levels. Today those differ from file to file (`08_open_questions_for_coach.md` C-20 to C-23).

**Design rules for the form (INFERRED, product choices).**
1. **Ask only what changes the plan.** Every field below names the rule that uses it. Anything no rule uses is in section 5 ("left out").
2. **Derive the rest.** Level, template, season phase, weekly sets, medball weight and so on are computed (section 2), not asked.
3. **Two paths.** An express path (10 questions, 12 for athletes, section 0.2) for most clients; the full form adds the optional fields that sharpen the plan.
4. **Safety first.** A short health check runs before anything else; some answers send the client to the coach instead of producing a plan (GEN-01 already proposes an option for coach review).
5. **The coach's words on screen.** Where the coach has a label, the form uses it (for example the FOCUS muscle names 'QUADS 👇' … 'CALVES 👇' and the EFFORT scale), with spelling corrected in the generator only (FIX-04).

**Labels.** OBSERVED = backed by a sheet cell or a coach answer. INFERRED = our design. "Pending" = a coach question (page ID such as VOL-08, or a new ID from file 08 such as N-IN-01) could change the field.

**Rule IDs used in "Consumed by".** 03 = `03_volume_dosing.md` (section 9.x). 04 = `04_athlete_profiles.md` / `04_profiles.json` (profiles, season families, injury library codes such as SHOULDER_THROWER). 05 = `05_session_architecture.md` / `05_templates.json` (split templates, time model 7.2-7.3, algorithm section 9). 06 = `06_periodization.md` / `06_periodization.json` (skeleton keys such as HYPERTROPHY_8, rules D1-D11, levers L01-L15). 10 = `10_equipment_model.md` / `.json` (access profiles, client rules CR-01 to CR-28, level policy LV-1 to LV-6). 11 = `11_training_variables.md` / `.json` (variables V01-V23, load-velocity LV-1 to LV-13, variation VP-1 to VP-12, quality rules QM-1 to QM-11, engine sections 3.x). 10b = `10b_equipment_variables_science.md` (EQ-x, FV-x, TEMPO-x, AR-x). 02 = `02_exercise_catalog.json` (fields such as `equipment.min_access_tier`).

---

## 0. The form at a glance

### 0.1 Steps

| Step | Screen | Fields | Shown to |
|---|---|---|---|
| 1 | Safety check | F01 | everyone |
| 2 | About you | F02-F06 | everyone (F03 only youth athletes) |
| 3 | Your goal | F07-F10 | everyone |
| 4 | Your sport | F11-F16 | athletes, hybrid / CrossFit, distance runners |
| 5 | Your training background | F17-F21 | everyone (F19-F21 optional) |
| 6 | Your schedule | F22-F26 | everyone |
| 7 | Your equipment | F27-F34 | everyone (detail fields depend on the profile) |
| 8 | Pain and injuries | F35-F37 | everyone |
| 9 | Preferences and delivery | F38-F41 | everyone |

### 0.2 Express path (required fields only)

F01 safety check · F02 age · F07 goal · F11 sport (athletes only) · F14 season (athletes only) · F17 training age · F22 days per week · F24 session length · F25 plan length · F27 equipment profile · F35 pain areas (can be "none") · F41 email. F06 units, F23 weekdays, F26 start date and F34 cardio are pre-filled with their defaults and can be changed. Every other field falls back to the default in section 1.

---

## 1. Field reference

### Step 1 · Safety check

| ID | Field (as shown) | Type | Options | Required / shown when | Default | Why the generator needs it | Consumed by | Status |
|---|---|---|---|---|---|---|---|---|
| F01 | "Before we build your plan" health check | yes/no per item | (a) chest pain, heart condition or fainting during exercise; (b) surgery or a broken bone in the last 6 months; (c) pregnant, or gave birth in the last 6 months; (d) an injury you are being treated for right now; (e) a doctor told you not to exercise | required | all "no" | Any "yes" stops the automatic plan and sends the client to the coach for review. The model has no rules for these cases. | Gate before all rules (V1 in section 3). No synthesis rule covers these cases. | INFERRED; pending N-IN-04 |

### Step 2 · About you

| ID | Field | Type | Options | Required / shown when | Default | Why | Consumed by | Status |
|---|---|---|---|---|---|---|---|---|
| F02 | Age | number (years) | 10-90 | required | - | Youth and older-adult rules change exercise choice, jump volume, machine use and medball weight. | 10 CR-10 (65+ or frail: machines, no Olympic lifts or depth jumps), CR-11 (60+ high-functioning), CR-18 (under 15); 04 profiles `youth_athlete`, `general_population` / `older_adult`; 04 injury codes GROWTH_APOPHYSIS, FALLS_BONE_DENSITY; 10 section 5 medball 4-6 lb for youth and older clients | age cut-offs INFERRED; pending N-IN-14, ATH-09 |
| F03 | Growth stage (youth athletes) | single choice | before the growth spurt / during it (growing fast now) / after it / not sure | shown if F02 < 18 and the goal is sport | not sure (treated as "during") | Fewer depth jumps and foundational lists only during the spurt. | 04 season family `youth` (pre_PHV / circa_PHV / post_PHV); injury code GROWTH_APOPHYSIS | INFERRED + SCIENCE; pending N-ATH-17 |
| F04 | Sex | single choice | female / male / prefer not to say | optional | prefer not to say | Lighter medball for smaller and female clients; a longer landing block for female athletes in landing and cutting sports. | 10 CR-19 (medball −2 lb); 04 injury code ACL_LANDING_CUTTING | INFERRED; pending N-IN-09, N-ATH-16, EQ-06 |
| F05 | Body weight | number + unit | kg or lb | optional | blank (body-weight rules then use the safe low end) | Loaded jumps and drop-release jumps are dosed as a share of body weight; medball weight drops for clients under 60 kg. | 10 section 5 (DB jumps 10-20 % of body weight); 11 LV-5 (drop-release ~20 % of body mass); 10 CR-19 | INFERRED; pending N-IN-09, EQ-15 |
| F06 | Units | single choice | kg / lb | pre-filled, can change | from browser locale | Output only. | output | INFERRED; pending N-OUT-10 |

### Step 3 · Your goal

| ID | Field | Type | Options (code: label) | Required / shown when | Default | Why | Consumed by | Status |
|---|---|---|---|---|---|---|---|---|
| F07 | Main goal | single choice | `muscle`: Build muscle (aesthetics) · `strength`: Get stronger · `athlete`: Perform better in my sport · `fat_loss`: Lose fat / tone up · `hybrid`: Hybrid (strength + athletic + conditioning, CrossFit-style) · `general`: General fitness and health | required | - | Picks the template family, the weekly set targets, the rep ranges, the conditioning plan and the client rules. | 06 skeleton family; 05 `generator_split_templates` family; 03 9.3 (targets by goal), 9.9 (rep matrix), 9.12 (conditioning); 10 CR-01 to CR-06; 04 profile family (crosswalk in section 4.1) | OBSERVED families; mapping INFERRED |
| F08 | Second goal | single choice | none / build muscle / get stronger / lose fat / conditioning | optional | none | Adds Focus sets or a conditioning slot without changing the main template. | 03 9.4 (Focus slots); 05 optional blocks | INFERRED; pending N-IN-08 |
| F09 | Muscles you most want to grow (up to 2) | multi choice, max 2 | 'QUADS 👇', 'GLUTES 👇', 'HAMSTRINGS 👇', 'BACK 👇', 'CHEST 👇', 'SHOULDERS/TRAPS 👇' (then: side / rear / front), 'BICEP 👇', 'TRICEP 👇', 'CALVES 👇', 'CORE 👇' | shown for muscle, fat loss, general, hybrid; optional for athletes and strength | none | Priority muscles get more weekly sets, a faster ramp and the Focus slots; a priority small muscle may move to the start of the session. | 03 9.4; 11 3.3 (focus rate one class up), 3.6 step 6 (Focus overflow); 06 4.3; 05 Focus 1 / Focus 2 slots; page ORD-04 (priority-first) | OBSERVED labels (BYOP 'MASTER EXERCISE LIBRARY' AZ8 … AZ331); rules INFERRED; pending VOL-02, ORD-11 |
| F10 | How you like to lift | single choice | `volume_lighter`: "Lighter weight, more sets" · `balanced`: "A mix" · `heavy_powerlifting`: "Heavier weight, fewer reps (powerlifting style)" | shown for muscle, strength, general, fat loss | balanced | Moves the rep range on the big compound lifts and the rest times; small muscles stay high-rep. | 03 9.9 (preference-style modifiers); COACH-CHAT ("some prefer more sets of squats with less weight; some prefer powerlifting style") | OBSERVED (coach words); numbers INFERRED; pending VOL-12 |

### Step 4 · Your sport

| ID | Field | Type | Options | Required / shown when | Default | Why | Consumed by | Status |
|---|---|---|---|---|---|---|---|---|
| F11 | Sport | single choice, grouped | Court: basketball, volleyball, tennis/racket. Field: American football, soccer, baseball, softball, ice hockey, golf. Track: sprints/jumps, distance running. Combat: boxing, kickboxing/Muay Thai, karate/taekwondo, MMA, wrestling, BJJ/grappling. Mixed: CrossFit, hybrid. Strength sport: powerlifting. Other (→ generic athlete). | required if F07 = athlete or hybrid | - | Sets the sport dial (jump contacts, throws, cuts, sprints, triple extension), the template base, the season family and the injury-prevention extras. | 04 `profiles[].id` (crosswalk 4.2); 04 season families; 05 `sport_dial`; 03 9.11; 10 CR-07, CR-08, CR-09, CR-09b, CR-09c; 04 injury library | 8 profiles OBSERVED, 19 INFERRED; pending N-ATH-01, ATH-02 |
| F12 | Position or event | single choice (depends on F11) | basketball: guard / big · volleyball: hitter / setter / libero · football: skill (WR, DB, RB) / big skill (LB, TE, FB, S) / lineman / quarterback / specialist · soccer: outfield / goalkeeper · hockey: skater / goalie · baseball: position player / pitcher / catcher · softball: position player / pitcher · track: 100-200 m / 400 m / jumps · CrossFit: competitor / class member | shown when F11 has variants | the first option | Shifts the dial inside a sport (for example, more arm care for pitchers, fewer jumps for linemen). | 04 `profiles[].variants` | INFERRED; pending N-ATH-11, ATH-08 |
| F13 | Level of competition | single choice | recreational / high school / college / professional / masters | shown with F11 | recreational | Competitive athletes start at the top client level; it also picks the default season calendar. | level derivation D2 (section 2); baseball calendars (high school, fall ball, pro) | INFERRED; pending N-IN-01, N-IN-06, PRG-09 |
| F14 | Season | date or choice | (a) next season starts on [date]; (b) I am in season now, it ends on [date]; (c) next competition / fight / race on [date]; (d) no season (fallback: off-season) | required with F11 | (d) | Works out the phase (off-season, pre-season, in-season, transition), the taper and whether the plan length fits. | 06 skeleton keys ATHLETE_OFF_6/8/12, ATHLETE_PRE_6/8, ATHLETE_IN_SEASON(_6/_12), ATHLETE_TRANSITION; 06 D10 (taper); 04 season families (field_court, combat, strength, endurance); 03 9.11 | INFERRED; pending N-IN-06, N-PER-07, PER-08 |
| F15 | Sport load per week | numbers + weekdays | team practices per week; total practice hours; games per week; usual game days (Mon-Sun) | shown with F11 | 0 | In season, games and practice already give jumps and sprints, so the gym dose drops; game days are kept away from hard sessions. | 04 section 7 (in-season: plyos × 0.3-0.5 for jump-heavy sports, lift 2-3 days); 05 6.4 (week layout) | INFERRED; pending N-ATH-07 |
| F16 | Making weight for the fight? (combat) / Race distance (distance running) | yes-no / single choice | combat: weight cut yes / no · running: 5 km / 10 km / half marathon / marathon | shown for combat sports or distance running | no / half marathon | Fight camps avoid new exercises near the fight; the half marathon uses the coach's borrowed plan. | 04 combat `fight_camp` (INFERRED); 04 endurance family; MASTER MODEL Sheet24 'HALF MARATHON PROGRAM by CHRIS HINSHAW ' (page PRG-12: used as-is for the half marathon only) | INFERRED; pending N-ATH-09, PRG-12 |

### Step 5 · Your training background

| ID | Field | Type | Options | Required / shown when | Default | Why | Consumed by | Status |
|---|---|---|---|---|---|---|---|---|
| F17 | How long have you trained consistently? | single choice | under 6 months / 6-12 months / 1-3 years / 3-5 years / 5+ years | required | - | The main input to the client level, which sets start volume, caps and rep ranges. | D2 level (03 9.2: L1 under 1 year, L2 1-3, L3 3-5, L4 5+ or competitive) | INFERRED; pending N-IN-01, N-IN-02 |
| F18 | Sessions per week in the last 3 months | single choice | 0-1 / 2-3 / 4+ | optional (full form) | 2-3 | A long break moves the client down one level for the first block. | D2 level | INFERRED; pending N-IN-01 |
| F19 | What can you do today? (ability checklist) | one choice per item | strict pull-ups: 0 / 1-4 / 5-9 / 10+ · push-ups: 0-4 / 5-14 / 15-29 / 30+ · bodyweight squat to full depth without pain: yes / no · land from a jump softly and hold it 3 seconds: yes / no · coached in Olympic lifts: never / a little / regularly · comfortable with barbell back squat and deadlift: yes / no · sprint all-out without pain: yes / no | optional (strongly suggested for athletes) | blank = the most cautious answer | Picks the exercise level per slot (client level and exercise level are separate axes, CAT-06): for example assisted pull-ups vs strict pull-ups, landings before rebounds, Olympic lifts or not. | D10 eligibility (10 LV-1 to LV-5, CR-15 to CR-17; 11 V23); 11 QM-7 (plyo zone gating), QM-8 (Olympic ladder); page ATH-10 | INFERRED; pending N-IN-03 |
| F20 | Recent best sets (optional) | weight × reps per lift | back or front squat; bench press; deadlift; power clean; and/or a run: 1 mile or 1.5 miles time | optional | blank = loads by effort (RIR) only | % prescriptions need a max: Olympic '@ 75%' → '@ 90%', STRENGTH-12 80-90 %, French contrast '78% of 1RM', bands 'around 50%', dynamic effort 'about 60-70%'. | 11 LV-5, LV-6, LV-8; 06 L03 (load %); 06 5.3 (RPE ↔ % chart); e1RM tracking (11 3.2) | INFERRED; pending N-IN-10, N-VOL-10 |
| F21 | How long can you run, bike or row without stopping? | single choice | under 10 min / 10-20 min / 20-30 min / 30+ min | optional | 10-20 min | Sets the starting aerobic level (which colours are unlocked: 'LVL 1 = C', 'LVL 2 = C, B', 'LVL 3 = C,B, A', 'LVL 4 = LACTATE CLERANCE'). | 03 9.12; 06 L13 | OBSERVED level grid; mapping INFERRED; pending ATH-07, N-PER-04 |

### Step 6 · Your schedule

| ID | Field | Type | Options | Required / shown when | Default | Why | Consumed by | Status |
|---|---|---|---|---|---|---|---|---|
| F22 | Training days per week | single choice | 2 / 3 / 4 / 5 / 6 | required | 4 | Picks the week layout. With 4+ days every main pattern is trained twice a week; 5-6 days add the coach's optional blocks ('Calves', 'Cardio', 'Core', 'Focus 1', 'Focus 2') rather than more heavy days. | 05 `generator_split_templates[family][days]`; 05 6.2 (frequency check), 6.5 (optional blocks); 03 9.10 | OBSERVED layouts for 3, 4 and 6 days; 2 and 5 INFERRED; pending ORD-10, N-SES-06, N-SES-07 |
| F23 | Which days can you train? | multi choice Mon-Sun | Mon … Sun | pre-filled, can change (at least F22 days) | Mon, Tue, Wed, Thu, Fri, Sat | Places the day types on real days (coach default A, B, optional, A, B, optional, off) and keeps hard days apart and away from games. | 05 6.4 (week skeletons and spacing) | OBSERVED default week; placement INFERRED; pending N-IN-07 |
| F24 | Time per session | single choice | 30 / 45 / 60 / 75 / 90 min | required | 60 | Sets how many exercises and sets fit, and what is cut or added. | 05 7.2 (time model), 7.3 (slots by length, cut order, add order); 03 9.10 | INFERRED (no tab writes minutes); pending VOL-08, N-SES-04, N-SES-05 |
| F25 | Plan length | single choice | 6 / 8 / 12 weeks | required | 8 | Picks the plan shape: deload or test weeks, waves, peak week. | 06 skeletons (…_6, …_8, …_12); 06 D1-D3; 03 9.8; 11 3.10 | 8 and 12 OBSERVED shapes; 6 INFERRED; pending PER-01, N-PER-01 |
| F26 | Start date | date | - | pre-filled, can change | next Monday | Date maths with the season (F14) and week labels in the plan. | D4 phase; output | INFERRED |

### Step 7 · Your equipment

| ID | Field | Type | Options | Required / shown when | Default | Why | Consumed by | Status |
|---|---|---|---|---|---|---|---|---|
| F27 | Where do you train? | single choice | Performance facility (platform, turf, full machines) · Full commercial gym · Basic gym (no specialty machines) · Home gym with barbell and rack · Home: dumbbells + bench + bands · Kettlebells only · Bands only · No equipment (bodyweight) · Hotel gym · Bootcamp / outdoor kit (medballs, cones, boxes) · Track or field only | required | - | Filters every slot's options; empty slots get the coach's own swaps, then flagged substitutes, then a buy list. | 10 `access_profiles` (11 profiles), `substitution_by_category`, `gap_matrix`; 10 CR-20; 02 `equipment.min_access_tier` (crosswalk 4.4) | profiles INFERRED; pending EQ-01 |
| F28 | Extra equipment you have | multi choice (list depends on F27) | dumbbells · kettlebells · barbell + rack · bumper plates / can drop the bar · hex bar · landmine · bands + door anchor · mini-bands · pull-up bar · dip bars · TRX or rings · medicine ball · slam ball · plyo box or sturdy step · hurdles or cones · sliders · stability ball · jump rope · sled · chains · cable station · bike / rower / ski erg / treadmill | optional | none | Each add-on opens specific slots (dumbbells open horizontal pull, side raises, biceps and triceps at home; a pull-up bar opens vertical pull; a medball opens the 'Throwing' slot). | 10 `kit_tokens`, `intake.step_2_add_ons_ranked_for_home_clients` | INFERRED; pending EQ-02 |
| F29 | Machines at your gym | tick list | leg press · pendulum squat · hack squat · leg extension · leg curl (seated / lying) · lat pull-down · assisted pull-up machine · row machine · chest press · Smith machine · GHD or 45° back extension · reverse hyper · hip thrust machine | shown for gym profiles | all ticked for "Full commercial gym" and "Performance facility"; none of the specialty machines for "Basic gym" | The coach ranks leg machines: 'PENDULUM' (his favourite) and 'LEG PRESS' 'LOVE IT', 'HACK SQUAT' "I PERSONALLY DON'T LIKE IT", V-squat never. Machines carry extra volume for older, injured and high-volume clients. | 10 section 6 and CR-22 (machine rank), CR-14 (volume tool), CR-10 (older clients); 11 V10 | OBSERVED ratings (ALL ABOUT SQUATS G35:I41); list INFERRED; pending N-IN-13, EQ-11 |
| F30 | Heaviest dumbbell pair you can use | number + unit | kg / lb | shown if dumbbells | blank | Caps home loading; when the weight cannot go up, the plan progresses reps, slow lowering, longer range and sets first. | 11 3.9 ("coarse home increments"); 10b TEMPO-3; 02 `load_ceiling` | INFERRED; pending N-IN-12, N-VOL-13 |
| F31 | Medicine ball weights you have | multi choice | 4 / 6 / 8 / 10 / 12 / 14+ lb · none | shown if medicine ball | - | The coach wants upper-body passes and rotations light (8-10 lb) so they stay fast; the generator picks from the balls owned. | 10 section 5 (medball rule); 11 LV-3, QM-6; 10b FV-6 | COACH-CHAT 8-10 lb; per-throw split pending EQ-06 |
| F32 | Box or step height | single choice | none · step (about 15-20 cm) · about knee height · above knee · adjustable | shown if box/step or athlete | step | Box jumps and depth drops are graded by height ('Low Box Jumps (half shin)', 'Mid Box Jump (up to knee)', 'High Depth Drop (above hip)'). | 11 V19; 02 tier note (boxes above knee need a real plyo box) | OBSERVED labels; pending EQ-16 |
| F33 | Space to run | single choice | none · 10-20 m · 40-60 m or a track | full form (athletes are prompted) | none | Change of direction needs 10-20 m; sprints and bounding need 40-60 m. | 10 3.2 step 3; 10 CR-09c | INFERRED |
| F34 | Cardio you can do | multi choice | run outdoors · treadmill · bike · rower · ski erg · jump rope · none of these | pre-filled, can change | run outdoors | Picks the conditioning machine; non-runners do the coloured workouts on a machine by time or calories. | 03 9.12; page EQ-14 | INFERRED; pending EQ-14 |

### Step 8 · Pain and injuries

| ID | Field | Type | Options | Required / shown when | Default | Why | Consumed by | Status |
|---|---|---|---|---|---|---|---|---|
| F35 | Any pain or injury now? | multi choice | none · neck · shoulder · elbow · wrist or hand · upper back · lower back · hip or groin · knee · ankle or foot · other (text) | required | none | The coach's pain rule: move away from fixed grips to split grips (dumbbells, kettlebells), go unilateral (athletes), use machines, then cut sets only if pain repeats. | 03 9.5 (escalation); 10 CR-12, CR-13; 11 3.5 (RED gate), QM-5; 04 injury library (PAIN_GENERAL and the region codes); MM 'EXAMPLE ATHLETIC FULL BODY SPLI' A6 and UL/PPL A7 (OBSERVED pain lines) | OBSERVED rule text; mechanics INFERRED; pending VOL-03, UNI-08 |
| F36 | For each area: side, how bad, what makes it worse | three choices per area | side: left / right / both · severity: mild / moderate / severe · worse with: overhead · deep knee bend · jumping or impact · twisting · bending forward · gripping · running | shown per F35 area | - | Narrows the swaps: "overhead" removes zone-3 pressing and hanging for that client; "impact" removes depth drops and hurdle hops; "severe" sends the client to the coach. | 11 V13 (position zones), QM-5; 10 CR-13 (impact-sensitive list); 04 injury codes | INFERRED; pending N-IN-05 |
| F37 | Diagnosed condition or in rehab now? | yes/no + text | - | shown if any F35 area | no | "Yes" sends the client to the coach before a plan is made. | gate (V1) | INFERRED; pending N-IN-04 |

### Step 9 · Preferences and delivery

| ID | Field | Type | Options | Required / shown when | Default | Why | Consumed by | Status |
|---|---|---|---|---|---|---|---|---|
| F38 | Anything you can't or won't do? | multi choice + text | running · jumping · barbell lifts · lunges · overhead pressing · floor work · machines · other | optional | none | The slot keeps its pattern and the generator picks another exercise from the same category. | 10 substitution lists; 05 algorithm step 7 | INFERRED; pending N-IN-11 |
| F39 | Have the coach check the plan before it is sent? | yes/no | - | shown if the product offers it | product setting | Page GEN-01 already proposes an optional coach review. | release workflow | pending GEN-01 |
| F40 | Did you finish a Blaze Camp plan before? | yes/no + plan ID | - | optional | no | The next plan keeps the skeleton and changes one small variable per slot, and may open with a deload. | 11 VP-4, VP-5 (one small variable per block); 06 D3 (next plan opens with a deload) | INFERRED; pending N-IN-15, N-PER-01 |
| F41 | Email for the plan | email | - | required for delivery | - | Delivery only (shares the Google Sheet and the phone view). Not used by any training rule. | output only (page GEN-03) | product field |

---

## 2. Values the generator works out (not asked)

| ID | Derived value | How it is worked out | Rules used | Status |
|---|---|---|---|---|
| D1 | Template family and profile | F07 (+ F11, F12) → goal crosswalk (4.1) and sport crosswalk (4.2). Example: athlete + basketball + guard → profile `basketball` variant `basketball_guard`, 05 family `athletic`, 06 family ATHLETE. | 04 profiles; 05 families; 06 families | INFERRED mapping |
| D2 | Client level L1-L4 | Start from F17 (L1 under 1 year, L2 1-3, L3 3-5, L4 5+). Move down one level if F18 = 0-1 sessions a week. Competitive athletes (F13 college or pro) start at L3-L4. Cap at L2 if F19 shows no landing control or fewer than 5 push-ups. | 03 9.2; level crosswalk 4.5 | INFERRED; pending N-IN-01, N-IN-02, PRG-05 |
| D3 | Which level ladder | Athletes use the athlete ladder (higher level = fewer sets, more intensity, more single-leg and reactive work, more throws). Everyone else uses the gym ladder (higher level = more sets). | 04 `level_modifiers` (athlete_ladder, gym_ladder); 03 9.3 multipliers | OBSERVED ladders; use INFERRED; pending PRG-04 (C-14) |
| D4 | Season phase | From F14, F15, F25 and F26: weeks to the season start > F25 + 2 → OFF; ≤ 8 weeks → PRE (last 1-2 weeks taper); in season → IN; within 2 weeks after the season → TRANSITION. Fighters: 6-8 weeks before the fight → camp. | 06 phases; 04 season families; 06 D10 | INFERRED; pending N-IN-06, N-PER-07 |
| D5 | Plan skeleton | 06 skeleton key = family + phase + weeks (for example HYPERTROPHY_8, ATHLETE_PRE_6). Missing skeletons fall back as listed in 4.6. | 06 skeletons; D1-D3 | partly OBSERVED shapes; fallbacks INFERRED (C-25) |
| D6 | Week layout and day types | 05 `generator_split_templates[family][F22]` placed on F23 days; alternatives: BASEBALL Parts A-E for baseball and softball (and possibly tennis and golf), the boxing build-up for combat sports, push/pull/legs for 5-6-day advanced muscle clients. | 05 sections 6, 8; 04 profile `template` | OBSERVED templates; choice INFERRED; pending N-ATH-13, N-SES-07 |
| D7 | Stations per session | Reference 60-min stations, then the cut order (short sessions) or add order (long sessions) until the time model fits F24. Caps: ≤ 10 exercises, about 20 straight sets or about 30 paired sets. | 05 7.2, 7.3, section 9 step 3 | INFERRED; pending N-SES-04, N-SES-05 |
| D8 | Client family and constraint band | athlete / hypertrophy / strength / beginner / older_or_pain / fat_loss from F02, F07, F35 and D2; each family has a target band of machine-to-free-weight "constraint" (1 = open space, 5 = seated machine). | 10 `client_families`, CR-01 to CR-28, GRD-1 to GRD-3 | INFERRED |
| D9 | Exercise eligibility per slot | Every option with operative level ≤ the slot's allowed level (D2 + F19); levels add options and never remove lower ones (CAT-05); machines are allowed at every level (CR-26); never V-squat; hack squat ranked last. | 10 LV-1 to LV-6, CR-22, CR-26; 11 V23 | COACH-ANSWER CAT-04 to CAT-06; rest INFERRED |
| D10 | Default exercise in each slot | Rank: coach usage (his most-programmed lifts), constraint fit (D8), equipment (F27-F34), coach ratings, then variety rules (second weekly exposure may use a "twin" of the same category). | 10 2.3 (`picks_by_client_family`); 11 VP-6; 02 `observed_in_programs_count` | INFERRED; pending N-CAT-20, GEN-04, PER-04 |
| D11 | Equipment gaps | Slots with no option for the client's kit get the coach's own swaps first ('X or Y' cells), then flagged substitutes (`same_pattern`, `partial`, `zone_shift`, `pattern_gap`), then a buy list. | 10 3.4-3.5, CR-20; 10b 9.3 | OBSERVED swaps; algorithm INFERRED |
| D12 | Weekly sets per muscle | Week-1 start, peak target, cap and floor per muscle from goal, level and F09; growth by size class (big lower 3 %, big upper 5 %, small 7 %; a focus muscle moves one class up), released in whole sets; never above the cap. | 03 9.3, 9.4, 9.7; 11 3.3, 3.4, 3.8 | coach band OBSERVED (COACH-CHAT 15-20); numbers INFERRED; pending VOL-01 to VOL-06, N-VOL-01 to N-VOL-05 |
| D13 | Bilateral : unilateral target | Lower-body sets: about 50 % bilateral for general and aesthetics, 60-70 % strength, 40-45 % athlete conversion; new sets go to the side below target. | 11 3.7 (V22) | OBSERVED shares; targets INFERRED; pending UNI-02 |
| D14 | Reps, effort, rest per slot | Rep matrix by goal × exercise class × F10; effort by class (compounds 1-2 RIR; 'MAX' / 'MYO SET' only late); rest by goal ('*REST 1-2 MIN BETWEEN SETS', '*REST 3-6 MIN BETWEEN SETS', '*REST AS PRESCRIBED'). | 03 9.9; 11 V08, QM-1, QM-2; 06 5.4 | OBSERVED labels; matrix INFERRED; pending VOL-11 to VOL-14 |
| D15 | Athletic dose | Weekly targets for high- and low-amplitude jump contacts, throws, cuts, sprint metres and triple-extension sets from the sport profile × season multiplier × level; plyo zone and force phase by week. | 04 sections 4-5, 7; 03 9.11; 06 section 9; 11 QM-7 | 2 profiles OBSERVED, rest INFERRED; pending ATH-01, ATH-02, N-ATH-02, N-CAT-13 |
| D16 | Medball weight | Throw type × F04, F05, F02 × F31 (8-10 lb adult default for passes and rotations; slams 10-20 lb; lighter for youth, older and smaller clients). | 10 section 5; 11 LV-3, QM-6 | COACH-CHAT + SCIENCE; pending EQ-06 |
| D17 | Conditioning | Sessions per week and colours (A blue short/high, B green moderate, C orange long/low; lactate clearance at the top level) from D2, F07 and F21, never the same colour twice in a week; machine from F34. | 03 9.12; 06 L13; MM 'AEROBIC CAPACITY CHEAT SHEET' | OBSERVED system; counts pending ATH-07 |
| D18 | Pain swaps and exclusions | From F35-F38: split grips, unilateral, +1 constraint, load moved toward zone 1, pain-free range; impact filter for lower-limb pain; then set cuts only if pain repeats in the log. | 03 9.5; 10 CR-12, CR-13; 11 QM-5 | OBSERVED rule text; mechanics INFERRED |
| D19 | Variation mode | Block-fixed menu by default (the coach: don't "confuse" the muscle); A/B weeks optional for strength and fat loss; drill rotation only in athletic accessory slots. | 11 VP-1 to VP-9 | COACH-CHAT + OBSERVED; pending PER-02, PER-03 |
| D20 | Deload, test and taper weeks | From D5: 8 weeks → week 8 deload or test; 12 weeks → week 7 deload; 6 weeks → peak (next plan opens with a deload); athletes taper before the season or fight; early deload from the log. | 06 D1-D11; 11 3.10 | OBSERVED shapes; triggers INFERRED; pending PER-05, N-PER-03 |

---

## 3. Checks, warnings and conflicts

| ID | Condition | What the form or generator does | Basis |
|---|---|---|---|
| V1 | Any "yes" in F01, "severe" in F36, or "yes" in F37 | No automatic plan. Send the answers to the coach. | INFERRED safety rule (N-IN-04) |
| V2 | Fewer days ticked in F23 than F22 | Error: "pick at least N days". | form logic |
| V3 | F22 = 2 and F07 = strength or hybrid competitor | Warning: 2 days covers each main lift once a week. | 05 8.3 / 8.5 two-day layouts |
| V4 | F24 = 30 and F07 = athlete | Warning: the athletic block shrinks to 1 plyo + triple extension + 2 supersets. | 05 7.3 |
| V5 | F02 < 15 | Foundational/moderate bodyweight plyos only; no maximal lifts; no full Olympic lifts from the floor; medball 4-6 lb. | 10 CR-18; page ATH-09 |
| V6 | F02 ≥ 65, or older and low fitness | Constraint 4-5 on main lifts; no Olympic lifts, depth jumps, hurdle hops or bounding; fast machine work before any jumps. | 10 CR-10; N-ATH-18 |
| V7 | F25 longer than the weeks left before the season (F14) | Offer the plan cut to the weeks left, with a taper at the end, or switch to in-season mode at the season date. | N-PER-07 |
| V8 | In season (D4) and F25 = 12 | Use the in-season maintenance skeleton (ATHLETE_IN_SEASON_12): sets frozen, no Olympic lifts, two familiar menus. | 06 ATHLETE_IN_SEASON_12; 06 rule 13 |
| V9 | F27 has no medicine ball and the sport needs throws | Flag the 'Throwing' gap and add a medball to the buy list; do not swap in a different quality silently. | 02 no-equipment rule 5; 10 CR-20 |
| V10 | F27 = no equipment and goal = build muscle | Warning: no true vertical pull, biceps or throwing option without a pull-up bar, bands or a medball; show the buy list. | 10 3.3 |
| V11 | More than 2 muscles picked in F09 | Limit to 2. | 03 9.4 |
| V12 | F07 = athlete and F11 = other | Use the generic athlete profile. | 04 `athlete_generic` |
| V13 | Lower-limb pain (F35 knee, ankle, hip) and a jump-heavy sport | Impact filter: keep landings and 'Low Box Jumps (half shin)', drop depth jumps and hurdle hops, bike for conditioning. | 10 CR-13 |
| V14 | F38 = running | Conditioning on the machine from F34, by time or calories. | page EQ-14 |
| V15 | F38 = barbell lifts and F07 = strength | Warning: strength plans are built on barbell main lifts; offer dumbbell / machine strength instead. | 10 CR-03 |
| V16 | F07 = hybrid and F22 ≤ 3 | Use the part-time ("HALF TIME") dose: 3 sets, reps falling toward a 1-rep-max test. | INFERRED from 06 STRENGTH_PARTTIME_8 and 06 open question 23; pending PRG-10 |

---

## 4. One vocabulary for the generator (crosswalks)

### 4.1 Goals

| Form value (F07) | 03 goal | 05 split family | 06 skeleton family | 04 profile(s) | 10 client family |
|---|---|---|---|---|---|
| `muscle` | hypertrophy_aesthetics | aesthetics | HYPERTROPHY | bodybuilding_aesthetics (variants aesthetics_12wk_ppl, aesthetics_3day) | hypertrophy (beginner if L1) |
| `strength` | strength | strength | STRENGTH (STRENGTH_PARTTIME_8 at ≤ 3 days: INFERRED, 06 open question 23) | powerlifting_strength (variant strength_12wk) | strength |
| `athlete` | athletic_power | athletic | ATHLETE | sport profile from F11 | athlete |
| `fat_loss` | fat_loss | fat_loss_bootcamp | FAT_LOSS | fat_loss (variants bootcamp_1, bootcamp_2) | fat_loss |
| `hybrid` | (none: 03 has no hybrid goal; use general_fitness targets + conditioning) | hybrid_crossfit | HYBRID | hybrid, crossfit_competitor (variant crossfit_class) | athlete or strength (CR-06) |
| `general` | general_fitness | fat_loss_bootcamp (BOOTCAMP OPTION 1 style full body) | GENERAL_BEGINNER at L1, HYPERTROPHY at L2+ | general_population (variant older_adult) | beginner, or older_or_pain if V6 |
| (no equipment) | - | `no_equipment` is **not** a goal: keep the goal's family and filter by F27 (05 8.6 layouts only as a fallback) | - | - | CR-20 |

### 4.2 Sports

| Form value (F11, F12) | 04 profile id (variants) | 04 season family | Template base | 03 sport group | Evidence |
|---|---|---|---|---|---|
| basketball (guard / big) | basketball (basketball_guard, basketball_big) | field_court | BYOP ATHLETIC 4-day | basketball_volleyball | INFERRED |
| volleyball (hitter / setter / libero) | volleyball (volleyball_setter, volleyball_libero) | field_court | BYOP ATHLETIC 4-day | basketball_volleyball | INFERRED |
| tennis / racket | tennis | field_court | BASEBALL-style Parts | field_generic | INFERRED |
| American football: skill / quarterback / specialist | football_skill (football_qb, football_specialist) | field_court | BYOP ATHLETIC 4-day + sprint slots | field_generic | INFERRED |
| American football: big skill | football_big_skill | field_court | BYOP ATHLETIC 4-day | field_generic | INFERRED |
| American football: lineman | football_lineman | field_court | BYOP ATHLETIC 4-day, fewer plyos | field_generic | INFERRED |
| soccer (outfield / goalkeeper) | soccer (soccer_gk) | field_court | BYOP ATHLETIC 4-day | field_generic | INFERRED |
| baseball (position / pitcher / catcher) | baseball_position (baseball_pitcher, baseball_catcher) | field_court | BASEBALL Parts A-E | baseball_softball | OBSERVED (BASEBALL tab) |
| softball (position / pitcher) | softball (softball_pitcher) | field_court | BASEBALL Parts A-E | baseball_softball | INFERRED from baseball |
| ice hockey (skater / goalie) | hockey (hockey_goalie) | field_court | BYOP ATHLETIC 4-day | field_generic | INFERRED |
| golf | golf | general | 3-day full body with BASEBALL-style rotation | (none) | INFERRED |
| track: 100-200 m / 400 m / jumps | track_sprinter (track_400, track_jumper) | field_court | BYOP ATHLETIC 4-day with sprint slots | field_generic | INFERRED |
| distance running | distance_runner | endurance | 2-3 strength days + running plan (Sheet24 for the half marathon) | (none) | partly OBSERVED (Sheet24) |
| boxing | boxing | combat | MM boxing build-up | boxing_karate | OBSERVED (boxing tab) |
| kickboxing / Muay Thai | kickboxing_muay_thai | combat | boxing build-up structure | boxing_karate | INFERRED |
| karate / taekwondo | karate_taekwondo | combat | boxing build-up structure | boxing_karate | INFERRED |
| MMA | mma | combat | boxing build-up + grappling pulls, grip, neck | mma | INFERRED |
| wrestling | wrestling | combat | boxing build-up with pulling, grip, neck, carries | mma | INFERRED |
| BJJ / grappling | bjj_grappling | combat | 3-day strength + grip/neck | mma | INFERRED |
| CrossFit (competitor / class) | crossfit_competitor (crossfit_class) | crossfit | CrossFit macro grid | crossfit | OBSERVED (CrossFit tab) |
| hybrid | hybrid | crossfit | HYBRID-8 | crossfit | OBSERVED (4 TRACKS HYBRID) |
| powerlifting | powerlifting_strength | strength | STRENGTH-8 / STRENGTH-12 | (none) | OBSERVED (4 TRACKS) |
| other sport | athlete_generic | field_court | BYOP ATHLETIC 4-day | field_generic | OBSERVED slots |
| youth athlete (any sport, F02 < 18) | youth_athlete + the sport profile | youth | sport template cut to 2-3 days, foundational levels | - | INFERRED |

### 4.3 Season phases

| Derived phase (D4) | 06 | 04 field / court | 04 combat | 04 strength / endurance | 03 |
|---|---|---|---|---|---|
| Off-season, early (first 2-4 weeks after the break) | OFF | off_early_GPP | base_GPP | endurance: base | off_season_base |
| Off-season, build | OFF | off_build | conversion_build | endurance: build | off_season_power |
| Pre-season (≤ 8 weeks to the season) / fight camp (6-8 weeks to the fight) / meet peak | PRE | pre_intensify | fight_camp | strength: meet_peak; endurance: taper_race (last 10 days) | pre_season |
| In season | IN | in_season | (between fights: conversion_build at maintenance) | - | in_season |
| Post-season (≤ 2 weeks after) | TRANSITION | post_season_recovery | post_fight | - | (none) |

### 4.4 Equipment profiles

| Form value (F27) | 10 access profile | 02 tier | 10b profile | 03 equipment | Page EQ-01 option |
|---|---|---|---|---|---|
| Performance facility | FULL_FACILITY | T3 | P5 | full_gym | full commercial gym + field kit |
| Full commercial gym | FULL_GYM | T3 | P4-P5 | full_gym | full commercial gym |
| Basic gym | BASIC_GYM | T3 | P4 | full_gym | basic gym (no specialty machines) |
| Home gym with barbell and rack | HOME_BARBELL | T2-T3 | P3-P4 | home_db | home gym (rack + barbell + DBs) |
| Home: dumbbells + bench + bands | HOME_DB_BENCH_BANDS | T2 | P2 | home_db | home DBs + bench + bands |
| Kettlebells only | KB_ONLY | T2 | P2 | home_db | kettlebells only |
| Bands only | BANDS_ONLY | T1 | P1-P2 | bodyweight | bands only |
| No equipment | BODYWEIGHT | T0 | P1 | bodyweight | bodyweight only |
| Hotel gym | HOTEL_GYM | T2 (+ bike / treadmill) | P2 | home_db | hotel gym |
| Bootcamp / outdoor kit | BOOTCAMP_OUTDOOR | T1-T2 | P3 | bodyweight / home_db | field/track/outdoor kit |
| Track or field only | TRACK_FIELD | T0 + open space | P1 | bodyweight | field/track/outdoor kit |

### 4.5 Levels

| Generator | Gym examples (UL / PPL) | Athletic example | Aerobic cheat sheet | CrossFit | Library exercise level (separate axis, CAT-06) |
|---|---|---|---|---|---|
| L1 | 'NOVICE' (green) | 'STARTING OFF SEASON WORKOUTS' (green) | 'BEGGINER WORKOUTS' (green) | 'LVL 1' | F = 'FOUNDATIONAL' |
| L2 | 'NEWBY' (yellow) | ' MID OFF SEASON WORKOUTS' (yellow) | ' INTERMEDIATE WORKOUTS' (yellow) | 'LVL 2' | I = 'MODERATE' / 'INTERMIDIATE' |
| L3 | 'INTERMEDIATE' (orange) | ' ADVANCED OFF SEASON WORKOUTS' (red) | ' ADVANCED WORKOUTS' (red) | 'LVL 3' | A = 'ADVANCED' |
| L4 | (no gym tier) | (no tier) | (none) | 'LVL 4' | A |

Caveat: if the coach confirms that STARTING / MID / ADVANCED are three back-to-back off-season blocks (page PRG-04), the athletic column becomes a time sequence, not a level (C-14).

### 4.6 Plan skeletons that do not exist yet (fallbacks)

| Case | Fallback until the coach answers | Pending |
|---|---|---|
| Distance runner | GENERAL_BEGINNER or HYPERTROPHY strength days (2-3) + Sheet24 for the half marathon; other distances need a running plan | PRG-12 |
| Youth athlete | the sport's ATHLETE skeleton at foundational levels, 2-3 days, contacts × 0.7 | N-ATH-17, ATH-09 |
| Older adult | GENERAL_BEGINNER with constraint 4-5 | N-ATH-18 |
| Fight camp | ATHLETE_PRE_6 / _8 with the combat `fight_camp` multipliers | N-ATH-09 |
| Pre-season, 12 weeks | ATHLETE_OFF_12 (which already runs off-season → pre-season) | N-PER-07 |

---

## 5. Fields considered and left out

| Field | Why it is left out |
|---|---|
| Calories, diet, body-fat % | No rule in the coach's material uses them; the fat-loss template is lifting + cardio + circuits. |
| Height | No rule uses it. |
| Heart-rate zones, VO2max | The aerobic system is written in effort words and durations (A, B, C colours), not heart rates. |
| Sleep, stress, readiness questionnaires | Could feed the weekly readiness gate later, but the coach's logbook (EFFORT, 'HOW IT FELT?') already plays that role. |
| Favourite exercises | Covered by the coach's defaults (D10) and the exclusions field (F38). |
| Tempo preference, rest preference | The coach sets these by goal (D14), not by client taste. |
| Menstrual cycle tracking | No coach rule. |

---

## 6. Open decisions that change this form

| Field(s) | What could change | Question |
|---|---|---|
| F01, F37 | Whether a health screen exists and which answers stop the plan | N-IN-04 |
| F13, F17-F19, D2 | How the level is decided; 3 or 4 levels | N-IN-01, N-IN-02, N-IN-03, PRG-05 |
| F14, F15, D4 | Phase picker vs dates; practice load | N-IN-06, N-ATH-07, N-PER-07 |
| F11, F12 | Which sports and positions are offered | N-ATH-01, N-ATH-11 |
| F22, F23 | 2-day and 5-6-day layouts; who picks the weekdays | N-SES-06, N-SES-07, N-IN-07, ORD-10 |
| F24 | Real session lengths and the cut order | VOL-08, N-SES-04 |
| F25 | 6-week shape and plan chaining | PER-01, N-PER-01 |
| F27-F34 | Equipment options, minimum kit, machine list | EQ-01, EQ-02, N-IN-12, N-IN-13 |
| F31, D16 | Medball weights by throw and person | EQ-06 |
| F35-F36 | Pain detail | VOL-03, N-IN-05 |
| F04, F05 | Whether to ask sex and body weight | N-IN-09 |
| F08 | Second goal allowed | N-IN-08 |
| F20 | Ask maxes or not | N-IN-10 |
| F38 | Exclusions allowed | N-IN-11 |
| F40 | Plan continuity for returning clients | N-IN-15, N-PER-01 |

---

## 7. Example payload (what the form sends to the generator)

```json
{
  "safety": {"heart": false, "recent_surgery": false, "pregnancy_postpartum": false, "injury_in_treatment": false, "doctor_said_no": false},
  "age": 19, "growth_stage": null, "sex": "male", "body_weight": {"value": 82, "unit": "kg"}, "units": "kg",
  "goal": "athlete", "second_goal": "muscle", "focus_muscles": [], "lift_style": "balanced",
  "sport": "basketball", "position": "basketball_guard", "competition_level": "college",
  "season": {"type": "next_season_start", "date": "2027-01-10"},
  "sport_load": {"practices_per_week": 3, "hours_per_week": 6, "games_per_week": 0, "game_days": []},
  "training_age": "3-5y", "recent_frequency": "4+",
  "abilities": {"pullups": "5-9", "pushups": "30+", "squat_depth_pain_free": true, "soft_landing_hold": true, "olympic_coached": "a_little", "barbell_squat_deadlift_ok": true, "sprint_pain_free": true},
  "recent_bests": {"front_squat": {"kg": 110, "reps": 3}, "power_clean": {"kg": 80, "reps": 2}},
  "aerobic_base": "20-30min",
  "days_per_week": 4, "weekdays": ["Mon", "Tue", "Thu", "Fri", "Sat"], "session_minutes": 60, "plan_weeks": 6, "start_date": "2026-10-12",
  "equipment_profile": "FULL_GYM", "extra_equipment": ["medball", "plyo_box", "hurdles"],
  "machines": ["leg_press", "leg_extension", "leg_curl_seated", "lat_pulldown", "cable"],
  "dumbbell_max_pair": null, "medball_weights_lb": [6, 8], "box_height": "knee", "run_space": "40-60m", "cardio": ["run_outdoors", "bike"],
  "pain": [], "exclusions": [], "coach_review": false, "previous_plan_id": null, "email": "<delivery only>"
}
```

What the generator would derive from it (D-values): profile `basketball` / `basketball_guard`; family ATHLETE; level L3 (college, 3-5 years; ability checklist clean); athlete ladder; phase OFF (13 weeks to the season, plan 6 weeks); skeleton ATHLETE_OFF_6; week layout from 05 `athletic` 4-day (A, B, optional, A, B, optional, off) placed on Mon / Tue / Thu / Fri with Saturday as the optional block; client family `athlete` (constraint band 1-2 on athletic slots and main lifts); high-amplitude jump target in the top tier for basketball (INFERRED); medball 8 lb for passes and rotations (coach default), 6 lb as the quality step-down; Power Clean allowed (coached a little, landing control clean). This mirrors worked example B in `11_training_variables.md` 3.13.
