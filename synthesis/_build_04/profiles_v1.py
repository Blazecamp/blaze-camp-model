# -*- coding: utf-8 -*-
"""v1 overlay for 04_athlete_profiles: applies the coach's questionnaire answers (coach_answers_full.md, 2026-10-08)
on top of the v0 data in profiles_data.py (kept unchanged for traceability; a frozen copy is in v0/).

Evidence labels: OBSERVED (coach sheet) / COACH-ANSWER <ID> (questionnaire) / INFERRED (analyst) / SCIENCE (literature)
/ PROPOSED (analyst proposal grounded in science, PENDING COACH APPROVAL).
"""
import copy
import profiles_data as V0

VERSION = "v1"

# ---------------------------------------------------------------------------- categories
CATS_ATH = ["PLYO", "JLK", "BALL", "THROW", "COD", "SPRINT", "TE"]
CATS_RP = list(V0.CATS_RP)
CATS_ISO = list(V0.CATS_ISO)
CATS_OTHER = list(V0.CATS_OTHER)
ALL_CATS = CATS_ATH + CATS_RP + CATS_ISO + CATS_OTHER
POWER_CATS = ["PLYO", "JLK", "BALL", "THROW"]  # the plyo:ballistic split is computed on these (COACH-ANSWER ATH-01)

CAT_LABELS = dict(V0.CAT_LABELS)
CAT_LABELS.update({
    "PLYO": "high-amplitude PLYOMETRIC work = short ground contact, reactive (hops, bounds, hurdle hops, depth/drop jumps, repeated jumps) plus the landing drills that teach it (method stage 1 'receive and pause'); library 'PLYOS' + 'FULL JUMPING' (COACH-ANSWER ATH-01 / CAT-10: 'the longer they're on the ground, the less it is going to be plyo')",
    "JLK": "low-amplitude PLYOMETRIC work (fastest stretch-shortening: ankle hops, pogos, squirrel jumps, plate hops; jump rope tracked in minutes); BYOP library heading 'JUMPING ANKLE' F5 / ankle-hop block C124-C136 ('JUMPING LIMITED KNEE' is the MASTER_MODEL Sheet23 heading E1/G1). The coach files squirrel jumps under PLYOS 'ADVANCED' / 'FULL JUMPING' (G126-G127, J9-J10): under the v1 ground-contact model they are plyometric either way",
    "BALL": "BALLISTIC jumps (NEW in v1) = long ground contact or single maximal effort: loaded jumps (DB / hex-bar / squat jumps, loaded 10-20% body weight - EQ-15), box jumps, broad jumps, march jumps, step-up jumps (COACH-ANSWER ATH-01 / CAT-10; split out of the v0 PLYO bucket)",
    "THROW": "medball throws = upper-body / rotational BALLISTICS ('THROWING'; the 'MEDBALL CHEAT SHEET' 'ALL LIST' = one pass of ~19 throws x 10, LIB-22); no levels on throws, 'just do them right' (LIB-06); ball never over 20 lb (EQ-06); none in the main workout for aesthetics clients (ATH-05)",
    "TE": "Olympic lifts / triple extension ('TRIPPLE EXTENSION'): EVERY athlete in athletic training gets them (COACH-ANSWER ATH-10) - L1 = DB/KB snatches, hex-bar jumps, hang pulls / hang cleans (no bumpers needed); L2+ = full lifts ('Squat Snatch', 'Squat Clean', 'Squat Clean & Jerk' - LIB-07) and power variants; push press easier, push jerk L2-L3 (LIB-13)",
    "COD": "change of direction ('CHANGE OF DIRECTION'): the route-tree names are for EVERY athlete, tiered EASY / MOD. / HARD TURN by turn angle (COACH-ANSWER ATH-06)",
    "SPRINT": "sprint / acceleration (no BYOP slot yet; MACH drills and the fixed speed-session order squirrel jumps -> MACH / acceleration starts -> max velocity are to be added to the library, LIB-21)",
    "ISO_REAR": "'Reverse Flies' / ER / face pull - rear delts get their OWN sets (COACH-ANSWER VOL-17)",
    "ISO_CALF": "'Calves' - 3 sets every leg day, single-leg (ramp / plate / deficit) or bilateral (COACH-ANSWER VOL-17)",
    "CORE": "'Core' (CORE THORAX / CORE PELVIS / FUNCTIONAL slings) - done FIRST in the session as the warm-up, movable by the user (COACH-ANSWER ATH-11); about 2 core exercises for athletes (VOL-17)",
})

# ---------------------------------------------------------------------------- muscle credit (COACH-ANSWER VOL-09, UNI-01, LIB-16, VOL-10)
# 1.0 to the main mover, 0.25 to clear helpers (was 0.5 in v0). A unilateral 10/10 set = 1 set, credited 'mostly to quads' (UNI-01):
# UKD = quads 1.0 + glutes 0.25. Athletic categories (PLYO/JLK/BALL/THROW/COD/SPRINT/TE) credit NO muscle (VOL-10).
# Dips = 0.5 triceps / 0.5 chest (LIB-16) - exercise level, handled in 02/03; thrusters 1.0 quads / 0.5 shoulders (LIB-14).
CREDIT = {
    "BKD": {"quads": 1, "glutes": .25}, "BHD": {"hamstrings": 1, "glutes": 1}, "UKD": {"quads": 1, "glutes": .25},
    "UHD": {"hamstrings": 1, "glutes": 1}, "HPUSH": {"chest": 1, "front_delts": .25, "triceps": .25},
    "VPUSH": {"front_delts": 1, "side_delts": .25, "triceps": .25, "chest": .25}, "HPULL": {"lats_upper_back": 1, "rear_delts": .25, "biceps": .25},
    "VPULL": {"lats_upper_back": 1, "biceps": .25}, "ISO_QUAD": {"quads": 1}, "ISO_HAM": {"hamstrings": 1}, "ISO_CHEST": {"chest": 1},
    "ISO_SIDE": {"side_delts": 1}, "ISO_REAR": {"rear_delts": 1, "lats_upper_back": .25}, "ISO_BICEP": {"biceps": 1}, "ISO_TRICEP": {"triceps": 1},
    "ISO_CALF": {"calves": 1}, "ISO_NECK": {"neck": 1}, "ISO_GRIP": {"forearms_grip": 1}, "CORE": {"abs_obliques": 1},
}
BIG, SMALL = V0.BIG, V0.SMALL

NOMINAL = dict(V0.NOMINAL)
NOMINAL["BALL"] = (5, "loaded / single-effort jump reps per set ('5 DB squat jumps', '5 broad jumps', 'HEX bar loaded Jumps' 4-6)")
NOMINAL["PLYO"] = (8, "plyometric + landing contacts per set ('6 to 8 Reps' weekend-warrior tab; depth drops 1x8 MM athletic)")

# ---------------------------------------------------------------------------- ground-contact model (COACH-ANSWER ATH-01, CAT-10/11)
GCT_CLASSES = {
    1: {"label": "very short", "typical": "about 0.10-0.16 s per contact (sprinting: ~0.14-0.16 s in acceleration, shorter at top speed [S33]; bounding, repeated hops)", "examples": "sprinters, distance runners (repeated reactive contacts)"},
    2: {"label": "short", "typical": "about 0.15-0.25 s (fast stretch-shortening [S32]: approach / block jumps, first steps, sharp cuts)", "examples": "volleyball, football skill, soccer"},
    3: {"label": "mixed", "typical": "short jumps and cuts mixed with planted, longer pushes (over 0.25 s = slow SSC [S32])", "examples": "basketball ('good mix'), tennis, football big-skill, youth, weekend warriors"},
    4: {"label": "long", "typical": "planted rotational or pushing actions, well over 0.25 s on the ground (stride-plant-rotate, skating push, stance blocks)", "examples": "baseball, softball, hockey, linemen, MMA"},
    5: {"label": "very long / grounded", "typical": "feet stay on the ground for most of the action or contact is sustained (striking from stance, swinging, grappling)", "examples": "boxing, karate, kickboxing, golf, wrestling, BJJ"},
}
# Plyo share of power sets by class. Direction = COACH-ANSWER ATH-01; numbers = PROPOSED - PENDING COACH APPROVAL, anchored on the
# OBSERVED re-count (BASEBALL blocks 36-44% plyo -> class 4 = 40; BOXER wk3-6 30% -> class 5 = 25). Floor 20 / ceiling 80 because
# 'both of those ranges are important, both end ranges' (ATH-01) and 'some plyos are always good' for fighters.
GCT_PLYO_PCT = {1: 75, 2: 60, 3: 50, 4: 40, 5: 25}
GCT_FLOOR, GCT_CEIL = 20, 80
SCIENCE_GCT = ("fast stretch-shortening cycle = ground contact under about 250 ms, slow SSC = over about 250 ms (Schmidtbleicher's split, used by Flanagan & Comyns 2008 "
               "to prescribe plyometrics by contact time and reactive strength index [S32]); sprint contacts average about 0.14-0.16 s in acceleration and "
               "shorten toward maximal velocity, and faster accelerators show shorter contacts [S33]")
PLYO_METHOD_STAGES = {
    "name": "plyo method stages (the coach has not named this yet - it is NOT a plyo zone, COACH-ANSWER CAT-11; 'zones' are Davidson rotation zones and do not apply to plyos, CAT-10)",
    "stages": [
        {"stage": 1, "label": "receive and pause", "examples": "stick-the-landing drills, depth drops with a 3 s stick, 'Push up Stick the Landing' (hands start on a box and land on the floor, LIB-02)", "evidence": "COACH-ANSWER CAT-10"},
        {"stage": 2, "label": "receive then create (one response)", "examples": "stick the landing then jump / hop, depth drop to jump, drop into box jump", "evidence": "COACH-ANSWER CAT-10"},
        {"stage": 3, "label": "repeated receive / create", "examples": "repeated hops, hurdle hops (taller hurdles + continuous quick contacts = advanced, LIB-04), pogos, bounds", "evidence": "COACH-ANSWER CAT-10"},
    ],
    "rules": [
        "programs START more ballistic and gradually become more plyometric (connective-tissue tolerance and structure) - COACH-ANSWER CAT-10",
        "unilateral plyos are harder than bilateral ones; progress bilateral -> unilateral inside each stage - COACH-ANSWER CAT-10",
        "PROPOSED timing (pending): 12-week plan = weeks 1-3 stage 1 + ballistic-biased mix (plyo share -15 points, floor 20), weeks 4-7 stage 2, weeks 8-12 stage 3 at the sport's target share; 8-week plan = weeks 1-2 / 3-5 / 6-8; 4-6-week maintenance blocks stay at the current stage; L2-L3 athletes may start at stage 2",
    ],
}

# ---------------------------------------------------------------------------- bilateral : unilateral (COACH-ANSWER UNI-02 / UNI-03 / UNI-10 / CAT-13)
BILAT_MODEL = {
    "scale": "share of lower-body compound sets that are BILATERAL : UNILATERAL, anywhere from 90/10 to 10/90 (COACH-ANSWER UNI-02); upper body follows the same logic for pressing and pulling (UNI-03); coach-adjustable",
    "why": "'the unilateral work is more for health and keeping rotational foundations, and the bilateral is more for driving and creating forces' (UNI-02)",
    "anchors": [
        "bodybuilders / powerlifters: about 50/50 at the start (unilateral as a small health foundation), then 80/20 -> 90/10 bilateral (COACH-ANSWER UNI-02)",
        "field / change-of-direction athletes (tennis example): 80-90% unilateral in the gym; bilateral = health foundation for connective tissue and joints (COACH-ANSWER UNI-02)",
        "in-season athletes: bilateral kept minimal (maintain strength and potentiation), unilateral keeps ranges of motion and health (COACH-ANSWER UNI-10)",
        "pain or injury moves the share (usually toward unilateral / split grips, or to machines) - COACH-ANSWER UNI-02, VOL-03, MASTER_MODEL athletic A6",
    ],
    "engine": "share(week) = start + (end - start) x week_fraction across the off-season block (the coach's set-addition order adds sets to the FIRST exercise first, VOL-07, and bilateral slots come first, so the bilateral share rises naturally for size/strength goals); in-season value replaces it during the season; pain overrides; the weekly-set baseline in section 5.2 uses the mid-block value (PROPOSED)",
}
CONTRA_IPSI = {
    "contralateral": "load in the hand opposite the working leg pulls you INTO the hip (eccentric coil); used for change-of-direction athletes who must get in and out of the hip quickly and need the range (football route runners, soccer, basketball 'a lot', tennis 'definitely') - COACH-ANSWER CAT-13",
    "ipsilateral": "load on the same side helps you OUT of the hip; used for sprint acceleration (e.g. ipsilateral step-ups for a 100 m sprinter's take-off) - COACH-ANSWER CAT-13",
    "size_strength": "bodybuilders / powerlifters: contra/ipsi lunges and step-ups are HEALTH accessories (hips, low back, the rotational forces lost in symmetrical lifting), mostly in the first 2-4 weeks of a program, then mostly bilateral; kept as an accessory later only if something bugs them - COACH-ANSWER CAT-13",
    "pairing": "same-pattern pairing (squat + lunge) drives one muscle harder for aesthetics and high-level athletes who need more stimulus; cross-pattern pairing (squat + single-leg RDL) for bootcamp / general clients so they are less sore and can train more often - COACH-ANSWER UNI-06",
}

# ---------------------------------------------------------------------------- other global rules
ATH03_GROUPS = {
    "resistance": {"label": "more resistance training (strength / size)", "members": "football linemen, wrestlers, rugby (forwards -> lineman profile, backs -> big-skill profile), heavyweight fighters (body-weight intake moves a combat profile here), track & field throwers (variant)", "evidence": "COACH-ANSWER ATH-03"},
    "speed_power": {"label": "more speed and power", "members": "sprinters, basketball, football skill positions, volleyball (and soccer, track jumpers - INFERRED)", "evidence": "COACH-ANSWER ATH-03"},
    "rotational_power": {"label": "rotational power + ballistics", "members": "baseball, softball, golf, tennis (ATH-01: 'more ballistics and rotational forces' for baseball)", "evidence": "COACH-ANSWER ATH-01 + INFERRED grouping"},
    "combat": {"label": "combat (ballistic-leaning power + conditioning)", "members": "boxing, kickboxing, karate, MMA, wrestling, BJJ", "evidence": "COACH-ANSWER ATH-01 / ATH-04 + INFERRED grouping"},
    "size_strength": {"label": "size / strength (no athletic block)", "members": "bodybuilding / aesthetics, powerlifting", "evidence": "COACH-ANSWER UNI-02 / ATH-05"},
    "health": {"label": "health / general", "members": "general population, fat loss, older adults, weekend warriors, youth", "evidence": "COACH-ANSWER ATH-07 / ATH-09 / ATH-13"},
}
OLYMPIC_BY_LEVEL = {
    "rule": "everyone in athletic training gets Olympic lifts (COACH-ANSWER ATH-10)",
    "L1": "DB / KB snatches, hex-bar jumps, hang pulls, hang cleans (no bumper plates needed) - ATH-10",
    "L2": "power and hang variants with the barbell, push press (easier than the jerk, LIB-13); full lifts introduced",
    "L3": "full lifts: 'Squat Snatch', 'Squat Clean', 'Squat Clean & Jerk' (LIB-07), push jerk (LIB-13), %-template OLY 75 -> 80 -> 85 -> 90% at 4x8 -> 4x6 -> 4x6 -> 4x4 (PER-09)",
    "youth": "foundational lists, but SOME Olympic lifts from the floor according to the program (COACH-ANSWER ATH-09 reverses the v0 'no Olympic lifts from the floor' rule)",
    "never": "older / injured / high-volume clients never get the snatch, overhead squat, low-bar squat or depth jumps (COACH-ANSWER EQ-03)",
}
CONTRAST_RULE = "contrast / French contrast and complexes: L2+ athletes, OFF-SEASON only, heavy lift at about 78-85%, no rest inside the complex (COACH-ANSWER ATH-12)"
MEDBALL_RULE = {
    "by_sport": "high for baseball, boxing, MMA, tennis and golf (rotational); moderate for basketball and football; NONE in the main workout for aesthetics / bodybuilders (warm-up only) - COACH-ANSWER ATH-05",
    "weights": "passes / rotations 8-10 lb (speed), slams 10-20 lb, overhead throws 6-10 lb, sit-up throws 6-8 lb, lighter for youth and older clients; never more than 20 lb (a heavier ball only for something specific like a heavy med-ball hang clean or wall balls) - COACH-ANSWER EQ-06",
    "no_ball": "no medball -> plyo push-ups (pressing), fast cable rotations or the 'fake medball slam'; never band chops (COACH-ANSWER EQ-07)",
    "list": "a 'Throwing' slot can be the whole 'ALL LIST' = one pass of the ~19 throws at 1 x 10 each (~200 throws) - COACH-ANSWER LIB-22",
}
AEROBIC_RULE = {
    "general_fat_loss": 3, "athletes_in_season": 2, "aesthetics_bodybuilders": 4,
    "walks": "aesthetics / bodybuilding clients add long walks after their workouts (COACH-ANSWER ATH-07)",
    "evidence": "COACH-ANSWER ATH-07 (3 general / fat loss, 2 athletes in season, 4 aesthetics + walks); athletes OFF-season are not specified -> PROPOSED 2-3 by sport, 3-4 for fighters",
    "fighters": "fighters get a REAL aerobic block (colour C / easy), not a warm-up: boxing starts its conditioning days with it, the hybrid Friday starts with 15-40 min easy (COACH-ANSWER ORD-09)",
    "modes": "any erg (run, bike, rower, ski) - track by distance, calories or time; doing the block and seeing week-to-week change is what matters (EQ-14)",
    "colours": "cheat-sheet rule: one of each colour (A blue short/high, B green 1-3 min, C orange long/low) when 3 sessions; colour mixes per sport are INFERRED/PROPOSED",
}
AGE_RULES = {
    "no_sex": "no rule in this document depends on sex: the coach programs by age, foundation (training experience), goal and injuries; 'the rules kind of apply to everybody' (COACH-ANSWER ATH-09; GEN-02 drops sex from the intake)",
    "older": "older clients: few plyos unless they ask for them (COACH-ANSWER ATH-09); compounds AND isolation lean to constrained machines / cables; never overhead squat, snatch, low-bar squat or depth jumps (EQ-03); machines filed MODERATE/ADVANCED are fine for them (EQ-04). Age threshold not given by the coach: PROPOSED 60+ or any client whose foundation / injuries call for it",
    "youth": "youth: foundational lists, some Olympic lifts from the floor according to the program (ATH-09); growth-spurt caps stay INFERRED",
    "injured_high_volume": "injured clients and clients carrying high volume collect that volume 'in a safe place with more constraints' (constraint 4-5 machines) - COACH-ANSWER EQ-03",
    "experience": "training experience in years (GEN-02 / PRG-05): L1 novice = under about 6-12 months; L2 intermediate = over 1 year consistent; L3 advanced; more than 6-12 months off -> the body is treated as L1 (skills come back fast); ex-pros start at L1 only briefly",
}
COMPETITION_LEVEL = {
    "rule": "high school, college and pro athletes need the same things; only loads and speeds change per athlete (COACH-ANSWER PRG-09)",
    "high_school": "'just have to do a lot of work' - same template, general work capacity and technique (PROPOSED: no separate profile)",
    "college": "'trying to adapt as much as they can' - full progression (PROPOSED)",
    "pro": "'a higher level and a little bit more care for their body because of contracts' - PROPOSED: weekly volume increase kept at the low end of the person-based 3/5/7% rate, injury rules applied first, testing optional",
    "baseball_calendars": "the calendars in the sheet are 'just whatever I wrote' - no level-specific season model; Thursday = strength (PRG-09)",
}
IN_SEASON_CONTENT = {
    "rule": "in-season: about 2 lifting days a week, low volume (PER-08 assumption confirmed RIGHT); what fills it depends on the athlete (COACH-ANSWER PER-08)",
    "speed": "speed athletes -> sprints (max-velocity / acceleration exposures)",
    "strength_maintenance": "most other athletes -> maintenance of strength (bilateral kept minimal, UNI-10)",
    "jumps": "some athletes -> high jumps (low-volume, high-quality jumping)",
    "also": "2 aerobic sessions (ATH-07); no contrast (ATH-12 = off-season only); deload = about half the sets (PER-05)",
}
SESSION_RULES = [
    "warm-up always (5 min any cardio + A March / Skip / Run or mobility); A-drills are warm-up, not volume (COACH-ANSWER ORD-08)",
    "CORE FIRST as part of the warm-up, movable after the plyos or the strength block if the user prefers (COACH-ANSWER ATH-11; replaces the v0 'core second / optional days' reading)",
    "order: core -> plyo / ballistics -> Olympic / power -> strength -> resistance accessories -> isolation (power before strength, ORD-03; the main lift first, ORD-02; horizontal pull before vertical pull, ORD-01)",
    "field athletes off-season: up to 10-12 exercises (about 2 core + 2-4 plyo/ballistic + 2-3 Olympic/power + 3-4 resistance); resistance-only sessions about 5-7 exercises (COACH-ANSWER VOL-08 / VOL-16 / VOL-17)",
    "session length: athletes, bodybuilders, powerlifters about 1.5 h (max 2 h); general / weight-loss clients 45-60 min (COACH-ANSWER UNI-09); bootcamps 35-45 min, timed circuits 3-5 rounds x 30-50 s, 5-7 stations (PRG-03)",
    "pairing: hip-dominant (lower posterior) with upper push (anterior), knee-dominant with pull, in full-body and bootcamp days alike (COACH-ANSWER UNI-11 / ORD-06 - the Bootcamp Option 1 Tue/Fri wiring was a mistake)",
    "axial spinal loading once a week: squat on one day, leg press / belt squat on the other; deadlifts also load the spine (COACH-ANSWER PER-04, EQ-11)",
    "calves 3 sets every leg day; rear delts get their own sets; about 2 core exercises for athletes (COACH-ANSWER VOL-17)",
    "supersets are a fatigue / density tool: short sessions, advanced athletes needing more stimulus, off-season VO2 / mitochondrial work, beginners who do not fatigue (COACH-ANSWER ORD-05)",
    "optional days (Calves, Cardio, Core, Focus 1, Focus 2) can be add-ons or separate days - ideally separate (COACH-ANSWER ORD-10)",
    "athletic sets (plyos, ballistics, throws, Olympic lifts, sprints, COD) never count toward muscle weekly sets (COACH-ANSWER VOL-10)",
]

# ---------------------------------------------------------------------------- scales
SCALES = copy.deepcopy(V0.SCALES)
SCALES["_note"] = ("v1: two jump scales. (1) PLYOMETRIC contacts / week (fast-SSC, high amplitude: hops, bounds, hurdle hops, depth/drop jumps, repeated jumps; "
                   "landings, ballistic jumps and low-amplitude ankle work excluded) is the dial the coach's sport ranking applies to (COACH-ANSWER ATH-02 / ATH-01); "
                   "its OBSERVED anchors come from the v1 ground-contact re-count: BOXER wk3-6 31, BASEBALL B1 / B2 / B3 37 / 58 / 74, MM ATH STARTING 94. "
                   "(2) ALL lower-body JUMP contacts / week (landings + plyometric + ballistic jumps = the v0 'high-amplitude' measure, comparable with the NSCA "
                   "per-session guide 80-100 / 100-120 / 120-140) is kept as a safety check. Boundaries are INFERRED; per-sport targets are PROPOSED and follow the "
                   "confirmed ranking basketball = volleyball > sprinters > football skill > soccer > MMA > tennis > baseball > hockey > wrestling / BJJ > boxing = karate > golf.")
SCALES["plyometric_contacts_wk"] = {"T0": [0, 0], "T1": [1, 25], "T2": [26, 50], "T3": [51, 80], "T4": [81, 110], "T5": [111, 150],
                                    "anchors": {"BOXER wk3-6 (tuck jumps, drop into box jumps)": 31, "BASEBALL B1 off-season": 37, "BASEBALL B2 pre-season": 58,
                                                "BASEBALL B3 in-season": 74, "MM ATH STARTING (depth jumps, repeat jumps, lunge jumps)": 94, "MM ATH MID / ADVANCED": "0 (squirrel jumps only = low amplitude)"},
                                    "note": "OBSERVED counts re-classified by ground contact (v1_power_mix.py); the classification keywords are INFERRED"}
SCALES["plyo_high_contacts_wk"]["label_v1"] = "ALL lower-body jump contacts (landings + plyometric + ballistic jumps) - the v0 'high-amplitude' measure, kept as the NSCA safety check"
SCALES["plyo_high_contacts_wk"]["anchors"] = {k.replace("BYOP ATHLETIC @2 sets", "BYOP ATHLETIC / weekend-warrior template @2 sets"): v for k, v in SCALES["plyo_high_contacts_wk"]["anchors"].items()}
SCALES["throws_wk"]["note"] = "v1 tiers per sport follow COACH-ANSWER ATH-05: high (T3+) baseball, boxing, MMA, tennis, golf; moderate (T2) basketball, football; none for aesthetics"
SCALES["ground_contact_class"] = {str(k): v for k, v in GCT_CLASSES.items()}
SCALES["ground_contact_plyo_pct"] = {"map": {str(k): v for k, v in GCT_PLYO_PCT.items()}, "floor": GCT_FLOOR, "ceiling": GCT_CEIL,
                                     "evidence": "direction COACH-ANSWER ATH-01; numbers PROPOSED - PENDING COACH APPROVAL; anchors OBSERVED (baseball 36-44%, boxer 30%)", "science": SCIENCE_GCT}
SCALES["resistance_rep_zones"] = dict(SCALES["resistance_rep_zones"])
SCALES["resistance_rep_zones"]["MYO"] = SCALES["resistance_rep_zones"]["MYO"].replace("'MYO SET' leg extensions JUSTICE LEAGUE G12", "'MYO SET' leg extensions in the weekend-warrior tab G12") + "; MYO only on the last exercise, machines or isolation (COACH-ANSWER VOL-15)"
SCALES["resistance_rep_zones"]["VOL 1"] += "; VOL 1 / 2 / 3 = early / mid / late off-season blocks for ALL athletes (COACH-ANSWER PER-11)"
SCALES["resistance_rep_zones"]["PYRAMID"] = "'12/10/8 -20' = 12 reps mid weight, 10 heavier, 8 heaviest, then drop to a light 20 (COACH-ANSWER PRG-07); '10/10' = per side"
SCALES["resistance_rep_zones"]["40-REP"] = "40-rep sets are NOT a default (coach is not a fan): only as an optional CrossFit / AMRAP style (COACH-ANSWER VOL-11)"
SCALES["resistance_rep_zones"]["UNILATERAL"] = "unilateral lifts normally moderate-to-high reps; heavy low-rep unilateral work is an optional add-on when the athlete or coach wants it (COACH-ANSWER UNI-04); unilateral progresses like bilateral (UNI-05)"
SCALES["conditioning_colours"] = dict(SCALES["conditioning_colours"])
SCALES["conditioning_colours"]["sessions_v1"] = "3 / week general and fat loss, 2 / week athletes in season, 4 / week aesthetics + long walks after workouts (COACH-ANSWER ATH-07)"

# ---------------------------------------------------------------------------- season families (edits)
SEASON_FAMILIES = copy.deepcopy(V0.SEASON_FAMILIES)
fc = SEASON_FAMILIES["field_court"]["phases"]
fc[0]["rules"] = ["plyo method stage 1 'receive and pause' (stick the landing) and a BALLISTIC-biased power mix (programs start more ballistic - COACH-ANSWER CAT-10)",
                  "bilateral : unilateral at the block-start value; contra / ipsi accessories (CAT-13)", "COD 'EASY TURN' only", "Olympic L1 variants (DB / KB snatch, hang pulls) - ATH-10",
                  "rep zone VOL 1 (PER-11)", "conditioning C + B (build the base)"]
fc[1]["rules"] = ["rep zone VOL 1 -> VOL 2 ('12/10/8/8' pyramids) - PER-11 confirmed for all athletes", "plyo method stage 2 'receive then create'",
                  "Olympic lifts are STANDARD, not optional (COACH-ANSWER ATH-10): L1 variants or full lifts by level",
                  "contrast / complexes for L2+ athletes (ATH-12: off-season only, ~78-85%)", "new weekly exercise menu each week in the observed baseball block (BASEBALL B1 menu overlap <= 0.15); the generator default is the coach's block rule instead: exercises fixed for 4-6 weeks, small variables change between blocks (PER-02)",
                  "day tags 'Speed' Mon / 'strength' Tue / 'speed' Fri (OBSERVED); Thursday = strength (PRG-09)"]
fc[2]["multipliers"] = dict(fc[2]["multipliers"])
fc[2]["multipliers"]["TE"] = "standard, not optional (COACH-ANSWER ATH-10): %-based 75 -> 80 -> 85 -> 90% at 4x8 -> 4x6 -> 4x6 -> 4x4 (PER-09 confirmed)"
fc[3]["multipliers_note"] = "TE 0 in season is OBSERVED (baseball); whether light L1 variants stay in season is open (section 11.2)"
fc[2]["rules"] = fc[2]["rules"] + ["plyo method stage 3 'repeated receive / create' at the sport's target plyo share (CAT-10)", "deload = about half the sets, same exercises, lighter / 3+ RIR, no buy-out (COACH-ANSWER PER-05)"]
fc[3]["multipliers"] = dict(fc[3]["multipliers"])
fc[3]["multipliers"]["bilateral share"] = "minimal - 10-20% of lower compound sets (COACH-ANSWER UNI-10)"
fc[3]["rules"] = ["about 2 lifting days a week, low volume (COACH-ANSWER PER-08)", "content by athlete type: speed athletes -> sprints; most others -> strength maintenance; some -> high jumps (COACH-ANSWER PER-08)",
                  "bilateral work minimal, unilateral keeps range and health (UNI-10)", "2 aerobic sessions a week (ATH-07)", "no contrast (ATH-12)",
                  "OBSERVED baseball in-season: main lifts flat 4 x 10 (4 x 8 early), no compound below 8 reps, no Olympic lifts, two alternating proven weekly menus, short buy-outs ('1x 30 Sec Fast Run', '2x 15 cal bike sprint')",
                  "INFERRED for jump/run-dominant sports whose games already supply contacts (basketball, volleyball, soccer): PLYO x0.3-0.5, keep 1 max-velocity exposure for hamstring protection"]
cb = SEASON_FAMILIES["combat"]["phases"]
cb[0]["rules"] = cb[0]["rules"] + ["the opening cardio on conditioning days is a REAL aerobic block for fighters, not a warm-up (COACH-ANSWER ORD-09)"]
cb[1]["rules"] = [r.replace("strikers: horizontal push and vertical pull removed after base (OBSERVED for boxer; INFERRED rule for striking sports)",
                            "strikers: when punching volume is high, horizontal push, vertical pull and arm isolation are REDUCED, not cut (COACH-ANSWER ATH-04; the boxing tab removed them in weeks 3-8 = OBSERVED)") for r in cb[1]["rules"]]
cb[1]["rules"].append("contrast complexes are an off-season / build tool for L2+ (ATH-12); steps and waves (not smooth ramps) for fight prep (PER-10)")
cb[2]["rules"] = cb[2]["rules"] + ["press / arm volume stays reduced but never zero (ATH-04)", "bilateral share 20% or less (UNI-10)"]
SEASON_FAMILIES["strength"]["phases"][1]["rules"].append("PER-09 confirmed: the %-template (OLY 75 -> 80 -> 85 -> 90% with 4x8 -> 4x6 -> 4x6 -> 4x4; 4 TRACKS % / RPE / sets / reps rows) is the default for strength-focused plans")
SEASON_FAMILIES["strength"]["phases"].append({"phase": "bilateral_share", "evidence": "COACH-ANSWER UNI-02 / CAT-13", "rules": ["start about 50/50 with contra/ipsi health accessories in weeks 1-4, end 90/10 bilateral; unilateral accessory kept later only if something bugs the lifter"]})
ph = SEASON_FAMILIES["physique"]["phases"]
ph[0]["rules"] = ["COACH-ANSWER PER-01: 8 weeks = first 4 weeks adapting, next 4 driving hard ('an 8-week program wants to modify you, so you have to start hard')",
                  "OBSERVED AESTHETICS-8 example: SETS 2,3,3,3,4,4,5 per exercise, REPS 12,10,8 waves, '1-2 RIR', WK8 'DELOAD WEEK'"]
ph[1]["rules"] = ["COACH-ANSWER PER-01 (preferred plan): 2-4 weeks acclimation, 4-6 weeks driving hard 'not all the way to the top', last weeks hardest; a repeated 12-week cycle starts one level higher (1 -> 10, then 2 -> 11)",
                  "OBSERVED AESTHETICS-12 example: SETS 3,3,3,4,4,4,3,4,4,4,4,5; WK7 'A WEEK LOWER'; WK9-12 supersets, '2 sets LEG PRESS MYO - 15-5-5-5-5-5'; A/B weeks rotate variants (A/B lead-lift weeks are optional, for variety seekers - PER-03)",
                  "bilateral share 50/50 -> 80/20 (adjustable to 90/10) across the block (UNI-02); contra/ipsi accessories mostly in weeks 1-4 (CAT-13)"]
ph[2]["rules"] = [ph[2]["rules"][0], "the 40-rep sets (2-3x40, 3x40) are not a default any more: optional AMRAP / CrossFit style only (COACH-ANSWER VOL-11); circuits stay as finishers after lifting (PRG-11)"]
ph[0]["evidence"] = "COACH-ANSWER PER-01 + OBSERVED AESTHETICS-8"
ph[1]["evidence"] = "COACH-ANSWER PER-01 / PER-03 / UNI-02 + OBSERVED AESTHETICS-12"
ph[2]["evidence"] = "OBSERVED FAT BURN + COACH-ANSWER VOL-11 / PRG-11"
ph.append({"phase": "4_6_week_maintenance", "evidence": "COACH-ANSWER PER-01", "rules": ["4-6-week plans are maintenance / transition blocks (vacation, travel, season change, moving) at about 50-70% of the usual volume"]})
SEASON_FAMILIES["general"]["phases"][0]["rules"] = ["COACH-ANSWER PER-01: 12-week plans preferred; repeated 12-week cycles start one level higher; an open-ended week-by-week mode that 'keeps me in line'; a yearly mode (quarter themes, holiday weeks = automatic maintenance - see 06_periodization v1)",
                                                    "4-6-week maintenance / transition blocks at 50-70% volume", "no seasons; tests chosen by checkbox at block start, or none (PER-07)"]
SEASON_FAMILIES["youth"]["phases"][2]["rules"] = ["progress toward the adult sport profile; barbell and Olympic lifts with technical competency - and SOME Olympic lifts from the floor are allowed earlier according to the program (COACH-ANSWER ATH-09)"]
SEASON_FAMILIES["youth"]["phases"][0]["rules"] = [r.replace("at FOUNDATIONAL levels only", "at FOUNDATIONAL levels; L1 Olympic variants (DB / KB snatch, hang pulls) - ATH-09 / ATH-10") for r in SEASON_FAMILIES["youth"]["phases"][0]["rules"]]

# ---------------------------------------------------------------------------- injury library (edits)
INJURY_LIBRARY = copy.deepcopy(V0.INJURY_LIBRARY)
IL = INJURY_LIBRARY
IL["PAIN_GENERAL"]["rules"] = ["COACH-ANSWER VOL-03: cut that muscle or pattern 30-50%, move it to machines or split grips, keep it moving - or drop the exercise altogether if it is too much",
                               "swap fixed-grip barbell/bar -> DB/KB/handles in the same pattern; swap bilateral -> unilateral in the same pattern (MASTER_MODEL athletic A6); keep the sets ideally, 'but you have to adjust accordingly' (UNI-08)",
                               "pain moves the bilateral : unilateral share (UNI-02)",
                               "'Felt a PAIN' -> swap within the category or lower the level (GEN-05 RIGHT); if twice in a slot: swap, then cut sets, then drop a library level (INFERRED order)"]
IL["SHOULDER_THROWER"]["source"] = IL["SHOULDER_THROWER"]["source"].replace("'fast banded assisted bench press' B2W5/B2W7 names no implement)", "'fast banded assisted bench press' B2W5/B2W7 names no implement; banded work is out of scope, EQ-12)")
IL["SHOULDER_THROWER"]["rules"][0] = IL["SHOULDER_THROWER"]["rules"][0] + "; pitchers: less overhead pressing, more arm care, rotational throws kept light (COACH-ANSWER ATH-08)"
IL["SHOULDER_STRIKER"]["evidence"] = "OBSERVED (boxer) + COACH-ANSWER ATH-04"
IL["SHOULDER_STRIKER"]["rules"] = ["when punching volume is high, bring HPUSH, VPULL and arm-isolation volume DOWN (PROPOSED: to about 30-50% of the base-phase sets) - never to zero (COACH-ANSWER ATH-04: 'don't completely cut it')",
                                   "keep HPULL (rows) and ISO_SIDE / ISO_REAR for scapular balance", "presses that remain = alternating DB / push press"]
IL["NECK"]["rules"] = ["add ISO_NECK 2x/week (isometric 4-way, then plate or manual eccentric; no bands - EQ-01) - NO library column exists: create one", "progress static -> dynamic like the core plane ladder"]
IL["GROIN_ADDUCTOR"]["rules"] = ["'Coppenhaggen Plank' (R47 / O165) 3x/week pre-season, 1-2x/week in-season", "adductor-integrated chops / Pallofs ('Hold object Adducted between knees'); banded adduction variants are out of scope (no bands, EQ-01 / EQ-07)",
                                 "frontal / transverse unilateral work (lateral lunges, cossacks, lateral step-ups) - UNI-12"]
IL["ACL_LANDING_CUTTING"]["sports"] = ["basketball", "soccer", "volleyball", "football", "handball", "youth", "any athlete with ACL history or poor landing control"]
IL["ACL_LANDING_CUTTING"]["source"] = "neuromuscular training (plyometrics + strength + proximal control) cuts non-contact ACL injury risk by about half (the trials were run in female athletes; the generator applies the rule by landing competency and injury history, never by sex - COACH-ANSWER ATH-09)"
IL["ACL_LANDING_CUTTING"]["rules"] = ["plyo method stage 1 first: 'STICK THE LANDING BILATERAL' -> 'UNILATERAL' -> weighted (OBSERVED ballistics tab; CAT-10)", "COD 'EASY TURN' -> 'MOD. TURN' -> 'HARD TURN' only after landing competency",
                                      "single-leg strength + hip abductor work every week", "athletes with an ACL history, a poor landing screen or a low training age: double the stage-1 landing block (INFERRED; replaces the v0 sex-based rule - ATH-09)"]
IL["BONE_STRESS"]["sports"] = ["distance runners", "youth", "athletes with low energy availability"]
IL["LOW_BACK_LOADING"]["rules"] = ["axial loading once a week: squat one day, leg press / belt squat the other; deadlifts count as axial (COACH-ANSWER PER-04)", "belt squat when the back was already loaded that week or is sore (EQ-11)",
                                   "rotate hinge variants (hex/DB/KB) when flagged", "box squats ('(D)BOX') to control depth", "core = static anti-extension/anti-flexion first"]
IL["GROWTH_APOPHYSIS"]["rules"] = ["reduce high-amplitude plyos and depth drops during growth spurts (INFERRED caps)", "no maximal loading; foundational lists, with some Olympic lifts from the floor allowed by program (COACH-ANSWER ATH-09)"]
IL["DECONDITIONED_JOINTS"]["rules"] = ["no plyos beyond low-amplitude until body mass and landing control allow", "constrained machines / supported variants first (constraint 4-5), free weights later (EQ-03 / EQ-13)"]
IL["FALLS_BONE_DENSITY"]["rules"] = ["few plyos unless the client asks (COACH-ANSWER ATH-09)", "compounds and isolation on constrained machines / cables; never overhead squat, snatch, low-bar squat or depth jumps (COACH-ANSWER EQ-03)",
                                     "power work at 40-60% 1RM moved explosively (SCIENCE)", "balance + sit-to-stand + step-ups every session; 2-3 sets per major muscle group, 2-3 days/week (SCIENCE)"]
IL["HIGH_VOLUME_CONSTRAINT"] = {"evidence": "COACH-ANSWER EQ-03 / EQ-04", "sports": ["aesthetics high-volume tracks", "older clients", "injured clients"],
                                "source": "'If they're old, they're injured, or they have a lot of high volume, I'd rather they collect that volume in a safe place with more constraints'",
                                "rules": ["compounds and isolation lean to constrained machines (hack squat / leg press more constrained than Smith; belt squat avoids axial load - no machine ranking, brands differ, EQ-11)",
                                          "never overhead squat, snatch, low-bar squat or depth jumps", "the client's preference picks between equivalent alternatives (EQ-10)"]}

# ---------------------------------------------------------------------------- per-profile v1 parameters
ATHLETIC = {"baseball_position", "boxing", "basketball", "volleyball", "football_skill", "football_big_skill", "football_lineman", "soccer", "softball", "hockey",
            "tennis", "golf", "track_sprinter", "distance_runner", "kickboxing_muay_thai", "karate_taekwondo", "mma", "wrestling", "bjj_grappling", "youth_athlete", "weekend_warrior"}

# plyo_wk = fast-SSC high-amplitude PLYOMETRIC contacts / week (the ATH-02-ranked dial); low_wk = low-amplitude; throws = (tier, range) per ATH-05;
# bu = bilateral % of lower compound sets at block start / block end / in season (100 - bu = unilateral %); ft = % of unilateral lower sets in
# frontal / transverse planes (UNI-12); aer = aerobic sessions per week (off-season colour mix; in-season count); te = Olympic sets/week (ATH-10).
V1P = {
 "baseball_position": dict(gct=4, ath03="rotational_power", rank=7, plyo_wk=[35, 60], te=8, bu=(50, 40, 20), ft=35, leg_days=4, core_ex=2, rear=6,
        aer={"A": 1, "C": 1, "in": 2, "note": "OBSERVED buy-outs (A, 10-39 s finishers) stay on top as finishers; sessions PROPOSED"},
        contra="both directions for rotation: contralateral lead-leg work INTO the hip, ipsilateral out of the hip (OBSERVED 'IPSILATERAL loading' lateral step-ups); INFERRED",
        insea="strength maintenance + short accelerations / base-running sprints (PER-08); minimal bilateral (UNI-10)"),
 "boxing": dict(gct=5, ath03="combat", rank=10, plyo_wk=[15, 30], te=9, bu=(40, 30, 20), ft=40, leg_days=4, core_ex=2, rear=4,
        aer={"A": 1, "B": 1, "C": 1, "in": 2, "note": "OBSERVED A 'Sprint 20/ Recover 40' + C 20-40 min; ORD-09: the opening cardio is a real aerobic block; off-season 3 PROPOSED"},
        contra="contralateral for getting into the hip in stance (INFERRED from CAT-13 COD logic); 'Db contralateral LOW step up' is written in the boxing tab (OBSERVED)",
        insea="fight camp: strength maintenance at low volume, conditioning peaks (INFERRED; PER-08 'strength maintenance' for non-speed athletes)",
        extra={"HPUSH": 3, "VPULL": 3, "ISO_BICEP": 2, "ISO_TRICEP": 2}),
 "crossfit_competitor": dict(gct=None, ath03="size_strength", rank=None, plyo_wk=None, te=None, bu=(50, 70, 60), ft=10, leg_days=2, core_ex=1, rear=4,
        aer={"note": "OBSERVED by level: 2 / 2 / 3 / 4 aerobic sessions + 1-4 WODs"}, contra="health accessory (CAT-13 size/strength logic, INFERRED for CrossFit)",
        insea="competition season = the macro's TEST / PEAK month (OBSERVED)"),
 "hybrid": dict(gct=None, ath03="health", rank=None, plyo_wk=None, te=None, bu=None, ft=10, leg_days=3, core_ex=None, rear=4,
        aer={"note": "OBSERVED A 1 (Tue sprint intervals) + C 1 (Fri '15-40 min' easy = a real aerobic block, ORD-09)"}, contra="-", insea="-"),
 "powerlifting_strength": dict(gct=None, ath03="size_strength", rank=None, plyo_wk=None, te=None, bu=(50, 90, 90), ft=5, leg_days=2, core_ex=1, rear=4,
        aer={"C": 2, "note": "not covered by ATH-07: PROPOSED 2 colour-C sessions for work capacity"},
        contra="contra / ipsi lunges and step-ups as health accessories in weeks 1-4, then bilateral; kept later only if something bugs the lifter (COACH-ANSWER CAT-13)", insea="meet peak (INFERRED)"),
 "bodybuilding_aesthetics": dict(gct=None, ath03="size_strength", rank=None, plyo_wk=None, te=None, bu=(50, 80, 80), ft=10, leg_days=4, core_ex=1, rear=4,
        aer={"A": 1, "B": 1, "C": 2, "walks": True, "note": "COACH-ANSWER ATH-07: 4 sessions + long walks after workouts; colour split PROPOSED (the cheat sheet's one-of-each rule assumes 3)"},
        contra="contra / ipsi accessories mostly in the first 2-4 weeks, then mostly bilateral (COACH-ANSWER CAT-13); same-pattern pairing (squat + lunge) to drive the muscle (UNI-06)", insea="-"),
 "fat_loss": dict(gct=None, ath03="health", rank=None, plyo_wk=None, te=None, bu=(50, 50, 50), ft=20, leg_days=2, core_ex=None, rear=4,
        aer={"A": 1, "B": 1, "C": 1, "note": "COACH-ANSWER ATH-07: 3 sessions; circuits stay as finishers after lifting (PRG-11)"},
        contra="cross-pattern pairing so clients are less sore and can train more often (COACH-ANSWER UNI-06)", insea="-"),
 "basketball": dict(gct=3, ath03="speed_power", rank=1, plyo_wk=[100, 140], low_wk=[80, 120], throws=("T2", [80, 120]), te=8, bu=(20, 10, 10), ft=45, leg_days=4, core_ex=2, rear=4,
        aer={"A": 1.5, "B": 1, "C": 0.5, "in": 2}, contra="contralateral 'a lot' for getting into and out of the hip (COACH-ANSWER CAT-13)",
        insea="guards: sprint exposures; bigs: high jumps at low volume; everyone: strength maintenance (PER-08)"),
 "volleyball": dict(gct=2, ath03="speed_power", rank=1, plyo_wk=[100, 140], throws=("T2", [60, 100]), te=8, bu=(40, 30, 20), ft=30, leg_days=4, core_ex=2, rear=6,
        aer={"A": 2, "B": 0.5, "C": 0.5, "in": 2}, contra="contralateral for lateral block footwork (INFERRED from CAT-13)", insea="high jumps at low volume + strength maintenance (PER-08); count match jumps first"),
 "football_skill": dict(gct=2, ath03="speed_power", rank=3, plyo_wk=[80, 110], throws=("T2", [60, 100]), te=8, bu=(20, 10, 10), ft=40, leg_days=4, core_ex=2, rear=4,
        aer={"A": 2, "B": 0.5, "C": 0.5, "in": 2}, contra="contralateral for route cuts (COACH-ANSWER CAT-13: 'football players ... running and changing directions, routes'); ipsilateral step-ups for acceleration (CAT-13)",
        insea="sprints (speed athletes, PER-08) + strength maintenance"),
 "football_big_skill": dict(gct=3, ath03="speed_power", rank=None, plyo_wk=[60, 90], throws=("T2", [70, 110]), te=10, bu=(30, 20, 10), ft=35, leg_days=4, core_ex=2, rear=4,
        aer={"A": 2, "B": 0.5, "C": 0.5, "in": 2}, contra="contralateral for COD (CAT-13), ipsilateral for acceleration", insea="strength maintenance + short accelerations (PER-08)"),
 "football_lineman": dict(gct=4, ath03="resistance", rank=None, plyo_wk=[20, 40], low_wk=[0, 40], throws=("T2", [80, 120]), te=10, bu=(50, 40, 30), ft=30, leg_days=4, core_ex=2, rear=4,
        aer={"A": 2, "B": 0.5, "C": 0.5, "in": 2}, contra="health accessory (INFERRED)", insea="strength maintenance (PER-08)"),
 "soccer": dict(gct=2, ath03="speed_power", rank=4, plyo_wk=[70, 95], throws=("T1", [20, 40]), te=4, bu=(20, 10, 10), ft=45, leg_days=4, core_ex=2, rear=4,
        aer={"A": 1, "B": 1.5, "C": 1, "in": 2}, contra="contralateral (COACH-ANSWER CAT-13 names soccer); ipsilateral for acceleration", insea="sprints (max velocity weekly, hamstring protection) + strength maintenance (PER-08)"),
 "softball": dict(gct=4, ath03="rotational_power", rank=None, plyo_wk=[35, 60], throws=("T3", [160, 200]), te=4, bu=(50, 40, 20), ft=35, leg_days=4, core_ex=2, rear=6,
        aer={"A": 1, "C": 1, "in": 2}, contra="as baseball (INFERRED)", insea="strength maintenance + accelerations (PER-08)"),
 "hockey": dict(gct=4, ath03="speed_power", rank=8, plyo_wk=[25, 45], throws=("T2", [70, 100]), te=8, bu=(20, 10, 10), ft=50, leg_days=4, core_ex=2, rear=4,
        aer={"A": 1, "B": 1, "C": 0.5, "LC": 1, "in": 2}, contra="contralateral for crossovers and lateral pushes (INFERRED from CAT-13)", insea="strength maintenance (PER-08)"),
 "tennis": dict(gct=3, ath03="rotational_power", rank=6, plyo_wk=[45, 70], throws=("T3", [150, 200]), te=4, bu=(20, 10, 10), ft=50, leg_days=4, core_ex=2, rear=6,
        aer={"A": 1.5, "B": 1, "C": 0.5, "in": 2}, contra="contralateral 'definitely' (COACH-ANSWER CAT-13)", insea="strength maintenance; tournament weeks = 1-2 short sessions (INFERRED)"),
 "golf": dict(gct=5, ath03="rotational_power", rank=11, plyo_wk=[0, 15], throws=("T3", [150, 200]), te=4, bu=(30, 20, 20), ft=40, leg_days=3, core_ex=2, rear=4,
        aer={"B": 1, "C": 2, "in": 2}, contra="into / out of the hip loaded lunges and step-ups ('GET INTO THE HIP' / 'GET OUT OF THE HIP'), lead leg into, trail leg out (INFERRED)", insea="strength maintenance; none the day before a round"),
 "track_sprinter": dict(gct=1, ath03="speed_power", rank=2, plyo_wk=[90, 120], throws=("T1", [40, 60]), te=10, bu=(40, 30, 20), ft=10, leg_days=4, core_ex=2, rear=4,
        aer={"A": 1, "C": 1, "in": 2}, contra="ipsilateral step-ups for the acceleration take-off ('get out of the hip', COACH-ANSWER CAT-13)", insea="sprints (COACH-ANSWER PER-08); jumpers: high jumps"),
 "distance_runner": dict(gct=1, ath03="health", rank=None, plyo_wk=[10, 25], te=2, bu=(20, 20, 10), ft=15, leg_days=3, core_ex=2, rear=4,
        aer={"note": "the running plan is the aerobic work (OBSERVED Sheet24: 2 runs/week; PROPOSED 3rd easy session)", "in": "run plan"},
        contra="ipsilateral step-ups for push-off (INFERRED)", insea="race season: strength 1x/week maintenance (INFERRED)"),
 "kickboxing_muay_thai": dict(gct=5, ath03="combat", rank=None, plyo_wk=[20, 40], low_wk=[80, 120], throws=("T3", [220, 260]), te=6, bu=(30, 20, 20), ft=45, leg_days=4, core_ex=2, rear=4,
        aer={"A": 1, "B": 1, "C": 1, "LC": 0.5, "in": 2}, contra="contralateral (INFERRED from CAT-13)", insea="fight camp strength maintenance (PER-08)"),
 "karate_taekwondo": dict(gct=5, ath03="combat", rank=10, plyo_wk=[15, 30], low_wk=[80, 120], throws=("T3", [180, 220]), te=4, bu=(30, 20, 20), ft=45, leg_days=4, core_ex=2, rear=4,
        aer={"A": 1.5, "B": 1, "C": 1, "in": 2}, contra="contralateral (INFERRED)", insea="strength maintenance (PER-08)"),
 "mma": dict(gct=4, ath03="combat", rank=5, plyo_wk=[55, 80], throws=("T3", [150, 200]), te=9, bu=(40, 30, 20), ft=45, leg_days=4, core_ex=2, rear=4,
        aer={"A": 1, "B": 1, "C": 1, "LC": 1, "in": 2}, contra="contralateral for level changes and sprawls (INFERRED from CAT-13)", insea="fight camp strength maintenance (PER-08)"),
 "wrestling": dict(gct=5, ath03="resistance", rank=9, plyo_wk=[20, 40], throws=("T3", [150, 200]), te=8, bu=(50, 40, 30), ft=35, leg_days=4, core_ex=2, rear=4,
        aer={"A": 1, "B": 1, "C": 1, "LC": 1, "in": 2}, contra="health accessory (INFERRED)", insea="strength maintenance (PER-08)"),
 "bjj_grappling": dict(gct=5, ath03="combat", rank=9, plyo_wk=[20, 35], throws=("T2", [80, 120]), te=4, bu=(50, 40, 30), ft=30, leg_days=3, core_ex=2, rear=4,
        aer={"A": 0.5, "B": 1.5, "C": 1, "in": 2}, contra="health accessory (INFERRED)", insea="strength maintenance (PER-08)"),
 "general_population": dict(gct=5, gct_hidden=True, ath03="health", rank=None, plyo_wk=[0, 0], low_wk=[0, 20], throws=("T1", [20, 40]), te=0, bu=(50, 50, 50), ft=20, leg_days=3, core_ex=1, rear=4,
        aer={"B": 1, "C": 2, "note": "COACH-ANSWER ATH-07: 3 sessions"}, contra="cross-pattern pairing, less soreness (UNI-06); contralateral lunges as the default variant (INFERRED)", insea="-"),
 "youth_athlete": dict(gct=3, ath03="health", rank=None, plyo_wk=[30, 60], te=4, bu=(50, 50, 40), ft=30, leg_days=3, core_ex=2, rear=2,
        aer={"A": 1, "C": 1, "in": 2}, contra="both, light (INFERRED)", insea="sport season: 1-2 short sessions, strength maintenance (INFERRED)"),
 "weekend_warrior": dict(gct=3, ath03="health", rank=None, plyo_wk=[40, 70], low_wk=[20, 60], te=8, bu=(50, 40, 40), ft=30, leg_days=4, core_ex=2, rear=4,
        aer={"A": 1, "B": 1, "C": 1, "note": "COACH-ANSWER ATH-07 general rule (3); the observed template has 2 'Aerobic Capacity' slots"},
        contra="cross-pattern pairing (UNI-06); contra / ipsi variety (INFERRED)", insea="-"),
}


def mid(r):
    return (r[0] + r[1]) / 2.0


def r05(x):
    return round(x * 2) / 2.0


def v1_weekly_sets(p, prm, observed_power=None):
    """Return (weekly_sets_v1, adjustments[list of str]). observed_power = dict PLYO/JLK/BALL/THROW from the ground-contact re-count."""
    ws = {k: float(v) for k, v in (p.get("weekly_sets") or {}).items() if v}
    adj = []
    pid = p["id"]
    # --- power block
    if observed_power:
        for k in ("PLYO", "JLK", "BALL", "THROW"):
            ws[k] = observed_power.get(k, 0)
        adj.append("PLYO split into PLYO (plyometric + landings) / JLK (low amplitude) / BALL (ballistic jumps) from the OBSERVED re-count (COACH-ANSWER ATH-01)")
    elif prm.get("gct") and prm.get("plyo_wk") is not None:
        land = (p["plyo"].get("landing_pct") or 0) / 100.0
        plyo = r05(mid(prm["plyo_wk"]) / (8 * max(1 - land, 0.3))) if mid(prm["plyo_wk"]) else 0
        low = prm.get("low_wk") or p["plyo"].get("low_contacts_wk") or [0, 0]
        jlk = r05(mid(low) / 20.0)
        thr = prm.get("throws")
        throw = r05(mid(thr[1]) / 10.0) if thr else float(ws.get("THROW", 0))
        target = GCT_PLYO_PCT[prm["gct"]] / 100.0
        side = plyo + jlk
        ball = r05(max(side * (1 - target) / target - throw, 0)) if side else 0
        tot = side + ball + throw
        if tot and side / tot < GCT_FLOOR / 100.0:  # keep 'both end ranges' (ATH-01): raise low-amplitude first
            need = (GCT_FLOOR / 100.0) * (ball + throw) / (1 - GCT_FLOOR / 100.0)
            jlk = r05(jlk + max(need - side, 0) + 0.49)
        ws["PLYO"], ws["JLK"], ws["BALL"], ws["THROW"] = plyo, jlk, ball, throw
        adj.append(f"power block rebuilt: PLYO {plyo:g} / JLK {jlk:g} / BALL {ball:g} / THROW {throw:g} sets from the ATH-02-ranked plyometric target, the ATH-05 medball tier and the ground-contact class {prm['gct']} (target plyo share {GCT_PLYO_PCT[prm['gct']]}%, PROPOSED)")
    # --- Olympic lifts (ATH-10)
    if prm.get("te") is not None and pid in ATHLETIC:
        if ws.get("TE", 0) < prm["te"]:
            adj.append(f"TE {ws.get('TE', 0):g} -> {prm['te']} sets: every athlete in athletic training gets Olympic lifts (COACH-ANSWER ATH-10; dose PROPOSED)")
            ws["TE"] = float(prm["te"])
    # --- lower-body bilateral : unilateral (UNI-02 / UNI-10)
    if prm.get("bu"):
        b_start, b_end, _ = prm["bu"]
        bshare = (b_start + b_end) / 200.0
        bk, bh, uk, uh = (ws.get(k, 0) for k in ("BKD", "BHD", "UKD", "UHD"))
        L = bk + bh + uk + uh
        if L:
            bil, uni = bk + bh, uk + uh
            fk_b = bk / bil if bil else 0.5
            fk_u = uk / uni if uni else 0.5
            nb, nu = L * bshare, L * (1 - bshare)
            ws["BKD"], ws["BHD"] = r05(nb * fk_b), r05(nb * (1 - fk_b))
            ws["UKD"], ws["UHD"] = r05(nu * fk_u), r05(nu * (1 - fk_u))
            adj.append(f"lower compound sets re-split to {round(100 * bshare)}/{round(100 - 100 * bshare)} bilateral/unilateral (mid-block of {b_start}/{100 - b_start} -> {b_end}/{100 - b_end}; COACH-ANSWER UNI-02 anchors, sport values PROPOSED)")
    # --- profile-specific coach adjustments
    for k, v in (prm.get("extra") or {}).items():
        if ws.get(k, 0) < v:
            ws[k] = float(v)
    if prm.get("extra"):
        adj.append("pressing / pulling / arm isolation reduced, not cut: " + ", ".join(f"{k} {v}" for k, v in prm["extra"].items()) + " (COACH-ANSWER ATH-04; amounts PROPOSED, observed wk3-8 = 0)")
    # --- calves, rear delts, core (VOL-17, ATH-11)
    if prm.get("leg_days"):
        c = 3.0 * prm["leg_days"]
        if ws.get("ISO_CALF", 0) != c:
            adj.append(f"ISO_CALF {ws.get('ISO_CALF', 0):g} -> {c:g}: 3 sets every leg day (COACH-ANSWER VOL-17)")
            ws["ISO_CALF"] = c
    if prm.get("rear"):
        if ws.get("ISO_REAR", 0) < prm["rear"]:
            adj.append(f"ISO_REAR {ws.get('ISO_REAR', 0):g} -> {prm['rear']}: rear delts get their own sets (COACH-ANSWER VOL-17; dose PROPOSED)")
            ws["ISO_REAR"] = float(prm["rear"])
    if prm.get("core_ex"):
        c = 2.0 * prm["core_ex"] * p["days"].get("main", 4)
        if ws.get("CORE", 0) < c:
            adj.append(f"CORE {ws.get('CORE', 0):g} -> {c:g}: core first every session, {prm['core_ex']} exercise(s) x 2 sets (COACH-ANSWER ATH-11 placement, VOL-17 'about 2 core exercises' for athletes; non-athlete dose PROPOSED)")
            ws["CORE"] = c
    return {k: round(v, 1) for k, v in ws.items() if v}, adj


# ---------------------------------------------------------------------------- per-profile text edits
P = copy.deepcopy(V0.P)
BY = {p["id"]: p for p in P}

# rename: the 'JUSTICE LEAGUE' tab was a marketing name for a weekend-warrior program (COACH-ANSWER ATH-13)
ww = BY.pop("athlete_generic")
ww["id"] = "weekend_warrior"
ww["name"] = "All-around athletic / weekend warrior (non-competitive adults and youth)"
ww["group"] = "athletic - non-competitive"
ww["evidence"] = ("COACH-ANSWER ATH-13 (the program was 'for weekend warriors: people that wanted to be athletic, but they didn't need to compete ... a good mix of everything') + "
                  "OBSERVED slots (BYOP 'ATHLETIC - FULL BODY - 4 DAYS A') + the PARTIAL fill of the weekend-warrior tab (sheet tab name 'JUSTICE LEAGUE', a marketing name - ATH-13): "
                  "Monday's 10 slots and Tuesday's plyo slot at 2 sets, Thursday 'Low Bar Back Squat' with no sets, the other 38 of 50 weekly slots 'CHOOSE 👇' - '2 sets per slot' "
                  "is the coach's athletic-template default (VOL-16); MM 'EXAMPLE ATHLETIC FULL BODY SPLI' as level ladder")
ww["rationale"] = ("Non-competitive athletic adults (and youth, kids): 'good health all around and just having a body that performs well' (COACH-ANSWER ATH-13). "
                   "Also the fallback for a recreational player of any sport (GEN-02: recreational -> general sport only, no position / season). Competitive athletes whose sport has no profile use the "
                   "nearest sport profile by ground-contact class and ATH-03 group (PROPOSED).")
ww["confirm"] = []
ww["plyo"]["phases"] = "landings (stage 1, 'receive and pause') even for an athlete who power cleans (level per slot); mix = the 3 observed picks (2 depth drops + ankle hops); a wider mix is INFERRED"
ww["plyo"]["tracks"] = ["PLYOS", "JUMPING ANKLE"]
ww["plyo"]["landing_pct"] = 30  # generator default (PROPOSED); the 3 observed picks are 67% landings
ww["plyo"]["observed"] = "6 plyo slots x 2 sets x '6 to 8 Reps' (estimate); weekend-warrior tab Mon = 'Medium Depth Drop' + 'Ankle Hops ', Tue = 'SL Depth Drops'"
ww["triple_ext"]["ceiling"] = "'Power Clean' 2 x '6 to 8 Reps' (weekend-warrior tab); L1 clients get DB / KB snatches and hang pulls (ATH-10)"
ww["resistance"]["pairing"] = "knee + pull (Mon/Thu) / hip + push (Tue/Fri) (OBSERVED; COACH-ANSWER UNI-11 / ORD-06); cross-pattern pairing for less soreness (UNI-06)"
ww["resistance"]["priorities"] = ["vary the second weekly exposure (Front Squats Mon -> Low Bar Back Squat Thu, OBSERVED; PER-04 confirmed: a different exercise, and squat only once a week - the other day leg press / belt squat)"]
ww["conditioning"] = {"A": 1, "B": 1, "C": 1, "LC": 0, "sessions_wk": 3, "formats": ["'Aerobic Capacity' Wed/Sat from the CARDIO list (B7:B122: speed intervals, distance intervals, tests) - OBSERVED 2 slots", "MM: 'WEDNESDAYS & SATURDAYS max 40 min of steady'"], "evidence": "OBSERVED slots + COACH-ANSWER ATH-07 (3 for general clients)"}
ww["variants"] = [{"id": "mm_athletic_starting", "name": "MM athletic STARTING (off-season block 1)", "evidence": "OBSERVED", "notes": ["3 days, 89 working sets, 146 jump contacts (94 plyometric by the v1 re-count), 210 throws (ASSUMED: the cell says only 'ALL LIST'; 210 = the 19-throw ballistics 'MEDBALL CHEAT SHEET', 17 x 10 + 2 x 20), resistance 44 sets; plyo share of power sets 33%"]},
                  {"id": "mm_athletic_mid", "name": "MM athletic MID", "evidence": "OBSERVED", "notes": ["4 days, 72 sets, 71 jump + 120 low-amplitude contacts, 400 throws (10 rotational x 2x10 twice); plyo share 8% (throw-dominant)"]},
                  {"id": "mm_athletic_advanced", "name": "MM athletic ADVANCED", "evidence": "OBSERVED", "notes": ["4 days, 59 sets, 32 jump + 100 low, 420 throws (ASSUMED: 2 x 'ALL LIST' = 2 x 210), resistance 24, 'DEADLIFTS (1RIR)' 3x1; plyo share 9%", "PRG-04: STARTING / MID / ADVANCED are back-to-back blocks OR levels - 'depends on whatever is needed'"]}]
BY = {p["id"]: p for p in P}  # ww was renamed in place (same dict object inside P)

b = BY["baseball_position"]
b["evidence"] += "; v1: COACH-ANSWER PRG-09 (high school = college = pro), ATH-08 (pitchers), ATH-10 (Olympic lifts standard)"
b["template"] = ("MM BASEBALL 4-day Parts A-E, v1 order: CORE FIRST (warm-up, movable - ATH-11; the sheet puts it in Part B) -> Part A ballistics -> Olympic lifts (STANDARD, not optional - ATH-10) -> "
                 "Part C bilateral + upper compound superset -> Part D unilateral + 2 isolation tri-set -> Part E 'Buy out'")
b["rationale"] = ("The only fully-written athlete year in the workbook (24 week-grids). Template for rotational / overhead sports. High school, college and pro players get the same plan; "
                  "loads and speeds change per athlete, pros get more care, college players adapt as much as they can, high school players 'just have to do a lot of work' (COACH-ANSWER PRG-09). Thursday = strength (PRG-09).")
b["confirm"] = ["Catcher variant is INFERRED (not asked).", "The observed year keeps about 55/45 bilateral/unilateral even in-season; v1 applies the coach's rule (minimal bilateral in-season, UNI-10) - confirm for baseball."]
b["season_overrides"] = {"in_season": "OBSERVED in Block 3 (season reading INFERRED from dates): same 4 days, Part C 4 x 10 (4 x 8 in wk1-2), no OLY, '1x 30 Sec Fast Run' / cal-sprint buy-outs; v1 generator: about 2 lifting days, strength maintenance + accelerations (PER-08), bilateral share 20% (UNI-10), 2 aerobic sessions (ATH-07)"}
b["variants"][0]["evidence"] = "COACH-ANSWER ATH-08 (RIGHT: pitchers get less overhead pressing, more arm care, rotational throws kept light); calendar row 16 'PITCHERS/CATCHERS' vs 'POSITIONS' (OBSERVED)"
b["variants"][0]["weekly_sets_delta"] = {"VPUSH": -3, "VPULL": -1, "ISO_REAR": 3, "ISO_GRIP": 3, "THROW": -4, "COD": -2, "SPRINT": -2}
b["variants"][0]["notes"] = ["less overhead pressing (ATH-08)", "arm care block (posterior cuff, scapular, forearm) every week, not only in recovery weeks (ATH-08)", "rotational medball kept LIGHT; overhead slams / plyo push-ups off on bullpen and start days (ATH-08 + INFERRED)", "lead-leg eccentric single-leg work (FFE lunges, lateral step-ups)", "starters: 1 colour-C flush the day after a start (INFERRED)"]
b["resistance"]["pairing"] = "'bkd' + 'uhd', 'bhd' + 'ukd' (OBSERVED cross-pattern); pull with knee days, push with hip days (OBSERVED; COACH-ANSWER UNI-11)"

x = BY["boxing"]
x["evidence"] += "; v1: COACH-ANSWER ATH-04 (reduce, not cut, pressing / arm volume), ORD-09 (real aerobic block), ATH-01 / ATH-02 (more ballistics; boxing near the bottom of the plyo ranking)"
x["rationale"] = ("Coach's only fighter program; defines the striker template (base -> conversion), the medball dose and the striker pressing rule. v1: the generator keeps some pressing, pulling and arm work "
                  "when punching volume is high (ATH-04); the build-up's fast-reactive plyometric contacts (31/week) sit at the top of the boxing range, its other jump contacts are ballistic jumps and landings (v1 re-count).")
x["confirm"] = []
x["resistance"]["avoid"] = ["heavy pressing and arm volume when punching volume is high: REDUCE it (about 30-50% of base, PROPOSED), never cut it (COACH-ANSWER ATH-04; the boxing tab removed it in weeks 3-8 = OBSERVED)"]
x["resistance"]["push_pull"] = "OBSERVED wk3-8: 3 press sets (clean & press) : 3 row sets; v1 generator: HPUSH 3, VPUSH 3, HPULL 3, VPULL 3 + 2 + 2 arm sets (ATH-04)"
x["plyo"]["phases"] = "landings (weighted depth drops x8, stage 1) -> single-leg march jumps / DB squat jumps / broad jumps (ballistic) -> reactive squirrel jumps, 4 hops, tuck jumps, rope (plyometric); the observed 'REVERSE BANDED' squirrel jumps are written unbanded by the generator (no bands, EQ-01)"
x["plyo"]["tracks"] = ["PLYOS (landings)", "FULL JUMPING (squirrel jumps = 'FASTEST SSC')", "jump rope"]
x["conditioning"]["evidence"] = "OBSERVED + COACH-ANSWER ORD-09 (the opening cardio on Tue/Fri is a real aerobic block)"
x["resistance"]["pairing"] = x["resistance"]["pairing"].replace("heavy -> jump -> loaded jump -> banded jump pattern)", "heavy -> jump -> loaded jump -> banded jump pattern; the banded jump is out of scope - no variable resistance, EQ-12 - so the generator ends on a bodyweight jump)")
x["plyo"]["notes"] = x["plyo"]["notes"].replace("'Fewer plyos' for boxers shows up as type (ankle/reactive, single-leg) and packaging, not as a lower count than the generic athlete example.",
    "v1 ground-contact re-count: of the 113-129 weekly jump contacts only 31 are fast-reactive (tuck jumps, drop into box jumps); the rest are ballistic jumps (66: march jumps, DB squat jumps, broad jumps) and landings (24) - 'more ballistics' for a fighter (COACH-ANSWER ATH-01), and boxing near the bottom of the plyo ranking (ATH-02).")
x["season_overrides"] = {"camp": "INFERRED: PLYO x0.6, rope kept, throws ~230, lifting 2-3 days, pressing still reduced not cut (ATH-04)", "note": "observed wk7 mini-deload, wk8 peak; steps and waves for fight prep (PER-10)"}

c = BY["crossfit_competitor"]
c["confirm"] = ["Number of WODs at 'LVL 4 = wods a week' (not asked)."]
c["triple_ext"]["ceiling"] = "'Squat Snatch' / 'Squat Clean & Jerk' (LIB-07 naming); POWER L1 3x3 -> L4 6x3"
c["rationale"] += " FULL TIME = competitor, HALF TIME = class member (COACH-ANSWER PRG-10). 40-rep / AMRAP sets belong here as an option (VOL-11)."

h = BY["hybrid"]
h["conditioning"]["evidence"] = "OBSERVED; the Friday '15-40 min constant cardo easy' is a real aerobic block (COACH-ANSWER ORD-09)"

pl = BY["powerlifting_strength"]
pl["resistance"]["priorities"] = ["box squats '(D)BOX' / '(T&G)BOX', deficit pulls (OBSERVED); the chained / banded pulls in the conjugate draft are out of scope - no variable resistance (COACH-ANSWER EQ-12)", "pulling every day"]
pl["resistance"]["pairing"] = "opposite-dominance accessory (squat M.E. -> snatch-grip DL, OBSERVED); unilateral contra / ipsi accessories mostly weeks 1-4 (CAT-13)"
pl["confirm"] = []
pl["conditioning"] = {"A": 0, "B": 0, "C": 2, "LC": 0, "formats": ["none written (OBSERVED)", "PROPOSED: 2 colour-C sessions (ATH-07 does not cover strength clients)"], "evidence": "OBSERVED absence; PROPOSED"}
pl["core"] = {"slots_wk": 4, "plane_pct": {"sagittal": 50, "frontal": 25, "transverse": 25}, "region": "both", "mode": "core first, 1 exercise per session (ATH-11; dose PROPOSED) - none written in the sheet (OBSERVED gap)"}

bb = BY["bodybuilding_aesthetics"]
bb["resistance"]["avoid"] = ["'V-SQUAT' (never - GEN-08)", "medball throwing in the main workout (warm-up only - COACH-ANSWER ATH-05)"]
bb["resistance"]["priorities"] = ["Focus 1 / Focus 2 slots can both hit the same priority muscle, 2-3 sets each, to bring it to its weekly target (COACH-ANSWER ORD-11); priority = +4-6 sets/week, cap about 25-30 (VOL-02)",
                                 "machines for SFR ('LEG PRESS' / 'PENDULUM' 'LOVE IT'); no machine ranking - hack squat / leg press more constrained, Smith less (EQ-11)", "calves first only when calves are the priority (ORD-04)"]
bb["resistance"]["pairing"] = "knee + pull / hip + push (OBSERVED; UNI-11); same-pattern pairing (squat + lunge) to drive the muscle harder (COACH-ANSWER UNI-06)"
bb["resistance"]["rep_zone"] = "compounds 8-15 (mean ~12), single-joint 20, calves 15, MYO last on machines / isolation (VOL-15); '1-2 RIR' (RIR primary, VOL-13); preference moves the compound rep range only (VOL-12)"
bb["resistance"]["priorities"].append("balance chest (6-8 sets/week in the observed templates) up to the weekly target - the V-taper bias is optional, per athlete (COACH-ANSWER VOL-18)")
bb["confirm"] = []
bb["conditioning"] = {"A": 1, "B": 1, "C": 2, "LC": 0, "walks": "long walks after workouts", "formats": ["COACH-ANSWER ATH-07: 4 aerobic sessions + long walks after workouts", "OBSERVED: BYOP 'Cardio' slot on the 2 'Optional' days; MM 4 TRACKS AESTHETICS-8: '30-40 mi slow/steady CARDIO' WEDNESDAY & SATURDAY; MM UL/PPL 'max 40 min of steady' Wed/Sat"], "evidence": "COACH-ANSWER ATH-07 (count); colour split PROPOSED"}
bb["core"] = {"slots_wk": 4, "plane_pct": {"sagittal": 50, "frontal": 25, "transverse": 25}, "region": "client choice", "mode": "core first as the warm-up (ATH-11), 1 exercise per session (dose PROPOSED); OBSERVED on the optional days"}
bb["variants"][0]["notes"].append("high-volume track: collect the volume on constrained machines (COACH-ANSWER EQ-03)")

f = BY["fat_loss"]
f["resistance"]["rep_zone"] = "compounds 15/12 -> 8-10; isolation 15 -> 20 (the observed 40-rep sets are retired as a default - optional AMRAP style only, COACH-ANSWER VOL-11)"
f["confirm"] = []
f["conditioning"] = {"A": 1, "B": 1, "C": 1, "LC": 0, "circuits_wk": 2, "formats": ["COACH-ANSWER ATH-07: 3 aerobic sessions (one of each colour, cheat-sheet rule)", "OBSERVED: Wed/Sat 30-40 min steady (C); 4-station circuits 3x30 s -> 5x50 s (12 -> 33 min work/week) as finishers after lifting (PRG-11)"], "evidence": "COACH-ANSWER ATH-07 + OBSERVED"}
f["variants"][0]["notes"] = ["AESTHETICS slots re-paired so each session is a complete full-body dose (knee + hip, push + pull); tab title 'BOOTCAMP - FULL BODY - 4 DAYS A WEEK'", "Tue/Fri wiring (hinge + vertical pull, lunge + horizontal push) was a mistake: hip-dominant + push, knee-dominant + pull (COACH-ANSWER ORD-06)", "cross-pattern pairing so clients are less sore (UNI-06)", "Wed/Sat Calves, Cardio, Core, Focus 1, Focus 2 (add-ons or separate days, ideally separate - ORD-10)"]
f["variants"][1]["notes"] = ["4, 5 or 6 sessions a week (COACH-ANSWER PRG-03)", "timed circuits: 3-5 rounds x 30-50 s per station, 5-7 stations, 35-45 min total (PRG-03)", "no SETS/REPS columns in the sheet (OBSERVED)"]

for pid in ("basketball", "volleyball", "football_skill", "mma"):
    BY[pid]["confirm"] = []
BY["football_skill"]["cod"]["notes"] = "route tree EASY -> MOD. -> HARD TURN for every athlete (COACH-ANSWER ATH-06); DBs: backpedal-break and reactive mirror"
BY["basketball"]["cod"]["notes"] = "defensive slides (library 'Shuffles' L13), closeouts, 5-10-5 (date-coerced cell L92 = 5/10/05, LIB-01); route-tree names tiered by turn angle (ATH-06); ~1,000 movement changes per game"
BY["basketball"]["throwing"]["notes"] = "moderate medball volume (COACH-ANSWER ATH-05): chest pass / overhead / step-forward throws; rotational for contact strength"
for pid in ("football_skill", "football_big_skill", "football_lineman"):
    BY[pid]["throwing"]["notes"] = "moderate medball volume (COACH-ANSWER ATH-05)" + ("; chest pass / squat-to-chest pass = punch/strike pattern" if pid == "football_lineman" else "")
BY["tennis"]["throwing"]["notes"] = "high medball volume (COACH-ANSWER ATH-05): forehand/backhand rotational scoops both sides + overhead (serve)"
BY["golf"]["throwing"]["notes"] = "high medball volume (COACH-ANSWER ATH-05): half-kneeling 2x2 matrix 'INTO THE LEFT LEG/HIP', 'OUT OF THE RIGHT LEG/HIP', 'OUT OF THE LEFT LEG/HIP', 'INTO THE RIGHT LEG/HIP' (ballistics D65-D68), step-back rotational chest pass"
BY["golf"]["triple_ext"]["ceiling"] = "L1 Olympic variants: jump shrug / hex-bar jump / DB snatch (ATH-10: everyone in athletic training)"
BY["mma"]["throwing"]["notes"] = "high medball volume (COACH-ANSWER ATH-05): rotational + overhead slams (ground-and-pound / takedown finish)"
BY["volleyball"]["rationale"] += " Coach confirms basketball = volleyball at the top of the plyo ranking (ATH-02)."

sb = BY["softball"]
sb["rationale"] = "Same rotational / overhead demands as baseball; landing work is set by landing competency and injury history, never by sex (COACH-ANSWER ATH-09)."
sb["plyo"]["phases"] = "landing block length set by landing competency / ACL history (ATH-09: no sex-based rules)"

ts = BY["track_sprinter"]
ts["rationale"] += " Speed / power group (COACH-ANSWER ATH-03): more plyos than ballistics, 'even though they will have ballistics' (ATH-01); ipsilateral step-ups for the take-off (CAT-13); sprints in season (PER-08)."
ts["variants"].append({"id": "track_thrower", "name": "Throwers (shot / discus / hammer / javelin)", "evidence": "COACH-ANSWER ATH-03 names throwers in the 'more resistance' group; deltas INFERRED",
                       "weekly_sets_delta": {"PLYO": -6, "SPRINT": -8, "THROW": 10, "BKD": 4, "BHD": 4, "HPUSH": 3},
                       "notes": ["resistance group: more bilateral strength and size", "event-specific throws are ballistics (heavier implements stay <= 20 lb for medballs, EQ-06)"]})

dr = BY["distance_runner"]
dr["confirm"] = []
dr["rationale"] += " PRG-12: the Chris Hinshaw half-marathon plan is used as-is, for the half marathon only. LIB-18: the cardio list's '21.6 mile run' is what the coach calls 'a marathon' - flag: a marathon is 26.2 mi (42.2 km)."

for pid in ("kickboxing_muay_thai", "karate_taekwondo"):
    BY[pid]["resistance"]["avoid"] = ["heavy horizontal pressing volume when striking volume is high: reduce, not cut (COACH-ANSWER ATH-04 rule extended to strikers - INFERRED)"]
BY["karate_taekwondo"]["rationale"] = ("Coach: 'the more time on the ground they have to have, like a karate athlete, the more ballistics and less plyos' (ATH-01) and boxing = karate near the bottom of the plyo ranking (ATH-02) "
                                     "-> long ground-contact class, plyometric P1, high throws. v1 lowers the v0 low-amplitude bounce target (200-260 -> 80-120): stance bounce is practised in the sport itself (INFERRED).")
BY["mma"]["rationale"] = "MMA above tennis and below soccer on plyos (COACH-ANSWER ATH-02); fighters get 'a lot more ballistics and plyos' (ATH-01); adds grappling pulling, grip, neck and horizontal (shot) power."
BY["wrestling"]["rationale"] += " 'More resistance' group (COACH-ANSWER ATH-03); wrestling / BJJ rank above boxing / karate on plyos (ATH-02)."

gp = BY["general_population"]
gp["evidence"] += "; v1: COACH-ANSWER ATH-07 (3 aerobic sessions), ATH-09 (older: few plyos unless asked), EQ-03 (constrained machines; never OHS / snatch / low-bar / depth jumps)"
gp["conditioning"] = {"A": 0, "B": 1, "C": 2, "LC": 0, "formats": ["C 2 x 20-40 min + B 1x (level 2+)"], "evidence": "COACH-ANSWER ATH-07 (count = 3); colours INFERRED"}
gp["variants"][0]["evidence"] = "COACH-ANSWER ATH-09 / EQ-03 + SCIENCE (NSCA older-adult position stand)"
gp["variants"][0]["notes"] = ["few plyos unless the client asks (ATH-09); no sex-based rules - age, foundation, goal and injuries decide (ATH-09)", "compounds and isolation on constrained machines / cables (EQ-03); machines filed MODERATE / ADVANCED are fine (EQ-04)",
                              "never overhead squat, snatch, low-bar squat or depth jumps (EQ-03)", "2-3 days/week, 2-3 sets per major muscle group, 8-10 exercises; power at 40-60% 1RM (30-60% if frail) - SCIENCE", "sit-to-stand, step-ups, balance every session (SCIENCE)",
                              "age threshold not given by the coach: PROPOSED 60+ or foundation / injury based"]

ya = BY["youth_athlete"]
ya["triple_ext"]["ceiling"] = "L1 Olympic variants (DB / KB snatch, hang pulls) and SOME lifts from the floor according to the program (COACH-ANSWER ATH-09 reverses the v0 'no Olympic lifts from the floor')"
ya["template"] = "BYOP ATHLETIC 4-day cut to 2-3 days, mostly FOUNDATIONAL library blocks (levels are still theoretical, CAT-05)"
ya["resistance"]["avoid"] = ["maximal loading", "depth jumps > ~30 cm circa-PHV (INFERRED heuristic)"]

for p in P:  # contrast is an L2+ off-season tool (COACH-ANSWER ATH-12)
    rs = p["resistance"]
    for key in ("rep_zone", "pairing"):
        if "contrast" in rs.get(key, "").lower() and "ATH-12" not in rs[key]:
            rs[key] += " (contrast / complexes: L2+ athletes, off-season only, ~78-85% - ATH-12)"
fc[2]["rules"] = [r + " - L2+ athletes only (ATH-12)" if r.startswith("contrast and complexes") else r for r in fc[2]["rules"]]

# ---------------------------------------------------------------------------- changelog / pending / new questions
V1_CHANGELOG = [
    ("ATH-01 / CAT-10", "Plyo vs ballistic is decided by the sport's ground-contact time. New per-profile attribute `ground_contact` (class 1-5) and a derived plyo : ballistic split of power sets (PROPOSED map 75/60/50/40/25 % plyo, floor 20, ceiling 80); new BALL category (ballistic jumps) split out of PLYO; programs start ballistic and become more plyometric."),
    ("ATH-01 (observed re-count)", "The coach's written athletic work was re-classified by ground contact (v1_power_mix.py): BASEBALL blocks 36-44% plyo, BOXER weeks 3-6 30%, MM athletic 8-33% - these anchor the class map."),
    ("ATH-02", "Confirmed plyo ranking is now enforced by construction on a new PLYOMETRIC-contacts dial (fast-SSC, high amplitude): basketball = volleyball > sprinters > football skill > soccer > MMA > tennis > baseball > hockey > wrestling / BJJ > boxing = karate > golf. The v0 scale (all jump contacts) is kept as the NSCA safety check. Resolves v0 open questions 1-3."),
    ("ATH-03", "Resistance vs speed/power groups encoded per profile (`ath03_group`); rugby mapped to lineman / big-skill profiles, heavyweight fighters by body weight, track & field throwers added as a variant."),
    ("UNI-02 / UNI-03 / UNI-10", "Bilateral : unilateral share per profile on the 90/10 <-> 10/90 scale with block-start, block-end and in-season values (bodybuilders / powerlifters 50/50 -> 80/20-90/10; field / COD athletes 80-90% unilateral; in-season bilateral minimal); upper body follows the same logic; weekly set budgets re-split to the mid-block value."),
    ("CAT-13", "Contralateral (into the hip: COD sports - football, soccer, basketball, tennis) vs ipsilateral (out of the hip: sprint acceleration, ipsilateral step-ups); contra/ipsi as health accessories for bodybuilders / powerlifters mostly in weeks 1-4."),
    ("UNI-12", "Frontal / transverse share of unilateral lower sets per profile (high for basketball, tennis, soccer, MMA and other court / combat athletes; low for aesthetics)."),
    ("UNI-06 / UNI-11 / ORD-06", "Pairing: same-pattern for aesthetics and high-level athletes, cross-pattern for bootcamp / general; hip-dominant + push and knee-dominant + pull in full-body and bootcamp days (Bootcamp Option 1 Tue/Fri wiring corrected)."),
    ("ATH-04", "Boxers (and, by extension, strikers) REDUCE pressing, vertical pulling and arm isolation when punching volume is high - never cut to zero; SHOULDER_STRIKER rule and boxing budget changed (HPUSH 3, VPULL 3, arms 2 + 2)."),
    ("ATH-05 / EQ-06 / EQ-07 / LIB-22", "Medball volume by sport: high for baseball, boxing, MMA, tennis, golf; moderate for basketball and football; none in the main workout for aesthetics (warm-up only); ball never over 20 lb; no band chops; a throwing slot can be the whole ~19-throw list."),
    ("ATH-07 / ORD-09", "Aerobic sessions/week: 3 general and fat loss, 2 athletes in season, 4 aesthetics / bodybuilders + long walks after workouts; fighters get a real aerobic block; athlete off-season counts PROPOSED."),
    ("ATH-08", "Pitcher variant confirmed: less overhead pressing, more arm care, rotational throws kept light."),
    ("ATH-09 / GEN-02", "No sex-based logic anywhere (female-athlete landing rule, softball rationale and bone-stress list removed; v0 open question 14 answered): age, foundation, goal and injuries decide. Older clients: few plyos unless asked. Youth: some Olympic lifts from the floor."),
    ("ATH-10 / LIB-07 / LIB-13", "Everyone in athletic training gets Olympic lifts by level (L1 DB/KB snatch, hex-bar jumps, hang pulls/cleans; L2+ full 'Squat' lifts); Olympic dose raised where it was optional or zero (baseball 0.6 -> 8, golf, soccer, tennis, karate, BJJ, youth, distance runner)."),
    ("ATH-12", "Contrast / complexes: L2+ athletes, off-season only, ~78-85%, no rest inside the complex."),
    ("ATH-13 / FIX-03", "The 'Justice League' name is retired: the profile is now 'All-around athletic / weekend warrior (non-competitive adults and youth)' (`weekend_warrior`, was `athlete_generic`); the sheet tab is cited only as a source."),
    ("PER-08", "In-season content by athlete type: speed athletes -> sprints, most others -> strength maintenance, some -> high jumps; about 2 lifting days; minimal bilateral; 2 aerobic sessions."),
    ("PRG-09", "High school, college and pro baseball (and other) athletes share the same plan; loads and speeds differ; pros get more care. Competition level is a modifier, not a profile. Thursday = strength."),
    ("EQ-03 / EQ-04 / EQ-11", "Older, injured and high-volume clients collect volume on constrained machines (compounds and isolation); never overhead squat, snatch, low-bar squat, depth jumps; new HIGH_VOLUME_CONSTRAINT rule; hack squat no longer 'deprioritised' (machines are not ranked)."),
    ("EQ-01 / EQ-12", "No bands or variable resistance in any generator rule (banded neck, banded adduction, chained / banded pulls, 'reverse banded' squirrel jumps written unbanded)."),
    ("VOL-09 / UNI-01 / VOL-10", "Muscle credit map: helpers 0.25 (was 0.5); unilateral knee-dominant credits quads 1.0, glutes 0.25; athletic sets credit no muscle. Per-muscle table recomputed."),
    ("VOL-17 / ATH-11", "Calves 3 sets every leg day, rear delts their own sets, about 2 core exercises for athletes; core FIRST in every session (movable). Weekly budgets updated."),
    ("VOL-08 / VOL-16 / UNI-09", "Session caps and length per population added to the assembly rules (field athletes off-season up to 10-12 exercises; resistance-only 5-7; ~1.5 h athletes, 45-60 min general)."),
    ("PER-01 / PER-05 / PER-07 / PER-10 / PER-11", "Plan-length shapes rewritten: 4-6-week maintenance / transition at 50-70% volume, 8-week = 4 adapt + 4 drive, 12-week = 2-4 acclimation + 4-6 build + hardest last weeks, repeated cycles one level higher, week-by-week and yearly modes; deload ~half the sets; tests by checkbox; VOL 1/2/3 per block for all athletes."),
    ("ORD-08", "A-drills are warm-up, not volume: the MM UPPER/LOWER and PPL rows in section 2 now show 0% athletic share (A-drill sets moved out of the totals)."),
    ("ATH-06 / LIB-21", "Route-tree COD names are for every athlete, tiered by turn angle; MACH drills and the fixed speed-session order go into the library (resolves v0 questions 4-5 except reactive agility)."),
    ("VOL-11 / PRG-07 / UNI-04", "40-rep sets are an optional AMRAP / CrossFit style only; '12/10/8 -20' pyramid and '10/10' per-side meanings recorded; heavy low-rep unilateral work optional."),
    ("PRG-04 / PRG-05 / PRG-06", "STARTING / MID / ADVANCED can be blocks or levels as needed; levels L1-L3 defined by training experience in years; rep/set rises must follow one sound algorithm for every model."),
    ("PRG-10 / PRG-12 / LIB-18", "CrossFit FULL TIME = competitor, HALF TIME = class member; Chris Hinshaw plan used as-is for the half marathon only; the '21.6 mile run' is the coach's 'marathon' (flag: 26.2 mi)."),
]
V1_PENDING = [
    "Ground-contact class per sport and the class -> plyo-share map (75/60/50/40/25) are PROPOSED - need coach approval, especially basketball = 50/50 ('good mix'), karate / boxing 25/75 and distance runners.",
    "Per-sport bilateral : unilateral values for sports the coach did not name (baseball, softball, golf, sprinters, linemen, wrestlers, volleyball, combat) are PROPOSED.",
    "Athlete OFF-season aerobic sessions (ATH-07 only fixes in-season = 2) are PROPOSED at 2-4 by sport.",
    "Doses for rear delts (4-6 sets/week), core for non-athletes (1 exercise/session) and striker press reduction (30-50% of base) are PROPOSED.",
    "Plyo method stage timing per plan length is PROPOSED (the coach described the order, not the weeks).",
    "Older-adult age threshold (PROPOSED 60+) not given by the coach.",
    "Still open from v0 (not in the questionnaire): youth maturation input (Q15), neck library column (Q16, carries/drags confirmed by LIB-19), golf / tennis / hockey template choice (Q17), core plane rotation by day (Q12), lactate-clearance sports (Q13), position splits beyond pitchers (Q19), reactive-agility list (Q5), the hybrid 'AMRAP' row, CrossFit WOD count at level 4.",
    "Volume per muscle: the per-person 3/5/7% weekly rate, landmarks and set-addition order live in the volume engine (03 v1 / 12_volume_algorithm_v1); this file only carries the profile baselines.",
]
V1_NEW_QUESTIONS = [
    "Your sport ranking (ATH-02) puts boxing near the bottom, but your 8-week boxing build-up writes more total jump contacts (113-129/week) than your baseball off-season block (103). v1 reads the ranking as FAST-reactive plyometric contacts only (boxer 31/week vs baseball 37-74), with landings and loaded / single-effort jumps counted as ballistics. Is that how you rank sports?",
    "Do medball throws count on the BALLISTIC side of your plyo : ballistic split (as v1 encodes), or do you mean only loaded / single-effort jumps when you say 'ballistics'?",
    "Ground-contact classes and plyo share: basketball 'a good mix' = 50/50? Volleyball, soccer, football skill 60/40? Baseball, MMA, hockey 40/60? Boxing, karate, golf, grapplers 25/75? Sprinters 75/25?",
    "Calves 3 sets every leg day (VOL-17) gives 12 sets/week on a 4-day full-body athletic template, on top of ankle hops. Intended for athletes too, or only on 2 leg-focused days?",
    "Your observed baseball year runs about 55/45 bilateral/unilateral in every block, including in-season; your rule (UNI-10) says minimal bilateral in-season. For baseball, which wins - and what bilateral share do you want for linemen, wrestlers and sprinters?",
    "Athletes in the OFF-season: how many aerobic sessions a week (you gave 2 for in-season, 3 general, 4 aesthetics)?",
    "Olympic lifts in season: everyone in athletic training gets them (ATH-10), but the baseball in-season block has none. Keep them out in season, or keep light L1 variants?",
    "From what age do the older-client rules start (few plyos unless asked; machines; no snatch / OHS / low-bar / depth jumps)? And does 'few plyos unless they ask' still allow landing drills and low ankle hops?",
    "Rugby and track & field throwers are in your 'more resistance' group (ATH-03) but not in the sheets: map rugby to the lineman / big-skill profiles and throwers to a track variant (as v1 does), or build their own?",
    "Pros 'need a little bit more care because of contracts' (PRG-09): what should change in practice - slower weekly progression, more recovery checks, no max testing?",
]
