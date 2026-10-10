# Glossary

This page lists every term the Blaze Camp model uses, in alphabetical order, with a plain definition. It covers two kinds of words: the ones coach Lalo Vera uses (in his sheets and in his answers) and the ones the team added to turn his system into data. Where a word comes from his sheets, his exact label is shown as he wrote it, next to the corrected spelling the model uses. Each entry gives the answer id that decided it and, where it helps, the data key and a page to read next. Spanish version: [glossary.es.md](glossary.es.md).

## How to read this page

| Mark | Meaning |
|---|---|
| **Bold term** | The name the model uses, with correct spelling. |
| 'Single quotes' | His label exactly as written in his sheets. His spelling is kept ('TRIPPLE', 'SAGITAL', 'ABdution'). |
| "Double quotes" with an answer id | His own words from an answer or from conversation. Double quotes with no id are only a name, a title or the long form of an abbreviation. Wording that comes from a proposal he approved is called "approved wording", not his words. |
| `code` | An id as it appears in the data files. |
| `CAT-01`, `VOL-09` | A round-1 answer ([coach_answers_full.md](../../coach_answers_full.md)). |
| `R2-…`, `R3-…` | A round-2 or round-3 answer ([round 2](../../coach_answers_round2.md), [round 3](../../coach_answers_round3.md)). The newest round wins. |
| "conversation" | Something he said while the model was built ([coach_chat_statements.md](../../coach_chat_statements.md), [coach_answers.md](../../coach_answers.md)). |
| **OBSERVED** | Read from his sheets. |
| **PROPOSED** | Designed by the team. He has not confirmed it. |
| **INFERRED** | The team's reading of his sheets or answers. Treat it like PROPOSED. |
| **RETIRED** | Removed by one of his answers. Do not rebuild it. |

Some words have more than one meaning (block, level, zone, family, phase). Those entries list every meaning.

---

## A

**A-drills** ('A March/ A skips/ A runners'). Running warm-up drills: A March, A Skip, A Run. They are warm-up on lower-body and athletic days. They never count as training volume (ORD-08).

**A/B weeks**. Two alternating weeks that swap the lead lift: a squat-led week and a hinge-led week, or a bench week and an overhead week. Used only when a person wants more variety (PER-03). Intake switch: `prefs.variety_ab`.

**'ABdution'**. His label for the side-raise slot under 'Shoulders/Traps'. Correct spelling: abduction. Side raises, upright rows, rear-delt work and KB face pulls all live there, and all count to the one **shoulders** group (LIB-16, R2-LIB-04, R3-VOL-01).

**Access profile** (equipment profile). Where the person trains and what they have: `FULL_GYM`, `BASIC_GYM`, `HOME_BARBELL`, `HOME_DB_BENCH`, `KB_ONLY`, `BODYWEIGHT`, `HOTEL_GYM`, `FIELD_TRACK_KIT` (EQ-01). There is no bands profile. See [equipment](../02-model/equipment.md).

**Accessory, the**. See **The work / the accessory / the nuance / the survival**.

**Acclimation** (`ACCLIMATION`). The label for the first weeks of a plan, "you getting used to the movements" (PER-01). It is a label only. It does not cap the weekly step (the old 3 % cap is RETIRED, R2-PER-03). Which weeks carry the label is PROPOSED.

**Activity**. One of the 26 choices under "Stay athletic and active" (pickleball, HYROX, running, rec leagues and so on). Each points to a profile. A person may pick up to two (PROPOSED). See [stay athletic and active](../02-model/stay-athletic-and-active.md).

**Adaptation** (check-in adaptation). RETIRED. The plan no longer changes from feedback. See **Check-in**.

**Advanced**. Two different things. (1) An exercise level: the load sits behind the body or overhead, or the skill and stability demand is high (CAT-04). (2) Client Level 3. His definition of an advanced client is not given, so the model's definition is PROPOSED. See **Level**.

**Aerobic colours**. His names for aerobic sessions, from his 'AEROBIC CAPACITY CHEAT SHEET': **Blue** (A) short and high intensity, **Green** (B) moderate, **Orange** (C) long and easy, plus **lactate clearance** (LC, written 'LACTATE CLERANCE'). Never the same colour twice in a week (OBSERVED), except the approved second easy Orange for aesthetics clients (R2-SES-06).

**Aesthetics**. His word for the muscle and physique goal (bodybuilding style). Goal code `muscle`, template family `aesthetics`.

**Age overlay**. A set of age rules laid on top of a profile: `active_aging_60plus`, `active_aging_50plus`, `youth_general_athletic`, `youth_athlete`. He goes "mainly by age, foundation, goal, and injuries", never by sex (ATH-09).

**Alternating**. One side works, then the other, rep by rep (alternating DB press, alternating lunges). It counts like unilateral work (UNI-07).

**AMRAP**. "As many reps (or rounds) as possible." Not a default. 40-rep and AMRAP sets appear only inside HYROX station circuits or in an optional CrossFit-style workout (VOL-11, R3-ATH-03).

**Ankle hops** ('JUMPING ANKLE'). Low hops with little knee bend. Pattern code `ANKLE`, bucket `AP_JUMP_LIMITED_KNEE`. Off by default from age 60 (R3-ATH-02).

**Anterior oblique system** ('ANTERIOR OBLIQUE SYSTEM', code `AOS`). One of the sling-system columns of his library: chops and anti-rotation work (OBSERVED). In the model these exercises fill core slots (INFERRED).

**AP: Athletic patterns** ('ATHLETIC PATTERNS'). The family of exercises that train a quality (speed, power, reactivity, change of direction), not a muscle: jumps, throws, Olympic lifts, sprints, change of direction. They are counted in contacts, throws, cuts, reps or metres. They never count as muscle sets (VOL-10).

**Athletic block**. The part of a session with jumps, throws, agility and sprints. A person or coach can switch it off for a day (R3-SES-02).

**Athletic budget**. How much athletic work a profile gets in a week: jump contacts, throws, cuts, sprint metres, Olympic sets. The plyometric share is approved by sport. Most of the other amounts are PROPOSED or INFERRED. Derived value `D11`.

**Axial load**. Load that goes down through the spine. In his words, the squat pattern is "a lot of loading, also axial, meaning on your spine" (PER-04). The model allows one heavy squat day and one heavy deadlift day a week, on different days. See **Spine day**.

## B

**Ballistic** ('BALLISTIC PURPOSE - BE EXPLOSIVELY & FAST'). Explosive work with a longer ground contact or one big effort: squat jumps, box jumps, broad jumps, loaded or hex-bar jumps, medball throws, KB swings (R2-ATH-02, R2-VOL-05). The opposite end is **plyometric**. "The longer they're on the ground, the less it is going to be plyo, so it's more of a ballistic movement" (CAT-10).

**Bands**. Not used. "I don't do bands" (EQ-01). No band, chain or weight-releaser exercise, swap or equipment token can reach a plan. The band and chain items in his sheets are kept in the source catalog as `out_of_scope` records. They are never picked and never reach the compiled catalog. See **Variable resistance**.

**Bank** (banking). The stairway grows in small percentages, so a week's increase is often less than one set. The fraction is saved ("banked") and a whole set is added when the bank reaches 1 (VOL-06). The tool does this math. The person never sees a percentage.

**Big muscles** ("bigger muscles"). Quads, glutes, hamstrings, lats and upper back, chest (CAT-02). Big muscles are organized by movement pattern and take a mix of rep ranges, about 5 to 15.

**Bilateral**. Both arms or both legs work together.

**Bilateral symmetrical** ('BILATERAL SYMMETRICAL'). His label for lifts where both sides do the same thing at the same time in an even stance: squat, deadlift, bench press. He uses them "for driving and creating forces" (UNI-02). Powerlifting and bodybuilding are "more bilateral, symmetrical movements" (CAT-13).

**Bilateral : unilateral share** (the slider). The share of lower-body knee- and hip-dominant compound sets that are bilateral. It slides from 90/10 to 10/90 by athlete, season phase and pain (UNI-02). Leg flexion, leg extension and isolation are not counted in it (INFERRED). Derived value `D10`. See [bilateral and unilateral](../02-model/bilateral-unilateral.md).

**Biomechanics**. Not a bucket of exercises. It is "just the definition of the whole thing" (CAT-03): the description every exercise carries (plane, laterality, load position, stance, range of motion, zone).

**Block**. Three meanings.
1. **Training block**: the whole plan period, a stairway of 8 or 12 weeks (or a short 4 to 6 week one). A block is completed. Nothing is inserted in the middle (R2-VOL-07).
2. **Exercise block**: a stretch of 4 to 6 weeks inside a training block where the exercises stay the same (PER-02). A 12-week plan has three: weeks 1-4, 5-8, 9-12 (this layout is PROPOSED).
3. **Session block**: one part of a day (warm-up, core, athletic, Olympic, strength, accessories, conditioning). Session blocks have ids and most can be switched off (R3-SES-02).

**Block id**. The stable name of a session block, so an edit can apply to that day every week. Format (PROPOSED): `blk.<weekday>-<day type>.<kind>.<n>`, for example `blk.mon-a1.strength.1`.

**Block switch** (toggle). The on/off control on a session block. "They should be able to turn off that day's athletic training or that day's core training and just focus on resistance" (R3-SES-02).

**Bonus exercise**. A short extra exercise (2 sets, PROPOSED) for a small muscle that has no room left on its normal day. It goes on the optional day, or on a day that already trains that muscle. It is never the only exercise for that muscle that day (VOL-07, R3-VOL-03).

**Bootcamp**. Timed circuits: 3 to 5 rounds of 30 to 50 seconds per station, 5 to 7 stations, 35 to 45 minutes in total (PRG-03).

**Bucket**. A named category that a template station draws exercises from, for example `RP_BKD` (bilateral knee dominant) or `ISO_CALF`. Same idea as his CATEGORY column.

**Buy-out** ('Buy out'). A short, hard conditioning finisher at the end of a session, for example '2x 15 cal bike sprint' (OBSERVED in his baseball program, Part E). It never counts as muscle sets. It is removed in an easy week (PER-05). Bucket `COND_SPRINT_BUYOUT`.

**BYOP**. Short for his workbook 'BUILD YOUR OWN PROGRAM - BLAZE CAMP MODEL'. Its 'MASTER EXERCISE LIBRARY' tab is the single source of truth for exercises (CAT-07).

## C

**Calves rule**. One calf exercise × 3 sets on every leg day (VOL-17, R3-SES-01). The model never adds a second calf exercise that day (INFERRED).

**Cap**. See **Ceiling**.

**CATEGORY**. A column in his program sheets: the list an exercise is chosen from ('Bilateral KD', 'Horizontal Pull'). With PURPOSE it makes a **slot**.

**Ceiling** (cap). The most weekly sets a muscle group reaches in one plan: 14 / 22 / 25 for Level 1 / 2 / 3. "This is all customizable" (R2-VOL-06). A Focus muscle may go to 18 / 26-28 / 30. Those are the priority-muscle ceilings he approved in R2-VOL-06. Using them for Focus muscles is the team's reading (INFERRED).

**Check-in**. RETIRED. A weekly report of effort and pain that changed the next week. "We're not going to have check-ins, correct? I want to take away all check-in info. We're only doing outputs, and people can change accordingly" (R3-VOL-02). See [ADR-001](../04-decisions/adr-001-answers-in-plan-out-no-check-ins.md).

**Circuit**. Several stations done one after another for rounds, by time.

**Clean family / snatch family**. The two main Olympic lift families. The model puts cleans on knee (squat) days and snatches on hip (hinge) days. That is the team's reading (INFERRED) of his words: "Some days are about cleans, and some days are about snatches or snatch style ... I take snatches a little bit more hingy than squatty" (R2-ATH-04). Jerks may go on either day (INFERRED).

**Client level** (Level 1, 2, 3). How much training a person is ready for. It sets starting sets and ceilings. It is separate from exercise level (CAT-06). See **Level**.

**Coach count**. The model's way to count sets: main mover 1.0, helpers 0.25 (VOL-09). The plan is steered by this count.

**COD**. Change of direction: planned cutting and turning drills. For every athlete, tiered by turn angle from easy to hard (ATH-06).

**Complex**. Two or more moves done back to back as one station. Complexes are in the catalog but the first engine does not select them.

**Compound**. A lift that moves more than one joint (squat, row, press). Opposite: **isolation**.

**Conditioning**. Aerobic sessions, buy-outs, circuits and WODs. It comes last in a session, except a fighter's or hybrid athlete's opening aerobic block (ORD-09). It never counts as muscle sets.

**Constraint** (constraint scale 1-5). How much the set-up guides and supports the body. 5 = seated machine with a back pad. 4 = plate-loaded machine, Smith, chest-supported. 3 = cable, or a dumbbell on a bench. 2 = standing free weights. 1 = bodyweight, ballistic, reactive (EQ-13). More constraint is safer, so older, injured and high-volume clients "collect that volume in a safe place with more constraints" (EQ-03).

**Contacts** (foot contacts). The unit for jumps: one landing is one contact.

**Contralateral** ('GET INTO THE HIP'). The weight is held on the side opposite the working leg. "Contralateral exercises are usually to pull me into the hip" (CAT-13). Used most for change-of-direction athletes. Opposite: **ipsilateral**.

**Contrast** (French contrast). A heavy lift followed at once by a jump. For Level 2+ athletes, off-season only, heavy lift at about 78-85 %, no rest inside (ATH-12).

**Control patterns** (CO; 'CONTROL PATTERNS'). The core family. Three segments: **CT** core thorax (the trunk moves on a still pelvis), **CP** core pelvis (the pelvis and legs move on a still trunk), **CB** both at once. Each can be done in any plane (CAT-08).

**Core block** (core opener). 2 core exercises × 2 sets, short of failure, right after the warm-up. "Ideally, start with the core work that'll give you a good warm-up" (ATH-11). The person may move it or switch it off. The generator never leaves it out. Core supersets may be added anywhere (R2-SES-03).

**Credit**. How much one set counts toward a muscle's weekly total. Main mover 1.0, each helper 0.25: "I would suggest a 0.25 to the helpers, not a 0.5" (VOL-09). Exceptions: dips 0.5 triceps + 0.5 chest (LIB-16); thruster 1.0 quads + 0.5 shoulders + 0.25 glutes; hip thrusts and bridges 1.0 glutes (R2-VOL-05).

**Credit class**. The data code that carries an exercise's credits, for example `HPUSH` (chest 1, triceps 0.25, front delts 0.25) or `ATHLETIC` (nothing). Key: `model/rules.json > credit.classes`.

**Cross pattern**. A day that pairs a knee lift with a hip lift (squat + single-leg RDL), so both patterns are covered with less soreness. Default for bootcamp, fat loss, general fitness and most athletes (UNI-06, R3-SES-01). Opposite: **same pattern**.

**Cue**. A short coaching instruction for an exercise, in his voice (GEN-07). Only his own words are used. A cue is never written for him.

## D

**Davidson zone** (Z1, Z2, Z3). A position tag he takes from Dr. Pat Davidson's book *A Coach's Guide to Optimizing Movement*. Zone 1: standing, arms low, load low and close (external-rotation bias). Zone 2: hands in front, or the knee at hip height (internal-rotation bias, more compressive). Zone 3: arms overhead or a deep squat (external-rotation bias). It is a tag, not a level. The plan keeps both biases every week and uses the bias to pick a swap when something hurts (CAT-04, CAT-10, R2-LIB-02, R2-LIB-03). Zones do not apply to plyos. See [levels and zones](../02-model/levels-and-zones.md).

**Default pick**. The exercise the plan puts in a slot before the person swaps it. Only library exercises (and items he approved) can be the default (CAT-07). The person can always swap inside the same category (GEN-04).

**Deload**. See **Easy week**. There is never a deload inside a block (R2-VOL-07).

**Depth drop / depth jump**. Stepping off a box and sticking the landing (drop) or rebounding at once (jump). Heights: low 6-12 in, medium 12-18 in, high above the hip (EQ-16). Depth jumps are off by default from age 60.

**Derived values** (D1-D15). What the generator works out from the intake before it builds the plan: family, profile, client level, season phase, plan shape, week layout, constraint band, kit, start sets, bilateral share, athletic budget, planned step, test weeks, aerobic sessions, time fit. Key: `generator_spec_v1.json > derived_values`.

**DORMANT**. Sheet content that is kept on file but never used by the generator. Today that means variable resistance: the band and chain items of his sheets, kept as `out_of_scope` records (EQ-01, EQ-12).

**Dose unit**. What an exercise is counted in: sets and reps, contacts, throws, cuts, metres, seconds, calories.

**Drive** (`DRIVE`). The label for the middle weeks of a stairway, "driving it hard, not all the way to the top" (PER-01). A label only.

**Dryland**. A swimmer's gym training. Approved defaults in R3-ATH-01. See [swimming](../02-model/swimming.md).

## E

**Easy week** (recovery week). One week after a finished block at about half the sets of the hardest week, same exercises, 3 or more reps in reserve, no buy-outs or finishers (PER-05, R2-VOL-07). It is a recommendation, not a requirement: "maintenance weeks are a recommendation. They don't have to be mandatory" (R3-PER-01). It never sits inside a block.

**Effort**. How hard a set is. The model writes it as reps in reserve with the RPE number beside it. See **RIR**.

**EFFORT menu**. The dropdown in his sheets: '1 - Way Too Easy', '2 - Way Too Easy', '3 - Too Easy', '4 - Easy', '5 - Easyish', '6 - Broke a Sweat', '7 - That was tough', '8 - That was perfect', '9 - That was terrible', "10 - I'm done". He reads 10 as "That was the max I can do, not a fail" (R2-VOL-02). Today it is only a column in the downloaded sheet for the person's own notes. The tool never reads it back (R3-VOL-02).

**Engine**. The code that turns one intake into a plan (`engine/`). It is being rebuilt. The model is the authority, not the engine. See [ADR-048](../04-decisions/adr-048-optimizer-rebuild-of-the-planner.md).

**Event date**. An optional date for a stay-active person (a first HYROX race, a pickleball tournament, a 10K). The hardest weeks end 1 week before it, followed by 1 easy week at about half the sets (R3-ATH-05).

**Evidence label**. The tag on every rule that says where it came from: a coach answer id, OBSERVED, SCIENCE, INFERRED, PROPOSED, RETIRED, DORMANT. See [ADR-047](../04-decisions/adr-047-authority-order-and-evidence-labels.md).

**Exercise block**. See **Block**, meaning 2.

**Exercise class**. A coarse type of exercise in the catalog: `compound`, `isolation`, `athletic`, `control`, `conditioning`, `warmup`, `mobility`.

**Exercise level**. How hard a movement is to do well: foundational, intermediate, advanced. See **Level**.

**Exposure**. One time in the week that a pattern or lift is trained. The second exposure of a slot in a week uses a different exercise from the same category (PER-04).

## F

**Family**. Two meanings.
1. **Exercise family**: what quality an exercise trains. Athletic (AP), Resistance (RP), Control/core (CO), Cardio (CA), Functional (FN).
2. **Template family**: the kind of plan. `aesthetics`, `athletic`, `strength`, `fat_loss_bootcamp`, `hybrid_crossfit`, `no_equipment`.

**Fat burn**. His fat-loss example program ('EXAMPLE FAT BURNBODY TONING PRO'). Its circuits are finishers after lifting, not separate sessions (PRG-11).

**Field athlete**. An athlete from a field or court sport. Field athletes "don't need to get bigger and stronger that much" and keep more unilateral work (UNI-02). Their off-season sessions hold up to 12 exercises plus the 2 core exercises (R2-SES-04).

**Fill policy**. How a muscle gets its sets in the data: `target` (the plan adds direct sets to reach the start), `credit` (helper credit only), `floor` (reported, never filled), `core_block` (set by the core opener).

**Finisher**. Conditioning at the end of a session: buy-outs, fat-burn circuits, HYROX station circuits. Finishers never count as muscle sets.

**Floor** (floor of 10). Every muscle group a training block trains directly gets at least 10 sets a week. "I don't think anybody needs less than 10 sets a week per muscle" (R2-VOL-06). It is counted on focus groups (R3-VOL-01). It does not apply to a group the time check leaves to compound credit (R3-SES-02). The model also leaves out maintenance, pre-season, in-season and a group cut for pain. Those four exemptions are INFERRED: they were in the team's R3-VOL-01 proposal, and his answer spoke only about rear delts. See [ADR-017](../04-decisions/adr-017-floor-of-10-on-focus-groups.md).

**FOCUS**. Three related things. Do not mix them up.
1. **FOCUS headers**: the muscle headings of his library's Focus list ('QUADS', 'HAMSTRINGS', 'GLUTES', 'CHEST', 'BACK', 'SHOULDERS/TRAPS', 'BICEP', 'TRICEP', 'CALVES', 'CORE').
2. **'Focus 1' / 'Focus 2' slots**: two open slots on an optional day. Both may train the same muscle, 2-3 sets each (ORD-11).
3. **Focus muscle 1 / Focus muscle 2**: an intake choice. See below.

**Focus group**. The unit the model counts on: quads; **hips** (glutes + hamstrings); back; chest; **shoulders** (front + side + rear delts); biceps; triceps; calves; core. The floor of 10, the rule of 2 to 4 exercises and the time check all count focus groups (R3-SES-01). Key: `generator_spec_v1.json > vocab > muscles > focus_groups`.

**Focus muscle 1 / Focus muscle 2**. Up to two muscles a person picks to get more work. Each gets "an extra set or two or three" a week on top of a balanced plan: "There could be a main focus muscle 1 and a main focus muscle 2, and that should be enough for the whole thing" (R3-SES-01). The default of +2 is PROPOSED. See [ADR-024](../04-decisions/adr-024-focus-muscle-1-and-2.md).

**Foundational**. The easiest exercise level: the load is in front of you or low (goblet squat). "People need to learn how to be more upright" (CAT-04). A seat, machine or cable makes a lift easier (CAT-04, R2-LIB-02).

**Frontal plane**. Side-to-side movement (lateral lunge, Cossack squat, lateral step-up). Court and combat athletes get more frontal and transverse single-leg work (UNI-12). The share numbers are PROPOSED.

**Full-body day**. A day that trains lower and upper body. Every group trained that day still gets 2 to 4 exercises, never 1, "so it might be a little longer day" (R2-SES-05).

**Functional** (FN; 'FUNCTIONAL BIOMECHANICS SYSTEM'). Carries, drags and the sling systems ('ANTERIOR OBLIQUE SYSTEM', 'POSTERIOR OBLIQUE SYSTEM', 'LATERAL SUBSYSTEM'). The carry, drag, posterior-oblique and lateral columns are empty in his sheets and are to be built out (LIB-19). The anterior-oblique column already holds chops and anti-rotation work (OBSERVED). Carries and drags earn no muscle sets (INFERRED).

## G

**Game-heavy sport**. A sport whose games already supply jumps and sprints: basketball, volleyball, soccer, football, hockey (R2-ATH-07), plus lacrosse, field hockey, rugby, ultimate, flag football and beach volleyball (R3-ATH-04). In season, gym plyos drop to about half and the one hard gym day sits at least 48 hours before a game.

**Generator**. The tool that takes a few answers and gives the whole plan. In his words it should "kick out a program" (R3-VOL-04).

**Get into the hip / get out of the hip**. His names for contralateral and ipsilateral loading. See those entries.

**GHD**. Glute-ham developer. It has no level (LIB-08). Use it "if they're available and if they feel good doing them" (EQ-11).

**Goal**. The main choice in the intake: `muscle`, `strength`, `athletic`, `active` (stay athletic and active), `fat_loss`, `general`, `hybrid`.

**Ground-contact time**. How long the foot stays on the ground in a sport's key actions. It sets the plyometric share: short contacts mean more plyos, long contacts mean more ballistics (ATH-01). The model sorts sports into classes 1 (very short) to 5 (very long). The share for each sport is approved (R2-ATH-01, R3-ATH-04). The class labels and contact times are INFERRED.

**Group credit**. A set counts at most 1.0 toward a focus group, even when it credits two member muscles (a face pull is one shoulder set, not 1.25). PROPOSED.

## H

**Halfway week**. The week where the stairway's steps get bigger: week N/2, rounded up (the rounding is PROPOSED). Week 6 of 12, week 4 of 8.

**Hard set**. The unit of volume: a working set of 5 to 30 reps that ends 1 to 3 reps short of failure (VOL-13). Warm-up sets do not count.

**Hardest** (`HARDEST`). The label for the last weeks of a stairway. "On a 12-week program, the last 4 weeks are going to be brutal" (R2-PER-04).

**Health check**. A short set of questions before a plan is built. Five answers stop the automatic plan and refer the person to a professional: chest pain or heart issues; surgery or a fracture in the last 6 months; pregnant or gave birth in the last 6 months; an injury under treatment; a doctor said no (R2-GEN-03). The final text will be written by a lawyer in English and Spanish, with a link to the official PAR-Q+ (R3-GEN-01). A coach may skip it with a legal warning.

**Helper**. A muscle that assists the main mover. It gets 0.25 of a set (VOL-09).

**Hinge**. Bending at the hips with little knee bend: deadlift, RDL, back extension. His word is "hip dominant".

**Hip dominant** ('BILATERAL HIP DOMNANT', 'UNILATERAL HIP DOMINANT'). The hinge and bridge pattern. Codes `BHD` (bilateral) and `UHD` (unilateral). Counts 1.0 to hamstrings and 0.25 to glutes, except hip thrusts and bridges, which count 1.0 to glutes (R2-VOL-05). Leg curls are not hip dominant (CAT-09).

**Hips**. The focus group made of glutes + hamstrings. An RDL, a hip thrust and a leg curl are three hip exercises (R3-SES-01).

**Horizontal / vertical**. The direction of a push or pull. Rule: horizontal before vertical. Row before pulldown, horizontal push before vertical push (ORD-01). Exception: the day's main lift ("the work") goes first even when it is vertical (ORD-02).

**HOW IT FELT? menu**. The dropdown in his sheets: 'Felt the RIGHT muscles', 'Felt the WRONG muscle', 'Felt a PAIN', "Couldn't do it". Like the EFFORT menu, it is now only a column in the downloaded sheet. The tool never reads it.

**Hybrid**. The goal and template family for CrossFit-style training (`hybrid`, `hybrid_crossfit`).

**HYROX**. A fitness race: 8 runs of 1 km, each followed by a workout station. He said it as "high rows" and confirmed the meaning in R3-ATH-03. Plan: 2 strength days + 2 hybrid days, 4 cardio sessions, 2 short station circuits a week as finishers.

## I

**Implement**. The tool used: barbell, dumbbell, kettlebell, medball, cable, machine, bodyweight. When a name has no implement, the default goes bodyweight → dumbbell → barbell as the level rises (EQ-09).

**In-season**. The competition part of an athlete's year: about 2 gym days a week, low volume, bilateral work kept minimal (PER-08, UNI-10). The model keeps it flat, with no stairway. That is the team's reading (INFERRED) of "I just want them to maintain their strength" (UNI-10).

**INFERRED**. The team's reasoning from his sheets or answers. A default until he confirms it.

**Intake**. The answers a person gives before the plan is built. Few inputs on purpose: "We're not going to need a lot of inputs for this" (R3-VOL-04). Nothing is asked after the build.

**Intensifier**. A way to make a set harder without adding a set: a MYO set, a MAX last set, a superset. Allowed in the last week of a stairway (R3-VOL-04).

**Intermediate** ('INTERMIDIATE', 'MODERATE'). The middle exercise level: the load is close to and on the body (barbell front squat) (CAT-04). Also client Level 2.

**Ipsilateral** ('GET OUT OF THE HIP'). The weight is held on the same side as the working leg. It helps the body out of the hip, for example ipsilateral step-ups for a sprinter's acceleration (CAT-13). Opposite: **contralateral**.

**Isolation**. A lift that moves one joint (curl, side raise, leg extension). Default 2 sets (VOL-16).

## J

**'JUSTICE LEAGUE'**. A tab name in BYOP. "This was just a marketing name" (ATH-13). The program is for non-competitive, all-around athletic adults. He asked for names that are "general and understandable" (FIX-03). The team's name for it is Athletic Performance - Non-Competitive (PROPOSED). Profile `weekend_warrior`.

## K

**KB swing**. Kettlebell swing. It is ballistic work, not muscle work: "kettlebell swings are not glutes" (R2-VOL-05). It earns 0 muscle sets and never fills a hip-dominant slot.

**Kit token**. One piece of equipment as the data names it (`dumbbell`, `rack`, `cable`, `medball`). Band tokens are banned.

**Knee dominant** ('BILATERAL KNEE DOMINANT', 'UNILATERAL KNE DOMINANT'). The squat and lunge pattern. Codes `BKD` and `UKD`. Counts 1.0 to quads and 0.25 to glutes (UNI-01, R2-VOL-05).

**Kong row** (said "con row"). A double-kettlebell row from the floor in a hinge stance. For people with shoulder or back pain. It does not create much stimulus (LIB-09).

## L

**Lambda** (λ). A scale factor between 0 and 1 on a group's weekly steps. It shrinks the steps when the standard 3 % and 5 % would pass the ceiling early, so the group reaches its ceiling in the last week. The idea is approved (R3-VOL-04).

**Landing drill** (stick the landing). Jumping or stepping down and holding the landing. It is the "receive" stage of plyo training. On by default from age 60 (R3-ATH-02).

**Laterality**. Whether an exercise is `bilateral`, `unilateral` or `alternating`.

**Leg flexion** ('LEG FLEXION'). Leg curls, Nordics, slider and ball curls. Its own segment, "kind of like bicep curls", not hip dominant (CAT-09). Counts 1.0 to hamstrings. Node `RP.LF`, pattern code `KFLEX`.

**Lens**. One way of looking at an exercise. His lenses: bigger muscles, smaller muscles, biomechanics; athletic patterns, resistance patterns, core (conversation). Every exercise is tagged on all lenses at once (CAT-01).

**Level**. Four meanings. Do not mix them up.
1. **Exercise level**: foundational, intermediate, advanced. It comes from skill, stability and where the load sits, made easier by a seat, machine or cable (CAT-04). Levels add options and never remove them (CAT-05). "The levels are still very theoretical."
2. **Client level**: Level 1 (novice = newby: less than a year of consistent training, or back after 6-12 months off), Level 2 (more than a year), Level 3 (PROPOSED: 3+ years and 4+ days a week now, or a competitive physique or strength athlete) (PRG-05).
3. **Stair level**: the number 2 to 11 shown for each week. See **Stair level**.
4. **'LVL'** in his CrossFit tab (levels 1 to 4, for example 'LVL 3 = 5 SETS x 5', OBSERVED): the dose tiers of that program (INFERRED).

**Library**. The 'MASTER EXERCISE LIBRARY' tab of BYOP: the single source of truth, "as far as I was able to take it so far" (CAT-07). See [exercise library](../02-model/exercise-library.md).

**Line**. One row of the volume table that the stairway runs on: quads, hamstrings, glutes, chest, back, shoulders, biceps, triceps, calves. Glutes and hamstrings are two lines inside the one hips group.

**Load position**. Where the weight sits: at the sides, goblet, zercher, front rack, high back, low back, overhead. It drives the exercise level (CAT-04).

**Load-velocity**. His rule that speed and load trade off: "The heavier I go, the slower I'm going to be. The lighter I go, ideally, the faster I can be" (conversation). So throws use light medballs, 8-10 lb.

**Locked rule**. A rule the generator can never break (never to failure on heavy compounds, no V-squat, no bands and so on). Ids `LK01`-`LK18` in `model/rules.json > locked`, checked as `H01`-`H22`.

## M

**Machine**. Equipment with many reference points: you sit, your feet are on the ground, you move your hands or feet. You can push hard and it is safer (conversation). Machines are not ranked: "I don't want to rank them because they have different brands, angles" (EQ-11).

**Main mover** (prime mover). The muscle that does most of the work in a lift. It gets 1.0 set (VOL-09).

**Maintenance phase**. A plan of its own at lower volume, about 50-70 % (PER-01), for vacation, travel, a season change or after a block. The person picks how many weeks (R2-PER-06). It is flat and has no floor of 10 (both INFERRED). It is never placed inside a training block (R2-VOL-07).

**MAX** ('MAX REPS'). Technical failure: as many good reps as possible. Only on small-muscle or bodyweight work (VOL-13). The model keeps it to the last set (INFERRED). Never on heavy compounds (GEN-08).

**Medball**. Medicine ball. Light for speed: passes and rotations 8-10 lb, overhead throws 6-10 lb, sit-up throws 6-8 lb, slams 10-20 lb. Nothing over 20 lb (EQ-06). No medball in a bodybuilder's main workout (ATH-05).

**Minimum climb**. The least a trained group must grow across a block: 2 sets from week 1 to the last week (calves 1). PROPOSED.

**MM**. Short for his second workbook, 'BLAZE CAMP MASTER MODEL'.

**Model**. The data and documents that describe his system: categories, catalog, rules, templates, profiles. Different from the **engine**, which is code.

**Modifier**. A factor that scales starting sets for a goal or phase, for example 0.8 for general fitness. Almost all factors are PROPOSED.

**Monster set**. His spoken word for stringing several exercises together back to back, more than the two of a superset (R2-SES-03). He did not define a number.

**MYO set** ('LEG PRESS MYO - 15-5-5-5-5-5'). One long set with short pauses: 15 reps, then mini-sets of 5. Only on the last exercise of the day, and only on a machine or isolation exercise (VOL-15). The model counts it as 2 sets (INFERRED).

## N

**'NO ACCESS'**. The name of two hidden tabs. It means a self-serve version without coach access, using the full gym library. It does not mean that the person has no equipment (R2-LIB-08).

**Node**. One place in the category tree, with a stable id such as `RP.KD.BS` (resistance, knee dominant, bilateral). 91 nodes. Key: `synthesis/01_taxonomy.json > nodes`.

**Novice / newby** ('NOVICE', 'NEWBY'). The same thing: client Level 1 (PRG-05).

**Nuance, the**. See **The work / the accessory / the nuance / the survival**.

## O

**OBSERVED**. Read from a cell, tab, colour or dropdown in his sheets.

**Off-season**. The part of an athlete's year far from competition: most volume, stairway blocks.

**Olympic lifts**. Cleans, snatches, jerks and their dumbbell, kettlebell and hang versions. "Everyone gets Olympic lifts" in athletic training (ATH-10): beginners use DB/KB snatches, hex-bar jumps and hang pulls, more advanced athletes the full lifts. Up to 4 days a week (R2-ATH-04). Explained as power output, not percentages (R2-GEN-06). Off by default from age 60 (R2-ATH-08).

**One-detail variation**. A library exercise with one detail changed: which hand holds the weight, grip, stance, implement or range. Shown, for example, as *Reverse lunge - dumbbell in opposite hand* (approved wording). Allowed between exercise blocks. The tool never invents an exercise (R2-LIB-01).

**Optional day** ('OPT'). An extra day for Calves, Cardio, Core, Focus 1 and Focus 2. Ideally a separate day, "so they don't get in the way" (ORD-10).

## P

**Pain protocol**. For pain declared at intake: cut that muscle or pattern 30-50 %, move it to machines or split grips, "and maybe even drop the exercise altogether if it's too much" (VOL-03). Severe pain stops the automatic plan (PROPOSED: the team's extension of the health-check rule).

**Pairing**. Which lower lift goes with which upper lift in a mixed session: hip dominant with a push, knee dominant with a pull (UNI-11, ORD-06). The back of the lower body goes with the front of the upper body, to "keep as far away as I can from bleeding over".

**PAR-Q / PAR-Q+**. The Physical Activity Readiness Questionnaire. He said it as "park queue" (R2-GEN-03). The model links to the official PAR-Q+ and uses its own short health check, written by a lawyer in English and Spanish (R3-GEN-01). The reason given in the proposal he approved: the official PAR-Q+ is copyrighted, must be used unchanged, and the team found no Spanish version listed. A lawyer should confirm this.

**Pattern**. The movement an exercise belongs to: knee dominant, hip dominant, horizontal push, vertical pull and so on. Big muscles, athletic work and core are organized by pattern.

**Pattern code**. The short data code of a pattern: `BKD`, `UKD`, `BHD`, `UHD`, `KEXT`, `KFLEX`, `HPUSH`, `VPUSH`, `HPULL`, `VPULL`, `SHLD`, `BIC`, `TRI`, `CALF`, `CT`, `CP`, `CB`, `PLYO`, `ANKLE`, `THROW`, `TX`, `COD`, `SPRINT`, `CARDIO`. Full table at the end of this page.

**Phase**. Several meanings.
1. **Stairway phase label**: `ACCLIMATION`, `DRIVE`, `HARDEST`.
2. **Season phase**: off-season (early, build, late), pre-season, in-season, post-season.
3. **Rep phase**: VOL 1, VOL 2, VOL 3.
4. **Maintenance phase**: see that entry.

**Pinned group**. A group the time check never drops for a given person. Example: calves for racket players from 50, who get calf and Achilles work every leg day (approved wording, R3-ATH-02). The pinning mechanism is PROPOSED.

**Plan**. The output: every week, day, block and exercise, with sets, reps, effort and rest. Built once and shown whole.

**Plan editing**. What a person or coach can change in the finished plan: switch off a day's athletic or core block, add or remove exercises or blocks, swap inside a category, take the suggested supersets (R3-SES-02). The mechanics are PROPOSED.

**Plan mode**. The type of plan: `fixed_12` (12 weeks, his preferred), `fixed_8`, `maintenance_4_6`, `year`, plus `season` for competitive athletes and `prep` for an event date. `week_by_week` is RETIRED as a mode.

**Plane**. The direction of movement: `sagittal` (forward and back), `frontal` (side to side), `transverse` (rotation), `multi`.

**Play days**. The days a stay-active person plays their activity. The hardest gym day stays at least 48 hours before the biggest play day (R3-ATH-05).

**Plyo share**. The share of a sport's jump and throw work that is plyometric by the end of a block: 75 %, 60 %, 50 %, 40 % or 25 % by sport. Each block starts 15 points more ballistic (R2-ATH-01, R3-ATH-04). See [sports](../02-model/sports.md).

**Plyometric** ('PLYOMETRIC PURPOSE - BE REACTIVE & BOUNCY'). Jumps with short, bouncy, repeated ground contacts: pogo and ankle hops, hurdle hops, depth jumps, bounds, squirrel jumps, repeated jumps (R2-ATH-02). Opposite end: **ballistic**.

**Pool**. The list of exercises that may fill a pattern (`generator.pools` on a catalog record).

**Position**. A playing position inside a sport (pitcher, lineman, goalkeeper). It can change the profile.

**Power**. Fast force. Rule: power before strength. Athletic and Olympic work come before heavy strength work (ORD-03).

**Pre-season**. A block of 4-6 weeks at about 60 % of off-season sets with more speed and power, ending with a 1-2 week taper before the first game (R2-PER-06).

**Prehab** (joint care). Small protective work for a known hot spot of a sport: shoulder care for swimmers (R3-ATH-01), calf and Achilles work for racket players from 50 (R3-ATH-02). In the engine it earns no muscle sets (PROPOSED).

**Prep**. A plan timed to a fight, meet or race date. Fights and meets use 2-week steps and waves (PER-10).

**Priority push**. An older, bigger version of the Focus muscle: +4 to +6 sets on one or two muscles (VOL-02). Today it is only an optional coach setting, off by default. The intake path is Focus muscle 1 and 2.

**Pro setting**. An optional setting, not a level. It lets one muscle of a very advanced lifter pass 30 sets a week. The idea is his: "Maybe we can add a pro level" (R2-VOL-06). The numbers (Level 3 only, up to 35) are PROPOSED.

**Profile**. The record for one sport, position, activity or goal. It holds that group's dials: plyo share, bilateral share, athletic amounts, aerobic sessions, Olympic policy, injury hot spots. 127 profiles. Key: `synthesis/04_profiles.json > profiles`.

**PROPOSED**. Short for "PROPOSED - PENDING COACH APPROVAL". The team designed it and he has not confirmed it. It ships only after his yes.

**PURPOSE**. A column in his program sheets: the muscle or quality a slot serves ('Quads', 'Back', 'Plyo'). With CATEGORY it makes a **slot**.

## R

**Rear delts**. Not a muscle of their own in the model. "I wouldn't categorize the rear delt as an individual muscle" (R3-VOL-01). They are part of the shoulders group, they also get work from back training, and people can always add more. The model keeps one rear-delt exercise in every week (PROPOSED). See [ADR-018](../04-decisions/adr-018-rear-delts-part-of-shoulders.md).

**Receive-Create stages** (RC1, RC2, RC3). His plyo progression. Stage 1 **Land**: receive and pause. Stage 2 **Land & Go**: receive, then create once. Stage 3 **Repeat**: receive and create again and again. "Your body and your connective tissue need to learn how to receive forces before we teach it how to create" (CAT-10). 12-week plan: weeks 1-3 / 4-7 / 8-12 (R2-ATH-03). His sheet wrote these as 'Receive pause/creat', 'Receive/create', 'Repeat receive create'. They are not Davidson zones.

**Refer**. The result when a health-check answer (R2-GEN-03) or severe pain (PROPOSED) stops the automatic plan. The person is sent to a professional.

**Release** (release stamp). The "use at your own risk" tick, with the terms and the liability release, accepted every time a plan is built (R3-GEN-01). The stamp is printed on the plan. Nothing is stored. See [DISCLAIMER.md](../../DISCLAIMER.md).

**Rep class**. The kind of dosing an exercise gets, for example `main_bilateral_compound`, `small_muscle_isolation`, `calves`, `olympic`.

**Rep phase** ('VOL 1', 'VOL 2', 'VOL 3'). Athlete rep ranges that change by off-season block: compounds 12-15, then 8-12, then 6-8 (PER-11).

**Reps notation**. '10/10' = 10 reps on each side = one set (UNI-01). '12/10/8 -20' = sets of 12, 10 and 8 with rising weight, then a light set of 20 (PRG-07). Reps are stored as text, never as numbers or dates.

**RETIRED**. A rule or feature one of his answers removed. It stays in the docs only so nobody rebuilds it.

**RIR** (reps in reserve). How many more good reps you could have done at the end of a set. His effort scale: "I like RIR in my model" (VOL-13). Every working set stays between 1 and 3 RIR. Across a plan the target drifts from 3, to 2, to 1-2, to 1 plus intensifiers in the last week (R3-VOL-04).

**Role**. What a station does in a session: `warmup`, `core_block`, `athletic`, `power`, `work`, `paired_upper`, `secondary`, `iso`, `focus`, `conditioning` and others.

**Rotation bias**. Whether a position favours external or internal rotation. It is what a Davidson zone describes. Both biases stay in every week (R2-LIB-03).

**RP: Resistance patterns** ('RESISTANCE PATTERNS'). The family of exercises that train a muscle. Counted in sets and reps per muscle.

**RPE**. Rating of perceived exertion, 1 to 10. Shown beside RIR: 3 RIR ≈ RPE 7, 2 ≈ 8, 1 ≈ 9, 0 = 10 (this mapping is PROPOSED). He asked for RIR to be explained and mixed with RPE (VOL-13).

**Rule pack** (coach rule pack). A file of a coach's own rules laid over the defaults. He asked for "options for a coach to add their own rules" (GEN-08). The format is PROPOSED and not built yet.

## S

**Sagittal** ('SAGITAL'). The forward-and-back plane.

**Same pattern**. A day that pairs two lifts of one pattern (squat + lunge) to drive a muscle harder. For aesthetics, strength and high-level athletes (UNI-06). Opposite: **cross pattern**.

**SCIENCE**. From published research. It fills gaps and checks his numbers. It never overrules an answer.

**SCORE**. In the sheet column 'WEIGHT USED or SCORE': times, rounds or distances for conditioning (PRG-08).

**Season type**. The model's label for how a sport's year runs (A game-heavy team, B diamond, C meet or championship, D combat with a date, and so on). INFERRED.

**Second-day option**. A squat that is fine on the second squat day if the person is not sore: goblet squat, hack squat, pendulum (approved wording, R2-SES-02).

**Segmentation**. His word for sorting exercises into buckets: "building the segmentation and the buckets from the ground up" (conversation).

**Self-adjust guide** ("How to adjust this plan"). The printed lines that tell a person what to do when a week is missed, a set felt like a true max, everything feels easy or something hurts. It replaces the check-in. "The program will tell you to adjust accordingly" (R3-VOL-04). The wording is PROPOSED.

**Set placement**. Where a new set goes when a group's weekly sets rise: the first exercise on the list, then the second (2/2/2 → 3/2/2 → 3/3/2 → 3/3/3 → 4/3/3). "I'm adding sets to the things that matter most" (VOL-07). When a day type runs twice a week the added set alternates between the two (R3-VOL-03).

**Shoulders**. The focus group made of front + side + rear delts. Traps are listed with it for display. One choice in the Focus muscle list (R3-VOL-01).

**Skill**. A block for CrossFit-style skill practice (double-unders, toes-to-bar). INFERRED.

**Sling systems**. See **Functional**.

**Slot**. One line of a session: PURPOSE × CATEGORY. The category gives the list of exercises. The purpose says which muscle or quality is credited. The second time a slot comes up in a week it gets a different exercise (PER-04).

**Small muscles** ("smaller muscles"). Biceps, triceps, side and rear delts, calves, forearms, abs (CAT-02). They are organized by muscle and take higher reps, about 12 to 30, because you can't go heavy on them (conversation, VOL-11). Since round 3, side and rear delts are counted inside the one **shoulders** group (R3-VOL-01).

**Spine day** (two spine days). A day with a heavy, counted spine-loading lift. One heavy squat day and one heavy deadlift day a week, never the same day (R2-SES-01). Counted: barbell back, front, zercher, overhead and Smith squats; barbell or trap-bar deadlifts and RDLs; good mornings. Not counted: leg press, belt squat, hip thrust, back extension, reverse hyper, single-leg DB work, Olympic lifts, loaded jumps (R2-SES-02). See [ADR-030](../04-decisions/adr-030-axial-loading-once-per-pattern.md).

**Split day**. A day that trains part of the body (push, pull, legs, upper, lower). Opposite: full-body day.

**Split grip**. Each hand holds its own handle: dumbbells, kettlebells, single handles. His instruction block says that with joint pain it helps to go unilateral or to move from fixed grips (barbells) to split grips (OBSERVED).

**Stair level** (2 → 11). The felt level of a week. "You might want to start at a 2 and end at an 11" (PER-01). It means how the week feels in total volume and loading, "not the amount of sets" (R2-PER-05). The display formula is PROPOSED.

**Stairway**. His shape for every plan. "It should be like steps up a stairway" (R2-PER-03): small steps in the first weeks, a bit bigger after the halfway point, the hardest weeks last. In numbers: about 3 % more sets a week to the halfway week and about 5 % after it (R3-VOL-04). See [stairway](../02-model/stairway.md).

**Start** (starting sets). A group's weekly sets in week 1: big muscles 10 / 15 / 20 by level; shoulders, biceps and triceps 10 / 12 / 15 (VOL-01, R2-VOL-04, R2-VOL-06). Two notes. He approved 8 / 12 / 15 for small muscles, and the 8 becomes 10 by his floor. The Level 3 start of 20 is PROPOSED: the range he approved says 20 or more (VOL-01).

**Station**. One ordered position in a day template. It names a bucket and a role. The generator fills it with an exercise.

**Stay athletic and active**. The goal for general-population people who play something for fun: "they want to stay athletic and active, so we need to understand that that's an option for them" (conversation). Goal code `active`.

**Step**. The weekly rise in a group's sets, as a percentage. Never more than 7 % for a muscle (approved in R2-VOL-01). The model also keeps the person's total weekly sets rising by less than 10 %, because a 10 % weekly jump is "way too much" (UNI-05).

**Superset**. Two exercises done back to back, then rest. His sheets mark it 'SUPERSET W/' followed by a pointing-down hand. "The supersetting is more like a fatiguing principle" (ORD-05), and it saves time. The plan recommends supersets on eligible pairs (R3-SES-02). The pair list is PROPOSED.

**Survival, the**. See **The work / the accessory / the nuance / the survival**.

**Swap**. Changing the exercise in a slot for another from the same category. Always allowed (GEN-04).

## T

**Tag**. A short label on a catalog record that a rule can read, for example `overhead_squat`, `kb_swing`, `split_grip`. The list is closed and set by the compiler.

**Taper**. The last 1-2 weeks before a first game, meet or event, with less volume. Swimmers: a 2-week dryland taper lined up with the swim coach's taper before the main championship meet (R3-ATH-01).

**Target**. The planned weekly sets of a group for a given week.

**Template**. The skeleton of a week and its days for one family and one number of days. 30 templates: 6 families × 2 to 6 days. Key: `synthesis/05_templates.json > generator_split_templates`.

**Test**. A measurement at the start and the end of a block, never in the middle. Never from zero: someone who has not finished a block never tests a 1-rep max or an all-out mile. They use a 5-rep or 3-rep max, or 80-90 % efforts (R2-PER-07). See [testing](../02-model/testing.md).

**The work / the accessory / the nuance / the survival**. His four roles on a strength day, written this way in his '4 TRACKS' sheet (ORD-07).

| Role | Meaning | Effort |
|---|---|---|
| **the work** | the main lift of the day. It always comes first (ORD-02). | 1 RIR |
| **the accessory** | a supporting lift | 2 RIR |
| **the nuance** | weak-point, unilateral or variation work | MAX |
| **the survival** | isolation or joint-health work | done no matter what |

**Throw**. A medball throw. Counted in throws, never in muscle sets. Throws have no levels: "just do them right" (LIB-06).

**Tier**. Two uses. (1) Dose tiers T0-T5: how much weekly athletic work a profile gets (INFERRED scale). (2) Access tiers T0-T3 on a catalog record: the least equipment an exercise needs.

**Time check** (time vs minimums). The check, before a plan is built, of whether the chosen days and minutes can hold the minimums. If not, in his approved order: tell the person up front and offer another day or longer sessions; if they keep their time, train fewer groups directly (big movers first); recommend supersets; keep the stairway climbing on what is trained (R3-SES-02). See [ADR-032](../04-decisions/adr-032-time-vs-minimums-order.md).

**Time model**. The team's estimate of how many minutes each kind of set takes, used by the time check. PROPOSED.

**Training block**. See **Block**, meaning 1.

**Transverse plane**. Rotation.

**Triple extension** ('TRIPPLE EXTENSION'). Extending ankles, knees and hips together. His library heading for Olympic lifts and loaded jumps. Pattern code `TX`, bucket `AP_TRIPLE_EXT`.

## U

**Unilateral**. One arm or one leg at a time. "The unilateral work is more for health and keeping rotational foundations, and the bilateral is more for driving and creating forces" (UNI-02). A 10/10 set counts as one set.

**Unplaced muscles**. Front delts, traps, adductors and neck. CAT-02 did not sort them into big or small. They get credit but no direct sets unless chosen. Their size class is PROPOSED.

## V

**V-squat**. A machine he never prescribes. His sheet says: 'I don't presercibe the use of these, ever.' The generator never picks it (GEN-08).

**V-taper**. A wide-shoulders look. A bias toward side delts and lats that the plan applies only when the person wants it (VOL-18). In the intake it is a Focus choice that uses both Focus slots (PROPOSED option).

**Variable resistance**. Bands, chains and weight releasers. "We don't want any variable resistance right now" (EQ-12). DORMANT.

**Variant**. A named version of a profile (a swimming stroke, a heavyweight boxer) or of a template (`upper_lower`, `ppl_x2`, `in_season`).

**VOL 1 / VOL 2 / VOL 3**. See **Rep phase**.

**Volume**. The amount of work. In the model: weekly hard sets per focus group. See [volume](../02-model/volume.md).

## W

**Warm-up**. Always written: 5 minutes of any cardio plus A-drills or mobility. It never counts as volume (ORD-08).

**Week-by-week**. RETIRED as a plan mode. It needed the weekly check-in. The code now opens a 12-week plan on its Week view (PROPOSED).

**Weekend warrior**. The profile for people who want to be athletic without competing. See **'JUSTICE LEAGUE'**.

**Weekly sets**. Hard sets per muscle group per week. The number the whole volume system is built on.

**Why** (why-code). A small note attached to each decision in a plan. It names the rule and the answer id behind it, for example `why.two_spine_days` with `R2-SES-01`.

**WOD**. "Workout of the day": the conditioning piece of a CrossFit-style class.

**Work, the**. See **The work / the accessory / the nuance / the survival**.

## Y

**Year plan**. A plan for a whole year, for the general population "that wants to just stay in shape" (R2-PER-01). January-March: hard work, more cardio, start cutting. April-June: summer shape. July-September: maintain at about 70 %. October to mid-December: build muscle, less cardio. Last two weeks of December: maintenance. The person can re-order and tune it (R2-PER-02). Athletes follow their season instead.

**Youth**. Under 18 (the age line is INFERRED). Olympic lifts from the floor from about age 14, after one block of hang work (R2-ATH-08).

## Z

**Zone**. His sheets use 'ZONE' for four different things.
1. **Row 3 of the library**, labelled 'ZONE': the level row ('FOUNDATIONAL', 'MODERATE', 'ADVANCED'). In the model this is the exercise level.
2. **Davidson zone** on cable curls and triceps work ('Zone1, Zone 2, Zone 3'): a rotation-bias tag. See that entry.
3. **'ZONE 1/2/3' on plyos** in 'Sheet23': these are the **Receive-Create stages**. "It doesn't apply to the plyos. The plyos are different" (CAT-10).
4. The green, yellow and red band in 'Sheet23': most likely Davidson zones used as a level band (INFERRED). Not used.

Aerobic "zones" are not used. He names aerobic work by colour. See **Aerobic colours**.

---

## His spelling → the model's spelling

The model keeps his labels in quotes as he wrote them and uses corrected spelling for its own names. His sheets are never edited (FIX-04).

| In his sheets | In the model |
|---|---|
| 'TRIPPLE EXTENSION' | triple extension |
| 'SAGITAL' | sagittal |
| 'INTERMIDIATE', 'MODERATE' | intermediate |
| 'BILATERAL HIP DOMNANT' | bilateral hip dominant |
| 'UNILATERAL KNE DOMINANT' | unilateral knee dominant |
| 'ABdution' | abduction (the side-raise slot) |
| 'NOVICE', 'NEWBY' | Level 1 |
| 'LACTATE CLERANCE' | lactate clearance |
| 'LEFT TEST' | L-test (3-cone L-drill) (LIB-01) |
| '5/10/05' (stored as a date) | 5-10-5 pro-agility shuttle (LIB-01) |
| 'Snatch', 'Clean', 'Clean & Jerk' | Squat Snatch, Squat Clean, Squat Clean & Jerk (LIB-07) |
| 'Pull under' | lat pull-over (LIB-09) |
| 'Kong Row' | double-KB row from the floor (LIB-09) |
| 'Single Leg Get Ups' | box pistol (LIB-09) |
| 'Low DB Squats' | DB squat with the dumbbells hanging at the sides (LIB-09) |
| 'Bench Push ups' | two exercises: hands on the bench (foundational), feet on the bench (advanced) (R2-LIB-05) |
| 'JUSTICE LEAGUE' | Athletic Performance - Non-Competitive (the team's name, PROPOSED; ATH-13, FIX-03) |
| 'NO ACCESS' | self-serve version, full gym library (R2-LIB-08) |
| 'FULL TIME' / 'HALF TIME' (CrossFit) | competitor / class member (PRG-10) |
| 'Coppenhaggen', 'Harmstring', 'Glidder', 'Sqats', 'BEGGINER', 'RECCOMENDED' | Copenhagen, hamstring, glider or slider, squats, beginner, recommended |
| "park queue" (spoken) | PAR-Q |
| "high rows" (spoken) | HYROX (R3-ATH-03) |
| '21.6 mile run' | removed from plans and tests (R2-LIB-06) |
| 'Camporini Deadlift', 'Whats that strap rotating in', 'Whats that strap rotating out' | removed (LIB-09) |

## Codes at a glance

**Families**

| Code | Name | Counted in |
|---|---|---|
| AP | Athletic patterns | contacts, throws, cuts, metres, power reps. Never muscle sets. |
| RP | Resistance patterns | sets × reps per muscle |
| CO (CT, CP, CB) | Control / core: thorax, pelvis, both | core sets |
| CA | Cardio / conditioning | sessions and bouts |
| FN | Functional: carries, drags, slings | no muscle sets |

**Pattern codes**

| Code | Pattern | Code | Pattern |
|---|---|---|---|
| `BKD` | bilateral knee dominant | `SHLD` | shoulder isolation |
| `UKD` | unilateral knee dominant | `BIC`, `TRI`, `CALF` | biceps, triceps, calves |
| `BHD` | bilateral hip dominant | `CT`, `CP`, `CB` | core thorax, pelvis, both |
| `UHD` | unilateral hip dominant | `PLYO` | jumps |
| `KEXT` | leg extension | `ANKLE` | ankle hops |
| `KFLEX` | leg flexion | `THROW` | medball throws |
| `HPUSH` | horizontal push | `TX` | triple extension / Olympic |
| `MRPUSH` | mid-range push | `COD` | change of direction |
| `VPUSH` | vertical push | `SPRINT` | sprint and mechanics |
| `HPULL` | horizontal pull | `CARDIO` | aerobic session |
| `VPULL` | vertical pull | `CARRY`, `DRAG` | carries, drags |

**Levels**

| Kind | Values |
|---|---|
| Exercise level | foundational, intermediate, advanced |
| Client level | L1, L2, L3 (+ the optional Pro setting, which is not a level) |
| Stair level | 2 → 11 |
| Constraint | 1 → 5 |
| Davidson zone | Z1, Z2, Z3 |
| Receive-Create stage | RC1, RC2, RC3 |
| Ground-contact class | 1 → 5 |

## Retired words (do not rebuild)

| Word | What it was | Retired by |
|---|---|---|
| Check-in, readiness score, hold week, `adapt()` | weekly feedback that changed the plan | R3-VOL-02, R3-VOL-04 |
| Logbook mode, tracking | the tool reading a person's log | R3-VOL-02, R3-GEN-01 |
| Sleep, stress and job questions | lifestyle inputs | R2-GEN-04 |
| Sex field | an intake field | GEN-02, ATH-09 |
| Deload inside a block | a planned or triggered easy week mid-block | R2-VOL-07 |
| "Start hard" 8-week plan | 4 weeks adapting + 4 driving, 10 % more sets at the start | R2-PER-03 |
| 3 % / 5 % / 7 % by muscle size | a weekly step that depends on the muscle | VOL-05 |
| 0.5 helper credit | half a set for helper muscles | VOL-09 |
| Rear delts with their own sets (4 / 6 / 8) | rear delts as a separate line with its own floor | R3-VOL-01 |
| KB swings as glute sets | swings credited to glutes | R2-VOL-05 |
| Bands, chains, weight releasers | variable resistance | EQ-01, EQ-12 |
| Week-by-week mode | a rolling plan run on check-ins | R3-VOL-02 |
| Mandatory easy week | a required recovery week after a block | R3-PER-01 |
| Learning from user data | tables tuned from everyone's logs | R3-GEN-01 |

The full list with his words is in [what he rejected](../01-philosophy/what-he-rejected.md).

## Related pages

- [parameters.md](parameters.md): every number, with its data key and status.
- [data-dictionary.md](data-dictionary.md): every field of an exercise, a profile, a template and a plan.
- [faq.md](faq.md): common questions.
- [His answers by topic](../03-coach-answers/index.md) and [what changed between rounds](../03-coach-answers/changes-across-rounds.md).
- [BLAZE_CAMP_BRAIN.md](../../BLAZE_CAMP_BRAIN.md) Appendix A: the master list of his labels.
